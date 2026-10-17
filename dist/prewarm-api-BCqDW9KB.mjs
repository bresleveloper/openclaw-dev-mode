//#region extensions/memory-core/prewarm-api.ts
async function prewarmMemorySearchWorker() {
	await (await import("./manager-cpu-worker-runtime-c15MZZuT.mjs")).prewarmMemorySearchWorker();
}
//#endregion
export { prewarmMemorySearchWorker as t };
