import { n as listBundledChannelCatalogEntries } from "./bundled-channel-catalog-read-CP-G92J1.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import { a as findChatChannelMeta, r as getRegisteredChannelPluginMeta } from "./registry-DqsL4UWB.mjs";
import { c as normalizeGatewayClientMode, i as GATEWAY_CLIENT_NAMES, l as normalizeGatewayClientName, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import "./message-channel-normalize-CsnAJK7x.mjs";
//#region src/utils/message-channel.ts
function isGatewayCliClient(client) {
	return normalizeGatewayClientMode(client?.mode) === GATEWAY_CLIENT_MODES.CLI;
}
/**
* Test-mode clients stay excluded from this list: suites use them as stand-ins
* for real clients and assert presence propagation through the full pipeline.
*/
function isEphemeralGatewayClient(client) {
	const mode = normalizeGatewayClientMode(client?.mode);
	return mode === GATEWAY_CLIENT_MODES.CLI || mode === GATEWAY_CLIENT_MODES.BACKEND || mode === GATEWAY_CLIENT_MODES.PROBE;
}
function isOperatorUiClient(client) {
	const clientId = normalizeGatewayClientName(client?.id);
	return clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI || clientId === GATEWAY_CLIENT_NAMES.BROWSER_COPILOT || clientId === GATEWAY_CLIENT_NAMES.TUI;
}
function isBrowserOperatorUiClient(client) {
	const clientId = normalizeGatewayClientName(client?.id);
	return clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI || clientId === GATEWAY_CLIENT_NAMES.BROWSER_COPILOT;
}
function isBrowserCopilotClient(client) {
	return normalizeGatewayClientName(client?.id) === GATEWAY_CLIENT_NAMES.BROWSER_COPILOT;
}
function isInternalMessageChannel(raw) {
	return normalizeMessageChannel(raw) === INTERNAL_MESSAGE_CHANNEL;
}
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
function isProgressCardRendererClient(paired) {
	const clientId = normalizeGatewayClientName(paired?.clientId);
	const rendererClient = clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI || clientId === GATEWAY_CLIENT_NAMES.WEBCHAT_UI || clientId === GATEWAY_CLIENT_NAMES.IOS_APP || clientId === GATEWAY_CLIENT_NAMES.ANDROID_APP || clientId === GATEWAY_CLIENT_NAMES.MACOS_APP;
	const platform = paired?.platform?.trim().toLowerCase();
	return rendererClient || (platform ? PROGRESS_CARD_RENDERER_PLATFORMS.has(platform) : false);
}
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
