import { o as resolveAuthProfileOrderWithMetadata } from "./order-BQhYF772.mjs";
import { o as loadAuthProfileStoreForRuntime } from "./store-runtime-BcoYkagW.mjs";
import { i as resolveCliBackendConfig, o as resolveCliRuntimeCanonicalProvider } from "./cli-backends-SxX34tmf.mjs";
import { t as resolveBundledCliBackendAuthPolicy } from "./cli-backend-auth-policy-BJQR9lNK.mjs";
//#region src/agents/cli-execution-auth.ts
const GOOGLE_GEMINI_CLI_PROVIDER_ID = "google-gemini-cli";
const GOOGLE_PROVIDER_ID = "google";
const CLAUDE_CLI_PROVIDER_ID = "claude-cli";
var CliExecutionAuthProfileError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "CliExecutionAuthProfileError";
	}
};
function cliBackendAcceptsAuthProfileForwarding(params) {
	const backend = resolveCliBackendConfig(params.provider, params.config, { agentId: params.agentId });
	return backend?.id === GOOGLE_GEMINI_CLI_PROVIDER_ID || backend?.id === CLAUDE_CLI_PROVIDER_ID;
}
/**
* Preserve the session account unless the user selects another or it was removed.
* A user-locked profile must fail closed rather than run as another user.
*/
function resolveCliExecutionAuthProfileId(params) {
	const loadStore = params.loadAuthProfileStoreForRuntime ?? loadAuthProfileStoreForRuntime;
	const selectedAuthProfileId = params.selected?.authProfileId?.trim();
	const hasExplicitSelection = selectedAuthProfileId && params.selected?.authProfileIdSource !== "auto";
	const sessionAuthProfileId = params.sessionBinding?.authProfileId?.trim();
	const store = loadStore(params.agentDir, {
		readOnly: true,
		allowKeychainPrompt: false,
		externalCliProviderIds: [params.cliExecutionProvider],
		profileId: hasExplicitSelection ? selectedAuthProfileId : sessionAuthProfileId ?? selectedAuthProfileId
	});
	const nativeAuthProfileIds = resolveBundledCliBackendAuthPolicy(params.cliExecutionProvider)?.nativeAuthProfileIds;
	if (!hasExplicitSelection && params.sessionBinding && !sessionAuthProfileId) return;
	const retainedProfileId = hasExplicitSelection ? selectedAuthProfileId : sessionAuthProfileId && (store.profiles[sessionAuthProfileId] || nativeAuthProfileIds?.includes(sessionAuthProfileId)) ? sessionAuthProfileId : void 0;
	const nativeProfileId = retainedProfileId ?? selectedAuthProfileId;
	if (nativeProfileId && nativeAuthProfileIds?.includes(nativeProfileId)) return;
	const canonicalProvider = resolveCliRuntimeCanonicalProvider({
		runtime: params.cliExecutionProvider,
		config: params.config,
		includeSetupRegistry: true
	});
	const acceptsCredential = (credential, explicitSelection) => credential.provider === params.cliExecutionProvider || credential.provider === canonicalProvider && (params.cliExecutionProvider === CLAUDE_CLI_PROVIDER_ID ? explicitSelection || credential.type !== "api_key" : params.cliExecutionProvider === GOOGLE_GEMINI_CLI_PROVIDER_ID && credential.type === "api_key");
	if (retainedProfileId) {
		const credential = store.profiles[retainedProfileId];
		if (!credential) throw new CliExecutionAuthProfileError(`No credentials found for profile "${retainedProfileId}".`);
		if (acceptsCredential(credential, true)) return retainedProfileId;
		throw new CliExecutionAuthProfileError(`CLI backend "${params.cliExecutionProvider}" cannot use auth profile "${retainedProfileId}" owned by "${credential.provider}".`);
	}
	const providers = [params.cliExecutionProvider];
	if (canonicalProvider && (params.cliExecutionProvider === CLAUDE_CLI_PROVIDER_ID || params.cliExecutionProvider === GOOGLE_GEMINI_CLI_PROVIDER_ID && params.authProfileProvider === GOOGLE_PROVIDER_ID)) providers.push(canonicalProvider);
	for (const provider of providers) {
		const order = resolveAuthProfileOrderWithMetadata({
			cfg: params.config,
			store,
			provider,
			preferredProfile: selectedAuthProfileId
		});
		const profileId = order.profileIds.find((id) => {
			const credential = store.profiles[id];
			return credential && acceptsCredential(credential, false) && !nativeAuthProfileIds?.includes(id);
		});
		if (profileId || order.hasExplicitOrder) return profileId;
	}
}
//#endregion
export { resolveCliExecutionAuthProfileId as n, cliBackendAcceptsAuthProfileForwarding as t };
