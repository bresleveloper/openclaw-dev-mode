import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import { l as getPluginCacheRoot, u as getPluginCacheSource } from "./plugin-cache-BABafcXD.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CBoxhfke.mjs";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-BBJTTIuE.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { l as pluginCacheRealpathSync, s as pluginCacheExistsSync } from "./package-manifest-CEbdS_C4.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-DkyLPnyV.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { t as loadChannelPluginModule } from "./module-loader-BeoBaI7s.mjs";
import { i as resolveBundledPluginGeneratedPath } from "./bundled-plugin-scan-BmpR7Vr3.mjs";
import { n as unwrapDefaultModuleExport } from "./module-export-BbYMQUy2.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/plugins/bundled-channel-runtime.ts
/** Loads bundled channel plugin runtime entries and setup metadata. */
function resolveBundledMetadataScope(params) {
	const overrideDir = params?.scanDir ? path.resolve(params.scanDir) : params?.rootDir ? resolveBundledPluginsDirForRoot(params.rootDir) : void 0;
	if (!overrideDir) return params?.rootDir ? { kind: "empty" } : { kind: "default" };
	if (!pluginCacheExistsSync(overrideDir)) return { kind: "empty" };
	return {
		kind: "env",
		env: {
			...process.env,
			OPENCLAW_BUNDLED_PLUGINS_DIR: overrideDir,
			...isVitestRuntimeEnv() ? { OPENCLAW_TEST_TRUST_BUNDLED_PLUGINS_DIR: "1" } : {}
		}
	};
}
function resolveBundledPluginsDirForRoot(rootDir) {
	return [
		path.join(rootDir, "extensions"),
		path.join(rootDir, "dist-runtime", "extensions"),
		path.join(rootDir, "dist", "extensions")
	].find((candidate) => pluginCacheExistsSync(candidate));
}
function toBundledChannelPluginMetadata(record) {
	if (record.origin !== "bundled" || !record.source) return null;
	return {
		dirName: path.basename(record.rootDir),
		source: {
			source: record.source,
			built: record.source
		},
		...record.setupSource ? { setupSource: {
			source: record.setupSource,
			built: record.setupSource
		} } : {},
		manifest: {
			id: record.id,
			channels: record.channels
		},
		...record.packageManifest ? { packageManifest: record.packageManifest } : {},
		rootDir: record.rootDir
	};
}
/** Lists bundled channel plugin metadata from default or caller-provided scan roots. */
function listBundledChannelPluginMetadata(params) {
	const scope = resolveBundledMetadataScope(params);
	if (scope.kind === "empty") return [];
	return resolvePluginMetadataSnapshot({ env: scope.kind === "env" ? scope.env : void 0 }).plugins.flatMap((record) => toBundledChannelPluginMetadata(record) ?? []);
}
//#endregion
//#region src/channels/plugins/bundled-root.ts
/**
* Bundled channel package-root resolver.
*
* Computes cache scopes for generated channel metadata across source and packaged layouts.
*/
const OPENCLAW_PACKAGE_ROOT = resolveOpenClawPackageRootSync({
	argv1: process.argv[1],
	cwd: process.cwd(),
	moduleUrl: import.meta.url.startsWith("file:") ? import.meta.url : void 0
}) ?? (import.meta.url.startsWith("file:") ? path.resolve(fileURLToPath(new URL("../../..", import.meta.url))) : process.cwd());
function derivePackageRootFromExtensionsDir(extensionsDir) {
	const parentDir = path.dirname(extensionsDir);
	const parentBase = path.basename(parentDir);
	if (parentBase === "dist" || parentBase === "dist-runtime") return path.dirname(parentDir);
	return parentDir;
}
/**
* Resolves the package/cache scope used for bundled channel plugin metadata.
*/
function resolveBundledChannelRootScope(env = process.env) {
	const bundledPluginsDir = resolveBundledPluginsDir(env);
	if (!bundledPluginsDir) return { packageRoot: OPENCLAW_PACKAGE_ROOT };
	const resolvedPluginsDir = path.resolve(bundledPluginsDir);
	return {
		packageRoot: path.basename(resolvedPluginsDir) === "extensions" ? derivePackageRootFromExtensionsDir(resolvedPluginsDir) : resolvedPluginsDir,
		pluginsDir: resolvedPluginsDir
	};
}
//#endregion
//#region src/channels/plugins/meta-normalization.ts
function normalizeChannelMeta(params) {
	const next = params.meta ?? void 0;
	const existing = params.existing ?? void 0;
	const label = normalizeOptionalString(next?.label) ?? normalizeOptionalString(existing?.label) ?? normalizeOptionalString(next?.selectionLabel) ?? normalizeOptionalString(existing?.selectionLabel) ?? params.id;
	const selectionLabel = normalizeOptionalString(next?.selectionLabel) ?? normalizeOptionalString(existing?.selectionLabel) ?? label;
	const docsPath = normalizeOptionalString(next?.docsPath) ?? normalizeOptionalString(existing?.docsPath) ?? `/channels/${params.id}`;
	const blurb = normalizeOptionalString(next?.blurb) ?? normalizeOptionalString(existing?.blurb) ?? "";
	return {
		...existing,
		...next,
		id: params.id,
		label,
		selectionLabel,
		docsPath,
		blurb
	};
}
//#endregion
//#region src/channels/plugins/bundled.ts
const log = createSubsystemLogger("channels");
function resolveCanonicalPathOrAbsolute(targetPath) {
	return pluginCacheRealpathSync(targetPath, true) ?? path.resolve(targetPath);
}
function resolveBundledChannelModuleEntry(moduleExport, kind) {
	const resolved = unwrapDefaultModuleExport(moduleExport);
	if (!resolved || typeof resolved !== "object") return null;
	const record = resolved;
	const setup = kind === "setupEntry";
	if (record.kind !== (setup ? "bundled-channel-setup-entry" : "bundled-channel-entry")) return null;
	const stringFields = setup ? [] : [
		"id",
		"name",
		"description"
	];
	const functionFields = setup ? ["loadSetupPlugin"] : ["register", "loadChannelPlugin"];
	if (stringFields.some((field) => typeof record[field] !== "string") || functionFields.some((field) => typeof record[field] !== "function")) return null;
	return record;
}
function resolveBundledChannelBoundaryRoot(params) {
	const cacheKey = [
		params.packageRoot,
		params.pluginsDir ?? "",
		params.metadata.dirName,
		params.modulePath
	].join("\0");
	const artifacts = getPluginCacheRoot(params.packageRoot).artifacts;
	const cached = artifacts.get(`bundled-channel-boundary:${cacheKey}`);
	if (cached) return cached.boundaryRoot;
	const canonicalModulePath = resolveCanonicalPathOrAbsolute(params.modulePath);
	const sourceRoot = path.resolve(params.packageRoot, "extensions", params.metadata.dirName);
	const boundaryRoot = [
		...params.pluginsDir ? [path.resolve(params.pluginsDir, params.metadata.dirName)] : [],
		...["dist", "dist-runtime"].map((layout) => path.resolve(params.packageRoot, layout, "extensions", params.metadata.dirName)),
		sourceRoot
	].map(resolveCanonicalPathOrAbsolute).find((root) => isPathInside(root, canonicalModulePath)) ?? resolveCanonicalPathOrAbsolute(sourceRoot);
	artifacts.set(`bundled-channel-boundary:${cacheKey}`, {
		modulePath: params.modulePath,
		boundaryRoot
	});
	return boundaryRoot;
}
function resolveGeneratedBundledChannelModulePath(params) {
	if (!params.entry) return null;
	const generatedPath = resolveBundledPluginGeneratedPath(params.rootScope.packageRoot, params.entry, params.metadata.dirName, params.rootScope.pluginsDir);
	if (generatedPath) return generatedPath;
	const packageRoot = pluginCacheRealpathSync(params.rootScope.packageRoot, true);
	const pluginRoot = pluginCacheRealpathSync(params.metadata.rootDir, true);
	if (!packageRoot || !pluginRoot || !isPathInside(packageRoot, pluginRoot)) return null;
	const rawEntry = params.entry.source;
	const candidate = path.isAbsolute(rawEntry) ? path.normalize(rawEntry) : path.resolve(pluginRoot, rawEntry);
	const realCandidate = pluginCacheRealpathSync(candidate, true);
	return realCandidate && isPathInside(pluginRoot, realCandidate) ? realCandidate : null;
}
function loadGeneratedBundledChannelModule(params) {
	const modulePath = resolveGeneratedBundledChannelModulePath(params);
	if (!modulePath) throw new Error(`missing generated module for bundled channel ${params.metadata.manifest.id}`);
	const scanDir = params.rootScope.pluginsDir;
	const boundaryRoot = resolveBundledChannelBoundaryRoot({
		packageRoot: params.rootScope.packageRoot,
		...scanDir ? { pluginsDir: scanDir } : {},
		metadata: params.metadata,
		modulePath
	});
	return loadChannelPluginModule({
		modulePath,
		rootDir: boundaryRoot
	});
}
function findMissingModuleCodeInChain(error) {
	const seen = /* @__PURE__ */ new Set();
	let current = error;
	while (current && !seen.has(current)) {
		seen.add(current);
		const code = extractErrorCode(current);
		if (code === "ERR_MODULE_NOT_FOUND" || code === "MODULE_NOT_FOUND") return code;
		if (typeof current !== "object") return;
		current = current.cause;
	}
}
function describeBundledChannelLoadError(error, channelId) {
	const detail = formatErrorMessage(error);
	if (findMissingModuleCodeInChain(error) !== void 0) return `${detail} (run \`openclaw doctor --fix\` to install missing bundled runtime dependencies for channel ${channelId})`;
	return detail;
}
function loadGeneratedBundledChannelEntry(kind, rootScope, metadata) {
	const setup = kind === "setupEntry";
	const source = setup ? metadata.setupSource : metadata.source;
	if (setup && !source) return;
	try {
		const entry = resolveBundledChannelModuleEntry(loadGeneratedBundledChannelModule({
			rootScope,
			metadata,
			entry: source
		}), kind);
		if (!entry) {
			const description = setup ? "setup entry" : "entry";
			const contract = setup ? "bundled-channel-setup-entry" : "bundled-channel-entry";
			log.warn(`[channels] bundled channel ${description} ${metadata.manifest.id} missing ${contract} contract; skipping`);
		}
		return entry ?? void 0;
	} catch (error) {
		const detail = describeBundledChannelLoadError(error, metadata.manifest.id);
		const description = setup ? " setup entry" : "";
		log.warn(`[channels] failed to load bundled channel${description} ${metadata.manifest.id}: ${detail}`);
		return;
	}
}
function listBundledChannelMetadata(rootScope = resolveBundledChannelRootScope()) {
	const scanDir = rootScope.pluginsDir;
	return listBundledChannelPluginMetadata({
		rootDir: rootScope.packageRoot,
		...scanDir ? { scanDir } : {},
		includeChannelConfigs: false,
		includeSyntheticChannelConfigs: false
	}).filter((metadata) => (metadata.manifest.channels?.length ?? 0) > 0);
}
function listBundledChannelPluginIdsForRoot(rootScope) {
	return listBundledChannelMetadata(rootScope).map((metadata) => metadata.manifest.id).toSorted((left, right) => left.localeCompare(right));
}
function resolveBundledChannelMetadata(id, rootScope) {
	return listBundledChannelMetadata(rootScope).findLast((metadata) => metadata.manifest.id === id || metadata.manifest.channels?.includes(id));
}
function rememberBundledChannelArtifact(rootScope, kind, id, artifact, metadata = resolveBundledChannelMetadata(id, rootScope)) {
	if (metadata) getPluginCacheSource(path.resolve(metadata.rootDir, metadata.source.source)).variants.set(`bundled-channel:${kind}:${id}`, { exports: { value: artifact } });
}
function getBundledChannelArtifactForRoot(kind, id, rootScope) {
	const metadata = resolveBundledChannelMetadata(id, rootScope);
	if (!metadata) return;
	const cached = getPluginCacheSource(path.resolve(metadata.rootDir, metadata.source.source)).variants.get(`bundled-channel:${kind}:${id}`)?.exports;
	if (cached) return cached.value;
	const loadKey = `${kind}\0${id}`;
	const { artifactLoadsInProgress } = getPluginCacheRoot(metadata.rootDir);
	if (artifactLoadsInProgress.has(loadKey)) return;
	artifactLoadsInProgress.add(loadKey);
	try {
		const artifact = bundledChannelArtifactLoaders[kind]({
			id,
			rootScope,
			metadata
		});
		rememberBundledChannelArtifact(rootScope, kind, id, artifact, metadata);
		return artifact;
	} catch (error) {
		if (kind === "entry" || kind === "setupEntry") throw error;
		const descriptions = {
			entry: "",
			setupEntry: " setup entry",
			plugin: "",
			setupPlugin: " setup",
			secrets: " secrets",
			setupSecrets: " setup secrets",
			accountInspector: " account inspector"
		};
		const detail = describeBundledChannelLoadError(error, id);
		log.warn(`[channels] failed to load bundled channel${descriptions[kind]} ${id}: ${detail}`);
		rememberBundledChannelArtifact(rootScope, kind, id, void 0, metadata);
		return;
	} finally {
		artifactLoadsInProgress.delete(loadKey);
	}
}
const bundledChannelArtifactLoaders = {
	entry({ id, rootScope, metadata }) {
		const entry = loadGeneratedBundledChannelEntry("entry", rootScope, metadata);
		if (entry && entry.id !== id) rememberBundledChannelArtifact(rootScope, "entry", entry.id, entry);
		return entry;
	},
	setupEntry({ id, rootScope, metadata }) {
		const entry = loadGeneratedBundledChannelEntry("setupEntry", rootScope, metadata);
		const aliases = /* @__PURE__ */ new Set([
			metadata.manifest.id,
			...metadata.manifest.channels ?? [],
			id
		]);
		for (const alias of aliases) rememberBundledChannelArtifact(rootScope, "setupEntry", alias, entry);
		return entry;
	},
	plugin({ id, rootScope, metadata }) {
		const entry = getBundledChannelArtifactForRoot("entry", id, rootScope);
		if (!entry) return;
		const plugin = entry.loadChannelPlugin();
		return plugin ? {
			...plugin,
			meta: normalizeChannelMeta({
				id: plugin.id,
				meta: plugin.meta,
				existing: metadata.packageManifest?.channel
			})
		} : void 0;
	},
	setupPlugin({ id, rootScope }) {
		return getBundledChannelArtifactForRoot("setupEntry", id, rootScope)?.loadSetupPlugin();
	},
	secrets({ id, rootScope }) {
		const entry = getBundledChannelArtifactForRoot("entry", id, rootScope);
		return entry ? entry.loadChannelSecrets?.() ?? getBundledChannelArtifactForRoot("plugin", id, rootScope)?.secrets : void 0;
	},
	setupSecrets({ id, rootScope }) {
		const entry = getBundledChannelArtifactForRoot("setupEntry", id, rootScope);
		return entry ? entry.loadSetupSecrets?.() ?? getBundledChannelArtifactForRoot("setupPlugin", id, rootScope)?.secrets : void 0;
	},
	accountInspector({ id, rootScope }) {
		return getBundledChannelArtifactForRoot("entry", id, rootScope)?.loadChannelAccountInspector?.();
	}
};
function listBundledChannelPlugins() {
	const rootScope = resolveBundledChannelRootScope();
	return listBundledChannelPluginIdsForRoot(rootScope).flatMap((id) => {
		const plugin = getBundledChannelArtifactForRoot("plugin", id, rootScope);
		return plugin ? [plugin] : [];
	});
}
function listBundledChannelSetupPlugins() {
	const rootScope = resolveBundledChannelRootScope();
	return listBundledChannelPluginIdsForRoot(rootScope).flatMap((id) => {
		const plugin = getBundledChannelArtifactForRoot("setupPlugin", id, rootScope);
		return plugin ? [plugin] : [];
	});
}
function getBundledChannelAccountInspector(id) {
	return getBundledChannelArtifactForRoot("accountInspector", id, resolveBundledChannelRootScope());
}
function getBundledChannelPlugin(id) {
	return getBundledChannelArtifactForRoot("plugin", id, resolveBundledChannelRootScope());
}
function getBundledChannelSecrets(id) {
	return getBundledChannelArtifactForRoot("secrets", id, resolveBundledChannelRootScope());
}
function getBundledChannelSetupPlugin(id, env = process.env) {
	return getBundledChannelArtifactForRoot("setupPlugin", id, resolveBundledChannelRootScope(env));
}
function getBundledChannelSetupSecrets(id, env = process.env) {
	return getBundledChannelArtifactForRoot("setupSecrets", id, resolveBundledChannelRootScope(env));
}
//#endregion
export { getBundledChannelSetupSecrets as a, normalizeChannelMeta as c, getBundledChannelSetupPlugin as i, getBundledChannelPlugin as n, listBundledChannelPlugins as o, getBundledChannelSecrets as r, listBundledChannelSetupPlugins as s, getBundledChannelAccountInspector as t };
