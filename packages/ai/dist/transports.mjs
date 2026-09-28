import { n as getEnvApiKey } from "./env-api-keys-DrgeBuva.mjs";
import { _ as resolveClaudeSonnet5ModelIdentity, g as resolveClaudeOpus5ModelIdentity, y as supportsClaudeAdaptiveThinking } from "./src-DwGYYyZp.mjs";
import { n as normalizeLowercaseStringOrEmpty, t as hasNonEmptyString } from "./string-coerce-fsri9iCu.mjs";
import { o as isRecord } from "./record-coerce-DwRYMj3t.mjs";
import { E as resolveAnthropicThinkingEffort, O as usesClaudeFable5MessagesContract, S as defaultsClaudeAdaptiveThinking, T as requiresClaudeAdaptiveThinking, b as applyClaudeRequestContract, k as usesClaudeStreamingRefusalContract, n as getAiTransportHost, r as resolveAiTransportHeaderSentinels, w as prepareClaudeNoPrefillRequestContext, x as buildAnthropicClaudeCodeIdentity } from "./host-yTvBrYM2.mjs";
import { t as truncateUtf16Safe } from "./utf16-slice-CvGodqok.mjs";
import { a as redactDiagnosticText, o as stableStringify } from "./provider-error-CRhW7lkJ.mjs";
import { a as resolveModelSseDebugMode, i as resolveModelPayloadDebugMode, n as formatModelTransportDebugUrl, r as emitModelTransportDebug, t as formatModelTransportDebugBaseUrl, u as hasOnlyResponsesFunctionTools, v as toErrorObject } from "./diagnostics-CH8j2wIG.mjs";
import { a as readResponseTextSnippet, i as isCodeModeModelVisibleToolName, n as createAbortError$1, s as resolveModelHeaderSentinels, t as MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE } from "./transport-utils-03Qi0CN2.mjs";
import { a as resolveOpenAIPromptCacheKeySupport, i as resolveOpenAICompletionsCompat, n as isNativeOpenAIEndpoint, o as usesNativeOpenAICodexResponsesBackend, r as isOpenAICodexResponsesModel, t as detectOpenAICompletionsCompat } from "./openai-completions-compat-CUollwl6.mjs";
import { i as resolveProviderEndpoint, s as transformTransportMessages, t as buildGuardedModelFetch } from "./host-policy-DZO3oPPk.mjs";
import { B as logAnthropicContextEdits, C as applyAnthropicThinkingBindingControls, D as ANTHROPIC_SERVER_SIDE_FALLBACKS, F as applyAnthropicPayloadPolicyToParams, G as resolveAnthropicServerCompactionPlan, H as resolveAnthropicContextManagementBetaHeader, I as applyAnthropicRequestCacheControl, J as usesFoundryBearerAuth, K as isAnthropicOAuthApiKey, L as buildAnthropicSystemBlocks, N as applyAnthropicContextManagementToRequest, O as ANTHROPIC_SERVER_SIDE_FALLBACK_BETA, P as applyAnthropicEphemeralCacheControlMarkers, R as isAnthropicServerToolClearingEnabled, U as resolveAnthropicEphemeralCacheControl, V as resolveAnthropicCacheOptions, W as resolveAnthropicPayloadPolicy, d as convertAnthropicTools, f as buildAnthropicReplayPlan, g as normalizeAnthropicToolCallId, h as suppressAnthropicCompaction, l as buildAnthropicGenerationParams, m as resolveNewestAnthropicCompaction, p as isAnthropicReplayRejection, q as omitFoundryBearerCredentialHeaders, t as consumeAnthropicStream, u as convertAnthropicMessages, z as isDirectAnthropicModel } from "./anthropic-stream-reducer-D6ZI1wwj.mjs";
import { t as resolveCacheRetention } from "./cache-retention-0x979a5V.mjs";
import { a as codeModeToolSurfaceObserver, o as reasoningTagTextPolicy, t as adjustMaxTokensForThinking, v as sortPromptCacheToolsByName } from "./simple-options-np1XPuhm.mjs";
import { A as resolvePromptCacheKey, C as isOpenAICompletionsThinkingEnabled, D as readOpenAICompletionsContentDeltas, E as parseOpenAICompletionsUsage, M as redactIdentifier, N as sha256Hex, O as readOpenAICompletionsReasoningBatch, S as createResponseModelTracker, T as measureUtf8AppendBytes, _ as resolveOpenAIReasoningEffortMap, a as enforceCodeModeResponsesToolSurface, b as createOpenAIProviderAcceptanceHook, c as readCodeModePayloadToolName, i as buildOpenAISdkRequestOptions, j as throwIfModelStreamAborted, k as resolveOpenAIClientBaseUrl, l as resolveCodeModeResponsesVisibleToolNames, n as buildOpenAIClientHeaders, o as filterCodeModePayloadTools, r as buildOpenAISdkClientOptions, s as getCompat, t as assertCodeModeResponsesToolSurface, u as resolveOpenAIStrictToolFlagWithDiagnostics, v as GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP, w as log, x as createOpenAIResponseHook, y as createModelStreamCooperativeScheduler } from "./openai-transport-params-DZKOTSfH.mjs";
import { C as quoteUnsafeIntegerLiterals, S as parseJsonPreservingUnsafeIntegers, _ as sanitizeTransportPayloadText, a as createEmptyTransportUsage, b as withProviderResponseHook, c as finalizeTerminalToolCallArguments, d as mergeTransportMetadata, f as notifyProviderHttpMetadata, g as sanitizeNonEmptyTransportPayloadText, h as parseTerminalToolCallArguments, i as copyProviderAcceptanceObserver, l as finalizeTransportStream, m as notifyProviderStreamOpened, n as assignTransportErrorDetails, o as createWritableTransportEventStream, p as notifyProviderHttpResponse, r as coerceTransportToolCallArguments, s as failTransportStream, t as IncompleteToolCallError, u as mergeTransportHeaders, v as transportAbortError, x as parseJsonObjectPreservingUnsafeIntegers, y as withProviderAcceptanceObserver } from "./transport-stream-shared-B5RioB_Q.mjs";
import { t as createDeferredEventBuffer } from "./deferred-event-buffer-DAvyP7qA.mjs";
import { n as providerReplayContextMatches, t as buildProviderReplayContext } from "./provider-replay-context-DPr3w20a.mjs";
import { a as tagUnresolvedTextAsCommentary } from "./assistant-text-phase-C20rxWwP.mjs";
import { t as createAssistantOutput } from "./assistant-output-DM1JBNs1.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-Bcunsn4I.mjs";
import { c as flattenCompletionMessagesToStringContent, d as canonicalizeMaxTokensParam, f as resolveMaxTokensParam, l as stripCompletionMessagesToRoleContent, n as shouldEmitOpenAICompletionsReasoning, o as isAzureOpenAICompatibleHost, p as createDeepSeekTextFilter, r as buildOpenAICompletionsParams, s as finalizeOpenAICompletionsToolCalls, t as processCompletionsStream, u as applyCompletionsAnthropicCacheControl } from "./openai-completions-stream-BEkpKWMC.mjs";
import { a as googleFlashSupportsMinimalThinking, i as consumeGoogleGenerateContentStream, n as projectGoogleMessages, r as requiresGoogleToolCallId, t as convertGoogleTools } from "./google-messages-DB7GKkDk.mjs";
import { i as getFirstStreamEventTimeoutMs, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "./stream-first-event-timeout-BeptfRL6.mjs";
import { d as OpenAIResponsesWebSocketSafeRetryError, i as OPENAI_RESPONSES_APIS, l as OpenAIResponsesWebSocketPostDispatchError, m as parseOpenAIResponsesWebSocketServerError, t as AZURE_RESPONSES_FIRST_EVENT_TIMEOUT_MS, u as OpenAIResponsesWebSocketPreDispatchError } from "./openai-responses-contracts-DWrfMODE.mjs";
import { r as resolveProviderTransportTurnState, t as filterProviderTurnHeadersForExplicitOpencodeSession } from "./provider-transport-turn-state-lrXEFkYr.mjs";
import { a as applyOpenAIResponsesPayloadPolicy, c as resolveOpenAIResponsesServerCompactionPlan, i as sanitizeResponsesImagePayload, n as isOpenAIResponsesCompactionOutput, o as resolveOpenAIResponsesCompactEndpointPlan, s as resolveOpenAIResponsesPayloadPolicy, t as createBoundedOpenAIResponsesCompactionFetch } from "./openai-responses-compaction-window-BiNCT0bS.mjs";
import { A as summarizeOpenAITransportError, B as resolveResponsesContinuationRequest, C as createResponsesStreamWithEncryptedContentRetry, D as ResponsesStreamFailure, E as resolveNextResponsesEncryptedContentAttempt, G as supportsResponsesReasoningUpdate, H as responsesContinuationRequestFingerprint, I as createOpenAIResponsesAssistantOutput, J as captureOpenAIResponsesCompaction, K as CompactionReplayRefreshRequiredError, L as recordResponsesInputReplay, M as recordResponsesContextUsage, N as resolveResponsesContextUsageBoundary, O as logResponsesFailedNoDetails, Q as resolveReplayableResponsesMessageId, R as responsesInputFingerprint, T as resolveAzureOpenAIApiVersion, U as isConfigurationUpdate, V as responsesContinuationPrefixFingerprint, W as replayResponsesReasoningUpdates, X as resolveNewestOpenAIResponsesCompactionReplay, Y as isOpenAIResponsesReplayContext, Z as suppressOpenAIResponsesCompaction, j as summarizeResponsesPayload, k as safeDebugValue, l as processResponsesStream, n as applyResponsesServiceTierPricing, q as buildOpenAIResponsesReasoningReplayMetadata, u as observeResponsesStream, w as isInvalidEncryptedContentError, z as claimOpenAIResponsesHttpContinuation } from "./openai-responses-shared-DvSqtJ6_.mjs";
import { i as resolveAzureDeploymentNameFromMap, t as isOpenAICompatibleAzureResponsesBaseUrl } from "./azure-openai-responses-client-compat-C7K7QfUE.mjs";
import { n as registerSessionResourceCleanup } from "./session-resources-CkR4WWy1.mjs";
import { a as sanitizeOpenAICodexResponsesParams, n as buildOpenAIResponsesCompactSystemMessage, r as buildOpenAIResponsesParams, t as createResponsesPromptEgressObserver } from "./openai-responses-prompt-observer-internal-DPHWgbBH.mjs";
import { n as withResponsesRequestAcceptance, t as responsesRequestLifecycle } from "./openai-responses-request-lifecycle-DFuyO1pQ.mjs";
import { randomUUID } from "node:crypto";
import OpenAI, { AzureOpenAI } from "openai";
import { ResponsesWS } from "openai/resources/responses/ws.js";
//#region packages/ai/src/transports/anthropic-transport-stream.ts
/**
* Native Anthropic Messages streaming transport.
* Converts OpenClaw contexts/tools into Anthropic payloads, streams SSE events
* back into runtime output blocks, and applies provider request policy.
*/
const ANTHROPIC_MESSAGES_ERROR_BODY_MAX_BYTES = 8192;
const ANTHROPIC_MESSAGES_ERROR_BODY_MAX_CHARS = 400;
const ANTHROPIC_MESSAGES_ERROR_BODY_READ_IDLE_TIMEOUT_MS = 1e4;
const ANTHROPIC_MESSAGES_DEFAULT_MAX_TOKENS = 4096;
const ANTHROPIC_MESSAGES_FALLBACK_CONTEXT_DIVISOR = 4;
const ANTHROPIC_MESSAGES_SSE_PENDING_BUFFER_MAX_CHARS = 16777216;
function resolveAnthropicRequestModelId(model) {
	if (isDirectAnthropicModel(model) && /^anthropic\//i.test(model.id)) return model.id.replace(/^anthropic\//i, "");
	return model.id;
}
const EMPTY_ANTHROPIC_MESSAGES_FALLBACK_TEXT = ".";
function resolvePositiveAnthropicTokenLimit(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const floored = Math.floor(value);
	return floored > 0 ? floored : void 0;
}
function resolveAnthropicMessagesMaxTokens(params) {
	const requested = resolvePositiveAnthropicTokenLimit(params.requestedMaxTokens);
	if (requested !== void 0) return requested;
	const modelMax = resolvePositiveAnthropicTokenLimit(params.modelMaxTokens);
	if (modelMax !== void 0) return params.useModelDefault ? modelMax : Math.min(modelMax, 32e3);
	if (params.modelMaxTokens !== void 0) return;
	const contextWindow = resolvePositiveAnthropicTokenLimit(params.modelContextWindow);
	return contextWindow === void 0 ? ANTHROPIC_MESSAGES_DEFAULT_MAX_TOKENS : Math.max(1, Math.min(ANTHROPIC_MESSAGES_DEFAULT_MAX_TOKENS, Math.floor(contextWindow / ANTHROPIC_MESSAGES_FALLBACK_CONTEXT_DIVISOR)));
}
function isKimiAnthropicProvider(provider) {
	return /^kimi(?:-|$)/.test(normalizeLowercaseStringOrEmpty(provider ?? ""));
}
/**
* Server-side refusal fallback is a first-party Claude API beta: proxies and
* Bedrock/Vertex/Foundry reject the `fallbacks` param, and OAuth (Claude Code
* identity) requests are excluded until the beta is verified there.
*/
function useAnthropicServerSideFallback(model) {
	return (usesClaudeFable5MessagesContract(model) || resolveClaudeOpus5ModelIdentity(model) !== void 0) && isDirectAnthropicModel(model);
}
function supportsReasoningContentReplay(model) {
	return resolveProviderEndpoint(model).endpointClass === "xiaomi-native";
}
function buildAnthropicBetaHeader(model, betaFeatures, params) {
	if (!isDirectAnthropicModel(model)) return;
	return params.oauth ? `claude-code-20250219,oauth-2025-04-20,${betaFeatures.join(",")}` : betaFeatures.join(",");
}
function ensureNonEmptyAnthropicMessages(messages) {
	return messages.length > 0 ? messages : [{
		role: "user",
		content: EMPTY_ANTHROPIC_MESSAGES_FALLBACK_TEXT
	}];
}
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
function createAbortError(signal) {
	const reason = signal.reason;
	if (reason instanceof Error) return reason;
	return createAbortError$1("Request was aborted", reason === void 0 ? void 0 : { cause: reason });
}
function readAnthropicSseChunk(reader, signal) {
	if (!signal) return reader.read();
	return new Promise((resolve, reject) => {
		let settled = false;
		const onAbort = () => {
			if (settled) return;
			settled = true;
			signal.removeEventListener("abort", onAbort);
			reject(createAbortError(signal));
		};
		if (signal.aborted) {
			onAbort();
			return;
		}
		signal.addEventListener("abort", onAbort, { once: true });
		reader.read().then((result) => {
			if (settled) return;
			settled = true;
			signal.removeEventListener("abort", onAbort);
			resolve(result);
		}, (error) => {
			if (settled) return;
			settled = true;
			signal.removeEventListener("abort", onAbort);
			reject(toErrorObject(error, "Non-Error rejection"));
		});
	});
}
function parseAnthropicSseEventData(data) {
	try {
		return JSON.parse(data);
	} catch (error) {
		if (error instanceof SyntaxError) throw new Error(MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE, { cause: error });
		throw error;
	}
}
function assertAnthropicSsePendingBufferWithinLimit(pendingChars) {
	if (pendingChars <= ANTHROPIC_MESSAGES_SSE_PENDING_BUFFER_MAX_CHARS) return;
	throw new Error(`Anthropic Messages SSE response exceeded max pending buffer size (${ANTHROPIC_MESSAGES_SSE_PENDING_BUFFER_MAX_CHARS} chars) without event boundary`);
}
async function* parseAnthropicSseBody(body, signal) {
	const reader = body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";
	let completed = false;
	try {
		while (true) {
			const { done, value } = await readAnthropicSseChunk(reader, signal);
			if (done) {
				completed = true;
				break;
			}
			buffer = `${buffer}${decoder.decode(value, { stream: true })}`.replaceAll("\r\n", "\n");
			let frameEnd = buffer.indexOf("\n\n");
			while (frameEnd >= 0) {
				assertAnthropicSsePendingBufferWithinLimit(frameEnd);
				const frame = buffer.slice(0, frameEnd);
				buffer = buffer.slice(frameEnd + 2);
				const data = frame.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
				if (data && data !== "[DONE]") yield parseAnthropicSseEventData(data);
				frameEnd = buffer.indexOf("\n\n");
			}
			assertAnthropicSsePendingBufferWithinLimit(buffer.length);
		}
		const tailBuffer = `${buffer}${decoder.decode()}`.replaceAll("\r\n", "\n");
		assertAnthropicSsePendingBufferWithinLimit(tailBuffer.length);
		const tail = tailBuffer.trim();
		if (tail) {
			const data = tail.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
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
function createAnthropicMessagesClient(params) {
	const url = resolveAnthropicMessagesUrl(params.baseURL);
	return { messages: { async stream(body, options) {
		const headers = new Headers(mergeTransportHeaders({
			"content-type": "application/json",
			"anthropic-version": "2023-06-01",
			...params.apiKey ? { "x-api-key": params.apiKey } : {},
			...params.authToken ? { authorization: `Bearer ${params.authToken}` } : {}
		}, params.defaultHeaders));
		for (const [name, value] of Object.entries(options?.headers ?? {})) headers.set(name, value);
		const response = await params.fetch(url, {
			method: "POST",
			headers,
			body: JSON.stringify(body),
			signal: options?.signal
		});
		return {
			response,
			stream: response.body ? parseAnthropicSseBody(response.body, options?.signal) : []
		};
	} } };
}
async function readAnthropicMessagesErrorBody(response) {
	try {
		const text = await readResponseTextSnippet(response, {
			maxBytes: ANTHROPIC_MESSAGES_ERROR_BODY_MAX_BYTES,
			maxChars: ANTHROPIC_MESSAGES_ERROR_BODY_MAX_BYTES,
			chunkTimeoutMs: ANTHROPIC_MESSAGES_ERROR_BODY_READ_IDLE_TIMEOUT_MS,
			onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Anthropic Messages error response stalled: no data received for ${chunkTimeoutMs}ms`)
		}) ?? "";
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
function createAnthropicTransportClient(params) {
	const { model, context, apiKey, options } = params;
	const optionHeaders = resolveOpencodeSessionHeaders(model, options);
	const needsInterleavedBeta = (options?.interleavedThinking ?? true) && !supportsClaudeAdaptiveThinking(model);
	const fetch = isKimiAnthropicProvider(model.provider) && options?.thinkingEnabled === true ? buildGuardedModelFetch(model, void 0, { sanitizeSse: false }) : buildGuardedModelFetch(model);
	if (model.provider === "github-copilot") {
		const betaFeatures = needsInterleavedBeta ? ["interleaved-thinking-2025-05-14"] : [];
		return {
			client: createAnthropicMessagesClient({
				apiKey: null,
				authToken: apiKey,
				baseURL: model.baseUrl,
				defaultHeaders: mergeTransportHeaders({
					accept: "application/json",
					"anthropic-dangerous-direct-browser-access": "true",
					...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
				}, model.headers, getAiTransportHost().buildCopilotDynamicHeaders(context.messages), optionHeaders),
				fetch
			}),
			isOAuthToken: false
		};
	}
	if (usesFoundryBearerAuth(resolveModelHeaderSentinels(model))) {
		const betaFeatures = needsInterleavedBeta ? ["interleaved-thinking-2025-05-14"] : [];
		return {
			client: createAnthropicMessagesClient({
				apiKey: null,
				authToken: apiKey,
				baseURL: model.baseUrl,
				defaultHeaders: mergeTransportHeaders({
					accept: "application/json",
					"anthropic-dangerous-direct-browser-access": "true",
					...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
				}, omitFoundryBearerCredentialHeaders(model.headers), optionHeaders),
				fetch
			}),
			isOAuthToken: false
		};
	}
	const betaFeatures = ["fine-grained-tool-streaming-2025-05-14"];
	if (needsInterleavedBeta) betaFeatures.push("interleaved-thinking-2025-05-14");
	if (isAnthropicOAuthApiKey(apiKey)) {
		const betaHeader = buildAnthropicBetaHeader(model, betaFeatures, { oauth: true });
		const identity = buildAnthropicClaudeCodeIdentity(betaHeader, model.headers, optionHeaders);
		return {
			client: createAnthropicMessagesClient({
				apiKey: null,
				authToken: apiKey,
				baseURL: model.baseUrl,
				defaultHeaders: identity.headers,
				fetch
			}),
			isOAuthToken: true,
			claudeCodeVersion: identity.version
		};
	}
	if (useAnthropicServerSideFallback(model)) betaFeatures.push(ANTHROPIC_SERVER_SIDE_FALLBACK_BETA);
	const betaHeader = buildAnthropicBetaHeader(model, betaFeatures, { oauth: false });
	const defaultHeaders = mergeTransportHeaders({
		accept: "application/json",
		"anthropic-dangerous-direct-browser-access": "true",
		...betaHeader ? { "anthropic-beta": betaHeader } : {}
	}, model.headers, optionHeaders);
	return {
		client: createAnthropicMessagesClient({
			apiKey,
			baseURL: model.baseUrl,
			defaultHeaders,
			fetch
		}),
		isOAuthToken: false,
		directApiKeyBetaHeader: isDirectAnthropicModel(model) ? new Headers(defaultHeaders).get("anthropic-beta") ?? "" : void 0
	};
}
async function buildAnthropicParams(model, context, isOAuthToken, options, claudeCodeVersion) {
	const replayThinkingEnabled = requiresClaudeAdaptiveThinking(model) || options?.thinkingEnabled === true;
	const maxTokens = resolveAnthropicMessagesMaxTokens({
		modelContextWindow: model.contextWindow,
		modelMaxTokens: model.maxTokens,
		requestedMaxTokens: options?.maxTokens
	});
	if (maxTokens === void 0) throw new Error(`Anthropic Messages transport requires a positive maxTokens value for ${model.provider}/${model.id}`);
	const { cacheControl, supportsCacheControlOnTools } = resolveAnthropicCacheOptions(model, options?.cacheRetention);
	const replayPlan = buildAnthropicReplayPlan(context.messages, model, {
		enabled: !isOAuthToken && options?.anthropicServerCompaction === true,
		authProfileId: options?.authProfileId,
		sessionId: options?.sessionId
	});
	const cacheBreakpointOptOutMessageIndexes = /* @__PURE__ */ new Set();
	const messages = await convertAnthropicMessages(transformTransportMessages(replayPlan.messages, model, normalizeAnthropicToolCallId), model, isOAuthToken, {
		profile: "transport",
		allowReasoningContentReplay: supportsReasoningContentReplay(model),
		allowEmptySignature: model.compat?.allowEmptySignature,
		compaction: replayPlan.compaction,
		replayThinkingEnabled,
		cacheBreakpointOptOutMessageIndexes
	});
	const params = {
		model: resolveAnthropicRequestModelId(model),
		messages: ensureNonEmptyAnthropicMessages(messages),
		max_tokens: maxTokens,
		stream: true
	};
	if (!isOAuthToken && useAnthropicServerSideFallback(model)) params.fallbacks = ANTHROPIC_SERVER_SIDE_FALLBACKS;
	const system = buildAnthropicSystemBlocks(context.systemPrompt, isOAuthToken, cacheControl, claudeCodeVersion);
	if (system) params.system = system;
	const convertedTools = context.tools ? convertAnthropicTools(context.tools, isOAuthToken) : void 0;
	const toolProjection = convertedTools?.projection;
	Object.assign(params, buildAnthropicGenerationParams({
		model,
		options,
		tools: convertedTools?.tools,
		toolProjection,
		profile: "transport"
	}));
	applyAnthropicRequestCacheControl(params, cacheControl, supportsCacheControlOnTools, cacheBreakpointOptOutMessageIndexes);
	return {
		params,
		toolProjection,
		usedCompactionReplay: replayPlan.compaction !== void 0
	};
}
function resolveAnthropicTransportOptions(model, options, apiKey) {
	const baseMaxTokens = resolveAnthropicMessagesMaxTokens({
		modelContextWindow: model.contextWindow,
		modelMaxTokens: model.maxTokens,
		requestedMaxTokens: options?.maxTokens,
		useModelDefault: resolveClaudeSonnet5ModelIdentity(model) !== void 0 || resolveClaudeOpus5ModelIdentity(model) !== void 0
	});
	if (baseMaxTokens === void 0) throw new Error(`Anthropic Messages transport requires a positive maxTokens value for ${model.provider}/${model.id}`);
	const reasoningModelMaxTokens = resolvePositiveAnthropicTokenLimit(model.maxTokens) ?? baseMaxTokens;
	const mandatoryAdaptiveThinking = requiresClaudeAdaptiveThinking(model);
	const reasoning = options?.reasoning === "off" && mandatoryAdaptiveThinking ? "low" : options?.reasoning;
	const resolved = copyProviderAcceptanceObserver(options, {
		temperature: options?.temperature,
		stop: options?.stop,
		maxTokens: baseMaxTokens,
		signal: options?.signal,
		apiKey,
		cacheRetention: options?.cacheRetention,
		sessionId: options?.sessionId,
		headers: options?.headers,
		onPayload: options?.onPayload,
		onResponse: options?.onResponse,
		maxRetryDelayMs: options?.maxRetryDelayMs,
		metadata: options?.metadata,
		interleavedThinking: options?.interleavedThinking,
		toolChoice: options?.toolChoice,
		thinkingBudgets: options?.thinkingBudgets,
		reasoning,
		anthropicServerCompaction: options?.anthropicServerCompaction,
		anthropicCompactThreshold: options?.anthropicCompactThreshold,
		cacheTtlPruning: options?.cacheTtlPruning,
		...options?.authProfileId ? { authProfileId: options.authProfileId } : {}
	});
	if (reasoning === "off") {
		resolved.thinkingEnabled = false;
		return resolved;
	}
	if (!reasoning) {
		resolved.thinkingEnabled = defaultsClaudeAdaptiveThinking(model);
		if (resolved.thinkingEnabled) resolved.effort = resolveAnthropicThinkingEffort(model, reasoning);
		return resolved;
	}
	if (supportsClaudeAdaptiveThinking(model)) {
		resolved.thinkingEnabled = true;
		resolved.effort = resolveAnthropicThinkingEffort(model, reasoning);
		return resolved;
	}
	const adjusted = adjustMaxTokensForThinking(baseMaxTokens, reasoningModelMaxTokens, reasoning === "max" ? "high" : reasoning, options?.thinkingBudgets);
	const thinkingEnabled = adjusted.thinkingBudget >= 1024;
	resolved.maxTokens = adjusted.maxTokens;
	resolved.thinkingEnabled = thinkingEnabled;
	resolved.thinkingBudgetTokens = thinkingEnabled ? adjusted.thinkingBudget : void 0;
	return resolved;
}
/** Create the stream function used by Anthropic Messages transport models. */
function createAnthropicMessagesTransportStreamFn() {
	return (rawModel, context, rawOptions) => {
		const model = withEffectiveAnthropicBaseUrl(rawModel);
		const options = rawOptions;
		const { eventStream, stream } = createWritableTransportEventStream();
		(async () => {
			const output = createAssistantOutput(model, "anthropic-messages");
			const refusalBuffer = usesClaudeStreamingRefusalContract(model) ? createDeferredEventBuffer(stream) : void 0;
			let usedCompactionReplay = false;
			try {
				const apiKey = options?.apiKey ?? getEnvApiKey(model.provider) ?? "";
				if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
				const transportOptions = resolveAnthropicTransportOptions(model, options, apiKey);
				const requestContext = prepareClaudeNoPrefillRequestContext(model, context);
				const { client, isOAuthToken, directApiKeyBetaHeader, claudeCodeVersion } = createAnthropicTransportClient({
					model,
					context: requestContext,
					apiKey,
					options: transportOptions
				});
				const builtParams = await buildAnthropicParams(model, requestContext, isOAuthToken, transportOptions, claudeCodeVersion);
				usedCompactionReplay = builtParams.usedCompactionReplay;
				let params = builtParams.params;
				applyAnthropicContextManagementToRequest(params, model, transportOptions, directApiKeyBetaHeader);
				const nextParams = await transportOptions.onPayload?.(params, model);
				if (nextParams !== void 0) params = nextParams;
				applyClaudeRequestContract(params, model);
				const betaHeader = resolveAnthropicContextManagementBetaHeader(params, directApiKeyBetaHeader);
				const bindingHeaders = applyAnthropicThinkingBindingControls(params, betaHeader) ?? (betaHeader ? { "anthropic-beta": betaHeader } : void 0);
				const { response, stream: anthropicStream } = await client.messages.stream({
					...params,
					stream: true
				}, {
					signal: transportOptions.signal,
					headers: bindingHeaders
				});
				await notifyProviderHttpResponse({
					options: transportOptions,
					response,
					model
				});
				if (!response.ok) {
					const errorBody = await readAnthropicMessagesErrorBody(response);
					throw Object.assign(/* @__PURE__ */ new Error(`${response.status} status code (no body)`), {
						status: response.status,
						headers: response.headers,
						errorBody
					});
				}
				await consumeAnthropicStream({
					events: anthropicStream,
					model,
					options: transportOptions,
					output,
					stream,
					refusalBuffer,
					isOAuthToken,
					toolProjection: builtParams.toolProjection,
					profile: "transport"
				});
				finalizeTransportStream({
					stream,
					output
				});
			} catch (error) {
				failTransportStream({
					stream,
					output,
					signal: options?.signal,
					error,
					cleanup: () => {
						if (refusalBuffer) {
							refusalBuffer.discard();
							output.content = [];
						} else output.content = output.content.filter((block) => block.type !== "toolCall");
						if (usedCompactionReplay && isAnthropicReplayRejection(output)) suppressAnthropicCompaction(output, model, options);
						for (const block of output.content) delete block.index;
					}
				});
			}
		})();
		return eventStream;
	};
}
//#endregion
//#region packages/ai/src/transports/openai-compatible-conversation-turn.ts
/**
* OpenAI-compatible conversation turn detector.
*
* Some providers reject requests without a non-empty user/assistant turn; this
* helper checks the loose message payload shape before transport submission.
*/
function hasNonEmptyContentPart(part) {
	if (!part || typeof part !== "object") return false;
	const record = part;
	if (record.type === "text") return hasNonEmptyString(record.text);
	return true;
}
function hasNonEmptyMessageContent(content) {
	if (hasNonEmptyString(content)) return true;
	if (!Array.isArray(content)) return false;
	return content.some(hasNonEmptyContentPart);
}
function hasAssistantToolCall(message) {
	const toolCalls = message.tool_calls;
	return Array.isArray(toolCalls) && toolCalls.some((toolCall) => {
		return Boolean(toolCall && typeof toolCall === "object");
	});
}
/** Returns whether an OpenAI-compatible messages payload contains a usable turn. */
function hasOpenAICompatibleConversationTurn(messages) {
	if (!Array.isArray(messages)) return false;
	return messages.some((message) => {
		if (!message || typeof message !== "object") return false;
		const record = message;
		if (record.role === "user") return hasNonEmptyMessageContent(record.content);
		if (record.role === "assistant") return hasNonEmptyMessageContent(record.content) || hasAssistantToolCall(record);
		return false;
	});
}
//#endregion
//#region packages/ai/src/transports/openai-completions-transport.ts
function assertOpenAICompletionsPayloadHasConversationTurn(params, model) {
	const messages = params.messages;
	if (!Array.isArray(messages) || hasOpenAICompatibleConversationTurn(messages)) return;
	throw new Error(`OpenAI-compatible chat payload for ${model.provider}/${model.id} contains no non-empty user or assistant messages after compaction and transport transforms; refusing to send a system/tool-only request. Start a new user turn or repair the compacted session history.`);
}
const SSE_DONE_LINE_RE = /^data:[ \t]*\[DONE\][ \t]*$/i;
const SSE_DONE_MAX_LINE_CHARS = 1024;
function createSseDoneDetector() {
	const decoder = new TextDecoder();
	let line = "";
	let lineOverflowed = false;
	let sawDone = false;
	const finishLine = () => {
		if (!lineOverflowed && SSE_DONE_LINE_RE.test(line)) sawDone = true;
		line = "";
		lineOverflowed = false;
	};
	const observeText = (text) => {
		for (const char of text) {
			if (char === "\n" || char === "\r") {
				finishLine();
				continue;
			}
			if (!lineOverflowed && line.length < SSE_DONE_MAX_LINE_CHARS) line += char;
			else lineOverflowed = true;
		}
	};
	return {
		observe(chunk) {
			if (!sawDone) observeText(decoder.decode(chunk, { stream: true }));
		},
		finish() {
			if (sawDone) return;
			observeText(decoder.decode());
			if (line || lineOverflowed) finishLine();
		},
		sawDone: () => sawDone
	};
}
function createOpenAICompletionsClient(model, apiKey, headers, opts) {
	const clientConfig = buildOpenAICompletionsClientConfig(model, headers);
	return new OpenAI({
		apiKey,
		baseURL: clientConfig.baseURL,
		dangerouslyAllowBrowser: true,
		defaultHeaders: clientConfig.defaultHeaders,
		defaultQuery: clientConfig.defaultQuery,
		fetch: opts?.fetch ?? buildGuardedModelFetch(model),
		...buildOpenAISdkClientOptions(model)
	});
}
function buildOpenAICompletionsClientConfig(model, headers) {
	const defaultQuery = {};
	let baseURL = model.baseUrl;
	let isAzureHost = false;
	try {
		const parsed = new URL(model.baseUrl);
		isAzureHost = isAzureOpenAICompatibleHost(parsed.hostname.toLowerCase());
		parsed.searchParams.forEach((value, key) => {
			if (value) defaultQuery[key] = value;
		});
		parsed.search = "";
		baseURL = parsed.toString().replace(/\/$/, "");
	} catch {}
	if (isAzureHost) {
		const apiVersionHeader = Object.keys(headers).find((key) => key.toLowerCase() === "api-version");
		if (apiVersionHeader) {
			const apiVersion = headers[apiVersionHeader]?.trim();
			delete headers[apiVersionHeader];
			if (apiVersion && !defaultQuery["api-version"]) defaultQuery["api-version"] = apiVersion;
		}
	}
	return {
		baseURL: resolveOpenAIClientBaseUrl(model, baseURL),
		defaultHeaders: headers,
		defaultQuery: Object.keys(defaultQuery).length > 0 ? defaultQuery : void 0
	};
}
function createOpenAICompletionsTransportStreamFn() {
	return (model, context, options) => {
		const { eventStream, stream } = createWritableTransportEventStream();
		(async () => {
			const output = {
				role: "assistant",
				content: [],
				api: model.api,
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
			let firstEventAbort;
			try {
				const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
				const turnState = resolveProviderTransportTurnState(model, {
					sessionId: options?.sessionId,
					turnId: randomUUID(),
					attempt: 1,
					transport: "stream"
				});
				const optionHeaders = resolveOpencodeSessionHeaders(model, options);
				const turnHeaders = filterProviderTurnHeadersForExplicitOpencodeSession(model, options, turnState?.headers);
				const doneDetector = createSseDoneDetector();
				const baseFetch = buildGuardedModelFetch(model);
				const doneDetectingFetch = async (url, init) => {
					const response = await baseFetch(url, init);
					if (!response.body || !response.ok) return response;
					if (typeof TransformStream === "undefined" || !response.body.pipeThrough) return response;
					const transformed = response.body.pipeThrough(new TransformStream({
						transform(chunk, controller) {
							doneDetector.observe(chunk);
							controller.enqueue(chunk);
						},
						flush() {
							doneDetector.finish();
						}
					}));
					return new Response(transformed, {
						headers: response.headers,
						status: response.status,
						statusText: response.statusText
					});
				};
				const cacheRetention = resolveCacheRetention(options?.cacheRetention);
				const client = createOpenAICompletionsClient(model, apiKey, buildOpenAIClientHeaders(model, context, {
					...turnHeaders,
					...optionHeaders
				}, void 0, resolvePromptCacheKey(options, cacheRetention), cacheRetention), { fetch: doneDetectingFetch });
				let params = buildOpenAICompletionsParams(model, context, options);
				const nextParams = await options?.onPayload?.(params, model);
				if (nextParams !== void 0) params = nextParams;
				if (options?.openclawCodeModeToolSurface === true) {
					const visibleToolNames = resolveCodeModeResponsesVisibleToolNames(context);
					enforceCodeModeResponsesToolSurface(params, visibleToolNames, void 0, codeModeToolSurfaceObserver.get(options));
					assertCodeModeResponsesToolSurface(params, visibleToolNames);
				}
				if (getCompat(model).requiresNonEmptyUserOrAssistantMessage) assertOpenAICompletionsPayloadHasConversationTurn(params, model);
				const emitReasoning = shouldEmitOpenAICompletionsReasoning(model, options);
				firstEventAbort = createFirstStreamEventAbortController(options?.signal);
				const { data: responseStream, response } = await client.chat.completions.create(params, buildOpenAISdkRequestOptions(model, firstEventAbort.signal, { timeoutMs: options?.timeoutMs })).withResponse();
				const hookedResponseStream = withProviderResponseHook({
					stream: responseStream,
					signal: firstEventAbort.signal,
					abort: firstEventAbort.abort,
					hook: createOpenAIProviderAcceptanceHook(options, response, model),
					onReady: () => stream.push({
						type: "start",
						partial: output
					})
				});
				await processCompletionsStream(hookedResponseStream, output, model, stream, {
					signal: options?.signal,
					emitReasoning,
					strictReasoningTags: reasoningTagTextPolicy.isStrict(options),
					firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options),
					abortFirstEventStream: firstEventAbort.abort,
					onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
					sawStreamDONE: doneDetector.sawDone
				});
				finalizeTransportStream({
					stream,
					output,
					signal: options?.signal
				});
			} catch (error) {
				failTransportStream({
					stream,
					output,
					signal: options?.signal,
					error,
					cleanup: () => {
						output.stopReason = options?.signal?.aborted ? "aborted" : "error";
						finalizeOpenAICompletionsToolCalls(output, { allowSilentToolCallPromotion: false });
						tagUnresolvedTextAsCommentary(output);
					}
				});
			} finally {
				firstEventAbort?.dispose();
			}
		})();
		return eventStream;
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-steering.ts
function cloneWireRequest(request) {
	const serialized = JSON.stringify(request);
	return JSON.parse(serialized);
}
async function projectResponsesSteeringInput(request, project) {
	const { input: activeInput, ...activeSettings } = cloneWireRequest(request);
	if (!Array.isArray(activeInput)) return [];
	const { input, ...settings } = cloneWireRequest(await project());
	if (!Array.isArray(input) || stableStringify(settings) !== stableStringify(activeSettings) || stableStringify(input.slice(0, activeInput.length)) !== stableStringify(activeInput)) return [];
	const projected = input.slice(activeInput.length);
	return projected.every((item) => isRecord(item) && item.role === "user") ? projected : [];
}
/** One response owns admission; accepted input stays on this connection until continuation. */
function createResponsesSteering(params) {
	let responseId;
	let sealed = false;
	let unsubscribe;
	const pending = [];
	const accepted = /* @__PURE__ */ new Map();
	const acknowledged = /* @__PURE__ */ new Set();
	const seal = () => {
		sealed = true;
		const cleanup = unsubscribe;
		unsubscribe = void 0;
		cleanup?.();
	};
	return {
		get responseId() {
			return responseId;
		},
		get pending() {
			return pending.length > 0;
		},
		get acceptedInput() {
			return [...accepted.values()].flat();
		},
		seal,
		close(error) {
			seal();
			for (const submission of pending.splice(0)) submission.reject(error);
		},
		handle(event) {
			if (!isRecord(event)) return false;
			if (event.type === "response.created" && !responseId && !sealed) {
				const response = isRecord(event.response) ? event.response : void 0;
				if (typeof response?.id !== "string" || !response.id.trim()) throw new Error("Responses steering requires a response identity");
				const activeResponseId = response.id;
				responseId = activeResponseId;
				const cleanup = params.onActiveResponse({
					needsContinuation: params.needsContinuation,
					steer(messages) {
						if (sealed || messages.length === 0) return Promise.resolve(false);
						params.assertActive();
						const converted = params.toInput(messages);
						const submit = (input) => {
							if (sealed || input.length === 0) return Promise.resolve(false);
							params.assertActive();
							return new Promise((resolve, reject) => {
								pending.push({
									input,
									resolve,
									reject
								});
								params.send({
									type: "response.steer",
									previous_response_id: activeResponseId,
									input
								});
							});
						};
						return Array.isArray(converted) ? submit(converted) : converted.then(submit);
					}
				});
				if (sealed) cleanup?.();
				else unsubscribe = cleanup;
				return false;
			}
			if (event.type !== "response.steer.accepted" && event.type !== "response.steer.failed" && event.type !== "response.steer.pending") return false;
			const steer = isRecord(event.steer) ? event.steer : void 0;
			if (!responseId || steer?.previous_response_id !== responseId) throw new Error("Responses steering acknowledgement has an unexpected identity");
			if (event.type === "response.steer.failed" && steer.id === void 0) {
				const index = pending.findIndex((submission) => stableStringify(submission.input) === stableStringify(steer.input));
				const submission = pending[index];
				if (!submission) throw new Error("Responses steering acknowledgement has no pending submission");
				pending.splice(index, 1);
				submission.resolve(false);
				return true;
			}
			if (typeof steer.id !== "string" || !steer.id.trim()) throw new Error("Responses steering acknowledgement has an unexpected identity");
			if (event.type === "response.steer.pending") {
				if (!accepted.has(steer.id)) throw new Error("Responses steering pending event has no accepted submission");
				return true;
			}
			if (event.type === "response.steer.failed" && accepted.has(steer.id)) throw new Error("OpenAI could not apply accepted steering; the queued message remains in the conversation");
			if (acknowledged.has(steer.id)) throw new Error("Responses steering acknowledgement was already applied");
			const submission = pending.shift();
			if (!submission) throw new Error("Responses steering acknowledgement has no pending submission");
			acknowledged.add(steer.id);
			if (event.type === "response.steer.accepted") {
				accepted.set(steer.id, submission.input);
				submission.resolve(true);
			} else submission.resolve(false);
			return true;
		}
	};
}
/** Accepted steering is prepended by the server, so never repeat it in response.create. */
function omitAcceptedSteering(input, accepted) {
	const remaining = [...input];
	for (const message of accepted) {
		const index = remaining.findIndex((item) => stableStringify(item) === stableStringify(message));
		if (index < 0) throw new Error("Responses steering continuation no longer contains the accepted user input");
		remaining.splice(index, 1);
	}
	return remaining;
}
//#endregion
//#region packages/ai/src/transports/openai-responses-websocket.ts
const SESSION_WEBSOCKET_CACHE_TTL_MS = 3e5;
const SESSION_WEBSOCKET_MAX_AGE_MS = 33e5;
const WEBSOCKET_OPEN_STATE = 1;
const websocketSessionCache = /* @__PURE__ */ new Map();
const degradedWebSocketConnections = /* @__PURE__ */ new Map();
function isOfficialOpenAIResponsesBaseUrl(baseUrl) {
	if (!baseUrl) return false;
	try {
		const url = new URL(baseUrl);
		return url.origin === "https://api.openai.com" && url.username === "" && url.password === "" && url.search === "" && url.hash === "" && url.pathname.replace(/\/+$/, "") === "/v1";
	} catch {
		return false;
	}
}
function supportsNativeOpenAIResponsesEndpoint(params) {
	return params.provider.trim().toLowerCase() === "openai" && params.api === "openai-responses" && isOfficialOpenAIResponsesBaseUrl(params.baseUrl);
}
function closeWebSocketSilently(socket, reason = "done") {
	try {
		socket.close({
			code: 1e3,
			reason
		});
	} catch {}
}
function invalidateOwnedWebSocketSession(cacheKey, entry, reason = "done") {
	if (entry.idleTimer) {
		clearTimeout(entry.idleTimer);
		entry.idleTimer = void 0;
	}
	closeWebSocketSilently(entry.socket, reason);
	entry.steeringContinuation?.steering.close(/* @__PURE__ */ new Error("Responses steering connection closed"));
	entry.steeringContinuation?.iterator.return?.().catch(() => void 0);
	entry.steeringContinuation = void 0;
	if (websocketSessionCache.get(cacheKey) === entry) websocketSessionCache.delete(cacheKey);
}
function scheduleSessionWebSocketExpiry(cacheKey, entry) {
	if (entry.idleTimer) clearTimeout(entry.idleTimer);
	entry.idleTimer = setTimeout(() => {
		if (entry.busy) return;
		invalidateOwnedWebSocketSession(cacheKey, entry, "idle_timeout");
	}, SESSION_WEBSOCKET_CACHE_TTL_MS);
	entry.idleTimer.unref?.();
}
function prepareWebSocketConnection(client, headers) {
	if (!isOfficialOpenAIResponsesBaseUrl(client.baseURL)) throw new Error("OpenAI Responses WebSocket requires the official API endpoint");
	if (typeof client.apiKey !== "string" || client.apiKey.length === 0) throw new Error("OpenAI Responses WebSocket requires an API key");
	const resolvedApiKey = getAiTransportHost().resolveSecretSentinel(client.apiKey);
	const resolvedHeaders = { ...resolveAiTransportHeaderSentinels(headers) };
	for (const key of Object.keys(resolvedHeaders)) {
		const normalizedKey = key.toLowerCase();
		if (normalizedKey === "authorization" || normalizedKey === "traceparent") delete resolvedHeaders[key];
	}
	if (!resolvedApiKey) throw new Error("OpenAI Responses WebSocket requires a resolved API key");
	return {
		client: client.withOptions({ apiKey: resolvedApiKey }),
		headers: resolvedHeaders,
		identity: sha256Hex(JSON.stringify([
			resolvedApiKey,
			client.baseURL,
			Object.entries(resolvedHeaders).toSorted(([a], [b]) => a.localeCompare(b))
		]))
	};
}
function createWebSocket(connection, onError) {
	const socket = new ResponsesWS(connection.client, {
		headers: connection.headers,
		maxQueueSize: 1
	});
	socket.on("error", () => onError(socket));
	return socket;
}
function createTransientWebSocketLease(connection) {
	const socket = createWebSocket(connection, (failedSocket) => closeWebSocketSilently(failedSocket, "transport_error"));
	return {
		socket,
		iterator: socket.stream(),
		reusedConnection: false,
		release: () => closeWebSocketSilently(socket)
	};
}
function createCachedWebSocketLease(cacheKey, entry, reusedConnection) {
	entry.busy = true;
	const steeringContinuation = entry.steeringContinuation;
	entry.steeringContinuation = void 0;
	return {
		socket: entry.socket,
		iterator: steeringContinuation?.iterator ?? entry.socket.stream(),
		entry,
		reusedConnection,
		steeringContinuation,
		release: ({ keep } = {}) => {
			if (!keep || entry.socket.socket.readyState !== WEBSOCKET_OPEN_STATE) {
				invalidateOwnedWebSocketSession(cacheKey, entry);
				return;
			}
			entry.busy = false;
			scheduleSessionWebSocketExpiry(cacheKey, entry);
		}
	};
}
function acquireWebSocket(params, connection) {
	if (!(params.mode !== "websocket" && Boolean(params.sessionId)) || !params.sessionId) return createTransientWebSocketLease(connection);
	const cacheKey = `${params.sessionId}\0${connection.identity}`;
	const cached = websocketSessionCache.get(cacheKey);
	if (cached) {
		if (cached.idleTimer) {
			clearTimeout(cached.idleTimer);
			cached.idleTimer = void 0;
		}
		if (cached.busy) return createTransientWebSocketLease(connection);
		const expired = Date.now() - cached.createdAt >= SESSION_WEBSOCKET_MAX_AGE_MS;
		if (!expired && cached.socket.socket.readyState === WEBSOCKET_OPEN_STATE) return createCachedWebSocketLease(cacheKey, cached, true);
		invalidateOwnedWebSocketSession(cacheKey, cached, expired ? "connection_age_limit" : "done");
	}
	const entry = {
		socket: createWebSocket(connection, (failedSocket) => {
			const failedEntry = websocketSessionCache.get(cacheKey);
			if (failedEntry?.socket === failedSocket) invalidateOwnedWebSocketSession(cacheKey, failedEntry, "transport_error");
			else closeWebSocketSilently(failedSocket, "transport_error");
		}),
		sessionId: params.sessionId,
		busy: true,
		createdAt: Date.now()
	};
	websocketSessionCache.set(cacheKey, entry);
	return createCachedWebSocketLease(cacheKey, entry, false);
}
function sanitizeWebSocketRequest(request) {
	const { stream: _stream, background: _background, ...websocketRequest } = request;
	return websocketRequest;
}
async function nextWebSocketMessage(iterator, signal) {
	if (!signal) return iterator.next();
	if (signal.aborted) throw transportAbortError(signal);
	let onAbort;
	try {
		return await Promise.race([iterator.next(), new Promise((_resolve, reject) => {
			onAbort = () => reject(transportAbortError(signal));
			signal.addEventListener("abort", onAbort, { once: true });
		})]);
	} finally {
		if (onAbort) signal.removeEventListener("abort", onAbort);
	}
}
function readServerEvent(message) {
	if (message.type === "message") return message.message;
	if (message.type === "error") throw parseOpenAIResponsesWebSocketServerError(message.error) ?? new Error("OpenAI Responses WebSocket transport failed", { cause: message.error });
	if (message.type === "close") throw new Error(`OpenAI Responses WebSocket closed before completion (code ${message.code})`);
}
function createOpenAIResponsesWebSocketStream(params) {
	const connection = prepareWebSocketConnection(params.client, params.headers);
	let fullRequest = sanitizeWebSocketRequest(params.request);
	const requestModel = typeof fullRequest.model === "string" ? fullRequest.model : "";
	const degradationKey = `${params.sessionId ?? ""}\0${connection.identity}\0${requestModel}`;
	const degraded = degradedWebSocketConnections.get(degradationKey);
	if (degraded && degraded.retryAt > Date.now()) throw new OpenAIResponsesWebSocketPreDispatchError(/* @__PURE__ */ new Error("OpenAI Responses WebSocket is cooling down after a transport failure"));
	degradedWebSocketConnections.delete(degradationKey);
	const markDegraded = () => {
		const cooldownMs = params.degradeCooldownMs;
		if (cooldownMs === void 0 || !Number.isFinite(cooldownMs) || cooldownMs <= 0) return;
		degradedWebSocketConnections.set(degradationKey, {
			sessionId: params.sessionId,
			retryAt: Date.now() + cooldownMs
		});
	};
	let lease;
	try {
		lease = acquireWebSocket(params, connection);
	} catch (error) {
		markDegraded();
		throw new OpenAIResponsesWebSocketPreDispatchError(error);
	}
	let prepared;
	const resumedSteering = lease.steeringContinuation;
	const steeringMode = resumedSteering ? resumedSteering.requiresInput ? "required-input" : "automatic" : void 0;
	try {
		const continuation = lease.entry?.continuation;
		if (continuation && lease.entry) {
			lease.entry.continuation = void 0;
			prepared = resolveResponsesContinuationRequest(continuation, fullRequest, steeringMode);
		} else {
			fullRequest = params.restoreRequest?.(fullRequest) ?? fullRequest;
			prepared = {
				request: fullRequest,
				continuationStatus: lease.entry ? "no_previous_response" : "socket_not_cached"
			};
		}
	} catch (error) {
		lease.iterator.return?.().catch(() => void 0);
		lease.release({ keep: false });
		throw error;
	}
	let streamStarted = false;
	let terminalResponse;
	let terminalReceived = false;
	let released = false;
	let retainIterator = false;
	let deferredInput = false;
	let inputReplay;
	if (resumedSteering) try {
		if (prepared.continuationStatus !== "continued" || !prepared.request.previous_response_id) throw new Error("Responses steering continuation changed its request or history");
		const input = omitAcceptedSteering(prepared.request.input ?? [], resumedSteering.acceptedInput);
		if (!resumedSteering.requiresInput && (stableStringify(fullRequest.instructions) !== stableStringify(resumedSteering.instructions) || stableStringify(fullRequest.tools) !== stableStringify(resumedSteering.tools))) throw new Error("Responses automatic steering continuation cannot change instructions or tools");
		const baseline = prepared.fullRequest ?? fullRequest;
		const priorLength = (baseline.input?.length ?? 0) - (prepared.request.input?.length ?? 0);
		const fingerprints = input.map(responsesInputFingerprint);
		if (fingerprints.length > 0) inputReplay = {
			afterResponseId: prepared.request.previous_response_id,
			before: resumedSteering.requiresInput ? fingerprints : [],
			after: resumedSteering.requiresInput ? [] : fingerprints
		};
		const delivered = resumedSteering.requiresInput ? input : [];
		prepared.fullRequest = {
			...baseline,
			input: [
				...(baseline.input ?? []).slice(0, priorLength),
				...resumedSteering.acceptedInput,
				...delivered
			]
		};
		prepared.request = {
			...prepared.request,
			input: delivered
		};
		deferredInput = !resumedSteering.requiresInput && input.length > 0;
	} catch (error) {
		lease.iterator.return?.().catch(() => void 0);
		lease.release({ keep: false });
		throw new OpenAIResponsesWebSocketPostDispatchError(error);
	}
	const steering = lease.entry && params.onActiveResponse && params.steeringInput ? createResponsesSteering({
		onActiveResponse: params.onActiveResponse,
		toInput: params.steeringInput,
		send: (event) => lease.socket.sendRaw(JSON.stringify(event)),
		needsContinuation: () => deferredInput,
		assertActive: () => {
			if (released || terminalReceived || params.signal?.aborted) throw new Error("Responses steering is no longer active");
		}
	}) : void 0;
	const finish = ({ keep = true } = {}) => {
		if (released) return;
		released = true;
		if (keep && lease.entry && terminalResponse) lease.entry.continuation = {
			lastRequest: prepared.fullRequest ?? fullRequest,
			lastResponseId: terminalResponse.id,
			lastResponseItems: terminalResponse.output
		};
		lease.release({ keep });
	};
	return {
		stream: { async *[Symbol.asyncIterator]() {
			if (streamStarted) throw new Error("OpenAI Responses WebSocket stream can only be consumed once");
			streamStarted = true;
			const iterator = lease.iterator;
			let requestDispatched = false;
			try {
				if (params.signal?.aborted) throw transportAbortError(params.signal);
				if (resumedSteering) {
					requestDispatched = true;
					if (resumedSteering.requiresInput) lease.socket.send({
						...prepared.request,
						type: "response.create"
					});
				}
				for (;;) {
					const buffered = resumedSteering?.buffered.shift();
					const next = buffered ? {
						value: buffered,
						done: false
					} : await nextWebSocketMessage(iterator, params.signal);
					if (next.done) throw new Error("OpenAI Responses WebSocket closed before a terminal response event");
					if (next.value.type === "open") {
						if (!requestDispatched) {
							requestDispatched = true;
							lease.socket.send({
								...prepared.request,
								type: "response.create"
							});
						}
						continue;
					}
					const event = readServerEvent(next.value);
					if (!event) continue;
					if (isRecord(event) && typeof event.type === "string" && event.type.startsWith("response.steer.")) {
						if ((isRecord(event.steer) && event.steer.previous_response_id === steering?.responseId ? steering : resumedSteering?.steering ?? steering)?.handle(event)) continue;
					}
					steering?.handle(event);
					if (event.type === "response.completed") terminalResponse = event.response;
					terminalReceived = event.type === "response.completed" || event.type === "response.incomplete" || event.type === "response.failed";
					if (terminalReceived) {
						steering?.seal();
						if (event.type === "response.failed") steering?.close(/* @__PURE__ */ new Error("Responses failed before steering could be applied"));
						const continuationBuffer = [];
						for (;;) {
							if (!steering?.pending) break;
							const acknowledgement = await nextWebSocketMessage(iterator, params.signal);
							if (acknowledgement.done) throw new Error("Responses closed before acknowledging steering");
							const acknowledgedEvent = readServerEvent(acknowledgement.value);
							if (!steering.handle(acknowledgedEvent)) continuationBuffer.push(acknowledgement.value);
						}
						const acceptedInput = steering?.acceptedInput ?? [];
						const isSteered = event.type === "response.incomplete" && isRecord(event.response.incomplete_details) && event.response.incomplete_details.reason === "steered";
						if (lease.entry && steering && acceptedInput.length > 0 && (event.type === "response.completed" || isSteered)) {
							if (event.type === "response.incomplete") terminalResponse = event.response;
							lease.entry.steeringContinuation = {
								iterator,
								buffered: continuationBuffer,
								acceptedInput,
								requiresInput: (terminalResponse?.output ?? []).some((item) => (item.type === "function_call" || item.type === "custom_tool_call") && !(isRecord(item) && item.async === true) || item.type === "mcp_approval_request"),
								steering,
								instructions: fullRequest.instructions,
								tools: fullRequest.tools
							};
							retainIterator = true;
							if (isSteered) {
								yield {
									...event,
									type: "response.completed",
									response: {
										...event.response,
										status: "completed",
										incomplete_details: null
									}
								};
								return;
							}
						}
					}
					yield event;
					if (terminalReceived) {
						degradedWebSocketConnections.delete(degradationKey);
						return;
					}
				}
			} catch (error) {
				const steeringDispatched = Boolean(steering?.pending || steering?.acceptedInput.length || resumedSteering);
				steering?.close(error instanceof Error ? error : /* @__PURE__ */ new Error("Responses steering failed"));
				if (lease.entry) lease.entry.continuation = void 0;
				const safeRetry = error instanceof OpenAIResponsesWebSocketSafeRetryError && !steeringDispatched;
				if (!params.callerSignal?.aborted && !safeRetry) markDegraded();
				if (!requestDispatched && !params.signal?.aborted) throw new OpenAIResponsesWebSocketPreDispatchError(error);
				if (!requestDispatched || params.callerSignal?.aborted || safeRetry) throw error;
				throw new OpenAIResponsesWebSocketPostDispatchError(error);
			} finally {
				steering?.seal();
				if (!retainIterator) {
					steering?.close(/* @__PURE__ */ new Error("Responses stream ended before steering was confirmed"));
					await iterator.return?.().catch(() => void 0);
				}
				if (!terminalReceived) finish({ keep: false });
			}
		} },
		request: prepared.request,
		fullRequest: prepared.fullRequest ?? fullRequest,
		reusedConnection: lease.reusedConnection,
		continuationStatus: prepared.continuationStatus,
		inputReplay,
		finish
	};
}
function closeOpenAIResponsesWebSocketSessions(sessionId) {
	for (const [cacheKey, entry] of websocketSessionCache) {
		if (sessionId && entry.sessionId !== sessionId) continue;
		invalidateOwnedWebSocketSession(cacheKey, entry, "session_cleanup");
	}
	for (const [key, entry] of degradedWebSocketConnections) if (!sessionId || entry.sessionId === sessionId) degradedWebSocketConnections.delete(key);
}
registerSessionResourceCleanup(closeOpenAIResponsesWebSocketSessions);
//#endregion
//#region packages/ai/src/transports/openai-responses-compact-client.ts
async function postOpenAIResponsesCompaction(params) {
	const compactInput = typeof params.request.instructions === "string" && params.request.instructions.length > 0 ? [buildOpenAIResponsesCompactSystemMessage(params.model, params.request.instructions), ...params.request.input ?? []] : params.request.input;
	const response = await params.client.post("/responses/compact", {
		...buildOpenAISdkRequestOptions(params.model, params.options?.signal, { timeoutMs: params.options?.timeoutMs }),
		body: {
			model: params.request.model,
			input: compactInput
		}
	});
	const output = isRecord(response) && Array.isArray(response.output) ? response.output : [];
	const item = output.at(-1);
	const retainedItems = output.slice(0, -1);
	const retainedUserMessageCount = retainedItems.filter((candidate) => isRecord(candidate) && candidate.type === "message" && candidate.role === "user" && Array.isArray(candidate.content)).length;
	const inputUserMessageCount = Array.isArray(params.request.input) ? params.request.input.filter((candidate) => isRecord(candidate) && candidate.type === "message" && candidate.role === "user").length : 0;
	const retainedMessagePrefixSupported = supportsNativeOpenAIResponsesEndpoint(params.model);
	const usage = isRecord(response) && isRecord(response.usage) ? response.usage : void 0;
	if (!isRecord(response) || response.object !== "response.compaction" || !isOpenAIResponsesCompactionOutput(output, params.model) || retainedItems.length > 0 && (!retainedMessagePrefixSupported || retainedUserMessageCount !== inputUserMessageCount) || !isRecord(item) || item.type !== "compaction" || typeof item.encrypted_content !== "string" || item.encrypted_content.length === 0 || !usage || typeof usage.input_tokens !== "number" || typeof usage.output_tokens !== "number") throw new Error("Responses compact endpoint did not return one trailing compaction item");
	return {
		output,
		item,
		historyMode: retainedUserMessageCount > 0 ? "retained-users" : "compacted-prefix",
		usage,
		model: params.model,
		replayMetadata: buildOpenAIResponsesReasoningReplayMetadata(params.model, {
			authProfileId: params.options?.authProfileId,
			sessionId: params.options?.sessionId
		})
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-compact-request.ts
const COMPACT_REQUEST = Symbol("openaiResponsesCompactRequest");
function claimResponsesCompactRequest(options) {
	const controller = options ? Reflect.get(options, COMPACT_REQUEST) : void 0;
	if (controller?.claimed === false) {
		controller.claimed = true;
		return controller;
	}
}
/** Run a compact-endpoint request through the session's prepared stream stack. */
async function requestPreparedOpenAIResponsesCompaction(streamFn, model, context, options) {
	const preparedOptions = { ...options };
	let resolveResult;
	let rejectResult;
	const result = new Promise((resolve, reject) => {
		resolveResult = resolve;
		rejectResult = reject;
	});
	const controller = {
		claimed: false,
		resolve: resolveResult,
		reject: rejectResult
	};
	Reflect.set(preparedOptions, COMPACT_REQUEST, controller);
	const stream = await Promise.resolve(streamFn(model, context, preparedOptions));
	if (!controller.claimed) throw new Error("Prepared stream did not reach an OpenAI Responses transport");
	try {
		return await result;
	} finally {
		await stream.result().catch(() => void 0);
	}
}
//#endregion
//#region packages/ai/src/transports/openai-responses-reasoning-state.ts
function inputReplay(message) {
	const value = "openclawResponsesInputReplay" in message ? message.openclawResponsesInputReplay : void 0;
	return isRecord(value) ? value : void 0;
}
/** Save only admitted settings and hashes, never another copy of the conversation. */
function recordResponsesReasoningState(message, model, identity, request, output) {
	if (!supportsResponsesReasoningUpdate(request) || !isRecord(request.reasoning) || !request.input || request.previous_response_id || message.providerReplay || output.some((item) => isRecord(item) && item.type === "compaction")) return;
	const reasoning = {
		...buildProviderReplayContext(model, identity),
		effort: request.reasoning.effort,
		controls: request.input.flatMap((item, index) => isConfigurationUpdate(item) ? [{
			index,
			item
		}] : []),
		inputLength: request.input.length,
		outputLength: output.length,
		prefixHash: responsesContinuationPrefixFingerprint(request.input, output),
		requestHash: responsesContinuationRequestFingerprint(request)
	};
	Object.assign(message, { openclawResponsesInputReplay: {
		...inputReplay(message),
		reasoning
	} });
}
/** A cold transport can replay controls, but cannot resurrect a server response handle. */
function restoreResponsesReasoningState(context, model, identity, request) {
	const latest = context.messages.findLast((message) => message.role === "assistant");
	const state = latest ? inputReplay(latest)?.reasoning : void 0;
	if (!isRecord(state)) return request;
	const { effort, inputLength, outputLength, controls, prefixHash, requestHash } = state;
	if (!isOpenAIResponsesReplayContext(state) || !providerReplayContextMatches(state, buildProviderReplayContext(model, identity)) || latest?.providerReplay || !supportsResponsesReasoningUpdate(request) || !isRecord(request.reasoning) || !request.input || request.previous_response_id || request.input.some(isConfigurationUpdate) || typeof effort !== "string" || typeof inputLength !== "number" || !Number.isSafeInteger(inputLength) || inputLength < 0 || typeof outputLength !== "number" || !Number.isSafeInteger(outputLength) || outputLength < 0 || !Array.isArray(controls) || controls.length > inputLength || inputLength + outputLength > request.input.length + controls.length) return request;
	const previousInput = request.input.slice(0, inputLength - controls.length);
	let lastIndex = -1;
	for (const control of controls) {
		if (!isRecord(control) || typeof control.index !== "number" || !Number.isSafeInteger(control.index) || control.index <= lastIndex || control.index > previousInput.length || !isConfigurationUpdate(control.item)) return request;
		previousInput.splice(control.index, 0, control.item);
		lastIndex = control.index;
	}
	const previous = {
		...request,
		reasoning: {
			...request.reasoning,
			effort
		},
		input: previousInput
	};
	if (responsesContinuationRequestFingerprint(previous) !== requestHash) return request;
	const prepared = replayResponsesReasoningUpdates(previous, request, outputLength);
	if (responsesContinuationPrefixFingerprint((prepared.input ?? []).slice(0, inputLength + outputLength)) !== prefixHash) return request;
	return prepared;
}
//#endregion
//#region packages/ai/src/transports/openai-responses-request-fetch.ts
function withDefaultResponsesStreamEncoding(fetch) {
	return (input, init) => {
		const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : void 0));
		if (headers.has("accept-encoding")) return fetch(input, init);
		headers.set("accept-encoding", "identity");
		return fetch(input, {
			...init,
			headers
		});
	};
}
/** Preserve the existing fetch policy while binding explicit continuation dispatch to its signal. */
function createResponsesRequestFetch(model, options) {
	const lifecycle = options.lifecycle;
	if (lifecycle && options.compact) throw new Error("Provider review continuation cannot replace its reviewed input with compaction");
	let fetchOverride = options.compact ? createBoundedOpenAIResponsesCompactionFetch(buildGuardedModelFetch(model)) : options.stream ? withDefaultResponsesStreamEncoding(buildGuardedModelFetch(model)) : void 0;
	if (lifecycle) {
		const dispatchFetch = fetchOverride ?? buildGuardedModelFetch(model);
		fetchOverride = async (input, init) => {
			const signal = init?.signal ?? (input instanceof Request ? input.signal : void 0);
			await lifecycle.beforeDispatch(signal ?? void 0);
			signal?.throwIfAborted();
			lifecycle.assertCurrent();
			return dispatchFetch(input, init);
		};
	}
	return fetchOverride;
}
//#endregion
//#region packages/ai/src/transports/openai-responses-client.ts
function resolveNativeOpenAIResponsesWebSocketMode(model, transport) {
	if (transport !== "websocket" && transport !== "websocket-cached" && transport !== "auto") return;
	if (getAiTransportHost().requiresManagedTransport(model)) return;
	return supportsNativeOpenAIResponsesEndpoint({
		provider: model.provider,
		api: model.api,
		baseUrl: model.baseUrl
	}) ? transport : void 0;
}
function combineWebSocketTimeoutSignal(signal, model, timeoutMs) {
	const resolvedTimeoutMs = timeoutMs !== void 0 && Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : getAiTransportHost().resolveModelRequestTimeoutMs(model);
	if (resolvedTimeoutMs === void 0 || !Number.isFinite(resolvedTimeoutMs)) return signal;
	return AbortSignal.any([signal, AbortSignal.timeout(Math.max(1, resolvedTimeoutMs))]);
}
function createOpenAIResponsesClient(model, apiKey, defaultHeaders, fetchOverride) {
	return new OpenAI({
		apiKey,
		baseURL: resolveOpenAIClientBaseUrl(model),
		dangerouslyAllowBrowser: true,
		defaultHeaders,
		fetch: fetchOverride ?? buildGuardedModelFetch(model),
		...buildOpenAISdkClientOptions(model)
	});
}
function createResponsesTransportExecutor(config) {
	return (model, context, options) => {
		const responsesOptions = options;
		const compactRequest = claimResponsesCompactRequest(responsesOptions);
		const { eventStream, stream } = createWritableTransportEventStream();
		(async () => {
			const output = createOpenAIResponsesAssistantOutput(model, config.outputApi);
			let firstEventAbort;
			let continuationClaim;
			const requestLifecycle = responsesRequestLifecycle.get(options);
			try {
				const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
				const websocketMode = resolveNativeOpenAIResponsesWebSocketMode(model, responsesOptions?.transport);
				const turnState = resolveProviderTransportTurnState(model, {
					sessionId: options?.sessionId,
					turnId: randomUUID(),
					attempt: 1,
					transport: websocketMode ? "websocket" : "stream"
				});
				const websocketSessionPolicy = websocketMode ? turnState?.websocket : void 0;
				const httpTurnHeaders = filterProviderTurnHeadersForExplicitOpencodeSession(model, options, turnState?.headers);
				const websocketTurnHeaders = filterProviderTurnHeadersForExplicitOpencodeSession(model, options, websocketSessionPolicy?.headers);
				const websocketHeaders = websocketMode ? buildOpenAIClientHeaders(model, context, options?.headers, websocketTurnHeaders, options?.sessionId, options?.cacheRetention) : void 0;
				const httpHeaders = buildOpenAIClientHeaders(model, context, options?.headers, httpTurnHeaders, options?.sessionId, options?.cacheRetention);
				const fetchOverride = createResponsesRequestFetch(model, {
					compact: Boolean(compactRequest),
					stream: config.streamRequest,
					lifecycle: requestLifecycle
				});
				const client = config.createClient(model, apiKey, httpHeaders, fetchOverride);
				const nativeAstra = model.id === "gpt-6-astra" && supportsNativeOpenAIResponsesEndpoint(model);
				const asyncToolExecutionEligible = nativeAstra && options?.asyncToolExecution === true && !responsesOptions?.openclawCodeModeToolSurface;
				const prepareRequest = async (request) => {
					let params = request;
					const nextParams = await options?.onPayload?.(params, model);
					if (nextParams !== void 0) params = nextParams;
					if (!isOpenAICodexResponsesModel(model)) params = mergeTransportMetadata(params, turnState?.metadata);
					params = sanitizeOpenAICodexResponsesParams(model, params);
					params = sanitizeResponsesImagePayload(params);
					if (options?.openclawCodeModeToolSurface === true) {
						const visibleToolNames = resolveCodeModeResponsesVisibleToolNames(context);
						const allowedHostedToolTypes = responsesOptions?.openclawCodeModeAllowedHostedToolTypes;
						enforceCodeModeResponsesToolSurface(params, visibleToolNames, allowedHostedToolTypes, codeModeToolSurfaceObserver.get(options));
						assertCodeModeResponsesToolSurface(params, visibleToolNames, allowedHostedToolTypes);
					}
					if (asyncToolExecutionEligible && params.model === "gpt-6-astra" && params.multi_agent?.enabled !== true && params.tools) params.tools = params.tools.map((tool) => tool.type === "function" ? {
						...tool,
						async: true
					} : tool);
					return params;
				};
				const buildRequest = (replayMode, requestContext = context) => prepareRequest(config.buildRequest(model, requestContext, responsesOptions, turnState?.metadata, replayMode));
				let params = await buildRequest("checkpoint");
				const asyncTools = asyncToolExecutionEligible && params.model === "gpt-6-astra" && params.multi_agent?.enabled !== true;
				if (compactRequest) {
					const compacted = await postOpenAIResponsesCompaction({
						client,
						model,
						request: params,
						options: responsesOptions
					});
					output.usage.input = compacted.usage.input_tokens;
					output.usage.output = compacted.usage.output_tokens;
					output.usage.totalTokens = compacted.usage.input_tokens + compacted.usage.output_tokens;
					compactRequest.resolve(compacted);
					finalizeTransportStream({
						stream,
						output,
						signal: options?.signal
					});
					return;
				}
				const sessionId = options?.sessionId;
				if (config.httpContinuation && !websocketMode && !getAiTransportHost().requiresManagedTransport(model) && (supportsNativeOpenAIResponsesEndpoint({
					provider: model.provider,
					api: model.api,
					baseUrl: model.baseUrl
				}) || resolveOpenAIResponsesPayloadPolicy(model).explicitContinuationOptIn) && sessionId && (params.store === true || supportsResponsesReasoningUpdate(params)) && !params.previous_response_id) {
					continuationClaim = claimOpenAIResponsesHttpContinuation({
						sessionId,
						apiKey,
						baseUrl: model.baseUrl,
						headers: httpHeaders,
						request: params,
						restoreRequest: () => restoreResponsesReasoningState(context, model, responsesOptions, params)
					});
					if (continuationClaim) params = continuationClaim.fullRequest;
				}
				const observePrompt = createResponsesPromptEgressObserver(responsesOptions, context.systemPrompt);
				const requestStartedAt = Date.now();
				let started = false;
				const startStream = () => {
					if (!started) {
						started = true;
						stream.push({
							type: "start",
							partial: output
						});
					}
				};
				const firstEvent = createFirstStreamEventAbortController(options?.signal);
				firstEventAbort = firstEvent;
				const requestOptions = buildOpenAISdkRequestOptions(model, firstEvent.signal, {
					stream: config.streamRequest,
					timeoutMs: options?.timeoutMs
				});
				const websocketSignal = combineWebSocketTimeoutSignal(firstEvent.signal, model, requestOptions?.timeout);
				emitModelTransportDebug(log, `[responses] start provider=${model.provider} api=${model.api} model=${model.id} requestIdHash=${redactIdentifier(options?.requestId, { len: 64 })} baseUrl=${formatModelTransportDebugBaseUrl(model.baseUrl)} timeoutMs=${safeDebugValue(requestOptions?.timeout)} apiKey=${apiKey ? "present" : "missing"} ${summarizeResponsesPayload(params)}`);
				const responseModelTracker = createResponseModelTracker(isOpenAICodexResponsesModel(model));
				let continuationBaseline;
				let contextUsageEligible = true;
				const createSseStream = async (initialRequest = continuationClaim?.request ?? params, initialAttemptKind = "initial", initialRejectedCompaction) => {
					const { stream: responseStream } = await createResponsesStreamWithEncryptedContentRetry({
						client,
						request: initialRequest,
						requestOptions,
						model,
						observePrompt,
						initialAttemptKind,
						initialRejectedCompaction,
						buildFullHistoryRequest: () => buildRequest("full-history"),
						onCompactionRejected: (checkpoint) => suppressOpenAIResponsesCompaction(output, model, responsesOptions, checkpoint),
						canRetryStream: () => output.content.length === 0,
						wrapStream: ({ stream: rawResponseStream, response, attempt }) => {
							contextUsageEligible &&= attempt.kind === "initial";
							continuationBaseline = attempt.request.previous_response_id ? params : attempt.request;
							const trackedResponseStream = responseModelTracker.track(response, rawResponseStream);
							return withProviderResponseHook({
								stream: observeResponsesStream(trackedResponseStream, model, requestStartedAt),
								signal: firstEvent.signal,
								abort: firstEvent.abort,
								hook: createOpenAIProviderAcceptanceHook(options, response, model),
								onReady: () => {
									emitModelTransportDebug(log, `[responses] headers provider=${model.provider} api=${model.api} model=${model.id} transport=sse elapsedMs=${Date.now() - requestStartedAt}`);
									startStream();
								}
							});
						}
					});
					return responseStream;
				};
				let responseStream;
				let websocketBaseline;
				let finishWebSocket;
				let transport = "sse";
				const logWebSocketFallback = (reason) => emitModelTransportDebug(log, `[responses] websocket_fallback provider=${model.provider} api=${model.api} model=${model.id} reason=${reason}`);
				const closeWebSocketForFallback = (reason) => {
					finishWebSocket?.({ keep: false });
					finishWebSocket = void 0;
					transport = "sse";
					logWebSocketFallback(reason);
				};
				if (websocketMode) try {
					const websocket = createOpenAIResponsesWebSocketStream({
						client,
						request: params,
						restoreRequest: (request) => restoreResponsesReasoningState(context, model, responsesOptions, request),
						mode: websocketMode,
						sessionId: options?.sessionId,
						headers: websocketHeaders,
						signal: websocketSignal,
						callerSignal: options?.signal,
						degradeCooldownMs: websocketSessionPolicy?.degradeCooldownMs,
						onActiveResponse: nativeAstra && params.model === "gpt-6-astra" ? options?.onActiveResponse : void 0,
						steeringInput: (messages) => {
							contextUsageEligible = false;
							return projectResponsesSteeringInput(params, () => buildRequest("checkpoint", {
								...context,
								messages: [...context.messages, ...messages]
							}));
						}
					});
					finishWebSocket = websocket.finish;
					websocketBaseline = websocket.fullRequest;
					recordResponsesInputReplay(output, websocket.inputReplay);
					contextUsageEligible &&= websocket.inputReplay === void 0;
					observePrompt?.(websocket.request, {
						egress: "responses-websocket",
						payloadVariant: "initial"
					});
					transport = "websocket";
					emitModelTransportDebug(log, `[responses] websocket_selected provider=${model.provider} api=${model.api} model=${model.id} mode=${websocketMode} reused=${websocket.reusedConnection} continuation=${websocket.continuationStatus === "continued"} continuationStatus=${websocket.continuationStatus} sessionIdHash=${redactIdentifier(options?.sessionId)} headersHash=${redactIdentifier(JSON.stringify(Object.entries(websocketHeaders ?? {}).toSorted(([a], [b]) => a.localeCompare(b))))}`);
					const trackedWebSocketStream = responseModelTracker.track(void 0, websocket.stream);
					responseStream = { async *[Symbol.asyncIterator]() {
						let providerAccepted = false;
						try {
							for await (const event of trackedWebSocketStream) {
								if (!providerAccepted) {
									providerAccepted = true;
									await notifyProviderStreamOpened({
										options,
										cancelStream: () => websocket.finish({ keep: false })
									});
								}
								startStream();
								yield event;
							}
						} catch (error) {
							if (error instanceof OpenAIResponsesWebSocketSafeRetryError) {
								const encryptedContentRejected = isInvalidEncryptedContentError(error);
								const recovery = encryptedContentRejected ? await resolveNextResponsesEncryptedContentAttempt({
									kind: "initial",
									request: {
										...websocket.request,
										stream: true
									}
								}, error, { buildFullHistoryRequest: () => buildRequest("full-history") }) : void 0;
								if (encryptedContentRejected && !recovery) throw error;
								closeWebSocketForFallback(`safe_server_error code=${error.code} status=${safeDebugValue(error.status)} param=${safeDebugValue(error.param)}`);
								yield* await createSseStream(recovery?.request ?? await buildRequest("full-history"), recovery?.kind ?? "continuation-rejected", recovery?.rejectedCompaction);
								return;
							}
							if (websocketSignal.aborted || !(error instanceof OpenAIResponsesWebSocketPreDispatchError)) throw error;
							transport = "sse";
							logWebSocketFallback("before_first_event");
							yield* await createSseStream();
						}
					} };
				} catch (error) {
					if (error instanceof OpenAIResponsesWebSocketPostDispatchError) throw error;
					closeWebSocketForFallback("setup_failure");
					responseStream = await createSseStream();
				}
				else responseStream = await createSseStream();
				try {
					const acceptedResponseStream = withResponsesRequestAcceptance(responseStream, requestLifecycle, transport === "websocket" ? websocketSignal : firstEvent.signal);
					const terminal = await processResponsesStream(acceptedResponseStream, output, stream, model, {
						canRetryIdentityConflict: () => hasOnlyResponsesFunctionTools(transport === "websocket" ? websocketBaseline : continuationBaseline),
						...config.pricingOptions?.(responsesOptions, model),
						firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options) ?? config.firstEventTimeoutMs,
						abortFirstEventStream: firstEvent.abort,
						onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options),
						signal: options?.signal,
						reasoningReplayMetadata: buildOpenAIResponsesReasoningReplayMetadata(model, {
							authProfileId: responsesOptions?.authProfileId,
							sessionId: options?.sessionId
						}),
						asyncToolExecution: asyncTools,
						...responseModelTracker.terminalOptions
					});
					finishWebSocket?.();
					if (options?.signal?.aborted) throw transportAbortError(options.signal);
					if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error(output.errorMessage ?? "An unknown error occurred");
					const admitted = transport === "websocket" ? websocketBaseline : continuationBaseline;
					if (terminal && admitted && supportsNativeOpenAIResponsesEndpoint(model)) recordResponsesReasoningState(output, model, responsesOptions, admitted, terminal.output);
					if (continuationClaim && continuationBaseline && terminal) continuationClaim.commit(continuationBaseline, terminal);
					if (terminal && admitted && contextUsageEligible) recordResponsesContextUsage(output, model, responsesOptions, admitted, terminal.output, "transport");
				} catch (error) {
					finishWebSocket?.({ keep: false });
					throw error;
				}
				emitModelTransportDebug(log, `[responses] completed provider=${model.provider} api=${model.api} model=${model.id} transport=${transport} elapsedMs=${Date.now() - requestStartedAt}`);
				finalizeTransportStream({
					stream,
					output,
					signal: options?.signal
				});
			} catch (error) {
				if (requestLifecycle) await requestLifecycle.settle().catch(() => void 0);
				if (compactRequest) {
					compactRequest.reject(error);
					failTransportStream({
						stream,
						output,
						signal: options?.signal,
						error
					});
					return;
				}
				if (error instanceof ResponsesStreamFailure && error.observation) logResponsesFailedNoDetails(error.observation);
				log.warn(`[responses] error provider=${model.provider} api=${model.api} model=${model.id} ` + summarizeOpenAITransportError(error));
				failTransportStream({
					stream,
					output,
					signal: options?.signal,
					error
				});
			} finally {
				continuationClaim?.release();
				firstEventAbort?.dispose();
			}
		})();
		return eventStream;
	};
}
function createOpenAIResponsesTransportStreamFn() {
	return createResponsesTransportExecutor({
		streamRequest: true,
		httpContinuation: true,
		createClient: createOpenAIResponsesClient,
		buildRequest: buildOpenAIResponsesParams,
		pricingOptions: (options, model) => ({
			serviceTier: options?.serviceTier,
			applyServiceTierPricing: (usage, serviceTier) => applyResponsesServiceTierPricing(usage, serviceTier, model)
		})
	});
}
function createAzureOpenAIResponsesTransportStreamFn() {
	return createResponsesTransportExecutor({
		outputApi: "azure-openai-responses",
		firstEventTimeoutMs: AZURE_RESPONSES_FIRST_EVENT_TIMEOUT_MS,
		createClient: createAzureOpenAIClient,
		buildRequest: (model, context, options, metadata, replayMode) => {
			const deploymentName = resolveAzureDeploymentName(model);
			const params = buildOpenAIResponsesParams(model, context, options, metadata, replayMode);
			params.model = deploymentName;
			delete params.store;
			return params;
		}
	});
}
function resolveAzureDeploymentName(model) {
	return resolveAzureDeploymentNameFromMap({
		modelId: model.id,
		deploymentMap: process.env.AZURE_OPENAI_DEPLOYMENT_NAME_MAP
	});
}
function createAzureOpenAIClient(model, apiKey, defaultHeaders, fetchOverride) {
	const baseURL = model.baseUrl.replace(/\/+$/, "");
	const clientOptions = {
		apiKey,
		dangerouslyAllowBrowser: true,
		defaultHeaders,
		baseURL,
		fetch: fetchOverride ?? buildGuardedModelFetch(model),
		...buildOpenAISdkClientOptions(model)
	};
	if (isOpenAICompatibleAzureResponsesBaseUrl(baseURL)) return new OpenAI(clientOptions);
	return new AzureOpenAI({
		...clientOptions,
		apiVersion: resolveAzureOpenAIApiVersion()
	});
}
//#endregion
//#region packages/ai/src/transports/provider-compaction-replay.ts
function isAssistantReplayMessage(message) {
	return message.role === "assistant";
}
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
			return responses ? {
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
/** Carry a checkpoint immediately after reference-preserving history limiting, before repair. */
function preserveCompactionReplayWindow(source, windowed, model, identity) {
	const checkpoint = resolveCompactionSource(source, model, identity);
	if (!checkpoint || windowed.some((message) => message === checkpoint.owner)) return windowed;
	const owner = checkpoint.owner;
	const replay = checkpoint.owner.providerReplay;
	const providerReplay = replay?.type === "openai-responses-retained-compaction" ? replay : {
		...replay,
		replayIndex: 0
	};
	const suffix = new Set(source.slice(source.indexOf(owner) + 1));
	return [{
		...owner,
		content: [],
		providerReplay
	}, ...windowed.filter((message) => suffix.has(message))];
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
function estimateResponsesInput(input, estimate) {
	return input.reduce((tokens, entry) => {
		if (!isRecord(entry)) return tokens + estimate.json(entry);
		if (entry.type === "compaction" && typeof entry.encrypted_content === "string") {
			const { encrypted_content, ...metadata } = entry;
			return tokens + estimate.text(encrypted_content) + estimate.json(metadata);
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
function resolveCompactionReplayPressure(messages, model, identity, estimate, systemPrompt) {
	const checkpoint = resolveCompactionSource(messages, model, identity);
	if (!checkpoint) return;
	if (checkpoint.family === "responses" && checkpoint.mode === "refresh-required") throw new CompactionReplayRefreshRequiredError();
	const ownerIndex = messages.findIndex((message) => message === checkpoint.owner);
	const owner = messages[ownerIndex];
	if (!owner) return;
	const prefixTokens = checkpoint.family === "anthropic" ? estimate.text(checkpoint.summary) : checkpoint.mode === "complete-window" ? estimateResponsesInput(checkpoint.output, estimate) : estimate.text(checkpoint.item.encrypted_content);
	const measuredBoundary = checkpoint.family === "responses" ? resolveResponsesContextUsageBoundary(messages, model, identity, systemPrompt) : void 0;
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
/** Whether provider replay state is a prefix-bound server compaction checkpoint. */
function isCompactionReplayCheckpoint(replay) {
	const type = replay && typeof replay === "object" ? replay.type : void 0;
	return type === "anthropic-compaction" || type === "openai-responses-compaction" || type === "openai-responses-retained-compaction";
}
/** Strip prefix-bound checkpoints after local history rewrites. */
function stripCompactionReplayCheckpoint(message) {
	if (!isCompactionReplayCheckpoint(message.providerReplay)) return message;
	const replaySafeMessage = { ...message };
	delete replaySafeMessage.providerReplay;
	return replaySafeMessage;
}
/** Strip prefix-bound checkpoint state from an in-place message rewrite. */
function stripCompactionReplayCheckpointInPlace(message) {
	if (isCompactionReplayCheckpoint(message.providerReplay)) delete message.providerReplay;
}
/** Reindex a prefix-bound checkpoint after known content removals. */
function replaceCompactionReplayOwnerContent(message, content) {
	const next = {
		...message,
		content
	};
	const replay = message.providerReplay;
	if (!isCompactionReplayCheckpoint(replay)) return next;
	if (replay.type === "openai-responses-retained-compaction") return next;
	const replayIndex = replay.replayIndex ?? 0;
	if (content.length === 0 && message.content.length > 0 || replayIndex > message.content.length) return stripCompactionReplayCheckpoint(next);
	let sourceIndex = 0;
	let nextReplayIndex = 0;
	if (!content.every((block) => {
		const index = message.content.indexOf(block, sourceIndex);
		sourceIndex = index + 1;
		nextReplayIndex += index >= 0 && index < replayIndex ? 1 : 0;
		return index >= 0;
	})) return stripCompactionReplayCheckpoint(next);
	return nextReplayIndex === replayIndex ? next : {
		...next,
		providerReplay: {
			...replay,
			replayIndex: nextReplayIndex
		}
	};
}
//#endregion
//#region packages/ai/src/transports/provider-transport-stream.ts
const SUPPORTED_TRANSPORT_APIS = /* @__PURE__ */ new Set([
	"openai-responses",
	"openai-chatgpt-responses",
	"openai-completions",
	"azure-openai-responses",
	"anthropic-messages",
	"google-generative-ai"
]);
const SIMPLE_TRANSPORT_API_ALIAS = {
	"openai-completions": "openclaw-openai-completions-transport",
	"anthropic-messages": "openclaw-anthropic-messages-transport",
	"google-generative-ai": "openclaw-google-generative-ai-transport"
};
function createProviderOwnedGoogleTransportStreamFn(model, ctx) {
	const streamFn = getAiTransportHost().plugin.resolveProviderStream({
		provider: model.provider,
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
	}) ?? getAiTransportHost().plugin.resolveProviderStream({
		provider: "google",
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
	}) ?? void 0;
	return streamFn ? (requestModel, context, options) => streamFn(requestModel, context, {
		...options,
		headers: resolveOpencodeSessionHeaders(requestModel, options)
	}) : void 0;
}
function createSupportedTransportStreamFn(model, ctx) {
	switch (model.api) {
		case "openai-responses":
		case "openai-chatgpt-responses": return createOpenAIResponsesTransportStreamFn();
		case "openai-completions": return createOpenAICompletionsTransportStreamFn();
		case "azure-openai-responses": return createAzureOpenAIResponsesTransportStreamFn();
		case "anthropic-messages": return createAnthropicMessagesTransportStreamFn();
		case "google-generative-ai": return createProviderOwnedGoogleTransportStreamFn(model, ctx);
		default: return;
	}
}
function hasOpenClawTransportRequirement(model) {
	return getAiTransportHost().requiresManagedTransport(model);
}
/** Returns whether OpenClaw has a managed transport implementation for this API. */
function isTransportAwareApiSupported(api) {
	return SUPPORTED_TRANSPORT_APIS.has(api);
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
	if (!hasOpenClawTransportRequirement(model)) return;
	if (!isTransportAwareApiSupported(model.api)) throw new Error(`Model-provider request.proxy/request.tls/localService is not yet supported for api "${model.api}"`);
	const streamFn = createSupportedTransportStreamFn(model, ctx);
	if (!streamFn) throw new Error(`Managed transport stream is unavailable for api "${model.api}"`);
	return streamFn;
}
/** Creates a managed OpenClaw transport stream for explicit fallback/runtime callers. */
function createOpenClawTransportStreamFnForModel(model, ctx) {
	if (!isTransportAwareApiSupported(model.api)) return;
	return createSupportedTransportStreamFn(model, ctx);
}
function createBoundaryAwareStreamFnForModel(model, ctx) {
	if (!isTransportAwareApiSupported(model.api)) return;
	return createSupportedTransportStreamFn(model, ctx);
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
function buildTransportAwareSimpleStreamFn(model, ctx) {
	return createTransportAwareStreamFnForModel(model, ctx);
}
//#endregion
//#region packages/ai/src/transports/simple-completion-transport.ts
/**
* Simple completion transport preparation.
*
* Registers provider-specific stream functions and rewrites models that need OpenClaw-managed transport semantics.
*/
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
	try {
		const parsed = new URL(normalized);
		const pathname = parsed.pathname.replace(/\/+$/u, "");
		const path = pathname.toLowerCase();
		if (parsed.hostname.toLowerCase() === "chatgpt.com" && [
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
		parsed.pathname = path.endsWith("/codex/responses") ? pathname.slice(0, -10) : path.endsWith("/codex") ? pathname : `${pathname}/codex`;
		return parsed.toString();
	} catch (error) {
		if (error instanceof Error && error.message === INVALID_CODEX_BASE_URL_MESSAGE) throw error;
	}
	if (normalized.includes("?") || normalized.includes("#")) throw new Error(INVALID_CODEX_BASE_URL_MESSAGE);
	const path = normalized.replace(/\/+$/u, "");
	if (path.endsWith("/codex/responses")) return path.slice(0, -10);
	return path.endsWith("/codex") ? path : `${path}/codex`;
}
function resolveProviderSimpleCompletionApi(model) {
	const parts = [
		model.provider,
		model.id,
		model.api,
		model.baseUrl || "default"
	];
	return `${PROVIDER_SIMPLE_COMPLETION_API_PREFIX}${parts.map((part) => encodeURIComponent(part)).join(":")}`;
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
function applyProviderSimpleCompletionWrapper(registry, model, cfg, hookSourceApi = model.api) {
	if (model.api.startsWith(PROVIDER_SIMPLE_COMPLETION_API_PREFIX)) return model;
	const sourceProvider = registry.getApiProvider(model.api);
	if (!sourceProvider) return model;
	const dispatchApi = model.api;
	const sourceStreamFn = (runtimeModel, context, options) => sourceProvider.streamSimple(projectModel(runtimeModel, { api: dispatchApi }), context, options);
	const streamFn = getAiTransportHost().plugin.wrapSimpleCompletionStream({
		provider: model.provider,
		config: cfg,
		context: {
			config: cfg,
			provider: model.provider,
			modelId: model.id,
			model,
			sourceApi: hookSourceApi,
			streamFn: sourceStreamFn
		}
	});
	if (!streamFn) return model;
	const api = resolveProviderSimpleCompletionApi(model);
	return registerCustomApi(registry, api, streamFn) ? projectModel(model, { api }) : model;
}
function prepareCodexSimpleTransportModel(registry, model, cfg) {
	if (model.provider !== "openai" || model.api !== "openai-chatgpt-responses") return;
	const transportModel = projectModel(model, { baseUrl: normalizeCodexResponsesBaseUrlForOpenAISdk(model.baseUrl) });
	const api = resolveTransportAwareSimpleApi(model.api);
	const streamFn = createOpenClawTransportStreamFnForModel(transportModel, { cfg });
	if (!api || !streamFn) return;
	if (!registerCustomApi(registry, api, streamFn)) return;
	return projectModel(transportModel, { api });
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
function prepareProviderStreamModel(params) {
	const pluginModel = resolveModelTransportSentinels(params.model, "plugin simple-completion stream construction");
	const providerStreamFn = getAiTransportHost().plugin.resolveProviderStream({
		provider: params.model.provider,
		config: params.cfg,
		context: {
			config: params.cfg,
			provider: params.model.provider,
			modelId: params.model.id,
			model: pluginModel
		}
	});
	const transportFallback = providerStreamFn ? void 0 : createTransportAwareStreamFnForModel(params.model.api === "google-generative-ai" ? pluginModel : params.model, { cfg: params.cfg });
	const streamFn = providerStreamFn ? wrapPluginProviderStream(providerStreamFn) : transportFallback && params.model.api === "google-generative-ai" ? wrapPluginProviderStream(transportFallback) : transportFallback;
	if (!streamFn) return;
	const api = params.apiRegistry.getApiProvider(params.model.api) ? resolveProviderStreamApi(params.model) : params.model.api;
	const sourceApi = params.model.api;
	const sourceStreamFn = (runtimeModel, context, options) => streamFn(projectModel(runtimeModel, { api: sourceApi }), context, options);
	if (!registerCustomApi(params.apiRegistry, api, sourceStreamFn)) return;
	return api === params.model.api ? params.model : projectModel(params.model, { api });
}
function prepareModelForSimpleCompletion(params) {
	const { apiRegistry, model, cfg } = params;
	const providerStreamModel = prepareProviderStreamModel({
		model,
		cfg,
		apiRegistry
	});
	if (providerStreamModel) return applyProviderSimpleCompletionWrapper(apiRegistry, providerStreamModel, cfg, model.api);
	const codexTransportModel = prepareCodexSimpleTransportModel(apiRegistry, model, cfg);
	if (codexTransportModel) return applyProviderSimpleCompletionWrapper(apiRegistry, codexTransportModel, cfg, model.api);
	const transportAwareModel = prepareTransportAwareSimpleModel(model, { cfg });
	if (transportAwareModel !== model) {
		const streamFn = buildTransportAwareSimpleStreamFn(model, { cfg });
		if (streamFn && registerCustomApi(apiRegistry, transportAwareModel.api, streamFn)) return applyProviderSimpleCompletionWrapper(apiRegistry, transportAwareModel, cfg, model.api);
	}
	if (model.provider === "anthropic-vertex") {
		const api = resolveAnthropicVertexSimpleApi(model.baseUrl);
		if (registerCustomApi(apiRegistry, api, getAiTransportHost().plugin.createAnthropicVertexStream(model))) return applyProviderSimpleCompletionWrapper(apiRegistry, projectModel(model, { api }), cfg, model.api);
	}
	return applyProviderSimpleCompletionWrapper(apiRegistry, model, cfg);
}
//#endregion
export { CompactionReplayRefreshRequiredError, GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP, IncompleteToolCallError, MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE, applyAnthropicContextManagementToRequest, applyAnthropicEphemeralCacheControlMarkers, applyAnthropicPayloadPolicyToParams, applyAnthropicRequestCacheControl, applyCompletionsAnthropicCacheControl, applyOpenAIResponsesPayloadPolicy, assertCodeModeResponsesToolSurface, assignTransportErrorDetails, buildAnthropicSystemBlocks, buildOpenAIClientHeaders, buildOpenAICompletionsParams, buildOpenAISdkClientOptions, buildOpenAISdkRequestOptions, buildTransportAwareSimpleStreamFn, canonicalizeMaxTokensParam, captureOpenAIResponsesCompaction, coerceTransportToolCallArguments, consumeGoogleGenerateContentStream, convertGoogleTools, copyProviderAcceptanceObserver, createAnthropicMessagesTransportStreamFn, createAzureOpenAIResponsesTransportStreamFn, createBoundaryAwareStreamFnForModel, createDeepSeekTextFilter, createEmptyTransportUsage, createModelStreamCooperativeScheduler, createOpenAICompletionsTransportStreamFn, createOpenAIProviderAcceptanceHook, createOpenAIResponseHook, createOpenAIResponsesTransportStreamFn, createOpenClawTransportStreamFnForModel, createResponseModelTracker, createTransportAwareStreamFnForModel, createWritableTransportEventStream, detectOpenAICompletionsCompat, emitModelTransportDebug, enforceCodeModeResponsesToolSurface, failTransportStream, filterCodeModePayloadTools, finalizeTerminalToolCallArguments, finalizeTransportStream, flattenCompletionMessagesToStringContent, formatModelTransportDebugBaseUrl, formatModelTransportDebugUrl, getCompat, googleFlashSupportsMinimalThinking, hasOpenAICompatibleConversationTurn, isAnthropicServerToolClearingEnabled, isCodeModeModelVisibleToolName, isCompactionReplayCheckpoint, isDirectAnthropicModel, isNativeOpenAIEndpoint, isOpenAICodexResponsesModel, isOpenAICompletionsThinkingEnabled, log, logAnthropicContextEdits, measureUtf8AppendBytes, mergeTransportHeaders, mergeTransportMetadata, normalizeCodexResponsesBaseUrlForOpenAISdk, notifyProviderHttpMetadata, notifyProviderHttpResponse, notifyProviderStreamOpened, parseJsonObjectPreservingUnsafeIntegers, parseJsonPreservingUnsafeIntegers, parseOpenAICompletionsUsage, parseTerminalToolCallArguments, prepareHeadersForSimpleCompletion, prepareModelForSimpleCompletion, prepareTransportAwareSimpleModel, preserveCompactionReplayWindow, projectGoogleMessages, quoteUnsafeIntegerLiterals, readCodeModePayloadToolName, readOpenAICompletionsContentDeltas, readOpenAICompletionsReasoningBatch, replaceCompactionReplayOwnerContent, requestPreparedOpenAIResponsesCompaction, requiresCompactionReplayRefresh, requiresGoogleToolCallId, resolveAnthropicCacheOptions, resolveAnthropicContextManagementBetaHeader, resolveAnthropicEphemeralCacheControl, resolveAnthropicMessagesUrl, resolveAnthropicPayloadPolicy, resolveAnthropicServerCompactionPlan, resolveCodeModeResponsesVisibleToolNames, resolveCompactionReplayEligibility, resolveCompactionReplayPressure, resolveMaxTokensParam, resolveModelPayloadDebugMode, resolveModelSseDebugMode, resolveOpenAIClientBaseUrl, resolveOpenAICompletionsCompat, resolveOpenAIPromptCacheKeySupport, resolveOpenAIReasoningEffortMap, resolveOpenAIResponsesCompactEndpointPlan, resolveOpenAIResponsesPayloadPolicy, resolveOpenAIResponsesServerCompactionPlan, resolveOpenAIStrictToolFlagWithDiagnostics, resolvePromptCacheKey, resolveReplayableResponsesMessageId, resolveTransportAwareSimpleApi, sanitizeNonEmptyTransportPayloadText, sanitizeResponsesImagePayload, sanitizeTransportPayloadText, sortPromptCacheToolsByName as sortTransportToolsByName, stripCompactionReplayCheckpoint, stripCompactionReplayCheckpointInPlace, stripCompletionMessagesToRoleContent, throwIfModelStreamAborted, transportAbortError, usesNativeOpenAICodexResponsesBackend, withProviderAcceptanceObserver, withProviderResponseHook };
