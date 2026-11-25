import { readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/codex/src/app-server/event-projector-items.ts
const itemStatuses = /* @__PURE__ */ new Map([
	["completed", "completed"],
	["failed", "failed"],
	["error", "failed"],
	["interrupted", "failed"],
	["declined", "blocked"],
	["inProgress", "running"],
	["in_progress", "running"],
	["running", "running"]
]);
const itemMetadata = /* @__PURE__ */ new Map([
	["dynamicToolCall", {
		kind: "tool",
		title: "Tool"
	}],
	["mcpToolCall", {
		kind: "tool",
		title: "MCP tool",
		projectedTool: true
	}],
	["commandExecution", {
		kind: "command",
		title: "Command",
		toolName: "bash",
		projectedTool: true
	}],
	["fileChange", {
		kind: "patch",
		title: "File change",
		toolName: "apply_patch",
		projectedTool: true
	}],
	["webSearch", {
		kind: "search",
		title: "Web search",
		toolName: "web_search",
		projectedTool: true
	}],
	["contextCompaction", {
		kind: "analysis",
		title: "Context compaction"
	}],
	["reasoning", {
		kind: "analysis",
		title: "Reasoning"
	}],
	["collabAgentToolCall", { clearsTerminal: true }],
	["imageGeneration", {
		auditName: "image_generation",
		clearsTerminal: true
	}],
	["imageView", {
		auditName: "image_view",
		clearsTerminal: true
	}],
	["sleep", { auditName: "sleep" }]
]);
function matchesCodexSnapshotTurn(item, turnId) {
	const itemTurnId = readStringField(item, "turnId");
	return itemTurnId === void 0 || itemTurnId === turnId;
}
function itemKind(item) {
	return itemMetadata.get(item.type)?.kind;
}
function itemTitle(item) {
	return itemMetadata.get(item.type)?.title ?? item.type;
}
function itemStatus(item) {
	return itemStatuses.get(readStringField(item, "status") ?? "") ?? "completed";
}
function unknownItemStatus(item) {
	const status = readStringField(item, "status");
	return status === void 0 || itemStatuses.has(status) ? void 0 : status;
}
function auditNativeToolTerminalStatus(item) {
	if (item.type === "imageView" || item.type === "sleep") return "completed";
	const status = itemStatuses.get(readStringField(item, "status") ?? "");
	return status === void 0 || status === "running" ? "unknown" : status;
}
function auditNativeToolUnfinishedStatus(item) {
	return item.type === "webSearch" || item.type === "imageGeneration" ? "unknown" : "failed";
}
function isNonSuccessItemStatus(status) {
	return status === "failed" || status === "blocked";
}
function itemName(item) {
	if (item.type === "dynamicToolCall" && typeof item.tool === "string") return item.tool;
	if (item.type === "mcpToolCall" && typeof item.tool === "string") {
		const server = typeof item.server === "string" ? item.server : void 0;
		return server ? `${server}.${item.tool}` : item.tool;
	}
	return itemMetadata.get(item.type)?.toolName;
}
function auditNativeToolName(item) {
	if (item.type === "dynamicToolCall") return;
	const progressName = itemName(item);
	if (progressName) return progressName;
	if (item.type === "collabAgentToolCall") return typeof item.tool === "string" && item.tool.trim() ? `collab.${item.tool.trim()}` : "collab_agent";
	return itemMetadata.get(item.type)?.auditName;
}
function isSideEffectingNativeToolItem(item) {
	return itemStatus(item) !== "blocked" && (isMutatingNativeToolItem(item) || item.type === "mcpToolCall");
}
function isProjectedNativeToolItem(item) {
	return itemMetadata.get(item.type)?.projectedTool === true;
}
function isMutatingNativeToolItem(item) {
	if (item.type === "commandExecution") return true;
	return item.type === "fileChange" || item.type === "collabAgentToolCall" || item.type === "imageGeneration";
}
function shouldClearTerminalPresentationForNativeItem(item) {
	const metadata = itemMetadata.get(item.type);
	return metadata?.projectedTool === true || metadata?.clearsTerminal === true;
}
function shouldAdvancePersistableAssistantBarrier(item) {
	return shouldClearTerminalPresentationForNativeItem(item) || item.type === "dynamicToolCall" || item.type === "sleep";
}
function createAssistantItemSuppression(hasDeliveredFinal) {
	const suppressedIds = /* @__PURE__ */ new Set();
	return (itemId) => {
		if (hasDeliveredFinal()) {
			if (itemId) suppressedIds.add(itemId);
			return true;
		}
		return itemId !== void 0 && suppressedIds.has(itemId);
	};
}
export { isMutatingNativeToolItem as a, isSideEffectingNativeToolItem as c, itemStatus as d, itemTitle as f, unknownItemStatus as g, shouldClearTerminalPresentationForNativeItem as h, createAssistantItemSuppression as i, itemKind as l, shouldAdvancePersistableAssistantBarrier as m, auditNativeToolTerminalStatus as n, isNonSuccessItemStatus as o, matchesCodexSnapshotTurn as p, auditNativeToolUnfinishedStatus as r, isProjectedNativeToolItem as s, auditNativeToolName as t, itemName as u };
