import { o as writeRuntimeJson, s as writeRuntimeStdout } from "./runtime-BazLsT0s.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { l as toAgentModelListLike, o as resolveAgentModelFallbackValues } from "./model-input-CeM8o97s.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { r as logConfigUpdated } from "./logging-CTh_T0q8.mjs";
import { a as mergePrimaryFallbackConfig, c as resolveModelTarget, f as upsertCanonicalModelConfigEntry, n as ensureFlagCompatibility, o as requireKnownModelProvider, s as resolveModelRefsFromEntries, u as updateConfig } from "./shared-Ck_WZImY.mjs";
import { t as loadModelsConfig } from "./load-config-DvAs1Afc.mjs";
//#region src/commands/models/fallbacks-shared.ts
function listCommandForFallbackKey(key) {
	return key === "imageModel" ? "models image-fallbacks list" : "models fallbacks list";
}
function getFallbacks(cfg, key) {
	return resolveAgentModelFallbackValues(cfg.agents?.defaults?.[key]);
}
function patchDefaultsFallbacks(cfg, params) {
	const existing = toAgentModelListLike(cfg.agents?.defaults?.[params.key]);
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				[params.key]: mergePrimaryFallbackConfig(existing, { fallbacks: params.fallbacks }),
				...params.models ? { models: params.models } : void 0
			}
		}
	};
}
async function listFallbacksCommand(params, opts, runtime) {
	ensureFlagCompatibility(opts);
	const fallbacks = getFallbacks(await loadModelsConfig({
		commandName: listCommandForFallbackKey(params.key),
		runtime
	}), params.key);
	if (opts.json) {
		writeRuntimeJson(runtime, { fallbacks });
		return;
	}
	if (opts.plain) {
		for (const entry of fallbacks) writeRuntimeStdout(runtime, entry);
		return;
	}
	runtime.log(`${params.label} (${fallbacks.length}):`);
	if (fallbacks.length === 0) {
		runtime.log("- none");
		return;
	}
	for (const entry of fallbacks) runtime.log(`- ${entry}`);
}
async function changeFallbacksCommand(params, modelRaw, runtime) {
	let warning;
	const updated = await updateConfig((cfg, context) => {
		const { runtimeConfig } = context;
		const resolved = resolveModelTarget({
			raw: modelRaw,
			cfg: runtimeConfig
		});
		if (params.action === "add") warning = requireKnownModelProvider(runtimeConfig, resolved, context.providerRegistryAvailable).warning;
		const nextModels = params.action === "add" ? { ...cfg.agents?.defaults?.models } : void 0;
		const targetKey = nextModels ? upsertCanonicalModelConfigEntry(nextModels, resolved, context) : modelKey(resolved.provider, resolved.model);
		const existing = getFallbacks(cfg, params.key);
		const existingKeys = resolveModelRefsFromEntries({
			cfg: runtimeConfig,
			entries: getFallbacks(runtimeConfig, params.key)
		}).map((ref) => ref ? modelKey(ref.provider, ref.model) : void 0);
		const fallbacks = params.action === "add" ? existingKeys.includes(targetKey) ? existing : [...existing, targetKey] : existing.filter((_, index) => existingKeys[index] !== targetKey);
		if (params.action === "remove" && fallbacks.length === existing.length) throw new Error(`${params.notFoundLabel} not found: ${targetKey}. Run ${formatCliCommand(`openclaw ${listCommandForFallbackKey(params.key)}`)} to see configured fallbacks.`);
		return patchDefaultsFallbacks(cfg, {
			key: params.key,
			fallbacks,
			models: nextModels
		});
	}, (_, { runtimeConfig }) => [resolveModelTarget({
		raw: modelRaw,
		cfg: runtimeConfig
	}), ...resolveModelRefsFromEntries({
		cfg: runtimeConfig,
		entries: getFallbacks(runtimeConfig, params.key)
	})]);
	if (warning) runtime.error?.(warning);
	logConfigUpdated(runtime);
	runtime.log(`${params.label}: ${getFallbacks(updated, params.key).join(", ")}`);
}
async function clearFallbacksCommand(params, runtime) {
	await updateConfig((cfg) => {
		return patchDefaultsFallbacks(cfg, {
			key: params.key,
			fallbacks: []
		});
	});
	logConfigUpdated(runtime);
	runtime.log(params.clearedMessage);
}
//#endregion
export { changeFallbacksCommand, clearFallbacksCommand, listFallbacksCommand };
