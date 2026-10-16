import { o as __toESM } from "./.setup/rolldown-runtime-BMI-E3GI.mjs";
//#region extensions/memory-lancedb/lancedb-runtime.ts
const platform = process.platform;
const arch = process.arch;
let loadPromise = null;
async function loadLanceDbModule() {
	if (!loadPromise) loadPromise = import("./.setup/dist-DIga2e6Y.mjs").then((m) => /* @__PURE__ */ __toESM(m.default, 1)).catch((error) => {
		loadPromise = null;
		if (platform === "darwin" && arch === "x64") throw new Error(`memory-lancedb: LanceDB runtime is unavailable on ${platform}-${arch}. The bundled @lancedb/lancedb dependency does not publish a native package for this platform. Disable memory-lancedb or switch to a supported memory backend/platform.`, { cause: error });
		throw new Error(`memory-lancedb: bundled @lancedb/lancedb dependency is unavailable. Install or repair the memory-lancedb plugin package dependencies, then restart OpenClaw. ${String(error)}`, { cause: error });
	});
	return await loadPromise;
}
//#endregion
export { loadLanceDbModule };
