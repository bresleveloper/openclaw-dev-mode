import { c as isRecord } from "./utils-BApvfmPs.js";
import { m as listBundledChannelIdsForPackageState, p as hasBundledChannelPackageState } from "./gateway-startup-speech-providers-CQCz_cL7.js";
import { t as getBootstrapChannelPlugin } from "./bootstrap-registry-DdTgUtyx.js";
import { t as getChannelEnvVars } from "./channel-env-vars-BtKdZGkF.js";
//#region src/channels/plugins/configured-state.ts
/**
* Lists bundled channel ids that expose configured-state detectors.
*/
function listBundledChannelIdsWithConfiguredState(discovery) {
	return listBundledChannelIdsForPackageState("configuredState", discovery);
}
/**
* Checks whether a bundled channel reports configured state for the current config.
*/
function hasBundledChannelConfiguredState(params) {
	return hasBundledChannelPackageState({
		metadataKey: "configuredState",
		channelId: params.channelId,
		cfg: params.cfg,
		env: params.env,
		discovery: params.discovery
	});
}
//#endregion
//#region src/config/channel-configured-shared.ts
/** Returns a channel config object when `channels.<id>` is present and object-shaped. */
function resolveChannelConfigRecord(cfg, channelId) {
	const entry = cfg.channels?.[channelId];
	return isRecord(entry) ? entry : null;
}
/** Checks whether a shallow channel config contains activation-relevant values. */
function hasMeaningfulChannelConfigShallow(value) {
	if (!isRecord(value)) return false;
	const keys = Object.keys(value);
	if (keys.length === 1 && keys[0] === "enabled") return value.enabled === true;
	return keys.some((key) => key !== "enabled");
}
/** Detects static channel configuration from known env vars or `channels.<id>` config. */
function isStaticallyChannelConfigured(cfg, channelId, env = process.env) {
	for (const envVar of getChannelEnvVars(channelId, {
		config: cfg,
		env
	})) if (typeof env[envVar] === "string" && env[envVar].trim().length > 0) return true;
	return hasMeaningfulChannelConfigShallow(resolveChannelConfigRecord(cfg, channelId));
}
//#endregion
//#region src/config/channel-configured.ts
/** Resolves whether a channel has enough config, env, or plugin state to be considered setup. */
function isChannelConfigured(cfg, channelId, env = process.env) {
	if (hasMeaningfulChannelConfigShallow(resolveChannelConfigRecord(cfg, channelId))) return true;
	if (hasBundledChannelConfiguredState({
		channelId,
		cfg,
		env
	})) return true;
	const plugin = getBootstrapChannelPlugin(channelId);
	return Boolean(plugin?.config?.hasConfiguredState?.({
		cfg,
		env
	}));
}
//#endregion
export { listBundledChannelIdsWithConfiguredState as i, isStaticallyChannelConfigured as n, hasBundledChannelConfiguredState as r, isChannelConfigured as t };
