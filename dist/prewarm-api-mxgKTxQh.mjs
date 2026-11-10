//#region extensions/memory-core/prewarm-api.ts
async function prewarmMemorySearchWorker() {
	await (await import("./manager-cpu-worker-runtime-BWz1crqV.mjs")).prewarmMemorySearchWorker();
}
//#endregion
export { prewarmMemorySearchWorker as t };
