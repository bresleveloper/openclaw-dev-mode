import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { t as createInstalledPluginIndexScopeLookup } from "./installed-plugin-index-scope-lookup-DneslQx1.mjs";
import { t as collectConfiguredRuntimeIds } from "./configured-runtime-plugin-installs-3FM01Txu.mjs";
//#region src/commands/doctor/shared/configured-runtime-plugin-owners.ts
/** Resolve runtime selections to their manifest owners before checking plugin installation. */
function collectConfiguredRuntimePluginIds(cfg, options = {}) {
	const runtimes = collectConfiguredRuntimeIds(cfg, options);
	if (runtimes.length === 0) return [];
	const metadata = loadManifestMetadataSnapshot({
		config: cfg,
		env: options.env
	});
	const lookup = createInstalledPluginIndexScopeLookup(metadata.index);
	const ids = /* @__PURE__ */ new Set();
	for (const runtime of runtimes) if (lookup.hasAgentHarnessOwners([runtime])) lookup.addAgentHarnessOwners(ids, [runtime]);
	else ids.add(runtime);
	return [...ids].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export { collectConfiguredRuntimePluginIds as t };
