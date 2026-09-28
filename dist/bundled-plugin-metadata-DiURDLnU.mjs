import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { r as getPackageManifestMetadata, s as pluginCacheExistsSync } from "./package-manifest-C8sTeZKW.mjs";
import { s as resolveLoaderPackageRoot } from "./sdk-alias-DjyX8sAu.mjs";
import { t as PUBLIC_SURFACE_SOURCE_EXTENSIONS } from "./public-surface-runtime-B_fTpq__.mjs";
import { i as normalizeBundledPluginStringList, n as collectBundledPluginRuntimeSidecarArtifacts, o as resolveBundledPluginScanDir, r as deriveBundledPluginIdHint, s as rewriteBundledPluginEntryToBuiltPath, t as collectBundledPluginPublicSurfaceArtifacts } from "./bundled-plugin-scan-BXXDA_cr.mjs";
import { r as loadPluginManifest } from "./manifest-DHkEL08H.mjs";
import { m as tryReadJsonSync } from "./json-files-C0HSMh2Z.mjs";
import { i as buildChannelConfigSchema, o as buildJsonChannelConfigSchema } from "./config-schema-BJ55TtqJ.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/plugins/bundled-channel-config-metadata.ts
/** Loads bundled channel config schema metadata from source or public surface modules. */
const SOURCE_CONFIG_SCHEMA_CANDIDATES = [
	path.join("src", "config-schema.ts"),
	path.join("src", "config-schema.js"),
	path.join("src", "config-schema.mts"),
	path.join("src", "config-schema.mjs"),
	path.join("src", "config-schema.cts"),
	path.join("src", "config-schema.cjs")
];
const PUBLIC_CONFIG_SURFACE_BASENAMES = ["channel-config-api"];
function isBuiltChannelConfigSchema(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return Boolean(candidate.schema && typeof candidate.schema === "object");
}
function isJsonSchemaConfigSurface(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	if (typeof candidate.safeParse === "function" || typeof candidate.toJSONSchema === "function") return false;
	return typeof candidate.type === "string" || Array.isArray(candidate.anyOf) || Array.isArray(candidate.oneOf) || Array.isArray(candidate.allOf) || Array.isArray(candidate.enum) || Object.hasOwn(candidate, "const");
}
function resolveConfigSchemaExport(imported) {
	for (const [name, value] of Object.entries(imported)) if (name.endsWith("ChannelConfigSchema") && isBuiltChannelConfigSchema(value)) return value;
	for (const [name, value] of Object.entries(imported)) {
		if (!name.endsWith("ConfigSchema") || name.endsWith("AccountConfigSchema")) continue;
		if (isBuiltChannelConfigSchema(value)) return value;
		if (isJsonSchemaConfigSurface(value)) return buildJsonChannelConfigSchema(value);
		if (value && typeof value === "object") return buildChannelConfigSchema(value);
	}
	for (const value of Object.values(imported)) if (isBuiltChannelConfigSchema(value)) return value;
	return null;
}
function getModuleLoader(modulePath) {
	return getCachedPluginModuleLoader({
		modulePath,
		importerUrl: import.meta.url,
		preferBuiltDist: true,
		loaderFilename: import.meta.url
	});
}
function resolveChannelConfigSchemaModulePath(pluginDir) {
	for (const relativePath of SOURCE_CONFIG_SCHEMA_CANDIDATES) {
		const candidate = path.join(pluginDir, relativePath);
		if (pluginCacheExistsSync(candidate)) return candidate;
	}
	for (const basename of PUBLIC_CONFIG_SURFACE_BASENAMES) for (const extension of PUBLIC_SURFACE_SOURCE_EXTENSIONS) {
		const candidate = path.join(pluginDir, `${basename}${extension}`);
		if (pluginCacheExistsSync(candidate)) return candidate;
	}
}
function loadChannelConfigSurfaceModuleSync(modulePath) {
	try {
		return resolveConfigSchemaExport(getModuleLoader(modulePath)(modulePath));
	} catch {
		return null;
	}
}
function resolvePackageChannelMeta(packageManifest, channelId) {
	const channelMeta = packageManifest?.channel;
	return channelMeta?.id?.trim() === channelId ? channelMeta : void 0;
}
function collectBundledChannelConfigsCore(params) {
	const channelIds = normalizeBundledPluginStringList(params.manifest.channels);
	const existingChannelConfigs = params.manifest.channelConfigs && Object.keys(params.manifest.channelConfigs).length > 0 ? { ...params.manifest.channelConfigs } : {};
	if (channelIds.length === 0) return Object.keys(existingChannelConfigs).length > 0 ? existingChannelConfigs : void 0;
	const surfaceModulePath = resolveChannelConfigSchemaModulePath(params.pluginDir);
	const surface = surfaceModulePath ? loadChannelConfigSurfaceModuleSync(surfaceModulePath) : null;
	for (const channelId of channelIds) {
		const existing = existingChannelConfigs[channelId];
		const channelMeta = resolvePackageChannelMeta(params.packageManifest, channelId);
		const preferOver = normalizeBundledPluginStringList(channelMeta?.preferOver);
		const uiHints = surface?.uiHints || existing?.uiHints ? {
			...surface?.uiHints && Object.keys(surface.uiHints).length > 0 ? surface.uiHints : {},
			...existing?.uiHints && Object.keys(existing.uiHints).length > 0 ? existing.uiHints : {}
		} : void 0;
		if (!surface?.schema && !existing?.schema) continue;
		existingChannelConfigs[channelId] = {
			schema: surface?.schema ?? existing?.schema ?? {},
			...uiHints && Object.keys(uiHints).length > 0 ? { uiHints } : {},
			...surface?.runtime ?? existing?.runtime ? { runtime: surface?.runtime ?? existing?.runtime } : {},
			...normalizeOptionalString(existing?.label) ?? normalizeOptionalString(channelMeta?.label) ? { label: normalizeOptionalString(existing?.label) ?? normalizeOptionalString(channelMeta?.label) } : {},
			...normalizeOptionalString(existing?.description) ?? normalizeOptionalString(channelMeta?.blurb) ? { description: normalizeOptionalString(existing?.description) ?? normalizeOptionalString(channelMeta?.blurb) } : {},
			...existing?.preferOver?.length ? { preferOver: existing.preferOver } : preferOver.length > 0 ? { preferOver } : {},
			...existing?.commands ?? channelMeta?.commands ? { commands: existing?.commands ?? channelMeta?.commands } : {}
		};
	}
	return Object.keys(existingChannelConfigs).length > 0 ? existingChannelConfigs : void 0;
}
//#endregion
//#region src/plugins/bundled-plugin-metadata.ts
const OPENCLAW_PACKAGE_ROOT = resolveLoaderPackageRoot({
	modulePath: fileURLToPath(import.meta.url),
	moduleUrl: import.meta.url
}) ?? fileURLToPath(new URL("../..", import.meta.url));
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const RUNNING_FROM_BUILT_ARTIFACT = CURRENT_MODULE_PATH.includes(`${path.sep}dist${path.sep}`) || CURRENT_MODULE_PATH.includes(`${path.sep}dist-runtime${path.sep}`);
function readPackageManifest(pluginDir) {
	const packagePath = path.join(pluginDir, "package.json");
	return tryReadJsonSync(packagePath) ?? void 0;
}
function resolveBundledPluginMetadataScanDir(packageRoot, scanDir) {
	if (scanDir) return path.resolve(scanDir);
	return resolveBundledPluginScanDir({
		packageRoot,
		runningFromBuiltArtifact: RUNNING_FROM_BUILT_ARTIFACT
	});
}
function collectBundledPluginMetadata(resolvedScanDir, includeChannelConfigs, includeSyntheticChannelConfigs) {
	if (!resolvedScanDir || !fs.existsSync(resolvedScanDir)) return [];
	const entries = [];
	for (const dirName of fs.readdirSync(resolvedScanDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).toSorted((left, right) => left.localeCompare(right))) {
		const pluginDir = path.join(resolvedScanDir, dirName);
		const manifestResult = loadPluginManifest(pluginDir, false);
		if (!manifestResult.ok) continue;
		const packageJson = readPackageManifest(pluginDir);
		const packageManifest = getPackageManifestMetadata(packageJson);
		const extensions = normalizeBundledPluginStringList(packageManifest?.extensions);
		if (extensions.length === 0) continue;
		const sourceEntry = normalizeOptionalString(extensions[0]);
		const builtEntry = rewriteBundledPluginEntryToBuiltPath(sourceEntry);
		if (!sourceEntry || !builtEntry) continue;
		const setupSourcePath = normalizeOptionalString(packageManifest?.setupEntry);
		const setupSource = setupSourcePath && rewriteBundledPluginEntryToBuiltPath(setupSourcePath) ? {
			source: setupSourcePath,
			built: rewriteBundledPluginEntryToBuiltPath(setupSourcePath)
		} : void 0;
		const publicSurfaceArtifacts = collectBundledPluginPublicSurfaceArtifacts({
			pluginDir,
			sourceEntry,
			...setupSourcePath ? { setupEntry: setupSourcePath } : {}
		});
		const runtimeSidecarArtifacts = collectBundledPluginRuntimeSidecarArtifacts(publicSurfaceArtifacts);
		const channelConfigs = includeChannelConfigs && includeSyntheticChannelConfigs ? collectBundledChannelConfigsCore({
			pluginDir,
			manifest: manifestResult.manifest,
			packageManifest
		}) : manifestResult.manifest.channelConfigs;
		entries.push({
			dirName,
			idHint: deriveBundledPluginIdHint({
				entryPath: sourceEntry,
				manifestId: manifestResult.manifest.id,
				packageName: normalizeOptionalString(packageJson?.name),
				hasMultipleExtensions: extensions.length > 1
			}),
			source: {
				source: sourceEntry,
				built: builtEntry
			},
			...setupSource ? { setupSource } : {},
			...publicSurfaceArtifacts ? { publicSurfaceArtifacts } : {},
			...runtimeSidecarArtifacts ? { runtimeSidecarArtifacts } : {},
			...normalizeOptionalString(packageJson?.name) ? { packageName: normalizeOptionalString(packageJson?.name) } : {},
			...normalizeOptionalString(packageJson?.version) ? { packageVersion: normalizeOptionalString(packageJson?.version) } : {},
			...normalizeOptionalString(packageJson?.description) ? { packageDescription: normalizeOptionalString(packageJson?.description) } : {},
			...packageManifest ? { packageManifest } : {},
			manifest: {
				...manifestResult.manifest,
				...channelConfigs ? { channelConfigs } : {}
			}
		});
	}
	return entries;
}
/** Lists bundled plugin metadata from source or built package layouts. */
function listBundledPluginMetadata(params) {
	const resolvedScanDir = resolveBundledPluginMetadataScanDir(path.resolve(params?.rootDir ?? OPENCLAW_PACKAGE_ROOT), params?.scanDir ? path.resolve(params.scanDir) : void 0);
	const includeChannelConfigs = params?.includeChannelConfigs ?? !RUNNING_FROM_BUILT_ARTIFACT;
	const includeSyntheticChannelConfigs = params?.includeSyntheticChannelConfigs ?? includeChannelConfigs;
	return Object.freeze(collectBundledPluginMetadata(resolvedScanDir, includeChannelConfigs, includeSyntheticChannelConfigs));
}
/** Finds bundled plugin metadata by manifest id. */
function findBundledPluginMetadataById(pluginId, params) {
	return listBundledPluginMetadata(params).find((entry) => entry.manifest.id === pluginId);
}
//#endregion
export { listBundledPluginMetadata as n, findBundledPluginMetadataById as t };
