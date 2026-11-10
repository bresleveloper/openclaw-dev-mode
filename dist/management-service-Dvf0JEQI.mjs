import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { C as retainPluginCache, c as getPluginCache, k as withPluginCache, m as getProcessPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { n as formatConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import { p as isValidSecretRef } from "./ref-contract-Bfd9_-Lp.mjs";
import { S as resolveIsConfigReadOnly } from "./paths-orClZ-2Z.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-C4n2JwGL.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { a as getProcessGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-jN_Zk4yK.mjs";
import { l as normalizeManifestCatalog } from "./manifest-gUPkNRN0.mjs";
import { c as normalizePluginId, u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { f as resolveConfigSecretRef, u as hasUnresolvedConfigPath } from "./resolution-facts-D_pto3MV.mjs";
import { r as isInstalledPluginEnabled, t as createInstalledPluginEnabledPredicate } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { h as resolveOfficialExternalPluginLabel, l as listOfficialExternalPluginCatalogEntries } from "./official-external-plugin-catalog-B5ALUbx8.mjs";
import { o as preparePluginMetadataMachineStateAsync } from "./installed-plugin-index-record-state-Cr6YHbHB.mjs";
import { g as resolveOfficialExternalPluginId, o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-8hS3NARf.mjs";
import { o as loadPluginMetadataSnapshot, u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { n as resolvePluginControlPlaneWorkspace, t as appendPluginControlPlaneWorkspaceDiagnostic } from "./control-plane-workspace-DZuGS_2S.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-R9aCxQcY.mjs";
import { r as resolveConfigWidePluginMetadataSnapshot } from "./io.plugin-metadata-DeOUS5WQ.mjs";
import { r as validatePluginSchemaValue } from "./schema-validator-B9g4ZpIt.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-vHcoMR69.mjs";
import { i as resolveManifestProviderAuthChoices } from "./provider-auth-choices-D2ZKE-Sc.mjs";
import { f as projectPluginOverviewCapabilities, h as projectInstalledPluginComponents, l as projectClawHubPluginInspection, m as emptyInstalledPluginComponents, p as readInstalledPluginOverview } from "./catalog-discovery-CSbNyDUD.mjs";
import { c as resolvePluginInstallRecordIntegrity, l as resolvePluginInstallRecordTrust, n as buildPluginCapabilitySummary, r as computeDeclaredSurfaceHash, u as resolvePluginPackageDeclaredSurface } from "./capability-summary-Cy4VIUND.mjs";
import { v as resolveClawHubBaseUrl } from "./clawhub-client-D1-XpvK5.mjs";
import { i as resolvePendingPluginCapabilityReview } from "./capability-consent-DUF3nrtk.mjs";
import { t as listRecommendedToolInstalls } from "./recommended-tool-installs-BMGbI_cP.mjs";
import { n as projectPluginInstallHealth } from "./status-snapshot-B7Fx086n.mjs";
import { r as fetchClawHubPluginDetail } from "./clawhub-plugin-catalog-DTFuPS1b.mjs";
import { _ as resolvePluginIconSource, a as loadOfficialCatalog, c as pluginVersionKey, d as projectPluginCatalogCategoryFacts, f as resolveInstalledHostedOfficialEntry, g as resolvePluginActivityIconSource, h as resolveOfficialEntryById, i as loadInstalledPluginCategories, l as prepareCatalogEntries, m as resolveInstalledPluginPresentation, n as compareCatalogEntries, o as normalizeFeaturedAt, p as resolveInstalledPluginClawHubIconSource, r as firstPluginError, s as normalizeKinds, u as prepareCatalogEntry, v as resolvePluginIconSources, y as withManagedPluginCache } from "./management-catalog-BL7CzeLI.mjs";
import { t as normalizeCatalogIconUrl } from "./catalog-icon-registry-QbEIkWWZ.mjs";
import { t as resolvePluginCredentialDescriptors } from "./credential-descriptors-VzjOtce-.mjs";
import { t as readPluginMcpAuthStatus } from "./mcp-auth-status-DRmnzE_5.mjs";
//#region src/plugins/credential-inspection.ts
/** Never resolve references; authored literals require the explicit administrator reveal flow. */
function inspectPluginCredentialValue(config, descriptor, env, reveal = false) {
	let value = config;
	for (const segment of descriptor.path) value = value !== null && typeof value === "object" && Object.hasOwn(value, segment) ? Reflect.get(value, segment) : void 0;
	const path = formatConcreteConfigPath(descriptor.path, config);
	const ref = resolveConfigSecretRef({
		config,
		path,
		value,
		defaults: config.secrets?.defaults,
		includeResolved: true
	});
	if (ref && isValidSecretRef(ref)) return {
		kind: "reference",
		ref,
		unresolved: hasUnresolvedConfigPath(config, path)
	};
	if (typeof value === "string" && value.length) return {
		kind: "literal",
		...reveal ? { value } : {}
	};
	if (value !== void 0 && value !== "") return { kind: "invalid" };
	const envVar = descriptor.envVars.find((name) => Boolean(env[name]?.trim()));
	return envVar ? {
		kind: "environment",
		envVar
	} : { kind: "missing" };
}
//#endregion
//#region src/plugins/plugin-config-enablement.ts
function resolvePluginConfigEnablement(params) {
	const manifest = params.manifest;
	if (!manifest?.configSchema) return { mode: "ready" };
	const settings = normalizePluginsConfig(params.config.plugins).entries[normalizePluginId(params.pluginId)]?.config;
	const hasConfig = settings !== void 0;
	const result = validatePluginSchemaValue({
		origin: manifest.origin,
		schema: manifest.configSchema,
		cacheKey: manifest.schemaCacheKey ?? manifest.manifestPath,
		value: hasConfig ? settings : {},
		applyDefaults: true
	});
	if (result.ok) return { mode: "ready" };
	if (!hasConfig && !result.schemaError) return { mode: "missing" };
	return {
		mode: "invalid",
		error: result.errors[0]?.text ?? "invalid plugin config"
	};
}
//#endregion
//#region src/plugins/management-service.ts
const CLAWHUB_CATEGORY_BATCH_LIMIT = 200;
function resolveManagedPluginMetadataParams(config, env) {
	const workspace = resolvePluginControlPlaneWorkspace({
		config,
		env
	});
	return {
		config,
		env,
		...workspace.workspaceDir !== void 0 ? { workspaceDir: workspace.workspaceDir } : {}
	};
}
function resolveManagedPluginMetadata(config, env) {
	const boot = getProcessGatewayPluginMetadataSnapshot();
	const candidate = getProcessPluginCache().desiredMetadata;
	return candidate && candidate.boot === boot ? candidate.snapshot : resolvePluginMetadataSnapshot(resolveManagedPluginMetadataParams(config, env));
}
function loadFreshManagedPluginMetadata(config, env) {
	const capturedEnv = cloneEnvWithPlatformSemantics(env);
	const current = getPluginCache();
	const cache = current.kind === "operation" ? current : createPluginCache();
	return withPluginCache(cache, async () => {
		const configWide = Boolean(getProcessGatewayPluginMetadataSnapshot());
		const params = configWide ? {
			config,
			env: capturedEnv
		} : resolveManagedPluginMetadataParams(config, capturedEnv);
		const release = retainPluginCache(cache);
		try {
			(await preparePluginMetadataMachineStateAsync({ env: capturedEnv }))();
			return configWide ? resolveConfigWidePluginMetadataSnapshot({
				...params,
				allowCurrent: false
			}) : loadPluginMetadataSnapshot({
				...params,
				allowCurrent: false
			});
		} finally {
			release();
		}
	});
}
/** Publish desired install state for management without replacing the Gateway's boot facts. */
async function refreshManagedPluginMetadata(params) {
	const env = params.env ?? process.env;
	const boot = getProcessGatewayPluginMetadataSnapshot();
	const processCache = getProcessPluginCache();
	const assertCurrent = params.assertCurrent;
	const cache = createPluginCache();
	const snapshot = await withPluginCache(cache, () => loadFreshManagedPluginMetadata(params.config, env));
	assertCurrent?.();
	if (boot && getProcessGatewayPluginMetadataSnapshot() === boot && getProcessPluginCache() === processCache) processCache.desiredMetadata = {
		boot,
		cache,
		snapshot
	};
	return snapshot;
}
/** Resolve ordered branding sources from package bytes and exact installed provenance. */
const resolveManagedPluginIconSources = withManagedPluginCache(async (params) => {
	const env = params.env ?? process.env;
	const metadata = resolveManagedPluginMetadata(params.config, env);
	return resolvePluginIconSources({
		metadata,
		pluginId: params.pluginId,
		env
	});
});
const resolveManagedPluginActivityIconSource = withManagedPluginCache(async (params) => {
	const metadata = resolveManagedPluginMetadata(params.config, params.env ?? process.env);
	return resolvePluginActivityIconSource({
		...params,
		metadata
	});
});
/** Resolve only URLs currently owned by a manifest or bundled presentation catalog. */
function resolveManagedSetupCatalogIconUrl(params) {
	const requested = normalizeCatalogIconUrl(normalizeOptionalString(params.iconUrl) ?? "");
	if (!requested) return;
	const env = params.env ?? process.env;
	return [...resolveManifestProviderAuthChoices({
		config: params.config,
		env,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false
	}).map((choice) => choice.icon), ...listRecommendedToolInstalls().map((install) => install.icon)].some((iconUrl) => normalizeCatalogIconUrl(normalizeOptionalString(iconUrl) ?? "") === requested) ? requested : void 0;
}
/** Build cold installed state merged with the hosted official catalog and bundled curation. */
const listManagedPlugins = withManagedPluginCache(async (params) => {
	const sourceConfig = resolvePluginActivationSourceConfig({ config: params.config });
	const env = params.env ?? process.env;
	const workspace = resolvePluginControlPlaneWorkspace({
		config: params.config,
		env
	});
	const metadata = params.metadata ?? resolveManagedPluginMetadata(params.config, env);
	const officialCatalog = params.officialCatalog ?? await loadOfficialCatalog(params.cachedCatalogOnly);
	const isEnabled = createInstalledPluginEnabledPredicate(metadata.index.plugins, params.config, env);
	const ownership = createInstalledPluginOwnershipResolver(metadata.index, env);
	const { diagnostics: pluginDiagnostics } = projectPluginInstallHealth({
		plugins: metadata.index.plugins.map((record) => {
			const manifest = metadata.byPluginId.get(record.pluginId);
			const enabled = isEnabled(record.pluginId);
			return {
				id: record.pluginId,
				source: manifest?.source ?? record.source ?? record.manifestPath,
				enabled,
				status: enabled ? "loaded" : "disabled"
			};
		}),
		diagnostics: [...metadata.diagnostics]
	}, {
		metadata,
		config: params.config,
		env
	}, ownership);
	const officialEntries = prepareCatalogEntries(officialCatalog.entries);
	const bundledOfficialEntries = prepareCatalogEntries(listOfficialExternalPluginCatalogEntries());
	const installedIconsById = /* @__PURE__ */ new Map();
	const installedClawHubPackages = /* @__PURE__ */ new Set();
	const discoveryRegistry = resolveClawHubBaseUrl();
	const categoryTargetsByRegistry = /* @__PURE__ */ new Map();
	let categoryTargetCount = 0;
	const plugins = metadata.index.plugins.map((record) => {
		const enabled = isEnabled(record.pluginId);
		const manifest = metadata.byPluginId.get(record.pluginId);
		const localCatalog = normalizeManifestCatalog(manifest?.catalog);
		const packageOwner = ownership.resolvePackage(record.pluginId);
		const installOwner = packageOwner.ok ? packageOwner.value.installOwner : void 0;
		const installRecord = installOwner ? metadata.index.installRecords[installOwner] : void 0;
		const { entry: officialEntry, clawhubPackage } = resolveInstalledHostedOfficialEntry({
			record,
			...installOwner ? { installOwner } : {},
			installRecord,
			officialEntries,
			bundledOfficialEntries
		});
		if (clawhubPackage) installedClawHubPackages.add(clawhubPackage);
		const officialCatalogMetadata = officialEntry ? normalizeManifestCatalog(getOfficialExternalPluginCatalogManifest(officialEntry)?.catalog) : void 0;
		const catalog = clawhubPackage && officialCatalog.hostedFeaturedAuthoritative ? {
			...localCatalog,
			...officialCatalogMetadata,
			featured: officialEntry?.featured === true
		} : officialCatalogMetadata ? {
			...localCatalog,
			...officialCatalogMetadata
		} : localCatalog;
		const setup = resolvePluginConfigEnablement({
			config: sourceConfig,
			pluginId: record.pluginId,
			manifest
		});
		const configError = setup.mode === "invalid" ? setup.error : void 0;
		const error = firstPluginError(pluginDiagnostics, record.pluginId) ?? configError;
		const kind = normalizeKinds(manifest?.kind);
		const removable = record.origin !== "bundled" && Boolean(installOwner);
		const hostedListingAuthoritative = Boolean(clawhubPackage) && officialCatalog.hostedFeaturedAuthoritative === true;
		const featuredAt = hostedListingAuthoritative && catalog?.featured === true ? normalizeFeaturedAt(officialEntry?.featuredAt) : void 0;
		const presentation = resolveInstalledPluginPresentation({
			record,
			manifest,
			officialEntry,
			hostedListingAuthoritative
		});
		const plugin = {
			id: record.pluginId,
			name: presentation.name,
			installed: true,
			enabled,
			state: error ? "error" : enabled ? "enabled" : setup.mode === "missing" ? "needs-setup" : "disabled",
			removable
		};
		Object.assign(plugin, projectPluginCatalogCategoryFacts(manifest, enabled));
		if (record.packageName) plugin.packageName = record.packageName;
		const remoteIcon = resolveInstalledPluginClawHubIconSource({
			installRecord,
			clawhubPackage
		});
		const discoveryClawHubPackage = remoteIcon?.baseUrl === discoveryRegistry ? remoteIcon.packageName : void 0;
		if (discoveryClawHubPackage) plugin.clawhubPackage = discoveryClawHubPackage;
		if (presentation.description) plugin.description = presentation.description;
		if (presentation.version) plugin.version = presentation.version;
		if (kind) plugin.kind = kind;
		if (record.origin) plugin.origin = record.origin;
		if (catalog?.featured !== void 0) plugin.featured = catalog.featured;
		if (featuredAt !== void 0) plugin.featuredAt = featuredAt;
		if (catalog?.order !== void 0) plugin.order = catalog.order;
		const normalizedPluginId = metadata.normalizePluginId(record.pluginId);
		if (!installedIconsById.has(normalizedPluginId)) installedIconsById.set(normalizedPluginId, Boolean(resolvePluginIconSource({
			metadata,
			pluginId: record.pluginId
		}) || remoteIcon));
		if (installedIconsById.get(normalizedPluginId)) plugin.hasIcon = true;
		const iconOwner = metadata.byPluginId.get(normalizedPluginId);
		if (iconOwner?.activityIconPath) plugin.hasActivityIcon = true;
		if (iconOwner?.toolActivityIconPaths) plugin.activityIconTools = Object.keys(iconOwner.toolActivityIconPaths).toSorted();
		if (manifest?.channels.length) plugin.channelIds = [...manifest.channels];
		if (error) plugin.error = error;
		if (!plugin.categories?.length && record.origin !== "bundled" && installRecord?.source === "clawhub") {
			const name = normalizeOptionalString(installRecord.clawhubPackage);
			const version = normalizeOptionalString(installRecord.version);
			if (name && version) {
				const baseUrl = resolveClawHubBaseUrl(installRecord.clawhubUrl);
				let categoryTargets = categoryTargetsByRegistry.get(baseUrl);
				if (!categoryTargets) {
					categoryTargets = /* @__PURE__ */ new Map();
					categoryTargetsByRegistry.set(baseUrl, categoryTargets);
				}
				const key = pluginVersionKey(name, version);
				const target = categoryTargets.get(key);
				if (target) target.plugins.push(plugin);
				else if (categoryTargetCount < CLAWHUB_CATEGORY_BATCH_LIMIT) {
					categoryTargets.set(key, {
						request: {
							name,
							version
						},
						plugins: [plugin]
					});
					categoryTargetCount += 1;
				}
			}
		}
		return plugin;
	});
	for (const [baseUrl, categoryTargets] of categoryTargetsByRegistry) {
		const resolved = await loadInstalledPluginCategories({
			baseUrl,
			packages: [...categoryTargets.values()].map((target) => target.request),
			cachedOnly: params.cachedCatalogOnly
		});
		if (!resolved) {
			pluginDiagnostics.push({
				level: "warn",
				message: resolved === null ? "Installed plugin category enrichment unavailable; reload plugins or restart the Gateway to retry." : "Installed plugin category enrichment pending; refresh the plugin list to see completed enrichment."
			});
			continue;
		}
		for (const [key, target] of categoryTargets) {
			const categories = resolved.get(key);
			if (!categories?.length) continue;
			for (const plugin of target.plugins) plugin.categories = [...categories];
		}
	}
	const installedIds = new Set(plugins.map((plugin) => plugin.id));
	const installedPackageNames = new Set(plugins.flatMap((plugin) => plugin.packageName ? [plugin.packageName] : []));
	for (const facts of officialEntries()) {
		const { entry, clawhub, npmPackage } = facts;
		const pluginId = resolveOfficialExternalPluginId(entry);
		const manifest = getOfficialExternalPluginCatalogManifest(entry);
		const manifestCatalog = normalizeManifestCatalog(manifest?.catalog);
		const catalog = manifestCatalog || typeof entry.featured === "boolean" ? {
			...manifestCatalog,
			...manifestCatalog?.featured === void 0 && typeof entry.featured === "boolean" ? { featured: entry.featured } : {}
		} : void 0;
		if (!pluginId || !catalog || installedIds.has(pluginId) || clawhub && (installedPackageNames.has(clawhub.name) || installedClawHubPackages.has(clawhub.name)) || npmPackage && installedPackageNames.has(npmPackage)) continue;
		const kind = normalizeKinds(entry.kind);
		const install = facts.selectedSource?.source === "clawhub" && clawhub && !clawhub.version ? {
			source: "clawhub",
			packageName: clawhub.name
		} : facts.install ? {
			source: "official",
			pluginId
		} : void 0;
		const packageName = npmPackage ?? clawhub?.name;
		const description = normalizeOptionalString(entry.description);
		const version = normalizeOptionalString(entry.version);
		const featuredAt = catalog.featured === true ? normalizeFeaturedAt(entry.featuredAt) : void 0;
		plugins.push({
			id: pluginId,
			name: resolveOfficialExternalPluginLabel(entry),
			...packageName ? { packageName } : {},
			...clawhub ? { clawhubPackage: clawhub.name } : {},
			...description ? { description } : {},
			...version ? { version } : {},
			...kind ? { kind } : {},
			origin: "official",
			installed: false,
			enabled: false,
			state: "not-installed",
			...catalog.featured !== void 0 ? { featured: catalog.featured } : {},
			...featuredAt !== void 0 ? { featuredAt } : {},
			...catalog.order !== void 0 ? { order: catalog.order } : {},
			...install ? { install } : {}
		});
	}
	const diagnostics = getProcessGatewayPluginMetadataSnapshot() ? pluginDiagnostics : appendPluginControlPlaneWorkspaceDiagnostic(pluginDiagnostics, workspace);
	if (officialCatalog.error) diagnostics.push({
		level: "warn",
		message: `Official plugin catalog fallback: ${officialCatalog.error}`
	});
	return {
		plugins: plugins.toSorted(compareCatalogEntries),
		diagnostics,
		mutationAllowed: !resolveIsConfigReadOnly(env)
	};
});
/** Inspect one plugin's manifest, operator grants, and recorded install provenance. */
const inspectManagedPlugin = withManagedPluginCache(async (params) => {
	const env = params.env ?? process.env;
	if (params.clawhub) {
		const [remote, local] = await Promise.all([fetchClawHubPluginDetail(params.clawhub), listManagedPlugins({
			config: params.config,
			env
		})]);
		return projectClawHubPluginInspection({
			remote,
			local,
			config: params.config
		});
	}
	if (!params.pluginId) throw new ManagedPluginLifecycleError("A plugin inspection identity is required.", { kind: "invalid-request" });
	const metadata = resolveManagedPluginMetadata(params.config, env);
	const pluginId = metadata.normalizePluginId(params.pluginId);
	const record = metadata.index.plugins.find((candidate) => candidate.pluginId === pluginId);
	const enabled = isInstalledPluginEnabled(metadata.index, pluginId, params.config);
	const pendingReview = resolvePendingPluginCapabilityReview(pluginId);
	if (pendingReview) {
		const manifest = metadata.byPluginId.get(pluginId);
		return {
			ok: true,
			plugin: {
				id: pluginId,
				name: pendingReview.name,
				...pendingReview.version ? { version: pendingReview.version } : {},
				...record?.origin ? { origin: record.origin } : {},
				installed: Boolean(record),
				enabled
			},
			declared: pendingReview.declared,
			overview: readInstalledPluginOverview(manifest),
			components: projectInstalledPluginComponents({
				manifest,
				declared: pendingReview.declared
			}),
			grants: pendingReview.grants,
			reviewToken: pendingReview.reviewToken,
			...pendingReview.source ? { source: pendingReview.source } : {},
			...pendingReview.trust ? { trust: pendingReview.trust } : {}
		};
	}
	const officialCatalog = await loadOfficialCatalog();
	if (record) {
		const manifest = metadata.byPluginId.get(pluginId);
		const ownership = createInstalledPluginOwnershipResolver(metadata.index, env).resolvePackage(pluginId);
		const installOwner = ownership.ok ? ownership.value.installOwner : void 0;
		const installRecord = installOwner ? metadata.index.installRecords[installOwner] : void 0;
		const { entry: officialEntry, clawhubPackage } = resolveInstalledHostedOfficialEntry({
			record,
			...installOwner ? { installOwner } : {},
			installRecord,
			officialEntries: prepareCatalogEntries(officialCatalog.entries),
			bundledOfficialEntries: prepareCatalogEntries(listOfficialExternalPluginCatalogEntries())
		});
		const spec = installRecord?.resolvedSpec ?? installRecord?.spec;
		const packageName = installRecord?.clawhubPackage ?? record.packageName;
		const source = installRecord ? {
			kind: installRecord.source,
			...spec ? { spec: redactSensitiveUrlLikeString(spec) } : {},
			...packageName ? { packageName } : {},
			...resolvePluginInstallRecordIntegrity(installRecord)
		} : record.origin === "bundled" ? { kind: "bundled" } : void 0;
		const trust = resolvePluginInstallRecordTrust(installRecord);
		const summary = buildPluginCapabilitySummary({
			manifest: manifest ?? {},
			origin: record.origin,
			entryConfig: params.config.plugins?.entries?.[pluginId]
		});
		const declared = ownership.ok ? resolvePluginPackageDeclaredSurface(ownership.value, metadata.byPluginId) : summary.declared;
		if (!declared) throw new ManagedPluginLifecycleError(`Plugin package "${installOwner}" has incomplete manifest metadata.`);
		const mcpAuth = enabled ? await readPluginMcpAuthStatus({
			config: params.config,
			pluginId,
			metadata
		}) : void 0;
		return {
			ok: true,
			plugin: {
				id: pluginId,
				...resolveInstalledPluginPresentation({
					record,
					manifest,
					officialEntry,
					hostedListingAuthoritative: Boolean(clawhubPackage) && officialCatalog.hostedFeaturedAuthoritative === true
				}),
				origin: record.origin,
				installed: true,
				enabled
			},
			...source ? { source } : {},
			...summary,
			declared,
			components: projectInstalledPluginComponents({
				manifest,
				declared
			}),
			overview: readInstalledPluginOverview(manifest),
			credentials: manifest ? resolvePluginCredentialDescriptors(manifest).map((descriptor) => {
				const credential = inspectPluginCredentialValue(params.config, descriptor, env);
				const status = credential.kind === "reference" ? credential.unresolved ? "unresolved" : "configured" : credential.kind === "literal" || credential.kind === "environment" ? "configured" : credential.kind;
				return Object.assign({}, descriptor, { status });
			}) : [],
			...mcpAuth ? { mcpAuth } : {},
			reviewToken: computeDeclaredSurfaceHash(declared),
			...trust ? { trust } : {}
		};
	}
	const entry = resolveOfficialEntryById(officialCatalog.entries, pluginId);
	if (!entry) throw new ManagedPluginLifecycleError(`Plugin "${pluginId}" not found.`, { kind: "invalid-request" });
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	const { selectedSource, clawhub, npmPackage } = prepareCatalogEntry(entry);
	const packageName = npmPackage ?? clawhub?.name;
	const spec = selectedSource?.spec;
	const description = normalizeOptionalString(entry.description);
	const version = normalizeOptionalString(entry.version);
	const summary = buildPluginCapabilitySummary({
		manifest: manifest ?? {},
		origin: "official",
		entryConfig: params.config.plugins?.entries?.[pluginId]
	});
	return {
		ok: true,
		plugin: {
			id: pluginId,
			name: resolveOfficialExternalPluginLabel(entry),
			...version ? { version } : {},
			...description ? { description } : {},
			origin: "official",
			installed: false,
			enabled: false
		},
		source: {
			kind: "official-catalog",
			...spec ? { spec: redactSensitiveUrlLikeString(spec) } : {},
			...packageName ? { packageName } : {},
			...selectedSource?.expectedIntegrity ? {
				integrity: selectedSource.expectedIntegrity,
				integrityKind: selectedSource.source === "clawhub" ? "sha256" : "ssri"
			} : {}
		},
		...summary,
		components: emptyInstalledPluginComponents(),
		overview: { capabilities: projectPluginOverviewCapabilities(summary.declared, manifest?.uiCapabilities) },
		reviewToken: computeDeclaredSurfaceHash(summary.declared)
	};
});
//#endregion
export { resolveManagedPluginActivityIconSource as a, resolveManagedSetupCatalogIconUrl as c, refreshManagedPluginMetadata as i, resolvePluginConfigEnablement as l, listManagedPlugins as n, resolveManagedPluginIconSources as o, loadFreshManagedPluginMetadata as r, resolveManagedPluginMetadata as s, inspectManagedPlugin as t, inspectPluginCredentialValue as u };
