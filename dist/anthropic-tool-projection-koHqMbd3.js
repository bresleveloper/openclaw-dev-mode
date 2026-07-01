import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as projectRuntimeToolInputSchema } from "./tool-schema-json-projection-DTb7YiHb.js";
//#region src/llm/providers/anthropic-thinking-replay.ts
const ANTHROPIC_OMITTED_REASONING_TEXT = "[assistant reasoning omitted]";
function asReplayMessage(value) {
	return value && typeof value === "object" ? value : void 0;
}
/**
* Anthropic tool results continue the preceding assistant turn. Preserve that
* turn's signed thinking even when the next request disables new thinking.
*/
function findActiveAnthropicToolTurnAssistantIndex(messages) {
	const toolResultIds = /* @__PURE__ */ new Set();
	let index = messages.length - 1;
	while (index >= 0) {
		const message = asReplayMessage(messages[index]);
		if (message?.role !== "toolResult") break;
		if (typeof message.toolCallId === "string") toolResultIds.add(message.toolCallId);
		index -= 1;
	}
	if (toolResultIds.size === 0) return -1;
	const assistant = asReplayMessage(messages[index]);
	if (assistant?.role !== "assistant" || !Array.isArray(assistant.content)) return -1;
	const toolCallIds = /* @__PURE__ */ new Set();
	for (const block of assistant.content) {
		if (!block || typeof block !== "object") continue;
		const record = block;
		if ((record.type === "toolCall" || record.type === "tool_use" || record.type === "function_call") && typeof record.id === "string") toolCallIds.add(record.id);
	}
	return [...toolResultIds].every((toolCallId) => toolCallIds.has(toolCallId)) ? index : -1;
}
//#endregion
//#region src/shared/anthropic-auth-headers.ts
function usesFoundryBearerAuth(model) {
	return model.provider === "microsoft-foundry" && (model.authHeader === true || hasBearerAuthorizationHeader(model.headers));
}
function hasBearerAuthorizationHeader(headers) {
	if (!headers) return false;
	return Object.entries(headers).some(([key, value]) => key.toLowerCase() === "authorization" && /^bearer\s+\S+/i.test(value.trim()));
}
function omitFoundryBearerCredentialHeaders(headers) {
	if (!headers) return;
	const next = {};
	for (const [key, value] of Object.entries(headers)) {
		const lower = key.toLowerCase();
		if (lower === "authorization" || lower === "x-api-key" || lower === "api-key") continue;
		next[key] = value;
	}
	return Object.keys(next).length > 0 ? next : void 0;
}
//#endregion
//#region src/agents/anthropic-tool-projection.ts
function isProviderSupportedViolation(violation) {
	return violation.endsWith(".$dynamicRef") || violation.endsWith(".$dynamicAnchor");
}
/** Snapshots direct/custom tool descriptors before Anthropic payload construction. */
function projectAnthropicTools(tools, toWireName) {
	const projectedTools = [];
	const unavailableOriginalNames = /* @__PURE__ */ new Set();
	for (const tool of tools) {
		let projectedTool;
		let originalName;
		try {
			const name = tool.name;
			originalName = name;
			if (!name) continue;
			const schemaProjection = projectRuntimeToolInputSchema(tool.parameters, `${name}.parameters`);
			if (!isRecord(schemaProjection.schema) || schemaProjection.violations.some((violation) => !isProviderSupportedViolation(violation))) {
				unavailableOriginalNames.add(name);
				continue;
			}
			const properties = schemaProjection.schema.properties;
			const required = schemaProjection.schema.required;
			if (properties !== void 0 && properties !== null && !isRecord(properties) || required !== void 0 && required !== null && (!Array.isArray(required) || required.some((entry) => typeof entry !== "string"))) {
				unavailableOriginalNames.add(name);
				continue;
			}
			let description;
			try {
				description = typeof tool.description === "string" ? tool.description : void 0;
			} catch {}
			projectedTool = {
				originalName: name,
				wireName: toWireName(name),
				...description ? { description } : {},
				inputSchema: {
					type: "object",
					properties: properties ?? {},
					required: required ?? []
				}
			};
		} catch {
			if (originalName) unavailableOriginalNames.add(originalName);
			continue;
		}
		const conflictingTool = projectedTools.find((entry) => entry.wireName === projectedTool.wireName);
		if (conflictingTool && conflictingTool.originalName !== projectedTool.originalName) throw new Error(`Anthropic tool names "${conflictingTool.originalName}" and "${projectedTool.originalName}" both map to "${projectedTool.wireName}"`);
		projectedTools.push(projectedTool);
	}
	return {
		inputToolCount: tools.length,
		unavailableOriginalNames,
		tools: projectedTools
	};
}
/** Keeps forced Anthropic tool choices aligned with the projected wire names. */
function reconcileAnthropicToolChoice(choice, projection) {
	if (projection.inputToolCount === 0) return choice;
	if (choice.type === "tool") {
		const requestedName = choice.name;
		const originalMatch = projection.tools.find((tool) => tool.originalName === requestedName);
		if (originalMatch) return {
			...choice,
			name: originalMatch.wireName
		};
		if (projection.unavailableOriginalNames.has(requestedName)) throw new Error(`Anthropic tool_choice requested unavailable tool "${requestedName}" after schema conversion`);
		const matchedTool = projection.tools.find((tool) => tool.wireName === requestedName);
		if (!matchedTool) throw new Error(`Anthropic tool_choice requested unavailable tool "${requestedName}" after schema conversion`);
		return {
			...choice,
			name: matchedTool.wireName
		};
	}
	if (projection.tools.length === 0) {
		if (choice.type === "auto") return;
		if (choice.type === "any") throw new Error("Anthropic tool_choice requires a tool, but no tools survived schema conversion");
	}
	return choice;
}
/** Maps Claude Code wire names without trusting every direct/custom descriptor. */
function resolveOriginalAnthropicToolName(name, projection) {
	return projection?.tools.find((tool) => tool.wireName === name)?.originalName ?? name;
}
//#endregion
export { usesFoundryBearerAuth as a, omitFoundryBearerCredentialHeaders as i, reconcileAnthropicToolChoice as n, ANTHROPIC_OMITTED_REASONING_TEXT as o, resolveOriginalAnthropicToolName as r, findActiveAnthropicToolTurnAssistantIndex as s, projectAnthropicTools as t };
