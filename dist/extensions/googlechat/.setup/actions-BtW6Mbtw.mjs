import { l as resolveGoogleChatAccount } from "./channel-base-BdCGLoFe.mjs";
import { g as resolveGoogleChatOutboundSpace, x as sendGoogleChatMessage } from "./channel.adapters-CcYyfMMC.mjs";
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
function hasGoogleChatOutboundAttachment(params) {
	if (OUTBOUND_MEDIA_KEYS.some((key) => readStringParam(params, key) !== void 0)) return true;
	if (readStringArrayParam(params, "mediaUrls") !== void 0) return true;
	if (!Array.isArray(params.attachments)) return false;
	return params.attachments.some((attachment) => isRecord(attachment) && STRUCTURED_ATTACHMENT_MEDIA_KEYS.some((key) => readStringParam(attachment, key) !== void 0));
}
async function handleGoogleChatAction({ action, params, cfg, accountId, assertDirectAdapterHandoff, onPlatformSendDispatch }) {
	if (action === "upload-file" || action === "send" && hasGoogleChatOutboundAttachment(params)) throw new Error("Google Chat outbound attachments require user OAuth and are not supported by this service-account channel.");
	const account = resolveGoogleChatAccount({
		cfg,
		accountId
	});
	if (account.credentialSource === "none" || account.tokenStatus === "configured_unavailable") throw new Error("Google Chat credentials are missing.");
	if (action === "send") {
		const to = readStringParam(params, "to", { required: true });
		const content = readStringParam(params, "message", {
			required: true,
			allowEmpty: true
		});
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
