import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import "./defaults-BbU4k6fu.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { r as resolveProviderModelRouteAuthRequirement } from "./provider-model-route-auth-DkAaX3ui.mjs";
import { n as resolveModelRouteIntent } from "./model-runtime-policy-IbIjya7U.mjs";
import { f as resolveOpenAIModelRoutes } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { a as prepareProviderRuntimeAuth } from "./provider-runtime.runtime.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-DOrVD029.mjs";
import { R as formatMissingAuthError } from "./loader-runtime-load-XbrcYJWd.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-BcoYkagW.mjs";
import { a as reconcileAuthProfileQuotaBlocks } from "./usage-BGZHRVrb.mjs";
import { d as resolveProviderRuntimePluginHandle, t as attachModelProviderRuntimePluginHandle } from "./provider-hook-runtime-BGP4teSf.mjs";
import { n as getModelRegistryRuntime } from "./model-registry-DrVlc5_5.mjs";
import { n as bindModelLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { i as getApiKeyForModelCore, n as applyLocalNoAuthHeaderOverride, r as applySecretRefHeaderSentinels } from "./model-auth-CCIBdEPk.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { t as createAgentRuntimeMetadataPluginIdScope } from "./runtime-plugin-load-plan-DrtegO6g.mjs";
import { t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-DtKqtgJz.mjs";
import { i as resolveUtilityModelRefForAgent } from "./utility-model-DZ4XRwmc.mjs";
import { n as resolveModelAsync } from "./model-s5D17jSh.mjs";
import { t as materializePreparedRuntimeModel } from "./materialize-model-BGTV6m9x.mjs";
import { r as prepareAgentRuntimeAuth } from "./prepare-auth-CvmQc1W2.mjs";
import { n as resolvePreparedRuntimeModelAuth, t as resolvePreparedRuntimeAuthAttempts } from "./resolve-auth-CH7L0GcM.mjs";
import { t as runWithAsyncWorkResources } from "./async-work-resources-CUDFzL8J.mjs";
import "./simple-completion-execution-fisLWRz4.mjs";
import { t as protectPreparedProviderRuntimeAuth } from "./provider-runtime-auth-protection-DFvzygMB.mjs";
import { o as fingerprintResolvedProviderAuth, t as fingerprintAuthProfileCredential } from "./execution-auth-binding-DkIxPe6Z.mjs";
import { prepareModelForSimpleCompletion } from "@openclaw/ai/transports";
//#region src/agents/simple-completion-scope.ts
/** Bind every resolution in one completion to one prepared generation and store pair. */
function createPreparedSimpleCompletionResolverContext(params) {
	const stores = params.preparedModelRuntime.createStores();
	const modelResolver = params.modelResolver ?? resolveModelAsync;
	return {
		preparedModelRuntime: params.preparedModelRuntime,
		workspaceDir: params.workspaceDir,
		modelResolver: (provider, modelId, agentDir, cfg, options) => modelResolver(provider, modelId, agentDir, cfg, {
			...options,
			authStorage: stores.authStorage,
			modelRegistry: stores.modelRegistry,
			preparedModelRuntime: params.preparedModelRuntime,
			workspaceDir: params.workspaceDir,
			...params.agentRuntimeId ? { agentRuntimeId: params.agentRuntimeId } : {}
		})
	};
}
//#endregion
//#region src/agents/simple-completion-runtime.ts
function resolveSimpleCompletionSelectionRequest(params) {
	const fallbackRef = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		manifestPlugins: params.manifestPlugins
	});
	const modelRef = params.modelRef?.trim() || (params.useUtilityModel ? resolveUtilityModelRefForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		primaryProvider: fallbackRef.provider,
		...params.manifestPlugins ? { metadataSnapshot: "plugins" in params.manifestPlugins ? params.manifestPlugins : { plugins: params.manifestPlugins } } : {}
	}) : void 0) || resolveAgentEffectiveModelPrimary(params.cfg, params.agentId);
	const split = modelRef ? splitTrailingAuthProfile(modelRef) : null;
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: fallbackRef.provider || "openai",
		manifestPlugins: params.manifestPlugins
	});
	const resolved = split ? resolveModelRefFromString({
		cfg: params.cfg,
		agentId: params.agentId,
		raw: split.model,
		defaultProvider: fallbackRef.provider || "openai",
		aliasIndex,
		manifestPlugins: params.manifestPlugins
	}) : null;
	const provider = resolved?.ref.provider ?? fallbackRef.provider;
	const modelId = resolved?.ref.model ?? fallbackRef.model;
	if (!provider || !modelId) return null;
	return {
		selection: {
			provider,
			modelId,
			profileId: split?.profile || void 0,
			agentDir: params.agentDir?.trim() || resolveAgentDir(params.cfg, params.agentId)
		},
		...split && !split.model.includes("/") ? { shorthandModelId: split.model } : {}
	};
}
function resolveSimpleCompletionSelectionForAgent(params) {
	return resolveSimpleCompletionSelectionRequest(params)?.selection ?? null;
}
/** Prepares a model within the exact generation already held by its caller. */
async function prepareSimpleCompletionModel(params, assertCurrent) {
	params.signal?.throwIfAborted();
	const config = params.cfg ?? {};
	const preparedModelRuntime = params.preparedModelRuntime;
	const context = createPreparedSimpleCompletionResolverContext({
		preparedModelRuntime,
		workspaceDir: params.workspaceDir ?? preparedModelRuntime.workspaceDir ?? resolveAgentWorkspaceDir(config, params.agentId ?? resolveDefaultAgentId(config)),
		modelResolver: params.modelResolver,
		agentRuntimeId: params.agentRuntimeId
	});
	const prepared = await withPluginRuntimeGenerationScope(preparedModelRuntime, () => prepareSimpleCompletionModelCore({
		...params,
		agentDir: preparedModelRuntime.agentDir
	}, context, assertCurrent));
	params.signal?.throwIfAborted();
	return prepared;
}
async function prepareSimpleCompletionModelCore(params, context, assertCurrent) {
	const { modelResolver, workspaceDir } = context;
	const resolved = await modelResolver(params.provider, params.modelId, params.agentDir, params.cfg, {
		abortSignal: params.signal,
		assertCurrent,
		modelIdSource: params.modelIdSource,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.allowBundledStaticCatalogFallback !== void 0 ? { allowBundledStaticCatalogFallback: params.allowBundledStaticCatalogFallback } : {},
		...params.skipAgentDiscovery ? { skipAgentDiscovery: true } : {},
		authProfileId: params.profileId,
		preferredProfile: params.preferredProfile
	});
	if (!resolved.model) return { error: resolved.error ?? `Unknown model: ${params.provider}/${params.modelId}` };
	assertCurrent?.();
	params.signal?.throwIfAborted();
	const initialModel = resolved.model;
	let resolvedModel = initialModel;
	let authStore;
	let auth;
	try {
		authStore = params.bindAuthOwner || initialModel.provider === "openai" ? ensureAuthProfileStore(params.agentDir, {
			readOnly: true,
			allowKeychainPrompt: false,
			config: params.cfg,
			profileId: params.profileId
		}) : void 0;
		const authParams = {
			provider: initialModel.provider,
			modelId: initialModel.id,
			modelApi: initialModel.api,
			modelBaseUrl: initialModel.baseUrl,
			config: params.cfg,
			agentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir,
			authProfileStore: authStore,
			metadataSnapshot: context.preparedModelRuntime.metadataSnapshot,
			sessionAuthProfileId: params.profileId ?? params.preferredProfile,
			sessionAuthProfileSource: params.profileId ? "user" : "auto",
			...params.bindAuthOwner && params.profileId ? { allowAuthProfileFallback: false } : {}
		};
		await reconcileAuthProfileQuotaBlocks(authParams);
		assertCurrent?.();
		params.signal?.throwIfAborted();
		const primaryModel = params.cfg ? resolveDefaultModelForAgent({
			cfg: params.cfg,
			agentId: params.agentId,
			allowManifestNormalization: false,
			allowPluginNormalization: false
		}) : void 0;
		const resolveProfileAuthMode = (profileId) => authStore?.profiles[profileId]?.type;
		const routeIntent = params.agentRuntimeId ? {
			runtimeId: params.agentRuntimeId,
			source: "explicit"
		} : resolveModelRouteIntent({
			config: params.cfg,
			provider: initialModel.provider,
			modelId: initialModel.id,
			agentId: params.agentId,
			primaryModel,
			resolveProfileAuthMode
		});
		const preparedAuth = resolveOpenAIModelRoutes({
			provider: initialModel.provider,
			modelId: initialModel.id,
			api: initialModel.api,
			baseUrl: initialModel.baseUrl,
			config: params.cfg,
			agentId: params.agentId,
			routeIntent,
			resolveProfileAuthMode,
			pinnedAuthRequirement: resolveProviderModelRouteAuthRequirement(params.profileId ? authStore?.profiles[params.profileId]?.type : void 0),
			env: process.env
		})?.kind === "routes" ? prepareAgentRuntimeAuth({
			...authParams,
			routeIntent
		}) : void 0;
		const materializeModel = async ({ plan, model, forceResolve }) => await materializePreparedRuntimeModel({
			plan,
			provider: initialModel.provider,
			modelId: initialModel.id,
			config: params.cfg,
			workspaceDir,
			metadataSnapshot: context.preparedModelRuntime.metadataSnapshot,
			model,
			forceResolve,
			resolveModel: ({ config, authProfileId, authProfileMode }) => modelResolver(initialModel.provider, initialModel.id, params.agentDir, config, {
				abortSignal: params.signal,
				assertCurrent,
				modelIdSource: "selected",
				...params.agentId ? { agentId: params.agentId } : {},
				skipAgentDiscovery: true,
				allowBundledStaticCatalogFallback: true,
				authProfileId,
				authProfileMode
			})
		}) ?? model;
		if (preparedAuth && authStore) {
			const resolvedAuth = await resolvePreparedRuntimeAuthAttempts({
				attempts: preparedAuth.attempts,
				store: authStore,
				modelId: initialModel.id,
				model: initialModel,
				materializeModel,
				resolveAuth: ({ attempt, model }) => resolvePreparedRuntimeModelAuth({
					plan: attempt.plan,
					model,
					cfg: params.cfg,
					agentDir: params.agentDir,
					workspaceDir,
					store: authStore,
					allowAuthProfileFallback: attempt.allowAuthProfileFallback,
					secretSentinels: true
				}),
				errorMessage: "Simple completion auth attempts could not be resolved."
			});
			auth = resolvedAuth.auth;
			resolvedModel = resolvedAuth.model;
		} else auth = await getApiKeyForModelCore({
			model: initialModel,
			cfg: params.cfg,
			agentDir: params.agentDir,
			workspaceDir,
			profileId: params.profileId,
			preferredProfile: params.preferredProfile,
			...authStore ? { store: authStore } : {},
			...params.bindAuthOwner && params.profileId ? { lockedProfile: true } : {},
			secretSentinels: true
		});
	} catch (err) {
		return { error: `Auth lookup failed for provider "${initialModel.provider}": ${formatErrorMessage(err)}` };
	}
	const rawApiKey = auth.apiKey?.trim();
	if (!rawApiKey && !params.allowMissingApiKeyModes?.includes(auth.mode)) return {
		error: formatMissingAuthError(auth, resolvedModel.provider),
		auth
	};
	let authValue = rawApiKey;
	if (rawApiKey) {
		const preparedAuth = protectPreparedProviderRuntimeAuth({
			provider: resolvedModel.provider,
			preparedAuth: await prepareProviderRuntimeAuth({
				provider: resolvedModel.provider,
				config: params.cfg,
				workspaceDir,
				env: process.env,
				context: {
					config: params.cfg,
					workspaceDir,
					env: process.env,
					provider: resolvedModel.provider,
					modelId: resolvedModel.id,
					model: resolvedModel,
					apiKey: rawApiKey,
					authMode: auth.mode,
					profileId: auth.profileId
				}
			})
		});
		authValue = preparedAuth?.apiKey?.trim() || rawApiKey;
		resolved.authStorage.setRuntimeApiKey(resolvedModel.provider, authValue);
		resolvedModel = applyPreparedRuntimeAuthToModel(resolvedModel, preparedAuth);
	}
	const resolvedAuth = {
		...auth,
		apiKey: authValue
	};
	const profileCredential = params.profileId ? authStore?.profiles[params.profileId] : void 0;
	const sourceAuthFingerprint = params.bindAuthOwner ? profileCredential?.type === "oauth" && params.profileId ? fingerprintAuthProfileCredential({
		profileId: params.profileId,
		credential: profileCredential
	}) : fingerprintResolvedProviderAuth(auth) : void 0;
	await import("./ai-transport-runtime-host-KMti9bOr.mjs");
	assertCurrent?.();
	params.signal?.throwIfAborted();
	const modelRuntime = getModelRegistryRuntime(resolved.modelRegistry);
	const model = applySecretRefHeaderSentinels(applyLocalNoAuthHeaderOverride(resolvedModel, resolvedAuth), params.cfg);
	const providerRuntimeHandle = resolveProviderRuntimePluginHandle({
		provider: model.provider,
		modelId: model.id,
		config: params.cfg,
		workspaceDir,
		env: process.env,
		pluginMetadataSnapshot: context.preparedModelRuntime.metadataSnapshot
	});
	const preparedModel = attachModelProviderRuntimePluginHandle(model, providerRuntimeHandle);
	const completionTransport = attachModelProviderRuntimePluginHandle(prepareModelForSimpleCompletion({
		apiRegistry: modelRuntime.apiRegistry,
		model: preparedModel,
		cfg: params.cfg
	}), providerRuntimeHandle);
	return {
		model: bindModelLlmRuntime(preparedModel, modelRuntime.llmRuntime, completionTransport),
		auth: resolvedAuth,
		...sourceAuthFingerprint ? { sourceAuthFingerprint } : {}
	};
}
async function acquirePreparedSimpleCompletionRuntime(params, runtimePluginSelections, onAcquired) {
	const config = params.cfg ?? {};
	const agentId = params.agentId ?? resolveDefaultAgentId(config);
	const agentDir = params.agentDir?.trim() || resolveAgentDir(config, agentId);
	const requestedWorkspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(config, agentId);
	const lease = await acquireAgentRunPreparedModelRuntime({
		config,
		agentId,
		agentDir,
		workspaceDir: requestedWorkspaceDir,
		loadRuntimePlugins: true,
		runtimePluginSelections: runtimePluginSelections.map((selection) => ({
			...selection,
			agentId
		}))
	}, {
		catalogMode: "static",
		abortSignal: params.signal,
		...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {}
	});
	onAcquired(() => lease[Symbol.asyncDispose]());
	return createPreparedSimpleCompletionResolverContext({
		preparedModelRuntime: lease.snapshot,
		workspaceDir: params.workspaceDir ?? lease.snapshot.workspaceDir ?? requestedWorkspaceDir,
		modelResolver: params.modelResolver,
		agentRuntimeId: params.agentRuntimeId
	});
}
/** Keeps prepared facts in use until the internal completion owner releases its lease. */
async function acquireSimpleCompletionModelForAgent(params) {
	const selectionParams = {
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		modelRef: params.modelRef,
		useUtilityModel: params.useUtilityModel
	};
	return await acquireSimpleCompletionModelWithSelection(params, (manifestPlugins) => resolveSimpleCompletionSelectionRequest({
		...selectionParams,
		manifestPlugins
	}));
}
/** Captures metadata before the caller selects the model to materialize. */
async function acquireSimpleCompletionModelWithSelection(params, resolveRequest) {
	const agentId = params.agentId ?? resolveDefaultAgentId(params.cfg);
	const agentDir = params.agentDir?.trim() || resolveAgentDir(params.cfg, agentId);
	const tentativeRequest = resolveRequest();
	if (!tentativeRequest) return { error: `No model configured for agent ${agentId}.` };
	const tentativeSelection = tentativeRequest.selection;
	const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
	const pluginIdScope = createAgentRuntimeMetadataPluginIdScope({
		config: params.cfg,
		workspaceDir,
		selections: [{
			provider: tentativeSelection.provider,
			modelId: tentativeSelection.modelId,
			agentId
		}],
		...tentativeRequest.shorthandModelId ? { shorthandModelIds: [tentativeRequest.shorthandModelId] } : {}
	});
	let metadataSnapshot = resolvePluginMetadataSnapshot({
		config: params.cfg,
		env: process.env,
		workspaceDir,
		pluginIdScope,
		allowWorkspaceScopedCurrent: true
	});
	const resolveSelection = () => {
		const request = resolveRequest(metadataSnapshot);
		return request ? {
			...request.selection,
			agentDir
		} : null;
	};
	let selection = resolveSelection();
	if (!selection) return { error: `No model configured for agent ${agentId}.` };
	const canonicalPluginIdScope = createAgentRuntimeMetadataPluginIdScope({
		config: params.cfg,
		workspaceDir,
		selections: [{
			provider: selection.provider,
			modelId: selection.modelId,
			agentId
		}],
		...tentativeRequest.shorthandModelId && selection.provider === tentativeSelection.provider && selection.modelId === tentativeSelection.modelId ? { shorthandModelIds: [tentativeRequest.shorthandModelId] } : {}
	});
	if (canonicalPluginIdScope.key !== pluginIdScope.key) {
		metadataSnapshot = resolvePluginMetadataSnapshot({
			config: params.cfg,
			env: process.env,
			workspaceDir,
			pluginIdScope: canonicalPluginIdScope,
			allowWorkspaceScopedCurrent: true
		});
		selection = resolveSelection();
		if (!selection) return { error: `No model configured for agent ${agentId}.` };
	}
	return {
		...await acquirePreparedSimpleCompletionModel({
			...params,
			agentId,
			agentDir,
			pluginMetadataSnapshot: metadataSnapshot
		}, [{
			provider: selection.provider,
			modelId: selection.modelId
		}], (context) => prepareSimpleCompletionModelCore({
			cfg: params.cfg,
			agentId: params.agentId,
			provider: selection.provider,
			modelId: selection.modelId,
			modelIdSource: "selected",
			agentDir: selection.agentDir,
			profileId: selection.profileId,
			preferredProfile: params.preferredProfile,
			allowMissingApiKeyModes: params.allowMissingApiKeyModes,
			...params.allowBundledStaticCatalogFallback !== void 0 ? { allowBundledStaticCatalogFallback: params.allowBundledStaticCatalogFallback } : {},
			skipAgentDiscovery: params.skipAgentDiscovery,
			bindAuthOwner: params.bindAuthOwner,
			signal: params.signal
		}, context)),
		selection
	};
}
async function acquirePreparedSimpleCompletionModel(params, runtimePluginSelections, prepareModel) {
	let releaseRuntime;
	let setupSettled = false;
	let callerReleased = true;
	let releaseCompletion;
	const setupCompletion = createDeferredCore();
	const releaseWhenUnused = () => {
		if (setupSettled && callerReleased) releaseCompletion ??= Promise.resolve().then(() => releaseRuntime?.());
		return releaseCompletion;
	};
	return await runWithAsyncWorkResources(async (onAcquired, captureWorkContext) => {
		onAcquired({ release: () => {
			setupSettled = true;
			setupCompletion.resolve();
			return releaseWhenUnused();
		} });
		const context = await acquirePreparedSimpleCompletionRuntime(params, runtimePluginSelections, (release) => {
			releaseRuntime = release;
		});
		const prepared = await withPluginRuntimeGenerationScope(context.preparedModelRuntime, () => {
			captureWorkContext();
			return prepareModel(context);
		});
		params.signal?.throwIfAborted();
		if ("error" in prepared) return prepared;
		callerReleased = false;
		return {
			...prepared,
			async [Symbol.asyncDispose]() {
				callerReleased = true;
				await setupCompletion.promise;
				await releaseWhenUnused();
			}
		};
	});
}
//#endregion
export { resolveSimpleCompletionSelectionForAgent as i, acquireSimpleCompletionModelWithSelection as n, prepareSimpleCompletionModel as r, acquireSimpleCompletionModelForAgent as t };
