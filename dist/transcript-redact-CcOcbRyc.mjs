import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as findNormalizedProviderValue } from "./provider-id-DCtsDflE.mjs";
import { H as copyPreparedModelVisibleToolText, U as isPreparedModelVisibleToolText, _ as redactSensitiveText, f as redactModelVisibleToolPayloadTextWithConfig, h as redactSensitiveFieldValueWithConfig, q as readLoggingConfig, s as redactInputTextWithSourcePolicy, u as redactModelVisibleSensitiveFieldValueWithConfig, x as redactToolPayloadTextWithConfig } from "./redact-B5EGyLvV.mjs";
import { n as resolveProviderEndpoint } from "./provider-attribution-DUtJJsHV.mjs";
import { f as resolveCodeModeExecToolInputKind } from "./code-mode-control-tools-fvyqQnLi.mjs";
import { i as readNestedToolActivity } from "./nested-tool-activity-Cz_FrJ3z.mjs";
import { i as sanitizeInlineImageDataUrlForStorage, n as sanitizeInlineImageBase64 } from "./inline-image-data-url-BNbD0nU_.mjs";
import { parseExpressionAt, tokTypes, tokenizer } from "acorn";
import { OPENAI_RESPONSES_APIS, readOpenAIResponsesCompactionWindow } from "@openclaw/ai/internal/openai-responses-payload-policy";
//#region src/agents/transcript-code-mode-source.ts
const sourceAppends = /* @__PURE__ */ new WeakMap();
const responseSlots = /* @__PURE__ */ new WeakMap();
const pendingAppends = /* @__PURE__ */ new WeakMap();
function outerCalls(message) {
	return isRecord(message) && message.role === "assistant" && Array.isArray(message.content) ? message.content.filter((block) => isRecord(block) && block.type === "toolCall") : [];
}
/** Capture the prepared tool owner on this response, after provider normalization.
* Unsupported dialects must retain diagnostic masking, even on a marked tool.
*/
function wrapStreamFnCodeModeSource(base, toolNames) {
	const names = new Set(toolNames);
	return async (model, context, options) => {
		const stream = await base(model, context, options);
		const result = stream.result.bind(stream);
		let captured = false;
		const readResult = async () => {
			const message = await result();
			if (captured) return message;
			captured = true;
			const slots = outerCalls(message).flatMap((block) => {
				const language = resolveCodeModeExecToolInputKind(block.arguments);
				if (typeof block.id !== "string" || typeof block.name !== "string" || !names.has(block.name) || !language || !isRecord(block.arguments)) return [];
				const fields = /* @__PURE__ */ new Map();
				for (const key of ["code", "command"]) {
					const value = block.arguments[key];
					if (typeof value === "string") fields.set(key, value);
				}
				return fields.size ? [{
					block,
					id: block.id,
					name: block.name,
					language,
					fields
				}] : [];
			});
			if (!slots.length) return message;
			const token = {};
			sourceAppends.set(token, {
				message,
				slots,
				active: false
			});
			responseSlots.set(message.content, token);
			return message;
		};
		return {
			[Symbol.asyncIterator]: stream[Symbol.asyncIterator].bind(stream),
			result: readResult
		};
	};
}
/** Consume before extension hooks can replace or remove the response's calls. */
function takeCodeModeResponseSource(message) {
	if (message.role !== "assistant") return;
	const token = responseSlots.get(message.content);
	responseSlots.delete(message.content);
	const state = token && sourceAppends.get(token);
	if (state) state.message = message;
	return token;
}
/** Keep the carrier private: public append options and serialized messages gain no fields. */
function prepareCodeModeSourceAppend(options, message, token) {
	if (token && sourceAppends.get(token)?.message === message) pendingAppends.set(options, token);
	return options;
}
function getCodeModeSourceAppend(options) {
	const token = options && pendingAppends.get(options);
	return token && sourceAppends.get(token)?.active ? token : void 0;
}
function copyCodeModeSourceAppendOptions(original, copy) {
	const token = getCodeModeSourceAppend(original);
	if (token) pendingAppends.set(copy, token);
	return copy;
}
/** Consume once at the guard; retained options and nested appends cannot borrow this append. */
function withCodeModeSourceAppend(message, options, append) {
	const token = options && pendingAppends.get(options);
	if (options) pendingAppends.delete(options);
	const state = token && sourceAppends.get(token);
	if (!state || state.message !== message) return append();
	state.active = true;
	try {
		return append(token);
	} finally {
		sourceAppends.delete(token);
	}
}
function readCodeModeSourceFields(message, token) {
	const state = token && sourceAppends.get(token);
	const slots = state?.active && state.message === message ? state.slots : [];
	const calls = slots.length ? outerCalls(message) : [];
	const fields = /* @__PURE__ */ new Map();
	for (const slot of slots) {
		const block = calls.find((call) => call === slot.block);
		if (!block || block.id !== slot.id || block.name !== slot.name || resolveCodeModeExecToolInputKind(block.arguments) !== slot.language || !isRecord(block.arguments) || calls.filter((call) => call.id === slot.id).length !== 1) continue;
		const args = block.arguments;
		fields.set(block, new Map([...slot.fields].filter(([key, value]) => args[key] === value)));
	}
	return fields;
}
/** Hook replacements must retain the exact call objects; only owner-known copies may clone them. */
function copyCodeModeSourceAppend(original, copy, token, transformSource) {
	const state = token && sourceAppends.get(token);
	if (original === copy || !state?.active || state.message !== original) return;
	const originals = outerCalls(original);
	const copies = outerCalls(copy);
	const fieldsByBlock = readCodeModeSourceFields(original, token);
	const slots = [];
	for (const [index, block] of originals.entries()) {
		const fields = fieldsByBlock.get(block);
		const language = resolveCodeModeExecToolInputKind(block.arguments);
		const next = transformSource ? copies[index] : copies.find((call) => call === block);
		if (!fields?.size || !language || !next || next.id !== block.id || next.name !== block.name || resolveCodeModeExecToolInputKind(next.arguments) !== language || typeof next.id !== "string" || typeof next.name !== "string" || !isRecord(next.arguments)) continue;
		const transferred = /* @__PURE__ */ new Map();
		for (const [key, value] of fields) {
			const expected = transformSource ? transformSource(value) : value;
			if (next.arguments[key] === expected) transferred.set(key, expected);
		}
		slots.push({
			block: next,
			id: next.id,
			name: next.name,
			language,
			fields: transferred
		});
	}
	state.message = copy;
	state.slots = slots;
}
//#endregion
//#region src/logging/redact-source.ts
const MAX_SOURCE_REDACTION_SYNTAX_CHARS = 131072;
function createSourceAssignmentMatcher() {
	let parsedText;
	const tokens = /* @__PURE__ */ new Map();
	return (text, offset) => {
		if (text !== parsedText) {
			parsedText = text;
			tokens.clear();
			if (text.length <= MAX_SOURCE_REDACTION_SYNTAX_CHARS) try {
				for (const token of tokenizer(text, { ecmaVersion: "latest" })) tokens.set(token.start, token.type);
			} catch {
				tokens.clear();
			}
		}
		const token = tokens.get(offset);
		if (!token) return false;
		if (token === tokTypes.name) return true;
		try {
			const expression = parseExpressionAt(text, offset, {
				ecmaVersion: "latest",
				allowAwaitOutsideFunction: true
			});
			return expression.type === "Literal" ? typeof expression.value === "boolean" || expression.raw === "null" : expression.type !== "TemplateLiteral";
		} catch {
			return false;
		}
	};
}
function redactSourceInputTextWithConfig(text, loggingConfig) {
	if (text.length > MAX_SOURCE_REDACTION_SYNTAX_CHARS) return redactToolPayloadTextWithConfig(text, loggingConfig);
	return redactInputTextWithSourcePolicy(text, loggingConfig, createSourceAssignmentMatcher());
}
//#endregion
//#region src/agents/transcript-redact-images.ts
const isImageMimeType = (value) => typeof value === "string" && /^image\//iu.test(value.trim());
const normalizeImageMimeType = (value) => isImageMimeType(value) ? value.trim().toLowerCase() : void 0;
function imageMimeTypeForRecord(value) {
	return normalizeImageMimeType(value.mimeType) ?? normalizeImageMimeType(value.mediaType) ?? normalizeImageMimeType(value.media_type);
}
function imageMimeTypeFieldsForRecord(value) {
	return [
		"mimeType",
		"mediaType",
		"media_type"
	].filter((key) => isImageMimeType(value[key]));
}
function sanitizeOpaqueImageBase64(base64, mimeType) {
	return mimeType ? sanitizeInlineImageBase64({
		mimeType,
		base64
	}) : void 0;
}
function isValidOpaqueImageBase64(base64, mimeType) {
	return sanitizeOpaqueImageBase64(base64, mimeType) !== void 0;
}
function isOpaqueImageDataBlock(value) {
	return (value.type === "image" || value.type === "base64") && typeof value.data === "string" && isValidOpaqueImageBase64(value.data, imageMimeTypeForRecord(value));
}
function sanitizeTranscriptImageRecord(source) {
	const isImageBlock = source.type === "image";
	const isBase64SourceBlock = source.type === "base64";
	if (!isImageBlock && !isBase64SourceBlock || typeof source.data !== "string") return;
	const mimeTypeFields = imageMimeTypeFieldsForRecord(source);
	if (mimeTypeFields.length === 0) return;
	const sanitized = sanitizeOpaqueImageBase64(source.data, imageMimeTypeForRecord(source));
	if (!sanitized) return;
	const hasCanonicalMimeTypes = mimeTypeFields.every((key) => source[key] === sanitized.mimeType);
	if (source.data === sanitized.base64 && hasCanonicalMimeTypes) return source;
	const next = {
		...source,
		data: sanitized.base64
	};
	for (const field of mimeTypeFields) next[field] = sanitized.mimeType;
	return next;
}
function startsWithDataUrl(value) {
	return value.slice(0, 5).toLowerCase() === "data:";
}
function sanitizeImageDataUrlField(source, key, value) {
	if (!startsWithDataUrl(value)) return;
	return source.type === "input_image" && key === "image_url" || (source.type === "image" || source.type === "image_url") && key === "url" || source.type === "image" && (key === "source" || key === "data") ? sanitizeInlineImageDataUrlForStorage(value) : void 0;
}
function sanitizeTranscriptImageDataUrlField(params) {
	if (params.preserveImageDataUrlFields && params.key === "url") return startsWithDataUrl(params.value) ? sanitizeInlineImageDataUrlForStorage(params.value) : void 0;
	return sanitizeImageDataUrlField(params.source, params.key, params.value);
}
function shouldPreserveTranscriptImagePayload(source, key, item, preserveImageDataUrlFields) {
	if (typeof item !== "string") return false;
	if (key === "data" && isOpaqueImageDataBlock(source)) return true;
	if (preserveImageDataUrlFields && key === "url") return startsWithDataUrl(item) && sanitizeInlineImageDataUrlForStorage(item) !== void 0;
	return sanitizeImageDataUrlField(source, key, item) !== void 0;
}
function shouldPreserveNestedTranscriptImageDataUrlFields(source, key) {
	return key === "image_url" && (source.type === "image_url" || source.type === "input_image" || source.type === "image");
}
//#endregion
//#region src/agents/transcript-redact-replay.ts
const OPENAI_REPLAY_DESCRIPTOR = {
	replayTypes: ["openai-responses-compaction", "openai-responses-retained-compaction"],
	suppressionType: "openai-responses-compaction-suppression",
	matchesRoute: (route, helpers) => helpers.isOpenAIResponsesRoute(route),
	matchesApi: (api, _route, helpers) => typeof api === "string" && helpers.isOpenAIResponsesApi(api),
	sanitizeData: (data, _cfg, helpers) => helpers.isStructurallyValidOpaqueReplayToken(data) ? data : void 0,
	readId: (value, route, helpers) => typeof value.id === "string" && helpers.isOpenAIResponseItemId(value.id, route) ? value.id : void 0
};
const ANTHROPIC_REPLAY_DESCRIPTOR = {
	replayTypes: ["anthropic-compaction"],
	suppressionType: "anthropic-compaction-suppression",
	matchesRoute: (route, helpers) => helpers.isAnthropicReasoningRoute(route),
	matchesApi: (api, route) => api === route?.api,
	sanitizeData: (data, cfg, helpers) => data.length > 0 ? helpers.redactTranscriptText(data, cfg) : void 0
};
const REPLAY_DESCRIPTORS = [OPENAI_REPLAY_DESCRIPTOR, ANTHROPIC_REPLAY_DESCRIPTOR];
function sanitizeCompactedWindow(replay, cfg, helpers) {
	const window = replay.compactedWindow;
	return readOpenAIResponsesCompactionWindow(replay)?.every((item) => {
		if (item.type !== "compaction") return helpers.redactTranscriptStructuredValue(item, cfg) === item;
		const { encrypted_content: _encrypted, ...plaintext } = item;
		return helpers.redactTranscriptStructuredValue(plaintext, cfg) === plaintext;
	}) && window && typeof window === "object" && helpers.isPlainTranscriptObject(window) && typeof window.output === "string" ? {
		state: "ready",
		output: window.output
	} : { state: "refresh-required" };
}
function sanitizeCompactionReplayState(value, route, cfg, helpers) {
	if (!value || typeof value !== "object" || !helpers.isPlainTranscriptObject(value)) return;
	const replayType = typeof value.type === "string" ? value.type : "";
	const descriptor = REPLAY_DESCRIPTORS.find(({ replayTypes, suppressionType }) => replayTypes.includes(replayType) || replayType === suppressionType);
	const isSuppression = value.type === descriptor?.suppressionType;
	if (!descriptor || !descriptor.matchesRoute(route, helpers) || value.v !== 1 || typeof value.data !== "string" || value.type === "openai-responses-retained-compaction" && value.replayIndex !== void 0 || value.replayIndex !== void 0 && (isSuppression || !Number.isSafeInteger(value.replayIndex) || value.replayIndex < 0) || value.provider !== route?.provider || !descriptor.matchesApi(value.api, route, helpers) || value.model !== route?.model || !helpers.isOpenAIReplayContextHash(value.baseUrlHash) || value.sessionHash !== void 0 && !helpers.isOpenAIReplayContextHash(value.sessionHash) || value.authProfileHash !== void 0 && !helpers.isOpenAIReplayContextHash(value.authProfileHash)) return;
	const data = isSuppression ? value.data === "rejected" ? value.data : void 0 : descriptor.sanitizeData(value.data, cfg, helpers);
	if (data === void 0) return;
	const encryptedContent = !isSuppression && descriptor === ANTHROPIC_REPLAY_DESCRIPTOR ? value.encryptedContent : void 0;
	if (encryptedContent !== void 0 && encryptedContent !== null && (typeof encryptedContent !== "string" || !helpers.isStructurallyValidOpaqueReplayToken(encryptedContent))) return;
	const replayId = isSuppression ? void 0 : descriptor.readId?.(value, route, helpers);
	return {
		v: 1,
		type: value.type,
		...replayId !== void 0 ? { id: replayId } : {},
		data,
		...encryptedContent !== void 0 ? { encryptedContent } : {},
		...value.replayIndex !== void 0 ? { replayIndex: value.replayIndex } : {},
		provider: value.provider,
		api: value.api,
		model: value.model,
		baseUrlHash: value.baseUrlHash,
		...value.sessionHash !== void 0 ? { sessionHash: value.sessionHash } : {},
		...value.authProfileHash !== void 0 ? { authProfileHash: value.authProfileHash } : {},
		...!isSuppression && descriptor === OPENAI_REPLAY_DESCRIPTOR && value.compactedWindow !== void 0 ? { compactedWindow: sanitizeCompactedWindow({
			data,
			id: replayId,
			compactedWindow: value.compactedWindow
		}, cfg, helpers) } : {}
	};
}
//#endregion
//#region src/agents/transcript-redact-text.ts
function resolveTranscriptLoggingConfig(cfg) {
	const configuredLogging = readLoggingConfig();
	const redactPatterns = cfg?.logging?.redactPatterns ?? configuredLogging?.redactPatterns;
	return redactPatterns ? { redactPatterns } : void 0;
}
function redactTranscriptText(value, cfg, modelVisibleToolResult = false) {
	const loggingConfig = resolveTranscriptLoggingConfig(cfg);
	return modelVisibleToolResult ? redactModelVisibleToolPayloadTextWithConfig(value, loggingConfig) : redactToolPayloadTextWithConfig(value, loggingConfig);
}
function redactTranscriptStructuredFieldValue(key, value, cfg, modelVisibleToolResult = false) {
	return /^(?:next[_-]?)?page[_-]?token$|^page[_-]?cursor$/i.test(key) ? redactTranscriptText(value, cfg, modelVisibleToolResult) : modelVisibleToolResult ? redactModelVisibleSensitiveFieldValueWithConfig(key, value, resolveTranscriptLoggingConfig(cfg)) : redactSensitiveFieldValueWithConfig(key, value, resolveTranscriptLoggingConfig(cfg));
}
//#endregion
//#region src/agents/transcript-redact.ts
/**
* Agent transcript redaction helpers.
*
* Applies logging redaction rules to persisted messages while preserving unchanged object identity.
*/
function isPlainTranscriptObject(value) {
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
const GOOGLE_REASONING_APIS = /* @__PURE__ */ new Set([
	"google-generative-ai",
	"google-vertex",
	"google-gemini-cli",
	"openclaw-google-generative-ai-transport"
]);
const ANTHROPIC_REASONING_APIS = /* @__PURE__ */ new Set([
	"anthropic-messages",
	"bedrock-converse-stream",
	"openclaw-anthropic-messages-transport"
]);
const OPENAI_COMPLETIONS_APIS = /* @__PURE__ */ new Set(["openai-completions", "openclaw-openai-completions-transport"]);
const OPAQUE_REPLAY_TOKEN_RE = /^[A-Za-z0-9+/_-]+={0,2}$/;
const GOOGLE_THOUGHT_SIGNATURE_RE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const OPENAI_REPLAY_CONTEXT_HASH_RE = /^[a-z0-9]{2,16}$/;
function isOpenAIReplayContextHash(value) {
	return typeof value === "string" && OPENAI_REPLAY_CONTEXT_HASH_RE.test(value);
}
function isOpenAIResponsesApi(api) {
	return OPENAI_RESPONSES_APIS.has(api);
}
function isOpenAIResponsesRoute(route) {
	return typeof route?.api === "string" && isOpenAIResponsesApi(route.api);
}
function isGoogleReasoningRoute(route) {
	return typeof route?.api === "string" && GOOGLE_REASONING_APIS.has(route.api);
}
function isAnthropicReasoningRoute(route) {
	return typeof route?.api === "string" && ANTHROPIC_REASONING_APIS.has(route.api);
}
const isOpenAICompletionsRoute = (route) => OPENAI_COMPLETIONS_APIS.has(route?.api ?? "");
function isGoogleOpenAICompletionsRoute(route) {
	return isOpenAICompletionsRoute(route) && (route?.provider === "google" || route?.endpointClass === "google-generative-ai" || route?.endpointClass === "google-vertex");
}
function isVeniceGeminiOpenAICompletionsRoute(route) {
	return isOpenAICompletionsRoute(route) && route?.provider === "venice" && typeof route.model === "string" && /(?:^|\/)gemini-/.test(route.model.trim().toLowerCase());
}
function isCustomProviderRoute(route) {
	return Boolean(route?.api && route.model && route.provider) && route?.api !== "mistral-conversations" && !isOpenAIResponsesRoute(route) && !isGoogleReasoningRoute(route) && !isAnthropicReasoningRoute(route) && !isOpenAICompletionsRoute(route);
}
function isGitHubCopilotResponsesRoute(route) {
	return (route?.api === "openai-responses" || route?.api === "openclaw-openai-responses-transport") && route.provider === "github-copilot";
}
function isStructurallyValidOpaqueReplayToken(value) {
	return value.length > 0 && value === value.trim() && OPAQUE_REPLAY_TOKEN_RE.test(value) && !value.includes("…");
}
function isCredentialSafeOpaqueReplayToken(value) {
	if (!isStructurallyValidOpaqueReplayToken(value)) return false;
	return value.startsWith("gAAAA") || redactSensitiveText(value, { mode: "tools" }) === value;
}
function isGoogleThoughtSignature(value) {
	return value.length > 0 && value === value.trim() && !value.includes("…") && GOOGLE_THOUGHT_SIGNATURE_RE.test(value);
}
function resolveTranscriptAssistantRoute(source, cfg) {
	const api = typeof source.api === "string" ? source.api : void 0;
	const model = typeof source.model === "string" ? source.model : void 0;
	const provider = typeof source.provider === "string" ? source.provider : void 0;
	const providerConfig = provider ? findNormalizedProviderValue(cfg?.models?.providers, provider) : void 0;
	const baseUrl = (model ? providerConfig?.models?.find((candidate) => candidate.id === model) : void 0)?.baseUrl ?? providerConfig?.baseUrl;
	const endpointClass = baseUrl ? resolveProviderEndpoint(baseUrl).endpointClass : void 0;
	return {
		...api ? { api } : {},
		...endpointClass ? { endpointClass } : {},
		...model ? { model } : {},
		...provider ? { provider } : {}
	};
}
function isSafeReplayIdentifier(value, maxLength = 512) {
	return value.length > 0 && value.length <= maxLength && value === value.trim() && /^[A-Za-z0-9+/_:.=-]+$/.test(value) && redactSensitiveText(value, { mode: "tools" }) === value;
}
function isOpenAIResponseItemId(value, route) {
	return isSafeReplayIdentifier(value, isGitHubCopilotResponsesRoute(route) ? 64 : 512);
}
const replaySanitizerHelpers = {
	isAnthropicReasoningRoute,
	isOpenAIReplayContextHash,
	isOpenAIResponseItemId,
	isOpenAIResponsesApi,
	isOpenAIResponsesRoute,
	isPlainTranscriptObject,
	isStructurallyValidOpaqueReplayToken,
	redactTranscriptStructuredValue,
	redactTranscriptText
};
function isOpenAITextSignature(value, route) {
	if (value.startsWith("{")) try {
		const parsed = JSON.parse(value);
		if (!parsed || typeof parsed !== "object" || !isPlainTranscriptObject(parsed)) return false;
		if (!Object.keys(parsed).every((key) => key === "v" || key === "id" || key === "phase")) return false;
		const id = typeof parsed.id === "string" && isOpenAIResponseItemId(parsed.id, route) ? parsed.id : void 0;
		const phase = parsed.phase === "commentary" || parsed.phase === "final_answer" ? parsed.phase : void 0;
		if (parsed.id !== void 0 && id === void 0) return false;
		return parsed.v === 1 && (id !== void 0 || phase !== void 0);
	} catch {
		return false;
	}
	return isOpenAIResponseItemId(value, route);
}
const OPENAI_REASONING_REPLAY_METADATA_KEYS = /* @__PURE__ */ new Set([
	"v",
	"source",
	"provider",
	"api",
	"model",
	"baseUrlHash",
	"sessionHash",
	"authProfileHash"
]);
const OPENAI_REASONING_REPLAY_METADATA_KEY = "__openclaw_replay";
function sanitizeOpenAIReasoningReplayMetadata(value, route) {
	if (!value || typeof value !== "object" || !isPlainTranscriptObject(value) || !route?.api || !route.model || !route.provider) return;
	if (value.v !== 1 || value.source !== "openai-responses" || value.provider !== route?.provider || value.api !== route.api || value.model !== route.model || value.baseUrlHash !== void 0 && !isOpenAIReplayContextHash(value.baseUrlHash) || value.sessionHash !== void 0 && !isOpenAIReplayContextHash(value.sessionHash) || value.authProfileHash !== void 0 && !isOpenAIReplayContextHash(value.authProfileHash)) return;
	if (Object.keys(value).every((key) => OPENAI_REASONING_REPLAY_METADATA_KEYS.has(key))) return value;
	return {
		v: 1,
		source: "openai-responses",
		provider: value.provider,
		api: value.api,
		model: value.model,
		...value.baseUrlHash !== void 0 ? { baseUrlHash: value.baseUrlHash } : {},
		...value.sessionHash !== void 0 ? { sessionHash: value.sessionHash } : {},
		...value.authProfileHash !== void 0 ? { authProfileHash: value.authProfileHash } : {}
	};
}
function shouldPreserveOpaqueProviderPayload(source, key, item, location, route) {
	if (location !== "assistant-content-block" || typeof item !== "string") return false;
	const type = source.type;
	const isAnthropicSlot = type === "thinking" && (key === "thinkingSignature" || key === "signature") || type === "redacted_thinking" && (key === "data" || key === "signature" || key === "thinkingSignature");
	if (isAnthropicReasoningRoute(route) && isAnthropicSlot) return isStructurallyValidOpaqueReplayToken(item);
	const isGoogleSlot = type === "text" && key === "textSignature" || type === "thinking" && (key === "thinkingSignature" || key === "thought_signature") || type === "toolCall" && key === "thoughtSignature";
	if (isGoogleReasoningRoute(route) && isGoogleSlot) return isGoogleThoughtSignature(item);
	if ((isGoogleOpenAICompletionsRoute(route) || isVeniceGeminiOpenAICompletionsRoute(route)) && type === "toolCall" && key === "thoughtSignature") return isStructurallyValidOpaqueReplayToken(item);
	if (!isCustomProviderRoute(route) || !isCredentialSafeOpaqueReplayToken(item)) return false;
	return type === "text" && key === "textSignature" || type === "thinking" && (key === "thinkingSignature" || key === "signature" || key === "thought_signature") || type === "redacted_thinking" && (key === "data" || key === "signature" || key === "thinkingSignature") || type === "toolCall" && key === "thoughtSignature";
}
function sanitizeOpenAIReasoningSignature(value, route) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch {
		return;
	}
	if (!parsed || typeof parsed !== "object" || !isPlainTranscriptObject(parsed) || parsed.type !== "reasoning" || parsed.summary !== void 0 && !Array.isArray(parsed.summary)) return;
	const encryptedContent = parsed.encrypted_content;
	const hasEncryptedContent = Object.hasOwn(parsed, "encrypted_content");
	const isValidEncryptedContent = isOpenAIResponsesRoute(route) ? isStructurallyValidOpaqueReplayToken : isCredentialSafeOpaqueReplayToken;
	if (encryptedContent !== void 0 && encryptedContent !== null && (typeof encryptedContent !== "string" || !isValidEncryptedContent(encryptedContent))) return;
	if (parsed.id !== void 0 && (typeof parsed.id !== "string" || !isOpenAIResponseItemId(parsed.id, route))) return;
	if (parsed.status !== void 0 && parsed.status !== "in_progress" && parsed.status !== "completed" && parsed.status !== "incomplete") return;
	if (!hasEncryptedContent && typeof parsed.id !== "string") return;
	const replayMetadata = sanitizeOpenAIReasoningReplayMetadata(parsed[OPENAI_REASONING_REPLAY_METADATA_KEY], route);
	return JSON.stringify({
		...typeof parsed.id === "string" ? { id: parsed.id } : {},
		type: "reasoning",
		summary: [],
		...parsed.status !== void 0 ? { status: parsed.status } : {},
		...hasEncryptedContent ? { encrypted_content: encryptedContent } : {},
		...replayMetadata ? { [OPENAI_REASONING_REPLAY_METADATA_KEY]: replayMetadata } : {}
	});
}
function sanitizeOpenAICompletionsToolSignature(value, route) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch {
		return;
	}
	const isValidEncryptedData = isOpenAICompletionsRoute(route) ? isStructurallyValidOpaqueReplayToken : isCredentialSafeOpaqueReplayToken;
	if (!parsed || typeof parsed !== "object" || !isPlainTranscriptObject(parsed) || parsed.type !== "reasoning.encrypted" || typeof parsed.data !== "string" || !isValidEncryptedData(parsed.data) || parsed.id !== void 0 && parsed.id !== null && (typeof parsed.id !== "string" || !isSafeReplayIdentifier(parsed.id)) || parsed.format !== void 0 && parsed.format !== null && (typeof parsed.format !== "string" || parsed.format.length > 64 || !/^[a-z0-9.-]+$/.test(parsed.format)) || parsed.index !== void 0 && (!Number.isSafeInteger(parsed.index) || parsed.index < 0)) return;
	return JSON.stringify({
		type: "reasoning.encrypted",
		data: parsed.data,
		...parsed.id !== void 0 ? { id: parsed.id } : {},
		...parsed.format !== void 0 ? { format: parsed.format } : {},
		...parsed.index !== void 0 ? { index: parsed.index } : {}
	});
}
function redactTranscriptStructuredValue(value, cfg, fieldKey, seen = /* @__PURE__ */ new WeakSet(), preserveImageDataUrlFields = false, location = "nested", assistantRoute, modelVisibleToolResult = false, sourceFields, sourceSlots) {
	if (typeof value === "string") {
		if (fieldKey) return redactTranscriptStructuredFieldValue(fieldKey, value, cfg, modelVisibleToolResult);
		return redactTranscriptText(value, cfg, modelVisibleToolResult);
	}
	if (Array.isArray(value)) {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		let changed = false;
		const redacted = value.map((item) => {
			const next = redactTranscriptStructuredValue(item, cfg, fieldKey, seen, preserveImageDataUrlFields, location === "assistant-content-array" ? "assistant-content-block" : "nested", assistantRoute, modelVisibleToolResult, void 0, sourceSlots);
			changed ||= next !== item;
			return next;
		});
		seen.delete(value);
		return changed ? redacted : value;
	}
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return "[Circular]";
	if (!isPlainTranscriptObject(value)) return value;
	seen.add(value);
	const source = sanitizeTranscriptImageRecord(value) ?? value;
	const currentAssistantRoute = location === "root" && source.role === "assistant" ? resolveTranscriptAssistantRoute(source, cfg) : assistantRoute;
	let next = null;
	if (source !== value) next = { ...source };
	for (const [key, item] of Object.entries(source)) {
		if (modelVisibleToolResult && key === "text" && typeof item === "string" && isPreparedModelVisibleToolText(source, item, resolveTranscriptLoggingConfig(cfg))) continue;
		if (location === "root" && key === "idempotencyKey") continue;
		if (typeof item === "string" && (location === "root" && source.role === "toolResult" && key === "toolCallId" || location === "assistant-content-block" && source.type === "toolCall" && key === "id" || location === "nested-tool-details" && (key === "toolCallId" || key === "parentToolCallId" || key === "runId" || key === "scopeId" || key === "afterEntryId"))) continue;
		if (location === "root" && source.role === "assistant" && key === "providerReplay") {
			const sanitizedReplay = sanitizeCompactionReplayState(item, currentAssistantRoute, cfg, replaySanitizerHelpers);
			if (sanitizedReplay !== void 0) {
				if (sanitizedReplay !== item) {
					next ??= { ...source };
					next[key] = sanitizedReplay;
				}
				continue;
			}
			next ??= { ...source };
			delete next[key];
			continue;
		}
		if (location === "assistant-content-block" && (isOpenAIResponsesRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "thinking" && key === "openclawReasoningReplay") {
			const sanitizedMetadata = sanitizeOpenAIReasoningReplayMetadata(item, currentAssistantRoute);
			if (sanitizedMetadata !== void 0) {
				if (sanitizedMetadata !== item) {
					next ??= { ...source };
					next[key] = sanitizedMetadata;
				}
				continue;
			}
		}
		if (location === "assistant-content-block" && (isOpenAIResponsesRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "thinking" && key === "thinkingSignature" && typeof item === "string") {
			const sanitizedSignature = sanitizeOpenAIReasoningSignature(item, currentAssistantRoute);
			if (sanitizedSignature !== void 0) {
				if (sanitizedSignature !== item) {
					next ??= { ...source };
					next[key] = sanitizedSignature;
				}
				continue;
			}
		}
		if (location === "assistant-content-block" && (isOpenAIResponsesRoute(currentAssistantRoute) || isOpenAICompletionsRoute(currentAssistantRoute) || isAnthropicReasoningRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "text" && key === "textSignature" && typeof item === "string" && isOpenAITextSignature(item, currentAssistantRoute)) continue;
		if (location === "assistant-content-block" && (isOpenAICompletionsRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "toolCall" && key === "thoughtSignature" && typeof item === "string") {
			const sanitizedSignature = sanitizeOpenAICompletionsToolSignature(item, currentAssistantRoute);
			if (sanitizedSignature !== void 0) {
				if (sanitizedSignature !== item) {
					next ??= { ...source };
					next[key] = sanitizedSignature;
				}
				continue;
			}
		}
		if (shouldPreserveOpaqueProviderPayload(source, key, item, location, currentAssistantRoute)) continue;
		if (typeof item === "string") {
			const sanitizedDataUrl = sanitizeTranscriptImageDataUrlField({
				source,
				key,
				value: item,
				preserveImageDataUrlFields
			});
			if (sanitizedDataUrl !== void 0) {
				if (sanitizedDataUrl !== item) {
					next ??= { ...source };
					next[key] = sanitizedDataUrl;
				}
				continue;
			}
		}
		if (shouldPreserveTranscriptImagePayload(source, key, item, preserveImageDataUrlFields)) continue;
		const redacted = typeof item === "string" && sourceFields?.get(key) === item ? redactSourceInputTextWithConfig(item, resolveTranscriptLoggingConfig(cfg)) : redactTranscriptStructuredValue(item, cfg, key, seen, preserveImageDataUrlFields || shouldPreserveNestedTranscriptImageDataUrlFields(source, key), location === "root" && source.role === "assistant" && key === "content" && Array.isArray(item) ? "assistant-content-array" : location === "root" && key === "details" && readNestedToolActivity(source) ? "nested-tool-details" : "nested", currentAssistantRoute, modelVisibleToolResult || location === "root" && source.role === "toolResult" && key === "content", location === "assistant-content-block" && key === "arguments" ? sourceSlots?.get(source) : void 0, sourceSlots);
		if (redacted === item) continue;
		next ??= { ...source };
		next[key] = redacted;
	}
	if (fieldKey === "__openclaw" && next) {
		if (next.senderIdentity !== source.senderIdentity || next.senderId !== source.senderId) delete next.senderIdentity;
		if (next.humanMentions !== source.humanMentions) delete next.humanMentions;
	}
	if (location === "root" && source.role === "user" && next && next.content !== source.content) {
		const metadata = asOptionalRecord(next["__openclaw"]);
		if (metadata?.humanMentions !== void 0) {
			const retained = { ...metadata };
			delete retained.humanMentions;
			next["__openclaw"] = retained;
		}
	}
	seen.delete(value);
	if (next && modelVisibleToolResult) copyPreparedModelVisibleToolText(source, next);
	return next ?? value;
}
/** Return a redacted transcript message according to logging config. */
function redactTranscriptMessage(message, cfg, sourceAppend) {
	const redacted = redactTranscriptStructuredValue(message, cfg, void 0, /* @__PURE__ */ new WeakSet(), false, "root", void 0, false, void 0, readCodeModeSourceFields(message, sourceAppend));
	copyCodeModeSourceAppend(message, redacted, sourceAppend, (source) => redactSourceInputTextWithConfig(source, resolveTranscriptLoggingConfig(cfg)));
	return redacted;
}
//#endregion
export { getCodeModeSourceAppend as a, withCodeModeSourceAppend as c, copyCodeModeSourceAppendOptions as i, wrapStreamFnCodeModeSource as l, resolveTranscriptLoggingConfig as n, prepareCodeModeSourceAppend as o, copyCodeModeSourceAppend as r, takeCodeModeResponseSource as s, redactTranscriptMessage as t };
