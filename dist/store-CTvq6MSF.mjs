import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as resolveRequiredOsHomeDir, o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { C as withStateDatabaseCoordinatorRuntimeDirectory, g as prepareStateDatabaseSourceExclusion } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { n as inspectDatabasePathIdentitySync } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { l as runSqliteReadOnlyWorker } from "./sqlite-readonly-worker-CmkAsqCm.mjs";
import { t as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-Bu0_ELYu.mjs";
import { i as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot, r as isArtifactPreservingStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { i as projectModelProviderConfig } from "./model-provider-config-BbSyhfVf.mjs";
import { m as withSqliteWorkerCleanupFailure } from "./sqlite-worker-store-H5HXDD9v.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { r as MINIMAX_CLI_PROFILE_ID } from "./profile-ids-B9fFWPvP.mjs";
import { c as resolveSharedAuthStorePath, l as resolveSharedMainAuthAgentDir, o as resolveSharedAuthStoreOwnership, s as resolveSharedAuthStoreOwnershipAsync, t as captureAuthProfileOwnerScope } from "./path-resolve-Bm8Ih2d_.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import { r as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { O as listLegacyAuthProfileSources, _ as runAuthProfileWriteTransaction, a as inspectPersistedAuthProfileStoreRaw, b as writePersistedAuthProfileStoreRaw, g as resolveAuthProfileStoreOwner, h as resolveAuthProfileDatabasePath, k as resolveLegacyAuthProfileSourceCandidates, l as readPersistedAuthProfileStateRaw, m as resolveAuthProfileDatabaseOwnerId, n as deletePersistedAuthProfileStoreRaw, s as inspectPersistedSharedAuthProfileStoreRaw, u as readPersistedAuthProfileStoreRaw, v as runAuthProfileWriteTransactionAsync, y as writePersistedAuthProfileStateRaw } from "./sqlite-BIg_k8qE.mjs";
import { i as isUserModelAuthProfileId } from "./profile-usage-stats-Uo3hJqOO.mjs";
import { D as authProfilesLog, _ as getRuntimeExternalCliProfileIds, a as loadPersistedAuthProfileStore, b as removeRuntimeExternalProfileReferences, c as mergeAuthProfileStores, f as AuthProfileStoreUnreadableError, h as loadPersistedAuthProfileState, l as mergePersistedAuthProfileState, n as buildPersistedAuthProfileSecretsStore, o as loadPersistedAuthProfileStoreAtDatabasePath, s as loadPersistedSharedAuthProfileStore, v as mergeRuntimeExternalProfileReferences, w as EXTERNAL_CLI_SYNC_TTL_MS, x as setRuntimeExternalCliProfileIds, y as removePersonalAuthProfileReferences } from "./persisted-B486xwB_.mjs";
import { f as readOAuthRefreshGenerationDigest, l as isOAuthRefreshFence, o as captureOAuthRefreshClaimPublication, r as hasUsableOAuthCredential } from "./credential-state-CWZ_V0ds.mjs";
import { i as readMiniMaxCliCredentialsCached } from "./cli-credentials-Be2RCYO6.mjs";
import { c as overlayRuntimeExternalOAuthProfiles, d as cloneAuthProfileStore, f as isSafeToCopyOAuthIdentity, l as shouldBootstrapFromExternalCliCredential, o as isSafeToAdoptBootstrapOAuthIdentity, t as areOAuthCredentialsEquivalent, u as shouldPersistRuntimeExternalOAuthProfile } from "./oauth-shared-CVbJLd-k.mjs";
import { D as setRuntimeAuthProfileStoreSnapshotAtDatabasePath, E as setRuntimeAuthProfileStoreSnapshot, O as updateRuntimeAuthProfileStoreSnapshot, P as getRuntimeAuthProfileStoreCredentialMutationToken, T as runtimeAuthProfileRowsCache, b as noteRuntimeAuthProfileStorePersistedMutation, d as getRuntimeAuthProfileStoreSnapshotCore, n as clearRuntimeAuthProfileStoreSnapshotAtDatabasePath, o as getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath, p as getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath, r as clearRuntimeAuthProfileStoreSnapshotCore, s as getPreparedRuntimeAuthProfileStoreSnapshotCore, t as captureRuntimeAuthProfileLocalPin, u as getRuntimeAuthProfileStoreSnapshotAtDatabasePath, v as listOwnedRuntimeAuthProfileStoreSnapshots, w as restoreOwnedRuntimeAuthProfileStoreSnapshot, y as listRuntimeAuthProfileStoreSnapshotsForSharedOwner, z as captureOAuthRefreshSettlement } from "./runtime-snapshots-CBozwlR0.mjs";
import { c as readUserModelAuthProfile, l as registerUserModelAuthProfileSecrets, p as updateUserModelAuthProfile } from "./user-model-accounts-C87WCnZM.mjs";
import { a as assertAuthProfileMigrationStateAtDatabasePath, d as warnLegacyAuthProfileSourcesIgnored, i as assertAuthProfileMigrationReady, n as assertAuthProfileCredentialMigrationStateAtDatabasePath, r as assertAuthProfileMigrationCandidates, t as AuthProfileMigrationRequiredError } from "./legacy-source-diagnostic-_PHHNz0J.mjs";
import { S as shouldUseMainOwnerForLocalOAuthCredential, a as createEmptyAuthProfileStore, b as stripRuntimeExternalProfileMetadata, c as markRuntimePersistedProfiles, d as preserveResolvedSecretBackedCredentials, f as pruneAuthProfileStoreReferences, g as runtimeAuthProfileSnapshotSharesOwner, l as mergeLocalAuthProfileStoreWithInheritedStore, o as listRuntimeLocalProfileIds, s as loadRuntimeAuthProfileOwnerSnapshot, t as captureRuntimeAuthProfileLegacyCandidates, v as runtimeStoreInheritsMainState, x as isInheritedMainOAuthCredentialFromStores, y as setRuntimeLocalProfileMetadata } from "./runtime-snapshot-owner-BaV0Qukl.mjs";
import { n as prepareAuthProfileStoreMutation } from "./store-mutation-bCnU80pc.mjs";
import "./source-check-BkR4BMBU.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/auth-profiles/external-cli-sync.ts
/**
* External CLI OAuth synchronization.
* Reads supported CLI credential stores, decides whether those credentials can
* safely bootstrap local auth profiles, and returns runtime/persisted overlays.
*/
const PERSISTED_EXTERNAL_CLI_AUTH_FLOW = "external-cli";
/** Return true when imported CLI credentials match an existing profile identity. */
function isSafeToUseExternalCliCredential(existing, imported) {
	if (!existing) return true;
	if (existing.provider !== imported.provider) return false;
	return isSafeToCopyOAuthIdentity(existing, imported);
}
const EXTERNAL_CLI_SYNC_PROVIDERS = [{
	profileId: MINIMAX_CLI_PROFILE_ID,
	provider: "minimax-portal",
	aliases: ["minimax", "minimax-cli"],
	readCredentials: (options) => readMiniMaxCliCredentialsCached({
		ttlMs: EXTERNAL_CLI_SYNC_TTL_MS,
		...options?.env ? { homeDir: resolveRequiredOsHomeDir(options.env) } : {}
	})
}];
function resolveExternalCliSyncProvider(params) {
	const provider = EXTERNAL_CLI_SYNC_PROVIDERS.find((entry) => externalCliProfileIdMatches(entry, params.profileId));
	if (!provider) return null;
	if (params.credential && !listExternalCliProviderIds(provider).includes(params.credential.provider)) return null;
	return provider;
}
function resolveExternalCliPersistence(provider) {
	return provider.persistence ?? "persisted";
}
/** True when durable metadata assigns this stored profile to an external CLI owner. */
function isPersistedExternalCliAuthProfile(params) {
	const provider = resolveExternalCliSyncProvider(params);
	if (!provider || resolveExternalCliPersistence(provider) !== "persisted") return false;
	return params.credential.authFlow === PERSISTED_EXTERNAL_CLI_AUTH_FLOW;
}
function markPersistedExternalCliCredential(provider, credential) {
	return resolveExternalCliPersistence(provider) === "persisted" ? {
		...credential,
		authFlow: PERSISTED_EXTERNAL_CLI_AUTH_FLOW
	} : credential;
}
function listExternalCliProfileIds(providerConfig) {
	return [providerConfig.profileId, ...providerConfig.profileAliases ?? []];
}
function listExternalCliProviderIds(providerConfig) {
	return [providerConfig.provider, ...providerConfig.aliases ?? []];
}
/** Provider ids whose external CLI credentials can be refreshed by this owner. */
function listExternalCliSyncProviderIds() {
	return [...new Set(EXTERNAL_CLI_SYNC_PROVIDERS.flatMap(listExternalCliProviderIds))];
}
function normalizeExternalCliCredentialProvider(credential, provider) {
	return credential ? {
		...credential,
		provider
	} : null;
}
function externalCliProfileIdMatches(providerConfig, profileId) {
	return listExternalCliProfileIds(providerConfig).includes(profileId);
}
/** Read a CLI credential only for safe bootstrap of an unusable local profile. */
function readExternalCliBootstrapCredential(params) {
	const provider = resolveExternalCliSyncProvider(params);
	if (!provider) return null;
	const imported = normalizeExternalCliCredentialProvider(provider.readCredentials({ allowKeychainPrompt: params.allowKeychainPrompt }), params.credential.provider);
	if (imported && isOAuthRefreshFence(params.credential)) return null;
	return imported;
}
function normalizeProviderScope(values) {
	if (values === void 0) return;
	const out = /* @__PURE__ */ new Set();
	for (const value of values) {
		const raw = value.trim();
		if (!raw) continue;
		out.add(raw.toLowerCase());
		const normalized = normalizeProviderId(raw);
		if (normalized) out.add(normalized);
	}
	return out;
}
function isExternalCliProviderInScope(params) {
	const { providerConfig, options, store } = params;
	const providerScope = normalizeProviderScope(options?.providerIds);
	if (providerScope === void 0 && options?.profileIds === void 0) return Object.entries(store.profiles).some(([profileId, existing]) => {
		return externalCliProfileIdMatches(providerConfig, profileId) && existing?.type === "oauth" && listExternalCliProviderIds(providerConfig).includes(existing.provider);
	});
	if (Array.from(options?.profileIds ?? []).some((profileId) => externalCliProfileIdMatches(providerConfig, profileId.trim()))) return true;
	if (!providerScope || providerScope.size === 0) return false;
	return listExternalCliProviderIds(providerConfig).some((alias) => {
		const raw = alias.trim().toLowerCase();
		const normalized = normalizeProviderId(alias);
		return providerScope.has(raw) || (normalized ? providerScope.has(normalized) : false);
	});
}
/** True when a previously resolved built-in CLI profile belongs to this refresh scope. */
function isExternalCliAuthProfileInScope(params) {
	const credential = params.store.profiles[params.profileId];
	const providerConfig = resolveExternalCliSyncProvider({
		profileId: params.profileId,
		...credential?.type === "oauth" ? { credential } : {}
	});
	if (!providerConfig) return Array.from(params.profileIds ?? []).includes(params.profileId) || credential !== void 0 && normalizeProviderScope(params.providerIds)?.has(normalizeProviderId(credential.provider)) === true;
	return isExternalCliProviderInScope({
		providerConfig,
		store: params.store,
		options: {
			...params.providerIds ? { providerIds: params.providerIds } : {},
			...params.profileIds ? { profileIds: params.profileIds } : {}
		}
	});
}
function listScopedExternalCliProfileIds(params) {
	const { options, providerConfig, store } = params;
	const matchingRequestedProfileIds = Array.from(options?.profileIds ?? []).map((value) => value.trim()).filter((value) => value.length > 0).filter((profileId) => externalCliProfileIdMatches(providerConfig, profileId));
	if (matchingRequestedProfileIds.length > 0) return matchingRequestedProfileIds;
	const existingProfileIds = Object.keys(store.profiles).filter((profileId) => externalCliProfileIdMatches(providerConfig, profileId));
	if (existingProfileIds.length > 0) return existingProfileIds;
	return options?.providerIds ? [providerConfig.profileId] : [];
}
function backfillExternalCliIdentity(params) {
	const creds = params.providerConfig.readCredentials({
		allowKeychainPrompt: params.allowKeychainPrompt,
		env: params.env
	});
	if (!(creds?.refresh === params.existingOAuth.refresh)) return null;
	const credential = markPersistedExternalCliCredential(params.providerConfig, {
		...params.existingOAuth,
		...params.existingOAuth.email || !creds.email ? {} : { email: creds.email }
	});
	return credential.authFlow === params.existingOAuth.authFlow && credential.email === params.existingOAuth.email ? null : credential;
}
/** Resolve scoped external CLI auth profiles available to overlay or persist. */
function resolveExternalCliAuthProfiles(store, options) {
	const profiles = [];
	const now = Date.now();
	for (const providerConfig of EXTERNAL_CLI_SYNC_PROVIDERS) {
		if (!isExternalCliProviderInScope({
			providerConfig,
			store,
			options
		})) continue;
		const scopedProfileIds = listScopedExternalCliProfileIds({
			providerConfig,
			store,
			options
		});
		for (const profileId of scopedProfileIds) {
			const existing = store.profiles[profileId];
			const existingOAuth = existing?.type === "oauth" && listExternalCliProviderIds(providerConfig).includes(existing.provider) ? existing : void 0;
			if (existing && !existingOAuth) {
				authProfilesLog.debug("kept explicit local auth over external cli bootstrap", {
					profileId,
					provider: providerConfig.provider,
					localType: existing.type,
					localProvider: existing.provider
				});
				continue;
			}
			if (existingOAuth && hasUsableOAuthCredential(existingOAuth, { now })) {
				const backfilled = backfillExternalCliIdentity({
					providerConfig,
					existingOAuth,
					allowKeychainPrompt: options?.allowKeychainPrompt,
					env: options?.env
				});
				if (backfilled) profiles.push({
					profileId,
					credential: backfilled,
					persistence: resolveExternalCliPersistence(providerConfig)
				});
				continue;
			}
			const creds = normalizeExternalCliCredentialProvider(providerConfig.readCredentials({
				allowKeychainPrompt: options?.allowKeychainPrompt,
				env: options?.env
			}), existingOAuth?.provider ?? providerConfig.provider);
			if (!creds) continue;
			if (existingOAuth && isOAuthRefreshFence(existingOAuth)) {
				authProfilesLog.warn("refused unordered external cli oauth recovery for a fenced profile", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (existingOAuth && !isSafeToUseExternalCliCredential(existingOAuth, creds)) {
				authProfilesLog.warn("refused external cli oauth bootstrap: identity mismatch", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (existingOAuth && !isSafeToAdoptBootstrapOAuthIdentity(existingOAuth, creds) && !areOAuthCredentialsEquivalent(existingOAuth, creds)) {
				authProfilesLog.warn("refused external cli oauth bootstrap: identity mismatch or missing binding", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (!shouldBootstrapFromExternalCliCredential({
				existing: existingOAuth,
				imported: creds,
				now
			})) {
				if (existingOAuth) authProfilesLog.debug("kept usable local oauth over external cli bootstrap", {
					profileId,
					provider: providerConfig.provider,
					localExpires: existingOAuth.expires,
					externalExpires: creds.expires
				});
				continue;
			}
			authProfilesLog.debug("used external cli oauth bootstrap because local oauth was missing or unusable", {
				profileId,
				provider: providerConfig.provider,
				localExpires: existingOAuth?.expires,
				externalExpires: creds.expires
			});
			profiles.push({
				profileId,
				credential: markPersistedExternalCliCredential(providerConfig, creds),
				persistence: resolveExternalCliPersistence(providerConfig)
			});
		}
	}
	return profiles;
}
//#endregion
//#region src/agents/auth-profiles/ambient-auth.ts
/** Provider auth-pin policy for credentials discovered outside OpenClaw storage. */
/** Returns whether ambient credential material agrees with a provider's declared auth mode. */
function isAmbientCredentialAllowedByProviderAuthPin(params) {
	const providers = params.config?.models?.providers;
	const direct = findNormalizedProviderValue(providers, params.provider);
	const providerAuthKey = resolveProviderIdForAuth(params.provider, {
		config: params.config,
		...params.authAliasLookupParams
	});
	const auth = direct?.auth ?? findNormalizedProviderValue(providers, providerAuthKey)?.auth;
	if (auth === "api-key") return params.type === "api_key";
	if (auth === "oauth") return params.type === "oauth" || params.type === "token";
	if (auth === "token") return params.type === "token";
	return auth === void 0;
}
//#endregion
//#region src/agents/auth-profiles/external-auth.ts
let resolveExternalAuthProfilesForRuntime;
/** Test-only resolver injection for provider external auth profiles. */
const testing$1 = {
	resetResolveExternalAuthProfilesForTest() {
		resolveExternalAuthProfilesForRuntime = void 0;
	},
	setResolveExternalAuthProfilesForTest(resolver) {
		resolveExternalAuthProfilesForRuntime = resolver;
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.externalAuthTestApi")] = testing$1;
function normalizeExternalAuthProfile(profile) {
	if (!profile?.profileId || !profile.credential) return null;
	return {
		...profile,
		persistence: profile.persistence ?? "runtime-only"
	};
}
function resolveExplicitProfileIds(values) {
	if (values === void 0) return;
	return new Set(Array.from(values, (value) => value.trim()).filter((value) => value.length > 0));
}
function isExternalAuthProfileAllowed(profile, store, config, explicitProfileIds, env) {
	if (store.profiles[profile.profileId] || explicitProfileIds?.has(profile.profileId)) return true;
	return isAmbientCredentialAllowedByProviderAuthPin({
		config,
		authAliasLookupParams: { env },
		provider: profile.credential.provider,
		type: profile.credential.type
	});
}
function resolveAllowedExternalCliAuthProfiles(params) {
	const env = params.env ?? process.env;
	const explicitProfileIds = resolveExplicitProfileIds(params.externalCli?.externalCliProfileIds);
	return (resolveExternalCliAuthProfiles?.(params.store, {
		allowKeychainPrompt: params.externalCli?.allowKeychainPrompt,
		...params.env ? { env: params.env } : {},
		providerIds: params.externalCli?.externalCliProviderIds,
		profileIds: explicitProfileIds
	}) ?? []).flatMap((profile) => isExternalAuthProfileAllowed(profile, params.store, params.externalCli?.config, explicitProfileIds, env) ? [{
		profileId: profile.profileId,
		credential: profile.credential,
		persistence: profile.persistence ?? "runtime-only"
	}] : []);
}
function hasPersistableExternalCliSyncCandidate(store, params) {
	if (params?.externalCliProviderIds || params?.externalCliProfileIds) return true;
	for (const profileId of [MINIMAX_CLI_PROFILE_ID]) if (store.profiles[profileId]?.type === "oauth") return true;
	return false;
}
function hasScopedExternalCliOverlay$1(params) {
	return Boolean(params?.externalCliProviderIds || params?.externalCliProfileIds);
}
/** Persist safe external CLI OAuth profiles that own their local profile slot. */
function syncPersistedExternalCliAuthProfiles(store, params) {
	if (!hasPersistableExternalCliSyncCandidate(store, params)) return store;
	const persistedProfiles = resolveAllowedExternalCliAuthProfiles({
		store,
		env: params?.env,
		externalCli: params
	}).filter((profile) => profile.persistence === "persisted");
	if (persistedProfiles.length === 0) return store;
	let next;
	for (const profile of persistedProfiles) {
		const existing = (next ?? store).profiles[profile.profileId];
		if (existing?.type === "oauth" && existing.authFlow === profile.credential.authFlow && areOAuthCredentialsEquivalent(existing, profile.credential)) continue;
		next ??= cloneAuthProfileStore(store);
		next.profiles[profile.profileId] = profile.credential;
	}
	return next ?? store;
}
function createExternalAuthRuntime(resolveExternalAuthProfilesWithPlugins) {
	function resolveExternalAuthProfiles(params) {
		const env = params.env ?? process.env;
		const profiles = (resolveExternalAuthProfilesForRuntime ?? resolveExternalAuthProfilesWithPlugins)({
			env,
			config: params.externalCli?.config,
			context: {
				config: params.externalCli?.config,
				agentDir: params.agentDir,
				workspaceDir: void 0,
				env,
				store: params.store
			}
		});
		const resolved = new Map(resolveAllowedExternalCliAuthProfiles(params).map((profile) => [profile.profileId, profile]));
		const runtimeExternalCliProfileIds = new Set([...resolved.values()].filter((profile) => profile.persistence !== "persisted").map((profile) => profile.profileId));
		const pluginProfileIds = /* @__PURE__ */ new Set();
		const explicitProfileIds = resolveExplicitProfileIds(params.externalCli?.externalCliProfileIds);
		for (const rawProfile of profiles) {
			const profile = normalizeExternalAuthProfile(rawProfile);
			if (!profile) continue;
			if (!isExternalAuthProfileAllowed(profile, params.store, params.externalCli?.config, explicitProfileIds, env)) continue;
			resolved.set(profile.profileId, profile);
			pluginProfileIds.add(profile.profileId);
			runtimeExternalCliProfileIds.delete(profile.profileId);
		}
		return {
			profiles: resolved,
			pluginProfileIds,
			runtimeExternalCliProfileIds
		};
	}
	/** List runtime-only and persisted external auth profiles for this store. */
	function listRuntimeExternalAuthProfiles(params) {
		return Array.from(resolveExternalAuthProfiles({
			store: params.store,
			agentDir: params.agentDir,
			env: params.env,
			externalCli: params.externalCli
		}).profiles.values());
	}
	/** Overlay external auth profiles onto a cloned auth store for runtime use. */
	function overlayExternalAuthProfiles(store, params) {
		const scoped = hasScopedExternalCliOverlay$1(params);
		const runtimeExternalCliProfileIds = new Set(getRuntimeExternalCliProfileIds(store));
		const refreshedProfileIds = new Set((store.runtimeExternalProfileIds ?? []).filter((profileId) => !runtimeExternalCliProfileIds.has(profileId)));
		for (const profileId of runtimeExternalCliProfileIds) if (scoped && isExternalCliAuthProfileInScope({
			store,
			profileId,
			providerIds: params?.externalCliProviderIds,
			profileIds: params?.externalCliProfileIds
		})) refreshedProfileIds.add(profileId);
		const base = removeRuntimeExternalProfileReferences({
			store,
			profileIds: refreshedProfileIds
		});
		const resolved = resolveExternalAuthProfiles({
			store: base,
			agentDir: params?.agentDir,
			env: params?.env,
			externalCli: params
		});
		const next = overlayRuntimeExternalOAuthProfiles(base, resolved.profiles.values(), { runtimeExternalProfileIdsAuthoritative: !scoped });
		const retainedCliProfileIds = getRuntimeExternalCliProfileIds(base).filter((profileId) => !resolved.pluginProfileIds.has(profileId));
		setRuntimeExternalCliProfileIds(next, [...retainedCliProfileIds, ...resolved.runtimeExternalCliProfileIds]);
		return next;
	}
	return {
		listRuntimeExternalAuthProfiles,
		overlayExternalAuthProfiles
	};
}
//#endregion
//#region src/agents/auth-profiles/inherited-store.ts
/** An unreadable, refused inherited owner cannot make a healthy local store unavailable. */
function loadInheritedAuthProfileStore(read, agentDir, env = process.env) {
	try {
		return read();
	} catch (error) {
		if (!(error instanceof AuthProfileStoreUnreadableError) || !agentDir && resolveSharedAuthStoreOwnership(env).location !== "legacy-main") throw error;
		const databasePath = agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(env);
		const refusal = readAgentDatabaseAdmissionRefusal(resolveAuthProfileDatabaseOwnerId(agentDir ?? path.dirname(databasePath)), { env });
		if (!isSameOpenClawAgentDatabasePath(error.databasePath, databasePath) || !refusal?.paths.some((pathname) => isSameOpenClawAgentDatabasePath(pathname, databasePath))) throw error;
		return;
	}
}
/** Compose existing snapshots with fresh persisted reads only for their missing counterpart. */
function resolveRuntimeAuthProfileStoreFromSnapshots(params) {
	const mainKey = params.inheritedAuthDir ? resolveAuthProfileDatabasePath(params.inheritedAuthDir) : resolveSharedAuthStorePath(params.env);
	const requestedKey = params.agentDir ? resolveAuthProfileDatabasePath(params.agentDir) : resolveSharedAuthStorePath(params.env);
	const mainStore = getRuntimeAuthProfileStoreSnapshotAtDatabasePath(mainKey);
	if (!params.agentDir || requestedKey === mainKey) return mainStore ?? null;
	const requestedStore = getRuntimeAuthProfileStoreSnapshotAtDatabasePath(requestedKey);
	if (mainStore && requestedStore) return mergeAuthProfileStores(mainStore, requestedStore, { preserveBaseRuntimeExternalProfiles: true });
	if (requestedStore) {
		const persistedMainStore = loadInheritedAuthProfileStore(() => params.loadStore(params.inheritedAuthDir), params.inheritedAuthDir, params.env);
		return persistedMainStore ? mergeAuthProfileStores(persistedMainStore, requestedStore, { preserveBaseRuntimeExternalProfiles: true }) : requestedStore;
	}
	return mainStore ? mergeAuthProfileStores(mainStore, params.loadStore(params.agentDir), { preserveBaseRuntimeExternalProfiles: true }) : null;
}
//#endregion
//#region src/agents/auth-profiles/personal-profiles.ts
/** Personal credentials enter only the selected turn's view, never the shared profile pool. */
function materializePersonalAuthProfile(store, profileId) {
	return materializePreparedPersonalAuthProfile(store, profileId, readUserModelAuthProfile(profileId));
}
/** Merge an explicitly selected account already read through its canonical owner. */
function materializePreparedPersonalAuthProfile(store, profileId, profile) {
	if (!profile) return store;
	return {
		...store,
		profiles: {
			...store.profiles,
			[profileId]: profile.credential
		},
		runtimePersistedProfileIds: [.../* @__PURE__ */ new Set([...store.runtimePersistedProfileIds ?? [], profileId])].toSorted(),
		...profile.usageStats ? { usageStats: {
			...store.usageStats,
			[profileId]: profile.usageStats
		} } : {}
	};
}
/** Reuses canonical credential/usage mutators within the personal credential owner's transaction. */
function updatePersonalAuthProfileStore(params) {
	const store = {
		version: 1,
		profiles: {}
	};
	updateUserModelAuthProfile(params.profileId, (profile) => {
		store.profiles[params.profileId] = profile.credential;
		store.usageStats = profile.usageStats ? { [params.profileId]: profile.usageStats } : void 0;
		if (!params.updater(store)) return false;
		const credential = store.profiles[params.profileId];
		if (!credential) throw new Error("Personal model accounts must be disconnected through their profile owner.");
		profile.credential = credential;
		profile.usageStats = store.usageStats?.[params.profileId];
		return true;
	}, params.stateDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	} } : void 0);
	return store;
}
//#endregion
//#region src/agents/auth-profiles/sqlite-read.ts
/** Decode worker-read facts with the same store/state coercion as synchronous reads. */
function loadPersistedAuthProfileStoreFromRows(rows, databasePath) {
	const store = mergePersistedAuthProfileState(rows.store.status === "readable" ? rows.store.raw : null, () => rows.state.status === "readable" ? rows.state.raw : null);
	if (!store && rows.store.status !== "missing") throw new AuthProfileStoreUnreadableError(databasePath);
	return store;
}
const missing = {
	store: {
		status: "missing",
		reason: "database"
	},
	state: {
		status: "missing",
		reason: "database"
	},
	cacheable: false
};
function isInspection(value) {
	return isRecord(value) && (value.status === "unreadable" || value.status === "readable" && Object.hasOwn(value, "raw") || value.status === "missing" && (value.reason === "database" || value.reason === "table" || value.reason === "row"));
}
/** Captured read authority survives all awaits until the runtime composition releases it. */
function prepareAgentAuthProfileRowsRead(options) {
	const databasePath = path.resolve(options.databasePath);
	const agentId = options.agentId;
	const env = cloneEnvWithPlatformSemantics(options.env);
	let identity;
	try {
		identity = inspectDatabasePathIdentitySync(databasePath);
	} catch {
		identity = void 0;
	}
	const captured = (() => {
		try {
			return {
				ok: true,
				value: {
					root: captureOpenClawStateWorkerContext({ env }),
					exclusion: prepareStateDatabaseSourceExclusion(databasePath)
				}
			};
		} catch (error) {
			return {
				ok: false,
				error
			};
		}
	})();
	const controller = new AbortController();
	const pending = /* @__PURE__ */ new Set();
	const snapshots = /* @__PURE__ */ new Set();
	let closed = false;
	let revoked = false;
	let closing;
	let unregisterAgent;
	let unregisterRoot;
	const revoke = () => {
		revoked = true;
		controller.abort(/* @__PURE__ */ new Error("Auth profile read owner was revoked"));
	};
	const assertCurrent = () => {
		if (revoked) throw new Error("Auth profile read owner was revoked");
		if (!captured.ok) throw captured.error;
		captured.value.root.admission.assertCurrent();
		captured.value.root.maintenanceScope?.assertAdmission();
		captured.value.exclusion?.();
		if (identity && inspectDatabasePathIdentitySync(databasePath)?.key !== identity.key) throw new Error("Auth profile database file identity changed during its read");
		if (!closed) register();
	};
	const cleanSnapshot = async (snapshot) => {
		if (!await snapshot.cleanupAsync()) throw new Error(`SQLite read-only worker snapshot cleanup failed: ${snapshot.cleanupRoot ?? path.dirname(snapshot.location)}`);
		snapshots.delete(snapshot);
	};
	const dispose = () => {
		closed = true;
		controller.abort(/* @__PURE__ */ new Error("Auth profile read owner closed"));
		closing ??= (async () => {
			await Promise.allSettled(pending);
			const errors = (await Promise.allSettled([...snapshots].map(cleanSnapshot))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (errors.length > 0) throw new AggregateError(errors, "Auth profile snapshot cleanup failed", { cause: errors[0] });
			unregisterRoot?.();
			unregisterAgent?.();
		})().catch((error) => {
			closing = void 0;
			throw error;
		});
		return closing;
	};
	const register = () => {
		if (unregisterAgent || !captured.ok) return;
		const root = captured.value.root;
		const registerOwners = () => {
			unregisterAgent = registerOpenClawAgentDatabaseAsyncResource({
				agentId,
				path: databasePath,
				revoke,
				close: dispose
			});
			try {
				unregisterRoot = registerOpenClawStateDatabaseAsyncResource({ close: async (closedIdentity) => {
					if (!closedIdentity || closedIdentity.key === root.admission.identity.key) {
						revoke();
						await dispose();
					}
				} });
			} catch (error) {
				unregisterAgent();
				unregisterAgent = void 0;
				throw error;
			}
		};
		if (root.maintenanceScope) root.maintenanceScope.run(registerOwners);
		else registerOwners();
	};
	const read = () => {
		if (closed) return Promise.reject(/* @__PURE__ */ new Error("Auth profile read owner closed"));
		const operation = (async () => {
			assertCurrent();
			if (!identity) return {
				store: { status: "unreadable" },
				state: { status: "unreadable" },
				cacheable: false
			};
			if (!identity.key.startsWith("file:")) return missing;
			if (!captured.ok) throw captured.error;
			const { root, exclusion } = captured.value;
			return withStateDatabaseCoordinatorRuntimeDirectory(root.coordinatorRuntime, async () => {
				let snapshot;
				let result;
				try {
					if (exclusion) {
						assertCurrent();
						snapshot = await prepareSqliteReadOnlyLocation(databasePath, {
							preserveSourceArtifacts: true,
							signal: controller.signal
						});
						snapshots.add(snapshot);
					}
					controller.signal.throwIfAborted();
					assertCurrent();
					const sourcePath = snapshot?.location ?? databasePath;
					const sourceIdentity = snapshot ? inspectDatabasePathIdentitySync(sourcePath) : identity;
					if (!sourceIdentity?.key.startsWith("file:")) throw new Error("Auth profile read source no longer identifies its file");
					const rows = await runSqliteReadOnlyWorker(sourcePath, {
						mode: "auth-profile-rows",
						source: snapshot ? "snapshot" : "canonical",
						expectedIdentity: sourceIdentity.key,
						env,
						coordinatorRuntime: root.coordinatorRuntime,
						signal: controller.signal
					});
					controller.signal.throwIfAborted();
					assertCurrent();
					if (!isInspection(rows.store) || !isInspection(rows.state)) throw new Error("Auth profile reader returned invalid inspection rows");
					result = {
						ok: true,
						value: {
							store: rows.store,
							state: rows.state,
							cacheable: rows.cacheable
						}
					};
				} catch (error) {
					result = {
						ok: false,
						error
					};
				}
				try {
					if (snapshot) await cleanSnapshot(snapshot);
				} catch (cleanupError) {
					throw result.ok ? cleanupError : withSqliteWorkerCleanupFailure(toErrorObject(result.error, "Auth profile read failed"), cleanupError);
				}
				if (!result.ok) throw result.error;
				controller.signal.throwIfAborted();
				assertCurrent();
				return result.value;
			});
		})();
		pending.add(operation);
		operation.finally(() => pending.delete(operation)).catch(() => void 0);
		return operation;
	};
	return {
		read,
		assertCurrent,
		dispose
	};
}
/** Shared auth reads reuse the canonical actor and never request a writable open. */
async function readSharedAuthProfileRows(context) {
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "authProfiles.read",
		input: { artifactPreserving: isArtifactPreservingStateRead() }
	}), { existingOnly: true });
	context.admission.assertCurrent();
	return result ?? missing;
}
/** Read one selected account on the canonical actor; redaction remains caller-owned. */
async function readUserModelAuthProfileAsync(authProfileId, context) {
	const profile = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "authProfiles.personal",
		input: {
			profileId: authProfileId,
			artifactPreserving: isArtifactPreservingStateRead()
		}
	}), { existingOnly: true });
	context.admission.assertCurrent();
	if (profile) registerUserModelAuthProfileSecrets(profile.credential);
	return profile;
}
//#endregion
//#region src/agents/auth-profiles/runtime-read.ts
/** Runtime auth reads compose worker-prepared facts through the store's captured host scope. */
function resolveExternalCliOverlayOptions(options) {
	const discovery = options?.externalCli;
	if (!discovery) return {
		...options?.allowKeychainPrompt !== void 0 ? { allowKeychainPrompt: options.allowKeychainPrompt } : {},
		...options?.config ? { config: options.config } : {},
		...options?.externalCliProviderIds ? { externalCliProviderIds: options.externalCliProviderIds } : {},
		...options?.externalCliProfileIds ? { externalCliProfileIds: options.externalCliProfileIds } : {}
	};
	if (discovery.mode === "none") {
		const config = discovery.config ?? options?.config;
		return {
			allowKeychainPrompt: false,
			...config ? { config } : {},
			externalCliProviderIds: [],
			externalCliProfileIds: []
		};
	}
	if (discovery.mode === "existing") {
		const allowKeychainPrompt = discovery.allowKeychainPrompt ?? options?.allowKeychainPrompt;
		const config = discovery.config ?? options?.config;
		return {
			...allowKeychainPrompt !== void 0 ? { allowKeychainPrompt } : {},
			...config ? { config } : {}
		};
	}
	const allowKeychainPrompt = discovery.allowKeychainPrompt ?? options?.allowKeychainPrompt;
	const config = discovery.config ?? options?.config;
	return {
		...allowKeychainPrompt !== void 0 ? { allowKeychainPrompt } : {},
		...config ? { config } : {},
		...discovery.providerIds ? { externalCliProviderIds: discovery.providerIds } : {},
		...discovery.profileIds ? { externalCliProfileIds: discovery.profileIds } : {}
	};
}
/** Bind to the canonical store scope; this reader owns no mutable runtime or lifecycle state. */
function createAuthProfileStoreRuntimeReader({ isEnvOnlyAuthProfileRuntime, getScopedAuthProfileEnv, resolveRuntimeAuthProfileAgentDir, resolveRuntimeAuthProfileLoadOptions, loadAuthProfileStoreForAgent, overlayExternalAuthProfiles, captureScope }) {
	/**
	* Synchronous SDK compatibility. Runtime callers should await loadAuthProfileStoreForRuntimeAsync;
	* transaction-bound SDK callers retain this entrypoint until their own async cutover.
	*/
	function loadAuthProfileStoreForRuntime(agentDir, options, env) {
		return loadRuntimeAuthProfileStore(agentDir, options, env);
	}
	function loadRuntimeAuthProfileStore(agentDir, options, env, readPreparedStore) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		if (options?.profileId && isUserModelAuthProfileId(options.profileId)) {
			const shared = loadAuthProfileStoreForRuntime(agentDir, {
				...options,
				profileId: void 0
			}, env);
			return captureScope().isolated ? shared : materializePersonalAuthProfile(shared, options.profileId);
		}
		const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		const effectiveOptions = resolveRuntimeAuthProfileLoadOptions(options);
		const authPath = effectiveAgentDir ? resolveAuthProfileDatabasePath(effectiveAgentDir) : resolveSharedAuthStorePath(env);
		const store = readPreparedStore ? readPreparedStore(authPath) : loadAuthProfileStoreForAgent(effectiveAgentDir, effectiveOptions, env);
		const mainAuthPath = effectiveOptions?.inheritedAuthDir ? resolveAuthProfileDatabasePath(effectiveOptions.inheritedAuthDir) : resolveSharedAuthStorePath(env);
		const externalCli = resolveExternalCliOverlayOptions(effectiveOptions);
		if (!effectiveAgentDir || authPath === mainAuthPath) return setRuntimeLocalProfileMetadata(overlayExternalAuthProfiles(store, {
			agentDir: effectiveAgentDir,
			...env ? { env } : {},
			...externalCli
		}), listRuntimeLocalProfileIds(store));
		const mainStore = loadInheritedAuthProfileStore(() => readPreparedStore ? readPreparedStore(mainAuthPath) : loadAuthProfileStoreForAgent(effectiveOptions?.inheritedAuthDir, effectiveOptions, env), effectiveOptions?.inheritedAuthDir, env ?? getScopedAuthProfileEnv());
		const mergedStore = mainStore ? mergeAuthProfileStores(mainStore, store, { preserveBaseRuntimeExternalProfiles: true }) : store;
		return setRuntimeLocalProfileMetadata(overlayExternalAuthProfiles(mergedStore, {
			agentDir: effectiveAgentDir,
			...env ? { env } : {},
			...externalCli
		}), listRuntimeLocalProfileIds(store, mainStore), runtimeStoreInheritsMainState(mergedStore, store));
	}
	/** Read persisted facts off-thread; scoped overlays and live setup selection stay on the host. */
	async function loadAuthProfileStoreForRuntimeAsync(agentDir, options) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		const scope = captureScope();
		const env = cloneEnvWithPlatformSemantics(getScopedAuthProfileEnv() ?? process.env);
		env.OPENCLAW_STATE_DIR = resolveStateDir(env);
		const reusePersistedRows = !scope.isolated && !isArtifactPreservingStateRead() && !getOpenClawDatabaseMaintenanceScope() && !getActiveOpenClawStateDatabaseReadSnapshot({ env });
		const selectedDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		const effectiveAgentDir = selectedDir ? path.dirname(resolveAuthProfileDatabasePath(selectedDir)) : void 0;
		const selectedAgentPath = effectiveAgentDir ? resolveAuthProfileDatabasePath(effectiveAgentDir) : void 0;
		const scopedOptions = resolveRuntimeAuthProfileLoadOptions(options);
		const inheritedDir = scopedOptions?.inheritedAuthDir;
		const inheritedAuthDir = inheritedDir ? path.dirname(resolveAuthProfileDatabasePath(inheritedDir)) : void 0;
		const externalCli = scopedOptions?.externalCli;
		const capturedOptions = {
			...scopedOptions,
			inheritedAuthDir,
			readOnly: true,
			externalCli: externalCli?.mode === "scoped" ? {
				...externalCli,
				...externalCli.providerIds ? { providerIds: [...externalCli.providerIds] } : {},
				...externalCli.profileIds ? { profileIds: [...externalCli.profileIds] } : {}
			} : externalCli,
			...scopedOptions?.externalCliProviderIds ? { externalCliProviderIds: [...scopedOptions.externalCliProviderIds] } : {},
			...scopedOptions?.externalCliProfileIds ? { externalCliProfileIds: [...scopedOptions.externalCliProfileIds] } : {}
		};
		const profileId = capturedOptions.profileId;
		const localMutationOwner = selectedAgentPath ? {
			kind: "unresolved",
			databasePath: selectedAgentPath,
			scope: captureAuthProfileOwnerScope(env)
		} : void 0;
		const readLocalToken = () => localMutationOwner && profileId ? getRuntimeAuthProfileStoreCredentialMutationToken(void 0, profileId, { owner: localMutationOwner }) : void 0;
		const pinnedLocal = reusePersistedRows && effectiveAgentDir && profileId ? captureRuntimeAuthProfileLocalPin(resolveAuthProfileDatabasePath(effectiveAgentDir), profileId) : void 0;
		const pinnedLocalToken = pinnedLocal ? readLocalToken() : void 0;
		const personalProfileId = !scope.isolated && profileId && isUserModelAuthProfileId(profileId) ? profileId : void 0;
		const needsSharedStore = !effectiveAgentDir || !inheritedAuthDir;
		let sharedContext;
		let sharedPreparationFailure;
		try {
			if (needsSharedStore || personalProfileId) sharedContext = captureOpenClawStateWorkerContext({ env });
		} catch (error) {
			sharedPreparationFailure = { error };
		}
		const legacySharedPath = resolveAuthProfileDatabasePath(resolveSharedMainAuthAgentDir(env));
		const agentReads = new Map([.../* @__PURE__ */ new Set([
			...needsSharedStore ? [legacySharedPath] : [],
			...effectiveAgentDir ? [resolveAuthProfileDatabasePath(effectiveAgentDir)] : [],
			...effectiveAgentDir && inheritedAuthDir ? [resolveAuthProfileDatabasePath(inheritedAuthDir)] : []
		])].map((databasePath) => [databasePath, prepareAgentAuthProfileRowsRead({
			databasePath,
			agentId: resolveAuthProfileDatabaseOwnerId(path.dirname(databasePath)),
			env
		})]));
		const inCapturedScope = (run) => scope.run(effectiveAgentDir, env, run);
		const stores = /* @__PURE__ */ new Map();
		let localRowsToken;
		let inheritedObservationPath;
		const readOwners = /* @__PURE__ */ new Map();
		const rowReaders = /* @__PURE__ */ new Map();
		const readOwner = async (ownerAgentDir, databasePath, reader) => {
			assertAuthProfileMigrationStateAtDatabasePath(databasePath, capturedOptions.migrationProvider, capturedOptions.config, capturedOptions.deferScopedMigrationRefusals);
			const candidates = resolveLegacyAuthProfileSourceCandidates({
				agentDir: ownerAgentDir,
				env
			});
			if (databasePath === selectedAgentPath) localRowsToken = readLocalToken();
			const preparedReader = reusePersistedRows ? runtimeAuthProfileRowsCache.prepare(databasePath, reader, (databasePaths, capturedRows) => {
				const currentLocalToken = readLocalToken();
				const localFactIsCurrent = (token) => token?.known === true && currentLocalToken?.known === true && token.revision === currentLocalToken.revision;
				const local = selectedAgentPath ? stores.get(selectedAgentPath) : void 0;
				const localStore = local?.ok ? local.value : databasePath === selectedAgentPath && capturedRows && capturedRows.store.status !== "unreadable" ? loadPersistedAuthProfileStoreFromRows(capturedRows, databasePath) : void 0;
				let localOwner;
				if (localFactIsCurrent(localRowsToken) && profileId && localStore) {
					const inherited = inheritedObservationPath ? stores.get(inheritedObservationPath) : void 0;
					const inheritedStore = inherited?.ok ? inherited.value : databasePath === inheritedObservationPath && capturedRows && capturedRows.store.status !== "unreadable" ? loadPersistedAuthProfileStoreFromRows(capturedRows, databasePath) : void 0;
					if (inheritedStore && inheritedObservationPath !== selectedAgentPath) localOwner = listRuntimeLocalProfileIds(localStore, inheritedStore).includes(profileId) ? selectedAgentPath : void 0;
					else if (localFactIsCurrent(pinnedLocalToken) && pinnedLocal?.matchesCredential(localStore.profiles[profileId])) localOwner = pinnedLocal.databasePath;
				}
				const localCredential = profileId ? localStore?.profiles[profileId] : void 0;
				return captureOAuthRefreshSettlement({
					databasePaths,
					localPin: localOwner ? {
						databasePath: localOwner,
						generation: profileId && localCredential?.type === "oauth" ? readOAuthRefreshGenerationDigest({
							profileId,
							credential: localCredential
						}) : void 0
					} : void 0,
					profileId,
					matchesProvider: (provider) => inCapturedScope(() => !capturedOptions.migrationProvider || resolveProviderIdForAuth(provider, {
						config: capturedOptions.config,
						env,
						storedCredential: true
					}) === resolveProviderIdForAuth(capturedOptions.migrationProvider, {
						config: capturedOptions.config,
						env
					}))
				});
			}) : reader;
			rowReaders.set(databasePath, preparedReader);
			const rows = await preparedReader.read();
			preparedReader.assertCurrent();
			stores.set(databasePath, {
				ok: true,
				value: inCapturedScope(() => loadAuthProfileStoreForAgent(ownerAgentDir, capturedOptions, env, rows))
			});
			readOwners.set(databasePath, {
				databasePath,
				candidates,
				readStore: () => loadPersistedAuthProfileStoreFromRows(rows, databasePath)
			});
		};
		const loadPrepared = async () => {
			if (selectedAgentPath) await readOwner(effectiveAgentDir, selectedAgentPath, agentReads.get(selectedAgentPath));
			if (needsSharedStore && sharedPreparationFailure) throw sharedPreparationFailure.error;
			const sharedOwnership = needsSharedStore ? await resolveSharedAuthStoreOwnershipAsync(sharedContext) : void 0;
			const sharedPath = sharedOwnership ? resolveSharedAuthStorePath(env) : void 0;
			const requestedPath = selectedAgentPath ?? sharedPath;
			const inheritedPath = inheritedAuthDir ? resolveAuthProfileDatabasePath(inheritedAuthDir) : sharedPath;
			inheritedObservationPath = inheritedPath;
			const paths = [.../* @__PURE__ */ new Set([requestedPath, ...effectiveAgentDir ? [inheritedPath] : []])];
			for (const databasePath of paths) {
				if (stores.has(databasePath)) continue;
				try {
					await readOwner(databasePath === requestedPath ? effectiveAgentDir : inheritedAuthDir, databasePath, databasePath === sharedPath && sharedOwnership?.location === "state-db" ? {
						read: () => readSharedAuthProfileRows(sharedContext),
						assertCurrent: () => sharedContext.admission.assertCurrent()
					} : agentReads.get(databasePath));
				} catch (error) {
					if (databasePath === requestedPath) throw error;
					stores.set(databasePath, {
						ok: false,
						error
					});
				}
			}
			const assertCurrent = () => {
				sharedContext?.admission.assertCurrent();
				for (const databasePath of paths) {
					rowReaders.get(databasePath)?.assertCurrent();
					const owner = readOwners.get(databasePath);
					assertAuthProfileMigrationCandidates({
						databasePath,
						candidates: owner?.candidates ?? [],
						hasCredentials: () => Object.keys(owner?.readStore()?.profiles ?? {}).length > 0,
						provider: capturedOptions.migrationProvider,
						config: capturedOptions.config,
						deferScopedRefusals: capturedOptions.deferScopedMigrationRefusals
					});
				}
			};
			assertCurrent();
			const load = () => loadRuntimeAuthProfileStore(effectiveAgentDir, {
				...capturedOptions,
				profileId: void 0
			}, env, (databasePath) => {
				const prepared = stores.get(databasePath);
				if (!prepared) throw new Error("Auth profile read changed its prepared database owner");
				if (!prepared.ok) throw prepared.error;
				return prepared.value;
			});
			const store = inCapturedScope(load);
			if (!personalProfileId) return {
				store,
				assertCurrent
			};
			if (sharedPreparationFailure) throw sharedPreparationFailure.error;
			const personalProfile = await readUserModelAuthProfileAsync(personalProfileId, sharedContext);
			assertCurrent();
			return {
				store: materializePreparedPersonalAuthProfile(store, personalProfileId, personalProfile),
				assertCurrent
			};
		};
		let result;
		try {
			result = {
				ok: true,
				value: await loadPrepared()
			};
		} catch (error) {
			result = {
				ok: false,
				error
			};
		}
		const failures = (await Promise.allSettled([...agentReads.values()].map((reader) => reader.dispose()))).flatMap((entry) => entry.status === "rejected" ? [entry.reason] : []);
		if (failures.length > 0) {
			const error = failures.length === 1 ? failures[0] : new AggregateError(failures, "Auth profile reader cleanup failed", { cause: failures[0] });
			throw result.ok ? error : withSqliteWorkerCleanupFailure(toErrorObject(result.error, "Auth profile runtime read failed"), error);
		}
		if (!result.ok) throw result.error;
		result.value.assertCurrent();
		return result.value.store;
	}
	return {
		loadAuthProfileStoreForRuntime,
		loadAuthProfileStoreForRuntimeAsync
	};
}
//#endregion
//#region src/agents/auth-profiles/runtime-snapshot-publication.ts
/** Publish canonical facts while retaining the current host's same-owner overlays. */
function publishPreparedRuntimeAuthProfileStoreSnapshot(agentDir, existing, owner, refreshed, options = {}) {
	const { predecessor, candidates } = options;
	if (!runtimeAuthProfileSnapshotSharesOwner(existing.owner, owner)) {
		setRuntimeAuthProfileStoreSnapshotAtDatabasePath(refreshed, owner.databasePath, agentDir, owner, candidates);
		return;
	}
	const currentMaterialized = preserveResolvedSecretBackedCredentials({
		next: refreshed,
		existing: existing.store
	});
	const materialized = predecessor ? preserveResolvedSecretBackedCredentials({
		next: currentMaterialized,
		existing: predecessor
	}) : currentMaterialized;
	const rebuilt = mergeRuntimeExternalProfileReferences({
		next: materialized,
		existing: existing.store
	});
	setRuntimeAuthProfileStoreSnapshotAtDatabasePath(rebuilt, owner.databasePath, agentDir, owner, candidates);
}
//#endregion
//#region src/agents/auth-profiles/portability.ts
/**
* Auth profile portability for agent-local copies.
* Decides which credentials can be copied to spawned agents without leaking or
* duplicating unsafe OAuth refresh material.
*/
function hasAgentCopyOverride(credential) {
	return typeof credential.copyToAgents === "boolean" ? credential.copyToAgents : void 0;
}
function hasCopyableOAuthMaterial(credential) {
	if (credential.type !== "oauth") return false;
	return [credential.access, credential.refresh].some((value) => typeof value === "string" && value.trim().length > 0);
}
/** Resolves whether a credential can be copied into an agent-local store. */
function resolveAuthProfilePortability(credential) {
	if (credential.setup?.replacement) return {
		portable: false,
		reason: "setup-inactive"
	};
	const override = hasAgentCopyOverride(credential);
	if (override === false) return {
		portable: false,
		reason: "credential-opted-out"
	};
	if (credential.type === "oauth") {
		if (!hasCopyableOAuthMaterial(credential)) return {
			portable: false,
			reason: "non-portable-oauth-refresh-token"
		};
		return override === true ? {
			portable: true,
			reason: "oauth-provider-opted-in"
		} : {
			portable: false,
			reason: "non-portable-oauth-refresh-token"
		};
	}
	return {
		portable: true,
		reason: "portable-static-credential"
	};
}
/** Returns true when a credential can be copied into an agent-local store. */
function isAuthProfileCredentialPortableForAgentCopy(credential) {
	return resolveAuthProfilePortability(credential).portable;
}
/** Builds an agent-copy store containing only portable credentials and their order. */
function buildPortableAuthProfileStoreForAgentCopy(store) {
	const copiedProfileIds = [];
	const skippedProfileIds = [];
	const profiles = Object.fromEntries(Object.entries(store.profiles).flatMap(([profileId, credential]) => {
		if (!isAuthProfileCredentialPortableForAgentCopy(credential)) {
			skippedProfileIds.push(profileId);
			return [];
		}
		copiedProfileIds.push(profileId);
		return [[profileId, credential]];
	}));
	const copiedSet = new Set(copiedProfileIds);
	const order = Object.fromEntries(Object.entries(store.order ?? {}).map(([provider, ids]) => [provider, ids.filter((id) => copiedSet.has(id))]).filter(([, ids]) => ids.length > 0));
	return {
		store: {
			version: 1,
			profiles,
			...Object.keys(order).length > 0 ? { order } : {}
		},
		copiedProfileIds,
		skippedProfileIds
	};
}
//#endregion
//#region src/agents/auth-profiles/shared-store-scope.ts
/** Prepare the shared read-through view; the scope owner validates it immediately before entry. */
async function prepareScopedSharedAuthProfileStore(env) {
	const context = captureOpenClawStateWorkerContext({ env });
	const ownership = await resolveSharedAuthStoreOwnershipAsync(context);
	let sharedStore;
	if (ownership.location === "state-db") {
		sharedStore = loadPersistedAuthProfileStoreFromRows(await readSharedAuthProfileRows(context), context.admission.databasePath) ?? createEmptyAuthProfileStore();
		sharedStore.profiles = Object.fromEntries(Object.entries(sharedStore.profiles).filter(([, credential]) => resolveAuthProfilePortability(credential).reason === "portable-static-credential"));
		pruneAuthProfileStoreReferences(sharedStore, new Set(Object.keys(sharedStore.profiles)));
	}
	return {
		sharedStore,
		assertCurrent() {
			context.admission.assertCurrent();
			context.maintenanceScope?.assertAdmission();
			if (resolveSharedAuthStoreOwnership(env).location !== ownership.location) throw new Error("Shared auth store ownership changed during scope preparation; retry the operation.");
		}
	};
}
//#endregion
//#region src/agents/auth-profiles/store.ts
/**
* Auth profile store orchestration.
* Merges persisted stores, runtime snapshots, inherited main-agent OAuth
* profiles, and external CLI overlays while keeping save paths local.
*/
function withCredentialSources(store, databasePath) {
	return {
		...store,
		runtimeCredentialSources: Object.fromEntries(Object.entries(store.profiles).map(([profileId, credential]) => [profileId, {
			databasePath,
			provider: credential.provider
		}]))
	};
}
const authProfileRuntimeMode = new AsyncLocalStorage();
/** Run a bounded operation without persisted or external CLI auth profiles. */
function withEnvOnlyAuthProfileStore(run) {
	return authProfileRuntimeMode.run({ kind: "env-only" }, run);
}
/** Prepare shared credentials off-thread before entering a bounded persisted-auth operation. */
async function withAuthProfileStoreAgentDir(agentDir, sharedStateDir, run) {
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: sharedStateDir
	};
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const resolvedAgentDir = resolveUserPath(agentDir, env);
	const { sharedStore, assertCurrent } = await prepareScopedSharedAuthProfileStore(env);
	assertCurrent();
	return await authProfileRuntimeMode.run({
		kind: "agent-dir",
		agentDir: resolvedAgentDir,
		sharedStore,
		env
	}, run);
}
function getScopedAuthProfileEnv() {
	const mode = authProfileRuntimeMode.getStore();
	return mode?.kind === "agent-dir" ? mode.env : void 0;
}
function getScopedSharedAuthStore() {
	const mode = authProfileRuntimeMode.getStore();
	return mode?.kind === "agent-dir" ? mode.sharedStore : void 0;
}
function applyScopedAuthReadThrough(store) {
	const shared = getScopedSharedAuthStore();
	if (!shared) return store;
	const merged = mergeAuthProfileStores(cloneAuthProfileStore(shared), store);
	return setRuntimeLocalProfileMetadata(merged, Object.keys(store.profiles), runtimeStoreInheritsMainState(merged, store));
}
function isEnvOnlyAuthProfileRuntime() {
	return authProfileRuntimeMode.getStore()?.kind === "env-only";
}
function resolveRuntimeAuthProfileAgentDir(agentDir) {
	const mode = authProfileRuntimeMode.getStore();
	return mode?.kind === "agent-dir" ? mode.agentDir : agentDir;
}
function resolveRuntimeAuthProfileLoadOptions(options) {
	const mode = authProfileRuntimeMode.getStore();
	if (mode?.kind !== "agent-dir") return options;
	return {
		...options,
		inheritedAuthDir: mode.agentDir
	};
}
let runtimeSnapshotPublisherForTest;
function publishRuntimeSnapshotsAfterCommit(publication) {
	if (!publication) return true;
	try {
		let converged = false;
		const publish = () => {
			converged = publication.publish();
		};
		if (runtimeSnapshotPublisherForTest) runtimeSnapshotPublisherForTest(publish);
		else publish();
		return converged;
	} catch (err) {
		clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(publication.databasePath, publication.agentDir);
		authProfilesLog.warn("auth profile store committed but runtime snapshot publication failed", { err });
		return false;
	}
}
const testing = {
	resetRuntimeSnapshotPublisherForTest() {
		runtimeSnapshotPublisherForTest = void 0;
	},
	setRuntimeSnapshotPublisherForTest(publisher) {
		runtimeSnapshotPublisherForTest = publisher;
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.authProfileStoreTestApi")] = testing;
function resolvePersistedLoadOptions(options) {
	return {
		...options?.allowKeychainPrompt !== void 0 ? { allowKeychainPrompt: options.allowKeychainPrompt } : {},
		...options?.database ? { database: options.database } : {}
	};
}
function loadPersistedAuthProfileStores(agentDir, database, owner) {
	const localStore = loadPersistedAuthProfileStore(agentDir, database ? { database } : void 0);
	const isMainStore = (owner?.databasePath ?? (agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath())) === (owner?.sharedDatabasePath ?? resolveSharedAuthStorePath());
	return {
		isMainStore,
		localStore,
		mainStore: isMainStore ? localStore : owner ? loadPersistedAuthProfileStoreAtDatabasePath(owner.sharedDatabasePath, owner.location === "state-db" ? "shared-state" : "agent") : loadPersistedAuthProfileStore()
	};
}
function hasScopedExternalCliOverlay(options) {
	return options.externalCliProviderIds !== void 0 || options.externalCliProfileIds !== void 0;
}
function shouldKeepProfileInLocalStore(params) {
	const inherited = getScopedSharedAuthStore()?.profiles[params.profileId];
	if (inherited && !params.persistedStores.localStore?.profiles[params.profileId]) {
		const secrets = buildPersistedAuthProfileSecretsStore({
			version: 1,
			profiles: { [params.profileId]: params.credential }
		});
		if (isDeepStrictEqual(secrets.profiles[params.profileId], inherited)) return false;
	}
	if (params.credential.type !== "oauth") return true;
	if (isInheritedMainOAuthCredentialFromStores({
		profileId: params.profileId,
		credential: params.credential,
		persistedStores: params.persistedStores
	})) return false;
	if (params.options?.filterExternalAuthProfiles === false) return true;
	if (params.store.runtimeExternalProfileIds?.includes(params.profileId)) {
		if (params.persistedStores.localStore?.profiles[params.profileId]) return shouldPersistRuntimeExternalOAuthProfile({
			profileId: params.profileId,
			credential: params.credential,
			profiles: params.externalProfiles()
		});
		const runtimeCredential = getRuntimeAuthProfileStoreSnapshotAtDatabasePath(params.owner.databasePath)?.profiles[params.profileId];
		if (!runtimeCredential || isDeepStrictEqual(runtimeCredential, params.credential)) return false;
	}
	return shouldPersistRuntimeExternalOAuthProfile({
		profileId: params.profileId,
		credential: params.credential,
		profiles: params.externalProfiles()
	});
}
function convergeRuntimeAuthProfileStoreSnapshot(databasePath, agentDir, operation) {
	try {
		operation();
		return true;
	} catch (err) {
		clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(databasePath, agentDir);
		authProfilesLog.warn("auth profile snapshot convergence failed", { err });
		return false;
	}
}
function setRuntimeExternalProfileMetadata(params) {
	const profileIds = [...params.profileIds].toSorted();
	params.store.runtimeExternalProfileIds = profileIds.length > 0 || params.authoritative ? profileIds : void 0;
	params.store.runtimeExternalProfileIdsAuthoritative = params.authoritative ? true : void 0;
	setRuntimeExternalCliProfileIds(params.store, getRuntimeExternalCliProfileIds(params.store).filter((profileId) => params.profileIds.has(profileId)));
}
function materializeRuntimeAuthProfileStoreSnapshot(next, existing) {
	return mergeRuntimeExternalProfileReferences({
		next: preserveResolvedSecretBackedCredentials({
			next,
			existing
		}),
		existing
	});
}
function mergeRuntimeExternalProfileState(params) {
	const existingRuntimeProfileIds = new Set(params.existing.runtimeExternalProfileIds ?? []);
	if (existingRuntimeProfileIds.size === 0) return mergeRuntimeExternalProfileReferences(params);
	const merged = cloneAuthProfileStore(params.next);
	const mergedRuntimeProfileIds = new Set(merged.runtimeExternalProfileIds ?? []);
	const existingRuntimeExternalCliProfileIds = new Set(getRuntimeExternalCliProfileIds(params.existing));
	const mergedRuntimeExternalCliProfileIds = new Set(getRuntimeExternalCliProfileIds(merged));
	const activeRuntimeProfileIds = /* @__PURE__ */ new Set();
	const nextRuntimeProfileIdsAuthoritative = params.next.runtimeExternalProfileIdsAuthoritative === true;
	for (const profileId of existingRuntimeProfileIds) {
		if (nextRuntimeProfileIdsAuthoritative && !mergedRuntimeProfileIds.has(profileId)) continue;
		const existingCredential = params.existing.profiles[profileId];
		if (!existingCredential) continue;
		const nextCredential = merged.profiles[profileId];
		if (nextCredential) {
			if (mergedRuntimeProfileIds.has(profileId) || isDeepStrictEqual(nextCredential, existingCredential)) {
				mergedRuntimeProfileIds.add(profileId);
				activeRuntimeProfileIds.add(profileId);
				if (existingRuntimeExternalCliProfileIds.has(profileId)) mergedRuntimeExternalCliProfileIds.add(profileId);
			}
			continue;
		}
		merged.profiles[profileId] = existingCredential;
		mergedRuntimeProfileIds.add(profileId);
		activeRuntimeProfileIds.add(profileId);
		if (existingRuntimeExternalCliProfileIds.has(profileId)) mergedRuntimeExternalCliProfileIds.add(profileId);
	}
	if (activeRuntimeProfileIds.size === 0) return params.next;
	for (const profileId of activeRuntimeProfileIds) if (params.existing.usageStats?.[profileId]) merged.usageStats = {
		...merged.usageStats,
		[profileId]: params.existing.usageStats[profileId]
	};
	for (const [provider, profileIds] of Object.entries(params.existing.order ?? {})) {
		const externalProfileIds = profileIds.filter((profileId) => activeRuntimeProfileIds.has(profileId));
		if (externalProfileIds.length === 0 || merged.order?.[provider]) continue;
		merged.order = {
			...merged.order,
			[provider]: externalProfileIds
		};
	}
	for (const [provider, profileId] of Object.entries(params.existing.lastGood ?? {})) {
		if (!activeRuntimeProfileIds.has(profileId) || merged.lastGood?.[provider]) continue;
		merged.lastGood = {
			...merged.lastGood,
			[provider]: profileId
		};
	}
	setRuntimeExternalProfileMetadata({
		store: merged,
		profileIds: mergedRuntimeProfileIds,
		authoritative: params.existing.runtimeExternalProfileIdsAuthoritative === true
	});
	setRuntimeExternalCliProfileIds(merged, mergedRuntimeExternalCliProfileIds);
	return merged;
}
/** Whether an agent dir resolves to the shared main auth-profile owner. */
function isSharedMainAuthProfileAgentDir(agentDir) {
	const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	if (!effectiveAgentDir) return true;
	const mainAgentDir = resolveRuntimeAuthProfileAgentDir();
	const mainPath = mainAgentDir ? resolveAuthProfileDatabasePath(mainAgentDir) : resolveSharedAuthStorePath();
	return resolveAuthProfileDatabasePath(effectiveAgentDir) === mainPath;
}
/** Find a persisted credential in the scoped store, falling back to the main store. */
function findPersistedAuthProfileCredential(params) {
	if (isEnvOnlyAuthProfileRuntime()) return;
	if (isUserModelAuthProfileId(params.profileId)) return authProfileRuntimeMode.getStore() ? void 0 : readUserModelAuthProfile(params.profileId)?.credential;
	const agentDir = resolveRuntimeAuthProfileAgentDir(params.agentDir);
	const requestedProfile = loadPersistedAuthProfileStore(agentDir)?.profiles[params.profileId];
	const scopedSharedStore = getScopedSharedAuthStore();
	if (scopedSharedStore) return requestedProfile ?? scopedSharedStore.profiles[params.profileId];
	if (requestedProfile || !agentDir) return requestedProfile;
	if (isSharedMainAuthProfileAgentDir(agentDir)) return requestedProfile;
	return loadPersistedAuthProfileStore(resolveRuntimeAuthProfileAgentDir())?.profiles[params.profileId];
}
/** Resolve which agent dir owns a persisted profile, accounting for inherited OAuth. */
function resolvePersistedAuthProfileOwnerAgentDir(params) {
	if (isEnvOnlyAuthProfileRuntime() || isUserModelAuthProfileId(params.profileId)) return;
	const agentDir = resolveRuntimeAuthProfileAgentDir(params.agentDir);
	if (!agentDir) return;
	const requestedStore = loadPersistedAuthProfileStore(agentDir);
	if (isSharedMainAuthProfileAgentDir(agentDir)) return;
	const mainAgentDir = resolveRuntimeAuthProfileAgentDir();
	const mainStore = loadPersistedAuthProfileStore(mainAgentDir);
	const requestedProfile = requestedStore?.profiles[params.profileId];
	if (requestedProfile) return shouldUseMainOwnerForLocalOAuthCredential({
		profileId: params.profileId,
		local: requestedProfile,
		main: mainStore?.profiles[params.profileId]
	}) ? void 0 : agentDir;
	return mainStore?.profiles[params.profileId] ? void 0 : agentDir;
}
/** Return the current runtime auth-profile snapshot for an agent dir. */
function getRuntimeAuthProfileStoreSnapshot(agentDir) {
	return getRuntimeAuthProfileStoreSnapshotCore(agentDir);
}
/** Return the lifecycle-published effective auth store without persisted fallback reads. */
function getPreparedRuntimeAuthProfileStoreSnapshot(agentDir, inheritedAuthDir) {
	return getPreparedRuntimeAuthProfileStoreSnapshotCore(agentDir, inheritedAuthDir);
}
/** Clear one runtime auth-profile snapshot. */
function clearRuntimeAuthProfileStoreSnapshot(agentDir) {
	return clearRuntimeAuthProfileStoreSnapshotCore(agentDir);
}
function assertAuthProfilePersistenceOwner(owner, agentDir, stateDir) {
	if (stateDir && path.resolve(resolveStateDir({
		...owner.env,
		OPENCLAW_STATE_DIR: stateDir
	})) !== path.resolve(resolveStateDir(owner.env))) throw new Error("explicit auth state directory does not match the captured owner");
	if ((agentDir ? resolveAuthProfileDatabasePath(agentDir) : owner.sharedDatabasePath) !== owner.databasePath) throw new Error("auth profile persistence snapshot belongs to another owner");
}
function captureRuntimeAuthProfileStorePersistenceSnapshot(owner) {
	const capturedAuthPath = owner.databasePath;
	const mainAuthPath = owner.sharedDatabasePath;
	return {
		runtimeCaptured: true,
		runtimeRevision: getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(capturedAuthPath),
		runtimeEntry: getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(capturedAuthPath),
		derivedRuntimeStores: capturedAuthPath === mainAuthPath ? listRuntimeAuthProfileStoreSnapshotsForSharedOwner(owner).map((entry) => Object.assign(entry, { runtimeRevision: getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(entry.databasePath) })) : []
	};
}
function recordRuntimeAuthProfileStoreOwnership(owned, runtime) {
	owned.runtimeCaptured = runtime.runtimeCaptured;
	if (runtime.runtimeRevision !== void 0) owned.runtimeRevision = runtime.runtimeRevision;
	if (runtime.runtimeEntry !== void 0) owned.runtimeEntry = runtime.runtimeEntry;
	if (runtime.derivedRuntimeStores !== void 0) owned.derivedRuntimeStores = runtime.derivedRuntimeStores;
}
function recordRuntimeAuthProfileStorePublicationEdge(owned, runtime) {
	if (runtime.runtimeRevision !== void 0) owned.runtimeRevisionBeforePublication = runtime.runtimeRevision;
	if (runtime.derivedRuntimeStores !== void 0) owned.derivedRuntimeRevisionsBeforePublication = runtime.derivedRuntimeStores.flatMap((entry) => typeof entry.runtimeRevision === "number" ? [{
		databasePath: entry.databasePath,
		agentDir: entry.agentDir,
		runtimeRevision: entry.runtimeRevision
	}] : []);
}
function replaceRuntimeAuthProfileStoreSnapshot(entry, agentDir, owner) {
	if (entry) {
		assertAuthProfileMigrationStateAtDatabasePath(entry.databasePath);
		if (entry.owner.kind === "resolved") assertAuthProfileMigrationStateAtDatabasePath(entry.owner.sharedDatabasePath);
		restoreOwnedRuntimeAuthProfileStoreSnapshot(entry, agentDir);
		return;
	}
	clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(owner.databasePath, agentDir);
}
function refreshRuntimeAuthProfileStoreSnapshot(agentDir, owner) {
	const existing = getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(owner.databasePath);
	if (!existing) return;
	rebuildRuntimeAuthProfileStoreSnapshot(agentDir, existing, owner);
}
function rebuildRuntimeAuthProfileStoreSnapshot(agentDir, existing, owner, predecessor, inheritedStore, capturedLocalProfileIds) {
	const isShared = owner.databasePath === owner.sharedDatabasePath;
	const candidates = "env" in owner ? captureRuntimeAuthProfileLegacyCandidates(isShared ? void 0 : agentDir, owner.env) : runtimeAuthProfileSnapshotSharesOwner(existing.owner, owner) ? existing.legacyCandidates : void 0;
	let refreshed;
	try {
		refreshed = loadRuntimeAuthProfileOwnerSnapshot(owner, {
			candidates,
			inheritedStore
		});
	} catch (err) {
		if (!inheritedStore || err instanceof AuthProfileMigrationRequiredError) throw err;
		const localProfileIds = new Set(capturedLocalProfileIds);
		const localStore = cloneAuthProfileStore(existing.store);
		localStore.profiles = Object.fromEntries(Object.entries(localStore.profiles).filter(([profileId]) => localProfileIds.has(profileId)));
		pruneAuthProfileStoreReferences(localStore, localProfileIds);
		refreshed = mergeLocalAuthProfileStoreWithInheritedStore(localStore, inheritedStore);
		authProfilesLog.warn("derived auth profile snapshot refresh failed; preserving captured local profiles", { err });
	}
	publishPreparedRuntimeAuthProfileStoreSnapshot(agentDir, existing, owner, refreshed, {
		predecessor,
		candidates
	});
}
/** Capture both persisted auth rows under one database lock. */
function captureAuthProfileStorePersistenceSnapshot(agentDir, options = {}) {
	const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	return runAuthProfileWriteTransaction(effectiveAgentDir, (database, owner) => {
		return {
			owner,
			credentialsRaw: readPersistedAuthProfileStoreRaw(effectiveAgentDir, database),
			stateRaw: readPersistedAuthProfileStateRaw(effectiveAgentDir, database),
			...captureRuntimeAuthProfileStorePersistenceSnapshot(owner)
		};
	}, {
		...options,
		env: options.env ?? (options.stateDir ? void 0 : getScopedAuthProfileEnv())
	});
}
function reconcileRuntimeAuthProfileStorePersistenceSnapshot(params) {
	if (!params.snapshot.runtimeCaptured || !params.owned.runtimeCaptured) return true;
	const rowsFullyOwned = params.credentialsOwned && params.stateOwned;
	const rowsRestored = params.credentialsRestored || params.stateRestored;
	const reconcileOne = (databasePath, agentDir, snapshotEntry, snapshotRuntimeRevision, runtimeRevisionAtSaveEdge, runtimeRevisionBeforePublication, ownedEntry, ownedRuntimeRevision, currentEntry, currentRuntimeRevision) => convergeRuntimeAuthProfileStoreSnapshot(databasePath, agentDir, () => {
		if (rowsFullyOwned && typeof snapshotRuntimeRevision === "number" && typeof runtimeRevisionAtSaveEdge === "number" && typeof runtimeRevisionBeforePublication === "number" && typeof ownedRuntimeRevision === "number" && snapshotRuntimeRevision === runtimeRevisionAtSaveEdge && runtimeRevisionAtSaveEdge === runtimeRevisionBeforePublication && currentRuntimeRevision === ownedRuntimeRevision && isDeepStrictEqual(currentEntry?.store, ownedEntry?.store) && isDeepStrictEqual(currentEntry?.owner, ownedEntry?.owner)) replaceRuntimeAuthProfileStoreSnapshot(snapshotEntry, agentDir, {
			...params.owner,
			databasePath
		});
		else if (rowsRestored && currentEntry) {
			const runtimeOwner = currentEntry.owner.kind === "resolved" ? currentEntry.owner : runtimeAuthProfileSnapshotSharesOwner(currentEntry.owner, params.owner) ? params.owner : void 0;
			if (!runtimeOwner) return;
			rebuildRuntimeAuthProfileStoreSnapshot(agentDir, currentEntry, {
				databasePath,
				sharedDatabasePath: runtimeOwner.sharedDatabasePath,
				location: runtimeOwner.location
			}, snapshotEntry && runtimeAuthProfileSnapshotSharesOwner(snapshotEntry.owner, runtimeOwner) ? snapshotEntry.store : void 0);
		}
	});
	const restoredAuthPath = params.owner.databasePath;
	const mainAuthPath = params.owner.sharedDatabasePath;
	const currentRuntimeStores = new Map(params.currentRuntimeStores.map((entry) => [entry.databasePath, entry]));
	let converged = reconcileOne(restoredAuthPath, params.agentDir, params.snapshot.runtimeEntry, params.snapshot.runtimeRevision, params.owned.runtimeRevisionAtSaveEdge, params.owned.runtimeRevisionBeforePublication, params.owned.runtimeEntry, params.owned.runtimeRevision, currentRuntimeStores.get(restoredAuthPath), params.currentRuntimeRevision);
	if (restoredAuthPath !== mainAuthPath) return converged;
	const snapshotDerived = new Map((params.snapshot.derivedRuntimeStores ?? []).map((entry) => [entry.databasePath, entry]));
	const ownedDerived = new Map((params.owned.derivedRuntimeStores ?? []).map((entry) => [entry.databasePath, entry]));
	const saveEdgeDerivedRevisions = new Map((params.owned.derivedRuntimeRevisionsAtSaveEdge ?? []).map((entry) => [entry.databasePath, entry.runtimeRevision]));
	const publicationEdgeDerivedRevisions = new Map((params.owned.derivedRuntimeRevisionsBeforePublication ?? []).map((entry) => [entry.databasePath, entry.runtimeRevision]));
	for (const [pathname, currentEntry] of currentRuntimeStores) {
		if (pathname === mainAuthPath) continue;
		const snapshotEntry = snapshotDerived.get(pathname);
		const ownedEntry = ownedDerived.get(pathname);
		converged = reconcileOne(pathname, currentEntry.agentDir, snapshotEntry, snapshotEntry?.runtimeRevision, saveEdgeDerivedRevisions.get(pathname), publicationEdgeDerivedRevisions.get(pathname), ownedEntry, ownedEntry?.runtimeRevision, currentEntry, currentEntry.runtimeRevision) && converged;
	}
	return converged;
}
/** Restore each persisted row and runtime snapshot only while apply still owns it. */
function restoreAuthProfileStorePersistenceSnapshot(snapshot, owned, agentDir, options = {}) {
	assertAuthProfilePersistenceOwner(owned.owner, agentDir, options.stateDir);
	if (snapshot.owner.databasePath !== owned.owner.databasePath || snapshot.owner.sharedDatabasePath !== owned.owner.sharedDatabasePath) throw new Error("auth profile rollback snapshots belong to different owners");
	runAuthProfileWriteTransaction(agentDir, (database, owner) => {
		if (owned.owner.databasePath !== database.path) throw new Error("auth profile rollback belongs to another database");
		const existingRaw = readPersistedAuthProfileStoreRaw(agentDir, database);
		const existingState = readPersistedAuthProfileStateRaw(agentDir, database);
		const credentialsOwned = isDeepStrictEqual(existingRaw, owned.credentialsRaw);
		const stateOwned = isDeepStrictEqual(existingState, owned.stateRaw);
		const beforeProfiles = isRecord(existingRaw) && isRecord(existingRaw.profiles) ? existingRaw.profiles : {};
		const restoredProfiles = isRecord(snapshot.credentialsRaw) && isRecord(snapshot.credentialsRaw.profiles) ? snapshot.credentialsRaw.profiles : {};
		const changedProfileIds = [.../* @__PURE__ */ new Set([...Object.keys(beforeProfiles), ...Object.keys(restoredProfiles)])].filter((profileId) => !isDeepStrictEqual(beforeProfiles[profileId], restoredProfiles[profileId]));
		const profileSetChanged = changedProfileIds.some((profileId) => Object.hasOwn(beforeProfiles, profileId) !== Object.hasOwn(restoredProfiles, profileId));
		const credentialsRestored = credentialsOwned && !isDeepStrictEqual(existingRaw, snapshot.credentialsRaw);
		const stateRestored = stateOwned && !isDeepStrictEqual(existingState, snapshot.stateRaw);
		if (credentialsRestored) {
			if (snapshot.credentialsRaw === null) deletePersistedAuthProfileStoreRaw(agentDir, database);
			else writePersistedAuthProfileStoreRaw(snapshot.credentialsRaw, agentDir, database);
		}
		if (stateRestored) writePersistedAuthProfileStateRaw(snapshot.stateRaw, agentDir, database);
		const publication = {
			...agentDir ? { agentDir } : {},
			databasePath: owner.databasePath,
			publish: () => {
				const currentRuntimeStores = [...listOwnedRuntimeAuthProfileStoreSnapshots().filter((entry) => entry.databasePath === owner.databasePath), ...owner.databasePath === owner.sharedDatabasePath ? listRuntimeAuthProfileStoreSnapshotsForSharedOwner(owner) : []].map((entry) => Object.assign(entry, { runtimeRevision: getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(entry.databasePath) }));
				const currentRuntimePath = owner.databasePath;
				const currentRuntimeRevision = getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(currentRuntimePath);
				if (credentialsRestored || stateRestored) noteRuntimeAuthProfileStorePersistedMutation(agentDir, {
					credentialsChanged: credentialsRestored,
					profileSetChanged: credentialsRestored && profileSetChanged,
					stateChanged: stateRestored,
					selectionChanged: stateRestored,
					profileIds: credentialsRestored ? changedProfileIds : [],
					oauthRefreshClaimIds: captureOAuthRefreshClaimPublication(restoredProfiles, credentialsRestored ? changedProfileIds : [])
				}, owner);
				return reconcileRuntimeAuthProfileStorePersistenceSnapshot({
					owner,
					snapshot,
					owned,
					agentDir,
					credentialsOwned,
					stateOwned,
					credentialsRestored,
					stateRestored,
					currentRuntimeStores,
					currentRuntimeRevision
				});
			}
		};
		deferSqlitePostCommitPublication(database.db, () => publishRuntimeSnapshotsAfterCommit(publication));
	}, { env: owned.owner.env });
}
function createAuthProfileStoreRuntime(externalAuth) {
	const { listRuntimeExternalAuthProfiles, overlayExternalAuthProfiles } = externalAuth;
	function resolveRuntimeAuthProfileStore(agentDir, options) {
		if (getScopedSharedAuthStore()) return null;
		return resolveRuntimeAuthProfileStoreFromSnapshots({
			agentDir,
			inheritedAuthDir: options?.inheritedAuthDir,
			env: getScopedAuthProfileEnv(),
			loadStore: (directory) => loadAuthProfileStoreForAgent(directory, {
				migrationProvider: options?.migrationProvider,
				config: options?.config,
				readOnly: true,
				syncExternalCli: false,
				...resolvePersistedLoadOptions(options)
			})
		});
	}
	function maybeSyncPersistedExternalCliAuthProfiles(params) {
		if (params.options?.readOnly === true || params.options?.syncExternalCli === false || process.env.OPENCLAW_AUTH_STORE_READONLY === "1") return params.store;
		const synced = syncPersistedExternalCliAuthProfiles(params.store, {
			agentDir: params.agentDir,
			...resolveExternalCliOverlayOptions(params.options)
		});
		if (synced === params.store) return params.store;
		const changedProfiles = Object.entries(synced.profiles).filter(([profileId, credential]) => {
			const previous = params.store.profiles[profileId];
			return !isDeepStrictEqual(previous, credential);
		});
		if (changedProfiles.length === 0) return synced;
		try {
			return runAuthProfileWriteTransaction(params.agentDir, (database, owner) => {
				const latestStore = loadPersistedAuthProfileStore(params.agentDir, {
					...resolvePersistedLoadOptions(params.options),
					database
				}) ?? {
					version: 1,
					profiles: {}
				};
				let changed = false;
				for (const [profileId, credential] of changedProfiles) {
					const previous = params.store.profiles[profileId];
					const latest = latestStore.profiles[profileId];
					if (!isDeepStrictEqual(latest, previous)) {
						authProfilesLog.debug("skipped persisted external cli auth sync for concurrently changed profile", { profileId });
						continue;
					}
					latestStore.profiles[profileId] = credential;
					changed = true;
				}
				if (changed) {
					const publication = saveAuthProfileStoreInTransaction(latestStore, params.agentDir, { filterExternalAuthProfiles: false }, database, owner);
					deferSqlitePostCommitPublication(database.db, () => publishRuntimeSnapshotsAfterCommit(publication));
				}
				return latestStore;
			}, { env: getScopedAuthProfileEnv() });
		} catch (err) {
			authProfilesLog.warn("skipped persisted external cli auth sync because auth store write failed", { err });
			return params.store;
		}
	}
	function buildLocalAuthProfileStoreForSave(params) {
		const localStore = cloneAuthProfileStore(removePersonalAuthProfileReferences(params.store));
		let externalProfiles;
		const getExternalProfiles = () => externalProfiles ??= listRuntimeExternalAuthProfiles({
			store: params.store,
			agentDir: params.agentDir
		});
		localStore.profiles = Object.fromEntries(Object.entries(localStore.profiles).filter(([profileId, credential]) => shouldKeepProfileInLocalStore({
			owner: params.owner,
			store: params.store,
			profileId,
			credential,
			agentDir: params.agentDir,
			options: params.options,
			persistedStores: params.persistedStores,
			externalProfiles: getExternalProfiles
		})));
		const keptProfileIds = new Set(Object.keys(localStore.profiles));
		const keptOrderProfileIds = new Set(keptProfileIds);
		for (const profileId of params.options?.preserveStateProfileIds ?? []) {
			const normalizedProfileId = profileId.trim();
			if (normalizedProfileId) {
				keptProfileIds.add(normalizedProfileId);
				keptOrderProfileIds.add(normalizedProfileId);
			}
		}
		for (const profileIds of Object.values(params.persistedStores.localStore?.order ?? {})) for (const profileId of profileIds) keptOrderProfileIds.add(profileId);
		for (const profileId of params.options?.preserveOrderProfileIds ?? []) {
			const normalizedProfileId = profileId.trim();
			if (normalizedProfileId) keptOrderProfileIds.add(normalizedProfileId);
		}
		const prunedOrderProfileIds = /* @__PURE__ */ new Set();
		for (const profileId of params.options?.pruneOrderProfileIds ?? []) {
			const normalizedProfileId = profileId.trim();
			if (normalizedProfileId) prunedOrderProfileIds.add(normalizedProfileId);
		}
		for (const profileId of prunedOrderProfileIds) keptOrderProfileIds.delete(profileId);
		for (const profileId of keptProfileIds) if (isUserModelAuthProfileId(profileId)) keptProfileIds.delete(profileId);
		for (const profileId of keptOrderProfileIds) if (isUserModelAuthProfileId(profileId)) keptOrderProfileIds.delete(profileId);
		pruneAuthProfileStoreReferences(localStore, keptProfileIds, keptOrderProfileIds);
		if (params.options?.filterExternalAuthProfiles !== false) {
			localStore.runtimeExternalProfileIds = void 0;
			localStore.runtimeExternalProfileIdsAuthoritative = void 0;
			setRuntimeExternalCliProfileIds(localStore, []);
		}
		return localStore;
	}
	function buildAuthProfileStoreWithoutExternalProfiles(params) {
		const runtimeExternalProfileIds = new Set(params.store.runtimeExternalProfileIds ?? []);
		const localStore = cloneAuthProfileStore(params.store);
		if (runtimeExternalProfileIds.size === 0) return stripRuntimeExternalProfileMetadata(localStore);
		for (const profileId of runtimeExternalProfileIds) delete localStore.profiles[profileId];
		const keptProfileIds = new Set(Object.keys(localStore.profiles));
		pruneAuthProfileStoreReferences(localStore, keptProfileIds);
		const persistedStore = loadAuthProfileStoreWithoutExternalProfiles(params.agentDir, params.options);
		return stripRuntimeExternalProfileMetadata(mergeAuthProfileStores(persistedStore, localStore));
	}
	/** Apply an auth store update inside the SQLite write lock; null only on lock contention. */
	async function updateAuthProfileStoreWithLock(params) {
		const agentDir = resolveRuntimeAuthProfileAgentDir(params.agentDir);
		try {
			if (params.profileId && isUserModelAuthProfileId(params.profileId)) {
				if (authProfileRuntimeMode.getStore()) throw new Error("Personal model accounts are unavailable in an isolated auth-store scope.");
				return updatePersonalAuthProfileStore({
					profileId: params.profileId,
					updater: params.updater,
					stateDir: params.stateDir
				});
			}
			return await runAuthProfileWriteTransactionAsync(agentDir, (database, owner) => {
				const loadedStore = loadAuthProfileStoreForAgent(agentDir, {
					database,
					readOnly: true,
					syncExternalCli: false
				}, owner.env);
				if (params.updater(loadedStore, owner)) {
					const publication = saveAuthProfileStoreInTransaction(loadedStore, agentDir, params.saveOptions, database, owner);
					deferSqlitePostCommitPublication(database.db, () => publishRuntimeSnapshotsAfterCommit(publication));
				}
				return loadedStore;
			}, {
				sharedStoreWrite: params.sharedStoreWrite,
				stateDir: params.stateDir,
				env: params.stateDir ? void 0 : getScopedAuthProfileEnv()
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			authProfilesLog.warn(`auth profile store update failed: ${message}`, {
				agentDir,
				error: message
			});
			if (!isSqliteLockError(error)) throw error;
			return null;
		}
	}
	/** Load the main auth profile store with runtime external profiles overlaid. */
	function loadAuthProfileStore() {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		const agentDir = resolveRuntimeAuthProfileAgentDir();
		const store = loadPersistedAuthProfileStore(agentDir) ?? createEmptyAuthProfileStore();
		return overlayExternalAuthProfiles(applyScopedAuthReadThrough(markRuntimePersistedProfiles(store)), { agentDir });
	}
	function loadAuthProfileStoreForAgent(agentDir, options, env, preparedRows) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		const effectiveOptions = resolveRuntimeAuthProfileLoadOptions(options);
		const databasePath = effectiveAgentDir ? resolveAuthProfileDatabasePath(effectiveAgentDir) : resolveSharedAuthStorePath(env);
		const readStore = () => {
			if (preparedRows) return loadPersistedAuthProfileStoreFromRows(preparedRows, databasePath);
			const store = !effectiveAgentDir && env && !effectiveOptions?.database ? loadPersistedSharedAuthProfileStore(env) : loadPersistedAuthProfileStore(effectiveAgentDir, resolvePersistedLoadOptions(effectiveOptions));
			if (!store && (!effectiveAgentDir && env && !effectiveOptions?.database ? inspectPersistedSharedAuthProfileStoreRaw(env) : inspectPersistedAuthProfileStoreRaw(effectiveAgentDir, effectiveOptions?.database)).status !== "missing") throw new AuthProfileStoreUnreadableError(effectiveOptions?.database?.path ?? databasePath);
			return store;
		};
		effectiveOptions?.onReadOwner?.({
			databasePath,
			candidates: resolveLegacyAuthProfileSourceCandidates({
				agentDir: effectiveAgentDir,
				env
			}),
			readStore
		});
		if (preparedRows) assertAuthProfileMigrationCandidates({
			databasePath,
			candidates: resolveLegacyAuthProfileSourceCandidates({
				agentDir: effectiveAgentDir,
				env
			}),
			hasCredentials: () => {
				const raw = preparedRows.store.status === "readable" ? preparedRows.store.raw : void 0;
				return isRecord(raw) && isRecord(raw.profiles) && Object.keys(raw.profiles).length > 0;
			},
			provider: effectiveOptions?.migrationProvider,
			config: effectiveOptions?.config,
			deferScopedRefusals: effectiveOptions?.deferScopedMigrationRefusals
		});
		else assertAuthProfileMigrationReady(effectiveAgentDir, env, effectiveOptions?.migrationProvider, effectiveOptions?.config, effectiveOptions?.deferScopedMigrationRefusals);
		const store = readStore();
		const legacySources = listLegacyAuthProfileSources({
			agentDir: effectiveAgentDir,
			env
		});
		assertAuthProfileMigrationCandidates({
			databasePath,
			candidates: legacySources,
			hasCredentials: () => Boolean(store && Object.keys(store.profiles).length > 0),
			provider: effectiveOptions?.migrationProvider,
			config: effectiveOptions?.config,
			deferScopedRefusals: effectiveOptions?.deferScopedMigrationRefusals
		});
		if (legacySources.filter((source) => source.kind !== "auth-state").length === 0 || store && Object.keys(store.profiles).length > 0) warnLegacyAuthProfileSourcesIgnored({
			agentDir: effectiveAgentDir,
			env,
			sources: legacySources
		});
		const synced = maybeSyncPersistedExternalCliAuthProfiles({
			store: store && effectiveOptions?.onReadOwner ? withCredentialSources(store, effectiveOptions.database?.path ?? databasePath) : store ?? createEmptyAuthProfileStore(),
			agentDir: effectiveAgentDir,
			options: effectiveOptions
		});
		return applyScopedAuthReadThrough(markRuntimePersistedProfiles(synced));
	}
	const { loadAuthProfileStoreForRuntime, loadAuthProfileStoreForRuntimeAsync } = createAuthProfileStoreRuntimeReader({
		isEnvOnlyAuthProfileRuntime,
		getScopedAuthProfileEnv,
		resolveRuntimeAuthProfileAgentDir,
		resolveRuntimeAuthProfileLoadOptions,
		loadAuthProfileStoreForAgent,
		overlayExternalAuthProfiles,
		captureScope: () => {
			const mode = authProfileRuntimeMode.getStore();
			return {
				isolated: Boolean(mode),
				run: (agentDir, env, run) => mode?.kind === "agent-dir" ? authProfileRuntimeMode.run({
					...mode,
					agentDir,
					env
				}, run) : run()
			};
		}
	});
	/** Retain read owners, never copies of their migration refusals, for a session facade. */
	function createAuthProfileStoreReadScope(agentDir, config) {
		let mode = authProfileRuntimeMode.getStore();
		const env = { ...mode?.kind === "agent-dir" ? mode.env : process.env };
		const effectiveAgentDir = mode?.kind === "agent-dir" ? mode.agentDir : agentDir;
		const owners = /* @__PURE__ */ new Map();
		if (mode?.kind === "agent-dir" && mode.sharedStore) {
			const databasePath = resolveSharedAuthStorePath(env);
			mode = {
				...mode,
				sharedStore: withCredentialSources(mode.sharedStore, databasePath)
			};
			owners.set(databasePath, {
				databasePath,
				candidates: resolveLegacyAuthProfileSourceCandidates({ env }),
				readStore: () => loadPersistedSharedAuthProfileStore(env)
			});
		}
		const read = () => {
			const load = () => loadAuthProfileStoreForRuntime(effectiveAgentDir, {
				config,
				readOnly: true,
				allowKeychainPrompt: false,
				deferScopedMigrationRefusals: true,
				onReadOwner: (owner) => {
					owners.set(owner.databasePath, owner);
				}
			}, env);
			const store = mode ? authProfileRuntimeMode.run(mode, load) : authProfileRuntimeMode.exit(load);
			for (const owner of owners.values()) assertAuthProfileMigrationStateAtDatabasePath(owner.databasePath, void 0, config, true);
			return store;
		};
		return {
			agentDir: effectiveAgentDir,
			store: read(),
			read,
			getRuntimeSnapshots: () => [...owners.keys()].map((databasePath) => getRuntimeAuthProfileStoreSnapshotAtDatabasePath(databasePath)).filter((snapshot) => snapshot !== void 0),
			assertCredentialReady: (source, baseUrl) => {
				const requestConfig = config && baseUrl !== void 0 ? projectModelProviderConfig(config, source.provider, { baseUrl }) : config;
				assertAuthProfileCredentialMigrationStateAtDatabasePath(source.databasePath, source.provider, requestConfig);
			},
			assertProviderReady: (provider, baseUrl) => {
				const requestConfig = config && provider && baseUrl !== void 0 ? projectModelProviderConfig(config, provider, { baseUrl }) : config;
				for (const owner of owners.values()) assertAuthProfileMigrationCandidates({
					databasePath: owner.databasePath,
					candidates: owner.candidates,
					hasCredentials: () => Object.keys(owner.readStore()?.profiles ?? {}).length > 0,
					provider,
					config: requestConfig
				});
			}
		};
	}
	/** Load auth profiles for secret resolution without keychain prompts or writes. */
	function loadAuthProfileStoreForSecretsRuntime(agentDir, options) {
		return loadAuthProfileStoreForRuntime(agentDir, {
			...options,
			readOnly: true,
			allowKeychainPrompt: false
		});
	}
	/** Load auth profiles with runtime external profiles removed from the result. */
	function loadAuthProfileStoreWithoutExternalProfiles(agentDir, loadOptions) {
		if (loadOptions?.profileId && isUserModelAuthProfileId(loadOptions.profileId)) {
			const shared = loadAuthProfileStoreWithoutExternalProfiles(agentDir, {
				...loadOptions,
				profileId: void 0
			});
			return authProfileRuntimeMode.getStore() ? shared : materializePersonalAuthProfile(shared, loadOptions.profileId);
		}
		const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		const effectiveLoadOptions = resolveRuntimeAuthProfileLoadOptions(loadOptions);
		const options = {
			readOnly: true,
			allowKeychainPrompt: effectiveLoadOptions?.allowKeychainPrompt ?? false,
			...effectiveLoadOptions?.inheritedAuthDir ? { inheritedAuthDir: effectiveLoadOptions.inheritedAuthDir } : {}
		};
		const store = loadAuthProfileStoreForAgent(effectiveAgentDir, options);
		const authPath = effectiveAgentDir ? resolveAuthProfileDatabasePath(effectiveAgentDir) : resolveSharedAuthStorePath();
		const mainAuthPath = options.inheritedAuthDir ? resolveAuthProfileDatabasePath(options.inheritedAuthDir) : resolveSharedAuthStorePath();
		if (!effectiveAgentDir || authPath === mainAuthPath) return setRuntimeLocalProfileMetadata(stripRuntimeExternalProfileMetadata(store), listRuntimeLocalProfileIds(store));
		const mainStore = loadInheritedAuthProfileStore(() => loadAuthProfileStoreForAgent(options.inheritedAuthDir, options), options.inheritedAuthDir, getScopedAuthProfileEnv());
		return mergeLocalAuthProfileStoreWithInheritedStore(store, mainStore);
	}
	/** Ensure an auth store is available, including runtime/external profile overlays. */
	function ensureAuthProfileStore(agentDir, options) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		if (options?.profileId && isUserModelAuthProfileId(options.profileId)) {
			const shared = ensureAuthProfileStore(agentDir, {
				...options,
				profileId: void 0
			});
			return authProfileRuntimeMode.getStore() ? shared : materializePersonalAuthProfile(shared, options.profileId);
		}
		const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		const effectiveOptions = resolveRuntimeAuthProfileLoadOptions(options);
		const externalCli = resolveExternalCliOverlayOptions(effectiveOptions);
		const runtimeStore = resolveRuntimeAuthProfileStore(effectiveAgentDir, effectiveOptions);
		const store = overlayExternalAuthProfiles(ensureAuthProfileStoreWithoutExternalProfiles(effectiveAgentDir, effectiveOptions), {
			agentDir: effectiveAgentDir,
			...externalCli
		});
		if (!runtimeStore) {
			if (!getScopedSharedAuthStore() && hasScopedExternalCliOverlay(externalCli) && (store.runtimeExternalProfileIds?.length ?? 0) > 0) setRuntimeAuthProfileStoreSnapshot(store, effectiveAgentDir);
			return store;
		}
		if (hasScopedExternalCliOverlay(externalCli)) {
			const materialized = mergeRuntimeExternalProfileState({
				next: store,
				existing: runtimeStore
			});
			if (!isDeepStrictEqual(materialized, runtimeStore)) updateRuntimeAuthProfileStoreSnapshot(materialized, effectiveAgentDir);
			return store;
		}
		return mergeRuntimeExternalProfileState({
			next: store,
			existing: runtimeStore
		});
	}
	/** Ensure an auth store is available without external profile overlays. */
	function ensureAuthProfileStoreWithoutExternalProfiles(agentDir, options) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		if (options?.profileId && isUserModelAuthProfileId(options.profileId)) {
			const shared = ensureAuthProfileStoreWithoutExternalProfiles(agentDir, {
				...options,
				profileId: void 0
			});
			return authProfileRuntimeMode.getStore() ? shared : materializePersonalAuthProfile(shared, options.profileId);
		}
		const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		const effectiveOptions = resolveRuntimeAuthProfileLoadOptions(options) ?? { ...options };
		const runtimeStore = resolveRuntimeAuthProfileStore(effectiveAgentDir, effectiveOptions);
		if (runtimeStore) return buildAuthProfileStoreWithoutExternalProfiles({
			store: runtimeStore,
			agentDir: effectiveAgentDir,
			options: effectiveOptions
		});
		const store = loadAuthProfileStoreForAgent(effectiveAgentDir, effectiveOptions);
		const authPath = effectiveAgentDir ? resolveAuthProfileDatabasePath(effectiveAgentDir) : resolveSharedAuthStorePath();
		const mainAuthPath = effectiveOptions.inheritedAuthDir ? resolveAuthProfileDatabasePath(effectiveOptions.inheritedAuthDir) : resolveSharedAuthStorePath();
		if (!effectiveAgentDir || authPath === mainAuthPath) return stripRuntimeExternalProfileMetadata(store);
		const mainStore = loadInheritedAuthProfileStore(() => loadAuthProfileStoreForAgent(effectiveOptions.inheritedAuthDir, effectiveOptions), effectiveOptions.inheritedAuthDir, getScopedAuthProfileEnv());
		return stripRuntimeExternalProfileMetadata(mainStore ? mergeAuthProfileStores(mainStore, store, { preserveBaseRuntimeExternalProfiles: true }) : store);
	}
	/** Load the store shape used when applying local-only auth updates. */
	function ensureAuthProfileStoreForLocalUpdate(agentDir) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		const store = loadAuthProfileStoreForAgent(effectiveAgentDir, { syncExternalCli: false });
		const authPath = effectiveAgentDir ? resolveAuthProfileDatabasePath(effectiveAgentDir) : resolveSharedAuthStorePath();
		const mainAgentDir = resolveRuntimeAuthProfileAgentDir();
		const mainAuthPath = mainAgentDir ? resolveAuthProfileDatabasePath(mainAgentDir) : resolveSharedAuthStorePath();
		if (!effectiveAgentDir || authPath === mainAuthPath) return store;
		const mainStore = loadInheritedAuthProfileStore(() => loadAuthProfileStoreForAgent(void 0, {
			readOnly: true,
			syncExternalCli: false
		}), void 0, getScopedAuthProfileEnv());
		return mainStore ? mergeAuthProfileStores(mainStore, store, { preserveBaseRuntimeExternalProfiles: true }) : store;
	}
	function saveAuthProfileStoreInTransaction(store, agentDir, options, database, owner, publishFromSuppliedStore = false) {
		const persistenceAgentDir = "agentId" in database ? agentDir : void 0;
		const savedAuthPath = owner.databasePath;
		const savesMainStore = savedAuthPath === owner.sharedDatabasePath;
		const loadedPersistedStores = loadPersistedAuthProfileStores(persistenceAgentDir, database, owner);
		const persistedStores = {
			...loadedPersistedStores,
			localStore: loadedPersistedStores.localStore ?? {
				version: 1,
				profiles: {},
				...loadPersistedAuthProfileState(persistenceAgentDir, database)
			}
		};
		const localStore = buildLocalAuthProfileStoreForSave({
			owner,
			store,
			agentDir: persistenceAgentDir,
			options,
			persistedStores
		});
		const existingRaw = readPersistedAuthProfileStoreRaw(persistenceAgentDir, database);
		const { payload, statePayload, publication } = prepareAuthProfileStoreMutation({
			existingRaw,
			existingState: readPersistedAuthProfileStateRaw(persistenceAgentDir, database),
			store: localStore,
			selectionProfiles: {
				...persistedStores.mainStore?.profiles,
				...store.profiles,
				...localStore.profiles
			}
		});
		const { credentialsChanged, stateChanged } = publication;
		const suppliedRuntimeStore = publishFromSuppliedStore ? markRuntimePersistedProfiles(buildLocalAuthProfileStoreForSave({
			owner,
			store,
			agentDir: persistenceAgentDir,
			options: {
				...options,
				filterExternalAuthProfiles: false
			},
			persistedStores
		}), localStore) : void 0;
		if (credentialsChanged) writePersistedAuthProfileStoreRaw(payload, persistenceAgentDir, database);
		if (stateChanged) writePersistedAuthProfileStateRaw(statePayload, persistenceAgentDir, database);
		const committedSharedStore = savesMainStore ? setRuntimeLocalProfileMetadata(markRuntimePersistedProfiles(localStore), listRuntimeLocalProfileIds(localStore)) : void 0;
		const publishRuntimeSnapshots = () => {
			const derivedSnapshots = savesMainStore ? listRuntimeAuthProfileStoreSnapshotsForSharedOwner(owner) : [];
			if (credentialsChanged || stateChanged) noteRuntimeAuthProfileStorePersistedMutation(persistenceAgentDir, publication, owner);
			try {
				assertAuthProfileMigrationStateAtDatabasePath(savedAuthPath);
			} catch (error) {
				for (const derived of derivedSnapshots) clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(derived.databasePath, derived.agentDir);
				throw error;
			}
			if (suppliedRuntimeStore) {
				const existing = getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(savedAuthPath);
				if (existing) {
					const materialized = runtimeAuthProfileSnapshotSharesOwner(existing.owner, owner) ? materializeRuntimeAuthProfileStoreSnapshot(suppliedRuntimeStore, existing.store) : suppliedRuntimeStore;
					setRuntimeAuthProfileStoreSnapshotAtDatabasePath(materialized, savedAuthPath, persistenceAgentDir, owner);
				}
				if (!credentialsChanged && !stateChanged) return true;
			} else if (savesMainStore) {
				const existing = getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(savedAuthPath);
				if (existing) setRuntimeAuthProfileStoreSnapshotAtDatabasePath(runtimeAuthProfileSnapshotSharesOwner(existing.owner, owner) ? materializeRuntimeAuthProfileStoreSnapshot(committedSharedStore, existing.store) : committedSharedStore, savedAuthPath, persistenceAgentDir, owner);
			} else refreshRuntimeAuthProfileStoreSnapshot(persistenceAgentDir, owner);
			let converged = true;
			for (const derived of derivedSnapshots) converged = convergeRuntimeAuthProfileStoreSnapshot(derived.databasePath, derived.agentDir, () => rebuildRuntimeAuthProfileStoreSnapshot(derived.agentDir, derived, {
				...owner,
				databasePath: derived.databasePath
			}, void 0, committedSharedStore, derived.store.runtimeLocalProfileIds)) && converged;
			return converged;
		};
		return {
			...persistenceAgentDir ? { agentDir: persistenceAgentDir } : {},
			databasePath: savedAuthPath,
			publish: publishRuntimeSnapshots
		};
	}
	/** Save the auth profile store plus sidecar state, preserving runtime overlay metadata. */
	function saveAuthProfileStore(store, agentDir, options, database) {
		const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		if (database) {
			saveAuthProfileStoreWithPreparedOwner(store, effectiveAgentDir, options, database, resolveAuthProfileStoreOwner(database, getScopedAuthProfileEnv()));
			return;
		}
		runAuthProfileWriteTransaction(effectiveAgentDir, (transactionDatabase, owner) => {
			const publication = saveAuthProfileStoreInTransaction(store, effectiveAgentDir, options, transactionDatabase, owner);
			deferSqlitePostCommitPublication(transactionDatabase.db, () => publishRuntimeSnapshotsAfterCommit(publication));
		}, {
			sharedStoreWrite: options?.sharedStoreWrite,
			env: getScopedAuthProfileEnv()
		});
	}
	/** Core transaction callers carry the owner already selected before opening SQLite. */
	function saveAuthProfileStoreWithPreparedOwner(store, agentDir, options, database, owner) {
		const publish = saveAuthProfileStoreInTransaction(store, agentDir, options, database, owner, true);
		const publishAfterCommit = () => {
			publishRuntimeSnapshotsAfterCommit(publish);
		};
		if (!deferSqlitePostCommitPublication(database.db, publishAfterCommit)) publishAfterCommit();
	}
	/**
	* Commit only while both persisted auth rows still match the captured baseline.
	* The caller claims `owned` before publishing because publication is fallible.
	*/
	function saveAuthProfileStoreIfPersistenceSnapshotMatches(params) {
		const agentDir = resolveRuntimeAuthProfileAgentDir(params.agentDir);
		assertAuthProfilePersistenceOwner(params.snapshot.owner, agentDir, params.stateDir);
		let publishRuntimeSnapshots;
		const owned = runAuthProfileWriteTransaction(agentDir, (database, owner) => {
			if (params.snapshot.owner.databasePath !== database.path) throw new Error("auth profile persistence snapshot belongs to another database");
			const currentCredentials = readPersistedAuthProfileStoreRaw(agentDir, database);
			const currentState = readPersistedAuthProfileStateRaw(agentDir, database);
			if (!isDeepStrictEqual(currentCredentials, params.snapshot.credentialsRaw) || !isDeepStrictEqual(currentState, params.snapshot.stateRaw)) throw new Error("auth profile store changed after secrets apply captured it");
			const runtimeAtSaveEdge = captureRuntimeAuthProfileStorePersistenceSnapshot(owner);
			const derivedRuntimeRevisionsAtSaveEdge = runtimeAtSaveEdge.derivedRuntimeStores?.flatMap((entry) => typeof entry.runtimeRevision === "number" ? [{
				databasePath: entry.databasePath,
				agentDir: entry.agentDir,
				runtimeRevision: entry.runtimeRevision
			}] : []);
			publishRuntimeSnapshots = saveAuthProfileStoreInTransaction(params.store, agentDir, params.options, database, owner);
			return {
				owner,
				credentialsRaw: readPersistedAuthProfileStoreRaw(agentDir, database),
				stateRaw: readPersistedAuthProfileStateRaw(agentDir, database),
				runtimeCaptured: false,
				runtimeRevisionAtSaveEdge: runtimeAtSaveEdge.runtimeRevision,
				derivedRuntimeRevisionsAtSaveEdge
			};
		}, { env: params.snapshot.owner.env });
		return {
			owned,
			publishRuntimeSnapshots: () => {
				if (!publishRuntimeSnapshots) return true;
				const publication = publishRuntimeSnapshots;
				return publishRuntimeSnapshotsAfterCommit({
					...publication,
					publish: () => {
						const owner = owned.owner;
						recordRuntimeAuthProfileStorePublicationEdge(owned, captureRuntimeAuthProfileStorePersistenceSnapshot(owner));
						const converged = publication.publish();
						recordRuntimeAuthProfileStoreOwnership(owned, captureRuntimeAuthProfileStorePersistenceSnapshot(owner));
						return converged;
					}
				});
			}
		};
	}
	return {
		createAuthProfileStoreReadScope,
		updateAuthProfileStoreWithLock,
		loadAuthProfileStore,
		loadAuthProfileStoreForRuntime,
		loadAuthProfileStoreForRuntimeAsync,
		loadAuthProfileStoreForSecretsRuntime,
		loadAuthProfileStoreWithoutExternalProfiles,
		ensureAuthProfileStore,
		ensureAuthProfileStoreWithoutExternalProfiles,
		ensureAuthProfileStoreForLocalUpdate,
		saveAuthProfileStore,
		saveAuthProfileStoreWithPreparedOwner,
		saveAuthProfileStoreIfPersistenceSnapshotMatches,
		findPersistedAuthProfileCredential
	};
}
//#endregion
export { isAmbientCredentialAllowedByProviderAuthPin as C, resolveExternalCliAuthProfiles as D, readExternalCliBootstrapCredential as E, createExternalAuthRuntime as S, listExternalCliSyncProviderIds as T, publishPreparedRuntimeAuthProfileStoreSnapshot as _, findPersistedAuthProfileCredential as a, readSharedAuthProfileRows as b, getScopedAuthProfileEnv as c, resolvePersistedAuthProfileOwnerAgentDir as d, resolveRuntimeAuthProfileAgentDir as f, buildPortableAuthProfileStoreForAgentCopy as g, withEnvOnlyAuthProfileStore as h, createAuthProfileStoreRuntime as i, getScopedSharedAuthStore as l, withAuthProfileStoreAgentDir as m, captureAuthProfileStorePersistenceSnapshot as n, getPreparedRuntimeAuthProfileStoreSnapshot as o, restoreAuthProfileStorePersistenceSnapshot as p, clearRuntimeAuthProfileStoreSnapshot as r, getRuntimeAuthProfileStoreSnapshot as s, applyScopedAuthReadThrough as t, isSharedMainAuthProfileAgentDir as u, loadPersistedAuthProfileStoreFromRows as v, isPersistedExternalCliAuthProfile as w, materializePersonalAuthProfile as x, prepareAgentAuthProfileRowsRead as y };
