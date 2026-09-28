import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./model-ref-shared-BgRrSHjn.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import "./defaults-BbU4k6fu.mjs";
import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { c as inferUniqueProviderFromConfiguredModels, h as resolveConfiguredModelRef, i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import { n as resolveConfiguredModelFallbacks } from "./model-selection-resolve-D7hqOXrq.mjs";
//#region src/agents/configured-model-entries.ts
/** Projects effective configured model refs, aliases, and role tags for one agent. */
function resolveConfiguredModelEntries(params) {
	const defaultProvider = params.defaultProvider ?? "openai";
	const defaultModel = params.defaultModel ?? "gpt-6-astra";
	const resolvedDefault = resolveConfiguredModelRef({
		...params,
		defaultProvider,
		defaultModel
	});
	const aliasIndex = params.aliasIndex ?? buildModelAliasIndex({
		...params,
		defaultProvider
	});
	const entriesByKey = /* @__PURE__ */ new Map();
	const addEntry = (ref, tag) => {
		const canonicalRef = params.canonicalizeRef?.(ref) ?? ref;
		const key = modelKey(canonicalRef.provider, canonicalRef.model);
		const originalKey = modelKey(ref.provider, ref.model);
		const existing = entriesByKey.get(key);
		const aliases = [
			...existing?.aliases ?? [],
			...aliasIndex.byKey.get(key) ?? [],
			...originalKey === key ? [] : aliasIndex.byKey.get(originalKey) ?? []
		];
		const aliasDisabled = existing?.aliasDisabled === true || aliasIndex.disabledKeys?.has(key) === true || aliasIndex.disabledKeys?.has(originalKey) === true;
		if (existing) {
			existing.tags.add(tag);
			existing.aliases = [...new Set(aliases)];
			existing.aliasDisabled = aliasDisabled;
			return existing;
		}
		const entry = {
			key,
			ref: canonicalRef,
			tags: /* @__PURE__ */ new Set([tag]),
			aliases: [...new Set(aliases)],
			aliasDisabled
		};
		entriesByKey.set(key, entry);
		return entry;
	};
	const addRaw = (raw, tag) => {
		const trimmed = raw.trim();
		const inferredProvider = trimmed.includes("/") ? void 0 : inferUniqueProviderFromConfiguredModels({
			cfg: params.cfg,
			agentId: params.agentId,
			model: trimmed,
			allowManifestNormalization: params.allowManifestNormalization,
			manifestPlugins: params.manifestPlugins
		});
		const resolved = resolveModelRefFromString({
			...params,
			raw,
			defaultProvider: inferredProvider ?? defaultProvider,
			aliasIndex
		});
		return resolved ? addEntry(resolved.ref, tag) : void 0;
	};
	addEntry(resolvedDefault, "default");
	resolveConfiguredModelFallbacks({
		cfg: params.cfg,
		agentId: params.agentId
	}).forEach((raw, index) => addRaw(raw, `fallback#${index + 1}`));
	const imageModel = params.cfg.agents?.defaults?.imageModel;
	const imagePrimary = resolveAgentModelPrimaryValue(imageModel);
	if (imagePrimary) addRaw(imagePrimary, "image");
	resolveAgentModelFallbackValues(imageModel).forEach((raw, index) => addRaw(raw, `img-fallback#${index + 1}`));
	const agentModels = params.agentId ? resolveAgentConfig(params.cfg, params.agentId)?.models : void 0;
	const configuredRefs = /* @__PURE__ */ new Map();
	for (const models of [params.cfg.agents?.defaults?.models, agentModels]) for (const [raw, settings] of Object.entries(models ?? {})) if (!raw.trim().endsWith("/*")) configuredRefs.set(raw, settings.pickerRuntimes ?? configuredRefs.get(raw));
	for (const [raw, pickerRuntimes] of configuredRefs) {
		const entry = addRaw(raw, "configured");
		if (entry && pickerRuntimes !== void 0) entry.pickerRuntimes = [...new Set(pickerRuntimes)];
	}
	return {
		defaultRef: resolvedDefault,
		entries: [...entriesByKey.values()],
		byKey: entriesByKey
	};
}
//#endregion
export { resolveConfiguredModelEntries as t };
