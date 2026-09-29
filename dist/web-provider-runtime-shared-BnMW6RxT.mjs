import { s as normalizePluginId } from "./config-state-BEAL5gWH.mjs";
import { d as hasExplicitPluginIdScope, p as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { f as getActivePluginRegistryWorkspaceDir } from "./runtime-BvdPUus5.mjs";
import { Z as isPluginRegistryLoadInFlight, r as loadOpenClawPlugins } from "./loader-runtime-load-XbrcYJWd.mjs";
import { r as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-BttqxLSq.mjs";
import { n as createPluginRuntimeLoaderLogger, t as buildPluginRuntimeLoadOptions } from "./load-context-D-CZ4KSw.mjs";
import { n as withActivatedPluginIds } from "./activation-context-CNegFLwh.mjs";
import "./loader-Vq3hhSQk.mjs";
//#region src/plugins/web-provider-runtime-shared.ts
function resolveWebProviderRuntimeContext(params, deps) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDir();
	const shouldFilterProviders = params.config !== void 0 || params.onlyPluginIds !== void 0 || params.origin !== void 0 || params.sandboxed === true;
	const { config, activationSourceConfig, autoEnabledReasons, manifestRecords } = deps.resolveBundledResolutionConfig({
		...params,
		workspaceDir,
		env
	});
	const discoveredPluginIds = normalizePluginIdScope(deps.resolveCandidatePluginIds({
		config: params.config,
		workspaceDir,
		env,
		onlyPluginIds: params.onlyPluginIds,
		origin: params.origin,
		sandboxed: params.sandboxed,
		...manifestRecords ? { manifestRecords } : {}
	}));
	const allowedPluginIds = config?.plugins?.allow;
	const allowSet = allowedPluginIds?.length ? new Set(allowedPluginIds.map((pluginId) => normalizePluginId(pluginId))) : void 0;
	const allowlistedPluginIds = allowSet ? discoveredPluginIds?.filter((pluginId) => allowSet.has(normalizePluginId(pluginId))) : discoveredPluginIds;
	const candidatePluginIds = allowlistedPluginIds?.length ? allowlistedPluginIds : discoveredPluginIds;
	return {
		activationSourceConfig,
		autoEnabledReasons,
		config,
		env,
		manifestRecords,
		...params.manifestRecords ? { preparedManifestRegistry: {
			plugins: [...params.manifestRecords],
			diagnostics: []
		} } : {},
		loadPluginIds: candidatePluginIds,
		onlyPluginIds: shouldFilterProviders ? candidatePluginIds : void 0,
		workspaceDir
	};
}
function resolveWebProviderLoadOptions(context, params) {
	return buildPluginRuntimeLoadOptions({
		env: context.env,
		config: context.config,
		activationSourceConfig: context.activationSourceConfig,
		autoEnabledReasons: context.autoEnabledReasons,
		workspaceDir: context.workspaceDir,
		logger: createPluginRuntimeLoaderLogger(),
		...context.preparedManifestRegistry ? { manifestRegistry: context.preparedManifestRegistry } : {}
	}, {
		cache: params.cache ?? true,
		activate: params.activate ?? false,
		...hasExplicitPluginIdScope(context.loadPluginIds) ? { onlyPluginIds: context.loadPluginIds } : {}
	});
}
/** Resolves plugin web providers from setup, active runtime, or a scoped load. */
function resolvePluginWebProviders(params, deps) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDir();
	if (params.mode === "setup") {
		const pluginIds = deps.resolveCandidatePluginIds({
			config: params.config,
			workspaceDir,
			env,
			onlyPluginIds: params.onlyPluginIds,
			origin: params.origin,
			sandboxed: params.sandboxed,
			...params.manifestRecords ? { manifestRecords: params.manifestRecords } : {}
		}) ?? [];
		if (pluginIds.length === 0) return [];
		if (params.activate !== true) {
			const bundledArtifactProviders = deps.resolveBundledPublicArtifactProviders?.({
				config: params.config,
				workspaceDir,
				env,
				onlyPluginIds: pluginIds,
				...params.manifestRecords ? { manifestRecords: params.manifestRecords } : {}
			});
			if (bundledArtifactProviders) return bundledArtifactProviders;
		}
		const registry = loadOpenClawPlugins(buildPluginRuntimeLoadOptions({
			config: withActivatedPluginIds({
				config: params.config,
				pluginIds
			}),
			activationSourceConfig: params.config,
			autoEnabledReasons: {},
			workspaceDir,
			env,
			logger: createPluginRuntimeLoaderLogger(),
			...params.manifestRecords ? { manifestRegistry: {
				plugins: [...params.manifestRecords],
				diagnostics: []
			} } : {}
		}, {
			onlyPluginIds: pluginIds,
			cache: params.cache ?? true,
			activate: params.activate ?? false
		}));
		return deps.mapRegistryProviders({
			registry,
			onlyPluginIds: pluginIds
		});
	}
	const context = resolveWebProviderRuntimeContext(params, deps);
	const loadOptions = resolveWebProviderLoadOptions(context, params);
	const compatible = getLoadedRuntimePluginRegistry({
		env: context.env,
		loadOptions,
		workspaceDir: context.workspaceDir,
		requiredPluginIds: context.loadPluginIds
	});
	const hasExplicitEmptyScope = context.onlyPluginIds !== void 0 && context.onlyPluginIds.length === 0;
	if (compatible) {
		const providers = deps.mapRegistryProviders({
			registry: compatible,
			onlyPluginIds: context.onlyPluginIds
		});
		if (providers.length > 0 || hasExplicitEmptyScope) return providers;
	}
	if (isPluginRegistryLoadInFlight(loadOptions)) return [];
	if (hasExplicitEmptyScope) return [];
	if (params.activate !== true && context.loadPluginIds && deps.resolveBundledRuntimeArtifactProviders) {
		const bundledArtifactProviders = deps.resolveBundledRuntimeArtifactProviders({
			config: context.config,
			workspaceDir: context.workspaceDir,
			env: context.env,
			onlyPluginIds: context.loadPluginIds,
			...context.manifestRecords ? { manifestRecords: context.manifestRecords } : {}
		});
		if (bundledArtifactProviders) return bundledArtifactProviders;
	}
	const registry = loadOpenClawPlugins(loadOptions);
	return deps.mapRegistryProviders({
		registry,
		onlyPluginIds: context.onlyPluginIds
	});
}
//#endregion
export { resolvePluginWebProviders as t };
