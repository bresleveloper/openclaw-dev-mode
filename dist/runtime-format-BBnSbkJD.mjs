import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { g as resolveGatewayWindowsTaskName, m as resolveGatewaySystemdServiceName } from "./constants-BLghGsId.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { r as getSystemdCgroupHygieneSummary } from "./service-runtime-k_xhwppy.mjs";
import { u as classifySystemdUnavailableDetail } from "./systemd-user-transport-ChnCBaMi.mjs";
import { a as resolveGatewayRestartLogPath, o as resolveGatewaySupervisorLogPaths } from "./restart-logs-BvcN3lrf.mjs";
import { t as formatRuntimeStatusWithDetails } from "./runtime-status-BJSACmHe.mjs";
//#region src/daemon/container-context.ts
function resolveDaemonContainerContext(env = process.env) {
	return normalizeOptionalString(env.OPENCLAW_CONTAINER_HINT) || normalizeOptionalString(env.OPENCLAW_CONTAINER) || null;
}
//#endregion
//#region src/daemon/runtime-hints.ts
function buildPlatformRuntimeLogHints(params) {
	const platform = params.platform ?? process.platform;
	const env = {
		...process.env,
		...params.env
	};
	if (platform === "darwin") return [`Launchd stdout and stderr (if installed): ${resolveGatewaySupervisorLogPaths(env).stdoutPath}`, `Restart attempts: ${resolveGatewayRestartLogPath(env)}`];
	if (platform === "linux") {
		const scope = params.systemd?.scope === "system" ? "--system" : "--user";
		const unit = params.systemd?.unit ?? `${params.systemdServiceName}.service`;
		return [`Logs: journalctl ${scope} -u ${quoteCliArg(unit)} -n 200 --no-pager`, `Restart attempts: ${resolveGatewayRestartLogPath(env)}`];
	}
	if (platform === "win32") return [`Logs: schtasks /Query /TN "${params.windowsTaskName}" /V /FO LIST`, `Restart attempts: ${resolveGatewayRestartLogPath(env)}`];
	return [];
}
/** Build recovery details after the caller selects its applicable runtime state. */
function buildGatewayRuntimeRecoveryHints(params) {
	const windowsTaskName = params.env.OPENCLAW_WINDOWS_TASK_NAME?.trim() || resolveGatewayWindowsTaskName(params.env.OPENCLAW_PROFILE);
	const hints = params.kind === "gui-session" ? [
		"LaunchAgent requires a logged-in macOS GUI session; SSH/headless/sudo shells cannot bootstrap gui/$UID.",
		`Sign in to the macOS desktop as this user, then run: ${params.restartCommand}`,
		"For headless VM setups, enable auto-login for the target user or use a custom LaunchDaemon (not shipped)."
	] : [];
	if (params.kind === "disabled-task") hints.push(`Scheduled Task '${windowsTaskName}' is registered but DISABLED; run \`${formatCliCommand("openclaw gateway start", params.env)}\` (or \`${formatCliCommand("openclaw doctor --fix", params.env)}\`) to re-enable it.`);
	if (params.logFile) hints.push(`File logs: ${params.logFile}`);
	if (params.kind !== "gui-session") hints.push(...buildPlatformRuntimeLogHints({
		platform: params.platform,
		env: params.env,
		systemdServiceName: resolveGatewaySystemdServiceName(params.env.OPENCLAW_PROFILE),
		systemd: params.systemd,
		windowsTaskName
	}));
	return hints;
}
function buildPlatformServiceStartHints(params) {
	const platform = params.platform ?? process.platform;
	const base = [params.installHint, params.startCommand];
	switch (platform) {
		case "darwin": return [...base, `launchctl bootstrap gui/$UID ${params.launchAgentPlistPath}`];
		case "linux": return [...base, `systemctl --user start ${params.systemdServiceName}.service`];
		case "win32": return [...base, `schtasks /Run /TN "${params.windowsTaskName}"`];
		default: return base;
	}
}
//#endregion
//#region src/daemon/systemd-hints.ts
function isSystemdUnavailableDetail(detail) {
	return classifySystemdUnavailableDetail(detail) !== null;
}
function renderSystemdUnavailableHints(options = {}) {
	if (options.wsl) return [
		"WSL2 needs systemd enabled: edit /etc/wsl.conf with [boot]\\nsystemd=true",
		"Then run: wsl --shutdown (from PowerShell) and reopen your distro.",
		"Verify: systemctl --user status"
	];
	return [
		"systemd user services are unavailable; install/enable systemd or run the gateway under your supervisor.",
		...resolveDaemonContainerContext(options.env) || options.kind !== "user_bus_unavailable" ? [] : ["On a headless server (SSH/no desktop session): run `sudo loginctl enable-linger $(whoami)` to persist your systemd user session across logins.", "Also check that XDG_RUNTIME_DIR is set: `export XDG_RUNTIME_DIR=/run/user/$(id -u)`, then retry."],
		`If you're in a container, run the gateway in the foreground instead of \`${formatCliCommand("openclaw gateway", options.env)}\`.`
	];
}
//#endregion
//#region src/daemon/runtime-format.ts
/** Formats daemon runtime state into compact status lines for CLI output. */
function formatServiceLabel(label, runtime) {
	if (runtime?.inspectionReason === "service-manager-unavailable") return "no supported service manager detected";
	return runtime?.systemd?.scope ? `systemd ${runtime.systemd.scope}` : label;
}
const SIGNAL_NAMES_BY_STATUS = /* @__PURE__ */ new Map([
	[129, "SIGHUP"],
	[130, "SIGINT"],
	[131, "SIGQUIT"],
	[134, "SIGABRT/abort"],
	[137, "SIGKILL"],
	[143, "SIGTERM"]
]);
function formatLastExitStatus(status) {
	const signalName = SIGNAL_NAMES_BY_STATUS.get(status);
	return signalName ? `last exit ${status} (${signalName})` : `last exit ${status}`;
}
function formatRuntimeStatus(runtime) {
	if (!runtime) return null;
	const details = [
		runtime.subState ? `sub ${runtime.subState}` : void 0,
		runtime.lastExitStatus !== void 0 ? formatLastExitStatus(runtime.lastExitStatus) : void 0,
		runtime.lastExitReason ? `reason ${runtime.lastExitReason}` : void 0,
		runtime.lastRunResult ? `last run ${runtime.lastRunResult}` : void 0,
		runtime.lastRunTime ? `last run time ${runtime.lastRunTime}` : void 0,
		getSystemdCgroupHygieneSummary(runtime.systemd),
		runtime.detail
	].filter((detail) => Boolean(detail));
	return formatRuntimeStatusWithDetails({
		status: runtime.status,
		pid: runtime.pid,
		state: runtime.state,
		details
	});
}
//#endregion
export { buildGatewayRuntimeRecoveryHints as a, resolveDaemonContainerContext as c, renderSystemdUnavailableHints as i, formatServiceLabel as n, buildPlatformRuntimeLogHints as o, isSystemdUnavailableDetail as r, buildPlatformServiceStartHints as s, formatRuntimeStatus as t };
