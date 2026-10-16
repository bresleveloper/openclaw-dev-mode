import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
//#region src/gateway/worker-environments/placement-workspace-reservation.kernel.ts
const PERSONAL_SCOPE = "session-workspace-personal-publication";
var SessionWorkspaceReservationBusyError = class extends Error {};
const workspaceReservationQuery = (db) => getNodeSqliteKysely(db);
/** Run admission and placement movement consult the same SQLite exclusion as publishers. */
function assertSessionWorkspaceUnreserved(db, sessionId) {
	if (executeSqliteQueryTakeFirstSync(db, workspaceReservationQuery(db).selectFrom("state_leases").select("owner").where("scope", "=", "session-workspace-personal-publication").where("lease_key", "=", sessionId).where("expires_at", ">", Date.now()))) throw new SessionWorkspaceReservationBusyError("The session workspace is being published; wait for publication to finish and retry.");
}
//#endregion
export { workspaceReservationQuery as i, SessionWorkspaceReservationBusyError as n, assertSessionWorkspaceUnreserved as r, PERSONAL_SCOPE as t };
