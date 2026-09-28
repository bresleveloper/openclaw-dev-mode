import { t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { a as assertOpenClawStateWriteAllowed } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { u as withOpenClawStateStartupMigrationCheckpointDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { c as readStateLeaseProcessOwnerStatus, i as reclaimDeadOpenClawStateLeaseInTransaction, s as parseStateLeaseProcessOwner } from "./openclaw-state-lease-store-CCKioOUP.mjs";
import { t as acquireWithWait } from "./acquire-with-wait-CTq_p6Fk.mjs";
import { createRequire } from "node:module";
import { hostname } from "node:os";
import { randomUUID } from "node:crypto";
//#region src/infra/startup-migration-checkpoint.ts
const STARTUP_MIGRATION_META_KEY = "startup-migrations";
const STATE_MIGRATION_META_KEY = "state-migrations";
const STARTUP_MIGRATION_BUILD_SEPARATOR = "\n";
const STARTUP_MIGRATION_CHECKPOINT_FORMAT = "3";
const STARTUP_MIGRATION_LEASE_SCOPE = "startup-migrations";
const STARTUP_MIGRATION_LEASE_KEY = "global";
const STARTUP_MIGRATION_LEASE_POLL_INTERVAL_MS = 250;
const STARTUP_MIGRATION_LEASE_TTL_MS = 3e5;
const STARTUP_MIGRATION_HEARTBEAT_INTERVAL_MS = 6e4;
var StartupMigrationLeaseConflictError = class extends Error {
	constructor(message, canWaitForSameHostOwner) {
		super(message);
		this.canWaitForSameHostOwner = canWaitForSameHostOwner;
	}
};
function resolveStartupMigrationBuildIdentity(moduleUrl = import.meta.url) {
	try {
		const require = createRequire(moduleUrl);
		for (const candidate of [
			"./build-info.json",
			"../build-info.json",
			"../../dist/build-info.json"
		]) try {
			const info = require(candidate);
			if (typeof info.builtAt !== "string" || !info.builtAt.trim()) continue;
			return info.builtAt.trim();
		} catch {}
	} catch {}
	return null;
}
function withStartupMigrationCheckpointDatabase(env, callback, atomic = false) {
	return withOpenClawStateStartupMigrationCheckpointDatabase(callback, {
		env,
		atomic
	});
}
function writeStartupMigrationCheckpointDatabase(env, callback) {
	const databasePath = resolveOpenClawStateSqlitePath(env);
	return withStartupMigrationCheckpointDatabase(env, (db) => runSqliteImmediateTransactionSync(db, () => {
		assertOpenClawStateWriteAllowed({
			database: db,
			databasePath,
			env
		});
		return callback(db);
	}));
}
function assertStartupMigrationLeaseOwnedInTransaction(params) {
	const stateDb = getNodeSqliteKysely(params.database);
	if (!executeSqliteQueryTakeFirstSync(params.database, stateDb.selectFrom("state_leases").select("owner").where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE).where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY).where("owner", "=", params.owner).where("expires_at", ">", params.nowMs ?? Date.now()))) throw new Error("OpenClaw startup migration lease was lost before startup migrations completed; retry so migrations can run under a fresh lease.");
}
function formatStartupMigrationCheckpoint(params) {
	const identity = params.identity;
	if (params.buildIdentity === null || !identity || !identity.effectiveConfigFingerprint.trim() || !identity.pluginDoctorConfigFingerprint.trim() || !identity.pluginMigrationFingerprint.trim()) return null;
	return [
		params.version,
		STARTUP_MIGRATION_CHECKPOINT_FORMAT,
		params.buildIdentity,
		identity.effectiveConfigFingerprint,
		identity.pluginDoctorConfigFingerprint,
		identity.pluginMigrationFingerprint
	].join(STARTUP_MIGRATION_BUILD_SEPARATOR);
}
function readMigrationCheckpointsFromDatabase(db, metaKeys) {
	const stateDb = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, stateDb.selectFrom("schema_meta").select(["meta_key as metaKey", "app_version as appVersion"]).where("meta_key", "in", metaKeys)).rows;
}
function readMigrationCheckpoints(env, metaKeys) {
	return withStartupMigrationCheckpointDatabase(env, (db) => readMigrationCheckpointsFromDatabase(db, metaKeys));
}
function readStartupMigrationVersion(env = process.env) {
	return readMigrationCheckpoints(env, [STARTUP_MIGRATION_META_KEY])[0]?.appVersion?.split(STARTUP_MIGRATION_BUILD_SEPARATOR, 1)[0] ?? null;
}
/** Returns whether the canonical automatic-migration lease is still live. */
function hasActiveStartupMigrationLease(params = {}) {
	const env = params.env ?? process.env;
	const nowMs = params.nowMs ?? Date.now();
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const lease = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("state_leases").select([
			"payload_json as payloadJson",
			"owner",
			"heartbeat_at as heartbeatAt"
		]).where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE).where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY).where("expires_at", ">", nowMs));
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
function resolveMigrationCheckpoint(params) {
	return formatStartupMigrationCheckpoint({
		buildIdentity: params.buildIdentity === void 0 ? resolveStartupMigrationBuildIdentity() : params.buildIdentity,
		identity: params.identity,
		version: params.version ?? VERSION
	});
}
function readMigrationCheckpointStatusFromDatabase(db, checkpoint) {
	if (checkpoint === null) return "stale";
	const current = readMigrationCheckpointsFromDatabase(db, [STATE_MIGRATION_META_KEY, STARTUP_MIGRATION_META_KEY]).filter((row) => row.appVersion === checkpoint);
	if (current.some((row) => row.metaKey === STARTUP_MIGRATION_META_KEY)) return "startup-current";
	return current.length > 0 ? "state-current" : "stale";
}
function readMigrationCheckpointStatus(params = {}) {
	const checkpoint = resolveMigrationCheckpoint(params);
	if (checkpoint === null) return "stale";
	return withStartupMigrationCheckpointDatabase(params.env ?? process.env, (db) => readMigrationCheckpointStatusFromDatabase(db, checkpoint));
}
function acquireStartupMigrationLease(params = {}) {
	const env = params.env ?? process.env;
	const nowMs = params.nowMs ?? Date.now();
	const owner = params.owner ?? randomUUID();
	return withStartupMigrationCheckpointDatabase(env, (db) => acquireStartupMigrationLeaseFromDatabase(db, {
		...params,
		env,
		nowMs,
		owner
	}));
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
	runSqliteImmediateTransactionSync(connection, () => {
		const db = connection;
		assertOpenClawStateWriteAllowed({
			database: db,
			databasePath: resolveOpenClawStateSqlitePath(env),
			env
		});
		const stateDb = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, stateDb.deleteFrom("state_leases").where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE).where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY).where("expires_at", "<=", nowMs));
		const existing = reclaimDeadOpenClawStateLeaseInTransaction(db, {
			scope: STARTUP_MIGRATION_LEASE_SCOPE,
			key: STARTUP_MIGRATION_LEASE_KEY
		});
		const existingOwner = parseStateLeaseProcessOwner(existing?.payloadJson ?? null);
		if (existing) {
			const ownerHint = existingOwner ? ` (held by pid ${existingOwner.pid})` : "";
			throw new StartupMigrationLeaseConflictError(`OpenClaw startup migrations are already running for this state directory; retry after the other OpenClaw process finishes or after ${new Date(existing.expiresAt ?? expiresAt).toISOString()}.${ownerHint}`, existingOwner?.host === hostname());
		}
		executeSqliteQuerySync(db, stateDb.insertInto("state_leases").values({
			scope: STARTUP_MIGRATION_LEASE_SCOPE,
			lease_key: STARTUP_MIGRATION_LEASE_KEY,
			owner,
			expires_at: expiresAt,
			heartbeat_at: nowMs,
			payload_json: JSON.stringify({
				version: VERSION,
				owner: leaseOwner
			}),
			created_at: nowMs,
			updated_at: nowMs
		}));
	});
	return {
		owner,
		assertOwnedInTransaction: (database, assertionParams = {}) => {
			assertStartupMigrationLeaseOwnedInTransaction({
				database,
				owner,
				nowMs: assertionParams.nowMs
			});
		},
		heartbeat: (heartbeatParams = {}) => {
			const heartbeatNowMs = heartbeatParams.nowMs ?? Date.now();
			const heartbeatExpiresAt = heartbeatNowMs + STARTUP_MIGRATION_LEASE_TTL_MS;
			writeStartupMigrationCheckpointDatabase(env, (db) => {
				const stateDb = getNodeSqliteKysely(db);
				if (executeSqliteQuerySync(db, stateDb.updateTable("state_leases").set({
					expires_at: heartbeatExpiresAt,
					heartbeat_at: heartbeatNowMs,
					updated_at: heartbeatNowMs
				}).where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE).where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY).where("owner", "=", owner).where("expires_at", ">", heartbeatNowMs)).numAffectedRows !== 1n) throw new Error("OpenClaw startup migration lease was lost before startup migrations completed; retry so migrations can run under a fresh lease.");
			});
		},
		release: () => {
			writeStartupMigrationCheckpointDatabase(env, (db) => {
				const stateDb = getNodeSqliteKysely(db);
				executeSqliteQuerySync(db, stateDb.deleteFrom("state_leases").where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE).where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY).where("owner", "=", owner));
			});
		}
	};
}
function waitForStartupMigrationLease(params, acquire, options = {}) {
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
		acquire: () => acquire({
			env: params.env,
			nowMs: now(),
			owner,
			ownerPid: params.ownerPid
		}),
		shouldRetry: (error) => error instanceof StartupMigrationLeaseConflictError && error.canWaitForSameHostOwner || options.retryDatabaseContention === true && sqlitePrimaryResultCode(error) === 5
	});
}
function acquireStartupMigrationLeaseWithWait(params = {}) {
	return waitForStartupMigrationLease(params, acquireStartupMigrationLease);
}
/** Inspect and, when needed, claim through one integrity-proven physical connection. */
function inspectStartupMigrationCheckpointWithLease(params) {
	if (!params.stateMigrations && !params.startupMigrations && !params.forceLease) return Promise.resolve({ status: "stale" });
	const checkpoint = resolveMigrationCheckpoint(params);
	const env = params.env ?? process.env;
	const now = params.now ?? Date.now;
	let leaseRequired = false;
	return waitForStartupMigrationLease(params, (attempt) => withStartupMigrationCheckpointDatabase(env, (db) => {
		const status = readMigrationCheckpointStatusFromDatabase(db, checkpoint);
		leaseRequired ||= params.forceLease || params.stateMigrations && status === "stale" || params.startupMigrations && status !== "startup-current";
		return {
			status,
			lease: leaseRequired ? acquireStartupMigrationLeaseFromDatabase(db, {
				...attempt,
				nowMs: now()
			}) : void 0
		};
	}, true), { retryDatabaseContention: true });
}
function recordSuccessfulMigrationCheckpoints(metaKeys, params = {}) {
	const env = params.env ?? process.env;
	const version = params.version ?? VERSION;
	const buildIdentity = params.buildIdentity === void 0 ? resolveStartupMigrationBuildIdentity() : params.buildIdentity;
	const nowMs = params.nowMs ?? Date.now();
	const checkpoint = formatStartupMigrationCheckpoint({
		buildIdentity,
		identity: params.identity,
		version
	});
	if (checkpoint === null) return;
	writeStartupMigrationCheckpointDatabase(env, (db) => {
		params.lease?.assertOwnedInTransaction(db, { nowMs });
		const stateDb = getNodeSqliteKysely(db);
		for (const metaKey of metaKeys) executeSqliteQuerySync(db, stateDb.insertInto("schema_meta").values({
			meta_key: metaKey,
			role: "global",
			schema_version: 3,
			agent_id: null,
			app_version: checkpoint,
			created_at: nowMs,
			updated_at: nowMs
		}).onConflict((conflict) => conflict.column("meta_key").doUpdateSet({
			role: "global",
			schema_version: 3,
			agent_id: null,
			app_version: checkpoint,
			updated_at: nowMs
		})));
	});
}
function recordSuccessfulStateMigrations(params = {}) {
	recordSuccessfulMigrationCheckpoints([STATE_MIGRATION_META_KEY], params);
}
/** Unfinished owner work cannot retain an earlier successful aggregate checkpoint. */
function invalidateSuccessfulMigrationCheckpointsInTransaction(database) {
	executeSqliteQuerySync(database, getNodeSqliteKysely(database).deleteFrom("schema_meta").where("meta_key", "in", [STATE_MIGRATION_META_KEY, STARTUP_MIGRATION_META_KEY]));
}
function recordSuccessfulStartupMigrations(params = {}) {
	recordSuccessfulMigrationCheckpoints([STATE_MIGRATION_META_KEY, STARTUP_MIGRATION_META_KEY], params);
}
//#endregion
export { hasActiveStartupMigrationLease as a, readMigrationCheckpointStatus as c, recordSuccessfulStateMigrations as d, acquireStartupMigrationLeaseWithWait as i, readStartupMigrationVersion as l, STARTUP_MIGRATION_LEASE_TTL_MS as n, inspectStartupMigrationCheckpointWithLease as o, acquireStartupMigrationLease as r, invalidateSuccessfulMigrationCheckpointsInTransaction as s, STARTUP_MIGRATION_HEARTBEAT_INTERVAL_MS as t, recordSuccessfulStartupMigrations as u };
