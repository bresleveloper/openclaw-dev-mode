import { n as createCodexAuthProfileSelection } from "./auth-profile-selection-DFu9e167.mjs";
import { embeddedAgentLog, resolveDefaultAgentDir } from "openclaw/plugin-sdk/agent-harness-registration";
import { resolveProviderIdForAuth } from "openclaw/plugin-sdk/provider-auth-aliases";
import { ensureAuthProfileStore, resolveAuthProfileOrder } from "openclaw/plugin-sdk/provider-auth";
//#region extensions/codex/src/app-server/auth-profile.ts
/** Synchronous auth-profile selection and native provider identity. */
const CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER = "openai";
const PUBLIC_OPENAI_MODEL_PROVIDER = "openai";
const { resolveCodexAppServerAuthProfileId, resolveCodexAppServerAuthProfileIdForAgent, resolveCodexAppServerAuthProfileStore } = createCodexAuthProfileSelection({
	ensureAuthProfileStore,
	resolveAuthProfileOrder
});
/** Returns true when an auth profile uses native Codex/OpenAI app-server auth. */
function isCodexAppServerNativeAuthProfile(lookup) {
	const authProfileId = lookup.authProfileId?.trim();
	if (!authProfileId) return false;
	try {
		const credential = (lookup.authProfileStore ?? ensureAuthProfileStore(lookup.agentDir?.trim() || resolveDefaultAgentDir(lookup.config ?? {}), {
			allowKeychainPrompt: false,
			config: lookup.config,
			externalCliProviderIds: [CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER],
			externalCliProfileIds: [authProfileId]
		})).profiles[authProfileId];
		if (!credential || credential.type === "api_key") return false;
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
function normalizeCodexAppServerBindingModelProvider(params) {
	const modelProvider = params.modelProvider?.trim();
	if (!modelProvider) return;
	if (isCodexAppServerNativeAuthProfile(params) && modelProvider.toLowerCase() === PUBLIC_OPENAI_MODEL_PROVIDER) return;
	return modelProvider;
}
//#endregion
export { resolveCodexAppServerAuthProfileStore as a, resolveCodexAppServerAuthProfileIdForAgent as i, normalizeCodexAppServerBindingModelProvider as n, resolveCodexAppServerAuthProfileId as r, isCodexAppServerNativeAuthProfile as t };
