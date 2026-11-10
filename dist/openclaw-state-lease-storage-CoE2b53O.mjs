import { n as computeBackoff } from "./src-Bzfi3cQM.mjs";
import { r as resolveDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { K as OPENCLAW_STATE_SCHEMA_SQL, nt as extractSqliteTableSchema } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { a as createOpenClawStateLeaseLostError, o as toOpenClawStateLeaseVerificationError } from "./openclaw-state-lease-error-BPKnfJ8N.mjs";
import { d as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { d as runWithOpenClawStateBusyTimeout, i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-C_pcNU2t.mjs";
import "./backoff-N5Hi0doU.mjs";
import { a as releaseOpenClawStateLeaseInTransaction, o as renewOpenClawStateLeaseInTransaction, r as readOpenClawStateLeaseExpiry } from "./openclaw-state-lease-store-C1yV0igx.mjs";
import { t as LEASE_CONTENTION_RETRY_TIMEOUT_MS } from "./openclaw-state-lease-heartbeat-shared-BczGehzh.mjs";
import { setTimeout } from "node:timers/promises";
//#region src/state/openclaw-state-lease-storage.ts
const leaseSchema = ["schema_meta", "state_leases"].map((table) => extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, table, {
	endMarker: ") STRICT;",
	errorMessage: "Existing lease schema is unavailable."
})).join("\n");
function prepareLeaseDatabase(database) {
	if (database.schemaPolicy !== "existing") runWithOpenClawStateBusyTimeout(() => void 0, database.options ?? {}, 0);
}
function resolveLeaseDatabasePath(database) {
	return database.schemaPolicy === "existing" ? resolveDatabasePath(database.options) : openOpenClawStateDatabase(database.options).path;
}
function readLeaseDatabase(database, operation) {
	return database.schemaPolicy === "existing" ? withOpenClawStateDatabaseReadOnly(({ db }) => operation(db), database.options) : operation(openOpenClawStateDatabase(database.options).db);
}
function withLeaseWriteTransaction(database, operationLabel, operation, busyTimeoutMs = 0) {
	const transactionOptions = {
		operationLabel,
		busyTimeoutMs,
		beginLockFailureReporting: busyTimeoutMs === 0 ? "suppress" : void 0
	};
	if (database.schemaPolicy === "existing") return runExistingOpenClawStateWriteTransaction(({ db }) => operation(db), database.options ?? {}, {
		...transactionOptions,
		schemaSql: leaseSchema
	});
	const stateDatabase = database.options?.database ?? openOpenClawStateDatabase(database.options);
	return runOpenClawStateWriteTransaction(({ db }) => operation(db), {
		...database.options,
		database: stateDatabase
	}, transactionOptions);
}
const STATE_LEASE_WRITE_BACKOFF = {
	initialMs: 25,
	maxMs: 250,
	factor: 1.5,
	jitter: .25
};
function renewOpenClawStateLease(params) {
	return withLeaseWriteTransaction(params.database, params.operationLabel === "state.lease" ? "state.lease.renew" : params.operationLabel, (db) => {
		const expiresAt = renewOpenClawStateLeaseInTransaction(db, params, params.leaseMs);
		if (expiresAt === void 0) throw createOpenClawStateLeaseLostError(params);
		return expiresAt;
	});
}
function assertOpenClawStateLeaseOwnedInDatabase(database, params) {
	const expiresAt = readOpenClawStateLeaseExpiry(database, params);
	if (expiresAt === void 0) throw createOpenClawStateLeaseLostError(params);
	return expiresAt;
}
function verifyOpenClawStateLeaseOwnership(params) {
	try {
		if (params.transaction) return assertOpenClawStateLeaseOwnedInDatabase(params.transaction, params);
		if (!params.database) throw new Error("state lease ownership check requires a database");
		return readLeaseDatabase(params.database, (db) => assertOpenClawStateLeaseOwnedInDatabase(db, params));
	} catch (error) {
		throw toOpenClawStateLeaseVerificationError(params, error);
	}
}
function releaseOpenClawStateLease(params) {
	withLeaseWriteTransaction(params.database, params.operationLabel === "state.lease" ? "state.lease.release" : params.operationLabel, (db) => releaseOpenClawStateLeaseInTransaction(db, params));
}
async function releaseOpenClawStateLeaseBestEffort(params, execute) {
	const deadline = performance.now() + LEASE_CONTENTION_RETRY_TIMEOUT_MS;
	let attempt = 0;
	while (true) try {
		if (execute) await execute();
		else releaseOpenClawStateLease(params);
		return;
	} catch (error) {
		const now = performance.now();
		if (!isSqliteLockError(error) || now >= deadline) {
			if (execute) throw error;
			return;
		}
		attempt += 1;
		await setTimeout(Math.min(deadline - now, computeBackoff(STATE_LEASE_WRITE_BACKOFF, attempt)));
	}
}
//#endregion
export { renewOpenClawStateLease as a, withLeaseWriteTransaction as c, releaseOpenClawStateLeaseBestEffort as i, prepareLeaseDatabase as n, resolveLeaseDatabasePath as o, releaseOpenClawStateLease as r, verifyOpenClawStateLeaseOwnership as s, STATE_LEASE_WRITE_BACKOFF as t };
