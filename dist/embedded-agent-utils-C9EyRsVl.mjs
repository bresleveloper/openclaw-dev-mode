import { a as normalizeAssistantPhase, o as parseAssistantTextSignature } from "./chat-message-content-D14VlZZc.mjs";
import { a as trimTextFilter, n as createTextProjection, o as trimTextPreservingCode, t as applyTextFilters } from "./text-projection-DLGaFuGQ.mjs";
import { n as extractTextFromChatContent } from "./chat-content-DNdfeXZh.mjs";
import { n as assistantVisibleTextFilters } from "./assistant-visible-text-CVgfl6Gk.mjs";
import { a as userFacingTextFilters, i as sanitizeUserFacingText, n as renderUserFacingText } from "./user-facing-text-D8c_iKUB.mjs";
import { stripCompactionReplayCheckpointInPlace } from "@openclaw/ai/transports";
//#region src/agents/embedded-agent-utils.ts
/** Narrow an agent message to an assistant message. */
function isAssistantMessage(msg) {
	return msg?.role === "assistant";
}
function sanitizeAssistantText(text, phase, streaming = false, options) {
	return applyTextFilters(text, assistantVisibleTextFilters(phase === "final_answer" ? "final-answer-delivery" : "delivery", streaming && phase === "final_answer", options));
}
function isAssistantTextContentBlockType(value) {
	return value === "text" || value === "input_text" || value === "output_text";
}
function sanitizeAssistantVisibleStreamText(text, phase, options) {
	return sanitizeUserFacingText(sanitizeAssistantText(text, phase, true, options), { errorContext: false });
}
function createAssistantVisibleStreamText(phase) {
	return createTextProjection([
		...assistantVisibleTextFilters(phase === "final_answer" ? "final-answer-delivery" : "delivery", phase === "final_answer"),
		...userFacingTextFilters(),
		trimTextFilter("both", { preserveCodeIndentation: true })
	]);
}
function finalizeAssistantExtraction(errorContext, extracted) {
	return errorContext ? renderUserFacingText(extracted, { errorContext: true }) : sanitizeUserFacingText(extracted);
}
function prepareEmbeddedAssistantTextForPhase(msg, requestedPhase, prepareText) {
	const messagePhase = normalizeAssistantPhase(msg.phase);
	if (typeof msg.content === "string") {
		const selectedPhase = requestedPhase === "final_answer" && messagePhase !== "final_answer" ? void 0 : requestedPhase;
		if (messagePhase !== selectedPhase) return () => "";
		const preparedText = prepareText ? prepareText(msg.content, true, messagePhase) : msg.content;
		const errorContext = msg.stopReason === "error";
		return () => {
			const text = finalizeAssistantExtraction(errorContext, sanitizeAssistantText(preparedText, messagePhase));
			return selectedPhase === "final_answer" && !text.trim() ? "" : text;
		};
	}
	if (!Array.isArray(msg.content)) return () => "";
	let hasExplicitPhasedTextBlocks = false;
	let hasFinalAnswerText = false;
	for (const block of msg.content) {
		if (!block || typeof block !== "object") continue;
		const record = block;
		if (!isAssistantTextContentBlockType(record.type)) continue;
		const phase = parseAssistantTextSignature(record)?.phase;
		hasExplicitPhasedTextBlocks ||= Boolean(phase);
		hasFinalAnswerText ||= phase === "final_answer" && typeof record.text === "string";
		if (hasExplicitPhasedTextBlocks && (requestedPhase === "commentary" || hasFinalAnswerText)) break;
	}
	const selectedPhase = requestedPhase === "final_answer" && !hasFinalAnswerText && (hasExplicitPhasedTextBlocks || messagePhase !== "final_answer") ? void 0 : requestedPhase;
	const parts = [];
	for (const [contentIndex, block] of msg.content.entries()) {
		if (!block || typeof block !== "object") continue;
		const record = block;
		if (!isAssistantTextContentBlockType(record.type) || typeof record.text !== "string") continue;
		const signature = parseAssistantTextSignature(record);
		const resolvedPhase = signature?.phase ?? (hasExplicitPhasedTextBlocks ? void 0 : messagePhase);
		if (resolvedPhase !== selectedPhase) continue;
		const sanitizerPhase = resolvedPhase ?? (requestedPhase === "final_answer" && signature?.id ? "final_answer" : void 0);
		parts.push({
			text: record.text,
			phase: sanitizerPhase,
			contentIndex
		});
	}
	if (prepareText) for (const [index, part] of parts.entries()) part.text = prepareText(part.text, index === parts.length - 1, part.phase, part.contentIndex);
	const errorContext = msg.stopReason === "error";
	return () => {
		const extracted = finalizeAssistantExtraction(errorContext, parts.map(({ text, phase }) => sanitizeAssistantText(text, phase)).filter((text) => text.trim()).join("\n").trimEnd());
		return selectedPhase === "final_answer" && !extracted.trim() ? "" : extracted;
	};
}
/** Prepare selected source parts now; render their visible text only when requested. */
function prepareAssistantVisibleText(msg, prepareText) {
	return prepareEmbeddedAssistantTextForPhase(msg, "final_answer", prepareText);
}
/** Extract text intended for users, preferring explicit final-answer phase blocks. */
function extractAssistantVisibleText(msg, prepareText) {
	return prepareAssistantVisibleText(msg, prepareText)();
}
/** Extract the commentary/narration text of a commentary-phase assistant message. */
function extractAssistantCommentaryText(msg) {
	return prepareEmbeddedAssistantTextForPhase(msg, "commentary")();
}
/** Extract sanitized assistant text across all text content blocks. */
function extractEmbeddedAssistantText(msg) {
	const extracted = extractTextFromChatContent(msg.content, {
		sanitizeText: (text) => sanitizeAssistantText(text),
		joinWith: "\n",
		normalizeText: (text) => text.trimEnd()
	}) ?? "";
	return finalizeAssistantExtraction(msg.stopReason === "error", extracted);
}
/** Extract native thinking block text; signature-only blocks (no summary) surface nothing. */
function extractAssistantThinking(msg) {
	if (!Array.isArray(msg.content)) return "";
	const blocks = [];
	for (const block of msg.content) {
		if (!block || typeof block !== "object") continue;
		const type = Reflect.get(block, "type");
		const rawThinking = Reflect.get(block, "thinking");
		if (type === "thinking" && typeof rawThinking === "string") {
			const thinking = rawThinking.trim();
			if (thinking) blocks.push(thinking);
		}
	}
	return blocks.join("\n");
}
/** Format reasoning text for markdown-friendly channel surfaces. */
function formatReasoningMessage(text) {
	const trimmed = text.trim();
	if (!trimmed) return "";
	return `Thinking\n\n${trimmed.split("\n").map((line) => line ? `_${line}_` : line).join("\n")}`;
}
const THINKING_TAG_NAME_PATTERN = String.raw`(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)`;
const THINKING_TAG_OPEN_RE = new RegExp(String.raw`<\s*${THINKING_TAG_NAME_PATTERN}\s*>`, "i");
const THINKING_TAG_CLOSE_RE = new RegExp(String.raw`<\s*\/\s*${THINKING_TAG_NAME_PATTERN}\s*>`, "i");
/** Global regex used to scan provider-emitted thinking tags. */
const THINKING_TAG_SCAN_RE = new RegExp(String.raw`<\s*(\/?)\s*${THINKING_TAG_NAME_PATTERN}\s*>`, "gi");
const THINKING_TAG_EXACT_RE = new RegExp(String.raw`^<\s*(\/?)\s*${THINKING_TAG_NAME_PATTERN}\s*>$`, "i");
function createThinkingTagStreamState() {
	return {
		scannedOffset: 0,
		inThinking: false,
		extracted: "",
		lastMatchEnd: 0
	};
}
/** Split text that starts with thinking tags into structured thinking/text blocks. */
function splitThinkingTaggedText(text) {
	const trimmedStart = text.trimStart();
	if (!trimmedStart.startsWith("<")) return null;
	if (!THINKING_TAG_OPEN_RE.test(trimmedStart)) return null;
	if (!THINKING_TAG_CLOSE_RE.test(text)) return null;
	let inThinking = false;
	let cursor = 0;
	let thinkingStart = 0;
	const blocks = [];
	const pushText = (value) => {
		if (!value) return;
		blocks.push({
			type: "text",
			text: value
		});
	};
	const pushThinking = (value) => {
		const cleaned = value.trim();
		if (!cleaned) return;
		blocks.push({
			type: "thinking",
			thinking: cleaned
		});
	};
	for (const match of text.matchAll(THINKING_TAG_SCAN_RE)) {
		const index = match.index ?? 0;
		const isClose = match[1]?.includes("/") ?? false;
		if (!inThinking && !isClose) {
			pushText(text.slice(cursor, index));
			thinkingStart = index + match[0].length;
			inThinking = true;
			continue;
		}
		if (inThinking && isClose) {
			pushThinking(text.slice(thinkingStart, index));
			cursor = index + match[0].length;
			inThinking = false;
		}
	}
	if (inThinking) return null;
	pushText(text.slice(cursor));
	if (!blocks.some((b) => b.type === "thinking")) return null;
	return blocks;
}
/** Promote inline thinking-tag text blocks into native thinking blocks in place. */
function promoteThinkingTagsToBlocks(message) {
	if (!Array.isArray(message.content)) return;
	if (message.content.some((block) => block && typeof block === "object" && block.type === "thinking")) return;
	const next = [];
	let changed = false;
	for (const block of message.content) {
		if (!block || typeof block !== "object" || !("type" in block)) {
			next.push(block);
			continue;
		}
		if (block.type !== "text") {
			next.push(block);
			continue;
		}
		const split = splitThinkingTaggedText(block.text);
		if (!split) {
			next.push(block);
			continue;
		}
		changed = true;
		for (const part of split) if (part.type === "thinking") next.push({
			type: "thinking",
			thinking: part.thinking
		});
		else if (part.type === "text") {
			const cleaned = trimTextPreservingCode(part.text, "start");
			if (cleaned) next.push({
				type: "text",
				text: cleaned
			});
		}
	}
	if (!changed) return;
	message.content = next;
	stripCompactionReplayCheckpointInPlace(message);
}
/** Extract closed thinking-tag content from a complete text payload. */
function extractThinkingFromTaggedText(text) {
	if (!text) return "";
	let result = "";
	let lastIndex = 0;
	let inThinking = false;
	for (const match of text.matchAll(THINKING_TAG_SCAN_RE)) {
		const idx = match.index ?? 0;
		if (inThinking) result += text.slice(lastIndex, idx);
		inThinking = !(match[1] === "/");
		lastIndex = idx + match[0].length;
	}
	return result.trim();
}
/** Incrementally extract thinking-tag content from a growing streaming payload. */
function extractThinkingFromTaggedStream(text, state, delta) {
	const unscanned = text.length - state.scannedOffset === delta.length ? delta : text.slice(state.scannedOffset);
	for (let offset = 0; offset < unscanned.length; offset += 1) {
		const index = state.scannedOffset + offset;
		const char = unscanned[offset];
		if (char === "<") {
			state.pendingTagStart = index;
			continue;
		}
		if (char !== ">" || state.pendingTagStart === void 0) continue;
		const start = state.pendingTagStart;
		state.pendingTagStart = void 0;
		const match = THINKING_TAG_EXACT_RE.exec(text.slice(start, index + 1));
		if (!match) continue;
		if (state.inThinking) state.extracted += text.slice(state.lastMatchEnd, start);
		const isClose = match[1] === "/";
		state.inThinking = !isClose;
		state.lastMatchEnd = index + 1;
		state.lastTag = {
			type: isClose ? "close" : "open",
			end: index + 1
		};
	}
	state.scannedOffset = text.length;
	const closed = state.extracted.trim();
	if (closed || state.lastTag?.type !== "open") return closed;
	return text.slice(state.lastTag.end).trim();
}
//#endregion
export { extractAssistantThinking as a, extractThinkingFromTaggedStream as c, isAssistantMessage as d, prepareAssistantVisibleText as f, extractAssistantCommentaryText as i, extractThinkingFromTaggedText as l, sanitizeAssistantVisibleStreamText as m, createAssistantVisibleStreamText as n, extractAssistantVisibleText as o, promoteThinkingTagsToBlocks as p, createThinkingTagStreamState as r, extractEmbeddedAssistantText as s, THINKING_TAG_SCAN_RE as t, formatReasoningMessage as u };
