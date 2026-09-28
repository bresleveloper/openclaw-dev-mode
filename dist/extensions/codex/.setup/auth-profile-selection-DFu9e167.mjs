import { resolveDefaultAgentDir } from "openclaw/plugin-sdk/agent-harness-registration";
//#region extensions/codex/src/app-server/auth-profile-selection.ts
const CODEX_APP_SERVER_AUTH_PROVIDER = "openai";
const CODEX_APP_SERVER_EXTERNAL_CLI_PROVIDER_IDS = [CODEX_APP_SERVER_AUTH_PROVIDER];
function createCodexAuthProfileSelection({ ensureAuthProfileStore, resolveAuthProfileOrder }) {
	function resolveCodexAppServerAuthProfileId(params) {
		const requested = params.authProfileId?.trim();
		if (requested) return requested;
		return resolveAuthProfileOrder({
			cfg: params.config,
			store: params.store,
			provider: CODEX_APP_SERVER_AUTH_PROVIDER
		})[0]?.trim();
	}
	function resolveCodexAppServerAuthProfileIdForAgent(params) {
		const store = resolveCodexAppServerAuthProfileStore({
			agentDir: params.agentDir?.trim() || resolveDefaultAgentDir(params.config ?? {}),
			authProfileId: params.authProfileId,
			authProfileStore: params.authProfileStore,
			config: params.config
		});
		return resolveCodexAppServerAuthProfileId({
			authProfileId: params.authProfileId,
			store,
			config: params.config
		});
	}
	function resolveCodexAppServerAuthProfileStore(params) {
		if (params.authProfileStore) return params.authProfileStore;
		return ensureAuthProfileStore(params.agentDir, {
			profileId: params.authProfileId,
			allowKeychainPrompt: false,
			config: params.config,
			externalCliProviderIds: CODEX_APP_SERVER_EXTERNAL_CLI_PROVIDER_IDS,
			...params.authProfileId ? { externalCliProfileIds: [params.authProfileId] } : {}
		});
	}
	return {
		resolveCodexAppServerAuthProfileId,
		resolveCodexAppServerAuthProfileIdForAgent,
		resolveCodexAppServerAuthProfileStore
	};
}
//#endregion
export { createCodexAuthProfileSelection as n, CODEX_APP_SERVER_AUTH_PROVIDER as t };
