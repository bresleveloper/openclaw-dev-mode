import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { s as trackAsyncWork, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { r as getBoundLegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DBY7FuQ8.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as findNormalizedProviderValue } from "./provider-id-D1VImdKk.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { a as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { _ as AuthProfileStoreUnreadableError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as createSqliteWorkerOperationAdmission, o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { _ as observeCanonicalAuthProfileCredentials, h as copyCanonicalAuthProfileCredentialObservations, l as cloneAuthProfileStore, s as overlayRuntimeExternalOAuthProfiles, t as areOAuthCredentialsEquivalent } from "./oauth-shared-CiaJlx_D.mjs";
import { i as projectModelProviderConfig } from "./model-provider-config-wdC9jpCz.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { a as noteAuthProfileFileWrite } from "./file-state-CTXmtyL_.mjs";
import { H as authProfilesLog, U as reportCommittedInlineAuthFailure, W as isUserModelAuthProfileId, a as capturePersonalCredentialAuthority, d as withAuthProfileCredentialWriteCustody, f as assertPersonalAuthProfileRuntime, l as withPersonalCredentialPublication, m as getWorkerAuthProfileWrites, p as authProfileRuntimeMode, r as captureAuthProfileCredentialAuthority, t as authProfileCredentialPublication } from "./user-model-account-authority-DFFjC5J5.mjs";
import { d as takeAuthProfileAuthorizationWriteIntents } from "./authorization-lifetime-CLdd1God.mjs";
import "./profile-ids-B9fFWPvP.mjs";
import { a as mergeAuthProfileStores, c as loadPersistedAuthProfileState, f as removeRuntimeExternalProfileReferences, i as loadPersistedSharedAuthProfileStore, n as loadPersistedAuthProfileStore, o as mergePersistedAuthProfileState, r as loadPersistedAuthProfileStoreAtDatabasePath, s as buildPersistedAuthProfileState, t as buildPersistedAuthProfileSecretsStore, u as mergeRuntimeExternalProfileReferences } from "./persisted-DbIYEoQ3.mjs";
import { n as createSqliteWorkerWriteAdmission, p as withSqliteWorkerCleanupFailure } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { _ as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-CeDA0ojh.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { B as resolveNativeSharedAuthStorePath, I as listLegacyAuthProfileSources, L as resolveLegacyAuthProfileSourceCandidates, M as isSharedAuthProfileWrite, S as writePersistedAuthProfileStoreRaw, T as watchAuthProfileNativeCommits, V as fenceAuthProfileAuthorizationWrite, _ as resolveAuthProfileDatabaseOwnerId, a as inspectPersistedAuthProfileStoreRaw, b as runAuthProfileWriteTransaction, c as prepareAuthProfileWriteEnvironment, f as readPersistedAuthProfileStateRaw, n as deletePersistedAuthProfileStoreRaw, p as readPersistedAuthProfileStoreRaw, s as inspectPersistedSharedAuthProfileStoreRaw, u as prepareAuthProfileWriteTransactionAsync, v as resolveAuthProfileDatabasePath, x as writePersistedAuthProfileStateRaw, y as resolveAuthProfileStoreOwner, z as prepareSharedAuthStoreOwnershipForNative } from "./sqlite-BlFpr2YD.mjs";
import { d as resolveSharedAuthStorePath, f as resolveSharedMainAuthAgentDir, l as resolveSharedAuthStoreOwnership, n as getPreparedSharedAuthStoreOwnership, u as resolveSharedAuthStoreOwnershipAsync } from "./path-resolve-21Orzn6B.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { a as assertAuthProfileMigrationStateAtDatabasePath, d as warnLegacyAuthProfileSourcesIgnored, i as assertAuthProfileMigrationReady, n as assertAuthProfileCredentialMigrationStateAtDatabasePath, r as assertAuthProfileMigrationCandidates, t as AuthProfileMigrationRequiredError } from "./legacy-source-diagnostic-CLlkIevG.mjs";
import { r as getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath } from "./runtime-persisted-rows-B3SUt7CF.mjs";
import { $ as shouldUseMainOwnerForLocalOAuthCredential, A as setRuntimeAuthProfileStoreSnapshot, B as loadRuntimeAuthProfileOwnerSnapshot, G as pruneAuthProfileStoreReferences, H as mergeLocalAuthProfileStoreWithInheritedStore, J as runtimeStoreInheritsMainState, L as captureRuntimeAuthProfileLegacyCandidates, M as updateRuntimeAuthProfileStoreSnapshot, R as createEmptyAuthProfileStore, S as recordRuntimeAuthProfilePersistedStore, V as markRuntimePersistedProfiles, W as preserveResolvedSecretBackedCredentials, X as stripRuntimeExternalProfileMetadata, Y as setRuntimeLocalProfileMetadata, Z as updateRuntimeAuthProfileStoreInheritedCredentials, _ as invalidateRuntimeAuthProfileStoreSnapshotsForOwner, a as getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath, b as noteRuntimeAuthProfileStorePersistedMutation, d as getRuntimeAuthProfileStoreSnapshotCore, j as setRuntimeAuthProfileStoreSnapshotAtDatabasePath, k as restoreOwnedRuntimeAuthProfileStoreSnapshot, o as getPreparedRuntimeAuthProfileStoreSnapshotCore, p as getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath, q as runtimeAuthProfileSnapshotSharesOwner, t as clearRuntimeAuthProfileStoreSnapshotAtDatabasePath, u as getRuntimeAuthProfileStoreSnapshotAtDatabasePath, v as listOwnedRuntimeAuthProfileStoreSnapshots, x as publishRuntimeAuthProfileSharedCredentialMutation, y as listRuntimeAuthProfileStoreSnapshotsForSharedOwner, z as listRuntimeLocalProfileIds } from "./runtime-snapshots-HRosak4u.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { t as executeOpenClawAgentWorkerPublication } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import { a as resolveExternalCliAuthProfiles } from "./external-cli-sync-Bmw7gpgm.mjs";
import { f as readUserModelAuthProfile, l as normalizeUserModelAuthProfile, p as registerUserModelAuthProfileSecrets } from "./user-model-accounts-CrjNQiMH.mjs";
import { a as normalizeAuthProfileSecretRefs, r as prepareAuthProfileStoreMutation, t as buildLocalAuthProfileStoreForSave } from "./store-save-BIpfhaDX.mjs";
import { n as sendAuthProfileUpdateValue, t as receiveAuthProfileUpdateValue } from "./store-update-transfer-2J4RGKmB.mjs";
import { a as readUserModelAuthProfileAsync, i as readSharedAuthProfileRows, n as prepareAgentAuthProfileRowsRead, t as loadPersistedAuthProfileStoreFromRows } from "./sqlite-read-BnaiPHv1.mjs";
import "./source-check--zMBJ43Q.mjs";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { MessagePort } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
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
	return auth === void 0 || auth === "api-key" && params.type === "api_key" || auth === "oauth" && (params.type === "oauth" || params.type === "token") || auth === "token" && params.type === "token";
}
//#endregion
//#region src/agents/auth-profiles/external-auth.ts
let resolveExternalAuthProfilesForRuntime;
/** Test-only resolver injection for provider external auth profiles. */
const testing = {
	resetResolveExternalAuthProfilesForTest() {
		resolveExternalAuthProfilesForRuntime = void 0;
	},
	setResolveExternalAuthProfilesForTest(resolver) {
		resolveExternalAuthProfilesForRuntime = resolver;
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.externalAuthTestApi")] = testing;
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
	return resolveExternalCliAuthProfiles(params.store, {
		allowKeychainPrompt: params.externalCli?.allowKeychainPrompt,
		...params.env ? { env: params.env } : {},
		providerIds: params.externalCli?.externalCliProviderIds,
		profileIds: explicitProfileIds
	}).filter((profile) => isExternalAuthProfileAllowed(profile, params.store, params.externalCli?.config, explicitProfileIds, env));
}
function hasScopedExternalCliOverlay$1(params) {
	return Boolean(params?.externalCliProviderIds || params?.externalCliProfileIds);
}
/** Persist safe external CLI OAuth profiles that own their local profile slot. */
function syncPersistedExternalCliAuthProfiles(store, params) {
	if (!hasScopedExternalCliOverlay$1(params) && store.profiles["minimax-portal:minimax-cli"]?.type !== "oauth") return store;
	const persistedProfiles = resolveAllowedExternalCliAuthProfiles({
		store,
		externalCli: params
	});
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
		const explicitProfileIds = resolveExplicitProfileIds(params.externalCli?.externalCliProfileIds);
		for (const rawProfile of profiles) {
			if (!rawProfile?.profileId || !rawProfile.credential) continue;
			const profile = {
				...rawProfile,
				persistence: rawProfile.persistence ?? "runtime-only"
			};
			if (!isExternalAuthProfileAllowed(profile, params.store, params.externalCli?.config, explicitProfileIds, env)) continue;
			resolved.set(profile.profileId, profile);
		}
		return resolved;
	}
	/** List runtime-only and persisted external auth profiles for this store. */
	function listRuntimeExternalAuthProfiles(params) {
		return Array.from(resolveExternalAuthProfiles(params).values());
	}
	/** Overlay external auth profiles onto a cloned auth store for runtime use. */
	function overlayExternalAuthProfiles(store, params) {
		const scoped = hasScopedExternalCliOverlay$1(params);
		const refreshedProfileIds = new Set(store.runtimeExternalProfileIds ?? []);
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
		return overlayRuntimeExternalOAuthProfiles(base, resolved.values(), { runtimeExternalProfileIdsAuthoritative: !scoped });
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
function readResult(result) {
	if (!result.ok) throw result.error;
	return result.value;
}
/** One lazy snapshot policy; adapters supply only the demanded persisted reads. */
function* readRuntimeAuthProfileStoreFromSnapshots(params) {
	const mainKey = params.inheritedAuthDir ? resolveAuthProfileDatabasePath(params.inheritedAuthDir) : params.sharedPath ?? resolveSharedAuthStorePath(params.env);
	const requestedKey = params.agentDir ? resolveAuthProfileDatabasePath(params.agentDir) : params.sharedPath ?? resolveSharedAuthStorePath(params.env);
	const mainStore = getRuntimeAuthProfileStoreSnapshotAtDatabasePath(mainKey);
	if (!params.agentDir || requestedKey === mainKey) return mainStore ?? null;
	const requestedStore = getRuntimeAuthProfileStoreSnapshotAtDatabasePath(requestedKey);
	if (mainStore && requestedStore) return mergeAuthProfileStores(mainStore, requestedStore, { preserveBaseRuntimeExternalProfiles: true });
	if (requestedStore) {
		const result = yield { agentDir: params.inheritedAuthDir };
		const persistedMainStore = loadInheritedAuthProfileStore(() => readResult(result), params.inheritedAuthDir, params.env);
		return persistedMainStore ? mergeAuthProfileStores(persistedMainStore, requestedStore, { preserveBaseRuntimeExternalProfiles: true }) : requestedStore;
	}
	if (!mainStore) return null;
	const result = yield { agentDir: params.agentDir };
	return mergeAuthProfileStores(mainStore, readResult(result), { preserveBaseRuntimeExternalProfiles: true });
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
//#endregion
//#region src/agents/auth-profiles/runtime-read.worker.ts
/** Catalog requests already own native reads and writes; only the host opens broker actors. */
function readAuthProfileStoreInWorker(host, consume) {
	const { worker, env, effectiveAgentDir, options, scope } = host;
	worker.assertOwner(env);
	return worker.run(async () => {
		const profileId = options.profileId;
		const runInCapturedScope = (run) => scope.run(effectiveAgentDir, env, run);
		if (!consume) return runInCapturedScope(() => host.loadRuntimeAuthProfileStore(effectiveAgentDir, options, env));
		return consume({
			effectiveAgentDir,
			env,
			options,
			runInCapturedScope,
			sharedPath: async () => runInCapturedScope(() => resolveSharedAuthStorePath(env)),
			readStore: async (agentDir, readOptions) => runInCapturedScope(() => host.loadAuthProfileStoreForAgent(agentDir, readOptions, env)),
			assertCurrent: () => worker.assertOwner(env),
			materializePersonalProfile: async (store) => !scope.isolated && profileId && isUserModelAuthProfileId(profileId) ? runInCapturedScope(() => materializePersonalAuthProfile(store, profileId)) : store
		});
	});
}
//#endregion
//#region src/agents/auth-profiles/runtime-read.ts
/** Runtime auth reads compose worker-prepared facts through the store's captured host scope. */
function resolveExternalCliOverlayOptions(options) {
	const discovery = options?.externalCli;
	const config = discovery?.config ?? options?.config;
	if (discovery?.mode === "none") return {
		allowKeychainPrompt: false,
		...config ? { config } : {},
		externalCliProviderIds: [],
		externalCliProfileIds: []
	};
	const allowKeychainPrompt = discovery?.allowKeychainPrompt ?? options?.allowKeychainPrompt;
	const providerIds = !discovery ? options?.externalCliProviderIds : discovery.mode === "scoped" ? discovery.providerIds : void 0;
	const profileIds = !discovery ? options?.externalCliProfileIds : discovery.mode === "scoped" ? discovery.profileIds : void 0;
	return {
		...allowKeychainPrompt !== void 0 ? { allowKeychainPrompt } : {},
		...config ? { config } : {},
		...providerIds ? { externalCliProviderIds: providerIds } : {},
		...profileIds ? { externalCliProfileIds: profileIds } : {}
	};
}
function captureReadOptions(options) {
	const discovery = options?.externalCli;
	return {
		...options,
		readOnly: true,
		externalCli: discovery?.mode === "scoped" ? {
			...discovery,
			...discovery.providerIds ? { providerIds: [...discovery.providerIds] } : {},
			...discovery.profileIds ? { profileIds: [...discovery.profileIds] } : {}
		} : discovery,
		...options?.externalCliProviderIds ? { externalCliProviderIds: [...options.externalCliProviderIds] } : {},
		...options?.externalCliProfileIds ? { externalCliProfileIds: [...options.externalCliProfileIds] } : {}
	};
}
/** Bind to the canonical store scope; this reader owns no mutable runtime or lifecycle state. */
function createAuthProfileStoreRuntimeReader({ isEnvOnlyAuthProfileRuntime, getScopedAuthProfileEnv, resolveRuntimeAuthProfileAgentDir, resolveRuntimeAuthProfileLoadOptions, loadAuthProfileStoreForAgent, loadRuntimeAuthProfileStore, captureScope }) {
	async function withPreparedAuthProfileStoreReads(agentDir, options, consume, suppliedEnv) {
		const scope = captureScope();
		const env = cloneEnvWithPlatformSemantics(getScopedAuthProfileEnv() ?? suppliedEnv ?? process.env);
		env.OPENCLAW_STATE_DIR = resolveStateDir(env);
		const selectedDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		const effectiveAgentDir = selectedDir ? path.dirname(resolveAuthProfileDatabasePath(selectedDir)) : void 0;
		const selectedAgentPath = effectiveAgentDir ? resolveAuthProfileDatabasePath(effectiveAgentDir) : void 0;
		const scopedOptions = resolveRuntimeAuthProfileLoadOptions(options);
		const inheritedDir = scopedOptions?.inheritedAuthDir;
		const inheritedAuthDir = inheritedDir ? path.dirname(resolveAuthProfileDatabasePath(inheritedDir)) : void 0;
		const capturedOptions = captureReadOptions({
			...scopedOptions,
			inheritedAuthDir
		});
		const worker = getWorkerAuthProfileWrites();
		if (worker) return readAuthProfileStoreInWorker({
			worker,
			env,
			effectiveAgentDir,
			options: capturedOptions,
			scope,
			loadAuthProfileStoreForAgent,
			loadRuntimeAuthProfileStore
		}, consume);
		const profileId = capturedOptions.profileId;
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
		const credentialProfileId = profileId && !isUserModelAuthProfileId(profileId) ? profileId : void 0;
		const credentialAuthorities = new Map(credentialProfileId ? [...agentReads].map(([databasePath, reader]) => {
			let authority;
			try {
				authority = {
					ok: true,
					value: reader.captureCredentialAuthority(credentialProfileId)
				};
			} catch (error) {
				authority = {
					ok: false,
					error
				};
			}
			return [databasePath, authority];
		}) : []);
		if (credentialProfileId && sharedContext) credentialAuthorities.set(sharedContext.admission.databasePath, {
			ok: true,
			value: captureAuthProfileCredentialAuthority(sharedContext, {
				identity: `${sharedContext.admission.identity.key}:${sharedContext.admission.identity.birthtime ?? ""}`,
				databasePath: sharedContext.admission.databasePath
			}, credentialProfileId)
		});
		const inCapturedScope = (run) => scope.run(effectiveAgentDir, env, run);
		const rowsByPath = /* @__PURE__ */ new Map();
		const stores = /* @__PURE__ */ new Map();
		let active = true;
		let accepting = true;
		const assertAccepting = () => {
			if (!accepting) throw new Error("Auth profile read scope is no longer accepting reads");
		};
		let sharedContextUsed = false;
		const readOwners = [];
		const rowReaders = /* @__PURE__ */ new Map();
		const readOwner = async (ownerAgentDir, databasePath, reader, requestOptions) => {
			const demand = {
				databasePath,
				options: requestOptions
			};
			readOwners.push(demand);
			assertAuthProfileMigrationStateAtDatabasePath(databasePath, requestOptions.migrationProvider, requestOptions.config, requestOptions.deferScopedMigrationRefusals);
			const candidates = resolveLegacyAuthProfileSourceCandidates({
				agentDir: ownerAgentDir,
				env
			});
			const preparedReader = rowReaders.get(databasePath) ?? reader;
			rowReaders.set(databasePath, preparedReader);
			const capturedAuthority = credentialAuthorities.get(databasePath);
			if (capturedAuthority && !capturedAuthority.ok) throw capturedAuthority.error;
			const credentialAuthority = capturedAuthority?.value;
			const rows = rowsByPath.get(databasePath) ?? await preparedReader.read();
			preparedReader.assertCurrent();
			rowsByPath.set(databasePath, rows);
			const store = inCapturedScope(() => loadAuthProfileStoreForAgent(ownerAgentDir, {
				...requestOptions,
				onReadOwner: requestOptions.onReadOwner ? (owner) => requestOptions.onReadOwner?.({
					...owner,
					readCurrentCredential: credentialAuthority?.readCurrentCredential
				}) : void 0
			}, env, rows));
			demand.owner = {
				databasePath,
				candidates,
				readStore: () => loadPersistedAuthProfileStoreFromRows(rows, databasePath)
			};
			if (credentialAuthority && credentialProfileId) credentialAuthority.observe(demand.owner.readStore()?.profiles[credentialProfileId]);
			stores.set(databasePath, {
				ok: true,
				value: store
			});
			return store;
		};
		const assertCurrent = () => {
			if (!active) throw new Error("Auth profile read scope is no longer active");
			if (sharedContextUsed) {
				sharedContext?.maintenanceScope?.assertAdmission();
				sharedContext?.admission.assertCurrent();
			}
			for (const reader of rowReaders.values()) reader.assertCurrent();
			for (const demand of readOwners) assertAuthProfileMigrationCandidates({
				databasePath: demand.databasePath,
				candidates: demand.owner?.candidates ?? [],
				hasCredentials: () => Object.keys(demand.owner?.readStore()?.profiles ?? {}).length > 0,
				provider: demand.options.migrationProvider,
				config: demand.options.config,
				deferScopedRefusals: demand.options.deferScopedMigrationRefusals
			});
		};
		const sharedPath = async () => {
			assertAccepting();
			if (sharedPreparationFailure) throw sharedPreparationFailure.error;
			if (!sharedContext || !needsSharedStore) throw new Error("Auth profile read requested an uncaptured shared owner");
			sharedContextUsed = true;
			sharedContext.maintenanceScope?.assertAdmission();
			sharedContext.admission.assertCurrent();
			await resolveSharedAuthStoreOwnershipAsync(sharedContext);
			assertAccepting();
			sharedContext.maintenanceScope?.assertAdmission();
			sharedContext.admission.assertCurrent();
			return resolveSharedAuthStorePath(env);
		};
		const readStore = async (ownerAgentDir, requestOptions) => {
			assertAccepting();
			assertCurrent();
			const resolvedDir = inCapturedScope(() => resolveRuntimeAuthProfileAgentDir(ownerAgentDir));
			const directory = resolvedDir ? path.dirname(resolveAuthProfileDatabasePath(resolvedDir)) : void 0;
			const requestedOptions = captureReadOptions(inCapturedScope(() => resolveRuntimeAuthProfileLoadOptions(requestOptions)));
			let databasePath;
			let reader;
			if (directory) {
				databasePath = resolveAuthProfileDatabasePath(directory);
				reader = agentReads.get(databasePath);
			} else {
				databasePath = await sharedPath();
				const context = sharedContext;
				reader = databasePath === context.admission.databasePath ? {
					read: () => readSharedAuthProfileRows(context),
					assertCurrent: () => context.admission.assertCurrent()
				} : agentReads.get(databasePath);
			}
			if (!reader) throw new Error("Auth profile read requested an uncaptured database owner");
			assertAccepting();
			const store = await readOwner(directory, databasePath, reader, requestedOptions);
			assertAccepting();
			assertCurrent();
			return store;
		};
		const materializePersonalProfile = async (store) => {
			if (!personalProfileId) return store;
			if (sharedPreparationFailure) throw sharedPreparationFailure.error;
			const personalProfile = await readUserModelAuthProfileAsync(personalProfileId, sharedContext);
			assertCurrent();
			return materializePreparedPersonalAuthProfile(store, personalProfileId, personalProfile);
		};
		const loadPrepared = async () => {
			if (selectedAgentPath) await readOwner(effectiveAgentDir, selectedAgentPath, agentReads.get(selectedAgentPath), capturedOptions);
			if (needsSharedStore && sharedPreparationFailure) throw sharedPreparationFailure.error;
			const sharedOwnership = needsSharedStore ? await resolveSharedAuthStoreOwnershipAsync(sharedContext) : void 0;
			sharedContextUsed = needsSharedStore || personalProfileId !== void 0;
			const selectedSharedPath = sharedOwnership ? resolveSharedAuthStorePath(env) : void 0;
			const requestedPath = selectedAgentPath ?? selectedSharedPath;
			const inheritedPath = inheritedAuthDir ? resolveAuthProfileDatabasePath(inheritedAuthDir) : selectedSharedPath;
			const paths = [.../* @__PURE__ */ new Set([requestedPath, ...effectiveAgentDir ? [inheritedPath] : []])];
			for (const databasePath of paths) {
				if (stores.has(databasePath)) continue;
				try {
					await readOwner(databasePath === requestedPath ? effectiveAgentDir : inheritedAuthDir, databasePath, databasePath === selectedSharedPath && sharedOwnership?.location === "state-db" ? {
						read: () => readSharedAuthProfileRows(sharedContext),
						assertCurrent: () => sharedContext.admission.assertCurrent()
					} : agentReads.get(databasePath), capturedOptions);
				} catch (error) {
					if (databasePath === requestedPath) throw error;
					stores.set(databasePath, {
						ok: false,
						error
					});
				}
			}
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
			return materializePersonalProfile(store);
		};
		let result;
		try {
			result = {
				ok: true,
				value: await (consume ? consume({
					effectiveAgentDir,
					env,
					options: capturedOptions,
					sharedPath,
					runInCapturedScope: (operation) => {
						if (!accepting) throw new Error("Auth profile read scope is no longer active");
						return inCapturedScope(operation);
					},
					readStore,
					assertCurrent,
					materializePersonalProfile
				}) : loadPrepared())
			};
		} catch (error) {
			result = {
				ok: false,
				error
			};
		} finally {
			accepting = false;
		}
		const failures = (await Promise.allSettled([...agentReads.values()].map((reader) => reader.dispose()))).flatMap((entry) => entry.status === "rejected" ? [entry.reason] : []);
		try {
			if (failures.length > 0) {
				const error = failures.length === 1 ? failures[0] : new AggregateError(failures, "Auth profile reader cleanup failed", { cause: failures[0] });
				throw result.ok ? error : withSqliteWorkerCleanupFailure(toErrorObject(result.error, "Auth profile runtime read failed"), error);
			}
			if (!result.ok) throw result.error;
			assertCurrent();
			return result.value;
		} finally {
			active = false;
		}
	}
	/** Read persisted facts off-thread; scoped overlays and live setup selection stay on the host. */
	async function loadAuthProfileStoreForRuntimeAsync(agentDir, options, env) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		return withPreparedAuthProfileStoreReads(agentDir, options, void 0, env);
	}
	/** @deprecated Use loadAuthProfileStoreForRuntimeAsync. Supported through 2026-12-31. */
	function loadAuthProfileStoreForRuntime(agentDir, options, env) {
		warnPluginSdkDeprecation({
			family: "auth-profiles",
			method: "loadAuthProfileStoreForRuntime",
			replacement: "loadAuthProfileStoreForRuntimeAsync"
		});
		return loadRuntimeAuthProfileStore(agentDir, options, env);
	}
	return {
		loadAuthProfileStoreForRuntime,
		loadAuthProfileStoreForRuntimeAsync,
		withPreparedAuthProfileStoreReads
	};
}
//#endregion
//#region src/agents/auth-profiles/runtime-snapshot-publication.ts
/** Publish canonical facts while retaining the current host's same-owner overlays. */
function publishPreparedRuntimeAuthProfileStoreSnapshot(agentDir, existing, owner, refreshed, options = {}) {
	const { predecessor, candidates } = options;
	let rebuilt = refreshed;
	if (runtimeAuthProfileSnapshotSharesOwner(existing.owner, owner)) {
		const currentMaterialized = preserveResolvedSecretBackedCredentials({
			next: refreshed,
			existing: existing.store
		});
		const materialized = predecessor ? preserveResolvedSecretBackedCredentials({
			next: currentMaterialized,
			existing: predecessor
		}) : currentMaterialized;
		rebuilt = mergeRuntimeExternalProfileReferences({
			next: materialized,
			existing: existing.store
		});
	}
	setRuntimeAuthProfileStoreSnapshotAtDatabasePath(rebuilt, owner.databasePath, agentDir, owner, candidates);
}
function publishRuntimeSnapshotsAfterCommit(publication) {
	try {
		return publication.publish();
	} catch (err) {
		clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(publication.databasePath, publication.agentDir);
		authProfilesLog.warn("auth profile store committed but runtime snapshot publication failed", { err });
		return false;
	}
}
function deferRuntimeSnapshotsAfterCommit(database, publication, publishWithoutTransaction = false) {
	const publish = () => publishRuntimeSnapshotsAfterCommit(publication);
	if (!deferSqlitePostCommitPublication(database.db, publish) && publishWithoutTransaction) publish();
}
//#endregion
//#region src/agents/auth-profiles/portability.ts
function resolveAuthProfilePortability(credential) {
	if (credential.setup?.replacement) return {
		portable: false,
		reason: "setup-inactive"
	};
	const override = credential.copyToAgents;
	if (override === false) return {
		portable: false,
		reason: "credential-opted-out"
	};
	if (credential.type === "oauth") return [credential.access, credential.refresh].some((value) => typeof value === "string" && value.trim().length > 0) && override === true ? {
		portable: true,
		reason: "oauth-provider-opted-in"
	} : {
		portable: false,
		reason: "non-portable-oauth-refresh-token"
	};
	return {
		portable: true,
		reason: "portable-static-credential"
	};
}
/** Builds an agent-copy store containing only portable credentials and their order. */
function buildPortableAuthProfileStoreForAgentCopy(store) {
	const copiedProfileIds = [];
	const skippedProfileIds = [];
	const profiles = Object.fromEntries(Object.entries(store.profiles).filter(([profileId, credential]) => {
		const { portable } = resolveAuthProfilePortability(credential);
		(portable ? copiedProfileIds : skippedProfileIds).push(profileId);
		return portable;
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
/** Retain live shared authority without extending the scope's static-credential policy. */
async function prepareScopedSharedAuthProfileCredentialRead(env, profileId) {
	const context = captureOpenClawStateWorkerContext({ env });
	const authority = captureAuthProfileCredentialAuthority(context, {
		identity: `${context.admission.identity.key}:${context.admission.identity.birthtime ?? ""}`,
		databasePath: context.admission.databasePath
	}, profileId);
	const store = loadPersistedAuthProfileStoreFromRows(await readSharedAuthProfileRows(context), context.admission.databasePath);
	authority.observe(store?.profiles[profileId]);
	return () => {
		const credential = authority.readCurrentCredential();
		return credential && resolveAuthProfilePortability(credential).reason === "portable-static-credential" ? credential : void 0;
	};
}
//#endregion
//#region src/agents/auth-profiles/store-read.ts
/** Shared auth-store read policy with synchronous and captured-worker adapters. */
function hasScopedExternalCliOverlay(options) {
	return options.externalCliProviderIds !== void 0 || options.externalCliProfileIds !== void 0;
}
function* readAuthProfileStore(request) {
	const result = yield {
		kind: "store",
		...request
	};
	if (!result.ok) throw result.error;
	if (result.value.kind !== "store") throw new Error("Auth profile read returned a different requested fact");
	return result.value.store;
}
function* readSharedAuthPath() {
	const result = yield { kind: "shared-path" };
	if (!result.ok) throw result.error;
	if (result.value.kind !== "shared-path") throw new Error("Auth profile owner read returned a different requested fact");
	return result.value.path;
}
function createAuthProfileStoreReadRuntime(host) {
	const { isEnvOnlyAuthProfileRuntime, getScopedAuthProfileEnv, getScopedSharedAuthStore, resolveRuntimeAuthProfileAgentDir, resolveRuntimeAuthProfileLoadOptions, resolvePersistedLoadOptions, loadAuthProfileStoreForAgent, captureScope, withPreparedAuthProfileStoreReads, overlayExternalAuthProfiles, setRuntimeAuthProfileStoreSnapshot, updateRuntimeAuthProfileStoreSnapshot } = host;
	function readAuthProfileStoreSynchronously(createReads, options) {
		const profileId = options?.profileId && isUserModelAuthProfileId(options.profileId) ? options.profileId : void 0;
		const reads = createReads(profileId ? {
			...options,
			profileId: void 0
		} : options);
		let step = reads.next();
		while (!step.done) {
			let result;
			try {
				result = {
					ok: true,
					value: step.value.kind === "shared-path" ? {
						kind: "shared-path",
						path: resolveNativeSharedAuthStorePath(getScopedAuthProfileEnv())
					} : {
						kind: "store",
						store: loadAuthProfileStoreForAgent(step.value.agentDir, step.value.options)
					}
				};
			} catch (error) {
				result = {
					ok: false,
					error
				};
			}
			step = reads.next(result);
		}
		return profileId && !captureScope().isolated ? materializePersonalAuthProfile(step.value, profileId) : step.value;
	}
	async function readAuthProfileStoreAsynchronously(prepared, createReads, assertCurrent) {
		const reads = createReads(prepared.effectiveAgentDir, prepared.options, prepared.env);
		const advance = (result) => {
			assertCurrent?.();
			return prepared.runInCapturedScope(() => result === void 0 ? reads.next() : reads.next(result));
		};
		let step = advance();
		while (!step.done) {
			let result;
			try {
				result = {
					ok: true,
					value: step.value.kind === "shared-path" ? {
						kind: "shared-path",
						path: await prepared.sharedPath()
					} : {
						kind: "store",
						store: await prepared.readStore(step.value.agentDir, step.value.options ?? {})
					}
				};
			} catch (error) {
				result = {
					ok: false,
					error
				};
			}
			step = advance(result);
		}
		return step.value;
	}
	function* readInheritedAuthProfileStore(options, env) {
		try {
			return yield* readAuthProfileStore({
				agentDir: options.inheritedAuthDir,
				options
			});
		} catch (error) {
			return loadInheritedAuthProfileStore(() => {
				throw error;
			}, options.inheritedAuthDir, env ?? getScopedAuthProfileEnv());
		}
	}
	function* resolveRuntimeAuthProfileStore(agentDir, options, env) {
		if (getScopedSharedAuthStore()) return null;
		const sharedPath = !agentDir || !options?.inheritedAuthDir ? yield* readSharedAuthPath() : void 0;
		const reads = readRuntimeAuthProfileStoreFromSnapshots({
			agentDir,
			inheritedAuthDir: options?.inheritedAuthDir,
			env: env ?? getScopedAuthProfileEnv(),
			sharedPath
		});
		let step = reads.next();
		while (!step.done) {
			let result;
			try {
				result = {
					ok: true,
					value: yield* readAuthProfileStore({
						agentDir: step.value.agentDir,
						options: {
							migrationProvider: options?.migrationProvider,
							config: options?.config,
							readOnly: true,
							syncExternalCli: false,
							...resolvePersistedLoadOptions(options)
						}
					})
				};
			} catch (error) {
				result = {
					ok: false,
					error
				};
			}
			step = reads.next(result);
		}
		return step.value;
	}
	function* buildAuthProfileStoreWithoutExternalProfiles(params) {
		const runtimeExternalProfileIds = new Set(params.store.runtimeExternalProfileIds ?? []);
		const localStore = cloneAuthProfileStore(params.store);
		if (runtimeExternalProfileIds.size === 0) return stripRuntimeExternalProfileMetadata(localStore);
		for (const profileId of runtimeExternalProfileIds) delete localStore.profiles[profileId];
		const keptProfileIds = new Set(Object.keys(localStore.profiles));
		pruneAuthProfileStoreReferences(localStore, keptProfileIds);
		const persistedStore = yield* loadAuthProfileStoreWithoutExternalProfilesReads(params.agentDir, params.options, params.env);
		return stripRuntimeExternalProfileMetadata(mergeAuthProfileStores(persistedStore, localStore));
	}
	/** @deprecated Use loadAuthProfileStoreWithoutExternalProfilesAsync. Supported through 2026-12-31. */
	function loadAuthProfileStoreWithoutExternalProfiles(agentDir, loadOptions) {
		warnPluginSdkDeprecation({
			family: "auth-profiles",
			method: "loadAuthProfileStoreWithoutExternalProfiles",
			replacement: "loadAuthProfileStoreWithoutExternalProfilesAsync"
		});
		return readAuthProfileStoreSynchronously((options) => loadAuthProfileStoreWithoutExternalProfilesReads(agentDir, options), loadOptions);
	}
	/** Read persisted auth profiles off-thread without runtime external profiles. */
	async function loadAuthProfileStoreWithoutExternalProfilesAsync(agentDir, options) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		return withPreparedAuthProfileStoreReads(agentDir, options, async (prepared) => {
			const store = await readAuthProfileStoreAsynchronously(prepared, (directory, preparedOptions, env) => loadAuthProfileStoreWithoutExternalProfilesReads(directory, {
				...preparedOptions,
				profileId: void 0
			}, env));
			return prepared.materializePersonalProfile(store);
		});
	}
	function* loadAuthProfileStoreWithoutExternalProfilesReads(agentDir, loadOptions, env) {
		const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		const effectiveLoadOptions = resolveRuntimeAuthProfileLoadOptions(loadOptions);
		return yield* readAuthProfileStoreFromSources(effectiveAgentDir, {
			readOnly: true,
			allowKeychainPrompt: effectiveLoadOptions?.allowKeychainPrompt ?? false,
			...effectiveLoadOptions?.inheritedAuthDir ? { inheritedAuthDir: effectiveLoadOptions.inheritedAuthDir } : {}
		}, env, true);
	}
	/** @deprecated Use ensureAuthProfileStoreAsync. Supported through 2026-12-31. */
	function ensureAuthProfileStore(agentDir, options) {
		warnPluginSdkDeprecation({
			family: "auth-profiles",
			method: "ensureAuthProfileStore",
			replacement: "ensureAuthProfileStoreAsync"
		});
		return readAuthProfileStoreSynchronously((readOptions) => ensureAuthProfileStoreReads(agentDir, readOptions), options);
	}
	/** Read canonical auth facts off-thread, including runtime and external profile overlays. */
	async function ensureAuthProfileStoreAsync(agentDir, options) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		return withPreparedAuthProfileStoreReads(agentDir, options, async (prepared) => {
			const store = await readAuthProfileStoreAsynchronously(prepared, (directory, preparedOptions, env) => ensureAuthProfileStoreReads(directory, {
				...preparedOptions,
				profileId: void 0
			}, env));
			return prepared.materializePersonalProfile(store);
		});
	}
	function* ensureAuthProfileStoreReads(agentDir, options, env) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		const effectiveOptions = resolveRuntimeAuthProfileLoadOptions(options);
		const externalCli = resolveExternalCliOverlayOptions(effectiveOptions);
		const runtimeStore = yield* resolveRuntimeAuthProfileStore(effectiveAgentDir, effectiveOptions, env);
		const store = overlayExternalAuthProfiles(yield* ensureAuthProfileStoreWithoutExternalProfilesReads(effectiveAgentDir, effectiveOptions, env), {
			agentDir: effectiveAgentDir,
			...env ? { env } : {},
			...externalCli
		});
		if (!runtimeStore) {
			if (!getScopedSharedAuthStore() && hasScopedExternalCliOverlay(externalCli) && (store.runtimeExternalProfileIds?.length ?? 0) > 0) setRuntimeAuthProfileStoreSnapshot(store, effectiveAgentDir);
			return store;
		}
		const materialized = mergeRuntimeExternalProfileReferences({
			next: store,
			existing: runtimeStore,
			externalRefresh: true
		});
		if (hasScopedExternalCliOverlay(externalCli)) {
			if (!isDeepStrictEqual(materialized, runtimeStore)) updateRuntimeAuthProfileStoreSnapshot(materialized, effectiveAgentDir);
			return store;
		}
		return materialized;
	}
	/** @deprecated Use ensureAuthProfileStoreWithoutExternalProfilesAsync. Supported through 2026-12-31. */
	function ensureAuthProfileStoreWithoutExternalProfiles(agentDir, options) {
		warnPluginSdkDeprecation({
			family: "auth-profiles",
			method: "ensureAuthProfileStoreWithoutExternalProfiles",
			replacement: "ensureAuthProfileStoreWithoutExternalProfilesAsync"
		});
		return readAuthProfileStoreSynchronously((readOptions) => ensureAuthProfileStoreWithoutExternalProfilesReads(agentDir, readOptions), options);
	}
	/** Read canonical auth facts off-thread without external profile overlays. */
	async function ensureAuthProfileStoreWithoutExternalProfilesAsync(agentDir, options) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		return withPreparedAuthProfileStoreReads(agentDir, options, async (prepared) => {
			const store = await readAuthProfileStoreAsynchronously(prepared, (directory, preparedOptions, env) => ensureAuthProfileStoreWithoutExternalProfilesReads(directory, {
				...preparedOptions,
				profileId: void 0
			}, env));
			return prepared.materializePersonalProfile(store);
		});
	}
	function* ensureAuthProfileStoreWithoutExternalProfilesReads(agentDir, options, env) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		const effectiveOptions = resolveRuntimeAuthProfileLoadOptions(options) ?? { ...options };
		const runtimeStore = yield* resolveRuntimeAuthProfileStore(effectiveAgentDir, effectiveOptions, env);
		if (runtimeStore) return yield* buildAuthProfileStoreWithoutExternalProfiles({
			store: runtimeStore,
			agentDir: effectiveAgentDir,
			options: effectiveOptions,
			env
		});
		return yield* readAuthProfileStoreFromSources(effectiveAgentDir, effectiveOptions, env, false);
	}
	function* readAuthProfileStoreFromSources(agentDir, options, env, includeLocalMetadata) {
		const store = yield* readAuthProfileStore({
			agentDir,
			options
		});
		const authPath = agentDir ? resolveAuthProfileDatabasePath(agentDir) : yield* readSharedAuthPath();
		const mainAuthPath = options.inheritedAuthDir ? resolveAuthProfileDatabasePath(options.inheritedAuthDir) : yield* readSharedAuthPath();
		if (!agentDir || authPath === mainAuthPath) {
			const stripped = stripRuntimeExternalProfileMetadata(store);
			return includeLocalMetadata ? setRuntimeLocalProfileMetadata(stripped, listRuntimeLocalProfileIds(store)) : stripped;
		}
		const mainStore = yield* readInheritedAuthProfileStore(options, env);
		return includeLocalMetadata ? mergeLocalAuthProfileStoreWithInheritedStore(store, mainStore) : stripRuntimeExternalProfileMetadata(mainStore ? mergeAuthProfileStores(mainStore, store, { preserveBaseRuntimeExternalProfiles: true }) : store);
	}
	function* readAuthProfileStoreForModelRuntime(agentDir, options, env) {
		if (!options.inheritedAuthDir) yield* readSharedAuthPath();
		const published = getPreparedRuntimeAuthProfileStoreSnapshotCore(agentDir, options.inheritedAuthDir, env);
		const hasPublishedExternalProfiles = published !== void 0 && (published.runtimeExternalProfileIds !== void 0 || published.runtimeExternalProfileIdsAuthoritative === true);
		const readOptions = {
			allowKeychainPrompt: false,
			readOnly: true,
			...options.inheritedAuthDir ? { inheritedAuthDir: options.inheritedAuthDir } : {}
		};
		if (hasPublishedExternalProfiles) {
			const durable = yield* ensureAuthProfileStoreWithoutExternalProfilesReads(agentDir, readOptions, env);
			return mergeAuthProfileStores(durable, published);
		}
		if (options.skipCredentials) return;
		return yield* ensureAuthProfileStoreReads(agentDir, {
			...readOptions,
			config: options.config
		}, env);
	}
	async function prepareAuthProfileStoreForModelRuntime(agentDir, options, assertCurrent, env) {
		assertCurrent();
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		return withPreparedAuthProfileStoreReads(agentDir, {
			config: options.config,
			inheritedAuthDir: options.inheritedAuthDir,
			readOnly: true,
			allowKeychainPrompt: false
		}, (prepared) => readAuthProfileStoreAsynchronously(prepared, (directory, preparedOptions, preparedEnv) => readAuthProfileStoreForModelRuntime(directory ?? agentDir, {
			...options,
			inheritedAuthDir: preparedOptions.inheritedAuthDir
		}, preparedEnv), assertCurrent), env);
	}
	return {
		loadAuthProfileStoreWithoutExternalProfiles,
		loadAuthProfileStoreWithoutExternalProfilesAsync,
		ensureAuthProfileStore,
		ensureAuthProfileStoreAsync,
		ensureAuthProfileStoreWithoutExternalProfiles,
		ensureAuthProfileStoreWithoutExternalProfilesAsync,
		prepareAuthProfileStoreForModelRuntime
	};
}
//#endregion
//#region src/agents/auth-profiles/personal-store.ts
/** Retain the original actor through provider preparation, acceptance, and detached settlement. */
function withPersonalAuthProfileStore(profileId, consume, stateDir) {
	assertPersonalAuthProfileRuntime();
	const context = captureOpenClawStateWorkerContext(stateDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} } : {});
	let active = true;
	const assertCurrent = () => {
		if (!active) throw new Error("Personal model account preparation is closed");
		context.admission.assertCurrent();
		assertPersonalAuthProfileRuntime();
	};
	const result = createDeferredCore();
	trackAsyncWork(() => runOpenClawStateWorkerOperation(context, async (scope) => {
		const work = new AsyncWorkScope();
		const asStore = (profile) => {
			if (profile) registerUserModelAuthProfileSecrets(profile.credential);
			return {
				version: 1,
				profiles: profile ? { [profileId]: profile.credential } : {},
				...profile?.usageStats ? { usageStats: { [profileId]: profile.usageStats } } : {}
			};
		};
		const readProfile = async () => {
			const authority = await capturePersonalCredentialAuthority(context, profileId);
			const profile = await scope.execute({
				type: "authProfiles.personal",
				input: {
					profileId,
					artifactPreserving: false
				}
			});
			assertCurrent();
			authority.observe(profile?.credential);
			owner.readCurrentCredential = authority.readCurrentCredential;
			return profile;
		};
		const owner = {
			databasePath: context.admission.databasePath,
			readCurrentCredential() {
				throw new Error("Personal model account credential has not been prepared");
			},
			read: async () => asStore(await readProfile()),
			async update(updater, assertUpdateCurrent) {
				const expected = await readProfile();
				const store = asStore(expected ? structuredClone(expected) : void 0);
				if (!expected || !updater(store)) return store;
				const credential = store.profiles[profileId];
				if (!credential) throw new Error("Personal model accounts must be disconnected through their profile owner.");
				const next = normalizeUserModelAuthProfile({
					credential,
					usageStats: store.usageStats?.[profileId]
				});
				registerUserModelAuthProfileSecrets(next.credential);
				const digest = createHash("sha256").update(stableStringify(next)).digest("hex");
				let nativeAdmission;
				const admission = createSqliteWorkerWriteAdmission((request) => {
					assertCurrent();
					assertUpdateCurrent?.();
					if (request.stage === "commit" && request.facts !== digest) throw new Error("Personal credential publication does not match the prepared update");
				}, [context.admission.databasePath]);
				try {
					const updated = await runOpenClawStateWorkerOperation(context, (writer) => writer.execute({
						type: "authProfiles.personalReplace",
						input: {
							profileId,
							expected,
							next
						}
					}), {
						assertCurrent,
						createAdmission: withPersonalCredentialPublication((operation) => {
							const grant = admission(operation);
							nativeAdmission = grant.admission;
							return grant;
						}, context)
					});
					if (!updated) throw new Error("Personal model account changed during its prepared update");
					return asStore(updated);
				} catch (error) {
					if (isRecord(nativeAdmission?.committed?.facts) && nativeAdmission.committed.facts.digest === digest && hasSqliteWorkerOutcomeUnknown(error)) return asStore(next);
					throw error;
				}
			},
			async accept(credential, assertSelectionCurrent) {
				const prepared = normalizeUserModelAuthProfile({ credential }).credential;
				if (prepared.type !== "oauth") throw new Error("Personal credential codec changed the prepared credential type");
				assertCurrent();
				assertSelectionCurrent?.(prepared);
				if (!isDeepStrictEqual(owner.readCurrentCredential(), prepared)) throw new Error("Personal model account changed during provider preparation");
				observeCanonicalAuthProfileCredentials(context.admission.databasePath, { [profileId]: prepared });
				return prepared;
			}
		};
		try {
			result.resolve(await work.track(() => consume(owner)));
		} catch (error) {
			result.reject(error);
		} finally {
			try {
				await work.drain();
			} finally {
				active = false;
			}
		}
	}, {
		existingOnly: true,
		assertCurrent
	})).then(() => result.resolve(void 0), result.reject);
	return result.promise;
}
//#endregion
//#region src/agents/auth-profiles/inline-usage-publication.ts
/** Reconcile committed facts through the existing snapshot owner, without native host rereads. */
async function publishInlineAuthFailure(owner, receipt, readTarget, assertOwner, committed) {
	const agentDir = path.dirname(owner.databasePath);
	const shared = owner.databasePath === owner.sharedDatabasePath;
	const current = getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(owner.databasePath);
	const entries = [...current ? [current] : [], ...shared ? listRuntimeAuthProfileStoreSnapshotsForSharedOwner(owner) : []];
	const committedRevision = noteRuntimeAuthProfileStorePersistedMutation(agentDir, receipt.publication, owner, void 0, committed?.isCurrent() ? {
		store: committed.store,
		env: owner.env
	} : void 0);
	if (entries.length === 0) return;
	const readers = /* @__PURE__ */ new Set();
	const read = async (databasePath, kind) => {
		const revision = getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(databasePath);
		const nativeCurrent = databasePath === owner.databasePath ? committed?.nativeCommits.capture() : void 0;
		let assertCurrent;
		let rows;
		if (databasePath === owner.databasePath) {
			rows = committed?.isCurrent() && revision === committedRevision ? {
				store: {
					status: "readable",
					raw: buildPersistedAuthProfileSecretsStore(committed.store)
				},
				state: {
					status: "readable",
					raw: buildPersistedAuthProfileState(committed.store)
				},
				cacheable: false
			} : await readTarget();
			assertCurrent = assertOwner;
		} else if (kind === "shared-state") {
			const context = captureOpenClawStateWorkerContext({ env: owner.env });
			if (context.admission.databasePath !== databasePath) throw new Error("Auth snapshot changed its captured shared database");
			rows = await readSharedAuthProfileRows(context);
			assertCurrent = () => context.admission.assertCurrent();
		} else {
			const reader = prepareAgentAuthProfileRowsRead({
				databasePath,
				agentId: resolveAuthProfileDatabaseOwnerId(path.dirname(databasePath)),
				env: owner.env
			});
			readers.add(reader);
			rows = await reader.read();
			assertCurrent = reader.assertCurrent;
		}
		const assert = () => {
			assertOwner();
			assertCurrent();
			if (nativeCurrent?.() === false || getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(databasePath) !== revision) throw new Error("Auth snapshot changed during committed-state preparation");
		};
		assert();
		const store = markRuntimePersistedProfiles(loadPersistedAuthProfileStoreFromRows(rows, databasePath) ?? createEmptyAuthProfileStore());
		recordRuntimeAuthProfilePersistedStore(databasePath, store);
		observeCanonicalAuthProfileCredentials(databasePath, store.profiles);
		return {
			store,
			assertCurrent: assert
		};
	};
	for (const entry of entries) {
		const targetOwner = {
			...owner,
			databasePath: entry.databasePath
		};
		try {
			assertOwner();
			assertAuthProfileMigrationStateAtDatabasePath(targetOwner.databasePath);
			assertAuthProfileMigrationStateAtDatabasePath(targetOwner.sharedDatabasePath);
			const candidates = captureRuntimeAuthProfileLegacyCandidates(targetOwner.databasePath === targetOwner.sharedDatabasePath ? void 0 : entry.agentDir, owner.env);
			const inherited = targetOwner.databasePath === targetOwner.sharedDatabasePath ? void 0 : await read(targetOwner.sharedDatabasePath, owner.location === "state-db" ? "shared-state" : "agent");
			const local = await read(targetOwner.databasePath, "agent");
			inherited?.assertCurrent();
			local.assertCurrent();
			assertAuthProfileMigrationCandidates({
				databasePath: targetOwner.databasePath,
				candidates: targetOwner.databasePath === targetOwner.sharedDatabasePath ? candidates.shared : candidates.local,
				hasCredentials: () => Object.keys(local.store.profiles).length > 0
			});
			if (inherited) assertAuthProfileMigrationCandidates({
				databasePath: targetOwner.sharedDatabasePath,
				candidates: candidates.shared,
				hasCredentials: () => Object.keys(inherited.store.profiles).length > 0
			});
			const refreshed = inherited ? mergeLocalAuthProfileStoreWithInheritedStore(local.store, inherited.store) : setRuntimeLocalProfileMetadata(local.store, listRuntimeLocalProfileIds(local.store));
			const latest = getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(entry.databasePath);
			if (!latest || !runtimeAuthProfileSnapshotSharesOwner(latest.owner, targetOwner)) continue;
			publishPreparedRuntimeAuthProfileStoreSnapshot(entry.agentDir, latest, targetOwner, refreshed, { candidates });
		} catch (error) {
			try {
				const latest = getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(entry.databasePath);
				if (latest && runtimeAuthProfileSnapshotSharesOwner(latest.owner, targetOwner)) clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(entry.databasePath, entry.agentDir);
			} catch (invalidationError) {
				reportCommittedInlineAuthFailure("auth usage snapshot invalidation failed", invalidationError);
			}
			reportCommittedInlineAuthFailure("auth usage committed but runtime snapshot publication failed", error);
		} finally {
			const cleanup = await Promise.allSettled([...readers].map((reader) => reader.dispose()));
			readers.clear();
			const errors = cleanup.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (errors.length > 0) reportCommittedInlineAuthFailure("auth snapshot publication finished before reader cleanup failed", errors);
		}
	}
}
//#endregion
//#region src/agents/auth-profiles/store-update-publication.ts
/** Native receipt settlement owns credential publication, independently of result delivery. */
function createAuthProfileStoreUpdatePublication(params) {
	let settleAuthorization;
	let authorizationPostimage;
	return (createAdmission) => (operation) => {
		let publication;
		let authorizationCommitted = false;
		const retained = createAdmission(() => {
			const committed = params.collectCommitted();
			if (committed?.publication.credentialsChanged) {
				authorizationPostimage = {
					profiles: committed.store.profiles,
					authorizationLifetimes: committed.authorizationLifetimes
				};
				settleAuthorization = fenceAuthProfileAuthorizationWrite(params.databasePath);
			}
			const credentialOwner = committed?.credentialOwner;
			if (credentialOwner) publication = authProfileCredentialPublication.begin({
				...credentialOwner,
				assertCurrent: params.assertCurrent
			});
		})(operation);
		const { admission } = retained;
		observeSqliteWorkerCommittedFacts(admission, ({ facts }) => {
			const credentials = isRecord(facts) ? facts.authCredentials : void 0;
			publication?.committed(credentials);
			authorizationCommitted = publication !== void 0 && !(isRecord(credentials) && credentials.kind === "unknown");
		});
		const finishAuthorization = (known) => {
			const receipt = admission.committed;
			settleAuthorization?.(known && (!receipt || authorizationCommitted), authorizationCommitted && params.committedIsCurrent() ? authorizationPostimage : void 0);
		};
		const finish = admission.finish.bind(admission);
		admission.finish = () => {
			try {
				finish();
			} finally {
				if (admission.settlement) {
					const confirmed = admission.settlement.kind === "completed";
					publication?.finish(confirmed, confirmed && !admission.committed);
					finishAuthorization(confirmed);
				}
			}
		};
		operation.settled.then((outcome) => {
			const known = outcome.kind !== "unknown";
			publication?.finish(known, known && !admission.committed);
			finishAuthorization(known);
		});
		return retained;
	};
}
/** Publish affected owners from committed facts, rereading only an overtaken result. */
async function publishAuthProfileStoreUpdate(owner, committed, assertCurrent, nativeCommits, committedIsCurrent) {
	assertCurrent();
	const shared = owner.databasePath === owner.sharedDatabasePath;
	let currentStore = committed.store;
	let mutation = committed.publication;
	let isCommittedCurrent = committedIsCurrent;
	const prepareReader = (databasePath, agentDir = path.dirname(databasePath)) => prepareAgentAuthProfileRowsRead({
		databasePath,
		agentId: resolveAuthProfileDatabaseOwnerId(agentDir),
		env: owner.env
	});
	while (!isCommittedCurrent()) {
		const current = nativeCommits.capture();
		const revision = getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(owner.databasePath);
		let rows;
		if (shared && owner.location === "state-db") {
			const context = captureOpenClawStateWorkerContext({ env: owner.env });
			rows = await readSharedAuthProfileRows(context);
			context.admission.assertCurrent();
		} else {
			const reader = prepareReader(owner.databasePath);
			try {
				rows = await reader.read();
			} finally {
				await reader.dispose();
			}
		}
		assertCurrent();
		currentStore = loadPersistedAuthProfileStoreFromRows(rows, owner.databasePath) ?? createEmptyAuthProfileStore();
		mutation = committed.publication;
		isCommittedCurrent = getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(owner.databasePath) === revision ? current : () => false;
	}
	if (!shared) {
		const reader = prepareReader(owner.databasePath);
		try {
			return await publishInlineAuthFailure(owner, { publication: mutation }, reader.read, assertCurrent, {
				store: currentStore,
				isCurrent: isCommittedCurrent,
				nativeCommits
			});
		} finally {
			await reader.dispose();
		}
	}
	const installed = publishRuntimeAuthProfileSharedCredentialMutation(owner, currentStore, mutation);
	const current = installed ? void 0 : getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(owner.databasePath);
	const entries = installed?.entries ?? [...current ? [current] : [], ...listRuntimeAuthProfileStoreSnapshotsForSharedOwner(owner, mutation)];
	if (mutation.stateChanged && !mutation.availabilityOnly) {
		for (const entry of entries) if (entry.databasePath !== owner.databasePath) clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(entry.databasePath, entry.agentDir);
	}
	let recordedRevision = installed?.revision;
	if (!installed) {
		observeCanonicalAuthProfileCredentials(owner.databasePath, currentStore.profiles);
		recordedRevision = noteRuntimeAuthProfileStorePersistedMutation(void 0, mutation, owner, void 0, {
			store: currentStore,
			env: owner.env
		});
	}
	const sharedRevision = recordedRevision;
	const revisions = installed?.snapshots ?? new Map(entries.map((entry) => [entry.databasePath, getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(entry.databasePath)]));
	for (const entry of entries) {
		const targetOwner = {
			...owner,
			databasePath: entry.databasePath
		};
		let reader;
		const localRevision = installed?.mutations.get(entry.databasePath) ?? getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(entry.databasePath);
		const stillCurrent = () => isCommittedCurrent() && getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(owner.sharedDatabasePath) === sharedRevision && getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(entry.databasePath) === localRevision && getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(entry.databasePath) === revisions.get(entry.databasePath);
		try {
			assertCurrent();
			assertAuthProfileMigrationStateAtDatabasePath(targetOwner.databasePath);
			assertAuthProfileMigrationStateAtDatabasePath(targetOwner.sharedDatabasePath);
			let local = currentStore;
			if (entry.databasePath !== owner.databasePath) {
				reader = prepareReader(entry.databasePath, entry.agentDir);
				local = markRuntimePersistedProfiles(loadPersistedAuthProfileStoreFromRows(await reader.read(), entry.databasePath) ?? createEmptyAuthProfileStore());
				assertCurrent();
				reader.assertCurrent();
			}
			if (!stillCurrent()) continue;
			const inherited = entry.databasePath === owner.sharedDatabasePath ? void 0 : currentStore;
			const candidates = captureRuntimeAuthProfileLegacyCandidates(entry.databasePath === owner.sharedDatabasePath ? void 0 : entry.agentDir, owner.env);
			assertAuthProfileMigrationCandidates({
				databasePath: entry.databasePath,
				candidates: entry.databasePath === owner.sharedDatabasePath ? candidates.shared : candidates.local,
				hasCredentials: () => Object.keys(local.profiles).length > 0
			});
			const refreshed = inherited ? mergeLocalAuthProfileStoreWithInheritedStore(local, inherited) : setRuntimeLocalProfileMetadata(local, listRuntimeLocalProfileIds(local));
			const latest = getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(entry.databasePath) ?? entry;
			if (!runtimeAuthProfileSnapshotSharesOwner(latest.owner, targetOwner)) continue;
			publishPreparedRuntimeAuthProfileStoreSnapshot(entry.agentDir, latest, targetOwner, refreshed, { candidates });
		} finally {
			if (reader) try {
				await reader.dispose();
			} catch (error) {
				reportCommittedInlineAuthFailure("Auth snapshot reader cleanup failed after commit", error);
			}
		}
	}
}
//#endregion
//#region src/agents/auth-profiles/usage-lifecycle.ts
const acceptedUsage = new AsyncLocalStorage();
const state = resolveGlobalSingleton(Symbol.for("openclaw.authProfileUsageWork"), () => ({
	owners: /* @__PURE__ */ new WeakMap(),
	preparations: /* @__PURE__ */ new Map()
}));
function usageWork(host) {
	let owner = state.owners.get(host);
	if (!owner) {
		owner = {
			work: new AsyncWorkScope(),
			closing: false
		};
		state.owners.set(host, owner);
	}
	return owner;
}
/** Reserve overlapping physical stores before asynchronous reads can reorder ready writes. */
function reserveAuthProfileUsagePreparation(ownerKeys) {
	const keys = [...new Set(ownerKeys)];
	const ready = Promise.all(keys.flatMap((key) => {
		const pending = state.preparations.get(key);
		return pending ? [pending] : [];
	})).then(() => {});
	const completion = createDeferredCore();
	for (const key of keys) state.preparations.set(key, completion.promise);
	return {
		ready,
		release() {
			completion.resolve();
			for (const key of keys) if (state.preparations.get(key) === completion.promise) state.preparations.delete(key);
		}
	};
}
/** Own preparation and persistence together before the auth writer can yield. */
async function runAuthProfileUsage(operation) {
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	const run = () => maintenance ? maintenance.run(operation) : operation();
	const host = getBoundLegacyPluginSdkResourceHost();
	if (!host) return trackAsyncWork(run);
	const owner = usageWork(host);
	const inherited = acceptedUsage.getStore();
	const alreadyAccepted = inherited?.owner === owner && inherited.active;
	if (owner.closing && !alreadyAccepted) throw new Error("Auth profile usage owner is closed");
	if (!alreadyAccepted) host.scheduler.signal.throwIfAborted();
	const custody = {
		owner,
		active: true
	};
	return owner.work.track(() => acceptedUsage.run(custody, run)).finally(() => {
		custody.active = false;
	});
}
/** Fence synchronously, then join accepted work before its worker transports close. */
function closeAuthProfileUsage(host) {
	const owner = usageWork(host);
	owner.closing = true;
	return owner.settled ??= AsyncWorkScope.runWhenAllIdle(() => [owner.work], () => owner.work.drain());
}
//#endregion
//#region src/agents/auth-profiles/write-execution.ts
/** Pin an existing inode before preparation yields; the executor owns first creation. */
function captureAuthProfileWriteExecution(target) {
	const identity = readDatabasePathIdentitySync(target.path);
	return captureOpenClawAgentDatabaseExecution(target, identity.key.startsWith("file:") ? { expectedIdentity: {
		kind: "file",
		physicalIdentity: identity.key.slice(5),
		nativeLocation: identity.canonicalPath,
		birthtime: identity.birthtime
	} } : {});
}
//#endregion
//#region src/agents/auth-profiles/store-update.ts
var AuthProfileSharedSourceChangedError = class extends Error {};
function runAuthProfileStoreUpdate(params) {
	const env = prepareAuthProfileWriteEnvironment(params.options);
	return runAuthProfileUsage(async () => {
		const context = captureOpenClawStateWorkerContext({ env });
		const capturedAgentDir = isSharedAuthProfileWrite({
			agentDir: params.agentDir,
			allowExplicitMain: params.options.sharedStoreWrite === true,
			env
		}) ? getPreparedSharedAuthStoreOwnership(env)?.location === "state-db" ? void 0 : resolveSharedMainAuthAgentDir(env) : params.agentDir;
		const target = params.existingDatabaseTarget ?? (capturedAgentDir ? {
			kind: "agent",
			agentId: resolveAuthProfileDatabaseOwnerId(capturedAgentDir),
			path: resolveAuthProfileDatabasePath(capturedAgentDir),
			env
		} : void 0);
		const execution = target ? captureAuthProfileWriteExecution({
			...target,
			env
		}) : void 0;
		let transferred = false;
		let followsCapturedAgent = true;
		const assertCurrent = () => {
			context.admission.assertCurrent();
			context.maintenanceScope?.assertAdmission();
			if (followsCapturedAgent) execution?.assertCurrent();
			params.assertCurrent?.();
		};
		const reservation = reserveAuthProfileUsagePreparation([resolveOpenClawStateSqlitePath(env), ...params.agentDir ? [params.existingDatabaseTarget?.path ?? resolveAuthProfileDatabasePath(params.agentDir)] : []]);
		try {
			await reservation.ready;
			const prepared = await prepareAuthProfileWriteTransactionAsync(params.agentDir, {
				...params.options,
				env
			}, assertCurrent);
			assertCurrent();
			const databaseTarget = params.existingDatabaseTarget ?? prepared.databaseTarget;
			transferred = databaseTarget.kind === "agent" && databaseTarget.path === target?.path;
			followsCapturedAgent = transferred;
			return await runPreparedAuthProfileStoreUpdate({
				...params,
				assertCurrent,
				publish: (...args) => {
					reservation.release();
					return params.publish(...args);
				}
			}, {
				...prepared,
				databaseTarget
			}, transferred ? execution : void 0);
		} finally {
			if (!transferred) await execution?.release();
			reservation.release();
		}
	});
}
async function runPreparedAuthProfileStoreUpdate(params, { databaseTarget, sharedOwner }, capturedExecution) {
	const owner = {
		...sharedOwner,
		databasePath: databaseTarget.path
	};
	let acknowledged = false;
	let exchangePort;
	let nativeCommits;
	let sharedSource;
	let committedIsCurrent = () => false;
	let invalidationAttempted = false;
	let commitGranted = false;
	const invalidateUnknown = (error) => {
		if (!commitGranted || invalidationAttempted) return;
		try {
			if (hasSqliteWorkerOutcomeUnknown(error)) {
				invalidationAttempted = true;
				invalidateRuntimeAuthProfileStoreSnapshotsForOwner(owner);
			}
		} catch (invalidationError) {
			reportCommittedInlineAuthFailure("Auth outcome invalidation failed", invalidationError);
		}
	};
	return (async () => {
		let committed;
		const captureSharedSource = () => {
			if (sharedSource || owner.databasePath === owner.sharedDatabasePath) return;
			const commits = watchAuthProfileNativeCommits(owner.sharedDatabasePath);
			sharedSource = {
				commits,
				unchanged: commits.capture(),
				revision: getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(owner.sharedDatabasePath)
			};
		};
		const assertOwner = () => {
			if (resolveSharedAuthStorePath(owner.env) !== owner.sharedDatabasePath || resolveSharedAuthStoreOwnership(owner.env).location !== owner.location) throw new Error("Auth profile shared owner changed before write admission");
			if (!params.envOnly) assertAuthProfileMigrationStateAtDatabasePath(owner.databasePath);
		};
		let assertAuthority = assertOwner;
		const assertRequest = () => {
			params.assertCurrent?.();
			assertAuthority();
			if (sharedSource && (!sharedSource.unchanged() || getRuntimeAuthProfileStoreMutationRevisionAtDatabasePath(owner.sharedDatabasePath) !== sharedSource.revision)) throw new AuthProfileSharedSourceChangedError("Auth profile shared store changed before write admission");
		};
		const receive = (request) => {
			const facts = request.facts;
			if (!isRecord(facts) || facts.kind !== "auth-store-update" || !(facts.port instanceof MessagePort)) return false;
			if (exchangePort) throw new Error("Auth profile updater was already invoked");
			exchangePort = facts.port;
			const prepared = receiveAuthProfileUpdateValue(exchangePort);
			const response = params.update(prepared, owner);
			if (params.envOnly && response.save) captureSharedSource();
			sendAuthProfileUpdateValue(exchangePort, response.save ? {
				...response,
				authorizationIntents: "store" in response ? takeAuthProfileAuthorizationWriteIntents(response.store.profiles) : []
			} : response);
			return true;
		};
		const collectCommitted = () => {
			nativeCommits ??= watchAuthProfileNativeCommits(owner.databasePath);
			committedIsCurrent = nativeCommits.capture();
			if (exchangePort) committed = receiveAuthProfileUpdateValue(exchangePort);
			return committed;
		};
		const withCredentialPublication = createAuthProfileStoreUpdatePublication({
			databasePath: owner.databasePath,
			collectCommitted,
			committedIsCurrent: () => committedIsCurrent(),
			assertCurrent: () => assertAuthority()
		});
		const input = {
			owner: {
				databasePath: owner.databasePath,
				sharedDatabasePath: owner.sharedDatabasePath,
				location: owner.location
			},
			agentDir: params.agentDir,
			envOnly: params.envOnly,
			peerGeneration: params.peerGeneration
		};
		const publish = () => {
			acknowledged = true;
			return params.publish(committed, owner, assertAuthority, nativeCommits, committedIsCurrent);
		};
		if (databaseTarget.kind === "shared-state") {
			const context = captureOpenClawStateWorkerContext({ env: owner.env });
			if (context.admission.databasePath !== owner.databasePath) throw new Error("Auth profile worker differs from its captured owner");
			assertAuthority = () => {
				context.admission.assertCurrent();
				context.maintenanceScope?.assertAdmission();
				assertOwner();
			};
			return runOpenClawStateWorkerOperation(context, async (scope) => {
				await scope.execute({
					type: "authProfiles.update",
					input
				});
				return publish();
			}, {
				assertCurrent: assertOwner,
				createAdmission: withCredentialPublication((collect) => () => {
					let phase = "waiting";
					return {
						nativeLocations: [owner.databasePath],
						admission: createSqliteWorkerOperationAdmission((request, grant) => {
							assertRequest();
							if (phase === "waiting" && request.stage === "transaction" && receive(request)) {
								assertRequest();
								phase = "transaction";
							} else if (phase === "transaction" && request.stage === "commit") {
								collect();
								assertRequest();
								phase = "commit";
							} else throw new Error("Auth profile worker requested authority out of order");
							if (!grant()) throw new Error("Auth profile worker authority expired");
							commitGranted ||= request.stage === "commit";
						})
					};
				})
			});
		}
		const execution = capturedExecution ?? captureAuthProfileWriteExecution(databaseTarget);
		const assertCurrent = () => {
			execution.assertCurrent();
			assertOwner();
		};
		assertAuthority = assertCurrent;
		const source = {
			assertCurrent,
			createAdmission(binding) {
				return withCredentialPublication((collect) => () => {
					let transactionFacts;
					return {
						nativeLocations: binding.nativeLocations,
						admission: createSqliteWorkerOperationAdmission((request, grant) => {
							assertRequest();
							if (request.stage === "transaction") {
								transactionFacts = request.facts;
								if (!params.envOnly) captureSharedSource();
							}
							if (request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "auth-store-update") {
								if (!transactionFacts) throw new Error("Auth profile callback requires transaction admission");
								binding.authorize({
									stage: "prepare",
									facts: transactionFacts
								});
								receive(request);
							} else binding.authorize(request);
							if (request.stage === "commit") collect();
							assertRequest();
							if (!grant()) throw new Error("Auth profile worker authority expired");
							commitGranted ||= request.stage === "commit";
						}, binding.attachment)
					};
				});
			}
		};
		let outcome;
		try {
			outcome = {
				ok: true,
				value: await runOpenClawAgentWriteAdmission(databaseTarget, async () => {
					if (!params.existingDatabaseTarget) await execution.prepare(source);
					const result = await execution.runExisting(source, async (scope) => {
						if (await executeOpenClawAgentWorkerPublication(scope, {
							id: randomUUID(),
							moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.authProfileInlineUsage).href,
							input: {},
							command: {
								type: "authProfiles.update",
								input
							}
						})) await publish();
						return { value: void 0 };
					});
					if (!result) throw new Error("Auth profile database disappeared before mutation");
					return result.value;
				}, true)
			};
		} catch (error) {
			outcome = {
				ok: false,
				error
			};
			invalidateUnknown(error);
		}
		try {
			await execution.release();
		} catch (error) {
			if (!acknowledged) {
				if (!outcome.ok) throw createSqliteLifecycleAggregateError([outcome.error, error], "Auth update and executor cleanup failed", outcome.error);
				throw error;
			}
			reportCommittedInlineAuthFailure("Auth update settled before executor cleanup failed", error);
		}
		if (!outcome.ok) throw outcome.error;
		return outcome.value;
	})().catch((error) => {
		invalidateUnknown(error);
		throw error;
	}).finally(() => {
		exchangePort?.close();
		nativeCommits?.dispose();
		sharedSource?.commits.dispose();
	});
}
function createAuthProfileStoreUpdater(listRuntimeExternalAuthProfiles, host) {
	const { applyScopedAuthReadThrough, getScopedAuthProfileEnv, getScopedSharedAuthStore, resolveRuntimeAuthProfileAgentDir } = host;
	/** Update under the write lock; null on contention or changed inherited read facts. */
	return async function updateAuthProfileStoreWithLock(params) {
		const agentDir = resolveRuntimeAuthProfileAgentDir(params.agentDir);
		const envOnly = host.isEnvOnlyAuthProfileRuntime();
		try {
			if (params.profileId && isUserModelAuthProfileId(params.profileId)) {
				assertPersonalAuthProfileRuntime();
				params.assertCurrent?.();
				return await withPersonalAuthProfileStore(params.profileId, (owner) => owner.update((store) => {
					params.assertCurrent?.();
					const changed = params.updater(store);
					params.assertCurrent?.();
					return changed;
				}, params.assertCurrent), params.stateDir) ?? {
					version: 1,
					profiles: {}
				};
			}
			const workerWrites = getWorkerAuthProfileWrites();
			const writeOptions = {
				sharedStoreWrite: params.sharedStoreWrite,
				stateDir: params.stateDir,
				env: params.stateDir ? void 0 : getScopedAuthProfileEnv() ?? workerWrites?.env,
				assertEnvironment: workerWrites?.assertOwner
			};
			if (workerWrites || getOpenClawDatabaseMaintenanceScope()?.ownsSchemaMaintenance) {
				const updateNative = () => runAuthProfileWriteTransaction(agentDir, (database, owner) => {
					workerWrites?.assertOwner(owner.env);
					params.assertCurrent?.();
					const store = host.load(agentDir, {
						database,
						readOnly: true,
						syncExternalCli: false
					}, owner.env);
					const sharedStore = envOnly || owner.databasePath === owner.sharedDatabasePath ? null : loadPersistedAuthProfileStoreAtDatabasePath(owner.sharedDatabasePath, owner.location === "state-db" ? "shared-state" : "agent");
					const changed = params.updater(store, owner, sharedStore);
					workerWrites?.assertOwner(owner.env);
					params.assertCurrent?.();
					if (changed) host.save(store, agentDir, params.saveOptions, database, owner);
					return store;
				}, writeOptions);
				return await runAuthProfileUsage(async () => workerWrites ? workerWrites.run(updateNative) : updateNative());
			}
			let loadedStore;
			await runAuthProfileStoreUpdate({
				agentDir,
				envOnly,
				assertCurrent: params.assertCurrent,
				options: writeOptions,
				update(prepared, owner) {
					if (!envOnly) {
						assertAuthProfileMigrationCandidates({
							databasePath: owner.databasePath,
							candidates: resolveLegacyAuthProfileSourceCandidates({
								agentDir,
								env: owner.env
							}),
							hasCredentials: () => Object.keys(prepared.store.profiles).length > 0
						});
						observeCanonicalAuthProfileCredentials(owner.databasePath, prepared.store.profiles);
					}
					loadedStore = applyScopedAuthReadThrough(prepared.store);
					if (!params.updater(loadedStore, owner, prepared.mainStore)) return { save: false };
					const sanitize = (store) => store && {
						...store,
						profiles: buildPersistedAuthProfileSecretsStore(store).profiles
					};
					const options = params.saveOptions;
					const copyIds = (ids) => ids && [...ids];
					return {
						save: true,
						store: sanitize(loadedStore),
						scopedSharedStore: sanitize(getScopedSharedAuthStore()),
						externalProfiles: options?.filterExternalAuthProfiles !== false ? listRuntimeExternalAuthProfiles({
							store: loadedStore,
							agentDir
						}) : [],
						runtimeStore: options?.filterExternalAuthProfiles !== false ? sanitize(getRuntimeAuthProfileStoreSnapshotAtDatabasePath(owner.databasePath)) : void 0,
						options: options && {
							...options,
							preserveOrderProfileIds: copyIds(options.preserveOrderProfileIds),
							preserveStateProfileIds: copyIds(options.preserveStateProfileIds),
							pruneOrderProfileIds: copyIds(options.pruneOrderProfileIds)
						}
					};
				},
				async publish(committed, owner, assertCurrent, nativeCommits, committedIsCurrent) {
					if (committed) try {
						await publishAuthProfileStoreUpdate(owner, committed, assertCurrent, nativeCommits, committedIsCurrent);
					} catch (error) {
						invalidateRuntimeAuthProfileStoreSnapshotsForOwner(owner);
						reportCommittedInlineAuthFailure("Auth store committed before publication failed", error);
					}
				}
			});
			return loadedStore;
		} catch (error) {
			if (error instanceof AuthProfileSharedSourceChangedError) return null;
			const message = error instanceof Error ? error.message : String(error);
			authProfilesLog.warn(`auth profile store update failed: ${message}`, {
				agentDir,
				error: message
			});
			if (!isSqliteLockError(error)) throw error;
			return null;
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
	return setRuntimeLocalProfileMetadata(merged, Object.keys(store.profiles), runtimeStoreInheritsMainState(merged, store), store);
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
/** Whether an agent dir resolves to the shared main auth-profile owner. */
function isSharedMainAuthProfileAgentDir(agentDir) {
	const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	if (!effectiveAgentDir) return true;
	const mainAgentDir = resolveRuntimeAuthProfileAgentDir();
	const mainPath = mainAgentDir ? resolveAuthProfileDatabasePath(mainAgentDir) : resolveSharedAuthStorePath();
	return resolveAuthProfileDatabasePath(effectiveAgentDir) === mainPath;
}
/** @deprecated Use findPersistedAuthProfileCredentialAsync. Supported through 2026-12-31. */
function findPersistedAuthProfileCredential(params) {
	warnPluginSdkDeprecation({
		family: "auth-profiles",
		method: "findPersistedAuthProfileCredential",
		replacement: "findPersistedAuthProfileCredentialAsync"
	});
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
/**
* Resolve which agent dir owns a persisted profile, accounting for inherited OAuth.
* @deprecated Use resolvePersistedAuthProfileOwnerAgentDirAsync. Supported through 2026-12-31.
*/
function resolvePersistedAuthProfileOwnerAgentDir(params) {
	warnPluginSdkDeprecation({
		family: "auth-profiles",
		method: "resolvePersistedAuthProfileOwnerAgentDir",
		replacement: "resolvePersistedAuthProfileOwnerAgentDirAsync"
	});
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
/** Return the lifecycle-published effective auth store without persisted fallback reads. */
function getPreparedRuntimeAuthProfileStoreSnapshot(agentDir, inheritedAuthDir) {
	return getPreparedRuntimeAuthProfileStoreSnapshotCore(agentDir, inheritedAuthDir);
}
const getRuntimeAuthProfileStoreSnapshot = getRuntimeAuthProfileStoreSnapshotCore;
function snapshotRevisions(entries) {
	return entries.map(({ databasePath, agentDir, runtimeRevision }) => ({
		databasePath,
		agentDir,
		runtimeRevision
	}));
}
function indexSnapshots(entries) {
	return new Map((entries ?? []).map((entry) => [entry.databasePath, entry]));
}
function captureSnapshotRevision(entry) {
	return Object.assign(entry, { runtimeRevision: getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(entry.databasePath) });
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
		derivedRuntimeStores: capturedAuthPath === mainAuthPath ? listRuntimeAuthProfileStoreSnapshotsForSharedOwner(owner).map(captureSnapshotRevision) : []
	};
}
function recordRuntimeAuthProfileStoreOwnership(owned, runtime) {
	owned.runtimeCaptured = runtime.runtimeCaptured;
	owned.runtimeRevision = runtime.runtimeRevision;
	if (runtime.runtimeEntry !== void 0) owned.runtimeEntry = runtime.runtimeEntry;
	owned.derivedRuntimeStores = runtime.derivedRuntimeStores;
}
function recordRuntimeAuthProfileStorePublicationEdge(owned, runtime) {
	owned.runtimeRevisionBeforePublication = runtime.runtimeRevision;
	owned.derivedRuntimeRevisionsBeforePublication = snapshotRevisions(runtime.derivedRuntimeStores);
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
	const currentRuntimeStores = indexSnapshots(params.currentRuntimeStores);
	let converged = reconcileOne(restoredAuthPath, params.agentDir, params.snapshot.runtimeEntry, params.snapshot.runtimeRevision, params.owned.runtimeRevisionAtSaveEdge, params.owned.runtimeRevisionBeforePublication, params.owned.runtimeEntry, params.owned.runtimeRevision, currentRuntimeStores.get(restoredAuthPath), params.currentRuntimeRevision);
	if (restoredAuthPath !== mainAuthPath) return converged;
	const snapshotDerived = indexSnapshots(params.snapshot.derivedRuntimeStores);
	const ownedDerived = indexSnapshots(params.owned.derivedRuntimeStores);
	const saveEdgeDerivedRevisions = indexSnapshots(params.owned.derivedRuntimeRevisionsAtSaveEdge);
	const publicationEdgeDerivedRevisions = indexSnapshots(params.owned.derivedRuntimeRevisionsBeforePublication);
	for (const [pathname, currentEntry] of currentRuntimeStores) {
		if (pathname === mainAuthPath) continue;
		const snapshotEntry = snapshotDerived.get(pathname);
		const ownedEntry = ownedDerived.get(pathname);
		converged = reconcileOne(pathname, currentEntry.agentDir, snapshotEntry, snapshotEntry?.runtimeRevision, saveEdgeDerivedRevisions.get(pathname)?.runtimeRevision, publicationEdgeDerivedRevisions.get(pathname)?.runtimeRevision, ownedEntry, ownedEntry?.runtimeRevision, currentEntry, currentEntry.runtimeRevision) && converged;
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
		const persisted = mergePersistedAuthProfileState(credentialsOwned ? snapshot.credentialsRaw : existingRaw, () => stateOwned ? snapshot.stateRaw : existingState);
		deferSqlitePostCommitPublication(database.db, () => {
			noteAuthProfileFileWrite(owner.databasePath);
			recordRuntimeAuthProfilePersistedStore(owner.databasePath, persisted);
		});
		deferRuntimeSnapshotsAfterCommit(database, {
			...agentDir ? { agentDir } : {},
			databasePath: owner.databasePath,
			publish: () => {
				const currentRuntimeStores = [...listOwnedRuntimeAuthProfileStoreSnapshots().filter((entry) => entry.databasePath === owner.databasePath), ...owner.databasePath === owner.sharedDatabasePath ? listRuntimeAuthProfileStoreSnapshotsForSharedOwner(owner) : []].map(captureSnapshotRevision);
				const currentRuntimePath = owner.databasePath;
				const currentRuntimeRevision = getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(currentRuntimePath);
				if (credentialsRestored || stateRestored) noteRuntimeAuthProfileStorePersistedMutation(agentDir, {
					credentialsChanged: credentialsRestored,
					profileSetChanged: credentialsRestored && profileSetChanged,
					stateChanged: stateRestored,
					selectionChanged: stateRestored,
					profileIds: credentialsRestored ? changedProfileIds : []
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
		});
	}, { env: owned.owner.env });
}
function createAuthProfileStoreRuntime(externalAuth) {
	const { listRuntimeExternalAuthProfiles, overlayExternalAuthProfiles } = externalAuth;
	function maybeSyncPersistedExternalCliAuthProfiles(params) {
		if (params.options?.readOnly === true || params.options?.syncExternalCli === false || process.env.OPENCLAW_AUTH_STORE_READONLY === "1") return params.store;
		const synced = syncPersistedExternalCliAuthProfiles(params.store, resolveExternalCliOverlayOptions(params.options));
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
				}) ?? createEmptyAuthProfileStore();
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
				if (changed) deferRuntimeSnapshotsAfterCommit(database, saveAuthProfileStoreInTransaction(latestStore, params.agentDir, { filterExternalAuthProfiles: false }, database, owner));
				return latestStore;
			}, { env: getScopedAuthProfileEnv() });
		} catch (err) {
			authProfilesLog.warn("skipped persisted external cli auth sync because auth store write failed", { err });
			return params.store;
		}
	}
	const updateAuthProfileStoreWithLock = createAuthProfileStoreUpdater(listRuntimeExternalAuthProfiles, {
		applyScopedAuthReadThrough,
		getScopedAuthProfileEnv,
		getScopedSharedAuthStore,
		resolveRuntimeAuthProfileAgentDir,
		isEnvOnlyAuthProfileRuntime,
		load: loadAuthProfileStoreForAgent,
		save(store, agentDir, options, database, owner) {
			deferRuntimeSnapshotsAfterCommit(database, saveAuthProfileStoreInTransaction(store, agentDir, options, database, owner));
		}
	});
	/** Load the main auth profile store with runtime external profiles overlaid. */
	function loadAuthProfileStore() {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		const agentDir = resolveRuntimeAuthProfileAgentDir();
		const store = loadPersistedAuthProfileStore(agentDir) ?? createEmptyAuthProfileStore();
		recordRuntimeAuthProfilePersistedStore(agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(), store);
		observeCanonicalAuthProfileCredentials(agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath(), store.profiles);
		return overlayExternalAuthProfiles(applyScopedAuthReadThrough(markRuntimePersistedProfiles(store)), { agentDir });
	}
	function loadAuthProfileStoreForAgent(agentDir, options, env, preparedRows) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		const effectiveOptions = resolveRuntimeAuthProfileLoadOptions(options);
		if (!preparedRows && !effectiveAgentDir) prepareSharedAuthStoreOwnershipForNative(env ?? getScopedAuthProfileEnv());
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
		if (!preparedRows && !effectiveOptions?.database) recordRuntimeAuthProfilePersistedStore(databasePath, store);
		if (store) observeCanonicalAuthProfileCredentials(effectiveOptions?.database?.path ?? databasePath, store.profiles);
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
	const captureScope = () => {
		const mode = authProfileRuntimeMode.getStore();
		return {
			isolated: Boolean(mode),
			run: (agentDir, env, run) => mode?.kind === "agent-dir" ? authProfileRuntimeMode.run({
				...mode,
				agentDir,
				env
			}, run) : run()
		};
	};
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
		if (!readPreparedStore && (!effectiveAgentDir || !effectiveOptions?.inheritedAuthDir)) prepareSharedAuthStoreOwnershipForNative(env ?? getScopedAuthProfileEnv());
		const authPath = effectiveAgentDir ? resolveAuthProfileDatabasePath(effectiveAgentDir) : resolveSharedAuthStorePath(env);
		const store = readPreparedStore ? readPreparedStore(authPath) : loadAuthProfileStoreForAgent(effectiveAgentDir, effectiveOptions, env);
		const mainAuthPath = effectiveOptions?.inheritedAuthDir ? resolveAuthProfileDatabasePath(effectiveOptions.inheritedAuthDir) : resolveSharedAuthStorePath(env);
		const externalCli = resolveExternalCliOverlayOptions(effectiveOptions);
		const isMainStore = !effectiveAgentDir || authPath === mainAuthPath;
		const mainStore = isMainStore ? void 0 : loadInheritedAuthProfileStore(() => readPreparedStore ? readPreparedStore(mainAuthPath) : loadAuthProfileStoreForAgent(effectiveOptions?.inheritedAuthDir, effectiveOptions, env), effectiveOptions?.inheritedAuthDir, env ?? getScopedAuthProfileEnv());
		const mergedStore = mainStore ? mergeAuthProfileStores(mainStore, store, { preserveBaseRuntimeExternalProfiles: true }) : store;
		return setRuntimeLocalProfileMetadata(overlayExternalAuthProfiles(mergedStore, {
			agentDir: effectiveAgentDir,
			...env ? { env } : {},
			...externalCli
		}), listRuntimeLocalProfileIds(store, mainStore), !isMainStore && runtimeStoreInheritsMainState(mergedStore, store), isMainStore ? void 0 : store);
	}
	const { loadAuthProfileStoreForRuntime, loadAuthProfileStoreForRuntimeAsync, withPreparedAuthProfileStoreReads } = createAuthProfileStoreRuntimeReader({
		isEnvOnlyAuthProfileRuntime,
		getScopedAuthProfileEnv,
		resolveRuntimeAuthProfileAgentDir,
		resolveRuntimeAuthProfileLoadOptions,
		loadAuthProfileStoreForAgent,
		loadRuntimeAuthProfileStore,
		captureScope
	});
	/** Prepare a recorded provider without putting persisted SQLite reads on the caller's thread. */
	async function prepareAuthProfileProvider(params) {
		const provider = getRuntimeAuthProfileStoreSnapshot(params.agentDir)?.profiles[params.profileId]?.provider;
		if (provider || isEnvOnlyAuthProfileRuntime()) return { provider };
		return { provider: (await findPersistedAuthProfileCredentialAsync(params))?.provider };
	}
	async function findPersistedAuthProfileCredentialAsync(params) {
		if (isEnvOnlyAuthProfileRuntime()) return;
		if (isUserModelAuthProfileId(params.profileId) && authProfileRuntimeMode.getStore()) return;
		return withPreparedAuthProfileStoreReads(params.agentDir, {
			readOnly: true,
			profileId: params.profileId
		}, async (reads) => {
			if (isUserModelAuthProfileId(params.profileId)) return (await reads.materializePersonalProfile(createEmptyAuthProfileStore())).profiles[params.profileId];
			let requestedPath;
			const readCredential = async (agentDir) => {
				let recordedCredential;
				await reads.readStore(agentDir, {
					...reads.options,
					onReadOwner: (owner) => {
						requestedPath ??= owner.databasePath;
						recordedCredential = owner.readStore()?.profiles[params.profileId];
					}
				});
				return recordedCredential;
			};
			const requestedCredential = await readCredential(reads.effectiveAgentDir);
			const scopedSharedStore = reads.runInCapturedScope(getScopedSharedAuthStore);
			if (scopedSharedStore) return requestedCredential ?? scopedSharedStore.profiles[params.profileId];
			if (requestedCredential || !reads.effectiveAgentDir || requestedPath === await reads.sharedPath()) return requestedCredential;
			return readCredential(reads.runInCapturedScope(() => resolveRuntimeAuthProfileAgentDir()));
		});
	}
	/** Retain credential ownership after the temporary worker-read scope is disposed. */
	async function prepareAuthProfileCredentialRead(params) {
		if (isEnvOnlyAuthProfileRuntime() || getWorkerAuthProfileWrites()) return null;
		return withPreparedAuthProfileStoreReads(params.agentDir, {
			readOnly: true,
			profileId: params.profileId
		}, async (reads) => {
			let requestedPath;
			const prepare = async (agentDir) => {
				let readCurrent;
				await reads.readStore(agentDir, {
					...reads.options,
					onReadOwner: (owner) => {
						requestedPath ??= owner.databasePath;
						readCurrent = owner.readCurrentCredential;
					}
				});
				if (!readCurrent) throw new Error("Auth profile credential authority was not prepared");
				return readCurrent;
			};
			const requested = await prepare(reads.effectiveAgentDir);
			const scopedSharedStore = reads.runInCapturedScope(getScopedSharedAuthStore);
			let inherited;
			if (scopedSharedStore) inherited = await prepareScopedSharedAuthProfileCredentialRead(reads.env, params.profileId);
			else if (reads.effectiveAgentDir) {
				const inheritedAgentDir = reads.options.inheritedAuthDir;
				const inheritedPath = inheritedAgentDir ? resolveAuthProfileDatabasePath(inheritedAgentDir) : await reads.sharedPath();
				if (requestedPath !== inheritedPath) inherited = await prepare(inheritedAgentDir);
			}
			const readCurrent = () => requested() ?? inherited?.();
			return readCurrent() || params.store.runtimePersistedProfileIds?.includes(params.profileId) ? readCurrent : null;
		});
	}
	/** Resolve persisted ownership from worker-prepared rows, including inherited OAuth. */
	async function resolvePersistedAuthProfileOwnerAgentDirAsync(params) {
		if (isEnvOnlyAuthProfileRuntime() || isUserModelAuthProfileId(params.profileId)) return;
		const agentDir = resolveRuntimeAuthProfileAgentDir(params.agentDir);
		if (!agentDir) return;
		const mainAgentDir = resolveRuntimeAuthProfileAgentDir();
		return withPreparedAuthProfileStoreReads(agentDir, {
			readOnly: true,
			profileId: params.profileId
		}, async (reads) => {
			const readCredential = async (ownerAgentDir) => {
				let credential;
				await reads.readStore(ownerAgentDir, {
					...reads.options,
					onReadOwner: (owner) => {
						credential = owner.readStore()?.profiles[params.profileId];
					}
				});
				return credential;
			};
			const requestedProfile = await readCredential(agentDir);
			const mainPath = mainAgentDir ? resolveAuthProfileDatabasePath(mainAgentDir) : await reads.sharedPath();
			if (resolveAuthProfileDatabasePath(agentDir) === mainPath) return;
			const mainProfile = await readCredential(mainAgentDir);
			if (!requestedProfile) return mainProfile ? void 0 : agentDir;
			return shouldUseMainOwnerForLocalOAuthCredential({
				profileId: params.profileId,
				local: requestedProfile,
				main: mainProfile
			}) ? void 0 : agentDir;
		});
	}
	const { loadAuthProfileStoreWithoutExternalProfiles, loadAuthProfileStoreWithoutExternalProfilesAsync, ensureAuthProfileStore, ensureAuthProfileStoreAsync, ensureAuthProfileStoreWithoutExternalProfiles, ensureAuthProfileStoreWithoutExternalProfilesAsync, prepareAuthProfileStoreForModelRuntime } = createAuthProfileStoreReadRuntime({
		isEnvOnlyAuthProfileRuntime,
		getScopedAuthProfileEnv,
		getScopedSharedAuthStore,
		resolveRuntimeAuthProfileAgentDir,
		resolveRuntimeAuthProfileLoadOptions,
		resolvePersistedLoadOptions,
		loadAuthProfileStoreForAgent,
		captureScope,
		withPreparedAuthProfileStoreReads,
		overlayExternalAuthProfiles,
		setRuntimeAuthProfileStoreSnapshot,
		updateRuntimeAuthProfileStoreSnapshot
	});
	/** Retain read owners, never copies of their migration refusals, for a session facade. */
	function captureAuthProfileStoreReadScope(agentDir, config) {
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
				readStore: () => mode?.kind === "agent-dir" ? mode.sharedStore ?? null : null
			});
		}
		const readOptions = {
			config,
			readOnly: true,
			allowKeychainPrompt: false,
			deferScopedMigrationRefusals: true,
			onReadOwner: (owner) => {
				owners.set(owner.databasePath, owner);
			}
		};
		const runInScope = (load) => mode ? authProfileRuntimeMode.run(mode, load) : authProfileRuntimeMode.exit(load);
		const assertReadOwners = () => {
			for (const owner of owners.values()) assertAuthProfileMigrationStateAtDatabasePath(owner.databasePath, void 0, config, true);
		};
		const read = () => {
			const store = runInScope(() => loadAuthProfileStoreForRuntime(effectiveAgentDir, readOptions, env));
			assertReadOwners();
			return store;
		};
		const readAsync = async () => {
			const store = await runInScope(() => loadAuthProfileStoreForRuntimeAsync(effectiveAgentDir, readOptions, env));
			assertReadOwners();
			return store;
		};
		return {
			agentDir: effectiveAgentDir,
			env,
			envOnly: mode?.kind === "env-only",
			read,
			readAsync,
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
	function createAuthProfileStoreReadScope(agentDir, config) {
		const scope = captureAuthProfileStoreReadScope(agentDir, config);
		return {
			...scope,
			store: scope.read()
		};
	}
	async function createAuthProfileStoreReadScopeAsync(agentDir, config) {
		const scope = captureAuthProfileStoreReadScope(agentDir, config);
		return {
			...scope,
			store: await scope.readAsync()
		};
	}
	/**
	* @deprecated Await loadAuthProfileStoreForRuntimeAsync from openclaw/plugin-sdk/agent-runtime
	* with readOnly: true and allowKeychainPrompt: false. Supported through 2026-12-31.
	*/
	function loadAuthProfileStoreForSecretsRuntime(agentDir, options) {
		warnPluginSdkDeprecation({
			family: "auth-profiles",
			method: "loadAuthProfileStoreForSecretsRuntime",
			replacement: "loadAuthProfileStoreForRuntimeAsync from openclaw/plugin-sdk/agent-runtime with readOnly: true and allowKeychainPrompt: false"
		});
		return loadAuthProfileStoreForRuntime(agentDir, {
			...options,
			readOnly: true,
			allowKeychainPrompt: false
		});
	}
	/** Load auth profiles for secret resolution without keychain prompts or writes. */
	function loadAuthProfileStoreForSecretsRuntimeAsync(agentDir, options) {
		return loadAuthProfileStoreForRuntimeAsync(agentDir, {
			...options,
			readOnly: true,
			allowKeychainPrompt: false
		});
	}
	/** @deprecated Use ensureAuthProfileStoreForLocalUpdateAsync. Supported through 2026-12-31. */
	function ensureAuthProfileStoreForLocalUpdate(agentDir) {
		warnPluginSdkDeprecation({
			family: "auth-profiles",
			method: "ensureAuthProfileStoreForLocalUpdate",
			replacement: "ensureAuthProfileStoreForLocalUpdateAsync"
		});
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
	async function ensureAuthProfileStoreForLocalUpdateAsync(agentDir) {
		if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
		return withPreparedAuthProfileStoreReads(agentDir, void 0, async (prepared) => {
			const store = await prepared.readStore(prepared.effectiveAgentDir, { syncExternalCli: false });
			const mainAgentDir = prepared.runInCapturedScope(() => resolveRuntimeAuthProfileAgentDir());
			const mainAuthPath = mainAgentDir ? resolveAuthProfileDatabasePath(mainAgentDir) : await prepared.sharedPath();
			if (!prepared.effectiveAgentDir || resolveAuthProfileDatabasePath(prepared.effectiveAgentDir) === mainAuthPath) return store;
			let mainStore;
			try {
				mainStore = await prepared.readStore(void 0, {
					readOnly: true,
					syncExternalCli: false
				});
			} catch (error) {
				mainStore = loadInheritedAuthProfileStore(() => {
					throw error;
				}, void 0, prepared.env);
			}
			return mainStore ? mergeAuthProfileStores(mainStore, store, { preserveBaseRuntimeExternalProfiles: true }) : store;
		});
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
		const buildLocalStore = (saveOptions = options) => buildLocalAuthProfileStoreForSave({
			getScopedSharedAuthStore,
			listRuntimeExternalAuthProfiles,
			owner,
			store,
			agentDir: persistenceAgentDir,
			options: saveOptions,
			persistedStores
		});
		const localStore = buildLocalStore();
		const existingRaw = readPersistedAuthProfileStoreRaw(persistenceAgentDir, database);
		const existingState = readPersistedAuthProfileStateRaw(persistenceAgentDir, database);
		const { payload, statePayload, publication } = prepareAuthProfileStoreMutation({
			existingRaw,
			existingState,
			store: localStore,
			selectionProfiles: {
				...persistedStores.mainStore?.profiles,
				...store.profiles,
				...localStore.profiles
			}
		});
		const { credentialsChanged, stateChanged } = publication;
		const suppliedRuntimeStore = publishFromSuppliedStore ? markRuntimePersistedProfiles(buildLocalStore({
			...options,
			filterExternalAuthProfiles: false
		}), localStore) : void 0;
		if (credentialsChanged) writePersistedAuthProfileStoreRaw(payload, persistenceAgentDir, database);
		if (stateChanged) writePersistedAuthProfileStateRaw(statePayload, persistenceAgentDir, database);
		if ("env" in owner) {
			const persisted = mergePersistedAuthProfileState(credentialsChanged ? payload : existingRaw, () => stateChanged ? statePayload : existingState);
			const publishSource = () => {
				noteAuthProfileFileWrite(savedAuthPath);
				recordRuntimeAuthProfilePersistedStore(savedAuthPath, persisted);
			};
			if (!deferSqlitePostCommitPublication(database.db, publishSource)) publishSource();
		}
		const committedSharedStore = savesMainStore ? setRuntimeLocalProfileMetadata(markRuntimePersistedProfiles(localStore), listRuntimeLocalProfileIds(localStore)) : void 0;
		const publishRuntimeSnapshots = () => {
			observeCanonicalAuthProfileCredentials(savedAuthPath, payload.profiles);
			copyCanonicalAuthProfileCredentialObservations(payload.profiles, localStore.profiles);
			if (suppliedRuntimeStore) copyCanonicalAuthProfileCredentialObservations(payload.profiles, suppliedRuntimeStore.profiles);
			const derivedSnapshots = savesMainStore ? listRuntimeAuthProfileStoreSnapshotsForSharedOwner(owner, publication) : [];
			if (credentialsChanged || stateChanged) noteRuntimeAuthProfileStorePersistedMutation(persistenceAgentDir, publication, owner);
			try {
				assertAuthProfileMigrationStateAtDatabasePath(savedAuthPath);
			} catch (error) {
				for (const derived of derivedSnapshots) clearRuntimeAuthProfileStoreSnapshotAtDatabasePath(derived.databasePath, derived.agentDir);
				throw error;
			}
			const publishedStore = suppliedRuntimeStore ?? committedSharedStore;
			const existing = getOwnedRuntimeAuthProfileStoreSnapshotAtDatabasePath(savedAuthPath);
			if (existing) {
				if (publishedStore) publishPreparedRuntimeAuthProfileStoreSnapshot(persistenceAgentDir, existing, owner, publishedStore);
				else rebuildRuntimeAuthProfileStoreSnapshot(persistenceAgentDir, existing, owner);
			}
			if (suppliedRuntimeStore && !credentialsChanged && !stateChanged) return true;
			let converged = true;
			for (const derived of derivedSnapshots) converged = convergeRuntimeAuthProfileStoreSnapshot(derived.databasePath, derived.agentDir, () => {
				const updated = committedSharedStore && updateRuntimeAuthProfileStoreInheritedCredentials(derived.store, committedSharedStore, publication);
				if (updated) {
					assertAuthProfileMigrationStateAtDatabasePath(derived.databasePath);
					publishPreparedRuntimeAuthProfileStoreSnapshot(derived.agentDir, derived, {
						...owner,
						databasePath: derived.databasePath
					}, updated);
					return;
				}
				rebuildRuntimeAuthProfileStoreSnapshot(derived.agentDir, derived, {
					...owner,
					databasePath: derived.databasePath
				}, void 0, committedSharedStore, derived.store.runtimeLocalProfileIds);
			}) && converged;
			return converged;
		};
		return {
			...persistenceAgentDir ? { agentDir: persistenceAgentDir } : {},
			databasePath: savedAuthPath,
			publish: publishRuntimeSnapshots
		};
	}
	/**
	* @deprecated Use updateAuthProfileStoreWithLock from openclaw/plugin-sdk/provider-auth.
	* Supported through 2026-12-31.
	*/
	function saveAuthProfileStore(store, agentDir, options, database) {
		warnPluginSdkDeprecation({
			family: "auth-profiles",
			method: "saveAuthProfileStore",
			replacement: "updateAuthProfileStoreWithLock from openclaw/plugin-sdk/provider-auth"
		});
		for (const credential of Object.values(store.profiles)) normalizeAuthProfileSecretRefs(credential);
		const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
		if (database) {
			withAuthProfileCredentialWriteCustody(database.db, () => saveAuthProfileStoreWithPreparedOwner(store, effectiveAgentDir, options, database, resolveAuthProfileStoreOwner(database, getScopedAuthProfileEnv())));
			return;
		}
		runAuthProfileWriteTransaction(effectiveAgentDir, (transactionDatabase, owner) => {
			deferRuntimeSnapshotsAfterCommit(transactionDatabase, saveAuthProfileStoreInTransaction(store, effectiveAgentDir, options, transactionDatabase, owner));
		}, {
			sharedStoreWrite: options?.sharedStoreWrite,
			env: getScopedAuthProfileEnv()
		});
	}
	/** Core transaction callers carry the owner already selected before opening SQLite. */
	function saveAuthProfileStoreWithPreparedOwner(store, agentDir, options, database, owner) {
		deferRuntimeSnapshotsAfterCommit(database, saveAuthProfileStoreInTransaction(store, agentDir, options, database, owner, true), true);
	}
	/**
	* Commit only while both persisted auth rows still match the captured baseline.
	* The caller claims `owned` before publishing because publication is fallible.
	*/
	function saveAuthProfileStoreIfPersistenceSnapshotMatches(params) {
		const agentDir = resolveRuntimeAuthProfileAgentDir(params.agentDir);
		assertAuthProfilePersistenceOwner(params.snapshot.owner, agentDir, params.stateDir);
		const { owned, publication } = runAuthProfileWriteTransaction(agentDir, (database, owner) => {
			if (params.snapshot.owner.databasePath !== database.path) throw new Error("auth profile persistence snapshot belongs to another database");
			const currentCredentials = readPersistedAuthProfileStoreRaw(agentDir, database);
			const currentState = readPersistedAuthProfileStateRaw(agentDir, database);
			if (!isDeepStrictEqual(currentCredentials, params.snapshot.credentialsRaw) || !isDeepStrictEqual(currentState, params.snapshot.stateRaw)) throw new Error("auth profile store changed after secrets apply captured it");
			const runtimeAtSaveEdge = captureRuntimeAuthProfileStorePersistenceSnapshot(owner);
			const derivedRuntimeRevisionsAtSaveEdge = snapshotRevisions(runtimeAtSaveEdge.derivedRuntimeStores);
			const committedPublication = saveAuthProfileStoreInTransaction(params.store, agentDir, params.options, database, owner);
			return {
				owned: {
					owner,
					credentialsRaw: readPersistedAuthProfileStoreRaw(agentDir, database),
					stateRaw: readPersistedAuthProfileStateRaw(agentDir, database),
					runtimeCaptured: false,
					runtimeRevisionAtSaveEdge: runtimeAtSaveEdge.runtimeRevision,
					derivedRuntimeRevisionsAtSaveEdge
				},
				publication: committedPublication
			};
		}, { env: params.snapshot.owner.env });
		return {
			owned,
			publishRuntimeSnapshots: () => {
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
		prepareAuthProfileStoreForModelRuntime,
		createAuthProfileStoreReadScope,
		createAuthProfileStoreReadScopeAsync,
		updateAuthProfileStoreWithLock,
		loadAuthProfileStore,
		loadAuthProfileStoreForRuntime,
		loadAuthProfileStoreForRuntimeAsync,
		loadAuthProfileStoreForSecretsRuntime,
		loadAuthProfileStoreForSecretsRuntimeAsync,
		loadAuthProfileStoreWithoutExternalProfiles,
		loadAuthProfileStoreWithoutExternalProfilesAsync,
		ensureAuthProfileStore,
		ensureAuthProfileStoreAsync,
		ensureAuthProfileStoreWithoutExternalProfiles,
		ensureAuthProfileStoreWithoutExternalProfilesAsync,
		ensureAuthProfileStoreForLocalUpdate,
		ensureAuthProfileStoreForLocalUpdateAsync,
		saveAuthProfileStore,
		saveAuthProfileStoreWithPreparedOwner,
		saveAuthProfileStoreIfPersistenceSnapshotMatches,
		findPersistedAuthProfileCredential,
		findPersistedAuthProfileCredentialAsync,
		prepareAuthProfileCredentialRead,
		resolvePersistedAuthProfileOwnerAgentDirAsync,
		prepareAuthProfileProvider
	};
}
//#endregion
export { withPersonalAuthProfileStore as C, isAmbientCredentialAllowedByProviderAuthPin as D, createExternalAuthRuntime as E, publishInlineAuthFailure as S, materializePreparedPersonalAuthProfile as T, captureAuthProfileWriteExecution as _, getPreparedRuntimeAuthProfileStoreSnapshot as a, runAuthProfileUsage as b, getScopedSharedAuthStore as c, resolvePersistedAuthProfileOwnerAgentDir as d, resolveRuntimeAuthProfileAgentDir as f, runAuthProfileStoreUpdate as g, withEnvOnlyAuthProfileStore as h, findPersistedAuthProfileCredential as i, isEnvOnlyAuthProfileRuntime as l, withAuthProfileStoreAgentDir as m, captureAuthProfileStorePersistenceSnapshot as n, getRuntimeAuthProfileStoreSnapshot as o, restoreAuthProfileStorePersistenceSnapshot as p, createAuthProfileStoreRuntime as r, getScopedAuthProfileEnv as s, applyScopedAuthReadThrough as t, isSharedMainAuthProfileAgentDir as u, closeAuthProfileUsage as v, buildPortableAuthProfileStoreForAgentCopy as w, publishAuthProfileStoreUpdate as x, reserveAuthProfileUsagePreparation as y };
