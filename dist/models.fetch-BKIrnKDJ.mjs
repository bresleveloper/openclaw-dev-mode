import { F as resolveTimerTimeoutMs, d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { o as hasConfiguredSecretInput } from "./types.secrets-B5xWSzLp.mjs";
import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as resolveConfiguredSecretInputString } from "./resolve-configured-secret-input-string-SF_iuPva.mjs";
import { n as readResponseTextPrefix } from "./http-response-body-DXfezLdR.mjs";
import { f as readProviderJsonArrayFieldResponse, m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { o as isKnownEnvApiKeyMarker, s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import { t as normalizeApiKeyConfig } from "./models-config.providers.secret-helpers-2wGbY1sX.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./response-limit-runtime-Wtkm2X7a.mjs";
import "./number-runtime-CGwowceO.mjs";
import { c as SELF_HOSTED_DEFAULT_MAX_TOKENS, s as SELF_HOSTED_DEFAULT_COST } from "./provider-setup-Be3-VKqw.mjs";
import "./setup-tools-D_Fbo3nn.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./logging-core-PsFqpLw0.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-CYwZwijM.mjs";
import "./provider-http-Dn9NddwC.mjs";
import "./provider-auth-eHeoP8se.mjs";
import { m as LiveModelCatalogHttpError } from "./provider-catalog-live-runtime-8rOzIDOV.mjs";
import "./secret-input-runtime-C01-y7l7.mjs";
import { i as normalizeLmstudioTransportReasoningCompat, n as LMSTUDIO_OPENAI_COMPAT_REASONING_EFFORTS, r as buildLmstudioReasoningEffortMap, t as LMSTUDIO_OPENAI_COMPAT_ENABLED_REASONING_EFFORTS } from "./model-reasoning-BBtIgenw.mjs";
//#region extensions/lmstudio/src/defaults.ts
/** Shared LM Studio defaults used by setup, runtime discovery, and embeddings paths. */
const LMSTUDIO_DEFAULT_BASE_URL = "http://localhost:1234";
const LMSTUDIO_DEFAULT_INFERENCE_BASE_URL = `${LMSTUDIO_DEFAULT_BASE_URL}/v1`;
const LMSTUDIO_DOCKER_HOST_BASE_URL = "http://host.docker.internal:1234";
const LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL = `${LMSTUDIO_DOCKER_HOST_BASE_URL}/v1`;
const LMSTUDIO_DEFAULT_EMBEDDING_MODEL = "text-embedding-nomic-embed-text-v1.5";
const LMSTUDIO_PROVIDER_LABEL = "LM Studio";
const LMSTUDIO_DEFAULT_API_KEY_ENV_VAR = "LM_API_TOKEN";
const LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER = "lmstudio-local";
const LMSTUDIO_MODEL_PLACEHOLDER = "model-key-from-api-v1-models";
const LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH = 64e3;
const LMSTUDIO_DEFAULT_MODEL_ID = "qwen/qwen3.5-9b";
const LMSTUDIO_PROVIDER_ID = "lmstudio";
//#endregion
//#region extensions/lmstudio/src/models.ts
const LMSTUDIO_CONFIGURED_BOOLEAN_COMPAT_FIELDS = [
	"supportsStore",
	"supportsPromptCacheKey",
	"supportsDeveloperRole",
	"supportsReasoningEffort",
	"supportsTemperature",
	"supportsUsageInStreaming",
	"supportsTools",
	"supportsStrictMode",
	"supportsJsonSchemaResponseFormat",
	"requiresStringContent",
	"strictMessageKeys",
	"requiresToolResultName",
	"requiresAssistantAfterToolResult",
	"requiresThinkingAsText",
	"requiresReasoningContentOnAssistantMessages",
	"requiresOpenAiAnthropicToolPayload"
];
const LMSTUDIO_CONFIGURED_THINKING_FORMATS = [
	"openai",
	"openrouter",
	"deepseek",
	"together",
	"qwen",
	"qwen-chat-template",
	"zai"
];
function normalizeReasoningOption(value) {
	if (typeof value !== "string") return null;
	const normalized = value.trim().toLowerCase();
	return normalized.length > 0 ? normalized : null;
}
function isReasoningEnabledOption(value) {
	const normalized = normalizeReasoningOption(value);
	if (!normalized) return false;
	return normalized !== "off";
}
function normalizeReasoningOptions(value) {
	if (!Array.isArray(value)) return [];
	return uniqueStrings(value.flatMap((option) => normalizeReasoningOption(option) ?? []));
}
function isLmstudioBinaryReasoningOptions(allowedOptions) {
	return allowedOptions.some((option) => option === "on") && allowedOptions.every((option) => option === "on" || option === "off");
}
function resolveLmstudioTransportReasoningEfforts(allowedOptions) {
	if (isLmstudioBinaryReasoningOptions(allowedOptions)) return allowedOptions.includes("off") ? [...LMSTUDIO_OPENAI_COMPAT_REASONING_EFFORTS] : [...LMSTUDIO_OPENAI_COMPAT_ENABLED_REASONING_EFFORTS];
	return uniqueStrings(allowedOptions.map((option) => option === "off" ? "none" : option).filter((option) => option !== "on"));
}
function resolveLmstudioReasoningCompat(entry) {
	const supportedReasoningEfforts = resolveLmstudioTransportReasoningEfforts(normalizeReasoningOptions(entry.capabilities?.reasoning?.allowed_options));
	if (!supportedReasoningEfforts.some((option) => option !== "none")) return;
	return {
		supportsReasoningEffort: true,
		supportedReasoningEfforts,
		reasoningEffortMap: buildLmstudioReasoningEffortMap(supportedReasoningEfforts)
	};
}
/**
* Resolves LM Studio reasoning support from capabilities payloads.
* Defaults to false when the server omits reasoning metadata.
*/
function resolveLmstudioReasoningCapability(entry) {
	const reasoning = entry.capabilities?.reasoning;
	if (reasoning === void 0 || reasoning === null) return false;
	const allowedOptions = normalizeReasoningOptions(reasoning.allowed_options);
	if (allowedOptions.length > 0) return allowedOptions.some((option) => isReasoningEnabledOption(option));
	return isReasoningEnabledOption(reasoning.default);
}
/**
* Reads loaded LM Studio instances and returns the largest valid context window.
* Returns null when no usable loaded context is present.
*/
function resolveLoadedContextWindow(entry) {
	const loadedInstances = Array.isArray(entry.loaded_instances) ? entry.loaded_instances : [];
	let contextWindow = null;
	for (const instance of loadedInstances) {
		const normalized = asPositiveSafeInteger(instance?.config?.context_length);
		if (normalized === void 0) continue;
		contextWindow = contextWindow === null ? normalized : Math.max(contextWindow, normalized);
	}
	return contextWindow;
}
function normalizeLmstudioVariantIds(value) {
	if (!Array.isArray(value)) return [];
	return uniqueStrings(value.flatMap((variant) => typeof variant === "string" && variant.trim().length > 0 ? variant.trim() : []));
}
/**
* Resolves LM Studio variant ids back to their loadable model key.
*
* LM Studio exposes quantized variants separately from the canonical `key`, but
* `/api/v1/models/load` expects the key. Exact key matches still win so unusual
* servers that expose a suffix as the real key are preserved.
*/
function resolveLmstudioCanonicalModelKey(params) {
	const modelKey = params.modelKey.trim();
	if (!modelKey) return modelKey;
	const normalizedModelKey = modelKey.toLowerCase();
	for (const entry of params.models) if (entry.key?.trim() === modelKey) return modelKey;
	for (const entry of params.models) {
		const key = entry.key?.trim();
		if (!key) continue;
		const selectedVariant = typeof entry.selected_variant === "string" ? entry.selected_variant.trim() : "";
		const variants = normalizeLmstudioVariantIds(entry.variants);
		if (selectedVariant.toLowerCase() === normalizedModelKey || variants.some((variant) => variant.toLowerCase() === normalizedModelKey)) return key;
	}
	return modelKey;
}
/**
* Normalizes a server path by stripping trailing slash and inference suffixes.
*
* LM Studio users often copy their inference URL (e.g. "http://localhost:1234/v1") instead
* of the server root. This function strips a trailing "/v1" or "/api/v1" so the caller always
* receives a clean root base URL. The expected input is the server root without any API version
* path (e.g. "http://localhost:1234").
*/
function normalizeUrlPath(pathname) {
	const trimmed = pathname.replace(/\/+$/, "");
	if (!trimmed) return "";
	return trimmed.replace(/\/api\/v1$/i, "").replace(/\/v1$/i, "");
}
function hasExplicitHttpScheme(value) {
	return /^https?:\/\//i.test(value);
}
function isLikelyHostBaseUrl(value) {
	return /^(?:localhost|(?:\d{1,3}\.){3}\d{1,3}|[a-z0-9.-]+\.[a-z]{2,}|[^/\s?#]+:\d+)(?:[/?#].*)?$/i.test(value) && !value.startsWith("/");
}
function normalizeConfiguredReasoningEffortMap(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const entries = [];
	for (const [key, mapped] of Object.entries(value)) {
		const normalizedKey = key.trim();
		const normalizedValue = typeof mapped === "string" ? mapped.trim() : "";
		if (normalizedKey && normalizedValue) entries.push([normalizedKey, normalizedValue]);
	}
	const normalized = Object.fromEntries(entries);
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeConfiguredCompatStringList(value) {
	if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string" && entry.length > 0)) return;
	return [...value];
}
function isLmstudioConfiguredThinkingFormat(value) {
	return typeof value === "string" && LMSTUDIO_CONFIGURED_THINKING_FORMATS.some((format) => format === value);
}
function normalizeLmstudioConfiguredCompat(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	const supportedReasoningEfforts = normalizeReasoningOptions(record.supportedReasoningEfforts);
	const reasoningEffortMap = normalizeConfiguredReasoningEffortMap(record.reasoningEffortMap);
	const compat = {};
	for (const key of LMSTUDIO_CONFIGURED_BOOLEAN_COMPAT_FIELDS) {
		const configuredValue = record[key];
		if (typeof configuredValue === "boolean") compat[key] = configuredValue;
	}
	if (record.codeMode === "preferred" || record.codeMode === "capable") compat.codeMode = record.codeMode;
	const visibleReasoningDetailTypes = normalizeConfiguredCompatStringList(record.visibleReasoningDetailTypes);
	if (visibleReasoningDetailTypes) compat.visibleReasoningDetailTypes = visibleReasoningDetailTypes;
	const unsupportedToolSchemaKeywords = normalizeConfiguredCompatStringList(record.unsupportedToolSchemaKeywords);
	if (unsupportedToolSchemaKeywords) compat.unsupportedToolSchemaKeywords = unsupportedToolSchemaKeywords;
	if (record.maxTokensField === "max_completion_tokens" || record.maxTokensField === "max_tokens") compat.maxTokensField = record.maxTokensField;
	if (isLmstudioConfiguredThinkingFormat(record.thinkingFormat)) compat.thinkingFormat = record.thinkingFormat;
	if (typeof record.toolSchemaProfile === "string") compat.toolSchemaProfile = record.toolSchemaProfile;
	if (typeof record.toolCallArgumentsEncoding === "string") compat.toolCallArgumentsEncoding = record.toolCallArgumentsEncoding;
	if (supportedReasoningEfforts.length > 0) compat.supportedReasoningEfforts = supportedReasoningEfforts;
	if (reasoningEffortMap) compat.reasoningEffortMap = reasoningEffortMap;
	return Object.keys(compat).length > 0 ? normalizeLmstudioTransportReasoningCompat(compat) : void 0;
}
function toFetchableLmstudioBaseUrl(value) {
	if (hasExplicitHttpScheme(value) || !isLikelyHostBaseUrl(value)) return value;
	return `http://${value}`;
}
/** Resolves LM Studio server base URL (without /v1 or /api/v1). */
function resolveLmstudioServerBase(configuredBaseUrl) {
	const configured = configuredBaseUrl?.trim();
	const resolved = configured && configured.length > 0 ? configured : LMSTUDIO_DEFAULT_BASE_URL;
	const fetchableBaseUrl = toFetchableLmstudioBaseUrl(resolved);
	try {
		const parsed = new URL(fetchableBaseUrl);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new TypeError(`Unsupported LM Studio protocol: ${parsed.protocol}`);
		const pathname = normalizeUrlPath(parsed.pathname);
		parsed.pathname = pathname.length > 0 ? pathname : "/";
		parsed.search = "";
		parsed.hash = "";
		return parsed.toString().replace(/\/$/, "");
	} catch {
		const normalized = normalizeUrlPath(resolved.replace(/\/+$/, ""));
		return normalized.length > 0 ? normalized : LMSTUDIO_DEFAULT_BASE_URL;
	}
}
/** Resolves LM Studio inference base URL and always appends /v1. */
function resolveLmstudioInferenceBase(configuredBaseUrl) {
	return `${resolveLmstudioServerBase(configuredBaseUrl)}/v1`;
}
/** Canonicalizes persisted LM Studio provider config to the inference base URL form. */
function normalizeLmstudioProviderConfig(provider) {
	const configuredBaseUrl = typeof provider.baseUrl === "string" ? provider.baseUrl.trim() : "";
	if (!configuredBaseUrl) return provider;
	const normalizedBaseUrl = resolveLmstudioInferenceBase(configuredBaseUrl);
	const request = provider.request && typeof provider.request === "object" && !Array.isArray(provider.request) ? provider.request : void 0;
	const requestWithPrivateNetworkDefault = typeof request?.allowPrivateNetwork === "boolean" ? request : {
		...request,
		allowPrivateNetwork: true
	};
	if (normalizedBaseUrl === provider.baseUrl && requestWithPrivateNetworkDefault === provider.request) return provider;
	return {
		...provider,
		baseUrl: normalizedBaseUrl,
		request: requestWithPrivateNetworkDefault
	};
}
function normalizeLmstudioConfiguredCatalogEntry(entry) {
	if (!entry || typeof entry !== "object") return null;
	const record = entry;
	if (typeof record.id !== "string" || record.id.trim().length === 0) return null;
	const id = record.id.trim();
	const name = typeof record.name === "string" && record.name.trim().length > 0 ? record.name : id;
	const contextWindow = asPositiveSafeInteger(record.contextWindow);
	const contextTokens = asPositiveSafeInteger(record.contextTokens);
	const reasoning = typeof record.reasoning === "boolean" ? record.reasoning : void 0;
	const input = Array.isArray(record.input) ? record.input.filter((item) => item === "text" || item === "image" || item === "document") : void 0;
	const compat = normalizeLmstudioConfiguredCompat(record.compat);
	return {
		id,
		name,
		contextWindow,
		contextTokens,
		reasoning,
		input: input && input.length > 0 ? input : void 0,
		compat
	};
}
function normalizeLmstudioConfiguredCatalogEntries(models) {
	if (!Array.isArray(models)) return [];
	return models.map((entry) => normalizeLmstudioConfiguredCatalogEntry(entry)).filter((entry) => entry !== null);
}
function buildLmstudioModelName(model) {
	const tags = [];
	if (model.format === "mlx") tags.push("MLX");
	else if (model.format === "gguf") tags.push("GGUF");
	if (model.vision) tags.push("vision");
	if (model.trainedForToolUse) tags.push("tool-use");
	if (model.loaded) tags.push("loaded");
	if (tags.length === 0) return model.displayName;
	return `${model.displayName} (${tags.join(", ")})`;
}
/**
* Maps a single LM Studio wire entry to its base model fields.
* Returns null for non-LLM entries or entries with no usable key.
*
* Shared by both the setup layer (persists simple names to config) and the
* runtime discovery path (which enriches the name with format/state tags via
* buildLmstudioModelName).
*/
function mapLmstudioWireEntry(entry) {
	if (entry.type !== "llm") return null;
	const id = entry.key?.trim() ?? "";
	if (!id) return null;
	const loadedContextWindow = resolveLoadedContextWindow(entry);
	const contextWindow = asPositiveSafeInteger(entry.max_context_length) ?? null ?? 128e3;
	const effectiveContextWindow = loadedContextWindow ?? contextWindow;
	const contextTokens = loadedContextWindow ?? Math.min(contextWindow, 64e3);
	const rawDisplayName = entry.display_name?.trim();
	const reasoningCompat = resolveLmstudioReasoningCompat(entry);
	const trainedForToolUse = entry.capabilities?.trained_for_tool_use;
	const compat = trainedForToolUse === true ? {
		...reasoningCompat,
		supportsTools: trainedForToolUse
	} : reasoningCompat;
	return {
		id,
		displayName: rawDisplayName && rawDisplayName.length > 0 ? rawDisplayName : id,
		format: entry.format ?? null,
		vision: entry.capabilities?.vision === true,
		trainedForToolUse: entry.capabilities?.trained_for_tool_use === true,
		loaded: loadedContextWindow !== null,
		reasoning: resolveLmstudioReasoningCapability(entry),
		input: entry.capabilities?.vision ? ["text", "image"] : ["text"],
		cost: SELF_HOSTED_DEFAULT_COST,
		compat,
		contextWindow,
		contextTokens,
		maxTokens: Math.max(1, Math.min(effectiveContextWindow, SELF_HOSTED_DEFAULT_MAX_TOKENS))
	};
}
/**
* Maps LM Studio wire models to config entries using plain display names.
* Use this for config persistence where runtime format/state tags are not needed.
* For runtime discovery with enriched names, use discoverLmstudioModels from models.fetch.ts.
*/
function mapLmstudioWireModelsToConfig(models) {
	return models.map((entry) => {
		const base = mapLmstudioWireEntry(entry);
		if (!base) return null;
		return {
			id: base.id,
			name: base.displayName,
			reasoning: base.reasoning,
			input: base.input,
			cost: base.cost,
			...base.compat ? { compat: base.compat } : {},
			contextWindow: base.contextWindow,
			contextTokens: base.contextTokens,
			maxTokens: base.maxTokens
		};
	}).filter((entry) => entry !== null);
}
//#endregion
//#region extensions/lmstudio/src/provider-auth.ts
function hasLmstudioAuthorizationHeader(headers) {
	if (!headers || typeof headers !== "object" || Array.isArray(headers)) return false;
	for (const [headerName, headerValue] of Object.entries(headers)) {
		if (headerName.trim().toLowerCase() !== "authorization") continue;
		if (hasConfiguredSecretInput(headerValue)) return true;
	}
	return false;
}
function resolveLmstudioProviderAuthMode(apiKey) {
	const normalized = normalizeOptionalSecretInput(apiKey);
	if (normalized !== void 0) {
		const trimmed = normalized.trim();
		if (!trimmed || trimmed === "lmstudio-local" || trimmed === "custom-local") return;
		return "api-key";
	}
	return hasConfiguredSecretInput(apiKey) ? "api-key" : void 0;
}
function shouldUseLmstudioApiKeyPlaceholder(params) {
	return params.hasModels && !params.resolvedApiKey && !params.hasAuthorizationHeader;
}
function shouldUseLmstudioSyntheticAuth(providerConfig) {
	return Array.isArray(providerConfig?.models) && providerConfig.models.length > 0 && !resolveLmstudioProviderAuthMode(providerConfig?.apiKey) && !hasLmstudioAuthorizationHeader(providerConfig?.headers);
}
//#endregion
//#region extensions/lmstudio/src/runtime.ts
var LmstudioConfigResolutionError = class extends Error {};
function buildLmstudioAuthHeaders(params) {
	const headers = { ...params.headers };
	const apiKey = params.apiKey?.trim();
	if (apiKey && !(apiKey === "lmstudio-local") && !isNonSecretApiKeyMarker(apiKey)) {
		for (const headerName of Object.keys(headers)) if (headerName.toLowerCase() === "authorization") delete headers[headerName];
		headers.Authorization = `Bearer ${apiKey}`;
	}
	if (params.json) headers["Content-Type"] = "application/json";
	return Object.keys(headers).length > 0 ? headers : void 0;
}
function sanitizeLmstudioStringHeaders(headers) {
	if (!headers || typeof headers !== "object" || Array.isArray(headers)) return;
	const next = {};
	for (const [headerName, headerValue] of Object.entries(headers)) {
		if (typeof headerValue !== "string") continue;
		const normalized = headerValue.trim();
		if (!normalized) continue;
		next[headerName] = normalized;
	}
	return Object.keys(next).length > 0 ? next : void 0;
}
function shouldSuppressResolvedRuntimeApiKeyForHeaderAuth(source, hasAuthorizationHeader) {
	if (!hasAuthorizationHeader || !source) return false;
	return /^profile:|^(?:shell )?env(?::|$)/.test(source);
}
async function resolveLmstudioConfiguredApiKeyForProvider(params) {
	const config = params.config;
	const apiKeyInput = (config?.models?.providers?.[params.providerId])?.apiKey;
	if (apiKeyInput === void 0 || apiKeyInput === null || !config) return;
	const path = params.path ?? `models.providers[${JSON.stringify(params.providerId)}].apiKey`;
	const env = params.env ?? process.env;
	const directApiKey = normalizeOptionalSecretInput(apiKeyInput);
	const resolved = await resolveConfiguredSecretInputString({
		config,
		env,
		value: directApiKey ?? apiKeyInput,
		path,
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.unresolvedRefReason) {
		if (params.allowUnresolved) return;
		throw new LmstudioConfigResolutionError(`${path}: ${resolved.unresolvedRefReason}`);
	}
	const resolvedValue = normalizeOptionalSecretInput(resolved.value);
	const trimmed = resolvedValue ? normalizeApiKeyConfig(resolvedValue).trim() : "";
	if (!trimmed) return;
	if (directApiKey !== void 0 && isKnownEnvApiKeyMarker(trimmed)) return normalizeOptionalSecretInput(env[trimmed]);
	return isNonSecretApiKeyMarker(trimmed) ? void 0 : trimmed;
}
async function resolveLmstudioConfiguredApiKey(params) {
	return await resolveLmstudioConfiguredApiKeyForProvider({
		...params,
		providerId: LMSTUDIO_PROVIDER_ID
	});
}
async function resolveLmstudioProviderHeaders(params) {
	const headerInputs = params.headers;
	if (!headerInputs || typeof headerInputs !== "object" || Array.isArray(headerInputs)) return;
	if (!params.config) return sanitizeLmstudioStringHeaders(headerInputs);
	const pathPrefix = params.path ?? "models.providers.lmstudio.headers";
	const resolved = {};
	for (const [headerName, headerValue] of Object.entries(headerInputs)) {
		const resolvedHeader = await resolveConfiguredSecretInputString({
			config: params.config,
			env: params.env ?? process.env,
			value: headerValue,
			path: `${pathPrefix}[${JSON.stringify(headerName)}]`,
			unresolvedReasonStyle: "detailed"
		});
		if (resolvedHeader.unresolvedRefReason) throw new LmstudioConfigResolutionError(`${pathPrefix}.${headerName}: ${resolvedHeader.unresolvedRefReason}`);
		const resolvedValue = resolvedHeader.value;
		if (!resolvedValue) continue;
		resolved[headerName] = resolvedValue;
	}
	return Object.keys(resolved).length > 0 ? resolved : void 0;
}
/**
* Resolves LM Studio API key and provider headers in parallel.
* Use this as the standard auth setup step before discovery or model load calls.
*/
async function resolveLmstudioRequestContext(params) {
	const providerHeaders = params.providerHeaders ?? params.config?.models?.providers?.["lmstudio"]?.headers;
	const [apiKey, headers] = await Promise.all([resolveLmstudioRuntimeApiKey({
		config: params.config,
		agentDir: params.agentDir,
		env: params.env,
		headers: providerHeaders
	}), resolveLmstudioProviderHeaders({
		config: params.config,
		env: params.env,
		headers: providerHeaders
	})]);
	return {
		apiKey,
		headers
	};
}
/**
* Resolves LM Studio runtime API key from config.
*/
async function resolveLmstudioRuntimeApiKey(params) {
	const config = params.config;
	if (!config) return;
	const hasAuthorizationHeader = hasLmstudioAuthorizationHeader(params.headers ?? config.models?.providers?.["lmstudio"]?.headers);
	let configuredApiKeyPromise;
	const getConfiguredApiKey = async () => {
		configuredApiKeyPromise ??= resolveLmstudioConfiguredApiKey({
			config,
			env: params.env,
			allowUnresolved: hasAuthorizationHeader
		});
		return await configuredApiKeyPromise;
	};
	const resolveConfiguredApiKeyOrThrow = async () => {
		const configuredApiKey = await getConfiguredApiKey();
		if (configuredApiKey) return configuredApiKey;
		if (hasAuthorizationHeader) return;
		throw new Error([
			"LM Studio API key is required.",
			`Set models.providers.lmstudio.apiKey (for example "${`\${${LMSTUDIO_DEFAULT_API_KEY_ENV_VAR}}`}")`,
			`or run "${formatCliCommand("openclaw models auth login --provider lmstudio")}".`
		].join(" "));
	};
	let resolved;
	try {
		resolved = await resolveApiKeyForProvider({
			provider: LMSTUDIO_PROVIDER_ID,
			cfg: config,
			agentDir: params.agentDir
		});
	} catch {
		return await resolveConfiguredApiKeyOrThrow();
	}
	const resolvedApiKey = resolved.apiKey?.trim();
	if (!resolvedApiKey || resolvedApiKey.length === 0) return await resolveConfiguredApiKeyOrThrow();
	if (shouldSuppressResolvedRuntimeApiKeyForHeaderAuth(resolved.source, hasAuthorizationHeader)) return await resolveConfiguredApiKeyOrThrow();
	if (isNonSecretApiKeyMarker(resolvedApiKey) && resolvedApiKey !== "custom-local" && resolvedApiKey !== "lmstudio-local") return await resolveConfiguredApiKeyOrThrow();
	return resolvedApiKey;
}
//#endregion
//#region extensions/lmstudio/src/models.fetch.ts
const log = createSubsystemLogger("extensions/lmstudio/models");
const LMSTUDIO_ERROR_BODY_LIMIT_BYTES = 8192;
function redactLmstudioLoadError(value, headers) {
	const credentials = Object.entries(headers ?? {}).filter(([name]) => name.toLowerCase() !== "content-type").flatMap(([name, header]) => {
		const normalized = header.trim();
		if (!normalized) return [];
		return name.toLowerCase() === "authorization" ? [normalized, normalized.replace(/^\S+\s+/u, "")] : [normalized];
	}).toSorted((left, right) => right.length - left.length);
	return redactToolPayloadText(credentials.reduce((redacted, credential) => redacted.replaceAll(credential, "***"), value));
}
async function fetchLmstudioEndpoint(params) {
	params.signal?.throwIfAborted();
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	let response;
	let release;
	if (params.ssrfPolicy) {
		const guarded = await fetchWithSsrFGuard({
			url: params.url,
			init: params.init,
			timeoutMs,
			signal: params.signal,
			fetchImpl: params.fetchImpl,
			policy: params.ssrfPolicy,
			auditContext: params.auditContext
		});
		response = guarded.response;
		release = guarded.release;
	} else {
		response = await (params.fetchImpl ?? fetch)(params.url, {
			...params.init,
			signal: params.signal ? AbortSignal.any([params.signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs)
		});
		release = async () => void 0;
	}
	return {
		response,
		release: async () => {
			if (!response.bodyUsed) response.body?.cancel().catch(() => void 0);
			await release();
		}
	};
}
function withResolvedLmstudioModelKey(error, resolvedModelKey) {
	if (error instanceof Error) return Object.assign(error, { resolvedModelKey });
	return Object.assign(new Error(String(error)), {
		cause: error,
		resolvedModelKey
	});
}
/** Fetches /api/v1/models and reports transport reachability separately from HTTP status. */
async function fetchLmstudioModels(params) {
	const baseUrl = resolveLmstudioServerBase(params.baseUrl);
	const timeoutMs = params.timeoutMs ?? 5e3;
	try {
		const { response, release } = await fetchLmstudioEndpoint({
			url: `${baseUrl}/api/v1/models`,
			init: { headers: buildLmstudioAuthHeaders({
				apiKey: params.apiKey,
				headers: params.headers
			}) },
			timeoutMs,
			signal: params.signal,
			fetchImpl: params.fetchImpl,
			ssrfPolicy: params.ssrfPolicy,
			auditContext: "lmstudio-model-discovery"
		});
		try {
			if (!response.ok) return {
				reachable: true,
				status: response.status,
				models: []
			};
			const models = await readProviderJsonArrayFieldResponse(response, "LM Studio model list", "models");
			const validModels = models.filter((model) => typeof model === "object" && model !== null && !Array.isArray(model));
			if (models.length > 0 && validModels.length === 0) throw new Error("LM Studio model list: malformed JSON response");
			return {
				reachable: true,
				status: response.status,
				models: validModels
			};
		} finally {
			await release();
		}
	} catch (error) {
		return {
			reachable: false,
			models: [],
			error
		};
	}
}
/** Discovers LLM models from LM Studio and maps them to OpenClaw model definitions. */
async function discoverLmstudioModels(params) {
	const fetched = await fetchLmstudioModels({
		baseUrl: params.baseUrl,
		apiKey: params.apiKey,
		headers: params.headers,
		fetchImpl: params.fetchImpl
	});
	const quiet = params.quiet;
	if (!fetched.reachable || fetched.status !== void 0 && fetched.status >= 400) {
		const error = fetched.status === void 0 ? fetched.error : new LiveModelCatalogHttpError("lmstudio", fetched.status);
		if (params.discoveryMode === "strict") throw error;
		if (!quiet) log.debug(`Failed to discover LM Studio models: ${String(error)}`);
		return [];
	}
	return fetched.models.map((entry) => {
		const base = mapLmstudioWireEntry(entry);
		if (!base) return null;
		return {
			id: base.id,
			name: buildLmstudioModelName(base),
			reasoning: base.reasoning,
			input: base.input,
			cost: SELF_HOSTED_DEFAULT_COST,
			compat: {
				...base.compat,
				supportsUsageInStreaming: true
			},
			contextWindow: base.contextWindow,
			contextTokens: base.contextTokens,
			maxTokens: base.maxTokens
		};
	}).filter((entry) => entry !== null);
}
/** Keeps the public model/cache identity stable for embedding and SDK callers. */
async function ensureLmstudioModelLoaded(params) {
	return (await prepareLmstudioModelForInference(params)).modelKey;
}
async function prepareLmstudioModelForInference(params) {
	const modelKey = params.modelKey.trim();
	if (!modelKey) throw new Error("LM Studio model key is required");
	const timeoutMs = params.timeoutMs ?? 3e4;
	const baseUrl = resolveLmstudioServerBase(params.baseUrl);
	const preflight = await fetchLmstudioModels({
		baseUrl,
		apiKey: params.apiKey,
		headers: params.headers,
		ssrfPolicy: params.ssrfPolicy,
		timeoutMs,
		signal: params.signal,
		fetchImpl: params.fetchImpl
	});
	params.signal?.throwIfAborted();
	if (!preflight.reachable) throw new Error(`LM Studio model discovery failed: ${String(preflight.error)}`);
	if (preflight.status !== void 0 && preflight.status >= 400) throw new Error(`LM Studio model discovery failed (${preflight.status})`);
	const canonicalModelKey = resolveLmstudioCanonicalModelKey({
		modelKey,
		models: preflight.models
	});
	const matchingModel = preflight.models.find((entry) => entry.key?.trim() === canonicalModelKey);
	const loadedContextWindow = matchingModel ? resolveLoadedContextWindow(matchingModel) : null;
	const advertisedContextLimit = asPositiveSafeInteger(matchingModel?.max_context_length) ?? null;
	const requestedContextLength = asPositiveSafeInteger(params.requestedContextLength) ?? null;
	const contextLengthForLoad = advertisedContextLimit === null ? requestedContextLength ?? 64e3 : Math.min(requestedContextLength ?? 64e3, advertisedContextLimit);
	if (loadedContextWindow !== null && loadedContextWindow >= contextLengthForLoad) return {
		modelKey: canonicalModelKey,
		instanceId: (Array.isArray(matchingModel?.loaded_instances) ? matchingModel.loaded_instances : []).find((entry) => typeof entry?.id === "string" && entry.id.trim().length > 0 && (asPositiveSafeInteger(entry.config?.context_length) ?? 0) >= contextLengthForLoad)?.id?.trim()
	};
	try {
		const requestHeaders = buildLmstudioAuthHeaders({
			apiKey: params.apiKey,
			headers: params.headers,
			json: true
		});
		const { response, release } = await fetchLmstudioEndpoint({
			url: `${baseUrl}/api/v1/models/load`,
			init: {
				method: "POST",
				headers: requestHeaders,
				body: JSON.stringify({
					model: canonicalModelKey,
					context_length: contextLengthForLoad
				})
			},
			timeoutMs,
			signal: params.signal,
			fetchImpl: params.fetchImpl,
			ssrfPolicy: params.ssrfPolicy,
			auditContext: "lmstudio-model-load"
		});
		try {
			if (!response.ok) {
				const bodyRead = await readResponseTextPrefix(response, LMSTUDIO_ERROR_BODY_LIMIT_BYTES, { chunkTimeoutMs: 1e4 });
				const detail = bodyRead.truncated ? "" : redactLmstudioLoadError(bodyRead.text, requestHeaders);
				throw new Error(`LM Studio model load failed (${response.status})${detail ? `: ${detail}` : ""}`);
			}
			const payload = await readProviderJsonResponse(response, "LM Studio model load");
			if (typeof payload.status === "string" && payload.status.toLowerCase() !== "loaded") {
				const status = redactLmstudioLoadError(payload.status, requestHeaders);
				throw new Error(`LM Studio model load returned unexpected status: ${status}`);
			}
			return {
				modelKey: canonicalModelKey,
				instanceId: typeof payload.instance_id === "string" ? payload.instance_id.trim() || void 0 : void 0
			};
		} finally {
			await release();
		}
	} catch (error) {
		throw withResolvedLmstudioModelKey(error, canonicalModelKey);
	}
}
//#endregion
export { LMSTUDIO_DEFAULT_BASE_URL as A, LMSTUDIO_PROVIDER_LABEL as B, resolveLmstudioCanonicalModelKey as C, resolveLmstudioServerBase as D, resolveLmstudioReasoningCompat as E, LMSTUDIO_DOCKER_HOST_BASE_URL as F, LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL as I, LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER as L, LMSTUDIO_DEFAULT_INFERENCE_BASE_URL as M, LMSTUDIO_DEFAULT_LOAD_CONTEXT_LENGTH as N, resolveLoadedContextWindow as O, LMSTUDIO_DEFAULT_MODEL_ID as P, LMSTUDIO_MODEL_PLACEHOLDER as R, normalizeLmstudioProviderConfig as S, resolveLmstudioReasoningCapability as T, buildLmstudioModelName as _, LmstudioConfigResolutionError as a, normalizeLmstudioConfiguredCatalogEntries as b, resolveLmstudioConfiguredApiKeyForProvider as c, resolveLmstudioRuntimeApiKey as d, sanitizeLmstudioStringHeaders as f, shouldUseLmstudioSyntheticAuth as g, shouldUseLmstudioApiKeyPlaceholder as h, prepareLmstudioModelForInference as i, LMSTUDIO_DEFAULT_EMBEDDING_MODEL as j, LMSTUDIO_DEFAULT_API_KEY_ENV_VAR as k, resolveLmstudioProviderHeaders as l, resolveLmstudioProviderAuthMode as m, ensureLmstudioModelLoaded as n, buildLmstudioAuthHeaders as o, hasLmstudioAuthorizationHeader as p, fetchLmstudioModels as r, resolveLmstudioConfiguredApiKey as s, discoverLmstudioModels as t, resolveLmstudioRequestContext as u, mapLmstudioWireEntry as v, resolveLmstudioInferenceBase as w, normalizeLmstudioConfiguredCatalogEntry as x, mapLmstudioWireModelsToConfig as y, LMSTUDIO_PROVIDER_ID as z };
