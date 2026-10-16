import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { y as resolveNativeModelPrimary } from "./agent-scope-config-CDYpzA0r.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { i as resolveSessionAuthProfileOverrideSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { a as resolveProviderModelRoutes } from "./provider-model-routes-BXIDiDZZ.mjs";
import { n as resolveModelRouteIntent, o as resolveProviderModelAuthPolicy } from "./model-runtime-policy-Bz7NzEHI.mjs";
import { a as resolveModelCatalogIdentityKey } from "./openai-model-routes-mS12tkxj.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-8cBNhOzI.mjs";
import { c as isModelScopedCooldownReason, i as isActiveUnusableWindow, l as isProfileInCooldown, v as isUserModelAuthProfileId } from "./profile-usage-stats-BLwxBqRR.mjs";
import { C as authProfilesLog } from "./persisted-BVyWmvfF.mjs";
import "./store-SwwRUDrm.mjs";
import { f as resolveUserProfileAuthLink } from "./user-model-accounts-sYn17idc.mjs";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-BDmQKwxy.mjs";
import { n as isStoredCredentialCompatibleWithAuthProvider, o as resolveAuthProfileOrderWithMetadata, t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-B7W96aON.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCCJ_Oe.mjs";
import "./usage-4pZ_894X.mjs";
import "./model-selection-C1qxt1eY.mjs";
import { t as createSelectedAuthProfileUnavailableError } from "./selection-error-D0XBw2ov.mjs";
import { t as resolveModelProviderAuthConfig } from "./model-auth-provider-route-DRm2f6tV.mjs";
import { r as shouldPreserveUnavailableSessionAuthProfileOverride } from "./auth-profile-preservation-C7x4I4Ip.mjs";
//#region src/agents/auth-profiles/session-override.ts
/** Keeps automatic auth profiles stable unless reset, unavailable, or recovering a preference. */
const sessionAccessorLoader = createLazyImportLoader(() => import("./session-accessor-DxXDktz7.mjs"));
function profileAuthRequirement(params) {
	const credential = params.store?.profiles[params.profileId];
	const configured = params.cfg.auth?.profiles?.[params.profileId];
	const provider = credential?.provider ?? configured?.provider;
	if (!provider) return;
	return resolveProviderModelAuthPolicy({
		provider,
		mode: credential?.type ?? configured?.mode,
		authFlow: credential?.type === "oauth" ? credential.authFlow : void 0
	}).authRequirement ?? void 0;
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
	params.assertCommitAllowed?.();
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
	const persisted = await (await sessionAccessorLoader.load()).patchSessionEntryCore({
		agentId: params.agentId,
		storePath,
		sessionKey
	}, (current) => {
		if (expectedSnapshot && !matchesSessionAuthProfileOverrideSnapshot(current, expectedSnapshot)) return null;
		return {
			...state,
			updatedAt: Math.max(current.updatedAt ?? 0, updatedAt)
		};
	}, {
		...expectedSnapshot ? {} : { fallbackEntry: sessionEntry },
		assertCommitAllowed: params.assertCommitAllowed
	});
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
	return normalizeUniqueTrimmedStringList(acceptedProviderIds?.length ? acceptedProviderIds : [provider]);
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
	await persistSessionAuthProfileOverrideState({
		...params,
		state: {
			authProfileOverride: void 0,
			authProfileOverrideSource: void 0,
			authProfileOverrideCompactionCount: void 0
		}
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
	const overrideTarget = {
		agentId,
		sessionEntry,
		sessionStore,
		sessionKey,
		storePath,
		assertCommitAllowed: params.assertCommitAllowed
	};
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
		}))) {
			authProfilesLog.warn("selected session auth profile is unavailable; explicit pin remains strict", {
				event: "session_auth_profile_unavailable",
				sessionKey,
				profileId: currentProfileId,
				recovery: "select a configured model@profile or reconnect the intended account with models auth login --profile-id",
				tags: ["auth_profiles", "session_recovery"]
			});
			return {
				profileId: currentProfileId,
				store
			};
		}
		await clearSessionAuthProfileOverride(overrideTarget);
		current = void 0;
	}
	if (current && !isProfileForProvider({
		cfg,
		providers,
		profileId: current,
		store
	})) {
		await clearSessionAuthProfileOverride(overrideTarget);
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
				...overrideTarget,
				state: {
					authProfileOverride: linked.profileId,
					authProfileOverrideSource: "user-link",
					authProfileOverrideCompactionCount: void 0
				}
			});
			return linked;
		}
	}
	if (current && order.length > 0 && !order.includes(current)) {
		await clearSessionAuthProfileOverride(overrideTarget);
		current = void 0;
	}
	if (order.length === 0) return {
		profileId: void 0,
		store
	};
	if (order.every((profileId) => isProfileGloballyInCooldown(store, profileId))) {
		if (current) {
			const latest = await persistSessionAuthProfileOverrideState({
				...overrideTarget,
				state: {
					authProfileOverride: void 0,
					authProfileOverrideSource: void 0,
					authProfileOverrideCompactionCount: void 0
				},
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
			resolveProfileAuthMode: (profileId) => store.profiles[profileId]?.type,
			resolveProfileAuthFlow: (profileId) => {
				const credential = store.profiles[profileId];
				return credential?.type === "oauth" ? credential.authFlow : void 0;
			}
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
		...overrideTarget,
		state: {
			authProfileOverride: next,
			authProfileOverrideSource: "auto",
			authProfileOverrideCompactionCount: compactionCount
		}
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
	const configuredProfile = splitTrailingAuthProfile(resolveNativeModelPrimary(params.cfg, params.agentId) ?? "").profile;
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
