import { r as resolveNativeWebSearch } from "./provider-policy-api-yoLTiHQu.mjs";
import "./token-sharing-CmBELw8t.mjs";
import { asOptionalRecord, isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { streamSimple } from "openclaw/plugin-sdk/llm";
import { buildProviderStreamFamilyHooks } from "openclaw/plugin-sdk/provider-stream-family";
import { createPayloadPatchStreamWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/openai/native-web-search.ts
const OPENAI_WEB_SEARCH_TOOL = { type: "web_search" };
function isNativeWebSearchTool(tool) {
	return isRecord(tool) && tool.type === OPENAI_WEB_SEARCH_TOOL.type;
}
function isManagedWebSearchTool(tool) {
	return isRecord(tool) && tool.type === "function" && tool.name === OPENAI_WEB_SEARCH_TOOL.type;
}
function patchOpenAINativeWebSearchPayload(payload) {
	if (!isRecord(payload)) return;
	const existingTools = Array.isArray(payload.tools) ? payload.tools : [];
	const filteredTools = existingTools.filter((tool) => !isManagedWebSearchTool(tool));
	if (filteredTools.some(isNativeWebSearchTool)) {
		if (filteredTools.length !== existingTools.length) payload.tools = filteredTools;
	} else payload.tools = [...filteredTools, OPENAI_WEB_SEARCH_TOOL];
	const reasoning = payload.reasoning;
	if (isRecord(reasoning) && reasoning.effort === "minimal") reasoning.effort = "low";
}
function createOpenAINativeWebSearchWrapper(baseStreamFn, params) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload, options }) => {
		options?.openclawCodeModeAllowedHostedToolTypes?.add(OPENAI_WEB_SEARCH_TOOL.type);
		patchOpenAINativeWebSearchPayload(payload);
	}, { shouldPatch: ({ model }) => params.nativeWebSearchAllowedByToolPolicy !== false && resolveNativeWebSearch({
		config: params.config,
		provider: model.provider,
		modelId: model.id,
		api: model.api,
		baseUrl: model.baseUrl
	}) });
}
//#endregion
//#region extensions/openai/responses-stream.runtime.ts
const { wrapStreamFn } = buildProviderStreamFamilyHooks("openai-responses-defaults");
const SIWC_SERVICE_TIERS = [
	"default",
	"priority",
	"ultrafast",
	"slow"
];
function wrapOpenAIResponsesStream(ctx) {
	let streamContext = ctx;
	if (ctx.auth?.mode === "oauth" && ctx.auth.authFlow === "chatgpt-token-sharing") {
		const underlying = ctx.streamFn ?? streamSimple;
		streamContext = {
			...ctx,
			extraParams: {
				...ctx.extraParams,
				transport: "sse",
				responsesServerCompaction: false
			},
			streamFn: (model, context, options) => {
				const headers = new Headers(options?.headers);
				headers.set("x-openai-chatpass-test", "codex-direct");
				const sharingOptions = {
					...options,
					headers: Object.fromEntries(headers.entries()),
					transport: "sse",
					replayResponsesItemIds: false,
					onPayload: async (payload, payloadModel) => {
						const transformed = await options?.onPayload?.(payload, payloadModel);
						const request = asOptionalRecord(transformed ?? payload);
						if (!request) throw new Error("ChatGPT token sharing requires a Responses request object.");
						if (request.service_tier != null && !SIWC_SERVICE_TIERS.some((tier) => tier === request.service_tier)) throw new Error(`Sign in with ChatGPT does not support this service tier. Remove serviceTier/service_tier from the model params or select one of: ${SIWC_SERVICE_TIERS.join(", ")}.`);
						request.store = false;
						for (const field of [
							"context_management",
							"metadata",
							"max_output_tokens",
							"temperature",
							"top_p",
							"prompt_cache_retention"
						]) delete request[field];
						return request;
					}
				};
				return underlying(model, context, sharingOptions);
			}
		};
	}
	return createOpenAINativeWebSearchWrapper(wrapStreamFn?.(streamContext) ?? streamContext.streamFn, {
		config: ctx.config,
		nativeWebSearchAllowedByToolPolicy: ctx.nativeWebSearchAllowedByToolPolicy
	});
}
//#endregion
export { wrapOpenAIResponsesStream };
