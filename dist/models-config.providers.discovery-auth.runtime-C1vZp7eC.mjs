import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { _ as secretRefKey } from "./ref-contract-Bfd9_-Lp.mjs";
import { h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-NmgqOc1o.mjs";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-SptB0g_t.mjs";
import { n as resolveApiKeyForProfile } from "./oauth-RJ_g0pTu.mjs";
import { n as resolveAuthProfileSecretOwnerId } from "./runtime-auth-profile-owner-VtWriAt2.mjs";
//#region src/agents/models-config.providers.discovery-auth.runtime.ts
const unavailableDiscoveryAuthProfiles = /* @__PURE__ */ new WeakMap();
function throwUnavailableDiscoveryAuthProfile(profileId, error) {
	if (typeof error === "object" && error !== null) unavailableDiscoveryAuthProfiles.set(error, profileId);
	throw error;
}
function resolveUnavailableDiscoveryAuthProfileId(error) {
	return typeof error === "object" && error !== null ? unavailableDiscoveryAuthProfiles.get(error) : void 0;
}
/** Prepares transient auth facts without changing synchronous catalog callback contracts. */
async function prepareProviderDiscoveryAuth({ agentDir, authStore, env, resolveProviderApiKey, resolveProviderAuth }, config) {
	const profiles = /* @__PURE__ */ new Map();
	for (const [profileId, credential] of Object.entries(authStore.profiles)) {
		const field = credential.type === "api_key" ? "key" : "token";
		const ref = parseSecretRef(credential.type === "api_key" ? credential.keyRef : credential.type === "token" ? credential.tokenRef : void 0, config?.secrets?.defaults);
		if (!ref) continue;
		const envValue = ref.source === "env" ? normalizeOptionalString(env[ref.id.trim()]) : void 0;
		if (envValue) {
			profiles.set(profileId, () => envValue);
			continue;
		}
		try {
			const resolved = await resolveApiKeyForProfile({
				cfg: config,
				store: authStore,
				profileId,
				agentDir,
				allowProfileFallback: false
			});
			if (!resolved) throw new SecretSurfaceUnavailableError({
				ownerKind: "account",
				ownerId: resolveAuthProfileSecretOwnerId({
					agentDir,
					profileId
				}),
				state: "unavailable",
				paths: [`auth-profiles.${profileId}.${field}`],
				refKeys: [secretRefKey(ref)],
				reason: "resolved secret value was invalid"
			});
			profiles.set(profileId, () => resolved.apiKey);
		} catch (error) {
			profiles.set(profileId, () => throwUnavailableDiscoveryAuthProfile(profileId, error));
		}
	}
	const enrich = (auth) => {
		const resolve = auth.profileId ? profiles.get(auth.profileId) : void 0;
		return resolve ? {
			...auth,
			discoveryApiKey: resolve()
		} : auth;
	};
	return {
		resolveProviderApiKey: (provider) => enrich(resolveProviderApiKey(provider)),
		resolveProviderAuth: (provider, options) => enrich(resolveProviderAuth(provider, options))
	};
}
/** Excludes only failed expiring OAuth candidates for one live catalog hook. */
async function prepareProviderCatalogOAuthAuth({ agentDir, authStore, env, provider, resolveProviderAuth, isActive, onPreparationFailure }, config) {
	const failedProfileIds = [];
	const failures = [];
	let failedAuthFlow;
	let preparedProfile;
	while (isActive()) {
		let auth;
		try {
			auth = resolveProviderAuth(provider, { excludeProfileIds: failedProfileIds });
		} catch {
			break;
		}
		if (!auth.profileId || auth.mode !== "oauth") break;
		const credential = authStore.profiles[auth.profileId];
		if (credential?.type !== "oauth" || credential.oauthRef || hasUsableOAuthCredential(credential)) break;
		let message = "No OAuth credential was returned";
		try {
			const resolved = await resolveApiKeyForProfile({
				cfg: config,
				store: authStore,
				profileId: auth.profileId,
				agentDir,
				allowProfileFallback: false
			});
			if (resolved?.apiKey) {
				preparedProfile = {
					profileId: auth.profileId,
					apiKey: resolved.apiKey,
					authFlow: resolved.credential?.type === "oauth" ? resolved.credential.authFlow : void 0
				};
				break;
			}
		} catch (error) {
			message = sanitizeForLog(redactSensitiveText(formatErrorMessage(error), { mode: "tools" })).replace(/\s+/gu, " ").slice(0, 500);
		}
		failedProfileIds.push(auth.profileId);
		failures.push({
			profileId: auth.profileId,
			message
		});
		failedAuthFlow = auth.authFlow;
	}
	const resolvePreparedProviderAuth = (requestedProvider, options) => {
		const target = requestedProvider?.trim() || provider;
		const auth = resolveProviderAuth(target, {
			...options,
			excludeProfileIds: failedProfileIds
		});
		if (auth.mode === "none" && failedProfileIds.length > 0 && resolveProviderIdForAuth(target, {
			config,
			env
		}) === resolveProviderIdForAuth(provider, {
			config,
			env
		})) {
			onPreparationFailure(failedProfileIds);
			return {
				...auth,
				preparationFailed: true,
				...failedAuthFlow ? { authFlow: failedAuthFlow } : {}
			};
		}
		return preparedProfile && auth.profileId === preparedProfile.profileId ? {
			...auth,
			discoveryApiKey: preparedProfile.apiKey,
			authFlow: preparedProfile.authFlow
		} : auth;
	};
	return {
		resolveProviderAuth: resolvePreparedProviderAuth,
		failures
	};
}
//#endregion
export { prepareProviderCatalogOAuthAuth, prepareProviderDiscoveryAuth, resolveUnavailableDiscoveryAuthProfileId };
