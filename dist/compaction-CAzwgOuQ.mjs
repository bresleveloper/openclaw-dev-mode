import { n as estimateStringChars } from "./cjk-chars-6ld30jSx.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { f as selectResetKeptEntries } from "./tool-result-pairing-Bky0eubt.mjs";
import { c as resolveClaudeFable5ModelIdentity, m as resolveClaudeSonnet5ModelIdentity, p as resolveClaudeOpus5ModelIdentity } from "./anthropic-Cy4mTngV.mjs";
import "./src-BpANEEBH.mjs";
import { d as isRuntimeContextCarrier, i as projectSessionEntryMessage, t as buildSessionContext, u as convertToLlm } from "./session-D9cHHQGH.mjs";
//#region packages/agent-core/src/harness/types.ts
var CompactionError = class extends Error {
	constructor(code, message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "CompactionError";
		this.code = code;
	}
};
/** Internal typed signal for a completed summary response with no usable text. */
var InvalidSummaryOutputError = class extends CompactionError {
	constructor(message) {
		super("summarization_failed", message);
	}
};
var BranchSummaryError = class extends Error {
	constructor(code, message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "BranchSummaryError";
		this.code = code;
	}
};
//#endregion
//#region packages/agent-core/src/reasoning.ts
function resolveAgentReasoningOption(model, thinkingLevel) {
	if (thinkingLevel !== "off") return thinkingLevel;
	const offFallback = model.thinkingLevelMap?.off ?? ((model.api === "anthropic-messages" || model.api === "bedrock-converse-stream") && resolveClaudeFable5ModelIdentity(model) ? "low" : void 0);
	switch (offFallback) {
		case "minimal":
		case "low":
		case "medium":
		case "high":
		case "xhigh":
		case "max": return offFallback;
		default: return model.thinkingLevelMap?.off !== null || model.api === "anthropic-messages" && (resolveClaudeSonnet5ModelIdentity(model) || resolveClaudeOpus5ModelIdentity(model)) ? "off" : void 0;
	}
}
//#endregion
//#region packages/agent-core/src/runtime-deps.ts
function missingRuntimeDep(name) {
	return /* @__PURE__ */ new Error(`@openclaw/agent-core runtime dependency "${name}" is not configured. Pass an AgentCoreRuntimeDeps instance or a streamFn explicitly.`);
}
/** Resolve the stream function, preferring an explicit override over injected runtime deps. */
function resolveAgentCoreStreamFn(runtime, streamFn) {
	if (streamFn) return streamFn;
	if (runtime?.streamSimple) return runtime.streamSimple;
	throw missingRuntimeDep("streamSimple");
}
/** Standalone runtimes consume directly; hosts may retain their exact stream owner. */
function runAgentCoreStream(stream, consume, runtime) {
	return runtime?.runStream ? runtime.runStream(stream, consume) : consume();
}
/** Drain a host-decorated stream before reading its final assistant message. */
async function consumeAgentCoreStream(stream, runtime) {
	return await runAgentCoreStream(stream, async () => {
		const response = await stream;
		for await (const _ of response);
		return response.result();
	}, runtime);
}
/** Resolve the completion function used by non-streaming helper flows. */
function resolveAgentCoreCompleteFn(runtime) {
	if (runtime?.completeSimple) return runtime.completeSimple;
	throw missingRuntimeDep("completeSimple");
}
/** Shared role instruction used by ordinary and branch compaction requests. */
const SUMMARIZATION_SYSTEM_PROMPT = `You are a context summarization assistant. Your task is to read a conversation between a user and an AI assistant, then produce a structured summary following the exact format specified.

When a conversation line includes sender={...}, that JSON identifies the author of that user turn. The id is authoritative; name and username are readable labels only. Preserve attribution for material facts, preferences, instructions, decisions, and disagreements; never transfer them to another sender or an anonymous user. A user line without sender={...} is unattributed: preserve its facts as unattributed and do not assign them to a known sender.

Do NOT continue the conversation. Do NOT respond to any questions in the conversation. ONLY output the structured summary.`;
//#endregion
//#region packages/agent-core/src/harness/compaction/utils.ts
function normalizeFileToolName(value) {
	const name = typeof value === "string" ? value.toLowerCase() : "";
	const separator = name.indexOf("__", name.startsWith("mcp__") ? 5 : 0);
	return separator < 0 ? name : name.slice(separator + 2);
}
function addFilePaths(target, value) {
	for (const path of Array.isArray(value) ? value : []) if (typeof path === "string") target.add(path);
}
/** Create an empty file-operation accumulator. */
function createFileOps() {
	return {
		read: /* @__PURE__ */ new Set(),
		written: /* @__PURE__ */ new Set(),
		edited: /* @__PURE__ */ new Set()
	};
}
/** Restore file metadata recorded by an earlier compaction or branch summary. */
function mergeSummaryFileOperations(fileOps, details) {
	addFilePaths(fileOps.read, details.readFiles);
	addFilePaths(fileOps.edited, details.modifiedFiles);
}
/** Add file operations from tool calls and results to an accumulator. */
function extractFileOpsFromMessage(message, fileOps) {
	if (message.role === "toolResult") {
		if (normalizeFileToolName(message.toolName) !== "apply_patch") return;
		for (const result of [message, ...Array.isArray(message.content) ? message.content : []]) {
			const details = asOptionalRecord(asOptionalRecord(result)?.details);
			const summary = asOptionalRecord(details?.summary);
			addFilePaths(fileOps.written, summary?.added);
			addFilePaths(fileOps.edited, summary?.modified);
		}
		return;
	}
	if (message.role !== "assistant" || !Array.isArray(message.content)) return;
	for (const block of message.content) {
		const toolCall = asOptionalRecord(block);
		if (toolCall?.type !== "toolCall") continue;
		const args = asOptionalRecord(toolCall.arguments);
		const path = [
			args?.path,
			args?.file_path,
			args?.filePath
		].find((value) => typeof value === "string");
		if (!path) continue;
		switch (normalizeFileToolName(toolCall.name)) {
			case "read":
				fileOps.read.add(path);
				break;
			case "write":
				fileOps.written.add(path);
				break;
			case "edit": fileOps.edited.add(path);
		}
	}
}
/** Compute sorted read-only and modified file lists from accumulated operations. */
function computeFileLists(fileOps) {
	const modified = /* @__PURE__ */ new Set([...fileOps.edited, ...fileOps.written]);
	return {
		readFiles: [...fileOps.read].filter((f) => !modified.has(f)).toSorted(),
		modifiedFiles: [...modified].toSorted()
	};
}
const MAX_FILE_OPS_SECTION_CHARS = 2e3;
function formatBoundedFileList(tag, files, maxChars) {
	if (files.length === 0 || maxChars <= 0) return "";
	const openTag = `<${tag}>\n`;
	const closeTag = `\n</${tag}>`;
	const lines = [];
	let usedChars = openTag.length + closeTag.length;
	for (let i = 0; i < files.length; i++) {
		const line = `${files[i]}\n`;
		const remaining = files.length - i - 1;
		const overflowLine = remaining > 0 ? `...and ${remaining} more\n` : "";
		if (usedChars + line.length + overflowLine.length > maxChars) {
			const overflow = `...and ${files.length - i} more\n`;
			if (usedChars + overflow.length <= maxChars) lines.push(overflow);
			break;
		}
		lines.push(line);
		usedChars += line.length;
	}
	return lines.length > 0 ? `${openTag}${lines.join("").trimEnd()}${closeTag}` : "";
}
/** Format file lists as bounded summary metadata tags. */
function formatFileOperations(readFiles, modifiedFiles) {
	const sections = [formatBoundedFileList("read-files", readFiles, 900), formatBoundedFileList("modified-files", modifiedFiles, 900)].filter(Boolean);
	if (sections.length === 0) return "";
	const joined = `\n\n${sections.join("\n\n")}`;
	return joined.length > 2e3 ? joined.slice(0, MAX_FILE_OPS_SECTION_CHARS) : joined;
}
/** Extract visible summary text without normalizing valid model output. */
function extractSummaryText(response) {
	const summary = response.content.filter((block) => block.type === "text").map((block) => block.text).join("\n");
	return summary.trim() ? summary : void 0;
}
const TOOL_RESULT_MAX_CHARS = 2e3;
const IMPORTANT_TOOL_RESULT_TAIL = /(error|exception|failed|fatal|traceback|panic|stack trace|errno|exit code)/i;
function stringifyCompactionValue(value) {
	try {
		return JSON.stringify(value) ?? "undefined";
	} catch {
		return "[unserializable]";
	}
}
function truncateForSummary(text, maxChars) {
	if (text.length <= maxChars) return text;
	const tailChars = Math.min(Math.floor(maxChars * .3), 600);
	const diagnosticSearch = sliceUtf16Safe(text, -maxChars);
	const diagnosticMatches = [...diagnosticSearch.matchAll(new RegExp(IMPORTANT_TOOL_RESULT_TAIL.source, "gi"))];
	const diagnosticMatch = diagnosticMatches.findLast((match) => /^(error|exception|fatal|panic|errno)$/i.test(match[0])) ?? diagnosticMatches.at(-1);
	if (diagnosticMatch) {
		const head = truncateUtf16Safe(text, maxChars - tailChars);
		const displacedHead = sliceUtf16Safe(text, Math.max(0, head.length - 32), maxChars);
		if (!IMPORTANT_TOOL_RESULT_TAIL.test(displacedHead)) {
			const diagnosticOffset = text.length - diagnosticSearch.length + (diagnosticMatch.index ?? 0);
			const tailStart = Math.min(diagnosticOffset, text.length - tailChars);
			if (tailStart >= head.length) {
				const tail = sliceUtf16Safe(text, tailStart, tailStart + tailChars);
				return `${head}\n\n[... ${text.length - head.length - tail.length} ${tailStart + tail.length < text.length ? "middle/trailing" : "more"} characters truncated]\n\n${tail}`;
			}
		}
	}
	const sliced = truncateUtf16Safe(text, maxChars);
	return `${sliced}\n\n[... ${text.length - sliced.length} more characters truncated]`;
}
/** Extract text that compaction both estimates and includes in summary prompts. */
function getCompactionContentBlockText(block) {
	if ((block.type === "text" || block.type === "toolResult" || block.type === "tool_result") && block.text) return block.text;
	return (block.type === "toolResult" || block.type === "tool_result") && typeof block.content === "string" ? block.content : "";
}
/** Project summary content once so rendering and token accounting share omission facts. */
function getCompactionContent(content) {
	const omissions = /* @__PURE__ */ new Set();
	return {
		text: typeof content === "string" ? content : content.map((block) => {
			const blockText = getCompactionContentBlockText(block);
			if (block.type !== "text" && !blockText) omissions.add(block.type === "image" ? "[image data omitted from summary input]" : "[non-text data omitted from summary input]");
			return blockText;
		}).filter(Boolean).join("\n"),
		omissionText: [...omissions].join("\n")
	};
}
const MAX_OMISSION_MESSAGES = 8;
const OMISSION_OVERFLOW = "[More image/non-text data omitted from summary input]";
function readPersistedSender(message) {
	if (message.role !== "user") return;
	const metadata = asOptionalRecord(Reflect.get(message, "__openclaw"));
	if (!metadata) return;
	const normalize = (value) => {
		if (typeof value !== "string") return;
		return value.replaceAll("\0", "").trim() || void 0;
	};
	const sender = {
		id: normalize(metadata.senderId),
		name: normalize(metadata.senderName),
		username: normalize(metadata.senderUsername)
	};
	return sender.id ? sender : void 0;
}
/**
* Return exactly the persisted-sender text which is projected into a user
* conversation label. Keep this shared with token accounting: adding a label
* to the prompt without charging it can make bounded compaction overflow.
*/
function formatPersistedSenderSuffix(message) {
	const sender = readPersistedSender(message);
	return sender ? ` sender=${JSON.stringify(sender)}` : "";
}
function formatConversationSpeaker(message) {
	if (message.role !== "user") return message.role === "toolResult" ? "Tool result" : "User";
	return `User${formatPersistedSenderSuffix(message)}`;
}
/** Serialize LLM messages to plain text for summarization prompts. */
function serializeConversation(messages) {
	const parts = [];
	let omissionMessages = 0;
	for (const msg of messages) {
		if (msg.role === "user" && msg.runtimeContextCarrier === true) continue;
		if (msg.role === "user" || msg.role === "toolResult") {
			const { text, omissionText } = getCompactionContent(msg.content);
			if (omissionText && omissionMessages++ === MAX_OMISSION_MESSAGES) parts.push(OMISSION_OVERFLOW);
			const content = [omissionMessages <= MAX_OMISSION_MESSAGES ? omissionText : "", msg.role === "toolResult" ? truncateForSummary(text, TOOL_RESULT_MAX_CHARS) : text].filter(Boolean).join("\n");
			if (content) parts.push(`[${formatConversationSpeaker(msg)}]: ${content}`);
		} else if (msg.role === "assistant") {
			const textParts = [];
			const toolCalls = [];
			for (const block of msg.content) if (block.type === "text") textParts.push(block.text);
			else if (block.type === "toolCall") {
				const argsStr = Object.entries(block.arguments).map(([k, v]) => `${k}=${stringifyCompactionValue(v)}`).join(", ");
				toolCalls.push(`${block.name}(${argsStr})`);
			}
			if (textParts.length > 0) parts.push(`[Assistant]: ${textParts.join("\n")}`);
			if (toolCalls.length > 0) parts.push(`[Assistant tool calls]: ${toolCalls.join("; ")}`);
		}
	}
	return parts.join("\n\n");
}
//#endregion
//#region packages/agent-core/src/harness/compaction/summarization-completion.ts
function createSummarizationOptions(model, maxTokens, apiKey, headers, signal, thinkingLevel) {
	const options = {
		maxTokens,
		signal,
		apiKey,
		headers
	};
	const fableReasoning = (model.api === "anthropic-messages" || model.api === "bedrock-converse-stream") && resolveClaudeFable5ModelIdentity(model) !== void 0;
	if ((model.reasoning || fableReasoning) && thinkingLevel) options.reasoning = resolveAgentReasoningOption(model, thinkingLevel);
	return options;
}
/** Runs one summarization completion and maps abort/error stops to CompactionError. */
async function runSummarizationCompletion(params) {
	let promptText = `<conversation>\n${serializeConversation(convertToLlm(params.messages))}\n</conversation>\n\n`;
	if (params.previousSummary) promptText += `<previous-summary>\n${params.previousSummary}\n</previous-summary>\n\n`;
	promptText += params.prompt;
	if (params.customInstructions) promptText += `\n\nAdditional focus: ${params.customInstructions}`;
	const context = {
		systemPrompt: SUMMARIZATION_SYSTEM_PROMPT,
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: promptText
			}],
			timestamp: Date.now()
		}]
	};
	const options = createSummarizationOptions(params.model, params.maxTokens, params.apiKey, params.headers, params.signal, params.thinkingLevel);
	const response = params.streamFn ? await consumeAgentCoreStream(params.streamFn(params.model, context, options), params.runtime) : await resolveAgentCoreCompleteFn(params.runtime)(params.model, context, options);
	params.runtime?.internalUsageSink?.(response.usage);
	if (response.stopReason === "aborted") return err(new CompactionError("aborted", response.errorMessage || `${params.errorLabel} aborted`));
	if (response.stopReason === "error") return err(new CompactionError("summarization_failed", `${params.errorLabel} failed: ${response.errorMessage || "Unknown error"}`));
	const summary = extractSummaryText(response);
	if (summary === void 0) return err(new InvalidSummaryOutputError(`${params.errorLabel} failed: model returned no summary text`));
	return ok(summary);
}
//#endregion
//#region packages/agent-core/src/harness/compaction/compaction.ts
function parseCompactionDetails(value) {
	const details = asOptionalRecord(value);
	if (!details || !Array.isArray(details.readFiles) || !details.readFiles.every((file) => typeof file === "string") || !Array.isArray(details.modifiedFiles) || !details.modifiedFiles.every((file) => typeof file === "string")) return;
	const request = details.latestUnresolvedUserRequest;
	const latestUnresolvedUserRequest = typeof request === "string" && request.length <= MAX_LATEST_USER_REQUEST_CHARS ? request : void 0;
	return {
		readFiles: details.readFiles,
		modifiedFiles: details.modifiedFiles,
		...latestUnresolvedUserRequest ? { latestUnresolvedUserRequest } : {}
	};
}
function extractFileOperations(messages, entries, prevBoundaryIndex) {
	const fileOps = createFileOps();
	if (prevBoundaryIndex >= 0) {
		const prevCompaction = entries[prevBoundaryIndex];
		if (prevCompaction?.type === "compaction" && !prevCompaction.fromHook) {
			const details = parseCompactionDetails(prevCompaction.details);
			if (details) mergeSummaryFileOperations(fileOps, details);
		}
	}
	for (const msg of messages) extractFileOpsFromMessage(msg, fileOps);
	return fileOps;
}
function getMessageFromEntryForCompaction(entry) {
	if (entry.type === "compaction") return;
	return projectSessionEntryMessage(entry);
}
const MAX_COMPACTION_SUMMARY_CHARS = 16e3;
const SUMMARY_TRUNCATED_MARKER = "\n\n[Compaction summary truncated to fit budget]";
const TURN_CONTEXT_PREFIX = "\n\n---\n\n**Turn Context (split turn):**\n\n";
const MAX_LATEST_USER_REQUEST_CHARS = 800;
const LATEST_USER_REQUEST_TRUNCATED_MARKER = "\n[... latest user request truncated ...]\n";
function extractLatestUserRequest(messages) {
	let source = "";
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (message?.role === "user") {
			source = getCompactionContent(message.content).text.trim();
			if (source) break;
		}
	}
	if (!source || source.length <= MAX_LATEST_USER_REQUEST_CHARS) return source || void 0;
	return `${truncateUtf16Safe(source, Math.floor(759 / 2))}${LATEST_USER_REQUEST_TRUNCATED_MARKER}${sliceUtf16Safe(source, -380)}`;
}
function capCompactionSummary(summary, maxChars = MAX_COMPACTION_SUMMARY_CHARS, preservedSuffix = "") {
	if (maxChars <= 0 || summary.length <= maxChars) return summary;
	const suffix = preservedSuffix && summary.endsWith(preservedSuffix) ? preservedSuffix : "";
	if (maxChars < 46 + suffix.length) return truncateUtf16Safe(summary, maxChars);
	const budget = maxChars - 46 - suffix.length;
	const prefix = suffix ? summary.slice(0, -suffix.length) : summary;
	return `${truncateUtf16Safe(prefix, budget)}${SUMMARY_TRUNCATED_MARKER}${suffix}`;
}
/** Let each summary owner preserve its structure before checking the foreground token budget. */
function fitCompactionSummary(tokenBudget, render) {
	const full = render(MAX_COMPACTION_SUMMARY_CHARS);
	if (full && (tokenBudget === void 0 || estimateStringChars(full.summary) / 4 <= tokenBudget)) return ok(full);
	let low = 1;
	let high = 15999;
	let fitted;
	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		const candidate = render(mid);
		if (!candidate) low = mid + 1;
		else if (tokenBudget === void 0 || estimateStringChars(candidate.summary) / 4 <= tokenBudget) {
			fitted = candidate;
			low = mid + 1;
		} else high = mid - 1;
	}
	return fitted ? ok(fitted) : err(new CompactionError("summarization_failed", "The compaction summary cannot fit beside the foreground prompt and retained history."));
}
/** Default compaction settings used by the harness. */
const DEFAULT_COMPACTION_SETTINGS = {
	enabled: true,
	reserveTokens: 16384,
	keepRecentTokens: 2e4
};
/** Calculate total context tokens from provider usage. */
function calculateContextTokens(usage) {
	if (usage.contextUsage?.state === "available") return usage.contextUsage.totalTokens;
	return usage.totalTokens || usage.input + usage.output + usage.cacheRead + usage.cacheWrite;
}
function getAssistantUsage(msg) {
	if (msg.role === "assistant" && "usage" in msg) {
		const assistantMsg = msg;
		if (assistantMsg.stopReason !== "aborted" && assistantMsg.stopReason !== "error" && assistantMsg.usage && calculateContextTokens(assistantMsg.usage) > 0) return assistantMsg.usage;
	}
}
function isUnavailableContextBarrier(message) {
	if (message.role !== "assistant") return false;
	const usage = "usage" in message ? message.usage : void 0;
	if (!usage) return false;
	if (message.api === "cli" && usage.contextUsage === void 0) return true;
	if (usage.contextUsage?.state !== "unavailable") return false;
	return calculateContextTokens(usage) === 0;
}
/** Return usage from the last valid assistant message in session entries. */
function getLastAssistantUsage(entries) {
	for (const entry of entries.toReversed()) if (entry.type === "message") {
		if (isUnavailableContextBarrier(entry.message)) return;
		const usage = getAssistantUsage(entry.message);
		if (usage) return usage;
	}
}
function getLastAssistantUsageInfo(messages) {
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages.at(i);
		if (!message) continue;
		if (isUnavailableContextBarrier(message)) return;
		const usage = getAssistantUsage(message);
		if (usage && usage.contextUsage?.state !== "unavailable") return {
			usage,
			index: i
		};
	}
}
/** Estimate context tokens for messages using provider usage when available. */
function estimateContextTokens(messages) {
	const usageInfo = getLastAssistantUsageInfo(messages);
	if (!usageInfo) {
		let estimated = 0;
		for (const message of messages) estimated += estimateTokens(message);
		return {
			tokens: estimated,
			usageTokens: 0,
			trailingTokens: estimated,
			lastUsageIndex: null
		};
	}
	const usageTokens = calculateContextTokens(usageInfo.usage);
	let trailingTokens = 0;
	for (const message of messages.slice(usageInfo.index + 1)) trailingTokens += estimateTokens(message);
	return {
		tokens: usageTokens + trailingTokens,
		usageTokens,
		trailingTokens,
		lastUsageIndex: usageInfo.index
	};
}
/** Return whether context usage exceeds the configured compaction threshold. */
function shouldCompact(contextTokens, contextWindow, settings) {
	if (!settings.enabled || !Number.isFinite(contextWindow) || contextWindow <= 0) return false;
	return contextTokens > contextWindow - settings.reserveTokens;
}
const IMAGE_BLOCK_TOKENS = 2e3;
const IMAGE_BLOCK_CHARS = IMAGE_BLOCK_TOKENS * 4;
function countContentChars(content) {
	const { text, omissionText } = getCompactionContent(content);
	const images = typeof content === "string" ? 0 : content.filter((block) => block.type === "image").length;
	const omissionChars = omissionText ? omissionText.length + 17 : 0;
	return estimateStringChars(text) + images * IMAGE_BLOCK_CHARS + omissionChars;
}
/** Estimate token count for one message using a conservative character heuristic. */
function estimateTokens(message) {
	if ("excludeFromContext" in message && message.excludeFromContext === true) return 0;
	let chars = 0;
	switch (message.role) {
		case "assistant":
			for (const block of message.content) if (block.type === "text") chars += estimateStringChars(block.text);
			else if (block.type === "thinking") chars += estimateStringChars(block.thinking);
			else if (block.type === "toolCall") chars += estimateStringChars(block.name) + estimateStringChars(stringifyCompactionValue(block.arguments));
			return Math.ceil(chars / 4);
		case "user":
			chars = countContentChars(message.content);
			chars += estimateStringChars(formatPersistedSenderSuffix(message));
			return Math.ceil(chars / 4);
		case "custom":
		case "toolResult":
			chars = countContentChars(message.content);
			return Math.ceil(chars / 4);
		case "bashExecution":
			chars = estimateStringChars(message.command) + estimateStringChars(message.output);
			return Math.ceil(chars / 4);
		case "branchSummary":
		case "compactionSummary":
			chars = estimateStringChars(message.summary);
			return Math.ceil(chars / 4);
	}
	return 0;
}
function isCutPointMessage(message) {
	switch (message.role) {
		case "custom": return !isRuntimeContextCarrier(message);
		case "user":
		case "assistant":
		case "bashExecution":
		case "branchSummary":
		case "compactionSummary": return true;
		case "toolResult": return false;
	}
	return false;
}
function isTurnStartMessage(message) {
	switch (message.role) {
		case "custom": return !isRuntimeContextCarrier(message);
		case "user":
		case "bashExecution":
		case "branchSummary":
		case "compactionSummary": return true;
		case "assistant":
		case "toolResult": return false;
	}
	return false;
}
function isTurnStartEntry(entry) {
	const message = getMessageFromEntryForCompaction(entry);
	return message ? isTurnStartMessage(message) : false;
}
/** Find the user-visible message that starts the turn containing an entry. */
function findTurnStartIndex(entries, entryIndex, startIndex) {
	for (let i = entryIndex; i >= startIndex; i--) {
		const entry = entries[i];
		if (!entry) continue;
		if (isTurnStartEntry(entry)) return i;
	}
	return -1;
}
/** Find the compaction cut point that keeps approximately the requested recent-token budget. */
function findCutPoint(entries, startIndex, endIndex, keepRecentTokens, constraints) {
	const retention = constraints?.budget;
	let cutIndex;
	let lastAllowedCut = endIndex - 1;
	for (let i = startIndex; i < endIndex; i++) {
		const entry = entries[i];
		const message = entry ? getMessageFromEntryForCompaction(entry) : void 0;
		if (entry && entry.id === constraints?.preserveFromEntryId) lastAllowedCut = i;
		if (message && isCutPointMessage(message)) cutIndex = i;
	}
	if (cutIndex === void 0) return {
		firstKeptEntryIndex: startIndex,
		turnStartIndex: -1,
		isSplitTurn: false
	};
	let accumulatedTokens = 0;
	for (let i = endIndex - 1; i >= startIndex; i--) {
		const entry = entries[i];
		if (!entry) continue;
		const message = getMessageFromEntryForCompaction(entry);
		if (!message) continue;
		if (isCutPointMessage(message)) cutIndex = i;
		accumulatedTokens += retention?.estimateTokens(message) ?? estimateTokens(message);
		if (accumulatedTokens >= keepRecentTokens) break;
	}
	cutIndex = Math.min(cutIndex, lastAllowedCut);
	if (retention) {
		let retainedTokens = 0;
		let fittingCut = endIndex;
		let tailLimit = retention.maxTokens;
		for (let i = endIndex - 1; i >= cutIndex; i--) {
			const entry = entries[i];
			const message = entry ? getMessageFromEntryForCompaction(entry) : void 0;
			retainedTokens += message ? retention.estimateTokens(message) : 0;
			if (retainedTokens > tailLimit) break;
			if (i <= lastAllowedCut && message && isCutPointMessage(message)) {
				if (fittingCut === endIndex) tailLimit = Math.max(retainedTokens, retention.maxTokens - retention.reserveTokens);
				fittingCut = i;
			}
		}
		if (fittingCut === endIndex) return {
			firstKeptEntryIndex: endIndex,
			turnStartIndex: -1,
			isSplitTurn: false
		};
		cutIndex = fittingCut;
	}
	while (cutIndex > startIndex) {
		const prevEntry = entries[cutIndex - 1];
		if (!prevEntry) break;
		if (prevEntry.type === "compaction" || prevEntry.type === "reset") break;
		if (prevEntry.type === "message" || getMessageFromEntryForCompaction(prevEntry)) break;
		cutIndex--;
	}
	const cutEntry = entries[cutIndex];
	if (!cutEntry) throw new Error("compaction cut point does not reference a session entry");
	const startsTurn = isTurnStartEntry(cutEntry);
	const turnStartIndex = startsTurn ? -1 : findTurnStartIndex(entries, cutIndex, startIndex);
	return {
		firstKeptEntryIndex: cutIndex,
		turnStartIndex,
		isSplitTurn: !startsTurn && turnStartIndex !== -1
	};
}
const SUMMARIZATION_PROMPT = `The messages above are a conversation to summarize. Create a structured context checkpoint summary that another LLM will use to continue the work.

Use this EXACT format:

## Goal
[What is the user trying to accomplish? Can be multiple items if the session covers different tasks.]

## Constraints & Preferences
- [Any constraints, preferences, or requirements mentioned by user]
- [Or "(none)" if none were mentioned]

## Progress
### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Current work]

### Blocked
- [Issues preventing progress, if any]

## Key Decisions
- **[Decision]**: [Brief rationale]

## Next Steps
1. [Ordered list of what should happen next]

## Critical Context
- [Any data, examples, or references needed to continue]
- [Or "(none)" if not applicable]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
const UPDATE_SUMMARIZATION_PROMPT = `The messages above are NEW conversation messages to incorporate into the existing summary provided in <previous-summary> tags.

Update the existing structured summary with new information. RULES:
- PRESERVE all existing information from the previous summary
- ADD new progress, decisions, and context from the new messages
- UPDATE the Progress section: move items from "In Progress" to "Done" when completed
- UPDATE "Next Steps" based on what was accomplished
- PRESERVE exact file paths, function names, and error messages
- If something is no longer relevant, you may remove it

Use this EXACT format:

## Goal
[Preserve existing goals, add new ones if the task expanded]

## Constraints & Preferences
- [Preserve existing, add new ones discovered]

## Progress
### Done
- [x] [Include previously done items AND newly completed items]

### In Progress
- [ ] [Current work - update based on progress]

### Blocked
- [Current blockers - remove if resolved]

## Key Decisions
- **[Decision]**: [Brief rationale] (preserve all previous, add new)

## Next Steps
1. [Update based on current state]

## Critical Context
- [Preserve important context, add new if needed]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
/** Generate or update a conversation summary for compaction. */
async function generateSummary(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, runtime, summaryPrompt) {
	const maxTokens = Math.min(Math.floor((summaryPrompt?.kind === "turn-prefix" ? .5 : .8) * reserveTokens), model.maxTokens > 0 ? model.maxTokens : Number.POSITIVE_INFINITY);
	const selectedPrompt = summaryPrompt?.kind === "turn-prefix" ? TURN_PREFIX_SUMMARIZATION_PROMPT : summaryPrompt?.instructions;
	return await runSummarizationCompletion({
		messages: currentMessages,
		prompt: summaryPrompt ? [previousSummary && "Update the previous summary with the new conversation. Preserve relevant facts, decisions, and unresolved asks; remove stale or duplicate detail. Use the format below.", selectedPrompt].filter(Boolean).join("\n\n") : previousSummary ? UPDATE_SUMMARIZATION_PROMPT : SUMMARIZATION_PROMPT,
		customInstructions,
		previousSummary,
		model,
		maxTokens,
		apiKey,
		headers,
		signal,
		thinkingLevel,
		streamFn,
		runtime,
		errorLabel: summaryPrompt?.kind === "turn-prefix" ? "Turn prefix summarization" : "Summarization"
	});
}
/** Prepare session entries for compaction, or return undefined when compaction is not applicable. */
function prepareCompaction(pathEntries, settings, requestState, constraints) {
	const lastEntry = pathEntries.at(-1);
	if (!lastEntry || lastEntry.type === "reset" || lastEntry.type === "compaction" && lastEntry.fromHook) return ok(void 0);
	let prevBoundaryIndex = -1;
	for (let i = pathEntries.length - 1; i >= 0; i--) {
		const type = pathEntries.at(i)?.type;
		if (type === "compaction" || type === "reset") {
			prevBoundaryIndex = i;
			break;
		}
	}
	let previousSummary;
	let previousSummaryDetails;
	let previousLatestUnresolvedUserRequest;
	let effectiveEntries = pathEntries;
	let resetPreludeMessages = [];
	let boundaryStart = 0;
	if (prevBoundaryIndex >= 0) {
		const prevBoundary = pathEntries[prevBoundaryIndex];
		previousSummary = prevBoundary?.type === "compaction" ? prevBoundary.summary : void 0;
		if (prevBoundary?.type === "compaction") {
			const details = parseCompactionDetails(prevBoundary.details);
			previousLatestUnresolvedUserRequest = details?.latestUnresolvedUserRequest;
			if (!prevBoundary.fromHook) previousSummaryDetails = details;
		}
		const firstKeptEntryId = prevBoundary?.type === "compaction" || prevBoundary?.type === "reset" ? prevBoundary.firstKeptEntryId : void 0;
		const firstKeptEntryIndex = pathEntries.findIndex((entry) => entry.id === firstKeptEntryId);
		if (prevBoundary?.type === "reset") {
			resetPreludeMessages = (firstKeptEntryIndex >= 0 ? selectResetKeptEntries(pathEntries.slice(firstKeptEntryIndex, prevBoundaryIndex)) : []).flatMap((entry) => {
				const message = getMessageFromEntryForCompaction(entry);
				return message ? [message] : [];
			});
			effectiveEntries = pathEntries.slice(prevBoundaryIndex + 1);
			prevBoundaryIndex = -1;
		} else boundaryStart = firstKeptEntryIndex >= 0 ? firstKeptEntryIndex : prevBoundaryIndex + 1;
	}
	const boundaryEnd = effectiveEntries.length;
	const contextMessages = buildSessionContext(pathEntries).messages;
	const latestUnresolvedUserRequest = requestState ? extractLatestUserRequest(contextMessages) ?? previousLatestUnresolvedUserRequest : void 0;
	const contextUsage = estimateContextTokens(contextMessages);
	const tokensBefore = contextUsage.tokens;
	const totalEstimatedTokens = contextMessages.reduce((total, message) => total + estimateTokens(message), 0);
	const triggerUnitScale = !constraints?.budget && totalEstimatedTokens > 0 && Number.isFinite(totalEstimatedTokens) && Number.isFinite(contextUsage.usageTokens) ? Math.min(Math.max(1, settings.keepRecentTokens), Math.max(1, contextUsage.usageTokens / totalEstimatedTokens)) : 1;
	const resetPreludeTokens = resetPreludeMessages.reduce((total, message) => total + estimateTokens(message), 0);
	const keepRecentTokens = Math.min(Number.MAX_SAFE_INTEGER, settings.keepRecentTokens / triggerUnitScale + resetPreludeTokens);
	const cutPoint = findCutPoint(effectiveEntries, boundaryStart, boundaryEnd, keepRecentTokens, constraints);
	if (cutPoint.firstKeptEntryIndex === boundaryEnd) return err(new CompactionError("summarization_failed", "No complete recent message fits beside the foreground prompt, tools, and summary. Reduce the request or select a larger context window."));
	const firstKeptEntry = effectiveEntries[cutPoint.firstKeptEntryIndex];
	if (!firstKeptEntry?.id) return err(new CompactionError("invalid_session", "First kept entry has no UUID - session may need migration"));
	const firstKeptEntryId = firstKeptEntry.id;
	const historyEnd = cutPoint.isSplitTurn ? cutPoint.turnStartIndex : cutPoint.firstKeptEntryIndex;
	const messagesToSummarize = [...resetPreludeMessages];
	for (let i = boundaryStart; i < historyEnd; i++) {
		const entry = effectiveEntries.at(i);
		const msg = entry ? getMessageFromEntryForCompaction(entry) : void 0;
		if (msg) messagesToSummarize.push(msg);
	}
	const turnPrefixMessages = [];
	if (cutPoint.isSplitTurn) for (let i = cutPoint.turnStartIndex; i < cutPoint.firstKeptEntryIndex; i++) {
		const entry = effectiveEntries.at(i);
		const msg = entry ? getMessageFromEntryForCompaction(entry) : void 0;
		if (msg) turnPrefixMessages.push(msg);
	}
	if (messagesToSummarize.length === 0 && turnPrefixMessages.length === 0) return ok(void 0);
	const fileOps = extractFileOperations(messagesToSummarize, effectiveEntries, prevBoundaryIndex);
	if (cutPoint.isSplitTurn) for (const msg of turnPrefixMessages) extractFileOpsFromMessage(msg, fileOps);
	return ok({
		firstKeptEntryId,
		messagesToSummarize,
		turnPrefixMessages,
		isSplitTurn: cutPoint.isSplitTurn,
		...latestUnresolvedUserRequest ? { latestUnresolvedUserRequest } : {},
		tokensBefore,
		previousSummary,
		previousSummaryDetails,
		fileOps,
		settings
	});
}
const TURN_PREFIX_SUMMARIZATION_PROMPT = `This is the PREFIX of a turn that was too large to keep. The SUFFIX (recent work) is retained.

Summarize the prefix to provide context for the retained suffix:

## Original Request
[What did the user ask for in this turn?]

## Early Progress
- [Key decisions and work done in the prefix]

## Context for Suffix
- [Information needed to understand the retained recent work]

Be concise. Focus on what's needed to understand the kept suffix.`;
/** Generate compaction summary data from prepared session history. */
async function compact(preparation, model, apiKey, headers, customInstructions, signal, thinkingLevel, streamFn, runtime) {
	const { firstKeptEntryId, messagesToSummarize, turnPrefixMessages, isSplitTurn, tokensBefore, previousSummary, previousSummaryDetails, fileOps, settings } = preparation;
	if (!firstKeptEntryId) return err(new CompactionError("invalid_session", "First kept entry has no UUID - session may need migration"));
	const summarizeTurnPrefix = isSplitTurn && turnPrefixMessages.length > 0;
	const previousFileOperations = previousSummaryDetails ? formatFileOperations(previousSummaryDetails.readFiles, previousSummaryDetails.modifiedFiles) : "";
	const preservedPreviousSummary = previousFileOperations && previousSummary?.endsWith(previousFileOperations) ? previousSummary.slice(0, -previousFileOperations.length) : previousSummary;
	const historyResult = messagesToSummarize.length > 0 || !summarizeTurnPrefix ? await generateSummary(messagesToSummarize, model, settings.reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, runtime) : ok(preservedPreviousSummary ?? "No prior history.");
	if (!historyResult.ok) return err(historyResult.error);
	let latestContext = "";
	if (summarizeTurnPrefix) {
		const turnPrefixResult = await generateSummary(turnPrefixMessages, model, settings.reserveTokens, apiKey, headers, signal, customInstructions, void 0, thinkingLevel, streamFn, runtime, { kind: "turn-prefix" });
		if (!turnPrefixResult.ok) return err(turnPrefixResult.error);
		latestContext = `${TURN_CONTEXT_PREFIX}${turnPrefixResult.value}`;
	}
	const { readFiles, modifiedFiles } = computeFileLists(fileOps);
	const fileOperations = formatFileOperations(readFiles, modifiedFiles);
	const unresolvedRequestContext = preparation.latestUnresolvedUserRequest ? `## Latest unresolved user request\n${JSON.stringify(preparation.latestUnresolvedUserRequest)}\n\n` : "";
	const fitted = fitCompactionSummary(preparation.summaryTokenBudget, (maxChars) => {
		const requiredChars = fileOperations.length + unresolvedRequestContext.length;
		if (maxChars <= requiredChars + 46) return;
		const preservedHistoryChars = Math.min(historyResult.value.length, Math.floor((preparation.summaryTokenBudget === void 0 ? maxChars : maxChars - requiredChars) / 2));
		const latestContextBudget = maxChars - requiredChars - 46 - preservedHistoryChars;
		if (preparation.summaryTokenBudget !== void 0 && latestContext && latestContextBudget < 86) return;
		const suffix = `${latestContextBudget > 0 ? capCompactionSummary(latestContext, latestContextBudget) : ""}${fileOperations}`;
		return { summary: `${unresolvedRequestContext}${capCompactionSummary(`${historyResult.value}${suffix}`, maxChars - unresolvedRequestContext.length, suffix)}` };
	});
	if (!fitted.ok) return fitted;
	const { summary } = fitted.value;
	return ok({
		summary,
		firstKeptEntryId,
		tokensBefore,
		details: {
			readFiles,
			modifiedFiles,
			...preparation.latestUnresolvedUserRequest ? { latestUnresolvedUserRequest: preparation.latestUnresolvedUserRequest } : {}
		}
	});
}
//#endregion
export { resolveAgentReasoningOption as A, mergeSummaryFileOperations as C, resolveAgentCoreCompleteFn as D, consumeAgentCoreStream as E, CompactionError as M, InvalidSummaryOutputError as N, resolveAgentCoreStreamFn as O, formatFileOperations as S, SUMMARIZATION_SYSTEM_PROMPT as T, MAX_FILE_OPS_SECTION_CHARS as _, calculateContextTokens as a, extractFileOpsFromMessage as b, estimateContextTokens as c, findTurnStartIndex as d, fitCompactionSummary as f, shouldCompact as g, prepareCompaction as h, SUMMARY_TRUNCATED_MARKER as i, BranchSummaryError as j, runAgentCoreStream as k, estimateTokens as l, getLastAssistantUsage as m, IMAGE_BLOCK_TOKENS as n, capCompactionSummary as o, generateSummary as p, MAX_COMPACTION_SUMMARY_CHARS as r, compact as s, DEFAULT_COMPACTION_SETTINGS as t, findCutPoint as u, computeFileLists as v, serializeConversation as w, extractSummaryText as x, createFileOps as y };
