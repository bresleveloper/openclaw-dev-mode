import { r as resolveNativeWebSearch } from "./provider-policy-api-DWXY9AyL.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
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
function raiseMinimalReasoningForOpenAINativeWebSearch(payload) {
	const reasoning = payload.reasoning;
	if (!isRecord(reasoning) || reasoning.effort !== "minimal") return;
	reasoning.effort = "low";
}
function patchOpenAINativeWebSearchPayload(payload) {
	if (!isRecord(payload)) return "payload_not_object";
	const existingTools = Array.isArray(payload.tools) ? payload.tools : [];
	const filteredTools = existingTools.filter((tool) => !isManagedWebSearchTool(tool));
	if (filteredTools.some(isNativeWebSearchTool)) {
		if (filteredTools.length !== existingTools.length) payload.tools = filteredTools;
		raiseMinimalReasoningForOpenAINativeWebSearch(payload);
		return "native_tool_already_present";
	}
	payload.tools = [...filteredTools, OPENAI_WEB_SEARCH_TOOL];
	raiseMinimalReasoningForOpenAINativeWebSearch(payload);
	return "injected";
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
function wrapOpenAIResponsesStream(ctx) {
	return createOpenAINativeWebSearchWrapper(wrapStreamFn?.(ctx) ?? ctx.streamFn, {
		config: ctx.config,
		agentId: ctx.agentId,
		nativeWebSearchAllowedByToolPolicy: ctx.nativeWebSearchAllowedByToolPolicy
	});
}
//#endregion
export { wrapOpenAIResponsesStream };
