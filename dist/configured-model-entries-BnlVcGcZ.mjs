import "./model-ref-shared-BRJ3VRZV.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { P as collectConfiguredModelRefs } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { r as listAgentEntriesWithSource } from "./agent-roster-gkYP38su.mjs";
import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import { i as DEFAULT_PROVIDER } from "./defaults-Bg930vxE.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { c as inferUniqueProviderFromConfiguredModels, h as resolveConfiguredModelRef, i as buildModelAliasIndex, y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { n as resolveConfiguredModelFallbacks } from "./model-selection-resolve-B4Z5ZIMD.mjs";
//#region src/agents/configured-model-entries.ts
/** Projects effective configured model refs, aliases, and role tags for one agent. */
/** Resolve authored refs once at discovery; providers own server membership and aliases. */
function collectConfiguredCatalogModels(cfg) {
	const models = /* @__PURE__ */ new Map();
	for (const [providerId, providerConfig] of Object.entries(cfg.models?.providers ?? {})) {
		const provider = normalizeProviderId(providerId);
		for (const model of providerConfig.models ?? []) models.set(modelKey(provider, model.id), {
			provider,
			modelId: model.id,
			baseUrl: model.baseUrl ?? providerConfig.baseUrl
		});
	}
	const agents = listAgentEntriesWithSource(cfg).map(({ entry, source }) => ({
		agentId: entry.id,
		prefix: source.kind === "entries" ? `agents.entries.${source.key}.` : `agents.list.${source.index}.`
	}));
	const aliases = /* @__PURE__ */ new Map();
	for (const { path, value, kind } of collectConfiguredModelRefs(cfg)) {
		if (value.endsWith("/*")) continue;
		const agentId = agents.find(({ prefix }) => path.startsWith(prefix))?.agentId;
		const params = {
			cfg,
			agentId,
			defaultProvider: DEFAULT_PROVIDER,
			allowManifestNormalization: false,
			allowPluginNormalization: false
		};
		let aliasIndex = aliases.get(agentId);
		if (!aliasIndex) {
			aliasIndex = buildModelAliasIndex(params);
			aliases.set(agentId, aliasIndex);
		}
		const literal = kind === "literal" ? parseModelCatalogRef(value) : null;
		const ref = literal ? {
			provider: literal.provider,
			model: literal.modelId
		} : resolveModelRefFromString({
			...params,
			raw: value,
			defaultProvider: inferUniqueProviderFromConfiguredModels({
				...params,
				model: value
			}) ?? "openai",
			...kind === "selector" ? { aliasIndex } : {}
		})?.ref;
		if (ref && !models.has(modelKey(ref.provider, ref.model))) models.set(modelKey(ref.provider, ref.model), {
			provider: ref.provider,
			modelId: ref.model,
			baseUrl: cfg.models?.providers?.[ref.provider]?.baseUrl
		});
	}
	return [...models.values()];
}
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
		const entry = entriesByKey.get(key) ?? {
			key,
			ref: canonicalRef,
			tags: /* @__PURE__ */ new Set(),
			aliases: [],
			aliasDisabled: false
		};
		entry.tags.add(tag);
		entry.aliases = [.../* @__PURE__ */ new Set([
			...entry.aliases,
			...aliasIndex.byKey.get(key) ?? [],
			...originalKey === key ? [] : aliasIndex.byKey.get(originalKey) ?? []
		])];
		entry.aliasDisabled = entry.aliasDisabled || aliasIndex.disabledKeys?.has(key) === true || aliasIndex.disabledKeys?.has(originalKey) === true;
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
export { resolveConfiguredModelEntries as n, collectConfiguredCatalogModels as t };
