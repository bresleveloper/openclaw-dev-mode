import { D as withPluginCache, O as getPluginSdkAliasFacts, k as getPluginSdkHostFacts, o as getPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-BKwhAL2c.mjs";
import { t as PLUGIN_SOURCE_MODULE_EXTENSIONS } from "./native-module-require-CFiIAPP0.mjs";
import { d as readPluginCacheDirectory, f as readPluginCacheFile, l as pluginCacheRealpathSync, o as parsePluginCacheJson, s as pluginCacheExistsSync, u as pluginCacheStatSync } from "./package-manifest-C8sTeZKW.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as resolveOpenClawDevSourceRoot } from "./dev-source-root-b-YTkLfc.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
//#region src/plugins/sdk-alias-normalization.ts
const JITI_NORMALIZED_ALIAS_SYMBOL = Symbol.for("pathe:normalizedAlias");
const JITI_ALIAS_ROOT_SENTINELS = /* @__PURE__ */ new Set([
	"/",
	"\\",
	void 0
]);
const JITI_CONCRETE_ALIAS_TARGET_PATTERN = /^(?:[A-Za-z]:[/\\]|[/\\])/;
function hasJitiNormalizedAliasMarker(aliasMap) {
	return Boolean(Reflect.get(aliasMap, JITI_NORMALIZED_ALIAS_SYMBOL));
}
function createJitiAliasContentCacheKey(aliasMap) {
	return Object.entries(aliasMap).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, value]) => `${key}\0${value}`).join("\0");
}
function isConcreteJitiAliasTarget(target) {
	return typeof target === "string" && JITI_CONCRETE_ALIAS_TARGET_PATTERN.test(target);
}
function resolveJitiAliasTarget(aliasKey, aliasKeys, aliasMap) {
	let target = aliasMap[aliasKey];
	const seenTargets = /* @__PURE__ */ new Set();
	const seenAliasKeys = /* @__PURE__ */ new Set();
	while (target && !isConcreteJitiAliasTarget(target) && !seenTargets.has(target)) {
		seenTargets.add(target);
		let nextTarget;
		for (const candidateKey of aliasKeys) {
			if (candidateKey === aliasKey || aliasKey.startsWith(candidateKey) || !target.startsWith(candidateKey) || !JITI_ALIAS_ROOT_SENTINELS.has(target[candidateKey.length])) continue;
			if (seenAliasKeys.has(candidateKey)) return target;
			seenAliasKeys.add(candidateKey);
			nextTarget = aliasMap[candidateKey] + target.slice(candidateKey.length);
			break;
		}
		if (!nextTarget || nextTarget === target) break;
		target = nextTarget;
	}
	return target;
}
function normalizePluginLoaderAliasMapForJiti(aliasMap) {
	if (hasJitiNormalizedAliasMarker(aliasMap)) return aliasMap;
	const facts = getPluginSdkAliasFacts(getPluginCache().sdk, aliasMap);
	const cachedByInput = facts.normalizedJiti;
	if (cachedByInput) return cachedByInput;
	const cacheKey = createJitiAliasContentCacheKey(aliasMap);
	const normalizedJitiAliasMapCache = getPluginCache().sdk.normalizedJitiAliases;
	const cached = normalizedJitiAliasMapCache.get(cacheKey);
	if (cached) {
		facts.normalizedJiti = cached;
		return cached;
	}
	const aliasDepth = /* @__PURE__ */ new Map();
	const getAliasDepth = (key) => {
		const cachedDepth = aliasDepth.get(key);
		if (cachedDepth !== void 0) return cachedDepth;
		const depth = key.split("/").length;
		aliasDepth.set(key, depth);
		return depth;
	};
	const normalizedAliasMap = Object.fromEntries(Object.entries(aliasMap).toSorted(([left], [right]) => getAliasDepth(right) - getAliasDepth(left)));
	const aliasKeys = Object.keys(normalizedAliasMap);
	for (const aliasKey of aliasKeys) {
		const target = normalizedAliasMap[aliasKey];
		if (!target || isConcreteJitiAliasTarget(target)) continue;
		const resolvedTarget = resolveJitiAliasTarget(aliasKey, aliasKeys, normalizedAliasMap);
		if (resolvedTarget) normalizedAliasMap[aliasKey] = resolvedTarget;
	}
	Object.defineProperty(normalizedAliasMap, JITI_NORMALIZED_ALIAS_SYMBOL, {
		value: true,
		enumerable: false
	});
	normalizedJitiAliasMapCache.set(cacheKey, normalizedAliasMap);
	facts.normalizedJiti = normalizedAliasMap;
	return normalizedAliasMap;
}
//#endregion
//#region src/plugins/sdk-alias-workspace.ts
const WORKSPACE_PACKAGE_ALIAS_SUBPATHS = [
	["gateway-client", [
		"",
		"readiness",
		"timeouts",
		"websocket-data"
	]],
	["gateway-protocol", [
		"",
		"client-info",
		"connect-error-details",
		"frame-guards",
		"gateway-error-details",
		"restart-unavailable",
		"schema",
		"startup-unavailable",
		"version"
	]],
	["markdown-core", [
		"",
		"code-spans",
		"fences",
		"frontmatter",
		"ir",
		"render",
		"render-aware-chunking",
		"tables",
		"types"
	]],
	["media-generation-core", [
		"",
		"capability-model-ref",
		"catalog",
		"model-ref",
		"normalization"
	]],
	["retry", [""]],
	["terminal-core", [
		"",
		"ansi",
		"decorative-emoji",
		"health-style",
		"links",
		"note",
		"osc-progress",
		"palette",
		"progress-line",
		"prompt-select-styled",
		"prompt-select-styled-params",
		"prompt-style",
		"restore",
		"safe-text",
		"stream-writer",
		"table",
		"terminal-link",
		"theme"
	]],
	["net-policy", [
		"",
		"ip",
		"ipv4",
		"redact-sensitive-url",
		"url-protocol",
		"url-userinfo"
	]],
	["model-catalog-core", [
		"",
		"configured-model-refs",
		"model-catalog-refs",
		"model-catalog-normalize",
		"model-catalog-pricing",
		"model-catalog-types",
		"provider-id",
		"provider-model-id-normalization",
		"provider-model-id-normalize"
	]]
];
const WORKSPACE_PACKAGE_ALIAS_ENTRIES = WORKSPACE_PACKAGE_ALIAS_SUBPATHS.flatMap(([packageDir, subpaths]) => subpaths.map((subpath) => ({
	packageName: `@openclaw/${packageDir}`,
	packageDir,
	subpath,
	srcFile: `${subpath || "index"}.ts`,
	distFile: `${subpath || "index"}.mjs`
})));
const WORKSPACE_PACKAGE_EXPORT_DIRS = [
	"media-core",
	"normalization-core",
	"acp-core",
	"llm-core"
];
const WORKSPACE_PACKAGE_ALIAS_NAMES = /* @__PURE__ */ new Set([...WORKSPACE_PACKAGE_ALIAS_SUBPATHS.map(([name]) => `@openclaw/${name}`), ...WORKSPACE_PACKAGE_EXPORT_DIRS.map((name) => `@openclaw/${name}`)]);
const ROOT_PACKAGED_WORKSPACE_PACKAGE_DIRS = /* @__PURE__ */ new Set([
	"acp-core",
	"media-core",
	"normalization-core",
	"retry",
	"terminal-core"
]);
//#endregion
//#region src/plugins/sdk-alias.ts
const STARTUP_ARGV1 = process.argv[1];
function sdkHost(packageRoot) {
	return getPluginSdkHostFacts(getPluginCache().sdk, path.resolve(packageRoot));
}
function readSdkJsonFile(filePath) {
	const file = readPluginCacheFile({
		rootDir: path.dirname(filePath),
		relativePath: path.basename(filePath),
		rejectHardlinks: false
	});
	const parsed = file.ok ? parsePluginCacheJson(file) : void 0;
	return parsed?.ok ? parsed.value : null;
}
function sanitizeJitiCachePathSegment(value) {
	const normalized = value.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
	return normalized.length > 0 ? normalized : "unknown";
}
function resolveJitiFsCacheRoot() {
	const xdgCacheHome = process.env.XDG_CACHE_HOME?.trim();
	if (xdgCacheHome && path.isAbsolute(xdgCacheHome)) return xdgCacheHome;
	const homeDir = resolveRequiredHomeDir(process.env, os.homedir);
	if (process.platform === "win32") {
		const localAppData = process.env.LOCALAPPDATA?.trim();
		return localAppData && path.isAbsolute(localAppData) ? localAppData : path.join(homeDir, "AppData", "Local");
	}
	return process.platform === "darwin" ? path.join(homeDir, "Library", "Caches") : path.join(homeDir, ".cache");
}
function readJitiBooleanEnv(name, defaultValue) {
	if (!(name in process.env)) return defaultValue;
	try {
		return Boolean(JSON.parse(process.env[name] ?? ""));
	} catch {
		return defaultValue;
	}
}
function shouldUseJitiFsCache() {
	return readJitiBooleanEnv("JITI_FS_CACHE", readJitiBooleanEnv("JITI_CACHE", true));
}
function resolvePluginLoaderJitiNativeModules() {
	try {
		const configured = JSON.parse(process.env.JITI_NATIVE_MODULES ?? "[]");
		const nativeModules = Array.isArray(configured) ? configured.filter((entry) => typeof entry === "string") : [];
		return [.../* @__PURE__ */ new Set([...nativeModules, "openclaw"])];
	} catch {
		return ["openclaw"];
	}
}
function normalizeJitiAliasTargetPath(targetPath) {
	const canonicalPath = pluginCacheRealpathSync(targetPath) ?? targetPath;
	return process.platform === "win32" ? canonicalPath.replace(/\\/g, "/") : canonicalPath;
}
function resolveLoaderModulePath(params = {}) {
	return params.modulePath ?? fileURLToPath(params.moduleUrl ?? import.meta.url);
}
function readPluginSdkPackageJson(packageRoot) {
	const facts = sdkHost(packageRoot);
	if (facts.packageJson !== void 0) return facts.packageJson;
	const parsed = readSdkJsonFile(path.join(packageRoot, "package.json"));
	facts.packageJson = isRecord(parsed) ? {
		...typeof parsed.name === "string" ? { name: parsed.name } : {},
		...isRecord(parsed.exports) ? { exports: parsed.exports } : {},
		...typeof parsed.bin === "string" || isRecord(parsed.bin) ? { bin: parsed.bin } : {},
		...typeof parsed.version === "string" ? { version: parsed.version } : {}
	} : null;
	return facts.packageJson;
}
function resolveJitiCacheModulePath(params = {}) {
	if (params.modulePath?.startsWith("file://")) try {
		return fileURLToPath(params.modulePath);
	} catch {}
	return resolveLoaderModulePath(params);
}
function resolvePluginLoaderJitiFsCacheDir(params = {}) {
	const modulePath = resolveJitiCacheModulePath(params);
	const packageRoot = resolveLoaderPackageRoot({
		...params,
		modulePath
	}) ?? path.dirname(modulePath);
	const packageJsonPath = path.join(packageRoot, "package.json");
	const version = sanitizeJitiCachePathSegment(readPluginSdkPackageJson(packageRoot)?.version ?? "unknown");
	let installMarker = "no-package-json";
	const stat = pluginCacheStatSync(packageJsonPath);
	if (stat) installMarker = `${Math.trunc(stat.mtimeMs)}-${stat.size}`;
	return path.join(resolveJitiFsCacheRoot(), "openclaw", "jiti", version, sanitizeJitiCachePathSegment(installMarker));
}
function resolvePluginLoaderJitiFsCacheOption(params = {}) {
	return shouldUseJitiFsCache() ? resolvePluginLoaderJitiFsCacheDir(params) : false;
}
function isSafePluginSdkSubpathSegment(subpath) {
	return /^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(subpath);
}
function listPluginSdkSubpathsFromPackageJson(pkg) {
	return Object.keys(pkg.exports ?? {}).filter((key) => key.startsWith("./plugin-sdk/")).map((key) => key.slice(13)).filter((subpath) => isSafePluginSdkSubpathSegment(subpath)).toSorted();
}
function hasTrustedOpenClawRootIndicator(params) {
	const facts = sdkHost(params.packageRoot);
	if (facts.trustedRoot !== void 0) return facts.trustedRoot;
	const packageExports = params.packageJson.exports ?? {};
	if (!Object.keys(packageExports).some((key) => key.startsWith("./plugin-sdk/"))) return facts.trustedRoot = false;
	const hasCliEntryExport = Object.hasOwn(packageExports, "./cli-entry");
	const hasOpenClawBin = typeof params.packageJson.bin === "string" && normalizeLowercaseStringOrEmpty(params.packageJson.bin).includes("openclaw") || typeof params.packageJson.bin === "object" && params.packageJson.bin !== null && typeof params.packageJson.bin.openclaw === "string";
	return facts.trustedRoot = hasCliEntryExport || hasOpenClawBin || pluginCacheExistsSync(path.join(params.packageRoot, "openclaw.mjs"));
}
function readPluginSdkSubpathsFromPackageRoot(packageRoot) {
	const facts = sdkHost(packageRoot);
	if (facts.exportedSubpaths !== void 0) return facts.exportedSubpaths;
	const pkg = readPluginSdkPackageJson(packageRoot);
	if (!pkg) return facts.exportedSubpaths = null;
	if (!hasTrustedOpenClawRootIndicator({
		packageRoot,
		packageJson: pkg
	})) return facts.exportedSubpaths = null;
	const subpaths = listPluginSdkSubpathsFromPackageJson(pkg);
	return facts.exportedSubpaths = subpaths.length > 0 ? subpaths : null;
}
function resolveTrustedOpenClawRootFromArgvHint(params) {
	if (!params.argv1) return null;
	const packageRoot = resolveOpenClawPackageRootSync({
		cwd: params.cwd,
		argv1: params.argv1
	});
	if (!packageRoot) return null;
	const packageJson = readPluginSdkPackageJson(packageRoot);
	if (!packageJson) return null;
	return hasTrustedOpenClawRootIndicator({
		packageRoot,
		packageJson
	}) ? packageRoot : null;
}
function findNearestPluginSdkPackageRoot(startDir, maxDepth = 12) {
	let cursor = path.resolve(startDir);
	for (let i = 0; i < maxDepth; i += 1) {
		if (readPluginSdkSubpathsFromPackageRoot(cursor)) return cursor;
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	return null;
}
function resolveLoaderPackageRoot(params) {
	const cwd = params.cwd ?? path.dirname(params.modulePath);
	const fromModulePath = resolveOpenClawPackageRootSync({ cwd });
	if (fromModulePath) return fromModulePath;
	const argv1 = params.argv1 ?? process.argv[1];
	const moduleUrl = params.moduleUrl ?? (params.modulePath ? void 0 : import.meta.url);
	return resolveOpenClawPackageRootSync({
		cwd,
		...argv1 ? { argv1 } : {},
		...moduleUrl ? { moduleUrl } : {}
	});
}
function createPluginRuntimeModuleCandidateMap(packageRoot) {
	return {
		src: path.join(packageRoot, "src", "plugins", "runtime", "index.ts"),
		dist: path.join(packageRoot, "dist", "plugins", "runtime", "index.js")
	};
}
function appendPluginRuntimeModuleCandidates(candidates, packageRoot, orderedKinds) {
	const candidateMap = createPluginRuntimeModuleCandidateMap(packageRoot);
	for (const kind of orderedKinds) candidates.push(candidateMap[kind]);
}
function appendSiblingPluginRuntimeModuleCandidates(candidates, runtimeDir, orderedKinds) {
	const candidateMap = {
		src: path.join(runtimeDir, "index.ts"),
		dist: path.join(runtimeDir, "index.js")
	};
	for (const kind of orderedKinds) candidates.push(candidateMap[kind]);
}
function dedupeResolvedPaths(paths) {
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const candidate of paths) {
		const resolved = path.resolve(candidate);
		if (seen.has(resolved)) continue;
		seen.add(resolved);
		deduped.push(resolved);
	}
	return deduped;
}
function listAncestorPluginRuntimeModuleCandidates(params) {
	const candidates = [];
	for (const start of params.starts) {
		if (!start) continue;
		let cursor = path.resolve(start);
		const maxDepth = params.maxDepth ?? 12;
		for (let i = 0; i < maxDepth; i += 1) {
			appendPluginRuntimeModuleCandidates(candidates, cursor, params.orderedKinds);
			const parent = path.dirname(cursor);
			if (parent === cursor) break;
			cursor = parent;
		}
	}
	return dedupeResolvedPaths(candidates);
}
function listArgvRuntimeFallbackStartDirs(argv1) {
	if (!argv1) return [];
	const normalized = path.resolve(argv1);
	const starts = [];
	const parts = normalized.split(path.sep);
	const binIndex = parts.lastIndexOf(".bin");
	if (binIndex > 0 && parts[binIndex - 1] === "node_modules") {
		const binName = path.basename(normalized);
		const nodeModulesDir = parts.slice(0, binIndex).join(path.sep);
		starts.push(path.join(nodeModulesDir, binName));
	}
	try {
		const resolved = pluginCacheRealpathSync(normalized);
		if (resolved && resolved !== normalized) starts.push(path.dirname(resolved));
	} catch {}
	starts.push(path.dirname(normalized));
	return dedupeResolvedPaths(starts);
}
function resolveDevSourceRootParam(params) {
	return params.devSourceRoot !== void 0 ? params.devSourceRoot : resolveOpenClawDevSourceRoot(process.env);
}
function resolveLoaderPluginSdkPackageRoot(params) {
	const devSourceRoot = resolveDevSourceRootParam(params);
	if (devSourceRoot) return devSourceRoot;
	const cwd = params.cwd ?? path.dirname(params.modulePath);
	return (params.moduleUrl ? resolveOpenClawPackageRootSync({ moduleUrl: params.moduleUrl }) : null) ?? resolveOpenClawPackageRootSync({ cwd }) ?? resolveTrustedOpenClawRootFromArgvHint({
		cwd,
		argv1: params.argv1
	}) ?? findNearestPluginSdkPackageRoot(path.dirname(params.modulePath)) ?? (params.cwd ? findNearestPluginSdkPackageRoot(params.cwd) : null) ?? findNearestPluginSdkPackageRoot(process.cwd());
}
function resolvePluginSdkAliasCandidateOrder(params) {
	if (params.pluginSdkResolution === "dist") return ["dist", "src"];
	if (params.pluginSdkResolution === "src") return ["src", "dist"];
	const normalizedModulePath = params.modulePath.replace(/\\/g, "/");
	const isDistRuntime = /\/dist(?:-runtime)?\//.test(normalizedModulePath);
	const isSourceRuntime = normalizedModulePath.includes("/src/");
	return isDistRuntime || !isSourceRuntime && params.isProduction ? ["dist", "src"] : ["src", "dist"];
}
const PLUGIN_SDK_PACKAGE_NAMES = ["openclaw/plugin-sdk", "@openclaw/plugin-sdk"];
const CODEX_MCP_PROJECTION_PLUGIN_SDK_SUBPATH = "codex-mcp-projection";
const CODEX_SESSION_TRANSCRIPT_PLUGIN_SDK_SUBPATH = "codex-session-transcript-runtime";
const NATIVE_HOOK_RELAY_RUNTIME_PLUGIN_SDK_SUBPATH = "native-hook-relay-runtime";
const CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH = "ssrf-runtime-internal";
const PRIVATE_QA_ONLY_PLUGIN_SDK_SUBPATHS = /* @__PURE__ */ new Set([
	"agent-runtime-test-contracts",
	"channel-contract-testing",
	"channel-ingress-test-runtime",
	"channel-target-testing",
	"channel-test-helpers",
	"plugin-test-api",
	"plugin-test-contracts",
	"plugin-state-test-runtime",
	"plugin-test-runtime",
	"provider-http-test-mocks",
	"provider-test-contracts",
	"qa-channel",
	"qa-channel-protocol",
	"qa-lab",
	"qa-runtime",
	"reply-payload-testing",
	"sqlite-runtime-testing",
	"test-env",
	"test-fixtures",
	"test-live",
	"test-live-auth",
	"test-media-generation",
	"test-media-understanding",
	"test-node-mocks"
]);
const PRIVATE_PLUGIN_SDK_SUBPATH_OWNERS = [
	{
		bundledPluginId: "codex",
		officialInstalledPackageName: "@openclaw/codex",
		allowPrivateQaCli: true,
		subpaths: [
			CODEX_MCP_PROJECTION_PLUGIN_SDK_SUBPATH,
			CODEX_SESSION_TRANSCRIPT_PLUGIN_SDK_SUBPATH,
			NATIVE_HOOK_RELAY_RUNTIME_PLUGIN_SDK_SUBPATH
		]
	},
	{
		bundledPluginId: "ollama",
		allowPrivateQaCli: false,
		subpaths: [CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH]
	},
	{
		bundledPluginId: "browser",
		allowPrivateQaCli: false,
		subpaths: [CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH]
	},
	{
		bundledPluginId: "llama-cpp",
		officialInstalledPackageName: "@openclaw/llama-cpp-provider",
		allowPrivateQaCli: false,
		subpaths: [CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH]
	}
];
const PLUGIN_SDK_SOURCE_CANDIDATE_EXTENSIONS = [
	".ts",
	".mts",
	".js",
	".mjs",
	".cts",
	".cjs"
];
const BUNDLED_PLUGIN_PUBLIC_SURFACE_SOURCE_PATTERN = /^(?:api|runtime-api|test-api|.+-api)$/u;
const JS_STATIC_RELATIVE_DEPENDENCY_PATTERN = /(?:\bfrom\s*["']|\bimport\s*\(\s*["']|\brequire\s*\(\s*["'])(\.{1,2}\/[^"']+)["']/g;
function normalizePackageExportSubpath(exportKey) {
	if (exportKey === ".") return "";
	if (!exportKey.startsWith("./")) return null;
	const subpath = exportKey.slice(2);
	return subpath && !subpath.includes("..") ? subpath : null;
}
function resolvePackageExportImportPath(value) {
	if (typeof value === "string") return value;
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const record = value;
	return typeof record.import === "string" ? record.import : typeof record.default === "string" ? record.default : null;
}
function listRootPackagedWorkspacePackageAliasEntries(params) {
	const distRoot = path.join(params.packageRoot, "dist", params.packageDir);
	if (!pluginCacheExistsSync(distRoot)) return [];
	const entries = [];
	const visit = (dir, prefix = "") => {
		for (const entry of readPluginCacheDirectory(dir)) {
			const relativePath = prefix ? path.join(prefix, entry.name) : entry.name;
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				visit(fullPath, relativePath);
				continue;
			}
			if (!entry.isFile() || !relativePath.endsWith(".js")) continue;
			const normalizedRelativePath = relativePath.split(path.sep).join("/");
			const subpath = normalizedRelativePath === "index.js" ? "" : normalizedRelativePath.slice(0, -3);
			if (subpath.includes("..")) continue;
			entries.push({
				packageName: params.packageName,
				packageDir: params.packageDir,
				subpath,
				srcFile: `${subpath || "index"}.ts`,
				distFile: relativePath
			});
		}
	};
	visit(distRoot);
	return entries.toSorted((a, b) => a.subpath.localeCompare(b.subpath));
}
function listWorkspacePackageExportAliasEntries(params) {
	const cache = sdkHost(params.packageRoot).workspaceExports;
	const key = `${params.packageName}\0${params.packageDir}`;
	const cached = cache.get(key);
	if (cached) return cached;
	const packageJsonPath = path.join(params.packageRoot, "packages", params.packageDir, "package.json");
	const exports = readPluginSdkPackageJson(path.dirname(packageJsonPath))?.exports;
	if (!exports || typeof exports !== "object" || Array.isArray(exports)) {
		const entries = listRootPackagedWorkspacePackageAliasEntries(params);
		cache.set(key, entries);
		return entries;
	}
	const entries = [];
	for (const [exportKey, value] of Object.entries(exports)) {
		const subpath = normalizePackageExportSubpath(exportKey);
		const importPath = resolvePackageExportImportPath(value);
		if (subpath === null || !importPath?.startsWith("./dist/") || !importPath.endsWith(".mjs")) continue;
		const distFile = importPath.slice(7);
		const srcFile = distFile.replace(/\.mjs$/u, ".ts");
		entries.push({
			packageName: params.packageName,
			packageDir: params.packageDir,
			subpath,
			srcFile,
			distFile
		});
	}
	const result = entries.length > 0 ? entries.toSorted((a, b) => a.subpath.localeCompare(b.subpath)) : listRootPackagedWorkspacePackageAliasEntries(params);
	cache.set(key, result);
	return result;
}
function isUsableDistPluginSdkArtifact(candidate) {
	const cache = getPluginCache().sdk.usableDistArtifacts;
	const cached = cache.get(candidate);
	if (cached !== void 0) return cached;
	const usable = checkDistPluginSdkArtifact(candidate);
	cache.set(candidate, usable);
	return usable;
}
function checkDistPluginSdkArtifact(candidate) {
	if (!pluginCacheExistsSync(candidate)) return false;
	switch (normalizeLowercaseStringOrEmpty(path.extname(candidate))) {
		case ".js":
		case ".mjs":
		case ".cjs": break;
		default: return true;
	}
	try {
		const source = fs.readFileSync(candidate, "utf-8");
		for (const match of source.matchAll(JS_STATIC_RELATIVE_DEPENDENCY_PATTERN)) {
			const specifier = match[1];
			if (!specifier || pluginCacheExistsSync(path.resolve(path.dirname(candidate), specifier))) continue;
			return false;
		}
	} catch {
		return false;
	}
	return true;
}
function readPrivateLocalOnlyPluginSdkSubpaths(packageRoot) {
	const facts = sdkHost(packageRoot);
	if (facts.privateSubpaths) return facts.privateSubpaths;
	const parsed = readSdkJsonFile(path.join(packageRoot, "scripts", "lib", "plugin-sdk-private-local-only-subpaths.json"));
	return facts.privateSubpaths = [.../* @__PURE__ */ new Set([
		CODEX_MCP_PROJECTION_PLUGIN_SDK_SUBPATH,
		NATIVE_HOOK_RELAY_RUNTIME_PLUGIN_SDK_SUBPATH,
		CONFIGURED_LOCAL_ORIGIN_RUNTIME_PLUGIN_SDK_SUBPATH,
		...Array.isArray(parsed) ? parsed.filter((subpath) => typeof subpath === "string" && isSafePluginSdkSubpathSegment(subpath)) : []
	])];
}
function readBundledPluginPackageName(packageJsonPath) {
	const parsed = readPluginSdkPackageJson(path.dirname(packageJsonPath));
	const name = typeof parsed?.name === "string" ? parsed.name.trim() : "";
	return name.startsWith("@openclaw/") ? name : null;
}
function isBundledPluginPublicSurfaceSourceBasename(params) {
	if (params.basename === "test-api") return params.includePrivateQa;
	return BUNDLED_PLUGIN_PUBLIC_SURFACE_SOURCE_PATTERN.test(params.basename);
}
function listBundledPluginPublicSurfaceSourceBasenames(params) {
	try {
		return readPluginCacheDirectory(params.extensionSourceRoot).filter((entry) => entry.isFile()).map((entry) => entry.name).flatMap((fileName) => {
			const ext = PLUGIN_SDK_SOURCE_CANDIDATE_EXTENSIONS.find((candidateExt) => fileName.endsWith(candidateExt));
			if (!ext) return [];
			const basename = fileName.slice(0, -ext.length);
			return isBundledPluginPublicSurfaceSourceBasename({
				basename,
				includePrivateQa: params.includePrivateQa
			}) ? [basename] : [];
		}).toSorted();
	} catch {
		return [];
	}
}
function resolveBundledPluginPublicSurfaceAliasTarget(params) {
	for (const kind of params.orderedKinds) {
		if (kind === "dist") {
			const candidate = path.join(params.packageRoot, "dist", "extensions", params.dirName, `${params.basename}.js`);
			if (pluginCacheExistsSync(candidate)) return candidate;
			continue;
		}
		for (const ext of PLUGIN_SDK_SOURCE_CANDIDATE_EXTENSIONS) {
			const candidate = path.join(params.packageRoot, "extensions", params.dirName, `${params.basename}${ext}`);
			if (pluginCacheExistsSync(candidate)) return candidate;
		}
	}
	return null;
}
function resolveBundledPluginPackagePublicSurfaceAliasMap(context) {
	const { packageRoot, orderedKinds, includePrivateQa } = context;
	if (!packageRoot) return {};
	const cachedBundledPluginPublicSurfaceAliasMaps = sdkHost(packageRoot).bundledAliasesByMode;
	const cacheKey = `${packageRoot}::${orderedKinds.join(",")}::privateQa=${includePrivateQa ? "1" : "0"}`;
	const cached = cachedBundledPluginPublicSurfaceAliasMaps.get(cacheKey);
	if (cached) return cached;
	const extensionsRoot = path.join(packageRoot, "extensions");
	let extensionDirs;
	try {
		extensionDirs = readPluginCacheDirectory(extensionsRoot);
	} catch {
		cachedBundledPluginPublicSurfaceAliasMaps.set(cacheKey, {});
		return {};
	}
	const aliasMap = {};
	for (const entry of extensionDirs) {
		if (!entry.isDirectory()) continue;
		const dirName = entry.name;
		const packageName = readBundledPluginPackageName(path.join(extensionsRoot, dirName, "package.json"));
		if (!packageName) continue;
		for (const basename of listBundledPluginPublicSurfaceSourceBasenames({
			extensionSourceRoot: path.join(extensionsRoot, dirName),
			includePrivateQa
		})) {
			const target = resolveBundledPluginPublicSurfaceAliasTarget({
				packageRoot,
				dirName,
				basename,
				orderedKinds
			});
			if (!target) continue;
			aliasMap[`${packageName}/${basename}.js`] = normalizeJitiAliasTargetPath(target);
		}
	}
	cachedBundledPluginPublicSurfaceAliasMaps.set(cacheKey, aliasMap);
	return aliasMap;
}
function resolveWorkspacePackageAliasMap(context) {
	const { packageRoot, orderedKinds } = context;
	if (!packageRoot) return {};
	const cacheKey = `${packageRoot}::${orderedKinds.join(",")}`;
	const cachedWorkspacePackageAliasMaps = sdkHost(packageRoot).workspaceAliasesByMode;
	const cached = cachedWorkspacePackageAliasMaps.get(cacheKey);
	if (cached) return cached;
	const aliasMap = {};
	const workspacePackageAliasEntries = [...WORKSPACE_PACKAGE_ALIAS_ENTRIES, ...WORKSPACE_PACKAGE_EXPORT_DIRS.flatMap((packageDir) => listWorkspacePackageExportAliasEntries({
		packageRoot,
		packageName: `@openclaw/${packageDir}`,
		packageDir
	}))];
	for (const entry of workspacePackageAliasEntries) {
		const alias = entry.subpath ? `${entry.packageName}/${entry.subpath}` : entry.packageName;
		for (const kind of orderedKinds) {
			const candidate = (kind === "dist" ? [...ROOT_PACKAGED_WORKSPACE_PACKAGE_DIRS.has(entry.packageDir) ? [path.join(packageRoot, "dist", entry.packageDir, entry.distFile.replace(/\.mjs$/u, ".js"))] : [], path.join(packageRoot, "packages", entry.packageDir, "dist", entry.distFile)] : [path.join(packageRoot, "packages", entry.packageDir, "src", entry.srcFile)]).find((candidatePath) => pluginCacheExistsSync(candidatePath));
			if (candidate) {
				aliasMap[alias] = normalizeJitiAliasTargetPath(candidate);
				break;
			}
		}
	}
	cachedWorkspacePackageAliasMaps.set(cacheKey, aliasMap);
	return aliasMap;
}
function shouldIncludePrivateLocalOnlyPluginSdkSubpaths() {
	return process.env.OPENCLAW_ENABLE_PRIVATE_QA_CLI === "1";
}
function isBundledPluginModulePath(params) {
	const normalizedModulePath = path.resolve(params.modulePath);
	return [
		path.join(params.packageRoot, "extensions", params.pluginId),
		path.join(params.packageRoot, "dist", "extensions", params.pluginId),
		path.join(params.packageRoot, "dist-runtime", "extensions", params.pluginId)
	].some((root) => normalizedModulePath === root || normalizedModulePath.startsWith(`${root}${path.sep}`));
}
function isAnyBundledPluginModulePath(params) {
	const normalizedModulePath = path.resolve(params.modulePath);
	return [
		"extensions",
		path.join("dist", "extensions"),
		path.join("dist-runtime", "extensions")
	].map((segment) => path.join(params.packageRoot, segment)).some((root) => normalizedModulePath.startsWith(`${root}${path.sep}`));
}
function isOfficialInstalledPluginPackageRoot(params) {
	const [scope, name] = params.packageName.split("/");
	if (!scope || !name) return false;
	const segments = path.resolve(params.packageRoot).split(path.sep).filter(Boolean);
	const last = segments.at(-1);
	const packageScope = segments.at(-2);
	const nodeModules = segments.at(-3);
	return last === name && packageScope === scope && nodeModules === "node_modules";
}
function isOfficialInstalledPluginModulePath(params) {
	let cursor = path.dirname(path.resolve(params.modulePath));
	for (let depth = 0; depth < 12; depth += 1) {
		const packageJson = readPluginSdkPackageJson(cursor);
		if (packageJson) return packageJson.name === params.packageName && isOfficialInstalledPluginPackageRoot({
			packageRoot: cursor,
			packageName: params.packageName
		});
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	return false;
}
function isTrustedPrivatePluginSdkOwnerPath(params) {
	if (isBundledPluginModulePath({
		packageRoot: params.packageRoot,
		modulePath: params.modulePath,
		pluginId: params.owner.bundledPluginId
	})) return true;
	return params.owner.officialInstalledPackageName ? isOfficialInstalledPluginModulePath({
		modulePath: params.modulePath,
		packageName: params.owner.officialInstalledPackageName
	}) : false;
}
function findPrivatePluginSdkSubpathOwners(subpath) {
	return PRIVATE_PLUGIN_SDK_SUBPATH_OWNERS.filter((owner) => owner.subpaths.includes(subpath));
}
function listTrustedPrivatePluginSdkOwnerKeys(params) {
	return PRIVATE_PLUGIN_SDK_SUBPATH_OWNERS.filter((owner) => isTrustedPrivatePluginSdkOwnerPath({
		...params,
		owner
	})).map((owner) => owner.bundledPluginId);
}
function resolvePrivatePluginSdkOwnerPackageRoot(params) {
	return resolveLoaderPackageRoot({
		modulePath: params.modulePath,
		argv1: params.argv1,
		moduleUrl: params.moduleUrl
	}) ?? params.aliasPackageRoot;
}
function shouldIncludePrivateLocalOnlyPluginSdkSubpath(context, subpath) {
	if (PRIVATE_QA_ONLY_PLUGIN_SDK_SUBPATHS.has(subpath)) return context.includePrivateQa;
	const owners = findPrivatePluginSdkSubpathOwners(subpath);
	if (owners.length === 0) return context.bundledPlugin || context.includePrivateQa;
	return owners.some((owner) => context.trustedPrivateOwners.includes(owner.bundledPluginId) || owner.allowPrivateQaCli && context.includePrivateQa);
}
function listDistPluginSdkArtifactSubpaths(packageRoot) {
	try {
		const distPluginSdkDir = path.join(packageRoot, "dist", "plugin-sdk");
		return new Set(readPluginCacheDirectory(distPluginSdkDir).filter((entry) => entry.isFile() && entry.name.endsWith(".js")).map((entry) => entry.name.slice(0, -3)).filter((subpath) => isSafePluginSdkSubpathSegment(subpath)));
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function pluginSdkAuthorityCacheKey(context) {
	return `${context.packageRoot}::privateQa=${context.includePrivateQa ? "1" : "0"}::privateOwners=${context.trustedPrivateOwners.join(",")}::bundled=${context.bundledPlugin ? "1" : "0"}`;
}
function listPluginSdkExportedSubpaths(context) {
	const { packageRoot } = context;
	if (!packageRoot) return [];
	const cacheKey = pluginSdkAuthorityCacheKey(context);
	const cachedPluginSdkExportedSubpaths = sdkHost(packageRoot).subpathsByOwner;
	const cached = cachedPluginSdkExportedSubpaths.get(cacheKey);
	if (cached) return cached;
	const subpaths = [.../* @__PURE__ */ new Set([...readPluginSdkSubpathsFromPackageRoot(packageRoot) ?? [], ...readPrivateLocalOnlyPluginSdkSubpaths(packageRoot).filter((subpath) => shouldIncludePrivateLocalOnlyPluginSdkSubpath(context, subpath))])].toSorted();
	cachedPluginSdkExportedSubpaths.set(cacheKey, subpaths);
	return subpaths;
}
function createPluginSdkScopedAliases(context) {
	const { packageRoot, orderedKinds } = context;
	const targets = new Map(listPluginSdkExportedSubpaths(context).map((subpath) => [subpath, void 0]));
	let distArtifacts;
	let aliasMap;
	const resolveSubpath = (subpath) => {
		if (!packageRoot || !targets.has(subpath)) return;
		const cachedTarget = targets.get(subpath);
		if (cachedTarget !== void 0) return cachedTarget ?? void 0;
		for (const kind of orderedKinds) {
			if (kind === "dist") {
				distArtifacts ??= listDistPluginSdkArtifactSubpaths(packageRoot);
				const candidate = path.join(packageRoot, "dist", "plugin-sdk", `${subpath}.js`);
				if (distArtifacts.has(subpath) && isUsableDistPluginSdkArtifact(candidate)) {
					targets.set(subpath, candidate);
					return candidate;
				}
				continue;
			}
			for (const ext of PLUGIN_SDK_SOURCE_CANDIDATE_EXTENSIONS) {
				const candidate = path.join(packageRoot, "src", "plugin-sdk", `${subpath}${ext}`);
				if (pluginCacheExistsSync(candidate)) {
					targets.set(subpath, candidate);
					return candidate;
				}
			}
		}
		targets.set(subpath, null);
	};
	const buildAliasMap = () => {
		const aliases = {};
		for (const subpath of targets.keys()) {
			const target = resolveSubpath(subpath);
			if (!target) continue;
			for (const packageName of PLUGIN_SDK_PACKAGE_NAMES) aliases[`${packageName}/${subpath}`] = normalizeJitiAliasTargetPath(target);
		}
		return aliases;
	};
	return {
		resolveSubpath,
		getAliasMap: () => aliasMap ??= buildAliasMap()
	};
}
/** Captures host and private authority now; only complete artifact preparation is deferred. */
function preparePluginLoaderAliases(params) {
	const modulePath = path.resolve(params.modulePath);
	let hostModulePath = modulePath;
	if (params.moduleUrl) try {
		hostModulePath = fileURLToPath(params.moduleUrl);
	} catch {}
	const captured = {
		...params,
		modulePath,
		devSourceRoot: resolveDevSourceRootParam(params)
	};
	const packageRoot = resolveLoaderPluginSdkPackageRoot(captured);
	const ownerPackageRoot = packageRoot ? resolvePrivatePluginSdkOwnerPackageRoot({
		...captured,
		aliasPackageRoot: packageRoot
	}) : null;
	const context = {
		packageRoot,
		orderedKinds: resolvePluginSdkAliasCandidateOrder({
			modulePath: hostModulePath,
			isProduction: true,
			pluginSdkResolution: params.pluginSdkResolution
		}),
		includePrivateQa: shouldIncludePrivateLocalOnlyPluginSdkSubpaths(),
		trustedPrivateOwners: ownerPackageRoot ? listTrustedPrivatePluginSdkOwnerKeys({
			packageRoot: ownerPackageRoot,
			modulePath
		}) : [],
		bundledPlugin: ownerPackageRoot ? isAnyBundledPluginModulePath({
			packageRoot: ownerPackageRoot,
			modulePath
		}) : false
	};
	const cache = getPluginCache();
	const cacheKey = JSON.stringify(context);
	const cached = cache.sdk.contexts.get(cacheKey);
	if (cached) return cached;
	let sourceTransformAliasMap;
	let aliasMap;
	let sdkAliases;
	const getSdkAliases = () => sdkAliases ??= createPluginSdkScopedAliases(context);
	const getSourceTransformAliasMap = () => withPluginCache(cache, () => sourceTransformAliasMap ??= {
		...resolveBundledPluginPackagePublicSurfaceAliasMap(context),
		...resolveWorkspacePackageAliasMap(context)
	});
	const getAliasMap = () => withPluginCache(cache, () => aliasMap ??= {
		...getSourceTransformAliasMap(),
		...getSdkAliases().getAliasMap()
	});
	const prepared = {
		packageRoot,
		cacheKey,
		sdkRoots: packageRoot ? context.orderedKinds.map((kind) => {
			const root = path.join(packageRoot, kind, "plugin-sdk");
			return pluginCacheRealpathSync(root) ?? root;
		}) : [],
		getAliasMap,
		getSourceTransformAliasMap,
		resolveAlias: (specifier) => {
			if (!isPluginLoaderAliasSpecifier(specifier)) return;
			if (aliasMap) return aliasMap[specifier];
			return withPluginCache(cache, () => {
				const prefix = PLUGIN_SDK_PACKAGE_NAMES.find((name) => specifier.startsWith(`${name}/`));
				if (!prefix) return getAliasMap()[specifier];
				const target = getSdkAliases().resolveSubpath(specifier.slice(prefix.length + 1));
				return target ? normalizeJitiAliasTargetPath(target) : void 0;
			});
		}
	};
	cache.sdk.contexts.set(cacheKey, prepared);
	return prepared;
}
function isPluginLoaderAliasSpecifier(specifier) {
	const packageName = specifier.split("/", 2).join("/");
	const basename = specifier.slice(packageName.length + 1);
	return isPluginSdkAliasSpecifier(specifier) || WORKSPACE_PACKAGE_ALIAS_NAMES.has(packageName) || packageName.startsWith("@openclaw/") && !basename.includes("/") && basename.endsWith(".js") && BUNDLED_PLUGIN_PUBLIC_SURFACE_SOURCE_PATTERN.test(basename.slice(0, -3));
}
function isPluginSdkAliasSpecifier(specifier) {
	return PLUGIN_SDK_PACKAGE_NAMES.some((prefix) => specifier.startsWith(`${prefix}/`));
}
function buildPluginLoaderAliasMap(modulePath, argv1 = STARTUP_ARGV1, moduleUrl, pluginSdkResolution = "auto", devSourceRoot) {
	return preparePluginLoaderAliases({
		modulePath,
		argv1,
		moduleUrl,
		pluginSdkResolution,
		devSourceRoot
	}).getAliasMap();
}
function resolvePluginRuntimeModulePathWithDiagnostics(params = {}) {
	const cache = getPluginCache().sdk.runtimeModules;
	const key = JSON.stringify([
		params.modulePath,
		params.argv1 ?? process.argv[1],
		params.cwd,
		params.moduleUrl,
		resolveDevSourceRootParam(params),
		params.pluginSdkResolution,
		process.cwd(),
		"production"
	]);
	const cached = cache.get(key);
	if (cached) return cached;
	const result = resolvePluginRuntimeModuleCandidates(params);
	cache.set(key, result);
	return result;
}
function resolvePluginRuntimeModuleCandidates(params) {
	let modulePath;
	let packageRoot = null;
	const candidates = [];
	try {
		modulePath = resolveLoaderModulePath(params);
		const orderedKinds = resolvePluginSdkAliasCandidateOrder({
			modulePath,
			isProduction: true,
			pluginSdkResolution: params.pluginSdkResolution
		});
		packageRoot = resolveDevSourceRootParam(params) ?? resolveLoaderPackageRoot({
			...params,
			modulePath
		});
		if (packageRoot) appendPluginRuntimeModuleCandidates(candidates, packageRoot, orderedKinds);
		else {
			const argv1 = params.argv1 ?? process.argv[1];
			candidates.push(...listAncestorPluginRuntimeModuleCandidates({
				starts: listArgvRuntimeFallbackStartDirs(argv1),
				orderedKinds
			}));
			appendSiblingPluginRuntimeModuleCandidates(candidates, path.join(path.dirname(modulePath), "runtime"), orderedKinds);
		}
		const dedupedCandidates = dedupeResolvedPaths(candidates);
		for (const candidate of dedupedCandidates) if (pluginCacheExistsSync(candidate)) return {
			modulePath,
			packageRoot,
			candidates: dedupedCandidates,
			resolvedPath: candidate
		};
	} catch (error) {
		return {
			modulePath,
			packageRoot,
			candidates: dedupeResolvedPaths(candidates),
			resolvedPath: null,
			error: formatErrorMessage(error)
		};
	}
	return {
		modulePath,
		packageRoot,
		candidates: dedupeResolvedPaths(candidates),
		resolvedPath: null
	};
}
function buildPluginLoaderJitiOptions(aliasMap, params = {}) {
	const hasAliases = Object.keys(aliasMap).length > 0;
	const jitiAliasMap = hasAliases ? normalizePluginLoaderAliasMapForJiti(aliasMap) : aliasMap;
	return {
		interopDefault: true,
		fsCache: resolvePluginLoaderJitiFsCacheOption(params),
		tryNative: true,
		nativeModules: resolvePluginLoaderJitiNativeModules(),
		extensions: [
			...PLUGIN_SOURCE_MODULE_EXTENSIONS,
			".js",
			".mjs",
			".cjs",
			".json"
		],
		...hasAliases ? { alias: jitiAliasMap } : {}
	};
}
function createPluginLoaderModuleCacheKey(params) {
	const facts = getPluginSdkAliasFacts(getPluginCache().sdk, params.aliasMap);
	const aliasMapKey = facts.moduleKey ??= createJitiAliasContentCacheKey(params.aliasMap);
	return `${params.tryNative ? "native" : "transform"}\0${aliasMapKey}`;
}
//#endregion
export { listWorkspacePackageExportAliasEntries as a, resolvePluginRuntimeModulePathWithDiagnostics as c, isPluginSdkAliasSpecifier as i, buildPluginLoaderJitiOptions as n, preparePluginLoaderAliases as o, createPluginLoaderModuleCacheKey as r, resolveLoaderPackageRoot as s, buildPluginLoaderAliasMap as t };
