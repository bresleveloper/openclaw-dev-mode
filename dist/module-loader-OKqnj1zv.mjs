import { l as getPluginCacheRoot, u as getPluginCacheSource } from "./plugin-cache-A1nT2dqa.mjs";
import { n as describeRootFileOpenFailure } from "./boundary-file-read-D-Aa04On.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { r as isJavaScriptModulePath, t as PLUGIN_SOURCE_MODULE_EXTENSIONS } from "./native-module-require-CFiIAPP0.mjs";
import { t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { n as openPluginRootFileSync } from "./path-safety-Cc0rrc_m.mjs";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
//#region src/channels/plugins/module-loader.ts
/**
* Channel plugin module loader.
*
* Loads JavaScript or source plugin modules through native require or cached TS loaders.
*/
const nodeRequire = createRequire(import.meta.url);
function loadModule(modulePath) {
	const extension = path.extname(modulePath).toLowerCase();
	if (!isJavaScriptModulePath(modulePath) && !PLUGIN_SOURCE_MODULE_EXTENSIONS.includes(extension)) throw new Error(`channel plugin module must be built JavaScript: ${modulePath}`);
	return getCachedPluginModuleLoader({
		modulePath,
		importerUrl: import.meta.url,
		loaderFilename: import.meta.url,
		cacheScopeKey: "channel-plugin-module-loader"
	})(modulePath);
}
function resolveSourceModuleCandidates(rootDir, specifier) {
	const normalizedSpecifier = specifier.replace(/\\/g, "/");
	const resolvedPath = path.resolve(rootDir, normalizedSpecifier);
	if (path.extname(resolvedPath)) return [];
	return PLUGIN_SOURCE_MODULE_EXTENSIONS.map((extension) => `${resolvedPath}${extension}`);
}
/**
* Resolves a plugin-relative module specifier to an existing candidate path.
*/
function resolveExistingPluginModulePath(rootDir, specifier) {
	const artifacts = getPluginCacheRoot(rootDir).artifacts;
	const key = `channel-specifier:${specifier}`;
	const cached = artifacts.get(key);
	if (cached) return cached.modulePath;
	const modulePath = resolvePluginModulePath(rootDir, specifier);
	artifacts.set(key, {
		modulePath,
		boundaryRoot: rootDir
	});
	return modulePath;
}
function resolvePluginModulePath(rootDir, specifier) {
	const resolvedPath = path.resolve(rootDir, specifier.replace(/\\/g, "/"));
	try {
		return nodeRequire.resolve(resolvedPath);
	} catch (error) {
		if (!hasErrnoCode(error, "MODULE_NOT_FOUND")) throw error;
	}
	for (const candidate of resolveSourceModuleCandidates(rootDir, specifier)) if (fs.existsSync(candidate)) return candidate;
	return resolvedPath;
}
/**
* Loads a channel plugin module after enforcing plugin-root file boundaries.
*
* `rootDir` is always the plugin's own directory, so the containment failure is
* reported against that one root; no caller boundary override exists.
*/
function loadChannelPluginModule(params) {
	const source = getPluginCacheSource(params.modulePath);
	const key = `channel-plugin-module:${path.resolve(params.rootDir)}`;
	const cached = source.variants.get(key)?.exports;
	if (cached) return cached.value;
	const boundaryLabel = "plugin root";
	const opened = openPluginRootFileSync({
		filePath: params.modulePath,
		rootPath: params.rootDir,
		rejectHardlinks: false
	});
	if (!opened.ok) throw new Error(describeRootFileOpenFailure({
		failure: opened,
		subject: "plugin module path",
		boundaryLabel,
		filePath: params.modulePath
	}), { cause: opened.error });
	const safePath = opened.path;
	fs.closeSync(opened.fd);
	const value = loadModule(safePath);
	source.variants.set(key, { exports: { value } });
	return value;
}
//#endregion
export { resolveExistingPluginModulePath as n, loadChannelPluginModule as t };
