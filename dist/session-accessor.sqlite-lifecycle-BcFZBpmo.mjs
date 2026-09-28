import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { a as iterateSqliteQuerySync, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { a as deferOpenClawAgentPostCommitPublication, l as openOpenClawAgentDatabase, s as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-CaQAStOA.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-qsg5dB6v.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { a as isAgentHarnessSessionKey, c as isValidAgentHarnessSessionStoreEntry, d as resolveAgentHarnessSessionStoreEntryError, i as MODEL_SELECTION_LOCK_REMOVAL_MESSAGE } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { a as getSessionKysely, c as resolveSqliteAgentId, d as resolveSqliteStoreScope, f as resolveSqliteTranscriptArchiveDirectory, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite, l as resolveSqliteReadScope, n as cloneSessionEntry, t as captureLifecycleDatabaseScope, v as withSqliteSessionDatabase } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { d as selectSessionTranscriptLeafControlledPath } from "./transcript-tree-3xvvNd9-.mjs";
import { n as emitSessionLifecycleEvent, t as emitSessionIdentityMutation } from "./session-lifecycle-events-DiXxneBV.mjs";
import { i as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-BBylVEaq.mjs";
import { r as readSessionEntryStore } from "./session-accessor.sqlite-entry-inventory-BGtMQ0LB.mjs";
import { J as runSqliteSessionDeletionTransaction, K as hasPreparedNativeSessionDeletion, Q as deletePersonalGitHubSessionReceipts, X as withSqliteSessionDeletions, bt as sqliteSessionEntriesEqual, f as writeSessionEntry, o as readLifecycleTargetSnapshot, t as assertLifecycleTargetUnchanged } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-BKdpL7km.mjs";
import { l as loadTranscriptEventsFromDatabase } from "./session-accessor.sqlite-read-DO8t28O6.mjs";
import { a as ensureTranscriptHeader, h as resolveResetBoundaryHeaderCwd, n as appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-B4Sq8ywF.mjs";
import { l as withSqliteTranscriptArchiveSession, n as materializeSessionStateDeletePlans } from "./session-accessor.sqlite-archive-DRWDbZcu.mjs";
import { d as readSessionGenerationIdsForKeys, h as emitArchivedTranscriptUpdates, m as publishSessionStateArchives, n as collectProjectedReferencedSessionIds, o as planSessionStateAfterEntryRemoval, s as planSessionStateDeleteIfUnreferenced, u as readReferencedSessionIdsAfterTargetMutation } from "./session-accessor.sqlite-lifecycle-state-CqA46R2u.mjs";
import { c as prepareHistoricalGenerationDeletions, f as runExclusiveSqliteSessionReclamation, i as createSessionEntryReclamationPlan, l as readValidatedSessionDeletionTarget, m as shouldDeleteSqliteSessionEntryLifecycle, p as runSqliteSessionReclamation, r as createLifecycleArtifactReclamationPlan, t as createHistoricalGenerationReclamationPlan } from "./session-accessor.sqlite-reclamation-CIUc3kgC.mjs";
import { i as kickSessionHistoryDiskBudgetMaintenance, s as refreshSqliteSessionPlannerStatisticsBestEffort, t as collectAdmissionProtectedSessionIds } from "./session-history-eviction-CU52ceGq.mjs";
import { t as clearSessionProgressCardForReset } from "./progress-card-store-CSd5VsSx.mjs";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/config/sessions/session-accessor.sqlite-lifecycle-artifacts.ts
function sessionKeySegmentStartsWith(sessionKey, prefix) {
	const firstSeparator = sessionKey.indexOf(":");
	if (firstSeparator < 0) return sessionKey.startsWith(prefix);
	const secondSeparator = sessionKey.indexOf(":", firstSeparator + 1);
	return (secondSeparator < 0 ? sessionKey : sessionKey.slice(secondSeparator + 1)).startsWith(prefix);
}
function sessionKeyBelongsToAgent(sessionKey, agentId) {
	if (agentId === void 0) return true;
	const parsed = parseAgentSessionKey(sessionKey);
	return parsed !== null && normalizeAgentId(parsed.agentId) === normalizeAgentId(agentId);
}
function readSessionTranscriptUpdatedAt(database, sessionId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select((eb) => eb.fn.max("created_at").as("updated_at")).where("session_id", "=", sessionId));
	if (row?.updated_at === null || row?.updated_at === void 0) return;
	return coerceRequiredSqliteNumber(row.updated_at);
}
function sqliteTranscriptStateIsReclaimable(params) {
	if (params.sessionUpdatedAt !== void 0 && params.nowMs - params.sessionUpdatedAt < params.orphanTranscriptMinAgeMs) return false;
	const transcriptUpdatedAt = readSessionTranscriptUpdatedAt(params.database, params.sessionId);
	const updatedAt = params.sessionUpdatedAt === void 0 ? transcriptUpdatedAt : Math.max(params.sessionUpdatedAt, transcriptUpdatedAt ?? params.sessionUpdatedAt);
	return updatedAt === void 0 || params.nowMs - updatedAt >= params.orphanTranscriptMinAgeMs;
}
function sqliteTranscriptStateHasMarker(params) {
	const startedAt = params.diagnostics ? performance.now() : 0;
	if (params.diagnostics) params.diagnostics.markerWindows = (params.diagnostics.markerWindows ?? 0) + 1;
	try {
		const db = getSessionKysely(params.database.db);
		const rows = iterateSqliteQuerySync(params.database.db, db.selectFrom("transcript_events").select(transcriptEventJsonSql(params.database.db).as("event_json")).where("session_id", "=", params.sessionId).orderBy("seq", "asc"));
		let hasMarker = false;
		for (const row of rows) {
			if (params.diagnostics) params.diagnostics.markerRows = (params.diagnostics.markerRows ?? 0) + 1;
			hasMarker ||= row.event_json.includes(params.transcriptContentMarker);
		}
		return hasMarker;
	} finally {
		if (params.diagnostics) params.diagnostics.markerScanMs = (params.diagnostics.markerScanMs ?? 0) + performance.now() - startedAt;
	}
}
function planSqliteOrphanLifecycleTranscriptStateDeletes(params) {
	const db = getSessionKysely(params.database.db);
	const rows = executeSqliteQuerySync(params.database.db, db.selectFrom("session_windows").select([
		"session_id",
		"session_key",
		"plugin_owner_id"
	]).orderBy("session_id", "asc")).rows;
	if (params.diagnostics) params.diagnostics.windowRows = rows.length;
	const deletePlans = [];
	for (const row of rows) {
		if (!sessionKeyBelongsToAgent(row.session_key, params.agentId) || params.referencedSessionIds.has(row.session_id) || params.excludedSessionIds?.has(row.session_id) || params.pluginOwnerId && row.plugin_owner_id && row.plugin_owner_id !== params.pluginOwnerId) continue;
		if (!sqliteTranscriptStateIsReclaimable({
			database: params.database,
			sessionId: row.session_id,
			nowMs: params.nowMs,
			orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs
		}) || !sqliteTranscriptStateHasMarker({
			database: params.database,
			sessionId: row.session_id,
			transcriptContentMarker: params.transcriptContentMarker,
			diagnostics: params.diagnostics
		})) continue;
		const plan = planSessionStateDeleteIfUnreferenced({
			archiveTranscript: params.archiveRemovedEntryTranscripts,
			archiveDirectory: params.archiveDirectory,
			database: params.database,
			reason: "deleted",
			referencedSessionIds: params.referencedSessionIds,
			sessionId: row.session_id
		});
		if (plan) deletePlans.push(plan);
	}
	return deletePlans;
}
/** A negative selection skips planning; the planner still owns every deletion decision. */
function hasSessionLifecycleArtifactCleanupCandidates(database, params, inspectOrphanTranscripts) {
	const db = getSessionKysely(database.db);
	for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_nodes").select("session_key"))) if (sessionKeyBelongsToAgent(row.session_key, params.agentId) && sessionKeySegmentStartsWith(row.session_key, params.sessionKeySegmentPrefix)) return true;
	const windows = iterateSqliteQuerySync(database.db, db.selectFrom("session_windows").select([
		"session_id",
		"session_key",
		"plugin_owner_id"
	]).where("session_id", "not in", db.selectFrom("session_nodes").select("current_session_id")).orderBy("session_id", "asc"));
	for (const row of windows) {
		if (!sessionKeyBelongsToAgent(row.session_key, params.agentId) || params.pluginOwnerId && row.plugin_owner_id && row.plugin_owner_id !== params.pluginOwnerId) continue;
		if (!inspectOrphanTranscripts) return true;
		if (sqliteTranscriptStateIsReclaimable({
			database,
			sessionId: row.session_id,
			nowMs: params.nowMs,
			orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs
		}) && sqliteTranscriptStateHasMarker({
			database,
			sessionId: row.session_id,
			transcriptContentMarker: params.transcriptContentMarker
		})) return true;
	}
	return false;
}
/** Called inside the lifecycle writer FIFO; only candidate stores need writable preparation. */
async function prepareSessionLifecycleArtifactCleanup(databaseOptions, params) {
	const cachedDatabase = getOpenClawAgentDatabaseIfOpen(databaseOptions);
	if (!cachedDatabase) try {
		const candidates = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => hasSessionLifecycleArtifactCleanupCandidates(database, params, true)), databaseOptions);
		if (!candidates.found || !candidates.value) return {
			entries: [],
			deletePlans: []
		};
	} catch {}
	return withSqliteSessionDatabase(databaseOptions, (database) => {
		if (cachedDatabase) try {
			if (!runSqliteDeferredTransactionSync(database.db, () => {
				assertCanonicalSqliteSessionKeysCurrent(database);
				return hasSessionLifecycleArtifactCleanupCandidates(database, params, false);
			})) return {
				entries: [],
				deletePlans: []
			};
		} catch {}
		return planSessionLifecycleArtifactCleanup(database, params);
	}, void 0, params.diagnostics);
}
function planSessionLifecycleArtifactCleanup(database, params) {
	const diagnostics = params.diagnostics;
	let phase = "nodeInventoryMs";
	let phaseStartedAt = diagnostics ? performance.now() : 0;
	if (diagnostics) {
		diagnostics.markerScanMs = 0;
		diagnostics.markerRows = 0;
		diagnostics.markerWindows = 0;
		diagnostics.completed = false;
	}
	const recordPhase = (next) => {
		if (diagnostics) {
			const finishedAt = performance.now();
			diagnostics[phase] = (diagnostics[phase] ?? 0) + finishedAt - phaseStartedAt;
			phaseStartedAt = finishedAt;
		}
		if (next) phase = next;
	};
	try {
		const db = getSessionKysely(database.db);
		const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
			"session_key",
			"current_session_id",
			"updated_at"
		]).orderBy("session_key", "asc")).rows;
		if (diagnostics) diagnostics.nodeRows = rows.length;
		const removedSessionIds = /* @__PURE__ */ new Set();
		const entries = [];
		const projectedStore = readSessionEntryStore(database);
		const foreignOwnedSessionIds = params.pluginOwnerId ? new Set(executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").where("plugin_owner_id", "is not", null).where("plugin_owner_id", "!=", params.pluginOwnerId)).rows.map((row) => row.session_id)) : void 0;
		for (const row of rows) {
			if (!sessionKeyBelongsToAgent(row.session_key, params.agentId) || !sessionKeySegmentStartsWith(row.session_key, params.sessionKeySegmentPrefix)) continue;
			const entry = projectedStore[row.session_key];
			const sessionIds = uniqueStrings([row.current_session_id, ...entry ? collectSessionStateIdsForEntry(entry) : []]);
			if (params.pluginOwnerId && entry?.pluginOwnerId && entry.pluginOwnerId !== params.pluginOwnerId || sessionIds.some((sessionId) => foreignOwnedSessionIds?.has(sessionId))) continue;
			if (!sqliteTranscriptStateIsReclaimable({
				database,
				sessionUpdatedAt: coerceRequiredSqliteNumber(row.updated_at),
				sessionId: row.current_session_id,
				nowMs: params.nowMs,
				orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs
			})) continue;
			for (const sessionId of sessionIds) removedSessionIds.add(sessionId);
			entries.push({
				expectedEntry: entry ? cloneSessionEntry(entry) : void 0,
				sessionKey: row.session_key
			});
			delete projectedStore[row.session_key];
		}
		if (diagnostics) diagnostics.selectedEntries = entries.length;
		recordPhase("referencePlanningMs");
		const referencedSessionIds = collectProjectedReferencedSessionIds({
			database,
			excludedSessionKeys: entries.map((entry) => entry.sessionKey),
			projectedStore
		});
		if (diagnostics) diagnostics.referenceIds = referencedSessionIds.size;
		const deletePlans = [];
		for (const sessionId of removedSessionIds) {
			const plan = planSessionStateDeleteIfUnreferenced({
				archiveTranscript: params.archiveRemovedEntryTranscripts,
				archiveDirectory: params.archiveDirectory,
				database,
				referencedSessionIds,
				sessionId
			});
			if (plan) deletePlans.push(plan);
		}
		recordPhase("orphanPlanningMs");
		deletePlans.push(...planSqliteOrphanLifecycleTranscriptStateDeletes({
			...params.agentId ? { agentId: params.agentId } : {},
			archiveRemovedEntryTranscripts: params.archiveRemovedEntryTranscripts,
			archiveDirectory: params.archiveDirectory,
			database,
			excludedSessionIds: removedSessionIds,
			...params.pluginOwnerId ? { pluginOwnerId: params.pluginOwnerId } : {},
			referencedSessionIds,
			transcriptContentMarker: params.transcriptContentMarker,
			orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs,
			nowMs: params.nowMs,
			diagnostics
		}));
		if (diagnostics) {
			diagnostics.deletePlans = deletePlans.length;
			diagnostics.completed = true;
		}
		return {
			deletePlans,
			entries
		};
	} finally {
		recordPhase();
		if (diagnostics?.orphanPlanningMs !== void 0) diagnostics.orphanPlanningMs -= diagnostics.markerScanMs ?? 0;
	}
}
//#endregion
//#region src/config/sessions/transcript-replay.ts
/** Tail kept so DM continuity survives silent session rotations. */
const DEFAULT_REPLAY_MAX_MESSAGES = 6;
function isValidReplayTimestamp(value) {
	if (typeof value === "number") return Number.isFinite(value);
	return typeof value === "string" && value.trim().length > 0;
}
function replayableTranscriptRole(record) {
	if (!record || record.type !== "message" || typeof record.id !== "string" || record.id.trim().length === 0 || !isValidReplayTimestamp(record.timestamp) || !(record.parentId === null || record.parentId === void 0 || typeof record.parentId === "string")) return;
	const role = record.message?.role;
	return role === "user" || role === "assistant" ? role : void 0;
}
function selectRecentUserAssistantReplayRecords(records, maxMessages = DEFAULT_REPLAY_MAX_MESSAGES) {
	const max = Math.max(0, maxMessages);
	if (max === 0) return [];
	const kept = [];
	for (const record of records) {
		const role = replayableTranscriptRole(record);
		if (role) kept.push({
			role,
			record
		});
	}
	return selectAlternatingReplayTail(kept, max).map((entry) => entry.record);
}
function selectAlternatingReplayTail(kept, max) {
	if (kept.length === 0) return [];
	let startIdx = Math.max(0, kept.length - max);
	while (startIdx < kept.length && kept[startIdx]?.role === "assistant") startIdx += 1;
	if (startIdx === kept.length) return [];
	return coalesceAlternatingReplayTail(kept.slice(startIdx));
}
function coalesceAlternatingReplayTail(entries) {
	const tail = [];
	for (const entry of entries) {
		const lastIdx = tail.length - 1;
		if (lastIdx >= 0 && tail[lastIdx]?.role === entry.role) {
			tail[lastIdx] = entry;
			continue;
		}
		tail.push(entry);
	}
	return tail;
}
//#endregion
//#region src/config/sessions/session-reset-boundary-event.ts
function recordId(record) {
	if (!record || typeof record !== "object" || Array.isArray(record)) return;
	const id = record.id;
	return typeof id === "string" && id.trim() ? id : void 0;
}
function uniqueBoundaryId(records) {
	const ids = new Set(records.flatMap((record) => recordId(record) ? [recordId(record)] : []));
	for (;;) {
		const id = randomUUID().slice(0, 8);
		if (!ids.has(id)) return id;
	}
}
function projectLatestBoundaryWindow(entries) {
	const boundaryIndex = entries.findLastIndex((entry) => {
		const type = entry && typeof entry === "object" && !Array.isArray(entry) ? entry.type : void 0;
		return type === "compaction" || type === "reset";
	});
	if (boundaryIndex < 0) return [...entries];
	const boundary = entries[boundaryIndex];
	const firstKeptIndex = typeof boundary.firstKeptEntryId === "string" ? entries.findIndex((entry, index) => index < boundaryIndex && recordId(entry) === boundary.firstKeptEntryId) : -1;
	return [...firstKeptIndex < 0 ? [] : entries.slice(firstKeptIndex, boundaryIndex).filter((entry) => {
		const role = entry?.message?.role;
		return role === "user" || role === "assistant";
	}), ...entries.slice(boundaryIndex + 1)];
}
function buildSessionResetBoundaryEvent(params) {
	const entries = params.events.filter((event) => event !== null && typeof event === "object" && !Array.isArray(event) && event.type !== "session");
	const activeEntries = selectSessionTranscriptLeafControlledPath(entries) ?? entries;
	const firstKeptEntryId = recordId((params.context === "preserve-tail" ? selectRecentUserAssistantReplayRecords(projectLatestBoundaryWindow(activeEntries)) : [])[0]);
	return {
		type: "reset",
		id: uniqueBoundaryId(params.events),
		parentId: recordId(activeEntries.at(-1)) ?? null,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		reason: params.reason,
		...firstKeptEntryId ? { firstKeptEntryId } : {}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-reset-boundary.ts
/** Transcript reset and prior-task retirement share the owning guarded transaction. */
function appendSessionResetBoundary(database, scope, previousEntry, boundary) {
	ensureTranscriptHeader(database, scope, resolveResetBoundaryHeaderCwd(previousEntry, boundary.cwd));
	const event = buildSessionResetBoundaryEvent({
		events: loadTranscriptEventsFromDatabase(database, scope.sessionId, { projection: "reset-boundary" }),
		...boundary
	});
	if (appendTranscriptEventsInTransaction(database, scope, [event]) !== 1) throw new Error("Failed to append reset boundary for " + scope.sessionKey);
	if (boundary.context === "clear" && clearSessionProgressCardForReset(database.db, scope.sessionKey)) {
		const { agentId, sessionKey } = scope;
		deferOpenClawAgentPostCommitPublication(database, () => {
			emitSessionLifecycleEvent({
				agentId,
				sessionKey,
				reason: "progress-card-reset"
			});
		});
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-lifecycle.ts
async function withCommittedHistoryMaintenance({ agentId, env, storePath }, run, options = {}) {
	let committed = false;
	try {
		return await run((database) => {
			deferOpenClawAgentPostCommitPublication(database, () => {
				committed = true;
			});
		}, () => {
			committed = true;
		});
	} finally {
		if (committed && options.scheduleNext !== false) kickSessionHistoryDiskBudgetMaintenance({
			agentId,
			env,
			storePath,
			force: true
		});
	}
}
async function cleanupSessionLifecycleArtifactsCore(params) {
	const sessionKeySegmentPrefix = params.sessionKeySegmentPrefix.trim();
	const transcriptContentMarker = params.transcriptContentMarker;
	const pluginOwnerId = params.pluginOwnerId?.trim();
	if (!sessionKeySegmentPrefix || !transcriptContentMarker) return {
		removedEntries: 0,
		archivedTranscriptArtifacts: 0
	};
	const resolved = captureLifecycleDatabaseScope(resolveSqliteReadScope({
		...params.agentId ? { agentId: params.agentId } : {},
		storePath: params.storePath
	}));
	const databaseOptions = toDatabaseOptions(resolved);
	const artifactPreparation = {};
	const cleanupPlan = await runExclusiveSqliteSessionWrite(resolved, async () => prepareSessionLifecycleArtifactCleanup(databaseOptions, {
		...params.agentId !== void 0 ? { agentId: resolved.agentId } : {},
		archiveRemovedEntryTranscripts: params.archiveRemovedEntryTranscripts !== false,
		archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
		...pluginOwnerId ? { pluginOwnerId } : {},
		sessionKeySegmentPrefix,
		transcriptContentMarker,
		orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs,
		nowMs: params.nowMs ?? Date.now(),
		diagnostics: artifactPreparation
	}), "session.lifecycle.artifacts-prepare", { artifactPreparation });
	if (cleanupPlan.entries.length === 0 && cleanupPlan.deletePlans.length === 0) {
		await publishSessionStateArchives(resolved, []);
		return {
			removedEntries: 0,
			archivedTranscriptArtifacts: 0
		};
	}
	const committed = await withSqliteSessionDeletions(resolved, cleanupPlan.entries.flatMap(({ expectedEntry: entry, sessionKey }) => entry ? [{
		entry,
		sessionKey
	}] : []), async (assertCurrent) => await runExclusiveSqliteSessionReclamation(async () => {
		const materializedPlans = await materializeSessionStateDeletePlans(cleanupPlan.deletePlans);
		const diagnostics = {};
		const plan = createLifecycleArtifactReclamationPlan({
			agentId: resolved.agentId,
			databaseOptions,
			entries: cleanupPlan.entries,
			materializedPlans
		});
		const reclaimed = await runSqliteSessionReclamation({
			diagnostics,
			assertCommitAllowed: assertCurrent,
			forceInProcess: hasPreparedNativeSessionDeletion(),
			plan
		});
		if (reclaimed.kind !== plan.kind) throw new Error(`SQLite session reclamation returned ${reclaimed.kind} for ${plan.kind}`);
		return reclaimed.value;
	}), { additionalIdentities: cleanupPlan.deletePlans.map((plan) => plan.sessionId) });
	const deletedEntries = Math.max(committed.removedEntries, new Set(cleanupPlan.deletePlans.map((plan) => plan.sessionId)).size);
	await refreshSqliteSessionPlannerStatisticsBestEffort(resolved, deletedEntries);
	const archivedTranscripts = await publishSessionStateArchives(resolved, committed.archivedTranscripts);
	return {
		removedEntries: committed.removedEntries,
		archivedTranscriptArtifacts: archivedTranscripts.length
	};
}
/** Resets one persisted session entry using SQLite session rows. */
async function resetSessionEntryLifecycle(params) {
	const agentId = params.agentId ?? parseAgentSessionKey(params.target.canonicalKey)?.agentId;
	const resolved = resolveSqliteStoreScope(params.storePath, { agentId });
	if (params.resetBoundary) {
		params.commitGuard?.();
		const source = withOpenClawAgentDatabaseReadOnly((database) => readLifecycleTargetSnapshot(database, params.target)[0]?.entry.sessionId, toDatabaseOptions(resolved));
		if (source.found && source.value) {
			const { restoreSessionColdTranscript } = await import("./session-cold-storage-CDCnO_Bk.mjs");
			await restoreSessionColdTranscript({
				agentId: resolved.agentId,
				env: resolved.env,
				storePath: params.storePath,
				sessionId: source.value
			});
		}
	}
	return await withCommittedHistoryMaintenance({
		agentId: resolved.agentId,
		storePath: params.storePath
	}, async (recordCommit) => runExclusiveSqliteSessionWrite(resolved, async () => {
		params.commitGuard?.();
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const targetSnapshot = readLifecycleTargetSnapshot(database, params.target);
		const current = targetSnapshot[0];
		const nextEntry = await params.buildNextEntry({
			currentEntry: current ? cloneSessionEntry(current.entry) : void 0,
			primaryKey: params.target.canonicalKey
		});
		const shouldAppendResetBoundary = params.resetBoundary && current?.entry.sessionId && !sqliteSessionEntriesEqual(current.entry, nextEntry);
		const mutation = {
			nextEntry: cloneSessionEntry(nextEntry),
			...current ? { previousEntry: cloneSessionEntry(current.entry) } : {},
			...current?.entry.sessionId ? { previousSessionId: current.entry.sessionId } : {}
		};
		runSqliteSessionDeletionTransaction((transactionDb) => {
			params.commitGuard?.();
			assertLifecycleTargetUnchanged(transactionDb, params.target, current?.entry, "reset");
			if (shouldAppendResetBoundary && current?.entry.sessionId && params.resetBoundary) appendSessionResetBoundary(transactionDb, {
				...resolved,
				sessionId: current.entry.sessionId,
				sessionKey: current.sessionKey
			}, current.entry, params.resetBoundary);
			writeSessionEntry(transactionDb, params.target.canonicalKey, nextEntry, { previousEntry: current?.entry ?? null });
			recordCommit(transactionDb);
		}, toDatabaseOptions(resolved));
		if (current) emitSessionIdentityMutation({
			agentId: resolved.agentId,
			kind: "reset",
			previous: {
				...current.entry.sessionId ? { sessionId: current.entry.sessionId } : {},
				sessionKeys: targetSnapshot.map((row) => row.sessionKey)
			},
			current: {
				...nextEntry.sessionId ? { sessionId: nextEntry.sessionId } : {},
				sessionKeys: [params.target.canonicalKey]
			}
		});
		else emitSessionIdentityMutation({
			agentId: resolved.agentId,
			kind: "create",
			previous: { sessionKeys: [] },
			current: {
				...nextEntry.sessionId ? { sessionId: nextEntry.sessionId } : {},
				sessionKeys: [params.target.canonicalKey]
			}
		});
		await params.afterEntryMutation?.(mutation);
		return {
			...mutation,
			archivedTranscripts: []
		};
	}, "session.lifecycle.reset"));
}
async function deleteSqliteSessionEntryLifecycleInternal(params, allowLockedEntryRemoval, expectedPluginOwnerId) {
	const agentId = params.agentId ?? parseAgentSessionKey(params.target.canonicalKey)?.agentId;
	const resolved = captureLifecycleDatabaseScope(resolveSqliteStoreScope(params.storePath, { agentId }));
	return await withCommittedHistoryMaintenance({
		...params,
		env: resolved.env
	}, async (recordCommit, markCommitted) => withSqliteTranscriptArchiveSession(toDatabaseOptions(resolved), () => deleteSqliteSessionEntryLifecycleLocked(resolved, params, allowLockedEntryRemoval, expectedPluginOwnerId, recordCommit, markCommitted)));
}
const DELETE_EXPECTED_ENTRY_MISMATCH = Symbol("delete-expected-entry-mismatch");
async function deleteSqliteSessionEntryLifecycleLocked(resolved, params, allowLockedEntryRemoval, expectedPluginOwnerId, recordCommit, markCommitted) {
	const databaseOptions = toDatabaseOptions(resolved);
	const prepared = await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionDatabase(databaseOptions, (database) => {
		const targetSnapshot = readLifecycleTargetSnapshot(database, params.target);
		const current = targetSnapshot[0];
		if (!current) return null;
		if (!shouldDeleteSqliteSessionEntryLifecycle(database, current.entry, params)) return DELETE_EXPECTED_ENTRY_MISMATCH;
		if (current.entry.modelSelectionLocked === true && !allowLockedEntryRemoval) throw new Error(MODEL_SELECTION_LOCK_REMOVAL_MESSAGE);
		if (expectedPluginOwnerId && targetSnapshot.some(({ entry, sessionKey }) => isAgentHarnessSessionKey(sessionKey) || entry.agentHarnessId !== void 0 || entry.modelSelectionLocked !== true || normalizeOptionalString(entry.pluginOwnerId) !== expectedPluginOwnerId)) throw new Error(MODEL_SELECTION_LOCK_REMOVAL_MESSAGE);
		const deleteTranscriptState = params.archiveTranscript || params.deleteTranscriptWithoutArchive === true;
		const ownedGenerationIds = deleteTranscriptState ? readSessionGenerationIdsForKeys(database, [
			params.target.canonicalKey,
			...params.target.storeKeys,
			...targetSnapshot.map((row) => row.sessionKey)
		]) : [];
		const referencedAfterDelete = readReferencedSessionIdsAfterTargetMutation(database, params.target, deleteTranscriptState ? [.../* @__PURE__ */ new Set([...targetSnapshot.flatMap(({ entry }) => collectSessionStateIdsForEntry(entry)), ...ownedGenerationIds])] : []);
		const archiveDirectory = resolveSqliteTranscriptArchiveDirectory(resolved);
		const entryPlans = deleteTranscriptState ? targetSnapshot.flatMap(({ entry }) => planSessionStateAfterEntryRemoval({
			archiveDirectory,
			archiveTranscript: params.archiveTranscript,
			database,
			entry,
			reason: "deleted",
			referencedSessionIds: referencedAfterDelete
		})) : [];
		const entryPlanIds = new Set(entryPlans.map((plan) => plan.sessionId));
		const historicalGenerationIds = deleteTranscriptState ? ownedGenerationIds.filter((sessionId) => !entryPlanIds.has(sessionId)) : [];
		const preflightFence = collectAdmissionProtectedSessionIds({
			database,
			storePath: params.storePath
		});
		for (const sessionId of historicalGenerationIds) if (preflightFence.has(sessionId) && !referencedAfterDelete.has(sessionId)) throw new Error(`cannot delete session history while work is in flight for ${sessionId}; retry after the run completes`);
		return {
			archiveDirectory,
			current,
			entryPlans,
			historicalGenerationIds,
			targetSnapshot
		};
	}, () => params.commitGuard?.()), "session.lifecycle.delete-prepare");
	if (!prepared) {
		await publishSessionStateArchives(resolved, []);
		return {
			archivedTranscripts: [],
			deleted: false
		};
	}
	if (prepared === DELETE_EXPECTED_ENTRY_MISMATCH) {
		await publishSessionStateArchives(resolved, []);
		return expectedEntryMismatchResult([]);
	}
	return await withSqliteSessionDeletions(resolved, prepared.targetSnapshot, async (assertCurrent) => {
		const assertDeletionCurrent = () => {
			params.commitGuard?.();
			assertCurrent();
		};
		const validation = {
			deleteParams: params,
			preparedTargetSnapshot: prepared.targetSnapshot
		};
		const historicalArchivedTranscripts = [];
		for (const generation of prepareHistoricalGenerationDeletions({
			...validation,
			sessionIds: prepared.historicalGenerationIds
		})) {
			const { sessionId } = generation;
			const plan = await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionDatabase(databaseOptions, (database) => {
				if (!readValidatedSessionDeletionTarget(database, generation)) return DELETE_EXPECTED_ENTRY_MISMATCH;
				const referencedAfterDelete = readReferencedSessionIdsAfterTargetMutation(database, params.target, [sessionId]);
				if (referencedAfterDelete.has(sessionId)) return null;
				if (collectAdmissionProtectedSessionIds({
					database,
					storePath: params.storePath
				}).has(sessionId)) throw new Error(`cannot delete session history while work is in flight for ${sessionId}; retry after the run completes`);
				return planSessionStateDeleteIfUnreferenced({
					archiveDirectory: prepared.archiveDirectory,
					archiveTranscript: params.archiveTranscript,
					database,
					reason: "deleted",
					referencedSessionIds: referencedAfterDelete,
					sessionId
				});
			}, assertDeletionCurrent), "session.lifecycle.archive-plan");
			if (plan === DELETE_EXPECTED_ENTRY_MISMATCH) return expectedEntryMismatchResult(historicalArchivedTranscripts);
			if (!plan) continue;
			const archivedGeneration = await runExclusiveSqliteSessionReclamation(async () => {
				const materializedGeneration = await materializeSessionStateDeletePlans([plan]);
				const diagnostics = {};
				const reclamationPlan = await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionDatabase(databaseOptions, (database) => {
					if (!readValidatedSessionDeletionTarget(database, generation)) return DELETE_EXPECTED_ENTRY_MISMATCH;
					const protectedSessionIds = collectAdmissionProtectedSessionIds({
						database,
						storePath: params.storePath
					});
					if (protectedSessionIds.has(sessionId)) throw new Error(`cannot delete session history while work is in flight for ${sessionId}; retry after the run completes`);
					return createHistoricalGenerationReclamationPlan({
						databaseOptions,
						deleteParams: generation.deleteParams,
						materializedPlans: materializedGeneration,
						preparedTargetSnapshot: prepared.targetSnapshot,
						protectedSessionIds,
						sessionId
					});
				}, assertDeletionCurrent), "session.lifecycle.reclamation-plan", diagnostics);
				if (reclamationPlan === DELETE_EXPECTED_ENTRY_MISMATCH) return DELETE_EXPECTED_ENTRY_MISMATCH;
				const reclaimed = await runSqliteSessionReclamation({
					diagnostics,
					assertCommitAllowed: assertDeletionCurrent,
					forceInProcess: hasPreparedNativeSessionDeletion(),
					onInProcessCommit: recordCommit,
					plan: reclamationPlan
				});
				if (reclaimed.kind !== reclamationPlan.kind) throw new Error(`SQLite session reclamation returned ${reclaimed.kind} for ${reclamationPlan.kind}`);
				return reclaimed.value;
			});
			if (archivedGeneration === DELETE_EXPECTED_ENTRY_MISMATCH) return expectedEntryMismatchResult(historicalArchivedTranscripts);
			if (archivedGeneration.expectedEntryMismatch) return expectedEntryMismatchResult(historicalArchivedTranscripts);
			if (archivedGeneration.deleted) markCommitted();
			const publishedGeneration = await publishSessionStateArchives(resolved, archivedGeneration.archivedTranscripts);
			emitArchivedTranscriptUpdates(publishedGeneration);
			historicalArchivedTranscripts.push(...publishedGeneration);
		}
		const result = await runExclusiveSqliteSessionReclamation(async () => {
			const materializedPlans = await materializeSessionStateDeletePlans(prepared.entryPlans);
			const diagnostics = {};
			const reclamationPlan = await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionDatabase(databaseOptions, (database) => {
				if (!readValidatedSessionDeletionTarget(database, validation)) return DELETE_EXPECTED_ENTRY_MISMATCH;
				return createSessionEntryReclamationPlan({
					databaseOptions,
					deleteParams: params,
					materializedPlans,
					preparedTargetSnapshot: prepared.targetSnapshot
				});
			}, assertDeletionCurrent), "session.lifecycle.reclamation-plan", diagnostics);
			if (reclamationPlan === DELETE_EXPECTED_ENTRY_MISMATCH) return expectedEntryMismatchResult([]);
			const reclaimed = await runSqliteSessionReclamation({
				diagnostics,
				assertCommitAllowed: assertDeletionCurrent,
				forceInProcess: hasPreparedNativeSessionDeletion(),
				onInProcessCommit: recordCommit,
				plan: reclamationPlan
			});
			if (reclaimed.kind !== reclamationPlan.kind) throw new Error(`SQLite session reclamation returned ${reclaimed.kind} for ${reclamationPlan.kind}`);
			return reclaimed.value;
		});
		if (result.deleted) {
			markCommitted();
			emitSessionIdentityMutation({
				agentId: resolved.agentId,
				kind: "delete",
				previous: {
					...prepared.current.entry.sessionId ? { sessionId: prepared.current.entry.sessionId } : {},
					sessionKeys: prepared.targetSnapshot.map((row) => row.sessionKey)
				}
			});
			deletePersonalGitHubSessionReceipts({
				agentId: resolved.agentId,
				env: resolved.env,
				sessionKeys: [
					params.target.canonicalKey,
					...params.target.storeKeys,
					...prepared.targetSnapshot.map((row) => row.sessionKey)
				]
			});
		}
		result.archivedTranscripts = await publishSessionStateArchives(resolved, result.archivedTranscripts);
		emitArchivedTranscriptUpdates(result.archivedTranscripts);
		result.archivedTranscripts.push(...historicalArchivedTranscripts);
		return result;
	}, { additionalIdentities: prepared.historicalGenerationIds });
}
function expectedEntryMismatchResult(archivedTranscripts) {
	return {
		archivedTranscripts,
		deleted: false,
		expectedEntryMismatch: true
	};
}
/** Deletes one persisted session entry using SQLite session rows. */
async function deleteSessionEntryLifecycle(params) {
	return await deleteSqliteSessionEntryLifecycleInternal(params, false);
}
/** Disk-budget owner: delete one exact archived row without recursively scheduling another pass. */
async function deleteDiskBudgetSessionEntryLifecycle(params, resolved) {
	const targetScope = captureLifecycleDatabaseScope({
		...resolved,
		agentId: resolveSqliteAgentId({
			scopedAgentId: params.agentId ?? parseAgentSessionKey(params.target.canonicalKey)?.agentId,
			storeAgentId: resolved.databaseAgentId ?? resolved.agentId,
			storeShared: resolved.databaseAgentId !== void 0
		})
	});
	return await withCommittedHistoryMaintenance({
		...params,
		env: targetScope.env
	}, async (recordCommit, markCommitted) => await withSqliteTranscriptArchiveSession(toDatabaseOptions(targetScope), () => deleteSqliteSessionEntryLifecycleLocked(targetScope, params, false, void 0, recordCommit, markCommitted)), { scheduleNext: false });
}
/** Rolls back one exact locked row created by failed trusted harness initialization. */
async function rollbackAgentHarnessSessionEntryLifecycle(params) {
	const hasExactTarget = params.target.storeKeys.length === 1 && params.target.storeKeys[0] === params.target.canonicalKey;
	const expectedEntryError = resolveAgentHarnessSessionStoreEntryError(params.target.canonicalKey, params.expectedEntry);
	if (!hasExactTarget || expectedEntryError || !isValidAgentHarnessSessionStoreEntry(params.target.canonicalKey, params.expectedEntry)) throw new Error(expectedEntryError ?? "Model-selection-locked sessions cannot be removed, unlocked, or reassigned.");
	return await deleteSqliteSessionEntryLifecycleInternal(params, true);
}
/** Rolls back one exact locked CLI row created by a failed plugin initializer. */
async function rollbackPluginOwnedSessionEntryLifecycle(params) {
	const expectedEntry = params.expectedEntry;
	const validPluginOwner = normalizeOptionalString(expectedEntry.pluginOwnerId);
	const expectedPluginOwner = normalizeOptionalString(params.expectedPluginOwnerId);
	if (isAgentHarnessSessionKey(params.target.canonicalKey) || expectedEntry.agentHarnessId !== void 0 || expectedEntry.modelSelectionLocked !== true || !validPluginOwner || validPluginOwner !== expectedPluginOwner) throw new Error(MODEL_SELECTION_LOCK_REMOVAL_MESSAGE);
	return await deleteSqliteSessionEntryLifecycleInternal(params, true, expectedPluginOwner);
}
//#endregion
export { rollbackAgentHarnessSessionEntryLifecycle as a, resetSessionEntryLifecycle as i, deleteDiskBudgetSessionEntryLifecycle as n, rollbackPluginOwnedSessionEntryLifecycle as o, deleteSessionEntryLifecycle as r, appendSessionResetBoundary as s, cleanupSessionLifecycleArtifactsCore as t };
