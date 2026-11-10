import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { _ as secretRefKey } from "./ref-contract-Bfd9_-Lp.mjs";
import { h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { a as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot, s as getRuntimeConfigSnapshotMetadata } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as copyConfigResolutionFactsExcept, t as cloneConfigWithResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import { h as copyCanonicalAuthProfileCredentialObservations } from "./oauth-shared-CiaJlx_D.mjs";
import { l as getOrLoadAgentDeletionJournalStatus } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { _ as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-CeDA0ojh.mjs";
import { _ as resolveAuthProfileDatabaseOwnerId, v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { o as prepareSharedAuthStoreOwnership } from "./path-resolve-21Orzn6B.mjs";
import { l as markAuthProfileMigrationRequired, t as AuthProfileMigrationRequiredError } from "./legacy-source-diagnostic-CLlkIevG.mjs";
import { U as prepareRuntimeAuthProfileStoreSnapshots, c as getRuntimeAuthProfileStoreCredentialsRevision, m as getRuntimeAuthProfileStoreSnapshotsRevision, w as registerRuntimeAuthProfileExternalRefresh } from "./runtime-snapshots-HRosak4u.mjs";
import { _ as prepareSecretsRuntimeSnapshotRestoreState, b as setPreparedSecretsRuntimeSnapshotRefreshContext, c as getActiveSecretsRuntimeSnapshotRevisionState, d as graftActiveSecretsRuntimeAuthState, f as hasActiveSecretsRuntimeAuthStorePath, g as prepareSecretsRuntimeDisplaySnapshot, l as getActiveSecretsRuntimeSnapshotState, n as activateSecretsRuntimeSnapshotState, r as activateSecretsRuntimeSnapshotStateIfCurrent, s as getActiveSecretsRuntimeRefreshContext, t as activateProviderAuthRuntimeSnapshot, u as getPreparedSecretsRuntimeSnapshotRefreshContext } from "./runtime-state-DDDhACod.mjs";
import { f as loadAuthProfileStoreForRuntimeAsync, g as loadAuthProfileStoreWithoutExternalProfilesAsync } from "./store-runtime-CwqGD12G.mjs";
import { t as listAuthProfileSecretOwnerIds } from "./runtime-auth-profile-owner-VtWriAt2.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { i as mergeSecretsRuntimeEnv, n as collectCandidateAgentDirs, o as resolveRefreshAgentDirs, r as createEmptyRuntimeWebToolsMetadata, t as canUseSecretsRuntimeFastPath } from "./runtime-fast-path-CARcjjAr.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/secrets/runtime-auth-store-admission.ts
async function loadAdmittedAuthStores(params) {
	const authStores = [];
	const degradedOwners = [];
	const statePath = resolveOpenClawStateSqlitePath(params.env);
	for (const agentDir of params.agentDirs) {
		const databasePath = resolveAuthProfileDatabasePath(agentDir);
		const agentId = resolveAuthProfileDatabaseOwnerId(agentDir);
		const isDeleted = () => {
			const status = getOrLoadAgentDeletionJournalStatus(statePath, agentId, () => void 0);
			return status === "pending" || status === "complete";
		};
		if (isDeleted()) continue;
		const refusal = readAgentDatabaseAdmissionRefusal(agentId, { env: params.env });
		if (refusal?.paths.some((pathname) => isSameOpenClawAgentDatabasePath(pathname, databasePath))) {
			if (refusal.code === "agent-database-inspection-pending") continue;
			degradedOwners.push({
				ownerKind: "route",
				ownerId: shortenHomePath(databasePath),
				state: "unavailable",
				degradationState: "cold",
				paths: [databasePath],
				refKeys: [],
				reason: `${refusal.reason}\n${refusal.repairHint}`
			});
			continue;
		}
		try {
			const source = await params.loadAuthStore(agentDir);
			if (isDeleted()) continue;
			const store = structuredClone(source);
			copyCanonicalAuthProfileCredentialObservations(source.profiles, store.profiles);
			authStores.push({
				agentDir,
				store
			});
		} catch (error) {
			if (isDeleted()) continue;
			if (!(error instanceof AuthProfileMigrationRequiredError) || !params.allowUnavailable) throw error;
			markAuthProfileMigrationRequired(agentDir, error);
			authStores.push({
				agentDir,
				store: {
					version: 1,
					profiles: {}
				}
			});
			degradedOwners.push({
				ownerKind: "route",
				ownerId: error.ownerId,
				state: "unavailable",
				degradationState: "cold",
				paths: error.sourceKinds.map((kind) => `auth-profile-legacy:${kind}`),
				refKeys: [],
				reason: "auth profile migration required"
			});
		}
	}
	return {
		authStores,
		degradedOwners
	};
}
//#endregion
//#region src/secrets/runtime-provider-auth-warnings.ts
function isProviderAuthRuntimeWarning(warning) {
	return warning.path.startsWith("models.providers.") || warning.path.startsWith("models.providers[") || warning.path.includes(".auth-profiles.");
}
function mergeProviderAuthRuntimeWarnings(activeWarnings, candidateWarnings) {
	return [...activeWarnings.filter((warning) => !isProviderAuthRuntimeWarning(warning)), ...candidateWarnings.filter(isProviderAuthRuntimeWarning)];
}
//#endregion
//#region src/secrets/runtime.ts
/** Prepares secrets runtime snapshots from config, auth stores, plugins, and env. */
const loadRuntimeManifestHelpers = createLazyRuntimeModule(() => import("./runtime-manifest.runtime.js"));
const loadRuntimePrepareHelpers = createLazyRuntimeModule(() => import("./runtime-prepare.runtime.js"));
const loadRuntimeOwnerAssignmentHelpers = createLazyRuntimeModule(() => import("./runtime-owner-assignments-9y3wWEwj.mjs"));
function loadSecretsRuntimeAuthStore(agentDir) {
	return loadAuthProfileStoreForRuntimeAsync(agentDir, {
		readOnly: true,
		allowKeychainPrompt: false
	});
}
async function resolveLoadablePluginOrigins(params) {
	const { listPluginOriginsFromMetadataSnapshot } = await loadRuntimeManifestHelpers();
	return listPluginOriginsFromMetadataSnapshot(params.plugins);
}
function shouldLoadPluginMetadataForSecrets(config) {
	const entries = config.plugins?.entries;
	if (isRecord(entries) && Object.keys(entries).length > 0) return true;
	const channels = config.channels;
	if (isRecord(channels) && Object.keys(channels).some((channelId) => channelId !== "defaults")) return true;
	const providers = config.secrets?.providers;
	return isRecord(providers) && Object.values(providers).some((provider) => provider?.source === "exec" && "pluginIntegration" in provider && provider.pluginIntegration !== void 0);
}
/** Prepares a secrets runtime snapshot and records refresh context for later activation. */
async function prepareSecretsRuntimeSnapshot(params) {
	const runtimeEnv = mergeSecretsRuntimeEnv(params.env);
	await prepareSharedAuthStoreOwnership(runtimeEnv);
	const displaySnapshot = !params.assignmentConfig && params.includeConfigRefs !== false && !params.agentDirs && params.explicitAgentDirs === void 0 && !params.loadAuthStore && !params.loadablePluginOrigins && !params.forceColdRefKeys?.size ? prepareSecretsRuntimeDisplaySnapshot({
		config: params.config,
		env: runtimeEnv,
		includeAuthStoreRefs: params.includeAuthStoreRefs ?? true,
		manifestRegistry: params.manifestRegistry ?? params.pluginMetadataSnapshot?.manifestRegistry
	}) : null;
	if (displaySnapshot) return displaySnapshot;
	const authStoreCredentialsRevision = getRuntimeAuthProfileStoreCredentialsRevision();
	const authStoreSnapshotsRevision = getRuntimeAuthProfileStoreSnapshotsRevision();
	const sourceConfig = cloneConfigWithResolutionFacts(params.config);
	const assignmentSourceConfig = cloneConfigWithResolutionFacts(params.assignmentConfig ?? params.config);
	const resolvedConfig = cloneConfigWithResolutionFacts(assignmentSourceConfig);
	const includeConfigRefs = params.includeConfigRefs ?? true;
	const includeAuthStoreRefs = params.includeAuthStoreRefs ?? true;
	let authStores = [];
	const fastPathLoadAuthStore = params.loadAuthStore ?? loadAuthProfileStoreWithoutExternalProfilesAsync;
	const candidateDirs = params.agentDirs?.length ? uniqueStrings(params.agentDirs.map((entry) => resolveUserPath(entry, runtimeEnv))) : collectCandidateAgentDirs(resolvedConfig, runtimeEnv);
	const explicitAgentDirs = params.explicitAgentDirs !== void 0 ? params.explicitAgentDirs && [...params.explicitAgentDirs] : params.agentDirs?.length ? [...candidateDirs] : null;
	let migrationDegradedOwners = [];
	if (includeAuthStoreRefs) {
		const loaded = await loadAdmittedAuthStores({
			agentDirs: candidateDirs,
			env: runtimeEnv,
			loadAuthStore: fastPathLoadAuthStore,
			allowUnavailable: params.allowUnavailableSecretOwners === true
		});
		authStores = loaded.authStores;
		migrationDegradedOwners = loaded.degradedOwners;
	}
	if (canUseSecretsRuntimeFastPath({
		sourceConfig: includeConfigRefs ? assignmentSourceConfig : {},
		authStores
	})) {
		const manifestRegistry = params.manifestRegistry ?? params.pluginMetadataSnapshot?.manifestRegistry;
		const snapshot = {
			sourceConfig,
			config: resolvedConfig,
			authStores: prepareRuntimeAuthProfileStoreSnapshots(authStores, runtimeEnv),
			authStoreCredentialsRevision,
			authStoreSnapshotsRevision,
			warnings: [],
			degradedOwners: migrationDegradedOwners,
			secretOwners: [],
			webTools: createEmptyRuntimeWebToolsMetadata()
		};
		setPreparedSecretsRuntimeSnapshotRefreshContext(snapshot, {
			env: runtimeEnv,
			explicitAgentDirs,
			includeConfigRefs,
			includeAuthStoreRefs,
			loadAuthStore: fastPathLoadAuthStore,
			loadablePluginOrigins: params.loadablePluginOrigins ?? /* @__PURE__ */ new Map(),
			...manifestRegistry ? { manifestRegistry } : {}
		});
		return snapshot;
	}
	const { collectAuthStoreAssignments, collectConfigAssignments, createResolverContext, resolveRuntimeWebTools } = await loadRuntimePrepareHelpers();
	const { listSecretAssignmentOwners, resolveAndApplySecretAssignments } = await loadRuntimeOwnerAssignmentHelpers();
	let manifestRegistry = params.manifestRegistry ?? params.pluginMetadataSnapshot?.manifestRegistry;
	if (!manifestRegistry && shouldLoadPluginMetadataForSecrets(sourceConfig)) {
		const { resolveConfigWidePluginManifestRegistry } = await loadRuntimeManifestHelpers();
		manifestRegistry = resolveConfigWidePluginManifestRegistry({
			config: sourceConfig,
			env: runtimeEnv
		});
	}
	const loadablePluginOrigins = params.loadablePluginOrigins ?? (manifestRegistry ? await resolveLoadablePluginOrigins({ plugins: manifestRegistry }) : /* @__PURE__ */ new Map());
	const context = createResolverContext({
		sourceConfig,
		env: runtimeEnv,
		...manifestRegistry ? { manifestRegistry } : {}
	});
	if (includeConfigRefs) await collectConfigAssignments({
		config: resolvedConfig,
		context,
		loadablePluginOrigins
	});
	if (includeAuthStoreRefs) {
		const loadAuthStore = params.loadAuthStore ?? loadSecretsRuntimeAuthStore;
		if (!params.loadAuthStore) {
			const loaded = await loadAdmittedAuthStores({
				agentDirs: candidateDirs,
				env: runtimeEnv,
				loadAuthStore,
				allowUnavailable: params.allowUnavailableSecretOwners === true
			});
			authStores = loaded.authStores;
			migrationDegradedOwners = loaded.degradedOwners;
		}
		for (const entry of authStores) collectAuthStoreAssignments({
			store: entry.store,
			context,
			agentDir: entry.agentDir
		});
	}
	const assignmentResolution = context.assignments.length > 0 ? await resolveAndApplySecretAssignments({
		assignments: context.assignments,
		context,
		allowOwnerIsolation: params.allowUnavailableSecretOwners,
		options: {
			config: sourceConfig,
			env: context.env,
			cache: context.cache,
			manifestRegistry: context.manifestRegistry
		},
		forceColdRefKeys: params.forceColdRefKeys
	}) : {
		degradedOwners: [],
		resolvedValues: /* @__PURE__ */ new Map()
	};
	copyConfigResolutionFactsExcept(assignmentSourceConfig, resolvedConfig, context.assignments.filter((assignment) => assignmentResolution.resolvedValues.has(secretRefKey(assignment.ref))).map((assignment) => assignment.path));
	const assignmentSecretOwners = listSecretAssignmentOwners(context.assignments, assignmentResolution.resolvedValues);
	const webTools = includeConfigRefs ? await resolveRuntimeWebTools({
		sourceConfig,
		resolvedConfig,
		context,
		allowUnavailableSecretOwners: params.allowUnavailableSecretOwners,
		forceColdRefKeys: params.forceColdRefKeys
	}) : {
		metadata: createEmptyRuntimeWebToolsMetadata(),
		degradedOwners: [],
		secretOwners: []
	};
	const snapshot = {
		sourceConfig,
		config: resolvedConfig,
		authStores: prepareRuntimeAuthProfileStoreSnapshots(authStores, runtimeEnv),
		authStoreCredentialsRevision,
		authStoreSnapshotsRevision,
		warnings: context.warnings,
		degradedOwners: [
			...migrationDegradedOwners,
			...assignmentResolution.degradedOwners,
			...webTools.degradedOwners
		],
		secretOwners: [...assignmentSecretOwners, ...webTools.secretOwners],
		webTools: webTools.metadata
	};
	setPreparedSecretsRuntimeSnapshotRefreshContext(snapshot, {
		env: runtimeEnv,
		explicitAgentDirs,
		includeConfigRefs,
		includeAuthStoreRefs,
		loadAuthStore: params.loadAuthStore ?? loadSecretsRuntimeAuthStore,
		loadablePluginOrigins,
		...manifestRegistry ? { manifestRegistry } : {}
	});
	return snapshot;
}
/** Activates a prepared secrets runtime snapshot for fast runtime lookup. */
function activateSecretsRuntimeSnapshot(snapshot) {
	activateSecretsRuntimeSnapshotState(createSecretsRuntimeSnapshotActivation(snapshot));
}
/** Activates resolved runtime bytes while retaining the distinct raw config source. */
function activateSecretsRuntimeSnapshotWithSource(snapshot, runtimeSourceConfig) {
	activateSecretsRuntimeSnapshotState({
		...createSecretsRuntimeSnapshotActivation(snapshot),
		runtimeSourceConfig
	});
}
/** Compare-and-activate boundary for snapshots prepared from process-wide runtime state. */
function activateSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, options) {
	return activateSecretsRuntimeSnapshotStateIfCurrent({
		...createSecretsRuntimeSnapshotActivation(snapshot),
		expectedRevision,
		preserveActivationLineage: options?.preserveActivationLineage,
		runtimeSourceConfig: options?.runtimeSourceConfig
	});
}
/** Prepares the exact rollback successor before the activation owner publishes it. */
function prepareSecretsRuntimeSnapshotRestore(snapshot, expectedRevision, ownedSnapshot, options) {
	return prepareSecretsRuntimeSnapshotRestoreState({
		...createSecretsRuntimeSnapshotActivation(snapshot),
		expectedRevision,
		ownedSnapshot,
		runtimeSourceConfig: options?.runtimeSourceConfig
	});
}
function coercePreflightRefresh(value, sourceConfig) {
	if (!value || typeof value !== "object") return null;
	const candidate = value;
	return candidate.snapshot && typeof candidate.expectedRevision === "number" && isDeepStrictEqual(candidate.snapshot.sourceConfig, sourceConfig) ? candidate : null;
}
async function prepareActiveSecretsRuntimeRefresh(sourceConfig, includeAuthStoreRefs, snapshotConfig = sourceConfig) {
	const expectedRevision = getActiveSecretsRuntimeSnapshotRevisionState();
	const displaySnapshot = snapshotConfig === sourceConfig ? prepareSecretsRuntimeDisplaySnapshot({
		config: sourceConfig,
		includeAuthStoreRefs
	}) : null;
	if (displaySnapshot) return {
		snapshot: displaySnapshot,
		expectedRevision
	};
	const activeRefreshContext = getActiveSecretsRuntimeRefreshContext();
	if (!getActiveSecretsRuntimeSnapshotState() || !activeRefreshContext) return null;
	return {
		snapshot: await prepareSecretsRuntimeSnapshot({
			config: sourceConfig,
			assignmentConfig: snapshotConfig,
			env: activeRefreshContext.env,
			agentDirs: resolveRefreshAgentDirs(sourceConfig, activeRefreshContext),
			explicitAgentDirs: activeRefreshContext.explicitAgentDirs,
			includeConfigRefs: activeRefreshContext.includeConfigRefs ?? true,
			includeAuthStoreRefs: includeAuthStoreRefs ?? activeRefreshContext.includeAuthStoreRefs,
			loadablePluginOrigins: activeRefreshContext.loadablePluginOrigins,
			...activeRefreshContext.manifestRegistry ? { manifestRegistry: activeRefreshContext.manifestRegistry } : {},
			...activeRefreshContext.loadAuthStore ? { loadAuthStore: activeRefreshContext.loadAuthStore } : {},
			allowUnavailableSecretOwners: true
		}),
		expectedRevision
	};
}
/** Prepares a config-write refresh candidate tied to the current runtime revision. */
async function preflightActiveSecretsRuntimeSnapshotRefresh(params) {
	return await prepareActiveSecretsRuntimeRefresh(params.sourceConfig, params.includeAuthStoreRefs);
}
/** Publishes a config-write refresh after retrying any candidate invalidated while preparing. */
async function refreshActiveSecretsRuntimeSnapshotForConfig(params) {
	let candidate = coercePreflightRefresh(params.preflightResult, params.sourceConfig);
	for (;;) {
		params.assertCurrent?.();
		candidate ??= await prepareActiveSecretsRuntimeRefresh(params.sourceConfig, params.includeAuthStoreRefs);
		if (!candidate) return false;
		const activeRefreshContext = getActiveSecretsRuntimeRefreshContext();
		if (!activeRefreshContext) return false;
		if (params.includeAuthStoreRefs === false && activeRefreshContext.includeAuthStoreRefs) graftActiveSecretsRuntimeAuthState(candidate.snapshot);
		params.assertCurrent?.();
		if (activateSecretsRuntimeSnapshotIfCurrent(candidate.snapshot, candidate.expectedRevision, { runtimeSourceConfig: params.runtimeSourceConfig })) return true;
		candidate = null;
	}
}
function patchResolvedSecretRefLeaves(params) {
	if (parseSecretRef(params.source, params.defaults)) return isDeepStrictEqual(params.current, params.resolved) || isDeepStrictEqual(params.source, params.resolved) ? {
		changed: false,
		value: params.current
	} : {
		changed: true,
		value: params.resolved
	};
	if (Array.isArray(params.source) && Array.isArray(params.resolved)) {
		const next = Array.isArray(params.current) ? [...params.current] : structuredClone(params.resolved);
		let changed = false;
		for (const [index, source] of params.source.entries()) {
			const patch = patchResolvedSecretRefLeaves({
				current: next[index],
				source,
				resolved: params.resolved[index],
				defaults: params.defaults
			});
			if (patch.changed) {
				next[index] = patch.value;
				changed = true;
			}
		}
		return {
			changed,
			value: changed ? next : params.current
		};
	}
	if (isRecord(params.source) && isRecord(params.resolved)) {
		const next = isRecord(params.current) ? { ...params.current } : structuredClone(params.resolved);
		let changed = false;
		for (const [key, source] of Object.entries(params.source)) {
			const patch = patchResolvedSecretRefLeaves({
				current: next[key],
				source,
				resolved: params.resolved[key],
				defaults: params.defaults
			});
			if (patch.changed) {
				next[key] = patch.value;
				changed = true;
			}
		}
		return {
			changed,
			value: changed ? next : params.current
		};
	}
	return {
		changed: false,
		value: params.current
	};
}
function selectProviderAuthConfig(config) {
	return {
		...config.secrets === void 0 ? {} : { secrets: config.secrets },
		...config.models === void 0 ? {} : { models: config.models }
	};
}
function mergeProviderAuthOwners(active, candidate) {
	const activeAuthProfileOwnerIds = listAuthProfileSecretOwnerIds(active.authStores);
	const candidateAuthProfileOwnerIds = listAuthProfileSecretOwnerIds(candidate.authStores);
	const belongsToProviderAuth = (owner, authProfileOwnerIds) => owner.ownerKind === "provider" || owner.ownerKind === "account" && authProfileOwnerIds.has(owner.ownerId);
	const merge = (current = [], next = []) => [...current.filter((owner) => !belongsToProviderAuth(owner, activeAuthProfileOwnerIds)), ...next.filter((owner) => belongsToProviderAuth(owner, candidateAuthProfileOwnerIds))];
	return {
		secretOwners: merge(active.secretOwners, candidate.secretOwners),
		degradedOwners: merge(active.degradedOwners, candidate.degradedOwners)
	};
}
function createSecretsRuntimeSnapshotActivation(snapshot) {
	return {
		snapshot,
		refreshContext: getPreparedSecretsRuntimeSnapshotRefreshContext(snapshot) ?? getActiveSecretsRuntimeRefreshContext() ?? {
			env: { ...process.env },
			explicitAgentDirs: null,
			includeAuthStoreRefs: snapshot.authStores.length > 0,
			loadAuthStore: loadSecretsRuntimeAuthStore,
			loadablePluginOrigins: /* @__PURE__ */ new Map()
		},
		refreshHandler: {
			preflight: preflightActiveSecretsRuntimeSnapshotRefresh,
			refresh: refreshActiveSecretsRuntimeSnapshotForConfig
		}
	};
}
/** Refresh provider credentials without republishing transport-owned config. */
async function refreshActiveProviderAuthRuntimeSnapshot() {
	for (;;) {
		const activeSnapshot = getActiveSecretsRuntimeSnapshotState();
		if (!activeSnapshot) return false;
		const providerAuthConfig = selectProviderAuthConfig(activeSnapshot.sourceConfig);
		const candidate = await prepareActiveSecretsRuntimeRefresh(activeSnapshot.sourceConfig, void 0, providerAuthConfig);
		if (!candidate) return false;
		const runtimeConfig = getRuntimeConfigSnapshot();
		const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
		const runtimeMetadata = getRuntimeConfigSnapshotMetadata();
		if (!runtimeConfig || !runtimeSourceConfig || !runtimeMetadata) return false;
		const config = cloneConfigWithResolutionFacts(runtimeConfig);
		const modelsPatch = patchResolvedSecretRefLeaves({
			current: runtimeConfig.models,
			source: providerAuthConfig.models,
			resolved: candidate.snapshot.config.models,
			defaults: activeSnapshot.sourceConfig.secrets?.defaults
		});
		if (modelsPatch.changed) config.models = modelsPatch.value;
		const refreshedSnapshot = {
			...activeSnapshot,
			config,
			authStores: candidate.snapshot.authStores,
			authStoreCredentialsRevision: candidate.snapshot.authStoreCredentialsRevision,
			authStoreSnapshotsRevision: candidate.snapshot.authStoreSnapshotsRevision,
			warnings: mergeProviderAuthRuntimeWarnings(activeSnapshot.warnings, candidate.snapshot.warnings),
			...mergeProviderAuthOwners(activeSnapshot, candidate.snapshot)
		};
		const activateSnapshotIfCurrent = () => {
			if (getRuntimeConfigSnapshotMetadata()?.revision !== runtimeMetadata.revision) return false;
			return activateSecretsRuntimeSnapshotStateIfCurrent({
				...createSecretsRuntimeSnapshotActivation(refreshedSnapshot),
				expectedRevision: candidate.expectedRevision,
				preserveActivationLineage: true,
				runtimeSourceConfig,
				preserveRuntimeConfigPublication: !modelsPatch.changed
			});
		};
		if (await activateProviderAuthRuntimeSnapshot({
			snapshot: refreshedSnapshot,
			expectedRevision: candidate.expectedRevision,
			activateSnapshotIfCurrent
		})) return true;
	}
}
registerRuntimeAuthProfileExternalRefresh(async (paths) => {
	if (!paths.some(hasActiveSecretsRuntimeAuthStorePath)) return false;
	return refreshActiveProviderAuthRuntimeSnapshot();
});
//#endregion
export { prepareSecretsRuntimeSnapshot as a, refreshActiveSecretsRuntimeSnapshotForConfig as c, preflightActiveSecretsRuntimeSnapshotRefresh as i, activateSecretsRuntimeSnapshotIfCurrent as n, prepareSecretsRuntimeSnapshotRestore as o, activateSecretsRuntimeSnapshotWithSource as r, refreshActiveProviderAuthRuntimeSnapshot as s, activateSecretsRuntimeSnapshot as t };
