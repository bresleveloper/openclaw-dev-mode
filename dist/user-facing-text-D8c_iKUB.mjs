import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { i as OPENCLAW_RUNTIME_CONTEXT_NOTICE, n as INTERNAL_RUNTIME_CONTEXT_END, p as stripInternalRuntimeContext, t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "./internal-runtime-context-BH-o1oq1.mjs";
import { i as stripInboundMetadata, t as INBOUND_METADATA_MARKERS } from "./strip-inbound-meta-Cqak81y4.mjs";
import { i as isAgentHarnessPreflightError } from "./errors-Bd6GQRkh.mjs";
import { a as isInsideCode, o as stripLinesOutsideCode, r as findCodeRegions } from "./code-regions-NxEObIZm.mjs";
import { i as leadingEmptyLinesTextFilter, r as duplicateParagraphTextFilter, t as applyTextFilters } from "./text-projection-DLGaFuGQ.mjs";
import { x as renderSanitizedUserFacingText } from "./user-copy-DfLWtdTx.mjs";
import "./history-BQl9FdG2.mjs";
import { t as coerceChatContentText } from "./chat-content-DNdfeXZh.mjs";
import { _ as stripFinalTags, a as plainToolCallTextFilter, i as minimaxToolCallTextFilter, p as toolCallXmlTextFilter, r as legacyBracketToolCallTextFilter, t as assistantTraceTextFilter } from "./assistant-visible-text-CVgfl6Gk.mjs";
import { t as EXEC_NO_OUTPUT_PLACEHOLDER } from "./bash-tools.exec-output-Cei3R_ZV.mjs";
//#region src/agents/embedded-agent-helpers/sanitize-user-facing-text.ts
/** Strips internal scaffolding from text before user-facing delivery. */
const TOOL_CALLS_OMITTED_PLACEHOLDER_LINE_RE = /^[ \t]*\[tool calls omitted\][ \t]*$/i;
function stripInternalPlaceholderLines(text) {
	if (!text.toLowerCase().includes("[tool calls omitted]") && !text.includes("(no output)")) return text;
	return stripLinesOutsideCode(text, (line) => TOOL_CALLS_OMITTED_PLACEHOLDER_LINE_RE.test(line) || line.trim() === "(no output)");
}
const MARKDOWN_LINE_PREFIX = "[ \\t]*(?:(?:>|[-+*](?=[ \\t])|#{1,6}(?=[ \\t])|\\d{1,9}[.)](?=[ \\t]))[ \\t]*)*";
function hasConversationContextMarker(text) {
	return text.includes("[Chat messages since your last reply - for context]") || text.includes("[Recent chat messages - for context]") || text.includes("[Current message - respond to this]");
}
function prepareVerifiedConversationContext(source) {
	if (!source || !hasConversationContextMarker(source)) return;
	const sourceCodeRegions = findCodeRegions(source);
	if (![
		"[Chat messages since your last reply - for context]",
		"[Recent chat messages - for context]",
		"[Current message - respond to this]"
	].some((marker) => {
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
				OPENCLAW_RUNTIME_CONTEXT_NOTICE
			]
		},
		{
			transform: stripInboundMetadata,
			activationTokens: INBOUND_METADATA_MARKERS
		},
		minimaxToolCallTextFilter,
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
export { userFacingTextFilters as a, sanitizeUserFacingText as i, renderUserFacingText as n, createVerifiedConversationContextStreamFilter as r, renderAgentHarnessPreflightUserMessage as t };
