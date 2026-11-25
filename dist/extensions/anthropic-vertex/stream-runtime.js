import { resolveAnthropicVertexAdcCredentials, resolveAnthropicVertexProjectId } from "./region.js";
import { resolveAnthropicVertexClientRegion } from "./region-endpoint.js";
import { requiresClaudeMandatoryAdaptiveThinking, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet5ModelIdentity } from "openclaw/plugin-sdk/provider-model-shared";
import { AnthropicVertex } from "@anthropic-ai/vertex-sdk";
import { GoogleAuth } from "google-auth-library";
import { stream } from "openclaw/plugin-sdk/llm";
import { applyAnthropicThinkingOptions, clampMaxTokensToModel, copyProviderAcceptanceObserver } from "openclaw/plugin-sdk/provider-transport-runtime";
import { EnvHttpProxyAgent, fetch } from "undici";
// extensions/anthropic-vertex/stream-runtime.ts
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
		const adaptiveDefaultClaude5 = resolveClaudeSonnet5ModelIdentity(transportModel) !== void 0 || resolveClaudeOpus5ModelIdentity(transportModel) !== void 0;
		const reasoning = options?.reasoning ?? (adaptiveDefaultClaude5 ? "high" : requiresClaudeMandatoryAdaptiveThinking(transportModel) ? void 0 : "off");
		const opts = copyProviderAcceptanceObserver(options, {
			client,
			...options?.temperature !== void 0 ? { temperature: options.temperature } : {},
			maxTokens: Math.floor(clampMaxTokensToModel(transportModel, options?.maxTokens ?? transportModel.maxTokens)),
			signal: options?.signal,
			cacheRetention: options?.cacheRetention,
			sessionId: options?.sessionId,
			headers: options?.headers,
			onPayload: options?.onPayload,
			onResponse: options?.onResponse,
			maxRetryDelayMs: options?.maxRetryDelayMs,
			metadata: options?.metadata
		});
		applyAnthropicThinkingOptions(transportModel, opts, {
			reasoning,
			thinkingBudgets: options?.thinkingBudgets
		}, "provider");
		return deps.streamAnthropic(transportModel, context, opts);
	};
}
function resolveAnthropicVertexSdkBaseUrl(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return;
	const url = URL.parse(trimmed);
	if (!url) return trimmed;
	const normalizedPath = url.pathname.replace(/\/+$/, "");
	if (!normalizedPath.endsWith("/v1")) {
		url.pathname = `${normalizedPath}/v1`;
		return url.toString().replace(/\/$/, "");
	}
	return trimmed;
}
function createAnthropicVertexStreamFnForModel(model, env = process.env, deps) {
	return createAnthropicVertexStreamFn(resolveAnthropicVertexProjectId(env), resolveAnthropicVertexClientRegion({
		baseUrl: model.baseUrl,
		env
	}), resolveAnthropicVertexSdkBaseUrl(model.baseUrl), deps, env);
}
export { createAnthropicVertexStreamFn, createAnthropicVertexStreamFnForModel };
