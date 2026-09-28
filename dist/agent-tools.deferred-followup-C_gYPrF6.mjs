import { v as describeAgentsListTool, y as describeAgentsWaitTool } from "./tool-description-presets-CT4WhVkI.mjs";
import { n as isAutomationsToolName } from "./automations-tool-name-DBMZPbPL.mjs";
import { r as copyAgentToolMetadata, y as finalizeAgentToolAvailability } from "./agent-tool-metadata-COcr-3AD.mjs";
import { n as describeExecTool, r as describeProcessTool, t as EXEC_AUTO_REVIEW_GUIDANCE } from "./bash-tools.descriptions-CdVoGX1S.mjs";
//#region src/agents/agent-tools.deferred-followup.ts
function replaceDescription(tool, description) {
	const updated = {
		...tool,
		description
	};
	return copyAgentToolMetadata(tool, updated);
}
const TOOL_FOLLOWUPS = [
	[
		"gateway",
		"openclaw",
		"Never via shell.",
		"Never via shell. Other system changes: use openclaw tool."
	],
	[
		"sessions_search",
		"sessions_history",
		"Search visible past sessions for matching user and assistant text.",
		"Search visible past sessions for matching user and assistant text. Follow up with sessions_history using a returned sessionKey, sessionId, and messageId for neighboring context."
	],
	[
		"conversations_send",
		"conversations_list",
		"through a conversationRef.",
		"through a conversationRef from conversations_list."
	],
	[
		"sessions_spawn",
		"agents_list",
		"configured agent;",
		"configured agent (see agents_list);"
	],
	[
		"sessions_yield",
		"agents_wait",
		"Collector runs require explicit collection instead.",
		"Collector runs require agents_wait instead."
	]
];
function describeAvailableTool(tool, availableTools) {
	let description = tool.description;
	for (const [sourceTool, requiredTool, original, expanded] of TOOL_FOLLOWUPS) if (sourceTool === tool.name && availableTools.has(requiredTool)) description = description.replace(original, expanded);
	if (tool.name === "sessions_send") {
		const deliveryTools = ["conversations_send", "conversations_turn"].filter((name) => availableTools.has(name));
		if (availableTools.has("conversations_list") && deliveryTools.length > 0) {
			const guidance = `For an exact external destination, use \`conversations_list\` plus ${deliveryTools.map((name) => `\`${name}\``).join("/")}.`;
			description = description.replace(" Thread chats rejected:", ` ${guidance} Thread chats rejected:`);
		}
	}
	if (tool.name === "sessions_spawn") {
		const statusTools = ["subagents", "sessions_history"].filter((name) => availableTools.has(name));
		if (statusTools.length > 0) {
			const guidance = statusTools.map((name) => `\`${name}\``).join("/");
			description = description.replace("No spawn for quick lookup/single read.", `No spawn for quick lookup/single read. Check spawns via ${guidance}.`);
		}
	}
	return description;
}
/** Return tools with cross-tool guidance adjusted for the tools that survived filtering. */
function applyToolAvailabilityDescriptions(tools) {
	finalizeAgentToolAvailability(tools);
	const availableTools = new Set(tools.map((tool) => tool.name));
	const hasCronTool = tools.some((tool) => isAutomationsToolName(tool.name));
	const hasProcessTool = availableTools.has("process");
	const hasSessionsSpawnTool = availableTools.has("sessions_spawn");
	return tools.map((tool) => {
		if (tool.name === "exec") return replaceDescription(tool, describeExecTool({
			hasCronTool,
			hasProcessTool,
			autoReview: tool.description.includes(EXEC_AUTO_REVIEW_GUIDANCE)
		}));
		if (tool.name === "process") return replaceDescription(tool, describeProcessTool({ hasCronTool }));
		if (tool.name === "agents_list") return replaceDescription(tool, describeAgentsListTool(hasSessionsSpawnTool));
		if (tool.name === "agents_wait") return replaceDescription(tool, describeAgentsWaitTool(hasSessionsSpawnTool));
		const description = describeAvailableTool(tool, availableTools);
		return description === tool.description ? tool : replaceDescription(tool, description);
	});
}
//#endregion
export { applyToolAvailabilityDescriptions as t };
