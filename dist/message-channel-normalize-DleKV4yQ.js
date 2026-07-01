import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { t as CHANNEL_IDS } from "./ids-CkMlu8FB.js";
import { i as listRegisteredChannelPluginIds } from "./registry-B5Y8tTE-.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Z0pS5ykd.js";
import { n as normalizeMessageChannel$1 } from "./message-channel-core-BMm1GdgG.js";
//#region src/utils/message-channel-normalize.ts
/** Normalizes built-in, plugin, and alias channel names to their canonical id. */
function normalizeMessageChannel(raw) {
	return normalizeMessageChannel$1(raw);
}
const listPluginChannelIds = () => {
	return listRegisteredChannelPluginIds();
};
/** Lists built-in and registered plugin channel ids that can receive delivery. */
const listDeliverableMessageChannels = () => uniqueStrings([...CHANNEL_IDS, ...listPluginChannelIds()]);
const listGatewayMessageChannels = () => [...listDeliverableMessageChannels(), INTERNAL_MESSAGE_CHANNEL];
/** Returns whether a normalized id is valid for Gateway routing. */
function isGatewayMessageChannel(value) {
	return listGatewayMessageChannels().includes(value);
}
/** Returns whether a normalized id is a deliverable non-internal channel. */
function isDeliverableMessageChannel(value) {
	return listDeliverableMessageChannels().includes(value);
}
/** Normalizes and validates a raw channel value for Gateway routing. */
function resolveGatewayMessageChannel(raw) {
	const normalized = normalizeMessageChannel(raw);
	if (!normalized) return;
	return isGatewayMessageChannel(normalized) ? normalized : void 0;
}
/** Normalizes the primary channel or falls back to a secondary channel value. */
function resolveMessageChannel(primary, fallback) {
	return normalizeMessageChannel(primary) ?? normalizeMessageChannel(fallback);
}
//#endregion
export { resolveGatewayMessageChannel as a, normalizeMessageChannel as i, isGatewayMessageChannel as n, resolveMessageChannel as o, listDeliverableMessageChannels as r, isDeliverableMessageChannel as t };
