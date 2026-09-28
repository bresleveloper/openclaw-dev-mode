//#region src/plugins/conversation-binding-metadata.ts
function isPluginOwnedBindingMetadata(metadata) {
	if (!metadata || typeof metadata !== "object") return false;
	const record = metadata;
	return record.pluginBindingOwner === "plugin" && typeof record.pluginId === "string" && typeof record.pluginRoot === "string";
}
function isPluginOwnedSessionBindingRecord(record) {
	return isPluginOwnedBindingMetadata(record?.metadata);
}
//#endregion
export { isPluginOwnedSessionBindingRecord as n, isPluginOwnedBindingMetadata as t };
