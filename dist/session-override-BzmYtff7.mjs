import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { a as resolveProviderModelRoutes } from "./provider-model-routes-CNgNpH_2.mjs";
import { i as resolveSessionAuthProfileOverrideSource } from "./auth-profile-override-provenance-B84_9MMh.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { r as resolveProviderModelRouteAuthRequirement } from "./provider-model-route-auth-DkAaX3ui.mjs";
import { n as resolveModelRouteIntent } from "./model-runtime-policy-IbIjya7U.mjs";
import { d as resolveModelCatalogIdentityKey } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-BspGC-O6.mjs";
import { i as isUserModelAuthProfileId } from "./profile-usage-stats-Uo3hJqOO.mjs";
import "./store-CTvq6MSF.mjs";
import { d as resolveUserProfileAuthLink } from "./user-model-accounts-C87WCnZM.mjs";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-BkR4BMBU.mjs";
import { n as isStoredCredentialCompatibleWithAuthProvider, o as resolveAuthProfileOrderWithMetadata, t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-BQhYF772.mjs";
import { c as isProfileInCooldown, r as isActiveUnusableWindow, s as isModelScopedCooldownReason } from "./usage-state-Bm5iXGhR.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import "./usage-BwRmG127.mjs";
import { t as resolveModelProviderAuthConfig } from "./model-auth-provider-route-qM_24l0u.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { t as createSelectedAuthProfileUnavailableError } from "./selection-error-COiCGJ2G.mjs";
import { r as shouldPreserveUnavailableSessionAuthProfileOverride } from "./auth-profile-preservation-jhjED_s9.mjs";
//#region src/agents/auth-profiles/session-override.ts
/** Keeps automatic auth profiles stable unless reset, unavailable, or recovering a preference. */
const sessionAccessorLoader = createLazyImportLoader(() => import("./session-accessor-7aJzTlyp.mjs"));
function loadSessionAccessor() {
	return sessionAccessorLoader.load();
}
function profileAuthRequirement(params) {
	return resolveProviderModelRouteAuthRequirement(params.store?.profiles[params.profileId]?.type ?? params.cfg.auth?.profiles?.[params.profileId]?.mode);
}
function applySessionAuthProfileOverrideState(entry, state, updatedAt) {
	if (state.authProfileOverride === void 0) delete entry.authProfileOverride;
	else entry.authProfileOverride = state.authProfileOverride;
	if (state.authProfileOverrideSource === void 0) delete entry.authProfileOverrideSource;
	else entry.authProfileOverrideSource = state.authProfileOverrideSource;
	if (state.authProfileOverrideCompactionCount === void 0) delete entry.authProfileOverrideCompactionCount;
	else entry.authProfileOverrideCompactionCount = state.authProfileOverrideCompactionCount;
	entry.updatedAt = Math.max(entry.updatedAt ?? 0, updatedAt);
}
function matchesSessionAuthProfileOverrideSnapshot(entry, snapshot) {
	return entry.sessionId === snapshot.sessionId && entry.authProfileOverride === snapshot.authProfileOverride && entry.authProfileOverrideSource === snapshot.authProfileOverrideSource && entry.authProfileOverrideCompactionCount === snapshot.authProfileOverrideCompactionCount;
}
function synchronizeSessionEntry(entry, latest) {
	for (const key of Object.keys(entry)) if (!Object.hasOwn(latest, key)) Reflect.deleteProperty(entry, key);
	Object.assign(entry, latest);
}
async function persistSessionAuthProfileOverrideState(params) {
	const { sessionEntry, sessionStore, sessionKey, state, storePath, expectedSnapshot } = params;
	const updatedAt = Date.now();
	if (!storePath) {
		if (expectedSnapshot && !Object.hasOwn(sessionStore, sessionKey)) return;
		const latest = sessionStore[sessionKey] ?? sessionEntry;
		if (expectedSnapshot && !matchesSessionAuthProfileOverrideSnapshot(latest, expectedSnapshot)) {
			synchronizeSessionEntry(sessionEntry, latest);
			return latest;
		}
		const target = expectedSnapshot ? latest : sessionEntry;
		applySessionAuthProfileOverrideState(target, state, updatedAt);
		if (target !== sessionEntry) synchronizeSessionEntry(sessionEntry, target);
		sessionStore[sessionKey] = target;
		return target;
	}
	if (!expectedSnapshot) {
		applySessionAuthProfileOverrideState(sessionEntry, state, updatedAt);
		sessionStore[sessionKey] = sessionEntry;
	}
	const persisted = await (await loadSessionAccessor()).patchSessionEntryCore({
		agentId: params.agentId,
		storePath,
		sessionKey
	}, (current) => {
		if (expectedSnapshot && !matchesSessionAuthProfileOverrideSnapshot(current, expectedSnapshot)) return null;
		return {
			...state,
			updatedAt: Math.max(current.updatedAt ?? 0, updatedAt)
		};
	}, expectedSnapshot ? void 0 : { fallbackEntry: sessionEntry });
	if (persisted) {
		if (expectedSnapshot) synchronizeSessionEntry(sessionEntry, persisted);
		sessionStore[sessionKey] = persisted;
	}
	return persisted ?? (expectedSnapshot ? void 0 : sessionEntry);
}
function isProfileForProvider(params) {
	const entry = params.store.profiles[params.profileId];
	if (entry) {
		if (!entry.provider) return false;
		return params.providers.some((provider) => isStoredCredentialCompatibleWithAuthProvider({
			cfg: params.cfg,
			provider,
			credential: entry
		}));
	}
	return params.providers.some((provider) => isConfiguredAwsSdkAuthProfileForProvider({
		cfg: params.cfg,
		provider,
		profileId: params.profileId
	}));
}
function uniqueProviders(provider, acceptedProviderIds) {
	const providers = /* @__PURE__ */ new Set();
	const push = (value) => {
		const normalized = value?.trim();
		if (normalized) providers.add(normalized);
	};
	(acceptedProviderIds && acceptedProviderIds.length > 0 ? acceptedProviderIds : [provider]).forEach(push);
	return [...providers];
}
/** Resolve a person's new-session default through the canonical credential store. */
function resolveUserLinkedAuthProfile(params) {
	const providers = uniqueProviders(params.provider, params.acceptedProviderIds);
	const profileId = resolveUserProfileAuthLink({
		profileId: params.requesterProfileId,
		providers
	});
	if (!profileId) return;
	const store = !params.store || isUserModelAuthProfileId(profileId) ? ensureAuthProfileStore(params.agentDir, {
		allowKeychainPrompt: false,
		profileId
	}) : params.store;
	return isProfileForProvider({
		cfg: params.cfg,
		providers,
		profileId,
		store
	}) ? {
		profileId,
		store
	} : void 0;
}
function isProfileGloballyInCooldown(store, profileId) {
	if (!isProfileInCooldown(store, profileId)) return false;
	const usage = store.usageStats?.[profileId];
	if (!usage) return true;
	const now = Date.now();
	return isActiveUnusableWindow(usage.disabledUntil, now) || isActiveUnusableWindow(usage.blockedUntil, now) && (usage.blockedScope !== "model" || !usage.blockedModel) || isActiveUnusableWindow(usage.cooldownUntil, now) && (!isModelScopedCooldownReason(usage.cooldownReason) || !usage.cooldownModel);
}
/** Clears an auth-profile override from a session and persists it when possible. */
async function clearSessionAuthProfileOverride(params) {
	const { sessionEntry, sessionStore, sessionKey, storePath } = params;
	await persistSessionAuthProfileOverrideState({
		agentId: params.agentId,
		sessionEntry,
		sessionStore,
		sessionKey,
		state: {
			authProfileOverride: void 0,
			authProfileOverrideSource: void 0,
			authProfileOverrideCompactionCount: void 0
		},
		storePath
	});
}
async function resolveSessionAuthProfileOverride(params) {
	const { agentId, cfg, provider, agentDir, sessionEntry, sessionStore, sessionKey, storePath, isNewSession } = params;
	if (!sessionEntry || !sessionStore || !sessionKey) return {
		profileId: sessionEntry?.authProfileOverride,
		store: void 0
	};
	const hasConfiguredAuthProfiles = Boolean(params.cfg.auth?.profiles && Object.keys(params.cfg.auth.profiles).length > 0) || Boolean(params.cfg.auth?.order && Object.keys(params.cfg.auth.order).length > 0);
	if (!sessionEntry.authProfileOverride?.trim() && !params.requesterProfileId && !hasConfiguredAuthProfiles && !hasAnyAuthProfileStoreSource(agentDir)) return {
		profileId: void 0,
		store: void 0
	};
	const store = ensureAuthProfileStore(agentDir, {
		allowKeychainPrompt: false,
		profileId: sessionEntry.authProfileOverride
	});
	const providers = uniqueProviders(provider, params.acceptedProviderIds);
	const orderResolutions = providers.map((candidateProvider) => resolveAuthProfileOrderWithMetadata({
		cfg,
		store,
		provider: candidateProvider,
		forModel: sessionEntry.model
	}));
	const order = [...new Set(orderResolutions.flatMap((resolution) => resolution.profileIds))];
	let current = sessionEntry.authProfileOverride?.trim();
	const source = resolveSessionAuthProfileOverrideSource(sessionEntry);
	const currentProfileId = current;
	if (currentProfileId && !store.profiles[currentProfileId] && !providers.some((candidateProvider) => isConfiguredAwsSdkAuthProfileForProvider({
		cfg,
		provider: candidateProvider,
		profileId: currentProfileId
	}))) {
		if (isUserModelAuthProfileId(currentProfileId)) throw new Error("This session's personal model account is unavailable. Select another account for this session, or reconnect your account and start a new session.");
		if (providers.some((candidateProvider) => shouldPreserveUnavailableSessionAuthProfileOverride({
			cfg,
			agentDir,
			entry: sessionEntry,
			store,
			currentProvider: sessionEntry.providerOverride ?? provider,
			provider: candidateProvider
		}))) return {
			profileId: currentProfileId,
			store
		};
		await clearSessionAuthProfileOverride({
			agentId,
			sessionEntry,
			sessionStore,
			sessionKey,
			storePath
		});
		current = void 0;
	}
	if (current && !isProfileForProvider({
		cfg,
		providers,
		profileId: current,
		store
	})) {
		await clearSessionAuthProfileOverride({
			agentId,
			sessionEntry,
			sessionStore,
			sessionKey,
			storePath
		});
		current = void 0;
	}
	if ((source === "user" || source === "user-link") && current) return {
		profileId: current,
		store
	};
	if (params.requesterProfileId && isNewSession) {
		const linked = resolveUserLinkedAuthProfile({
			cfg,
			agentDir,
			provider,
			requesterProfileId: params.requesterProfileId,
			acceptedProviderIds: providers,
			store
		});
		if (linked) {
			await persistSessionAuthProfileOverrideState({
				agentId,
				sessionEntry,
				sessionStore,
				sessionKey,
				state: {
					authProfileOverride: linked.profileId,
					authProfileOverrideSource: "user-link",
					authProfileOverrideCompactionCount: void 0
				},
				storePath
			});
			return linked;
		}
	}
	if (current && order.length > 0 && !order.includes(current)) {
		await clearSessionAuthProfileOverride({
			agentId,
			sessionEntry,
			sessionStore,
			sessionKey,
			storePath
		});
		current = void 0;
	}
	if (order.length === 0) return {
		profileId: void 0,
		store
	};
	if (order.every((profileId) => isProfileGloballyInCooldown(store, profileId))) {
		if (current) {
			const latest = await persistSessionAuthProfileOverrideState({
				agentId,
				sessionEntry,
				sessionStore,
				sessionKey,
				state: {
					authProfileOverride: void 0,
					authProfileOverrideSource: void 0,
					authProfileOverrideCompactionCount: void 0
				},
				storePath,
				expectedSnapshot: {
					sessionId: sessionEntry.sessionId,
					authProfileOverride: sessionEntry.authProfileOverride,
					authProfileOverrideSource: sessionEntry.authProfileOverrideSource,
					authProfileOverrideCompactionCount: sessionEntry.authProfileOverrideCompactionCount
				}
			});
			const latestProfileId = latest?.authProfileOverride;
			const latestSource = resolveSessionAuthProfileOverrideSource(latest);
			return {
				profileId: latestProfileId && (latestSource === "user" || latestSource === "user-link") && isProfileForProvider({
					cfg,
					providers,
					profileId: latestProfileId,
					store
				}) ? latestProfileId : void 0,
				store
			};
		}
		return {
			profileId: void 0,
			store
		};
	}
	const isProfileUnavailableForSessionModel = (profileId) => isProfileInCooldown(store, profileId, void 0, sessionEntry.model);
	const currentUnavailable = current ? isProfileUnavailableForSessionModel(current) : false;
	const compactionCount = sessionEntry.compactionCount ?? 0;
	const retryableHigherPriorityProfile = source === "auto" && !currentUnavailable && current ? orderResolutions.filter((resolution) => resolution.hasExplicitOrder).flatMap((resolution) => {
		const currentOrderIndex = resolution.profileIds.indexOf(current);
		return currentOrderIndex > 0 ? resolution.profileIds.slice(0, currentOrderIndex) : [];
	}).find((profileId) => (store.usageStats?.[profileId]?.failureCounts?.rate_limit ?? 0) > 0 && !isProfileUnavailableForSessionModel(profileId)) : void 0;
	const shouldRotateCurrent = Boolean(current) && !isNewSession && (currentUnavailable || retryableHigherPriorityProfile !== void 0);
	const routeResolution = shouldRotateCurrent && !retryableHigherPriorityProfile ? resolveProviderModelRoutes({
		provider,
		modelId: params.modelId,
		config: cfg,
		routeIntent: resolveModelRouteIntent({
			config: cfg,
			provider,
			modelId: params.modelId,
			agentId: params.agentId,
			primaryModel: resolveDefaultModelForAgent({
				cfg,
				agentId: params.agentId,
				allowManifestNormalization: false,
				allowPluginNormalization: false
			}),
			resolveProfileAuthMode: (profileId) => store.profiles[profileId]?.type
		})
	}) : null;
	const currentAuthRequirement = current && routeResolution?.kind === "routes" && routeResolution.routes.length > 1 ? profileAuthRequirement({
		cfg,
		store,
		profileId: current
	}) : void 0;
	const rotationOrder = currentAuthRequirement ? order.filter((profileId) => profileAuthRequirement({
		cfg,
		store,
		profileId
	}) === currentAuthRequirement) : order;
	const pickAvailable = (active) => {
		const startIndex = active ? rotationOrder.indexOf(active) : -1;
		for (let offset = 1; offset <= rotationOrder.length; offset += 1) {
			const candidate = rotationOrder[(startIndex + offset) % rotationOrder.length];
			if (candidate && !isProfileUnavailableForSessionModel(candidate)) return candidate;
		}
		return rotationOrder[startIndex] ?? rotationOrder[0];
	};
	let next = current;
	if (retryableHigherPriorityProfile) next = retryableHigherPriorityProfile;
	else if (isNewSession || shouldRotateCurrent) next = pickAvailable(currentUnavailable ? void 0 : current);
	else if (!current) next = pickAvailable();
	if (!next) return {
		profileId: current,
		store
	};
	if (next !== sessionEntry.authProfileOverride || sessionEntry.authProfileOverrideSource !== "auto") await persistSessionAuthProfileOverrideState({
		agentId,
		sessionEntry,
		sessionStore,
		sessionKey,
		state: {
			authProfileOverride: next,
			authProfileOverrideSource: "auto",
			authProfileOverrideCompactionCount: compactionCount
		},
		storePath
	});
	return {
		profileId: next,
		store
	};
}
/** Resolves the session credential and its prepared route facts. */
async function resolveSessionAuthSelection(params) {
	const modelId = splitTrailingAuthProfile(params.modelId).model;
	const cfg = resolveModelProviderAuthConfig({
		config: params.cfg,
		provider: params.provider,
		modelId
	});
	const acceptedProviderIds = listOpenAIAuthProfileProvidersForAgentRuntime({
		provider: params.provider,
		harnessRuntime: params.harnessRuntime,
		config: params.cfg
	});
	const { profileId: rotatedProfileId, store } = await resolveSessionAuthProfileOverride({
		...params,
		cfg,
		modelId,
		acceptedProviderIds
	});
	const rotatedSource = rotatedProfileId ? params.sessionEntry?.authProfileOverride?.trim() === rotatedProfileId ? resolveSessionAuthProfileOverrideSource(params.sessionEntry) ?? "auto" : "auto" : void 0;
	const rotatedPinnedProfileId = rotatedSource === "user" || rotatedSource === "user-link" ? rotatedProfileId : void 0;
	const configuredProfile = splitTrailingAuthProfile(resolveAgentEffectiveModelPrimary(params.cfg, params.agentId) ?? "").profile;
	const defaultModel = configuredProfile ? resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	}) : void 0;
	const configuredProfileId = params.configuredProfileId?.trim() || (defaultModel && resolveModelCatalogIdentityKey({
		provider: params.provider,
		id: modelId
	}) === resolveModelCatalogIdentityKey({
		provider: defaultModel.provider,
		id: defaultModel.model
	}) ? configuredProfile : void 0);
	const profileId = rotatedPinnedProfileId ?? configuredProfileId ?? rotatedProfileId;
	if (!profileId) return;
	const authStore = !store || isUserModelAuthProfileId(profileId) && !store.profiles[profileId] ? ensureAuthProfileStore(params.agentDir, {
		allowKeychainPrompt: false,
		profileId
	}) : store;
	if (!rotatedPinnedProfileId && profileId === configuredProfileId && !isProfileForProvider({
		cfg,
		providers: uniqueProviders(params.provider, acceptedProviderIds),
		profileId,
		store: authStore
	})) {
		if (!authStore.profiles[profileId] && cfg.auth?.profiles?.[profileId]?.mode !== "aws-sdk") throw createSelectedAuthProfileUnavailableError({
			profileId,
			provider: params.provider,
			modelId
		});
		throw new Error(`Auth profile "${configuredProfileId}" is not configured for ${params.provider}.`);
	}
	return {
		profileId,
		source: rotatedPinnedProfileId || configuredProfileId ? "user" : "auto",
		routeRequirement: profileAuthRequirement({
			cfg,
			store: authStore,
			profileId
		})
	};
}
//#endregion
export { resolveSessionAuthSelection as n, resolveUserLinkedAuthProfile as r, clearSessionAuthProfileOverride as t };
