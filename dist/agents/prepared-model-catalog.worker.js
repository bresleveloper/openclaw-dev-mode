import { t as AsyncWorkScope } from "../async-work-scope-BH2yUdBz.mjs";
import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { r as normalizeProviderId } from "../provider-id-D1VImdKk.mjs";
import { t as freezeJsonSnapshot } from "../immutable-data-DqJSDH8t.mjs";
import { n as normalizeAgentId } from "../agent-id-D1-Q6vR4.mjs";
import { t as _usingCtx } from "../usingCtx-BhiZp_rS.mjs";
import { O as setRuntimeConfigSnapshot } from "../runtime-snapshot-BBYDJbw9.mjs";
import { u as withRemoteModelCatalogSnapshot } from "../remote-overlay-ClWDV070.mjs";
import { b as normalizePluginsConfigWithResolverCore } from "../config-state-DkDfCu7E.mjs";
import { p as restoreConfigResolutionFacts, r as copyConfigResolutionFacts } from "../resolution-facts-D_pto3MV.mjs";
import "../session-key-CSDERtm3.mjs";
import { M as resolveRegisteredAgentIdForDir, N as unregisterResolvedAgentDir, j as registerResolvedAgentDir } from "../agent-scope-config-fjA2T9Gz.mjs";
import { m as restorePluginMetadataSnapshot } from "../plugin-metadata-snapshot-DET-4y9k.mjs";
import { h as withWorkerAuthProfileWrites, i as captureAuthProfileCredentialCommits } from "../user-model-account-authority-DFFjC5J5.mjs";
import { u as mergeRuntimeExternalProfileReferences } from "../persisted-DbIYEoQ3.mjs";
import { i as noteCommittedSharedAuthStoreOwnership } from "../path-resolve-21Orzn6B.mjs";
import { O as replaceRuntimeAuthProfileStoreSnapshotsAsync, W as preserveResolvedSecretBackedCredentials } from "../runtime-snapshots-HRosak4u.mjs";
import { A as withPluginSourceCaptureDirectory, l as nativeReferenceProgress } from "../plugin-generation-source-lookup-CdHM-XG_.mjs";
import { n as withPluginRuntimeGenerationScope } from "../generation-scope-CwTBwQp1.mjs";
import { n as isManifestPluginAvailableForControlPlane } from "../manifest-contract-eligibility-BO9Yzg8f.mjs";
import { t as createModelCatalogIdentityKeyResolver } from "../openai-model-routes-BJEokkWC.mjs";
import { n as getPluginRegistryInspectionResources } from "../registry-inspection-resources-COvkPmap.mjs";
import { n as modelCatalogRouteVariantKey, r as modelCatalogRowToEntry } from "../model-catalog-entry-BWd5zbsm.mjs";
import { t as createPreparedModelCatalogProviderNormalizer } from "../model-catalog-provider-normalizer-C4C-simP.mjs";
import "../store-BPXZsh12.mjs";
import { r as listExternalCliSyncProviderIds } from "../external-cli-sync-Bmw7gpgm.mjs";
import { t as manifestPluginResolvesRuntimeModelCatalogAugment } from "../providers-3h1HIigh.mjs";
import { g as loadAuthProfileStoreWithoutExternalProfilesAsync } from "../store-runtime-CwqGD12G.mjs";
import { c as resolveAuthStorePathForDisplay } from "../oauth-refresh-fence-eL04wGfj.mjs";
import { n as PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS } from "../model-catalog-timeouts-CWTmGWX-.mjs";
import { r as planRuntimePluginDiscovery } from "../provider-discovery-VU-K7aKK.mjs";
import { U as restorePreparedSyntheticAuthFacts } from "../provider-runtime-DZ8luukj.mjs";
import { i as resolveRuntimeSyntheticAuthProviderRefs, t as listManifestSyntheticAuthProviderRefs } from "../synthetic-auth.runtime-bSBw_Wwj.mjs";
import { c as PreparedModelRuntimeBuildResources, h as resolveUsableAgentCredentialModes, m as resolveAgentCredentialMapFromStore, n as ownPreparedPluginGeneration, p as resolveAmbientAgentCredentialsForDiscovery, s as retainPreparedPluginRegistry } from "../prepared-model-runtime.plugin-lifetime-Ck5dh_-n.mjs";
import { t as AuthStorage } from "../auth-storage-DHC97REI.mjs";
import { s as withClawInstallSchemaVersionFacts } from "../provenance-runtime-read-CG_KY8mE.mjs";
import { n as withHandedOffCodexClientVersion } from "../codex-client-version-handoff.internal-vuk-sgi8.mjs";
import { a as scopeSyntheticAuthProviderRefs } from "../prepared-model-runtime.synthetic-auth-DP743ZrF.mjs";
import { n as fingerprintPreparedModelCatalogPluginContext, r as fingerprintPreparedModelWorkerRequest, t as fingerprintPreparedModelCatalogGeneration } from "../prepared-model-catalog-fingerprints-CRgbrGfC.mjs";
import { n as prepareModelCatalogAuthLabels } from "../model-catalog-auth-labels-BDvpEt70.mjs";
import { t as captureProviderCatalogExpiries } from "../provider-catalog-expiry-DuDh5VRN.mjs";
import { i as resolveImplicitProviderDiscoveryScope, t as prepareImplicitProviderStaticCatalog } from "../models-config.providers.implicit-B8ZOw1Dx.mjs";
import { t as prepareOwnedPluginLoadContext } from "../prepared-model-runtime.plugin-context-B8bOw2w5.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-sMsYUF1K.mjs";
import { n as overlayExternalAuthProfiles } from "../external-auth-runtime-CBrZBOFR.mjs";
import { parentPort, workerData } from "node:worker_threads";
//#region src/agents/prepared-model-catalog.worker.ts
/** Worker-thread entrypoint for complete model-catalog discovery. */
async function refreshAuthStore(params) {
	const durable = preserveResolvedSecretBackedCredentials({
		next: await loadAuthProfileStoreWithoutExternalProfilesAsync(params.agentDir, {
			allowKeychainPrompt: false,
			...params.inheritedAuthDir ? { inheritedAuthDir: params.inheritedAuthDir } : {}
		}),
		existing: params.authStore
	});
	const persistedProfileIds = new Set(params.authStore.runtimePersistedProfileIds ?? []);
	const externalProfileIds = new Set(params.authStore.runtimeExternalProfileIds ?? []);
	for (const [profileId, credential] of Object.entries(params.authStore.profiles)) if (!persistedProfileIds.has(profileId) && !externalProfileIds.has(profileId) && durable.profiles[profileId] === void 0) durable.profiles[profileId] = credential;
	const prepared = mergeRuntimeExternalProfileReferences({
		next: durable,
		existing: params.authStore
	});
	return withPluginRuntimeGenerationScope({
		metadataSnapshot: params.pluginGeneration.pluginMetadataSnapshot,
		pluginRegistry: params.pluginGeneration.pluginRegistry
	}, () => overlayExternalAuthProfiles(prepared, {
		config: params.config,
		env: params.env,
		...params.providerIds ? { externalCliProviderIds: params.providerIds } : {},
		...params.profileIds ? { externalCliProfileIds: params.profileIds } : {},
		allowKeychainPrompt: false
	}));
}
function restoreWorkerConfig(value) {
	restoreConfigResolutionFacts(value.input.config, value.configResolutionFacts);
	if (value.sourceConfigResolutionFacts === value.configResolutionFacts) copyConfigResolutionFacts(value.input.config, value.sourceConfigForSecrets);
	else restoreConfigResolutionFacts(value.sourceConfigForSecrets, value.sourceConfigResolutionFacts);
	setRuntimeConfigSnapshot(value.input.config, value.sourceConfigForSecrets);
}
async function prepareWorkerGeneration(value, previous, pluginIds) {
	try {
		var _usingCtx$1 = _usingCtx();
		const metadata = previous?.pluginGeneration.pluginMetadataSnapshot ?? restorePluginMetadataSnapshot(value.pluginMetadataSnapshot);
		const normalizedConfig = normalizePluginsConfigWithResolverCore(value.input.config.plugins, metadata.normalizePluginId);
		const basePluginIds = pluginIds ?? metadata.plugins.filter((plugin) => manifestPluginResolvesRuntimeModelCatalogAugment(plugin) && isManifestPluginAvailableForControlPlane({
			snapshot: metadata,
			plugin,
			config: value.input.config,
			normalizedConfig,
			...value.input.env ? { env: value.input.env } : {}
		})).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
		const pluginRegistry = await _usingCtx$1.a(new PreparedModelRuntimeBuildResources(retainPreparedPluginRegistry)).load({
			...value.input,
			metadataSnapshot: metadata,
			preferBuiltPluginArtifacts: value.preferBuiltPluginArtifacts,
			basePluginIds,
			reusableRegistry: previous?.pluginGeneration.pluginRegistry,
			purpose: "model-catalog"
		}, () => {});
		prepareOwnedPluginLoadContext(value.input, value.input.env, pluginRegistry, metadata, value.preferBuiltPluginArtifacts);
		const pluginGeneration = Object.freeze({
			...previous?.pluginGeneration,
			remoteCatalog: value.remoteCatalog,
			pluginMetadataSnapshot: metadata,
			pluginRegistry,
			preparedStaticProviderCatalog: void 0,
			preferBuiltPluginArtifacts: value.preferBuiltPluginArtifacts
		});
		return {
			pluginGeneration,
			pluginIds: /* @__PURE__ */ new Set([...basePluginIds, ...pluginRegistry.plugins.map((plugin) => plugin.id)]),
			staticProviderIds: previous?.staticProviderIds ?? /* @__PURE__ */ new Set(),
			release: ownPreparedPluginGeneration(pluginGeneration).retain()
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
async function runCatalogRequest(value, request, work, prepareGeneration, beginDiscovery) {
	const directoryOwner = value.input.agentId ? {
		agentId: value.input.agentId,
		agentDir: value.input.agentDir,
		env: value.input.env
	} : void 0;
	let registeredDirectoryOwner = false;
	let prepared;
	let acquiredGeneration;
	try {
		if (value.sharedAuthStoreOwnership) noteCommittedSharedAuthStoreOwnership(value.sharedAuthStoreOwnership, value.input.env);
		if (directoryOwner) {
			registeredDirectoryOwner = registerResolvedAgentDir(directoryOwner);
			if (resolveRegisteredAgentIdForDir(directoryOwner.agentDir, directoryOwner.env) !== normalizeAgentId(directoryOwner.agentId)) throw new Error(`Conflicting registered agent owners for ${directoryOwner.agentDir}`);
		}
		restoreWorkerConfig(value);
		restorePreparedSyntheticAuthFacts(value.input.config, request.syntheticAuth, {
			env: value.input.env,
			workspaceDir: value.input.workspaceDir
		});
		restorePreparedSyntheticAuthFacts(value.input.config, request.syntheticAuth, { workspaceDir: value.input.workspaceDir });
		const generationFingerprint = fingerprintPreparedModelWorkerRequest(value, request);
		prepared = await prepareGeneration();
		const reconstructedFingerprint = fingerprintPreparedModelCatalogGeneration({
			...value,
			preferBuiltPluginArtifacts: prepared.pluginGeneration.preferBuiltPluginArtifacts === true,
			pluginMetadataSnapshot: prepared.pluginGeneration.pluginMetadataSnapshot
		});
		if (reconstructedFingerprint !== value.generationFingerprint) return {
			status: "generation-mismatch",
			generationFingerprint: value.generationFingerprint,
			reconstructedFingerprint
		};
		prepareOwnedPluginLoadContext(value.input, value.input.env, prepared.pluginGeneration.pluginRegistry, prepared.pluginGeneration.pluginMetadataSnapshot, value.preferBuiltPluginArtifacts);
		const pluginGenerationScope = {
			metadataSnapshot: prepared.pluginGeneration.pluginMetadataSnapshot,
			pluginRegistry: prepared.pluginGeneration.pluginRegistry
		};
		const resolveSyntheticCredentials = (providerIds) => withPluginRuntimeGenerationScope(pluginGenerationScope, () => resolveAmbientAgentCredentialsForDiscovery({
			config: value.input.config,
			env: value.input.env,
			authoritativeSyntheticAuthProviderRefs: pluginGenerationScope.metadataSnapshot.owners.cliBackends.keys(),
			syntheticAuthProviderRefs: scopeSyntheticAuthProviderRefs([.../* @__PURE__ */ new Set([
				...listManifestSyntheticAuthProviderRefs(pluginGenerationScope.metadataSnapshot.index),
				...resolveRuntimeSyntheticAuthProviderRefs(),
				...request.syntheticAuth.map(({ providerRef }) => providerRef)
			])], providerIds),
			...value.input.workspaceDir ? { workspaceDir: value.input.workspaceDir } : {}
		}));
		if (request.kind === "auth-refresh") await beginDiscovery();
		const authStore = await refreshAuthStore({
			agentDir: value.input.agentDir,
			inheritedAuthDir: value.input.inheritedAuthDir,
			authStore: value.authStore,
			config: value.input.config,
			env: value.input.env,
			...request.kind === "auth-refresh" && request.profileIds ? { profileIds: request.profileIds } : {},
			providerIds: request.providerIds ?? listExternalCliSyncProviderIds(),
			pluginGeneration: prepared.pluginGeneration
		});
		if (request.kind === "catalog") await replaceRuntimeAuthProfileStoreSnapshotsAsync([{
			agentDir: value.input.agentDir,
			store: authStore
		}]);
		const credentials = {
			...resolveSyntheticCredentials(request.providerIds ?? value.providerIds),
			...resolveAgentCredentialMapFromStore(authStore, { config: value.input.config })
		};
		if (request.kind === "auth-refresh") return {
			status: "ok",
			kind: "auth-refresh",
			generationFingerprint,
			authStore,
			credentials,
			authModes: resolveUsableAgentCredentialModes(credentials)
		};
		const { prepareAgentCatalogSource } = await import("../prepared-model-runtime.scoped-catalog-7EEsh-LF.mjs");
		const { prepareFullCatalogFacts } = await import("../prepared-model-runtime.full-catalog-D9A8FFQi.mjs");
		const startupProviderIds = new Set(value.providerIds.map(normalizeProviderId));
		const exactAgentFacts = {
			...value.catalogFacts,
			input: value.input,
			env: value.input.env,
			templateAuthStorage: AuthStorage.inMemory(credentials),
			credentials,
			providerIds: [...new Set(request.providerIds ?? [...value.providerIds, ...Object.keys(credentials)])].toSorted((left, right) => left.localeCompare(right))
		};
		const { pluginMetadataSnapshot } = prepared.pluginGeneration;
		const discoveryPluginIds = [...resolveImplicitProviderDiscoveryScope({
			config: value.input.config,
			env: value.input.env,
			workspaceDir: value.input.workspaceDir,
			pluginMetadataSnapshot,
			providerDiscoveryProviderIds: [.../* @__PURE__ */ new Set([
				...value.providerIds,
				...Object.keys(credentials),
				...exactAgentFacts.providerIds
			])]
		})?.keys() ?? []];
		const discoveryPlan = await withPluginRuntimeGenerationScope(pluginGenerationScope, () => planRuntimePluginDiscovery({
			config: value.input.config,
			env: value.input.env,
			workspaceDir: value.input.workspaceDir,
			pluginMetadataSnapshot,
			onlyPluginIds: discoveryPluginIds
		}));
		let catalogGeneration = prepared.pluginGeneration;
		if (discoveryPlan.kind === "runtime") {
			const pluginIds = [.../* @__PURE__ */ new Set([...prepared.pluginIds, ...discoveryPlan.pluginIds ?? discoveryPluginIds])].toSorted();
			if (pluginIds.length > prepared.pluginIds.size) {
				acquiredGeneration = await prepareWorkerGeneration(value, prepared, pluginIds);
				catalogGeneration = acquiredGeneration.pluginGeneration;
				pluginGenerationScope.pluginRegistry = catalogGeneration.pluginRegistry;
			}
		}
		const staticOwner = acquiredGeneration ?? prepared;
		await beginDiscovery();
		const staticProviderIds = /* @__PURE__ */ new Set([...staticOwner.staticProviderIds, ...exactAgentFacts.providerIds]);
		if (!catalogGeneration.preparedStaticProviderCatalog || staticProviderIds.size > staticOwner.staticProviderIds.size) {
			staticOwner.pluginGeneration = Object.freeze({
				...catalogGeneration,
				preparedStaticProviderCatalog: await withPluginRuntimeGenerationScope(pluginGenerationScope, () => prepareImplicitProviderStaticCatalog({
					config: value.input.config,
					env: value.input.env,
					workspaceDir: value.input.workspaceDir,
					pluginMetadataSnapshot,
					providerDiscoveryProviderIds: [...staticProviderIds]
				}))
			});
			staticOwner.staticProviderIds = staticProviderIds;
		}
		catalogGeneration = staticOwner.pluginGeneration;
		const { value: source, providerExpiries, providerModels } = await captureProviderCatalogExpiries(() => prepareAgentCatalogSource(exactAgentFacts, catalogGeneration, "live", false, {
			authStore,
			providerDiscoveryProviderIds: request.providerIds,
			providerDiscoveryTimeoutMs: PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS
		}), { refresh: request.refresh });
		const facts = await prepareFullCatalogFacts(exactAgentFacts, catalogGeneration, "live", source, {
			includeNative: false,
			providerIds: request.providerIds
		});
		const catalogCredentials = {
			...resolveSyntheticCredentials([...facts.modelCatalog.entries, ...facts.modelCatalog.routeVariants].map((entry) => entry.provider).filter((provider) => !request.providerIds || request.providerIds.includes(normalizeProviderId(provider))).filter((provider) => !startupProviderIds.has(normalizeProviderId(provider)))),
			...credentials
		};
		const runtimeModels = /* @__PURE__ */ new Map();
		const { catalogModels } = facts;
		const hookRows = withPluginRuntimeGenerationScope(pluginGenerationScope, () => {
			const normalizeProvider = createPreparedModelCatalogProviderNormalizer(pluginMetadataSnapshot, value.input.config, value.input.env);
			const keyOf = createModelCatalogIdentityKeyResolver();
			const accepted = new Set([...providerModels].flatMap(([provider, ids]) => [...ids].map((id) => keyOf({
				provider: normalizeProvider(provider),
				id
			}))));
			const rows = /* @__PURE__ */ new Map();
			for (const model of catalogModels) {
				const provider = normalizeProvider(model.provider);
				const key = keyOf({
					provider,
					id: model.id
				});
				if (!accepted.has(key)) continue;
				const keys = rows.get(provider) ?? /* @__PURE__ */ new Set();
				keys.add(modelCatalogRouteVariantKey(modelCatalogRowToEntry(model), key));
				rows.set(provider, keys);
			}
			return rows;
		});
		for (const model of catalogModels) {
			const provider = normalizeProviderId(model.provider);
			const models = runtimeModels.get(provider) ?? [];
			models.push(model);
			runtimeModels.set(provider, models);
		}
		for (const outcome of facts.modelCatalog.providerOutcomes ?? []) {
			const provider = normalizeProviderId(outcome.provider);
			if (!runtimeModels.has(provider)) runtimeModels.set(provider, []);
		}
		const authLabelProviders = [
			...exactAgentFacts.providerIds,
			...Object.keys(catalogCredentials),
			...Object.keys(value.input.config.models?.providers ?? {}),
			...facts.modelCatalog.entries.map((entry) => entry.provider),
			...facts.modelCatalog.routeVariants.map((entry) => entry.provider),
			...(facts.modelCatalog.staticEntries ?? []).map((entry) => entry.provider),
			...Object.values(authStore.profiles).map((profile) => profile.provider)
		];
		const result = {
			status: "ok",
			kind: "catalog",
			generationFingerprint,
			snapshot: facts.modelCatalog,
			runtimeModels,
			providerExpiries,
			hookRows,
			configuredRuntimeModels: facts.configuredRuntimeModels,
			credentials: catalogCredentials,
			providerAuthLabels: authLabelProviders.length === 0 ? /* @__PURE__ */ new Map() : withPluginRuntimeGenerationScope(pluginGenerationScope, () => prepareModelCatalogAuthLabels({
				config: value.input.config,
				agentDir: value.input.agentDir,
				authStorePath: resolveAuthStorePathForDisplay(value.input.agentDir),
				workspaceDir: value.input.workspaceDir,
				env: value.input.env,
				store: authStore,
				providers: authLabelProviders
			})),
			authStore,
			authModes: resolveUsableAgentCredentialModes(catalogCredentials)
		};
		work.beginClose();
		await work.runWhenIdle(() => void 0);
		if (acquiredGeneration) {
			const successor = getPluginRegistryInspectionResources(acquiredGeneration.pluginGeneration.pluginRegistry);
			if (!successor) throw new Error("Catalog scope growth has no inspection resource owner");
			successor.adoptRetainedRegistrations(prepared.pluginGeneration.pluginRegistry);
			const releasePrevious = prepared.release;
			Object.assign(prepared, acquiredGeneration);
			acquiredGeneration = void 0;
			await releasePrevious();
		}
		return result;
	} catch (error) {
		return {
			status: "failed",
			error: error instanceof Error ? error.message : String(error)
		};
	} finally {
		try {
			work.beginClose();
			await work.runWhenIdle(() => void 0);
			await acquiredGeneration?.release();
		} finally {
			await work.drain();
			if (directoryOwner && registeredDirectoryOwner) unregisterResolvedAgentDir(directoryOwner);
		}
	}
}
function isStringArray(value) {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function isWorkerRequest(value) {
	return isRecord(value) && Array.isArray(value.syntheticAuth) && isRecord(value.clawInstallSchemaVersions) && typeof value.clawInstallSchemaVersions.path === "string" && isRecord(value.clawInstallSchemaVersions.snapshot) && (value.codexClientVersion === void 0 || typeof value.codexClientVersion === "string") && (value.kind === "catalog" && (value.refresh === void 0 || typeof value.refresh === "boolean") && (value.providerIds === void 0 || isStringArray(value.providerIds)) || value.kind === "auth-refresh" && isStringArray(value.providerIds) && (value.profileIds === void 0 || isStringArray(value.profileIds)));
}
if (parentPort) {
	const data = workerData;
	const contexts = /* @__PURE__ */ new Map();
	serveWorkerTasks(async (input, channel) => {
		const { value, request } = input;
		if (!isRecord(value) || !isWorkerRequest(request)) throw new Error("invalid prepared model catalog worker request");
		let reportAfter = 0;
		let reportedPlugin;
		const reportProgress = (notification) => {
			const progress = notification;
			const now = performance.now();
			if (now >= reportAfter || progress.pluginId !== reportedPlugin) {
				reportAfter = now + 1e3;
				reportedPlugin = progress.pluginId;
				channel?.notify(progress);
			}
		};
		nativeReferenceProgress.subscribe(reportProgress);
		const stopProgress = () => nativeReferenceProgress.unsubscribe(reportProgress);
		return withRemoteModelCatalogSnapshot(freezeJsonSnapshot(value.remoteCatalog), () => withPluginSourceCaptureDirectory(data.sourceCaptureDirectory, async () => {
			const { result: outcome, receipts: authCredentials } = await captureAuthProfileCredentialCommits(async () => {
				const workspaceDir = value.pluginMetadataSnapshot.workspaceDir ?? value.input.workspaceDir;
				let previous = contexts.get(workspaceDir);
				const fingerprint = fingerprintPreparedModelCatalogPluginContext(value);
				let attempted;
				let replacing = false;
				try {
					const work = new AsyncWorkScope();
					const result = await withWorkerAuthProfileWrites(value.input.env, work, () => withClawInstallSchemaVersionFacts(request.clawInstallSchemaVersions, () => withHandedOffCodexClientVersion(request.codexClientVersion, () => work.run(() => runCatalogRequest(value, request, work, async () => {
						if (previous?.fingerprint === fingerprint) return previous.prepared;
						replacing = true;
						return attempted = await prepareWorkerGeneration(value);
					}, async () => {
						stopProgress();
						const response = await channel?.request(null);
						response?.consumed();
						if (response && response.input !== true) throw new Error("prepared model catalog request retired before discovery");
					})))));
					if (attempted && result.status === "ok") {
						contexts.set(workspaceDir, {
							fingerprint,
							prepared: attempted
						});
						attempted = void 0;
						replacing = false;
						await previous?.prepared.release();
						previous = void 0;
					}
					return result;
				} finally {
					try {
						if (replacing) {
							contexts.delete(workspaceDir);
							await previous?.prepared.release();
						}
					} finally {
						await attempted?.release();
					}
				}
			});
			return {
				...outcome,
				authCredentials
			};
		}, data.sourceCaptureManagedRoot)).finally(stopProgress);
	});
}
//#endregion
export {};
