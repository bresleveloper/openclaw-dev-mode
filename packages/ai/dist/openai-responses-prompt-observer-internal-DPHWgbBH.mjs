import { o as isRecord } from "./record-coerce-DwRYMj3t.mjs";
import { d as supportsOpenAITemperature, i as isOpenAIGpt6Model, m as resolveOpenAIThinkingApi } from "./openai-reasoning-effort-ash8dPrd.mjs";
import { r as resolveOpenAIPromptCacheParams } from "./openai-prompt-cache-CjV_2IRI.mjs";
import { o as usesNativeOpenAICodexResponsesBackend } from "./openai-completions-compat-CUollwl6.mjs";
import { r as resolveOpenAIStrictToolSetting } from "./host-policy-DZO3oPPk.mjs";
import { t as resolveCacheRetention } from "./cache-retention-0x979a5V.mjs";
import { m as stripSystemPromptCacheBoundary } from "./simple-options-np1XPuhm.mjs";
import { A as resolvePromptCacheKey, g as resolveOpenAISimpleReasoningEffort, h as resolveOpenAIRequestReasoning, m as reconcileOpenAIResponsesToolChoice, s as getCompat } from "./openai-transport-params-DZKOTSfH.mjs";
import { _ as sanitizeTransportPayloadText } from "./transport-stream-shared-B5RioB_Q.mjs";
import { h as responsesPromptObserver, r as OPENAI_CODEX_RESPONSES_DEFAULT_INSTRUCTIONS } from "./openai-responses-contracts-DWrfMODE.mjs";
import { a as applyOpenAIResponsesPayloadPolicy, s as resolveOpenAIResponsesPayloadPolicy } from "./openai-responses-compaction-window-BiNCT0bS.mjs";
import { F as convertResponsesMessages, P as buildResponsesInputMessage, s as prepareResponsesTools } from "./openai-responses-shared-DvSqtJ6_.mjs";
//#region packages/ai/src/transports/openai-responses-params-internal.ts
const OPENAI_RESPONSES_TOOL_CALL_PROVIDERS = /* @__PURE__ */ new Set([
	"openai",
	"opencode",
	"azure-openai-responses",
	"github-copilot"
]);
function hasResponsesWebSearchTool(tools) {
	if (!Array.isArray(tools)) return false;
	return tools.some((tool) => {
		if (!isRecord(tool)) return false;
		if (tool.type === "web_search") return true;
		if (tool.type === "function" && tool.name === "web_search") return true;
		const fn = tool.function;
		return isRecord(fn) && fn.name === "web_search";
	});
}
function raiseMinimalReasoningForResponsesWebSearch(params) {
	if (params.effort !== "minimal" || !hasResponsesWebSearchTool(params.tools)) return params.effort;
	for (const effort of [
		"low",
		"medium",
		"high"
	]) {
		const resolved = resolveOpenAIRequestReasoning(params.model, effort).effort;
		if (resolved && resolved !== "none" && resolved !== "minimal") return resolved;
	}
	return params.effort;
}
const OPENAI_CODEX_RESPONSES_UNSUPPORTED_PARAMS = [
	"max_output_tokens",
	"metadata",
	"prompt_cache_retention",
	"prompt_cache_options",
	"service_tier",
	"temperature",
	"top_p"
];
function stripOpenAICodexResponsesUnsupportedTextFields(params) {
	const text = params.text;
	if (!text || typeof text !== "object" || Array.isArray(text)) return;
	const sanitizedText = { ...text };
	delete sanitizedText.format;
	if (Object.keys(sanitizedText).length > 0) params.text = sanitizedText;
	else delete params.text;
}
function sanitizeOpenAICodexResponsesParams(model, params) {
	if (!usesNativeOpenAICodexResponsesBackend(model)) return params;
	for (const key of OPENAI_CODEX_RESPONSES_UNSUPPORTED_PARAMS) delete params[key];
	Object.assign(params, { store: false });
	stripOpenAICodexResponsesUnsupportedTextFields(params);
	return params;
}
function buildOpenAIResponsesInstructionsText(context) {
	if (!context.systemPrompt) return;
	return sanitizeTransportPayloadText(stripSystemPromptCacheBoundary(context.systemPrompt));
}
function resolveOpenAIResponsesInstructions(model, context, usesInstructionsField) {
	if (!usesInstructionsField) return;
	const instructions = buildOpenAIResponsesInstructionsText(context);
	if (instructions && instructions.trim().length > 0) return instructions;
	return usesNativeOpenAICodexResponsesBackend(model) ? OPENAI_CODEX_RESPONSES_DEFAULT_INSTRUCTIONS : void 0;
}
function buildOpenAIResponsesCompactSystemMessage(model, instructions) {
	const compat = getCompat(model);
	const supportsDeveloperRole = typeof compat.supportsDeveloperRole === "boolean" ? compat.supportsDeveloperRole : void 0;
	const role = model.reasoning && supportsDeveloperRole !== false ? "developer" : "system";
	return buildResponsesInputMessage(role, [{
		type: "input_text",
		text: instructions
	}]);
}
function ensureOpenAIResponsesNonEmptyInput(messages, context) {
	if (messages.length > 0 || !context.systemPrompt) return;
	if (!buildOpenAIResponsesInstructionsText(context)) throw new Error("OpenAI Responses requires non-empty input when only systemPrompt is provided.");
	messages.push(buildResponsesInputMessage("user", [{
		type: "input_text",
		text: " "
	}]));
}
function resolveOpenAIResponsesTextFormat(responseFormat) {
	if (responseFormat.type === "json_schema" && responseFormat.json_schema && typeof responseFormat.json_schema === "object" && !Array.isArray(responseFormat.json_schema)) return {
		...responseFormat.json_schema,
		type: "json_schema"
	};
	return responseFormat;
}
function buildOpenAIResponsesParams(model, context, options, metadata, replayMode = "checkpoint") {
	const payloadPolicy = resolveOpenAIResponsesPayloadPolicy(model, { storeMode: "transport-default" });
	const policyAllowsReplayIds = payloadPolicy.explicitStore !== false && !payloadPolicy.shouldStripStore;
	const replayResponsesItemIds = !usesNativeOpenAICodexResponsesBackend(model) && (options?.replayResponsesItemIds ?? policyAllowsReplayIds);
	const messages = convertResponsesMessages(model, context, OPENAI_RESPONSES_TOOL_CALL_PROVIDERS, {
		includeSystemPrompt: !payloadPolicy.usesInstructionsField,
		replayReasoningItems: true,
		replayResponsesItemIds,
		authProfileId: options?.authProfileId,
		sessionId: options?.sessionId,
		replayMode
	});
	ensureOpenAIResponsesNonEmptyInput(messages, context);
	const cacheRetention = resolveCacheRetention(options?.cacheRetention);
	const compat = getCompat(model);
	const promptCacheKey = compat.supportsPromptCacheKey ? resolvePromptCacheKey(options, cacheRetention) : void 0;
	const instructions = resolveOpenAIResponsesInstructions(model, context, payloadPolicy.usesInstructionsField);
	const params = {
		model: model.id,
		input: messages,
		stream: true,
		prompt_cache_key: promptCacheKey,
		...resolveOpenAIPromptCacheParams(model, cacheRetention, compat),
		...instructions ? { instructions } : {},
		...metadata ? { metadata } : {}
	};
	const effectiveMaxTokens = options?.maxTokens || model.maxTokens;
	if (effectiveMaxTokens) params.max_output_tokens = Math.max(effectiveMaxTokens, 16);
	if (options?.temperature !== void 0 && supportsOpenAITemperature(model)) params.temperature = options.temperature;
	if (options?.topP !== void 0 && (!isOpenAIGpt6Model(model) || resolveOpenAIThinkingApi(model.api) === "azure-openai-responses")) params.top_p = options.topP;
	if (options?.responseFormat !== void 0) params.text = {
		...params.text,
		format: resolveOpenAIResponsesTextFormat(options.responseFormat)
	};
	if (options?.serviceTier !== void 0 && payloadPolicy.allowsServiceTier) params.service_tier = options.serviceTier;
	if (context.tools) {
		const tools = context.tools;
		const strict = resolveOpenAIStrictToolSetting(model, {
			transport: "stream",
			supportsStrictMode: compat.supportsStrictMode
		});
		const { projection, tools: converted } = prepareResponsesTools(tools, strict, model);
		if (converted.length > 0 || projection.inputToolCount === 0 && projection.diagnostics.length === 0) params.tools = converted;
		if (options?.toolChoice) {
			const toolChoice = reconcileOpenAIResponsesToolChoice(options.toolChoice, projection);
			if (toolChoice !== void 0) params.tool_choice = toolChoice;
		}
	}
	if (model.reasoning) {
		const reasoning = options?.reasoning;
		const requestedEffort = options?.reasoningEffort ?? (reasoning === "none" ? "none" : resolveOpenAISimpleReasoningEffort(model, reasoning)) ?? (options?.reasoningSummary ? "high" : payloadPolicy.defaultManagedReasoningEffort);
		const resolvedEffort = requestedEffort === void 0 ? void 0 : resolveOpenAIRequestReasoning(model, requestedEffort).effort;
		if (resolvedEffort !== void 0) {
			const effort = raiseMinimalReasoningForResponsesWebSearch({
				model,
				effort: resolvedEffort,
				tools: params.tools
			});
			const summary = effort !== "none" && (options?.reasoningEffort || options?.reasoning || options?.reasoningSummary) ? options.reasoningSummary || "auto" : void 0;
			params.reasoning = {
				effort,
				...summary ? { summary } : {}
			};
			if (summary) params.include = ["reasoning.encrypted_content"];
		}
	}
	applyOpenAIResponsesPayloadPolicy(params, payloadPolicy);
	return sanitizeOpenAICodexResponsesParams(model, params);
}
//#endregion
//#region packages/ai/src/transports/openai-responses-prompt-observer-internal.ts
function readFinalResponsesPrompt(request) {
	if (typeof request.instructions === "string") return ["instructions", request.instructions];
	const message = (Array.isArray(request.input) ? request.input : []).find((item) => {
		const role = item.role;
		return role === "developer" || role === "system";
	});
	if (!message) return ["missing", ""];
	const content = message.content;
	const observedPrompt = typeof content === "string" ? content : Array.isArray(content) ? content.flatMap((part) => part.type === "input_text" ? [part.text] : []).join("") : "";
	return [message.role === "developer" ? "input.developer" : "input.system", observedPrompt];
}
function createResponsesPromptEgressObserver(options, assembledPrompt) {
	const observer = options ? responsesPromptObserver.get(options) : void 0;
	if (!observer) return;
	const expectedPrompt = sanitizeTransportPayloadText(stripSystemPromptCacheBoundary(assembledPrompt ?? ""));
	return (request, metadata) => {
		const [promptSource, observedPrompt] = readFinalResponsesPrompt(request);
		observer({
			...metadata,
			promptSource,
			expectedChars: expectedPrompt.length,
			observedChars: observedPrompt.length,
			matchesAssembledPrompt: promptSource !== "missing" && observedPrompt === expectedPrompt
		});
	};
}
//#endregion
export { sanitizeOpenAICodexResponsesParams as a, resolveOpenAIResponsesTextFormat as i, buildOpenAIResponsesCompactSystemMessage as n, buildOpenAIResponsesParams as r, createResponsesPromptEgressObserver as t };
