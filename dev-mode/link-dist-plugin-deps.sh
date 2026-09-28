#!/usr/bin/env sh
# [dev-mode] Link each bundled plugin's pnpm dependencies next to its committed dist output.
#
# `pnpm build` (external-plugins:local-dist step) links dist/extensions/<id>/node_modules into
# the BUILD machine's pnpm store. Those links are machine-local, so they are never committed
# (see CLAUDE.md checklist item 4). The VPS runs from committed dist without building, so after
# every `pnpm install` it recreates one relative link per plugin to extensions/<id>/node_modules
# (the plugin's own pnpm-installed deps). Without it, plugins whose runtime deps are not bundled
# (acpx at v2026.9.6) fail with "required dependencies are missing".
#
# Safe to re-run: replaces existing links, never touches real directories.
set -eu
cd "$(dirname "$0")/.."
linked=0
for dir in dist/extensions/*/; do
  id=$(basename "$dir")
  src="extensions/$id/node_modules"
  dest="${dir}node_modules"
  [ -d "$src" ] || continue
  if [ -L "$dest" ]; then
    rm "$dest"
  elif [ -e "$dest" ]; then
    continue
  fi
  ln -s "../../../$src" "$dest"
  linked=$((linked + 1))
done
echo "dev-mode: linked $linked plugin node_modules dirs under dist/extensions"
