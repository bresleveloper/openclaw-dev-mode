//#region src/commands/channels/channel-selector.ts
function parseChannelSelector(channel) {
	if (channel !== void 0 && !channel.trim()) throw new Error("--channel must not be blank");
	return channel;
}
//#endregion
export { parseChannelSelector as t };
