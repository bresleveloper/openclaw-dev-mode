import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { n as normalizeGooglePreviewModelId, r as normalizeTogetherModelId } from "./provider-model-id-normalize-DODOj1rv.mjs";
//#region packages/model-catalog-core/src/provider-model-id-normalization.ts
let currentManifestModelIdNormalizationPolicies;
/** Collect provider model-id normalization policies from plugin manifests. */
function collectManifestModelIdNormalizationPolicies(plugins) {
	const policies = /* @__PURE__ */ new Map();
	for (const plugin of plugins) for (const [provider, policy] of Object.entries(plugin.modelIdNormalization?.providers ?? {})) policies.set(normalizeLowercaseStringOrEmpty(provider), policy);
	return policies;
}
/** Replace the process-local manifest normalization policy snapshot. */
function setCurrentManifestModelIdNormalizationPolicies(policies) {
	currentManifestModelIdNormalizationPolicies = policies;
}
/** Return true when a model id already includes a provider namespace. */
function hasProviderPrefix(modelId) {
	return modelId.includes("/");
}
/** Join a provider prefix and model id with exactly one slash. */
function formatPrefixedModelId(prefix, modelId) {
	return `${prefix.replace(/\/+$/u, "")}/${modelId.replace(/^\/+/u, "")}`;
}
/** Strip a duplicated self-provider prefix from a model id. */
function stripSelfProviderModelPrefix(provider, model) {
	const prefix = `${normalizeLowercaseStringOrEmpty(provider)}/`;
	const trimmed = model.trim();
	return normalizeLowercaseStringOrEmpty(trimmed).startsWith(prefix) ? trimmed.slice(prefix.length) : model;
}
/** Apply manifest normalization policies for one provider/model id. */
function normalizeProviderModelIdWithPolicies(params) {
	const policy = params.policies.get(normalizeLowercaseStringOrEmpty(params.provider));
	if (!policy) return;
	let modelId = params.context.modelId.trim();
	if (!modelId) return modelId;
	for (const prefix of policy.stripPrefixes ?? []) {
		const normalizedPrefix = normalizeLowercaseStringOrEmpty(prefix);
		if (normalizedPrefix && normalizeLowercaseStringOrEmpty(modelId).startsWith(normalizedPrefix)) {
			modelId = modelId.slice(normalizedPrefix.length);
			break;
		}
	}
	modelId = policy.aliases?.[normalizeLowercaseStringOrEmpty(modelId)] ?? modelId;
	if (!hasProviderPrefix(modelId)) {
		for (const rule of policy.prefixWhenBareAfterAliasStartsWith ?? []) if (normalizeLowercaseStringOrEmpty(modelId).startsWith(rule.modelPrefix.toLowerCase())) return formatPrefixedModelId(rule.prefix, modelId);
		if (policy.prefixWhenBare) return formatPrefixedModelId(policy.prefixWhenBare, modelId);
	}
	return modelId;
}
/** Apply built-in provider-specific model id normalization rules. */
function normalizeBuiltInProviderModelId(provider, model) {
	const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
	if (normalizedProvider === "google" || normalizedProvider === "google-gemini-cli" || normalizedProvider === "google-vertex") return normalizeGooglePreviewModelId(model);
	if (normalizedProvider === "openrouter" || normalizedProvider === "nvidia") {
		const trimmed = model.trim();
		return trimmed && !trimmed.includes("/") ? `${normalizedProvider}/${trimmed}` : model;
	}
	if (normalizedProvider === "anthropic") {
		const anthropicAliases = {
			fable: "claude-fable-5-1",
			"fable-5": "claude-fable-5",
			"fable-5.1": "claude-fable-5-1",
			"fable-5-1": "claude-fable-5-1",
			haiku: "claude-haiku-4-5",
			"opus-5.5": "claude-opus-5-5",
			"opus-5-5": "claude-opus-5-5",
			"opus-5": "claude-opus-5",
			opus: "claude-opus-5",
			"opus-4.8": "claude-opus-4-8",
			"opus-4.7": "claude-opus-4-7",
			"opus-4.6": "claude-opus-4-6",
			"mythos-5": "claude-mythos-5",
			"sonnet-5": "claude-sonnet-5",
			sonnet: "claude-sonnet-5",
			"sonnet-4.6": "claude-sonnet-4-6"
		};
		const providerModel = stripSelfProviderModelPrefix(normalizedProvider, model);
		return anthropicAliases[normalizeLowercaseStringOrEmpty(providerModel)] ?? providerModel;
	}
	if (normalizedProvider === "vercel-ai-gateway") {
		const aliased = {
			"opus-4.6": "claude-opus-4-6",
			"sonnet-5": "claude-sonnet-5",
			sonnet: "claude-sonnet-4-6",
			"sonnet-4.6": "claude-sonnet-4-6"
		}[normalizeLowercaseStringOrEmpty(model)] ?? model;
		return normalizeLowercaseStringOrEmpty(aliased).startsWith("claude-") ? `anthropic/${aliased}` : aliased;
	}
	if (normalizedProvider === "huggingface") return normalizeLowercaseStringOrEmpty(model).startsWith("huggingface/") ? model.slice(12) : model;
	if (normalizedProvider === "xai") return {
		"grok-4.3-latest": "grok-4.3",
		"grok-4.5-latest": "grok-4.5",
		"grok-build-latest": "grok-4.5",
		"grok-4-fast-reasoning": "grok-4-fast",
		"grok-4-1-fast-reasoning": "grok-4-1-fast"
	}[normalizeLowercaseStringOrEmpty(model)] ?? model;
	if (normalizedProvider === "together") return normalizeTogetherModelId(model);
	return model;
}
/** Apply manifest policies and built-in normalization to a static provider/model id. */
function normalizeStaticProviderModelIdWithPolicies(provider, model, policies) {
	const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
	return normalizeBuiltInProviderModelId(normalizedProvider, policies ? normalizeProviderModelIdWithPolicies({
		provider: normalizedProvider,
		policies,
		context: { modelId: model }
	}) ?? model : model);
}
/** Normalize a configured provider/model catalog reference using current policies. */
function normalizeConfiguredProviderCatalogModelId(provider, model, policies = currentManifestModelIdNormalizationPolicies) {
	return normalizeConfiguredProviderCatalogModelRef(normalizeStaticProviderModelIdWithPolicies(provider, model, policies));
}
/** Normalize embedded Google model aliases inside provider/model catalog refs. */
function normalizeConfiguredProviderCatalogModelRef(providerModel) {
	const googlePrefix = "google/";
	if (!providerModel.startsWith(googlePrefix)) {
		const parsed = parseModelCatalogRef(providerModel);
		if (!parsed) return providerModel;
		if (!parsed.modelId.startsWith(googlePrefix)) return providerModel;
		const normalizedModelId = normalizeGooglePreviewModelId(parsed.modelId);
		return normalizedModelId === parsed.modelId ? providerModel : `${parsed.provider}/${normalizedModelId}`;
	}
	const modelId = providerModel.slice(7);
	const normalizedModelId = normalizeGooglePreviewModelId(modelId);
	return normalizedModelId === modelId ? providerModel : `${googlePrefix}${normalizedModelId}`;
}
//#endregion
export { normalizeStaticProviderModelIdWithPolicies as a, normalizeConfiguredProviderCatalogModelRef as i, normalizeBuiltInProviderModelId as n, setCurrentManifestModelIdNormalizationPolicies as o, normalizeConfiguredProviderCatalogModelId as r, stripSelfProviderModelPrefix as s, collectManifestModelIdNormalizationPolicies as t };
