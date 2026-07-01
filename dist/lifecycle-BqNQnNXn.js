import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { f as resolveGatewayPort } from "./paths-DyelItkH.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { i as resolveOpenClawWrapperPath, t as OPENCLAW_WRAPPER_ENV_KEY } from "./program-args-Bv0Bd4j9.js";
import { t as buildGatewayInstallPlan } from "./daemon-install-helpers-Dw_yw8hT.js";
import { f as stopSystemdService, t as findInstalledSystemdGatewayScope, u as restartSystemdService } from "./systemd-BTZIDCKR.js";
import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-C76za6vm.js";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-CH1or2NP.js";
import { c as readBestEffortConfig, d as readConfigFileSnapshotForWrite } from "./io-BJfjPmGW.js";
import { t as parseDurationMs } from "./parse-duration-Da6doDTX.js";
import "./config-A41fTHlt.js";
import { f as repairLaunchAgentBootstrap, i as formatLaunchAgentGuiSessionError, s as launchAgentPlistExists } from "./launchd-DvDYGLI_.js";
import { i as resolveGatewayService, n as formatGatewayServiceStartRepairIssues } from "./service-3I63vLaG.js";
import { i as signalVerifiedGatewayPidSync, n as formatGatewayPidList, t as findVerifiedGatewayListenerPidsOnPortSync } from "./gateway-processes-BJ-SCHE6.js";
import { h as createNullWriter, l as renderGatewayServiceStartHints, s as parsePortFromArgs } from "./shared-fZjq5dpi.js";
import { t as mergeInstallInvocationEnv } from "./install-HtKou_Y7.js";
import { n as isRestartEnabled } from "./commands.flags-BUxITaVI.js";
import { l as callGatewayCli } from "./call-Du-jF5Kg.js";
import { a as probeGateway } from "./probe-eGZz6lmn.js";
import { _ as writeGatewayRestartIntentSync } from "./restart-D2h2urGo.js";
import { i as runServiceUninstall, n as runServiceStart, r as runServiceStop, t as runServiceRestart } from "./lifecycle-core-RRXOr5QB.js";
import { a as renderGatewayPortHealthDiagnostics, c as waitForGatewayHealthyListener, l as waitForGatewayHealthyRestart, o as renderRestartDiagnostics, s as terminateStaleGatewayPids, t as DEFAULT_RESTART_HEALTH_ATTEMPTS } from "./restart-health--_HjtSJi.js";
//#region src/cli/daemon-cli/launchd-recovery.ts
const LAUNCH_AGENT_RECOVERY_MESSAGE = "Gateway LaunchAgent was installed but not loaded; re-bootstrapped launchd service.";
/** Re-bootstrap an installed but unloaded LaunchAgent after a daemon start/restart command. */
async function recoverInstalledLaunchAgent(params) {
	if (process.platform !== "darwin") return null;
	const env = params.env ?? process.env;
	if (!await launchAgentPlistExists(env).catch(() => false)) return null;
	const repaired = await repairLaunchAgentBootstrap({ env }).catch(() => ({
		ok: false,
		status: "bootstrap-failed"
	}));
	if (!repaired.ok) {
		if (repaired.status === "gui-session-unavailable") {
			const actionHint = params.result === "started" ? "openclaw gateway start" : "openclaw gateway restart";
			throw new Error(formatLaunchAgentGuiSessionError({
				detail: repaired.detail,
				domain: repaired.domain,
				actionHint
			}));
		}
		return null;
	}
	return {
		result: params.result,
		loaded: true,
		message: LAUNCH_AGENT_RECOVERY_MESSAGE
	};
}
//#endregion
//#region src/cli/daemon-cli/start-repair.ts
/** Repair a loaded but stale Gateway service definition and report the start result. */
async function repairLoadedGatewayServiceForStart(params) {
	const { snapshot: configSnapshot, writeOptions: configWriteOptions } = await readConfigFileSnapshotForWrite();
	const cfg = configSnapshot.valid ? configSnapshot.sourceConfig : configSnapshot.config;
	const existingEnvironment = params.state.command?.environment;
	const installEnv = mergeInstallInvocationEnv({
		env: process.env,
		existingServiceEnv: existingEnvironment
	});
	const wrapperPath = await resolveOpenClawWrapperPath(installEnv[OPENCLAW_WRAPPER_ENV_KEY]);
	const port = resolveGatewayPort(cfg);
	const tokenResolution = await resolveGatewayInstallToken({
		config: cfg,
		configSnapshot,
		configWriteOptions,
		env: installEnv,
		autoGenerateWhenMissing: true,
		persistGeneratedToken: true
	});
	if (tokenResolution.unavailableReason) throw new Error(tokenResolution.unavailableReason);
	const warnings = [formatGatewayServiceStartRepairIssues(params.issues), ...tokenResolution.warnings].filter((warning) => warning.trim().length > 0);
	if (!params.json) {
		defaultRuntime.log("Gateway service definition needs repair:");
		for (const warning of warnings) defaultRuntime.log(`- ${warning}`);
	}
	const { programArguments, workingDirectory, environment } = await buildGatewayInstallPlan({
		env: installEnv,
		port,
		runtime: DEFAULT_GATEWAY_DAEMON_RUNTIME,
		wrapperPath,
		existingEnvironment,
		config: cfg,
		warn: (message) => {
			warnings.push(message);
			if (!params.json) defaultRuntime.log(`- ${message}`);
		}
	});
	await params.service.install({
		env: installEnv,
		stdout: params.stdout,
		warn: params.warn,
		programArguments,
		workingDirectory,
		environment
	});
	let loaded;
	try {
		loaded = await params.service.isLoaded({ env: installEnv });
	} catch {
		loaded = true;
	}
	return {
		result: "started",
		message: "Gateway service definition repaired and started. Reopen the Control UI with `openclaw dashboard` or copy a fresh auth URL with `openclaw dashboard --no-open`.",
		warnings: warnings.length ? warnings : void 0,
		loaded
	};
}
//#endregion
//#region src/cli/daemon-cli/lifecycle.ts
const POST_RESTART_HEALTH_ATTEMPTS = DEFAULT_RESTART_HEALTH_ATTEMPTS;
const POST_RESTART_HEALTH_DELAY_MS = 500;
const WINDOWS_POST_RESTART_HEALTH_TIMEOUT_MS = 18e4;
function postRestartHealthAttempts() {
	return process.platform === "win32" ? Math.ceil(WINDOWS_POST_RESTART_HEALTH_TIMEOUT_MS / POST_RESTART_HEALTH_DELAY_MS) : POST_RESTART_HEALTH_ATTEMPTS;
}
function formatRestartFailure(params) {
	if (params.health.waitOutcome === "stopped-free") {
		const elapsedSeconds = Math.max(1, Math.round((params.health.elapsedMs ?? 0) / 1e3));
		return {
			statusLine: `Gateway restart failed after ${elapsedSeconds}s: service stayed stopped and port ${params.port} stayed free.`,
			failMessage: `Gateway restart failed after ${elapsedSeconds}s: service stayed stopped and health checks never came up.`
		};
	}
	return {
		statusLine: `Timed out after ${params.timeoutSeconds}s waiting for gateway port ${params.port} to become healthy.`,
		failMessage: `Gateway restart timed out after ${params.timeoutSeconds}s waiting for health checks.`
	};
}
async function resolveGatewayLifecyclePort(service = resolveGatewayService()) {
	const command = await service.readCommand(process.env).catch(() => null);
	const serviceEnv = command?.environment ?? void 0;
	const mergedEnv = {
		...process.env,
		...serviceEnv ?? void 0
	};
	return parsePortFromArgs(command?.programArguments) ?? resolveGatewayPort(await readBestEffortConfig(), mergedEnv);
}
function resolveGatewayPortFallback() {
	return readBestEffortConfig().then((cfg) => resolveGatewayPort(cfg, process.env)).catch(() => resolveGatewayPort(void 0, process.env));
}
async function assertUnmanagedGatewayRestartEnabled(port) {
	const cfg = await readBestEffortConfig().catch(() => void 0);
	const probe = await probeGateway({
		url: `${Boolean(cfg?.gateway?.tls?.enabled) ? "wss" : "ws"}://127.0.0.1:${port}`,
		auth: {
			token: normalizeOptionalString(process.env.OPENCLAW_GATEWAY_TOKEN),
			password: normalizeOptionalString(process.env.OPENCLAW_GATEWAY_PASSWORD)
		},
		timeoutMs: 1e3
	}).catch(() => null);
	if (!probe?.ok) return;
	if (!isRestartEnabled(probe.configSnapshot)) throw new Error("Gateway restart is disabled in the running gateway config (commands.restart=false); unmanaged SIGUSR1 restart would be ignored");
}
function resolveVerifiedGatewayListenerPids(port) {
	return findVerifiedGatewayListenerPidsOnPortSync(port).filter((pid) => Number.isFinite(pid) && pid > 0);
}
async function handleSystemScopeSystemdGateway(action) {
	if (process.platform !== "linux") return null;
	const installed = await findInstalledSystemdGatewayScope(process.env).catch(() => null);
	if (installed?.scope !== "system") return null;
	const stdout = createNullWriter();
	if (action === "stop") {
		await stopSystemdService({
			stdout,
			env: process.env
		});
		return {
			result: "stopped",
			message: `Gateway stopped via system-scope systemd unit ${installed.unitName}.`
		};
	}
	await restartSystemdService({
		stdout,
		env: process.env
	});
	return {
		result: "restarted",
		message: `Gateway restarted via system-scope systemd unit ${installed.unitName}.`
	};
}
async function stopGatewayWithoutServiceManager(port) {
	const managed = await handleSystemScopeSystemdGateway("stop");
	if (managed) return managed;
	const pids = resolveVerifiedGatewayListenerPids(port);
	if (pids.length === 0) return null;
	for (const pid of pids) signalVerifiedGatewayPidSync(pid, "SIGTERM");
	return {
		result: "stopped",
		message: `Gateway stop signal sent to unmanaged process${pids.length === 1 ? "" : "es"} on port ${port}: ${formatGatewayPidList(pids)}.`
	};
}
function resolveGatewayRestartIntentOptions(opts) {
	if (opts.force && opts.wait !== void 0) throw new Error("--force cannot be combined with --wait");
	if (opts.force) return { force: true };
	if (opts.wait !== void 0) return { waitMs: parseDurationMs(opts.wait) };
}
function formatSafeRestartWarnings(result) {
	if (result.preflight.blockers.length === 0) return;
	return [result.preflight.summary];
}
async function requestSafeGatewayRestart(opts) {
	if (opts.force) throw new Error("--safe cannot be combined with --force; omit --safe to force restart now");
	if (opts.wait !== void 0) throw new Error("--safe cannot be combined with --wait; safe restart uses gateway deferral");
	const skipDeferral = opts.skipDeferral === true;
	const params = { reason: "gateway.restart.safe" };
	if (skipDeferral) params.skipDeferral = true;
	const result = await callGatewayCli({
		method: "gateway.restart.request",
		params,
		timeoutMs: 1e4
	});
	const message = result.status === "coalesced" ? "safe restart request joined an existing pending gateway restart" : result.status === "deferred" ? "safe restart requested; gateway will restart after active work drains" : skipDeferral ? "safe restart requested; gateway bypassing active-work deferral" : "safe restart requested; gateway will restart momentarily";
	const payload = {
		ok: true,
		result: result.status,
		message,
		preflight: result.preflight,
		restart: result.restart,
		warnings: formatSafeRestartWarnings(result)
	};
	if (opts.json) defaultRuntime.log(JSON.stringify(payload, null, 2));
	else {
		defaultRuntime.log(message);
		if (result.preflight.blockers.length > 0) defaultRuntime.log(theme.warn(result.preflight.summary));
	}
	return true;
}
async function restartGatewayWithoutServiceManager(port, restartIntent) {
	const managed = await handleSystemScopeSystemdGateway("restart");
	if (managed) return managed;
	await assertUnmanagedGatewayRestartEnabled(port);
	const pids = resolveVerifiedGatewayListenerPids(port);
	if (pids.length === 0) return null;
	if (pids.length > 1) throw new Error(`multiple gateway processes are listening on port ${port}: ${formatGatewayPidList(pids)}; use "openclaw gateway status --deep" before retrying restart`);
	writeGatewayRestartIntentSync({
		targetPid: pids[0],
		reason: "gateway.restart",
		...restartIntent ? { intent: restartIntent } : {}
	});
	signalVerifiedGatewayPidSync(pids[0], "SIGUSR1");
	return {
		result: "restarted",
		message: `Gateway restart signal sent to unmanaged process on port ${port}: ${pids[0]}.`
	};
}
/** Uninstall the managed Gateway service after stopping it. */
async function runDaemonUninstall(opts = {}) {
	return await runServiceUninstall({
		serviceNoun: "Gateway",
		service: resolveGatewayService(),
		opts,
		stopBeforeUninstall: true,
		assertNotLoadedAfterUninstall: true
	});
}
/** Start the managed Gateway service, repairing stale service definitions when possible. */
async function runDaemonStart(opts = {}) {
	const service = resolveGatewayService();
	return await runServiceStart({
		serviceNoun: "Gateway",
		service,
		renderStartHints: renderGatewayServiceStartHints,
		onNotLoaded: process.platform === "darwin" ? async () => await recoverInstalledLaunchAgent({ result: "started" }) : void 0,
		repairLoadedService: async ({ json, stdout, warn, state, issues }) => await repairLoadedGatewayServiceForStart({
			service,
			json,
			stdout,
			warn,
			state,
			issues
		}),
		opts
	});
}
/** Stop the managed Gateway service or verified unmanaged listener fallback. */
async function runDaemonStop(opts = {}) {
	const service = resolveGatewayService();
	let gatewayPortPromise;
	return await runServiceStop({
		serviceNoun: "Gateway",
		service,
		opts,
		stopWhenNotLoaded: process.platform === "darwin" && Boolean(opts.disable),
		onNotLoaded: async () => {
			gatewayPortPromise ??= resolveGatewayLifecyclePort(service).catch(() => resolveGatewayPortFallback());
			return await stopGatewayWithoutServiceManager(await gatewayPortPromise);
		}
	});
}
/** Restart the Gateway service or a verified unmanaged listener, then prove health. */
async function runDaemonRestart(opts = {}) {
	if (opts.skipDeferral && !opts.safe) throw new Error("--skip-deferral requires --safe");
	if (opts.safe) return await requestSafeGatewayRestart(opts);
	const json = Boolean(opts.json);
	const service = resolveGatewayService();
	let restartedWithoutServiceManager = false;
	const restartIntent = resolveGatewayRestartIntentOptions(opts);
	const restartPort = await resolveGatewayLifecyclePort(service).catch(() => resolveGatewayPortFallback());
	const restartHealthAttempts = postRestartHealthAttempts();
	const restartWaitMs = restartHealthAttempts * POST_RESTART_HEALTH_DELAY_MS;
	const restartWaitSeconds = Math.round(restartWaitMs / 1e3);
	return await runServiceRestart({
		serviceNoun: "Gateway",
		service,
		renderStartHints: renderGatewayServiceStartHints,
		opts: {
			...opts,
			...restartIntent ? { restartIntent } : {}
		},
		checkTokenDrift: true,
		onNotLoaded: async () => {
			if (process.platform === "darwin") {
				const recovered = await recoverInstalledLaunchAgent({ result: "restarted" });
				if (recovered) return recovered;
			}
			const handled = await restartGatewayWithoutServiceManager(restartPort, restartIntent);
			if (handled) {
				restartedWithoutServiceManager = true;
				return handled;
			}
			return null;
		},
		postRestartCheck: async ({ warnings, fail, stdout, warn }) => {
			if (restartedWithoutServiceManager) {
				const health = await waitForGatewayHealthyListener({
					port: restartPort,
					attempts: restartHealthAttempts,
					delayMs: POST_RESTART_HEALTH_DELAY_MS
				});
				if (health.healthy) return;
				const diagnostics = renderGatewayPortHealthDiagnostics(health);
				const timeoutLine = `Timed out after ${restartWaitSeconds}s waiting for gateway port ${restartPort} to become healthy.`;
				if (!json) {
					defaultRuntime.log(theme.warn(timeoutLine));
					for (const line of diagnostics) defaultRuntime.log(theme.muted(line));
				} else {
					warnings.push(timeoutLine);
					warnings.push(...diagnostics);
				}
				fail(`Gateway restart timed out after ${restartWaitSeconds}s waiting for health checks.`, [formatCliCommand("openclaw gateway status --deep"), formatCliCommand("openclaw doctor")]);
				throw new Error("unreachable after gateway restart health failure");
			}
			let health = await waitForGatewayHealthyRestart({
				service,
				port: restartPort,
				attempts: restartHealthAttempts,
				delayMs: POST_RESTART_HEALTH_DELAY_MS,
				includeUnknownListenersAsStale: process.platform === "win32"
			});
			if (!health.healthy && health.staleGatewayPids.length > 0) {
				const staleMsg = `Found stale gateway process(es): ${health.staleGatewayPids.join(", ")}.`;
				warnings.push(staleMsg);
				if (!json) {
					defaultRuntime.log(theme.warn(staleMsg));
					defaultRuntime.log(theme.muted("Stopping stale process(es) and retrying restart..."));
				}
				await terminateStaleGatewayPids(health.staleGatewayPids);
				const retryRestart = await service.restart({
					env: process.env,
					stdout,
					warn
				});
				if (retryRestart.outcome === "scheduled") return retryRestart;
				health = await waitForGatewayHealthyRestart({
					service,
					port: restartPort,
					attempts: restartHealthAttempts,
					delayMs: POST_RESTART_HEALTH_DELAY_MS,
					includeUnknownListenersAsStale: process.platform === "win32"
				});
			}
			if (health.healthy) return;
			const diagnostics = renderRestartDiagnostics(health);
			const failure = formatRestartFailure({
				health,
				port: restartPort,
				timeoutSeconds: restartWaitSeconds
			});
			const runningNoPortLine = health.runtime.status === "running" && health.portUsage.status === "free" ? `Gateway process is running but port ${restartPort} is still free (startup hang/crash loop or very slow VM startup).` : null;
			if (!json) {
				defaultRuntime.log(theme.warn(failure.statusLine));
				if (runningNoPortLine) defaultRuntime.log(theme.warn(runningNoPortLine));
				for (const line of diagnostics) defaultRuntime.log(theme.muted(line));
			} else {
				warnings.push(failure.statusLine);
				if (runningNoPortLine) warnings.push(runningNoPortLine);
				warnings.push(...diagnostics);
			}
			fail(failure.failMessage, [formatCliCommand("openclaw gateway status --deep"), formatCliCommand("openclaw doctor")]);
			throw new Error("unreachable after gateway restart failure");
		}
	});
}
//#endregion
export { recoverInstalledLaunchAgent as a, runDaemonUninstall as i, runDaemonStart as n, runDaemonStop as r, runDaemonRestart as t };
