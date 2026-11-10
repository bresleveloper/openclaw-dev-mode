import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { d as sqliteStringSet, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as SqliteSessionMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { d as shouldRunModelRunPrune, f as shouldRunSessionEntryMaintenance, i as isSessionEntryDiskBudgetEvictable, n as capEntryCount, o as pruneStaleEntries, s as pruneStaleModelRunEntries, t as archiveStaleDashboardEntries } from "./store-maintenance-BqMt1Twc.mjs";
import { t as readLegacyCompactionHistory } from "./legacy-compaction-history-DS8GebGO.mjs";
import { n as parseSessionEntryJson } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { i as canonicalizePersistedUserMessageMedia } from "./media-facts-BIPREXi-.mjs";
//#region src/config/sessions/session-accessor.sqlite-references.ts
/** Every transcript generation retained by one canonical logical-session record. */
function collectSessionStateIdsForEntry(entry) {
	const sessionIds = [];
	const add = (sessionId) => {
		const normalized = sessionId?.trim();
		if (normalized) sessionIds.push(normalized);
	};
	add(entry.sessionId);
	add(entry.previousSessionId);
	for (const sessionId of entry.usageFamilySessionIds ?? []) add(sessionId);
	for (const checkpoint of readLegacyCompactionHistory(entry)) {
		add(checkpoint.sessionId);
		add(checkpoint.preCompaction.sessionId);
		add(checkpoint.postCompaction.sessionId);
	}
	return uniqueStrings(sessionIds);
}
/** Retained logical owners protect generations absent from their entry references. */
function addRetainedWindowSessionReferences(database, sessionIds, excludedSessionKeys, candidateSessionIds, diskBudget) {
	let query = getSessionKysely(database.db).selectFrom("session_windows").innerJoin("session_nodes", "session_nodes.session_key", "session_windows.session_key").select([
		"session_windows.session_id",
		"session_nodes.session_key",
		"session_nodes.current_session_id",
		"session_nodes.updated_at",
		"session_nodes.pinned_at"
	]).$if(diskBudget !== void 0, (projection) => projection.select("session_nodes.entry_json")).where((eb) => eb.or([eb("session_nodes.archived_at", "is not", null), eb("session_nodes.pinned_at", "is not", null)]));
	if (candidateSessionIds) query = query.where("session_windows.session_id", "in", sqliteStringSet(candidateSessionIds));
	for (const row of iterateSqliteQuerySync(database.db, query)) {
		if (excludedSessionKeys.has(row.session_key)) continue;
		if (diskBudget && row.pinned_at === null && row.entry_json !== void 0 && isSessionEntryDiskBudgetEvictable({
			key: row.session_key,
			entry: parseSessionEntryJson({
				...row,
				entry_json: row.entry_json
			}) ?? void 0,
			preserveRecentMs: diskBudget.preserveRecentMs
		})) continue;
		sessionIds.add(row.session_id);
	}
}
//#endregion
//#region src/config/sessions/store-maintenance-plan.ts
/** Mutate working images only; callers own warn mode, protected keys, reads, and persistence. */
function planSessionEntryMaintenance(params) {
	const runModelRunPrune = shouldRunModelRunPrune({
		maintenance: params.maintenance,
		entryCount: params.initialUnarchivedCount,
		force: params.forceMaintenance
	});
	const candidateAges = [
		params.maintenance.pruneAfterMs,
		params.maintenance.archiveDashboardAfterMs,
		runModelRunPrune ? params.maintenance.modelRunPruneAfterMs : null
	].filter((age) => age != null && age > 0);
	const store = params.readAgeCandidates(candidateAges.length > 0 ? Math.min(...candidateAges) : null);
	let remainingUnarchivedCount = params.initialUnarchivedCount;
	const counts = {
		archived: 0,
		capArchived: 0,
		modelRunPruned: 0,
		pruned: 0,
		capped: 0
	};
	const options = {
		log: params.log,
		preserveRecentMs: params.maintenance.preserveRecentMs
	};
	let protectedOptions;
	const readProtectedOptions = () => protectedOptions ??= {
		...options,
		preserveKeys: params.readPreserveKeys()
	};
	const ageOptions = Object.keys(store).length > 0 ? readProtectedOptions() : options;
	const recordRemoval = (candidate, reason) => {
		remainingUnarchivedCount -= 1;
		params.onRemoved?.(candidate, reason);
	};
	const recordArchive = (candidate, phase) => {
		remainingUnarchivedCount -= 1;
		counts.archived += 1;
		if (phase === "cap") counts.capArchived += 1;
		params.onArchived?.(candidate, phase);
	};
	if (runModelRunPrune) counts.modelRunPruned = pruneStaleModelRunEntries(store, params.maintenance.modelRunPruneAfterMs, {
		...ageOptions,
		onPruned: (candidate) => recordRemoval(candidate, "model-run-pruned")
	});
	archiveStaleDashboardEntries(store, params.maintenance.archiveDashboardAfterMs, {
		...ageOptions,
		onArchived: (candidate) => recordArchive(candidate, "dashboard")
	});
	counts.pruned = pruneStaleEntries(store, params.maintenance.pruneAfterMs, {
		...ageOptions,
		onPruned: (candidate) => recordRemoval(candidate, "pruned"),
		onArchived: (candidate) => recordArchive(candidate, "age")
	});
	if (shouldRunSessionEntryMaintenance({
		entryCount: remainingUnarchivedCount,
		maxEntries: params.maintenance.maxEntries,
		force: params.forceMaintenance
	})) {
		const cap = params.readCapCandidates(remainingUnarchivedCount);
		if (cap && Object.keys(cap.store).length > 0) counts.capped = capEntryCount(cap.store, cap.maxEntries, {
			...readProtectedOptions(),
			onArchived: (candidate) => {
				if (cap.store !== store) store[candidate.key] = candidate.entry;
				recordArchive(candidate, "cap");
			},
			onRemoved: (candidate) => recordRemoval(candidate, "capped")
		});
	}
	return {
		store,
		...counts
	};
}
//#endregion
//#region src/config/sessions/store-maintenance-preserve-snapshot.ts
function addSessionMaintenancePreserveKeys(keys, values) {
	for (const value of values ?? []) {
		const normalized = normalizeStoreSessionKey(value ?? "");
		if (normalized) keys.add(normalized);
	}
}
function collectSessionWorkAdmissionKeysFromSnapshot(store, identities) {
	if (identities.length === 0) return /* @__PURE__ */ new Set();
	const active = new Set(identities);
	const normalized = new Set(identities.map(normalizeStoreSessionKey));
	const keys = /* @__PURE__ */ new Set();
	for (const [key, entry] of Object.entries(store)) {
		const normalizedKey = normalizeStoreSessionKey(key);
		if (normalized.has(normalizedKey) || active.has(entry.sessionId)) {
			keys.add(key);
			keys.add(normalizedKey);
		}
	}
	return keys;
}
/** Resolve parent-owned protection against the worker's current row projection. */
function resolveSessionMaintenancePreserveKeys(params) {
	const keys = new Set(params.snapshot.providerKeys);
	addSessionMaintenancePreserveKeys(keys, params.baseKeys);
	for (const key of collectSessionWorkAdmissionKeysFromSnapshot(params.store, params.snapshot.workIdentities)) keys.add(key);
	if (params.snapshot.lifecycleIdentities.length > 0) {
		const lifecycle = new Set(params.snapshot.lifecycleIdentities);
		for (const [key, entry] of Object.entries(params.store)) {
			const normalizedKey = normalizeStoreSessionKey(key);
			if ([
				key,
				normalizedKey,
				entry.sessionId
			].some((identity) => Boolean(identity?.trim()) && lifecycle.has(identity.trim()))) {
				keys.add(key);
				keys.add(normalizedKey);
			}
		}
	}
	return keys;
}
function assertMaintenancePreservationCompatible(sent, current, plans) {
	const added = new Set([
		"providerKeys",
		"workIdentities",
		"lifecycleIdentities"
	].flatMap((kind) => {
		const previous = new Set(sent[kind].map((id) => id.trim()));
		return current[kind].flatMap((id) => previous.has(id.trim()) ? [] : [id.trim(), normalizeStoreSessionKey(id)]).filter(Boolean);
	}));
	if (added.size === 0) return;
	const protectsRow = (sessionKey, sessionId) => added.has(sessionKey.trim()) || added.has(normalizeStoreSessionKey(sessionKey)) || sessionId && added.has(sessionId.trim());
	if (!plans || plans.some((plan) => plan.entryRemovals.some((row) => protectsRow(row.sessionKey, row.expectedEntry?.sessionId)) || plan.archivedEntries.some((row) => protectsRow(row.sessionKey, row.sessionId)) || plan.stateDeletePlans.some((row) => protectsRow("", row.sessionId)))) throw new SqliteSessionMutationConflictError("session maintenance");
}
//#endregion
//#region src/config/sessions/transcript-event-media.ts
function canonicalizeTranscriptEventMedia(event) {
	if (!isRecord(event)) return event;
	const message = event.message;
	if (event.type !== "message" || !isRecord(message)) return event;
	const canonical = canonicalizePersistedUserMessageMedia(message);
	return canonical.changed ? {
		...event,
		message: canonical.message
	} : event;
}
//#endregion
export { resolveSessionMaintenancePreserveKeys as a, collectSessionStateIdsForEntry as c, collectSessionWorkAdmissionKeysFromSnapshot as i, addSessionMaintenancePreserveKeys as n, planSessionEntryMaintenance as o, assertMaintenancePreservationCompatible as r, addRetainedWindowSessionReferences as s, canonicalizeTranscriptEventMedia as t };
