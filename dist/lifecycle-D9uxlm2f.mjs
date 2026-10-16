import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { r as parseTcpPortFromArgs } from "./tcp-port-8uSpDbMY.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { b as resolveGatewayPort, h as resolveConfigPathCandidate } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-IxJJNQFo.mjs";
import { i as assertGatewayServiceUpdateCurrent, r as assertGatewayServiceFallbackAllowed } from "./service-update-authority-CoX8GMUL.mjs";
import { i as formatExternalSupervisorActionRequired, o as isGatewayExternallySupervised, r as assertGatewayServiceMutationAllowed, s as resolveGatewayServiceMutationError } from "./gateway-supervision-CUdBruRD.mjs";
import { t as createNullWriter } from "./null-writer-Bd3sgUAj.mjs";
import { h as createDaemonActionContext, l as renderGatewayServiceStartHints } from "./shared-DejcqFfy.mjs";
import { r as readGatewayOwnerLease } from "./gateway-owner-lease-0RgOZO_d.mjs";
import { a as terminateStaleGatewayPids } from "./restart-stale-pids-BSJ5Iyx5.mjs";
import { t as parseDurationMs } from "./parse-duration-C4JaJvt9.mjs";
import { o as readBestEffortConfig, u as readConfigFileSnapshotForWrite } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import "./config-CzeZu5J_.mjs";
import { a as isSameGatewayLockIdentity, o as readActiveGatewayLockIdentity, s as readActiveGatewayLockPort } from "./gateway-lock-B6mKYs2x.mjs";
import { t as GATEWAY_SERVER_CAPS } from "./server-capabilities-BTjjxElt.mjs";
import { b as signalVerifiedGatewayPidSync, v as findVerifiedGatewayListenerPidsOnPortSync, w as resolveOpenClawWrapperPath, x as OPENCLAW_WRAPPER_ENV_KEY, y as formatGatewayPidList } from "./schtasks-BZ33FXAo.mjs";
import { a as hasGatewayServiceLauncherOverride, o as resolveManagedGatewayServiceCommand, r as hasGatewayServiceEnvironmentDifference, t as assertServiceDefinitionWritable } from "./service-types-CPk6CBn6.mjs";
import { n as probePortUsage } from "./ports-probe-DMGtt9dg.mjs";
import { t as mergeGatewayServiceEnv } from "./service-env-merge-BU8q8IlG.mjs";
import { t as resolveGatewayServiceProbeHosts } from "./gateway-service-probe-hosts-CowMnBnJ.mjs";
import { n as resolveGatewayService, s as formatGatewayServiceStartRepairIssues } from "./service-CCUynFdj.mjs";
import { o as writeGatewayRestartIntentSync, t as clearGatewayRestartIntentSync } from "./restart-intent-p09TpP-N.mjs";
import { a as readDaemonRuntimePin } from "./runtime-pin-state-N6enW3o3.mjs";
import { i as findInstalledSystemdGatewayScope } from "./systemd-scope-CKzHr-87.mjs";
import { o as refreshLegacySystemdServiceMetadata } from "./systemd-C4RkjiSR.mjs";
import { r as stopSystemdService, t as restartSystemdService } from "./systemd-lifecycle-CWcFMVrn.mjs";
import { n as resolveGatewayRestartDrainTimeoutMs, t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-C6PCt2me.mjs";
import { a as resolveBunRuntimeInfo, s as resolvePinnedDaemonRuntimePath } from "./runtime-paths-D7k3lrcM.mjs";
import { n as createGatewayRestartDeadline } from "./restart-health-deadline-C7VrqJZk.mjs";
import { t as DEFAULT_RESTART_HEALTH_ATTEMPTS } from "./restart-health.constants-COHnQ8kO.mjs";
import { i as callGatewayCli } from "./call-DnqhP17M.mjs";
import { o as waitForGatewayHttpReadiness } from "./restart-health-probe-AixgfgCP.mjs";
import { a as renderGatewayPortHealthDiagnostics, i as formatGatewayRestartFailure, n as waitForGatewayHealthyRestart, o as renderRestartDiagnostics, r as waitForGatewayHealthyListener } from "./restart-health-DTQ4sMhk.mjs";
import { t as recoverInstalledLaunchAgent } from "./launchd-recovery-6bVyyAPU.mjs";
import { n as isRestartEnabled } from "./commands.flags-D0cD2TME.mjs";
import { r as probeGateway } from "./probe-B0qn0tgj.mjs";
import { n as NON_INTERACTIVE_GATEWAY_STOP_MESSAGE, r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-D9NqKiRl.mjs";
import { i as resolveGatewayDaemonRuntime } from "./daemon-runtime-DLyccFUz.mjs";
import { a as appendGatewayLifecycleAudit, i as runServiceUninstall, n as runServiceStart, o as createGatewayLifecycleMutationAudit, r as runServiceStop, t as runServiceRestart } from "./lifecycle-core-CnzLonw5.mjs";
import { t as buildGatewayInstallPlan } from "./daemon-install-helpers-r4uiFPBV.mjs";
import { t as resolveGatewayInstallToken } from "./gateway-install-token--3y4gr0t.mjs";
import { t as mergeInstallInvocationEnv } from "./install-CmDJgefI.mjs";
import { n as resolveGatewayConfigPorts, r as resolveGatewayLifecycleContext } from "./lifecycle-context-C8t1Yy3E.mjs";
import path from "node:path";
//#region src/cli/daemon-cli/lifecycle-safe-restart.ts
const SAFE_RESTART_METADATA_REFRESH_TIMEOUT_MS = 5e3;
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
		warnings: result.preflight.blockers.length === 0 ? void 0 : [result.preflight.summary]
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
async function signalGatewayRestart(port, params) {
	const restartIntent = params.restartIntent?.force ? {
		force: true,
		drainBudgetMs: params.restartIntent.waitMs
	} : params.restartIntent;
	const pids = findVerifiedGatewayListenerPidsOnPortSync(port, { env: params.env });
	if (pids.length === 0) return null;
	if (pids.length > 1) throw new Error(`multiple gateway processes are listening on port ${port}: ${formatGatewayPidList(pids)}; use "openclaw gateway status --deep" before retrying restart`);
	const pid = expectDefined(pids[0], "pids entry at 0");
	if (params.ownerLease && params.ownerLease.pid !== pid) throw new Error(`Port ${port} is owned by pid ${pid}, not the recorded foreground Gateway pid ${params.ownerLease.pid}; refusing restart`);
	const isWindows = process.platform === "win32";
	const previousLockIdentity = await readActiveGatewayLockIdentity({ env: params.env });
	if (!previousLockIdentity || previousLockIdentity.pid !== pid || previousLockIdentity.port !== port) throw new Error(`gateway lock identity does not match the verified listener on port ${port}; use "openclaw gateway status --deep" and restart through its supervisor or original terminal`);
	const assertTargetCurrent = async () => {
		const currentLockIdentity = await readActiveGatewayLockIdentity({ env: params.env });
		const currentPids = findVerifiedGatewayListenerPidsOnPortSync(port, { env: params.env });
		if (currentPids.length !== 1 || currentPids[0] !== pid) throw new Error(`Gateway listener changed before restart on port ${port}`);
		if (!currentLockIdentity || currentLockIdentity.pid !== pid || currentLockIdentity.port !== port || currentLockIdentity.ownerId !== previousLockIdentity.ownerId || !isSameGatewayLockIdentity(previousLockIdentity, currentLockIdentity)) throw new Error(`gateway lock owner changed before the restart request could be delivered on port ${port}; run "openclaw gateway status --deep" before retrying`);
		if (params.ownerLease) {
			const current = readGatewayOwnerLease({ env: params.env });
			if (!current || current.state !== "live" || current.owner !== params.ownerLease.owner || current.pid !== pid || current.startedAt !== params.ownerLease.startedAt || current.mode !== "foreground" || current.port !== port || previousLockIdentity.ownerId !== current.owner) throw new Error(`Foreground Gateway owner changed before restart on port ${port}`);
		}
	};
	if (params.enforceRestartConfig) {
		await assertTargetCurrent();
		await assertUnmanagedGatewayRestartEnabled(port);
		await assertTargetCurrent();
	}
	const intentWritten = previousLockIdentity.ownerId ? false : writeGatewayRestartIntentSync({
		targetPid: pid,
		reason: "gateway.restart",
		...params.restartIntent ? { intent: params.restartIntent } : {}
	});
	if (!previousLockIdentity.ownerId && !intentWritten) throw new Error("failed to persist the gateway restart intent");
	try {
		await assertTargetCurrent();
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
		else signalVerifiedGatewayPidSync(pid, "SIGUSR1", {
			env: params.env,
			port
		});
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
	const healthDeadline = createGatewayRestartDeadline({ timeoutMs: deadlineMs });
	const [health, readiness] = await Promise.all([withCommandProcessScope(() => waitForGatewayHealthyRestart({
		service: params.service,
		port,
		attempts,
		delayMs: 500,
		timeoutMs: deadlineMs,
		deadline: healthDeadline,
		deadlineOutcome: "snapshot",
		env: context.env,
		supervisorKeepsAlive: process.platform === "darwin"
	}), healthDeadline.signal).finally(() => healthDeadline.dispose()), waitForGatewayHttpReadiness({
		config: context.config,
		port,
		attempts,
		deadlineAt,
		delayMs: 500
	})]);
	if (health.healthy && readiness.healthz === 200 && readiness.readyz === 200) return;
	params.warnings.push(...renderRestartDiagnostics(health));
	params.warnings.push(`Gateway HTTP readiness: /healthz=${readiness.healthz ?? "unreachable"}; /readyz=${readiness.readyz ?? "unreachable"}.`);
	if (health.waitOutcome === "still-starting") {
		params.fail(formatGatewayRestartFailure({
			health,
			port,
			defaultTimeoutSeconds: Math.round(deadlineMs / 1e3)
		}).failMessage, [formatCliCommand("openclaw gateway status --deep")], "still-starting");
		return;
	}
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
const WINDOWS_POST_RESTART_HEALTH_TIMEOUT_MS = 18e4;
function postRestartHealthAttempts() {
	return process.platform === "win32" ? Math.ceil(WINDOWS_POST_RESTART_HEALTH_TIMEOUT_MS / 500) : DEFAULT_RESTART_HEALTH_ATTEMPTS;
}
async function handleSystemScopeSystemdGateway(action) {
	if (process.platform !== "linux") return null;
	const installed = await findInstalledSystemdGatewayScope(process.env).catch(() => null);
	if (installed?.scope !== "system") return null;
	const stdout = createNullWriter();
	await (action === "stop" ? stopSystemdService : restartSystemdService)({
		stdout,
		env: process.env,
		onMutation: createGatewayLifecycleMutationAudit({ action })
	});
	const result = action === "stop" ? "stopped" : "restarted";
	return {
		result,
		message: `Gateway ${result} via system-scope systemd unit ${installed.unitName}.`
	};
}
async function stopGatewayWithoutServiceManager(port, lockOwnerPid, serviceContext) {
	const managed = await handleSystemScopeSystemdGateway("stop");
	if (managed) return managed;
	const env = mergeGatewayServiceEnv(serviceContext?.env ?? process.env, serviceContext?.command ?? null);
	const listenerPids = findVerifiedGatewayListenerPidsOnPortSync(port, { env });
	const pids = listenerPids.length > 0 ? listenerPids : lockOwnerPid ? [lockOwnerPid] : [];
	if (pids.length === 0) {
		const probeHosts = await resolveGatewayServiceProbeHosts(serviceContext ?? {});
		const portUsage = await probePortUsage(port, probeHosts);
		if (portUsage !== "free") throw new Error(portUsage === "busy" ? `Port ${port} is in use but the owning process could not be identified. Run ${formatCliCommand("openclaw gateway status --deep")} to diagnose.` : `Could not determine whether port ${port} is still in use, so the gateway cannot be confirmed stopped. Run ${formatCliCommand("openclaw gateway status --deep")} to diagnose.`);
		return null;
	}
	for (const pid of pids) {
		signalVerifiedGatewayPidSync(pid, "SIGTERM", {
			env,
			port
		});
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
	const attempts = postRestartHealthAttempts() + Math.ceil((drainTimeoutMs ?? 0) / 500);
	return {
		attempts,
		waitIndefinitelyForPreviousOwner: drainTimeoutMs === void 0,
		timeoutSeconds: Math.round(attempts * 500 / 1e3)
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
		delayMs: 500,
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
				if ((await service.readRuntime(process.env).catch((error) => {
					if (hasCommandProcessCleanupError(error)) throw error;
					return null;
				}))?.status === "running") {
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
			const ctx = lock ? null : await resolveGatewayLifecycleContext(service).catch((error) => {
				if (hasCommandProcessCleanupError(error)) throw error;
				return null;
			});
			return await stopGatewayWithoutServiceManager(lock?.port ?? ctx?.port ?? (await resolveGatewayConfigPorts()).fallback, lock?.pid, ctx ?? void 0);
		}
	});
}
/** Restart the Gateway service or a verified unmanaged listener, then prove health. */
async function runDaemonRestart(opts = {}) {
	let preserveDefinition = Boolean(opts.preserveDefinition);
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
		if (hasCommandProcessCleanupError(error)) throw error;
		if (preserveDefinition) throw error;
		return {
			port: fallbackPort,
			env: process.env
		};
	});
	let managedRestartPort = preserveDefinition ? managedRestartContext.port : configuredPort ?? managedRestartContext.port;
	let unmanagedPort = await readActiveGatewayLockPort().catch(() => void 0) ?? managedRestartPort;
	const restartHealthAttempts = postRestartHealthAttempts();
	const restartWaitMs = restartHealthAttempts * 500;
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
				delayMs: 500
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
		postRestartCheck: async ({ warnings, fail, stdout, warn, activationAccepted: accepted, preserveDefinition: preserved }) => {
			if (preserved) {
				preserveDefinition = true;
				managedRestartPort = managedRestartContext.port;
			}
			let activationAccepted = accepted;
			const reportHealthFailure = (statusLines, diagnostics) => {
				if (jsonOutput) {
					warnings.push(...statusLines, ...diagnostics);
					return;
				}
				for (const line of statusLines) defaultRuntime.log(theme.warn(line));
				for (const line of diagnostics) defaultRuntime.log(theme.muted(line));
			};
			if (restartedWithoutServiceManager) {
				const health = await waitForGatewayHealthyListener({
					port: unmanagedPort,
					env: process.env,
					attempts: unmanagedRestartWait?.attempts ?? restartHealthAttempts,
					delayMs: 500,
					...unmanagedPreviousLockIdentity ? {
						previousLockIdentity: unmanagedPreviousLockIdentity,
						waitIndefinitelyForPreviousOwner: unmanagedRestartWait?.waitIndefinitelyForPreviousOwner ?? false
					} : {}
				});
				if (health.healthy) return;
				const diagnostics = renderGatewayPortHealthDiagnostics(health);
				const waitSeconds = unmanagedRestartWait?.timeoutSeconds ?? restartWaitSeconds;
				reportHealthFailure([`Timed out after ${waitSeconds}s waiting for gateway port ${unmanagedPort} to become healthy.`], diagnostics);
				fail(`Gateway restart timed out after ${waitSeconds}s waiting for health checks.`, [formatCliCommand("openclaw gateway status --deep"), formatCliCommand("openclaw doctor")], activationAccepted ? "restart-health-failed" : void 0);
				throw new Error("unreachable after gateway restart health failure");
			}
			const waitForHealthy = async () => await waitForGatewayHealthyRestart({
				service,
				port: managedRestartPort,
				attempts: restartHealthAttempts,
				delayMs: 500,
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
			reportHealthFailure([failure.statusLine, ...runningNoPortLine ? [runningNoPortLine] : []], diagnostics);
			fail(failure.failMessage, [formatCliCommand("openclaw gateway status --deep"), formatCliCommand("openclaw doctor")], health.waitOutcome === "still-starting" ? managedRestartContext.env.OPENCLAW_UPDATE_IN_PROGRESS === "1" ? "restart-health-failed" : "still-starting" : activationAccepted ? "restart-health-failed" : void 0);
			throw new Error("unreachable after gateway restart failure");
		}
	});
}
//#endregion
export { runDaemonUninstall as i, runDaemonStart as n, runDaemonStop as r, runDaemonRestart as t };
