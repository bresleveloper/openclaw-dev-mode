import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { u as resolveRuntimeFacadeModuleLocation } from "./facade-loader-CcsJkVh8.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { n as captureSessionStoreCandidateIdentities, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { a as normalizeStoreSessionKey, s as resolveSessionEntryCandidates, t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { c as withSessionEntriesFromStoresInWorker, l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { A as getSessionInitializationUpstreamLinkCurrent, z as bindNativeSessionDeletionParticipant } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { a as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { n as capturePluginStateNativeBindingStore } from "./plugin-state-store.native-binding-77crF_5Y.mjs";
import { s as validateKey } from "./plugin-state-store.validation-CbLRb9U1.mjs";
import { n as runWriteTransaction } from "./plugin-state-store.database-B2UsVeYf.mjs";
import { i as deletePluginStateNativeBinding, l as preparePluginStateNativeBindingCodec, s as restorePluginStateNativeBinding } from "./plugin-state-store.mutations-B1cPWhts.mjs";
import { s as capturePreparedToolAuthorityReads } from "./host-private-capabilities-eTr803c9.mjs";
import { n as captureSessionEntryCurrentRead, t as captureNativeSessionEntryCurrentRead } from "./session-entry-current-runtime-Dwzq8LTI.mjs";
import { t as assertLegacyPreparedToolAuthority } from "./tool-authority-preparation-m_5xD16r.mjs";
import { t as captureSessionEntryCurrentCheckAsyncInternal } from "./session-entry-current-check-Df7ye0eB.mjs";
import { t as capturePluginStateNativeBindingFacts } from "./plugin-state-native-binding-facts-DwbIweya.mjs";
import { i as upsertSessionUpstreamLink, n as deleteSessionUpstreamLinkAsync, o as upsertSessionUpstreamLinkWithCurrentSource } from "./session-upstream-links-B-mgRkEp.mjs";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/harness/native-session/binding-leases.ts
/** Legacy adapter for released native binding stores. */
function createNativeSessionBindingLeases(state, options) {
	if (!state.withCurrent) throw new Error(options.errors.atomicUpdatesRequired);
	const leases = createNativeSessionBindingLeasesV2({
		withCurrent: (authority) => state.withCurrent(authority),
		assertLeaseCurrent(key, token) {
			const raw = state.lookup(key);
			const current = options.readRecord(raw);
			if (raw !== void 0 && !current) throw options.errors.invalidRow(key);
			if (current?.lease?.token !== token || current.lease.expiresAt <= Date.now()) throw options.errors.lostLease(key);
		}
	}, options);
	return {
		...leases,
		captureLeaseAssertion(key) {
			const assertCurrent = leases.captureLeaseAssertion(key);
			assertCurrent();
			return assertCurrent;
		}
	};
}
/** Worker-owned mutations publish the facts used by synchronous native effect guards. */
function createNativeSessionBindingLeasesV2(state, options) {
	if (!state.withCurrent) throw new Error(options.errors.atomicUpdatesRequired);
	const context = new AsyncLocalStorage();
	const unresolved = /* @__PURE__ */ new Map();
	const assertSettled = (key) => {
		const blocked = unresolved.get(key);
		if (blocked) throw blocked.error;
	};
	const assertLeaseCurrent = (key, owner) => {
		if (!owner.facts) {
			if (!state.assertLeaseCurrent) throw new Error(options.errors.atomicUpdatesRequired);
			warnPluginSdkDeprecation({
				family: "native-session-binding",
				method: "NativeSessionBindingStateStoreV2.assertLeaseCurrent",
				replacement: "withCurrent backed by api.runtime.state.openKeyedStoreV2"
			});
			state.assertLeaseCurrent(key, owner.token);
			return;
		}
		const current = readRecord(key, owner.facts.read());
		if (current?.lease?.token !== owner.token || current.lease.expiresAt <= Date.now()) throw options.errors.lostLease(key);
	};
	const update = async (key, prepare, assertCurrent, authorities = []) => {
		const mutations = [];
		for (const authority of new Set(authorities)) mutations.push(await authority.prepareMutation());
		const restrictions = mutations.flatMap(({ sessionEntryCurrent }) => sessionEntryCurrent ? [sessionEntryCurrent] : []);
		const sessionEntryCurrent = restrictions.length ? {
			sources: restrictions.flatMap(({ sources }) => sources),
			assertCurrent: (entries) => {
				let offset = 0;
				for (const restriction of restrictions) {
					restriction.assertCurrent(entries.slice(offset, offset + restriction.sources.length));
					offset += restriction.sources.length;
				}
			}
		} : void 0;
		const store = state.withCurrent({
			sessionEntryCurrent,
			assertCurrent: () => {
				assertCurrent?.();
				for (const mutation of mutations) mutation.assertCurrent();
			}
		});
		let observed = await store.observe(key);
		while (true) {
			const prepared = prepare(observed.value);
			const outcome = await store.compareAndApply(key, observed.comparison, prepared.next === void 0 ? {
				operation: "update",
				action: "keep"
			} : {
				operation: "update",
				action: "set",
				value: prepared.next,
				...prepared.ttlMs === void 0 ? {} : { ttlMs: prepared.ttlMs }
			});
			if (outcome.status !== "conflict") return prepared.next !== void 0;
			observed = outcome.current;
		}
	};
	const transact = async (key, apply, ttlMs, assertCurrent, authority) => {
		const deadline = performance.now() + options.lease.waitMs;
		while (true) {
			assertSettled(key);
			let busy = false;
			let leaseLost = false;
			let result;
			const owner = context.getStore()?.get(key);
			if (owner && owner.phase !== "held") throw options.errors.lostLease(key);
			if (owner?.failure) throw owner.failure;
			const ownedToken = owner?.token;
			const assertOwnerCurrent = () => {
				assertCurrent?.();
				owner?.assertCurrent?.();
				assertSettled(key);
				if (owner && (owner.phase !== "held" || owner.failure)) throw owner.failure ?? options.errors.lostLease(key);
			};
			assertOwnerCurrent();
			await update(key, (raw) => {
				busy = false;
				leaseLost = false;
				const current = readRecord(key, raw);
				const lease = current?.lease;
				const now = Date.now();
				if (ownedToken && (!lease || lease.token !== ownedToken || lease.expiresAt <= now)) {
					leaseLost = true;
					return {};
				}
				if (lease && lease.token !== ownedToken && lease.expiresAt > now) {
					busy = true;
					return {};
				}
				const applied = apply(current, ownedToken);
				result = applied.result;
				return {
					next: applied.next,
					ttlMs: typeof ttlMs === "function" ? applied.next && ttlMs(applied.next) : ttlMs
				};
			}, assertOwnerCurrent, [authority, owner?.authority].filter((value) => value !== void 0));
			if (leaseLost) {
				const failure = options.errors.lostLease(key);
				if (owner) owner.failure = failure;
				throw failure;
			}
			if (!busy) return result;
			if (performance.now() >= deadline) throw options.errors.leaseTimeout(key);
			await sleep(options.lease.retryIntervalMs);
		}
	};
	const withLease = async (key, run, acquisition) => {
		assertSettled(key);
		acquisition.assertCurrent?.();
		const owned = context.getStore();
		const existing = owned?.get(key);
		if (existing) {
			if (existing.phase !== "held") throw options.errors.lostLease(key);
			const failureBeforeRun = existing.failure;
			if (failureBeforeRun) throw failureBeforeRun;
			const result = await run();
			acquisition.assertCurrent?.();
			const failureAfterRun = existing.failure;
			if (failureAfterRun) throw failureAfterRun;
			return result;
		}
		const token = randomUUID();
		const owner = {
			token,
			phase: "held",
			assertCurrent: acquisition.assertCurrent,
			authority: acquisition.authority,
			renewalPending: () => renewal !== void 0,
			joinRenewal: async () => {
				await renewal;
			},
			quiesce() {
				if (renewal || owner.phase !== "held" || owner.failure) throw owner.failure ?? options.errors.lostLease(key);
				owner.phase = "settling";
			},
			block(error, custody) {
				owner.phase = "unknown";
				owner.failure = error;
				unresolved.set(key, {
					error,
					custody
				});
			}
		};
		let renewal;
		let heartbeat;
		try {
			const acquired = await transact(key, (current) => {
				const next = acquisition.prepareLease(current, {
					token,
					expiresAt: Date.now() + options.lease.staleMs
				});
				return {
					result: next !== void 0,
					next
				};
			}, void 0, acquisition.assertCurrent, acquisition.authority);
			acquisition.assertCurrent?.();
			if (!acquired) throw options.errors.acquisitionRejected(key);
			const bindingStore = capturePluginStateNativeBindingStore(state.withCurrent({ assertCurrent() {} }));
			if (bindingStore) owner.facts = await capturePluginStateNativeBindingFacts(bindingStore, key);
			assertLeaseCurrent(key, owner);
			const nested = new Map(owned);
			nested.set(key, owner);
			heartbeat = setInterval(() => {
				if (!renewal && owner.phase === "held") renewal = renew(key, owner).finally(() => {
					renewal = void 0;
				});
			}, options.lease.renewIntervalMs);
			heartbeat.unref();
			const result = await context.run(nested, run);
			clearInterval(heartbeat);
			await renewal;
			acquisition.assertCurrent?.();
			if (owner.failure) throw owner.failure;
			return result;
		} finally {
			clearInterval(heartbeat);
			const unknown = owner.phase === "unknown";
			if (!unknown) owner.phase = "closed";
			try {
				await renewal;
				if (!unknown) try {
					await update(key, (raw) => {
						const stored = readRecord(key, raw);
						if (stored?.lease?.token !== token) return {};
						const { lease: _lease, ...released } = stored;
						return {
							next: readRecord(key, released),
							ttlMs: options.releaseTtlMs(key, stored)
						};
					});
				} catch (error) {
					options.onReleaseFailure?.(key, error);
				}
			} finally {
				owner.facts?.release();
			}
		}
	};
	const readRecord = (key, raw) => {
		const current = options.readRecord(raw);
		if (raw !== void 0 && !current) throw options.errors.invalidRow(key);
		return current;
	};
	const renew = async (key, owner) => {
		if (owner.failure || owner.phase !== "held") return;
		try {
			if (!await update(key, (raw) => {
				const current = readRecord(key, raw);
				const lease = current?.lease;
				const now = Date.now();
				if (!current || !lease || lease.token !== owner.token || lease.expiresAt <= now) return {};
				return { next: {
					...current,
					lease: {
						token: owner.token,
						expiresAt: now + options.lease.staleMs
					}
				} };
			}, () => {
				owner.assertCurrent?.();
				if (owner.phase !== "held" || owner.failure) throw owner.failure ?? options.errors.lostLease(key);
			}, owner.authority ? [owner.authority] : []) && owner.phase === "held") owner.failure = options.errors.lostLease(key);
		} catch (error) {
			if (owner.phase === "held") owner.failure = options.errors.lostLease(key, error);
		}
	};
	const captureLeaseAssertion = (key) => {
		const owner = context.getStore()?.get(key);
		if (!owner || owner.phase !== "held") throw options.errors.lostLease(key);
		const assertCurrent = () => {
			if (owner.phase !== "held") throw options.errors.lostLease(key);
			try {
				assertLeaseCurrent(key, owner);
			} catch (error) {
				throw owner.failure ?? error;
			}
		};
		return assertCurrent;
	};
	return {
		captureLeaseAssertion,
		transact,
		withLease,
		hasLease: (key) => context.getStore()?.has(key) === true,
		owner: (key) => context.getStore()?.get(key),
		assertSettled,
		block(key, error, custody) {
			unresolved.set(key, {
				error,
				custody
			});
		}
	};
}
//#endregion
//#region src/agents/harness/native-session/binding-native-settlement.ts
/** Initialization, incognito, and mixed released participants still need native atomicity. */
function createNativeSessionBindingNativeSettlement(params) {
	let removed;
	let prepared = false;
	const assertPrepared = () => {
		params.assertCurrent();
		if (!prepared) throw new Error("Native binding settlement was not selected before the transaction");
	};
	return {
		async prepare() {
			params.assertCurrent();
			await preparePluginStateNativeBindingCodec(params.plan, params.env);
			params.assertCurrent();
			prepared = true;
		},
		commit() {
			assertPrepared();
			if (removed) return;
			const outcome = runWriteTransaction("delete", (database) => {
				assertPrepared();
				const result = deletePluginStateNativeBinding(database, params.plan);
				if (result.status === "conflict") throw new Error(params.plan.deletionChanged);
				assertPrepared();
				return result;
			}, { env: params.env });
			removed = outcome.status === "deleted" ? outcome.value : void 0;
			params.settle("committed");
		},
		rollback() {
			assertPrepared();
			if (!removed) return;
			const value = removed;
			runWriteTransaction("register", (database) => {
				assertPrepared();
				if (!restorePluginStateNativeBinding(database, params.plan, value)) throw new Error(params.plan.rollbackChanged);
				assertPrepared();
			}, { env: params.env });
			removed = void 0;
			params.settle("rolled-back");
		}
	};
}
//#endregion
//#region src/agents/harness/native-session/binding-lifecycle.ts
/**
* @deprecated Use createNativeSessionBindingLifecycleV2. Supported through 2026-12-31.
*/
function createNativeSessionBindingLifecycle(state, options) {
	warnPluginSdkDeprecation({
		family: "native-session-binding",
		method: "createNativeSessionBindingLifecycle",
		replacement: "createNativeSessionBindingLifecycleV2",
		compatibility: "The legacy adapter retains synchronous transaction-local mutation and settlement."
	});
	return createNativeSessionBindingLifecycleOwner({
		version: 1,
		state
	}, options);
}
/** Worker-owned binding coordination with an audited native deletion participant. */
function createNativeSessionBindingLifecycleV2(state, options) {
	return createNativeSessionBindingLifecycleOwner({
		version: 2,
		state
	}, options);
}
function createNativeSessionBindingLifecycleOwner(source, options) {
	const { state } = source;
	const leases = source.version === 1 ? createNativeSessionBindingLeases(source.state, options) : createNativeSessionBindingLeasesV2(source.state, options);
	const exclusiveContext = new AsyncLocalStorage();
	let activeMutations = 0;
	let pendingExclusiveOperations = 0;
	let exclusiveTail = Promise.resolve();
	let mutationsDrained;
	const waitForMutations = async () => {
		if (activeMutations === 0) return;
		await new Promise((resolve) => {
			mutationsDrained = resolve;
		});
	};
	const withMutation = async (run) => {
		if (exclusiveContext.getStore() === true) return await run();
		if (pendingExclusiveOperations > 0) throw new Error(options.errors.mutationBlocked);
		activeMutations += 1;
		try {
			return await run();
		} finally {
			activeMutations -= 1;
			if (activeMutations === 0) {
				const drained = mutationsDrained;
				mutationsDrained = void 0;
				drained?.();
			}
		}
	};
	const withExclusiveMutationFence = async (run) => {
		pendingExclusiveOperations += 1;
		const operation = exclusiveTail.then(async () => {
			await waitForMutations();
			return await exclusiveContext.run(true, run);
		});
		exclusiveTail = operation.then(() => void 0, () => void 0);
		try {
			return await operation;
		} finally {
			pendingExclusiveOperations -= 1;
		}
	};
	const withDeletion = async (key, deletion, run) => {
		leases.assertSettled(key);
		const store = options.workerCodec ? capturePluginStateNativeBindingStore(state.withCurrent({ assertCurrent: deletion.assertCurrent })) : void 0;
		const workerCodec = (options.workerCodec === "codex" || options.workerCodec === "agentsapi") && store?.options.pluginId === options.workerCodec ? options.workerCodec : void 0;
		const workerSource = workerCodec && store ? captureOpenClawStateWorkerContext({ env: store.options.env }) : void 0;
		const codecOwner = workerCodec ? resolveRuntimeFacadeModuleLocation({
			dirName: workerCodec,
			artifactBasename: "native-session-binding-api.js"
		}) : void 0;
		if (codecOwner === null) throw new Error(`Native session binding codec is unavailable: ${workerCodec}`);
		const bindParticipant = (mutation, value, owner) => {
			if (!store || !workerSource || !workerCodec || !workerSource.admission.identity.key.startsWith("file:")) return mutation;
			const custody = /* @__PURE__ */ new Set();
			const participant = {
				binding: {
					codec: workerCodec,
					codecSource: codecOwner ? {
						rootDir: codecOwner.boundaryRoot,
						source: codecOwner.modulePath,
						origin: codecOwner.origin ?? "global"
					} : void 0,
					pluginId: store.options.pluginId,
					namespace: store.options.namespace,
					key: validateKey(key, "delete"),
					maxEntries: store.options.maxEntries,
					overflowPolicy: store.options.overflowPolicy,
					ttlMs: store.options.defaultTtlMs,
					staleMs: options.lease.staleMs,
					deletionChanged: options.errors.deletionChanged,
					rollbackChanged: options.errors.rollbackChanged,
					predicate: owner ? {
						kind: "leased",
						token: owner.token,
						value
					} : { kind: "absent" }
				},
				source: workerSource.admission.identity,
				assertCurrent() {
					workerSource.admission.assertCurrent();
					workerSource.maintenanceScope?.assertAdmission();
					store.assertCurrent?.();
					deletion.assertCurrent();
					if (owner?.failure || owner?.phase === "closed") throw owner.failure ?? options.errors.lostLease(key);
				},
				renewalPending: () => owner?.renewalPending() ?? false,
				joinRenewal: async () => {
					await owner?.joinRenewal();
				},
				quiesce: () => owner?.quiesce(),
				retain: (custodian) => {
					custody.add(custodian);
				},
				unknown: false,
				settle(outcome, error) {
					if (outcome === "unknown") {
						participant.unknown = true;
						const failure = error ?? /* @__PURE__ */ new Error("Native binding settlement is unknown");
						if (owner) owner.block(failure, participant);
						else leases.block(key, failure, participant);
					} else if (owner) owner.phase = outcome === "committed" ? "deleted" : "held";
				}
			};
			if (source.version === 2) participant.nativeMutation = createNativeSessionBindingNativeSettlement({
				plan: participant.binding,
				env: store.options.env,
				assertCurrent: () => participant.assertCurrent(),
				settle: (outcome) => participant.settle(outcome)
			});
			return bindNativeSessionDeletionParticipant(mutation, participant);
		};
		if (source.version === 2 && (!store || !workerSource || !workerSource.admission.identity.key.startsWith("file:"))) throw new Error("Native session binding deletion requires a worker-owned plugin-state store");
		const legacyState = source.version === 1 ? source.state : void 0;
		const deleteIf = legacyState?.deleteIf?.bind(legacyState);
		if (legacyState && !deleteIf) throw new Error(options.errors.conditionalDeletionRequired);
		const workerMutation = {
			commit() {
				throw new Error("Native session binding deletion must commit through its worker participant");
			},
			rollback() {
				throw new Error("Native session binding deletion must roll back through its worker participant");
			}
		};
		return await withMutation(async () => {
			deletion.assertCurrent();
			const initial = await state.lookup(key);
			deletion.assertCurrent();
			if (initial === void 0) {
				if (!legacyState) return await run(void 0, bindParticipant(workerMutation));
				let active = true;
				try {
					return await run(void 0, bindParticipant({
						commit() {
							deletion.assertCurrent();
							if (!active || legacyState.lookup(key) !== void 0) throw new Error(options.errors.deletionChanged);
						},
						rollback() {}
					}));
				} finally {
					active = false;
				}
			}
			return await leases.withLease(key, async () => {
				const owner = leases.owner(key);
				const stored = options.readRecord(await state.lookup(key));
				deletion.assertCurrent();
				deletion.assertRecordCurrent(stored);
				if (!stored) throw new Error(options.errors.deletionChanged);
				const { lease: _lease, ...expectedValue } = stored;
				if (!legacyState) return await run(stored, bindParticipant(workerMutation, expectedValue, owner));
				let deleted;
				let active = true;
				const assertActive = () => {
					deletion.assertCurrent();
					if (!active || owner.phase === "closed" || owner.failure) throw owner.failure ?? options.errors.lostLease(key);
				};
				try {
					return await run(stored, bindParticipant({
						commit() {
							assertActive();
							if (deleted) return;
							let removed;
							if (!deleteIf(key, (raw) => {
								const { lease, ...value } = options.readRecord(raw) ?? {};
								if (lease?.token !== owner.token || lease.expiresAt <= Date.now() || !isDeepStrictEqual(value, expectedValue)) return false;
								removed = raw;
								return true;
							}) || !removed) throw new Error(options.errors.deletionChanged);
							deleted = removed;
							owner.phase = "deleted";
						},
						rollback() {
							assertActive();
							if (!deleted) return;
							const restored = {
								...deleted,
								lease: {
									token: owner.token,
									expiresAt: Date.now() + options.lease.staleMs
								}
							};
							if (!legacyState.registerIfAbsent(key, restored)) throw new Error(options.errors.rollbackChanged);
							deleted = void 0;
							owner.phase = "held";
						}
					}, expectedValue, owner));
				} finally {
					active = false;
				}
			}, deletion);
		});
	};
	return {
		captureLeaseAssertion: leases.captureLeaseAssertion.bind(leases),
		transact: leases.transact,
		withLease: leases.withLease,
		hasLease: leases.hasLease,
		withMutation,
		withExclusiveMutationFence,
		withDeletion
	};
}
//#endregion
//#region src/agents/harness/native-session/binding-generation.ts
/** @deprecated Use resolvePreparedNativeSessionBinding. Supported through 2026-12-31. */
async function resolveNativeSessionBinding(params) {
	warnPluginSdkDeprecation({
		family: "native-session-binding",
		method: "resolveNativeSessionBinding",
		replacement: "resolvePreparedNativeSessionBinding"
	});
	let assertCurrent = params.assertCurrent ?? (() => {});
	const assertAdmissionCurrent = () => {
		assertCurrent();
		params.signal?.throwIfAborted();
	};
	assertAdmissionCurrent();
	params.assertBinding?.(readOwnershipBinding(params));
	const authority = params.target?.sessionKey?.trim() ? captureNativeSessionGenerationAuthority({
		...params,
		target: params.target,
		assertCurrent
	}) : void 0;
	assertCurrent = authority?.assertCurrent ?? assertCurrent;
	assertAdmissionCurrent();
	let binding = params.readBinding();
	if (!binding && authority && params.target && params.generation) {
		if (!await reclaimPreparedGeneration$1({
			...params,
			generation: params.generation,
			reclaimStale: params.reclaimStale === true
		}, authority, assertAdmissionCurrent) && params.reclaimStale) throw params.createSupersededError(params.target.sessionId);
		binding = params.readBinding();
	}
	assertAdmissionCurrent();
	params.assertBinding?.(binding);
	return {
		binding,
		assertCurrent
	};
}
/** @deprecated Use reclaimNativeSessionGenerationWithAuthority. Supported through 2026-12-31. */
async function reclaimNativeSessionGeneration(params) {
	warnPluginSdkDeprecation({
		family: "native-session-binding",
		method: "reclaimNativeSessionGeneration",
		replacement: "reclaimNativeSessionGenerationWithAuthority"
	});
	params.assertCurrent?.();
	if (!params.target.sessionKey?.trim()) return true;
	const authority = captureNativeSessionGenerationAuthority(params);
	if (authority.state === "superseded") return false;
	return reclaimPreparedGeneration$1(params, authority);
}
/** @deprecated Await retainNativeSessionGenerationAuthority. Supported through 2026-12-31. */
function captureNativeSessionGenerationAuthority(params) {
	warnPluginSdkDeprecation({
		family: "native-session-binding",
		method: "captureNativeSessionGenerationAuthority",
		replacement: "await retainNativeSessionGenerationAuthority()"
	});
	const readEntry = () => {
		try {
			return readBindingSessionEntry(params);
		} catch {
			return null;
		}
	};
	const entry = readEntry();
	const current = entry?.sessionId === params.target.sessionId;
	const state = entry === void 0 ? "ephemeral" : current ? "current" : "superseded";
	const previousSessionId = current ? entry.previousSessionId : void 0;
	const assertHostCurrent = () => {
		if (state === "ephemeral") return;
		const latest = readEntry();
		if (state !== "current" || !latest || latest.sessionId !== params.target.sessionId || latest.previousSessionId !== previousSessionId) throw params.createSupersededError(params.target.sessionId);
	};
	return {
		state,
		previousSessionId,
		assertHostCurrent,
		assertCurrent() {
			params.assertCurrent?.();
			assertHostCurrent();
		}
	};
}
async function reclaimPreparedGeneration$1(params, authority, assertCurrent = authority.assertCurrent) {
	const plan = await params.generation.prepareReclaim();
	assertCurrent();
	if (plan.kind === "resolved") return plan.result;
	if (authority.state !== "current") return false;
	params.onHostGenerationVerified?.(authority.assertHostCurrent);
	if (authority.previousSessionId === plan.expectedPreviousSessionId) {
		const adopted = await params.generation.adopt(authority.previousSessionId, assertCurrent);
		if (adopted !== "absent") return adopted !== "conflict";
	}
	if (params.reclaimStale === false) return false;
	return params.generation.reclaim(plan.expectedPreviousSessionId, assertCurrent);
}
function readOwnershipBinding(params) {
	const binding = params.readBinding();
	if (binding || !params.target) return binding;
	const entry = readBindingSessionEntry({
		...params,
		target: params.target
	});
	return entry?.sessionId === params.target.sessionId && entry.previousSessionId ? params.readBinding(entry.previousSessionId) : void 0;
}
function readBindingSessionEntry(params) {
	const { target } = params;
	return target.sessionKey?.trim() ? loadSessionEntryReadOnly({
		agentId: target.agentId,
		sessionKey: target.sessionKey.trim(),
		storePath: params.storePath?.trim() || resolveSessionStorePathCore(params.config?.session?.store, { agentId: target.agentId }),
		hydrateSkillPromptRefs: false,
		readConsistency: "latest"
	}) : void 0;
}
//#endregion
//#region src/agents/harness/native-session/binding-authority.ts
/** Bind live owner checks without acquiring any session lineage or storage. */
function createNativeSessionBindingScope(assertCurrent) {
	return createPreparedNativeSessionBindingAuthority({
		lineage: [],
		source: composeSessionSourceAssertion([]),
		entryChecks: [],
		assertCurrent
	});
}
/** Prepared lineage stays current through the session entry owner's write publications. */
function createPreparedNativeSessionBindingAuthority(params) {
	const { lineage, source, entryChecks, assertCurrent } = params;
	const assertLegacyCurrent = composeSessionSourceAssertion([source], (assertSource) => {
		assertCurrent();
		assertSource();
	});
	return {
		lineage,
		prepared: {
			source,
			entryChecks
		},
		assertCurrent: assertLegacyCurrent,
		assertLegacyCurrent,
		withLiveness: (next) => createPreparedNativeSessionBindingAuthority({
			...params,
			assertCurrent: next
		}),
		async withCurrent(consume) {
			assertLegacyCurrent();
			return consume();
		},
		async withPreparedCurrent(consume, preparations) {
			assertCurrent();
			const policies = [];
			for (const preparation of preparations) try {
				policies.push({
					preparation,
					...await capturePreparedToolAuthorityReads(preparation)
				});
			} catch (error) {
				if (preparation.onRefused?.(error) !== "discarded") throw error;
			}
			if (policies.some((policy) => policy.assertCompatibility)) return withSessionEntriesFromStoresInWorker([], () => {
				const survivors = [];
				for (const policy of policies) try {
					policy.preparation.assertCurrent();
					survivors.push(policy);
				} catch (error) {
					if (policy.preparation.onRefused?.(error) !== "discarded") throw error;
				}
				for (const policy of survivors) assertLegacyPreparedToolAuthority(policy.preparation, policy.reads);
				for (const policy of survivors) policy.preparation.assertCurrent();
				assertLegacyCurrent();
				return consume();
			});
			return readNativeSessionBindingEntries([], () => {
				assertLegacyCurrent();
				return consume();
			}, policies);
		},
		async prepareMutation() {
			assertLegacyCurrent();
			return {
				assertCurrent: assertLegacyCurrent,
				sessionEntryCurrent: entryChecks.length ? {
					sources: entryChecks.map((check) => check.source),
					assertCurrent: (entries) => {
						assertCurrent();
						entryChecks.forEach((check, index) => check.assertCurrent(entries[index]));
					}
				} : void 0
			};
		}
	};
}
function readNativeSessionBindingEntries(reads, consume, policies = []) {
	const sameRead = (left, right) => left.agentId === right.agentId && left.sessionKey === right.sessionKey && left.storePath === right.storePath && left.env === right.env;
	const unique = reads.filter((read, index) => reads.findIndex((candidate) => sameRead(candidate, read)) === index);
	const native = new Map(unique.filter((read) => isIncognitoSessionKey(read.sessionKey)).map((read) => [read, captureNativeSessionEntryCurrentRead(read)]));
	const durable = unique.filter((read) => !native.has(read));
	const inputs = durable.map((read) => ({
		...read,
		snapshotFields: [],
		sessionKeys: [.../* @__PURE__ */ new Set([normalizeStoreSessionKey(read.sessionKey), ...collectSessionEntryLookupKeys(read.sessionKey)])]
	}));
	return withSessionEntriesFromStoresInWorker([...inputs, ...policies.flatMap(({ reads: policyReads }) => policyReads.flatMap((read) => read.reads))], (prepared) => {
		const entries = unique.map((read) => {
			const index = durable.indexOf(read);
			return index < 0 ? readNativeBindingLineage(native.get(read)) : resolveSessionEntryCandidates({
				entries: prepared[index].result.entries,
				sessionKey: read.sessionKey,
				canonicalKeys: true
			}).existing?.entry;
		});
		for (const read of prepared) read.assertCurrent();
		let offset = durable.length;
		const finalPolicyChecks = [];
		for (const { preparation, reads: policyReads } of policies) {
			const start = offset;
			offset += policyReads.reduce((count, read) => count + read.reads.length, 0);
			const assertPolicyCurrent = () => {
				let currentOffset = start;
				preparation.assertCurrent();
				for (const read of policyReads) {
					read.assertPrepared(prepared.slice(currentOffset, currentOffset + read.reads.length));
					currentOffset += read.reads.length;
				}
				preparation.assertCurrent();
			};
			try {
				if (policyReads.length) assertPolicyCurrent();
				else preparation.assertCurrent();
				finalPolicyChecks.push(assertPolicyCurrent);
			} catch (error) {
				if (preparation.onRefused?.(error) !== "discarded") throw error;
			}
		}
		for (const assertPolicyCurrent of finalPolicyChecks) assertPolicyCurrent();
		for (const read of prepared) read.assertCurrent();
		return consume(reads.map((read) => entries[unique.findIndex((candidate) => sameRead(candidate, read))]));
	}, { ordered: true });
}
/** @deprecated Retain prepared lineage or use createNativeSessionBindingScope. */
function createNativeSessionBindingAuthority(lineage, assertCurrent) {
	const assertEntry = (expected, entry) => {
		if (!entry || entry.sessionId !== expected.sessionId || entry.previousSessionId !== expected.previousSessionId) throw expected.createSupersededError(expected.sessionId);
	};
	const assertLegacyCurrent = () => {
		assertCurrent();
		for (const expected of lineage) {
			let entry;
			try {
				entry = isIncognitoSessionKey(expected.read.sessionKey) ? readNativeBindingLineage(captureNativeSessionEntryCurrentRead(expected.read)) : loadSessionEntryReadOnly({
					...expected.read,
					readConsistency: "latest",
					hydrateSkillPromptRefs: false
				});
			} catch {
				throw expected.createSupersededError(expected.sessionId);
			}
			assertEntry(expected, entry);
		}
	};
	const authority = {
		lineage,
		assertCurrent,
		withCurrent: async (consume) => {
			assertCurrent();
			return readNativeSessionBindingEntries(lineage.map(({ read }) => read), (entries) => {
				assertCurrent();
				lineage.forEach((expected, index) => assertEntry(expected, entries[index]));
				return consume();
			});
		},
		withPreparedCurrent: async (consume, preparations) => {
			assertCurrent();
			const sources = lineage.map(({ read }) => {
				if (isIncognitoSessionKey(read.sessionKey)) return captureNativeSessionEntryCurrentRead(read).assertSourceCurrent;
				const candidates = captureSessionStoreReadCandidates(read.storePath);
				const identities = captureSessionStoreCandidateIdentities(candidates);
				return () => {
					for (const candidate of candidates) assertSessionStoreReadCandidate(candidate.path, candidates);
					for (const [path, expected] of identities) {
						const current = readDatabasePathIdentitySync(path);
						if (current.key !== expected.key || current.canonicalPath !== expected.canonicalPath || current.birthtime !== expected.birthtime) throw new Error("Native session lineage source changed during tool preparation");
					}
				};
			});
			const policies = [];
			for (const preparation of preparations) {
				assertCurrent();
				try {
					policies.push({
						preparation,
						...await capturePreparedToolAuthorityReads(preparation)
					});
				} catch (error) {
					if (preparation.onRefused?.(error) !== "discarded") throw error;
				}
			}
			for (const check of sources) check();
			if (policies.some((policy) => policy.assertCompatibility)) return withSessionEntriesFromStoresInWorker([], () => {
				const survivors = [];
				for (const policy of policies) try {
					policy.preparation.assertCurrent();
					survivors.push(policy);
				} catch (error) {
					if (policy.preparation.onRefused?.(error) !== "discarded") throw error;
				}
				for (const policy of survivors) assertLegacyPreparedToolAuthority(policy.preparation, policy.reads);
				for (const policy of survivors) policy.preparation.assertCurrent();
				for (const check of sources) check();
				assertLegacyCurrent();
				return consume();
			});
			return readNativeSessionBindingEntries(lineage.map(({ read }) => read), (entries) => {
				assertCurrent();
				for (const check of sources) check();
				lineage.forEach((expected, index) => assertEntry(expected, entries[index]));
				return consume();
			}, policies);
		},
		prepareMutation: async () => {
			assertCurrent();
			const checks = [];
			const sourceChecks = [];
			const nativeChecks = [];
			const native = new Map(lineage.filter(({ read }) => isIncognitoSessionKey(read.sessionKey)).map((expected) => [expected, captureNativeSessionEntryCurrentRead(expected.read)]));
			for (const expected of lineage) {
				const nativeRead = native.get(expected);
				if (nativeRead) {
					const check = () => assertEntry(expected, readNativeBindingLineage(nativeRead));
					check();
					nativeChecks.push(check);
					continue;
				}
				await withSessionEntryReadOnlyInWorker(expected.read, assertCurrent, async (read, owner) => {
					if (!read.ok) throw expected.createSupersededError(expected.sessionId);
					assertEntry(expected, read.value);
					const captured = captureSessionEntryCurrentRead(expected.read, owner);
					if (captured.kind !== "file") {
						nativeChecks.push(() => assertEntry(expected, captured.readCurrent()));
						return;
					}
					checks.push({
						source: captured.source,
						assertCurrent: (facts) => {
							captured.assertSourceCurrent();
							assertEntry(expected, facts);
						}
					});
					sourceChecks.push({
						predicate: {
							source: captured.source,
							sessionKey: captured.source.sessionKey,
							fields: ["sessionId", "previousSessionId"],
							expected: {
								sessionId: expected.sessionId,
								previousSessionId: expected.previousSessionId
							}
						},
						refuse: () => {
							throw expected.createSupersededError(expected.sessionId);
						}
					});
				});
			}
			const assertMutationCurrent = () => {
				assertCurrent();
				for (const check of nativeChecks) check();
			};
			assertMutationCurrent();
			return {
				assertCurrent: assertMutationCurrent,
				sessionEntryCurrent: checks.length ? {
					sources: checks.map((check) => check.source),
					assertCurrent: (entries) => {
						checks.forEach((check, index) => check.assertCurrent(entries[index]));
					}
				} : void 0,
				sessionSource: {
					assertCurrent: assertMutationCurrent,
					assertPreparedCurrent: assertCurrent,
					checks: sourceChecks,
					nativeSource: nativeChecks.length > 0
				}
			};
		},
		assertLegacyCurrent
	};
	Object.assign(authority.assertLegacyCurrent, {
		nativeSource: lineage.some(({ read }) => isIncognitoSessionKey(read.sessionKey)),
		prepareSessionSource: async () => (await authority.prepareMutation()).sessionSource
	});
	return authority;
}
function readNativeBindingLineage(captured) {
	const entry = captured.readCurrent();
	if (!entry) return;
	const previousSessionId = entry.previousSessionId;
	if (previousSessionId !== void 0 && typeof previousSessionId !== "string") throw new Error("Native session lineage has an invalid predecessor");
	return {
		sessionId: entry.sessionId,
		previousSessionId
	};
}
/** Combine borrowed owner facts without acquiring another lineage read. */
function combinePreparedNativeSessionBindingAuthority(...authorities) {
	const present = [...new Set(authorities.filter((authority) => authority !== void 0))];
	if (present.length === 1) return present[0];
	return createPreparedNativeSessionBindingAuthority({
		lineage: present.flatMap(({ lineage }) => lineage),
		source: composeSessionSourceAssertion(present.map(({ prepared }) => prepared.source)),
		entryChecks: present.flatMap(({ prepared }) => prepared.entryChecks),
		assertCurrent: () => {
			for (const authority of present) authority.assertCurrent();
		}
	});
}
/** @deprecated Use combinePreparedNativeSessionBindingAuthority. */
function combineNativeSessionBindingAuthority(...authorities) {
	const present = [...new Set(authorities.filter((authority) => authority !== void 0))];
	return createNativeSessionBindingAuthority(present.flatMap(({ lineage }) => lineage), () => {
		for (const authority of present) authority.assertCurrent();
	});
}
//#endregion
//#region src/agents/harness/native-session/binding-generation-authority.ts
/**
* @deprecated Use resolvePreparedNativeSessionBinding and release its capture. Supported through 2026-12-31.
*/
async function resolveNativeSessionBindingWithAuthority(params) {
	warnPluginSdkDeprecation({
		family: "native-session-binding",
		method: "resolveNativeSessionBindingWithAuthority",
		replacement: "resolvePreparedNativeSessionBinding",
		compatibility: "The legacy binding callback retains its synchronous authority frame."
	});
	return resolveNativeSessionBindingOwner(params, (authority, previousSessionId) => authority.withCurrent(() => {
		const current = params.readBinding();
		params.assertBinding?.(current ?? (previousSessionId ? params.readBinding(previousSessionId) : void 0));
		return current;
	}));
}
/** The caller releases its captured lineage after the binding's final use and cleanup. */
async function resolvePreparedNativeSessionBinding(params) {
	const assertAdmissionCurrent = () => {
		params.assertCurrent?.();
		params.signal?.throwIfAborted();
	};
	let captured = params.generationAuthority;
	let active = true;
	const release = () => {
		active = false;
		captured?.release();
	};
	try {
		assertAdmissionCurrent();
		captured ??= params.target?.sessionKey?.trim() ? await retainNativeSessionGenerationAuthority({
			...params,
			target: params.target,
			assertCurrent: assertAdmissionCurrent
		}) : void 0;
		const authority = combinePreparedNativeSessionBindingAuthority(params.authority, captured?.authority, createPreparedNativeSessionBindingAuthority({
			lineage: [],
			source: composeSessionSourceAssertion([], () => {
				if (!active) throw new Error("Native session binding scope was released");
			}),
			entryChecks: [],
			assertCurrent: assertAdmissionCurrent
		}));
		const readBinding = async (previousSessionId) => {
			authority.assertCurrent();
			const current = await params.readBinding();
			const ownership = current ?? (previousSessionId ? await params.readBinding(previousSessionId) : void 0);
			return authority.withCurrent(() => {
				params.assertBinding?.(ownership);
				return current;
			});
		};
		let binding = await readBinding(captured?.previousSessionId);
		if (!binding && captured && params.target && params.generation) {
			if (!await reclaimPreparedGeneration({
				...params,
				generation: params.generation,
				reclaimStale: params.reclaimStale === true
			}, {
				...captured,
				authority
			}, assertAdmissionCurrent) && params.reclaimStale) throw params.createSupersededError(params.target.sessionId);
			binding = await readBinding();
		} else if (!binding) params.assertBinding?.(binding);
		return {
			binding,
			authority,
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
async function resolveNativeSessionBindingOwner(params, readBinding) {
	const assertAdmissionCurrent = () => {
		params.assertCurrent?.();
		params.signal?.throwIfAborted();
	};
	assertAdmissionCurrent();
	const captured = params.target?.sessionKey?.trim() ? await prepareNativeSessionGenerationAuthority({
		...params,
		target: params.target,
		assertCurrent: assertAdmissionCurrent
	}) : void 0;
	const authority = combineNativeSessionBindingAuthority(params.authority, captured?.authority ?? createNativeSessionBindingAuthority([], assertAdmissionCurrent));
	let binding = await readBinding(authority, captured?.previousSessionId);
	if (!binding && captured && params.target && params.generation) {
		if (!await reclaimPreparedGeneration({
			...params,
			generation: params.generation,
			reclaimStale: params.reclaimStale === true
		}, {
			...captured,
			authority
		}, assertAdmissionCurrent) && params.reclaimStale) throw params.createSupersededError(params.target.sessionId);
		binding = await readBinding(authority);
	} else if (!binding) params.assertBinding?.(binding);
	return {
		binding,
		authority
	};
}
/** Let the authoritative OpenClaw generation adopt its predecessor or reclaim a stale row. */
async function reclaimNativeSessionGenerationWithAuthority(params) {
	params.assertCurrent?.();
	if (!params.target.sessionKey?.trim()) return true;
	const authority = await retainNativeSessionGenerationAuthority(params);
	try {
		if (authority.state === "superseded") return false;
		return await reclaimPreparedGeneration(params, authority);
	} finally {
		authority.release();
	}
}
/** Select lineage once; the session owner publishes every in-process change until release. */
async function retainNativeSessionGenerationAuthority(params) {
	params.assertCurrent?.();
	const read = {
		agentId: params.target.agentId,
		sessionKey: params.target.sessionKey?.trim() ?? "",
		storePath: params.storePath?.trim() || resolveSessionStorePathCore(params.config?.session?.store, { agentId: params.target.agentId })
	};
	let captured;
	try {
		if (read.sessionKey) captured = await captureSessionEntryCurrentCheckAsyncInternal({
			...read,
			matchGeneration: false,
			fields: ["sessionId", "previousSessionId"]
		});
		params.assertCurrent?.();
	} catch (error) {
		captured?.release();
		params.assertCurrent?.();
		throw error;
	}
	const entry = captured?.entry;
	const current = entry?.sessionId === params.target.sessionId;
	const state = entry === void 0 ? "ephemeral" : current ? "current" : "superseded";
	const previousSessionId = current ? entry?.previousSessionId : void 0;
	if (state !== "current") {
		captured?.release();
		captured = void 0;
	}
	let active = true;
	const refuse = () => {
		throw params.createSupersededError(params.target.sessionId);
	};
	const source = composeSessionSourceAssertion([captured?.source], (assertSource) => {
		if (!active || state === "superseded") refuse();
		try {
			assertSource();
		} catch {
			refuse();
		}
	});
	const entryCurrent = captured?.entryCurrent;
	return {
		state,
		previousSessionId,
		authority: createPreparedNativeSessionBindingAuthority({
			lineage: current ? [{
				read,
				sessionId: params.target.sessionId,
				previousSessionId,
				createSupersededError: params.createSupersededError
			}] : [],
			source,
			entryChecks: entryCurrent ? [{
				source: entryCurrent.source,
				assertCurrent: (facts) => {
					if (!active) refuse();
					try {
						entryCurrent.assertCurrent(facts);
					} catch {
						refuse();
					}
				}
			}] : [],
			assertCurrent: () => {
				params.assertCurrent?.();
				if (state === "superseded") refuse();
			}
		}),
		release() {
			if (active) {
				active = false;
				captured?.release();
			}
		}
	};
}
/** @deprecated Use retainNativeSessionGenerationAuthority and release its capture. */
async function prepareNativeSessionGenerationAuthority(params) {
	const read = {
		agentId: params.target.agentId,
		sessionKey: params.target.sessionKey?.trim() ?? "",
		storePath: params.storePath?.trim() || resolveSessionStorePathCore(params.config?.session?.store, { agentId: params.target.agentId })
	};
	const entry = await (async () => {
		try {
			return read.sessionKey ? await readNativeSessionBindingEntries([read], ([candidate]) => {
				params.assertCurrent?.();
				return candidate;
			}) : void 0;
		} catch {
			params.assertCurrent?.();
			return null;
		}
	})();
	const current = entry?.sessionId === params.target.sessionId;
	const state = entry === void 0 ? "ephemeral" : current ? "current" : "superseded";
	const previousSessionId = current ? entry?.previousSessionId : void 0;
	return {
		state,
		previousSessionId,
		authority: createNativeSessionBindingAuthority(state === "current" ? [{
			read,
			sessionId: params.target.sessionId,
			previousSessionId,
			createSupersededError: params.createSupersededError
		}] : [], () => {
			params.assertCurrent?.();
			if (state === "superseded") throw params.createSupersededError(params.target.sessionId);
		})
	};
}
async function reclaimPreparedGeneration(params, authority, assertCurrent = authority.authority.assertCurrent) {
	const plan = await params.generation.prepareReclaim();
	await authority.authority.withCurrent(assertCurrent);
	if (plan.kind === "resolved") return plan.result;
	if (authority.state !== "current") return false;
	if (authority.previousSessionId === plan.expectedPreviousSessionId) {
		const adopted = await params.generation.adopt(authority.previousSessionId, authority.authority);
		if (adopted !== "absent") return adopted !== "conflict";
	}
	if (params.reclaimStale === false) return false;
	return params.generation.reclaim(plan.expectedPreviousSessionId, authority.authority);
}
//#endregion
//#region src/agents/harness/native-session/initialization.ts
/** Backend binding ownership redeems the existing host initializer's exact creation handle. */
function createNativeSessionInitializationOwner(options) {
	const initializations = /* @__PURE__ */ new WeakMap();
	return {
		/** Capture cleanup ownership before any potentially committing binding or link write. */
		prepare(params) {
			const { initialization, bindingStore, identity } = params;
			initialization.assertCurrent();
			const sourceCurrent = getSessionInitializationUpstreamLinkCurrent(initialization);
			const context = sourceCurrent?.context ?? captureOpenClawStateWorkerContext();
			const database = {
				path: context.admission.databasePath,
				env: context.environment
			};
			const assertCurrent = () => {
				context.admission.assertCurrent();
				initialization.assertCurrent();
			};
			const assertRollbackCurrent = () => {
				context.admission.assertCurrent();
				initialization.assertRollbackCurrent();
			};
			let link;
			const ownership = {
				store: bindingStore,
				identity: structuredClone(identity),
				assertCleanupAllowed: params.assertCleanupAllowed,
				cleanup: async () => {
					initialization.assertRollbackCurrent();
					if (link && await deleteSessionUpstreamLinkAsync(link.sessionKey, link.agentId, {
						...database,
						expected: link,
						assertCommitAllowed: assertRollbackCurrent
					}) === "changed") throw new Error(options.errors.linkChanged);
					initialization.assertRollbackCurrent();
					await cleanup?.(initialization.assertRollbackCurrent);
					initialization.assertRollbackCurrent();
				}
			};
			initializations.set(initialization, ownership);
			const cleanup = params.prepareCleanup?.();
			const prepareLink = (input) => {
				const now = Date.now();
				link = structuredClone({
					...input,
					createdAt: now,
					updatedAt: now
				});
				return {
					...database,
					now,
					ifAbsent: true,
					assertCommitAllowed: assertCurrent
				};
			};
			const acceptLink = (stored) => {
				if (!stored) {
					link = void 0;
					throw new Error(options.errors.linkWriteFailed);
				}
			};
			return {
				assertCurrent: initialization.assertCurrent,
				async bind(binding) {
					initialization.assertCurrent();
					ownership.binding = options.validateBinding(binding);
					if (!await options.writeBinding(bindingStore, identity, ownership.binding, initialization.assertCurrent)) {
						ownership.binding = void 0;
						throw new Error(options.errors.bindingChanged);
					}
					initialization.assertCurrent();
				},
				/** @deprecated Await linkAsync. Supported through 2026-12-31. */
				link(input) {
					initialization.assertCurrent();
					const prepared = prepareLink(input);
					acceptLink(upsertSessionUpstreamLink(input, prepared));
					initialization.assertCurrent();
				},
				async linkAsync(input) {
					assertCurrent();
					const prepared = prepareLink(input);
					acceptLink(await upsertSessionUpstreamLinkWithCurrentSource(input, prepared, sourceCurrent));
					assertCurrent();
				}
			};
		},
		getRollback(store, params, identity, binding) {
			const handle = params.initialization;
			if (!handle) return;
			handle.assertRollbackCurrent();
			const ownership = initializations.get(handle);
			if (!ownership && !binding) return;
			if (!ownership || ownership.store !== store || !isDeepStrictEqual(ownership.identity, identity) || binding && !isDeepStrictEqual(ownership.binding, binding)) throw new Error(options.errors.ownerChanged);
			ownership.assertCleanupAllowed?.();
			return ownership.cleanup;
		}
	};
}
//#endregion
export { resolvePreparedNativeSessionBinding as a, combinePreparedNativeSessionBindingAuthority as c, createPreparedNativeSessionBindingAuthority as d, captureNativeSessionGenerationAuthority as f, createNativeSessionBindingLifecycleV2 as g, createNativeSessionBindingLifecycle as h, resolveNativeSessionBindingWithAuthority as i, createNativeSessionBindingAuthority as l, resolveNativeSessionBinding as m, prepareNativeSessionGenerationAuthority as n, retainNativeSessionGenerationAuthority as o, reclaimNativeSessionGeneration as p, reclaimNativeSessionGenerationWithAuthority as r, combineNativeSessionBindingAuthority as s, createNativeSessionInitializationOwner as t, createNativeSessionBindingScope as u };
