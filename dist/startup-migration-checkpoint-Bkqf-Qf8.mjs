import { n as getFileLockProcessStartTime } from "./pid-alive-CPS_shDt.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { d as withExistingOpenClawStateDatabaseCurrentReadOnly, f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as assertOpenClawStateWriteAllowed } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { d as withOpenClawStateStartupMigrationCheckpointDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as releaseOpenClawStateLeaseInTransaction, c as readStateLeaseProcessOwnerStatus, i as reclaimDeadOpenClawStateLeaseInTransaction, o as renewOpenClawStateLeaseInTransaction, r as readOpenClawStateLeaseExpiry, s as parseStateLeaseProcessOwner, t as acquireOpenClawStateLeaseInTransaction } from "./openclaw-state-lease-store-gySh31JU.mjs";
import { hostname } from "node:os";
import { randomUUID } from "node:crypto";
import { setTimeout } from "node:timers/promises";
//#region src/infra/acquire-with-wait.ts
/** Retry only acquisition, keeping the deadline independent of wall-clock changes. */
async function acquireWithWait(params) {
	const now = params.now ?? performance.now.bind(performance);
	let delayMs = params.pollIntervalMs;
	for (;;) try {
		return await params.acquire();
	} catch (error) {
		const retry = params.shouldRetry(error);
		if (!retry) throw error;
		const remainingMs = params.deadlineMs - now();
		if (remainingMs <= 0) throw error;
		await (params.sleep ?? setTimeout)(Math.min(retry === true ? delayMs : retry.delayMs, remainingMs));
		delayMs = Math.min(delayMs * 2, params.maxPollIntervalMs ?? params.pollIntervalMs);
	}
}
//#endregion
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
	if (expiresAt === void 0) throw new Error("OpenClaw startup migration lease was lost before startup migrations completed; retry so migrations can run under a fresh lease.");
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
	return withOpenClawStateStartupMigrationCheckpointDatabase((db) => acquireStartupMigrationLeaseFromDatabase(db, {
		...params,
		env,
		nowMs: now(),
		owner
	}), {
		env,
		atomic: true
	});
}
function acquireStartupMigrationLeaseFromDatabase(connection, params) {
	const env = params.env ?? process.env;
	const nowMs = params.nowMs ?? Date.now();
	const owner = params.owner ?? randomUUID();
	const ownerPid = params.ownerPid ?? process.pid;
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
export { invalidateSuccessfulMigrationCheckpointsInTransaction as a, hasActiveStartupMigrationLease as i, STARTUP_MIGRATION_LEASE_TTL_MS as n, acquireWithWait as o, acquireStartupMigrationLeaseWithWait as r, STARTUP_MIGRATION_HEARTBEAT_INTERVAL_MS as t };
