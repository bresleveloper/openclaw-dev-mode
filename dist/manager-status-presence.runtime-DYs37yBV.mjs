//#region extensions/memory-core/src/memory/manager-status-presence.runtime.ts
async function inspectMemoryIndexPresence(databasePath) {
	const { runMemoryPresenceInspection } = await import("./manager-cpu-worker-runtime-CTlvA7Yq.mjs");
	try {
		return await runMemoryPresenceInspection(databasePath);
	} catch {
		return false;
	}
}
//#endregion
export { inspectMemoryIndexPresence as t };
