//#region src/gateway/operator-identity-scopes.ts
/** Shared lookup for verified login grants; role policy still caps the result. */
function resolveIdentityOperatorScopes(verifiedIdentity, identityScopes) {
	const exact = identityScopes?.[verifiedIdentity];
	if (exact !== void 0 || !verifiedIdentity.includes("@")) return exact ?? [];
	const normalizedIdentity = verifiedIdentity.toLowerCase();
	return Object.entries(identityScopes ?? {}).find(([identity]) => identity.includes("@") && identity.toLowerCase() === normalizedIdentity)?.[1] ?? [];
}
//#endregion
export { resolveIdentityOperatorScopes as t };
