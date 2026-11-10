import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { c as withPluginRuntimeGatewayContextResolver, f as bindGatewayContextResolver, o as getPluginRuntimeGatewayRequestScope, v as hasGatewayContextOwner } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { A as isValidDiagnosticSpanId, M as isValidDiagnosticTraceId, P as runWithDiagnosticTraceContext, j as isValidDiagnosticTraceFlags, k as getActiveDiagnosticTraceContext, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as runQueuedStoreWrite, t as clearStoreWriterQueuesForTest } from "./store-writer-queue-AKR6NnXM.mjs";
import { r as SQLITE_SESSION_WRITER_QUEUES } from "./worker-task-pool-registry-D6q0YAmu.mjs";
import { t as settlesWithin } from "./settle-within-DLEx44ea.mjs";
import { m as isGatewaySubordinateWorkAdmissionClosed, t as GatewayDrainingError } from "./gateway-work-admission-FWbk4b3p.mjs";
import { o as readAgentDeletionJournalStatusInWorker } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { t as runStoreWriterAcquisitions } from "./store-writer-acquisitions-Q--yqQda.mjs";
import { a as interruptSessionWorkAdmissionOwners, c as sessionWorkAdmissionClosures, i as createAgentWorkAdmissionQueries, l as collectSessionIdentityTargets, n as agentWorkAdmissionIdentity, o as matchesAgentWorkAdmission, u as normalizeSessionIdentities } from "./session-agent-work-admission-D63nonbM.mjs";
import { l as isAgentRunDirectAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { t as clearSessionSkillPromptRefCache } from "./skill-prompt-blobs-DIJpnTwW.mjs";
import { t as createFixedWindowBudget } from "./fixed-window-rate-limit-BlrEf45U.mjs";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { isMainThread, threadId } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
import { performance } from "node:perf_hooks";
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
		reentrant: opts.reentrant,
		signal: opts.signal,
		keys: opts.identities ? normalizeSessionIdentities(storePath, opts.identities) : void 0
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
function identityHash(identity) {
	return createHash("sha256").update(state().salt).update(identity).digest("hex");
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
				operationId: operation.id,
				operation: operation.operation,
				mutationKind: operation.mutationKind,
				sessionScopeHash: identityHash(operation.scopeIdentity),
				identityCount: operation.identityCount,
				operationTraceId: operation.traceId,
				operationSpanId: operation.spanId,
				...fields()
			});
		});
		current.omitted = 0;
	} catch {
		current.omitted++;
	}
}
function createLifecycleDiagnosticOperation(operation, identities, signal, mutationKind) {
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
			mutationKind,
			identityCount: identities.length,
			scopeIdentity: identities[0] ?? "",
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
					queueKind: kind,
					identityHash: identityHash(identity),
					waitMs: Math.round(now - enqueuedAt),
					holderObserved: Boolean(holder),
					...holder ? {
						holderOperationId: holder.operation.id,
						holderOperation: holder.operation.operation,
						holderMutationKind: holder.operation.mutationKind,
						holderSessionScopeHash: identityHash(holder.operation.scopeIdentity),
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
//#region src/sessions/session-lifecycle-locks.ts
function createSessionIdentityLockRunner(state) {
	return async function runWithSessionIdentityLocks(identities, run, diagnostic, entryPhase, kind = "lifecycle") {
		return await runStoreWriterAcquisitions(async (index, next) => {
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
						return await next();
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
		});
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
	handoff.admission.isSettling = params.isSettling ?? handoff.admission.isSettling;
	handoff.admission.getAbortReason = params.getAbortReason ?? handoff.admission.getAbortReason;
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
function sessionWorkAdmissionAbortError(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("session work admission aborted");
}
async function waitForSessionWorkAdmissionRelease(released, timeoutMs) {
	if (timeoutMs === void 0) {
		await released;
		return true;
	}
	return await settlesWithin(released, Math.max(0, timeoutMs));
}
//#endregion
//#region src/sessions/session-work-admission-queries.ts
/** Read-only queries over the lifecycle owner's live admission index. */
function createSessionWorkAdmissionQueries(admissionsByIdentity, currentAdmissions) {
	function collectSessionWorkAdmissions(identities, matches) {
		const matching = /* @__PURE__ */ new Set();
		for (const identity of identities) for (const admission of admissionsByIdentity.get(identity) ?? []) if (matches(admission)) matching.add(admission);
		return matching;
	}
	/** Capture exact run owners without interrupting unrelated or initiating admissions. */
	function captureSessionWorkRunInterruptions(params) {
		const identities = normalizeSessionIdentities(params.scope, params.identities);
		const current = currentAdmissions();
		const isCurrent = (admission) => identities.some((identity) => admissionsByIdentity.get(identity)?.has(admission));
		const admissions = collectSessionWorkAdmissions(identities, (admission) => !current?.has(admission));
		return Array.from(admissions).flatMap((admission) => {
			const run = admission.run;
			if (!run || !params.accept(run)) return [];
			return [{
				run,
				released: admission.released,
				interrupt: (reason) => {
					if (admission.interrupted || !isCurrent(admission)) return false;
					return admission.interrupt?.(reason)?.runId === run.runId;
				}
			}];
		});
	}
	function isRestartRecoverableAdmission(admission) {
		const abortReason = admission.getAbortReason?.() ?? admission.interrupted;
		return admission.phase === "acquired" && (!admission.isSettling?.() || !isAgentRunDirectAbortReason(abortReason));
	}
	function isSessionWorkAdmissionTargetActive(params) {
		const identities = normalizeSessionIdentities(params.scope, [params.sessionKey, params.sessionId]);
		return identities.some((identity) => Array.from(admissionsByIdentity.get(identity) ?? []).some((admission) => isRestartRecoverableAdmission(admission) && (!params.owners || params.owners.has(admission)) && (admission.identities.size === 1 || identities.every((target) => admission.identities.has(target)))));
	}
	/** Capture exact host-owned admissions; replacements after an await cannot inherit the snapshot. */
	function captureGatewaySessionWorkAdmissions(resolveGatewayContext) {
		const owners = collectSessionWorkAdmissions(admissionsByIdentity.keys(), (admission) => isRestartRecoverableAdmission(admission) && hasGatewayContextOwner(admission, resolveGatewayContext));
		return {
			targets: collectActiveSessionWorkAdmissions(owners),
			isActive: (target) => isSessionWorkAdmissionTargetActive({
				...target,
				owners
			})
		};
	}
	/** Active session identities grouped by their authoritative store/lifecycle scope. */
	function collectActiveSessionWorkAdmissions(owners) {
		const identities = [...admissionsByIdentity].filter(([, admissions]) => [...admissions].some((admission) => admission.phase === "acquired" && (!owners || owners.has(admission)))).map(([identity]) => identity);
		return collectSessionIdentityTargets(identities);
	}
	/** Unique admitted turns; one lease can be indexed under several identities. */
	function getActiveSessionWorkAdmissionCount() {
		return collectSessionWorkAdmissions(admissionsByIdentity.keys(), (admission) => admission.phase === "acquired").size;
	}
	function isSessionWorkAdmissionActive(scope, identities) {
		return normalizeSessionIdentities(scope, identities).some((identity) => [...admissionsByIdentity.get(identity) ?? []].some((admission) => admission.phase === "acquired"));
	}
	/** Whether another admitted turn currently owns any of these session identities. */
	function isCompetingSessionWorkAdmissionActive(scope, identities, agent) {
		const current = currentAdmissions();
		return normalizeSessionIdentities(scope, identities).some((identity) => [...admissionsByIdentity.get(identity) ?? []].some((admission) => admission.phase === "acquired" && !current?.has(admission) && (!agent || matchesAgentWorkAdmission(agent, admission.agent))));
	}
	function sessionWorkAdmissionRelease(params, matches) {
		const admissions = collectSessionWorkAdmissions(normalizeSessionIdentities(params.scope, params.identities), matches);
		return admissions.size > 0 ? Promise.all(Array.from(admissions, (admission) => admission.released)).then(() => void 0) : void 0;
	}
	/** Completion of the currently active turns that own a session. */
	function getSessionWorkAdmissionRelease(params) {
		return sessionWorkAdmissionRelease(params, (admission) => admission.phase === "acquired");
	}
	/** Completion of a named owner that is starting or actively working on a session. */
	function getSessionWorkAdmissionOwnerRelease(params) {
		return sessionWorkAdmissionRelease(params, (admission) => admission.owner === params.owner && (!params.phase || admission.phase === params.phase));
	}
	/** Wait for exact prior owners, including queued work, without waiting on inherited admission. */
	function getCompetingSessionWorkAdmissionRelease(params) {
		const current = currentAdmissions();
		return sessionWorkAdmissionRelease(params, (admission) => !current?.has(admission) && (params.owner === void 0 || admission.owner === params.owner) && !(params.excludePendingOwner !== void 0 && admission.phase === "pending" && admission.owner === params.excludePendingOwner));
	}
	/** Capture terminal owners without waiting on a live turn or a later successor. */
	function getTerminalSessionWorkAdmissionRelease(params) {
		const current = currentAdmissions();
		const admissions = collectSessionWorkAdmissions(normalizeSessionIdentities(params.scope, params.identities), (admission) => admission.phase === "acquired" && !current?.has(admission));
		if ([...admissions].some((admission) => !admission.isSettling?.())) return false;
		return Promise.all([...admissions].map((admission) => admission.released)).then(() => void 0);
	}
	return {
		collectSessionWorkAdmissions,
		captureSessionWorkRunInterruptions,
		captureGatewaySessionWorkAdmissions,
		collectActiveSessionWorkAdmissions,
		getActiveSessionWorkAdmissionCount,
		isSessionWorkAdmissionActive,
		isCompetingSessionWorkAdmissionActive,
		getSessionWorkAdmissionRelease,
		getSessionWorkAdmissionOwnerRelease,
		getCompetingSessionWorkAdmissionRelease,
		getTerminalSessionWorkAdmissionRelease
	};
}
//#endregion
//#region src/sessions/session-lifecycle-admission.ts
const SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS = 15e3;
const SESSION_LIFECYCLE_ADMISSION_STATE = resolveGlobalSingleton(Symbol.for("openclaw.sessionLifecycleAdmissionState"), () => ({
	lifecycleQueues: /* @__PURE__ */ new Map(),
	mutationQueues: /* @__PURE__ */ new Map(),
	activeAdmissions: /* @__PURE__ */ new Map(),
	workReleaseListeners: /* @__PURE__ */ new Map(),
	activeMutationRuns: /* @__PURE__ */ new Set(),
	idleWaiters: /* @__PURE__ */ new Map(),
	currentAdmissions: new AsyncLocalStorage()
}));
const { activeAdmissions: ACTIVE_SESSION_WORK_ADMISSIONS, workReleaseListeners: SESSION_WORK_RELEASE_LISTENERS, activeMutationRuns: ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS, idleWaiters: SESSION_LIFECYCLE_IDLE_WAITERS, currentAdmissions: CURRENT_SESSION_WORK_ADMISSIONS } = SESSION_LIFECYCLE_ADMISSION_STATE;
const { collectSessionWorkAdmissions, collectActiveSessionWorkAdmissions, captureSessionWorkRunInterruptions, captureGatewaySessionWorkAdmissions, getActiveSessionWorkAdmissionCount, getSessionWorkAdmissionRelease, getSessionWorkAdmissionOwnerRelease, getCompetingSessionWorkAdmissionRelease, getTerminalSessionWorkAdmissionRelease, isSessionWorkAdmissionActive, isCompetingSessionWorkAdmissionActive } = createSessionWorkAdmissionQueries(ACTIVE_SESSION_WORK_ADMISSIONS, () => CURRENT_SESSION_WORK_ADMISSIONS.getStore());
const { closeAgentWorkAdmissions, collectActiveAgentSessionWorkAdmissions, startAgentWorkAdmissionInterruption, assertSessionWorkAdmissionOpen } = createAgentWorkAdmissionQueries(ACTIVE_SESSION_WORK_ADMISSIONS, () => CURRENT_SESSION_WORK_ADMISSIONS.getStore());
const runWithSessionIdentityLocks = createSessionIdentityLockRunner(SESSION_LIFECYCLE_ADMISSION_STATE);
function hasActiveSessionLifecycleMutation(identities) {
	return [...ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS].some((run) => run.identities.some((identity) => identities.includes(identity)));
}
function hasOnlyActiveSessionLifecycleMutationKind(identities, kind) {
	const active = [...ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS].filter((run) => run.identities.some((identity) => identities.includes(identity)));
	return active.length > 0 && active.every((run) => run.kind === kind);
}
async function waitForNormalizedSessionLifecycleMutationIdle(identities, signal) {
	const activeIdentities = identities.filter((identity) => hasActiveSessionLifecycleMutation([identity]));
	if (activeIdentities.length === 0) return;
	signal?.throwIfAborted();
	const idle = Promise.all(activeIdentities.map((identity) => new Promise((resolve) => {
		const waiters = SESSION_LIFECYCLE_IDLE_WAITERS.get(identity) ?? /* @__PURE__ */ new Set();
		waiters.add(resolve);
		SESSION_LIFECYCLE_IDLE_WAITERS.set(identity, waiters);
	})));
	await racePromiseWithAbortSignal(idle, signal, sessionWorkAdmissionAbortError);
}
async function runExclusiveSessionLifecycle(params) {
	const identities = normalizeSessionIdentities(params.scope, params.identities);
	while (true) {
		params.signal?.throwIfAborted();
		if (hasActiveSessionLifecycleMutation(identities)) {
			await waitForNormalizedSessionLifecycleMutationIdle(identities, params.signal);
			continue;
		}
		const diagnostic = createLifecycleDiagnosticOperation("lifecycle", identities, params.signal);
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
async function runExclusiveSessionLifecycleMutation(operation, params) {
	const identities = "targets" in params ? Array.from(new Set(Array.from(params.targets, (target) => normalizeSessionIdentities(target.scope, target.identities)).flat())).toSorted() : normalizeSessionIdentities(params.scope, params.identities);
	const signal = params.signal;
	signal?.throwIfAborted();
	const callerAdmissions = new Set(CURRENT_SESSION_WORK_ADMISSIONS.getStore());
	const diagnostic = createLifecycleDiagnosticOperation(params.kind ?? "mutation", identities, signal, operation);
	const mutationRun = {
		identities,
		kind: params.kind
	};
	let mutationActivated = false;
	let removeAbortListener = () => {};
	let releaseWorkAdmissions;
	const mutation = runWithSessionIdentityLocks(identities, async () => await CURRENT_SESSION_WORK_ADMISSIONS.run(callerAdmissions, async () => {
		await runWithSessionIdentityLocks(identities, async () => {
			signal?.throwIfAborted();
			mutationActivated = true;
			removeAbortListener();
			ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS.add(mutationRun);
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
					ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS.delete(mutationRun);
					for (const identity of identities) {
						if (hasActiveSessionLifecycleMutation([identity])) continue;
						const waiters = SESSION_LIFECYCLE_IDLE_WAITERS.get(identity);
						SESSION_LIFECYCLE_IDLE_WAITERS.delete(identity);
						for (const resolve of waiters ?? []) resolve();
					}
					releaseWorkAdmissions?.();
				}, diagnostic);
			}
		}
	}), diagnostic, "activation", "mutation");
	if (!signal || mutationActivated) return await mutation;
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
/** Unique active lifecycle mutations; one run can be indexed under several identities. */
function getActiveSessionLifecycleMutationCount() {
	return ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS.size;
}
/** Snapshot the existing lifecycle identity index for off-thread maintenance planning. */
function collectActiveSessionLifecycleMutationIdentities(scope) {
	const identities = [...ACTIVE_SESSION_LIFECYCLE_MUTATION_RUNS].flatMap((run) => run.identities);
	return [...collectSessionIdentityTargets(identities).get(scope.trim()) ?? []].toSorted();
}
/** Observe acquired protection disappearing, independently of terminal row publication. */
function observeSessionWorkAdmissionReleases(scope, listener) {
	const key = scope.trim();
	const listeners = SESSION_WORK_RELEASE_LISTENERS.get(key) ?? /* @__PURE__ */ new Set();
	listeners.add(listener);
	SESSION_WORK_RELEASE_LISTENERS.set(key, listeners);
	return () => {
		listeners.delete(listener);
		if (listeners.size === 0 && SESSION_WORK_RELEASE_LISTENERS.get(key) === listeners) SESSION_WORK_RELEASE_LISTENERS.delete(key);
	};
}
async function beginSessionWorkAdmission(params) {
	if (isGatewaySubordinateWorkAdmissionClosed()) throw new GatewayDrainingError();
	const rawIdentities = Array.from(params.identities);
	const agent = params.agentId ? agentWorkAdmissionIdentity({
		...params,
		agentId: params.agentId
	}) : void 0;
	const resolveGatewayContext = Object.hasOwn(params, "resolveGatewayContext") ? params.resolveGatewayContext : getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext;
	const identities = normalizeSessionIdentities(params.scope, rawIdentities);
	const inheritedAdmissions = CURRENT_SESSION_WORK_ADMISSIONS.getStore();
	const predecessors = params.serializeOwner && params.owner ? collectSessionWorkAdmissions(identities, (admission) => admission.owner === params.owner) : /* @__PURE__ */ new Set();
	if (Array.from(predecessors).some((admission) => inheritedAdmissions?.has(admission) && identities.every((identity) => admission.identities.has(identity)))) predecessors.clear();
	const pendingController = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, pendingController.signal]) : pendingController.signal;
	let writerBarrierStarted = false;
	const { promise: releasedPromise, resolve: resolveReleased } = createDeferredCore();
	const admission = {
		agent,
		run: params.run ? Object.freeze({ ...params.run }) : void 0,
		phase: "pending",
		isSettling: params.isSettling,
		getAbortReason: params.getAbortReason ?? (() => signal.reason),
		...params.owner ? { owner: params.owner } : {},
		handoffIds: /* @__PURE__ */ new Set(),
		identities: new Set(identities),
		interrupted: void 0,
		interrupt: (reason) => {
			admission.interrupted ??= reason ?? /* @__PURE__ */ new Error("Session work admission interrupted");
			try {
				return params.onInterrupt?.(admission.interrupted);
			} finally {
				pendingController.abort(admission.interrupted);
			}
		},
		released: releasedPromise
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
		const listeners = SESSION_WORK_RELEASE_LISTENERS.get(params.scope.trim());
		let protectionReleased = false;
		for (const identity of identities) {
			const active = ACTIVE_SESSION_WORK_ADMISSIONS.get(identity);
			active?.delete(admission);
			if (!active?.size) ACTIVE_SESSION_WORK_ADMISSIONS.delete(identity);
			if (listeners?.size && admission.phase === "acquired" && ![...active ?? []].some((other) => other.phase === "acquired")) protectionReleased = true;
		}
		clearSessionWorkAdmissionHandoffs(admission);
		resolveReleased();
		if (protectionReleased) notifyListeners(listeners ?? [], void 0);
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
	const assertIngressOpen = () => {
		assertSessionWorkAdmissionOpen(admission);
		signal.throwIfAborted();
	};
	const assertAgentIngressOpen = async () => {
		assertIngressOpen();
		if (agent) {
			if (await readAgentDeletionJournalStatusInWorker(agent.agentId, {
				path: agent.statePath,
				env: params.env
			}, signal) !== "absent") throw new Error(`Agent ${agent.agentId} deletion is in progress; new work is unavailable.`);
		}
		assertIngressOpen();
	};
	try {
		await assertAgentIngressOpen();
		if (predecessors.size > 0) await racePromiseWithAbortSignal(Promise.all(Array.from(predecessors, (predecessor) => predecessor.released)), signal, sessionWorkAdmissionAbortError);
		const queuedAbort = new Promise((_, reject) => {
			const onAbort = () => {
				if (!writerBarrierStarted) reject(sessionWorkAdmissionAbortError(signal));
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
				if (params.revalidateAllowed && params.assertAllowed) await lease.run(async () => await params.assertAllowed?.(signal));
				assertIngressOpen();
				if (isGatewaySubordinateWorkAdmissionClosed()) throw new GatewayDrainingError();
				if (params.revalidateAllowed) admission.phase = "acquired";
				await runExclusiveSessionStoreWrite(params.scope, async () => {
					writerBarrierStarted = true;
					signal.throwIfAborted();
					assertIngressOpen();
					await lease.run(async () => {
						if (params.revalidateAllowed) await params.revalidateAllowed();
						else {
							await params.assertAllowed?.(signal);
							admission.phase = "acquired";
						}
					});
					assertIngressOpen();
				}, {
					reentrant: true,
					identities: params.storeWriterIdentities,
					signal
				});
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
function closeNormalizedSessionWorkAdmissions(identities, reason, assertCurrent, agent) {
	const owner = {
		identities,
		reason,
		agent
	};
	sessionWorkAdmissionClosures.add(owner);
	try {
		startNormalizedSessionWorkAdmissionInterruption({
			identities,
			reason,
			pendingOnly: true,
			assertCurrent,
			agent
		});
	} catch (error) {
		sessionWorkAdmissionClosures.delete(owner);
		throw error;
	}
	return () => {
		sessionWorkAdmissionClosures.delete(owner);
	};
}
/** Fence ingress while awaiting cleanup that must run outside lifecycle/placement locks. */
function closeSessionWorkAdmissions(params) {
	return closeNormalizedSessionWorkAdmissions(normalizeSessionIdentities(params.scope, params.identities), params.reason, params.assertCurrent, params.agent);
}
function startNormalizedSessionWorkAdmissionInterruption(params) {
	const currentAdmissions = CURRENT_SESSION_WORK_ADMISSIONS.getStore();
	const admissions = collectSessionWorkAdmissions(params.identities, (admission) => (!params.pendingOnly || admission.phase === "pending") && !currentAdmissions?.has(admission) && (!params.agent || matchesAgentWorkAdmission(params.agent, admission.agent)));
	return interruptSessionWorkAdmissionOwners(admissions, params.reason, params.assertCurrent);
}
function startSessionWorkAdmissionInterruption(params) {
	return startNormalizedSessionWorkAdmissionInterruption({
		agent: params.agent,
		identities: normalizeSessionIdentities(params.scope, params.identities),
		reason: params.reason,
		assertCurrent: params.assertCurrent
	});
}
/** Cancel this Gateway's ingress, retaining acquired custody through physical settlement. */
function startGatewaySessionWorkAdmissionInterruption(resolveGatewayContext, reason) {
	const admissions = collectSessionWorkAdmissions(ACTIVE_SESSION_WORK_ADMISSIONS.keys(), (owner) => hasGatewayContextOwner(owner, resolveGatewayContext));
	const interruptions = Array.from(admissions, (owner) => {
		if (owner.interrupted || owner.isSettling?.()) return owner.released;
		try {
			return interruptSessionWorkAdmissionOwners(/* @__PURE__ */ new Set([owner]), reason).released;
		} catch (error) {
			return Promise.reject(error instanceof Error ? error : new Error(String(error)));
		}
	});
	return { released: Promise.allSettled([...interruptions, ...Array.from(admissions, (owner) => owner.released)]).then((results) => {
		const failed = results.find((result) => result.status === "rejected");
		if (failed?.status === "rejected") throw failed.reason;
	}) };
}
async function interruptSessionWorkAdmissions(params) {
	const { released } = startSessionWorkAdmissionInterruption(params);
	return waitForSessionWorkAdmissionRelease(released, params.timeoutMs);
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.sessionLifecycleAdmissionTestApi")] = { runExclusiveSessionLifecycle };
//#endregion
export { clearSessionStoreCacheForTest as A, startAgentWorkAdmissionInterruption as C, cancelSessionWorkAdmissionHandoff as D, waitForSessionWorkAdmissionRelease as E, consumeSessionWorkAdmissionHandoff as O, runExclusiveSessionLifecycleMutation as S, startSessionWorkAdmissionInterruption as T, interruptSessionWorkAdmissions as _, closeAgentWorkAdmissions as a, isSessionWorkAdmissionActive as b, collectActiveSessionLifecycleMutationIdentities as c, getActiveSessionWorkAdmissionCount as d, getCompetingSessionWorkAdmissionRelease as f, hasOnlySessionLifecycleMutationKindActive as g, getTerminalSessionWorkAdmissionRelease as h, captureSessionWorkRunInterruptions as i, runExclusiveSessionStoreWrite as k, collectActiveSessionWorkAdmissions as l, getSessionWorkAdmissionRelease as m, beginSessionWorkAdmission as n, closeSessionWorkAdmissions as o, getSessionWorkAdmissionOwnerRelease as p, captureGatewaySessionWorkAdmissions as r, collectActiveAgentSessionWorkAdmissions as s, SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS as t, getActiveSessionLifecycleMutationCount as u, isCompetingSessionWorkAdmissionActive as v, startGatewaySessionWorkAdmissionInterruption as w, observeSessionWorkAdmissionReleases as x, isSessionLifecycleMutationActive as y };
