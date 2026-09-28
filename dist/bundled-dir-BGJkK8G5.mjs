import { l as getPluginCacheRoot, o as getPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { d as readPluginCacheDirectory, f as readPluginCacheFile, l as pluginCacheRealpathSync, m as refreshPluginCacheStat, o as parsePluginCacheJson, r as getPackageManifestMetadata, s as pluginCacheExistsSync } from "./package-manifest-C8sTeZKW.mjs";
import { n as listBuiltRuntimeEntryCandidates, t as isTypeScriptPackageEntry } from "./package-entrypoints-BfOpsr9M.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
//#region src/plugins/plugin-runtime-artifact-selection.ts
/** Selects built plugin artifacts without importing active runtime state. */
/** Canonical packaged runtime replaces staging-only dist-runtime artifacts. */
function resolveCanonicalDistRuntimeSource(source) {
	const marker = `${path.sep}dist-runtime${path.sep}extensions${path.sep}`;
	const index = source.indexOf(marker);
	if (index === -1) return source;
	const candidate = `${source.slice(0, index)}${path.sep}dist${path.sep}extensions${path.sep}${source.slice(index + marker.length)}`;
	return pluginCacheExistsSync(candidate) ? candidate : source;
}
/** Finalize once at execution; discovery and identity retain the selected artifact. */
function resolvePluginRuntimeExecutionArtifact(selected) {
	const source = resolveCanonicalDistRuntimeSource(selected.source);
	const rootDir = resolveCanonicalDistRuntimeSource(selected.rootDir);
	return {
		source,
		rootDir: rootDir !== selected.rootDir && !isPathInside(pluginCacheRealpathSync(rootDir) ?? rootDir, pluginCacheRealpathSync(source) ?? source) ? selected.rootDir : rootDir
	};
}
/** Selects from lifecycle-owned package facts without pinning a runtime registry. */
function resolvePluginRuntimeArtifactSelection(params) {
	const { source, rootDir } = resolvePluginRuntimeExecutionArtifact({
		source: pluginCacheRealpathSync(params.source) ?? path.resolve(params.source),
		rootDir: pluginCacheRealpathSync(params.rootDir) ?? path.resolve(params.rootDir)
	});
	const artifacts = getPluginCacheRoot(rootDir).runtimeArtifacts;
	const key = JSON.stringify([
		params.source,
		params.entryKind,
		params.origin,
		params.preferBuiltPluginArtifacts,
		params.sourcePreferred,
		params.packageManifest?.build?.bundledDist
	]);
	let resolved = artifacts.get(key);
	if (!resolved) {
		resolved = resolvePluginRuntimeExecutionArtifact(resolvePreferredBuiltRuntimeArtifact({
			...params,
			source,
			rootDir
		}));
		artifacts.set(key, resolved);
	}
	return resolved;
}
/** Built hosts default only checkout plugins to compiled execution, not installed packages. */
function resolvePluginRuntimeArtifactPreference(preferBuiltPluginArtifacts) {
	if (preferBuiltPluginArtifacts !== void 0) return preferBuiltPluginArtifacts ? "all" : "source";
	return /\.[cm]?js$/.test(new URL(import.meta.url).pathname) ? "bundled" : "source";
}
function prefersBuiltPluginArtifacts(preference, origin) {
	return preference === "all" || preference === "bundled" && origin === "bundled";
}
function resolveBundledArtifactRelativePath(rootDir, relativeSource) {
	const file = readPluginCacheFile({
		rootDir,
		relativePath: "package.json",
		rejectHardlinks: false
	});
	const parsed = file.ok ? parsePluginCacheJson(file) : void 0;
	const metadata = parsed?.ok && isRecord(parsed.value) ? getPackageManifestMetadata(parsed.value) : void 0;
	const entries = [...metadata?.runtimeExtensions?.length ? metadata.runtimeExtensions : metadata?.extensions ?? [], metadata?.runtimeSetupEntry ?? metadata?.setupEntry].filter((entry) => typeof entry === "string");
	const sourceStem = relativeSource.replace(/\.[^.]+$/u, "");
	const declared = entries.find((entry) => path.normalize(entry).replace(/\.[^.]+$/u, "") === sourceStem);
	if (declared) return /\.[cm]?js$/.test(declared) ? declared : null;
	const extensions = new Set(entries.map((entry) => path.extname(entry)));
	const extension = extensions.size === 1 ? [...extensions][0] : void 0;
	if (!extension || ![
		".js",
		".mjs",
		".cjs"
	].includes(extension) || entries.some((entry) => path.normalize(entry).startsWith(`dist${path.sep}`))) return null;
	return relativeSource.replace(/\.[^.]+$/u, extension);
}
function resolvePackageLocalDistRuntimeArtifact(params) {
	const relativeSource = path.relative(params.rootDir, params.source);
	if (!isTypeScriptPackageEntry(relativeSource) || relativeSource === "" || relativeSource.startsWith("..") || path.isAbsolute(relativeSource)) return null;
	for (const artifactRelativePath of listBuiltRuntimeEntryCandidates(relativeSource)) {
		if (params.origin === "bundled" && !artifactRelativePath.startsWith("./dist/")) continue;
		const artifactSource = path.resolve(params.rootDir, artifactRelativePath);
		if (pluginCacheExistsSync(artifactSource)) return pluginCacheRealpathSync(artifactSource) ?? path.resolve(artifactSource);
	}
	return null;
}
function resolvePreferredBundledRootArtifactFromCanonicalPaths(params) {
	const { rootDir, source } = params;
	const sourceExternal = params.packageManifest?.build?.bundledDist === false;
	const extensionsDir = path.dirname(rootDir);
	if (path.basename(extensionsDir) !== "extensions") return {
		source,
		rootDir
	};
	const packageRoot = path.dirname(extensionsDir);
	if (path.basename(packageRoot) === "dist" || path.basename(packageRoot) === "dist-runtime") return {
		source,
		rootDir
	};
	const relativeSource = path.relative(rootDir, source);
	if (relativeSource === "" || relativeSource.startsWith("..") || path.isAbsolute(relativeSource)) return {
		source,
		rootDir
	};
	for (const artifactRootName of sourceExternal ? ["dist"] : ["dist-runtime", "dist"]) {
		const artifactRoot = path.join(packageRoot, artifactRootName, "extensions", path.basename(rootDir));
		const artifactRelativePath = resolveBundledArtifactRelativePath(artifactRoot, relativeSource);
		if (!artifactRelativePath) continue;
		const artifactSource = path.join(artifactRoot, artifactRelativePath);
		if (pluginCacheExistsSync(artifactSource)) return {
			source: pluginCacheRealpathSync(artifactSource) ?? path.resolve(artifactSource),
			rootDir: pluginCacheRealpathSync(artifactRoot) ?? path.resolve(artifactRoot)
		};
	}
	return {
		source,
		rootDir
	};
}
/** Selects the lifecycle-owned root build for one bundled source artifact. */
function resolvePreferredBundledRootArtifact(params) {
	const artifacts = getPluginCacheRoot(params.rootDir).runtimeArtifacts;
	const key = JSON.stringify([
		"bundled-root",
		params.source,
		params.packageManifest?.build?.bundledDist
	]);
	const cached = artifacts.get(key);
	if (cached) return cached;
	const resolved = resolvePreferredBundledRootArtifactFromCanonicalPaths({
		source: pluginCacheRealpathSync(params.source) ?? path.resolve(params.source),
		rootDir: pluginCacheRealpathSync(params.rootDir) ?? path.resolve(params.rootDir),
		packageManifest: params.packageManifest
	});
	artifacts.set(key, resolved);
	return resolved;
}
/** Applies source, package-local, and root-build preference without runtime memo state. */
function resolvePreferredBuiltRuntimeArtifact(params) {
	const { rootDir, source } = params;
	if (!params.preferBuiltPluginArtifacts || params.sourcePreferred) return {
		source,
		rootDir
	};
	if (params.origin !== "bundled") {
		const artifactSource = resolvePackageLocalDistRuntimeArtifact({
			...params,
			source,
			rootDir
		});
		return artifactSource ? {
			source: artifactSource,
			rootDir
		} : {
			source,
			rootDir
		};
	}
	const packageLocalArtifactSource = params.packageManifest?.build?.bundledDist === false ? null : resolvePackageLocalDistRuntimeArtifact({
		...params,
		source,
		rootDir
	});
	if (packageLocalArtifactSource) return {
		source: packageLocalArtifactSource,
		rootDir
	};
	return resolvePreferredBundledRootArtifactFromCanonicalPaths({
		source,
		rootDir,
		packageManifest: params.packageManifest
	});
}
//#endregion
//#region src/plugins/bundled-dir.ts
/** Resolves the bundled plugin directory for source checkouts, dist builds, and tests. */
const DISABLED_BUNDLED_PLUGINS_DIR = path.join(os.tmpdir(), "openclaw-empty-bundled-plugins");
const TEST_TRUST_BUNDLED_PLUGINS_DIR_ENV = "OPENCLAW_TEST_TRUST_BUNDLED_PLUGINS_DIR";
/** Returns true when env disables bundled plugin discovery. */
function areBundledPluginsDisabled(env = process.env) {
	const raw = normalizeOptionalLowercaseString(env.OPENCLAW_DISABLE_BUNDLED_PLUGINS);
	return raw === "1" || raw === "true";
}
function resolveDisabledBundledPluginsDir() {
	if (!pluginCacheExistsSync(DISABLED_BUNDLED_PLUGINS_DIR)) {
		fs.mkdirSync(DISABLED_BUNDLED_PLUGINS_DIR, { recursive: true });
		refreshPluginCacheStat(DISABLED_BUNDLED_PLUGINS_DIR);
	}
	return DISABLED_BUNDLED_PLUGINS_DIR;
}
function isSourceCheckoutRoot(packageRoot) {
	return pluginCacheExistsSync(path.join(packageRoot, "pnpm-workspace.yaml")) && pluginCacheExistsSync(path.join(packageRoot, "src")) && pluginCacheExistsSync(path.join(packageRoot, "extensions"));
}
function shouldTrustTestBundledPluginsDirOverride(env) {
	const separateEnv = env !== process.env;
	if (!isTruthyEnvValue(env[TEST_TRUST_BUNDLED_PLUGINS_DIR_ENV]) && !(separateEnv && isTruthyEnvValue(process.env[TEST_TRUST_BUNDLED_PLUGINS_DIR_ENV]))) return false;
	return isVitestRuntimeEnv(env) || separateEnv && isVitestRuntimeEnv(process.env);
}
function hasUsableBundledPluginTree(pluginsDir) {
	if (!pluginCacheExistsSync(pluginsDir)) return false;
	try {
		return readPluginCacheDirectory(pluginsDir).some((entry) => {
			if (!entry.isDirectory()) return false;
			const pluginDir = path.join(pluginsDir, entry.name);
			return pluginCacheExistsSync(path.join(pluginDir, "package.json")) || pluginCacheExistsSync(path.join(pluginDir, "openclaw.plugin.json"));
		});
	} catch {
		return false;
	}
}
function safeRealpathSync(targetPath) {
	return pluginCacheRealpathSync(targetPath, true);
}
function trustedBundledPluginRootsForPackageRoot(packageRoot) {
	const roots = [path.join(packageRoot, "dist", "extensions"), path.join(packageRoot, "dist-runtime", "extensions")];
	if (isSourceCheckoutRoot(packageRoot)) roots.push(path.join(packageRoot, "extensions"));
	return roots;
}
function resolvePackageRootsForBundledPlugins() {
	const argvRoot = resolveOpenClawPackageRootSync({ argv1: process.argv[1] });
	const moduleRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	return uniqueStrings([argvRoot, moduleRoot].filter((entry) => Boolean(entry)));
}
function resolveSourceCheckoutDependencyDiagnostic(env = process.env) {
	if (areBundledPluginsDisabled(env)) return null;
	for (const packageRoot of resolvePackageRootsForBundledPlugins()) {
		if (!isSourceCheckoutRoot(packageRoot)) continue;
		const extensionsDir = path.join(packageRoot, "extensions");
		if (!isPluginInPackageBundledRoots({
			rootDir: extensionsDir,
			packageRoot
		}) || !hasUsableBundledPluginTree(extensionsDir)) continue;
		if (pluginCacheExistsSync(path.join(packageRoot, "node_modules", ".pnpm"))) continue;
		return {
			source: packageRoot,
			message: "OpenClaw source checkout detected without pnpm workspace dependencies; run `pnpm install` from the repo root so bundled plugins can load package-local dependencies."
		};
	}
	return null;
}
function resolveTrustedExistingOverride(resolvedOverride) {
	const realOverride = safeRealpathSync(resolvedOverride);
	if (!realOverride) return null;
	const modulePackageRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	if (!modulePackageRoot || !isPluginInPackageBundledRoots({
		rootDir: realOverride,
		packageRoot: modulePackageRoot
	})) return null;
	if (!hasUsableBundledPluginTree(realOverride)) return null;
	return realOverride;
}
/** Checks physical containment in a package's source or compiled plugin trees. */
function isPluginInPackageBundledRoots(params) {
	const realPluginRoot = safeRealpathSync(params.rootDir);
	const realPackageRoot = safeRealpathSync(params.packageRoot);
	if (!realPluginRoot || !realPackageRoot) return false;
	return trustedBundledPluginRootsForPackageRoot(params.packageRoot).map((trustedRoot) => safeRealpathSync(trustedRoot)).some((trustedRoot) => trustedRoot !== null && isPathInside(realPackageRoot, trustedRoot) && isPathInside(trustedRoot, realPluginRoot));
}
/** Recognizes compiled bundle ownership only; this never confers plugin trust. */
function isForeignBundledPluginRoot(rootDir, env = process.env) {
	const realRootDir = safeRealpathSync(rootDir);
	if (!realRootDir) return false;
	const extensionsDir = path.dirname(realRootDir);
	const compiledDir = path.dirname(extensionsDir);
	if (path.basename(extensionsDir) !== "extensions" || !["dist", "dist-runtime"].includes(path.basename(compiledDir))) return false;
	const packageRoot = path.dirname(compiledDir);
	if (resolveOpenClawPackageRootSync({ cwd: packageRoot }) !== packageRoot || !isPluginInPackageBundledRoots({
		rootDir: realRootDir,
		packageRoot
	})) return false;
	const activeBundledDir = resolveBundledPluginsDir(env);
	const realActiveDir = activeBundledDir ? safeRealpathSync(activeBundledDir) : null;
	if (realActiveDir && isPathInside(realActiveDir, realRootDir)) return false;
	const runningRoots = resolvePackageRootsForBundledPlugins();
	return runningRoots.length > 0 && !runningRoots.some((runningRoot) => isPluginInPackageBundledRoots({
		rootDir: realRootDir,
		packageRoot: runningRoot
	}));
}
function resolveBundledDirFromPackageRoot(packageRoot, preference = "bundled") {
	const builtExtensionsDir = path.join(packageRoot, "dist", "extensions");
	const runtimeExtensionsDir = path.join(packageRoot, "dist-runtime", "extensions");
	if (isSourceCheckoutRoot(packageRoot)) {
		const sourceExtensionsDir = path.join(packageRoot, "extensions");
		return (preference === "source" ? [sourceExtensionsDir] : [
			builtExtensionsDir,
			runtimeExtensionsDir,
			sourceExtensionsDir
		]).find((rootDir) => isPluginInPackageBundledRoots({
			rootDir,
			packageRoot
		}) && hasUsableBundledPluginTree(rootDir));
	}
	return pluginCacheExistsSync(builtExtensionsDir) ? [runtimeExtensionsDir, builtExtensionsDir].find((rootDir) => isPluginInPackageBundledRoots({
		rootDir,
		packageRoot
	})) : void 0;
}
function resolveBundledPluginsDirUncached(env) {
	if (areBundledPluginsDisabled(env)) return resolveDisabledBundledPluginsDir();
	const override = env.OPENCLAW_BUNDLED_PLUGINS_DIR?.trim();
	let rejectedExistingOverride = null;
	if (override) {
		const resolvedOverride = resolveUserPath(override, env);
		if (pluginCacheExistsSync(resolvedOverride)) {
			if (shouldTrustTestBundledPluginsDirOverride(env)) return path.resolve(resolvedOverride);
			const trustedOverride = resolveTrustedExistingOverride(resolvedOverride);
			if (trustedOverride) return trustedOverride;
			rejectedExistingOverride = resolvedOverride;
		}
	}
	try {
		const argvRoot = resolveOpenClawPackageRootSync({ argv1: process.argv[1] });
		const safeArgvRoot = Boolean(argvRoot && rejectedExistingOverride && isPluginInPackageBundledRoots({
			rootDir: rejectedExistingOverride,
			packageRoot: argvRoot
		})) ? null : argvRoot;
		const moduleRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
		const packageRoots = uniqueStrings([safeArgvRoot, moduleRoot].filter((entry) => Boolean(entry)));
		for (const packageRoot of packageRoots) {
			const bundledDir = resolveBundledDirFromPackageRoot(packageRoot, resolvePluginRuntimeArtifactPreference());
			if (bundledDir) return bundledDir;
		}
	} catch {}
	try {
		const execDir = path.dirname(process.execPath);
		const siblingBuilt = path.join(execDir, "dist", "extensions");
		if (pluginCacheExistsSync(siblingBuilt)) return siblingBuilt;
		const sibling = path.join(execDir, "extensions");
		if (pluginCacheExistsSync(sibling)) return sibling;
	} catch {}
	try {
		let cursor = path.dirname(fileURLToPath(import.meta.url));
		for (let i = 0; i < 6; i += 1) {
			const candidate = path.join(cursor, "extensions");
			if (pluginCacheExistsSync(candidate)) return candidate;
			const parent = path.dirname(cursor);
			if (parent === cursor) break;
			cursor = parent;
		}
	} catch {}
}
function resolveBundledPluginsDir(env = process.env) {
	const disabled = areBundledPluginsDisabled(env);
	const override = disabled ? void 0 : env.OPENCLAW_BUNDLED_PLUGINS_DIR?.trim();
	const resolvedOverride = override ? resolveUserPath(override, env) : void 0;
	const trustOverride = shouldTrustTestBundledPluginsDirOverride(env);
	const argv1 = process.argv[1];
	const execPath = process.execPath;
	const cwd = tryProcessCwd();
	const metadata = getPluginCache().metadata;
	const cached = metadata.bundledPluginsDir;
	if (cached && cached.moduleUrl === import.meta.url && cached.disabled === disabled && cached.resolvedOverride === resolvedOverride && cached.trustOverride === trustOverride && cached.argv1 === argv1 && cached.execPath === execPath && cached.cwd === cwd) return cached.value;
	const value = resolveBundledPluginsDirUncached(env);
	metadata.bundledPluginsDir = {
		moduleUrl: import.meta.url,
		disabled,
		resolvedOverride,
		trustOverride,
		argv1,
		execPath,
		cwd,
		value
	};
	return value;
}
//#endregion
export { isSourceCheckoutRoot as a, resolveSourceCheckoutDependencyDiagnostic as c, resolveCanonicalDistRuntimeSource as d, resolvePluginRuntimeArtifactPreference as f, resolvePreferredBundledRootArtifact as h, isPluginInPackageBundledRoots as i, shouldTrustTestBundledPluginsDirOverride as l, resolvePluginRuntimeExecutionArtifact as m, hasUsableBundledPluginTree as n, resolveBundledDirFromPackageRoot as o, resolvePluginRuntimeArtifactSelection as p, isForeignBundledPluginRoot as r, resolveBundledPluginsDir as s, areBundledPluginsDisabled as t, prefersBuiltPluginArtifacts as u };
