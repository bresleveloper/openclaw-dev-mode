import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber, y as parseDateStringTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { i as normalizeCliSessionReseedReceipt, r as getCliSessionBinding } from "./cli-session-binding-CMk8AbZT.mjs";
import { i as HEARTBEAT_RESPONSE_TOOL_PROMPT, n as HEARTBEAT_PROMPT } from "./heartbeat-BjLIgeQc.mjs";
import { h as redactTranscriptMessage } from "./session-accessor.sqlite-transcript-store-Bqsq62BI.mjs";
import { _ as readInterSessionPromptEnvelope, h as normalizeInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { f as stripCliSessionDriftNote } from "./cli-session-BGS0cWwl.mjs";
import { t as formatSystemTurnPrompt } from "./system-turn-prompt-CqPm0DzY.mjs";
import { o as resolveToolUseId, r as isToolResultBlock, t as isToolCallBlock } from "./tool-content-SH_V-fgH.mjs";
import { t as attachOpenClawTranscriptMeta } from "./session-transcript-entry-message-DRffdoS3.mjs";
import "./session-transcript-readers-Z-j3mApc.mjs";
import { i as stripCliImageTurnContext, r as readCliImageTurnContext } from "./cli-image-turn-correlation-BVXO9f3I.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/agents/cli-runner/reseed-envelope.ts
const RESEED_HEADER = [
	"Continue this conversation using the OpenClaw transcript below as prior session history.",
	"Treat it as authoritative context for this fresh CLI session.",
	"",
	"<conversation_history>"
].join("\n");
const RESEED_PREFIX = `${RESEED_HEADER}\n`;
const RESEED_USER_BOUNDARY = "\n</conversation_history>\n\n<next_user_message>\n";
const RESEED_USER_CLOSE = "\n</next_user_message>";
function hashCliReseedPrompt(text) {
	return sha256Hex(text);
}
function parseCliReseedPrompt(text) {
	if (!text.startsWith(RESEED_PREFIX)) return text.startsWith(RESEED_HEADER) ? { kind: "invalid" } : { kind: "none" };
	const boundaryIndex = text.indexOf(RESEED_USER_BOUNDARY);
	if (boundaryIndex !== text.lastIndexOf(RESEED_USER_BOUNDARY)) return { kind: "invalid" };
	if (boundaryIndex <= RESEED_PREFIX.length) return { kind: "invalid" };
	const promptStart = boundaryIndex + 46;
	const closeIndex = text.lastIndexOf(RESEED_USER_CLOSE);
	if (closeIndex < promptStart) return { kind: "invalid" };
	return {
		kind: "legacy",
		userMessage: text.slice(promptStart, closeIndex)
	};
}
//#endregion
//#region src/gateway/cli-session-history.prompt-text.ts
function readRoutedPromptView(provenanceValue, rawText, isCliPrompt) {
	const text = isCliPrompt ? stripCliPromptDecorations(rawText) : rawText;
	const envelope = readInterSessionPromptEnvelope(text);
	const provenance = normalizeInputProvenance(provenanceValue) ?? envelope?.provenance;
	if (provenance?.kind !== "inter_session") return;
	return {
		sender: JSON.stringify([provenance.sourceSessionKey ?? null, provenance.sourceTool ?? null]),
		body: isCliPrompt ? stripCliPromptDecorations(text.slice(envelope?.length ?? 0)) : text.slice(envelope?.length ?? 0)
	};
}
const SYSTEM_EVENT_TIMESTAMP_LINE = /^System: \[(?:\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z|\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?: [^\s\]]+)?|unknown-time)\] /u;
function stripLeadingSystemEventLines(text) {
	const context = text.match(/^(?:Conversation info: )?⟦openclaw:ctx⟧\n```json\n[^\n]*\n```\n\n/u)?.[0] ?? "";
	const lines = text.slice(context.length).replace(/^\n+/u, "").split("\n");
	let end = 0;
	let hasEvent = false;
	while (end < lines.length && (lines[end] === "System:" || lines[end]?.startsWith("System: "))) {
		hasEvent ||= SYSTEM_EVENT_TIMESTAMP_LINE.test(lines[end] ?? "");
		end += 1;
	}
	if (!hasEvent || end < lines.length && lines[end] !== "") return text;
	return context + lines.slice(end).join("\n").replace(/^\n+/u, "");
}
function stripCliPromptDecorations(text) {
	return stripLeadingSystemEventLines(stripCliSessionDriftNote(text));
}
//#endregion
//#region src/gateway/cli-session-history.claude.ts
const CLAUDE_CLI_PROVIDER = "claude-cli";
const CLAUDE_PROJECTS_RELATIVE_DIR = path.join(".claude", "projects");
function decodeClaudeCliProjectEntry(line) {
	const entry = JSON.parse(line);
	if (!isRecord(entry)) throw new Error("Claude history row must be an object");
	return entry;
}
function redactClaudeCliHistoryMessage(message) {
	return redactTranscriptMessage(message);
}
function resolveClaudeProjectsDir(homeDir) {
	return path.join(normalizeOptionalString(homeDir) || process.env.HOME || os.homedir(), CLAUDE_PROJECTS_RELATIVE_DIR);
}
function normalizeClaudeCliSessionId(value) {
	const sessionId = value.trim();
	return !sessionId || sessionId === "." || sessionId === ".." || path.isAbsolute(sessionId) || sessionId.includes("/") || sessionId.includes("\\") ? void 0 : sessionId;
}
function resolveClaudeSessionCandidate(projectDir, sessionId) {
	const candidate = path.resolve(projectDir, `${sessionId}.jsonl`);
	return candidate.startsWith(`${path.resolve(projectDir)}${path.sep}`) ? candidate : void 0;
}
function createClaudeReseedImportState(params) {
	const localSessionId = normalizeOptionalString(params.localSessionId);
	const normalizedReceipt = normalizeCliSessionReseedReceipt(params.reseedReceipt);
	return {
		receipt: normalizedReceipt && normalizedReceipt.localSessionId === localSessionId ? normalizedReceipt : void 0,
		inspectedFirstUser: false
	};
}
function resolveClaudeCliBindingSessionId(entry) {
	return getCliSessionBinding(entry, CLAUDE_CLI_PROVIDER)?.sessionId;
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
function removeContentBlock(content, blockIndex) {
	content.splice(blockIndex, 1);
	return content.length > 0 ? content : null;
}
function normalizeClaudeCliContent(content, toolNameRegistry) {
	if (!Array.isArray(content)) return content;
	return content.map((item) => {
		if (!isRecord(item)) return item;
		const block = { ...item };
		const type = typeof block.type === "string" ? block.type : "";
		if (type === "tool_use") {
			const id = normalizeOptionalString(block.id) ?? "";
			const name = normalizeOptionalString(block.name) ?? "";
			if (id && name) toolNameRegistry.set(id, name);
			if (block.input !== void 0 && block.arguments === void 0) block.arguments = block.input;
			block.type = "toolcall";
			delete block.input;
		} else if (type === "tool_result") {
			const toolUseId = resolveToolUseId(block);
			if (!block.name && toolUseId) {
				const toolName = toolNameRegistry.get(toolUseId);
				if (toolName) block.name = toolName;
			}
		}
		return block;
	});
}
function coalesceClaudeCliToolMessages(messages) {
	const coalesced = [];
	for (const message of messages) appendCoalescedClaudeCliToolMessage(coalesced, message);
	return coalesced;
}
function appendCoalescedClaudeCliToolMessage(messages, message) {
	const prior = messages.at(-1);
	const callBlocks = prior?.role === "assistant" && Array.isArray(prior.content) ? prior.content : [];
	const resultBlocks = message.role === "user" && Array.isArray(message.content) ? message.content : [];
	if (callBlocks.length > 0 && callBlocks.every(isToolCallBlock) && resultBlocks.length > 0 && resultBlocks.every(isToolResultBlock)) {
		const callIds = new Set(callBlocks.map(resolveToolUseId).filter((id) => Boolean(id)));
		if (resultBlocks.every((block) => {
			const toolUseId = resolveToolUseId(block);
			return Boolean(toolUseId && callIds.has(toolUseId));
		})) {
			messages[messages.length - 1] = {
				...prior,
				content: [...callBlocks, ...resultBlocks]
			};
			return;
		}
	}
	messages.push(message);
}
function isClaudeCliVisibleHarnessContext(entry) {
	return entry.isCompactSummary === true || entry.isVisibleInTranscriptOnly === true;
}
function isClaudeCliTaskNotification(entry, content) {
	return isRecord(entry.origin) && entry.origin.kind === "task-notification" && typeof content === "string" && content.startsWith("<task-notification>") && content.endsWith("</task-notification>");
}
function readClaudeCliInterSessionProvenance(content) {
	const blockIndex = typeof content === "string" ? -1 : content.findIndex((item) => isRecord(item) && item.type === "text");
	const candidate = blockIndex === -1 ? void 0 : content[blockIndex];
	const block = isRecord(candidate) ? candidate : void 0;
	const text = typeof content === "string" ? content : block?.text;
	if (typeof text !== "string") return;
	return readInterSessionPromptEnvelope(text)?.provenance;
}
function resolveClaudeCliPromptTextCandidates(entry, content) {
	if (entry.isMeta === true || isClaudeCliVisibleHarnessContext(entry)) return [];
	if (typeof content === "string") return [{ text: content }];
	if (content.some((item) => item !== null && typeof item === "object" && "type" in item && item.type === "tool_result")) return [];
	return content.flatMap((item, blockIndex) => item !== null && typeof item === "object" && "type" in item && item.type === "text" && "text" in item && typeof item.text === "string" ? [{
		text: item.text,
		blockIndex
	}] : []);
}
const SYSTEM_EVENT_BLOCK = /System: \[(?:\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}[^\]\n]*|unknown-time)\] [^\n]*\n+(?:System: [^\n]*\n+)*/u.source;
const INTERNAL_PROMPT_PREFIX = new RegExp(`^(?:${SYSTEM_EVENT_BLOCK})?${/(?:Note: The previous agent run was interrupted\. [^\n]*\n\n)?/u.source}`, "u");
/** Removes the resume note and queued system events OpenClaw put in front of a user turn. */
function stripClaudeCliGeneratedUserPrefixes(text) {
	return stripCliPromptDecorations(text);
}
/**
* Display copy of an imported user row that survived the history merge. The merge
* matches on the original text first, so this must not run before it.
*/
function cleanClaudeCliImportedUserDisplay(message) {
	const meta = isRecord(message) ? message["__openclaw"] : void 0;
	if (!isRecord(message) || message.role !== "user" || message.display === false || !isRecord(meta) || meta.importedFrom !== CLAUDE_CLI_PROVIDER) return message;
	const { content } = message;
	if (typeof content === "string") return {
		...message,
		content: stripClaudeCliGeneratedUserPrefixes(content)
	};
	if (!Array.isArray(content) || content.some((block) => isToolResultBlock(block))) return message;
	const firstTextIndex = content.findIndex((block) => isRecord(block) && block.type === "text" && typeof block.text === "string");
	return {
		...message,
		content: content.map((block, index) => index === firstTextIndex && isRecord(block) && typeof block.text === "string" ? Object.assign({}, block, { text: stripClaudeCliGeneratedUserPrefixes(block.text) }) : block)
	};
}
function resolveClaudeCliInternalSourceTool(text) {
	if (stripCliSessionDriftNote(`${text}\n\n`) === "") return "cli_session_resume";
	const body = stripCliSessionDriftNote(text).replace(INTERNAL_PROMPT_PREFIX, "");
	if (body.startsWith("An async command you ran earlier has completed. The command completion details are:\n\n") && body.includes("\n\nTreat this completion as an internal continuation, not a new user request. ")) return "exec";
	if (body.startsWith(HEARTBEAT_PROMPT) || body.startsWith(HEARTBEAT_RESPONSE_TOOL_PROMPT)) return "heartbeat";
	if (body.replace(/^\[[A-Z][a-z]{2} \d{4}-\d{2}-\d{2} \d{2}:\d{2}[^\]\n]*\] /u, "").startsWith(formatSystemTurnPrompt("Your previous turn was interrupted by a gateway restart while OpenClaw was waiting on tool/model work. "))) return "restart_recovery";
	if (/^<command-name>\/compact<\/command-name>\s*<command-message>compact<\/command-message>\s*<command-args>[\s\S]*<\/command-args>$/u.test(body) || /^<local-command-stdout>Compacted\s*<\/local-command-stdout>$/u.test(body)) return "claude_cli_command";
}
function parseClaudeCliHistoryEntry(entry, cliSessionId, sourceLineNumber, toolNameRegistry, options) {
	if (entry.isSidechain === true || entry.isMeta === true || !entry.message || typeof entry.message !== "object") return null;
	const type = typeof entry.type === "string" ? entry.type : void 0;
	const role = typeof entry.message.role === "string" ? entry.message.role : void 0;
	if (type !== "user" && type !== "assistant" || role !== type) return null;
	const timestamp = parseDateStringTimestampMs(entry.timestamp);
	const externalId = normalizeOptionalString(entry.uuid);
	const baseMeta = {
		id: externalId ?? `${CLAUDE_CLI_PROVIDER}:${cliSessionId}:line:${sourceLineNumber}`,
		importedFrom: CLAUDE_CLI_PROVIDER,
		cliSessionId,
		...externalId ? { externalId } : {}
	};
	let content = typeof entry.message.content === "string" || Array.isArray(entry.message.content) ? normalizeClaudeCliContent(entry.message.content, toolNameRegistry) : void 0;
	if (content === void 0) return null;
	if (type === "user") {
		const reseedState = options.reseedState;
		const promptTextCandidates = resolveClaudeCliPromptTextCandidates(entry, content);
		if (options.reseedMode === "recover" && reseedState && !reseedState.inspectedFirstUser && promptTextCandidates.length > 0) {
			reseedState.inspectedFirstUser = true;
			if (reseedState.receipt) {
				const candidate = promptTextCandidates.length === 1 ? promptTextCandidates[0] : void 0;
				if (candidate && hashCliReseedPrompt(candidate.text) === reseedState.receipt.promptHash) {
					if (candidate.blockIndex === void 0 || !Array.isArray(content)) return null;
					const nextContent = removeContentBlock(content, candidate.blockIndex);
					if (!nextContent) return null;
					content = nextContent;
				}
			} else for (const candidate of promptTextCandidates) {
				const reseedPrompt = parseCliReseedPrompt(candidate.text);
				if (reseedPrompt.kind === "legacy") {
					if (candidate.blockIndex === void 0) {
						if (!reseedPrompt.userMessage) return null;
						content = reseedPrompt.userMessage;
					} else if (Array.isArray(content)) {
						if (!reseedPrompt.userMessage) {
							const contentWithoutReseed = removeContentBlock(content, candidate.blockIndex);
							if (!contentWithoutReseed) return null;
							content = contentWithoutReseed;
							break;
						}
						const block = content[candidate.blockIndex];
						if (block && typeof block === "object") block.text = reseedPrompt.userMessage;
					}
					break;
				}
			}
		}
		const candidates = resolveClaudeCliPromptTextCandidates(entry, content);
		const internalSourceTool = candidates.length === 1 ? resolveClaudeCliInternalSourceTool(candidates[0].text) : void 0;
		const cliImageTurnKey = typeof content === "string" ? readCliImageTurnContext(content) : void 0;
		if (cliImageTurnKey && typeof content === "string") content = stripCliImageTurnContext(content, cliImageTurnKey);
		const sourceTool = isClaudeCliTaskNotification(entry, content) ? "claude_cli_task_notification" : isClaudeCliVisibleHarnessContext(entry) ? "cli_harness_context" : internalSourceTool;
		const provenance = sourceTool ? {
			kind: "internal_system",
			sourceTool
		} : readClaudeCliInterSessionProvenance(content);
		return attachOpenClawTranscriptMeta({
			role: "user",
			content,
			...internalSourceTool ? { display: false } : {},
			...provenance ? { provenance } : {},
			...timestamp !== void 0 ? { timestamp } : {}
		}, {
			...baseMeta,
			...cliImageTurnKey ? { cliImageTurnKey } : {}
		});
	}
	const usage = resolveClaudeCliUsage(entry.message.usage);
	return attachOpenClawTranscriptMeta({
		role: "assistant",
		content,
		api: "anthropic-messages",
		provider: CLAUDE_CLI_PROVIDER,
		...normalizeOptionalString(entry.message.model) ? { model: entry.message.model } : {},
		...normalizeOptionalString(entry.message.stop_reason) ? { stopReason: entry.message.stop_reason } : {},
		...usage ? { usage } : {},
		...timestamp !== void 0 ? { timestamp } : {}
	}, baseMeta);
}
function resolveClaudeCliSessionFilePath(params) {
	const sessionId = normalizeClaudeCliSessionId(params.cliSessionId);
	if (!sessionId) return;
	const projectsDir = resolveClaudeProjectsDir(params.homeDir);
	let projectEntries;
	try {
		projectEntries = fs.readdirSync(projectsDir, { withFileTypes: true });
	} catch {
		return;
	}
	for (const entry of projectEntries) {
		if (!entry.isDirectory()) continue;
		const candidate = resolveClaudeSessionCandidate(path.join(projectsDir, entry.name), sessionId);
		if (candidate && fs.existsSync(candidate)) return candidate;
	}
}
async function resolveClaudeCliSessionFilePathAsync(params) {
	const sessionId = normalizeClaudeCliSessionId(params.cliSessionId);
	if (!sessionId) return;
	const projectsDir = resolveClaudeProjectsDir(params.homeDir);
	let projectEntries;
	try {
		projectEntries = await fs.promises.readdir(projectsDir, { withFileTypes: true });
	} catch {
		return;
	}
	const batchSize = 16;
	for (let offset = 0; offset < projectEntries.length; offset += batchSize) {
		const candidate = (await Promise.all(projectEntries.slice(offset, offset + batchSize).map(async (entry) => {
			if (!entry.isDirectory()) return;
			const candidate = resolveClaudeSessionCandidate(path.join(projectsDir, entry.name), sessionId);
			if (!candidate) return;
			try {
				await fs.promises.access(candidate);
				return candidate;
			} catch {
				return;
			}
		}))).find((value) => value !== void 0);
		if (candidate) return candidate;
	}
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
	const lines = content.split(/\r?\n/);
	for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
		const line = lines[lineIndex] ?? "";
		if (!line.trim()) continue;
		let parsed;
		try {
			parsed = decodeClaudeCliProjectEntry(line);
		} catch {
			continue;
		}
		const explicitSummary = parsed.type === "summary" ? normalizeOptionalString(parsed.summary) : void 0;
		if (explicitSummary) {
			pendingSummary = explicitSummary;
			continue;
		}
		if (parsed.type === "system" && parsed.subtype === "compact_boundary") {
			lastSummary = pendingSummary;
			pendingSummary = void 0;
			lastBoundaryFallback = normalizeOptionalString(parsed.content) ?? lastBoundaryFallback;
			windowedTurns = [];
			toolNameRegistry.clear();
			continue;
		}
		const message = parseClaudeCliHistoryEntry(parsed, params.cliSessionId, lineIndex + 1, toolNameRegistry, { reseedMode: "preserve" });
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
export { parseClaudeCliHistoryEntry as a, resolveClaudeCliBindingSessionId as c, readRoutedPromptView as d, stripCliPromptDecorations as f, decodeClaudeCliProjectEntry as i, resolveClaudeCliPromptTextCandidates as l, parseCliReseedPrompt as m, cleanClaudeCliImportedUserDisplay as n, readClaudeCliFallbackSeed as o, hashCliReseedPrompt as p, createClaudeReseedImportState as r, redactClaudeCliHistoryMessage as s, appendCoalescedClaudeCliToolMessage as t, resolveClaudeCliSessionFilePathAsync as u };
