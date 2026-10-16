import { l as getPluginCacheRoot, u as getPluginCacheSource } from "./plugin-cache-BABafcXD.mjs";
import { n as describeRootFileOpenFailure } from "./boundary-file-read-CCth2Hwg.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as openPluginRootFileSync } from "./path-safety-6KJ2Rbnw.mjs";
import { r as isJavaScriptModulePath, t as PLUGIN_SOURCE_MODULE_EXTENSIONS } from "./native-module-require-BX9Ubdbu.mjs";
import { t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-CUtYxPiw.mjs";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
//#region src/channels/plugins/module-loader.ts
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
	if (!path.extname(resolvedPath)) for (const extension of PLUGIN_SOURCE_MODULE_EXTENSIONS) {
		const candidate = `${resolvedPath}${extension}`;
		if (fs.existsSync(candidate)) return candidate;
	}
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
