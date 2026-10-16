import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/agents/auth-profiles/identity.ts
/**
* Auth profile id and display metadata helpers.
* Keeps profile id construction and human metadata lookup centralized for auth
* status, storage, and provider selection.
*/
/** Builds a provider-prefixed auth profile id. */
function buildAuthProfileId(params) {
	return `${normalizeOptionalString(params.profilePrefix) ?? params.providerId}:${normalizeOptionalString(params.profileName) ?? "default"}`;
}
/** Resolves display metadata for an auth profile from config/store. */
function resolveAuthProfileMetadata(params) {
	const configured = params.cfg?.auth?.profiles?.[params.profileId];
	const stored = params.store?.profiles[params.profileId];
	return {
		displayName: normalizeOptionalString(configured?.displayName) ?? normalizeOptionalString(stored?.displayName),
		email: normalizeOptionalString(configured?.email) ?? normalizeOptionalString(stored?.email)
	};
}
//#endregion
export { resolveAuthProfileMetadata as n, buildAuthProfileId as t };
