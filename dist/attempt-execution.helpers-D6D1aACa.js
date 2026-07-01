import { c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { i as isPathInside } from "./path-BlG8lhgR.js";
import "./path-guards-CBe_wA_B.js";
import { y as resolveSessionAgentIds } from "./agent-scope-CDZXADgT.js";
import { a as resolveSessionFilePath, o as resolveSessionFilePathOptions } from "./paths-CHZBIGhF.js";
import { c as selectSessionTranscriptLeafControlledPath } from "./transcript-tree-3cM1TqAJ.js";
import { o as normalizeProviderId } from "./model-selection-normalize-Df7baLev.js";
import "./model-selection-i8V2iTdL.js";
import { c as parseSessionEntries, s as migrateSessionEntries } from "./session-manager-D5YeJxMM.js";
import { r as stripInboundMetadata } from "./strip-inbound-meta-BI3m2RBP.js";
import { a as isSilentReplyPrefixText, c as stripLeadingSilentToken, n as SILENT_REPLY_TOKEN, o as isSilentReplyText, s as startsWithSilentToken } from "./tokens-Zsy11rTo.js";
import { t as attachOpenClawTranscriptMeta } from "./session-utils.fs-CuEupzWa.js";
import "./session-transcript-readers-B1Z-s_uS.js";
import { r as cliBackendLog } from "./log-CRVu7uZX.js";
import { t as resolveClaudeCliProjectDirForWorkspace } from "./claude-cli-project-dir-BiEZcIls.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import readline from "node:readline";
/** Returns the tail of hook history capped at the configured maximum. */
function limitAgentHookHistoryMessages(messages, maxMessages = 100) {
	if (maxMessages <= 0) return [];
	return messages.slice(-maxMessages);
}
/** Builds hook-visible conversation messages from bounded history plus current turn. */
function buildAgentHookConversationMessages(params) {
	return [...limitAgentHookHistoryMessages(params.historyMessages ?? []), ...params.currentTurnMessages ?? []];
}
/** Maximum transcript messages exposed to CLI hook history. */
const MAX_CLI_SESSION_HISTORY_MESSAGES = 100;
/** Minimum reseed-history prompt budget for fresh CLI sessions. */
const MAX_CLI_SESSION_RESEED_HISTORY_CHARS = 12 * 1024;
/** Maximum automatic reseed-history prompt budget derived from context size. */
const MAX_AUTO_CLI_SESSION_RESEED_HISTORY_CHARS = 256 * 1024;
const CLI_SESSION_RESEED_HISTORY_CONTEXT_SHARE = .08;
const CHARS_PER_TOKEN_ESTIMATE = 4;
const RAW_TRANSCRIPT_RESEED_ALLOWED_REASONS = new Set([
	"missing-transcript",
	"orphaned-tool-use",
	"system-prompt",
	"cwd",
	"mcp",
	"session-expired"
]);
/** Resolves how much prior transcript text may reseed a fresh CLI session. */
function resolveAutoCliSessionReseedHistoryChars(contextWindowTokens) {
	if (!Number.isFinite(contextWindowTokens) || contextWindowTokens <= 0) return MAX_CLI_SESSION_RESEED_HISTORY_CHARS;
	const contextShareChars = Math.floor(contextWindowTokens * CLI_SESSION_RESEED_HISTORY_CONTEXT_SHARE * CHARS_PER_TOKEN_ESTIMATE);
	return Math.max(MAX_CLI_SESSION_RESEED_HISTORY_CHARS, Math.min(MAX_AUTO_CLI_SESSION_RESEED_HISTORY_CHARS, contextShareChars));
}
function coerceHistoryText(content) {
	if (typeof content === "string") return content.trim();
	if (!Array.isArray(content)) return "";
	return content.flatMap((block) => {
		if (!block || typeof block !== "object") return [];
		const text = block.text;
		return typeof text === "string" && text.trim().length > 0 ? [text.trim()] : [];
	}).join("\n").trim();
}
function coerceHistoryTimestamp(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string") return value;
	return 0;
}
function historyEntryToContextEngineMessage(entry) {
	if (entry.type === "message") return entry.message;
	if (entry.type === "custom_message") return {
		role: "custom",
		customType: typeof entry.customType === "string" ? entry.customType : "custom",
		content: entry.content,
		display: entry.display !== false,
		details: entry.details,
		timestamp: coerceHistoryTimestamp(entry.timestamp)
	};
	if (entry.type === "branch_summary") return {
		role: "branchSummary",
		summary: typeof entry.summary === "string" ? entry.summary : "",
		fromId: typeof entry.fromId === "string" ? entry.fromId : "root",
		timestamp: coerceHistoryTimestamp(entry.timestamp)
	};
}
function loadContextEngineMessagesFromEntries(entries) {
	return entries.flatMap((entry) => {
		const message = historyEntryToContextEngineMessage(entry);
		return message ? [message] : [];
	});
}
function renderHistoryMessage(message) {
	if (!message || typeof message !== "object") return;
	const entry = message;
	const role = entry.role === "assistant" ? "Assistant" : entry.role === "user" ? "User" : entry.role === "compactionSummary" ? "Compaction summary" : void 0;
	if (!role) return;
	const text = entry.role === "compactionSummary" && typeof entry.summary === "string" ? entry.summary.trim() : coerceHistoryText(entry.content);
	return text ? `${role}: ${text}` : void 0;
}
/** Builds a reseed prompt that carries prior OpenClaw transcript context. */
function buildCliSessionHistoryPrompt(params) {
	const maxHistoryChars = params.maxHistoryChars ?? 12288;
	const firstEntry = params.messages[0];
	const firstIsCompaction = Boolean(firstEntry) && typeof firstEntry === "object" && firstEntry.role === "compactionSummary";
	const summaryRendered = firstIsCompaction ? renderHistoryMessage(firstEntry) : void 0;
	const tailRaw = (firstIsCompaction ? params.messages.slice(1) : params.messages).flatMap((message) => {
		const rendered = renderHistoryMessage(message);
		return rendered ? [rendered] : [];
	}).join("\n\n").trim();
	const truncationMarker = "[OpenClaw reseed history truncated; older turns dropped]";
	const renderTruncatedSummaryWithTail = (renderedSummary) => {
		const tailBudget = tailRaw.length > 0 ? Math.min(tailRaw.length, Math.floor(maxHistoryChars / 2)) : 0;
		const separatorBudget = tailBudget > 0 ? 2 : 1;
		const summaryBudget = Math.max(0, maxHistoryChars - 56 - separatorBudget - tailBudget);
		return [
			truncationMarker,
			renderedSummary.slice(0, summaryBudget).trimEnd(),
			tailBudget > 0 ? tailRaw.slice(-tailBudget).trimStart() : ""
		].filter(Boolean).join("\n");
	};
	let renderedHistory;
	if (summaryRendered) if (summaryRendered.length >= maxHistoryChars) renderedHistory = renderTruncatedSummaryWithTail(summaryRendered);
	else if (tailRaw.length === 0) renderedHistory = summaryRendered;
	else {
		const summaryBlock = `${summaryRendered}\n\n`;
		const remainingBudget = maxHistoryChars - summaryBlock.length;
		if (remainingBudget <= 0) renderedHistory = renderTruncatedSummaryWithTail(summaryRendered);
		else if (tailRaw.length > remainingBudget) renderedHistory = `${summaryBlock}${truncationMarker}\n${tailRaw.slice(-remainingBudget).trimStart()}`;
		else renderedHistory = `${summaryBlock}${tailRaw}`;
	}
	else renderedHistory = tailRaw.length > maxHistoryChars ? `${truncationMarker}\n${tailRaw.slice(-maxHistoryChars).trimStart()}` : tailRaw;
	if (!renderedHistory) return;
	return [
		"Continue this conversation using the OpenClaw transcript below as prior session history.",
		"Treat it as authoritative context for this fresh CLI session.",
		"",
		"<conversation_history>",
		renderedHistory,
		"</conversation_history>",
		"",
		"<next_user_message>",
		params.prompt,
		"</next_user_message>"
	].join("\n");
}
async function safeRealpath(filePath) {
	try {
		return await fs$1.realpath(filePath);
	} catch {
		return;
	}
}
function resolveSafeCliSessionFile(params) {
	const { defaultAgentId, sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	const pathOptions = resolveSessionFilePathOptions({
		agentId: sessionAgentId ?? defaultAgentId,
		storePath: params.config?.session?.store
	});
	const sessionFile = resolveSessionFilePath(params.sessionId, { sessionFile: params.sessionFile }, pathOptions);
	return {
		sessionFile,
		sessionsDir: pathOptions?.sessionsDir ?? path.dirname(sessionFile)
	};
}
async function loadCliSessionEntries(params) {
	try {
		const { sessionFile, sessionsDir } = resolveSafeCliSessionFile(params);
		const entryStat = await fs$1.lstat(sessionFile);
		if (!entryStat.isFile() || entryStat.isSymbolicLink()) return [];
		const realSessionsDir = await safeRealpath(sessionsDir) ?? path.resolve(sessionsDir);
		const realSessionFile = await safeRealpath(sessionFile);
		if (!realSessionFile || realSessionFile === realSessionsDir || !isPathInside(realSessionsDir, realSessionFile)) return [];
		const stat = await fs$1.stat(realSessionFile);
		if (!stat.isFile() || stat.size > 5242880) return [];
		const entries = parseSessionEntries(await fs$1.readFile(realSessionFile, "utf-8"));
		migrateSessionEntries(entries);
		const sessionEntries = entries.filter((entry) => entry.type !== "session");
		return selectSessionTranscriptLeafControlledPath(sessionEntries) ?? sessionEntries;
	} catch {
		return [];
	}
}
/** Checks whether a safe, bounded transcript file exists for a CLI session. */
async function hasCliSessionTranscript(params) {
	try {
		const { sessionFile, sessionsDir } = resolveSafeCliSessionFile(params);
		const entryStat = await fs$1.lstat(sessionFile);
		if (!entryStat.isFile() || entryStat.isSymbolicLink()) return false;
		const realSessionsDir = await safeRealpath(sessionsDir) ?? path.resolve(sessionsDir);
		const realSessionFile = await safeRealpath(sessionFile);
		if (!realSessionFile || realSessionFile === realSessionsDir || !isPathInside(realSessionsDir, realSessionFile)) return false;
		const stat = await fs$1.stat(realSessionFile);
		return stat.isFile() && stat.size <= 5242880;
	} catch {
		return false;
	}
}
/** Loads transcript messages for CLI lifecycle hook context. */
async function loadCliSessionHistoryMessages(params) {
	return limitAgentHookHistoryMessages((await loadCliSessionEntries(params)).flatMap((entry) => {
		const candidate = entry;
		return candidate.type === "message" ? [candidate.message] : [];
	}), MAX_CLI_SESSION_HISTORY_MESSAGES);
}
/** Loads transcript messages formatted for context-engine updates. */
async function loadCliSessionContextEngineMessages(params) {
	const entries = await loadCliSessionEntries(params);
	const latestCompactionIndex = entries.findLastIndex((entry) => {
		const candidate = entry;
		return candidate.type === "compaction" && typeof candidate.summary === "string";
	});
	if (latestCompactionIndex < 0) return loadContextEngineMessagesFromEntries(entries);
	const compaction = entries[latestCompactionIndex];
	const summary = typeof compaction.summary === "string" ? compaction.summary.trim() : "";
	if (!summary) return loadContextEngineMessagesFromEntries(entries);
	const tailMessages = loadContextEngineMessagesFromEntries(entries.slice(latestCompactionIndex + 1));
	return [{
		role: "compactionSummary",
		summary,
		timestamp: coerceHistoryTimestamp(compaction.timestamp),
		tokensBefore: typeof compaction.tokensBefore === "number" ? compaction.tokensBefore : 0,
		...typeof compaction.tokensAfter === "number" ? { tokensAfter: compaction.tokensAfter } : {},
		...typeof compaction.firstKeptEntryId === "string" ? { firstKeptEntryId: compaction.firstKeptEntryId } : {},
		...compaction.details !== void 0 ? { details: compaction.details } : {}
	}, ...tailMessages];
}
/** Loads compacted/raw transcript messages eligible for CLI session reseeding. */
async function loadCliSessionReseedMessages(params) {
	const entries = await loadCliSessionEntries(params);
	const loadRawTail = () => {
		if (params.allowRawTranscriptReseed !== true || !params.rawTranscriptReseedReason || !RAW_TRANSCRIPT_RESEED_ALLOWED_REASONS.has(params.rawTranscriptReseedReason)) return [];
		return limitAgentHookHistoryMessages(entries.flatMap((entry) => {
			const candidate = entry;
			return candidate.type === "message" ? [candidate.message] : [];
		}), MAX_CLI_SESSION_HISTORY_MESSAGES);
	};
	const latestCompactionIndex = entries.findLastIndex((entry) => {
		const candidate = entry;
		return candidate.type === "compaction" && typeof candidate.summary === "string";
	});
	if (latestCompactionIndex < 0) return loadRawTail();
	const compaction = entries[latestCompactionIndex];
	const summary = typeof compaction.summary === "string" ? compaction.summary.trim() : "";
	if (!summary) return loadRawTail();
	const tailMessages = entries.slice(latestCompactionIndex + 1).flatMap((entry) => {
		const candidate = entry;
		return candidate.type === "message" ? [candidate.message] : [];
	});
	return [{
		role: "compactionSummary",
		summary
	}, ...limitAgentHookHistoryMessages(tailMessages, MAX_CLI_SESSION_HISTORY_MESSAGES - 1)];
}
//#endregion
//#region src/chat/tool-content.ts
const TOOL_USE_ID_FIELDS = [
	"id",
	"tool_call_id",
	"toolCallId",
	"tool_use_id",
	"toolUseId"
];
function normalizeToolContentType(value) {
	return typeof value === "string" ? value.toLowerCase() : "";
}
/** Accepts tool-call content type spellings used by provider SDKs and persisted transcripts. */
function isToolCallContentType(value) {
	const type = normalizeToolContentType(value);
	return type === "toolcall" || type === "tool_call" || type === "tooluse" || type === "tool_use";
}
/** Accepts tool-result content type spellings used by provider SDKs and persisted transcripts. */
function isToolResultContentType(value) {
	const type = normalizeToolContentType(value);
	return type === "toolresult" || type === "tool_result";
}
/** Narrows unknown chat content blocks to provider-shaped tool-call blocks. */
function isToolCallBlock(block) {
	return isToolCallContentType(block.type);
}
/** Narrows unknown chat content blocks to provider-shaped tool-result blocks. */
function isToolResultBlock(block) {
	return isToolResultContentType(block.type);
}
/** Reads the stable tool-use id across snake_case and camelCase provider field names. */
function resolveToolUseId(block) {
	for (const field of TOOL_USE_ID_FIELDS) {
		const id = normalizeOptionalString(block[field]);
		if (id) return id;
	}
}
//#endregion
//#region src/gateway/cli-session-history.claude.ts
const CLAUDE_CLI_PROVIDER = "claude-cli";
const CLAUDE_PROJECTS_RELATIVE_DIR = path.join(".claude", "projects");
function resolveHistoryHomeDir(homeDir) {
	return normalizeOptionalString(homeDir) || process.env.HOME || os.homedir();
}
function resolveClaudeProjectsDir(homeDir) {
	return path.join(resolveHistoryHomeDir(homeDir), CLAUDE_PROJECTS_RELATIVE_DIR);
}
function resolveClaudeCliBindingSessionId(entry) {
	const bindingSessionId = normalizeOptionalString(entry?.cliSessionBindings?.[CLAUDE_CLI_PROVIDER]?.sessionId);
	if (bindingSessionId) return bindingSessionId;
	const legacyMapSessionId = normalizeOptionalString(entry?.cliSessionIds?.[CLAUDE_CLI_PROVIDER]);
	if (legacyMapSessionId) return legacyMapSessionId;
	return normalizeOptionalString(entry?.claudeCliSessionId) || void 0;
}
function resolveTimestampMs(value) {
	if (typeof value !== "string") return;
	const parsed = Date.parse(value);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function resolveClaudeCliUsage(raw) {
	if (!raw || typeof raw !== "object") return;
	const input = asFiniteNumber(raw.input_tokens);
	const output = asFiniteNumber(raw.output_tokens);
	const cacheRead = asFiniteNumber(raw.cache_read_input_tokens);
	const cacheWrite = asFiniteNumber(raw.cache_creation_input_tokens);
	if (input === void 0 && output === void 0 && cacheRead === void 0 && cacheWrite === void 0) return;
	return {
		...input !== void 0 ? { input } : {},
		...output !== void 0 ? { output } : {},
		...cacheRead !== void 0 ? { cacheRead } : {},
		...cacheWrite !== void 0 ? { cacheWrite } : {}
	};
}
function cloneJsonValue(value) {
	return structuredClone(value);
}
function normalizeClaudeCliContent(content, toolNameRegistry) {
	if (!Array.isArray(content)) return cloneJsonValue(content);
	const normalized = [];
	for (const item of content) {
		if (!item || typeof item !== "object") {
			normalized.push(cloneJsonValue(item));
			continue;
		}
		const block = cloneJsonValue(item);
		const type = typeof block.type === "string" ? block.type : "";
		if (type === "tool_use") {
			const id = normalizeOptionalString(block.id) ?? "";
			const name = normalizeOptionalString(block.name) ?? "";
			if (id && name) toolNameRegistry.set(id, name);
			if (block.input !== void 0 && block.arguments === void 0) block.arguments = cloneJsonValue(block.input);
			block.type = "toolcall";
			delete block.input;
			normalized.push(block);
			continue;
		}
		if (type === "tool_result") {
			const toolUseId = resolveToolUseId(block);
			if (!block.name && toolUseId) {
				const toolName = toolNameRegistry.get(toolUseId);
				if (toolName) block.name = toolName;
			}
			normalized.push(block);
			continue;
		}
		normalized.push(block);
	}
	return normalized;
}
function getMessageBlocks(message) {
	if (!message || typeof message !== "object") return null;
	const content = message.content;
	return Array.isArray(content) ? content : null;
}
function isAssistantToolCallMessage(message) {
	if (!message || typeof message !== "object") return false;
	if (message.role !== "assistant") return false;
	const blocks = getMessageBlocks(message);
	return Boolean(blocks && blocks.length > 0 && blocks.every(isToolCallBlock));
}
function isUserToolResultMessage(message) {
	if (!message || typeof message !== "object") return false;
	if (message.role !== "user") return false;
	const blocks = getMessageBlocks(message);
	return Boolean(blocks && blocks.length > 0 && blocks.every(isToolResultBlock));
}
function coalesceClaudeCliToolMessages(messages) {
	const coalesced = [];
	for (let index = 0; index < messages.length; index += 1) {
		const current = messages[index];
		const next = messages[index + 1];
		if (!isAssistantToolCallMessage(current) || !isUserToolResultMessage(next)) {
			coalesced.push(current);
			continue;
		}
		const callBlocks = getMessageBlocks(current) ?? [];
		const resultBlocks = getMessageBlocks(next) ?? [];
		const callIds = new Set(callBlocks.map(resolveToolUseId).filter((id) => Boolean(id)));
		if (!(resultBlocks.length > 0 && resultBlocks.every((block) => {
			const toolUseId = resolveToolUseId(block);
			return Boolean(toolUseId && callIds.has(toolUseId));
		}))) {
			coalesced.push(current);
			continue;
		}
		coalesced.push({
			...current,
			content: [...callBlocks.map(cloneJsonValue), ...resultBlocks.map(cloneJsonValue)]
		});
		index += 1;
	}
	return coalesced;
}
function parseClaudeCliHistoryEntry(entry, cliSessionId, toolNameRegistry) {
	if (entry.isSidechain === true || !entry.message || typeof entry.message !== "object") return null;
	const type = typeof entry.type === "string" ? entry.type : void 0;
	const role = typeof entry.message.role === "string" ? entry.message.role : void 0;
	if (type !== "user" && type !== "assistant" || role !== type) return null;
	const timestamp = resolveTimestampMs(entry.timestamp);
	const baseMeta = {
		importedFrom: CLAUDE_CLI_PROVIDER,
		cliSessionId,
		...normalizeOptionalString(entry.uuid) ? { externalId: entry.uuid } : {}
	};
	const content = typeof entry.message.content === "string" || Array.isArray(entry.message.content) ? normalizeClaudeCliContent(entry.message.content, toolNameRegistry) : void 0;
	if (content === void 0) return null;
	if (type === "user") return attachOpenClawTranscriptMeta({
		role: "user",
		content,
		...timestamp !== void 0 ? { timestamp } : {}
	}, baseMeta);
	return attachOpenClawTranscriptMeta({
		role: "assistant",
		content,
		api: "anthropic-messages",
		provider: CLAUDE_CLI_PROVIDER,
		...normalizeOptionalString(entry.message.model) ? { model: entry.message.model } : {},
		...normalizeOptionalString(entry.message.stop_reason) ? { stopReason: entry.message.stop_reason } : {},
		...resolveClaudeCliUsage(entry.message.usage) ? { usage: resolveClaudeCliUsage(entry.message.usage) } : {},
		...timestamp !== void 0 ? { timestamp } : {}
	}, baseMeta);
}
function resolveClaudeCliSessionFilePath(params) {
	const sessionId = params.cliSessionId.trim();
	if (!sessionId || sessionId === "." || sessionId === ".." || path.isAbsolute(sessionId) || sessionId.includes("/") || sessionId.includes("\\")) return;
	const projectsDir = resolveClaudeProjectsDir(params.homeDir);
	let projectEntries;
	try {
		projectEntries = fs.readdirSync(projectsDir, { withFileTypes: true });
	} catch {
		return;
	}
	for (const entry of projectEntries) {
		if (!entry.isDirectory()) continue;
		const projectDir = path.join(projectsDir, entry.name);
		const candidate = path.resolve(projectDir, `${sessionId}.jsonl`);
		const resolvedProjectDir = path.resolve(projectDir);
		if (!candidate.startsWith(`${resolvedProjectDir}${path.sep}`)) continue;
		if (fs.existsSync(candidate)) return candidate;
	}
}
/** Reads visible messages for a bound Claude CLI session. */
function readClaudeCliSessionMessages(params) {
	const filePath = resolveClaudeCliSessionFilePath(params);
	if (!filePath) return [];
	let content;
	try {
		content = fs.readFileSync(filePath, "utf-8");
	} catch {
		return [];
	}
	const messages = [];
	const toolNameRegistry = /* @__PURE__ */ new Map();
	for (const line of content.split(/\r?\n/)) {
		if (!line.trim()) continue;
		try {
			const message = parseClaudeCliHistoryEntry(JSON.parse(line), params.cliSessionId, toolNameRegistry);
			if (message) messages.push(message);
		} catch {}
	}
	return coalesceClaudeCliToolMessages(messages);
}
function isCompactBoundary(entry) {
	if (entry.type !== "system") return false;
	const subtype = entry.subtype;
	return typeof subtype === "string" && subtype === "compact_boundary";
}
function extractCompactBoundaryFallbackText(entry) {
	const content = entry.content;
	return typeof content === "string" && content.trim() ? content.trim() : void 0;
}
function extractSummaryText(entry) {
	if (entry.type !== "summary") return;
	const summary = entry.summary;
	return typeof summary === "string" && summary.trim() ? summary.trim() : void 0;
}
function readClaudeCliFallbackSeed(params) {
	const filePath = resolveClaudeCliSessionFilePath(params);
	if (!filePath) return;
	let content;
	try {
		content = fs.readFileSync(filePath, "utf-8");
	} catch {
		return;
	}
	let pendingSummary;
	let lastSummary;
	let lastBoundaryFallback;
	let windowedTurns = [];
	const toolNameRegistry = /* @__PURE__ */ new Map();
	for (const line of content.split(/\r?\n/)) {
		if (!line.trim()) continue;
		let parsed;
		try {
			parsed = JSON.parse(line);
		} catch {
			continue;
		}
		const explicitSummary = extractSummaryText(parsed);
		if (explicitSummary) {
			pendingSummary = explicitSummary;
			continue;
		}
		if (isCompactBoundary(parsed)) {
			lastSummary = pendingSummary;
			pendingSummary = void 0;
			lastBoundaryFallback = extractCompactBoundaryFallbackText(parsed) ?? lastBoundaryFallback;
			windowedTurns = [];
			toolNameRegistry.clear();
			continue;
		}
		const message = parseClaudeCliHistoryEntry(parsed, params.cliSessionId, toolNameRegistry);
		if (message) windowedTurns.push(message);
	}
	const recentTurns = coalesceClaudeCliToolMessages(windowedTurns);
	const resolvedSummaryText = lastSummary ?? pendingSummary ?? lastBoundaryFallback;
	if (!resolvedSummaryText && recentTurns.length === 0) return;
	return {
		...resolvedSummaryText ? { summaryText: resolvedSummaryText } : {},
		recentTurns
	};
}
//#endregion
//#region src/gateway/cli-session-history.merge.ts
const DEDUPE_TIMESTAMP_WINDOW_MS = 300 * 1e3;
function extractComparableText(message) {
	if (!message || typeof message !== "object") return;
	const record = message;
	const role = readStringValue(record.role);
	const parts = [];
	const text = readStringValue(record.text);
	if (text !== void 0) parts.push(text);
	const content = readStringValue(record.content);
	if (content !== void 0) parts.push(content);
	else if (Array.isArray(record.content)) {
		for (const block of record.content) if (block && typeof block === "object" && "text" in block) {
			const blockText = readStringValue(block.text);
			if (blockText !== void 0) parts.push(blockText);
		}
	}
	if (parts.length === 0) return;
	const joined = parts.join("\n").trim();
	if (!joined) return;
	return (role === "user" ? stripInboundMetadata(joined) : joined).replace(/\s+/g, " ").trim() || void 0;
}
function resolveComparableTimestamp(message) {
	if (!message || typeof message !== "object") return;
	return asFiniteNumber(message.timestamp);
}
function resolveComparableRole(message) {
	if (!message || typeof message !== "object") return;
	return readStringValue(message.role);
}
function resolveImportedExternalIdentity(message) {
	if (!message || typeof message !== "object") return;
	const meta = "__openclaw" in message && message["__openclaw"] && typeof message["__openclaw"] === "object" ? message["__openclaw"] ?? {} : void 0;
	const externalId = normalizeOptionalString(meta?.externalId);
	return externalId ? {
		externalId,
		importedFrom: normalizeOptionalString(meta?.importedFrom),
		cliSessionId: normalizeOptionalString(meta?.cliSessionId)
	} : void 0;
}
function hasSameExternalIdentity(existing, imported) {
	const importedIdentity = resolveImportedExternalIdentity(imported);
	const existingIdentity = resolveImportedExternalIdentity(existing);
	if (!importedIdentity || !existingIdentity) return false;
	return importedIdentity.externalId === existingIdentity.externalId && importedIdentity.importedFrom === existingIdentity.importedFrom && importedIdentity.cliSessionId === existingIdentity.cliSessionId;
}
function isEquivalentImportedMessage(existing, imported) {
	if (hasSameExternalIdentity(existing, imported)) return true;
	const existingRole = resolveComparableRole(existing);
	const importedRole = resolveComparableRole(imported);
	if (!existingRole || existingRole !== importedRole) return false;
	const existingText = extractComparableText(existing);
	const importedText = extractComparableText(imported);
	if (!existingText || !importedText || existingText !== importedText) return false;
	const existingTimestamp = resolveComparableTimestamp(existing);
	const importedTimestamp = resolveComparableTimestamp(imported);
	if (existingTimestamp === void 0 || importedTimestamp === void 0) return true;
	return Math.abs(existingTimestamp - importedTimestamp) <= DEDUPE_TIMESTAMP_WINDOW_MS;
}
function compareHistoryMessages(a, b) {
	const aTimestamp = resolveComparableTimestamp(a.message);
	const bTimestamp = resolveComparableTimestamp(b.message);
	if (aTimestamp !== void 0 && bTimestamp !== void 0 && aTimestamp !== bTimestamp) return aTimestamp - bTimestamp;
	return a.order - b.order;
}
/** Merges imported CLI transcript messages into local history without duplicating overlaps. */
function mergeImportedChatHistoryMessages(params) {
	if (params.importedMessages.length === 0) return params.localMessages;
	const merged = params.localMessages.map((message, index) => ({
		message,
		order: index
	}));
	let nextOrder = merged.length;
	for (const imported of params.importedMessages) {
		if (merged.some((existing) => isEquivalentImportedMessage(existing.message, imported))) continue;
		merged.push({
			message: imported,
			order: nextOrder
		});
		nextOrder += 1;
	}
	merged.sort(compareHistoryMessages);
	return merged.map((entry) => entry.message);
}
//#endregion
//#region src/gateway/cli-session-history.ts
const ANTHROPIC_PROVIDER = "anthropic";
/** Augments local chat history with bound Claude CLI session messages when applicable. */
function augmentChatHistoryWithCliSessionImports(params) {
	const cliSessionId = resolveClaudeCliBindingSessionId(params.entry);
	if (!cliSessionId) return params.localMessages;
	const normalizedProvider = normalizeProviderId(params.provider ?? "");
	if (normalizedProvider && normalizedProvider !== "claude-cli" && normalizedProvider !== ANTHROPIC_PROVIDER && params.localMessages.length > 0) return params.localMessages;
	const importedMessages = readClaudeCliSessionMessages({
		cliSessionId,
		homeDir: params.homeDir
	});
	return mergeImportedChatHistoryMessages({
		localMessages: params.localMessages,
		importedMessages
	});
}
//#endregion
//#region src/agents/command/attempt-execution.helpers.ts
/**
* Helper functions for agent attempt execution, Claude CLI transcript probing,
* fallback prompts, and ACP visible-text accumulation.
*/
const SESSION_FILE_MAX_RECORDS = 500;
function normalizeClaudeCliSessionId(sessionId) {
	const trimmed = sessionId?.trim();
	if (!trimmed || trimmed.includes("\0") || trimmed.includes("/") || trimmed.includes("\\")) return;
	return trimmed;
}
async function scanJsonlFile(filePath) {
	if (!filePath) return {
		fileExists: false,
		hasAssistant: false
	};
	try {
		const stat = await fs$1.lstat(filePath);
		if (stat.isSymbolicLink() || !stat.isFile()) return {
			fileExists: false,
			hasAssistant: false
		};
		const fh = await fs$1.open(filePath, "r");
		try {
			const rl = readline.createInterface({ input: fh.createReadStream({ encoding: "utf-8" }) });
			let recordCount = 0;
			for await (const line of rl) {
				if (!line.trim()) continue;
				recordCount++;
				if (recordCount > SESSION_FILE_MAX_RECORDS) break;
				let obj;
				try {
					obj = JSON.parse(line);
				} catch {
					continue;
				}
				if ((obj?.message)?.role === "assistant") return {
					fileExists: true,
					hasAssistant: true
				};
			}
			return {
				fileExists: true,
				hasAssistant: false
			};
		} finally {
			await fh.close();
		}
	} catch {
		return {
			fileExists: false,
			hasAssistant: false
		};
	}
}
async function jsonlFileHasAssistantMessage(filePath) {
	return (await scanJsonlFile(filePath)).hasAssistant;
}
/**
* Check whether a session transcript file exists and contains at least one
* assistant message, indicating that the SessionManager has flushed the
* initial user+assistant exchange to disk.
*/
async function sessionFileHasContent(sessionFile) {
	return await jsonlFileHasAssistantMessage(sessionFile);
}
/** Resolves the expected Claude CLI transcript JSONL path for a session. */
function claudeCliSessionTranscriptPath(params) {
	const sessionId = normalizeClaudeCliSessionId(params.sessionId);
	if (!sessionId) return null;
	const workspaceDir = params.workspaceDir?.trim();
	if (!workspaceDir) return null;
	return path.join(resolveClaudeCliProjectDirForWorkspace({
		workspaceDir,
		homeDir: params.homeDir
	}), `${sessionId}.jsonl`);
}
const CLAUDE_CLI_TRANSCRIPT_FLUSH_GRACE_MS = 250;
const CLAUDE_CLI_ORPHAN_PROBE_TAIL_BYTES = 1024 * 1024;
/** Checks whether Claude CLI has flushed assistant content for a session. */
async function claudeCliSessionTranscriptHasContent(params) {
	const expectedPath = claudeCliSessionTranscriptPath({
		sessionId: params.sessionId,
		workspaceDir: params.workspaceDir,
		homeDir: params.homeDir
	});
	if (!expectedPath) return false;
	if ((await scanJsonlFile(expectedPath)).hasAssistant) return true;
	await new Promise((resolve) => {
		setTimeout(resolve, CLAUDE_CLI_TRANSCRIPT_FLUSH_GRACE_MS);
	});
	const second = await scanJsonlFile(expectedPath);
	if (second.hasAssistant) return true;
	const sessionId = normalizeClaudeCliSessionId(params.sessionId);
	cliBackendLog.warn(`claude-cli transcript probe v4 miss (sessionId-deterministic path, grace ${CLAUDE_CLI_TRANSCRIPT_FLUSH_GRACE_MS}ms): sessionId=${sessionId ?? ""} expectedPath=${expectedPath} fileExists=${second.fileExists}`);
	return false;
}
function toToolContentBlocks(content) {
	if (!Array.isArray(content)) return;
	return content.filter((item) => Boolean(item && typeof item === "object"));
}
function isClaudeTranscriptToolUseBlock(block) {
	const type = block.type;
	return type === "tool_use" || type === "server_tool_use" || type === "mcp_tool_use";
}
function isClaudeTranscriptToolResultBlock(block) {
	const type = block.type;
	return type === "tool_result" || typeof type === "string" && type.endsWith("_tool_result");
}
async function jsonlFileHasOrphanedTrailingToolUse(filePath) {
	try {
		const stat = await fs$1.lstat(filePath);
		if (stat.isSymbolicLink() || !stat.isFile()) return false;
		const fh = await fs$1.open(filePath, "r");
		try {
			const tailBytes = Math.min(stat.size, CLAUDE_CLI_ORPHAN_PROBE_TAIL_BYTES);
			const start = stat.size - tailBytes;
			const buffer = Buffer.alloc(tailBytes);
			const { bytesRead } = await fh.read(buffer, 0, tailBytes, start);
			let tailText = buffer.toString("utf-8", 0, bytesRead);
			if (start > 0) {
				const firstNewline = tailText.indexOf("\n");
				tailText = firstNewline === -1 ? "" : tailText.slice(firstNewline + 1);
			}
			let lastAssistantToolUseIds = /* @__PURE__ */ new Set();
			let answeredToolResultIds = /* @__PURE__ */ new Set();
			for (const line of tailText.split(/\r?\n/)) {
				if (!line.trim()) continue;
				let obj;
				try {
					obj = JSON.parse(line);
				} catch {
					continue;
				}
				const rec = obj;
				if (rec?.isSidechain === true) continue;
				const message = rec?.message;
				const role = message?.role;
				if (role === "assistant") {
					lastAssistantToolUseIds = /* @__PURE__ */ new Set();
					answeredToolResultIds = /* @__PURE__ */ new Set();
					const blocks = toToolContentBlocks(message?.content);
					if (!blocks) continue;
					for (const block of blocks) if (isClaudeTranscriptToolUseBlock(block)) {
						const id = resolveToolUseId(block);
						if (id) lastAssistantToolUseIds.add(id);
					} else if (isClaudeTranscriptToolResultBlock(block)) {
						const id = resolveToolUseId(block);
						if (id) answeredToolResultIds.add(id);
					}
				} else if (role === "user") {
					const blocks = toToolContentBlocks(message?.content);
					if (!blocks) continue;
					for (const block of blocks) if (isClaudeTranscriptToolResultBlock(block)) {
						const id = resolveToolUseId(block);
						if (id) answeredToolResultIds.add(id);
					}
				}
			}
			for (const id of lastAssistantToolUseIds) if (!answeredToolResultIds.has(id)) return true;
			return false;
		} finally {
			await fh.close();
		}
	} catch {
		return false;
	}
}
/** Checks whether the latest Claude CLI transcript tail has unanswered tool use. */
async function claudeCliSessionTranscriptHasOrphanedToolUse(params) {
	const expectedPath = claudeCliSessionTranscriptPath({
		sessionId: params.sessionId,
		workspaceDir: params.workspaceDir,
		homeDir: params.homeDir
	});
	if (!expectedPath) return false;
	return await jsonlFileHasOrphanedTrailingToolUse(expectedPath);
}
/** Builds the retry prompt sent to fallback models after a failed attempt. */
function resolveFallbackRetryPrompt(params) {
	if (!params.isFallbackRetry) return params.body;
	const prelude = params.priorContextPrelude?.trim();
	if (!params.sessionHasHistory && !prelude) return params.body;
	const retryMarked = `[Retry after the previous model attempt failed or timed out]\n\n${params.body}`;
	return prelude ? `${prelude}\n\n${retryMarked}` : retryMarked;
}
const CLAUDE_CLI_FALLBACK_PRELUDE_DEFAULT_CHAR_BUDGET = 8e3;
const CLAUDE_CLI_FALLBACK_PRELUDE_MIN_TURN_CHARS = 64;
function extractFallbackTurnText(message) {
	const content = message.content;
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	const parts = [];
	for (const block of content) {
		if (typeof block === "string") {
			parts.push(block);
			continue;
		}
		if (!block || typeof block !== "object") continue;
		const rec = block;
		if (typeof rec.text === "string") {
			parts.push(rec.text);
			continue;
		}
		if (rec.type === "tool_use" && typeof rec.name === "string") {
			parts.push(`(tool call: ${rec.name})`);
			continue;
		}
		if (rec.type === "tool_result") {
			const inner = typeof rec.content === "string" ? rec.content : void 0;
			if (inner) parts.push(`(tool result: ${inner})`);
			else parts.push("(tool result)");
		}
	}
	return parts.join("\n").trim();
}
function formatFallbackTurns(turns, remainingBudget) {
	if (turns.length === 0 || remainingBudget <= 0) return {
		text: "",
		consumed: 0
	};
	const lines = [];
	let consumed = 0;
	for (let i = turns.length - 1; i >= 0; i -= 1) {
		const turn = turns[i];
		if (!turn || typeof turn !== "object") continue;
		const role = turn.role;
		if (role !== "user" && role !== "assistant") continue;
		const text = extractFallbackTurnText(turn);
		if (!text) continue;
		const line = `${role}: ${text}`;
		if (consumed + line.length + 1 > remainingBudget) break;
		lines.push(line);
		consumed += line.length + 1;
	}
	lines.reverse();
	return {
		text: lines.join("\n"),
		consumed
	};
}
/**
* Format a previously-harvested Claude CLI session into a labeled prelude
* suitable for prepending to a fallback candidate's prompt. Behavior matches
* Claude Code's own resume strategy after compaction: prefer the explicit
* summary, then append the most recent turns up to a char budget.
*
* Returns an empty string when neither a summary nor any usable turn fits in
* the budget; callers can treat that as "no context to seed".
*/
function formatClaudeCliFallbackPrelude(seed, options) {
	const charBudget = Math.max(CLAUDE_CLI_FALLBACK_PRELUDE_MIN_TURN_CHARS, options?.charBudget ?? CLAUDE_CLI_FALLBACK_PRELUDE_DEFAULT_CHAR_BUDGET);
	const sections = ["## Prior session context (from claude-cli)"];
	let remaining = charBudget - 42;
	if (seed.summaryText) {
		const summarySection = `\nSummary of earlier conversation:\n${seed.summaryText}`;
		if (summarySection.length <= remaining) {
			sections.push(summarySection);
			remaining -= summarySection.length;
		} else {
			const slice = seed.summaryText.slice(0, Math.max(0, remaining - 64));
			const lastBreak = slice.lastIndexOf(" ");
			const trimmed = lastBreak > 0 ? slice.slice(0, lastBreak).trimEnd() : slice.trimEnd();
			sections.push(`\nSummary of earlier conversation (truncated):\n${trimmed} …`);
			remaining = 0;
		}
	}
	if (remaining > CLAUDE_CLI_FALLBACK_PRELUDE_MIN_TURN_CHARS && seed.recentTurns.length > 0) {
		const { text } = formatFallbackTurns(seed.recentTurns, remaining - 32);
		if (text) sections.push(`\nRecent turns:\n${text}`);
	}
	if (sections.length === 1) return "";
	return sections.join("\n");
}
/**
* Read the Claude CLI session pointed to by `cliSessionId` and format a
* fallback prelude. Returns `""` when no session file is found or when the
* harvested seed has no usable content.
*/
function buildClaudeCliFallbackContextPrelude(params) {
	const sessionId = params.cliSessionId?.trim();
	if (!sessionId) return "";
	const seed = readClaudeCliFallbackSeed({
		cliSessionId: sessionId,
		homeDir: params.homeDir
	});
	if (!seed) return "";
	return formatClaudeCliFallbackPrelude(seed, { charBudget: params.charBudget });
}
/** Creates an accumulator that strips ACP silent-reply prefixes while streaming. */
function createAcpVisibleTextAccumulator() {
	let pendingSilentPrefix = "";
	let visibleText = "";
	let rawVisibleText = "";
	const startsWithWordChar = (chunk) => /^[\p{L}\p{N}]/u.test(chunk);
	const resolveNextCandidate = (base, chunk) => {
		if (!base) return chunk;
		if (isSilentReplyText(base, "NO_REPLY") && !chunk.startsWith(base) && startsWithWordChar(chunk)) return chunk;
		if (chunk.startsWith(base) && chunk.length > base.length) return chunk;
		return `${base}${chunk}`;
	};
	const mergeVisibleChunk = (base, chunk) => {
		if (!base) return {
			rawText: chunk,
			delta: chunk
		};
		if (chunk.startsWith(base) && chunk.length > base.length) return {
			rawText: chunk,
			delta: chunk.slice(base.length)
		};
		return {
			rawText: `${base}${chunk}`,
			delta: chunk
		};
	};
	return {
		consume(chunk) {
			if (!chunk) return null;
			if (!visibleText) {
				const leadCandidate = resolveNextCandidate(pendingSilentPrefix, chunk);
				const trimmedLeadCandidate = leadCandidate.trim();
				if (isSilentReplyText(trimmedLeadCandidate, "NO_REPLY") || isSilentReplyPrefixText(trimmedLeadCandidate, "NO_REPLY")) {
					pendingSilentPrefix = leadCandidate;
					return null;
				}
				if (startsWithSilentToken(trimmedLeadCandidate, "NO_REPLY")) {
					const stripped = stripLeadingSilentToken(leadCandidate, SILENT_REPLY_TOKEN);
					if (stripped) {
						pendingSilentPrefix = "";
						rawVisibleText = leadCandidate;
						visibleText = stripped;
						return {
							text: stripped,
							delta: stripped
						};
					}
					pendingSilentPrefix = leadCandidate;
					return null;
				}
				if (pendingSilentPrefix) {
					pendingSilentPrefix = "";
					rawVisibleText = leadCandidate;
					visibleText = leadCandidate;
					return {
						text: visibleText,
						delta: leadCandidate
					};
				}
			}
			const nextVisible = mergeVisibleChunk(rawVisibleText, chunk);
			rawVisibleText = nextVisible.rawText;
			if (!nextVisible.delta) return null;
			visibleText = `${visibleText}${nextVisible.delta}`;
			return {
				text: visibleText,
				delta: nextVisible.delta
			};
		},
		finalize() {
			return visibleText.trim();
		},
		finalizeRaw() {
			return visibleText;
		}
	};
}
//#endregion
export { resolveFallbackRetryPrompt as a, buildCliSessionHistoryPrompt as c, loadCliSessionHistoryMessages as d, loadCliSessionReseedMessages as f, createAcpVisibleTextAccumulator as i, hasCliSessionTranscript as l, buildAgentHookConversationMessages as m, claudeCliSessionTranscriptHasContent as n, sessionFileHasContent as o, resolveAutoCliSessionReseedHistoryChars as p, claudeCliSessionTranscriptHasOrphanedToolUse as r, augmentChatHistoryWithCliSessionImports as s, buildClaudeCliFallbackContextPrelude as t, loadCliSessionContextEngineMessages as u };
