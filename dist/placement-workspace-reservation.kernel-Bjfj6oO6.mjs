import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
//#region src/gateway/worker-environments/placement-workspace-reservation.kernel.ts
const PERSONAL_SCOPE = "session-workspace-personal-publication";
var SessionWorkspaceReservationBusyError = class extends Error {};
const workspaceReservationQuery = (db) => getNodeSqliteKysely(db);
/** Run admission and placement movement consult the same SQLite exclusion as publishers. */
function selectActiveSessionWorkspaceReservation(db, sessionId) {
	return workspaceReservationQuery(db).selectFrom("state_leases").select("owner").where("scope", "=", PERSONAL_SCOPE).where("lease_key", "=", sessionId).where("expires_at", ">", Date.now());
}
function assertSessionWorkspaceUnreserved(db, sessionId) {
	if (executeSqliteQueryTakeFirstSync(db, selectActiveSessionWorkspaceReservation(db, sessionId))) throw new SessionWorkspaceReservationBusyError("The session workspace is being published; wait for publication to finish and retry.");
}
//#endregion
export { selectActiveSessionWorkspaceReservation as i, SessionWorkspaceReservationBusyError as n, assertSessionWorkspaceUnreserved as r, PERSONAL_SCOPE as t };
