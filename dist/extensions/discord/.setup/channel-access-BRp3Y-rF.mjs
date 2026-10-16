//#region extensions/discord/src/monitor/channel-access.ts
function readDiscordChannelPropertySafe(channel, key) {
	if (!channel || typeof channel !== "object") return;
	try {
		if (!(key in channel)) return;
		return channel[key];
	} catch {
		return;
	}
}
function resolveDiscordChannelStringPropertySafe(channel, key) {
	const value = readDiscordChannelPropertySafe(channel, key);
	return typeof value === "string" ? value : void 0;
}
function resolveDiscordChannelNumberPropertySafe(channel, key) {
	const value = readDiscordChannelPropertySafe(channel, key);
	return typeof value === "number" ? value : void 0;
}
function resolveDiscordChannelStringWithAliasSafe(channel, camelKey, snakeKey) {
	return resolveDiscordChannelStringPropertySafe(channel, camelKey) ?? resolveDiscordChannelStringPropertySafe(channel, snakeKey) ?? resolveDiscordChannelStringPropertySafe(readDiscordChannelPropertySafe(channel, "rawData"), snakeKey);
}
function resolveDiscordChannelNameSafe(channel) {
	return resolveDiscordChannelStringPropertySafe(channel, "name");
}
function resolveDiscordChannelIdSafe(channel) {
	return resolveDiscordChannelStringPropertySafe(channel, "id");
}
function resolveDiscordChannelTopicSafe(channel) {
	return resolveDiscordChannelStringPropertySafe(channel, "topic");
}
function resolveDiscordChannelParentIdSafe(channel) {
	return resolveDiscordChannelStringWithAliasSafe(channel, "parentId", "parent_id");
}
function resolveDiscordChannelParentSafe(channel) {
	return readDiscordChannelPropertySafe(channel, "parent");
}
function resolveDiscordChannelInfoSafe(channel) {
	const parent = resolveDiscordChannelParentSafe(channel);
	return {
		name: resolveDiscordChannelNameSafe(channel),
		topic: resolveDiscordChannelTopicSafe(channel),
		type: resolveDiscordChannelNumberPropertySafe(channel, "type"),
		parentId: resolveDiscordChannelParentIdSafe(channel),
		ownerId: resolveDiscordChannelStringWithAliasSafe(channel, "ownerId", "owner_id"),
		parentName: resolveDiscordChannelNameSafe(parent)
	};
}
//#endregion
export { resolveDiscordChannelParentSafe as a, resolveDiscordChannelParentIdSafe as i, resolveDiscordChannelInfoSafe as n, resolveDiscordChannelTopicSafe as o, resolveDiscordChannelNameSafe as r, resolveDiscordChannelIdSafe as t };
