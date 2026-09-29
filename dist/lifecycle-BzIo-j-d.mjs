import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as parseTcpPortFromArgs } from "./tcp-port-BVV_ljmK.mjs";
import { E as resolveStateDir, m as resolveConfigPathCandidate, v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as formatExternalSupervisorActionRequired, o as isGatewayExternallySupervised, r as assertGatewayServiceMutationAllowed, s as resolveGatewayServiceMutationError } from "./gateway-supervision-dG8swyHC.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { o as readGatewayOwnerLease } from "./windows-port-pids-Bid_Huck.mjs";
import { i as terminateStaleGatewayPids } from "./restart-stale-pids-DjtzhbID.mjs";
import { t as createConfigIO } from "./io.factory-ChIex6Yh.mjs";
import { o as readBestEffortConfig, u as readConfigFileSnapshotForWrite } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import "./config-Ciq2mxdN.mjs";
import { a as isSameGatewayLockIdentity, o as readActiveGatewayLockIdentity, s as readActiveGatewayLockPort } from "./gateway-lock-CYjRlApN.mjs";
import { i as assertGatewayServiceUpdateCurrent, r as assertGatewayServiceFallbackAllowed } from "./service-update-authority-DujRnzx9.mjs";
import { a as resolveManagedGatewayServiceCommand, i as hasGatewayServiceLauncherOverride, n as hasGatewayServiceEnvironmentDifference, t as assertServiceDefinitionWritable } from "./service-types-d44oynyj.mjs";
import { i as resolveOpenClawWrapperPath, t as OPENCLAW_WRAPPER_ENV_KEY } from "./program-args-Pr-IOsMq.mjs";
import { t as buildGatewayInstallPlan } from "./daemon-install-helpers-Bky3P_UA.mjs";
import { i as resolveBunRuntimeInfo, o as resolvePinnedDaemonRuntimePath } from "./runtime-paths-DifTYoyV.mjs";
import { i as resolveGatewayDaemonRuntime } from "./daemon-runtime-D15REPfs.mjs";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-DvAunsR_.mjs";
import { a as readDaemonRuntimePin } from "./runtime-pin-state-Bz2yXWLQ.mjs";
import { n as mergeGatewayServiceEnv, t as resolveGatewayServiceProbeHosts } from "./gateway-service-probe-hosts-nAcoRKGt.mjs";
import { n as probePortUsage } from "./ports-probe-DxY7uEcU.mjs";
import { b as signalVerifiedGatewayPidSync, v as findVerifiedGatewayListenerPidsOnPortSync, y as formatGatewayPidList } from "./schtasks-D2U0K9JA.mjs";
import { a as resolveGatewayService, s as formatGatewayServiceStartRepairIssues } from "./service-BCULlL85.mjs";
import { r as findInstalledSystemdGatewayScope } from "./systemd-scope-ChBpir81.mjs";
import { a as restartSystemdService, f as refreshLegacySystemdServiceMetadata, s as stopSystemdService } from "./systemd-j8mO8n69.mjs";
import { g as createNullWriter, h as createDaemonActionContext, l as renderGatewayServiceStartHints } from "./shared-Ba-Zp0iU.mjs";
import { t as mergeInstallInvocationEnv } from "./install-MFObmSBD.mjs";
import { n as resolveGatewayRestartDrainTimeoutMs, t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-4VeKpJhh.mjs";
import { n as NON_INTERACTIVE_GATEWAY_STOP_MESSAGE, r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.mjs";
import { t as recoverInstalledLaunchAgent } from "./launchd-recovery-DV7UflEN.mjs";
import { a as appendGatewayLifecycleAudit, i as runServiceUninstall, n as runServiceStart, o as createGatewayLifecycleMutationAudit, r as runServiceStop, t as runServiceRestart } from "./lifecycle-core-btQYXbqQ.mjs";
import { n as createManagedUpdateRequesterAuthority } from "./update-requester-authority-DOtkGjU8.mjs";
import { s as callGatewayCli } from "./call-C_MP4_Gs.mjs";
import { Bg as GATEWAY_SERVER_CAPS } from "./src-BRUl7oDv.mjs";
import { a as waitForGatewayHttpReadiness } from "./restart-health-probe-BqNYgG_6.mjs";
import { a as renderGatewayPortHealthDiagnostics, i as formatGatewayRestartFailure, n as waitForGatewayHealthyRestart, o as renderRestartDiagnostics, r as waitForGatewayHealthyListener } from "./restart-health-By4lclzW.mjs";
import { t as DEFAULT_RESTART_HEALTH_ATTEMPTS } from "./restart-health.constants-BnbTHsGr.mjs";
import { o as writeGatewayRestartIntentSync, t as clearGatewayRestartIntentSync } from "./restart-intent-hiIYFAg0.mjs";
import { n as isRestartEnabled } from "./commands.flags-BNJlVVgU.mjs";
import { r as probeGateway } from "./probe-DaF600Lm.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-D9NqKiRl.mjs";
import path from "node:path";
//#region src/cli/daemon-cli/lifecycle-context.ts
async function resolveGatewayLifecycleContext(service = resolveGatewayService(), requireEffective = false) {
	const command = requireEffective ? await service.readCommand(process.env, { requireEffective: true }) : await service.readCommand(process.env).catch(() => null);
	if (requireEffective && !command) throw new Error("Updated gateway service could not be inspected; run `openclaw gateway status --deep`.");
	const env = mergeGatewayServiceEnv(process.env, command);
	const config = await createConfigIO({
		env,
		observe: false,
		pluginValidation: "skip",
		suppressFutureVersionWarning: true
	}).readBestEffortConfig().catch(() => void 0);
	return {
		port: parseTcpPortFromArgs(command?.programArguments) ?? resolveGatewayPort(config, env),
		env,
		config,
		command
	};
}
async function resolveGatewayConfigPorts() {
	const config = await readBestEffortConfig({ observe: false }).catch(() => void 0);
	return {
		explicit: config?.gateway?.port,
		fallback: resolveGatewayPort(config, process.env)
	};
}
async function waitForGatewayUpdateRecovery(expectedVersion, expectedBuildId, timeoutMs) {
	if (!expectedVersion?.trim()) throw new Error("Recovery Gateway version is unavailable.");
	const service = resolveGatewayService();
	const { port, env } = await resolveGatewayLifecycleContext(service, true);
	return await waitForGatewayHealthyRestart({
		service,
		port,
		env,
		expectedVersion,
		expectedBuildId,
		timeoutMs,
		requireRunningService: true,
		settle: { probes: 12 }
	});
}
async function isManagedUpdateRequesterOwner(requester) {
	return (await createManagedUpdateRequesterAuthority(requester)).isCurrent();
}
//#endregion
//#region src/cli/daemon-cli/lifecycle-safe-restart.ts
const SAFE_RESTART_METADATA_REFRESH_TIMEOUT_MS = 5e3;
function formatSafeRestartWarnings(result) {
	return result.preflight.blockers.length === 0 ? void 0 : [result.preflight.summary];
}
function resolveGatewayRestartIntentOptions(opts) {
	if (opts.force && opts.wait !== void 0) throw new Error("--force cannot be combined with --wait");
	if (opts.force) return {
		force: true,
		waitMs: resolveGatewayRestartDeferralTimeoutMs()
	};
	return opts.wait === void 0 ? void 0 : { waitMs: parseDurationMs(opts.wait) };
}
async function runSafeGatewayRestart(opts, target) {
	if (opts.force) throw new Error("--safe cannot be combined with --force; omit --safe to begin a forced restart");
	if (opts.wait !== void 0) throw new Error("--safe cannot be combined with --wait; safe restart uses gateway deferral");
	const skipDeferral = opts.skipDeferral === true;
	const params = { reason: "gateway.restart.safe" };
	if (target) {
		params.safe = true;
		params.target = {
			pid: target.pid,
			ownerId: target.ownerId,
			port: target.port
		};
	}
	if (skipDeferral) params.skipDeferral = true;
	if (process.platform === "linux") {
		const reportRefreshError = (error) => {
			defaultRuntime.error(theme.warn(`Warning: legacy systemd metadata was not refreshed: ${formatErrorMessage(error)}`));
		};
		const mutationError = resolveGatewayServiceMutationError("refresh legacy systemd service metadata", process.env);
		if (mutationError) reportRefreshError(mutationError);
		else await refreshLegacySystemdServiceMetadata(process.env, SAFE_RESTART_METADATA_REFRESH_TIMEOUT_MS).catch(reportRefreshError);
	}
	const result = await callGatewayCli({
		method: "gateway.restart.request",
		params,
		...target ? {
			ignoreEnvUrlOverride: true,
			localPortOverride: target.port,
			requiredCapabilities: [GATEWAY_SERVER_CAPS.GATEWAY_RESTART_TARGET_SAFE]
		} : {},
		timeoutMs: 1e4
	});
	if (target && result.restart.pid !== target.pid) throw new Error("invalid safe restart acknowledgement");
	appendGatewayLifecycleAudit({
		action: "restart",
		source: "safe-rpc",
		mode: result.status,
		pid: result.restart.pid
	});
	const message = result.status === "coalesced" ? "safe restart request joined an existing pending gateway restart" : result.status === "deferred" ? "safe restart requested; gateway will restart after active work drains (bounded wait; may force after the timeout expires)" : skipDeferral ? "safe restart requested; gateway bypassing active-work deferral; shutdown may still wait for pending replies to drain" : "safe restart requested; gateway will restart momentarily";
	const payload = {
		ok: true,
		result: result.status,
		message,
		preflight: result.preflight,
		restart: result.restart,
		warnings: formatSafeRestartWarnings(result)
	};
	if (opts.json) writeRuntimeJson(defaultRuntime, payload);
	else {
		defaultRuntime.log(message);
		if (result.preflight.blockers.length > 0) defaultRuntime.log(theme.warn(result.preflight.summary));
	}
	return true;
}
//#endregion
//#region src/cli/daemon-cli/lifecycle-unmanaged.ts
async function assertUnmanagedGatewayRestartEnabled(port) {
	const scheme = (await readBestEffortConfig({ observe: false }).catch(() => void 0))?.gateway?.tls?.enabled ? "wss" : "ws";
	const probe = await probeGateway({
		url: `${scheme}://127.0.0.1:${port}`,
		auth: {
			token: normalizeOptionalString(process.env.OPENCLAW_GATEWAY_TOKEN),
			password: normalizeOptionalString(process.env.OPENCLAW_GATEWAY_PASSWORD)
		},
		timeoutMs: 1e3
	}).catch(() => null);
	if (!probe?.ok) return;
	if (isRecord(probe.configSnapshot) && !isRestartEnabled({ commands: probe.configSnapshot.commands })) throw new Error("Gateway restart is disabled in the running gateway config (commands.restart=false)");
}
function resolveVerifiedGatewayListenerPids(port) {
	return findVerifiedGatewayListenerPidsOnPortSync(port).filter((pid) => Number.isFinite(pid) && pid > 0);
}
async function signalGatewayRestart(port, params) {
	const restartIntent = params.restartIntent?.force ? {
		force: true,
		drainBudgetMs: params.restartIntent.waitMs
	} : params.restartIntent;
	if (params.enforceRestartConfig) await assertUnmanagedGatewayRestartEnabled(port);
	const pids = resolveVerifiedGatewayListenerPids(port);
	if (pids.length === 0) return null;
	if (pids.length > 1) throw new Error(`multiple gateway processes are listening on port ${port}: ${formatGatewayPidList(pids)}; use "openclaw gateway status --deep" before retrying restart`);
	const pid = expectDefined(pids[0], "pids entry at 0");
	if (params.ownerLease && params.ownerLease.pid !== pid) throw new Error(`Port ${port} is owned by pid ${pid}, not the recorded foreground Gateway pid ${params.ownerLease.pid}; refusing restart`);
	const isWindows = process.platform === "win32";
	const previousLockIdentity = await readActiveGatewayLockIdentity({ env: params.env });
	if (!previousLockIdentity || previousLockIdentity.pid !== pid || previousLockIdentity.port !== port) throw new Error(`gateway lock identity does not match the verified listener on port ${port}; use "openclaw gateway status --deep" and restart through its supervisor or original terminal`);
	const intentWritten = previousLockIdentity.ownerId ? false : writeGatewayRestartIntentSync({
		targetPid: pid,
		reason: "gateway.restart",
		...params.restartIntent ? { intent: params.restartIntent } : {}
	});
	if (!previousLockIdentity.ownerId && !intentWritten) throw new Error("failed to persist the gateway restart intent");
	try {
		const currentLockIdentity = await readActiveGatewayLockIdentity({ env: params.env });
		if (!currentLockIdentity || currentLockIdentity.pid !== pid || currentLockIdentity.port !== port || currentLockIdentity.ownerId !== previousLockIdentity.ownerId || !isSameGatewayLockIdentity(previousLockIdentity, currentLockIdentity)) throw new Error(`gateway lock owner changed before the restart request could be delivered on port ${port}; run "openclaw gateway status --deep" before retrying`);
		if (params.ownerLease) {
			const current = readGatewayOwnerLease({ env: params.env });
			if (!current || current.state !== "live" || current.owner !== params.ownerLease.owner || current.pid !== pid || current.startedAt !== params.ownerLease.startedAt || current.mode !== "foreground" || current.port !== port || previousLockIdentity.ownerId !== current.owner) throw new Error(`Foreground Gateway owner changed before restart on port ${port}`);
		}
		if (previousLockIdentity.ownerId) {
			const result = await callGatewayCli({
				method: "gateway.restart.request",
				params: {
					reason: "gateway.restart",
					target: {
						pid,
						ownerId: previousLockIdentity.ownerId,
						port
					},
					...restartIntent ? { restartIntent } : {}
				},
				localPortOverride: port,
				ignoreEnvUrlOverride: true,
				timeoutMs: 1e4
			});
			expectDefined(result.pid === pid ? result : void 0, "invalid restart acknowledgement");
		} else if (isWindows) await callGatewayCli({
			method: "gateway.restart.request",
			params: {
				reason: "gateway.restart",
				skipDeferral: true
			},
			localPortOverride: port,
			ignoreEnvUrlOverride: true,
			timeoutMs: 1e4
		});
		else signalVerifiedGatewayPidSync(pid, "SIGUSR1");
	} catch (err) {
		if (intentWritten) clearGatewayRestartIntentSync();
		throw err;
	}
	appendGatewayLifecycleAudit({
		action: "restart",
		source: params.auditSource,
		mode: previousLockIdentity.ownerId || isWindows ? "rpc" : "sigusr1",
		pid
	});
	return {
		result: "restarted",
		pid,
		previousLockIdentity,
		message: `Gateway restart request sent to ${params.processLabel} process on port ${port}: ${pid}.`
	};
}
//#endregion
//#region src/cli/daemon-cli/start-health.ts
async function verifyGatewayStartReadiness(params) {
	const { deadlineMs } = resolveGatewayStartupTiming();
	const context = await params.resolveContext();
	const port = params.expectedPort ?? context.port;
	const deadlineAt = Date.now() + deadlineMs;
	const attempts = Math.ceil(deadlineMs / 500);
	const [health, readiness] = await Promise.all([waitForGatewayHealthyRestart({
		service: params.service,
		port,
		attempts,
		delayMs: 500,
		timeoutMs: deadlineMs,
		env: context.env,
		supervisorKeepsAlive: process.platform === "darwin"
	}), waitForGatewayHttpReadiness({
		config: context.config,
		port,
		attempts,
		deadlineAt,
		delayMs: 500
	})]);
	if (health.healthy && readiness.healthz === 200 && readiness.readyz === 200) return;
	params.warnings.push(...renderRestartDiagnostics(health));
	params.warnings.push(`Gateway HTTP readiness: /healthz=${readiness.healthz ?? "unreachable"}; /readyz=${readiness.readyz ?? "unreachable"}.`);
	params.fail(`Gateway start timed out after ${Math.round(deadlineMs / 1e3)}s waiting for /healthz and /readyz.`, [formatCliCommand("openclaw gateway status --deep"), formatCliCommand("openclaw doctor")]);
}
//#endregion
//#region src/cli/daemon-cli/start-repair.ts
const GATEWAY_TARGET_ENV_KEYS = [
	"HOME",
	"USERPROFILE",
	"OPENCLAW_HOME",
	"OPENCLAW_PROFILE",
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_GATEWAY_PORT"
];
function resolveInstalledGatewayTargetEnvironment(existingEnvironment) {
	const installedEnv = {};
	for (const key of GATEWAY_TARGET_ENV_KEYS) {
		const value = existingEnvironment?.[key]?.trim();
		if (value) installedEnv[key] = value;
	}
	return installedEnv;
}
function normalizeTargetPath(value) {
	const resolved = path.resolve(value);
	return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function assertGatewayRepairTargetMatches(params) {
	const installedEnv = resolveInstalledGatewayTargetEnvironment(params.existingEnvironment);
	const installedStateOverride = installedEnv.OPENCLAW_STATE_DIR?.trim();
	const installedHome = installedEnv.OPENCLAW_HOME?.trim() || installedEnv.HOME?.trim() || installedEnv.USERPROFILE?.trim();
	if (!installedStateOverride && !installedHome) throw new Error(`Refusing to repair the managed Gateway service because its installed state directory cannot be determined from the service definition. Run \`openclaw gateway install --force\` to replace it intentionally.`);
	const installedStateDir = resolveStateDir(installedEnv);
	const installedConfigPath = resolveConfigPathCandidate(installedEnv);
	const ambientStateDir = resolveStateDir(process.env);
	const ambientConfigPath = resolveConfigPathCandidate(process.env);
	const ambientPort = resolveGatewayPort(params.config, process.env);
	const sameConfigPath = normalizeTargetPath(installedConfigPath) === normalizeTargetPath(ambientConfigPath);
	const installedPort = params.installedPort ?? (sameConfigPath ? resolveGatewayPort(params.config, installedEnv) : null);
	const differences = [];
	for (const [name, installed, ambient] of [[
		"OPENCLAW_STATE_DIR",
		installedStateDir,
		ambientStateDir
	], [
		"OPENCLAW_CONFIG_PATH",
		installedConfigPath,
		ambientConfigPath
	]]) if (normalizeTargetPath(installed) !== normalizeTargetPath(ambient)) differences.push({
		name,
		installed,
		ambient
	});
	if (installedPort !== null && installedPort !== ambientPort) differences.push({
		name: "gateway.port",
		installed: String(installedPort),
		ambient: String(ambientPort)
	});
	if (differences.length === 0) return installedPort ?? ambientPort;
	const details = differences.map(({ name, installed, ambient }) => `- ${name}: installed=${JSON.stringify(installed)}, ambient=${JSON.stringify(ambient)}`).join("\n");
	throw new Error(`Refusing to repair the managed Gateway service because the current invocation targets a different Gateway:\n${details}\nRun \`openclaw gateway ${params.action}\` with the installed state directory, config path, and port (or unset conflicting environment overrides). To retarget intentionally, run \`openclaw gateway install --force\`.`);
}
async function repairLoadedGatewayServiceForStart(params) {
	assertGatewayServiceMutationAllowed("repair the gateway service");
	const capability = await params.service.readDefinitionMutationCapability?.({
		env: process.env,
		environment: params.state.env
	}).catch(() => ({
		kind: "unknown",
		reason: "inspection-failed"
	}));
	if (capability) assertServiceDefinitionWritable(capability);
	if (hasGatewayServiceLauncherOverride(params.state.command) || hasGatewayServiceEnvironmentDifference(params.state.command, GATEWAY_TARGET_ENV_KEYS)) {
		const unitName = path.basename(params.state.command?.sourcePath ?? "<unit>");
		throw new Error(`Refusing to repair the managed Gateway service because a systemd drop-in overrides its command, working directory, or Gateway target environment. Inspect the unit with \`systemctl --user cat ${unitName}\`, then update or remove the operator-owned drop-in before retrying.`);
	}
	const managedCommand = resolveManagedGatewayServiceCommand(params.state.command);
	const { snapshot: configSnapshot, writeOptions: configWriteOptions } = await readConfigFileSnapshotForWrite();
	const cfg = configSnapshot.valid ? configSnapshot.sourceConfig : configSnapshot.config;
	const existingEnvironment = managedCommand?.environment;
	const existingEnvironmentValueSources = managedCommand?.environmentValueSources;
	const installedPort = parseTcpPortFromArgs(managedCommand?.programArguments);
	const port = assertGatewayRepairTargetMatches({
		action: params.action ?? "start",
		config: cfg,
		existingEnvironment,
		installedPort
	});
	const installEnv = mergeInstallInvocationEnv({
		env: process.env,
		existingServiceEnv: existingEnvironment
	});
	const wrapperPath = await resolveOpenClawWrapperPath(installEnv[OPENCLAW_WRAPPER_ENV_KEY]);
	const pinSnapshot = readDaemonRuntimePin({
		kind: "gateway",
		env: installEnv
	}, params.state.command);
	const pinnedRuntime = wrapperPath ? void 0 : pinSnapshot.pin?.path;
	const installedRuntime = resolveGatewayDaemonRuntime(pinnedRuntime ? [pinnedRuntime] : managedCommand?.programArguments);
	if (!wrapperPath) await resolvePinnedDaemonRuntimePath(pinnedRuntime, installedRuntime, installEnv);
	const installedRuntimePath = installedRuntime === "bun" ? pinnedRuntime ?? managedCommand?.programArguments[0] : void 0;
	const runtimeInfo = installedRuntimePath ? await resolveBunRuntimeInfo(installedRuntimePath) : void 0;
	if (runtimeInfo?.status === "probe-failed") throw runtimeInfo.error;
	if (runtimeInfo?.status === "unsupported" && runtimeInfo.sqliteSelectionError) throw new Error(runtimeInfo.sqliteSelectionError);
	const runtime = pinnedRuntime ? installedRuntime : runtimeInfo?.status === "supported" ? "bun" : "node";
	const tokenResolution = await resolveGatewayInstallToken({
		config: cfg,
		env: installEnv,
		generateIfMissing: {
			snapshot: configSnapshot,
			writeOptions: configWriteOptions
		}
	});
	if (tokenResolution.unavailableReason) throw new Error(tokenResolution.unavailableReason);
	const warnings = [formatGatewayServiceStartRepairIssues(params.issues), ...tokenResolution.warnings].filter((warning) => warning.trim().length > 0);
	if (!params.json) {
		defaultRuntime.log("Gateway service definition needs repair:");
		for (const warning of warnings) defaultRuntime.log(`- ${warning}`);
	}
	const { programArguments, workingDirectory, environment, environmentValueSources } = await buildGatewayInstallPlan({
		env: installEnv,
		port,
		runtime,
		runtimePath: runtime === "bun" ? installedRuntimePath : void 0,
		pinnedRuntimePath: pinSnapshot.pin?.path,
		wrapperPath,
		existingCommand: params.state.command,
		existingEnvironment,
		existingEnvironmentValueSources,
		config: cfg,
		warn: (message) => {
			warnings.push(message);
			if (!params.json) defaultRuntime.log(`- ${message}`);
		}
	});
	await params.service.install({
		runtimePinUpdate: {
			expected: pinSnapshot,
			pin: pinSnapshot.pin
		},
		env: installEnv,
		stdout: params.stdout,
		warn: params.warn,
		programArguments,
		workingDirectory,
		environment,
		environmentValueSources
	});
	const loaded = await params.service.isLoaded({ env: installEnv });
	if (!loaded) throw new Error("Gateway service is not loaded after repair.");
	return {
		result: params.action === "restart" ? "restarted" : "started",
		message: params.action === "restart" ? "Gateway service definition repaired and restarted." : "Gateway service definition repaired and started. Reopen the Control UI with `openclaw dashboard` or copy a fresh auth URL with `openclaw dashboard --no-open`.",
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
async function handleSystemScopeSystemdGateway(action) {
	if (process.platform !== "linux") return null;
	const installed = await findInstalledSystemdGatewayScope(process.env).catch(() => null);
	if (installed?.scope !== "system") return null;
	const stdout = createNullWriter();
	if (action === "stop") {
		await stopSystemdService({
			stdout,
			env: process.env,
			onMutation: createGatewayLifecycleMutationAudit({ action: "stop" })
		});
		return {
			result: "stopped",
			message: `Gateway stopped via system-scope systemd unit ${installed.unitName}.`
		};
	}
	await restartSystemdService({
		stdout,
		env: process.env,
		onMutation: createGatewayLifecycleMutationAudit({ action: "restart" })
	});
	return {
		result: "restarted",
		message: `Gateway restarted via system-scope systemd unit ${installed.unitName}.`
	};
}
async function stopGatewayWithoutServiceManager(port, lockOwnerPid, serviceContext) {
	const managed = await handleSystemScopeSystemdGateway("stop");
	if (managed) return managed;
	const listenerPids = resolveVerifiedGatewayListenerPids(port);
	const pids = listenerPids.length > 0 ? listenerPids : lockOwnerPid ? [lockOwnerPid] : [];
	if (pids.length === 0) {
		const probeHosts = await resolveGatewayServiceProbeHosts(serviceContext ?? {});
		const portUsage = await probePortUsage(port, probeHosts);
		if (portUsage !== "free") throw new Error(portUsage === "busy" ? `Port ${port} is in use but the owning process could not be identified. Run ${formatCliCommand("openclaw gateway status --deep")} to diagnose.` : `Could not determine whether port ${port} is still in use, so the gateway cannot be confirmed stopped. Run ${formatCliCommand("openclaw gateway status --deep")} to diagnose.`);
		return null;
	}
	for (const pid of pids) {
		signalVerifiedGatewayPidSync(pid, "SIGTERM");
		appendGatewayLifecycleAudit({
			action: "stop",
			source: "cli",
			mode: "sigterm",
			pid
		});
	}
	return {
		result: "stopped",
		message: `Gateway stop signal sent to unmanaged process${pids.length === 1 ? "" : "es"} on port ${port}: ${formatGatewayPidList(pids)}.`
	};
}
function resolveRestartListenerHealthWait(restartIntent) {
	const drainTimeoutMs = resolveGatewayRestartDrainTimeoutMs(restartIntent);
	const attempts = postRestartHealthAttempts() + Math.ceil((drainTimeoutMs ?? 0) / POST_RESTART_HEALTH_DELAY_MS);
	return {
		attempts,
		waitIndefinitelyForPreviousOwner: drainTimeoutMs === void 0,
		timeoutSeconds: Math.round(attempts * POST_RESTART_HEALTH_DELAY_MS / 1e3)
	};
}
async function restartUnmanaged(port, intent, allowSystem = true) {
	const managed = allowSystem ? await handleSystemScopeSystemdGateway("restart") : null;
	if (managed) return managed;
	return await signalGatewayRestart(port, {
		restartIntent: intent,
		enforceRestartConfig: true,
		processLabel: "unmanaged",
		auditSource: "cli"
	});
}
function isGatewaySignalRestartResult(result) {
	return result !== null && "pid" in result && typeof result.pid === "number";
}
async function runExternalSupervisorRestart(opts) {
	const { emitMessage, fail } = createDaemonActionContext({
		action: "restart",
		json: Boolean(opts.json)
	});
	const restartIntent = resolveGatewayRestartIntentOptions(opts);
	const lockIdentity = await readActiveGatewayLockIdentity().catch(() => void 0);
	if (!lockIdentity?.ownerId) {
		fail("Gateway restart failed: the active Gateway lock predates targeted restart ownership; update the running Gateway before retrying");
		return false;
	}
	if (opts.safe) return await runSafeGatewayRestart(opts, {
		...lockIdentity,
		ownerId: lockIdentity.ownerId
	});
	let signaled;
	try {
		signaled = await signalGatewayRestart(lockIdentity.port, {
			restartIntent,
			enforceRestartConfig: false,
			processLabel: "externally supervised",
			auditSource: "supervisor"
		});
	} catch (err) {
		fail(`Gateway restart failed: ${String(err)}`);
		return false;
	}
	if (!signaled) {
		fail(`No verified gateway process is listening on port ${lockIdentity.port}. ${formatExternalSupervisorActionRequired("start the gateway")}`);
		return false;
	}
	const healthWait = resolveRestartListenerHealthWait(restartIntent);
	const health = await waitForGatewayHealthyListener({
		port: lockIdentity.port,
		attempts: healthWait.attempts,
		delayMs: POST_RESTART_HEALTH_DELAY_MS,
		previousLockIdentity: signaled.previousLockIdentity,
		waitIndefinitelyForPreviousOwner: healthWait.waitIndefinitelyForPreviousOwner
	});
	if (!health.healthy) {
		fail(`Gateway restart timed out after ${healthWait.timeoutSeconds}s waiting for health checks.`, renderGatewayPortHealthDiagnostics(health));
		return false;
	}
	emitMessage({
		ok: true,
		result: signaled.result,
		message: signaled.message
	});
	return true;
}
/** Uninstall the managed Gateway service after stopping it. */
async function runDaemonUninstall(opts = {}) {
	assertGatewayServiceMutationAllowed("uninstall the gateway service");
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
	assertGatewayServiceMutationAllowed("start the gateway");
	const service = resolveGatewayService();
	const expectedPort = (await resolveGatewayConfigPorts()).explicit;
	return await runServiceStart({
		serviceNoun: "Gateway",
		service,
		renderStartHints: renderGatewayServiceStartHints,
		onNotLoaded: process.platform === "darwin" ? async () => {
			const recovered = await recoverInstalledLaunchAgent({ result: "started" });
			if (recovered) appendGatewayLifecycleAudit({
				action: "start",
				source: "cli",
				mode: "launchd-bootstrap"
			});
			return recovered;
		} : void 0,
		repairLoadedService: async ({ json, stdout, warn, state, issues }) => await repairLoadedGatewayServiceForStart({
			service,
			json,
			stdout,
			warn,
			state,
			issues
		}),
		postStartCheck: ({ fail, warnings }) => verifyGatewayStartReadiness({
			service,
			expectedPort,
			resolveContext: () => resolveGatewayLifecycleContext(service),
			fail,
			warnings
		}),
		expectedPort,
		opts
	});
}
/** Stop the managed Gateway service or verified unmanaged listener fallback. */
async function runDaemonStop(opts = {}) {
	if (!isTerminalInteractive() && !opts.force) {
		const { fail } = createDaemonActionContext({
			action: "stop",
			json: Boolean(opts.json)
		});
		fail(NON_INTERACTIVE_GATEWAY_STOP_MESSAGE);
		return;
	}
	assertGatewayServiceUpdateCurrent();
	assertGatewayServiceMutationAllowed("stop the gateway");
	const service = resolveGatewayService();
	return await runServiceStop({
		serviceNoun: "Gateway",
		service,
		opts,
		stopWhenNotLoaded: process.platform === "darwin" && Boolean(opts.disable),
		onNotLoaded: async ({ stdout }) => {
			if (process.platform === "linux") {
				if ((await service.readRuntime(process.env).catch(() => null))?.status === "running") {
					await service.stop({
						env: process.env,
						stdout,
						onMutation: createGatewayLifecycleMutationAudit({ action: "stop" })
					});
					return { result: "stopped" };
				}
			}
			assertGatewayServiceFallbackAllowed("unmanaged stop");
			const lock = await readActiveGatewayLockIdentity().catch(() => void 0);
			const ctx = lock ? null : await resolveGatewayLifecycleContext(service).catch(() => null);
			return await stopGatewayWithoutServiceManager(lock?.port ?? ctx?.port ?? (await resolveGatewayConfigPorts()).fallback, lock?.pid, ctx ?? void 0);
		}
	});
}
/** Restart the Gateway service or a verified unmanaged listener, then prove health. */
async function runDaemonRestart(opts = {}) {
	const preserveDefinition = Boolean(opts.preserveDefinition);
	if (preserveDefinition) {
		assertGatewayServiceMutationAllowed("restart the gateway");
		if (opts.safe) throw new Error("--preserve-definition requires a native restart without --safe");
	}
	if (opts.skipDeferral && !opts.safe) throw new Error("--skip-deferral requires --safe");
	if (isGatewayExternallySupervised()) {
		assertGatewayServiceFallbackAllowed("external-supervisor restart");
		return await runExternalSupervisorRestart(opts);
	}
	if (opts.safe) {
		assertGatewayServiceFallbackAllowed("safe RPC restart");
		return await runSafeGatewayRestart(opts);
	}
	const jsonOutput = Boolean(opts.json);
	const service = resolveGatewayService();
	let restartedWithoutServiceManager = false;
	let unmanagedPreviousLockIdentity;
	const restartIntent = resolveGatewayRestartIntentOptions(opts);
	const { explicit: configuredPort, fallback: fallbackPort } = await resolveGatewayConfigPorts();
	let managedRestartContext = await resolveGatewayLifecycleContext(service, preserveDefinition).catch(async (error) => {
		if (preserveDefinition) throw error;
		return {
			port: fallbackPort,
			env: process.env
		};
	});
	let managedRestartPort = preserveDefinition ? managedRestartContext.port : configuredPort ?? managedRestartContext.port;
	let unmanagedPort = await readActiveGatewayLockPort().catch(() => void 0) ?? managedRestartPort;
	const restartHealthAttempts = postRestartHealthAttempts();
	const restartWaitMs = restartHealthAttempts * POST_RESTART_HEALTH_DELAY_MS;
	const restartWaitSeconds = Math.round(restartWaitMs / 1e3);
	let unmanagedRestartWait;
	return await runServiceRestart({
		serviceNoun: "Gateway",
		service,
		renderStartHints: renderGatewayServiceStartHints,
		opts: {
			...opts,
			...restartIntent ? { restartIntent } : {}
		},
		checkTokenDrift: true,
		expectedPort: configuredPort,
		beforeServiceMutation: () => assertGatewayServiceMutationAllowed("restart the gateway"),
		restartOwnedProcess: preserveDefinition ? void 0 : async () => {
			const owner = readGatewayOwnerLease();
			if (!owner || owner.state === "dead" || owner.mode !== "foreground") return null;
			assertGatewayServiceFallbackAllowed("foreground owner restart");
			if (owner.state !== "live") throw new Error(`Cannot verify foreground Gateway owner pid ${owner.pid} on ${owner.host}`);
			unmanagedPort = owner.port;
			if (!(await waitForGatewayHealthyListener({
				port: owner.port,
				env: process.env,
				attempts: restartHealthAttempts,
				delayMs: POST_RESTART_HEALTH_DELAY_MS
			})).healthy) throw new Error(`Foreground Gateway owner pid ${owner.pid} is still starting or unhealthy on port ${owner.port}; it was left running`);
			const handled = await signalGatewayRestart(owner.port, {
				restartIntent,
				enforceRestartConfig: true,
				processLabel: "foreground",
				auditSource: "cli",
				ownerLease: owner,
				env: process.env
			});
			if (!handled) throw new Error(`Foreground Gateway owner pid ${owner.pid} no longer listens on port ${owner.port}`);
			restartedWithoutServiceManager = true;
			unmanagedPreviousLockIdentity = handled.previousLockIdentity;
			unmanagedRestartWait = resolveRestartListenerHealthWait(restartIntent);
			return handled;
		},
		repairLoadedService: preserveDefinition ? void 0 : async ({ json, stdout, warn, state, issues }) => {
			const result = await repairLoadedGatewayServiceForStart({
				action: "restart",
				service,
				json,
				stdout,
				warn,
				state,
				issues
			});
			managedRestartContext = await resolveGatewayLifecycleContext(service);
			managedRestartPort = configuredPort ?? managedRestartContext.port;
			return result;
		},
		onNotLoaded: async () => {
			assertGatewayServiceFallbackAllowed("unmanaged restart");
			if (preserveDefinition) return null;
			const mutationError = resolveGatewayServiceMutationError("restart the gateway");
			if (process.platform === "darwin" && !mutationError) {
				const recovered = await recoverInstalledLaunchAgent({ result: "restarted" });
				if (recovered) {
					appendGatewayLifecycleAudit({
						action: "restart",
						source: "cli",
						mode: "launchd-bootstrap"
					});
					return recovered;
				}
			}
			const handled = await restartUnmanaged(unmanagedPort, restartIntent, !mutationError);
			if (handled) {
				restartedWithoutServiceManager = true;
				if (isGatewaySignalRestartResult(handled) && handled.previousLockIdentity) {
					unmanagedPreviousLockIdentity = handled.previousLockIdentity;
					unmanagedRestartWait = resolveRestartListenerHealthWait(restartIntent);
				}
				return handled;
			}
			if (mutationError) throw mutationError;
			return null;
		},
		postRestartCheck: async ({ warnings, fail, stdout, warn, activationAccepted: accepted }) => {
			let activationAccepted = accepted;
			if (restartedWithoutServiceManager) {
				const health = await waitForGatewayHealthyListener({
					port: unmanagedPort,
					env: process.env,
					attempts: unmanagedRestartWait?.attempts ?? restartHealthAttempts,
					delayMs: POST_RESTART_HEALTH_DELAY_MS,
					...unmanagedPreviousLockIdentity ? {
						previousLockIdentity: unmanagedPreviousLockIdentity,
						waitIndefinitelyForPreviousOwner: unmanagedRestartWait?.waitIndefinitelyForPreviousOwner ?? false
					} : {}
				});
				if (health.healthy) return;
				const diagnostics = renderGatewayPortHealthDiagnostics(health);
				const waitSeconds = unmanagedRestartWait?.timeoutSeconds ?? restartWaitSeconds;
				const timeoutLine = `Timed out after ${waitSeconds}s waiting for gateway port ${unmanagedPort} to become healthy.`;
				if (!jsonOutput) {
					defaultRuntime.log(theme.warn(timeoutLine));
					for (const line of diagnostics) defaultRuntime.log(theme.muted(line));
				} else {
					warnings.push(timeoutLine);
					warnings.push(...diagnostics);
				}
				fail(`Gateway restart timed out after ${waitSeconds}s waiting for health checks.`, [formatCliCommand("openclaw gateway status --deep"), formatCliCommand("openclaw doctor")], activationAccepted ? "restart-health-failed" : void 0);
				throw new Error("unreachable after gateway restart health failure");
			}
			const waitForHealthy = async () => await waitForGatewayHealthyRestart({
				service,
				port: managedRestartPort,
				attempts: restartHealthAttempts,
				delayMs: POST_RESTART_HEALTH_DELAY_MS,
				env: managedRestartContext.env,
				...managedRestartContext.env.OPENCLAW_UPDATE_IN_PROGRESS !== "1" ? { requirePluginHealth: false } : {},
				supervisorKeepsAlive: process.platform === "darwin"
			});
			let health = await waitForHealthy();
			if (!health.healthy && health.staleGatewayPids.length > 0) {
				const staleMsg = `Found stale gateway process(es): ${health.staleGatewayPids.join(", ")}.`;
				warnings.push(staleMsg);
				if (!jsonOutput) {
					defaultRuntime.log(theme.warn(staleMsg));
					defaultRuntime.log(theme.muted("Stopping stale process(es) and retrying restart..."));
				}
				const terminated = await terminateStaleGatewayPids(health.staleGatewayPids, {
					env: managedRestartContext.env,
					assertCurrent: assertGatewayServiceUpdateCurrent
				});
				const currentOwner = readGatewayOwnerLease({ env: managedRestartContext.env });
				if (terminated.length > 0 && (!currentOwner || currentOwner.state === "dead")) {
					const retryRestart = await service.restart({
						preserveDefinition,
						env: process.env,
						stdout,
						warn,
						onMutation: createGatewayLifecycleMutationAudit({ action: "restart" })
					});
					if (retryRestart.outcome === "scheduled") return retryRestart;
					activationAccepted = true;
				}
				health = await waitForHealthy();
			}
			if (health.healthy) return;
			const diagnostics = renderRestartDiagnostics(health);
			const failure = formatGatewayRestartFailure({
				health,
				port: managedRestartPort,
				defaultTimeoutSeconds: restartWaitSeconds
			});
			const runningNoPortLine = health.waitOutcome !== "still-starting" && health.runtime.status === "running" && health.portUsage.status === "free" ? `Gateway process is running but port ${managedRestartPort} is still free (startup hang/crash loop or very slow VM startup).` : null;
			if (!jsonOutput) {
				defaultRuntime.log(theme.warn(failure.statusLine));
				if (runningNoPortLine) defaultRuntime.log(theme.warn(runningNoPortLine));
				for (const line of diagnostics) defaultRuntime.log(theme.muted(line));
			} else {
				warnings.push(failure.statusLine);
				if (runningNoPortLine) warnings.push(runningNoPortLine);
				warnings.push(...diagnostics);
			}
			fail(failure.failMessage, [formatCliCommand("openclaw gateway status --deep"), formatCliCommand("openclaw doctor")], health.waitOutcome === "still-starting" ? managedRestartContext.env.OPENCLAW_UPDATE_IN_PROGRESS === "1" ? "restart-health-failed" : "still-starting" : activationAccepted ? "restart-health-failed" : void 0);
			throw new Error("unreachable after gateway restart failure");
		}
	});
}
//#endregion
export { isManagedUpdateRequesterOwner as a, runDaemonUninstall as i, runDaemonStart as n, waitForGatewayUpdateRecovery as o, runDaemonStop as r, runDaemonRestart as t };
