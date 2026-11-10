import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-wdC9jpCz.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { g as resolveDefaultAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as assertAuthProfileMigrationReady } from "./legacy-source-diagnostic-CLlkIevG.mjs";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-SptB0g_t.mjs";
import { a as isAuthModeAllowedForModel, i as assertAuthModeAllowedForModel } from "./model-runtime-policy-DSkspt0X.mjs";
import { n as OAuthRefreshFailureError } from "./oauth-refresh-failure-H1_-S915.mjs";
import { a as resolveAuthProfileOrder, f as listProfilesForProvider, n as isStoredCredentialCompatibleWithAuthProvider } from "./order-CElLtwMu.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { f as assertRuntimeProviderSecretOwnerAvailable, p as resolveManagedSecretRefRuntimeProviderAuth } from "./loader-runtime-load-DzFljQbT.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-kYfv_bUN.mjs";
import { C as shouldUseImplicitAwsSdkAuth, E as assertProviderAuthSupportsHttp, M as resolveDirectProviderCredentialMode, S as shouldPreferExplicitConfigApiKeyAuth, T as ProviderAuthError, _ as resolveProviderEntryApiKeyBinding, b as resolveUsableCustomProviderApiKey, c as profileTypeToAuthMode, d as resolveAwsSdkAuthInfo, f as resolveConfigAwareEnvApiKey, h as resolveProviderAuthOverride, l as projectResolvedProfileAuth, o as isConfigBackedInlineProviderApiKey, p as resolveConfiguredAwsSdkProfileAuth, t as assertInlineProviderApiKeyUsable, v as resolveProviderEntryApiKeyProfileReference, x as sentinelizeConfigSecretRefEnvApiKey } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { f as resolveOwningPluginIdsForProviderRef } from "./providers-3h1HIigh.mjs";
import { i as ensureAuthProfileStoreAsync, r as ensureAuthProfileStore } from "./store-runtime-CwqGD12G.mjs";
import { n as resolveApiKeyForProfile } from "./oauth-RJ_g0pTu.mjs";
import { l as resolveAuthStorePathForDisplayAsync } from "./oauth-refresh-fence-eL04wGfj.mjs";
import { A as shouldDeferProviderSyntheticProfileAuthWithPlugin, b as resolveProviderDeprecatedAuthProfileIds, i as buildProviderMissingAuthMessageWithPlugin } from "./provider-runtime-DZ8luukj.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { t as resolveModelProviderAuthConfig } from "./model-auth-provider-route-BGgWpgXk.mjs";
import { i as prepareSyntheticLocalProviderAuth } from "./model-auth-runtime-B0WXiQBY.mjs";
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
	const providerConfig = resolveMergedModelProviderConfig(params.cfg, params.provider);
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
/** @deprecated Use resolveScopedAuthProfileStoreAsync to read through the auth owner worker. */
function resolveScopedAuthProfileStore(params) {
	return ensureAuthProfileStore(params.agentDir, {
		migrationProvider: params.provider,
		config: params.cfg,
		profileId: params.profileId,
		externalCli: externalCliDiscoveryForProviderAuth(params)
	});
}
async function resolveScopedAuthProfileStoreAsync(params) {
	return ensureAuthProfileStoreAsync(params.agentDir, {
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
			modelBaseUrl: params.modelBaseUrl,
			capability: params.capability,
			profileId: binding.auth.profileId ?? provider,
			mode: binding.auth.mode,
			authFlow: binding.auth.authFlow
		});
		assertProviderAuthSupportsHttp(binding.auth, provider);
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
	const params = {
		...input,
		cfg: modelAuthConfig
	};
	const { provider, cfg, profileId, preferredProfile } = params;
	const modelPolicy = {
		provider,
		modelApi: params.modelApi,
		modelBaseUrl: params.modelBaseUrl,
		capability: params.capability
	};
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
	const getScopedStore = async (requestedProfileId) => scopedStore ??= await resolveScopedAuthProfileStoreAsync({
		agentDir,
		cfg,
		provider,
		profileId: requestedProfileId,
		preferredProfile
	});
	const projectProfileAuth = (resolved, resolvedProfileId, credential, store) => {
		const mode = resolved.profileType ?? credential?.type;
		return projectResolvedProfileAuth({
			apiKey: resolved.apiKey,
			enabled: params.secretSentinels,
			profileId: resolvedProfileId,
			provider,
			store,
			mode: mode ? profileTypeToAuthMode(mode) : "api-key",
			authFlow: credential?.type === "oauth" ? credential.authFlow : void 0
		});
	};
	if (profileId) {
		const awsSdkProfileAuth = resolveConfiguredAwsSdkProfileAuth({
			cfg,
			provider,
			profileId
		});
		if (awsSdkProfileAuth) return awsSdkProfileAuth;
		const store = await getScopedStore(profileId);
		assertAuthProfileNotRetired({
			profileId,
			deprecatedProfileIds: getDeprecatedProfileIds()
		});
		const configuredCredential = store.profiles[profileId];
		const assertCompatibleProfile = (credentialProvider, selectedProfileId = profileId) => {
			if (!isStoredCredentialCompatibleWithAuthProvider({
				cfg,
				provider,
				credential: { provider: credentialProvider }
			})) throw new Error(`Auth profile "${selectedProfileId}" is not compatible with the resolved model endpoint for "${provider}". Select a compatible provider profile.`);
		};
		if (configuredCredential) assertCompatibleProfile(configuredCredential.provider);
		const configuredProfileType = configuredCredential?.type;
		if (configuredProfileType) assertAuthModeAllowedForModel({
			...modelPolicy,
			profileId,
			mode: profileTypeToAuthMode(configuredProfileType),
			authFlow: configuredCredential?.type === "oauth" ? configuredCredential.authFlow : void 0
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
		const credential = resolved.credential ?? store.profiles[resolvedProfileId];
		assertCompatibleProfile(resolved.provider, resolvedProfileId);
		const result = projectProfileAuth(resolved, resolvedProfileId, credential, store);
		assertAuthModeAllowedForModel({
			...modelPolicy,
			profileId: resolvedProfileId,
			mode: result.mode,
			authFlow: result.authFlow
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
		}).catch((error) => {
			params.signal?.throwIfAborted();
			if (error instanceof OAuthRefreshFailureError || error instanceof SecretSurfaceUnavailableError) throw error;
			return result;
		});
		return result;
	}
	if (params.allowAuthProfileFallback !== false && (cfg?.auth?.profiles || cfg?.auth?.order)) {
		const store = await getScopedStore();
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
	const modeAllowed = (mode, authFlow) => isAuthModeAllowedForModel({
		...modelPolicy,
		mode,
		authFlow
	});
	const assertInlineSourceUsable = async (source) => {
		const store = await getScopedStore();
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
	const resolveEnvAuth = async () => {
		const resolved = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir, params.skipSetupProviderFallback);
		if (!resolved) return null;
		const mode = resolveDirectProviderCredentialMode({
			cfg,
			provider,
			inferredMode: resolved.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key"
		});
		if (mode === "api-key") await assertInlineSourceUsable(resolved.source);
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
		const auth = await resolveEnvAuth();
		if (auth === "incompatible") return resolveApiKeyForProviderCore({
			...params,
			credentialPrecedence: "profile-first"
		});
		if (auth) return auth;
	}
	const providerEntryAuth = await resolveProviderEntryApiKeyAuth({
		cfg,
		provider,
		store: await getScopedStore(),
		agentDir,
		signal: params.signal,
		modelApi: params.modelApi,
		modelBaseUrl: params.modelBaseUrl,
		capability: params.capability,
		secretSentinels: params.secretSentinels
	});
	params.signal?.throwIfAborted();
	if (providerEntryAuth) return providerEntryAuth;
	const directAuthParams = {
		cfg,
		provider,
		secretSentinels: params.secretSentinels
	};
	if (shouldPreferExplicitConfigApiKeyAuth(cfg, provider)) {
		const runtimeCustomKey = resolveManagedSecretRefRuntimeProviderAuth(directAuthParams);
		if (runtimeCustomKey) {
			assertInlineProviderApiKeyUsable({
				store: await getScopedStore(),
				provider
			});
			return runtimeCustomKey;
		}
		const customKey = resolveUsableCustomProviderApiKey(directAuthParams);
		if (customKey) {
			assertInlineProviderApiKeyUsable({
				store: await getScopedStore(),
				provider
			});
			return {
				...customKey,
				mode: "api-key"
			};
		}
	}
	const providerConfig = resolveMergedModelProviderConfig(cfg, provider);
	const configuredLocalKey = resolveUsableCustomProviderApiKey(directAuthParams);
	if (configuredLocalKey && isNonSecretApiKeyMarker(configuredLocalKey.apiKey)) return {
		...configuredLocalKey,
		mode: "api-key"
	};
	const localMarkerEnv = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir, params.skipSetupProviderFallback);
	if (localMarkerEnv && isNonSecretApiKeyMarker(localMarkerEnv.apiKey)) return {
		...localMarkerEnv,
		mode: "api-key"
	};
	const store = await getScopedStore();
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
		const candidateCredential = store.profiles[candidate];
		const candidateType = candidateCredential?.type;
		const candidateAuthFlow = candidateCredential?.type === "oauth" ? candidateCredential.authFlow : void 0;
		const candidateMode = candidateType ? profileTypeToAuthMode(candidateType) : void 0;
		if (candidateMode && !modeAllowed(candidateMode, candidateAuthFlow)) continue;
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
				const result = projectProfileAuth(resolved, resolvedProfileId, resolved.credential ?? store.profiles[resolvedProfileId], store);
				if (!modeAllowed(result.mode, result.authFlow)) continue;
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
			if (!refreshFailure && err instanceof OAuthRefreshFailureError && (!candidateMode || modeAllowed(candidateMode, candidateAuthFlow))) refreshFailure = err;
			log.debug?.(`auth profile "${candidate}" failed for provider "${provider}": ${String(err)}`);
		}
	}
	if (refreshFailure) throw refreshFailure;
	const envAuth = await resolveEnvAuth();
	if (envAuth && envAuth !== "incompatible") return envAuth;
	const managedRuntimeAuth = resolveManagedSecretRefRuntimeProviderAuth(directAuthParams);
	if (managedRuntimeAuth && modeAllowed(managedRuntimeAuth.mode)) {
		await assertInlineSourceUsable(managedRuntimeAuth.source);
		return managedRuntimeAuth;
	}
	const customKey = resolveUsableCustomProviderApiKey(directAuthParams);
	if (customKey) {
		const mode = resolveDirectProviderCredentialMode({
			cfg,
			provider,
			inferredMode: "api-key"
		});
		if (modeAllowed(mode)) {
			assertInlineProviderApiKeyUsable({
				store: await getScopedStore(),
				provider
			});
			return {
				...customKey,
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
	if (syntheticLocalAuth) {
		assertProviderAuthSupportsHttp(syntheticLocalAuth, provider);
		return syntheticLocalAuth;
	}
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
	const authStorePath = await resolveAuthStorePathForDisplayAsync(agentDir);
	const agentDirContext = agentDir ? ` (agentDir: ${resolveUserPath(agentDir)})` : "";
	throw new ProviderAuthError("missing-provider-auth", provider, [
		`No API key found for provider "${provider}".`,
		`Auth store: ${authStorePath}${agentDirContext}.`,
		`Configure an API key (${formatCliCommand(`openclaw models auth paste-api-key --provider ${provider}`)}; add --agent <id> for a non-default agent) or copy only portable static auth profiles from the main agentDir.`
	].join(" "));
}
//#endregion
export { resolveScopedAuthProfileStoreAsync as i, resolveProviderEntryApiKeyAuth as n, resolveScopedAuthProfileStore as r, resolveApiKeyForProviderCore as t };
