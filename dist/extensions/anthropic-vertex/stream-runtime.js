import { resolveAnthropicVertexAdcCredentials, resolveAnthropicVertexProjectId } from "./region.js";
import { resolveAnthropicVertexClientRegion } from "./region-endpoint.js";
import { requiresClaudeMandatoryAdaptiveThinking, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet5ModelIdentity, supportsClaudeAdaptiveThinking, supportsClaudeNativeXhighEffort } from "openclaw/plugin-sdk/provider-model-shared";
import { AnthropicVertex } from "@anthropic-ai/vertex-sdk";
import { GoogleAuth } from "google-auth-library";
import { adjustMaxTokensForThinking, stream } from "openclaw/plugin-sdk/llm";
import { resolveAnthropicThinkingEffort } from "openclaw/plugin-sdk/provider-stream-shared";
import { copyProviderAcceptanceObserver } from "openclaw/plugin-sdk/provider-transport-runtime";
import { EnvHttpProxyAgent, fetch } from "undici";
//#region extensions/anthropic-vertex/stream-runtime.ts
/**
* Anthropic Vertex stream runtime. It constructs Vertex SDK clients and adapts
* OpenClaw stream options for the shared Anthropic Messages transport.
*/
const GOOGLE_CLOUD_PLATFORM_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
let googleAuthDispatcher;
const googleAuthFetch = (input, init) => {
	googleAuthDispatcher ??= new EnvHttpProxyAgent();
	const fetchInit = { ...init };
	delete fetchInit.agent;
	fetchInit.dispatcher = googleAuthDispatcher;
	return fetch(input, fetchInit);
};
const defaultAnthropicVertexStreamDeps = {
	AnthropicVertex,
	GoogleAuth,
	streamAnthropic: stream
};
function resolveAnthropicVertexMaxTokens(params) {
	const modelMax = typeof params.modelMaxTokens === "number" && Number.isFinite(params.modelMaxTokens) && params.modelMaxTokens > 0 ? Math.floor(params.modelMaxTokens) : void 0;
	const requested = typeof params.requestedMaxTokens === "number" && Number.isFinite(params.requestedMaxTokens) && params.requestedMaxTokens > 0 ? Math.floor(params.requestedMaxTokens) : void 0;
	if (modelMax !== void 0 && requested !== void 0) return Math.min(requested, modelMax);
	return requested ?? modelMax;
}
/**
* Create a StreamFn that routes through OpenClaw's generic model stream with an
* injected `AnthropicVertex` client.  All streaming, message conversion, and
* event handling is handled by the shared model runtime - we only supply the GCP-authenticated
* client and provider transport options.
*/
function createAnthropicVertexStreamFn(projectId, region, baseURL, deps = defaultAnthropicVertexStreamDeps, env = process.env) {
	const adcConfig = resolveAnthropicVertexAdcCredentials(env);
	const googleAuth = new deps.GoogleAuth({
		scopes: [GOOGLE_CLOUD_PLATFORM_SCOPE],
		...adcConfig ? { credentials: adcConfig } : {},
		clientOptions: { transporterOptions: { fetchImplementation: googleAuthFetch } }
	});
	const client = new deps.AnthropicVertex({
		googleAuth,
		region,
		...baseURL ? { baseURL } : {},
		...projectId ? { projectId } : {}
	});
	return (model, context, options) => {
		const transportModel = model.api === "anthropic-messages" ? model : {
			...model,
			api: "anthropic-messages"
		};
		const maxTokens = resolveAnthropicVertexMaxTokens({
			modelMaxTokens: transportModel.maxTokens,
			requestedMaxTokens: options?.maxTokens
		});
		const adaptiveDefaultClaude5 = resolveClaudeSonnet5ModelIdentity(transportModel) !== void 0 || resolveClaudeOpus5ModelIdentity(transportModel) !== void 0;
		const mandatoryAdaptiveThinking = requiresClaudeMandatoryAdaptiveThinking(transportModel);
		const adaptiveModel = supportsClaudeAdaptiveThinking(transportModel);
		const requestedReasoning = options?.reasoning;
		const reasoning = requestedReasoning === "off" && mandatoryAdaptiveThinking ? "low" : requestedReasoning ?? (adaptiveDefaultClaude5 ? "high" : void 0);
		const temperature = mandatoryAdaptiveThinking || Boolean(reasoning && reasoning !== "off" && adaptiveModel) || supportsClaudeNativeXhighEffort(transportModel) ? void 0 : options?.temperature;
		const opts = copyProviderAcceptanceObserver(options, {
			client,
			thinkingEnabled: mandatoryAdaptiveThinking,
			...temperature !== void 0 ? { temperature } : {},
			...maxTokens !== void 0 ? { maxTokens } : {},
			signal: options?.signal,
			cacheRetention: options?.cacheRetention,
			sessionId: options?.sessionId,
			headers: options?.headers,
			onPayload: options?.onPayload,
			onResponse: options?.onResponse,
			maxRetryDelayMs: options?.maxRetryDelayMs,
			metadata: options?.metadata
		});
		if (reasoning === "off") opts.thinkingEnabled = false;
		else if (reasoning) {
			if (adaptiveModel) {
				opts.thinkingEnabled = true;
				opts.effort = resolveAnthropicThinkingEffort(transportModel, reasoning);
			} else {
				const adjusted = adjustMaxTokensForThinking(maxTokens, transportModel.maxTokens, reasoning, options?.thinkingBudgets);
				opts.thinkingEnabled = adjusted.thinkingBudget >= 1024;
				if (opts.thinkingEnabled) {
					opts.maxTokens = adjusted.maxTokens;
					opts.thinkingBudgetTokens = adjusted.thinkingBudget;
				}
			}
		}
		return deps.streamAnthropic(transportModel, context, opts);
	};
}
function resolveAnthropicVertexSdkBaseUrl(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return;
	try {
		const url = new URL(trimmed);
		const normalizedPath = url.pathname.replace(/\/+$/, "");
		if (!normalizedPath || normalizedPath === "") {
			url.pathname = "/v1";
			return url.toString().replace(/\/$/, "");
		}
		if (!normalizedPath.endsWith("/v1")) {
			url.pathname = `${normalizedPath}/v1`;
			return url.toString().replace(/\/$/, "");
		}
		return trimmed;
	} catch {
		return trimmed;
	}
}
/** Create an Anthropic Vertex stream function from model metadata and env. */
function createAnthropicVertexStreamFnForModel(model, env = process.env, deps) {
	return createAnthropicVertexStreamFn(resolveAnthropicVertexProjectId(env), resolveAnthropicVertexClientRegion({
		baseUrl: model.baseUrl,
		env
	}), resolveAnthropicVertexSdkBaseUrl(model.baseUrl), deps, env);
}
//#endregion
export { createAnthropicVertexStreamFn, createAnthropicVertexStreamFnForModel };
