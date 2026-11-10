import { n as createCodexAuthProfileSelection } from "./auth-profile-selection-Bp5PDk3W.mjs";
import { embeddedAgentLog, resolveDefaultAgentDir } from "openclaw/plugin-sdk/agent-harness-registration";
import { resolveProviderIdForAuth } from "openclaw/plugin-sdk/provider-auth-aliases";
import { ensureAuthProfileStore, ensureAuthProfileStoreAsync, resolveAuthProfileOrder } from "openclaw/plugin-sdk/provider-auth";
//#region extensions/codex/src/app-server/auth-profile.ts
/** Worker-backed auth-profile selection and native provider identity. */
const CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER = "openai";
const PUBLIC_OPENAI_MODEL_PROVIDER = "openai";
async function resolveModelBackedReviewerPolicyProvider(params) {
	const modelProvider = params.modelProvider?.trim();
	if (modelProvider && modelProvider.toLowerCase() !== "codex") return modelProvider.toLowerCase() === "openai" ? "openai" : modelProvider;
	return await isCodexAppServerNativeAuthProfile(params) ? "openai" : void 0;
}
const { resolveCodexAppServerAuthProfileId, resolveCodexAppServerAuthProfileIdForAgent, resolveCodexAppServerAuthProfileStore } = createCodexAuthProfileSelection({
	ensureAuthProfileStore,
	ensureAuthProfileStoreAsync,
	resolveAuthProfileOrder
});
/** Returns true when an auth profile uses native Codex/OpenAI app-server auth. */
async function isCodexAppServerNativeAuthProfile(lookup) {
	const authProfileId = lookup.authProfileId?.trim();
	if (!authProfileId) return false;
	try {
		const credential = (lookup.authProfileStore ?? await ensureAuthProfileStoreAsync(lookup.agentDir?.trim() || resolveDefaultAgentDir(lookup.config ?? {}), {
			allowKeychainPrompt: false,
			config: lookup.config,
			externalCliProviderIds: [CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER],
			externalCliProfileIds: [authProfileId]
		})).profiles[authProfileId];
		if (!credential || credential.type === "api_key" || credential.type === "oauth" && (credential.authFlow === "chatgpt-token-sharing" || credential.authFlow === "chatgpt-identity")) return false;
		const provider = credential.provider?.trim();
		return Boolean(provider && resolveProviderIdForAuth(provider, { config: lookup.config }) === CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER);
	} catch (error) {
		embeddedAgentLog.debug("failed to resolve codex app-server auth profile provider", {
			authProfileId,
			error
		});
		return false;
	}
}
/** Hides redundant OpenAI provider attribution for native Codex auth bindings. */
async function normalizeCodexAppServerBindingModelProvider(params) {
	const modelProvider = params.modelProvider?.trim();
	if (!modelProvider) return;
	if (modelProvider.toLowerCase() === PUBLIC_OPENAI_MODEL_PROVIDER && await isCodexAppServerNativeAuthProfile(params)) return;
	return modelProvider;
}
//#endregion
export { resolveCodexAppServerAuthProfileStore as a, resolveCodexAppServerAuthProfileIdForAgent as i, normalizeCodexAppServerBindingModelProvider as n, resolveModelBackedReviewerPolicyProvider as o, resolveCodexAppServerAuthProfileId as r, isCodexAppServerNativeAuthProfile as t };
