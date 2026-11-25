import { D as supportsClaudeAdaptiveThinking } from "./src-Ii137Gdc.mjs";
import { o as isRecord } from "./record-coerce-BgUo6bj4.mjs";
import { t as omitNullRequestHeaders } from "./request-headers-DJ4QrMC_.mjs";
import { r as normalizeLowercaseStringOrEmpty } from "./string-coerce-CpcyRbc6.mjs";
import { _ as buildAnthropicClaudeCodeIdentity, a as resolveAiTransportHeaderSentinels, r as getAiTransportHost, x as prepareClaudeNoPrefillRequestContext } from "./host-Dm4e6L6R.mjs";
import { F as resolveOpenAIReasoningEffortMap, i as OPENAI_RESPONSES_APIS } from "./openai-responses-contracts-BTBx9zkC.mjs";
import { c as truncateUtf16Safe, s as redactDiagnosticText } from "./provider-error-B7aKA_dg.mjs";
import { s as requestPreparedOpenAIResponsesCompaction } from "./openai-responses-request-lifecycle-B21tgmh-.mjs";
import { S as toErrorObject, a as resolveModelPayloadDebugMode, i as emitModelTransportError, n as formatModelTransportDebugUrl, o as resolveModelSseDebugMode, r as emitModelTransportDebug, t as formatModelTransportDebugBaseUrl } from "./diagnostics-BNlb1zlT.mjs";
import { a as streamFragmentError, i as resolveModelHeaderSentinels, n as isCodeModeModelVisibleToolName, r as readAnthropicMessagesErrorSnippet, t as MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE } from "./transport-utils-J6TkTVN5.mjs";
import { a as resolveOpenAICompletionsCompat, i as isOpenAICodexResponsesModel, n as isKnownOpenAIEndpoint, o as resolveOpenAIPromptCacheKeySupport, r as isNativeOpenAIEndpoint, s as usesNativeOpenAICodexResponsesBackend, t as detectOpenAICompletionsCompat } from "./openai-completions-compat-DgAJZBJk.mjs";
import { t as buildGuardedModelFetch } from "./host-policy-fDXTduGF.mjs";
import { A as resolveAnthropicRequestBetaHeader, B as omitFoundryBearerCredentialHeaders, C as buildAnthropicSystemBlocks, D as resolveAnthropicCacheOptions, E as logAnthropicContextEdits, M as supportsAnthropicServerSideFallback, O as resolveAnthropicEphemeralCacheControl, S as applyAnthropicRequestCacheControl, T as isDirectAnthropicModel, V as usesFoundryBearerAuth, a as createAnthropicCompactionSourceReader, b as applyAnthropicEphemeralCacheControlMarkers, i as resolveCompletionTokenReservation, j as resolveAnthropicServerCompactionPlan, k as resolveAnthropicPayloadPolicy, o as resolveNewestAnthropicCompaction, r as resolveAnthropicTransportOptions, t as runAnthropicStreamLifecycle, w as isAnthropicServerToolClearingEnabled, x as applyAnthropicPayloadPolicyToParams, y as applyAnthropicContextManagementToRequest, z as isAnthropicOAuthApiKey } from "./anthropic-stream-lifecycle-D35hUdKq.mjs";
import { r as sortPromptCacheToolsByName } from "./prompt-cache-stability-oTx0nIsh.mjs";
import { C as withProviderAcceptanceObserver, D as quoteUnsafeIntegerLiterals, E as parseJsonPreservingUnsafeIntegers, M as createAbortError, N as racePromiseWithAbortSignal, S as transportAbortError, T as parseJsonObjectPreservingUnsafeIntegers, _ as notifyProviderStreamOpened, a as copyProviderAcceptanceObserver, b as sanitizeTransportPayloadText, c as decodeSseFrames, d as finalizeTransportStream, f as iterateModelStream, g as notifyProviderHttpResponse, h as notifyProviderHttpMetadata, i as coerceTransportToolCallArguments, l as failTransportStream, m as mergeTransportHeaders, n as assignTransportErrorDetails, o as createEmptyTransportUsage, p as iterateSseFrames, r as awaitProviderLifecycleCallback, s as createWritableTransportEventStream, t as IncompleteToolCallError, u as finalizeTerminalToolCallArguments, v as parseTerminalToolCallArguments, w as withProviderResponseHook, x as throwIfModelStreamAborted, y as sanitizeNonEmptyTransportPayloadText } from "./transport-stream-shared-DPUASGj0.mjs";
import { n as getEnvApiKey } from "./env-api-keys-DlUbTgKq.mjs";
import { a as stripCompactionReplayCheckpoint, i as resolveNewestCompactionReplaySource, n as replaceCompactionReplayOwnerContent, o as stripCompactionReplayCheckpointInPlace, r as resolveCompactionReplayContentRewrite, t as isCompactionReplayCheckpoint } from "./provider-compaction-checkpoint-CaQC18C8.mjs";
import { withModelRequestBodyBytes } from "./internal/model-request-body.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-Czm9tjAm.mjs";
import { c as buildOpenAICompletionsParams, d as stripCompletionMessagesToRoleContent, f as applyCompletionsAnthropicCacheControl, g as createDeepSeekTextFilter, h as resolveMaxTokensParam, i as createOpenAIResponsesTransportStreamFn, m as canonicalizeMaxTokensParam, p as hasOpenAICompatibleConversationTurn, r as createAzureOpenAIResponsesTransportStreamFn, t as createOpenAICompletionsTransportStreamFn, u as flattenCompletionMessagesToStringContent } from "./openai-completions-transport-Dzqn0lMx.mjs";
import { i as consumeGoogleGenerateContentStream, n as projectGoogleMessages, r as requiresGoogleToolCallId, s as googleFlashSupportsMinimalThinking, t as convertGoogleTools } from "./google-messages-DsCHuWeT.mjs";
import { An as withOpenAIErrorResponseHook, Bt as normalizeOpenAIResponsesFunctionCallId, Cn as log, Ct as resolveResponsesContextUsageBoundary, Dn as readOpenAICompletionsReasoningBatch, En as readOpenAICompletionsContentDeltas, Gt as normalizeOpenAIResponsesToolArguments, Ht as splitOpenAIFunctionCallPairing, Kt as replayOpenAIResponsesToolArguments, Lt as OPENAI_RESPONSES_CALL_ID_RE, On as resolveOpenAIClientBaseUrl, Qt as resolveNewestOpenAIResponsesCompactionReplay, Rt as OPENAI_RESPONSES_FUNCTION_CALL_ITEM_ID_RE, Sn as isOpenAICompletionsThinkingEnabled, Tn as parseOpenAICompletionsUsage, Ut as sanitizeResponsesImagePayload, Vt as shouldNormalizeOpenAIResponsesToolCallId, Wt as normalizeOpenAIResponsesReasoningReplayItem, Zt as captureOpenAIResponsesCompaction, _n as GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP, an as filterCodeModePayloadTools, bn as createResponseModelTracker, cn as resolveCodeModeResponsesVisibleToolNames, en as assertCodeModeResponsesToolSurface, in as enforceCodeModeResponsesToolSurface, kn as resolvePromptCacheKey, ln as resolveOpenAIStrictToolFlagWithDiagnostics, nn as buildOpenAISdkClientOptions, on as getCompat, rn as buildOpenAISdkRequestOptions, sn as readCodeModePayloadToolName, tn as buildOpenAIClientHeaders, vn as createOpenAIProviderAcceptanceHook, wn as measureUtf8AppendBytes, xn as detachPartialSnapshot, yn as createOpenAIResponseHook, zt as OPENAI_RESPONSES_ID_MAX_LENGTH } from "./openai-responses-shared-CZBZVeqY.mjs";
import { C as resolveOpenAIResponsesRequestContextTokens, S as resolveOpenAIResponsesPayloadPolicy, a as createOpenAIResponsesCompactionSourceReader, b as normalizeOpenAIServiceTier, g as isSanitizedFrozenResponsesInput, h as buildResponsesInputImage, n as CompactionReplayRefreshRequiredError, p as readOpenAIResponsesItemRecoveryAnchor, s as getOpenAIResponsesCompactionWindowReplayBytesAvailable, v as applyOpenAIResponsesPayloadPolicy, w as resolveOpenAIResponsesServerCompactionPlan, x as resolveOpenAIResponsesCompactEndpointPlan, y as enforceOpenAIResponsesCompactionReplayStorage } from "./openai-responses-compaction-window-BwVpFH3V.mjs";
import { n as createGoogleVideoPlaceholder, r as materializeGoogleVideoSlots, t as GOOGLE_VIDEO_SLOT_OMISSION } from "./google-video-slots-CzdrKzrO.mjs";
import { randomUUID } from "node:crypto";
// packages/ai/src/transports/anthropic-transport-stream.ts
const ANTHROPIC_MESSAGES_ERROR_BODY_MAX_CHARS = 400;
const ANTHROPIC_MESSAGES_SSE_PENDING_BUFFER_MAX_CHARS = 16777216;
const DEFAULT_ANTHROPIC_BASE_URL = "https://api.anthropic.com";
/** Resolve the effective Anthropic API base URL from model or environment. */
function resolveAnthropicBaseUrl(baseUrl) {
	return baseUrl?.trim() || process.env.ANTHROPIC_BASE_URL?.trim() || DEFAULT_ANTHROPIC_BASE_URL;
}
/** Resolve the Anthropic Messages endpoint URL for the effective base URL. */
function resolveAnthropicMessagesUrl(baseUrl) {
	const normalized = resolveAnthropicBaseUrl(baseUrl).replace(/\/+$/, "");
	return normalized.endsWith("/v1") ? `${normalized}/messages` : `${normalized}/v1/messages`;
}
function withEffectiveAnthropicBaseUrl(model) {
	const baseUrl = resolveAnthropicBaseUrl(model.baseUrl);
	return baseUrl === model.baseUrl ? model : {
		...model,
		baseUrl
	};
}
function parseAnthropicSseEventData(data) {
	try {
		return JSON.parse(data);
	} catch (error) {
		throw streamFragmentError(error);
	}
}
async function* parseAnthropicSseBody(body, signal) {
	const reader = body.getReader();
	let completed = false;
	try {
		for await (const { frame, terminated } of iterateSseFrames(async () => {
			const chunk = await (signal ? racePromiseWithAbortSignal(() => reader.read().catch((error) => {
				throw toErrorObject(error, "Non-Error rejection");
			}), signal, (abortedSignal) => {
				const reason = abortedSignal.reason;
				if (reason instanceof Error) return reason;
				return createAbortError("Request was aborted", reason === void 0 ? void 0 : { cause: reason });
			}) : reader.read());
			completed = chunk.done;
			return chunk;
		}, {
			max: ANTHROPIC_MESSAGES_SSE_PENDING_BUFFER_MAX_CHARS,
			unit: "characters",
			message: `Anthropic Messages SSE response exceeded max pending buffer size (${ANTHROPIC_MESSAGES_SSE_PENDING_BUFFER_MAX_CHARS} chars) without event boundary`
		})) {
			const data = (terminated ? frame : frame.trim()).split(/\r\n|\n|\r/).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
			if (data && data !== "[DONE]") yield parseAnthropicSseEventData(data);
		}
	} finally {
		if (!completed) {
			const cancellation = reader.cancel(signal?.reason).catch(() => void 0);
			if (signal?.aborted) getAiTransportHost().observePendingProviderWork?.(cancellation);
			else await cancellation;
		}
		reader.releaseLock();
	}
}
async function readAnthropicMessagesErrorBody(response) {
	try {
		const text = await readAnthropicMessagesErrorSnippet(response) ?? "";
		try {
			return JSON.parse(text);
		} catch {
			const redacted = redactDiagnosticText(text);
			return redacted.length > ANTHROPIC_MESSAGES_ERROR_BODY_MAX_CHARS ? `${truncateUtf16Safe(redacted, ANTHROPIC_MESSAGES_ERROR_BODY_MAX_CHARS)}…` : redacted;
		}
	} catch (error) {
		if (error instanceof Error && error.message.startsWith("Anthropic Messages error response stalled:")) return error.message;
		return "";
	}
}
/** Create the stream function used by Anthropic Messages transport models. */
function createAnthropicMessagesTransportStreamFn() {
	return (rawModel, context, rawOptions) => {
		const model = withEffectiveAnthropicBaseUrl(rawModel);
		const options = rawOptions;
		const { eventStream, stream } = createWritableTransportEventStream();
		runAnthropicStreamLifecycle({
			model,
			stream,
			options,
			profile: "transport",
			prepare: () => {
				const apiKey = options?.apiKey ?? getEnvApiKey(model.provider) ?? "";
				if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
				const transportOptions = resolveAnthropicTransportOptions(model, options, apiKey);
				const requestContext = prepareClaudeNoPrefillRequestContext(model, context);
				const optionHeaders = resolveOpencodeSessionHeaders(model, transportOptions);
				const needsInterleavedBeta = (transportOptions.interleavedThinking ?? true) && !supportsClaudeAdaptiveThinking(model);
				const fetch = withModelRequestBodyBytes(options, /^kimi(?:-|$)/.test(normalizeLowercaseStringOrEmpty(model.provider ?? "")) && transportOptions.thinkingEnabled === true ? buildGuardedModelFetch(model, void 0, { sanitizeSse: false }) : buildGuardedModelFetch(model));
				const copilot = model.provider === "github-copilot";
				const bearerAuth = copilot || usesFoundryBearerAuth(resolveModelHeaderSentinels(model));
				const isOAuthToken = !bearerAuth && isAnthropicOAuthApiKey(apiKey);
				let defaultHeaders;
				let claudeCodeVersion;
				let directApiKeyBetaHeader;
				if (bearerAuth) defaultHeaders = mergeTransportHeaders({
					accept: "application/json",
					"anthropic-dangerous-direct-browser-access": "true",
					...needsInterleavedBeta ? { "anthropic-beta": "interleaved-thinking-2025-05-14" } : {}
				}, copilot ? model.headers : omitFoundryBearerCredentialHeaders(model.headers), copilot ? getAiTransportHost().buildCopilotDynamicHeaders(requestContext.messages) : void 0, optionHeaders);
				else {
					const betaFeatures = ["fine-grained-tool-streaming-2025-05-14"];
					if (needsInterleavedBeta) betaFeatures.push("interleaved-thinking-2025-05-14");
					const betaHeader = !isDirectAnthropicModel(model) ? void 0 : isOAuthToken ? `claude-code-20250219,oauth-2025-04-20,${betaFeatures.join(",")}` : betaFeatures.join(",");
					if (isOAuthToken) {
						const identity = buildAnthropicClaudeCodeIdentity(betaHeader, model.headers, optionHeaders);
						defaultHeaders = identity.headers;
						claudeCodeVersion = identity.version;
					} else {
						defaultHeaders = mergeTransportHeaders({
							accept: "application/json",
							"anthropic-dangerous-direct-browser-access": "true",
							...betaHeader ? { "anthropic-beta": betaHeader } : {},
							...transportOptions.sessionId && transportOptions.cacheRetention !== "none" && model.compat?.sendSessionAffinityHeaders === true ? { "x-session-affinity": transportOptions.sessionId } : {}
						}, model.headers, optionHeaders, getAiTransportHost().resolveProviderRequestHeaders({
							provider: model.provider,
							api: model.api,
							baseUrl: model.baseUrl,
							model
						}));
						directApiKeyBetaHeader = isDirectAnthropicModel(model) ? new Headers(omitNullRequestHeaders(defaultHeaders)).get("anthropic-beta") ?? "" : void 0;
					}
				}
				const url = resolveAnthropicMessagesUrl(model.baseUrl);
				return {
					context: requestContext,
					options: transportOptions,
					isOAuthToken,
					serverSideFallback: !isOAuthToken && supportsAnthropicServerSideFallback(model),
					claudeCodeVersion,
					directApiKeyBetaHeader,
					request: async (_body, requestHeaders, encodeBody) => {
						const headers = new Headers(omitNullRequestHeaders(mergeTransportHeaders({
							"content-type": "application/json",
							"anthropic-version": "2023-06-01",
							...bearerAuth || isOAuthToken ? { authorization: `Bearer ${apiKey}` } : { "x-api-key": apiKey }
						}, defaultHeaders)));
						for (const [name, value] of Object.entries(requestHeaders ?? {})) headers.set(name, value);
						const response = await fetch(url, {
							method: "POST",
							headers,
							body: encodeBody(),
							signal: transportOptions.signal
						});
						return {
							response,
							events: response.body ? parseAnthropicSseBody(response.body, transportOptions.signal) : []
						};
					},
					checkResponse: async (response) => {
						if (!response.ok) {
							const errorBody = await readAnthropicMessagesErrorBody(response);
							throw Object.assign(/* @__PURE__ */ new Error(`${response.status} status code (no body)`), {
								status: response.status,
								headers: response.headers,
								errorBody
							});
						}
					}
				};
			}
		});
		return eventStream;
	};
}
// packages/ai/src/transports/provider-compaction-replay-kernel.ts
function isAssistantReplayMessage(message) {
	return message.role === "assistant";
}
/** Validate while the row is alive; neither the returned fact nor this reader retains payloads. */
function createCompactionReplayWindowFactCollector$1(model, identity, resolveImmutableData) {
	const responses = OPENAI_RESPONSES_APIS.has(model.api) ? createOpenAIResponsesCompactionSourceReader(model, identity, resolveImmutableData) : void 0;
	const anthropic = !responses && identity.enabled === true ? createAnthropicCompactionSourceReader(model, identity) : void 0;
	const readMode = (replay, contentLength) => {
		if (responses) {
			const source = responses(replay, contentLength);
			return source === void 0 ? void 0 : source === null || source.mode === "item-recovery" ? "barrier" : source.mode;
		}
		const source = anthropic?.(replay);
		return source === void 0 ? void 0 : source === null ? "barrier" : "anthropic";
	};
	return (message) => {
		if (identity.enabled === false || !isAssistantReplayMessage(message)) return;
		const replay = message.providerReplay;
		const mode = readMode(replay, message.content.length);
		if (mode === void 0) return;
		if (!isCompactionReplayCheckpoint(replay)) return { mode };
		if (replay.type === "openai-responses-retained-compaction") return {
			mode,
			rewrite: { retained: true }
		};
		const reindexed = {
			...replay,
			replayIndex: 0
		};
		const reindexedMode = readMode(reindexed, message.content.length) ?? "barrier";
		const index = Reflect.get(replay, "replayIndex") ?? 0;
		return {
			mode,
			rewrite: {
				retained: false,
				replayIndex: Number(index),
				indexIsNumber: typeof index === "number",
				reindexedMode,
				...responses && reindexedMode === "complete-window" ? { replayIndexBytes: getOpenAIResponsesCompactionWindowReplayBytesAvailable(reindexed) + 1 } : {}
			}
		};
	};
}
/** Use payload-free block identities with the same rewrite decision as the message adapter. */
function replaceCompactionReplayWindowFactContent(fact, source, content) {
	const rewrite = fact?.rewrite;
	if (!rewrite || rewrite.retained) return fact;
	const result = resolveCompactionReplayContentRewrite(source, content, rewrite.replayIndex, rewrite.indexIsNumber);
	if (result.type === "strip") return;
	if (result.type === "keep") return fact;
	return {
		mode: rewrite.replayIndexBytes !== void 0 && String(result.replayIndex).length > rewrite.replayIndexBytes ? "refresh-required" : rewrite.reindexedMode,
		rewrite: {
			...rewrite,
			replayIndex: result.replayIndex,
			indexIsNumber: true
		}
	};
}
/** Shared history projection; projectedFact describes the empty-content owner to prepend. */
function resolveCompactionReplayWindow(source, windowed, readFact) {
	const checkpoint = resolveNewestCompactionReplaySource(source, (message) => {
		const fact = readFact(message);
		return fact?.mode === "barrier" ? null : fact;
	});
	if (!checkpoint) return;
	const owner = source[checkpoint.ownerIndex];
	if (owner === void 0 || windowed.includes(owner)) return;
	const ownerIndex = source.indexOf(owner);
	const fact = checkpoint.source;
	const rewrite = fact.rewrite;
	const suffix = new Set(source.slice(ownerIndex + 1));
	return {
		ownerIndex,
		projectedFact: rewrite && !rewrite.retained ? {
			mode: rewrite.reindexedMode,
			rewrite: {
				...rewrite,
				replayIndex: 0,
				indexIsNumber: true
			}
		} : fact,
		suffix: windowed.filter((message) => suffix.has(message))
	};
}
/** Carry a checkpoint immediately after reference-preserving history limiting, before repair. */
function preserveCompactionReplayWindow$1(source, windowed, model, identity, resolveImmutableData) {
	const checkpoint = resolveCompactionReplayWindow(source, windowed, createCompactionReplayWindowFactCollector$1(model, identity, resolveImmutableData));
	if (!checkpoint) return windowed;
	const owner = source[checkpoint.ownerIndex];
	if (owner === void 0 || !isAssistantReplayMessage(owner)) return windowed;
	const replay = owner.providerReplay;
	const providerReplay = checkpoint.projectedFact.rewrite?.retained ? replay : {
		...replay,
		replayIndex: 0
	};
	return [{
		...owner,
		content: [],
		providerReplay
	}, ...checkpoint.suffix];
}
// packages/ai/src/transports/provider-compaction-replay.ts
/** Resolve from prepared transport facts; never retain or return credential material. */
function resolveCompactionReplayEligibility(model, options) {
	if (OPENAI_RESPONSES_APIS.has(model.api)) return true;
	return Boolean(options.apiKey?.trim()) && resolveAnthropicServerCompactionPlan(model, options.extraParams, options.apiKey).enabled;
}
function resolveCompactionSource(messages, model, identity) {
	if (identity.enabled === false) return;
	const assistants = messages.filter(isAssistantReplayMessage);
	const selected = (() => {
		if (OPENAI_RESPONSES_APIS.has(model.api)) {
			const responses = resolveNewestOpenAIResponsesCompactionReplay(assistants, model, identity);
			return responses && responses.mode !== "item-recovery" ? {
				family: "responses",
				...responses
			} : void 0;
		}
		if (identity.enabled !== true) return;
		const anthropic = resolveNewestAnthropicCompaction(assistants, model, identity);
		return anthropic ? {
			family: "anthropic",
			...anthropic
		} : void 0;
	})();
	if (!selected) return;
	const owner = assistants.find((message) => message === selected.owner);
	return owner ? {
		...selected,
		owner
	} : void 0;
}
/** Manual recovery uses the durable client compactor, never a guessed retained-user prefix. */
function requiresCompactionReplayRefresh(messages, model, identity) {
	const checkpoint = resolveCompactionSource(messages, model, identity);
	return checkpoint?.family === "responses" && checkpoint.mode === "refresh-required";
}
/** Validate replay facts with the active transport's immutable publication contract. */
function createCompactionReplayWindowFactCollector(model, identity) {
	return createCompactionReplayWindowFactCollector$1(model, identity, () => getAiTransportHost().immutableData);
}
/** Carry a checkpoint after reference-preserving history limiting, before transport repair. */
function preserveCompactionReplayWindow(source, windowed, model, identity) {
	return preserveCompactionReplayWindow$1(source, windowed, model, identity, () => getAiTransportHost().immutableData);
}
function estimateResponsesContent(content, estimate, text) {
	if (typeof content === "string") return text(content);
	if (!Array.isArray(content)) return estimate.json(content);
	return content.reduce((tokens, block) => {
		if (!isRecord(block)) return tokens + estimate.json(block);
		if ((block.type === "input_text" || block.type === "output_text") && typeof block.text === "string") {
			const { text: value, ...metadata } = block;
			return tokens + text(value) + estimate.json(metadata);
		}
		if (block.type === "input_image") {
			const { image_url: url, ...metadata } = block;
			return tokens + estimate.image() + estimate.json(typeof url === "string" && url.startsWith("data:") ? metadata : block);
		}
		return tokens + estimate.json(block);
	}, 0);
}
function estimateResponsesInput(input, estimate, compactionOutputTokens) {
	return input.reduce((tokens, entry) => {
		if (!isRecord(entry)) return tokens + estimate.json(entry);
		if (entry.type === "compaction" && typeof entry.encrypted_content === "string") {
			const { encrypted_content, ...metadata } = entry;
			return tokens + (compactionOutputTokens ?? estimate.text(encrypted_content)) + estimate.json(metadata);
		}
		if (entry.type === "message") {
			const { content, ...metadata } = entry;
			return tokens + estimate.json(metadata) + estimateResponsesContent(content, estimate, (value) => estimate.text(value));
		}
		if (entry.type === "function_call_output" || entry.type === "custom_tool_call_output") {
			const { output, ...metadata } = entry;
			return tokens + estimate.json(metadata) + estimateResponsesContent(output, estimate, (value) => estimate.toolResult ? estimate.toolResult(value) : estimate.text(value));
		}
		return tokens + estimate.json(entry);
	}, 0);
}
/** Estimate the canonical prefix and its tail once, independent of unbound usage snapshots. */
function resolveCompactionReplayPressure(messages, model, identity, estimate, systemPrompt, requestContext) {
	const checkpoint = resolveCompactionSource(messages, model, identity);
	if (!checkpoint) return;
	if (checkpoint.family === "responses" && checkpoint.mode === "refresh-required") throw new CompactionReplayRefreshRequiredError();
	const ownerIndex = messages.findIndex((message) => message === checkpoint.owner);
	const owner = messages[ownerIndex];
	if (!owner) return;
	const prefixTokens = checkpoint.family === "anthropic" ? estimate.text(checkpoint.summary) : checkpoint.mode === "complete-window" ? estimateResponsesInput(checkpoint.output, estimate, checkpoint.outputTokens) : estimate.text(checkpoint.item.encrypted_content);
	const measuredBoundary = checkpoint.family === "responses" ? resolveResponsesContextUsageBoundary(messages, model, identity, systemPrompt, requestContext) : void 0;
	if (measuredBoundary) return {
		messages: [],
		prefixTokens: measuredBoundary.totalTokens + estimateResponsesInput(measuredBoundary.suffix, estimate),
		measuredTokens: measuredBoundary.totalTokens
	};
	const { contextUsage: _staleContextUsage, ...usage } = checkpoint.owner.usage;
	const tail = [];
	for (const message of messages.slice(ownerIndex + 1)) {
		if (!isAssistantReplayMessage(message) || message.usage.contextUsage === void 0) {
			tail.push(message);
			continue;
		}
		const { contextUsage: _unboundContextUsage, ...billedUsage } = message.usage;
		tail.push({
			...message,
			usage: billedUsage
		});
	}
	return {
		messages: [{
			...owner,
			content: checkpoint.owner.content.slice(checkpoint.replayIndex),
			usage
		}, ...tail],
		prefixTokens
	};
}
// packages/ai/src/transports/provider-payload-hook.ts
/** Applies `onPayload` like the shared adapters: cancellation stops the wait, not the hook. */
async function applyProviderPayloadHook(options, payload, model) {
	const onPayload = options?.onPayload;
	const replacement = await awaitProviderLifecycleCallback(onPayload ? () => onPayload(payload, model) : void 0, options?.signal);
	return replacement === void 0 ? payload : replacement;
}
// packages/ai/src/transports/provider-transport-stream.ts
const SIMPLE_TRANSPORT_API_ALIAS = {
	"openai-completions": "openclaw-openai-completions-transport",
	"anthropic-messages": "openclaw-anthropic-messages-transport",
	"google-generative-ai": "openclaw-google-generative-ai-transport"
};
function createProviderOwnedGoogleTransportStreamFn(model, ctx) {
	const resolveStream = (provider) => getAiTransportHost().plugin.resolveProviderStream({
		provider,
		config: ctx?.cfg,
		workspaceDir: ctx?.workspaceDir,
		env: ctx?.env,
		context: {
			config: ctx?.cfg,
			agentDir: ctx?.agentDir,
			workspaceDir: ctx?.workspaceDir,
			provider: model.provider,
			modelId: model.id,
			model
		}
	});
	const streamFn = resolveStream(model.provider) ?? resolveStream("google") ?? void 0;
	return streamFn ? (requestModel, context, options) => streamFn(requestModel, context, {
		...options,
		headers: resolveOpencodeSessionHeaders(requestModel, options)
	}) : void 0;
}
const TRANSPORT_STREAM_FACTORIES = /* @__PURE__ */ new Map([
	["openai-responses", createOpenAIResponsesTransportStreamFn],
	["openai-chatgpt-responses", createOpenAIResponsesTransportStreamFn],
	["openai-completions", createOpenAICompletionsTransportStreamFn],
	["azure-openai-responses", createAzureOpenAIResponsesTransportStreamFn],
	["anthropic-messages", createAnthropicMessagesTransportStreamFn],
	["google-generative-ai", createProviderOwnedGoogleTransportStreamFn]
]);
function createSupportedTransportStreamFn(model, ctx) {
	return TRANSPORT_STREAM_FACTORIES.get(model.api)?.(model, ctx);
}
/** Maps public model APIs to the internal transport API id used by simple runtime dispatch. */
function resolveTransportAwareSimpleApi(api) {
	if (OPENAI_RESPONSES_APIS.has(api)) {
		const alias = `openclaw-${api}-transport`;
		return OPENAI_RESPONSES_APIS.has(alias) ? alias : void 0;
	}
	return SIMPLE_TRANSPORT_API_ALIAS[api];
}
/** Creates a managed transport stream only when request overrides require it. */
function createTransportAwareStreamFnForModel(model, ctx) {
	if (!getAiTransportHost().requiresManagedTransport(model)) return;
	const createStream = TRANSPORT_STREAM_FACTORIES.get(model.api);
	if (!createStream) throw new Error(`Model-provider request.proxy/request.tls/localService is not yet supported for api "${model.api}"`);
	const streamFn = createStream(model, ctx);
	if (!streamFn) throw new Error(`Managed transport stream is unavailable for api "${model.api}"`);
	return streamFn;
}
function prepareTransportAwareSimpleModel(model, ctx) {
	const streamFn = createTransportAwareStreamFnForModel(model, ctx);
	const alias = resolveTransportAwareSimpleApi(model.api);
	if (!streamFn || !alias) return model;
	return getAiTransportHost().inheritManagedTransport(model, {
		...model,
		api: alias
	});
}
// packages/ai/src/transports/provider-wait.ts
/** A provider-owned wait lasts only until its first response event or settlement. */
function createProviderWaitObserver(options) {
	let timer;
	let started = false;
	let stopped = false;
	let shown;
	const signal = options?.signal;
	const notify = options?.onProviderWait;
	const report = (reason) => {
		if (!started || stopped || !notify || shown === reason) return;
		shown = reason;
		notify(reason);
	};
	const stop = () => {
		if (stopped) return;
		stopped = true;
		clearTimeout(timer);
		signal?.removeEventListener("abort", stop);
		if (shown) {
			shown = void 0;
			notify?.(null);
		}
	};
	return {
		start() {
			if (started || stopped || !notify || signal?.aborted) return;
			started = true;
			signal?.addEventListener("abort", stop, { once: true });
			timer = setTimeout(() => {
				if (!shown) report("response");
			}, 1e3);
			timer.unref?.();
		},
		report,
		stop
	};
}
// packages/ai/src/transports/simple-completion-transport.ts
/** Standalone completions have no durable session, but may require routing identity. */
function prepareHeadersForSimpleCompletion(model, options) {
	return resolveOpencodeSessionHeaders(model, {
		...options,
		sessionId: options?.sessionId || randomUUID()
	});
}
const PROVIDER_SIMPLE_COMPLETION_API_PREFIX = "openclaw-provider-simple:";
const PROVIDER_STREAM_API_PREFIX = "openclaw-provider-stream:";
const INVALID_CODEX_BASE_URL_MESSAGE = "OpenAI Codex Responses baseUrl must not include query parameters or fragments";
function registerCustomApi(registry, api, streamFn) {
	getAiTransportHost().registerCustomApi(registry, api, streamFn);
	return registry.getApiProvider(api) !== void 0;
}
function projectModel(model, patch) {
	return getAiTransportHost().inheritManagedTransport(model, {
		...model,
		...patch
	});
}
function resolveAnthropicVertexSimpleApi(baseUrl) {
	return `openclaw-anthropic-vertex-simple:${baseUrl?.trim() ? encodeURIComponent(baseUrl.trim()) : "default"}`;
}
function normalizeCodexResponsesBaseUrlForOpenAISdk(baseUrl) {
	const normalized = baseUrl?.trim() || "https://chatgpt.com/backend-api";
	const parsed = URL.parse(normalized);
	const pathname = parsed?.pathname.replace(/\/+$/u, "") ?? "";
	const path = pathname.toLowerCase();
	if (parsed?.hostname.toLowerCase() === "chatgpt.com" && [
		"/backend-api",
		"/backend-api/v1",
		"/backend-api/codex",
		"/backend-api/codex/v1",
		"/backend-api/codex/responses"
	].includes(path)) {
		parsed.pathname = "/backend-api/codex";
		parsed.search = "";
		parsed.hash = "";
		return parsed.toString().replace(/\/$/u, "");
	}
	if (normalized.includes("?") || normalized.includes("#")) throw new Error(INVALID_CODEX_BASE_URL_MESSAGE);
	if (parsed) {
		parsed.pathname = path.endsWith("/codex/responses") ? pathname.slice(0, -10) : path.endsWith("/codex") ? pathname : `${pathname}/codex`;
		return parsed.toString();
	}
	const customPath = normalized.replace(/\/+$/u, "");
	if (customPath.endsWith("/codex/responses")) return customPath.slice(0, -10);
	return customPath.endsWith("/codex") ? customPath : `${customPath}/codex`;
}
function resolveProviderStreamApi(model) {
	const parts = [
		model.provider,
		model.id,
		model.api,
		model.baseUrl || "default"
	];
	return `${PROVIDER_STREAM_API_PREFIX}${parts.map((part) => encodeURIComponent(part)).join(":")}`;
}
function resolveModelTransportSentinels(model, boundary) {
	const host = getAiTransportHost();
	if (host.unwrapModelTransportSentinels) return host.unwrapModelTransportSentinels(model, boundary);
	const headers = resolveAiTransportHeaderSentinels(model.headers);
	return headers === model.headers ? model : projectModel(model, { headers });
}
function wrapPluginProviderStream(streamFn) {
	return (model, context, options) => {
		const host = getAiTransportHost();
		const apiKey = options?.apiKey ? host.resolveSecretSentinel(options.apiKey) : options?.apiKey;
		const headers = resolveAiTransportHeaderSentinels(options?.headers);
		return streamFn(resolveModelTransportSentinels(model, "plugin simple-completion stream egress"), context, apiKey === options?.apiKey && headers === options?.headers ? options : {
			...options,
			apiKey,
			headers
		});
	};
}
function prepareModelForSimpleCompletion(params) {
	const { apiRegistry, model, cfg, auth, agentId } = params;
	const wrap = (prepared) => {
		const hookSourceApi = model.api;
		if (prepared.api.startsWith(PROVIDER_SIMPLE_COMPLETION_API_PREFIX)) return prepared;
		const sourceProvider = apiRegistry.getApiProvider(prepared.api);
		if (!sourceProvider) return prepared;
		const dispatchApi = prepared.api;
		const sourceStreamFn = (runtimeModel, context, options) => sourceProvider.streamSimple(projectModel(runtimeModel, { api: dispatchApi }), context, options);
		const streamFn = getAiTransportHost().plugin.wrapSimpleCompletionStream({
			provider: prepared.provider,
			config: cfg,
			context: {
				config: cfg,
				provider: prepared.provider,
				modelId: prepared.id,
				model: prepared,
				sourceApi: hookSourceApi,
				auth,
				agentId,
				streamFn: sourceStreamFn
			}
		});
		if (!streamFn) return prepared;
		const registeredStreamFn = (runtimeModel, context, options) => streamFn(projectModel(runtimeModel, { api: hookSourceApi }), context, options);
		const parts = [
			prepared.provider,
			prepared.id,
			prepared.api,
			prepared.baseUrl || "default"
		];
		if (auth) parts.push(auth.mode, auth.authFlow ?? "");
		if (agentId) parts.push("agent", agentId);
		const api = `${PROVIDER_SIMPLE_COMPLETION_API_PREFIX}${parts.map((part) => encodeURIComponent(part)).join(":")}`;
		return registerCustomApi(apiRegistry, api, registeredStreamFn) ? projectModel(prepared, { api }) : prepared;
	};
	const pluginModel = resolveModelTransportSentinels(model, "plugin simple-completion stream construction");
	const providerStreamFn = getAiTransportHost().plugin.resolveProviderStream({
		provider: model.provider,
		config: cfg,
		context: {
			config: cfg,
			provider: model.provider,
			modelId: model.id,
			model: pluginModel
		}
	});
	const transportFallback = providerStreamFn ? void 0 : createTransportAwareStreamFnForModel(model.api === "google-generative-ai" ? pluginModel : model, { cfg });
	const streamFn = providerStreamFn ? wrapPluginProviderStream(providerStreamFn) : transportFallback && model.api === "google-generative-ai" ? wrapPluginProviderStream(transportFallback) : transportFallback;
	if (streamFn) {
		const api = apiRegistry.getApiProvider(model.api) ? resolveProviderStreamApi(model) : model.api;
		const sourceApi = model.api;
		const sourceStreamFn = (runtimeModel, context, options) => streamFn(projectModel(runtimeModel, { api: sourceApi }), context, options);
		if (registerCustomApi(apiRegistry, api, sourceStreamFn)) return wrap(api === model.api ? model : projectModel(model, { api }));
	}
	if (model.provider === "openai" && model.api === "openai-chatgpt-responses") {
		const transportModel = projectModel(model, { baseUrl: normalizeCodexResponsesBaseUrlForOpenAISdk(model.baseUrl) });
		const api = resolveTransportAwareSimpleApi(model.api);
		const codexStreamFn = createSupportedTransportStreamFn(transportModel, { cfg });
		if (api && codexStreamFn && registerCustomApi(apiRegistry, api, codexStreamFn)) return wrap(projectModel(transportModel, { api }));
	}
	const transportAwareModel = prepareTransportAwareSimpleModel(model, { cfg });
	if (transportAwareModel !== model) {
		const transportStreamFn = createTransportAwareStreamFnForModel(model, { cfg });
		if (transportStreamFn && registerCustomApi(apiRegistry, transportAwareModel.api, transportStreamFn)) return wrap(transportAwareModel);
	}
	if (model.provider === "anthropic-vertex") {
		const api = resolveAnthropicVertexSimpleApi(model.baseUrl);
		if (registerCustomApi(apiRegistry, api, getAiTransportHost().plugin.createAnthropicVertexStream(model))) return wrap(projectModel(model, { api }));
	}
	return wrap(model);
}
export { CompactionReplayRefreshRequiredError, GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP, GOOGLE_VIDEO_SLOT_OMISSION, IncompleteToolCallError, MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE, OPENAI_RESPONSES_CALL_ID_RE, OPENAI_RESPONSES_FUNCTION_CALL_ITEM_ID_RE, OPENAI_RESPONSES_ID_MAX_LENGTH, applyAnthropicContextManagementToRequest, applyAnthropicEphemeralCacheControlMarkers, applyAnthropicPayloadPolicyToParams, applyAnthropicRequestCacheControl, applyCompletionsAnthropicCacheControl, applyOpenAIResponsesPayloadPolicy, applyProviderPayloadHook, assertCodeModeResponsesToolSurface, assignTransportErrorDetails, awaitProviderLifecycleCallback, buildAnthropicSystemBlocks, buildOpenAIClientHeaders, buildOpenAICompletionsParams, buildOpenAISdkClientOptions, buildOpenAISdkRequestOptions, buildResponsesInputImage, createTransportAwareStreamFnForModel as buildTransportAwareSimpleStreamFn, createTransportAwareStreamFnForModel, canonicalizeMaxTokensParam, captureOpenAIResponsesCompaction, coerceTransportToolCallArguments, consumeGoogleGenerateContentStream, convertGoogleTools, copyProviderAcceptanceObserver, createAnthropicMessagesTransportStreamFn, createAzureOpenAIResponsesTransportStreamFn, createSupportedTransportStreamFn as createBoundaryAwareStreamFnForModel, createSupportedTransportStreamFn as createOpenClawTransportStreamFnForModel, createCompactionReplayWindowFactCollector, createDeepSeekTextFilter, createEmptyTransportUsage, createGoogleVideoPlaceholder, createOpenAICompletionsTransportStreamFn, createOpenAIProviderAcceptanceHook, createOpenAIResponseHook, createOpenAIResponsesTransportStreamFn, createProviderWaitObserver, createResponseModelTracker, createWritableTransportEventStream, decodeSseFrames, detachPartialSnapshot, detectOpenAICompletionsCompat, emitModelTransportDebug, emitModelTransportError, enforceCodeModeResponsesToolSurface, enforceOpenAIResponsesCompactionReplayStorage, failTransportStream, filterCodeModePayloadTools, finalizeTerminalToolCallArguments, finalizeTransportStream, flattenCompletionMessagesToStringContent, formatModelTransportDebugBaseUrl, formatModelTransportDebugUrl, getCompat, googleFlashSupportsMinimalThinking, hasOpenAICompatibleConversationTurn, isAnthropicServerToolClearingEnabled, isCodeModeModelVisibleToolName, isCompactionReplayCheckpoint, isDirectAnthropicModel, isKnownOpenAIEndpoint, isNativeOpenAIEndpoint, isOpenAICodexResponsesModel, isOpenAICompletionsThinkingEnabled, isSanitizedFrozenResponsesInput, iterateModelStream, iterateSseFrames, log, logAnthropicContextEdits, materializeGoogleVideoSlots, measureUtf8AppendBytes, mergeTransportHeaders, normalizeCodexResponsesBaseUrlForOpenAISdk, normalizeOpenAIResponsesFunctionCallId, normalizeOpenAIResponsesReasoningReplayItem, normalizeOpenAIResponsesToolArguments, normalizeOpenAIServiceTier, notifyProviderHttpMetadata, notifyProviderHttpResponse, notifyProviderStreamOpened, parseJsonObjectPreservingUnsafeIntegers, parseJsonPreservingUnsafeIntegers, parseOpenAICompletionsUsage, parseTerminalToolCallArguments, prepareHeadersForSimpleCompletion, prepareModelForSimpleCompletion, prepareTransportAwareSimpleModel, preserveCompactionReplayWindow, projectGoogleMessages, quoteUnsafeIntegerLiterals, readCodeModePayloadToolName, readOpenAICompletionsContentDeltas, readOpenAICompletionsReasoningBatch, readOpenAIResponsesItemRecoveryAnchor, replaceCompactionReplayOwnerContent, replaceCompactionReplayWindowFactContent, replayOpenAIResponsesToolArguments, requestPreparedOpenAIResponsesCompaction, requiresCompactionReplayRefresh, requiresGoogleToolCallId, resolveAnthropicCacheOptions, resolveAnthropicEphemeralCacheControl, resolveAnthropicMessagesUrl, resolveAnthropicPayloadPolicy, resolveAnthropicRequestBetaHeader, resolveAnthropicServerCompactionPlan, resolveCodeModeResponsesVisibleToolNames, resolveCompactionReplayContentRewrite, resolveCompactionReplayEligibility, resolveCompactionReplayPressure, resolveCompactionReplayWindow, resolveCompletionTokenReservation, resolveMaxTokensParam, resolveModelPayloadDebugMode, resolveModelSseDebugMode, resolveOpenAIClientBaseUrl, resolveOpenAICompletionsCompat, resolveOpenAIPromptCacheKeySupport, resolveOpenAIReasoningEffortMap, resolveOpenAIResponsesCompactEndpointPlan, resolveOpenAIResponsesPayloadPolicy, resolveOpenAIResponsesRequestContextTokens, resolveOpenAIResponsesServerCompactionPlan, resolveOpenAIStrictToolFlagWithDiagnostics, resolvePromptCacheKey, resolveTransportAwareSimpleApi, sanitizeNonEmptyTransportPayloadText, sanitizeResponsesImagePayload, sanitizeTransportPayloadText, shouldNormalizeOpenAIResponsesToolCallId, sortPromptCacheToolsByName as sortTransportToolsByName, splitOpenAIFunctionCallPairing, stripCompactionReplayCheckpoint, stripCompactionReplayCheckpointInPlace, stripCompletionMessagesToRoleContent, supportsAnthropicServerSideFallback, throwIfModelStreamAborted, transportAbortError, usesNativeOpenAICodexResponsesBackend, withOpenAIErrorResponseHook, withProviderAcceptanceObserver, withProviderResponseHook };
