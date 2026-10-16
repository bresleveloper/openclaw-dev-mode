import { l as normalizeToolPolicyName } from "./tool-policy-shared-DWHChhWM.mjs";
import "./token-format-BRba24iW.mjs";
import { t as describeToolForVerbose } from "./tool-description-summary-Rk6k7zPi.mjs";
import "./command-status-builders-Cf1IgFfM.mjs";
import "./status-message-_AscdlbR.mjs";
//#region src/auto-reply/status.ts
/** Auto-reply status/help message builders for commands, status, and tool inventory output. */
function formatCompactToolEntry(tool) {
	const id = normalizeToolPolicyName(tool.id);
	const owner = tool.source === "plugin" ? tool.pluginId : tool.source === "channel" ? tool.channelId : void 0;
	return owner ? `${id} (${owner})` : id;
}
/** Formats the effective tool inventory shown by /tools. */
function buildToolsMessage(result, options) {
	const groups = result.groups.filter((group) => group.tools.length > 0);
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
		const tools = group.tools.toSorted((a, b) => a.label.localeCompare(b.label));
		lines.push("", group.label);
		if (verbose) {
			for (const tool of tools) {
				const description = describeToolForVerbose({
					rawDescription: tool.rawDescription || tool.description || "Tool",
					fallback: tool.description || "Tool"
				});
				lines.push(`  ${tool.label} - ${description}`);
			}
			continue;
		}
		lines.push(`  ${tools.map(formatCompactToolEntry).join(", ")}`);
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
