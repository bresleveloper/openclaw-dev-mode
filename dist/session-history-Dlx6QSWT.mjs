import { R as timestampMsToIsoString } from "./number-coercion-CLj0HTDM.mjs";
import { r as estimateStringCharsWithMinimumRawWeight } from "./cjk-chars-6ld30jSx.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { ht as buildAgentRunTerminalReplySnapshot } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { s as isOpenClawRuntimeContextCustomMessage } from "./internal-runtime-context-BH-o1oq1.mjs";
import { a as isSilentReplyPrefixText, c as stripLeadingSilentToken, n as SILENT_REPLY_TOKEN, o as isSilentReplyText, s as startsWithSilentToken } from "./tokens-BTKQYTUd.mjs";
import { f as selectResetKeptEntries } from "./tool-result-pairing-Bky0eubt.mjs";
import { t as FailoverError } from "./error-ON38hPhx.mjs";
import { n as iterateSessionContextEntries, t as buildSessionContext } from "./session-D9cHHQGH.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import "./tool-result-limits-B-fhY8wF.mjs";
import { n as SessionTranscriptStorageUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { l as readSessionTranscriptWatermark } from "./session-accessor-C05KQ5A3.mjs";
import { s as readSessionTranscriptBoundedMessageTailPage } from "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import "./failover-error-BwAkMLuL.mjs";
import { s as resolveToolUseId, t as isToolCallBlock } from "./tool-content-ByAb-IhE.mjs";
import { i as wrapUntrustedPromptDataBlock } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { t as SessionManager } from "./session-manager-Bb7qQp5M.mjs";
import { n as cliBackendLog } from "./log-lbZDIx37.mjs";
import { o as readClaudeCliFallbackSeed } from "./cli-session-history.claude-C9GYS4Xs.mjs";
import "./cli-session-history-Cq_N2mFT.mjs";
import { t as resolveClaudeCliProjectDirForWorkspace } from "./claude-cli-project-dir-D0ArKrOI.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import readline from "node:readline";
//#region src/agents/command/attempt-execution.helpers.ts
/**
* Helper functions for agent attempt execution, Claude CLI transcript probing,
* fallback prompts, and ACP visible-text accumulation.
*/
const CLAUDE_CLI_TRANSCRIPT_MAX_RECORDS = 500;
function normalizeClaudeCliSessionId(sessionId) {
	const trimmed = sessionId?.trim();
	if (!trimmed || trimmed.includes("\0") || trimmed.includes("/") || trimmed.includes("\\")) return;
	return trimmed;
}
async function readCliTranscriptFile(filePath, missing, read) {
	try {
		const stat = await fs.lstat(filePath);
		if (stat.isSymbolicLink() || !stat.isFile()) return missing;
		const file = await fs.open(filePath, "r");
		try {
			return await read(file, stat.size);
		} finally {
			await file.close();
		}
	} catch {
		return missing;
	}
}
async function scanJsonlFile(filePath) {
	return await readCliTranscriptFile(filePath, {
		fileExists: false,
		hasAssistant: false
	}, async (fh) => {
		const rl = readline.createInterface({ input: fh.createReadStream({ encoding: "utf-8" }) });
		let recordCount = 0;
		for await (const line of rl) {
			if (!line.trim()) continue;
			recordCount++;
			if (recordCount > CLAUDE_CLI_TRANSCRIPT_MAX_RECORDS) break;
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
	});
}
/** Checks whether the active SQLite history contains a persisted assistant turn. */
async function sessionTranscriptHasContent(target, abortSignal) {
	if (!target) return false;
	await waitForSessionTranscriptProjection(target, abortSignal);
	const { events } = readSessionTranscriptBoundedMessageTailPage(target, {
		maxBytes: 5242880,
		maxMessages: 500,
		offset: 0
	});
	return events.some(({ event }) => isRecord(event) && event.type === "message" && isRecord(event.message) && event.message.role === "assistant");
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
const CLAUDE_CLI_ORPHAN_PROBE_TAIL_BYTES = 1048576;
/** Checks whether Claude CLI has flushed assistant content for a session. */
async function claudeCliSessionTranscriptHasContent(params) {
	const expectedPath = claudeCliSessionTranscriptPath(params);
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
	return await readCliTranscriptFile(filePath, false, async (fh, size) => {
		const tailBytes = Math.min(size, CLAUDE_CLI_ORPHAN_PROBE_TAIL_BYTES);
		const start = size - tailBytes;
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
			} else if (role !== "user") continue;
			for (const block of toToolContentBlocks(message?.content) ?? []) {
				const target = role === "assistant" && isClaudeTranscriptToolUseBlock(block) ? lastAssistantToolUseIds : isClaudeTranscriptToolResultBlock(block) ? answeredToolResultIds : void 0;
				if (target) {
					const id = resolveToolUseId(block);
					if (id) target.add(id);
				}
			}
		}
		for (const id of lastAssistantToolUseIds) if (!answeredToolResultIds.has(id)) return true;
		return false;
	});
}
/** Checks whether the latest Claude CLI transcript tail has unanswered tool use. */
async function claudeCliSessionTranscriptHasOrphanedToolUse(params) {
	const expectedPath = claudeCliSessionTranscriptPath(params);
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
		if (isToolCallBlock(rec) && typeof rec.name === "string") {
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
	if (turns.length === 0 || remainingBudget <= 0) return "";
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
	return lines.join("\n");
}
/** Prefer the harvested summary, then retain recent turns within the fallback prompt budget. */
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
			const slice = truncateUtf16Safe(seed.summaryText, Math.max(0, remaining - 64));
			const lastBreak = slice.lastIndexOf(" ");
			const trimmed = lastBreak > 0 ? slice.slice(0, lastBreak).trimEnd() : slice.trimEnd();
			sections.push(`\nSummary of earlier conversation (truncated):\n${trimmed} …`);
			remaining = 0;
		}
	}
	if (remaining > CLAUDE_CLI_FALLBACK_PRELUDE_MIN_TURN_CHARS && seed.recentTurns.length > 0) {
		const text = formatFallbackTurns(seed.recentTurns, remaining - 32);
		if (text) sections.push(`\nRecent turns:\n${text}`);
	}
	if (sections.length === 1) return "";
	return sections.join("\n");
}
/** Read a CLI session and project the available fallback context. */
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
		},
		finalizeReplySnapshot() {
			return buildAgentRunTerminalReplySnapshot({
				visibleText,
				rawText: pendingSilentPrefix
			});
		}
	};
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.attemptExecutionHelpersTestApi")] = {
	claudeCliSessionTranscriptPath,
	formatClaudeCliFallbackPrelude
};
function rebaseExecApprovalContinuationPromptRange(params) {
	if (!params.range) return;
	if (!params.prompt.endsWith(params.body)) throw new Error("exec approval continuation prompt range could not be rebased");
	const offset = params.prompt.length - params.body.length;
	return {
		start: offset + params.range.start,
		end: offset + params.range.end
	};
}
//#endregion
//#region src/agents/cli-runner/auth-profile-preparation-error.ts
/** Typed terminal fact for a selected profile that fails before CLI spawn. */
var CliAuthProfilePreparationError = class extends FailoverError {
	constructor(params) {
		super(params.message, {
			reason: "auth",
			provider: params.provider,
			profileId: params.profileId,
			cause: params.cause
		});
		this.name = "CliAuthProfilePreparationError";
		this.agentDir = params.agentDir;
	}
};
//#endregion
//#region src/agents/harness/hook-history.ts
/** Builds hook-visible conversation messages from bounded history plus current turn. */
function buildAgentHookConversationMessages(params) {
	return [...params.historyMessages?.slice(-100) ?? [], ...params.currentTurnMessages ?? []];
}
//#endregion
//#region src/agents/cli-runner/session-history.ts
/**
* Loads and renders owned session history for CLI prompts and context-engine synchronization.
*/
/** Maximum transcript size read for CLI session history. */
const MAX_CLI_SESSION_HISTORY_BYTES = 5242880;
/** Maximum transcript messages exposed to CLI hook history. */
const MAX_CLI_SESSION_HISTORY_MESSAGES = 100;
/** Minimum reseed-history prompt budget for fresh CLI sessions. */
const MAX_CLI_SESSION_RESEED_HISTORY_CHARS = 12288;
/** Maximum automatic reseed-history prompt budget derived from context size. */
const MAX_AUTO_CLI_SESSION_RESEED_HISTORY_CHARS = 262144;
const CLI_SESSION_RESEED_HISTORY_CONTEXT_SHARE = .08;
const CHARS_PER_TOKEN_ESTIMATE = 4;
const MAX_CLI_SESSION_HISTORY_EVENTS = 1e4;
const MAX_CLI_DURABLE_CONTEXT_CHARS = 2e3;
const CLI_DURABLE_CONTEXT_OMISSION = "[Session notes truncated; earlier notes may be omitted.]";
const CLI_SESSION_RESEED_CURRENCY_GUIDANCE = "[Recovered history may be stale; verify current and time-sensitive facts before acting.]";
const RAW_TRANSCRIPT_RESEED_ALLOWED_REASONS = /* @__PURE__ */ new Set([
	"missing-transcript",
	"orphaned-tool-use",
	"message-policy",
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
function formatHistoryTimestamp(value) {
	if (typeof value !== "string") return;
	const timestamp = timestampMsToIsoString(Date.parse(value));
	return timestamp === value ? timestamp : void 0;
}
function renderHistoryMessage(message) {
	if (!message || typeof message !== "object") return;
	const entry = message;
	const role = entry.role === "assistant" ? "Assistant" : entry.role === "user" ? "User" : entry.role === "toolResult" ? `Tool result${typeof entry.toolName === "string" ? ` (${entry.toolName})` : ""}${entry.isError === true ? " [error]" : ""}` : entry.role === "compactionSummary" ? "Compaction summary" : void 0;
	if (!role) return;
	const text = entry.role === "compactionSummary" && typeof entry.summary === "string" ? entry.summary.trim() : coerceHistoryText(entry.content);
	if (!text) return;
	const timestamp = formatHistoryTimestamp(entry.timestamp);
	return `${timestamp ? `[${timestamp}] ` : ""}${role}: ${text}`;
}
/** Builds a reseed prompt that carries prior OpenClaw transcript context. */
function buildCliSessionHistoryPrompt(params) {
	const historyBudget = (params.maxHistoryChars ?? MAX_CLI_SESSION_RESEED_HISTORY_CHARS) - 88 - 1;
	if (historyBudget <= 0) return;
	const firstEntry = params.messages[0];
	const firstIsCompaction = Boolean(firstEntry) && typeof firstEntry === "object" && firstEntry.role === "compactionSummary";
	const summaryRendered = firstIsCompaction ? renderHistoryMessage(firstEntry) : void 0;
	const tailRaw = (firstIsCompaction ? params.messages.slice(1) : params.messages).flatMap((message) => {
		const rendered = renderHistoryMessage(message);
		return rendered ? [rendered] : [];
	}).join("\n\n").trim();
	const truncationMarker = "[OpenClaw reseed history truncated; older turns dropped]";
	const renderTruncatedTail = (raw, budget) => {
		if (budget <= 57) return sliceUtf16Safe(raw, -budget).trimStart();
		const tailBudget = budget - 56 - 1;
		return `${truncationMarker}\n${sliceUtf16Safe(raw, -tailBudget).trimStart()}`;
	};
	const renderTruncatedSummaryWithTail = (renderedSummary) => {
		if (historyBudget <= 57) return tailRaw.length > 0 ? sliceUtf16Safe(tailRaw, -historyBudget).trimStart() : truncateUtf16Safe(renderedSummary, historyBudget).trimEnd();
		const tailBudget = tailRaw.length > 0 ? Math.min(tailRaw.length, Math.floor(historyBudget / 2)) : 0;
		const separatorBudget = tailBudget > 0 ? 2 : 1;
		const summaryBudget = Math.max(0, historyBudget - 56 - separatorBudget - tailBudget);
		const summaryTruncated = truncateUtf16Safe(renderedSummary, summaryBudget).trimEnd();
		const tailTruncated = tailBudget > 0 ? sliceUtf16Safe(tailRaw, -tailBudget).trimStart() : "";
		return [
			truncationMarker,
			summaryTruncated,
			tailTruncated
		].filter(Boolean).join("\n");
	};
	let renderedHistory;
	if (summaryRendered) {
		if (summaryRendered.length >= historyBudget) renderedHistory = renderTruncatedSummaryWithTail(summaryRendered);
		else if (tailRaw.length === 0) renderedHistory = summaryRendered;
		else {
			const summaryBlock = `${summaryRendered}\n\n`;
			const remainingBudget = historyBudget - summaryBlock.length;
			if (tailRaw.length <= remainingBudget) renderedHistory = `${summaryBlock}${tailRaw}`;
			else if (remainingBudget <= 57) renderedHistory = renderTruncatedSummaryWithTail(summaryRendered);
			else renderedHistory = `${summaryBlock}${renderTruncatedTail(tailRaw, remainingBudget)}`;
		}
	} else renderedHistory = tailRaw.length > historyBudget ? renderTruncatedTail(tailRaw, historyBudget) : tailRaw;
	if (!renderedHistory) return;
	return [
		"Continue this conversation using the OpenClaw transcript below as prior session history.",
		"Treat it as authoritative context for this fresh CLI session.",
		"",
		"<conversation_history>",
		CLI_SESSION_RESEED_CURRENCY_GUIDANCE,
		renderedHistory,
		"</conversation_history>",
		"",
		"<next_user_message>",
		params.prompt,
		"</next_user_message>"
	].join("\n");
}
function loadCliMemoryEntries(sessionManager, hooks = false) {
	const branch = sessionManager.getBranch();
	const boundaryIndex = branch.findLastIndex((entry) => entry.type === "reset" || !hooks && entry.type === "compaction");
	const boundary = branch[boundaryIndex];
	let entries = branch;
	if (hooks && boundary?.type === "reset") {
		const keptIndex = branch.findIndex((entry) => entry.id === boundary.firstKeptEntryId);
		const kept = keptIndex >= 0 ? branch.slice(keptIndex, boundaryIndex) : [];
		const resetKept = new Set(selectResetKeptEntries(kept));
		entries = [...kept.filter((entry) => resetKept.has(entry)), ...branch.slice(boundaryIndex + 1)];
	}
	if (hooks) entries = entries.filter((entry) => entry.type === "message");
	else {
		const contextEntries = new Set(Array.from(iterateSessionContextEntries(branch), ({ entry }) => entry));
		entries = branch.filter((entry) => contextEntries.has(entry));
	}
	const limit = hooks ? MAX_CLI_SESSION_HISTORY_MESSAGES : MAX_CLI_SESSION_HISTORY_EVENTS;
	const selected = [];
	let bytes = 0;
	for (const entry of entries.slice(-limit).toReversed()) {
		const size = Buffer.byteLength(JSON.stringify(entry)) + 1;
		if (bytes + size > MAX_CLI_SESSION_HISTORY_BYTES) {
			if (hooks) continue;
			break;
		}
		selected.push(entry);
		bytes += size;
	}
	selected.reverse();
	if (!hooks && (boundary?.type === "reset" || boundary?.type === "compaction")) {
		if (!selected.includes(boundary) && bytes + Buffer.byteLength(JSON.stringify(boundary)) + 1 <= MAX_CLI_SESSION_HISTORY_BYTES) selected.unshift(boundary);
		const cut = selected.indexOf(boundary);
		if (cut >= 0) selected[cut] = {
			...boundary,
			firstKeptEntryId: selected[0]?.id ?? boundary.id
		};
	}
	if (selected.length < entries.length) cliBackendLog.warn("cli session history truncated to bounded caller-owned context");
	return structuredClone(selected);
}
async function loadCliSessionEntries({ sessionManager, sessionTarget, abortSignal }) {
	abortSignal?.throwIfAborted();
	if (sessionManager) return loadCliMemoryEntries(sessionManager);
	if (!sessionTarget) return [];
	const admission = resolveSessionTranscriptReadFence(sessionTarget);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-CDCnO_Bk.mjs");
	await restoreSessionColdTranscript(sessionTarget, () => abortSignal?.throwIfAborted());
	await waitForSessionTranscriptProjection(sessionTarget, abortSignal);
	try {
		return (await SessionManager.openBoundedAsync(sessionTarget, {
			signal: abortSignal,
			maxBytes: MAX_CLI_SESSION_HISTORY_BYTES,
			maxEvents: MAX_CLI_SESSION_HISTORY_EVENTS,
			onTruncated: () => cliBackendLog.warn(`cli session history truncated to bounded active context: ${sessionTarget.sessionId}`)
		})).getBranch();
	} catch (error) {
		if (error instanceof SessionTranscriptStorageUnavailableError && error.reason === "database-missing" && !admission) return [];
		throw error;
	}
}
/** Checks whether the transcript owner has any session events. */
async function hasCliSessionTranscript({ sessionManager, sessionTarget }) {
	if (sessionManager) return sessionManager.getEntries().length > 0;
	return sessionTarget !== void 0 && readSessionTranscriptWatermark(sessionTarget).maxSeq !== null;
}
/** Loads reset-aware active transcript messages for CLI lifecycle hook context. */
async function loadCliSessionHistoryMessages({ sessionManager, sessionTarget, abortSignal }) {
	abortSignal?.throwIfAborted();
	if (sessionManager) return loadCliMemoryEntries(sessionManager, true).flatMap((entry) => entry.type === "message" ? [entry.message] : []);
	if (!sessionTarget) return [];
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-CDCnO_Bk.mjs");
	await restoreSessionColdTranscript(sessionTarget, () => abortSignal?.throwIfAborted());
	await waitForSessionTranscriptProjection(sessionTarget, abortSignal);
	const page = readSessionTranscriptBoundedMessageTailPage(sessionTarget, {
		maxBytes: MAX_CLI_SESSION_HISTORY_BYTES,
		maxMessages: MAX_CLI_SESSION_HISTORY_MESSAGES,
		offset: 0
	});
	if (page.events.length < page.scannedMessages) cliBackendLog.warn(`cli session history truncated to bounded message tail: ${sessionTarget.sessionId}`);
	return page.events.map(({ event }) => event.message);
}
/** Loads canonical replay messages for context-engine updates. */
async function loadCliSessionContextEngineMessages(params) {
	const entries = await loadCliSessionEntries(params);
	const messages = buildSessionContext(entries).messages;
	const boundary = entries.findLast((entry) => entry.type === "compaction" || entry.type === "reset");
	if (boundary?.type === "compaction" && messages[0]?.role === "compactionSummary") return [{
		...messages[0],
		timestamp: boundary.timestamp,
		firstKeptEntryId: boundary.firstKeptEntryId,
		...boundary.details !== void 0 ? { details: boundary.details } : {},
		..."tokensAfter" in boundary ? { tokensAfter: boundary.tokensAfter } : {}
	}, ...messages.slice(1)];
	return messages;
}
function renderCliDurableContext(messages) {
	const notes = messages.flatMap((message) => {
		if (message.role !== "custom" || message.excludeFromContext === true || isOpenClawRuntimeContextCustomMessage(message)) return [];
		const text = coerceHistoryText(message.content);
		return text ? [text] : [];
	});
	const render = (selected, omitted) => wrapUntrustedPromptDataBlock({
		label: "Saved session notes (historical reference; may repeat)",
		text: [...selected, ...omitted ? [CLI_DURABLE_CONTEXT_OMISSION] : []].join("\n\n")
	});
	const selected = [];
	for (let index = notes.length - 1; index >= 0; index--) {
		const note = notes[index];
		const candidate = render([note, ...selected], index > 0);
		if (estimateStringCharsWithMinimumRawWeight(candidate) <= MAX_CLI_DURABLE_CONTEXT_CHARS) {
			selected.unshift(note);
			continue;
		}
		if (selected.length > 0) return render(selected, true);
		let low = 0;
		let high = note.length;
		let rendered = render([], true);
		while (low <= high) {
			const midpoint = Math.floor((low + high) / 2);
			const prefix = render([sliceUtf16Safe(note, 0, midpoint)], true);
			if (estimateStringCharsWithMinimumRawWeight(prefix) <= MAX_CLI_DURABLE_CONTEXT_CHARS) {
				rendered = prefix;
				low = midpoint + 1;
			} else high = midpoint - 1;
		}
		return rendered;
	}
	return selected.length > 0 ? render(selected, false) : void 0;
}
/** Reads one active branch for bounded reference notes and eligible fresh-session history. */
async function loadCliSessionPromptContext(params) {
	if (params.rawTranscriptReseedReason === "auth-profile" || params.rawTranscriptReseedReason === "auth-epoch" || params.rawTranscriptReseedReason === "auth-unknown") {
		cliBackendLog.warn(`cli session history refused across auth boundary: reason=${params.rawTranscriptReseedReason}`);
		return {
			reseedMessages: [],
			durableContext: void 0
		};
	}
	const entries = await loadCliSessionEntries(params);
	for (const entry of entries) if (entry.type === "message") entry.message.timestamp = Date.parse(entry.timestamp);
	const historyMessages = buildSessionContext(entries).messages;
	const durableContext = renderCliDurableContext(historyMessages);
	const summary = historyMessages[0];
	const hasSummary = summary?.role === "compactionSummary" && summary.summary.trim().length > 0;
	if (!hasSummary && !params.sessionManager && (params.allowRawTranscriptReseed !== true || !params.rawTranscriptReseedReason || !RAW_TRANSCRIPT_RESEED_ALLOWED_REASONS.has(params.rawTranscriptReseedReason))) return {
		reseedMessages: [],
		durableContext
	};
	const history = historyMessages.filter((message) => message.role === "user" || message.role === "assistant" || message.role === "toolResult");
	return {
		reseedMessages: (hasSummary ? [summary, ...history.slice(-99)] : history.slice(-100)).map((message) => {
			const timestamp = timestampMsToIsoString(message.timestamp);
			return message.role === "compactionSummary" ? {
				role: message.role,
				summary: message.summary.trim(),
				timestamp
			} : {
				role: message.role,
				content: message.content,
				timestamp,
				toolName: message.role === "toolResult" ? message.toolName : void 0,
				isError: message.role === "toolResult" ? message.isError : void 0
			};
		}),
		durableContext
	};
}
//#endregion
export { loadCliSessionPromptContext as a, CliAuthProfilePreparationError as c, claudeCliSessionTranscriptHasOrphanedToolUse as d, createAcpVisibleTextAccumulator as f, sessionTranscriptHasContent as h, loadCliSessionHistoryMessages as i, buildClaudeCliFallbackContextPrelude as l, resolveFallbackRetryPrompt as m, hasCliSessionTranscript as n, resolveAutoCliSessionReseedHistoryChars as o, rebaseExecApprovalContinuationPromptRange as p, loadCliSessionContextEngineMessages as r, buildAgentHookConversationMessages as s, buildCliSessionHistoryPrompt as t, claudeCliSessionTranscriptHasContent as u };
