import { c as isGatewayServiceEnv } from "./constants-CJCmIHb-.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { s as resolveGatewayRpcOptionsWithLocalPort } from "./gateway-rpc-DXO3PHhc.mjs";
import { Option } from "commander";
//#region src/cli/daemon-cli/register-service-commands.ts
const daemonInstallModuleLoader = createLazyImportLoader(() => import("./install.runtime-Dgy6pGCx.mjs"));
const daemonLifecycleModuleLoader = createLazyImportLoader(() => import("./lifecycle.runtime.js"));
const updateExecutorModuleLoader = createLazyImportLoader(() => import("./update-executor-tNy7qz7f.mjs"));
const daemonStatusModuleLoader = createLazyImportLoader(() => import("./status.runtime-BgYiOYTg.mjs"));
function resolveJsonOption(cmdOpts, command) {
	const parentJson = inheritOptionFromParent(command, "json", "cli");
	return Boolean(cmdOpts.json || parentJson);
}
function resolveInstallOptions(cmdOpts, command) {
	const parentForce = inheritOptionFromParent(command, "force");
	const parentPort = inheritOptionFromParent(command, "port");
	const parentToken = inheritOptionFromParent(command, "token");
	const parentAllowUnconfigured = inheritOptionFromParent(command, "allowUnconfigured");
	return {
		...cmdOpts,
		force: Boolean(cmdOpts.force || parentForce),
		port: cmdOpts.port ?? parentPort,
		token: cmdOpts.token ?? parentToken,
		allowUnconfigured: cmdOpts.allowUnconfigured ?? parentAllowUnconfigured,
		json: resolveJsonOption(cmdOpts, command)
	};
}
function resolveRestartOptions(cmdOpts, command) {
	const parentForce = inheritOptionFromParent(command, "force");
	const force = Boolean(cmdOpts.force || parentForce);
	const safeFromGateway = process.platform === "win32" && isGatewayServiceEnv(process.env) && !isGatewayExternallySupervised() && !force && cmdOpts.wait === void 0 && !cmdOpts.preserveDefinition && !cmdOpts.skipDeferral;
	return {
		...cmdOpts,
		force,
		safe: cmdOpts.safe || safeFromGateway,
		json: resolveJsonOption(cmdOpts, command)
	};
}
function resolveStopOptions(cmdOpts, command) {
	const parentForce = inheritOptionFromParent(command, "force");
	return {
		...cmdOpts,
		force: Boolean(cmdOpts.force || parentForce),
		json: resolveJsonOption(cmdOpts, command)
	};
}
/** Attach Gateway service status/install/lifecycle subcommands to a parent command. */
function addGatewayServiceCommands(parent, opts) {
	parent.command("status").description(opts?.statusDescription ?? "Show gateway service status + probe connectivity/capability").option("--url <url>", "Gateway WebSocket URL (defaults to config/remote/local)").option("--port <port>", "Local Gateway port").option("--token <token>", "Gateway token (if required)").option("--password <password>", "Gateway password (password auth)").option("--timeout <ms>", "Timeout in ms", "10000").option("--no-probe", "Skip RPC probe").option("--require-rpc", "Exit non-zero when the RPC probe fails", false).option("--deep", "Scan system-level services", false).option("--json", "Output JSON", false).action(async (cmdOpts, command) => {
		const { runDaemonStatus } = await daemonStatusModuleLoader.load();
		await runDaemonStatus({
			rpc: resolveGatewayRpcOptionsWithLocalPort(cmdOpts, command),
			probe: Boolean(cmdOpts.probe),
			requireRpc: Boolean(cmdOpts.requireRpc),
			deep: Boolean(cmdOpts.deep),
			json: resolveJsonOption(cmdOpts, command)
		});
	});
	parent.command("install").description("Install and start the Gateway service (launchd/systemd/schtasks)").option("--port <port>", "Gateway port").option("--runtime <runtime>", "Daemon runtime (node|bun). Default: node").option("--runtime-path <path>", "Pin an absolute Node/Bun executable path").option("--token <token>", "Gateway token (token auth)").option("--wrapper <path>", "Executable wrapper for generated service ProgramArguments").option("--allow-unconfigured", "Allow the service to start without gateway.mode=local").option("--force", "Reinstall if already installed (may restart a running Gateway)", false).option("--json", "Output JSON", false).addOption(new Option("--update-executor <mode>", "Private update executor").choices(["check", "run"]).hideHelp()).action(async (cmdOpts, command) => {
		const invoke = async () => {
			const { runDaemonInstall } = await daemonInstallModuleLoader.load();
			await runDaemonInstall(resolveInstallOptions(cmdOpts, command));
		};
		if (cmdOpts.updateExecutor === void 0) await invoke();
		else {
			const { runGatewayServiceUpdateCommand } = await updateExecutorModuleLoader.load();
			await runGatewayServiceUpdateCommand(cmdOpts.updateExecutor, "install", invoke);
		}
	});
	parent.command("uninstall").description("Uninstall the Gateway service (launchd/systemd/schtasks)").option("--json", "Output JSON", false).action(async (cmdOpts, command) => {
		const { runDaemonUninstall } = await daemonLifecycleModuleLoader.load();
		await runDaemonUninstall({
			...cmdOpts,
			json: resolveJsonOption(cmdOpts, command)
		});
	});
	parent.command("start").description("Start the Gateway service (launchd/systemd/schtasks)").option("--json", "Output JSON", false).action(async (cmdOpts, command) => {
		const { runDaemonStart } = await daemonLifecycleModuleLoader.load();
		await runDaemonStart({
			...cmdOpts,
			json: resolveJsonOption(cmdOpts, command)
		});
	});
	parent.command("stop").addOption(new Option("--update-executor <mode>", "Private update executor").choices(["check", "run"]).hideHelp()).description("Stop the Gateway service (launchd/systemd/schtasks)").option("--force", "Allow stop from a non-interactive shell", false).option("--json", "Output JSON", false).option("--disable", "Persistently suppress KeepAlive/RunAtLoad so the gateway does not respawn until next start (launchd only)", false).action(async (cmdOpts, command) => {
		const invoke = async () => {
			const { runDaemonStop } = await daemonLifecycleModuleLoader.load();
			await runDaemonStop(resolveStopOptions(cmdOpts, command));
		};
		if (cmdOpts.updateExecutor === void 0) await invoke();
		else {
			const { runGatewayServiceUpdateCommand } = await updateExecutorModuleLoader.load();
			await runGatewayServiceUpdateCommand(cmdOpts.updateExecutor, "stop", invoke);
		}
	});
	parent.command("restart").addOption(new Option("--update-executor <mode>", "Private update executor").choices(["check", "run"]).hideHelp()).description("Restart the Gateway service (launchd/systemd/schtasks)").option("--preserve-definition", "Keep the native service definition", false).option("--force", "Begin restart now; drain admitted work within the shutdown budget", false).option("--safe", "Request an OpenClaw-aware restart after active work drains (bounded wait; may force after the timeout expires)", false).option("--skip-deferral", "Bypass the safe-restart active-work deferral gate; close-stage reply drain still applies; requires --safe", false).option("--wait <duration>", "Wait duration before restart (ms, 10s, 5m; 0 waits indefinitely). For non-safe restarts (plain restart); not compatible with --force or --safe").option("--json", "Output JSON", false).action(async (cmdOpts, command) => {
		const invoke = async () => {
			const { runDaemonRestart } = await daemonLifecycleModuleLoader.load();
			await runDaemonRestart(resolveRestartOptions(cmdOpts, command));
		};
		if (cmdOpts.updateExecutor === void 0) await invoke();
		else {
			const { runGatewayServiceUpdateCommand } = await updateExecutorModuleLoader.load();
			await runGatewayServiceUpdateCommand(cmdOpts.updateExecutor, "restart", invoke);
		}
	});
}
//#endregion
export { addGatewayServiceCommands as t };
