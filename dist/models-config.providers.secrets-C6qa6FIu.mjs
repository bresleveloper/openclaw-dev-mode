import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { _ as secretRefKey } from "./ref-contract-Bfd9_-Lp.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { f as resolveConfigSecretRef } from "./resolution-facts-D_pto3MV.mjs";
import { r as isOAuthRefreshFence } from "./oauth-refresh-marker-Dio1lCzm.mjs";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-SptB0g_t.mjs";
import { s as resolveProviderAuthLookupMaps } from "./provider-env-vars-D43Pu6eG.mjs";
import { a as resolveAuthProfileOrder, i as resolveAuthProfileEligibility } from "./order-CElLtwMu.mjs";
import { r as resolveNonEnvSecretRefApiKeyMarker } from "./provider-credential-values-Cf7LMsFg.mjs";
import { d as resolveOAuthApiKeyMarker, o as isKnownEnvApiKeyMarker, s as isNonSecretApiKeyMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { M as resolveDirectProviderCredentialMode, g as resolveProviderConfigSecretInput, v as resolveProviderEntryApiKeyProfileReference } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { C as resolveProviderSyntheticAuthWithPlugin } from "./provider-runtime-DZ8luukj.mjs";
import { a as resolveApiKeyFromCredential, l as toDiscoveryApiKey, o as resolveApiKeyFromProfiles, s as resolveEnvApiKeyVarName } from "./models-config.providers.secret-helpers-_SdvipSt.mjs";
//#region src/agents/models-config.providers.secrets.ts
/**
* Provider auth resolution entry points used during model config generation.
* The resolvers return env/profile/config marker values so discovery can prove
* auth availability without writing secret material into generated config.
*/
function resolveAuthProfileStoreInput(input) {
	return typeof input === "function" ? input() : input;
}
function resolveCatalogProviderEntryAuth(params) {
	const input = resolveProviderConfigSecretInput(params.config, params.provider, params.sourceConfigForSecrets);
	if (input.ref || typeof input.providerConfig?.apiKey !== "string") return;
	const store = resolveAuthProfileStoreInput(params.authStoreInput);
	const reference = resolveProviderEntryApiKeyProfileReference({
		cfg: params.config,
		sourceConfig: params.sourceConfigForSecrets,
		provider: params.provider,
		store
	});
	if (reference.kind === "profile-incompatible") throw new Error(`Per-entry apiKey "${reference.profileId}" for provider "${params.provider}" references an incompatible auth profile.`);
	if (reference.kind !== "profile") return;
	if (!resolveAuthProfileEligibility({
		cfg: params.config,
		store,
		provider: reference.credential.provider,
		profileId: reference.profileId,
		authAliasLookupParams: {
			config: params.config,
			env: params.env
		}
	}).eligible) throw new Error(`Per-entry apiKey "${reference.profileId}" for provider "${params.provider}" matched an unusable stored profile.`);
	const resolved = resolveApiKeyFromCredential(reference.credential, params.env);
	if (!resolved) throw new Error(`Per-entry apiKey "${reference.profileId}" for provider "${params.provider}" matched a stored profile but failed to resolve.`);
	return {
		apiKey: resolved.apiKey,
		discoveryApiKey: resolved.discoveryApiKey,
		mode: reference.credential.type === "token" ? "token" : "api_key",
		source: "profile",
		profileId: reference.profileId
	};
}
function resolveCatalogAuthProfileOrder(params) {
	return resolveAuthProfileOrder({
		cfg: params.config,
		provider: params.provider,
		store: params.store,
		authAliasLookupParams: {
			config: params.config,
			env: params.env
		},
		cooldownScope: "all-models",
		readinessMode: "read-only"
	});
}
function resolveCatalogDirectAuthMode(config, provider) {
	const mode = resolveDirectProviderCredentialMode({
		cfg: config,
		provider,
		inferredMode: "api-key"
	});
	return mode === "oauth" || mode === "token" ? mode : "api_key";
}
/** Create a resolver over the credential map already selected for one lifecycle generation. */
function createProviderApiKeyResolverFromPreparedCredentials(env, credentials, config, workspaceDir) {
	const resolveConfiguredOrEnvironment = createProviderApiKeyResolver(env, {
		version: 1,
		profiles: {}
	}, config, void 0, workspaceDir);
	const getLookupCaches = createProviderAuthLookupCaches(env, config);
	return (provider) => {
		const authProvider = resolveProviderIdForAuthFromCaches(provider, getLookupCaches());
		const credential = credentials[authProvider];
		if (!credential) return resolveConfiguredOrEnvironment(provider);
		if (credential.type === "oauth") {
			if (isOAuthRefreshFence(credential)) return resolveConfiguredOrEnvironment(provider);
			return {
				apiKey: resolveOAuthApiKeyMarker(authProvider),
				discoveryApiKey: toDiscoveryApiKey(credential.access),
				mode: "oauth"
			};
		}
		const apiKey = credential.type === "token" ? credential.token : credential.key;
		if (!apiKey.trim() || credential.type === "token" && credential.expires !== void 0 && Date.now() >= credential.expires) return resolveConfiguredOrEnvironment(provider);
		return {
			apiKey,
			discoveryApiKey: toDiscoveryApiKey(apiKey),
			mode: credential.type
		};
	};
}
function createProviderAuthLookupCaches(env, config) {
	let caches;
	return () => caches ??= resolveProviderAuthLookupMaps({
		config,
		env
	});
}
function resolveProviderIdForAuthFromCaches(provider, caches) {
	const normalized = normalizeProviderId(provider);
	if (!normalized) return normalized;
	return caches.aliasMap[normalized] ?? normalized;
}
/** Create a resolver that returns redacted API-key markers for provider discovery. */
function createProviderApiKeyResolver(env, authStoreInput, config, sourceConfigForSecrets, workspaceDir, syntheticAuthEnv = env) {
	const getLookupCaches = createProviderAuthLookupCaches(env, config);
	return (provider) => {
		const lookupCaches = getLookupCaches();
		const authProvider = resolveProviderIdForAuthFromCaches(provider, lookupCaches);
		const direct = resolveDirectCatalogAuth({
			provider: authProvider,
			config,
			env,
			lookupCaches,
			sourceConfigForSecrets,
			workspaceDir,
			syntheticAuthEnv,
			authStoreInput
		});
		if (direct?.apiKey) return {
			apiKey: direct.apiKey,
			discoveryApiKey: direct.discoveryApiKey,
			mode: direct.mode,
			...direct.profileId ? { profileId: direct.profileId } : {}
		};
		const authStore = resolveAuthProfileStoreInput(authStoreInput);
		const fromProfiles = resolveApiKeyFromProfiles({
			provider: authProvider,
			store: authStore,
			env,
			profileIds: resolveCatalogAuthProfileOrder({
				config,
				env,
				provider,
				store: authStore
			})
		});
		return fromProfiles?.apiKey ? {
			apiKey: fromProfiles.apiKey,
			discoveryApiKey: fromProfiles.discoveryApiKey,
			profileId: fromProfiles.profileId,
			mode: fromProfiles.mode
		} : {
			apiKey: void 0,
			discoveryApiKey: void 0
		};
	};
}
/** Create a resolver that reports provider auth mode and provenance. */
function createProviderAuthResolver(env, authStoreInput, config, sourceConfigForSecrets, workspaceDir, syntheticAuthEnv = env) {
	const getLookupCaches = createProviderAuthLookupCaches(env, config);
	return (provider, options) => {
		const lookupCaches = getLookupCaches();
		const authProvider = resolveProviderIdForAuthFromCaches(provider, lookupCaches);
		const authStore = resolveAuthProfileStoreInput(authStoreInput);
		const binding = resolveCatalogProviderEntryAuth({
			provider: authProvider,
			config,
			sourceConfigForSecrets,
			authStoreInput: authStore,
			env
		});
		if (binding) return options?.excludeProfileIds?.includes(binding.profileId ?? "") ? {
			apiKey: void 0,
			mode: "none",
			source: "none"
		} : {
			...binding,
			source: "profile"
		};
		const excludedProfileIds = new Set(options?.excludeProfileIds);
		const ids = resolveCatalogAuthProfileOrder({
			config,
			env,
			provider,
			store: authStore
		});
		for (const id of ids) {
			if (excludedProfileIds.has(id)) continue;
			const cred = authStore.profiles[id];
			if (!cred) continue;
			if (cred.type === "oauth") {
				if (isOAuthRefreshFence(cred)) continue;
				return {
					apiKey: options?.oauthMarker,
					discoveryApiKey: toDiscoveryApiKey(cred.access),
					mode: "oauth",
					...cred.authFlow ? { authFlow: cred.authFlow } : {},
					source: "profile",
					profileId: id
				};
			}
			const resolved = resolveApiKeyFromCredential(cred, env);
			if (!resolved) continue;
			return {
				apiKey: resolved.apiKey,
				discoveryApiKey: resolved.discoveryApiKey,
				mode: cred.type,
				source: "profile",
				profileId: id
			};
		}
		return resolveDirectCatalogAuth({
			provider: authProvider,
			config,
			env,
			lookupCaches,
			sourceConfigForSecrets,
			workspaceDir,
			syntheticAuthEnv,
			authStoreInput: authStore
		}) ?? {
			apiKey: void 0,
			discoveryApiKey: void 0,
			mode: "none",
			source: "none"
		};
	};
}
function resolveDirectCatalogAuth(params) {
	const envVar = resolveEnvApiKeyVarName(params.provider, params.env, {
		aliasMap: params.lookupCaches.aliasMap,
		candidateMap: params.lookupCaches.envCandidateMap,
		authEvidenceMap: params.lookupCaches.authEvidenceMap
	});
	const auth = envVar ? {
		apiKey: envVar,
		discoveryApiKey: toDiscoveryApiKey(params.env[envVar]),
		mode: resolveCatalogDirectAuthMode(params.config, params.provider)
	} : resolveConfigBackedProviderAuth(params);
	return auth ? {
		apiKey: auth.apiKey,
		discoveryApiKey: auth.discoveryApiKey,
		mode: auth.mode,
		source: envVar ? "env" : auth.source ?? "none",
		...auth.profileId ? { profileId: auth.profileId } : {}
	} : void 0;
}
function resolveConfigBackedProviderAuth(params) {
	const authProvider = params.provider;
	const mode = resolveCatalogDirectAuthMode(params.config, authProvider);
	const apiKeyPath = `${appendConfigPathSegment("models.providers", authProvider)}.apiKey`;
	const sourceRef = resolveConfigSecretRef({
		config: params.sourceConfigForSecrets,
		path: apiKeyPath,
		value: params.sourceConfigForSecrets?.models?.providers?.[authProvider]?.apiKey,
		defaults: params.sourceConfigForSecrets?.secrets?.defaults
	});
	if (sourceRef && sourceRef.source !== "env") {
		const discoveryApiKey = params.config?.models?.providers?.[authProvider]?.apiKey;
		if (typeof discoveryApiKey !== "string" || !discoveryApiKey.trim()) throw new SecretSurfaceUnavailableError({
			ownerKind: "provider",
			ownerId: authProvider,
			state: "unavailable",
			paths: [apiKeyPath],
			refKeys: [secretRefKey(sourceRef)],
			reason: "secret reference was not materialized by the active runtime"
		});
		return {
			apiKey: resolveNonEnvSecretRefApiKeyMarker(sourceRef.source),
			discoveryApiKey,
			mode
		};
	}
	const binding = resolveCatalogProviderEntryAuth({
		...params,
		env: params.env ?? process.env
	});
	if (binding) return binding;
	const apiKey = resolveProviderSyntheticAuthWithPlugin({
		provider: authProvider,
		config: params.config,
		env: params.syntheticAuthEnv ?? params.env,
		workspaceDir: params.workspaceDir,
		context: {
			config: params.config,
			provider: authProvider,
			providerConfig: params.config?.models?.providers?.[authProvider]
		}
	})?.apiKey?.trim();
	if (apiKey) return {
		apiKey: isNonSecretApiKeyMarker(apiKey) ? apiKey : resolveNonEnvSecretRefApiKeyMarker("file"),
		discoveryApiKey: toDiscoveryApiKey(apiKey),
		mode
	};
	const configuredProviderApiKey = (params.config?.models?.providers?.[authProvider])?.apiKey;
	const configuredApiKeyRef = resolveConfigSecretRef({
		config: params.config,
		path: apiKeyPath,
		value: configuredProviderApiKey,
		defaults: params.config?.secrets?.defaults
	});
	if (configuredApiKeyRef && configuredApiKeyRef.source !== "env") return {
		apiKey: resolveNonEnvSecretRefApiKeyMarker(configuredApiKeyRef.source),
		mode
	};
	const configuredApiKey = configuredApiKeyRef?.id.trim() ?? (typeof configuredProviderApiKey === "string" ? configuredProviderApiKey.trim() : void 0);
	if (configuredApiKey === void 0 || !configuredApiKeyRef && !configuredApiKey) return;
	const discoveryValue = configuredApiKeyRef || isKnownEnvApiKeyMarker(configuredApiKey) ? params.env?.[configuredApiKey]?.trim() : configuredApiKey;
	if (!discoveryValue) return;
	return {
		apiKey: configuredApiKey,
		discoveryApiKey: toDiscoveryApiKey(discoveryValue),
		mode
	};
}
//#endregion
export { createProviderApiKeyResolverFromPreparedCredentials as n, createProviderAuthResolver as r, createProviderApiKeyResolver as t };
