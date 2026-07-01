import { r as normalizeChatChannelId } from "./ids-CkMlu8FB.js";
import { t as listBundledChannelCatalogEntries } from "./bundled-channel-catalog-read-_In0yAMi.js";
import { c as normalizeGatewayClientName, i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, s as normalizeGatewayClientMode } from "./client-info-CcqJJIan.js";
import { t as getChatChannelMeta } from "./chat-meta-CH2MWeRm.js";
import { r as getRegisteredChannelPluginMeta } from "./registry-B5Y8tTE-.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Z0pS5ykd.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
//#region src/utils/message-channel.ts
/** Return whether a Gateway client is the CLI transport. */
function isGatewayCliClient(client) {
	return normalizeGatewayClientMode(client?.mode) === GATEWAY_CLIENT_MODES.CLI;
}
/** Return whether a client is one of the operator UI clients. */
function isOperatorUiClient(client) {
	const clientId = normalizeGatewayClientName(client?.id);
	return clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI || clientId === GATEWAY_CLIENT_NAMES.TUI;
}
/** Return whether a client is the browser Control UI. */
function isBrowserOperatorUiClient(client) {
	return normalizeGatewayClientName(client?.id) === GATEWAY_CLIENT_NAMES.CONTROL_UI;
}
/** Return whether a raw channel id resolves to OpenClaw's internal channel. */
function isInternalMessageChannel(raw) {
	return normalizeMessageChannel(raw) === INTERNAL_MESSAGE_CHANNEL;
}
/** Return whether a Gateway client is the public webchat surface. */
function isWebchatClient(client) {
	if (normalizeGatewayClientMode(client?.mode) === GATEWAY_CLIENT_MODES.WEBCHAT) return true;
	return normalizeGatewayClientName(client?.id) === GATEWAY_CLIENT_NAMES.WEBCHAT_UI;
}
/** Resolve whether a channel can receive markdown without plain-text downgrade. */
function isMarkdownCapableMessageChannel(raw) {
	const channel = normalizeMessageChannel(raw);
	if (!channel) return false;
	if (channel === "webchat" || channel === "tui") return true;
	const builtInChannel = normalizeChatChannelId(channel);
	if (builtInChannel) {
		const builtInMeta = getChatChannelMeta(builtInChannel);
		if (builtInMeta) return builtInMeta.markdownCapable === true;
		const catalogMeta = listBundledChannelCatalogEntries().find((entry) => entry.id === builtInChannel);
		if (catalogMeta) return catalogMeta.channel.markdownCapable === true;
	}
	return getRegisteredChannelPluginMeta(channel)?.markdownCapable === true;
}
//#endregion
export { isOperatorUiClient as a, isMarkdownCapableMessageChannel as i, isGatewayCliClient as n, isWebchatClient as o, isInternalMessageChannel as r, isBrowserOperatorUiClient as t };
