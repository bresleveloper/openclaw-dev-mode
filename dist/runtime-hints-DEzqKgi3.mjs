import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { m as resolveGatewayWindowsTaskName, p as resolveGatewaySystemdServiceName } from "./constants-CJCmIHb-.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { a as resolveGatewayRestartLogPath, o as resolveGatewaySupervisorLogPaths } from "./restart-logs-DcfskF2f.mjs";
import { u as classifySystemdUnavailableDetail } from "./systemd-user-transport-ZcY1z7CT.mjs";
import { n as getSystemdCgroupHygieneSummary } from "./service-runtime-BuDPZetd.mjs";
import { t as formatRuntimeStatusWithDetails } from "./runtime-status-BcdkhQrJ.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
//#region src/daemon/container-context.ts
/** Detects whether a daemon was launched by OpenClaw's container-aware service wrapper. */
/** Resolves the daemon container hint exposed by managed service environments. */
function resolveDaemonContainerContext(env = process.env) {
	return normalizeOptionalString(env.OPENCLAW_CONTAINER_HINT) || normalizeOptionalString(env.OPENCLAW_CONTAINER) || null;
}
//#endregion
//#region src/daemon/systemd-hints.ts
/** Renders Linux systemd availability hints for gateway service commands. */
/** Detects details that should get systemd availability repair hints. */
function isSystemdUnavailableDetail(detail) {
	return classifySystemdUnavailableDetail(detail) !== null;
}
function renderSystemdHeadlessServerHints() {
	return ["On a headless server (SSH/no desktop session): run `sudo loginctl enable-linger $(whoami)` to persist your systemd user session across logins.", "Also ensure XDG_RUNTIME_DIR is set: `export XDG_RUNTIME_DIR=/run/user/$(id -u)`, then retry."];
}
function renderSystemdUnavailableHints(options = {}) {
	if (options.wsl) return [
		"WSL2 needs systemd enabled: edit /etc/wsl.conf with [boot]\\nsystemd=true",
		"Then run: wsl --shutdown (from PowerShell) and reopen your distro.",
		"Verify: systemctl --user status"
	];
	return [
		"systemd user services are unavailable; install/enable systemd or run the gateway under your supervisor.",
		...resolveDaemonContainerContext(options.env) || options.kind !== "user_bus_unavailable" ? [] : renderSystemdHeadlessServerHints(),
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
	const details = [];
	if (runtime.subState) details.push(`sub ${runtime.subState}`);
	if (runtime.lastExitStatus !== void 0) details.push(formatLastExitStatus(runtime.lastExitStatus));
	if (runtime.lastExitReason) details.push(`reason ${runtime.lastExitReason}`);
	if (runtime.lastRunResult) details.push(`last run ${runtime.lastRunResult}`);
	if (runtime.lastRunTime) details.push(`last run time ${runtime.lastRunTime}`);
	const cgroupSummary = getSystemdCgroupHygieneSummary(runtime.systemd);
	if (cgroupSummary) details.push(cgroupSummary);
	if (runtime.detail) details.push(runtime.detail);
	return formatRuntimeStatusWithDetails({
		status: runtime.status,
		pid: runtime.pid,
		state: runtime.state,
		details
	});
}
//#endregion
//#region src/daemon/runtime-hints.ts
/** Builds platform-specific log and start hints for daemon status output. */
function buildPlatformRuntimeLogHints(params) {
	const platform = params.platform ?? process.platform;
	const env = {
		...process.env,
		...params.env
	};
	if (platform === "darwin") return [`Launchd stdout and stderr (if installed): ${resolveGatewaySupervisorLogPaths(env, { platform }).stdoutPath}`, `Restart attempts: ${resolveGatewayRestartLogPath(env)}`];
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
	const hints = params.kind === "gui-session" ? [
		"LaunchAgent requires a logged-in macOS GUI session; SSH/headless/sudo shells cannot bootstrap gui/$UID.",
		`Sign in to the macOS desktop as this user, then run: ${params.restartCommand}`,
		"For headless VM setups, enable auto-login for the target user or use a custom LaunchDaemon (not shipped)."
	] : [];
	if (params.logFile) hints.push(`File logs: ${params.logFile}`);
	if (params.kind === "stopped") hints.push(...buildPlatformRuntimeLogHints({
		platform: params.platform,
		env: params.env,
		systemdServiceName: resolveGatewaySystemdServiceName(params.env.OPENCLAW_PROFILE),
		systemd: params.systemd,
		windowsTaskName: resolveGatewayWindowsTaskName(params.env.OPENCLAW_PROFILE)
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
export { formatServiceLabel as a, resolveDaemonContainerContext as c, formatRuntimeStatus as i, buildPlatformRuntimeLogHints as n, isSystemdUnavailableDetail as o, buildPlatformServiceStartHints as r, renderSystemdUnavailableHints as s, buildGatewayRuntimeRecoveryHints as t };
