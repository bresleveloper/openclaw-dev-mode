import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { s as getGatewayRestartDrainSignal } from "./gateway-work-admission-CHv_0noy.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B2mQXTqH.mjs";
import { n as find } from "./placement-row-codec-qMLLgrft.mjs";
//#region src/gateway/worker-environments/placement-workspace-reservation.ts
const SCOPE = "session-workspace-action";
const PERSONAL_SCOPE = "session-workspace-personal-publication";
var SessionWorkspaceReservationBusyError = class extends Error {};
const query = (db) => getNodeSqliteKysely(db);
/** Run admission and placement movement consult the same SQLite exclusion as publishers. */
function assertSessionWorkspaceUnreserved(db, sessionId) {
	if (executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("state_leases").select("owner").where("scope", "=", PERSONAL_SCOPE).where("lease_key", "=", sessionId).where("expires_at", ">", Date.now()))) throw new SessionWorkspaceReservationBusyError("The session workspace is being published; wait for publication to finish and retry.");
}
function assertReconciled(db, identity, workspace) {
	const placement = find(db, identity.sessionId);
	if (placement && (placement.agentId !== identity.agentId || placement.sessionKey !== identity.sessionKey)) throw new Error("The session workspace placement identity changed.");
	if (placement && (placement.state !== "local" && placement.state !== "reclaimed" && !(workspace === "repository" && (placement.state === "active" || placement.state === "failed")) || placement.turnClaim)) throw new SessionWorkspaceReservationBusyError(workspace === "repository" ? "The repository checkpoint is busy; finish the current turn or worker operation before publishing." : "My GitHub publication requires an idle local workspace; finish the turn and reclaim remote work first.");
	const pending = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_workspace_pending_results").select("session_id").where("session_id", "=", identity.sessionId));
	const reconciliation = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_workspace_reconciliations").select("session_id").where("session_id", "=", identity.sessionId));
	if (pending || reconciliation) throw new SessionWorkspaceReservationBusyError("The session workspace is still reconciling; wait for reclaim to finish before publishing with My GitHub.");
}
function createPlacementWorkspaceReservationOps(runtime) {
	const signal = getGatewayRestartDrainSignal();
	const withReservation = async (scope, sessionId, run) => await withOpenClawStateLease({
		scope,
		key: sessionId,
		database: {
			scope: "shared",
			options: { path: runtime.path }
		},
		leaseMs: 6e4,
		waitMs: 0,
		leaseLabel: "session publication exclusion",
		signal
	}, async (lease) => await run(() => lease.assertOwned()));
	const withWorkspaceExclusion = (sessionId, run) => withReservation(SCOPE, sessionId, run);
	const withWorkspaceReservation = async (identity, workspace, run) => {
		return await withWorkspaceExclusion(identity.sessionId, async (assertPublisherExclusion) => await withReservation(PERSONAL_SCOPE, identity.sessionId, async (assertOwned) => {
			assertReconciled(runtime.read(), identity, workspace);
			const initial = find(runtime.read(), identity.sessionId);
			const assertCurrent = () => {
				assertPublisherExclusion();
				assertOwned();
				assertReconciled(runtime.read(), identity, workspace);
				const current = find(runtime.read(), identity.sessionId);
				if (current?.generation !== initial?.generation || current?.state !== initial?.state || current?.environmentId !== initial?.environmentId || current?.activeOwnerEpoch !== initial?.activeOwnerEpoch) throw new Error("The session workspace placement changed during publication.");
			};
			return await run(assertCurrent);
		}));
	};
	return {
		withWorkspaceExclusion,
		withLocalWorkspaceReservation: (identity, run) => withWorkspaceReservation(identity, "local", run),
		withRepositoryWorkspaceReservation: (identity, run) => withWorkspaceReservation(identity, "repository", run)
	};
}
//#endregion
export { assertSessionWorkspaceUnreserved as n, createPlacementWorkspaceReservationOps as r, SessionWorkspaceReservationBusyError as t };
