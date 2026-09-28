import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CUi_tcgF.mjs";
import "./src-Da9425In.mjs";
import { A as parseAgentSessionKey, E as parseThreadSessionSuffix, S as isSubagentSessionKey, T as parseSessionDeliveryRoute, x as isCronSessionKey, y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { t as parseByteSize } from "./parse-bytes-DCAjQ31S.mjs";
import { r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
//#region src/config/sessions/session-pin-policy.ts
function isPinnableSessionEntry(storeKey, entry) {
	if (isSubagentSessionKey(storeKey) || normalizeOptionalString(entry?.spawnedBy)) return false;
	const parentSessionKey = normalizeOptionalString(entry?.parentSessionKey);
	if (!parentSessionKey) return true;
	const parsed = parseAgentSessionKey(storeKey);
	return parsed !== null && parentSessionKey === buildAgentMainSessionKey({ agentId: parsed.agentId });
}
//#endregion
//#region src/config/sessions/store-maintenance.ts
const log = createSubsystemLogger("sessions/store");
const DEFAULT_SESSION_PRUNE_AFTER_MS = 2592e6;
const DEFAULT_DASHBOARD_ARCHIVE_AFTER_MS = 6048e5;
const DEFAULT_MODEL_RUN_PRUNE_AFTER_MS = 864e5;
const DEFAULT_SESSION_MAX_ENTRIES = 5e3;
const DEFAULT_SESSION_MAINTENANCE_MODE = "enforce";
const DEFAULT_SESSION_DISK_BUDGET_HIGH_WATER_RATIO = .8;
const DEFAULT_SESSION_MAX_DISK_BYTES = 10737418240;
const STRICT_ENTRY_MAINTENANCE_MAX_ENTRIES = 49;
const MIN_BATCHED_ENTRY_MAINTENANCE_SLACK = 25;
const BATCHED_ENTRY_MAINTENANCE_SLACK_RATIO = .1;
function resolvePruneAfterMs(maintenance) {
	const raw = maintenance?.pruneAfter;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return DEFAULT_SESSION_PRUNE_AFTER_MS;
	try {
		return parseDurationMs(normalized, { defaultUnit: "d" });
	} catch {
		return DEFAULT_SESSION_PRUNE_AFTER_MS;
	}
}
function resolveArchiveDashboardAfterMs(maintenance) {
	const raw = maintenance?.archiveDashboardAfter;
	if (raw === false || raw === 0) return null;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return DEFAULT_DASHBOARD_ARCHIVE_AFTER_MS;
	try {
		const parsed = parseDurationMs(normalized, { defaultUnit: "d" });
		return parsed > 0 ? parsed : null;
	} catch {
		return DEFAULT_DASHBOARD_ARCHIVE_AFTER_MS;
	}
}
function resolveResetArchiveRetentionMs(maintenance) {
	const raw = maintenance?.resetArchiveRetention;
	if (raw === false) return null;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return null;
	try {
		return parseDurationMs(normalized, { defaultUnit: "d" });
	} catch {
		return null;
	}
}
function resolvePreserveRecentMs(maintenance) {
	const raw = maintenance?.preserveRecent;
	if (raw === false || raw === void 0) return null;
	try {
		return parseDurationMs(normalizeStringifiedOptionalString(raw) ?? "", { defaultUnit: "d" });
	} catch {
		return null;
	}
}
function resolveMaxDiskBytes(maintenance) {
	const raw = maintenance?.maxDiskBytes;
	if (raw === false) return null;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return DEFAULT_SESSION_MAX_DISK_BYTES;
	try {
		const bytes = parseByteSize(normalized, { defaultUnit: "b" });
		if (bytes <= 0) return null;
		return bytes;
	} catch {
		return null;
	}
}
function resolveHighWaterBytes(maintenance, maxDiskBytes) {
	if (maxDiskBytes == null) return null;
	const defaultHighWaterBytes = Math.max(1, Math.min(maxDiskBytes, Math.floor(maxDiskBytes * DEFAULT_SESSION_DISK_BUDGET_HIGH_WATER_RATIO)));
	const raw = maintenance?.highWaterBytes;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return defaultHighWaterBytes;
	try {
		const parsed = parseByteSize(normalized, { defaultUnit: "b" });
		return parsed > 0 ? Math.min(parsed, maxDiskBytes) : defaultHighWaterBytes;
	} catch {
		return defaultHighWaterBytes;
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
		archiveDashboardAfterMs: resolveArchiveDashboardAfterMs(maintenance),
		maxEntries: maintenance?.maxEntries ?? DEFAULT_SESSION_MAX_ENTRIES,
		modelRunPruneAfterMs: DEFAULT_MODEL_RUN_PRUNE_AFTER_MS,
		preserveRecentMs: resolvePreserveRecentMs(maintenance),
		resetArchiveRetentionMs: resolveResetArchiveRetentionMs(maintenance),
		maxDiskBytes,
		highWaterBytes: resolveHighWaterBytes(maintenance, maxDiskBytes)
	};
}
function normalizeResolvedMaintenanceConfigInput(maintenance) {
	return {
		...maintenance,
		archiveDashboardAfterMs: maintenance.archiveDashboardAfterMs === void 0 ? DEFAULT_DASHBOARD_ARCHIVE_AFTER_MS : maintenance.archiveDashboardAfterMs,
		modelRunPruneAfterMs: maintenance.modelRunPruneAfterMs ?? DEFAULT_MODEL_RUN_PRUNE_AFTER_MS,
		preserveRecentMs: maintenance.preserveRecentMs ?? null
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
function shouldRunModelRunPrune(params) {
	if (params.force) return params.entryCount > params.maintenance.maxEntries;
	return shouldRunSessionEntryMaintenance({
		entryCount: params.entryCount,
		maxEntries: params.maintenance.maxEntries
	});
}
function isGatewayModelRunSessionKey(sessionKey) {
	const match = /^agent:([^:\s]+):explicit:model-run-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.exec(sessionKey);
	if (!match) return false;
	const agentId = match[1];
	if (!agentId || /\s/.test(agentId)) return false;
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed || parsed.agentId !== agentId.toLowerCase()) return false;
	const rest = normalizeLowercaseStringOrEmpty(parsed.rest);
	return /^explicit:model-run-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(rest);
}
/**
* Archive stale durable entries in place; remove only disposable runtime entries.
* Entries without `updatedAt` are kept (cannot determine staleness).
* Mutates `store` in-place.
*/
function pruneStaleEntries(store, overrideMaxAgeMs, opts = {}) {
	const maxAgeMs = overrideMaxAgeMs ?? resolveMaintenanceConfigFromInput().pruneAfterMs;
	if (maxAgeMs <= 0) return 0;
	const now = Date.now();
	const cutoffMs = now - maxAgeMs;
	let pruned = 0;
	for (const [key, entry] of Object.entries(store)) {
		if (shouldPreserveMaintenanceEntry({
			key,
			entry,
			preserveKeys: opts.preserveKeys,
			preserveRecentMs: opts.preserveRecentMs
		})) continue;
		if (entry?.updatedAt != null && entry.updatedAt < cutoffMs) {
			if (isSyntheticSessionMaintenanceKey(key)) {
				opts.onPruned?.({
					key,
					entry
				});
				delete store[key];
				pruned++;
			} else {
				entry.archivedAt = now;
				delete entry.archivedBy;
				entry.archiveReason = "age-retention";
				opts.onArchived?.({
					key,
					entry
				});
			}
		}
	}
	if (pruned > 0 && opts.log !== false) log.info("pruned stale session entries", {
		pruned,
		maxAgeMs
	});
	return pruned;
}
/**
* Remove stale one-shot gateway model-run probe sessions before normal retention/capping.
* Existing polluted stores may not carry modelRun metadata, so this intentionally keys off the
* strict explicit model-run UUID session shape created by the gateway probe CLI path.
*/
function pruneStaleModelRunEntries(store, overrideMaxAgeMs, opts = {}) {
	if (overrideMaxAgeMs == null || overrideMaxAgeMs <= 0) return 0;
	const cutoffMs = Date.now() - overrideMaxAgeMs;
	let pruned = 0;
	for (const [key, entry] of Object.entries(store)) {
		if (shouldPreserveMaintenanceEntry({
			key,
			entry,
			preserveKeys: opts.preserveKeys,
			preserveRecentMs: opts.preserveRecentMs
		})) continue;
		if (!isGatewayModelRunSessionKey(key)) continue;
		if (entry?.updatedAt != null && entry.updatedAt < cutoffMs) {
			opts.onPruned?.({
				key,
				entry
			});
			delete store[key];
			pruned++;
		}
	}
	if (pruned > 0 && opts.log !== false) log.info("pruned stale gateway model-run session entries", {
		pruned,
		maxAgeMs: overrideMaxAgeMs
	});
	return pruned;
}
const DEFAULT_QUOTA_SUSPENSION_TTL_MS = 18e5;
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
	const ttlMs = params.ttlMs ?? DEFAULT_QUOTA_SUSPENSION_TTL_MS;
	const cleanupAfterResumeMs = ttlMs * 1;
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
		cleared: false
	};
	return {
		patch: null,
		cleared: false
	};
}
function getSessionMaintenanceActivityAt(entry) {
	return Math.max(entry?.lastInteractionAt ?? 0, entry?.lastActivityAt ?? 0, entry?.sessionStartedAt ?? 0, entry?.updatedAt ?? 0);
}
/** Archive inactive dashboard sessions while retaining runtime-owned or explicitly active keys. */
function archiveStaleDashboardEntries(store, archiveAfterMs, opts = {}) {
	if (archiveAfterMs == null || archiveAfterMs <= 0) return 0;
	const now = opts.nowMs ?? Date.now();
	const cutoffMs = now - archiveAfterMs;
	let archived = 0;
	for (const [key, entry] of Object.entries(store)) {
		if (!parseAgentSessionKey(key)?.rest.startsWith("dashboard:") || shouldPreserveMaintenanceEntry({
			key,
			entry,
			...opts
		})) continue;
		const activityAt = getSessionMaintenanceActivityAt(entry);
		if (activityAt <= 0 || activityAt >= cutoffMs) continue;
		entry.archivedAt = now;
		delete entry.archivedBy;
		entry.archiveReason = "stale-dashboard";
		opts.onArchived?.({
			key,
			entry
		});
		archived += 1;
	}
	if (archived > 0 && opts.log !== false) log.info("archived stale dashboard session entries", {
		archived,
		archiveAfterMs
	});
	return archived;
}
function isSyntheticSessionMaintenanceKey(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	const rest = normalizeLowercaseStringOrEmpty(parsed?.rest ?? sessionKey);
	return isGatewayModelRunSessionKey(sessionKey) || isSubagentSessionKey(sessionKey) || isAcpSessionKey(sessionKey) || isCronSessionKey(sessionKey) || rest.startsWith("acp-bridge:") || rest.startsWith("hook:") || rest.startsWith("node:") || rest === "heartbeat" || rest.endsWith(":heartbeat") || rest.includes(":heartbeat:");
}
function isRecentSessionMaintenanceEntry(params) {
	if (params.preserveRecentMs == null || isSyntheticSessionMaintenanceKey(params.key)) return false;
	const activityAt = getSessionMaintenanceActivityAt(params.entry);
	const now = params.nowMs ?? Date.now();
	return activityAt > 0 && now - activityAt <= params.preserveRecentMs;
}
function isProtectedExternalConversationSessionKey(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	const rest = normalizeLowercaseStringOrEmpty(parsed?.rest ?? sessionKey);
	return parseSessionDeliveryRoute(sessionKey) !== null || /^direct:.+$/.test(rest) || /^[^:]+:(?:group|channel):.+$/.test(rest) || /^telegram:(?:direct|dm):.+:topic:[^:]+$/.test(rest);
}
function isPrimarySessionMaintenanceKey(sessionKey) {
	if (normalizeLowercaseStringOrEmpty(sessionKey) === "global") return true;
	return parseAgentSessionKey(sessionKey)?.rest === "main";
}
function isProtectedSessionMaintenanceEntry(sessionKey, entry) {
	if (isSyntheticSessionMaintenanceKey(sessionKey)) return false;
	if (isPrimarySessionMaintenanceKey(sessionKey)) return true;
	if (parseThreadSessionSuffix(sessionKey).threadId) return true;
	if (entry?.delivery?.kind === "external" || isProtectedExternalConversationSessionKey(sessionKey)) return true;
	const chatType = normalizeLowercaseStringOrEmpty(entry?.chatType ?? sessionDeliveryOrigin(entry)?.chatType);
	return chatType === "group" || chatType === "channel" || chatType === "thread";
}
function shouldPreserveNonArchivedMaintenanceEntry(params) {
	if (params.entry?.pinnedAt !== void 0 && isPinnableSessionEntry(params.key, params.entry)) return true;
	return params.entry?.modelSelectionLocked === true || params.entry?.status === "running" || params.preserveKeys?.has(params.key) === true || isRecentSessionMaintenanceEntry(params) || isProtectedSessionMaintenanceEntry(params.key, params.entry);
}
function shouldPreserveMaintenanceEntry(params) {
	return params.entry?.archivedAt !== void 0 || shouldPreserveNonArchivedMaintenanceEntry(params);
}
function isSessionEntryDiskBudgetEvictable(params) {
	return params.entry?.archivedAt !== void 0 && params.entry.archiveReason === "active-session-cap" && !shouldPreserveNonArchivedMaintenanceEntry(params);
}
function selectSessionEntryCapVictims(store, maxEntries, preserveKeys, preserveRecentMs) {
	const keys = Object.keys(store).filter((key) => store[key]?.archivedAt === void 0);
	const overflow = keys.length - Math.max(0, maxEntries);
	if (overflow <= 0) return [];
	const eligibleKeys = keys.filter((key) => !shouldPreserveMaintenanceEntry({
		key,
		entry: store[key],
		preserveKeys,
		preserveRecentMs
	}));
	const victimCount = Math.min(overflow, eligibleKeys.length);
	if (victimCount === 0) return [];
	return eligibleKeys.toReversed().toSorted((a, b) => getSessionMaintenanceActivityAt(store[a]) - getSessionMaintenanceActivityAt(store[b])).slice(0, victimCount);
}
function getActiveSessionMaintenanceWarning(params) {
	const activeSessionKey = params.activeSessionKey.trim();
	if (!activeSessionKey) return null;
	const activeEntry = params.store[activeSessionKey];
	if (!activeEntry) return null;
	if (shouldPreserveMaintenanceEntry({
		key: activeSessionKey,
		entry: activeEntry,
		preserveKeys: params.preserveKeys,
		preserveRecentMs: params.preserveRecentMs
	})) return null;
	const cutoffMs = (params.nowMs ?? Date.now()) - params.pruneAfterMs;
	const wouldPrune = activeEntry.updatedAt != null ? activeEntry.updatedAt < cutoffMs : false;
	const keys = Object.keys(params.store);
	const wouldCap = selectSessionEntryCapVictims(params.store, params.maxEntries, params.preserveKeys, params.preserveRecentMs).includes(activeSessionKey);
	const capOutcome = wouldCap ? isSyntheticSessionMaintenanceKey(activeSessionKey) ? "remove" : "archive" : null;
	if (!wouldPrune && !wouldCap) return null;
	return {
		activeSessionKey,
		activeUpdatedAt: activeEntry.updatedAt,
		totalEntries: keys.length,
		pruneAfterMs: params.pruneAfterMs,
		maxEntries: params.maxEntries,
		wouldPrune,
		wouldCap,
		capOutcome,
		pruneOutcome: wouldPrune ? isSyntheticSessionMaintenanceKey(activeSessionKey) ? "remove" : "archive" : null
	};
}
/**
* Cap the unarchived store to N entries. Ordinary sessions are archived; synthetic runtime rows
* remain disposable and are removed. Protected rows count toward the cap but are never changed,
* so a store whose protected rows alone exceed the cap remains above it until protection is
* released.
* Mutates `store` in-place.
*/
function capEntryCount(store, maxEntries, opts = {}) {
	const victims = selectSessionEntryCapVictims(store, maxEntries, opts.preserveKeys, opts.preserveRecentMs);
	if (victims.length === 0) return 0;
	const now = opts.nowMs ?? Date.now();
	let archived = 0;
	let removed = 0;
	for (const key of victims) {
		const entry = store[key];
		if (!entry) continue;
		if (isSyntheticSessionMaintenanceKey(key)) {
			opts.onRemoved?.({
				key,
				entry
			});
			delete store[key];
			removed += 1;
		} else {
			entry.archivedAt = now;
			delete entry.archivedBy;
			entry.archiveReason = "active-session-cap";
			opts.onArchived?.({
				key,
				entry
			});
			archived += 1;
		}
	}
	if (opts.log !== false) log.info("capped unarchived session entry count", {
		archived,
		removed,
		maxEntries
	});
	return archived + removed;
}
function countUnarchivedSessionEntries(store) {
	return Object.values(store).reduce((count, entry) => count + (entry.archivedAt === void 0 ? 1 : 0), 0);
}
//#endregion
export { getSessionMaintenanceActivityAt as a, normalizeResolvedMaintenanceConfigInput as c, resolveMaintenanceConfigFromInput as d, resolveQuotaSuspensionEntryMaintenance as f, isPinnableSessionEntry as g, shouldRunSessionEntryMaintenance as h, getActiveSessionMaintenanceWarning as i, pruneStaleEntries as l, shouldRunModelRunPrune as m, capEntryCount as n, isRecentSessionMaintenanceEntry as o, shouldPreserveMaintenanceEntry as p, countUnarchivedSessionEntries as r, isSessionEntryDiskBudgetEvictable as s, archiveStaleDashboardEntries as t, pruneStaleModelRunEntries as u };
