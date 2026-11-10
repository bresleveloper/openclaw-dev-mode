import { createHash } from "node:crypto";
//#region src/shared/channel-avatar-source.ts
/** Compare existing channel facts for display only; never create a profile association. */
function matchesChannelAvatarSenderSource(origin, sender) {
	return Boolean(sender.pluginId && sender.accountId && sender.id && origin?.chatType === "direct" && origin.provider === sender.pluginId && origin.accountId === sender.accountId && (origin.nativeDirectUserId ? origin.nativeDirectUserId === sender.id : origin.from === sender.pluginId + ":" + sender.id));
}
//#endregion
//#region src/gateway/channel-avatar-reference.ts
/** Opaque revision; the stored media path never leaves the Gateway. */
function channelAvatarRevision(reference) {
	return createHash("sha256").update(reference).digest("base64url").slice(0, 12);
}
/** Transcript portraits bind the image snapshot as well as the exact native peer. */
function matchesChannelAvatarSender(query, origin) {
	if (!query.has("sender")) return true;
	return Boolean(origin?.avatar && matchesChannelAvatarSenderSource(origin, {
		id: query.get("sender"),
		pluginId: query.get("provider"),
		accountId: query.get("account")
	}) && query.get("v") === channelAvatarRevision(origin.avatar));
}
//#endregion
export { matchesChannelAvatarSender as n, channelAvatarRevision as t };
