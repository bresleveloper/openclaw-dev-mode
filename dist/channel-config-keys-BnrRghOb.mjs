//#region src/config/channel-config-keys.ts
const CHANNEL_KERNEL_CONFIG_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
const CHANNEL_NAMESPACE_PREFIX = "channels.";
/** Return whether a channel config key names a kernel-owned namespace. */
function isKernelOwnedChannelConfigKey(key) {
	return CHANNEL_KERNEL_CONFIG_KEYS.has(key);
}
/** Channel schema hints outside the kernel namespaces belong to their plugins. */
function isPluginOwnedChannelConfigPath(path) {
	if (!path.startsWith(CHANNEL_NAMESPACE_PREFIX)) return false;
	const channelKey = path.slice(9).split(".", 1)[0];
	return channelKey === void 0 || !isKernelOwnedChannelConfigKey(channelKey);
}
//#endregion
export { isPluginOwnedChannelConfigPath as n, isKernelOwnedChannelConfigKey as t };
