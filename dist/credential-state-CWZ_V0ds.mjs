import "./number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as coerceSecretRef, u as normalizeSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import { hash, randomBytes } from "node:crypto";
//#region src/agents/auth-profiles/oauth-refresh-marker.ts
const OAUTH_REFRESH_FENCE_PREFIX = "openclaw-oauth-refresh-fence:v1:";
const OAUTH_REFRESH_ACCESS_PATTERN = /^openclaw-oauth-refresh-fence:v1:([a-f0-9]{32}):(failed:)?access:([a-f0-9]{64})$/;
const OAUTH_REFRESH_TOKEN_PATTERN = /^openclaw-oauth-refresh-fence:v1:([a-f0-9]{32}):(failed:)?refresh:([a-f0-9]{64})$/;
function buildOAuthRefreshSecretDigest(params) {
	const generationInput = JSON.stringify([
		"openclaw.oauth-refresh-generation",
		1,
		params.profileId,
		params.provider,
		params.kind,
		params.secret
	]);
	return hash("sha256", generationInput, "hex");
}
function parseOAuthRefreshFence(credential) {
	if (!credential || credential.type !== "oauth" || credential.expires !== 1) return;
	const access = OAUTH_REFRESH_ACCESS_PATTERN.exec(credential.access);
	const refresh = OAUTH_REFRESH_TOKEN_PATTERN.exec(credential.refresh);
	if (!access || !refresh || access[1] !== refresh[1] || access[2] !== refresh[2]) return;
	return {
		accessDigest: access[3],
		claimId: access[1],
		refreshDigest: refresh[3],
		state: access[2] ? "failed" : "pending"
	};
}
/** Secret-free claim identity from already-owned credential publication facts. */
function readPendingOAuthRefreshClaimId(credential) {
	if (!isRecord(credential) || credential.type !== "oauth" || typeof credential.access !== "string" || typeof credential.refresh !== "string" || credential.expires !== 1) return;
	const marker = parseOAuthRefreshFence({
		type: "oauth",
		access: credential.access,
		refresh: credential.refresh,
		expires: credential.expires
	});
	return marker?.state === "pending" ? marker.claimId : void 0;
}
function captureOAuthRefreshClaimPublication(profiles, profileIds) {
	return new Map([...profileIds].map((profileId) => [profileId, readPendingOAuthRefreshClaimId(profiles[profileId])]));
}
/** Replace one claimed OAuth generation with an inert, schema-valid durable marker. */
function createOAuthRefreshFence(params) {
	const { access, refresh, expires: _expires, idToken: _idToken, oauthRef: _oauthRef, copyToAgents: _copyToAgents, ...rest } = params.credential;
	const claimId = randomBytes(16).toString("hex");
	return {
		...rest,
		type: "oauth",
		provider: params.credential.provider,
		access: `${OAUTH_REFRESH_FENCE_PREFIX}${claimId}:access:${buildOAuthRefreshSecretDigest({
			profileId: params.profileId,
			provider: params.credential.provider,
			kind: "access",
			secret: access
		})}`,
		refresh: `${OAUTH_REFRESH_FENCE_PREFIX}${claimId}:refresh:${buildOAuthRefreshSecretDigest({
			profileId: params.profileId,
			provider: params.credential.provider,
			kind: "refresh",
			secret: refresh
		})}`,
		expires: 1
	};
}
/** True only for the exact v1 inert marker shape written by the refresh owner. */
function isOAuthRefreshFence(credential) {
	return parseOAuthRefreshFence(credential) !== void 0;
}
/** True only while the durable refresh owner may still settle its claim. */
function isPendingOAuthRefreshFence(credential) {
	return parseOAuthRefreshFence(credential)?.state === "pending";
}
/** Mark a failed owner terminal without restoring its single-use refresh generation. */
function createFailedOAuthRefreshFence(credential) {
	const fence = parseOAuthRefreshFence(credential);
	if (!fence || fence.state === "failed") return credential;
	return {
		...credential,
		access: `${OAUTH_REFRESH_FENCE_PREFIX}${fence.claimId}:failed:access:${fence.accessDigest}`,
		refresh: `${OAUTH_REFRESH_FENCE_PREFIX}${fence.claimId}:failed:refresh:${fence.refreshDigest}`
	};
}
/** True when two persisted values share the same single-use refresh generation. */
function isSameOAuthRefreshGeneration(params) {
	if (params.left.provider !== params.right.provider) return false;
	return readOAuthRefreshGenerationDigest({
		profileId: params.profileId,
		credential: params.left
	}) === readOAuthRefreshGenerationDigest({
		profileId: params.profileId,
		credential: params.right
	});
}
/** The same secret-free generation identity for a credential and its durable fence. */
function readOAuthRefreshGenerationDigest(params) {
	return parseOAuthRefreshFence(params.credential)?.refreshDigest ?? buildOAuthRefreshSecretDigest({
		profileId: params.profileId,
		provider: params.credential.provider,
		kind: "refresh",
		secret: params.credential.refresh
	});
}
//#endregion
//#region src/agents/auth-profiles/credential-state.ts
/**
* Credential state classification for auth profiles.
* Centralizes expiry, missing-secret, and unresolved-reference checks used by
* auth selection, refresh, health, and doctor flows.
*/
/** Default OAuth access-token refresh margin before expiry. */
const DEFAULT_OAUTH_REFRESH_MARGIN_MS = 3e5;
/** Classifies a token expiry timestamp for auth selection and refresh logic. */
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
/** Returns true when an OAuth credential has a non-expiring access token. */
function hasUsableOAuthCredential(credential, opts) {
	if (!credential || credential.type !== "oauth" || isOAuthRefreshFence(credential)) return false;
	if (typeof credential.access !== "string" || credential.access.trim().length === 0) return false;
	const now = opts?.now ?? Date.now();
	const refreshMarginMs = Math.max(0, opts?.refreshMarginMs ?? 3e5);
	return resolveTokenExpiryState(credential.expires, now, { expiringWithinMs: refreshMarginMs }) === "valid";
}
function hasConfiguredSecretRef(value) {
	return coerceSecretRef(value) !== null;
}
function hasConfiguredSecretString(value) {
	return normalizeSecretInputString(value) !== void 0;
}
function isMalformedApiKeyInput(value) {
	const normalized = normalizeSecretInputString(value);
	return normalized !== void 0 && /^openclaw\s+onboard(?:\s+.*)?\s+--auth-choice(?:\s|=|$)/i.test(normalized);
}
/** Classifies whether a stored credential is eligible for auth selection. */
function evaluateStoredCredentialEligibility(params) {
	const now = params.now ?? Date.now();
	const credential = params.credential;
	if (credential.type === "api_key") {
		const hasKey = hasConfiguredSecretString(credential.key);
		const hasKeyRef = hasConfiguredSecretRef(credential.keyRef);
		if (isMalformedApiKeyInput(credential.key)) return {
			eligible: false,
			reasonCode: "malformed_api_key"
		};
		if (!hasKey && !hasKeyRef) return {
			eligible: false,
			reasonCode: "missing_credential"
		};
		return {
			eligible: true,
			reasonCode: "ok"
		};
	}
	if (credential.type === "token") {
		const hasToken = hasConfiguredSecretString(credential.token);
		const hasTokenRef = hasConfiguredSecretRef(credential.tokenRef);
		if (!hasToken && !hasTokenRef) return {
			eligible: false,
			reasonCode: "missing_credential"
		};
		const expiryState = resolveTokenExpiryState(credential.expires, now);
		if (expiryState === "invalid_expires") return {
			eligible: false,
			reasonCode: "invalid_expires"
		};
		if (expiryState === "expired") return {
			eligible: false,
			reasonCode: "expired"
		};
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
export { resolveTokenExpiryState as a, createOAuthRefreshFence as c, isSameOAuthRefreshGeneration as d, readOAuthRefreshGenerationDigest as f, isMalformedApiKeyInput as i, isOAuthRefreshFence as l, evaluateStoredCredentialEligibility as n, captureOAuthRefreshClaimPublication as o, readPendingOAuthRefreshClaimId as p, hasUsableOAuthCredential as r, createFailedOAuthRefreshFence as s, DEFAULT_OAUTH_REFRESH_MARGIN_MS as t, isPendingOAuthRefreshFence as u };
