import { t as sanitizeForLog } from "./ansi-zQGMgESZ.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
//#region src/agents/auth-profiles/oauth-refresh-failure.ts
/**
* OAuth refresh failure classification and operator hints.
* Parses provider/reason codes from refresh failures and formats safe login
* commands without trusting raw provider text.
*/
/** Error type that carries provider and classified OAuth refresh failure reason. */
var OAuthRefreshFailureError = class extends Error {
	constructor(params) {
		super(params.message, { cause: params.cause });
		this.name = "OAuthRefreshFailureError";
		this.provider = params.provider;
		this.reason = classifyOAuthRefreshFailureReason(params.message);
	}
};
const OAUTH_REFRESH_FAILURE_PROVIDER_RE = /OAuth token refresh failed for ([^:]+):/i;
const SAFE_PROVIDER_ID_RE = /^[a-z0-9][a-z0-9._-]*$/;
function isOAuthRefreshFailureMessage(message) {
	const lower = message.toLowerCase();
	return lower.includes("oauth token refresh failed") || lower.includes("access token could not be refreshed") || lower.includes("authentication session could not be refreshed automatically");
}
function extractOAuthRefreshFailureProvider(message) {
	const provider = message.match(OAUTH_REFRESH_FAILURE_PROVIDER_RE)?.[1]?.trim();
	return provider && provider.length > 0 ? provider : null;
}
function sanitizeOAuthRefreshFailureProvider(provider) {
	const normalized = normalizeProviderId(provider ? sanitizeForLog(provider).replaceAll("`", "").trim() : "");
	return normalized && SAFE_PROVIDER_ID_RE.test(normalized) ? normalized : null;
}
/** Classify a raw OAuth refresh failure message into a stable reason code. */
function classifyOAuthRefreshFailureReason(message) {
	const lower = message.toLowerCase();
	if (lower.includes("refresh_token_reused")) return "refresh_token_reused";
	if (lower.includes("invalid_grant")) return "invalid_grant";
	if (lower.includes("signing in again") || lower.includes("sign in again")) return "sign_in_again";
	if (lower.includes("invalid refresh token")) return "invalid_refresh_token";
	if (lower.includes("expired or revoked") || lower.includes("revoked")) return "revoked";
	return null;
}
/** Classify provider/reason from a user-facing OAuth refresh failure message. */
function classifyOAuthRefreshFailure(message) {
	if (!isOAuthRefreshFailureMessage(message)) return null;
	return {
		provider: sanitizeOAuthRefreshFailureProvider(extractOAuthRefreshFailureProvider(message)),
		reason: classifyOAuthRefreshFailureReason(message)
	};
}
/** Classify provider/reason from the structured OAuth refresh failure error. */
function classifyOAuthRefreshFailureError(err) {
	if (!(err instanceof OAuthRefreshFailureError)) return null;
	return {
		provider: sanitizeOAuthRefreshFailureProvider(err.provider),
		reason: err.reason
	};
}
/** Build the login command operators should run after OAuth refresh failure. */
function buildOAuthRefreshFailureLoginCommand(provider) {
	const sanitizedProvider = sanitizeOAuthRefreshFailureProvider(provider);
	return sanitizedProvider ? formatCliCommand(`openclaw models auth login --provider ${sanitizedProvider}`) : formatCliCommand("openclaw models auth login");
}
//#endregion
export { classifyOAuthRefreshFailureReason as a, classifyOAuthRefreshFailureError as i, buildOAuthRefreshFailureLoginCommand as n, classifyOAuthRefreshFailure as r, OAuthRefreshFailureError as t };
