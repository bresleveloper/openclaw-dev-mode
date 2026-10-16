#!/bin/bash
# openclaw-dev-mode: one-shot VPS deploy of origin/main. No doctor. Automatic rollback.
#
# Run a COPY outside the repo (the pull rewrites this file), detached so a dropped SSH session
# cannot leave the gateway stopped halfway. From the build machine:
#   scp dev-mode/vps-deploy.sh dev-vps:/tmp/ && ssh dev-vps 'setsid nohup bash /tmp/vps-deploy.sh > /tmp/vps-deploy.log 2>&1 < /dev/null &'
#   ssh dev-vps 'timeout 570 tail -n +1 -f /tmp/vps-deploy.log | sed "/DEPLOY-END/q"'
#
# Steps: stop gateway -> pull main -> pnpm install + plugin dep links + self-ref link -> copy the
# state and agent DB files -> dev-mode/migrate-agent-dbs.mts (no-op unless the build bumps a
# schema) -> start -> wait for "gateway ready" + WhatsApp listener -> fork checks.
# A failed pull/install/migration, a failed or restarting gateway, or no "gateway ready" within
# 300 s rolls back: stop, restore the DB copies, previous commit, install, links, start.
# Last line is "DEPLOY-END ok" or "DEPLOY-END rollback". 10.4 (2026-10-16): WhatsApp down 68 s.
set -u
export XDG_RUNTIME_DIR=/run/user/$(id -u)
cd /opt/openclaw-dev-mode || exit 1
H=/root/.openclaw
OLD=$(git rev-parse HEAD)
BK=/root/openclaw-db-pre-deploy-$(date +%Y%m%d-%H%M%S)
LOG=/tmp/openclaw/openclaw-$(date +%F).log
say() { echo "[$(date +%T)] $*"; }
key() { echo "$1" | tr / _; }
DBS="$H/state/openclaw.sqlite $H/state/openclaw-quarantine.sqlite $(ls $H/agents/*/agent/openclaw-agent.sqlite 2>/dev/null | tr '\n' ' ')"
newlog() { { tail -n +$((N+1)) "$LOG" 2>/dev/null; journalctl --user -u openclaw-gateway --since "@$T0" --no-pager 2>/dev/null; }; }

restore_dbs() {
  [ -d "$BK" ] || return 0
  for f in $DBS; do
    [ -e "$BK/$(key "$f")" ] || continue
    for s in "" -wal -shm; do
      rm -f "$f$s"
      if [ -e "$BK/$(key "$f$s")" ]; then cp -a "$BK/$(key "$f$s")" "$f$s"; fi
    done
  done
  say "DB files restored from $BK"
}

rollback() {
  say "ROLLBACK: $1"
  systemctl --user stop openclaw-gateway
  restore_dbs
  git config core.symlinks false; git checkout -q -- . 2>/dev/null; git checkout -q -B main "$OLD"; git config --unset core.symlinks
  CI=true pnpm install --ignore-scripts > /tmp/pnpm-rollback.log 2>&1 || tail -5 /tmp/pnpm-rollback.log
  sh dev-mode/link-dist-plugin-deps.sh > /dev/null 2>&1
  ln -sfn /opt/openclaw-dev-mode node_modules/openclaw
  systemctl --user reset-failed openclaw-gateway 2>/dev/null
  systemctl --user start openclaw-gateway
  say "back on $(git log -1 --format='%h'), gateway $(systemctl --user is-active openclaw-gateway)"
  echo DEPLOY-END rollback
  exit 1
}

say "pre: $(git log -1 --format='%h %s' | cut -c1-70); disk free $(df -h /root | awk 'NR==2{print $4}')"
say "DBs: $DBS"
systemctl --user stop openclaw-gateway
say "gateway stopped: $(systemctl --user is-active openclaw-gateway)"

git config core.symlinks false; git checkout -q -- . 2>/dev/null
git pull -q --ff-only origin main 2>&1 | tail -3
git config --unset core.symlinks
rm -f /opt/openclaw-dev-mode/openclaw-dev-mode
[ "$(git rev-parse HEAD)" != "$OLD" ] || rollback "pull did not move HEAD"
say "pulled: $(git log -1 --format='%h %s' | cut -c1-70)"

CI=true pnpm install --ignore-scripts > /tmp/pnpm-install.log 2>&1 || { tail -8 /tmp/pnpm-install.log; rollback "pnpm install failed"; }
sh dev-mode/link-dist-plugin-deps.sh > /tmp/link-deps.log 2>&1 || { tail -5 /tmp/link-deps.log; rollback "link script failed"; }
ln -sfn /opt/openclaw-dev-mode node_modules/openclaw
say "deps installed: $(tail -1 /tmp/pnpm-install.log | cut -c1-80)"

mkdir -p "$BK"
for f in $DBS; do for s in "" -wal -shm; do if [ -e "$f$s" ]; then cp -a "$f$s" "$BK/$(key "$f$s")"; fi; done; done
say "DB copy: $(ls "$BK" | wc -l) files, $(du -sh "$BK" | cut -f1) in $BK"

say "migrating agent DBs"
timeout 900 node --import ./scripts/tsx.mjs dev-mode/migrate-agent-dbs.mts 2>&1 | tail -20
rc=${PIPESTATUS[0]}
[ "$rc" = 0 ] || rollback "migration script rc=$rc"

N=$(wc -l < "$LOG" 2>/dev/null || echo 0)
T0=$(date +%s)
systemctl --user reset-failed openclaw-gateway 2>/dev/null
systemctl --user start openclaw-gateway
R0=$(systemctl --user show openclaw-gateway -p NRestarts --value)
say "gateway started"
ready=""; wa=""
for i in $(seq 1 60); do
  sleep 5
  st=$(systemctl --user is-active openclaw-gateway)
  nr=$(systemctl --user show openclaw-gateway -p NRestarts --value)
  if [ "$st" = failed ] || [ "$st" = inactive ] || [ "$nr" != "$R0" ]; then
    newlog | grep -vE 'startup phase' | tail -15 | cut -c1-300
    rollback "gateway $st (restarts $R0 -> $nr)"
  fi
  [ -n "$ready" ] || { newlog | grep -q "gateway ready" && ready=1 && say "gateway ready"; }
  if newlog | grep -q "Listening for WhatsApp inbound"; then wa=1; say "WhatsApp listening"; break; fi
done
if [ -z "$ready" ]; then
  newlog | grep -vE 'startup phase' | tail -15 | cut -c1-300
  rollback "no 'gateway ready' after 300 s"
fi
[ -n "$wa" ] || say "WARN: gateway ready but no WhatsApp listener line yet (not rolling back)"

say "checks"
echo "version:   $(timeout 90 openclaw --version < /dev/null 2>/dev/null | head -1)"
echo "wa-history in dist: $(grep -rl attachWaHistoryLogger dist/extensions/whatsapp/ | wc -l)"
echo "sec-wa1 in dist:    $(grep -rl formatDevModeReasoningPayload dist/extensions/whatsapp/ | wc -l)"
echo "fix-09:    $(timeout 150 openclaw update --dry-run < /dev/null 2>&1 | grep -o 'openclaw-dev-mode FIX-09' | head -1)"
echo "plugins:   $(timeout 180 openclaw plugins list < /dev/null 2>&1 | grep -i whatsapp | head -2 | tr -s ' ' | cut -c1-200)"
node --no-warnings -e '
const { DatabaseSync } = require("node:sqlite");
for (const f of process.argv.slice(1)) { try { const db = new DatabaseSync(f, { readOnly: true });
  console.log("schema v" + db.prepare("PRAGMA user_version").get().user_version, f); db.close(); } catch (e) { console.log("ERR", f, e.message); } }' $DBS
newlog | grep -E 'gateway ready|Listening for WhatsApp|history logger|"level":(50|60)|\[error\]|ERROR' | tail -12 | cut -c1-260
ls -dt /root/openclaw-db-pre-deploy-* 2>/dev/null | tail -n +3 | xargs -r rm -rf
echo DEPLOY-END ok
