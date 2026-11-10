import { a as IMAGE_BLOCK_TOKENS, o as calculateContextTokens } from "./agent-core-BbGXCiXw.mjs";
import { t as log } from "./logger-BpVUgEyL.mjs";
import { a as estimateStringTokenPressure, i as estimateRenderedPromptTokens, n as estimateJsonPayloadTokenPressure, o as estimateToolSchemaTokens, r as estimateMessageTokenPressure, s as SAFETY_MARGIN, t as createFreshLlmBoundaryTokenEstimator } from "./context-token-pressure-II9nRGTn.mjs";
import { t as estimateToolResultReductionPotential } from "./tool-result-truncation-B6wvsjzz.mjs";
import { t as resolveEffectiveCompactionReserveTokens } from "./agent-compaction-constants-DmXQuPyL.mjs";
import { t as MidTurnPrecheckSignal } from "./midturn-precheck-BtRLC6ta.mjs";
import { resolveCompactionReplayPressure } from "@openclaw/ai/transports";
//#region src/agents/embedded-agent-runner/run/preemptive-compaction.ts
const PREEMPTIVE_OVERFLOW_ERROR_TEXT = "Context overflow: prompt too large for the model (precheck).";
const TRUNCATION_ROUTE_BUFFER_TOKENS = 512;
function isProviderContextUsageBarrier(message) {
	if (message.role !== "assistant" || !message.usage) return false;
	return message.api === "cli" && message.usage.contextUsage === void 0 || message.usage.contextUsage?.state === "unavailable" && calculateContextTokens(message.usage) === 0;
}
function resolveProviderContextBoundary(messages) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (message && isProviderContextUsageBarrier(message)) return;
		const contextUsage = message?.role === "assistant" ? message.usage?.contextUsage : void 0;
		if (contextUsage?.state === "available" && Number.isFinite(contextUsage.totalTokens) && contextUsage.totalTokens > 0) return {
			index,
			totalTokens: Math.ceil(contextUsage.totalTokens)
		};
	}
}
function estimateToolSchemaTokenPressure(tools) {
	return Math.ceil(estimateToolSchemaTokens(tools) * SAFETY_MARGIN);
}
function estimateTranscriptBoundaryTokenPressure(params) {
	const replay = params.replay ? resolveCompactionReplayPressure(params.messages, params.replay.model, params.replay, {
		text: estimateStringTokenPressure,
		image: () => IMAGE_BLOCK_TOKENS,
		json: estimateJsonPayloadTokenPressure,
		toolResult: (value) => estimateStringTokenPressure(value, 4, "tool-result")
	}, params.systemPrompt) : void 0;
	const messages = replay?.messages ?? params.messages;
	const boundary = resolveProviderContextBoundary(messages);
	const measuredTokens = replay?.measuredTokens ?? boundary?.totalTokens;
	const locallyEstimatedTokens = (boundary ? messages.slice(boundary.index + 1) : messages).reduce((sum, message) => sum + estimateMessageTokenPressure(message), estimateRenderedPromptTokens(params) + (boundary ? 0 : (replay?.prefixTokens ?? 0) - (replay?.measuredTokens ?? 0)));
	const toolSchemaTokens = Math.max(0, params.toolSchemaTokens ?? 0);
	return {
		estimatedPromptTokens: (measuredTokens ?? 0) + Math.ceil(locallyEstimatedTokens * SAFETY_MARGIN) + (boundary && !replay ? 0 : toolSchemaTokens),
		source: measuredTokens !== void 0 ? "provider_context_usage" : replay ? "provider_compaction_estimate" : "transcript_estimate",
		messages,
		hasCompactionReplay: Boolean(replay)
	};
}
function estimateLlmBoundaryTokenPressure(params) {
	return estimateTranscriptBoundaryTokenPressure(params).estimatedPromptTokens;
}
/** Estimates only the rendered prompt/system portion when history has already been accounted for. */
function estimateRenderedLlmBoundaryTokenPressure(params) {
	return Math.max(0, Math.ceil(estimateRenderedPromptTokens(params) * SAFETY_MARGIN));
}
function normalizeLlmBoundaryTokenPressure(pressure) {
	if (!pressure || !Number.isFinite(pressure.estimatedPromptTokens)) return;
	return {
		estimatedPromptTokens: Math.max(0, Math.ceil(pressure.estimatedPromptTokens)),
		source: pressure.source.trim() || "rendered_llm_boundary"
	};
}
/**
* Decides whether a run should compact before submitting the prompt, and
* whether reducible tool results can avoid or follow compaction. Rendered LLM
* boundary pressure wins over local transcript estimates when supplied.
*/
function shouldPreemptivelyCompactBeforePrompt(params) {
	const llmBoundaryTokenPressure = normalizeLlmBoundaryTokenPressure(params.llmBoundaryTokenPressure);
	const estimateTranscriptPressure = (messages, replay) => estimateTranscriptBoundaryTokenPressure({
		messages,
		systemPrompt: params.systemPrompt,
		prompt: params.prompt,
		replay,
		...typeof params.toolSchemaTokens === "number" ? { toolSchemaTokens: params.toolSchemaTokens } : {}
	});
	const transcriptTokenPressure = llmBoundaryTokenPressure && !params.replay ? void 0 : estimateTranscriptPressure(params.messages, params.replay);
	const boundaryPressure = transcriptTokenPressure?.hasCompactionReplay ? void 0 : llmBoundaryTokenPressure;
	const outgoingDecision = resolveCompactionPressureDecision({
		messages: transcriptTokenPressure?.messages ?? params.messages,
		estimatedPromptTokens: boundaryPressure?.estimatedPromptTokens ?? transcriptTokenPressure?.estimatedPromptTokens ?? 0,
		source: boundaryPressure?.source ?? transcriptTokenPressure?.source ?? "transcript_estimate"
	}, params);
	let diagnosticDecision = outgoingDecision;
	if (params.unwindowedMessages && params.unwindowedMessages !== params.messages) {
		const unwindowedTokenPressure = estimateTranscriptPressure(params.unwindowedMessages);
		if (unwindowedTokenPressure.estimatedPromptTokens > outgoingDecision.estimatedPromptTokens) diagnosticDecision = resolveCompactionPressureDecision({
			...unwindowedTokenPressure,
			source: `unwindowed_${unwindowedTokenPressure.source}`
		}, params);
	}
	return {
		...diagnosticDecision,
		...transcriptTokenPressure?.hasCompactionReplay ? { compactionReplay: outgoingDecision } : {}
	};
}
/** Price the projected foreground request; persisted usage alone cannot bind its prefix. */
function resolveProjectedRequestPressure(params) {
	const { context, previousRequest } = params;
	const anchor = previousRequest && Number.isFinite(previousRequest.contextTokens) && previousRequest.contextTokens > 0 ? previousRequest : void 0;
	const messages = context.messages;
	const appended = anchor ? messages.slice(anchor.messageCount).filter((message) => message.role !== "assistant" || !(anchor.responseId && message.responseId?.trim() === anchor.responseId || anchor.turnId && message.turnId?.trim() === anchor.turnId)) : messages;
	const estimate = createFreshLlmBoundaryTokenEstimator(anchor ? {} : context);
	const unanchoredCompletionTokens = anchor ? 0 : messages.reduce((total, message) => {
		const usage = message.role === "assistant" ? message.usage?.contextUsage : void 0;
		const completion = usage?.state === "available" ? usage.totalTokens - usage.promptTokens : 0;
		return total + (Number.isFinite(completion) ? Math.max(0, completion) : 0);
	}, 0);
	const precheck = shouldPreemptivelyCompactBeforePrompt({
		...params,
		messages,
		systemPrompt: context.systemPrompt,
		toolSchemaTokens: estimateToolSchemaTokenPressure(context.tools),
		prompt: "",
		replay: anchor ? void 0 : params.replay,
		llmBoundaryTokenPressure: {
			estimatedPromptTokens: (anchor?.contextTokens ?? 0) + unanchoredCompletionTokens + estimate({
				messages: appended,
				prompt: ""
			}),
			source: anchor ? "provider_context_usage" : "transcript_estimate"
		}
	});
	const decision = precheck.compactionReplay ?? precheck;
	log.debug(`[context-overflow-midturn-precheck] provider-bound check route=${decision.route} messages=${messages.length} pressureSource=${decision.pressureSource} estimatedPromptTokens=${decision.estimatedPromptTokens} promptBudgetBeforeReserve=${decision.promptBudgetBeforeReserve} overflowTokens=${decision.overflowTokens}`);
	return decision;
}
/** Stop before a projected foreground request that no longer fits its budget. */
function checkMidTurnPrecheck(params) {
	const decision = resolveProjectedRequestPressure(params);
	if (decision.route !== "fits") {
		const request = {
			...decision,
			route: decision.route
		};
		params.onPrecheck(request);
		throw new MidTurnPrecheckSignal(request);
	}
}
function resolveCompactionPressureDecision(pressure, params) {
	const { estimatedPromptTokens } = pressure;
	const contextTokenBudget = Math.max(1, Math.floor(params.contextTokenBudget));
	const effectiveReserveTokens = resolveEffectiveCompactionReserveTokens({
		contextTokenBudget,
		reserveTokens: params.reserveTokens
	});
	const promptBudgetBeforeReserve = Math.max(1, contextTokenBudget - effectiveReserveTokens);
	const overflowTokens = Math.max(0, estimatedPromptTokens - promptBudgetBeforeReserve);
	const toolResultPotential = estimateToolResultReductionPotential({
		messages: pressure.messages,
		contextWindowTokens: params.contextTokenBudget,
		maxCharsOverride: params.toolResultMaxChars
	});
	const overflowChars = overflowTokens * 4;
	const truncateOnlyThresholdChars = Math.max(overflowChars + TRUNCATION_ROUTE_BUFFER_TOKENS * 4, Math.ceil(overflowChars * 1.5));
	const toolResultReducibleChars = toolResultPotential.maxReducibleChars;
	const route = overflowTokens > 0 ? toolResultReducibleChars <= 0 ? "compact_only" : toolResultReducibleChars >= truncateOnlyThresholdChars ? "truncate_tool_results_only" : "compact_then_truncate" : "fits";
	return {
		route,
		shouldCompact: route === "compact_only" || route === "compact_then_truncate",
		estimatedPromptTokens,
		pressureSource: pressure.source,
		promptBudgetBeforeReserve,
		overflowTokens,
		toolResultReducibleChars,
		effectiveReserveTokens
	};
}
function formatPrePromptPrecheckLog(params) {
	const { result } = params;
	return `[context-overflow-precheck] pre-prompt check sessionKey=${params.sessionKey ?? params.sessionId ?? "unknown"} provider=${params.provider}/${params.modelId} route=${result.route} estimatedPromptTokens=${result.estimatedPromptTokens} pressureSource=${result.pressureSource ?? "unknown"} promptBudgetBeforeReserve=${result.promptBudgetBeforeReserve} overflowTokens=${result.overflowTokens} toolResultReducibleChars=${result.toolResultReducibleChars} reserveTokens=${params.reserveTokens} effectiveReserveTokens=${result.effectiveReserveTokens} contextTokenBudget=${params.contextTokenBudget} messages=${params.messageCount} unwindowedMessages=${params.unwindowedMessageCount ?? params.messageCount} sessionFile=${params.sessionFile}`;
}
function buildPrePromptContextBudgetStatus(params) {
	const { result } = params;
	const remainingPromptBudgetTokens = Math.max(0, result.promptBudgetBeforeReserve - result.estimatedPromptTokens);
	return {
		schemaVersion: 1,
		source: "pre-prompt-estimate",
		updatedAt: params.now ?? Date.now(),
		provider: params.provider,
		model: params.modelId,
		route: result.route,
		shouldCompact: result.shouldCompact,
		estimatedPromptTokens: result.estimatedPromptTokens,
		contextTokenBudget: Math.max(1, Math.floor(params.contextTokenBudget)),
		promptBudgetBeforeReserve: result.promptBudgetBeforeReserve,
		reserveTokens: Math.max(0, Math.floor(params.reserveTokens)),
		effectiveReserveTokens: result.effectiveReserveTokens,
		remainingPromptBudgetTokens,
		overflowTokens: result.overflowTokens,
		toolResultReducibleChars: result.toolResultReducibleChars,
		messageCount: Math.max(0, Math.floor(params.messageCount)),
		unwindowedMessageCount: Math.max(0, Math.floor(params.unwindowedMessageCount ?? params.messageCount)),
		...params.sessionId ? { sessionId: params.sessionId } : {}
	};
}
//#endregion
export { estimateRenderedLlmBoundaryTokenPressure as a, resolveProjectedRequestPressure as c, estimateLlmBoundaryTokenPressure as i, shouldPreemptivelyCompactBeforePrompt as l, buildPrePromptContextBudgetStatus as n, estimateToolSchemaTokenPressure as o, checkMidTurnPrecheck as r, formatPrePromptPrecheckLog as s, PREEMPTIVE_OVERFLOW_ERROR_TEXT as t };
