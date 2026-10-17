import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as hasConfiguredSecretInput } from "./types.secrets-DsPRn9Dz.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { C as resolveIsNixMode } from "./paths-DGIwWbpu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as runExec } from "./exec-DJvyCA0D.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-CDVrpZuO.mjs";
import { i as isLaunchAgentLoaded, r as isLaunchAgentEnabled, s as launchAgentPlistExists } from "./launchd-runtime-DUenz_Po.mjs";
import { n as resolveGatewayService } from "./service-Cw6bpVrf.mjs";
import { n as findStaleOpenClawUpdateLaunchdJobs } from "./launchd-71FddAaH.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/commands/doctor-platform-notes.ts
const DOCTOR_LAUNCHCTL_TIMEOUT_MS = 5e3;
function collectMacLaunchAgentOverrideWarning() {
	if (process.platform !== "darwin") return null;
	const markerPath = path.join(process.env.HOME ?? os.homedir(), ".openclaw", "disable-launchagent");
	if (!fs.existsSync(markerPath)) return null;
	const displayMarkerPath = shortenHomePath(markerPath);
	return [
		`- LaunchAgent writes are disabled via ${displayMarkerPath}.`,
		"- To restore default behavior:",
		`  rm ${displayMarkerPath}`
	].join("\n");
}
async function noteMacLaunchAgentOverrides() {
	const warning = collectMacLaunchAgentOverrideWarning();
	if (warning) note(warning, "Gateway (macOS)");
}
/** Diagnose persistent disablement without taking activation authority from update or Doctor. */
async function noteMacDisabledGatewayLaunchAgent(env = process.env) {
	if (process.platform !== "darwin" || !await launchAgentPlistExists(env) || await isLaunchAgentLoaded({ env }) || await isLaunchAgentEnabled({ env })) return;
	const label = resolveLaunchAgentLabel(env);
	const labelEnv = env.OPENCLAW_LAUNCHD_LABEL?.trim() ? `OPENCLAW_LAUNCHD_LABEL=${label} ` : "";
	note([
		`Gateway LaunchAgent ${label} is installed but unloaded and disabled in launchd.`,
		"A terminated update helper can leave it disabled across logins. Doctor does not automatically re-enable it.",
		`After verifying the installation is safe to run, use ${labelEnv}${formatCliCommand("openclaw gateway start", env)} to re-enable and start it. Keep the same state/config overrides.`,
		`If an update was interrupted or installation safety is uncertain, run ${formatCliCommand("openclaw update", env)} or ${formatCliCommand("openclaw doctor", env)} and ${formatCliCommand("openclaw triage", env)} before starting it.`
	].join("\n"), "Gateway (macOS)");
}
async function collectMacStaleOpenClawUpdateLaunchdJobsWarning() {
	if (process.platform !== "darwin") return null;
	const scanEnv = await resolveGatewayServiceEnvForPlatformNotes();
	const jobs = await findStaleOpenClawUpdateLaunchdJobs(scanEnv).catch(() => []);
	if (jobs.length === 0) return null;
	return [
		"- Stale OpenClaw updater launchd job(s) detected.",
		...jobs.map((job) => {
			const exitStatus = job.lastExitStatus !== void 0 ? `, last exit ${job.lastExitStatus}` : "";
			const pid = job.pid !== void 0 ? `, pid ${job.pid}` : "";
			return `- ${job.label}${pid}${exitStatus}`;
		}),
		"- Fix after confirming no update is running:",
		"  launchctl remove <label>",
		`  ${formatCliCommand("openclaw gateway restart")}`
	].join("\n");
}
async function noteMacStaleOpenClawUpdateLaunchdJobs() {
	const warning = await collectMacStaleOpenClawUpdateLaunchdJobsWarning();
	if (warning) note(warning, "Gateway (macOS)");
}
async function launchctlGetenv(name) {
	try {
		const result = await runExec("/bin/launchctl", ["getenv", name], {
			logOutput: false,
			timeoutMs: DOCTOR_LAUNCHCTL_TIMEOUT_MS
		});
		return normalizeOptionalString(result.stdout);
	} catch {
		return;
	}
}
function hasConfigGatewayCreds(cfg) {
	return [
		cfg.gateway?.auth?.token,
		cfg.gateway?.auth?.password,
		cfg.gateway?.remote?.token,
		cfg.gateway?.remote?.password
	].some((credential) => hasConfiguredSecretInput(credential, cfg.secrets?.defaults));
}
async function collectMacLaunchctlGatewayEnvOverrideWarning(cfg) {
	if (process.platform !== "darwin") return null;
	if (!hasConfigGatewayCreds(cfg)) return null;
	const envToken = await launchctlGetenv("OPENCLAW_GATEWAY_TOKEN");
	const envPassword = await launchctlGetenv("OPENCLAW_GATEWAY_PASSWORD");
	if (!envToken && !envPassword) return null;
	return [
		"- Host-wide launchctl gateway auth overrides detected.",
		"- Current managed Gateway installs do not need these values unless config intentionally references the env var.",
		envToken ? "- `OPENCLAW_GATEWAY_TOKEN` is set; explicit environment URL or node-host targets can use a different token than gateway.auth.token." : void 0,
		envPassword ? "- `OPENCLAW_GATEWAY_PASSWORD` is set; explicit environment URL or node-host targets can use a different password than gateway.auth.password." : void 0,
		"- Clear overrides and restart the app/gateway:",
		envToken ? "  launchctl unsetenv OPENCLAW_GATEWAY_TOKEN" : void 0,
		envPassword ? "  launchctl unsetenv OPENCLAW_GATEWAY_PASSWORD" : void 0
	].filter((line) => Boolean(line)).join("\n");
}
async function noteMacLaunchctlGatewayEnvOverrides(cfg) {
	const warning = await collectMacLaunchctlGatewayEnvOverrideWarning(cfg);
	if (warning) note(warning, "Gateway (macOS)");
}
async function resolveGatewayServiceEnvForPlatformNotes() {
	const baseEnv = process.env;
	const command = await resolveGatewayService().readCommand(baseEnv).catch(() => null);
	return command?.environment ? {
		...baseEnv,
		...command.environment
	} : baseEnv;
}
async function collectGatewayPlatformWarnings(cfg) {
	if (process.platform === "linux") {
		if (cfg.gateway?.mode === "remote" || resolveIsNixMode()) return [];
		const { auditGatewayServiceConfig, SERVICE_AUDIT_CODES } = await import("./service-audit-BdLUdCDh.mjs");
		return (await auditGatewayServiceConfig({
			env: process.env,
			command: null
		})).issues.filter((issue) => issue.code === SERVICE_AUDIT_CODES.systemdKillModeControlGroup || issue.code === SERVICE_AUDIT_CODES.systemdKillModeProcessOrNone).map((issue) => [issue.detail ? `${issue.message} (${issue.detail})` : issue.message, `Run ${formatCliCommand("openclaw gateway install --force")} only after verification; inspect drop-ins separately.`].join("\n"));
	}
	return [
		collectMacLaunchAgentOverrideWarning(),
		await collectMacStaleOpenClawUpdateLaunchdJobsWarning(),
		await collectMacLaunchctlGatewayEnvOverrideWarning(cfg)
	].filter((warning) => Boolean(warning));
}
function isTmpCompileCachePath(cachePath) {
	const normalized = cachePath.trim().replace(/\/+$/, "");
	return normalized === "/tmp" || normalized.startsWith("/tmp/") || normalized === "/private/tmp" || normalized.startsWith("/private/tmp/");
}
function noteStartupOptimizationHints(env = process.env) {
	const platform = process.platform;
	if (platform === "win32") return;
	const arch = os.arch();
	const totalMemBytes = os.totalmem();
	if (!(platform === "linux" && (arch === "arm" || arch === "arm64" || platform === "linux" && totalMemBytes > 0 && totalMemBytes <= 8 * 1024 ** 3))) return;
	const compileCache = normalizeOptionalString(env.NODE_COMPILE_CACHE) ?? "";
	const disableCompileCache = normalizeOptionalString(env.NODE_DISABLE_COMPILE_CACHE) ?? "";
	const noRespawn = normalizeOptionalString(env.OPENCLAW_NO_RESPAWN) ?? "";
	const lines = [];
	if (!compileCache) lines.push("- NODE_COMPILE_CACHE is not set; repeated CLI runs can be slower on small hosts (Raspberry Pi/VM).");
	else if (isTmpCompileCachePath(compileCache)) lines.push("- NODE_COMPILE_CACHE points to /tmp; use /var/tmp so cache survives reboots and warms startup reliably.");
	if (disableCompileCache) lines.push("- NODE_DISABLE_COMPILE_CACHE is set; startup compile cache is disabled.");
	if (noRespawn !== "1") lines.push("- OPENCLAW_NO_RESPAWN is not set to 1; set it when you want routine gateway restarts to stay in-process instead of handing off to a managed supervisor.");
	if (lines.length === 0) return;
	const suggestions = [
		"- Suggested env for low-power hosts:",
		"  export NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache",
		"  mkdir -p /var/tmp/openclaw-compile-cache",
		"  export OPENCLAW_NO_RESPAWN=1",
		disableCompileCache ? "  unset NODE_DISABLE_COMPILE_CACHE" : void 0
	].filter((line) => Boolean(line));
	note([...lines, ...suggestions].join("\n"), "Startup optimization");
}
//#endregion
export { collectGatewayPlatformWarnings, noteMacDisabledGatewayLaunchAgent, noteMacLaunchAgentOverrides, noteMacLaunchctlGatewayEnvOverrides, noteMacStaleOpenClawUpdateLaunchdJobs, noteStartupOptimizationHints };
