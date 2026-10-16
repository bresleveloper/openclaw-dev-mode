import { n as computeBackoff } from "./src-D1BHGNTj.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { a as createOpenClawStateLeaseLostError, s as toOpenClawStateLeaseVerificationError } from "./openclaw-state-lease-error-Ds9BTWol.mjs";
import "./backoff-BrzXG7iD.mjs";
import { p as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { f as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase, u as runWithOpenClawStateBusyTimeout } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as releaseOpenClawStateLeaseInTransaction, o as renewOpenClawStateLeaseInTransaction, r as readOpenClawStateLeaseExpiry } from "./openclaw-state-lease-store-gySh31JU.mjs";
import { t as LEASE_CONTENTION_RETRY_TIMEOUT_MS } from "./openclaw-state-lease-heartbeat-shared-BczGehzh.mjs";
import { n as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-ClzrehCM.mjs";
import path from "node:path";
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
	return database.schemaPolicy === "existing" ? path.resolve(database.options?.path ?? resolveOpenClawStateSqlitePath(database.options?.env)) : openOpenClawStateDatabase(database.options).path;
}
function readLeaseDatabase(database, operation) {
	return database.schemaPolicy === "existing" ? withOpenClawStateDatabaseReadOnly(({ db }) => operation(db), database.options) : operation(openOpenClawStateDatabase(database.options).db);
}
function withLeaseWriteTransaction(database, operationLabel, operation, busyTimeoutMs = 0) {
	if (database.schemaPolicy === "existing") return runExistingOpenClawStateWriteTransaction(({ db }) => operation(db), database.options ?? {}, {
		operationLabel,
		busyTimeoutMs,
		schemaSql: leaseSchema
	});
	const stateDatabase = openOpenClawStateDatabase(database.options);
	const run = () => runOpenClawStateWriteTransaction(({ db }) => operation(db), {
		...database.options,
		database: stateDatabase
	}, {
		operationLabel,
		busyTimeoutMs
	});
	return runWithSqliteBusyTimeout(stateDatabase.db, busyTimeoutMs, run);
}
const STATE_LEASE_WRITE_BACKOFF = {
	initialMs: 25,
	maxMs: 250,
	factor: 1.5,
	jitter: .25
};
function renewOpenClawStateLease(params) {
	return withLeaseWriteTransaction(params.database, params.operationLabel, (db) => {
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
	withLeaseWriteTransaction(params.database, params.operationLabel, (db) => releaseOpenClawStateLeaseInTransaction(db, params));
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
