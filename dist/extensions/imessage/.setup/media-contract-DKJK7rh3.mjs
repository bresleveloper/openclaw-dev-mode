import { o as resolveIMessageAccount } from "./accounts-CUxZrTcY.mjs";
import { mergeInboundPathRoots } from "openclaw/plugin-sdk/channel-inbound";
//#region extensions/imessage/src/media-contract.ts
const DEFAULT_IMESSAGE_ATTACHMENT_ROOTS = ["/Users/*/Library/Messages/Attachments"];
function resolveIMessageAttachmentRoots(params) {
	const account = resolveIMessageAccount(params);
	return mergeInboundPathRoots(account.config.attachmentRoots, params.cfg.channels?.imessage?.attachmentRoots, DEFAULT_IMESSAGE_ATTACHMENT_ROOTS);
}
function resolveIMessageRemoteAttachmentRoots(params) {
	const account = resolveIMessageAccount(params);
	return mergeInboundPathRoots(account.config.remoteAttachmentRoots, params.cfg.channels?.imessage?.remoteAttachmentRoots, account.config.attachmentRoots, params.cfg.channels?.imessage?.attachmentRoots, DEFAULT_IMESSAGE_ATTACHMENT_ROOTS);
}
//#endregion
export { resolveIMessageAttachmentRoots as n, resolveIMessageRemoteAttachmentRoots as r, DEFAULT_IMESSAGE_ATTACHMENT_ROOTS as t };
