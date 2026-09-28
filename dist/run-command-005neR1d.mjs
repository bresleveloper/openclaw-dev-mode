import { i as WINDOWS_TASK_SUPERVISOR_FLAG, r as WINDOWS_TASK_SUPERVISOR_CHILD_FLAG } from "./windows-task-supervisor-contract-DlaAkrWJ.mjs";
import { t as resolveGatewayRunOptions } from "./run-options-DmrtZArA.mjs";
import { t as getGatewayRunRuntimeHooks } from "./runtime-hooks-Dp2OHV46.mjs";
import { Option } from "commander";
//#region src/cli/gateway-cli/run-command.ts
const GATEWAY_AUTH_MODES = [
	"none",
	"token",
	"password",
	"trusted-proxy"
];
const GATEWAY_TAILSCALE_MODES = [
	"off",
	"serve",
	"funnel"
];
function formatModeChoices(modes) {
	return modes.map((mode) => `"${mode}"`).join("|");
}
function addGatewayRunCommand(cmd, hooks = {}) {
	return cmd.option("--port <port>", "Port for the gateway WebSocket").option("--bind <mode>", "Bind mode (\"loopback\"|\"lan\"|\"tailnet\"|\"auto\"|\"custom\"). Defaults to config gateway.bind (or loopback).").option("--token <token>", "Shared token required in connect.params.auth.token (default: OPENCLAW_GATEWAY_TOKEN env if set)").option("--auth <mode>", `Gateway auth mode (${formatModeChoices(GATEWAY_AUTH_MODES)})`).option("--password <password>", "Password for auth mode=password").option("--password-file <path>", "Read gateway password from file").option("--tailscale <mode>", `Tailscale exposure mode (${formatModeChoices(GATEWAY_TAILSCALE_MODES)})`).addOption(new Option("--tailscale-reset-on-exit").hideHelp()).option("--allow-unconfigured", "Allow gateway start without enforcing gateway.mode=local in config (does not repair config)", false).option("--dev", "Create a dev config + workspace if missing (no BOOTSTRAP.md)", false).option("--ambient-channels", "Allow the gateway to auto-configure channels from ambient environment variables", false).option("--dev-ambient-channels", "Deprecated alias for --ambient-channels", false).option("--reset", "Reset dev config + credentials + sessions + workspace (requires --dev)", false).addOption(new Option(WINDOWS_TASK_SUPERVISOR_FLAG).hideHelp()).addOption(new Option(`${WINDOWS_TASK_SUPERVISOR_CHILD_FLAG} <restart-code>`).hideHelp()).addOption(new Option("--update-canary").hideHelp()).option("--force", "Kill any existing listener on the target port before starting", false).option("--verbose", "Verbose logging to stdout/stderr", false).option("--cli-backend-logs", "Only show CLI backend logs in the console (includes stdout/stderr)", false).option("--claude-cli-logs", "Deprecated alias for --cli-backend-logs", false).option("--ws-log <style>", "WebSocket log style (\"auto\"|\"full\"|\"compact\")", "auto").option("--compact", "Alias for \"--ws-log compact\"", false).option("--raw-stream", "Log raw model stream events to jsonl", false).option("--raw-stream-path <path>", "Raw stream jsonl path").action(async (opts, command) => {
		const resolved = resolveGatewayRunOptions(opts, command);
		const { withAgentDatabaseStartupAdmission } = await import("./agent-database-startup-CWW26yWz.mjs");
		return withAgentDatabaseStartupAdmission(async () => {
			try {
				await hooks.beforeRun?.(resolved);
				const { runGatewayCommand } = await import("./run-q1Qh3g8S.mjs");
				await runGatewayCommand(resolved, getGatewayRunRuntimeHooks());
			} catch (error) {
				const { handleGatewayStartupMaintenance } = await import("./startup-maintenance-D4bbYXb-.mjs");
				if (!await handleGatewayStartupMaintenance(error)) throw error;
			}
		});
	});
}
//#endregion
export { addGatewayRunCommand as t };
