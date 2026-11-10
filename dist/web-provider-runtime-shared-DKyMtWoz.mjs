import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { c as normalizePluginId } from "./config-state-DkDfCu7E.mjs";
import { f as getActivePluginRegistryWorkspaceDir } from "./runtime-DkPagH0y.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-BWMrcMOM.mjs";
import { d as hasExplicitPluginIdScope, p as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { n as buildPluginRuntimeLoadOptions, r as createPluginRuntimeLoaderLogger } from "./load-context-YqkPeFye.mjs";
import { a as registryContainsRuntimePluginIds, n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-BrXk-dcA.mjs";
import { a as hasCompletedPluginRuntimeRegistration } from "./plugin-runtime-artifact-binding-CqK5OPco.mjs";
import { b as isPluginRegistryLoadInFlight, i as loadOpenClawPlugins } from "./loader-runtime-load-DzFljQbT.mjs";
import { n as withActivatedPluginIds } from "./activation-context-ZGPJ_bJQ.mjs";
import "./loader-B8PRFJEU.mjs";
import { i as samePluginToolSource, n as getCurrentPluginToolInspection } from "./tool-inspection-state-BDgC0KbX.mjs";
//#region src/plugins/web-provider-runtime-shared.ts
function mergeInspectedProviderEntries(manifests, retainedPluginIds, inspected, supplemental) {
	const order = new Map(manifests.map((manifest, index) => [manifest.id, index]));
	const providers = [...inspected.filter((entry) => retainedPluginIds.has(entry.pluginId)), ...supplemental].toSorted((left, right) => (order.get(left.pluginId) ?? Number.MAX_SAFE_INTEGER) - (order.get(right.pluginId) ?? Number.MAX_SAFE_INTEGER));
	const ids = /* @__PURE__ */ new Set();
	return providers.filter(({ provider }) => {
		if (ids.has(provider.id.trim())) return false;
		ids.add(provider.id);
		return true;
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
		const bundledArtifactProviders = deps.resolveBundledPublicArtifactProviders?.({
			config: params.config,
			workspaceDir,
			env,
			onlyPluginIds: pluginIds,
			...params.manifestRecords ? { manifestRecords: params.manifestRecords } : {}
		});
		if (bundledArtifactProviders) return bundledArtifactProviders;
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
			cache: true,
			activate: false
		}));
		return deps.mapRegistryProviders({
			registry,
			onlyPluginIds: pluginIds
		});
	}
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
	const onlyPluginIds = shouldFilterProviders ? candidatePluginIds : void 0;
	const generationRegistry = getPluginRuntimeGenerationRegistry();
	const current = getCurrentPluginToolInspection(params.config, env, params.workspaceDir);
	if (generationRegistry && !current) return deps.mapRegistryProviders({
		registry: generationRegistry,
		onlyPluginIds
	});
	const loadOptions = buildPluginRuntimeLoadOptions({
		config,
		activationSourceConfig,
		autoEnabledReasons,
		workspaceDir,
		env,
		logger: createPluginRuntimeLoaderLogger(),
		manifestRegistry: params.manifestRecords ? {
			plugins: [...params.manifestRecords],
			diagnostics: []
		} : void 0
	}, {
		cache: true,
		activate: false,
		...hasExplicitPluginIdScope(candidatePluginIds) ? { onlyPluginIds: candidatePluginIds } : {}
	});
	const scopedRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const compatible = current ? void 0 : scopedRegistry ? registryContainsRuntimePluginIds(scopedRegistry, candidatePluginIds) ? scopedRegistry : void 0 : getLoadedRuntimePluginRegistry({
		env,
		loadOptions,
		workspaceDir,
		requiredPluginIds: candidatePluginIds
	});
	const hasExplicitEmptyScope = onlyPluginIds !== void 0 && onlyPluginIds.length === 0;
	if (compatible) {
		const providers = deps.mapRegistryProviders({
			registry: compatible,
			onlyPluginIds
		});
		if (compatible === scopedRegistry) {
			const inspectedPluginIds = new Set(compatible.plugins.filter((plugin) => hasCompletedPluginRuntimeRegistration(plugin) || plugin.status === "error" || plugin.status === "disabled").map((plugin) => plugin.id));
			if (candidatePluginIds !== void 0 || manifestRecords?.every((plugin) => inspectedPluginIds.has(plugin.id))) return providers;
		} else if (providers.length > 0 || hasExplicitEmptyScope) return providers;
	}
	if (isPluginRegistryLoadInFlight(loadOptions)) return [];
	if (hasExplicitEmptyScope) return [];
	if (candidatePluginIds && deps.resolveBundledRuntimeArtifactProviders) {
		const bundledArtifactProviders = deps.resolveBundledRuntimeArtifactProviders({
			config,
			workspaceDir,
			env,
			onlyPluginIds: candidatePluginIds,
			...manifestRecords ? { manifestRecords } : {}
		});
		if (bundledArtifactProviders) return bundledArtifactProviders;
	}
	const inspectedManifests = manifestRecords ?? current?.loadContext.manifestRegistry?.plugins;
	if (current && inspectedManifests) {
		const candidates = candidatePluginIds && new Set(candidatePluginIds);
		const retainedPluginIds = new Set(inspectedManifests.filter((manifest) => (!candidates || candidates.has(manifest.id)) && samePluginToolSource(current.inspection.manifests.get(manifest.id), manifest)).map((manifest) => manifest.id));
		const missingPluginIds = (candidatePluginIds ?? inspectedManifests.map((manifest) => manifest.id)).filter((id) => !retainedPluginIds.has(id));
		const supplementalOptions = {
			...loadOptions,
			onlyPluginIds: missingPluginIds,
			manifestRegistry: {
				plugins: [...inspectedManifests],
				diagnostics: current.loadContext.manifestRegistry?.diagnostics ?? []
			},
			installRecords: current.loadContext.installRecords,
			preferBuiltPluginArtifacts: current.loadContext.preferBuiltPluginArtifacts,
			expectedSourceDigests: current.loadContext.expectedSourceDigests
		};
		const supplemental = missingPluginIds.length ? current.inspection.withSupplementalCache(() => isPluginRegistryLoadInFlight(supplementalOptions) ? void 0 : loadOpenClawPlugins(supplementalOptions)) : void 0;
		current.inspection.assertCurrent();
		const registry = {
			...current.registry,
			plugins: [...current.registry.plugins.filter((plugin) => retainedPluginIds.has(plugin.id)), ...supplemental?.plugins ?? []],
			webSearchProviders: mergeInspectedProviderEntries(inspectedManifests, retainedPluginIds, current.registry.webSearchProviders, supplemental?.webSearchProviders ?? []),
			webFetchProviders: mergeInspectedProviderEntries(inspectedManifests, retainedPluginIds, current.registry.webFetchProviders, supplemental?.webFetchProviders ?? [])
		};
		return deps.mapRegistryProviders({
			registry,
			onlyPluginIds
		});
	}
	const registry = loadOpenClawPlugins(loadOptions);
	return deps.mapRegistryProviders({
		registry,
		onlyPluginIds
	});
}
//#endregion
export { resolvePluginWebProviders as t };
