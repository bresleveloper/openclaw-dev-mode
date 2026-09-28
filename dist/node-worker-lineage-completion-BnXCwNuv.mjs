import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-5Wa9sNMr.mjs";
import { tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { t as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-UfK-2Yan.mjs";
import { n as requireNodeWorkerProcessIdentity, t as inspectNodeWorkerProcessIdentity } from "./node-worker-process-identity-D0vo8l-l.mjs";
import { n as readNodeWorkerLaunchReceipt } from "./node-worker-launch-store.kernel-YVRG5nuY.mjs";
//#region src/node-host/node-worker-lineage-completion.ts
const COMPLETION_SCHEMA = ["node_worker_launches", "node_worker_launch_cleanup"].map((table) => extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, table)).join("\n");
/** The anchor records root exit and positive lineage EOF before extinguishing its own group. */
function recordNodeWorkerLineageSettled(binding) {
	const worker = requireNodeWorkerProcessIdentity(process.pid);
	return runExistingOpenClawStateWriteTransaction(({ db }) => {
		const current = readNodeWorkerLaunchReceipt(db, binding.launchId);
		if (!current || current.state !== "running" || current.planHash !== binding.planHash || current.workerCleanupMode !== "owned-anchor" || current.container || current.supervisor.pid !== binding.supervisor.pid || current.supervisor.startTime !== binding.supervisor.startTime || current.worker?.pid !== worker.pid || current.worker.startTime !== worker.startTime || inspectNodeWorkerProcessIdentity(worker) !== "live") return false;
		return executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("node_worker_launch_cleanup").set({ lineage_settled: 1 }).where("launch_id", "=", binding.launchId).where("cleanup_mode", "=", "owned-anchor")).numAffectedRows === 1n;
	}, {
		path: binding.databasePath,
		env: {
			...process.env,
			OPENCLAW_SUPERVISOR_MODE: binding.externallySupervised ? "external" : void 0
		}
	}, {
		schemaSql: COMPLETION_SCHEMA,
		operationLabel: "node-worker-launch.lineage-settled"
	});
}
//#endregion
export { recordNodeWorkerLineageSettled };
