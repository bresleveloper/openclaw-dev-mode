import{l as normalizeOptionalString}from"./string-coerce-CpTFcSwY.mjs";import{n as ok,t as err}from"./result-CkiK_t2O.mjs";import{t as formatErrorMessage}from"./errors-CRXp6JVo.mjs";import{n as mergeProcessEnv}from"./process-env-BMQKxoSL.mjs";import{t as resolveServiceManagerEnv}from"./service-process-env-CqJdumJx.mjs";import{r as renderPosixRestartLogSetup}from"./restart-logs-C62uUCzk.mjs";import{n as resolveLaunchAgentLabel}from"./launchd-label-Daj1UmUS.mjs";import{h as resolveLaunchAgentGuiDomain}from"./launchd-runtime-CP9ikcyT.mjs";import{g as renderSystemLaunchDaemonOwnershipShellProbe}from"./launchd-service-files-C1LwG-1m.mjs";import"./launchd-plist-8fbqrS4x.mjs";import path from"node:path";import os from"node:os";import{spawn}from"node:child_process";
//!src/daemon/launchd-restart-handoff.ts
const RELOAD_BOOTOUT_WAIT_DELAY_SECONDS=1;const RELOAD_BOOTOUT_WAIT_COUNT=330+15;const RELOAD_BOOTSTRAP_RETRY_COUNT=15;function buildLaunchdRestartScript(e,t,n){const r=`service_target="$1"
domain="$2"
plist_path="$3"
wait_pid="$4"
${renderPosixRestartLogSetup(t)}
printf '[%s] openclaw restart attempt source=handoff mode=${e} target=%s pid=%s interactive=0\\n' "$(date -u +%FT%TZ)" "$service_target" "$wait_pid" >&2
if [ -n "$wait_pid" ] && [ "$wait_pid" -gt 1 ] 2>/dev/null; then
  while kill -0 "$wait_pid" >/dev/null 2>&1; do
    sleep 0.1
  done
fi
`;const i=`${renderSystemLaunchDaemonOwnershipShellProbe(n)}
if [ -n "$openclaw_system_launchd_conflict" ]; then
  printf '[%s] openclaw restart blocked source=handoff mode=${e} reason=%s interactive=0\n' "$(date -u +%FT%TZ)" "$openclaw_system_launchd_detail" >&2
  exit 78
fi
`;if(e===`park`)return`${r}
status=0
if launchctl bootout "$service_target"; then
  status=0
else
  status=$?
fi
if [ "$status" -eq 0 ]; then
  printf '[%s] openclaw service park done source=handoff interactive=0\\n' "$(date -u +%FT%TZ)" >&2
else
  printf '[%s] openclaw service park failed source=handoff status=%s interactive=0\\n' "$(date -u +%FT%TZ)" "$status" >&2
fi
exit "$status"
`;const a=`if [ "$status" -eq 0 ]; then
  printf '[%s] openclaw restart done source=handoff mode=${e} interactive=0\\n' "$(date -u +%FT%TZ)" >&2
else
  printf '[%s] openclaw restart failed source=handoff mode=${e} status=%s interactive=0\\n' "$(date -u +%FT%TZ)" "$status" >&2
fi
exit "$status"
`;if(e===`reload`)return`${r}
${i}
status=0
launchctl enable "$service_target"
launchctl bootout "$service_target" >/dev/null 2>&1 || true
${`bootout_wait_count="${RELOAD_BOOTOUT_WAIT_COUNT}"
while [ "$bootout_wait_count" -gt 0 ]; do
  if ! launchctl print "$service_target" >/dev/null 2>&1; then
    break
  fi
  bootout_wait_count=$((bootout_wait_count - 1))
  sleep ${RELOAD_BOOTOUT_WAIT_DELAY_SECONDS}
done
`}
${`bootstrap_retry_count="${RELOAD_BOOTSTRAP_RETRY_COUNT}"
while :; do
  if launchctl bootstrap "$domain" "$plist_path"; then
    status=0
    break
  else
    # Capture inside the else: after a completed if with a false condition,
    # $? is 0, which would let exhausted retries report a successful restart.
    status=$?
  fi
  if launchctl print "$service_target" >/dev/null 2>&1; then
    if launchctl kickstart -k "$service_target"; then
      status=0
      break
    else
      # The pending bootout can finish between print and kickstart. Keep
      # retrying bootstrap if that check-then-act race deregisters the label.
      status=$?
    fi
  fi
  bootstrap_retry_count=$((bootstrap_retry_count - 1))
  if [ "$bootstrap_retry_count" -le 0 ]; then
    break
  fi
  sleep ${RELOAD_BOOTOUT_WAIT_DELAY_SECONDS}
done
`}
${a}`;const o=e===`kickstart`?`kickstart -k`:`kickstart`;return`${r}
${i}
status=0
launchctl enable "$service_target"
if launchctl ${o} "$service_target"; then
  status=0
else
  status=$?
  if launchctl bootstrap "$domain" "$plist_path"; then
    status=0
  else
    launchctl ${o} "$service_target"
    status=$?
  fi
fi
${a}`}function scheduleDetachedLaunchdHandoff(e){const t=e.env??process.env;const n=resolveLaunchAgentGuiDomain();const r=resolveLaunchAgentLabel(t);const i=normalizeOptionalString(t.HOME)||os.homedir();const a=path.join(i,`Library`,`LaunchAgents`,`${r}.plist`);const o=typeof e.waitForPid===`number`&&Number.isFinite(e.waitForPid)?Math.floor(e.waitForPid):0;const s={...process.env,...e.env};const c=resolveServiceManagerEnv(mergeProcessEnv([process.env,e.env,{PATH:process.env.PATH}]));try{const t=spawn(`/bin/sh`,[`-c`,buildLaunchdRestartScript(e.mode,s,r),`openclaw-launchd-restart-handoff`,`${n}/${r}`,n,a,String(o)],{detached:true,stdio:`ignore`,env:c});const i=new Promise(e=>{t.once(`spawn`,()=>e(true));t.once(`error`,()=>e(false))});t.unref();return ok(i)}catch(e){return err(formatErrorMessage(e))}}function scheduleDetachedLaunchdRestartHandoff(e){return scheduleDetachedLaunchdHandoff(e)}function scheduleDetachedLaunchdMaintenancePark(e){return scheduleDetachedLaunchdHandoff({...e,mode:`park`})}export{scheduleDetachedLaunchdRestartHandoff as n,scheduleDetachedLaunchdMaintenancePark as t};