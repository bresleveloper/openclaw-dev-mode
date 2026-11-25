import { n as __exportAll } from "./rolldown-runtime-DYf_mQCB.mjs";
import { D as supportsClaudeAdaptiveThinking } from "./src-Ii137Gdc.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-Bf6cK7-d.mjs";
import { _ as buildAnthropicClaudeCodeIdentity, a as resolveAiTransportHeaderSentinels, r as getAiTransportHost, x as prepareClaudeNoPrefillRequestContext } from "./host-Dm4e6L6R.mjs";
import { a as streamFragmentError } from "./transport-utils-J6TkTVN5.mjs";
import { B as omitFoundryBearerCredentialHeaders, M as supportsAnthropicServerSideFallback, T as isDirectAnthropicModel, V as usesFoundryBearerAuth, n as applyAnthropicThinkingOptions, t as runAnthropicStreamLifecycle, z as isAnthropicOAuthApiKey } from "./anthropic-stream-lifecycle-D35hUdKq.mjs";
import { n as resolveCacheRetention, t as buildCopilotDynamicHeaders } from "./github-copilot-headers-CqLRrd-i.mjs";
import { n as buildBaseOptions, r as clampMaxTokensToModel } from "./simple-options-Bet1Zroc.mjs";
import { k as parseJsonWithRepair } from "./transport-stream-shared-DPUASGj0.mjs";
import { n as getEnvApiKey } from "./env-api-keys-DlUbTgKq.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-v1liRqNt.mjs";
import { withModelRequestBodyBytes } from "./internal/model-request-body.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-Czm9tjAm.mjs";
import { t as requireApiKey } from "./required-api-key-BniLGxy4.mjs";
import { n as resolveCloudflareBaseUrl } from "./cloudflare-BCLfDuew.mjs";
import { Stream } from "@anthropic-ai/sdk/core/streaming.js";
// packages/ai/src/providers/anthropic.ts
var anthropic_exports = /* @__PURE__ */ __exportAll({
	streamAnthropic: () => streamAnthropic,
	streamSimpleAnthropic: () => streamSimpleAnthropic
});
const FINE_GRAINED_TOOL_STREAMING_BETA = "fine-grained-tool-streaming-2025-05-14";
const INTERLEAVED_THINKING_BETA = "interleaved-thinking-2025-05-14";
const ANTHROPIC_MIN_THINKING_BUDGET_TOKENS = 1024;
let anthropicSdkModule;
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
	let requestOptions = options;
	if (options?.thinkingEnabled === true && !supportsClaudeAdaptiveThinking(model)) {
		const budgetTokens = options.thinkingBudgetTokens ?? ANTHROPIC_MIN_THINKING_BUDGET_TOKENS;
		const maxTokens = options.maxTokens ?? model.maxTokens;
		if (!(budgetTokens >= ANTHROPIC_MIN_THINKING_BUDGET_TOKENS && budgetTokens < maxTokens)) requestOptions = {
			...options,
			thinkingEnabled: false,
			thinkingBudgetTokens: void 0
		};
	}
	runAnthropicStreamLifecycle({
		model,
		stream,
		options: requestOptions,
		profile: "provider",
		prepare: async () => {
			let client = requestOptions?.client;
			let isOAuthToken = false;
			let serverSideFallback = false;
			let directApiKeyBetaHeader;
			let claudeCodeVersion;
			if (!client) {
				const apiKey = requestOptions?.apiKey ?? getEnvApiKey(model.provider) ?? "";
				const dynamicHeaders = model.provider === "github-copilot" ? buildCopilotDynamicHeaders(requestContext.messages) : void 0;
				const sessionId = (requestOptions?.cacheRetention ?? resolveCacheRetention()) === "none" ? void 0 : requestOptions?.sessionId;
				const thinkingEnabled = requestOptions?.thinkingEnabled === true;
				const interleavedThinking = requestOptions?.interleavedThinking ?? true;
				const useFineGrainedToolStreamingBeta = Boolean(requestContext.tools?.length) && !getAnthropicCompat(model).supportsEagerToolInputStreaming;
				const optionsHeaders = resolveOpencodeSessionHeaders(model, requestOptions);
				const needsInterleavedBeta = interleavedThinking && !supportsClaudeAdaptiveThinking(model);
				const betaFeatures = [];
				if (useFineGrainedToolStreamingBeta) betaFeatures.push(FINE_GRAINED_TOOL_STREAMING_BETA);
				if (needsInterleavedBeta) betaFeatures.push(INTERLEAVED_THINKING_BETA);
				const fetchOptions = /^kimi(?:-|$)/.test(model.provider) && thinkingEnabled ? { sanitizeSse: false } : void 0;
				const modelFetch = getAiTransportHost().buildModelFetch(model, void 0, fetchOptions);
				const clientOptions = {
					baseURL: model.baseUrl,
					dangerouslyAllowBrowser: true,
					fetch: modelFetch ? withModelRequestBodyBytes(requestOptions, modelFetch) : void 0,
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
				const { default: Anthropic } = await (anthropicSdkModule ??= import("@anthropic-ai/sdk"));
				client = new Anthropic({
					...clientOptions,
					apiKey: configuredApiKey,
					authToken,
					defaultHeaders
				});
			}
			return {
				isOAuthToken,
				serverSideFallback,
				directApiKeyBetaHeader,
				claudeCodeVersion,
				context: requestContext,
				options: requestOptions,
				request: async (body, headers) => {
					const response = await client.messages.create(body, {
						...requestOptions?.signal ? { signal: requestOptions.signal } : {},
						...requestOptions?.timeoutMs !== void 0 ? { timeout: requestOptions.timeoutMs } : {},
						maxRetries: 0,
						headers
					}).asResponse();
					return {
						response,
						events: iterateAnthropicEvents(response, requestOptions?.signal)
					};
				}
			};
		}
	});
	return stream;
};
const streamSimpleAnthropic = (model, context, options) => {
	const apiKey = requireApiKey(model.provider, options?.apiKey);
	const base = {
		...buildBaseOptions(model, options, apiKey),
		anthropicServerCompaction: options?.anthropicServerCompaction,
		anthropicCompactThreshold: options?.anthropicCompactThreshold,
		cacheTtlPruning: options?.cacheTtlPruning,
		onCompactionRejected: options?.onCompactionRejected,
		onClaudeCodeVersionRequired: options?.onClaudeCodeVersionRequired,
		onFastModeUnsupported: options?.onFastModeUnsupported,
		authProfileId: options?.authProfileId,
		maxTokens: clampMaxTokensToModel(model, options?.maxTokens ?? model.maxTokens),
		toolChoice: options?.toolChoice,
		thinkingDisplay: options?.thinkingDisplay
	};
	applyAnthropicThinkingOptions(model, base, options, "provider");
	return streamAnthropic(model, context, base);
};
export { streamAnthropic as n, streamSimpleAnthropic as r, anthropic_exports as t };
