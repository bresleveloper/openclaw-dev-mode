const require_resolve_allowlist = require("./resolve-allowlist-gI34MnpE.cjs");
let openclaw_plugin_sdk_provider_auth = require("openclaw/plugin-sdk/provider-auth");
let openclaw_plugin_sdk_provider_auth_runtime = require("openclaw/plugin-sdk/provider-auth-runtime");
//#region extensions/msteams/src/oauth.flow.ts
function buildMSTeamsAuthUrl(params) {
	const scopes = params.scopes ?? require_resolve_allowlist.MSTEAMS_DEFAULT_DELEGATED_SCOPES;
	return `${require_resolve_allowlist.buildMSTeamsAuthEndpoint(params.tenantId)}?${new URLSearchParams({
		client_id: params.clientId,
		response_type: "code",
		redirect_uri: require_resolve_allowlist.MSTEAMS_OAUTH_REDIRECT_URI,
		scope: scopes.join(" "),
		code_challenge: params.challenge,
		code_challenge_method: "S256",
		state: params.state,
		prompt: "consent"
	}).toString()}`;
}
//#endregion
//#region extensions/msteams/src/oauth.ts
async function loginMSTeamsDelegated(ctx, params) {
	await ctx.note([
		"You are running in a remote/VPS environment.",
		"A URL will be shown for you to open in your LOCAL browser.",
		"After signing in, copy the redirect URL and paste it back here."
	].join("\n"), "MSTeams Delegated OAuth");
	const { verifier, challenge } = (0, openclaw_plugin_sdk_provider_auth.generateHexPkceVerifierChallenge)();
	const state = (0, openclaw_plugin_sdk_provider_auth_runtime.generateOAuthState)();
	const authUrl = buildMSTeamsAuthUrl({
		tenantId: params.tenantId,
		clientId: params.clientId,
		challenge,
		state,
		scopes: require_resolve_allowlist.MSTEAMS_DEFAULT_DELEGATED_SCOPES
	});
	ctx.progress.update("OAuth URL ready");
	ctx.log(`\nOpen this URL in your LOCAL browser:\n\n${authUrl}\n`);
	ctx.progress.update("Waiting for you to paste the callback URL...");
	const callbackInput = await ctx.prompt("Paste the redirect URL here: ");
	const parsed = (0, openclaw_plugin_sdk_provider_auth_runtime.parseOAuthCallbackInput)(callbackInput, {
		missingState: "Missing 'state' parameter in URL. Paste the full redirect URL.",
		invalidInput: "Paste the full redirect URL (including code and state parameters), not just the authorization code."
	});
	if ("error" in parsed) throw new Error(parsed.error);
	if (parsed.state !== state) throw new Error("OAuth state mismatch - please try again");
	ctx.progress.update("Exchanging authorization code for tokens...");
	return require_resolve_allowlist.exchangeMSTeamsCodeForTokens({
		tenantId: params.tenantId,
		clientId: params.clientId,
		clientSecret: params.clientSecret,
		code: parsed.code,
		verifier
	});
}
//#endregion
exports.loginMSTeamsDelegated = loginMSTeamsDelegated;
