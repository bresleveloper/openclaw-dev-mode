import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
//#region src/infra/sqlite-lifecycle-errors.ts
var OpenClawStateOwnershipError = class extends Error {};
var OpenClawStateOwnershipMetadataError = class extends OpenClawStateOwnershipError {
	constructor(databasePath, message) {
		super(`OpenClaw shared state ownership metadata is invalid at ${databasePath}: ${message}. Repair it with OPENCLAW_SUPERVISOR_MODE=external openclaw database ownership claim --manager <manager-id>.`);
		this.databasePath = databasePath;
		this.name = "OpenClawStateOwnershipMetadataError";
	}
};
var OpenClawStateExternalOwnershipError = class extends OpenClawStateOwnershipError {
	constructor(databasePath, managerId) {
		super(`OpenClaw shared state database ${databasePath} is externally supervised by ${managerId}. Use that external supervisor with OPENCLAW_SUPERVISOR_MODE=external for writable operations.`);
		this.databasePath = databasePath;
		this.managerId = managerId;
		this.name = "OpenClawStateExternalOwnershipError";
	}
};
const SqliteCoordinatorError = resolveGlobalSingleton(Symbol.for("openclaw.sqliteCoordinatorError"), () => class CoordinatorError extends Error {
	constructor(message, cause) {
		super(message);
		this.cause = cause;
		this.name = "SqliteCoordinatorError";
	}
});
function createSqliteLifecycleAggregateError(errors, message, cause) {
	return new AggregateError(errors, message, { cause });
}
/** Keep the first failure as the cause while retaining independent cleanup errors. */
function throwSqliteLifecycleErrors(errors, message) {
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, message, errors[0]);
}
/** Settle a synchronous SQLite operation and preserve both operation and cleanup failures. */
function runWithSqliteCleanup(resource, operationLabel, operation) {
	let result;
	try {
		result = operation();
		if (isPromiseLike(result)) throw new SqliteCoordinatorError(`${operationLabel} must remain synchronous`);
	} catch (operationError) {
		try {
			resource.release();
		} catch (releaseError) {
			throw createSqliteLifecycleAggregateError([operationError, releaseError], `${operationLabel} and resource release both failed`, operationError);
		}
		throw operationError;
	}
	try {
		resource.release();
	} catch (releaseError) {
		throw new SqliteCoordinatorError(`${operationLabel} completed, but releasing its resource failed`, releaseError);
	}
	return result;
}
//#endregion
export { createSqliteLifecycleAggregateError as a, SqliteCoordinatorError as i, OpenClawStateOwnershipError as n, runWithSqliteCleanup as o, OpenClawStateOwnershipMetadataError as r, throwSqliteLifecycleErrors as s, OpenClawStateExternalOwnershipError as t };
