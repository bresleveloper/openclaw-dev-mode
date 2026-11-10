import os from "node:os";
//#region src/infra/host-memory.ts
/**
* Host memory that is free or reclaimable. On macOS, Node's available-memory
* reading includes inactive and purgeable pages, unlike os.freemem(); other
* platforms retain the host-wide os.freemem() reading.
*/
function readHostFreeMemoryBytes() {
	if (process.platform !== "darwin") return os.freemem();
	const available = process.availableMemory();
	return available > 0 ? available : os.freemem();
}
//#endregion
export { readHostFreeMemoryBytes as t };
