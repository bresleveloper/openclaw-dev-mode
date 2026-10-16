import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { A as resolveExpiresAtMsFromEpochSeconds } from "./number-coercion-CuVhdCBs.mjs";
import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { createHash, randomBytes } from "node:crypto";
//#region src/plugin-sdk/oauth-utils.ts
/**
* Encode a flat object as application/x-www-form-urlencoded form data.
*
* @deprecated OAuth provider-owned helper; keep this local to provider plugins instead.
*/
function toFormUrlEncoded(data) {
	return Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
}
/**
* Generate a PKCE verifier/challenge pair suitable for OAuth authorization flows.
*
* @deprecated OAuth provider-owned helper; keep this local to provider plugins instead.
*/
function generatePkceVerifierChallenge() {
	const verifier = randomBytes(32).toString("base64url");
	return {
		verifier,
		challenge: createHash("sha256").update(verifier).digest("base64url")
	};
}
/** Generate a PKCE verifier/challenge pair with a 64-character hex verifier. */
function generateHexPkceVerifierChallenge() {
	const verifier = randomBytes(32).toString("hex");
	return {
		verifier,
		challenge: createHash("sha256").update(verifier).digest("base64url")
	};
}
//#endregion
//#region src/plugin-sdk/provider-openai-chatgpt-auth.ts
const OPENAI_CODEX_AUTH_CLAIM = "https://api.openai.com/auth";
const OPENAI_CODEX_PROFILE_CLAIM = "https://api.openai.com/profile";
/**
* Decodes a JWT payload without verifying signatures for local metadata extraction.
*/
function decodeOpenAICodexJwtPayload(token) {
	const payload = token.split(".")[1];
	if (!payload) return;
	try {
		return safeParseJsonRecord(Buffer.from(payload, "base64url").toString("utf8"));
	} catch {
		return;
	}
}
function readRecord(value) {
	return asNonArrayRecord(value);
}
/**
* Resolves stable account/profile metadata from OpenAI Codex OAuth access-token claims.
*/
function resolveOpenAICodexAuthIdentity(params) {
	const payload = decodeOpenAICodexJwtPayload(params.access);
	const auth = readRecord(payload?.[OPENAI_CODEX_AUTH_CLAIM]);
	const profile = readRecord(payload?.[OPENAI_CODEX_PROFILE_CLAIM]);
	const email = normalizeOptionalString(profile.email) ?? normalizeOptionalString(params.email);
	const accountId = params.accountId ?? normalizeOptionalString(auth.chatgpt_account_id);
	const chatgptPlanType = normalizeOptionalString(auth.chatgpt_plan_type);
	if (email) return {
		...accountId ? { accountId } : {},
		...chatgptPlanType ? { chatgptPlanType } : {},
		email,
		profileName: email
	};
	const issuer = normalizeOptionalString(payload?.iss);
	const subject = normalizeOptionalString(payload?.sub);
	const stableSubject = normalizeOptionalString(auth.chatgpt_account_user_id) ?? normalizeOptionalString(auth.chatgpt_user_id) ?? normalizeOptionalString(auth.user_id) ?? (issuer && subject ? `${issuer}|${subject}` : subject);
	return {
		...accountId ? { accountId } : {},
		...chatgptPlanType ? { chatgptPlanType } : {},
		...stableSubject ? { profileName: `id-${Buffer.from(stableSubject).toString("base64url")}` } : {}
	};
}
/**
* Resolves the OAuth access-token expiry timestamp in milliseconds.
*/
function resolveOpenAICodexAccessTokenExpiry(access) {
	const exp = decodeOpenAICodexJwtPayload(access)?.exp;
	return resolveExpiresAtMsFromEpochSeconds(exp);
}
/**
* Builds persisted credential metadata for OpenAI Codex OAuth profiles.
*/
function buildOpenAICodexCredentialExtra(identity) {
	const extra = {
		...identity.accountId ? { accountId: identity.accountId } : {},
		...identity.chatgptPlanType ? { chatgptPlanType: identity.chatgptPlanType } : {},
		...identity.idToken ? { idToken: identity.idToken } : {}
	};
	return Object.keys(extra).length > 0 ? extra : void 0;
}
/**
* Picks the imported profile name used when migrating OpenAI Codex auth.
*/
function resolveOpenAICodexImportProfileName(identity, fallback) {
	if (identity.accountId) return `account-${identity.accountId.replaceAll(/[^A-Za-z0-9._-]+/gu, "-")}`;
	if (identity.profileName?.startsWith("id-")) return identity.profileName;
	return fallback;
}
//#endregion
export { resolveOpenAICodexImportProfileName as a, toFormUrlEncoded as c, resolveOpenAICodexAuthIdentity as i, decodeOpenAICodexJwtPayload as n, generateHexPkceVerifierChallenge as o, resolveOpenAICodexAccessTokenExpiry as r, generatePkceVerifierChallenge as s, buildOpenAICodexCredentialExtra as t };
