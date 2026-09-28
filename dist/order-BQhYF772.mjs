import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { a as resolveTokenExpiryState, n as evaluateStoredCredentialEligibility, u as isPendingOAuthRefreshFence } from "./credential-state-CWZ_V0ds.mjs";
import { c as getRuntimeAuthProfileStoreCredentialsRevision } from "./runtime-snapshots-CBozwlR0.mjs";
import { c as isProfileInCooldown, f as resolveProfileUnusableUntil, t as clearExpiredCooldowns } from "./usage-state-Bm5iXGhR.mjs";
import { isDeepStrictEqual } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/auth-profiles/profile-list.ts
/**
* Auth profile list helpers.
* Provides provider-compatible profile lookup and stable de-duplication used by
* ordering, repair, and profile mutation paths.
*/
/** Deduplicates profile ids while preserving first-seen order. */
function dedupeProfileIds(profileIds) {
	return uniqueStrings(profileIds);
}
/** Lists auth profile ids whose credential provider matches the requested provider. */
function listProfilesForProvider(store, provider) {
	const providerKey = resolveProviderIdForAuth(provider);
	return Object.entries(store.profiles).filter(([, cred]) => resolveProviderIdForAuth(cred.provider) === providerKey).map(([id]) => id);
}
function resolveSubscriptionAuthModeForProfiles(params) {
	for (const profileId of params.profileIds) {
		const type = profileId ? params.store.profiles[profileId]?.type : void 0;
		if (type === "oauth" || type === "token") return type;
	}
}
//#endregion
//#region src/agents/auth-profiles/setup-access.ts
const setupCredentialAccess = new AsyncLocalStorage();
/** Detached runtime work must not inherit a writer's temporary credential access. */
function runOutsideSetupCredentialAccess(run) {
	return setupCredentialAccess.exit(run);
}
function isSetupCredentialAccessible(params) {
	if (!params.credential.setup?.replacement) return true;
	const access = setupCredentialAccess.getStore();
	return Boolean(access?.isActive() && access.profileId === params.profileId && (params.agentDir === void 0 || access.agentDir === params.agentDir));
}
/** Reads only the exact, still-owned SecretRef materialization for the current setup operation. */
function getSetupCredentialRuntimeProfile(params) {
	const access = setupCredentialAccess.getStore();
	const runtime = access?.runtimeCredential;
	if (!access || !runtime || access.profileId !== params.profileId || access.agentDir !== params.agentDir) return;
	if (!access.isActive() || runtime.credentialsRevision !== getRuntimeAuthProfileStoreCredentialsRevision() || !isDeepStrictEqual(runtime.source, params.profile)) return null;
	return structuredClone(runtime.materialized);
}
/** Allows the selected replacement only while its setup operation remains active. */
async function withSetupCredentialAccess(params, run) {
	const parent = setupCredentialAccess.getStore();
	let active = true;
	return await setupCredentialAccess.run({
		profileId: params.profileId,
		agentDir: params.agentDir,
		runtimeCredential: params.runtimeCredential ? structuredClone(params.runtimeCredential) : parent?.profileId === params.profileId && parent.agentDir === params.agentDir ? parent.runtimeCredential : void 0,
		isActive: () => active && !params.signal?.aborted && (!parent || parent.isActive())
	}, async () => {
		try {
			return await run();
		} finally {
			active = false;
		}
	});
}
//#endregion
//#region src/agents/auth-profiles/order.ts
/**
* Auth profile ordering and eligibility.
* Resolves configured/stored auth order, provider aliases, cooldowns, and
* profile compatibility for provider auth selection.
*/
function isAuthProfileRuntimeSettlementCandidate(params) {
	return params.eligibility.eligible || params.includePendingOAuthRefresh === true && params.eligibility.reasonCode === "expired" && params.credential?.type === "oauth" && isPendingOAuthRefreshFence(params.credential);
}
function isProfileProviderCompatibleWithAuthProvider(params) {
	return resolveProviderIdForAuth(params.provider, {
		config: params.cfg,
		...params.authAliasLookupParams,
		storedCredential: true
	}) === params.providerAuthKey;
}
/** Returns true when a stored credential can authenticate the requested provider. */
function isStoredCredentialCompatibleWithAuthProvider(params) {
	return isProfileProviderCompatibleWithAuthProvider({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey: resolveProviderIdForAuth(params.provider, {
			config: params.cfg,
			...params.authAliasLookupParams
		}),
		provider: params.credential.provider
	});
}
function listProfilesCompatibleWithAuthProvider(params) {
	return Object.entries(params.store.profiles).filter(([, credential]) => isProfileProviderCompatibleWithAuthProvider({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey: params.providerAuthKey,
		provider: credential.provider
	})).map(([profileId]) => profileId);
}
function resolveProviderAuthMode(cfg, provider) {
	const providers = cfg?.models?.providers;
	if (!providers) return;
	const auth = findNormalizedProviderValue(providers, provider)?.auth;
	return typeof auth === "string" ? auth : void 0;
}
function providerAllowsAwsSdkAuth(cfg, provider) {
	return resolveProviderAuthMode(cfg, provider) === "aws-sdk";
}
/** Returns true when config declares an aws-sdk auth profile for a provider. */
function isConfiguredAwsSdkAuthProfileForProvider(params) {
	const profileConfig = params.cfg?.auth?.profiles?.[params.profileId];
	if (!profileConfig || profileConfig.mode !== "aws-sdk") return false;
	const providerAuthKey = resolveProviderIdForAuth(params.provider, {
		config: params.cfg,
		...params.authAliasLookupParams
	});
	if (resolveProviderIdForAuth(profileConfig.provider, {
		config: params.cfg,
		...params.authAliasLookupParams,
		storedCredential: true
	}) !== providerAuthKey) return false;
	return providerAllowsAwsSdkAuth(params.cfg, providerAuthKey);
}
/** Resolves whether a profile can be used for a provider right now. */
function resolveAuthProfileEligibility(params) {
	const providerAuthKey = resolveProviderIdForAuth(params.provider, {
		config: params.cfg,
		...params.authAliasLookupParams
	});
	const cred = params.store.profiles[params.profileId];
	if (!cred) {
		if (isConfiguredAwsSdkAuthProfileForProvider({
			cfg: params.cfg,
			authAliasLookupParams: params.authAliasLookupParams,
			provider: params.provider,
			profileId: params.profileId
		})) return {
			eligible: true,
			reasonCode: "ok"
		};
		return {
			eligible: false,
			reasonCode: "profile_missing"
		};
	}
	if (!isSetupCredentialAccessible({
		profileId: params.profileId,
		credential: cred
	})) return {
		eligible: false,
		reasonCode: "setup_inactive"
	};
	if (!isProfileProviderCompatibleWithAuthProvider({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey,
		provider: cred.provider
	})) return {
		eligible: false,
		reasonCode: "provider_mismatch"
	};
	const profileConfig = params.cfg?.auth?.profiles?.[params.profileId];
	if (profileConfig) {
		if (!isProfileProviderCompatibleWithAuthProvider({
			cfg: params.cfg,
			authAliasLookupParams: params.authAliasLookupParams,
			providerAuthKey,
			provider: profileConfig.provider
		})) return {
			eligible: false,
			reasonCode: "provider_mismatch"
		};
		if (profileConfig.mode !== cred.type) {
			if (!(profileConfig.mode === "oauth" && cred.type === "token")) return {
				eligible: false,
				reasonCode: "mode_mismatch"
			};
		}
	}
	const credentialEligibility = evaluateStoredCredentialEligibility({
		credential: cred,
		now: params.now
	});
	if (isAuthProfileRuntimeSettlementCandidate({
		credential: cred,
		eligibility: credentialEligibility,
		includePendingOAuthRefresh: params.includePendingOAuthRefresh
	})) return {
		eligible: true,
		reasonCode: "ok"
	};
	return {
		eligible: false,
		reasonCode: credentialEligibility.reasonCode
	};
}
/** Session pins lead the shared order without discarding its failover candidates. */
function prependAuthProfilePin(resolution, profileId) {
	return profileId ? {
		...resolution,
		profileIds: [profileId, ...resolution.profileIds.filter((id) => id !== profileId)]
	} : resolution;
}
/** Shares stored-over-config order precedence with CLI runtime selection. */
function resolveExplicitAuthOrderSelection(params) {
	const { storeOrder, configuredOrder, providerKey, providerAuthKey } = params;
	const stored = findNormalizedProviderValue(storeOrder, providerAuthKey) ?? findNormalizedProviderValue(storeOrder, providerKey);
	return {
		order: stored ?? findNormalizedProviderValue(configuredOrder, providerAuthKey) ?? findNormalizedProviderValue(configuredOrder, providerKey),
		fromStore: stored !== void 0
	};
}
/** Resolves ordered usable auth profiles plus whether an explicit order owns selection. */
function resolveAuthProfileOrderWithMetadata(params) {
	const { cfg, store, provider, preferredProfile, forModel } = params;
	const providerKey = normalizeProviderId(provider);
	const providerAuthKey = resolveProviderIdForAuth(provider, {
		config: cfg,
		...params.authAliasLookupParams
	});
	const now = Date.now();
	clearExpiredCooldowns(store, now);
	const { order: explicitOrder, fromStore: explicitOrderFromStore } = resolveExplicitAuthOrderSelection({
		storeOrder: store.order,
		configuredOrder: cfg?.auth?.order,
		providerKey,
		providerAuthKey
	});
	const explicitProfiles = cfg?.auth?.profiles ? Object.entries(cfg.auth.profiles).filter(([, profile]) => isProfileProviderCompatibleWithAuthProvider({
		cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey,
		provider: profile.provider
	})).map(([profileId]) => profileId) : [];
	const storeProfiles = listProfilesCompatibleWithAuthProvider({
		cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		store,
		providerAuthKey
	});
	const baseOrder = explicitOrder ?? (explicitProfiles.length > 0 ? explicitProfiles : storeProfiles);
	if (baseOrder.length === 0) return {
		profileIds: [],
		hasExplicitOrder: explicitOrder !== void 0
	};
	const isValidProfile = (profileId) => {
		const eligibility = resolveAuthProfileEligibility({
			cfg,
			authAliasLookupParams: params.authAliasLookupParams,
			store,
			provider,
			profileId,
			now,
			includePendingOAuthRefresh: params.includePendingOAuthRefresh
		});
		return eligibility.eligible || params.readinessMode === "read-only" && eligibility.reasonCode === "unresolved_ref";
	};
	let filtered = baseOrder.filter(isValidProfile);
	let repairedFallbackToStoreProfiles = false;
	const allBaseProfilesMissing = baseOrder.every((profileId) => !store.profiles[profileId]);
	if (filtered.length === 0 && allBaseProfilesMissing && (explicitOrderFromStore || explicitProfiles.length > 0)) {
		filtered = storeProfiles.filter(isValidProfile);
		repairedFallbackToStoreProfiles = true;
	}
	const deduped = dedupeProfileIds(filtered);
	const cooldownModel = params.cooldownScope === "all-models" ? null : forModel;
	const isInCooldown = (profileId) => isProfileInCooldown(store, profileId, now, cooldownModel);
	const unusableUntil = (profileId) => resolveProfileUnusableUntil(store.usageStats?.[profileId] ?? {}, cooldownModel);
	if (explicitOrder && explicitOrder.length > 0 && !repairedFallbackToStoreProfiles) {
		const available = [];
		const inCooldown = [];
		for (const profileId of deduped) if (isInCooldown(profileId)) inCooldown.push({
			profileId,
			cooldownUntil: unusableUntil(profileId) ?? now
		});
		else available.push(profileId);
		const cooldownSorted = inCooldown.toSorted((a, b) => a.cooldownUntil - b.cooldownUntil).map((entry) => entry.profileId);
		const ordered = [...available, ...cooldownSorted];
		if (preferredProfile && ordered.includes(preferredProfile)) return {
			profileIds: [preferredProfile, ...ordered.filter((e) => e !== preferredProfile)],
			hasExplicitOrder: true
		};
		return {
			profileIds: ordered,
			hasExplicitOrder: true
		};
	}
	const sorted = orderProfilesByMode(deduped, store, now, isInCooldown, unusableUntil);
	if (preferredProfile && sorted.includes(preferredProfile)) return {
		profileIds: [preferredProfile, ...sorted.filter((e) => e !== preferredProfile)],
		hasExplicitOrder: explicitOrder !== void 0
	};
	return {
		profileIds: sorted,
		hasExplicitOrder: explicitOrder !== void 0
	};
}
/** Resolves ordered usable auth profile ids for a provider. */
function resolveAuthProfileOrder(params) {
	return resolveAuthProfileOrderWithMetadata(params).profileIds;
}
function orderProfilesByMode(order, store, now, isInCooldown, unusableUntil) {
	const available = [];
	const inCooldown = [];
	for (const profileId of order) if (isInCooldown(profileId)) inCooldown.push(profileId);
	else available.push(profileId);
	const sorted = available.map((profileId) => {
		const profile = store.profiles[profileId];
		const type = profile?.type;
		return {
			profileId,
			typeScore: type === "oauth" ? 0 : type === "token" ? 1 : type === "api_key" ? 2 : 3,
			expiryScore: profile?.type === "oauth" && resolveTokenExpiryState(profile.expires, now) === "expired" ? 1 : 0,
			lastUsed: store.usageStats?.[profileId]?.lastUsed ?? 0
		};
	}).toSorted((a, b) => {
		if (a.typeScore !== b.typeScore) return a.typeScore - b.typeScore;
		if (a.expiryScore !== b.expiryScore) return a.expiryScore - b.expiryScore;
		return a.lastUsed - b.lastUsed;
	}).map((entry) => entry.profileId);
	const cooldownSorted = inCooldown.map((profileId) => ({
		profileId,
		cooldownUntil: unusableUntil(profileId) ?? now
	})).toSorted((a, b) => a.cooldownUntil - b.cooldownUntil).map((entry) => entry.profileId);
	return [...sorted, ...cooldownSorted];
}
//#endregion
export { resolveAuthProfileOrder as a, getSetupCredentialRuntimeProfile as c, withSetupCredentialAccess as d, dedupeProfileIds as f, resolveAuthProfileEligibility as i, isSetupCredentialAccessible as l, resolveSubscriptionAuthModeForProfiles as m, isStoredCredentialCompatibleWithAuthProvider as n, resolveAuthProfileOrderWithMetadata as o, listProfilesForProvider as p, prependAuthProfilePin as r, resolveExplicitAuthOrderSelection as s, isConfiguredAwsSdkAuthProfileForProvider as t, runOutsideSetupCredentialAccess as u };
