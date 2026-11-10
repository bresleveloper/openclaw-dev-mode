import "./number-coercion-CkhMiRw8.mjs";
import { f as normalizeSecretInputString, h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { r as isOAuthRefreshFence } from "./oauth-refresh-marker-Dio1lCzm.mjs";
//#region src/agents/auth-profiles/credential-state.ts
const DEFAULT_OAUTH_REFRESH_MARGIN_MS = 3e5;
function resolveTokenExpiryState(expires, now = Date.now(), opts) {
	if (expires === void 0) return "missing";
	if (typeof expires !== "number") return "invalid_expires";
	if (!Number.isFinite(expires) || expires <= 0 || expires > 864e13) return "invalid_expires";
	const remainingMs = expires - now;
	if (remainingMs <= 0) return "expired";
	const expiringWithinMs = Math.max(0, opts?.expiringWithinMs ?? 0);
	if (expiringWithinMs > 0 && remainingMs <= expiringWithinMs) return "expiring";
	return "valid";
}
function hasUsableOAuthCredential(credential, opts) {
	if (!credential || credential.type !== "oauth" || isOAuthRefreshFence(credential)) return false;
	if (typeof credential.access !== "string" || credential.access.trim().length === 0) return false;
	const now = opts?.now ?? Date.now();
	const refreshMarginMs = Math.max(0, opts?.refreshMarginMs ?? 3e5);
	return resolveTokenExpiryState(credential.expires, now, { expiringWithinMs: refreshMarginMs }) === "valid";
}
function isMalformedApiKeyInput(value) {
	const normalized = normalizeSecretInputString(value);
	return normalized !== void 0 && /^openclaw\s+onboard(?:\s+.*)?\s+--auth-choice(?:\s|=|$)/i.test(normalized);
}
function evaluateStoredCredentialEligibility(params) {
	const now = params.now ?? Date.now();
	const credential = params.credential;
	if (credential.type === "api_key" || credential.type === "token") {
		const hasLiteral = normalizeSecretInputString(credential.type === "api_key" ? credential.key : credential.token) !== void 0;
		const hasRef = parseSecretRef(credential.type === "api_key" ? credential.keyRef : credential.tokenRef) !== null;
		if (credential.type === "api_key" && isMalformedApiKeyInput(credential.key)) return {
			eligible: false,
			reasonCode: "malformed_api_key"
		};
		if (!hasLiteral && !hasRef) return {
			eligible: false,
			reasonCode: "missing_credential"
		};
		if (credential.type === "token") {
			const expiryState = resolveTokenExpiryState(credential.expires, now);
			if (expiryState === "invalid_expires" || expiryState === "expired") return {
				eligible: false,
				reasonCode: expiryState
			};
		}
		return {
			eligible: true,
			reasonCode: "ok"
		};
	}
	if (isOAuthRefreshFence(credential)) return {
		eligible: false,
		reasonCode: "expired"
	};
	if (normalizeSecretInputString(credential.access) === void 0 && normalizeSecretInputString(credential.refresh) === void 0) {
		if (credential.oauthRef) return {
			eligible: false,
			reasonCode: "unresolved_ref"
		};
		return {
			eligible: false,
			reasonCode: "missing_credential"
		};
	}
	return {
		eligible: true,
		reasonCode: "ok"
	};
}
//#endregion
export { resolveTokenExpiryState as a, isMalformedApiKeyInput as i, evaluateStoredCredentialEligibility as n, hasUsableOAuthCredential as r, DEFAULT_OAUTH_REFRESH_MARGIN_MS as t };
