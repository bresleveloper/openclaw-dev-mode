//#region extensions/amazon-bedrock/aws-credential-refresh.ts
/**
* AWS shared config cache refresh helpers for Bedrock. They nudge the AWS SDK
* to re-read profile/SSO config when no static credentials are present.
*/
function hasStaticAwsCredentialEnv(env) {
	return Boolean(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY);
}
/** Return whether Bedrock should refresh the AWS shared config cache before discovery. */
function shouldRefreshAwsSharedConfigCacheForBedrock(env) {
	if (env.AWS_BEDROCK_SKIP_AUTH === "1" || env.AWS_BEARER_TOKEN_BEDROCK) return false;
	return !hasStaticAwsCredentialEnv(env);
}
/** Refresh Smithy shared config files when Bedrock needs default-chain credentials. */
async function refreshAwsSharedConfigCacheForBedrock(env = process.env) {
	if (!shouldRefreshAwsSharedConfigCacheForBedrock(env)) return;
	const { loadSharedConfigFiles } = await import("@smithy/shared-ini-file-loader");
	await loadSharedConfigFiles({ ignoreCache: true });
}
//#endregion
export { refreshAwsSharedConfigCacheForBedrock };
