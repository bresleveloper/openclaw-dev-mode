import { CUSTOM_LOCAL_AUTH_MARKER, hasConfiguredSecretInput, normalizeOptionalSecretInput } from "openclaw/plugin-sdk/provider-auth";
import { resolveDefaultModelMaxTokens } from "openclaw/plugin-sdk/provider-model-shared";
import { SELF_HOSTED_DEFAULT_CONTEXT_WINDOW, SELF_HOSTED_DEFAULT_COST } from "openclaw/plugin-sdk/provider-setup";
import { asOptionalRecord, asPositiveSafeInteger, normalizeOptionalLowercaseString, normalizeTrimmedStringList, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/lmstudio/src/defaults.ts
/** Shared LM Studio defaults used by setup, runtime discovery, and embeddings paths. */
const LMSTUDIO_DEFAULT_BASE_URL = "http://localhost:1234";
const LMSTUDIO_DEFAULT_API_KEY_ENV_VAR = "LM_API_TOKEN";
const LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER = "lmstudio-local";
const LMSTUDIO_PROVIDER_ID = "lmstudio";
//#endregion
//#region extensions/lmstudio/src/model-reasoning.ts
const LMSTUDIO_OPENAI_COMPAT_ENABLED_REASONING_EFFORTS = [
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh"
];
const LMSTUDIO_OPENAI_COMPAT_REASONING_EFFORTS = ["none", ...LMSTUDIO_OPENAI_COMPAT_ENABLED_REASONING_EFFORTS];
function buildLmstudioReasoningEffortMap(supportedReasoningEfforts) {
	const disabled = supportedReasoningEfforts.includes("none") ? "none" : void 0;
	const max = LMSTUDIO_OPENAI_COMPAT_ENABLED_REASONING_EFFORTS.findLast((option) => supportedReasoningEfforts.includes(option)) ?? supportedReasoningEfforts.find((option) => option !== "none");
	const map = {
		...disabled ? {
			off: disabled,
			none: disabled
		} : {},
		...max ? {
			adaptive: max,
			max
		} : {}
	};
	return Object.keys(map).length > 0 ? map : void 0;
}
//#endregion
//#region extensions/lmstudio/src/models.ts
function normalizeReasoningOptions(value) {
	return uniqueStrings(normalizeTrimmedStringList(value).map((option) => option.toLowerCase()));
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
function resolveLmstudioReasoningCapability(entry) {
	const reasoning = entry.capabilities?.reasoning;
	if (reasoning === void 0 || reasoning === null) return false;
	const allowedOptions = normalizeReasoningOptions(reasoning.allowed_options);
	if (allowedOptions.length > 0) return allowedOptions.some((option) => option !== "off");
	const defaultOption = normalizeOptionalLowercaseString(reasoning.default);
	return defaultOption !== void 0 && defaultOption !== "off";
}
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
function normalizeUrlPath(pathname) {
	return pathname.replace(/\/+$/, "").replace(/\/api\/v1$/i, "").replace(/\/v1$/i, "");
}
function isLikelyHostBaseUrl(value) {
	return /^(?:localhost|(?:\d{1,3}\.){3}\d{1,3}|[a-z0-9.-]+\.[a-z]{2,}|[^/\s?#]+:\d+)(?:[/?#].*)?$/i.test(value) && !value.startsWith("/");
}
function toFetchableLmstudioBaseUrl(value) {
	if (/^https?:\/\//i.test(value) || !isLikelyHostBaseUrl(value)) return value;
	return `http://${value}`;
}
/** Resolves LM Studio server base URL (without /v1 or /api/v1). */
function resolveLmstudioServerBase(configuredBaseUrl) {
	const resolved = configuredBaseUrl?.trim() || "http://localhost:1234";
	const fetchableBaseUrl = toFetchableLmstudioBaseUrl(resolved);
	const parsed = URL.parse(fetchableBaseUrl);
	if (parsed && (parsed.protocol === "http:" || parsed.protocol === "https:")) {
		const pathname = normalizeUrlPath(parsed.pathname);
		parsed.pathname = pathname.length > 0 ? pathname : "/";
		parsed.search = "";
		parsed.hash = "";
		return parsed.toString().replace(/\/$/, "");
	}
	const normalized = normalizeUrlPath(resolved.replace(/\/+$/, ""));
	return normalized.length > 0 ? normalized : LMSTUDIO_DEFAULT_BASE_URL;
}
function resolveLmstudioInferenceBase(configuredBaseUrl) {
	return `${resolveLmstudioServerBase(configuredBaseUrl)}/v1`;
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
function mapLmstudioWireEntry(entry) {
	if (entry.type !== "llm") return null;
	const id = entry.key?.trim() ?? "";
	if (!id) return null;
	const loadedContextWindow = resolveLoadedContextWindow(entry);
	const contextWindow = asPositiveSafeInteger(entry.max_context_length) ?? null ?? SELF_HOSTED_DEFAULT_CONTEXT_WINDOW;
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
		displayName: rawDisplayName || id,
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
		maxTokens: resolveDefaultModelMaxTokens(contextTokens)
	};
}
/** Config persistence keeps plain names; runtime discovery adds state tags and usage compat. */
function mapLmstudioWireModels(models, mode) {
	return models.map((entry) => {
		const base = mapLmstudioWireEntry(entry);
		if (!base) return null;
		return {
			id: base.id,
			name: mode === "runtime" ? buildLmstudioModelName(base) : base.displayName,
			reasoning: base.reasoning,
			input: base.input,
			cost: base.cost,
			...mode === "runtime" ? { compat: {
				...base.compat,
				supportsUsageInStreaming: true
			} } : base.compat ? { compat: base.compat } : {},
			contextWindow: base.contextWindow,
			contextTokens: base.contextTokens,
			maxTokens: base.maxTokens
		};
	}).filter((entry) => entry !== null);
}
function normalizeLmstudioModelKey(modelId) {
	const trimmed = modelId.trim();
	if (trimmed.toLowerCase().startsWith("lmstudio/")) return trimmed.slice(9).trim();
	return trimmed;
}
const getUnlistedLmstudioConfiguredModelIds = (catalog, configuredModels) => {
	const modelIds = new Set(catalog.modelIds);
	const aliases = new Set(catalog.aliases?.map((alias) => alias.toLowerCase()));
	return configuredModels.filter((model) => {
		if (model.provider !== "lmstudio" || model.baseUrl && resolveLmstudioServerBase(model.baseUrl) !== resolveLmstudioServerBase(catalog.baseUrl)) return false;
		const modelKey = normalizeLmstudioModelKey(model.modelId);
		return !modelIds.has(modelKey) && !aliases.has(modelKey.toLowerCase());
	}).map((model) => model.modelId);
};
//#endregion
//#region extensions/lmstudio/src/provider-auth.ts
function hasLmstudioAuthorizationHeader(headers) {
	return Object.entries(asOptionalRecord(headers) ?? {}).some(([name, value]) => name.trim().toLowerCase() === "authorization" && hasConfiguredSecretInput(value));
}
function resolveLmstudioProviderAuthMode(apiKey) {
	const normalized = normalizeOptionalSecretInput(apiKey);
	if (normalized !== void 0) return normalized === "lmstudio-local" || normalized === CUSTOM_LOCAL_AUTH_MARKER ? void 0 : "api-key";
	return hasConfiguredSecretInput(apiKey) ? "api-key" : void 0;
}
function shouldUseLmstudioApiKeyPlaceholder(params) {
	return params.hasModels && !params.resolvedApiKey && !params.hasAuthorizationHeader;
}
function resolvePersistedLmstudioApiKey(params) {
	if (params.explicitAuth === "api-key") {
		if (params.preferFallbackApiKey && params.fallbackApiKey !== void 0) return params.fallbackApiKey;
		if (resolveLmstudioProviderAuthMode(params.currentApiKey)) return params.currentApiKey;
		return params.fallbackApiKey;
	}
	return shouldUseLmstudioApiKeyPlaceholder({
		hasModels: params.hasModels,
		resolvedApiKey: params.currentApiKey,
		hasAuthorizationHeader: params.hasAuthorizationHeader
	}) ? LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER : void 0;
}
//#endregion
export { mapLmstudioWireModels as a, LMSTUDIO_DEFAULT_API_KEY_ENV_VAR as c, getUnlistedLmstudioConfiguredModelIds as i, LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER as l, resolveLmstudioProviderAuthMode as n, resolveLmstudioInferenceBase as o, resolvePersistedLmstudioApiKey as r, resolveLmstudioServerBase as s, hasLmstudioAuthorizationHeader as t, LMSTUDIO_PROVIDER_ID as u };
