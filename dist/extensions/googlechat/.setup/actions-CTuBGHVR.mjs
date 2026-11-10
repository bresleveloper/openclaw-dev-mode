import { l as resolveGoogleChatAccount } from "./channel-base-sWlG7EP1.mjs";
import { C as sendGoogleChatMessage, d as formatGoogleChatMediaText, v as resolveGoogleChatOutboundSpace } from "./channel.adapters-CLzwB-5-.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { jsonResult, readStringArrayParam, readStringParam } from "openclaw/plugin-sdk/channel-actions";
//#region extensions/googlechat/src/actions.ts
const OUTBOUND_MEDIA_KEYS = [
	"media",
	"mediaUrl",
	"path",
	"filePath",
	"fileUrl"
];
const STRUCTURED_ATTACHMENT_MEDIA_KEYS = [...OUTBOUND_MEDIA_KEYS, "url"];
function readGoogleChatMediaUrls(params) {
	return [
		...OUTBOUND_MEDIA_KEYS.map((key) => readStringParam(params, key)),
		...readStringArrayParam(params, "mediaUrls") ?? [],
		...(Array.isArray(params.attachments) ? params.attachments : []).flatMap((attachment) => isRecord(attachment) ? STRUCTURED_ATTACHMENT_MEDIA_KEYS.map((key) => readStringParam(attachment, key)) : [])
	].filter((value) => value !== void 0);
}
async function handleGoogleChatAction({ action, params, cfg, accountId, assertDirectAdapterHandoff, onPlatformSendDispatch }) {
	if (action === "upload-file") throw new Error("Google Chat outbound attachments require user OAuth and are not supported by this service-account channel.");
	const mediaUrls = action === "send" ? readGoogleChatMediaUrls(params) : [];
	const content = action === "send" ? formatGoogleChatMediaText(readStringParam(params, "message", {
		required: mediaUrls.length === 0,
		allowEmpty: true
	}), mediaUrls) : "";
	const account = resolveGoogleChatAccount({
		cfg,
		accountId
	});
	if (account.credentialSource === "none" || account.tokenStatus === "configured_unavailable") throw new Error("Google Chat credentials are missing.");
	if (action === "send") {
		const to = readStringParam(params, "to", { required: true });
		const threadId = readStringParam(params, "threadId") ?? readStringParam(params, "replyTo");
		const space = await resolveGoogleChatOutboundSpace({
			account,
			target: to,
			assertDirectAdapterHandoff
		});
		const sent = await sendGoogleChatMessage({
			account,
			space,
			text: content,
			thread: threadId ?? void 0,
			assertDirectAdapterHandoff,
			onPlatformSendDispatch
		});
		return jsonResult({
			ok: true,
			to: space,
			...sent
		});
	}
	throw new Error(`Action ${action} is not supported for provider googlechat.`);
}
//#endregion
export { handleGoogleChatAction };
