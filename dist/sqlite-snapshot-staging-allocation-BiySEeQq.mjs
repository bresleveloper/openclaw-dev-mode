import { t as captureSqliteReadOnlyWorkerLaunch } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { p as settleSqliteSnapshotRequest } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { t as captureSqliteSnapshotStagingOwner } from "./sqlite-snapshot-staging-owner-42z7nqrk.mjs";
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
