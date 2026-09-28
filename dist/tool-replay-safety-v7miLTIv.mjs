import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
//#region src/agents/tool-replay-safety.ts
/**
* Defines the narrow set of tool instances that blind attempt retries may repeat.
*/
const UNCONDITIONALLY_REPLAY_SAFE_TOOL_NAMES = /* @__PURE__ */ new Set([
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
	"sessions_search",
	"agents_list",
	"conversations_list",
	"get_goal",
	"tool_search",
	"tool_describe",
	"view_image"
]);
function groupUniqueToolsByName(tools) {
	const toolsByName = /* @__PURE__ */ new Map();
	for (const tool of tools) {
		const name = normalizeToolPolicyName(tool.name ?? "");
		if (!name) continue;
		toolsByName.set(name, toolsByName.has(name) ? void 0 : tool);
	}
	return toolsByName;
}
/**
* Tool names are not ownership boundaries. Callers must reject plugin/channel
* instances before using this audited core-tool allowlist.
*/
function isAgentToolReplaySafe(tool, options) {
	if (options?.declaredReplaySafe?.(tool) === false) return false;
	return UNCONDITIONALLY_REPLAY_SAFE_TOOL_NAMES.has(normalizeToolPolicyName(tool.name ?? ""));
}
/**
* Classify one concrete tool instance for an explicitly restart-safe turn.
* Unlike blind name-only replay, an owner declaration is sufficient because
* the host filters the concrete registered instance before execution.
*/
function isAgentToolRestartSafe(tool, options) {
	const declaredReplaySafe = options?.declaredReplaySafe?.(tool);
	if (declaredReplaySafe !== void 0) return declaredReplaySafe;
	return UNCONDITIONALLY_REPLAY_SAFE_TOOL_NAMES.has(normalizeToolPolicyName(tool.name ?? ""));
}
/**
* Name-only tool events are safe only when one concrete registered instance
* owns the name. Duplicate/shadowed names fail closed.
*/
function collectReplaySafeToolNames(tools, options) {
	const replaySafeNames = /* @__PURE__ */ new Set();
	for (const [name, tool] of groupUniqueToolsByName(tools)) if (tool && isAgentToolReplaySafe(tool, options)) replaySafeNames.add(name);
	return replaySafeNames;
}
/** Bind name-only terminal events to the one concrete owner-declared side-effecting tool. */
function collectSideEffectToolOwners(tools, options) {
	const owners = /* @__PURE__ */ new Map();
	for (const [name, tool] of groupUniqueToolsByName(tools)) {
		const owner = tool ? options.declaredOwner(tool) : void 0;
		if (owner) owners.set(name, owner);
	}
	return owners;
}
//#endregion
export { isAgentToolRestartSafe as i, collectSideEffectToolOwners as n, isAgentToolReplaySafe as r, collectReplaySafeToolNames as t };
