import { L as getCoreCliCommandDescriptors, v as getSubCliEntriesCore } from "./argv-D_Nxd_3s.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { t as createInstalledPluginEnabledPredicate } from "./installed-plugin-index-Zl-RSskC.mjs";
import { r as hasKind } from "./slots-DarSawuQ.mjs";
import { h as resolveMemorySlotDecision, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
import { c as collectUniqueCommandDescriptors, s as addCommandDescriptorsToProgram } from "./manifest-BXjFCp0F.mjs";
import { n as buildPluginRuntimeLoadOptions } from "./load-context-Bf_u2yr8.mjs";
import { l as validatePluginConfig } from "./loader-shared-DdfigWD5.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-CXTPIuAJ.mjs";
import { n as formatProgramHelpOutput, t as configureProgramHelp } from "./help-C89FSiHx.mjs";
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
			descriptorGroups.push(...registry.cliRegistrars.filter((entry) => (entry.parentPath ?? []).length === 0).map((entry) => entry.descriptors));
		}
		return collectUniqueCommandDescriptors(descriptorGroups);
	} catch {
		return collectUniqueCommandDescriptors(descriptorGroups);
	}
}
//#endregion
//#region src/cli/program/root-help.ts
/** Render root help text without registering command runtimes. */
async function renderRootHelpText(renderOptions) {
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
	return output;
}
/** Write rendered root help directly to stdout. */
async function outputRootHelp(renderOptions) {
	process.stdout.write(await renderRootHelpText(renderOptions));
}
//#endregion
export { outputRootHelp };
