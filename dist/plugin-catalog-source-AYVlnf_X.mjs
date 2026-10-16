import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { _ as resolveConfigDir } from "./utils-DgZn2dLu.mjs";
import path from "node:path";
//#region src/plugins/plugin-catalog-source.ts
function parseExternalPluginCatalogEntries(raw) {
	const list = Array.isArray(raw) ? raw : isRecord(raw) ? raw.entries ?? raw.packages ?? raw.plugins : void 0;
	return Array.isArray(list) ? list.filter((entry) => isRecord(entry)) : [];
}
function resolveExternalPluginCatalogPaths(options) {
	if (options.catalogPaths?.length) return normalizeStringEntries(options.catalogPaths);
	const env = options.env ?? process.env;
	for (const key of ["OPENCLAW_PLUGIN_CATALOG_PATHS", "OPENCLAW_MPM_CATALOG_PATHS"]) {
		const raw = normalizeOptionalString(env[key]);
		if (raw) return normalizeStringEntries(raw.split(/[;,]/g).flatMap((chunk) => chunk.split(path.delimiter)));
	}
	const configDir = resolveConfigDir(env);
	return [
		"mpm/plugins.json",
		"mpm/catalog.json",
		"plugins/catalog.json"
	].map((relativePath) => path.join(configDir, relativePath));
}
//#endregion
export { resolveExternalPluginCatalogPaths as n, parseExternalPluginCatalogEntries as t };
