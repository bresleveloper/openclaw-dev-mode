import { i as normalizeOptionalLowercaseString, n as normalizeLowercaseStringOrEmpty, s as readStringValue } from "./string-coerce-fsri9iCu.mjs";
import { o as isRecord } from "./record-coerce-DwRYMj3t.mjs";
import { u as supportsOpenAIReasoningEffort } from "./openai-reasoning-effort-ash8dPrd.mjs";
import { t as canonicalizeBase64 } from "./base64-CPmadnUf.mjs";
import { t as parsePositiveInteger } from "./positive-integer-BiUxrd71.mjs";
import { i as OPENAI_RESPONSES_APIS } from "./openai-responses-contracts-DWrfMODE.mjs";
import { t as createSseByteGuard } from "./streaming-byte-guard-CC-HMn_u.mjs";
//#region packages/model-catalog-core/src/provider-id.ts
function normalizeProviderId(provider) {
	return normalizeLowercaseStringOrEmpty(provider);
}
//#endregion
//#region packages/ai/src/transports/openai-responses-payload-policy.ts
/**
* OpenAI Responses payload policy.
* Classifies endpoint capabilities and applies store, prompt-cache,
* server-compaction, service-tier, and reasoning payload rules.
*/
const OPENAI_RESPONSES_PROVIDERS = /* @__PURE__ */ new Set([
	"openai",
	"azure-openai",
	"azure-openai-responses"
]);
function resolveUrlHostname(value) {
	const trimmed = readStringValue(value)?.trim();
	if (!trimmed) return;
	try {
		return new URL(trimmed).hostname.toLowerCase();
	} catch {
		try {
			return new URL(`https://${trimmed}`).hostname.toLowerCase();
		} catch {
			return;
		}
	}
}
function resolveOpenAIResponsesEndpointClass(baseUrl) {
	const trimmed = readStringValue(baseUrl)?.trim();
	if (!trimmed) return "default";
	const host = resolveUrlHostname(trimmed);
	if (!host) return "custom";
	switch (host) {
		case "api.openai.com": return "openai-public";
		case "chatgpt.com": return "openai";
		case "api.x.ai": return "xai-native";
	}
	if ([
		".openai.azure.com",
		".cognitiveservices.azure.com",
		".services.ai.azure.com",
		".api.cognitive.microsoft.com"
	].some((suffix) => host.endsWith(suffix))) return "azure-openai";
	return "custom";
}
function isOpenAIResponsesApi(api) {
	return api !== void 0 && OPENAI_RESPONSES_APIS.has(api);
}
function readCompatPayloadBoolean(compat, key) {
	if (!compat || typeof compat !== "object") return;
	const value = compat[key];
	return typeof value === "boolean" ? value : void 0;
}
function resolveOpenAIResponsesPayloadCapabilities(model) {
	const provider = normalizeOptionalLowercaseString(model.provider);
	const api = normalizeOptionalLowercaseString(model.api);
	const isOpenAIProvider = provider === "openai";
	const endpointClass = resolveOpenAIResponsesEndpointClass(model.baseUrl);
	const isResponsesApi = isOpenAIResponsesApi(api);
	const usesConfiguredBaseUrl = endpointClass !== "default";
	const usesKnownNativeOpenAIEndpoint = endpointClass === "openai-public" || endpointClass === "openai" || endpointClass === "azure-openai";
	const usesKnownNativeOpenAIRoute = endpointClass === "default" ? provider === "openai" : usesKnownNativeOpenAIEndpoint;
	const usesExplicitProxyLikeEndpoint = usesConfiguredBaseUrl && !usesKnownNativeOpenAIEndpoint;
	const usesVerifiedInstructionsEndpoint = (endpointClass === "default" ? provider === "openai" : endpointClass === "openai-public" || endpointClass === "openai") || endpointClass === "xai-native";
	const promptCacheKeySupport = readCompatPayloadBoolean(model.compat, "supportsPromptCacheKey");
	const shouldStripResponsesPromptCache = promptCacheKeySupport === true ? false : promptCacheKeySupport === false ? isResponsesApi : isResponsesApi && usesExplicitProxyLikeEndpoint;
	const supportsResponsesStoreField = readCompatPayloadBoolean(model.compat, "supportsStore") !== false && isResponsesApi;
	const explicitContinuationOptIn = (api === "openai-responses" || api === "openclaw-openai-responses-transport") && supportsResponsesStoreField && provider !== "azure-openai" && provider !== "azure-openai-responses" && readCompatPayloadBoolean(model.compat, "supportsResponsesContinuation") === true;
	return {
		allowsOpenAIServiceTier: provider === "openai" && (api === "openai-responses" || api === "openclaw-openai-responses-transport") && endpointClass === "openai-public" || isOpenAIProvider && (api === "openai-chatgpt-responses" || api === "openclaw-openai-chatgpt-responses-transport" || api === "openai-responses" || api === "openclaw-openai-responses-transport") && endpointClass === "openai",
		allowsResponsesStore: supportsResponsesStoreField && api !== "openai-chatgpt-responses" && api !== "openclaw-openai-chatgpt-responses-transport" && provider !== void 0 && OPENAI_RESPONSES_PROVIDERS.has(provider) && usesKnownNativeOpenAIEndpoint,
		explicitContinuationOptIn,
		shouldStripResponsesPromptCache,
		supportsResponsesStoreField,
		usesKnownNativeOpenAIRoute,
		usesVerifiedInstructionsEndpoint
	};
}
function resolveOpenAIResponsesCompactThreshold(model) {
	const contextTokens = parsePositiveInteger(model.contextTokens);
	const contextWindow = parsePositiveInteger(model.contextWindow);
	const effectiveBudget = contextTokens && contextWindow ? Math.min(contextTokens, contextWindow) : contextTokens || contextWindow;
	if (effectiveBudget) return Math.max(1e3, Math.floor(effectiveBudget * .7));
	return 8e4;
}
/** Resolve the server-compaction gate and effective threshold for a Responses route. */
function resolveOpenAIResponsesServerCompactionPlan(model, extraParams) {
	const provider = normalizeOptionalLowercaseString(model.provider);
	const allowsResponsesStore = resolveOpenAIResponsesPayloadCapabilities(model).allowsResponsesStore;
	const configured = extraParams?.responsesServerCompaction;
	const enabled = configured !== false && allowsResponsesStore && (configured === true || provider === "openai");
	return {
		enabled,
		threshold: enabled ? parsePositiveInteger(extraParams?.responsesCompactThreshold) ?? resolveOpenAIResponsesCompactThreshold(model) : void 0
	};
}
/** Resolve the Responses compact-endpoint gate for one route and compaction purpose. */
function resolveOpenAIResponsesCompactEndpointPlan(model, extraParams, purpose = "manual") {
	const configured = extraParams?.responsesCompactEndpoint;
	const provider = typeof model.provider === "string" ? normalizeProviderId(model.provider) : "";
	const api = normalizeOptionalLowercaseString(model.api);
	const endpointClass = resolveOpenAIResponsesEndpointClass(model.baseUrl);
	const enabledByDefault = (provider === "xai" || provider === "x-ai") && endpointClass === "xai-native" || purpose === "budget" && provider === "openai" && api === "openai-responses" && endpointClass === "openai-public";
	return { enabled: isOpenAIResponsesApi(api) && configured !== false && (configured === true || enabledByDefault) };
}
function stripDisabledOpenAIReasoningPayload(payloadObj) {
	const reasoning = payloadObj.reasoning;
	if (reasoning === "none") {
		delete payloadObj.reasoning;
		return;
	}
	if (!reasoning || typeof reasoning !== "object" || Array.isArray(reasoning)) return;
	if (reasoning.effort === "none") delete payloadObj.reasoning;
}
/** Strip returned-item metadata rejected by strict Responses-compatible endpoints. */
function stripInputItemStatuses(input) {
	if (!Array.isArray(input)) return;
	for (const item of input) if (item && typeof item === "object" && !Array.isArray(item)) delete item.status;
}
/** Resolve payload mutation policy for one OpenAI Responses-style model endpoint. */
function resolveOpenAIResponsesPayloadPolicy(model, options = {}) {
	const capabilities = resolveOpenAIResponsesPayloadCapabilities(model);
	const storeMode = options.storeMode ?? "provider-policy";
	const explicitStore = storeMode === "preserve" ? void 0 : storeMode === "disable" || storeMode === "transport-default" && !capabilities.explicitContinuationOptIn ? capabilities.supportsResponsesStoreField ? false : void 0 : capabilities.allowsResponsesStore || capabilities.explicitContinuationOptIn ? true : void 0;
	const isResponsesApi = isOpenAIResponsesApi(normalizeOptionalLowercaseString(model.api));
	const shouldStripDisabledReasoningPayload = isResponsesApi && !supportsOpenAIReasoningEffort(capabilities.usesKnownNativeOpenAIRoute ? model : { compat: model.compat }, "none");
	const shouldStripInputStatus = isResponsesApi && !capabilities.usesKnownNativeOpenAIRoute;
	const serverCompactionPlan = resolveOpenAIResponsesServerCompactionPlan(model, options.extraParams);
	const usesInstructionsField = readCompatPayloadBoolean(model.compat, "supportsInstructions") ?? capabilities.usesVerifiedInstructionsEndpoint;
	return {
		allowsServiceTier: capabilities.allowsOpenAIServiceTier,
		compactThreshold: serverCompactionPlan.threshold,
		defaultManagedReasoningEffort: capabilities.usesKnownNativeOpenAIRoute && !shouldStripDisabledReasoningPayload && model.provider !== "github-copilot" ? "none" : void 0,
		explicitContinuationOptIn: capabilities.explicitContinuationOptIn,
		explicitStore,
		shouldStripDisabledReasoningPayload,
		shouldStripInputStatus,
		shouldStripPromptCache: options.enablePromptCacheStripping === true && capabilities.shouldStripResponsesPromptCache,
		shouldStripStore: explicitStore !== true && readCompatPayloadBoolean(model.compat, "supportsStore") === false && isResponsesApi,
		useServerCompaction: options.enableServerCompaction === true && serverCompactionPlan.enabled,
		usesInstructionsField
	};
}
/** Mutate a Responses request payload according to the resolved endpoint policy. */
function applyOpenAIResponsesPayloadPolicy(payloadObj, policy) {
	if (policy.explicitStore !== void 0) payloadObj.store = policy.explicitStore;
	if (policy.shouldStripStore) delete payloadObj.store;
	if (policy.shouldStripPromptCache) {
		delete payloadObj.prompt_cache_key;
		delete payloadObj.prompt_cache_retention;
	}
	if (policy.useServerCompaction && policy.compactThreshold !== void 0 && payloadObj.context_management === void 0) payloadObj.context_management = [{
		type: "compaction",
		compact_threshold: policy.compactThreshold
	}];
	if (policy.shouldStripDisabledReasoningPayload) stripDisabledOpenAIReasoningPayload(payloadObj);
	if (policy.shouldStripInputStatus) stripInputItemStatuses(payloadObj.input);
}
//#endregion
//#region packages/media-core/src/inline-image-data-url.ts
/** Prefix used to distinguish inline data URLs from remote/local image references. */
const INLINE_IMAGE_DATA_URL_PREFIX = "data:";
const IMAGE_SIGNATURES = [
	{
		mime: "image/png",
		matches: (buffer) => buffer.length >= 8 && buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71 && buffer[4] === 13 && buffer[5] === 10 && buffer[6] === 26 && buffer[7] === 10
	},
	{
		mime: "image/jpeg",
		matches: (buffer) => buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255
	},
	{
		mime: "image/webp",
		matches: (buffer) => buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP"
	},
	{
		mime: "image/gif",
		matches: (buffer) => buffer.length >= 6 && (buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a")
	},
	{
		mime: "image/bmp",
		matches: (buffer) => buffer.length >= 2 && buffer[0] === 66 && buffer[1] === 77
	}
];
const HEIC_BRANDS = /* @__PURE__ */ new Set([
	"heic",
	"heix",
	"hevc",
	"hevx",
	"heis",
	"heim",
	"hevm",
	"hevs"
]);
const HEIF_BRANDS = /* @__PURE__ */ new Set(["mif1", "msf1"]);
const IMAGE_SIGNATURE_PREFIX_BASE64_CHARS = 128;
const INLINE_IMAGE_DATA_URL_MIMES = /* @__PURE__ */ new Set([
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/gif"
]);
function startsWithDataUrl(value) {
	return value.slice(0, 5).toLowerCase() === INLINE_IMAGE_DATA_URL_PREFIX;
}
function sniffIsoBmffImageMime(buffer) {
	if (buffer.length < 12 || buffer.subarray(4, 8).toString("ascii") !== "ftyp") return;
	const brands = [buffer.subarray(8, 12).toString("ascii")];
	for (let offset = 16; offset + 4 <= buffer.length; offset += 4) brands.push(buffer.subarray(offset, offset + 4).toString("ascii"));
	if (brands.some((brand) => HEIC_BRANDS.has(brand))) return "image/heic";
	if (brands.some((brand) => HEIF_BRANDS.has(brand))) return "image/heif";
}
/** Sniffs supported inline image formats from decoded bytes. */
function sniffInlineImageMime(buffer) {
	return IMAGE_SIGNATURES.find((signature) => signature.matches(buffer))?.mime ?? sniffIsoBmffImageMime(buffer);
}
function isImageMimeType(value) {
	return value.trim().toLowerCase().startsWith("image/");
}
/** Canonicalizes trusted inline image base64 and rejects malformed or non-image payloads. */
function sanitizeInlineImageBase64(params) {
	if (!isImageMimeType(params.mimeType)) return;
	const canonicalPayload = canonicalizeBase64(params.base64);
	if (!canonicalPayload) return;
	const sniffedMimeType = sniffInlineImageMime(Buffer.from(canonicalPayload.slice(0, IMAGE_SIGNATURE_PREFIX_BASE64_CHARS), "base64"));
	if (!sniffedMimeType) return;
	return {
		mimeType: sniffedMimeType,
		base64: canonicalPayload
	};
}
function parseInlineImageDataUrl(value) {
	if (!startsWithDataUrl(value)) return {
		metadata: [],
		payload: value
	};
	const commaIndex = value.indexOf(",");
	if (commaIndex < 0) return;
	return {
		metadata: value.slice(5, commaIndex).split(";").map((part) => part.trim()),
		payload: value.slice(commaIndex + 1)
	};
}
function metadataAllowsImageBase64(metadata) {
	const [mimeType, ...options] = metadata;
	return mimeType !== void 0 && isImageMimeType(mimeType) && options.some((part) => part.toLowerCase() === "base64");
}
function sanitizeInlineImageDataUrlWithAllowedMimes(imageUrl, allowedMimes) {
	const parsed = parseInlineImageDataUrl(imageUrl);
	if (!parsed) return;
	if (parsed.metadata.length === 0) return imageUrl;
	if (!metadataAllowsImageBase64(parsed.metadata)) return;
	const [mimeType] = parsed.metadata;
	const sanitized = sanitizeInlineImageBase64({
		mimeType: mimeType ?? "",
		base64: parsed.payload
	});
	if (!sanitized) return;
	if (allowedMimes && !allowedMimes.has(sanitized.mimeType)) return;
	return `data:${sanitized.mimeType};base64,${sanitized.base64}`;
}
/** Canonicalizes provider-safe inline image data URLs and rejects unsupported formats. */
function sanitizeInlineImageDataUrl(imageUrl) {
	return sanitizeInlineImageDataUrlWithAllowedMimes(imageUrl, INLINE_IMAGE_DATA_URL_MIMES);
}
//#endregion
//#region packages/ai/src/transports/responses-image-payload-sanitizer.ts
/**
* Sanitizes OpenAI Responses payloads before transport. Invalid inline images
* are replaced with text placeholders so the request remains valid and
* auditable.
*/
const IMAGE_OMITTED_TEXT = "omitted image payload: invalid inline image data";
function invalidSnakeImage() {
	return {
		type: "input_text",
		text: `[${IMAGE_OMITTED_TEXT}]`
	};
}
function sanitizeValue(value) {
	if (Array.isArray(value)) return value.map(sanitizeValue);
	if (!isRecord(value)) return value;
	if (value.type === "input_image" && typeof value.image_url === "string") {
		const imageUrl = sanitizeInlineImageDataUrl(value.image_url);
		return imageUrl ? {
			...value,
			image_url: imageUrl
		} : invalidSnakeImage();
	}
	const next = {};
	for (const [key, child] of Object.entries(value)) next[key] = sanitizeValue(child);
	return next;
}
/** Sanitize inline image fields inside a Responses API payload. */
function sanitizeResponsesImagePayload(params) {
	if (!Array.isArray(params.input)) return params;
	return {
		...params,
		input: sanitizeValue(params.input)
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-compaction-window.ts
const COMPACTION_WINDOW_MAX_BYTES = 16777216;
function isOptionalCompactionString(value) {
	return value === void 0 || typeof value === "string";
}
function isBoundedJson(value, depth = 0) {
	if (depth > 64) return false;
	if (value === null || typeof value === "string" || typeof value === "boolean") return true;
	if (typeof value === "number") return Number.isFinite(value);
	return (Array.isArray(value) || isRecord(value)) && Object.values(value).every((child) => isBoundedJson(child, depth + 1));
}
function isInputContent(value) {
	if (!isRecord(value)) return false;
	const breakpoint = value.prompt_cache_breakpoint;
	if (breakpoint !== void 0 && (!isRecord(breakpoint) || breakpoint.mode !== "explicit")) return false;
	switch (value.type) {
		case "input_text": return typeof value.text === "string";
		case "input_image": return typeof value.detail === "string" && [
			"auto",
			"low",
			"high",
			"original"
		].includes(value.detail) && (typeof value.image_url === "string" || typeof value.file_id === "string") && (value.image_url === null || isOptionalCompactionString(value.image_url)) && (value.file_id === null || isOptionalCompactionString(value.file_id));
		case "input_file": return (value.detail === void 0 || typeof value.detail === "string" && [
			"auto",
			"low",
			"high"
		].includes(value.detail)) && [
			value.file_data,
			value.file_id,
			value.file_url
		].some((entry) => typeof entry === "string") && isOptionalCompactionString(value.file_data) && (value.file_id === null || isOptionalCompactionString(value.file_id)) && isOptionalCompactionString(value.file_url) && isOptionalCompactionString(value.filename);
		default: return false;
	}
}
/** Validate without projecting: accepted provider fields must survive replay unchanged. */
function isOpenAIResponsesCompactionOutput(value, model) {
	if (!Array.isArray(value) || value.length === 0 || !isBoundedJson(value)) return false;
	const item = value.at(-1);
	if (!(isRecord(item) && item.type === "compaction" && typeof item.encrypted_content === "string" && item.encrypted_content.length > 0 && isOptionalCompactionString(item.id) && isOptionalCompactionString(item.created_by) && value.slice(0, -1).every((message) => isRecord(message) && message.type === "message" && typeof message.role === "string" && [
		"user",
		"developer",
		"system"
	].includes(message.role) && isOptionalCompactionString(message.id) && (message.status === void 0 || typeof message.status === "string" && [
		"in_progress",
		"completed",
		"incomplete"
	].includes(message.status)) && Array.isArray(message.content) && message.content.every(isInputContent)))) return false;
	const payload = sanitizeResponsesImagePayload({ input: value });
	if (model) applyOpenAIResponsesPayloadPolicy(payload, resolveOpenAIResponsesPayloadPolicy(model));
	return JSON.stringify(payload.input) === JSON.stringify(value);
}
/** Read the saved canonical window only when it still matches its opaque checkpoint. */
function readOpenAIResponsesCompactionWindow(replay, model) {
	const window = replay.compactedWindow;
	if (!isRecord(window) || window.state !== "ready" || typeof window.output !== "string") return;
	if (Buffer.byteLength(window.output, "utf8") + Buffer.byteLength(replay.data, "utf8") > COMPACTION_WINDOW_MAX_BYTES) return;
	try {
		if (Buffer.byteLength(JSON.stringify(replay), "utf8") > COMPACTION_WINDOW_MAX_BYTES) return;
		const output = JSON.parse(window.output);
		if (!isOpenAIResponsesCompactionOutput(output, model)) return;
		const item = output.at(-1);
		return item?.type === "compaction" && item.encrypted_content === replay.data && item.id === replay.id ? output : void 0;
	} catch {
		return;
	}
}
/** Bound success bytes while leaving body deadlines, retries, and parsing to the SDK. */
function createBoundedOpenAIResponsesCompactionFetch(upstreamFetch) {
	return async (input, init) => {
		const response = await upstreamFetch(input, init);
		if (!response.ok || !response.body) return response;
		const reader = response.body.getReader();
		const guard = createSseByteGuard(reader, {
			maxBytes: COMPACTION_WINDOW_MAX_BYTES,
			onOverflow: () => /* @__PURE__ */ new Error("Responses compact endpoint response exceeds 16 MiB")
		});
		const body = new ReadableStream({
			async pull(controller) {
				try {
					const chunk = await guard.read();
					if (chunk.done) {
						reader.releaseLock();
						controller.close();
					} else controller.enqueue(chunk.value);
				} catch (error) {
					reader.releaseLock();
					controller.error(error);
				}
			},
			cancel(reason) {
				guard.cancel(reason);
				reader.releaseLock();
			}
		});
		return new Response(body, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	};
}
//#endregion
export { applyOpenAIResponsesPayloadPolicy as a, resolveOpenAIResponsesServerCompactionPlan as c, sanitizeResponsesImagePayload as i, isOpenAIResponsesCompactionOutput as n, resolveOpenAIResponsesCompactEndpointPlan as o, readOpenAIResponsesCompactionWindow as r, resolveOpenAIResponsesPayloadPolicy as s, createBoundedOpenAIResponsesCompactionFetch as t };
