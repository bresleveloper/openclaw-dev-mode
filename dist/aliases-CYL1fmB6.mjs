import { o as writeRuntimeJson, s as writeRuntimeStdout } from "./runtime-BazLsT0s.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { p as DEFAULT_MODEL_ALIASES } from "./validation-core-ezn1vWYO.mjs";
import { n as normalizeAgentModelMapForConfig } from "./model-input-CeM8o97s.mjs";
import { r as logConfigUpdated } from "./logging-CTh_T0q8.mjs";
import { c as resolveModelTarget, f as upsertCanonicalModelConfigEntry, n as ensureFlagCompatibility, o as requireKnownModelProvider, u as updateConfig } from "./shared-Ck_WZImY.mjs";
import { t as normalizeAlias } from "./alias-name-dY2or4SK.mjs";
import { t as loadModelsConfig } from "./load-config-DvAs1Afc.mjs";
//#region src/commands/models/aliases.ts
async function modelsAliasesListCommand(opts, runtime) {
	ensureFlagCompatibility(opts);
	const models = (await loadModelsConfig({
		commandName: "models aliases list",
		runtime
	})).agents?.defaults?.models ?? {};
	const aliases = Object.fromEntries(Object.entries(models).flatMap(([modelKey, entry]) => {
		const alias = entry?.alias?.trim();
		return alias ? [[alias, modelKey]] : [];
	}));
	const aliasEntries = Object.entries(aliases).toSorted(([left], [right]) => left.localeCompare(right));
	if (opts.json) {
		writeRuntimeJson(runtime, { aliases: Object.fromEntries(aliasEntries) });
		return;
	}
	if (opts.plain) {
		for (const [alias, target] of aliasEntries) writeRuntimeStdout(runtime, `${alias} ${target}`);
		return;
	}
	runtime.log(`Aliases (${aliasEntries.length}):`);
	if (aliasEntries.length === 0) {
		runtime.log("- none");
		return;
	}
	for (const [alias, target] of aliasEntries) runtime.log(`- ${alias} -> ${target}`);
}
async function modelsAliasesAddCommand(aliasRaw, modelRaw, runtime) {
	const alias = normalizeAlias(aliasRaw);
	const normalizedAlias = alias.toLowerCase();
	let target = modelRaw;
	let warning;
	await updateConfig((cfgLocal, context) => {
		const resolved = resolveModelTarget({
			raw: modelRaw,
			cfg: context.runtimeConfig
		});
		warning = requireKnownModelProvider(context.runtimeConfig, resolved, context.providerRegistryAvailable).warning;
		const nextModels = { ...cfgLocal.agents?.defaults?.models };
		const modelKey = upsertCanonicalModelConfigEntry(nextModels, resolved, context);
		target = modelKey;
		for (const [key, entry] of Object.entries(nextModels)) {
			const existing = entry?.alias?.trim();
			if (existing && existing.toLowerCase() === normalizedAlias && key !== modelKey) throw new Error(`Alias ${alias} already points to ${key}.`);
		}
		nextModels[modelKey] = {
			...nextModels[modelKey],
			alias
		};
		cfgLocal.agents ??= {};
		cfgLocal.agents.defaults ??= {};
		cfgLocal.agents.defaults.models = nextModels;
		return cfgLocal;
	}, (_cfg, context) => [resolveModelTarget({
		raw: modelRaw,
		cfg: context.runtimeConfig
	})]);
	if (warning) runtime.error?.(warning);
	logConfigUpdated(runtime);
	runtime.log(`Alias ${alias} -> ${target}`);
}
async function modelsAliasesRemoveCommand(aliasRaw, runtime) {
	const alias = normalizeAlias(aliasRaw);
	const normalizedAlias = alias.toLowerCase();
	const updated = await updateConfig((cfg) => {
		const nextModels = { ...cfg.agents?.defaults?.models };
		let found = false;
		for (const [key, entry] of Object.entries(nextModels)) if (entry?.alias?.trim().toLowerCase() === normalizedAlias) {
			nextModels[key] = {
				...entry,
				alias: void 0
			};
			found = true;
		}
		if (!found) {
			const builtinTarget = DEFAULT_MODEL_ALIASES[normalizedAlias];
			const normalizedModels = normalizeAgentModelMapForConfig(nextModels);
			if (builtinTarget && normalizedModels[builtinTarget] && normalizedModels[builtinTarget]?.alias === void 0) throw new Error(`Cannot remove "${alias}": it is a built-in alias for "${builtinTarget}" provided automatically by OpenClaw and is not stored in your config file. To shadow it with a different target, run ${formatCliCommand(`openclaw models aliases add ${alias} <model>`)}.`);
			throw new Error(`Alias not found: ${alias}. Run ${formatCliCommand("openclaw models aliases list")} to see configured aliases.`);
		}
		cfg.agents ??= {};
		cfg.agents.defaults ??= {};
		cfg.agents.defaults.models = nextModels;
		return cfg;
	});
	logConfigUpdated(runtime);
	if (Object.values(updated.agents?.defaults?.models ?? {}).every((entry) => !entry?.alias?.trim())) runtime.log("No aliases configured.");
}
//#endregion
export { modelsAliasesAddCommand, modelsAliasesListCommand, modelsAliasesRemoveCommand };
