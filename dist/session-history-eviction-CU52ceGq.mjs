import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { r as getChildLogger } from "./logger--ALOusOG.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { a as iterateSqliteQuerySync, l as sqliteStringSet, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { o as sqliteReaderDatabasePathKey } from "./sqlite-reader-lifecycle-BmcnELSc.mjs";
import { d as publishSqliteWalCheckpointObservation, u as onSqliteWalCheckpoint } from "./sqlite-wal-BzoPsBh0.mjs";
import { a as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { i as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { l as openOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { a as runQueuedStoreWrite } from "./openclaw-agent-write-admission-b9fAKekK.mjs";
import { n as withOpenClawAgentDatabaseReadOnly, t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { a as getSessionKysely, f as resolveSqliteTranscriptArchiveDirectory, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite, u as resolveSqliteScope, v as withSqliteSessionDatabase } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { r as parseSessionEntryJson } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { K as hasPreparedNativeSessionDeletion, X as withSqliteSessionDeletions } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { g as runExclusiveSessionLifecycleMutation, o as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { c as normalizeResolvedMaintenanceConfigInput, s as isSessionEntryDiskBudgetEvictable } from "./store-maintenance-C5xEVYop.mjs";
import { i as isRecentHistoricalSessionId, n as collectRecentSessionHistoryIds, r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-BKdpL7km.mjs";
import { c as withSqliteMutationWorkerLifetime, l as withSqliteTranscriptArchiveSession, n as materializeSessionStateDeletePlans, o as runSqliteTranscriptArchiveWorkerOperation } from "./session-accessor.sqlite-archive-DRWDbZcu.mjs";
import { h as emitArchivedTranscriptUpdates, l as readReferencedSessionIds, m as publishSessionStateArchives, s as planSessionStateDeleteIfUnreferenced } from "./session-accessor.sqlite-lifecycle-state-CqA46R2u.mjs";
import { i as readSessionTranscriptJsonlBytesInDatabase, r as emptySessionEntryMaintenancePlan, t as applySessionEntryMaintenanceInDatabase } from "./session-accessor.sqlite-maintenance-store-BPwwS_1N.mjs";
import { a as createSessionMaintenanceFinalizationOperation, d as resolveSessionReclamationDatabaseOptions, f as runExclusiveSqliteSessionReclamation, h as runPreparedSqliteSessionReclamation, n as createHistoryEvictionReclamationPlan, p as runSqliteSessionReclamation, s as createSessionMaintenanceStatisticsOperation } from "./session-accessor.sqlite-reclamation-CIUc3kgC.mjs";
import { r as withSqliteReclamationWorker } from "./session-accessor.sqlite-reclamation-worker-CLuHKRTt.mjs";
import { n as captureSessionMaintenancePreservation, t as resolveMaintenanceConfig } from "./store-maintenance-runtime-CSHOf5vV.mjs";
import { c as measureSessionPhysicalDiskUsage, n as hasRetainedSessionTranscriptArchives } from "./disk-budget-CH7vIk-L.mjs";
import { n as pruneAllSessionTranscriptArchivesToHighWater, r as reclaimSqliteFreePages, t as hasCanonicalSessionTranscriptArchives } from "./session-history-archive-pruning-CQAhYwzb.mjs";
//#region src/config/sessions/session-accessor.sqlite-maintenance.ts
const MAX_SESSION_MAINTENANCE_BATCH_ENTRIES = 64;
const MAX_SESSION_MAINTENANCE_BATCH_ARCHIVE_BYTES = 67108864;
const SESSION_TRANSCRIPT_BYTE_QUERY_BATCH = MAX_SESSION_MAINTENANCE_BATCH_ENTRIES;
const SESSION_PLANNER_ANALYSIS_MIN_DELETED_ENTRIES = MAX_SESSION_MAINTENANCE_BATCH_ENTRIES;
const plannerMaintenanceByStore = /* @__PURE__ */ new Map();
/** Coalesce bounded planner-statistics refreshes behind the per-store writer lane. */
async function refreshSqliteSessionPlannerStatisticsBestEffort(scope, deletedEntries, options = {}) {
	const isCurrent = options.isCurrent ?? (() => true);
	if (deletedEntries < SESSION_PLANNER_ANALYSIS_MIN_DELETED_ENTRIES || !isCurrent()) return;
	const storePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(scope));
	const active = plannerMaintenanceByStore.get(storePath);
	if (active) {
		await active;
		return;
	}
	const completion = runSqliteSessionReclamation({
		diagnostics: { kind: "maintenance-statistics" },
		assertCommitAllowed: () => {
			if (!isCurrent()) throw new Error("SQLite maintenance planner owner retired");
		},
		forceInProcess: false,
		plan: createSessionMaintenanceStatisticsOperation(toDatabaseOptions(scope))
	}).then(() => void 0).catch((error) => {
		getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite session planner-statistics refresh failed", {
			agentId: scope.agentId,
			error,
			path: storePath
		});
	}).finally(() => {
		plannerMaintenanceByStore.delete(storePath);
	});
	plannerMaintenanceByStore.set(storePath, completion);
	await completion;
}
function buildSessionMaintenanceBatches(params) {
	const parent = params.entryRemovals.map((_, index) => index);
	const find = (index) => {
		let root = index;
		while (parent[root] !== root) root = parent[root] ?? root;
		let current = index;
		while (parent[current] !== current) {
			const next = parent[current] ?? root;
			parent[current] = root;
			current = next;
		}
		return root;
	};
	const union = (left, right) => {
		const leftRoot = find(left);
		const rightRoot = find(right);
		if (leftRoot !== rightRoot) parent[rightRoot] = leftRoot;
	};
	const removalIndexesBySessionId = /* @__PURE__ */ new Map();
	const removalIndexBySessionKey = /* @__PURE__ */ new Map();
	const addRemovalIndex = (sessionId, index) => {
		const indexes = removalIndexesBySessionId.get(sessionId) ?? [];
		if (indexes.includes(index)) return;
		if (indexes.length > 0) union(indexes[0] ?? index, index);
		indexes.push(index);
		removalIndexesBySessionId.set(sessionId, indexes);
	};
	for (const [index, removal] of params.entryRemovals.entries()) {
		if (!removal.expectedEntry) continue;
		removalIndexBySessionKey.set(removal.sessionKey, index);
		for (const sessionId of collectSessionStateIdsForEntry(removal.expectedEntry)) addRemovalIndex(sessionId, index);
	}
	for (const plan of params.stateDeletePlans) {
		const ownerIndex = plan.snapshot.sessionKey ? removalIndexBySessionKey.get(plan.snapshot.sessionKey) : void 0;
		if (ownerIndex !== void 0) addRemovalIndex(plan.sessionId, ownerIndex);
	}
	const groupsByRoot = /* @__PURE__ */ new Map();
	for (const [index, removal] of params.entryRemovals.entries()) {
		const root = find(index);
		const group = groupsByRoot.get(root) ?? {
			archiveBytes: 0,
			entryRemovals: [],
			order: index,
			stateDeletePlans: [],
			workItems: 0
		};
		group.entryRemovals.push(removal);
		group.order = Math.min(group.order, index);
		groupsByRoot.set(root, group);
	}
	const plansBySessionId = /* @__PURE__ */ new Map();
	for (const plan of params.stateDeletePlans) {
		const plans = plansBySessionId.get(plan.sessionId) ?? [];
		plans.push(plan);
		plansBySessionId.set(plan.sessionId, plans);
	}
	const standaloneGroups = [];
	let standaloneOrder = params.entryRemovals.length;
	for (const [sessionId, plans] of plansBySessionId) {
		const removalIndex = removalIndexesBySessionId.get(sessionId)?.[0];
		const removalGroup = removalIndex === void 0 ? void 0 : groupsByRoot.get(find(removalIndex));
		const group = removalGroup ?? {
			archiveBytes: 0,
			entryRemovals: [],
			order: standaloneOrder++,
			stateDeletePlans: [],
			workItems: 0
		};
		group.stateDeletePlans.push(...plans);
		if (plans.some((plan) => plan.archiveTranscript)) group.archiveBytes += params.archiveBytesBySessionId.get(sessionId) ?? 0;
		if (!removalGroup) standaloneGroups.push(group);
	}
	const groups = [...groupsByRoot.values(), ...standaloneGroups].map((group) => {
		group.workItems = Math.max(group.entryRemovals.length, new Set(group.stateDeletePlans.map((plan) => plan.sessionId)).size);
		return group;
	}).toSorted((left, right) => left.order - right.order);
	const batches = [];
	let batch = {
		archiveBytes: 0,
		entryRemovals: [],
		stateDeletePlans: [],
		workItems: 0
	};
	const flush = () => {
		if (batch.workItems === 0) return;
		batches.push(batch);
		batch = {
			archiveBytes: 0,
			entryRemovals: [],
			stateDeletePlans: [],
			workItems: 0
		};
	};
	for (const group of groups) {
		const exceedsEntryLimit = batch.workItems > 0 && batch.workItems + group.workItems > MAX_SESSION_MAINTENANCE_BATCH_ENTRIES;
		const exceedsByteLimit = batch.workItems > 0 && batch.archiveBytes + group.archiveBytes > MAX_SESSION_MAINTENANCE_BATCH_ARCHIVE_BYTES;
		if (exceedsEntryLimit || exceedsByteLimit) flush();
		batch.archiveBytes += group.archiveBytes;
		batch.entryRemovals.push(...group.entryRemovals);
		batch.stateDeletePlans.push(...group.stateDeletePlans);
		batch.workItems += group.workItems;
	}
	flush();
	return batches;
}
async function readSessionTranscriptJsonlBytes(scope, sessionIds, isCurrent) {
	const bytesBySessionId = /* @__PURE__ */ new Map();
	const options = resolveSessionReclamationDatabaseOptions(toDatabaseOptions(scope));
	for (let offset = 0; offset < sessionIds.length; offset += SESSION_TRANSCRIPT_BYTE_QUERY_BATCH) {
		const batch = sessionIds.slice(offset, offset + SESSION_TRANSCRIPT_BYTE_QUERY_BATCH);
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
		if (!isCurrent()) return bytesBySessionId;
		let sized;
		if (isIncognitoOpenClawAgentSqlitePath(options.path, options)) {
			const opened = withOpenClawAgentDatabaseReadOnly((database) => readSessionTranscriptJsonlBytesInDatabase(database, batch), options);
			if (!opened.found) throw new Error(`Cannot size SQLite session transcripts: ${opened.reason.replaceAll("-", " ")}`);
			sized = opened.value;
		} else {
			const results = await withSqliteMutationWorkerLifetime(options, async ({ assertCurrent, signal }) => await runSqliteTranscriptArchiveWorkerOperation({
				assertCurrent,
				signal,
				expectedMessageType: "sized",
				workerData: {
					type: "sqlite-transcript-archive-v2",
					operation: "maintenance-size",
					input: {
						...options,
						sessionIds: batch
					}
				}
			}));
			if (!results[0]) throw new Error("SQLite maintenance sizing worker omitted its result");
			sized = results[0];
		}
		if (!isCurrent()) return bytesBySessionId;
		for (const [sessionId, bytes] of sized) bytesBySessionId.set(sessionId, bytes);
	}
	return bytesBySessionId;
}
function applySessionEntryMaintenance(database, params) {
	if (params.skipMaintenance) return emptySessionEntryMaintenancePlan();
	const maintenance = params.maintenanceConfig ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig) : resolveMaintenanceConfig();
	if (maintenance.mode === "warn") return emptySessionEntryMaintenancePlan();
	return applySessionEntryMaintenanceInDatabase(database, {
		...params,
		maintenance
	}, () => captureSessionMaintenancePreservation(params.storePath));
}
/** Finalizes maintenance after its caller releases the per-store writer lane. */
async function finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(scope, plans, options = {}) {
	const isCurrent = options.isCurrent ?? (() => true);
	const committedCounts = {
		archived: plans.reduce((count, plan) => count + plan.archived, 0),
		capArchived: plans.reduce((count, plan) => count + plan.capArchived, 0),
		modelRunPruned: 0,
		pruned: 0,
		capped: plans.reduce((count, plan) => count + plan.capped - plan.entryRemovals.filter((removal) => removal.maintenanceReason === "capped").length, 0)
	};
	const emptyResult = () => ({
		archivedTranscripts: [],
		...committedCounts
	});
	if (!isCurrent()) return emptyResult();
	const archivedWorktrees = plans.flatMap((plan) => plan.archivedWorktrees ?? []);
	if (archivedWorktrees.length) {
		const { cleanUpAutomaticallyArchivedWorktrees } = await import("./session-worktree-lifecycle-B7KyZAzC.mjs");
		if (!isCurrent()) return emptyResult();
		await cleanUpAutomaticallyArchivedWorktrees(scope, archivedWorktrees);
	}
	const entryRemovals = plans.flatMap((plan) => plan.entryRemovals);
	const stateDeletePlans = plans.flatMap((plan) => plan.stateDeletePlans);
	const warn = (message, error, warnedStateDeletePlans) => {
		getChildLogger({ subsystem: "session-sqlite" }).warn(message, {
			agentId: scope.agentId,
			error,
			path: scope.path,
			sessionIds: uniqueStrings(warnedStateDeletePlans.map((plan) => plan.sessionId))
		});
	};
	if (!isCurrent()) return emptyResult();
	if (entryRemovals.length === 0 && stateDeletePlans.length === 0) {
		await refreshSqliteSessionPlannerStatisticsBestEffort(scope, options.deletedEntriesBeforeMaintenance ?? 0, { isCurrent });
		return emptyResult();
	}
	let archiveBytesBySessionId;
	try {
		archiveBytesBySessionId = await readSessionTranscriptJsonlBytes(scope, stateDeletePlans.filter((plan) => plan.archiveTranscript).map((plan) => plan.sessionId), isCurrent);
	} catch (error) {
		warn("SQLite session maintenance archive sizing failed", error, stateDeletePlans);
		await refreshSqliteSessionPlannerStatisticsBestEffort(scope, options.deletedEntriesBeforeMaintenance ?? 0, { isCurrent });
		return emptyResult();
	}
	if (!isCurrent()) return emptyResult();
	const publishedTranscripts = [];
	let deletedEntries = options.deletedEntriesBeforeMaintenance ?? 0;
	for (const batch of buildSessionMaintenanceBatches({
		archiveBytesBySessionId,
		entryRemovals,
		stateDeletePlans
	})) {
		if (!isCurrent()) break;
		let archivedTranscripts;
		let changedEntryRemovals;
		let committedEntryRemovals;
		try {
			const materializedPlans = await materializeSessionStateDeletePlans(batch.stateDeletePlans);
			if (!isCurrent()) break;
			const result = await withSqliteSessionDeletions(scope, batch.entryRemovals.flatMap(({ expectedEntry: entry, sessionKey }) => entry ? [{
				entry,
				sessionKey
			}] : []), async (assertCurrent) => await runSqliteSessionReclamation({
				diagnostics: { kind: "maintenance-finalize" },
				assertCommitAllowed: () => {
					assertCurrent();
					if (!isCurrent()) throw new Error("SQLite automatic maintenance owner retired");
				},
				forceInProcess: hasPreparedNativeSessionDeletion(),
				plan: createSessionMaintenanceFinalizationOperation({
					agentId: scope.agentId,
					databaseOptions: toDatabaseOptions(scope),
					entries: batch.entryRemovals,
					materializedPlans
				})
			}));
			if (result.kind !== "maintenance-finalize") throw new Error("SQLite maintenance returned another operation's result");
			archivedTranscripts = result.value.archivedTranscripts;
			changedEntryRemovals = result.value.changedEntries;
			committedEntryRemovals = result.value.committedEntries;
		} catch (error) {
			warn("SQLite session maintenance cleanup failed", error, batch.stateDeletePlans);
			break;
		}
		if (!isCurrent()) break;
		if (changedEntryRemovals.length > 0) getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite session maintenance skipped changed entries", {
			agentId: scope.agentId,
			path: scope.path,
			sessionKeys: changedEntryRemovals.map((removal) => removal.sessionKey)
		});
		deletedEntries += batch.workItems - (batch.entryRemovals.length - committedEntryRemovals.length);
		for (const removal of committedEntryRemovals) if (removal.maintenanceReason === "model-run-pruned") committedCounts.modelRunPruned += 1;
		else if (removal.maintenanceReason === "pruned") committedCounts.pruned += 1;
		else if (removal.maintenanceReason === "capped") committedCounts.capped += 1;
		try {
			publishedTranscripts.push(...await publishSessionStateArchives(scope, archivedTranscripts));
		} catch (error) {
			warn("SQLite session maintenance archive publication failed", error, batch.stateDeletePlans);
		}
	}
	if (isCurrent()) await refreshSqliteSessionPlannerStatisticsBestEffort(scope, deletedEntries, { isCurrent });
	return {
		archivedTranscripts: publishedTranscripts,
		...committedCounts
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-page-reclamation.ts
/** Acquire the archive worker before the caller's writer, so retained work cannot deadlock it. */
async function withSqliteSessionPageReclamation(input, run) {
	const options = resolveSessionReclamationDatabaseOptions(input);
	if (isIncognitoOpenClawAgentSqlitePath(options.path, options)) return run(async (maxPages) => withSqliteSessionDatabase(options, (database) => database.walMaintenance.reclaimFreePages({ maxPages })));
	return withSqliteMutationWorkerLifetime(options, async ({ assertCurrent, signal }) => {
		const retained = await runExclusiveSqliteSessionWrite(options, async () => {
			assertCurrent();
			return retainOpenClawAgentDatabaseReadOnly(options);
		}, "session.reclamation.retain");
		if (!retained.found) throw new Error("SQLite page reclamation lost its prepared database");
		let { database, claim } = retained;
		const physicalIdentity = claim.identity;
		const databaseOptions = {
			...options,
			path: readOpenClawAgentDatabaseIdentity(database).filename
		};
		try {
			return await withSqliteReclamationWorker(databaseOptions, claim, (worker) => run((maxPages) => withSqliteMutationWorkerLifetime(databaseOptions, async (request) => {
				const assertRequestCurrent = () => {
					assertCurrent();
					request.assertCurrent();
				};
				assertRequestCurrent();
				if (!claim.isCurrent()) {
					const reopened = retainOpenClawAgentDatabaseReadOnly(databaseOptions);
					if (!reopened.found) throw new Error("SQLite page reclamation lost its prepared database");
					if (reopened.claim.identity !== physicalIdentity) {
						reopened.claim.release();
						throw new Error("SQLite page reclamation database path was replaced");
					}
					claim.release();
					({database, claim} = reopened);
				}
				const result = await runPreparedSqliteSessionReclamation({ plan: {
					kind: "maintenance-pages",
					databaseOptions,
					materializedPlans: [],
					maxPages
				} }, {
					database,
					claim,
					worker,
					commitGate: request.commitGate,
					assertRequestCurrent
				});
				if (result.kind !== "maintenance-pages") throw new Error("SQLite page reclamation returned another operation's result");
				if (result.value.checkpoint) result.value.checkpoint = publishSqliteWalCheckpointObservation(databaseOptions.path, result.value.checkpoint);
				return result.value;
			})), assertCurrent, signal);
		} finally {
			claim.release();
		}
	});
}
//#endregion
//#region src/config/sessions/session-history-budget-state.ts
const log$1 = createSubsystemLogger("sessions/history-eviction");
function createPhysicalBudgetResult(params) {
	const totalBytesAfter = params.totalBytesAfter ?? params.totalBytesBefore;
	return {
		totalBytesBefore: params.totalBytesBefore,
		totalBytesAfter,
		removedFiles: params.removedFiles ?? 0,
		removedEntries: params.removedEntries ?? 0,
		freedBytes: Math.max(0, params.totalBytesBefore - totalBytesAfter),
		maxBytes: params.maxBytes,
		highWaterBytes: params.highWaterBytes,
		overBudget: params.totalBytesBefore > params.maxBytes,
		...params.deferred ? {
			deferredReason: "checkpoint-incomplete",
			...params.deferred
		} : {}
	};
}
const PHYSICAL_BUDGET_CHECK_INTERVAL_MS = 18e5;
const FORCED_PHYSICAL_BUDGET_CHECK_INTERVAL_MS = 6e4;
const budgetKickStateByStore = /* @__PURE__ */ new Map();
onSqliteWalCheckpoint(({ databasePath, health, observedAtNs }) => {
	if (health.state !== "complete") return;
	for (const state of budgetKickStateByStore.values()) if (state.checkpointBlocked?.databasePath === databasePath && (!state.checkpointBlocked.checkpoint || observedAtNs >= state.checkpointBlocked.checkpoint.observedAtNs)) {
		state.checkpointBlocked = void 0;
		state.blockedUntil = void 0;
		state.lastCheckAt = -Infinity;
		state.lastForcedCheckAt = -Infinity;
	}
});
function deferPhysicalBudgetForCheckpoint(params, databasePath, checkpoint) {
	const state = getBudgetKickState(params.storePath, params.maintenance);
	state.checkpointBlocked = {
		databasePath: sqliteReaderDatabasePathKey(databasePath),
		checkpoint
	};
}
function getBudgetKickState(storePath, budget) {
	let state = budgetKickStateByStore.get(storePath);
	if (!state) {
		state = {
			budget,
			lastCheckAt: -Infinity,
			lastForcedCheckAt: -Infinity,
			running: false
		};
		budgetKickStateByStore.set(storePath, state);
	} else if (state.budget.maxDiskBytes !== budget.maxDiskBytes || state.budget.highWaterBytes !== budget.highWaterBytes || state.budget.preserveRecentMs !== budget.preserveRecentMs) {
		state.budget = budget;
		state.lastCheckAt = -Infinity;
		state.lastForcedCheckAt = -Infinity;
		state.blockedUntil = void 0;
	}
	return state;
}
function recordPhysicalBudgetOutcome(params, result) {
	if (params.mode !== "enforce" || !result) return;
	const state = getBudgetKickState(params.storePath, params.maintenance);
	if (result.deferredReason) {
		if (state.checkpointBlocked?.warned) return;
		if (state.checkpointBlocked) state.checkpointBlocked.warned = true;
		log$1.warn("session history disk budget deferred until a completed WAL checkpoint is observed", {
			storePath: params.storePath,
			reason: result.deferredReason,
			totalBytesBefore: result.totalBytesBefore,
			totalBytesAfter: result.totalBytesAfter,
			walBytesBefore: result.walBytesBefore,
			walBytesAfter: result.walBytesAfter,
			checkpoint: result.checkpoint
		});
		return;
	}
	if (result.totalBytesAfter <= result.maxBytes) {
		state.blockedUntil = void 0;
		return;
	}
	const alreadyBlocked = state.blockedUntil !== void 0;
	state.blockedUntil = Date.now() + PHYSICAL_BUDGET_CHECK_INTERVAL_MS;
	if (!alreadyBlocked) log$1.warn("session history disk budget remains exceeded after cleanup; retained data is protected or could not be reclaimed. Raise session.maintenance.maxDiskBytes or export and delete unneeded sessions; automatic checks resume on activity after 30 minutes", {
		storePath: params.storePath,
		totalBytes: result.totalBytesAfter,
		maxBytes: result.maxBytes,
		highWaterBytes: result.highWaterBytes,
		nextCheckAt: state.blockedUntil
	});
}
//#endregion
//#region src/config/sessions/session-history-entry-eviction.runtime.ts
async function deleteDiskBudgetArchivedSessionEntry(params, resolved) {
	const { deleteDiskBudgetSessionEntryLifecycle } = await import("./session-accessor.sqlite-lifecycle-Bcm09Ncr.mjs");
	return await deleteDiskBudgetSessionEntryLifecycle(params, resolved);
}
//#endregion
//#region src/config/sessions/session-history-eviction-candidates.ts
const DISK_EVICTABLE_ARCHIVE_BATCH_SIZE = 64;
function readDiskEvictableArchivedSessionBatch(params) {
	const limit = Math.max(1, params.limit ?? DISK_EVICTABLE_ARCHIVE_BATCH_SIZE);
	const candidates = [];
	let cursor = params.after;
	while (candidates.length < limit) {
		const database = openOpenClawAgentDatabase(params.databaseOptions);
		let query = getSessionKysely(database.db).selectFrom("session_nodes").select([
			"archived_at",
			"current_session_id",
			"entry_json",
			"session_key",
			"updated_at"
		]).where("archived_at", "is not", null).orderBy("archived_at", "asc").orderBy("session_key", "asc").limit(DISK_EVICTABLE_ARCHIVE_BATCH_SIZE);
		if (cursor) {
			const after = cursor;
			query = query.where((eb) => eb.or([eb("archived_at", ">", after.archivedAt), eb.and([eb("archived_at", "=", after.archivedAt), eb("session_key", ">", after.sessionKey)])]));
		}
		const rows = executeSqliteQuerySync(database.db, query).rows;
		let scanned = 0;
		for (const row of rows) {
			scanned += 1;
			if (row.archived_at == null) continue;
			cursor = {
				archivedAt: row.archived_at,
				sessionKey: row.session_key
			};
			const entry = parseSessionEntryJson(row);
			if (entry && isSessionEntryDiskBudgetEvictable({
				key: row.session_key,
				entry,
				preserveRecentMs: params.preserveRecentMs
			})) {
				candidates.push({
					archivedAt: row.archived_at,
					entry,
					sessionKey: row.session_key
				});
				if (candidates.length >= limit) break;
			}
		}
		const exhausted = rows.length < DISK_EVICTABLE_ARCHIVE_BATCH_SIZE && scanned === rows.length;
		if (candidates.length >= limit || exhausted) return {
			candidates,
			...cursor ? { cursor } : {},
			exhausted
		};
	}
	return {
		candidates,
		...cursor ? { cursor } : {},
		exhausted: false
	};
}
//#endregion
//#region src/config/sessions/session-history-eviction.ts
/** Reports the same physical total enforce mode compares, without projecting logical row bytes. */
async function inspectSqliteSessionHistoryDiskBudget(input) {
	const params = {
		...input,
		env: { ...input.env ?? process.env }
	};
	params.env.OPENCLAW_STATE_DIR = resolveStateDir(params.env);
	const { highWaterBytes, maxDiskBytes } = params.maintenance;
	if (maxDiskBytes == null || highWaterBytes == null) return {
		diskBudget: null,
		wouldMutate: false
	};
	const usage = await measureSessionPhysicalDiskUsage(params.storePath);
	const diskBudget = createPhysicalBudgetResult({
		totalBytesBefore: usage.totalBytes,
		maxBytes: maxDiskBytes,
		highWaterBytes
	});
	if (!diskBudget.overBudget || params.mode !== "enforce") return {
		diskBudget,
		wouldMutate: false
	};
	const blocked = budgetKickStateByStore.get(params.storePath)?.checkpointBlocked;
	if (blocked) return {
		diskBudget: {
			...diskBudget,
			deferredReason: "checkpoint-incomplete",
			checkpoint: blocked.checkpoint?.health,
			walBytesBefore: usage.databaseWalBytes,
			walBytesAfter: usage.databaseWalBytes
		},
		wouldMutate: false
	};
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		sessionKey: "",
		storePath: params.storePath
	});
	const databaseOptions = toDatabaseOptions(resolved);
	if (hasCanonicalSessionTranscriptArchives(databaseOptions) || await hasRetainedSessionTranscriptArchives(params.storePath)) return {
		diskBudget,
		wouldMutate: true
	};
	const candidates = readHistoricalSessionIds({
		databaseOptions,
		preserveRecentMs: params.maintenance.preserveRecentMs,
		storePath: params.storePath
	});
	const archivedCandidates = readDiskEvictableArchivedSessionBatch({
		databaseOptions,
		limit: 1,
		preserveRecentMs: params.maintenance.preserveRecentMs
	});
	return {
		diskBudget,
		wouldMutate: candidates.length > 0 || archivedCandidates.candidates.length > 0
	};
}
function collectProtectedHistoricalSessionIds(params) {
	const protectedSessionIds = readReferencedSessionIds(params.database, void 0, void 0, params);
	for (const sessionId of collectAdmissionProtectedSessionIds(params)) protectedSessionIds.add(sessionId);
	return protectedSessionIds;
}
function collectCandidateAdditionalProtection(params) {
	const protectedSessionIds = collectAdmissionProtectedSessionIds(params);
	if (isRecentHistoricalSessionId(params)) protectedSessionIds.add(params.sessionId);
	return protectedSessionIds;
}
/** Session ids owned by in-flight work admissions, without live-reference protection. */
function collectAdmissionProtectedSessionIds(params) {
	const protectedSessionIds = /* @__PURE__ */ new Set();
	const admissionIdentities = collectActiveSessionWorkAdmissions().get(params.storePath) ?? /* @__PURE__ */ new Set();
	if (admissionIdentities.size === 0) return protectedSessionIds;
	for (const identity of admissionIdentities) protectedSessionIds.add(identity);
	const normalizedAdmissionKeys = new Set([...admissionIdentities].map((identity) => normalizeStoreSessionKey(identity)));
	const db = getSessionKysely(params.database.db);
	const admittedKeyBytes = [];
	for (const row of iterateSqliteQuerySync(params.database.db, db.selectFrom("session_nodes").select(["session_key", db.fn("hex", ["session_key"]).as("key_bytes")]))) if (normalizedAdmissionKeys.has(normalizeStoreSessionKey(row.session_key))) admittedKeyBytes.push(row.key_bytes);
	const rows = admittedKeyBytes.length ? iterateSqliteQuerySync(params.database.db, db.selectFrom("session_nodes").select(["entry_json", "current_session_id"]).where("session_key", "in", db.selectFrom("session_nodes").select("session_key").where(db.fn("hex", ["session_key"]), "in", sqliteStringSet(admittedKeyBytes)))) : [];
	for (const row of rows) {
		protectedSessionIds.add(row.current_session_id);
		const entry = parseSessionEntryJson(row);
		if (entry) for (const sessionId of collectSessionStateIdsForEntry(entry)) protectedSessionIds.add(sessionId);
	}
	const generationRows = iterateSqliteQuerySync(params.database.db, db.selectFrom("session_windows").select(["session_id", "session_key"]));
	for (const row of generationRows) if (normalizedAdmissionKeys.has(normalizeStoreSessionKey(row.session_key))) protectedSessionIds.add(row.session_id);
	return protectedSessionIds;
}
function readHistoricalSessionIds(params) {
	const database = openOpenClawAgentDatabase(params.databaseOptions);
	const scope = {
		...params,
		database
	};
	const protectedSessionIds = collectProtectedHistoricalSessionIds(scope);
	for (const sessionId of collectRecentSessionHistoryIds(scope)) protectedSessionIds.add(sessionId);
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").orderBy("updated_at", "asc").orderBy("session_id", "asc")).rows.flatMap((row) => protectedSessionIds.has(row.session_id) ? [] : [row.session_id]);
}
const log = createSubsystemLogger("sessions/history-eviction");
/** Fire-and-forget budget pass from the ordinary entry-write maintenance seam. */
function kickSessionHistoryDiskBudgetMaintenance(input) {
	if (input.agentId && isIncognitoOpenClawAgentSqlitePath(input.storePath, {
		agentId: input.agentId,
		env: input.env
	})) return;
	const maintenance = input.maintenanceConfig ?? resolveMaintenanceConfig();
	if (maintenance.mode !== "enforce" || maintenance.maxDiskBytes == null || maintenance.highWaterBytes == null) return;
	const now = input.now ?? Date.now();
	const state = getBudgetKickState(input.storePath, maintenance);
	if (state.checkpointBlocked) return;
	if (state.running) {
		if (input.force) {
			const env = { ...input.env ?? process.env };
			env.OPENCLAW_STATE_DIR = resolveStateDir(env);
			state.pendingForce = {
				...input,
				env,
				maintenanceConfig: maintenance,
				now: void 0
			};
		}
		return;
	}
	const interval = input.force ? FORCED_PHYSICAL_BUDGET_CHECK_INTERVAL_MS : PHYSICAL_BUDGET_CHECK_INTERVAL_MS;
	const lastCheckAt = input.force ? state.lastForcedCheckAt : state.lastCheckAt;
	if (now < (state.blockedUntil ?? -Infinity) || now - lastCheckAt < interval) return;
	const params = {
		...input,
		env: { ...input.env ?? process.env }
	};
	params.env.OPENCLAW_STATE_DIR = resolveStateDir(params.env);
	state.lastCheckAt = now;
	if (input.force) state.lastForcedCheckAt = now;
	state.running = true;
	budgetKickStateByStore.set(params.storePath, state);
	enforceSqliteSessionHistoryDiskBudget({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		storePath: params.storePath,
		mode: maintenance.mode,
		maintenance
	}).catch((error) => {
		log.warn("session history disk-budget sweep failed; retrying on next kick", {
			error,
			storePath: params.storePath
		});
	}).finally(() => {
		state.running = false;
		if (state.pendingForce) {
			const pending = state.pendingForce;
			state.pendingForce = void 0;
			kickSessionHistoryDiskBudgetMaintenance(pending);
		}
	});
}
const SESSION_HISTORY_MAINTENANCE_QUEUES = /* @__PURE__ */ new Map();
/** Extracts historical sessions durably before reclaiming their SQLite rows. */
async function enforceSqliteSessionHistoryDiskBudget(input) {
	const params = {
		...input,
		env: { ...input.env ?? process.env }
	};
	params.env.OPENCLAW_STATE_DIR = resolveStateDir(params.env);
	return await runQueuedStoreWrite({
		queues: SESSION_HISTORY_MAINTENANCE_QUEUES,
		storePath: params.storePath,
		label: "enforceSqliteSessionHistoryDiskBudget",
		fn: async () => {
			const result = await enforceSessionHistoryMaintenanceSerialized(params);
			recordPhysicalBudgetOutcome(params, result);
			return result;
		}
	});
}
async function enforceSessionHistoryMaintenanceSerialized(params) {
	const { highWaterBytes, maxDiskBytes } = params.maintenance;
	if (maxDiskBytes == null || highWaterBytes == null) return null;
	const initialUsage = await measureSessionPhysicalDiskUsage(params.storePath);
	const blocked = getBudgetKickState(params.storePath, params.maintenance).checkpointBlocked;
	if (blocked && params.mode === "enforce") return createPhysicalBudgetResult({
		totalBytesBefore: initialUsage.totalBytes,
		maxBytes: maxDiskBytes,
		highWaterBytes,
		deferred: {
			checkpoint: blocked.checkpoint?.health,
			walBytesBefore: initialUsage.databaseWalBytes,
			walBytesAfter: initialUsage.databaseWalBytes
		}
	});
	if (initialUsage.totalBytes <= maxDiskBytes || params.mode === "warn") return createPhysicalBudgetResult({
		totalBytesBefore: initialUsage.totalBytes,
		maxBytes: maxDiskBytes,
		highWaterBytes
	});
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		sessionKey: "",
		storePath: params.storePath
	});
	return await withSqliteTranscriptArchiveSession(toDatabaseOptions(resolved), () => enforceSessionHistoryMaintenanceForDatabase(params, initialUsage, resolved, highWaterBytes, maxDiskBytes));
}
async function enforceSessionHistoryMaintenanceForDatabase(params, initialUsage, resolved, highWaterBytes, maxDiskBytes) {
	const databaseOptions = toDatabaseOptions(resolved);
	const databasePath = resolveOpenClawAgentSqlitePath(databaseOptions);
	const archiveDirectory = resolveSqliteTranscriptArchiveDirectory(resolved);
	const pruneArchives = (trigger) => {
		const archivePruning = { trigger };
		return withSqliteSessionPageReclamation(databaseOptions, (reclaimPages) => runExclusiveSqliteSessionWrite(resolved, async () => pruneAllSessionTranscriptArchivesToHighWater({
			archiveDirectory,
			databaseOptions,
			diagnostics: archivePruning,
			highWaterBytes,
			storePath: params.storePath,
			reclaimPages,
			onCheckpointIncomplete: (checkpoint) => deferPhysicalBudgetForCheckpoint(params, databasePath, checkpoint)
		}), "session.history.archive-prune", { archivePruning }));
	};
	let pruning = await pruneArchives("initial");
	let { usage, removedFiles } = pruning;
	let removedEntries = 0;
	const finish = () => createPhysicalBudgetResult({
		totalBytesBefore: initialUsage.totalBytes,
		totalBytesAfter: usage.totalBytes,
		removedEntries,
		removedFiles,
		maxBytes: maxDiskBytes,
		highWaterBytes,
		...pruning.checkpointIncomplete ? { deferred: {
			checkpoint: pruning.checkpoint,
			walBytesBefore: initialUsage.databaseWalBytes,
			walBytesAfter: usage.databaseWalBytes
		} } : {}
	});
	if (pruning.checkpointIncomplete) return finish();
	const candidates = usage.totalBytes > highWaterBytes ? readHistoricalSessionIds({
		databaseOptions,
		preserveRecentMs: params.maintenance.preserveRecentMs,
		storePath: params.storePath
	}) : [];
	for (const sessionId of candidates) {
		if (usage.totalBytes <= highWaterBytes) break;
		const eviction = await runExclusiveSessionLifecycleMutation({
			scope: params.storePath,
			identities: [sessionId],
			run: async () => {
				const plan = await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionDatabase(databaseOptions, (database) => {
					const protectedBeforeArchive = collectCandidateAdditionalProtection({
						database,
						preserveRecentMs: params.maintenance.preserveRecentMs,
						sessionId,
						storePath: params.storePath
					});
					for (const referenced of readReferencedSessionIds(database, void 0, [sessionId], params.maintenance)) protectedBeforeArchive.add(referenced);
					return planSessionStateDeleteIfUnreferenced({
						archiveDirectory,
						archiveTranscript: true,
						database,
						reason: "deleted",
						referencedSessionIds: protectedBeforeArchive,
						sessionId
					});
				}), "session.history.eviction-prepare");
				if (!plan) return null;
				return await runExclusiveSqliteSessionReclamation(async () => {
					const materialized = await materializeSessionStateDeletePlans([plan]);
					const diagnostics = {};
					const reclamationPlan = await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionDatabase(databaseOptions, (database) => {
						const protectedSessionIds = collectCandidateAdditionalProtection({
							database,
							preserveRecentMs: params.maintenance.preserveRecentMs,
							sessionId,
							storePath: params.storePath
						});
						if (protectedSessionIds.has(sessionId)) return null;
						return createHistoryEvictionReclamationPlan({
							databaseOptions,
							diskBudget: { preserveRecentMs: params.maintenance.preserveRecentMs },
							materializedPlans: materialized,
							protectedSessionIds,
							sessionId
						});
					}), "session.history.reclamation-plan", diagnostics);
					if (!reclamationPlan) return null;
					const reclaimed = await runSqliteSessionReclamation({
						diagnostics,
						forceInProcess: params.reclamationMode === "in-process",
						plan: reclamationPlan
					});
					if (reclaimed.kind !== reclamationPlan.kind) throw new Error(`SQLite session reclamation returned ${reclaimed.kind} for ${reclamationPlan.kind}`);
					if (!reclaimed.value.deleted) return null;
					return { archivedTranscripts: reclaimed.value.archivedTranscripts };
				});
			}
		});
		if (!eviction) {
			usage = await measureSessionPhysicalDiskUsage(params.storePath);
			continue;
		}
		const publishedArchives = await publishSessionStateArchives(resolved, eviction.archivedTranscripts);
		removedEntries += 1;
		emitArchivedTranscriptUpdates(publishedArchives);
		usage = await measureSessionPhysicalDiskUsage(params.storePath);
		if (usage.totalBytes > highWaterBytes) {
			const repruned = await pruneArchives("after-eviction");
			pruning = repruned;
			removedFiles += repruned.removedFiles;
			usage = repruned.usage;
			if (repruned.checkpointIncomplete) return finish();
		}
	}
	if (usage.totalBytes > highWaterBytes) {
		const finalPrune = await pruneArchives("final");
		pruning = finalPrune;
		removedFiles += finalPrune.removedFiles;
		usage = finalPrune.usage;
		if (finalPrune.checkpointIncomplete) return finish();
	}
	if (usage.totalBytes > highWaterBytes) {
		let after;
		while (usage.totalBytes > highWaterBytes) {
			const batch = readDiskEvictableArchivedSessionBatch({
				...after ? { after } : {},
				databaseOptions,
				preserveRecentMs: params.maintenance.preserveRecentMs
			});
			if (batch.candidates.length === 0) break;
			after = batch.cursor;
			for (const candidate of batch.candidates) {
				if (usage.totalBytes <= highWaterBytes) break;
				if (!(await runExclusiveSessionLifecycleMutation({
					scope: params.storePath,
					identities: [candidate.sessionKey, candidate.entry.sessionId],
					run: async () => await deleteDiskBudgetArchivedSessionEntry({
						...params.agentId ? { agentId: params.agentId } : {},
						archiveTranscript: false,
						deleteDeliveryArtifacts: true,
						deleteTranscriptWithoutArchive: true,
						expectedEntry: candidate.entry,
						expectedSessionId: candidate.entry.sessionId,
						storePath: params.storePath,
						target: {
							canonicalKey: candidate.sessionKey,
							storeKeys: [candidate.sessionKey]
						}
					}, resolved)
				})).deleted) {
					usage = await measureSessionPhysicalDiskUsage(params.storePath);
					continue;
				}
				removedEntries += 1;
				const pageDiagnostics = { trigger: "after-eviction" };
				const checkpointCompleted = await withSqliteSessionPageReclamation(databaseOptions, (reclaimPages) => runExclusiveSqliteSessionWrite(resolved, async () => {
					try {
						return await reclaimSqliteFreePages(databaseOptions, pageDiagnostics, {
							reclaimPages,
							onCheckpointIncomplete: (checkpoint) => deferPhysicalBudgetForCheckpoint(params, databasePath, checkpoint)
						});
					} catch {
						return true;
					}
				}, "session.history.free-pages"));
				usage = await measureSessionPhysicalDiskUsage(params.storePath);
				if (!checkpointCompleted) {
					pruning = {
						usage,
						removedFiles: 0,
						completed: false,
						checkpointIncomplete: pageDiagnostics.checkpointIncomplete ?? 1,
						checkpoint: pageDiagnostics.checkpoint
					};
					return finish();
				}
			}
			if (batch.exhausted) break;
		}
	}
	if (removedEntries > 0) {
		await refreshSqliteSessionPlannerStatisticsBestEffort(resolved, removedEntries);
		usage = await measureSessionPhysicalDiskUsage(params.storePath);
	}
	return finish();
}
//#endregion
export { applySessionEntryMaintenance as a, kickSessionHistoryDiskBudgetMaintenance as i, enforceSqliteSessionHistoryDiskBudget as n, finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort as o, inspectSqliteSessionHistoryDiskBudget as r, refreshSqliteSessionPlannerStatisticsBestEffort as s, collectAdmissionProtectedSessionIds as t };
