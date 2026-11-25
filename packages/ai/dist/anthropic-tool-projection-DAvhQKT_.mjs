import { o as isRecord, s as isStringArray } from "./record-coerce-BgUo6bj4.mjs";
import { r as sortPromptCacheToolsByName } from "./prompt-cache-stability-oTx0nIsh.mjs";
import { _ as SCHEMA_ARRAY_KEYS, b as SCHEMA_OBJECT_KEYS, f as inheritToolSchemaTruncation, i as publishRuntimeToolInputSchema, r as projectRuntimeToolInputSchema, t as getPublishedRuntimeToolInputSchema, v as SCHEMA_MAP_KEYS } from "./tool-schema-json-projection-Do42m3b7.mjs";
// packages/ai/src/providers/anthropic-tool-projection.ts
const CLAUDE_CODE_TOOL_LOOKUP = new Map([
	"Read",
	"Write",
	"Edit",
	"Bash",
	"Grep",
	"Glob",
	"AskUserQuestion",
	"EnterPlanMode",
	"ExitPlanMode",
	"KillShell",
	"NotebookEdit",
	"Skill",
	"Task",
	"TaskOutput",
	"TodoWrite",
	"WebFetch",
	"WebSearch"
].map((name) => [name.toLowerCase(), name]));
/** Preserve Claude Code's canonical tool casing for subscription OAuth requests. */
function toClaudeCodeToolName(name) {
	return CLAUDE_CODE_TOOL_LOOKUP.get(name.toLowerCase()) ?? name;
}
/** Anthropic rejects forced tools while extended thinking is enabled. */
function normalizeAnthropicToolChoice(thinkingEnabled, toolChoice) {
	if (thinkingEnabled && (toolChoice === "any" || typeof toolChoice === "object" && toolChoice.type === "tool")) return { type: "auto" };
	return typeof toolChoice === "string" ? { type: toolChoice } : toolChoice;
}
/** Anthropic tool identifiers accept only ASCII word characters and dashes. */
function normalizeAnthropicToolCallId(id) {
	return id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
}
function isProviderSupportedViolation(violation) {
	return violation.endsWith(".$dynamicRef") || violation.endsWith(".$dynamicAnchor");
}
/** Normalize the detached JSON projection and report tuple changes to enclosing schemas. */
function normalizeAnthropicJsonSchema(schema) {
	if (!isRecord(schema)) return false;
	let changed = false;
	for (const [key, value] of Object.entries(schema)) {
		if (key !== "additionalItems" && SCHEMA_OBJECT_KEYS.has(key) && !Array.isArray(value)) {
			changed = normalizeAnthropicJsonSchema(value) || changed;
			continue;
		}
		if (key !== "items" && SCHEMA_ARRAY_KEYS.has(key) && Array.isArray(value)) {
			for (const entry of value) changed = normalizeAnthropicJsonSchema(entry) || changed;
			continue;
		}
		if (SCHEMA_MAP_KEYS.has(key) && isRecord(value)) for (const entry of Object.values(value)) changed = normalizeAnthropicJsonSchema(entry) || changed;
	}
	if (Array.isArray(schema.items)) {
		for (const entry of schema.items) normalizeAnthropicJsonSchema(entry);
		schema.prefixItems = schema.items;
		const additionalItems = schema.additionalItems;
		if (typeof additionalItems === "boolean" || isRecord(additionalItems)) {
			normalizeAnthropicJsonSchema(additionalItems);
			schema.items = additionalItems;
		} else delete schema.items;
		delete schema.additionalItems;
		changed = true;
	}
	if (changed) delete schema.$schema;
	return changed;
}
const publishedAnthropicSchemas = /* @__PURE__ */ new WeakMap();
/** Prepare a detached JSON projection for Anthropic's tuple dialect. */
function prepareAnthropicInputSchema(schema) {
	const published = getPublishedRuntimeToolInputSchema(schema);
	const cached = published ? publishedAnthropicSchemas.get(schema) : void 0;
	if (cached !== void 0) return cached;
	const normalized = published ? JSON.parse(published.json) : schema;
	normalizeAnthropicJsonSchema(normalized);
	const properties = normalized.properties;
	const required = normalized.required;
	if (properties !== void 0 && properties !== null && !isRecord(properties) || required !== void 0 && required !== null && !isStringArray(required)) {
		if (published) publishedAnthropicSchemas.set(schema, null);
		return null;
	}
	const inputSchema = {
		...normalized,
		type: "object",
		properties: properties ?? {},
		required: required ?? []
	};
	inheritToolSchemaTruncation(schema, inputSchema);
	if (!published) return inputSchema;
	const result = publishRuntimeToolInputSchema(inputSchema).schema;
	publishedAnthropicSchemas.set(schema, result);
	return result;
}
/** Snapshots direct/custom tool descriptors before Anthropic payload construction. */
function projectAnthropicTools(tools, toWireName) {
	const projectedTools = [];
	const originalNameByWireName = /* @__PURE__ */ new Map();
	const unavailableOriginalNames = /* @__PURE__ */ new Set();
	for (const tool of tools) {
		const name = tool.name;
		if (!name) continue;
		const schemaProjection = projectRuntimeToolInputSchema(tool.parameters, `${name}.parameters`, name);
		if (!isRecord(schemaProjection.schema) || schemaProjection.violations.some((violation) => !isProviderSupportedViolation(violation))) {
			unavailableOriginalNames.add(name);
			continue;
		}
		const inputSchema = prepareAnthropicInputSchema(schemaProjection.schema);
		if (!inputSchema) {
			unavailableOriginalNames.add(name);
			continue;
		}
		const descriptionValue = tool.description;
		const description = typeof descriptionValue === "string" ? descriptionValue : void 0;
		const projectedTool = {
			originalName: name,
			wireName: toWireName(name),
			...description ? { description } : {},
			inputSchema
		};
		const conflictingName = originalNameByWireName.get(projectedTool.wireName);
		if (conflictingName !== void 0 && conflictingName !== projectedTool.originalName) throw new Error(`Anthropic tool names "${conflictingName}" and "${projectedTool.originalName}" both map to "${projectedTool.wireName}"`);
		originalNameByWireName.set(projectedTool.wireName, projectedTool.originalName);
		projectedTools.push(projectedTool);
	}
	return {
		inputToolCount: tools.length,
		unavailableOriginalNames,
		tools: sortPromptCacheToolsByName(projectedTools)
	};
}
/** Keeps forced Anthropic tool choices aligned with the projected wire names. */
function reconcileAnthropicToolChoice(choice, projection) {
	if (projection.inputToolCount === 0) return choice;
	if (choice.type === "tool") {
		const requestedName = choice.name;
		const matchedTool = projection.tools.find((tool) => tool.originalName === requestedName) ?? (projection.unavailableOriginalNames.has(requestedName) ? void 0 : projection.tools.find((tool) => tool.wireName === requestedName));
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
export { reconcileAnthropicToolChoice as a, projectAnthropicTools as i, normalizeAnthropicToolChoice as n, resolveOriginalAnthropicToolName as o, prepareAnthropicInputSchema as r, toClaudeCodeToolName as s, normalizeAnthropicToolCallId as t };
