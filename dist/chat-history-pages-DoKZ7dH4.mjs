import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { n as getCliSessionBinding } from "./cli-session-binding-BhV_HbVa.mjs";
import { a as extractChatToolResultCanvasPreview, i as extractChatHistoryBlockText, r as augmentChatHistoryWithCanvasBlocks } from "./chat-display-projection.canvas-C78Q4iVY.mjs";
import { a as isToolResultContentType, n as isToolCallContentType, o as readToolErrorFlag, r as isToolErrorOutput } from "./tool-content-ByAb-IhE.mjs";
import { c as isAssistantInternalReasoningContentType, l as isAssistantTextContentType, s as hasTranscriptMediaFacts } from "./chat-display-projection.helpers-BloZC0RQ.mjs";
import { p as resolveCurrentUserProfileDisplay } from "./session-identity-projection-C0mYume0.mjs";
import { a as readSessionMessagesAsync, l as session_transcript_readers_exports } from "./session-transcript-readers-nuptsJ6Q.mjs";
import { l as projectForwardedMessages, r as dropPreSessionStartAnnouncePairs } from "./chat-display-projection.history-C3UZzKPr.mjs";
import { n as createCurrentUserProfileMessageProjector, o as projectChatDisplayMessagesWithState } from "./chat-display-projection.core-DpiCCyQ3.mjs";
import { a as readTranscriptDisplayPosition } from "./transcript-image-artifacts-BJipDW7F.mjs";
import { t as logLargePayload } from "./diagnostic-payload-CxhAhghE.mjs";
import { r as readChatHistoryMessageId } from "./session-history-tail-u8zzeDH7.mjs";
import { r as readChatHistoryPageKernel } from "./chat-history-page-kernel-Bbl6Za4F.mjs";
import { t as createSessionHistorySubagentProjection } from "./session-history-subagent-projection-CPYJxN1U.mjs";
//#region src/gateway/server-methods/chat-history-budget.ts
const CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES = 131072;
const CHAT_HISTORY_OVERSIZED_PLACEHOLDER = "[chat.history omitted: message too large]";
const CHAT_HISTORY_UNAVAILABLE_SENTINEL = "[chat.history unavailable: transcript too large to display; the full history is preserved on disk]";
let chatHistoryOmittedEmitCount = 0;
function createChatHistoryActivityProjection(messages, activity = []) {
	const byId = new Map(activity.map((entry) => [entry.messageId, entry]));
	return new Map(messages.flatMap((message) => {
		const messageId = readChatHistoryMessageId(message);
		const entry = messageId ? byId.get(messageId) : void 0;
		const record = asOptionalRecord(message);
		const toolBearing = record && (isToolResultContentType(record.role) || record.role === "tool" || record.role === "function" || Array.isArray(record.content) && record.content.some((block) => {
			const type = asOptionalRecord(block)?.type;
			return isToolCallContentType(type) || isToolResultContentType(type);
		}));
		return entry && toolBearing ? [[message, entry]] : [];
	}));
}
function createChatHistoryByteCounter(activity) {
	const sizes = /* @__PURE__ */ new Map();
	const messageBytes = (message) => {
		const cached = sizes.get(message);
		if (cached !== void 0) return cached;
		const descriptor = activity?.get(message);
		const bytes = jsonUtf8Bytes(message) + (descriptor ? jsonUtf8Bytes(descriptor) + 1 : 0);
		sizes.set(message, bytes);
		return bytes;
	};
	return {
		messageBytes,
		framingBytes: (messages) => messages.some((message) => activity?.has(message)) ? 13 : 0,
		messagesBytes: (messages) => (messages.some((message) => activity?.has(message)) ? 15 : 2) + messages.reduce((bytes, message) => bytes + messageBytes(message), 0) + Math.max(0, messages.length - 1)
	};
}
function chatHistoryActivityBytes(activity) {
	return activity.length > 0 ? jsonUtf8Bytes({ activity }) - 1 : 0;
}
function hasHistoryToolPresentation(message, inheritedError) {
	return Boolean(asOptionalRecord(message.details) || (readToolErrorFlag(message) ?? inheritedError) === true || extractChatToolResultCanvasPreview(message));
}
function isPlainHistoryToolResult(message, inheritedError) {
	if (hasHistoryToolPresentation(message, inheritedError) || (readToolErrorFlag(message) ?? inheritedError ?? isToolErrorOutput(extractChatHistoryBlockText(message)))) return false;
	const content = message.content ?? message.text;
	return content === void 0 || typeof content === "string" || Array.isArray(content) && content.every((block) => {
		const entry = asOptionalRecord(block);
		return isAssistantTextContentType(entry?.type) && typeof entry?.text === "string";
	});
}
function isChatHistoryActivity(message) {
	const entry = asOptionalRecord(message);
	if (!entry || hasTranscriptMediaFacts(entry) || hasHistoryToolPresentation(entry)) return false;
	const metadata = asOptionalRecord(entry["__openclaw"]);
	if (metadata?.kind !== void 0 || metadata?.turnBoundary === true || metadata?.replyToId !== void 0 || metadata?.replyToPreview !== void 0 || entry.openclawDelivery !== void 0 || entry.stopReason === "error") return false;
	const role = normalizeLowercaseStringOrEmpty(entry.role);
	if (role === "toolresult" || role === "tool_result" || role === "tool" || role === "function") return isPlainHistoryToolResult(entry);
	if (role !== "assistant" && role !== "user" || typeof entry.text === "string" && entry.text.trim() || !Array.isArray(entry.content) || entry.content.length === 0) return false;
	return entry.content.every((block) => {
		const content = asOptionalRecord(block);
		if (!content) return false;
		return isToolResultContentType(content.type) ? isPlainHistoryToolResult(content, readToolErrorFlag(entry)) : !hasHistoryToolPresentation(content, readToolErrorFlag(entry)) && (isToolCallContentType(content.type) || isAssistantInternalReasoningContentType(content.type));
	});
}
function trimChatHistoryActivity(params) {
	const { messages, maxBytes, byteCounter } = params;
	let bytes = byteCounter.messagesBytes(messages);
	if (bytes <= maxBytes) return messages;
	let remaining = messages.length;
	return messages.filter((message) => {
		if (bytes <= maxBytes || !isChatHistoryActivity(message)) return true;
		bytes -= byteCounter.messageBytes(message) + (remaining > 1 ? 1 : 0);
		remaining -= 1;
		return false;
	});
}
function buildChatHistoryUnavailableSentinel() {
	return {
		role: "assistant",
		timestamp: Date.now(),
		content: [{
			type: "text",
			text: CHAT_HISTORY_UNAVAILABLE_SENTINEL
		}]
	};
}
function buildOversizedHistoryPlaceholder(message) {
	const entry = asOptionalRecord(message) ?? {};
	const role = typeof entry.role === "string" ? entry.role : "assistant";
	const timestamp = typeof entry.timestamp === "number" ? entry.timestamp : Date.now();
	const metadata = asOptionalRecord(entry["__openclaw"]) ?? {};
	const toolIdentity = Object.fromEntries([
		"toolCallId",
		"tool_call_id",
		"toolUseId",
		"tool_use_id",
		"toolName",
		"tool_name",
		"name"
	].filter((key) => typeof entry[key] === "string").map((key) => [key, entry[key]]));
	const isError = readToolErrorFlag(entry);
	const metadataId = typeof metadata.id === "string" ? metadata.id : void 0;
	const metadataSeq = typeof metadata.seq === "number" ? metadata.seq : void 0;
	const metadataIdempotencyKey = typeof metadata.idempotencyKey === "string" ? metadata.idempotencyKey : void 0;
	const turnBoundary = metadata.turnBoundary === true;
	const transcriptPosition = readTranscriptDisplayPosition(metadata.transcriptPosition);
	return {
		role,
		timestamp,
		content: [{
			type: "text",
			text: CHAT_HISTORY_OVERSIZED_PLACEHOLDER
		}],
		...toolIdentity,
		...isError !== void 0 ? { isError } : {},
		__openclaw: {
			...metadata.toolOutput ? { toolOutput: metadata.toolOutput } : {},
			...metadataId ? { id: metadataId } : {},
			...metadataSeq !== void 0 ? { seq: metadataSeq } : {},
			...metadataIdempotencyKey ? { idempotencyKey: metadataIdempotencyKey } : {},
			...turnBoundary ? { turnBoundary: true } : {},
			...transcriptPosition ? { transcriptPosition } : {},
			truncated: true,
			reason: "oversized"
		}
	};
}
function replaceOversizedChatHistoryMessages(params) {
	const { messages, maxSingleMessageBytes } = params;
	const byteCounter = params.byteCounter ?? createChatHistoryByteCounter();
	if (messages.length === 0) return {
		messages,
		replacedCount: 0
	};
	let replacedCount = 0;
	const next = messages.map((message) => {
		if (byteCounter.messageBytes(message) <= maxSingleMessageBytes) return message;
		replacedCount += 1;
		const placeholder = buildOversizedHistoryPlaceholder(message);
		return byteCounter.messageBytes(placeholder) <= maxSingleMessageBytes ? placeholder : buildChatHistoryUnavailableSentinel();
	});
	return {
		messages: replacedCount > 0 ? next : messages,
		replacedCount
	};
}
function reportOmittedChatHistory(params) {
	const { originalMessages, finalMessages, getNormalizedBytes, maxHistoryBytes, logDebug } = params;
	const survivors = new Set(finalMessages);
	let omittedCount = 0;
	for (const message of originalMessages) if (!survivors.has(message)) omittedCount += 1;
	if (omittedCount === 0) return 0;
	chatHistoryOmittedEmitCount += omittedCount;
	logLargePayload({
		surface: "gateway.chat.history",
		action: "truncated",
		bytes: getNormalizedBytes(),
		limitBytes: maxHistoryBytes,
		count: omittedCount,
		reason: "chat_history_budget"
	});
	logDebug(`chat.history omitted oversized payloads count=${omittedCount} total=${chatHistoryOmittedEmitCount}`);
	return omittedCount;
}
//#endregion
//#region src/gateway/server-methods/chat-history-pages.ts
function readCliIdentityProjectionKey(message) {
	const id = readChatHistoryMessageId(message);
	if (id) return `id:${id}`;
	const record = asOptionalRecord(message);
	const meta = asOptionalRecord(record?.["__openclaw"]);
	const position = readTranscriptDisplayPosition(meta?.transcriptPosition);
	if (!record || !position) return;
	return JSON.stringify([
		position,
		record.role,
		record.text,
		record.content
	]);
}
function projectCliIdentityOntoPagedMessages(params) {
	const importedMetaByKey = /* @__PURE__ */ new Map();
	for (const message of params.completeMessages) {
		const key = readCliIdentityProjectionKey(message);
		const meta = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"]);
		if (key && meta) importedMetaByKey.set(key, meta);
	}
	return params.pagedMessages.map((message) => {
		const record = asOptionalRecord(message);
		const key = readCliIdentityProjectionKey(message);
		const importedMeta = key ? importedMetaByKey.get(key) : void 0;
		if (!record || !importedMeta) return message;
		const localMeta = asOptionalRecord(record["__openclaw"]);
		return {
			...record,
			__openclaw: {
				...localMeta,
				importedFrom: importedMeta.importedFrom,
				externalId: importedMeta.externalId,
				cliSessionId: importedMeta.cliSessionId
			}
		};
	});
}
async function readChatHistoryPage(params, signal) {
	signal?.throwIfAborted();
	if (!params.sessionId || !params.storePath || params.entry?.incognito || isIncognitoSessionKey(params.canonicalKey) || getCliSessionBinding(params.entry, "claude-cli")?.sessionId) {
		const page = await readChatHistoryPageLocal(params);
		return {
			...page,
			messages: refreshForwardedLabels(page.messages)
		};
	}
	const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-CJUmmPMK.mjs");
	const page = await readSessionHistoryPageInWorker({
		kind: "rpc",
		params: {
			...params,
			sessionId: params.sessionId,
			storePath: params.storePath,
			entry: params.entry ? {
				sessionId: params.entry.sessionId,
				updatedAt: params.entry.updatedAt,
				sessionStartedAt: params.entry.sessionStartedAt
			} : void 0
		}
	}, signal);
	const project = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay);
	return {
		...page,
		messages: refreshForwardedLabels(page.messages).map((message) => {
			const record = asOptionalRecord(message);
			return record ? project(record) : message;
		})
	};
}
function refreshForwardedLabels(messages) {
	return projectForwardedMessages(messages.filter((message) => asOptionalRecord(message) !== void 0));
}
async function readChatHistoryPageLocal(params) {
	const { entry, provider, effectiveMaxChars, offset, messageId, sessionId, storePath } = params;
	const cliSessionId = params.ignoreCliSessionImports ? void 0 : getCliSessionBinding(entry, "claude-cli")?.sessionId;
	const subagentCoordination = sessionId && storePath && !entry?.incognito && !isIncognitoSessionKey(params.canonicalKey) ? createSessionHistorySubagentProjection({
		agentId: params.sessionAgentId,
		sessionId,
		sessionKey: params.canonicalKey,
		storePath,
		sessionEntry: entry
	}) : void 0;
	const page = await readChatHistoryPageKernel(params, {
		readers: {
			...session_transcript_readers_exports,
			subagentCoordination
		},
		resolveCurrentUserProfileDisplay,
		...cliSessionId ? {
			cliSessionId,
			readCliTailPage: async ({ readScope, incrementalTail, activeLeafEntryId, buildTailPage }) => {
				const localMessagesWithBoundaryFilter = incrementalTail.rawMessages;
				const { readChatHistoryCliSessionImportSnapshot, resolveChatHistoryWithCliSessionImports } = await import("./cli-session-history-Pz1YSMgy.mjs");
				const importedMessages = await readChatHistoryCliSessionImportSnapshot({
					entry,
					provider,
					localMessages: localMessagesWithBoundaryFilter
				});
				const cliHistory = resolveChatHistoryWithCliSessionImports({
					entry,
					provider,
					localMessages: localMessagesWithBoundaryFilter,
					preparedImportedMessages: importedMessages
				});
				if ((offset !== void 0 || messageId) && !cliHistory.imported) return readChatHistoryPageLocal({
					...params,
					ignoreCliSessionImports: true
				});
				if (cliHistory.expanded || messageId) {
					const completeLocalMessages = dropPreSessionStartAnnouncePairs(await readSessionMessagesAsync(readScope, {
						mode: "full",
						reason: "chat.history CLI import merge",
						allowResetArchiveFallback: true
					}), typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0);
					const completeCliHistory = resolveChatHistoryWithCliSessionImports({
						entry,
						provider,
						localMessages: completeLocalMessages,
						preparedImportedMessages: importedMessages
					});
					if (!completeCliHistory.imported) return readChatHistoryPageLocal({
						...params,
						ignoreCliSessionImports: true
					});
					const mergedMessages = dropPreSessionStartAnnouncePairs(completeCliHistory.messages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0);
					const { messages: displayMessages, activity } = projectChatDisplayMessagesWithState(mergedMessages, {
						subagentCoordination,
						includeCommentaryFallbacks: true,
						maxChars: effectiveMaxChars,
						resolveCurrentUserProfileDisplay
					});
					if (!completeCliHistory.expanded && !messageId) {
						const localPage = await readChatHistoryPageLocal({
							...params,
							ignoreCliSessionImports: true
						});
						return {
							...localPage,
							messages: projectCliIdentityOntoPagedMessages({
								pagedMessages: localPage.messages,
								completeMessages: displayMessages
							})
						};
					}
					if (messageId && !displayMessages.some((message) => readChatHistoryMessageId(message) === messageId)) return { messages: [] };
					return {
						activeLeafEntryId,
						messages: augmentChatHistoryWithCanvasBlocks(displayMessages),
						activity,
						completeCliImport: true,
						pagination: {
							offset: 0,
							totalMessages: mergedMessages.length,
							rawPageMessages: mergedMessages.length,
							exhausted: true
						}
					};
				}
				return buildTailPage(cliHistory.imported ? projectCliIdentityOntoPagedMessages({
					pagedMessages: incrementalTail.projected,
					completeMessages: cliHistory.messages
				}) : incrementalTail.projected);
			}
		} : {}
	});
	subagentCoordination?.assertCurrent?.();
	return page;
}
//#endregion
export { createChatHistoryByteCounter as a, trimChatHistoryActivity as c, createChatHistoryActivityProjection as i, CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES as n, replaceOversizedChatHistoryMessages as o, chatHistoryActivityBytes as r, reportOmittedChatHistory as s, readChatHistoryPage as t };
