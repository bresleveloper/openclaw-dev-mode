import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as renderPosixRestartLogSetup } from "./restart-logs-6OI2aKFf.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-C6isS50W.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-CDVrpZuO.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { _ as renderSystemLaunchDaemonOwnershipShellProbe } from "./launchd-service-files-BNJoYP-S.mjs";
import "./launchd-plist-zSdg3_Ip.mjs";
import { g as resolveLaunchAgentGuiDomain } from "./launchd-runtime-DUenz_Po.mjs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
//#region src/daemon/launchd-restart-handoff.ts
/** Detached macOS launchd restart handoff for restarting from inside the service. */
const RELOAD_BOOTOUT_WAIT_DELAY_SECONDS = 1;
const RELOAD_BOOTOUT_WAIT_COUNT = 35;
const RELOAD_BOOTSTRAP_RETRY_COUNT = 15;
function resolveLaunchdRestartTarget(env = process.env) {
	const domain = resolveLaunchAgentGuiDomain();
	const label = resolveLaunchAgentLabel(env);
	const home = normalizeOptionalString(env.HOME) || os.homedir();
	return {
		domain,
		label,
		plistPath: path.join(home, "Library", "LaunchAgents", `${label}.plist`),
		serviceTarget: `${domain}/${label}`
	};
}
function buildLaunchdRestartScript(mode, restartLogEnv, label) {
	const preamble = `service_target="$1"
domain="$2"
plist_path="$3"
wait_pid="$4"
${renderPosixRestartLogSetup(restartLogEnv)}
printf '[%s] openclaw restart attempt source=handoff mode=${mode} target=%s pid=%s interactive=0\\n' "$(date -u +%FT%TZ)" "$service_target" "$wait_pid" >&2
if [ -n "$wait_pid" ] && [ "$wait_pid" -gt 1 ] 2>/dev/null; then
  while kill -0 "$wait_pid" >/dev/null 2>&1; do
    sleep 0.1
  done
fi
`;
	const systemOwnershipGuard = `${renderSystemLaunchDaemonOwnershipShellProbe(label)}
if [ -n "$openclaw_system_launchd_conflict" ]; then
  printf '[%s] openclaw restart blocked source=handoff mode=${mode} reason=%s interactive=0\n' "$(date -u +%FT%TZ)" "$openclaw_system_launchd_detail" >&2
  exit 78
fi
`;
	if (mode === "park") return `${preamble}
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
`;
	const completion = `if [ "$status" -eq 0 ]; then
  printf '[%s] openclaw restart done source=handoff mode=${mode} interactive=0\\n' "$(date -u +%FT%TZ)" >&2
else
  printf '[%s] openclaw restart failed source=handoff mode=${mode} status=%s interactive=0\\n' "$(date -u +%FT%TZ)" "$status" >&2
fi
exit "$status"
`;
	if (mode === "reload") return `${preamble}
${systemOwnershipGuard}
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
${completion}`;
	const kickstart = mode === "kickstart" ? "kickstart -k" : "kickstart";
	return `${preamble}
${systemOwnershipGuard}
status=0
launchctl enable "$service_target"
if launchctl ${kickstart} "$service_target"; then
  status=0
else
  status=$?
  if launchctl bootstrap "$domain" "$plist_path"; then
    status=0
  else
    launchctl ${kickstart} "$service_target"
    status=$?
  fi
fi
${completion}`;
}
function scheduleDetachedLaunchdHandoff(params) {
	const target = resolveLaunchdRestartTarget(params.env);
	const waitForPid = typeof params.waitForPid === "number" && Number.isFinite(params.waitForPid) ? Math.floor(params.waitForPid) : 0;
	const restartLogEnv = {
		...process.env,
		...params.env
	};
	const restartEnv = resolveServiceManagerEnv(mergeProcessEnv([
		process.env,
		params.env,
		{ PATH: process.env.PATH }
	]));
	try {
		const child = spawn("/bin/sh", [
			"-c",
			buildLaunchdRestartScript(params.mode, restartLogEnv, target.label),
			"openclaw-launchd-restart-handoff",
			target.serviceTarget,
			target.domain,
			target.plistPath,
			String(waitForPid)
		], {
			detached: true,
			stdio: "ignore",
			env: restartEnv
		});
		const spawned = new Promise((resolve) => {
			child.once("spawn", () => resolve(true));
			child.once("error", () => resolve(false));
		});
		child.unref();
		return ok(spawned);
	} catch (error) {
		return err(formatErrorMessage(error));
	}
}
function scheduleDetachedLaunchdRestartHandoff(params) {
	return scheduleDetachedLaunchdHandoff(params);
}
function scheduleDetachedLaunchdMaintenancePark(params) {
	return scheduleDetachedLaunchdHandoff({
		...params,
		mode: "park"
	});
}
//#endregion
export { scheduleDetachedLaunchdRestartHandoff as n, scheduleDetachedLaunchdMaintenancePark as t };
