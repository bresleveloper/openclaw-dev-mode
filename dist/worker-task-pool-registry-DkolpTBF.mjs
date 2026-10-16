import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { n as joinOwnedWorkerTasks } from "./src-WCJCjrey.mjs";
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
/** Ask every live pool's workers to close the retained resources this key names. */
async function closeWorkerTaskPoolResources(key) {
	const errors = (await Promise.allSettled([...livePools].map((pool) => pool.startCloseResources(key).result))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, "Worker resource cleanup failed");
}
//#endregion
export { liveWorkerTaskPools as n, closeWorkerTaskPoolResources as t };
