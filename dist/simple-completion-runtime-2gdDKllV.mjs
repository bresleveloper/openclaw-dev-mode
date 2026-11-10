import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { _ as resolveDefaultAgentId, a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { D as isProfileInCooldown } from "./user-model-account-authority-DFFjC5J5.mjs";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-SptB0g_t.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as withPluginRuntimeGenerationScope, t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { t as providerModelRouteAcceptsAuthMode } from "./provider-model-route-auth-C7odu5x8.mjs";
import { n as resolveModelRouteIntent, o as resolveProviderModelAuthPolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { o as resolveOpenAIModelRoutes } from "./openai-model-routes-BJEokkWC.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { n as OAuthRefreshFailureError } from "./oauth-refresh-failure-H1_-S915.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { t as resolveSelectedModelCredential } from "./model-auth-selected-credential-DtR_jW21.mjs";
import { a as prepareProviderRuntimeAuth } from "./provider-runtime.runtime.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-WdycwKIG.mjs";
import { D as formatMissingAuthError } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { i as ensureAuthProfileStoreAsync } from "./store-runtime-CwqGD12G.mjs";
import { d as resolveProviderRuntimePluginHandle, t as attachModelProviderRuntimePluginHandle } from "./provider-hook-runtime-DHSjZAkW.mjs";
import { a as reconcileAuthProfileQuotaBlocks } from "./usage-CRucybdr.mjs";
import { n as getModelRegistryRuntime } from "./model-registry-pyM1O0Zs.mjs";
import { n as bindModelLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { t as createAgentRuntimeMetadataPluginIdScope } from "./runtime-plugin-load-plan-Cjd4Pbax.mjs";
import { t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-wDlPVSla.mjs";
import { i as getApiKeyForModelCore, n as applyLocalNoAuthHeaderOverride, r as applySecretRefHeaderSentinels } from "./model-auth-CMoPmop7.mjs";
import { t as runWithAsyncWorkResources } from "./async-work-resources-DmPouonj.mjs";
import { n as resolveModelAsync } from "./model-DTfH9r49.mjs";
import { t as materializePreparedRuntimeModel } from "./materialize-model-EsjVwK5o.mjs";
import { i as preparedAgentRuntimeProfileAttemptHasCandidate, n as canRunPreparedAgentRuntimeAuthAttempt, r as prepareAgentRuntimeAuth } from "./prepare-auth-B180a1GD.mjs";
import { s as shouldForceDirectAuthFallbackModelResolve, t as protectPreparedProviderRuntimeAuth } from "./provider-runtime-auth-protection-DSbtbt81.mjs";
import "./simple-completion-execution-6SeWwCe4.mjs";
import { o as requiredWorkerHelperError } from "./required-worker-profile-B0DIhkdC.mjs";
import { o as fingerprintResolvedProviderAuth, t as fingerprintAuthProfileCredential } from "./execution-auth-binding-DMYnQN17.mjs";
import { n as resolveSimpleCompletionSelectionRequest } from "./simple-completion-selection-pOIS3Loe.mjs";
import { prepareModelForSimpleCompletion } from "@openclaw/ai/transports";
//#region src/agents/runtime-plan/model-route.ts
function normalizeRouteBaseUrl(value) {
	return value.replace(/\/+$/u, "");
}
function sameCompatibleRuntimeIds(left, right) {
	if (left === right) return true;
	if (!left || !right) return false;
	const leftIds = new Set(left);
	const rightIds = new Set(right);
	if (leftIds.size !== rightIds.size) return false;
	for (const id of leftIds) if (!rightIds.has(id)) return false;
	return true;
}
/** Compares the complete secret-free identity of two prepared model routes. */
function sameAgentRuntimeAuthModelRoute(left, right) {
	return left.provider.trim().toLowerCase() === right.provider.trim().toLowerCase() && left.modelId === right.modelId && left.api === right.api && left.authRequirement === right.authRequirement && left.requestTransportOverrides === right.requestTransportOverrides && sameCompatibleRuntimeIds(left.runtimePolicy?.compatibleIds, right.runtimePolicy?.compatibleIds) && normalizeRouteBaseUrl(left.baseUrl) === normalizeRouteBaseUrl(right.baseUrl);
}
//#endregion
//#region src/agents/runtime-plan/resolve-auth.ts
/** Resolves credentials for an immutable prepared runtime route. */
function listDistinctPreparedRuntimeAuthAttempts(attempts) {
	return attempts.filter((attempt, index) => {
		const route = attempt.plan.modelRoute;
		return !attempts.slice(0, index).some((previous) => {
			if (previous.allowAuthProfileFallback === false !== (attempt.allowAuthProfileFallback === false)) return false;
			const previousRoute = previous.plan.modelRoute;
			if (!route || !previousRoute) return !route && !previousRoute;
			return sameAgentRuntimeAuthModelRoute(route, previousRoute);
		});
	});
}
/** Resolves one complete prepared route/profile tuple without crossing retries mid-flight. */
async function resolvePreparedRuntimeAuthAttempts(params) {
	const hasAvailableCandidate = (attempt) => attempt.kind !== "profile" || preparedAgentRuntimeProfileAttemptHasCandidate({
		attempt,
		store: params.store,
		modelId: params.modelId
	});
	let firstError;
	let priorProfileAttempted = false;
	for (const attempt of listDistinctPreparedRuntimeAuthAttempts(params.attempts)) {
		if (!canRunPreparedAgentRuntimeAuthAttempt({
			attempt,
			priorProfileAttempted
		})) {
			firstError ??= /* @__PURE__ */ new Error("Prepared direct auth cannot bypass unavailable profiles.");
			continue;
		}
		if (!hasAvailableCandidate(attempt)) {
			firstError ??= /* @__PURE__ */ new Error("Prepared runtime auth candidates are temporarily unavailable.");
			continue;
		}
		try {
			let model = await params.materializeModel({
				plan: attempt.plan,
				model: params.model,
				forceResolve: params.forceCredentialScopedDirectModelResolve === true && attempt.kind === "direct" && Boolean(attempt.plan.selectedAuthMode) || shouldForceDirectAuthFallbackModelResolve({
					attempt,
					priorProfileAttempted
				})
			});
			if (!hasAvailableCandidate(attempt)) throw new Error("Prepared runtime auth candidates are temporarily unavailable.");
			const resolution = params.resolveAuth({
				attempt,
				model
			});
			priorProfileAttempted ||= attempt.kind === "profile";
			const resolved = await resolution;
			if (resolved.plan.forwardedAuthProfileId !== attempt.plan.forwardedAuthProfileId) model = await params.materializeModel({
				plan: resolved.plan,
				model,
				forceResolve: true
			});
			return {
				model,
				plan: resolved.plan,
				auth: resolved.auth
			};
		} catch (error) {
			if (error instanceof SecretSurfaceUnavailableError || error instanceof OAuthRefreshFailureError) throw error;
			firstError ??= error;
		}
	}
	throw toErrorObject(firstError, params.errorMessage);
}
function scopeAuthStoreToPreparedCandidates(store, profileIds) {
	const profileIdSet = new Set(profileIds);
	const includesProfile = (profileId) => profileIdSet.has(profileId);
	const profiles = {};
	for (const profileId of profileIds) {
		const profile = store.profiles[profileId];
		if (profile) profiles[profileId] = profile;
	}
	const order = store.order ? Object.fromEntries(Object.entries(store.order).map(([provider, ids]) => [provider, ids.filter(includesProfile)])) : void 0;
	const lastGood = store.lastGood ? Object.fromEntries(Object.entries(store.lastGood).filter(([, profileId]) => profileIdSet.has(profileId))) : void 0;
	const usageStats = store.usageStats ? Object.fromEntries(Object.entries(store.usageStats).filter(([profileId]) => profileIdSet.has(profileId))) : void 0;
	const runtimePersistedProfileIds = store.runtimePersistedProfileIds?.filter(includesProfile);
	const runtimeExternalProfileIds = store.runtimeExternalProfileIds?.filter(includesProfile);
	return {
		version: store.version,
		profiles,
		...order ? { order } : {},
		...lastGood ? { lastGood } : {},
		...usageStats ? { usageStats } : {},
		...runtimePersistedProfileIds ? { runtimePersistedProfileIds } : {},
		...runtimeExternalProfileIds || store.runtimeExternalProfileIdsAuthoritative === true ? {
			runtimeExternalProfileIds: runtimeExternalProfileIds ?? [],
			...store.runtimeExternalProfileIdsAuthoritative === true ? { runtimeExternalProfileIdsAuthoritative: true } : {}
		} : {}
	};
}
function preparedProfileIds(plan) {
	return [plan.forwardedAuthProfileId, ...plan.forwardedAuthProfileCandidateIds ?? []].filter((profileId, index, values) => Boolean(profileId?.trim()) && values.indexOf(profileId) === index);
}
/** Restricts a native auth consumer to the profiles selected for one physical route. */
function scopeAuthProfileStoreToPreparedPlan(store, plan) {
	return scopeAuthStoreToPreparedCandidates(store, plan.modelRoute?.authRequirement === "api-key" && plan.selectedAuthMode !== "oauth" ? [] : preparedProfileIds(plan));
}
function applyResolvedAuthToPlan(params) {
	const profileId = params.auth.profileId?.trim() || void 0;
	let source;
	let candidates;
	if (profileId) {
		const resolvedIndex = params.candidates.indexOf(profileId);
		const remainingCandidates = resolvedIndex >= 0 ? params.candidates.slice(resolvedIndex) : [profileId];
		source = params.plan.forwardedAuthProfileId ? params.plan.forwardedAuthProfileSource : "auto";
		candidates = source === "auto" ? remainingCandidates : [profileId];
	}
	return {
		...params.plan,
		forwardedAuthProfileId: profileId,
		forwardedAuthProfileSource: source,
		forwardedAuthProfileCandidateIds: candidates,
		selectedAuthMode: params.auth.mode,
		selectedAuthFlow: params.auth.authFlow
	};
}
function assertResolvedAuthMatchesPreparedRoute(params) {
	const route = params.plan.modelRoute;
	if (!route || providerModelRouteAcceptsAuthMode({
		requirement: route.authRequirement,
		mode: params.auth.mode,
		authRequirement: resolveProviderModelAuthPolicy({
			provider: route.provider,
			mode: params.auth.mode,
			authFlow: params.auth.authFlow,
			api: route.api,
			baseUrl: route.baseUrl
		}).authRequirement
	})) return;
	throw new Error(`Resolved ${params.auth.mode} credentials are incompatible with the selected ${route.authRequirement} route for ${route.provider}.`);
}
/** Resolves prepared same-route candidates without pinning the first unresolved profile. */
async function resolvePreparedRuntimeModelAuth(params) {
	const { plan, ...authParams } = params;
	const candidates = preparedProfileIds(plan);
	if (candidates.length === 0) {
		const auth = await getApiKeyForModelCore({
			...authParams,
			store: {
				version: 1,
				profiles: {}
			},
			lockedProfile: false,
			allowAuthProfileFallback: false,
			skipSetupProviderFallback: plan.modelRoute?.provider === "openai"
		});
		assertResolvedAuthMatchesPreparedRoute({
			plan,
			auth
		});
		return {
			auth,
			plan: applyResolvedAuthToPlan({
				plan,
				auth,
				candidates
			})
		};
	}
	if (plan.forwardedAuthProfileSource !== "auto") {
		const auth = await getApiKeyForModelCore({
			...authParams,
			profileId: plan.forwardedAuthProfileId,
			lockedProfile: Boolean(plan.forwardedAuthProfileId)
		});
		assertResolvedAuthMatchesPreparedRoute({
			plan,
			auth
		});
		return {
			auth,
			plan: applyResolvedAuthToPlan({
				plan,
				auth,
				candidates
			})
		};
	}
	const store = params.store;
	const currentCandidates = store ? candidates.filter((profileId) => !isProfileInCooldown(store, profileId, void 0, params.model.id)) : candidates;
	if (currentCandidates.length === 0) throw new Error("Prepared runtime auth candidates are temporarily unavailable.");
	const candidateStore = store ? scopeAuthStoreToPreparedCandidates(store, currentCandidates) : void 0;
	let firstError;
	let refreshFailure;
	for (const profileId of currentCandidates) try {
		const auth = await getApiKeyForModelCore({
			...authParams,
			profileId,
			lockedProfile: true,
			...candidateStore ? { store: candidateStore } : {}
		});
		assertResolvedAuthMatchesPreparedRoute({
			plan,
			auth
		});
		return {
			auth,
			plan: applyResolvedAuthToPlan({
				plan,
				auth,
				candidates: currentCandidates
			})
		};
	} catch (error) {
		if (error instanceof SecretSurfaceUnavailableError) throw error;
		if (!refreshFailure && error instanceof OAuthRefreshFailureError) refreshFailure = error;
		firstError ??= error;
	}
	if (refreshFailure) throw refreshFailure;
	throw toErrorObject(firstError, "Prepared runtime auth candidates could not be resolved.");
}
//#endregion
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
function resolveSimpleCompletionWorkerBlock(params, runtime) {
	return requiredWorkerHelperError(runtime.config, Boolean(params.workerInferenceAuthority)) ?? requiredWorkerHelperError(params.cfg ?? {}, Boolean(params.workerInferenceAuthority));
}
/** Prepares a model within the exact generation already held by its caller. */
async function prepareSimpleCompletionModel(params, assertCurrent) {
	params.signal?.throwIfAborted();
	const config = params.cfg ?? {};
	const blocked = resolveSimpleCompletionWorkerBlock(params, params.preparedModelRuntime);
	if (blocked) return blocked;
	params.workerInferenceAuthority?.assertCurrent();
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
	}, context, () => {
		assertCurrent?.();
		params.workerInferenceAuthority?.assertCurrent();
	}));
	params.workerInferenceAuthority?.assertCurrent();
	params.signal?.throwIfAborted();
	return prepared;
}
async function prepareSimpleCompletionModelCore(params, context, assertCurrent) {
	const blocked = resolveSimpleCompletionWorkerBlock(params, context.preparedModelRuntime);
	if (blocked) return blocked;
	params.workerInferenceAuthority?.assertCurrent();
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
		authStore = params.bindAuthOwner || initialModel.provider === "openai" ? await ensureAuthProfileStoreAsync(params.agentDir, {
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
		const resolveProfileAuthFlow = (profileId) => {
			const credential = authStore?.profiles[profileId];
			return credential?.type === "oauth" ? credential.authFlow : void 0;
		};
		const routeIntent = params.agentRuntimeId ? {
			runtimeId: params.agentRuntimeId,
			source: "explicit"
		} : resolveModelRouteIntent({
			config: params.cfg,
			provider: initialModel.provider,
			modelId: initialModel.id,
			agentId: params.agentId,
			primaryModel,
			resolveProfileAuthMode,
			resolveProfileAuthFlow
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
			resolveProfileAuthFlow,
			pinnedAuthRequirement: params.profileId ? resolveProviderModelAuthPolicy({
				provider: initialModel.provider,
				mode: resolveProfileAuthMode(params.profileId),
				authFlow: resolveProfileAuthFlow(params.profileId)
			}).authRequirement ?? void 0 : void 0,
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
	assertCurrent?.();
	params.signal?.throwIfAborted();
	const rawApiKey = auth.apiKey?.trim();
	if (!rawApiKey && !params.allowMissingApiKeyModes?.includes(auth.mode)) return {
		error: formatMissingAuthError(auth, resolvedModel.provider),
		auth
	};
	let authValue = rawApiKey;
	if (rawApiKey) {
		const runtimeAuth = await prepareProviderRuntimeAuth({
			provider: resolvedModel.provider,
			config: params.cfg,
			workspaceDir,
			env: process.env,
			assertCurrent,
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
		});
		assertCurrent?.();
		params.signal?.throwIfAborted();
		const preparedAuth = protectPreparedProviderRuntimeAuth({
			provider: resolvedModel.provider,
			preparedAuth: runtimeAuth
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
	await import("./ai-transport-runtime-host-GelzpX4Y.mjs");
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
	const completionTransport = params.transport === "provider-stream" ? void 0 : attachModelProviderRuntimePluginHandle(prepareModelForSimpleCompletion({
		apiRegistry: modelRuntime.apiRegistry,
		model: preparedModel,
		cfg: params.cfg,
		auth: {
			mode: resolvedAuth.mode,
			authFlow: resolvedAuth.authFlow
		},
		agentId: params.agentId
	}), providerRuntimeHandle);
	const selectedCredential = resolveSelectedModelCredential({
		provider: model.provider,
		profileId: auth.profileId,
		mode: auth.mode
	});
	const recordServiceTierObservation = params.transport === "provider-stream" && selectedCredential && selectedCredential.source !== "harness" && selectedCredential.requirement === "api-key" && model.provider === "openai" && model.api === "openai-responses" ? context.preparedModelRuntime.accountCatalog?.prepareServiceTierObserver({
		selectedCredential,
		credential: auth.profileId ? authStore?.profiles[auth.profileId] : void 0
	}) : void 0;
	return {
		model: bindModelLlmRuntime(preparedModel, modelRuntime.llmRuntime, completionTransport),
		auth: resolvedAuth,
		...sourceAuthFingerprint ? { sourceAuthFingerprint } : {},
		...recordServiceTierObservation ? { recordServiceTierObservation } : {}
	};
}
/** Keeps prepared facts in use until the internal completion owner releases its lease. */
async function acquireSimpleCompletionModelForAgent(params) {
	return await acquireSimpleCompletionModelWithSelection(params, (manifestPlugins) => resolveSimpleCompletionSelectionRequest({
		...params,
		manifestPlugins
	}));
}
/**
* Captures metadata before the caller selects the model to materialize.
* Each acquisition is new work: retained callers, such as context engines that restore a
* predecessor turn's context, select from the committed inventory instead of a retired one.
*/
async function acquireSimpleCompletionModelWithSelection(params, resolveRequest) {
	return await runOutsidePluginRuntimeGenerationScope(() => acquireCommittedSimpleCompletionModel(params, resolveRequest));
}
async function acquireCommittedSimpleCompletionModel(params, resolveRequest) {
	const blocked = requiredWorkerHelperError(params.cfg);
	if (blocked) return blocked;
	const agentId = params.agentId ?? resolveDefaultAgentId(params.cfg);
	const agentDir = params.agentDir?.trim() || resolveAgentDir(params.cfg, agentId);
	const tentativeRequest = resolveRequest();
	if (!tentativeRequest) return { error: `No model configured for agent ${agentId}.` };
	const tentativeSelection = tentativeRequest.selection;
	const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
	const resolvePluginIdScope = (selection, shorthandModelId) => createAgentRuntimeMetadataPluginIdScope({
		config: params.cfg,
		workspaceDir,
		selections: [{
			provider: selection.provider,
			modelId: selection.modelId,
			agentId
		}],
		...shorthandModelId ? { shorthandModelIds: [shorthandModelId] } : {}
	});
	const pluginIdScope = resolvePluginIdScope(tentativeSelection, tentativeRequest.shorthandModelId);
	const resolveMetadata = (scope) => resolvePluginMetadataSnapshot({
		config: params.cfg,
		env: process.env,
		workspaceDir,
		pluginIdScope: scope,
		allowWorkspaceScopedCurrent: true
	});
	let metadataSnapshot = resolveMetadata(pluginIdScope);
	const resolveSelection = () => {
		const request = resolveRequest(metadataSnapshot);
		return request ? {
			...request.selection,
			agentDir
		} : null;
	};
	let selection = resolveSelection();
	if (!selection) return { error: `No model configured for agent ${agentId}.` };
	const canonicalPluginIdScope = resolvePluginIdScope(selection, selection.provider === tentativeSelection.provider && selection.modelId === tentativeSelection.modelId ? tentativeRequest.shorthandModelId : void 0);
	if (canonicalPluginIdScope.key !== pluginIdScope.key) {
		metadataSnapshot = resolveMetadata(canonicalPluginIdScope);
		selection = resolveSelection();
		if (!selection) return { error: `No model configured for agent ${agentId}.` };
	}
	const { cfg: config, signal, modelResolver } = params;
	const requestedWorkspaceDir = resolveAgentWorkspaceDir(config, agentId);
	let releaseRuntime;
	let setupSettled = false;
	let callerReleased = true;
	let releaseCompletion;
	const setupCompletion = createDeferredCore();
	const releaseWhenUnused = () => {
		if (setupSettled && callerReleased) releaseCompletion ??= Promise.resolve().then(() => releaseRuntime?.());
		return releaseCompletion;
	};
	return {
		...await runWithAsyncWorkResources(async (onAcquired, captureWorkContext) => {
			onAcquired({ release: () => {
				setupSettled = true;
				setupCompletion.resolve();
				return releaseWhenUnused();
			} });
			const lease = await acquireAgentRunPreparedModelRuntime({
				config,
				agentId,
				agentDir,
				workspaceDir: requestedWorkspaceDir,
				loadRuntimePlugins: true,
				runtimePluginPurpose: "isolated-completion",
				runtimePluginSelections: [{
					provider: selection.provider,
					modelId: selection.modelId,
					agentId
				}]
			}, {
				catalogMode: "static",
				abortSignal: signal,
				pluginMetadataSnapshot: metadataSnapshot
			});
			releaseRuntime = () => lease[Symbol.asyncDispose]();
			const context = createPreparedSimpleCompletionResolverContext({
				preparedModelRuntime: lease.snapshot,
				workspaceDir: lease.snapshot.workspaceDir ?? requestedWorkspaceDir,
				modelResolver
			});
			const prepared = await withPluginRuntimeGenerationScope(context.preparedModelRuntime, () => {
				captureWorkContext();
				return prepareSimpleCompletionModelCore({
					...params,
					transport: "simple-completion",
					provider: selection.provider,
					modelId: selection.modelId,
					modelIdSource: "selected",
					agentDir: selection.agentDir,
					profileId: selection.profileId
				}, context);
			});
			signal?.throwIfAborted();
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
		}),
		selection
	};
}
//#endregion
export { resolvePreparedRuntimeModelAuth as a, resolvePreparedRuntimeAuthAttempts as i, acquireSimpleCompletionModelWithSelection as n, scopeAuthProfileStoreToPreparedPlan as o, prepareSimpleCompletionModel as r, acquireSimpleCompletionModelForAgent as t };
