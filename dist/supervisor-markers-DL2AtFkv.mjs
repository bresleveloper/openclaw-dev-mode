import { l as resolveGatewayLaunchAgentLabel, t as GATEWAY_LAUNCH_AGENT_LABEL } from "./constants-CJCmIHb-.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
//#region src/infra/supervisor-markers.ts
const SUPERVISOR_HINTS = {
	launchd: ["OPENCLAW_LAUNCHD_LABEL"],
	systemd: [
		"OPENCLAW_SYSTEMD_UNIT",
		"INVOCATION_ID",
		"SYSTEMD_EXEC_PID",
		"JOURNAL_STREAM"
	],
	schtasks: ["OPENCLAW_WINDOWS_TASK_NAME"]
};
/** Environment keys that imply the gateway process is supervised by an external respawner. */
const SUPERVISOR_HINT_ENV_VARS = [
	"OPENCLAW_SUPERVISOR_MODE",
	"LAUNCH_JOB_LABEL",
	"LAUNCH_JOB_NAME",
	"XPC_SERVICE_NAME",
	...SUPERVISOR_HINTS.launchd,
	...SUPERVISOR_HINTS.systemd,
	...SUPERVISOR_HINTS.schtasks,
	"OPENCLAW_SERVICE_MARKER",
	"OPENCLAW_SERVICE_KIND"
];
function hasAnyHint(env, keys) {
	return keys.some((key) => {
		const value = env[key];
		return typeof value === "string" && value.trim().length > 0;
	});
}
function hasOpenClawGatewayServiceMarker(env) {
	return env.OPENCLAW_SERVICE_MARKER?.trim() === "openclaw" && env.OPENCLAW_SERVICE_KIND?.trim() === "gateway";
}
function isCurrentGatewayLaunchdJob(env) {
	const expectedLabel = resolveGatewayLaunchAgentLabel(env.OPENCLAW_PROFILE);
	if ([env.LAUNCH_JOB_LABEL, env.LAUNCH_JOB_NAME].some((value) => value?.trim() === expectedLabel)) return true;
	return env.XPC_SERVICE_NAME?.trim() === GATEWAY_LAUNCH_AGENT_LABEL;
}
/** Detects the current platform supervisor from process environment hints. */
function detectRespawnSupervisor(env = process.env, platform = process.platform, options = {}) {
	if (platform === "darwin") return hasAnyHint(env, SUPERVISOR_HINTS.launchd) || isCurrentGatewayLaunchdJob(env) ? "launchd" : null;
	if (platform === "linux") return hasAnyHint(env, SUPERVISOR_HINTS.systemd) || options.includeLinuxOpenClawGatewayServiceMarker === true && hasOpenClawGatewayServiceMarker(env) ? "systemd" : null;
	if (platform === "win32") {
		if (hasAnyHint(env, SUPERVISOR_HINTS.schtasks)) return "schtasks";
		return hasOpenClawGatewayServiceMarker(env) ? "schtasks" : null;
	}
	return null;
}
/** Resolves gateway restart ownership without treating external mode as a native service manager. */
function detectGatewayRespawnSupervisor(env = process.env, platform = process.platform, options = {}) {
	if (isGatewayExternallySupervised(env)) return "external";
	return detectRespawnSupervisor(env, platform, options);
}
function detectGatewayRespawnSupervisorIdentity(env = process.env, platform = process.platform, options = {}) {
	const kind = detectGatewayRespawnSupervisor(env, platform, options);
	if (!kind) return null;
	return {
		kind,
		name: (kind === "schtasks" ? env.OPENCLAW_WINDOWS_TASK_NAME : kind === "systemd" ? env.OPENCLAW_SYSTEMD_UNIT : kind === "launchd" ? env.OPENCLAW_LAUNCHD_LABEL ?? env.LAUNCH_JOB_LABEL ?? env.LAUNCH_JOB_NAME ?? env.XPC_SERVICE_NAME : void 0)?.trim() || null
	};
}
//#endregion
export { detectRespawnSupervisor as i, detectGatewayRespawnSupervisor as n, detectGatewayRespawnSupervisorIdentity as r, SUPERVISOR_HINT_ENV_VARS as t };
