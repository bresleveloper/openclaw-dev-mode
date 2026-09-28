const require_resolve_allowlist = require("./resolve-allowlist-CHzaaWiC.cjs");
let openclaw_plugin_sdk_runtime_env = require("openclaw/plugin-sdk/runtime-env");
let openclaw_plugin_sdk_provider_auth = require("openclaw/plugin-sdk/provider-auth");
let openclaw_plugin_sdk_provider_auth_runtime = require("openclaw/plugin-sdk/provider-auth-runtime");
//#region extensions/msteams/src/oauth.flow.ts
function shouldUseManualOAuthFlow(isRemote) {
	return isRemote || (0, openclaw_plugin_sdk_runtime_env.isWSL2Sync)();
}
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
	const scopes = params.scopes ?? require_resolve_allowlist.MSTEAMS_DEFAULT_DELEGATED_SCOPES;
	const needsManual = shouldUseManualOAuthFlow(ctx.isRemote);
	await ctx.note(needsManual ? [
		"You are running in a remote/VPS environment.",
		"A URL will be shown for you to open in your LOCAL browser.",
		"After signing in, copy the redirect URL and paste it back here."
	].join("\n") : [
		"Browser will open for Microsoft authentication.",
		`Sign in to grant delegated permissions for MSTeams.`,
		`The callback will be captured automatically on localhost:${require_resolve_allowlist.MSTEAMS_OAUTH_CALLBACK_PORT}.`
	].join("\n"), "MSTeams Delegated OAuth");
	const { verifier, challenge } = (0, openclaw_plugin_sdk_provider_auth.generateHexPkceVerifierChallenge)();
	const state = (0, openclaw_plugin_sdk_provider_auth_runtime.generateOAuthState)();
	const authUrl = buildMSTeamsAuthUrl({
		tenantId: params.tenantId,
		clientId: params.clientId,
		challenge,
		state,
		scopes
	});
	if (needsManual) return manualFlow(ctx, authUrl, state, verifier, params);
	ctx.progress.update("Complete sign-in in browser...");
	try {
		await ctx.openUrl(authUrl);
	} catch {
		ctx.log(`\nOpen this URL in your browser:\n\n${authUrl}\n`);
	}
	try {
		const { code } = await (0, openclaw_plugin_sdk_provider_auth_runtime.waitForLocalOAuthCallback)({
			expectedState: state,
			timeoutMs: 3e5,
			port: require_resolve_allowlist.MSTEAMS_OAUTH_CALLBACK_PORT,
			callbackPath: require_resolve_allowlist.MSTEAMS_OAUTH_CALLBACK_PATH,
			redirectUri: require_resolve_allowlist.MSTEAMS_OAUTH_REDIRECT_URI,
			successTitle: "MSTeams Delegated OAuth complete",
			progressMessage: `Waiting for OAuth callback on ${require_resolve_allowlist.MSTEAMS_OAUTH_REDIRECT_URI}...`,
			onProgress: (msg) => ctx.progress.update(msg)
		});
		ctx.progress.update("Exchanging authorization code for tokens...");
		return await require_resolve_allowlist.exchangeMSTeamsCodeForTokens({
			tenantId: params.tenantId,
			clientId: params.clientId,
			clientSecret: params.clientSecret,
			code,
			verifier,
			scopes
		});
	} catch (err) {
		if (err instanceof Error && (err.message.includes("EADDRINUSE") || err.message.includes("port") || err.message.includes("listen"))) {
			ctx.progress.update("Local callback server failed. Switching to manual mode...");
			return manualFlow(ctx, authUrl, state, verifier, params, err);
		}
		throw err;
	}
}
async function manualFlow(ctx, authUrl, state, verifier, params, cause) {
	ctx.progress.update("OAuth URL ready");
	ctx.log(`\nOpen this URL in your LOCAL browser:\n\n${authUrl}\n`);
	ctx.progress.update("Waiting for you to paste the callback URL...");
	const callbackInput = await ctx.prompt("Paste the redirect URL here: ");
	const parsed = (0, openclaw_plugin_sdk_provider_auth_runtime.parseOAuthCallbackInput)(callbackInput, {
		missingState: "Missing 'state' parameter in URL. Paste the full redirect URL.",
		invalidInput: "Paste the full redirect URL (including code and state parameters), not just the authorization code."
	});
	if ("error" in parsed) throw new Error(parsed.error, cause ? { cause } : void 0);
	if (parsed.state !== state) throw new Error("OAuth state mismatch - please try again", cause ? { cause } : void 0);
	ctx.progress.update("Exchanging authorization code for tokens...");
	return require_resolve_allowlist.exchangeMSTeamsCodeForTokens({
		tenantId: params.tenantId,
		clientId: params.clientId,
		clientSecret: params.clientSecret,
		code: parsed.code,
		verifier,
		scopes: params.scopes
	});
}
//#endregion
exports.loginMSTeamsDelegated = loginMSTeamsDelegated;
