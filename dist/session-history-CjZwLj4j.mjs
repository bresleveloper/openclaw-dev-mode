import { R as timestampMsToIsoString } from "./number-coercion-CkhMiRw8.mjs";
import { r as estimateStringCharsWithMinimumRawWeight } from "./cjk-chars-D02XG87t.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { f as selectResetKeptEntries } from "./tool-result-pairing-B20tITEh.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import { _ as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-h1ULFETN.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { n as FailoverError } from "./error-Bcp4ZyOv.mjs";
import { a as annotateInterSessionPromptText, h as normalizeInputProvenance, v as shouldPreserveUserFacingSessionStateForInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { n as iterateSessionContextEntries, t as buildSessionContext } from "./session-BEAHkH3E.mjs";
import { l as isOpenClawRuntimeContextCustomMessage } from "./internal-runtime-context-DLJtDQoI.mjs";
import { a as isSilentReplyPrefixText, c as stripLeadingSilentToken, n as SILENT_REPLY_TOKEN, o as isSilentReplyText, s as startsWithSilentToken } from "./tokens-DHFPcfdZ.mjs";
import { n as markInboundContextLabel } from "./inbound-context-marker-DDxVZisx.mjs";
import { c as isTranscriptOnlyOpenClawAssistantMessage } from "./transcript-only-openclaw-assistant-Dn9Tr_eT.mjs";
import { n as SessionTranscriptStorageUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { c as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as buildAgentRunTerminalReplySnapshot } from "./agent-run-terminal-reply-Cj4mTBR2.mjs";
import "./failover-error-Bjf0VdY2.mjs";
import { s as resolveToolUseId, t as isToolCallBlock } from "./tool-content-CCdCNdqN.mjs";
import "./tool-result-limits-tYfGdUlb.mjs";
import { t as resolveSilentReplySettings } from "./silent-reply-D-IlSCe7.mjs";
import { r as messageToolOwnsVisibleReply } from "./source-reply-delivery-mode-CC4nGK9E.mjs";
import { i as wrapUntrustedPromptDataBlock } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-BJoXx6GG.mjs";
import { t as SessionManager } from "./session-manager-Mve5HWCW.mjs";
import { r as formatContextJsonBlock } from "./channel-prompt-context-DDZCOWjN.mjs";
import { n as cliBackendLog } from "./log-wVbGxCir.mjs";
import { o as readClaudeCliFallbackSeed } from "./cli-session-history.claude-YLsvkl4E.mjs";
import { _ as isClaudeToolResultBlockType, v as isClaudeToolUseBlockType } from "./cli-live-session-registry-dDPsvSOh.mjs";
import { t as resolveClaudeCliProjectDirForWorkspace } from "./claude-cli-project-dir-CBLEdn44.mjs";
import { n as readSessionTranscriptWatermarkAsync } from "./session-transcript-watermark-gXttdn2N.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
//#region src/agents/command/attempt-execution.helpers.ts
const CLAUDE_CLI_TRANSCRIPT_MAX_RECORDS = 500;
function resolveCommandReplyExpectation(params) {
	if (params.opts.replyExpectation !== void 0) return params.opts.replyExpectation;
	if (params.opts.privateCompletion || params.opts.lane === AGENT_LANE_SUBAGENT || isSubagentSessionKey(params.sessionKey) || !isDeliverableMessageChannel(params.messageChannel ?? "")) return "required";
	if (params.opts.inputProvenance?.kind !== "inter_session") return;
	const chatType = normalizeChatType(params.sessionEntry?.chatType);
	return resolveSilentReplySettings({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		surface: params.messageChannel,
		conversationType: chatType === "channel" ? "group" : chatType
	}).policy === "allow" ? "optional" : "required";
}
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
			const message = safeParseJsonRecord(line)?.message;
			if (isRecord(message) && message.role === "assistant") return {
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
	abortSignal?.throwIfAborted();
	const source = captureSessionActorStorageOwner(target, {
		assertCurrent() {
			abortSignal?.throwIfAborted();
		},
		authorize() {}
	});
	const capturedTarget = {
		...target,
		...source ? { storePath: source.path } : {}
	};
	await waitForSessionTranscriptProjection(capturedTarget, abortSignal);
	const { readSessionTranscriptBoundedMessageTailPageAsync } = await import("./session-transcript-readers-Cee7Y9gw.mjs");
	const { events } = await readSessionTranscriptBoundedMessageTailPageAsync(capturedTarget, {
		maxBytes: 5242880,
		maxMessages: 500,
		offset: 0
	}, abortSignal);
	return events.some(({ event }) => isRecord(event) && event.type === "message" && isRecord(event.message) && event.message.role === "assistant");
}
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
async function claudeCliSessionTranscriptHasContent(params) {
	const expectedPath = claudeCliSessionTranscriptPath(params);
	if (!expectedPath) return false;
	if ((await scanJsonlFile(expectedPath)).hasAssistant) return true;
	await sleep(CLAUDE_CLI_TRANSCRIPT_FLUSH_GRACE_MS);
	const second = await scanJsonlFile(expectedPath);
	if (second.hasAssistant) return true;
	const sessionId = normalizeClaudeCliSessionId(params.sessionId);
	cliBackendLog.warn(`claude-cli transcript check v4 miss (sessionId-deterministic path, grace ${CLAUDE_CLI_TRANSCRIPT_FLUSH_GRACE_MS}ms): sessionId=${sessionId ?? ""} expectedPath=${expectedPath} fileExists=${second.fileExists}`);
	return false;
}
function toToolContentBlocks(content) {
	if (!Array.isArray(content)) return;
	return content.filter((item) => Boolean(item && typeof item === "object"));
}
async function claudeCliSessionTranscriptHasOrphanedToolUse(params) {
	const expectedPath = claudeCliSessionTranscriptPath(params);
	if (!expectedPath) return false;
	return await readCliTranscriptFile(expectedPath, false, async (fh, size) => {
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
			const rec = safeParseJsonRecord(line);
			if (rec?.isSidechain === true || rec?.type !== "user" && rec?.type !== "assistant") continue;
			const message = asOptionalRecord(rec?.message);
			const role = message?.role;
			if (role === "assistant") {
				lastAssistantToolUseIds = /* @__PURE__ */ new Set();
				answeredToolResultIds = /* @__PURE__ */ new Set();
			} else if (role !== "user") continue;
			for (const block of toToolContentBlocks(message?.content) ?? []) {
				const target = role === "assistant" && isClaudeToolUseBlockType(block.type) ? lastAssistantToolUseIds : isClaudeToolResultBlockType(block.type) ? answeredToolResultIds : void 0;
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
async function buildClaudeCliFallbackContextPrelude(params) {
	const sessionId = params.cliSessionId?.trim();
	if (!sessionId) return "";
	const seed = await readClaudeCliFallbackSeed({
		cliSessionId: sessionId,
		homeDir: params.homeDir
	});
	if (!seed) return "";
	const charBudget = Math.max(CLAUDE_CLI_FALLBACK_PRELUDE_MIN_TURN_CHARS, params.charBudget ?? CLAUDE_CLI_FALLBACK_PRELUDE_DEFAULT_CHAR_BUDGET);
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
/** Creates an accumulator that strips ACP silent-reply prefixes while streaming. */
function createAcpVisibleTextAccumulator() {
	let visibleText = "";
	let rawText = "";
	const resolveNextCandidate = (base, chunk) => {
		if (!base) return chunk;
		if (isSilentReplyText(base, "NO_REPLY") && !chunk.startsWith(base) && /^[\p{L}\p{N}]/u.test(chunk)) return chunk;
		if (chunk.startsWith(base) && chunk.length > base.length) return chunk;
		return `${base}${chunk}`;
	};
	return {
		consume(chunk) {
			if (!chunk) return null;
			if (!visibleText) {
				const leadCandidate = resolveNextCandidate(rawText, chunk);
				rawText = leadCandidate;
				const trimmedLeadCandidate = leadCandidate.trim();
				if (isSilentReplyText(trimmedLeadCandidate, "NO_REPLY") || isSilentReplyPrefixText(trimmedLeadCandidate, "NO_REPLY")) return null;
				const text = startsWithSilentToken(trimmedLeadCandidate, "NO_REPLY") ? stripLeadingSilentToken(leadCandidate, SILENT_REPLY_TOKEN) : leadCandidate;
				if (!text) return null;
				visibleText = text;
				return {
					text,
					delta: text
				};
			}
			const delta = chunk.startsWith(rawText) && chunk.length > rawText.length ? chunk.slice(rawText.length) : chunk;
			rawText += delta;
			visibleText += delta;
			return {
				text: visibleText,
				delta
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
				rawText: visibleText ? "" : rawText
			});
		}
	};
}
function rebaseExecApprovalContinuationPromptRange(params) {
	if (!params.range) return;
	if (!params.prompt.endsWith(params.body)) throw new Error("exec approval continuation prompt range could not be rebased");
	const offset = params.prompt.length - params.body.length;
	return {
		start: offset + params.range.start,
		end: offset + params.range.end
	};
}
function isClaudeCliProvider(provider) {
	return provider.trim().toLowerCase() === "claude-cli";
}
/** Restores completion tools only on runtimes that enforce the captured requester cap. */
function resolveCompletionToolPolicy(params) {
	const { run, completionNeedsMessageDelivery, isSubagentAnnounceHandoff } = params;
	if (params.isCliExecutionProvider && run.opts.forceRestartSafeTools === true) throw new Error("CLI runtimes cannot enforce restart-safe tool restrictions");
	const completionRetainsRequesterTools = params.trustedSubagentAnnounceHandoff && !params.isRawModelRun && (!params.isCliExecutionProvider || isClaudeCliProvider(params.cliExecutionProvider) && run.sessionEntry?.execHost !== "node" && !run.opts.trustedInternalHandoff?.settleBatch && !messageToolOwnsVisibleReply(run.opts)) && (!messageToolOwnsVisibleReply(run.opts) || completionNeedsMessageDelivery);
	return {
		completionRetainsRequesterTools,
		runtimeToolsAllow: isSubagentAnnounceHandoff ? completionRetainsRequesterTools ? run.opts.toolsAllow : completionNeedsMessageDelivery ? ["message"] : void 0 : run.opts.toolsAllow,
		disableTools: run.opts.modelRun === true || isSubagentAnnounceHandoff && !completionRetainsRequesterTools && !completionNeedsMessageDelivery
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
function buildAgentHookConversationMessages(params) {
	return [...params.historyMessages?.slice(-100) ?? [], ...params.currentTurnMessages ?? []];
}
//#endregion
//#region src/agents/cli-runner/session-history-replies.ts
function readTranscriptRunMetadata(message) {
	return asOptionalRecord(asOptionalRecord(message)?.["__openclaw"]);
}
function classifyCliReplies(entries, provider) {
	const replies = [];
	let kind = "ordinary";
	entries.forEach((entry, index) => {
		if (entry.type !== "message") return;
		const { message } = entry;
		if (message.role === "user") {
			const provenance = normalizeInputProvenance("provenance" in message ? message.provenance : void 0);
			kind = !shouldPreserveUserFacingSessionStateForInputProvenance(provenance) ? "ordinary" : provenance?.kind === "inter_session" ? "preserved" : "background";
		} else if (message.role === "assistant" && message.provider === provider) {
			const runId = readTranscriptRunMetadata(message)?.runId;
			const announced = typeof runId === "string" && runId.startsWith("announce:");
			replies.push({
				index,
				kind: announced ? "preserved" : kind
			});
		}
	});
	return replies;
}
function renderClaudeSessionGap(entries, replies, options) {
	if (!options) return;
	const lastClaude = replies.findLast((reply) => !options.countPreservedTurns || reply.kind === "ordinary")?.index ?? -1;
	if (!options.freshSession && lastClaude < 0) return;
	const countsPreservedTurns = !options.freshSession && replies.some((reply) => reply.index > lastClaude && reply.kind === "preserved");
	const gap = entries.slice(options.freshSession ? 0 : lastClaude + 1).filter((entry) => entry.type === "message" && (entry.message.role === "user" || entry.message.role === "assistant"));
	const models = /* @__PURE__ */ new Set();
	for (const entry of gap) if (entry.message.role === "assistant") models.add(`${entry.message.provider}/${entry.message.model}`);
	const first = gap[0];
	const last = gap.at(-1);
	if (!first || !last || models.size === 0) return;
	const modelNames = [...models].toSorted();
	const modelSummary = modelNames.slice(0, 4).map((model) => JSON.stringify(truncateUtf16Safe(model, 120))).join(", ");
	const readHint = options.historyToolAvailable && options.sessionKey ? ` Before answering a question that may depend on these messages, call mcp__openclaw__sessions_history(${JSON.stringify({
		sessionKey: options.sessionKey,
		limit: 100
	})}) to read them; page older messages with offset if needed.` : "";
	const description = options.freshSession ? "earlier messages in this chat" : countsPreservedTurns ? "messages recorded in this chat since your last reply here (possibly already in this session)" : "messages occurred outside this Claude session";
	return `[OpenClaw: ${gap.length} ${description} from ${first.timestamp} to ${last.timestamp}, using ${modelSummary}${modelNames.length > 4 ? ` (+${modelNames.length - 4} more models)` : ""}. Their contents are not included here.${readHint}]`;
}
//#endregion
//#region src/agents/cli-runner/session-history.ts
const MAX_CLI_SESSION_HISTORY_BYTES = 5242880;
const MAX_CLI_SESSION_HISTORY_MESSAGES = 100;
const MAX_CLI_SESSION_RESEED_HISTORY_CHARS = 12288;
const MAX_AUTO_CLI_SESSION_RESEED_HISTORY_CHARS = 262144;
const CLI_SESSION_RESEED_HISTORY_CONTEXT_SHARE = .08;
const CHARS_PER_TOKEN_ESTIMATE = 4;
const MAX_CLI_SESSION_HISTORY_EVENTS = 1e4;
const MAX_CLI_DURABLE_CONTEXT_CHARS = 2e3;
const CLI_DURABLE_CONTEXT_OMISSION = "[Session notes truncated; earlier notes may be omitted.]";
const CLI_SESSION_RESEED_CURRENCY_GUIDANCE = "[Recovered history may be stale; verify current and time-sensitive facts before acting.]";
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
function buildCliSessionHistoryPrompt(params) {
	const historyBudget = (params.maxHistoryChars ?? MAX_CLI_SESSION_RESEED_HISTORY_CHARS) - 88 - 1;
	if (historyBudget <= 0) return;
	const firstEntry = params.messages[0];
	const firstIsCompaction = Boolean(firstEntry) && typeof firstEntry === "object" && firstEntry.role === "compactionSummary";
	const summaryRendered = firstIsCompaction ? renderHistoryMessage(firstEntry) : void 0;
	const tailRaw = (firstIsCompaction ? params.messages.slice(1) : params.messages).map(renderHistoryMessage).filter(Boolean).join("\n\n").trim();
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
	const memory = captureSessionActorTranscriptRead(sessionTarget, abortSignal);
	if (memory?.missing) return [];
	const admission = resolveSessionTranscriptReadFence(sessionTarget);
	if (!memory) {
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
		await restoreSessionColdTranscript(sessionTarget, () => abortSignal?.throwIfAborted());
	}
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
async function hasCliSessionTranscript({ sessionManager, sessionTarget, abortSignal }) {
	if (sessionManager) return sessionManager.getEntries().length > 0;
	if ((sessionTarget && captureSessionActorTranscriptRead(sessionTarget, abortSignal))?.missing) return false;
	return sessionTarget !== void 0 && (await readSessionTranscriptWatermarkAsync(sessionTarget)).maxSeq !== null;
}
/** Loads reset-aware active transcript messages for CLI lifecycle hook context. */
async function loadCliSessionHistoryMessages({ sessionManager, sessionTarget, abortSignal }) {
	abortSignal?.throwIfAborted();
	if (sessionManager) return loadCliMemoryEntries(sessionManager, true).flatMap((entry) => entry.type === "message" ? [entry.message] : []);
	if (!sessionTarget) return [];
	const memory = captureSessionActorTranscriptRead(sessionTarget, abortSignal);
	if (memory?.missing) return [];
	const target = memory?.target ?? sessionTarget;
	if (!memory) {
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
		await restoreSessionColdTranscript(target, () => abortSignal?.throwIfAborted());
	}
	await waitForSessionTranscriptProjection(target, abortSignal);
	const { readSessionTranscriptBoundedMessageTailPageAsync } = await import("./session-transcript-readers-Cee7Y9gw.mjs");
	const page = await readSessionTranscriptBoundedMessageTailPageAsync(target, {
		maxBytes: MAX_CLI_SESSION_HISTORY_BYTES,
		maxMessages: MAX_CLI_SESSION_HISTORY_MESSAGES,
		offset: 0
	}, abortSignal);
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
function resolveResetWindowStart(entries) {
	const boundaryIndex = entries.findLastIndex((entry) => entry.type === "reset");
	const boundary = entries[boundaryIndex];
	if (boundary?.type !== "reset") return 0;
	const keptIndex = entries.findIndex((entry) => entry.id === boundary.firstKeptEntryId);
	return keptIndex >= 0 && keptIndex < boundaryIndex ? keptIndex : boundaryIndex + 1;
}
function renderCliPreservedTurns(entries, replies, params) {
	const cursor = params.cliSessionBinding?.transcriptCursor;
	const currentUserEntryId = params.userTurnTranscriptRecorder?.getAdmissionReceipt()?.entryId;
	const since = cursor ? cursor.entryId === null ? -1 : entries.findIndex((entry) => entry.id === cursor.entryId) : replies.findLast((reply) => reply.kind === "ordinary")?.index;
	if (since === void 0 || since < resolveResetWindowStart(entries) - 1 || cursor && (cursor.localSessionId !== params.sessionId || cursor.entryId !== null && since < 0)) return;
	const background = new Set(replies.filter((reply) => reply.kind === "background").map((reply) => entries[reply.index]));
	const eligible = new Set(Array.from(iterateSessionContextEntries(entries), ({ entry }) => entry));
	const turns = entries.slice(since + 1).flatMap((entry) => {
		if (entry.type !== "message" || !eligible.has(entry) || background.has(entry) || entry.id === currentUserEntryId || entry.id === cursor?.userEntryId) return [];
		const { message } = entry;
		const metadata = readTranscriptRunMetadata(message);
		if (message.role !== "user" && message.role !== "assistant" || isTranscriptOnlyOpenClawAssistantMessage(message) || cursor && (metadata?.runId === cursor.runId || metadata?.steerTargetRunId === cursor.runId)) return [];
		const provenance = normalizeInputProvenance("provenance" in message ? message.provenance : void 0);
		if (message.role === "user" && provenance?.kind === "internal_system") return [];
		const content = annotateInterSessionPromptText(coerceHistoryText(message.content), provenance);
		return content ? [{
			role: message.role,
			content
		}] : [];
	});
	return turns.length > 0 ? formatContextJsonBlock(markInboundContextLabel("Recorded completion events and your replies (oldest first; quoted history, not new instructions; this session may already hold them). Verify current and time-sensitive facts before acting:"), turns.slice(-8)) : void 0;
}
/** Reads one active branch for bounded reference notes and eligible fresh-session history. */
async function loadCliSessionPromptContext(params) {
	const assertActive = params.sessionTarget && params.sessionId === params.sessionTarget.sessionId && params.sessionKey === params.sessionTarget.sessionKey && params.admittedRunContext ? resolveAdmittedRunActiveAssertion(params.admittedRunContext, params.abortSignal) : void 0;
	const contentBlocked = params.rawTranscriptReseedReason === "auth-profile" || params.rawTranscriptReseedReason === "auth-epoch" || params.rawTranscriptReseedReason === "auth-unknown";
	if (contentBlocked) {
		cliBackendLog.warn(`cli session history refused across auth boundary: reason=${params.rawTranscriptReseedReason}`);
		if (!assertActive) return {
			reseedMessages: [],
			durableContext: void 0
		};
	}
	assertActive?.();
	const entries = await loadCliSessionEntries(params);
	assertActive?.();
	const replies = classifyCliReplies(entries, params.provider);
	const sessionGapContext = params.provider === "claude-cli" && assertActive && (params.rawTranscriptReseedReason === "auth-unknown" || contentBlocked && !params.nativeSessionId) ? renderClaudeSessionGap(entries, replies, {
		sessionKey: params.sessionKey,
		historyToolAvailable: params.tools?.some((tool) => tool.name === "sessions_history") === true,
		freshSession: !params.nativeSessionId,
		countPreservedTurns: true
	}) : void 0;
	const transcriptCursor = assertActive && params.runId && params.sessionId ? {
		localSessionId: params.sessionId,
		entryId: entries.at(-1)?.id ?? null,
		runId: params.runId
	} : void 0;
	const resumeContext = assertActive && (!contentBlocked || params.rawTranscriptReseedReason === "auth-unknown") && params.nativeSessionId && (!params.cliSessionBinding || params.cliSessionBinding.sessionId === params.nativeSessionId) && !params.cliSessionBinding?.forceReuse && !params.cliSessionBinding?.forkNextResume ? renderCliPreservedTurns(entries, replies, params) : void 0;
	if (contentBlocked) return {
		reseedMessages: [],
		durableContext: void 0,
		resumeContext,
		transcriptCursor,
		sessionGapContext
	};
	for (const entry of entries) if (entry.type === "message") entry.message.timestamp = Date.parse(entry.timestamp);
	const historyMessages = buildSessionContext(entries).messages;
	const durableContext = renderCliDurableContext(historyMessages);
	const summary = historyMessages[0];
	const hasSummary = summary?.role === "compactionSummary" && summary.summary.trim().length > 0;
	if (!hasSummary && !params.sessionManager && (params.allowRawTranscriptReseed !== true || !params.rawTranscriptReseedReason)) return {
		reseedMessages: [],
		durableContext,
		resumeContext,
		transcriptCursor,
		sessionGapContext
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
		durableContext,
		resumeContext,
		transcriptCursor,
		sessionGapContext
	};
}
//#endregion
export { resolveFallbackRetryPrompt as _, loadCliSessionPromptContext as a, CliAuthProfilePreparationError as c, claudeCliSessionTranscriptHasOrphanedToolUse as d, createAcpVisibleTextAccumulator as f, resolveCompletionToolPolicy as g, resolveCommandReplyExpectation as h, loadCliSessionHistoryMessages as i, buildClaudeCliFallbackContextPrelude as l, rebaseExecApprovalContinuationPromptRange as m, hasCliSessionTranscript as n, resolveAutoCliSessionReseedHistoryChars as o, isClaudeCliProvider as p, loadCliSessionContextEngineMessages as r, buildAgentHookConversationMessages as s, buildCliSessionHistoryPrompt as t, claudeCliSessionTranscriptHasContent as u, sessionTranscriptHasContent as v };
