import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { a as resolveAuthProfileOrder, n as isStoredCredentialCompatibleWithAuthProvider } from "./order-CElLtwMu.mjs";
import { r as readCodexCliCredentialsCached } from "./cli-credentials-DmMCeh52.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-kYfv_bUN.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CPdn6zH8.mjs";
import { b as resolveUsableCustomProviderApiKey, v as resolveProviderEntryApiKeyProfileReference } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { c as ensureAuthProfileStoreWithoutExternalProfilesAsync, h as loadAuthProfileStoreWithoutExternalProfiles, i as ensureAuthProfileStoreAsync, r as ensureAuthProfileStore } from "./store-runtime-CwqGD12G.mjs";
import { t as resolveAuthProfileDisplayLabel } from "./display-D4lohsyV.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import "./model-auth-CMoPmop7.mjs";
//#region src/agents/model-auth-label.ts
/** @deprecated Retained for the synchronous Plugin SDK model-header API. Use resolveModelAuthLabelAsync. */
function resolveModelAuthLabel(params) {
	if (!params.provider?.trim()) return;
	const profileOverride = params.sessionEntry?.authProfileOverride?.trim();
	return resolveModelAuthLabelFromStore(params, params.authStore ?? (params.includeExternalProfiles === false ? loadAuthProfileStoreWithoutExternalProfiles(params.agentDir, { profileId: profileOverride }) : ensureAuthProfileStore(params.agentDir, {
		profileId: profileOverride,
		externalCli: externalCliDiscoveryForProviderAuth({
			cfg: params.cfg,
			provider: normalizeProviderId(params.provider ?? ""),
			preferredProfile: profileOverride
		})
	})));
}
async function resolveModelAuthLabelAsync(params) {
	if (!params.provider?.trim()) return;
	const profileOverride = params.sessionEntry?.authProfileOverride?.trim();
	return resolveModelAuthLabelFromStore(params, params.authStore ?? (params.includeExternalProfiles === false ? await ensureAuthProfileStoreWithoutExternalProfilesAsync(params.agentDir, { profileId: profileOverride }) : await ensureAuthProfileStoreAsync(params.agentDir, {
		profileId: profileOverride,
		externalCli: externalCliDiscoveryForProviderAuth({
			cfg: params.cfg,
			provider: normalizeProviderId(params.provider),
			preferredProfile: profileOverride
		})
	})));
}
function resolveModelAuthLabelFromStore(params, store) {
	const resolvedProvider = params.provider?.trim();
	if (!resolvedProvider) return;
	const providerKey = normalizeProviderId(resolvedProvider);
	const profileOverride = params.sessionEntry?.authProfileOverride?.trim();
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
export { resolveModelAuthLabelAsync as n, resolveModelAuthLabel as t };
