import { a as writeRuntimeJson, o as writeRuntimeStdout } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { n as normalizeAgentModelMapForConfig } from "./model-input-DKxKaZGG.mjs";
import { m as DEFAULT_MODEL_ALIASES } from "./validation-core-DwJVlxTe.mjs";
import { r as logConfigUpdated } from "./logging-DLCoHZv9.mjs";
import { c as resolveModelTarget, f as upsertCanonicalModelConfigEntry, n as ensureFlagCompatibility, u as updateConfig } from "./shared-yzzedLUF.mjs";
import { t as normalizeAlias } from "./alias-name-Bwsh7Ooz.mjs";
import { t as loadModelsConfig } from "./load-config-CQ4HhFsY.mjs";
//#region src/commands/models/aliases.ts
/** Commands for listing, adding, and removing model aliases. */
/** Lists configured model aliases as JSON, plain pairs, or human-readable rows. */
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
/** Adds or replaces an alias for a resolved provider/model target. */
async function modelsAliasesAddCommand(aliasRaw, modelRaw, runtime) {
	const alias = normalizeAlias(aliasRaw);
	const normalizedAlias = alias.toLowerCase();
	let target = modelRaw;
	await updateConfig((cfgLocal, context) => {
		const resolved = resolveModelTarget({
			raw: modelRaw,
			cfg: context.runtimeConfig
		});
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
		return {
			...cfgLocal,
			agents: {
				...cfgLocal.agents,
				defaults: {
					...cfgLocal.agents?.defaults,
					models: nextModels
				}
			}
		};
	}, (_cfg, context) => [resolveModelTarget({
		raw: modelRaw,
		cfg: context.runtimeConfig
	})]);
	logConfigUpdated(runtime);
	runtime.log(`Alias ${alias} -> ${target}`);
}
/** Removes a configured alias by name. */
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
		return {
			...cfg,
			agents: {
				...cfg.agents,
				defaults: {
					...cfg.agents?.defaults,
					models: nextModels
				}
			}
		};
	});
	logConfigUpdated(runtime);
	if (!updated.agents?.defaults?.models || Object.values(updated.agents.defaults.models).every((entry) => !entry?.alias?.trim())) runtime.log("No aliases configured.");
}
//#endregion
export { modelsAliasesAddCommand, modelsAliasesListCommand, modelsAliasesRemoveCommand };
