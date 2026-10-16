import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { t as ExitError } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as OpenClawStateOwnershipError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { r as isSqliteSchemaMismatchError } from "./sqlite-schema-issues-Cd5MmsG2.mjs";
import { r as findStartupMaintenanceRequiredError } from "./startup-maintenance-required-rkhEAmAi.mjs";
import { a as isTerminalSqliteIntegrityError } from "./sqlite-integrity-GtqcmwG3.mjs";
import { p as isAgentDatabaseOwnershipMismatchError } from "./agent-database-admission-dWNS6Rcs.mjs";
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
function throwStartupMigrationIdentityChanged(reason) {
	throwStartupMigrationRefusal(`OpenClaw migration inputs changed during startup${reason ? ` (${reason})` : ""}; refusing to report the gateway ready. Restart OpenClaw so state migrations run against the final config and plugin inventory.`);
}
async function refuseStartupMigrationsForLiveGatewayOwner(env) {
	if (env.VITEST || env.NODE_ENV === "test") return;
	const { readActiveGatewayLockIdentity } = await import("./gateway-lock-C0JnIOLH.mjs");
	const activeGateway = await readActiveGatewayLockIdentity({ env });
	if (activeGateway) throwStartupMigrationRefusal(`Another gateway (pid ${activeGateway.pid}) already owns this state directory; refusing to run automatic startup migrations or report the gateway ready. Stop it with "openclaw gateway stop" (or select a different OPENCLAW_STATE_DIR), then retry startup.`);
}
//#endregion
export { throwStartupMigrationIdentityChanged as a, throwStartupMigrationGuardRejected as i, refuseStartupMigrationsForLiveGatewayOwner as n, rethrowStartupConfigFailure as r, isStartupConfigRefusal as t };
