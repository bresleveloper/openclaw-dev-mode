import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { T as readNonEmptyStringArray, c as itemName, h as unknownItemStatus, l as itemStatus, m as shouldSynthesizeToolProgressForItem, t as auditNativeToolName, v as normalizeOptionalString$1, w as readNonEmptyString } from "./event-projector-items-C6L_5ZiT.mjs";
import { asNonArrayRecord, normalizeOptionalString, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { formatToolAggregate, formatToolProgressOutput, inferToolMetaFromArgs, projectAgentToolActivity, sanitizeToolArgs } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/event-projector-tool-output.ts
const TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS = 1e4;
const TOOL_PROGRESS_ECHO_PREFIX_MIN_CHARS = 1024;
const TOOL_OUTPUT_TRUNCATION_NOTICE_PREFIX = "...(OpenClaw truncated Codex native tool output";
var ToolOutputAccumulator = class {
	constructor() {
		this.prefixByItem = /* @__PURE__ */ new Map();
		this.originalLengthByItem = /* @__PURE__ */ new Map();
		this.trimStateByItem = /* @__PURE__ */ new Map();
		this.truncatedItemIds = /* @__PURE__ */ new Set();
		this.textByItem = /* @__PURE__ */ new Map();
	}
	isTruncated(itemId) {
		return this.truncatedItemIds.has(itemId);
	}
	append(itemId, delta) {
		const originalLength = (this.originalLengthByItem.get(itemId) ?? this.textByItem.get(itemId)?.length ?? 0) + delta.length;
		this.originalLengthByItem.set(itemId, originalLength);
		const normalizedLength = updateToolOutputTrimState(this.trimStateByItem, itemId, delta);
		const next = appendBoundedToolTranscriptText(this.prefixByItem.get(itemId) ?? this.textByItem.get(itemId) ?? "", this.truncatedItemIds.has(itemId) ? "" : delta, originalLength);
		this.prefixByItem.set(itemId, next.rawPrefix);
		this.textByItem.set(itemId, next.text);
		if (originalLength > 1e4) this.truncatedItemIds.add(itemId);
		return {
			text: next.text,
			originalLength,
			normalizedLength,
			rawPrefix: next.rawPrefix
		};
	}
};
function updateToolOutputTrimState(trimStateByItem, itemId, delta) {
	const state = trimStateByItem.get(itemId) ?? {
		totalLength: 0,
		leadingWhitespaceLength: 0,
		trailingWhitespaceLength: 0,
		sawNonWhitespace: false
	};
	state.totalLength += delta.length;
	const firstNonWhitespace = delta.search(/\S/u);
	if (firstNonWhitespace === -1) {
		if (!state.sawNonWhitespace) state.leadingWhitespaceLength += delta.length;
		state.trailingWhitespaceLength += delta.length;
		trimStateByItem.set(itemId, state);
		return state.sawNonWhitespace ? state.totalLength - state.leadingWhitespaceLength - state.trailingWhitespaceLength : 0;
	}
	if (!state.sawNonWhitespace) {
		state.leadingWhitespaceLength += firstNonWhitespace;
		state.sawNonWhitespace = true;
	}
	state.trailingWhitespaceLength = delta.match(/\s*$/u)?.[0].length ?? 0;
	trimStateByItem.set(itemId, state);
	return state.totalLength - state.leadingWhitespaceLength - state.trailingWhitespaceLength;
}
function toolOutputRawEchoSignature(text) {
	const trimmed = text.trim();
	if (!trimmed) return;
	return {
		rawLength: trimmed.length,
		rawPrefix: trimmed.slice(0, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS)
	};
}
function normalizeToolTranscriptArguments(value) {
	return asNonArrayRecord(value);
}
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
function appendBoundedToolTranscriptText(currentPrefix, delta, originalLength) {
	if (originalLength <= 1e4) {
		const rawPrefix = currentPrefix + delta;
		return {
			text: rawPrefix,
			rawPrefix
		};
	}
	const notice = toolTranscriptTruncationNotice(originalLength);
	if (notice.length >= 1e4) return {
		text: notice.slice(0, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS),
		rawPrefix: ""
	};
	const textBudget = TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS - notice.length;
	const remaining = Math.max(0, textBudget - currentPrefix.length);
	const prefix = remaining > 0 ? `${currentPrefix}${truncateUtf16Safe(delta, remaining)}` : currentPrefix;
	const rawPrefix = truncateUtf16Safe(prefix, textBudget);
	return {
		text: `${rawPrefix}${notice}`,
		rawPrefix
	};
}
function toolTranscriptTruncationNotice(originalLength) {
	return `\n${`${TOOL_OUTPUT_TRUNCATION_NOTICE_PREFIX}: original ${originalLength} chars, showing ${TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS}; rerun with narrower args.)`}`;
}
function truncateToolTranscriptText(text, originalLength = text.length) {
	if (originalLength <= 1e4 && text.length <= 1e4) return text;
	const notice = toolTranscriptTruncationNotice(originalLength);
	if (notice.length >= 1e4) return notice.slice(1, 10001);
	const textBudget = TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS - notice.length;
	return `${truncateUtf16Safe(text, textBudget)}${notice}`;
}
function formatToolSummary(toolName, meta) {
	const trimmedMeta = meta?.trim();
	return formatToolAggregate(toolName, trimmedMeta ? [trimmedMeta] : void 0, { markdown: true });
}
function formatToolOutput(toolName, meta, output) {
	const formattedOutput = formatToolProgressOutput(output);
	if (!formattedOutput) return formatToolSummary(toolName, meta);
	const fence = markdownFenceForText(formattedOutput);
	return `${formatToolSummary(toolName, meta)}\n${fence}txt\n${formattedOutput}\n${fence}`;
}
function markdownFenceForText(text) {
	return "`".repeat(Math.max(3, longestBacktickRun(text) + 1));
}
function longestBacktickRun(value) {
	let longest = 0;
	let current = 0;
	for (const char of value) {
		if (char === "`") {
			current += 1;
			longest = Math.max(longest, current);
			continue;
		}
		current = 0;
	}
	return longest;
}
//#endregion
//#region extensions/codex/src/app-server/tool-progress-normalization.ts
/**
* Normalizes and sanitizes Codex dynamic-tool progress payloads before they are
* emitted into OpenClaw events or logs.
*/
/** Maps OpenClaw tool-progress config to the mode used by Codex progress metadata. */
function resolveCodexToolProgressDetailMode(value) {
	return value === "raw" ? "raw" : "explain";
}
function isCodexCommandBearingToolCall(name, args) {
	const normalizedName = name?.trim().toLowerCase();
	return normalizedName === "exec" || normalizedName === "bash" || normalizedName === "shell" || typeof args?.command === "string" && args.command.trim().length > 0;
}
/** Sanitizes a record-shaped Codex agent event payload. */
function sanitizeCodexAgentEventRecord(value) {
	return sanitizeToolArgs(value);
}
/** Sanitizes dynamic-tool arguments before diagnostic/event emission. */
function sanitizeCodexToolArguments(value) {
	if (!isJsonObject(value)) return;
	return sanitizeCodexAgentEventRecord(value);
}
/** Sanitizes a Codex dynamic-tool response before diagnostic/event emission. */
function sanitizeCodexToolResponse(response) {
	return sanitizeCodexAgentEventRecord({ ...response });
}
/** Infers compact human-readable tool metadata from Codex dynamic-tool arguments. */
function inferCodexDynamicToolMeta(call, detailMode) {
	return inferToolMetaFromArgs(call.tool, call.arguments, { detailMode });
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-tool-items.ts
const CODE_MODE_NATIVE_PATCH_SOURCE_RE = /^\s*(?:\/\/[^\r\n]*\r?\n\s*)?(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*await\s+tools\.apply_patch\(\s*("(?:\\[\s\S]|[^"\\])*")\s*\)\s*;?\s*text\(\s*\1\s*\)\s*;?\s*$/u;
function readCodeModeNativePatchInput(source) {
	if (typeof source !== "string") return;
	const match = CODE_MODE_NATIVE_PATCH_SOURCE_RE.exec(source);
	if (!match?.[2]) return;
	try {
		const patch = JSON.parse(match[2]);
		return typeof patch === "string" && /^\*\*\* Begin Patch\r?\n[\s\S]*\r?\n\*\*\* End Patch(?:\r?\n)?$/u.test(patch) ? patch : void 0;
	} catch {
		return;
	}
}
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
	return name ? projectAgentToolActivity({
		toolCallId: item.id,
		name,
		phase,
		args: item.type === "dynamicToolCall" ? void 0 : itemToolArgs(item),
		meta,
		status: item.type === "collabAgentToolCall" && item.status === "interrupted" ? "failed" : unknownItemStatus(item) ? "unknown" : itemStatus(item),
		result: { details: itemToolResult(item).result },
		...item.type === "collabAgentToolCall" && item.tool === "wait" ? { nativeOperation: "wait" } : {}
	}) : void 0;
}
function isNativePostToolUseRelayItem(item) {
	switch (item.type) {
		case "commandExecution":
		case "fileChange":
		case "mcpToolCall": return true;
		default: return false;
	}
}
function shouldSuppressChannelProgressForItem(item) {
	if (shouldSynthesizeToolProgressForItem(item)) return true;
	return item.type === "dynamicToolCall";
}
function itemToolArgs(item) {
	if (item.type === "commandExecution") return sanitizeCodexAgentEventRecord({
		command: item.command,
		...typeof item.cwd === "string" ? { cwd: item.cwd } : {}
	});
	if (item.type === "fileChange") return sanitizeCodexAgentEventRecord({ changes: itemFileChangesForTranscript(item) });
	if (item.type === "webSearch") return webSearchToolArgs(item);
	if (item.type === "dynamicToolCall" || item.type === "mcpToolCall") return sanitizeCodexToolArguments(item.arguments);
}
function isCommandBearingToolItem(item, args) {
	if (item.type === "commandExecution") return true;
	return typeof args?.command === "string" && args.command.trim().length > 0;
}
function webSearchToolArgs(item) {
	const action = isJsonObject(item.action) ? item.action : void 0;
	const actionType = action ? readNonEmptyString(action, "type") : void 0;
	const queries = action && actionType === "search" ? readNonEmptyStringArray(action, "queries") : [];
	const query = normalizeOptionalString$1(item.query) ?? (action && actionType === "search" ? readNonEmptyString(action, "query") : void 0) ?? queries[0];
	const url = action ? readNonEmptyString(action, "url") : void 0;
	const pattern = action ? readNonEmptyString(action, "pattern") : void 0;
	const args = {};
	if (query) args.query = query;
	if (queries.length > 0) args.queries = queries;
	if (actionType && actionType !== "search") args.action = actionType;
	if (url) args.url = url;
	if (pattern) args.pattern = pattern;
	if (!query && !url && !pattern) args.queryUnavailable = true;
	return sanitizeCodexAgentEventRecord(args);
}
function itemToolResult(item) {
	if (item.type === "commandExecution") return { result: sanitizeCodexAgentEventRecord({
		status: item.status,
		exitCode: item.exitCode,
		durationMs: item.durationMs
	}) };
	if (item.type === "fileChange") return { result: sanitizeCodexAgentEventRecord({
		status: item.status,
		changes: itemFileChanges(item)
	}) };
	if (item.type === "mcpToolCall") return { result: sanitizeCodexAgentEventRecord({
		status: item.status,
		durationMs: item.durationMs,
		...item.error ? { error: item.error } : {},
		...item.result ? { result: item.result } : {}
	}) };
	if (item.type === "webSearch") return { result: webSearchToolResult(item) };
	return {};
}
function webSearchToolResult(item) {
	return sanitizeCodexAgentEventRecord({
		status: itemStatus(item),
		...typeof item.durationMs === "number" ? { durationMs: item.durationMs } : {},
		...webSearchToolArgs(item)
	});
}
function itemFileChangeRecords(item) {
	const changes = item.changes;
	return Array.isArray(changes) ? changes.filter(isJsonObject) : [];
}
function itemFileChanges(item) {
	return itemFileChangeRecords(item).flatMap((change) => {
		const path = normalizeOptionalString$1(change.path);
		if (!path || change.kind === void 0) return [];
		return [{
			path,
			kind: change.kind
		}];
	});
}
function fileChangeKindType(kind) {
	if (typeof kind === "string") return kind;
	return isJsonObject(kind) ? normalizeOptionalString$1(kind.type) : void 0;
}
function countFileContentLines(content) {
	if (!content) return 0;
	const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
	if (lines.length > 1 && lines.at(-1) === "") lines.pop();
	return lines.length;
}
function fileChangeDiffStat(diff, kind) {
	const kindType = fileChangeKindType(kind);
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
function itemFileChangesForTranscript(item) {
	let remainingDiffChars = 1e4;
	return itemFileChangeRecords(item).flatMap((change) => {
		const path = normalizeOptionalString$1(change.path);
		if (!path || change.kind === void 0) return [];
		const result = {
			path,
			kind: change.kind
		};
		if (typeof change.diff !== "string") return [result];
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
	return output ? truncateToolTranscriptText(output) : void 0;
}
function itemObservedOutputText(item, outputTextByItem) {
	if (item.type === "commandExecution") return item.aggregatedOutput ?? outputTextByItem?.get(item.id);
	if (item.type === "dynamicToolCall") return collectDynamicToolContentText(item.contentItems);
	if (item.type === "mcpToolCall") return item.error ? stringifyJsonValue(item.error) : item.result ? stringifyJsonValue(item.result) : void 0;
}
function itemTranscriptResultText(item, outputTextByItem) {
	const output = itemObservedOutputText(item, outputTextByItem);
	if (output !== void 0) return output;
	const result = itemToolResult(item).result;
	return (result ? stringifyJsonValue(result) : void 0) ?? itemStatus(item);
}
function stringifyJsonValue(value) {
	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return;
	}
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-task-ids.ts
/** Task runtime namespace for Codex native subagent task rows. */
const CODEX_NATIVE_SUBAGENT_RUNTIME = "subagent";
/** Task kind used to distinguish native Codex subagents from other subagent runtimes. */
const CODEX_NATIVE_SUBAGENT_TASK_KIND = "codex-native";
/** Run id prefix for task rows keyed by Codex child thread ids. */
const CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX = "codex-thread:";
/** Initial tasks keep their shipped locator; later assignments belong to a native turn. */
function codexNativeSubagentRunId(threadId, turnId) {
	return `${CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX}${threadId.trim()}${turnId ? `:turn:${turnId}` : ""}`;
}
function readCodexNativeSubagentRunId(runId) {
	if (!runId?.startsWith("codex-thread:")) return;
	const [threadId, turnId] = runId.slice(13).split(":turn:");
	return threadId?.trim() ? {
		threadId,
		...turnId ? { turnId } : {}
	} : void 0;
}
function readNativeTaskAssignment(task) {
	const runId = task.runId;
	const identity = readCodexNativeSubagentRunId(runId);
	if (!runId || !identity) return;
	const storedTurnId = isJsonObject(task.detail) ? normalizeOptionalString(readStringField(task.detail, "nativeTurnId")) : void 0;
	return {
		runId,
		childThreadId: identity.threadId,
		nativeTurnId: storedTurnId ?? identity.turnId,
		initialTurnId: identity.turnId
	};
}
function readNativeSubagentThreadIds(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => typeof entry === "string" && entry.trim() !== "");
}
//#endregion
export { formatToolSummary as A, sanitizeCodexToolArguments as C, ToolOutputAccumulator as D, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS as E, readCodexResponseOutput as M, toolOutputRawEchoSignature as N, collectDynamicToolContentText as O, truncateToolTranscriptText as P, resolveCodexToolProgressDetailMode as S, TOOL_PROGRESS_ECHO_PREFIX_MIN_CHARS as T, readCodeModeNativePatchInput as _, readCodexNativeSubagentRunId as a, inferCodexDynamicToolMeta as b, isCommandBearingToolItem as c, itemOutputText as d, itemToolArgs as f, projectCodexToolActivity as g, itemTranscriptResultText as h, codexNativeSubagentRunId as i, normalizeToolTranscriptArguments as j, formatToolOutput as k, isNativePostToolUseRelayItem as l, itemToolResult as m, CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX as n, readNativeSubagentThreadIds as o, itemToolError as p, CODEX_NATIVE_SUBAGENT_TASK_KIND as r, readNativeTaskAssignment as s, CODEX_NATIVE_SUBAGENT_RUNTIME as t, itemMeta as u, readInterceptedNativePatchInput as v, sanitizeCodexToolResponse as w, isCodexCommandBearingToolCall as x, shouldSuppressChannelProgressForItem as y };
