import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { l as resolveGatewayLaunchAgentLabel, p as resolveGatewaySystemdServiceName } from "./constants-CJCmIHb-.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { o as formatServiceInspectionReason } from "./service-inspection-error-axo4k_qi.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { t as formatConfigIssueLine } from "./issue-format-BQNShMey.mjs";
import { a as resolveGatewayRestartLogPath, o as resolveGatewaySupervisorLogPaths } from "./restart-logs-DcfskF2f.mjs";
import { t as formatGatewayHeapLimitReport } from "./gateway-heap-9PZ2gCSQ.mjs";
import { u as classifySystemdUnavailableDetail } from "./systemd-user-transport-ZcY1z7CT.mjs";
import { t as SERVICE_RUNTIME_AUDIT_CODES } from "./service-audit-runtime-C_chlP6B.mjs";
import { i as isSystemdStartLimitHit } from "./service-runtime-BuDPZetd.mjs";
import { i as formatRuntimeStatus, o as isSystemdUnavailableDetail, s as renderSystemdUnavailableHints, t as buildGatewayRuntimeRecoveryHints } from "./runtime-hints-DEzqKgi3.mjs";
import { r as isWSLEnv } from "./wsl-BqZ6SFne.mjs";
import { c as projectDaemonServiceForJson, d as resolveDaemonServiceInstallGuidance, f as resolveRuntimeStatusColor, p as safeDaemonEnv, t as createCliStatusTextStyles, u as resolveDaemonInstallBlockMessage } from "./shared-Ba-Zp0iU.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { a as resolvePluginVersionDriftTargets, i as resolvePluginVersionDriftRegistryLag, o as resolvePluginVersionDriftUpdateCommand } from "./plugin-version-drift-CKIIcvZc.mjs";
import { r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { n as formatGatewayRestartHandoffDiagnostic } from "./restart-handoff-Cb-qLJTf.mjs";
import { n as resolveControlUiLinks } from "./control-ui-links-eOymVKB5.mjs";
import { n as renderPortDiagnosticsForCli, r as resolvePortListeningAddresses, t as gatherDaemonStatus } from "./status.gather-DDlNHa2-.mjs";
import { s as formatHostDesktopStatus } from "./status-overview-values-DDrXo98p.mjs";
import { i as renderGatewayServiceCleanupHints } from "./inspect-BMBKoYK5.mjs";
import { n as formatForeignLaunchdJobs } from "./launchd-foreign-jobs-DCtTqNRv.mjs";
//#region src/cli/daemon-cli/status.print.version.ts
function formatCliVersionLine(cli) {
	if (!cli) return null;
	return cli.entrypoint ? `${cli.version} (${shortenHomePath(cli.entrypoint)})` : cli.version;
}
function printDaemonStatusVersions(status, { label, infoText, warnText }) {
	const gatewayVersion = status.rpc?.server?.version?.trim() || status.gateway?.version?.trim();
	const cliVersionLine = formatCliVersionLine(status.cli);
	const serviceInstallVersion = status.service.layout?.packageVersion?.trim();
	const serviceInstallLine = serviceInstallVersion ? status.service.layout?.packageRoot ? `${serviceInstallVersion} (${shortenHomePath(status.service.layout.packageRoot)})` : serviceInstallVersion : null;
	if (gatewayVersion) {
		if (cliVersionLine) defaultRuntime.log(`${label("CLI version:")} ${infoText(cliVersionLine)}`);
		defaultRuntime.log(`${label("Gateway version:")} ${infoText(gatewayVersion)}`);
		if (status.cli?.version && status.cli.version !== gatewayVersion) {
			defaultRuntime.error(warnText(`Warning: this OpenClaw command is version ${status.cli.version}, but the running Gateway is version ${gatewayVersion}.`));
			defaultRuntime.error(warnText("Check `openclaw --version`, `which openclaw`, and `openclaw gateway status --deep`; if this mismatch is unexpected, update PATH so `openclaw` points to the version you want, or reinstall the Gateway service from that same OpenClaw install."));
		}
		defaultRuntime.log("");
	} else if (serviceInstallLine) {
		if (cliVersionLine) defaultRuntime.log(`${label("CLI version:")} ${infoText(cliVersionLine)}`);
		defaultRuntime.log(`${label("Gateway service version:")} ${infoText(serviceInstallLine)}`);
		defaultRuntime.log(infoText("The Gateway did not report its own version."));
		if (status.service.targetRole !== "diagnostic-only" && status.cli?.version && serviceInstallVersion && status.cli.version !== serviceInstallVersion) {
			defaultRuntime.error(warnText(`Warning: this OpenClaw command is version ${status.cli.version}, but the installed Gateway service is version ${serviceInstallVersion}.`));
			const guidance = resolveDaemonServiceInstallGuidance(status.service.targetRole);
			if (guidance) defaultRuntime.error(warnText(guidance));
		}
		defaultRuntime.log("");
	}
}
//#endregion
//#region src/cli/daemon-cli/status.print.ts
function formatConnectionLine(connection) {
	return `${connection.pid ? `pid=${connection.pid}` : "pid=?"}${connection.ppid ? ` ppid=${connection.ppid}` : ""}${` ${connection.direction}`}${connection.command ? ` ${connection.command}` : ""}${connection.address ? ` ${connection.address}` : ""}${connection.commandLine ? ` cmd=${shortenHomePath(connection.commandLine)}` : ""}`;
}
function formatProbeEventLoop(eventLoop) {
	return `${eventLoop.degraded ? "degraded" : "ok"} max=${Math.round(eventLoop.delayMaxMs)}ms p99=${Math.round(eventLoop.delayP99Ms)}ms util=${eventLoop.utilization} cpu=${eventLoop.cpuCoreRatio}`;
}
function printDaemonStatus(status, opts) {
	if (opts.json) {
		defaultRuntime.writeJson({
			...status,
			service: projectDaemonServiceForJson(status.service, { includeDefinitionPaths: false })
		});
		return;
	}
	const { rich, label, accent, infoText, okText, warnText, errorText } = createCliStatusTextStyles();
	const spacer = () => defaultRuntime.log("");
	const installBlock = resolveDaemonInstallBlockMessage("gateway");
	const installCommand = formatCliCommand("openclaw gateway install");
	const reinstallCommand = formatCliCommand("openclaw gateway install --force");
	const { service, rpc, extraServices } = status;
	const managerUnavailable = service.inspectionReason === "service-manager-unavailable";
	const serviceTargetsProbe = service.targetRole !== "diagnostic-only";
	const diagnosticOnlySuffix = serviceTargetsProbe ? "" : ` ${infoText("(diagnostic only, not the probe target)")}`;
	const serviceLoaded = service.loadState.status === "loaded";
	const serviceStatus = serviceLoaded ? okText(service.loadedText) : warnText(service.loadState.status === "not-loaded" ? service.notLoadedText : "unknown");
	defaultRuntime.log(`${label("Service:")} ${accent(service.label)}${managerUnavailable ? "" : ` (${serviceStatus})`}${diagnosticOnlySuffix}`);
	if (managerUnavailable && (service.command || service.systemdInstallation && service.systemdInstallation.kind !== "none")) defaultRuntime.log(warnText("The recorded service unit is stale and was left unchanged."));
	const transport = service.runtime?.systemd?.transport;
	if (opts.deep && transport) defaultRuntime.log(`${label("Systemd transport:")} ${infoText(`${transport.kind} (${transport.kind === "machine" ? transport.user : transport.address})`)}`);
	if (status.logFile) defaultRuntime.log(`${label("File logs:")} ${infoText(shortenHomePath(status.logFile))}`);
	if (service.command?.programArguments?.length) defaultRuntime.log(`${label(managerUnavailable ? "Recorded command:" : "Command:")} ${infoText(service.command.programArguments.join(" "))}`);
	if (service.command?.sourcePath) defaultRuntime.log(`${label("Service file:")} ${infoText(shortenHomePath(service.command.sourcePath))}`);
	if (service.command?.reloadPending) {
		const systemctl = service.runtime?.systemd?.scope === "system" ? "sudo systemctl --system" : "systemctl --user";
		defaultRuntime.log(warnText(`Systemd reload: pending (run ${systemctl} daemon-reload)`));
	}
	if (service.command?.workingDirectory) defaultRuntime.log(`${label("Working dir:")} ${infoText(shortenHomePath(service.command.workingDirectory))}`);
	const daemonEnvLines = safeDaemonEnv(service.command?.environment);
	if (daemonEnvLines.length > 0) defaultRuntime.log(`${label("Service env:")} ${daemonEnvLines.join(" ")}`);
	if (service.gatewayHeap) defaultRuntime.log(`${label("Gateway heap:")} ${infoText(formatGatewayHeapLimitReport(service.gatewayHeap))}`);
	const hostDesktopValue = formatHostDesktopStatus(status.hostDesktop);
	defaultRuntime.log(`${label("Host desktop:")} ${infoText(hostDesktopValue)}`);
	spacer();
	if (service.configAudit?.issues.length) {
		defaultRuntime.error(warnText("Service config looks out of date or non-standard."));
		for (const issue of service.configAudit.issues) {
			const detail = issue.detail ? ` (${issue.detail})` : "";
			defaultRuntime.error(`${warnText("Service config issue:")} ${issue.message}${detail}`);
		}
		const runtimeNeedsAttention = service.configAudit.issues.some((issue) => Object.values(SERVICE_RUNTIME_AUDIT_CODES).some((code) => code === issue.code));
		const recommendation = managerUnavailable ? `Run "${formatCliCommand("openclaw doctor")}" for guidance about this recorded service unit.` : installBlock ?? (runtimeNeedsAttention ? `Recommendation: run "${formatCliCommand("openclaw doctor")}" interactively to resolve the runtime findings before reinstalling. Reinstalling alone may select the same runtime.` : `Recommendation: run "${formatCliCommand("openclaw doctor")}" interactively for guided checks, or reinstall with "${reinstallCommand}".`);
		defaultRuntime.error(warnText(recommendation));
	}
	if (status.config) {
		const cliCfg = `${shortenHomePath(status.config.cli.path)}${status.config.cli.exists ? "" : " (missing)"}${status.config.cli.valid ? "" : " (invalid)"}`;
		defaultRuntime.log(`${label("Config (cli):")} ${infoText(cliCfg)}`);
		if (!status.config.cli.valid && status.config.cli.issues?.length) for (const issue of status.config.cli.issues.slice(0, 5)) defaultRuntime.error(`${errorText("Config issue:")} ${formatConfigIssueLine(issue, "", { normalizeRoot: true })}`);
		if (status.config.cli.warnings?.length) {
			defaultRuntime.error(warnText("Config warnings:"));
			for (const warning of status.config.cli.warnings.slice(0, 5)) defaultRuntime.error(warnText(formatConfigIssueLine(warning, "-", { normalizeRoot: true })));
		}
		if (status.config.daemon) {
			const daemonCfg = `${shortenHomePath(status.config.daemon.path)}${status.config.daemon.exists ? "" : " (missing)"}${status.config.daemon.valid ? "" : " (invalid)"}`;
			defaultRuntime.log(`${label("Config (service):")} ${infoText(daemonCfg)}`);
			if (!status.config.daemon.valid && status.config.daemon.issues?.length) for (const issue of status.config.daemon.issues.slice(0, 5)) defaultRuntime.error(`${errorText("Service config issue:")} ${formatConfigIssueLine(issue, "", { normalizeRoot: true })}`);
			if (status.config.daemon !== status.config.cli && status.config.daemon.warnings?.length) {
				const warningsLabel = status.config.daemon.path === status.config.cli.path ? "Config warnings:" : "Service config warnings:";
				defaultRuntime.error(warnText(warningsLabel));
				for (const warning of status.config.daemon.warnings.slice(0, 5)) defaultRuntime.error(warnText(formatConfigIssueLine(warning, "-", { normalizeRoot: true })));
			}
		}
		if (status.config.mismatch) {
			defaultRuntime.error(errorText("Root cause: CLI and service are using different config paths (likely a profile/state-dir mismatch)."));
			const recovery = installBlock ?? `Fix: rerun \`${reinstallCommand}\` from the same --profile / OPENCLAW_STATE_DIR you expect.`;
			defaultRuntime.error(errorText(recovery));
		}
		spacer();
	}
	if (status.gateway) {
		const bindHost = status.gateway.bindHost ?? "n/a";
		defaultRuntime.log(`${label("Gateway:")} bind=${infoText(status.gateway.bindMode)} (${infoText(bindHost)}), port=${infoText(String(status.gateway.port))} (${infoText(status.gateway.portSource)})`);
		defaultRuntime.log(`${label("Probe target:")} ${infoText(status.gateway.probeUrl)}`);
		if (!(status.config?.daemon?.controlUi?.enabled ?? true)) defaultRuntime.log(`${label("Dashboard:")} ${warnText("disabled")}`);
		else {
			const links = status.gateway.controlUiLinks ?? resolveControlUiLinks({
				port: status.gateway.port,
				bind: status.gateway.bindMode,
				customBindHost: status.gateway.customBindHost,
				basePath: status.config?.daemon?.controlUi?.basePath,
				tlsEnabled: status.gateway.tlsEnabled === true
			});
			defaultRuntime.log(`${label("Dashboard:")} ${infoText(links.httpUrl)}`);
		}
		if (status.gateway.probeNote) defaultRuntime.log(`${label("Probe note:")} ${infoText(status.gateway.probeNote)}`);
		if (status.gateway.windowsFirewall?.severity === "warning") {
			defaultRuntime.error(warnText(`Windows firewall: ${status.gateway.windowsFirewall.message}`));
			for (const detail of status.gateway.windowsFirewall.details) defaultRuntime.error(warnText(`  ${detail}`));
		}
		spacer();
	}
	printDaemonStatusVersions(status, {
		label,
		infoText,
		warnText
	});
	const runtimeLine = formatRuntimeStatus(service.inspectionReason ? {
		...service.runtime,
		detail: void 0
	} : service.runtime);
	if (runtimeLine) {
		const runtimeColor = resolveRuntimeStatusColor(service.runtime?.status);
		defaultRuntime.log(`${label("Runtime:")} ${colorize(rich, runtimeColor, runtimeLine)}${diagnosticOnlySuffix}`);
	}
	if (service.restartHandoff) defaultRuntime.log(infoText(formatGatewayRestartHandoffDiagnostic(service.restartHandoff)));
	if (status.gateway?.lastShutdown) {
		const { reason, completedAtMs } = status.gateway.lastShutdown;
		defaultRuntime.log(`${label("Last shutdown:")} ${infoText(sanitizeTerminalText(reason ?? "unknown"))} at ${new Date(completedAtMs).toISOString()}`);
	}
	if (status.gateway?.duelingScopesWarning) defaultRuntime.error(warnText(sanitizeTerminalText(status.gateway.duelingScopesWarning)));
	if (rpc && !rpc.ok && serviceTargetsProbe && serviceLoaded && service.runtime?.status === "running") {
		if (rpc.timedOut && rpc.gatewayReached) defaultRuntime.log(warnText("Gateway accepted the connection, but the read probe timed out. Inspect event-loop load and retry before treating the service as unreachable."));
		else if (status.health?.healthy === true && status.health.staleGatewayPids.length === 0) defaultRuntime.log(warnText("Gateway process is running and owns the gateway port, so this is not a warm-up delay. Check the probe credentials/config, or restart the gateway and inspect its logs if it stays unresponsive."));
		else defaultRuntime.log(warnText("Warm-up: launch agents can take a few seconds. Try again shortly."));
	}
	if (rpc) {
		const probeLabel = rpc.kind === "read" ? "Read probe:" : "Connectivity probe:";
		if (rpc.ok) defaultRuntime.log(`${label(probeLabel)} ${okText("ok")}`);
		else {
			const timeoutStatus = rpc.gatewayReached ? rpc.eventLoop?.degraded ? "timed out under event-loop load" : "timed out after reaching Gateway" : "timed out before reaching Gateway";
			defaultRuntime.error(`${label(probeLabel)} ${rpc.timedOut ? warnText(timeoutStatus) : errorText("failed")}`);
			if (rpc.timedOut && rpc.eventLoop) defaultRuntime.error(`${label("Gateway event loop:")} ${warnText(formatProbeEventLoop(rpc.eventLoop))}`);
			if (rpc.url) defaultRuntime.error(`${label("Probe target:")} ${rpc.url}`);
			const lines = (rpc.error ?? "unknown").split(/\r?\n/).filter(Boolean);
			for (const line of lines.slice(0, 12)) defaultRuntime.error(`  ${errorText(line)}`);
			if (status.port?.status === "busy" && status.lastError) defaultRuntime.error(`${errorText("Last gateway error:")} ${status.lastError}`);
		}
		if (rpc.authWarning) defaultRuntime.error(`${label("Probe auth:")} ${warnText(rpc.authWarning)}`);
		const capability = rpc.capability ? rpc.capability.replaceAll("_", "-") : null;
		if (capability) defaultRuntime.log(`${label("Capability:")} ${infoText(capability)}`);
		spacer();
	}
	if (status.health && status.health.staleGatewayPids.length > 0 && service.runtime?.status === "running" && typeof service.runtime.pid === "number") {
		defaultRuntime.error(errorText(`Gateway runtime PID does not own the listening port. Other gateway process(es) are listening: ${status.health.staleGatewayPids.join(", ")}`));
		defaultRuntime.error(errorText(`Fix: run ${formatCliCommand("openclaw gateway restart")} and re-check with ${formatCliCommand("openclaw gateway status --deep")}.`));
		spacer();
	}
	if (status.connections?.established.length) {
		defaultRuntime.log(`${label("Established clients:")} ${infoText(String(status.connections.established.length))}`);
		for (const connection of status.connections.established.slice(0, 8)) defaultRuntime.log(`  ${infoText(formatConnectionLine(connection))}`);
		if (status.connections.established.length > 8) defaultRuntime.log(`  ${infoText(`... ${status.connections.established.length - 8} more connection(s)`)}`);
		defaultRuntime.log(warnText("If logs show protocol mismatch after rollback, stop stale OpenClaw client processes listed here and re-run gateway status."));
		spacer();
	}
	const serviceInspectionDetail = service.inspectionReason ? formatServiceInspectionReason(service.inspectionReason) : service.loadState.status === "unknown" ? service.loadState.detail : void 0;
	if (serviceInspectionDetail) {
		defaultRuntime.error(managerUnavailable ? warnText(serviceInspectionDetail) : errorText(`Service inspection failed: ${serviceInspectionDetail}`));
		if (!managerUnavailable) defaultRuntime.error(errorText(`Retry: ${formatCliCommand("openclaw gateway status --deep")}`));
		spacer();
	}
	const systemdUnavailableDetail = serviceInspectionDetail ?? service.runtime?.inspectionFailure?.detail ?? service.runtime?.detail;
	if (process.platform === "linux" && !service.inspectionReason && (serviceInspectionDetail !== void 0 || rpc?.ok !== true) && isSystemdUnavailableDetail(systemdUnavailableDetail)) {
		const serviceEnv = service.command?.environment ?? process.env;
		defaultRuntime.error(errorText("systemd user services unavailable."));
		for (const hint of renderSystemdUnavailableHints({
			wsl: isWSLEnv(serviceEnv),
			kind: classifySystemdUnavailableDetail(systemdUnavailableDetail),
			env: serviceEnv
		})) defaultRuntime.error(errorText(hint));
		spacer();
	}
	if (service.runtime?.missingUnit) {
		if (serviceTargetsProbe) {
			defaultRuntime.error(errorText("Service unit not found."));
			const recovery = installBlock ?? `Run: ${installCommand}`;
			defaultRuntime.error(errorText(recovery));
		} else defaultRuntime.log(infoText("Native service is not installed; diagnostic only, not the probe target."));
	} else if (service.runtime?.missingGuiSession || serviceLoaded && service.runtime?.status === "stopped") {
		const missingGuiSession = service.runtime.missingGuiSession;
		const startLimitHit = process.platform === "linux" && isSystemdStartLimitHit(service.runtime);
		defaultRuntime.error(errorText(missingGuiSession ? "LaunchAgent plist exists, but macOS has no usable GUI session for this user." : startLimitHit ? `systemd stopped restarting the gateway after repeated crashes; run ${formatCliCommand("openclaw gateway restart")} or inspect logs.` : "Service is loaded but not running (likely exited immediately)."));
		const env = service.command?.environment ?? process.env;
		for (const hint of buildGatewayRuntimeRecoveryHints({
			kind: missingGuiSession ? "gui-session" : "stopped",
			restartCommand: formatCliCommand("openclaw gateway restart", env),
			env,
			logFile: status.logFile,
			systemd: service.runtime?.systemd
		})) defaultRuntime.error(errorText(hint));
		if (!missingGuiSession) spacer();
	}
	if (service.runtime?.cachedLabel) {
		const env = service.command?.environment ?? process.env;
		const labelValue = resolveGatewayLaunchAgentLabel(env.OPENCLAW_PROFILE);
		const recovery = installBlock ?? `Clear with: launchctl bootout gui/$UID/${labelValue}\nThen reinstall: ${installCommand}`;
		defaultRuntime.error(errorText(`LaunchAgent label cached but plist missing. ${recovery}`));
		spacer();
	}
	if (service.foreignLaunchdInspectionError) {
		defaultRuntime.error(warnText(`Could not inspect foreign launchd jobs: ${sanitizeTerminalText(service.foreignLaunchdInspectionError)}`));
		spacer();
	}
	if (service.foreignLaunchdJobs?.length) {
		const shouldWarn = service.foreignLaunchdJobs.some((job) => job.keepAlive || job.gatewayActions.length > 0);
		if (shouldWarn) {
			defaultRuntime.error(warnText("Foreign launchd jobs detected (macOS)."));
			defaultRuntime.error(warnText(formatForeignLaunchdJobs(service.foreignLaunchdJobs)));
		} else {
			defaultRuntime.log(infoText("Other OpenClaw launchd jobs (macOS)"));
			defaultRuntime.log(infoText(formatForeignLaunchdJobs(service.foreignLaunchdJobs)));
		}
		const restarts = service.forcedRestartSummary;
		if (shouldWarn && restarts && restarts.count > 0) defaultRuntime.error(warnText(`${restarts.count} external forced Gateway restart(s) in the last ${Math.round(restarts.windowMs / 6e4)} minutes. Listed lifecycle jobs may be responsible; this is not proof of attribution.`));
		if (shouldWarn && service.foreignLaunchdJobs.some((job) => job.safeToRemove)) defaultRuntime.error(warnText(`Remove confirmed stray Gateway lifecycle jobs with ${formatCliCommand("openclaw doctor --fix")}.`));
		spacer();
	}
	const staleUpdateLaunchdJobs = service.staleUpdateLaunchdJobs?.filter((job) => !service.foreignLaunchdJobs?.some((foreign) => foreign.label === job.label));
	if (staleUpdateLaunchdJobs?.length) {
		defaultRuntime.error(errorText("Stale OpenClaw updater launchd job(s) detected."));
		for (const job of staleUpdateLaunchdJobs) {
			const exitStatus = job.lastExitStatus !== void 0 ? `, last exit ${job.lastExitStatus}` : "";
			const pid = job.pid !== void 0 ? `, pid ${job.pid}` : "";
			defaultRuntime.error(errorText(`- ${job.label}${pid}${exitStatus}`));
		}
		defaultRuntime.error(errorText(`Fix after confirming no update is running: launchctl remove <label>, then run ${formatCliCommand("openclaw gateway restart")}.`));
		spacer();
	}
	for (const line of renderPortDiagnosticsForCli(status, rpc?.ok)) defaultRuntime.error(errorText(line));
	if (status.port) {
		const addrs = resolvePortListeningAddresses(status);
		if (addrs.length > 0) defaultRuntime.log(`${label("Listening:")} ${infoText(addrs.join(", "))}`);
	}
	if (status.portCli && status.portCli.port !== status.port?.port) defaultRuntime.log(`${label("Note:")} CLI config resolves gateway port=${status.portCli.port} (${status.portCli.status}).`);
	if (serviceTargetsProbe && serviceLoaded && service.runtime?.status === "running" && status.port && status.port.status === "free") {
		defaultRuntime.error(errorText(`Gateway port ${status.port.port} is not listening (service appears running).`));
		const serviceEnv = {
			...process.env,
			...service.command?.environment
		};
		if (status.lastError) defaultRuntime.error(`${errorText("Last gateway error:")} ${status.lastError}`);
		if (process.platform === "linux") {
			const unit = service.runtime?.systemd?.unit ?? `${resolveGatewaySystemdServiceName(serviceEnv.OPENCLAW_PROFILE)}.service`;
			const scope = service.runtime?.systemd?.scope === "system" ? "--system" : "--user";
			defaultRuntime.error(errorText(`Logs: journalctl ${scope} -u ${quoteCliArg(unit)} -n 200 --no-pager`));
		} else if (process.platform === "darwin") {
			const logs = resolveGatewaySupervisorLogPaths(serviceEnv, { platform: "darwin" });
			defaultRuntime.error(`${errorText("Logs (stdout and stderr):")} ${shortenHomePath(logs.stdoutPath)}`);
		}
		defaultRuntime.error(`${errorText("Restart log:")} ${shortenHomePath(resolveGatewayRestartLogPath(serviceEnv))}`);
		spacer();
	}
	if (extraServices.length > 0) {
		defaultRuntime.log(warnText("Other gateway-like services detected (best effort):"));
		for (const svc of extraServices) defaultRuntime.log(`- ${warnText(svc.label)} (${svc.scope}, ${svc.detail})`);
		for (const svc of extraServices) {
			const hintLabel = svc.platform === "linux" ? "Inspection hint:" : "Cleanup hint:";
			for (const hint of renderGatewayServiceCleanupHints([svc])) defaultRuntime.log(`${infoText(hintLabel)} ${hint}`);
		}
		spacer();
	}
	const drift = status.pluginVersionDrift;
	if (drift && drift.drifts.length > 0) {
		defaultRuntime.log(warnText(`Plugin version drift: ${drift.drifts.length} active official plugin${drift.drifts.length === 1 ? "" : "s"} not on gateway ${drift.gatewayVersion}`));
		if (opts.deep) {
			for (const entry of drift.drifts) {
				const sourceLabel = entry.source === "clawhub" ? "clawhub" : "npm";
				const resolvedTarget = entry.targetResolution?.status === "resolved" ? `; ${sourceLabel} target ${entry.targetResolution.packageName}@${entry.targetResolution.version}` : "";
				const expectedVersion = entry.targetResolution?.status === "resolved" ? entry.targetResolution.version : drift.gatewayVersion;
				defaultRuntime.log(`- ${warnText(entry.pluginId)}: ${entry.installedVersion} (${sourceLabel}) → expected ${expectedVersion}${resolvedTarget}`);
			}
			const repairs = drift.drifts.map((entry) => ({
				entry,
				command: resolvePluginVersionDriftUpdateCommand(entry)
			}));
			const updateCommands = repairs.map(({ command }) => command).filter((command) => Boolean(command)).map((command) => formatCliCommand(command));
			const unresolvedRepairs = repairs.filter(({ entry, command }) => !command && !resolvePluginVersionDriftRegistryLag(entry));
			for (const { entry } of repairs) {
				const registryLag = resolvePluginVersionDriftRegistryLag(entry);
				if (registryLag) defaultRuntime.log(`- ${entry.pluginId}: registry version ${registryLag.registryVersion} is already installed; no release reaches ${registryLag.expectedVersion} yet, so no update command applies.`);
			}
			if (unresolvedRepairs.length > 0) {
				defaultRuntime.error(errorText("Plugin repair target resolution failed:"));
				for (const { entry } of unresolvedRepairs) {
					const targetResolution = entry.targetResolution;
					const detail = targetResolution?.status === "unresolved" ? targetResolution.error : "npm registry target was not resolved";
					defaultRuntime.error(`- ${entry.pluginId}: ${detail}`);
				}
				defaultRuntime.error(errorText("No install command was generated for unresolved plugin targets. Retry gateway status --deep after checking registry availability."));
			}
			if (updateCommands.length === 1 && unresolvedRepairs.length === 0) defaultRuntime.log(`${label("Fix:")} ${updateCommands[0]} && ${formatCliCommand("openclaw gateway restart")}.`);
			else if (updateCommands.length > 0) {
				defaultRuntime.log(`${label("Fix:")} update each drifted plugin:`);
				for (const command of updateCommands) defaultRuntime.log(`- ${command}`);
				if (unresolvedRepairs.length === 0) defaultRuntime.log(`Then run ${formatCliCommand("openclaw gateway restart")}.`);
			}
		} else defaultRuntime.log(infoText(`Run ${formatCliCommand("openclaw gateway status --deep")} for affected plugin ids and fix commands.`));
		spacer();
	}
	if (extraServices.length > 0) {
		defaultRuntime.log(infoText("Recommendation: run a single gateway per machine for most setups. One gateway supports multiple agents (see docs: /gateway#multiple-gateways-same-host)."));
		defaultRuntime.log(infoText("If you need multiple gateways (e.g., a rescue bot on the same host), isolate ports + config/state (see docs: /gateway#multiple-gateways-same-host)."));
		spacer();
	}
	defaultRuntime.log(`${label("Troubles:")} run ${formatCliCommand("openclaw status")}`);
	defaultRuntime.log(`${label("Troubleshooting:")} https://docs.openclaw.ai/troubleshooting`);
}
//#endregion
//#region src/cli/daemon-cli/status.ts
function failDaemonStatus(opts, message) {
	if (opts.json) defaultRuntime.writeJson(formatCliJsonFailure(message));
	else defaultRuntime.error(colorize(isRich(), theme.error, message));
	defaultRuntime.exit(1);
}
/** Run Gateway status diagnostics and apply --require-rpc exit behavior. */
async function runDaemonStatus(opts) {
	if (opts.requireRpc && !opts.probe) {
		failDaemonStatus(opts, "Gateway status failed: --require-rpc needs probing enabled. Remove --no-probe or drop --require-rpc.");
		return;
	}
	let status;
	try {
		status = await gatherDaemonStatus({
			rpc: opts.rpc,
			probe: opts.probe,
			requireRpc: opts.requireRpc,
			deep: opts.deep === true
		});
		if (opts.deep && status.pluginVersionDrift) status.pluginVersionDrift = await resolvePluginVersionDriftTargets(status.pluginVersionDrift);
		printDaemonStatus(status, {
			json: opts.json,
			deep: opts.deep === true
		});
	} catch (err) {
		failDaemonStatus(opts, `Gateway status failed: ${formatErrorMessage(err)}`);
		return;
	}
	if (opts.requireRpc && !status.rpc?.ok) defaultRuntime.exit(1);
}
//#endregion
export { runDaemonStatus as t };
