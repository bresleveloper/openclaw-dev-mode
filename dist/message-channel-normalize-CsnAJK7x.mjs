import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { t as CHANNEL_IDS } from "./ids-DhLNdNuz.mjs";
import { i as listRegisteredChannelPluginIds } from "./registry-DqsL4UWB.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
//#region src/utils/message-channel-normalize.ts
const listDeliverableMessageChannels = () => uniqueStrings([...CHANNEL_IDS, ...listRegisteredChannelPluginIds()]);
function isGatewayMessageChannel(value) {
	return value === "webchat" || isDeliverableMessageChannel(value);
}
function isDeliverableMessageChannel(value) {
	return CHANNEL_IDS.some((channelId) => channelId === value) || listRegisteredChannelPluginIds().includes(value);
}
function resolveGatewayMessageChannel(raw) {
	const normalized = normalizeMessageChannel(raw);
	if (!normalized) return;
	return isGatewayMessageChannel(normalized) ? normalized : void 0;
}
function resolveMessageChannel(primary, fallback) {
	return normalizeMessageChannel(primary) ?? normalizeMessageChannel(fallback);
}
//#endregion
export { resolveMessageChannel as a, resolveGatewayMessageChannel as i, isGatewayMessageChannel as n, listDeliverableMessageChannels as r, isDeliverableMessageChannel as t };
