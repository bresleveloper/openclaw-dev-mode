import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { s as hasGatewayContextOwner, t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { i as getPluginRuntimeGatewayRequestScope, o as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { A as isValidDiagnosticTraceFlags, N as runWithDiagnosticTraceContext, O as getActiveDiagnosticTraceContext, j as isValidDiagnosticTraceId, k as isValidDiagnosticSpanId, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { d as isGatewaySubordinateWorkAdmissionClosed, t as GatewayDrainingError } from "./gateway-work-admission-CHv_0noy.mjs";
import { d as getAgentRunLifecycleGeneration } from "./agent-run-registry-DO6Dg2r0.mjs";
import { a as runQueuedStoreWrite, i as clearStoreWriterQueuesForTest, t as SQLITE_SESSION_WRITER_QUEUES } from "./openclaw-agent-write-admission-b9fAKekK.mjs";
import { t as clearSessionSkillPromptRefCache } from "./skill-prompt-blobs-CrmXzNVn.mjs";
import { t as createFixedWindowBudget } from "./fixed-window-rate-limit-wyPr2JvV.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import { isMainThread, threadId } from "node:worker_threads";
//#region src/config/sessions/store-writer-state.ts
const WRITER_QUEUES = /* @__PURE__ */ new Map();
/** Clears session writer queues and prompt-blob caches for tests. */
function clearSessionStoreCacheForTest() {
	clearSessionSkillPromptRefCache();
	clearStoreWriterQueuesForTest(WRITER_QUEUES, "session store queue cleared for test");
	clearStoreWriterQueuesForTest(SQLITE_SESSION_WRITER_QUEUES, "SQLite session store queue cleared for test");
}
//#endregion
//#region src/config/sessions/store-writer.ts
async function runExclusiveSessionStoreWrite(storePath, fn, opts = {}) {
	return await runQueuedStoreWrite({
		queues: WRITER_QUEUES,
		storePath,
		label: "runExclusiveSessionStoreWrite",
		fn,
		reentrant: opts.reentrant
	});
}
//#endregion
//#region src/sessions/session-lifecycle-diagnostics.ts
const SLOW_MS = 1e3;
const MAX_HOLDERS = 128;
const MAX_WATCHERS = 32;
const log = createSubsystemLogger("sessions/lifecycle");
function state() {
	return resolveGlobalSingleton(Symbol.for("openclaw.sessionLifecycleDiagnostics"), () => ({
		salt: randomBytes(16),
		epoch: randomBytes(8).toString("hex"),
		sequence: 0,
		watchers: 0,
		omitted: 0,
		holders: /* @__PURE__ */ new WeakMap(),
		trackedHolders: 0,
		budget: createFixedWindowBudget({
			maxRequests: 60,
			windowMs: 6e4,
			now: () => performance.now()
		})
	}));
}
function emit(message, operation, fields) {
	const current = state();
	try {
		if (!areDiagnosticsEnabledForProcess() || !log.isEnabled("warn")) return;
		if (!current.budget.consume().allowed) {
			current.omitted++;
			return;
		}
		const trace = operation.traceId ? {
			traceId: operation.traceId,
			spanId: operation.spanId,
			parentSpanId: operation.parentSpanId,
			traceFlags: operation.traceFlags
		} : void 0;
		runWithDiagnosticTraceContext(trace, () => {
			log.warn(message, {
				pid: process.pid,
				threadId,
				isMainThread,
				diagnosticEpoch: current.epoch,
				omittedObservations: current.omitted,
				...fields()
			});
		});
		current.omitted = 0;
	} catch {
		current.omitted++;
	}
}
function createLifecycleDiagnosticOperation(operation, signal) {
	try {
		if (!areDiagnosticsEnabledForProcess()) return;
		const current = state();
		const trace = getActiveDiagnosticTraceContext();
		const traceId = trace?.traceId;
		const spanId = trace?.spanId;
		const parentSpanId = trace?.parentSpanId;
		const traceFlags = trace?.traceFlags;
		const startedAt = performance.now();
		let phaseStartedAt = startedAt;
		const phaseDurationsMs = {
			prepare: 0,
			run: 0,
			finalize: 0
		};
		const result = {
			id: ++current.sequence,
			operation,
			rootQueue: operation === "lifecycle" ? "lifecycle" : "mutation",
			...signal ? { signal } : {},
			...isValidDiagnosticTraceId(traceId) ? { traceId } : {},
			...isValidDiagnosticSpanId(spanId) ? { spanId } : {},
			...isValidDiagnosticSpanId(parentSpanId) ? { parentSpanId } : {},
			...isValidDiagnosticTraceFlags(traceFlags) ? { traceFlags } : {},
			phase: "admission",
			queueWaitMs: {
				lifecycle: 0,
				mutation: 0
			},
			mark(phase) {
				const now = performance.now();
				if (result.phase === "prepare" || result.phase === "run" || result.phase === "finalize") phaseDurationsMs[result.phase] += now - phaseStartedAt;
				result.phase = phase;
				phaseStartedAt = now;
			},
			finish(finishedAt) {
				result.mark("release");
				const elapsedMs = performance.now() - startedAt;
				if (elapsedMs < SLOW_MS) return;
				emit("slow session lifecycle operation", result, () => ({
					operationId: result.id,
					operation: result.operation,
					operationTraceId: result.traceId,
					operationSpanId: result.spanId,
					elapsedMs: Math.round(elapsedMs),
					...finishedAt !== void 0 ? { completionDelayMs: Math.round(performance.now() - finishedAt) } : {},
					mutationQueueWaitMs: Math.round(result.queueWaitMs.mutation),
					lifecycleQueueWaitMs: Math.round(result.queueWaitMs.lifecycle),
					phaseDurationsMs: Object.fromEntries(Object.entries(phaseDurationsMs).map(([phase, value]) => [phase, Math.round(value)])),
					signalAborted: signal?.aborted ?? false
				}));
			}
		};
		return result;
	} catch {
		return;
	}
}
function beginLifecycleDiagnosticQueue(operation, kind, queues, identity) {
	const current = state();
	const enqueuedAt = performance.now();
	const timing = {};
	let timer;
	let removeAbortListener;
	const stopWatching = () => {
		if (timer !== void 0) {
			clearTimeout(timer);
			timer = void 0;
			current.watchers--;
		}
		removeAbortListener?.();
		removeAbortListener = void 0;
	};
	return {
		timing,
		watch() {
			if (timing.startedAt !== void 0 || operation.signal?.aborted) return;
			if (current.watchers >= MAX_WATCHERS) {
				current.omitted++;
				return;
			}
			current.watchers++;
			timer = setTimeout(() => {
				stopWatching();
				if (timing.startedAt !== void 0 || operation.signal?.aborted) return;
				const now = performance.now();
				const queue = queues.get(identity);
				const holder = queue && current.holders.get(queue);
				emit("session lifecycle queue waiting", operation, () => ({
					operationId: operation.id,
					operation: operation.operation,
					operationTraceId: operation.traceId,
					operationSpanId: operation.spanId,
					queueKind: kind,
					identityHash: createHash("sha256").update(current.salt).update(identity).digest("hex"),
					waitMs: Math.round(now - enqueuedAt),
					holderObserved: Boolean(holder),
					...holder ? {
						holderOperationId: holder.operation.id,
						holderOperation: holder.operation.operation,
						holderPhase: holder.operation.phase,
						holderTraceId: holder.operation.traceId,
						holderSpanId: holder.operation.spanId,
						holderElapsedMs: Math.round(now - holder.acquiredAt),
						holderSignalAborted: holder.operation.signal?.aborted ?? false
					} : {}
				}));
			}, SLOW_MS);
			timer.unref();
			const onAbort = () => stopWatching();
			operation.signal?.addEventListener("abort", onAbort, { once: true });
			removeAbortListener = () => operation.signal?.removeEventListener("abort", onAbort);
		},
		enter() {
			stopWatching();
			const queue = queues.get(identity);
			if (!queue) {
				current.omitted++;
				return;
			}
			if (timing.reentrant !== false || current.holders.has(queue)) return;
			if (current.trackedHolders >= MAX_HOLDERS) {
				current.omitted++;
				return;
			}
			const holder = {
				operation,
				acquiredAt: performance.now()
			};
			current.holders.set(queue, holder);
			current.trackedHolders++;
			return () => {
				if (current.holders.get(queue) === holder) {
					current.holders.delete(queue);
					current.trackedHolders--;
				}
			};
		},
		finish() {
			stopWatching();
			if (timing.startedAt !== void 0) operation.queueWaitMs[kind] += timing.startedAt - enqueuedAt;
		}
	};
}
//#endregion
//#region src/sessions/session-lifecycle-identity.ts
function normalizeSessionIdentities(scope, identities) {
	const normalizedScope = scope.trim();
	if (!normalizedScope) throw new Error("session lifecycle scope is required");
	return Array.from(new Set(Array.from(identities, (identity) => identity?.trim()).filter((identity) => Boolean(identity)))).map((identity) => JSON.stringify([normalizedScope, identity])).toSorted();
}
function decodeSessionIdentity(normalizedIdentity) {
	try {
		const decoded = JSON.parse(normalizedIdentity);
		if (!Array.isArray(decoded) || decoded.length !== 2 || typeof decoded[0] !== "string" || typeof decoded[1] !== "string") return;
		return {
			scope: decoded[0],
			identity: decoded[1]
		};
	} catch {
		return;
	}
}
/** Group a snapshot of owner-held identity keys without sharing its mutable indexes. */
function collectSessionIdentityTargets(identities) {
	const targets = /* @__PURE__ */ new Map();
	for (const identity of identities) {
		const decoded = decodeSessionIdentity(identity);
		if (!decoded) continue;
		const scoped = targets.get(decoded.scope) ?? /* @__PURE__ */ new Set();
		scoped.add(decoded.identity);
		targets.set(decoded.scope, scoped);
	}
	return targets;
}
//#endregion
//#region src/sessions/session-lifecycle-locks.ts
function createSessionIdentityLockRunner(state) {
	return async function runWithSessionIdentityLocks(identities, run, diagnostic, entryPhase, kind = "lifecycle") {
		let acquiring = false;
		let nextAcquisition;
		function enqueueAcquisition(index) {
			return new Promise((resolve, reject) => {
				nextAcquisition = AsyncLocalStorage.bind(() => {
					acquire(index).then(resolve, reject);
				});
				if (acquiring) return;
				acquiring = true;
				try {
					while (nextAcquisition) {
						const next = nextAcquisition;
						nextAcquisition = void 0;
						next();
					}
				} finally {
					acquiring = false;
				}
			});
		}
		async function acquire(index) {
			const identity = identities[index];
			if (!identity) {
				if (entryPhase) diagnostic?.mark(entryPhase);
				return await run();
			}
			const queues = kind === "mutation" ? state.mutationQueues : state.lifecycleQueues;
			const observation = diagnostic && beginLifecycleDiagnosticQueue(diagnostic, kind, queues, identity);
			const pending = runQueuedStoreWrite({
				queues,
				storePath: identity,
				label: kind === "mutation" ? "runExclusiveSessionLifecycleMutation" : "runExclusiveSessionLifecycle",
				reentrant: true,
				timing: observation?.timing,
				fn: async () => {
					const releaseObservation = observation?.enter();
					try {
						return await enqueueAcquisition(index + 1);
					} finally {
						if (index === 0 && kind === diagnostic?.rootQueue) diagnostic.mark("release");
						releaseObservation?.();
					}
				}
			});
			observation?.watch();
			try {
				return await pending;
			} finally {
				observation?.finish();
				if (index === 0 && kind === diagnostic?.rootQueue) diagnostic.finish(observation?.timing.finishedAt);
			}
		}
		return await enqueueAcquisition(0);
	};
}
//#endregion
//#region src/sessions/session-work-admission-handoff.ts
const SESSION_WORK_ADMISSION_HANDOFFS = resolveGlobalSingleton(Symbol.for("openclaw.sessionWorkAdmissionHandoffs"), () => /* @__PURE__ */ new Map());
function createSessionWorkAdmissionHandoff(admission, lease) {
	const handoffId = randomUUID();
	admission.handoffIds.add(handoffId);
	SESSION_WORK_ADMISSION_HANDOFFS.set(handoffId, {
		admission,
		lease
	});
	return handoffId;
}
function clearSessionWorkAdmissionHandoffs(admission) {
	for (const handoffId of admission.handoffIds) SESSION_WORK_ADMISSION_HANDOFFS.delete(handoffId);
	admission.handoffIds.clear();
}
/**
* Atomically adopts a previously admitted work lease across an in-process RPC.
* The opaque token is single-use; requested identities must be covered by the lease.
*/
function consumeSessionWorkAdmissionHandoff(params) {
	const handoffId = params.handoffId.trim();
	if (!handoffId) return;
	const handoff = SESSION_WORK_ADMISSION_HANDOFFS.get(handoffId);
	if (!handoff) return;
	const identities = normalizeSessionIdentities(params.scope, params.identities);
	if (identities.length === 0 || identities.some((identity) => !handoff.admission.identities.has(identity))) return;
	SESSION_WORK_ADMISSION_HANDOFFS.delete(handoffId);
	handoff.admission.handoffIds.delete(handoffId);
	handoff.admission.interrupt = params.onInterrupt;
	if (handoff.admission.interrupted) params.onInterrupt?.(handoff.admission.interrupted);
	return handoff.lease;
}
/** Releases a handoff that was never consumed; the adopter owns consumed leases. */
function cancelSessionWorkAdmissionHandoff(handoffId) {
	const normalizedHandoffId = handoffId.trim();
	const handoff = SESSION_WORK_ADMISSION_HANDOFFS.get(normalizedHandoffId);
	if (!handoff) return false;
	SESSION_WORK_ADMISSION_HANDOFFS.delete(normalizedHandoffId);
	handoff.admission.handoffIds.delete(normalizedHandoffId);
	handoff.lease.release();
	return true;
}
//#endregion
//#region src/sessions/session-work-admission-interruption.ts
async function waitForSessionWorkAdmissionRelease(released, timeoutMs) {
	if (timeoutMs === void 0) {
		await released;
		return true;
	}
	let timer;
	try {
		return await Promise.race([released.then(() => true), new Promise((resolve) => {
			timer = setTimeout(() => resolve(false), Math.max(0, timeoutMs));
			timer.unref?.();
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
//#endregion
//#region src/sessions/session-lifecycle-admission.ts
const SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS = 15e3;
const SESSION_LIFECYCLE_ADMISSION_STATE = resolveGlobalSingleton(Symbol.for("openclaw.sessionLifecycleAdmissionState"), () => ({
	lifecycleQueues: /* @__PURE__ */ new Map(),
	mutationQueues: /* @__PURE__ */ new Map(),
	activeAdmissions: /* @__PURE__ */ new Map(),
	activeMutations: /* @__PURE__ */ new Map(),
	activeMutationRuns: /* @__PURE__ */ new Set(),
	admissionClosures: /* @__PURE__ */ new Set(),
	activeMutationKinds: /* @__PURE__ */ new Map(),
	idleWaiters: /* @__PURE__ */ new Map(),
	currentAdmissions: new AsyncLocalStorage()
}));
const { activeAdmissions: ACTIVE_SESSION_WORK_ADMISSIONS, activeMutations: ACTIVE_SESSION_LIFECYCLE_MUTATIONS, activeMutationKinds: ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS, idleWaiters: SESSION_LIFECYCLE_IDLE_WAITERS, currentAdmissions: CURRENT_SESSION_WORK_ADMISSIONS, admissionClosures: SESSION_WORK_ADMISSION_CLOSURES } = SESSION_LIFECYCLE_ADMISSION_STATE;
const ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS = SESSION_LIFECYCLE_ADMISSION_STATE.activeMutationRuns ??= /* @__PURE__ */ new Set();
const runWithSessionIdentityLocks = createSessionIdentityLockRunner(SESSION_LIFECYCLE_ADMISSION_STATE);
function hasActiveSessionLifecycleMutation(identities) {
	return identities.some((identity) => (ACTIVE_SESSION_LIFECYCLE_MUTATIONS.get(identity) ?? 0) > 0);
}
function hasOnlyActiveSessionLifecycleMutationKind(identities, kind) {
	let foundActiveMutation = false;
	for (const identity of identities) {
		const activeCount = ACTIVE_SESSION_LIFECYCLE_MUTATIONS.get(identity) ?? 0;
		if (activeCount === 0) continue;
		foundActiveMutation = true;
		if ((ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS.get(identity)?.get(kind) ?? 0) !== activeCount) return false;
	}
	return foundActiveMutation;
}
async function waitForNormalizedSessionLifecycleMutationIdle(identities, signal) {
	const activeIdentities = identities.filter((identity) => (ACTIVE_SESSION_LIFECYCLE_MUTATIONS.get(identity) ?? 0) > 0);
	if (activeIdentities.length === 0) return;
	signal?.throwIfAborted();
	const idle = Promise.all(activeIdentities.map((identity) => new Promise((resolve) => {
		const waiters = SESSION_LIFECYCLE_IDLE_WAITERS.get(identity) ?? /* @__PURE__ */ new Set();
		waiters.add(resolve);
		SESSION_LIFECYCLE_IDLE_WAITERS.set(identity, waiters);
	})));
	if (!signal) {
		await idle;
		return;
	}
	let rejectAborted = () => {};
	const aborted = new Promise((_, reject) => {
		rejectAborted = () => reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("session work admission aborted"));
		signal.addEventListener("abort", rejectAborted, { once: true });
	});
	try {
		await Promise.race([idle, aborted]);
	} finally {
		signal.removeEventListener("abort", rejectAborted);
	}
}
async function runExclusiveSessionLifecycle(params) {
	const identities = normalizeSessionIdentities(params.scope, params.identities);
	while (true) {
		params.signal?.throwIfAborted();
		if (hasActiveSessionLifecycleMutation(identities)) {
			await waitForNormalizedSessionLifecycleMutationIdle(identities, params.signal);
			continue;
		}
		const diagnostic = createLifecycleDiagnosticOperation("lifecycle", params.signal);
		const attempt = await runWithSessionIdentityLocks(identities, async () => {
			params.signal?.throwIfAborted();
			if (hasActiveSessionLifecycleMutation(identities)) return { blocked: true };
			return {
				blocked: false,
				value: await params.run()
			};
		}, diagnostic, "run");
		if (!attempt.blocked) return attempt.value;
		await waitForNormalizedSessionLifecycleMutationIdle(identities, params.signal);
	}
}
async function runExclusiveSessionLifecycleMutation(params) {
	const identities = "targets" in params ? Array.from(new Set(Array.from(params.targets, (target) => normalizeSessionIdentities(target.scope, target.identities)).flat())).toSorted() : normalizeSessionIdentities(params.scope, params.identities);
	const signal = params.signal;
	signal?.throwIfAborted();
	const callerAdmissions = new Set(CURRENT_SESSION_WORK_ADMISSIONS.getStore());
	const diagnostic = createLifecycleDiagnosticOperation(params.kind ?? "mutation", signal);
	const mutationRun = { identities };
	let mutationActivated = false;
	let removeAbortListener = () => {};
	let releaseWorkAdmissions;
	const mutation = runWithSessionIdentityLocks(identities, async () => await CURRENT_SESSION_WORK_ADMISSIONS.run(callerAdmissions, async () => {
		await runWithSessionIdentityLocks(identities, async () => {
			signal?.throwIfAborted();
			mutationActivated = true;
			removeAbortListener();
			ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS.add(mutationRun);
			for (const identity of identities) {
				const activeCount = ACTIVE_SESSION_LIFECYCLE_MUTATIONS.get(identity) ?? 0;
				ACTIVE_SESSION_LIFECYCLE_MUTATIONS.set(identity, activeCount + 1);
				if (params.kind) {
					const kinds = ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS.get(identity) ?? /* @__PURE__ */ new Map();
					kinds.set(params.kind, (kinds.get(params.kind) ?? 0) + 1);
					ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS.set(identity, kinds);
				}
			}
		}, diagnostic);
		try {
			diagnostic?.mark("prepare");
			await params.prepare?.({ closeWorkAdmissions: (reason) => {
				releaseWorkAdmissions?.();
				releaseWorkAdmissions = closeNormalizedSessionWorkAdmissions(identities, reason);
			} });
			diagnostic?.mark("run-admission");
			return await runWithSessionIdentityLocks(identities, params.run, diagnostic, "run");
		} finally {
			try {
				diagnostic?.mark("finalize");
				await params.finalize?.();
			} finally {
				diagnostic?.mark("release");
				await runWithSessionIdentityLocks(identities, async () => {
					for (const identity of identities) {
						if (params.kind) {
							const kinds = ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS.get(identity);
							const remainingKindCount = (kinds?.get(params.kind) ?? 1) - 1;
							if (remainingKindCount > 0) kinds?.set(params.kind, remainingKindCount);
							else {
								kinds?.delete(params.kind);
								if (kinds?.size === 0) ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS.delete(identity);
							}
						}
						const remaining = (ACTIVE_SESSION_LIFECYCLE_MUTATIONS.get(identity) ?? 1) - 1;
						if (remaining > 0) {
							ACTIVE_SESSION_LIFECYCLE_MUTATIONS.set(identity, remaining);
							continue;
						}
						ACTIVE_SESSION_LIFECYCLE_MUTATIONS.delete(identity);
						const waiters = SESSION_LIFECYCLE_IDLE_WAITERS.get(identity);
						SESSION_LIFECYCLE_IDLE_WAITERS.delete(identity);
						for (const resolve of waiters ?? []) resolve();
					}
					ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS.delete(mutationRun);
					releaseWorkAdmissions?.();
				}, diagnostic);
			}
		}
	}), diagnostic, "activation", "mutation");
	if (!signal) return await mutation;
	if (mutationActivated) return await mutation;
	const aborted = new Promise((_, reject) => {
		const onAbort = () => {
			if (mutationActivated) return;
			try {
				signal.throwIfAborted();
			} catch (error) {
				reject(error instanceof Error ? error : new Error(String(error)));
			}
		};
		removeAbortListener = () => signal.removeEventListener("abort", onAbort);
		signal.addEventListener("abort", onAbort, { once: true });
		if (signal.aborted) onAbort();
	});
	try {
		return await Promise.race([mutation, aborted]);
	} finally {
		removeAbortListener();
	}
}
function isSessionLifecycleMutationActive(scope, identities) {
	return hasActiveSessionLifecycleMutation(normalizeSessionIdentities(scope, identities));
}
function hasOnlySessionLifecycleMutationKindActive(scope, identities, kind) {
	return hasOnlyActiveSessionLifecycleMutationKind(normalizeSessionIdentities(scope, identities), kind);
}
function isSessionWorkAdmissionActive(scope, identities) {
	return normalizeSessionIdentities(scope, identities).some((identity) => [...ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? []].some((admission) => admission.phase === "acquired"));
}
function isSessionWorkAdmissionTargetActive(params) {
	const identities = normalizeSessionIdentities(params.scope, [params.sessionKey, params.sessionId]);
	return identities.some((identity) => Array.from(ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? []).some((admission) => admission.phase === "acquired" && (!params.owners || params.owners.has(admission) && admission.lifecycleGeneration === getAgentRunLifecycleGeneration()) && (admission.identities.size === 1 || identities.every((target) => admission.identities.has(target)))));
}
/** Whether another admitted turn currently owns any of these session identities. */
function isCompetingSessionWorkAdmissionActive(scope, identities) {
	const currentAdmissions = CURRENT_SESSION_WORK_ADMISSIONS.getStore();
	return normalizeSessionIdentities(scope, identities).some((identity) => Array.from(ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? [], (admission) => admission.phase === "acquired" && !currentAdmissions?.has(admission)).some(Boolean));
}
/** Completion of the currently active turns that own a session. */
function getSessionWorkAdmissionRelease(params) {
	const matchingAdmissions = /* @__PURE__ */ new Set();
	for (const identity of normalizeSessionIdentities(params.scope, params.identities)) for (const admission of ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? []) if (admission.phase === "acquired") matchingAdmissions.add(admission);
	if (matchingAdmissions.size === 0) return;
	return Promise.all(Array.from(matchingAdmissions, (admission) => admission.released)).then(() => void 0);
}
/** Completion of a named owner that is starting or actively working on a session. */
function getSessionWorkAdmissionOwnerRelease(params) {
	const matching = /* @__PURE__ */ new Set();
	for (const identity of normalizeSessionIdentities(params.scope, params.identities)) for (const admission of ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? []) if (admission.owner === params.owner) matching.add(admission);
	return matching.size > 0 ? Promise.all(Array.from(matching, (admission) => admission.released)).then(() => void 0) : void 0;
}
/** Active session identities grouped by their authoritative store/lifecycle scope. */
function collectActiveSessionWorkAdmissions(owners) {
	return collectSessionIdentityTargets([...ACTIVE_SESSION_WORK_ADMISSIONS].filter(([, admissions]) => [...admissions].some((admission) => admission.phase === "acquired" && (!owners || owners.has(admission)))).map(([identity]) => identity));
}
/** Capture exact host-owned admissions; replacements after an await cannot inherit the snapshot. */
function captureGatewaySessionWorkAdmissions(resolveGatewayContext) {
	const owners = new Set([...ACTIVE_SESSION_WORK_ADMISSIONS.values()].flatMap((admissions) => [...admissions].filter((admission) => admission.phase === "acquired" && admission.lifecycleGeneration === getAgentRunLifecycleGeneration() && hasGatewayContextOwner(admission, resolveGatewayContext))));
	return {
		targets: collectActiveSessionWorkAdmissions(owners),
		isActive: (target) => isSessionWorkAdmissionTargetActive({
			...target,
			owners
		})
	};
}
/** Unique admitted turns; one lease can be indexed under several identities. */
function getActiveSessionWorkAdmissionCount() {
	const admissions = /* @__PURE__ */ new Set();
	for (const active of ACTIVE_SESSION_WORK_ADMISSIONS.values()) for (const admission of active) if (admission.phase === "acquired") admissions.add(admission);
	return admissions.size;
}
/** Unique active lifecycle mutations; one run can be indexed under several identities. */
function getActiveSessionLifecycleMutationCount() {
	if (ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS.size > 0) return ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS.size;
	return ACTIVE_SESSION_LIFECYCLE_MUTATIONS.size > 0 ? 1 : 0;
}
/** Snapshot the existing lifecycle identity index for off-thread maintenance planning. */
function collectActiveSessionLifecycleMutationIdentities(scope) {
	return [...collectSessionIdentityTargets([...ACTIVE_SESSION_LIFECYCLE_MUTATIONS].filter(([, count]) => count > 0).map(([identity]) => identity)).get(scope.trim()) ?? []].toSorted();
}
async function beginSessionWorkAdmission(params) {
	if (isGatewaySubordinateWorkAdmissionClosed()) throw new GatewayDrainingError();
	const rawIdentities = Array.from(params.identities);
	const resolveGatewayContext = Object.hasOwn(params, "resolveGatewayContext") ? params.resolveGatewayContext : getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext;
	const identities = normalizeSessionIdentities(params.scope, rawIdentities);
	const pendingController = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, pendingController.signal]) : pendingController.signal;
	let writerBarrierStarted = false;
	let resolveReleased = () => {};
	const admission = {
		lifecycleGeneration: getAgentRunLifecycleGeneration(),
		phase: "pending",
		...params.owner ? { owner: params.owner } : {},
		handoffIds: /* @__PURE__ */ new Set(),
		identities: new Set(identities),
		interrupted: void 0,
		interrupt: (reason) => {
			admission.interrupted ??= reason ?? /* @__PURE__ */ new Error("Session work admission interrupted");
			try {
				return params.onInterrupt?.(admission.interrupted);
			} finally {
				if (!writerBarrierStarted) pendingController.abort(admission.interrupted);
			}
		},
		released: new Promise((resolve) => {
			resolveReleased = resolve;
		})
	};
	bindGatewayContextResolver(admission, resolveGatewayContext);
	for (const identity of identities) {
		const active = ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? /* @__PURE__ */ new Set();
		active.add(admission);
		ACTIVE_SESSION_WORK_ADMISSIONS.set(identity, active);
	}
	let released = false;
	const release = () => {
		if (released) return;
		released = true;
		for (const identity of identities) {
			const active = ACTIVE_SESSION_WORK_ADMISSIONS.get(identity);
			active?.delete(admission);
			if (!active?.size) ACTIVE_SESSION_WORK_ADMISSIONS.delete(identity);
		}
		clearSessionWorkAdmissionHandoffs(admission);
		resolveReleased();
	};
	const lease = {
		isActive: () => !released,
		createHandoff: () => {
			if (released) throw new Error("cannot hand off a released session work admission");
			return createSessionWorkAdmissionHandoff(admission, lease);
		},
		release,
		released: admission.released,
		run: async (run) => {
			const current = new Set(CURRENT_SESSION_WORK_ADMISSIONS.getStore());
			current.add(admission);
			return await CURRENT_SESSION_WORK_ADMISSIONS.run(current, () => withPluginRuntimeGatewayContextResolver(resolveGatewayContext, run));
		}
	};
	let removeAbortListener = () => {};
	try {
		const closedOwner = [...SESSION_WORK_ADMISSION_CLOSURES].find((owner) => owner.identities.some((identity) => admission.identities.has(identity)));
		if (closedOwner) admission.interrupt?.(closedOwner.reason);
		const queuedAbort = new Promise((_, reject) => {
			const onAbort = () => {
				if (!writerBarrierStarted) reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("session work admission aborted"));
			};
			removeAbortListener = () => signal.removeEventListener("abort", onAbort);
			signal.addEventListener("abort", onAbort, { once: true });
			if (signal.aborted) onAbort();
		});
		const acquired = runExclusiveSessionLifecycle({
			scope: params.scope,
			identities: rawIdentities,
			signal,
			run: async () => {
				const current = new Set(CURRENT_SESSION_WORK_ADMISSIONS.getStore());
				current.add(admission);
				await CURRENT_SESSION_WORK_ADMISSIONS.run(current, params.assertAllowed);
				if (isGatewaySubordinateWorkAdmissionClosed()) throw new GatewayDrainingError();
				signal.throwIfAborted();
				admission.phase = "acquired";
				await runExclusiveSessionStoreWrite(params.scope, async () => {
					writerBarrierStarted = true;
					signal.throwIfAborted();
					await lease.run(async () => await (params.revalidateAllowed ?? params.assertAllowed)());
				}, { reentrant: true });
				return lease;
			}
		});
		return await Promise.race([acquired, queuedAbort]);
	} catch (error) {
		release();
		throw error;
	} finally {
		removeAbortListener();
	}
}
function closeNormalizedSessionWorkAdmissions(identities, reason) {
	const owner = {
		identities,
		reason
	};
	SESSION_WORK_ADMISSION_CLOSURES.add(owner);
	try {
		startNormalizedSessionWorkAdmissionInterruption({
			identities,
			reason,
			pendingOnly: true
		});
	} catch (error) {
		SESSION_WORK_ADMISSION_CLOSURES.delete(owner);
		throw error;
	}
	return () => {
		SESSION_WORK_ADMISSION_CLOSURES.delete(owner);
	};
}
/** Fence ingress while awaiting cleanup that must run outside lifecycle/placement locks. */
function closeSessionWorkAdmissions(params) {
	return closeNormalizedSessionWorkAdmissions(normalizeSessionIdentities(params.scope, params.identities), params.reason);
}
function startNormalizedSessionWorkAdmissionInterruption(params) {
	const admissions = /* @__PURE__ */ new Set();
	const interruptedRunIds = /* @__PURE__ */ new Set();
	const currentAdmissions = CURRENT_SESSION_WORK_ADMISSIONS.getStore();
	for (const identity of params.identities) for (const admission of ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? []) {
		if (params.pendingOnly && admission.phase !== "pending") continue;
		if (currentAdmissions?.has(admission)) continue;
		admissions.add(admission);
	}
	for (const admission of admissions) {
		admission.interrupted ??= params.reason ?? /* @__PURE__ */ new Error("Session work admission interrupted");
		const receipt = admission.interrupt?.(admission.interrupted);
		if (receipt) interruptedRunIds.add(receipt.runId);
	}
	return {
		interruptedRunIds,
		released: Promise.all(Array.from(admissions, (admission) => admission.released)).then(() => void 0)
	};
}
function startSessionWorkAdmissionInterruption(params) {
	return startNormalizedSessionWorkAdmissionInterruption({
		identities: normalizeSessionIdentities(params.scope, params.identities),
		reason: params.reason
	});
}
async function interruptSessionWorkAdmissions(params) {
	const { released } = startSessionWorkAdmissionInterruption(params);
	return waitForSessionWorkAdmissionRelease(released, params.timeoutMs);
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.sessionLifecycleAdmissionTestApi")] = { runExclusiveSessionLifecycle };
//#endregion
export { clearSessionStoreCacheForTest as C, runExclusiveSessionStoreWrite as S, startSessionWorkAdmissionInterruption as _, collectActiveSessionLifecycleMutationIdentities as a, consumeSessionWorkAdmissionHandoff as b, getActiveSessionWorkAdmissionCount as c, hasOnlySessionLifecycleMutationKindActive as d, interruptSessionWorkAdmissions as f, runExclusiveSessionLifecycleMutation as g, isSessionWorkAdmissionActive as h, closeSessionWorkAdmissions as i, getSessionWorkAdmissionOwnerRelease as l, isSessionLifecycleMutationActive as m, beginSessionWorkAdmission as n, collectActiveSessionWorkAdmissions as o, isCompetingSessionWorkAdmissionActive as p, captureGatewaySessionWorkAdmissions as r, getActiveSessionLifecycleMutationCount as s, SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS as t, getSessionWorkAdmissionRelease as u, waitForSessionWorkAdmissionRelease as v, normalizeSessionIdentities as x, cancelSessionWorkAdmissionHandoff as y };
