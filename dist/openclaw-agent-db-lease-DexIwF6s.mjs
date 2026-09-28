import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { i as readDatabasePathIdentitySync } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { r as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-Bu0_ELYu.mjs";
import { i as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { p as openClawStateDatabaseCache, y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { a as resolveOpenClawStateDirForDatabasePath, s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { a as markOpenClawAgentIntegrityClean, c as recordOpenClawAgentIntegrityVerification, o as readOpenClawAgentIntegrityVerification, r as clearOpenClawAgentIntegrityVerification } from "./openclaw-quarantine-store-BBmdpwTz.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { a as withOpenClawStateReadOnlyLocation, tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { c as runOpenClawStateWriteTransaction, f as ensureAgentDatabaseLeaseSchema, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-UfK-2Yan.mjs";
import { a as prepareAgentDeletionPathFence, t as assertAgentDeletionPathFence } from "./agent-deletion-journal-CZw0kGMX.mjs";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import crypto from "node:crypto";
//#region src/state/openclaw-agent-db-existing-write.ts
const existingAgentLeaseSchema = [
	"schema_meta",
	"state_leases",
	"agent_database_leases"
].map((table) => extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, table, {
	endMarker: ") STRICT;",
	errorMessage: "Existing agent lease schema is unavailable."
})).join("\n");
function withExistingAgentLeaseWrite(maintenance, options, operation) {
	return runExistingOpenClawStateWriteTransaction(({ db }) => {
		maintenance.assertOwnedInTransaction(db);
		const result = operation(db);
		maintenance.assertOwnedInTransaction(db);
		return result;
	}, options, {
		operationLabel: "agent.database.maintenance.admission",
		schemaSql: existingAgentLeaseSchema,
		busyTimeoutMs: 0
	});
}
//#endregion
//#region src/state/openclaw-agent-db-lease.ts
const AGENT_DATABASE_MAINTENANCE_LEASE = {
	scope: "core:agent-database-maintenance",
	key: "global"
};
var OpenClawAgentDatabaseLeaseActiveError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "OpenClawAgentDatabaseLeaseActiveError";
	}
};
const maintenanceAuthority = new AsyncLocalStorage();
/** Ordinary agent worker routing cannot borrow native maintenance authority. */
function hasAgentDatabaseMaintenanceAuthority() {
	return maintenanceAuthority.getStore() !== void 0;
}
function runWithAgentDatabaseMaintenanceAuthority(authority, databasePath, run) {
	const scope = getOpenClawDatabaseMaintenanceScope();
	return maintenanceAuthority.run({
		authority,
		databasePath: path.resolve(databasePath),
		assertScopeCurrent: scope ? () => scope.assertAdmission() : void 0
	}, run);
}
/** Revalidate the held lease, including immediately before committing a versioned rebuild. */
function assertAgentDatabaseMaintenanceAuthority(expected) {
	const authority = maintenanceAuthority.getStore()?.authority;
	if (!authority || expected && authority !== expected) throw new Error("Agent identity migration requires stopped-writer maintenance; stop active agents and run openclaw doctor --fix.");
	authority.assertOwned();
	maintenanceAuthority.getStore()?.assertScopeCurrent?.();
}
/** Revalidate a maintenance owner when present, without requiring ordinary opens to hold one. */
function assertAgentDatabaseMaintenanceAuthorityIfPresent() {
	maintenanceAuthority.getStore()?.assertScopeCurrent?.();
	maintenanceAuthority.getStore()?.authority.assertOwned();
}
/** Raw maintenance writers share the captured state owner, including explicit-env Doctor runs. */
function invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(pathname, env) {
	const maintenance = maintenanceAuthority.getStore();
	maintenance?.authority.assertOwned();
	clearOpenClawAgentIntegrityVerification(pathname, maintenance ? { OPENCLAW_STATE_DIR: resolveOpenClawStateDirForDatabasePath(maintenance.databasePath) } : env);
}
/** Verify the maintenance owner and its independent heartbeat before a synchronous phase. */
function renewAgentDatabaseMaintenanceAuthorityIfPresent() {
	const authority = maintenanceAuthority.getStore()?.authority;
	if (!authority) return;
	if (!authority.renew) throw new Error("Agent database maintenance authority cannot renew its lease.");
	authority.renew();
}
function claimOpenClawAgentDatabaseLease(params, leaseId = crypto.randomUUID(), onVerification) {
	const agentId = normalizeAgentId(params.agentId);
	const deletionFence = prepareAgentDeletionPathFence({
		agentId,
		path: params.path
	}, { env: params.env });
	const ownerStartTime = getFileLockProcessStartTime(process.pid);
	runOpenClawStateWriteTransaction((database) => claimAgentDatabaseLeaseInDatabase(database, {
		leaseId,
		agentId,
		path: params.path,
		ownerPid: process.pid,
		ownerStartTime
	}, deletionFence, params.env, onVerification), { env: params.env });
	return leaseId;
}
function claimAgentDatabaseLeaseInDatabase(database, owner, deletionFence, env, onVerification) {
	ensureAgentDatabaseLeaseSchema(database.db);
	const db = getNodeSqliteKysely(database.db);
	const maintenance = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("state_leases").select("owner").where("scope", "=", AGENT_DATABASE_MAINTENANCE_LEASE.scope).where("lease_key", "=", AGENT_DATABASE_MAINTENANCE_LEASE.key).where("expires_at", ">", Date.now()));
	const authority = maintenanceAuthority.getStore();
	if (maintenance || authority) throw new Error("Agent database maintenance is in progress; retry after openclaw doctor --fix completes.");
	assertAgentDeletionPathFence(database, deletionFence);
	for (const held of readAgentDatabaseLeases(database.db)) if (mayShareAgentDatabaseFile(held.path, owner.path) && isAgentDatabaseLeaseStale(held)) {
		clearAgentDatabaseLeaseVerifications(database.db, held.path, env);
		executeSqliteQuerySync(database.db, db.deleteFrom("agent_database_leases").where("lease_id", "=", held.lease_id));
	}
	const verification = readOpenClawAgentIntegrityVerification(owner.path, env, true);
	const hasLiveLease = hasAgentDatabasePathLease(database.db, owner.path);
	onVerification?.(verification && hasLiveLease ? {
		...verification,
		clean_close: 0
	} : verification, hasLiveLease);
	executeSqliteQuerySync(database.db, db.insertInto("agent_database_leases").values({
		lease_id: owner.leaseId,
		agent_id: owner.agentId,
		path: owner.path,
		owner_pid: owner.ownerPid,
		owner_start_time: owner.ownerStartTime,
		opened_at: Date.now()
	}));
}
function releaseOpenClawAgentDatabaseLease(leaseId, options = {}, closeOutcome) {
	const release = (database) => {
		const db = getNodeSqliteKysely(database);
		const held = executeSqliteQueryTakeFirstSync(database, db.selectFrom("agent_database_leases").select("path").where("lease_id", "=", leaseId));
		if (held && !closeOutcome) clearAgentDatabaseLeaseVerifications(database, held.path, options.env);
		executeSqliteQuerySync(database, db.deleteFrom("agent_database_leases").where("lease_id", "=", leaseId));
		if (closeOutcome && closeOutcome !== "read-only" && held?.path === closeOutcome.path && !hasAgentDatabasePathLease(database, closeOutcome.path)) markOpenClawAgentIntegrityClean(closeOutcome.path, options.env ?? process.env, closeOutcome.identity);
	};
	const maintenance = maintenanceAuthority.getStore();
	const databasePath = path.resolve(options.database?.path ?? options.path ?? resolveOpenClawStateSqlitePath(options.env));
	if (maintenance?.databasePath === databasePath) return withExistingAgentLeaseWrite(maintenance.authority, options, release);
	runOpenClawStateWriteTransaction((database) => {
		ensureAgentDatabaseLeaseSchema(database.db);
		release(database.db);
	}, options);
}
function agentDatabaseLeasePaths(database, excludedLeaseId) {
	let query = getNodeSqliteKysely(database).selectFrom("agent_database_leases").select("path").distinct();
	if (excludedLeaseId) query = query.where("lease_id", "!=", excludedLeaseId);
	return executeSqliteQuerySync(database, query).rows.map((row) => row.path);
}
function mayShareAgentDatabaseFile(left, right) {
	if (left === right) return true;
	try {
		const first = fs.statSync(left, {
			bigint: true,
			throwIfNoEntry: false
		});
		const second = fs.statSync(right, {
			bigint: true,
			throwIfNoEntry: false
		});
		return !first || !second || first.dev === second.dev && first.ino === second.ino;
	} catch {
		return true;
	}
}
function hasAgentDatabasePathLease(database, pathname, excludedLeaseId) {
	return agentDatabaseLeasePaths(database, excludedLeaseId).some((held) => mayShareAgentDatabaseFile(held, pathname));
}
/** A full check may replace invalidated proof only while its sole admitted owner survives. */
function recordOpenClawAgentDatabaseIntegrityVerified(leaseId, params, identity) {
	runOpenClawStateWriteTransaction((database) => {
		assertOpenClawAgentDatabaseLease(leaseId, params);
		if (!hasAgentDatabasePathLease(database.db, params.path, leaseId)) recordOpenClawAgentIntegrityVerification(params.path, params.env ?? process.env, identity);
	}, { env: params.env });
}
function clearAgentDatabaseLeaseVerifications(database, pathname, env = process.env) {
	for (const held of /* @__PURE__ */ new Set([pathname, ...agentDatabaseLeasePaths(database)])) if (mayShareAgentDatabaseFile(held, pathname)) clearOpenClawAgentIntegrityVerification(held, env);
}
/** An awaited open may consume its scan only while its original runtime claim survives. */
function assertOpenClawAgentDatabaseLease(leaseId, params) {
	const ownerStartTime = getFileLockProcessStartTime(process.pid);
	const database = openOpenClawStateDatabase({ env: params.env });
	const db = getNodeSqliteKysely(database.db);
	const held = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("agent_database_leases").select([
		"agent_id",
		"path",
		"owner_pid",
		"owner_start_time"
	]).where("lease_id", "=", leaseId));
	if (!held || held.agent_id !== params.agentId || held.path !== params.path || held.owner_pid !== process.pid || held.owner_start_time !== null && ownerStartTime !== null && held.owner_start_time !== ownerStartTime) throw new Error(`Agent database open lost its runtime lease: ${params.path}`);
}
/** Preparation grants no access; claim repeats admission on the captured shared owner. */
function prepareOpenClawAgentDatabaseWorkerLease(params, sharedDatabase, leaseId) {
	const database = {
		db: sharedDatabase.db,
		path: sharedDatabase.path,
		walMaintenance: sharedDatabase.walMaintenance
	};
	const identity = requireOpenClawStateDatabaseIdentity(database);
	const assertCurrent = () => {
		if (!database.db.isOpen || requireOpenClawStateDatabaseIdentity(database) !== identity) throw new Error("Prepared agent database lease lost its original shared owner");
	};
	assertCurrent();
	const ownerPid = process.pid;
	const receipt = Object.freeze({
		leaseId,
		agentId: normalizeAgentId(params.agentId),
		path: path.resolve(params.path),
		ownerPid,
		ownerStartTime: getFileLockProcessStartTime(ownerPid),
		sharedStatePath: database.path,
		sharedStateIdentity: identity.key
	});
	const options = {
		database,
		path: database.path,
		env: { ...params.env ?? process.env }
	};
	return {
		receipt,
		claim(onVerification) {
			assertCurrent();
			const deletionFence = prepareAgentDeletionPathFence({
				agentId: receipt.agentId,
				path: receipt.path
			}, options);
			runOpenClawStateWriteTransaction((current) => {
				assertCurrent();
				claimAgentDatabaseLeaseInDatabase(current, receipt, deletionFence, options.env, onVerification);
			}, options);
			return receipt.leaseId;
		}
	};
}
/** Capture the exact admitted claim so its parent can finish cleanup after native Worker exit. */
function readOpenClawAgentDatabaseWorkerLeaseReceiptFromClaim(leaseId, params) {
	assertOpenClawAgentDatabaseLease(leaseId, params);
	const database = openOpenClawStateDatabase({ env: params.env });
	const row = executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("agent_database_leases").select([
		"agent_id",
		"path",
		"owner_pid",
		"owner_start_time"
	]).where("lease_id", "=", leaseId));
	if (!row) throw new Error("SQLite reclamation Worker lost its admitted lease receipt");
	return {
		leaseId,
		agentId: row.agent_id,
		path: row.path,
		ownerPid: row.owner_pid,
		ownerStartTime: row.owner_start_time,
		sharedStatePath: database.path,
		sharedStateIdentity: readDatabasePathIdentitySync(database.path).key
	};
}
/** The caller owns the original shared transaction and has joined the exact native Worker exit. */
function releaseExitedOpenClawAgentDatabaseLeaseInDatabase(database, receipt) {
	const db = getNodeSqliteKysely(database);
	const row = executeSqliteQueryTakeFirstSync(database, db.selectFrom("agent_database_leases").select([
		"agent_id",
		"path",
		"owner_pid",
		"owner_start_time"
	]).where("lease_id", "=", receipt.leaseId));
	if (!row) return;
	if (row.agent_id !== receipt.agentId || row.path !== receipt.path || row.owner_pid !== receipt.ownerPid || row.owner_start_time !== receipt.ownerStartTime) throw new Error("SQLite reclamation Worker lease cleanup receipt no longer matches");
	clearAgentDatabaseLeaseVerifications(database, receipt.path, { OPENCLAW_STATE_DIR: resolveOpenClawStateDirForDatabasePath(receipt.sharedStatePath) });
	executeSqliteQuerySync(database, db.deleteFrom("agent_database_leases").where("lease_id", "=", receipt.leaseId));
}
function readAgentDatabaseLeases(database) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("agent_database_leases").select([
		"agent_id",
		"lease_id",
		"owner_pid",
		"owner_start_time",
		"path"
	])).rows;
}
function isAgentDatabaseLeaseStale(row) {
	if (isPidDefinitelyDead(row.owner_pid)) return true;
	const currentStartTime = getFileLockProcessStartTime(row.owner_pid);
	return row.owner_start_time !== null && currentStartTime !== null && row.owner_start_time !== currentStartTime;
}
/** Read-only diagnostic observation; an empty result never grants maintenance authority. */
function readActiveOpenClawAgentDatabaseLeasesReadOnly(options = {}, openStateSchemaReadAdmission) {
	const pathname = path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env));
	try {
		fs.statSync(pathname);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return [];
		throw error;
	}
	const cached = openClawStateDatabaseCache.isOpenClawStateDatabaseOpen(pathname) ? openClawStateDatabaseCache.getOpenClawStateDatabaseIfOpenAtPath(pathname) : void 0;
	const readActiveLeases = (db) => runWithSqliteBusyTimeout(db, 250, () => {
		if (!tableExists(db, "agent_database_leases")) return [];
		return readAgentDatabaseLeases(db).filter((row) => !isAgentDatabaseLeaseStale(row));
	});
	if (!cached) return withOpenClawStateReadOnlyLocation(({ db }) => readActiveLeases(db), pathname, prepareSqliteReadOnlyLocationSync(pathname), openStateSchemaReadAdmission);
	const closeSchemaReadAdmission = openStateSchemaReadAdmission?.(cached.db);
	try {
		return readActiveLeases(cached.db);
	} finally {
		closeSchemaReadAdmission?.();
	}
}
/** Doctor holds both lifecycle coordinators before checking writers, without schema repair. */
function assertNoOpenClawAgentDatabaseLeasesReadOnly(options = {}, openStateSchemaReadAdmission) {
	const [owner] = readActiveOpenClawAgentDatabaseLeasesReadOnly(options, openStateSchemaReadAdmission);
	if (owner) throw new OpenClawAgentDatabaseLeaseActiveError(`Agent ${owner.agent_id} database is still open in process ${owner.owner_pid}; stop that process before Doctor repair.`);
}
function assertNoOpenClawAgentDatabaseLeases(agentIdRaw, options = {}) {
	if (options.schemaPolicy === "existing") {
		if (typeof agentIdRaw === "string") throw new Error("Existing-schema agent drainage requires a real maintenance owner.");
		return assertNoExistingAgentDatabaseLeases(agentIdRaw, options);
	}
	const maintenance = typeof agentIdRaw === "string" ? void 0 : agentIdRaw;
	const agentId = typeof agentIdRaw === "string" ? normalizeAgentId(agentIdRaw) : void 0;
	const rows = runOpenClawStateWriteTransaction((database) => {
		maintenance?.assertOwnedInTransaction(database.db);
		ensureAgentDatabaseLeaseSchema(database.db);
		return readAgentDatabaseLeases(database.db);
	}, options);
	const staleLeaseIds = rows.filter(isAgentDatabaseLeaseStale).map((row) => row.lease_id);
	if (staleLeaseIds.length > 0) runOpenClawStateWriteTransaction((database) => {
		maintenance?.assertOwnedInTransaction(database.db);
		ensureAgentDatabaseLeaseSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		for (const row of rows.filter((candidate) => staleLeaseIds.includes(candidate.lease_id))) clearAgentDatabaseLeaseVerifications(database.db, row.path, options.env);
		executeSqliteQuerySync(database.db, db.deleteFrom("agent_database_leases").where("lease_id", "in", staleLeaseIds));
	}, options);
	const staleLeaseIdSet = new Set(staleLeaseIds);
	for (const row of rows) {
		if (staleLeaseIdSet.has(row.lease_id)) continue;
		const deletionFence = agentId ? prepareAgentDeletionPathFence({
			agentId: row.agent_id,
			path: row.path,
			fenceAgentId: agentId
		}, options) : void 0;
		let leaseStillExists = false;
		runOpenClawStateWriteTransaction((database) => {
			maintenance?.assertOwnedInTransaction(database.db);
			ensureAgentDatabaseLeaseSchema(database.db);
			const db = getNodeSqliteKysely(database.db);
			leaseStillExists = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("agent_database_leases").select("lease_id").where("lease_id", "=", row.lease_id)) !== void 0;
			if (leaseStillExists && row.agent_id !== agentId && deletionFence) assertAgentDeletionPathFence(database, deletionFence);
		}, options);
		if (leaseStillExists && (!agentId || row.agent_id === agentId)) {
			const remediation = agentId ? "." : "; stop that process and rerun openclaw doctor --fix.";
			throw new OpenClawAgentDatabaseLeaseActiveError(`Agent ${row.agent_id} database is still open in another process${remediation}`);
		}
	}
}
/** Stable existing rows can be drained before the candidate is allowed to migrate. */
function assertNoExistingAgentDatabaseLeases(maintenance, options) {
	withExistingAgentLeaseWrite(maintenance, options, (db) => {
		const query = getNodeSqliteKysely(db);
		const rows = executeSqliteQuerySync(db, query.selectFrom("agent_database_leases").select([
			"agent_id",
			"lease_id",
			"owner_pid",
			"owner_start_time",
			"path"
		])).rows;
		for (const row of rows) {
			const currentStart = getFileLockProcessStartTime(row.owner_pid);
			if (isPidDefinitelyDead(row.owner_pid) || row.owner_start_time !== null && currentStart !== null && row.owner_start_time !== currentStart) {
				clearAgentDatabaseLeaseVerifications(db, row.path, options.env);
				executeSqliteQuerySync(db, query.deleteFrom("agent_database_leases").where("lease_id", "=", row.lease_id));
			} else throw new OpenClawAgentDatabaseLeaseActiveError(`Agent ${row.agent_id} database is still open in another process; stop that process and retry.`);
		}
	});
}
//#endregion
export { renewAgentDatabaseMaintenanceAuthorityIfPresent as _, assertNoOpenClawAgentDatabaseLeases as a, claimOpenClawAgentDatabaseLease as c, prepareOpenClawAgentDatabaseWorkerLease as d, readActiveOpenClawAgentDatabaseLeasesReadOnly as f, releaseOpenClawAgentDatabaseLease as g, releaseExitedOpenClawAgentDatabaseLeaseInDatabase as h, assertAgentDatabaseMaintenanceAuthorityIfPresent as i, hasAgentDatabaseMaintenanceAuthority as l, recordOpenClawAgentDatabaseIntegrityVerified as m, OpenClawAgentDatabaseLeaseActiveError as n, assertNoOpenClawAgentDatabaseLeasesReadOnly as o, readOpenClawAgentDatabaseWorkerLeaseReceiptFromClaim as p, assertAgentDatabaseMaintenanceAuthority as r, assertOpenClawAgentDatabaseLease as s, AGENT_DATABASE_MAINTENANCE_LEASE as t, invalidateOpenClawAgentDatabaseIntegrityBeforeMutation as u, runWithAgentDatabaseMaintenanceAuthority as v };
