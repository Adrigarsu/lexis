#!/usr/bin/env node
/**
 * PreToolUse hook for Bash (layer 3 of the authorship rules, D-04 and D-138).
 *
 * Blocks, before the command runs:
 *  - any git/gh command whose text, or the message/body file it points to,
 *    carries a Claude signature (Co-Authored-By, "Generated with", session links);
 *  - changing the Git identity (git config user.name/email, --author, GIT_AUTHOR and GIT_COMMITTER variables);
 *  - force pushes, deleting remote branches and any push to main.
 * Asks for confirmation before `gh pr merge` (only with the developer's say-so).
 *
 * Exit code 2 blocks the call and shows stderr to Claude (Claude Code hooks API).
 */
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const SIGNATURE = /co-authored-by|generated with|noreply@anthropic\.com|claude-session|claude\.ai\/code|claude\.com\/claude-code/i;
const GIT_OR_GH = /\b(git|gh)\b/;
const MESSAGE_FILE_FLAGS = new Set(['-F', '--file', '--body-file', '-t', '--template']);
const PROTECTED_BRANCH = 'main';

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return {};
  }
}

function block(reason) {
  process.stderr.write(`Bloqueado por .claude/hooks/guard-git.mjs: ${reason}\n`);
  process.exit(2);
}

function ask(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
}

/** Split a shell command into rough tokens, keeping quoted strings together. */
function tokenize(command) {
  const tokens = [];
  const re = /"((?:[^"\\]|\\.)*)"|'([^']*)'|(\S+)/g;
  let match;
  while ((match = re.exec(command)) !== null) {
    tokens.push(match[1] ?? match[2] ?? match[3]);
  }
  return tokens;
}

function referencedFiles(tokens, cwd) {
  const files = [];
  tokens.forEach((token, i) => {
    let file = null;
    if (MESSAGE_FILE_FLAGS.has(token)) file = tokens[i + 1];
    const eq = /^--(?:file|body-file|template)=(.+)$/.exec(token);
    if (eq) file = eq[1];
    if (file && file !== '-') files.push(path.resolve(cwd, file));
  });
  return files;
}

function currentBranch(cwd) {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { cwd, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim();
  } catch {
    return '';
  }
}

const input = readStdin();
const command = String(input?.tool_input?.command ?? '');
const cwd = input?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();

if (!GIT_OR_GH.test(command)) process.exit(0);

// 1. Signatures in the command itself or in the message/body files it uses.
if (SIGNATURE.test(command)) {
  block('el comando lleva una firma o mención de Claude (Co-Authored-By, «Generated with», enlace de sesión). '
    + 'Quítala: todo sale solo a nombre de la desarrolladora (D-04).');
}
const tokens = tokenize(command);
for (const file of referencedFiles(tokens, cwd)) {
  if (existsSync(file) && SIGNATURE.test(readFileSync(file, 'utf8'))) {
    block(`el archivo de mensaje ${file} lleva una firma o mención de Claude. Quítala (D-04).`);
  }
}

// 2. Git identity must stay the developer's.
if (/\bgit\b[^|;&]*\bconfig\b[^|;&]*\buser\.(name|email)\s+\S/.test(command)
  || /\bgit\b.*\s-c\s+user\.(name|email)=/.test(command)
  || /--author[=\s]/.test(command)
  || /\bGIT_(AUTHOR|COMMITTER)_(NAME|EMAIL)=/.test(command)) {
  block('no se cambia la identidad de Git: los commits salen con la configuración de la desarrolladora.');
}

// 3. Pushes: never forced, never deleting, never to main.
for (const segment of command.split(/&&|\|\||;|\|/)) {
  const seg = segment.trim();
  if (!/^(?:\S+=\S+\s+)*git\s+push\b/.test(seg)) continue;
  const args = tokenize(seg).slice(2);
  if (args.some((a) => /^(-f|--force|--force-with-lease(=.*)?|--force-if-includes|--mirror|--delete|-d|--prune)$/.test(a))
    || args.some((a) => a.startsWith('+') || a.startsWith(':'))) {
    block('no se permiten push forzados ni borrar ramas remotas.');
  }
  const refs = args.filter((a) => !a.startsWith('-'));
  const targets = refs.slice(1).map((r) => r.split(':').pop().replace(/^refs\/heads\//, ''));
  if (targets.includes(PROTECTED_BRANCH)) {
    block(`no se sube nada directamente a ${PROTECTED_BRANCH}: usa una rama y una PR.`);
  }
  if (targets.length === 0 && currentBranch(cwd) === PROTECTED_BRANCH) {
    block(`estás en ${PROTECTED_BRANCH}: crea una rama antes de subir cambios.`);
  }
}

// 4. Merging a PR needs the developer's explicit go-ahead in this session.
if (/\bgh\s+pr\s+merge\b/.test(command)) {
  ask('Fusionar una PR solo con autorización expresa de la desarrolladora en esta sesión (D-138).');
}

process.exit(0);
