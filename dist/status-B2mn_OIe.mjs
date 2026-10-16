import { m as resolveGatewaySystemdServiceName, u as resolveGatewayLaunchAgentLabel } from "./constants-BLghGsId.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { t as formatConfigIssueLine } from "./issue-format-L1jxHK43.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { r as formatCliJsonFailure } from "./failure-output-gtb9zaTk.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { a as buildGatewayRuntimeRecoveryHints, i as renderSystemdUnavailableHints, r as isSystemdUnavailableDetail, t as formatRuntimeStatus } from "./runtime-format-C0Herh-B.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { a as resolveGatewayRestartLogPath, o as resolveGatewaySupervisorLogPaths } from "./restart-logs-6OI2aKFf.mjs";
import { s as formatServiceInspectionReason } from "./service-inspection-error-Bsltcpi4.mjs";
import { o as classifySystemdUnavailableDetail } from "./systemd-user-transport-vKPIfcG5.mjs";
import { r as isWSLEnv } from "./wsl-DAucJ7y0.mjs";
import { c as projectDaemonServiceForJson, d as resolveDaemonServiceInstallGuidance, f as resolveRuntimeStatusColor, p as safeDaemonEnv, t as createCliStatusTextStyles, u as resolveDaemonInstallBlockMessage } from "./shared-DejcqFfy.mjs";
import { a as isSystemdStartLimitHit } from "./service-runtime-Cbp6mAbj.mjs";
import { t as formatGatewayHeapLimitReport } from "./gateway-heap-DTqeZ8TX.mjs";
import { i as renderGatewayServiceCleanupHints } from "./inspect-DCUvd-st.mjs";
import { a as resolvePluginVersionDriftTargets, i as resolvePluginVersionDriftRegistryLag, o as resolvePluginVersionDriftUpdateCommand } from "./plugin-version-drift-BsJ4AHQ4.mjs";
import { n as formatGatewayRestartHandoffDiagnostic } from "./restart-handoff-HHx3Pddl.mjs";
import { n as resolveControlUiLinks } from "./control-ui-links-CvxEAkDu.mjs";
import { t as SERVICE_RUNTIME_AUDIT_CODES } from "./service-audit-runtime-eOXjh6og.mjs";
import { n as renderPortDiagnosticsForCli, r as resolvePortListeningAddresses, t as gatherDaemonStatus } from "./status.gather-Bm8kzX0g.mjs";
import { n as formatForeignLaunchdJobs } from "./launchd-foreign-jobs-58G_K7aw.mjs";
import { c as formatHostDesktopStatus } from "./status-overview-values-w-Za2K-6.mjs";
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
	if (!gatewayVersion && !serviceInstallLine) return;
	if (cliVersionLine) defaultRuntime.log(`${label("CLI version:")} ${infoText(cliVersionLine)}`);
	if (gatewayVersion) {
		defaultRuntime.log(`${label("Gateway version:")} ${infoText(gatewayVersion)}`);
		if (status.cli?.version && status.cli.version !== gatewayVersion) {
			defaultRuntime.error(warnText(`Warning: this OpenClaw command is version ${status.cli.version}, but the running Gateway is version ${gatewayVersion}.`));
			defaultRuntime.error(warnText("Check `openclaw --version`, `which openclaw`, and `openclaw gateway status --deep`; if this mismatch is unexpected, update PATH so `openclaw` points to the version you want, or reinstall the Gateway service from that same OpenClaw install."));
		}
	} else if (serviceInstallLine) {
		defaultRuntime.log(`${label("Gateway service version:")} ${infoText(serviceInstallLine)}`);
		defaultRuntime.log(infoText("The Gateway did not report its own version."));
		if (status.service.targetRole !== "diagnostic-only" && status.cli?.version && serviceInstallVersion && status.cli.version !== serviceInstallVersion) {
			defaultRuntime.error(warnText(`Warning: this OpenClaw command is version ${status.cli.version}, but the installed Gateway service is version ${serviceInstallVersion}.`));
			const guidance = resolveDaemonServiceInstallGuidance(status.service.targetRole);
			if (guidance) defaultRuntime.error(warnText(guidance));
		}
	}
	defaultRuntime.log("");
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
			extraServices: status.extraServices.map(({ sourcePath: _sourcePath, ...service }) => service),
			service: projectDaemonServiceForJson(status.service, { includeDefinitionPaths: false })
		});
		return;
	}
	const { rich, label, accent, infoText, okText, warnText, errorText } = createCliStatusTextStyles();
	const spacer = () => defaultRuntime.log("");
	const printError = (message) => defaultRuntime.error(errorText(message));
	const printWarning = (message) => defaultRuntime.error(warnText(message));
	const printInfo = (name, value) => defaultRuntime.log(`${label(name)} ${infoText(value)}`);
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
	if (opts.deep && transport) printInfo("Systemd transport:", `${transport.kind} (${transport.kind === "machine" ? transport.user : transport.address})`);
	if (status.logFile) printInfo("File logs:", shortenHomePath(status.logFile));
	if (service.command?.programArguments?.length) printInfo(managerUnavailable ? "Recorded command:" : "Command:", service.command.programArguments.join(" "));
	if (service.command?.sourcePath) printInfo("Service file:", shortenHomePath(service.command.sourcePath));
	if (service.command?.reloadPending) {
		const systemctl = service.runtime?.systemd?.scope === "system" ? "sudo systemctl --system" : "systemctl --user";
		defaultRuntime.log(warnText(`Systemd reload: pending (run ${systemctl} daemon-reload)`));
	}
	if (service.command?.workingDirectory) printInfo("Working dir:", shortenHomePath(service.command.workingDirectory));
	const daemonEnvLines = safeDaemonEnv(service.command?.environment);
	if (daemonEnvLines.length > 0) defaultRuntime.log(`${label("Service env:")} ${daemonEnvLines.join(" ")}`);
	if (service.gatewayHeap) printInfo("Gateway heap:", formatGatewayHeapLimitReport(service.gatewayHeap));
	printInfo("Host desktop:", formatHostDesktopStatus(status.hostDesktop));
	spacer();
	if (service.configAudit?.issues.length) {
		printWarning("Service config looks out of date or non-standard.");
		for (const issue of service.configAudit.issues) {
			const detail = issue.detail ? ` (${issue.detail})` : "";
			defaultRuntime.error(`${warnText("Service config issue:")} ${issue.message}${detail}`);
		}
		const runtimeNeedsAttention = service.configAudit.issues.some((issue) => Object.values(SERVICE_RUNTIME_AUDIT_CODES).some((code) => code === issue.code));
		printWarning(managerUnavailable ? `Run "${formatCliCommand("openclaw doctor")}" for guidance about this recorded service unit.` : installBlock ?? (runtimeNeedsAttention ? `Recommendation: run "${formatCliCommand("openclaw doctor")}" interactively to resolve the runtime findings before reinstalling. Reinstalling alone may select the same runtime.` : `Recommendation: run "${formatCliCommand("openclaw doctor")}" interactively for guided checks, or reinstall with "${reinstallCommand}".`));
	}
	if (status.config) {
		for (const [kind, config] of [["cli", status.config.cli], ["service", status.config.daemon]]) {
			if (!config) continue;
			const configPath = `${shortenHomePath(config.path)}${config.exists ? "" : " (missing)"}${config.valid ? "" : " (invalid)"}`;
			printInfo(`Config (${kind}):`, configPath);
			if (!config.valid && config.issues?.length) {
				const issueLabel = kind === "cli" ? "Warning: Config issue:" : "Warning: Service config issue:";
				for (const issue of config.issues.slice(0, 5)) printWarning(`${issueLabel} ${formatConfigIssueLine(issue, "", { normalizeRoot: true })}`);
			}
			if (config.warnings?.length && (kind === "cli" || config !== status.config.cli)) {
				printWarning(config.path === status.config.cli.path ? "Config warnings:" : "Service config warnings:");
				for (const warning of config.warnings.slice(0, 5)) printWarning(formatConfigIssueLine(warning, "-", { normalizeRoot: true }));
			}
		}
		if (!status.config.cli.valid || status.config.daemon?.valid === false) printWarning(`Run \`${formatCliCommand("openclaw doctor --fix")}\` to repair configuration.`);
		if (status.config.mismatch) {
			printError("Root cause: CLI and service are using different config paths (likely a profile/state-dir mismatch).");
			printError(installBlock ?? `Fix: rerun \`${reinstallCommand}\` from the same --profile / OPENCLAW_STATE_DIR you expect.`);
		}
		spacer();
	}
	if (status.gateway) {
		const bindHost = status.gateway.bindHost ?? "n/a";
		defaultRuntime.log(`${label("Gateway:")} bind=${infoText(status.gateway.bindMode)} (${infoText(bindHost)}), port=${infoText(String(status.gateway.port))} (${infoText(status.gateway.portSource)})`);
		printInfo("Probe target:", status.gateway.probeUrl);
		if (!(status.config?.daemon?.controlUi?.enabled ?? true)) defaultRuntime.log(`${label("Dashboard:")} ${warnText("disabled")}`);
		else printInfo("Dashboard:", (status.gateway.controlUiLinks ?? resolveControlUiLinks({
			port: status.gateway.port,
			bind: status.gateway.bindMode,
			customBindHost: status.gateway.customBindHost,
			basePath: status.config?.daemon?.controlUi?.basePath,
			tlsEnabled: status.gateway.tlsEnabled === true
		})).httpUrl);
		if (status.gateway.probeNote) printInfo("Probe note:", status.gateway.probeNote);
		if (status.gateway.windowsFirewall?.severity === "warning") {
			printWarning(`Windows firewall: ${status.gateway.windowsFirewall.message}`);
			for (const detail of status.gateway.windowsFirewall.details) printWarning(`  ${detail}`);
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
	if (status.gateway?.duelingScopesWarning) printWarning(sanitizeTerminalText(status.gateway.duelingScopesWarning));
	if (rpc && !rpc.ok && serviceTargetsProbe && serviceLoaded && service.runtime?.status === "running") {
		if (rpc.timedOut && rpc.gatewayReached) defaultRuntime.log(warnText("Gateway accepted the connection, but the read probe timed out. Inspect event-loop load and retry before treating the service as unreachable."));
		else if (status.health?.healthy === true && status.health.staleGatewayPids.length === 0) defaultRuntime.log(warnText("Gateway process is running and owns the gateway port, but readiness is not yet confirmed. Warm-up is still possible. Try openclaw gateway status --deep again shortly; check the probe credentials/config and logs if it stays unresponsive."));
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
		if (capability) printInfo("Capability:", capability);
		spacer();
	}
	if (status.health && status.health.staleGatewayPids.length > 0 && service.runtime?.status === "running" && typeof service.runtime.pid === "number") {
		printError(`Gateway runtime PID does not own the listening port. Other gateway process(es) are listening: ${status.health.staleGatewayPids.join(", ")}`);
		printError(`Fix: run ${formatCliCommand("openclaw gateway restart")} and re-check with ${formatCliCommand("openclaw gateway status --deep")}.`);
		spacer();
	}
	if (status.connections?.established.length) {
		printInfo("Established clients:", String(status.connections.established.length));
		for (const connection of status.connections.established.slice(0, 8)) defaultRuntime.log(`  ${infoText(formatConnectionLine(connection))}`);
		if (status.connections.established.length > 8) defaultRuntime.log(`  ${infoText(`... ${status.connections.established.length - 8} more connection(s)`)}`);
		defaultRuntime.log(warnText("If logs show protocol mismatch after rollback, stop stale OpenClaw client processes listed here and re-run gateway status."));
		spacer();
	}
	const serviceInspectionDetail = service.inspectionReason ? formatServiceInspectionReason(service.inspectionReason) : service.loadState.status === "unknown" ? service.loadState.detail : void 0;
	if (serviceInspectionDetail) {
		defaultRuntime.error(managerUnavailable ? warnText(serviceInspectionDetail) : errorText(`Service inspection failed: ${serviceInspectionDetail}`));
		if (!managerUnavailable) printError(`Retry: ${formatCliCommand("openclaw gateway status --deep")}`);
		spacer();
	}
	const systemdUnavailableDetail = serviceInspectionDetail ?? service.runtime?.inspectionFailure?.detail ?? service.runtime?.detail;
	if (process.platform === "linux" && !service.inspectionReason && (serviceInspectionDetail !== void 0 || rpc?.ok !== true) && isSystemdUnavailableDetail(systemdUnavailableDetail)) {
		const serviceEnv = service.command?.environment ?? process.env;
		printError("systemd user services unavailable.");
		for (const hint of renderSystemdUnavailableHints({
			wsl: isWSLEnv(serviceEnv),
			kind: classifySystemdUnavailableDetail(systemdUnavailableDetail),
			env: serviceEnv
		})) printError(hint);
		spacer();
	}
	const disabledTask = process.platform === "win32" && service.runtime?.state === "Disabled";
	if (service.runtime?.missingUnit) {
		if (serviceTargetsProbe) {
			printError("Service unit not found.");
			printError(installBlock ?? `Run: ${installCommand}`);
		} else defaultRuntime.log(infoText("Native service is not installed; diagnostic only, not the probe target."));
	} else if (service.runtime?.missingGuiSession || serviceLoaded && (disabledTask || service.runtime?.status === "stopped")) {
		const missingGuiSession = service.runtime?.missingGuiSession;
		const startLimitHit = process.platform === "linux" && isSystemdStartLimitHit(service.runtime);
		if (!disabledTask) printError(missingGuiSession ? "LaunchAgent plist exists, but macOS has no usable GUI session for this user." : startLimitHit ? `systemd stopped restarting the gateway after repeated crashes; run ${formatCliCommand("openclaw gateway restart")} or inspect logs.` : "Service is loaded but not running (likely exited immediately).");
		const env = service.command?.environment ?? process.env;
		for (const hint of buildGatewayRuntimeRecoveryHints({
			kind: missingGuiSession ? "gui-session" : disabledTask ? "disabled-task" : "stopped",
			restartCommand: formatCliCommand("openclaw gateway restart", env),
			env,
			logFile: status.logFile,
			systemd: service.runtime?.systemd
		})) printError(hint);
		if (!missingGuiSession) spacer();
	}
	if (service.runtime?.cachedLabel) {
		const env = service.command?.environment ?? process.env;
		const labelValue = resolveGatewayLaunchAgentLabel(env.OPENCLAW_PROFILE);
		printError(`LaunchAgent label cached but plist missing. ${installBlock ?? `Clear with: launchctl bootout gui/$UID/${labelValue}\nThen reinstall: ${installCommand}`}`);
		spacer();
	}
	if (service.foreignLaunchdInspectionError) {
		printWarning(`Could not inspect foreign launchd jobs: ${sanitizeTerminalText(service.foreignLaunchdInspectionError)}`);
		spacer();
	}
	if (service.foreignLaunchdJobs?.length) {
		const shouldWarn = service.foreignLaunchdJobs.some((job) => job.keepAlive || job.gatewayActions.length > 0);
		if (shouldWarn) {
			printWarning("Foreign launchd jobs detected (macOS).");
			printWarning(formatForeignLaunchdJobs(service.foreignLaunchdJobs));
		} else {
			defaultRuntime.log(infoText("Other OpenClaw launchd jobs (macOS)"));
			defaultRuntime.log(infoText(formatForeignLaunchdJobs(service.foreignLaunchdJobs)));
		}
		const restarts = service.forcedRestartSummary;
		if (shouldWarn && restarts && restarts.count > 0) printWarning(`${restarts.count} external forced Gateway restart(s) in the last ${Math.round(restarts.windowMs / 6e4)} minutes. Listed lifecycle jobs may be responsible; this is not proof of attribution.`);
		if (shouldWarn && service.foreignLaunchdJobs.some((job) => job.safeToRemove)) printWarning(`Remove confirmed stray Gateway lifecycle jobs with ${formatCliCommand("openclaw doctor --fix")}.`);
		spacer();
	}
	const staleUpdateLaunchdJobs = service.staleUpdateLaunchdJobs?.filter((job) => !service.foreignLaunchdJobs?.some((foreign) => foreign.label === job.label));
	if (staleUpdateLaunchdJobs?.length) {
		printError("Stale OpenClaw updater launchd job(s) detected.");
		for (const job of staleUpdateLaunchdJobs) {
			const exitStatus = job.lastExitStatus !== void 0 ? `, last exit ${job.lastExitStatus}` : "";
			const pid = job.pid !== void 0 ? `, pid ${job.pid}` : "";
			printError(`- ${job.label}${pid}${exitStatus}`);
		}
		printError(`Fix after confirming no update is running: launchctl remove <label>, then run ${formatCliCommand("openclaw gateway restart")}.`);
		spacer();
	}
	for (const line of renderPortDiagnosticsForCli(status, rpc?.ok)) printError(line);
	if (status.port) {
		const addrs = resolvePortListeningAddresses(status);
		if (addrs.length > 0) printInfo("Listening:", addrs.join(", "));
	}
	if (status.portCli && status.portCli.port !== status.port?.port) defaultRuntime.log(`${label("Note:")} CLI config resolves gateway port=${status.portCli.port} (${status.portCli.status}).`);
	if (serviceTargetsProbe && serviceLoaded && service.runtime?.status === "running" && status.port && status.port.status === "free") {
		printError(`Gateway port ${status.port.port} is not listening (service appears running).`);
		const serviceEnv = {
			...process.env,
			...service.command?.environment
		};
		if (status.lastError) defaultRuntime.error(`${errorText("Last gateway error:")} ${status.lastError}`);
		if (process.platform === "linux") {
			const unit = service.runtime?.systemd?.unit ?? `${resolveGatewaySystemdServiceName(serviceEnv.OPENCLAW_PROFILE)}.service`;
			printError(`Logs: journalctl ${service.runtime?.systemd?.scope === "system" ? "--system" : "--user"} -u ${quoteCliArg(unit)} -n 200 --no-pager`);
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
			const hintLabel = svc.platform === "darwin" ? "Cleanup hint:" : "Inspection hint:";
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
				printError("Plugin repair target resolution failed:");
				for (const { entry } of unresolvedRepairs) {
					const targetResolution = entry.targetResolution;
					const detail = targetResolution?.status === "unresolved" ? targetResolution.error : "npm registry target was not resolved";
					defaultRuntime.error(`- ${entry.pluginId}: ${detail}`);
				}
				printError("No install command was generated for unresolved plugin targets. Retry gateway status --deep after checking registry availability.");
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
