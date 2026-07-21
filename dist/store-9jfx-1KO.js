import { o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { c as isRecord } from "./utils-CRO4LGEB.js";
import "./number-coercion-EqFmHmOw.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import { a as replaceRuntimeAuthProfileStoreSnapshots$1, g as cloneAuthProfileStore, i as hasRuntimeAuthProfileStoreSnapshot, l as resolveAuthStorePath, n as getRuntimeAuthProfileStoreSnapshot$1, o as setRuntimeAuthProfileStoreSnapshot, t as clearRuntimeAuthProfileStoreSnapshots$1 } from "./runtime-snapshots-CsKLV87K.js";
import { A as MINIMAX_CLI_PROFILE_ID, C as shouldPersistRuntimeExternalOAuthProfile, D as CLAUDE_CLI_PROFILE_ID, N as OPENAI_CODEX_DEFAULT_PROFILE_ID, P as log, S as shouldBootstrapFromExternalCliCredential, T as isSafeToCopyOAuthIdentity, _ as areOAuthCredentialsEquivalent, a as buildPersistedAuthProfileSecretsStore, b as isSafeToAdoptMainStoreOAuthIdentity, c as loadPersistedAuthProfileStore, d as buildPersistedAuthProfileState, k as EXTERNAL_CLI_SYNC_TTL_MS, l as mergeAuthProfileStores, m as savePersistedAuthProfileState, p as loadPersistedAuthProfileState, u as mergeOAuthFileIntoStore, v as hasUsableOAuthCredential, x as overlayRuntimeExternalOAuthProfiles, y as isSafeToAdoptBootstrapOAuthIdentity } from "./source-check-CsikPIZO.js";
import { S as resolveExternalAuthProfilesWithPlugins } from "./provider-runtime-CIKTXkgy.js";
import { i as readMiniMaxCliCredentialsCached, n as readCodexCliCredentialsCached, t as readClaudeCliCredentialsCached } from "./cli-credentials-B074Y7I_.js";
import { c as writePersistedAuthProfileStoreRaw, o as runAuthProfileWriteTransaction, r as readPersistedAuthProfileStoreRaw, s as writePersistedAuthProfileStateRaw } from "./sqlite-CvwJ2KO6.js";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/external-cli-sync.ts
/**
* External CLI OAuth synchronization.
* Reads supported CLI credential stores, decides whether those credentials can
* safely bootstrap local auth profiles, and returns runtime/persisted overlays.
*/
/** Return true when imported CLI credentials match an existing profile identity. */
function isSafeToUseExternalCliCredential(existing, imported) {
	if (!existing) return true;
	if (existing.provider !== imported.provider) return false;
	return isSafeToCopyOAuthIdentity(existing, imported);
}
const EXTERNAL_CLI_SYNC_PROVIDERS = [
	{
		profileId: OPENAI_CODEX_DEFAULT_PROFILE_ID,
		profileAliases: ["openai:default"],
		provider: "openai",
		aliases: [
			"openai",
			"codex",
			"codex-cli",
			"codex-app-server"
		],
		readCredentials: (options) => readCodexCliCredentialsCached({
			ttlMs: EXTERNAL_CLI_SYNC_TTL_MS,
			allowKeychainPrompt: options?.allowKeychainPrompt
		}),
		bootstrapOnly: true
	},
	{
		profileId: CLAUDE_CLI_PROFILE_ID,
		provider: "claude-cli",
		readCredentials: (options) => {
			const credential = readClaudeCliCredentialsCached({
				ttlMs: EXTERNAL_CLI_SYNC_TTL_MS,
				allowKeychainPrompt: options?.allowKeychainPrompt
			});
			if (credential?.type !== "oauth") return null;
			return {
				...credential,
				provider: "claude-cli"
			};
		}
	},
	{
		profileId: MINIMAX_CLI_PROFILE_ID,
		provider: "minimax-portal",
		aliases: ["minimax", "minimax-cli"],
		readCredentials: () => readMiniMaxCliCredentialsCached({ ttlMs: EXTERNAL_CLI_SYNC_TTL_MS })
	}
];
function resolveExternalCliSyncProvider(params) {
	const provider = EXTERNAL_CLI_SYNC_PROVIDERS.find((entry) => externalCliProfileIdMatches(entry, params.profileId));
	if (!provider) return null;
	if (params.credential && !listExternalCliProviderIds(provider).includes(params.credential.provider)) return null;
	return provider;
}
function listExternalCliProfileIds(providerConfig) {
	return [providerConfig.profileId, ...providerConfig.profileAliases ?? []];
}
function listExternalCliProviderIds(providerConfig) {
	return [providerConfig.provider, ...providerConfig.aliases ?? []];
}
function normalizeExternalCliCredentialProvider(credential, provider) {
	return credential ? {
		...credential,
		provider
	} : null;
}
function getAuthProfileProviderPrefix(profileId) {
	return profileId.split(":", 1)[0]?.trim() ?? "";
}
function externalCliProfileIdMatches(providerConfig, profileId, options) {
	if (listExternalCliProfileIds(providerConfig).includes(profileId)) return true;
	if (!options?.allowLegacyNamespace || providerConfig.profileId !== "openai:default") return false;
	return normalizeProviderId(getAuthProfileProviderPrefix(profileId)) === "openai";
}
function hasInlineOAuthTokenMaterial$1(credential) {
	return [
		credential.access,
		credential.refresh,
		credential.idToken
	].some((value) => typeof value === "string" && value.trim().length > 0);
}
function hasManagedProviderOAuth(store, providerConfig) {
	return Object.values(store.profiles).some((credential) => credential?.type === "oauth" && listExternalCliProviderIds(providerConfig).includes(credential.provider) && hasInlineOAuthTokenMaterial$1(credential));
}
/** Read a CLI credential only for safe bootstrap of an unusable local profile. */
function readExternalCliBootstrapCredential(params) {
	const provider = resolveExternalCliSyncProvider(params);
	if (!provider) return null;
	if (provider.bootstrapOnly && hasManagedProviderOAuth(params.store, provider)) return null;
	if (provider.bootstrapOnly && !params.allowInlineOAuthTokenMaterial && hasInlineOAuthTokenMaterial$1(params.credential)) return null;
	return normalizeExternalCliCredentialProvider(provider.readCredentials({ allowKeychainPrompt: params.allowKeychainPrompt }), params.credential.provider);
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
	if (Array.from(options?.profileIds ?? []).some((profileId) => externalCliProfileIdMatches(providerConfig, profileId.trim(), { allowLegacyNamespace: true }))) return true;
	if (!providerScope || providerScope.size === 0) return false;
	return listExternalCliProviderIds(providerConfig).some((alias) => {
		const raw = alias.trim().toLowerCase();
		const normalized = normalizeProviderId(alias);
		return providerScope.has(raw) || (normalized ? providerScope.has(normalized) : false);
	});
}
function listScopedExternalCliProfileIds(params) {
	const { options, providerConfig, store } = params;
	if (providerConfig.bootstrapOnly && hasManagedProviderOAuth(store, providerConfig)) return [];
	const requestedProfileIds = Array.from(options?.profileIds ?? []).map((value) => value.trim()).filter((value) => value.length > 0);
	if (requestedProfileIds.length > 0) return requestedProfileIds.filter((profileId) => externalCliProfileIdMatches(providerConfig, profileId, { allowLegacyNamespace: true }));
	const existingProfileIds = Object.keys(store.profiles).filter((profileId) => externalCliProfileIdMatches(providerConfig, profileId));
	if (existingProfileIds.length > 0) return existingProfileIds;
	return options?.providerIds ? [providerConfig.profileId] : [];
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
				log.debug("kept explicit local auth over external cli bootstrap", {
					profileId,
					provider: providerConfig.provider,
					localType: existing.type,
					localProvider: existing.provider
				});
				continue;
			}
			if (providerConfig.bootstrapOnly && existingOAuth && hasInlineOAuthTokenMaterial$1(existingOAuth)) {
				log.debug("kept local oauth over external cli bootstrap-only provider", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (existingOAuth && !providerConfig.bootstrapOnly && hasUsableOAuthCredential(existingOAuth, now)) continue;
			const creds = normalizeExternalCliCredentialProvider(providerConfig.readCredentials({ allowKeychainPrompt: options?.allowKeychainPrompt }), existingOAuth?.provider ?? providerConfig.provider);
			if (!creds) continue;
			if (existingOAuth && !isSafeToUseExternalCliCredential(existingOAuth, creds)) {
				log.warn("refused external cli oauth bootstrap: identity mismatch", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (existingOAuth && !isSafeToAdoptBootstrapOAuthIdentity(existingOAuth, creds) && !areOAuthCredentialsEquivalent(existingOAuth, creds)) {
				log.warn("refused external cli oauth bootstrap: identity mismatch or missing binding", {
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
				if (existingOAuth) log.debug("kept usable local oauth over external cli bootstrap", {
					profileId,
					provider: providerConfig.provider,
					localExpires: existingOAuth.expires,
					externalExpires: creds.expires
				});
				continue;
			}
			log.debug("used external cli oauth bootstrap because local oauth was missing or unusable", {
				profileId,
				provider: providerConfig.provider,
				localExpires: existingOAuth?.expires,
				externalExpires: creds.expires
			});
			profiles.push({
				profileId,
				credential: creds,
				persistence: providerConfig.bootstrapOnly ? "runtime-only" : "persisted"
			});
		}
	}
	return profiles;
}
function normalizeExternalAuthProfile(profile) {
	if (!profile?.profileId || !profile.credential) return null;
	return {
		...profile,
		persistence: profile.persistence ?? "runtime-only"
	};
}
function resolveExternalAuthProfileMap(params) {
	const env = params.env ?? process.env;
	const profiles = resolveExternalAuthProfilesWithPlugins({
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
	const resolved = /* @__PURE__ */ new Map();
	const cliProfiles = resolveExternalCliAuthProfiles?.(params.store, {
		allowKeychainPrompt: params.externalCli?.allowKeychainPrompt,
		providerIds: params.externalCli?.externalCliProviderIds,
		profileIds: params.externalCli?.externalCliProfileIds
	}) ?? [];
	for (const profile of cliProfiles) resolved.set(profile.profileId, {
		profileId: profile.profileId,
		credential: profile.credential,
		persistence: profile.persistence ?? "runtime-only"
	});
	for (const rawProfile of profiles) {
		const profile = normalizeExternalAuthProfile(rawProfile);
		if (!profile) continue;
		resolved.set(profile.profileId, profile);
	}
	return resolved;
}
/** List runtime-only and persisted external auth profiles for this store. */
function listRuntimeExternalAuthProfiles(params) {
	return Array.from(resolveExternalAuthProfileMap({
		store: params.store,
		agentDir: params.agentDir,
		env: params.env,
		externalCli: params.externalCli
	}).values());
}
function hasPersistableExternalCliSyncCandidate(store, params) {
	if (params?.externalCliProviderIds || params?.externalCliProfileIds) return true;
	for (const profileId of [CLAUDE_CLI_PROFILE_ID, MINIMAX_CLI_PROFILE_ID]) if (store.profiles[profileId]?.type === "oauth") return true;
	return false;
}
function hasScopedExternalCliOverlay$1(params) {
	return Boolean(params?.externalCliProviderIds || params?.externalCliProfileIds);
}
/** Overlay external auth profiles onto a cloned auth store for runtime use. */
function overlayExternalAuthProfiles(store, params) {
	return overlayRuntimeExternalOAuthProfiles(store, listRuntimeExternalAuthProfiles({
		store,
		agentDir: params?.agentDir,
		env: params?.env,
		externalCli: params
	}), { runtimeExternalProfileIdsAuthoritative: !hasScopedExternalCliOverlay$1(params) });
}
/** Persist safe external CLI OAuth profiles that own their local profile slot. */
function syncPersistedExternalCliAuthProfiles(store, params) {
	if (!hasPersistableExternalCliSyncCandidate(store, params)) return store;
	const persistedProfiles = (resolveExternalCliAuthProfiles?.(store, {
		allowKeychainPrompt: params?.allowKeychainPrompt,
		providerIds: params?.externalCliProviderIds,
		profileIds: params?.externalCliProfileIds
	}) ?? []).filter((profile) => profile.persistence === "persisted");
	if (persistedProfiles.length === 0) return store;
	let next;
	for (const profile of persistedProfiles) {
		const existing = (next ?? store).profiles[profile.profileId];
		if (existing?.type === "oauth" && areOAuthCredentialsEquivalent(existing, profile.credential)) continue;
		next ??= cloneAuthProfileStore(store);
		next.profiles[profile.profileId] = profile.credential;
	}
	return next ?? store;
}
//#endregion
//#region src/agents/auth-profiles/store.ts
/**
* Auth profile store orchestration.
* Merges persisted stores, runtime snapshots, inherited main-agent OAuth
* profiles, and external CLI overlays while keeping save paths local.
*/
const INLINE_OAUTH_TOKEN_FIELDS = [
	"access",
	"refresh",
	"idToken"
];
function hasInlineOAuthTokenMaterial(credential) {
	return INLINE_OAUTH_TOKEN_FIELDS.some((field) => credential[field] !== void 0);
}
function hasChangedInlineOAuthTokenMaterial(params) {
	return INLINE_OAUTH_TOKEN_FIELDS.some((field) => {
		if (params.credential[field] === void 0) return false;
		return !isDeepStrictEqual(params.credential[field], params.existingCredential[field]);
	});
}
function preserveLegacyOAuthRefsOnSave(params) {
	if (!isRecord(params.existingRaw) || !isRecord(params.existingRaw.profiles)) return params.payload;
	let nextProfiles;
	for (const [profileId, credential] of Object.entries(params.payload.profiles)) {
		if (!isRecord(credential) || credential.oauthRef !== void 0 || credential.type !== "oauth") continue;
		const existingCredential = params.existingRaw.profiles[profileId];
		if (!isRecord(existingCredential) || existingCredential.oauthRef === void 0 || existingCredential.type !== "oauth") continue;
		if (hasInlineOAuthTokenMaterial(credential) && hasChangedInlineOAuthTokenMaterial({
			credential,
			existingCredential
		})) continue;
		nextProfiles ??= { ...params.payload.profiles };
		nextProfiles[profileId] = {
			...credential,
			oauthRef: existingCredential.oauthRef
		};
	}
	return nextProfiles ? {
		...params.payload,
		profiles: nextProfiles
	} : params.payload;
}
function resolvePersistedLoadOptions(options) {
	return {
		...options?.allowKeychainPrompt !== void 0 ? { allowKeychainPrompt: options.allowKeychainPrompt } : {},
		...options?.database ? { database: options.database } : {}
	};
}
function isInheritedMainOAuthCredential(params) {
	if (!params.agentDir || params.credential.type !== "oauth") return false;
	if (resolveAuthStorePath(params.agentDir) === resolveAuthStorePath()) return false;
	if (loadPersistedAuthProfileStore(params.agentDir)?.profiles[params.profileId]) return false;
	const mainCredential = loadPersistedAuthProfileStore()?.profiles[params.profileId];
	return mainCredential?.type === "oauth" && (isDeepStrictEqual(mainCredential, params.credential) || shouldUseMainOwnerForLocalOAuthCredential({
		local: params.credential,
		main: mainCredential
	}));
}
function shouldUseMainOwnerForLocalOAuthCredential(params) {
	if (params.local.type !== "oauth" || params.main?.type !== "oauth") return false;
	if (!isSafeToAdoptMainStoreOAuthIdentity(params.local, params.main)) return false;
	if (isDeepStrictEqual(params.local, params.main)) return true;
	const mainExpires = asDateTimestampMs(params.main.expires);
	if (mainExpires === void 0) return false;
	const localExpires = asDateTimestampMs(params.local.expires);
	return localExpires === void 0 || mainExpires >= localExpires;
}
function resolveRuntimeAuthProfileStore(agentDir, options) {
	const mainKey = resolveAuthStorePath(void 0);
	const requestedKey = resolveAuthStorePath(agentDir);
	const mainStore = getRuntimeAuthProfileStoreSnapshot$1(void 0);
	const requestedStore = getRuntimeAuthProfileStoreSnapshot$1(agentDir);
	if (!agentDir || requestedKey === mainKey) {
		if (!mainStore) return null;
		return mainStore;
	}
	if (mainStore && requestedStore) return mergeAuthProfileStores(mainStore, requestedStore, { preserveBaseRuntimeExternalProfiles: true });
	if (requestedStore) return mergeAuthProfileStores(loadAuthProfileStoreForAgent(void 0, {
		readOnly: true,
		syncExternalCli: false,
		...resolvePersistedLoadOptions(options)
	}), requestedStore, { preserveBaseRuntimeExternalProfiles: true });
	if (mainStore) return mainStore;
	return null;
}
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
function hasScopedExternalCliOverlay(options) {
	return options.externalCliProviderIds !== void 0 || options.externalCliProfileIds !== void 0;
}
function maybeSyncPersistedExternalCliAuthProfiles(params) {
	if (params.options?.readOnly === true || params.options?.syncExternalCli === false || process.env.OPENCLAW_AUTH_STORE_READONLY === "1") return {
		store: params.store,
		cacheable: true
	};
	const synced = syncPersistedExternalCliAuthProfiles(params.store, {
		agentDir: params.agentDir,
		...resolveExternalCliOverlayOptions(params.options)
	});
	if (synced === params.store) return {
		store: params.store,
		cacheable: true
	};
	const changedProfiles = Object.entries(synced.profiles).filter(([profileId, credential]) => {
		const previous = params.store.profiles[profileId];
		return !isDeepStrictEqual(previous, credential);
	});
	if (changedProfiles.length === 0) return {
		store: synced,
		cacheable: true
	};
	try {
		return runAuthProfileWriteTransaction(params.agentDir, (database) => {
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
					log.debug("skipped persisted external cli auth sync for concurrently changed profile", { profileId });
					continue;
				}
				latestStore.profiles[profileId] = credential;
				changed = true;
			}
			if (changed) saveAuthProfileStore(latestStore, params.agentDir, { filterExternalAuthProfiles: false }, database);
			return {
				store: latestStore,
				cacheable: true
			};
		});
	} catch (err) {
		log.warn("skipped persisted external cli auth sync because auth store write failed", { err });
		return {
			store: params.store,
			cacheable: false
		};
	}
}
function shouldKeepProfileInLocalStore(params) {
	if (params.credential.type !== "oauth") return true;
	if (isInheritedMainOAuthCredential({
		agentDir: params.agentDir,
		profileId: params.profileId,
		credential: params.credential
	})) return false;
	if (params.options?.filterExternalAuthProfiles === false) return true;
	if (params.store.runtimeExternalProfileIds?.includes(params.profileId)) {
		if (loadPersistedAuthProfileStore(params.agentDir)?.profiles[params.profileId]) return shouldPersistRuntimeExternalOAuthProfile({
			profileId: params.profileId,
			credential: params.credential,
			profiles: params.externalProfiles()
		});
		const runtimeCredential = getRuntimeAuthProfileStoreSnapshot(params.agentDir)?.profiles[params.profileId];
		if (!runtimeCredential || isDeepStrictEqual(runtimeCredential, params.credential)) return false;
	}
	return shouldPersistRuntimeExternalOAuthProfile({
		profileId: params.profileId,
		credential: params.credential,
		profiles: params.externalProfiles()
	});
}
function pruneAuthProfileStoreReferences(store, keptProfileIds, keptOrderProfileIds = keptProfileIds) {
	store.order = store.order ? Object.fromEntries(Object.entries(store.order).map(([provider, profileIds]) => [provider, profileIds.filter((profileId) => keptOrderProfileIds.has(profileId))]).filter(([, profileIds]) => profileIds.length > 0)) : void 0;
	store.lastGood = store.lastGood ? Object.fromEntries(Object.entries(store.lastGood).filter(([, profileId]) => keptProfileIds.has(profileId))) : void 0;
	store.usageStats = store.usageStats ? Object.fromEntries(Object.entries(store.usageStats).filter(([profileId]) => keptProfileIds.has(profileId))) : void 0;
	store.runtimePersistedProfileIds = store.runtimePersistedProfileIds?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	if (store.runtimePersistedProfileIds?.length === 0) store.runtimePersistedProfileIds = void 0;
	store.runtimeExternalProfileIds = store.runtimeExternalProfileIds?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	if (store.runtimeExternalProfileIds?.length === 0 && store.runtimeExternalProfileIdsAuthoritative !== true) store.runtimeExternalProfileIds = void 0;
	if (store.runtimeExternalProfileIdsAuthoritative === true) store.runtimeExternalProfileIds ??= [];
}
function buildLocalAuthProfileStoreForSave(params) {
	const localStore = cloneAuthProfileStore(params.store);
	let externalProfiles;
	const getExternalProfiles = () => externalProfiles ??= listRuntimeExternalAuthProfiles({
		store: params.store,
		agentDir: params.agentDir
	});
	localStore.profiles = Object.fromEntries(Object.entries(localStore.profiles).filter(([profileId, credential]) => shouldKeepProfileInLocalStore({
		store: params.store,
		profileId,
		credential,
		agentDir: params.agentDir,
		options: params.options,
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
	for (const profileIds of Object.values(loadPersistedAuthProfileState(params.agentDir).order ?? {})) for (const profileId of profileIds) keptOrderProfileIds.add(profileId);
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
	pruneAuthProfileStoreReferences(localStore, keptProfileIds, keptOrderProfileIds);
	if (params.options?.filterExternalAuthProfiles !== false) {
		localStore.runtimeExternalProfileIds = void 0;
		localStore.runtimeExternalProfileIdsAuthoritative = void 0;
	}
	return localStore;
}
function buildAuthProfileStoreWithoutExternalProfiles(params) {
	const runtimeExternalProfileIds = new Set(params.store.runtimeExternalProfileIds ?? []);
	const localStore = cloneAuthProfileStore(params.store);
	if (runtimeExternalProfileIds.size === 0) return stripRuntimeExternalProfileMetadata(localStore);
	for (const profileId of runtimeExternalProfileIds) delete localStore.profiles[profileId];
	pruneAuthProfileStoreReferences(localStore, new Set(Object.keys(localStore.profiles)));
	return stripRuntimeExternalProfileMetadata(mergeAuthProfileStores(loadAuthProfileStoreWithoutExternalProfiles(params.agentDir, params.options), localStore));
}
function stripRuntimeExternalProfileMetadata(store) {
	const stripped = { ...store };
	delete stripped.runtimeExternalProfileIds;
	delete stripped.runtimeExternalProfileIdsAuthoritative;
	return stripped;
}
function markRuntimePersistedProfiles(store, persistedStore = store) {
	const profileIds = Object.entries(persistedStore.profiles).flatMap(([profileId, credential]) => isDeepStrictEqual(store.profiles[profileId], credential) ? [profileId] : []).toSorted();
	return {
		...store,
		runtimePersistedProfileIds: profileIds.length > 0 ? profileIds : void 0
	};
}
function buildRuntimeAuthProfileStoreForSave(params) {
	return buildLocalAuthProfileStoreForSave({
		...params,
		options: {
			...params.options,
			filterExternalAuthProfiles: false
		}
	});
}
function setRuntimeExternalProfileMetadata(params) {
	const profileIds = [...params.profileIds].toSorted();
	params.store.runtimeExternalProfileIds = profileIds.length > 0 || params.authoritative ? profileIds : void 0;
	params.store.runtimeExternalProfileIdsAuthoritative = params.authoritative ? true : void 0;
}
function mergeRuntimeExternalProfileReferences(params) {
	const runtimeExternalProfileIds = new Set(params.existing.runtimeExternalProfileIds ?? []);
	if (params.next.runtimeExternalProfileIdsAuthoritative === true) return params.next;
	if (runtimeExternalProfileIds.size === 0) return params.next;
	const merged = cloneAuthProfileStore(params.next);
	const mergedRuntimeExternalProfileIds = new Set(merged.runtimeExternalProfileIds ?? []);
	const backfilledRuntimeExternalProfileIds = /* @__PURE__ */ new Set();
	for (const profileId of runtimeExternalProfileIds) {
		const existingCredential = params.existing.profiles[profileId];
		const nextCredential = merged.profiles[profileId];
		if (nextCredential) {
			if (mergedRuntimeExternalProfileIds.has(profileId) || existingCredential && isDeepStrictEqual(nextCredential, existingCredential)) mergedRuntimeExternalProfileIds.add(profileId);
			continue;
		}
		if (!existingCredential) continue;
		merged.profiles[profileId] = existingCredential;
		mergedRuntimeExternalProfileIds.add(profileId);
		backfilledRuntimeExternalProfileIds.add(profileId);
		if (params.existing.usageStats?.[profileId]) merged.usageStats = {
			...merged.usageStats,
			[profileId]: params.existing.usageStats[profileId]
		};
	}
	for (const [provider, profileIds] of Object.entries(params.existing.order ?? {})) {
		const externalProfileIds = profileIds.filter((profileId) => backfilledRuntimeExternalProfileIds.has(profileId));
		if (externalProfileIds.length === 0) continue;
		if (merged.order?.[provider]) continue;
		const existingOrder = merged.order?.[provider] ?? [];
		merged.order = {
			...merged.order,
			[provider]: [...externalProfileIds, ...existingOrder.filter((profileId) => !externalProfileIds.includes(profileId))]
		};
	}
	for (const [provider, profileId] of Object.entries(params.existing.lastGood ?? {})) {
		if (!backfilledRuntimeExternalProfileIds.has(profileId) || merged.lastGood?.[provider]) continue;
		merged.lastGood = {
			...merged.lastGood,
			[provider]: profileId
		};
	}
	setRuntimeExternalProfileMetadata({
		store: merged,
		profileIds: mergedRuntimeExternalProfileIds,
		authoritative: params.existing.runtimeExternalProfileIdsAuthoritative === true
	});
	return merged;
}
function mergeRuntimeExternalProfileState(params) {
	const existingRuntimeProfileIds = new Set(params.existing.runtimeExternalProfileIds ?? []);
	if (existingRuntimeProfileIds.size === 0) return params.next;
	const merged = cloneAuthProfileStore(params.next);
	const mergedRuntimeProfileIds = new Set(merged.runtimeExternalProfileIds ?? []);
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
			}
			continue;
		}
		merged.profiles[profileId] = existingCredential;
		mergedRuntimeProfileIds.add(profileId);
		activeRuntimeProfileIds.add(profileId);
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
	return merged;
}
/** Apply an auth store update inside the SQLite write lock. */
async function updateAuthProfileStoreWithLock(params) {
	try {
		return runAuthProfileWriteTransaction(params.agentDir, (database) => {
			const store = loadAuthProfileStoreForAgent(params.agentDir, {
				database,
				readOnly: true,
				syncExternalCli: false
			});
			if (params.updater(store)) saveAuthProfileStore(store, params.agentDir, params.saveOptions, database);
			return store;
		});
	} catch {
		return null;
	}
}
/** Load the main auth profile store with runtime external profiles overlaid. */
function loadAuthProfileStore() {
	const asStore = loadPersistedAuthProfileStore();
	if (asStore) return overlayExternalAuthProfiles(markRuntimePersistedProfiles(asStore));
	return overlayExternalAuthProfiles(markRuntimePersistedProfiles({
		version: 1,
		profiles: {}
	}));
}
function loadAuthProfileStoreForAgent(agentDir, options) {
	const readOnly = options?.readOnly === true;
	const asStore = loadPersistedAuthProfileStore(agentDir, resolvePersistedLoadOptions(options));
	if (asStore) return markRuntimePersistedProfiles(maybeSyncPersistedExternalCliAuthProfiles({
		store: asStore,
		agentDir,
		options
	}).store);
	const store = {
		version: 1,
		profiles: {}
	};
	const mergedOAuth = mergeOAuthFileIntoStore(store);
	const forceReadOnly = process.env.OPENCLAW_AUTH_STORE_READONLY === "1";
	if (!readOnly && !forceReadOnly && mergedOAuth) saveAuthProfileStore(store, agentDir);
	return markRuntimePersistedProfiles(maybeSyncPersistedExternalCliAuthProfiles({
		store,
		agentDir,
		options
	}).store);
}
/** Loads the effective runtime store for an agent, including inherited main profiles. */
function loadAuthProfileStoreForRuntime(agentDir, options) {
	const store = loadAuthProfileStoreForAgent(agentDir, options);
	const authPath = resolveAuthStorePath(agentDir);
	const mainAuthPath = resolveAuthStorePath();
	const externalCli = resolveExternalCliOverlayOptions(options);
	if (!agentDir || authPath === mainAuthPath) return overlayExternalAuthProfiles(store, {
		agentDir,
		...externalCli
	});
	return overlayExternalAuthProfiles(mergeAuthProfileStores(loadAuthProfileStoreForAgent(void 0, options), store, { preserveBaseRuntimeExternalProfiles: true }), {
		agentDir,
		...externalCli
	});
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
	const options = {
		readOnly: true,
		allowKeychainPrompt: loadOptions?.allowKeychainPrompt ?? false
	};
	const store = loadAuthProfileStoreForAgent(agentDir, options);
	const authPath = resolveAuthStorePath(agentDir);
	const mainAuthPath = resolveAuthStorePath();
	if (!agentDir || authPath === mainAuthPath) return stripRuntimeExternalProfileMetadata(store);
	return stripRuntimeExternalProfileMetadata(mergeAuthProfileStores(loadAuthProfileStoreForAgent(void 0, options), store, { preserveBaseRuntimeExternalProfiles: true }));
}
/** Ensure an auth store is available, including runtime/external profile overlays. */
function ensureAuthProfileStore(agentDir, options) {
	const externalCli = resolveExternalCliOverlayOptions(options);
	const runtimeStore = resolveRuntimeAuthProfileStore(agentDir, options);
	const store = overlayExternalAuthProfiles(ensureAuthProfileStoreWithoutExternalProfiles(agentDir, options), {
		agentDir,
		...externalCli
	});
	if (!runtimeStore || hasScopedExternalCliOverlay(externalCli)) return store;
	return mergeRuntimeExternalProfileState({
		next: store,
		existing: runtimeStore
	});
}
/** Ensure an auth store is available without external profile overlays. */
function ensureAuthProfileStoreWithoutExternalProfiles(agentDir, options) {
	const effectiveOptions = { ...options };
	const runtimeStore = resolveRuntimeAuthProfileStore(agentDir, effectiveOptions);
	if (runtimeStore) return buildAuthProfileStoreWithoutExternalProfiles({
		store: runtimeStore,
		agentDir,
		options: effectiveOptions
	});
	const store = loadAuthProfileStoreForAgent(agentDir, effectiveOptions);
	const authPath = resolveAuthStorePath(agentDir);
	const mainAuthPath = resolveAuthStorePath();
	if (!agentDir || authPath === mainAuthPath) return stripRuntimeExternalProfileMetadata(store);
	return stripRuntimeExternalProfileMetadata(mergeAuthProfileStores(loadAuthProfileStoreForAgent(void 0, effectiveOptions), store, { preserveBaseRuntimeExternalProfiles: true }));
}
/** Find a persisted credential in the scoped store, falling back to the main store. */
function findPersistedAuthProfileCredential(params) {
	const requestedProfile = loadPersistedAuthProfileStore(params.agentDir)?.profiles[params.profileId];
	if (requestedProfile || !params.agentDir) return requestedProfile;
	if (resolveAuthStorePath(params.agentDir) === resolveAuthStorePath()) return requestedProfile;
	return loadPersistedAuthProfileStore()?.profiles[params.profileId];
}
/** Resolve which agent dir owns a persisted profile, accounting for inherited OAuth. */
function resolvePersistedAuthProfileOwnerAgentDir(params) {
	if (!params.agentDir) return;
	const requestedStore = loadPersistedAuthProfileStore(params.agentDir);
	if (resolveAuthStorePath(params.agentDir) === resolveAuthStorePath()) return;
	const mainStore = loadPersistedAuthProfileStore();
	const requestedProfile = requestedStore?.profiles[params.profileId];
	if (requestedProfile) return shouldUseMainOwnerForLocalOAuthCredential({
		local: requestedProfile,
		main: mainStore?.profiles[params.profileId]
	}) ? void 0 : params.agentDir;
	return mainStore?.profiles[params.profileId] ? void 0 : params.agentDir;
}
/** Load the store shape used when applying local-only auth updates. */
function ensureAuthProfileStoreForLocalUpdate(agentDir) {
	const store = loadAuthProfileStoreForAgent(agentDir, { syncExternalCli: false });
	const authPath = resolveAuthStorePath(agentDir);
	const mainAuthPath = resolveAuthStorePath();
	if (!agentDir || authPath === mainAuthPath) return store;
	return mergeAuthProfileStores(loadAuthProfileStoreForAgent(void 0, {
		readOnly: true,
		syncExternalCli: false
	}), store, { preserveBaseRuntimeExternalProfiles: true });
}
/** Return the current runtime auth-profile snapshot for an agent dir. */
function getRuntimeAuthProfileStoreSnapshot(agentDir) {
	return getRuntimeAuthProfileStoreSnapshot$1(agentDir);
}
/** Replace runtime auth-profile snapshots, used by tests and prepared runtimes. */
function replaceRuntimeAuthProfileStoreSnapshots(entries) {
	replaceRuntimeAuthProfileStoreSnapshots$1(entries);
}
/** Clear all runtime auth-profile snapshots. */
function clearRuntimeAuthProfileStoreSnapshots() {
	clearRuntimeAuthProfileStoreSnapshots$1();
}
/** Save the auth profile store plus sidecar state, preserving runtime overlay metadata. */
function saveAuthProfileStore(store, agentDir, options, database) {
	const localStore = buildLocalAuthProfileStoreForSave({
		store,
		agentDir,
		options
	});
	const existingRaw = readPersistedAuthProfileStoreRaw(agentDir, database);
	const payload = preserveLegacyOAuthRefsOnSave({
		payload: buildPersistedAuthProfileSecretsStore(localStore),
		existingRaw
	});
	if (!isDeepStrictEqual(existingRaw, payload)) writePersistedAuthProfileStoreRaw(payload, agentDir, database);
	if (database) writePersistedAuthProfileStateRaw(buildPersistedAuthProfileState(localStore), agentDir, database);
	else savePersistedAuthProfileState(localStore, agentDir);
	if (hasRuntimeAuthProfileStoreSnapshot(agentDir)) {
		const existingRuntimeStore = getRuntimeAuthProfileStoreSnapshot(agentDir);
		const nextRuntimeStore = markRuntimePersistedProfiles(buildRuntimeAuthProfileStoreForSave({
			store,
			agentDir,
			options
		}), localStore);
		setRuntimeAuthProfileStoreSnapshot(existingRuntimeStore ? mergeRuntimeExternalProfileReferences({
			next: nextRuntimeStore,
			existing: existingRuntimeStore
		}) : nextRuntimeStore, agentDir);
	}
}
//#endregion
export { findPersistedAuthProfileCredential as a, loadAuthProfileStoreForRuntime as c, replaceRuntimeAuthProfileStoreSnapshots as d, resolvePersistedAuthProfileOwnerAgentDir as f, resolveExternalCliAuthProfiles as g, readExternalCliBootstrapCredential as h, ensureAuthProfileStoreWithoutExternalProfiles as i, loadAuthProfileStoreForSecretsRuntime as l, updateAuthProfileStoreWithLock as m, ensureAuthProfileStore as n, getRuntimeAuthProfileStoreSnapshot as o, saveAuthProfileStore as p, ensureAuthProfileStoreForLocalUpdate as r, loadAuthProfileStore as s, clearRuntimeAuthProfileStoreSnapshots as t, loadAuthProfileStoreWithoutExternalProfiles as u };
