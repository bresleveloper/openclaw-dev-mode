import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./utils-aKqR_F_U.mjs";
import { _ as secretRefKey, c as isSecretRef } from "./ref-contract-BVi3ykLT.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { A as setRuntimeConfigSnapshotRefreshHandler, c as getRuntimeConfigSnapshotMetadata, j as setRuntimeConfigSourceSnapshotIfCurrent, k as setRuntimeConfigSnapshot, n as clearRuntimeConfigSnapshot, s as getRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { _ as setActiveDegradedSecretOwners, s as clearActiveCredentialDegradedOwners } from "./runtime-degraded-state-DVMYGogL.mjs";
import { I as getRuntimeAuthProfileStoreProfileSetMutationToken, L as getRuntimeAuthProfileStoreStateMutationToken, P as getRuntimeAuthProfileStoreCredentialMutationToken, S as replaceOwnedRuntimeAuthProfileStoreSnapshots, c as getRuntimeAuthProfileStoreCredentialsRevision, i as clearRuntimeAuthProfileStoreSnapshots, m as getRuntimeAuthProfileStoreSnapshotsRevision, p as getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath, v as listOwnedRuntimeAuthProfileStoreSnapshots } from "./runtime-snapshots-CBozwlR0.mjs";
import { o as clearAuthProfileMigrationDiagnostics, t as AuthProfileMigrationRequiredError } from "./legacy-source-diagnostic-_PHHNz0J.mjs";
import { s as loadRuntimeAuthProfileOwnerSnapshot } from "./runtime-snapshot-owner-BaV0Qukl.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/secrets/runtime-web-tools-state.ts
let activeRuntimeWebToolsMetadata = null;
/**
* Clears active web-tool metadata when the secrets runtime snapshot is reset.
*/
function clearActiveRuntimeWebToolsMetadata() {
	activeRuntimeWebToolsMetadata = null;
}
/**
* Stores web-tool metadata with clone isolation from caller-owned objects.
*/
function setActiveRuntimeWebToolsMetadata(metadata) {
	activeRuntimeWebToolsMetadata = structuredClone(metadata);
}
/**
* Returns active web-tool metadata without exposing mutable runtime state.
*/
function getActiveRuntimeWebToolsMetadataFromState() {
	if (!activeRuntimeWebToolsMetadata) return null;
	return structuredClone(activeRuntimeWebToolsMetadata);
}
//#endregion
//#region src/secrets/runtime-state.ts
/** Holds active secrets runtime snapshots and their refresh lifecycle. */
function listLocatedSecretRefs(value, defaults, path = [], refs = []) {
	const ref = coerceSecretRef(value, defaults);
	if (ref) {
		refs.push({
			path,
			ref
		});
		return refs;
	}
	if (Array.isArray(value)) {
		for (const [index, entry] of value.entries()) listLocatedSecretRefs(entry, defaults, [...path, index], refs);
		return refs;
	}
	if (isRecord(value)) for (const key of Object.keys(value).toSorted()) listLocatedSecretRefs(value[key], defaults, [...path, key], refs);
	return refs;
}
/** Canonical store refs across config and auth profiles for one mutated team entry. */
function collectSecretStoreRefKeysInSnapshot(snapshot, name) {
	const sources = [snapshot.sourceConfig, ...snapshot.authStores.map(({ store }) => store)];
	return new Set(listLocatedSecretRefs(sources, snapshot.sourceConfig.secrets?.defaults).flatMap(({ ref }) => ref.source === "store" && ref.id === name ? [secretRefKey(ref)] : []));
}
/** Whether two configs resolve the same SecretRefs through the same provider contracts. */
function hasSameSecretReloadContract(left, right) {
	return isDeepStrictEqual({
		refs: listLocatedSecretRefs(left, left.secrets?.defaults),
		defaults: left.secrets?.defaults,
		providers: left.secrets?.providers
	}, {
		refs: listLocatedSecretRefs(right, right.secrets?.defaults),
		defaults: right.secrets?.defaults,
		providers: right.secrets?.providers
	});
}
let providerAuthActivation = null;
let activeSnapshot = null;
let activeSnapshotRevision = 0;
let activeSnapshotLineageStartRevision = 0;
let activeSnapshotLineageAuthStores = [];
let activeSnapshotLineageAuthMutations = {};
let activeRefreshContext = null;
const preparedSnapshotRefreshContext = /* @__PURE__ */ new WeakMap();
/**
* Clones refresh context while preserving callback identity and isolating mutable maps/config.
*/
function cloneSecretsRuntimeRefreshContext(context) {
	const cloned = {
		env: { ...context.env },
		explicitAgentDirs: context.explicitAgentDirs ? [...context.explicitAgentDirs] : null,
		includeConfigRefs: context.includeConfigRefs ?? true,
		includeAuthStoreRefs: context.includeAuthStoreRefs,
		loadablePluginOrigins: new Map(context.loadablePluginOrigins),
		...context.manifestRegistry ? { manifestRegistry: structuredClone(context.manifestRegistry) } : {}
	};
	if (context.loadAuthStore) cloned.loadAuthStore = context.loadAuthStore;
	return cloned;
}
function cloneSnapshot(snapshot) {
	return {
		sourceConfig: cloneConfigWithResolutionFacts(snapshot.sourceConfig),
		config: cloneConfigWithResolutionFacts(snapshot.config),
		authStores: structuredClone(snapshot.authStores),
		authStoreCredentialsRevision: snapshot.authStoreCredentialsRevision,
		authStoreSnapshotsRevision: snapshot.authStoreSnapshotsRevision,
		warnings: snapshot.warnings.map((warning) => ({ ...warning })),
		degradedOwners: structuredClone(snapshot.degradedOwners ?? []),
		secretOwners: structuredClone(snapshot.secretOwners ?? []),
		webTools: structuredClone(snapshot.webTools)
	};
}
function mergeLiveAuthStoreBookkeeping(authStores, preparedSnapshotsRevision, degradedOwners = []) {
	const liveEntries = new Map(listOwnedRuntimeAuthProfileStoreSnapshots().map((entry) => [entry.databasePath, entry]));
	return authStores.map((entry) => {
		const live = liveEntries.get(entry.databasePath);
		if (!live) return entry;
		let bookkeeping = entry.store;
		if (isDeepStrictEqual(snapshotMutationOwner(entry), snapshotMutationOwner(live))) {
			if (getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(entry.databasePath) <= preparedSnapshotsRevision) return entry;
			bookkeeping = live.store;
		} else if (entry.owner.kind === "resolved" && live.owner.kind === "resolved") try {
			bookkeeping = loadRuntimeAuthProfileOwnerSnapshot({
				databasePath: entry.databasePath,
				...entry.owner
			}, { candidates: entry.legacyCandidates });
		} catch (error) {
			if (!(error instanceof AuthProfileMigrationRequiredError) || Object.keys(entry.store.profiles).length > 0 || !degradedOwners.some((owner) => owner.ownerKind === "route" && owner.ownerId === error.ownerId && owner.degradationState === "cold")) throw error;
		}
		return {
			...entry,
			store: {
				...entry.store,
				order: bookkeeping.order,
				runtimeLocalOrderProviderIds: bookkeeping.runtimeLocalOrderProviderIds,
				lastGood: bookkeeping.lastGood,
				usageStats: bookkeeping.usageStats,
				runtimeInheritsMainState: bookkeeping.runtimeInheritsMainState
			}
		};
	});
}
function profileOwner(store, profileId) {
	if (!store?.profiles[profileId]) return "absent";
	if (store.runtimeExternalProfileIds?.includes(profileId)) return "external";
	return store.runtimeLocalProfileIds?.includes(profileId) ? "local" : "inherited";
}
function captureProfileOwnerMutationLineage(agentDir, store, profileId, databaseOwner) {
	const owner = profileOwner(store, profileId);
	return {
		owner,
		databaseOwner,
		token: owner === "external" ? {
			revision: 0,
			known: true
		} : getRuntimeAuthProfileStoreCredentialMutationToken(agentDir, profileId, {
			includeMain: owner === "absent" || owner === "inherited",
			owner: databaseOwner
		})
	};
}
function captureStoreMutationLineage(agentDir, store, databaseOwner) {
	return {
		databaseOwner,
		...!store || Object.keys(store.profiles).length === 0 || Object.keys(store.profiles).some((profileId) => profileOwner(store, profileId) === "inherited") ? { mainProfileSetToken: readSharedProfileSetMutationToken(databaseOwner) } : {},
		token: getRuntimeAuthProfileStoreCredentialMutationToken(agentDir, void 0, { owner: databaseOwner })
	};
}
function snapshotMutationOwner(entry) {
	return entry.owner.kind === "resolved" ? {
		kind: "resolved",
		databasePath: entry.databasePath,
		sharedDatabasePath: entry.owner.sharedDatabasePath
	} : {
		kind: "unresolved",
		databasePath: entry.databasePath,
		scope: { ...entry.owner.scope }
	};
}
function readSharedProfileSetMutationToken(owner) {
	return owner.kind === "resolved" ? getRuntimeAuthProfileStoreProfileSetMutationToken(void 0, owner.sharedDatabasePath) : {
		revision: 0,
		known: false
	};
}
function captureAuthStoreMutationLineage(baselineAuthStores, candidateAuthStores) {
	const baseline = Object.fromEntries(baselineAuthStores.map((entry) => [entry.agentDir, entry]));
	const candidate = Object.fromEntries(candidateAuthStores.map((entry) => [entry.agentDir, entry]));
	const agentDirs = /* @__PURE__ */ new Set([...Object.keys(baseline), ...Object.keys(candidate)]);
	return Object.fromEntries([...agentDirs].map((agentDir) => {
		const baselineStore = baseline[agentDir]?.store;
		const candidateStore = candidate[agentDir]?.store;
		const baselineOwner = snapshotMutationOwner(baseline[agentDir] ?? candidate[agentDir]);
		const candidateOwner = snapshotMutationOwner(candidate[agentDir] ?? baseline[agentDir]);
		const effectiveStore = candidateStore ?? baselineStore;
		const profileIds = /* @__PURE__ */ new Set([...Object.keys(baselineStore?.profiles ?? {}), ...Object.keys(candidateStore?.profiles ?? {})]);
		return [agentDir, {
			store: {
				baseline: captureStoreMutationLineage(agentDir, baselineStore, baselineOwner),
				candidate: captureStoreMutationLineage(agentDir, candidateStore, candidateOwner)
			},
			state: {
				token: getRuntimeAuthProfileStoreStateMutationToken(agentDir, {
					includeMain: effectiveStore?.runtimeInheritsMainState === true,
					owner: candidateOwner
				}),
				databaseOwner: candidateOwner,
				includeMain: effectiveStore?.runtimeInheritsMainState === true
			},
			profiles: Object.fromEntries([...profileIds].map((profileId) => [profileId, {
				baseline: captureProfileOwnerMutationLineage(agentDir, baselineStore, profileId, baselineOwner),
				candidate: captureProfileOwnerMutationLineage(agentDir, candidateStore, profileId, candidateOwner)
			}]))
		}];
	}));
}
function mergeRollbackValue(previous, candidate, current) {
	if (isDeepStrictEqual(candidate, current)) return structuredClone(previous);
	if (isDeepStrictEqual(candidate, previous)) return structuredClone(current);
	if (!isRecord(previous) || !isRecord(candidate) || !isRecord(current)) return structuredClone(previous);
	const merged = {};
	const keys = /* @__PURE__ */ new Set([
		...Object.keys(previous),
		...Object.keys(candidate),
		...Object.keys(current)
	]);
	for (const key of keys) {
		const value = mergeRollbackValue(previous[key], candidate[key], current[key]);
		if (value !== void 0) merged[key] = value;
	}
	return merged;
}
function hasSameSecretProviderDefinition(ref, configs) {
	const definition = configs[0]?.secrets?.providers?.[ref.provider];
	if (!configs.every((config) => isDeepStrictEqual(config.secrets?.providers?.[ref.provider], definition))) return false;
	if (!definition || !("pluginIntegration" in definition)) return true;
	const dependency = (config) => ({
		plugins: config.plugins,
		channels: config.channels
	});
	const previous = dependency(configs[0]);
	return configs.every((config) => isDeepStrictEqual(dependency(config), previous));
}
function preserveResolvedSecretRefValues(source, currentSource, current, restored, sourceConfig, currentSourceConfig) {
	const sourceRef = coerceSecretRef(source, sourceConfig.secrets?.defaults);
	if (sourceRef) {
		const currentRef = coerceSecretRef(currentSource, currentSourceConfig.secrets?.defaults);
		return currentRef && isDeepStrictEqual(sourceRef, currentRef) && hasSameSecretProviderDefinition(sourceRef, [sourceConfig, currentSourceConfig]) ? structuredClone(current) : restored;
	}
	if (Array.isArray(source) && Array.isArray(current) && Array.isArray(restored)) {
		const next = [...restored];
		for (const [index, value] of source.entries()) next[index] = preserveResolvedSecretRefValues(value, Array.isArray(currentSource) ? currentSource[index] : void 0, current[index], next[index], sourceConfig, currentSourceConfig);
		return next;
	}
	if (isRecord(source) && isRecord(current) && isRecord(restored)) {
		const next = { ...restored };
		for (const [key, value] of Object.entries(source)) next[key] = preserveResolvedSecretRefValues(value, isRecord(currentSource) ? currentSource[key] : void 0, current[key], next[key], sourceConfig, currentSourceConfig);
		return next;
	}
	return restored;
}
function preserveResolvedAuthStoreSecretValues(previous, candidate, restored, current, previousConfig, candidateConfig, currentConfig) {
	const next = structuredClone(restored);
	for (const [agentDir, store] of Object.entries(next)) {
		const previousStore = previous[agentDir];
		const candidateStore = candidate[agentDir];
		const currentStore = current[agentDir];
		if (!previousStore || !candidateStore || !currentStore) continue;
		for (const [profileId, credential] of Object.entries(store.profiles)) {
			const previousCredential = previousStore.profiles[profileId];
			const candidateCredential = candidateStore.profiles[profileId];
			const currentCredential = currentStore.profiles[profileId];
			if (credential.type === "api_key" && previousCredential?.type === "api_key" && candidateCredential?.type === "api_key" && currentCredential?.type === "api_key" && isSecretRef(credential.keyRef) && isDeepStrictEqual(credential.keyRef, previousCredential.keyRef) && isDeepStrictEqual(credential.keyRef, candidateCredential.keyRef) && isDeepStrictEqual(credential.keyRef, currentCredential.keyRef) && hasSameSecretProviderDefinition(credential.keyRef, [
				previousConfig,
				candidateConfig,
				currentConfig
			]) && currentCredential.key !== void 0) store.profiles[profileId] = {
				...credential,
				key: currentCredential.key
			};
			else if (credential.type === "token" && previousCredential?.type === "token" && candidateCredential?.type === "token" && currentCredential?.type === "token" && isSecretRef(credential.tokenRef) && isDeepStrictEqual(credential.tokenRef, previousCredential.tokenRef) && isDeepStrictEqual(credential.tokenRef, candidateCredential.tokenRef) && isDeepStrictEqual(credential.tokenRef, currentCredential.tokenRef) && hasSameSecretProviderDefinition(credential.tokenRef, [
				previousConfig,
				candidateConfig,
				currentConfig
			]) && currentCredential.token !== void 0) store.profiles[profileId] = {
				...credential,
				token: currentCredential.token
			};
		}
	}
	return next;
}
function credentialSecretRef(credential) {
	if (credential?.type === "api_key" && isSecretRef(credential.keyRef)) return credential.keyRef;
	if (credential?.type === "token" && isSecretRef(credential.tokenRef)) return credential.tokenRef;
	return null;
}
function rebuildSelectedRuntimeProfileMetadata(store, selectedSources) {
	const profileIdsFor = (field) => [...selectedSources].flatMap(([profileId, source]) => source[field]?.includes(profileId) ? [profileId] : []).toSorted();
	const persistedProfileIds = profileIdsFor("runtimePersistedProfileIds");
	store.runtimePersistedProfileIds = persistedProfileIds.length > 0 ? persistedProfileIds : void 0;
	const localProfileIds = profileIdsFor("runtimeLocalProfileIds");
	store.runtimeLocalProfileIds = localProfileIds.length > 0 ? localProfileIds : void 0;
	const externalProfileIds = profileIdsFor("runtimeExternalProfileIds");
	const externalAuthoritative = store.runtimeExternalProfileIdsAuthoritative === true;
	store.runtimeExternalProfileIds = externalProfileIds.length > 0 || externalAuthoritative ? externalProfileIds : void 0;
	store.runtimeExternalProfileIdsAuthoritative = externalAuthoritative ? true : void 0;
}
function compareMutationTokens(captured, current) {
	if (!captured.known || !current.known) return "unknown";
	return captured.revision === current.revision ? "unchanged" : "mutated";
}
function readProfileOwnerMutationToken(agentDir, profileId, lineage) {
	return lineage.owner === "external" ? {
		revision: 0,
		known: true
	} : getRuntimeAuthProfileStoreCredentialMutationToken(agentDir, profileId, {
		includeMain: lineage.owner === "absent" || lineage.owner === "inherited",
		owner: lineage.databaseOwner
	});
}
function getProfileMutationDecision(params) {
	const captured = params.mutationLineage[params.agentDir]?.profiles[params.profileId];
	if (!captured) return {
		baselineOwner: "absent",
		candidateOwner: "absent",
		candidateStatus: "mutated",
		ownerChanged: false,
		status: "mutated"
	};
	const ownerChanged = captured.baseline.owner !== captured.candidate.owner || !isDeepStrictEqual(captured.baseline.databaseOwner, captured.candidate.databaseOwner);
	const relevant = ownerChanged ? captured.baseline : captured.candidate;
	return {
		baselineOwner: captured.baseline.owner,
		candidateOwner: captured.candidate.owner,
		candidateStatus: compareMutationTokens(captured.candidate.token, readProfileOwnerMutationToken(params.agentDir, params.profileId, captured.candidate)),
		ownerChanged,
		status: compareMutationTokens(relevant.token, readProfileOwnerMutationToken(params.agentDir, params.profileId, relevant))
	};
}
function mergeRollbackAuthStoreCredentials(baseline, candidate, current, restored, configs, mutationLineage, snapshotOwners) {
	const next = structuredClone(restored);
	const agentDirs = /* @__PURE__ */ new Set([
		...Object.keys(baseline),
		...Object.keys(candidate),
		...Object.keys(current)
	]);
	for (const agentDir of agentDirs) {
		let invalidateStore = false;
		const baselineStore = baseline[agentDir];
		const candidateStore = candidate[agentDir];
		const currentStore = current[agentDir];
		const currentStoreMutationStatus = (lineage) => {
			const databaseOwner = lineage?.databaseOwner ?? snapshotOwners[agentDir];
			const ownerStatus = compareMutationTokens(lineage?.token ?? {
				revision: 0,
				known: true
			}, getRuntimeAuthProfileStoreCredentialMutationToken(agentDir, void 0, { owner: databaseOwner }));
			const mainProfileSetStatus = lineage?.mainProfileSetToken ? compareMutationTokens(lineage.mainProfileSetToken, readSharedProfileSetMutationToken(databaseOwner)) : "unchanged";
			return ownerStatus === "mutated" || mainProfileSetStatus === "mutated" ? "mutated" : ownerStatus === "unknown" || mainProfileSetStatus === "unknown" ? "unknown" : "unchanged";
		};
		const baselineStoreMutationStatus = currentStoreMutationStatus(mutationLineage[agentDir]?.store.baseline);
		const candidateStoreMutationStatus = currentStoreMutationStatus(mutationLineage[agentDir]?.store.candidate);
		const stateMutationStatus = compareMutationTokens(mutationLineage[agentDir]?.state.token ?? {
			revision: 0,
			known: true
		}, getRuntimeAuthProfileStoreStateMutationToken(agentDir, {
			includeMain: mutationLineage[agentDir]?.state.includeMain === true,
			owner: mutationLineage[agentDir]?.state.databaseOwner ?? snapshotOwners[agentDir]
		}));
		const profileOwnerMutated = Object.keys(baselineStore?.profiles ?? {}).some((profileId) => {
			const decision = getProfileMutationDecision({
				agentDir,
				profileId,
				mutationLineage
			});
			return decision.status !== "unchanged" || decision.candidateStatus !== "unchanged";
		});
		if (!currentStore) {
			if (!candidateStore && baselineStore && baselineStoreMutationStatus === "unchanged" && candidateStoreMutationStatus === "unchanged" && stateMutationStatus === "unchanged" && !profileOwnerMutated) next[agentDir] = structuredClone(baselineStore);
			else delete next[agentDir];
			continue;
		}
		const store = next[agentDir] ?? structuredClone(baselineStore ?? currentStore);
		const profiles = {};
		const selectedSources = /* @__PURE__ */ new Map();
		const profileIds = /* @__PURE__ */ new Set([
			...Object.keys(baselineStore?.profiles ?? {}),
			...Object.keys(candidateStore?.profiles ?? {}),
			...Object.keys(currentStore.profiles)
		]);
		for (const profileId of profileIds) {
			const baselineCredential = baselineStore?.profiles[profileId];
			const candidateCredential = candidateStore?.profiles[profileId];
			const currentCredential = currentStore.profiles[profileId];
			const profileMutationDecision = getProfileMutationDecision({
				agentDir,
				profileId,
				mutationLineage
			});
			const profileMutationStatus = profileMutationDecision.status;
			const profileMutated = profileMutationStatus === "mutated";
			const currentOwner = profileOwner(currentStore, profileId);
			let credential;
			let selectedSource;
			if (currentOwner !== profileMutationDecision.candidateOwner) {
				credential = currentCredential;
				selectedSource = currentStore;
			} else if (profileMutationDecision.ownerChanged) {
				if (profileMutationStatus !== "unchanged" || profileMutationDecision.candidateStatus !== "unchanged") invalidateStore = true;
				else {
					credential = baselineCredential;
					selectedSource = baselineStore;
				}
			} else if (profileMutationStatus === "unknown") {
				if (isDeepStrictEqual(baselineCredential, candidateCredential)) {
					credential = currentCredential;
					selectedSource = currentStore;
				} else invalidateStore = true;
			} else if (isDeepStrictEqual(currentCredential, candidateCredential)) {
				if (profileMutated) {
					credential = currentCredential;
					selectedSource = currentStore;
				} else {
					credential = baselineCredential;
					selectedSource = baselineStore;
				}
			} else {
				credential = currentCredential;
				selectedSource = currentStore;
			}
			const baselineRef = credentialSecretRef(baselineCredential);
			const candidateRef = credentialSecretRef(candidateCredential);
			const currentRef = credentialSecretRef(currentCredential);
			if (currentOwner === profileMutationDecision.candidateOwner && profileMutationStatus === "unchanged" && candidateRef && currentRef && isDeepStrictEqual(candidateRef, currentRef) && !isDeepStrictEqual(baselineRef, candidateRef)) {
				credential = baselineCredential;
				selectedSource = baselineStore;
			}
			if (baselineRef && candidateRef && currentRef && isDeepStrictEqual(baselineRef, candidateRef) && isDeepStrictEqual(baselineRef, currentRef) && !hasSameSecretProviderDefinition(baselineRef, configs)) {
				if (currentOwner !== profileMutationDecision.candidateOwner || profileMutationStatus !== "unchanged") {
					invalidateStore = true;
					credential = void 0;
					selectedSource = void 0;
				} else {
					credential = baselineCredential;
					selectedSource = baselineStore;
				}
			}
			const selectedRef = credentialSecretRef(credential);
			if (selectedSource === currentStore && selectedRef && !hasSameSecretProviderDefinition(selectedRef, [configs[0], configs[1]])) {
				invalidateStore = true;
				credential = void 0;
				selectedSource = void 0;
			}
			if (credential && selectedSource) {
				profiles[profileId] = structuredClone(credential);
				selectedSources.set(profileId, selectedSource);
			}
		}
		if (invalidateStore) {
			delete next[agentDir];
			continue;
		}
		if (!baselineStore && Object.keys(profiles).length === 0) {
			delete next[agentDir];
			continue;
		}
		store.profiles = profiles;
		rebuildSelectedRuntimeProfileMetadata(store, selectedSources);
		next[agentDir] = store;
	}
	return next;
}
/**
* Associates a prepared snapshot with the refresh context needed after activation.
*/
function setPreparedSecretsRuntimeSnapshotRefreshContext(snapshot, context) {
	preparedSnapshotRefreshContext.set(snapshot, cloneSecretsRuntimeRefreshContext(context));
}
/**
* Returns the refresh context stored for a prepared snapshot, if any.
*/
function getPreparedSecretsRuntimeSnapshotRefreshContext(snapshot) {
	const context = preparedSnapshotRefreshContext.get(snapshot);
	return context ? cloneSecretsRuntimeRefreshContext(context) : null;
}
/**
* Returns the active refresh context without exposing mutable runtime state.
*/
function getActiveSecretsRuntimeRefreshContext() {
	return activeRefreshContext ? cloneSecretsRuntimeRefreshContext(activeRefreshContext) : null;
}
/** Retain live auth state when a one-shot config write intentionally skips auth-store refs. */
function graftActiveSecretsRuntimeAuthState(snapshot) {
	if (!activeRefreshContext) return;
	snapshot.authStores = getLiveSecretsRuntimeAuthStores();
	snapshot.authStoreCredentialsRevision = getRuntimeAuthProfileStoreCredentialsRevision();
	snapshot.authStoreSnapshotsRevision = getRuntimeAuthProfileStoreSnapshotsRevision();
	setPreparedSecretsRuntimeSnapshotRefreshContext(snapshot, activeRefreshContext);
}
/**
* Returns the env used by the active runtime snapshot, falling back to process env.
*/
function getActiveSecretsRuntimeEnvState() {
	return { ...activeRefreshContext?.env ?? process.env };
}
/**
* Atomically activates a prepared secrets snapshot across config, auth-store, and web-tool state.
*/
function activateSecretsRuntimeSnapshotState(params) {
	if (!hasCurrentAuthStoreCredentialsRevision(params.snapshot)) throw new Error("Cannot activate stale secrets runtime snapshot: auth credentials changed during preparation.");
	const next = cloneSnapshot(params.snapshot);
	if (params.mergeLiveAuthBookkeeping !== false) next.authStores = mergeLiveAuthStoreBookkeeping(next.authStores, next.authStoreSnapshotsRevision, next.degradedOwners);
	const activationAuthStores = listOwnedRuntimeAuthProfileStoreSnapshots();
	const previousLineageAuthStores = activeSnapshotLineageAuthStores;
	const activationAuthMutations = captureAuthStoreMutationLineage(activationAuthStores, next.authStores);
	const previousLineageAuthMutations = activeSnapshotLineageAuthMutations;
	const nextRefreshContext = params.refreshContext ? cloneSecretsRuntimeRefreshContext(params.refreshContext) : null;
	setRuntimeConfigSnapshot(next.config, params.runtimeSourceConfig ?? next.sourceConfig);
	replaceOwnedRuntimeAuthProfileStoreSnapshots(next.authStores);
	next.authStoreCredentialsRevision = getRuntimeAuthProfileStoreCredentialsRevision();
	next.authStoreSnapshotsRevision = getRuntimeAuthProfileStoreSnapshotsRevision();
	const previousLineageStartRevision = activeSnapshotLineageStartRevision;
	activeSnapshot = next;
	activeSnapshotRevision += 1;
	activeSnapshotLineageStartRevision = params.preserveActivationLineage ? previousLineageStartRevision : activeSnapshotRevision;
	activeSnapshotLineageAuthStores = params.preserveActivationLineage ? previousLineageAuthStores : activationAuthStores;
	activeSnapshotLineageAuthMutations = params.preserveActivationLineage ? previousLineageAuthMutations : activationAuthMutations;
	activeRefreshContext = nextRefreshContext;
	if (nextRefreshContext) preparedSnapshotRefreshContext.set(next, cloneSecretsRuntimeRefreshContext(nextRefreshContext));
	setActiveRuntimeWebToolsMetadata(next.webTools);
	setActiveDegradedSecretOwners(next.degradedOwners ?? []);
	setRuntimeConfigSnapshotRefreshHandler(params.refreshHandler);
}
/** Whether a prepared snapshot still owns the credential state it cloned. */
function hasCurrentAuthStoreCredentialsRevision(snapshot) {
	return snapshot.authStoreCredentialsRevision === getRuntimeAuthProfileStoreCredentialsRevision();
}
/** Activates only while the caller still owns the snapshot revision it prepared against. */
function activateSecretsRuntimeSnapshotStateIfCurrent(params) {
	if (activeSnapshotRevision !== params.expectedRevision || !hasCurrentAuthStoreCredentialsRevision(params.snapshot)) return false;
	activateSecretsRuntimeSnapshotState(params);
	return true;
}
/** Restores an owned predecessor while retaining changes after candidate preparation. */
function restoreSecretsRuntimeSnapshotStateIfCurrent(params) {
	if (!activeSnapshot || activeSnapshotLineageStartRevision !== params.expectedRevision) return false;
	const currentEntries = listOwnedRuntimeAuthProfileStoreSnapshots();
	const independentEntries = currentEntries.filter((entry) => {
		const captured = activeSnapshotLineageAuthMutations[entry.agentDir];
		return captured && !isDeepStrictEqual(snapshotMutationOwner(entry), captured.store.candidate.databaseOwner);
	});
	const independentKeys = new Set(independentEntries.map((entry) => entry.agentDir));
	const rollbackEntries = (entries) => entries.filter((entry) => !independentKeys.has(entry.agentDir));
	const baselineAuthStores = Object.fromEntries(rollbackEntries(activeSnapshotLineageAuthStores).map((entry) => [entry.agentDir, entry.store]));
	const candidateAuthStores = Object.fromEntries(rollbackEntries(params.ownedSnapshot.authStores).map((entry) => [entry.agentDir, entry.store]));
	const currentAuthStores = Object.fromEntries(rollbackEntries(currentEntries).map((entry) => [entry.agentDir, entry.store]));
	const restoredEntries = new Map([
		...currentEntries,
		...params.ownedSnapshot.authStores,
		...activeSnapshotLineageAuthStores
	].map((entry) => [entry.agentDir, entry]));
	const mergedAuthStores = mergeRollbackAuthStoreCredentials(baselineAuthStores, candidateAuthStores, currentAuthStores, mergeRollbackValue(baselineAuthStores, candidateAuthStores, currentAuthStores), [
		params.snapshot.sourceConfig,
		params.ownedSnapshot.sourceConfig,
		activeSnapshot.sourceConfig
	], activeSnapshotLineageAuthMutations, Object.fromEntries(Array.from(restoredEntries, ([agentDir, entry]) => [agentDir, snapshotMutationOwner(entry)])));
	const currentCredentialsRevision = getRuntimeAuthProfileStoreCredentialsRevision();
	const restoredAuthStores = preserveResolvedAuthStoreSecretValues(baselineAuthStores, candidateAuthStores, mergedAuthStores, currentAuthStores, params.snapshot.sourceConfig, params.ownedSnapshot.sourceConfig, activeSnapshot.sourceConfig);
	const restoredSourceConfig = mergeRollbackValue(params.snapshot.sourceConfig, params.ownedSnapshot.sourceConfig, activeSnapshot.sourceConfig);
	const restoredConfig = preserveResolvedSecretRefValues(restoredSourceConfig, activeSnapshot.sourceConfig, activeSnapshot.config, mergeRollbackValue(params.snapshot.config, params.ownedSnapshot.config, activeSnapshot.config), restoredSourceConfig, activeSnapshot.sourceConfig);
	return activateSecretsRuntimeSnapshotStateIfCurrent({
		...params,
		snapshot: {
			...params.snapshot,
			sourceConfig: restoredSourceConfig,
			config: restoredConfig,
			authStores: mergeLiveAuthStoreBookkeeping([...Object.entries(restoredAuthStores).map(([agentDir, store]) => Object.assign({}, restoredEntries.get(agentDir), { store })), ...independentEntries], params.snapshot.authStoreSnapshotsRevision, params.snapshot.degradedOwners).toSorted((left, right) => left.agentDir.localeCompare(right.agentDir)),
			authStoreCredentialsRevision: currentCredentialsRevision,
			authStoreSnapshotsRevision: getRuntimeAuthProfileStoreSnapshotsRevision()
		},
		mergeLiveAuthBookkeeping: false,
		preserveActivationLineage: false,
		expectedRevision: activeSnapshotRevision
	});
}
/**
* Returns a cloned active secrets runtime snapshot for callers that need mutable data.
*/
function getActiveSecretsRuntimeSnapshotState() {
	if (!activeSnapshot) return null;
	const snapshot = cloneSnapshot(activeSnapshot);
	snapshot.authStores = listOwnedRuntimeAuthProfileStoreSnapshots();
	snapshot.authStoreCredentialsRevision = getRuntimeAuthProfileStoreCredentialsRevision();
	snapshot.authStoreSnapshotsRevision = getRuntimeAuthProfileStoreSnapshotsRevision();
	if (activeRefreshContext) preparedSnapshotRefreshContext.set(snapshot, cloneSecretsRuntimeRefreshContext(activeRefreshContext));
	return snapshot;
}
/** Stable token for compare-and-activate ownership across cloned snapshot reads. */
function getActiveSecretsRuntimeSnapshotRevisionState() {
	return activeSnapshotRevision;
}
/** Whether the active snapshot is the activation or a scoped descendant of one revision. */
function hasActiveSecretsRuntimeSnapshotLineage(revision) {
	return activeSnapshot !== null && activeSnapshotLineageStartRevision === revision;
}
/** Advance canonical source ownership without replacing resolved runtime or auth bytes. */
function setSecretsRuntimeSourceSnapshotIfCurrent(params) {
	if (activeSnapshotRevision !== params.expectedSecretsRevision) return false;
	const nextRuntimeSourceConfig = cloneConfigWithResolutionFacts(params.runtimeSourceConfig);
	const nextSecretsSourceConfig = cloneConfigWithResolutionFacts(params.secretsSourceConfig);
	if (!setRuntimeConfigSourceSnapshotIfCurrent({
		expectedRevision: params.expectedRuntimeConfigRevision,
		sourceConfig: nextRuntimeSourceConfig
	})) return false;
	advanceSecretsRuntimeSourceSnapshot(nextSecretsSourceConfig);
	return true;
}
function advanceSecretsRuntimeSourceSnapshot(sourceConfig) {
	if (activeSnapshot) {
		activeSnapshot.sourceConfig = sourceConfig;
		activeSnapshotRevision += 1;
		activeSnapshotLineageStartRevision = activeSnapshotRevision;
		activeSnapshotLineageAuthStores = listOwnedRuntimeAuthProfileStoreSnapshots();
		activeSnapshotLineageAuthMutations = captureAuthStoreMutationLineage(activeSnapshotLineageAuthStores, activeSnapshotLineageAuthStores);
	}
}
/** Reverts source ownership while retaining scoped descendants of the committed source write. */
function restoreSecretsRuntimeSourceSnapshotIfLineageCurrent(params) {
	if (!activeSnapshot || activeSnapshotLineageStartRevision !== params.expectedLineageRevision) return false;
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeMetadata = getRuntimeConfigSnapshotMetadata();
	if (!runtimeConfig || !runtimeMetadata || !isDeepStrictEqual(runtimeConfig, activeSnapshot.config)) return false;
	if (!setRuntimeConfigSourceSnapshotIfCurrent({
		expectedRevision: runtimeMetadata.revision,
		sourceConfig: cloneConfigWithResolutionFacts(params.runtimeSourceConfig)
	})) return false;
	advanceSecretsRuntimeSourceSnapshot(cloneConfigWithResolutionFacts(params.secretsSourceConfig));
	return true;
}
function getActiveSecretsRuntimeConfigSnapshot() {
	if (!activeSnapshot) return null;
	return {
		config: activeSnapshot.config,
		sourceConfig: activeSnapshot.sourceConfig,
		configRefsPrepared: activeRefreshContext?.includeConfigRefs === true
	};
}
/**
* Returns current auth stores, preferring live auth-store snapshots over activation-time clones.
*/
function getLiveSecretsRuntimeAuthStores() {
	if (!activeSnapshot) return [];
	const activeKeys = new Set(activeSnapshot.authStores.map((entry) => entry.databasePath));
	return listOwnedRuntimeAuthProfileStoreSnapshots().filter((entry) => activeKeys.has(entry.databasePath));
}
function registerProviderAuthRuntimeSnapshotActivationOwner(owner) {
	providerAuthActivation = async (params) => await owner.runExclusive(async () => {
		if (!owner.isCurrent(params.snapshot, params.expectedRevision)) return false;
		try {
			owner.assertValid(params.snapshot);
			if (!params.activateSnapshotIfCurrent()) return false;
			await owner.publish(params.snapshot);
			return true;
		} catch (error) {
			return owner.onError(error, params.snapshot);
		}
	});
}
async function activateProviderAuthRuntimeSnapshot(params) {
	return providerAuthActivation ? await providerAuthActivation(params) : params.activateSnapshotIfCurrent();
}
/**
* Clears active secrets runtime state and all linked config/auth/web-tool snapshots.
*/
function clearSecretsRuntimeSnapshotState() {
	activeSnapshotRevision += 1;
	activeSnapshotLineageStartRevision = 0;
	activeSnapshotLineageAuthStores = [];
	activeSnapshotLineageAuthMutations = {};
	activeSnapshot = null;
	activeRefreshContext = null;
	clearActiveRuntimeWebToolsMetadata();
	setActiveDegradedSecretOwners([]);
	clearActiveCredentialDegradedOwners();
	setRuntimeConfigSnapshotRefreshHandler(null);
	clearRuntimeConfigSnapshot();
	clearRuntimeAuthProfileStoreSnapshots();
	clearAuthProfileMigrationDiagnostics();
	providerAuthActivation = null;
}
//#endregion
export { getActiveRuntimeWebToolsMetadataFromState as S, registerProviderAuthRuntimeSnapshotActivationOwner as _, collectSecretStoreRefKeysInSnapshot as a, setPreparedSecretsRuntimeSnapshotRefreshContext as b, getActiveSecretsRuntimeRefreshContext as c, getPreparedSecretsRuntimeSnapshotRefreshContext as d, graftActiveSecretsRuntimeAuthState as f, hasSameSecretReloadContract as g, hasSameSecretProviderDefinition as h, clearSecretsRuntimeSnapshotState as i, getActiveSecretsRuntimeSnapshotRevisionState as l, hasCurrentAuthStoreCredentialsRevision as m, activateSecretsRuntimeSnapshotState as n, getActiveSecretsRuntimeConfigSnapshot as o, hasActiveSecretsRuntimeSnapshotLineage as p, activateSecretsRuntimeSnapshotStateIfCurrent as r, getActiveSecretsRuntimeEnvState as s, activateProviderAuthRuntimeSnapshot as t, getActiveSecretsRuntimeSnapshotState as u, restoreSecretsRuntimeSnapshotStateIfCurrent as v, setSecretsRuntimeSourceSnapshotIfCurrent as x, restoreSecretsRuntimeSourceSnapshotIfLineageCurrent as y };
