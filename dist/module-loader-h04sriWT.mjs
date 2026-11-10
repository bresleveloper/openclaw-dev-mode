//#region src/hooks/module-loader.ts
function resolveFunctionModuleExport(params) {
	const explicitExport = params.exportName?.trim();
	const exportNames = explicitExport ? [explicitExport] : params.fallbackExportNames ?? ["default"];
	for (const exportName of exportNames) {
		const candidate = params.mod[exportName];
		if (typeof candidate === "function") return candidate;
	}
}
//#endregion
export { resolveFunctionModuleExport as t };
