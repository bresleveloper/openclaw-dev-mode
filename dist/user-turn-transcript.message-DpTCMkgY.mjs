import { c as asFiniteNumberInRange, d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
import { d as readPersistedMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import { o as applyInputProvenanceToUserMessage } from "./input-provenance-C4tQegGN.mjs";
import { r as buildPersistedUserTurnMetadata } from "./user-turn-transcript.metadata-BY4PdwgQ.mjs";
import path from "node:path";
//#region src/sessions/user-turn-transcript.media-normalize.ts
const URL_LIKE_MEDIA_PATH_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
const STRUCTURED_MEDIA_KINDS = /* @__PURE__ */ new Set([
	"image",
	"audio",
	"video",
	"document",
	"sticker",
	"unknown"
]);
const MIME_TYPE_PATTERN = /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/iu;
function normalizeStructuredMediaKind(value) {
	const kind = normalizeOptionalString(value);
	return kind && STRUCTURED_MEDIA_KINDS.has(kind) ? kind : void 0;
}
function resolveTranscriptMediaPath(pathValue, workspaceDir) {
	if (!workspaceDir || path.isAbsolute(pathValue) || URL_LIKE_MEDIA_PATH_PATTERN.test(pathValue)) return pathValue;
	return path.join(workspaceDir, pathValue);
}
function normalizeStructuredMediaEntryForTranscript(media) {
	const workspaceDir = normalizeOptionalString(media.workspaceDir);
	const mediaPath = normalizeOptionalString(media.path);
	const mediaUrl = normalizeOptionalString(media.url);
	const kind = normalizeStructuredMediaKind(media.kind);
	const legacyKind = normalizeOptionalString(media.kind);
	const messageId = normalizeOptionalString(media.messageId);
	const contentType = normalizeOptionalString(media.contentType) ?? (kind || !legacyKind || !MIME_TYPE_PATTERN.test(legacyKind) ? void 0 : legacyKind) ?? mimeTypeFromFilePath(mediaPath ?? mediaUrl);
	const durationMs = asPositiveSafeInteger(media.durationMs);
	const width = asPositiveSafeInteger(media.width);
	const height = asPositiveSafeInteger(media.height);
	const fileName = normalizeOptionalString(media.fileName);
	const sizeBytes = asFiniteNumberInRange(media.sizeBytes, { min: 0 });
	return {
		...mediaPath ? { path: resolveTranscriptMediaPath(mediaPath, workspaceDir) } : {},
		...mediaUrl ? { url: mediaUrl } : {},
		...contentType ? { contentType } : {},
		...kind ? { kind } : {},
		...fileName ? { fileName } : {},
		...media.origin === "paste" || media.origin === "file" ? { origin: media.origin } : {},
		...sizeBytes !== void 0 ? { sizeBytes } : {},
		...durationMs ? { durationMs } : {},
		...width ? { width } : {},
		...height ? { height } : {},
		...media.transcribed === true ? { transcribed: true } : {},
		...messageId ? { messageId } : {},
		...workspaceDir ? { workspaceDir } : {},
		...media.hydrationSuppressed === true ? { hydrationSuppressed: true } : {}
	};
}
//#endregion
//#region src/sessions/user-turn-transcript.message.ts
function resolvePersistedUserTurnText(value) {
	return normalizeOptionalString(value);
}
function resolveTranscriptMediaType(params) {
	return params.explicitType ?? mimeTypeFromFilePath(params.mediaPath ?? params.mediaUrl);
}
function buildPersistedUserTurnMediaInputsFromFields(fields) {
	const normalizedMedia = (fields ? readPersistedMediaFacts(fields) ?? [] : []).map((fact) => {
		const rawPath = normalizeOptionalString(fact.path);
		const mediaPath = rawPath ? resolveTranscriptMediaPath(rawPath, normalizeOptionalString(fact.workspaceDir)) : void 0;
		const url = normalizeOptionalString(fact.url);
		if (!mediaPath && !url) return {};
		const media = { contentType: resolveTranscriptMediaType({
			explicitType: normalizeOptionalString(fact.contentType),
			mediaPath,
			mediaUrl: url
		}) };
		if (mediaPath) media.path = mediaPath;
		if (url) media.url = url;
		if (fact.kind) media.kind = fact.kind;
		if (fact.fileName) media.fileName = fact.fileName;
		if (fact.origin) media.origin = fact.origin;
		if (fact.sizeBytes !== void 0) media.sizeBytes = fact.sizeBytes;
		if (fact.durationMs !== void 0) media.durationMs = fact.durationMs;
		if (fact.width !== void 0) media.width = fact.width;
		if (fact.height !== void 0) media.height = fact.height;
		return media;
	});
	return normalizedMedia.some((entry) => entry.path || entry.url) ? normalizedMedia : [];
}
function buildLateMediaAttachedProjection(message) {
	const media = readOpenClawMessageMeta(message)?.lateMedia === true ? readPersistedMediaFacts(message) ?? [] : [];
	const text = media.flatMap((fact) => {
		const mediaRef = fact.path ?? fact.url;
		return mediaRef ? [`[media attached: ${mediaRef}]`] : [];
	}).join("\n");
	return {
		...text ? { text } : {},
		media
	};
}
function readOpenClawMessageMeta(message) {
	return asOptionalRecord(Reflect.get(message, "__openclaw"));
}
function buildPersistedUserTurnMessage(params) {
	const normalizedMedia = (params.media ?? []).map(normalizeStructuredMediaEntryForTranscript);
	const text = params.text ?? "";
	const openClawMeta = buildPersistedUserTurnMetadata(params, normalizedMedia);
	const message = {
		role: "user",
		...params.display === false ? { display: false } : {},
		...params.excludeFromContext ? { excludeFromContext: true } : {},
		content: text,
		timestamp: params.timestamp ?? Date.now(),
		...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
		...Object.keys(openClawMeta).length > 0 ? { __openclaw: openClawMeta } : {}
	};
	return applyInputProvenanceToUserMessage(message, params.provenance);
}
function resolvePersistedUserTurnMessage(params) {
	return params.message ?? (params.input ? buildPersistedUserTurnMessage(params.input) : void 0);
}
function isUserMessage(message) {
	return asOptionalRecord(message)?.role === "user";
}
function buildLateResolvedMediaMessage(params) {
	const admittedMedia = buildPersistedUserTurnMediaInputsFromFields(params.admittedMessage);
	const resolvedMedia = buildPersistedUserTurnMediaInputsFromFields(params.resolvedMessage);
	if (resolvedMedia.length === 0 || JSON.stringify(resolvedMedia) === JSON.stringify(admittedMedia)) return;
	const resolvedIdempotencyKey = Reflect.get(params.resolvedMessage, "idempotencyKey");
	const resolvedTimestamp = Reflect.get(params.resolvedMessage, "timestamp");
	const admittedContent = params.admittedMessage?.content;
	const resolvedContent = params.resolvedMessage.content;
	let content = resolvedContent;
	if (resolvedContent === admittedContent) content = "";
	else if (Array.isArray(resolvedContent) && typeof admittedContent === "string") content = resolvedContent.filter((block) => {
		const textBlock = asOptionalRecord(block);
		return textBlock?.type !== "text" || textBlock.text !== admittedContent;
	});
	const idempotencyKey = typeof resolvedIdempotencyKey === "string" && resolvedIdempotencyKey.length > 0 ? `${resolvedIdempotencyKey}:late-media` : `late-media:${typeof resolvedTimestamp === "number" ? resolvedTimestamp : Date.now()}`;
	const metadata = {
		...readOpenClawMessageMeta(params.resolvedMessage),
		lateMedia: true
	};
	delete metadata.humanMentions;
	return {
		...params.resolvedMessage,
		content,
		idempotencyKey,
		__openclaw: metadata
	};
}
function isBeforeAgentRunBlockedMessage(message) {
	return readOpenClawMessageMeta(message)?.beforeAgentRunBlocked !== void 0;
}
function userMessageHasImageContent(message) {
	return isUserMessage(message) && Array.isArray(message.content) && message.content.some((block) => asOptionalRecord(block)?.type === "image");
}
function mergePreparedUserTurnMessageForRuntime(params) {
	if (!params.preparedMessage || !isUserMessage(params.runtimeMessage) || isBeforeAgentRunBlockedMessage(params.runtimeMessage)) return params.runtimeMessage;
	const runtimeMeta = readOpenClawMessageMeta(params.runtimeMessage);
	const preparedMeta = readOpenClawMessageMeta(params.preparedMessage);
	return {
		...params.runtimeMessage,
		...params.preparedMessage,
		...preparedMeta ? { __openclaw: {
			...runtimeMeta,
			...preparedMeta
		} } : {},
		...userMessageHasImageContent(params.runtimeMessage) ? { content: params.runtimeMessage.content } : {}
	};
}
//#endregion
export { isUserMessage as a, resolvePersistedUserTurnText as c, buildPersistedUserTurnMessage as i, buildLateResolvedMediaMessage as n, mergePreparedUserTurnMessageForRuntime as o, buildPersistedUserTurnMediaInputsFromFields as r, resolvePersistedUserTurnMessage as s, buildLateMediaAttachedProjection as t };
