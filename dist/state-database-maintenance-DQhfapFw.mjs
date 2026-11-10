import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { o as runWithSqliteCleanup } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { t as GatewayStateOwnerContentionError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { c as getStateDatabaseSchemaLease, n as acquireStateDatabaseSchemaLease } from "./gateway-state-owner-X3EqhtYx.mjs";
import { c as requestSqliteWorkerSchemaMaintenance } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
//#region src/infra/state-database-maintenance.ts
const StateSchemaMutationConflictError = resolveGlobalSingleton(Symbol.for("openclaw.stateSchemaMutationConflictError"), () => class SchemaMutationConflictError extends Error {
	constructor(databasePath, cause) {
		super(`OpenClaw refused shared state schema mutation at ${databasePath} because another Gateway owns that state directory. Stop that Gateway or perform the update through its managed restart path, then retry.`, { cause });
		this.name = "StateSchemaMutationConflictError";
	}
});
/** Ordinary transactions use SQLite; schema changes retain the installation's process owner. */
function withStateDatabaseSchemaMaintenance({ databasePath, busyTimeoutMs }, operation) {
	if (requestSqliteWorkerSchemaMaintenance(databasePath)) return operation();
	const canonical = resolveIdentityPathViaExistingAncestorSync(databasePath);
	const inherited = getStateDatabaseSchemaLease(canonical);
	if (inherited) {
		inherited.assertCurrent();
		return operation();
	}
	let lease;
	try {
		lease = acquireStateDatabaseSchemaLease(canonical, { busyTimeoutMs });
	} catch (error) {
		if (error instanceof GatewayStateOwnerContentionError) throw new StateSchemaMutationConflictError(canonical, error);
		throw error;
	}
	return runWithSqliteCleanup(lease, "state schema mutation", () => lease.run(operation));
}
//#endregion
export { withStateDatabaseSchemaMaintenance as n, StateSchemaMutationConflictError as t };
