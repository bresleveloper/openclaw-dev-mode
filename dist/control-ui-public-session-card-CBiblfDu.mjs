import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
//#region src/gateway/control-ui-public-session-card.ts
/** The HTTP server owns this pool; importing the module does not start a worker. */
function createPublicSessionCardRenderer() {
	const pool = new WorkerTaskPool({
		workerUrl: resolveRuntimeProcessEntrypointUrl("publicSessionCard"),
		maxWorkers: 1,
		maxPendingTasks: 8,
		sharedCompute: true
	});
	return {
		async render(card) {
			const png = await pool.run(card, { timeoutMs: 1e4 });
			return Buffer.from(png.buffer, png.byteOffset, png.byteLength);
		},
		dispose: () => pool.close()
	};
}
//#endregion
export { createPublicSessionCardRenderer };
