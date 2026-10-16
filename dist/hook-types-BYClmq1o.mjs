import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
//#region src/plugins/tool-hook-matcher.ts
const NON_CANONICAL_TOOL_MATCHER_NAMES = /* @__PURE__ */ new Set([
	"bash",
	"exec_command",
	"apply-patch",
	"Write",
	"Edit",
	"agent"
]);
/** Omission is the only match-all form; explicit matcher values must stay bounded. */
function normalizePluginToolMatcher(matcher) {
	if (matcher === void 0) return;
	if (!Array.isArray(matcher)) throw new TypeError("tool hook matcher must be an array of tool names");
	if (matcher.length === 0) throw new TypeError("tool hook matcher must contain at least one tool name");
	const normalized = /* @__PURE__ */ new Set();
	for (let index = 0; index < matcher.length; index += 1) {
		if (!Object.hasOwn(matcher, index)) throw new TypeError("tool hook matcher entries must be non-empty strings");
		const toolName = matcher[index];
		if (typeof toolName !== "string") throw new TypeError("tool hook matcher entries must be non-empty strings");
		const canonicalToolName = normalizeLowercaseStringOrEmpty(toolName);
		if (!canonicalToolName) throw new TypeError("tool hook matcher entries must be non-empty strings");
		if (canonicalToolName === "*") throw new TypeError("tool hook matcher wildcard entries are not supported");
		if (NON_CANONICAL_TOOL_MATCHER_NAMES.has(canonicalToolName) || NON_CANONICAL_TOOL_MATCHER_NAMES.has(toolName.trim())) throw new TypeError("tool hook matcher entries must use canonical OpenClaw tool ids");
		normalized.add(canonicalToolName);
	}
	const [firstToolName, ...remainingToolNames] = Array.from(normalized).toSorted();
	if (!firstToolName) throw new TypeError("tool hook matcher entries must be non-empty strings");
	return [firstToolName, ...remainingToolNames];
}
function pluginToolMatcherCoversTool(matcher, toolName) {
	const normalizedMatcher = normalizePluginToolMatcher(matcher);
	return normalizedMatcher === void 0 || normalizedMatcher.includes(normalizeLowercaseStringOrEmpty(toolName));
}
function createPluginToolMatcherScope(matchers) {
	let hasRegistration = false;
	const toolNames = /* @__PURE__ */ new Set();
	for (const matcher of matchers) {
		hasRegistration = true;
		const normalized = normalizePluginToolMatcher(matcher);
		if (!normalized) return {
			matchAll: true,
			toolNames: []
		};
		for (const toolName of normalized) toolNames.add(toolName);
	}
	return hasRegistration ? {
		matchAll: false,
		toolNames: Array.from(toolNames).toSorted()
	} : void 0;
}
function mergePluginToolMatcherScopes(scopes) {
	let hasScope = false;
	const toolNames = /* @__PURE__ */ new Set();
	for (const scope of scopes) {
		if (!scope) continue;
		hasScope = true;
		if (scope.matchAll) return {
			matchAll: true,
			toolNames: []
		};
		for (const toolName of scope.toolNames) toolNames.add(toolName);
	}
	return hasScope ? {
		matchAll: false,
		toolNames: Array.from(toolNames).toSorted()
	} : void 0;
}
//#endregion
//#region src/plugins/hook-types.ts
const pluginHookNameSet = /* @__PURE__ */ new Set([
	"before_model_resolve",
	"agent_turn_prepare",
	"before_prompt_build",
	"before_agent_reply",
	"model_call_started",
	"model_call_ended",
	"llm_input",
	"llm_output",
	"before_agent_finalize",
	"agent_end",
	"before_compaction",
	"after_compaction",
	"before_reset",
	"inbound_claim",
	"channel_pairing_requested",
	"message_received",
	"message_sending",
	"reply_payload_sending",
	"message_sent",
	"before_tool_call",
	"after_tool_call",
	"tool_result_persist",
	"before_message_write",
	"session_start",
	"session_end",
	"subagent_delivery_target",
	"subagent_spawned",
	"subagent_progress",
	"subagent_ended",
	"gateway_start",
	"gateway_stop",
	"heartbeat_prompt_contribution",
	"cron_reconciled",
	"cron_changed",
	"skill_proposal_evaluate",
	"skill_proposal_changed",
	"skill_changed",
	"before_dispatch",
	"reply_dispatch",
	"before_install",
	"before_agent_run",
	"resolve_exec_env"
]);
const isPluginHookName = (hookName) => typeof hookName === "string" && pluginHookNameSet.has(hookName);
const isPromptInjectionHookName = (hookName) => hookName === "agent_turn_prepare" || hookName === "before_prompt_build" || hookName === "heartbeat_prompt_contribution";
const pluginHookAgentTriggerSet = /* @__PURE__ */ new Set([
	"cron",
	"heartbeat",
	"user"
]);
const isPluginHookAgentTrigger = (trigger) => typeof trigger === "string" && pluginHookAgentTriggerSet.has(trigger);
const isPluginHookReplyDispatchKind = (kind) => kind === "agent" || kind === "acp";
//#endregion
export { createPluginToolMatcherScope as a, pluginToolMatcherCoversTool as c, isPromptInjectionHookName as i, isPluginHookName as n, mergePluginToolMatcherScopes as o, isPluginHookReplyDispatchKind as r, normalizePluginToolMatcher as s, isPluginHookAgentTrigger as t };
