import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { p as resolveDefaultAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { s as getRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import "./config-Ciq2mxdN.mjs";
import { s as mintSecretSentinel } from "./sentinel-C86v7W15.mjs";
import { n as resolveApiKeyForProfile } from "./oauth-CIf65QWM.mjs";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-DVMYGogL.mjs";
import { b as resolveAuthStorePathForDisplay } from "./profiles-DblRQQgZ.mjs";
import { n as OAuthRefreshFailureError } from "./oauth-refresh-failure-CVji5U1C.mjs";
import { i as assertAuthProfileMigrationReady } from "./legacy-source-diagnostic-_PHHNz0J.mjs";
import { A as resolveProviderEntryApiKeyBinding, C as resolveAwsSdkAuthInfo, D as resolveProviderAuthOverride, E as resolveInlineProviderApiKeyCooldownUntil, F as shouldUseImplicitAwsSdkAuth, L as ProviderAuthError, M as resolveUsableCustomProviderApiKey, N as sentinelizeConfigSecretRefEnvApiKey, O as resolveProviderConfig, P as shouldPreferExplicitConfigApiKeyAuth, T as resolveConfiguredAwsSdkProfileAuth, U as resolveDirectProviderCredentialMode, b as profileTypeToAuthMode, d as resolveManagedSecretRefRuntimeProviderAuth, f as assertInlineProviderApiKeyUsable, g as hasSyntheticLocalProviderAuthConfig, h as hasSecretRefProviderApiKey, j as resolveProviderEntryApiKeyProfileReference, u as assertRuntimeProviderSecretOwnerAvailable, v as isConfigBackedInlineProviderApiKey, w as resolveConfigAwareEnvApiKey, x as projectResolvedProfileAuth, y as isManagedSecretRefApiKeyMarker } from "./loader-runtime-load-XbrcYJWd.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-BbOBKQM3.mjs";
import { a as resolveAuthProfileOrder, n as isStoredCredentialCompatibleWithAuthProvider, p as listProfilesForProvider } from "./order-BQhYF772.mjs";
import { m as resolveProviderEnvAuthLookupMaps, n as CUSTOM_LOCAL_AUTH_MARKER, s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CmdBc7TL.mjs";
import { f as resolveOwningPluginIdsForProviderRef } from "./providers-Bx7WoFEI.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-BcoYkagW.mjs";
import { C as resolveProviderDeprecatedAuthProfileIds, L as shouldDeferProviderSyntheticProfileAuthWithPlugin, i as buildProviderMissingAuthMessageWithPlugin, k as resolveProviderSyntheticAuthWithPlugin, v as prepareProviderSyntheticAuthWithPlugin } from "./provider-runtime-BofzCM_V.mjs";
import { r as resolveRuntimeSyntheticAuthProviderRefState } from "./synthetic-auth.runtime.js";
import "./auth-profiles-CYVlYrag.mjs";
import { t as resolveModelProviderAuthConfig } from "./model-auth-provider-route-qM_24l0u.mjs";
//#region src/agents/model-auth-openai.ts
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
function directOpenAIPlatformModelRequiresApiKey(params) {
	return normalizeProviderId(params.provider) === OPENAI_PROVIDER_ID && params.modelApi !== void 0 && normalizeLowercaseStringOrEmpty(params.modelApi) !== OPENAI_CODEX_RESPONSES_API;
}
function openAICodexTransportRequiresOAuth(params) {
	return normalizeProviderId(params.provider) === OPENAI_PROVIDER_ID && normalizeLowercaseStringOrEmpty(params.modelApi ?? "") === OPENAI_CODEX_RESPONSES_API;
}
function isAuthModeAllowedForModel(params) {
	if (openAICodexTransportRequiresOAuth(params)) return params.mode === "oauth" || params.mode === "token";
	return !directOpenAIPlatformModelRequiresApiKey(params) || params.mode === "api-key";
}
function assertAuthModeAllowedForModel(params) {
	if (isAuthModeAllowedForModel(params)) return;
	if (openAICodexTransportRequiresOAuth(params)) throw new Error(`Auth profile "${params.profileId}" uses ${params.mode} auth, but ${params.provider}/${params.modelApi} requires a ChatGPT subscription (OAuth or token) profile.`);
	throw new Error(`Auth profile "${params.profileId}" uses ${params.mode} auth, but ${params.provider}/${params.modelApi} requires an OpenAI API key profile.`);
}
//#endregion
//#region src/agents/model-auth-runtime.ts
/**
* Snapshot-aware and synthetic provider-auth availability.
*/
/** Builds stable env/synthetic auth lookup data for repeated provider checks. */
function createRuntimeProviderAuthLookup(params) {
	const env = params.env ?? process.env;
	const lookupParams = {
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env
	};
	const syntheticAuthProviderRefs = params.includePluginSyntheticAuth === false ? void 0 : resolveRuntimeSyntheticAuthProviderRefState(lookupParams);
	const authLookupMaps = resolveProviderEnvAuthLookupMaps(lookupParams);
	return {
		envApiKey: {
			aliasMap: authLookupMaps.aliasMap,
			candidateMap: authLookupMaps.envCandidateMap,
			authEvidenceMap: authLookupMaps.authEvidenceMap,
			skipSetupProviderFallback: true
		},
		setupProviderFallbackRefs: authLookupMaps.setupProviderFallbackRefs,
		syntheticAuthProviderRefs: syntheticAuthProviderRefs?.complete ? syntheticAuthProviderRefs.refs : void 0,
		syntheticAuthProviderRefsComplete: syntheticAuthProviderRefs?.complete
	};
}
function runtimeLookupAllowsSetupProviderFallback(params) {
	const refs = params.runtimeLookup?.setupProviderFallbackRefs;
	if (!refs?.length) return false;
	const normalizedProvider = normalizeProviderId(params.provider);
	const aliasTarget = params.runtimeLookup?.envApiKey.aliasMap?.[normalizedProvider];
	return refs.includes(normalizedProvider) || (aliasTarget ? refs.includes(aliasTarget) : false);
}
function resolveRuntimeEnvApiKeyLookupOptions(params) {
	const envApiKey = params.runtimeLookup?.envApiKey;
	if (!envApiKey) return;
	const skipSetupProviderFallback = envApiKey.skipSetupProviderFallback === true ? !runtimeLookupAllowsSetupProviderFallback(params) : envApiKey.skipSetupProviderFallback;
	return {
		...envApiKey,
		...skipSetupProviderFallback !== void 0 ? { skipSetupProviderFallback } : {}
	};
}
function listProviderSyntheticAuthRefs(params) {
	const refs = [params.provider];
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	if (params.modelApi) refs.push(params.modelApi);
	if (providerConfig?.api) refs.push(providerConfig.api);
	return normalizeUniqueStringEntries(refs.map((ref) => normalizeProviderId(ref)));
}
function shouldResolvePluginSyntheticAuth(params) {
	const syntheticAuthProviderRefs = params.runtimeLookup?.syntheticAuthProviderRefs;
	if (!syntheticAuthProviderRefs) return true;
	const eligibleRefs = new Set(normalizeUniqueStringEntries(syntheticAuthProviderRefs.map((ref) => normalizeProviderId(ref))));
	if (eligibleRefs.size === 0) return false;
	return listProviderSyntheticAuthRefs(params).some((ref) => eligibleRefs.has(ref));
}
function resolveRuntimeAvailableProviderAuth(params, resolveSyntheticAuth) {
	const provider = normalizeProviderId(params.provider);
	if (resolveProviderAuthOverride(params.cfg, provider) === "aws-sdk") return true;
	const inlineProviderApiKeyUsable = params.store ? (() => {
		const unusableUntil = resolveInlineProviderApiKeyCooldownUntil(params.store, provider);
		return unusableUntil === null || unusableUntil <= Date.now();
	})() : true;
	const envAuth = resolveEnvApiKey(provider, params.env, {
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		...resolveRuntimeEnvApiKeyLookupOptions({
			provider,
			runtimeLookup: params.runtimeLookup
		})
	});
	if (envAuth && isAuthModeAllowedForModel({
		provider,
		modelApi: params.modelApi,
		mode: envAuth.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key"
	}) && (!isConfigBackedInlineProviderApiKey({
		cfg: params.cfg,
		provider,
		source: envAuth.source,
		store: params.store
	}) || inlineProviderApiKeyUsable)) return true;
	if (resolveUsableCustomProviderApiKey({
		cfg: params.cfg,
		provider,
		env: params.env
	}) && inlineProviderApiKeyUsable) return true;
	const managedRuntimeAuth = resolveManagedSecretRefRuntimeProviderAuth({
		cfg: params.cfg,
		provider
	});
	if (managedRuntimeAuth && (!isConfigBackedInlineProviderApiKey({
		cfg: params.cfg,
		provider,
		source: managedRuntimeAuth.source,
		store: params.store
	}) || inlineProviderApiKeyUsable)) return true;
	if (hasSyntheticLocalProviderAuthConfig({
		cfg: params.cfg,
		provider
	})) return true;
	if (params.allowPluginSyntheticAuth !== false && shouldResolvePluginSyntheticAuth({
		cfg: params.cfg,
		provider,
		runtimeLookup: params.runtimeLookup
	})) return resolveSyntheticAuth(provider);
	return false;
}
/** Fast auth-availability check for runtime provider/model selection. */
function hasRuntimeAvailableProviderAuth(params) {
	return resolveRuntimeAvailableProviderAuth(params, (provider) => Boolean(resolveSyntheticLocalProviderAuth({
		cfg: params.cfg,
		provider,
		workspaceDir: params.workspaceDir,
		env: params.env
	})));
}
/** Prepare external auth only after immediate credentials and discovery scope permit it. */
async function prepareRuntimeAvailableProviderAuth(params) {
	params.signal?.throwIfAborted();
	return resolveRuntimeAvailableProviderAuth(params, async (provider) => Boolean(await prepareSyntheticLocalProviderAuth({
		...params,
		cfg: params.cfg,
		provider
	})));
}
function syntheticAuthLookup(params, config) {
	return {
		provider: params.provider,
		config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		modelApi: params.modelApi,
		context: {
			config,
			provider: params.provider,
			providerConfig: resolveProviderConfig(config, params.provider)
		}
	};
}
function resolveProviderSyntheticRuntimeAuth(params, resolveFromConfig = (config) => resolveProviderSyntheticAuthWithPlugin(syntheticAuthLookup(params, config))) {
	const runtimeAuth = resolveManagedSecretRefRuntimeProviderAuth(params);
	if (runtimeAuth) return { auth: runtimeAuth };
	if (hasSecretRefProviderApiKey(params.cfg, params.provider)) return { blockedOnManagedSecretRef: true };
	const directAuth = resolveFromConfig(params.cfg);
	if (!directAuth) return {};
	if (!isManagedSecretRefApiKeyMarker(directAuth.apiKey)) return { auth: directAuth };
	const runtimeConfig = getRuntimeConfigSnapshot();
	if (!runtimeConfig || runtimeConfig === params.cfg) return { blockedOnManagedSecretRef: true };
	const runtimePluginAuth = resolveFromConfig(runtimeConfig);
	const runtimeApiKey = runtimePluginAuth?.apiKey;
	if (!runtimePluginAuth || !runtimeApiKey || isNonSecretApiKeyMarker(runtimeApiKey)) return { blockedOnManagedSecretRef: true };
	return { auth: {
		...runtimePluginAuth,
		apiKey: params.secretSentinels ? mintSecretSentinel(runtimeApiKey, { label: `model-auth:${params.provider}` }) : runtimeApiKey
	} };
}
/** Prepare native readiness without widening explicit managed-credential authority. */
async function prepareSyntheticLocalProviderAuth(params) {
	if (params.allowPluginSyntheticAuth === false || hasSecretRefProviderApiKey(params.cfg, params.provider)) return resolveSyntheticLocalProviderAuth(params);
	const prepare = (config) => prepareProviderSyntheticAuthWithPlugin({
		...syntheticAuthLookup(params, config),
		signal: params.signal
	});
	const direct = await prepare(params.cfg);
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeAuth = direct && isManagedSecretRefApiKeyMarker(direct.apiKey) && runtimeConfig && runtimeConfig !== params.cfg ? await prepare(runtimeConfig) : void 0;
	return resolveSyntheticLocalProviderAuth(params, (config) => config === params.cfg ? direct : config === runtimeConfig ? runtimeAuth : void 0);
}
function resolveSyntheticLocalProviderAuth(params, resolveFromConfig) {
	const syntheticProviderAuth = params.allowPluginSyntheticAuth === false ? {} : resolveProviderSyntheticRuntimeAuth(params, resolveFromConfig);
	if (syntheticProviderAuth.auth) return syntheticProviderAuth.auth;
	if (syntheticProviderAuth.blockedOnManagedSecretRef) return null;
	if (hasSyntheticLocalProviderAuthConfig(params)) return {
		apiKey: CUSTOM_LOCAL_AUTH_MARKER,
		source: `models.providers.${params.provider} (synthetic local key)`,
		mode: "api-key"
	};
	return null;
}
//#endregion
//#region src/agents/model-auth-provider.ts
/**
* Ordered credential resolution for one provider request.
*/
const log = createSubsystemLogger("model-auth");
function assertAuthProfileNotRetired(params) {
	if (!params.deprecatedProfileIds.has(params.profileId)) return;
	throw new Error(`Auth profile "${params.profileId}" is retired. Run ${formatCliCommand("openclaw doctor --fix")}.`);
}
function shouldDeferSyntheticProfileAuth(params) {
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	return shouldDeferProviderSyntheticProfileAuthWithPlugin({
		provider: params.provider,
		config: params.cfg,
		modelApi: params.modelApi,
		context: {
			config: params.cfg,
			provider: params.provider,
			providerConfig,
			resolvedApiKey: params.resolvedApiKey
		}
	}) === true;
}
function resolveScopedAuthProfileStore(params) {
	return ensureAuthProfileStore(params.agentDir, {
		migrationProvider: params.provider,
		config: params.cfg,
		profileId: params.profileId,
		externalCli: externalCliDiscoveryForProviderAuth(params)
	});
}
function assertProviderAuthReady(params) {
	assertAuthProfileMigrationReady(params.agentDir, void 0, params.provider, params.cfg);
	assertRuntimeProviderSecretOwnerAvailable({
		cfg: params.cfg,
		provider: params.provider
	});
}
/** Resolves a stored provider-entry binding without general credential discovery. */
async function resolveProviderEntryApiKeyAuth(params) {
	params.signal?.throwIfAborted();
	const { provider, cfg } = params;
	assertProviderAuthReady(params);
	const reference = resolveProviderEntryApiKeyProfileReference(params);
	if (!("profileId" in reference)) return;
	assertAuthProfileNotRetired({
		profileId: reference.profileId,
		deprecatedProfileIds: new Set(resolveProviderDeprecatedAuthProfileIds({
			provider,
			config: cfg
		}))
	});
	const binding = await resolveProviderEntryApiKeyBinding(params);
	params.signal?.throwIfAborted();
	if (binding.kind === "profile-resolved") {
		assertAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			profileId: binding.auth.profileId ?? provider,
			mode: binding.auth.mode
		});
		return binding.auth;
	}
	if (binding.kind === "profile-incompatible") {
		const reason = binding.reason === "credential-class" ? "which is not a bearer-style auth class" : "which is not compatible with this provider entry's auth binding";
		const action = binding.reason === "credential-class" ? "Use an api-key or token profile, or set apiKey to a literal bearer token." : "Use a compatible provider auth alias, configure the referenced provider entry with the same baseUrl, or set apiKey to a literal bearer token.";
		throw new Error(`Per-entry apiKey "${binding.profileId}" for provider "${provider}" references a "${binding.credentialType}" credential for provider "${binding.credentialProvider}", ${reason}. ${action}`);
	}
	if (binding.kind === "profile-unresolved") {
		const cause = binding.error ? formatErrorMessage(binding.error) : "credential resolution returned no key";
		throw new Error(`Per-entry apiKey "${binding.profileId}" for provider "${provider}" matched a stored profile but failed to resolve: ${cause}. Fix the referenced profile or set apiKey to a literal bearer token.`);
	}
}
/** Resolves the credential that should be used for one provider request. */
async function resolveApiKeyForProviderCore(input) {
	input.signal?.throwIfAborted();
	const modelAuthConfig = resolveModelProviderAuthConfig({
		provider: input.provider,
		config: input.cfg,
		workspaceDir: input.workspaceDir,
		modelBaseUrl: input.modelBaseUrl
	});
	const changedAuthProvider = modelAuthConfig !== input.cfg;
	const params = {
		...input,
		cfg: modelAuthConfig
	};
	const { provider, cfg, profileId, preferredProfile } = params;
	let deprecatedProfileIds;
	const getDeprecatedProfileIds = () => deprecatedProfileIds ??= new Set(resolveProviderDeprecatedAuthProfileIds({
		provider,
		config: cfg
	}));
	const agentDir = params.agentDir?.trim() || (cfg ? resolveDefaultAgentDir(cfg) : void 0);
	assertProviderAuthReady({
		cfg,
		provider,
		agentDir
	});
	let scopedStore = params.store;
	const getScopedStore = (requestedProfileId) => scopedStore ??= resolveScopedAuthProfileStore({
		agentDir,
		cfg,
		provider,
		profileId: requestedProfileId,
		preferredProfile
	});
	if (profileId) {
		const awsSdkProfileAuth = resolveConfiguredAwsSdkProfileAuth({
			cfg,
			provider,
			profileId
		});
		if (awsSdkProfileAuth) return awsSdkProfileAuth;
		const store = getScopedStore(profileId);
		assertAuthProfileNotRetired({
			profileId,
			deprecatedProfileIds: getDeprecatedProfileIds()
		});
		const configuredProfileType = store.profiles[profileId]?.type;
		if (configuredProfileType) assertAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			profileId,
			mode: profileTypeToAuthMode(configuredProfileType)
		});
		const resolved = await resolveApiKeyForProfile({
			cfg,
			store,
			profileId,
			agentDir,
			signal: params.signal,
			forceRefresh: params.forceRefresh,
			allowProfileFallback: !params.lockedProfile
		});
		params.signal?.throwIfAborted();
		if (!resolved) throw new Error(`No credentials found for profile "${profileId}".`);
		const resolvedProfileId = resolved.profileId ?? profileId;
		if (params.lockedProfile && resolvedProfileId !== profileId) throw new Error("Locked auth profile resolution returned a different profile.");
		const credential = store.profiles[resolvedProfileId];
		if (changedAuthProvider && (!credential || !isStoredCredentialCompatibleWithAuthProvider({
			cfg,
			provider,
			credential
		}))) throw new Error(`Auth profile "${resolvedProfileId}" is not compatible with the resolved model endpoint for "${provider}".`);
		const mode = resolved.profileType ?? store.profiles[resolvedProfileId]?.type;
		const result = projectResolvedProfileAuth({
			apiKey: resolved.apiKey,
			enabled: params.secretSentinels,
			profileId: resolvedProfileId,
			provider,
			store,
			mode: mode ? profileTypeToAuthMode(mode) : "api-key"
		});
		assertAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			profileId: resolvedProfileId,
			mode: result.mode
		});
		if (!params.lockedProfile && shouldDeferSyntheticProfileAuth({
			cfg,
			provider,
			resolvedApiKey: resolved.apiKey,
			modelApi: params.modelApi
		})) return resolveApiKeyForProviderCore({
			...params,
			store,
			profileId: void 0,
			lockedProfile: true
		}).catch(() => {
			params.signal?.throwIfAborted();
			return result;
		});
		return result;
	}
	if (params.allowAuthProfileFallback !== false && (cfg?.auth?.profiles || cfg?.auth?.order)) {
		const store = getScopedStore();
		const configuredProfileOrder = resolveAuthProfileOrder({
			cfg,
			store,
			provider,
			preferredProfile,
			forModel: params.modelId
		});
		for (const candidate of configuredProfileOrder) {
			const awsSdkProfileAuth = resolveConfiguredAwsSdkProfileAuth({
				cfg,
				provider,
				profileId: candidate
			});
			if (awsSdkProfileAuth) return awsSdkProfileAuth;
		}
	}
	if (resolveProviderAuthOverride(cfg, provider) === "aws-sdk") return resolveAwsSdkAuthInfo();
	if (shouldUseImplicitAwsSdkAuth({
		cfg,
		provider,
		modelApi: params.modelApi
	})) return resolveAwsSdkAuthInfo();
	const modeAllowed = (mode) => isAuthModeAllowedForModel({
		provider,
		modelApi: params.modelApi,
		mode
	});
	const assertInlineSourceUsable = (source) => {
		const store = getScopedStore();
		if (isConfigBackedInlineProviderApiKey({
			cfg,
			provider,
			source,
			store
		})) assertInlineProviderApiKeyUsable({
			store,
			provider
		});
	};
	const resolveEnvAuth = () => {
		const resolved = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir, params.skipSetupProviderFallback);
		if (!resolved) return null;
		const mode = resolveDirectProviderCredentialMode({
			cfg,
			provider,
			inferredMode: resolved.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key"
		});
		if (mode === "api-key") assertInlineSourceUsable(resolved.source);
		if (!modeAllowed(mode)) return "incompatible";
		return {
			apiKey: sentinelizeConfigSecretRefEnvApiKey({
				apiKey: resolved.apiKey,
				source: resolved.source,
				cfg,
				provider,
				enabled: params.secretSentinels
			}),
			source: resolved.source,
			mode
		};
	};
	if (params.credentialPrecedence === "env-first") {
		const auth = resolveEnvAuth();
		if (auth === "incompatible") return resolveApiKeyForProviderCore({
			...params,
			credentialPrecedence: "profile-first"
		});
		if (auth) return auth;
	}
	const providerEntryAuth = await resolveProviderEntryApiKeyAuth({
		cfg,
		provider,
		store: getScopedStore(),
		agentDir,
		signal: params.signal,
		modelApi: params.modelApi,
		secretSentinels: params.secretSentinels
	});
	params.signal?.throwIfAborted();
	if (providerEntryAuth) return providerEntryAuth;
	if (shouldPreferExplicitConfigApiKeyAuth(cfg, provider)) {
		const runtimeCustomKey = resolveManagedSecretRefRuntimeProviderAuth({
			cfg,
			provider,
			secretSentinels: params.secretSentinels
		});
		if (runtimeCustomKey) {
			assertInlineProviderApiKeyUsable({
				store: getScopedStore(),
				provider
			});
			return runtimeCustomKey;
		}
		const customKey = resolveUsableCustomProviderApiKey({
			cfg,
			provider,
			secretSentinels: params.secretSentinels
		});
		if (customKey) {
			assertInlineProviderApiKeyUsable({
				store: getScopedStore(),
				provider
			});
			return {
				apiKey: customKey.apiKey,
				source: customKey.source,
				mode: "api-key"
			};
		}
	}
	const providerConfig = resolveProviderConfig(cfg, provider);
	const configuredLocalKey = resolveUsableCustomProviderApiKey({
		cfg,
		provider,
		secretSentinels: params.secretSentinels
	});
	if (configuredLocalKey && isNonSecretApiKeyMarker(configuredLocalKey.apiKey)) return {
		apiKey: configuredLocalKey.apiKey,
		source: configuredLocalKey.source,
		mode: "api-key"
	};
	const localMarkerEnv = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir, params.skipSetupProviderFallback);
	if (localMarkerEnv && isNonSecretApiKeyMarker(localMarkerEnv.apiKey)) return {
		apiKey: localMarkerEnv.apiKey,
		source: localMarkerEnv.source,
		mode: "api-key"
	};
	const store = getScopedStore();
	const order = params.allowAuthProfileFallback === false ? [] : resolveAuthProfileOrder({
		cfg,
		store,
		provider,
		preferredProfile,
		forModel: params.modelId,
		includePendingOAuthRefresh: true
	});
	let deferredAuthProfileResult = null;
	let refreshFailure;
	for (const candidate of order) {
		const candidateType = store.profiles[candidate]?.type;
		const candidateMode = candidateType ? profileTypeToAuthMode(candidateType) : void 0;
		if (candidateMode && !modeAllowed(candidateMode)) continue;
		if (getDeprecatedProfileIds().has(candidate)) continue;
		try {
			const awsSdkProfileAuth = resolveConfiguredAwsSdkProfileAuth({
				cfg,
				provider,
				profileId: candidate
			});
			if (awsSdkProfileAuth) return awsSdkProfileAuth;
			const resolved = await resolveApiKeyForProfile({
				cfg,
				store,
				profileId: candidate,
				agentDir,
				signal: params.signal,
				forceRefresh: params.forceRefresh
			});
			params.signal?.throwIfAborted();
			if (resolved) {
				const resolvedProfileId = resolved.profileId ?? candidate;
				const mode = resolved.profileType ?? store.profiles[resolvedProfileId]?.type;
				const result = projectResolvedProfileAuth({
					apiKey: resolved.apiKey,
					enabled: params.secretSentinels,
					profileId: resolvedProfileId,
					provider,
					store,
					mode: mode ? profileTypeToAuthMode(mode) : "api-key"
				});
				if (!modeAllowed(result.mode)) continue;
				if (shouldDeferSyntheticProfileAuth({
					cfg,
					provider,
					resolvedApiKey: resolved.apiKey,
					modelApi: params.modelApi
				})) {
					deferredAuthProfileResult ??= result;
					continue;
				}
				return result;
			}
		} catch (err) {
			params.signal?.throwIfAborted();
			if (err instanceof SecretSurfaceUnavailableError) throw err;
			if (!refreshFailure && err instanceof OAuthRefreshFailureError && (!candidateMode || modeAllowed(candidateMode))) refreshFailure = err;
			log.debug?.(`auth profile "${candidate}" failed for provider "${provider}": ${String(err)}`);
		}
	}
	if (refreshFailure) throw refreshFailure;
	const envAuth = resolveEnvAuth();
	if (envAuth && envAuth !== "incompatible") return envAuth;
	const managedRuntimeAuth = resolveManagedSecretRefRuntimeProviderAuth({
		cfg,
		provider,
		secretSentinels: params.secretSentinels
	});
	if (managedRuntimeAuth && modeAllowed(managedRuntimeAuth.mode)) {
		assertInlineSourceUsable(managedRuntimeAuth.source);
		return managedRuntimeAuth;
	}
	const customKey = resolveUsableCustomProviderApiKey({
		cfg,
		provider,
		secretSentinels: params.secretSentinels
	});
	if (customKey) {
		const mode = resolveDirectProviderCredentialMode({
			cfg,
			provider,
			inferredMode: "api-key"
		});
		if (modeAllowed(mode)) {
			assertInlineProviderApiKeyUsable({
				store: getScopedStore(),
				provider
			});
			return {
				apiKey: customKey.apiKey,
				source: customKey.source,
				mode
			};
		}
	}
	if (deferredAuthProfileResult) return deferredAuthProfileResult;
	const syntheticLocalAuth = await prepareSyntheticLocalProviderAuth({
		cfg,
		provider,
		modelApi: params.modelApi,
		workspaceDir: params.workspaceDir,
		secretSentinels: params.secretSentinels,
		allowPluginSyntheticAuth: params.allowAuthProfileFallback !== false
	});
	params.signal?.throwIfAborted();
	if (syntheticLocalAuth) return syntheticLocalAuth;
	const hasInlineConfiguredModels = Array.isArray(providerConfig?.models) && providerConfig.models.length > 0;
	if ((params.allowAuthProfileFallback !== false && !hasInlineConfiguredModels ? resolveOwningPluginIdsForProviderRef({
		provider,
		config: cfg
	}) : void 0)?.length) {
		const pluginMissingAuthMessage = buildProviderMissingAuthMessageWithPlugin({
			provider,
			config: cfg,
			context: {
				config: cfg,
				agentDir,
				env: process.env,
				provider,
				listProfileIds: (providerId) => listProfilesForProvider(store, providerId)
			}
		});
		if (pluginMissingAuthMessage) throw new ProviderAuthError("missing-provider-auth", provider, pluginMissingAuthMessage, { providerGuidance: true });
	}
	const authStorePath = resolveAuthStorePathForDisplay(agentDir);
	const agentDirContext = agentDir ? ` (agentDir: ${resolveUserPath(agentDir)})` : "";
	throw new ProviderAuthError("missing-provider-auth", provider, [
		`No API key found for provider "${provider}".`,
		`Auth store: ${authStorePath}${agentDirContext}.`,
		`Configure an API key (${formatCliCommand(`openclaw models auth paste-api-key --provider ${provider}`)}; add --agent <id> for a non-default agent) or copy only portable static auth profiles from the main agentDir.`
	].join(" "));
}
//#endregion
export { hasRuntimeAvailableProviderAuth as a, isAuthModeAllowedForModel as c, createRuntimeProviderAuthLookup as i, resolveProviderEntryApiKeyAuth as n, prepareRuntimeAvailableProviderAuth as o, resolveScopedAuthProfileStore as r, prepareSyntheticLocalProviderAuth as s, resolveApiKeyForProviderCore as t };
