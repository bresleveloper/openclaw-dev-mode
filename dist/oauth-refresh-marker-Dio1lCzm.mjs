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
/** Replace one claimed OAuth generation with an inert, schema-valid durable marker. */
function createOAuthRefreshFence(params) {
	const { access, refresh, expires: _expires, idToken: _idToken, oauthRef: _oauthRef, copyToAgents: _copyToAgents, ...rest } = params.credential;
	const claimId = randomBytes(16).toString("hex");
	const marker = (kind, secret) => `${OAUTH_REFRESH_FENCE_PREFIX}${claimId}:${kind}:${buildOAuthRefreshSecretDigest({
		profileId: params.profileId,
		provider: params.credential.provider,
		kind,
		secret
	})}`;
	return {
		...rest,
		type: "oauth",
		provider: params.credential.provider,
		access: marker("access", access),
		refresh: marker("refresh", refresh),
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
export { isSameOAuthRefreshGeneration as a, isPendingOAuthRefreshFence as i, createOAuthRefreshFence as n, isOAuthRefreshFence as r, createFailedOAuthRefreshFence as t };
