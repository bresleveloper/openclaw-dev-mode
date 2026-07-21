import { t as runSessionStartupMigration } from "./startup-migration-BP-uiX-C.js";
//#region src/gateway/server-startup-session-migration.ts
/**
* Run orphan-key session migration at gateway startup.
*
* Idempotent and best-effort: if the migration fails, gateway startup
* continues normally. This ensures accumulated orphaned session keys
* (from the write-path bug #29683) are cleaned up automatically on
* upgrade rather than requiring a manual `openclaw doctor` run.
*/
async function runStartupSessionMigration(params) {
	await runSessionStartupMigration(params);
}
//#endregion
export { runStartupSessionMigration };
