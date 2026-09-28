import { S as supportsClaudeNativeXhighEffort, _ as resolveClaudeSonnet5ModelIdentity, a as CLAUDE_OPUS_55_THINKING_PROFILE, d as resolveClaudeFable5ModelIdentity, g as resolveClaudeOpus5ModelIdentity, h as resolveClaudeOpus55ModelIdentity, i as CLAUDE_FABLE_5_THINKING_PROFILE, l as requiresClaudeDefaultSampling, m as resolveClaudeNativeThinkingLevelMap, p as resolveClaudeMythos5ModelIdentity, t as calculateUsageCost, u as requiresClaudeMandatoryAdaptiveThinking, x as supportsClaudeNativeMaxEffort } from "./src-DwGYYyZp.mjs";
import { n as normalizeLowercaseStringOrEmpty } from "./string-coerce-fsri9iCu.mjs";
import { i as asOptionalRecord, o as isRecord } from "./record-coerce-DwRYMj3t.mjs";
import { f as MODEL_CATALOG_THINKING_LEVELS, m as resolveOpenAIThinkingApi, o as resolveOpenAIModelReasoningEfforts, p as listMappedModelThinkingLevels } from "./openai-reasoning-effort-ash8dPrd.mjs";
import { t as truncateUtf16Safe } from "./utf16-slice-CvGodqok.mjs";
//#region packages/ai/src/model-utils.ts
/** Calculates and stores model cost fields from token usage and per-million pricing. */
function calculateCost(model, usage) {
	Object.assign(usage.cost, calculateUsageCost(usage, model.cost));
	return usage.cost;
}
/** Replaces the catalog estimate when the provider reports an authoritative billed total. */
function applyProviderReportedUsageCost(usage, reportedCost) {
	if (typeof reportedCost !== "number" || !Number.isFinite(reportedCost) || reportedCost < 0) return;
	usage.cost.total = reportedCost;
	usage.cost.totalOrigin = "provider-billed";
}
function resolveThinkingLevelMap(model) {
	return model.api === "anthropic-messages" ? resolveClaudeNativeThinkingLevelMap(model) ?? model.thinkingLevelMap : model.thinkingLevelMap;
}
/** Returns thinking levels exposed by a reasoning-capable model. */
function getSupportedThinkingLevels(model) {
	const mandatoryAdaptiveContract = model.api === "anthropic-messages" && requiresClaudeMandatoryAdaptiveThinking(model);
	if (!model.reasoning && !mandatoryAdaptiveContract) return ["off"];
	const thinkingLevelMap = resolveThinkingLevelMap(model);
	const reasoningEfforts = resolveOpenAIThinkingApi(model.api) ? resolveOpenAIModelReasoningEfforts(model) : void 0;
	const mappedLevels = listMappedModelThinkingLevels(model);
	return MODEL_CATALOG_THINKING_LEVELS.filter((level) => {
		const mapped = thinkingLevelMap?.[level];
		if (mapped === null) return false;
		if (level === "xhigh" || level === "max") return reasoningEfforts?.length !== 0 && (mapped !== void 0 || mappedLevels.includes(level) || reasoningEfforts?.includes(level) === true);
		return true;
	});
}
/** Clamps a requested thinking level to the closest supported level for a model. */
function clampThinkingLevel(model, level) {
	const availableLevels = getSupportedThinkingLevels(model);
	if (availableLevels.includes(level)) return level;
	const requestedIndex = MODEL_CATALOG_THINKING_LEVELS.indexOf(level);
	if (requestedIndex === -1) return availableLevels[0] ?? "off";
	const thinkingLevelMap = resolveThinkingLevelMap(model);
	const lowerFirst = (level === "xhigh" || level === "max") && thinkingLevelMap?.[level] === null;
	const lowerLevels = MODEL_CATALOG_THINKING_LEVELS.slice(0, requestedIndex).toReversed();
	const upperLevels = MODEL_CATALOG_THINKING_LEVELS.slice(requestedIndex);
	return (lowerFirst ? [...lowerLevels, ...upperLevels] : [...upperLevels, ...lowerLevels]).find((candidate) => availableLevels.includes(candidate)) ?? availableLevels[0] ?? "off";
}
/** Compares model identity by provider and id. */
function modelsAreEqual(a, b) {
	if (!a || !b) return false;
	return a.id === b.id && a.provider === b.provider;
}
//#endregion
//#region packages/ai/src/utils/headers.ts
/** Converts a Headers object to a plain record for provider request handling. */
function headersToRecord(headers) {
	const result = {};
	for (const [key, value] of headers.entries()) result[key] = value;
	return result;
}
//#endregion
//#region packages/ai/src/providers/anthropic-model-contract.ts
const ANTHROPIC_CLAUDE_CODE_VERSION = "2.1.278";
/** Build OAuth headers and the matching billing identity from one request snapshot. */
function buildAnthropicClaudeCodeIdentity(betaHeader, ...headerSources) {
	const headers = new Headers({
		accept: "application/json",
		"anthropic-dangerous-direct-browser-access": "true",
		...betaHeader ? { "anthropic-beta": betaHeader } : {},
		"x-app": "cli"
	});
	for (const source of headerSources) for (const [name, value] of Object.entries(source ?? {})) headers.set(name, value);
	let version = ANTHROPIC_CLAUDE_CODE_VERSION;
	const candidate = headers.get("user-agent")?.match(/^claude-cli\/(\d+\.\d+\.\d+)$/)?.[1];
	if (candidate) {
		const components = candidate.split(".").map(Number);
		const minimum = version.split(".").map(Number);
		const differing = components.findIndex((component, index) => component !== minimum[index]);
		const component = components[differing];
		const minimumComponent = minimum[differing];
		if (components.every(Number.isSafeInteger) && component !== void 0 && minimumComponent !== void 0 && component > minimumComponent) version = candidate;
	}
	headers.set("user-agent", `claude-cli/${version}`);
	return {
		headers: headersToRecord(headers),
		version
	};
}
function normalizeModelId(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	return (normalized.startsWith("anthropic/") ? normalized.slice(10) : normalized).replace(/[._\s]+/g, "-");
}
function normalizeApi(api) {
	const normalized = normalizeLowercaseStringOrEmpty(api);
	return normalized === "openclaw-anthropic-messages-transport" ? "anthropic-messages" : normalized;
}
function hasConcreteResponseModel(ref) {
	const responseModelId = normalizeModelId(ref.responseModelId);
	return responseModelId.length > 0 && responseModelId !== normalizeModelId(ref.modelId);
}
function usesClaudeFable5MessagesContract(model) {
	return normalizeApi(model.api) === "anthropic-messages" && resolveClaudeFable5ModelIdentity(model) !== void 0;
}
/** Return whether streamed output must wait for the terminal refusal decision. */
function usesClaudeStreamingRefusalContract(model) {
	if (normalizeApi(model.api) !== "anthropic-messages") return false;
	return resolveClaudeFable5ModelIdentity(model) !== void 0 || resolveClaudeMythos5ModelIdentity(model) !== void 0 || resolveClaudeOpus5ModelIdentity(model) !== void 0 || resolveClaudeSonnet5ModelIdentity(model) !== void 0;
}
function requiresClaudeAdaptiveThinking(model) {
	if (normalizeApi(model.api) !== "anthropic-messages") return false;
	return requiresClaudeMandatoryAdaptiveThinking(model);
}
/** Return whether omitted thinking should default to adaptive mode. */
function defaultsClaudeAdaptiveThinking(model) {
	return requiresClaudeAdaptiveThinking(model) || normalizeApi(model.api) === "anthropic-messages" && (resolveClaudeOpus5ModelIdentity(model) !== void 0 || resolveClaudeSonnet5ModelIdentity(model) !== void 0);
}
/** Resolve provider-native effort once for direct and managed Claude requests. */
function resolveAnthropicThinkingEffort(model, level) {
	const requestedLevel = level ?? (resolveClaudeOpus55ModelIdentity(model) ? CLAUDE_OPUS_55_THINKING_PROFILE.defaultLevel : resolveClaudeFable5ModelIdentity(model) ? CLAUDE_FABLE_5_THINKING_PROFILE.defaultLevel : void 0);
	const thinkingLevelMap = resolveClaudeNativeThinkingLevelMap(model);
	const clampModel = {
		...model,
		...typeof model.params?.canonicalModelId === "string" ? { reasoning: true } : {},
		...thinkingLevelMap ? { thinkingLevelMap } : {}
	};
	const resolvedLevel = requestedLevel ? clampThinkingLevel(clampModel, requestedLevel) : void 0;
	const mapped = resolvedLevel ? thinkingLevelMap?.[resolvedLevel] : void 0;
	if (typeof mapped === "string") return mapped;
	switch (resolvedLevel) {
		case "off":
		case "minimal":
		case "low": return "low";
		case "medium": return "medium";
		case "xhigh": return supportsClaudeNativeXhighEffort(model) ? "xhigh" : "high";
		case "max": return supportsClaudeNativeMaxEffort(model) ? "max" : "high";
		default: return "high";
	}
}
/** Normalize Anthropic and Anthropic-compatible terminal reasons identically. */
function mapAnthropicStopReason(reason) {
	switch (reason) {
		case "end_turn":
		case "pause_turn":
		case "compaction":
		case "stop_sequence": return "stop";
		case "max_tokens":
		case "model_context_window_exceeded": return "length";
		case "tool_use": return "toolUse";
		case "refusal":
		case "sensitive": return "error";
		default: throw new Error(`Unhandled stop reason: ${String(reason)}`);
	}
}
/** Remove unsupported assistant prefills while preserving completed tool-use turns. */
function prepareClaudeNoPrefillRequestContext(model, context) {
	if (!resolveClaudeOpus5ModelIdentity(model) && !resolveClaudeSonnet5ModelIdentity(model)) return context;
	let end = context.messages.length;
	while (end > 0) {
		const message = context.messages[end - 1];
		if (message?.role !== "assistant" || Array.isArray(message.content) && message.content.some((block) => block.type === "toolCall")) break;
		end -= 1;
	}
	return end === context.messages.length ? context : {
		...context,
		messages: context.messages.slice(0, end)
	};
}
function applyClaudeRequestContract(params, model) {
	if (normalizeApi(model.api) !== "anthropic-messages") return;
	const opus5 = resolveClaudeOpus5ModelIdentity(model) !== void 0;
	const sonnet5 = resolveClaudeSonnet5ModelIdentity(model) !== void 0;
	if (!requiresClaudeDefaultSampling(model) && !opus5 && !sonnet5) return;
	delete params.temperature;
	delete params.top_p;
	delete params.top_k;
	if (opus5 || sonnet5) delete params.service_tier;
}
function resolveReplayModelBoundIdentity(ref) {
	if (normalizeApi(ref.api) !== "anthropic-messages") return;
	const modelRef = hasConcreteResponseModel(ref) ? { id: ref.responseModelId } : {
		id: ref.modelId,
		params: ref.modelParams
	};
	const fableIdentity = resolveClaudeFable5ModelIdentity(modelRef);
	if (fableIdentity) return `fable:${fableIdentity}`;
	const mythosIdentity = resolveClaudeMythos5ModelIdentity(modelRef);
	if (mythosIdentity) return `mythos:${mythosIdentity}`;
	const opusIdentity = resolveClaudeOpus5ModelIdentity(modelRef);
	if (opusIdentity) return `opus:${opusIdentity}`;
	const sonnetIdentity = resolveClaudeSonnet5ModelIdentity(modelRef);
	return sonnetIdentity ? `sonnet:${sonnetIdentity}` : void 0;
}
/**
* Fable 5.1 reads thinking from every earlier Claude generation (verified live:
* Opus 5, Sonnet 5, Opus 4.8 replay with no drops), while the API silently
* drops anything it cannot read. Moving onto it therefore keeps prior reasoning;
* every other cross-identity move, including unregistered Mythos targets, is
* still dropped here until its replay contract is proven separately.
*/
function readsPriorClaudeThinking(targetIdentity) {
	return targetIdentity !== void 0 && /^fable:claude-fable-5-1(?=$|[^a-z0-9])/.test(targetIdentity);
}
function isClaudeReplaySource(ref) {
	const modelId = hasConcreteResponseModel(ref) ? ref.responseModelId : ref.modelId;
	return /(?:^|[-/])claude-/.test(normalizeModelId(modelId));
}
function resolveModelBoundThinkingReplayMode(params) {
	const sourceApi = normalizeApi(params.source.api);
	const targetApi = normalizeApi(params.target.api);
	const sourceIdentity = resolveReplayModelBoundIdentity(params.source);
	const targetIdentity = resolveReplayModelBoundIdentity(params.target);
	const sameRoute = normalizeLowercaseStringOrEmpty(params.source.provider) === normalizeLowercaseStringOrEmpty(params.target.provider) && sourceApi === targetApi && normalizeModelId(params.source.modelId) === normalizeModelId(params.target.modelId);
	if (!sourceIdentity && !targetIdentity) return "default";
	if (sourceApi === targetApi && readsPriorClaudeThinking(targetIdentity) && isClaudeReplaySource(params.source)) return "preserve";
	if (!sourceIdentity && !hasConcreteResponseModel(params.source) && targetIdentity && sameRoute) return "preserve";
	return sourceApi === targetApi && sourceIdentity === targetIdentity ? "preserve" : "drop";
}
//#endregion
//#region packages/ai/src/utils/sanitize-unicode.ts
/**
* Removes unpaired Unicode surrogate characters from a string.
*
* Unpaired surrogates (high surrogates 0xD800-0xDBFF without matching low surrogates 0xDC00-0xDFFF,
* or vice versa) cause JSON serialization errors in many API providers.
*
* Valid emoji and other characters outside the Basic Multilingual Plane use properly paired
* surrogates and will NOT be affected by this function.
*
* @param text - The text to sanitize
* @returns The sanitized text with unpaired surrogates removed
*
* @example
* // Valid emoji (properly paired surrogates) are preserved
* sanitizeSurrogates("Hello 🙈 World") // => "Hello 🙈 World"
*
* // Unpaired high surrogate is removed
* const unpaired = String.fromCharCode(0xD83D); // high surrogate without low
* sanitizeSurrogates(`Text ${unpaired} here`) // => "Text  here"
*/
function sanitizeSurrogates(text) {
	if (text.isWellFormed()) return text;
	return text.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "");
}
//#endregion
//#region packages/ai/src/providers/tool-result-text.ts
const STRUCTURED_TOOL_RESULT_MAX_CHARS = 8e3;
const IMAGE_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set([
	"image",
	"image_url",
	"input_image"
]);
const AUDIO_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set([
	"audio",
	"input_audio",
	"output_audio"
]);
const MEDIA_ONLY_TOOL_RESULT_TYPES = /* @__PURE__ */ new Set([...IMAGE_TOOL_RESULT_TYPES, ...AUDIO_TOOL_RESULT_TYPES]);
const INLINE_DATA_URI_PATTERN = /(^|[^A-Za-z0-9_])data:([a-z][a-z0-9.+-]*\/[a-z0-9.+-]+(?:;[a-z0-9.+-]+=[^,;"'\s]+|;base64)*,[^\s"'<>)]+)/gi;
const MIME_KEY_CANDIDATES = [
	"mimeType",
	"mime_type",
	"mediaType",
	"media_type",
	"contentType",
	"content_type"
];
const TEXTUAL_MIME_PATTERN = /^(?:text\/|application\/(?:json|ld\+json|x-ndjson|xml|javascript|x-www-form-urlencoded)|[^/]+\/[^+]+\+(?:json|xml)$)/i;
const OPAQUE_OR_BINARY_FIELD_RE = /^(?:blob|buffer|bytes|encrypted_content|encrypted_stdout)$/i;
function readMimeType(value) {
	if (!isRecord(value)) return;
	for (const key of MIME_KEY_CANDIDATES) {
		const mimeType = value[key];
		if (typeof mimeType === "string" && mimeType.trim().length > 0) return mimeType;
	}
}
function isBinaryMimeType(mimeType) {
	const normalized = mimeType.split(";", 1)[0]?.trim().toLowerCase();
	return normalized ? !TEXTUAL_MIME_PATTERN.test(normalized) : false;
}
function describeOmittedValue(value, label) {
	const length = typeof value === "string" ? value.length : JSON.stringify(value)?.length;
	return length ? `[${label} omitted: ${length} chars]` : `[${label} omitted]`;
}
function redactInlineDataUris(value) {
	return value.replace(INLINE_DATA_URI_PATTERN, (_match, prefix, uri) => `${prefix}[inline data URI: ${uri.length} chars]`);
}
function stringifyStructuredBlock(block) {
	const seen = /* @__PURE__ */ new WeakSet();
	try {
		const host = getAiTransportHost();
		const redactedBlock = host.redactModelVisibleSecrets({ structuredToolResult: block }).structuredToolResult;
		const serialized = JSON.stringify(redactedBlock, function structuredToolResultReplacer(key, value) {
			if (OPAQUE_OR_BINARY_FIELD_RE.test(key)) return `[omitted ${key}]`;
			if (key === "data") {
				const mimeType = readMimeType(this);
				if (mimeType && isBinaryMimeType(mimeType)) return describeOmittedValue(value, "binary data");
			}
			if (typeof value === "bigint") return value.toString();
			if (typeof value === "string") return redactInlineDataUris(host.redactModelVisibleSecrets(value));
			if (typeof value === "function" || typeof value === "symbol" || value === void 0) return;
			if (!value || typeof value !== "object") return value;
			if (seen.has(value)) return "[Circular]";
			seen.add(value);
			return value;
		});
		if (!serialized || serialized === "{}") return;
		return serialized;
	} catch {
		return;
	}
}
function truncateStructuredToolText(text) {
	if (text.length <= STRUCTURED_TOOL_RESULT_MAX_CHARS) return text;
	return `${truncateUtf16Safe(text, STRUCTURED_TOOL_RESULT_MAX_CHARS)}\n…(truncated)…`;
}
/** Media metadata alone is not an attachment; provider emitters need inline bytes. */
function hasMediaPayload(block) {
	return isRecord(block) && typeof block.data === "string" && block.data.trim().length > 0;
}
/** Image metadata alone is not an attachment; provider emitters need inline bytes. */
function isImageWithMediaPayload(block) {
	return isRecord(block) && block.type === "image" && hasMediaPayload(block);
}
function classifyToolResultMedia(blocks) {
	let hasImage = false;
	let hasAudio = false;
	for (const block of blocks) {
		if (!hasMediaPayload(block) || block.type === "text") continue;
		const type = typeof block.type === "string" ? block.type : void 0;
		const mimeType = readMimeType(block)?.toLowerCase();
		hasImage ||= Boolean(type && IMAGE_TOOL_RESULT_TYPES.has(type) || mimeType?.startsWith("image/"));
		hasAudio ||= Boolean(type && AUDIO_TOOL_RESULT_TYPES.has(type) || mimeType?.startsWith("audio/"));
	}
	return {
		hasImage,
		hasAudio
	};
}
function describeToolResultMediaPlaceholder(blocks) {
	const { hasImage, hasAudio } = classifyToolResultMedia(blocks);
	if (hasImage && hasAudio) return "(see attached media)";
	if (hasAudio) return "(see attached audio)";
	return hasImage ? "(see attached image)" : void 0;
}
function extractToolResultBlockText(block) {
	if (!block || typeof block !== "object") return;
	const record = block;
	if (typeof record.type === "string" && MEDIA_ONLY_TOOL_RESULT_TYPES.has(record.type)) return;
	if (record.type === "text") {
		const text = typeof record.text === "string" ? record.text : "";
		return text ? sanitizeSurrogates(text) : void 0;
	}
	const structured = stringifyStructuredBlock(record);
	return structured ? sanitizeSurrogates(truncateStructuredToolText(structured)) : void 0;
}
function extractToolResultText(blocks, options) {
	const explicitTexts = [];
	const structuredBlocks = [];
	for (const block of blocks) {
		if (!block || typeof block !== "object") continue;
		if (block.type === "text") {
			const text = extractToolResultBlockText(block);
			if (text) explicitTexts.push(text);
		} else structuredBlocks.push(block);
	}
	if (explicitTexts.length > 0 && !options?.includeStructured) return explicitTexts.join("\n");
	const structuredTexts = [];
	for (const block of structuredBlocks) {
		const text = extractToolResultBlockText(block);
		if (text) structuredTexts.push(text);
	}
	if (explicitTexts.length > 0) {
		if (structuredTexts.length > 0) explicitTexts.push(truncateStructuredToolText(structuredTexts.join("\n")));
		return explicitTexts.join("\n");
	}
	return truncateStructuredToolText(structuredTexts.join("\n"));
}
/** Describe media that cannot be represented on the target provider wire. */
function describeUnsupportedToolResultMedia(blocks, support) {
	const { hasImage, hasAudio } = classifyToolResultMedia(blocks);
	const omittedImage = hasImage && !support.images;
	const omittedAudio = hasAudio && !support.audio;
	if (omittedImage && omittedAudio) return "[unsupported tool-result media omitted]";
	if (omittedAudio) return "[unsupported tool-result audio omitted]";
	return omittedImage ? "[unsupported tool-result image omitted]" : void 0;
}
function formatToolResultText(params) {
	const body = params.text.trim() ? `${params.text}${params.omittedMediaPlaceholder ? `\n${params.omittedMediaPlaceholder}` : ""}` : params.omittedMediaPlaceholder ?? params.mediaPlaceholder ?? "(no tool output)";
	return `${params.isError ? "[tool error] " : ""}${body}`;
}
//#endregion
//#region packages/ai/src/replay-turn-classification.ts
/** Returns true when an assistant turn contains only provider reasoning and blank text. */
function hasOnlyAssistantReasoningContent(message) {
	if (message.role !== "assistant") return false;
	const content = Array.isArray(message.content) ? message.content : message.content != null && typeof message.content === "object" ? [message.content] : [];
	let hasThinking = false;
	for (const block of content) {
		if (!block || typeof block !== "object") return false;
		if (!("type" in block)) return false;
		if (block.type === "thinking" || block.type === "redacted_thinking") {
			hasThinking = true;
			continue;
		}
		if (block.type === "text" && "text" in block && typeof block.text === "string" && !block.text.trim()) continue;
		return false;
	}
	return hasThinking;
}
/** Returns true when a token-limited turn contains only incomplete provider reasoning. */
function isReasoningOnlyLengthAssistantTurn(message) {
	return message.stopReason === "length" && hasOnlyAssistantReasoningContent(message);
}
const STREAM_ERROR_FALLBACK_TEXT = "[assistant turn failed before producing content]";
function isStreamErrorFallbackContent(content) {
	if (content == null) return true;
	if (typeof content === "string") return !content.trim() || content.trim() === "[assistant turn failed before producing content]";
	return Array.isArray(content) && content.every((value) => {
		const block = asOptionalRecord(value);
		return block && (block.type === "text" || block.type === "input_text" || block.type === "output_text") && typeof block.text === "string" && isStreamErrorFallbackContent(block.text);
	});
}
const FAILED_ASSISTANT_REPLAY_TEXT = "[This turn failed before it completed. Do not redo its work without confirming with the user first.]";
/** Classify failed source content before model-specific thinking or tool projection. */
function resolveFailedAssistantReplay(message, options) {
	if (message.role !== "assistant" || message.stopReason !== "error" && message.stopReason !== "aborted") return "keep";
	const content = Array.isArray(message.content) ? message.content : [];
	if (content.some((block) => asOptionalRecord(block)?.type === "toolCall")) return options.pairingAware ? "keep" : "drop";
	return content.some((block) => {
		const record = asOptionalRecord(block);
		return record?.type === "text" && typeof record.text === "string" && !isStreamErrorFallbackContent(record.text);
	}) ? "marker" : "drop";
}
//#endregion
//#region packages/ai/src/transcript-transform.ts
const NON_VISION_USER_IMAGE_PLACEHOLDER = "(image omitted: model does not support images)";
const NON_VISION_TOOL_IMAGE_PLACEHOLDER = "(tool image omitted: model does not support images)";
function replaceImagesWithPlaceholder(content, placeholder) {
	const result = [];
	for (const block of content) {
		if (block.type !== "image") {
			result.push(block);
			continue;
		}
		const previous = result.at(-1);
		const repeated = previous?.type === "text" && previous.text === placeholder;
		if (isImageWithMediaPayload(block) && !repeated) result.push({
			type: "text",
			text: placeholder
		});
	}
	return result;
}
function transformAssistant(message, model, toolCallIdMap, normalizeToolCallId) {
	const replayMode = resolveModelBoundThinkingReplayMode({
		source: {
			provider: message.provider,
			api: message.api,
			modelId: message.model,
			responseModelId: message.responseModel
		},
		target: {
			provider: model.provider,
			api: model.api,
			modelId: model.id,
			modelParams: model.params
		}
	});
	const sameModel = replayMode === "preserve" || message.provider === model.provider && message.api === model.api && message.model === model.id;
	const content = (typeof message.content === "string" ? [{
		type: "text",
		text: message.content
	}] : message.content).flatMap((block) => {
		if (block.type === "thinking") {
			if (replayMode === "drop") return [];
			if (block.redacted) return sameModel ? block : [];
			if (sameModel && block.thinkingSignature) return block;
			if (!block.thinking?.trim()) return [];
			return sameModel ? block : {
				type: "text",
				text: block.thinking
			};
		}
		if (block.type === "text") return sameModel ? block : {
			type: "text",
			text: block.text
		};
		const trimmedId = block.id.trim();
		if (sameModel) return trimmedId === block.id ? block : Object.assign({}, block, { id: trimmedId });
		const { thoughtSignature: _, async: _async, ...unsigned } = block;
		const id = normalizeToolCallId?.(trimmedId, model, message) ?? trimmedId;
		if (id !== trimmedId) toolCallIdMap.set(trimmedId, id);
		return id === block.id ? unsigned : Object.assign({}, unsigned, { id });
	});
	return {
		...message,
		content
	};
}
function transformMessages(messages, model, normalizeToolCallId) {
	const toolCallIdMap = /* @__PURE__ */ new Map();
	const asyncOwners = /* @__PURE__ */ new Map();
	const relocated = /* @__PURE__ */ new Map();
	const movedResults = /* @__PURE__ */ new Set();
	for (const message of messages) if (message.role === "assistant") {
		const sameModel = message.provider === model.provider && message.api === model.api && message.model === model.id;
		for (const block of message.content ?? []) if (block.type === "toolCall") {
			const id = block.id.trim();
			if (block.async && !sameModel) asyncOwners.set(id, message);
			else asyncOwners.delete(id);
		}
	} else if (message.role === "toolResult") {
		const id = message.toolCallId.trim();
		const owner = asyncOwners.get(id);
		if (owner) {
			const results = relocated.get(owner) ?? [];
			results.push(message);
			relocated.set(owner, results);
			movedResults.add(message);
			asyncOwners.delete(id);
		}
	}
	const source = movedResults.size > 0 ? messages.flatMap((message) => movedResults.has(message) ? [] : [message, ...message.role === "assistant" ? relocated.get(message) ?? [] : []]) : messages;
	const supportsImages = model.input.includes("image");
	const result = [];
	const pendingAsyncCalls = /* @__PURE__ */ new Map();
	let pendingToolCalls = [];
	let existingToolResultIds = /* @__PURE__ */ new Set();
	const flushToolCalls = () => {
		for (const call of pendingToolCalls) if (!existingToolResultIds.has(call.id)) result.push({
			role: "toolResult",
			toolCallId: call.id,
			toolName: call.name,
			content: [{
				type: "text",
				text: "No result provided"
			}],
			isError: true,
			timestamp: Date.now()
		});
		pendingToolCalls = [];
		existingToolResultIds = /* @__PURE__ */ new Set();
	};
	for (let message of source) {
		if (message.content == null) message = {
			...message,
			content: []
		};
		if (message.role === "assistant") {
			const failedReplay = resolveFailedAssistantReplay(message, { pairingAware: false });
			message = transformAssistant(message, model, toolCallIdMap, normalizeToolCallId);
			flushToolCalls();
			if (failedReplay === "drop") continue;
			if (failedReplay === "marker") {
				result.push({
					...message,
					content: [{
						type: "text",
						text: FAILED_ASSISTANT_REPLAY_TEXT
					}]
				});
				continue;
			}
			pendingToolCalls = message.content.filter((block) => {
				if (block.type !== "toolCall") return false;
				if (block.async) {
					pendingAsyncCalls.set(block.id, block);
					return false;
				}
				return true;
			});
		} else {
			if (!supportsImages && typeof message.content !== "string") message = {
				...message,
				content: replaceImagesWithPlaceholder(message.content, message.role === "user" ? NON_VISION_USER_IMAGE_PLACEHOLDER : NON_VISION_TOOL_IMAGE_PLACEHOLDER)
			};
			if (message.role === "toolResult") {
				const trimmedId = message.toolCallId.trim();
				const toolCallId = toolCallIdMap.get(trimmedId) ?? trimmedId;
				if (toolCallId !== message.toolCallId) message = {
					...message,
					toolCallId
				};
				existingToolResultIds.add(toolCallId);
				pendingAsyncCalls.delete(toolCallId);
			} else flushToolCalls();
		}
		result.push(message);
	}
	pendingToolCalls.push(...pendingAsyncCalls.values());
	flushToolCalls();
	return result;
}
//#endregion
//#region packages/ai/src/host.ts
const MAX_PENDING_CUSTOM_API_REGISTRATIONS = 32;
const pendingCustomApiRegistrations = [];
function queueCustomApiRegistration(registry, api, streamFn) {
	const existing = pendingCustomApiRegistrations.find((registration) => registration.registry === registry && registration.api === api);
	if (existing) {
		existing.streamFn = streamFn;
		return false;
	}
	if (pendingCustomApiRegistrations.length >= MAX_PENDING_CUSTOM_API_REGISTRATIONS) throw new Error("Too many custom transport APIs were registered before host configuration");
	pendingCustomApiRegistrations.push({
		registry,
		api,
		streamFn
	});
	return false;
}
const inertAiTransportHost = {
	buildModelFetch: () => void 0,
	resolveSecretSentinel: (value) => value,
	redactModelVisibleSecrets: (value) => value,
	redactToolPayloadText: (text) => text,
	normalizeAnthropicInlineContentBlocks: async (content) => [...content],
	resolveOpenAIStrictToolSetting: (_model, options) => options?.supportsStrictMode ? false : void 0,
	plugin: {
		resolveProviderStream: () => void 0,
		resolveTransportTurnState: () => void 0,
		wrapSimpleCompletionStream: () => void 0,
		createAnthropicVertexStream: () => {
			throw new Error("Anthropic Vertex transport is not configured by the embedding host");
		}
	},
	buildCopilotDynamicHeaders: () => ({}),
	resolveProviderRequestCapabilities: () => ({
		endpointClass: "default",
		knownProviderFamily: "",
		supportsNativeStreamingUsageCompat: false,
		supportsOpenAICompletionsStreamingUsageCompat: false,
		usesExplicitProxyLikeEndpoint: false,
		allowsAnthropicServiceTier: false
	}),
	resolveProviderRequestHeaders: ({ providerHeaders, callerHeaders, precedence }) => ({
		...precedence === "caller-wins" ? providerHeaders : callerHeaders,
		...precedence === "caller-wins" ? callerHeaders : providerHeaders
	}),
	resolveModelRequestTimeoutMs: () => void 0,
	requiresManagedTransport: () => false,
	inheritManagedTransport: (_source, target) => target,
	transformTransportMessages: (messages, model, normalizeToolCallId) => transformMessages(messages, model, normalizeToolCallId),
	registerCustomApi: queueCustomApiRegistration,
	logDebug: () => {},
	logInfo: () => {},
	logWarn: () => {}
};
let activeAiTransportHost = inertAiTransportHost;
/** Installs host implementations for the transport policy ports. */
function configureAiTransportHost(host) {
	activeAiTransportHost = {
		...inertAiTransportHost,
		...host,
		normalizeAnthropicInlineContentBlocks: host.normalizeAnthropicInlineContentBlocks ?? inertAiTransportHost.normalizeAnthropicInlineContentBlocks,
		plugin: {
			...inertAiTransportHost.plugin,
			...host.plugin
		}
	};
	const transportHost = activeAiTransportHost;
	if (transportHost.registerCustomApi === inertAiTransportHost.registerCustomApi || pendingCustomApiRegistrations.length === 0) return;
	const pending = pendingCustomApiRegistrations.splice(0);
	for (const [index, registration] of pending.entries()) try {
		transportHost.registerCustomApi(registration.registry, registration.api, registration.streamFn);
	} catch (error) {
		pendingCustomApiRegistrations.unshift(...pending.slice(index));
		throw error;
	}
}
/** Returns the active transport host (inert defaults unless configured). */
function getAiTransportHost() {
	return activeAiTransportHost;
}
/** Resolves sentinel substrings in custom headers at a no-fetch adapter boundary. */
function resolveAiTransportHeaderSentinels(headers) {
	if (!headers) return;
	const host = getAiTransportHost();
	let resolvedHeaders;
	for (const [name, value] of Object.entries(headers)) {
		if (value === null) continue;
		const resolved = host.resolveSecretSentinel(value);
		if (resolved !== value) {
			resolvedHeaders ??= { ...headers };
			resolvedHeaders[name] = resolved;
		}
	}
	return resolvedHeaders ?? headers;
}
//#endregion
export { headersToRecord as A, mapAnthropicStopReason as C, resolveModelBoundThinkingReplayMode as D, resolveAnthropicThinkingEffort as E, modelsAreEqual as F, calculateCost as M, clampThinkingLevel as N, usesClaudeFable5MessagesContract as O, getSupportedThinkingLevels as P, defaultsClaudeAdaptiveThinking as S, requiresClaudeAdaptiveThinking as T, isImageWithMediaPayload as _, FAILED_ASSISTANT_REPLAY_TEXT as a, applyClaudeRequestContract as b, isReasoningOnlyLengthAssistantTurn as c, describeToolResultMediaPlaceholder as d, describeUnsupportedToolResultMedia as f, hasMediaPayload as g, formatToolResultText as h, transformMessages as i, applyProviderReportedUsageCost as j, usesClaudeStreamingRefusalContract as k, isStreamErrorFallbackContent as l, extractToolResultText as m, getAiTransportHost as n, STREAM_ERROR_FALLBACK_TEXT as o, extractToolResultBlockText as p, resolveAiTransportHeaderSentinels as r, hasOnlyAssistantReasoningContent as s, configureAiTransportHost as t, resolveFailedAssistantReplay as u, sanitizeSurrogates as v, prepareClaudeNoPrefillRequestContext as w, buildAnthropicClaudeCodeIdentity as x, ANTHROPIC_CLAUDE_CODE_VERSION as y };
