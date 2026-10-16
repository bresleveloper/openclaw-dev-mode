import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as asFiniteNumberInRange, d as asPositiveSafeInteger } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as mimeTypeFromFilePath } from "./mime-CGDYrRzL.mjs";
import { d as readPersistedMediaFacts } from "./media-facts-CJdQ4R61.mjs";
import { r as buildPersistedUserTurnMetadata } from "./user-turn-transcript.metadata-CNurmdgT.mjs";
import { o as applyInputProvenanceToUserMessage } from "./input-provenance-D1LHo5Qj.mjs";
import path from "node:path";
//#region src/sessions/user-turn-transcript.message.ts
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
function isStructuredMediaKind(kind) {
	return kind !== void 0 && STRUCTURED_MEDIA_KINDS.has(kind);
}
function resolveTranscriptMediaPath(pathValue, workspaceDir) {
	if (!workspaceDir || path.isAbsolute(pathValue) || URL_LIKE_MEDIA_PATH_PATTERN.test(pathValue)) return pathValue;
	return path.join(workspaceDir, pathValue);
}
function normalizeStructuredMediaEntryForTranscript(media) {
	const workspaceDir = normalizeOptionalString(media.workspaceDir);
	const mediaPath = normalizeOptionalString(media.path);
	const mediaUrl = normalizeOptionalString(media.url);
	const legacyKind = normalizeOptionalString(media.kind);
	const kind = isStructuredMediaKind(legacyKind) ? legacyKind : void 0;
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
function resolvePersistedUserTurnText(value) {
	return normalizeOptionalString(value);
}
function buildPersistedUserTurnMediaInputsFromFields(fields) {
	const normalizedMedia = (fields ? readPersistedMediaFacts(fields) ?? [] : []).map((fact) => {
		const mediaPath = fact.path ? resolveTranscriptMediaPath(fact.path, fact.workspaceDir) : void 0;
		const url = fact.url;
		if (!mediaPath && !url) return {};
		const media = { contentType: fact.contentType ?? mimeTypeFromFilePath(mediaPath ?? url) };
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
function readModelPromptProjection(message) {
	if (!isUserMessage(message)) return;
	const metadata = readOpenClawMessageMeta(message);
	if (!metadata || !Object.hasOwn(metadata, "modelPromptProjection")) return;
	const projection = asOptionalRecord(metadata.modelPromptProjection);
	if (projection?.version !== 1 || typeof projection.text !== "string") throw new Error("Unsupported or invalid user-turn model prompt projection; update OpenClaw to a compatible version or start a new session.");
	return projection.text;
}
function projectRecordedModelPrompt(message, transcript) {
	if (!isUserMessage(message)) return message;
	const text = readModelPromptProjection(transcript) ?? readModelPromptProjection(message);
	if (text === void 0) return message;
	let content = message.content;
	if (Array.isArray(content)) {
		let replaced = false;
		content = content.map((block) => {
			if (block.type !== "text" || replaced) return block;
			replaced = true;
			return {
				...block,
				text
			};
		});
		if (!replaced) content = [{
			type: "text",
			text
		}, ...content];
	} else content = text;
	const metadata = { ...message["__openclaw"] };
	delete metadata.modelPromptProjection;
	const projected = {
		...message,
		content,
		timestamp: transcript?.role === "user" ? transcript.timestamp : message.timestamp
	};
	delete projected["__openclaw"];
	if (Object.keys(metadata).length > 0) projected["__openclaw"] = metadata;
	return projected;
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
	delete metadata.modelPromptProjection;
	return {
		...params.resolvedMessage,
		content,
		idempotencyKey,
		__openclaw: metadata
	};
}
function mergePreparedUserTurnMessageForRuntime(params) {
	if (!params.preparedMessage || !isUserMessage(params.runtimeMessage) || readOpenClawMessageMeta(params.runtimeMessage)?.beforeAgentRunBlocked !== void 0) return params.runtimeMessage;
	const runtimeMeta = readOpenClawMessageMeta(params.runtimeMessage);
	const preparedMeta = readOpenClawMessageMeta(params.preparedMessage);
	return {
		...params.runtimeMessage,
		...params.preparedMessage,
		...preparedMeta ? { __openclaw: {
			...runtimeMeta,
			...preparedMeta
		} } : {},
		...Array.isArray(params.runtimeMessage.content) && params.runtimeMessage.content.some((block) => asOptionalRecord(block)?.type === "image") ? { content: params.runtimeMessage.content } : {}
	};
}
//#endregion
export { isUserMessage as a, readModelPromptProjection as c, buildPersistedUserTurnMessage as i, resolvePersistedUserTurnMessage as l, buildLateResolvedMediaMessage as n, mergePreparedUserTurnMessageForRuntime as o, buildPersistedUserTurnMediaInputsFromFields as r, projectRecordedModelPrompt as s, buildLateMediaAttachedProjection as t, resolvePersistedUserTurnText as u };
