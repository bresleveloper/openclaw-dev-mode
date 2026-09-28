import { o as getPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { l as pluginCacheRealpathSync, s as pluginCacheExistsSync } from "./package-manifest-C8sTeZKW.mjs";
import { a as isSourceCheckoutRoot, i as isPluginInPackageBundledRoots } from "./bundled-dir-BGJkK8G5.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/dev-source-root.ts
/** Env var that points bundled-plugin lookup at an OpenClaw source checkout. */
const OPENCLAW_DEV_SOURCE_ROOT_ENV = "OPENCLAW_DEV_SOURCE_ROOT";
function readPackageName(packageJsonPath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
		return typeof parsed.name === "string" ? parsed.name : null;
	} catch {
		return null;
	}
}
/** Resolves and validates the configured OpenClaw development source root. */
function resolveOpenClawDevSourceRoot(env = process.env) {
	const rawRoot = env[OPENCLAW_DEV_SOURCE_ROOT_ENV]?.trim();
	if (!rawRoot) return null;
	const resolvedRoot = resolveUserPath(rawRoot, env);
	const roots = getPluginCache().sdk.devSourceRoots;
	if (roots.has(resolvedRoot)) return roots.get(resolvedRoot) ?? null;
	const realRoot = pluginCacheRealpathSync(resolvedRoot);
	const result = realRoot && readPackageName(path.join(realRoot, "package.json")) === "openclaw" && pluginCacheExistsSync(path.join(realRoot, "src")) && pluginCacheExistsSync(path.join(realRoot, "extensions")) ? realRoot : null;
	roots.set(resolvedRoot, result);
	return result;
}
/** Source builds own their bundled SDK consumers even without an explicit development selector. */
function resolveBundledPluginSourceRoot(env = process.env) {
	const selected = resolveOpenClawDevSourceRoot(env);
	if (selected) return selected;
	const hostRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	return hostRoot && isSourceCheckoutRoot(hostRoot) ? hostRoot : null;
}
function formatSourceBundledPluginNotice(pluginId) {
	return `Kept bundled plugin "${pluginId}" from the OpenClaw source build; the registry artifact has no matching host SDK build identity. Matching version strings do not establish SDK compatibility.`;
}
/** Prioritizes already-bundled candidates; the selector itself never grants provenance. */
function isBundledPluginInsideDevSourceRoot(params) {
	const devSourceRoot = resolveBundledPluginSourceRoot(params.env);
	if (!devSourceRoot) return false;
	if (!isPluginInPackageBundledRoots({
		packageRoot: devSourceRoot,
		rootDir: resolveUserPath(params.rootDir, params.env)
	})) return false;
	if (resolveOpenClawDevSourceRoot(params.env)) return true;
	const hostRoot = pluginCacheRealpathSync(devSourceRoot);
	const pluginRoot = pluginCacheRealpathSync(resolveUserPath(params.rootDir, params.env));
	return Boolean(hostRoot && pluginRoot && ["dist", "dist-runtime"].some((tree) => isPathInside(path.join(hostRoot, tree, "extensions"), pluginRoot)));
}
//#endregion
export { resolveOpenClawDevSourceRoot as i, isBundledPluginInsideDevSourceRoot as n, resolveBundledPluginSourceRoot as r, formatSourceBundledPluginNotice as t };
