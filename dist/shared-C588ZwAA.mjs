import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as createLazyRuntimeSurface, r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./provider-model-metadata-fSBArSt7.mjs";
import { i as classifyOpenAIBaseUrl, o as isOpenAICodexBaseUrl } from "./base-url-BUR_8zW8.mjs";
import "./token-sharing-CmBELw8t.mjs";
import { t as buildOpenAIReplayPolicy } from "./replay-policy-DfBv3KeY.mjs";
import { t as resolveOpenAITransportTurnState } from "./transport-policy-B__dyFbb.mjs";
//#region extensions/openai/shared.ts
const OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS = 272e3;
function resolveConfiguredOpenAIBaseUrl(cfg) {
	return normalizeOptionalString(cfg?.models?.providers?.openai?.baseUrl) ?? "https://api.openai.com/v1";
}
const loadResponsesStream = createLazyRuntimeModule(() => import("./extensions/openai/responses-stream.runtime.js"));
const wrapOpenAIResponsesProviderStreamFn = (ctx) => {
	const loadStream = createLazyRuntimeSurface(loadResponsesStream, (runtime) => runtime.wrapOpenAIResponsesStream(ctx));
	return async (...args) => (await loadStream())(...args);
};
function buildOpenAIResponsesProviderHooks(options) {
	return {
		isCacheTtlEligible: ({ provider, baseUrl, supportsPromptCacheKey }) => normalizeProviderId(provider) === "openai" && (supportsPromptCacheKey ?? (classifyOpenAIBaseUrl(baseUrl) === "platform" || isOpenAICodexBaseUrl(baseUrl))),
		buildReplayPolicy: buildOpenAIReplayPolicy,
		prepareExtraParams: ({ extraParams }) => {
			const transport = extraParams?.transport;
			return [
				"auto",
				"sse",
				"websocket",
				"websocket-cached"
			].some((candidate) => candidate === transport) ? extraParams : {
				...extraParams,
				transport: options?.transport ?? "auto"
			};
		},
		wrapStreamFn: wrapOpenAIResponsesProviderStreamFn,
		wrapSimpleCompletionStreamFn: (ctx) => ctx.auth?.mode === "oauth" && ctx.auth.authFlow === "chatgpt-token-sharing" ? wrapOpenAIResponsesProviderStreamFn({
			...ctx,
			nativeWebSearchAllowedByToolPolicy: false
		}) : void 0,
		resolveTransportTurnState: resolveOpenAITransportTurnState
	};
}
//#endregion
export { buildOpenAIResponsesProviderHooks as n, resolveConfiguredOpenAIBaseUrl as r, OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS as t };
