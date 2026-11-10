import { p as runSqliteReadOnlyWorker } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { d as retainSnapshotWork, v as isSqliteSnapshotStagingName } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { a as sqliteSnapshotStagingParent, m as resolvePrivateSqliteSnapshotStagingRoot, o as warnSqliteSnapshotReclamation } from "./sqlite-snapshot-staging-B4VrWJSe.mjs";
import fs from "node:fs";
//#region src/infra/sqlite-snapshot-reclamation.ts
const pendingReclamations = /* @__PURE__ */ new Map();
function reclaimAbandonedSqliteSnapshotsAsync(root = resolvePrivateSqliteSnapshotStagingRoot()) {
	if (sqliteSnapshotStagingParent(root) || pendingReclamations.has(root)) return pendingReclamations.get(root) ?? Promise.resolve();
	const controller = new AbortController();
	const pass = retainSnapshotWork((async () => {
		try {
			const entries = await fs.promises.readdir(root, { withFileTypes: true }).catch(() => void 0);
			if (entries && !entries.some((entry) => entry.isDirectory() && isSqliteSnapshotStagingName(entry.name))) return;
			if (!controller.signal.aborted) for (const message of await runSqliteReadOnlyWorker(root, {
				mode: "reclaim",
				signal: controller.signal
			})) warnSqliteSnapshotReclamation(message);
		} catch (error) {
			warnSqliteSnapshotReclamation("SQLite snapshot reclamation worker failed; continuing without cache cleanup.", error);
		} finally {
			pendingReclamations.delete(root);
		}
	})(), () => controller.abort(/* @__PURE__ */ new Error("SQLite snapshot reclamation owner stopped")));
	pendingReclamations.set(root, pass);
	return pass;
}
//#endregion
export { reclaimAbandonedSqliteSnapshotsAsync };
