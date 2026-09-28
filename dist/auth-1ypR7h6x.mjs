import { n as findNormalizedProviderValue } from "./provider-id-DCtsDflE.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { n as resolveConfiguredSecretInputWithFallback, r as resolveRequiredConfiguredSecretRefInputString } from "./resolve-configured-secret-input-string-SF_iuPva.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { a as resolveAuthProfileOrder, p as listProfilesForProvider } from "./order-BQhYF772.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import "./provider-auth-C_UP8nFt.mjs";
import "./secret-input-runtime-C01-y7l7.mjs";
import "./domain-Bbe8oFEv.mjs";
import { n as PROVIDER_ID } from "./models-at_nI0o1.mjs";
import { i as parseGithubCopilotApiKey, n as formatGithubCopilotApiKey } from "./oauth-DdMBLDdj.mjs";
//#region extensions/github-copilot/auth.ts
async function resolveFirstGithubToken(params) {
	const authStore = ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false });
	const profileIds = listProfilesForProvider(authStore, PROVIDER_ID);
	const hasProfile = profileIds.length > 0;
	const requestedProfileId = params.profileId?.trim();
	const githubToken = normalizeOptionalSecretInput(params.env.COPILOT_GITHUB_TOKEN) ?? "";
	const providerConfig = params.config?.models?.providers?.[PROVIDER_ID];
	const configuredRefCanOwnAuth = providerConfig?.auth === void 0 || providerConfig.auth === "api-key" || providerConfig.auth === "token";
	const preferConfiguredToken = configuredRefCanOwnAuth && Boolean(coerceSecretRef(providerConfig?.apiKey, params.config?.secrets?.defaults)) || providerConfig?.auth === "api-key" && Boolean(normalizeOptionalSecretInput(providerConfig.apiKey));
	if (!requestedProfileId && (params.authProfileMode || preferConfiguredToken || githubToken || !hasProfile)) {
		if (githubToken && !preferConfiguredToken) return {
			githubToken,
			hasProfile: false
		};
		if (!params.config) return {
			githubToken: "",
			hasProfile: false
		};
		const resolved = await resolveConfiguredSecretInputWithFallback({
			config: params.config,
			env: params.env,
			value: configuredRefCanOwnAuth ? providerConfig?.apiKey : normalizeOptionalSecretInput(providerConfig?.apiKey),
			path: `models.providers.${PROVIDER_ID}.apiKey`,
			readFallback: () => ""
		});
		if (resolved.secretRefConfigured && !resolved.value) throw new Error(resolved.unresolvedRefReason ?? `models.providers.github-copilot.apiKey SecretRef is unresolved.`);
		return {
			githubToken: resolved.value?.trim() || githubToken,
			hasProfile: false
		};
	}
	const explicitProfileOrder = findNormalizedProviderValue(authStore.order, "github-copilot") ?? findNormalizedProviderValue(params.config?.auth?.order, "github-copilot");
	const profileId = requestedProfileId ? profileIds.find((candidate) => candidate === requestedProfileId) : explicitProfileOrder === void 0 ? profileIds[0] : resolveAuthProfileOrder({
		cfg: params.config,
		store: authStore,
		provider: PROVIDER_ID
	})[0];
	const profile = profileId ? authStore.profiles[profileId] : void 0;
	if (profile?.type === "oauth") {
		const formatted = formatGithubCopilotApiKey(profile);
		if (!normalizeOptionalSecretInput(profile.refresh)) return {
			githubToken: "",
			hasProfile
		};
		const parsed = parseGithubCopilotApiKey(formatted);
		return {
			...parsed,
			githubDomain: parsed.githubDomain ?? "github.com",
			hasProfile,
			profileId
		};
	}
	if (profile?.type !== "token") return {
		githubToken: "",
		hasProfile
	};
	return {
		githubToken: (await resolveRequiredConfiguredSecretRefInputString({
			config: params.config ?? {},
			env: params.env,
			value: profile.tokenRef,
			path: `providers.github-copilot.authProfiles.${profileId ?? "default"}.tokenRef`
		}) ?? profile.token ?? "").trim(),
		hasProfile,
		profileId
	};
}
//#endregion
export { resolveFirstGithubToken as t };
