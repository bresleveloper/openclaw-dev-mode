import { t as createInstalledPluginEnabledPredicate } from "./installed-plugin-index-D0kh4WcK.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-C9JZrwYv.mjs";
import { r as hasKind } from "./slots-D4OMSTbt.mjs";
import { l as normalizePluginsConfig, p as resolveMemorySlotDecision } from "./config-state-BEAL5gWH.mjs";
import { c as collectUniqueCommandDescriptors } from "./manifest-DHkEL08H.mjs";
import { l as validatePluginConfig } from "./loader-shared-Df1dD4--.mjs";
import { t as buildPluginRuntimeLoadOptions } from "./load-context-D-CZ4KSw.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-DBcPAExA.mjs";
//#region src/plugins/cli-root-descriptors.ts
/** Resolves root CLI help from process-stable manifests before plugin code loads. */
const quietLogger = {
	info: () => {},
	warn: () => {},
	error: () => {},
	debug: () => {}
};
async function getPluginCliCommandDescriptors(cfg, env, loaderOptions) {
	const descriptorGroups = [];
	try {
		const context = resolvePluginRuntimeLoadContext({
			config: cfg,
			env,
			logger: quietLogger
		});
		const snapshot = context.metadataSnapshot;
		if (!snapshot) return [];
		const legacyExternalPluginIds = [];
		const seenPluginIds = /* @__PURE__ */ new Set();
		let selectedMemoryPluginId = null;
		const memorySlot = context.config.plugins?.slots?.memory;
		const normalizedConfig = normalizePluginsConfig(context.config.plugins);
		const sourceConfig = normalizePluginsConfig(context.activationSourceConfig.plugins);
		const isEnabled = createInstalledPluginEnabledPredicate(snapshot.index.plugins, context.config, context.env);
		for (const plugin of snapshot.plugins) {
			if (seenPluginIds.has(plugin.id)) continue;
			seenPluginIds.add(plugin.id);
			if (!isEnabled(plugin.id)) continue;
			const pluginConfig = normalizedConfig.entries[normalizePluginPolicyId(plugin.id)]?.config;
			if (!validatePluginConfig({
				origin: plugin.origin,
				schema: plugin.configSchema,
				cacheKey: plugin.schemaCacheKey,
				value: pluginConfig,
				sourceValue: plugin.configContracts?.secretInputs ? sourceConfig.entries[normalizePluginPolicyId(plugin.id)]?.config : void 0
			}).ok) continue;
			const memoryDecision = resolveMemorySlotDecision({
				id: plugin.id,
				kind: plugin.kind,
				slot: memorySlot,
				selectedId: selectedMemoryPluginId
			});
			if (!memoryDecision.enabled) continue;
			if (memoryDecision.selected && hasKind(plugin.kind, "memory")) selectedMemoryPluginId = plugin.id;
			if (plugin.cliCommands) descriptorGroups.push(plugin.cliCommands);
			else if (plugin.origin !== "bundled" && plugin.format !== "bundle") legacyExternalPluginIds.push(plugin.id);
		}
		if (legacyExternalPluginIds.length > 0) {
			const { loadOpenClawPluginCliRegistry } = await import("./plugins/loader.js");
			const registry = await loadOpenClawPluginCliRegistry(buildPluginRuntimeLoadOptions(context, {
				...loaderOptions,
				onlyPluginIds: legacyExternalPluginIds
			}));
			descriptorGroups.push(...registry.cliRegistrars.filter((entry) => (entry.parentPath ?? []).length === 0).map((entry) => entry.descriptors));
		}
		return collectUniqueCommandDescriptors(descriptorGroups);
	} catch {
		return collectUniqueCommandDescriptors(descriptorGroups);
	}
}
//#endregion
export { getPluginCliCommandDescriptors as t };
