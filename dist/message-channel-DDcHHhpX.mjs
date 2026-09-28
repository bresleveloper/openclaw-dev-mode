import { n as listBundledChannelCatalogEntries } from "./bundled-channel-catalog-read-RR5snA6Y.mjs";
import { i as normalizeChatChannelId } from "./ids-NACrHrny.mjs";
import { c as normalizeGatewayClientName, i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, s as normalizeGatewayClientMode } from "./client-info-B_ICKCYw.mjs";
import { t as findChatChannelMeta } from "./chat-meta-CrZhPtTU.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { r as getRegisteredChannelPluginMeta } from "./registry-BKdVEB34.mjs";
import "./message-channel-normalize-2tAtQt1g.mjs";
//#region src/utils/message-channel.ts
/** Return whether a Gateway client is the CLI transport. */
function isGatewayCliClient(client) {
	return normalizeGatewayClientMode(client?.mode) === GATEWAY_CLIENT_MODES.CLI;
}
/**
* Return whether a Gateway client is an ephemeral control-plane connection.
* Test-mode clients stay excluded from this list: suites use them as stand-ins
* for real clients and assert presence propagation through the full pipeline.
*/
function isEphemeralGatewayClient(client) {
	const mode = normalizeGatewayClientMode(client?.mode);
	return mode === GATEWAY_CLIENT_MODES.CLI || mode === GATEWAY_CLIENT_MODES.BACKEND || mode === GATEWAY_CLIENT_MODES.PROBE;
}
/** Return whether a client is one of the operator UI clients. */
function isOperatorUiClient(client) {
	const clientId = normalizeGatewayClientName(client?.id);
	return clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI || clientId === GATEWAY_CLIENT_NAMES.BROWSER_COPILOT || clientId === GATEWAY_CLIENT_NAMES.TUI;
}
/** Return whether a client is the browser Control UI. */
function isBrowserOperatorUiClient(client) {
	const clientId = normalizeGatewayClientName(client?.id);
	return clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI || clientId === GATEWAY_CLIENT_NAMES.BROWSER_COPILOT;
}
/** Return whether a client is the first-party browser side-panel copilot. */
function isBrowserCopilotClient(client) {
	return normalizeGatewayClientName(client?.id) === GATEWAY_CLIENT_NAMES.BROWSER_COPILOT;
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
const PROGRESS_CARD_RENDERER_PLATFORMS = /* @__PURE__ */ new Set([
	"web",
	"ios",
	"android",
	"macos",
	"darwin"
]);
/** Return whether a paired Gateway client can render progress cards. */
function isProgressCardRendererClient(paired) {
	const client = {
		id: paired?.clientId,
		mode: paired?.clientMode
	};
	const clientId = normalizeGatewayClientName(client?.id);
	const rendererClient = clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI && isBrowserOperatorUiClient(client) || clientId === GATEWAY_CLIENT_NAMES.WEBCHAT_UI && isWebchatClient(client) || clientId === GATEWAY_CLIENT_NAMES.IOS_APP || clientId === GATEWAY_CLIENT_NAMES.ANDROID_APP || clientId === GATEWAY_CLIENT_NAMES.MACOS_APP;
	const platform = paired?.platform?.trim().toLowerCase();
	return rendererClient || (platform ? PROGRESS_CARD_RENDERER_PLATFORMS.has(platform) : false);
}
/** Resolve whether a channel can receive markdown without plain-text downgrade. */
function isMarkdownCapableMessageChannel(raw) {
	const channel = normalizeMessageChannel(raw);
	if (!channel) return false;
	if (channel === "webchat" || channel === "tui") return true;
	const builtInChannel = normalizeChatChannelId(channel);
	if (builtInChannel) {
		const builtInMeta = findChatChannelMeta(builtInChannel);
		if (builtInMeta) return builtInMeta.markdownCapable === true;
		const catalogMeta = listBundledChannelCatalogEntries().find((entry) => entry.id === builtInChannel);
		if (catalogMeta) return catalogMeta.channel.markdownCapable === true;
	}
	return getRegisteredChannelPluginMeta(channel)?.markdownCapable === true;
}
//#endregion
export { isInternalMessageChannel as a, isProgressCardRendererClient as c, isGatewayCliClient as i, isWebchatClient as l, isBrowserOperatorUiClient as n, isMarkdownCapableMessageChannel as o, isEphemeralGatewayClient as r, isOperatorUiClient as s, isBrowserCopilotClient as t };
