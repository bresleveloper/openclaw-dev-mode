import { n as getEnvApiKey, r as __exportAll } from "./env-api-keys-DrgeBuva.mjs";
import { _ as resolveClaudeSonnet5ModelIdentity, g as resolveClaudeOpus5ModelIdentity, y as supportsClaudeAdaptiveThinking } from "./src-DwGYYyZp.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-D8PARQfL.mjs";
import { E as resolveAnthropicThinkingEffort, O as usesClaudeFable5MessagesContract, T as requiresClaudeAdaptiveThinking, b as applyClaudeRequestContract, k as usesClaudeStreamingRefusalContract, n as getAiTransportHost, r as resolveAiTransportHeaderSentinels, w as prepareClaudeNoPrefillRequestContext, x as buildAnthropicClaudeCodeIdentity } from "./host-yTvBrYM2.mjs";
import { t as MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE } from "./transport-utils-03Qi0CN2.mjs";
import { C as applyAnthropicThinkingBindingControls, D as ANTHROPIC_SERVER_SIDE_FALLBACKS, H as resolveAnthropicContextManagementBetaHeader, I as applyAnthropicRequestCacheControl, J as usesFoundryBearerAuth, K as isAnthropicOAuthApiKey, L as buildAnthropicSystemBlocks, N as applyAnthropicContextManagementToRequest, O as ANTHROPIC_SERVER_SIDE_FALLBACK_BETA, V as resolveAnthropicCacheOptions, d as convertAnthropicTools, f as buildAnthropicReplayPlan, g as normalizeAnthropicToolCallId, h as suppressAnthropicCompaction, l as buildAnthropicGenerationParams, p as isAnthropicReplayRejection, q as omitFoundryBearerCredentialHeaders, t as consumeAnthropicStream, u as convertAnthropicMessages, z as isDirectAnthropicModel } from "./anthropic-stream-reducer-D6ZI1wwj.mjs";
import { t as resolveCacheRetention } from "./cache-retention-0x979a5V.mjs";
import { n as buildBaseOptions, r as clampMaxTokensToModel, t as adjustMaxTokensForThinking } from "./simple-options-np1XPuhm.mjs";
import { T as parseJsonWithRepair, l as finalizeTransportStream, n as assignTransportErrorDetails, p as notifyProviderHttpResponse } from "./transport-stream-shared-B5RioB_Q.mjs";
import { t as createDeferredEventBuffer } from "./deferred-event-buffer-DAvyP7qA.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-BjtkplhG.mjs";
import { t as createAssistantOutput } from "./assistant-output-DM1JBNs1.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-Bcunsn4I.mjs";
import { t as transformProviderMessages } from "./provider-transcript-transform-BTocjCRs.mjs";
import { i as resolveCloudflareBaseUrl, n as hasCopilotVisionInput, t as buildCopilotDynamicHeaders } from "./github-copilot-headers-B37TB3rB.mjs";
import Anthropic from "@anthropic-ai/sdk";
import { Stream } from "@anthropic-ai/sdk/core/streaming.js";
//#region packages/ai/src/providers/anthropic.ts
var anthropic_exports = /* @__PURE__ */ __exportAll({
	streamAnthropic: () => streamAnthropic,
	streamSimpleAnthropic: () => streamSimpleAnthropic
});
const FINE_GRAINED_TOOL_STREAMING_BETA = "fine-grained-tool-streaming-2025-05-14";
const INTERLEAVED_THINKING_BETA = "interleaved-thinking-2025-05-14";
const ANTHROPIC_MIN_THINKING_BUDGET_TOKENS = 1024;
function getAnthropicCompat(model) {
	const isFireworks = model.provider === "fireworks";
	const isCloudflareAiGatewayAnthropic = model.provider === "cloudflare-ai-gateway" && model.baseUrl.includes("anthropic");
	return {
		supportsEagerToolInputStreaming: model.compat?.supportsEagerToolInputStreaming ?? !isFireworks,
		sendSessionAffinityHeaders: model.compat?.sendSessionAffinityHeaders ?? (isFireworks || isCloudflareAiGatewayAnthropic),
		allowEmptySignature: model.compat?.allowEmptySignature ?? false
	};
}
function mergeHeaders(...headerSources) {
	const merged = {};
	for (const headers of headerSources) if (headers) Object.assign(merged, headers);
	return merged;
}
const ANTHROPIC_MESSAGE_EVENTS = /* @__PURE__ */ new Set([
	"message_start",
	"message_delta",
	"message_stop",
	"content_block_start",
	"content_block_delta",
	"content_block_stop"
]);
async function* iterateAnthropicEvents(response, signal) {
	if (!response.body) throw new Error("Attempted to iterate over an Anthropic response with no body");
	for await (const sse of Stream.rawEvents(response)) {
		if (sse.event === "error") throw new Error(sse.data);
		notifyLlmRequestActivity(signal);
		if (!ANTHROPIC_MESSAGE_EVENTS.has(sse.event ?? "")) continue;
		try {
			yield parseJsonWithRepair(sse.data);
		} catch (error) {
			if (error instanceof SyntaxError) throw new Error(MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE, { cause: error });
			throw error;
		}
	}
}
const streamAnthropic = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	const requestContext = prepareClaudeNoPrefillRequestContext(model, context);
	const requestOptions = normalizeAnthropicThinkingOptions(model, options);
	(async () => {
		const output = createAssistantOutput(model);
		const refusalBuffer = usesClaudeStreamingRefusalContract(model) ? createDeferredEventBuffer(stream) : void 0;
		let usedCompactionReplay = false;
		try {
			let client;
			let isOAuth;
			let serverSideFallback = false;
			let directApiKeyBetaHeader;
			let claudeCodeVersion;
			if (requestOptions?.client) {
				client = requestOptions.client;
				isOAuth = false;
			} else {
				const apiKey = requestOptions?.apiKey ?? getEnvApiKey(model.provider) ?? "";
				let copilotDynamicHeaders;
				if (model.provider === "github-copilot") {
					const hasImages = hasCopilotVisionInput(requestContext.messages);
					copilotDynamicHeaders = buildCopilotDynamicHeaders({
						messages: requestContext.messages,
						hasImages
					});
				}
				const cacheSessionId = (requestOptions?.cacheRetention ?? resolveCacheRetention()) === "none" ? void 0 : requestOptions?.sessionId;
				const created = createClient(model, apiKey, requestOptions?.thinkingEnabled === true, requestOptions?.interleavedThinking ?? true, shouldUseFineGrainedToolStreamingBeta(model, requestContext), resolveOpencodeSessionHeaders(model, requestOptions), copilotDynamicHeaders, cacheSessionId);
				client = created.client;
				isOAuth = created.isOAuthToken;
				serverSideFallback = created.serverSideFallback;
				directApiKeyBetaHeader = created.directApiKeyBetaHeader;
				claudeCodeVersion = created.claudeCodeVersion;
			}
			const builtParams = await buildParams(model, requestContext, isOAuth, requestOptions, serverSideFallback, claudeCodeVersion);
			usedCompactionReplay = builtParams.usedCompactionReplay;
			let params = builtParams.params;
			const toolProjection = builtParams.toolProjection;
			applyAnthropicContextManagementToRequest(params, model, requestOptions, directApiKeyBetaHeader);
			const nextParams = await requestOptions?.onPayload?.(params, model);
			if (nextParams !== void 0) params = nextParams;
			applyClaudeRequestContract(params, model);
			const betaHeader = resolveAnthropicContextManagementBetaHeader(params, directApiKeyBetaHeader);
			const sdkRequestOptions = {
				...requestOptions?.signal ? { signal: requestOptions.signal } : {},
				...requestOptions?.timeoutMs !== void 0 ? { timeout: requestOptions.timeoutMs } : {},
				maxRetries: 0,
				headers: applyAnthropicThinkingBindingControls(params, betaHeader) ?? (betaHeader ? { "anthropic-beta": betaHeader } : void 0)
			};
			const response = await client.messages.create({
				...params,
				stream: true
			}, sdkRequestOptions).asResponse();
			await notifyProviderHttpResponse({
				options: requestOptions,
				response,
				model
			});
			await consumeAnthropicStream({
				events: iterateAnthropicEvents(response, requestOptions?.signal),
				model,
				options: requestOptions ?? {},
				output,
				stream,
				refusalBuffer,
				isOAuthToken: isOAuth,
				toolProjection,
				profile: "provider"
			});
			finalizeTransportStream({
				stream,
				output
			});
		} catch (error) {
			const terminal = assignTransportErrorDetails(output, error, requestOptions?.signal);
			output.content = output.content.filter((block) => block.type !== "toolCall");
			for (const block of output.content) {
				delete block.index;
				delete block.partialJson;
			}
			if (refusalBuffer) {
				refusalBuffer.discard();
				output.content = [];
			}
			if (usedCompactionReplay && isAnthropicReplayRejection(error)) suppressAnthropicCompaction(output, model, requestOptions);
			stream.push({
				type: "error",
				reason: terminal.stopReason,
				error: output
			});
			stream.end();
		}
	})();
	return stream;
};
function normalizeAnthropicThinkingOptions(model, options) {
	if (options?.thinkingEnabled !== true || supportsClaudeAdaptiveThinking(model)) return options;
	const budgetTokens = options.thinkingBudgetTokens ?? ANTHROPIC_MIN_THINKING_BUDGET_TOKENS;
	const maxTokens = options.maxTokens ?? model.maxTokens;
	if (budgetTokens >= ANTHROPIC_MIN_THINKING_BUDGET_TOKENS && budgetTokens < maxTokens) return options;
	return {
		...options,
		thinkingEnabled: false,
		thinkingBudgetTokens: void 0
	};
}
const streamSimpleAnthropic = (model, context, options) => {
	const apiKey = options?.apiKey || getEnvApiKey(model.provider);
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const base = {
		...buildBaseOptions(model, options, apiKey),
		anthropicServerCompaction: options?.anthropicServerCompaction,
		anthropicCompactThreshold: options?.anthropicCompactThreshold,
		cacheTtlPruning: options?.cacheTtlPruning,
		authProfileId: options?.authProfileId,
		maxTokens: clampMaxTokensToModel(model, options?.maxTokens ?? model.maxTokens),
		toolChoice: options?.toolChoice
	};
	const mandatoryAdaptiveThinking = requiresClaudeAdaptiveThinking(model);
	if (options?.reasoning === "off" && !mandatoryAdaptiveThinking) return streamAnthropic(model, context, {
		...base,
		thinkingEnabled: false
	});
	const reasoning = options?.reasoning === "off" ? mandatoryAdaptiveThinking ? "low" : "high" : options?.reasoning;
	if (resolveClaudeOpus5ModelIdentity(model) || resolveClaudeSonnet5ModelIdentity(model)) return streamAnthropic(model, context, {
		...base,
		thinkingEnabled: true,
		effort: resolveAnthropicThinkingEffort(model, reasoning)
	});
	if (!reasoning) return streamAnthropic(model, context, {
		...base,
		thinkingEnabled: mandatoryAdaptiveThinking
	});
	if (supportsClaudeAdaptiveThinking(model)) {
		const effort = resolveAnthropicThinkingEffort(model, reasoning);
		return streamAnthropic(model, context, {
			...base,
			thinkingEnabled: true,
			effort
		});
	}
	const adjusted = adjustMaxTokensForThinking(base.maxTokens, model.maxTokens ?? base.maxTokens, reasoning, options?.thinkingBudgets);
	const thinkingEnabled = adjusted.thinkingBudget >= ANTHROPIC_MIN_THINKING_BUDGET_TOKENS;
	const maxTokens = thinkingEnabled ? adjusted.maxTokens : clampMaxTokensToModel(model, options?.maxTokens ?? model.maxTokens);
	return streamAnthropic(model, context, {
		...base,
		maxTokens,
		thinkingEnabled,
		thinkingBudgetTokens: thinkingEnabled ? adjusted.thinkingBudget : void 0
	});
};
/**
* Server-side refusal fallback is a first-party Claude API beta: proxies and
* Bedrock/Vertex/Foundry reject the `fallbacks` param, and OAuth (Claude Code
* identity) requests are excluded until the beta is verified there.
*/
function supportsAnthropicServerSideFallback(model) {
	if (!usesClaudeFable5MessagesContract(model) && resolveClaudeOpus5ModelIdentity(model) === void 0 || model.provider !== "anthropic") return false;
	return isDirectAnthropicModel(model);
}
function createClient(model, apiKey, thinkingEnabled, interleavedThinking, useFineGrainedToolStreamingBeta, optionsHeaders, dynamicHeaders, sessionId) {
	const needsInterleavedBeta = interleavedThinking && !supportsClaudeAdaptiveThinking(model);
	const betaFeatures = [];
	if (useFineGrainedToolStreamingBeta) betaFeatures.push(FINE_GRAINED_TOOL_STREAMING_BETA);
	if (needsInterleavedBeta) betaFeatures.push(INTERLEAVED_THINKING_BETA);
	const fetchOptions = /^kimi(?:-|$)/.test(model.provider) && thinkingEnabled ? { sanitizeSse: false } : void 0;
	const fetch = getAiTransportHost().buildModelFetch(model, void 0, fetchOptions);
	if (model.provider === "cloudflare-ai-gateway") return {
		client: new Anthropic({
			apiKey,
			authToken: null,
			baseURL: resolveCloudflareBaseUrl(model),
			dangerouslyAllowBrowser: true,
			defaultHeaders: mergeHeaders({
				accept: "application/json",
				"anthropic-dangerous-direct-browser-access": "true",
				Authorization: null,
				...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
			}, model.headers, optionsHeaders),
			fetch,
			maxRetries: 0
		}),
		isOAuthToken: false,
		serverSideFallback: false
	};
	if (model.provider === "github-copilot") return {
		client: new Anthropic({
			apiKey: null,
			authToken: apiKey,
			baseURL: model.baseUrl,
			dangerouslyAllowBrowser: true,
			defaultHeaders: mergeHeaders({
				accept: "application/json",
				"anthropic-dangerous-direct-browser-access": "true",
				...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
			}, model.headers, dynamicHeaders, optionsHeaders),
			fetch,
			maxRetries: 0
		}),
		isOAuthToken: false,
		serverSideFallback: false
	};
	if (usesFoundryBearerAuth({
		...model,
		headers: resolveAiTransportHeaderSentinels(model.headers)
	})) return {
		client: new Anthropic({
			apiKey: null,
			authToken: apiKey,
			baseURL: model.baseUrl,
			dangerouslyAllowBrowser: true,
			defaultHeaders: mergeHeaders({
				accept: "application/json",
				"anthropic-dangerous-direct-browser-access": "true",
				...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
			}, omitFoundryBearerCredentialHeaders(model.headers), dynamicHeaders, optionsHeaders),
			fetch,
			maxRetries: 0
		}),
		isOAuthToken: false,
		serverSideFallback: false
	};
	if (isAnthropicOAuthApiKey(apiKey)) {
		const identity = buildAnthropicClaudeCodeIdentity([
			"claude-code-20250219",
			"oauth-2025-04-20",
			...betaFeatures
		].join(","), model.headers, optionsHeaders);
		return {
			client: new Anthropic({
				apiKey: null,
				authToken: apiKey,
				baseURL: model.baseUrl,
				dangerouslyAllowBrowser: true,
				defaultHeaders: identity.headers,
				fetch,
				maxRetries: 0
			}),
			isOAuthToken: true,
			serverSideFallback: false,
			claudeCodeVersion: identity.version
		};
	}
	const serverSideFallback = supportsAnthropicServerSideFallback(model);
	if (serverSideFallback) betaFeatures.push(ANTHROPIC_SERVER_SIDE_FALLBACK_BETA);
	const sessionAffinityHeaders = sessionId && getAnthropicCompat(model).sendSessionAffinityHeaders ? { "x-session-affinity": sessionId } : {};
	const defaultHeaders = mergeHeaders({
		accept: "application/json",
		"anthropic-dangerous-direct-browser-access": "true",
		...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
	}, sessionAffinityHeaders, model.headers, optionsHeaders);
	return {
		client: new Anthropic({
			apiKey,
			authToken: null,
			baseURL: model.baseUrl,
			dangerouslyAllowBrowser: true,
			defaultHeaders,
			fetch,
			maxRetries: 0
		}),
		isOAuthToken: false,
		serverSideFallback,
		directApiKeyBetaHeader: isDirectAnthropicModel(model) ? Object.entries(defaultHeaders).findLast(([name]) => name.toLowerCase() === "anthropic-beta")?.[1] ?? "" : void 0
	};
}
async function buildParams(model, context, isOAuthTokenResult, options, serverSideFallback = false, claudeCodeVersion) {
	const replayThinkingEnabled = requiresClaudeAdaptiveThinking(model) || options?.thinkingEnabled === true;
	const { cacheControl, supportsCacheControlOnTools } = resolveAnthropicCacheOptions(model, options?.cacheRetention);
	const system = buildAnthropicSystemBlocks(context.systemPrompt, isOAuthTokenResult, cacheControl, claudeCodeVersion);
	const compat = getAnthropicCompat(model);
	const convertedTools = context.tools ? convertAnthropicTools(context.tools, isOAuthTokenResult, compat.supportsEagerToolInputStreaming) : void 0;
	const tools = convertedTools?.tools;
	const toolProjection = convertedTools?.projection;
	const replayPlan = buildAnthropicReplayPlan(context.messages, model, {
		enabled: !isOAuthTokenResult && options?.anthropicServerCompaction === true,
		authProfileId: options?.authProfileId,
		sessionId: options?.sessionId
	});
	const cacheBreakpointOptOutMessageIndexes = /* @__PURE__ */ new Set();
	const params = {
		model: model.id,
		messages: await convertAnthropicMessages(transformProviderMessages(replayPlan.messages, model, normalizeAnthropicToolCallId), model, isOAuthTokenResult, {
			profile: "provider",
			allowEmptySignature: compat.allowEmptySignature,
			compaction: replayPlan.compaction,
			replayThinkingEnabled,
			cacheBreakpointOptOutMessageIndexes
		}),
		max_tokens: options?.maxTokens ?? model.maxTokens,
		stream: true
	};
	if (system) params.system = system;
	if (serverSideFallback) params.fallbacks = ANTHROPIC_SERVER_SIDE_FALLBACKS;
	Object.assign(params, buildAnthropicGenerationParams({
		model,
		options,
		tools,
		toolProjection,
		profile: "provider"
	}));
	applyAnthropicRequestCacheControl(params, cacheControl, supportsCacheControlOnTools, cacheBreakpointOptOutMessageIndexes);
	return {
		params,
		toolProjection,
		usedCompactionReplay: replayPlan.compaction !== void 0
	};
}
function shouldUseFineGrainedToolStreamingBeta(model, context) {
	return Boolean(context.tools?.length) && !getAnthropicCompat(model).supportsEagerToolInputStreaming;
}
//#endregion
export { streamAnthropic as n, streamSimpleAnthropic as r, anthropic_exports as t };
