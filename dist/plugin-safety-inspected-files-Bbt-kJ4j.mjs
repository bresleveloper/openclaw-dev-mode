import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { f as readPluginCacheFile, l as pluginCacheRealpathSync, o as parsePluginCacheJson, t as DEFAULT_PLUGIN_ENTRY_CANDIDATES } from "./package-manifest-CEbdS_C4.mjs";
import { r as listBuiltRuntimeEntryCandidates, t as PUBLIC_SURFACE_SOURCE_EXTENSIONS } from "./package-entrypoints-DCjwjOnD.mjs";
import { r as loadPluginManifest } from "./manifest-BXjFCp0F.mjs";
import { a as isPluginActivityToolName, i as PORTABLE_PLUGIN_ICON_PATH, n as PLUGIN_ACTIVITY_ICON_PATH, r as PLUGIN_TOOL_ACTIVITY_ICON_DIR } from "./portable-icon-paths-BZ0z5wfc.mjs";
import { t as createRuntimePathLookup } from "./update-runtime-path-index-BEj-lDda.mjs";
import { t as collectBundledPluginPublicSurfaceArtifacts } from "./bundled-plugin-scan-BmpR7Vr3.mjs";
import { r as isPluginControlUiAssetPath } from "./control-ui-assets-2Tfx8Ftx.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/infra/update-runtime-staging.ts
const STAGING_MARKER = ".openclaw-update-";
const STAGING_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.tmp$/u;
/** Allocate a sibling namespace for a Git runtime promotion and its rollback contents. */
function gitRuntimeStagingPath(destination) {
	return `${destination}${STAGING_MARKER}${randomUUID()}.tmp`;
}
/** Recognize the producer's transaction directory names, including custom virtual stores. */
function isGitRuntimeStagingName(name) {
	const marker = name.lastIndexOf(STAGING_MARKER);
	return marker > 0 && STAGING_ID.test(name.slice(marker + 17));
}
//#endregion
//#region src/plugins/plugin-safety-inspected-files.ts
/** These files must keep independent inodes for the existing plugin safety checks. */
function collectPluginSafetyInspectedFiles(entries) {
	const pluginFiles = /* @__PURE__ */ new Set();
	const entryKinds = new Map(entries.map((entry) => [entry.path, entry.kind]));
	const activityScopes = [];
	const browserScopes = [];
	const skillScopes = [];
	withPluginCache(createPluginCache({ kind: "operation" }), () => {
		for (const entry of entries) {
			if (path.basename(entry.path) !== "openclaw.plugin.json") continue;
			const rootDir = path.dirname(entry.path);
			const add = (relative) => {
				const file = path.resolve(rootDir, relative);
				const real = isPathInside(rootDir, file) ? pluginCacheRealpathSync(file) : null;
				if (real && isPathInside(rootDir, real) && entryKinds.get(real) === "file") pluginFiles.add(real);
			};
			const loaded = loadPluginManifest(rootDir, false);
			const manifest = loaded.ok ? loaded.manifest : void 0;
			const packageFile = readPluginCacheFile({
				rootDir,
				relativePath: "package.json",
				rejectHardlinks: false,
				maxBytes: 262144
			});
			const parsed = packageFile.ok ? parsePluginCacheJson(packageFile) : void 0;
			const metadata = parsed?.ok && isRecord(parsed.value) && isRecord(parsed.value.openclaw) ? parsed.value.openclaw : {};
			const sources = normalizeTrimmedStringList([
				...Array.isArray(metadata.extensions) ? metadata.extensions : DEFAULT_PLUGIN_ENTRY_CANDIDATES,
				...Array.isArray(metadata.runtimeExtensions) ? metadata.runtimeExtensions : [],
				metadata.setupEntry,
				metadata.runtimeSetupEntry,
				manifest?.providerCatalogEntry,
				manifest?.capabilityCatalogEntry
			]);
			for (const directory of /* @__PURE__ */ new Set([
				rootDir,
				path.join(rootDir, "dist"),
				...sources.map((source) => path.dirname(path.resolve(rootDir, source)))
			])) if (isPathInside(rootDir, directory) && entryKinds.get(directory) === "directory") for (const artifact of collectBundledPluginPublicSurfaceArtifacts({
				pluginDir: directory,
				sourceEntry: ""
			}) ?? []) sources.push(...PUBLIC_SURFACE_SOURCE_EXTENSIONS.map((extension) => path.relative(rootDir, path.join(directory, artifact.replace(/\.js$/u, extension)))));
			[
				"openclaw.plugin.json",
				"package.json",
				PORTABLE_PLUGIN_ICON_PATH,
				PLUGIN_ACTIVITY_ICON_PATH
			].forEach(add);
			for (const source of sources) {
				add(source);
				listBuiltRuntimeEntryCandidates(source).forEach(add);
			}
			for (const theme of manifest?.themes ?? []) [
				theme.source,
				...Object.values(theme.hats ?? {}),
				...Object.values(theme.critters ?? {}).map((critter) => critter.source)
			].forEach(add);
			const activity = path.join(rootDir, PLUGIN_TOOL_ACTIVITY_ICON_DIR);
			const browser = manifest?.controlUi && path.resolve(rootDir, path.dirname(manifest.controlUi.entry));
			activityScopes.push([activity, activity]);
			if (browser && isPathInside(rootDir, browser)) browserScopes.push([browser, browser]);
			for (const skill of manifest?.skills ?? []) {
				const directory = path.resolve(rootDir, skill);
				const real = isPathInside(rootDir, directory) ? pluginCacheRealpathSync(directory) : null;
				if (real && isPathInside(rootDir, real) && entryKinds.get(real) === "directory") skillScopes.push([real, real]);
			}
		}
	});
	const deepestFirst = ([left], [right]) => right.length - left.length;
	const activityScope = createRuntimePathLookup(activityScopes.toSorted(deepestFirst));
	const browserScope = createRuntimePathLookup(browserScopes.toSorted(deepestFirst));
	const skillScope = createRuntimePathLookup(skillScopes.toSorted(deepestFirst));
	for (const entry of entries) {
		if (entry.kind !== "file") continue;
		const activity = activityScope(entry.path);
		const browser = browserScope(entry.path);
		if (path.basename(entry.path) === "package.json" || path.basename(entry.path) === "SKILL.md" && skillScope(entry.path) !== void 0 || activity && path.dirname(entry.path) === activity && entry.path.endsWith(".svg") && isPluginActivityToolName(path.basename(entry.path, ".svg")) || browser && isPluginControlUiAssetPath(path.relative(browser, entry.path).split(path.sep).join("/"))) pluginFiles.add(entry.path);
	}
	return pluginFiles;
}
//#endregion
export { gitRuntimeStagingPath as n, isGitRuntimeStagingName as r, collectPluginSafetyInspectedFiles as t };
