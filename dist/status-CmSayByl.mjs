import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import "./token-format-o0FIe7MV.mjs";
import { t as describeToolForVerbose } from "./tool-description-summary-Ch0o0jSZ.mjs";
import "./command-status-builders-YK0Mkzq8.mjs";
import "./status-message-BDmXuxv_.mjs";
//#region src/auto-reply/status.ts
/** Auto-reply status/help message builders for commands, status, and tool inventory output. */
function sortToolsMessageItems(items) {
	return items.toSorted((a, b) => a.name.localeCompare(b.name));
}
function formatCompactToolEntry(tool) {
	if (tool.source === "plugin") return tool.pluginId ? `${tool.id} (${tool.pluginId})` : tool.id;
	if (tool.source === "channel") return tool.channelId ? `${tool.id} (${tool.channelId})` : tool.id;
	return tool.id;
}
function formatVerboseToolDescription(tool) {
	return describeToolForVerbose({
		rawDescription: tool.rawDescription,
		fallback: tool.description
	});
}
/** Formats the effective tool inventory shown by /tools. */
function buildToolsMessage(result, options) {
	const groups = [];
	for (const group of result.groups) {
		const tools = [];
		for (const tool of group.tools) tools.push({
			id: normalizeToolPolicyName(tool.id),
			name: tool.label,
			description: tool.description || "Tool",
			rawDescription: tool.rawDescription || tool.description || "Tool",
			source: tool.source,
			pluginId: tool.pluginId,
			channelId: tool.channelId
		});
		if (tools.length > 0) groups.push({
			label: group.label,
			tools: sortToolsMessageItems(tools)
		});
	}
	if (groups.length === 0) return [
		"No tools are available for this agent right now.",
		"",
		`Profile: ${result.profile}`
	].join("\n");
	const verbose = options?.verbose === true;
	const lines = verbose ? [
		"Available tools",
		"",
		`Profile: ${result.profile}`,
		"What this agent can use right now:"
	] : [
		"Available tools",
		"",
		`Profile: ${result.profile}`
	];
	for (const group of groups) {
		lines.push("", group.label);
		if (verbose) {
			for (const tool of group.tools) lines.push(`  ${tool.name} - ${formatVerboseToolDescription(tool)}`);
			continue;
		}
		const compactTools = [];
		for (const tool of group.tools) compactTools.push(formatCompactToolEntry(tool));
		lines.push(`  ${compactTools.join(", ")}`);
	}
	if (verbose) lines.push("", "Tool availability depends on this agent's configuration.");
	else lines.push("", "Use /tools verbose for descriptions.");
	if (result.notices?.length) {
		lines.push("", "Notes");
		for (const notice of result.notices) lines.push(`  ${notice.message}`);
	}
	return lines.join("\n");
}
//#endregion
export { buildToolsMessage as t };
