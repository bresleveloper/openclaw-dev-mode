import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { t as ExitError } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as OpenClawStateOwnershipError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { s as isTerminalSqliteIntegrityError } from "./sqlite-integrity-06TCB-az.mjs";
import { r as isSqliteSchemaMismatchError } from "./sqlite-schema-issues-BnRd2KGO.mjs";
import { r as findStartupMaintenanceRequiredError } from "./startup-maintenance-required-D0mOtveg.mjs";
import { p as isAgentDatabaseOwnershipMismatchError } from "./agent-database-admission-CeDA0ojh.mjs";
//#region src/commands/doctor-startup-migration-refusal.ts
/** Admission, final reads and in-process restarts share the same terminal refusal facts. */
function isStartupConfigRefusal(error) {
	return Boolean(findStartupMaintenanceRequiredError(error)) || isAgentDatabaseOwnershipMismatchError(error) || collectNestedErrorCandidates(error).some((failure) => failure instanceof Error && (failure instanceof OpenClawStateOwnershipError || isSqliteSchemaMismatchError(failure) || isTerminalSqliteIntegrityError(failure) || failure.name === "SqliteRepairableForeignKeyError"));
}
/** Preserve explicit exits and operational failures after the caller's cleanup has settled. */
function rethrowStartupConfigFailure(error) {
	if (error instanceof ExitError || !isStartupConfigRefusal(error)) throw error;
	return throwStartupMigrationRefusal(formatErrorMessage(error), error);
}
function throwStartupMigrationRefusal(message, cause) {
	console.error(message);
	throw Object.assign(new ExitError(78, message), { cause });
}
function throwStartupMigrationGuardRejected() {
	throw new Error("OpenClaw startup migrations were skipped because the selected config changed during startup; refusing to report the gateway ready. Retry startup so the new config can be validated.");
}
async function refuseStartupMigrationsForLiveGatewayOwner(env) {
	if (env.VITEST || env.NODE_ENV === "test") return;
	const { readActiveGatewayLockIdentity } = await import("./gateway-lock-BLFQD0F1.mjs");
	const activeGateway = await readActiveGatewayLockIdentity({ env });
	if (activeGateway) throwStartupMigrationRefusal(`Another gateway (pid ${activeGateway.pid}) already owns this state directory; refusing to run automatic startup migrations or report the gateway ready. Stop it with "openclaw gateway stop" (or select a different OPENCLAW_STATE_DIR), then retry startup.`);
}
//#endregion
export { throwStartupMigrationGuardRejected as i, refuseStartupMigrationsForLiveGatewayOwner as n, rethrowStartupConfigFailure as r, isStartupConfigRefusal as t };
