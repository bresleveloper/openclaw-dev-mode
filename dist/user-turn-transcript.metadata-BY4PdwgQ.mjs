import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as SessionParticipantIdentitySchema } from "./session-participant-Cj8YyLga.mjs";
import { h as normalizeInputProvenance } from "./input-provenance-C4tQegGN.mjs";
import { isDeepStrictEqual } from "node:util";
import { Check } from "typebox/schema";
//#region src/chat/sender-identity.ts
/** Transcript attribution uses the closed product vocabulary, never raw-id inference. */
function readTranscriptSenderIdentity(value) {
	if (typeof value !== "object" || value === null || !Check(SessionParticipantIdentitySchema, value) || value.type !== "profile" && value.type !== "remote" && value.type !== "observation" || Object.values(value).some((part) => part !== null && (!part.trim() || part.length > 512))) return;
	return { ...value };
}
//#endregion
//#region src/sessions/user-turn-transcript.metadata.ts
const REPLY_PREVIEW_TEXT_MAX_CHARS = 2e3;
const REPLY_PREVIEW_SENDER_MAX_CHARS = 200;
const STEER_TARGET_RUN_ID_MAX_CHARS = 512;
function buildRunUserTurnIdempotencyKey(runId) {
	return `${runId}:user`;
}
function normalizePersistedSteerTargetRunId(value) {
	const normalized = normalizeOptionalString(value);
	return normalized && normalized.length <= STEER_TARGET_RUN_ID_MAX_CHARS ? normalized : void 0;
}
/** Channel source facts qualify an observation, never an authenticated Gateway profile. */
function buildChannelUserTurnSender(ctx) {
	const id = normalizeOptionalString(ctx.SenderId);
	return {
		id,
		name: normalizeOptionalString(ctx.SenderName),
		username: normalizeOptionalString(ctx.SenderUsername),
		...id ? { identity: {
			type: "observation",
			id,
			pluginId: normalizeOptionalString(ctx.Provider ?? ctx.Surface) ?? null,
			accountId: normalizeOptionalString(ctx.AccountId) ?? null,
			senderKind: ctx.SenderIsBot === true ? "bot" : ctx.SenderIsBot === false ? "human" : "unknown"
		} } : {}
	};
}
function buildPersistedUserTurnMetadata(input, normalizedMedia) {
	const senderId = normalizeOptionalString(input.sender?.id);
	const senderName = normalizeOptionalString(input.sender?.name);
	const senderUsername = normalizeOptionalString(input.sender?.username);
	const senderIdentity = input.display !== false && (!input.provenance || input.provenance.kind === "external_user") ? readTranscriptSenderIdentity(input.sender?.identity) : void 0;
	const replyToId = normalizeOptionalString(input.replyToId);
	const replyPreviewText = normalizeOptionalString(input.replyToPreview?.text);
	const replyPreviewSender = normalizeOptionalString(input.replyToPreview?.senderLabel);
	return {
		...input.senderIsOwner === void 0 ? {} : { senderIsOwner: input.senderIsOwner && (!input.provenance || input.provenance.kind === "external_user") },
		...senderId ? { senderId } : {},
		...senderName ? { senderName } : {},
		...senderUsername ? { senderUsername } : {},
		...senderIdentity && senderIdentity.id === senderId ? { senderIdentity } : {},
		...input.workContext ? { workContext: structuredClone(input.workContext) } : {},
		...input.mentions?.length ? { humanMentions: input.mentions.map((mention) => ({ ...mention })) } : {},
		...replyToId ? { replyToId } : {},
		...replyPreviewText ? { replyToPreview: {
			text: truncateUtf16Safe(replyPreviewText, REPLY_PREVIEW_TEXT_MAX_CHARS),
			...replyPreviewSender ? { senderLabel: truncateUtf16Safe(replyPreviewSender, REPLY_PREVIEW_SENDER_MAX_CHARS) } : {}
		} } : {},
		...input.transport ? { transport: structuredClone(input.transport) } : {},
		...normalizedMedia.length > 0 ? { media: normalizedMedia } : {},
		...input.mediaImageLayout ? { mediaImageLayout: {
			slots: input.mediaImageLayout.slots.map((slot) => ({ ...slot })),
			...input.mediaImageLayout.suppressedFactIndexes?.length ? { suppressedFactIndexes: [...input.mediaImageLayout.suppressedFactIndexes] } : {}
		} } : {}
	};
}
function rewritePersistedSteerTargetRunId(message, targetRunId) {
	if (!message || targetRunId === void 0) return message;
	const metadata = { ...message["__openclaw"] };
	delete metadata.steerTargetRunId;
	if (targetRunId) metadata.steerTargetRunId = targetRunId;
	const nextMessage = { ...message };
	delete nextMessage["__openclaw"];
	if (Object.keys(metadata).length > 0) nextMessage["__openclaw"] = metadata;
	return nextMessage;
}
/**
* Runtime hooks may rewrite roles and redact display/transport fields. Restore only
* operational facts here; canonical admission preparation deliberately protects more.
*/
function restorePreparedUserTurnOperationalMetaForRuntime(params) {
	if (!params.preparedMessage || params.runtimeMessage.role !== "user") return params.runtimeMessage;
	const preparedMeta = params.preparedMessage["__openclaw"];
	const senderIsOwner = preparedMeta?.senderIsOwner;
	const steerTargetRunId = normalizePersistedSteerTargetRunId(preparedMeta?.steerTargetRunId);
	const nextMessage = { ...params.runtimeMessage };
	const provenance = normalizeInputProvenance(Reflect.get(params.preparedMessage, "provenance"));
	if (provenance) Object.assign(nextMessage, { provenance });
	if (params.preparedMessage.display === false) nextMessage.display = false;
	const runtimeMeta = { ...nextMessage["__openclaw"] };
	delete runtimeMeta.intent;
	if (preparedMeta?.intent) runtimeMeta.intent = preparedMeta.intent;
	delete runtimeMeta.steerTargetRunId;
	if (steerTargetRunId) runtimeMeta.steerTargetRunId = steerTargetRunId;
	if (typeof senderIsOwner === "boolean") runtimeMeta.senderIsOwner = senderIsOwner;
	if (!isDeepStrictEqual(params.runtimeMessage.content, params.preparedMessage.content)) delete runtimeMeta.workContext;
	delete runtimeMeta.humanMentions;
	if (preparedMeta?.humanMentions !== void 0 && isDeepStrictEqual(params.runtimeMessage.content, params.preparedMessage.content)) runtimeMeta.humanMentions = preparedMeta.humanMentions;
	delete nextMessage["__openclaw"];
	if (Object.keys(runtimeMeta).length > 0) nextMessage["__openclaw"] = runtimeMeta;
	return nextMessage;
}
/** Snapshots producer evidence before hooks can replace or mutate the message. */
function applyTranscriptSenderIdentityToWrite(message, write) {
	const original = asOptionalRecord(Reflect.get(message, "__openclaw"));
	const identity = message.role === "user" ? readTranscriptSenderIdentity(original?.senderIdentity) : void 0;
	const senderId = original?.senderId;
	const next = write();
	const metadata = next && asOptionalRecord(Reflect.get(next, "__openclaw"));
	if (!metadata || !Object.hasOwn(metadata, "senderIdentity")) return next;
	if (next.role === "user" && identity && metadata.senderId === senderId && isDeepStrictEqual(readTranscriptSenderIdentity(metadata.senderIdentity), identity)) return next;
	const redacted = { ...metadata };
	delete redacted.senderIdentity;
	return Object.assign({ ...next }, { __openclaw: redacted });
}
/** Applies before-message hooks while preserving user-turn transcript metadata. */
function preparePersistedUserTurnMessageForTranscriptWrite(message, params) {
	if (!params.beforeMessageWrite) return message;
	const originalIdempotencyKey = Reflect.get(message, "idempotencyKey");
	const idempotencyKey = typeof originalIdempotencyKey === "string" ? originalIdempotencyKey : void 0;
	const provenance = normalizeInputProvenance(Reflect.get(message, "provenance"));
	const originalMeta = message["__openclaw"];
	const originalContent = originalMeta?.humanMentions === void 0 && originalMeta?.workContext === void 0 ? void 0 : structuredClone(message.content);
	const workContext = originalMeta?.workContext === void 0 ? void 0 : structuredClone(originalMeta.workContext);
	const humanMentions = originalMeta?.humanMentions === void 0 ? void 0 : structuredClone(originalMeta.humanMentions);
	const display = message.display;
	const intent = originalMeta?.intent === void 0 ? void 0 : structuredClone(originalMeta.intent);
	const senderIsOwner = originalMeta?.senderIsOwner;
	const replyToId = normalizeOptionalString(originalMeta?.replyToId);
	const originalReplyPreview = asOptionalRecord(originalMeta?.replyToPreview);
	const replyPreviewText = normalizeOptionalString(originalReplyPreview?.text);
	const replyPreviewSender = normalizeOptionalString(originalReplyPreview?.senderLabel);
	const replyToPreview = replyPreviewText ? {
		text: replyPreviewText,
		...replyPreviewSender ? { senderLabel: replyPreviewSender } : {}
	} : void 0;
	const originalTransport = originalMeta?.transport;
	const steerTargetRunId = normalizePersistedSteerTargetRunId(originalMeta?.steerTargetRunId);
	const lateMedia = originalMeta?.lateMedia === true;
	const originalMedia = originalMeta?.media;
	const media = Array.isArray(originalMedia) ? structuredClone(originalMedia) : void 0;
	const originalMediaImageLayout = originalMeta?.mediaImageLayout;
	const mediaImageLayout = originalMediaImageLayout === void 0 ? void 0 : structuredClone(originalMediaImageLayout);
	const originalTransportRecord = asOptionalRecord(originalTransport);
	const transport = originalTransportRecord ? structuredClone(originalTransportRecord) : void 0;
	const nextMessage = applyTranscriptSenderIdentityToWrite(message, () => params.beforeMessageWrite({
		message,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.sessionKey ? { sessionKey: params.sessionKey } : {}
	}));
	if (nextMessage?.role !== "user") return;
	const nextUserMessage = {
		...nextMessage,
		...provenance ? { provenance } : {}
	};
	const protectedMeta = {
		...nextUserMessage["__openclaw"],
		...typeof senderIsOwner === "boolean" ? { senderIsOwner } : {},
		...replyToId ? { replyToId } : {},
		...replyToPreview ? { replyToPreview } : {},
		...transport ? { transport } : {},
		...lateMedia ? { lateMedia: true } : {},
		...media === void 0 ? {} : { media },
		...mediaImageLayout === void 0 ? {} : { mediaImageLayout },
		...intent === void 0 ? {} : { intent }
	};
	if (intent === void 0) delete protectedMeta.intent;
	delete protectedMeta.workContext;
	if (workContext !== void 0 && isDeepStrictEqual(nextUserMessage.content, originalContent)) protectedMeta.workContext = workContext;
	delete protectedMeta.humanMentions;
	if (humanMentions !== void 0 && isDeepStrictEqual(nextUserMessage.content, originalContent)) protectedMeta.humanMentions = humanMentions;
	delete protectedMeta.steerTargetRunId;
	if (steerTargetRunId) protectedMeta.steerTargetRunId = steerTargetRunId;
	const protectedMessage = {
		...nextUserMessage,
		...display === false ? { display: false } : {},
		...idempotencyKey ? { idempotencyKey } : {}
	};
	delete protectedMessage["__openclaw"];
	if (Object.keys(protectedMeta).length > 0) protectedMessage["__openclaw"] = protectedMeta;
	return protectedMessage;
}
//#endregion
export { normalizePersistedSteerTargetRunId as a, rewritePersistedSteerTargetRunId as c, buildRunUserTurnIdempotencyKey as i, readTranscriptSenderIdentity as l, buildChannelUserTurnSender as n, preparePersistedUserTurnMessageForTranscriptWrite as o, buildPersistedUserTurnMetadata as r, restorePreparedUserTurnOperationalMetaForRuntime as s, applyTranscriptSenderIdentityToWrite as t };
