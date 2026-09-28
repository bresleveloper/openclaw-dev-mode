import { Jn as string, Nt as array, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as MANAGED_GITHUB_PROFILE_ID_PATTERN } from "./github-identity-profile-id-BJzGq1wi.mjs";
//#region src/shared/github-oauth-values.ts
const githubOAuthTimestamp = number().int().nonnegative().safe();
const githubOAuthSecret = string().min(1).max(2048).regex(/^[^\r\n]+$/u);
const githubOAuthProfileId = string().regex(MANAGED_GITHUB_PROFILE_ID_PATTERN);
const githubOAuthScopes = array(string().min(1).max(64).regex(/^[a-z0-9:_-]+$/u)).max(32);
const githubOAuthRefreshFields = {
	accountId: number().int().positive().safe(),
	login: string().regex(/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/u),
	refreshToken: githubOAuthSecret,
	accessExpiresAtMs: githubOAuthTimestamp,
	refreshExpiresAtMs: githubOAuthTimestamp,
	scopes: githubOAuthScopes
};
const githubOAuthDeviceFields = {
	deviceCode: string().regex(/^[A-Za-z0-9_-]{40}$/u),
	userCode: string().regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/u),
	verificationUri: literal("https://github.com/login/device"),
	createdAtMs: githubOAuthTimestamp,
	expiresAtMs: githubOAuthTimestamp,
	pollIntervalMs: number().int().min(1e3).max(6e4),
	nextPollAtMs: githubOAuthTimestamp
};
function validGitHubDeviceTiming(record) {
	return record.expiresAtMs > record.createdAtMs && record.expiresAtMs - record.createdAtMs <= 9e5 && (record.nextPollAtMs === void 0 || record.nextPollAtMs >= record.createdAtMs && record.nextPollAtMs <= record.expiresAtMs);
}
//#endregion
export { githubOAuthSecret as a, githubOAuthScopes as i, githubOAuthProfileId as n, githubOAuthTimestamp as o, githubOAuthRefreshFields as r, validGitHubDeviceTiming as s, githubOAuthDeviceFields as t };
