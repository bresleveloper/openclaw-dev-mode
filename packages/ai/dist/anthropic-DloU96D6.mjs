import { t as __exportAll } from "./rolldown-runtime-BhDjJH2R.mjs";
import { w as supportsClaudeAdaptiveThinking } from "./src-VWy9E7DZ.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-C5AbCAaZ.mjs";
import { S as resolveAnthropicThinkingEffort, T as usesClaudeStreamingRefusalContract, _ as buildAnthropicClaudeCodeIdentity, a as resolveAiTransportHeaderSentinels, b as prepareClaudeNoPrefillRequestContext, r as getAiTransportHost, v as defaultsClaudeAdaptiveThinking, x as requiresClaudeAdaptiveThinking } from "./host-u3o8XiAp.mjs";
import { a as MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE } from "./text-signature-CbqxIB8B.mjs";
import { C as isAnthropicReplayRejection, J as usesFoundryBearerAuth, K as isAnthropicOAuthApiKey, M as isDirectAnthropicModel, T as suppressAnthropicCompaction, l as buildAnthropicRequest, q as omitFoundryBearerCredentialHeaders, t as consumeAnthropicStream, u as prepareAnthropicRequest, z as supportsAnthropicServerSideFallback } from "./anthropic-stream-reducer-Djl4yqrc.mjs";
import { i as resolveCacheRetention, n as resolveCloudflareBaseUrl, r as buildCopilotDynamicHeaders } from "./cloudflare-5qSGvIUH.mjs";
import { D as parseJsonWithRepair, m as notifyProviderHttpResponse, n as assignTransportErrorDetails, u as finalizeTransportStream } from "./transport-stream-shared-CCR7hSW0.mjs";
import { n as buildBaseOptions, r as clampMaxTokensToModel, t as adjustMaxTokensForThinking } from "./simple-options-7QuSKriJ.mjs";
import { n as getEnvApiKey } from "./env-api-keys-CyX4VKGO.mjs";
import { t as createDeferredEventBuffer } from "./deferred-event-buffer-DAvyP7qA.mjs";
import { t as createAssistantOutput } from "./assistant-output-D5762GPH.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-D8f_oxHj.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-DA4WHv1h.mjs";
import { t as requireApiKey } from "./required-api-key-D4kn3252.mjs";
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
		sendSessionAffinityHeaders: model.compat?.sendSessionAffinityHeaders ?? (isFireworks || isCloudflareAiGatewayAnthropic)
	};
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
		let replayedCompaction;
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
				const copilotDynamicHeaders = model.provider === "github-copilot" ? buildCopilotDynamicHeaders(requestContext.messages) : void 0;
				const cacheSessionId = (requestOptions?.cacheRetention ?? resolveCacheRetention()) === "none" ? void 0 : requestOptions?.sessionId;
				const created = createClient(model, apiKey, requestOptions?.thinkingEnabled === true, requestOptions?.interleavedThinking ?? true, Boolean(requestContext.tools?.length) && !getAnthropicCompat(model).supportsEagerToolInputStreaming, resolveOpencodeSessionHeaders(model, requestOptions), copilotDynamicHeaders, cacheSessionId);
				client = created.client;
				isOAuth = created.isOAuthToken;
				serverSideFallback = created.serverSideFallback;
				directApiKeyBetaHeader = created.directApiKeyBetaHeader;
				claudeCodeVersion = created.claudeCodeVersion;
			}
			const builtParams = await buildAnthropicRequest(model, requestContext, requestOptions, "provider", isOAuth, serverSideFallback, claudeCodeVersion);
			replayedCompaction = builtParams.replayedCompaction;
			const { params, headers } = await prepareAnthropicRequest(builtParams.params, model, requestOptions, directApiKeyBetaHeader);
			const sdkRequestOptions = {
				...requestOptions?.signal ? { signal: requestOptions.signal } : {},
				...requestOptions?.timeoutMs !== void 0 ? { timeout: requestOptions.timeoutMs } : {},
				maxRetries: 0,
				headers
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
				toolProjection: builtParams.toolProjection,
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
			if (replayedCompaction && isAnthropicReplayRejection(error)) suppressAnthropicCompaction(output, model, requestOptions, replayedCompaction);
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
	const apiKey = requireApiKey(model.provider, options?.apiKey);
	const base = {
		...buildBaseOptions(model, options, apiKey),
		anthropicServerCompaction: options?.anthropicServerCompaction,
		anthropicCompactThreshold: options?.anthropicCompactThreshold,
		cacheTtlPruning: options?.cacheTtlPruning,
		onCompactionRejected: options?.onCompactionRejected,
		authProfileId: options?.authProfileId,
		maxTokens: clampMaxTokensToModel(model, options?.maxTokens ?? model.maxTokens),
		toolChoice: options?.toolChoice,
		thinkingDisplay: options?.thinkingDisplay
	};
	const mandatoryAdaptiveThinking = requiresClaudeAdaptiveThinking(model);
	if (options?.reasoning === "off" && !mandatoryAdaptiveThinking) return streamAnthropic(model, context, {
		...base,
		thinkingEnabled: false
	});
	const reasoning = options?.reasoning === "off" ? "low" : options?.reasoning;
	if (defaultsClaudeAdaptiveThinking(model) || reasoning && supportsClaudeAdaptiveThinking(model)) return streamAnthropic(model, context, {
		...base,
		thinkingEnabled: true,
		effort: resolveAnthropicThinkingEffort(model, reasoning)
	});
	if (!reasoning) return streamAnthropic(model, context, {
		...base,
		thinkingEnabled: mandatoryAdaptiveThinking
	});
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
function createClient(model, apiKey, thinkingEnabled, interleavedThinking, useFineGrainedToolStreamingBeta, optionsHeaders, dynamicHeaders, sessionId) {
	const needsInterleavedBeta = interleavedThinking && !supportsClaudeAdaptiveThinking(model);
	const betaFeatures = [];
	if (useFineGrainedToolStreamingBeta) betaFeatures.push(FINE_GRAINED_TOOL_STREAMING_BETA);
	if (needsInterleavedBeta) betaFeatures.push(INTERLEAVED_THINKING_BETA);
	const fetchOptions = /^kimi(?:-|$)/.test(model.provider) && thinkingEnabled ? { sanitizeSse: false } : void 0;
	const clientOptions = {
		baseURL: model.baseUrl,
		dangerouslyAllowBrowser: true,
		fetch: getAiTransportHost().buildModelFetch(model, void 0, fetchOptions),
		maxRetries: 0
	};
	const baseHeaders = {
		accept: "application/json",
		"anthropic-dangerous-direct-browser-access": "true",
		...betaFeatures.length > 0 ? { "anthropic-beta": betaFeatures.join(",") } : {}
	};
	let configuredApiKey = apiKey;
	let authToken = null;
	let defaultHeaders;
	let isOAuthToken = false;
	let serverSideFallback = false;
	let directApiKeyBetaHeader;
	let claudeCodeVersion;
	const isCopilot = model.provider === "github-copilot";
	if (model.provider === "cloudflare-ai-gateway") {
		clientOptions.baseURL = resolveCloudflareBaseUrl(model);
		defaultHeaders = Object.assign({}, baseHeaders, { Authorization: null }, model.headers, optionsHeaders);
	} else if (isCopilot || usesFoundryBearerAuth({
		...model,
		headers: resolveAiTransportHeaderSentinels(model.headers)
	})) {
		configuredApiKey = null;
		authToken = apiKey;
		defaultHeaders = Object.assign({}, baseHeaders, isCopilot ? model.headers : omitFoundryBearerCredentialHeaders(model.headers), dynamicHeaders, optionsHeaders);
	} else if (isAnthropicOAuthApiKey(apiKey)) {
		const identity = buildAnthropicClaudeCodeIdentity([
			"claude-code-20250219",
			"oauth-2025-04-20",
			...betaFeatures
		].join(","), model.headers, optionsHeaders);
		configuredApiKey = null;
		authToken = apiKey;
		defaultHeaders = identity.headers;
		isOAuthToken = true;
		claudeCodeVersion = identity.version;
	} else {
		serverSideFallback = model.provider === "anthropic" && supportsAnthropicServerSideFallback(model);
		defaultHeaders = Object.assign({}, baseHeaders, sessionId && getAnthropicCompat(model).sendSessionAffinityHeaders ? { "x-session-affinity": sessionId } : {}, model.headers, optionsHeaders);
		if (isDirectAnthropicModel(model)) directApiKeyBetaHeader = Object.entries(defaultHeaders).findLast(([name]) => name.toLowerCase() === "anthropic-beta")?.[1] ?? "";
	}
	return {
		client: new Anthropic({
			...clientOptions,
			apiKey: configuredApiKey,
			authToken,
			defaultHeaders
		}),
		isOAuthToken,
		serverSideFallback,
		directApiKeyBetaHeader,
		claudeCodeVersion
	};
}
//#endregion
export { streamAnthropic as n, streamSimpleAnthropic as r, anthropic_exports as t };
