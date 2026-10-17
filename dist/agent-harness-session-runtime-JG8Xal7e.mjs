import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { u as resolveRuntimeFacadeModuleLocation } from "./facade-loader-B-X-HqBc.mjs";
import { s as validateKey } from "./plugin-state-store.validation-BnCg_tof.mjs";
import { n as capturePluginStateNativeBindingStore } from "./plugin-state-store.native-binding-B1gxV4gQ.mjs";
import { a as normalizeStoreSessionKey, s as resolveSessionEntryCandidates, t as collectSessionEntryLookupKeys } from "./store-entry-Bb_svqyv.mjs";
import { N as bindNativeSessionDeletionParticipant } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { l as withSessionEntriesFromStoresInWorker, u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { i as upsertSessionUpstreamLink, t as deleteSessionUpstreamLink } from "./session-upstream-links-BUvTYp9x.mjs";
import { n as captureSessionEntryCurrentRead, t as captureNativeSessionEntryCurrentRead } from "./session-entry-current-runtime-B4GNjdPn.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/agents/harness/native-session/binding-authority.ts
function readNativeSessionBindingEntries(reads, consume) {
	const sameRead = (left, right) => left.agentId === right.agentId && left.sessionKey === right.sessionKey && left.storePath === right.storePath && left.env === right.env;
	const unique = reads.filter((read, index) => reads.findIndex((candidate) => sameRead(candidate, read)) === index);
	const native = new Map(unique.filter((read) => isIncognitoSessionKey(read.sessionKey)).map((read) => [read, captureNativeSessionEntryCurrentRead(read)]));
	const durable = unique.filter((read) => !native.has(read));
	return withSessionEntriesFromStoresInWorker(durable.map((read) => ({
		...read,
		sessionKeys: [.../* @__PURE__ */ new Set([normalizeStoreSessionKey(read.sessionKey), ...collectSessionEntryLookupKeys(read.sessionKey)])]
	})), (prepared) => {
		const entries = unique.map((read) => {
			const index = durable.indexOf(read);
			return index < 0 ? readNativeBindingLineage(native.get(read)) : resolveSessionEntryCandidates({
				entries: prepared[index].result.entries,
				sessionKey: read.sessionKey,
				canonicalKeys: true
			}).existing?.entry;
		});
		for (const read of prepared) read.assertCurrent();
		return consume(reads.map((read) => entries[unique.findIndex((candidate) => sameRead(candidate, read))]));
	}, { ordered: true });
}
function createNativeSessionBindingAuthority(lineage, assertCurrent) {
	const assertEntry = (expected, entry) => {
		if (!entry || entry.sessionId !== expected.sessionId || entry.previousSessionId !== expected.previousSessionId) throw expected.createSupersededError(expected.sessionId);
	};
	return {
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
		prepareMutation: async () => {
			assertCurrent();
			const checks = [];
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
				} : void 0
			};
		},
		assertLegacyCurrent: () => {
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
		}
	};
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
/** Batch every owner into one retained read rather than nesting writer admissions. */
function combineNativeSessionBindingAuthority(...authorities) {
	const present = [...new Set(authorities.filter((authority) => authority !== void 0))];
	if (present.length === 1) return present[0];
	return createNativeSessionBindingAuthority(present.flatMap(({ lineage }) => lineage), () => {
		for (const authority of present) authority.assertCurrent();
	});
}
//#endregion
//#region src/agents/harness/native-session/binding-leases.ts
/** Serializes native binding changes across processes without owning backend policy. */
function createNativeSessionBindingLeases(state, options) {
	if (!state.withCurrent) throw new Error(options.errors.atomicUpdatesRequired);
	const context = new AsyncLocalStorage();
	const unresolved = /* @__PURE__ */ new Map();
	const assertSettled = (key) => {
		const blocked = unresolved.get(key);
		if (blocked) throw blocked.error;
	};
	const update = async (key, prepare, assertCurrent, authority) => {
		let assertPreparedCurrent;
		const mutationAuthority = await authority?.prepareMutation();
		const store = state.withCurrent({
			sessionEntryCurrent: mutationAuthority?.sessionEntryCurrent,
			assertCurrent: () => {
				assertCurrent?.();
				mutationAuthority?.assertCurrent();
				assertPreparedCurrent?.();
			}
		});
		let observed = await store.observe(key);
		while (true) {
			const prepared = prepare(observed.value);
			assertPreparedCurrent = prepared.assertCurrent;
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
			assertPreparedCurrent = void 0;
			observed = outcome.current;
		}
	};
	const transact = async (key, apply, ttlMs, assertCurrent, authority) => {
		const deadline = Date.now() + options.lease.waitMs;
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
				const nextLease = applied.next?.lease;
				result = applied.result;
				return {
					next: applied.next,
					ttlMs: typeof ttlMs === "function" ? applied.next && ttlMs(applied.next) : ttlMs,
					assertCurrent: () => {
						if (ownedToken && lease.expiresAt <= Date.now() || nextLease && (nextLease.token !== lease?.token || nextLease.expiresAt !== lease?.expiresAt) && nextLease.expiresAt <= Date.now()) {
							const failure = options.errors.lostLease(key);
							if (owner) owner.failure = failure;
							throw failure;
						}
					}
				};
			}, assertOwnerCurrent, authority || owner?.authority ? combineNativeSessionBindingAuthority(authority, owner?.authority) : void 0);
			if (leaseLost) {
				const failure = options.errors.lostLease(key);
				if (owner) owner.failure = failure;
				throw failure;
			}
			if (!busy) return result;
			if (Date.now() >= deadline) throw options.errors.leaseTimeout(key);
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
				return {
					next: {
						...current,
						lease: {
							token: owner.token,
							expiresAt: now + options.lease.staleMs
						}
					},
					assertCurrent: () => {
						if (lease.expiresAt <= Date.now()) throw options.errors.lostLease(key);
					}
				};
			}, () => {
				owner.assertCurrent?.();
				if (owner.phase !== "held" || owner.failure) throw owner.failure ?? options.errors.lostLease(key);
			}, owner.authority) && owner.phase === "held") owner.failure = options.errors.lostLease(key);
		} catch (error) {
			if (owner.phase === "held") owner.failure = options.errors.lostLease(key, error);
		}
	};
	const captureLeaseAssertion = (key) => {
		const owner = context.getStore()?.get(key);
		const assertCurrent = () => {
			if (!owner || owner.phase !== "held") throw options.errors.lostLease(key);
			const lease = readRecord(key, state.lookup(key))?.lease;
			if (!lease || lease.token !== owner.token || lease.expiresAt <= Date.now()) throw options.errors.lostLease(key);
		};
		assertCurrent();
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
//#region src/agents/harness/native-session/binding-lifecycle.ts
/** Shared binding coordination; backend callbacks retain native ownership and retention policy. */
function createNativeSessionBindingLifecycle(state, options) {
	const leases = createNativeSessionBindingLeases(state, options);
	const exclusiveContext = new AsyncLocalStorage();
	let activeMutations = 0;
	let pendingExclusiveOperations = 0;
	let exclusiveTail = Promise.resolve();
	let mutationsDrained = [];
	const waitForMutations = async () => {
		if (activeMutations === 0) return;
		await new Promise((resolve) => {
			mutationsDrained.push(resolve);
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
				mutationsDrained = [];
				for (const resolve of drained) resolve();
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
		const source = workerCodec && store ? captureOpenClawStateWorkerContext({ env: store.options.env }) : void 0;
		const codecOwner = workerCodec ? resolveRuntimeFacadeModuleLocation({
			dirName: workerCodec,
			artifactBasename: "native-session-binding-api.js"
		}) : void 0;
		if (codecOwner === null) throw new Error(`Native session binding codec is unavailable: ${workerCodec}`);
		const bindParticipant = (mutation, value, owner) => {
			if (!store || !source || !workerCodec || !source.admission.identity.key.startsWith("file:")) return mutation;
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
				source: source.admission.identity,
				assertCurrent() {
					source.admission.assertCurrent();
					source.maintenanceScope?.assertAdmission();
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
			return bindNativeSessionDeletionParticipant(mutation, participant);
		};
		const deleteIf = state.deleteIf?.bind(state);
		if (!deleteIf) throw new Error(options.errors.conditionalDeletionRequired);
		return await withMutation(async () => {
			deletion.assertCurrent();
			if (state.lookup(key) === void 0) {
				let active = true;
				try {
					return await run(void 0, bindParticipant({
						commit() {
							deletion.assertCurrent();
							if (!active || state.lookup(key) !== void 0) throw new Error(options.errors.deletionChanged);
						},
						rollback() {}
					}));
				} finally {
					active = false;
				}
			}
			return await leases.withLease(key, async () => {
				const owner = leases.owner(key);
				const stored = options.readRecord(state.lookup(key));
				deletion.assertRecordCurrent(stored);
				if (!stored) throw new Error(options.errors.deletionChanged);
				const { lease: _lease, ...expectedValue } = stored;
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
							if (!state.registerIfAbsent(key, restored)) throw new Error(options.errors.rollbackChanged);
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
		captureLeaseAssertion: leases.captureLeaseAssertion,
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
/** @deprecated Use resolveNativeSessionBindingWithAuthority; retained for released harness plugins. */
async function resolveNativeSessionBinding(params) {
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
/** @deprecated Use reclaimNativeSessionGenerationWithAuthority; retained for released harness plugins. */
async function reclaimNativeSessionGeneration(params) {
	params.assertCurrent?.();
	if (!params.target.sessionKey?.trim()) return true;
	const authority = captureNativeSessionGenerationAuthority(params);
	if (authority.state === "superseded") return false;
	return reclaimPreparedGeneration$1(params, authority);
}
/** @deprecated Await prepareNativeSessionGenerationAuthority; the released capture contract stays synchronous. */
function captureNativeSessionGenerationAuthority(params) {
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
//#region src/agents/harness/native-session/binding-generation-authority.ts
/** Resolve host lineage before selecting a native queue, catalog, or connection. */
async function resolveNativeSessionBindingWithAuthority(params) {
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
	let binding = await authority.withCurrent(() => {
		const current = params.readBinding();
		params.assertBinding?.(current ?? (captured?.previousSessionId ? params.readBinding(captured.previousSessionId) : void 0));
		return current;
	});
	if (!binding && captured && params.target && params.generation) {
		if (!await reclaimPreparedGeneration({
			...params,
			generation: params.generation,
			reclaimStale: params.reclaimStale === true
		}, {
			...captured,
			authority
		}, assertAdmissionCurrent) && params.reclaimStale) throw params.createSupersededError(params.target.sessionId);
		binding = await authority.withCurrent(() => {
			const current = params.readBinding();
			params.assertBinding?.(current);
			return current;
		});
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
	const authority = await prepareNativeSessionGenerationAuthority(params);
	if (authority.state === "superseded") return false;
	return reclaimPreparedGeneration(params, authority);
}
/** Capture the host generation and predecessor together, then revalidate both after waits. */
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
			let link;
			const ownership = {
				store: bindingStore,
				identity: structuredClone(identity),
				assertCleanupAllowed: params.assertCleanupAllowed,
				cleanup: async () => {
					initialization.assertRollbackCurrent();
					if (link && deleteSessionUpstreamLink(link.sessionKey, link.agentId, {
						expected: link,
						assertCommitAllowed: initialization.assertRollbackCurrent
					}) === "changed") throw new Error(options.errors.linkChanged);
					initialization.assertRollbackCurrent();
					await cleanup?.(initialization.assertRollbackCurrent);
					initialization.assertRollbackCurrent();
				}
			};
			initializations.set(initialization, ownership);
			const cleanup = params.prepareCleanup?.();
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
				link(input) {
					initialization.assertCurrent();
					const now = Date.now();
					link = structuredClone({
						...input,
						createdAt: now,
						updatedAt: now
					});
					if (!upsertSessionUpstreamLink(input, {
						now,
						ifAbsent: true,
						assertCommitAllowed: initialization.assertCurrent
					})) {
						link = void 0;
						throw new Error(options.errors.linkWriteFailed);
					}
					initialization.assertCurrent();
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
export { captureNativeSessionGenerationAuthority as a, createNativeSessionBindingLifecycle as c, resolveNativeSessionBindingWithAuthority as i, combineNativeSessionBindingAuthority as l, prepareNativeSessionGenerationAuthority as n, reclaimNativeSessionGeneration as o, reclaimNativeSessionGenerationWithAuthority as r, resolveNativeSessionBinding as s, createNativeSessionInitializationOwner as t, createNativeSessionBindingAuthority as u };
