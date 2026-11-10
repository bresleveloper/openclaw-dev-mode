import "./model-ref-shared-BRJ3VRZV.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { g as resolveDefaultAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { t as findNormalizedProviderValue } from "./model-selection-normalize-DulZGI4S.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-BO2hiLXD.mjs";
import { _ as providerOwnsDynamicModelPreparation } from "./provider-runtime-DZ8luukj.mjs";
import { i as resolveModelWorkspaceDir, t as ModelRegistry } from "./model-registry-pyM1O0Zs.mjs";
import { c as normalizeProviderModelRef, d as resolveModelWithPreparedRegistry, f as resolveRuntimePreferredSuppressedModel, h as resolveRuntimeHooks, l as resolveDynamicModelAuthProfile, m as buildConfiguredFallbackModel, p as shouldCompareProviderRuntimeResolvedModel, s as normalizeConfiguredProviderModel, u as resolveExplicitModelWithRegistry } from "./prepared-model-runtime.plugin-generation-DCZXy8Yr.mjs";
import { t as AuthStorage } from "./auth-storage-DHC97REI.mjs";
import { n as buildSuppressedBuiltInModelError } from "./model-suppression-BWbx1-dY.mjs";
import { a as resolveBundledStaticCatalogModel, i as resolveBundledProviderStaticCatalogModel } from "./model.static-catalog-JSpbzt04.mjs";
import { c as resolveConfiguredProviderConfig, d as mergeModelMediaInput } from "./model.configured-overrides-D557qnhf.mjs";
import { m as loadPreparedModelRuntimeSnapshot, p as getPreparedModelRuntimeSnapshot } from "./prepared-model-runtime-wDlPVSla.mjs";
//#region src/agents/embedded-agent-runner/model.ts
/** Creates isolated model/auth stores for harnesses that own model discovery themselves. */
function createEmptyAgentDiscoveryStores() {
	const authStorage = AuthStorage.inMemory({});
	return {
		authStorage,
		modelRegistry: ModelRegistry.inMemory(authStorage)
	};
}
async function resolveModelAsync(provider, modelId, agentDir, cfg, options) {
	options?.assertCurrent?.();
	const resolvedAgentDir = agentDir ?? resolveDefaultAgentDir(cfg ?? {});
	const derivedWorkspaceDir = resolveModelWorkspaceDir(cfg, options?.workspaceDir, options?.agentId);
	let preparedModelRuntime = options?.preparedModelRuntime;
	if (!preparedModelRuntime && !options?.skipAgentDiscovery && (!options?.authStorage || !options?.modelRegistry)) {
		const snapshotParams = {
			...options?.agentId ? { agentId: options.agentId } : {},
			agentDir: resolvedAgentDir,
			config: cfg ?? {},
			inheritedAuthDir: resolveLegacyInheritedAuthDir(cfg ?? {})
		};
		preparedModelRuntime = getPreparedModelRuntimeSnapshot({
			...snapshotParams,
			...options?.workspaceDir ? { workspaceDir: options.workspaceDir } : {}
		});
		if (!preparedModelRuntime && !options?.workspaceDir && derivedWorkspaceDir) preparedModelRuntime = getPreparedModelRuntimeSnapshot({
			...snapshotParams,
			workspaceDir: derivedWorkspaceDir
		});
		preparedModelRuntime ??= await loadPreparedModelRuntimeSnapshot({
			...snapshotParams,
			...derivedWorkspaceDir ? { workspaceDir: derivedWorkspaceDir } : {}
		});
	}
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
			return normalizeConfiguredProviderModel({
				...registryParams,
				discoveredModel: catalogModel,
				providerConfig,
				providerMetadataOwners: preparedMetadataSnapshot?.owners,
				preferDiscoveredModelMetadata: true,
				preferDiscoveredTransport: options?.preferBundledStaticCatalogTransport,
				staticCatalogModel: catalogModel
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
