import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { a as resolveRootPathSync, n as resolvePathViaExistingAncestorSync, o as safeRealpathSync } from "./boundary-path-BzetEUdq.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { r as isRootFileMissingFailure } from "./boundary-file-read-D-Aa04On.mjs";
import { i as resolvePackageExtensionEntries } from "./package-manifest-C8sTeZKW.mjs";
import { t as discoverConfiguredPluginLoadPaths } from "./discovery-D_5mAUI7.mjs";
import { u as readRootJsonObjectSync } from "./json-files-C0HSMh2Z.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-CEG7WMVu.mjs";
import { n as buildPluginCapabilitySummary, o as mergePluginDeclaredSurfaces } from "./capability-summary-CDNMLrkL.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/capability-artifact.ts
function resolvePluginArtifactManifests(rootDir, env = process.env, context = {}) {
	const artifactRoot = fs.realpathSync(resolveUserPath(rootDir, env));
	const packageManifest = readRootJsonObjectSync({
		rootDir: artifactRoot,
		rootRealPath: artifactRoot,
		relativePath: "package.json",
		boundaryLabel: "plugin artifact directory",
		rejectHardlinks: true
	});
	if (!packageManifest.ok) {
		if (packageManifest.reason !== "open" || !isRootFileMissingFailure(packageManifest.failure)) throw new Error(`Unable to inspect the plugin artifact package manifest: ${artifactRoot}`);
	} else {
		const extensions = resolvePackageExtensionEntries(packageManifest.value);
		if (extensions.status === "invalid") throw new Error(extensions.error);
		if (extensions.status === "empty") throw new Error("package.json openclaw.extensions is empty");
	}
	const currentRoot = path.resolve(resolveUserPath(context.currentArtifactDir ?? rootDir, env));
	const currentCanonicalRoot = resolvePathViaExistingAncestorSync(currentRoot);
	const loadPaths = [];
	for (const configuredPath of context.config?.plugins?.load?.paths ?? []) {
		const source = path.resolve(resolveUserPath(configuredPath, env));
		const canonicalSource = resolvePathViaExistingAncestorSync(source);
		if (!isPathInside(currentRoot, source) && !isPathInside(currentCanonicalRoot, canonicalSource)) continue;
		const current = resolveRootPathSync({
			absolutePath: source,
			rootPath: currentRoot,
			rootCanonicalPath: currentCanonicalRoot,
			boundaryLabel: "installed plugin artifact directory"
		});
		const lexicalRoot = isPathInside(currentRoot, source) ? currentRoot : currentCanonicalRoot;
		const relativePath = isPathInside(lexicalRoot, source) ? path.relative(lexicalRoot, source) : path.relative(currentCanonicalRoot, current.kind === "directory" ? current.canonicalPath : path.join(resolvePathViaExistingAncestorSync(path.dirname(source)), path.basename(source)));
		const staged = resolveRootPathSync({
			absolutePath: path.join(artifactRoot, relativePath),
			rootPath: artifactRoot,
			rootCanonicalPath: artifactRoot,
			boundaryLabel: "staged plugin artifact directory"
		});
		loadPaths.push(staged.absolutePath);
	}
	loadPaths.push(artifactRoot);
	const packageDiscovery = discoverConfiguredPluginLoadPaths({
		loadPaths: [artifactRoot],
		env,
		deduplicate: true
	});
	const packageSources = new Set(packageDiscovery.candidates.map((candidate) => safeRealpathSync(candidate.source) ?? candidate.source));
	const discovery = loadPaths.length === 1 ? packageDiscovery : discoverConfiguredPluginLoadPaths({
		loadPaths,
		env,
		deduplicate: true
	});
	const registry = loadPluginManifestRegistryCore({
		config: { plugins: { load: { paths: loadPaths } } },
		env,
		installRecords: {},
		discovery: {
			candidates: discovery.candidates.filter((candidate) => packageSources.has(safeRealpathSync(candidate.source) ?? candidate.source)),
			diagnostics: packageDiscovery.diagnostics
		}
	});
	const error = registry.diagnostics.find((diagnostic) => diagnostic.level === "error");
	if (error || registry.plugins.length === 0) throw new Error(error?.message ?? `Plugin artifact has no valid plugin manifest: ${artifactRoot}`);
	return registry.plugins;
}
function inspectPluginCapabilityArtifact(rootDir, env = process.env, context = {}) {
	return withPluginCache(createPluginCache(), () => {
		const manifests = resolvePluginArtifactManifests(rootDir, env, context);
		return {
			manifest: manifests[0],
			declared: mergePluginDeclaredSurfaces(manifests.map((manifest) => buildPluginCapabilitySummary({
				manifest,
				origin: "global"
			}).declared))
		};
	});
}
/** Read only validated manifest surfaces belonging to the actual artifact on disk. */
function resolvePluginArtifactDeclaredSurface(rootDir, env = process.env, context = {}) {
	return inspectPluginCapabilityArtifact(rootDir, env, context).declared;
}
//#endregion
export { resolvePluginArtifactDeclaredSurface as n, inspectPluginCapabilityArtifact as t };
