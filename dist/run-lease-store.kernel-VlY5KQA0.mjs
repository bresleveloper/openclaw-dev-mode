import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { i as worktreeRegistryPublication } from "./registry-publication-BJype9QG.mjs";
import { _ as worktreeRunLeaseScope, h as collectLiveRunLeases, n as assertWorktreeRegistryPredicates } from "./registry-run-end.worker-DYWsmg23.mjs";
//#region src/agents/worktrees/run-lease-store.kernel.ts
function admitWorktreeRunLeaseInDatabase(db, params) {
	if (params.observed) assertWorktreeRegistryPredicates(db, [{
		kind: "binding",
		record: params.observed
	}]);
	const k = getNodeSqliteKysely(db);
	const scope = worktreeRunLeaseScope(params.worktreeId);
	const record = executeSqliteQuerySync(db, k.selectFrom("worktrees").select(["path", "removed_at"]).where("id", "=", params.worktreeId)).rows[0];
	const worktreePath = record?.path ?? params.worktreeId;
	if (!record || record.removed_at != null) throw new Error(`managed worktree was removed: ${worktreePath}`);
	const { removingToken, liveCount, exclusive } = collectLiveRunLeases(db, k, scope);
	if (removingToken !== void 0) throw new Error(`managed worktree was removed: ${worktreePath}`);
	if (exclusive || params.exclusive && liveCount > 0) throw new Error("The worktree is in use; wait for its current run or publication to finish.");
	const inserted = executeSqliteQuerySync(db, k.insertInto("state_leases").values({
		scope,
		lease_key: params.token,
		owner: `${params.pid}:${params.startTime ?? ""}`,
		expires_at: null,
		heartbeat_at: null,
		payload_json: JSON.stringify({
			pid: params.pid,
			starttime: params.startTime ?? void 0,
			...params.exclusive ? { exclusive: true } : {}
		}),
		created_at: params.now,
		updated_at: params.now
	}).returningAll()).rows;
	worktreeRegistryPublication.rows(db, inserted);
}
function releaseWorktreeRunLeaseInDatabase(db, worktreeId, token) {
	const removed = executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("state_leases").where("scope", "=", worktreeRunLeaseScope(worktreeId)).where("lease_key", "=", token).returning(["scope", "lease_key"])).rows;
	worktreeRegistryPublication.deleted(db, removed);
}
//#endregion
export { releaseWorktreeRunLeaseInDatabase as n, admitWorktreeRunLeaseInDatabase as t };
