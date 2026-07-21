import { v as readStringOrNumberParam, y as readStringParam } from "./common-DWyiui3y.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { t as readBooleanParam } from "./boolean-param-AuSHeYDH.js";
import { r as resolveReactionMessageId } from "./channel-actions-BCdRlnH7.js";
import { a as resolveWhatsAppAccount, s as resolveWhatsAppMediaMaxBytes } from "./accounts-CTXNcJZ8.js";
import { c as normalizeWhatsAppTarget, t as isWhatsAppGroupJid } from "./normalize-target-CBY3N6Mg.js";
import { r as resolveAuthorizedWhatsAppOutboundTarget, t as handleWhatsAppAction } from "./action-runtime-CXbvezXq.js";
import "./normalize-CcFHT6pX.js";
import { t as sendMessageWhatsApp } from "./send-C3-IeYKy.js";
//#region extensions/whatsapp/src/channel-react-action.ts
const WHATSAPP_CHANNEL = "whatsapp";
function readUploadFileMediaSource(args) {
	return readStringParam(args, "media", { trim: false }) ?? readStringParam(args, "mediaUrl", { trim: false }) ?? readStringParam(args, "filePath", { trim: false }) ?? readStringParam(args, "path", { trim: false }) ?? readStringParam(args, "fileUrl", { trim: false });
}
function readUploadFileCaptionText(args) {
	return readStringParam(args, "message", { allowEmpty: true }) ?? readStringParam(args, "content", { allowEmpty: true }) ?? readStringParam(args, "caption", { allowEmpty: true }) ?? "";
}
function hasUploadFileBufferPayload(args) {
	return readStringParam(args, "buffer", { trim: false }) !== void 0;
}
function readWhatsAppActionChatJid(params) {
	const explicit = readStringParam(params.params, "chatJid") ?? readStringParam(params.params, "to");
	if (explicit) return explicit;
	if (params.toolContext?.currentChannelProvider !== WHATSAPP_CHANNEL || !params.toolContext.currentChannelId) return;
	return normalizeWhatsAppTarget(params.toolContext.currentChannelId) ?? void 0;
}
function extractBase64Payload(encoded) {
	const match = /^data:[^;]+;base64,(.*)$/i.exec(encoded.trim());
	return match ? match[1] : encoded;
}
function estimateBase64DecodedBytes(encoded) {
	const compact = extractBase64Payload(encoded).replace(/\s/g, "");
	if (!compact) return 0;
	const padding = compact.endsWith("==") ? 2 : compact.endsWith("=") ? 1 : 0;
	return Math.max(0, Math.floor(compact.length * 3 / 4) - padding);
}
function decodeUploadFileMediaPayload(params) {
	if (params.maxBytes !== void 0) {
		const estimatedBytes = estimateBase64DecodedBytes(params.encoded);
		if (estimatedBytes > params.maxBytes) throw new Error(`WhatsApp upload-file buffer exceeds configured media limit (${estimatedBytes} bytes > ${params.maxBytes} bytes).`);
	}
	const contentType = readStringParam(params.args, "contentType") ?? readStringParam(params.args, "mimeType");
	const fileName = readStringParam(params.args, "filename") ?? readStringParam(params.args, "fileName");
	const buffer = Buffer.from(extractBase64Payload(params.encoded), "base64");
	if (params.maxBytes !== void 0 && buffer.byteLength > params.maxBytes) throw new Error(`WhatsApp upload-file buffer exceeds configured media limit (${buffer.byteLength} bytes > ${params.maxBytes} bytes).`);
	return {
		buffer,
		...contentType ? { contentType } : {},
		...fileName ? { fileName } : {}
	};
}
async function handleWhatsAppUploadFileAction(params) {
	const mediaUrl = readUploadFileMediaSource(params.params);
	const encodedPayload = readStringParam(params.params, "buffer", { trim: false });
	if (!mediaUrl && !hasUploadFileBufferPayload(params.params)) throw new Error("WhatsApp upload-file requires media, mediaUrl, filePath, path, fileUrl, or buffer.");
	const to = readWhatsAppActionChatJid(params) ?? readStringParam(params.params, "to", { required: true });
	const resolved = resolveAuthorizedWhatsAppOutboundTarget({
		cfg: params.cfg,
		chatJid: to,
		accountId: params.accountId ?? void 0,
		actionLabel: "upload-file"
	});
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: resolved.accountId
	});
	const mediaPayload = encodedPayload ? decodeUploadFileMediaPayload({
		args: params.params,
		encoded: encodedPayload,
		maxBytes: resolveWhatsAppMediaMaxBytes(account)
	}) : void 0;
	const result = await sendMessageWhatsApp(resolved.to, readUploadFileCaptionText(params.params), {
		verbose: false,
		cfg: params.cfg,
		...mediaUrl && !mediaPayload ? { mediaUrl } : {},
		...mediaPayload ? { mediaPayload } : {},
		mediaAccess: params.mediaAccess,
		mediaLocalRoots: params.mediaLocalRoots,
		mediaReadFile: params.mediaReadFile,
		gifPlayback: readBooleanParam(params.params, "gifPlayback") ?? void 0,
		audioAsVoice: readBooleanParam(params.params, "asVoice") ?? readBooleanParam(params.params, "audioAsVoice") ?? void 0,
		forceDocument: readBooleanParam(params.params, "forceDocument") ?? readBooleanParam(params.params, "asDocument") ?? void 0,
		accountId: resolved.accountId
	});
	return jsonResult({
		ok: true,
		channel: WHATSAPP_CHANNEL,
		action: "upload-file",
		messageId: result.messageId,
		toJid: result.toJid
	});
}
async function handleWhatsAppMessageAction(params) {
	if (params.action === "upload-file") return await handleWhatsAppUploadFileAction(params);
	if (params.action !== "react") throw new Error(`Action ${params.action} is not supported for provider ${WHATSAPP_CHANNEL}.`);
	const isWhatsAppSource = params.toolContext?.currentChannelProvider === WHATSAPP_CHANNEL;
	const explicitTarget = readWhatsAppActionChatJid(params);
	const normalizedTarget = explicitTarget ? normalizeWhatsAppTarget(explicitTarget) : null;
	const normalizedCurrent = isWhatsAppSource && params.toolContext?.currentChannelId ? normalizeWhatsAppTarget(params.toolContext.currentChannelId) : null;
	const isCrossChat = normalizedTarget != null && (normalizedCurrent == null || normalizedTarget !== normalizedCurrent);
	const scopedContext = !isWhatsAppSource || isCrossChat || !params.toolContext ? void 0 : {
		currentChannelId: params.toolContext.currentChannelId ?? void 0,
		currentChannelProvider: params.toolContext.currentChannelProvider ?? void 0,
		currentMessageId: params.toolContext.currentMessageId ?? void 0
	};
	const messageIdRaw = resolveReactionMessageId({
		args: params.params,
		toolContext: scopedContext
	});
	if (messageIdRaw == null) readStringParam(params.params, "messageId", { required: true });
	const messageId = String(messageIdRaw);
	const explicitMessageId = readStringOrNumberParam(params.params, "messageId");
	const emoji = readStringParam(params.params, "emoji", { allowEmpty: true });
	const remove = typeof params.params.remove === "boolean" ? params.params.remove : void 0;
	const explicitParticipant = readStringParam(params.params, "participant");
	const inferredParticipant = explicitParticipant || explicitMessageId != null || !isWhatsAppSource || isCrossChat || !isWhatsAppGroupJid(explicitTarget ?? params.toolContext?.currentChannelId ?? "") ? void 0 : typeof params.requesterSenderId === "string" && params.requesterSenderId.trim().length > 0 ? params.requesterSenderId.trim() : void 0;
	return await handleWhatsAppAction({
		action: "react",
		chatJid: readWhatsAppActionChatJid(params) ?? readStringParam(params.params, "to", { required: true }),
		messageId,
		emoji,
		remove,
		participant: explicitParticipant ?? inferredParticipant,
		accountId: params.accountId ?? void 0,
		fromMe: typeof params.params.fromMe === "boolean" ? params.params.fromMe : void 0
	}, params.cfg);
}
//#endregion
export { handleWhatsAppMessageAction };
