import { t as VERSION } from "./version-jg_14gWz.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as acquireWithWait } from "./acquire-with-wait-JZafJKyw.mjs";
import { l as withExistingOpenClawStateDatabaseCurrentReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as assertOpenClawStateWriteAllowed } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import { f as withOpenClawStateStartupMigrationCheckpointDatabase } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as readStateLeaseProcessOwnerStatus, t as parseStateLeaseProcessOwner } from "./state-lease-process-owner-CPrBcVUW.mjs";
import { a as releaseOpenClawStateLeaseInTransaction, i as reclaimDeadOpenClawStateLeaseInTransaction, o as renewOpenClawStateLeaseInTransaction, r as readOpenClawStateLeaseExpiry, t as acquireOpenClawStateLeaseInTransaction } from "./openclaw-state-lease-store-C1yV0igx.mjs";
import { randomUUID } from "node:crypto";
import { hostname } from "node:os";
//#region src/infra/startup-migration-checkpoint.ts
const STARTUP_MIGRATION_META_KEY = "startup-migrations";
const STATE_MIGRATION_META_KEY = "state-migrations";
const STARTUP_MIGRATION_LEASE = {
	scope: "startup-migrations",
	key: "global"
};
const STARTUP_MIGRATION_LEASE_POLL_INTERVAL_MS = 250;
const STARTUP_MIGRATION_LEASE_TTL_MS = 3e5;
const STARTUP_MIGRATION_HEARTBEAT_INTERVAL_MS = 6e4;
var StartupMigrationLeaseConflictError = class extends Error {};
var StartupMigrationLeaseLostError = class extends Error {};
function writeStartupMigrationCheckpointDatabase(env, callback) {
	const databasePath = resolveOpenClawStateSqlitePath(env);
	return withOpenClawStateStartupMigrationCheckpointDatabase((db) => runSqliteImmediateTransactionSync(db, () => {
		assertOpenClawStateWriteAllowed({
			database: db,
			databasePath,
			env
		});
		return callback(db);
	}, {
		databaseLabel: databasePath,
		operationLabel: "state.startup-checkpoint.write"
	}), {
		env,
		atomic: false
	});
}
function assertStartupMigrationLeaseOwned(expiresAt) {
	if (expiresAt === void 0) throw new StartupMigrationLeaseLostError("OpenClaw startup migration lease was lost before startup migrations completed; retry so migrations can run under a fresh lease.");
}
/** Returns whether the shared startup/Doctor lease has a live process owner. */
function hasActiveStartupMigrationLease(params = {}) {
	const env = params.env ?? process.env;
	const nowMs = params.nowMs ?? Date.now();
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const lease = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("state_leases").select([
			"payload_json as payloadJson",
			"owner",
			"heartbeat_at as heartbeatAt"
		]).where("scope", "=", STARTUP_MIGRATION_LEASE.scope).where("lease_key", "=", STARTUP_MIGRATION_LEASE.key).where("expires_at", ">", nowMs));
		if (!lease) return false;
		const owner = parseStateLeaseProcessOwner(lease.payloadJson);
		if (readStateLeaseProcessOwnerStatus(owner) === "dead") return false;
		params.onActivity?.({
			owner: lease.owner,
			pid: owner?.host === hostname() ? owner.pid : void 0,
			heartbeatAt: lease.heartbeatAt
		});
		return true;
	}, { env }) ?? false;
}
function acquireStartupMigrationLease(params, now) {
	const env = params.env ?? process.env;
	const owner = params.owner ?? randomUUID();
	return withOpenClawStateStartupMigrationCheckpointDatabase((connection) => {
		const admitted = {
			...params,
			env,
			nowMs: now(),
			owner
		};
		const nowMs = admitted.nowMs ?? Date.now();
		const ownerPid = admitted.ownerPid ?? process.pid;
		const leaseOwner = {
			pid: ownerPid,
			host: hostname(),
			startedAt: getFileLockProcessStartTime(ownerPid)
		};
		const expiresAt = nowMs + STARTUP_MIGRATION_LEASE_TTL_MS;
		const identity = {
			...STARTUP_MIGRATION_LEASE,
			owner
		};
		runSqliteImmediateTransactionSync(connection, () => {
			const db = connection;
			assertOpenClawStateWriteAllowed({
				database: db,
				databasePath: resolveOpenClawStateSqlitePath(env),
				env
			});
			const acquire = () => acquireOpenClawStateLeaseInTransaction(db, identity, STARTUP_MIGRATION_LEASE_TTL_MS, JSON.stringify({
				version: VERSION,
				owner: leaseOwner
			}), nowMs);
			if (acquire().kind === "held") {
				const existing = reclaimDeadOpenClawStateLeaseInTransaction(db, identity);
				if (existing) {
					const existingOwner = parseStateLeaseProcessOwner(existing.payloadJson);
					const ownerHint = existingOwner ? ` (held by pid ${existingOwner.pid})` : "";
					throw new StartupMigrationLeaseConflictError(`OpenClaw startup migrations are already running for this state directory; retry after the other OpenClaw process finishes or after ${new Date(existing.expiresAt ?? expiresAt).toISOString()}.${ownerHint}`);
				}
				acquire();
			}
		}, {
			databaseLabel: resolveOpenClawStateSqlitePath(env),
			operationLabel: "state.startup-migration.lease.acquire"
		});
		return {
			owner,
			assertOwned: () => assertStartupMigrationLeaseOwned(withExistingOpenClawStateDatabaseCurrentReadOnly(({ db }) => readOpenClawStateLeaseExpiry(db, identity), { env })),
			assertOwnedInTransaction: (database, assertionParams = {}) => {
				assertStartupMigrationLeaseOwned(readOpenClawStateLeaseExpiry(database, identity, assertionParams.nowMs));
			},
			heartbeat: (heartbeatParams = {}) => {
				const heartbeatNowMs = heartbeatParams.nowMs ?? Date.now();
				writeStartupMigrationCheckpointDatabase(env, (db) => {
					assertStartupMigrationLeaseOwned(renewOpenClawStateLeaseInTransaction(db, identity, STARTUP_MIGRATION_LEASE_TTL_MS, void 0, heartbeatNowMs));
				});
			},
			release: () => {
				writeStartupMigrationCheckpointDatabase(env, (db) => releaseOpenClawStateLeaseInTransaction(db, identity));
			}
		};
	}, {
		env,
		atomic: true
	});
}
function acquireStartupMigrationLeaseWithWait(params = {}) {
	const now = params.now ?? Date.now;
	const monotonicNow = params.monotonicNow ?? performance.now.bind(performance);
	const timeoutMs = Math.max(0, Math.min(params.timeoutMs ?? 3e5, STARTUP_MIGRATION_LEASE_TTL_MS));
	const pollIntervalMs = Math.max(1, params.pollIntervalMs ?? STARTUP_MIGRATION_LEASE_POLL_INTERVAL_MS);
	const owner = params.owner ?? randomUUID();
	return acquireWithWait({
		deadlineMs: monotonicNow() + timeoutMs,
		pollIntervalMs,
		now: monotonicNow,
		sleep: params.sleep,
		acquire: () => acquireStartupMigrationLease({
			env: params.env,
			owner,
			ownerPid: params.ownerPid
		}, now),
		shouldRetry: (error) => error instanceof StartupMigrationLeaseConflictError || sqlitePrimaryResultCode(error) === 5
	});
}
/** Unfinished owner work cannot retain an earlier successful aggregate checkpoint. */
function invalidateSuccessfulMigrationCheckpointsInTransaction(database) {
	executeSqliteQuerySync(database, getNodeSqliteKysely(database).deleteFrom("schema_meta").where("meta_key", "in", [STATE_MIGRATION_META_KEY, STARTUP_MIGRATION_META_KEY]));
}
//#endregion
export { hasActiveStartupMigrationLease as a, acquireStartupMigrationLeaseWithWait as i, STARTUP_MIGRATION_LEASE_TTL_MS as n, invalidateSuccessfulMigrationCheckpointsInTransaction as o, StartupMigrationLeaseLostError as r, STARTUP_MIGRATION_HEARTBEAT_INTERVAL_MS as t };
