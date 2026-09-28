import { o as __toESM } from "./.setup/rolldown-runtime-BMI-E3GI.mjs";
//#region extensions/memory-lancedb/lancedb-runtime.ts
function buildLoadFailureMessage(error) {
	return [
		"memory-lancedb: bundled @lancedb/lancedb dependency is unavailable.",
		"Install or repair the memory-lancedb plugin package dependencies, then restart OpenClaw.",
		String(error)
	].join(" ");
}
function isUnsupportedNativePlatform(params) {
	return params.platform === "darwin" && params.arch === "x64";
}
function buildUnsupportedNativePlatformMessage(params) {
	return [
		`memory-lancedb: LanceDB runtime is unavailable on ${params.platform}-${params.arch}.`,
		"The bundled @lancedb/lancedb dependency does not publish a native package for this platform.",
		"Disable memory-lancedb or switch to a supported memory backend/platform."
	].join(" ");
}
const platform = process.platform;
const arch = process.arch;
let loadPromise = null;
async function loadLanceDbModule() {
	if (!loadPromise) loadPromise = import("./.setup/dist-BjiCSHUs.mjs").then((m) => /* @__PURE__ */ __toESM(m.default, 1)).catch((error) => {
		loadPromise = null;
		if (isUnsupportedNativePlatform({
			platform,
			arch
		})) throw new Error(buildUnsupportedNativePlatformMessage({
			platform,
			arch
		}), { cause: error });
		throw new Error(buildLoadFailureMessage(error), { cause: error });
	});
	return await loadPromise;
}
//#endregion
export { loadLanceDbModule };
