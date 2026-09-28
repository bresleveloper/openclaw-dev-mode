import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as createLazyRuntimeSurface, r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./provider-model-metadata-GUXZiNxy.mjs";
import { i as classifyOpenAIBaseUrl, o as isOpenAICodexBaseUrl } from "./base-url-CsNC9nJ8.mjs";
import { t as buildOpenAIReplayPolicy } from "./replay-policy-DNHotlc4.mjs";
import { t as resolveOpenAITransportTurnState } from "./transport-policy-BSvH0hLr.mjs";
//#region extensions/openai/shared.ts
const OPENAI_API_BASE_URL = "https://api.openai.com/v1";
const OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS = 272e3;
function resolveConfiguredOpenAIBaseUrl(cfg) {
	return normalizeOptionalString(cfg?.models?.providers?.openai?.baseUrl) ?? OPENAI_API_BASE_URL;
}
function hasSupportedOpenAIResponsesTransport(transport) {
	return transport === "auto" || transport === "sse" || transport === "websocket" || transport === "websocket-cached";
}
function defaultOpenAIResponsesExtraParams(extraParams, options) {
	const hasSupportedTransport = hasSupportedOpenAIResponsesTransport(extraParams?.transport);
	const defaultTransport = options?.transport ?? "auto";
	if (hasSupportedTransport) return extraParams;
	return {
		...extraParams,
		transport: defaultTransport
	};
}
const resolveOpenAIResponsesTransportTurnState = (ctx) => resolveOpenAITransportTurnState(ctx);
const loadResponsesStream = createLazyRuntimeModule(() => import("./extensions/openai/responses-stream.runtime.js"));
const wrapOpenAIResponsesProviderStreamFn = (ctx) => {
	const loadStream = createLazyRuntimeSurface(loadResponsesStream, (runtime) => runtime.wrapOpenAIResponsesStream(ctx));
	return async (...args) => (await loadStream())(...args);
};
function buildOpenAIResponsesProviderHooks(options) {
	return {
		isCacheTtlEligible: ({ provider, baseUrl, supportsPromptCacheKey }) => normalizeProviderId(provider) === "openai" && (supportsPromptCacheKey ?? (classifyOpenAIBaseUrl(baseUrl) === "platform" || isOpenAICodexBaseUrl(baseUrl))),
		buildReplayPolicy: buildOpenAIReplayPolicy,
		prepareExtraParams: (ctx) => defaultOpenAIResponsesExtraParams(ctx.extraParams, options),
		wrapStreamFn: wrapOpenAIResponsesProviderStreamFn,
		resolveTransportTurnState: resolveOpenAIResponsesTransportTurnState
	};
}
function buildOpenAISyntheticCatalogEntry(template, entry) {
	if (!template) return;
	return {
		...template,
		id: entry.id,
		name: entry.id,
		reasoning: entry.reasoning,
		input: [...entry.input],
		contextWindow: entry.contextWindow,
		...entry.contextTokens === void 0 ? {} : { contextTokens: entry.contextTokens },
		...entry.cost === void 0 ? {} : { cost: entry.cost }
	};
}
//#endregion
export { resolveConfiguredOpenAIBaseUrl as i, buildOpenAIResponsesProviderHooks as n, buildOpenAISyntheticCatalogEntry as r, OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS as t };
