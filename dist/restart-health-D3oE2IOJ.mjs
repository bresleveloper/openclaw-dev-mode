import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { i as isPidAlive } from "./pid-alive-dd7OR8F6.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { a as hasActiveStartupMigrationLease, n as STARTUP_MIGRATION_LEASE_TTL_MS, t as STARTUP_MIGRATION_HEARTBEAT_INTERVAL_MS } from "./startup-migration-checkpoint-C0_lkd8F.mjs";
import { r as readGatewayOwnerLease } from "./gateway-owner-lease-KxvFWleW.mjs";
import "./restart-stale-pids-CHtdUHKp.mjs";
import { r as resolveCommandProcessSignal } from "./exec-spawn-Cn2m7YAI.mjs";
import { a as isSameGatewayLockIdentity, o as readActiveGatewayLockIdentity } from "./gateway-lock-OT1e72lx.mjs";
import { t as resolveGatewayServiceProbeHosts } from "./gateway-service-probe-hosts-GEYPb5fi.mjs";
import { n as classifyPortListener, r as formatPortDiagnostics } from "./ports-format-Bal9BDTl.mjs";
import { n as inspectPortUsage } from "./ports-inspect-BaO1UeCS.mjs";
import { t as GatewayRestartDeadlineError } from "./restart-health-deadline-W160VriR.mjs";
import { t as DEFAULT_RESTART_HEALTH_ATTEMPTS } from "./restart-health.constants-C-z_CCoa.mjs";
import { t as createConfiguredGatewayLocalProbe } from "./local-http-probe-DfgRYt3l.mjs";
import { a as resolveGatewayRestartProbeContext, c as hasListenerAttributionGap, i as readGatewayStartupPhase, l as listenerOwnedByRuntimePid, n as confirmGatewayReachable, r as inspectGatewayPortHealth, s as allListenersOwnedByRuntimePid } from "./restart-health-probe-Pjm6LtxI.mjs";
//#region src/cli/daemon-cli/restart-health-snapshot.ts
function finalizeGatewayRestartSnapshot(snapshot, expectedVersion, expectedBuildId, requirePluginHealth, requireChannelHealth) {
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
	if (requirePluginHealth && snapshot.activatedPluginErrors?.length || requireChannelHealth && snapshot.channelProbeErrors?.length) snapshot.healthy = false;
	return snapshot;
}
//#endregion
//#region src/cli/daemon-cli/restart-health-inspect.ts
async function inspectGatewayRestart(params) {
	const signal = params.deadline?.signal ?? params.signal;
	signal?.throwIfAborted();
	const read = (phase, operation) => params.deadline ? params.deadline.read(`${params.phase ?? "inspection"}:${phase}`, operation) : operation();
	const startedAtMs = performance.now();
	const remainingTimeoutMs = (probeTimeoutMs) => {
		const remaining = params.timeoutMs === void 0 ? void 0 : Math.max(1, params.timeoutMs - (performance.now() - startedAtMs));
		const allowance = params.deadline ? Math.min(Math.max(1, params.deadline.remainingMs()), remaining ?? Infinity) : remaining;
		return probeTimeoutMs === void 0 ? allowance : Math.min(probeTimeoutMs, allowance ?? Infinity);
	};
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
	const requiresGatewayProbe = Boolean(expectedVersion || expectedBuildId) || params.requirePluginHealth === false || params.requireChannelHealth === false;
	let reachability = null;
	const loadReachability = () => read("gateway-health", () => confirmGatewayReachable({
		port: params.port,
		...params.probeContext,
		...params.configuredProbe ? { configuredProbe: params.configuredProbe } : {},
		env,
		allowHttpVerification: Boolean(expectedVersion) && params.requirePluginHealth === false && params.requireChannelHealth === false,
		timeoutMs: remainingTimeoutMs(params.probeTimeoutMs),
		...signal ? { signal } : {}
	}));
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
		timeoutMs: remainingTimeoutMs(params.probeTimeoutMs),
		...signal ? { signal } : {}
	})) : void 0;
	if (startupPhase && (expectedVersion || expectedBuildId)) reachability = await loadReachability();
	const gatewayListeners = portUsage.status === "busy" ? portUsage.listeners.filter((listener) => classifyPortListener(listener) === "gateway") : [];
	const running = runtime.status === "running";
	const runtimePid = runtime.pid;
	const listenerAttributionGap = hasListenerAttributionGap(portUsage);
	const ownsPort = runtimePid != null ? portUsage.listeners.some((listener) => listenerOwnedByRuntimePid({
		listener,
		runtimePid
	})) || listenerAttributionGap : gatewayListeners.length > 0 || listenerAttributionGap;
	let healthy = false;
	if (!startupPhase && portUsage.status === "busy" && (!running || !requiresGatewayProbe || ownsPort)) healthy = (reachability ??= await loadReachability()).reachable;
	const unmanagedHealthy = healthy && !running;
	const owner = !unmanagedHealthy && portUsage.status === "busy" ? readGatewayOwnerLease({
		env,
		port: params.port,
		...params.openStateSchemaReadAdmission ? { openStateSchemaReadAdmission: params.openStateSchemaReadAdmission } : {}
	}) : void 0;
	const staleGatewayPids = unmanagedHealthy || owner ? [] : Array.from(new Set(gatewayListeners.flatMap((listener) => typeof listener.pid === "number" && Number.isFinite(listener.pid) && (!running || runtimePid != null && !listenerOwnedByRuntimePid({
		listener,
		runtimePid
	})) ? [listener.pid] : [])));
	const { gatewayBootId, gatewayVersion, gatewayBuildId, probeError, authenticationError, staleConnection, activatedPluginErrors, unavailablePlugins, channelProbeErrors, channelProbeTimeouts, channelRuntimeWarnings } = reachability ?? {};
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
		...authenticationError ? { authenticationError } : {},
		...staleConnection ? { staleConnection } : {},
		...activatedPluginErrors?.length ? { activatedPluginErrors } : {},
		...unavailablePlugins?.length ? { unavailablePlugins } : {},
		...channelProbeErrors?.length ? { channelProbeErrors } : {},
		...channelProbeTimeouts?.length ? { channelProbeTimeouts } : {},
		...channelRuntimeWarnings?.length ? { channelRuntimeWarnings } : {}
	}, expectedVersion, expectedBuildId, params.requirePluginHealth !== false, params.requireChannelHealth !== false);
}
//#endregion
//#region src/cli/daemon-cli/restart-health-diagnostics.ts
const restartFailureReasons = {
	"plugin-errors": "activated plugins reported load errors",
	"channel-errors": "channel health checks failed",
	"version-mismatch": "the running Gateway version did not match the expected version",
	"build-id-mismatch": "the running Gateway build did not match the expected build",
	"stale-pids": "stale Gateway processes remained",
	"generation-changed": "the Gateway process generation changed before readiness was confirmed",
	"service-definition-refused": "the service definition refused startup"
};
function formatGatewayStillStarting(snapshot) {
	return `Gateway service is still starting after ${Math.round((snapshot.elapsedMs ?? 0) / 1e3)}s. Last observed startup phase: ${snapshot.startupPhase ?? "unknown"}. Run openclaw gateway status --deep.`;
}
function renderGatewayPortHealthDiagnostics(snapshot) {
	const lines = [];
	if (snapshot.portUsage.status === "busy") lines.push(...formatPortDiagnostics(snapshot.portUsage));
	else lines.push(`Gateway port ${snapshot.portUsage.port} status: ${snapshot.portUsage.status}.`);
	if (snapshot.portUsage.errors?.length) lines.push(`Port diagnostics errors: ${snapshot.portUsage.errors.join("; ")}`);
	if (snapshot.probeError) lines.push(`Gateway check failed: ${snapshot.probeError}`);
	return lines;
}
function renderRestartDiagnostics(snapshot) {
	const lines = [];
	const refusal = snapshot.runtime?.systemd?.startRefusal;
	if (refusal) lines.push(`SERVICE-DEFINITION: ${refusal.message}`);
	if (snapshot.waitOutcome === "still-starting") lines.push(formatGatewayStillStarting(snapshot));
	if (snapshot.waitOutcome === "timeout" && snapshot.startupPhase) lines.push(`Readiness budget exhausted after ${Math.round((snapshot.elapsedMs ?? 0) / 1e3)}s. Last observed startup phase: ${snapshot.startupPhase}.`);
	if (snapshot.waitOutcome === "generation-changed") lines.push("Gateway process generation changed before readiness could be confirmed.");
	for (const [kind, mismatch] of [["version", snapshot.versionMismatch], ["build", snapshot.buildIdMismatch]]) if (mismatch) lines.push(`Gateway ${kind} mismatch: expected ${mismatch.expected}, running gateway reported ${mismatch.actual ?? "unavailable"}.`);
	for (const [heading, errors] of [
		["Activated plugin load errors:", snapshot.activatedPluginErrors],
		["Channel health check errors:", snapshot.channelProbeErrors],
		["Channel health collection warnings:", snapshot.channelProbeTimeouts]
	]) if (errors?.length) {
		lines.push(heading);
		for (const { id, error } of errors) lines.push(`- ${id}: ${error}`);
	}
	const runtimeSummary = [
		snapshot.runtime.status ? `status=${snapshot.runtime.status}` : null,
		snapshot.runtime.state ? `state=${snapshot.runtime.state}` : null,
		snapshot.runtime.pid != null ? `pid=${snapshot.runtime.pid}` : null,
		snapshot.runtime.lastExitStatus != null ? `lastExit=${snapshot.runtime.lastExitStatus}` : null
	].filter(Boolean).join(", ");
	if (runtimeSummary) lines.push(`Service runtime: ${runtimeSummary}`);
	lines.push(...renderGatewayPortHealthDiagnostics(snapshot));
	return lines;
}
function formatGatewayRestartFailure(params) {
	const action = params.action ?? "restart";
	const refusal = params.health.runtime?.systemd?.startRefusal;
	if (params.health.waitOutcome === "service-definition-refused" && refusal) {
		const message = `SERVICE-DEFINITION: ${refusal.message}`;
		return {
			statusLine: message,
			failMessage: message
		};
	}
	if (params.health.waitOutcome === "still-starting") {
		const message = formatGatewayStillStarting(params.health);
		return {
			statusLine: message,
			failMessage: message
		};
	}
	if (params.health.waitOutcome === "port-held") {
		const message = params.health.probeError ?? `Gateway port ${params.port} is held by another process. Inspect it with openclaw gateway status --deep.`;
		return {
			statusLine: message,
			failMessage: message
		};
	}
	if (params.health.waitOutcome === "stopped-free") {
		const elapsedSeconds = Math.max(1, Math.round((params.health.elapsedMs ?? 0) / 1e3));
		return {
			statusLine: `Gateway ${action} failed after ${elapsedSeconds}s: service stayed stopped and port ${params.port} stayed free.`,
			failMessage: `Gateway ${action} failed after ${elapsedSeconds}s: service stayed stopped and health checks never came up.`
		};
	}
	const reason = params.health.waitOutcome && restartFailureReasons[params.health.waitOutcome];
	if (reason) {
		const message = `Gateway ${action} failed: ${reason}.`;
		return {
			statusLine: message,
			failMessage: message
		};
	}
	const timeoutSeconds = Math.max(1, Math.round(params.health.elapsedMs === void 0 ? params.defaultTimeoutSeconds : params.health.elapsedMs / 1e3));
	return {
		statusLine: `Timed out after ${timeoutSeconds}s waiting for gateway port ${params.port} to become healthy.`,
		failMessage: `Gateway ${action} timed out after ${timeoutSeconds}s waiting for health checks.`
	};
}
function getGatewayChannelWarnings(health, http) {
	const warnings = /* @__PURE__ */ new Map();
	for (const warning of [
		...health.channelProbeErrors ?? [],
		...health.channelProbeTimeouts ?? [],
		...health.channelRuntimeWarnings ?? []
	]) if (!warnings.has(warning.id)) warnings.set(warning.id, warning);
	for (const id of http?.failingChannels ?? []) if (![...warnings.keys()].some((key) => key === id || key.startsWith(`${id}/`))) warnings.set(id, {
		id,
		error: "channel readiness unavailable"
	});
	return [...warnings.values()];
}
//#endregion
//#region src/cli/daemon-cli/restart-lock-replacement.ts
async function waitForGatewayLockReplacement(params) {
	let attemptsUsed = 0;
	let previousOwnerReleased = false;
	for (;;) {
		const currentLockIdentity = await readActiveGatewayLockIdentity({ env: params.env }).catch(() => null);
		if (!previousOwnerReleased && currentLockIdentity !== null && (!currentLockIdentity || !isSameGatewayLockIdentity(params.previousLockIdentity, currentLockIdentity))) {
			previousOwnerReleased = true;
			if (params.waitIndefinitelyForPreviousOwner) attemptsUsed = 0;
		}
		if (previousOwnerReleased && currentLockIdentity && !isSameGatewayLockIdentity(params.previousLockIdentity, currentLockIdentity)) return {
			status: "replacement",
			attemptsUsed,
			lockIdentity: currentLockIdentity
		};
		if (!params.waitIndefinitelyForPreviousOwner || previousOwnerReleased) {
			if (attemptsUsed >= params.attempts) return { status: "timeout" };
			attemptsUsed += 1;
		}
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
		if (replacement.status === "timeout") return {
			portUsage: {
				port: params.port,
				status: "unknown",
				listeners: [],
				hints: [],
				errors: [`Previous gateway lock owner ${previousLockIdentity.ownerId ?? previousLockIdentity.pid} is still active.`]
			},
			healthy: false
		};
		attempt = replacement.attemptsUsed;
		expectedListenerPid = replacement.lockIdentity.pid;
	}
	for (;;) {
		const snapshot = await inspectGatewayPortHealth({
			port: params.port,
			auth: probeContext.auth,
			config: probeContext.config,
			configuredProbe,
			expectedListenerPid
		});
		if (!snapshot.healthy && attempt < attempts) {
			attempt += 1;
			await sleep(delayMs);
			continue;
		}
		return snapshot;
	}
}
//#endregion
//#region src/cli/daemon-cli/restart-health.ts
const STARTUP_MIGRATION_ACTIVITY_POLL_MS = 5e3;
const STOPPED_FREE_EARLY_EXIT_GRACE_MS = 1e4;
const WINDOWS_STOPPED_FREE_EARLY_EXIT_GRACE_MS = 9e4;
function withWaitContext(snapshot, waitOutcome, elapsedMs) {
	const outcome = waitOutcome === "healthy" ? "ready" : waitOutcome === "still-starting" ? "starting" : "failed";
	return {
		...snapshot,
		outcome,
		waitOutcome,
		elapsedMs
	};
}
function isSameGatewayRestartGeneration(previous, current) {
	return previous.runtime.status === current.runtime.status && previous.runtime.pid === current.runtime.pid && previous.gatewayBootId === current.gatewayBootId;
}
async function waitForGatewayHealthyRestart(params) {
	const signal = resolveCommandProcessSignal(params.deadline?.signal ?? params.signal);
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
	const attempts = params.attempts ?? DEFAULT_RESTART_HEALTH_ATTEMPTS;
	const delayMs = params.delayMs ?? 500;
	const settleProbes = Math.max(1, params.settle?.probes ?? 1);
	const settleDurationMs = params.deadline ? 0 : Math.min((settleProbes - 1) * delayMs, remainingDeadlineMs === void 0 ? Infinity : Math.max(0, remainingDeadlineMs - (params.timeoutMs ?? remainingDeadlineMs)));
	const progressWindowMs = attempts * delayMs;
	const standardDeadlineMs = timeoutMs ?? progressWindowMs;
	const inspectionTimeoutMs = () => params.deadline ? Math.max(1, params.deadline.remainingMs()) : timeoutMs === void 0 ? void 0 : Math.max(1, timeoutMs + settleDurationMs - (performance.now() - startedAtMs));
	const updateInProgress = (params.env ?? process.env).OPENCLAW_UPDATE_IN_PROGRESS === "1";
	let snapshot = {
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
	};
	let consecutiveStoppedFreeCount = 0;
	const STOPPED_FREE_THRESHOLD = 6;
	const stoppedFreeGraceMs = process.platform === "win32" ? WINDOWS_STOPPED_FREE_EARLY_EXIT_GRACE_MS : STOPPED_FREE_EARLY_EXIT_GRACE_MS;
	const minAttemptForEarlyExit = Math.min(Math.ceil(stoppedFreeGraceMs / delayMs), Math.floor(attempts / 2));
	let migrationActive = false;
	let nextMigrationActivityPollMs = 0;
	let migrationHeartbeat;
	let observedStartupMigration = false;
	let observedRunning = false;
	let observedListener = false;
	let startupProgressDeadlineMs = progressWindowMs;
	let healthyStreak;
	let updateStartupDeadlineMs;
	let observedOwner;
	let observedBootId;
	let reportedStartupPhase;
	let lastProgressPhase;
	const expiredOutcome = (elapsedMs, atStartupCap) => {
		if (snapshot.runtime.status !== "running" || snapshot.versionMismatch || snapshot.buildIdMismatch || params.requireChannelHealth !== false && snapshot.channelProbeErrors?.length || params.requirePluginHealth !== false && snapshot.activatedPluginErrors?.length || snapshot.staleGatewayPids.length > 0) return "timeout";
		if (snapshot.portUsage.status === "free") return "still-starting";
		if (snapshot.runtime.pid === void 0 && snapshot.gatewayBootId === void 0) return "timeout";
		return reportedStartupPhase && snapshot.portUsage.status === "busy" && snapshot.runtime.pid !== void 0 && allListenersOwnedByRuntimePid(snapshot.portUsage.listeners, snapshot.runtime.pid) || atStartupCap && startupProgressDeadlineMs > progressWindowMs && elapsedMs < startupProgressDeadlineMs ? "still-starting" : "timeout";
	};
	try {
		signal?.throwIfAborted();
		if (remainingDeadlineMs === 0) {
			await read("setup", async () => void 0);
			return withWaitContext(snapshot, "timeout", 0);
		}
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
		for (let attempt = 0;; attempt += 1) {
			snapshot = await inspectGatewayRestart({
				service,
				port: params.port,
				env: params.env,
				expectedVersion: params.expectedVersion,
				expectedBuildId: params.expectedBuildId,
				requirePluginHealth: params.requirePluginHealth,
				requireChannelHealth: params.requireChannelHealth,
				probeContext,
				configuredProbe,
				probeHosts,
				timeoutMs: inspectionTimeoutMs(),
				probeTimeoutMs: params.probeTimeoutMs,
				deadline: params.deadline,
				phase: params.phase ?? "health-wait",
				...signal ? { signal } : {}
			});
			signal?.throwIfAborted();
			const identifiedBoot = observedBootId === void 0 && snapshot.gatewayBootId !== void 0;
			observedBootId = snapshot.gatewayBootId ?? observedBootId;
			let elapsedMs = Math.max(0, performance.now() - startedAtMs);
			if (updateInProgress && snapshot.runtime.status === "running") updateStartupDeadlineMs ??= Math.max(standardDeadlineMs, STARTUP_MIGRATION_LEASE_TTL_MS);
			const boundedDeadlineMs = timeoutMs ?? updateStartupDeadlineMs;
			const healthy = snapshot.healthy && (!params.requireRunningService || snapshot.runtime.status === "running" && (process.platform === "win32" || typeof snapshot.runtime.pid === "number"));
			reportedStartupPhase = snapshot.startupPhase;
			snapshot.startupPhase = reportedStartupPhase ?? (healthy ? "settling healthy Gateway" : snapshot.runtime.status !== "running" ? "waiting for managed service" : snapshot.portUsage.status === "free" ? "waiting for Gateway listener" : "waiting for Gateway health and identity");
			params.onObservation?.(snapshot);
			if (!healthy && snapshot.runtime?.systemd?.startRefusal) return withWaitContext({
				...snapshot,
				healthy: false
			}, "service-definition-refused", elapsedMs);
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
			if (params.requireChannelHealth !== false && snapshot.channelProbeErrors?.length) return withWaitContext(snapshot, "channel-errors", elapsedMs);
			if (snapshot.versionMismatch) return withWaitContext(snapshot, "version-mismatch", elapsedMs);
			if (snapshot.buildIdMismatch) return withWaitContext(snapshot, "build-id-mismatch", elapsedMs);
			if (!healthy && snapshot.authenticationError) return withWaitContext(snapshot, "auth-rejected", elapsedMs);
			if (snapshot.staleGatewayPids.length > 0 && snapshot.runtime.status !== "running") return withWaitContext(snapshot, "stale-pids", elapsedMs);
			const stoppedFree = snapshot.runtime.status === "stopped" && snapshot.portUsage.status === "free";
			const portHeldByForeignProcess = params.waitForMissingService === false && (snapshot.runtime.status === "stopped" || snapshot.runtime.status === "unknown" && snapshot.runtime.missingUnit === true) && !reportedStartupPhase && snapshot.portUsage.status === "busy" && !snapshot.portUsage.errors?.length && snapshot.portUsage.listeners.length > 0 && snapshot.portUsage.listeners.every((listener) => classifyPortListener(listener) === "non_gateway" && (snapshot.runtime.pid === void 0 || !listenerOwnedByRuntimePid({
				listener,
				runtimePid: snapshot.runtime.pid
			})));
			const missingServiceFree = params.waitForMissingService === false && snapshot.runtime.status !== "running" && snapshot.runtime.missingUnit === true && snapshot.portUsage.status === "free";
			let missingLegacyOwner = false;
			let startupMigrationInactive = false;
			if (missingServiceFree || portHeldByForeignProcess) {
				try {
					missingLegacyOwner = (await read("legacy-owner", () => readActiveGatewayLockIdentity({
						env: params.env,
						requireInspection: true,
						timeoutMs: params.deadline?.remainingMs() ?? inspectionTimeoutMs(),
						signal
					})))?.port !== params.port;
					observedStartupMigration ||= await read("startup-migration", async () => (params.isStartupMigrationActive ?? hasActiveStartupMigrationLease)({ env: params.env }));
					startupMigrationInactive = !observedStartupMigration;
				} catch (error) {
					if (hasCommandProcessCleanupError(error)) throw error;
					signal?.throwIfAborted();
				}
				elapsedMs = Math.max(0, performance.now() - startedAtMs);
			}
			const owner = stoppedFree || missingServiceFree || portHeldByForeignProcess ? await read("owner", async () => readGatewayOwnerLease({
				env: params.env,
				port: params.port
			})) : void 0;
			elapsedMs = Math.max(0, performance.now() - startedAtMs);
			if (owner && owner.state !== "dead") observedOwner = owner.owner;
			else if (!portHeldByForeignProcess && owner?.state === "dead" && owner.owner === observedOwner && (!missingServiceFree || missingLegacyOwner && startupMigrationInactive)) return withWaitContext(snapshot, "stopped-free", elapsedMs);
			if (missingServiceFree && missingLegacyOwner && startupMigrationInactive && (!owner || owner.state === "dead")) return withWaitContext(snapshot, "stopped-free", elapsedMs);
			if (portHeldByForeignProcess && missingLegacyOwner && startupMigrationInactive && (!owner || owner.state === "dead") && !params.supervisorKeepsAlive) {
				snapshot.startupPhase = "Gateway port held by another process";
				snapshot.probeError = `Gateway port ${params.port} is held by another process. Inspect it with openclaw gateway status --deep; stop the conflicting listener or choose another Gateway port.`;
				return withWaitContext(snapshot, "port-held", elapsedMs);
			}
			if (!missingServiceFree && (!owner || owner.state === "dead") && !params.supervisorKeepsAlive && attempt >= minAttemptForEarlyExit && snapshot.runtime.status === "stopped" && snapshot.portUsage.status === "free") {
				consecutiveStoppedFreeCount += 1;
				if (consecutiveStoppedFreeCount >= STOPPED_FREE_THRESHOLD) return withWaitContext(snapshot, "stopped-free", elapsedMs);
			} else consecutiveStoppedFreeCount = 0;
			let migrationProgress = false;
			let migrationCompleted = false;
			if (snapshot.runtime.status !== "running") migrationActive = false;
			else if (elapsedMs >= nextMigrationActivityPollMs) {
				const previousHeartbeat = migrationHeartbeat;
				migrationHeartbeat = void 0;
				try {
					migrationActive = (params.isStartupMigrationActive ?? hasActiveStartupMigrationLease)({
						env: params.env,
						onActivity: (activity) => {
							if (activity.pid === void 0 || activity.pid !== snapshot.runtime.pid || activity.heartbeatAt === null) return;
							migrationProgress = previousHeartbeat === void 0 || activity.heartbeatAt > previousHeartbeat;
							migrationHeartbeat = activity.heartbeatAt;
						}
					});
					migrationCompleted = !migrationActive && previousHeartbeat !== void 0;
				} catch {
					migrationActive = false;
					migrationProgress = false;
					migrationHeartbeat = previousHeartbeat;
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
			const stableRunning = running && (snapshot.runtime.pid !== void 0 || snapshot.gatewayBootId !== void 0);
			if (!healthy && stableRunning && (boundedDeadlineMs !== void 0 || elapsedMs <= startupProgressDeadlineMs + settleDurationMs) && (migrationProgress || migrationCompleted || startupProgress)) startupProgressDeadlineMs = Math.max(startupProgressDeadlineMs, elapsedMs + Math.max(progressWindowMs, migrationProgress ? STARTUP_MIGRATION_HEARTBEAT_INTERVAL_MS + STARTUP_MIGRATION_ACTIVITY_POLL_MS : 0));
			observedRunning ||= running;
			observedListener ||= ownsListener;
			if (elapsedMs >= standardDeadlineMs) {
				const startupCapMs = Math.max(standardDeadlineMs, STARTUP_MIGRATION_LEASE_TTL_MS);
				const deadlineMs = boundedDeadlineMs !== void 0 ? boundedDeadlineMs + settleDurationMs : Math.min((stableRunning ? startupProgressDeadlineMs : standardDeadlineMs) + settleDurationMs, startupCapMs);
				if (elapsedMs >= deadlineMs) return withWaitContext(snapshot, expiredOutcome(elapsedMs, boundedDeadlineMs !== void 0 || elapsedMs >= startupCapMs), elapsedMs);
			}
			await read("interval", () => sleep(boundedDeadlineMs === void 0 ? delayMs : Math.min(delayMs, Math.max(0, boundedDeadlineMs + settleDurationMs - elapsedMs)), signal));
		}
	} catch (error) {
		if (params.deadlineOutcome === "snapshot" && params.deadline?.timeout && error instanceof GatewayRestartDeadlineError && params.deadline.signal.reason === error) {
			const elapsedMs = Math.max(0, performance.now() - startedAtMs);
			return withWaitContext({
				...snapshot,
				healthy: false
			}, expiredOutcome(elapsedMs, true), elapsedMs);
		}
		throw error;
	}
}
//#endregion
export { getGatewayChannelWarnings as a, inspectGatewayRestart as c, formatGatewayRestartFailure as i, waitForGatewayHealthyRestart as n, renderGatewayPortHealthDiagnostics as o, waitForGatewayHealthyListener as r, renderRestartDiagnostics as s, isSameGatewayRestartGeneration as t };
