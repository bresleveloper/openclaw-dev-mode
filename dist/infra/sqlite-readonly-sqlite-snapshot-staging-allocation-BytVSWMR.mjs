import { l as captureSqliteReadOnlyWorkerLaunch, t as captureSqliteSnapshotStagingOwner } from "./sqlite-readonly-sqlite-snapshot-staging-owner-DzwQ_rDP.mjs";
import { Dn as settleSqliteSnapshotRequest } from "./sqlite-readonly-location.worker.js";
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
