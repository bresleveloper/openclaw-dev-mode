import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createDedupeCache } from "./dedupe-qhwfyIea.mjs";
//#region src/config/runtime-group-policy.ts
/**
* Resolve the effective group policy for a channel/provider runtime.
* Missing provider config can fail closed separately from configured providers.
*/
function resolveRuntimeGroupPolicy(params, configuredFallbackPolicy) {
	return {
		groupPolicy: params.providerConfigPresent ? params.groupPolicy ?? params.defaultGroupPolicy ?? configuredFallbackPolicy : params.groupPolicy ?? "allowlist",
		providerMissingFallbackApplied: !params.providerConfigPresent && params.groupPolicy === void 0
	};
}
/** Read the shared channels default group policy used by provider-specific resolvers. */
function resolveDefaultGroupPolicy(cfg) {
	return cfg.channels?.defaults?.groupPolicy;
}
/** Human labels for the access surface blocked by a missing-provider fallback. */
const GROUP_POLICY_BLOCKED_LABEL = {
	group: "group messages",
	guild: "guild messages",
	room: "room messages",
	channel: "channel messages",
	space: "space messages"
};
/**
* Resolve the standard channel-provider policy.
* Configured providers default open; missing provider config defaults allowlist.
*/
function resolveOpenProviderRuntimeGroupPolicy(params) {
	return resolveRuntimeGroupPolicy(params, "open");
}
/**
* Resolve the strict channel-provider policy.
* Configured and missing provider config both default allowlist.
*/
function resolveAllowlistProviderRuntimeGroupPolicy(params) {
	return resolveRuntimeGroupPolicy(params, "allowlist");
}
const warnedMissingProviderGroupPolicy = createDedupeCache({
	ttlMs: 0,
	maxSize: 4096
});
/**
* Log the missing-provider fail-closed fallback once per provider/account.
* Returns true only when this call emitted the warning.
*/
function warnMissingProviderGroupPolicyFallbackOnce(params) {
	if (!params.providerMissingFallbackApplied) return false;
	const key = `${params.providerKey}:${params.accountId ?? "*"}`;
	if (warnedMissingProviderGroupPolicy.check(key)) return false;
	const blockedLabel = normalizeOptionalString(params.blockedLabel) || "group messages";
	params.log(`${params.providerKey}: channels.${params.providerKey} is missing; defaulting groupPolicy to "allowlist" (${blockedLabel} blocked until explicitly configured).`);
	return true;
}
//#endregion
export { warnMissingProviderGroupPolicyFallbackOnce as a, resolveOpenProviderRuntimeGroupPolicy as i, resolveAllowlistProviderRuntimeGroupPolicy as n, resolveDefaultGroupPolicy as r, GROUP_POLICY_BLOCKED_LABEL as t };
