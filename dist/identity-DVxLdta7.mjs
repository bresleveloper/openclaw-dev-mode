import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/agents/auth-profiles/identity.ts
function buildAuthProfileId(params) {
	return `${normalizeOptionalString(params.profilePrefix) ?? params.providerId}:${normalizeOptionalString(params.profileName) ?? "default"}`;
}
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
