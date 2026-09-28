import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { r as isToolResultError } from "./tool-result-error-CWadvCKd.mjs";
//#region src/agents/tool-search-json.ts
/** Convert bridge and transcript values into detached JSON-compatible data. */
function toToolSearchJsonSafe(value) {
	if (value === void 0) return null;
	try {
		const serialized = JSON.stringify(value);
		return serialized === void 0 ? null : JSON.parse(serialized);
	} catch {
		if (value instanceof Error) return value.message;
		if (value === null) return null;
		switch (typeof value) {
			case "string": return value;
			case "number":
			case "boolean":
			case "bigint":
			case "symbol":
			case "function": return String(value);
			default: return Object.prototype.toString.call(value);
		}
	}
}
//#endregion
//#region src/agents/mcp-content.ts
const mcpCodeModeGuestResults = /* @__PURE__ */ new WeakMap();
function setMcpCodeModeGuestResult(result, value) {
	mcpCodeModeGuestResults.set(result, value);
	return result;
}
function setMcpCodeModeGuestResultFromAgentResult(result) {
	return setMcpCodeModeGuestResult(result, {
		content: result.content,
		isError: isToolResultError(result)
	});
}
function transferMcpCodeModeGuestResult(source, target) {
	if (mcpCodeModeGuestResults.has(source)) {
		mcpCodeModeGuestResults.set(target, mcpCodeModeGuestResults.get(source));
		mcpCodeModeGuestResults.delete(source);
	}
	return target;
}
function consumeMcpCodeModeGuestResult(result) {
	const value = mcpCodeModeGuestResults.get(result);
	if (!mcpCodeModeGuestResults.delete(result)) return;
	const safe = toToolSearchJsonSafe(value);
	if (isRecord(safe)) delete safe._meta;
	return safe;
}
function stringifyMcpContent(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
/** Converts untrusted MCP content into the agent text/image contract. */
function mcpContentBlockToAgentContent(block) {
	if (!isRecord(block)) return {
		type: "text",
		text: stringifyMcpContent(block)
	};
	switch (block.type) {
		case "text":
			if (typeof block.text === "string") return {
				type: "text",
				text: block.text
			};
			break;
		case "image":
			if (typeof block.data === "string" && typeof block.mimeType === "string") return {
				type: "image",
				data: block.data,
				mimeType: block.mimeType
			};
			break;
		case "audio":
			if (typeof block.mimeType === "string") return {
				type: "text",
				text: `[audio ${block.mimeType}]`
			};
			break;
		case "resource_link": {
			if (typeof block.uri !== "string") break;
			const label = typeof block.title === "string" ? block.title : typeof block.name === "string" ? block.name : void 0;
			return {
				type: "text",
				text: label ? `[${label}] ${block.uri}` : block.uri
			};
		}
		case "resource":
			if (!isRecord(block.resource) || typeof block.resource.uri !== "string") break;
			return {
				type: "text",
				text: (typeof block.resource.text === "string" ? block.resource.text : void 0) ?? block.resource.uri
			};
	}
	return {
		type: "text",
		text: stringifyMcpContent(block)
	};
}
function projectMcpCallToolResultContent(result) {
	const sourceContent = Array.isArray(result.content) ? result.content : [];
	if (isRecord(result.structuredContent)) {
		let mirroredText;
		return [{
			type: "text",
			text: `structuredContent:\n${JSON.stringify(JSON.parse(stableStringify(result.structuredContent)), null, 2)}`
		}, ...sourceContent.filter((block) => !isRecord(block) || block.type !== "text" || block.text !== (mirroredText ??= JSON.stringify(result.structuredContent, null, 2))).map(mcpContentBlockToAgentContent)];
	}
	return sourceContent.map(mcpContentBlockToAgentContent);
}
/** Projects a raw MCP CallToolResult exactly once at the model boundary. */
function projectMcpCallToolResult(result, details = {}) {
	const isError = result.isError === true;
	const content = projectMcpCallToolResultContent(result);
	return setMcpCodeModeGuestResult({
		content: content.length > 0 ? content : [{
			type: "text",
			text: isError ? "MCP tool failed without returning content." : "MCP tool completed without returning content."
		}],
		details: {
			...details,
			...result.structuredContent !== void 0 ? { structuredContent: result.structuredContent } : {},
			...isError ? { status: "error" } : {}
		}
	}, {
		content: Array.isArray(result.content) ? result.content : [],
		...result.structuredContent !== void 0 ? { structuredContent: result.structuredContent } : {},
		...typeof result.isError === "boolean" ? { isError: result.isError } : {}
	});
}
/** Keep template roles descriptive while projecting its content for the model. */
function projectMcpGetPromptResult(result, details) {
	const content = result.messages.flatMap(({ role, content: block }) => [{
		type: "text",
		text: `${role}:`
	}, block]);
	if (result.description !== void 0) content.unshift({
		type: "text",
		text: result.description
	});
	return setMcpCodeModeGuestResult(projectMcpCallToolResult({ content }, details), toToolSearchJsonSafe(result));
}
//#endregion
export { setMcpCodeModeGuestResultFromAgentResult as a, setMcpCodeModeGuestResult as i, projectMcpCallToolResult as n, transferMcpCodeModeGuestResult as o, projectMcpGetPromptResult as r, toToolSearchJsonSafe as s, consumeMcpCodeModeGuestResult as t };
