import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { a as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { K as OPENCLAW_STATE_SCHEMA_SQL, nt as extractSqliteTableSchema, z as revokeSqliteDatabaseAdmissionsForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { n as ensureOpenClawQuarantineStore } from "./openclaw-quarantine-store-DTWp4-ja.mjs";
import { m as openClawStateDatabaseCache, x as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as requireNativeDatabaseFile } from "./physical-facts-Cvtfrs3r.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { i as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { l as SqliteWorkerOpenRefusedError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as withOpenClawStateReadOnlyLocation } from "./openclaw-state-db-read-connection-D53a_-IZ.mjs";
import "./session-key-CSDERtm3.mjs";
import { r as ensureAgentDatabaseLeaseSchema } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { f as prepareAgentDeletionPathFence, n as assertAgentDeletionPathFence, t as AgentDatabaseDeletionRefusedError } from "./agent-deletion-journal-DpYVtbBb.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-C_pcNU2t.mjs";
import { m as invalidateOpenClawAgentDatabaseValidation } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import fs from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { hostname } from "node:os";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
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
		schemaCompatibility: { allowedMissingColumns: ["agent_database_leases.provenance"] }
	});
}
//#endregion
//#region src/state/openclaw-agent-db-lease-provenance.ts
let boot;
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
function agentDatabaseLeaseStaleReason(row) {
	if (isPidDefinitelyDead(row.owner_pid)) return "owner-pid-dead";
	const currentStartTime = getFileLockProcessStartTime(row.owner_pid);
	return row.owner_start_time !== null && currentStartTime !== null && row.owner_start_time !== currentStartTime ? "owner-start-time-changed" : void 0;
}
function readAgentDatabaseLeaseProvenance(pathname) {
	try {
		if (boot === void 0) {
			const bootId = process.platform === "linux" ? fs.readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim() : "";
			boot = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(bootId) ? [
				hostname(),
				bootId,
				fs.readlinkSync("/proc/self/ns/pid"),
				VERSION
			].join("\0") : null;
		}
		if (!boot) return null;
		const file = fs.statSync(pathname, { bigint: true });
		return file.isFile() ? `process-v1:${createHash("sha256").update(`${boot}\0${file.dev}:${file.ino}`).digest("hex")}` : null;
	} catch {
		return null;
	}
}
function isSameBootAgentDatabaseLease(provenance, pathname) {
	return provenance !== null && provenance === readAgentDatabaseLeaseProvenance(pathname);
}
function agentDatabaseLeaseProcessDeathRefusal(row, pathname, staleReason) {
	if (staleReason !== "owner-pid-dead") return "owner-start-time-changed";
	if (row.opened_at <= 0) return "predecessor-admission-incomplete";
	if (row.owner_start_time === null) return "owner-start-time-missing";
	if (row.path !== pathname) return "lease-path-mismatch";
	if (row.provenance === null) return "legacy-provenance-missing";
	return isSameBootAgentDatabaseLease(row.provenance, pathname) ? void 0 : "host-boot-namespace-version-file-mismatch";
}
function agentDatabaseAdmissionProvenanceRefusal(provenance, pathname) {
	return provenance === void 0 ? "native-admission-required" : isSameBootAgentDatabaseLease(provenance, pathname) ? void 0 : "prepared-provenance-mismatch";
}
//#endregion
//#region src/state/openclaw-agent-db-lease.ts
const log = createSubsystemLogger("state/agent-db");
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
/** Raw maintenance writers revoke admitted facts before changing stored bytes. */
function invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(pathname) {
	maintenanceAuthority.getStore()?.authority.assertOwned();
	invalidateOpenClawAgentDatabaseValidation(pathname);
	revokeSqliteDatabaseAdmissionsForPath(pathname);
}
/** Verify the maintenance owner and its independent heartbeat before a synchronous phase. */
function renewAgentDatabaseMaintenanceAuthorityIfPresent() {
	const authority = maintenanceAuthority.getStore()?.authority;
	if (!authority) return;
	if (!authority.renew) throw new Error("Agent database maintenance authority cannot renew its lease.");
	authority.renew();
}
function claimOpenClawAgentDatabaseLease(params, leaseId = randomUUID(), onVerification) {
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
		ownerStartTime,
		provenance: readAgentDatabaseLeaseProvenance(params.path)
	}, deletionFence, onVerification), {
		env: params.env,
		initializationAgentPaths: [params.path]
	});
	return leaseId;
}
function claimAgentDatabaseLeaseInDatabase(database, owner, deletionFence, onVerification) {
	ensureAgentDatabaseLeaseSchema(database.db);
	const db = getNodeSqliteKysely(database.db);
	const maintenance = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("state_leases").select("owner").where("scope", "=", AGENT_DATABASE_MAINTENANCE_LEASE.scope).where("lease_key", "=", AGENT_DATABASE_MAINTENANCE_LEASE.key).where("expires_at", ">", Date.now()));
	const authority = maintenanceAuthority.getStore();
	if (maintenance || authority) throw new Error("Agent database maintenance is in progress; retry after openclaw doctor --fix completes.");
	assertAgentDeletionPathFence(database, deletionFence);
	let invalidated = false;
	let hasOtherOwner = false;
	let processDeathRefusal;
	for (const held of readAgentDatabaseLeases(database.db)) {
		const sharesFile = mayShareAgentDatabaseFile(held.path, owner.path);
		const staleReason = sharesFile ? agentDatabaseLeaseStaleReason(held) : void 0;
		if (staleReason) {
			const because = agentDatabaseLeaseProcessDeathRefusal(held, owner.path, staleReason);
			processDeathRefusal ??= because;
			log.info(`agent database stale lease: ${staleReason}; previous release not observed`, {
				agentId: held.agent_id,
				leaseId: held.lease_id,
				path: held.path,
				staleReason,
				ownerPid: held.owner_pid,
				ownerStartTime: held.owner_start_time,
				because: because ?? "same-boot-dead-owner"
			});
			clearAgentDatabaseLeaseVerifications(database.db, held.path);
			invalidated = true;
			executeSqliteQuerySync(database.db, db.deleteFrom("agent_database_leases").where("lease_id", "=", held.lease_id));
		} else if (sharesFile && held.lease_id !== owner.leaseId && (owner.ownerStartTime === null || held.owner_pid !== owner.ownerPid || held.owner_start_time === null || held.owner_start_time !== owner.ownerStartTime)) hasOtherOwner = true;
	}
	onVerification?.(!hasOtherOwner, invalidated, processDeathRefusal ?? (hasOtherOwner ? "live-or-unknown-owner" : void 0));
	executeSqliteQuerySync(database.db, db.insertInto("agent_database_leases").values({
		lease_id: owner.leaseId,
		provenance: owner.provenance,
		agent_id: owner.agentId,
		path: owner.path,
		owner_pid: owner.ownerPid,
		owner_start_time: owner.ownerStartTime,
		opened_at: 0
	}));
}
function releaseOpenClawAgentDatabaseLease(leaseId, options = {}, closeOutcome) {
	const release = (database) => {
		const db = getNodeSqliteKysely(database);
		const held = executeSqliteQueryTakeFirstSync(database, db.selectFrom("agent_database_leases").select("path").where("lease_id", "=", leaseId));
		if (held && !closeOutcome) clearAgentDatabaseLeaseVerifications(database, held.path);
		executeSqliteQuerySync(database, db.deleteFrom("agent_database_leases").where("lease_id", "=", leaseId));
		let receipt;
		if (!held) receipt = "lease-not-held";
		else if (typeof closeOutcome !== "object") receipt = closeOutcome === "uncheckpointed" ? "checkpoint-incomplete" : closeOutcome ?? "close-unconfirmed";
		else if (held.path !== closeOutcome.path) receipt = "path-mismatch";
		else if (hasAgentDatabasePathLease(database, closeOutcome.path)) receipt = "active-leases";
		else receipt = closeOutcome.publishSeal() ? "written" : "verification-missing";
		const publish = () => log.info(`agent database clean-close receipt: ${receipt}`, {
			path: held?.path,
			leaseId,
			receipt
		});
		if (!deferSqlitePostCommitPublication(database, publish)) publish();
	};
	const maintenance = maintenanceAuthority.getStore();
	const databasePath = path.resolve(options.database?.path ?? options.path ?? resolveOpenClawStateSqlitePath(options.env));
	if (maintenance?.databasePath === databasePath) return withExistingAgentLeaseWrite(maintenance.authority, options, release);
	runOpenClawStateWriteTransaction((database) => {
		ensureAgentDatabaseLeaseSchema(database.db);
		release(database.db);
	}, typeof closeOutcome === "object" ? {
		...options,
		initializationAgentPaths: [...options.initializationAgentPaths ?? [], closeOutcome.path]
	} : options);
}
function agentDatabaseLeasePaths(database) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("agent_database_leases").select("path").distinct()).rows.map((row) => row.path);
}
function hasAgentDatabasePathLease(database, pathname) {
	return agentDatabaseLeasePaths(database).some((held) => mayShareAgentDatabaseFile(held, pathname));
}
/** Record that the claimed native owner completed its admission. */
function recordOpenClawAgentDatabaseAdmission(leaseId, params) {
	runOpenClawStateWriteTransaction((database) => {
		ensureOpenClawQuarantineStore(params.env ?? process.env);
		if (executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).updateTable("agent_database_leases").set({ opened_at: Date.now() }).where("lease_id", "=", leaseId).where("agent_id", "=", params.agentId).where("path", "=", params.path).where("owner_pid", "=", process.pid)).numAffectedRows !== 1n) throw new Error(`Agent database open lost its runtime lease: ${params.path}`);
	}, { env: params.env });
}
function clearAgentDatabaseLeaseVerifications(database, pathname) {
	for (const held of /* @__PURE__ */ new Set([pathname, ...agentDatabaseLeasePaths(database)])) if (mayShareAgentDatabaseFile(held, pathname)) {
		invalidateOpenClawAgentDatabaseValidation(held);
		revokeSqliteDatabaseAdmissionsForPath(held);
	}
}
/** An awaited open may consume its scan only while its original runtime claim survives. */
function assertOpenClawAgentDatabaseLease(leaseId, params) {
	const ownerStartTime = getFileLockProcessStartTime(process.pid);
	const held = readAgentDatabaseLeases(openOpenClawStateDatabase({
		env: params.env,
		initializationAgentPaths: [params.path]
	}).db, leaseId)[0];
	if (!held || held.agent_id !== params.agentId || held.path !== params.path || held.owner_pid !== process.pid || held.owner_start_time !== null && ownerStartTime !== null && held.owner_start_time !== ownerStartTime) throw new Error(`Agent database open lost its runtime lease: ${params.path}`);
}
/** Preparation grants no access; claim repeats admission on the captured shared owner. */
function prepareOpenClawAgentDatabaseWorkerLease(params, sharedDatabase, leaseId) {
	const database = { ...sharedDatabase };
	const identity = requireOpenClawStateDatabaseIdentity(database);
	const assertCurrent = () => {
		if (!database.db.isOpen || requireOpenClawStateDatabaseIdentity(database) !== identity) throw new Error("Prepared agent database lease lost its original shared owner");
	};
	assertCurrent();
	const ownerPid = process.pid;
	const provenance = readAgentDatabaseLeaseProvenance(params.path);
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
		provenance,
		claim(onVerification) {
			assertCurrent();
			const deletionFence = prepareAgentDeletionPathFence({
				agentId: receipt.agentId,
				path: receipt.path
			}, options);
			try {
				runOpenClawStateWriteTransaction((current) => {
					assertCurrent();
					claimAgentDatabaseLeaseInDatabase(current, {
						...receipt,
						provenance
					}, deletionFence, onVerification);
				}, options);
			} catch (error) {
				if (error instanceof AgentDatabaseDeletionRefusedError) throw new SqliteWorkerOpenRefusedError(error);
				throw error;
			}
			return receipt.leaseId;
		}
	};
}
/** Capture the exact admitted claim so its parent can finish cleanup after native Worker exit. */
function readOpenClawAgentDatabaseWorkerLeaseReceiptFromClaim(leaseId, params) {
	assertOpenClawAgentDatabaseLease(leaseId, params);
	const database = openOpenClawStateDatabase({
		env: params.env,
		initializationAgentPaths: [params.path]
	});
	const row = readAgentDatabaseLeases(database.db, leaseId)[0];
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
function releaseExitedOpenClawAgentDatabaseLeaseInDatabase(database, receipt, outcome, onInvalidation) {
	const db = getNodeSqliteKysely(database);
	const row = readAgentDatabaseLeases(database, receipt.leaseId)[0];
	if (!row) return;
	if (row.agent_id !== receipt.agentId || row.path !== receipt.path || row.owner_pid !== receipt.ownerPid || row.owner_start_time !== receipt.ownerStartTime) throw new Error("SQLite reclamation Worker lease cleanup receipt no longer matches");
	if (outcome !== "refused-before-open") {
		onInvalidation?.();
		clearAgentDatabaseLeaseVerifications(database, receipt.path);
	}
	executeSqliteQuerySync(database, db.deleteFrom("agent_database_leases").where("lease_id", "=", receipt.leaseId));
}
function readAgentDatabaseLeases(database, leaseId) {
	const query = getNodeSqliteKysely(database).selectFrom("agent_database_leases").selectAll();
	return executeSqliteQuerySync(database, leaseId === void 0 ? query : query.where("lease_id", "=", leaseId)).rows;
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
	const readActiveLeases = (db) => {
		const read = () => {
			if (!tableExists(db, "agent_database_leases")) return [];
			return readAgentDatabaseLeases(db).filter((row) => !agentDatabaseLeaseStaleReason(row));
		};
		return isPostgresSqlConnection(db) ? read() : runWithSqliteBusyTimeout(db, 250, read);
	};
	if (!cached) return withOpenClawStateReadOnlyLocation(({ db }) => readActiveLeases(db), pathname, prepareSqliteReadOnlyLocationSync(pathname), openStateSchemaReadAdmission);
	const closeSchemaReadAdmission = openStateSchemaReadAdmission ? isPostgresSqlConnection(cached.db) ? requireNativeDatabaseFile("postgres", "repair") : openStateSchemaReadAdmission(cached.db) : void 0;
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
	const staleLeaseIds = rows.filter(agentDatabaseLeaseStaleReason).map((row) => row.lease_id);
	if (staleLeaseIds.length > 0) runOpenClawStateWriteTransaction((database) => {
		maintenance?.assertOwnedInTransaction(database.db);
		ensureAgentDatabaseLeaseSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		for (const row of rows.filter((candidate) => staleLeaseIds.includes(candidate.lease_id))) clearAgentDatabaseLeaseVerifications(database.db, row.path);
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
		for (const row of readAgentDatabaseLeases(db)) if (agentDatabaseLeaseStaleReason(row)) {
			clearAgentDatabaseLeaseVerifications(db, row.path);
			executeSqliteQuerySync(db, query.deleteFrom("agent_database_leases").where("lease_id", "=", row.lease_id));
		} else throw new OpenClawAgentDatabaseLeaseActiveError(`Agent ${row.agent_id} database is still open in another process; stop that process and retry.`);
	});
}
//#endregion
export { renewAgentDatabaseMaintenanceAuthorityIfPresent as _, assertNoOpenClawAgentDatabaseLeases as a, mayShareAgentDatabaseFile as b, claimOpenClawAgentDatabaseLease as c, prepareOpenClawAgentDatabaseWorkerLease as d, readActiveOpenClawAgentDatabaseLeasesReadOnly as f, releaseOpenClawAgentDatabaseLease as g, releaseExitedOpenClawAgentDatabaseLeaseInDatabase as h, assertAgentDatabaseMaintenanceAuthorityIfPresent as i, hasAgentDatabaseMaintenanceAuthority as l, recordOpenClawAgentDatabaseAdmission as m, OpenClawAgentDatabaseLeaseActiveError as n, assertNoOpenClawAgentDatabaseLeasesReadOnly as o, readOpenClawAgentDatabaseWorkerLeaseReceiptFromClaim as p, assertAgentDatabaseMaintenanceAuthority as r, assertOpenClawAgentDatabaseLease as s, AGENT_DATABASE_MAINTENANCE_LEASE as t, invalidateOpenClawAgentDatabaseIntegrityBeforeMutation as u, runWithAgentDatabaseMaintenanceAuthority as v, agentDatabaseAdmissionProvenanceRefusal as y };
