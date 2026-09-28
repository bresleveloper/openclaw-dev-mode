//#region src/channels/config-metadata.ts
const CHANNEL_CONFIG_METADATA_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
/** Returns true when a channels key contains shared metadata rather than a channel entry. */
function isChannelConfigMetadataKey(value) {
	return CHANNEL_CONFIG_METADATA_KEYS.has(value.trim());
}
//#endregion
export { isChannelConfigMetadataKey as t };
