import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import "./model-ref-shared-BgRrSHjn.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { n as resolveProviderModelMaterializationAuthMode } from "./provider-model-route-auth-DkAaX3ui.mjs";
import { n as findModelInCatalog, s as createModelCatalogIdentityKeyResolver } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as FailoverError } from "./error-ON38hPhx.mjs";
//#region src/agents/model-runtime-choice.ts
const loadPreparedModelCatalog = createLazyPromise(() => import("./prepared-model-catalog-CFgw7dXn.mjs"));
const loadModelResolver = createLazyPromise(() => import("./model-BgdDNECx.mjs"));
const loadModelSelection = createLazyPromise(() => import("./model-selection-D5bTO0w2.mjs"));
const loadModelRefProfile = createLazyPromise(() => import("./model-ref-profile-DxMyAICZ.mjs"));
const loadModelCatalogDecisions = createLazyPromise(() => import("./model-catalog-decisions-DZDmeySb.mjs"));
const loadPreparedRuntimeAuth = createLazyPromise(() => import("./prepared-model-runtime-auth-KanpF77O.mjs"));
const loadProviderModelRoute = createLazyPromise(() => import("./provider-model-route-XmqWSBn1.mjs"));
const loadRuntimeModelMaterializer = createLazyPromise(() => import("./materialize-model-2VxRYdi9.mjs"));
const loadModelFallbackCandidates = createLazyPromise(() => import("./model-fallback-candidates-CSotEAfE.mjs"));
const loadProviderAuthAliases = createLazyPromise(() => import("./provider-auth-aliases-BHUczFq4.mjs"));
const loadPluginGenerationScope = createLazyPromise(() => import("./generation-scope-BDvYF3S8.mjs"));
const loadModelCatalogEntry = createLazyPromise(() => import("./model-catalog-entry-BjQgDo8z.mjs"));
/** Resolve support independently of whether this request needs manual-override permission. */
async function prepareModelChoice(params) {
	const { withPreparedModelCatalogOwner } = await loadPreparedModelCatalog();
	const { resolveModelAsync } = await loadModelResolver();
	const { buildModelAliasIndex, resolveAllowedModelRef, resolveDefaultModelForAgent, resolveModelRefFromString } = await loadModelSelection();
	const { splitTrailingAuthProfile } = await loadModelRefProfile();
	const { createModelCatalogDecisions, resolveCatalogDecisionRuntime } = await loadModelCatalogDecisions();
	const { getPreparedModelRuntimeAuthStore } = await loadPreparedRuntimeAuth();
	const { projectProviderModelRouteConfig } = await loadProviderModelRoute();
	const { validatePreparedRuntimeModel } = await loadRuntimeModelMaterializer();
	const { resolveModelCandidateChain } = await loadModelFallbackCandidates();
	const { resolveProviderIdForAuth } = await loadProviderAuthAliases();
	const { withPluginRuntimeGenerationScope } = await loadPluginGenerationScope();
	return await withPreparedModelCatalogOwner({
		config: params.cfg,
		agentId: params.agentId,
		workspaceDir: params.workspaceDir,
		readOnly: true
	}, (owner) => withPluginRuntimeGenerationScope(owner, async () => {
		const defaults = resolveDefaultModelForAgent({
			cfg: owner.config,
			agentId: params.agentId
		});
		const selection = {
			cfg: owner.config,
			agentId: params.agentId,
			defaultProvider: defaults.provider,
			defaultModel: defaults,
			catalog: owner.modelCatalog.entries,
			manifestPlugins: owner.metadataSnapshot.plugins,
			raw: params.raw
		};
		const selected = params.source === "automatic" && params.resolvedRef ? { ref: params.resolvedRef } : params.source === "override" ? resolveAllowedModelRef(selection) : resolveModelRefFromString({
			...selection,
			aliasIndex: buildModelAliasIndex(selection)
		});
		if (!selected) return {
			kind: "unavailable",
			error: `invalid model: ${params.raw}`
		};
		if ("error" in selected) return {
			kind: "unavailable",
			error: selected.error
		};
		const requested = selected.ref;
		const authOwner = (provider) => resolveProviderIdForAuth(provider, {
			config: owner.config,
			workspaceDir: owner.workspaceDir,
			metadataSnapshot: owner.metadataSnapshot
		});
		const requestedAuthOwner = authOwner(requested.provider);
		const prepare = async (ref) => {
			const authStore = getPreparedModelRuntimeAuthStore(owner);
			if (!authStore) return {
				kind: "unavailable",
				error: "Model account facts are not prepared. Retry after configuration finishes loading."
			};
			const profileId = authOwner(ref.provider) === requestedAuthOwner ? splitTrailingAuthProfile(params.raw).profile : void 0;
			const decisions = createModelCatalogDecisions({
				cfg: owner.config,
				agentId: params.agentId,
				agentDir: owner.agentDir,
				workspaceDir: owner.workspaceDir,
				snapshot: owner.modelCatalog,
				metadataSnapshot: owner.metadataSnapshot,
				preparedAuthStore: authStore,
				preparedRuntimeAuthModes: owner.authModes,
				pluginRegistry: owner.pluginRegistry,
				observationConfig: owner.observationConfig,
				isCurrent: owner.isCurrent,
				preferredProfileId: profileId,
				pinnedProfileId: profileId,
				profileProvider: ref.provider
			});
			const key = modelKey(ref.provider, ref.model);
			const entry = decisions.snapshot.entries.find((row) => modelKey(row.provider, row.id) === key) ?? {
				provider: ref.provider,
				id: ref.model,
				name: ref.model
			};
			const variants = decisions.snapshot.routeVariants.filter((row) => modelKey(row.provider, row.id) === key);
			const host = await decisions.evaluateEntry(entry, variants);
			const auth = decisions.evaluateNative(entry, host);
			if (auth.routeResolution?.kind === "incompatible") return {
				kind: "unavailable",
				error: auth.routeResolution.message
			};
			if ((profileId || auth.availabilityAuthoritative) && auth.availability === false) return {
				kind: "unavailable",
				error: `The selected account or native runtime is unavailable for ${key}. Restore that account before spawning this model.`
			};
			const selectedRuntime = resolveCatalogDecisionRuntime({
				cfg: owner.config,
				agentId: params.agentId,
				entry,
				evaluation: auth,
				pluginRegistry: owner.pluginRegistry
			})?.id;
			const config = auth.selectedRoute ? projectProviderModelRouteConfig({
				provider: ref.provider,
				config: owner.config,
				route: auth.selectedRoute
			}) : owner.config;
			const resolution = await resolveModelAsync(ref.provider, ref.model, owner.agentDir, config, {
				agentId: params.agentId,
				workspaceDir: owner.workspaceDir,
				preparedModelRuntime: owner,
				modelIdSource: "selected",
				authProfileId: auth.selectedProfileId,
				authProfileMode: resolveProviderModelMaterializationAuthMode(auth.selectedAuthMode),
				...selectedRuntime ? { agentRuntimeId: selectedRuntime } : {},
				allowBundledStaticCatalogFallback: true,
				deferProviderDynamicModelPreparation: params.source === "automatic"
			});
			if (!decisions.isCurrent()) return {
				kind: "unavailable",
				error: "Model configuration changed during selection. Retry the request."
			};
			if (resolution.model) try {
				const model = validatePreparedRuntimeModel({
					provider: ref.provider,
					modelId: ref.model,
					config,
					workspaceDir: owner.workspaceDir,
					metadataSnapshot: owner.metadataSnapshot,
					route: auth.selectedRoute ? {
						...auth.selectedRoute,
						provider: ref.provider,
						modelId: ref.model
					} : void 0,
					model: resolution.model
				});
				return {
					kind: "resolved",
					ref: resolution.logicalRef,
					model
				};
			} catch (error) {
				if (error instanceof FailoverError && error.reason === "model_not_found") return {
					kind: "unavailable",
					error: error.message
				};
				throw error;
			}
			return resolution.deferred === "provider-dynamic-model" ? {
				kind: "pending",
				ref
			} : {
				kind: "unavailable",
				error: resolution.error
			};
		};
		const choice = await prepare(requested);
		if (params.source !== "automatic" || choice.kind !== "unavailable") return choice;
		const fallbacks = resolveModelCandidateChain({
			cfg: owner.config,
			agentId: params.agentId,
			provider: requested.provider,
			model: requested.model,
			requestedRouteResolution: "resolved",
			allowPluginNormalization: false,
			manifestPlugins: owner.metadataSnapshot.plugins,
			fallbacksOverride: params.fallbacks ?? []
		}).slice(1);
		const choices = await Promise.all(fallbacks.map(prepare));
		if (!owner.isCurrent()) return {
			kind: "unavailable",
			error: "Model configuration changed during selection. Retry the request."
		};
		return choices.some((fallback) => fallback.kind !== "unavailable") ? {
			kind: "automatic",
			ref: requested
		} : choice;
	}));
}
/** Bind runtime selection and its commit check to the current published model owner. */
async function preparePublishedModelRuntimeChoice(params) {
	const { getPublishedPreparedModelCatalogOwnerSnapshot, materializePreparedModelCatalogOwner } = await loadPreparedModelCatalog();
	const { getPreparedModelRuntimeAuthStore } = await loadPreparedRuntimeAuth();
	const { createModelCatalogDecisions } = await loadModelCatalogDecisions();
	const published = getPublishedPreparedModelCatalogOwnerSnapshot({
		config: params.cfg,
		agentId: params.agentId,
		workspaceDir: params.workspaceDir
	});
	const unavailable = `${params.runtimeId ? `Runtime "${params.runtimeId}"` : "A runtime"} is not available for ${params.provider}/${params.model}. Refresh the model catalog and choose again.`;
	if (!published) return {
		kind: "unavailable",
		message: unavailable
	};
	const owner = materializePreparedModelCatalogOwner(published);
	const authStore = getPreparedModelRuntimeAuthStore(owner);
	if (!authStore) return {
		kind: "unavailable",
		message: unavailable
	};
	const decisions = createModelCatalogDecisions({
		cfg: owner.config,
		agentId: owner.agentId ?? params.agentId,
		agentDir: owner.agentDir,
		workspaceDir: owner.workspaceDir,
		snapshot: owner.modelCatalog,
		metadataSnapshot: owner.metadataSnapshot,
		preparedAuthStore: authStore,
		preparedRuntimeAuthModes: owner.authModes,
		pluginRegistry: owner.pluginRegistry,
		observationConfig: owner.observationConfig,
		isCurrent: owner.isCurrent,
		preferredProfileId: params.sessionEntry?.authProfileOverride,
		pinnedProfileId: params.sessionEntry?.authProfileOverrideSource === "user" ? params.sessionEntry.authProfileOverride : void 0,
		profileProvider: params.sessionEntry?.providerOverride ?? params.sessionEntry?.modelProvider
	});
	let entry = findModelInCatalog(decisions.snapshot.entries, params.provider, params.model) ?? decisions.snapshot.entries.find((row) => modelKey(row.provider, row.id) === modelKey(params.provider, params.model));
	if (!entry) {
		const { resolveModelAsync } = await loadModelResolver();
		const { modelCatalogRowToEntry } = await loadModelCatalogEntry();
		const requestedEntry = {
			provider: params.provider,
			id: params.model,
			name: params.model
		};
		const materializationRuntime = params.runtimeId ?? (params.preferredRuntimeId && (await decisions.runtimeChoices(requestedEntry, [requestedEntry]))?.includes(params.preferredRuntimeId) ? params.preferredRuntimeId : void 0);
		const selectedAuth = await decisions.evaluateEntry(requestedEntry, void 0, materializationRuntime);
		const authProfileMode = resolveProviderModelMaterializationAuthMode(selectedAuth.selectedAuthMode);
		if (selectedAuth.availability !== true || !authProfileMode) return {
			kind: "unavailable",
			message: unavailable
		};
		const resolved = await resolveModelAsync(params.provider, params.model, owner.agentDir, owner.config, {
			agentId: owner.agentId ?? params.agentId,
			workspaceDir: owner.workspaceDir,
			preparedModelRuntime: owner,
			agentRuntimeId: materializationRuntime,
			allowBundledStaticCatalogFallback: true,
			authProfileMode,
			...selectedAuth.selectedProfileId ? { authProfileId: selectedAuth.selectedProfileId } : {}
		});
		if (!resolved.model) return {
			kind: "unavailable",
			message: unavailable
		};
		entry = modelCatalogRowToEntry(resolved.model);
	}
	const identityKey = createModelCatalogIdentityKeyResolver();
	const selectedIdentity = identityKey(entry);
	const variants = decisions.snapshot.routeVariants.filter((row) => identityKey(row) === selectedIdentity);
	const choices = await decisions.runtimeChoices(entry, variants.length ? variants : [entry]);
	const runtimeId = params.runtimeId ?? (params.preferredRuntimeId && choices?.includes(params.preferredRuntimeId) ? params.preferredRuntimeId : choices?.[0]);
	if (!runtimeId || !choices?.includes(runtimeId)) return {
		kind: "unavailable",
		message: unavailable
	};
	const host = await decisions.evaluateEntry(entry, variants.length ? variants : [entry], runtimeId);
	const validate = () => decisions.isCurrent() && decisions.evaluateNative(entry, host, runtimeId).availability === true ? void 0 : unavailable;
	return {
		kind: "ready",
		runtimeId,
		validate,
		harness: owner.pluginRegistry?.agentHarnesses.find((registration) => registration.harness.id === runtimeId)?.harness
	};
}
//#endregion
export { preparePublishedModelRuntimeChoice as n, prepareModelChoice as t };
