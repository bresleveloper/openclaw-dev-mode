import { pathToFileURL } from "node:url";
//#region src/hooks/module-loader.ts
async function importFileModule(params) {
	const url = pathToFileURL(params.modulePath).href;
	return await (params.cacheBust ? import(`${url}?t=${params.nowMs ?? Date.now()}`) : import(url));
}
function resolveFunctionModuleExport(params) {
	const explicitExport = params.exportName?.trim();
	const exportNames = explicitExport ? [explicitExport] : params.fallbackExportNames ?? ["default"];
	for (const exportName of exportNames) {
		const candidate = params.mod[exportName];
		if (typeof candidate === "function") return candidate;
	}
}
//#endregion
export { resolveFunctionModuleExport as n, importFileModule as t };
