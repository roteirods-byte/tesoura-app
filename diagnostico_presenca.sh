#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-.}"
echo "# Diagnóstico Tesoura - Presença/Escalação"
echo "# Pasta: $ROOT"
echo
patterns=(
  'from\("presenca"\)'
  'from\("presencas"\)'
  'select\("apelido, *presente"\)'
  '\\bpresencas\\.presente\\b'
  '\\br\\.presente\\b'
  '\\bpresente\\b'
)
for p in "${patterns[@]}"; do
  echo "--- Procurando: $p"
  # -I ignora binários; -n mostra linha; -R recursivo
  grep -RInI --exclude-dir=.git -E "$p" "$ROOT" || true
  echo
 done

echo "# OK: se aparecer from(\"presenca\") ou select(...presente), isso é o erro."
