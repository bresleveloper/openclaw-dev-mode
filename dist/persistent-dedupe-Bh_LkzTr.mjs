import { M as resolveNonNegativeIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { t as createDedupeCache } from "./dedupe-wpcRBJWZ.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { f as wrapPluginStateError } from "./plugin-state-worker-errors-DPQ69K6p.mjs";
import { r as createPluginStateKeyedStore, t as createCorePluginStateKeyedStore } from "./plugin-state-store-CgyXRuSI.mjs";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/plugin-sdk/channel-replay-guard.ts
function normalizeReplayKeys(value) {
	return [...new Set((Array.isArray(value) ? value : [value]).map((key) => key?.trim()).filter((key) => Boolean(key)))];
}
async function settleReplayWrites(pending) {
	try {
		return (await Promise.all(pending)).some(Boolean);
	} catch (error) {
		await Promise.allSettled(pending);
		throw error;
	}
}
function createChannelReplayGuardWithDedupe(params, dedupe) {
	const claimOwners = /* @__PURE__ */ new Map();
	const resolveKeys = (event) => normalizeReplayKeys(params.buildReplayKey(event));
	const resolveOwnerKey = (key, options) => `${options?.namespace?.trim() || "global"}\0${key}`;
	const resolveOptions = (event, options) => {
		if (options?.namespace !== void 0) return options;
		const namespace = params.namespace?.(event);
		return namespace === void 0 ? options : {
			...options,
			namespace
		};
	};
	const releaseKeys = (keys, options) => {
		for (const key of keys) dedupe.release(key, options);
	};
	const commitKeys = async (keys, options) => {
		return settleReplayWrites(keys.map((key) => dedupe.commit(key, options)));
	};
	const createClaimHandle = (keys, claimId, dedupeOptions) => {
		const ownedKeys = Object.freeze([...keys]);
		let settlement = { kind: "claimed" };
		return {
			keys: ownedKeys,
			commit: (options) => {
				if (settlement.kind === "committing") return settlement.pending;
				if (settlement.kind === "released") return Promise.resolve(false);
				const settlingKeys = ownedKeys.filter((key) => {
					const owner = claimOwners.get(resolveOwnerKey(key, dedupeOptions));
					if (owner?.claimId !== claimId || owner.state !== "claimed") return false;
					owner.state = "committing";
					return true;
				});
				if (settlingKeys.length === 0) {
					settlement = { kind: "released" };
					return Promise.resolve(false);
				}
				const pending = commitKeys(settlingKeys, options ? {
					...dedupeOptions,
					...options,
					namespace: dedupeOptions?.namespace
				} : dedupeOptions).finally(() => {
					for (const key of settlingKeys) {
						const ownerKey = resolveOwnerKey(key, dedupeOptions);
						if (claimOwners.get(ownerKey)?.claimId === claimId) claimOwners.delete(ownerKey);
					}
				});
				settlement = {
					kind: "committing",
					pending
				};
				return pending;
			},
			release: (options) => {
				if (settlement.kind !== "claimed") return;
				settlement = { kind: "released" };
				const releasingKeys = ownedKeys.filter((key) => claimOwners.get(resolveOwnerKey(key, dedupeOptions))?.claimId === claimId);
				releaseKeys(releasingKeys, {
					namespace: dedupeOptions?.namespace,
					error: options?.error
				});
				for (const key of releasingKeys) {
					const ownerKey = resolveOwnerKey(key, dedupeOptions);
					if (claimOwners.get(ownerKey)?.claimId === claimId) claimOwners.delete(ownerKey);
				}
			}
		};
	};
	const claim = async (event, options) => {
		const keys = resolveKeys(event);
		if (keys.length === 0) return { kind: "invalid" };
		const dedupeOptions = resolveOptions(event, options);
		const claimId = Symbol("channel-replay-claim");
		const claimedKeys = [];
		const pending = [];
		try {
			for (const key of keys) {
				const result = await dedupe.claim(key, dedupeOptions);
				if (result.kind === "claimed") {
					claimedKeys.push(key);
					claimOwners.set(resolveOwnerKey(key, dedupeOptions), {
						claimId,
						state: "claimed"
					});
				} else if (result.kind === "inflight") pending.push(result.pending);
			}
		} catch (error) {
			releaseKeys(claimedKeys, {
				namespace: dedupeOptions?.namespace,
				error
			});
			for (const key of claimedKeys) {
				const ownerKey = resolveOwnerKey(key, dedupeOptions);
				if (claimOwners.get(ownerKey)?.claimId === claimId) claimOwners.delete(ownerKey);
			}
			throw error;
		}
		if (claimedKeys.length > 0) return {
			kind: "claimed",
			handle: createClaimHandle(claimedKeys, claimId, dedupeOptions)
		};
		if (pending.length > 0) {
			const aggregate = Promise.all(pending).then((results) => results.some(Boolean));
			aggregate.catch(() => {});
			return {
				kind: "inflight",
				pending: aggregate
			};
		}
		return { kind: "duplicate" };
	};
	return {
		claim,
		shouldProcess: async (event, options) => {
			const result = await claim(event, options);
			if (result.kind === "invalid") return true;
			if (result.kind !== "claimed") return false;
			return await result.handle.commit();
		},
		processGuarded: async (event, process, options) => {
			const dedupeOptions = resolveOptions(event, options?.dedupe);
			const result = await claim(event, dedupeOptions);
			if (result.kind === "duplicate" || result.kind === "inflight") return result;
			if (result.kind === "invalid") return {
				kind: "processed",
				value: await process()
			};
			let value;
			try {
				value = await process();
			} catch (error) {
				if ((typeof options?.onError === "function" ? options.onError(error) : options?.onError ?? "release") === "commit") await result.handle.commit();
				else result.handle.release({ error });
				throw error;
			}
			await result.handle.commit();
			return {
				kind: "processed",
				value
			};
		},
		hasRecent: async (event, options) => {
			const keys = resolveKeys(event);
			if (keys.length === 0) return false;
			const dedupeOptions = resolveOptions(event, options);
			return (await Promise.all(keys.map((key) => dedupe.hasRecent(key, dedupeOptions)))).some(Boolean);
		},
		forget: async (event, options) => {
			const dedupeOptions = resolveOptions(event, options);
			const keys = resolveKeys(event).filter((key) => !claimOwners.has(resolveOwnerKey(key, dedupeOptions)));
			if (keys.length === 0) return false;
			return settleReplayWrites(keys.map((key) => dedupe.forget(key, dedupeOptions)));
		},
		warmup: dedupe.warmup,
		clearMemory: dedupe.clearMemory
	};
}
//#endregion
//#region src/plugin-sdk/persistent-dedupe-store.ts
const LEGACY_PATH_OWNER_ID = "core:persistent-dedupe";
const DEFAULT_NAMESPACE_PREFIX = "persistent-dedupe";
function resolveNamespace(namespace) {
	return namespace?.trim() || "global";
}
function resolveScopedKey(namespace, key) {
	return `${namespace}:${key}`;
}
function shortHash(value) {
	return createHash("sha256").update(value).digest("hex").slice(0, 32);
}
function resolveEntryKey(key) {
	return `k.${shortHash(key)}`;
}
function createPersistentDedupeImportEntry(params) {
	return {
		key: resolveEntryKey(params.key),
		value: {
			key: params.key,
			seenAt: params.seenAt
		},
		...params.ttlMs != null ? { ttlMs: params.ttlMs } : {}
	};
}
function normalizeNamespacePrefix(value) {
	return (value ?? DEFAULT_NAMESPACE_PREFIX).trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^[._-]+|[._-]+$/g, "").slice(0, 48) || DEFAULT_NAMESPACE_PREFIX;
}
function resolveStateNamespace(prefix, namespace) {
	return `${prefix}.${shortHash(namespace)}`;
}
function resolvePersistentDedupePluginStateNamespace(options) {
	return resolveStateNamespace(normalizeNamespacePrefix(options.namespacePrefix), resolveNamespace(options.namespace));
}
function hasPluginStateOptions(options) {
	return typeof options.pluginId === "string";
}
function resolveStateMaxEntries(options) {
	const maxEntries = hasPluginStateOptions(options) ? options.stateMaxEntries : options.fileMaxEntries;
	return Math.max(1, resolveNonNegativeIntegerOption(maxEntries, 1));
}
function createPersistentStoreResolver(options) {
	const maxEntries = resolveStateMaxEntries(options);
	const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
	const defaultTtlMs = ttlMs > 0 ? ttlMs : void 0;
	const pluginId = hasPluginStateOptions(options) ? options.pluginId : void 0;
	const prefix = normalizeNamespacePrefix(hasPluginStateOptions(options) ? options.namespacePrefix : "legacy-path");
	return (namespace) => {
		let databasePath;
		try {
			databasePath = resolveOpenClawStateSqlitePath(options.env ?? process.env);
			const context = captureOpenClawStateWorkerContext({
				path: databasePath,
				env: options.env
			});
			const storeOptions = {
				namespace: hasPluginStateOptions(options) ? resolveStateNamespace(prefix, namespace) : resolveStateNamespace(prefix, options.resolveFilePath(namespace)),
				maxEntries,
				...defaultTtlMs != null ? { defaultTtlMs } : {},
				env: context.environment
			};
			let store;
			return {
				namespace: storeOptions.namespace,
				get: () => {
					context.admission.assertCurrent();
					return store ??= pluginId !== void 0 ? createPluginStateKeyedStore(pluginId, storeOptions) : createCorePluginStateKeyedStore({
						...storeOptions,
						ownerId: LEGACY_PATH_OWNER_ID
					});
				}
			};
		} catch (error) {
			const failure = wrapPluginStateError(error, "lookup", "PLUGIN_STATE_OPEN_FAILED", "Failed to open the plugin state database.", databasePath);
			return {
				namespace,
				get: () => {
					throw failure;
				}
			};
		}
	};
}
//#endregion
//#region src/plugin-sdk/persistent-dedupe.ts
function isRecentTimestamp(seenAt, ttlMs, now) {
	return seenAt != null && (ttlMs <= 0 || now - seenAt < ttlMs);
}
function resolveEntrySeenAt(entry) {
	return typeof entry?.seenAt === "number" && Number.isFinite(entry.seenAt) ? entry.seenAt : void 0;
}
function resolveUnknownEntrySeenAt(value) {
	if (!value || typeof value !== "object" || !("seenAt" in value)) return;
	return typeof value.seenAt === "number" && Number.isFinite(value.seenAt) ? value.seenAt : void 0;
}
function resolveRemainingTtlMs(seenAt, ttlMs, now) {
	if (ttlMs <= 0) return;
	const remaining = ttlMs - (now - seenAt);
	return remaining > 0 ? { ttlMs: Math.max(1, Math.floor(remaining)) } : null;
}
function hasLegacyPathOptions(options) {
	return typeof options.resolveFilePath === "function";
}
function parseLegacyDedupeData(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return {
			data: {},
			invalidCount: 0
		};
	}
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {
		data: {},
		invalidCount: 0
	};
	const data = {};
	let invalidCount = 0;
	for (const [key, seenAt] of Object.entries(parsed)) if (typeof seenAt === "number" && Number.isFinite(seenAt) && seenAt > 0) data[key] = seenAt;
	else invalidCount++;
	return {
		data,
		invalidCount
	};
}
async function readPersistentDedupeLegacyJsonFileEntries(options) {
	const { data, invalidCount } = parseLegacyDedupeData(await fs.readFile(options.filePath, "utf8"));
	const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
	const now = options.now ?? Date.now();
	const entries = [];
	let skippedExpired = 0;
	for (const [key, seenAt] of Object.entries(data)) {
		const ttlOption = resolveRemainingTtlMs(seenAt, ttlMs, now);
		if (ttlOption === null) {
			skippedExpired++;
			continue;
		}
		entries.push(createPersistentDedupeImportEntry({
			key,
			seenAt,
			...ttlOption
		}));
	}
	return {
		entries,
		skippedExpired,
		skippedInvalid: invalidCount
	};
}
async function listPersistentDedupeLegacyJsonFileEntries(options) {
	return (await readPersistentDedupeLegacyJsonFileEntries(options)).entries;
}
function shouldReplacePersistentDedupeEntry(params) {
	const incomingSeenAt = resolveUnknownEntrySeenAt(params.incomingValue);
	return incomingSeenAt != null && incomingSeenAt > (resolveUnknownEntrySeenAt(params.existingValue) ?? 0);
}
/** Import one retired JSON dedupe cache file into plugin-state SQLite during doctor repair. */
async function migratePersistentDedupeLegacyJsonFile(options) {
	const store = createPersistentStoreResolver(options)(resolveNamespace(options.namespace));
	const legacy = await readPersistentDedupeLegacyJsonFileEntries(options);
	const result = {
		imported: 0,
		skippedExpired: legacy.skippedExpired,
		skippedInvalid: legacy.skippedInvalid,
		skippedExisting: 0,
		removed: false
	};
	for (const entry of legacy.entries) {
		let observed = await store.get().observe(entry.key);
		for (;;) {
			const currentSeenAt = resolveEntrySeenAt(observed.value);
			const outcome = await store.get().compareAndApply(entry.key, observed.comparison, currentSeenAt != null && currentSeenAt >= entry.value.seenAt ? {
				operation: "update",
				action: "keep"
			} : {
				operation: "update",
				action: "set",
				value: entry.value,
				ttlMs: entry.ttlMs
			});
			if (outcome.status === "conflict") {
				observed = outcome.current;
				continue;
			}
			if (outcome.status === "applied") result.imported++;
			else result.skippedExisting++;
			break;
		}
	}
	if (options.removeFile !== false) {
		if (legacy.entries.length > 0) store.get();
		await fs.rm(options.filePath, { force: true });
		result.removed = true;
	}
	return result;
}
/** Create a dedupe helper that combines in-memory fast checks with SQLite-backed state. */
function createPersistentDedupe(options) {
	const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
	const memoryMaxSize = resolveNonNegativeIntegerOption(options.memoryMaxSize, 0);
	const captureStore = createPersistentStoreResolver(options);
	const memory = createDedupeCache({
		ttlMs,
		maxSize: memoryMaxSize
	});
	const inflight = /* @__PURE__ */ new Map();
	const operations = new KeyedAsyncQueue();
	let memoryGeneration = 0;
	async function checkAndRecordInner(key, store, scopedKey, now, generation, onDiskError) {
		const cached = memory.peek(scopedKey, now);
		if (generation === memoryGeneration) memory.check(scopedKey, now);
		if (cached) return false;
		try {
			const entryKey = resolveEntryKey(key);
			let observed = await store.get().observe(entryKey);
			for (;;) {
				const seenAt = resolveEntrySeenAt(observed.value);
				const duplicate = isRecentTimestamp(seenAt, ttlMs, now);
				const outcome = await store.get().compareAndApply(entryKey, observed.comparison, duplicate ? {
					operation: "update",
					action: "keep"
				} : {
					operation: "update",
					action: "set",
					value: {
						key,
						seenAt: now
					},
					...ttlMs > 0 ? { ttlMs } : {}
				});
				if (outcome.status === "conflict") {
					observed = outcome.current;
					continue;
				}
				if (generation === memoryGeneration) memory.check(scopedKey, duplicate ? seenAt : now);
				return !duplicate;
			}
		} catch (error) {
			onDiskError?.(error);
			if (generation === memoryGeneration) memory.check(scopedKey, now);
			return true;
		}
	}
	async function hasRecentInner(key, store, scopedKey, now, generation, onDiskError) {
		if (memory.peek(scopedKey, now)) return true;
		try {
			const seenAt = resolveEntrySeenAt(await store.get().lookup(resolveEntryKey(key)));
			if (!isRecentTimestamp(seenAt, ttlMs, now)) return false;
			if (generation === memoryGeneration) memory.check(scopedKey, seenAt);
			return true;
		} catch (error) {
			onDiskError?.(error);
			return memory.peek(scopedKey, now);
		}
	}
	async function warmup(namespace = "global", onError) {
		const now = Date.now();
		const normalizedNamespace = resolveNamespace(namespace);
		const generation = memoryGeneration;
		const store = captureStore(normalizedNamespace);
		return operations.enqueue(store.namespace, async () => {
			try {
				let loaded = 0;
				for (const entry of await store.get().entries()) {
					const ts = resolveEntrySeenAt(entry.value);
					if (ts == null) continue;
					if (ttlMs > 0 && now - ts >= ttlMs) continue;
					if (generation === memoryGeneration) {
						memory.check(resolveScopedKey(normalizedNamespace, entry.value.key), ts);
						loaded++;
					}
				}
				return loaded;
			} catch (error) {
				onError?.(error);
				return 0;
			}
		});
	}
	async function checkAndRecord(key, dedupeOptions) {
		const trimmed = key.trim();
		if (!trimmed) return true;
		const namespace = resolveNamespace(dedupeOptions?.namespace);
		const scopedKey = resolveScopedKey(namespace, trimmed);
		if (inflight.has(scopedKey)) return false;
		const onDiskError = dedupeOptions?.onDiskError ?? options.onDiskError;
		const now = dedupeOptions?.now ?? Date.now();
		const generation = memoryGeneration;
		const store = captureStore(namespace);
		const work = operations.enqueue(store.namespace, () => checkAndRecordInner(trimmed, store, scopedKey, now, generation, onDiskError));
		inflight.set(scopedKey, work);
		try {
			return await work;
		} finally {
			if (inflight.get(scopedKey) === work) inflight.delete(scopedKey);
		}
	}
	async function hasRecent(key, dedupeOptions) {
		const trimmed = key.trim();
		if (!trimmed) return false;
		const namespace = resolveNamespace(dedupeOptions?.namespace);
		const scopedKey = resolveScopedKey(namespace, trimmed);
		const onDiskError = dedupeOptions?.onDiskError ?? options.onDiskError;
		const now = dedupeOptions?.now ?? Date.now();
		const generation = memoryGeneration;
		const store = captureStore(namespace);
		return operations.enqueue(store.namespace, () => hasRecentInner(trimmed, store, scopedKey, now, generation, onDiskError));
	}
	async function forget(key, dedupeOptions) {
		const trimmed = key.trim();
		if (!trimmed) return false;
		const namespace = resolveNamespace(dedupeOptions?.namespace);
		const scopedKey = resolveScopedKey(namespace, trimmed);
		memoryGeneration++;
		memory.delete(scopedKey);
		inflight.delete(scopedKey);
		const store = captureStore(namespace);
		return operations.enqueue(store.namespace, async () => {
			try {
				return await store.get().delete(resolveEntryKey(trimmed));
			} catch (error) {
				(dedupeOptions?.onDiskError ?? options.onDiskError)?.(error);
				return false;
			}
		});
	}
	return {
		checkAndRecord,
		hasRecent,
		forget,
		warmup,
		clearMemory: () => {
			memoryGeneration++;
			memory.clear();
		},
		memorySize: () => memory.size()
	};
}
function createReleasedClaimError(scopedKey) {
	return /* @__PURE__ */ new Error(`claim released before commit: ${scopedKey}`);
}
/** Resolve a claim, waiting on an active owner and retrying only when its release allows it. */
async function runClaimableDedupeClaimLoop(claimNext, retryAfterRejection) {
	let rejectionCount = 0;
	while (true) {
		const claim = await claimNext();
		if (claim.kind !== "inflight") return claim;
		try {
			await claim.pending;
			return { kind: "duplicate" };
		} catch (error) {
			if (!retryAfterRejection(error, ++rejectionCount)) return { kind: "duplicate" };
		}
	}
}
/** Create a claim/commit/release dedupe guard backed by memory and optional persistent storage. */
function createClaimableDedupe(options) {
	const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
	const memoryMaxSize = resolveNonNegativeIntegerOption(options.memoryMaxSize, 0);
	const memory = createDedupeCache({
		ttlMs,
		maxSize: memoryMaxSize
	});
	let persistent = null;
	if (hasPluginStateOptions(options)) persistent = createPersistentDedupe({
		ttlMs,
		memoryMaxSize,
		pluginId: options.pluginId,
		stateMaxEntries: Math.max(1, resolveNonNegativeIntegerOption(options.stateMaxEntries, 1)),
		...options.namespacePrefix ? { namespacePrefix: options.namespacePrefix } : {},
		...options.env ? { env: options.env } : {},
		...options.onDiskError ? { onDiskError: options.onDiskError } : {}
	});
	else if (hasLegacyPathOptions(options)) persistent = createPersistentDedupe({
		ttlMs,
		memoryMaxSize,
		fileMaxEntries: Math.max(1, resolveNonNegativeIntegerOption(options.fileMaxEntries, 1)),
		resolveFilePath: options.resolveFilePath,
		...options.env ? { env: options.env } : {},
		...options.lockOptions ? { lockOptions: options.lockOptions } : {},
		...options.onDiskError ? { onDiskError: options.onDiskError } : {}
	});
	const inflight = /* @__PURE__ */ new Map();
	async function hasRecent(key, dedupeOptions) {
		const trimmed = key.trim();
		if (!trimmed) return false;
		const scopedKey = resolveScopedKey(resolveNamespace(dedupeOptions?.namespace), trimmed);
		if (persistent) return persistent.hasRecent(trimmed, dedupeOptions);
		return memory.peek(scopedKey, dedupeOptions?.now);
	}
	async function forget(key, dedupeOptions) {
		const trimmed = key.trim();
		if (!trimmed) return false;
		const scopedKey = resolveScopedKey(resolveNamespace(dedupeOptions?.namespace), trimmed);
		inflight.get(scopedKey)?.reject(createReleasedClaimError(scopedKey));
		inflight.delete(scopedKey);
		if (persistent) return persistent.forget(trimmed, dedupeOptions);
		memory.delete(scopedKey);
		return true;
	}
	async function claim(key, dedupeOptions) {
		const trimmed = key.trim();
		if (!trimmed) return { kind: "claimed" };
		const scopedKey = resolveScopedKey(resolveNamespace(dedupeOptions?.namespace), trimmed);
		const existing = inflight.get(scopedKey);
		if (existing) return {
			kind: "inflight",
			pending: existing.promise
		};
		let resolve;
		let reject;
		const promise = new Promise((resolvePromise, rejectPromise) => {
			resolve = resolvePromise;
			reject = rejectPromise;
		});
		promise.catch(() => {});
		const claimValue = {
			promise,
			resolve,
			reject
		};
		inflight.set(scopedKey, claimValue);
		try {
			const recent = await hasRecent(trimmed, dedupeOptions);
			if (inflight.get(scopedKey) !== claimValue) {
				await promise;
				return { kind: "duplicate" };
			}
			if (recent) {
				resolve(false);
				inflight.delete(scopedKey);
				return { kind: "duplicate" };
			}
			return { kind: "claimed" };
		} catch (error) {
			if (inflight.get(scopedKey) !== claimValue) {
				await promise;
				return { kind: "duplicate" };
			}
			reject(error);
			inflight.delete(scopedKey);
			throw error;
		}
	}
	async function commit(key, dedupeOptions) {
		const trimmed = key.trim();
		if (!trimmed) return true;
		const scopedKey = resolveScopedKey(resolveNamespace(dedupeOptions?.namespace), trimmed);
		const claimValue = inflight.get(scopedKey);
		try {
			const recorded = persistent ? await persistent.checkAndRecord(trimmed, dedupeOptions) : !memory.check(scopedKey, dedupeOptions?.now);
			claimValue?.resolve(recorded);
			return recorded;
		} catch (error) {
			claimValue?.reject(error);
			throw error;
		} finally {
			if (inflight.get(scopedKey) === claimValue) inflight.delete(scopedKey);
		}
	}
	function release(key, dedupeOptions) {
		const trimmed = key.trim();
		if (!trimmed) return;
		const scopedKey = resolveScopedKey(resolveNamespace(dedupeOptions?.namespace), trimmed);
		const claimLocal = inflight.get(scopedKey);
		if (!claimLocal) return;
		claimLocal.reject(dedupeOptions?.error ?? createReleasedClaimError(scopedKey));
		inflight.delete(scopedKey);
	}
	return {
		claim,
		commit,
		release,
		hasRecent,
		forget,
		warmup: persistent?.warmup ?? (async () => 0),
		clearMemory: () => {
			persistent?.clearMemory();
			memory.clear();
		},
		memorySize: () => persistent?.memorySize() ?? memory.size()
	};
}
/**
* Create an event-keyed replay guard whose claims own their settlement handles.
*
* Layering contract vs the durable ingress drain (`src/channels/message/ingress-queue.ts`):
* the drain already rejects duplicate event ids durably — `complete()` tombstones the row
* and enqueue is `ON CONFLICT DO NOTHING` for the tombstone retention window. A replay
* guard on a drained channel is justified only when its identity or retention exceeds the
* queue's: a *logical* message key that differs from the transport delivery id (Telegram:
* `chat_id:message_id` vs `update_id` — debounce/media-group merges can re-surface a
* constituent message under a fresh update_id only the guard sees), or a window longer
* than the channel's tombstone retention. If the guard key would equal the drain event_id
* and retention fits the tombstone window, delete the guard when adopting the drain.
*/
function createChannelReplayGuard(params) {
	return createChannelReplayGuardWithDedupe(params, createClaimableDedupe(params.dedupe));
}
//#endregion
export { migratePersistentDedupeLegacyJsonFile as a, createPersistentDedupeImportEntry as c, listPersistentDedupeLegacyJsonFileEntries as i, resolvePersistentDedupePluginStateNamespace as l, createClaimableDedupe as n, runClaimableDedupeClaimLoop as o, createPersistentDedupe as r, shouldReplacePersistentDedupeEntry as s, createChannelReplayGuard as t };
