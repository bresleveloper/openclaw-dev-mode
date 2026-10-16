import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { y as redactToolDetail } from "./redact-DJ8j6ADa.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as formatFencedCodeBlock } from "./markdown-code-Buzx6wvi.mjs";
import { t as formatToolAggregate } from "./tool-meta-usuYe6-z.mjs";
//#region src/agents/harness/projection-tool-output.ts
const TOOL_PROGRESS_OUTPUT_MAX_CHARS = 8e3;
const MAX_TOOL_OUTPUT_DELTA_MESSAGES_PER_ITEM = 20;
const TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS = 1e4;
var NativeToolOutputAccumulator = class {
	constructor(nativeToolLabel) {
		this.nativeToolLabel = nativeToolLabel;
		this.items = /* @__PURE__ */ new Map();
		this.textByItem = /* @__PURE__ */ new Map();
	}
	isTruncated(itemId) {
		return (this.items.get(itemId)?.originalLength ?? 0) > TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS;
	}
	append(itemId, delta) {
		const state = this.items.get(itemId) ?? {
			rawPrefix: this.textByItem.get(itemId) ?? "",
			originalLength: this.textByItem.get(itemId)?.length ?? 0,
			normalizedLength: 0,
			trailingWhitespaceLength: 0
		};
		const truncated = this.isTruncated(itemId);
		const originalLength = state.originalLength += delta.length;
		const normalizedLength = updateToolOutputTrimState(state, delta);
		const next = appendBoundedToolTranscriptText(state.rawPrefix, truncated ? "" : delta, originalLength, this.nativeToolLabel);
		state.rawPrefix = next.rawPrefix;
		this.items.set(itemId, state);
		this.textByItem.set(itemId, next.text);
		return {
			text: next.text,
			originalLength,
			normalizedLength,
			rawPrefix: next.rawPrefix
		};
	}
};
function truncateNativeToolTranscriptText(text, nativeToolLabel, originalLength = text.length) {
	if (originalLength <= 1e4 && text.length <= 1e4) return text;
	const notice = toolTranscriptTruncationNotice(originalLength, nativeToolLabel);
	if (notice.length >= 1e4) return notice.slice(1, 10001);
	const textBudget = TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS - notice.length;
	return `${truncateUtf16Safe(text, textBudget)}${notice}`;
}
function formatNativeToolSummary(toolName, meta) {
	const trimmedMeta = meta?.trim();
	return formatToolAggregate(toolName, trimmedMeta ? [trimmedMeta] : void 0, { markdown: true });
}
function formatNativeToolOutput(toolName, meta, output) {
	const formattedOutput = formatToolProgressOutput(output);
	if (!formattedOutput) return formatNativeToolSummary(toolName, meta);
	return `${formatNativeToolSummary(toolName, meta)}\n${formatFencedCodeBlock(formattedOutput, "txt")}`;
}
/**
* Prepare verbose tool output for user-facing progress messages.
*/
function formatToolProgressOutput(output, options) {
	const trimmed = output.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
	if (!trimmed) return;
	const redacted = redactToolDetail(trimmed);
	const maxChars = options?.maxChars ?? 8e3;
	if (redacted.length <= maxChars) return redacted;
	return `${truncateUtf16Safe(redacted, maxChars)}\n...(truncated)...`;
}
function updateToolOutputTrimState(state, delta) {
	const firstNonWhitespace = delta.search(/\S/u);
	if (firstNonWhitespace === -1) state.trailingWhitespaceLength += delta.length;
	else {
		const trimmedLength = delta.trimEnd().length;
		state.normalizedLength += (state.normalizedLength > 0 ? state.trailingWhitespaceLength : -firstNonWhitespace) + trimmedLength;
		state.trailingWhitespaceLength = delta.length - trimmedLength;
	}
	return state.normalizedLength;
}
function appendBoundedToolTranscriptText(currentPrefix, delta, originalLength, nativeToolLabel) {
	if (originalLength <= 1e4) {
		const rawPrefix = currentPrefix + delta;
		return {
			text: rawPrefix,
			rawPrefix
		};
	}
	const notice = toolTranscriptTruncationNotice(originalLength, nativeToolLabel);
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
function toolTranscriptTruncationNotice(originalLength, nativeToolLabel) {
	return `\n${`...(OpenClaw truncated ${nativeToolLabel} native tool output: original ${originalLength} chars, showing ${TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS}; rerun with narrower args.)`}`;
}
//#endregion
export { formatNativeToolOutput as a, truncateNativeToolTranscriptText as c, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS as i, NativeToolOutputAccumulator as n, formatNativeToolSummary as o, TOOL_PROGRESS_OUTPUT_MAX_CHARS as r, formatToolProgressOutput as s, MAX_TOOL_OUTPUT_DELTA_MESSAGES_PER_ITEM as t };
