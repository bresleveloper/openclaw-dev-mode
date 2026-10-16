import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as findNormalizedProviderValue } from "./model-selection-normalize-AjjSfI-g.mjs";
import "./model-selection-C1qxt1eY.mjs";
import { n as estimateBase64DecodedBytes } from "./base64-CU53EX1R.mjs";
import { n as isMinimaxVlmProvider } from "./minimax-vlm-CupUbDjw.mjs";
import { r as coerceToolModelConfig } from "./model-config.helpers-B3XiMUo2.mjs";
import { s as extractEmbeddedAssistantText } from "./embedded-agent-utils-BYhIvAvm.mjs";
//#region src/agents/tools/image-tool.helpers.ts
const IMAGE_REASONING_FALLBACK_SIGNATURES = /* @__PURE__ */ new Set([
	"reasoning_content",
	"reasoning",
	"reasoning_details",
	"reasoning_text"
]);
const MAX_IMAGE_REASONING_FALLBACK_BLOCKS = 50;
const MAX_IMAGE_REASONING_SIGNATURE_PARSE_CHARS = 2048;
const MAX_IMAGE_REASONING_SIGNATURE_SCAN_CHARS = 65536;
function hasResponsesReasoningSignatureMarkers(value) {
	const scanned = value.slice(0, MAX_IMAGE_REASONING_SIGNATURE_SCAN_CHARS);
	return /"id"\s*:\s*"rs_/.test(scanned) && /"type"\s*:\s*"reasoning(?:[."])/.test(scanned);
}
function isImageReasoningFallbackSignature(value) {
	if (!value) return false;
	if (typeof value === "string") {
		if (IMAGE_REASONING_FALLBACK_SIGNATURES.has(value)) return true;
		const trimmed = value.trim();
		if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return false;
		if (trimmed.length > MAX_IMAGE_REASONING_SIGNATURE_PARSE_CHARS) return hasResponsesReasoningSignatureMarkers(trimmed);
		try {
			return isImageReasoningFallbackSignature(JSON.parse(trimmed));
		} catch {
			return false;
		}
	}
	if (typeof value !== "object") return false;
	const record = value;
	const id = typeof record.id === "string" ? record.id : "";
	const type = typeof record.type === "string" ? record.type : "";
	return id.startsWith("rs_") && (type === "reasoning" || type.startsWith("reasoning."));
}
/** Detects provider responses that contain only reasoning blocks and no usable image text. */
function hasImageReasoningOnlyResponse(message) {
	if (extractEmbeddedAssistantText(message).trim() || !Array.isArray(message.content)) return false;
	return message.content.slice(0, MAX_IMAGE_REASONING_FALLBACK_BLOCKS).some((block) => {
		if (!block || typeof block !== "object") return false;
		const record = block;
		return record.type === "thinking" && typeof record.thinking === "string" && isImageReasoningFallbackSignature(record.thinkingSignature);
	});
}
/** Decodes a base64 image data URL with optional decoded-size protection. */
function decodeDataUrl(dataUrl, opts) {
	const trimmed = dataUrl.trim();
	const match = /^data:([^;,]+);base64,/i.exec(trimmed);
	const b64 = match ? trimmed.slice(match[0].length) : "";
	if (!match || !b64 || /[^a-z0-9+/=\r\n]/i.test(b64)) throw new Error("Invalid data URL (expected base64 data: URL).");
	const mimeType = normalizeLowercaseStringOrEmpty(match[1]);
	if (!mimeType.startsWith("image/")) throw new Error(`Unsupported data URL type: ${mimeType || "unknown"}`);
	if (typeof opts?.maxBytes === "number" && estimateBase64DecodedBytes(b64) > opts.maxBytes) throw new Error("Invalid data URL: payload exceeds size limit.");
	const buffer = Buffer.from(b64, "base64");
	if (buffer.length === 0) throw new Error("Invalid data URL: empty payload.");
	return {
		buffer,
		mimeType,
		kind: "image"
	};
}
/** Extracts assistant text or throws a provider/model-specific image failure. */
function coerceImageAssistantText(params) {
	const stop = params.message.stopReason;
	const errorMessage = params.message.errorMessage?.trim();
	if (stop === "error" || stop === "aborted" || errorMessage) throw new Error(errorMessage ? `Image model failed (${params.provider}/${params.model}): ${errorMessage}` : `Image model failed (${params.provider}/${params.model})`);
	const text = extractEmbeddedAssistantText(params.message).trim();
	if (text) return text;
	throw new Error(`Image model returned no text (${params.provider}/${params.model}).`);
}
/** Reads imageModel defaults from config into the shared tool model config shape. */
function coerceImageModelConfig(cfg) {
	return coerceToolModelConfig(cfg?.agents?.defaults?.imageModel);
}
function formatConfiguredImageModelRef(provider, modelId) {
	const slash = modelId.indexOf("/");
	if (slash > 0 && normalizeProviderId(modelId.slice(0, slash)) === provider) return modelId;
	return `${provider}/${modelId}`;
}
function modelIdMatchesProviderlessRef(params) {
	const candidates = [params.modelId];
	const slash = params.modelId.indexOf("/");
	if (slash > 0 && normalizeProviderId(params.modelId.slice(0, slash)) === params.provider) candidates.push(params.modelId.slice(slash + 1));
	const normalizedRef = normalizeLowercaseStringOrEmpty(params.ref);
	return candidates.some((candidate) => normalizeLowercaseStringOrEmpty(candidate) === normalizedRef);
}
function findConfiguredImageModelMatches(params) {
	const providers = params.cfg?.models?.providers;
	if (!providers || typeof providers !== "object") return [];
	const matches = /* @__PURE__ */ new Set();
	for (const [providerKey, providerConfig] of Object.entries(providers)) {
		const provider = normalizeProviderId(providerKey);
		if (!provider || !Array.isArray(providerConfig?.models)) continue;
		for (const entry of providerConfig.models) {
			const modelId = entry?.id?.trim();
			if (!modelId || !Array.isArray(entry?.input) || !entry.input.includes("image")) continue;
			if (!modelIdMatchesProviderlessRef({
				provider,
				modelId,
				ref: params.ref
			})) continue;
			matches.add(formatConfiguredImageModelRef(provider, modelId));
		}
	}
	return [...matches];
}
function resolveProviderlessConfiguredImageModelRef(params) {
	const ref = params.ref.trim();
	if (!ref || ref.includes("/")) return ref;
	const matches = findConfiguredImageModelMatches({
		cfg: params.cfg,
		ref
	});
	if (matches.length === 0) return ref;
	if (matches.length === 1) return matches.at(0) ?? ref;
	throw new Error(`Ambiguous image model "${ref}". Configure a provider-prefixed ref such as ${matches.map((match) => `"${match}"`).join(" or ")}.`);
}
/** Resolves providerless configured image model refs against configured provider models. */
function resolveConfiguredImageModelRefs(params) {
	const primary = params.imageModelConfig.primary?.trim();
	const fallbacks = params.imageModelConfig.fallbacks?.map((ref) => resolveProviderlessConfiguredImageModelRef({
		cfg: params.cfg,
		ref
	})).filter((ref) => ref.length > 0);
	return {
		...params.imageModelConfig.primary !== void 0 ? { primary: primary ? resolveProviderlessConfiguredImageModelRef({
			cfg: params.cfg,
			ref: primary
		}) : primary } : {},
		...fallbacks && fallbacks.length > 0 ? { fallbacks } : {},
		...params.imageModelConfig.timeoutMs !== void 0 ? { timeoutMs: params.imageModelConfig.timeoutMs } : {}
	};
}
/** Returns the configured vision-capable model for a provider, if present. */
function resolveProviderVisionModelFromConfig(params) {
	if (isMinimaxVlmProvider(params.provider)) return null;
	const id = ((findNormalizedProviderValue(params.cfg?.models?.providers, params.provider)?.models ?? []).find((m) => Boolean((m?.id ?? "").trim()) && m.input?.includes("image"))?.id ?? "").trim();
	if (!id) return null;
	const slash = id.indexOf("/");
	const idProvider = slash === -1 ? "" : normalizeLowercaseStringOrEmpty(id.slice(0, slash));
	const selectedProvider = normalizeLowercaseStringOrEmpty(params.provider);
	return idProvider && idProvider === selectedProvider ? id : `${params.provider}/${id}`;
}
//#endregion
export { resolveConfiguredImageModelRefs as a, hasImageReasoningOnlyResponse as i, coerceImageModelConfig as n, resolveProviderVisionModelFromConfig as o, decodeDataUrl as r, coerceImageAssistantText as t };
