import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { l as RUNTIME_CONTEXT_HEADER } from "./types-BXd0kI8-.mjs";
import { g as stripInternalRuntimeContext, i as OPENCLAW_RUNTIME_CONTEXT_NOTICE, n as INTERNAL_RUNTIME_CONTEXT_END, t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "./internal-runtime-context-DLJtDQoI.mjs";
import { n as findMarkdownCodeRegions } from "./reasoning-tags-DOZ8HVZL.mjs";
import { a as isInsideCode, s as stripLinesOutsideCode } from "./code-regions-Cy_WAn7O.mjs";
import { o as duplicateParagraphTextFilter, s as leadingEmptyLinesTextFilter, t as applyTextFilters } from "./text-projection-mdP9TY8k.mjs";
import { _ as stripFinalTags, a as plainToolCallTextFilter, i as minimaxToolCallTextFilter, p as toolCallXmlTextFilter, r as legacyBracketToolCallTextFilter, t as assistantTraceTextFilter } from "./assistant-visible-text-DZwixI8b.mjs";
import { n as HISTORY_CONTEXT_MARKER, r as RECENT_HISTORY_CONTEXT_MARKER, t as CURRENT_MESSAGE_MARKER } from "./history-C_lABG5e.mjs";
import { o as stripInboundMetadata, t as INBOUND_METADATA_MARKERS } from "./strip-inbound-meta-D65t0FgP.mjs";
import { n as EXEC_NO_OUTPUT_PLACEHOLDER } from "./bash-tools.exec-output-C0VhBuNW.mjs";
import { C as renderSanitizedUserFacingText } from "./user-copy-BAz4s3EV.mjs";
import { a as isAgentHarnessPreflightError } from "./errors-BAipjK5G.mjs";
//#region src/shared/chat-content.ts
/** Coerces arbitrary provider content values into displayable text without throwing. */
function coerceChatContentText(value) {
	if (typeof value === "string") return value;
	if (value == null) return "";
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") return String(value);
	if (typeof value === "object") try {
		return JSON.stringify(value) ?? "";
	} catch {
		return "";
	}
	return "";
}
/** Extracts normalized plain text from string content or OpenAI-style text blocks. */
function extractTextFromChatContent(content, opts) {
	const normalize = opts?.normalizeText ?? ((text) => text.replace(/\s+/g, " ").trim());
	const joinWith = opts?.joinWith ?? " ";
	const sanitize = (text) => {
		const raw = coerceChatContentText(text);
		return opts?.sanitizeText ? opts.sanitizeText(raw) : raw;
	};
	if (typeof content === "string") {
		const normalized = normalize(sanitize(content));
		return normalized ? normalized : null;
	}
	if (!Array.isArray(content)) return null;
	const chunks = [];
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		if (block.type !== "text") continue;
		const text = block.text;
		const value = sanitize(text);
		if (value.trim()) chunks.push(value);
	}
	const joined = normalize(chunks.join(joinWith));
	return joined ? joined : null;
}
//#endregion
//#region src/agents/embedded-agent-helpers/sanitize-user-facing-text.ts
/** Strips internal scaffolding from text before user-facing delivery. */
const TOOL_CALLS_OMITTED_PLACEHOLDER_LINE_RE = /^[ \t]*\[tool calls omitted\][ \t]*$/i;
function stripInternalPlaceholderLines(text) {
	if (!text.toLowerCase().includes("[tool calls omitted]") && !text.includes("(no output)")) return text;
	return stripLinesOutsideCode(text, (line) => TOOL_CALLS_OMITTED_PLACEHOLDER_LINE_RE.test(line) || line.trim() === "(no output)");
}
const MARKDOWN_LINE_PREFIX = "[ \\t]*(?:(?:>|[-+*](?=[ \\t])|#{1,6}(?=[ \\t])|\\d{1,9}[.)](?=[ \\t]))[ \\t]*)*";
const CONVERSATION_CONTEXT_MARKERS = [
	HISTORY_CONTEXT_MARKER,
	RECENT_HISTORY_CONTEXT_MARKER,
	CURRENT_MESSAGE_MARKER
];
function hasConversationContextMarker(text) {
	return CONVERSATION_CONTEXT_MARKERS.some((marker) => text.includes(marker));
}
function prepareVerifiedConversationContext(source) {
	if (!source || !hasConversationContextMarker(source)) return;
	const sourceCodeRegions = findMarkdownCodeRegions(source);
	if (!CONVERSATION_CONTEXT_MARKERS.some((marker) => {
		let markerOffset = source.indexOf(marker);
		while (markerOffset !== -1) {
			const markerEnd = markerOffset + marker.length;
			const startsLine = markerOffset === 0 || source[markerOffset - 1] === "\n";
			const endsLine = markerEnd === source.length || source[markerEnd] === "\n" || source[markerEnd] === "\r";
			if (startsLine && endsLine && !isInsideCode(markerOffset, sourceCodeRegions)) return true;
			markerOffset = source.indexOf(marker, markerEnd);
		}
		return false;
	})) return;
	return { normalizedSource: source.replace(/\r\n?/gu, "\n") };
}
function stripVerifiedConversationContext(text, context, streaming = false) {
	if (!context) return text;
	const { normalizedSource } = context;
	let result = text;
	if (hasConversationContextMarker(text)) {
		if (!context.copiedPrompt) {
			const promptPattern = (context.sourceLines ??= normalizedSource.split("\n")).map(escapeRegExp).join(`(?:\\r\\n?|\\n)${MARKDOWN_LINE_PREFIX}`);
			context.copiedPrompt = new RegExp(`(?:^${MARKDOWN_LINE_PREFIX})?${promptPattern}`, "gmu");
		}
		result = text.replace(context.copiedPrompt, "");
	}
	if (!streaming) return result;
	const sourceStart = normalizedSource.charAt(0);
	const firstSourceLine = context.firstSourceLine ??= normalizedSource.split("\n", 1)[0] ?? normalizedSource;
	const completedSourceStart = result.indexOf(firstSourceLine);
	const searchStart = completedSourceStart === -1 ? Math.max(0, result.length - normalizedSource.length * 2) : completedSourceStart;
	const markdownWrapper = context.markdownWrapper ??= new RegExp(`^${MARKDOWN_LINE_PREFIX}$`, "u");
	const incompleteMarkdownWrapper = context.incompleteMarkdownWrapper ??= new RegExp(`^${MARKDOWN_LINE_PREFIX}(?:[-+*]|#{1,6}|\\d{1,9}[.)]?)?$`, "u");
	let candidateStart = result.indexOf(sourceStart, searchStart);
	let completedCandidates = 0;
	while (candidateStart !== -1) {
		if (!(result.length - candidateStart >= firstSourceLine.length ? result.startsWith(firstSourceLine, candidateStart) : firstSourceLine.startsWith(result.slice(candidateStart)))) {
			candidateStart = result.indexOf(sourceStart, candidateStart + 1);
			continue;
		}
		if (++completedCandidates > 16) return result.slice(0, searchStart);
		const suffix = result.slice(candidateStart).replace(/\r\n?/gu, "\n");
		const sourceLines = context.sourceLines ??= normalizedSource.split("\n");
		let lineIndex = 0;
		const unwrappedSuffix = suffix.replace(/\n([^\n]*)/gu, (_match, line) => {
			const sourceLine = sourceLines[++lineIndex];
			if (sourceLine === void 0) return `\n${line}`;
			if (!sourceLine) return incompleteMarkdownWrapper.test(line) ? "\n" : `\n${line}`;
			const sourceLineStart = sourceLine.charAt(0);
			let contentStart = line.indexOf(sourceLineStart);
			while (contentStart !== -1) {
				const content = line.slice(contentStart);
				if (sourceLine.startsWith(content) && markdownWrapper.test(line.slice(0, contentStart))) return `\n${content}`;
				contentStart = line.indexOf(sourceLineStart, contentStart + 1);
			}
			return incompleteMarkdownWrapper.test(line) ? "\n" : `\n${line}`;
		});
		if (suffix.length < normalizedSource.length && normalizedSource.startsWith(suffix) || unwrappedSuffix.length < normalizedSource.length && normalizedSource.startsWith(unwrappedSuffix)) return result.slice(0, candidateStart);
		candidateStart = result.indexOf(sourceStart, candidateStart + 1);
	}
	return result;
}
function createVerifiedConversationContextStreamFilter(getConversationContext) {
	let accumulatedText = "";
	let releasedText = "";
	let conversationContextSource;
	let preparedConversationContext;
	return (delta) => {
		accumulatedText += delta;
		const conversationContext = getConversationContext?.();
		const sourceChanged = conversationContext !== conversationContextSource;
		if (sourceChanged) {
			preparedConversationContext = prepareVerifiedConversationContext(conversationContext?.trim());
			conversationContextSource = conversationContext;
		}
		const safeText = stripVerifiedConversationContext(accumulatedText, preparedConversationContext, true);
		if (releasedText === null || (sourceChanged || preparedConversationContext) && !safeText.startsWith(releasedText)) {
			releasedText = null;
			return "";
		}
		const newlySafeText = safeText.slice(releasedText.length);
		releasedText = safeText;
		return newlySafeText;
	};
}
const userFacingFilters = {};
function userFacingTextFilters(errorContext = false, streaming = false) {
	const key = `${errorContext ? "error" : "normal"}${streaming ? "-stream" : ""}`;
	return userFacingFilters[key] ??= [
		{
			transform: stripFinalTags,
			activationTokens: ["<"]
		},
		{
			transform: streaming ? (text) => stripInternalRuntimeContext(text, { streaming: true }) : stripInternalRuntimeContext,
			activationTokens: [
				streaming ? "<" : INTERNAL_RUNTIME_CONTEXT_BEGIN,
				INTERNAL_RUNTIME_CONTEXT_END,
				OPENCLAW_RUNTIME_CONTEXT_NOTICE,
				streaming ? RUNTIME_CONTEXT_HEADER.charAt(0) : RUNTIME_CONTEXT_HEADER
			]
		},
		{
			transform: stripInboundMetadata,
			activationTokens: INBOUND_METADATA_MARKERS
		},
		minimaxToolCallTextFilter(streaming),
		toolCallXmlTextFilter({ stripFunctionCallsXmlPayloads: true }),
		{
			transform: stripInternalPlaceholderLines,
			activationTokens: [EXEC_NO_OUTPUT_PLACEHOLDER, "[tool calls omitted]"]
		},
		...errorContext ? [assistantTraceTextFilter] : [],
		legacyBracketToolCallTextFilter,
		plainToolCallTextFilter,
		leadingEmptyLinesTextFilter,
		duplicateParagraphTextFilter
	];
}
function sanitizeUserFacingText(text, opts) {
	const raw = coerceChatContentText(text);
	if (!raw) return raw;
	const conversationContext = opts?.conversationContext?.trim();
	const withoutConversationContext = conversationContext && (opts?.streaming || hasConversationContextMarker(raw)) ? stripVerifiedConversationContext(raw, prepareVerifiedConversationContext(conversationContext), opts?.streaming) : raw;
	return applyTextFilters(withoutConversationContext, userFacingTextFilters(opts?.errorContext, opts?.streaming));
}
//#endregion
//#region src/agents/embedded-agent-helpers/user-facing-text.ts
/** Compose internal-text stripping with the canonical failover copy renderer. */
function renderUserFacingText(text, opts) {
	return renderSanitizedUserFacingText(sanitizeUserFacingText(text, opts), opts);
}
/** Only an explicit preflight copy can replace private diagnostic detail. */
function renderAgentHarnessPreflightUserMessage(error) {
	if (!isAgentHarnessPreflightError(error) || error.userMessage === void 0) return;
	return renderUserFacingText(error.userMessage, { errorContext: true });
}
//#endregion
export { userFacingTextFilters as a, sanitizeUserFacingText as i, renderUserFacingText as n, coerceChatContentText as o, createVerifiedConversationContextStreamFilter as r, extractTextFromChatContent as s, renderAgentHarnessPreflightUserMessage as t };
