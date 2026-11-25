import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { d as itemStatus, g as unknownItemStatus, n as auditNativeToolTerminalStatus, s as isProjectedNativeToolItem, t as auditNativeToolName, u as itemName } from "./event-projector-items-BCAkXl87.mjs";
import { t as projectCodexWebSearchItem } from "./web-search-item-Bdzc0S8B.mjs";
import { normalizeOptionalString, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { inferToolMetaFromArgs, projectAgentToolActivity } from "openclaw/plugin-sdk/agent-harness-runtime";
import { MAX_TOOL_OUTPUT_DELTA_MESSAGES_PER_ITEM, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS, truncateNativeToolTranscriptText } from "openclaw/plugin-sdk/agent-harness-attempt-runtime";
// extensions/codex/src/app-server/event-projector-tool-output.ts
function collectDynamicToolContentText(contentItems) {
	if (!Array.isArray(contentItems)) return "";
	return contentItems.flatMap((entry) => {
		if (!isJsonObject(entry)) return [];
		const text = readStringField(entry, "text");
		return text ? [text] : [];
	}).join("\n");
}
function readCodexResponseOutput(item) {
	if (typeof item.output === "string") return item.output;
	if (!Array.isArray(item.output)) return;
	return JSON.stringify(item.output.map((part) => isJsonObject(part) && part.type === "input_text" && typeof part.text === "string" ? {
		type: part.type,
		text: part.text
	} : {
		type: isJsonObject(part) ? part.type : "unknown",
		omitted: true
	}), null, 2);
}
const TOOL_PROGRESS_ECHO_PREFIX_MIN_CHARS = 1024;
const TOOL_PROGRESS_ECHO_SIGNATURE_CAP = MAX_TOOL_OUTPUT_DELTA_MESSAGES_PER_ITEM + 4;
function toolOutputRawEchoSignature(text) {
	const trimmed = text.trim();
	if (!trimmed) return;
	return {
		rawLength: trimmed.length,
		rawPrefix: trimmed.slice(0, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS)
	};
}
// extensions/codex/src/app-server/tool-progress-normalization.ts
function resolveCodexToolProgressDetailMode(value) {
	return value === "raw" ? "raw" : "explain";
}
function isCodexCommandBearingToolCall(name, args) {
	const normalizedName = name?.trim().toLowerCase();
	return normalizedName === "exec" || normalizedName === "bash" || normalizedName === "shell" || typeof args?.command === "string" && args.command.trim().length > 0;
}
function asCodexToolArguments(value) {
	return isJsonObject(value) ? value : void 0;
}
// extensions/codex/src/app-server/event-projector-tool-items.ts
const MAX_CODEX_TOOL_PRESENTATION_CHARS = 1e4;
function readInterceptedNativePatchInput(command) {
	if (typeof command !== "string") return;
	const lines = command.replace(/\r\n?/gu, "\n").split("\n");
	const patchStart = lines.indexOf("*** Begin Patch");
	const invocation = /^[\t ]*(?:cd[\t ]+(?:'([^'\n]+)'|([A-Za-z0-9_./-]+))[\t ]+&&[\t ]+)?apply_patch[\t ]*<<-?[\t ]*'([^'\n]+)'[\t ]*$/u.exec(lines[0] ?? "");
	if (!invocation || patchStart !== 1) return;
	const patchEnd = lines.indexOf("*** End Patch", patchStart + 1);
	const cwd = invocation[1] ?? invocation[2];
	const delimiter = invocation[3];
	if (patchEnd < 0 || lines[patchEnd + 1] !== delimiter || lines.slice(patchEnd + 2).some((line) => line.trim().length > 0)) return;
	return {
		input: `${lines.slice(patchStart, patchEnd + 1).join("\n")}\n`,
		...cwd ? { cwd } : {}
	};
}
function projectCodexToolActivity(item, phase, meta) {
	const name = itemName(item) ?? auditNativeToolName(item);
	const summarizeArgs = !(phase === "history" && item.type === "commandExecution" && typeof item.command === "string" && item.command.length > MAX_CODEX_TOOL_PRESENTATION_CHARS);
	let status = phase === "history" ? auditNativeToolTerminalStatus(item) : item.type === "collabAgentToolCall" && item.status === "interrupted" ? "failed" : unknownItemStatus(item) ? "unknown" : itemStatus(item);
	if (phase === "history" && status !== "blocked") {
		if (item.error != null || item.success === false || item.exitCode != null && item.exitCode !== 0) status = "failed";
		else if (status === "unknown" && (item.exitCode === 0 || item.success === true)) status = "completed";
	}
	return name ? projectAgentToolActivity({
		toolCallId: item.id,
		name,
		phase: phase === "history" ? "result" : phase,
		args: item.type === "dynamicToolCall" || !summarizeArgs ? void 0 : itemToolArgs(item),
		meta: meta ?? (phase === "history" && summarizeArgs ? itemMeta(item) : void 0),
		status: status === "cancelled" ? "failed" : status,
		result: { details: itemToolResult(item) },
		...item.type === "collabAgentToolCall" && item.tool === "wait" ? { nativeOperation: "wait" } : {}
	}) : void 0;
}
function isNativePostToolUseRelayItem(item) {
	return [
		"commandExecution",
		"fileChange",
		"mcpToolCall"
	].includes(item.type);
}
function shouldSuppressChannelProgressForItem(item) {
	return isProjectedNativeToolItem(item) || item.type === "dynamicToolCall";
}
function itemToolArgs(item) {
	if (item.type === "commandExecution") return {
		command: item.command,
		...typeof item.cwd === "string" ? { cwd: item.cwd } : {}
	};
	if (item.type === "fileChange") return { changes: itemFileChanges(item, true) };
	if (item.type === "webSearch") return webSearchToolArgs(item);
	if (item.type === "dynamicToolCall" || item.type === "mcpToolCall") return asCodexToolArguments(item.arguments);
}
function isCommandBearingToolItem(item, args) {
	if (item.type === "commandExecution") return true;
	return typeof args?.command === "string" && args.command.trim().length > 0;
}
function webSearchToolArgs(item) {
	const args = projectCodexWebSearchItem(item);
	if (!args.query && !args.url && !args.pattern) args.queryUnavailable = true;
	return args;
}
function itemToolResult(item) {
	if (item.type === "commandExecution") return {
		status: item.status,
		exitCode: item.exitCode,
		durationMs: item.durationMs
	};
	if (item.type === "fileChange") return {
		status: item.status,
		changes: itemFileChanges(item)
	};
	if (item.type === "mcpToolCall") return {
		status: item.status,
		durationMs: item.durationMs,
		...item.error ? { error: item.error } : {},
		...item.result ? { result: item.result } : {}
	};
	if (item.type === "webSearch") return {
		status: itemStatus(item),
		...typeof item.durationMs === "number" ? { durationMs: item.durationMs } : {},
		...webSearchToolArgs(item)
	};
}
function itemFileChangeRecords(item) {
	const changes = item.changes;
	return Array.isArray(changes) ? changes.filter(isJsonObject) : [];
}
function countFileContentLines(content) {
	if (!content) return 0;
	const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
	if (lines.length > 1 && lines.at(-1) === "") lines.pop();
	return lines.length;
}
function fileChangeDiffStat(diff, kind) {
	const kindType = typeof kind === "string" ? kind : isJsonObject(kind) ? normalizeOptionalString(kind.type) : void 0;
	if (kindType === "add") return {
		added: countFileContentLines(diff),
		removed: 0
	};
	if (kindType === "delete") return {
		added: 0,
		removed: countFileContentLines(diff)
	};
	let added = 0;
	let removed = 0;
	let inHunk = false;
	for (const line of diff.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n")) {
		if (line.startsWith("@@")) {
			inHunk = true;
			continue;
		}
		if (!inHunk) continue;
		if (line.startsWith("+")) added += 1;
		else if (line.startsWith("-")) removed += 1;
	}
	return {
		added,
		removed
	};
}
function truncateFileChangeDiffAtLineBoundary(diff, maxChars) {
	if (diff.length <= maxChars) return { diff };
	if (maxChars <= 0) return { diffTruncated: true };
	const boundary = diff.lastIndexOf("\n", maxChars - 1);
	return boundary >= 0 ? {
		diff: diff.slice(0, boundary + 1),
		diffTruncated: true
	} : { diffTruncated: true };
}
function itemFileChanges(item, includeDiff = false) {
	let remainingDiffChars = MAX_CODEX_TOOL_PRESENTATION_CHARS;
	return itemFileChangeRecords(item).flatMap((change) => {
		const path = normalizeOptionalString(change.path);
		if (!path || change.kind === void 0) return [];
		const result = {
			path,
			kind: change.kind
		};
		if (!includeDiff || typeof change.diff !== "string") return [result];
		result.stat = fileChangeDiffStat(change.diff, change.kind);
		const bounded = truncateFileChangeDiffAtLineBoundary(change.diff, remainingDiffChars);
		if (bounded.diff !== void 0) {
			result.diff = bounded.diff;
			remainingDiffChars -= bounded.diff.length;
		}
		if (bounded.diffTruncated) result.diffTruncated = true;
		return [result];
	});
}
function itemToolError(item, status, outputTextByItem) {
	if (status === "blocked") return "codex native tool blocked";
	if (status !== "failed") return;
	return itemOutputText(item, outputTextByItem) ?? "codex native tool failed";
}
function itemMeta(item, detailMode = "explain") {
	if (item.type === "commandExecution" && typeof item.command === "string") return inferToolMetaFromArgs("exec", {
		command: item.command,
		cwd: typeof item.cwd === "string" ? item.cwd : void 0
	}, { detailMode });
	if (item.type === "webSearch") return inferToolMetaFromArgs("web_search", webSearchToolArgs(item), { detailMode });
	const toolName = itemName(item);
	if ((item.type === "dynamicToolCall" || item.type === "mcpToolCall") && toolName) return inferToolMetaFromArgs(toolName, item.arguments, { detailMode });
}
function itemOutputText(item, outputTextByItem) {
	const output = itemObservedOutputText(item, outputTextByItem)?.trim();
	return output ? truncateNativeToolTranscriptText(output, "Codex") : void 0;
}
function itemObservedOutputText(item, outputTextByItem) {
	if (item.type === "commandExecution") return item.aggregatedOutput ?? outputTextByItem?.get(item.id) ?? "";
	if (item.type === "dynamicToolCall") return collectDynamicToolContentText(item.contentItems);
	if (item.type === "mcpToolCall") return item.error ? JSON.stringify(item.error, null, 2) : item.result ? JSON.stringify(item.result, null, 2) : void 0;
}
function itemTranscriptResultText(item, outputTextByItem) {
	const output = itemObservedOutputText(item, outputTextByItem);
	if (output !== void 0) return output;
	const result = itemToolResult(item);
	return (result ? JSON.stringify(result, null, 2) : void 0) ?? itemStatus(item);
}
export { collectDynamicToolContentText as _, itemToolArgs as a, itemTranscriptResultText as c, shouldSuppressChannelProgressForItem as d, asCodexToolArguments as f, TOOL_PROGRESS_ECHO_SIGNATURE_CAP as g, TOOL_PROGRESS_ECHO_PREFIX_MIN_CHARS as h, itemOutputText as i, projectCodexToolActivity as l, resolveCodexToolProgressDetailMode as m, isNativePostToolUseRelayItem as n, itemToolError as o, isCodexCommandBearingToolCall as p, itemMeta as r, itemToolResult as s, isCommandBearingToolItem as t, readInterceptedNativePatchInput as u, readCodexResponseOutput as v, toolOutputRawEchoSignature as y };
