import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { n as joinOwnedWorkerTasks } from "./src-NEpyeLp1.mjs";
import "./store-writer-queue-AKR6NnXM.mjs";
//#region src/state/openclaw-agent-write-admission-state.ts
const agentDatabaseWriteAdmissionState = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseWriteAdmission"), () => ({ queues: /* @__PURE__ */ new Map() }));
const SQLITE_SESSION_WRITER_QUEUES = agentDatabaseWriteAdmissionState.queues;
//#endregion
//#region src/infra/worker-task-pool-registry.ts
const livePools = resolveGlobalSingleton(Symbol.for("openclaw.workerTaskPools"), () => /* @__PURE__ */ new Set());
const liveWorkerTaskPools = {
	register(pool) {
		livePools.add(pool);
		return pool;
	},
	async close(pool, closures, finish) {
		await joinOwnedWorkerTasks(closures);
		await finish();
		livePools.delete(pool);
	}
};
async function closeResources(key) {
	const errors = (await Promise.allSettled([...livePools].map((pool) => pool.startCloseResources(key).result))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, "Worker resource cleanup failed");
}
/** Ask every live pool's workers to close the retained resources this key names. */
const closeWorkerTaskPoolResources = closeResources;
//#endregion
export { agentDatabaseWriteAdmissionState as i, liveWorkerTaskPools as n, SQLITE_SESSION_WRITER_QUEUES as r, closeWorkerTaskPoolResources as t };
