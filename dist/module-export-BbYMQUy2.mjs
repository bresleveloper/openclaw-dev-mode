//#region src/plugins/module-export.ts
/** Unwraps nested default exports produced by mixed ESM/CJS plugin bundles. */
function unwrapDefaultModuleExport(moduleExport) {
	let resolved = moduleExport;
	const seen = /* @__PURE__ */ new Set();
	while (resolved && typeof resolved === "object" && "default" in resolved && !seen.has(resolved)) {
		seen.add(resolved);
		resolved = resolved.default;
	}
	return resolved;
}
function resolvePluginModuleExport(moduleExport) {
	const seen = /* @__PURE__ */ new Set();
	const candidates = [unwrapDefaultModuleExport(moduleExport), moduleExport];
	for (let index = 0; index < candidates.length && index < 12; index += 1) {
		const resolved = candidates[index];
		if (seen.has(resolved)) continue;
		seen.add(resolved);
		if (typeof resolved === "function") return { register: resolved };
		if (resolved && typeof resolved === "object") {
			const definition = resolved;
			const register = definition.register;
			if (typeof register === "function") return {
				definition,
				register
			};
			for (const key of ["default", "module"]) if (key in definition) candidates.push(Reflect.get(definition, key));
		}
	}
	const resolved = candidates[0];
	if (resolved && typeof resolved === "object") {
		const definition = resolved;
		return {
			definition,
			register: definition.register
		};
	}
	return {};
}
//#endregion
export { unwrapDefaultModuleExport as n, resolvePluginModuleExport as t };
