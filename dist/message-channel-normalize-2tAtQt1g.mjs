import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as CHANNEL_IDS } from "./ids-NACrHrny.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { i as listRegisteredChannelPluginIds } from "./registry-BKdVEB34.mjs";
//#region src/utils/message-channel-normalize.ts
/** Lists built-in and registered plugin channel ids that can receive delivery. */
const listDeliverableMessageChannels = () => uniqueStrings([...CHANNEL_IDS, ...listRegisteredChannelPluginIds()]);
/** Returns whether a normalized id is valid for Gateway routing. */
function isGatewayMessageChannel(value) {
	return value === "webchat" || isDeliverableMessageChannel(value);
}
/** Returns whether a normalized id is a deliverable non-internal channel. */
function isDeliverableMessageChannel(value) {
	return CHANNEL_IDS.some((channelId) => channelId === value) || listRegisteredChannelPluginIds().includes(value);
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
export { resolveMessageChannel as a, resolveGatewayMessageChannel as i, isGatewayMessageChannel as n, listDeliverableMessageChannels as r, isDeliverableMessageChannel as t };
