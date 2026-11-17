// Commit messages follow Conventional Commits with the types of
// docs/proceso/convenciones.md (ADR-019, D-153).

/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'test', 'refactor', 'docs', 'style', 'perf', 'build', 'ci', 'chore'],
    ],
  },
};

export default config;
