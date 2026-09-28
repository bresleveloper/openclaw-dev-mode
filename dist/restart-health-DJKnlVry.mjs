import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as isPidAlive } from "./pid-alive-CXdZEzr_.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { a as hasActiveStartupMigrationLease, n as STARTUP_MIGRATION_LEASE_TTL_MS, t as STARTUP_MIGRATION_HEARTBEAT_INTERVAL_MS } from "./startup-migration-checkpoint-C2dAjwWy.mjs";
import { o as readGatewayOwnerLease } from "./windows-port-pids-Bid_Huck.mjs";
import "./restart-stale-pids-DjtzhbID.mjs";
import { a as isSameGatewayLockIdentity, o as readActiveGatewayLockIdentity } from "./gateway-lock-CYjRlApN.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { t as resolveGatewayServiceProbeHosts } from "./gateway-service-probe-hosts-D3Br9aVM.mjs";
import { n as classifyPortListener, r as formatPortDiagnostics } from "./ports-format-CGjX8vQM.mjs";
import { n as inspectPortUsage } from "./ports-inspect-DXXAw_y-.mjs";
import { t as createConfiguredGatewayLocalProbe } from "./local-http-probe-Cv2D06JO.mjs";
import { c as listenerOwnedByRuntimePid, i as resolveGatewayRestartProbeContext, n as inspectGatewayPortHealth, o as allListenersOwnedByRuntimePid, r as readGatewayStartupPhase, s as hasListenerAttributionGap, t as confirmGatewayReachable } from "./restart-health-probe-CZvLpSGR.mjs";
import { t as DEFAULT_RESTART_HEALTH_ATTEMPTS } from "./restart-health.constants-BnbTHsGr.mjs";
import "./ports-CDR43XuJ.mjs";
//#region src/cli/daemon-cli/restart-health-snapshot.ts
function finalizeGatewayRestartSnapshot(snapshot, expectedVersion, expectedBuildId, requirePluginHealth) {
	if (expectedVersion) {
		snapshot.expectedVersion = expectedVersion;
		if (snapshot.gatewayVersion !== expectedVersion) {
			snapshot.healthy = false;
			if (snapshot.gatewayVersion != null) snapshot.versionMismatch = {
				expected: expectedVersion,
				actual: snapshot.gatewayVersion
			};
		}
	}
	if (expectedBuildId) {
		snapshot.expectedBuildId = expectedBuildId;
		if (snapshot.gatewayBuildId !== expectedBuildId) {
			snapshot.healthy = false;
			if (snapshot.gatewayBuildId !== void 0) snapshot.buildIdMismatch = {
				expected: expectedBuildId,
				actual: snapshot.gatewayBuildId ?? null
			};
		}
	}
	if (requirePluginHealth && snapshot.activatedPluginErrors?.length || snapshot.channelProbeErrors?.length) snapshot.healthy = false;
	return snapshot;
}
//#endregion
//#region src/cli/daemon-cli/restart-health-inspect.ts
async function inspectGatewayRestart(params) {
	const signal = params.deadline?.signal ?? params.signal;
	signal?.throwIfAborted();
	const read = (phase, operation) => params.deadline ? params.deadline.read(`${params.phase ?? "inspection"}:${phase}`, operation) : operation();
	const startedAtMs = performance.now();
	const remainingTimeoutMs = () => params.deadline ? Math.max(1, params.deadline.remainingMs()) : params.timeoutMs === void 0 ? void 0 : Math.max(1, params.timeoutMs - (performance.now() - startedAtMs));
	const env = params.env ?? process.env;
	const probeHosts = params.probeHosts ?? await read("probe-hosts", async () => {
		const command = await read("service-command", async () => await params.service.readCommand?.(env).catch((error) => {
			if (hasCommandProcessCleanupError(error)) throw error;
			return null;
		}) ?? null);
		return resolveGatewayServiceProbeHosts({
			env,
			command
		});
	});
	const expectedVersion = normalizeOptionalString(params.expectedVersion);
	const expectedBuildId = normalizeOptionalString(params.expectedBuildId);
	const requiresGatewayProbe = Boolean(expectedVersion || expectedBuildId || params.requirePluginHealth === false);
	let reachability = null;
	let probeError;
	let gatewayBootId;
	let gatewayVersion;
	let gatewayBuildId;
	let activatedPluginErrors = [];
	let unavailablePlugins = [];
	let channelProbeErrors = [];
	const loadReachability = async () => {
		if (!reachability) {
			reachability = await read("gateway-health", () => confirmGatewayReachable({
				port: params.port,
				...params.probeContext,
				...params.configuredProbe ? { configuredProbe: params.configuredProbe } : {},
				env,
				timeoutMs: remainingTimeoutMs(),
				...signal ? { signal } : {}
			}));
			probeError = reachability.probeError;
			gatewayBootId = reachability.gatewayBootId;
			gatewayVersion = reachability.gatewayVersion;
			gatewayBuildId = reachability.gatewayBuildId;
			activatedPluginErrors = reachability.activatedPluginErrors;
			unavailablePlugins = reachability.unavailablePlugins;
			channelProbeErrors = reachability.channelProbeErrors;
		}
		return reachability;
	};
	let runtime;
	try {
		runtime = await read("service-runtime", () => params.timeoutMs === void 0 && !params.deadline ? params.service.readRuntime(env) : params.service.readRuntime(env, { timeoutMs: remainingTimeoutMs() }));
	} catch (err) {
		if (hasCommandProcessCleanupError(err)) throw err;
		signal?.throwIfAborted();
		runtime = {
			status: "unknown",
			detail: String(err)
		};
	}
	signal?.throwIfAborted();
	let portUsage;
	try {
		portUsage = await read("port-inspection", () => inspectPortUsage(params.port, {
			probeHosts,
			...signal ? { signal } : {}
		}));
	} catch (err) {
		if (hasCommandProcessCleanupError(err)) throw err;
		signal?.throwIfAborted();
		portUsage = {
			port: params.port,
			status: "unknown",
			listeners: [],
			hints: [],
			errors: [String(err)]
		};
	}
	signal?.throwIfAborted();
	const configuredProbe = params.configuredProbe;
	const startupPhase = portUsage.status === "busy" && configuredProbe ? await read("startup-health", () => readGatewayStartupPhase({
		configuredProbe,
		port: params.port,
		timeoutMs: remainingTimeoutMs(),
		...signal ? { signal } : {}
	})) : void 0;
	if (startupPhase && (expectedVersion || expectedBuildId)) await loadReachability();
	if (!startupPhase && portUsage.status === "busy" && runtime.status !== "running") {
		const reachable = await loadReachability();
		if (reachable.reachable) return finalizeGatewayRestartSnapshot({
			runtime,
			portUsage,
			healthy: true,
			staleGatewayPids: [],
			gatewayVersion: reachable.gatewayVersion,
			...reachable.gatewayBootId ? { gatewayBootId: reachable.gatewayBootId } : {},
			gatewayBuildId: reachable.gatewayBuildId,
			...reachable.activatedPluginErrors.length > 0 ? { activatedPluginErrors: reachable.activatedPluginErrors } : {},
			...reachable.unavailablePlugins.length > 0 ? { unavailablePlugins: reachable.unavailablePlugins } : {},
			...reachable.channelProbeErrors.length > 0 ? { channelProbeErrors: reachable.channelProbeErrors } : {}
		}, expectedVersion, expectedBuildId, params.requirePluginHealth !== false);
	}
	const gatewayListeners = portUsage.status === "busy" ? portUsage.listeners.filter((listener) => classifyPortListener(listener, params.port) === "gateway") : [];
	const running = runtime.status === "running";
	const runtimePid = runtime.pid;
	const listenerAttributionGap = hasListenerAttributionGap(portUsage);
	const ownsPort = runtimePid != null ? portUsage.listeners.some((listener) => listenerOwnedByRuntimePid({
		listener,
		runtimePid
	})) || listenerAttributionGap : gatewayListeners.length > 0 || listenerAttributionGap;
	let healthy = running && ownsPort && !startupPhase;
	if (requiresGatewayProbe && healthy && portUsage.status === "busy") healthy = (await loadReachability()).reachable;
	if (!healthy && !startupPhase && running && portUsage.status === "busy" && !requiresGatewayProbe) healthy = (await loadReachability()).reachable;
	const staleGatewayPids = (portUsage.status === "busy" ? readGatewayOwnerLease({
		env,
		port: params.port,
		...params.openStateSchemaReadAdmission ? { openStateSchemaReadAdmission: params.openStateSchemaReadAdmission } : {}
	}) : void 0) ? [] : Array.from(new Set(gatewayListeners.flatMap((listener) => typeof listener.pid === "number" && Number.isFinite(listener.pid) && (!running || runtimePid != null && !listenerOwnedByRuntimePid({
		listener,
		runtimePid
	})) ? [listener.pid] : [])));
	return finalizeGatewayRestartSnapshot({
		runtime,
		portUsage,
		healthy,
		staleGatewayPids,
		...gatewayBootId ? { gatewayBootId } : {},
		...gatewayVersion !== void 0 ? { gatewayVersion } : {},
		...gatewayBuildId !== void 0 ? { gatewayBuildId } : {},
		...startupPhase ? { startupPhase } : {},
		...probeError ? { probeError } : {},
		...activatedPluginErrors.length ? { activatedPluginErrors } : {},
		...unavailablePlugins.length ? { unavailablePlugins } : {},
		...channelProbeErrors.length ? { channelProbeErrors } : {}
	}, expectedVersion, expectedBuildId, params.requirePluginHealth !== false);
}
//#endregion
//#region src/cli/daemon-cli/restart-health-diagnostics.ts
function formatGatewayStillStarting(snapshot) {
	return `Gateway service is still starting after ${Math.round((snapshot.elapsedMs ?? 0) / 1e3)}s. Last observed startup phase: ${snapshot.startupPhase ?? "unknown"}. Run openclaw gateway status --deep.`;
}
function renderPortUsageDiagnostics(snapshot) {
	const lines = [];
	if (snapshot.portUsage.status === "busy") lines.push(...formatPortDiagnostics(snapshot.portUsage));
	else lines.push(`Gateway port ${snapshot.portUsage.port} status: ${snapshot.portUsage.status}.`);
	if (snapshot.portUsage.errors?.length) lines.push(`Port diagnostics errors: ${snapshot.portUsage.errors.join("; ")}`);
	if (snapshot.probeError) lines.push(`Gateway probe failed: ${snapshot.probeError}`);
	return lines;
}
function renderRestartDiagnostics(snapshot) {
	const lines = [];
	if (snapshot.waitOutcome === "still-starting") lines.push(formatGatewayStillStarting(snapshot));
	if (snapshot.waitOutcome === "timeout" && snapshot.startupPhase) lines.push(`Readiness budget exhausted after ${Math.round((snapshot.elapsedMs ?? 0) / 1e3)}s. Last observed startup phase: ${snapshot.startupPhase}.`);
	if (snapshot.waitOutcome === "generation-changed") lines.push("Gateway process generation changed before readiness could be confirmed.");
	if (snapshot.versionMismatch) {
		const actual = snapshot.versionMismatch.actual ?? "unavailable";
		lines.push(`Gateway version mismatch: expected ${snapshot.versionMismatch.expected}, running gateway reported ${actual}.`);
	}
	if (snapshot.buildIdMismatch) {
		const actual = snapshot.buildIdMismatch.actual ?? "unavailable";
		lines.push(`Gateway build mismatch: expected ${snapshot.buildIdMismatch.expected}, running gateway reported ${actual}.`);
	}
	if (snapshot.activatedPluginErrors?.length) {
		lines.push("Activated plugin load errors:");
		for (const plugin of snapshot.activatedPluginErrors) lines.push(`- ${plugin.id}: ${plugin.error}`);
	}
	if (snapshot.channelProbeErrors?.length) {
		lines.push("Channel health probe errors:");
		for (const channel of snapshot.channelProbeErrors) lines.push(`- ${channel.id}: ${channel.error}`);
	}
	const runtimeSummary = [
		snapshot.runtime.status ? `status=${snapshot.runtime.status}` : null,
		snapshot.runtime.state ? `state=${snapshot.runtime.state}` : null,
		snapshot.runtime.pid != null ? `pid=${snapshot.runtime.pid}` : null,
		snapshot.runtime.lastExitStatus != null ? `lastExit=${snapshot.runtime.lastExitStatus}` : null
	].filter(Boolean).join(", ");
	if (runtimeSummary) lines.push(`Service runtime: ${runtimeSummary}`);
	lines.push(...renderPortUsageDiagnostics(snapshot));
	return lines;
}
function formatGatewayRestartFailure(params) {
	if (params.health.waitOutcome === "still-starting") {
		const message = formatGatewayStillStarting(params.health);
		return {
			statusLine: message,
			failMessage: message
		};
	}
	if (params.health.waitOutcome === "stopped-free") {
		const elapsedSeconds = Math.max(1, Math.round((params.health.elapsedMs ?? 0) / 1e3));
		return {
			statusLine: `Gateway restart failed after ${elapsedSeconds}s: service stayed stopped and port ${params.port} stayed free.`,
			failMessage: `Gateway restart failed after ${elapsedSeconds}s: service stayed stopped and health checks never came up.`
		};
	}
	const timeoutSeconds = Math.max(1, Math.round(params.health.elapsedMs === void 0 ? params.defaultTimeoutSeconds : params.health.elapsedMs / 1e3));
	return {
		statusLine: `Timed out after ${timeoutSeconds}s waiting for gateway port ${params.port} to become healthy.`,
		failMessage: `Gateway restart timed out after ${timeoutSeconds}s waiting for health checks.`
	};
}
function renderGatewayPortHealthDiagnostics(snapshot) {
	return renderPortUsageDiagnostics(snapshot);
}
//#endregion
//#region src/cli/daemon-cli/restart-lock-replacement.ts
async function waitForGatewayLockReplacement(params) {
	let attemptsUsed = 0;
	let previousOwnerReleased = false;
	for (;;) {
		let currentLockIdentity;
		try {
			currentLockIdentity = await readActiveGatewayLockIdentity({ env: params.env });
		} catch {
			if (params.waitIndefinitelyForPreviousOwner && !previousOwnerReleased) {
				await sleep(params.delayMs);
				continue;
			}
			if (attemptsUsed >= params.attempts) return { status: "timeout" };
			attemptsUsed += 1;
			await sleep(params.delayMs);
			continue;
		}
		if (!previousOwnerReleased) {
			if (currentLockIdentity && isSameGatewayLockIdentity(params.previousLockIdentity, currentLockIdentity)) {
				if (params.waitIndefinitelyForPreviousOwner) {
					await sleep(params.delayMs);
					continue;
				}
			} else {
				previousOwnerReleased = true;
				if (params.waitIndefinitelyForPreviousOwner) attemptsUsed = 0;
			}
		}
		if (previousOwnerReleased && currentLockIdentity && !isSameGatewayLockIdentity(params.previousLockIdentity, currentLockIdentity)) return {
			status: "replacement",
			attemptsUsed,
			lockIdentity: currentLockIdentity
		};
		if (attemptsUsed >= params.attempts) return { status: "timeout" };
		attemptsUsed += 1;
		await sleep(params.delayMs);
	}
}
//#endregion
//#region src/cli/daemon-cli/restart-health-external.ts
async function waitForGatewayHealthyListener(params) {
	const attempts = params.attempts ?? DEFAULT_RESTART_HEALTH_ATTEMPTS;
	const delayMs = params.delayMs ?? 500;
	const previousLockIdentity = params.previousLockIdentity;
	const probeContext = await resolveGatewayRestartProbeContext(params.env).catch(() => ({
		auth: void 0,
		config: {}
	}));
	const configuredProbe = createConfiguredGatewayLocalProbe(probeContext.config);
	let snapshot = previousLockIdentity ? {
		portUsage: {
			port: params.port,
			status: "unknown",
			listeners: [],
			hints: [],
			errors: [`Previous gateway lock owner ${previousLockIdentity.ownerId ?? previousLockIdentity.pid} is still active.`]
		},
		healthy: false
	} : await inspectGatewayPortHealth({
		port: params.port,
		auth: probeContext.auth,
		config: probeContext.config,
		configuredProbe
	});
	let attempt = 0;
	let expectedListenerPid;
	if (previousLockIdentity) {
		const replacement = await waitForGatewayLockReplacement({
			previousLockIdentity,
			env: params.env,
			attempts,
			delayMs,
			waitIndefinitelyForPreviousOwner: params.waitIndefinitelyForPreviousOwner === true
		});
		if (replacement.status === "timeout") return snapshot;
		attempt = replacement.attemptsUsed;
		expectedListenerPid = replacement.lockIdentity.pid;
		snapshot = await inspectGatewayPortHealth({
			port: params.port,
			auth: probeContext.auth,
			config: probeContext.config,
			configuredProbe,
			expectedListenerPid
		});
	}
	if (snapshot.healthy) return snapshot;
	while (attempt < attempts) {
		attempt += 1;
		await sleep(delayMs);
		snapshot = await inspectGatewayPortHealth({
			port: params.port,
			auth: probeContext.auth,
			config: probeContext.config,
			configuredProbe,
			expectedListenerPid
		});
		if (snapshot.healthy) return snapshot;
	}
	return snapshot;
}
//#endregion
//#region src/cli/daemon-cli/restart-health.ts
const STARTUP_MIGRATION_ACTIVITY_POLL_MS = 5e3;
const STOPPED_FREE_EARLY_EXIT_GRACE_MS = 1e4;
const WINDOWS_STOPPED_FREE_EARLY_EXIT_GRACE_MS = 9e4;
function shouldEarlyExitStoppedFree(snapshot, attempt, minAttempt) {
	return attempt >= minAttempt && snapshot.runtime.status === "stopped" && snapshot.portUsage.status === "free";
}
function stoppedFreeEarlyExitGraceMs() {
	return process.platform === "win32" ? WINDOWS_STOPPED_FREE_EARLY_EXIT_GRACE_MS : STOPPED_FREE_EARLY_EXIT_GRACE_MS;
}
function withWaitContext(snapshot, waitOutcome, elapsedMs) {
	return {
		...snapshot,
		waitOutcome,
		elapsedMs
	};
}
function isSameGatewayRestartGeneration(previous, current) {
	return previous.runtime.status === current.runtime.status && previous.runtime.pid === current.runtime.pid && previous.gatewayBootId === current.gatewayBootId;
}
async function waitForGatewayHealthyRestart(params) {
	const signal = params.deadline?.signal ?? params.signal;
	signal?.throwIfAborted();
	const read = (phase, operation) => params.deadline ? params.deadline.read(`${params.phase ?? "health-wait"}:${phase}`, operation) : operation();
	const child = params.child;
	const service = params.service ?? {
		readCommand: async () => null,
		readRuntime: async () => ({
			status: child?.pid !== void 0 && child.exitCode === null && child.signalCode === null && isPidAlive(child.pid) ? "running" : "stopped",
			pid: child?.pid
		})
	};
	const startedAtMs = performance.now();
	const absoluteDeadlineMs = params.deadline?.deadlineMs ?? params.deadlineMs;
	const remainingDeadlineMs = absoluteDeadlineMs === void 0 ? void 0 : Math.max(0, absoluteDeadlineMs - startedAtMs);
	const timeoutMs = params.deadline ? remainingDeadlineMs : remainingDeadlineMs === void 0 ? params.timeoutMs : Math.min(params.timeoutMs ?? remainingDeadlineMs, remainingDeadlineMs);
	if (remainingDeadlineMs === 0) {
		await read("setup", async () => void 0);
		return withWaitContext({
			runtime: { status: "unknown" },
			portUsage: {
				port: params.port,
				status: "unknown",
				listeners: [],
				hints: []
			},
			healthy: false,
			staleGatewayPids: [],
			probeError: "Gateway readiness budget exhausted."
		}, "timeout", 0);
	}
	const attempts = params.attempts ?? DEFAULT_RESTART_HEALTH_ATTEMPTS;
	const delayMs = params.delayMs ?? 500;
	const settleProbes = Math.max(1, params.settle?.probes ?? 1);
	const settleDurationMs = params.deadline ? 0 : Math.min((settleProbes - 1) * delayMs, remainingDeadlineMs === void 0 ? Infinity : Math.max(0, remainingDeadlineMs - (params.timeoutMs ?? remainingDeadlineMs)));
	const progressWindowMs = attempts * delayMs;
	const standardDeadlineMs = timeoutMs ?? progressWindowMs;
	const probeTimeoutMs = () => params.deadline ? Math.max(1, params.deadline.remainingMs()) : timeoutMs === void 0 ? void 0 : Math.max(1, timeoutMs + settleDurationMs - (performance.now() - startedAtMs));
	const updateInProgress = (params.env ?? process.env).OPENCLAW_UPDATE_IN_PROGRESS === "1";
	const probeContext = params.probeContext ?? await read("probe-context", () => resolveGatewayRestartProbeContext(params.env, void 0, signal).catch(() => ({
		auth: void 0,
		config: {}
	})));
	const configuredProbe = createConfiguredGatewayLocalProbe(probeContext.config);
	const probeHosts = params.probeHosts ?? await read("probe-hosts", async () => {
		const command = await read("service-command", () => service.readCommand(params.env ?? process.env).catch((error) => {
			if (hasCommandProcessCleanupError(error)) throw error;
			return null;
		}));
		return resolveGatewayServiceProbeHosts({
			env: params.env,
			command
		});
	});
	let snapshot = await inspectGatewayRestart({
		service,
		port: params.port,
		env: params.env,
		expectedVersion: params.expectedVersion,
		expectedBuildId: params.expectedBuildId,
		requirePluginHealth: params.requirePluginHealth,
		probeContext,
		configuredProbe,
		probeHosts,
		timeoutMs: probeTimeoutMs(),
		deadline: params.deadline,
		phase: params.phase ?? "health-wait",
		...signal ? { signal } : {}
	});
	let consecutiveStoppedFreeCount = 0;
	const STOPPED_FREE_THRESHOLD = 6;
	const minAttemptForEarlyExit = Math.min(Math.ceil(stoppedFreeEarlyExitGraceMs() / delayMs), Math.floor(attempts / 2));
	let migrationActive = false;
	let nextMigrationActivityPollMs = 0;
	let migrationActivity;
	let observedRunning = false;
	let observedListener = false;
	let startupProgressDeadlineMs = progressWindowMs;
	let healthyStreak;
	let updateStartupDeadlineMs;
	let observedOwner;
	let observedPid;
	let observedBootId;
	let generationChanged = false;
	let reportedStartupPhase;
	let lastProgressPhase;
	const expiredOutcome = (elapsedMs, atStartupCap) => {
		if (generationChanged) return "generation-changed";
		if (snapshot.runtime.status !== "running" || snapshot.runtime.pid === void 0 && snapshot.gatewayBootId === void 0 || snapshot.versionMismatch || snapshot.buildIdMismatch || snapshot.channelProbeErrors?.length || params.requirePluginHealth !== false && snapshot.activatedPluginErrors?.length || snapshot.staleGatewayPids.length > 0) return "timeout";
		return reportedStartupPhase && snapshot.portUsage.status === "busy" && snapshot.runtime.pid !== void 0 && allListenersOwnedByRuntimePid(snapshot.portUsage.listeners, snapshot.runtime.pid) || atStartupCap && startupProgressDeadlineMs > progressWindowMs && elapsedMs < startupProgressDeadlineMs ? "still-starting" : "timeout";
	};
	for (let attempt = 0;; attempt += 1) {
		signal?.throwIfAborted();
		generationChanged ||= observedPid !== void 0 && snapshot.runtime.pid !== void 0 && observedPid !== snapshot.runtime.pid || observedBootId !== void 0 && snapshot.gatewayBootId !== void 0 && observedBootId !== snapshot.gatewayBootId;
		const identifiedBoot = observedBootId === void 0 && snapshot.gatewayBootId !== void 0;
		observedPid = snapshot.runtime.pid ?? observedPid;
		observedBootId = snapshot.gatewayBootId ?? observedBootId;
		let elapsedMs = Math.max(0, performance.now() - startedAtMs);
		if (updateInProgress && snapshot.runtime.status === "running") updateStartupDeadlineMs ??= Math.max(standardDeadlineMs, STARTUP_MIGRATION_LEASE_TTL_MS);
		const boundedDeadlineMs = timeoutMs ?? updateStartupDeadlineMs;
		const healthy = snapshot.healthy && (!params.requireRunningService || snapshot.runtime.status === "running" && (process.platform === "win32" || typeof snapshot.runtime.pid === "number"));
		reportedStartupPhase = snapshot.startupPhase;
		snapshot.startupPhase = reportedStartupPhase ?? (healthy ? "settling healthy Gateway" : snapshot.runtime.status !== "running" ? "waiting for managed service" : snapshot.portUsage.status === "free" ? "waiting for Gateway listener" : "waiting for Gateway health and identity");
		if (boundedDeadlineMs !== void 0 && elapsedMs > boundedDeadlineMs + settleDurationMs) return withWaitContext({
			...snapshot,
			healthy: false
		}, expiredOutcome(elapsedMs, true), elapsedMs);
		if (healthy) {
			if (healthyStreak && isSameGatewayRestartGeneration(healthyStreak.snapshot, snapshot)) healthyStreak.probes += 1;
			else healthyStreak = {
				snapshot,
				probes: 1
			};
			if (healthyStreak.probes >= settleProbes) return withWaitContext(snapshot, "healthy", elapsedMs);
		} else healthyStreak = void 0;
		if (settleProbes > 1 && snapshot.healthy) snapshot.healthy = false;
		if (params.requirePluginHealth !== false && snapshot.activatedPluginErrors?.length) return withWaitContext(snapshot, "plugin-errors", elapsedMs);
		if (snapshot.channelProbeErrors?.length) return withWaitContext(snapshot, "channel-errors", elapsedMs);
		if (snapshot.versionMismatch) return withWaitContext(snapshot, "version-mismatch", elapsedMs);
		if (snapshot.buildIdMismatch) return withWaitContext(snapshot, "build-id-mismatch", elapsedMs);
		if (snapshot.staleGatewayPids.length > 0 && snapshot.runtime.status !== "running") return withWaitContext(snapshot, "stale-pids", elapsedMs);
		const owner = snapshot.runtime.status === "stopped" && snapshot.portUsage.status === "free" ? readGatewayOwnerLease({
			env: params.env,
			port: params.port
		}) : void 0;
		if (owner && owner.state !== "dead") observedOwner = owner.owner;
		else if (owner?.state === "dead" && owner.owner === observedOwner) return withWaitContext(snapshot, "stopped-free", elapsedMs);
		if ((!owner || owner.state === "dead") && !params.supervisorKeepsAlive && shouldEarlyExitStoppedFree(snapshot, attempt, minAttemptForEarlyExit)) {
			consecutiveStoppedFreeCount += 1;
			if (consecutiveStoppedFreeCount >= STOPPED_FREE_THRESHOLD) return withWaitContext(snapshot, "stopped-free", elapsedMs);
		} else consecutiveStoppedFreeCount = 0;
		let migrationProgress = false;
		let migrationCompleted = false;
		if (snapshot.runtime.status !== "running") migrationActive = false;
		else if (elapsedMs >= nextMigrationActivityPollMs) {
			const previousActivity = migrationActivity;
			migrationActivity = void 0;
			try {
				migrationActive = (params.isStartupMigrationActive ?? hasActiveStartupMigrationLease)({
					env: params.env,
					onActivity: (activity) => {
						if (activity.pid === void 0 || activity.pid !== snapshot.runtime.pid || activity.heartbeatAt === null) return;
						migrationProgress = previousActivity === void 0 || activity.owner === previousActivity.owner && activity.heartbeatAt > previousActivity.heartbeatAt;
						migrationActivity = {
							owner: activity.owner,
							pid: activity.pid,
							heartbeatAt: activity.heartbeatAt
						};
					}
				});
				migrationCompleted = !migrationActive && previousActivity !== void 0 && previousActivity.pid === snapshot.runtime.pid;
			} catch {
				migrationActive = false;
				migrationProgress = false;
				migrationActivity = previousActivity;
			}
			nextMigrationActivityPollMs = elapsedMs + STARTUP_MIGRATION_ACTIVITY_POLL_MS;
		}
		if (boundedDeadlineMs === void 0) elapsedMs = Math.max(0, performance.now() - startedAtMs);
		if (migrationActive && !reportedStartupPhase) snapshot.startupPhase = "startup migration";
		if ((reportedStartupPhase || snapshot.runtime.status === "running") && snapshot.startupPhase !== lastProgressPhase) {
			lastProgressPhase = snapshot.startupPhase;
			params.onProgress?.(snapshot.startupPhase);
		}
		const runtimePid = snapshot.runtime.pid;
		const ownsListener = snapshot.portUsage.status === "busy" && runtimePid !== void 0 && snapshot.portUsage.listeners.some((listener) => listenerOwnedByRuntimePid({
			listener,
			runtimePid
		}));
		const running = snapshot.runtime.status === "running";
		const startupProgress = attempt > 0 && (!observedRunning && running || !observedListener && ownsListener || identifiedBoot);
		const stableRunning = running && (snapshot.runtime.pid !== void 0 || snapshot.gatewayBootId !== void 0) && !generationChanged;
		if (!healthy && stableRunning && (boundedDeadlineMs !== void 0 || elapsedMs <= startupProgressDeadlineMs + settleDurationMs) && (migrationProgress || migrationCompleted || startupProgress)) startupProgressDeadlineMs = Math.max(startupProgressDeadlineMs, elapsedMs + Math.max(progressWindowMs, migrationProgress ? STARTUP_MIGRATION_HEARTBEAT_INTERVAL_MS + STARTUP_MIGRATION_ACTIVITY_POLL_MS : 0));
		observedRunning ||= running;
		observedListener ||= ownsListener;
		if (elapsedMs >= standardDeadlineMs) {
			const startupCapMs = Math.max(standardDeadlineMs, STARTUP_MIGRATION_LEASE_TTL_MS);
			const deadlineMs = boundedDeadlineMs !== void 0 ? boundedDeadlineMs + settleDurationMs : Math.min((stableRunning ? startupProgressDeadlineMs : standardDeadlineMs) + settleDurationMs, startupCapMs);
			if (elapsedMs >= deadlineMs) return withWaitContext(snapshot, expiredOutcome(elapsedMs, boundedDeadlineMs !== void 0 || elapsedMs >= startupCapMs), elapsedMs);
		}
		await read("interval", () => sleep(boundedDeadlineMs === void 0 ? delayMs : Math.min(delayMs, Math.max(0, boundedDeadlineMs + settleDurationMs - elapsedMs)), signal));
		snapshot = await inspectGatewayRestart({
			service,
			port: params.port,
			env: params.env,
			expectedVersion: params.expectedVersion,
			expectedBuildId: params.expectedBuildId,
			requirePluginHealth: params.requirePluginHealth,
			probeContext,
			configuredProbe,
			probeHosts,
			timeoutMs: probeTimeoutMs(),
			deadline: params.deadline,
			phase: params.phase ?? "health-wait",
			...signal ? { signal } : {}
		});
	}
}
//#endregion
export { renderGatewayPortHealthDiagnostics as a, formatGatewayRestartFailure as i, waitForGatewayHealthyRestart as n, renderRestartDiagnostics as o, waitForGatewayHealthyListener as r, inspectGatewayRestart as s, isSameGatewayRestartGeneration as t };
