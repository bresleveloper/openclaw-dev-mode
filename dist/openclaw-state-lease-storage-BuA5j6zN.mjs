import { n as computeBackoff, s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { T as StateDatabaseCoordinatorContentionError } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { d as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { n as OpenClawStateLeaseError, o as toOpenClawStateLeaseVerificationError } from "./openclaw-state-lease-error-BXipLxiQ.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { c as runOpenClawStateWriteTransaction, l as runWithOpenClawStateBusyTimeout, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { a as releaseOpenClawStateLeaseInTransaction, o as renewOpenClawStateLeaseInTransaction, r as readOpenClawStateLeaseExpiry } from "./openclaw-state-lease-store-CCKioOUP.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-H5HXDD9v.mjs";
import "./backoff-CszdOMiF.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { t as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-UfK-2Yan.mjs";
import path from "node:path";
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
async function acquireLease(database, input, assertCurrent, signal) {
	if (database.options?.readOnly) throw new Error("State lease acquisition requires writable storage");
	if (database.schemaPolicy === "existing" && database.options?.database) throw new Error("Existing-state writes require their own tracked writable connection.");
	const opened = database.schemaPolicy === "existing" ? void 0 : openOpenClawStateDatabase(database.options);
	const context = captureOpenClawStateWorkerContext({
		...database.options,
		path: opened?.path ?? resolveLeaseDatabasePath(database)
	});
	const assertAdmission = () => {
		context.admission.assertCurrent();
		assertCurrent();
		if (opened?.db.isTransaction) throw new OpenClawStateLeaseError("State lease acquisition requires no active transaction", { code: "OPENCLAW_STATE_LEASE_INVALID_INPUT" });
	};
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "stateLease.acquire",
		input: {
			...input,
			schemaPolicy: database.schemaPolicy
		}
	}, { signal }), {
		existingOnly: database.schemaPolicy === "existing",
		assertCurrent: assertAdmission,
		createAdmission: createSqliteWorkerWriteAdmission(assertAdmission, [context.admission.databasePath])
	});
	if (!result) throw new Error("State lease acquisition requires an existing database");
	return result;
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
const RELEASE_RETRY_TIMEOUT_MS = 2e3;
function isOpenClawStateLeaseWriteContention(error) {
	return isSqliteLockError(error) || error instanceof StateDatabaseCoordinatorContentionError && error.family === "state-lifecycle";
}
function renewOpenClawStateLease(params) {
	return withLeaseWriteTransaction(params.database, params.operationLabel, (db) => {
		const expiresAt = renewOpenClawStateLeaseInTransaction(db, params, params.leaseMs);
		if (expiresAt === void 0) throw new OpenClawStateLeaseError(`${params.leaseLabel} ${params.scope}/${params.key} was lost`, { code: "OPENCLAW_STATE_LEASE_LOST" });
		return expiresAt;
	});
}
function assertOpenClawStateLeaseOwnedInDatabase(database, params) {
	const expiresAt = readOpenClawStateLeaseExpiry(database, params);
	if (expiresAt === void 0) throw new OpenClawStateLeaseError(`${params.leaseLabel} ${params.scope}/${params.key} was lost`, { code: "OPENCLAW_STATE_LEASE_LOST" });
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
	const deadline = performance.now() + RELEASE_RETRY_TIMEOUT_MS;
	let attempt = 0;
	while (true) try {
		if (execute) await execute();
		else releaseOpenClawStateLease(params);
		return;
	} catch (error) {
		const now = performance.now();
		if (!isOpenClawStateLeaseWriteContention(error) || now >= deadline) {
			if (execute) throw error;
			return;
		}
		attempt += 1;
		await sleepWithAbort(Math.min(deadline - now, computeBackoff(STATE_LEASE_WRITE_BACKOFF, attempt)));
	}
}
//#endregion
export { prepareLeaseDatabase as a, releaseOpenClawStateLeaseBestEffort as c, verifyOpenClawStateLeaseOwnership as d, withLeaseWriteTransaction as f, isOpenClawStateLeaseWriteContention as i, renewOpenClawStateLease as l, acquireLease as n, readLeaseDatabase as o, assertOpenClawStateLeaseOwnedInDatabase as r, releaseOpenClawStateLease as s, STATE_LEASE_WRITE_BACKOFF as t, resolveLeaseDatabasePath as u };
