import { a as writeRuntimeJson, o as writeRuntimeStdout } from "./runtime-DlO3PTAd.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { l as toAgentModelListLike, o as resolveAgentModelFallbackValues } from "./model-input-C9K4a_6k.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { r as logConfigUpdated } from "./logging-BBc-wU1i.mjs";
import { a as mergePrimaryFallbackConfig, c as resolveModelTarget, f as upsertCanonicalModelConfigEntry, n as ensureFlagCompatibility, o as resolveModelKeysFromEntries, s as resolveModelRefsFromEntries, u as updateConfig } from "./shared-CP4E7wPe.mjs";
import { t as loadModelsConfig } from "./load-config-D0EM9qHZ.mjs";
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
async function addFallbackCommand(params, modelRaw, runtime) {
	const updated = await updateConfig((cfg, context) => {
		const { runtimeConfig } = context;
		const resolved = resolveModelTarget({
			raw: modelRaw,
			cfg: runtimeConfig
		});
		const nextModels = { ...cfg.agents?.defaults?.models };
		const targetKey = upsertCanonicalModelConfigEntry(nextModels, resolved, context);
		const existing = getFallbacks(cfg, params.key);
		const existingKeys = resolveModelKeysFromEntries({
			cfg: runtimeConfig,
			entries: getFallbacks(runtimeConfig, params.key)
		});
		return patchDefaultsFallbacks(cfg, {
			key: params.key,
			fallbacks: existingKeys.includes(targetKey) ? existing : [...existing, targetKey],
			models: nextModels
		});
	}, (_, { runtimeConfig }) => [resolveModelTarget({
		raw: modelRaw,
		cfg: runtimeConfig
	}), ...resolveModelRefsFromEntries({
		cfg: runtimeConfig,
		entries: getFallbacks(runtimeConfig, params.key)
	})]);
	logConfigUpdated(runtime);
	runtime.log(`${params.label}: ${getFallbacks(updated, params.key).join(", ")}`);
}
async function removeFallbackCommand(params, modelRaw, runtime) {
	const updated = await updateConfig((cfg, { runtimeConfig }) => {
		const resolved = resolveModelTarget({
			raw: modelRaw,
			cfg: runtimeConfig
		});
		const targetKey = modelKey(resolved.provider, resolved.model);
		const existing = getFallbacks(cfg, params.key);
		const existingKeys = resolveModelKeysFromEntries({
			cfg: runtimeConfig,
			entries: getFallbacks(runtimeConfig, params.key)
		});
		const filtered = existing.filter((_, index) => existingKeys[index] !== targetKey);
		if (filtered.length === existing.length) throw new Error(`${params.notFoundLabel} not found: ${targetKey}. Run ${formatCliCommand(`openclaw ${listCommandForFallbackKey(params.key)}`)} to see configured fallbacks.`);
		return patchDefaultsFallbacks(cfg, {
			key: params.key,
			fallbacks: filtered
		});
	}, (_, { runtimeConfig }) => [resolveModelTarget({
		raw: modelRaw,
		cfg: runtimeConfig
	}), ...resolveModelRefsFromEntries({
		cfg: runtimeConfig,
		entries: getFallbacks(runtimeConfig, params.key)
	})]);
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
export { addFallbackCommand, clearFallbacksCommand, listFallbacksCommand, removeFallbackCommand };
