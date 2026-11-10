import { c as getPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CPodxfi3.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { a as pluginCacheRealpathSync, l as readPluginCacheJsonFile, r as pluginCacheExistsSync } from "./plugin-cache-files-VxWaav6j.mjs";
import { a as isSourceCheckoutRoot, i as isPluginInPackageBundledRoots } from "./bundled-dir-LfC_CFuw.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/dev-source-root.ts
/** Env var that points bundled-plugin lookup at an OpenClaw source checkout. */
const OPENCLAW_DEV_SOURCE_ROOT_ENV = "OPENCLAW_DEV_SOURCE_ROOT";
/** Packaging records this only for same-commit plugins in a non-release image. */
function readStagedOfficialPluginIds(packageRoot) {
	const result = readPluginCacheJsonFile(path.join(packageRoot, "dist", "build-info.json"));
	if (!result.ok || !isRecord(result.value)) return [];
	const { commit, stagedOfficialPlugins } = result.value;
	return typeof commit === "string" && /^[0-9a-f]{40}$/.test(commit) && isRecord(stagedOfficialPlugins) && stagedOfficialPlugins.commit === commit && Array.isArray(stagedOfficialPlugins.pluginIds) ? stagedOfficialPlugins.pluginIds : [];
}
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
	return hostRoot && (isSourceCheckoutRoot(hostRoot) || readStagedOfficialPluginIds(hostRoot).length > 0) ? hostRoot : null;
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
	if (!isSourceCheckoutRoot(devSourceRoot)) return Boolean(hostRoot && pluginRoot && readStagedOfficialPluginIds(hostRoot).includes(path.basename(pluginRoot)) && path.dirname(pluginRoot) === path.join(hostRoot, "dist", "extensions"));
	return Boolean(hostRoot && pluginRoot && ["dist", "dist-runtime"].some((tree) => isPathInside(path.join(hostRoot, tree, "extensions"), pluginRoot)));
}
//#endregion
export { resolveOpenClawDevSourceRoot as i, isBundledPluginInsideDevSourceRoot as n, resolveBundledPluginSourceRoot as r, formatSourceBundledPluginNotice as t };
