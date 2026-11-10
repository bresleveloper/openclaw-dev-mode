import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { a as resolveOpenClawRegisteredAgentDatabasePath, i as resolveOpenClawAgentDatabaseStoredPath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { n as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { A as resolveAgentCreationClaimAgentId, h as getAgentDeletionDatabaseCleanup } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { r as requireNativeDatabaseFile } from "./physical-facts-Cvtfrs3r.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { l as withExistingOpenClawStateDatabaseCurrentReadOnly, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import "./session-key-CSDERtm3.mjs";
import { A as normalizeAgentDirRegistryPath } from "./agent-scope-config-fjA2T9Gz.mjs";
import { d as publishAgentDeletionJournalStatus, f as hasClawDeletionOwnership, t as parseAgentDeletionDatabasePaths } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { b as reconstructAgentDeletionJournalSchema, i as ensureAgentDeletionJournalPhaseSchema, t as assertAgentDeletionJournalAvailable } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { r as createStateDomainPublication } from "./state-domain-publication-CEKqcWHX.mjs";
import { o as withAgentProvenancePublication, t as deleteAgentProvenanceForAgent } from "./agent-provenance-Bj5CtKpW.mjs";
import { a as recordLegacyMigrationReceipt } from "./state-migrations.receipts-CikBNdPu.mjs";
import { r as isReservedSystemAgentId } from "./agent-id-BxGhTBRK.mjs";
import { a as decodeHolds, c as readReport, i as assertAgentDeletionRecoveryHoldsMatch, n as AGENT_DELETION_RECOVERY_SOURCE_KEY, s as readAgentDeletionRecoveryHolds, t as AGENT_DELETION_RECONSTRUCTION_DESCRIPTION } from "./agent-deletion-journal-recovery.kernel-BaXrQW7-.mjs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
//#region src/state/agent-deletion-journal-publication.ts
const agentDeletionJournalPublication = createStateDomainPublication({
	domain: "agent-deletion-journal",
	keyOf: (row) => row.agentId,
	isValue: (value) => isRecord(value) && typeof value.agentId === "string" && typeof value.operationId === "string" && typeof value.cleanupCompleted === "boolean"
});
/** Observe the owning journal's commits; a read reply cannot overwrite a newer receipt. */
function observeAgentDeletionJournal(agentId, context) {
	const id = normalizeAgentId(agentId);
	let observed = false;
	let known = false;
	let current;
	return {
		release: agentDeletionJournalPublication.subscribeFacts((change) => {
			if (change.kind === "committed" && change.receipt.source.identity === context.admission.identity.key) {
				const fact = change.receipt.facts.get(id);
				if (!fact || fact.kind === "unchanged") return;
				observed = true;
				known = fact.kind !== "unknown";
				current = fact.kind === "postimage" ? fact.value : void 0;
			} else if (change.kind === "unknown" && change.identity === context.admission.identity.key) {
				observed = true;
				known = false;
			}
		}),
		seed(entry) {
			if (!observed) {
				current = entry && {
					agentId: entry.agentId,
					operationId: entry.operationId,
					cleanupCompleted: entry.cleanupCompleted
				};
				known = true;
			}
		},
		assertCurrent(operationId) {
			context.admission.assertCurrent();
			if (!known || !current || current.operationId !== operationId || current.cleanupCompleted) throw new Error(`Agent ${id} deletion no longer owns database cleanup.`);
		}
	};
}
/** Journal writes share their existing lease admission and committed receipt delivery. */
function withAgentDeletionJournalPublication(createAdmission, context) {
	return (operation) => {
		const owner = withAgentProvenancePublication(createAdmission, context)(operation);
		const publication = agentDeletionJournalPublication.begin({
			identity: context.admission.identity.key,
			assertCurrent: context.assertPublicationCurrent ?? context.admission.assertCurrent
		});
		observeSqliteWorkerCommittedFacts(owner.admission, ({ facts }) => {
			if (isRecord(facts) && facts.journalAuthority !== void 0) publication.committed(facts.journalAuthority);
		});
		const finish = owner.admission.finish.bind(owner.admission);
		owner.admission.finish = () => {
			try {
				finish();
			} finally {
				const settlement = owner.admission.settlement;
				publication.finish(settlement?.kind === "completed", true);
			}
		};
		return owner;
	};
}
//#endregion
//#region src/state/agent-deletion-journal-recovery.ts
const JOURNAL_TABLE = "agent_deletion_journal";
/** Schema and Doctor producers cannot infer permission to repair an unverified store. */
function assertAgentDeletionRecoveryAllowsMutation(database, pathname) {
	assertAgentDeletionJournalAvailable(database.db);
	const samePath = createOpenClawAgentDatabasePathMatcher();
	const held = readAgentDeletionRecoveryHolds(database).find((entry) => samePath(entry.path, pathname));
	if (held) throw new Error(`Agent database ${held.path} is held after deletion journal reconstruction. Run openclaw doctor --fix for explicit restoration guidance before repairing agent ${held.agentId}.`);
}
/** The caller's transaction commits canonical reconstruction and its receipt together. */
function reconstructAgentDeletionJournal(database, held, now = Date.now()) {
	const db = database.db;
	if (isPostgresSqlConnection(db)) requireNativeDatabaseFile("postgres", "repair");
	if (!database.db.isTransaction) throw new Error("Agent deletion journal reconstruction requires a shared-state transaction.");
	const previous = readReport(database);
	if (!reconstructAgentDeletionJournalSchema(db, database.path)) return decodeHolds(database, previous?.held ?? []);
	return recordAgentDeletionRecoveryHolds(database, held, {
		now,
		missingJournal: held.filter((target) => !previous?.held.some((entry) => entry.agentId === normalizeAgentId(target.agentId) && entry.path === resolveOpenClawAgentDatabaseStoredPath(database.path, target.path)))
	});
}
/** Quarantine and reconstruction use the same durable maintenance holds. */
function recordAgentDeletionRecoveryHolds(database, held, { now = Date.now(), description = AGENT_DELETION_RECONSTRUCTION_DESCRIPTION, missingJournal = [], excludeMissingJournal = [] } = {}) {
	if (!database.db.isTransaction) throw new Error("Agent deletion recovery requires a shared-state transaction.");
	const previous = readReport(database);
	const encode = (target) => ({
		agentId: normalizeAgentId(target.agentId),
		path: resolveOpenClawAgentDatabaseStoredPath(database.path, target.path)
	});
	const key = (entry) => JSON.stringify([entry.agentId, entry.path]);
	const entries = /* @__PURE__ */ new Map();
	for (const entry of [...previous?.held ?? [], ...held.filter((target) => !isReservedSystemAgentId(target.agentId)).map(encode)]) entries.set(key(entry), entry);
	const missing = /* @__PURE__ */ new Map();
	for (const entry of [...previous?.missingJournal ?? [], ...missingJournal.map(encode)]) if (entries.has(key(entry))) missing.set(key(entry), entry);
	for (const entry of excludeMissingJournal.map(encode)) missing.delete(key(entry));
	const report = {
		...previous,
		description,
		held: [...entries.values()],
		missingJournal: [...missing.values()]
	};
	recordLegacyMigrationReceipt(database.db, {
		sourceKey: AGENT_DELETION_RECOVERY_SOURCE_KEY,
		migrationKind: AGENT_DELETION_RECOVERY_SOURCE_KEY,
		sourcePath: database.path,
		targetTable: JOURNAL_TABLE,
		sourceSha256: null,
		sourceSizeBytes: null,
		sourceRecordCount: null,
		runId: `${AGENT_DELETION_RECOVERY_SOURCE_KEY}:${randomUUID()}`,
		now,
		reportJson: JSON.stringify(report),
		upsert: true
	});
	return decodeHolds(database, report.held);
}
/** Resolve only explicit targets; the immutable run report keeps the original reconstruction. */
function resolveAgentDeletionRecoveryHolds(database, agentId, targetPaths, predicate) {
	if (!database.db.isTransaction) throw new Error("Agent deletion recovery resolution requires a shared-state transaction.");
	const report = readReport(database);
	if (predicate) assertAgentDeletionRecoveryHoldsMatch(decodeHolds(database, report?.held ?? []), predicate);
	if (!report) return 0;
	const id = normalizeAgentId(agentId);
	const targets = new Set(targetPaths.map((pathname) => resolveOpenClawAgentDatabaseStoredPath(database.path, pathname)));
	const held = report.held.filter((entry) => entry.agentId !== id || !targets.has(entry.path));
	const missingJournal = report.missingJournal?.filter((entry) => entry.agentId !== id || !targets.has(entry.path));
	const removed = report.held.length - held.length;
	if (removed > 0) executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).updateTable("migration_sources").set({ report_json: JSON.stringify({
		...report,
		held,
		missingJournal
	}) }).where("source_key", "=", AGENT_DELETION_RECOVERY_SOURCE_KEY));
	return removed;
}
//#endregion
//#region src/state/agent-deletion-journal.ts
/** Deletion ownership refusal is distinct from an unhealthy native database. */
var AgentDatabaseDeletionRefusedError = class extends Error {};
function assertAgentDeletionIdentityClaimAllowed(claimAgentId, deletedAgentId) {
	if (deletedAgentId && normalizeAgentId(claimAgentId) === normalizeAgentId(deletedAgentId)) throw new AgentDatabaseDeletionRefusedError(`OpenClaw agent database is unavailable while agent ${normalizeAgentId(deletedAgentId)} is deleted.`);
}
function readAgentDeletionPathFenceRows(database, purpose = "runtime", agentId) {
	if (purpose === "maintenance") assertAgentDeletionJournalAvailable(database);
	try {
		if (!tableExists(database, "agent_deletion_journal")) return {
			known: false,
			rows: []
		};
		const db = getNodeSqliteKysely(database);
		let known = true;
		let query = db.selectFrom("agent_deletion_journal").selectAll();
		if (agentId !== void 0) query = query.where("agent_id", "=", normalizeAgentId(agentId));
		const rows = executeSqliteQuerySync(database, query).rows.map((row) => {
			let databasePaths = [];
			let cleanupPaths = [];
			try {
				databasePaths = parseAgentDeletionDatabasePaths(row.database_paths_json);
				cleanupPaths = parseCleanupPaths(row.cleanup_paths_json);
			} catch (error) {
				if (purpose === "maintenance") throw error;
				known = false;
			}
			return Object.assign(row, {
				databasePaths,
				cleanupPaths
			});
		});
		return {
			known,
			rows
		};
	} catch (error) {
		if (purpose === "maintenance" || isSqliteCorruptionError(error)) throw error;
		return {
			known: false,
			rows: []
		};
	}
}
function prepareAgentDeletionPathFence(claim, options = {}, purpose = claim.fenceAgentId ? "maintenance" : "runtime") {
	const env = options.env ?? process.env;
	return {
		env,
		purpose,
		claimAgentId: normalizeAgentId(claim.agentId),
		claimPath: path.resolve(claim.path),
		...claim.fenceAgentId ? { fenceAgentId: normalizeAgentId(claim.fenceAgentId) } : {},
		targetPaths: resolveSqliteDatabaseFilePaths(claim.path).map((filePath) => normalizeAgentDirRegistryPath(filePath, env))
	};
}
/** Refuse database claims beneath paths still owned by an unfinished deletion. */
function assertAgentDeletionPathFence(state, snapshot) {
	const database = state.db;
	const { rows: journalRows, known } = readAgentDeletionPathFenceRows(database, snapshot.purpose);
	if (!known && journalRows.length === 0) return;
	const cleanup = snapshot.fenceAgentId ? void 0 : getAgentDeletionDatabaseCleanup({
		agentId: snapshot.claimAgentId,
		path: snapshot.claimPath,
		statePath: state.path
	});
	cleanup?.assertCurrent();
	const cleanupAgentId = cleanup?.assertJournal(state.path, journalRows.map((row) => ({
		agentId: row.agent_id,
		operationId: row.operation_id,
		cleanupCompleted: row.cleanup_completed === 1
	})));
	const creationAgentId = snapshot.fenceAgentId ? void 0 : resolveAgentCreationClaimAgentId(snapshot.claimAgentId, state.path);
	for (const row of journalRows) {
		if (snapshot.fenceAgentId && snapshot.fenceAgentId !== row.agent_id) continue;
		if (row.agent_id === cleanupAgentId) continue;
		if (row.cleanup_completed === 1 && row.agent_id === creationAgentId) continue;
		if (row.phase === "draining" && row.cleanup_completed !== 1 && row.agent_id === snapshot.claimAgentId && !snapshot.fenceAgentId) continue;
		assertAgentDeletionIdentityClaimAllowed(snapshot.claimAgentId, row.agent_id);
		if (row.cleanup_completed === 1) continue;
		const fences = [...[
			row.agent_dir,
			row.workspace_dir,
			row.sessions_dir,
			...row.databasePaths
		].map((pathname) => ({
			path: pathname,
			canonicalPath: normalizeAgentDirRegistryPath(pathname, snapshot.env)
		})), ...row.cleanupPaths.map((cleanupPath) => ({
			path: cleanupPath.path,
			canonicalPath: normalizeAgentDirRegistryPath(cleanupPath.canonicalPath, snapshot.env)
		}))];
		for (const fence of fences) {
			const blockedPath = snapshot.targetPaths.find((targetPath) => targetPath === fence.canonicalPath || isPathInside(fence.canonicalPath, targetPath));
			if (blockedPath) throw new AgentDatabaseDeletionRefusedError(`OpenClaw agent database ${blockedPath} is unavailable while agent ${row.agent_id} deletion owns ${fence.path}.`);
		}
	}
}
function fromRow(row) {
	if (row.phase != null && row.phase !== "draining" && row.phase !== "retiring") throw new Error("Invalid agent deletion journal phase.");
	return {
		agentId: row.agent_id,
		operationId: row.operation_id,
		phase: row.phase === "draining" ? "draining" : "retiring",
		agentDir: row.agent_dir,
		workspaceDir: row.workspace_dir,
		sessionsDir: row.sessions_dir,
		databasePaths: row.databasePaths ?? parseAgentDeletionDatabasePaths(row.database_paths_json),
		cleanupPaths: row.cleanupPaths ?? parseCleanupPaths(row.cleanup_paths_json),
		createdAt: row.created_at,
		cleanupCompleted: row.cleanup_completed === 1,
		deleteFiles: row.delete_files === 1
	};
}
function parseCleanupPaths(value) {
	const parsed = JSON.parse(value);
	if (!Array.isArray(parsed) || !parsed.every((entry) => isRecord(entry) && typeof entry.path === "string" && typeof entry.canonicalPath === "string" && typeof entry.parentPath === "string" && (entry.kind === "target" || entry.kind === "symlink") && (entry.dev === null || typeof entry.dev === "number" && Number.isInteger(entry.dev) || typeof entry.dev === "string" && /^(0|-?[1-9][0-9]*)$/u.test(entry.dev)) && (entry.ino === null || typeof entry.ino === "number" && Number.isInteger(entry.ino) || typeof entry.ino === "string" && /^(0|-?[1-9][0-9]*)$/u.test(entry.ino)) && typeof entry.coversDescendants === "boolean" && typeof entry.done === "boolean" && (entry.note === void 0 || typeof entry.note === "string") && Array.isArray(entry.sourcePaths) && entry.sourcePaths.every((sourcePath) => typeof sourcePath === "string"))) throw new Error("Invalid agent deletion cleanup path journal.");
	return parsed;
}
/** Read the journal through an already validated shared-state connection. */
function readAgentDeletionJournalInDatabase(database, agentId, purpose = "maintenance") {
	const row = readAgentDeletionPathFenceRows(database.db, purpose, agentId).rows[0];
	return row ? fromRow(row) : void 0;
}
function listPendingAgentDeletionJournalsInDatabase(database) {
	const entries = [];
	const manualClawAgentIds = [];
	for (const row of readAgentDeletionPathFenceRows(database.db).rows) {
		if (row.cleanup_completed === 1) continue;
		if (row.phase == null && hasClawDeletionOwnership(database, row.agent_id)) manualClawAgentIds.push(row.agent_id);
		else entries.push(fromRow(row));
	}
	return {
		entries,
		manualClawAgentIds
	};
}
function readAgentDeletionJournal(agentId, options = {}, purpose = "maintenance") {
	return withExistingOpenClawStateDatabaseCurrentReadOnly((database) => readAgentDeletionJournalInDatabase(database, agentId, purpose), purpose === "runtime" && !isMainThread ? {
		...options,
		allowNativeRead: true
	} : options);
}
function beginAgentDeletionJournalInDatabase(database, entry, preserveDeleteFiles = false, recoveryOperationId) {
	const normalized = {
		...entry,
		phase: entry.phase ?? "retiring",
		agentId: normalizeAgentId(entry.agentId),
		databasePaths: [...new Set((entry.databasePaths ?? []).map((entryPath) => path.resolve(entryPath)))],
		cleanupPaths: entry.cleanupPaths ?? []
	};
	sessionChanges.emit({
		all: true,
		scope: "stores"
	}, database.db);
	ensureAgentDeletionJournalPhaseSchema(database.db);
	const db = getNodeSqliteKysely(database.db);
	const existing = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("agent_deletion_journal").selectAll().where("agent_id", "=", normalized.agentId));
	if (recoveryOperationId !== void 0) {
		if (!existing || existing.operation_id !== recoveryOperationId || existing.cleanup_completed !== 0) throw new Error(`Agent ${normalized.agentId} deletion changed before recovery.`);
		if (existing.phase == null && hasClawDeletionOwnership(database, normalized.agentId)) throw new Error(`Agent ${normalized.agentId} deletion requires its Claw removal owner.`);
	}
	const registeredDatabasePaths = executeSqliteQuerySync(database.db, db.selectFrom("agent_databases").select("path").where("agent_id", "=", normalized.agentId)).rows.flatMap((row) => resolveSqliteDatabaseFilePaths(resolveOpenClawRegisteredAgentDatabasePath(database.path, row.path)));
	const previous = existing && fromRow(existing);
	if (preserveDeleteFiles && previous) normalized.deleteFiles = previous.deleteFiles;
	const databasePaths = [...new Set([
		...previous?.databasePaths ?? [],
		...normalized.databasePaths,
		...registeredDatabasePaths
	].map((entryPath) => path.resolve(entryPath)))];
	const cleanupPaths = previous?.cleanupPaths ?? normalized.cleanupPaths;
	if (previous) {
		executeSqliteQuerySync(database.db, db.updateTable("agent_deletion_journal").set({
			operation_id: normalized.operationId,
			database_paths_json: JSON.stringify(databasePaths),
			cleanup_paths_json: JSON.stringify(cleanupPaths),
			cleanup_completed: 0,
			delete_files: normalized.deleteFiles ? 1 : 0
		}).where("agent_id", "=", normalized.agentId));
		publishAgentDeletionJournalStatus(database.db, normalized.agentId, "pending");
		const result = {
			previousEntry: previous,
			entry: {
				...previous,
				operationId: normalized.operationId,
				databasePaths,
				cleanupPaths,
				cleanupCompleted: false,
				deleteFiles: normalized.deleteFiles
			}
		};
		agentDeletionJournalPublication.stagePostimages(database.db, [{
			agentId: result.entry.agentId,
			operationId: result.entry.operationId,
			cleanupCompleted: result.entry.cleanupCompleted
		}]);
		return result;
	}
	const createdAt = Date.now();
	executeSqliteQuerySync(database.db, db.insertInto("agent_deletion_journal").values({
		agent_id: normalized.agentId,
		operation_id: normalized.operationId,
		phase: entry.phase ?? null,
		agent_dir: normalized.agentDir,
		workspace_dir: normalized.workspaceDir,
		sessions_dir: normalized.sessionsDir,
		database_paths_json: JSON.stringify(databasePaths),
		cleanup_paths_json: JSON.stringify(cleanupPaths),
		created_at: createdAt,
		cleanup_completed: 0,
		delete_files: normalized.deleteFiles ? 1 : 0
	}));
	publishAgentDeletionJournalStatus(database.db, normalized.agentId, "pending");
	const result = { entry: {
		...normalized,
		databasePaths,
		cleanupPaths,
		createdAt,
		cleanupCompleted: false
	} };
	agentDeletionJournalPublication.stagePostimages(database.db, [{
		agentId: result.entry.agentId,
		operationId: result.entry.operationId,
		cleanupCompleted: result.entry.cleanupCompleted
	}]);
	return result;
}
function updateAgentDeletionJournalPathsInDatabase(database, agentId, operationId, column, paths) {
	assertAgentDeletionJournalAvailable(database.db);
	const db = getNodeSqliteKysely(database.db);
	const result = executeSqliteQuerySync(database.db, db.updateTable("agent_deletion_journal").set({ [column]: JSON.stringify(paths) }).where("agent_id", "=", agentId).where("operation_id", "=", operationId).where("cleanup_completed", "=", 0));
	const updated = Number(result.numAffectedRows ?? 0) > 0;
	if (updated) sessionChanges.emit({
		all: true,
		scope: "stores"
	}, database.db);
	return updated;
}
/** Revoke an attempt while retaining its pending cleanup fence for a later owner. */
function handoffAgentDeletionJournalInDatabase(database, agentId, operationId, retryOperationId) {
	assertAgentDeletionJournalAvailable(database.db);
	const db = getNodeSqliteKysely(database.db);
	const handedOff = executeSqliteQuerySync(database.db, db.updateTable("agent_deletion_journal").set({ operation_id: retryOperationId }).where("agent_id", "=", normalizeAgentId(agentId)).where("operation_id", "=", operationId).where("cleanup_completed", "=", 0)).numAffectedRows === 1n;
	if (handedOff) {
		agentDeletionJournalPublication.stagePostimages(database.db, [{
			agentId: normalizeAgentId(agentId),
			operationId: retryOperationId,
			cleanupCompleted: false
		}]);
		sessionChanges.emit({
			all: true,
			scope: "stores"
		}, database.db);
	}
	return handedOff;
}
/** Complete a deletion journal inside a caller-owned shared-state transaction. */
function completeAgentDeletionJournalInDatabase(database, agentId, operationId) {
	const id = normalizeAgentId(agentId);
	ensureAgentDeletionJournalPhaseSchema(database.db);
	const db = getNodeSqliteKysely(database.db);
	const completed = executeSqliteQueryTakeFirstSync(database.db, db.updateTable("agent_deletion_journal").set({ cleanup_completed: 1 }).where("agent_id", "=", id).where("operation_id", "=", operationId).where((eb) => eb.or([eb("phase", "is", null), eb("phase", "=", "retiring")])).returning("database_paths_json"));
	if (completed) {
		publishAgentDeletionJournalStatus(database.db, id, "complete");
		agentDeletionJournalPublication.stagePostimages(database.db, [{
			agentId: id,
			operationId,
			cleanupCompleted: true
		}]);
		resolveAgentDeletionRecoveryHolds(database, id, parseAgentDeletionDatabasePaths(completed.database_paths_json));
		deleteAgentProvenanceForAgent(database.db, id);
		sessionChanges.emit({
			all: true,
			scope: "stores"
		}, database.db);
	}
	return completed !== void 0;
}
/** The caller owns journal authority, transaction admission, and committed publication. */
function deleteAgentDeletionJournalInDatabase(database, agentId, operationId, completedOnly) {
	const id = normalizeAgentId(agentId);
	assertAgentDeletionJournalAvailable(database.db);
	const query = getNodeSqliteKysely(database.db).deleteFrom("agent_deletion_journal").where("agent_id", "=", id).where("operation_id", "=", operationId);
	const result = executeSqliteQuerySync(database.db, completedOnly ? query.where("cleanup_completed", "=", 1) : query);
	const removed = Number(result.numAffectedRows ?? 0) > 0;
	if (removed) {
		publishAgentDeletionJournalStatus(database.db, id, "absent");
		agentDeletionJournalPublication.stageDeletions(database.db, [id]);
		sessionChanges.emit({
			all: true,
			scope: "stores"
		}, database.db);
	}
	return removed;
}
/** Read current journal facts through the captured physical shared-state worker. */
async function readAgentDeletionJournalAsync(agentId, options = {}) {
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: options.database?.path ?? options.path
	});
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "agentDeletion.read",
		input: { agentId: normalizeAgentId(agentId) }
	}), { existingOnly: true });
	context.admission.assertCurrent();
	return result;
}
/** Keep an effect-boundary journal assertion current through committed owner writes. */
async function prepareAgentDeletionJournalObservation(agentId, options = {}) {
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: options.database?.path ?? options.path
	});
	const observation = observeAgentDeletionJournal(agentId, context);
	try {
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
		const entry = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "agentDeletion.read",
			input: { agentId: normalizeAgentId(agentId) }
		}), { existingOnly: true });
		observation.seed(entry);
		return {
			entry,
			assertCurrent: (operationId) => observation.assertCurrent(operationId),
			release: observation.release
		};
	} catch (error) {
		observation.release();
		throw error;
	}
}
/** Committed-state read; deletion owners recheck pending entries under write authority. */
async function listPendingAgentDeletionJournalsAsync(options = {}) {
	const reply = await executeExistingOpenClawStateRead(options, {
		type: "agentRecovery.pendingDeletions",
		input: void 0
	}, { current: true });
	if (reply && (!reply.ok || reply.type !== "agentRecovery.pendingDeletions")) throw new Error("Unexpected pending agent deletion read result");
	return {
		entries: reply?.entries ?? [],
		manualClawAgentIds: reply?.manualClawAgentIds ?? []
	};
}
/** Administrative safety check; the caller retains its own deletion/monitor authority. */
async function assertNoAgentDatabaseLeasesAsync(agentId, options = {}) {
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: options.database?.path ?? options.path
	});
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	await executeOpenClawStateWorker(context, {
		type: "agentDeletion.assertNoDatabaseLeasesUnowned",
		input: { agentId: normalizeAgentId(agentId) }
	});
}
//#endregion
export { withAgentDeletionJournalPublication as C, observeAgentDeletionJournal as S, assertAgentDeletionRecoveryAllowsMutation as _, completeAgentDeletionJournalInDatabase as a, resolveAgentDeletionRecoveryHolds as b, listPendingAgentDeletionJournalsAsync as c, prepareAgentDeletionJournalObservation as d, prepareAgentDeletionPathFence as f, updateAgentDeletionJournalPathsInDatabase as g, readAgentDeletionJournalInDatabase as h, beginAgentDeletionJournalInDatabase as i, listPendingAgentDeletionJournalsInDatabase as l, readAgentDeletionJournalAsync as m, assertAgentDeletionPathFence as n, deleteAgentDeletionJournalInDatabase as o, readAgentDeletionJournal as p, assertNoAgentDatabaseLeasesAsync as r, handoffAgentDeletionJournalInDatabase as s, AgentDatabaseDeletionRefusedError as t, parseCleanupPaths as u, reconstructAgentDeletionJournal as v, agentDeletionJournalPublication as x, recordAgentDeletionRecoveryHolds as y };
