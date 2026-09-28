import { t as normalizePluginPolicyId } from "./plugin-policy-id-C9JZrwYv.mjs";
import { d as resolveEffectivePluginActivationState } from "./config-state-BEAL5gWH.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
//#region src/plugins/manifest-owner-policy.ts
/** True when a manifest owner comes from a bundled plugin. */
function isBundledManifestOwner(plugin) {
	return plugin.origin === "bundled";
}
/** True when config explicitly trusts a plugin as a manifest owner. */
function hasExplicitManifestOwnerTrust(params) {
	const policyId = normalizePluginPolicyId(params.plugin.id);
	return params.normalizedConfig.allow.includes(policyId) || params.normalizedConfig.entries[policyId]?.enabled === true;
}
/** True when a plugin passes global enablement, allowlist, denylist, and disabled checks. */
function passesManifestOwnerBasePolicy(params) {
	return resolveManifestOwnerBasePolicyBlock(params) === null;
}
/** Resolves the base policy block reason for a manifest owner plugin. */
function resolveManifestOwnerBasePolicyBlock(params) {
	if (!params.normalizedConfig.enabled) return "plugins-disabled";
	const policyId = normalizePluginPolicyId(params.plugin.id);
	if (params.normalizedConfig.deny.includes(policyId)) return "blocked-by-denylist";
	if (params.normalizedConfig.entries[policyId]?.enabled === false && params.allowExplicitlyDisabled !== true) return "plugin-disabled";
	if (params.allowRestrictiveAllowlistBypass !== true && params.normalizedConfig.allow.length > 0 && !params.normalizedConfig.allow.includes(policyId)) return "not-in-allowlist";
	return null;
}
/** Resolves whether a manifest owner plugin is effectively activated. */
function isActivatedManifestOwner(params) {
	return resolveEffectivePluginActivationState({
		id: params.plugin.id,
		origin: params.plugin.origin,
		channelIds: params.plugin.channels,
		config: params.normalizedConfig,
		rootConfig: params.rootConfig,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin)
	}).activated;
}
//#endregion
export { resolveManifestOwnerBasePolicyBlock as a, passesManifestOwnerBasePolicy as i, isActivatedManifestOwner as n, isBundledManifestOwner as r, hasExplicitManifestOwnerTrust as t };
