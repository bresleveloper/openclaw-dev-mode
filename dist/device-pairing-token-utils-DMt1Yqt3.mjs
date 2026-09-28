import { n as normalizeDeviceAuthScopes } from "./device-auth-C-STNejO.mjs";
import { t as generatePairingToken } from "./pairing-token-CzXJ-1-p.mjs";
//#region src/infra/device-pairing-token-utils.ts
const OPERATOR_SCOPE_PREFIX = "operator.";
/** Build one freshly generated role token while preserving requested lifecycle fields. */
function createDeviceAuthToken(params) {
	return {
		token: generatePairingToken(),
		role: params.role,
		scopes: params.scopes,
		issuer: params.issuer ?? (params.preserveExistingIssuer ? params.existing?.issuer : void 0),
		createdAtMs: params.existing?.createdAtMs ?? params.now,
		rotatedAtMs: params.rotatedAtMs,
		revokedAtMs: void 0,
		lastUsedAtMs: params.existing?.lastUsedAtMs
	};
}
/** Select scopes owned by one device-token role. */
function resolveRoleTokenScopes(role, scopes) {
	const normalized = normalizeDeviceAuthScopes(scopes);
	if (role === "operator") return normalized.filter((scope) => scope.startsWith(OPERATOR_SCOPE_PREFIX));
	return normalized.filter((scope) => !scope.startsWith(OPERATOR_SCOPE_PREFIX));
}
/** Summarize token metadata without exposing bearer token strings. */
function summarizeDeviceTokens(tokens) {
	if (!tokens) return;
	const summaries = Object.values(tokens).map((token) => ({
		role: token.role,
		scopes: token.scopes,
		createdAtMs: token.createdAtMs,
		rotatedAtMs: token.rotatedAtMs,
		revokedAtMs: token.revokedAtMs,
		lastUsedAtMs: token.lastUsedAtMs
	})).toSorted((a, b) => a.role.localeCompare(b.role));
	return summaries.length > 0 ? summaries : void 0;
}
//#endregion
export { resolveRoleTokenScopes as n, summarizeDeviceTokens as r, createDeviceAuthToken as t };
