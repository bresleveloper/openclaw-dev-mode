import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { n as runQueuedStoreWrite } from "./store-writer-queue-DPKo3FoW.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/sessions/session-lifecycle-admission.ts
const SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS = 15e3;
const { lifecycleQueues: SESSION_LIFECYCLE_QUEUES, mutationQueues: SESSION_LIFECYCLE_MUTATION_QUEUES, activeAdmissions: ACTIVE_SESSION_WORK_ADMISSIONS, activeMutations: ACTIVE_SESSION_LIFECYCLE_MUTATIONS, activeMutationKinds: ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS, idleWaiters: SESSION_LIFECYCLE_IDLE_WAITERS, currentAdmissions: CURRENT_SESSION_WORK_ADMISSIONS } = resolveGlobalSingleton(Symbol.for("openclaw.sessionLifecycleAdmissionState"), () => ({
	lifecycleQueues: /* @__PURE__ */ new Map(),
	mutationQueues: /* @__PURE__ */ new Map(),
	activeAdmissions: /* @__PURE__ */ new Map(),
	activeMutations: /* @__PURE__ */ new Map(),
	activeMutationKinds: /* @__PURE__ */ new Map(),
	idleWaiters: /* @__PURE__ */ new Map(),
	currentAdmissions: new AsyncLocalStorage()
}));
function normalizeSessionIdentities(scope, identities) {
	const normalizedScope = scope.trim();
	if (!normalizedScope) throw new Error("session lifecycle scope is required");
	return Array.from(new Set(Array.from(identities, (identity) => identity?.trim()).filter((identity) => Boolean(identity)))).map((identity) => JSON.stringify([normalizedScope, identity])).toSorted();
}
async function runWithSessionIdentityLocks(identities, index, run) {
	const identity = identities[index];
	if (!identity) return await run();
	return await runQueuedStoreWrite({
		queues: SESSION_LIFECYCLE_QUEUES,
		storePath: identity,
		label: "runExclusiveSessionLifecycle",
		reentrant: true,
		fn: async () => await runWithSessionIdentityLocks(identities, index + 1, run)
	});
}
async function runWithSessionMutationIdentityLocks(identities, index, run) {
	const identity = identities[index];
	if (!identity) return await run();
	return await runQueuedStoreWrite({
		queues: SESSION_LIFECYCLE_MUTATION_QUEUES,
		storePath: identity,
		label: "runExclusiveSessionLifecycleMutation",
		reentrant: true,
		fn: async () => await runWithSessionMutationIdentityLocks(identities, index + 1, run)
	});
}
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
		const attempt = await runWithSessionIdentityLocks(identities, 0, async () => {
			params.signal?.throwIfAborted();
			if (hasActiveSessionLifecycleMutation(identities)) return { blocked: true };
			return {
				blocked: false,
				value: await params.run()
			};
		});
		if (!attempt.blocked) return attempt.value;
		await waitForNormalizedSessionLifecycleMutationIdle(identities, params.signal);
	}
}
async function runExclusiveSessionLifecycleMutation(params) {
	const identities = normalizeSessionIdentities(params.scope, params.identities);
	const signal = params.signal;
	signal?.throwIfAborted();
	const callerAdmissions = new Set(CURRENT_SESSION_WORK_ADMISSIONS.getStore());
	let mutationActivated = false;
	let removeAbortListener = () => {};
	const mutation = runWithSessionMutationIdentityLocks(identities, 0, async () => await CURRENT_SESSION_WORK_ADMISSIONS.run(callerAdmissions, async () => {
		await runWithSessionIdentityLocks(identities, 0, async () => {
			signal?.throwIfAborted();
			mutationActivated = true;
			removeAbortListener();
			for (const identity of identities) {
				ACTIVE_SESSION_LIFECYCLE_MUTATIONS.set(identity, (ACTIVE_SESSION_LIFECYCLE_MUTATIONS.get(identity) ?? 0) + 1);
				if (params.kind) {
					const kinds = ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS.get(identity) ?? /* @__PURE__ */ new Map();
					kinds.set(params.kind, (kinds.get(params.kind) ?? 0) + 1);
					ACTIVE_SESSION_LIFECYCLE_MUTATION_KINDS.set(identity, kinds);
				}
			}
		});
		try {
			await params.prepare?.();
			return await runWithSessionIdentityLocks(identities, 0, params.run);
		} finally {
			await runWithSessionIdentityLocks(identities, 0, async () => {
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
			});
		}
	}));
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
	return normalizeSessionIdentities(scope, identities).some((identity) => (ACTIVE_SESSION_WORK_ADMISSIONS.get(identity)?.size ?? 0) > 0);
}
async function beginSessionWorkAdmission(params) {
	const identities = normalizeSessionIdentities(params.scope, params.identities);
	return await runExclusiveSessionLifecycle({
		scope: params.scope,
		identities: params.identities,
		signal: params.signal,
		run: async () => {
			await params.assertAllowed();
			let resolveReleased = () => {};
			const admission = {
				interrupt: params.onInterrupt,
				released: new Promise((resolve) => {
					resolveReleased = resolve;
				})
			};
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
				resolveReleased();
			};
			return {
				release,
				run: async (run) => {
					const current = new Set(CURRENT_SESSION_WORK_ADMISSIONS.getStore());
					current.add(admission);
					return await CURRENT_SESSION_WORK_ADMISSIONS.run(current, run);
				}
			};
		}
	});
}
async function interruptSessionWorkAdmissions(params) {
	const admissions = /* @__PURE__ */ new Set();
	const currentAdmissions = CURRENT_SESSION_WORK_ADMISSIONS.getStore();
	for (const identity of normalizeSessionIdentities(params.scope, params.identities)) for (const admission of ACTIVE_SESSION_WORK_ADMISSIONS.get(identity) ?? []) {
		if (currentAdmissions?.has(admission)) continue;
		admissions.add(admission);
	}
	for (const admission of admissions) admission.interrupt?.();
	const released = Promise.all(Array.from(admissions, (admission) => admission.released));
	if (params.timeoutMs === void 0) {
		await released;
		return true;
	}
	const timeoutMs = params.timeoutMs;
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
export { isSessionLifecycleMutationActive as a, interruptSessionWorkAdmissions as i, beginSessionWorkAdmission as n, isSessionWorkAdmissionActive as o, hasOnlySessionLifecycleMutationKindActive as r, runExclusiveSessionLifecycleMutation as s, SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS as t };
