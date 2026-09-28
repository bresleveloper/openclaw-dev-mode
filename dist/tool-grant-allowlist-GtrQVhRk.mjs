import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DFVWJ-hh.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
//#region src/plugins/tool-grant-allowlist.ts
const RUNTIME_PLUGIN_TOOL_GRANT_PREFIX = "__openclaw_runtime_plugin_tool_grant__";
function runtimePluginToolGrantKey(pluginId, toolName) {
	return `${RUNTIME_PLUGIN_TOOL_GRANT_PREFIX}:${pluginId.trim().toLowerCase()}:${normalizeToolPolicyName(toolName)}`;
}
function appendRuntimePluginToolGrant(allowlist, grant) {
	return grant ? [...allowlist, ...grant.toolNames.map((toolName) => runtimePluginToolGrantKey(grant.pluginId, toolName))] : allowlist;
}
function createPluginToolAllowlist(list) {
	const entries = new Set(normalizeUniqueStringEntries((list ?? []).map(normalizeToolPolicyName)));
	const patterns = compileGlobPatterns({
		raw: [...entries].filter((entry) => !entry.startsWith(`${RUNTIME_PLUGIN_TOOL_GRANT_PREFIX}:`)),
		normalize: normalizeToolPolicyName
	});
	const allowsPlugin = (pluginId) => entries.has("*") || entries.has("group:plugins") || entries.has(normalizeToolPolicyName(pluginId));
	const allowsToolName = (toolName) => entries.has("group:plugins") || matchesAnyGlobPattern(normalizeToolPolicyName(toolName), patterns);
	return {
		size: entries.size,
		includesDefaults: entries.size === 0 || entries.has("__openclaw_default_plugin_tools__"),
		allowsPlugin,
		allowsToolName,
		allowsTool: (pluginId, toolName) => allowsPlugin(pluginId) || allowsToolName(toolName) || entries.has(runtimePluginToolGrantKey(pluginId, toolName))
	};
}
//#endregion
export { createPluginToolAllowlist as n, appendRuntimePluginToolGrant as t };
