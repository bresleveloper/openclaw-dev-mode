import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/config/channel-config-activation.ts
/** Returns a channel config object when `channels.<id>` is present and object-shaped. */
function resolveChannelConfigRecord(cfg, channelId) {
	const entry = cfg.channels?.[channelId];
	return isRecord(entry) ? entry : null;
}
/** Returns true when channel settings supply activation intent beyond enabled/disabled state. */
function hasMeaningfulChannelConfig(value, channelId) {
	if (!isRecord(value)) return false;
	return Object.keys(value).some((key) => key !== "enabled" && (channelId !== "msteams" || key !== "legacyWebhook"));
}
/** Checks whether a shallow channel config contains activation-relevant values. */
function hasMeaningfulChannelConfigShallow(value, channelId) {
	return isRecord(value) && value.enabled === true || hasMeaningfulChannelConfig(value, channelId);
}
/** Channel configuration can admit bundled plugin capabilities through an allowlist. */
function resolveChannelConfigActivationFacts(config) {
	return Object.keys(config.channels ?? {}).filter((channelId) => {
		const channel = resolveChannelConfigRecord(config, channelId);
		return channel?.enabled !== false && hasMeaningfulChannelConfigShallow(channel, channelId);
	}).toSorted();
}
//#endregion
export { resolveChannelConfigRecord as i, hasMeaningfulChannelConfigShallow as n, resolveChannelConfigActivationFacts as r, hasMeaningfulChannelConfig as t };
