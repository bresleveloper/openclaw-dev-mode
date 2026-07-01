import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { c as parseAgentSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { p as resolveAgentIdFromSessionKey } from "./session-key-pTKRJb0m.js";
import { b as loadSessionStore, et as resolveSessionStoreEntry } from "./store-DJ7wx5_V.js";
import { a as resolveSessionFilePath, d as resolveStorePath, r as resolveDefaultSessionStorePath } from "./paths-CHZBIGhF.js";
import { B as streamSessionTranscriptLinesReverse, G as redactTranscriptMessage, K as resolveAndPersistSessionFile, W as isTranscriptOnlyOpenClawAssistantModel, b as persistSessionTranscriptTurn } from "./session-accessor-Dx6KDG0K.js";
import { n as extractAssistantVisibleText, r as extractFirstTextBlock } from "./chat-message-content-DjYNz8gU.js";
import { t as resolveMirroredTranscriptText } from "./transcript-mirror-BUJrk10q.js";
import path from "node:path";
//#region src/config/sessions/transcript.ts
function applyBeforeMessageWriteToAssistant(params) {
	if (!params.beforeMessageWrite) return params.message;
	const nextMessage = params.beforeMessageWrite({
		message: params.message,
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.sessionKey
	});
	if (nextMessage?.role !== "assistant") return;
	return {
		...nextMessage,
		...params.explicitIdempotencyKey ? { idempotencyKey: params.explicitIdempotencyKey } : {}
	};
}
function parseAssistantTranscriptText(line, options) {
	const parsed = JSON.parse(line);
	const message = parsed.message;
	if (!message || message.role !== "assistant") return;
	if (options?.excludeTranscriptOnlyOpenClawAssistant && isTranscriptOnlyOpenClawAssistantMessage(message)) return;
	const text = extractAssistantVisibleText(message)?.trim();
	if (!text) return;
	return {
		...typeof parsed.id === "string" && parsed.id ? { id: parsed.id } : {},
		text,
		...typeof message.timestamp === "number" && Number.isFinite(message.timestamp) ? { timestamp: message.timestamp } : {}
	};
}
function isTranscriptOnlyOpenClawAssistantMessage(message) {
	return isTranscriptOnlyOpenClawAssistantModel(message.provider, message.model);
}
function normalizeTranscriptTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function isBeforeTranscriptTimestamp(timestamp, beforeTimestampMs) {
	return beforeTimestampMs === void 0 || timestamp === void 0 || timestamp < beforeTimestampMs;
}
function isAtOrAfterTranscriptTimestamp(timestamp, minTimestampMs) {
	return minTimestampMs === void 0 || timestamp === void 0 || timestamp >= minTimestampMs;
}
function normalizeRecentTranscriptLimit(limit) {
	return Math.max(1, Math.floor(limit ?? 10));
}
function parseRecentConversationText(line) {
	const parsed = JSON.parse(line);
	const message = parsed.message;
	if (!message || message.role !== "user" && message.role !== "assistant") return;
	if (message.role === "assistant" && isTranscriptOnlyOpenClawAssistantMessage(message)) return;
	const text = message.role === "assistant" ? extractAssistantVisibleText(message) : extractFirstTextBlock(message)?.trim();
	if (!text) return;
	const provenance = message.provenance && typeof message.provenance === "object" ? message.provenance : void 0;
	return {
		...typeof parsed.id === "string" && parsed.id ? { id: parsed.id } : {},
		role: message.role,
		text,
		...normalizeTranscriptTimestamp(message.timestamp) !== void 0 ? { timestamp: normalizeTranscriptTimestamp(message.timestamp) } : {},
		...typeof provenance?.sourceChannel === "string" && provenance.sourceChannel.trim() ? { sourceChannel: provenance.sourceChannel.trim() } : {}
	};
}
function resolveSessionConversationTranscriptPath(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return;
	const storePath = params.storePath ?? resolveDefaultSessionStorePath(params.agentId);
	const entry = resolveSessionStoreEntry({
		store: loadSessionStore(storePath, { skipCache: true }),
		sessionKey
	}).existing;
	if (!entry?.sessionId) return;
	return resolveSessionFilePath(entry.sessionId, entry, {
		sessionsDir: path.dirname(storePath),
		...params.agentId ? { agentId: params.agentId } : {}
	});
}
async function readRecentUserAssistantTextFromSessionTranscript(sessionFile, options = {}) {
	if (!sessionFile?.trim()) return [];
	const limit = normalizeRecentTranscriptLimit(options.limit);
	const recent = [];
	for await (const line of streamSessionTranscriptLinesReverse(sessionFile)) try {
		const entry = parseRecentConversationText(line);
		if (!entry) continue;
		if (!isBeforeTranscriptTimestamp(entry.timestamp, options.beforeTimestampMs)) continue;
		if (!isAtOrAfterTranscriptTimestamp(entry.timestamp, options.minTimestampMs)) continue;
		recent.push(entry);
		if (recent.length >= limit) break;
	} catch {
		continue;
	}
	return recent.toReversed();
}
async function readRecentUserAssistantTextForSession(params) {
	return await readRecentUserAssistantTextFromSessionTranscript(resolveSessionConversationTranscriptPath(params), params);
}
async function readLatestAssistantTextFromSessionTranscript(sessionFile) {
	if (!sessionFile?.trim()) return;
	for await (const line of streamSessionTranscriptLinesReverse(sessionFile)) try {
		const assistantText = parseAssistantTranscriptText(line, { excludeTranscriptOnlyOpenClawAssistant: true });
		if (assistantText) return assistantText;
	} catch {
		continue;
	}
}
async function readTailAssistantTextFromSessionTranscript(sessionFile) {
	if (!sessionFile?.trim()) return;
	for await (const line of streamSessionTranscriptLinesReverse(sessionFile)) try {
		const parsed = JSON.parse(line);
		if (!parsed.message || typeof parsed.message !== "object") continue;
		return parseAssistantTranscriptText(line);
	} catch {
		continue;
	}
}
async function appendAssistantMessageToSessionTranscript(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return {
		ok: false,
		reason: "missing sessionKey"
	};
	const mirrorText = resolveMirroredTranscriptText({
		text: params.text,
		mediaUrls: params.mediaUrls
	});
	if (!mirrorText) return {
		ok: false,
		reason: "empty text"
	};
	return appendExactAssistantMessageToSessionTranscript({
		agentId: params.agentId,
		sessionKey,
		...params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {},
		storePath: params.storePath,
		idempotencyKey: params.idempotencyKey,
		updateMode: params.updateMode,
		config: params.config,
		...params.beforeMessageWrite ? { beforeMessageWrite: params.beforeMessageWrite } : {},
		message: {
			role: "assistant",
			content: [{
				type: "text",
				text: mirrorText
			}],
			api: "openai-responses",
			provider: "openclaw",
			model: "delivery-mirror",
			usage: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				totalTokens: 0,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					total: 0
				}
			},
			stopReason: "stop",
			timestamp: Date.now(),
			...params.deliveryMirror ? { openclawDeliveryMirror: params.deliveryMirror } : {}
		}
	});
}
async function appendExactAssistantMessageToSessionTranscript(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return {
		ok: false,
		reason: "missing sessionKey"
	};
	if (params.message.role !== "assistant") return {
		ok: false,
		reason: "message role must be assistant"
	};
	const explicitAgentId = params.agentId?.trim() || void 0;
	const sessionAgentId = parseAgentSessionKey(sessionKey)?.agentId;
	const transcriptAgentId = explicitAgentId ?? sessionAgentId;
	const storeAgentId = transcriptAgentId ?? resolveAgentIdFromSessionKey(sessionKey);
	const storePath = params.storePath ?? resolveStorePath(params.config?.session?.store, { agentId: storeAgentId });
	const store = loadSessionStore(storePath, { skipCache: true });
	const resolved = resolveSessionStoreEntry({
		store,
		sessionKey
	});
	const entry = resolved.existing;
	if (params.expectedSessionId && entry?.sessionId !== params.expectedSessionId) return {
		ok: false,
		code: "session-rebound",
		reason: `session rebound for sessionKey: ${sessionKey}`
	};
	if (!entry?.sessionId) return {
		ok: false,
		reason: `unknown sessionKey: ${sessionKey}`
	};
	const appendToSessionFile = async (currentEntry, sessionFile) => {
		const explicitIdempotencyKey = params.idempotencyKey ?? params.message.idempotencyKey;
		const message = {
			...params.message,
			...explicitIdempotencyKey ? { idempotencyKey: explicitIdempotencyKey } : {}
		};
		const preparedUnkeyedMessage = !explicitIdempotencyKey && params.beforeMessageWrite ? applyBeforeMessageWriteToAssistant({
			message,
			beforeMessageWrite: params.beforeMessageWrite,
			agentId: transcriptAgentId,
			sessionKey: resolved.normalizedKey
		}) : message;
		if (!preparedUnkeyedMessage) return {
			ok: false,
			code: "blocked",
			reason: "blocked by before_message_write"
		};
		const identifiedChannelFinal = Boolean(explicitIdempotencyKey) && isChannelFinalDeliveryMirror(params.message);
		let latestEquivalentAssistantId;
		const turn = await persistSessionTranscriptTurn({
			sessionId: currentEntry.sessionId,
			sessionKey: resolved.normalizedKey,
			storePath,
			...sessionFile ? { sessionFile } : {},
			...transcriptAgentId ? { agentId: transcriptAgentId } : {}
		}, {
			cwd: currentEntry.spawnedCwd,
			...params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {},
			...params.config ? { config: params.config } : {},
			updateMode: params.updateMode ?? "inline",
			touchSessionEntry: true,
			messages: [{
				message: preparedUnkeyedMessage,
				...explicitIdempotencyKey ? { idempotencyLookup: "scan" } : {},
				...explicitIdempotencyKey && params.beforeMessageWrite ? { prepareMessageAfterIdempotencyCheck: (candidate) => applyBeforeMessageWriteToAssistant({
					message: candidate,
					beforeMessageWrite: params.beforeMessageWrite,
					explicitIdempotencyKey,
					agentId: transcriptAgentId,
					sessionKey: resolved.normalizedKey
				}) } : {},
				shouldAppend: async (target) => {
					latestEquivalentAssistantId = isRedundantDeliveryMirror(params.message) && !identifiedChannelFinal ? await findLatestEquivalentAssistantMessageId(target.sessionFile, preparedUnkeyedMessage, params.config) : void 0;
					return !latestEquivalentAssistantId;
				}
			}]
		});
		if (turn.rejectedReason === "session-rebound") return {
			ok: false,
			code: "session-rebound",
			reason: `session rebound for sessionKey: ${sessionKey}`
		};
		if (latestEquivalentAssistantId) return {
			ok: true,
			sessionFile: turn.sessionFile,
			messageId: latestEquivalentAssistantId
		};
		const appendedResult = turn.messages[0];
		if (!appendedResult) return {
			ok: false,
			code: "blocked",
			reason: "blocked by before_message_write"
		};
		const { messageId } = appendedResult;
		return {
			ok: true,
			sessionFile: turn.sessionFile,
			messageId
		};
	};
	let result;
	if (params.expectedSessionId) result = await appendToSessionFile(entry);
	else {
		let sessionFile;
		try {
			sessionFile = (await resolveAndPersistSessionFile({
				sessionId: entry.sessionId,
				sessionKey: resolved.normalizedKey,
				sessionStore: store,
				storePath,
				sessionEntry: entry,
				agentId: transcriptAgentId,
				sessionsDir: path.dirname(storePath)
			})).sessionFile;
		} catch (err) {
			return {
				ok: false,
				reason: formatErrorMessage(err)
			};
		}
		result = await appendToSessionFile(entry, sessionFile);
	}
	return result;
}
function isRedundantDeliveryMirror(message) {
	return message.provider === "openclaw" && message.model === "delivery-mirror";
}
function isChannelFinalDeliveryMirror(message) {
	const marker = message.openclawDeliveryMirror;
	return isRedundantDeliveryMirror(message) && marker?.kind === "channel-final";
}
function extractAssistantMessageText(message) {
	if (!Array.isArray(message.content)) return null;
	const parts = message.content.filter((part) => part.type === "text" && typeof part.text === "string" && part.text.trim().length > 0).map((part) => part.text.trim());
	return parts.length > 0 ? parts.join("\n").trim() : null;
}
async function findLatestEquivalentAssistantMessageId(transcriptPath, message, config) {
	const expectedText = extractAssistantMessageText(redactTranscriptMessage(message, config));
	if (!expectedText) return;
	for await (const line of streamSessionTranscriptLinesReverse(transcriptPath)) try {
		const parsed = JSON.parse(line);
		const candidate = parsed.message;
		if (!candidate || candidate.role !== "assistant") continue;
		if (extractAssistantMessageText(redactTranscriptMessage(candidate, config)) !== expectedText) return;
		if (typeof parsed.id === "string" && parsed.id) return parsed.id;
		return;
	} catch {
		continue;
	}
}
//#endregion
export { readRecentUserAssistantTextFromSessionTranscript as a, readRecentUserAssistantTextForSession as i, appendExactAssistantMessageToSessionTranscript as n, readTailAssistantTextFromSessionTranscript as o, readLatestAssistantTextFromSessionTranscript as r, appendAssistantMessageToSessionTranscript as t };
