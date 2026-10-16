import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { v as isUserModelAuthProfileId } from "./profile-usage-stats-BLwxBqRR.mjs";
import { n as readCodexCliCredentialsCached } from "./cli-credentials-iMPJTQjZ.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-CzdLbOjb.mjs";
import { a as resolveAuthProfileOrder, n as isStoredCredentialCompatibleWithAuthProvider } from "./order-B7W96aON.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CI3qSPg4.mjs";
import { x as resolveUsableCustomProviderApiKey, y as resolveProviderEntryApiKeyProfileReference } from "./model-auth-provider-config-U8dA4bob.mjs";
import { l as loadAuthProfileStoreWithoutExternalProfiles, n as ensureAuthProfileStore } from "./store-runtime-CzCCJ_Oe.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./auth-profiles-DqHEfJ-y.mjs";
import "./model-auth-DfAz5WFK.mjs";
//#region src/agents/model-auth-label.ts
/**
* Formats user-facing auth labels for resolved provider/model credentials.
*/
/** Resolve the display label that describes how a provider is authenticated. */
function resolveModelAuthLabel(params) {
	const resolvedProvider = params.provider?.trim();
	if (!resolvedProvider) return;
	const providerKey = normalizeProviderId(resolvedProvider);
	const profileOverride = params.sessionEntry?.authProfileOverride?.trim();
	const store = params.includeExternalProfiles === false ? loadAuthProfileStoreWithoutExternalProfiles(params.agentDir, { profileId: profileOverride }) : ensureAuthProfileStore(params.agentDir, {
		profileId: profileOverride,
		externalCli: externalCliDiscoveryForProviderAuth({
			cfg: params.cfg,
			provider: providerKey,
			preferredProfile: profileOverride
		})
	});
	const acceptedProviderKeys = uniqueStrings([...(params.acceptedProviderIds ?? []).map(normalizeProviderId), providerKey].filter(Boolean));
	const candidates = [profileOverride, ...uniqueStrings(acceptedProviderKeys.flatMap((acceptedProvider) => resolveAuthProfileOrder({
		cfg: params.cfg,
		store,
		provider: acceptedProvider,
		preferredProfile: profileOverride
	})))].filter(Boolean);
	for (const profileId of candidates) {
		const profile = store.profiles[profileId];
		if (!profile || !acceptedProviderKeys.some((acceptedProvider) => isStoredCredentialCompatibleWithAuthProvider({
			cfg: params.cfg,
			provider: acceptedProvider,
			credential: profile
		}))) continue;
		const label = isUserModelAuthProfileId(profileId) ? "personal account" : resolveAuthProfileDisplayLabel({
			cfg: params.cfg,
			store,
			profileId
		});
		return `${profile.type === "api_key" ? "api-key" : profile.type}${label ? ` (${label})` : ""}`;
	}
	const providerEntryProfileRef = resolveProviderEntryApiKeyProfileReference({
		cfg: params.cfg,
		provider: providerKey,
		store
	});
	if (providerEntryProfileRef.kind === "profile") {
		const label = resolveAuthProfileDisplayLabel({
			cfg: params.cfg,
			store,
			profileId: providerEntryProfileRef.profileId
		});
		return `${providerEntryProfileRef.mode === "token" ? "token" : "api-key"}${label ? ` (${label})` : ""}`;
	}
	if (providerEntryProfileRef.kind === "profile-incompatible") return "unknown";
	if (params.codexCliCredentialsHome && (providerKey === "openai" || providerKey === "codex") && readCodexCliCredentialsCached({
		codexHome: params.codexCliCredentialsHome,
		ttlMs: 5e3,
		allowKeychainPrompt: false
	})) return "oauth (codex-cli)";
	const envKey = resolveEnvApiKey(providerKey, process.env, {
		config: params.cfg,
		workspaceDir: params.workspaceDir
	});
	if (envKey?.apiKey) return `${envKey.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key"} (${envKey.source})`;
	if (providerKey === "codex" && readCodexCliCredentialsCached({
		ttlMs: 5e3,
		allowKeychainPrompt: false
	})) return "oauth (codex-cli)";
	if (providerKey === "claude-cli") return "native (claude-cli)";
	if (resolveUsableCustomProviderApiKey({
		cfg: params.cfg,
		provider: providerKey
	})) return `api-key (models.json)`;
	return "unknown";
}
//#endregion
export { resolveModelAuthLabel as t };
