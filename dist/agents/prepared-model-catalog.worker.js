import { t as AsyncWorkScope } from "../async-work-scope-CWk2dk1h.mjs";
import { c as isRecord } from "../record-coerce-DItp3I4t.mjs";
import { n as normalizeAgentId } from "../agent-id-GA8mwdTG.mjs";
import { r as normalizeProviderId } from "../provider-id-DCtsDflE.mjs";
import "../session-key-CBvmC8zz.mjs";
import { a as unregisterResolvedAgentDir, i as resolveRegisteredAgentIdForDir, r as registerResolvedAgentDir } from "../agent-dir-registry-QuKJka9m.mjs";
import { p as restoreConfigResolutionFacts, r as copyConfigResolutionFacts } from "../resolution-facts-CSuKIPux.mjs";
import { l as normalizePluginsConfig } from "../config-state-BEAL5gWH.mjs";
import { m as restorePluginMetadataSnapshot } from "../plugin-metadata-snapshot-pEXzzTbU.mjs";
import { i as withPluginSourceCaptureDirectory } from "../plugin-generation-artifact-VyjUi6ei.mjs";
import { n as withPluginRuntimeGenerationScope } from "../generation-scope-DkeaMJw8.mjs";
import { k as setRuntimeConfigSnapshot } from "../runtime-snapshot-DbgWcCyV.mjs";
import { n as isManifestPluginAvailableForControlPlane } from "../manifest-contract-eligibility-D2rgNcZS.mjs";
import { t as _usingCtx } from "../usingCtx-CoYZqMqE.mjs";
import { v as mergeRuntimeExternalProfileReferences } from "../persisted-B486xwB_.mjs";
import { T as listExternalCliSyncProviderIds } from "../store-CTvq6MSF.mjs";
import { C as replaceRuntimeAuthProfileStoreSnapshots } from "../runtime-snapshots-CBozwlR0.mjs";
import { d as preserveResolvedSecretBackedCredentials } from "../runtime-snapshot-owner-BaV0Qukl.mjs";
import { a as listRuntimePluginIdsFromRegistry } from "../active-runtime-registry-k2s7FqfS.mjs";
import { t as manifestPluginResolvesRuntimeModelCatalogAugment } from "../providers-Bx7WoFEI.mjs";
import { l as loadAuthProfileStoreWithoutExternalProfiles } from "../store-runtime-CzCVI_rv.mjs";
import { r as planRuntimePluginDiscovery } from "../provider-discovery-gl0uPs1A.mjs";
import { F as resolveAmbientAgentCredentialsForDiscovery, I as resolveAgentCredentialMapFromStore, L as resolveUsableAgentCredentialModes, f as retainPreparedPluginRegistry, o as discardPreparedPluginGeneration, p as PreparedModelRuntimeBuildResources, s as ownPreparedPluginGeneration } from "../prepared-model-runtime.plugin-generation-BFxNT_by.mjs";
import { U as restorePreparedSyntheticAuthFacts } from "../provider-runtime-DTb_RnE4.mjs";
import { i as resolveRuntimeSyntheticAuthProviderRefs } from "../synthetic-auth.runtime-DvxRYdyh.mjs";
import { i as AuthStorage } from "../model-registry-BYbYxzIC.mjs";
import { n as prepareModelCatalogAuthLabels } from "../model-catalog-auth-labels-CxJ1bej6.mjs";
import { c as withClawInstallSchemaVersionFacts } from "../provenance-runtime-read-Di4oRDaq.mjs";
import { t as captureProviderCatalogExpiries } from "../provider-catalog-expiry-D85fDr1r.mjs";
import { r as resolveImplicitProviderDiscoveryScope } from "../models-config.providers.implicit-DFrMy5bD.mjs";
import { d as prepareOwnedPluginLoadContext, s as scopeSyntheticAuthProviderRefs } from "../prepared-model-runtime.facts-_kekUcCq.mjs";
import { a as fingerprintPreparedModelWorkerRequest, i as fingerprintPreparedModelCatalogGeneration, t as PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS } from "../prepared-model-catalog-worker-CbsJcbv0.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-CwtaNZgU.mjs";
import { n as overlayExternalAuthProfiles } from "../external-auth-runtime-BLkLkdlC.mjs";
import { parentPort, workerData } from "node:worker_threads";
//#region src/agents/prepared-model-catalog.worker.ts
/** Worker-thread entrypoint for complete model-catalog discovery. */
function refreshAuthStore(params) {
	const durable = preserveResolvedSecretBackedCredentials({
		next: loadAuthProfileStoreWithoutExternalProfiles(params.agentDir, {
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
async function prepareWorkerGeneration(value) {
	const { prepareWorkspaceBuildGroup } = await import("../prepared-model-runtime.facts-BMU4TlIV.mjs");
	const metadata = restorePluginMetadataSnapshot(value.pluginMetadataSnapshot);
	const normalizedConfig = normalizePluginsConfig(value.input.config.plugins);
	const basePluginIds = metadata.plugins.filter((plugin) => manifestPluginResolvesRuntimeModelCatalogAugment(plugin) && isManifestPluginAvailableForControlPlane({
		snapshot: metadata,
		plugin,
		config: value.input.config,
		normalizedConfig,
		...value.input.env ? { env: value.input.env } : {}
	})).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
	const prepared = await prepareWorkspaceBuildGroup([value.input], "static", {
		preferBuiltPluginArtifacts: value.preferBuiltPluginArtifacts,
		basePluginIds,
		providerDiscoveryProviderIds: value.providerIds,
		purpose: "model-catalog"
	}, void 0, void 0, metadata);
	const agentFacts = prepared.agentFacts[0];
	if (!agentFacts) throw new Error("prepared model catalog worker produced no agent facts");
	const reconstructedFingerprint = fingerprintPreparedModelCatalogGeneration({
		input: value.input,
		sourceConfigForSecrets: value.sourceConfigForSecrets,
		configResolutionFacts: value.configResolutionFacts,
		sourceConfigResolutionFacts: value.sourceConfigResolutionFacts,
		authStore: value.authStore,
		providerIds: value.providerIds,
		preferBuiltPluginArtifacts: prepared.pluginGeneration.preferBuiltPluginArtifacts,
		pluginMetadataSnapshot: prepared.pluginGeneration.pluginMetadataSnapshot
	});
	return {
		agentFacts,
		pluginGeneration: prepared.pluginGeneration,
		reconstructedFingerprint
	};
}
async function runPreparedModelCatalogWorkerRequest(value, request, prepareGeneration) {
	const work = new AsyncWorkScope();
	return withClawInstallSchemaVersionFacts(request.clawInstallSchemaVersions, () => work.run(() => runCatalogRequest(value, request, work, prepareGeneration)));
}
async function runCatalogRequest(value, request, work, prepareGeneration) {
	const directoryOwner = value.input.agentId ? {
		agentId: value.input.agentId,
		agentDir: value.input.agentDir,
		env: value.input.env
	} : void 0;
	let registeredDirectoryOwner = false;
	let prepared;
	let acquiredDiscovery;
	let completed = false;
	try {
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
		prepared = await (prepareGeneration ? prepareGeneration() : prepareWorkerGeneration(value));
		if (prepared.reconstructedFingerprint !== value.generationFingerprint) return {
			status: "generation-mismatch",
			generationFingerprint: value.generationFingerprint,
			reconstructedFingerprint: prepared.reconstructedFingerprint
		};
		const pluginGenerationScope = {
			metadataSnapshot: prepared.pluginGeneration.pluginMetadataSnapshot,
			pluginRegistry: prepared.pluginGeneration.pluginRegistry
		};
		const resolveSyntheticCredentials = (providerIds) => withPluginRuntimeGenerationScope(pluginGenerationScope, () => resolveAmbientAgentCredentialsForDiscovery({
			config: value.input.config,
			env: value.input.env,
			authoritativeSyntheticAuthProviderRefs: pluginGenerationScope.metadataSnapshot.owners.cliBackends.keys(),
			syntheticAuthProviderRefs: scopeSyntheticAuthProviderRefs([.../* @__PURE__ */ new Set([...resolveRuntimeSyntheticAuthProviderRefs(), ...request.syntheticAuth.map(({ providerRef }) => providerRef)])], providerIds),
			...value.input.workspaceDir ? { workspaceDir: value.input.workspaceDir } : {}
		}));
		if (request.kind === "auth-refresh") {
			const authStore = refreshAuthStore({
				agentDir: value.input.agentDir,
				inheritedAuthDir: value.input.inheritedAuthDir,
				authStore: value.authStore,
				config: value.input.config,
				env: value.input.env ?? process.env,
				...request.profileIds ? { profileIds: request.profileIds } : {},
				providerIds: request.providerIds,
				pluginGeneration: prepared.pluginGeneration
			});
			const credentials = {
				...resolveSyntheticCredentials(request.providerIds),
				...resolveAgentCredentialMapFromStore(authStore, { config: value.input.config })
			};
			return {
				status: "ok",
				kind: "auth-refresh",
				generationFingerprint,
				authStore,
				credentials,
				authModes: resolveUsableAgentCredentialModes(credentials)
			};
		}
		const { prepareAgentCatalogSource } = await import("../prepared-model-runtime.scoped-catalog-BF4TYRQe.mjs");
		const { prepareFullCatalogFacts } = await import("../prepared-model-runtime.full-catalog-B83CTLsq.mjs");
		const authStore = refreshAuthStore({
			agentDir: value.input.agentDir,
			inheritedAuthDir: value.input.inheritedAuthDir,
			authStore: value.authStore,
			config: value.input.config,
			env: value.input.env ?? process.env,
			providerIds: request.providerIds ?? listExternalCliSyncProviderIds(),
			pluginGeneration: prepared.pluginGeneration
		});
		replaceRuntimeAuthProfileStoreSnapshots([{
			agentDir: value.input.agentDir,
			store: authStore
		}]);
		const ambientCredentials = resolveSyntheticCredentials(request.providerIds ?? value.providerIds);
		const startupProviderIds = new Set(value.providerIds.map(normalizeProviderId));
		const credentials = {
			...ambientCredentials,
			...resolveAgentCredentialMapFromStore(authStore, { config: value.input.config })
		};
		const exactAgentFacts = {
			...prepared.agentFacts,
			input: value.input,
			env: value.input.env,
			authStore,
			templateAuthStorage: AuthStorage.inMemory(credentials),
			credentials,
			providerIds: [...new Set(request.providerIds ?? [...value.providerIds, ...Object.keys(credentials)])].toSorted((left, right) => left.localeCompare(right))
		};
		const { pluginMetadataSnapshot, pluginRegistry } = prepared.pluginGeneration;
		const discoveryPluginIds = [...resolveImplicitProviderDiscoveryScope({
			config: value.input.config,
			env: value.input.env,
			workspaceDir: value.input.workspaceDir,
			pluginMetadataSnapshot,
			providerDiscoveryProviderIds: exactAgentFacts.providerIds
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
			const pluginIds = [.../* @__PURE__ */ new Set([...pluginRegistry ? listRuntimePluginIdsFromRegistry(pluginRegistry) : [], ...discoveryPlan.pluginIds ?? discoveryPluginIds])].toSorted();
			const key = JSON.stringify(pluginIds);
			if (prepared.discovery?.key !== key) try {
				var _usingCtx$1 = _usingCtx();
				const registry = await _usingCtx$1.a(new PreparedModelRuntimeBuildResources(retainPreparedPluginRegistry)).load({
					...value.input,
					purpose: "model-catalog",
					metadataSnapshot: pluginMetadataSnapshot,
					preferBuiltPluginArtifacts: value.preferBuiltPluginArtifacts,
					reusableRegistry: pluginRegistry,
					basePluginIds: pluginIds
				}, () => {});
				const release = retainPreparedPluginRegistry(registry);
				acquiredDiscovery = {
					key,
					registry,
					release: async () => {
						await release?.();
					}
				};
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				await _usingCtx$1.d();
			}
			const catalogRegistry = (acquiredDiscovery ?? prepared.discovery).registry;
			prepareOwnedPluginLoadContext(value.input, value.input.env ?? process.env, catalogRegistry, pluginMetadataSnapshot, value.preferBuiltPluginArtifacts);
			pluginGenerationScope.pluginRegistry = catalogRegistry;
			catalogGeneration = Object.freeze({
				...catalogGeneration,
				pluginRegistry: catalogRegistry,
				providerStaticModels: void 0
			});
		}
		const { value: source, providerExpiries } = await captureProviderCatalogExpiries(() => prepareAgentCatalogSource(exactAgentFacts, catalogGeneration, "live", false, {
			authStore,
			providerDiscoveryProviderIds: request.providerIds,
			providerDiscoveryTimeoutMs: PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS
		}));
		const facts = await prepareFullCatalogFacts(exactAgentFacts, catalogGeneration, "live", source, {
			includeNative: false,
			providerIds: request.providerIds
		});
		const catalogCredentials = {
			...resolveSyntheticCredentials([...facts.modelCatalog.entries, ...facts.modelCatalog.routeVariants].map((entry) => entry.provider).filter((provider) => !request.providerIds || request.providerIds.includes(normalizeProviderId(provider))).filter((provider) => !startupProviderIds.has(normalizeProviderId(provider)))),
			...credentials
		};
		const runtimeModels = /* @__PURE__ */ new Map();
		const catalogModels = withPluginRuntimeGenerationScope(pluginGenerationScope, () => facts.templateModelRegistry.getAll());
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
		const result = {
			status: "ok",
			kind: "catalog",
			generationFingerprint,
			snapshot: facts.modelCatalog,
			runtimeModels,
			providerExpiries,
			configuredRuntimeModels: facts.configuredRuntimeModels,
			credentials: catalogCredentials,
			providerAuthLabels: withPluginRuntimeGenerationScope(pluginGenerationScope, () => prepareModelCatalogAuthLabels({
				config: value.input.config,
				agentDir: value.input.agentDir,
				workspaceDir: value.input.workspaceDir,
				env: value.input.env,
				store: authStore,
				providers: [
					...exactAgentFacts.providerIds,
					...Object.keys(catalogCredentials),
					...Object.keys(value.input.config.models?.providers ?? {}),
					...facts.modelCatalog.entries.map((entry) => entry.provider),
					...facts.modelCatalog.routeVariants.map((entry) => entry.provider),
					...(facts.modelCatalog.staticEntries ?? []).map((entry) => entry.provider),
					...Object.values(authStore.profiles).map((profile) => profile.provider)
				]
			})),
			authStore,
			authModes: resolveUsableAgentCredentialModes(catalogCredentials)
		};
		work.beginClose();
		await work.runWhenIdle(() => void 0);
		if (acquiredDiscovery) {
			const previous = prepared.discovery;
			prepared.discovery = acquiredDiscovery;
			await previous?.release();
		}
		completed = true;
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
			if (acquiredDiscovery && !completed) {
				if (prepared?.discovery === acquiredDiscovery) prepared.discovery = void 0;
				await acquiredDiscovery.release();
			}
			if (prepared && !prepareGeneration) try {
				await prepared.discovery?.release();
			} finally {
				await discardPreparedPluginGeneration(prepared.pluginGeneration);
			}
		} finally {
			await work.drain();
			if (directoryOwner && registeredDirectoryOwner) unregisterResolvedAgentDir(directoryOwner);
		}
	}
}
function isWorkerRequest(value) {
	return isRecord(value) && Array.isArray(value.syntheticAuth) && isRecord(value.clawInstallSchemaVersions) && typeof value.clawInstallSchemaVersions.path === "string" && isRecord(value.clawInstallSchemaVersions.snapshot) && (value.kind === "catalog" && (value.providerIds === void 0 || Array.isArray(value.providerIds) && value.providerIds.every((id) => typeof id === "string")) || value.kind === "auth-refresh" && Array.isArray(value.providerIds) && value.providerIds.every((providerId) => typeof providerId === "string") && (value.profileIds === void 0 || Array.isArray(value.profileIds) && value.profileIds.every((profileId) => typeof profileId === "string")));
}
function retainWorkerGeneration(prepared) {
	const releaseBase = ownPreparedPluginGeneration(prepared.pluginGeneration).retain();
	return async () => {
		try {
			await prepared.discovery?.release();
		} finally {
			await releaseBase();
		}
	};
}
if (parentPort) {
	const data = workerData;
	let current;
	serveWorkerTasks(async (input) => {
		const task = data.kind === "gateway" ? input : void 0;
		const value = task?.value ?? data;
		const request = task?.request ?? input;
		if (value.kind !== "catalog" || !isWorkerRequest(request)) throw new Error("invalid prepared model catalog worker request");
		return withPluginSourceCaptureDirectory(data.sourceCaptureDirectory, async () => {
			const previous = current;
			let attempted;
			let release;
			try {
				const result = await runPreparedModelCatalogWorkerRequest(value, request, async () => {
					if (previous?.fingerprint === value.generationFingerprint) return previous.prepared;
					const prepared = attempted = await prepareWorkerGeneration(value);
					if (prepared.reconstructedFingerprint === value.generationFingerprint) release = retainWorkerGeneration(prepared);
					return prepared;
				});
				if (attempted && release && result.status === "ok") {
					current = {
						fingerprint: value.generationFingerprint,
						prepared: attempted,
						release
					};
					attempted = void 0;
					release = void 0;
					await previous?.release();
				}
				return result;
			} finally {
				if (release) await release();
				else if (attempted) await discardPreparedPluginGeneration(attempted.pluginGeneration);
			}
		}, data.sourceCaptureManagedRoot);
	});
}
//#endregion
export { runPreparedModelCatalogWorkerRequest };
