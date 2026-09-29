import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as isUserModelAuthProfileId } from "./profile-usage-stats-Uo3hJqOO.mjs";
import { n as readCodexCliCredentialsCached } from "./cli-credentials-Be2RCYO6.mjs";
import { M as resolveUsableCustomProviderApiKey, j as resolveProviderEntryApiKeyProfileReference } from "./loader-runtime-load-XbrcYJWd.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-BbOBKQM3.mjs";
import { a as resolveAuthProfileOrder, n as isStoredCredentialCompatibleWithAuthProvider } from "./order-BQhYF772.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CmdBc7TL.mjs";
import { l as loadAuthProfileStoreWithoutExternalProfiles, n as ensureAuthProfileStore } from "./store-runtime-BcoYkagW.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./auth-profiles-CYVlYrag.mjs";
import "./model-auth-CCIBdEPk.mjs";
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
		if (providerEntryProfileRef.mode === "token") return `token${label ? ` (${label})` : ""}`;
		return `api-key${label ? ` (${label})` : ""}`;
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
	if (envKey?.apiKey) {
		if (envKey.source.includes("OAUTH_TOKEN")) return `oauth (${envKey.source})`;
		return `api-key (${envKey.source})`;
	}
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
