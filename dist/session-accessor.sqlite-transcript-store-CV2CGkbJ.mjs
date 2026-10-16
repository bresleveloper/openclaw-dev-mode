import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { H as copyPreparedModelVisibleToolText, U as isPreparedModelVisibleToolText, _ as redactSensitiveText, f as redactModelVisibleToolPayloadTextWithConfig, h as redactSensitiveFieldValueWithConfig, p as redactSecrets, q as readLoggingConfig, s as redactInputTextWithSourcePolicy, t as captureSensitiveTextRedactionSnapshot, u as redactModelVisibleSensitiveFieldValueWithConfig, x as redactToolPayloadTextWithConfig } from "./redact-DJ8j6ADa.mjs";
import { c as withSecretRedactionRegistrySnapshot } from "./secret-redaction-registry-DorVHn0l.mjs";
import { c as prepareSqliteQuerySync, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as findNormalizedProviderValue } from "./provider-id-D1VImdKk.mjs";
import { c as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { i as prepareTranscriptPayload, n as createTranscriptEventInserter, r as createTranscriptPayloadUpdater, s as transcriptEventJsonSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { r as resolveProviderEndpoint } from "./provider-attribution-DCsKu1Yv.mjs";
import { n as isKnownCliHistoryBoundary, t as getCliHistoryWriter } from "./cli-history-boundary-CwwMqsE-.mjs";
import { r as canonicalizePersistedUserMessageMedia } from "./media-facts-CJdQ4R61.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { d as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Dv1lK4ND.mjs";
import { C as transcriptEventContextEligibility, a as deleteSessionTranscriptIndexInTransaction, b as extractTranscriptIndexEntry, f as sessionTranscriptIndexNeedsReconcile, l as markSessionTranscriptIndexDirtyInTransaction, p as shouldRebuildSessionTranscriptIndexSynchronously, r as createTranscriptIndexAppenderInTransaction, u as reconcileSessionTranscriptIndexInTransaction, x as hasTranscriptMessage } from "./session-transcript-index-FbEuN6S5.mjs";
import { l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { d as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { a as readNestedToolActivity } from "./nested-tool-activity-CFIuxE4G.mjs";
import { p as resolveCodeModeExecToolInputKind } from "./code-mode-control-tools-CpOmDfxq.mjs";
import { i as sanitizeInlineImageDataUrlForStorage, n as sanitizeInlineImageBase64 } from "./inline-image-data-url-Cu31GIq2.mjs";
import { a as normalizePersistedSteerTargetRunId } from "./user-turn-transcript.metadata-CNurmdgT.mjs";
import { a as pruneTranscriptReactionsInTransaction, c as readTranscriptGenerationInTransaction, d as touchTranscriptMutationInTransaction, i as ensureTranscriptSessionRoot, l as readTranscriptMutationStateInTransaction, n as deleteTranscriptEventsInTransaction, o as readNextTranscriptSeq, r as ensureTranscriptGenerationInTransaction, t as advanceTranscriptMutationAtInTransaction, u as rotateTranscriptGenerationInTransaction } from "./session-accessor.sqlite-transcript-state-xJ1TJ9j2.mjs";
import { t as readHotSessionTranscriptSnapshot } from "./session-cold-storage-read-rGbdRuJQ.mjs";
import { _ as readTranscriptEventMessage, b as readTranscriptIdentityByEventId, g as readTranscriptEventId, n as findAssistantTranscriptEventInDatabase, p as readEventTimestamp, t as createTranscriptIdentityReader } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { t as copyRetainedTranscriptPayload } from "./session-transcript-retained-data-31r579xq.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
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
function withCodeModeSourceAppend(message, options, append) {
	const token = options && pendingAppends.get(options);
	if (options) pendingAppends.delete(options);
	const state = token && sourceAppends.get(token);
	if (!state || state.message !== message) return append();
	state.active = true;
	let result;
	try {
		result = append(token);
	} catch (error) {
		sourceAppends.delete(token);
		throw error;
	}
	if (result instanceof Promise) return result.finally(() => sourceAppends.delete(token));
	sourceAppends.delete(token);
	return result;
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
function sanitizeTranscriptImageDataUrlField({ source, key, value, preserveImageDataUrlFields }) {
	if (!startsWithDataUrl(value)) return;
	return preserveImageDataUrlFields && key === "url" || source.type === "input_image" && key === "image_url" || (source.type === "image" || source.type === "image_url") && key === "url" || source.type === "image" && (key === "source" || key === "data") ? sanitizeInlineImageDataUrlForStorage(value) : void 0;
}
function shouldPreserveNestedTranscriptImageDataUrlFields(source, key) {
	return key === "image_url" && (source.type === "image_url" || source.type === "input_image" || source.type === "image");
}
//#endregion
//#region src/agents/transcript-redact-replay.ts
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
	const openAISuppression = replayType === "openai-responses-compaction-suppression";
	const anthropicSuppression = replayType === "anthropic-compaction-suppression";
	const isOpenAI = openAISuppression || replayType === "openai-responses-compaction" || replayType === "openai-responses-retained-compaction";
	const isAnthropic = anthropicSuppression || replayType === "anthropic-compaction";
	const isSuppression = openAISuppression || anthropicSuppression;
	if (!isOpenAI && !isAnthropic || !(isOpenAI ? helpers.isOpenAIResponsesRoute(route) : helpers.isAnthropicReasoningRoute(route)) || value.v !== 1 || typeof value.data !== "string" || value.type === "openai-responses-retained-compaction" && value.replayIndex !== void 0 || value.replayIndex !== void 0 && (isSuppression || !Number.isSafeInteger(value.replayIndex) || value.replayIndex < 0) || value.provider !== route?.provider || !(isOpenAI ? typeof value.api === "string" && helpers.isOpenAIResponsesApi(value.api) : value.api === route?.api) || value.model !== route?.model || !helpers.isOpenAIReplayContextHash(value.baseUrlHash) || value.sessionHash !== void 0 && !helpers.isOpenAIReplayContextHash(value.sessionHash) || value.authProfileHash !== void 0 && !helpers.isOpenAIReplayContextHash(value.authProfileHash)) return;
	const data = isSuppression ? value.data === "rejected" ? value.data : void 0 : isOpenAI ? helpers.isStructurallyValidOpaqueReplayToken(value.data) ? value.data : void 0 : value.data.length > 0 ? helpers.redactTranscriptText(value.data, cfg) : void 0;
	if (data === void 0) return;
	const encryptedContent = !isSuppression && isAnthropic ? value.encryptedContent : void 0;
	if (encryptedContent !== void 0 && encryptedContent !== null && (typeof encryptedContent !== "string" || !helpers.isStructurallyValidOpaqueReplayToken(encryptedContent))) return;
	const replayId = !isSuppression && isOpenAI && typeof value.id === "string" && helpers.isOpenAIResponseItemId(value.id, route) ? value.id : void 0;
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
		...!isSuppression && isOpenAI && value.compactedWindow !== void 0 ? { compactedWindow: sanitizeCompactedWindow({
			data,
			id: replayId,
			compactedWindow: value.compactedWindow
		}, cfg, helpers) } : {}
	};
}
//#endregion
//#region src/agents/transcript-redact-text.ts
const transcriptPolicy = resolveGlobalSingleton(Symbol.for("openclaw.transcriptRedactionPolicy"), () => ({
	token: 0,
	registryRevision: -1,
	scope: new AsyncLocalStorage()
}));
/** Contains exact secret values for trusted worker redaction; never log or use it as a cache key. */
function captureTranscriptRedactionSnapshot() {
	const patterns = [...readLoggingConfig()?.redactPatterns ?? []];
	const snapshot = captureSensitiveTextRedactionSnapshot();
	if (snapshot.registryRevision !== transcriptPolicy.registryRevision || patterns.length !== transcriptPolicy.patterns?.length || patterns.some((pattern, index) => pattern !== transcriptPolicy.patterns?.[index])) {
		transcriptPolicy.token++;
		transcriptPolicy.patterns = patterns;
		transcriptPolicy.registryRevision = snapshot.registryRevision;
	}
	return {
		...snapshot,
		patterns,
		policyToken: transcriptPolicy.token,
		retainedBytes: 512 + [...patterns, ...snapshot.registeredSecretValues].reduce((bytes, value) => bytes + value.length * 2 + 16, 0)
	};
}
function withTranscriptRedactionSnapshot(snapshot, run) {
	return withSecretRedactionRegistrySnapshot({
		revision: snapshot.registryRevision,
		values: snapshot.registeredSecretValues
	}, () => transcriptPolicy.scope.run(snapshot, run));
}
function resolveTranscriptLoggingConfig(cfg) {
	const redactPatterns = cfg?.logging?.redactPatterns ?? transcriptPolicy.scope.getStore()?.patterns ?? readLoggingConfig()?.redactPatterns;
	return redactPatterns ? { redactPatterns: [...redactPatterns] } : void 0;
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
	"google-interactions",
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
	if (!isOpenAIResponsesRoute(route) && !isCustomProviderRoute(route)) return;
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
	if (parsed.id !== void 0 && (typeof parsed.id !== "string" || !(isOpenAIResponsesRoute(route) ? isSafeReplayIdentifier(parsed.id, Infinity) : isOpenAIResponseItemId(parsed.id, route)))) return;
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
	const sanitizedImageRecord = sanitizeTranscriptImageRecord(value);
	const source = sanitizedImageRecord ?? value;
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
		if (location === "assistant-content-block" && source.type === "thinking" && key === "thinkingSignature" && typeof item === "string") {
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
		if (key === "data" && sanitizedImageRecord) continue;
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
//#region src/config/sessions/session-accessor.sqlite-cli-history-boundary.ts
/** Advance only a contiguous prefix written by the exact prepared CLI account's live owner. */
function advanceCliHistoryBoundaryInTransaction(database, scope, seq) {
	const writer = getCliHistoryWriter({
		...scope,
		storePath: database.path
	});
	if (writer) advanceCliHistoryBoundaryRangeInTransaction(database, scope, {
		first: seq,
		last: seq
	}, writer, writer.assertCurrent);
}
/** A worker carries account facts; its host-held live owner still grants this exact commit. */
function advanceCliHistoryBoundaryRangeInTransaction(database, scope, range, writer, assertCurrent) {
	if (range.last < range.first) return false;
	const entry = readSessionEntryRow(database, scope.sessionKey)?.entry;
	const boundary = entry?.cliHistoryBoundary;
	const generation = readTranscriptGenerationInTransaction(database, scope.sessionId);
	if (!entry || !isKnownCliHistoryBoundary(boundary) || entry.sessionId !== scope.sessionId || boundary.sessionId !== scope.sessionId || entry.activeWriterRunId !== writer.runId || entry.lifecycleRevision !== writer.lifecycleRevision || boundary.writerRunId !== writer.runId || boundary.authFingerprint !== writer.authFingerprint || (boundary.maxSeq === null ? range.first !== 0 : boundary.maxSeq !== range.first - 1) || !generation || (boundary.generation === null ? range.first !== 0 : boundary.generation !== generation)) return false;
	assertCurrent();
	writeSessionEntry(database, scope.sessionKey, {
		...entry,
		cliHistoryBoundary: {
			...boundary,
			generation,
			maxSeq: range.last
		}
	}, { previousEntry: entry });
	return true;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-store.ts
function createTranscriptIdentityInserter(database, sessionId, ignoreConflicts) {
	return prepareSqliteQuerySync(database.db, (parameter) => getSessionKysely(database.db).insertInto("transcript_event_identities").values({
		session_id: sessionId,
		event_id: parameter((row) => row.eventId),
		seq: parameter((row) => row.seq),
		event_type: parameter((row) => row.eventType),
		parent_id: parameter((row) => row.parentId),
		message_idempotency_key: parameter((row) => row.messageIdempotencyKey),
		created_at: parameter((row) => row.createdAt)
	}).$if(ignoreConflicts, (query) => query.onConflict((conflict) => conflict.columns(["session_id", "event_id"]).doNothing())));
}
/** Inserts exact transcript rows without mutating the forward-only projection. */
function insertTranscriptRowsWithoutProjectionInTransaction(database, sessionId, rows, reservedMessageIdempotencyKeys = /* @__PURE__ */ new Set()) {
	const insertEvent = createTranscriptEventInserter(database.db, sessionId);
	const insertIdentity = createTranscriptIdentityInserter(database, sessionId, false);
	for (const row of rows) {
		const event = canonicalizeTranscriptEventMedia(row.event);
		if (row.storedEventSeq === void 0) insertEvent({
			seq: row.seq,
			eventJson: JSON.stringify(event),
			createdAt: row.createdAt
		});
		else copyRetainedTranscriptPayload(database, sessionId, row.storedEventSeq, row.seq);
		const identity = readTranscriptEventIdentity(event);
		if (!identity) continue;
		if ("messageIdempotencyKey" in row) identity.messageIdempotencyKey = row.messageIdempotencyKey ?? null;
		else if (identity.messageIdempotencyKey && (reservedMessageIdempotencyKeys.has(identity.messageIdempotencyKey) || readIdempotencyKeyOwner(database, sessionId, identity.messageIdempotencyKey))) identity.messageIdempotencyKey = null;
		insertIdentity({
			...identity,
			seq: row.seq,
			createdAt: row.createdAt
		});
	}
}
/** Returns the exact committed JSON, or false when an existing identity owns the event. */
function appendTranscriptEventInTransaction(database, scope, event, options = {}, cursor = {}) {
	const persistedEvent = options.eventJson === void 0 ? canonicalizeTranscriptEventMedia(event) : event;
	const db = getSessionKysely(database.db);
	const createdAt = readEventTimestamp(persistedEvent) ?? Date.now();
	if (cursor.initialized) {
		cursor.updateWindow ??= prepareSqliteQuerySync(database.db, (parameter) => db.updateTable("session_windows").set({ updated_at: parameter((timestamp) => timestamp) }).where("session_id", "=", scope.sessionId));
		cursor.updateWindow(createdAt);
	} else {
		ensureTranscriptSessionRoot(database, scope, createdAt, {
			allowStoredAlias: options.allowStoredAlias === true,
			onPlaceholderInserted: options.onPlaceholderInserted
		});
		ensureTranscriptGenerationInTransaction(database, scope.sessionId);
		cursor.initialized = true;
	}
	const identity = readTranscriptEventIdentity(persistedEvent);
	if (identity) {
		cursor.readIdentity ??= createTranscriptIdentityReader(database, scope.sessionId);
		if (cursor.readIdentity(identity.eventId)) return false;
	}
	const idempotencyKeyOwner = identity?.messageIdempotencyKey ? readIdempotencyKeyOwner(database, scope.sessionId, identity.messageIdempotencyKey) : void 0;
	if (idempotencyKeyOwner && options.idempotencyKeyMode === "dedupe") return false;
	const seq = cursor.nextSeq ?? readNextTranscriptSeq(database, scope.sessionId);
	cursor.insertEvent ??= createTranscriptEventInserter(database.db, scope.sessionId);
	const eventJson = options.eventJson ?? JSON.stringify(persistedEvent);
	cursor.insertEvent({
		seq,
		eventJson,
		createdAt,
		parsedEvent: options.eventJson === void 0 ? void 0 : persistedEvent,
		preparedPayload: options.preparedPayload
	});
	cursor.nextSeq = seq + 1;
	if (options.touchMutation !== false) touchTranscriptMutationInTransaction(database, scope.sessionId);
	cursor.appendToIndex ??= createTranscriptIndexAppenderInTransaction(database.db, scope.sessionId);
	const projectionNeedsRebuild = cursor.appendToIndex({
		seq,
		event: persistedEvent,
		eventId: identity?.eventId ?? null,
		createdAt
	});
	if (projectionNeedsRebuild) options.onProjectionReconcileNeeded?.();
	if (identity) {
		if (idempotencyKeyOwner && options.idempotencyKeyMode === "relocate-owner") executeSqliteQuerySync(database.db, db.updateTable("transcript_event_identities").set({ message_idempotency_key: null }).where("session_id", "=", scope.sessionId).where("event_id", "=", idempotencyKeyOwner.eventId));
		identity.messageIdempotencyKey = idempotencyKeyOwner && options.idempotencyKeyMode !== "relocate-owner" ? null : identity.messageIdempotencyKey;
		cursor.insertIdentity ??= createTranscriptIdentityInserter(database, scope.sessionId, true);
		cursor.insertIdentity({
			...identity,
			seq,
			createdAt
		});
	}
	advanceCliHistoryBoundaryInTransaction(database, scope, seq);
	scheduleTranscriptProjectionReconcile(database, scope.sessionId, projectionNeedsRebuild, options);
	return eventJson;
}
function scheduleTranscriptProjectionReconcile(database, sessionId, projectionNeedsRebuild, options) {
	if (!projectionNeedsRebuild || options.scheduleProjectionReconcile === false) return;
	deferOpenClawAgentPostCommitPublication(database, (databaseOptions) => startSessionTranscriptIndexReconcile({
		...databaseOptions,
		preferredSessionId: sessionId
	}));
}
function appendTranscriptEventsInTransaction(database, scope, events, options = {}) {
	let appended = 0;
	let projectionNeedsRebuild = false;
	const cursor = {};
	const iterator = events[Symbol.iterator]();
	const appendOptions = {
		...options,
		onProjectionReconcileNeeded: () => {
			projectionNeedsRebuild = true;
		},
		scheduleProjectionReconcile: false,
		touchMutation: false
	};
	try {
		let next = iterator.next();
		while (!next.done) {
			const inserted = appendTranscriptEventInTransaction(database, scope, next.value, appendOptions, cursor);
			if (inserted) appended += 1;
			next = iterator.next(inserted !== false);
		}
	} catch (error) {
		try {
			iterator.return?.();
		} catch {}
		throw error;
	}
	if (appended > 0) {
		if (options.touchMutation !== false) touchTranscriptMutationInTransaction(database, scope.sessionId);
		scheduleTranscriptProjectionReconcile(database, scope.sessionId, projectionNeedsRebuild, options);
	}
	return appended;
}
function replaceSqliteTranscriptEventsInTransaction(database, resolved, events, options = {}) {
	const rebuildSynchronously = events.length > 0 && shouldRebuildSessionTranscriptIndexSynchronously(database.db, resolved.sessionId, events);
	const preservedTranscriptUpdatedAt = options.preserveSessionWindowRecency === true ? readTranscriptMutationStateInTransaction(database, resolved.sessionId).updatedAt : void 0;
	const previousGeneration = readTranscriptGenerationInTransaction(database, resolved.sessionId);
	const deleted = deleteTranscriptEventsInTransaction(database, resolved.sessionId);
	if (events.length === 0) {
		pruneTranscriptReactionsInTransaction(database, resolved);
		deleteSessionTranscriptIndexInTransaction(database.db, resolved.sessionId);
		if (deleted || previousGeneration) {
			rotateTranscriptGenerationInTransaction(database, resolved.sessionId);
			recordTranscriptReplacementMutation(database, resolved.sessionId, preservedTranscriptUpdatedAt);
		}
		return;
	}
	if (!deleted || options.preserveSessionWindowRecency !== true) ensureTranscriptSessionRoot(database, resolved, readEventTimestamp(events[0]) ?? Date.now());
	if (deleted || previousGeneration) rotateTranscriptGenerationInTransaction(database, resolved.sessionId);
	else ensureTranscriptGenerationInTransaction(database, resolved.sessionId);
	if (rebuildSynchronously) deleteSessionTranscriptIndexInTransaction(database.db, resolved.sessionId);
	else markSessionTranscriptIndexDirtyInTransaction(database.db, resolved.sessionId);
	let seq = 0;
	const seenEventIds = /* @__PURE__ */ new Set();
	const seenMessageIdempotencyKeys = /* @__PURE__ */ new Set();
	const insertEvent = createTranscriptEventInserter(database.db, resolved.sessionId);
	const insertIdentity = createTranscriptIdentityInserter(database, resolved.sessionId, false);
	const appendToIndex = createTranscriptIndexAppenderInTransaction(database.db, resolved.sessionId);
	for (const [eventIndex, event] of events.entries()) {
		const persistedEvent = canonicalizeTranscriptEventMedia(event);
		const createdAt = options.createdAtByIndex?.[eventIndex] ?? readEventTimestamp(persistedEvent) ?? Date.now();
		const identity = readTranscriptEventIdentity(persistedEvent);
		if (identity && seenEventIds.has(identity.eventId)) continue;
		insertEvent({
			seq,
			eventJson: JSON.stringify(persistedEvent),
			createdAt
		});
		appendToIndex({
			seq,
			event: persistedEvent,
			eventId: identity?.eventId ?? null,
			createdAt
		});
		if (identity) {
			seenEventIds.add(identity.eventId);
			if (identity.messageIdempotencyKey) {
				if (seenMessageIdempotencyKeys.has(identity.messageIdempotencyKey)) identity.messageIdempotencyKey = null;
				else seenMessageIdempotencyKeys.add(identity.messageIdempotencyKey);
			}
			insertIdentity({
				...identity,
				seq,
				createdAt
			});
		}
		seq += 1;
	}
	pruneTranscriptReactionsInTransaction(database, resolved);
	if (deleted || seq > 0) {
		recordTranscriptReplacementMutation(database, resolved.sessionId, preservedTranscriptUpdatedAt);
		if (rebuildSynchronously) reconcileSessionTranscriptIndexInTransaction(database.db, resolved.sessionId);
		else {
			options.onProjectionReconcileNeeded?.();
			scheduleTranscriptProjectionReconcile(database, resolved.sessionId, true, options);
		}
	}
}
function recordTranscriptReplacementMutation(database, sessionId, preservedUpdatedAt) {
	if (preservedUpdatedAt === void 0 || preservedUpdatedAt === null) {
		touchTranscriptMutationInTransaction(database, sessionId);
		return;
	}
	advanceTranscriptMutationAtInTransaction(database, sessionId, preservedUpdatedAt, { strictly: true });
}
/** Rewrite existing transcript rows exactly, without append-time deduplication. */
function rewriteSqliteTranscriptEventRowsInTransaction(database, resolved, rows, options = {}) {
	if (rows.length === 0) return;
	const rewrites = rows.map((row) => {
		const eventJson = JSON.stringify(canonicalizeTranscriptEventMedia(row.event));
		return {
			...row,
			eventJson,
			payload: options.legacyTextStorage ? void 0 : prepareTranscriptPayload(database.db, eventJson)
		};
	});
	const projectionUnchanged = !sessionTranscriptIndexNeedsReconcile(database.db, resolved.sessionId) && rewrites.every((row) => transcriptRewritePreservesProjection(row.expectedEventJson, row.eventJson));
	const rebuildSynchronously = !options.legacyTextStorage && !projectionUnchanged && shouldRebuildSessionTranscriptIndexSynchronously(database.db, resolved.sessionId);
	const db = getSessionKysely(database.db);
	const rewrite = prepareSqliteQuerySync(database.db, (parameter) => db.updateTable("transcript_events").set(options.legacyTextStorage ? { event_json: parameter((row) => row.eventJson) } : {
		event_json: parameter((row) => row.payload.event_json),
		event_zstd: parameter((row) => row.payload.event_zstd),
		event_utf8_bytes: parameter((row) => row.payload.event_utf8_bytes),
		navigation_json: parameter((row) => row.payload.navigation_json)
	}).where("session_id", "=", resolved.sessionId).where("seq", "=", parameter((row) => row.seq)).where(options.legacyTextStorage ? "event_json" : transcriptEventJsonSql(database.db), "=", parameter((row) => row.expectedEventJson)));
	for (const row of rewrites) if (rewrite(row).numAffectedRows !== 1n) throw new Error(`Transcript row ${resolved.sessionId}:${row.seq} changed before exact rewrite`);
	if (!rewrites.every((row) => isSteerConfirmationRewrite(row.expectedEventJson, row.eventJson))) rotateTranscriptGenerationInTransaction(database, resolved.sessionId);
	touchTranscriptMutationInTransaction(database, resolved.sessionId);
	if (!projectionUnchanged) {
		if (options.legacyTextStorage) markSessionTranscriptIndexDirtyInTransaction(database.db, resolved.sessionId);
		else reconcileRewrittenTranscriptIndex(database, resolved.sessionId, rebuildSynchronously);
	}
}
function isSteerConfirmationRewrite(beforeJson, afterJson) {
	const before = JSON.parse(beforeJson);
	const after = JSON.parse(afterJson);
	for (const event of [before, after]) {
		if (!isRecord(event) || event.type !== "message" || !isRecord(event.message) || event.message.role !== "user") return false;
		const metadata = event.message["__openclaw"];
		if (metadata !== void 0 && !isRecord(metadata)) return false;
		if (event === after) {
			const target = normalizePersistedSteerTargetRunId(metadata?.steerTargetRunId);
			if (!target || target !== metadata?.steerTargetRunId) return false;
		}
		if (metadata) {
			delete metadata.steerTargetRunId;
			if (Object.keys(metadata).length === 0) delete event.message["__openclaw"];
		}
	}
	return isDeepStrictEqual(before, after);
}
function transcriptRewritePreservesProjection(beforeJson, afterJson) {
	const before = JSON.parse(beforeJson);
	const after = JSON.parse(afterJson);
	if (!isRecord(before) || !isRecord(after)) return false;
	const { message: _beforeMessage, ...beforeEnvelope } = before;
	const { message: _afterMessage, ...afterEnvelope } = after;
	return isDeepStrictEqual(beforeEnvelope, afterEnvelope) && hasTranscriptMessage(before) === hasTranscriptMessage(after) && transcriptEventContextEligibility(before) === transcriptEventContextEligibility(after) && isDeepStrictEqual(extractTranscriptIndexEntry(before, 0), extractTranscriptIndexEntry(after, 0));
}
function reconcileRewrittenTranscriptIndex(database, sessionId, rebuildSynchronously) {
	markSessionTranscriptIndexDirtyInTransaction(database.db, sessionId);
	if (rebuildSynchronously) reconcileSessionTranscriptIndexInTransaction(database.db, sessionId);
	else scheduleTranscriptProjectionReconcile(database, sessionId, true, {});
}
function updateSqliteTranscriptEventJsonInTransaction(database, sessionId, updates) {
	if (updates.length === 0) return;
	const rebuildSynchronously = shouldRebuildSessionTranscriptIndexSynchronously(database.db, sessionId);
	const update = createTranscriptPayloadUpdater(database.db, sessionId);
	for (const row of updates) update({
		seq: row.seq,
		...prepareTranscriptPayload(database.db, row.eventJson)
	});
	rotateTranscriptGenerationInTransaction(database, sessionId);
	reconcileRewrittenTranscriptIndex(database, sessionId, rebuildSynchronously);
	recordTranscriptReplacementMutation(database, sessionId, readTranscriptMutationStateInTransaction(database, sessionId).updatedAt);
}
function readIdempotencyKeyOwner(database, sessionId, idempotencyKey) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select(["event_id", "seq"]).where("session_id", "=", sessionId).where("message_idempotency_key", "=", idempotencyKey).orderBy("seq", "desc").limit(1));
	return row ? {
		eventId: row.event_id,
		seq: row.seq
	} : void 0;
}
function readTranscriptMessageByScopedIdempotencyKey(database, scope, idempotencyKey, lookup) {
	if (lookup !== "scan-assistant") {
		const identity = readIdempotencyKeyOwner(database, scope.sessionId, idempotencyKey);
		return identity ? readTranscriptMessageByIdentity(database, scope, identity) : void 0;
	}
	const found = findAssistantTranscriptEventInDatabase(database, scope.sessionId, idempotencyKey);
	if (!found) return;
	const message = readTranscriptEventMessage(found.event);
	return message ? {
		messageId: readTranscriptEventId(found.event) ?? idempotencyKey,
		message
	} : void 0;
}
function readSessionTranscriptMessageByEventId(scope, eventId) {
	const resolved = resolveSqliteTranscriptScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return readHotSessionTranscriptSnapshot(database, resolved.sessionId, "identity", () => readTranscriptMessageByEventId(database, resolved, eventId));
}
function readTranscriptMessageByEventId(database, scope, eventId) {
	const identity = readTranscriptIdentityByEventId(database, scope.sessionId, eventId);
	return identity ? readTranscriptMessageByIdentity(database, scope, identity) : void 0;
}
function readTranscriptMessageByIdentity(database, scope, identity) {
	const db = getSessionKysely(database.db);
	const eventRow = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", scope.sessionId).where("seq", "=", identity.seq));
	if (!eventRow) return;
	const event = JSON.parse(eventRow.event_json);
	return {
		messageId: identity.eventId,
		message: event.message
	};
}
function readTranscriptEventIdentity(event) {
	if (!isRecord(event)) return;
	const eventId = typeof event.id === "string" && event.id.trim() ? event.id.trim() : void 0;
	return eventId ? {
		eventId,
		eventType: typeof event.type === "string" ? event.type : null,
		parentId: typeof event.parentId === "string" ? event.parentId : null,
		messageIdempotencyKey: readMessageIdempotencyKey(event.message)
	} : void 0;
}
function canonicalizeTranscriptEventMedia(event) {
	if (!isRecord(event)) return event;
	const message = event.message;
	if (event.type !== "message" || !isRecord(message)) return event;
	const canonical = canonicalizePersistedUserMessageMedia(message);
	return canonical.changed ? {
		...event,
		message: canonical.message
	} : event;
}
function redactTranscriptMessageForStorage(message, options) {
	return isTranscriptAgentMessage(message) ? redactTranscriptMessage(message, options.config, getCodeModeSourceAppend(options)) : redactSecrets(message);
}
function isTranscriptAgentMessage(value) {
	return isRecord(value) && typeof value.role === "string";
}
//#endregion
export { getCodeModeSourceAppend as C, wrapStreamFnCodeModeSource as D, withCodeModeSourceAppend as E, copyCodeModeSourceAppendOptions as S, takeCodeModeResponseSource as T, captureTranscriptRedactionSnapshot as _, insertTranscriptRowsWithoutProjectionInTransaction as a, withTranscriptRedactionSnapshot as b, readTranscriptMessageByScopedIdempotencyKey as c, rewriteSqliteTranscriptEventRowsInTransaction as d, scheduleTranscriptProjectionReconcile as f, sanitizeOpenAIReasoningSignature as g, redactTranscriptMessage as h, createTranscriptIdentityInserter as i, redactTranscriptMessageForStorage as l, advanceCliHistoryBoundaryRangeInTransaction as m, appendTranscriptEventsInTransaction as n, readSessionTranscriptMessageByEventId as o, updateSqliteTranscriptEventJsonInTransaction as p, canonicalizeTranscriptEventMedia as r, readTranscriptMessageByEventId as s, appendTranscriptEventInTransaction as t, replaceSqliteTranscriptEventsInTransaction as u, redactTranscriptText as v, prepareCodeModeSourceAppend as w, copyCodeModeSourceAppend as x, resolveTranscriptLoggingConfig as y };
