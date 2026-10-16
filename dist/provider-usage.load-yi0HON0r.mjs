import { c as trackAsyncWork } from "./async-work-scope-BYeX3gh6.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { o as resolveProviderAuthEnvVarCandidatesCore } from "./provider-env-vars-C_lyIdYO.mjs";
import { i as passesManifestOwnerBasePolicy, n as isActivatedManifestOwner } from "./manifest-owner-policy-B2H7kBCF.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { n as resolveApiKeyForProfile } from "./oauth-DPCtruSK.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-BDmQKwxy.mjs";
import { a as resolveAuthProfileOrder, d as dedupeProfileIds } from "./order-B7W96aON.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-Cuz_bq6T.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CI3qSPg4.mjs";
import { x as resolveUsableCustomProviderApiKey } from "./model-auth-provider-config-U8dA4bob.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles, n as ensureAuthProfileStore } from "./store-runtime-CzCCJ_Oe.mjs";
import { a as isOAuthOnlyUsageProvider, i as ignoredErrors, o as providerUsageLabel, s as raceUsageTimeout } from "./provider-usage.shared-B2Q7uCr7.mjs";
import { M as resolveProviderUsageAuthWithPlugin, N as resolveProviderUsageSnapshotWithPlugin, l as listProviderUsagePluginDescriptors } from "./provider-runtime-BMdc4CgR.mjs";
import "./model-selection-C1qxt1eY.mjs";
import "./auth-profiles-DqHEfJ-y.mjs";
import "./model-auth-DfAz5WFK.mjs";
import { r as resolveProxyFetchFromEnv } from "./proxy-fetch-Dq9J8411.mjs";
import { t as resolveFetch } from "./fetch-DG7ngghz.mjs";
//#region src/infra/provider-usage.auth.ts
function resolveUsageAuthStore(state) {
	state.store ??= state.getStore?.() ?? ensureAuthProfileStore(state.agentDir, { allowKeychainPrompt: false });
	return state.store;
}
function resolveProviderApiKeyFromConfig(params) {
	params.state.signal?.throwIfAborted();
	const envDirect = params.envDirect?.map(normalizeSecretInput).find(Boolean);
	if (envDirect) return envDirect;
	for (const providerId of params.providerIds) {
		const envKey = resolveEnvApiKey(providerId, params.state.env)?.apiKey;
		if (envKey) return envKey;
		const key = resolveUsableCustomProviderApiKey({
			cfg: params.state.cfg,
			provider: providerId,
			env: params.state.env
		})?.apiKey;
		if (key) return key;
	}
}
function hasProviderAuthEnvCredentialSource(params) {
	const candidates = resolveProviderAuthEnvVarCandidatesCore({
		config: params.state.cfg,
		env: {
			...process.env.VITEST ? process.env : {},
			...params.state.env
		}
	});
	return normalizeProviderIds(params.providerIds).some((providerId) => {
		return (Object.hasOwn(candidates, providerId) ? candidates[providerId] : void 0)?.some((envVar) => Boolean(normalizeSecretInput(params.state.env[envVar]))) ?? false;
	});
}
function hasProviderUsageAuthEnvCredentialSource(params) {
	const providerIds = new Set(normalizeProviderIds(params.providerIds));
	try {
		return loadManifestMetadataSnapshot({
			config: params.state.cfg,
			env: params.state.env
		}).plugins.some((plugin) => {
			if (!isUsageProviderManifestEligible({
				plugin,
				state: params.state
			})) return false;
			return Object.entries(plugin.providerUsageAuthEnvVars ?? {}).some(([providerId, envVars]) => providerIds.has(normalizeProviderId(providerId)) && envVars.some((envVar) => Boolean(normalizeSecretInput(params.state.env[envVar]))));
		});
	} catch {
		return false;
	}
}
function resolveProviderApiKeyCandidatesFromConfigAndStoreSync(params) {
	const candidates = [];
	const configKey = resolveProviderApiKeyFromConfig(params);
	if (configKey) candidates.push(configKey);
	if (!params.state.allowAuthProfileStore) return candidates;
	const store = resolveUsageAuthStore(params.state);
	const credentials = normalizeProviderIds(params.providerIds).flatMap((provider) => resolveAuthProfileOrder({
		cfg: params.state.cfg,
		store,
		provider
	})).map((id) => store.profiles[id]).filter((profile) => profile?.type === "api_key" || profile?.type === "token");
	for (const credential of credentials) {
		const value = normalizeSecretInput(credential.type === "api_key" ? credential.key : credential.token);
		if (value && !isNonSecretApiKeyMarker(value)) candidates.push(value);
	}
	return normalizeUniqueStringEntries(candidates);
}
async function resolveProviderApiKeyCandidatesFromConfigAndStore(params) {
	const candidates = [];
	const configKey = resolveProviderApiKeyFromConfig(params);
	if (configKey) candidates.push(configKey);
	if (!params.state.allowAuthProfileStore) return candidates;
	const store = resolveUsageAuthStore(params.state);
	const profileIds = dedupeProfileIds(normalizeProviderIds(params.providerIds).flatMap((provider) => resolveAuthProfileOrder({
		cfg: params.state.cfg,
		store,
		provider
	})));
	for (const profileId of profileIds) {
		const credential = store.profiles[profileId];
		if (!credential || credential.type !== "api_key" && credential.type !== "token") continue;
		let resolved;
		try {
			resolved = await resolveApiKeyForProfile({
				cfg: params.state.cfg,
				store,
				profileId,
				agentDir: params.state.agentDir
			});
			params.state.signal?.throwIfAborted();
		} catch {
			params.state.signal?.throwIfAborted();
			continue;
		}
		const value = normalizeSecretInput(resolved?.apiKey);
		if (value && !isNonSecretApiKeyMarker(value)) candidates.push(value);
	}
	return normalizeUniqueStringEntries(candidates);
}
function normalizeProviderIds(providerIds) {
	return normalizeUniqueStringEntries(Array.from(providerIds, (providerId) => providerId ? normalizeProviderId(providerId) : ""));
}
function isUsageProviderManifestEligible(params) {
	const normalizedConfig = normalizePluginsConfig(params.state.cfg.plugins);
	if (!passesManifestOwnerBasePolicy({
		plugin: params.plugin,
		normalizedConfig
	})) return false;
	if (params.plugin.origin !== "workspace") return true;
	return isActivatedManifestOwner({
		plugin: params.plugin,
		normalizedConfig,
		rootConfig: params.state.cfg
	});
}
function resolveUsageCredentialProviderIds(params) {
	const providerIds = new Set(normalizeProviderIds([params.provider]));
	const providerIdSet = new Set(providerIds);
	try {
		const snapshot = loadManifestMetadataSnapshot({
			config: params.state.cfg,
			env: params.state.env
		});
		for (const plugin of snapshot.plugins) {
			const pluginProviderIds = normalizeProviderIds(plugin.providers);
			if (!pluginProviderIds.some((providerId) => providerIdSet.has(providerId))) continue;
			if (!isUsageProviderManifestEligible({
				plugin,
				state: params.state
			})) continue;
			for (const providerId of pluginProviderIds) providerIds.add(providerId);
		}
	} catch {}
	return [...providerIds];
}
async function resolveOAuthToken(params) {
	params.state.signal?.throwIfAborted();
	if (!params.state.allowAuthProfileStore) return null;
	const store = resolveUsageAuthStore(params.state);
	const order = resolveAuthProfileOrder({
		cfg: params.state.cfg,
		store,
		provider: params.provider
	});
	const deduped = dedupeProfileIds(order);
	const excludedProfileIds = new Set(params.excludeProfileIds ?? []);
	for (const profileId of deduped) {
		if (excludedProfileIds.has(profileId)) continue;
		const cred = store.profiles[profileId];
		if (!cred || cred.type !== "oauth" && cred.type !== "token") continue;
		try {
			const resolved = await resolveApiKeyForProfile({
				cfg: params.state.cfg,
				store,
				profileId,
				agentDir: params.state.agentDir
			});
			params.state.signal?.throwIfAborted();
			if (!resolved) continue;
			const credential = resolved.credential ?? cred;
			return {
				provider: params.provider,
				token: resolved.apiKey,
				...credential.type === "oauth" && credential.authFlow ? { authFlow: credential.authFlow } : {},
				accountId: cred.type === "oauth" ? cred.accountId : void 0,
				...cred.type === "oauth" && cred.subscriptionType ? { subscriptionType: cred.subscriptionType } : {},
				...cred.type === "oauth" && cred.rateLimitTier ? { rateLimitTier: cred.rateLimitTier } : {},
				...cred.email ? { email: cred.email } : {}
			};
		} catch {
			params.state.signal?.throwIfAborted();
		}
	}
	return null;
}
async function resolveProviderUsageAuthViaPlugin(params) {
	const resolved = await resolveProviderUsageAuthWithPlugin({
		provider: params.provider,
		config: params.state.cfg,
		env: params.state.env,
		context: {
			signal: params.state.signal,
			config: params.state.cfg,
			agentDir: params.state.agentDir,
			env: params.state.env,
			provider: params.provider,
			resolveApiKeyFromConfigAndStore: (options) => resolveProviderApiKeyCandidatesFromConfigAndStoreSync({
				state: params.state,
				providerIds: options?.providerIds ?? [params.provider],
				envDirect: options?.envDirect
			})[0],
			resolveApiKeyCandidatesFromConfigAndStore: (options) => resolveProviderApiKeyCandidatesFromConfigAndStore({
				state: params.state,
				providerIds: options?.providerIds ?? [params.provider],
				envDirect: options?.envDirect
			}),
			resolveOAuthToken: async (options) => {
				const auth = await resolveOAuthToken({
					state: params.state,
					provider: options?.provider ?? params.provider,
					excludeProfileIds: options?.excludeProfileIds
				});
				return auth ? {
					token: auth.token,
					...auth.authFlow ? { authFlow: auth.authFlow } : {},
					...auth.accountId ? { accountId: auth.accountId } : {},
					...auth.subscriptionType ? { subscriptionType: auth.subscriptionType } : {},
					...auth.rateLimitTier ? { rateLimitTier: auth.rateLimitTier } : {},
					...auth.email ? { email: auth.email } : {}
				} : null;
			}
		}
	});
	if (!resolved) return {
		handled: false,
		auth: null
	};
	if ("handled" in resolved) return {
		handled: true,
		auth: null
	};
	return {
		handled: true,
		auth: {
			provider: params.provider,
			token: resolved.token,
			...resolved.accountId ? { accountId: resolved.accountId } : {},
			...resolved.subscriptionType ? { subscriptionType: resolved.subscriptionType } : {},
			...resolved.authFlow ? { authFlow: resolved.authFlow } : {},
			...resolved.rateLimitTier ? { rateLimitTier: resolved.rateLimitTier } : {},
			...resolved.email ? { email: resolved.email } : {}
		}
	};
}
async function resolveProviderUsageAuthFallback(params) {
	const oauthToken = await resolveOAuthToken({
		state: params.state,
		provider: params.provider
	});
	if (oauthToken) return oauthToken;
	if (isOAuthOnlyUsageProvider(params.provider)) return null;
	const apiKey = resolveProviderApiKeyCandidatesFromConfigAndStoreSync({
		state: params.state,
		providerIds: [params.provider]
	})[0];
	if (apiKey) return {
		provider: params.provider,
		token: apiKey
	};
	return null;
}
function hasAuthProfileCredentialSource(params) {
	const store = params.state.store ??= params.state.getStore?.() ?? ensureAuthProfileStoreWithoutExternalProfiles(params.state.agentDir, { allowKeychainPrompt: false });
	for (const provider of params.providerIds) {
		const order = resolveAuthProfileOrder({
			cfg: params.state.cfg,
			store,
			provider
		});
		if (dedupeProfileIds(order).some((profileId) => {
			const cred = store.profiles[profileId];
			return cred?.type === "oauth" || cred?.type === "token" || cred?.type === "api_key";
		})) return true;
	}
	return false;
}
async function resolveProviderAuths(params) {
	params.signal?.throwIfAborted();
	if (params.auth) return params.auth;
	const stateBase = {
		signal: params.signal,
		cfg: params.config ?? getRuntimeConfig(),
		env: params.env ?? process.env,
		agentDir: params.agentDir
	};
	const authProfileSourceState = {
		...stateBase,
		allowAuthProfileStore: true,
		getStore: params.getStore,
		store: params.store
	};
	const hasAuthProfileStoreSource = params.store !== void 0 || params.getStore !== void 0 || hasAnyAuthProfileStoreSource(params.agentDir);
	const auths = [];
	for (const provider of params.providers) {
		params.signal?.throwIfAborted();
		try {
			const directCredentialState = {
				...stateBase,
				allowAuthProfileStore: false
			};
			const credentialProviderIds = resolveUsageCredentialProviderIds({
				state: directCredentialState,
				provider
			});
			const allowAuthProfileStore = Boolean(resolveProviderApiKeyFromConfig({
				state: directCredentialState,
				providerIds: credentialProviderIds
			})) || hasProviderAuthEnvCredentialSource({
				state: directCredentialState,
				providerIds: credentialProviderIds
			}) || hasProviderUsageAuthEnvCredentialSource({
				state: directCredentialState,
				providerIds: credentialProviderIds
			}) || hasAuthProfileStoreSource && hasAuthProfileCredentialSource({
				state: authProfileSourceState,
				providerIds: credentialProviderIds
			});
			const state = {
				...authProfileSourceState,
				allowAuthProfileStore
			};
			if (allowAuthProfileStore) {
				const pluginAuth = await resolveProviderUsageAuthViaPlugin({
					state,
					provider
				});
				params.signal?.throwIfAborted();
				if (pluginAuth.auth) {
					auths.push(pluginAuth.auth);
					continue;
				}
				if (pluginAuth.handled) continue;
			}
			const fallbackAuth = await resolveProviderUsageAuthFallback({
				state,
				provider
			});
			params.signal?.throwIfAborted();
			if (fallbackAuth) auths.push(fallbackAuth);
		} catch (error) {
			params.signal?.throwIfAborted();
			if (!params.onError) throw error;
			params.onError(provider, error);
		}
	}
	return auths;
}
//#endregion
//#region src/infra/provider-usage.load.ts
/** Loads usage snapshots from configured provider auth and plugin-backed usage hooks. */
async function loadProviderUsageSummary(opts = {}) {
	const now = opts.now ?? Date.now();
	const timeoutMs = opts.timeoutMs ?? 5e3;
	const config = opts.config ?? getRuntimeConfig();
	const env = opts.env ?? process.env;
	const requestedProviders = opts.providers ?? opts.auth?.map(({ provider }) => provider);
	const descriptors = requestedProviders ? requestedProviders.map((provider) => ({
		provider,
		displayName: providerUsageLabel(provider) ?? provider
	})) : listProviderUsagePluginDescriptors({
		config,
		workspaceDir: opts.workspaceDir,
		env
	});
	const displayNames = new Map(descriptors.map((descriptor) => [descriptor.provider, descriptor.displayName]));
	const providerOrder = new Map(descriptors.map(({ provider }, index) => [provider, index]));
	const failureSnapshot = (provider, error) => ({
		provider,
		displayName: displayNames.get(provider) ?? providerUsageLabel(provider) ?? provider,
		windows: [],
		error
	});
	if (timeoutMs <= 0) return {
		updatedAt: now,
		providers: descriptors.map(({ provider }) => failureSnapshot(provider, "Timeout"))
	};
	const fetchFn = opts.fetch ? resolveFetch(opts.fetch) : resolveProxyFetchFromEnv(env) ?? resolveFetch();
	if (!fetchFn) throw new Error("fetch is not available");
	let authStore = opts.authStore;
	const getAuthStore = () => authStore ??= ensureAuthProfileStore(opts.agentDir, { allowKeychainPrompt: false });
	const tasks = descriptors.map(({ provider }) => {
		return raceUsageTimeout((signal) => trackAsyncWork(async () => {
			let authError;
			const auth = opts.auth?.find((candidate) => candidate.provider === provider) ?? (await resolveProviderAuths({
				providers: [provider],
				agentDir: opts.agentDir,
				config,
				env,
				signal,
				getStore: getAuthStore,
				store: opts.authStore,
				onError: (_provider, error) => {
					authError = error;
				}
			}))[0];
			signal.throwIfAborted();
			if (authError) {
				const message = formatErrorMessage(authError);
				return failureSnapshot(provider, message.trim() || "Auth failed");
			}
			if (!auth) return;
			return await resolveProviderUsageSnapshotWithPlugin({
				provider: auth.hookProvider ?? auth.provider,
				config,
				workspaceDir: opts.workspaceDir,
				env,
				context: {
					config,
					agentDir: opts.agentDir,
					workspaceDir: opts.workspaceDir,
					env,
					provider: auth.provider,
					token: auth.token,
					accountId: auth.accountId,
					authProfileId: auth.authProfileId,
					subscriptionType: auth.subscriptionType,
					authFlow: auth.authFlow,
					rateLimitTier: auth.rateLimitTier,
					email: auth.email,
					timeoutMs,
					signal,
					fetchFn: (input, init) => {
						signal.throwIfAborted();
						const callerSignal = init?.signal === void 0 && input instanceof Request ? input.signal : init?.signal;
						return fetchFn(input, {
							...init,
							signal: callerSignal ? AbortSignal.any([signal, callerSignal]) : signal
						});
					}
				}
			}) ?? {
				provider: auth.provider,
				displayName: providerUsageLabel(auth.provider) ?? auth.provider,
				windows: [],
				error: "Unsupported provider"
			};
		}), timeoutMs, failureSnapshot(provider, "Timeout")).catch((error) => {
			const message = error instanceof Error ? error.message : String(error);
			return failureSnapshot(provider, message.trim() || "Fetch failed");
		});
	});
	return {
		updatedAt: now,
		providers: (await Promise.all(tasks)).filter((snapshot) => snapshot !== void 0).toSorted((left, right) => (providerOrder.get(left.provider) ?? Number.MAX_SAFE_INTEGER) - (providerOrder.get(right.provider) ?? Number.MAX_SAFE_INTEGER)).filter((entry) => entry.windows.length > 0 || (entry.billing?.length ?? 0) > 0 || entry.costHistory?.daily.length || entry.summary?.trim() || !entry.error || !ignoredErrors.has(entry.error))
	};
}
//#endregion
export { loadProviderUsageSummary as t };
