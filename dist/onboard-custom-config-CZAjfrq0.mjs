import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isSecretRef } from "./ref-contract-D0kWy5jy.mjs";
import "./types.secrets-DsPRn9Dz.mjs";
import { r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import { a as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-KBg0y299.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { i as buildModelAliasIndex } from "./model-selection-shared-BZeDVoch.mjs";
import { n as isHttpUrl } from "./url-protocol-OU3K-ySz.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import "./model-selection-C1qxt1eY.mjs";
import "./context-window-guard-CdJSElvf.mjs";
import { t as applyPrimaryModel } from "./provider-model-primary-CBQXA_V3.mjs";
import { t as applyAgentModelDefaults } from "./onboard-agent-target-DdbF_syb.mjs";
import { t as normalizeAlias } from "./alias-name-dY2or4SK.mjs";
//#region src/commands/onboard-custom-config.ts
/**
* Wizard default for non-Azure custom APIs when context length is unknown.
* Mirrors the generic persisted custom-model catalog fallback and leaves enough
* room above the default compaction reserve floor in `agent-settings.ts`.
*/
const CUSTOM_PROVIDER_DEFAULT_CONTEXT_WINDOW_TOKENS = 128e3;
const DEFAULT_MAX_TOKENS = 4096;
const AZURE_DEFAULT_CONTEXT_WINDOW = 4e5;
const AZURE_DEFAULT_MAX_TOKENS = 16384;
function normalizeContextWindowForCustomModel(value) {
	const parsed = typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : 0;
	return parsed > 4e3 ? parsed : CUSTOM_PROVIDER_DEFAULT_CONTEXT_WINDOW_TOKENS;
}
function customModelInputs(supportsImageInput) {
	return supportsImageInput ? ["text", "image"] : ["text"];
}
function resolveCustomModelImageInputInference(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	if (!normalized) return {
		supportsImageInput: false,
		confidence: "unknown"
	};
	if (/\b(?:gpt-4o|gpt-4\.1|gpt-[5-9]|o[134])\b/.test(normalized) || /\bclaude-(?:3|4|sonnet|opus|haiku)\b/.test(normalized) || /\bgemini\b/.test(normalized) || /\b(?:qwen[\w.-]*-?vl|qwen-vl)\b/.test(normalized) || /\b(?:vision|llava|pixtral|internvl|mllama|minicpm-v|glm-4v)\b/.test(normalized) || /(?:^|[-_/])vl(?:[-_/]|$)/.test(normalized)) return {
		supportsImageInput: true,
		confidence: "known"
	};
	if (/\b(?:llama\d*|deepseek|mistral|mixtral|kimi|moonshot|codestral|devstral|phi|qwq|codellama)\b/.test(normalized) || /\bqwen(?!.*(?:vl|vision))/.test(normalized)) return {
		supportsImageInput: false,
		confidence: "known"
	};
	return {
		supportsImageInput: false,
		confidence: "unknown"
	};
}
function isAzureUrl(baseUrl, openAiOnly = false) {
	try {
		const host = new URL(baseUrl).hostname.toLowerCase();
		return host.endsWith(".openai.azure.com") || !openAiOnly && host.endsWith(".services.ai.azure.com");
	} catch {
		return false;
	}
}
function transformAzureUrl(baseUrl, modelId) {
	const normalizedUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
	if (normalizedUrl.includes("/openai/deployments/")) return normalizedUrl;
	return `${normalizedUrl}/openai/deployments/${modelId}`;
}
function transformAzureConfigUrl(baseUrl) {
	const normalizedUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
	if (normalizedUrl.endsWith("/openai/v1")) return normalizedUrl;
	const deploymentIdx = normalizedUrl.indexOf("/openai/deployments/");
	return `${deploymentIdx !== -1 ? normalizedUrl.slice(0, deploymentIdx) : normalizedUrl}/openai/v1`;
}
function hasSameHost(a, b) {
	try {
		return normalizeLowercaseStringOrEmpty(new URL(a).hostname) === normalizeLowercaseStringOrEmpty(new URL(b).hostname);
	} catch {
		return false;
	}
}
/** Error class used by callers to turn custom API validation failures into CLI UX. */
var CustomApiError = class extends Error {
	constructor(code, message) {
		super(message);
		this.name = "CustomApiError";
		this.code = code;
	}
};
function normalizeEndpointId(raw) {
	const trimmed = normalizeOptionalLowercaseString(raw);
	if (!trimmed) return "";
	return trimmed.replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}
/** Builds a stable custom provider id from an endpoint URL host and port. */
function buildEndpointIdFromUrl(baseUrl) {
	try {
		const url = new URL(baseUrl);
		return normalizeEndpointId(`custom-${normalizeLowercaseStringOrEmpty(url.hostname.replace(/[^a-z0-9]+/gi, "-"))}${url.port ? `-${url.port}` : ""}`) || "custom";
	} catch {
		return "custom";
	}
}
function resolveUniqueEndpointId(params) {
	const normalized = normalizeEndpointId(params.requestedId) || "custom";
	const existing = params.providers[normalized];
	if (!existing?.baseUrl || existing.baseUrl === params.baseUrl || isAzureUrl(params.baseUrl) && hasSameHost(existing.baseUrl, params.baseUrl)) return {
		providerId: normalized,
		renamed: false
	};
	let suffix = 2;
	let candidate = `${normalized}-${suffix}`;
	while (params.providers[candidate]) {
		suffix += 1;
		candidate = `${normalized}-${suffix}`;
	}
	return {
		providerId: candidate,
		renamed: true
	};
}
function configuredAliasModelKey(ref, manifestPlugins) {
	return modelKey(ref.provider, normalizeConfiguredProviderCatalogModelId(ref.provider, ref.model, { manifestPlugins }));
}
function resolveCustomModelAliasError(params) {
	const trimmed = params.raw.trim();
	if (!trimmed) return;
	let normalized;
	try {
		normalized = normalizeAlias(trimmed);
	} catch (err) {
		return err instanceof Error ? err.message : "Alias is invalid.";
	}
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER,
		agentId: params.agentId,
		manifestPlugins: params.manifestPlugins,
		allowPluginNormalization: false
	});
	const aliasKey = normalizeLowercaseStringOrEmpty(normalized);
	const existing = aliasIndex.byAlias.get(aliasKey);
	if (!existing) return;
	const existingKey = modelKey(existing.ref.provider, existing.ref.model);
	if (configuredAliasModelKey(existing.ref, params.manifestPlugins) === configuredAliasModelKey(params.modelRef, params.manifestPlugins)) return;
	return `Alias ${normalized} already points to ${existingKey}.`;
}
/** Normalizes optional provider API key input while preserving secret refs. */
function normalizeOptionalProviderApiKey(value) {
	if (isSecretRef(value)) return value;
	return normalizeOptionalSecretInput(value);
}
function resolveVerificationEndpoint(params) {
	const resolvedUrl = isAzureUrl(params.baseUrl) ? transformAzureUrl(params.baseUrl, params.modelId) : params.baseUrl;
	const endpointUrl = new URL(params.endpointPath, resolvedUrl.endsWith("/") ? resolvedUrl : `${resolvedUrl}/`);
	if (isAzureUrl(params.baseUrl)) endpointUrl.searchParams.set("api-version", "2024-10-21");
	return endpointUrl.href;
}
/** Builds a minimal OpenAI-family request used only to verify custom endpoints. */
function buildOpenAiVerificationProbeRequest(params) {
	const isBaseUrlAzureUrl = isAzureUrl(params.baseUrl);
	const headers = params.apiKey ? isBaseUrlAzureUrl ? { "api-key": params.apiKey } : { Authorization: `Bearer ${params.apiKey}` } : {};
	if (isAzureUrl(params.baseUrl, true) || params.responsesApi === true) return {
		endpoint: new URL("responses", (isBaseUrlAzureUrl ? transformAzureConfigUrl(params.baseUrl) : params.baseUrl).replace(/\/?$/, "/")).href,
		headers,
		body: {
			model: params.modelId,
			input: "Hi",
			max_output_tokens: 16,
			stream: false
		}
	};
	return {
		endpoint: resolveVerificationEndpoint({
			baseUrl: params.baseUrl,
			modelId: params.modelId,
			endpointPath: "chat/completions"
		}),
		headers,
		body: {
			model: params.modelId,
			messages: [{
				role: "user",
				content: "Hi"
			}],
			max_tokens: 16,
			stream: false
		}
	};
}
/** Builds a minimal Anthropic-compatible request used only to verify endpoints. */
function buildAnthropicVerificationProbeRequest(params) {
	return {
		endpoint: resolveVerificationEndpoint({
			baseUrl: /\/v1\/?$/.test(params.baseUrl.trim()) ? params.baseUrl.trim() : params.baseUrl.trim().replace(/\/?$/, "") + "/v1",
			modelId: params.modelId,
			endpointPath: "messages"
		}),
		headers: {
			"anthropic-version": "2023-06-01",
			...params.apiKey ? { "x-api-key": params.apiKey } : {}
		},
		body: {
			model: params.modelId,
			max_tokens: 1,
			messages: [{
				role: "user",
				content: "Hi"
			}],
			stream: false
		}
	};
}
function resolveProviderApi(compatibility) {
	if (compatibility === "anthropic") return "anthropic-messages";
	return compatibility === "openai-responses" ? "openai-responses" : "openai-completions";
}
function parseCustomApiCompatibility(raw) {
	const compatibilityRaw = normalizeOptionalLowercaseString(raw);
	if (!compatibilityRaw) return "openai";
	if (compatibilityRaw !== "openai" && compatibilityRaw !== "openai-responses" && compatibilityRaw !== "anthropic") throw new CustomApiError("invalid_compatibility", "Invalid --custom-compatibility (use \"openai\", \"openai-responses\", or \"anthropic\").");
	return compatibilityRaw;
}
function resolveCustomProviderId(params) {
	const providers = params.config.models?.providers ?? {};
	const baseUrl = params.baseUrl.trim();
	const explicitProviderId = params.providerId?.trim();
	if (explicitProviderId && !normalizeEndpointId(explicitProviderId)) throw new CustomApiError("invalid_provider_id", "Custom provider ID must include letters, numbers, or hyphens.");
	const requestedProviderId = explicitProviderId || buildEndpointIdFromUrl(baseUrl);
	const providerIdResult = resolveUniqueEndpointId({
		requestedId: requestedProviderId,
		baseUrl,
		providers
	});
	return {
		providerId: providerIdResult.providerId,
		...providerIdResult.renamed ? { providerIdRenamedFrom: normalizeEndpointId(requestedProviderId) || "custom" } : {}
	};
}
function parseNonInteractiveCustomApiFlags(params) {
	const baseUrl = normalizeOptionalString(params.baseUrl) ?? "";
	const modelId = normalizeOptionalString(params.modelId) ?? "";
	if (!baseUrl || !modelId) throw new CustomApiError("missing_required", ["Auth choice \"custom-api-key\" requires a base URL and model ID.", "Use --custom-base-url and --custom-model-id."].join("\n"));
	const apiKey = normalizeOptionalString(params.apiKey);
	const providerId = normalizeOptionalString(params.providerId);
	if (providerId && !normalizeEndpointId(providerId)) throw new CustomApiError("invalid_provider_id", "Custom provider ID must include letters, numbers, or hyphens.");
	return {
		baseUrl,
		modelId,
		compatibility: parseCustomApiCompatibility(params.compatibility),
		...apiKey ? { apiKey } : {},
		...providerId ? { providerId } : {},
		...params.supportsImageInput === void 0 ? {} : { supportsImageInput: params.supportsImageInput }
	};
}
/** Applies custom provider config and optionally makes its model the primary model. */
function applyCustomApiConfig(params) {
	const baseUrl = normalizeOptionalString(params.baseUrl) ?? "";
	if (!isHttpUrl(baseUrl)) throw new CustomApiError("invalid_base_url", "Custom provider base URL must be a valid HTTP or HTTPS URL.");
	if (params.compatibility !== "openai" && params.compatibility !== "openai-responses" && params.compatibility !== "anthropic") throw new CustomApiError("invalid_compatibility", "Custom provider compatibility must be \"openai\", \"openai-responses\", or \"anthropic\".");
	const modelId = normalizeOptionalString(params.modelId) ?? "";
	if (!modelId) throw new CustomApiError("invalid_model_id", "Custom provider model ID is required.");
	const isAzure = isAzureUrl(baseUrl);
	const isAzureOpenAi = isAzureUrl(baseUrl, true);
	const resolvedBaseUrl = isAzure ? transformAzureConfigUrl(baseUrl) : baseUrl;
	const providerIdResult = resolveCustomProviderId({
		config: params.config,
		baseUrl: resolvedBaseUrl,
		providerId: params.providerId
	});
	const providerId = providerIdResult.providerId;
	const providers = params.config.models?.providers ?? {};
	const modelRef = modelKey(providerId, modelId);
	const alias = normalizeOptionalString(params.alias) ?? "";
	const aliasError = resolveCustomModelAliasError({
		raw: alias,
		cfg: params.config,
		modelRef: {
			provider: providerId,
			model: modelId
		},
		manifestPlugins: params.manifestPlugins ?? [],
		agentId: params.target?.agentId
	});
	if (aliasError) throw new CustomApiError("invalid_alias", aliasError);
	const existingProvider = providers[providerId];
	const existingModels = Array.isArray(existingProvider?.models) ? existingProvider.models : [];
	const hasModel = existingModels.some((model) => model.id === modelId);
	const isLikelyReasoningModel = isAzure && /\b(o[134]|gpt-([5-9]|\d{2,}))\b/i.test(modelId);
	const explicitInput = params.supportsImageInput === void 0 ? void 0 : customModelInputs(params.supportsImageInput);
	const generatedInput = explicitInput ?? customModelInputs(isAzure ? isLikelyReasoningModel : resolveCustomModelImageInputInference(modelId).supportsImageInput);
	const nextModel = {
		id: modelId,
		name: `${modelId} (Custom Provider)`,
		contextWindow: isAzure ? AZURE_DEFAULT_CONTEXT_WINDOW : CUSTOM_PROVIDER_DEFAULT_CONTEXT_WINDOW_TOKENS,
		maxTokens: isAzure ? AZURE_DEFAULT_MAX_TOKENS : DEFAULT_MAX_TOKENS,
		input: generatedInput,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		reasoning: isLikelyReasoningModel,
		...isAzure ? { compat: { supportsStore: false } } : {}
	};
	const mergedModels = hasModel ? existingModels.map((model) => model.id === modelId ? {
		...model,
		...isAzure ? nextModel : {},
		...explicitInput ? { input: explicitInput } : {},
		name: model.name ?? nextModel.name,
		cost: model.cost ?? nextModel.cost,
		contextWindow: normalizeContextWindowForCustomModel(model.contextWindow),
		maxTokens: model.maxTokens ?? nextModel.maxTokens
	} : model) : [...existingModels, nextModel];
	const { apiKey: existingApiKey, ...existingProviderRest } = existingProvider ?? {};
	const normalizedApiKey = normalizeOptionalProviderApiKey(params.apiKey) ?? normalizeOptionalProviderApiKey(existingApiKey);
	const providerApi = isAzureOpenAi ? "azure-openai-responses" : resolveProviderApi(params.compatibility);
	const azureHeaders = isAzure && normalizedApiKey ? { "api-key": normalizedApiKey } : void 0;
	const config = {
		...params.config,
		models: {
			...params.config.models,
			mode: params.config.models?.mode ?? "merge",
			providers: {
				...providers,
				[providerId]: {
					...existingProviderRest,
					baseUrl: resolvedBaseUrl,
					api: providerApi,
					...normalizedApiKey ? { apiKey: normalizedApiKey } : {},
					...isAzure ? { authHeader: false } : {},
					...azureHeaders ? { headers: azureHeaders } : {},
					models: mergedModels
				}
			}
		}
	};
	const applyModelDefaults = (modelConfig) => {
		const updated = params.setAsPrimary === false ? modelConfig : applyPrimaryModel(modelConfig, modelRef);
		const existingModelConfig = updated.agents?.defaults?.models?.[modelRef];
		const seedThinking = isLikelyReasoningModel && !existingModelConfig?.params?.thinking;
		if (!seedThinking && !alias) return updated;
		return {
			...updated,
			agents: {
				...updated.agents,
				defaults: {
					...updated.agents?.defaults,
					models: {
						...updated.agents?.defaults?.models,
						[modelRef]: {
							...existingModelConfig,
							...seedThinking ? { params: {
								...existingModelConfig?.params,
								thinking: "medium"
							} } : {},
							...alias ? { alias } : {}
						}
					}
				}
			}
		};
	};
	return {
		config: params.target && params.config.agents?.ownership === "explicit" ? applyAgentModelDefaults(config, params.target, applyModelDefaults) : applyModelDefaults(config),
		providerId,
		modelId,
		...providerIdResult.providerIdRenamedFrom ? { providerIdRenamedFrom: providerIdResult.providerIdRenamedFrom } : {}
	};
}
//#endregion
export { buildOpenAiVerificationProbeRequest as a, parseNonInteractiveCustomApiFlags as c, resolveCustomProviderId as d, buildEndpointIdFromUrl as i, resolveCustomModelAliasError as l, applyCustomApiConfig as n, normalizeEndpointId as o, buildAnthropicVerificationProbeRequest as r, normalizeOptionalProviderApiKey as s, CustomApiError as t, resolveCustomModelImageInputInference as u };
