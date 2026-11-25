import { o as isRecord } from "./record-coerce-BgUo6bj4.mjs";
import { a as normalizeOptionalLowercaseString, l as readStringValue, n as normalizeFastMode, r as normalizeLowercaseStringOrEmpty } from "./string-coerce-CpcyRbc6.mjs";
import { N as supportsOpenAIReasoningEffort, R as resolveModelServiceTierContextTokens, c as OPENAI_RESPONSES_RETAINED_COMPACTION_REPLAY_TYPE, i as OPENAI_RESPONSES_APIS } from "./openai-responses-contracts-BTBx9zkC.mjs";
import { t as canonicalizeBase64 } from "./base64-FdymvxN9.mjs";
import { t as parsePositiveInteger } from "./positive-integer-AM4ltyhP.mjs";
import { n as isProviderReplayContext, r as providerReplayContextMatches, t as buildProviderReplayContext } from "./provider-replay-context-BSKkFyU5.mjs";
import { n as createSseByteGuard } from "./streaming-byte-guard-gOcUrHJF.mjs";
// packages/model-catalog-core/src/provider-id.ts
function normalizeProviderId(provider) {
	return normalizeLowercaseStringOrEmpty(provider);
}
// packages/ai/src/transports/openai-responses-endpoint.ts
function isOfficialOpenAIResponsesBaseUrl(baseUrl) {
	if (!baseUrl) return false;
	const url = URL.parse(baseUrl);
	return url !== null && url.origin === "https://api.openai.com" && url.username === "" && url.password === "" && url.search === "" && url.hash === "" && url.pathname.replace(/\/+$/, "") === "/v1";
}
function supportsNativeOpenAIResponsesEndpoint(params) {
	return params.provider.trim().toLowerCase() === "openai" && params.api === "openai-responses" && isOfficialOpenAIResponsesBaseUrl(params.baseUrl);
}
// packages/ai/src/transports/openai-responses-payload-policy.ts
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
	return (URL.parse(trimmed) ?? URL.parse(`https://${trimmed}`))?.hostname.toLowerCase();
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
		allowsOpenAIServiceTier: provider === "openai" && (api === "openai-responses" || api === "openclaw-openai-responses-transport") || isOpenAIProvider && (api === "openai-chatgpt-responses" || api === "openclaw-openai-chatgpt-responses-transport") && endpointClass === "openai",
		allowsResponsesStore: supportsResponsesStoreField && api !== "openai-chatgpt-responses" && api !== "openclaw-openai-chatgpt-responses-transport" && provider !== void 0 && OPENAI_RESPONSES_PROVIDERS.has(provider) && usesKnownNativeOpenAIEndpoint,
		explicitContinuationOptIn,
		requiresStatelessCompactionReplay: endpointClass === "openai-public" || isOpenAIProvider && endpointClass === "default",
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
function normalizeOpenAIServiceTier(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	return normalized === "auto" || normalized === "default" || normalized === "flex" || normalized === "priority" || normalized === "ultrafast" ? normalized : void 0;
}
function resolveOpenAIRequestedServiceTier(extraParams, serviceTiers) {
	const explicitTier = normalizeOpenAIServiceTier(extraParams?.serviceTier ?? extraParams?.service_tier);
	const rawFastMode = extraParams?.fastMode ?? extraParams?.fast_mode;
	const fastMode = normalizeFastMode(typeof rawFastMode === "function" ? rawFastMode() : rawFastMode);
	return fastMode === void 0 || fastMode === "auto" ? explicitTier : fastMode === "ultrafast" && (!serviceTiers || serviceTiers.includes("ultrafast")) ? "ultrafast" : fastMode ? "priority" : explicitTier ? "default" : void 0;
}
/** Resolve the same speed-override-before-default-tier precedence used at request egress. */
function resolveOpenAIResponsesRequestContextTokens(model, extraParams, serviceTiers) {
	return resolveOpenAIResponsesPayloadCapabilities(model).allowsOpenAIServiceTier ? resolveModelServiceTierContextTokens(normalizeOptionalLowercaseString(model.provider), resolveOpenAIRequestedServiceTier(extraParams, serviceTiers)) : void 0;
}
/** Resolve the server-compaction gate and effective threshold for a Responses route. */
function resolveOpenAIResponsesServerCompactionPlan(model, extraParams) {
	const provider = normalizeOptionalLowercaseString(model.provider);
	const capabilities = resolveOpenAIResponsesPayloadCapabilities(model);
	const configured = extraParams?.responsesServerCompaction;
	const enabled = configured !== false && capabilities.allowsResponsesStore && (configured === true || provider === "openai");
	return {
		enabled,
		threshold: enabled ? Math.min(parsePositiveInteger(extraParams?.responsesCompactThreshold) ?? resolveOpenAIResponsesCompactThreshold(model), (capabilities.allowsOpenAIServiceTier ? resolveModelServiceTierContextTokens(provider, resolveOpenAIRequestedServiceTier(extraParams)) : void 0) ?? Infinity) : void 0
	};
}
/** Resolve the Responses compact-endpoint gate for one route. */
function resolveOpenAIResponsesCompactEndpointPlan(model, extraParams, _purpose) {
	const configured = extraParams?.responsesCompactEndpoint;
	const provider = typeof model.provider === "string" ? normalizeProviderId(model.provider) : "";
	const api = normalizeOptionalLowercaseString(model.api);
	const endpointClass = resolveOpenAIResponsesEndpointClass(model.baseUrl);
	const enabledByDefault = (provider === "xai" || provider === "x-ai") && endpointClass === "xai-native" || provider === "openai" && api === "openai-responses" && endpointClass === "openai-public";
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
	for (let index = 0; index < input.length; index++) {
		const item = input[index];
		if (item && typeof item === "object" && !Array.isArray(item) && "status" in item) {
			const { status: _, ...rest } = item;
			input[index] = rest;
		}
	}
}
/** Resolve payload mutation policy for one OpenAI Responses-style model endpoint. */
function resolveOpenAIResponsesPayloadPolicy(model, options = {}) {
	const capabilities = resolveOpenAIResponsesPayloadCapabilities(model);
	const storeMode = options.storeMode ?? "provider-policy";
	const explicitStore = storeMode === "preserve" ? void 0 : storeMode === "disable" || storeMode === "transport-default" && !capabilities.explicitContinuationOptIn ? capabilities.supportsResponsesStoreField ? false : void 0 : capabilities.allowsResponsesStore || capabilities.explicitContinuationOptIn ? true : void 0;
	const isResponsesApi = isOpenAIResponsesApi(normalizeOptionalLowercaseString(model.api));
	const shouldStripDisabledReasoningPayload = isResponsesApi && !supportsOpenAIReasoningEffort(capabilities.usesKnownNativeOpenAIRoute ? model : {
		compat: model.compat,
		thinkingLevelMap: model.thinkingLevelMap
	}, "none");
	const shouldStripInputStatus = isResponsesApi && !capabilities.usesKnownNativeOpenAIRoute;
	const serverCompactionPlan = resolveOpenAIResponsesServerCompactionPlan(model, options.extraParams);
	const instructionsCompat = readCompatPayloadBoolean(model.compat, "supportsInstructions");
	const embedForNativeCache = options.nativeCompactEndpoint !== true && readCompatPayloadBoolean(model.compat, "cachesInstructions") === false && supportsNativeOpenAIResponsesEndpoint({
		provider: readStringValue(model.provider) ?? "",
		api: readStringValue(model.api) ?? "",
		baseUrl: readStringValue(model.baseUrl)
	});
	const usesInstructionsField = (instructionsCompat ?? capabilities.usesVerifiedInstructionsEndpoint) && !embedForNativeCache;
	return {
		allowsServiceTier: capabilities.allowsOpenAIServiceTier,
		compactThreshold: serverCompactionPlan.threshold,
		defaultManagedReasoningEffort: capabilities.usesKnownNativeOpenAIRoute && !shouldStripDisabledReasoningPayload && model.provider !== "github-copilot" ? "none" : void 0,
		explicitContinuationOptIn: capabilities.explicitContinuationOptIn,
		explicitStore,
		requiresStatelessCompactionReplay: capabilities.requiresStatelessCompactionReplay,
		shouldStripDisabledReasoningPayload,
		shouldStripInputStatus,
		shouldStripPromptCache: options.enablePromptCacheStripping === true && capabilities.shouldStripResponsesPromptCache,
		shouldStripStore: explicitStore !== true && readCompatPayloadBoolean(model.compat, "supportsStore") === false && isResponsesApi,
		useServerCompaction: options.enableServerCompaction === true && serverCompactionPlan.enabled,
		usesInstructionsField
	};
}
/** Enforce replay storage on the final input, including items introduced by payload hooks. */
function enforceOpenAIResponsesCompactionReplayStorage(payloadObj, policy) {
	if (policy.requiresStatelessCompactionReplay && Array.isArray(payloadObj.input) && payloadObj.input.some((item) => isRecord(item) && item.type === "compaction")) {
		if (policy.shouldStripStore) delete payloadObj.store;
		else payloadObj.store = false;
		delete payloadObj.previous_response_id;
	}
}
/** Mutate a Responses request payload according to the resolved endpoint policy. */
function applyOpenAIResponsesPayloadPolicy(payloadObj, policy) {
	if (policy.explicitStore !== void 0) payloadObj.store = policy.explicitStore;
	if (policy.shouldStripStore) delete payloadObj.store;
	enforceOpenAIResponsesCompactionReplayStorage(payloadObj, policy);
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
/** Sniffs supported inline image formats from decoded bytes. */
function sniffInlineImageMime(buffer) {
	if (buffer.length >= 8 && buffer.readBigUInt64BE(0) === 9894494448401390090n) return "image/png";
	if (buffer.length >= 3 && buffer.readUIntBE(0, 3) === 16767231) return "image/jpeg";
	if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "image/webp";
	if (buffer.length >= 6 && /^GIF8[79]a$/.test(buffer.toString("ascii", 0, 6))) return "image/gif";
	if (buffer.length >= 2 && buffer.readUInt16BE(0) === 16973) return "image/bmp";
	if (buffer.length < 12 || buffer.subarray(4, 8).toString("ascii") !== "ftyp") return;
	const brands = [buffer.subarray(8, 12).toString("ascii")];
	for (let offset = 16; offset + 4 <= buffer.length; offset += 4) brands.push(buffer.subarray(offset, offset + 4).toString("ascii"));
	if (brands.some((brand) => HEIC_BRANDS.has(brand))) return "image/heic";
	if (brands.some((brand) => HEIF_BRANDS.has(brand))) return "image/heif";
}
/** Canonicalizes trusted inline image base64 and rejects malformed or non-image payloads. */
function sanitizeInlineImageBase64(params) {
	if (!params.mimeType.trim().toLowerCase().startsWith("image/")) return;
	const canonicalPayload = canonicalizeBase64(params.base64);
	if (!canonicalPayload) return;
	const sniffedMimeType = sniffInlineImageMime(Buffer.from(canonicalPayload.slice(0, IMAGE_SIGNATURE_PREFIX_BASE64_CHARS), "base64"));
	if (!sniffedMimeType) return;
	return {
		mimeType: sniffedMimeType,
		base64: canonicalPayload
	};
}
function sanitizeInlineImageDataUrlWithAllowedMimes(imageUrl, allowedMimes) {
	if (imageUrl.slice(0, 5).toLowerCase() !== "data:") return imageUrl;
	const commaIndex = imageUrl.indexOf(",");
	if (commaIndex < 0) return;
	const [mimeType, ...options] = imageUrl.slice(5, commaIndex).split(";").map((part) => part.trim());
	if (!mimeType || !options.some((part) => part.toLowerCase() === "base64")) return;
	const sanitized = sanitizeInlineImageBase64({
		mimeType,
		base64: imageUrl.slice(commaIndex + 1)
	});
	if (!sanitized) return;
	if (allowedMimes && !allowedMimes.has(sanitized.mimeType)) return;
	return `data:${sanitized.mimeType};base64,${sanitized.base64}`;
}
/** Canonicalizes provider-safe inline image data URLs and rejects unsupported formats. */
function sanitizeInlineImageDataUrl(imageUrl) {
	return sanitizeInlineImageDataUrlWithAllowedMimes(imageUrl, INLINE_IMAGE_DATA_URL_MIMES);
}
// packages/ai/src/transports/responses-image-input-sanitizer.ts
/**
* Sanitizes OpenAI Responses input for validation and transport. Invalid inline images
* are replaced with text placeholders so the request remains valid and
* auditable.
*/
const IMAGE_OMITTED_TEXT = "omitted image payload: invalid inline image data";
const sourceImages = /* @__PURE__ */ new WeakMap();
const inputImages = /* @__PURE__ */ new WeakMap();
const sanitizedFrozenInputs = /* @__PURE__ */ new WeakSet();
/** Sanitation has already established immutability for this unchanged publication. */
function isSanitizedFrozenResponsesInput(value) {
	return sanitizedFrozenInputs.has(value);
}
/** Reuse scalar image work, never the mutable item exposed to payload hooks. */
function buildResponsesInputImage(source) {
	const { mimeType, data } = source;
	let payload = sourceImages.get(source);
	if (!payload || payload.mimeType !== mimeType || payload.data !== data) {
		payload = {
			mimeType,
			data
		};
		sourceImages.set(source, payload);
	}
	const url = `data:${mimeType};base64,${data}`;
	const input = {
		type: "input_image",
		detail: "auto",
		image_url: url
	};
	inputImages.set(input, {
		url,
		payload
	});
	return input;
}
function sanitizePreparedImage(payload, url) {
	if (payload.sanitized === void 0) {
		const normalizedUrl = sanitizeInlineImageDataUrl(url);
		payload.sanitized = normalizedUrl ? {
			mimeType: normalizedUrl.slice(5, normalizedUrl.indexOf(";")),
			...normalizedUrl.slice(normalizedUrl.indexOf(",") + 1) === payload.data ? {} : { normalizedUrl }
		} : false;
	}
	const sanitized = payload.sanitized;
	return sanitized ? sanitized.normalizedUrl ?? (sanitized.mimeType === payload.mimeType ? url : `data:${sanitized.mimeType};base64,${payload.data}`) : void 0;
}
function sanitizeValue(value, immutableData) {
	if (value && typeof value === "object" && sanitizedFrozenInputs.has(value)) return value;
	if (!Array.isArray(value) && !isRecord(value)) return value;
	if (!Array.isArray(value) && value.type === "input_image" && typeof value.image_url === "string") {
		const url = value.image_url;
		const prepared = inputImages.get(value);
		const imageUrl = prepared?.url === url ? sanitizePreparedImage(prepared.payload, url) : sanitizeInlineImageDataUrl(url);
		return imageUrl ? {
			...value,
			image_url: imageUrl
		} : {
			type: "input_text",
			text: `[${IMAGE_OMITTED_TEXT}]`
		};
	}
	let unchanged = true;
	const sanitizeChild = (child) => {
		const sanitized = sanitizeValue(child, immutableData);
		unchanged &&= sanitized === child;
		return sanitized;
	};
	let next;
	if (Array.isArray(value)) next = value.map(sanitizeChild);
	else {
		const object = { ...value };
		for (const [key, child] of Object.entries(value)) {
			object[key] = sanitizeChild(child);
			unchanged &&= Object.hasOwn(object, key);
		}
		next = object;
	}
	if (unchanged && immutableData?.isDeeplyFrozenPlainData(value)) {
		sanitizedFrozenInputs.add(value);
		return value;
	}
	return next;
}
/** Sanitize inline image fields without resolving a transport host. */
function sanitizeResponsesImageInput(input, immutableData) {
	return input.map((value) => sanitizeValue(value, immutableData));
}
// packages/ai/src/transports/openai-responses-compaction-checkpoint.ts
const COMPACTION_WINDOW_MAX_BYTES = 16777216;
const compactionInputIdentities = /* @__PURE__ */ new WeakMap();
const preparedCompactionInputs = /* @__PURE__ */ new WeakMap();
function getResponsesCompactionInputIdentity(item) {
	return preparedCompactionInputs.get(item);
}
function publishResponsesCompactionInput(source, input, immutable) {
	if (!immutable?.isDeeplyFrozenPlainData(source)) return input;
	let identities = compactionInputIdentities.get(source);
	if (!identities) {
		identities = [];
		compactionInputIdentities.set(source, identities);
	}
	let index = 0;
	for (const item of input) {
		immutable.freezeJsonSnapshot(item);
		preparedCompactionInputs.set(item, identities[index++] ??= {});
	}
	return input;
}
/** Provenance is off-wire; an alias of prepared immutable input keeps its byte identity. */
function tagResponsesCompactionInput(item, marker) {
	const tagged = {
		...item,
		[marker]: true
	};
	const identity = preparedCompactionInputs.get(item);
	if (identity) {
		Object.freeze(tagged);
		preparedCompactionInputs.set(tagged, identity);
	}
	return tagged;
}
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
		case "output_text": return typeof value.text === "string" && Array.isArray(value.annotations);
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
	return getOpenAIResponsesCompactionOutputError(value, model) === void 0;
}
/** Return a safe rule failure, never provider content or encrypted checkpoint bytes. */
function getOpenAIResponsesCompactionOutputError(value, model) {
	if (!Array.isArray(value) || value.length === 0) return "output must be a nonempty array";
	if (!isBoundedJson(value)) return "output must contain finite JSON values nested at most 64 levels";
	const item = value.at(-1);
	if (!isRecord(item) || item.type !== "compaction") return "output must end with a compaction item";
	if (typeof item.encrypted_content !== "string" || item.encrypted_content.length === 0) return "trailing compaction item must have nonempty encrypted_content";
	if (!isOptionalCompactionString(item.id) || !isOptionalCompactionString(item.created_by)) return "trailing compaction item metadata must be strings";
	for (let index = 0; index < value.length - 1; index += 1) {
		const message = value[index];
		if (isRecord(message) && message.type === "compaction") return "output must contain exactly one compaction item";
		if (!isRecord(message) || message.type !== "message" || typeof message.role !== "string" || ![
			"user",
			"developer",
			"system",
			"assistant"
		].includes(message.role)) return `output item ${index} must be a user, developer, system, or assistant message`;
		if (!isOptionalCompactionString(message.id) || message.status !== void 0 && (typeof message.status !== "string" || ![
			"in_progress",
			"completed",
			"incomplete"
		].includes(message.status))) return `output message ${index} has invalid metadata`;
		if (!Array.isArray(message.content) || !message.content.every(isInputContent)) return `output message ${index} has unsupported content`;
	}
	const payload = { input: sanitizeResponsesImageInput(value) };
	if (model) applyOpenAIResponsesPayloadPolicy(payload, resolveOpenAIResponsesPayloadPolicy(model));
	if (JSON.stringify(payload.input) !== JSON.stringify(value)) return "output would be rewritten by the Responses payload policy";
}
/** Remaining storage allowance for replay metadata rewrites, without retaining checkpoint bytes. */
function getOpenAIResponsesCompactionWindowReplayBytesAvailable(replay) {
	return COMPACTION_WINDOW_MAX_BYTES - Buffer.byteLength(JSON.stringify(replay), "utf8");
}
/** Read the saved canonical window only when it still matches its opaque checkpoint. */
function readOpenAIResponsesCompactionWindow(replay, model, immutable) {
	const window = replay.compactedWindow;
	if (!isRecord(window) || window.state !== "ready" || typeof window.output !== "string") return;
	if (window.outputTokens !== void 0 && (!Number.isSafeInteger(window.outputTokens) || typeof window.outputTokens !== "number" || window.outputTokens < 0)) return;
	if (Buffer.byteLength(window.output, "utf8") + Buffer.byteLength(replay.data, "utf8") > 16777216) return;
	try {
		if (getOpenAIResponsesCompactionWindowReplayBytesAvailable(replay) < 0) return;
		const output = JSON.parse(window.output);
		if (!isOpenAIResponsesCompactionOutput(output, model)) return;
		const item = output.at(-1);
		if (item?.type !== "compaction" || item.encrypted_content !== replay.data || item.id !== replay.id) return;
		for (const message of output) if (message.type === "message" && message.role === "assistant") delete message.id;
		return publishResponsesCompactionInput(replay, output, immutable);
	} catch {
		return;
	}
}
const OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE = "openai-responses-compaction-suppression";
const OPENAI_RESPONSES_COMPACTION_SUPPRESSION_DATA = "rejected";
function isOpenAIResponsesCompactionState(state) {
	if (typeof state.baseUrlHash !== "string" || state.v !== 1) return false;
	if (state.type === "openai-responses-compaction-suppression") return state.data === OPENAI_RESPONSES_COMPACTION_SUPPRESSION_DATA;
	const retained = state.type === OPENAI_RESPONSES_RETAINED_COMPACTION_REPLAY_TYPE;
	return (retained || state.type === "openai-responses-compaction") && typeof state.data === "string" && state.data.length > 0 && (state.id === void 0 || typeof state.id === "string") && (state.replayIndex === void 0 || !retained && typeof state.replayIndex === "number" && Number.isSafeInteger(state.replayIndex) && state.replayIndex >= 0);
}
function readOpenAIResponsesCompactionReplayState(value) {
	return isRecord(value) && isProviderReplayContext(value) && isOpenAIResponsesCompactionState(value) ? value : void 0;
}
function readOpenAIResponsesItemRecoveryAnchor(replay) {
	const state = readOpenAIResponsesCompactionReplayState(replay);
	return state?.type === "openai-responses-compaction-suppression" && typeof state.itemRecovery === "string" ? state.itemRecovery : void 0;
}
function isSafeResponsesReplayItemId(id) {
	return typeof id === "string" && id.length > 0 && id.length <= 64;
}
/** Read one live replay envelope; null blocks older checkpoints, undefined skips it. */
function createOpenAIResponsesCompactionSourceReader(model, options, resolveImmutableData) {
	const context = buildProviderReplayContext(model, options);
	return (value, contentLength) => {
		const replay = readOpenAIResponsesCompactionReplayState(value);
		if (replay?.type === "openai-responses-compaction-suppression") {
			if (providerReplayContextMatches(replay, typeof replay.itemRecovery === "string" ? {
				...context,
				sessionHash: replay.sessionHash
			} : context)) return typeof replay.itemRecovery === "string" ? {
				mode: "item-recovery",
				anchor: replay.itemRecovery
			} : null;
			return;
		}
		if (replay?.type !== "openai-responses-compaction" && replay?.type !== "openai-responses-retained-compaction") return value?.type === "openai-responses-compaction" || value?.type === "openai-responses-retained-compaction" ? null : void 0;
		if (!providerReplayContextMatches(replay, context)) return null;
		if (replay.compactedWindow !== void 0 || replay.type === "openai-responses-retained-compaction") {
			const output = readOpenAIResponsesCompactionWindow(replay, model, resolveImmutableData?.());
			const item = output?.at(-1);
			if (!output || item?.type !== "compaction") return { mode: "refresh-required" };
			return {
				mode: "complete-window",
				output,
				...replay.compactedWindow?.state === "ready" && replay.compactedWindow.outputTokens !== void 0 ? { outputTokens: replay.compactedWindow.outputTokens } : {},
				item,
				replayIndex: replay.type === "openai-responses-retained-compaction" ? contentLength : replay.replayIndex ?? 0
			};
		}
		const item = {
			type: "compaction",
			...isSafeResponsesReplayItemId(replay.id) ? { id: replay.id } : {},
			encrypted_content: replay.data
		};
		publishResponsesCompactionInput(replay, [item], resolveImmutableData?.());
		return {
			item,
			mode: "compacted-prefix",
			replayIndex: replay.replayIndex ?? 0
		};
	};
}
var CompactionReplayRefreshRequiredError = class extends Error {
	constructor() {
		super("Provider compaction checkpoint needs rebuilding. Run /compact to rebuild from saved conversation history.");
		this.name = "CompactionReplayRefreshRequiredError";
	}
};
// packages/ai/src/transports/openai-responses-compaction-window.ts
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
export { resolveOpenAIResponsesRequestContextTokens as C, supportsNativeOpenAIResponsesEndpoint as E, resolveOpenAIResponsesPayloadPolicy as S, isOfficialOpenAIResponsesBaseUrl as T, sanitizeResponsesImageInput as _, createOpenAIResponsesCompactionSourceReader as a, normalizeOpenAIServiceTier as b, getResponsesCompactionInputIdentity as c, readOpenAIResponsesCompactionReplayState as d, readOpenAIResponsesCompactionWindow as f, isSanitizedFrozenResponsesInput as g, buildResponsesInputImage as h, OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE as i, isOpenAIResponsesCompactionOutput as l, tagResponsesCompactionInput as m, CompactionReplayRefreshRequiredError as n, getOpenAIResponsesCompactionOutputError as o, readOpenAIResponsesItemRecoveryAnchor as p, OPENAI_RESPONSES_COMPACTION_SUPPRESSION_DATA as r, getOpenAIResponsesCompactionWindowReplayBytesAvailable as s, createBoundedOpenAIResponsesCompactionFetch as t, isSafeResponsesReplayItemId as u, applyOpenAIResponsesPayloadPolicy as v, resolveOpenAIResponsesServerCompactionPlan as w, resolveOpenAIResponsesCompactEndpointPlan as x, enforceOpenAIResponsesCompactionReplayStorage as y };
