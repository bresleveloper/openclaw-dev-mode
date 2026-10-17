import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { h as resolveDefaultAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./model-ref-shared-KBg0y299.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { t as findNormalizedProviderValue } from "./model-selection-normalize-AjjSfI-g.mjs";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-DmZI0WMx.mjs";
import { y as providerOwnsDynamicModelPreparation } from "./provider-runtime-Ck_Cecr1.mjs";
import { A as resolveConfiguredProviderConfig, D as normalizeResolvedModel, E as buildConfiguredFallbackModel, O as resolveRuntimeHooks, S as resolveModelWithPreparedRegistry, T as shouldCompareProviderRuntimeResolvedModel, b as resolveDynamicModelAuthProfile, j as mergeModelMediaInput, k as applyConfiguredProviderOverrides, w as resolveRuntimePreferredSuppressedModel, x as resolveExplicitModelWithRegistry, y as normalizeProviderModelRef } from "./prepared-model-runtime.plugin-generation-i7pfklM1.mjs";
import { i as AuthStorage, l as resolveModelWorkspaceDir, t as ModelRegistry } from "./model-registry-DKSOyLSb.mjs";
import { n as buildSuppressedBuiltInModelError } from "./model-suppression-CfHIDjY2.mjs";
import { a as resolveBundledStaticCatalogModel, i as resolveBundledProviderStaticCatalogModel } from "./model.static-catalog-TiEprsUC.mjs";
import "./model-selection-D3_rVb38.mjs";
import { f as getPreparedModelRuntimeSnapshot, p as loadPreparedModelRuntimeSnapshot } from "./prepared-model-runtime-BvTeWKXf.mjs";
//#region src/agents/embedded-agent-runner/model.ts
/** Creates isolated model/auth stores for harnesses that own model discovery themselves. */
function createEmptyAgentDiscoveryStores() {
	const authStorage = AuthStorage.inMemory({});
	return {
		authStorage,
		modelRegistry: ModelRegistry.inMemory(authStorage)
	};
}
function resolvePreparedAgentSnapshot(resolvedAgentDir, cfg, explicitWorkspaceDir, derivedWorkspaceDir, agentId) {
	const base = {
		...agentId ? { agentId } : {},
		agentDir: resolvedAgentDir,
		config: cfg ?? {},
		inheritedAuthDir: resolveLegacyInheritedAuthDir(cfg ?? {})
	};
	const published = getPreparedModelRuntimeSnapshot({
		...base,
		...explicitWorkspaceDir ? { workspaceDir: explicitWorkspaceDir } : {}
	});
	if (published || explicitWorkspaceDir || !derivedWorkspaceDir) return published;
	return getPreparedModelRuntimeSnapshot({
		...base,
		workspaceDir: derivedWorkspaceDir
	});
}
async function resolveModelAsync(provider, modelId, agentDir, cfg, options) {
	options?.assertCurrent?.();
	const resolvedAgentDir = agentDir ?? resolveDefaultAgentDir(cfg ?? {});
	const derivedWorkspaceDir = resolveModelWorkspaceDir(cfg, options?.workspaceDir, options?.agentId);
	const explicitPreparedRuntime = options?.preparedModelRuntime;
	const needsPreparedSnapshot = !explicitPreparedRuntime && !options?.skipAgentDiscovery && (!options?.authStorage || !options?.modelRegistry);
	const preparedSnapshot = (needsPreparedSnapshot ? resolvePreparedAgentSnapshot(resolvedAgentDir, cfg, options?.workspaceDir, derivedWorkspaceDir, options?.agentId) : void 0) ?? (needsPreparedSnapshot ? await loadPreparedModelRuntimeSnapshot({
		...options?.agentId ? { agentId: options.agentId } : {},
		agentDir: resolvedAgentDir,
		config: cfg ?? {},
		inheritedAuthDir: resolveLegacyInheritedAuthDir(cfg ?? {}),
		...derivedWorkspaceDir ? { workspaceDir: derivedWorkspaceDir } : {}
	}) : void 0);
	const preparedModelRuntime = explicitPreparedRuntime ?? preparedSnapshot;
	const resolve = async () => {
		options?.assertCurrent?.();
		const workspaceDir = options?.workspaceDir ?? preparedModelRuntime?.workspaceDir ?? derivedWorkspaceDir;
		const normalizedRef = normalizeProviderModelRef({
			provider,
			modelId,
			cfg,
			workspaceDir,
			modelIdSource: options?.modelIdSource
		});
		const logicalRef = {
			provider: normalizedRef.provider,
			model: normalizedRef.model
		};
		let { authStorage, modelRegistry } = options ?? {};
		if (!authStorage || !modelRegistry) {
			const stores = preparedModelRuntime?.createStores() ?? createEmptyAgentDiscoveryStores();
			authStorage ??= stores.authStorage;
			modelRegistry ??= options?.authStorage ? stores.modelRegistry.fork(authStorage) : stores.modelRegistry;
		}
		const runtimeHooks = resolveRuntimeHooks(options);
		let staticCatalogResolved = false;
		let staticCatalogModel;
		const getManifestStaticCatalogModel = () => {
			if (!staticCatalogResolved) {
				staticCatalogResolved = true;
				staticCatalogModel = preparedModelRuntime?.findConfiguredRuntimeModel(normalizedRef.provider, normalizedRef.model) ?? resolveBundledStaticCatalogModel({
					provider: normalizedRef.provider,
					modelId: normalizedRef.model,
					cfg,
					workspaceDir,
					includeRuntimeDiscovery: true,
					...preparedModelRuntime ? { metadataSnapshot: preparedModelRuntime.metadataSnapshot } : {}
				});
			}
			return staticCatalogModel;
		};
		const registryParams = {
			abortSignal: options?.abortSignal,
			assertCurrent: options?.assertCurrent,
			provider: normalizedRef.provider,
			modelId: normalizedRef.model,
			modelRegistry,
			cfg,
			agentDir: resolvedAgentDir,
			...options?.agentRuntimeId ? { agentRuntimeId: options.agentRuntimeId } : {},
			manifestAlias: normalizedRef.manifestAlias,
			workspaceDir,
			authProfileId: options?.authProfileId,
			authProfileMode: options?.authProfileMode,
			preferredProfile: options?.preferredProfile,
			runtimeHooks,
			getStaticCatalogModel: getManifestStaticCatalogModel
		};
		const explicitModel = resolveExplicitModelWithRegistry({
			...registryParams,
			preparedInlineProviderModels: cfg === preparedModelRuntime?.config ? preparedModelRuntime?.inlineProviderModels : void 0
		});
		if (explicitModel && explicitModel.kind !== "resolved") {
			const suppressedRuntimeModel = explicitModel.kind === "suppressed" ? await resolveRuntimePreferredSuppressedModel(registryParams) : void 0;
			options?.assertCurrent?.();
			if (suppressedRuntimeModel) return {
				model: suppressedRuntimeModel,
				logicalRef,
				authStorage,
				modelRegistry
			};
			return {
				error: explicitModel.error ?? buildUnknownModelError(registryParams),
				authStorage,
				modelRegistry
			};
		}
		const providerConfig = resolveConfiguredProviderConfig(cfg, normalizedRef.provider);
		const preparedMetadataSnapshot = preparedModelRuntime?.metadataSnapshot;
		let providerStaticCatalogLookup;
		const resolveStaticCatalogModel = async () => {
			if (!options?.allowBundledStaticCatalogFallback) return;
			return getManifestStaticCatalogModel() ?? await (providerStaticCatalogLookup ??= resolveBundledProviderStaticCatalogModel({
				provider: normalizedRef.provider,
				modelId: normalizedRef.model,
				cfg,
				workspaceDir,
				...preparedMetadataSnapshot ? { metadataSnapshot: preparedMetadataSnapshot } : {}
			}));
		};
		const resolveStaticCatalogFallbackModel = async () => {
			const catalogModel = await resolveStaticCatalogModel();
			options?.assertCurrent?.();
			if (!catalogModel) return;
			const overriddenStaticCatalogModel = applyConfiguredProviderOverrides({
				...registryParams,
				discoveredModel: catalogModel,
				providerConfig,
				providerMetadataOwners: preparedMetadataSnapshot?.owners,
				preferDiscoveredModelMetadata: true,
				preferDiscoveredTransport: options?.preferBundledStaticCatalogTransport,
				staticCatalogModel: catalogModel
			});
			if (!overriddenStaticCatalogModel) return;
			return normalizeResolvedModel({
				...registryParams,
				model: overriddenStaticCatalogModel
			});
		};
		const resolveDynamicAttempt = async () => {
			const authProfile = await resolveDynamicModelAuthProfile(registryParams);
			options?.assertCurrent?.();
			const preparedDynamicModel = options?.deferProviderDynamicModelPreparation ? void 0 : await runtimeHooks.prepareProviderDynamicModel({
				provider: normalizedRef.provider,
				config: cfg,
				workspaceDir,
				context: {
					config: cfg,
					agentDir: resolvedAgentDir,
					...options?.agentRuntimeId ? { agentRuntimeId: options.agentRuntimeId } : {},
					workspaceDir,
					provider: normalizedRef.provider,
					modelId: normalizedRef.model,
					modelRegistry,
					providerConfig,
					...authProfile
				}
			});
			options?.assertCurrent?.();
			return resolveModelWithPreparedRegistry({
				...registryParams,
				preparedAuthProfile: authProfile,
				...preparedDynamicModel ? { preparedDynamicModel } : {},
				...options?.allowBundledStaticCatalogFallback ? { skipConfiguredFallback: true } : {}
			});
		};
		const providerRuntimeMetadataShouldWin = shouldCompareProviderRuntimeResolvedModel(registryParams);
		let model = explicitModel?.kind === "resolved" && !providerRuntimeMetadataShouldWin ? explicitModel.model : void 0;
		model ??= await resolveDynamicAttempt();
		options?.assertCurrent?.();
		if (!model && !explicitModel && options?.allowBundledStaticCatalogFallback) {
			model = await resolveStaticCatalogFallbackModel();
			options?.assertCurrent?.();
			model ??= buildConfiguredFallbackModel({
				...registryParams,
				providerMetadataOwners: preparedMetadataSnapshot?.owners
			});
		}
		if (model && options?.allowBundledStaticCatalogFallback) {
			const staticMediaInput = (await resolveStaticCatalogModel())?.mediaInput;
			options?.assertCurrent?.();
			const resolvedMediaInput = model.mediaInput;
			const mediaInput = mergeModelMediaInput(staticMediaInput, resolvedMediaInput);
			if (mediaInput) model = {
				...model,
				mediaInput
			};
		}
		if (model) return {
			model,
			logicalRef,
			authStorage,
			modelRegistry
		};
		return {
			error: buildUnknownModelError(registryParams),
			...options?.deferProviderDynamicModelPreparation && providerOwnsDynamicModelPreparation({
				provider: normalizedRef.provider,
				config: cfg,
				workspaceDir
			}) ? { deferred: "provider-dynamic-model" } : {},
			authStorage,
			modelRegistry
		};
	};
	return preparedModelRuntime ? await withPluginRuntimeGenerationScope(preparedModelRuntime, resolve) : await resolve();
}
function buildUnknownModelError(params) {
	const suppressed = buildSuppressedBuiltInModelError({
		provider: params.provider,
		id: params.modelId,
		...params.cfg ? { config: params.cfg } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	if (suppressed) return suppressed;
	const base = `Unknown model: ${params.provider}/${params.modelId}`;
	const registrationHint = buildMissingProviderModelRegistrationHint(params);
	if (registrationHint) return `${base}. ${registrationHint}`;
	const hint = (params.runtimeHooks ?? resolveRuntimeHooks()).buildProviderUnknownModelHintWithPlugin({
		provider: params.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: process.env,
		context: {
			config: params.cfg,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			env: process.env,
			provider: params.provider,
			modelId: params.modelId
		}
	});
	return hint ? `${base}. ${hint}` : `${base}. Run \`openclaw models list --refresh --provider ${params.provider}\` to inspect this provider's model choices, then retry with a model supported by your account.`;
}
function buildMissingProviderModelRegistrationHint(params) {
	if (normalizeProviderId(params.provider) === "openai-codex") return `"openai-codex" is a legacy provider ID. Run \`openclaw doctor --fix\` to migrate legacy model and provider config to the current OpenAI format. If the provider has no authenticated profile, run \`openclaw models status\` to check provider auth and re-authenticate if needed. See https://docs.openclaw.ai/concepts/model-providers.`;
	const configuredModels = params.cfg?.agents?.defaults?.models;
	if (!configuredModels) return;
	const agentModelKey = modelKey(params.provider, params.modelId);
	const configuredEntry = configuredModels[agentModelKey] ?? configuredModels[`${params.provider}/${params.modelId}`];
	if (!configuredEntry) return;
	const agentRuntimeId = configuredEntry.agentRuntime?.id;
	if (agentRuntimeId) return `Found agents.defaults.models["${agentModelKey}"] bound to the "${agentRuntimeId}" agent runtime. Models served by an agent runtime come from that runtime and its linked account, not from models.providers["${params.provider}"].models[] — registering it there will not make it usable. Confirm "${params.modelId}" is still offered by the "${agentRuntimeId}" runtime and switch agents.defaults.model.primary to a currently available model (run \`openclaw models list --refresh --provider ${params.provider}\` to list them). See https://docs.openclaw.ai/concepts/model-providers.`;
	if (findNormalizedProviderValue(params.cfg?.models?.providers, params.provider)?.models?.some((entry) => entry.id === params.modelId)) return;
	return `Found agents.defaults.models["${agentModelKey}"], but no matching models.providers["${params.provider}"].models[] entry. Add { "id": "${params.modelId}", "name": "${params.modelId}" } to models.providers["${params.provider}"].models[] to register this provider model. For custom or proxy providers, also set api and baseUrl so requests route to the intended endpoint. See https://docs.openclaw.ai/concepts/model-providers.`;
}
//#endregion
export { resolveModelAsync as n, createEmptyAgentDiscoveryStores as t };
