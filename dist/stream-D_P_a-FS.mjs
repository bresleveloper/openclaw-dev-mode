import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as filterStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import "./llm-CLV5ZXaS.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { i as streamSimple } from "./stream-BDeJVJpD.mjs";
import { A as createToolStreamWrapper, d as createPayloadPatchStreamWrapper, f as createPlainTextToolCallCompatWrapper, i as composeProviderStreamWrappers } from "./provider-stream-shared-CuBHNQvM.mjs";
import { t as XAI_BASE_URL } from "./model-definitions-DA8Fbxqz.mjs";
import { i as isXaiGrokProxyBaseUrl } from "./provider-catalog-1_qb880U.mjs";
import { t as isXaiProviderId } from "./provider-id-dn9RuxC0.mjs";
import { t as resolveXaiFastModelId } from "./fast-mode-cyaa92Rg.mjs";
//#region extensions/xai/stream.ts
function isXaiEndpoint(model, endpoint) {
	return isXaiProviderId(model.provider) && model.baseUrl?.trim().replace(/\/+$/u, "") === endpoint;
}
function createXaiGrokOAuthHeadersWrapper(baseStreamFn, clientVersion) {
	const underlying = baseStreamFn ?? streamSimple;
	const normalizedClientVersion = clientVersion?.trim();
	return (model, context, options) => {
		if (!normalizedClientVersion || !isXaiProviderId(model.provider) || !isXaiGrokProxyBaseUrl(model.baseUrl)) return underlying(model, context, options);
		const headers = new Headers(options?.headers);
		headers.set("X-XAI-Token-Auth", "xai-grok-cli");
		headers.set("x-grok-client-version", normalizedClientVersion);
		headers.set("x-grok-model-override", model.id);
		return underlying(model, context, {
			...options,
			headers: Object.fromEntries(headers.entries())
		});
	};
}
const XAI_REASONING_ENCRYPTED_CONTENT_INCLUDE = "reasoning.encrypted_content";
/** xAI-only: request encrypted reasoning for every reasoning-capable model, even when effort is unsupported. */
function ensureXaiResponsesEncryptedReasoningInclude(payloadObj, model) {
	if (!isXaiProviderId(model.provider) || model.api !== "openai-responses" || model.reasoning !== true) return;
	const existing = payloadObj.include;
	const include = filterStringEntries(existing);
	if (!include.includes(XAI_REASONING_ENCRYPTED_CONTENT_INCLUDE)) include.push(XAI_REASONING_ENCRYPTED_CONTENT_INCLUDE);
	payloadObj.include = include;
}
function isReplayableInputImagePart(part) {
	if (part.type !== "input_image") return false;
	if (typeof part.image_url === "string") return true;
	if (!part.source || typeof part.source !== "object") return false;
	const source = part.source;
	if (source.type === "url") return typeof source.url === "string";
	return source.type === "base64" && typeof source.media_type === "string" && typeof source.data === "string";
}
function describeXaiFunctionOutputMediaPlaceholder(parts) {
	let hasImage = false;
	let hasAudio = false;
	let hasOtherMedia = false;
	for (const part of parts) {
		const type = typeof part.type === "string" ? part.type : "";
		const normalizedMime = (typeof part.mimeType === "string" ? part.mimeType : typeof part.mime_type === "string" ? part.mime_type : typeof part.mediaType === "string" ? part.mediaType : typeof part.contentType === "string" ? part.contentType : "").toLowerCase();
		if (type.includes("image") || normalizedMime.startsWith("image/")) hasImage = true;
		else if (type.includes("audio") || normalizedMime.startsWith("audio/")) hasAudio = true;
		else if (type !== "input_text") hasOtherMedia = true;
	}
	if (hasImage && hasAudio || hasOtherMedia) return "(see attached media)";
	if (hasAudio) return "(see attached audio)";
	if (hasImage) return "(see attached image)";
}
function normalizeXaiResponsesToolResultPayload(payloadObj, model) {
	if (model.api !== "openai-responses" || isXaiEndpoint(model, XAI_BASE_URL) || !Array.isArray(payloadObj.input)) return;
	const includeImages = Array.isArray(model.input) && model.input.includes("image");
	let imageContentParts = [];
	let toolResultIndex = 0;
	payloadObj.input = payloadObj.input.flatMap((item, index, input) => {
		const itemObj = asOptionalRecord(item);
		if (itemObj?.type !== "function_call_output") return [item];
		toolResultIndex += 1;
		let normalizedItem = item;
		if (Array.isArray(itemObj.output)) {
			const outputParts = itemObj.output;
			let textOutput = "";
			const imageStart = imageContentParts.length;
			for (const part of outputParts) {
				if (part.type === "input_text" && typeof part.text === "string") textOutput += part.text;
				if (includeImages && isReplayableInputImagePart(part)) {
					if (imageContentParts.length === imageStart) imageContentParts.push({
						type: "input_text",
						text: `Image(s) from tool result #${toolResultIndex}:`
					});
					imageContentParts.push(part);
				}
			}
			normalizedItem = {
				...itemObj,
				output: textOutput || describeXaiFunctionOutputMediaPlaceholder(outputParts) || ""
			};
		}
		if (imageContentParts.length === 0 || asOptionalRecord(input[index + 1])?.type === "function_call_output") return [normalizedItem];
		const carrier = {
			type: "message",
			role: "user",
			content: imageContentParts
		};
		imageContentParts = [];
		return [normalizedItem, carrier];
	});
}
function createXaiToolPayloadCompatibilityWrapper(baseStreamFn) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload, model }) => {
		normalizeXaiResponsesToolResultPayload(payload, model);
		if (!model.reasoning || asOptionalRecord(model.compat)?.supportsReasoningEffort === false) {
			delete payload.reasoning;
			delete payload.reasoningEffort;
			delete payload.reasoning_effort;
		}
		ensureXaiResponsesEncryptedReasoningInclude(payload, model);
	});
}
function createXaiFastModeWrapper(baseStreamFn, fastMode) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if ((typeof fastMode === "function" ? fastMode() : fastMode) !== true) return underlying(model, context, options);
		const fastModelId = resolveXaiFastModelId(model);
		if (!fastModelId) return underlying(model, context, options);
		return underlying({
			...model,
			id: fastModelId
		}, context, options);
	};
}
function resolveXaiFastMode(extraParams) {
	const raw = extraParams?.fastMode ?? extraParams?.fast_mode;
	if (typeof raw === "function") {
		const resolved = raw();
		return typeof resolved === "boolean" ? resolved : void 0;
	}
	return typeof raw === "boolean" ? raw : void 0;
}
function hasXaiFastModeParam(extraParams) {
	return Boolean(extraParams && (Object.hasOwn(extraParams, "fastMode") || Object.hasOwn(extraParams, "fast_mode")));
}
function wrapXaiProviderStream(ctx, runtime) {
	const extraParams = ctx.extraParams;
	const toolStreamEnabled = extraParams?.tool_stream !== false;
	return composeProviderStreamWrappers(ctx.streamFn, (streamFn) => createXaiGrokOAuthHeadersWrapper(streamFn, runtime?.clientVersion), createXaiToolPayloadCompatibilityWrapper, hasXaiFastModeParam(extraParams) && ((streamFn) => createXaiFastModeWrapper(streamFn, () => resolveXaiFastMode(extraParams))), createPlainTextToolCallCompatWrapper, (streamFn) => createToolStreamWrapper(streamFn, toolStreamEnabled));
}
//#endregion
export { wrapXaiProviderStream as t };
