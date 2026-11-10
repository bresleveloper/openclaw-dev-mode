import { R as getCoreCliCommandDescriptors, y as getSubCliEntriesCore } from "./argv-C7hqFLn5.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { m as collectUniqueCommandDescriptors, p as addCommandDescriptorsToProgram } from "./manifest-gUPkNRN0.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
import { h as resolveMemorySlotDecision, u as normalizePluginsConfig, w as hasKind } from "./config-state-DkDfCu7E.mjs";
import { t as createInstalledPluginEnabledPredicate } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { n as buildPluginRuntimeLoadOptions } from "./load-context-YqkPeFye.mjs";
import { l as validatePluginConfig } from "./loader-shared-yt0SORbS.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-BVnuTwnE.mjs";
import { n as formatProgramHelpOutput, t as configureProgramHelp } from "./help-CARbRKBi.mjs";
import { Command } from "commander";
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
			descriptorGroups.push(...registry.cliRegistrars.filter((entry) => entry.parentPath.length === 0).map((entry) => entry.descriptors));
		}
		return collectUniqueCommandDescriptors(descriptorGroups);
	} catch {
		return collectUniqueCommandDescriptors(descriptorGroups);
	}
}
//#endregion
//#region src/cli/program/root-help.ts
/** Write root help without registering command runtimes. */
async function outputRootHelp(renderOptions) {
	const program = new Command();
	const pluginDescriptors = renderOptions?.config ? await getPluginCliCommandDescriptors(renderOptions.config, renderOptions.env, { pluginSdkResolution: renderOptions.pluginSdkResolution }) : [];
	configureProgramHelp(program, { programVersion: VERSION }, { commandsWithSubcommands: new Set(pluginDescriptors.filter((descriptor) => descriptor.hasSubcommands).map((descriptor) => descriptor.name)) });
	addCommandDescriptorsToProgram(program, collectUniqueCommandDescriptors([
		getCoreCliCommandDescriptors(),
		getSubCliEntriesCore(),
		pluginDescriptors
	]));
	let output = "";
	program.configureOutput({ writeOut: (chunk) => output += formatProgramHelpOutput(chunk) });
	program.outputHelp();
	process.stdout.write(output);
}
//#endregion
export { outputRootHelp };
