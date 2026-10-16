import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { u as tryReadJsonSync } from "./json-files-C5mNTScg.mjs";
import { r as getPackageManifestMetadata, s as pluginCacheExistsSync } from "./package-manifest-CEbdS_C4.mjs";
import { t as PUBLIC_SURFACE_SOURCE_EXTENSIONS } from "./package-entrypoints-DCjwjOnD.mjs";
import { r as loadPluginManifest } from "./manifest-BXjFCp0F.mjs";
import { t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-CUtYxPiw.mjs";
import { s as resolveLoaderPackageRoot } from "./sdk-alias-A9rXLURS.mjs";
import { a as resolveBundledPluginScanDir, n as collectBundledPluginRuntimeSidecarArtifacts, o as rewriteBundledPluginEntryToBuiltPath, r as deriveBundledPluginIdHint, t as collectBundledPluginPublicSurfaceArtifacts } from "./bundled-plugin-scan-BmpR7Vr3.mjs";
import { i as buildChannelConfigSchema, o as buildJsonChannelConfigSchema } from "./config-schema-Be-FohaC.mjs";
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
	return Object.values(imported).find(isBuiltChannelConfigSchema) ?? null;
}
function resolveChannelConfigSchemaModulePath(pluginDir) {
	for (const relativePath of SOURCE_CONFIG_SCHEMA_CANDIDATES) {
		const candidate = path.join(pluginDir, relativePath);
		if (pluginCacheExistsSync(candidate)) return candidate;
	}
	for (const extension of PUBLIC_SURFACE_SOURCE_EXTENSIONS) {
		const candidate = path.join(pluginDir, `channel-config-api${extension}`);
		if (pluginCacheExistsSync(candidate)) return candidate;
	}
}
function loadChannelConfigSurfaceModuleSync(modulePath) {
	try {
		return resolveConfigSchemaExport(getCachedPluginModuleLoader({
			modulePath,
			importerUrl: import.meta.url,
			preferBuiltDist: true,
			loaderFilename: import.meta.url
		})(modulePath));
	} catch {
		return null;
	}
}
function resolvePackageChannelMeta(packageManifest, channelId) {
	const channelMeta = packageManifest?.channel;
	return channelMeta?.id?.trim() === channelId ? channelMeta : void 0;
}
function collectBundledChannelConfigsCore(params) {
	const channelIds = normalizeTrimmedStringList(params.manifest.channels);
	const existingChannelConfigs = params.manifest.channelConfigs && Object.keys(params.manifest.channelConfigs).length > 0 ? { ...params.manifest.channelConfigs } : {};
	if (channelIds.length === 0) return Object.keys(existingChannelConfigs).length > 0 ? existingChannelConfigs : void 0;
	const surfaceModulePath = resolveChannelConfigSchemaModulePath(params.pluginDir);
	const surface = surfaceModulePath ? loadChannelConfigSurfaceModuleSync(surfaceModulePath) : null;
	for (const channelId of channelIds) {
		const existing = existingChannelConfigs[channelId];
		const channelMeta = resolvePackageChannelMeta(params.packageManifest, channelId);
		const preferOver = normalizeTrimmedStringList(channelMeta?.preferOver);
		const uiHints = {
			...surface?.uiHints,
			...existing?.uiHints
		};
		if (!surface?.schema && !existing?.schema) continue;
		const runtime = surface?.runtime ?? existing?.runtime;
		const label = normalizeOptionalString(existing?.label) ?? normalizeOptionalString(channelMeta?.label);
		const description = normalizeOptionalString(existing?.description) ?? normalizeOptionalString(channelMeta?.blurb);
		const commands = existing?.commands ?? channelMeta?.commands;
		existingChannelConfigs[channelId] = {
			schema: surface?.schema ?? existing?.schema ?? {},
			...Object.keys(uiHints).length > 0 ? { uiHints } : {},
			...runtime ? { runtime } : {},
			...label ? { label } : {},
			...description ? { description } : {},
			...existing?.preferOver?.length ? { preferOver: existing.preferOver } : preferOver.length > 0 ? { preferOver } : {},
			...commands ? { commands } : {}
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
/** Lists bundled plugin metadata from source or built package layouts. */
function listBundledPluginMetadata(params) {
	const rootDir = path.resolve(params?.rootDir ?? OPENCLAW_PACKAGE_ROOT);
	const resolvedScanDir = params?.scanDir ? path.resolve(params.scanDir) : resolveBundledPluginScanDir({
		packageRoot: rootDir,
		runningFromBuiltArtifact: RUNNING_FROM_BUILT_ARTIFACT
	});
	const includeChannelConfigs = params?.includeChannelConfigs ?? !RUNNING_FROM_BUILT_ARTIFACT;
	const includeSyntheticChannelConfigs = params?.includeSyntheticChannelConfigs ?? includeChannelConfigs;
	if (!resolvedScanDir || !fs.existsSync(resolvedScanDir)) return Object.freeze([]);
	const entries = [];
	for (const dirName of fs.readdirSync(resolvedScanDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).toSorted((left, right) => left.localeCompare(right))) {
		const pluginDir = path.join(resolvedScanDir, dirName);
		const manifestResult = loadPluginManifest(pluginDir, false);
		if (!manifestResult.ok) continue;
		const packageJson = tryReadJsonSync(path.join(pluginDir, "package.json")) ?? void 0;
		const packageManifest = getPackageManifestMetadata(packageJson);
		const extensions = normalizeTrimmedStringList(packageManifest?.extensions);
		if (extensions.length === 0) continue;
		const sourceEntry = extensions[0];
		const builtEntry = rewriteBundledPluginEntryToBuiltPath(sourceEntry);
		if (!sourceEntry || !builtEntry) continue;
		const setupSourcePath = normalizeOptionalString(packageManifest?.setupEntry);
		const setupBuiltPath = rewriteBundledPluginEntryToBuiltPath(setupSourcePath);
		const setupSource = setupSourcePath && setupBuiltPath ? {
			source: setupSourcePath,
			built: setupBuiltPath
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
	return Object.freeze(entries);
}
/** Finds bundled plugin metadata by manifest id. */
function findBundledPluginMetadataById(pluginId, params) {
	return listBundledPluginMetadata(params).find((entry) => entry.manifest.id === pluginId);
}
//#endregion
export { listBundledPluginMetadata as n, findBundledPluginMetadataById as t };
