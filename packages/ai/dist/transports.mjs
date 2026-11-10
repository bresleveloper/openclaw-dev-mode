import { w as supportsClaudeAdaptiveThinking } from "./src-CyA0zJnt.mjs";
import { o as isRecord } from "./record-coerce-CNDovvft.mjs";
import { r as normalizeLowercaseStringOrEmpty } from "./string-coerce-Cj8sqWHx.mjs";
import { T as usesClaudeStreamingRefusalContract, _ as buildAnthropicClaudeCodeIdentity, a as resolveAiTransportHeaderSentinels, b as prepareClaudeNoPrefillRequestContext, r as getAiTransportHost } from "./host-CWt55nnF.mjs";
import { i as OPENAI_RESPONSES_APIS } from "./openai-responses-contracts-B5mGAbR6.mjs";
import { o as redactDiagnosticText, s as truncateUtf16Safe } from "./provider-error-qtZD2inE.mjs";
import { a as resolveModelPayloadDebugMode, i as emitModelTransportError, n as formatModelTransportDebugUrl, o as resolveModelSseDebugMode, r as emitModelTransportDebug, t as formatModelTransportDebugBaseUrl, x as toErrorObject } from "./diagnostics-v7oVEW59.mjs";
import { i as readResponseTextSnippet, o as resolveModelHeaderSentinels, r as isCodeModeModelVisibleToolName, s as streamFragmentError, t as MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE } from "./transport-utils-DwOpuTjL.mjs";
import { a as resolveOpenAIPromptCacheKeySupport, i as resolveOpenAICompletionsCompat, n as isNativeOpenAIEndpoint, o as usesNativeOpenAICodexResponsesBackend, r as isOpenAICodexResponsesModel, t as detectOpenAICompletionsCompat } from "./openai-completions-compat-bNQXF1y9.mjs";
import { t as buildGuardedModelFetch } from "./host-policy-Dm7PM6AD.mjs";
import { A as resolveAnthropicCacheOptions, C as applyAnthropicEphemeralCacheControlMarkers, D as isAnthropicServerToolClearingEnabled, E as buildAnthropicSystemBlocks, F as supportsAnthropicServerSideFallback, H as isAnthropicOAuthApiKey, M as resolveAnthropicPayloadPolicy, N as resolveAnthropicRequestBetaHeader, O as isDirectAnthropicModel, P as resolveAnthropicServerCompactionPlan, S as applyAnthropicContextManagementToRequest, T as applyAnthropicRequestCacheControl, U as omitFoundryBearerCredentialHeaders, W as usesFoundryBearerAuth, b as resolveNewestAnthropicCompaction, f as resolveAnthropicTransportOptions, j as resolveAnthropicEphemeralCacheControl, k as logAnthropicContextEdits, l as buildAnthropicRequest, p as resolveCompletionTokenReservation, t as consumeAnthropicStream, u as prepareAnthropicRequest, w as applyAnthropicPayloadPolicyToParams, x as suppressAnthropicCompaction, y as isAnthropicReplayRejection } from "./anthropic-stream-reducer-yWDb5Cct.mjs";
import { r as sortPromptCacheToolsByName } from "./prompt-cache-stability-D_MeCQFI.mjs";
import { C as parseJsonObjectPreservingUnsafeIntegers, S as withProviderResponseHook, T as quoteUnsafeIntegerLiterals, _ as sanitizeNonEmptyTransportPayloadText, a as createEmptyTransportUsage, b as transportAbortError, c as failTransportStream, d as iterateModelStream, f as mergeTransportHeaders, g as parseTerminalToolCallArguments, h as notifyProviderStreamOpened, i as copyProviderAcceptanceObserver, j as createAbortError$1, l as finalizeTerminalToolCallArguments, m as notifyProviderHttpResponse, n as assignTransportErrorDetails, o as createModelStreamCooperativeScheduler, p as notifyProviderHttpMetadata, r as coerceTransportToolCallArguments, s as createWritableTransportEventStream, t as IncompleteToolCallError, u as finalizeTransportStream, v as sanitizeTransportPayloadText, w as parseJsonPreservingUnsafeIntegers, x as withProviderAcceptanceObserver, y as throwIfModelStreamAborted } from "./transport-stream-shared-lhgkTOz3.mjs";
import { n as getEnvApiKey } from "./env-api-keys-Xd8dm_aV.mjs";
import { t as createDeferredEventBuffer } from "./deferred-event-buffer-DAvyP7qA.mjs";
import { t as createAssistantOutput } from "./assistant-output-BnQm3fov.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-DA4WHv1h.mjs";
import { c as flattenCompletionMessagesToStringContent, d as hasOpenAICompatibleConversationTurn, f as canonicalizeMaxTokensParam, i as createOpenAIResponsesTransportStreamFn, l as stripCompletionMessagesToRoleContent, m as createDeepSeekTextFilter, o as buildOpenAICompletionsParams, p as resolveMaxTokensParam, r as createAzureOpenAIResponsesTransportStreamFn, t as createOpenAICompletionsTransportStreamFn, u as applyCompletionsAnthropicCacheControl } from "./openai-completions-transport-CXMmOM4R.mjs";
import { a as googleFlashSupportsMinimalThinking, i as consumeGoogleGenerateContentStream, n as projectGoogleMessages, r as requiresGoogleToolCallId, t as convertGoogleTools } from "./google-messages-DQMgG5yG.mjs";
import { At as isOpenAICompletionsThinkingEnabled, Dt as createOpenAIResponseHook, Et as createOpenAIProviderAcceptanceHook, Ft as readOpenAICompletionsReasoningBatch, It as resolveOpenAIClientBaseUrl, J as OPENAI_RESPONSES_FUNCTION_CALL_ITEM_ID_RE, L as normalizeOpenAIResponsesReasoningReplayItem, Lt as resolvePromptCacheKey, M as resolveResponsesContextUsageBoundary, Mt as measureUtf8AppendBytes, Nt as parseOpenAICompletionsUsage, Ot as createResponseModelTracker, Pt as readOpenAICompletionsContentDeltas, Q as splitOpenAIFunctionCallPairing, R as resolveReplayableResponsesMessageId, Rt as withOpenAIErrorResponseHook, Tt as GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP, X as normalizeOpenAIResponsesFunctionCallId, Y as OPENAI_RESPONSES_ID_MAX_LENGTH, Z as shouldNormalizeOpenAIResponsesToolCallId, at as resolveNewestOpenAIResponsesCompactionReplay, ct as buildOpenAIClientHeaders, dt as enforceCodeModeResponsesToolSurface, ft as filterCodeModePayloadTools, gt as resolveOpenAIStrictToolFlagWithDiagnostics, ht as resolveCodeModeResponsesVisibleToolNames, it as captureOpenAIResponsesCompaction, jt as log, kt as detachPartialSnapshot, lt as buildOpenAISdkClientOptions, mt as readCodeModePayloadToolName, nt as CompactionReplayRefreshRequiredError, pt as getCompat, q as OPENAI_RESPONSES_CALL_ID_RE, st as assertCodeModeResponsesToolSurface, ut as buildOpenAISdkRequestOptions, yt as resolveOpenAIReasoningEffortMap } from "./openai-responses-shared-XoSAyCHj.mjs";
import { c as applyOpenAIResponsesPayloadPolicy, d as resolveOpenAIResponsesPayloadPolicy, f as resolveOpenAIResponsesRequestContextTokens, l as normalizeOpenAIServiceTier, p as resolveOpenAIResponsesServerCompactionPlan, s as sanitizeResponsesImagePayload, u as resolveOpenAIResponsesCompactEndpointPlan } from "./openai-responses-endpoint-CfKR6N5f.mjs";
import { c as requestPreparedOpenAIResponsesCompaction } from "./openai-responses-request-lifecycle-B-urkkjk.mjs";
import { n as createGoogleVideoPlaceholder, r as materializeGoogleVideoSlots, t as GOOGLE_VIDEO_SLOT_OMISSION } from "./google-video-slots-D8tPH8wX.mjs";
import { randomUUID } from "node:crypto";
//#region packages/ai/src/transports/anthropic-transport-stream.ts
const ANTHROPIC_MESSAGES_ERROR_BODY_MAX_BYTES = 8192;
const ANTHROPIC_MESSAGES_ERROR_BODY_MAX_CHARS = 400;
const ANTHROPIC_MESSAGES_ERROR_BODY_READ_IDLE_TIMEOUT_MS = 1e4;
const ANTHROPIC_MESSAGES_SSE_PENDING_BUFFER_MAX_CHARS = 16777216;
function isKimiAnthropicProvider(provider) {
	return /^kimi(?:-|$)/.test(normalizeLowercaseStringOrEmpty(provider ?? ""));
}
function buildAnthropicBetaHeader(model, betaFeatures, params) {
	if (!isDirectAnthropicModel(model)) return;
	return params.oauth ? `claude-code-20250219,oauth-2025-04-20,${betaFeatures.join(",")}` : betaFeatures.join(",");
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
		throw streamFragmentError(error);
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
	const delimiter = /(?:\r\n|\r(?!\n)|\n)(?:\r\n|\r(?!\n)|\n)/g;
	let scanOffset = 0;
	try {
		while (!completed) {
			const { done, value } = await readAnthropicSseChunk(reader, signal);
			completed = done;
			buffer += decoder.decode(value, { stream: !done });
			delimiter.lastIndex = scanOffset;
			for (;;) {
				const boundary = delimiter.exec(buffer);
				if (!boundary && (!completed || !buffer)) break;
				const frameEnd = boundary?.index ?? buffer.length;
				assertAnthropicSsePendingBufferWithinLimit(frameEnd);
				const frame = boundary ? buffer.slice(0, frameEnd) : buffer.trim();
				buffer = boundary ? buffer.slice(frameEnd + boundary[0].length) : "";
				delimiter.lastIndex = 0;
				const data = frame.split(/\r\n|\n|\r/).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
				if (data && data !== "[DONE]") yield parseAnthropicSseEventData(data);
			}
			assertAnthropicSsePendingBufferWithinLimit(buffer.length);
			scanOffset = Math.max(0, buffer.length - 3);
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
	}, copilot ? model.headers : omitFoundryBearerCredentialHeaders(model.headers), copilot ? getAiTransportHost().buildCopilotDynamicHeaders(context.messages) : void 0, optionHeaders);
	else {
		const betaFeatures = ["fine-grained-tool-streaming-2025-05-14"];
		if (needsInterleavedBeta) betaFeatures.push("interleaved-thinking-2025-05-14");
		const betaHeader = buildAnthropicBetaHeader(model, betaFeatures, { oauth: isOAuthToken });
		if (isOAuthToken) {
			const identity = buildAnthropicClaudeCodeIdentity(betaHeader, model.headers, optionHeaders);
			defaultHeaders = identity.headers;
			claudeCodeVersion = identity.version;
		} else {
			defaultHeaders = mergeTransportHeaders({
				accept: "application/json",
				"anthropic-dangerous-direct-browser-access": "true",
				...betaHeader ? { "anthropic-beta": betaHeader } : {},
				...options?.sessionId && options.cacheRetention !== "none" && model.compat?.sendSessionAffinityHeaders === true ? { "x-session-affinity": options.sessionId } : {}
			}, model.headers, optionHeaders, getAiTransportHost().resolveProviderRequestHeaders({
				provider: model.provider,
				api: model.api,
				baseUrl: model.baseUrl,
				model
			}));
			directApiKeyBetaHeader = isDirectAnthropicModel(model) ? new Headers(defaultHeaders).get("anthropic-beta") ?? "" : void 0;
		}
	}
	const url = resolveAnthropicMessagesUrl(model.baseUrl);
	return {
		isOAuthToken,
		claudeCodeVersion,
		directApiKeyBetaHeader,
		async request(body, requestOptions) {
			const headers = new Headers(mergeTransportHeaders({
				"content-type": "application/json",
				"anthropic-version": "2023-06-01",
				...bearerAuth || isOAuthToken ? { authorization: `Bearer ${apiKey}` } : { "x-api-key": apiKey }
			}, defaultHeaders));
			for (const [name, value] of Object.entries(requestOptions?.headers ?? {})) headers.set(name, value);
			const response = await fetch(url, {
				method: "POST",
				headers,
				body: JSON.stringify(body),
				signal: requestOptions?.signal
			});
			return {
				response,
				stream: response.body ? parseAnthropicSseBody(response.body, requestOptions?.signal) : []
			};
		}
	};
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
			let replayedCompaction;
			try {
				const apiKey = options?.apiKey ?? getEnvApiKey(model.provider) ?? "";
				if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
				const transportOptions = resolveAnthropicTransportOptions(model, options, apiKey);
				const requestContext = prepareClaudeNoPrefillRequestContext(model, context);
				const { request, isOAuthToken, directApiKeyBetaHeader, claudeCodeVersion } = createAnthropicTransportClient({
					model,
					context: requestContext,
					apiKey,
					options: transportOptions
				});
				const builtParams = await buildAnthropicRequest(model, requestContext, transportOptions, "transport", isOAuthToken, !isOAuthToken && supportsAnthropicServerSideFallback(model), claudeCodeVersion);
				replayedCompaction = builtParams.replayedCompaction;
				const { params, headers } = await prepareAnthropicRequest(builtParams.params, model, transportOptions, directApiKeyBetaHeader);
				const { response, stream: anthropicStream } = await request({
					...params,
					stream: true
				}, {
					signal: transportOptions.signal,
					headers
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
						if (replayedCompaction && isAnthropicReplayRejection(output)) suppressAnthropicCompaction(output, model, options, replayedCompaction);
						for (const block of output.content) delete block.index;
					}
				});
			}
		})();
		return eventStream;
	};
}
//#endregion
//#region packages/ai/src/transports/provider-compaction-checkpoint.ts
/** Whether provider replay state is a prefix-bound server compaction checkpoint. */
function isCompactionReplayCheckpoint(replay) {
	const type = replay && typeof replay === "object" ? replay.type : void 0;
	return type === "anthropic-compaction" || type === "openai-responses-compaction" || type === "openai-responses-retained-compaction";
}
/** Strip prefix-bound checkpoint state from an in-place message rewrite. */
function stripCompactionReplayCheckpointInPlace(message) {
	if (isCompactionReplayCheckpoint(message.providerReplay)) delete message.providerReplay;
}
/** Strip prefix-bound checkpoints after local history rewrites. */
function stripCompactionReplayCheckpoint(message) {
	if (!isCompactionReplayCheckpoint(message.providerReplay)) return message;
	const replaySafeMessage = { ...message };
	delete replaySafeMessage.providerReplay;
	return replaySafeMessage;
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
function resolveCompactionReplayPressure(messages, model, identity, estimate, systemPrompt) {
	const checkpoint = resolveCompactionSource(messages, model, identity);
	if (!checkpoint) return;
	if (checkpoint.family === "responses" && checkpoint.mode === "refresh-required") throw new CompactionReplayRefreshRequiredError();
	const ownerIndex = messages.findIndex((message) => message === checkpoint.owner);
	const owner = messages[ownerIndex];
	if (!owner) return;
	const prefixTokens = checkpoint.family === "anthropic" ? estimate.text(checkpoint.summary) : checkpoint.mode === "complete-window" ? estimateResponsesInput(checkpoint.output, estimate, checkpoint.outputTokens) : estimate.text(checkpoint.item.encrypted_content);
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
/** Preserve the covered prefix and reindex checkpoints after known content removals. */
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
	if (content.length === message.content.length && content.slice(0, replayIndex).every((block, index) => block === message.content[index])) return next;
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
//#endregion
//#region packages/ai/src/transports/simple-completion-transport.ts
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
function resolveProviderSimpleCompletionApi(model, auth, agentId) {
	const parts = [
		model.provider,
		model.id,
		model.api,
		model.baseUrl || "default"
	];
	if (auth) parts.push(auth.mode, auth.authFlow ?? "");
	if (agentId) parts.push("agent", agentId);
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
function applyProviderSimpleCompletionWrapper(registry, model, cfg, hookSourceApi, auth, agentId) {
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
			auth,
			agentId,
			streamFn: sourceStreamFn
		}
	});
	if (!streamFn) return model;
	const registeredStreamFn = (runtimeModel, context, options) => streamFn(projectModel(runtimeModel, { api: hookSourceApi }), context, options);
	const api = resolveProviderSimpleCompletionApi(model, auth, agentId);
	return registerCustomApi(registry, api, registeredStreamFn) ? projectModel(model, { api }) : model;
}
function prepareCodexSimpleTransportModel(registry, model, cfg) {
	if (model.provider !== "openai" || model.api !== "openai-chatgpt-responses") return;
	const transportModel = projectModel(model, { baseUrl: normalizeCodexResponsesBaseUrlForOpenAISdk(model.baseUrl) });
	const api = resolveTransportAwareSimpleApi(model.api);
	const streamFn = createSupportedTransportStreamFn(transportModel, { cfg });
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
	const { apiRegistry, model, cfg, auth, agentId } = params;
	const wrap = (prepared) => applyProviderSimpleCompletionWrapper(apiRegistry, prepared, cfg, model.api, auth, agentId);
	const providerStreamModel = prepareProviderStreamModel({
		model,
		cfg,
		apiRegistry
	});
	if (providerStreamModel) return wrap(providerStreamModel);
	const codexTransportModel = prepareCodexSimpleTransportModel(apiRegistry, model, cfg);
	if (codexTransportModel) return wrap(codexTransportModel);
	const transportAwareModel = prepareTransportAwareSimpleModel(model, { cfg });
	if (transportAwareModel !== model) {
		const streamFn = createTransportAwareStreamFnForModel(model, { cfg });
		if (streamFn && registerCustomApi(apiRegistry, transportAwareModel.api, streamFn)) return wrap(transportAwareModel);
	}
	if (model.provider === "anthropic-vertex") {
		const api = resolveAnthropicVertexSimpleApi(model.baseUrl);
		if (registerCustomApi(apiRegistry, api, getAiTransportHost().plugin.createAnthropicVertexStream(model))) return wrap(projectModel(model, { api }));
	}
	return wrap(model);
}
//#endregion
export { CompactionReplayRefreshRequiredError, GEMINI_THOUGHT_SIGNATURE_VALIDATOR_SKIP, GOOGLE_VIDEO_SLOT_OMISSION, IncompleteToolCallError, MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE, OPENAI_RESPONSES_CALL_ID_RE, OPENAI_RESPONSES_FUNCTION_CALL_ITEM_ID_RE, OPENAI_RESPONSES_ID_MAX_LENGTH, applyAnthropicContextManagementToRequest, applyAnthropicEphemeralCacheControlMarkers, applyAnthropicPayloadPolicyToParams, applyAnthropicRequestCacheControl, applyCompletionsAnthropicCacheControl, applyOpenAIResponsesPayloadPolicy, assertCodeModeResponsesToolSurface, assignTransportErrorDetails, buildAnthropicSystemBlocks, buildOpenAIClientHeaders, buildOpenAICompletionsParams, buildOpenAISdkClientOptions, buildOpenAISdkRequestOptions, createTransportAwareStreamFnForModel as buildTransportAwareSimpleStreamFn, createTransportAwareStreamFnForModel, canonicalizeMaxTokensParam, captureOpenAIResponsesCompaction, coerceTransportToolCallArguments, consumeGoogleGenerateContentStream, convertGoogleTools, copyProviderAcceptanceObserver, createAnthropicMessagesTransportStreamFn, createAzureOpenAIResponsesTransportStreamFn, createSupportedTransportStreamFn as createBoundaryAwareStreamFnForModel, createSupportedTransportStreamFn as createOpenClawTransportStreamFnForModel, createDeepSeekTextFilter, createEmptyTransportUsage, createGoogleVideoPlaceholder, createModelStreamCooperativeScheduler, createOpenAICompletionsTransportStreamFn, createOpenAIProviderAcceptanceHook, createOpenAIResponseHook, createOpenAIResponsesTransportStreamFn, createResponseModelTracker, createWritableTransportEventStream, detachPartialSnapshot, detectOpenAICompletionsCompat, emitModelTransportDebug, emitModelTransportError, enforceCodeModeResponsesToolSurface, failTransportStream, filterCodeModePayloadTools, finalizeTerminalToolCallArguments, finalizeTransportStream, flattenCompletionMessagesToStringContent, formatModelTransportDebugBaseUrl, formatModelTransportDebugUrl, getCompat, googleFlashSupportsMinimalThinking, hasOpenAICompatibleConversationTurn, isAnthropicServerToolClearingEnabled, isCodeModeModelVisibleToolName, isCompactionReplayCheckpoint, isDirectAnthropicModel, isNativeOpenAIEndpoint, isOpenAICodexResponsesModel, isOpenAICompletionsThinkingEnabled, iterateModelStream, log, logAnthropicContextEdits, materializeGoogleVideoSlots, measureUtf8AppendBytes, mergeTransportHeaders, normalizeCodexResponsesBaseUrlForOpenAISdk, normalizeOpenAIResponsesFunctionCallId, normalizeOpenAIResponsesReasoningReplayItem, normalizeOpenAIServiceTier, notifyProviderHttpMetadata, notifyProviderHttpResponse, notifyProviderStreamOpened, parseJsonObjectPreservingUnsafeIntegers, parseJsonPreservingUnsafeIntegers, parseOpenAICompletionsUsage, parseTerminalToolCallArguments, prepareHeadersForSimpleCompletion, prepareModelForSimpleCompletion, prepareTransportAwareSimpleModel, preserveCompactionReplayWindow, projectGoogleMessages, quoteUnsafeIntegerLiterals, readCodeModePayloadToolName, readOpenAICompletionsContentDeltas, readOpenAICompletionsReasoningBatch, replaceCompactionReplayOwnerContent, requestPreparedOpenAIResponsesCompaction, requiresCompactionReplayRefresh, requiresGoogleToolCallId, resolveAnthropicCacheOptions, resolveAnthropicEphemeralCacheControl, resolveAnthropicMessagesUrl, resolveAnthropicPayloadPolicy, resolveAnthropicRequestBetaHeader, resolveAnthropicServerCompactionPlan, resolveCodeModeResponsesVisibleToolNames, resolveCompactionReplayEligibility, resolveCompactionReplayPressure, resolveCompletionTokenReservation, resolveMaxTokensParam, resolveModelPayloadDebugMode, resolveModelSseDebugMode, resolveOpenAIClientBaseUrl, resolveOpenAICompletionsCompat, resolveOpenAIPromptCacheKeySupport, resolveOpenAIReasoningEffortMap, resolveOpenAIResponsesCompactEndpointPlan, resolveOpenAIResponsesPayloadPolicy, resolveOpenAIResponsesRequestContextTokens, resolveOpenAIResponsesServerCompactionPlan, resolveOpenAIStrictToolFlagWithDiagnostics, resolvePromptCacheKey, resolveReplayableResponsesMessageId, resolveTransportAwareSimpleApi, sanitizeNonEmptyTransportPayloadText, sanitizeResponsesImagePayload, sanitizeTransportPayloadText, shouldNormalizeOpenAIResponsesToolCallId, sortPromptCacheToolsByName as sortTransportToolsByName, splitOpenAIFunctionCallPairing, stripCompactionReplayCheckpoint, stripCompactionReplayCheckpointInPlace, stripCompletionMessagesToRoleContent, supportsAnthropicServerSideFallback, throwIfModelStreamAborted, transportAbortError, usesNativeOpenAICodexResponsesBackend, withOpenAIErrorResponseHook, withProviderAcceptanceObserver, withProviderResponseHook };
