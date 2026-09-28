import { a as buildOAuthRefreshFailureLoginCommand, f as formatProviderLoginCommand } from "./oauth-refresh-failure-CVji5U1C.mjs";
import { n as ProviderCredentialsSavedError, t as ProviderAuthConfigApplyError } from "./provider-auth-result-B4UlBTW7.mjs";
//#region src/auto-reply/provider-login-recovery.ts
function formatProviderLoginCompletion(choice, authRefresh, sessionSwitchFailed = false, selection) {
	const sessionFailure = selection ? `This chat kept its previous account. To use the new sign-in, send \`/model ${JSON.stringify(`${choice.providerId}/${selection.model}`)}@${JSON.stringify(selection.profileId)} -s\`.` : "This chat kept its previous account. Send /models to review the available models.";
	if (authRefresh === "refreshed") return sessionSwitchFailed ? `${choice.providerLabel} login complete. ${sessionFailure}` : `${choice.providerLabel} login complete. Try your request again now.`;
	const message = `${choice.providerLabel} credentials are saved. Sign-in status could not be confirmed. Send /login refresh to update it; you do not need to sign in again.`;
	return sessionSwitchFailed ? `${message} ${sessionFailure}` : message;
}
function formatProviderLoginFailure(choice, error) {
	if (error instanceof ProviderAuthConfigApplyError) return `${choice.providerLabel} credentials are saved, but the connection settings could not be applied. Open Models to review the connection settings and try again.`;
	if (error instanceof ProviderCredentialsSavedError) return `Some ${choice.providerLabel} sign-in details were saved, but setup is incomplete. Open Models to review the saved connection and finish setup.`;
	return `${choice.providerLabel} login did not complete. Send \`${formatProviderLoginCommand(choice.command)}\` to try again.`;
}
const AUTH_PROFILE_LOGIN_REASONS = /* @__PURE__ */ new Set([
	"auth",
	"auth_permanent",
	"session_expired"
]);
/** Builds login recovery only from OAuth evidence, never from a provider name alone. */
function buildProviderLoginRecovery(evidence) {
	if (!(evidence.oauthReason !== null && evidence.oauthReason !== void 0 ? true : evidence.authMode === "oauth" && evidence.failoverReason !== void 0 && AUTH_PROFILE_LOGIN_REASONS.has(evidence.failoverReason))) return;
	const command = buildOAuthRefreshFailureLoginCommand(evidence.provider, { surface: "chat" });
	return {
		hint: `Your model provider needs a new login. Send \`${command}\` from a private chat or Control UI session. Where shown, you can also select **Sign in**.`,
		presentation: { blocks: [{
			type: "buttons",
			buttons: [{
				label: "Sign in",
				action: {
					type: "command",
					command
				}
			}]
		}] }
	};
}
//#endregion
export { formatProviderLoginCompletion as n, formatProviderLoginFailure as r, buildProviderLoginRecovery as t };
