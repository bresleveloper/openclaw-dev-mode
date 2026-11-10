import { p as resolveEffectivePluginActivationState } from "./config-state-DkDfCu7E.mjs";
import { a as resolveManifestOwnerBasePolicyBlock } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
import { r as hasExplicitChannelConfig } from "./channel-presence-policy-hdzky3AO.mjs";
//#region src/plugins/channel-startup-policy.ts
/** Shares configured-channel eligibility between startup and manifest schema selection. */
function canStartConfiguredChannelPlugin(params) {
	const { id, origin, channelIds, config, pluginsConfig, activationSource } = params;
	const blocked = resolveManifestOwnerBasePolicyBlock({
		plugin: { id },
		normalizedConfig: pluginsConfig
	});
	if (blocked && (blocked !== "not-in-allowlist" || origin !== "bundled" || !(channelIds ?? []).some((channelId) => hasExplicitChannelConfig({
		config: activationSource.rootConfig ?? config,
		channelId
	})))) return false;
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
