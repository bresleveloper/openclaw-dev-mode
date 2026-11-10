import { c as searchClawHubPackages } from "./clawhub-packages-ZgTQkB-H.mjs";
//#region src/plugins/catalog-search.ts
const INSTALLABLE_PLUGIN_FAMILIES = ["code-plugin", "bundle-plugin"];
const DEFAULT_PLUGIN_SEARCH_LIMIT = 20;
const MAX_PLUGIN_SEARCH_LIMIT = 100;
async function searchInstallablePluginPackages(params) {
	const limit = !Number.isFinite(params.limit) || !params.limit || params.limit <= 0 ? DEFAULT_PLUGIN_SEARCH_LIMIT : Math.min(Math.max(Math.trunc(params.limit), 1), MAX_PLUGIN_SEARCH_LIMIT);
	const groups = await Promise.all(INSTALLABLE_PLUGIN_FAMILIES.map((family) => searchClawHubPackages({
		query: params.query,
		family,
		limit
	})));
	const byName = /* @__PURE__ */ new Map();
	for (const entry of groups.flat()) {
		const existing = byName.get(entry.package.name);
		if (!existing || entry.score > existing.score) byName.set(entry.package.name, entry);
	}
	return [...byName.values()].toSorted((left, right) => right.score - left.score).slice(0, limit);
}
//#endregion
export { searchInstallablePluginPackages as t };
