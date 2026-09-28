import { f as asSafeIntegerInRange } from "./number-coercion-CLj0HTDM.mjs";
import { D as withPluginCache, d as getPluginMetadataSnapshotCache, f as getProcessPluginCache, o as getPluginCache, p as getScopedPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.mjs";
import { a as getProcessGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { d as loadConfiguredHostedOfficialExternalPluginCatalogEntries, l as listOfficialExternalPluginCatalogEntries, m as resolveOfficialExternalPluginInstallSources, p as resolveOfficialExternalPluginInstall } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { h as resolveOfficialExternalPluginId, o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { a as resolveTrustedOfficialClawHubPackageName, l as resolveTrustedSourceLinkedOfficialNpmSpec, s as resolveTrustedSourceLinkedOfficialClawHubSpec } from "./official-external-install-records-CwKXyAFm.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-BnGMmE02.mjs";
import { _ as resolveClawHubBaseUrl } from "./clawhub-client-D8cfvjQG.mjs";
//#region src/plugins/management-catalog.ts
function resolveInstalledPluginClawHubIconSource(params) {
	const record = params.installRecord;
	const recordedPackage = record?.source === "clawhub" && normalizeOptionalString(record.clawhubPackage);
	const recordedUrl = record?.source === "clawhub" && normalizeOptionalString(record.clawhubUrl);
	if (recordedPackage && recordedUrl) return {
		kind: "clawhub",
		baseUrl: resolveClawHubBaseUrl(recordedUrl),
		packageName: recordedPackage
	};
	return params.clawhubPackage ? {
		kind: "clawhub",
		baseUrl: "https://clawhub.ai",
		packageName: params.clawhubPackage
	} : void 0;
}
function resolvePluginIconSource(params) {
	const normalizedPluginId = params.metadata.normalizePluginId(params.pluginId);
	const manifest = params.metadata.byPluginId.get(normalizedPluginId);
	const localIconPath = normalizeOptionalString(manifest?.iconPath);
	if (localIconPath && manifest) return {
		kind: "file",
		path: localIconPath,
		rootPath: manifest.rootDir
	};
}
async function resolvePluginIconSources(params) {
	const { metadata, env } = params;
	const pluginId = metadata.normalizePluginId(params.pluginId);
	const file = resolvePluginIconSource({
		metadata,
		pluginId
	});
	const sources = file ? [file] : [];
	const record = metadata.index.plugins.find((candidate) => metadata.normalizePluginId(candidate.pluginId) === pluginId);
	if (!record) return sources;
	const ownership = createInstalledPluginOwnershipResolver(metadata.index, env).resolvePackage(record.pluginId);
	const installOwner = ownership.ok ? ownership.value.installOwner : void 0;
	const installRecord = installOwner ? metadata.index.installRecords[installOwner] : void 0;
	const { clawhubPackage } = resolveInstalledHostedOfficialEntry({
		record,
		installOwner,
		installRecord,
		officialEntries: prepareCatalogEntries((await loadOfficialCatalog()).entries),
		bundledOfficialEntries: prepareCatalogEntries(listOfficialExternalPluginCatalogEntries())
	});
	const remote = resolveInstalledPluginClawHubIconSource({
		installRecord,
		clawhubPackage
	});
	if (remote) sources.push(remote);
	return sources;
}
function resolvePluginActivityIconSource(params) {
	const pluginId = params.metadata.normalizePluginId(params.pluginId);
	const manifest = params.metadata.byPluginId.get(pluginId);
	if (!manifest) return;
	const overrides = manifest.toolActivityIconPaths;
	const iconPath = (params.toolName && overrides && Object.hasOwn(overrides, params.toolName) ? overrides[params.toolName] : void 0) ?? manifest.activityIconPath;
	return iconPath ? {
		kind: "file",
		path: iconPath,
		rootPath: manifest.rootDir
	} : void 0;
}
function getManagedPluginCache(metadata) {
	if (metadata) return getPluginMetadataSnapshotCache(metadata);
	const scoped = getScopedPluginCache();
	if (scoped?.kind === "operation") return scoped;
	const candidate = getProcessPluginCache().desiredMetadata;
	if (candidate && candidate.boot === getProcessGatewayPluginMetadataSnapshot()) return candidate.cache;
	return getPluginCache();
}
function withManagedPluginCache(run) {
	return (params) => withPluginCache(getManagedPluginCache(params.metadata), () => run(params));
}
/** Clear process-stable catalog snapshots after an explicit owner reload. */
function clearManagedPluginCatalogCache() {
	const cache = getManagedPluginCache();
	cache.officialCatalog = void 0;
	cache.pluginVersionCategories = void 0;
}
function mergeCatalogMetadata(hosted, bundled, options) {
	const hostedManifest = getOfficialExternalPluginCatalogManifest(hosted);
	const bundledManifest = getOfficialExternalPluginCatalogManifest(bundled);
	const bundledCatalog = bundledManifest?.catalog;
	const bundledPlugin = bundledManifest?.plugin;
	const bundledName = normalizeOptionalString(bundled.name);
	const bundledDescription = normalizeOptionalString(bundled.description);
	const bundledKind = normalizeOptionalString(bundled.kind);
	const bundledSource = normalizeOptionalString(bundled.source);
	const hostedFeatured = typeof hosted.featured === "boolean" ? hosted.featured : false;
	const mergedCatalog = bundledCatalog || hostedManifest?.catalog || options.hostedFeaturedAuthoritative && hostedFeatured ? {
		...hostedManifest?.catalog,
		...bundledCatalog,
		...options.hostedFeaturedAuthoritative ? { featured: hostedFeatured } : {}
	} : void 0;
	if (!mergedCatalog && !bundledPlugin) return hosted;
	return {
		...hosted,
		...!normalizeOptionalString(hosted.name) && bundledName ? { name: bundledName } : {},
		...!normalizeOptionalString(hosted.description) && bundledDescription ? { description: bundledDescription } : {},
		...!normalizeOptionalString(hosted.kind) && bundledKind ? { kind: bundledKind } : {},
		...!normalizeOptionalString(hosted.source) && bundledSource ? { source: bundledSource } : {},
		[MANIFEST_KEY]: {
			...hostedManifest,
			...bundledPlugin ? { plugin: {
				...hostedManifest?.plugin,
				...bundledPlugin
			} } : {},
			...mergedCatalog ? { catalog: mergedCatalog } : {}
		}
	};
}
function prepareCatalogEntry(entry) {
	const install = resolveOfficialExternalPluginInstall(entry);
	const sources = resolveOfficialExternalPluginInstallSources(entry, { resolvedInstall: install });
	const clawhubSpec = sources.find((source) => source.source === "clawhub")?.spec;
	const npmSpec = sources.find((source) => source.source === "npm")?.spec;
	return {
		entry,
		install,
		selectedSource: sources[0],
		clawhub: clawhubSpec ? parseClawHubPluginSpec(clawhubSpec) : void 0,
		npmPackage: npmSpec ? parseRegistryNpmSpec(npmSpec)?.name : void 0
	};
}
function prepareCatalogEntries(entries) {
	let prepared;
	return () => prepared ??= entries.map(prepareCatalogEntry);
}
/**
* Overlay local runtime identity and ordering after an exact package/source match.
* Hosted curation wins; bundled Featured state survives only in fallback mode.
*/
function overlayBundledOfficialPluginCatalogMetadata(entries, options) {
	const bundledFacts = entries.length > 0 ? listOfficialExternalPluginCatalogEntries().map(prepareCatalogEntry) : [];
	return entries.map((entry) => {
		const { clawhub, npmPackage } = prepareCatalogEntry(entry);
		const matches = bundledFacts.filter((bundled) => clawhub && bundled.clawhub?.name === clawhub.name || npmPackage && bundled.npmPackage === npmPackage);
		const bundled = matches.length === 1 ? matches[0]?.entry : void 0;
		if (bundled) return mergeCatalogMetadata(entry, bundled, options);
		if (!options.hostedFeaturedAuthoritative) return entry;
		const hostedManifest = getOfficialExternalPluginCatalogManifest(entry);
		if (entry.featured !== true && !hostedManifest?.catalog) return entry;
		return {
			...entry,
			[MANIFEST_KEY]: {
				...hostedManifest,
				catalog: {
					...hostedManifest?.catalog,
					featured: entry.featured === true
				}
			}
		};
	});
}
async function loadOfficialCatalog() {
	const cache = getManagedPluginCache();
	if (!cache.officialCatalog) {
		const promise = loadConfiguredHostedOfficialExternalPluginCatalogEntries().then((result) => {
			const hostedFeaturedAuthoritative = result.source === "hosted" || result.source === "hosted-snapshot";
			return {
				entries: overlayBundledOfficialPluginCatalogMetadata(result.entries, { hostedFeaturedAuthoritative }),
				hostedFeaturedAuthoritative,
				..."error" in result ? { error: result.error } : {}
			};
		});
		cache.officialCatalog = promise;
		promise.catch(() => {
			if (cache.officialCatalog === promise) cache.officialCatalog = void 0;
		});
	}
	return cache.officialCatalog;
}
function normalizeKinds(kind) {
	const values = (typeof kind === "string" ? [kind] : kind ?? []).map((value) => value.trim()).filter(Boolean);
	return values.length > 0 ? [...new Set(values)] : void 0;
}
function normalizeCatalogMetadata(value) {
	if (!isRecord(value)) return;
	const featured = typeof value.featured === "boolean" ? value.featured : void 0;
	const order = typeof value.order === "number" && Number.isFinite(value.order) ? value.order : void 0;
	return featured === void 0 && order === void 0 ? void 0 : {
		...featured !== void 0 ? { featured } : {},
		...order !== void 0 ? { order } : {}
	};
}
function normalizeFeaturedAt(value) {
	return asSafeIntegerInRange(value, { min: 0 });
}
/** Preserve the shipped coarse category projection for older catalog clients. */
function deriveLegacyPluginCategory(manifest) {
	if (!manifest) return;
	if (manifest.channels.length > 0 || Object.keys(manifest.channelConfigs ?? {}).length > 0) return "channel";
	const mediaProvider = Object.keys(manifest.imageGenerationProviderMetadata ?? {}).length > 0 || Object.keys(manifest.videoGenerationProviderMetadata ?? {}).length > 0 || Object.keys(manifest.musicGenerationProviderMetadata ?? {}).length > 0 || Object.keys(manifest.mediaUnderstandingProviderMetadata ?? {}).length > 0;
	if (manifest.providers.length > 0 || manifest.providerEndpoints?.length || manifest.modelCatalog || mediaProvider) return "provider";
	const kinds = normalizeKinds(manifest.kind);
	if (kinds?.includes("memory")) return "memory";
	if (kinds?.includes("context-engine")) return "context-engine";
	if (manifest.contracts?.tools?.length || Object.keys(manifest.toolMetadata ?? {}).length > 0 || manifest.skills.length > 0) return "tool";
}
function firstPluginError(diagnostics, pluginId) {
	return diagnostics.find((diagnostic) => diagnostic.level === "error" && diagnostic.pluginId === pluginId)?.message;
}
function compareCatalogEntries(left, right) {
	const featured = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
	if (featured !== 0) return featured;
	if (left.featured && right.featured) {
		const leftFeaturedAt = left.featuredAt;
		const rightFeaturedAt = right.featuredAt;
		if (leftFeaturedAt !== void 0 || rightFeaturedAt !== void 0) {
			if (leftFeaturedAt === void 0) return 1;
			if (rightFeaturedAt === void 0) return -1;
			if (leftFeaturedAt !== rightFeaturedAt) return rightFeaturedAt - leftFeaturedAt;
		}
	}
	const order = (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER);
	return order !== 0 ? order : left.name.localeCompare(right.name);
}
function resolveInstalledOfficialCatalogEntry(params) {
	if (!params.packageName) return;
	const matches = params.entries().filter(({ clawhub, npmPackage }) => (params.source === "clawhub" ? clawhub?.name : npmPackage) === params.packageName);
	return matches.length === 1 ? matches[0] : void 0;
}
function resolveInstalledPluginPresentation(params) {
	const { record, manifest, officialEntry, hostedListingAuthoritative } = params;
	const localName = (manifest?.name !== record.packageName ? manifest?.name : void 0) ?? manifest?.channelCatalogMeta?.label ?? record.pluginId;
	const localDescription = manifest?.description ?? manifest?.channelCatalogMeta?.blurb ?? manifest?.packageDescription;
	const name = (hostedListingAuthoritative ? normalizeOptionalString(officialEntry?.title) : void 0) ?? localName;
	const description = (hostedListingAuthoritative ? normalizeOptionalString(officialEntry?.description) : void 0) ?? localDescription;
	const version = record.packageVersion ?? manifest?.version;
	return {
		name,
		...description ? { description } : {},
		...version ? { version } : {}
	};
}
function resolveInstalledHostedOfficialEntry(params) {
	const identityPluginId = params.installOwner ?? params.record.pluginId;
	const trustedOfficialClawHubSpec = params.installRecord ? resolveTrustedSourceLinkedOfficialClawHubSpec({
		pluginId: identityPluginId,
		record: params.installRecord
	}) : void 0;
	const trustedOfficialNpmSpec = params.installRecord ? resolveTrustedSourceLinkedOfficialNpmSpec({
		pluginId: identityPluginId,
		record: params.installRecord
	}) : void 0;
	const sourceLinkedOfficialClawHubPackage = trustedOfficialClawHubSpec ? parseClawHubPluginSpec(trustedOfficialClawHubSpec)?.name : void 0;
	const currentOfficialClawHubPackage = params.installRecord ? resolveTrustedOfficialClawHubPackageName(params.installRecord) : void 0;
	const trustedOfficialNpmPackage = trustedOfficialNpmSpec ? parseRegistryNpmSpec(trustedOfficialNpmSpec)?.name : void 0;
	const bundledPublishedEntry = params.record.origin === "bundled" ? resolveInstalledOfficialCatalogEntry({
		entries: params.bundledOfficialEntries,
		packageName: params.record.packageName,
		source: "npm"
	}) : void 0;
	const installedOfficialIdentity = sourceLinkedOfficialClawHubPackage ? {
		source: "clawhub",
		packageName: sourceLinkedOfficialClawHubPackage
	} : trustedOfficialNpmPackage ? {
		source: "npm",
		packageName: trustedOfficialNpmPackage
	} : currentOfficialClawHubPackage && (!params.record.packageName || params.record.packageName === currentOfficialClawHubPackage) ? {
		source: "clawhub",
		packageName: currentOfficialClawHubPackage
	} : bundledPublishedEntry && params.record.packageName ? {
		source: "npm",
		packageName: params.record.packageName
	} : void 0;
	const hasInstalledOfficialProvenance = Boolean(installedOfficialIdentity && (!params.record.packageName || params.record.packageName === installedOfficialIdentity.packageName));
	const bundledOfficialEntry = bundledPublishedEntry ?? resolveInstalledOfficialCatalogEntry({
		entries: params.bundledOfficialEntries,
		packageName: hasInstalledOfficialProvenance ? installedOfficialIdentity?.packageName : void 0,
		source: installedOfficialIdentity?.source ?? "clawhub"
	});
	const hostedPackageName = installedOfficialIdentity?.source === "npm" ? bundledOfficialEntry?.clawhub?.name : installedOfficialIdentity?.packageName;
	return {
		entry: resolveInstalledOfficialCatalogEntry({
			entries: params.officialEntries,
			packageName: hasInstalledOfficialProvenance ? hostedPackageName : void 0,
			source: "clawhub"
		})?.entry,
		clawhubPackage: hasInstalledOfficialProvenance ? hostedPackageName : void 0
	};
}
function resolveOfficialEntryById(entries, pluginId) {
	return entries.find((entry) => resolveOfficialExternalPluginId(entry) === pluginId);
}
//#endregion
export { resolvePluginIconSource as _, getManagedPluginCache as a, normalizeFeaturedAt as c, prepareCatalogEntry as d, resolveInstalledHostedOfficialEntry as f, resolvePluginActivityIconSource as g, resolveOfficialEntryById as h, firstPluginError as i, normalizeKinds as l, resolveInstalledPluginPresentation as m, compareCatalogEntries as n, loadOfficialCatalog as o, resolveInstalledPluginClawHubIconSource as p, deriveLegacyPluginCategory as r, normalizeCatalogMetadata as s, clearManagedPluginCatalogCache as t, prepareCatalogEntries as u, resolvePluginIconSources as v, withManagedPluginCache as y };
