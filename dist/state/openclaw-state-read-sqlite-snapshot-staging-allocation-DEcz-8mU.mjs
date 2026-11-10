import { Et as settleSqliteSnapshotRequest, T as captureSqliteReadOnlyWorkerLaunch, t as captureSqliteSnapshotStagingOwner } from "./openclaw-state-read-sqlite-snapshot-staging-owner-DeVv_bRV.mjs";
import path from "node:path";
//#region src/infra/sqlite-snapshot-staging-allocation.ts
async function allocateWorkerOwnedSqliteSnapshotDirectory(inputRoot, allowLegacyWorker, signal) {
	const root = path.resolve(inputRoot);
	const { env, cwd } = captureSqliteReadOnlyWorkerLaunch();
	const owner = captureSqliteSnapshotStagingOwner();
	const request = owner.start({
		type: "allocate",
		root,
		allowLegacyWorker,
		launch: {
			env,
			cwd,
			transport: { kind: "native" }
		}
	}, signal);
	const reply = await settleSqliteSnapshotRequest(request);
	return owner.retainDirectory(reply.directory);
}
//#endregion
export { allocateWorkerOwnedSqliteSnapshotDirectory };
