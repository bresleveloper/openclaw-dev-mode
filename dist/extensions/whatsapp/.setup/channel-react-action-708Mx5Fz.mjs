import { a as resolveWhatsAppAccount, s as resolveWhatsAppMediaMaxBytes } from "./accounts-Czb9k6cU.mjs";
import { c as normalizeWhatsAppTarget, t as isWhatsAppGroupJid } from "./normalize-target-DouOWumF.mjs";
import { r as resolveAuthorizedWhatsAppOutboundTarget, t as handleWhatsAppAction } from "./action-runtime-BnLBcHi2.mjs";
import { t as sendMessageWhatsApp } from "./send-BcHZWMkR.mjs";
import { jsonResult, readStringOrNumberParam, readStringParam as readStringParam$1, resolveReactionMessageId } from "openclaw/plugin-sdk/channel-actions";
import { canonicalizeBase64, estimateBase64DecodedBytes } from "openclaw/plugin-sdk/media-runtime";
import { readBooleanParam } from "openclaw/plugin-sdk/boolean-param";
// extensions/whatsapp/src/channel-react-action.ts
const WHATSAPP_CHANNEL = "whatsapp";
function readUploadFileMediaSource(args) {
	return readStringParam$1(args, "media", { trim: false }) ?? readStringParam$1(args, "mediaUrl", { trim: false }) ?? readStringParam$1(args, "filePath", { trim: false }) ?? readStringParam$1(args, "path", { trim: false }) ?? readStringParam$1(args, "fileUrl", { trim: false });
}
function readUploadFileCaptionText(args) {
	return readStringParam$1(args, "message", { allowEmpty: true }) ?? readStringParam$1(args, "content", { allowEmpty: true }) ?? readStringParam$1(args, "caption", { allowEmpty: true }) ?? "";
}
function readWhatsAppActionChatJid(params) {
	const explicit = readStringParam$1(params.params, "chatJid") ?? readStringParam$1(params.params, "to");
	if (explicit) return explicit;
	if (params.toolContext?.currentChannelProvider !== WHATSAPP_CHANNEL || !params.toolContext.currentChannelId) return;
	return normalizeWhatsAppTarget(params.toolContext.currentChannelId) ?? void 0;
}
async function handleWhatsAppUploadFileAction(params) {
	const mediaUrl = readUploadFileMediaSource(params.params);
	const encodedPayload = readStringParam$1(params.params, "buffer", { trim: false });
	const contentType = readStringParam$1(params.params, "contentType") ?? readStringParam$1(params.params, "mimeType");
	const fileName = readStringParam$1(params.params, "filename") ?? readStringParam$1(params.params, "fileName");
	if (!mediaUrl && encodedPayload === void 0) throw new Error("WhatsApp upload-file requires media, mediaUrl, filePath, path, fileUrl, or buffer.");
	const to = readWhatsAppActionChatJid(params) ?? readStringParam$1(params.params, "to", { required: true });
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
	let mediaPayload;
	if (encodedPayload) {
		const maxBytes = resolveWhatsAppMediaMaxBytes(account);
		const dataUrl = /^data:([^;]+);base64,(.*)$/is.exec(encodedPayload.trim());
		const payload = dataUrl?.[2] ?? encodedPayload;
		const estimatedBytes = estimateBase64DecodedBytes(payload);
		if (estimatedBytes > maxBytes) throw new Error(`WhatsApp upload-file buffer exceeds configured media limit (${estimatedBytes} bytes > ${maxBytes} bytes).`);
		const mediaContentType = contentType ?? dataUrl?.[1];
		const canonicalPayload = canonicalizeBase64(payload);
		if (!canonicalPayload) throw new Error("WhatsApp upload-file buffer must be valid base64 or a base64 data URL.");
		mediaPayload = {
			buffer: Buffer.from(canonicalPayload, "base64"),
			...mediaContentType ? { contentType: mediaContentType } : {},
			...fileName ? { fileName } : {}
		};
	}
	const result = await sendMessageWhatsApp(resolved.to, readUploadFileCaptionText(params.params), {
		verbose: false,
		cfg: params.cfg,
		...mediaUrl && !mediaPayload ? { mediaUrl } : {},
		...mediaPayload ? { mediaPayload } : {},
		...mediaUrl && !mediaPayload && fileName ? { fileName } : {},
		...mediaUrl && !mediaPayload && contentType ? { contentType } : {},
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
	if (messageIdRaw == null) readStringParam$1(params.params, "messageId", { required: true });
	const messageId = String(messageIdRaw);
	const explicitMessageId = readStringOrNumberParam(params.params, "messageId");
	const emoji = readStringParam$1(params.params, "emoji", { allowEmpty: true });
	const remove = typeof params.params.remove === "boolean" ? params.params.remove : void 0;
	const explicitParticipant = readStringParam$1(params.params, "participant");
	const inferredParticipant = explicitParticipant || explicitMessageId != null || !isWhatsAppSource || isCrossChat || !isWhatsAppGroupJid(explicitTarget ?? params.toolContext?.currentChannelId ?? "") ? void 0 : typeof params.requesterSenderId === "string" && params.requesterSenderId.trim().length > 0 ? params.requesterSenderId.trim() : void 0;
	return await handleWhatsAppAction({
		action: "react",
		chatJid: readWhatsAppActionChatJid(params) ?? readStringParam$1(params.params, "to", { required: true }),
		messageId,
		emoji,
		remove,
		participant: explicitParticipant ?? inferredParticipant,
		accountId: params.accountId ?? void 0,
		fromMe: typeof params.params.fromMe === "boolean" ? params.params.fromMe : void 0
	}, params.cfg);
}
export { handleWhatsAppMessageAction };
