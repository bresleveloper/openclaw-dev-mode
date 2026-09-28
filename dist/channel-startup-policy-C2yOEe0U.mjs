import { d as resolveEffectivePluginActivationState } from "./config-state-BEAL5gWH.mjs";
import { n as hasExplicitChannelConfig } from "./channel-presence-policy-C83ks5im.mjs";
//#region src/plugins/channel-startup-policy.ts
/** Shares configured-channel eligibility between startup and manifest schema selection. */
function canStartConfiguredChannelPlugin(params) {
	const { id, origin, channelIds, config, pluginsConfig, activationSource } = params;
	if (!pluginsConfig.enabled || pluginsConfig.deny.includes(id) || pluginsConfig.entries[id]?.enabled === false) return false;
	const explicitBundledChannelConfig = origin === "bundled" && (channelIds ?? []).some((channelId) => hasExplicitChannelConfig({
		config: activationSource.rootConfig ?? config,
		channelId
	}));
	if (pluginsConfig.allow.length > 0 && !pluginsConfig.allow.includes(id) && !explicitBundledChannelConfig) return false;
	if (origin === "bundled") return true;
	const activationState = resolveEffectivePluginActivationState({
		id,
		origin,
		channelIds,
		config: pluginsConfig,
		rootConfig: config,
		activationSource
	});
	return activationState.enabled && activationState.explicitlyEnabled;
}
//#endregion
export { canStartConfiguredChannelPlugin as t };
