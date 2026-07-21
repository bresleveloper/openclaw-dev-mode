import "./source-check-CsikPIZO.js";
import "./store-9jfx-1KO.js";
import { n as resolveAuthProfileMetadata } from "./identity-B__O0Fk8.js";
import "./oauth-CNbgPg6s.js";
import "./profiles-Bs4Dh6yw.js";
import "./repair-B8-NZG-S.js";
import "./order-DjOYyPH4.js";
import "./usage-CJb2EUW2.js";
//#region src/agents/auth-profiles/display.ts
/** Builds the human-readable profile label used in status and auth listings. */
function resolveAuthProfileDisplayLabel(params) {
	const { displayName, email } = resolveAuthProfileMetadata(params);
	if (displayName) return `${params.profileId} (${displayName})`;
	if (email) return `${params.profileId} (${email})`;
	return params.profileId;
}
//#endregion
//#region src/agents/auth-profiles/portability.ts
/**
* Auth profile portability for agent-local copies.
* Decides which credentials can be copied to spawned agents without leaking or
* duplicating unsafe OAuth refresh material.
*/
function hasAgentCopyOverride(credential) {
	return typeof credential.copyToAgents === "boolean" ? credential.copyToAgents : void 0;
}
function hasCopyableOAuthMaterial(credential) {
	if (credential.type !== "oauth") return false;
	return [credential.access, credential.refresh].some((value) => typeof value === "string" && value.trim().length > 0);
}
/** Resolves whether a credential can be copied into an agent-local store. */
function resolveAuthProfilePortability(credential) {
	const override = hasAgentCopyOverride(credential);
	if (override === false) return {
		portable: false,
		reason: "credential-opted-out"
	};
	if (credential.type === "oauth") {
		if (!hasCopyableOAuthMaterial(credential)) return {
			portable: false,
			reason: "non-portable-oauth-refresh-token"
		};
		return override === true ? {
			portable: true,
			reason: "oauth-provider-opted-in"
		} : {
			portable: false,
			reason: "non-portable-oauth-refresh-token"
		};
	}
	return {
		portable: true,
		reason: "portable-static-credential"
	};
}
/** Returns true when a credential can be copied into an agent-local store. */
function isAuthProfileCredentialPortableForAgentCopy(credential) {
	return resolveAuthProfilePortability(credential).portable;
}
/** Builds an agent-copy store containing only portable credentials and their order. */
function buildPortableAuthProfileStoreForAgentCopy(store) {
	const copiedProfileIds = [];
	const skippedProfileIds = [];
	const profiles = Object.fromEntries(Object.entries(store.profiles).flatMap(([profileId, credential]) => {
		if (!isAuthProfileCredentialPortableForAgentCopy(credential)) {
			skippedProfileIds.push(profileId);
			return [];
		}
		copiedProfileIds.push(profileId);
		return [[profileId, credential]];
	}));
	const copiedSet = new Set(copiedProfileIds);
	const order = Object.fromEntries(Object.entries(store.order ?? {}).map(([provider, ids]) => [provider, ids.filter((id) => copiedSet.has(id))]).filter(([, ids]) => ids.length > 0));
	return {
		store: {
			version: 1,
			profiles,
			...Object.keys(order).length > 0 ? { order } : {}
		},
		copiedProfileIds,
		skippedProfileIds
	};
}
//#endregion
export { resolveAuthProfileDisplayLabel as i, isAuthProfileCredentialPortableForAgentCopy as n, resolveAuthProfilePortability as r, buildPortableAuthProfileStoreForAgentCopy as t };
