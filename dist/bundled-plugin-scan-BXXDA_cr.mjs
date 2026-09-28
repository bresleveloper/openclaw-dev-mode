import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { p as normalizeTrimmedStringList, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as PUBLIC_SURFACE_SOURCE_EXTENSIONS } from "./public-surface-runtime-B_fTpq__.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/bundled-plugin-scan.ts
/** Scans bundled plugin source/build roots and derives public/runtime artifacts from manifests. */
const RUNTIME_SIDECAR_ARTIFACTS = /* @__PURE__ */ new Set([
	"helper-api.js",
	"light-runtime-api.js",
	"qa-runner-api.js",
	"runtime-api.js",
	"runtime-setter-api.js",
	"thread-bindings-runtime.js"
]);
/** Normalizes string-list manifest fields found while scanning bundled plugin files. */
function normalizeBundledPluginStringList(value) {
	return normalizeTrimmedStringList(value);
}
/** Converts a source entry path to its built JavaScript artifact path. */
function rewriteBundledPluginEntryToBuiltPath(entry) {
	if (!entry) return;
	return entry.replace(/^\.\//u, "").replace(/\.[^.]+$/u, ".js");
}
function isTopLevelPublicSurfaceSource(name) {
	if (!PUBLIC_SURFACE_SOURCE_EXTENSIONS.includes(path.extname(name))) return false;
	if (name.startsWith(".") || name.startsWith("test-") || name.includes(".test-")) return false;
	if (name.endsWith(".d.ts")) return false;
	if (/^config-api(\.[cm]?[jt]s)$/u.test(name)) return false;
	return !/(\.test|\.spec)(\.[cm]?[jt]s)$/u.test(name);
}
/** Derives a stable id hint for bundled plugins with one or more extension entrypoints. */
function deriveBundledPluginIdHint(params) {
	const base = path.basename(params.entryPath, path.extname(params.entryPath));
	if (!params.hasMultipleExtensions) return params.manifestId;
	const packageName = normalizeOptionalString(params.packageName);
	if (!packageName) return `${params.manifestId}/${base}`;
	return `${packageName.includes("/") ? packageName.split("/").pop() ?? packageName : packageName}/${base}`;
}
/** Lists top-level public surface artifacts that should be copied with bundled plugin runtime. */
function collectBundledPluginPublicSurfaceArtifacts(params) {
	const excluded = new Set(normalizeTrimmedStringList([params.sourceEntry, params.setupEntry]).map((entry) => path.basename(entry)));
	const artifacts = fs.readdirSync(params.pluginDir, { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => entry.name).filter(isTopLevelPublicSurfaceSource).filter((entry) => !excluded.has(entry)).map((entry) => rewriteBundledPluginEntryToBuiltPath(entry)).filter((entry) => typeof entry === "string" && entry.length > 0).toSorted((left, right) => left.localeCompare(right));
	return artifacts.length > 0 ? artifacts : void 0;
}
/** Filters public artifacts down to runtime sidecars needed by bundled plugin execution. */
function collectBundledPluginRuntimeSidecarArtifacts(publicSurfaceArtifacts) {
	if (!publicSurfaceArtifacts) return;
	const artifacts = publicSurfaceArtifacts.filter((artifact) => RUNTIME_SIDECAR_ARTIFACTS.has(artifact));
	return artifacts.length > 0 ? artifacts : void 0;
}
/** Chooses the source or built extension directory appropriate for the current package layout. */
function resolveBundledPluginScanDir(params) {
	const sourceDir = path.join(params.packageRoot, "extensions");
	const runtimeDir = path.join(params.packageRoot, "dist-runtime", "extensions");
	const builtDir = path.join(params.packageRoot, "dist", "extensions");
	if (params.runningFromBuiltArtifact) {
		if (fs.existsSync(builtDir)) return builtDir;
		if (fs.existsSync(runtimeDir)) return runtimeDir;
	}
	if (fs.existsSync(sourceDir)) return sourceDir;
	if (fs.existsSync(runtimeDir) && fs.existsSync(builtDir)) return runtimeDir;
	if (fs.existsSync(builtDir)) return builtDir;
}
function listBundledPluginEntryBaseDirs(params) {
	const scanPluginRoot = params.scanDir ? path.resolve(params.scanDir, params.pluginDirName ?? "") : void 0;
	const baseDirs = [
		...scanPluginRoot ? [path.resolve(scanPluginRoot, "dist")] : [],
		...scanPluginRoot ? [scanPluginRoot] : [],
		path.resolve(params.rootDir, "dist", "extensions", params.pluginDirName ?? ""),
		path.resolve(params.rootDir, "dist-runtime", "extensions", params.pluginDirName ?? ""),
		path.resolve(params.rootDir, "extensions", params.pluginDirName ?? "", "dist"),
		path.resolve(params.rootDir, "extensions", params.pluginDirName ?? "")
	];
	return uniqueStrings(baseDirs);
}
function listBundledPluginEntryRoots(params) {
	const roots = [
		...params.scanDir ? [path.resolve(params.scanDir, params.pluginDirName ?? "")] : [],
		path.resolve(params.rootDir, "extensions", params.pluginDirName ?? ""),
		path.resolve(params.rootDir, "dist", "extensions", params.pluginDirName ?? ""),
		path.resolve(params.rootDir, "dist-runtime", "extensions", params.pluginDirName ?? "")
	];
	return uniqueStrings(roots);
}
function listBundledPluginEntrySearchPaths(entry, params) {
	const paths = [];
	const roots = listBundledPluginEntryRoots(params);
	for (const rawEntry of [entry.built, entry.source]) {
		if (typeof rawEntry !== "string" || rawEntry.length === 0) continue;
		if (!path.isAbsolute(rawEntry)) {
			paths.push(rawEntry);
			continue;
		}
		const normalizedEntry = path.normalize(rawEntry);
		for (const root of roots) {
			if (!isPathInside(root, normalizedEntry)) continue;
			const relativeEntry = path.relative(root, normalizedEntry);
			const builtEntry = rewriteBundledPluginEntryToBuiltPath(relativeEntry);
			if (builtEntry) paths.push(builtEntry);
			paths.push(relativeEntry);
		}
	}
	return uniqueStrings(paths);
}
/** Resolves a generated runtime path for a bundled plugin entry. */
function resolveBundledPluginGeneratedPath(rootDir, entry, pluginDirName, scanDir) {
	if (!entry) return null;
	const entryOrder = listBundledPluginEntrySearchPaths(entry, {
		rootDir,
		pluginDirName,
		...scanDir ? { scanDir } : {}
	});
	const baseDirs = listBundledPluginEntryBaseDirs({
		rootDir,
		pluginDirName,
		...scanDir ? { scanDir } : {}
	});
	for (const baseDir of baseDirs) for (const entryPath of entryOrder) {
		const candidate = resolveBundledPluginEntryCandidate(baseDir, entryPath);
		if (!candidate) continue;
		if (fs.existsSync(candidate)) return candidate;
	}
	return null;
}
function normalizeRelativePluginEntryPath(entryPath) {
	return entryPath.replace(/^\.\//u, "");
}
function resolveBundledPluginEntryCandidate(baseDir, entryPath) {
	const normalizedEntryPath = normalizeRelativePluginEntryPath(entryPath);
	const candidate = path.isAbsolute(normalizedEntryPath) ? path.normalize(normalizedEntryPath) : path.resolve(baseDir, normalizedEntryPath);
	if (!isPathInside(baseDir, candidate)) return null;
	return candidate;
}
//#endregion
export { resolveBundledPluginGeneratedPath as a, normalizeBundledPluginStringList as i, collectBundledPluginRuntimeSidecarArtifacts as n, resolveBundledPluginScanDir as o, deriveBundledPluginIdHint as r, rewriteBundledPluginEntryToBuiltPath as s, collectBundledPluginPublicSurfaceArtifacts as t };
