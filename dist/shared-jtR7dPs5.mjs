import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { b as supportsClaudeAdaptiveThinking, u as resolveClaudeFable5ModelIdentity, w as supportsClaudeNativeXhighEffort } from "./anthropic-B3HirzdP.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { n as buildApiKeyCredential } from "./provider-auth-helpers-olPFvVdo.mjs";
import "./provider-model-shared-B_4afNJ5.mjs";
import "./provider-auth-JCvgbsWg.mjs";
//#region extensions/microsoft-foundry/shared.ts
const PROVIDER_ID = "microsoft-foundry";
const DEFAULT_API = "openai-completions";
const DEFAULT_GPT5_API = "openai-responses";
const ANTHROPIC_MESSAGES_API = "anthropic-messages";
const COGNITIVE_SERVICES_RESOURCE = "https://cognitiveservices.azure.com";
const FOUNDRY_ANTHROPIC_SCOPE = "https://ai.azure.com/.default";
const TOKEN_REFRESH_MARGIN_MS = 3e5;
function normalizeModelInput(input) {
	const normalized = Array.isArray(input) ? input.filter((item) => item === "text" || item === "image") : [];
	return normalized.length > 0 ? normalized : ["text"];
}
function isAnthropicFoundryDeployment(modelName) {
	const normalized = normalizeOptionalLowercaseString(modelName);
	return normalized ? normalized.startsWith("claude") : false;
}
function matchesFoundryOpenAIFamily(normalized, gptPrefix) {
	return normalized !== void 0 && (normalized.startsWith(gptPrefix) || normalized.startsWith("o1") || normalized.startsWith("o3") || normalized.startsWith("o4"));
}
function usesFoundryResponsesByDefault(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return matchesFoundryOpenAIFamily(normalized, "gpt-") || normalized?.startsWith("deepseek-v4") === true || normalized === "computer-use-preview";
}
function isFoundryMaiImageModel(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return false;
	return normalized === "mai-image-2.5-flash" || normalized === "mai-image-2.5" || normalized === "mai-image-2e" || normalized === "mai-image-2" || normalized === "mai-image-2-efficient";
}
function supportsFoundryReasoningContent(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized === "mai-ds-r1" || normalized === "mai-thinking-1";
}
function supportsFoundryImageInput(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return isAnthropicFoundryDeployment(normalized) || matchesFoundryOpenAIFamily(normalized, "gpt-") || normalized === "computer-use-preview";
}
function requiresFoundryEntraIdClaudeAuth(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized ? normalized === "claude-mythos-preview" || normalized.startsWith("claude-mythos-") : false;
}
function requiresFoundryMandatoryAdaptiveClaudeThinking(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized ? resolveClaudeFable5ModelIdentity({ id: normalized }) !== void 0 || normalized === "claude-mythos-preview" || normalized.startsWith("claude-mythos-") : false;
}
function supportsFoundryManualClaudeThinking(value) {
	const normalized = normalizeOptionalLowercaseString(value)?.replace(/\./g, "-");
	return normalized ? /(?:^|-)claude-(?:opus-4-(?:1|5)|sonnet-4-5|haiku-4-5)(?=$|[^a-z0-9])/.test(normalized) : false;
}
function resolveFoundryOpenAIModelTokenLimits(normalized) {
	if (!normalized) return;
	if (/^gpt-5\.(?:4(?:-pro)?|5|6(?:-(?:sol|terra|luna))?)$/u.test(normalized)) return {
		contextWindow: 105e4,
		maxTokens: 128e3
	};
	if (/^(?:gpt-5(?:-(?:mini|nano|codex|pro))?|gpt-5\.(?:1(?:-codex(?:-(?:mini|max))?)?|2(?:-codex)?|3-codex|4-(?:mini|nano)))$/u.test(normalized)) return {
		contextWindow: 4e5,
		maxTokens: 128e3
	};
}
function resolveFoundryModelTokenLimits(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	const normalizedVersion = normalized?.replace(/\./g, "-");
	const foundryOpenAILimits = resolveFoundryOpenAIModelTokenLimits(normalized);
	if (foundryOpenAILimits) return foundryOpenAILimits;
	if (normalized && (supportsClaudeAdaptiveThinking({ id: normalized }) || requiresFoundryMandatoryAdaptiveClaudeThinking(normalized))) return {
		contextWindow: 1e6,
		maxTokens: 128e3
	};
	if (normalizedVersion === "claude-opus-4-5" || normalizedVersion === "claude-sonnet-4-5" || normalizedVersion === "claude-haiku-4-5") return {
		contextWindow: 2e5,
		maxTokens: 64e3
	};
	if (normalizedVersion === "claude-opus-4-1") return {
		contextWindow: 2e5,
		maxTokens: 32e3
	};
	if (normalized === "mai-ds-r1") return {
		contextWindow: 163840,
		maxTokens: 163840
	};
	return {
		contextWindow: 128e3,
		maxTokens: 16384
	};
}
function requiresFoundryMaxCompletionTokens(value) {
	return matchesFoundryOpenAIFamily(normalizeOptionalLowercaseString(value), "gpt-5");
}
function supportsFoundryReasoningEffort(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized || /^gpt-5-chat(?:-|$)/u.test(normalized) || /^o1-mini(?:-|$)/u.test(normalized)) return false;
	return requiresFoundryMaxCompletionTokens(normalized);
}
function resolveFoundryReasoningEfforts(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized || !supportsFoundryReasoningEffort(normalized)) return;
	if (normalized === "gpt-5.1-codex-max") return [
		"none",
		"medium",
		"high",
		"xhigh"
	];
	if (normalized === "gpt-5-pro") return ["high"];
	if (/^gpt-5\.[2-9](?:\.|-|$)/u.test(normalized) || /^gpt-5\.1(?:-|$)/u.test(normalized)) return [
		"none",
		"low",
		"medium",
		"high"
	];
	if (/^gpt-5-codex(?:-|$)/u.test(normalized)) return [
		"low",
		"medium",
		"high"
	];
	if (/^gpt-5(?:-|$)/u.test(normalized)) return [
		"minimal",
		"low",
		"medium",
		"high"
	];
	return [
		"low",
		"medium",
		"high"
	];
}
function buildFoundryThinkingLevelMap(efforts) {
	const supported = new Set(efforts);
	return {
		off: supported.has("none") ? "none" : null,
		minimal: supported.has("minimal") ? "minimal" : null,
		low: supported.has("low") ? "low" : null,
		medium: supported.has("medium") ? "medium" : null,
		high: supported.has("high") ? "high" : null,
		xhigh: supported.has("xhigh") ? "xhigh" : null,
		max: null
	};
}
function isFoundryProviderApi(value) {
	return value === "openai-completions" || value === "openai-responses" || value === "anthropic-messages";
}
function formatFoundryApiLabel(api) {
	return api === "openai-responses" ? "Responses" : api === "anthropic-messages" ? "Anthropic Messages" : "Chat Completions";
}
function normalizeFoundryEndpoint(endpoint) {
	const trimmed = normalizeOptionalString(endpoint) ?? "";
	if (!trimmed) return trimmed;
	const parsed = URL.parse(trimmed);
	if (parsed) {
		const normalizedPath = parsed.pathname.replace(/\/(?:openai|anthropic)(?:$|\/).*/i, "").replace(/\/+$/, "");
		return `${parsed.origin}${normalizedPath && normalizedPath !== "/" ? normalizedPath : ""}`;
	}
	return trimmed.replace(/[?#].*$/, "").replace(/\/+$/, "").replace(/\/(?:openai|anthropic)(?:$|\/).*/i, "");
}
function resolveFoundryApi(modelId, modelNameHint, configuredApi) {
	if (isFoundryProviderApi(configuredApi)) return configuredApi;
	const configuredModelName = resolveConfiguredModelNameHint(modelId, modelNameHint);
	if (isAnthropicFoundryDeployment(configuredModelName)) return ANTHROPIC_MESSAGES_API;
	return usesFoundryResponsesByDefault(configuredModelName) ? DEFAULT_GPT5_API : DEFAULT_API;
}
function buildFoundryProviderBaseUrl(endpoint, modelId, modelNameHint, configuredApi) {
	const resolvedApi = resolveFoundryApi(modelId, modelNameHint, configuredApi);
	const base = normalizeFoundryEndpoint(endpoint);
	const path = resolvedApi === "anthropic-messages" ? "/anthropic" : "/openai/v1";
	return base.endsWith(path) ? base : `${base}${path}`;
}
function extractFoundryEndpoint(baseUrl) {
	const trimmed = normalizeOptionalString(baseUrl);
	if (!trimmed) return;
	const parsed = URL.parse(trimmed);
	if (!parsed || parsed.protocol !== "https:" && parsed.protocol !== "http:") return;
	return normalizeFoundryEndpoint(trimmed) || void 0;
}
function resolveFoundryModelCapabilities(modelId, modelNameHint, configuredApi, existingInput) {
	const modelName = resolveConfiguredModelNameHint(modelId, modelNameHint) ?? modelId;
	const api = resolveFoundryApi(modelId, modelName, configuredApi);
	const normalizedInput = normalizeModelInput(existingInput);
	const supportedReasoningEfforts = resolveFoundryReasoningEfforts(modelName);
	const supportsReasoningEffort = supportsFoundryReasoningEffort(modelName);
	const isAnthropic = api === "anthropic-messages" || isAnthropicFoundryDeployment(modelName);
	const supportsClaudeThinking = isAnthropic && (supportsClaudeAdaptiveThinking({ id: modelName }) || supportsFoundryManualClaudeThinking(modelName) || requiresFoundryMandatoryAdaptiveClaudeThinking(modelName));
	const supportsClaudeXhighThinking = isAnthropic && supportsClaudeNativeXhighEffort({ id: modelName });
	const tokenLimits = resolveFoundryModelTokenLimits(modelName);
	return {
		modelName,
		api,
		reasoning: supportsClaudeThinking || supportsReasoningEffort || supportsFoundryReasoningContent(modelName),
		...supportsClaudeXhighThinking ? { thinkingLevelMap: {
			xhigh: "xhigh",
			max: "max"
		} } : supportedReasoningEfforts ? { thinkingLevelMap: buildFoundryThinkingLevelMap(supportedReasoningEfforts) } : {},
		input: normalizedInput.includes("image") || supportsFoundryImageInput(modelName) ? ["text", "image"] : normalizedInput,
		contextWindow: tokenLimits.contextWindow,
		maxTokens: tokenLimits.maxTokens,
		compat: api === "anthropic-messages" ? void 0 : {
			...api === "openai-responses" ? { supportsStore: false } : {},
			...api !== "openai-responses" || supportsReasoningEffort ? { supportsReasoningEffort } : {},
			...supportedReasoningEfforts ? { supportedReasoningEfforts } : {},
			maxTokensField: requiresFoundryMaxCompletionTokens(modelName) ? "max_completion_tokens" : "max_tokens"
		}
	};
}
function resolveConfiguredModelNameHint(modelId, modelNameHint) {
	return normalizeOptionalString(modelNameHint) ?? normalizeOptionalString(modelId);
}
function buildFoundryModelConfig(endpoint, modelId, capabilities) {
	return {
		id: modelId,
		name: capabilities.modelName,
		api: capabilities.api,
		baseUrl: buildFoundryProviderBaseUrl(endpoint, modelId, capabilities.modelName, capabilities.api),
		reasoning: capabilities.reasoning,
		...capabilities.thinkingLevelMap ? { thinkingLevelMap: capabilities.thinkingLevelMap } : {},
		params: { canonicalModelId: capabilities.modelName },
		input: capabilities.input,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: capabilities.contextWindow,
		maxTokens: capabilities.maxTokens,
		...capabilities.compat ? { compat: capabilities.compat } : {}
	};
}
function listConfiguredFoundryProfileIds(config) {
	return Object.entries(config.auth?.profiles ?? {}).filter(([, profile]) => profile.provider === PROVIDER_ID).map(([profileId]) => profileId);
}
function buildFoundryAuthResult(params) {
	const selectedDeployment = params.deployments?.find(({ name }) => name === params.modelId);
	const imageDeployment = isFoundryMaiImageModel(resolveConfiguredModelNameHint(params.modelId, selectedDeployment?.modelName ?? params.modelNameHint));
	const resolvedApi = resolveFoundryApi(params.modelId, params.modelNameHint, params.api);
	const deployments = params.deployments?.length ? params.deployments : [{
		name: params.modelId,
		modelName: params.modelNameHint ?? void 0,
		api: resolvedApi
	}];
	const modelName = resolveConfiguredModelNameHint(params.modelId, params.modelNameHint);
	const metadata = {
		authMethod: params.authMethod,
		endpoint: params.endpoint,
		modelId: params.modelId,
		api: resolvedApi,
		...modelName ? { modelName } : {},
		...params.subscriptionId ? { subscriptionId: params.subscriptionId } : {},
		...params.subscriptionName ? { subscriptionName: params.subscriptionName } : {},
		...params.tenantId ? { tenantId: params.tenantId } : {}
	};
	const modelRef = `${PROVIDER_ID}/${params.modelId}`;
	return {
		profiles: [{
			profileId: params.profileId,
			credential: buildApiKeyCredential(PROVIDER_ID, params.apiKey, metadata, params.secretInputMode ? { secretInputMode: params.secretInputMode } : void 0)
		}],
		configPatch: {
			auth: { order: { [PROVIDER_ID]: [params.profileId, ...(params.currentProviderProfileIds ?? []).filter((profileId) => profileId !== params.profileId)] } },
			...imageDeployment ? { agents: { defaults: { mediaModels: { image: { primary: modelRef } } } } } : {},
			models: { providers: { [PROVIDER_ID]: {
				baseUrl: buildFoundryProviderBaseUrl(params.endpoint, params.modelId, params.modelNameHint, resolvedApi),
				api: resolvedApi,
				authHeader: void 0,
				apiKey: void 0,
				headers: void 0,
				models: deployments.map((deployment) => buildFoundryModelConfig(params.endpoint, deployment.name, resolveFoundryModelCapabilities(deployment.name, deployment.modelName, deployment.api ?? resolvedApi)))
			} } },
			...Array.isArray(params.currentPluginsAllow) && params.currentPluginsAllow.length > 0 && !params.currentPluginsAllow.includes("microsoft-foundry") ? { plugins: { allow: [...params.currentPluginsAllow, PROVIDER_ID] } } : {}
		},
		...!imageDeployment ? { defaultModel: modelRef } : {},
		notes: params.notes
	};
}
function resolveFoundryTargetProfileId(config) {
	const profileIds = listConfiguredFoundryProfileIds(config);
	if (profileIds.length === 0) return;
	return config.auth?.order?.["microsoft-foundry"]?.find((profileId) => normalizeOptionalString(profileId)) ?? (profileIds.length === 1 ? profileIds[0] : void 0);
}
//#endregion
export { resolveFoundryTargetProfileId as C, resolveFoundryModelCapabilities as S, requiresFoundryEntraIdClaudeAuth as _, FOUNDRY_ANTHROPIC_SCOPE as a, resolveConfiguredModelNameHint as b, buildFoundryAuthResult as c, extractFoundryEndpoint as d, formatFoundryApiLabel as f, normalizeFoundryEndpoint as g, listConfiguredFoundryProfileIds as h, DEFAULT_GPT5_API as i, buildFoundryModelConfig as l, isFoundryProviderApi as m, COGNITIVE_SERVICES_RESOURCE as n, PROVIDER_ID as o, isFoundryMaiImageModel as p, DEFAULT_API as r, TOKEN_REFRESH_MARGIN_MS as s, ANTHROPIC_MESSAGES_API as t, buildFoundryProviderBaseUrl as u, requiresFoundryMandatoryAdaptiveClaudeThinking as v, usesFoundryResponsesByDefault as w, resolveFoundryApi as x, requiresFoundryMaxCompletionTokens as y };
