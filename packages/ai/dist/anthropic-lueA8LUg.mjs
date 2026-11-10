import { n as __exportAll } from "./rolldown-runtime-B4iAMlE-.mjs";
import { w as supportsClaudeAdaptiveThinking } from "./src-CyA0zJnt.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-X2gmsUWv.mjs";
import { T as usesClaudeStreamingRefusalContract, _ as buildAnthropicClaudeCodeIdentity, a as resolveAiTransportHeaderSentinels, b as prepareClaudeNoPrefillRequestContext, r as getAiTransportHost } from "./host-CWt55nnF.mjs";
import { s as streamFragmentError } from "./transport-utils-DwOpuTjL.mjs";
import { F as supportsAnthropicServerSideFallback, H as isAnthropicOAuthApiKey, O as isDirectAnthropicModel, U as omitFoundryBearerCredentialHeaders, W as usesFoundryBearerAuth, d as applyAnthropicThinkingOptions, l as buildAnthropicRequest, t as consumeAnthropicStream, u as prepareAnthropicRequest, x as suppressAnthropicCompaction, y as isAnthropicReplayRejection } from "./anthropic-stream-reducer-yWDb5Cct.mjs";
import { i as resolveCacheRetention, n as resolveCloudflareBaseUrl, r as buildCopilotDynamicHeaders } from "./cloudflare-Dttf8jKq.mjs";
import { n as buildBaseOptions, r as clampMaxTokensToModel } from "./simple-options-xJkqrG_E.mjs";
import { D as parseJsonWithRepair, m as notifyProviderHttpResponse, n as assignTransportErrorDetails, u as finalizeTransportStream } from "./transport-stream-shared-lhgkTOz3.mjs";
import { n as getEnvApiKey } from "./env-api-keys-Xd8dm_aV.mjs";
import { t as createDeferredEventBuffer } from "./deferred-event-buffer-DAvyP7qA.mjs";
import { t as createAssistantOutput } from "./assistant-output-BnQm3fov.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-CfMuh5cC.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-DA4WHv1h.mjs";
import { t as requireApiKey } from "./required-api-key-D088S4Cd.mjs";
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
			throw streamFragmentError(error);
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
			const { client, isOAuthToken, serverSideFallback, directApiKeyBetaHeader, claudeCodeVersion } = createClient(model, requestContext, requestOptions);
			const builtParams = await buildAnthropicRequest(model, requestContext, requestOptions, "provider", isOAuthToken, serverSideFallback, claudeCodeVersion);
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
				isOAuthToken,
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
			for (const block of output.content) delete block.index;
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
	applyAnthropicThinkingOptions(model, base, options, "provider");
	return streamAnthropic(model, context, base);
};
function createClient(model, context, options) {
	if (options?.client) return {
		client: options.client,
		isOAuthToken: false,
		serverSideFallback: false
	};
	const apiKey = options?.apiKey ?? getEnvApiKey(model.provider) ?? "";
	const dynamicHeaders = model.provider === "github-copilot" ? buildCopilotDynamicHeaders(context.messages) : void 0;
	const sessionId = (options?.cacheRetention ?? resolveCacheRetention()) === "none" ? void 0 : options?.sessionId;
	const thinkingEnabled = options?.thinkingEnabled === true;
	const interleavedThinking = options?.interleavedThinking ?? true;
	const useFineGrainedToolStreamingBeta = Boolean(context.tools?.length) && !getAnthropicCompat(model).supportsEagerToolInputStreaming;
	const optionsHeaders = resolveOpencodeSessionHeaders(model, options);
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
