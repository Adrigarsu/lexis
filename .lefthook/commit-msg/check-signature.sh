#!/bin/sh
# Capa 4 de autoría (D-04, D-140): rechaza cualquier mensaje que lleve una firma
# o mención de Claude, venga de donde venga. Es la única lista de firmas para los
# mensajes (D-155): Lefthook la ejecuta en cada commit (lefthook.yml) y la skill
# preparar-pr la usa con los commits, el título y la descripción de la PR.
# Uso: sh .lefthook/commit-msg/check-signature.sh <archivo con el mensaje>

if grep -qiE 'co-authored-by|generated with|noreply@anthropic\.com|claude-session|claude\.ai/code|claude\.com/claude-code' "$1"; then
  echo "commit-msg: el mensaje lleva una firma o mención de Claude." >&2
  echo "Quítala: todos los commits salen solo a tu nombre (D-04)." >&2
  exit 1
fi
