import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/agents/mcp-oauth-authorization-facts.ts
/** Refreshable expiry does not end the grant; terminal rejection and logout do. */
function hasMcpOAuthAuthorization(store) {
	return Boolean(store.tokens?.access_token && store.credentialState === void 0 && store.pendingAuthorizationChallenge?.requiresAuthorization !== true);
}
function projectMcpOAuthAuthorization(store) {
	return {
		authorizationId: hasMcpOAuthAuthorization(store) ? store.authorizationId ?? null : null,
		...!store.tokens?.refresh_token && store.tokenExpiresAt !== void 0 ? { expiresAt: store.tokenExpiresAt } : {}
	};
}
function isMcpOAuthAuthorizationReceipt(value) {
	if (!isRecord(value) || value.kind !== "mcp-oauth-authorization" || typeof value.storeKey !== "string" || !isRecord(value.authorization)) return false;
	const { authorizationId, expiresAt } = value.authorization;
	return (authorizationId === null || typeof authorizationId === "string" && authorizationId.length > 0) && (expiresAt === void 0 || typeof expiresAt === "number" && Number.isFinite(expiresAt));
}
//#endregion
export { isMcpOAuthAuthorizationReceipt as n, projectMcpOAuthAuthorization as r, hasMcpOAuthAuthorization as t };
