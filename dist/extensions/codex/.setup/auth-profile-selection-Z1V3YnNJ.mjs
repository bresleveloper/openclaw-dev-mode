import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { resolveDefaultAgentDir } from "openclaw/plugin-sdk/agent-harness-registration";
// extensions/codex/src/app-server/auth-profile-selection.ts
const loadProviderAuthRuntime = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/provider-auth-runtime"));
const CODEX_APP_SERVER_AUTH_PROVIDER = "openai";
const CODEX_APP_SERVER_EXTERNAL_CLI_PROVIDER_IDS = [CODEX_APP_SERVER_AUTH_PROVIDER];
function createCodexAuthProfileSelection({ ensureAuthProfileStoreAsync, resolveAuthProfileOrder }) {
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
	/** Retain current selection authority through the guarded external effect. */
	async function withCodexAppServerAuthProfileIdAtEffect(params, consume) {
		const requested = params.authProfileId?.trim();
		if (requested) return consume({
			read: async () => requested,
			assertCurrent() {}
		});
		const agentDir = params.agentDir?.trim() || resolveDefaultAgentDir(params.config ?? {});
		const { withAuthProfileStoreAtEffect } = await loadProviderAuthRuntime();
		return withAuthProfileStoreAtEffect(agentDir, storeOptions(params), (reader) => consume({
			read: async () => resolveCodexAppServerAuthProfileId({
				...params,
				store: await reader.read()
			}),
			assertCurrent: () => reader.assertCurrent()
		}));
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
		withCodexAppServerAuthProfileIdAtEffect,
		resolveCodexAppServerAuthProfileStore
	};
}
export { createCodexAuthProfileSelection as n, CODEX_APP_SERVER_AUTH_PROVIDER as t };
