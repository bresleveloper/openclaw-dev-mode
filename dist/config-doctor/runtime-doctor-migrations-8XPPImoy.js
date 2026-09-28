import { a as asNullableRecord, i as normalizeOptionalString, s as asOptionalRecord, t as normalizeLowercaseStringOrEmpty } from "./string-coerce-Dyy0qgLy.js";
import "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
//#region packages/normalization-core/src/string-normalization.ts
/** Coerces entries to strings, trims them, and drops empty results. */
function normalizeStringEntries(list) {
	return (list ?? []).map((entry) => normalizeOptionalString(String(entry)) ?? "").filter(Boolean);
}
/** Returns first-seen unique values while preserving insertion order. */
function uniqueValues(values) {
	return [...new Set(values)];
}
/** Returns first-seen unique strings while preserving insertion order. */
function uniqueStrings(values) {
	return uniqueValues(values);
}
/** Normalizes entries, removes duplicates, and preserves first-seen order. */
function normalizeUniqueStringEntries(values) {
	return uniqueStrings(normalizeStringEntries(values ? [...values] : void 0));
}
//#endregion
//#region src/channels/plugins/dm-access.ts
/**
* Channel DM access helpers.
*
* Reads, writes, migrates, and normalizes direct-message policy and allowFrom fields.
*/
function cloneDm(entry) {
	const dm = asNullableRecord(entry.dm);
	return dm ? { ...dm } : null;
}
function allowFromListsMatch(left, right) {
	if (!Array.isArray(left) || !Array.isArray(right)) return false;
	const normalizedLeft = normalizeStringEntries(left);
	const normalizedRight = normalizeStringEntries(right);
	if (normalizedLeft.length !== normalizedRight.length) return false;
	return normalizedLeft.every((value, index) => value === normalizedRight[index]);
}
/**
* Migrates legacy `dm.*` aliases into the canonical DM access fields.
*/
function normalizeLegacyDmAliases(params) {
	let changed = false;
	let updated = params.entry;
	const rawDm = updated.dm;
	const dm = cloneDm(updated);
	let dmChanged = false;
	const topDmPolicy = updated.dmPolicy;
	const legacyDmPolicy = dm?.policy;
	if (topDmPolicy === void 0 && legacyDmPolicy !== void 0) {
		updated = {
			...updated,
			dmPolicy: legacyDmPolicy
		};
		changed = true;
		if (dm) {
			delete dm.policy;
			dmChanged = true;
		}
		params.changes.push(`Moved ${params.pathPrefix}.dm.policy → ${params.pathPrefix}.dmPolicy.`);
	} else if (topDmPolicy !== void 0 && legacyDmPolicy !== void 0 && topDmPolicy === legacyDmPolicy) {
		if (dm) {
			delete dm.policy;
			dmChanged = true;
			params.changes.push(`Removed ${params.pathPrefix}.dm.policy (dmPolicy already set).`);
		}
	}
	if (params.promoteAllowFrom !== false) {
		const topAllowFrom = updated.allowFrom;
		const legacyAllowFrom = dm?.allowFrom;
		if (topAllowFrom === void 0 && legacyAllowFrom !== void 0) {
			updated = {
				...updated,
				allowFrom: legacyAllowFrom
			};
			changed = true;
			if (dm) {
				delete dm.allowFrom;
				dmChanged = true;
			}
			params.changes.push(`Moved ${params.pathPrefix}.dm.allowFrom → ${params.pathPrefix}.allowFrom.`);
		} else if (topAllowFrom !== void 0 && legacyAllowFrom !== void 0 && allowFromListsMatch(topAllowFrom, legacyAllowFrom)) {
			if (dm) {
				delete dm.allowFrom;
				dmChanged = true;
				params.changes.push(`Removed ${params.pathPrefix}.dm.allowFrom (allowFrom already set).`);
			}
		}
	}
	if (dm && asNullableRecord(rawDm) && dmChanged) {
		if (Object.keys(dm).length === 0) {
			if (updated.dm !== void 0) {
				const { dm: _ignored, ...rest } = updated;
				updated = rest;
				changed = true;
				params.changes.push(`Removed empty ${params.pathPrefix}.dm after migration.`);
			}
		} else {
			updated = {
				...updated,
				dm
			};
			changed = true;
		}
	}
	return {
		entry: updated,
		changed
	};
}
//#endregion
//#region src/config/channel-compat-normalization.ts
function parseAliasStreamingMode(value) {
	if (typeof value !== "string") return null;
	const normalized = value.trim().toLowerCase();
	return normalized === "off" || normalized === "partial" || normalized === "block" || normalized === "progress" ? normalized : null;
}
/**
* Doctor-only stream mode resolution across nested and legacy alias keys.
*
* Runtime helpers no longer read `streamMode`, so doctor contracts use this to
* preserve legacy intent (nested mode > scalar string > streamMode > scalar
* boolean) while migrating flat aliases into `streaming.mode`.
*/
function resolveLegacyAliasStreamingMode(entry, defaultMode) {
	const nestedMode = asNullableRecord(entry.streaming)?.mode;
	const parsed = parseAliasStreamingMode(nestedMode ?? entry.streaming) ?? parseAliasStreamingMode(entry.streamMode);
	if (parsed) return parsed;
	if (typeof entry.streaming === "boolean") return entry.streaming ? "partial" : "off";
	return defaultMode;
}
/** Checks whether any account entry still carries a channel-specific legacy alias. */
function hasLegacyAccountStreamingAliases(value, match) {
	const accounts = asNullableRecord(value);
	if (!accounts) return false;
	return Object.values(accounts).some((account) => match(account));
}
function ensureNestedRecord(owner, key) {
	const existing = asNullableRecord(owner[key]);
	if (existing) return { ...existing };
	return {};
}
/**
* Moves legacy flat streaming aliases into the nested `streaming` config shape.
*
* Existing nested values win over legacy aliases, matching doctor migration rules
* that preserve explicit modern config while removing stale compatibility keys.
*/
function normalizeLegacyStreamingAliases(params) {
	const beforeStreaming = params.entry.streaming;
	const hadLegacyStreamMode = params.entry.streamMode !== void 0;
	const hasLegacyFlatFields = params.entry.chunkMode !== void 0 || params.entry.blockStreaming !== void 0 || params.entry.blockStreamingCoalesce !== void 0 || params.includePreviewChunk === true && params.entry.draftChunk !== void 0 || params.entry.nativeStreaming !== void 0;
	if (!(hadLegacyStreamMode || typeof beforeStreaming === "boolean" || typeof beforeStreaming === "string" || hasLegacyFlatFields)) return {
		entry: params.entry,
		changed: false
	};
	const updated = { ...params.entry };
	let changed = false;
	const streaming = ensureNestedRecord(updated, "streaming");
	const block = ensureNestedRecord(streaming, "block");
	const preview = ensureNestedRecord(streaming, "preview");
	let movedStreamMode = false;
	if ((hadLegacyStreamMode || typeof beforeStreaming === "boolean" || typeof beforeStreaming === "string") && streaming.mode === void 0) {
		streaming.mode = params.resolvedMode;
		if (hadLegacyStreamMode) {
			movedStreamMode = true;
			params.changes.push(`Moved ${params.pathPrefix}.streamMode → ${params.pathPrefix}.streaming.mode (${params.resolvedMode}).`);
		} else if (typeof beforeStreaming === "boolean") params.changes.push(`Moved ${params.pathPrefix}.streaming (boolean) → ${params.pathPrefix}.streaming.mode (${params.resolvedMode}).`);
		else if (typeof beforeStreaming === "string") params.changes.push(`Moved ${params.pathPrefix}.streaming (scalar) → ${params.pathPrefix}.streaming.mode (${params.resolvedMode}).`);
		changed = true;
	}
	if (hadLegacyStreamMode) {
		if (!movedStreamMode) params.changes.push(`Removed ${params.pathPrefix}.streamMode (${params.pathPrefix}.streaming.mode already set).`);
		delete updated.streamMode;
		changed = true;
	}
	const moveOrRemoveAlias = (flatKey, target, slot, nestedPath) => {
		if (updated[flatKey] === void 0) return;
		const nested = `${params.pathPrefix}.streaming.${nestedPath}`;
		if (target[slot] === void 0) {
			target[slot] = updated[flatKey];
			params.changes.push(`Moved ${params.pathPrefix}.${flatKey} → ${nested}.`);
		} else params.changes.push(`Removed ${params.pathPrefix}.${flatKey} (${nested} already set).`);
		delete updated[flatKey];
		changed = true;
	};
	moveOrRemoveAlias("chunkMode", streaming, "chunkMode", "chunkMode");
	moveOrRemoveAlias("blockStreaming", block, "enabled", "block.enabled");
	if (params.includePreviewChunk === true) moveOrRemoveAlias("draftChunk", preview, "chunk", "preview.chunk");
	moveOrRemoveAlias("blockStreamingCoalesce", block, "coalesce", "block.coalesce");
	if (updated.nativeStreaming !== void 0 && params.resolvedNativeTransport !== void 0) {
		if (streaming.nativeTransport === void 0) {
			streaming.nativeTransport = params.resolvedNativeTransport;
			params.changes.push(`Moved ${params.pathPrefix}.nativeStreaming → ${params.pathPrefix}.streaming.nativeTransport.`);
		} else params.changes.push(`Removed ${params.pathPrefix}.nativeStreaming (${params.pathPrefix}.streaming.nativeTransport already set).`);
		delete updated.nativeStreaming;
		changed = true;
	} else if (typeof beforeStreaming === "boolean" && streaming.nativeTransport === void 0 && params.resolvedNativeTransport !== void 0) {
		streaming.nativeTransport = params.resolvedNativeTransport;
		params.changes.push(`Moved ${params.pathPrefix}.streaming (boolean) → ${params.pathPrefix}.streaming.nativeTransport.`);
		changed = true;
	}
	if (changed && beforeStreaming === void 0 && streaming.mode === void 0 && params.aliasOnlyMode !== void 0) {
		streaming.mode = params.aliasOnlyMode;
		params.changes.push(`Set ${params.pathPrefix}.streaming.mode (${params.aliasOnlyMode}) to keep the previous default while migrating flat streaming keys.`);
		changed = true;
	}
	if (Object.keys(preview).length > 0) streaming.preview = preview;
	if (Object.keys(block).length > 0) streaming.block = block;
	updated.streaming = streaming;
	return {
		entry: updated,
		changed
	};
}
/**
* Root flat delivery aliases resolved per-key for every account (nested-first,
* flat-fallback), even when the account carried its own `streaming` value that
* replaces the root object wholesale at merge time. Capture them before root
* migration so replace-semantics channels can seed existing account streaming
* objects with the delivery settings those accounts previously inherited.
*/
function buildRootFlatDeliverySeed(entry, includePreviewChunk) {
	const seed = {};
	if (entry.chunkMode !== void 0) seed.chunkMode = entry.chunkMode;
	const block = {};
	if (entry.blockStreaming !== void 0) block.enabled = entry.blockStreaming;
	if (entry.blockStreamingCoalesce !== void 0) block.coalesce = entry.blockStreamingCoalesce;
	if (Object.keys(block).length > 0) seed.block = block;
	if (includePreviewChunk === true && entry.draftChunk !== void 0) seed.preview = { chunk: entry.draftChunk };
	return Object.keys(seed).length > 0 ? seed : null;
}
/**
* Rebuilds a materialized account streaming object with the per-slot
* precedence the runtime resolvers applied pre-migration. The slots disagree:
* - mode, block.enabled, preview.chunk resolve on the MERGED entry
*   (src/channels/streaming.ts nested-first), so the root nested object
*   outranked account flat aliases and preview.chunk picks atomically.
* - chunkMode resolves the raw account entry before the root entry
*   (resolveChunkModeForProvider in src/auto-reply/chunk.ts), so an account
*   flat chunkMode outranked every root spelling.
* - block.coalesce merges the account pick over the root pick per field
*   (resolveProviderBlockStreamingCoalesce in
*   src/auto-reply/reply/block-streaming.ts).
* One generic deep-fill cannot express that ladder, so seed slot by slot.
* Copying root values freezes inheritance at fix time by design (the change
* message records it); merged-entry channels (mattermost-style resolved
* accounts) would otherwise lose the root values entirely once the account
* owns a streaming object.
*/
function seedMaterializedAccountStreaming(params) {
	const { created } = params;
	const rootNested = params.rootNestedBefore ?? {};
	const rootFlat = params.rootFlat ?? {};
	let seeded = fillMissingRecordFields(structuredClone(rootNested), created).value;
	seeded = fillMissingRecordFields(seeded, rootFlat).value;
	seeded = fillMissingRecordFields(seeded, params.rootAfter).value;
	if (created.chunkMode !== void 0) seeded = {
		...seeded,
		chunkMode: created.chunkMode
	};
	const createdCoalesce = asNullableRecord(asNullableRecord(created.block)?.coalesce);
	if (createdCoalesce) {
		const rootCoalesce = asNullableRecord(asNullableRecord(rootNested.block)?.coalesce) ?? asNullableRecord(asNullableRecord(rootFlat.block)?.coalesce);
		seeded = {
			...seeded,
			block: {
				...asNullableRecord(seeded.block),
				coalesce: {
					...structuredClone(rootCoalesce ?? {}),
					...structuredClone(createdCoalesce)
				}
			}
		};
	}
	const rootNestedPreviewChunk = asNullableRecord(rootNested.preview)?.chunk;
	if (rootNestedPreviewChunk !== void 0 && asNullableRecord(created.preview)?.chunk !== void 0) seeded = {
		...seeded,
		preview: {
			...asNullableRecord(seeded.preview),
			chunk: structuredClone(rootNestedPreviewChunk)
		}
	};
	return seeded;
}
/** Deep-fills record fields missing from target with copies of source values. */
function fillMissingRecordFields(target, source) {
	let filled = false;
	const value = { ...target };
	for (const [key, sourceValue] of Object.entries(source)) {
		if (sourceValue === void 0) continue;
		const existing = value[key];
		if (existing === void 0) {
			value[key] = structuredClone(sourceValue);
			filled = true;
			continue;
		}
		const existingRecord = asNullableRecord(existing);
		const sourceRecord = asNullableRecord(sourceValue);
		if (!existingRecord || !sourceRecord) continue;
		const merged = fillMissingRecordFields(existingRecord, sourceRecord);
		if (merged.filled) {
			value[key] = merged.value;
			filled = true;
		}
	}
	return {
		value,
		filled
	};
}
/**
* Runs generic channel doctor alias migration for the root entry and accounts.
*
* Channel plugins provide streaming resolution and optional account-specific
* migrations so core can keep one compatibility path for all channel shapes.
*/
function normalizeLegacyChannelAliases(params) {
	let updated = params.entry;
	let changed = false;
	const rootFlatDeliverySeed = params.seedAccountStreamingFromRoot === true ? buildRootFlatDeliverySeed(params.entry, params.resolveStreamingOptions(params.entry).includePreviewChunk) : null;
	const rootNestedStreamingBefore = params.seedAccountStreamingFromRoot === true ? asNullableRecord(params.entry.streaming) : null;
	if (params.normalizeDm === true) {
		const dm = normalizeLegacyDmAliases({
			entry: updated,
			pathPrefix: params.pathPrefix,
			changes: params.changes,
			promoteAllowFrom: params.rootDmPromoteAllowFrom
		});
		updated = dm.entry;
		changed = dm.changed;
	}
	const streaming = normalizeLegacyStreamingAliases({
		entry: updated,
		pathPrefix: params.pathPrefix,
		changes: params.changes,
		...params.resolveStreamingOptions(updated)
	});
	updated = streaming.entry;
	changed = changed || streaming.changed;
	const rawAccounts = asNullableRecord(updated.accounts);
	if (!rawAccounts) return {
		entry: updated,
		changed
	};
	const rootStreaming = asNullableRecord(updated.streaming);
	let accountsChanged = false;
	const accounts = { ...rawAccounts };
	for (const [accountId, rawAccount] of Object.entries(rawAccounts)) {
		const account = asNullableRecord(rawAccount);
		if (!account) continue;
		let accountEntry = account;
		let accountChanged = false;
		const accountPathPrefix = `${params.pathPrefix}.accounts.${accountId}`;
		if (params.normalizeAccountDm === true) {
			const accountDm = normalizeLegacyDmAliases({
				entry: accountEntry,
				pathPrefix: accountPathPrefix,
				changes: params.changes
			});
			accountEntry = accountDm.entry;
			accountChanged = accountDm.changed;
		}
		const accountStreamingOptions = { ...params.resolveStreamingOptions(accountEntry) };
		if (rootStreaming) delete accountStreamingOptions.aliasOnlyMode;
		const beforeAccountStreaming = accountEntry.streaming;
		const accountStreaming = normalizeLegacyStreamingAliases({
			entry: accountEntry,
			pathPrefix: accountPathPrefix,
			changes: params.changes,
			...accountStreamingOptions
		});
		accountEntry = accountStreaming.entry;
		accountChanged = accountChanged || accountStreaming.changed;
		if (params.seedAccountStreamingFromRoot === true && accountStreaming.changed && beforeAccountStreaming === void 0 && rootStreaming) {
			const created = asNullableRecord(accountEntry.streaming);
			if (created) {
				const seeded = seedMaterializedAccountStreaming({
					created,
					rootNestedBefore: rootNestedStreamingBefore,
					rootFlat: rootFlatDeliverySeed,
					rootAfter: rootStreaming
				});
				if (JSON.stringify(seeded) !== JSON.stringify(created)) {
					accountEntry = {
						...accountEntry,
						streaming: seeded
					};
					params.changes.push(`Copied ${params.pathPrefix}.streaming into ${accountPathPrefix}.streaming to keep inherited settings while migrating flat streaming keys.`);
				}
			}
		} else if (rootFlatDeliverySeed && beforeAccountStreaming !== void 0) {
			const accountStreamingObject = asNullableRecord(accountEntry.streaming);
			if (accountStreamingObject) {
				let seededAccount = accountStreamingObject;
				if (rootFlatDeliverySeed.chunkMode !== void 0 && seededAccount.chunkMode === void 0) seededAccount = {
					...seededAccount,
					chunkMode: rootFlatDeliverySeed.chunkMode
				};
				const rootFlatBlock = asNullableRecord(rootFlatDeliverySeed.block);
				const rootFlatBlockEnabled = rootFlatBlock?.enabled;
				if (rootFlatBlockEnabled !== void 0 && asNullableRecord(seededAccount.block)?.enabled === void 0) seededAccount = {
					...seededAccount,
					block: {
						...asNullableRecord(seededAccount.block),
						enabled: rootFlatBlockEnabled
					}
				};
				const rootFlatCoalesce = asNullableRecord(rootFlatBlock?.coalesce);
				if (rootFlatCoalesce) {
					const accountCoalesce = asNullableRecord(asNullableRecord(seededAccount.block)?.coalesce);
					const mergedCoalesce = {
						...structuredClone(rootFlatCoalesce),
						...structuredClone(accountCoalesce ?? {})
					};
					if (JSON.stringify(mergedCoalesce) !== JSON.stringify(accountCoalesce ?? {})) seededAccount = {
						...seededAccount,
						block: {
							...asNullableRecord(seededAccount.block),
							coalesce: mergedCoalesce
						}
					};
				}
				const rootFlatPreviewChunk = asNullableRecord(rootFlatDeliverySeed.preview)?.chunk;
				if (rootFlatPreviewChunk !== void 0 && asNullableRecord(seededAccount.preview)?.chunk === void 0) seededAccount = {
					...seededAccount,
					preview: {
						...asNullableRecord(seededAccount.preview),
						chunk: structuredClone(rootFlatPreviewChunk)
					}
				};
				if (seededAccount !== accountStreamingObject) {
					accountEntry = {
						...accountEntry,
						streaming: seededAccount
					};
					accountChanged = true;
					params.changes.push(`Copied flat ${params.pathPrefix} delivery keys into ${accountPathPrefix}.streaming to keep inherited settings while migrating flat streaming keys.`);
				}
			}
		}
		const accountExtra = params.normalizeAccountExtra?.({
			account: accountEntry,
			accountId,
			pathPrefix: accountPathPrefix,
			changes: params.changes
		});
		if (accountExtra) {
			accountEntry = accountExtra.entry;
			accountChanged = accountChanged || accountExtra.changed;
		}
		if (accountChanged) {
			accounts[accountId] = accountEntry;
			accountsChanged = true;
		}
	}
	if (accountsChanged) {
		updated = {
			...updated,
			accounts
		};
		changed = true;
	}
	return {
		entry: updated,
		changed
	};
}
/** Detects legacy streaming aliases on one channel or account config entry. */
function hasLegacyStreamingAliases(value, options) {
	const entry = asNullableRecord(value);
	if (!entry) return false;
	return entry.streamMode !== void 0 || typeof entry.streaming === "boolean" || typeof entry.streaming === "string" || entry.chunkMode !== void 0 || entry.blockStreaming !== void 0 || entry.blockStreamingCoalesce !== void 0 || options?.includePreviewChunk === true && entry.draftChunk !== void 0 || options?.includeNativeTransport === true && entry.nativeStreaming !== void 0;
}
//#endregion
//#region src/infra/prototype-keys.ts
const BLOCKED_OBJECT_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"prototype",
	"constructor"
]);
/** Return true when assigning `key` could mutate an object prototype. */
function isBlockedObjectKey(key) {
	return BLOCKED_OBJECT_KEYS.has(key);
}
//#endregion
//#region src/utils/boolean.ts
const DEFAULT_TRUTHY = [
	"true",
	"1",
	"yes",
	"on"
];
const DEFAULT_FALSY = [
	"false",
	"0",
	"no",
	"off"
];
new Set(DEFAULT_TRUTHY);
new Set(DEFAULT_FALSY);
/** Returns only real boolean values and leaves boolean-like strings for explicit parsing. */
function asBoolean(value) {
	return typeof value === "boolean" ? value : void 0;
}
//#endregion
//#region src/infra/plain-object.ts
/**
* Config merge/patch accepts only `[object Object]` values, excluding Date/Map/Set/class instances.
* The stricter prototype contract prevents host objects from being merged as authored config.
*/
function isPlainObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Object]";
}
//#endregion
//#region src/infra/deep-merge.ts
function sanitizePlainObject(value) {
	const sanitized = {};
	for (const [key, entry] of Object.entries(value)) {
		if (isBlockedObjectKey(key)) continue;
		sanitized[key] = isPlainObject(entry) ? sanitizePlainObject(entry) : entry;
	}
	return sanitized;
}
/** Merge plain objects while preserving OpenClaw's null, undefined, and array policies. */
function mergeDeep(base, override, options = {}) {
	const arrays = options.arrays ?? "replace";
	const undefinedValues = options.undefinedValues ?? "skip";
	if (Array.isArray(base) && Array.isArray(override)) return arrays === "concat" ? [...base, ...override] : override;
	if (!isPlainObject(base) || !isPlainObject(override)) return override === void 0 && undefinedValues === "skip" ? base : override;
	const merged = sanitizePlainObject(base);
	for (const [key, value] of Object.entries(override)) {
		if (isBlockedObjectKey(key) || value === void 0 && undefinedValues === "skip") continue;
		const current = merged[key];
		if (isPlainObject(value)) merged[key] = isPlainObject(current) ? mergeDeep(current, value, options) : sanitizePlainObject(value);
		else if (arrays === "concat" && Array.isArray(current) && Array.isArray(value)) merged[key] = [...current, ...value];
		else merged[key] = value;
	}
	return merged;
}
//#endregion
//#region src/shared/global-singleton.ts
/**
* Process-local singleton helpers for registries, caches, and SDK-visible shared state.
* Keys must be symbols so unrelated modules cannot collide on `globalThis` property names.
*/
const GLOBAL_SINGLETON_RESETS_KEY = Symbol.for("openclaw.globalSingletonLifecycleResets");
function resolveGlobalSingletonResetRegistry() {
	const globalStore = globalThis;
	const existing = globalStore[GLOBAL_SINGLETON_RESETS_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[GLOBAL_SINGLETON_RESETS_KEY] = created;
	return created;
}
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
function resolveGlobalSingleton(key, create, reset, lifecycle = "close-and-restart") {
	const globalStore = globalThis;
	let value;
	if (Object.hasOwn(globalStore, key)) value = globalStore[key];
	else {
		value = create();
		globalStore[key] = value;
	}
	if (reset) resolveGlobalSingletonResetRegistry().set(key, {
		lifecycle,
		reset: () => reset(value)
	});
	return value;
}
/** Resolves a lifecycle-owned process-local Set singleton. */
function resolveGlobalSet(key, lifecycle) {
	return resolveGlobalSingleton(key, () => /* @__PURE__ */ new Set(), (value) => value.clear(), lifecycle);
}
//#endregion
//#region src/plugins/plugin-metadata-snapshot-readers.ts
const snapshotReaderSlot = resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaders"), () => ({}));
resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaderCustody"), () => ({ owners: 0 }));
//#endregion
//#region src/infra/map-size.ts
/** Prunes a Map in insertion order until it fits the requested maximum size. */
function pruneMapToMaxSize(map, maxSize) {
	if (Number.isNaN(maxSize) || maxSize === Number.POSITIVE_INFINITY) return;
	const limit = Math.max(0, Math.floor(maxSize));
	if (limit <= 0) {
		map.clear();
		return;
	}
	if (map.size <= limit) return;
	const keys = map.keys();
	while (map.size > limit) {
		const oldest = keys.next();
		if (oldest.done) break;
		map.delete(oldest.value);
	}
}
//#endregion
//#region src/routing/account-id.ts
const DEFAULT_ACCOUNT_ID = "default";
const VALID_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
const INVALID_CHARS_RE = /[^a-z0-9_-]+/g;
const LEADING_DASH_RE = /^-+/;
const TRAILING_DASH_RE = /-+$/;
const ACCOUNT_ID_CACHE_MAX = 512;
const normalizedAccountIdCache = /* @__PURE__ */ new Map();
function canonicalizeAccountId(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	if (VALID_ID_RE.test(value)) return normalized;
	return normalized.replace(INVALID_CHARS_RE, "-").replace(LEADING_DASH_RE, "").replace(TRAILING_DASH_RE, "").slice(0, 64);
}
function normalizeCanonicalAccountId(value) {
	const canonical = canonicalizeAccountId(value);
	if (!canonical || isBlockedObjectKey(canonical)) return;
	return canonical;
}
function resolveCachedCanonicalAccountId(value) {
	if (normalizedAccountIdCache.has(value)) return normalizedAccountIdCache.get(value);
	const normalized = normalizeCanonicalAccountId(value);
	normalizedAccountIdCache.set(value, normalized);
	pruneMapToMaxSize(normalizedAccountIdCache, ACCOUNT_ID_CACHE_MAX);
	return normalized;
}
function normalizeAccountId(value) {
	const trimmed = (value ?? "").trim();
	if (!trimmed) return DEFAULT_ACCOUNT_ID;
	return resolveCachedCanonicalAccountId(trimmed) ?? "default";
}
function normalizeOptionalAccountId(value) {
	const trimmed = (value ?? "").trim();
	if (!trimmed) return;
	return resolveCachedCanonicalAccountId(trimmed);
}
//#endregion
//#region src/routing/account-lookup.ts
function resolveChannelAccountKey(accounts, accountId, channelId, normalizeAccountId, accountKeyPolicy, options) {
	return resolveAccountKey(accounts, accountId, normalizeAccountId, accountKeyPolicy, {
		...options,
		channelId
	});
}
/** Select the stored spelling once for account readers and writers; exact keys win. */
function resolveAccountKey(accounts, accountId, normalizeAccountId$1, policy, options) {
	const effectivePolicy = policy ?? (options?.channelId ? snapshotReaderSlot.getCurrentPluginMetadataSnapshot?.({
		allowScopedSnapshot: true,
		allowWorkspaceScopedSnapshot: true
	})?.owners.channelAccountKeyPolicies?.get(options.channelId) : void 0);
	const normalizer = effectivePolicy ? normalizeAccountId : normalizeAccountId$1;
	const normalize = normalizer ?? normalizeLowercaseStringOrEmpty;
	if (options?.allowMissing && (isBlockedObjectKey(normalizeLowercaseStringOrEmpty(accountId)) || isBlockedObjectKey(normalize(accountId)))) throw new Error(`Account id "${accountId}" is reserved. Choose a different account id.`);
	const targetId = effectivePolicy ? normalize(accountId) : accountId;
	const missingKey = options?.allowMissing ? targetId : void 0;
	if (!accounts || typeof accounts !== "object") return missingKey;
	if (Object.hasOwn(accounts, targetId) && (!normalizer || !isBlockedObjectKey(targetId))) return targetId;
	const normalized = normalize(targetId);
	const lowercaseTarget = normalizeLowercaseStringOrEmpty(targetId);
	let canonicalMatch;
	for (const key of Object.keys(accounts)) {
		if (normalizer && isBlockedObjectKey(key)) continue;
		if (effectivePolicy && normalizeLowercaseStringOrEmpty(key) === lowercaseTarget) return key;
		const candidate = normalize(key);
		if ((!normalizer || Boolean(normalizeOptionalAccountId(key)) && !isBlockedObjectKey(candidate)) && candidate === normalized) {
			if (!effectivePolicy) return key;
			const entry = asOptionalRecord(accounts[key]);
			if (canonicalMatch === void 0 && entry && Object.hasOwn(entry, effectivePolicy.canonicalAliasesRequireOwnField) && normalizeOptionalString(entry[effectivePolicy.canonicalAliasesRequireOwnField])) canonicalMatch = key;
		}
	}
	return canonicalMatch ?? missingKey;
}
//#endregion
//#region src/config/channel-doctor-helpers.ts
/** Applies one channel-specific doctor migration to every object-shaped account. */
function normalizeChannelAccounts(params) {
	const rawAccounts = asNullableRecord(params.entry.accounts);
	if (!rawAccounts) return {
		entry: params.entry,
		changed: false
	};
	let changed = false;
	const accounts = { ...rawAccounts };
	for (const [accountId, value] of Object.entries(rawAccounts)) {
		const account = asNullableRecord(value);
		if (!account) continue;
		const normalized = params.normalizeAccount({
			account,
			accountId,
			pathPrefix: `${params.pathPrefix}.accounts.${accountId}`,
			changes: params.changes
		});
		if (normalized.changed) {
			accounts[accountId] = normalized.entry;
			changed = true;
		}
	}
	return changed ? {
		entry: {
			...params.entry,
			accounts
		},
		changed: true
	} : {
		entry: params.entry,
		changed: false
	};
}
/** Applies the same channel-specific doctor migration at root and account scope. */
function normalizeChannelConfigEntries(params) {
	const changes = params.changes ?? [];
	const channels = params.cfg.channels;
	const entry = asNullableRecord(channels?.[params.channelId]);
	if (!entry) return {
		config: params.cfg,
		changes
	};
	const channelPath = `channels.${params.channelId}`;
	const root = params.normalizeEntry({
		entry,
		pathPrefix: channelPath,
		changes
	});
	const accounts = normalizeChannelAccounts({
		entry: root.entry,
		pathPrefix: channelPath,
		changes,
		normalizeAccount: (accountParams) => params.normalizeEntry({
			entry: accountParams.account,
			accountId: accountParams.accountId,
			pathPrefix: accountParams.pathPrefix,
			changes: accountParams.changes
		})
	});
	if (!root.changed && !accounts.changed) return {
		config: params.cfg,
		changes
	};
	return {
		config: {
			...params.cfg,
			channels: {
				...channels,
				[params.channelId]: accounts.entry
			}
		},
		changes
	};
}
function stripRetiredKeys(params) {
	if (params.recursive && Array.isArray(params.value)) {
		let changed = false;
		const value = params.value.map((item, index) => {
			const stripped = stripRetiredKeys({
				...params,
				value: item,
				pathPrefix: `${params.pathPrefix}[${index}]`
			});
			changed = changed || stripped.changed;
			return stripped.value;
		});
		return {
			value: changed ? value : params.value,
			changed
		};
	}
	const record = asNullableRecord(params.value);
	if (!record) return {
		value: params.value,
		changed: false
	};
	let changed = false;
	const value = {};
	for (const [key, child] of Object.entries(record)) {
		if (params.keys.has(key)) {
			params.onRemove?.({
				key,
				pathPrefix: params.pathPrefix
			});
			changed = true;
			continue;
		}
		if (!params.recursive) {
			value[key] = child;
			continue;
		}
		const stripped = stripRetiredKeys({
			...params,
			value: child,
			pathPrefix: `${params.pathPrefix}.${key}`
		});
		changed = changed || stripped.changed;
		value[key] = stripped.value;
	}
	return {
		value: changed ? value : params.value,
		changed
	};
}
/** Removes retired keys recursively or from a channel root and its accounts. */
function stripRetiredChannelKeys(params) {
	const channels = params.cfg.channels;
	const entry = asNullableRecord(channels?.[params.channelId]);
	if (!entry) return {
		config: params.cfg,
		changed: false
	};
	const channelPath = `channels.${params.channelId}`;
	if (params.scope === "recursive") {
		const stripped = stripRetiredKeys({
			value: entry,
			keys: params.keys,
			pathPrefix: channelPath,
			recursive: true,
			onRemove: params.onRemove
		});
		return stripped.changed ? {
			config: {
				...params.cfg,
				channels: {
					...channels,
					[params.channelId]: stripped.value
				}
			},
			changed: true
		} : {
			config: params.cfg,
			changed: false
		};
	}
	const normalized = normalizeChannelConfigEntries({
		cfg: params.cfg,
		channelId: params.channelId,
		normalizeEntry: (entryParams) => {
			const stripped = stripRetiredKeys({
				value: entryParams.entry,
				keys: params.keys,
				pathPrefix: entryParams.pathPrefix,
				recursive: false,
				onRemove: params.onRemove
			});
			return {
				entry: stripped.value,
				changed: stripped.changed
			};
		}
	});
	return {
		config: normalized.config,
		changed: normalized.config !== params.cfg
	};
}
/** Materializes root/default-account inheritance after aliases create streaming. */
function materializeInheritedAccountStreaming(params) {
	const channels = params.cfg.channels;
	const entry = asNullableRecord(channels?.[params.channelId]);
	const accounts = asNullableRecord(entry?.accounts);
	if (!entry || !accounts) return params.cfg;
	const rootStreaming = asNullableRecord(entry.streaming);
	const defaultKey = resolveChannelAccountKey(accounts, "default", params.channelId, (key) => key.trim().toLowerCase());
	let changed = false;
	const nextAccounts = { ...accounts };
	const accountIds = Object.keys(accounts).toSorted((left, right) => left === defaultKey ? -1 : right === defaultKey ? 1 : left.localeCompare(right));
	for (const accountId of accountIds) {
		if (asNullableRecord(params.accountsBefore?.[accountId])?.streaming !== void 0) continue;
		const account = asNullableRecord(nextAccounts[accountId]);
		const created = asNullableRecord(account?.streaming);
		if (!account || !created) continue;
		const defaultStreaming = defaultKey ? asNullableRecord(asNullableRecord(nextAccounts[defaultKey])?.streaming) : null;
		const inherited = accountId === defaultKey ? rootStreaming : defaultStreaming ?? rootStreaming;
		if (!inherited) continue;
		const materialized = asNullableRecord(mergeDeep(inherited, created));
		if (!materialized || isDeepStrictEqual(materialized, created)) continue;
		nextAccounts[accountId] = {
			...account,
			streaming: materialized
		};
		changed = true;
		const sourcePath = accountId !== defaultKey && defaultKey && defaultStreaming ? `channels.${params.channelId}.accounts.${defaultKey}.streaming` : `channels.${params.channelId}.streaming`;
		params.changes.push(`Copied ${sourcePath} into channels.${params.channelId}.accounts.${accountId}.streaming to keep inherited settings while migrating flat streaming keys.`);
	}
	return changed ? {
		...params.cfg,
		channels: {
			...channels,
			[params.channelId]: {
				...entry,
				accounts: nextAccounts
			}
		}
	} : params.cfg;
}
//#endregion
//#region src/config/channel-alias-migration.ts
function buildAliasRuleMessage(params) {
	const { streaming, prefix } = params;
	const native = streaming.resolveNativeTransport !== void 0;
	const flat = [
		...streaming.deliveryOnly ? [] : ["streamMode", "streaming (scalar)"],
		"chunkMode",
		"blockStreaming",
		...streaming.includePreviewChunk ? ["draftChunk"] : [],
		"blockStreamingCoalesce",
		...native ? ["nativeStreaming"] : []
	];
	const nested = [
		...streaming.deliveryOnly ? [] : ["mode"],
		"chunkMode",
		...streaming.includePreviewChunk ? ["preview.chunk"] : [],
		"block.enabled",
		"block.coalesce",
		...native ? ["nativeTransport"] : []
	];
	const prefixedCount = params.root && !streaming.deliveryOnly ? 2 : 1;
	const keys = flat.map((key, index) => index < prefixedCount ? `${prefix}.${key}` : key);
	return `${`${keys.slice(0, -1).join(", ")}, and ${keys.at(-1)}`} are legacy; use ${prefix}.streaming.{${nested.join(",")}}. Run "openclaw doctor --fix".`;
}
function hasLegacyDmAliases(value) {
	const dm = asNullableRecord(asNullableRecord(value)?.dm);
	return dm !== null && (Object.hasOwn(dm, "policy") || Object.hasOwn(dm, "allowFrom"));
}
/**
* Builds the standard channel doctor alias-migration surface from a small spec:
* detection rules (root + accounts), the per-entry matcher, and the config
* normalizer. Channels with additional migrations compose around these pieces.
*/
function defineChannelAliasMigration(spec) {
	const { streaming } = spec;
	const pathPrefix = `channels.${spec.channelId}`;
	const hasLegacyAliases = (value) => {
		if (streaming.deliveryOnly === true) {
			const entry = asNullableRecord(value);
			return entry !== null && (entry.chunkMode !== void 0 || entry.blockStreaming !== void 0 || entry.blockStreamingCoalesce !== void 0);
		}
		return hasLegacyStreamingAliases(value, {
			includePreviewChunk: streaming.includePreviewChunk,
			includeNativeTransport: streaming.resolveNativeTransport !== void 0
		});
	};
	const resolveStreamingOptions = (entry) => ({
		resolvedMode: streaming.resolveMode?.(entry) ?? resolveLegacyAliasStreamingMode(entry, streaming.defaultMode),
		aliasOnlyMode: streaming.absentObjectDefault,
		includePreviewChunk: streaming.includePreviewChunk,
		resolvedNativeTransport: streaming.resolveNativeTransport?.(entry)
	});
	const normalizeChannelConfig = (params) => {
		const changes = params.changes ?? [];
		const channels = params.cfg.channels;
		const entry = asNullableRecord(channels?.[spec.channelId]);
		if (!entry) return {
			config: params.cfg,
			changes
		};
		const accountsBefore = spec.accountStreamingInheritsDefaultAccount ? asNullableRecord(entry.accounts) : null;
		if (streaming.deliveryOnly === true && !hasLegacyAliases(entry) && !hasLegacyAccountStreamingAliases(entry.accounts, hasLegacyAliases) && !(spec.dm?.root && hasLegacyDmAliases(entry)) && !(spec.dm?.accounts && hasLegacyAccountStreamingAliases(entry.accounts, hasLegacyDmAliases))) return {
			config: params.cfg,
			changes
		};
		const result = normalizeLegacyChannelAliases({
			entry,
			pathPrefix,
			changes,
			normalizeDm: spec.dm?.root,
			rootDmPromoteAllowFrom: spec.dm?.rootPromoteAllowFrom,
			normalizeAccountDm: spec.dm?.accounts,
			seedAccountStreamingFromRoot: spec.accountStreamingReplacesRoot,
			resolveStreamingOptions,
			normalizeAccountExtra: spec.normalizeAccountExtra
		});
		if (!result.changed) return {
			config: params.cfg,
			changes
		};
		const config = {
			...params.cfg,
			channels: {
				...channels,
				[spec.channelId]: result.entry
			}
		};
		return {
			config: spec.accountStreamingInheritsDefaultAccount ? materializeInheritedAccountStreaming({
				cfg: config,
				channelId: spec.channelId,
				accountsBefore,
				changes
			}) : config,
			changes
		};
	};
	const legacyConfigRules = [{
		path: ["channels", spec.channelId],
		message: buildAliasRuleMessage({
			streaming,
			prefix: pathPrefix,
			root: true
		}),
		match: hasLegacyAliases
	}, {
		path: [
			"channels",
			spec.channelId,
			"accounts"
		],
		message: buildAliasRuleMessage({
			streaming,
			prefix: `${pathPrefix}.accounts.<id>`,
			root: false
		}),
		match: (value) => hasLegacyAccountStreamingAliases(value, hasLegacyAliases)
	}];
	if (spec.dm?.root) legacyConfigRules.push({
		path: ["channels", spec.channelId],
		message: `${pathPrefix}.dm.policy and ${pathPrefix}.dm.allowFrom are legacy; use ${pathPrefix}.dmPolicy and ${pathPrefix}.allowFrom. Run "openclaw doctor --fix".`,
		match: hasLegacyDmAliases
	});
	if (spec.dm?.accounts) legacyConfigRules.push({
		path: [
			"channels",
			spec.channelId,
			"accounts"
		],
		message: `${pathPrefix}.accounts.<id>.dm.policy and dm.allowFrom are legacy; use ${pathPrefix}.accounts.<id>.dmPolicy and allowFrom. Run "openclaw doctor --fix".`,
		match: (value) => hasLegacyAccountStreamingAliases(value, hasLegacyDmAliases)
	});
	return {
		legacyConfigRules,
		hasLegacyAliases,
		normalizeChannelConfig
	};
}
//#endregion
//#region src/config/legacy-private-network-migration.ts
/** Detects the retired flat `allowPrivateNetwork` key before doctor migration. */
function hasLegacyFlatAllowPrivateNetworkAlias(value) {
	const entry = asNullableRecord(value);
	return Boolean(entry && Object.hasOwn(entry, "allowPrivateNetwork"));
}
/** Moves flat private-network config into `network.dangerouslyAllowPrivateNetwork`. */
function migrateLegacyFlatAllowPrivateNetworkAlias(params) {
	if (!hasLegacyFlatAllowPrivateNetworkAlias(params.entry)) return {
		entry: params.entry,
		changed: false
	};
	const legacyAllowPrivateNetwork = params.entry.allowPrivateNetwork;
	const currentNetworkRecord = asNullableRecord(params.entry.network);
	const currentNetwork = currentNetworkRecord ? { ...currentNetworkRecord } : {};
	const currentDangerousAllowPrivateNetwork = currentNetwork.dangerouslyAllowPrivateNetwork;
	let resolvedDangerousAllowPrivateNetwork = currentDangerousAllowPrivateNetwork;
	if (typeof currentDangerousAllowPrivateNetwork === "boolean") resolvedDangerousAllowPrivateNetwork = currentDangerousAllowPrivateNetwork;
	else if (typeof legacyAllowPrivateNetwork === "boolean") resolvedDangerousAllowPrivateNetwork = legacyAllowPrivateNetwork;
	else if (currentDangerousAllowPrivateNetwork === void 0) resolvedDangerousAllowPrivateNetwork = legacyAllowPrivateNetwork;
	delete currentNetwork.dangerouslyAllowPrivateNetwork;
	if (resolvedDangerousAllowPrivateNetwork !== void 0) currentNetwork.dangerouslyAllowPrivateNetwork = resolvedDangerousAllowPrivateNetwork;
	const nextEntry = { ...params.entry };
	delete nextEntry.allowPrivateNetwork;
	if (Object.keys(currentNetwork).length > 0) nextEntry.network = currentNetwork;
	else delete nextEntry.network;
	params.changes.push(`Moved ${params.pathPrefix}.allowPrivateNetwork → ${params.pathPrefix}.network.dangerouslyAllowPrivateNetwork (${String(resolvedDangerousAllowPrivateNetwork)}).`);
	return {
		entry: nextEntry,
		changed: true
	};
}
function hasLegacyAllowPrivateNetworkInAccounts(value) {
	const accounts = asNullableRecord(value);
	return Boolean(accounts && Object.values(accounts).some((account) => hasLegacyFlatAllowPrivateNetworkAlias(asNullableRecord(account) ?? {})));
}
/** Build doctor rules that migrate legacy private-network aliases for one channel config. */
function createLegacyPrivateNetworkDoctorContract(params) {
	const pathPrefix = `channels.${params.channelKey}`;
	return {
		legacyConfigRules: [{
			path: ["channels", params.channelKey],
			message: `${pathPrefix}.allowPrivateNetwork is legacy; use ${pathPrefix}.network.dangerouslyAllowPrivateNetwork instead. Run "openclaw doctor --fix".`,
			match: (value) => hasLegacyFlatAllowPrivateNetworkAlias(asNullableRecord(value) ?? {})
		}, {
			path: [
				"channels",
				params.channelKey,
				"accounts"
			],
			message: `${pathPrefix}.accounts.<id>.allowPrivateNetwork is legacy; use ${pathPrefix}.accounts.<id>.network.dangerouslyAllowPrivateNetwork instead. Run "openclaw doctor --fix".`,
			match: hasLegacyAllowPrivateNetworkInAccounts
		}],
		normalizeCompatibilityConfig: ({ cfg }) => {
			if (!asNullableRecord(cfg.channels)) return {
				config: cfg,
				changes: []
			};
			return normalizeChannelConfigEntries({
				cfg,
				channelId: params.channelKey,
				normalizeEntry: migrateLegacyFlatAllowPrivateNetworkAlias
			});
		}
	};
}
//#endregion
//#region src/plugin-sdk/runtime-doctor-migrations.ts
/** Collects a channel's root config and object-shaped account overrides in config order. */
function collectChannelAccountScopes(params) {
	const scopes = [];
	const pathSegments = ["channels", params.channelId];
	const channels = asNullableRecord(params.cfg.channels);
	const channel = asNullableRecord(channels?.[params.channelId]);
	if (!channel) return scopes;
	scopes.push({
		prefix: pathSegments.join("."),
		pathSegments,
		account: channel
	});
	const accounts = asNullableRecord(channel.accounts);
	if (!accounts) return scopes;
	for (const [accountId, value] of Object.entries(accounts)) {
		const account = asNullableRecord(value);
		if (account) {
			const accountPathSegments = [
				...pathSegments,
				"accounts",
				accountId
			];
			scopes.push({
				prefix: accountPathSegments.join("."),
				pathSegments: accountPathSegments,
				account
			});
		}
	}
	return scopes;
}
function readKeyMovePath(entry, path, own = true) {
	let current = entry;
	for (const segment of path.slice(0, -1)) {
		const next = asNullableRecord(current[segment]);
		if (!next) return null;
		current = next;
	}
	const key = path.at(-1);
	return key && (own ? Object.hasOwn(current, key) : key in current) ? { value: current[key] } : null;
}
function setKeyMovePath(entry, path, value) {
	const [key, ...rest] = path;
	if (!key) return entry;
	if (rest.length === 0) return {
		...entry,
		[key]: value
	};
	return {
		...entry,
		[key]: setKeyMovePath(asNullableRecord(entry[key]) ?? {}, rest, value)
	};
}
function deleteKeyMovePath(entry, path, pruneEmpty) {
	const [key, ...rest] = path;
	if (!key) return entry;
	const next = { ...entry };
	if (rest.length === 0) {
		delete next[key];
		return next;
	}
	const child = asNullableRecord(entry[key]);
	if (!child) return entry;
	const updatedChild = deleteKeyMovePath(child, rest, pruneEmpty);
	if (pruneEmpty && Object.keys(updatedChild).length === 0) delete next[key];
	else next[key] = updatedChild;
	return next;
}
/** Defines an immutable legacy-key move across fixed or `*`-mapped object paths. */
function defineKeyMoveMigration(params) {
	const visitScopes = (entry, scope, visit, scopePath = []) => {
		const [segment, ...rest] = scope;
		if (!segment) return visit(entry, scopePath);
		if (segment === "*") return Object.entries(entry).some(([key, value]) => {
			const child = asNullableRecord(value);
			return child ? visitScopes(child, rest, visit, [...scopePath, key]) : false;
		});
		const child = asNullableRecord(entry[segment]);
		return child ? visitScopes(child, rest, visit, [...scopePath, segment]) : false;
	};
	const hasLegacy = (value) => {
		const entry = asNullableRecord(value);
		return entry ? visitScopes(entry, params.scope ?? [], (scopeEntry) => {
			const source = readKeyMovePath(scopeEntry, params.from, params.sourceOwn);
			return Boolean(source && (params.match?.(source.value) ?? true));
		}) : false;
	};
	const normalizeScope = (scopeEntry, scopePath, pathPrefix, changes) => {
		const source = readKeyMovePath(scopeEntry, params.from, params.sourceOwn);
		if (!source || !(params.match?.(source.value) ?? true)) return {
			entry: scopeEntry,
			changed: false
		};
		const target = readKeyMovePath(scopeEntry, params.to);
		const mapped = params.map ? params.map(source.value) : { value: source.value };
		const context = {
			sourcePath: [
				pathPrefix,
				...scopePath,
				...params.from
			].join("."),
			targetPath: [
				pathPrefix,
				...scopePath,
				...params.to
			].join("."),
			sourceValue: source.value,
			targetValue: target?.value,
			mappedValue: mapped?.value
		};
		const targetSet = params.targetIsSet?.(target?.value) ?? target?.value !== void 0;
		let updated = scopeEntry;
		if (targetSet) changes.push(params.existingMessage?.(context) ?? `Removed ${context.sourcePath} (${context.targetPath} already set).`);
		else if (mapped) {
			updated = setKeyMovePath(updated, params.to, mapped.value);
			changes.push(params.movedMessage?.(context) ?? `Moved ${context.sourcePath} → ${context.targetPath}.`);
		} else changes.push(params.invalidMessage?.(context) ?? `Removed invalid ${context.sourcePath} value.`);
		return {
			entry: deleteKeyMovePath(updated, params.from, params.pruneEmptySource ?? false),
			changed: true
		};
	};
	const normalizeScopes = (entry, scope, pathPrefix, changes, scopePath = []) => {
		const [segment, ...rest] = scope;
		if (!segment) return normalizeScope(entry, scopePath, pathPrefix, changes);
		let changed = false;
		const updated = { ...entry };
		const keys = segment === "*" ? Object.keys(entry) : [segment];
		for (const key of keys) {
			const child = asNullableRecord(entry[key]);
			if (!child) continue;
			const normalized = normalizeScopes(child, rest, pathPrefix, changes, [...scopePath, key]);
			if (normalized.changed) {
				updated[key] = normalized.entry;
				changed = true;
			}
		}
		return changed ? {
			entry: updated,
			changed: true
		} : {
			entry,
			changed: false
		};
	};
	return {
		hasLegacy,
		normalize: ({ entry, pathPrefix, changes }) => normalizeScopes(entry, params.scope ?? [], pathPrefix, changes)
	};
}
/**
* Defines the repair for channel config parked under `plugins.entries.<id>.config`.
* Channel plugins read `channels.<channelId>` only, but retired rich plugin-entry
* schemas let config UIs park values in the unread plugin-entry location.
*/
function defineStrayPluginEntryConfigMigration(params) {
	const { pluginId, channelId } = params;
	const entryConfigPath = `plugins.entries.${pluginId}.config`;
	const readStrayEntryConfig = (cfg) => {
		const entries = asNullableRecord(asNullableRecord(cfg.plugins)?.entries);
		const config = asNullableRecord(asNullableRecord(entries?.[pluginId])?.config);
		return config && Object.keys(config).length > 0 ? config : null;
	};
	return {
		legacyConfigRule: {
			path: [
				"plugins",
				"entries",
				pluginId,
				"config"
			],
			message: `${entryConfigPath} is not read by the ${channelId} channel; run "openclaw doctor --fix" to move its keys to channels.${channelId}.`,
			match: (value) => {
				const record = asNullableRecord(value);
				return Boolean(record && Object.keys(record).length > 0);
			}
		},
		normalizeConfig: ({ cfg }) => {
			const stray = readStrayEntryConfig(cfg);
			if (!stray) return {
				config: cfg,
				changes: []
			};
			const next = structuredClone(cfg);
			const currentChannel = asNullableRecord(asNullableRecord(next.channels)?.[channelId]) ?? {};
			const staged = [];
			const dropped = [];
			const merged = { ...currentChannel };
			for (const [key, value] of Object.entries(stray)) if (Object.hasOwn(currentChannel, key)) dropped.push(key);
			else {
				merged[key] = value;
				staged.push(key);
			}
			if (!params.validateMergedChannelConfig(merged)) return {
				config: cfg,
				changes: []
			};
			const channels = asNullableRecord(next.channels) ?? {};
			channels[channelId] = merged;
			next.channels = channels;
			const entry = asNullableRecord(asNullableRecord(asNullableRecord(next.plugins)?.entries)?.[pluginId]);
			if (entry) delete entry.config;
			return {
				config: next,
				changes: [...staged.map((key) => `Moved ${entryConfigPath}.${key} to channels.${channelId}.${key}.`), ...dropped.map((key) => `Removed ${entryConfigPath}.${key}; channels.${channelId}.${key} is authoritative.`)]
			};
		}
	};
}
//#endregion
export { uniqueStrings as C, normalizeUniqueStringEntries as S, mergeDeep as _, hasLegacyFlatAllowPrivateNetworkAlias as a, isBlockedObjectKey as b, normalizeChannelAccounts as c, resolveAccountKey as d, DEFAULT_ACCOUNT_ID as f, resolveGlobalSingleton as g, resolveGlobalSet as h, createLegacyPrivateNetworkDoctorContract as i, normalizeChannelConfigEntries as l, pruneMapToMaxSize as m, defineKeyMoveMigration as n, migrateLegacyFlatAllowPrivateNetworkAlias as o, normalizeAccountId as p, defineStrayPluginEntryConfigMigration as r, defineChannelAliasMigration as s, collectChannelAccountScopes as t, stripRetiredChannelKeys as u, isPlainObject as v, hasLegacyAccountStreamingAliases as x, asBoolean as y };
