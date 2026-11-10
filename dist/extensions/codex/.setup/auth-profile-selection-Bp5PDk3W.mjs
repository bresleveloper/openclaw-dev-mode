import { resolveDefaultAgentDir } from "openclaw/plugin-sdk/agent-harness-registration";
//#region extensions/codex/src/app-server/auth-profile-selection.ts
const CODEX_APP_SERVER_AUTH_PROVIDER = "openai";
const CODEX_APP_SERVER_EXTERNAL_CLI_PROVIDER_IDS = [CODEX_APP_SERVER_AUTH_PROVIDER];
function createCodexAuthProfileSelection({ ensureAuthProfileStore, ensureAuthProfileStoreAsync, resolveAuthProfileOrder }) {
	function resolveCodexAppServerAuthProfileId(params) {
		const requested = params.authProfileId?.trim();
		if (requested) return requested;
		return resolveAuthProfileOrder({
			cfg: params.config,
			store: params.store,
			provider: CODEX_APP_SERVER_AUTH_PROVIDER
		})[0]?.trim();
	}
	async function resolveCodexAppServerAuthProfileIdForAgent(params) {
		const requested = params.authProfileId?.trim();
		if (requested) return requested;
		const agentDir = params.agentDir?.trim() || resolveDefaultAgentDir(params.config ?? {});
		const store = await resolveCodexAppServerAuthProfileStore({
			...params,
			agentDir
		});
		return resolveCodexAppServerAuthProfileId({
			...params,
			store
		});
	}
	/** Current account selection for a synchronous external-effect guard only. */
	function resolveCodexAppServerAuthProfileIdAtEffect(params) {
		const requested = params.authProfileId?.trim();
		if (requested) return requested;
		const agentDir = params.agentDir?.trim() || resolveDefaultAgentDir(params.config ?? {});
		const store = params.authProfileStore ?? ensureAuthProfileStore(agentDir, storeOptions(params));
		return resolveCodexAppServerAuthProfileId({
			...params,
			store
		});
	}
	function storeOptions(params) {
		return {
			profileId: params.authProfileId,
			allowKeychainPrompt: false,
			config: params.config,
			externalCliProviderIds: CODEX_APP_SERVER_EXTERNAL_CLI_PROVIDER_IDS,
			...params.authProfileId ? { externalCliProfileIds: [params.authProfileId] } : {}
		};
	}
	async function resolveCodexAppServerAuthProfileStore(params) {
		if (params.authProfileStore) return params.authProfileStore;
		return ensureAuthProfileStoreAsync(params.agentDir, storeOptions(params));
	}
	return {
		resolveCodexAppServerAuthProfileId,
		resolveCodexAppServerAuthProfileIdForAgent,
		resolveCodexAppServerAuthProfileIdAtEffect,
		resolveCodexAppServerAuthProfileStore
	};
}
//#endregion
export { createCodexAuthProfileSelection as n, CODEX_APP_SERVER_AUTH_PROVIDER as t };
