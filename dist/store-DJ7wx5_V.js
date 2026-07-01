import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString$1, f as normalizeStringifiedOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { i as normalizeHyphenSlug } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { s as writeTextAtomic } from "./json-files-2umMHm0W.js";
import "./agent-scope-CDZXADgT.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey, d as requiresFoldedSessionKeyAliasProof, i as isCronSessionKey, l as parseRawSessionConversationRef, n as isAcpSessionKey, o as normalizeSessionKeyPreservingOpaquePeerIds, s as normalizeSessionPeerId, u as parseThreadSessionSuffix } from "./session-key-utils-C7uT9A4s.js";
import { d as normalizeMainKey, p as resolveAgentIdFromSessionKey, u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { c as resolveDefaultAgentId, n as listAgentIds } from "./agent-scope-config-C3ijpoNo.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-DivrDqxu.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import { t as parseByteSize } from "./parse-bytes-BOhZJPCN.js";
import { t as parseDurationMs } from "./parse-duration-Da6doDTX.js";
import "./config-A41fTHlt.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { i as resolveMainSessionKey, t as canonicalizeMainSessionAlias } from "./main-session-DWI7gPJU.js";
import { a as normalizeDeliveryChannelRoute, i as mergeDeliveryContext, n as deliveryContextFromSession, o as normalizeDeliveryContext, s as normalizeSessionDeliveryFields, t as deliveryContextFromChannelRoute } from "./delivery-context.shared-D36KNc_D.js";
import { n as isInternalNonDeliveryChannel } from "./message-channel-constants-Z0pS5ykd.js";
import { _ as isSessionStoreTempArtifactName, a as resolveSessionFilePath, b as isTrajectorySessionArtifactName, d as resolveStorePath, f as validateSessionId, g as isSessionArchiveArtifactName, h as isPrimarySessionTranscriptFileName, i as resolveExplicitSessionFilePath, m as isCompactionCheckpointTranscriptFileName, p as formatSessionArchiveTimestamp } from "./paths-CHZBIGhF.js";
import { t as emitSessionTranscriptUpdate } from "./transcript-events-BFG5Kqze.js";
import { a as resolveTrajectoryPointerFilePath, i as resolveTrajectoryFilePath } from "./paths-Biq9XkB5.js";
import { a as projectSessionStoreForPersistence, i as isSessionSkillPromptBlobReadable, n as ensureSessionStorePromptBlobsForPersistence, r as hydrateSessionStoreSkillPromptRefs, t as clearSessionSkillPromptRefCache } from "./skill-prompt-blobs-CzsZaj42.js";
import { a as normalizeChannelId, i as listChannelPlugins, n as getLoadedChannelPlugin } from "./registry-Ba1KQQW12.js";
import { i as resolveSessionThreadInfo } from "./session-conversation-BLH0VcFH.js";
import { t as getLoadedChannelPluginForRead } from "./registry-loaded-read-kWBL-Dpo.js";
import { t as extractGeneratedTranscriptSessionId } from "./generated-transcript-session-id-C-WpjhM8.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import { t as resolveConversationLabel } from "./conversation-label-pgUV7Er9.js";
import "./plugins-DnKj2WmH.js";
import { i as normalizeMessageChannel, r as listDeliverableMessageChannels } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
import { i as mergeSessionEntryPreserveActivity, o as normalizeSessionRuntimeModelFields, r as mergeSessionEntry } from "./types-CoDcFuoc.js";
import { n as runQueuedStoreWrite, t as clearStoreWriterQueuesForTest } from "./store-writer-queue-Cs_NM_XG.js";
import "./version-Bsehiavt.js";
import fs from "node:fs";
import path from "node:path";
//#region src/gateway/session-store-key.ts
/** Canonicalize an opaque session key into the agent-scoped store namespace. */
function canonicalizeSessionKeyForAgent(agentId, key) {
	const lowered = normalizeLowercaseStringOrEmpty(key);
	if (lowered === "global" || lowered === "unknown") return lowered;
	const normalized = normalizeSessionKeyPreservingOpaquePeerIds(key);
	if (normalized.startsWith("agent:")) return normalized;
	return `agent:${normalizeAgentId(agentId)}:${normalized}`;
}
function resolveDefaultStoreAgentId(cfg) {
	return normalizeAgentId(resolveDefaultAgentId(cfg));
}
function shouldRemapLegacyDefaultMainAlias(cfg, parsed, options) {
	if (normalizeAgentId(parsed.agentId) !== "main" || listAgentIds(cfg).includes("main")) return false;
	const defaultAgentId = resolveDefaultStoreAgentId(cfg);
	if (options?.storeAgentId && normalizeAgentId(options.storeAgentId) !== defaultAgentId) return false;
	const rest = normalizeLowercaseStringOrEmpty(parsed.rest);
	const mainKey = normalizeMainKey(cfg.session?.mainKey);
	return rest === "main" || rest === mainKey;
}
function resolveParsedSessionStoreKey(cfg, raw, parsed, options) {
	if (!shouldRemapLegacyDefaultMainAlias(cfg, parsed, options)) return {
		agentId: normalizeAgentId(parsed.agentId),
		sessionKey: normalizeSessionKeyPreservingOpaquePeerIds(raw)
	};
	const agentId = resolveDefaultStoreAgentId(cfg);
	return {
		agentId,
		sessionKey: `agent:${agentId}:${normalizeLowercaseStringOrEmpty(parsed.rest)}`
	};
}
/** Resolve any incoming session key into the canonical key used in persisted session stores. */
function resolveSessionStoreKey(params) {
	const raw = normalizeOptionalString$1(params.sessionKey) ?? "";
	if (!raw) return raw;
	const rawLower = normalizeLowercaseStringOrEmpty(raw);
	if (rawLower === "global" || rawLower === "unknown") return rawLower;
	const parsed = parseAgentSessionKey(raw);
	if (parsed) {
		const resolved = resolveParsedSessionStoreKey(params.cfg, raw, parsed, { storeAgentId: params.storeAgentId });
		const canonical = canonicalizeMainSessionAlias({
			cfg: params.cfg,
			agentId: resolved.agentId,
			sessionKey: resolved.sessionKey
		});
		if (canonical !== resolved.sessionKey) return canonical;
		return resolved.sessionKey;
	}
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	const rawMainKey = normalizeMainKey(params.cfg.session?.mainKey);
	if (lowered === "main" || lowered === rawMainKey) return resolveMainSessionKey(params.cfg);
	return canonicalizeSessionKeyForAgent(resolveDefaultStoreAgentId(params.cfg), raw);
}
/** Resolve the agent that owns a canonical session-store key. */
function resolveSessionStoreAgentId(cfg, canonicalKey) {
	if (canonicalKey === "global" || canonicalKey === "unknown") return resolveDefaultStoreAgentId(cfg);
	const parsed = parseAgentSessionKey(canonicalKey);
	if (parsed?.agentId) return normalizeAgentId(parsed.agentId);
	return resolveDefaultStoreAgentId(cfg);
}
/** Resolve a session key for lookup inside a specific agent's store. */
function resolveStoredSessionKeyForAgentStore(params) {
	const raw = normalizeOptionalString$1(params.sessionKey) ?? "";
	if (!raw) return raw;
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (lowered === "global" || lowered === "unknown") return lowered;
	const key = parseAgentSessionKey(raw) ? raw : canonicalizeSessionKeyForAgent(params.agentId, raw);
	return resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: key,
		storeAgentId: params.agentId
	});
}
/** Resolve the owner agent for a stored session key, returning null for global/unknown keys. */
function resolveStoredSessionOwnerAgentId(params) {
	const canonicalKey = resolveStoredSessionKeyForAgentStore(params);
	if (canonicalKey === "global" || canonicalKey === "unknown") return null;
	return resolveSessionStoreAgentId(params.cfg, canonicalKey);
}
/** Canonicalize spawned-by parent references while preserving main-session aliases. */
function canonicalizeSpawnedByForAgent(cfg, agentId, spawnedBy) {
	const raw = normalizeOptionalString$1(spawnedBy) ?? "";
	if (!raw) return;
	const lower = normalizeLowercaseStringOrEmpty(raw);
	if (lower === "global" || lower === "unknown") return lower;
	let result;
	const normalized = normalizeSessionKeyPreservingOpaquePeerIds(raw);
	if (normalized.startsWith("agent:")) result = normalized;
	else result = `agent:${normalizeAgentId(agentId)}:${normalized}`;
	const parsed = parseAgentSessionKey(result);
	return canonicalizeMainSessionAlias({
		cfg,
		agentId: parsed?.agentId ? normalizeAgentId(parsed.agentId) : agentId,
		sessionKey: result
	});
}
//#endregion
//#region src/config/sessions/store-entry.ts
function normalizeStoreSessionKey(sessionKey) {
	return normalizeSessionKeyPreservingOpaquePeerIds(sessionKey);
}
function foldedSessionKeyAliasCandidates(normalizedKey) {
	const aliases = /* @__PURE__ */ new Set();
	const foldedLegacyKey = normalizeLowercaseStringOrEmpty(normalizedKey);
	if (foldedLegacyKey !== normalizedKey) aliases.add(foldedLegacyKey);
	if (requiresFoldedSessionKeyAliasProof(normalizedKey)) {
		const { baseSessionKey, threadId } = parseThreadSessionSuffix(normalizedKey);
		const foldedBaseKey = normalizeLowercaseStringOrEmpty(baseSessionKey);
		if (baseSessionKey && threadId && foldedBaseKey !== baseSessionKey) aliases.add(`${foldedBaseKey}:thread:${threadId}`);
	}
	return [...aliases];
}
/** The case-sensitive room/peer target an entry actually delivers to. Delivery
*  metadata preserves the real opaque id even when the session KEY was lowercased
*  by the bug, so it distinguishes a lowercased artifact from a distinct room. */
function normalizeEntryTarget(value) {
	if (typeof value !== "string") return "";
	const trimmed = value.trim();
	const sigilIndexes = ["!", "#"].map((sigil) => trimmed.indexOf(sigil)).filter((index) => index >= 0);
	if (sigilIndexes.length === 0) return trimmed;
	return trimmed.slice(Math.min(...sigilIndexes));
}
function entryDeliveryTargets(entry) {
	return [
		entry?.deliveryContext?.to,
		entry?.lastTo,
		entry?.origin?.nativeChannelId,
		entry?.origin?.to,
		entry?.groupId
	].map(normalizeEntryTarget).filter(Boolean);
}
function normalizeEntryThreadId(value) {
	if (value == null) return "";
	if (typeof value !== "string" && typeof value !== "number") return "";
	return String(value).trim();
}
function entryThreadId(entry) {
	return normalizeEntryThreadId(entry?.deliveryContext?.threadId ?? entry?.lastThreadId ?? entry?.origin?.threadId);
}
/** Tail-preserved keys like Matrix rooms need delivery-target proof before a
*  folded key is treated as a legacy alias. Segment-preserved legacy keys
*  (Signal groups) keep their old permissive lowercase fallback. */
function isConfirmedLowercasedLegacyAlias(entry, normalizedKey) {
	if (!entry) return false;
	if (!requiresFoldedSessionKeyAliasProof(normalizedKey)) return true;
	const { baseSessionKey, threadId } = parseThreadSessionSuffix(normalizedKey);
	const normalizedBaseKey = baseSessionKey ?? normalizedKey;
	if (!entryDeliveryTargets(entry).some((target) => normalizedBaseKey.includes(target))) return false;
	if (!threadId) return true;
	return entryThreadId(entry) === threadId;
}
function hasMismatchedCaseSensitiveDeliveryProof(entry, normalizedKey) {
	if (!entry || !requiresFoldedSessionKeyAliasProof(normalizedKey)) return false;
	const { baseSessionKey, threadId } = parseThreadSessionSuffix(normalizedKey);
	const normalizedBaseKey = baseSessionKey ?? normalizedKey;
	const targets = entryDeliveryTargets(entry);
	if (targets.length > 0 && !targets.some((target) => normalizedBaseKey.includes(target))) return true;
	const storedThreadId = entryThreadId(entry);
	return Boolean(threadId && storedThreadId && storedThreadId !== threadId);
}
function resolveSessionStoreEntry(params) {
	const trimmedKey = params.sessionKey.trim();
	const normalizedKey = normalizeStoreSessionKey(trimmedKey);
	const foldedLegacyKeys = foldedSessionKeyAliasCandidates(normalizedKey);
	const legacyKeySet = /* @__PURE__ */ new Set();
	if (trimmedKey !== normalizedKey && Object.hasOwn(params.store, trimmedKey) && !hasMismatchedCaseSensitiveDeliveryProof(params.store[trimmedKey], normalizedKey)) legacyKeySet.add(trimmedKey);
	let foldedLegacyEntry;
	let foldedLegacyUpdatedAt = 0;
	for (const foldedLegacyKey of foldedLegacyKeys) {
		if (!Object.hasOwn(params.store, foldedLegacyKey) || !isConfirmedLowercasedLegacyAlias(params.store[foldedLegacyKey], normalizedKey)) continue;
		legacyKeySet.add(foldedLegacyKey);
		const entry = params.store[foldedLegacyKey];
		const updatedAt = entry?.updatedAt ?? 0;
		if (!foldedLegacyEntry || updatedAt > foldedLegacyUpdatedAt) {
			foldedLegacyEntry = entry;
			foldedLegacyUpdatedAt = updatedAt;
		}
	}
	const exactEntry = Object.hasOwn(params.store, normalizedKey) ? params.store[normalizedKey] : void 0;
	const usableExactEntry = hasMismatchedCaseSensitiveDeliveryProof(exactEntry, normalizedKey) ? void 0 : exactEntry;
	const exactKeyWins = requiresFoldedSessionKeyAliasProof(normalizedKey);
	const fallbackLegacyEntry = legacyKeySet.size > 0 && !hasMismatchedCaseSensitiveDeliveryProof(params.store[trimmedKey], normalizedKey) ? params.store[trimmedKey] : void 0;
	let existing = exactKeyWins ? usableExactEntry ?? foldedLegacyEntry ?? fallbackLegacyEntry : void 0;
	let existingUpdatedAt = existing?.updatedAt ?? 0;
	if (!exactKeyWins) for (const candidate of [
		usableExactEntry,
		foldedLegacyEntry,
		fallbackLegacyEntry
	]) {
		const candidateUpdatedAt = candidate?.updatedAt ?? 0;
		if (candidate && (!existing || candidateUpdatedAt > existingUpdatedAt)) {
			existing = candidate;
			existingUpdatedAt = candidateUpdatedAt;
		}
	}
	for (const [candidateKey, candidateEntry] of Object.entries(params.store)) {
		if (candidateKey === normalizedKey) continue;
		if (normalizeStoreSessionKey(candidateKey) !== normalizedKey) continue;
		if (hasMismatchedCaseSensitiveDeliveryProof(candidateEntry, normalizedKey)) continue;
		legacyKeySet.add(candidateKey);
		const candidateUpdatedAt = candidateEntry?.updatedAt ?? 0;
		if (!existing || candidateUpdatedAt > existingUpdatedAt) {
			existing = candidateEntry;
			existingUpdatedAt = candidateUpdatedAt;
		}
	}
	return {
		normalizedKey,
		existing,
		legacyKeys: [...legacyKeySet]
	};
}
//#endregion
//#region src/config/cache-utils.ts
/** Resolves a cache TTL from an env override, falling back unless the override is exact. */
function resolveCacheTtlMs(params) {
	const { envValue, defaultTtlMs } = params;
	if (envValue) {
		const parsed = parseStrictNonNegativeInteger(envValue);
		if (parsed !== void 0) return parsed;
	}
	return defaultTtlMs;
}
/** Returns whether a TTL keeps cache reads and writes active. */
function isCacheEnabled(ttlMs) {
	return ttlMs > 0;
}
function resolveCacheNumeric(value) {
	return typeof value === "function" ? value() : value;
}
function resolvePruneIntervalMs(ttlMs, pruneIntervalMs) {
	if (typeof pruneIntervalMs === "function") return Math.max(0, Math.floor(pruneIntervalMs(ttlMs)));
	if (typeof pruneIntervalMs === "number") return Math.max(0, Math.floor(pruneIntervalMs));
	return ttlMs;
}
function isCacheEntryExpired(storedAt, now, ttlMs) {
	return now - storedAt > ttlMs;
}
/** Creates a small synchronous map cache with dynamic TTLs and explicit pruning hooks. */
function createExpiringMapCache(options) {
	const cache = /* @__PURE__ */ new Map();
	const now = options.clock ?? Date.now;
	let lastPruneAt = 0;
	function getTtlMs() {
		return Math.max(0, Math.floor(resolveCacheNumeric(options.ttlMs)));
	}
	function maybePruneExpiredEntries(nowMs, ttlMs) {
		if (!isCacheEnabled(ttlMs)) return;
		if (nowMs - lastPruneAt < resolvePruneIntervalMs(ttlMs, options.pruneIntervalMs)) return;
		for (const [key, entry] of cache.entries()) if (isCacheEntryExpired(entry.storedAt, nowMs, ttlMs)) cache.delete(key);
		lastPruneAt = nowMs;
	}
	return {
		get: (key) => {
			const ttlMs = getTtlMs();
			if (!isCacheEnabled(ttlMs)) return;
			const nowMs = now();
			maybePruneExpiredEntries(nowMs, ttlMs);
			const entry = cache.get(key);
			if (!entry) return;
			if (isCacheEntryExpired(entry.storedAt, nowMs, ttlMs)) {
				cache.delete(key);
				return;
			}
			return entry.value;
		},
		set: (key, value) => {
			const ttlMs = getTtlMs();
			if (!isCacheEnabled(ttlMs)) return;
			const nowMs = now();
			maybePruneExpiredEntries(nowMs, ttlMs);
			cache.set(key, {
				storedAt: nowMs,
				value
			});
		},
		delete: (key) => {
			cache.delete(key);
		},
		clear: () => {
			cache.clear();
			lastPruneAt = 0;
		},
		keys: () => [...cache.keys()],
		size: () => cache.size,
		pruneExpired: () => {
			const ttlMs = getTtlMs();
			if (!isCacheEnabled(ttlMs)) return;
			const nowMs = now();
			for (const [key, entry] of cache.entries()) if (isCacheEntryExpired(entry.storedAt, nowMs, ttlMs)) cache.delete(key);
			lastPruneAt = nowMs;
		}
	};
}
/** Captures the file attributes used by cache invalidation without exposing fs.Stats. */
function getFileStatSnapshot(filePath) {
	try {
		const stats = fs.statSync(filePath);
		return {
			mtimeMs: stats.mtimeMs,
			sizeBytes: stats.size
		};
	} catch {
		return;
	}
}
//#endregion
//#region src/channels/plugins/session-thread-info-loaded.ts
/**
* Loaded-plugin session thread info resolver.
*
* Uses only already loaded channel hooks to resolve thread suffix metadata on hot paths.
*/
function resolveLoadedSessionConversationThreadInfo(sessionKey) {
	const raw = parseRawSessionConversationRef(sessionKey);
	if (!raw) return null;
	const rawId = raw.rawId.trim();
	if (!rawId) return null;
	const resolved = (getLoadedChannelPluginForRead(raw.channel)?.messaging)?.resolveSessionConversation?.({
		kind: raw.kind,
		rawId
	});
	if (!resolved?.id?.trim()) return null;
	const id = resolved.id.trim();
	const threadId = normalizeOptionalString$1(resolved.threadId);
	return {
		baseSessionKey: threadId ? `${raw.prefix}:${id}` : normalizeOptionalString$1(sessionKey),
		threadId
	};
}
/**
* Resolves thread suffix metadata using loaded plugin hooks or generic parsing.
*/
function resolveLoadedSessionThreadInfo(sessionKey) {
	return resolveLoadedSessionConversationThreadInfo(sessionKey) ?? parseThreadSessionSuffix(sessionKey);
}
//#endregion
//#region src/config/sessions/thread-info.ts
/**
* Extract deliveryContext and threadId from a sessionKey.
* Supports generic :thread: suffixes plus plugin-owned thread/session grammars.
*/
function parseSessionThreadInfo(sessionKey) {
	return resolveSessionThreadInfo(sessionKey);
}
function parseSessionThreadInfoFast(sessionKey) {
	return resolveLoadedSessionThreadInfo(sessionKey);
}
//#endregion
//#region src/config/sessions/store-maintenance.ts
const log$2 = createSubsystemLogger("sessions/store");
const DEFAULT_SESSION_PRUNE_AFTER_MS = 720 * 60 * 60 * 1e3;
const DEFAULT_SESSION_MAX_ENTRIES = 500;
const DEFAULT_SESSION_MAINTENANCE_MODE = "enforce";
const DEFAULT_SESSION_DISK_BUDGET_HIGH_WATER_RATIO = .8;
const STRICT_ENTRY_MAINTENANCE_MAX_ENTRIES = 49;
const MIN_BATCHED_ENTRY_MAINTENANCE_SLACK = 25;
const BATCHED_ENTRY_MAINTENANCE_SLACK_RATIO = .1;
function resolvePruneAfterMs(maintenance) {
	const normalized = normalizeStringifiedOptionalString(maintenance?.pruneAfter ?? maintenance?.pruneDays);
	if (!normalized) return DEFAULT_SESSION_PRUNE_AFTER_MS;
	try {
		return parseDurationMs(normalized, { defaultUnit: "d" });
	} catch {
		return DEFAULT_SESSION_PRUNE_AFTER_MS;
	}
}
function resolveResetArchiveRetentionMs(maintenance, pruneAfterMs) {
	const raw = maintenance?.resetArchiveRetention;
	if (raw === false) return null;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return pruneAfterMs;
	try {
		return parseDurationMs(normalized, { defaultUnit: "d" });
	} catch {
		return pruneAfterMs;
	}
}
function resolveMaxDiskBytes(maintenance) {
	const raw = maintenance?.maxDiskBytes;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return null;
	try {
		return parseByteSize(normalized, { defaultUnit: "b" });
	} catch {
		return null;
	}
}
function resolveHighWaterBytes(maintenance, maxDiskBytes) {
	const computeDefault = () => {
		if (maxDiskBytes == null) return null;
		if (maxDiskBytes <= 0) return 0;
		return Math.max(1, Math.min(maxDiskBytes, Math.floor(maxDiskBytes * DEFAULT_SESSION_DISK_BUDGET_HIGH_WATER_RATIO)));
	};
	if (maxDiskBytes == null) return null;
	const raw = maintenance?.highWaterBytes;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return computeDefault();
	try {
		const parsed = parseByteSize(normalized, { defaultUnit: "b" });
		return Math.min(parsed, maxDiskBytes);
	} catch {
		return computeDefault();
	}
}
/**
* Resolve maintenance settings from openclaw.json (`session.maintenance`).
* Falls back to built-in defaults when config is missing or unset.
*/
function resolveMaintenanceConfigFromInput(maintenance) {
	const pruneAfterMs = resolvePruneAfterMs(maintenance);
	const maxDiskBytes = resolveMaxDiskBytes(maintenance);
	return {
		mode: maintenance?.mode ?? DEFAULT_SESSION_MAINTENANCE_MODE,
		pruneAfterMs,
		maxEntries: maintenance?.maxEntries ?? DEFAULT_SESSION_MAX_ENTRIES,
		resetArchiveRetentionMs: resolveResetArchiveRetentionMs(maintenance, pruneAfterMs),
		maxDiskBytes,
		highWaterBytes: resolveHighWaterBytes(maintenance, maxDiskBytes)
	};
}
function resolveSessionEntryMaintenanceHighWater(maxEntries) {
	if (!Number.isSafeInteger(maxEntries) || maxEntries <= 0) return 1;
	if (maxEntries <= STRICT_ENTRY_MAINTENANCE_MAX_ENTRIES) return maxEntries + 1;
	return maxEntries + Math.max(MIN_BATCHED_ENTRY_MAINTENANCE_SLACK, Math.ceil(maxEntries * BATCHED_ENTRY_MAINTENANCE_SLACK_RATIO));
}
function shouldRunSessionEntryMaintenance(params) {
	if (params.force) return true;
	return params.entryCount >= resolveSessionEntryMaintenanceHighWater(params.maxEntries);
}
/**
* Remove entries whose `updatedAt` is older than the configured threshold.
* Entries without `updatedAt` are kept (cannot determine staleness).
* Mutates `store` in-place.
*/
function pruneStaleEntries(store, overrideMaxAgeMs, opts = {}) {
	const maxAgeMs = overrideMaxAgeMs ?? resolveMaintenanceConfigFromInput().pruneAfterMs;
	const cutoffMs = Date.now() - maxAgeMs;
	let pruned = 0;
	for (const [key, entry] of Object.entries(store)) {
		if (shouldPreserveMaintenanceEntry({
			key,
			entry,
			preserveKeys: opts.preserveKeys
		})) continue;
		if (entry?.updatedAt != null && entry.updatedAt < cutoffMs) {
			opts.onPruned?.({
				key,
				entry
			});
			delete store[key];
			pruned++;
		}
	}
	if (pruned > 0 && opts.log !== false) log$2.info("pruned stale session entries", {
		pruned,
		maxAgeMs
	});
	return pruned;
}
const QUOTA_SUSPENSION_CLEANUP_FACTOR = 2;
/**
* Resolves the TTL maintenance patch for one session entry without reading or
* mutating the whole store. Attempt hot paths use this before entry-scoped
* accessor writes so unrelated sessions stay out of the request path.
*/
function resolveQuotaSuspensionEntryMaintenance(params) {
	const suspension = params.entry.quotaSuspension;
	if (!suspension) return {
		patch: null,
		cleared: false
	};
	const ttlMs = params.ttlMs ?? 18e5;
	const cleanupAfterResumeMs = ttlMs * (QUOTA_SUSPENSION_CLEANUP_FACTOR - 1);
	const resumeAtMs = suspension.expectedResumeBy ?? suspension.suspendedAt + ttlMs;
	const cleanupAtMs = resumeAtMs + cleanupAfterResumeMs;
	if (params.now >= cleanupAtMs) return {
		patch: { quotaSuspension: void 0 },
		cleared: true
	};
	if (suspension.state === "suspended" && params.now >= resumeAtMs) return {
		patch: { quotaSuspension: {
			...suspension,
			state: "resuming"
		} },
		resumed: { laneId: suspension.laneId },
		cleared: false
	};
	return {
		patch: null,
		cleared: false
	};
}
function getEntryUpdatedAt$1(entry) {
	return entry?.updatedAt ?? Number.NEGATIVE_INFINITY;
}
function isSyntheticSessionMaintenanceKey(sessionKey) {
	const rest = normalizeLowercaseStringOrEmpty(parseAgentSessionKey(sessionKey)?.rest ?? sessionKey);
	return isSubagentSessionKey(sessionKey) || isAcpSessionKey(sessionKey) || isCronSessionKey(sessionKey) || rest.startsWith("acp-bridge:") || rest.startsWith("hook:") || rest.startsWith("node:") || rest === "heartbeat" || rest.endsWith(":heartbeat") || rest.includes(":heartbeat:");
}
function isTelegramTopicSessionKey(sessionKey) {
	const rest = normalizeLowercaseStringOrEmpty(parseAgentSessionKey(sessionKey)?.rest ?? sessionKey);
	return /^telegram:(?:group|channel|direct|dm):.+:topic:[^:]+$/.test(rest);
}
function isExternalGroupOrChannelSessionKey(sessionKey) {
	const rest = normalizeLowercaseStringOrEmpty(parseAgentSessionKey(sessionKey)?.rest ?? sessionKey);
	return /^[^:]+:(?:group|channel):.+$/.test(rest);
}
function isProtectedSessionMaintenanceEntry(sessionKey, entry) {
	if (isSyntheticSessionMaintenanceKey(sessionKey)) return false;
	if (parseSessionThreadInfoFast(sessionKey).threadId) return true;
	if (isTelegramTopicSessionKey(sessionKey)) return true;
	if (isExternalGroupOrChannelSessionKey(sessionKey)) return true;
	const chatType = normalizeLowercaseStringOrEmpty(entry?.chatType ?? entry?.origin?.chatType);
	return chatType === "group" || chatType === "channel" || chatType === "thread";
}
function shouldPreserveMaintenanceEntry(params) {
	return params.preserveKeys?.has(params.key) === true || isProtectedSessionMaintenanceEntry(params.key, params.entry);
}
function getActiveSessionMaintenanceWarning(params) {
	const activeSessionKey = params.activeSessionKey.trim();
	if (!activeSessionKey) return null;
	const activeEntry = params.store[activeSessionKey];
	if (!activeEntry) return null;
	if (isProtectedSessionMaintenanceEntry(activeSessionKey, activeEntry)) return null;
	const cutoffMs = (params.nowMs ?? Date.now()) - params.pruneAfterMs;
	const wouldPrune = activeEntry.updatedAt != null ? activeEntry.updatedAt < cutoffMs : false;
	const keys = Object.keys(params.store);
	const wouldCap = wouldCapActiveSession({
		store: params.store,
		keys,
		activeEntry,
		activeSessionKey,
		maxEntries: params.maxEntries
	});
	if (!wouldPrune && !wouldCap) return null;
	return {
		activeSessionKey,
		activeUpdatedAt: activeEntry.updatedAt,
		totalEntries: keys.length,
		pruneAfterMs: params.pruneAfterMs,
		maxEntries: params.maxEntries,
		wouldPrune,
		wouldCap
	};
}
function wouldCapActiveSession(params) {
	if (params.keys.length <= params.maxEntries) return false;
	if (params.maxEntries <= 0) return true;
	const protectedCount = params.keys.filter((key) => key !== params.activeSessionKey && isProtectedSessionMaintenanceEntry(key, params.store[key])).length;
	const maxRemovableEntries = Math.max(0, params.maxEntries - protectedCount);
	if (maxRemovableEntries <= 0) return true;
	const activeUpdatedAt = getEntryUpdatedAt$1(params.activeEntry);
	let newerOrTieBeforeActive = 0;
	let seenActive = false;
	for (const key of params.keys) {
		if (key === params.activeSessionKey) {
			seenActive = true;
			continue;
		}
		if (isProtectedSessionMaintenanceEntry(key, params.store[key])) continue;
		const entryUpdatedAt = getEntryUpdatedAt$1(params.store[key]);
		if (entryUpdatedAt > activeUpdatedAt || !seenActive && entryUpdatedAt === activeUpdatedAt) {
			newerOrTieBeforeActive++;
			if (newerOrTieBeforeActive >= maxRemovableEntries) return true;
		}
	}
	return false;
}
/**
* Cap the store to the N most recently updated entries.
* Entries without `updatedAt` are sorted last (removed first when over limit).
* Mutates `store` in-place.
*/
function capEntryCount(store, overrideMax, opts = {}) {
	const maxEntries = overrideMax ?? resolveMaintenanceConfigFromInput().maxEntries;
	const preservedCount = Object.entries(store).filter(([key, entry]) => shouldPreserveMaintenanceEntry({
		key,
		entry,
		preserveKeys: opts.preserveKeys
	})).length;
	const maxRemovableEntries = Math.max(0, maxEntries - preservedCount);
	const keys = Object.keys(store).filter((key) => !shouldPreserveMaintenanceEntry({
		key,
		entry: store[key],
		preserveKeys: opts.preserveKeys
	}));
	if (keys.length <= maxRemovableEntries) return 0;
	const toRemove = keys.toSorted((a, b) => {
		const aTime = getEntryUpdatedAt$1(store[a]);
		return getEntryUpdatedAt$1(store[b]) - aTime;
	}).slice(maxRemovableEntries);
	for (const key of toRemove) {
		const entry = store[key];
		if (entry) opts.onCapped?.({
			key,
			entry
		});
		delete store[key];
	}
	if (opts.log !== false) log$2.info("capped session entry count", {
		removed: toRemove.length,
		maxEntries
	});
	return toRemove.length;
}
//#endregion
//#region src/config/sessions/disk-budget.ts
const NOOP_LOGGER = {
	warn: () => {},
	info: () => {}
};
function canonicalizePathForComparison(filePath) {
	const resolved = path.resolve(filePath);
	try {
		return fs.realpathSync(resolved);
	} catch {
		return resolved;
	}
}
function measureStoreBytes(store) {
	return Buffer.byteLength(JSON.stringify(store, null, 2), "utf-8");
}
function measureStoreEntryChunkBytes(key, entry) {
	const singleEntryStore = JSON.stringify({ [key]: entry }, null, 2);
	if (!singleEntryStore.startsWith("{\n") || !singleEntryStore.endsWith("\n}")) return measureStoreBytes({ [key]: entry }) - 4;
	const chunk = singleEntryStore.slice(2, -2);
	return Buffer.byteLength(chunk, "utf-8");
}
function buildStoreEntryChunkSizeMap(store) {
	const out = /* @__PURE__ */ new Map();
	for (const [key, entry] of Object.entries(store)) out.set(key, measureStoreEntryChunkBytes(key, entry));
	return out;
}
function resolveProjectedPromptBlobHash(entry) {
	const ref = entry?.skillsSnapshot?.promptRef;
	return ref?.algorithm === "sha256" && typeof ref.hash === "string" ? ref.hash : void 0;
}
function buildProjectedPromptBlobRefCounts(store) {
	const counts = /* @__PURE__ */ new Map();
	for (const entry of Object.values(store)) {
		const hash = resolveProjectedPromptBlobHash(entry);
		if (!hash) continue;
		counts.set(hash, (counts.get(hash) ?? 0) + 1);
	}
	return counts;
}
function getEntryUpdatedAt(entry) {
	if (!entry) return 0;
	const updatedAt = entry.updatedAt;
	return Number.isFinite(updatedAt) ? updatedAt : 0;
}
function buildSessionIdRefCounts(store) {
	const counts = /* @__PURE__ */ new Map();
	for (const entry of Object.values(store)) {
		const sessionId = entry?.sessionId;
		if (!sessionId) continue;
		counts.set(sessionId, (counts.get(sessionId) ?? 0) + 1);
	}
	return counts;
}
function resolveSessionTranscriptPathForEntry(params) {
	if (!params.entry.sessionId) return null;
	try {
		const resolved = resolveSessionFilePath(params.entry.sessionId, params.entry, { sessionsDir: params.sessionsDir });
		const resolvedSessionsDir = canonicalizePathForComparison(params.sessionsDir);
		const resolvedPath = canonicalizePathForComparison(resolved);
		const relative = path.relative(resolvedSessionsDir, resolvedPath);
		if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return null;
		return resolvedPath;
	} catch {
		return null;
	}
}
function resolveSessionArtifactPathsForEntry(params) {
	const transcriptPath = resolveSessionTranscriptPathForEntry(params);
	if (!transcriptPath) return [];
	const paths = [transcriptPath];
	if (params.entry.sessionId) {
		paths.push(resolveTrajectoryPointerFilePath(transcriptPath));
		paths.push(resolveTrajectoryFilePath({
			env: {},
			sessionFile: transcriptPath,
			sessionId: params.entry.sessionId
		}));
	}
	return paths;
}
function resolveSessionArtifactCanonicalPathsForEntry(params) {
	return resolveSessionArtifactPathsForEntry(params).map(canonicalizePathForComparison);
}
function resolveReferencedSessionArtifactPaths(params) {
	const referenced = /* @__PURE__ */ new Set();
	const resolvedSessionsDir = canonicalizePathForComparison(params.sessionsDir);
	for (const entry of Object.values(params.store)) {
		for (const resolved of resolveSessionArtifactCanonicalPathsForEntry({
			sessionsDir: params.sessionsDir,
			entry
		})) referenced.add(resolved);
		for (const checkpoint of entry.compactionCheckpoints ?? []) {
			const checkpointFiles = [checkpoint.preCompaction.sessionFile?.trim(), checkpoint.postCompaction.sessionFile?.trim()].filter((filePath) => Boolean(filePath));
			for (const checkpointFile of checkpointFiles) {
				const resolvedCheckpointPath = canonicalizePathForComparison(checkpointFile);
				const relative = path.relative(resolvedSessionsDir, resolvedCheckpointPath);
				if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) referenced.add(resolvedCheckpointPath);
			}
		}
	}
	return referenced;
}
const SESSIONS_DIR_STAT_CONCURRENCY = 8;
async function readSessionsDirFiles(sessionsDir) {
	const { results } = await runTasksWithConcurrency({
		tasks: (await fs.promises.readdir(sessionsDir, { withFileTypes: true }).catch(() => [])).filter((dirent) => dirent.isFile()).map((dirent) => async () => {
			const filePath = path.join(sessionsDir, dirent.name);
			const stat = await fs.promises.stat(filePath).catch(() => null);
			if (!stat?.isFile()) return null;
			return {
				path: filePath,
				canonicalPath: canonicalizePathForComparison(filePath),
				name: dirent.name,
				size: stat.size,
				mtimeMs: stat.mtimeMs
			};
		}),
		limit: SESSIONS_DIR_STAT_CONCURRENCY
	});
	return results.filter((file) => Boolean(file));
}
async function readSessionPromptBlobFiles(sessionsDir) {
	const root = path.join(sessionsDir, "skills-prompts", "sha256");
	const prefixEntries = await fs.promises.readdir(root, { withFileTypes: true }).catch(() => []);
	const files = [];
	for (const prefixEntry of prefixEntries) {
		if (!prefixEntry.isDirectory() || !/^[a-f0-9]{2}$/u.test(prefixEntry.name)) continue;
		const prefixDir = path.join(root, prefixEntry.name);
		const blobEntries = await fs.promises.readdir(prefixDir, { withFileTypes: true }).catch(() => []);
		for (const blobEntry of blobEntries) {
			if (!blobEntry.isFile() || !/^[a-f0-9]{64}\.txt$/u.test(blobEntry.name) && !isSessionPromptBlobTempArtifactName(blobEntry.name)) continue;
			const filePath = path.join(prefixDir, blobEntry.name);
			const stat = await fs.promises.stat(filePath).catch(() => null);
			if (!stat?.isFile()) continue;
			files.push({
				path: filePath,
				canonicalPath: canonicalizePathForComparison(filePath),
				name: blobEntry.name,
				size: stat.size,
				mtimeMs: stat.mtimeMs
			});
		}
	}
	return files;
}
function resolvePromptBlobFileHash(file) {
	return /^[a-f0-9]{64}\.txt$/u.test(file.name) ? file.name.slice(0, -4) : void 0;
}
function isSessionPromptBlobTempArtifactName(name) {
	return /^[a-f0-9]{64}\.txt\.(?:\d+\.)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.tmp$/u.test(name);
}
function isUnreferencedSessionArtifactFile(file, referencedPaths) {
	if (referencedPaths.has(file.canonicalPath)) return false;
	return isCompactionCheckpointTranscriptFileName(file.name) || isTrajectorySessionArtifactName(file.name) || isPrimarySessionTranscriptFileName(file.name);
}
const SESSION_STORE_TEMP_STALE_MS = 300 * 1e3;
const SESSION_PROMPT_BLOB_UNREFERENCED_GRACE_MS = SESSION_STORE_TEMP_STALE_MS;
function isUnreferencedPromptBlobFileRemovable(file, projectedPromptBlobRefCounts, cutoffMs) {
	if (file.mtimeMs > cutoffMs) return false;
	const hash = resolvePromptBlobFileHash(file);
	return hash ? !projectedPromptBlobRefCounts.has(hash) : false;
}
function isPromptBlobArtifactRemovable(file, projectedPromptBlobRefCounts, promptBlobCutoffMs, tempCutoffMs) {
	if (isSessionPromptBlobTempArtifactName(file.name)) return file.mtimeMs <= tempCutoffMs;
	return isUnreferencedPromptBlobFileRemovable(file, projectedPromptBlobRefCounts, promptBlobCutoffMs);
}
function isDiskBudgetRemovableSessionFile(file, referencedPaths, tempStaleCutoffMs, storeBasename) {
	if (isSessionStoreTempArtifactName(file.name, storeBasename)) return file.mtimeMs <= tempStaleCutoffMs;
	return isSessionArchiveArtifactName(file.name) || isUnreferencedSessionArtifactFile(file, referencedPaths);
}
async function removeFileIfExists(filePath) {
	const stat = await fs.promises.stat(filePath).catch(() => null);
	if (!stat?.isFile()) return 0;
	await fs.promises.rm(filePath, { force: true }).catch(() => void 0);
	return stat.size;
}
async function removeFileForBudget(params) {
	const resolvedPath = path.resolve(params.filePath);
	const canonicalPath = params.canonicalPath ?? canonicalizePathForComparison(resolvedPath);
	if (params.dryRun) {
		if (params.simulatedRemovedPaths.has(canonicalPath)) return 0;
		const size = params.fileSizesByPath.get(canonicalPath) ?? 0;
		if (size <= 0) return 0;
		params.simulatedRemovedPaths.add(canonicalPath);
		params.onRemovedPath?.(canonicalPath);
		return size;
	}
	const size = await removeFileIfExists(resolvedPath);
	if (size > 0) params.onRemovedPath?.(canonicalPath);
	return size;
}
async function removePromptBlobFileForBudget(params) {
	let file = params.file;
	if (!params.dryRun) {
		const stat = await fs.promises.stat(file.path).catch(() => null);
		if (!stat?.isFile()) return 0;
		file = {
			...file,
			size: stat.size,
			mtimeMs: stat.mtimeMs
		};
	}
	if (!isPromptBlobArtifactRemovable(file, params.projectedPromptBlobRefCounts, params.promptBlobCutoffMs, params.tempCutoffMs)) return 0;
	return await removeFileForBudget({
		filePath: file.path,
		canonicalPath: file.canonicalPath,
		dryRun: params.dryRun,
		fileSizesByPath: params.fileSizesByPath,
		simulatedRemovedPaths: params.simulatedRemovedPaths,
		onRemovedPath: params.onRemovedPath
	});
}
async function pruneUnreferencedSessionArtifacts(params) {
	const olderThanMs = Number.isFinite(params.olderThanMs) && params.olderThanMs > 0 ? params.olderThanMs : 0;
	const sessionsDir = path.dirname(params.storePath);
	const files = await readSessionsDirFiles(sessionsDir);
	const promptBlobFiles = await readSessionPromptBlobFiles(sessionsDir);
	const fileSizesByPath = new Map([...files, ...promptBlobFiles].map((file) => [file.canonicalPath, file.size]));
	const simulatedRemovedPaths = /* @__PURE__ */ new Set();
	const referencedPaths = resolveReferencedSessionArtifactPaths({
		sessionsDir,
		store: params.store
	});
	const projectedPromptBlobRefCounts = buildProjectedPromptBlobRefCounts(projectSessionStoreForPersistence({
		storePath: params.storePath,
		store: params.store
	}).store);
	const cutoffMs = Date.now() - olderThanMs;
	const tempCutoffMs = Date.now() - SESSION_STORE_TEMP_STALE_MS;
	const promptBlobCutoffMs = Date.now() - Math.max(olderThanMs, SESSION_PROMPT_BLOB_UNREFERENCED_GRACE_MS);
	const storeBasename = path.basename(params.storePath);
	const removableStoreFiles = files.filter((file) => {
		if (params.excludeCanonicalPaths?.has(file.canonicalPath)) return false;
		if (isSessionStoreTempArtifactName(file.name, storeBasename)) return file.mtimeMs <= tempCutoffMs;
		return file.mtimeMs <= cutoffMs && isUnreferencedSessionArtifactFile(file, referencedPaths);
	});
	const removablePromptBlobFiles = promptBlobFiles.filter((file) => {
		if (params.excludeCanonicalPaths?.has(file.canonicalPath)) return false;
		return isPromptBlobArtifactRemovable(file, projectedPromptBlobRefCounts, promptBlobCutoffMs, tempCutoffMs);
	});
	const removableFiles = [...removableStoreFiles.map((file) => ({
		kind: "store",
		file
	})), ...removablePromptBlobFiles.map((file) => ({
		kind: "promptBlob",
		file
	}))].filter((file) => {
		return !params.excludeCanonicalPaths?.has(file.file.canonicalPath);
	}).toSorted((a, b) => a.file.mtimeMs - b.file.mtimeMs);
	let removedFiles = 0;
	let freedBytes = 0;
	const dryRun = params.dryRun === true;
	for (const item of removableFiles) {
		const deletedBytes = item.kind === "promptBlob" ? await removePromptBlobFileForBudget({
			file: item.file,
			projectedPromptBlobRefCounts,
			promptBlobCutoffMs,
			tempCutoffMs,
			dryRun,
			fileSizesByPath,
			simulatedRemovedPaths
		}) : await removeFileForBudget({
			filePath: item.file.path,
			canonicalPath: item.file.canonicalPath,
			dryRun,
			fileSizesByPath,
			simulatedRemovedPaths
		});
		if (deletedBytes <= 0) continue;
		removedFiles += 1;
		freedBytes += deletedBytes;
	}
	return {
		scannedFiles: files.length + promptBlobFiles.length,
		removedFiles,
		freedBytes,
		olderThanMs
	};
}
async function enforceSessionDiskBudget(params) {
	const maxBytes = params.maintenance.maxDiskBytes;
	const highWaterBytes = params.maintenance.highWaterBytes;
	if (maxBytes == null || highWaterBytes == null) return null;
	const log = params.log ?? NOOP_LOGGER;
	const dryRun = params.dryRun === true;
	const sessionsDir = path.dirname(params.storePath);
	const files = await readSessionsDirFiles(sessionsDir);
	const promptBlobFiles = await readSessionPromptBlobFiles(sessionsDir);
	const fileSizesByPath = new Map([...files, ...promptBlobFiles].map((file) => [file.canonicalPath, file.size]));
	const simulatedRemovedPaths = /* @__PURE__ */ new Set();
	const resolvedStorePath = canonicalizePathForComparison(params.storePath);
	const storeFile = files.find((file) => file.canonicalPath === resolvedStorePath);
	const projectedPersistence = projectSessionStoreForPersistence({
		storePath: params.storePath,
		store: params.store
	});
	const projectedStore = projectedPersistence.store;
	let projectedStoreBytes = measureStoreBytes(projectedStore);
	const projectedPromptBlobBytesByHash = /* @__PURE__ */ new Map();
	const existingPromptBlobFilesByHash = /* @__PURE__ */ new Map();
	for (const file of promptBlobFiles) {
		const hash = resolvePromptBlobFileHash(file);
		if (hash) existingPromptBlobFilesByHash.set(hash, file);
	}
	for (const [hash, blob] of projectedPersistence.promptBlobs) if (!existingPromptBlobFilesByHash.has(hash)) projectedPromptBlobBytesByHash.set(hash, blob.ref.bytes);
	const projectedPromptBlobRefCounts = buildProjectedPromptBlobRefCounts(projectedStore);
	const projectedPromptBlobBytes = [...projectedPromptBlobBytesByHash.values()].reduce((sum, bytes) => sum + bytes, 0);
	let total = [...files, ...promptBlobFiles].reduce((sum, file) => sum + file.size, 0) - (storeFile?.size ?? 0) + projectedStoreBytes + projectedPromptBlobBytes;
	const totalBefore = total;
	if (total <= maxBytes) return {
		totalBytesBefore: totalBefore,
		totalBytesAfter: total,
		removedFiles: 0,
		removedEntries: 0,
		freedBytes: 0,
		maxBytes,
		highWaterBytes,
		overBudget: false
	};
	if (params.warnOnly) {
		log.warn("session disk budget exceeded (warn-only mode)", {
			sessionsDir,
			totalBytes: total,
			maxBytes,
			highWaterBytes
		});
		return {
			totalBytesBefore: totalBefore,
			totalBytesAfter: total,
			removedFiles: 0,
			removedEntries: 0,
			freedBytes: 0,
			maxBytes,
			highWaterBytes,
			overBudget: true
		};
	}
	let removedFiles = 0;
	let removedEntries = 0;
	let freedBytes = 0;
	const referencedPaths = resolveReferencedSessionArtifactPaths({
		sessionsDir,
		store: params.store
	});
	const tempStaleCutoffMs = Date.now() - SESSION_STORE_TEMP_STALE_MS;
	const promptBlobOrphanCutoffMs = Date.now() - SESSION_PROMPT_BLOB_UNREFERENCED_GRACE_MS;
	const storeBasename = path.basename(params.storePath);
	const unreferencedPromptBlobQueue = promptBlobFiles.filter((file) => {
		return isPromptBlobArtifactRemovable(file, projectedPromptBlobRefCounts, promptBlobOrphanCutoffMs, tempStaleCutoffMs);
	}).toSorted((a, b) => a.mtimeMs - b.mtimeMs);
	for (const file of unreferencedPromptBlobQueue) {
		if (total <= highWaterBytes) break;
		const deletedBytes = await removePromptBlobFileForBudget({
			file,
			projectedPromptBlobRefCounts,
			promptBlobCutoffMs: promptBlobOrphanCutoffMs,
			tempCutoffMs: tempStaleCutoffMs,
			dryRun,
			fileSizesByPath,
			simulatedRemovedPaths,
			onRemovedPath: params.onRemoveFile
		});
		if (deletedBytes <= 0) continue;
		total -= deletedBytes;
		freedBytes += deletedBytes;
		removedFiles += 1;
	}
	const removableFileQueue = files.filter((file) => isDiskBudgetRemovableSessionFile(file, referencedPaths, tempStaleCutoffMs, storeBasename)).toSorted((a, b) => a.mtimeMs - b.mtimeMs);
	for (const file of removableFileQueue) {
		if (total <= highWaterBytes) break;
		const deletedBytes = await removeFileForBudget({
			filePath: file.path,
			canonicalPath: file.canonicalPath,
			dryRun,
			fileSizesByPath,
			simulatedRemovedPaths,
			onRemovedPath: params.onRemoveFile
		});
		if (deletedBytes <= 0) continue;
		total -= deletedBytes;
		freedBytes += deletedBytes;
		removedFiles += 1;
	}
	if (total > highWaterBytes) {
		const activeSessionKey = normalizeOptionalLowercaseString(params.activeSessionKey);
		const sessionIdRefCounts = buildSessionIdRefCounts(params.store);
		const entryChunkBytesByKey = buildStoreEntryChunkSizeMap(projectedStore);
		const keys = Object.keys(params.store).toSorted((a, b) => {
			return getEntryUpdatedAt(params.store[a]) - getEntryUpdatedAt(params.store[b]);
		});
		for (const key of keys) {
			if (total <= highWaterBytes) break;
			if (activeSessionKey && normalizeLowercaseStringOrEmpty(key) === activeSessionKey) continue;
			const entry = params.store[key];
			if (!entry) continue;
			if (shouldPreserveMaintenanceEntry({
				key,
				entry,
				preserveKeys: params.preserveKeys
			})) continue;
			const previousProjectedBytes = projectedStoreBytes;
			const projectedEntry = projectedStore[key];
			const promptBlobHash = resolveProjectedPromptBlobHash(projectedEntry);
			delete params.store[key];
			delete projectedStore[key];
			const chunkBytes = entryChunkBytesByKey.get(key);
			entryChunkBytesByKey.delete(key);
			if (typeof chunkBytes === "number" && Number.isFinite(chunkBytes) && chunkBytes >= 0) projectedStoreBytes = Math.max(2, projectedStoreBytes - (chunkBytes + 2));
			else projectedStoreBytes = measureStoreBytes(projectedStore);
			total += projectedStoreBytes - previousProjectedBytes;
			if (promptBlobHash) {
				const nextRefCount = (projectedPromptBlobRefCounts.get(promptBlobHash) ?? 1) - 1;
				if (nextRefCount > 0) projectedPromptBlobRefCounts.set(promptBlobHash, nextRefCount);
				else {
					projectedPromptBlobRefCounts.delete(promptBlobHash);
					const virtualBlobBytes = projectedPromptBlobBytesByHash.get(promptBlobHash) ?? 0;
					if (virtualBlobBytes > 0) total -= virtualBlobBytes;
					else {
						const blobFile = existingPromptBlobFilesByHash.get(promptBlobHash);
						if (blobFile && isPromptBlobArtifactRemovable(blobFile, projectedPromptBlobRefCounts, promptBlobOrphanCutoffMs, tempStaleCutoffMs)) {
							const deletedBytes = await removePromptBlobFileForBudget({
								file: blobFile,
								projectedPromptBlobRefCounts,
								promptBlobCutoffMs: promptBlobOrphanCutoffMs,
								tempCutoffMs: tempStaleCutoffMs,
								dryRun,
								fileSizesByPath,
								simulatedRemovedPaths,
								onRemovedPath: params.onRemoveFile
							});
							if (deletedBytes > 0) {
								total -= deletedBytes;
								freedBytes += deletedBytes;
								removedFiles += 1;
							}
						}
					}
				}
			}
			removedEntries += 1;
			const sessionId = entry.sessionId;
			if (!sessionId) continue;
			const nextRefCount = (sessionIdRefCounts.get(sessionId) ?? 1) - 1;
			if (nextRefCount > 0) {
				sessionIdRefCounts.set(sessionId, nextRefCount);
				continue;
			}
			sessionIdRefCounts.delete(sessionId);
			for (const artifactPath of resolveSessionArtifactPathsForEntry({
				sessionsDir,
				entry
			})) {
				const deletedBytes = await removeFileForBudget({
					filePath: artifactPath,
					dryRun,
					fileSizesByPath,
					simulatedRemovedPaths,
					onRemovedPath: params.onRemoveFile
				});
				if (deletedBytes <= 0) continue;
				total -= deletedBytes;
				freedBytes += deletedBytes;
				removedFiles += 1;
			}
		}
	}
	if (!dryRun) {
		if (total > highWaterBytes) log.warn("session disk budget still above high-water target after cleanup", {
			sessionsDir,
			totalBytes: total,
			maxBytes,
			highWaterBytes,
			removedFiles,
			removedEntries
		});
		else if (removedFiles > 0 || removedEntries > 0) log.info("applied session disk budget cleanup", {
			sessionsDir,
			totalBytesBefore: totalBefore,
			totalBytesAfter: total,
			maxBytes,
			highWaterBytes,
			removedFiles,
			removedEntries
		});
	}
	return {
		totalBytesBefore: totalBefore,
		totalBytesAfter: total,
		removedFiles,
		removedEntries,
		freedBytes,
		maxBytes,
		highWaterBytes,
		overBudget: true
	};
}
//#endregion
//#region src/config/sessions/group.ts
const getGroupSurfaces = () => new Set([...listDeliverableMessageChannels(), "webchat"]);
function resolveLegacyGroupSessionKey(ctx) {
	for (const plugin of listChannelPlugins()) {
		const resolved = plugin.messaging?.resolveLegacyGroupSessionKey?.(ctx);
		if (resolved) return resolved;
	}
	return null;
}
function normalizeGroupLabel(raw) {
	return normalizeHyphenSlug(raw);
}
function resolveOriginatingGroupTargetId(params) {
	const target = normalizeOptionalString$1(params.ctx.OriginatingTo ?? params.ctx.To) ?? "";
	if (!target) return null;
	const parts = target.split(":").filter(Boolean);
	if (parts.length < 2) return null;
	const head = normalizeLowercaseStringOrEmpty(parts[0]);
	const second = normalizeOptionalLowercaseString(parts[1]);
	if ((second === "group" || second === "channel") && (head === params.provider || getGroupSurfaces().has(head))) return parts.slice(2).join(":") || null;
	if (head === params.provider || head === "chat" || head === "room" || head === "group") return parts.slice(1).join(":") || null;
	if (head === "channel") return parts.slice(1).join(":") || null;
	return null;
}
function shortenGroupId(value) {
	const trimmed = normalizeOptionalString$1(value) ?? "";
	if (!trimmed) return "";
	if (trimmed.length <= 14) return trimmed;
	return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
}
/** Builds a compact display label for group sessions from channel metadata or ids. */
function buildGroupDisplayName(params) {
	const providerKey = normalizeOptionalLowercaseString(params.provider) ?? "group";
	const groupChannel = normalizeOptionalString$1(params.groupChannel);
	const space = normalizeOptionalString$1(params.space);
	const subject = normalizeOptionalString$1(params.subject);
	const detail = (groupChannel && space ? `${space}${groupChannel.startsWith("#") ? "" : "#"}${groupChannel}` : groupChannel || subject || space || "") || "";
	const fallbackId = normalizeOptionalString$1(params.id) ?? params.key;
	const rawLabel = detail || fallbackId;
	let token = normalizeGroupLabel(rawLabel);
	if (!token) token = normalizeGroupLabel(shortenGroupId(rawLabel));
	if (!params.groupChannel && token.startsWith("#")) token = token.replace(/^#+/, "");
	if (token && !/^[@#]/.test(token) && !token.startsWith("g-") && !token.includes("#")) token = `g-${token}`;
	return token ? `${providerKey}:${token}` : providerKey;
}
/**
* Resolves channel/group chat context into the persisted group session key.
*
* Provider-prefixed ids use channel-owned normalization, while legacy plugin resolvers remain a
* fallback for older channel surfaces that cannot yet express the generic route shape.
*/
function resolveGroupSessionKey(ctx) {
	const from = normalizeOptionalString$1(ctx.From) ?? "";
	const chatType = normalizeOptionalLowercaseString(ctx.ChatType);
	const normalizedChatType = chatType === "channel" ? "channel" : chatType === "group" ? "group" : void 0;
	const legacyResolution = resolveLegacyGroupSessionKey(ctx);
	if (!(normalizedChatType === "group" || normalizedChatType === "channel" || from.includes(":group:") || from.includes(":channel:") || legacyResolution !== null)) return null;
	const providerHint = normalizeOptionalLowercaseString(ctx.Provider);
	const parts = from.split(":").filter(Boolean);
	const head = normalizeLowercaseStringOrEmpty(parts[0]);
	const headIsSurface = head ? getGroupSurfaces().has(head) : false;
	if (!headIsSurface && !providerHint && legacyResolution) return legacyResolution;
	const provider = headIsSurface ? head : providerHint ?? legacyResolution?.channel;
	if (!provider) return null;
	const second = normalizeOptionalLowercaseString(parts[1]);
	const secondIsKind = second === "group" || second === "channel";
	const kind = secondIsKind ? second : from.includes(":channel:") || normalizedChatType === "channel" ? "channel" : "group";
	const originatingGroupTargetId = !secondIsKind && normalizedChatType ? resolveOriginatingGroupTargetId({
		ctx,
		provider
	}) : null;
	const finalId = normalizeSessionPeerId({
		channel: provider,
		peerKind: kind,
		peerId: originatingGroupTargetId ? originatingGroupTargetId : headIsSurface ? secondIsKind ? parts.slice(2).join(":") : parts.slice(1).join(":") : from
	});
	if (!finalId) return null;
	return {
		key: `${provider}:${kind}:${finalId}`,
		channel: provider,
		id: finalId,
		chatType: kind === "channel" ? "channel" : "group"
	};
}
//#endregion
//#region src/config/sessions/metadata.ts
function isSystemEventProvider(provider) {
	return provider === "heartbeat" || provider === "cron-event" || provider === "exec-event";
}
const mergeOrigin = (existing, next) => {
	if (!existing && !next) return;
	const merged = existing ? { ...existing } : {};
	const nextProvider = next?.provider;
	const nextIsDeliverableChannel = nextProvider != null && nextProvider !== "webchat" && !isInternalNonDeliveryChannel(nextProvider) && !isSystemEventProvider(nextProvider);
	if (existing != null && nextIsDeliverableChannel && (existing.provider != null && nextProvider !== existing.provider || existing.surface != null && next?.surface != null && next.surface !== existing.surface || existing.accountId != null && next?.accountId != null && next.accountId !== existing.accountId)) {
		delete merged.nativeChannelId;
		delete merged.nativeDirectUserId;
		delete merged.accountId;
		delete merged.threadId;
	}
	if (next?.label) merged.label = next.label;
	if (next?.provider) merged.provider = next.provider;
	if (next?.surface) merged.surface = next.surface;
	if (next?.chatType) merged.chatType = next.chatType;
	if (next?.from) merged.from = next.from;
	if (next?.to) merged.to = next.to;
	if (next?.nativeChannelId) merged.nativeChannelId = next.nativeChannelId;
	if (next?.nativeDirectUserId) merged.nativeDirectUserId = next.nativeDirectUserId;
	if (next?.accountId) merged.accountId = next.accountId;
	if (next?.threadId != null && next.threadId !== "") merged.threadId = next.threadId;
	return Object.keys(merged).length > 0 ? merged : void 0;
};
/** Derives session origin metadata from an inbound message context. */
function deriveSessionOrigin(ctx, opts) {
	if (opts?.skipSystemEventOrigin && isSystemEventProvider(ctx.Provider)) return;
	const label = normalizeOptionalString$1(resolveConversationLabel(ctx));
	const provider = normalizeMessageChannel(typeof ctx.OriginatingChannel === "string" && ctx.OriginatingChannel || ctx.Surface || ctx.Provider);
	const surface = normalizeOptionalLowercaseString(ctx.Surface);
	const chatType = normalizeChatType(ctx.ChatType) ?? void 0;
	const from = normalizeOptionalString$1(ctx.From);
	const to = normalizeOptionalString$1(typeof ctx.OriginatingTo === "string" ? ctx.OriginatingTo : ctx.To);
	const nativeChannelId = normalizeOptionalString$1(ctx.NativeChannelId);
	const nativeDirectUserId = normalizeOptionalString$1(ctx.NativeDirectUserId);
	const accountId = normalizeOptionalString$1(ctx.AccountId);
	const threadId = ctx.MessageThreadId ?? void 0;
	const origin = {};
	if (label) origin.label = label;
	if (provider) origin.provider = provider;
	if (surface) origin.surface = surface;
	if (chatType) origin.chatType = chatType;
	if (from) origin.from = from;
	if (to) origin.to = to;
	if (nativeChannelId) origin.nativeChannelId = nativeChannelId;
	if (nativeDirectUserId) origin.nativeDirectUserId = nativeDirectUserId;
	if (accountId) origin.accountId = accountId;
	if (threadId != null && threadId !== "") origin.threadId = threadId;
	return Object.keys(origin).length > 0 ? origin : void 0;
}
function snapshotSessionOrigin(entry) {
	if (!entry?.origin) return;
	return { ...entry.origin };
}
function deriveGroupSessionPatch(params) {
	const resolution = params.groupResolution ?? resolveGroupSessionKey(params.ctx);
	if (!resolution?.channel) return null;
	const channel = resolution.channel;
	const subject = params.ctx.GroupSubject?.trim();
	const space = params.ctx.GroupSpace?.trim();
	const explicitChannel = params.ctx.GroupChannel?.trim();
	const subjectLooksChannel = Boolean(subject?.startsWith("#"));
	const normalizedChannel = subjectLooksChannel && resolution.chatType !== "channel" ? normalizeChannelId(channel) : null;
	const isChannelProvider = Boolean(normalizedChannel && getLoadedChannelPlugin(normalizedChannel)?.capabilities.chatTypes.includes("channel"));
	const nextGroupChannel = explicitChannel ?? (subjectLooksChannel && subject && (resolution.chatType === "channel" || isChannelProvider) ? subject : void 0);
	const nextSubject = nextGroupChannel ? void 0 : subject;
	const patch = {
		chatType: resolution.chatType ?? "group",
		channel,
		groupId: resolution.id
	};
	if (nextSubject) patch.subject = nextSubject;
	if (nextGroupChannel) patch.groupChannel = nextGroupChannel;
	if (space) patch.space = space;
	const displayName = buildGroupDisplayName({
		provider: channel,
		subject: nextSubject ?? params.existing?.subject,
		groupChannel: nextGroupChannel ?? params.existing?.groupChannel,
		space: space ?? params.existing?.space,
		id: resolution.id,
		key: params.sessionKey
	});
	if (displayName) patch.displayName = displayName;
	return patch;
}
function deriveSessionMetaPatch(params) {
	const groupPatch = deriveGroupSessionPatch(params);
	const origin = deriveSessionOrigin(params.ctx, { skipSystemEventOrigin: params.skipSystemEventOrigin });
	if (!groupPatch && !origin) return null;
	const patch = groupPatch ? { ...groupPatch } : {};
	const mergedOrigin = mergeOrigin(params.existing?.origin, origin);
	if (mergedOrigin) patch.origin = mergedOrigin;
	return Object.keys(patch).length > 0 ? patch : null;
}
//#endregion
//#region src/config/sessions/store-cache.ts
const DEFAULT_SESSION_STORE_TTL_MS = 45e3;
const DEFAULT_SESSION_STORE_SERIALIZED_CACHE_MAX_ENTRIES = 64;
const DEFAULT_SESSION_STORE_SERIALIZED_CACHE_MAX_BYTES = 64 * 1024 * 1024;
const LARGE_SESSION_STORE_STRING_MIN_CHARS = 512;
const LARGE_SESSION_STORE_STRING_MAX_INTERNED = 256;
const SESSION_STORE_CACHE = createExpiringMapCache({ ttlMs: getSessionStoreTtl });
const SESSION_STORE_SNAPSHOT_CACHE = createExpiringMapCache({ ttlMs: getSessionStoreTtl });
const SESSION_STORE_CACHE_VERSION = /* @__PURE__ */ new Map();
const SESSION_STORE_SERIALIZED_CACHE = /* @__PURE__ */ new Map();
const SESSION_STORE_STRING_INTERN_POOL = /* @__PURE__ */ new Map();
const SESSION_STORE_STRING_INTERN_STATS = {
	stored: 0,
	reused: 0,
	skippedSmall: 0,
	skippedFull: 0
};
let sessionStoreSerializedCacheBytes = 0;
function parseNonNegativeInteger(value) {
	const trimmed = value?.trim();
	if (!trimmed) return null;
	return parseStrictNonNegativeInteger(trimmed) ?? null;
}
function getSerializedSessionStoreCacheMaxBytes() {
	return parseNonNegativeInteger(process.env.OPENCLAW_SESSION_SERIALIZED_CACHE_MAX_BYTES) ?? DEFAULT_SESSION_STORE_SERIALIZED_CACHE_MAX_BYTES;
}
function getSerializedSessionStoreCacheMaxEntries() {
	return DEFAULT_SESSION_STORE_SERIALIZED_CACHE_MAX_ENTRIES;
}
function resetSessionStoreStringInternStats() {
	SESSION_STORE_STRING_INTERN_STATS.stored = 0;
	SESSION_STORE_STRING_INTERN_STATS.reused = 0;
	SESSION_STORE_STRING_INTERN_STATS.skippedSmall = 0;
	SESSION_STORE_STRING_INTERN_STATS.skippedFull = 0;
}
function internLargeSessionStoreString(value) {
	if (value.length < LARGE_SESSION_STORE_STRING_MIN_CHARS) {
		SESSION_STORE_STRING_INTERN_STATS.skippedSmall += 1;
		return value;
	}
	const interned = SESSION_STORE_STRING_INTERN_POOL.get(value);
	if (interned !== void 0) {
		SESSION_STORE_STRING_INTERN_STATS.reused += 1;
		return interned;
	}
	if (SESSION_STORE_STRING_INTERN_POOL.size >= LARGE_SESSION_STORE_STRING_MAX_INTERNED) {
		SESSION_STORE_STRING_INTERN_STATS.skippedFull += 1;
		return value;
	}
	SESSION_STORE_STRING_INTERN_POOL.set(value, value);
	SESSION_STORE_STRING_INTERN_STATS.stored += 1;
	return value;
}
function internSessionEntryLargeStrings(entry) {
	const snapshot = entry.skillsSnapshot;
	if (!snapshot?.prompt) return;
	snapshot.prompt = internLargeSessionStoreString(snapshot.prompt);
}
function internSessionStoreLargeStrings(store) {
	for (const entry of Object.values(store)) internSessionEntryLargeStrings(entry);
}
function deepFreeze(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object") return value;
	const object = value;
	if (seen.has(object)) return value;
	seen.add(object);
	for (const child of Object.values(value)) deepFreeze(child, seen);
	return Object.freeze(value);
}
function cloneSessionStoreRecord(store, serialized) {
	const cloned = serialized === void 0 ? cloneJsonLikeValue(store) : JSON.parse(serialized);
	internSessionStoreLargeStrings(cloned);
	return cloned;
}
function cloneJsonLikeValue(value) {
	if (!value || typeof value !== "object") return value;
	if (Array.isArray(value)) {
		const cloned = [];
		cloned.length = value.length;
		for (let index = 0; index < value.length; index += 1) {
			if (!(index in value)) continue;
			cloned[index] = cloneJsonLikeValue(value[index]);
		}
		return cloned;
	}
	const cloned = {};
	for (const key in value) {
		if (!Object.hasOwn(value, key)) continue;
		const child = value[key];
		if (child === void 0) continue;
		const clonedChild = cloneJsonLikeValue(child);
		if (key === "__proto__") Object.defineProperty(cloned, key, {
			value: clonedChild,
			enumerable: true,
			configurable: true,
			writable: true
		});
		else cloned[key] = clonedChild;
	}
	return cloned;
}
function cloneSessionStoreSnapshot(store, serialized) {
	const cloned = serialized === void 0 ? cloneJsonLikeValue(store) : JSON.parse(serialized);
	internSessionStoreLargeStrings(cloned);
	return deepFreeze(cloned);
}
function cloneSessionStoreSnapshotEntry(entry) {
	return deepFreeze(cloneSessionStoreRecord({ entry }).entry);
}
function getSessionStoreTtl() {
	return resolveCacheTtlMs({
		envValue: process.env.OPENCLAW_SESSION_CACHE_TTL_MS,
		defaultTtlMs: DEFAULT_SESSION_STORE_TTL_MS
	});
}
function isSessionStoreCacheEnabled() {
	return isCacheEnabled(getSessionStoreTtl());
}
function bumpSessionStoreCacheVersion(storePath) {
	SESSION_STORE_CACHE_VERSION.set(storePath, (SESSION_STORE_CACHE_VERSION.get(storePath) ?? 0) + 1);
}
function getSessionStoreCacheVersion(storePath) {
	return SESSION_STORE_CACHE_VERSION.get(storePath) ?? 0;
}
function clearSessionStoreCaches() {
	SESSION_STORE_CACHE.clear();
	SESSION_STORE_SNAPSHOT_CACHE.clear();
	SESSION_STORE_CACHE_VERSION.clear();
	SESSION_STORE_SERIALIZED_CACHE.clear();
	sessionStoreSerializedCacheBytes = 0;
	SESSION_STORE_STRING_INTERN_POOL.clear();
	clearSessionSkillPromptRefCache();
	resetSessionStoreStringInternStats();
}
function invalidateSessionStoreCache(storePath) {
	bumpSessionStoreCacheVersion(storePath);
	SESSION_STORE_CACHE.delete(storePath);
	SESSION_STORE_SNAPSHOT_CACHE.delete(storePath);
	deleteSerializedSessionStore(storePath);
}
function deleteSerializedSessionStore(storePath) {
	const cached = SESSION_STORE_SERIALIZED_CACHE.get(storePath);
	if (!cached) return;
	SESSION_STORE_SERIALIZED_CACHE.delete(storePath);
	sessionStoreSerializedCacheBytes -= cached.sizeBytes;
}
function pruneSerializedSessionStoreCache() {
	const maxEntries = getSerializedSessionStoreCacheMaxEntries();
	const maxBytes = getSerializedSessionStoreCacheMaxBytes();
	while (SESSION_STORE_SERIALIZED_CACHE.size > 0 && (SESSION_STORE_SERIALIZED_CACHE.size > maxEntries || sessionStoreSerializedCacheBytes > maxBytes)) {
		const oldestKey = SESSION_STORE_SERIALIZED_CACHE.keys().next().value;
		if (typeof oldestKey !== "string") break;
		deleteSerializedSessionStore(oldestKey);
	}
}
function getSerializedSessionStore(storePath) {
	pruneSerializedSessionStoreCache();
	return SESSION_STORE_SERIALIZED_CACHE.get(storePath)?.serialized;
}
function getSerializedSessionStorePromptRefs(storePath) {
	pruneSerializedSessionStoreCache();
	return SESSION_STORE_SERIALIZED_CACHE.get(storePath)?.promptRefs;
}
function setSerializedSessionStorePromptRefs(storePath, promptRefs) {
	pruneSerializedSessionStoreCache();
	const cached = SESSION_STORE_SERIALIZED_CACHE.get(storePath);
	if (!cached) return;
	cached.promptRefs = promptRefs;
}
function setSerializedSessionStore(storePath, serialized, sizeBytesHint, promptRefs) {
	deleteSerializedSessionStore(storePath);
	if (serialized === void 0) return;
	const sizeBytes = typeof sizeBytesHint === "number" && Number.isFinite(sizeBytesHint) && sizeBytesHint >= 0 ? sizeBytesHint : Buffer.byteLength(serialized, "utf8");
	const maxEntries = getSerializedSessionStoreCacheMaxEntries();
	const maxBytes = getSerializedSessionStoreCacheMaxBytes();
	if (maxEntries <= 0 || maxBytes <= 0 || sizeBytes > maxBytes) return;
	SESSION_STORE_SERIALIZED_CACHE.set(storePath, {
		serialized,
		sizeBytes,
		promptRefs
	});
	sessionStoreSerializedCacheBytes += sizeBytes;
	pruneSerializedSessionStoreCache();
}
function dropSessionStoreObjectCache(storePath) {
	bumpSessionStoreCacheVersion(storePath);
	SESSION_STORE_CACHE.delete(storePath);
}
function dropSessionStoreSnapshotCache(storePath) {
	SESSION_STORE_SNAPSHOT_CACHE.delete(storePath);
}
function readSessionStoreSnapshotCache(params) {
	const cached = SESSION_STORE_SNAPSHOT_CACHE.get(params.storePath);
	if (!cached) return null;
	if (params.mtimeMs !== cached.mtimeMs || params.sizeBytes !== cached.sizeBytes) {
		invalidateSessionStoreCache(params.storePath);
		return null;
	}
	return cached.snapshot;
}
function writeSessionStoreSnapshotCache(params) {
	const snapshot = cloneSessionStoreSnapshot(params.store, params.serialized);
	SESSION_STORE_SNAPSHOT_CACHE.set(params.storePath, {
		snapshot,
		mtimeMs: params.mtimeMs,
		sizeBytes: params.sizeBytes
	});
	return snapshot;
}
function readSessionStoreCache(params) {
	const cached = SESSION_STORE_CACHE.get(params.storePath);
	if (!cached) return null;
	if (params.mtimeMs !== cached.mtimeMs || params.sizeBytes !== cached.sizeBytes) {
		invalidateSessionStoreCache(params.storePath);
		return null;
	}
	if (params.clone === false) return cached.store;
	return cloneSessionStoreRecord(cached.store, cached.serialized);
}
function takeMutableSessionStoreCache(params) {
	const cached = SESSION_STORE_CACHE.get(params.storePath);
	if (!cached) return null;
	if (params.mtimeMs !== cached.mtimeMs || params.sizeBytes !== cached.sizeBytes) {
		invalidateSessionStoreCache(params.storePath);
		return null;
	}
	SESSION_STORE_CACHE.delete(params.storePath);
	return cached.store;
}
function writeSessionStoreCache(params) {
	bumpSessionStoreCacheVersion(params.storePath);
	const store = params.takeOwnership === true ? params.store : cloneSessionStoreRecord(params.store);
	if (params.takeOwnership === true) internSessionStoreLargeStrings(store);
	SESSION_STORE_CACHE.set(params.storePath, {
		store,
		mtimeMs: params.mtimeMs,
		sizeBytes: params.sizeBytes,
		serialized: params.cloneSerialized
	});
	setSerializedSessionStore(params.storePath, params.serialized, params.sizeBytes, params.serializedPromptRefs);
}
//#endregion
//#region src/plugins/session-entry-slot-keys.ts
const SESSION_ENTRY_RESERVED_SLOT_KEYS = new Set([
	"__proto__",
	"constructor",
	"prototype",
	"lastHeartbeatText",
	"lastHeartbeatSentAt",
	"heartbeatIsolatedBaseSessionKey",
	"heartbeatTaskState",
	"pluginExtensions",
	"pluginExtensionSlotKeys",
	"pluginNextTurnInjections",
	"sessionId",
	"updatedAt",
	"sessionFile",
	"spawnedBy",
	"spawnedWorkspaceDir",
	"spawnedCwd",
	"parentSessionKey",
	"forkedFromParent",
	"spawnDepth",
	"subagentRole",
	"subagentControlScope",
	"inheritedToolDeny",
	"inheritedToolAllow",
	"subagentRecovery",
	"pluginOwnerId",
	"systemSent",
	"abortedLastRun",
	"restartRecoveryRuns",
	"goal",
	"sessionStartedAt",
	"lastInteractionAt",
	"startedAt",
	"endedAt",
	"runtimeMs",
	"status",
	"abortCutoffMessageSid",
	"abortCutoffTimestamp",
	"chatType",
	"thinkingLevel",
	"fastMode",
	"verboseLevel",
	"traceLevel",
	"reasoningLevel",
	"elevatedLevel",
	"ttsAuto",
	"lastTtsReadLatestHash",
	"lastTtsReadLatestAt",
	"execHost",
	"execSecurity",
	"execAsk",
	"execNode",
	"responseUsage",
	"usageFamilyKey",
	"usageFamilySessionIds",
	"providerOverride",
	"modelOverride",
	"agentRuntimeOverride",
	"modelOverrideSource",
	"modelOverrideFallbackOriginProvider",
	"modelOverrideFallbackOriginModel",
	"authProfileOverride",
	"authProfileOverrideSource",
	"authProfileOverrideCompactionCount",
	"liveModelSwitchPending",
	"groupActivation",
	"groupActivationNeedsSystemIntro",
	"sendPolicy",
	"queueMode",
	"queueDebounceMs",
	"queueCap",
	"queueDrop",
	"inputTokens",
	"outputTokens",
	"totalTokens",
	"pendingFinalDelivery",
	"pendingFinalDeliveryCreatedAt",
	"pendingFinalDeliveryLastAttemptAt",
	"pendingFinalDeliveryAttemptCount",
	"pendingFinalDeliveryLastError",
	"pendingFinalDeliveryText",
	"pendingFinalDeliveryContext",
	"pendingFinalDeliveryIntentId",
	"restartRecoveryDeliveryContext",
	"restartRecoveryDeliveryRunId",
	"totalTokensFresh",
	"estimatedCostUsd",
	"cacheRead",
	"cacheWrite",
	"modelProvider",
	"model",
	"agentHarnessId",
	"fallbackNoticeSelectedModel",
	"fallbackNoticeActiveModel",
	"fallbackNoticeReason",
	"contextTokens",
	"contextBudgetStatus",
	"compactionCount",
	"compactionCheckpoints",
	"memoryFlushAt",
	"memoryFlushCompactionCount",
	"memoryFlushContextHash",
	"memoryFlushFailureCount",
	"memoryFlushLastFailedAt",
	"memoryFlushLastFailureError",
	"cliSessionIds",
	"cliSessionBindings",
	"claudeCliSessionId",
	"label",
	"displayName",
	"channel",
	"groupId",
	"subject",
	"groupChannel",
	"space",
	"origin",
	"route",
	"deliveryContext",
	"lastChannel",
	"lastTo",
	"lastAccountId",
	"lastThreadId",
	"skillsSnapshot",
	"systemPromptReport",
	"pluginDebugEntries",
	"acp",
	"quotaSuspension"
]);
const OBJECT_PROTOTYPE_RESERVED_SLOT_KEYS = new Set(["prototype", ...Object.getOwnPropertyNames(Object.prototype)]);
const SESSION_ENTRY_SLOT_KEY_RE = /^[A-Za-z][A-Za-z0-9_]*$/u;
function normalizeSessionEntrySlotKey(value) {
	if (typeof value !== "string") return {
		ok: false,
		error: "sessionEntrySlotKey must be a string"
	};
	const key = value.trim();
	if (!key) return {
		ok: false,
		error: "sessionEntrySlotKey cannot be empty"
	};
	if (!SESSION_ENTRY_SLOT_KEY_RE.test(key)) return {
		ok: false,
		error: "sessionEntrySlotKey must be an identifier-style field name"
	};
	if (SESSION_ENTRY_RESERVED_SLOT_KEYS.has(key)) return {
		ok: false,
		error: `sessionEntrySlotKey is reserved by SessionEntry: ${key}`
	};
	if (OBJECT_PROTOTYPE_RESERVED_SLOT_KEYS.has(key)) return {
		ok: false,
		error: `sessionEntrySlotKey is reserved by Object: ${key}`
	};
	return {
		ok: true,
		key
	};
}
//#endregion
//#region src/config/sessions/store-entry-shape.ts
function isSafeSessionId(value) {
	if (typeof value !== "string") return false;
	const trimmed = value.trim();
	if (!trimmed || trimmed.length > 255) return false;
	if (trimmed.includes("/") || trimmed.includes("\\") || trimmed === "." || trimmed === "..") return false;
	return /^[A-Za-z0-9][A-Za-z0-9._:@-]*$/.test(trimmed);
}
function normalizeTranscriptSessionId(value) {
	try {
		return validateSessionId(value);
	} catch {
		return;
	}
}
function normalizeOptionalTimestamp(value) {
	if (value === void 0) return;
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
}
/** Normalizes persisted session store entries before they reach runtime callers. */
function normalizePersistedSessionEntryShape(value) {
	if (!isRecord(value)) return;
	let next = value;
	const sessionFile = typeof value.sessionFile === "string" ? value.sessionFile.trim() : void 0;
	if (value.sessionId !== void 0) {
		if (!isSafeSessionId(value.sessionId)) return;
		const sessionId = value.sessionId.trim();
		if (!normalizeTranscriptSessionId(sessionId) && !sessionFile) {
			const { sessionId: _dropSessionId, ...rest } = next;
			next = rest;
		} else if (sessionId !== value.sessionId) next = {
			...next,
			sessionId
		};
	}
	if (value.sessionFile !== void 0 && typeof value.sessionFile !== "string") {
		if (next === value) next = { ...next };
		delete next.sessionFile;
	}
	const updatedAt = normalizeOptionalTimestamp(value.updatedAt);
	if (updatedAt !== value.updatedAt) {
		if (next === value) next = { ...next };
		next.updatedAt = updatedAt ?? 0;
	}
	return next;
}
//#endregion
//#region src/config/sessions/store-maintenance-preserve.ts
const preserveKeysProviders = /* @__PURE__ */ new Set();
/** Registers a provider for session maintenance preserve keys. */
function registerSessionMaintenancePreserveKeysProvider(provider) {
	preserveKeysProviders.add(provider);
	return () => {
		preserveKeysProviders.delete(provider);
	};
}
function addSessionMaintenancePreserveKey(keys, value) {
	const normalized = normalizeStoreSessionKey(value ?? "");
	if (normalized) keys.add(normalized);
}
function addSessionMaintenancePreserveKeys(keys, values) {
	for (const value of values ?? []) addSessionMaintenancePreserveKey(keys, value);
}
/** Collects normalized session keys that maintenance/pruning must preserve. */
function collectSessionMaintenancePreserveKeys(baseKeys) {
	const keys = /* @__PURE__ */ new Set();
	addSessionMaintenancePreserveKeys(keys, baseKeys);
	for (const provider of preserveKeysProviders) try {
		addSessionMaintenancePreserveKeys(keys, provider());
	} catch {}
	return keys.size > 0 ? keys : void 0;
}
//#endregion
//#region src/config/sessions/store-maintenance-runtime.ts
function resolveMaintenanceConfig() {
	let maintenance;
	try {
		maintenance = getRuntimeConfig().session?.maintenance;
	} catch {}
	return resolveMaintenanceConfigFromInput(maintenance);
}
//#endregion
//#region src/config/sessions/store-migrations.ts
/** Applies best-effort in-place migrations for legacy session store entry fields. */
function applySessionStoreMigrations(store) {
	let changed = false;
	for (const entry of Object.values(store)) {
		if (!entry || typeof entry !== "object") continue;
		const rec = entry;
		if (typeof rec.channel !== "string" && typeof rec.provider === "string") {
			rec.channel = rec.provider;
			delete rec.provider;
			changed = true;
		}
		if (typeof rec.lastChannel !== "string" && typeof rec.lastProvider === "string") {
			rec.lastChannel = rec.lastProvider;
			delete rec.lastProvider;
			changed = true;
		}
		if (typeof rec.groupChannel !== "string" && typeof rec.room === "string") {
			rec.groupChannel = rec.room;
			delete rec.room;
			changed = true;
		} else if ("room" in rec) {
			delete rec.room;
			changed = true;
		}
	}
	return changed;
}
//#endregion
//#region src/config/sessions/store-load.ts
const log$1 = createSubsystemLogger("sessions/store");
function isSessionStoreRecord(value) {
	return isRecord(value);
}
function normalizeOptionalFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
}
function normalizeOptionalAttemptCount(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : void 0;
}
function normalizeOptionalStringOrNull(value) {
	if (value === null || typeof value === "string") return value;
}
function normalizeOptionalString(value) {
	return typeof value === "string" ? value : void 0;
}
function normalizeRecordKey(value) {
	const key = value.trim();
	return key.length > 0 ? key : void 0;
}
function normalizeOptionalDeliveryContext(value) {
	if (!isRecord(value)) return;
	const normalized = normalizeDeliveryContext({
		channel: typeof value.channel === "string" ? value.channel : void 0,
		to: typeof value.to === "string" ? value.to : void 0,
		accountId: typeof value.accountId === "string" ? value.accountId : void 0,
		threadId: typeof value.threadId === "string" || typeof value.threadId === "number" ? value.threadId : void 0
	});
	return normalized?.channel && normalized.to ? normalized : void 0;
}
function sameDeliveryContext(left, right) {
	return (left?.channel ?? void 0) === (right?.channel ?? void 0) && (left?.to ?? void 0) === (right?.to ?? void 0) && (left?.accountId ?? void 0) === (right?.accountId ?? void 0) && (left?.threadId ?? void 0) === (right?.threadId ?? void 0);
}
function normalizePendingFinalDeliveryFields(entry) {
	let next = entry;
	const assign = (key, value) => {
		if (entry[key] === value) return;
		if (next === entry) next = { ...entry };
		if (value === void 0) delete next[key];
		else next[key] = value;
	};
	assign("pendingFinalDelivery", entry.pendingFinalDelivery === true ? true : void 0);
	assign("pendingFinalDeliveryText", normalizeOptionalStringOrNull(entry.pendingFinalDeliveryText));
	assign("pendingFinalDeliveryCreatedAt", normalizeOptionalFiniteNumber(entry.pendingFinalDeliveryCreatedAt));
	assign("pendingFinalDeliveryLastAttemptAt", normalizeOptionalFiniteNumber(entry.pendingFinalDeliveryLastAttemptAt));
	assign("pendingFinalDeliveryAttemptCount", normalizeOptionalAttemptCount(entry.pendingFinalDeliveryAttemptCount));
	assign("pendingFinalDeliveryLastError", normalizeOptionalStringOrNull(entry.pendingFinalDeliveryLastError));
	const pendingFinalDeliveryContext = normalizeOptionalDeliveryContext(entry.pendingFinalDeliveryContext);
	if (!sameDeliveryContext(entry.pendingFinalDeliveryContext, pendingFinalDeliveryContext)) assign("pendingFinalDeliveryContext", pendingFinalDeliveryContext);
	assign("pendingFinalDeliveryIntentId", normalizeOptionalStringOrNull(entry.pendingFinalDeliveryIntentId));
	const restartRecoveryDeliveryContext = normalizeOptionalDeliveryContext(entry.restartRecoveryDeliveryContext);
	if (!sameDeliveryContext(entry.restartRecoveryDeliveryContext, restartRecoveryDeliveryContext)) assign("restartRecoveryDeliveryContext", restartRecoveryDeliveryContext);
	assign("restartRecoveryDeliveryRunId", normalizeOptionalString(entry.restartRecoveryDeliveryRunId));
	return next;
}
function normalizePluginExtensions(entry) {
	if (entry.pluginExtensions === void 0) return entry;
	if (!isRecord(entry.pluginExtensions)) {
		const next = { ...entry };
		delete next.pluginExtensions;
		return next;
	}
	let changed = false;
	const normalizedExtensions = {};
	for (const [rawPluginId, rawPluginState] of Object.entries(entry.pluginExtensions)) {
		const pluginId = normalizeRecordKey(rawPluginId);
		if (!pluginId || !isRecord(rawPluginState)) {
			changed = true;
			continue;
		}
		if (pluginId !== rawPluginId) changed = true;
		const normalizedPluginState = {};
		for (const [rawNamespace, rawValue] of Object.entries(rawPluginState)) {
			const namespace = normalizeRecordKey(rawNamespace);
			if (!namespace || !isPluginJsonValue(rawValue)) {
				changed = true;
				continue;
			}
			if (namespace !== rawNamespace) changed = true;
			normalizedPluginState[namespace] = rawValue;
		}
		if (Object.keys(normalizedPluginState).length === 0) {
			changed = true;
			continue;
		}
		normalizedExtensions[pluginId] = normalizedPluginState;
	}
	if (!changed) return entry;
	const next = { ...entry };
	if (Object.keys(normalizedExtensions).length > 0) next.pluginExtensions = normalizedExtensions;
	else delete next.pluginExtensions;
	return next;
}
function normalizePluginExtensionSlotKeys(entry) {
	if (entry.pluginExtensionSlotKeys === void 0) return entry;
	if (!isRecord(entry.pluginExtensionSlotKeys)) {
		const next = { ...entry };
		delete next.pluginExtensionSlotKeys;
		return next;
	}
	let changed = false;
	const normalizedSlotKeys = {};
	for (const [rawPluginId, rawPluginSlots] of Object.entries(entry.pluginExtensionSlotKeys)) {
		const pluginId = normalizeRecordKey(rawPluginId);
		if (!pluginId || !isRecord(rawPluginSlots)) {
			changed = true;
			continue;
		}
		if (pluginId !== rawPluginId) changed = true;
		const normalizedPluginSlots = {};
		for (const [rawNamespace, rawSlotKey] of Object.entries(rawPluginSlots)) {
			const namespace = normalizeRecordKey(rawNamespace);
			const slotKey = normalizeSessionEntrySlotKey(rawSlotKey);
			if (!namespace || !slotKey.ok) {
				changed = true;
				continue;
			}
			if (namespace !== rawNamespace || slotKey.key !== rawSlotKey) changed = true;
			normalizedPluginSlots[namespace] = slotKey.key;
		}
		if (Object.keys(normalizedPluginSlots).length === 0) {
			changed = true;
			continue;
		}
		normalizedSlotKeys[pluginId] = normalizedPluginSlots;
	}
	if (!changed) return entry;
	const next = { ...entry };
	if (Object.keys(normalizedSlotKeys).length > 0) next.pluginExtensionSlotKeys = normalizedSlotKeys;
	else delete next.pluginExtensionSlotKeys;
	return next;
}
function sameDeliveryChannelRoute(left, right) {
	return (left?.channel ?? void 0) === (right?.channel ?? void 0) && (left?.accountId ?? void 0) === (right?.accountId ?? void 0) && (left?.target?.to ?? void 0) === (right?.target?.to ?? void 0) && (left?.target?.rawTo ?? void 0) === (right?.target?.rawTo ?? void 0) && (left?.target?.chatType ?? void 0) === (right?.target?.chatType ?? void 0) && (left?.thread?.id ?? void 0) === (right?.thread?.id ?? void 0) && (left?.thread?.kind ?? void 0) === (right?.thread?.kind ?? void 0) && (left?.thread?.source ?? void 0) === (right?.thread?.source ?? void 0);
}
function normalizeSessionEntryDelivery(entry) {
	const entryRoute = normalizeDeliveryChannelRoute(entry.route);
	const normalized = normalizeSessionDeliveryFields({
		route: entryRoute,
		channel: entry.channel,
		lastChannel: entry.lastChannel,
		lastTo: entry.lastTo,
		lastAccountId: entry.lastAccountId,
		lastThreadId: entry.lastThreadId ?? entry.deliveryContext?.threadId ?? entry.origin?.threadId,
		deliveryContext: entry.deliveryContext
	});
	const nextDelivery = normalized.deliveryContext;
	const sameDelivery = (entry.deliveryContext?.channel ?? void 0) === nextDelivery?.channel && (entry.deliveryContext?.to ?? void 0) === nextDelivery?.to && (entry.deliveryContext?.accountId ?? void 0) === nextDelivery?.accountId && (entry.deliveryContext?.threadId ?? void 0) === nextDelivery?.threadId;
	const sameLast = sameDeliveryChannelRoute(entryRoute, normalized.route) && entry.lastChannel === normalized.lastChannel && entry.lastTo === normalized.lastTo && entry.lastAccountId === normalized.lastAccountId && entry.lastThreadId === normalized.lastThreadId;
	if (sameDelivery && sameLast) return entry;
	return {
		...entry,
		route: normalized.route,
		deliveryContext: nextDelivery,
		lastChannel: normalized.lastChannel,
		lastTo: normalized.lastTo,
		lastAccountId: normalized.lastAccountId,
		lastThreadId: normalized.lastThreadId
	};
}
function stripPersistedSkillsCache(entry) {
	const snapshot = entry.skillsSnapshot;
	if (!snapshot || snapshot.resolvedSkills === void 0) return entry;
	const { resolvedSkills: _drop, ...rest } = snapshot;
	return {
		...entry,
		skillsSnapshot: rest
	};
}
function normalizeSessionStore(store) {
	let changed = false;
	for (const [key, entry] of Object.entries(store)) {
		const shaped = normalizePersistedSessionEntryShape(entry);
		if (!shaped) {
			delete store[key];
			changed = true;
			continue;
		}
		const normalized = stripPersistedSkillsCache(normalizePluginExtensionSlotKeys(normalizePluginExtensions(normalizePendingFinalDeliveryFields(normalizeSessionEntryDelivery(normalizeSessionRuntimeModelFields(shaped))))));
		internSessionEntryLargeStrings(normalized);
		if (normalized !== entry) {
			store[key] = normalized;
			changed = true;
		}
	}
	return changed;
}
function loadSessionStore(storePath, opts = {}) {
	const shouldHydrateSkillPromptRefs = opts.hydrateSkillPromptRefs !== false;
	const canWriteSessionStoreCache = shouldHydrateSkillPromptRefs;
	if (!opts.skipCache && isSessionStoreCacheEnabled()) {
		const currentFileStat = getFileStatSnapshot(storePath);
		const cached = readSessionStoreCache({
			storePath,
			mtimeMs: currentFileStat?.mtimeMs,
			sizeBytes: currentFileStat?.sizeBytes,
			clone: opts.clone
		});
		if (cached) return cached;
	}
	let store = {};
	const fileStat = getFileStatSnapshot(storePath);
	const mtimeMs = fileStat?.mtimeMs;
	let serializedFromDisk;
	const maxReadAttempts = process.platform === "win32" ? 3 : 1;
	const retryBuf = maxReadAttempts > 1 ? new Int32Array(new SharedArrayBuffer(4)) : void 0;
	for (let attempt = 0; attempt < maxReadAttempts; attempt += 1) try {
		const raw = fs.readFileSync(storePath, "utf-8");
		if (raw.length === 0 && attempt < maxReadAttempts - 1) {
			Atomics.wait(retryBuf, 0, 0, 50);
			continue;
		}
		const parsed = JSON.parse(raw);
		if (isSessionStoreRecord(parsed)) {
			store = parsed;
			serializedFromDisk = raw;
		}
		break;
	} catch {
		if (attempt < maxReadAttempts - 1) {
			Atomics.wait(retryBuf, 0, 0, 50);
			continue;
		}
	}
	const hydratedPromptRefs = shouldHydrateSkillPromptRefs ? hydrateSessionStoreSkillPromptRefs({
		storePath,
		store
	}) : false;
	const migrated = applySessionStoreMigrations(store);
	const normalized = normalizeSessionStore(store);
	if (hydratedPromptRefs || migrated || normalized) serializedFromDisk = void 0;
	if (opts.runMaintenance) {
		const maintenance = opts.maintenanceConfig ?? resolveMaintenanceConfig();
		const beforeCount = Object.keys(store).length;
		let pruned = 0;
		let capped = 0;
		if (maintenance.mode === "enforce" && beforeCount > maintenance.maxEntries) {
			const preserveSessionKeys = collectSessionMaintenancePreserveKeys();
			pruned = pruneStaleEntries(store, maintenance.pruneAfterMs, {
				log: false,
				preserveKeys: preserveSessionKeys
			});
			const countAfterPrune = Object.keys(store).length;
			capped = shouldRunSessionEntryMaintenance({
				entryCount: countAfterPrune,
				maxEntries: maintenance.maxEntries
			}) ? capEntryCount(store, maintenance.maxEntries, {
				log: false,
				preserveKeys: preserveSessionKeys
			}) : 0;
		}
		const afterCount = Object.keys(store).length;
		if (pruned > 0 || capped > 0) {
			serializedFromDisk = void 0;
			log$1.info("applied load-time maintenance to session store", {
				storePath,
				before: beforeCount,
				after: afterCount,
				pruned,
				capped,
				maxEntries: maintenance.maxEntries
			});
		}
	}
	setSerializedSessionStore(storePath, serializedFromDisk);
	if (!opts.skipCache && canWriteSessionStoreCache && isSessionStoreCacheEnabled()) writeSessionStoreCache({
		storePath,
		store,
		mtimeMs,
		sizeBytes: fileStat?.sizeBytes,
		serialized: serializedFromDisk,
		cloneSerialized: serializedFromDisk,
		takeOwnership: serializedFromDisk !== void 0
	});
	return opts.clone === false ? store : cloneSessionStoreRecord(store, serializedFromDisk);
}
function readSessionStoreSnapshot(storePath) {
	const currentFileStat = getFileStatSnapshot(storePath);
	const cacheEnabled = isSessionStoreCacheEnabled();
	if (cacheEnabled) {
		const cached = readSessionStoreSnapshotCache({
			storePath,
			mtimeMs: currentFileStat?.mtimeMs,
			sizeBytes: currentFileStat?.sizeBytes
		});
		if (cached) return cached;
	}
	const store = loadSessionStore(storePath, { clone: false });
	if (!cacheEnabled) return cloneSessionStoreSnapshot(store);
	return writeSessionStoreSnapshotCache({
		storePath,
		store,
		mtimeMs: currentFileStat?.mtimeMs,
		sizeBytes: currentFileStat?.sizeBytes
	});
}
function readSessionEntry(storePath, sessionKey, opts = {}) {
	const resolved = resolveSessionStoreEntry({
		store: loadSessionStore(storePath, {
			clone: false,
			...opts.hydrateSkillPromptRefs === false ? { hydrateSkillPromptRefs: false } : {}
		}),
		sessionKey
	});
	return resolved.existing ? cloneSessionStoreSnapshotEntry(resolved.existing) : void 0;
}
function readSessionEntries(storePath) {
	return Object.entries(readSessionStoreSnapshot(storePath));
}
//#endregion
//#region src/config/sessions/store-maintenance-operations.ts
function resolveMaintenanceForOperation(params) {
	return params.maintenanceConfig ? {
		...params.maintenanceConfig,
		...params.maintenanceOverride
	} : {
		...resolveMaintenanceConfig(),
		...params.maintenanceOverride
	};
}
function collectReferencedSessionIds(store) {
	return new Set(Object.values(store).map((entry) => entry?.sessionId).filter((id) => Boolean(id)));
}
function rememberRemovedSessionFile$1(removedSessionFiles, entry) {
	if (!removedSessionFiles.has(entry.sessionId) || entry.sessionFile) removedSessionFiles.set(entry.sessionId, entry.sessionFile);
}
async function applyWarnOnlyMaintenance(params) {
	const activeSessionKey = params.operation.activeSessionKey?.trim();
	if (activeSessionKey && params.shouldRunEntryMaintenance) {
		const warning = getActiveSessionMaintenanceWarning({
			store: params.operation.store,
			activeSessionKey,
			pruneAfterMs: params.maintenance.pruneAfterMs,
			maxEntries: params.maintenance.maxEntries
		});
		if (warning) {
			params.operation.log.warn("session maintenance would evict active session; skipping enforcement", {
				activeSessionKey: warning.activeSessionKey,
				wouldPrune: warning.wouldPrune,
				wouldCap: warning.wouldCap,
				pruneAfterMs: warning.pruneAfterMs,
				maxEntries: warning.maxEntries
			});
			await params.operation.onWarn?.(warning);
		}
	}
	const diskBudget = await enforceSessionDiskBudget({
		store: params.operation.store,
		storePath: params.operation.storePath,
		activeSessionKey: params.operation.activeSessionKey,
		maintenance: params.maintenance,
		warnOnly: true,
		log: params.operation.log
	});
	await params.operation.onMaintenanceApplied?.({
		mode: params.maintenance.mode,
		beforeCount: params.beforeCount,
		afterCount: Object.keys(params.operation.store).length,
		pruned: 0,
		capped: 0,
		diskBudget
	});
}
async function cleanupRemovedSessionArtifacts(params) {
	const archivedDirs = await params.operation.artifacts.archiveRemovedSessionTranscripts({
		removedSessionFiles: params.removedSessionFiles,
		referencedSessionIds: params.referencedSessionIds,
		storePath: params.operation.storePath,
		reason: "deleted",
		restrictToStoreDir: true
	});
	if (params.removedSessionFiles.size > 0) await params.operation.artifacts.removeRemovedSessionTrajectoryArtifacts({
		removedSessionFiles: params.removedSessionFiles,
		referencedSessionIds: params.referencedSessionIds,
		storePath: params.operation.storePath,
		restrictToStoreDir: true
	});
	if (archivedDirs.size === 0 && params.maintenance.resetArchiveRetentionMs == null) return;
	const targetDirs = archivedDirs.size > 0 ? [...archivedDirs] : [path.dirname(path.resolve(params.operation.storePath))];
	await params.operation.artifacts.cleanupArchivedSessionTranscripts({
		directories: targetDirs,
		rules: params.maintenance.resetArchiveRetentionMs != null ? [{
			reason: "deleted",
			olderThanMs: params.maintenance.pruneAfterMs
		}, {
			reason: "reset",
			olderThanMs: params.maintenance.resetArchiveRetentionMs
		}] : [{
			reason: "deleted",
			olderThanMs: params.maintenance.pruneAfterMs
		}]
	});
}
async function applyEnforcedMaintenance(params) {
	const preserveSessionKeys = collectSessionMaintenancePreserveKeys([params.operation.activeSessionKey]);
	const removedSessionFiles = /* @__PURE__ */ new Map();
	const pruned = pruneStaleEntries(params.operation.store, params.maintenance.pruneAfterMs, {
		onPruned: ({ entry }) => {
			rememberRemovedSessionFile$1(removedSessionFiles, entry);
		},
		preserveKeys: preserveSessionKeys
	});
	const countAfterPrune = Object.keys(params.operation.store).length;
	const capped = params.forceMaintenance || shouldRunSessionEntryMaintenance({
		entryCount: countAfterPrune,
		maxEntries: params.maintenance.maxEntries
	}) ? capEntryCount(params.operation.store, params.maintenance.maxEntries, {
		onCapped: ({ entry }) => {
			rememberRemovedSessionFile$1(removedSessionFiles, entry);
		},
		preserveKeys: preserveSessionKeys
	}) : 0;
	const referencedSessionIds = collectReferencedSessionIds(params.operation.store);
	await cleanupRemovedSessionArtifacts({
		operation: params.operation,
		maintenance: params.maintenance,
		removedSessionFiles,
		referencedSessionIds
	});
	const diskBudget = await enforceSessionDiskBudget({
		store: params.operation.store,
		storePath: params.operation.storePath,
		activeSessionKey: params.operation.activeSessionKey,
		preserveKeys: preserveSessionKeys,
		maintenance: params.maintenance,
		warnOnly: false,
		log: params.operation.log
	});
	await params.operation.onMaintenanceApplied?.({
		mode: params.maintenance.mode,
		beforeCount: params.beforeCount,
		afterCount: Object.keys(params.operation.store).length,
		pruned,
		capped,
		diskBudget
	});
	return { changedStore: pruned > 0 || capped > 0 || (diskBudget?.removedEntries ?? 0) > 0 };
}
/**
* Applies automatic session-store maintenance to the in-memory file-store image.
*
* Future SQLite adapters should map this into named boundaries: entry retention,
* removed-session artifact cleanup, disk-budget eviction, and archive retention cleanup.
*/
async function applyFileBackedSessionStoreMaintenance(params) {
	const maintenance = resolveMaintenanceForOperation(params);
	const beforeCount = Object.keys(params.store).length;
	const forceMaintenance = params.maintenanceOverride !== void 0;
	const shouldRunEntryMaintenance = shouldRunSessionEntryMaintenance({
		entryCount: beforeCount,
		maxEntries: maintenance.maxEntries,
		force: forceMaintenance
	});
	if (maintenance.mode === "warn") {
		await applyWarnOnlyMaintenance({
			operation: params,
			maintenance,
			beforeCount,
			shouldRunEntryMaintenance
		});
		return { changedStore: false };
	}
	return await applyEnforcedMaintenance({
		operation: params,
		maintenance,
		beforeCount,
		forceMaintenance
	});
}
//#endregion
//#region src/config/sessions/store-writer-state.ts
const WRITER_QUEUES = /* @__PURE__ */ new Map();
/** Clears session store writer queues and cache for tests. */
function clearSessionStoreCacheForTest() {
	clearSessionStoreCaches();
	clearStoreWriterQueuesForTest(WRITER_QUEUES, "session store queue cleared for test");
}
//#endregion
//#region src/config/sessions/store-writer.ts
async function runExclusiveSessionStoreWrite(storePath, fn) {
	return await runQueuedStoreWrite({
		queues: WRITER_QUEUES,
		storePath,
		label: "runExclusiveSessionStoreWrite",
		fn
	});
}
//#endregion
//#region src/config/sessions/store.ts
const log = createSubsystemLogger("sessions/store");
let sessionArchiveRuntimePromise = null;
let trajectoryCleanupRuntimePromise = null;
const writerStoreFileStats = /* @__PURE__ */ new WeakMap();
function loadSessionArchiveRuntime() {
	sessionArchiveRuntimePromise ??= import("./session-archive.runtime.js");
	return sessionArchiveRuntimePromise;
}
function loadTrajectoryCleanupRuntime() {
	trajectoryCleanupRuntimePromise ??= import("./cleanup-myM4Qc87.js");
	return trajectoryCleanupRuntimePromise;
}
function removeThreadFromDeliveryContext(context) {
	if (!context || context.threadId == null) return context;
	const next = { ...context };
	delete next.threadId;
	return next;
}
function readSessionUpdatedAt(params) {
	try {
		return resolveSessionStoreEntry({
			store: loadSessionStore(params.storePath, { clone: false }),
			sessionKey: params.sessionKey
		}).existing?.updatedAt;
	} catch {
		return;
	}
}
function cloneSessionEntry(entry) {
	return cloneSessionStoreRecord({ entry }).entry;
}
function resolveSessionWorkflowStorePath(options) {
	if (options.storePath) return options.storePath;
	const agentId = options.agentId ?? resolveAgentIdFromSessionKey(options.sessionKey);
	return resolveStorePath(getRuntimeConfig().session?.store, {
		agentId,
		env: options.env
	});
}
function getSessionEntry(options) {
	const entry = readSessionEntry(resolveSessionWorkflowStorePath(options), options.sessionKey, { hydrateSkillPromptRefs: options.hydrateSkillPromptRefs });
	return entry ? cloneSessionEntry(entry) : void 0;
}
function listSessionEntries(options = {}) {
	return readSessionEntries(resolveSessionWorkflowStorePath(options)).map(([sessionKey, entry]) => ({
		sessionKey,
		entry: cloneSessionEntry(entry)
	}));
}
function updateSessionStoreWriteCaches(params) {
	const fileStat = getFileStatSnapshot(params.storePath);
	setSerializedSessionStore(params.storePath, params.serialized, fileStat?.sizeBytes, params.serializedPromptRefs);
	if (!isSessionStoreCacheEnabled()) {
		dropSessionStoreObjectCache(params.storePath);
		dropSessionStoreSnapshotCache(params.storePath);
		return;
	}
	writeSessionStoreCache({
		storePath: params.storePath,
		store: params.store,
		mtimeMs: fileStat?.mtimeMs,
		sizeBytes: fileStat?.sizeBytes,
		serialized: params.serialized,
		serializedPromptRefs: params.serializedPromptRefs,
		cloneSerialized: params.cloneSerialized,
		takeOwnership: params.takeOwnership
	});
	dropSessionStoreSnapshotCache(params.storePath);
}
function restoreUnchangedSessionStoreCache(storePath, store) {
	if (!isSessionStoreCacheEnabled()) return;
	const loadedFileStat = writerStoreFileStats.get(store) ?? null;
	const currentFileStat = getFileStatSnapshot(storePath) ?? null;
	if (loadedFileStat?.mtimeMs !== currentFileStat?.mtimeMs || loadedFileStat?.sizeBytes !== currentFileStat?.sizeBytes) {
		invalidateSessionStoreCache(storePath);
		return;
	}
	const serialized = getSerializedSessionStore(storePath);
	const serializedPromptRefs = serialized !== void 0 ? getSerializedSessionStorePromptRefs(storePath) : void 0;
	writeSessionStoreCache({
		storePath,
		store,
		mtimeMs: loadedFileStat?.mtimeMs,
		sizeBytes: loadedFileStat?.sizeBytes,
		serialized,
		serializedPromptRefs,
		takeOwnership: true
	});
	if (serialized !== void 0) setSerializedSessionStore(storePath, serialized, loadedFileStat?.sizeBytes, serializedPromptRefs);
}
function findJsonValueEnd(json, valueStart) {
	let depth = 0;
	let inString = false;
	let escaped = false;
	for (let index = valueStart; index < json.length; index += 1) {
		const char = json[index];
		if (inString) {
			if (escaped) escaped = false;
			else if (char === "\\") escaped = true;
			else if (char === "\"") inString = false;
			continue;
		}
		if (char === "\"") {
			inString = true;
			continue;
		}
		if (char === "{" || char === "[") {
			depth += 1;
			continue;
		}
		if (char !== "}" && char !== "]") continue;
		depth -= 1;
		if (depth === 0) return index + 1;
		if (depth < 0) return null;
	}
	return null;
}
function indentTopLevelEntryJson(json) {
	return json.replaceAll("\n", "\n  ");
}
function buildSingleEntrySerializedStore(params) {
	const currentSerialized = getSerializedSessionStore(params.storePath);
	if (currentSerialized === void 0) return null;
	const currentPromptRefs = getSerializedPromptRefs(params.storePath, currentSerialized);
	const marker = `\n  ${JSON.stringify(params.patch.sessionKey)}: `;
	const markerIndex = currentSerialized.indexOf(marker);
	if (markerIndex < 0) return null;
	const valueStart = markerIndex + marker.length;
	if (currentSerialized[valueStart] !== "{") return null;
	const valueEnd = findJsonValueEnd(currentSerialized, valueStart);
	if (valueEnd === null) return null;
	const projected = projectSessionStoreForPersistence({
		storePath: params.storePath,
		store: { [params.patch.sessionKey]: params.patch.entry }
	});
	const projectedEntry = projected.store[params.patch.sessionKey];
	if (!projectedEntry) return null;
	const entryJson = indentTopLevelEntryJson(JSON.stringify(projectedEntry, null, 2));
	const promptRefs = new Map(currentPromptRefs);
	const promptRef = projectedEntry.skillsSnapshot?.promptRef;
	if (promptRef) promptRefs.set(params.patch.sessionKey, promptRef);
	else promptRefs.delete(params.patch.sessionKey);
	return {
		serialized: currentSerialized.slice(0, valueStart) + entryJson + currentSerialized.slice(valueEnd),
		promptBlobs: [...projected.promptBlobs.values()],
		promptRefs
	};
}
function collectSerializedPromptRefs(serialized) {
	const refs = /* @__PURE__ */ new Map();
	try {
		const parsed = JSON.parse(serialized);
		for (const [key, entry] of Object.entries(parsed)) {
			const ref = entry?.skillsSnapshot?.promptRef;
			if (ref) refs.set(key, ref);
		}
	} catch {}
	return refs;
}
function collectStorePromptRefs(store) {
	const refs = /* @__PURE__ */ new Map();
	for (const [key, entry] of Object.entries(store)) {
		const ref = entry?.skillsSnapshot?.promptRef;
		if (ref) refs.set(key, ref);
	}
	return refs;
}
function getSerializedPromptRefs(storePath, serialized) {
	const cached = getSerializedSessionStorePromptRefs(storePath);
	if (cached) return cached;
	const refs = collectSerializedPromptRefs(serialized);
	setSerializedSessionStorePromptRefs(storePath, refs);
	return refs;
}
function storeHasUnsafeUntouchedHydratedSkillPrompts(storePath, store, changedSessionKey) {
	const currentSerialized = getSerializedSessionStore(storePath);
	const serializedPromptRefs = currentSerialized !== void 0 ? getSerializedPromptRefs(storePath, currentSerialized) : void 0;
	for (const [key, entry] of Object.entries(store)) {
		if (key === changedSessionKey || typeof entry.skillsSnapshot?.prompt !== "string") continue;
		const ref = serializedPromptRefs?.get(key);
		if (!ref || !isSessionSkillPromptBlobReadable(storePath, ref)) return true;
		if (serializedPromptRefs?.has(key)) {
			const projected = projectSessionStoreForPersistence({
				storePath,
				store: { [key]: entry }
			});
			for (const blob of projected.promptBlobs.values()) {
				if (!blob.path) continue;
				try {
					const stat = fs.statSync(blob.path);
					if (!stat.isFile() || stat.size !== blob.ref.bytes) return true;
				} catch {
					return true;
				}
			}
		}
	}
	return false;
}
function loadMutableSessionStoreForWriter(storePath) {
	const currentFileStat = getFileStatSnapshot(storePath);
	if (isSessionStoreCacheEnabled()) {
		const cached = takeMutableSessionStoreCache({
			storePath,
			mtimeMs: currentFileStat?.mtimeMs,
			sizeBytes: currentFileStat?.sizeBytes
		});
		if (cached) {
			writerStoreFileStats.set(cached, currentFileStat ?? null);
			return cached;
		}
	}
	const store = loadSessionStore(storePath, {
		skipCache: true,
		clone: false
	});
	writerStoreFileStats.set(store, currentFileStat ?? null);
	return store;
}
function sessionEntriesHaveSameSerializedForm(previous, next) {
	return previous !== void 0 && JSON.stringify(previous) === JSON.stringify(next);
}
function cloneOptionalSessionEntry(entry) {
	return entry ? cloneSessionEntry(entry) : void 0;
}
function resolveLifecyclePrimaryEntry(params) {
	const freshestMatch = resolveFreshestLifecycleStoreMatch({
		store: params.store,
		storeKeys: params.target.storeKeys
	});
	if (freshestMatch) {
		const currentPrimary = params.store[params.target.canonicalKey];
		if (!currentPrimary || (freshestMatch.entry.updatedAt ?? 0) > (currentPrimary.updatedAt ?? 0)) params.store[params.target.canonicalKey] = freshestMatch.entry;
	}
	pruneLifecycleLegacyStoreKeys({
		store: params.store,
		target: params.target
	});
	return params.store[params.target.canonicalKey];
}
function resolveFreshestLifecycleStoreMatch(params) {
	let freshest;
	for (const key of params.storeKeys) {
		const entry = params.store[key];
		if (!entry) continue;
		const match = {
			key,
			entry
		};
		if (!freshest || (entry.updatedAt ?? 0) > (freshest.entry.updatedAt ?? 0)) freshest = match;
	}
	return freshest;
}
function pruneLifecycleLegacyStoreKeys(params) {
	for (const key of params.target.storeKeys) if (key !== params.target.canonicalKey) delete params.store[key];
}
async function archiveLifecycleSessionTranscripts(params) {
	if (!params.sessionId) return [];
	const { archiveSessionTranscriptsDetailed } = await loadSessionArchiveRuntime();
	return archiveSessionTranscriptsDetailed({
		sessionId: params.sessionId,
		storePath: params.storePath,
		sessionFile: params.sessionFile,
		agentId: params.agentId,
		reason: params.reason
	});
}
function ensureLifecycleTranscriptHeader(params) {
	fs.mkdirSync(path.dirname(params.sessionFile), { recursive: true });
	if (fs.existsSync(params.sessionFile)) return;
	const header = {
		type: "session",
		version: 3,
		id: params.sessionId,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		cwd: process.cwd()
	};
	fs.writeFileSync(params.sessionFile, `${JSON.stringify(header)}\n`, {
		encoding: "utf-8",
		mode: 384
	});
}
function normalizePathForLifecycleComparison(filePath) {
	try {
		return path.normalize(fs.realpathSync(filePath));
	} catch {
		return path.normalize(path.resolve(filePath));
	}
}
function sessionKeySegmentStartsWith(sessionKey, prefix) {
	const firstSeparator = sessionKey.indexOf(":");
	if (firstSeparator < 0) return sessionKey.startsWith(prefix);
	const secondSeparator = sessionKey.indexOf(":", firstSeparator + 1);
	return (secondSeparator < 0 ? sessionKey : sessionKey.slice(secondSeparator + 1)).startsWith(prefix);
}
function resolveLifecycleTranscriptPath(params) {
	const sessionId = params.entry?.sessionId?.trim();
	const sessionFile = params.entry?.sessionFile?.trim();
	const generatedSessionId = extractGeneratedTranscriptSessionId(sessionFile);
	if (sessionFile && (!sessionId || !generatedSessionId || generatedSessionId === sessionId)) try {
		return resolveExplicitSessionFilePath(sessionFile, { sessionsDir: params.sessionsDir });
	} catch {
		return null;
	}
	if (!sessionId) return null;
	try {
		return resolveSessionFilePath(sessionId, void 0, { sessionsDir: params.sessionsDir });
	} catch {
		return null;
	}
}
function lifecycleTranscriptIsReclaimable(params) {
	if (!params.transcriptPath || !fs.existsSync(params.transcriptPath)) return true;
	try {
		const stat = fs.statSync(params.transcriptPath);
		return params.nowMs - stat.mtimeMs >= params.orphanTranscriptMinAgeMs;
	} catch {
		return true;
	}
}
function archiveExactLifecycleTranscriptPath(params) {
	const resolvedSessionsDir = normalizePathForLifecycleComparison(params.sessionsDir);
	const resolvedTranscriptPath = normalizePathForLifecycleComparison(params.transcriptPath);
	const relative = path.relative(resolvedSessionsDir, resolvedTranscriptPath);
	if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return 0;
	const archivedPath = `${resolvedTranscriptPath}.deleted.${formatSessionArchiveTimestamp()}`;
	try {
		fs.renameSync(resolvedTranscriptPath, archivedPath);
		emitSessionTranscriptUpdate({ sessionFile: archivedPath });
		return 1;
	} catch {
		return 0;
	}
}
async function saveSessionStoreUnlocked(storePath, store, opts) {
	normalizeSessionStore(store);
	let maintenanceChangedStore = false;
	if (!opts?.skipMaintenance) maintenanceChangedStore = (await applyFileBackedSessionStoreMaintenance({
		storePath,
		store,
		activeSessionKey: opts?.activeSessionKey,
		onWarn: opts?.onWarn,
		onMaintenanceApplied: opts?.onMaintenanceApplied,
		maintenanceOverride: opts?.maintenanceOverride,
		maintenanceConfig: opts?.maintenanceConfig,
		log,
		artifacts: {
			archiveRemovedSessionTranscripts,
			removeRemovedSessionTrajectoryArtifacts: async (params) => {
				const { removeRemovedSessionTrajectoryArtifacts } = await loadTrajectoryCleanupRuntime();
				await removeRemovedSessionTrajectoryArtifacts(params);
			},
			cleanupArchivedSessionTranscripts: async (params) => {
				const { cleanupArchivedSessionTranscripts } = await loadSessionArchiveRuntime();
				await cleanupArchivedSessionTranscripts(params);
			}
		}
	})).changedStore;
	if (opts?.skipSerializeForUnchangedStore && !maintenanceChangedStore && getSerializedSessionStore(storePath) !== void 0) {
		restoreUnchangedSessionStoreCache(storePath, store);
		return;
	}
	await fs.promises.mkdir(path.dirname(storePath), { recursive: true });
	if (opts?.singleEntryPersistence && !maintenanceChangedStore && !storeHasUnsafeUntouchedHydratedSkillPrompts(storePath, store, opts.singleEntryPersistence.sessionKey)) {
		const normalizedEntry = store[opts.singleEntryPersistence.sessionKey];
		const singleEntrySerialized = buildSingleEntrySerializedStore({
			storePath,
			patch: normalizedEntry ? {
				sessionKey: opts.singleEntryPersistence.sessionKey,
				entry: normalizedEntry
			} : opts.singleEntryPersistence
		});
		if (singleEntrySerialized) {
			await writeSessionStoreAtomic({
				storePath,
				store,
				serialized: singleEntrySerialized.serialized,
				serializedPromptRefs: singleEntrySerialized.promptRefs,
				promptBlobs: singleEntrySerialized.promptBlobs,
				takeOwnership: opts?.takeCacheOwnership
			});
			return;
		}
	}
	const persisted = projectSessionStoreForPersistence({
		storePath,
		store
	});
	const promptBlobs = [...persisted.promptBlobs.values()];
	const promptRefs = collectStorePromptRefs(persisted.store);
	const json = JSON.stringify(persisted.store, null, 2);
	const cloneSerialized = persisted.changed ? void 0 : json;
	if (getSerializedSessionStore(storePath) === json) {
		await ensureSessionStorePromptBlobsForPersistence({
			storePath,
			promptBlobs
		});
		updateSessionStoreWriteCaches({
			storePath,
			store,
			serialized: json,
			serializedPromptRefs: promptRefs,
			cloneSerialized,
			takeOwnership: opts?.takeCacheOwnership
		});
		return;
	}
	if (process.platform === "win32") {
		let finalError;
		for (let i = 0; i < 5; i++) try {
			await writeSessionStoreAtomic({
				storePath,
				store,
				serialized: json,
				serializedPromptRefs: promptRefs,
				cloneSerialized,
				promptBlobs,
				takeOwnership: opts?.takeCacheOwnership
			});
			return;
		} catch (err) {
			finalError = err;
			if (getErrorCode(err) === "ENOENT") {
				if (opts?.requireWriteSuccess) throw err;
				return;
			}
			if (i < 4) {
				await new Promise((r) => {
					setTimeout(r, 50 * (i + 1));
				});
				continue;
			}
			log.warn(`atomic write failed after 5 attempts: ${storePath}`);
		}
		if (opts?.requireWriteSuccess) throw finalError;
		return;
	}
	try {
		await writeSessionStoreAtomic({
			storePath,
			store,
			serialized: json,
			serializedPromptRefs: promptRefs,
			cloneSerialized,
			promptBlobs,
			takeOwnership: opts?.takeCacheOwnership
		});
	} catch (err) {
		if (getErrorCode(err) === "ENOENT") {
			try {
				await writeSessionStoreAtomic({
					storePath,
					store,
					serialized: json,
					serializedPromptRefs: promptRefs,
					cloneSerialized,
					promptBlobs,
					takeOwnership: opts?.takeCacheOwnership
				});
			} catch (err2) {
				if (getErrorCode(err2) === "ENOENT") {
					if (opts?.requireWriteSuccess) throw err2;
					return;
				}
				throw err2;
			}
			return;
		}
		throw err;
	}
}
async function saveSessionStore(storePath, store, opts) {
	await runExclusiveSessionStoreWrite(storePath, async () => {
		await saveSessionStoreUnlocked(storePath, store, opts);
	});
}
async function updateSessionStore(storePath, mutator, opts) {
	return await runExclusiveSessionStoreWrite(storePath, async () => {
		const store = loadMutableSessionStoreForWriter(storePath);
		const result = await mutator(store);
		if (opts?.skipSaveWhenResult?.(result)) {
			restoreUnchangedSessionStoreCache(storePath, store);
			return result;
		}
		await saveSessionStoreUnlocked(storePath, store, {
			...opts,
			singleEntryPersistence: opts?.resolveSingleEntryPersistence?.(result) ?? void 0
		});
		return result;
	});
}
function cloneSessionEntryProjectionSnapshot(store) {
	return { entries: Object.entries(store).map(([sessionKey, entry]) => ({
		sessionKey,
		entry: cloneSessionEntry(entry)
	})) };
}
function resolveFreshestProjectedEntry(params) {
	let freshest;
	const keys = /* @__PURE__ */ new Set();
	for (const candidateKey of params.candidateKeys) {
		const trimmed = normalizeOptionalString$1(candidateKey) ?? "";
		if (!trimmed) continue;
		keys.add(trimmed);
	}
	for (const key of keys) {
		const entry = params.store[key];
		if (!entry) continue;
		if (!freshest || (entry.updatedAt ?? 0) > (freshest.updatedAt ?? 0)) freshest = entry;
	}
	return freshest;
}
function migrateSessionEntryProjectionTarget(params) {
	const candidateKeys = params.target.candidateKeys ?? [params.target.primaryKey];
	const freshest = resolveFreshestProjectedEntry({
		store: params.store,
		candidateKeys
	});
	const currentPrimary = params.store[params.target.primaryKey];
	if (freshest && (!currentPrimary || (freshest.updatedAt ?? 0) > (currentPrimary.updatedAt ?? 0))) params.store[params.target.primaryKey] = freshest;
	const keysToDelete = /* @__PURE__ */ new Set();
	for (const candidateKey of candidateKeys) {
		const trimmed = normalizeOptionalString$1(candidateKey) ?? "";
		if (!trimmed) continue;
		if (trimmed !== params.target.primaryKey) keysToDelete.add(trimmed);
	}
	for (const key of keysToDelete) delete params.store[key];
}
/**
* Applies a storage-neutral entry projection inside the session-store writer.
* The projection receives a cloned snapshot and returns the replacement entry;
* it cannot mutate the backing whole store.
*/
async function applySessionEntryPatchProjection(params) {
	return await runExclusiveSessionStoreWrite(params.storePath, async () => {
		const store = loadMutableSessionStoreForWriter(params.storePath);
		const target = params.resolveTarget(cloneSessionEntryProjectionSnapshot(store));
		migrateSessionEntryProjectionTarget({
			store,
			target
		});
		const projected = await params.project({
			...target,
			entries: cloneSessionEntryProjectionSnapshot(store).entries,
			...store[target.primaryKey] ? { existingEntry: cloneSessionEntry(store[target.primaryKey]) } : {}
		});
		if (projected.ok) store[target.primaryKey] = cloneSessionEntry(projected.entry);
		await saveSessionStoreUnlocked(params.storePath, store, { activeSessionKey: target.primaryKey });
		return projected.ok ? {
			...projected,
			entry: cloneSessionEntry(projected.entry)
		} : projected;
	});
}
/** Resets one persisted session entry and rotates its file-backed transcript artifacts. */
async function resetSessionEntryLifecycle(params) {
	return await runExclusiveSessionStoreWrite(params.storePath, async () => {
		const store = loadMutableSessionStoreForWriter(params.storePath);
		const currentEntry = resolveLifecyclePrimaryEntry({
			store,
			target: params.target
		});
		const previousSessionId = currentEntry?.sessionId;
		const previousSessionFile = currentEntry?.sessionFile;
		const nextEntry = await params.buildNextEntry({
			currentEntry: cloneOptionalSessionEntry(currentEntry),
			primaryKey: params.target.canonicalKey
		});
		const nextSessionFile = nextEntry.sessionFile?.trim();
		if (!nextSessionFile) throw new Error("reset session lifecycle requires next entry sessionFile");
		store[params.target.canonicalKey] = nextEntry;
		await saveSessionStoreUnlocked(params.storePath, store);
		const mutation = { nextEntry: cloneSessionEntry(nextEntry) };
		const previousEntry = cloneOptionalSessionEntry(currentEntry);
		if (previousEntry) mutation.previousEntry = previousEntry;
		if (previousSessionFile) mutation.previousSessionFile = previousSessionFile;
		if (previousSessionId) mutation.previousSessionId = previousSessionId;
		await params.afterEntryMutation?.(mutation);
		const archivedTranscripts = await archiveLifecycleSessionTranscripts({
			sessionId: previousSessionId,
			storePath: params.storePath,
			sessionFile: previousSessionFile,
			agentId: params.agentId,
			reason: "reset"
		});
		ensureLifecycleTranscriptHeader({
			sessionFile: nextSessionFile,
			sessionId: nextEntry.sessionId
		});
		return {
			...mutation,
			archivedTranscripts
		};
	});
}
/** Deletes one persisted session entry and archives its file-backed transcript artifacts. */
async function deleteSessionEntryLifecycle(params) {
	return await runExclusiveSessionStoreWrite(params.storePath, async () => {
		const store = loadMutableSessionStoreForWriter(params.storePath);
		const deletedEntry = resolveLifecyclePrimaryEntry({
			store,
			target: params.target
		});
		if (!deletedEntry) {
			restoreUnchangedSessionStoreCache(params.storePath, store);
			return {
				archivedTranscripts: [],
				deleted: false
			};
		}
		const deletedSessionId = deletedEntry.sessionId;
		const deletedSessionFile = deletedEntry.sessionFile;
		delete store[params.target.canonicalKey];
		await saveSessionStoreUnlocked(params.storePath, store);
		const result = {
			archivedTranscripts: params.archiveTranscript ? await archiveLifecycleSessionTranscripts({
				sessionId: deletedSessionId,
				storePath: params.storePath,
				sessionFile: deletedSessionFile,
				agentId: params.agentId,
				reason: "deleted"
			}) : [],
			deleted: true
		};
		result.deletedEntry = cloneSessionEntry(deletedEntry);
		if (deletedSessionFile) result.deletedSessionFile = deletedSessionFile;
		if (deletedSessionId) result.deletedSessionId = deletedSessionId;
		return result;
	});
}
function shouldRemoveSessionEntry(entry, removal) {
	if (!entry) return false;
	if (removal.expectedEntry !== void 0 && JSON.stringify(entry) !== JSON.stringify(removal.expectedEntry)) return false;
	if (removal.expectedSessionId !== void 0 && entry.sessionId !== removal.expectedSessionId) return false;
	if (removal.expectedUpdatedAt !== void 0 && entry.updatedAt !== removal.expectedUpdatedAt) return false;
	return true;
}
/**
* Applies exact entry removals/upserts and lifecycle artifact cleanup as one
* backend-owned operation. Callers choose domain keys; storage owns the final
* referenced-session set used for transcript/artifact cleanup.
*/
async function applySessionEntryLifecycleMutation(params) {
	const storePath = path.resolve(params.storePath);
	const removedSessionFiles = /* @__PURE__ */ new Map();
	const removedSessionKeys = [];
	const archivedTranscriptDirectories = [];
	let unreferencedArtifacts = null;
	let maintenanceReport = null;
	let afterCount = 0;
	let artifactCleanupError;
	await runExclusiveSessionStoreWrite(storePath, async () => {
		const store = loadMutableSessionStoreForWriter(storePath);
		for (const removal of params.removals ?? []) {
			const sessionKey = removal.sessionKey.trim();
			if (!sessionKey) continue;
			const entry = store[sessionKey];
			if (!shouldRemoveSessionEntry(entry, removal)) continue;
			if (removal.archiveRemovedTranscript === true && entry.sessionId) rememberRemovedSessionFile(removedSessionFiles, entry);
			delete store[sessionKey];
			removedSessionKeys.push(sessionKey);
		}
		for (const upsert of params.upserts ?? []) {
			const sessionKey = upsert.sessionKey.trim();
			if (!sessionKey) continue;
			const entry = upsert.buildEntry === void 0 ? upsert.entry : await upsert.buildEntry({
				currentEntry: store[sessionKey] ? cloneSessionEntry(store[sessionKey]) : void 0,
				sessionKey,
				store
			});
			if (!entry) continue;
			store[sessionKey] = cloneSessionEntry(entry);
		}
		await saveSessionStoreUnlocked(storePath, store, {
			activeSessionKey: params.activeSessionKey,
			maintenanceOverride: params.maintenanceOverride,
			skipMaintenance: params.skipMaintenance,
			onMaintenanceApplied: (report) => {
				maintenanceReport = report;
			}
		});
		afterCount = Object.keys(store).length;
		const cleanupArtifacts = async () => {
			const referencedSessionIds = new Set(Object.values(store).map((entry) => entry?.sessionId).filter((sessionId) => Boolean(sessionId)));
			if (removedSessionFiles.size > 0) {
				const archivedDirs = await archiveRemovedSessionTranscripts({
					removedSessionFiles,
					referencedSessionIds,
					storePath,
					reason: params.archiveReason ?? "deleted",
					restrictToStoreDir: params.restrictArchivedTranscriptsToStoreDir
				});
				archivedTranscriptDirectories.push(...[...archivedDirs].toSorted());
				if (archivedDirs.size > 0 && params.cleanupArchivedTranscripts) {
					const { cleanupArchivedSessionTranscripts } = await loadSessionArchiveRuntime();
					await cleanupArchivedSessionTranscripts({
						directories: [...archivedDirs],
						rules: params.cleanupArchivedTranscripts.rules,
						nowMs: params.cleanupArchivedTranscripts.nowMs
					});
				}
			}
			if (params.pruneUnreferencedArtifacts) unreferencedArtifacts = await pruneUnreferencedSessionArtifacts({
				store,
				storePath,
				olderThanMs: params.pruneUnreferencedArtifacts.olderThanMs,
				dryRun: params.pruneUnreferencedArtifacts.dryRun
			});
		};
		try {
			await cleanupArtifacts();
		} catch (err) {
			if (params.captureArtifactCleanupError === true) artifactCleanupError = err;
			else throw err;
		}
	});
	return {
		removedEntries: removedSessionKeys.length,
		removedSessionKeys,
		archivedTranscriptDirectories,
		unreferencedArtifacts,
		maintenanceReport,
		afterCount,
		artifactCleanupError
	};
}
/**
* Purges entries owned by a deleted agent while holding the store writer lock.
* This preserves the old delete-time current-store owner check without
* exposing a mutable whole-store callback to callers.
*/
async function purgeDeletedAgentSessionEntries(params) {
	const storePath = path.resolve(params.storePath);
	const removedSessionKeys = [];
	let maintenanceReport = null;
	let afterCount = 0;
	await runExclusiveSessionStoreWrite(storePath, async () => {
		const store = loadMutableSessionStoreForWriter(storePath);
		for (const sessionKey of Object.keys(store)) if (resolveStoredSessionOwnerAgentId({
			cfg: params.cfg,
			agentId: params.storeAgentId,
			sessionKey
		}) === params.agentId) {
			delete store[sessionKey];
			removedSessionKeys.push(sessionKey);
		}
		await saveSessionStoreUnlocked(storePath, store, { onMaintenanceApplied: (report) => {
			maintenanceReport = report;
		} });
		afterCount = Object.keys(store).length;
	});
	return {
		removedEntries: removedSessionKeys.length,
		removedSessionKeys,
		archivedTranscriptDirectories: [],
		unreferencedArtifacts: null,
		maintenanceReport,
		afterCount
	};
}
async function archiveUnreferencedLifecycleTranscriptArtifacts(params) {
	const sessionsDir = path.dirname(path.resolve(params.storePath));
	return await runExclusiveSessionStoreWrite(params.storePath, async () => {
		const store = loadMutableSessionStoreForWriter(params.storePath);
		const referencedTranscriptPaths = /* @__PURE__ */ new Set();
		for (const entry of Object.values(store)) {
			const transcriptPath = resolveLifecycleTranscriptPath({
				entry,
				sessionsDir
			});
			if (transcriptPath) referencedTranscriptPaths.add(normalizePathForLifecycleComparison(transcriptPath));
		}
		restoreUnchangedSessionStoreCache(params.storePath, store);
		let entries;
		try {
			entries = await fs.promises.readdir(sessionsDir, { withFileTypes: true });
		} catch {
			return 0;
		}
		const { archiveSessionTranscripts } = await loadSessionArchiveRuntime();
		let archived = 0;
		for (const entry of entries) {
			if (!entry.isFile() || !entry.name.endsWith(".jsonl")) continue;
			const transcriptPath = path.join(sessionsDir, entry.name);
			if (referencedTranscriptPaths.has(normalizePathForLifecycleComparison(transcriptPath))) continue;
			let stat;
			try {
				stat = await fs.promises.stat(transcriptPath);
			} catch {
				continue;
			}
			if (params.nowMs - stat.mtimeMs < params.orphanTranscriptMinAgeMs) continue;
			let content;
			try {
				content = await fs.promises.readFile(transcriptPath, "utf-8");
			} catch {
				continue;
			}
			if (!content.includes(params.transcriptContentMarker)) continue;
			const sessionId = entry.name.slice(0, -6);
			archived += archiveSessionTranscripts({
				sessionId,
				storePath: params.storePath,
				sessionFile: transcriptPath,
				reason: "deleted",
				restrictToStoreDir: true
			}).length;
		}
		return archived;
	});
}
/** Cleans scoped session lifecycle entries and their unreferenced transcript artifacts. */
async function cleanupSessionLifecycleArtifacts(params) {
	const sessionKeySegmentPrefix = params.sessionKeySegmentPrefix.trim();
	const transcriptContentMarker = params.transcriptContentMarker;
	if (!sessionKeySegmentPrefix || !transcriptContentMarker) return {
		removedEntries: 0,
		archivedTranscriptArtifacts: 0
	};
	const nowMs = params.nowMs ?? Date.now();
	const storePath = path.resolve(params.storePath);
	const sessionsDir = path.dirname(storePath);
	const removedSessionFiles = /* @__PURE__ */ new Map();
	const removedTranscriptPaths = [];
	const archiveRemovedEntryTranscripts = params.archiveRemovedEntryTranscripts !== false;
	let removedEntries = 0;
	let archivedTranscriptArtifacts = 0;
	await runExclusiveSessionStoreWrite(storePath, async () => {
		const store = loadMutableSessionStoreForWriter(storePath);
		for (const [sessionKey, entry] of Object.entries(store)) {
			const transcriptPath = resolveLifecycleTranscriptPath({
				entry,
				sessionsDir
			});
			if (sessionKeySegmentStartsWith(sessionKey, sessionKeySegmentPrefix) && lifecycleTranscriptIsReclaimable({
				transcriptPath,
				nowMs,
				orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs
			})) {
				if (archiveRemovedEntryTranscripts) {
					rememberRemovedSessionFile(removedSessionFiles, entry);
					if (entry.sessionId && transcriptPath && fs.existsSync(transcriptPath)) removedTranscriptPaths.push({
						sessionId: entry.sessionId,
						transcriptPath
					});
				}
				delete store[sessionKey];
				removedEntries += 1;
				continue;
			}
		}
		if (removedEntries === 0) {
			restoreUnchangedSessionStoreCache(storePath, store);
			return;
		}
		const referencedSessionIds = new Set(Object.values(store).map((entry) => entry?.sessionId).filter((sessionId) => Boolean(sessionId)));
		for (const { sessionId: removedSessionId, transcriptPath } of removedTranscriptPaths) {
			if (referencedSessionIds.has(removedSessionId)) continue;
			archivedTranscriptArtifacts += archiveExactLifecycleTranscriptPath({
				sessionsDir,
				transcriptPath
			});
		}
		const { removeRemovedSessionTrajectoryArtifacts } = await loadTrajectoryCleanupRuntime();
		await removeRemovedSessionTrajectoryArtifacts({
			removedSessionFiles,
			referencedSessionIds,
			storePath,
			restrictToStoreDir: true
		});
		await saveSessionStoreUnlocked(storePath, store, { skipMaintenance: true });
	});
	return {
		removedEntries,
		archivedTranscriptArtifacts: archivedTranscriptArtifacts + await archiveUnreferencedLifecycleTranscriptArtifacts({
			storePath,
			transcriptContentMarker,
			orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs,
			nowMs
		})
	};
}
function getErrorCode(error) {
	if (!error || typeof error !== "object" || !("code" in error)) return null;
	return String(error.code);
}
function rememberRemovedSessionFile(removedSessionFiles, entry) {
	if (!removedSessionFiles.has(entry.sessionId) || entry.sessionFile) removedSessionFiles.set(entry.sessionId, entry.sessionFile);
}
async function archiveRemovedSessionTranscripts(params) {
	const { archiveSessionTranscripts } = await loadSessionArchiveRuntime();
	const archivedDirs = /* @__PURE__ */ new Set();
	for (const [sessionId, sessionFile] of params.removedSessionFiles) {
		if (params.referencedSessionIds.has(sessionId)) continue;
		const archived = archiveSessionTranscripts({
			sessionId,
			storePath: params.storePath,
			sessionFile,
			reason: params.reason,
			restrictToStoreDir: params.restrictToStoreDir
		});
		for (const archivedPath of archived) archivedDirs.add(path.dirname(archivedPath));
	}
	return archivedDirs;
}
async function writeSessionStoreAtomic(params) {
	await writeTextAtomic(params.storePath, params.serialized, {
		durable: false,
		mode: 384,
		tempPrefix: path.basename(params.storePath),
		beforeRename: async () => {
			await ensureSessionStorePromptBlobsForPersistence({
				storePath: params.storePath,
				promptBlobs: params.promptBlobs
			});
		}
	});
	updateSessionStoreWriteCaches({
		storePath: params.storePath,
		store: params.store,
		serialized: params.serialized,
		serializedPromptRefs: params.serializedPromptRefs,
		cloneSerialized: params.cloneSerialized,
		takeOwnership: params.takeOwnership
	});
}
async function persistResolvedSessionEntry(params) {
	const entryUnchanged = params.resolved.legacyKeys.length === 0 && sessionEntriesHaveSameSerializedForm(params.resolved.existing, params.next);
	const next = params.takeCacheOwnership ? cloneSessionEntry(params.next) : params.next;
	params.store[params.resolved.normalizedKey] = next;
	for (const legacyKey of params.resolved.legacyKeys) delete params.store[legacyKey];
	await saveSessionStoreUnlocked(params.storePath, params.store, {
		activeSessionKey: params.resolved.normalizedKey,
		skipMaintenance: params.skipMaintenance,
		maintenanceConfig: params.maintenanceConfig,
		skipSerializeForUnchangedStore: entryUnchanged,
		singleEntryPersistence: params.resolved.legacyKeys.length === 0 && params.resolved.existing ? {
			sessionKey: params.resolved.normalizedKey,
			entry: next
		} : void 0,
		takeCacheOwnership: params.takeCacheOwnership,
		requireWriteSuccess: params.requireWriteSuccess
	});
	return entryUnchanged || params.returnDetached ? cloneSessionEntry(next) : next;
}
async function updateSessionStoreEntry(params) {
	const { storePath, sessionKey, update } = params;
	return await runExclusiveSessionStoreWrite(storePath, async () => {
		const store = loadMutableSessionStoreForWriter(storePath);
		const resolved = resolveSessionStoreEntry({
			store,
			sessionKey
		});
		const existing = resolved.existing;
		if (!existing) return null;
		const patch = await update(cloneSessionEntry(existing));
		if (!patch) return existing;
		return await persistResolvedSessionEntry({
			storePath,
			store,
			resolved,
			next: mergeSessionEntry(existing, patch),
			skipMaintenance: params.skipMaintenance,
			takeCacheOwnership: params.takeCacheOwnership ?? true,
			requireWriteSuccess: params.requireWriteSuccess,
			returnDetached: params.takeCacheOwnership !== true
		});
	});
}
async function applySessionStoreEntryPatch(params) {
	const { storePath, sessionKey, patch } = params;
	return await runExclusiveSessionStoreWrite(storePath, async () => {
		const store = loadMutableSessionStoreForWriter(storePath);
		const resolved = resolveSessionStoreEntry({
			store,
			sessionKey
		});
		const existing = resolved.existing;
		if (!existing) return null;
		return await persistResolvedSessionEntry({
			storePath,
			store,
			resolved,
			next: mergeSessionEntry(existing, patch),
			skipMaintenance: params.skipMaintenance,
			takeCacheOwnership: params.takeCacheOwnership ?? true,
			returnDetached: params.takeCacheOwnership !== true
		});
	});
}
async function patchSessionEntry(params) {
	return (await patchSessionEntryWithKey(params))?.entry ?? null;
}
async function patchSessionEntryWithKey(params) {
	const storePath = resolveSessionWorkflowStorePath(params);
	return await runExclusiveSessionStoreWrite(storePath, async () => {
		const store = loadMutableSessionStoreForWriter(storePath);
		const resolved = resolveSessionStoreEntry({
			store,
			sessionKey: params.sessionKey
		});
		const existing = resolved.existing ?? params.fallbackEntry;
		if (!existing) return null;
		const patch = await params.update(cloneSessionEntry(existing), { existingEntry: resolved.existing ? cloneSessionEntry(resolved.existing) : void 0 });
		if (!patch) return {
			sessionKey: resolved.normalizedKey,
			entry: existing
		};
		const next = params.replaceEntry ? cloneSessionEntry(patch) : params.preserveActivity ? mergeSessionEntryPreserveActivity(existing, patch) : mergeSessionEntry(existing, patch);
		return {
			sessionKey: resolved.normalizedKey,
			entry: await persistResolvedSessionEntry({
				storePath,
				store,
				resolved,
				next,
				maintenanceConfig: params.maintenanceConfig,
				requireWriteSuccess: params.requireWriteSuccess,
				skipMaintenance: params.skipMaintenance,
				takeCacheOwnership: params.takeCacheOwnership ?? true,
				returnDetached: params.takeCacheOwnership !== true
			})
		};
	});
}
async function recordSessionMetaFromInbound(params) {
	const { storePath, sessionKey, ctx } = params;
	const createIfMissing = params.createIfMissing ?? true;
	return await runExclusiveSessionStoreWrite(storePath, async () => {
		const store = loadMutableSessionStoreForWriter(storePath);
		const resolved = resolveSessionStoreEntry({
			store,
			sessionKey
		});
		const existing = resolved.existing;
		const patch = deriveSessionMetaPatch({
			ctx,
			sessionKey: resolved.normalizedKey,
			existing,
			groupResolution: params.groupResolution
		});
		if (!patch) {
			if (existing && resolved.legacyKeys.length > 0) return await persistResolvedSessionEntry({
				storePath,
				store,
				resolved,
				next: existing,
				takeCacheOwnership: true,
				returnDetached: true
			});
			await saveSessionStoreUnlocked(storePath, store, {
				activeSessionKey: resolved.normalizedKey,
				skipSerializeForUnchangedStore: true
			});
			return existing ? cloneSessionEntry(existing) : null;
		}
		if (!existing && !createIfMissing) {
			await saveSessionStoreUnlocked(storePath, store, {
				activeSessionKey: resolved.normalizedKey,
				skipSerializeForUnchangedStore: true
			});
			return null;
		}
		return await persistResolvedSessionEntry({
			storePath,
			store,
			resolved,
			next: existing ? mergeSessionEntryPreserveActivity(existing, patch) : mergeSessionEntry(existing, patch),
			takeCacheOwnership: true,
			returnDetached: true
		});
	});
}
async function updateLastRoute(params) {
	const { storePath, sessionKey, channel, to, accountId, threadId, ctx } = params;
	const createIfMissing = params.createIfMissing ?? true;
	return await runExclusiveSessionStoreWrite(storePath, async () => {
		const store = loadMutableSessionStoreForWriter(storePath);
		const resolved = resolveSessionStoreEntry({
			store,
			sessionKey
		});
		const existing = resolved.existing;
		if (!existing && !createIfMissing) return null;
		const explicitContext = normalizeDeliveryContext(params.deliveryContext);
		const inlineContext = normalizeDeliveryContext({
			channel,
			to,
			accountId,
			threadId
		});
		const routeContext = deliveryContextFromChannelRoute(params.route);
		const mergedInput = mergeDeliveryContext(routeContext, mergeDeliveryContext(explicitContext, inlineContext));
		const explicitDeliveryContext = params.deliveryContext;
		const explicitThreadValue = (explicitDeliveryContext != null && Object.hasOwn(explicitDeliveryContext, "threadId") ? explicitDeliveryContext.threadId : void 0) ?? (threadId != null && threadId !== "" ? threadId : void 0);
		const merged = mergeDeliveryContext(mergedInput, Boolean(routeContext?.channel || routeContext?.to || explicitContext?.channel || explicitContext?.to || inlineContext?.channel || inlineContext?.to) && explicitThreadValue == null ? removeThreadFromDeliveryContext(deliveryContextFromSession(existing)) : deliveryContextFromSession(existing));
		const normalized = normalizeSessionDeliveryFields({
			route: params.route,
			deliveryContext: {
				channel: merged?.channel,
				to: merged?.to,
				accountId: merged?.accountId,
				threadId: merged?.threadId
			}
		});
		const metaPatch = ctx ? deriveSessionMetaPatch({
			ctx,
			sessionKey: resolved.normalizedKey,
			existing,
			groupResolution: params.groupResolution
		}) : null;
		const basePatch = {
			route: normalized.route,
			deliveryContext: normalized.deliveryContext,
			lastChannel: normalized.lastChannel,
			lastTo: normalized.lastTo,
			lastAccountId: normalized.lastAccountId,
			lastThreadId: normalized.lastThreadId
		};
		return await persistResolvedSessionEntry({
			storePath,
			store,
			resolved,
			next: mergeSessionEntryPreserveActivity(existing, metaPatch ? {
				...basePatch,
				...metaPatch
			} : basePatch),
			takeCacheOwnership: true,
			returnDetached: true
		});
	});
}
//#endregion
export { normalizeStoreSessionKey as $, deriveGroupSessionPatch as A, getActiveSessionMaintenanceWarning as B, readSessionStoreSnapshot as C, normalizeSessionEntrySlotKey as D, registerSessionMaintenancePreserveKeysProvider as E, resolveGroupSessionKey as F, parseSessionThreadInfoFast as G, resolveMaintenanceConfigFromInput as H, enforceSessionDiskBudget as I, isCacheEnabled as J, resolveLoadedSessionThreadInfo as K, pruneUnreferencedSessionArtifacts as L, deriveSessionOrigin as M, snapshotSessionOrigin as N, cloneSessionStoreRecord as O, buildGroupDisplayName as P, isConfirmedLowercasedLegacyAlias as Q, resolveSessionArtifactCanonicalPathsForEntry as R, readSessionEntry as S, collectSessionMaintenancePreserveKeys as T, resolveQuotaSuspensionEntryMaintenance as U, pruneStaleEntries as V, parseSessionThreadInfo as W, foldedSessionKeyAliasCandidates as X, resolveCacheTtlMs as Y, hasMismatchedCaseSensitiveDeliveryProof as Z, updateSessionStore as _, cleanupSessionLifecycleArtifacts as a, resolveStoredSessionKeyForAgentStore as at, loadSessionStore as b, listSessionEntries as c, purgeDeletedAgentSessionEntries as d, resolveSessionStoreEntry as et, readSessionUpdatedAt as f, updateLastRoute as g, saveSessionStore as h, archiveRemovedSessionTranscripts as i, resolveSessionStoreKey as it, deriveSessionMetaPatch as j, getSessionStoreCacheVersion as k, patchSessionEntry as l, resetSessionEntryLifecycle as m, applySessionEntryPatchProjection as n, canonicalizeSpawnedByForAgent as nt, deleteSessionEntryLifecycle as o, resolveStoredSessionOwnerAgentId as ot, recordSessionMetaFromInbound as p, createExpiringMapCache as q, applySessionStoreEntryPatch as r, resolveSessionStoreAgentId as rt, getSessionEntry as s, applySessionEntryLifecycleMutation as t, canonicalizeSessionKeyForAgent as tt, patchSessionEntryWithKey as u, updateSessionStoreEntry as v, resolveMaintenanceConfig as w, readSessionEntries as x, clearSessionStoreCacheForTest as y, capEntryCount as z };
