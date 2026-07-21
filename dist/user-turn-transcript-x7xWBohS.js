import { l as mimeTypeFromFilePath } from "./mime-BaK8UYea.js";
import { E as persistSessionTranscriptTurn } from "./session-accessor-CwhXEUId.js";
import { r as applyInputProvenanceToUserMessage, s as normalizeInputProvenance } from "./input-provenance-BkJA7lbx.js";
import path from "node:path";
//#region src/sessions/user-turn-transcript.ts
function normalizeOptionalText(value) {
	const normalized = value?.trim();
	return normalized ? normalized : void 0;
}
function normalizeTranscriptText(value) {
	return value ?? "";
}
const CHANNEL_MEDIA_PLACEHOLDER_PATTERN = /^<media:[a-z0-9_-]+>(?:\s+\([^)]*\))?$/i;
function resolvePersistedUserTurnText(value, options = {}) {
	const normalized = normalizeOptionalText(value);
	if (!normalized) return;
	if (options.hasMedia === true && CHANNEL_MEDIA_PLACEHOLDER_PATTERN.test(normalized)) return;
	return normalized;
}
function mediaTypeForTranscript(media) {
	return normalizeOptionalText(media.contentType) ?? normalizeOptionalText(media.kind) ?? "application/octet-stream";
}
function normalizeMediaEntryForTranscript(media) {
	const pathLocal = normalizeOptionalText(media.path) ?? normalizeOptionalText(media.url);
	if (!pathLocal) return;
	return {
		path: pathLocal,
		type: mediaTypeForTranscript(media)
	};
}
function normalizeOptionalTextArray(values) {
	return values?.map(normalizeOptionalText) ?? [];
}
const URL_LIKE_MEDIA_PATH_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
function resolveTranscriptMediaPath(pathValue, workspaceDir) {
	if (!workspaceDir || path.isAbsolute(pathValue) || URL_LIKE_MEDIA_PATH_PATTERN.test(pathValue)) return pathValue;
	return path.join(workspaceDir, pathValue);
}
function resolveTranscriptMediaType(params) {
	return params.explicitType ?? mimeTypeFromFilePath(params.mediaPath ?? params.mediaUrl);
}
function buildPersistedUserTurnMediaInputsFromFields(fields) {
	if (!fields) return [];
	const mediaFields = fields;
	const paths = normalizeOptionalTextArray(mediaFields.MediaPaths);
	const urls = normalizeOptionalTextArray(mediaFields.MediaUrls);
	const types = normalizeOptionalTextArray(mediaFields.MediaTypes);
	const singlePath = normalizeOptionalText(mediaFields.MediaPath);
	const singleUrl = normalizeOptionalText(mediaFields.MediaUrl);
	const singleType = normalizeOptionalText(mediaFields.MediaType);
	const workspaceDir = normalizeOptionalText(mediaFields.MediaWorkspaceDir);
	const mediaCount = Math.max(paths.length, urls.length, singlePath || singleUrl ? 1 : 0);
	const media = [];
	for (let index = 0; index < mediaCount; index += 1) {
		const rawPath = paths[index] ?? (index === 0 ? singlePath : void 0);
		const mediaPath = rawPath ? resolveTranscriptMediaPath(rawPath, workspaceDir) : void 0;
		const url = urls[index] ?? (index === 0 ? singleUrl : void 0);
		if (!mediaPath && !url) continue;
		media.push({
			...mediaPath ? { path: mediaPath } : {},
			...url ? { url } : {},
			contentType: resolveTranscriptMediaType({
				explicitType: types[index] ?? (index === 0 ? singleType : void 0),
				mediaPath,
				mediaUrl: url
			})
		});
	}
	return media;
}
function buildPersistedUserTurnMediaFields(media) {
	const normalized = (Array.isArray(media) ? media : []).map(normalizeMediaEntryForTranscript).filter((entry) => entry !== void 0);
	const paths = normalized.map((entry) => entry.path);
	if (paths.length === 0) return {};
	const types = normalized.map((entry) => entry.type);
	return {
		MediaPath: paths[0],
		MediaPaths: paths,
		MediaType: types[0],
		MediaTypes: types
	};
}
function buildUserTurnSenderMeta(sender) {
	const senderId = normalizeOptionalText(sender?.id);
	const senderName = normalizeOptionalText(sender?.name);
	const senderUsername = normalizeOptionalText(sender?.username);
	if (!senderId && !senderName && !senderUsername) return;
	return {
		...senderId ? { senderId } : {},
		...senderName ? { senderName } : {},
		...senderUsername ? { senderUsername } : {}
	};
}
function readOpenClawMessageMeta(message) {
	const meta = message["__openclaw"];
	return meta && typeof meta === "object" && !Array.isArray(meta) ? meta : void 0;
}
function buildPersistedUserTurnMessage(params) {
	const mediaFields = buildPersistedUserTurnMediaFields(params.media);
	const hasMedia = Boolean(mediaFields.MediaPath);
	const content = normalizeTranscriptText(params.text) || (hasMedia ? params.mediaOnlyText ?? "" : "");
	const senderMeta = buildUserTurnSenderMeta(params.sender);
	const openClawMeta = {
		...params.senderIsOwner === void 0 ? {} : { senderIsOwner: params.senderIsOwner },
		...senderMeta
	};
	return applyInputProvenanceToUserMessage({
		role: "user",
		content,
		timestamp: params.timestamp ?? Date.now(),
		...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
		...mediaFields,
		...Object.keys(openClawMeta).length > 0 ? { __openclaw: openClawMeta } : {}
	}, params.provenance);
}
function resolvePersistedUserTurnMessage(params) {
	if (params.message) return params.message;
	if (!params.input) return;
	return buildPersistedUserTurnMessage(params.input);
}
function isUserMessage(message) {
	return message.role === "user";
}
function buildLateResolvedMediaMessage(params) {
	const admittedMedia = buildPersistedUserTurnMediaInputsFromFields(params.admittedMessage);
	const resolvedMedia = buildPersistedUserTurnMediaInputsFromFields(params.resolvedMessage);
	if (resolvedMedia.length === 0 || JSON.stringify(resolvedMedia) === JSON.stringify(admittedMedia)) return;
	const resolved = params.resolvedMessage;
	const admittedContent = params.admittedMessage?.content;
	const resolvedContent = params.resolvedMessage.content;
	const mediaOnlyText = resolvedMedia.map((media) => media.path ?? media.url).filter((value) => Boolean(value)).map((value) => `[media attached: ${value}]`).join("\n");
	const content = typeof resolvedContent === "string" && resolvedContent === admittedContent ? mediaOnlyText : Array.isArray(resolvedContent) && typeof admittedContent === "string" ? (() => {
		const mediaContent = resolvedContent.filter((block) => !block || typeof block !== "object" || block.type !== "text" || block.text !== admittedContent);
		return mediaContent.length > 0 ? mediaContent : [{
			type: "text",
			text: mediaOnlyText
		}];
	})() : resolvedContent;
	const idempotencyKey = typeof resolved.idempotencyKey === "string" && resolved.idempotencyKey.length > 0 ? `${resolved.idempotencyKey}:late-media` : `late-media:${typeof resolved.timestamp === "number" ? resolved.timestamp : Date.now()}`;
	return {
		...resolved,
		content,
		idempotencyKey
	};
}
function isBeforeAgentRunBlockedMessage(message) {
	return message["__openclaw"]?.beforeAgentRunBlocked !== void 0;
}
function userMessageHasImageContent(message) {
	return isUserMessage(message) && Array.isArray(message.content) && message.content.some((block) => typeof block === "object" && block !== null && block.type === "image");
}
function mergePreparedUserTurnMessageForRuntime(params) {
	if (!params.preparedMessage || !isUserMessage(params.runtimeMessage) || isBeforeAgentRunBlockedMessage(params.runtimeMessage)) return params.runtimeMessage;
	const runtimeMessage = params.runtimeMessage;
	const preparedMessage = params.preparedMessage;
	const runtimeMeta = readOpenClawMessageMeta(params.runtimeMessage);
	const preparedMeta = readOpenClawMessageMeta(params.preparedMessage);
	return {
		...runtimeMessage,
		...preparedMessage,
		...preparedMeta ? { __openclaw: {
			...runtimeMeta,
			...preparedMeta
		} } : {},
		...userMessageHasImageContent(params.runtimeMessage) ? { content: params.runtimeMessage.content } : {}
	};
}
/** Restores only auth state that write hooks must not be able to forge or erase. */
function restorePreparedUserTurnOperationalMetaForRuntime(params) {
	if (!params.preparedMessage || !isUserMessage(params.runtimeMessage)) return params.runtimeMessage;
	const senderIsOwner = readOpenClawMessageMeta(params.preparedMessage)?.senderIsOwner;
	if (typeof senderIsOwner !== "boolean") return params.runtimeMessage;
	return {
		...params.runtimeMessage,
		__openclaw: {
			...readOpenClawMessageMeta(params.runtimeMessage),
			senderIsOwner
		}
	};
}
/** Applies before-message hooks while preserving user-turn transcript metadata. */
function preparePersistedUserTurnMessageForTranscriptWrite(message, params) {
	if (!params.beforeMessageWrite) return message;
	const originalMessage = message;
	const idempotencyKey = typeof originalMessage.idempotencyKey === "string" ? originalMessage.idempotencyKey : void 0;
	const provenance = normalizeInputProvenance(message.provenance);
	const senderIsOwner = readOpenClawMessageMeta(message)?.senderIsOwner;
	const nextMessage = params.beforeMessageWrite({
		message,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.sessionKey ? { sessionKey: params.sessionKey } : {}
	});
	if (nextMessage?.role !== "user") return;
	const nextUserMessage = provenance ? applyInputProvenanceToUserMessage(nextMessage, provenance) : nextMessage;
	if (!idempotencyKey && typeof senderIsOwner !== "boolean") return nextUserMessage;
	return {
		...nextUserMessage,
		...idempotencyKey ? { idempotencyKey } : {},
		...typeof senderIsOwner === "boolean" ? { __openclaw: {
			...readOpenClawMessageMeta(nextUserMessage),
			senderIsOwner
		} } : {}
	};
}
async function appendUserTurnTranscriptMessage(params) {
	const resolvedMessage = resolvePersistedUserTurnMessage(params);
	if (!resolvedMessage) return;
	const appended = (await persistSessionTranscriptTurn({
		sessionFile: params.transcriptPath,
		sessionKey: params.sessionKey ?? "",
		...params.agentId ? { agentId: params.agentId } : {},
		...params.sessionId ? { sessionId: params.sessionId } : {}
	}, {
		...params.cwd ? { cwd: params.cwd } : {},
		...params.config ? { config: params.config } : {},
		updateMode: params.updateMode ?? "inline",
		messages: [{
			message: resolvedMessage,
			idempotencyLookup: "scan",
			prepareMessageAfterIdempotencyCheck: (message) => preparePersistedUserTurnMessageForTranscriptWrite(message, params)
		}]
	})).messages[0];
	if (!appended) return;
	return {
		sessionFile: params.transcriptPath,
		messageId: appended.messageId,
		message: appended.message
	};
}
async function persistUserTurnTranscript(params) {
	const message = resolvePersistedUserTurnMessage(params);
	if (!message) return;
	const turn = await persistSessionTranscriptTurn({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry,
		...params.sessionStore ? { sessionStore: params.sessionStore } : {},
		...params.storePath ? { storePath: params.storePath } : {},
		agentId: params.agentId,
		...params.threadId !== void 0 ? { threadId: params.threadId } : {}
	}, {
		...params.cwd ? { cwd: params.cwd } : {},
		...params.config ? { config: params.config } : {},
		updateMode: params.updateMode ?? "inline",
		messages: [{
			message,
			idempotencyLookup: "scan",
			prepareMessageAfterIdempotencyCheck: (candidate) => preparePersistedUserTurnMessageForTranscriptWrite(candidate, params)
		}]
	});
	const appended = turn.messages[0];
	if (!appended) return;
	return {
		...appended,
		sessionEntry: turn.sessionEntry,
		sessionFile: turn.sessionFile
	};
}
async function appendFileTargetUserTurnTranscript(params) {
	const { config, ...target } = params.target;
	const appended = await appendUserTurnTranscriptMessage({
		...target,
		message: params.message,
		updateMode: params.updateMode,
		...config ? { config } : {},
		...params.beforeMessageWrite ? { beforeMessageWrite: params.beforeMessageWrite } : {}
	});
	return appended ? {
		...appended,
		sessionEntry: void 0
	} : void 0;
}
async function resolveUserTurnTranscriptTarget(target) {
	return typeof target === "function" ? await target() : target;
}
function isUserTurnTranscriptFileTarget(target) {
	return "transcriptPath" in target;
}
function createUserTurnTranscriptRecorder(params) {
	const message = resolvePersistedUserTurnMessage(params);
	let blocked = false;
	let persisted = false;
	let persistedResult;
	let runtimePersistencePromise;
	let selfPersistencePromise;
	let resolvedMessagePromise;
	let persistedMessageNotified = false;
	let runtimePersistedMessage;
	let sentToProvider = false;
	let resolvedBeforeProvider = false;
	const handlePersistenceError = (error) => {
		if (params.onPersistenceError) {
			params.onPersistenceError(error);
			return;
		}
		import("./globals-DRzIcXn1.js").then(({ logVerbose }) => {
			logVerbose(`failed to persist ${params.errorContext ?? "user turn transcript"}: ${String(error)}`);
		}).catch(() => void 0);
	};
	const resolveMessageForPersistence = async () => {
		if (params.message) return params.message;
		if (!params.resolveInput) return message;
		if (!resolvedMessagePromise) resolvedMessagePromise = (async () => {
			try {
				const resolvedInput = await params.resolveInput?.();
				const resolvedMessage = resolvePersistedUserTurnMessage({
					message: params.message,
					input: resolvedInput ?? params.input
				}) ?? message;
				resolvedBeforeProvider = !sentToProvider;
				return resolvedMessage;
			} catch (error) {
				handlePersistenceError(error);
				return message;
			}
		})();
		return await resolvedMessagePromise;
	};
	const notifyMessagePersisted = (persistedMessage) => {
		const notificationMessage = persistedMessage ?? persistedResult?.message ?? message;
		if (!notificationMessage || persistedMessageNotified || !params.onMessagePersisted) return;
		persistedMessageNotified = true;
		try {
			Promise.resolve(params.onMessagePersisted(notificationMessage)).catch(handlePersistenceError);
		} catch (error) {
			handlePersistenceError(error);
		}
	};
	const waitForRuntimePersistence = async () => {
		if (!runtimePersistencePromise) return;
		try {
			await runtimePersistencePromise;
		} catch (error) {
			handlePersistenceError(error);
		}
	};
	const persistPrepared = async (options) => {
		if (options.skipWhenBlocked && blocked) return;
		if (!message && !params.resolveInput) return;
		if (options.waitForRuntime) await waitForRuntimePersistence();
		if (selfPersistencePromise) return await selfPersistencePromise;
		selfPersistencePromise = (async () => {
			const resolvedMessage = await resolveMessageForPersistence();
			if (!resolvedMessage) return;
			const target = await resolveUserTurnTranscriptTarget(options.target ?? params.target);
			if (!target) return;
			const updateMode = options.updateMode ?? params.updateMode ?? "inline";
			const persistMessage = async (candidate, candidateUpdateMode) => isUserTurnTranscriptFileTarget(target) ? await appendFileTargetUserTurnTranscript({
				target,
				message: candidate,
				updateMode: candidateUpdateMode,
				beforeMessageWrite: params.beforeMessageWrite
			}) : await persistUserTurnTranscript({
				...target,
				message: candidate,
				updateMode: candidateUpdateMode,
				...params.beforeMessageWrite ? { beforeMessageWrite: params.beforeMessageWrite } : {}
			});
			const lateMediaMessage = sentToProvider && !resolvedBeforeProvider ? buildLateResolvedMediaMessage({
				admittedMessage: runtimePersistedMessage ?? message,
				resolvedMessage
			}) : void 0;
			if (lateMediaMessage) {
				if (!persisted && message) {
					const admittedResult = await persistMessage(message, updateMode);
					if (admittedResult) {
						persisted = true;
						persistedResult = admittedResult;
						notifyMessagePersisted(admittedResult.message);
					}
				}
				const appendedMedia = await persistMessage(lateMediaMessage, "none");
				if (appendedMedia) {
					persisted = true;
					persistedResult = appendedMedia;
				}
				return appendedMedia;
			}
			if (persisted) return persistedResult;
			const result = await persistMessage(resolvedMessage, updateMode);
			if (result) {
				persisted = true;
				persistedResult = result;
				notifyMessagePersisted(result.message);
			}
			return result;
		})();
		try {
			return await selfPersistencePromise;
		} catch (error) {
			handlePersistenceError(error);
			throw error;
		}
	};
	return {
		message,
		resolveMessage: resolveMessageForPersistence,
		markSentToProvider: () => {
			sentToProvider = true;
		},
		markRuntimePersistencePending: (pending) => {
			runtimePersistencePromise = pending;
		},
		markRuntimePersisted: (persistedMessage) => {
			persisted = true;
			runtimePersistedMessage = persistedMessage;
			if (persistedMessage && persistedResult) persistedResult = {
				...persistedResult,
				message: persistedMessage
			};
			notifyMessagePersisted(persistedMessage);
		},
		markBlocked: () => {
			blocked = true;
		},
		hasPersisted: () => persisted,
		isBlocked: () => blocked,
		hasRuntimePersistencePending: () => runtimePersistencePromise !== void 0,
		waitForRuntimePersistence,
		persistApproved: async (options) => await persistPrepared({
			waitForRuntime: false,
			skipWhenBlocked: true,
			target: options?.target,
			updateMode: options?.updateMode
		}),
		persistFallback: async (options) => await persistPrepared({
			waitForRuntime: true,
			skipWhenBlocked: true,
			target: options?.target,
			updateMode: options?.updateMode
		})
	};
}
//#endregion
export { preparePersistedUserTurnMessageForTranscriptWrite as a, mergePreparedUserTurnMessageForRuntime as i, buildPersistedUserTurnMessage as n, resolvePersistedUserTurnText as o, createUserTurnTranscriptRecorder as r, restorePreparedUserTurnOperationalMetaForRuntime as s, buildPersistedUserTurnMediaInputsFromFields as t };
