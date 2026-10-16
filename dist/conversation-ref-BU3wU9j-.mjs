import crypto from "node:crypto";
//#region src/routing/conversation-ref.ts
/** Canonicalizes an adapter target into the peer id used by inbound routing. */
function normalizeConversationPeerId(channel, value) {
	let normalized = value.trim();
	const channelPrefix = `${channel.trim().toLowerCase()}:`;
	if (normalized.toLowerCase().startsWith(channelPrefix)) normalized = normalized.slice(channelPrefix.length).trim();
	return normalized.replace(/^(user|channel|group|conversation|room|dm|thread):/i, "").trim();
}
/** Builds an opaque address from canonical transport identity, never from model-session state. */
function buildConversationRef(params) {
	return `conv_${crypto.createHash("sha256").update(JSON.stringify([
		params.channel,
		params.accountId,
		params.kind,
		params.peerId,
		params.parentConversationRef ?? "",
		params.threadId ?? ""
	])).digest("hex").slice(0, 32)}`;
}
//#endregion
export { normalizeConversationPeerId as n, buildConversationRef as t };
