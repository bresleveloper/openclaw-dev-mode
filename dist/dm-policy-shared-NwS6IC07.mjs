import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { t as resolveChannelIngressEffectiveAllowFromLists } from "./effective-allow-from-BZwOd0Lu.mjs";
import { n as readChannelIngressStoreAllowFromForDmPolicy } from "./store-allow-from-CInyZmjP.mjs";
//#region src/security/dm-policy-shared.ts
/**
* Derive a stable main-DM owner from a single-entry allowlist.
* Wildcards, multi-owner lists, and non-main DM scopes stay unpinned so callers keep route-specific sessions.
*/
function resolvePinnedMainDmOwnerFromAllowlist(params) {
	if ((params.dmScope ?? "main") !== "main") return null;
	const rawAllowFrom = Array.isArray(params.allowFrom) ? params.allowFrom : [];
	if (rawAllowFrom.some((entry) => String(entry).trim() === "*")) return null;
	const normalizedOwners = Array.from(new Set(rawAllowFrom.map((entry) => params.normalizeEntry(String(entry))).filter((entry) => Boolean(entry))));
	return normalizedOwners.length === 1 ? expectDefined(normalizedOwners[0], "normalized owners entry at 0") : null;
}
/** @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
function resolveEffectiveAllowFromLists(params) {
	return resolveChannelIngressEffectiveAllowFromLists(params);
}
/** Stable reason codes used by channel plugins, command auth, and diagnostics. */
const DM_GROUP_ACCESS_REASON = {
	GROUP_POLICY_ALLOWED: "group_policy_allowed",
	GROUP_POLICY_DISABLED: "group_policy_disabled",
	GROUP_POLICY_EMPTY_ALLOWLIST: "group_policy_empty_allowlist",
	GROUP_POLICY_NOT_ALLOWLISTED: "group_policy_not_allowlisted",
	DM_POLICY_OPEN: "dm_policy_open",
	DM_POLICY_DISABLED: "dm_policy_disabled",
	DM_POLICY_ALLOWLISTED: "dm_policy_allowlisted",
	DM_POLICY_PAIRING_REQUIRED: "dm_policy_pairing_required",
	DM_POLICY_NOT_ALLOWLISTED: "dm_policy_not_allowlisted"
};
const dmGroupAccess = (decision, reasonCode, reason) => ({
	decision,
	reasonCode,
	reason
});
/**
* Resolve sender access for `dmPolicy=open`, where `*` means fully open and a configured
* allowlist still restricts the accepted sender set.
*
* @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
*/
function resolveOpenDmAllowlistAccess(params) {
	const effectiveAllowFrom = normalizeStringEntries(params.effectiveAllowFrom);
	return effectiveAllowFrom.includes("*") ? dmGroupAccess("allow", DM_GROUP_ACCESS_REASON.DM_POLICY_OPEN, "dmPolicy=open") : params.isSenderAllowed(effectiveAllowFrom) ? dmGroupAccess("allow", DM_GROUP_ACCESS_REASON.DM_POLICY_ALLOWLISTED, "dmPolicy=open (allowlisted)") : dmGroupAccess("block", DM_GROUP_ACCESS_REASON.DM_POLICY_NOT_ALLOWLISTED, "dmPolicy=open (not allowlisted)");
}
/** @deprecated Use `resolveChannelMessageIngress` or `readChannelIngressStoreAllowFromForDmPolicy` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
async function readStoreAllowFromForDmPolicy(params) {
	return await readChannelIngressStoreAllowFromForDmPolicy(params);
}
function resolveLegacyDmGroupAccessDecision(params) {
	const dmPolicy = params.dmPolicy ?? "pairing";
	const groupPolicy = params.groupPolicy === "open" || params.groupPolicy === "disabled" ? params.groupPolicy : "allowlist";
	const effectiveAllowFrom = normalizeStringEntries(params.effectiveAllowFrom);
	const effectiveGroupAllowFrom = normalizeStringEntries(params.effectiveGroupAllowFrom);
	if (params.isGroup) {
		if (groupPolicy === "disabled") return dmGroupAccess("block", DM_GROUP_ACCESS_REASON.GROUP_POLICY_DISABLED, "groupPolicy=disabled");
		if (groupPolicy === "allowlist") {
			if (effectiveGroupAllowFrom.length === 0) return dmGroupAccess("block", DM_GROUP_ACCESS_REASON.GROUP_POLICY_EMPTY_ALLOWLIST, "groupPolicy=allowlist (empty allowlist)");
			if (!params.isSenderAllowed(effectiveGroupAllowFrom)) return dmGroupAccess("block", DM_GROUP_ACCESS_REASON.GROUP_POLICY_NOT_ALLOWLISTED, "groupPolicy=allowlist (not allowlisted)");
		}
		return dmGroupAccess("allow", DM_GROUP_ACCESS_REASON.GROUP_POLICY_ALLOWED, `groupPolicy=${groupPolicy}`);
	}
	if (dmPolicy === "disabled") return dmGroupAccess("block", DM_GROUP_ACCESS_REASON.DM_POLICY_DISABLED, "dmPolicy=disabled");
	if (dmPolicy === "open") return resolveOpenDmAllowlistAccess({
		effectiveAllowFrom,
		isSenderAllowed: params.isSenderAllowed
	});
	return params.isSenderAllowed(effectiveAllowFrom) ? dmGroupAccess("allow", DM_GROUP_ACCESS_REASON.DM_POLICY_ALLOWLISTED, `dmPolicy=${dmPolicy} (allowlisted)`) : dmPolicy === "pairing" ? dmGroupAccess("pairing", DM_GROUP_ACCESS_REASON.DM_POLICY_PAIRING_REQUIRED, "dmPolicy=pairing (not allowlisted)") : dmGroupAccess("block", DM_GROUP_ACCESS_REASON.DM_POLICY_NOT_ALLOWLISTED, `dmPolicy=${dmPolicy} (not allowlisted)`);
}
/**
* Resolve legacy DM/group sender admission and return the effective allowlists used.
*
* @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
*/
function resolveDmGroupAccessWithLists(params) {
	const { effectiveAllowFrom, effectiveGroupAllowFrom } = resolveEffectiveAllowFromLists({
		allowFrom: params.allowFrom,
		groupAllowFrom: params.groupAllowFrom,
		storeAllowFrom: params.storeAllowFrom,
		dmPolicy: params.dmPolicy,
		groupAllowFromFallbackToAllowFrom: params.groupAllowFromFallbackToAllowFrom
	});
	return {
		...resolveLegacyDmGroupAccessDecision({
			isGroup: params.isGroup,
			dmPolicy: params.dmPolicy,
			groupPolicy: params.groupPolicy,
			effectiveAllowFrom,
			effectiveGroupAllowFrom,
			isSenderAllowed: params.isSenderAllowed
		}),
		effectiveAllowFrom,
		effectiveGroupAllowFrom
	};
}
//#endregion
export { resolveOpenDmAllowlistAccess as a, resolveEffectiveAllowFromLists as i, readStoreAllowFromForDmPolicy as n, resolvePinnedMainDmOwnerFromAllowlist as o, resolveDmGroupAccessWithLists as r, DM_GROUP_ACCESS_REASON as t };
