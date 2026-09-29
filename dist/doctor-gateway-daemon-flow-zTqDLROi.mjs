import { t as ExitError } from "./runtime-BC29JSZp.mjs";
import { h as resolveNodeLaunchAgentLabel, l as resolveGatewayLaunchAgentLabel, p as resolveGatewaySystemdServiceName } from "./constants-CJCmIHb-.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { o as isDefaultInstallIdentity, v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { a as getResolvedLoggerSettings } from "./logger--ALOusOG.mjs";
import { t as ensureSqliteLibrarySelected } from "./bun-sqlite-library-GOquVAYK.mjs";
import { n as NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON } from "./gateway-supervision-dG8swyHC.mjs";
import "./config-Ciq2mxdN.mjs";
import { n as gatewayInstallErrorHint, t as buildGatewayInstallPlan } from "./daemon-install-helpers-Bky3P_UA.mjs";
import { n as GATEWAY_DAEMON_RUNTIME_OPTIONS, t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-D15REPfs.mjs";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-DvAunsR_.mjs";
import { g as resolveGatewayBindHost, v as resolveGatewayRequiredListenHosts } from "./net-DU4aWKLv.mjs";
import { u as classifySystemdUnavailableDetail } from "./systemd-user-transport-ZcY1z7CT.mjs";
import { i as isLaunchAgentLoaded, s as launchAgentPlistExists } from "./launchd-runtime-CWqPktfP.mjs";
import { a as isExpectedGatewayListeners, r as formatPortDiagnostics } from "./ports-format-CGjX8vQM.mjs";
import { n as inspectPortUsage, t as inspectPortConnections } from "./ports-inspect-DXXAw_y-.mjs";
import { r as repairLaunchAgentBootstrap } from "./launchd-CnSNukLu.mjs";
import { i as isSystemdStartLimitHit, n as getSystemdCgroupHygieneSummary, r as isSystemdCgroupHygieneRisk } from "./service-runtime-BuDPZetd.mjs";
import { a as resolveGatewayService, i as readGatewayServiceState, t as describeGatewayServiceRestart } from "./service-BCULlL85.mjs";
import { i as formatRuntimeStatus, o as isSystemdUnavailableDetail, s as renderSystemdUnavailableHints, t as buildGatewayRuntimeRecoveryHints } from "./runtime-hints-DEzqKgi3.mjs";
import { r as isWSLEnv, t as isWSL } from "./wsl-BqZ6SFne.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { n as readLastGatewayErrorLine } from "./diagnostics-DKU-rtTl.mjs";
import { n as formatGatewayRestartHandoffDiagnostic, r as readGatewayRestartHandoffSync } from "./restart-handoff-Cb-qLJTf.mjs";
import { r as findSystemGatewayServices } from "./inspect-BMBKoYK5.mjs";
import "./logging-CrcvifP_.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { t as resolveGatewaySetupRuntime } from "./gateway-setup-runtime-CE2bR8AJ.mjs";
import { i as formatHealthCheckFailure, n as formatGatewayClosedDiagnostic } from "./health-format-dbbKwHdv.mjs";
import { a as healthCommandNonExiting } from "./health-UMPZgcnB.mjs";
import { a as isServiceRepairDeferred, i as formatServiceRepairDeferredNote, l as shouldManageGatewayService, r as confirmDoctorServiceRepair, s as resolveServiceRepairPolicy, t as SERVICE_REPAIR_POLICY_ENV } from "./doctor-service-repair-policy-B56mlGZD.mjs";
//#region src/commands/doctor-format.ts
/** Formatting helpers for gateway runtime summaries and doctor repair hints. */
/** Formats the platform-specific gateway service runtime into a compact status line. */
function formatGatewayRuntimeSummary(runtime) {
	return formatRuntimeStatus(runtime);
}
/** Builds follow-up hints for stopped, missing, or unhealthy gateway service runtimes. */
function buildGatewayRuntimeHints(runtime, options = {}) {
	const hints = [];
	if (!runtime) return hints;
	const platform = options.platform ?? process.platform;
	const env = options.env ?? process.env;
	const fileLog = (() => {
		try {
			return getResolvedLoggerSettings().file;
		} catch {
			return null;
		}
	})();
	const systemdDetail = runtime.inspectionFailure?.detail ?? runtime.detail;
	if (platform === "linux" && isSystemdUnavailableDetail(systemdDetail)) {
		hints.push(...renderSystemdUnavailableHints({
			wsl: isWSLEnv(env),
			kind: classifySystemdUnavailableDetail(systemdDetail),
			env
		}));
		if (fileLog) hints.push(`File logs: ${fileLog}`);
		return hints;
	}
	if (runtime.cachedLabel && platform === "darwin") {
		const label = resolveGatewayLaunchAgentLabel(env.OPENCLAW_PROFILE);
		hints.push(`LaunchAgent label cached but plist missing. Clear with: launchctl bootout gui/$UID/${label}`);
		hints.push(`Then reinstall: ${formatCliCommand("openclaw gateway install", env)}`);
	}
	if (runtime.missingUnit) {
		hints.push(`Service not installed. Run: ${formatCliCommand("openclaw gateway install", env)}`);
		if (fileLog) hints.push(`File logs: ${fileLog}`);
		return hints;
	}
	const missingGuiSession = runtime.missingGuiSession && platform === "darwin";
	if (missingGuiSession || runtime.status === "stopped") {
		if (!missingGuiSession && platform === "linux" && isSystemdStartLimitHit(runtime)) hints.push("systemd stopped restarting the gateway after repeated crashes.", `Recover with: ${formatCliCommand("openclaw gateway restart", env)}, then inspect logs if it keeps crashing.`);
		else if (!missingGuiSession) hints.push("Service is loaded but not running (likely exited immediately).");
		hints.push(...buildGatewayRuntimeRecoveryHints({
			kind: missingGuiSession ? "gui-session" : "stopped",
			restartCommand: formatCliCommand("openclaw gateway restart", env),
			logFile: fileLog,
			platform,
			env,
			systemd: runtime.systemd
		}));
		if (missingGuiSession) return hints;
	}
	if (platform === "linux" && isSystemdCgroupHygieneRisk(runtime.systemd)) {
		const unit = quoteCliArg(runtime.systemd?.unit ?? `${resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE)}.service`);
		const system = runtime.systemd?.scope === "system";
		const summary = getSystemdCgroupHygieneSummary(runtime.systemd);
		if (summary) hints.push(`Systemd cgroup hygiene looks elevated: ${summary}.`, "This usually means old helper or browser processes may still be attached to the gateway service.", `Run: systemctl ${system ? "--system" : "--user"} show ${unit} -p KillMode -p TasksCurrent -p MemoryCurrent -p MainPID`, `Run: systemd-cgls ${system ? "--unit" : "--user-unit"} ${unit}`, `After reviewing service settings, run: ${formatCliCommand("openclaw gateway restart", env)}`);
	}
	return hints;
}
//#endregion
//#region src/commands/doctor-gateway-daemon-flow.ts
/** Doctor gateway daemon repair flow for service install, bootstrap, restart, and port hints. */
function noteGatewayRuntime(serviceRuntime, env) {
	const summary = formatGatewayRuntimeSummary(serviceRuntime);
	const hints = buildGatewayRuntimeHints(serviceRuntime, {
		platform: process.platform,
		env
	});
	const lines = summary ? [`Runtime: ${summary}`, ...hints] : hints;
	const sqliteLibrary = ensureSqliteLibrarySelected();
	if (sqliteLibrary.source !== "runtime") lines.push(`SQLite (doctor process): ${sqliteLibrary.path} (${sqliteLibrary.version}, extension loading enabled)`);
	else if (sqliteLibrary.ignoredOverride) lines.push(`SQLite (doctor process): ${sqliteLibrary.ignoredOverride}; override ignored`);
	if (lines.length > 0) note(lines.join("\n"), "Gateway");
}
async function maybeRepairLaunchAgentBootstrap(params) {
	if (process.platform !== "darwin" || !await launchAgentPlistExists(params.env) || await isLaunchAgentLoaded({ env: params.env })) return { status: "skipped" };
	note("LaunchAgent is installed but not loaded in launchd.", `${params.title} LaunchAgent`);
	if (params.serviceRepairDeferred) {
		note(formatServiceRepairDeferredNote(), `${params.title} LaunchAgent`);
		return { status: "not-loaded" };
	}
	if (!await confirmDoctorServiceRepair(params.prompter, {
		message: `Repair ${params.title} LaunchAgent bootstrap now?`,
		initialValue: true
	})) return { status: "not-loaded" };
	params.runtime.log(`Bootstrapping ${params.title} LaunchAgent...`);
	const repair = await repairLaunchAgentBootstrap({ env: params.env });
	if (!repair.ok) {
		if (repair.status === "system-launchdaemon-conflict" || repair.status === "system-launchdaemon-unverifiable") return {
			status: "system-launchdaemon-blocked",
			detail: repair.detail
		};
		if (repair.status === "gui-session-unavailable") return {
			status: "gui-session-unavailable",
			detail: repair.detail
		};
		params.runtime.error(`${params.title} LaunchAgent bootstrap failed: ${repair.detail ?? "unknown error"}`);
		return { status: "not-loaded" };
	}
	if (!await isLaunchAgentLoaded({ env: params.env })) {
		params.runtime.error(`${params.title} LaunchAgent still not loaded after repair.`);
		return { status: "not-loaded" };
	}
	note(`${params.title} LaunchAgent repaired.`, `${params.title} LaunchAgent`);
	return { status: "repaired" };
}
function renderBlockingSystemGatewayServices(services) {
	return [
		"System-level OpenClaw gateway service detected while the user gateway service is not installed.",
		...services.map((svc) => `- ${svc.label} (${svc.detail})`),
		"OpenClaw will not install a second user-level gateway service automatically.",
		"Run `openclaw gateway status --deep` or `openclaw doctor --deep` to inspect duplicate services.",
		`Set ${SERVICE_REPAIR_POLICY_ENV}=external if a system supervisor owns the gateway lifecycle.`
	].join("\n");
}
function renderEstablishedGatewayConnections(connections) {
	return [
		"Established Gateway TCP clients detected:",
		...connections.slice(0, 8).map((connection) => {
			return `- ${connection.pid ? `pid=${connection.pid}` : "pid=?"} ${connection.direction}${connection.command ? ` ${connection.command}` : ""}${connection.address ? ` ${connection.address}` : ""}${connection.commandLine ? ` cmd=${connection.commandLine}` : ""}`;
		}),
		...connections.length > 8 ? [`- ... ${connections.length - 8} more connection(s)`] : [],
		"If logs show protocol mismatch after rollback, stop stale OpenClaw client processes listed here and rerun doctor."
	].join("\n");
}
async function maybeReportEstablishedGatewayClients(cfg, deep, port) {
	if (!deep) return;
	const targetPort = port ?? resolveGatewayPort(cfg, process.env);
	const clients = (await inspectPortConnections(targetPort).catch(() => null))?.connections.filter(({ direction }) => direction !== "server");
	if (clients?.length) note(renderEstablishedGatewayConnections(clients), "Gateway clients");
}
async function noteGatewayPortDiagnostics(cfg, deep) {
	const port = resolveGatewayPort(cfg, process.env);
	const bindHost = await resolveGatewayBindHost(cfg.gateway?.bind ?? "loopback", cfg.gateway?.customBindHost);
	const diagnostics = await inspectPortUsage(port, { probeHosts: resolveGatewayRequiredListenHosts(bindHost) });
	await maybeReportEstablishedGatewayClients(cfg, deep, port);
	const conflict = diagnostics.status === "busy" && !isExpectedGatewayListeners(diagnostics.listeners, diagnostics.port);
	if (conflict) note(formatPortDiagnostics(diagnostics).join("\n"), "Gateway port");
	return conflict;
}
async function noteGatewayServiceInspectionFailure(loadState) {
	const lines = [`Gateway service status could not be determined: ${loadState.detail}`];
	const kind = process.platform === "linux" && classifySystemdUnavailableDetail(loadState.detail);
	if (kind) lines.push(...renderSystemdUnavailableHints({
		wsl: await isWSL(),
		kind
	}));
	lines.push(`Run ${formatCliCommand("openclaw gateway status --deep")} and retry doctor.`);
	note(lines.join("\n"), "Gateway");
}
/**
* Repairs or diagnoses the local gateway service after the health check fails.
*
* Remote gateway mode is only diagnosed; local mode may bootstrap launchd, install missing
* services, report port conflicts, or restart unhealthy supervision when policy allows.
*/
async function maybeRepairGatewayDaemon(params) {
	if (!isDefaultInstallIdentity(process.env)) {
		note(NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON, "Gateway");
		return;
	}
	if (params.cfg.gateway?.mode === "remote") return;
	if (params.healthOk) {
		await maybeReportEstablishedGatewayClients(params.cfg, params.options.deep ?? false);
		return;
	}
	if (!await shouldManageGatewayService()) {
		await noteGatewayPortDiagnostics(params.cfg, params.options.deep ?? false);
		note(formatServiceRepairDeferredNote(), "Gateway");
		return;
	}
	const serviceRepairPolicy = resolveServiceRepairPolicy();
	const serviceRepairDeferred = isServiceRepairDeferred(serviceRepairPolicy);
	const service = resolveGatewayService();
	const restartGatewayService = async () => {
		try {
			return await service.restart({
				env: process.env,
				stdout: process.stdout
			});
		} catch (error) {
			const detail = error instanceof Error ? error.message : String(error);
			note(`Gateway service restart failed: ${detail}`, "Gateway");
			return null;
		}
	};
	const isLocalDarwinGateway = process.platform === "darwin";
	const serviceState = await readGatewayServiceState(service, { env: process.env });
	if (serviceState.loadState.status === "unknown") {
		await noteGatewayServiceInspectionFailure(serviceState.loadState);
		return;
	}
	let loaded = serviceState.loadState.status === "loaded";
	let serviceRuntime = serviceState.runtime;
	const serviceEnv = serviceState.env;
	if (params.options.deep) {
		const handoff = readGatewayRestartHandoffSync(serviceEnv);
		if (handoff) note(formatGatewayRestartHandoffDiagnostic(handoff), "Gateway");
	}
	if (isLocalDarwinGateway) {
		const gatewayRepair = serviceRuntime?.missingGuiSession ? {
			status: "gui-session-unavailable",
			detail: serviceRuntime.detail ?? ""
		} : await maybeRepairLaunchAgentBootstrap({
			env: process.env,
			title: "Gateway",
			runtime: params.runtime,
			prompter: params.prompter,
			serviceRepairDeferred
		});
		await maybeRepairLaunchAgentBootstrap({
			env: {
				...process.env,
				OPENCLAW_LAUNCHD_LABEL: resolveNodeLaunchAgentLabel()
			},
			title: "Node",
			runtime: params.runtime,
			prompter: params.prompter,
			serviceRepairDeferred
		});
		if (gatewayRepair.status === "not-loaded") return;
		if (gatewayRepair.status === "system-launchdaemon-blocked") {
			note(gatewayRepair.detail, "Gateway");
			return;
		}
		if (gatewayRepair.status === "gui-session-unavailable") serviceRuntime = {
			status: "unknown",
			detail: gatewayRepair.detail || serviceRuntime?.detail,
			missingGuiSession: true
		};
		if (gatewayRepair.status === "repaired") {
			const repairedState = await readGatewayServiceState(service, { env: process.env });
			if (repairedState.loadState.status === "unknown") {
				await noteGatewayServiceInspectionFailure(repairedState.loadState);
				return;
			}
			loaded = repairedState.loadState.status === "loaded";
			serviceRuntime = repairedState.runtime;
		}
	}
	if (isLocalDarwinGateway && serviceRuntime?.systemLaunchDaemon) {
		noteGatewayRuntime(serviceRuntime, process.env);
		return;
	}
	if (!await noteGatewayPortDiagnostics(params.cfg, params.options.deep ?? false) && loaded && serviceRuntime?.status === "running") {
		const lastError = await readLastGatewayErrorLine(process.env);
		if (lastError) note(`Last gateway error: ${lastError}`, "Gateway");
	}
	if (!loaded) {
		if (isLocalDarwinGateway && (serviceRuntime?.missingGuiSession || serviceRuntime?.cachedLabel || serviceRuntime?.systemLaunchDaemon)) {
			noteGatewayRuntime(serviceRuntime, process.env);
			return;
		}
		note("Gateway service not installed.", "Gateway");
		if (process.platform === "linux") {
			const systemGatewayServices = await findSystemGatewayServices();
			if (systemGatewayServices.length > 0) {
				note(renderBlockingSystemGatewayServices(systemGatewayServices), "Gateway");
				return;
			}
		}
		if (serviceRepairDeferred) {
			note(formatServiceRepairDeferredNote(), "Gateway");
			return;
		}
		const install = await confirmDoctorServiceRepair(params.prompter, {
			message: "Install gateway service now?",
			initialValue: true,
			requiresInteractiveConfirmation: true
		}, serviceRepairPolicy);
		if (!install) note(`Run ${formatCliCommand("openclaw gateway install")} when you want to install the gateway service.`, "Gateway");
		if (install) {
			const selection = await resolveGatewaySetupRuntime({
				env: process.env,
				existingCommand: serviceState.command,
				selectRuntime: () => params.prompter.select({
					message: "Gateway service runtime",
					options: GATEWAY_DAEMON_RUNTIME_OPTIONS,
					initialValue: DEFAULT_GATEWAY_DAEMON_RUNTIME
				}, DEFAULT_GATEWAY_DAEMON_RUNTIME)
			});
			const tokenResolution = await resolveGatewayInstallToken({
				config: params.cfg,
				env: process.env
			});
			for (const warning of tokenResolution.warnings) note(warning, "Gateway");
			if (tokenResolution.unavailableReason) {
				note([
					"Gateway service install aborted.",
					tokenResolution.unavailableReason,
					"Fix gateway auth config/token input and rerun doctor."
				].join("\n"), "Gateway");
				return;
			}
			const port = resolveGatewayPort(params.cfg, process.env);
			const plan = await buildGatewayInstallPlan({
				env: selection.env,
				port,
				runtime: selection.runtime,
				pinnedRuntimePath: selection.pinnedRuntimePath,
				existingCommand: serviceState.command,
				warn: (message, title) => note(message, title),
				config: params.cfg
			});
			try {
				await service.install({
					env: process.env,
					stdout: process.stdout,
					...plan,
					runtimePinUpdate: selection.runtimePinUpdate
				});
			} catch (err) {
				note(`Gateway service install failed: ${String(err)}`, "Gateway");
				note(gatewayInstallErrorHint(), "Gateway");
			}
		}
		return;
	}
	noteGatewayRuntime(serviceRuntime, process.env);
	if (serviceRuntime?.status !== "running") {
		if (params.healthSkipped && serviceRuntime?.status !== "stopped") return;
		if (serviceRepairDeferred) {
			note(formatServiceRepairDeferredNote(), "Gateway");
			return;
		}
		if (await confirmDoctorServiceRepair(params.prompter, {
			message: "Start gateway service now?",
			initialValue: true
		}, serviceRepairPolicy)) {
			const restartResult = await restartGatewayService();
			if (!restartResult) return;
			const restartStatus = describeGatewayServiceRestart("Gateway", restartResult);
			if (!restartStatus.scheduled) await sleep(1500);
			else note(restartStatus.message, "Gateway");
		}
	}
	if (process.platform === "darwin") {
		const label = resolveGatewayLaunchAgentLabel(process.env.OPENCLAW_PROFILE);
		note(`LaunchAgent loaded; stopping requires "${formatCliCommand("openclaw gateway stop")}" or launchctl bootout gui/$UID/${label}.`, "Gateway");
	}
	if (serviceRuntime?.status === "running") {
		if (params.healthSkipped) return;
		if (serviceRepairDeferred) {
			note(formatServiceRepairDeferredNote(), "Gateway");
			return;
		}
		if (readGatewayRestartHandoffSync(serviceEnv)) try {
			await healthCommandNonExiting({
				json: false,
				config: params.cfg
			}, params.runtime);
			note("Preserving the recent Gateway restart; skipping restart prompt.", "Gateway");
			return;
		} catch {}
		if (params.options.nonInteractive === true) return;
		if (await confirmDoctorServiceRepair(params.prompter, {
			message: "Restart gateway service now?",
			initialValue: false
		}, serviceRepairPolicy)) {
			const restartResult = await restartGatewayService();
			if (!restartResult) return;
			const restartStatus = describeGatewayServiceRestart("Gateway", restartResult);
			if (restartStatus.scheduled) {
				note(restartStatus.message, "Gateway");
				return;
			}
			try {
				await healthCommandNonExiting({
					json: false,
					config: params.cfg
				}, params.runtime);
			} catch (err) {
				if (err instanceof ExitError) return;
				const closedDiagnostic = formatGatewayClosedDiagnostic(err);
				if (closedDiagnostic) {
					note(closedDiagnostic, "Gateway");
					note(params.gatewayDetailsMessage, "Gateway connection");
				} else params.runtime.error(formatHealthCheckFailure(err));
			}
		}
	}
}
//#endregion
export { maybeRepairGatewayDaemon };
