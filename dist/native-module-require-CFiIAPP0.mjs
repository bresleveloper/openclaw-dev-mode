import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as PLUGIN_SOURCE_CAPTURE_PREFIX } from "./plugin-source-capture-path-DVlzzTlh.mjs";
import Module, { createRequire } from "node:module";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
//#region src/plugins/native-module-require.ts
const PLUGIN_SOURCE_MODULE_EXTENSIONS = [
	".ts",
	".tsx",
	".mts",
	".cts",
	".mtsx",
	".ctsx"
];
function isPluginSourceModulePath(modulePath) {
	return PLUGIN_SOURCE_MODULE_EXTENSIONS.includes(path.extname(modulePath).toLowerCase());
}
const nativeModuleLoadFailures = /* @__PURE__ */ new Map();
const moduleWithResolver = Module;
let nativeAliasHookSupport;
/** Older Bun loses createRequire's parent when its private resolver is wrapped. */
function supportsNativeModuleAliasHooks() {
	if (!process.versions.bun) return true;
	if (nativeAliasHookSupport !== void 0) return nativeAliasHookSupport;
	const previous = moduleWithResolver["_resolveFilename"];
	if (!previous) return nativeAliasHookSupport = false;
	let retainsParent = false;
	moduleWithResolver["_resolveFilename"] = (request, parent) => {
		retainsParent = typeof parent?.filename === "string";
		return request;
	};
	try {
		createRequire(import.meta.url).resolve(fileURLToPath(import.meta.url));
	} finally {
		moduleWithResolver["_resolveFilename"] = previous;
	}
	return nativeAliasHookSupport = retainsParent;
}
const bunRuntimeOnResolveProbe = resolveGlobalSingleton(Symbol.for("openclaw.bunRuntimeOnResolveProbe"), () => ({
	tested: false,
	supported: false
}));
/** Whether Bun can redirect runtime-computed specifiers through public onResolve hooks. */
function supportsBunRuntimeOnResolveTargets() {
	if (bunRuntimeOnResolveProbe.tested) return bunRuntimeOnResolveProbe.supported;
	bunRuntimeOnResolveProbe.tested = true;
	const bun = globalThis.Bun;
	if (!bun?.resolveSync) return false;
	const specifier = "openclaw-bun-runtime-onresolve-probe";
	const target = fileURLToPath(import.meta.url);
	let seen = false;
	try {
		bun.plugin({
			name: specifier,
			setup(builder) {
				builder.onResolve({
					filter: /^openclaw-bun-runtime-onresolve-probe$/u,
					namespace: "file"
				}, () => {
					seen = true;
					return {
						path: target,
						namespace: "file"
					};
				});
			}
		});
		bunRuntimeOnResolveProbe.supported = bun.resolveSync(specifier, path.dirname(target)) === target && seen;
	} catch {
		bunRuntimeOnResolveProbe.supported = false;
	}
	return bunRuntimeOnResolveProbe.supported;
}
const capturedModuleResolvers = resolveGlobalSingleton(Symbol.for("openclaw.capturedModuleResolvers"), () => ({
	installed: false,
	loaderInstalled: false,
	resolving: false,
	owners: /* @__PURE__ */ new Set()
}));
function resolveCapturedPluginModule(resolve) {
	if (capturedModuleResolvers.resolving) return;
	capturedModuleResolvers.resolving = true;
	try {
		for (const owner of capturedModuleResolvers.owners) {
			const target = resolve(owner);
			if (target) return target;
		}
	} finally {
		capturedModuleResolvers.resolving = false;
	}
}
function installCapturedPluginModuleResolver(bun) {
	if (bun) {
		bun.plugin({
			name: "openclaw-plugin-source-capture",
			setup(builder) {
				builder.onResolve({
					filter: /.*/,
					namespace: "file"
				}, ({ path: request, importer, kind }) => {
					const target = resolveCapturedPluginModule((owner) => owner.prepare(request, importer, kind));
					return target ? {
						path: target,
						namespace: "file"
					} : void 0;
				});
			}
		});
		return;
	}
	const previous = moduleWithResolver["_resolveFilename"];
	moduleWithResolver["_resolveFilename"] = (request, parent, isMain, options) => {
		const filename = parent?.filename;
		return (filename ? resolveCapturedPluginModule((owner) => owner.resolve(request, filename, () => previous(request, parent, isMain, options))) : void 0) ?? previous(request, parent, isMain, options);
	};
}
function installCapturedPluginModuleLoader(bun) {
	bun.plugin({
		name: "openclaw-plugin-source-jsx",
		setup(builder) {
			builder.onLoad({
				filter: new RegExp(`${PLUGIN_SOURCE_CAPTURE_PREFIX}[^/\\\\]+[/\\\\].*\\.[cm]?[jt]sx$`, "u"),
				namespace: "file"
			}, ({ path: modulePath }) => resolveCapturedPluginModule((owner) => owner.load?.(modulePath)) ?? {
				contents: fs.readFileSync(modulePath, "utf8"),
				loader: modulePath.toLowerCase().endsWith(".jsx") ? "jsx" : "tsx"
			});
		}
	});
}
/** Captured parents retain their resolver while their instance's consumers drain. */
function registerCapturedPluginModuleResolver(binding) {
	const bun = globalThis.Bun;
	if (!capturedModuleResolvers.installed) {
		installCapturedPluginModuleResolver(bun);
		capturedModuleResolvers.installed = true;
	}
	if (binding.load && bun && !capturedModuleResolvers.loaderInstalled) {
		installCapturedPluginModuleLoader(bun);
		capturedModuleResolvers.loaderInstalled = true;
	}
	capturedModuleResolvers.owners.add(binding);
	return () => {
		capturedModuleResolvers.owners.delete(binding);
	};
}
/** True for file extensions Node can load through the native JS module loader. */
function isJavaScriptModulePath(modulePath) {
	return [
		".js",
		".mjs",
		".cjs"
	].includes(path.extname(modulePath).toLowerCase());
}
function isBundledPluginDistModulePath(modulePath) {
	return modulePath.replace(/\\/g, "/").includes("/dist/extensions/");
}
function shouldPreferNativeModuleLoad(modulePath) {
	switch (path.extname(modulePath).trim().toLowerCase()) {
		case ".js":
		case ".mjs":
		case ".cjs":
		case ".json": return true;
		default: return false;
	}
}
function resolvePluginLoaderTryNative(modulePath, options) {
	if (isBundledPluginDistModulePath(modulePath)) return shouldPreferNativeModuleLoad(modulePath);
	return shouldPreferNativeModuleLoad(modulePath) || options?.preferBuiltDist === true && modulePath.includes(`${path.sep}dist${path.sep}`);
}
function isMissingTargetModuleError(error, modulePath) {
	if (error.code !== "MODULE_NOT_FOUND" || typeof error.message !== "string") return false;
	const firstLine = error.message.split("\n", 1)[0] ?? "";
	return firstLine.includes(`'${modulePath}'`) || firstLine.includes(`"${modulePath}"`);
}
function isSourceTransformFallbackError(error, modulePath) {
	if (!error || typeof error !== "object" || !("code" in error)) return false;
	const code = error.code;
	return code === "ERR_REQUIRE_ESM" || code === "ERR_REQUIRE_ASYNC_MODULE" || code === "ERR_REQUIRE_ESM_RACE_CONDITION" || code === "ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX" || code === "ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING" || code === "ERR_UNKNOWN_FILE_EXTENSION" || isMissingTargetModuleError(error, modulePath);
}
/** Attempts native require before falling back to source transform paths. */
function tryNativeRequireJavaScriptModule(moduleSpecifier, options = {}) {
	const modulePath = toNativeRequirePath(moduleSpecifier);
	const bunNativeSource = Boolean(process.versions.bun) && isPluginSourceModulePath(modulePath);
	if (!isJavaScriptModulePath(modulePath) && !bunNativeSource) return { ok: false };
	return tryNativeRequireModule(moduleSpecifier, options);
}
/** Loads prepared host aliases, including source SDK paths supported by the runtime. */
function tryNativeRequireModule(moduleSpecifier, options = {}) {
	const modulePath = toNativeRequirePath(moduleSpecifier);
	const require = createRequire(import.meta.url);
	if (isPluginSourceModulePath(modulePath) && !process.features.typescript && typeof require.extensions?.[path.extname(modulePath)] !== "function") return { ok: false };
	let resolvedPath;
	try {
		resolvedPath = withNativeRequireAliases(options.aliasMap, () => require.resolve(modulePath));
	} catch (error) {
		const code = error && typeof error === "object" ? Reflect.get(error, "code") : void 0;
		if (isSourceTransformFallbackError(error, modulePath) || options.fallbackOnMissingDependency === true && (code === "MODULE_NOT_FOUND" || code === "ERR_MODULE_NOT_FOUND")) return { ok: false };
		throw error;
	}
	try {
		const moduleExport = withNativeRequireAliases(options.aliasMap, () => require(modulePath));
		nativeModuleLoadFailures.delete(resolvedPath);
		return {
			ok: true,
			moduleExport
		};
	} catch (error) {
		const code = error && typeof error === "object" ? Reflect.get(error, "code") : void 0;
		if (nativeModuleLoadFailures.has(resolvedPath) && (code === "ERR_REQUIRE_ESM_RACE_CONDITION" || code === "ERR_INTERNAL_ASSERTION")) throw nativeModuleLoadFailures.get(resolvedPath);
		if (isSourceTransformFallbackError(error, modulePath)) return { ok: false };
		nativeModuleLoadFailures.set(resolvedPath, error);
		throw error;
	}
}
/** Explicit public-library invalidation refreshes the current path synchronously. */
function clearPluginModuleRequireCache(modulePath, dependencyRoot) {
	const require = createRequire(import.meta.url);
	const seen = /* @__PURE__ */ new Set();
	const clear = (id) => {
		if (seen.has(id) || !isPathInside(dependencyRoot, id)) return;
		seen.add(id);
		for (const child of require.cache[id]?.children ?? []) clear(child.id);
		delete require.cache[id];
	};
	clear(modulePath);
}
function toNativeRequirePath(specifier) {
	try {
		return /^file:\/\//iu.test(specifier) ? fileURLToPath(specifier) : specifier;
	} catch {
		return specifier;
	}
}
/** Runs a native require block with temporary CJS/ESM alias hooks and restores both afterward. */
function withNativeRequireAliases(aliasMap, run) {
	if (!aliasMap || !moduleWithResolver["_resolveFilename"]) return run();
	const resolveAlias = typeof aliasMap === "function" ? aliasMap : (specifier) => aliasMap[specifier];
	const originalResolveFilename = moduleWithResolver["_resolveFilename"];
	const esmHooks = moduleWithResolver.registerHooks?.({ resolve(specifier, context, nextResolve) {
		const parent = context.parentURL?.startsWith("file:") ? fileURLToPath(context.parentURL) : void 0;
		const aliasTarget = resolveAlias(specifier, parent);
		if (aliasTarget) return {
			shortCircuit: true,
			url: pathToFileURL(aliasTarget).href
		};
		return nextResolve(specifier, context);
	} });
	moduleWithResolver["_resolveFilename"] = ((request, parent, isMain, options) => {
		const aliasTarget = resolveAlias(request, parent?.filename);
		if (aliasTarget) return aliasTarget;
		return originalResolveFilename(request, parent, isMain, options);
	});
	try {
		return run();
	} finally {
		moduleWithResolver["_resolveFilename"] = originalResolveFilename;
		esmHooks?.deregister();
	}
}
//#endregion
export { registerCapturedPluginModuleResolver as a, supportsNativeModuleAliasHooks as c, isPluginSourceModulePath as i, tryNativeRequireJavaScriptModule as l, clearPluginModuleRequireCache as n, resolvePluginLoaderTryNative as o, isJavaScriptModulePath as r, supportsBunRuntimeOnResolveTargets as s, PLUGIN_SOURCE_MODULE_EXTENSIONS as t, tryNativeRequireModule as u };
