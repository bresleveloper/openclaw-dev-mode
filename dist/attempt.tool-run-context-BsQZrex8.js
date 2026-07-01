import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { C as freezeDiagnosticTraceContext } from "./diagnostic-events-CLCyIzm6.js";
import { t as SAFETY_MARGIN } from "./compaction-planning-ls7_woPy.js";
import { t as estimateStringChars } from "./cjk-chars-BtjJDifS.js";
import { m as normalizeToolName } from "./tool-policy-Cm3NCEHp.js";
import { n as MIN_PROMPT_BUDGET_TOKENS, t as MIN_PROMPT_BUDGET_RATIO } from "./agent-compaction-constants-BHnSZLzH.js";
import { i as estimateToolResultReductionPotential } from "./tool-result-truncation-C_2NT8o3.js";
import "./compaction-Kq0fpmGC.js";
//#region src/agents/tool-replay-safety.ts
/**
* Defines the narrow set of tool instances that blind attempt retries may repeat.
*/
const UNCONDITIONALLY_REPLAY_SAFE_TOOL_NAMES = new Set([
	"read",
	"search",
	"find",
	"grep",
	"glob",
	"ls",
	"web_search",
	"web_fetch",
	"x_search",
	"memory_get",
	"sessions_list",
	"sessions_history",
	"agents_list",
	"get_goal",
	"update_plan",
	"tool_search",
	"tool_describe",
	"image"
]);
/**
* Tool names are not ownership boundaries. Callers must reject plugin/channel
* instances before using this audited core-tool allowlist.
*/
function isAgentToolReplaySafe(tool, options) {
	if (options?.declaredReplaySafe?.(tool) === false) return false;
	return UNCONDITIONALLY_REPLAY_SAFE_TOOL_NAMES.has(normalizeToolName(tool.name ?? ""));
}
/**
* Name-only tool events are safe only when one concrete registered instance
* owns the name. Duplicate/shadowed names fail closed.
*/
function collectReplaySafeToolNames(tools, options) {
	const toolsByName = /* @__PURE__ */ new Map();
	for (const tool of tools) {
		const name = normalizeToolName(tool.name ?? "");
		if (!name) continue;
		const entries = toolsByName.get(name) ?? [];
		entries.push(tool);
		toolsByName.set(name, entries);
	}
	const replaySafeNames = /* @__PURE__ */ new Set();
	for (const [name, entries] of toolsByName) {
		const tool = entries.length === 1 ? entries[0] : void 0;
		if (tool && isAgentToolReplaySafe(tool, options)) replaySafeNames.add(name);
	}
	return replaySafeNames;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/preemptive-compaction.ts
/**
* Estimates prompt pressure and decides pre-prompt compaction routing.
*/
const PREEMPTIVE_OVERFLOW_ERROR_TEXT = "Context overflow: prompt too large for the model (precheck).";
const ESTIMATED_CHARS_PER_TOKEN = 4;
const TOOL_RESULT_CHARS_PER_TOKEN = 2;
const JSON_PAYLOAD_CHARS_PER_TOKEN = 3;
const MESSAGE_BOUNDARY_OVERHEAD_TOKENS = 12;
const CONTENT_BLOCK_OVERHEAD_TOKENS = 6;
const IMAGE_BLOCK_TOKENS = 2e3;
const TRUNCATION_ROUTE_BUFFER_TOKENS = 512;
function estimateStringTokenPressure(text, charsPerToken = ESTIMATED_CHARS_PER_TOKEN) {
	return Math.ceil(estimateStringChars(text) / charsPerToken);
}
function estimateJsonPayloadTokenPressure(value, charsPerToken = JSON_PAYLOAD_CHARS_PER_TOKEN) {
	try {
		const serialized = JSON.stringify(value);
		return typeof serialized === "string" ? Math.ceil(estimateStringChars(serialized) / charsPerToken) : 1;
	} catch {
		return 256;
	}
}
function estimateIdentifierTokenPressure(value, charsPerToken = JSON_PAYLOAD_CHARS_PER_TOKEN) {
	if (value == null) return 0;
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return estimateStringTokenPressure(String(value), charsPerToken);
	return estimateJsonPayloadTokenPressure(value, charsPerToken);
}
function estimateContentBlockTokenPressure(block, charsPerToken = ESTIMATED_CHARS_PER_TOKEN) {
	if (typeof block === "string") return estimateStringTokenPressure(block, charsPerToken);
	if (!isRecord(block)) return estimateJsonPayloadTokenPressure(block, charsPerToken);
	const type = block.type;
	if (type === "text" && typeof block.text === "string") return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateStringTokenPressure(block.text, charsPerToken);
	if (type === "thinking" && typeof block.thinking === "string") return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateStringTokenPressure(block.thinking, charsPerToken);
	if (type === "image") return IMAGE_BLOCK_TOKENS;
	return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateJsonPayloadTokenPressure(block, charsPerToken);
}
function estimateToolResultContentTokenPressure(content) {
	if (typeof content === "string") return estimateStringTokenPressure(content, TOOL_RESULT_CHARS_PER_TOKEN);
	if (Array.isArray(content)) return content.reduce((sum, block) => sum + estimateContentBlockTokenPressure(block, TOOL_RESULT_CHARS_PER_TOKEN), 0);
	if (content !== void 0) return estimateJsonPayloadTokenPressure(content, TOOL_RESULT_CHARS_PER_TOKEN);
	return 0;
}
function estimateAssistantToolCallTokenPressure(block) {
	const args = block.arguments ?? block.input ?? block.args ?? {};
	return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateIdentifierTokenPressure(block.name, JSON_PAYLOAD_CHARS_PER_TOKEN) + estimateJsonPayloadTokenPressure(args, JSON_PAYLOAD_CHARS_PER_TOKEN);
}
function estimateContentTokenPressure(content) {
	if (typeof content === "string") return estimateStringTokenPressure(content);
	if (Array.isArray(content)) return content.reduce((sum, block) => sum + estimateContentBlockTokenPressure(block), 0);
	if (content !== void 0) return estimateJsonPayloadTokenPressure(content);
	return 0;
}
function isToolResultMessage(message) {
	const record = message;
	return record.role === "toolResult" || record.role === "tool" || record.type === "toolResult";
}
function estimateMessageTokenPressure(message) {
	const record = message;
	let tokens = MESSAGE_BOUNDARY_OVERHEAD_TOKENS;
	if (isToolResultMessage(message)) {
		tokens += estimateToolResultContentTokenPressure(record.content);
		tokens += estimateIdentifierTokenPressure(record.toolName ?? record.tool_name);
		return tokens;
	}
	if (record.role === "assistant") {
		const content = record.content;
		if (Array.isArray(content)) for (const block of content) if (isRecord(block) && (block.type === "toolCall" || block.type === "tool_use")) tokens += estimateAssistantToolCallTokenPressure(block);
		else tokens += estimateContentBlockTokenPressure(block);
		else tokens += estimateContentTokenPressure(content);
		const toolCalls = record.toolCalls ?? record.tool_calls;
		if (Array.isArray(toolCalls)) for (const toolCall of toolCalls) tokens += isRecord(toolCall) ? estimateAssistantToolCallTokenPressure(toolCall) : estimateJsonPayloadTokenPressure(toolCall);
		return tokens;
	}
	tokens += estimateContentTokenPressure(record.content);
	return tokens;
}
/**
* Estimates the prompt pressure at the LLM boundary from transcript messages,
* optional system prompt, and current prompt text. The result intentionally
* includes a safety margin because this path runs before provider tokenization.
*/
function estimateLlmBoundaryTokenPressure(params) {
	const historyTokens = params.messages.reduce((sum, message) => sum + estimateMessageTokenPressure(message), 0);
	const systemTokens = typeof params.systemPrompt === "string" && params.systemPrompt.trim().length > 0 ? MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.systemPrompt) : 0;
	const promptTokens = MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.prompt);
	return Math.max(0, Math.ceil((historyTokens + systemTokens + promptTokens) * SAFETY_MARGIN));
}
/** Estimates only the rendered prompt/system portion when history has already been accounted for. */
function estimateRenderedLlmBoundaryTokenPressure(params) {
	const systemTokens = typeof params.systemPrompt === "string" && params.systemPrompt.trim().length > 0 ? MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.systemPrompt) : 0;
	const promptTokens = MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.prompt);
	return Math.max(0, Math.ceil((systemTokens + promptTokens) * SAFETY_MARGIN));
}
function normalizeLlmBoundaryTokenPressure(pressure) {
	if (!pressure || !Number.isFinite(pressure.estimatedPromptTokens)) return;
	return {
		estimatedPromptTokens: Math.max(0, Math.ceil(pressure.estimatedPromptTokens)),
		source: pressure.source.trim() || "rendered_llm_boundary",
		...typeof pressure.renderedChars === "number" && Number.isFinite(pressure.renderedChars) ? { renderedChars: Math.max(0, Math.ceil(pressure.renderedChars)) } : {}
	};
}
/**
* Decides whether a run should compact before submitting the prompt, and
* whether reducible tool results can avoid or follow compaction. Rendered LLM
* boundary pressure wins over local transcript estimates when supplied.
*/
function shouldPreemptivelyCompactBeforePrompt(params) {
	let messagesForPressure = params.messages;
	const llmBoundaryTokenPressure = normalizeLlmBoundaryTokenPressure(params.llmBoundaryTokenPressure);
	let estimatedPromptTokens = llmBoundaryTokenPressure?.estimatedPromptTokens ?? estimateLlmBoundaryTokenPressure({
		messages: params.messages,
		systemPrompt: params.systemPrompt,
		prompt: params.prompt
	});
	let pressureSource = llmBoundaryTokenPressure?.source ?? "transcript_estimate";
	if (params.unwindowedMessages && params.unwindowedMessages !== params.messages) {
		const unwindowedEstimatedPromptTokens = estimateLlmBoundaryTokenPressure({
			messages: params.unwindowedMessages,
			systemPrompt: params.systemPrompt,
			prompt: params.prompt
		});
		if (unwindowedEstimatedPromptTokens > estimatedPromptTokens) {
			estimatedPromptTokens = unwindowedEstimatedPromptTokens;
			messagesForPressure = params.unwindowedMessages;
			pressureSource = "unwindowed_transcript_estimate";
		}
	}
	const contextTokenBudget = Math.max(1, Math.floor(params.contextTokenBudget));
	const requestedReserveTokens = Math.max(0, Math.floor(params.reserveTokens));
	const minPromptBudget = Math.min(MIN_PROMPT_BUDGET_TOKENS, Math.max(1, Math.floor(contextTokenBudget * MIN_PROMPT_BUDGET_RATIO)));
	const effectiveReserveTokens = Math.min(requestedReserveTokens, Math.max(0, contextTokenBudget - minPromptBudget));
	const promptBudgetBeforeReserve = Math.max(1, contextTokenBudget - effectiveReserveTokens);
	const overflowTokens = Math.max(0, estimatedPromptTokens - promptBudgetBeforeReserve);
	const toolResultPotential = estimateToolResultReductionPotential({
		messages: messagesForPressure,
		contextWindowTokens: params.contextTokenBudget,
		maxCharsOverride: params.toolResultMaxChars
	});
	const overflowChars = overflowTokens * ESTIMATED_CHARS_PER_TOKEN;
	const truncateOnlyThresholdChars = Math.max(overflowChars + TRUNCATION_ROUTE_BUFFER_TOKENS * ESTIMATED_CHARS_PER_TOKEN, Math.ceil(overflowChars * 1.5));
	const toolResultReducibleChars = toolResultPotential.maxReducibleChars;
	let route = "fits";
	if (overflowTokens > 0) if (toolResultReducibleChars <= 0) route = "compact_only";
	else if (toolResultReducibleChars >= truncateOnlyThresholdChars) route = "truncate_tool_results_only";
	else route = "compact_then_truncate";
	return {
		route,
		shouldCompact: route === "compact_only" || route === "compact_then_truncate",
		estimatedPromptTokens,
		pressureSource,
		promptBudgetBeforeReserve,
		overflowTokens,
		toolResultReducibleChars,
		effectiveReserveTokens
	};
}
/** Formats the compact operator log line for one pre-prompt budget check. */
function formatPrePromptPrecheckLog(params) {
	const { result } = params;
	return `[context-overflow-precheck] pre-prompt check sessionKey=${params.sessionKey ?? params.sessionId ?? "unknown"} provider=${params.provider}/${params.modelId} route=${result.route} estimatedPromptTokens=${result.estimatedPromptTokens} pressureSource=${result.pressureSource ?? "unknown"} promptBudgetBeforeReserve=${result.promptBudgetBeforeReserve} overflowTokens=${result.overflowTokens} toolResultReducibleChars=${result.toolResultReducibleChars} reserveTokens=${params.reserveTokens} effectiveReserveTokens=${result.effectiveReserveTokens} contextTokenBudget=${params.contextTokenBudget} messages=${params.messageCount} unwindowedMessages=${params.unwindowedMessageCount ?? params.messageCount} sessionFile=${params.sessionFile}`;
}
/** Converts the pre-prompt decision into the persisted session context-budget status record. */
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
//#region src/agents/run-cleanup-timeout.ts
/**
* Agent cleanup timeout guard.
*
* Bounds cleanup steps so run completion cannot hang forever while preserving late-failure diagnostics.
*/
const AGENT_CLEANUP_STEP_TIMEOUT_MS = 1e4;
const AGENT_CLEANUP_STEP_TIMEOUT_ENV = "OPENCLAW_AGENT_CLEANUP_TIMEOUT_MS";
const TRAJECTORY_FLUSH_TIMEOUT_ENV = "OPENCLAW_TRAJECTORY_FLUSH_TIMEOUT_MS";
const CLEANUP_TIMEOUT_DETAILS_MAX_CHARS = 512;
const CLEANUP_TIMEOUT_DETAILS_TRUNCATED_SUFFIX = "...[truncated]";
function normalizeExplicitTimeoutMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	return Math.max(1, Math.floor(value));
}
function parseTimeoutEnvValue(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	return parseStrictPositiveInteger(trimmed);
}
function resolveCleanupTimeoutDetails(getTimeoutDetails) {
	try {
		const timeoutDetails = getTimeoutDetails?.()?.trim();
		return timeoutDetails ? ` details=${truncateCleanupTimeoutDetails(timeoutDetails)}` : "";
	} catch (error) {
		return ` detailsError=${truncateCleanupTimeoutDetails(formatErrorMessage(error))}`;
	}
}
function truncateCleanupTimeoutDetails(value) {
	if (value.length <= CLEANUP_TIMEOUT_DETAILS_MAX_CHARS) return value;
	const prefixLength = Math.max(0, CLEANUP_TIMEOUT_DETAILS_MAX_CHARS - 14);
	return `${value.slice(0, prefixLength)}${CLEANUP_TIMEOUT_DETAILS_TRUNCATED_SUFFIX}`;
}
function resolveAgentCleanupStepTimeoutMs(params) {
	const explicitTimeoutMs = normalizeExplicitTimeoutMs(params.timeoutMs);
	if (explicitTimeoutMs !== void 0) return explicitTimeoutMs;
	const env = params.env ?? process.env;
	if (params.step === "openclaw-trajectory-flush") {
		const trajectoryTimeoutMs = parseTimeoutEnvValue(env[TRAJECTORY_FLUSH_TIMEOUT_ENV]);
		if (trajectoryTimeoutMs !== void 0) return trajectoryTimeoutMs;
	}
	return parseTimeoutEnvValue(env[AGENT_CLEANUP_STEP_TIMEOUT_ENV]) ?? AGENT_CLEANUP_STEP_TIMEOUT_MS;
}
/** Run one cleanup step with timeout logging and late-rejection handling. */
async function runAgentCleanupStep(params) {
	const timeoutMs = resolveAgentCleanupStepTimeoutMs({
		step: params.step,
		timeoutMs: params.timeoutMs,
		env: params.env
	});
	let timeoutHandle;
	let timedOut = false;
	const cleanupPromise = Promise.resolve().then(params.cleanup);
	const observedCleanupPromise = cleanupPromise.catch((error) => {
		if (!timedOut) params.log.warn(`agent cleanup failed: runId=${params.runId} sessionId=${params.sessionId} step=${params.step} error=${formatErrorMessage(error)}`);
	});
	const timeoutPromise = new Promise((resolve) => {
		timeoutHandle = setTimeout(() => {
			timedOut = true;
			resolve("timeout");
		}, timeoutMs);
		timeoutHandle.unref?.();
	});
	const result = await Promise.race([observedCleanupPromise.then(() => "done"), timeoutPromise]);
	if (timeoutHandle) clearTimeout(timeoutHandle);
	if (result === "timeout") {
		const details = resolveCleanupTimeoutDetails(params.getTimeoutDetails);
		params.log.warn(`agent cleanup timed out: runId=${params.runId} sessionId=${params.sessionId} step=${params.step} timeoutMs=${timeoutMs}${details}`);
		cleanupPromise.catch((error) => {
			params.log.warn(`agent cleanup rejected after timeout: runId=${params.runId} sessionId=${params.sessionId} step=${params.step} error=${formatErrorMessage(error)}`);
		});
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.tool-run-context.ts
/**
* Builds tool run context passed to embedded-agent tool handlers.
*/
/**
* Builds the stable tool-run context forwarded into an embedded-attempt execution.
*/
function buildEmbeddedAttemptToolRunContext(params) {
	return {
		trigger: params.trigger,
		jobId: params.jobId,
		memoryFlushWritePath: params.memoryFlushWritePath,
		...params.toolsAllow ? { runtimeToolAllowlist: params.toolsAllow } : {},
		...params.trace ? { trace: freezeDiagnosticTraceContext(params.trace) } : {}
	};
}
//#endregion
export { estimateLlmBoundaryTokenPressure as a, shouldPreemptivelyCompactBeforePrompt as c, buildPrePromptContextBudgetStatus as i, collectReplaySafeToolNames as l, runAgentCleanupStep as n, estimateRenderedLlmBoundaryTokenPressure as o, PREEMPTIVE_OVERFLOW_ERROR_TEXT as r, formatPrePromptPrecheckLog as s, buildEmbeddedAttemptToolRunContext as t, isAgentToolReplaySafe as u };
