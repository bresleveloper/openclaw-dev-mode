import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { A as formatRawAssistantErrorForUi } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as stripAnsi } from "./ansi-CWsy0bu4.mjs";
import { a as stripLeadingInboundMetadata } from "./strip-inbound-meta-Cqak81y4.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { t as hasTerminalControl } from "./safe-text-CBmKtmbt.mjs";
import { n as appendReplyMediaFailures } from "./reply-payload-B2ZQhznY.mjs";
import { d as readPersistedMediaFacts, o as isImageMediaFact } from "./media-facts-BEHTU0wM.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-D14VlZZc.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
//#region src/tui/tui-formatters.ts
const REPLACEMENT_CHAR_RE = /\uFFFD/g;
const RENDER_CONTROL_CHARS_RE = new RegExp(String.raw`[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]`, "g");
const BINARY_LINE_REPLACEMENT_THRESHOLD = 12;
const MAX_TUI_ABORT_DIAGNOSTIC_LENGTH = 160;
const RTL_SCRIPT_RE = /[\u0590-\u08ff\ufb1d-\ufdff\ufe70-\ufefc]/;
const BIDI_CONTROL_RE = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/;
const BIDI_CONTROL_GLOBAL_RE = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;
const RTL_ISOLATE_START = "⁧";
const RTL_ISOLATE_END = "⁩";
/** Keep routing/provider/profile details in session state, not the compact footer. */
function formatModelFooter(params) {
	const model = splitTrailingAuthProfile(params.model ?? "").model || "unknown";
	const thinkingLevel = params.thinkingLevel?.trim();
	return thinkingLevel && thinkingLevel !== "off" ? `${model} ${thinkingLevel}` : model;
}
/** Format the compact TUI footer from authoritative session and process state. */
function formatTuiFooter(params) {
	const { sessionInfo } = params;
	const fastLabel = sessionInfo.fastMode === "auto" ? "fast:auto" : sessionInfo.fastMode === true ? "fast" : null;
	const verbose = sessionInfo.verboseLevel ?? "off";
	const trace = sessionInfo.traceLevel ?? "off";
	const reasoning = sessionInfo.reasoningLevel ?? "off";
	const traceLabel = trace === "raw" ? "trace:raw" : trace === "on" ? "trace" : null;
	const reasoningLabel = reasoning === "on" ? "reasoning" : reasoning === "stream" ? "reasoning:stream" : null;
	return sanitizeRenderableLine([
		`agent ${params.agentLabel}`,
		`session ${params.sessionLabel}`,
		formatModelFooter({
			model: sessionInfo.model,
			thinkingLevel: params.thinkingLevel
		}),
		formatGoalFooter(sessionInfo.goal),
		fastLabel,
		verbose !== "off" ? `verbose ${verbose}` : null,
		traceLabel,
		reasoningLabel,
		`deliver:${params.deliver ? "on" : "off"}`,
		formatTokens(sessionInfo.totalTokens ?? null, sessionInfo.contextTokens ?? null)
	].filter(Boolean).join(" | "));
}
function sanitizeTerminalControlsAndBinary(text) {
	const withoutControlChars = (text.includes("\x1B") || text.includes("") || text.includes("") ? stripAnsi(text) : text).replace(RENDER_CONTROL_CHARS_RE, "");
	const withoutBidiControls = BIDI_CONTROL_RE.test(withoutControlChars) ? withoutControlChars.replace(BIDI_CONTROL_GLOBAL_RE, "") : withoutControlChars;
	return withoutBidiControls.includes("�") ? withoutBidiControls.split("\n").map((line) => redactBinaryLikeLine(line)).join("\n") : withoutBidiControls;
}
function isTerminalSafeAutocompleteValue(value) {
	return !hasTerminalControl(value) && !BIDI_CONTROL_RE.test(value);
}
function redactBinaryLikeLine(line) {
	const replacementCount = (line.match(REPLACEMENT_CHAR_RE) || []).length;
	if (replacementCount >= BINARY_LINE_REPLACEMENT_THRESHOLD && replacementCount * 2 >= line.length) return "[binary data omitted]";
	return line;
}
function isolateRtlLine(line) {
	if (!RTL_SCRIPT_RE.test(line)) return line;
	return `${RTL_ISOLATE_START}${line}${RTL_ISOLATE_END}`;
}
function isolateRtlRenderedLine(line) {
	if (!RTL_SCRIPT_RE.test(line) || !RTL_SCRIPT_RE.test(stripAnsi(line))) return line;
	const padding = line.match(/^(\s*)(.*\S)(\s*)$/u);
	if (!padding) return line;
	return `${padding[1]}${RTL_ISOLATE_START}${padding[2]}${RTL_ISOLATE_END}${padding[3]}`;
}
function applyRtlIsolation(text) {
	if (!RTL_SCRIPT_RE.test(text)) return text;
	return text.split("\n").map((line) => isolateRtlLine(line)).join("\n");
}
function sanitizeRenderableText(text) {
	return applyRtlIsolation(sanitizeTerminalControlsAndBinary(text));
}
function sanitizeRenderableLine(text) {
	return applyRtlIsolation(sanitizeTerminalControlsAndBinary(text).replace(/\s+/gu, " ").trim());
}
/** Render error causes without exposing secrets or terminal control sequences. */
function formatTuiErrorMessage(error) {
	return sanitizeRenderableText(formatErrorMessage(error));
}
function formatTuiAbortDiagnostic(value) {
	const diagnostic = sanitizeRenderableText(value ?? "").replace(/\s+/g, " ").trim();
	return diagnostic ? diagnostic.length > MAX_TUI_ABORT_DIAGNOSTIC_LENGTH ? `${truncateUtf16Safe(diagnostic, 159)}…` : diagnostic : void 0;
}
function resolveFinalAssistantText(params) {
	const contentText = [params.finalText, params.streamedText].find((text) => text?.trim()) ?? (params.errorMessage?.trim() ? formatRawAssistantErrorForUi(params.errorMessage) : "");
	return formatTuiAssistantContent(params.message, contentText) || "(no output)";
}
function composeThinkingAndContent(params) {
	const thinkingText = params.showThinking ? params.thinkingText?.trim() ?? "" : "";
	const contentText = params.contentText?.trim() ?? "";
	return thinkingText ? `[thinking]\n${thinkingText}${contentText ? `\n\n${contentText}` : ""}` : contentText;
}
const TUI_ATTACHMENT_BLOCK_KINDS = {
	image: "image",
	input_image: "image",
	image_url: "image",
	audio: "audio",
	video: "video",
	file: "file",
	document: "file"
};
function resolveTuiAttachmentBlockKind(block) {
	const type = typeof block.type === "string" ? block.type : "";
	const directKind = TUI_ATTACHMENT_BLOCK_KINDS[type];
	if (directKind) return directKind;
	if (type !== "attachment") return null;
	const attachment = asOptionalObjectRecord(block.attachment);
	const declaredKind = attachment?.kind;
	if (declaredKind === "image" || declaredKind === "sticker") return "image";
	if (declaredKind === "audio" || declaredKind === "video") return declaredKind;
	const mimeKind = typeof attachment?.mimeType === "string" ? attachment.mimeType.split("/", 1)[0] : "";
	return mimeKind === "image" || mimeKind === "audio" || mimeKind === "video" ? mimeKind : "file";
}
/** Keep optimistic session projection aligned with the terminal's attachment renderer. */
function isTuiAssistantAttachmentBlock(block) {
	const entry = asOptionalObjectRecord(block);
	return entry ? resolveTuiAttachmentBlockKind(entry) !== null : false;
}
function resolvePersistedTuiAttachmentKind(fact) {
	if (isImageMediaFact(fact)) return "image";
	if (fact.kind === "audio" || fact.kind === "video") return fact.kind;
	return "file";
}
/** Render attachment summaries and failures without exposing source metadata. */
function formatTuiAssistantContent(message, contentText) {
	const record = asOptionalObjectRecord(message);
	const content = record?.content;
	const failures = [];
	const contentAttachments = contentText ? void 0 : [];
	for (const block of Array.isArray(content) ? content : []) {
		const entry = asOptionalObjectRecord(block);
		if (contentAttachments && entry) {
			const kind = resolveTuiAttachmentBlockKind(entry);
			if (kind) contentAttachments.push(`Attached ${kind}`);
		}
		const attachment = entry?.type === "attachment_error" ? asOptionalObjectRecord(entry.attachment) : void 0;
		const code = attachment?.code;
		const kind = attachment?.kind;
		if ((code === "file-not-found" || code === "unsupported-format" || code === "delivery-failed") && (kind === "image" || kind === "audio" || kind === "video" || kind === "document")) failures.push({
			code,
			kind,
			label: `${kind === "document" ? "file" : kind} attachment`
		});
	}
	let text = contentText || contentAttachments?.join("\n") || "";
	if (!text && record) {
		text = (readPersistedMediaFacts(record) ?? []).filter((fact) => fact.path || fact.url || fact.contentType || fact.kind).map((fact) => `Attached ${resolvePersistedTuiAttachmentKind(fact)}`).join("\n");
		if (!text) text = [...typeof record.mediaUrl === "string" && record.mediaUrl.trim() ? [record.mediaUrl] : [], ...Array.isArray(record.mediaUrls) ? record.mediaUrls.filter((value) => typeof value === "string" && value.trim()) : []].map(() => "Attached media").join("\n");
	}
	return appendReplyMediaFailures(text, failures) ?? "";
}
function resolveMessageRecord(message) {
	const record = asOptionalObjectRecord(message);
	if (!record) return;
	return {
		record,
		content: record.content
	};
}
function formatAssistantErrorFromRecord(record) {
	if ((typeof record.stopReason === "string" ? record.stopReason : "") !== "error") return "";
	const errorMessage = typeof record.errorMessage === "string" ? record.errorMessage : "";
	return formatRawAssistantErrorForUi(errorMessage);
}
function collectBlockStrings(params) {
	if (!Array.isArray(params.content)) return [];
	const parts = [];
	for (const block of params.content) {
		if (!block || typeof block !== "object") continue;
		const rec = block;
		if (rec.type === params.blockType && typeof rec[params.valueKey] === "string") parts.push(rec[params.valueKey]);
	}
	return parts;
}
/**
* Extract ONLY thinking blocks from message content.
* Model-agnostic: returns empty string if no thinking blocks exist.
*/
function extractThinkingFromMessage(message) {
	const resolved = resolveMessageRecord(message);
	if (!resolved) return "";
	const { content } = resolved;
	if (typeof content === "string") return "";
	return collectBlockStrings({
		content,
		blockType: "thinking",
		valueKey: "thinking"
	}).join("\n").trim();
}
/**
* Extract ONLY text content blocks from message (excludes thinking).
* Model-agnostic: works for any model with text content blocks.
*/
function extractContentFromMessage(message) {
	const resolved = resolveMessageRecord(message);
	if (!resolved) return "";
	const { record, content } = resolved;
	if (record.role === "assistant") {
		if (typeof content === "string") return content.trim();
		if (Array.isArray(content)) return [(extractAssistantPhaseText(record) ?? "").trim(), extractPairingQrTerminalText(record)].filter(Boolean).join("\n\n") || formatAssistantErrorFromRecord(record);
	}
	if (typeof content === "string") return sanitizeRenderableText(content).trim();
	const parts = collectBlockStrings({
		content,
		blockType: "text",
		valueKey: "text"
	}).map(sanitizeRenderableText);
	if (parts.length > 0) return parts.join("\n").trim();
	return formatAssistantErrorFromRecord(record);
}
function extractAssistantRenderableContent(record) {
	const content = [sanitizeRenderableText(extractAssistantPhaseText(record) ?? "").trim(), extractPairingQrTerminalText(record)].filter(Boolean).join("\n\n").trim();
	if (content) return content;
	return formatAssistantErrorFromRecord(record);
}
function extractPairingQrTerminalText(record) {
	const content = record.content;
	if (!Array.isArray(content)) return "";
	const parts = [];
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const blockRecord = block;
		if (blockRecord.type === "openclaw_pairing_qr" && typeof blockRecord.terminalText === "string") {
			const text = sanitizeRenderableText(blockRecord.terminalText).trim();
			if (text) parts.push(text);
		}
	}
	return parts.join("\n\n").trim();
}
function extractTextBlocks(content, opts) {
	if (typeof content === "string") return sanitizeRenderableText(content).trim();
	if (!Array.isArray(content)) return "";
	const textParts = collectBlockStrings({
		content,
		blockType: "text",
		valueKey: "text"
	}).map(sanitizeRenderableText);
	return composeThinkingAndContent({
		thinkingText: (opts?.includeThinking === true ? collectBlockStrings({
			content,
			blockType: "thinking",
			valueKey: "thinking"
		}).map(sanitizeRenderableText) : []).join("\n").trim(),
		contentText: textParts.join("\n").trim(),
		showThinking: opts?.includeThinking ?? false
	});
}
function extractUserAttachmentText(record) {
	const attachments = [];
	if (Array.isArray(record.content)) for (const block of record.content) {
		const entry = asOptionalObjectRecord(block);
		if (entry?.type === "image") attachments.push("Attached image");
		else if (entry?.type === "attachment") {
			const attachment = asOptionalObjectRecord(entry.attachment);
			const label = typeof attachment?.label === "string" ? sanitizeRenderableText(attachment.label).trim() : "";
			attachments.push(label && label !== "Attached file" ? `Attached file: ${label}` : "Attached file");
		}
	}
	if (attachments.length > 0) return attachments.join("\n");
	return (readPersistedMediaFacts(record) ?? []).filter((fact) => fact.path || fact.url || fact.contentType || fact.kind).map((fact) => isImageMediaFact(fact) ? "Attached image" : "Attached file").join("\n");
}
function extractTextFromMessage(message, opts) {
	const record = asOptionalObjectRecord(message);
	if (!record) return "";
	if (record.role === "assistant") {
		const contentText = extractAssistantRenderableContent(record);
		return composeThinkingAndContent({
			thinkingText: opts?.includeThinking ? extractThinkingFromMessage(record) : "",
			contentText: opts?.includeAttachments !== false ? formatTuiAssistantContent(record, contentText) : contentText,
			showThinking: opts?.includeThinking ?? false
		});
	}
	const text = extractTextBlocks(record.content, opts);
	if (text) {
		if (record.role === "user" || record.command === true) return stripLeadingInboundMetadata(text);
		return text;
	}
	if (record.role === "user") return extractUserAttachmentText(record);
	const errorText = formatAssistantErrorFromRecord(record);
	if (!errorText) return "";
	return errorText;
}
/** Extract abort-visible text while keeping attachment-only aborts diagnostic-only. */
function extractTuiAbortedText(message, includeThinking) {
	return extractTextFromMessage(message, {
		includeThinking,
		includeAttachments: false
	});
}
function isCommandMarkedMessage(message) {
	if (!message || typeof message !== "object") return false;
	return message.command === true;
}
function formatTokens(total, context) {
	if (total == null && context == null) return "tokens ?";
	const totalLabel = total == null ? "?" : formatTokenCount(total);
	if (context == null) return `tokens ${totalLabel}`;
	const pct = typeof total === "number" && context > 0 ? Math.min(999, Math.round(total / context * 100)) : null;
	return `tokens ${totalLabel}/${formatTokenCount(context)}${pct !== null ? ` (${pct}%)` : ""}`;
}
function formatGoalUsage(goal) {
	if (goal.tokenBudget === void 0) return goal.tokensUsed > 0 ? formatTokenCount(goal.tokensUsed) : null;
	return `${formatTokenCount(goal.tokensUsed)}/${formatTokenCount(goal.tokenBudget)}`;
}
function formatGoalFooter(goal) {
	if (!goal) return null;
	const usage = formatGoalUsage(goal);
	const suffix = usage ? ` (${usage})` : "";
	switch (goal.status) {
		case "active": return `Pursuing goal${suffix}`;
		case "paused": return "Goal paused (/goal resume)";
		case "blocked": return "Goal blocked (/goal resume)";
		case "usage_limited": return "Goal hit usage limits (/goal resume)";
		case "budget_limited": return `Goal unmet${suffix}`;
		case "complete": return `Goal achieved${suffix}`;
	}
	return null;
}
function formatContextUsageLine(params) {
	const totalLabel = typeof params.total === "number" ? formatTokenCount(params.total) : "?";
	const ctxLabel = typeof params.context === "number" ? formatTokenCount(params.context) : "?";
	const pct = typeof params.percent === "number" ? Math.min(999, Math.round(params.percent)) : null;
	const extra = [typeof params.remaining === "number" ? `${formatTokenCount(params.remaining)} left` : null, pct !== null ? `${pct}%` : null].filter(Boolean).join(", ");
	return `tokens ${totalLabel}/${ctxLabel}${extra ? ` (${extra})` : ""}`;
}
function formatPrimitiveString(value, fallback = "") {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	return fallback;
}
//#endregion
export { sanitizeRenderableText as _, extractTuiAbortedText as a, formatTuiAbortDiagnostic as c, isCommandMarkedMessage as d, isTerminalSafeAutocompleteValue as f, sanitizeRenderableLine as g, resolveFinalAssistantText as h, extractThinkingFromMessage as i, formatTuiErrorMessage as l, isolateRtlRenderedLine as m, extractContentFromMessage as n, formatContextUsageLine as o, isTuiAssistantAttachmentBlock as p, extractTextFromMessage as r, formatPrimitiveString as s, composeThinkingAndContent as t, formatTuiFooter as u, sanitizeTerminalControlsAndBinary as v };
