import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import { bt as normalizeAgentRunRouteChange } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { a as escapeInternalRuntimeContextDelimiters, n as INTERNAL_RUNTIME_CONTEXT_END, t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "./internal-runtime-context-BH-o1oq1.mjs";
import { t as basenameFromAnyPath } from "./file-name-CKnWacTs.mjs";
import { a as annotateInterSessionPromptText } from "./input-provenance-C4tQegGN.mjs";
import { n as sanitizeForPromptLiteral, r as wrapPromptDataBlock } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { r as hasGeneratedMediaCompletionEvent } from "./internal-event-contract-pF6FHp8g.mjs";
//#region src/agents/generated-attachments.ts
/**
* Formats generated attachment references for agent-visible output.
*/
function generatedAttachmentReference(attachment) {
	return normalizeOptionalString(attachment.path ?? attachment.url ?? attachment.mediaUrl ?? attachment.filePath);
}
/** Return unique media URLs/paths from generated attachments. */
function mediaUrlsFromGeneratedAttachments(attachments) {
	return uniqueStrings(attachments?.flatMap((attachment) => generatedAttachmentReference(attachment) ?? []) ?? []);
}
function nameFromGeneratedAttachment(attachment) {
	return normalizeOptionalString(attachment.name) ?? basenameFromAnyPath(generatedAttachmentReference(attachment) ?? "");
}
function neutralizeEscapedGeneratedMediaDirective(value) {
	return value.replace(/((?:\\r\\n|\\n|\\r)[^\S\r\n]*)(media):/giu, "$1$2：").replace(/((?:\\r\\n|\\n|\\r) {0,3})(`{3,}|~{3,})/gu, "$1>$2");
}
/** Escape provider-controlled summary text without changing its structured result. */
function sanitizeGeneratedMediaDisplayText(value) {
	let sanitized = "";
	for (const char of value) switch (char) {
		case "\\":
			sanitized += "\\\\";
			break;
		case "\r":
			sanitized += "\\r";
			break;
		case "\n":
			sanitized += "\\n";
			break;
		case "	":
			sanitized += "\\t";
			break;
		default: {
			const code = char.charCodeAt(0);
			sanitized += code <= 31 || code === 127 || code === 8232 || code === 8233 ? `\\u${code.toString(16).padStart(4, "0")}` : char;
		}
	}
	return neutralizeEscapedGeneratedMediaDirective(sanitizeForPromptLiteral(sanitized)).replaceAll("[[", "［[").replaceAll("![", "!［");
}
function quoteGeneratedAttachmentDisplay(value) {
	return neutralizeEscapedGeneratedMediaDirective(JSON.stringify(sanitizeForPromptLiteral(value))).replaceAll("[", "\\u005b");
}
/** Format generated attachment metadata as prompt-safe text lines. */
function formatGeneratedAttachmentLines(attachments) {
	if (!attachments?.length) return [];
	const lines = ["Attachments:"];
	for (const [index, attachment] of attachments.entries()) {
		const parts = [`${index + 1}.`];
		const type = normalizeOptionalString(attachment.type);
		const name = nameFromGeneratedAttachment(attachment);
		const mimeType = normalizeOptionalString(attachment.mimeType);
		const path = normalizeOptionalString(attachment.path ?? attachment.filePath);
		const url = normalizeOptionalString(attachment.url ?? attachment.mediaUrl);
		if (type) parts.push(`type=${quoteGeneratedAttachmentDisplay(type).slice(1, -1)}`);
		if (name) parts.push(`name=${quoteGeneratedAttachmentDisplay(name)}`);
		if (mimeType) parts.push(`mimeType=${quoteGeneratedAttachmentDisplay(mimeType).slice(1, -1)}`);
		if (path) parts.push(`path=${quoteGeneratedAttachmentDisplay(path)}`);
		else if (url) parts.push(`mediaUrl=${quoteGeneratedAttachmentDisplay(url)}`);
		lines.push(parts.join(" "));
	}
	return lines;
}
//#endregion
//#region src/agents/internal-events.ts
/**
* Internal runtime event prompt formatting.
* Sanitizes background task completion events into protected runtime-context
* blocks or plain prompt text.
*/
const MAX_TASK_COMPLETION_STATUS_LABEL_CHARS = 500;
const TASK_COMPLETION_STATUS_LABEL_TRUNCATION_MARKER = "…[truncated]";
const MEDIA_DIRECTIVE_CONTROL_CHARS = new RegExp(String.raw`[\u0000-\u001f\u007f]`, "g");
/** Collect ordered media descriptors and per-reference trust from internal events. */
function collectAgentInternalEventMedia(events) {
	const mediaUrls = [];
	const attachments = [];
	const indexByUrl = /* @__PURE__ */ new Map();
	const trustByUrl = /* @__PURE__ */ new Map();
	for (const event of events ?? []) {
		const generatedMediaEvent = hasGeneratedMediaCompletionEvent([event]);
		const attachmentByUrl = new Map((event.attachments ?? []).flatMap((attachment) => {
			const reference = normalizeOptionalString(attachment.path ?? attachment.url ?? attachment.mediaUrl ?? attachment.filePath);
			return reference ? [[reference, attachment]] : [];
		}));
		for (const mediaUrl of [...Array.isArray(event.mediaUrls) ? event.mediaUrls : [], ...mediaUrlsFromGeneratedAttachments(event.attachments)]) {
			const normalized = normalizeOptionalString(mediaUrl);
			if (!normalized) continue;
			const metadata = attachmentByUrl.get(normalized);
			const existingIndex = indexByUrl.get(normalized);
			if (existingIndex !== void 0) {
				trustByUrl.set(normalized, trustByUrl.get(normalized) === true || generatedMediaEvent);
				if (metadata && Object.keys(attachments[existingIndex] ?? {}).length === 0) attachments[existingIndex] = metadata;
				continue;
			}
			indexByUrl.set(normalized, mediaUrls.length);
			trustByUrl.set(normalized, generatedMediaEvent);
			mediaUrls.push(normalized);
			attachments.push(metadata ?? {});
		}
	}
	return {
		mediaUrls,
		attachments,
		trustByUrl
	};
}
function sanitizeSingleLineField(value, fallback, raw = false) {
	return (raw ? value : escapeInternalRuntimeContextDelimiters(value)).replace(/\r?\n+/g, " ").trim() || fallback;
}
function sanitizeMultilineField(value) {
	return escapeInternalRuntimeContextDelimiters(value).replace(/\r\n/g, "\n").trim();
}
function sanitizeMediaDirectiveValue(value, raw = false) {
	return (raw ? value : escapeInternalRuntimeContextDelimiters(value)).replace(/\r?\n/g, " ").replace(MEDIA_DIRECTIVE_CONTROL_CHARS, " ").trim() || null;
}
function formatChildResultDataBlock(value) {
	return wrapPromptDataBlock({
		label: "Child result",
		text: value
	}) || "Child result: (no output)";
}
function formatGeneratedMediaDirectiveLines(event, raw = false, label = "Generated media:") {
	const mediaUrls = Array.from(new Set([...event.mediaUrls ?? [], ...mediaUrlsFromGeneratedAttachments(event.attachments)].map((value) => sanitizeMediaDirectiveValue(value, raw)).filter((value) => value !== null)));
	if (mediaUrls.length === 0) return [];
	return [label, ...mediaUrls.map((mediaUrl) => {
		return `MEDIA:${mediaUrl.includes("\"") || /[`'\\})\],]$/u.test(mediaUrl) ? `"${mediaUrl}"` : mediaUrl}`;
	})];
}
function formatTaskCompletionEvent(event, mode) {
	const singleLine = (value, fallback) => sanitizeSingleLineField(value, fallback, mode === "data");
	const sessionKey = singleLine(event.childSessionKey, "unknown");
	const sessionId = singleLine(event.childSessionId ?? "unknown", "unknown");
	const announceType = singleLine(event.announceType, "unknown");
	const taskLabel = singleLine(event.taskLabel, "unnamed task");
	const statusLabel = truncateWithMarker(singleLine(event.statusLabel, event.status), MAX_TASK_COMPLETION_STATUS_LABEL_CHARS, {
		marker: TASK_COMPLETION_STATUS_LABEL_TRUNCATION_MARKER,
		reserve: 12,
		trimEnd: true
	});
	const result = mode === "data" ? event.result || "(no output)" : formatChildResultDataBlock(event.result);
	const modelRouteChange = normalizeAgentRunRouteChange(event.modelRouteChange);
	const attachmentLines = formatGeneratedAttachmentLines(event.attachments);
	const mediaDirectiveLines = formatGeneratedMediaDirectiveLines(event, mode === "data");
	const lines = mode !== "plain" ? ["[Internal task completion event]"] : ["A background task completed. Use this result to reply to the user in your normal assistant voice.", ""];
	lines.push(`source: ${event.source}`, `session_key: ${sessionKey}`, `session_id: ${sessionId}`, `type: ${announceType}`, `task: ${taskLabel}`, `status: ${statusLabel}`, "", result);
	if (modelRouteChange) lines.push("", modelRouteChange);
	if (attachmentLines.length > 0) lines.push("", ...attachmentLines);
	if (mediaDirectiveLines.length > 0) lines.push("", ...mediaDirectiveLines);
	if (event.statsLine?.trim()) lines.push("", mode === "data" ? event.statsLine : sanitizeMultilineField(event.statsLine));
	if (mode !== "data") lines.push("", mode === "protected" ? "Action:" : "Instruction:", sanitizeMultilineField(event.replyInstruction));
	return lines.join("\n");
}
/** Provenance comes from the producer event; child output and labels remain data. */
function buildAgentInternalEventContext(events, legacy = false) {
	if (legacy) {
		const text = formatAgentInternalEventsForPrompt(events);
		return text ? [{
			kind: "runtime-instruction",
			text
		}] : [];
	}
	return (events ?? []).flatMap((event) => [
		{
			kind: "runtime-instruction",
			text: "A background task completed. Keep internal details private and use its result to reply in your normal assistant voice."
		},
		{
			kind: "conversation-data",
			text: formatTaskCompletionEvent(event, "data")
		},
		{
			kind: "runtime-instruction",
			text: event.replyInstruction
		}
	]);
}
function buildGeneratedMediaDeliveryContext(mediaUrls, retry) {
	return [{
		kind: "runtime-instruction",
		text: retry ? "Deliver only the generated media listed below. Do not resend any other attachment." : "Deliver the generated media listed below to the user."
	}, {
		kind: "conversation-data",
		text: formatGeneratedMediaDirectiveLines({
			mediaUrls,
			attachments: []
		}, true).join("\n")
	}];
}
/** Format internal runtime events for the protected runtime-context prompt block. */
function formatAgentInternalEventsForPrompt(events) {
	const blocks = (events ?? []).filter((event) => event.type === "task_completion").map((event) => formatTaskCompletionEvent(event, "protected"));
	if (blocks.length === 0) return "";
	return [
		INTERNAL_RUNTIME_CONTEXT_BEGIN,
		"OpenClaw runtime context (internal):",
		"This context is runtime-generated, not user-authored. Keep internal details private.",
		"",
		blocks.join("\n\n---\n\n"),
		INTERNAL_RUNTIME_CONTEXT_END
	].join("\n");
}
/** Build a protected follow-up that can retry only media proven missing from a partial send. */
function formatGeneratedMediaDeliveryRetryForPrompt(mediaUrls) {
	const mediaDirectiveLines = formatGeneratedMediaDirectiveLines({ mediaUrls }, false, "Generated media still missing:");
	if (mediaDirectiveLines.length === 0) return "";
	return [
		INTERNAL_RUNTIME_CONTEXT_BEGIN,
		"OpenClaw runtime context (internal):",
		"This context is runtime-generated, not user-authored. Keep internal details private.",
		"",
		"[Generated media delivery retry]",
		"A previous agent turn delivered only part of this generated-media result.",
		"",
		...mediaDirectiveLines,
		"",
		"Action:",
		"Deliver only the generated media listed above. Do not resend any other attachment.",
		INTERNAL_RUNTIME_CONTEXT_END
	].join("\n");
}
/** Format internal runtime events for plain prompts that lack context delimiters. */
function formatAgentInternalEventsForPlainPrompt(events) {
	return (events ?? []).filter((event) => event.type === "task_completion").map((event) => formatTaskCompletionEvent(event, "plain")).join("\n\n---\n\n");
}
/** Keep the existing event carrier for runtimes that own their prompt assembly. */
function prependInternalEventContext(body, events, inputProvenance) {
	const rendered = formatAgentInternalEventsForPrompt(events);
	return !rendered || resolveInternalEventPromptBody(body, events, inputProvenance) !== body ? body : [rendered, body].filter(Boolean).join("\n\n");
}
/** Remove only the canonical duplicate carried by the existing internal-events API. */
function resolveInternalEventPromptBody(body, events, inputProvenance, retainProvenance = false) {
	const rendered = formatAgentInternalEventsForPrompt(events);
	if (rendered) {
		for (const carrier of [rendered, annotateInterSessionPromptText(rendered, inputProvenance)]) if (body === carrier || body.startsWith(`${carrier}\n\n`)) return [retainProvenance ? carrier.slice(0, -rendered.length).trimEnd() : "", body.slice(carrier.length).trimStart()].filter(Boolean).join("\n\n");
	}
	return body;
}
/** Plain runtimes and transcripts retain the existing visible event representation. */
function resolveAcpPromptBody(body, events, inputProvenance) {
	const rendered = formatAgentInternalEventsForPlainPrompt(events);
	return rendered ? [rendered, resolveInternalEventPromptBody(body, events, inputProvenance, true)].filter(Boolean).join("\n\n") : body;
}
function resolveInternalEventTranscriptBody(body, events, inputProvenance) {
	return resolveInternalEventPromptBody(body, events, inputProvenance) === body ? body : resolveAcpPromptBody(body, events, inputProvenance);
}
//#endregion
export { formatGeneratedMediaDeliveryRetryForPrompt as a, resolveInternalEventPromptBody as c, mediaUrlsFromGeneratedAttachments as d, sanitizeGeneratedMediaDisplayText as f, formatAgentInternalEventsForPrompt as i, resolveInternalEventTranscriptBody as l, buildGeneratedMediaDeliveryContext as n, prependInternalEventContext as o, collectAgentInternalEventMedia as r, resolveAcpPromptBody as s, buildAgentInternalEventContext as t, formatGeneratedAttachmentLines as u };
