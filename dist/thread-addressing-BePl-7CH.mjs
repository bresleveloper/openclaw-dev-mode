import { n as getLoadedChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
//#region src/channels/thread-addressing.ts
/** Returns the loaded channel's threading adapter without bundled fallback discovery. */
function getLoadedChannelThreadingAdapter(channel) {
	if (!channel) return;
	return getLoadedChannelPlugin(channel)?.threading;
}
/** Resolves where a loaded channel transport keeps thread identity. */
function resolveChannelThreadAddressing(channel) {
	return getLoadedChannelThreadingAdapter(channel)?.threadAddressing ?? "address";
}
function channelSupportsThreadDelivery(channel) {
	if (!channel) return false;
	return getLoadedChannelPlugin(channel)?.capabilities.threads === true;
}
//#endregion
export { getLoadedChannelThreadingAdapter as n, resolveChannelThreadAddressing as r, channelSupportsThreadDelivery as t };
