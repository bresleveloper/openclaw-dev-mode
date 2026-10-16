import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { a as resolveOpenClawRegisteredAgentDatabasePath, c as resolveOpenClawStateSqlitePath, i as resolveOpenClawAgentDatabaseStoredPath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-BEC3zbaw.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { d as withExistingOpenClawStateDatabaseCurrentReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { k as normalizeAgentDirRegistryPath } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, r as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as assertAgentDeletionJournalAvailable, y as reconstructAgentDeletionJournalSchema } from "./openclaw-state-db-schema-additive-CzAgdzE5.mjs";
import { o as recordLegacyMigrationReceipt } from "./state-migrations.receipts-gEcgM3Aq.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { a as captureAgentDatabasePreparationDeletion } from "./agent-database-admission-dWNS6Rcs.mjs";
import { a as readReport, i as readAgentDeletionRecoveryHolds, r as decodeHolds, t as AGENT_DELETION_RECOVERY_SOURCE_KEY } from "./agent-deletion-journal-recovery.kernel-NYQbfJsi.mjs";
import { t as parseAgentDeletionDatabasePaths } from "./agent-deletion-journal.read-Bkjt0nDs.mjs";
import { o as ensureAgentProvenanceSchema, t as deleteAgentProvenanceForAgent } from "./agent-provenance-H6O0H8k6.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
//#region src/state/agent-creation-claim.ts
const creationClaim = resolveGlobalSingleton(Symbol.for("openclaw.agentCreationClaim"), () => new AsyncLocalStorage());
const creationResources = resolveGlobalSingleton(Symbol.for("openclaw.agentCreationClaimResources"), () => /* @__PURE__ */ new Map());
/** Runs creation-owned staging that may write the recreated identity's databases. */
async function runWithAgentCreationClaim(target, run) {
	let active = true;
	const closers = /* @__PURE__ */ new Set();
	let pendingClose;
	const closeHandles = () => {
		pendingClose ??= (async () => {
			const errors = [];
			for (const close of [...closers].toReversed()) try {
				await close();
				closers.delete(close);
			} catch (error) {
				errors.push(error);
			}
			return errors;
		})().finally(() => {
			pendingClose = void 0;
		});
		return pendingClose;
	};
	const scope = {
		agentId: normalizeAgentId(target.agentId),
		statePath: path.resolve(resolveOpenClawStateSqlitePath(target.env ?? process.env)),
		isActive: () => active,
		registerClose: (close) => {
			if (!active) throw new Error("Agent creation claim is no longer active.");
			closers.add(close);
		},
		retryClose: async () => {
			if (active) throw new Error("Agent database belongs to an active agent creation claim.");
			await pendingClose;
			const errors = await closeHandles();
			if (errors.length > 0) throw new AggregateError(errors, "Agent creation database close retry failed.");
		}
	};
	return await creationClaim.run(scope, async () => {
		let outcome;
		const closeErrors = [];
		try {
			for (const previous of new Set(creationResources.values())) if (previous.agentId === scope.agentId && previous.statePath === scope.statePath) await previous.retryClose();
			outcome = ok(await run());
		} catch (error) {
			outcome = err(error);
		} finally {
			active = false;
			closeErrors.push(...await closeHandles());
		}
		if (!outcome.ok) throw closeErrors.length > 0 ? new AggregateError([outcome.error, ...closeErrors], "Agent creation claim failed.") : outcome.error;
		if (closeErrors.length > 0) throw closeErrors.length === 1 ? closeErrors[0] : new AggregateError(closeErrors, "Agent creation claim failed.");
		return outcome.value;
	});
}
function getActiveAgentCreationClaim(agentId, statePath) {
	const scope = creationClaim.getStore();
	if (!scope || !scope.isActive() || scope.agentId !== normalizeAgentId(agentId) || scope.statePath !== path.resolve(statePath)) return;
	return scope;
}
/** The identity the live creation scope may admit beneath its own completed deletion record. */
function resolveAgentCreationClaimAgentId(claimAgentId, statePath) {
	return getActiveAgentCreationClaim(claimAgentId, statePath)?.agentId;
}
/** Hold pending native custody until publication hands it to the handle, or disposal succeeds. */
function reserveAgentCreationClaimAdmission(admission, options, close) {
	const scope = getActiveAgentCreationClaim(options.agentId, resolveOpenClawStateSqlitePath(options.env ?? process.env));
	if (!scope) return;
	creationResources.set(admission, scope);
	scope.registerClose(async () => {
		if (creationResources.get(admission) !== scope) return;
		await close();
		creationResources.delete(admission);
	});
	return () => {
		creationResources.delete(admission);
	};
}
/** Tag a freshly opened handle as owned by the live creation scope for its identity. */
function registerAgentCreationClaimHandle(database, options) {
	const scope = getActiveAgentCreationClaim(options.agentId, resolveOpenClawStateSqlitePath(options.env ?? process.env));
	if (scope) creationResources.set(database, scope);
	return scope;
}
/** Refuse a creation-owned handle to every caller outside that same live scope. */
function assertAgentCreationClaimAccess(database, options) {
	assertAgentCreationClaimCurrent(options);
	const owner = creationResources.get(database);
	if (!owner) return;
	if (owner !== getActiveAgentCreationClaim(options.agentId, resolveOpenClawStateSqlitePath(options.env ?? process.env))) throw new Error("Agent database belongs to an active agent creation claim.");
}
/** A retained admission must stop before resuming native work after settlement. */
function assertAgentCreationClaimCurrent(options) {
	const scope = creationClaim.getStore();
	if (scope && !scope.isActive() && scope.agentId === normalizeAgentId(options.agentId) && scope.statePath === path.resolve(resolveOpenClawStateSqlitePath(options.env ?? process.env))) throw new Error("Agent creation claim is no longer active.");
}
/** A different spelling or state root must not borrow a creation-owned physical store. */
function assertAgentCreationClaimAliases(options, isSamePath) {
	const pathname = resolveOpenClawAgentSqlitePath(options);
	for (const owned of creationResources.keys()) if (isSamePath(owned.path, pathname)) assertAgentCreationClaimAccess(owned, options);
}
/** Release the tag once the native owner has closed the handle. */
function releaseAgentCreationClaimHandle(database) {
	creationResources.delete(database);
}
//#endregion
//#region src/state/agent-deletion-cleanup.ts
const databaseCleanup = resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanup"), () => new AsyncLocalStorage());
const cleanupHandles = resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanupHandles"), () => /* @__PURE__ */ new Map());
/** The lifecycle owner supplies live closures, never a transferable operation id. */
function createAgentDeletionDatabaseCleanup(owner) {
	return async (target, run) => {
		let active = true;
		const closers = /* @__PURE__ */ new Set();
		const closeHandles = async () => {
			const errors = [];
			for (const close of [...closers].toReversed()) try {
				await close();
				closers.delete(close);
			} catch (error) {
				errors.push(error);
			}
			return errors;
		};
		const assertActive = () => {
			if (!active) throw new Error("Agent deletion database cleanup is no longer active.");
		};
		const scope = {
			agentId: normalizeAgentId(target.agentId),
			path: path.resolve(target.path),
			statePath: path.resolve(owner.statePath),
			assertCurrent: () => {
				assertActive();
				owner.assertCurrent();
			},
			assertJournal: (statePath, entries) => {
				assertActive();
				return owner.assertJournal(statePath, entries);
			},
			registerClose: (close) => {
				assertActive();
				closers.add(close);
			},
			retryClose: async () => {
				if (active) throw new Error("Agent database belongs to an active deletion cleanup.");
				const errors = await closeHandles();
				if (errors.length > 0) throw new AggregateError(errors, "Agent deletion database close retry failed.");
			},
			withCommit: (commit) => {
				assertActive();
				owner.withCommit(commit);
			}
		};
		return await databaseCleanup.run(scope, async () => {
			let outcome;
			const closeErrors = [];
			try {
				scope.assertCurrent();
				for (const previous of new Set(cleanupHandles.values())) if (previous.statePath === scope.statePath && previous.agentId === scope.agentId && previous.path === scope.path) {
					await previous.retryClose();
					scope.assertCurrent();
				}
				owner.assertAdmission();
				const value = await run();
				scope.assertCurrent();
				outcome = ok(value);
			} catch (error) {
				outcome = err(error);
			} finally {
				active = false;
				closeErrors.push(...await closeHandles());
			}
			if (!outcome.ok) throw closeErrors.length > 0 ? new AggregateError([outcome.error, ...closeErrors], "Agent deletion database cleanup failed.") : outcome.error;
			if (closeErrors.length > 0) throw closeErrors.length === 1 ? closeErrors[0] : new AggregateError(closeErrors, "Agent deletion database cleanup failed.");
			owner.assertCurrent();
			return outcome.value;
		});
	};
}
function getAgentDeletionDatabaseCleanup(params) {
	const scope = databaseCleanup.getStore();
	if (!scope || scope.agentId !== normalizeAgentId(params.agentId) || scope.path !== resolveOpenClawAgentSqlitePath(params)) return;
	const statePath = params.statePath ?? resolveOpenClawStateSqlitePath(params.env ?? process.env);
	if (scope.statePath !== path.resolve(statePath)) throw new Error("Agent deletion database cleanup belongs to another state database.");
	return scope;
}
function assertAgentDeletionDatabaseCleanupAccess(database, options) {
	const scope = getAgentDeletionDatabaseCleanup(options);
	const owner = cleanupHandles.get(database);
	if (owner && owner !== scope) throw new Error("Agent database belongs to an active deletion cleanup.");
	scope?.assertCurrent();
}
function assertAgentDeletionCleanupAliases(options, isSamePath) {
	const pathname = resolveOpenClawAgentSqlitePath(options);
	for (const owned of cleanupHandles.keys()) if (isSamePath(owned.path, pathname)) assertAgentDeletionDatabaseCleanupAccess(owned, options);
}
function registerAgentDeletionDatabaseCleanup(database, options) {
	const scope = getAgentDeletionDatabaseCleanup(options);
	scope?.assertCurrent();
	if (scope) cleanupHandles.set(database, scope);
	return scope;
}
/** Release the tag only after the native owner has closed and released its lease. */
function releaseAgentDeletionDatabaseCleanup(database) {
	cleanupHandles.delete(database);
}
//#endregion
//#region src/state/agent-deletion-journal-recovery.ts
const JOURNAL_TABLE = "agent_deletion_journal";
const DESCRIPTION = "Reconstructed the missing agent deletion journal; held databases require explicit agent restore or delete.";
/** Schema and Doctor producers cannot infer permission to repair an unverified store. */
function assertAgentDeletionRecoveryAllowsMutation(database, pathname) {
	assertAgentDeletionJournalAvailable(database.db);
	const samePath = createOpenClawAgentDatabasePathMatcher();
	const held = readAgentDeletionRecoveryHolds(database).find((entry) => samePath(entry.path, pathname));
	if (held) throw new Error(`Agent database ${held.path} is held after deletion journal reconstruction. Run openclaw doctor --fix for explicit restoration guidance before repairing agent ${held.agentId}.`);
}
/** The caller's transaction commits canonical reconstruction and its receipt together. */
function reconstructAgentDeletionJournal(database, held, now = Date.now()) {
	if (!database.db.isTransaction) throw new Error("Agent deletion journal reconstruction requires a shared-state transaction.");
	const previous = readReport(database);
	if (!reconstructAgentDeletionJournalSchema(database.db, database.path)) return decodeHolds(database, previous?.held ?? []);
	return recordAgentDeletionRecoveryHolds(database, held, { now });
}
/** Quarantine and reconstruction use the same durable maintenance holds. */
function recordAgentDeletionRecoveryHolds(database, held, { now = Date.now(), description = DESCRIPTION } = {}) {
	if (!database.db.isTransaction) throw new Error("Agent deletion recovery requires a shared-state transaction.");
	const previous = readReport(database);
	const entries = /* @__PURE__ */ new Map();
	for (const entry of [...previous?.held ?? [], ...held.map((target) => ({
		agentId: normalizeAgentId(target.agentId),
		path: resolveOpenClawAgentDatabaseStoredPath(database.path, target.path)
	}))]) entries.set(JSON.stringify([entry.agentId, entry.path]), entry);
	const report = {
		description,
		held: [...entries.values()]
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
function resolveAgentDeletionRecoveryHolds(database, agentId, targetPaths) {
	if (!database.db.isTransaction) throw new Error("Agent deletion recovery resolution requires a shared-state transaction.");
	const report = readReport(database);
	if (!report) return 0;
	const id = normalizeAgentId(agentId);
	const targets = new Set(targetPaths.map((pathname) => resolveOpenClawAgentDatabaseStoredPath(database.path, pathname)));
	const held = report.held.filter((entry) => entry.agentId !== id || !targets.has(entry.path));
	const removed = report.held.length - held.length;
	if (removed > 0) executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).updateTable("migration_sources").set({ report_json: JSON.stringify({
		...report,
		held
	}) }).where("source_key", "=", AGENT_DELETION_RECOVERY_SOURCE_KEY));
	return removed;
}
//#endregion
//#region src/state/agent-deletion-journal.ts
const journalFenceFields = [
	"agent_id",
	"operation_id",
	"agent_dir",
	"workspace_dir",
	"sessions_dir",
	"database_paths_json",
	"cleanup_paths_json"
];
function assertAgentDeletionIdentityClaimAllowed(claimAgentId, deletedAgentId) {
	if (deletedAgentId && normalizeAgentId(claimAgentId) === normalizeAgentId(deletedAgentId)) throw new Error(`OpenClaw agent database is unavailable while agent ${normalizeAgentId(deletedAgentId)} is deleted.`);
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
		let query = db.selectFrom("agent_deletion_journal").select([
			...journalFenceFields,
			"cleanup_completed",
			"created_at",
			"delete_files"
		]);
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
	const { rows, known } = runOpenClawStateWriteTransaction((database) => readAgentDeletionPathFenceRows(database.db, purpose), {
		...options,
		initializationAgentPaths: [...options.initializationAgentPaths ?? [], claim.path]
	});
	const env = options.env ?? process.env;
	return {
		journal: known ? "known" : "unknown",
		purpose,
		claimAgentId: normalizeAgentId(claim.agentId),
		claimPath: path.resolve(claim.path),
		...claim.fenceAgentId ? { fenceAgentId: normalizeAgentId(claim.fenceAgentId) } : {},
		targetPaths: resolveSqliteDatabaseFilePaths(claim.path).map((filePath) => normalizeAgentDirRegistryPath(filePath, env)),
		entries: rows.map(({ databasePaths, cleanupPaths, ...row }) => ({
			row: {
				...row,
				cleanup_completed: row.cleanup_completed === 1 ? 1 : 0
			},
			fences: [...[
				row.agent_dir,
				row.workspace_dir,
				row.sessions_dir,
				...databasePaths
			].map((pathname) => ({
				path: pathname,
				canonicalPath: normalizeAgentDirRegistryPath(pathname, env)
			})), ...cleanupPaths.map((cleanupPath) => ({
				path: cleanupPath.path,
				canonicalPath: normalizeAgentDirRegistryPath(cleanupPath.canonicalPath, env)
			}))]
		}))
	};
}
function journalFenceFingerprint(rows) {
	return rows.map((row) => [...journalFenceFields.map((field) => row[field]), row.cleanup_completed].join("\0")).toSorted().join("\n");
}
/** Refuse database claims beneath paths still owned by an unfinished deletion. */
function assertAgentDeletionPathFence(state, snapshot) {
	const database = state.db;
	const { rows: journalRows, known } = readAgentDeletionPathFenceRows(database, snapshot.purpose);
	if (!known && journalRows.length === 0) return;
	if (journalFenceFingerprint(snapshot.entries.map((entry) => entry.row)) !== journalFenceFingerprint(journalRows)) throw new Error("Agent deletion journal changed while preparing a database claim.");
	const cleanupAgentId = (snapshot.fenceAgentId ? void 0 : getAgentDeletionDatabaseCleanup({
		agentId: snapshot.claimAgentId,
		path: snapshot.claimPath,
		statePath: state.path
	}))?.assertJournal(state.path, journalRows.map((row) => ({
		agentId: row.agent_id,
		operationId: row.operation_id,
		cleanupCompleted: row.cleanup_completed === 1
	})));
	const creationAgentId = snapshot.fenceAgentId ? void 0 : resolveAgentCreationClaimAgentId(snapshot.claimAgentId, state.path);
	for (const row of journalRows) {
		if (snapshot.fenceAgentId && snapshot.fenceAgentId !== row.agent_id) continue;
		if (row.agent_id === cleanupAgentId) continue;
		if (row.cleanup_completed === 1 && row.agent_id === creationAgentId) continue;
		assertAgentDeletionIdentityClaimAllowed(snapshot.claimAgentId, row.agent_id);
		if (row.cleanup_completed === 1) continue;
		const entry = snapshot.entries.find((candidate) => journalFenceFields.every((field) => candidate.row[field] === row[field]));
		if (!entry) throw new Error("Agent deletion journal changed while preparing a database claim.");
		for (const fence of entry.fences) {
			const blockedPath = snapshot.targetPaths.find((targetPath) => targetPath === fence.canonicalPath || isPathInside(fence.canonicalPath, targetPath));
			if (blockedPath) throw new Error(`OpenClaw agent database ${blockedPath} is unavailable while agent ${row.agent_id} deletion owns ${fence.path}.`);
		}
	}
}
function fromRow(row) {
	return {
		agentId: row.agent_id,
		operationId: row.operation_id,
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
	if (!Array.isArray(parsed) || !parsed.every((entry) => isRecord(entry) && typeof entry.path === "string" && typeof entry.canonicalPath === "string" && typeof entry.parentPath === "string" && (entry.kind === "target" || entry.kind === "symlink") && (entry.dev === null || typeof entry.dev === "number") && (entry.ino === null || typeof entry.ino === "number") && typeof entry.coversDescendants === "boolean" && typeof entry.done === "boolean" && (entry.note === void 0 || typeof entry.note === "string") && Array.isArray(entry.sourcePaths) && entry.sourcePaths.every((sourcePath) => typeof sourcePath === "string"))) throw new Error("Invalid agent deletion cleanup path journal.");
	return parsed;
}
/** Read the journal through an already validated shared-state connection. */
function readAgentDeletionJournalInDatabase(database, agentId, purpose = "maintenance") {
	const row = readAgentDeletionPathFenceRows(database.db, purpose, agentId).rows[0];
	return row ? fromRow(row) : void 0;
}
function readAgentDeletionJournal(agentId, options = {}, purpose = "maintenance") {
	return withExistingOpenClawStateDatabaseCurrentReadOnly((database) => readAgentDeletionJournalInDatabase(database, agentId, purpose), options);
}
function beginAgentDeletionJournal(entry, options = {}) {
	const normalized = {
		...entry,
		agentId: normalizeAgentId(entry.agentId),
		databasePaths: [...new Set((entry.databasePaths ?? []).map((entryPath) => path.resolve(entryPath)))],
		cleanupPaths: entry.cleanupPaths ?? []
	};
	ensureAgentProvenanceSchema(options);
	return runOpenClawStateWriteTransaction((database) => {
		const invalidatePreparation = captureAgentDatabasePreparationDeletion(normalized.agentId, database);
		if (!stageSqliteTransactionState(database.db, {
			stage() {},
			rollback() {},
			commit: invalidatePreparation
		})) throw new Error("Agent deletion journal requires a managed transaction");
		sessionChanges.emit({
			all: true,
			scope: "stores"
		}, database.db);
		assertAgentDeletionJournalAvailable(database.db);
		const db = getNodeSqliteKysely(database.db);
		const existing = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("agent_deletion_journal").selectAll().where("agent_id", "=", normalized.agentId));
		const registeredDatabasePaths = executeSqliteQuerySync(database.db, db.selectFrom("agent_databases").select("path").where("agent_id", "=", normalized.agentId)).rows.flatMap((row) => resolveSqliteDatabaseFilePaths(resolveOpenClawRegisteredAgentDatabasePath(database.path, row.path)));
		const previous = existing && fromRow(existing);
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
			return {
				...previous,
				operationId: normalized.operationId,
				databasePaths,
				cleanupPaths,
				cleanupCompleted: false,
				deleteFiles: normalized.deleteFiles
			};
		}
		const createdAt = Date.now();
		executeSqliteQuerySync(database.db, db.insertInto("agent_deletion_journal").values({
			agent_id: normalized.agentId,
			operation_id: normalized.operationId,
			agent_dir: normalized.agentDir,
			workspace_dir: normalized.workspaceDir,
			sessions_dir: normalized.sessionsDir,
			database_paths_json: JSON.stringify(databasePaths),
			cleanup_paths_json: JSON.stringify(cleanupPaths),
			created_at: createdAt,
			cleanup_completed: 0,
			delete_files: normalized.deleteFiles ? 1 : 0
		}));
		return {
			...normalized,
			databasePaths,
			cleanupPaths,
			createdAt,
			cleanupCompleted: false
		};
	}, options);
}
function updateAgentDeletionJournalCleanupPaths(agentId, operationId, cleanupPaths, options = {}) {
	return updateAgentDeletionJournalPaths(normalizeAgentId(agentId), operationId, "cleanup_paths_json", cleanupPaths, options);
}
function updateAgentDeletionJournalDatabasePaths(agentId, operationId, databasePaths, options = {}) {
	return updateAgentDeletionJournalPaths(normalizeAgentId(agentId), operationId, "database_paths_json", [...new Set(databasePaths.map((entryPath) => path.resolve(entryPath)))], options);
}
function updateAgentDeletionJournalPaths(agentId, operationId, column, paths, options) {
	return runOpenClawStateWriteTransaction((database) => {
		assertAgentDeletionJournalAvailable(database.db);
		const db = getNodeSqliteKysely(database.db);
		const result = executeSqliteQuerySync(database.db, db.updateTable("agent_deletion_journal").set({ [column]: JSON.stringify(paths) }).where("agent_id", "=", agentId).where("operation_id", "=", operationId).where("cleanup_completed", "=", 0));
		const updated = Number(result.numAffectedRows ?? 0) > 0;
		if (updated) sessionChanges.emit({
			all: true,
			scope: "stores"
		}, database.db);
		return updated;
	}, options);
}
/** Revoke an attempt while retaining its pending cleanup fence for a later owner. */
function handoffAgentDeletionJournalInDatabase(database, agentId, operationId, retryOperationId) {
	assertAgentDeletionJournalAvailable(database.db);
	const db = getNodeSqliteKysely(database.db);
	const handedOff = executeSqliteQuerySync(database.db, db.updateTable("agent_deletion_journal").set({ operation_id: retryOperationId }).where("agent_id", "=", normalizeAgentId(agentId)).where("operation_id", "=", operationId).where("cleanup_completed", "=", 0)).numAffectedRows === 1n;
	if (handedOff) sessionChanges.emit({
		all: true,
		scope: "stores"
	}, database.db);
	return handedOff;
}
/** Complete a deletion journal inside a caller-owned shared-state transaction. */
function completeAgentDeletionJournalInDatabase(database, agentId, operationId) {
	const id = normalizeAgentId(agentId);
	assertAgentDeletionJournalAvailable(database.db);
	const db = getNodeSqliteKysely(database.db);
	const result = executeSqliteQuerySync(database.db, db.updateTable("agent_deletion_journal").set({ cleanup_completed: 1 }).where("agent_id", "=", id).where("operation_id", "=", operationId));
	const completed = Number(result.numAffectedRows ?? 0) > 0;
	if (completed) {
		resolveAgentDeletionRecoveryHolds(database, id, readAgentDeletionJournalInDatabase(database, id)?.databasePaths ?? []);
		deleteAgentProvenanceForAgent(database.db, id);
		sessionChanges.emit({
			all: true,
			scope: "stores"
		}, database.db);
	}
	return completed;
}
function removeAgentDeletionJournal(agentId, operationId, options = {}) {
	return deleteAgentDeletionJournal(agentId, operationId, false, options);
}
function claimCompletedAgentDeletionJournal(agentId, operationId, options = {}) {
	return deleteAgentDeletionJournal(agentId, operationId, true, options);
}
function deleteAgentDeletionJournal(agentId, operationId, completedOnly, options) {
	const id = normalizeAgentId(agentId);
	return runOpenClawStateWriteTransaction((database) => {
		assertAgentDeletionJournalAvailable(database.db);
		const query = getNodeSqliteKysely(database.db).deleteFrom("agent_deletion_journal").where("agent_id", "=", id).where("operation_id", "=", operationId);
		const result = executeSqliteQuerySync(database.db, completedOnly ? query.where("cleanup_completed", "=", 1) : query);
		const removed = Number(result.numAffectedRows ?? 0) > 0;
		if (removed) sessionChanges.emit({
			all: true,
			scope: "stores"
		}, database.db);
		return removed;
	}, options);
}
//#endregion
export { assertAgentCreationClaimAccess as C, releaseAgentCreationClaimHandle as D, registerAgentCreationClaimHandle as E, reserveAgentCreationClaimAdmission as O, releaseAgentDeletionDatabaseCleanup as S, assertAgentCreationClaimCurrent as T, assertAgentDeletionCleanupAliases as _, handoffAgentDeletionJournalInDatabase as a, getAgentDeletionDatabaseCleanup as b, readAgentDeletionJournal as c, updateAgentDeletionJournalCleanupPaths as d, updateAgentDeletionJournalDatabasePaths as f, resolveAgentDeletionRecoveryHolds as g, recordAgentDeletionRecoveryHolds as h, completeAgentDeletionJournalInDatabase as i, runWithAgentCreationClaim as k, readAgentDeletionJournalInDatabase as l, reconstructAgentDeletionJournal as m, beginAgentDeletionJournal as n, parseCleanupPaths as o, assertAgentDeletionRecoveryAllowsMutation as p, claimCompletedAgentDeletionJournal as r, prepareAgentDeletionPathFence as s, assertAgentDeletionPathFence as t, removeAgentDeletionJournal as u, assertAgentDeletionDatabaseCleanupAccess as v, assertAgentCreationClaimAliases as w, registerAgentDeletionDatabaseCleanup as x, createAgentDeletionDatabaseCleanup as y };
