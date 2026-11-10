import { o as getPluginValueInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { n as getCurrentPluginMetadataSnapshotRuntime } from "./plugin-metadata-snapshot.runtime.js";
import { t as PREPARED_THINKING_POLICY } from "./provider-thinking-catalog-Bv_TFmaq.mjs";
//#region src/gateway/server-model-catalog-view.ts
const factsByCatalog = /* @__PURE__ */ new WeakMap();
function captureSessionRowPolicy(params) {
	const { metadataSnapshot: metadata, pluginRegistry } = params;
	const { entries: pluginEntries, ...pluginPolicy } = params.config?.plugins ?? {};
	const index = new Map(metadata.index.plugins.map((plugin) => [plugin.pluginId, plugin]));
	const codePolicy = (pluginId, value) => {
		const owner = getPluginValueInstance(value);
		return owner && (owner.sourceDigest !== void 0 || metadata.byPluginId.get(pluginId)?.origin === "bundled") ? { sourceDigest: owner.sourceDigest } : { unmanaged: value };
	};
	const catalogFacts = (entries) => entries?.map((entry) => {
		const { [PREPARED_THINKING_POLICY]: thinking, ...data } = entry;
		return {
			data,
			thinking: thinking && codePolicy(getPluginValueInstance(thinking.resolve)?.pluginId ?? "", thinking.resolve)
		};
	});
	const registeredOwners = new Set([
		...pluginRegistry.providers,
		...pluginRegistry.agentHarnesses,
		...pluginRegistry.cliBackends,
		...pluginRegistry.sessionExtensions
	].map((registration) => registration.pluginId));
	return {
		entries: catalogFacts(params.entries),
		routeVariants: catalogFacts(params.routeVariants),
		providers: pluginRegistry.providers.map(({ pluginId, source, rootDir, provider }) => ({
			pluginId,
			source,
			rootDir,
			code: codePolicy(pluginId, provider),
			id: provider.id,
			aliases: provider.aliases ? [...provider.aliases] : void 0,
			hookAliases: provider.hookAliases ? [...provider.hookAliases] : void 0,
			thinking: Boolean(provider.resolveThinkingProfile),
			normalization: Boolean(provider.normalizeModelId),
			fastMode: Boolean(provider.resolveFastModeSupport),
			serviceTiers: Boolean(provider.resolveServiceTiers)
		})),
		agentHarnesses: pluginRegistry.agentHarnesses.map(({ pluginId, source, rootDir, harness }) => ({
			pluginId,
			source,
			rootDir,
			code: codePolicy(pluginId, harness),
			id: harness.id,
			autoSelection: harness.autoSelection ? { providerIds: [...harness.autoSelection.providerIds] } : void 0,
			cloudPlacement: harness.cloudPlacement && {
				mode: harness.cloudPlacement.mode,
				devicePlacement: harness.cloudPlacement.devicePlacement && {
					requiredNodeCommands: [...harness.cloudPlacement.devicePlacement.requiredNodeCommands],
					consumesWorkerSlot: harness.cloudPlacement.devicePlacement.consumesWorkerSlot
				}
			},
			workspaceEnvironment: harness.workspaceEnvironment && { ...harness.workspaceEnvironment },
			supports: typeof harness.supports === "function",
			ownership: typeof harness.resolveSessionRuntimeOwnership === "function",
			asyncOwnership: typeof harness.resolveSessionRuntimeOwnershipAsync === "function"
		})),
		cliBackends: pluginRegistry.cliBackends.map(({ pluginId, source, rootDir, backend }) => ({
			pluginId,
			source,
			rootDir,
			code: codePolicy(pluginId, backend),
			id: backend.id,
			modelProvider: backend.modelProvider
		})),
		sessionExtensions: pluginRegistry.sessionExtensions.map(({ pluginId, source, rootDir, extension }) => ({
			pluginId,
			source,
			rootDir,
			code: codePolicy(pluginId, extension),
			namespace: extension.namespace,
			project: Boolean(extension.project)
		})),
		providerOwners: metadata.owners.providers,
		normalization: metadata.owners.modelIdNormalizationPolicies,
		pluginPolicy,
		manifests: metadata.plugins.filter((plugin) => registeredOwners.has(plugin.id) || plugin.providers.length > 0 || plugin.cliBackends.length > 0 || plugin.setup?.providers?.length || plugin.setup?.cliBackends?.length || plugin.activation?.onAgentHarnesses?.length || plugin.modelCatalog?.providers || plugin.modelIdNormalization).map((plugin) => {
			const installed = index.get(plugin.id);
			return {
				plugin,
				installed: installed && {
					pluginId: installed.pluginId,
					origin: installed.origin,
					enabled: installed.enabled,
					enabledByDefault: installed.enabledByDefault,
					enabledByDefaultOnPlatforms: installed.enabledByDefaultOnPlatforms,
					contributions: installed.contributions,
					source: installed.source,
					rootDir: installed.rootDir,
					manifestHash: installed.manifestHash,
					packageHash: installed.packageJson?.hash,
					packageVersion: installed.packageVersion,
					installRecordHash: installed.installRecordHash
				},
				config: pluginEntries?.[plugin.id]
			};
		})
	};
}
function createPreparedGatewayModelCatalog(params) {
	const catalog = {
		entries: params.entries,
		routeVariants: params.routeVariants,
		pluginRegistry: params.pluginRegistry
	};
	if (params.metadataSnapshot) factsByCatalog.set(catalog, {
		metadata: params.metadataSnapshot,
		rowPolicy: params.pluginRegistry ? captureSessionRowPolicy({
			...params,
			metadataSnapshot: params.metadataSnapshot,
			pluginRegistry: params.pluginRegistry
		}) : void 0
	});
	return catalog;
}
function readPreparedGatewaySessionRowPolicy(catalog) {
	return factsByCatalog.get(catalog)?.rowPolicy;
}
function readPreparedGatewayModelCatalogMetadata(catalog) {
	return catalog ? factsByCatalog.get(catalog)?.metadata : void 0;
}
/** A prepared miss stays authoritative instead of starting discovery during presentation. */
function readPreparedGatewayModelMetadata(cfg, catalog) {
	if (catalog) return readPreparedGatewayModelCatalogMetadata(catalog) ?? null;
	return getCurrentPluginMetadataSnapshotRuntime({
		config: cfg,
		allowSynchronousPolicyRead: false,
		allowScopedSnapshot: true,
		allowWorkspaceScopedSnapshot: true
	}) ?? null;
}
//#endregion
export { readPreparedGatewaySessionRowPolicy as i, readPreparedGatewayModelCatalogMetadata as n, readPreparedGatewayModelMetadata as r, createPreparedGatewayModelCatalog as t };
