import { n as getLoadedChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
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
//#endregion
export { resolveChannelThreadAddressing as n, getLoadedChannelThreadingAdapter as t };
