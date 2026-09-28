import { o as readProviderRefusalReview, t as appendAssistantMessageDiagnostic } from "./diagnostics-DzrF1h4J.mjs";
import { r as appendAssistantThinking } from "./event-stream-D8PARQfL.mjs";
import { a as normalizeOptionalString, o as normalizeStringifiedOptionalString, s as readStringValue } from "./string-coerce-fsri9iCu.mjs";
import { o as isRecord } from "./record-coerce-DwRYMj3t.mjs";
import { d as supportsOpenAITemperature } from "./openai-reasoning-effort-ash8dPrd.mjs";
import { M as calculateCost, _ as isImageWithMediaPayload, d as describeToolResultMediaPlaceholder, m as extractToolResultText, n as getAiTransportHost, r as resolveAiTransportHeaderSentinels } from "./host-yTvBrYM2.mjs";
import { t as truncateUtf16Safe } from "./utf16-slice-CvGodqok.mjs";
import { o as stableStringify } from "./provider-error-CRhW7lkJ.mjs";
import { a as resolveModelSseDebugMode, d as isResponsesProviderTool, g as resolveResponsesTerminalStopReason, h as readResponsesReasoningTokens, i as resolveModelPayloadDebugMode, l as ResponsesOutputIdentityError, m as mapResponsesTerminalUsage, r as emitModelTransportDebug, u as hasOnlyResponsesFunctionTools } from "./diagnostics-CH8j2wIG.mjs";
import { o as redactSensitiveText } from "./transport-utils-03Qi0CN2.mjs";
import { i as resolveOpenAICompletionsCompat } from "./openai-completions-compat-CUollwl6.mjs";
import { s as transformTransportMessages } from "./host-policy-DZO3oPPk.mjs";
import { m as stripSystemPromptCacheBoundary, v as sortPromptCacheToolsByName } from "./simple-options-np1XPuhm.mjs";
import { M as redactIdentifier, N as sha256Hex, b as createOpenAIProviderAcceptanceHook, d as prepareOpenAITools, h as resolveOpenAIRequestReasoning, u as resolveOpenAIStrictToolFlagWithDiagnostics, w as log, y as createModelStreamCooperativeScheduler } from "./openai-transport-params-DZKOTSfH.mjs";
import { E as parseStreamingJson, O as shortHash, _ as sanitizeTransportPayloadText, b as withProviderResponseHook, g as sanitizeNonEmptyTransportPayloadText, h as parseTerminalToolCallArguments, l as finalizeTransportStream, s as failTransportStream, t as IncompleteToolCallError, v as transportAbortError, w as createToolArgumentPreviewSchedule, x as parseJsonObjectPreservingUnsafeIntegers } from "./transport-stream-shared-B5RioB_Q.mjs";
import { n as providerReplayContextMatches, t as buildProviderReplayContext } from "./provider-replay-context-DPr3w20a.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-BjtkplhG.mjs";
import { a as withFirstStreamEventTimeout, i as getFirstStreamEventTimeoutMs, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "./stream-first-event-timeout-BeptfRL6.mjs";
import { t as transformProviderMessages } from "./provider-transcript-transform-BTocjCRs.mjs";
import { a as resolveOpenAIProjectedToolsStrictToolFlag, f as withPreparedToolSchemaNormalization, r as normalizeOpenAIStrictToolParameters } from "./openai-tool-schema-D4BMcj2D.mjs";
import { a as OPENAI_RESPONSES_COMPACTION_REPLAY_TYPE, c as OPENAI_RESPONSES_RETAINED_COMPACTION_REPLAY_TYPE, f as RESPONSE_FAILED_NO_DETAILS_MESSAGE, o as OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY, p as isPreviousResponseRejection, s as OPENAI_RESPONSES_REASONING_REPLAY_META_KEY } from "./openai-responses-contracts-DWrfMODE.mjs";
import { n as isOpenAIResponsesCompactionOutput, r as readOpenAIResponsesCompactionWindow } from "./openai-responses-compaction-window-BiNCT0bS.mjs";
import { n as registerSessionResourceCleanup } from "./session-resources-CkR4WWy1.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region packages/ai/src/transports/openai-responses-replay.ts
/** Resolves the assistant message id that can be replayed to OpenAI Responses. */
function resolveReplayableResponsesMessageId(params) {
	if (!params.replayResponsesItemIds) return;
	if (!params.textSignatureId) return params.fallbackOrdinal === 0 ? params.fallbackId : `${params.fallbackId}_${params.fallbackOrdinal}`;
	return params.previousReplayItemWasReasoning ? params.textSignatureId : void 0;
}
//#endregion
//#region packages/ai/src/transports/openai-responses-compaction-replay.ts
const OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE = "openai-responses-compaction-suppression";
const OPENAI_RESPONSES_COMPACTION_SUPPRESSION_DATA = "rejected";
function buildOpenAIResponsesReplayContext(model, options) {
	return buildProviderReplayContext(model, options);
}
function isOpenAIResponsesReplayContext(value) {
	if (!isRecord(value)) return false;
	return typeof value.provider === "string" && typeof value.api === "string" && typeof value.model === "string" && (value.baseUrlHash === void 0 || typeof value.baseUrlHash === "string") && (value.sessionHash === void 0 || typeof value.sessionHash === "string") && (value.authProfileHash === void 0 || typeof value.authProfileHash === "string");
}
function isOpenAIResponsesCompactionState(state) {
	if (typeof state.baseUrlHash !== "string" || state.v !== 1) return false;
	if (state.type === OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE) return state.data === OPENAI_RESPONSES_COMPACTION_SUPPRESSION_DATA;
	if (state.type === "openai-responses-retained-compaction") return typeof state.data === "string" && state.data.length > 0 && (state.id === void 0 || typeof state.id === "string") && state.replayIndex === void 0;
	return state.type === "openai-responses-compaction" && typeof state.data === "string" && state.data.length > 0 && (state.id === void 0 || typeof state.id === "string") && (state.replayIndex === void 0 || typeof state.replayIndex === "number" && Number.isSafeInteger(state.replayIndex) && state.replayIndex >= 0);
}
function readOpenAIResponsesCompactionReplayState(value) {
	return isRecord(value) && isOpenAIResponsesReplayContext(value) && isOpenAIResponsesCompactionState(value) ? value : void 0;
}
function captureOpenAIResponsesCompaction(output, item, boundary, model, captureMetadata, compactedOutput) {
	const metadata = captureMetadata ?? buildOpenAIResponsesReasoningReplayMetadata(model);
	if (!item.encrypted_content) return;
	if (!metadata?.baseUrlHash) {
		log.debug("[responses] skipping compaction capture: missing base URL hash");
		return;
	}
	const currentReplay = readOpenAIResponsesCompactionReplayState(output.providerReplay);
	if (typeof boundary === "number" && currentReplay?.type === "openai-responses-compaction" && (currentReplay.replayIndex ?? -1) > boundary) return;
	if (compactedOutput && !isOpenAIResponsesCompactionOutput(compactedOutput, model)) throw new Error("Responses compact endpoint checkpoint is invalid");
	const replay = {
		v: 1,
		...boundary === "retained-users" ? { type: OPENAI_RESPONSES_RETAINED_COMPACTION_REPLAY_TYPE } : {
			type: OPENAI_RESPONSES_COMPACTION_REPLAY_TYPE,
			replayIndex: boundary
		},
		...item.id ? { id: item.id } : {},
		data: item.encrypted_content,
		provider: metadata.provider,
		api: metadata.api,
		model: metadata.model,
		baseUrlHash: metadata.baseUrlHash,
		...metadata.sessionHash ? { sessionHash: metadata.sessionHash } : {},
		...metadata.authProfileHash ? { authProfileHash: metadata.authProfileHash } : {},
		...compactedOutput ? { compactedWindow: {
			state: "ready",
			output: JSON.stringify(compactedOutput)
		} } : {}
	};
	if (compactedOutput && !readOpenAIResponsesCompactionWindow(replay, model)) throw new Error("Responses compact endpoint checkpoint is invalid or exceeds 16 MiB");
	output.providerReplay = replay;
}
function suppressOpenAIResponsesCompaction(output, model, options, rejectedCheckpoint) {
	const context = buildOpenAIResponsesReplayContext(model, options);
	if (!context.baseUrlHash) return;
	output.providerReplay = {
		v: 1,
		type: OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE,
		data: OPENAI_RESPONSES_COMPACTION_SUPPRESSION_DATA,
		...context,
		baseUrlHash: context.baseUrlHash
	};
	if (rejectedCheckpoint) options?.onCompactionRejected?.(rejectedCheckpoint);
}
function createCompactionTracker(output, model, options) {
	const replayIndexes = /* @__PURE__ */ new Map();
	return {
		added(item, replayIndex) {
			if (item.type === "compaction" && item.id) replayIndexes.set(item.id, replayIndex);
		},
		completed(item, fallbackReplayIndex) {
			if (item.type !== "compaction" || !item.encrypted_content) return;
			captureOpenAIResponsesCompaction(output, {
				type: "compaction",
				...item.id ? { id: item.id } : {},
				encrypted_content: item.encrypted_content
			}, (item.id ? replayIndexes.get(item.id) : void 0) ?? fallbackReplayIndex, model, options?.reasoningReplayMetadata);
			if (item.id) replayIndexes.delete(item.id);
		}
	};
}
function isSafeResponsesReplayItemId(id) {
	return typeof id === "string" && id.length > 0 && id.length <= 64;
}
function resolveNewestOpenAIResponsesCompactionReplay(messages, model, options) {
	const context = buildOpenAIResponsesReplayContext(model, options);
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (message?.role !== "assistant") continue;
		const replay = readOpenAIResponsesCompactionReplayState(message.providerReplay);
		if (replay?.type === OPENAI_RESPONSES_COMPACTION_SUPPRESSION_TYPE) {
			if (providerReplayContextMatches(replay, context)) return;
			continue;
		}
		if (replay?.type !== "openai-responses-compaction" && replay?.type !== "openai-responses-retained-compaction") {
			if (message.providerReplay?.type === "openai-responses-compaction" || message.providerReplay?.type === "openai-responses-retained-compaction") return;
			continue;
		}
		if (!providerReplayContextMatches(replay, context)) return;
		if (replay.compactedWindow !== void 0 || replay.type === "openai-responses-retained-compaction") {
			const output = readOpenAIResponsesCompactionWindow(replay, model);
			const item = output?.at(-1);
			if (!output || item?.type !== "compaction") return {
				owner: message,
				mode: "refresh-required"
			};
			return {
				owner: message,
				mode: "complete-window",
				output,
				item,
				replayIndex: replay.type === "openai-responses-retained-compaction" ? message.content.length : replay.replayIndex ?? 0
			};
		}
		return {
			owner: message,
			item: {
				type: "compaction",
				...isSafeResponsesReplayItemId(replay.id) ? { id: replay.id } : {},
				encrypted_content: replay.data
			},
			mode: "compacted-prefix",
			replayIndex: replay.replayIndex ?? 0
		};
	}
}
var CompactionReplayRefreshRequiredError = class extends Error {
	constructor() {
		super("Provider compaction checkpoint needs rebuilding. Run /compact to rebuild from saved conversation history.");
		this.name = "CompactionReplayRefreshRequiredError";
	}
};
function buildOpenAIResponsesCompactionReplayPlan(messages, model, options) {
	if (options?.mode === "full-history") return {
		messages,
		preserveUnframedToolResults: false
	};
	const compaction = resolveNewestOpenAIResponsesCompactionReplay(messages, model, options);
	if (!compaction) return {
		messages,
		preserveUnframedToolResults: false
	};
	if (compaction.mode === "refresh-required") throw new CompactionReplayRefreshRequiredError();
	const ownerIndex = messages.indexOf(compaction.owner);
	return {
		messages: [{
			...compaction.owner,
			content: compaction.owner.content.slice(compaction.replayIndex)
		}, ...messages.slice(ownerIndex + 1)],
		...compaction.mode === "complete-window" ? { compactedWindow: compaction.output } : { compaction: compaction.item },
		preserveUnframedToolResults: true
	};
}
function buildOpenAIResponsesReasoningReplayMetadata(model, options) {
	return {
		v: 1,
		source: "openai-responses",
		...buildOpenAIResponsesReplayContext(model, options)
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-reasoning-update.ts
function isConfigurationUpdate(value) {
	return isRecord(value) && value.type === "configuration_update" && isRecord(value.reasoning) && typeof value.reasoning.effort === "string";
}
function isResponsesReasoningUpdateCompatible(request) {
	const mode = isRecord(request.reasoning) ? request.reasoning.mode : void 0;
	return request.model === "gpt-6-astra" && (mode === void 0 || mode === "standard") && (!isRecord(request.multi_agent) || request.multi_agent.enabled !== true) && request.truncation !== "auto" && (!Array.isArray(request.context_management) || !request.context_management.some((item) => isRecord(item) && item.type === "compaction"));
}
function supportsResponsesReasoningUpdate(request) {
	return isResponsesReasoningUpdateCompatible(request) && isRecord(request.reasoning) && typeof request.reasoning.effort === "string";
}
function canReferenceResponsesReasoningHistory(previous, request) {
	return !previous.input?.some(isConfigurationUpdate) || isResponsesReasoningUpdateCompatible(request);
}
/** Rehydrate input controls only provisionally; continuation must validate the full prefix. */
function replayResponsesReasoningUpdates(previous, request, previousOutputLength, steering) {
	if (steering !== "required-input" && (!supportsResponsesReasoningUpdate(previous) || !supportsResponsesReasoningUpdate(request)) || !Array.isArray(previous.input) || !Array.isArray(request.input) || request.input.some(isConfigurationUpdate)) return request;
	const input = [...request.input];
	let activeEffort = isRecord(previous.reasoning) ? previous.reasoning.effort : void 0;
	for (const [index, item] of previous.input.entries()) if (isConfigurationUpdate(item)) {
		input.splice(index, 0, item);
		activeEffort = item.reasoning.effort;
	}
	if (steering === "required-input") return input.length === request.input.length ? request : {
		...request,
		input
	};
	if (!isRecord(previous.reasoning) || !isRecord(request.reasoning) || typeof request.reasoning.effort !== "string") return request;
	if (activeEffort !== request.reasoning.effort && steering !== "automatic") {
		const baselineLength = previous.input.length + previousOutputLength;
		const nextUser = input.findIndex((item, index) => index >= baselineLength && "role" in item && item.role === "user");
		if (nextUser === -1) return request;
		input.splice(nextUser, 0, {
			type: "configuration_update",
			reasoning: { effort: request.reasoning.effort }
		});
	}
	if (input.length === request.input.length && activeEffort === request.reasoning.effort) return request;
	return {
		...request,
		reasoning: {
			...request.reasoning,
			effort: previous.reasoning.effort
		},
		input
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-continuation.ts
const HTTP_CONTINUATION_IDLE_TTL_MS = 3e5;
const TURN_HEADERS = /* @__PURE__ */ new Set([
	"traceparent",
	"x-openclaw-turn-id",
	"x-openclaw-turn-attempt"
]);
function jsonValuesEqual(left, right) {
	const leftJson = JSON.stringify(left);
	const normalizedLeft = stableStringify(JSON.parse(leftJson));
	const rightJson = JSON.stringify(right);
	return leftJson === rightJson || normalizedLeft === stableStringify(JSON.parse(rightJson));
}
function requestWithoutInput(request) {
	const { input: _input, previous_response_id: _previousResponseId, instructions: _instructions, tools: _tools, ...rest } = request;
	if (!isRecord(rest.metadata)) return rest;
	const metadata = Object.fromEntries(Object.entries(rest.metadata).filter(([key]) => key !== "openclaw_turn_id" && key !== "openclaw_turn_attempt"));
	return {
		...rest,
		metadata
	};
}
function normalizeAssistantReplayInput(input, fromResponse = false) {
	return input.map((item) => {
		if (!isRecord(item)) return item;
		if (item.type === "reasoning") return { type: "reasoning" };
		if (item.type !== "function_call" && !(item.type === "message" && item.role === "assistant")) return item;
		const { id: _id, status: _status, ...stableItem } = item;
		if (fromResponse && item.type === "function_call") {
			const args = parseJsonObjectPreservingUnsafeIntegers(stableItem.arguments);
			stableItem.arguments = args ? JSON.stringify(args) : stableItem.arguments;
		}
		if (item.type === "message" && Array.isArray(stableItem.content)) stableItem.content = stableItem.content.map((part) => {
			if (!isRecord(part) || part.type !== "output_text") return part;
			const { annotations: _annotations, logprobs: _logprobs, ...stablePart } = part;
			return stablePart;
		});
		return stableItem;
	});
}
function responsesContinuationRequestFingerprint(request) {
	const serialized = JSON.stringify(requestWithoutInput(request));
	return sha256Hex(stableStringify(JSON.parse(serialized)));
}
function responsesContinuationPrefixFingerprint(input, output = []) {
	const serialized = JSON.stringify([...normalizeAssistantReplayInput(input), ...normalizeAssistantReplayInput(output, true)]);
	return sha256Hex(stableStringify(JSON.parse(serialized)));
}
function resolveResponsesContinuationRequest(continuation, request, steering) {
	if (!continuation) return {
		request,
		continuationStatus: "no_previous_response"
	};
	if (request.previous_response_id) return {
		request,
		continuationStatus: "explicit_previous_response_id"
	};
	if (!canReferenceResponsesReasoningHistory(continuation.lastRequest, request)) return {
		request,
		continuationStatus: "request_changed"
	};
	const prepared = replayResponsesReasoningUpdates(continuation.lastRequest, request, continuation.lastResponseItems.length, steering);
	if (steering !== "required-input" && !jsonValuesEqual(requestWithoutInput(prepared), requestWithoutInput(continuation.lastRequest))) return {
		request,
		continuationStatus: "request_changed"
	};
	const currentInput = prepared.input ?? [];
	const previousInput = continuation.lastRequest.input ?? [];
	const baselineLength = previousInput.length + continuation.lastResponseItems.length;
	if (currentInput.length < baselineLength) return {
		request,
		continuationStatus: "history_shorter"
	};
	if (!jsonValuesEqual(normalizeAssistantReplayInput(currentInput.slice(0, previousInput.length)), normalizeAssistantReplayInput(previousInput)) || !jsonValuesEqual(normalizeAssistantReplayInput(currentInput.slice(previousInput.length, baselineLength)), normalizeAssistantReplayInput(continuation.lastResponseItems, true))) return {
		request,
		continuationStatus: "history_changed"
	};
	return {
		request: {
			...prepared,
			previous_response_id: continuation.lastResponseId,
			input: currentInput.slice(baselineLength)
		},
		...prepared !== request ? { fullRequest: prepared } : {},
		continuationStatus: "continued"
	};
}
const httpContinuationEntries = /* @__PURE__ */ new Map();
function deleteHttpContinuationIfOwned(key, entry) {
	if (httpContinuationEntries.get(key) === entry) httpContinuationEntries.delete(key);
}
function connectionIdentity(params) {
	const headers = Object.entries(resolveAiTransportHeaderSentinels(params.headers) ?? {}).map(([name, value]) => [name.toLowerCase(), value]).filter(([name]) => !TURN_HEADERS.has(name)).toSorted(([a], [b]) => a.localeCompare(b));
	return sha256Hex(JSON.stringify([
		getAiTransportHost().resolveSecretSentinel(params.apiKey),
		params.baseUrl,
		headers
	]));
}
function claimOpenAIResponsesHttpContinuation(params) {
	const key = `${params.sessionId}\0${connectionIdentity(params)}`;
	const previous = httpContinuationEntries.get(key);
	if (previous?.kind === "claimed") return;
	if (previous?.kind === "ready") clearTimeout(previous.idleTimer);
	const claimed = {
		kind: "claimed",
		sessionId: params.sessionId
	};
	httpContinuationEntries.set(key, claimed);
	try {
		const request = previous?.kind === "ready" ? params.request : params.restoreRequest?.() ?? params.request;
		const resolved = resolveResponsesContinuationRequest(previous?.kind === "ready" ? previous.state : void 0, request);
		const fullRequest = resolved.fullRequest ?? request;
		return {
			request: params.request.store === false ? fullRequest : resolved.request,
			fullRequest,
			commit: (effectiveRequest, response) => {
				if (httpContinuationEntries.get(key) !== claimed) return;
				const ready = {
					...claimed,
					kind: "ready",
					state: {
						lastRequest: effectiveRequest,
						lastResponseId: response.id,
						lastResponseItems: response.output
					},
					idleTimer: setTimeout(() => deleteHttpContinuationIfOwned(key, ready), HTTP_CONTINUATION_IDLE_TTL_MS)
				};
				ready.idleTimer.unref?.();
				httpContinuationEntries.set(key, ready);
			},
			release: () => deleteHttpContinuationIfOwned(key, claimed)
		};
	} catch (error) {
		deleteHttpContinuationIfOwned(key, claimed);
		throw error;
	}
}
registerSessionResourceCleanup((sessionId) => {
	for (const [key, entry] of httpContinuationEntries) if (!sessionId || entry.sessionId === sessionId) {
		if (entry.kind === "ready") clearTimeout(entry.idleTimer);
		httpContinuationEntries.delete(key);
	}
});
//#endregion
//#region packages/ai/src/transports/openai-responses-input-replay.ts
function recordResponsesInputReplay(message, replay) {
	if (replay) Object.assign(message, { openclawResponsesInputReplay: replay });
}
function readResponsesInputReplay(message) {
	const replay = "openclawResponsesInputReplay" in message ? message.openclawResponsesInputReplay : void 0;
	if (isRecord(replay) && typeof replay.afterResponseId === "string" && Array.isArray(replay.before) && replay.before.every((item) => typeof item === "string") && Array.isArray(replay.after) && replay.after.every((item) => typeof item === "string")) return {
		afterResponseId: replay.afterResponseId,
		before: replay.before,
		after: replay.after
	};
}
function responsesInputFingerprint(item) {
	if (isRecord(item) && (item.type === "function_call_output" || item.type === "custom_tool_call_output") && typeof item.call_id === "string") return sha256Hex(stableStringify({
		type: item.type,
		call_id: item.call_id
	}));
	return sha256Hex(stableStringify(item));
}
/** Reconstruct delivery order without rewriting durable local completion events. */
function createResponsesInputReplay(model) {
	const starts = /* @__PURE__ */ new Map();
	const ends = /* @__PURE__ */ new Map();
	const fingerprints = /* @__PURE__ */ new Map();
	const fingerprint = (item) => {
		const value = fingerprints.get(item) ?? responsesInputFingerprint(item);
		fingerprints.set(item, value);
		return value;
	};
	return (input, output, message) => {
		const key = message.turnId || message.responseId;
		const start = (key ? starts.get(key) : void 0) ?? output[0];
		if (key && start) starts.set(key, start);
		input.push(...output);
		let end = input.at(-1);
		const replay = readResponsesInputReplay(message);
		const parent = replay ? ends.get(replay.afterResponseId) : void 0;
		if (replay && parent && message.provider === model.provider && message.api === model.api && message.model === model.id) {
			const take = (keys) => {
				const moved = [];
				for (const inputKey of keys.toReversed()) {
					const boundary = input.indexOf(parent);
					const index = input.findLastIndex((item, position) => position > boundary && fingerprint(item) === inputKey);
					if (index > boundary) moved.unshift(...input.splice(index, 1));
				}
				return moved;
			};
			const before = take(replay.before);
			const after = take(replay.after);
			input.splice(start ? input.indexOf(start) : input.length, 0, ...before);
			end = input.at(-1);
			input.push(...after);
		}
		if (message.responseId && end) ends.set(message.responseId, end);
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-replay-messages-internal.ts
function stripEncryptedReasoningContentFields(value) {
	if (!value || typeof value !== "object") return {
		value,
		changed: false
	};
	if (Array.isArray(value)) {
		let changed = false;
		const next = value.map((item) => {
			const stripped = stripEncryptedReasoningContentFields(item);
			changed ||= stripped.changed;
			return stripped.value;
		});
		return changed ? {
			value: next,
			changed: true
		} : {
			value,
			changed: false
		};
	}
	const source = value;
	if (source.type === "compaction") return {
		value,
		changed: false
	};
	let changed = false;
	const next = {};
	for (const [key, child] of Object.entries(source)) {
		if (key === "encrypted_content") {
			changed = true;
			continue;
		}
		const stripped = stripEncryptedReasoningContentFields(child);
		changed ||= stripped.changed;
		next[key] = stripped.value;
	}
	return changed ? {
		value: next,
		changed: true
	} : {
		value,
		changed: false
	};
}
function isOpenAIResponsesReasoningReplayMetadata(value) {
	if (!isOpenAIResponsesReplayContext(value)) return false;
	const record = value;
	return record.v === 1 && record.source === "openai-responses";
}
function readOpenAIResponsesReasoningReplayBlockMetadata(block) {
	if (!Object.hasOwn(block, "openclawReasoningReplay")) return;
	const value = block[OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY];
	return isOpenAIResponsesReasoningReplayMetadata(value) ? value : null;
}
function normalizeOpenAIResponsesReasoningReplayItem(item) {
	const record = item;
	if (record.type !== "reasoning" || Array.isArray(record.summary)) return item;
	return {
		...record,
		summary: []
	};
}
function prepareOpenAIResponsesReasoningItemForReplay(item, context, blockMetadata, options) {
	const record = item;
	const hasRawMetadata = Object.hasOwn(record, OPENAI_RESPONSES_REASONING_REPLAY_META_KEY);
	const { [OPENAI_RESPONSES_REASONING_REPLAY_META_KEY]: rawMetadata, ...rest } = record;
	if (!("encrypted_content" in rest)) return normalizeOpenAIResponsesReasoningReplayItem(rest);
	const metadata = blockMetadata !== void 0 ? blockMetadata ?? void 0 : isOpenAIResponsesReasoningReplayMetadata(rawMetadata) ? rawMetadata : void 0;
	if (blockMetadata === void 0 && !hasRawMetadata && options?.preserveUnattributedEncryptedContent === true || metadata && providerReplayContextMatches(metadata, context)) return normalizeOpenAIResponsesReasoningReplayItem(rest);
	return normalizeOpenAIResponsesReasoningReplayItem(stripEncryptedReasoningContentFields(rest).value);
}
function normalizeResponsesReplayItemId(id, prefix) {
	if (!id) return;
	if (id.length <= 64) return id;
	return `${prefix}_${shortHash(id)}`;
}
function encodeTextSignatureV1(id, phase) {
	return JSON.stringify({
		v: 1,
		id,
		...phase ? { phase } : {}
	});
}
function orderResponsesAsyncToolResults(source) {
	const turnKey = (message) => {
		const id = message.turnId || message.responseId;
		return id ? `${message.provider}:${message.api}:${message.model}:${id}` : void 0;
	};
	const lastAssistant = /* @__PURE__ */ new Map();
	for (const [index, message] of source.entries()) if (message.role === "assistant") {
		const key = turnKey(message);
		if (key) lastAssistant.set(key, index);
	}
	const owners = /* @__PURE__ */ new Map();
	const pending = /* @__PURE__ */ new Map();
	const ordered = [];
	for (const [index, message] of source.entries()) {
		if (message.role === "assistant") {
			const key = turnKey(message);
			if (key) {
				for (const block of message.content) if (block.type === "toolCall" && block.async) owners.set(block.id, key);
			}
		}
		const owner = message.role === "toolResult" ? owners.get(message.toolCallId) : void 0;
		const lastIndex = owner ? lastAssistant.get(owner) : void 0;
		if (lastIndex !== void 0 && lastIndex > index) {
			const results = pending.get(lastIndex) ?? [];
			results.push(message);
			pending.set(lastIndex, results);
		} else ordered.push(message);
		const results = pending.get(index);
		if (results) {
			ordered.push(...results);
			pending.delete(index);
		}
	}
	return ordered;
}
function parseOpenAIResponsesTextSignature(signature) {
	if (!signature) return;
	if (signature.startsWith("{")) try {
		const parsed = JSON.parse(signature);
		if (parsed.v === 1) {
			const id = typeof parsed.id === "string" ? parsed.id : void 0;
			const phase = parsed.phase === "commentary" || parsed.phase === "final_answer" ? parsed.phase : void 0;
			if (id !== void 0 || phase !== void 0) return {
				id,
				phase
			};
			return;
		}
	} catch {}
	return { id: signature };
}
function buildResponsesInputMessage(role, content) {
	return {
		type: "message",
		role,
		content
	};
}
function createOpenAIResponsesAssistantOutput(model, api = model.api) {
	return {
		role: "assistant",
		content: [],
		api,
		provider: model.provider,
		model: model.id,
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		stopReason: "stop",
		timestamp: Date.now()
	};
}
function convertResponsesMessagesWithStyle(model, context, allowedToolCallProviders, options, conversionStyle) {
	const messages = [];
	const providerStyle = conversionStyle === "provider";
	const shouldReplayReasoningItems = options?.replayReasoningItems ?? true;
	const shouldReplayResponsesItemIds = options?.replayResponsesItemIds ?? true;
	const replayContext = buildOpenAIResponsesReplayContext(model, {
		sessionId: options?.sessionId,
		authProfileId: options?.authProfileId
	});
	const shouldNormalizeSameModelToolCallIds = model.provider === "github-copilot";
	const sanitizeIdPart = (part) => {
		const sanitized = part.replace(/[^a-zA-Z0-9_-]/g, "_");
		return providerStyle ? sanitized : sanitized.replace(/_+$/, "");
	};
	const normalizeIdPart = (part) => {
		const sanitized = sanitizeIdPart(part);
		return (sanitized.length > 64 ? sanitized.slice(0, 64) : sanitized).replace(/_+$/, "");
	};
	const buildForeignResponsesItemId = (itemId) => {
		const normalized = `fc_${shortHash(itemId)}`;
		return normalized.length > 64 ? normalized.slice(0, 64) : normalized;
	};
	const buildSameProviderCopilotResponsesItemId = (itemId) => {
		const sanitized = sanitizeIdPart(itemId);
		const candidate = sanitized.startsWith("fc_") ? sanitized : `fc_${sanitized}`;
		return candidate.length > 64 ? buildForeignResponsesItemId(itemId) : candidate;
	};
	const normalizeToolCallId = (id, _targetModel, source) => {
		if (!allowedToolCallProviders.has(model.provider)) return normalizeIdPart(id);
		if (!id.includes("|")) return normalizeIdPart(id);
		const separatorIndex = id.indexOf("|");
		const callId = id.slice(0, separatorIndex);
		const itemId = id.slice(separatorIndex + 1);
		const normalizedCallId = normalizeIdPart(callId);
		let normalizedItemId = source.provider !== model.provider || source.api !== model.api ? buildForeignResponsesItemId(itemId) : model.provider === "github-copilot" ? providerStyle ? normalizeIdPart(itemId) : buildSameProviderCopilotResponsesItemId(itemId) : normalizeIdPart(itemId);
		if (!normalizedItemId.startsWith("fc_")) normalizedItemId = normalizeIdPart(`fc_${normalizedItemId}`);
		return `${normalizedCallId}|${normalizedItemId}`;
	};
	const replayPlan = buildOpenAIResponsesCompactionReplayPlan(context.messages, model, {
		sessionId: options?.sessionId,
		authProfileId: options?.authProfileId,
		mode: options?.replayMode
	});
	const transformMessages = (source) => providerStyle ? transformProviderMessages(source, model, normalizeToolCallId) : transformTransportMessages(source, model, normalizeToolCallId, {
		normalizeSameModelToolCallIds: shouldNormalizeSameModelToolCallIds,
		preserveUnframedToolResults: replayPlan.preserveUnframedToolResults
	});
	const transformedMessages = orderResponsesAsyncToolResults(transformMessages(replayPlan.messages));
	if ((options?.includeSystemPrompt ?? true) && context.systemPrompt) messages.push(buildResponsesInputMessage(model.reasoning && model.compat?.supportsDeveloperRole !== false ? "developer" : "system", [{
		type: "input_text",
		text: sanitizeTransportPayloadText(stripSystemPromptCacheBoundary(context.systemPrompt))
	}]));
	if (replayPlan.compactedWindow) messages.push(...replayPlan.compactedWindow);
	let replayMessages = replayPlan.compaction ? [replayPlan.compaction, ...transformedMessages] : transformedMessages;
	const isCarrier = (message) => "role" in message && message.role === "user" && message.runtimeContextCarrier === true;
	if (replayMessages.some(isCarrier)) {
		const anchored = [];
		let insertionIndex = replayPlan.compactedWindow ? 0 : void 0;
		for (const message of replayMessages) {
			if (isCarrier(message) && insertionIndex !== void 0) {
				anchored.splice(insertionIndex++, 0, message);
				continue;
			}
			anchored.push(message);
			if (!isCarrier(message) && ("role" in message ? message.role === "user" : message.type === "compaction")) insertionIndex = anchored.length;
		}
		replayMessages = anchored;
	}
	let msgIndex = 0;
	const appendAssistant = createResponsesInputReplay(model);
	for (const msg of replayMessages) {
		if (!("role" in msg)) {
			messages.push(msg);
			continue;
		}
		if (msg.role === "user") {
			if (typeof msg.content === "string") messages.push(buildResponsesInputMessage("user", [{
				type: "input_text",
				text: sanitizeTransportPayloadText(msg.content)
			}]));
			else {
				const content = msg.content.map((item) => item.type === "text" ? {
					type: "input_text",
					text: sanitizeTransportPayloadText(item.text)
				} : {
					type: "input_image",
					detail: "auto",
					image_url: `data:${item.mimeType};base64,${item.data}`
				}).filter((item) => providerStyle || model.input.includes("image") || item.type !== "input_image");
				if (content.length > 0) messages.push(buildResponsesInputMessage("user", content));
				else if (providerStyle) continue;
			}
		} else if (msg.role === "assistant") {
			const output = [];
			let textFallbackOrdinal = 0;
			let previousReplayItemWasReasoning = false;
			const isDifferentModel = msg.model !== model.id && msg.provider === model.provider && msg.api === model.api;
			for (const block of msg.content) if (block.type === "thinking") {
				if (shouldReplayReasoningItems && block.thinkingSignature && (providerStyle || block.thinkingSignature.startsWith("{"))) {
					let reasoningItem;
					try {
						reasoningItem = JSON.parse(block.thinkingSignature);
					} catch {
						continue;
					}
					if (!isRecord(reasoningItem) || reasoningItem.type !== "reasoning") continue;
					const replayableReasoningItem = prepareOpenAIResponsesReasoningItemForReplay(reasoningItem, replayContext, readOpenAIResponsesReasoningReplayBlockMetadata(isRecord(block) ? block : {}), providerStyle ? { preserveUnattributedEncryptedContent: true } : void 0);
					if (!shouldReplayResponsesItemIds) delete replayableReasoningItem.id;
					if (shouldReplayResponsesItemIds && !providerStyle && model.provider === "github-copilot" && !isSafeResponsesReplayItemId(replayableReasoningItem.id)) continue;
					output.push(replayableReasoningItem);
					previousReplayItemWasReasoning = true;
				}
			} else if (block.type === "text") {
				const textSignature = parseOpenAIResponsesTextSignature(block.textSignature);
				let msgId = resolveReplayableResponsesMessageId({
					replayResponsesItemIds: shouldReplayResponsesItemIds,
					textSignatureId: textSignature?.id,
					fallbackId: `msg_${msgIndex}`,
					fallbackOrdinal: textFallbackOrdinal,
					previousReplayItemWasReasoning
				});
				if (!textSignature?.id) textFallbackOrdinal += 1;
				msgId = normalizeResponsesReplayItemId(msgId, "msg");
				const messageItem = {
					type: "message",
					role: "assistant",
					content: [{
						type: "output_text",
						text: sanitizeTransportPayloadText(block.text),
						annotations: []
					}],
					status: "completed",
					...msgId ? { id: msgId } : {},
					phase: textSignature?.phase
				};
				output.push(messageItem);
				previousReplayItemWasReasoning = false;
			} else if (block.type === "toolCall") {
				const separatorIndex = block.id.indexOf("|");
				const callId = separatorIndex === -1 ? block.id : block.id.slice(0, separatorIndex);
				const itemIdRaw = separatorIndex === -1 ? void 0 : block.id.slice(separatorIndex + 1);
				const itemId = shouldReplayResponsesItemIds && !(isDifferentModel && itemIdRaw?.startsWith("fc_")) ? itemIdRaw : void 0;
				output.push({
					type: "function_call",
					...itemId ? { id: itemId } : {},
					call_id: callId,
					name: block.name,
					...block.async ? { async: true } : {},
					arguments: providerStyle ? JSON.stringify(block.arguments) : typeof block.arguments === "string" ? block.arguments : JSON.stringify(block.arguments ?? {})
				});
				previousReplayItemWasReasoning = false;
			}
			while (true) {
				const last = output.at(-1);
				if (last?.type !== "reasoning" || !last.id?.startsWith("rs_") || typeof last.encrypted_content === "string" && last.encrypted_content.length > 0) break;
				output.pop();
			}
			appendAssistant(messages, output, msg);
			if (output.length === 0 && providerStyle) continue;
		} else if (msg.role === "toolResult") {
			const textResult = extractToolResultText(msg.content);
			const sanitizedTextResult = sanitizeTransportPayloadText(textResult);
			const hasText = sanitizedTextResult.trim().length > 0;
			const mediaPlaceholder = describeToolResultMediaPlaceholder(msg.content);
			const hasImages = msg.content.some(isImageWithMediaPayload);
			const separatorIndex = msg.toolCallId.indexOf("|");
			const callId = separatorIndex === -1 ? msg.toolCallId : msg.toolCallId.slice(0, separatorIndex);
			messages.push({
				type: "function_call_output",
				call_id: callId,
				output: hasImages && model.input.includes("image") ? [...hasText ? [{
					type: "input_text",
					text: sanitizedTextResult
				}] : mediaPlaceholder === "(see attached media)" ? [{
					type: "input_text",
					text: mediaPlaceholder
				}] : [], ...msg.content.filter(isImageWithMediaPayload).map((item) => ({
					type: "input_image",
					detail: "auto",
					image_url: `data:${item.mimeType};base64,${item.data}`
				}))] : sanitizeNonEmptyTransportPayloadText(textResult, mediaPlaceholder ?? "(no output)")
			});
		}
		msgIndex += 1;
	}
	return messages;
}
function convertResponsesMessages$1(model, context, allowedToolCallProviders, options) {
	return convertResponsesMessagesWithStyle(model, context, allowedToolCallProviders, options, "transport");
}
function convertProviderResponsesMessages(model, context, allowedToolCallProviders, options) {
	return convertResponsesMessagesWithStyle(model, context, allowedToolCallProviders, options, "provider");
}
//#endregion
//#region packages/ai/src/transports/openai-responses-context-usage.ts
const TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set([
	"openai",
	"opencode",
	"azure-openai-responses",
	"github-copilot"
]);
function inputReplay(message) {
	const value = "openclawResponsesInputReplay" in message ? message.openclawResponsesInputReplay : void 0;
	return isRecord(value) ? value : void 0;
}
function contextFingerprint(input, output = []) {
	const reasoning = [...input, ...output].flatMap((item) => {
		if (!isRecord(item) || item.type !== "reasoning") return [];
		const { id: _id, status: _status, ...content } = item;
		return [content];
	});
	return sha256Hex(stableStringify({
		prefix: responsesContinuationPrefixFingerprint(input, output),
		reasoning
	}));
}
/** Bind measured usage to the admitted replay prefix, without copying its content. */
function recordResponsesContextUsage(message, model, identity, request, output, projection) {
	const usage = message.usage.contextUsage;
	if (usage?.state !== "available" || !Number.isSafeInteger(usage.totalTokens) || usage.totalTokens <= 0 || message.stopReason === "error" || message.stopReason === "aborted" || message.providerReplay || request.previous_response_id || !Array.isArray(request.input) || !request.input.some((item) => isRecord(item) && item.type === "compaction") || !Array.isArray(output) || output.some((item) => isRecord(item) && item.type === "compaction")) return;
	const replayOutput = (projection === "transport" ? convertResponsesMessages$1 : convertProviderResponsesMessages)(model, { messages: [message] }, TOOL_CALL_PROVIDERS, {
		...identity,
		includeSystemPrompt: false
	}).filter((item) => item.type !== "function_call_output");
	const firstInput = request.input[0];
	const contextUsage = {
		...buildProviderReplayContext(model, identity),
		projection,
		includeSystemPrompt: request.instructions === void 0 && firstInput?.type === "message" && (firstInput.role === "developer" || firstInput.role === "system"),
		prefixHash: contextFingerprint(request.input, replayOutput),
		prefixLength: request.input.length + replayOutput.length,
		promptTokens: usage.promptTokens,
		totalTokens: usage.totalTokens
	};
	Object.assign(message, { openclawResponsesInputReplay: {
		...inputReplay(message),
		contextUsage
	} });
}
/** Only matching provider input may replace the conservative local pressure estimate. */
function resolveResponsesContextUsageBoundary(messages, model, identity, systemPrompt) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (!message || !isAssistant(message)) continue;
		const state = inputReplay(message)?.contextUsage;
		const usage = message.usage.contextUsage;
		if (!isRecord(state) || usage?.state !== "available") continue;
		const { projection, prefixHash, prefixLength, promptTokens, totalTokens, includeSystemPrompt } = state;
		if (!isOpenAIResponsesReplayContext(state) || !providerReplayContextMatches(state, buildProviderReplayContext(model, identity)) || message.provider !== model.provider || message.api !== model.api || message.model !== model.id || projection !== "transport" && projection !== "provider" || typeof prefixHash !== "string" || typeof prefixLength !== "number" || !Number.isSafeInteger(prefixLength) || prefixLength <= 0 || promptTokens !== usage.promptTokens || totalTokens !== usage.totalTokens || !Number.isSafeInteger(usage.totalTokens) || usage.totalTokens <= 0) return;
		const input = (projection === "transport" ? convertResponsesMessages$1 : convertProviderResponsesMessages)(model, {
			messages: messages.filter(isProviderMessage),
			systemPrompt
		}, TOOL_CALL_PROVIDERS, {
			...identity,
			includeSystemPrompt: includeSystemPrompt === true
		});
		if (input.length < prefixLength || contextFingerprint(input.slice(0, prefixLength)) !== prefixHash) return;
		return {
			index,
			totalTokens: usage.totalTokens,
			suffix: input.slice(prefixLength)
		};
	}
}
function isAssistant(message) {
	return message.role === "assistant";
}
function isProviderMessage(message) {
	return message.role === "user" || message.role === "assistant" || message.role === "toolResult";
}
//#endregion
//#region packages/ai/src/transports/openai-responses-debug.ts
function stringifyUnknown(value, fallback = "") {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	return fallback;
}
function safeDebugValue(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	if (value === null) return "null";
	if (value === void 0) return "undefined";
	return Array.isArray(value) ? "array" : typeof value;
}
function responseInputTextChars(input) {
	if (typeof input === "string") return input.length;
	if (Array.isArray(input)) return input.reduce((total, item) => total + responseInputTextChars(item), 0);
	if (!input || typeof input !== "object") return 0;
	const record = input;
	let total = 0;
	if (typeof record.text === "string") total += record.text.length;
	if (typeof record.content === "string") total += record.content.length;
	else if (Array.isArray(record.content)) total += responseInputTextChars(record.content);
	return total;
}
function responseInputRoles(input) {
	if (!Array.isArray(input)) return "";
	const roles = /* @__PURE__ */ new Set();
	for (const item of input) if (item && typeof item === "object") {
		const role = item.role;
		if (typeof role === "string" && role.trim()) roles.add(role.trim());
	}
	return [...roles].toSorted().join(",");
}
function responseInputItemShape(input) {
	if (!Array.isArray(input)) return "none";
	return input.map((item) => {
		if (!isRecord(item) || typeof item.type !== "string") return "unknown";
		if (item.type === "message" && typeof item.role === "string") return `message:${item.role}`;
		return item.type;
	}).join(",") || "none";
}
function hashOpaqueResponsesValue(value) {
	return createHash("sha256").update(value).digest("hex");
}
function summarizeResponsesCompactionItems(input) {
	if (!Array.isArray(input)) return [
		"compactionItems=0",
		"compactionIdHashes=none",
		"compactionPayloadHashes=none",
		"compactionInputIndexes=none"
	];
	const compactions = input.flatMap((item, inputIndex) => {
		if (!isRecord(item) || item.type !== "compaction") return [];
		return [{
			idHash: typeof item.id === "string" ? hashOpaqueResponsesValue(item.id) : void 0,
			inputIndex,
			payloadHash: typeof item.encrypted_content === "string" ? hashOpaqueResponsesValue(item.encrypted_content) : void 0
		}];
	});
	return [
		`compactionItems=${compactions.length}`,
		`compactionIdHashes=${compactions.flatMap((item) => item.idHash ?? []).join(",") || "none"}`,
		`compactionPayloadHashes=${compactions.flatMap((item) => item.payloadHash ?? []).join(",") || "none"}`,
		`compactionInputIndexes=${compactions.map((item) => item.inputIndex).join(",") || "none"}`
	];
}
function readToolPayloadField(record, field) {
	try {
		return record[field];
	} catch {
		return;
	}
}
function readResponsesToolDisplayName(tool) {
	if (!tool || typeof tool !== "object") return "";
	const record = tool;
	const name = readToolPayloadField(record, "name");
	if (typeof name === "string") return name;
	const fn = readToolPayloadField(record, "function");
	if (fn && typeof fn === "object") {
		const fnName = readToolPayloadField(fn, "name");
		if (typeof fnName === "string") return fnName;
	}
	const type = readToolPayloadField(record, "type");
	return typeof type === "string" && type !== "function" ? type : "";
}
function summarizeResponsesTools(tools) {
	if (!Array.isArray(tools)) return "count=0";
	const names = tools.map(readResponsesToolDisplayName).filter(Boolean);
	const mode = resolveModelPayloadDebugMode();
	const maxNames = mode === "tools" || mode === "full-redacted" ? names.length : 12;
	const label = maxNames >= names.length ? "names" : "sample";
	const shown = names.slice(0, maxNames).join(",");
	return `count=${tools.length}${shown ? ` ${label}=${shown}` : ""}`;
}
function stringifyRedactedPayload(value) {
	try {
		const encoded = JSON.stringify(value, (key, child) => key === "encrypted_content" ? "<opaque data omitted>" : child);
		if (!encoded) return "<empty>";
		const redacted = redactSensitiveText(encoded, { mode: "tools" });
		return redacted.length > 8e3 ? `${truncateUtf16Safe(redacted, 8e3)}…<truncated>` : redacted;
	} catch {
		return "<unserializable>";
	}
}
function stringifyRedactedEvent(value) {
	const redacted = stringifyRedactedPayload(value);
	return redacted.length > 2e3 ? `${truncateUtf16Safe(redacted, 2e3)}…<truncated>` : redacted;
}
const RESPONSE_FAILED_FAILURE_FIELD_KEYS = [
	"error",
	"incomplete_details",
	"status_details",
	"failure_reason",
	"last_error",
	"provider_error",
	"error_details"
];
function readResponseFailedString(record, key) {
	return stringifyUnknown(record?.[key]);
}
function buildResponsesFailedEventSummary(message, responseId, code, observation) {
	const summary = { message };
	if (responseId) summary.responseId = responseId;
	if (code) summary.code = code;
	if (observation) summary.observation = observation;
	return summary;
}
function isResponseFailedIdentifierKey(key) {
	const normalized = key.replace(/[-_\s]/g, "").toLowerCase();
	return normalized === "requestid" || normalized === "xrequestid" || normalized === "providerrequestid" || normalized === "providerresponseid" || normalized === "litellmrequestid" || normalized.includes("request") && normalized.endsWith("id") || normalized.includes("provider") && normalized.endsWith("id");
}
function collectResponseFailedIdentifierHashes(value, opts = {}) {
	const path = opts.path ?? "";
	const depth = opts.depth ?? 0;
	const identifierKey = opts.identifierKey ?? "";
	const out = opts.out ?? [];
	const seen = opts.seen ?? /* @__PURE__ */ new WeakSet();
	if (out.length >= 12 || depth > 4 || !value || typeof value !== "object") return out;
	if (seen.has(value)) return out;
	seen.add(value);
	if (Array.isArray(value)) {
		for (const [index, item] of value.entries()) {
			if (index >= 8 || out.length >= 12) break;
			const itemString = typeof item === "string" || typeof item === "number" ? String(item).trim() : "";
			if (identifierKey && isResponseFailedIdentifierKey(identifierKey) && itemString) {
				out.push(`${path}[${index}]=${redactIdentifier(itemString, { len: 12 })}`);
				continue;
			}
			collectResponseFailedIdentifierHashes(item, {
				path: `${path}[${index}]`,
				depth: depth + 1,
				identifierKey,
				out,
				seen
			});
		}
		return out;
	}
	for (const [key, child] of Object.entries(value)) {
		if (out.length >= 12) break;
		const childPath = path ? `${path}.${key}` : key;
		const childString = typeof child === "string" || typeof child === "number" ? String(child).trim() : "";
		if (isResponseFailedIdentifierKey(key) && childString) {
			out.push(`${childPath}=${redactIdentifier(childString, { len: 12 })}`);
			continue;
		}
		collectResponseFailedIdentifierHashes(child, {
			path: childPath,
			depth: depth + 1,
			identifierKey: isResponseFailedIdentifierKey(key) ? key : void 0,
			out,
			seen
		});
	}
	return out;
}
function redactResponseFailedDiagnosticValue(value, opts = {}) {
	const key = opts.key ?? "";
	const depth = opts.depth ?? 0;
	if (typeof value === "string" || typeof value === "number") return key && isResponseFailedIdentifierKey(key) ? redactIdentifier(String(value), { len: 12 }) : value;
	if (depth > 6 || !value || typeof value !== "object") return value;
	const seen = opts.seen ?? /* @__PURE__ */ new WeakSet();
	if (seen.has(value)) return "<circular>";
	seen.add(value);
	if (Array.isArray(value)) return value.slice(0, 16).map((item) => redactResponseFailedDiagnosticValue(item, {
		key,
		depth: depth + 1,
		seen
	}));
	const out = {};
	for (const [childKey, child] of Object.entries(value)) out[childKey] = redactResponseFailedDiagnosticValue(child, {
		key: childKey,
		depth: depth + 1,
		seen
	});
	return out;
}
function buildResponsesFailedFailureFields(response) {
	if (!response) return {};
	const fields = {};
	for (const key of RESPONSE_FAILED_FAILURE_FIELD_KEYS) if (response[key] !== void 0 && response[key] !== null) fields[key] = response[key];
	return fields;
}
function buildResponsesFailedNoDetailsObservation(event, model, response = isRecord(event.response) ? event.response : void 0) {
	const failureFields = redactResponseFailedDiagnosticValue(buildResponsesFailedFailureFields(response));
	const metadataKeys = isRecord(response?.metadata) ? Object.keys(response.metadata).toSorted() : [];
	const responsePreview = {
		id: readResponseFailedString(response, "id"),
		status: readResponseFailedString(response, "status"),
		model: readResponseFailedString(response, "model"),
		object: readResponseFailedString(response, "object"),
		failureFields,
		metadataKeys
	};
	return {
		event: "openai_responses_response_failed_without_details",
		provider: model.provider,
		api: model.api,
		transportModel: model.id,
		providerRuntimeFailureKind: "no_error_details",
		responseId: responsePreview.id,
		responseStatus: responsePreview.status,
		responseModel: responsePreview.model,
		responseObject: responsePreview.object,
		metadataKeys,
		requestIdHashes: collectResponseFailedIdentifierHashes(event),
		failureFieldsPreview: stringifyRedactedEvent(failureFields),
		responsePreview: stringifyRedactedEvent(responsePreview)
	};
}
function summarizeResponsesFailedNoDetailsObservation(observation) {
	const requestIds = observation.requestIdHashes.join(",");
	const metadataKeys = observation.metadataKeys.join(",");
	return `responseId=${safeDebugValue(observation.responseId || void 0)} responseStatus=${safeDebugValue(observation.responseStatus || void 0)} responseModel=${safeDebugValue(observation.responseModel || void 0)} requestIds=${requestIds || "none"} metadataKeys=${metadataKeys || "none"} failureFields=${observation.failureFieldsPreview}`;
}
function normalizeResponsesFailedEvent(event, model) {
	const response = isRecord(event.response) ? event.response : void 0;
	const responseId = readResponseFailedString(response, "id") || void 0;
	const error = isRecord(response?.error) ? response.error : void 0;
	if (error) {
		const code = readResponseFailedString(error, "code").trim();
		const message = readResponseFailedString(error, "message").trim();
		if (code || message) return buildResponsesFailedEventSummary(`${code || "unknown"}: ${message || "no message"}`, responseId, code || void 0);
	}
	const incompleteReason = readResponseFailedString(isRecord(response?.incomplete_details) ? response.incomplete_details : void 0, "reason");
	if (incompleteReason) return buildResponsesFailedEventSummary(`incomplete: ${incompleteReason}`, responseId);
	return buildResponsesFailedEventSummary(RESPONSE_FAILED_NO_DETAILS_MESSAGE, responseId, void 0, buildResponsesFailedNoDetailsObservation(event, model, response));
}
var ResponsesStreamFailure = class extends Error {
	constructor(failure, response) {
		super(failure.message);
		this.name = "ResponsesStreamFailure";
		this.responseId = failure.responseId;
		this.response = response;
		this.code = failure.code;
		this.observation = failure.observation;
	}
};
function logResponsesFailedNoDetails(observation) {
	log.warn(`[responses] response.failed missing error details provider=${observation.provider} api=${observation.api} model=${observation.transportModel} ` + summarizeResponsesFailedNoDetailsObservation(observation), observation);
}
function summarizeResponsesPayload(params) {
	if (!params || typeof params !== "object") return "payload=non-object";
	const record = params;
	const input = record.input;
	const reasoning = record.reasoning && typeof record.reasoning === "object" ? record.reasoning : void 0;
	const text = record.text && typeof record.text === "object" ? record.text : void 0;
	const parts = [
		`fields=${Object.keys(record).toSorted().join(",")}`,
		`model=${safeDebugValue(record.model)}`,
		`stream=${safeDebugValue(record.stream)}`,
		`inputItems=${Array.isArray(input) ? input.length : typeof input}`,
		`inputItemShape=${responseInputItemShape(input)}`,
		`inputRoles=${responseInputRoles(input) || "none"}`,
		`inputTextChars=${responseInputTextChars(input)}`,
		`tools=${summarizeResponsesTools(record.tools)}`,
		`reasoningEffort=${safeDebugValue(reasoning?.effort)}`,
		`reasoningSummary=${safeDebugValue(reasoning?.summary)}`,
		`textVerbosity=${safeDebugValue(text?.verbosity)}`,
		`serviceTier=${safeDebugValue(record.service_tier)}`,
		...summarizeResponsesCompactionItems(input),
		`store=${safeDebugValue(record.store)}`,
		`promptCacheKey=${record.prompt_cache_key === void 0 ? "absent" : "present"}`,
		`metadataKeys=${record.metadata && typeof record.metadata === "object" ? Object.keys(record.metadata).toSorted().join(",") : "none"}`
	];
	if (resolveModelPayloadDebugMode() === "full-redacted") parts.push(`payload=${stringifyRedactedPayload(record)}`);
	return parts.join(" ");
}
function summarizeOpenAITransportError(error) {
	if (!error || typeof error !== "object") return `type=${typeof error} message=${safeDebugValue(error)}`;
	const record = error;
	const cause = record.cause && typeof record.cause === "object" ? record.cause : void 0;
	return [
		`name=${safeDebugValue(record.name)}`,
		`status=${safeDebugValue(record.status)}`,
		`code=${safeDebugValue(record.code)}`,
		`type=${safeDebugValue(record.type)}`,
		`causeName=${safeDebugValue(cause?.name)}`,
		`causeCode=${safeDebugValue(cause?.code)}`,
		`message=${error instanceof Error ? error.message : safeDebugValue(error)}`
	].join(" ");
}
//#endregion
//#region packages/ai/src/transports/openai-responses-replay-internal.ts
function isAsyncIterable(value) {
	return (typeof value === "object" && value !== null || typeof value === "function") && Symbol.asyncIterator in value;
}
function isInvalidEncryptedContentError(error) {
	if (!error || typeof error !== "object") return false;
	const record = error;
	if (record.code === "invalid_encrypted_content" || record.code === "thinking_signature_invalid") return true;
	const message = typeof record.message === "string" ? record.message.toLowerCase() : "";
	return message.includes("invalid_encrypted_content") || message.includes("thinking_signature_invalid") || (record.status === 400 || record.status == null && /(?:^|[\s(])400(?:[\s):]|$)/.test(message)) && (message.includes("could not decrypt the provided encrypted_content") || message.includes("encrypted content") && (message.includes("could not be verified") || message.includes("could not be decrypted or parsed")));
}
function isOrphanedFunctionCallOutputError(error) {
	if (!error || typeof error !== "object") return false;
	const record = error;
	const message = typeof record.message === "string" ? record.message : "";
	return /No tool call found for function call output with call_id [A-Za-z0-9_-]+/.test(message);
}
function commitResponsesEncryptedContentAttempt(attempt, commit) {
	if (attempt.kind === "compaction-stripped") commit(attempt.rejectedCompaction);
}
function stripResponsesRequestEncryptedReasoning(request) {
	const stripped = stripEncryptedReasoningContentFields(request.input);
	if (!stripped.changed) return request;
	return {
		...request,
		input: stripped.value
	};
}
function stripResponsesRequestCompaction(request) {
	if (!Array.isArray(request.input)) return request;
	const input = request.input.filter((item) => !(item !== null && typeof item === "object" && item.type === "compaction"));
	return input.length === request.input.length ? request : {
		...request,
		input
	};
}
function readOpenAIResponsesCompactionRejection(request) {
	if (!Array.isArray(request.input)) return;
	const item = request.input.find((candidate) => candidate !== null && typeof candidate === "object" && candidate.type === "compaction" && typeof candidate.encrypted_content === "string");
	return item ? {
		data: item.encrypted_content,
		...typeof item.id === "string" ? { id: item.id } : {}
	} : void 0;
}
async function resolveNextResponsesEncryptedContentAttempt(attempt, error, options) {
	const orphanedFunctionOutput = isOrphanedFunctionCallOutputError(error);
	if (!isInvalidEncryptedContentError(error) && !orphanedFunctionOutput || attempt.kind === "compaction-stripped") return;
	if (!orphanedFunctionOutput && (attempt.kind === "initial" || attempt.kind === "continuation-rejected")) {
		const reasoningStripped = stripResponsesRequestEncryptedReasoning(attempt.request);
		if (reasoningStripped !== attempt.request) return {
			kind: "reasoning-stripped",
			request: reasoningStripped
		};
	}
	const locallyStripped = stripResponsesRequestCompaction(attempt.request);
	if (locallyStripped === attempt.request) return;
	let compactionStripped = options?.buildFullHistoryRequest ? await options.buildFullHistoryRequest() : locallyStripped;
	compactionStripped = stripResponsesRequestCompaction(compactionStripped);
	if (attempt.kind === "reasoning-stripped") compactionStripped = stripResponsesRequestEncryptedReasoning(compactionStripped);
	return {
		kind: "compaction-stripped",
		request: compactionStripped,
		rejectedCompaction: readOpenAIResponsesCompactionRejection(attempt.request)
	};
}
async function createResponsesStreamWithEncryptedContentRetry(params) {
	const send = async (initialAttempt) => {
		let attempt = initialAttempt;
		for (;;) {
			params.observePrompt?.(attempt.request, {
				egress: "responses-sdk",
				payloadVariant: attempt.kind
			});
			try {
				const { data, response } = await params.client.responses.create(attempt.request, params.requestOptions).withResponse();
				commitResponsesEncryptedContentAttempt(attempt, (checkpoint) => {
					if (checkpoint) params.onCompactionRejected?.(checkpoint);
				});
				if (!isAsyncIterable(data)) throw new Error("OpenAI Responses streaming request returned a non-stream response");
				return {
					stream: data,
					response,
					attempt
				};
			} catch (error) {
				let nextAttempt = await resolveNextResponsesEncryptedContentAttempt(attempt, error, { buildFullHistoryRequest: params.buildFullHistoryRequest });
				if (!nextAttempt && attempt.request.previous_response_id && error && typeof error === "object" && typeof error.status === "number" && isPreviousResponseRejection(error)) {
					const request = { ...params.buildFullHistoryRequest ? await params.buildFullHistoryRequest() : attempt.request };
					delete request.previous_response_id;
					nextAttempt = {
						kind: "continuation-rejected",
						request
					};
				}
				if (!nextAttempt) throw error;
				const retryDescription = nextAttempt.kind === "reasoning-stripped" ? "without encrypted reasoning content" : nextAttempt.kind === "compaction-stripped" ? "without encrypted compaction content" : "full history after rejected previous_response_id";
				log.warn(`[responses] retrying ${retryDescription} provider=${params.model.provider} api=${params.model.api} model=${params.model.id}`);
				attempt = nextAttempt;
			}
		}
	};
	const result = await send({
		kind: params.initialAttemptKind ?? "initial",
		request: params.request,
		...params.initialRejectedCompaction ? { rejectedCompaction: params.initialRejectedCompaction } : {}
	});
	return { stream: { async *[Symbol.asyncIterator]() {
		let current = result;
		for (;;) {
			let rejectedEvent;
			try {
				for await (const event of params.wrapStream?.(current) ?? current.stream) {
					if (isRecord(event)) {
						const failure = event.type === "response.failed" && isRecord(event.response) ? event.response.error : event.type === "error" ? event.error ?? event : void 0;
						if (isRecord(failure) && params.canRetryStream?.() === true && isInvalidEncryptedContentError(failure)) {
							rejectedEvent = event;
							const message = typeof failure.message === "string" ? failure.message : "";
							throw Object.assign(new Error(message), {
								code: failure.code,
								status: failure.status
							});
						}
					}
					yield event;
				}
				return;
			} catch (error) {
				const nextAttempt = params.canRetryStream?.() === true && !params.requestOptions?.signal?.aborted ? await resolveNextResponsesEncryptedContentAttempt(current.attempt, error, { buildFullHistoryRequest: params.buildFullHistoryRequest }) : void 0;
				if (!nextAttempt) {
					if (rejectedEvent !== void 0) {
						yield rejectedEvent;
						return;
					}
					throw error;
				}
				log.warn(`[responses] retrying streamed encrypted content provider=${params.model.provider} api=${params.model.api} model=${params.model.id}`);
				current = await send(nextAttempt);
			}
		}
	} } };
}
function resolveAzureOpenAIApiVersion(env = process.env) {
	return env.AZURE_OPENAI_API_VERSION?.trim() || "preview";
}
//#endregion
//#region packages/ai/src/providers/openai-responses-stream-compat.ts
const OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE = "output_text";
const AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE = "text";
const OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE = "response.output_text.delta";
const AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE = "response.text.delta";
function isResponsesTextContentPartType(type) {
	return type === "output_text" || type === "text";
}
function isResponsesTextDeltaEventType(type) {
	return type === "response.output_text.delta" || type === "response.text.delta";
}
function isAzureResponsesTextDeltaEventType(type) {
	return type === AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE;
}
function isAzureResponsesTextDeltaEvent(event) {
	return isAzureResponsesTextDeltaEventType(event.type) && typeof event.delta === "string";
}
function resolveResponsesMessageSnapshotCollapse(params) {
	const { prior, nextText } = params;
	if (!prior?.text || !nextText || prior.phase !== params.nextPhase) return { kind: "keep" };
	if (nextText.length > prior.text.length && nextText.startsWith(prior.text)) return {
		kind: "extend",
		text: nextText
	};
	return { kind: "keep" };
}
//#endregion
//#region packages/ai/src/providers/openai-responses-tool-call-tracker.ts
function readOutputIndex(event) {
	return typeof event.output_index === "number" && Number.isInteger(event.output_index) && event.output_index >= 0 ? event.output_index : void 0;
}
function readEventIdentity(event) {
	return { itemId: normalizeOptionalString(event.item_id) };
}
function readResponsesToolCallItemIdentity(item) {
	return {
		itemId: normalizeOptionalString(item.id),
		callId: normalizeOptionalString(item.call_id)
	};
}
function createResponsesToolCallTracker() {
	const indexedCalls = /* @__PURE__ */ new Map();
	const unindexedCalls = /* @__PURE__ */ new Set();
	const identitiesConflict = (state, identity) => Boolean(state.itemId && identity.itemId && state.itemId !== identity.itemId || state.callId && identity.callId && state.callId !== identity.callId);
	const sharesIdentity = (state, identity) => Boolean(state.itemId && identity.itemId && state.itemId === identity.itemId || state.callId && identity.callId && state.callId === identity.callId);
	const adoptIdentity = (state, identity) => {
		state.itemId ??= identity.itemId;
		state.callId ??= identity.callId;
		return state;
	};
	const resolveCompatible = (candidates, identity, allowUnmatchedIdentity) => {
		const uniqueCandidates = [...new Set(candidates)];
		if (!identity.itemId && !identity.callId) return allowUnmatchedIdentity && uniqueCandidates.length === 1 ? uniqueCandidates.at(0) : void 0;
		const compatible = uniqueCandidates.filter((state) => !identitiesConflict(state, identity));
		const matches = compatible.filter((state) => sharesIdentity(state, identity));
		const matched = matches.length === 1 ? matches.at(0) : void 0;
		if (matched) return adoptIdentity(matched, identity);
		const soleCompatible = allowUnmatchedIdentity && uniqueCandidates.length === 1 && compatible.length === 1 && matches.length === 0 ? compatible.at(0) : void 0;
		return soleCompatible ? adoptIdentity(soleCompatible, identity) : void 0;
	};
	return {
		register(event, state) {
			const outputIndex = readOutputIndex(event);
			if (outputIndex === void 0) {
				unindexedCalls.add(state);
				return;
			}
			if (indexedCalls.has(outputIndex)) throw new Error(`Responses stream reused active tool-call output index ${outputIndex}`);
			state.outputIndex = outputIndex;
			indexedCalls.set(outputIndex, state);
		},
		resolve(event, identity = readEventIdentity(event), allowUnmatchedIdentity = true) {
			const outputIndex = readOutputIndex(event);
			if (outputIndex !== void 0) {
				const indexed = indexedCalls.get(outputIndex);
				if (indexed) {
					if (indexed.callId && identity.callId && indexed.callId !== identity.callId) return;
					return adoptIdentity(indexed, identity);
				}
				const unindexed = resolveCompatible(unindexedCalls, identity, allowUnmatchedIdentity);
				if (unindexed) {
					unindexedCalls.delete(unindexed);
					unindexed.outputIndex = outputIndex;
					indexedCalls.set(outputIndex, unindexed);
				}
				return unindexed;
			}
			return resolveCompatible([...indexedCalls.values(), ...unindexedCalls], identity, allowUnmatchedIdentity);
		},
		forget(toolCall) {
			for (const [outputIndex, tracked] of indexedCalls) if (tracked === toolCall) indexedCalls.delete(outputIndex);
			unindexedCalls.delete(toolCall);
		},
		markArgumentsUnreliable() {
			for (const toolCall of /* @__PURE__ */ new Set([...indexedCalls.values(), ...unindexedCalls])) toolCall.argumentStreamReliable = false;
		},
		hasActive() {
			return indexedCalls.size > 0 || unindexedCalls.size > 0;
		},
		hasExactlyActive(expected) {
			const active = /* @__PURE__ */ new Set([...indexedCalls.values(), ...unindexedCalls]);
			return active.size === expected.length && expected.every((state) => active.has(state));
		}
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-stream-observer-internal.ts
const STRING_DELTA_EVENTS = /* @__PURE__ */ new Set([
	"response.function_call_arguments.delta",
	"response.output_text.delta",
	"response.reasoning_summary_text.delta",
	"response.reasoning_text.delta",
	"response.refusal.delta",
	"response.text.delta"
]);
async function* adaptResponsesStream(stream, signal) {
	const scheduler = createModelStreamCooperativeScheduler(signal);
	for await (const event of stream) {
		if (signal?.aborted) throw transportAbortError(signal);
		if (!isRecord(event) || typeof event.type !== "string") throw new Error("Responses stream delivered a malformed event without a string type");
		if (STRING_DELTA_EVENTS.has(event.type) && typeof event.delta !== "string") throw new Error(`Responses stream delivered malformed ${event.type} delta`);
		if ((event.type === "response.output_item.added" || event.type === "response.output_item.done") && !isRecord(event.item)) throw new Error(`Responses stream delivered malformed ${event.type} item`);
		if ((event.type === "response.created" || event.type === "response.completed" || event.type === "response.incomplete" || event.type === "response.failed") && !isRecord(event.response)) throw new Error(`Responses stream delivered malformed ${event.type} response`);
		yield event;
		await scheduler.afterEvent();
	}
}
async function* observeResponsesStream(stream, model, requestStartedAt) {
	const startedAt = Date.now();
	const eventTypes = /* @__PURE__ */ new Map();
	const debugMode = resolveModelSseDebugMode();
	let eventCount = 0;
	try {
		for await (const event of stream) {
			const type = isRecord(event) && typeof event.type === "string" ? event.type : "unknown";
			eventCount += 1;
			eventTypes.set(type, (eventTypes.get(type) ?? 0) + 1);
			if (eventCount === 1) emitModelTransportDebug(log, `[responses] first_event provider=${model.provider} api=${model.api} model=${model.id} elapsedMs=${Date.now() - (requestStartedAt ?? startedAt)} headersToEventMs=${Date.now() - startedAt} type=${type}`);
			if (debugMode === "peek" && eventCount <= 5) emitModelTransportDebug(log, `[responses] event_peek provider=${model.provider} api=${model.api} model=${model.id} index=${eventCount} type=${type} event=${stringifyRedactedEvent(event)}`);
			yield event;
		}
	} finally {
		const types = [...eventTypes].map(([type, count]) => `${type}:${count}`).join(",");
		emitModelTransportDebug(log, `[responses] stream_done provider=${model.provider} api=${model.api} model=${model.id} elapsedMs=${Date.now() - startedAt} events=${eventCount} types=${types}`);
	}
}
//#endregion
//#region packages/ai/src/transports/openai-responses-stream-slots-internal.ts
function createResponsesOutputTracker(params) {
	const outputs = /* @__PURE__ */ new Map();
	let currentEventType = "unknown";
	let providerToolObserved = false;
	let visibleTextEmitted = false;
	let terminalAllowsRetry = false;
	const identity = (item) => {
		if ((item.type === "reasoning" || item.type === "message") && item.id) return `${item.type}:${item.id}`;
		const callId = item.call_id ?? item.id;
		return item.type === "function_call" && callId ? `function_call:${callId}` : void 0;
	};
	const get = (item, outputIndex) => {
		const key = identity(item);
		const output = (outputIndex === void 0 ? void 0 : outputs.get(outputIndex)) ?? (key === void 0 ? void 0 : outputs.get(key));
		if (!output || outputIndex !== void 0 && output.outputIndex !== void 0 && output.outputIndex !== outputIndex) return;
		if (output.type !== item.type || output.callId && item.call_id && output.callId !== item.call_id) throw new ResponsesOutputIdentityError({
			outputIndex,
			expectedType: output.type,
			actualType: item.type,
			completed: output.completed,
			completedToolCall: [...outputs.values()].some((candidate) => candidate.type === "function_call" && candidate.completed),
			eventType: currentEventType,
			retrySafe: params.canRetryIdentityConflict?.() === true && !providerToolObserved && !visibleTextEmitted && terminalAllowsRetry && !params.output.content.some((block) => block.type === "text" && block.text.length > 0)
		});
		return output;
	};
	return {
		trackStream(sink) {
			return { push(event) {
				visibleTextEmitted ||= event.type === "text_delta" && event.delta.length > 0 || event.type === "text_end" && event.content.length > 0;
				sink.push(event);
			} };
		},
		observeEvent(event) {
			currentEventType = event.type;
			terminalAllowsRetry = false;
			if (event.type === "response.output_item.added" || event.type === "response.output_item.done") providerToolObserved ||= isResponsesProviderTool(event.item);
			else if (event.type === "response.completed" || event.type === "response.incomplete") {
				let terminalHasRefusal = false;
				for (const item of event.response.output ?? []) {
					providerToolObserved ||= isResponsesProviderTool(item);
					terminalHasRefusal ||= item.type === "message" && (item.content ?? []).some((part) => part.type === "refusal");
				}
				terminalAllowsRetry = event.type === "response.completed" && event.response.status === "completed" && event.response.error == null && event.response.incomplete_details == null && !terminalHasRefusal;
			}
		},
		get,
		set(item, contentIndex, outputIndex, completed = false) {
			const output = get(item, outputIndex) ?? {
				type: item.type,
				contentIndex,
				completed
			};
			Object.assign(output, {
				contentIndex,
				completed
			});
			if (item.call_id) output.callId = item.call_id;
			if (outputIndex !== void 0) {
				output.outputIndex = outputIndex;
				outputs.set(outputIndex, output);
			}
			const key = identity(item);
			if (key !== void 0) outputs.set(key, output);
		}
	};
}
function appendResponsesPendingTextDelta(slot, delta, materialize) {
	slot.pendingText = `${slot.pendingText ?? ""}${delta}`;
	const priorText = slot.collapseCandidate?.block.text ?? "";
	if (priorText.startsWith(slot.pendingText) || slot.pendingText.startsWith(priorText)) return;
	materialize(slot);
}
function readResponsesOutputIndex(event) {
	const outputIndex = event.output_index;
	return typeof outputIndex === "number" && Number.isInteger(outputIndex) && outputIndex >= 0 ? outputIndex : void 0;
}
function createResponsesOutputSlotTracker() {
	const indexed = /* @__PURE__ */ new Map();
	let unindexed;
	return {
		register(event, slot) {
			const outputIndex = readResponsesOutputIndex(event);
			if (outputIndex === void 0) {
				if (unindexed) throw new Error("Responses stream added overlapping unindexed output items");
				unindexed = slot;
				return;
			}
			if (indexed.has(outputIndex)) throw new Error(`Responses stream reused active output index ${outputIndex}`);
			indexed.set(outputIndex, slot);
		},
		resolve(event, type) {
			const outputIndex = readResponsesOutputIndex(event);
			let slot = outputIndex === void 0 ? unindexed : indexed.get(outputIndex);
			if (outputIndex === void 0 && !slot) {
				const matches = [...indexed.values()].filter((candidate) => candidate.type === type);
				slot = matches.length === 1 ? matches[0] : void 0;
			}
			return slot?.type === type ? slot : void 0;
		},
		get(event) {
			const outputIndex = readResponsesOutputIndex(event);
			return outputIndex === void 0 ? unindexed : indexed.get(outputIndex);
		},
		resolveOutputItem(event, item) {
			if (item.type === "reasoning") return this.resolve(event, "thinking");
			if (item.type === "message") return this.resolve(event, "text");
			return readResponsesOutputIndex(event) === void 0 ? void 0 : this.get(event);
		},
		values() {
			return [.../* @__PURE__ */ new Set([...indexed.values(), ...unindexed ? [unindexed] : []])];
		},
		forget(slot) {
			if (unindexed === slot) unindexed = void 0;
			for (const [outputIndex, candidate] of indexed) if (candidate === slot) indexed.delete(outputIndex);
		}
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-stream-terminal-internal.ts
function splitToolCallId(id) {
	const separator = id.indexOf("|");
	return separator === -1 ? [id, void 0] : [id.slice(0, separator), id.slice(separator + 1)];
}
function resolveResponsesToolCallId(item, fallbackId) {
	const callId = typeof item.call_id === "string" ? item.call_id.trim() : "";
	const itemId = typeof item.id === "string" ? item.id.trim() : "";
	const [fallbackCallId, fallbackItemId = ""] = splitToolCallId(fallbackId ?? "");
	const resolvedCallId = callId || fallbackCallId;
	const resolvedItemId = itemId || fallbackItemId;
	if (resolvedCallId) return resolvedItemId ? `${resolvedCallId}|${resolvedItemId}` : resolvedCallId;
	const generated = `call_${randomUUID().replaceAll("-", "").slice(0, 24)}`;
	return resolvedItemId ? `${generated}|${resolvedItemId}` : generated;
}
function resolveCompletedResponsesToolCall(item, streamed) {
	if (item.status && item.status !== "completed") throw new IncompleteToolCallError("Responses stream completed with an incomplete terminal tool call");
	const streamedName = streamed?.name?.trim() || void 0;
	const completedName = typeof item.name === "string" ? item.name.trim() || void 0 : void 0;
	if (streamedName && completedName && streamedName !== completedName) throw new Error(`Responses stream changed tool-call function name from ${streamedName} to ${completedName}`);
	const name = completedName ?? streamedName;
	if (!name) throw new Error("Responses stream completed tool call without a function name");
	return {
		name,
		arguments: parseTerminalToolCallArguments(streamed?.arguments ?? item.arguments, "Responses stream completed tool call with invalid JSON arguments")
	};
}
function createResponsesTerminalController(params) {
	const { output, stream, model, options } = params;
	const blocks = output.content;
	const backfillReasoning = (items) => {
		for (const [outputIndex, item] of items.entries()) {
			if (item.type !== "reasoning" || !item.encrypted_content) continue;
			const tracked = params.outputs.get(item, outputIndex);
			const block = tracked && blocks[tracked.contentIndex];
			if (block?.type !== "thinking" || !block.thinkingSignature) continue;
			const stored = JSON.parse(block.thinkingSignature);
			if (!stored.encrypted_content) block.thinkingSignature = JSON.stringify({
				...stored,
				encrypted_content: item.encrypted_content
			});
			if (options?.reasoningReplayMetadata) Object.assign(block, { [OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY]: options.reasoningReplayMetadata });
		}
	};
	const appendText = (item, contentIndex) => {
		const text = (Array.isArray(item.content) ? item.content : []).map((part) => {
			const content = part;
			return content.type === "output_text" || content.type === "text" ? content.text ?? "" : content.refusal ?? "";
		}).join("");
		const block = contentIndex === void 0 ? void 0 : blocks[contentIndex];
		const started = block?.type === "text" ? block : void 0;
		if (!text && !started) return;
		const phase = item.phase ?? void 0;
		if (started && contentIndex !== void 0) {
			const previousText = started.text;
			started.text = text;
			started.textSignature = encodeTextSignatureV1(item.id, phase);
			params.setLastTextBlock({
				block: started,
				index: contentIndex,
				phase
			});
			if (text.startsWith(previousText)) {
				const delta = text.slice(previousText.length);
				if (delta) stream.push({
					type: "text_delta",
					contentIndex,
					delta
				});
			}
			stream.push({
				type: "text_end",
				contentIndex,
				content: text,
				partial: output
			});
			return contentIndex;
		}
		const previous = params.getLastTextBlock();
		const collapse = resolveResponsesMessageSnapshotCollapse({
			prior: previous && {
				text: previous.block.text,
				phase: previous.phase
			},
			nextText: text,
			nextPhase: phase
		});
		if (collapse.kind === "extend" && previous) {
			previous.block.text = collapse.text;
			previous.block.textSignature = encodeTextSignatureV1(item.id, phase);
			stream.push({
				type: "text_end",
				contentIndex: previous.index,
				content: collapse.text,
				partial: output
			});
			return previous.index;
		}
		const newBlock = {
			type: "text",
			text,
			textSignature: encodeTextSignatureV1(item.id, phase)
		};
		blocks.push(newBlock);
		const index = blocks.length - 1;
		params.setLastTextBlock({
			block: newBlock,
			index,
			phase
		});
		stream.push({
			type: "text_start",
			contentIndex: index,
			partial: output
		});
		stream.push({
			type: "text_end",
			contentIndex: index,
			content: text,
			partial: output
		});
		return index;
	};
	const emitToolCallCompletion = (item, outputIndex, started, validated) => {
		const completed = {
			id: resolveResponsesToolCallId(item, started?.block.id),
			...validated
		};
		const toolCall = started ? Object.assign(started.block, completed) : {
			type: "toolCall",
			...completed
		};
		delete toolCall.partialJson;
		const contentIndex = started?.contentIndex ?? blocks.length;
		if (!started) {
			blocks.push(toolCall);
			stream.push({
				type: "toolcall_start",
				contentIndex,
				partial: output
			});
		}
		params.outputs.set(item, contentIndex, outputIndex, true);
		stream.push({
			type: "toolcall_end",
			contentIndex,
			toolCall,
			partial: output
		});
	};
	const recoverTerminalOutput = (items, completeToolCall) => {
		let hasCompletedLaterOutput = false;
		for (const [outputIndex, item] of [...items.entries()].toReversed()) {
			const tracked = params.outputs.get(item, outputIndex);
			if (item.type === "reasoning") {
				hasCompletedLaterOutput ||= tracked !== void 0;
				continue;
			}
			if (item.type !== "message" && item.type !== "function_call") continue;
			if (tracked) {
				hasCompletedLaterOutput = true;
				continue;
			}
			if (item.type === "function_call" && !completeToolCall) continue;
			if (hasCompletedLaterOutput) throw new Error("Responses stream omitted an output item before completed output");
		}
		for (const [terminalIndex, item] of items.entries()) if (item.type === "message") {
			const tracked = params.outputs.get(item, terminalIndex);
			if (tracked?.completed) continue;
			const appendedIndex = appendText(item, tracked?.contentIndex);
			if (appendedIndex !== void 0) params.outputs.set(item, appendedIndex, terminalIndex, true);
		} else {
			params.setLastTextBlock(null);
			const alreadyCapturedCompaction = item.type === "compaction" && output.providerReplay?.type === "openai-responses-compaction" && output.providerReplay.id === item.id && output.providerReplay.data === item.encrypted_content;
			if (item.type === "compaction" && !alreadyCapturedCompaction) {
				let replayIndex = blocks.length;
				for (const [laterIndex, laterItem] of items.entries()) {
					if (laterIndex <= terminalIndex) continue;
					const laterContentIndex = params.outputs.get(laterItem, laterIndex)?.contentIndex;
					if (laterContentIndex !== void 0) {
						replayIndex = laterContentIndex;
						break;
					}
				}
				captureOpenAIResponsesCompaction(output, item, replayIndex, model, options?.reasoningReplayMetadata);
			} else if (completeToolCall && item.type === "function_call") {
				if (params.outputs.get(item, terminalIndex)?.completed) continue;
				completeToolCall(terminalIndex);
			}
		}
	};
	const finalizeTerminalFacts = (response, responseId = response.id) => {
		output.responseId = responseId || output.responseId;
		output.responseModel = options?.resolveResponseModel ? options.resolveResponseModel()?.trim() || void 0 : response.model?.trim() || void 0;
		const usage = mapResponsesTerminalUsage(response.usage);
		const reasoningTokens = readResponsesReasoningTokens(response.usage);
		if (usage) output.usage = {
			...usage,
			...reasoningTokens === void 0 ? {} : { reasoningTokens },
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		};
		calculateCost(model, output.usage);
		if (options?.applyServiceTierPricing) {
			const tier = options.resolveServiceTier ? options.resolveServiceTier(response.service_tier, options.serviceTier) : response.service_tier ?? options.serviceTier;
			options.applyServiceTierPricing(output.usage, tier);
		}
	};
	const finalizeResponse = (response, terminalEventType) => {
		backfillReasoning(response.output ?? []);
		finalizeTerminalFacts(response);
		const terminal = resolveResponsesTerminalStopReason({
			status: response.status,
			terminalEventType,
			incompleteReason: response.incomplete_details?.reason,
			hasToolCall: blocks.some((block) => block.type === "toolCall")
		});
		output.stopReason = terminal.stopReason;
		output.errorMessage = terminal.errorMessage;
		if (terminalEventType === "response.completed" && typeof response.end_turn === "boolean") output.endTurn = response.end_turn;
		const incompleteReason = response.incomplete_details?.reason;
		appendAssistantMessageDiagnostic(output, {
			type: "openai_responses_terminal",
			timestamp: Date.now(),
			details: {
				eventType: terminalEventType,
				stopReason: terminal.stopReason,
				...terminalEventType === "response.incomplete" ? { incompleteReason: incompleteReason === "max_output_tokens" || incompleteReason === "max_messages" || incompleteReason === "content_filter" || incompleteReason === "steered" ? incompleteReason : "unknown" } : {},
				endTurn: typeof response.end_turn === "boolean" ? response.end_turn : response.end_turn === void 0 ? "absent" : "invalid"
			}
		});
	};
	return {
		finalizeResponse,
		finalizeFailedResponse: finalizeTerminalFacts,
		recoverTerminalOutput,
		emitToolCallCompletion
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-stream-internal.ts
async function processResponsesStream(openaiStream, output, sink, model, options) {
	const streamingToolCalls = createResponsesToolCallTracker();
	const outputSlots = createResponsesOutputSlotTracker();
	const outputs = createResponsesOutputTracker({
		output,
		canRetryIdentityConflict: options?.canRetryIdentityConflict
	});
	const stream = outputs.trackStream(sink);
	let terminalResponse;
	let incompleteToolCall;
	let lastTextBlock = null;
	const blocks = output.content;
	const compactionTracker = createCompactionTracker(output, model, options);
	const createOutputSlot = (event, item) => {
		if (item.type === "reasoning") {
			const block = {
				type: "thinking",
				thinking: ""
			};
			const slot = {
				type: "thinking",
				item,
				block,
				contentIndex: blocks.length,
				outputIndex: readResponsesOutputIndex(event)
			};
			blocks.push(block);
			outputs.set(item, slot.contentIndex, slot.outputIndex);
			outputSlots.register(event, slot);
			stream.push({
				type: "thinking_start",
				contentIndex: slot.contentIndex,
				partial: output
			});
			return slot;
		}
		if (item.type === "message") {
			const messageItem = item;
			const collapseCandidate = lastTextBlock;
			const block = collapseCandidate ? null : {
				type: "text",
				text: "",
				...messageItem.phase ? { textSignature: encodeTextSignatureV1(messageItem.id, messageItem.phase) } : {}
			};
			const slot = {
				type: "text",
				item: messageItem,
				block,
				contentIndex: block ? blocks.length : void 0,
				outputIndex: readResponsesOutputIndex(event),
				pendingText: collapseCandidate ? "" : null,
				collapseCandidate
			};
			if (block) {
				blocks.push(block);
				outputs.set(messageItem, slot.contentIndex ?? blocks.length - 1, slot.outputIndex);
			}
			outputSlots.register(event, slot);
			if (slot.contentIndex !== void 0) stream.push({
				type: "text_start",
				contentIndex: slot.contentIndex,
				partial: output
			});
			return slot;
		}
	};
	const materializeDeferredTextSlot = (slot) => {
		if (slot.block || slot.pendingText === null) return;
		const text = slot.pendingText;
		slot.block = {
			type: "text",
			text,
			...slot.item.phase ? { textSignature: encodeTextSignatureV1(slot.item.id, slot.item.phase) } : {}
		};
		blocks.push(slot.block);
		slot.contentIndex = blocks.length - 1;
		outputs.set(slot.item, slot.contentIndex, slot.outputIndex);
		stream.push({
			type: "text_start",
			contentIndex: slot.contentIndex,
			partial: output
		});
		if (text) stream.push({
			type: "text_delta",
			contentIndex: slot.contentIndex,
			delta: text
		});
		if (lastTextBlock === slot.collapseCandidate) lastTextBlock = null;
		slot.pendingText = null;
		slot.collapseCandidate = null;
	};
	const materializeDeferredTextSlots = (except) => {
		for (const slot of outputSlots.values()) if (slot !== except && slot.type === "text") materializeDeferredTextSlot(slot);
	};
	const appendThinkingDelta = (slot, delta) => {
		appendAssistantThinking(slot.block, delta);
		stream.push({
			type: "thinking_delta",
			contentIndex: slot.contentIndex,
			delta,
			partial: output
		});
	};
	const projectTextDelta = (slot, delta) => {
		if (slot.pendingText !== null) appendResponsesPendingTextDelta(slot, delta, materializeDeferredTextSlot);
		else if (slot.block && slot.contentIndex !== void 0) {
			slot.block.text += delta;
			stream.push({
				type: "text_delta",
				contentIndex: slot.contentIndex,
				delta
			});
		}
	};
	const terminal = createResponsesTerminalController({
		output,
		stream,
		model,
		options,
		outputs,
		getLastTextBlock: () => lastTextBlock,
		setLastTextBlock: (block) => {
			lastTextBlock = block;
		}
	});
	const finalizeToolCall = (item, outputIndex, streamingToolCall, validated) => {
		const identity = {
			type: item.type,
			id: item.id || streamingToolCall?.itemId,
			call_id: item.call_id || streamingToolCall?.callId
		};
		const finalOutputIndex = outputIndex ?? streamingToolCall?.outputIndex;
		if (finalOutputIndex === void 0 && !identity.id && !identity.call_id) {
			if (!streamingToolCall) throw new Error("Responses stream completed tool call without an output identity");
			return;
		}
		if (streamingToolCall) {
			streamingToolCalls.forget(streamingToolCall);
			for (const slot of outputSlots.values()) if (slot.type === "toolCall" && slot.toolCall === streamingToolCall) outputSlots.forget(slot);
		}
		terminal.emitToolCallCompletion(identity, finalOutputIndex, streamingToolCall, {
			...validated,
			...options?.asyncToolExecution && isRecord(item) && item.async === true ? { async: true } : {}
		});
	};
	const prepareTerminalToolCalls = (items) => {
		const prepared = /* @__PURE__ */ new Map();
		const recovered = [];
		const callIds = /* @__PURE__ */ new Set();
		const allowUnmatchedIdentity = items.filter((item, index) => item.type === "function_call" && !outputs.get(item, index)?.completed).length === 1;
		for (const [outputIndex, item] of items.entries()) {
			const tracked = outputs.get(item, outputIndex);
			if (item.type !== "function_call") continue;
			if (item.call_id && callIds.has(item.call_id)) throw new Error("Responses stream repeated a terminal tool-call identity");
			if (item.call_id) callIds.add(item.call_id);
			if (tracked?.completed) continue;
			const state = streamingToolCalls.resolve({ output_index: outputIndex }, readResponsesToolCallItemIdentity(item), allowUnmatchedIdentity);
			if (tracked && !state) throw new Error("Responses stream completed with unresolved tool calls");
			const validated = resolveCompletedResponsesToolCall(item, { name: state?.block.name });
			if (state) recovered.push(state);
			prepared.set(outputIndex, () => finalizeToolCall(item, outputIndex, state, validated));
		}
		if (!streamingToolCalls.hasExactlyActive(recovered)) throw new Error("Responses stream completed with unresolved tool calls");
		return (outputIndex) => {
			const complete = prepared.get(outputIndex);
			if (!complete) throw new Error("Responses stream completed with unresolved tool calls");
			complete();
		};
	};
	const guardedStream = adaptResponsesStream(withFirstStreamEventTimeout(openaiStream, {
		provider: model.provider,
		api: model.api,
		model: model.id,
		timeoutMs: options?.firstEventTimeoutMs ?? 0,
		stage: "responses",
		abort: options?.abortFirstEventStream,
		onTimeout: options?.onFirstEventTimeout,
		hint: "The provider may be stalled while parsing the tool payload; retry with a smaller tool surface or enable OPENCLAW_DEBUG_MODEL_PAYLOAD=tools to inspect exposed tools."
	}), options?.signal);
	try {
		for await (const event of guardedStream) {
			outputs.observeEvent(event);
			notifyLlmRequestActivity(options?.signal);
			if (event.type === "response.output_item.done" && event.item.type === "function_call" && event.item.status === "incomplete") incompleteToolCall ??= event.item;
			if (incompleteToolCall && event.type !== "response.completed" && event.type !== "response.incomplete" && event.type !== "response.failed" && event.type !== "error") continue;
			if (event.type === "response.created") output.responseId = event.response.id;
			else if (event.type === "response.output_item.added") {
				materializeDeferredTextSlots();
				const item = event.item;
				compactionTracker.added(item, blocks.length);
				if (item.type !== "message") lastTextBlock = null;
				if (item.type === "reasoning" || item.type === "message") createOutputSlot(event, item);
				else if (item.type === "function_call") {
					const toolCallBlock = {
						type: "toolCall",
						id: resolveResponsesToolCallId(item),
						name: typeof item.name === "string" ? item.name.trim() : "",
						arguments: {},
						partialJson: item.arguments || ""
					};
					const contentIndex = output.content.length;
					const toolCallState = {
						block: toolCallBlock,
						contentIndex,
						argumentStreamReliable: true,
						argumentsStreamed: false,
						previewSchedule: createToolArgumentPreviewSchedule(),
						...readResponsesToolCallItemIdentity(item)
					};
					streamingToolCalls.register(event, toolCallState);
					if (readResponsesOutputIndex(event) !== void 0) outputSlots.register(event, {
						type: "toolCall",
						toolCall: toolCallState
					});
					output.content.push(toolCallBlock);
					outputs.set(item, contentIndex, readResponsesOutputIndex(event));
					stream.push({
						type: "toolcall_start",
						contentIndex,
						partial: output
					});
				}
			} else if (event.type === "response.reasoning_summary_part.added") {
				const slot = outputSlots.resolve(event, "thinking");
				if (!slot) continue;
				slot.item.summary = slot.item.summary || [];
				slot.item.summary.push(event.part);
			} else if (event.type === "response.reasoning_summary_text.delta") {
				const slot = outputSlots.resolve(event, "thinking");
				if (!slot) continue;
				slot.item.summary = slot.item.summary || [];
				const lastPart = slot.item.summary[slot.item.summary.length - 1];
				if (!lastPart) continue;
				lastPart.text += event.delta;
				appendThinkingDelta(slot, event.delta);
			} else if (event.type === "response.reasoning_summary_part.done") {
				const slot = outputSlots.resolve(event, "thinking");
				if (!slot) continue;
				slot.item.summary = slot.item.summary || [];
				const lastPart = slot.item.summary[slot.item.summary.length - 1];
				if (!lastPart) continue;
				lastPart.text += "\n\n";
				appendThinkingDelta(slot, "\n\n");
			} else if (event.type === "response.reasoning_text.delta") {
				const slot = outputSlots.resolve(event, "thinking");
				if (!slot) continue;
				appendThinkingDelta(slot, event.delta);
			} else if (event.type === "response.content_part.added") {
				const slot = outputSlots.resolve(event, "text");
				if (!slot) continue;
				slot.item.content = slot.item.content || [];
				if (event.part.type === "output_text" || event.part.type === "text" || event.part.type === "refusal") slot.item.content.push(event.part);
			} else if (event.type === "response.output_text.delta") {
				const slot = outputSlots.resolve(event, "text");
				if (!slot) continue;
				slot.item.content ||= [];
				let lastPart = slot.item.content[slot.item.content.length - 1];
				if (!isResponsesTextContentPartType(lastPart?.type)) {
					lastPart = {
						type: "output_text",
						text: "",
						annotations: []
					};
					slot.item.content.push(lastPart);
				}
				lastPart.text += event.delta;
				projectTextDelta(slot, event.delta);
			} else if (isAzureResponsesTextDeltaEvent(event)) {
				const slot = outputSlots.resolve(event, "text");
				if (!slot) continue;
				slot.item.content = slot.item.content || [];
				let lastPart = slot.item.content[slot.item.content.length - 1];
				if (lastPart?.type !== "text") {
					lastPart = {
						type: "text",
						text: ""
					};
					slot.item.content.push(lastPart);
				}
				lastPart.text += event.delta;
				projectTextDelta(slot, event.delta);
			} else if (event.type === "response.refusal.delta") {
				const slot = outputSlots.resolve(event, "text");
				if (!slot) continue;
				slot.item.content ||= [];
				let lastPart = slot.item.content[slot.item.content.length - 1];
				if (lastPart?.type !== "refusal") {
					lastPart = {
						type: "refusal",
						refusal: ""
					};
					slot.item.content.push(lastPart);
				}
				lastPart.refusal += event.delta;
				projectTextDelta(slot, event.delta);
			} else if (event.type === "response.function_call_arguments.delta") {
				const toolCall = streamingToolCalls.resolve(event);
				if (toolCall) {
					toolCall.block.partialJson += event.delta;
					toolCall.argumentsStreamed = true;
					if (toolCall.previewSchedule(toolCall.block.partialJson.length)) toolCall.block.arguments = parseStreamingJson(toolCall.block.partialJson);
					stream.push({
						type: "toolcall_delta",
						contentIndex: toolCall.contentIndex,
						delta: event.delta,
						partial: output
					});
				} else if (streamingToolCalls.hasActive()) streamingToolCalls.markArgumentsUnreliable();
			} else if (event.type === "response.function_call_arguments.done") {
				const toolCall = streamingToolCalls.resolve(event);
				if (toolCall) {
					const previousPartialJson = toolCall.block.partialJson;
					const doneArguments = typeof event.arguments === "string" ? event.arguments : void 0;
					if (doneArguments !== void 0 && (doneArguments.length > 0 || previousPartialJson === "")) {
						toolCall.block.partialJson = doneArguments;
						toolCall.block.arguments = parseStreamingJson(toolCall.block.partialJson);
						toolCall.argumentStreamReliable = true;
						toolCall.argumentsStreamed = true;
					}
					if (doneArguments?.startsWith(previousPartialJson)) {
						const delta = doneArguments.slice(previousPartialJson.length);
						if (delta.length > 0) stream.push({
							type: "toolcall_delta",
							contentIndex: toolCall.contentIndex,
							delta,
							partial: output
						});
					}
				} else if (streamingToolCalls.hasActive()) streamingToolCalls.markArgumentsUnreliable();
			} else if (event.type === "response.output_item.done") {
				const item = event.item;
				if (item.type !== "message") lastTextBlock = null;
				const existingOutputSlot = outputSlots.resolveOutputItem(event, item);
				materializeDeferredTextSlots(existingOutputSlot);
				const outputSlot = existingOutputSlot ?? createOutputSlot(event, item);
				compactionTracker.completed(item, blocks.length);
				if (item.type === "reasoning" && outputSlot?.type === "thinking") {
					const summaryText = item.summary?.map((s) => s.text).join("\n\n") || "";
					const contentText = item.content?.map((c) => c.text).join("\n\n") || "";
					outputSlot.block.thinking = summaryText || contentText || outputSlot.block.thinking;
					outputSlot.block.thinkingSignature = JSON.stringify(item);
					outputs.set(item, outputSlot.contentIndex, readResponsesOutputIndex(event) ?? outputSlot.outputIndex, true);
					if (item.encrypted_content && options?.reasoningReplayMetadata) outputSlot.block[OPENAI_RESPONSES_REASONING_REPLAY_BLOCK_META_KEY] = options.reasoningReplayMetadata;
					stream.push({
						type: "thinking_end",
						contentIndex: outputSlot.contentIndex,
						content: outputSlot.block.thinking,
						partial: output
					});
					outputSlots.forget(outputSlot);
				} else if (item.type === "message" && outputSlot?.type === "text" && (outputSlot.block || outputSlot.pendingText !== null)) {
					const streamedText = outputSlot.pendingText ?? outputSlot.block?.text ?? "";
					const finalText = item.content == null ? streamedText : item.content.map((c) => c.type === "output_text" || c.type === "text" ? c.text : c.refusal).join("");
					const phase = item.phase ?? void 0;
					const collapse = outputSlot.pendingText !== null ? resolveResponsesMessageSnapshotCollapse({
						prior: outputSlot.collapseCandidate && {
							text: outputSlot.collapseCandidate.block.text,
							phase: outputSlot.collapseCandidate.phase
						},
						nextText: finalText,
						nextPhase: phase
					}) : { kind: "keep" };
					outputSlot.pendingText = null;
					if (collapse.kind === "extend" && outputSlot.collapseCandidate) {
						outputSlot.collapseCandidate.block.text = collapse.text;
						outputSlot.collapseCandidate.block.textSignature = encodeTextSignatureV1(item.id, phase);
						stream.push({
							type: "text_end",
							contentIndex: outputSlot.collapseCandidate.index,
							content: collapse.text,
							partial: output
						});
						lastTextBlock = outputSlot.collapseCandidate;
						outputs.set(item, outputSlot.collapseCandidate.index, readResponsesOutputIndex(event) ?? outputSlot.outputIndex, true);
					} else {
						if (!outputSlot.block) {
							outputSlot.block = {
								type: "text",
								text: "",
								...phase ? { textSignature: encodeTextSignatureV1(item.id, phase) } : {}
							};
							blocks.push(outputSlot.block);
							outputSlot.contentIndex = blocks.length - 1;
							stream.push({
								type: "text_start",
								contentIndex: outputSlot.contentIndex,
								partial: output
							});
						}
						outputSlot.block.text = finalText;
						outputSlot.block.textSignature = encodeTextSignatureV1(item.id, phase);
						const contentIndex = outputSlot.contentIndex;
						if (contentIndex === void 0) throw new Error("Responses stream finalized text without a content index");
						lastTextBlock = {
							block: outputSlot.block,
							index: contentIndex,
							phase
						};
						outputs.set(item, contentIndex, readResponsesOutputIndex(event) ?? outputSlot.outputIndex, true);
						stream.push({
							type: "text_end",
							contentIndex,
							content: outputSlot.block.text,
							partial: output
						});
					}
					outputSlots.forget(outputSlot);
				} else if (item.type === "function_call") {
					if (outputs.get(item, readResponsesOutputIndex(event))?.completed) continue;
					const streamingToolCall = streamingToolCalls.resolve(event, readResponsesToolCallItemIdentity(item));
					if (!streamingToolCall && streamingToolCalls.hasActive()) continue;
					const completedArguments = typeof item.arguments === "string" ? item.arguments : void 0;
					if (streamingToolCall && !streamingToolCall.argumentStreamReliable && !completedArguments) continue;
					const streamedArguments = streamingToolCall?.block.partialJson || "";
					const parsedStreamedArguments = streamingToolCall?.argumentStreamReliable && streamingToolCall?.argumentsStreamed && streamedArguments.length > 0 && completedArguments !== void 0 && streamedArguments !== completedArguments ? parseJsonObjectPreservingUnsafeIntegers(streamedArguments) : null;
					const validated = resolveCompletedResponsesToolCall(item, {
						name: streamingToolCall?.block.name,
						arguments: parsedStreamedArguments ?? (completedArguments || streamedArguments)
					});
					finalizeToolCall(item, readResponsesOutputIndex(event), streamingToolCall, validated);
				}
			} else if (event.type === "response.completed" || event.type === "response.incomplete") {
				terminal.finalizeResponse(event.response, event.type);
				if (incompleteToolCall) {
					if (output.errorMessage) throw new Error(output.errorMessage);
					resolveCompletedResponsesToolCall(incompleteToolCall);
				}
				if (event.type === "response.incomplete" && streamingToolCalls.hasActive()) {
					if (output.errorMessage) throw new Error(output.errorMessage);
					throw new IncompleteToolCallError("Responses stream completed with unresolved tool calls");
				}
				if (event.type === "response.completed" || output.stopReason === "length") {
					const items = event.response.output ?? [];
					const completeToolCall = event.type === "response.completed" ? prepareTerminalToolCalls(items) : void 0;
					terminal.recoverTerminalOutput(items, completeToolCall);
				}
				terminalResponse = event.type === "response.completed" ? event.response : null;
				if (output.stopReason === "stop" && output.content.some((block) => block.type === "toolCall")) output.stopReason = "toolUse";
				break;
			} else if (event.type === "error") {
				const details = isRecord(event) && isRecord(event.error) ? event.error : event;
				const message = readStringValue(details.message);
				const code = normalizeStringifiedOptionalString(details.code);
				throw Object.assign(new Error(message ? code ? `Error Code ${code}: ${message}` : message : "Unknown error"), {
					code: details.code,
					error: details
				});
			} else if (event.type === "response.failed") {
				const failure = normalizeResponsesFailedEvent(isRecord(event) ? event : {}, model);
				terminal.finalizeFailedResponse(event.response, failure.responseId);
				throw new ResponsesStreamFailure(failure, event.response);
			}
		}
		if (options?.signal?.aborted) throw transportAbortError(options.signal);
		if (streamingToolCalls.hasActive()) throw new Error("Responses stream ended with unresolved tool calls");
		if (terminalResponse === void 0) throw new Error("OpenAI Responses stream ended before a terminal response event");
		return terminalResponse ?? void 0;
	} finally {
		for (const block of output.content) delete block.partialJson;
	}
}
//#endregion
//#region packages/ai/src/providers/openai-provider-refusal.ts
/** Responses uses snake_case; the ChatGPT app-server error envelope uses camelCase. */
function readOpenAIMisalignmentReview(value, continuationSupported) {
	if (!isRecord(value)) return;
	return readProviderRefusalReview({
		explanation: value.detailed_explanation ?? value.detailedExplanation,
		errorType: value.error_type ?? value.errorType,
		...continuationSupported ? { continuation: value.steer } : {}
	});
}
//#endregion
//#region packages/ai/src/providers/openai-responses-tools.ts
/** Projects direct provider descriptors before resolving their strict policy. */
function convertResponsesToolPayload(tools, options) {
	return convertPreparedResponsesTools(prepareOpenAITools(tools), resolveResponsesStrictToolSetting(options), options?.model);
}
/** The transport has already resolved policy before descriptor projection. */
function prepareResponsesTools(tools, strictSetting, model) {
	const prepared = prepareOpenAITools(tools);
	return {
		projection: prepared.projection,
		tools: convertPreparedResponsesTools(prepared, strictSetting, model)
	};
}
function convertPreparedResponsesTools(prepared, strictSetting, model) {
	const { projection, schemas } = prepared;
	return withPreparedToolSchemaNormalization(schemas, () => {
		const strict = model ? resolveOpenAIStrictToolFlagWithDiagnostics(projection, strictSetting, {
			transport: "responses",
			model
		}) : resolveOpenAIProjectedToolsStrictToolFlag(projection, strictSetting);
		return sortPromptCacheToolsByName(projection.tools).map((tool) => {
			const result = {
				type: "function",
				name: tool.name,
				description: tool.description,
				parameters: normalizeOpenAIStrictToolParameters(tool.parameters, strict === true, model?.compat)
			};
			if (strict !== void 0) result.strict = strict;
			return result;
		});
	});
}
function resolveResponsesStrictToolSetting(options) {
	if (options?.strict !== void 0) return options.strict;
	if (options?.model) return getAiTransportHost().resolveOpenAIStrictToolSetting(options.model, {
		transport: "stream",
		supportsStrictMode: options.supportsStrictMode ?? resolveOpenAICompletionsCompat(options.model).supportsStrictMode
	});
	return false;
}
//#endregion
//#region packages/ai/src/providers/openai-responses-shared.ts
function convertResponsesMessages(model, context, allowedToolCallProviders, options) {
	return convertProviderResponsesMessages(model, context, allowedToolCallProviders, options);
}
const createResponsesAssistantOutput = createOpenAIResponsesAssistantOutput;
function applyResponsesServiceTierPricing(usage, serviceTier, model) {
	let multiplier = 1;
	if (serviceTier === "flex") multiplier = .5;
	else if (serviceTier === "priority") multiplier = model.id === "gpt-5.5" ? 2.5 : 2;
	if (multiplier === 1) return;
	usage.cost.input *= multiplier;
	usage.cost.output *= multiplier;
	usage.cost.cacheRead *= multiplier;
	usage.cost.cacheWrite *= multiplier;
	usage.cost.total = usage.cost.input + usage.cost.output + usage.cost.cacheRead + usage.cost.cacheWrite;
}
function applyCommonResponsesParams(params, model, context, options, config) {
	if (options?.maxTokens) params.max_output_tokens = Math.max(options.maxTokens, 16);
	if (options?.temperature !== void 0 && supportsOpenAITemperature(model)) params.temperature = options.temperature;
	if (context.tools) {
		const tools = convertResponsesToolPayload(context.tools, { model });
		if (tools.length > 0) params.tools = tools;
	}
	if (!model.reasoning) return;
	const requestedEffort = options?.reasoningEffort ?? (options?.reasoningSummary ? "medium" : config?.setDefaultReasoningOff ?? true ? "off" : void 0);
	const effort = requestedEffort === void 0 ? void 0 : resolveOpenAIRequestReasoning(model, requestedEffort).effort;
	if (effort === void 0) return;
	params.reasoning = { effort };
	if (effort !== "none" && (options?.reasoningEffort || options?.reasoningSummary)) {
		params.reasoning.summary = options?.reasoningSummary || "auto";
		params.include = ["reasoning.encrypted_content"];
	}
}
function buildResponsesRequestOptions(options) {
	return {
		...options?.signal ? { signal: options.signal } : {},
		...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
		maxRetries: 0
	};
}
function cleanStreamingScratchBuffers(output) {
	for (const block of output.content) {
		delete block.index;
		delete block.partialJson;
	}
}
async function runResponsesStreamLifecycle(params) {
	const { stream, output, options } = params;
	let firstEventAbort;
	try {
		const model = params.resolveRequestModel?.(params.model) ?? params.model;
		const client = params.createClient(model);
		const buildRequest = async (replayMode) => {
			let request = params.buildParams(model, replayMode);
			const nextRequest = await options?.onPayload?.(request, model);
			if (nextRequest !== void 0) request = nextRequest;
			return request;
		};
		const requestParams = await buildRequest("checkpoint");
		const firstEvent = createFirstStreamEventAbortController(options?.signal);
		firstEventAbort = firstEvent;
		let started = false;
		let admittedRequest;
		const { stream: hookedOpenAIStream } = await createResponsesStreamWithEncryptedContentRetry({
			client,
			request: requestParams,
			requestOptions: {
				...buildResponsesRequestOptions(options),
				signal: firstEvent.signal
			},
			model,
			buildFullHistoryRequest: () => buildRequest("full-history"),
			onCompactionRejected: (checkpoint) => suppressOpenAIResponsesCompaction(output, model, options, checkpoint),
			canRetryStream: () => output.content.length === 0,
			wrapStream: ({ stream: openaiStream, response, attempt }) => {
				admittedRequest = attempt.kind === "initial" ? attempt.request : void 0;
				return withProviderResponseHook({
					stream: openaiStream,
					signal: firstEvent.signal,
					abort: firstEvent.abort,
					hook: createOpenAIProviderAcceptanceHook(options, response, model),
					onReady: () => {
						if (!started) {
							started = true;
							stream.push({
								type: "start",
								partial: output
							});
						}
					}
				});
			}
		});
		const firstEventTimeoutMs = getFirstStreamEventTimeoutMs(options);
		const onFirstEventTimeout = getFirstStreamEventTimeoutHandler(options);
		const terminal = await processResponsesStream(hookedOpenAIStream, output, stream, model, {
			...params.processStreamOptions || firstEventTimeoutMs !== void 0 || onFirstEventTimeout !== void 0 ? {
				...params.processStreamOptions,
				firstEventTimeoutMs: params.processStreamOptions?.firstEventTimeoutMs ?? firstEventTimeoutMs,
				abortFirstEventStream: params.processStreamOptions?.abortFirstEventStream ?? firstEventAbort.abort,
				onFirstEventTimeout: params.processStreamOptions?.onFirstEventTimeout ?? onFirstEventTimeout,
				signal: params.processStreamOptions?.signal ?? options?.signal
			} : void 0,
			canRetryIdentityConflict: () => hasOnlyResponsesFunctionTools(admittedRequest),
			reasoningReplayMetadata: buildOpenAIResponsesReasoningReplayMetadata(model, {
				sessionId: options?.sessionId,
				authProfileId: options?.authProfileId
			})
		});
		if (terminal && admittedRequest && !options?.signal?.aborted) recordResponsesContextUsage(output, model, options, admittedRequest, terminal.output, "provider");
		finalizeTransportStream({
			stream,
			output,
			signal: options?.signal
		});
	} catch (error) {
		const response = error instanceof ResponsesStreamFailure ? error.response : error;
		const rawError = isRecord(response) && isRecord(response.error) ? response.error : response;
		if (params.model.provider === "openai" && params.model.api === "openai-responses" && isRecord(rawError) && rawError.code === "misalignment_policy_violation") {
			const review = readOpenAIMisalignmentReview(rawError.misalignment, false);
			appendAssistantMessageDiagnostic(output, {
				type: "provider_refusal",
				timestamp: Date.now(),
				details: {
					provider: "openai",
					category: "misalignment",
					...review ? { review } : {}
				}
			});
		}
		failTransportStream({
			stream,
			output,
			signal: options?.signal,
			error,
			cleanup: () => cleanStreamingScratchBuffers(output)
		});
	} finally {
		firstEventAbort?.dispose();
	}
}
//#endregion
export { summarizeOpenAITransportError as A, resolveResponsesContinuationRequest as B, createResponsesStreamWithEncryptedContentRetry as C, ResponsesStreamFailure as D, resolveNextResponsesEncryptedContentAttempt as E, convertResponsesMessages$1 as F, supportsResponsesReasoningUpdate as G, responsesContinuationRequestFingerprint as H, createOpenAIResponsesAssistantOutput as I, captureOpenAIResponsesCompaction as J, CompactionReplayRefreshRequiredError as K, recordResponsesInputReplay as L, recordResponsesContextUsage as M, resolveResponsesContextUsageBoundary as N, logResponsesFailedNoDetails as O, buildResponsesInputMessage as P, resolveReplayableResponsesMessageId as Q, responsesInputFingerprint as R, commitResponsesEncryptedContentAttempt as S, resolveAzureOpenAIApiVersion as T, isConfigurationUpdate as U, responsesContinuationPrefixFingerprint as V, replayResponsesReasoningUpdates as W, resolveNewestOpenAIResponsesCompactionReplay as X, isOpenAIResponsesReplayContext as Y, suppressOpenAIResponsesCompaction as Z, isAzureResponsesTextDeltaEvent as _, runResponsesStreamLifecycle as a, isResponsesTextDeltaEventType as b, readOpenAIMisalignmentReview as c, createResponsesToolCallTracker as d, readResponsesToolCallItemIdentity as f, OPENAI_RESPONSES_OUTPUT_TEXT_DELTA_EVENT_TYPE as g, OPENAI_RESPONSES_OUTPUT_TEXT_CONTENT_PART_TYPE as h, createResponsesAssistantOutput as i, summarizeResponsesPayload as j, safeDebugValue as k, processResponsesStream as l, AZURE_RESPONSES_TEXT_DELTA_EVENT_TYPE as m, applyResponsesServiceTierPricing as n, convertResponsesToolPayload as o, AZURE_RESPONSES_TEXT_CONTENT_PART_TYPE as p, buildOpenAIResponsesReasoningReplayMetadata as q, convertResponsesMessages as r, prepareResponsesTools as s, applyCommonResponsesParams as t, observeResponsesStream as u, isAzureResponsesTextDeltaEventType as v, isInvalidEncryptedContentError as w, resolveResponsesMessageSnapshotCollapse as x, isResponsesTextContentPartType as y, claimOpenAIResponsesHttpContinuation as z };
