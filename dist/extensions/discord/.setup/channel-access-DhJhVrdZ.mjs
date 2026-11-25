import { asOptionalObjectRecord, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/discord/src/monitor/channel-access.ts
function resolveDiscordChannelNameSafe(channel) {
	return readStringField(asOptionalObjectRecord(channel), "name");
}
function resolveDiscordChannelTopicSafe(channel) {
	return readStringField(asOptionalObjectRecord(channel), "topic");
}
function resolveDiscordChannelInfoSafe(channel) {
	const record = asOptionalObjectRecord(channel);
	const raw = asOptionalObjectRecord(record?.rawData);
	const readAlias = (camel, snake) => readStringField(record, camel) ?? readStringField(record, snake) ?? readStringField(raw, snake);
	return {
		id: readStringField(record, "id"),
		name: readStringField(record, "name"),
		topic: readStringField(record, "topic"),
		type: typeof record?.type === "number" ? record.type : void 0,
		parentId: readAlias("parentId", "parent_id"),
		ownerId: readAlias("ownerId", "owner_id"),
		parentName: readStringField(asOptionalObjectRecord(record?.parent), "name")
	};
}
export { resolveDiscordChannelNameSafe as n, resolveDiscordChannelTopicSafe as r, resolveDiscordChannelInfoSafe as t };
