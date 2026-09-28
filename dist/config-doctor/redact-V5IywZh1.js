import { c as isRecord, t as normalizeLowercaseStringOrEmpty } from "./string-coerce-Dyy0qgLy.js";
import { _ as mergeDeep, g as resolveGlobalSingleton, m as pruneMapToMaxSize, v as isPlainObject } from "./runtime-doctor-migrations-8XPPImoy.js";
import "./src-CkqqhWE1.js";
import { l as expectDefined, n as parseEnvTemplateSecretRef } from "./types.secrets-CBNculTH.js";
import "./number-coercion-fuMteyiI.js";
import "./fs-safe-defaults-2jt53BPm.js";
import { l as tryProcessCwd, o as resolveHomeRelativePath, s as resolveRequiredHomeDir } from "./utils-CROxhhxU.js";
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { canUseRootFileOpen, openRootFileSync } from "@openclaw/fs-safe/advanced";
import { isPathInside } from "@openclaw/fs-safe/path";
import os from "node:os";
import "@openclaw/fs-safe/errors";
import "node:crypto";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
import { isMainThread, threadId } from "node:worker_threads";
//#region src/infra/errno.ts
/** Type guard for NodeJS.ErrnoException (any object with a `code` property). */
function isErrno(err) {
	return Boolean(err && typeof err === "object" && "code" in err);
}
/** Checks whether an errno-shaped value has the exact code. */
function hasErrnoCode(err, code) {
	return isErrno(err) && err.code === code;
}
/** Classifies missing filesystem paths across Node and fs-safe boundaries. */
function isMissingPathError(err) {
	return hasErrnoCode(err, "ENOENT") || hasErrnoCode(err, "ENOTDIR") || hasErrnoCode(err, "not-found");
}
//#endregion
//#region packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
	return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
	return codeUnit >= 56320 && codeUnit <= 57343;
}
/** Slices a UTF-16 string without returning dangling surrogate halves at either edge. */
function sliceUtf16Safe(input, start, end) {
	const len = input.length;
	let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
	let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
	if (to <= from) return "";
	if (from > 0 && from < len) {
		if (isLowSurrogate(input.charCodeAt(from)) && isHighSurrogate(input.charCodeAt(from - 1))) from += 1;
	}
	if (to > 0 && to < len) {
		if (isHighSurrogate(input.charCodeAt(to - 1)) && isLowSurrogate(input.charCodeAt(to))) to -= 1;
	}
	return input.slice(from, to);
}
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
function truncateUtf16Safe(input, maxLen) {
	const limit = Math.max(0, Math.floor(maxLen));
	if (input.length <= limit) return input;
	return sliceUtf16Safe(input, 0, limit);
}
//#endregion
//#region src/shared/regexp.ts
/** Escape text so it can be embedded literally inside a RegExp pattern. */
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function getSealedRuntimeSecureTempRoot() {}
//#endregion
//#region src/shared/dot-path.ts
/** Appends one config path segment without confusing literal record keys with traversal. */
function appendConfigPathSegment(path, segment) {
	if (typeof segment === "number") return `${path}[${segment}]`;
	if (!/^[A-Za-z_$][A-Za-z0-9_$:-]*$/.test(segment)) return `${path}[${JSON.stringify(segment)}]`;
	return path ? `${path}.${segment}` : segment;
}
//#endregion
//#region src/config/env-substitution.ts
/**
* Environment variable substitution for config values.
*
* Supports `${VAR_NAME}` syntax in string values, substituted at config load time.
* - Only uppercase env vars are matched: `[A-Z_][A-Z0-9_]*`
* - Escape with `$${}` to output literal `${}`
* - Missing env vars throw `MissingEnvVarError` with context
*
* @example
* ```json5
* {
*   models: {
*     providers: {
*       "vercel-gateway": {
*         apiKey: "${VERCEL_GATEWAY_API_KEY}"
*       }
*     }
*   }
* }
* ```
*/
const ENV_VAR_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
/** Error thrown when a config value references a missing or empty environment variable. */
var MissingEnvVarError = class extends Error {
	constructor(varName, configPath) {
		super(`Missing env var "${varName}" referenced at config path: ${configPath}`);
		this.varName = varName;
		this.configPath = configPath;
		this.name = "MissingEnvVarError";
	}
};
function parseEnvTokenAt(value, index) {
	if (value[index] !== "$") return null;
	const next = value[index + 1];
	const afterNext = value[index + 2];
	if (next === "$" && afterNext === "{") {
		const start = index + 3;
		const end = value.indexOf("}", start);
		if (end !== -1) {
			const name = value.slice(start, end);
			if (ENV_VAR_NAME_PATTERN.test(name)) return {
				kind: "escaped",
				name,
				end
			};
		}
	}
	if (next === "{") {
		const start = index + 2;
		const end = value.indexOf("}", start);
		if (end !== -1) {
			const name = value.slice(start, end);
			if (ENV_VAR_NAME_PATTERN.test(name)) return {
				kind: "substitution",
				name,
				end
			};
		}
	}
	return null;
}
function substituteString(value, env, configPath, opts) {
	if (!value.includes("$")) return value;
	const authoredRef = parseEnvTemplateSecretRef(value);
	if (authoredRef && !containsEnvVarReference(value)) opts?.onPendingEnvSecretRef?.(authoredRef.id, configPath);
	const chunks = [];
	for (let i = 0; i < value.length; i += 1) {
		const char = value.charAt(i);
		if (char !== "$") {
			chunks.push(char);
			continue;
		}
		const token = parseEnvTokenAt(value, i);
		if (token?.kind === "escaped") {
			chunks.push(`\${${token.name}}`);
			i = token.end;
			continue;
		}
		if (token?.kind === "substitution") {
			const envValue = env[token.name];
			if (envValue === void 0 || envValue === "") {
				if (opts?.onMissing) {
					opts.onMissing({
						varName: token.name,
						configPath
					});
					if (authoredRef?.id === token.name) opts.onPendingEnvSecretRef?.(token.name, configPath);
					chunks.push(`\${${token.name}}`);
					i = token.end;
					continue;
				}
				throw new MissingEnvVarError(token.name, configPath);
			}
			if (authoredRef?.id === token.name) opts?.onResolvedEnvSecretRef?.(token.name, configPath);
			chunks.push(envValue);
			i = token.end;
			continue;
		}
		chunks.push(char);
	}
	return chunks.join("");
}
/** Detects unescaped `${VAR}` references without treating escaped `$${VAR}` as references. */
function containsEnvVarReference(value) {
	if (!value.includes("$")) return false;
	for (let i = 0; i < value.length; i += 1) {
		if (value[i] !== "$") continue;
		const token = parseEnvTokenAt(value, i);
		if (token?.kind === "escaped") {
			i = token.end;
			continue;
		}
		if (token?.kind === "substitution") return true;
	}
	return false;
}
function substituteAny(value, env, path, opts) {
	const pending = [];
	const visit = (current, currentPath) => {
		if (typeof current === "string") return substituteString(current, env, currentPath, opts);
		if (Array.isArray(current)) {
			const length = current.length;
			const result = [];
			result.length = length;
			let index = 0;
			pending.push(() => {
				while (index < length) {
					const key = index++;
					if (key in current) {
						result[key] = visit(current[key], `${currentPath}[${key}]`);
						return true;
					}
				}
				return false;
			});
			return result;
		}
		if (isPlainObject(current)) {
			const result = {};
			const entries = Object.entries(current)[Symbol.iterator]();
			pending.push(() => {
				const entry = entries.next();
				if (entry.done) return false;
				const [key, child] = entry.value;
				result[key] = visit(child, appendConfigPathSegment(currentPath, key));
				return true;
			});
			return result;
		}
		return current;
	};
	const result = visit(value, path);
	for (let next = pending.at(-1); next; next = pending.at(-1)) if (!next()) pending.pop();
	return result;
}
/**
* Resolves `${VAR_NAME}` environment variable references in config values.
*
* @param obj - The parsed config object (after JSON5 parse and $include resolution)
* @param env - Environment variables to use for substitution (defaults to process.env)
* @param opts - Options: `onMissing` callback to collect warnings instead of throwing.
* @returns The config object with env vars substituted
* @throws {MissingEnvVarError} If a referenced env var is not set or empty (unless `onMissing` is set)
*/
function resolveConfigEnvVars(obj, env = process.env, opts) {
	return substituteAny(obj, env, "", opts);
}
//#endregion
//#region src/utils/parse-json-compat.ts
/**
* JSON parser compatibility helper for persisted config, manifests, and legacy stores.
* Strict JSON stays the fast path; JSON5 is only the authored/legacy fallback.
*/
let json5Runtime;
function isJson5Parser(value) {
	return typeof value === "object" && value !== null && "parse" in value && typeof value.parse === "function";
}
function setJson5Runtime(runtime) {
	const parser = isJson5Parser(runtime) ? runtime : typeof runtime === "object" && runtime !== null && "default" in runtime ? runtime.default : void 0;
	if (!isJson5Parser(parser)) throw new Error("json5 parser unavailable");
	json5Runtime = parser;
	return parser;
}
function loadJson5Parser() {
	if (json5Runtime) return json5Runtime;
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("sealed JSON5 runtime was not registered before use");
	return setJson5Runtime(createRequire(import.meta.url)("json5"));
}
/** Parses strict JSON first, then accepts JSON5 syntax such as comments and trailing commas. */
function parseJsonWithJson5Fallback(raw, json5) {
	try {
		return JSON.parse(raw);
	} catch {
		return (json5 ?? loadJson5Parser()).parse(raw);
	}
}
//#endregion
//#region src/config/includes.ts
const INCLUDE_KEY = "$include";
const MAX_INCLUDE_FILE_BYTES = 2097152;
/** Maximum length for $include path and resolved path (CWE-22 hardening). */
const MAX_INCLUDE_PATH_LENGTH = 4096;
var ConfigIncludeError = class extends Error {
	constructor(message, includePath, cause) {
		super(message);
		this.includePath = includePath;
		this.cause = cause;
		this.name = "ConfigIncludeError";
	}
};
var CircularIncludeError = class extends ConfigIncludeError {
	constructor(chain) {
		super(`Circular include detected: ${chain.join(" -> ")}`, expectDefined(chain[chain.length - 1], "chain entry at chain.length 1"));
		this.chain = chain;
		this.name = "CircularIncludeError";
	}
};
/** Deep merge: arrays concatenate, objects merge recursively, primitives: source wins */
function deepMerge(target, source) {
	return mergeDeep(target, source, {
		arrays: "concat",
		undefinedValues: "replace"
	});
}
var IncludeProcessor = class IncludeProcessor {
	constructor(basePath, resolver, boundary, rootProjectionKeys) {
		this.basePath = basePath;
		this.resolver = resolver;
		this.boundary = boundary;
		this.rootProjectionKeys = rootProjectionKeys;
		this.visited = /* @__PURE__ */ new Set();
		this.depth = 0;
		this.visited.add(path.normalize(basePath));
	}
	get rootDir() {
		return this.boundary.configRoot.rootDir;
	}
	process(obj, logicalPath = [], hasArrayAncestor = false) {
		if (Array.isArray(obj)) return obj.map((item, index) => this.process(item, [...logicalPath, String(index)], true));
		if (!isPlainObject(obj)) return obj;
		if (!("$include" in obj)) return this.processObject(obj, logicalPath, hasArrayAncestor);
		return this.processInclude(obj, logicalPath, hasArrayAncestor);
	}
	processObject(obj, logicalPath, hasArrayAncestor) {
		const result = {};
		for (const [key, value] of Object.entries(obj)) {
			if (logicalPath.length === 0 && this.rootProjectionKeys && !this.rootProjectionKeys.has(key)) continue;
			result[key] = this.process(value, [...logicalPath, key], hasArrayAncestor);
		}
		return result;
	}
	processInclude(obj, logicalPath, hasArrayAncestor) {
		const includeValue = obj[INCLUDE_KEY];
		const otherKeys = Object.keys(obj).filter((key) => key !== "$include" && (logicalPath.length > 0 || !this.rootProjectionKeys || this.rootProjectionKeys.has(key)));
		const resolved = this.resolveInclude(includeValue, logicalPath, hasArrayAncestor);
		const included = resolved.value;
		this.resolver.onIncludeResolved?.({
			path: [...logicalPath],
			value: included,
			kind: Array.isArray(includeValue) ? "multiple" : "single",
			hasSiblingOverrides: otherKeys.length > 0,
			hasArrayAncestor,
			...resolved.targetPath ? { targetPath: resolved.targetPath } : {},
			...resolved.targetPaths ? { targetPaths: resolved.targetPaths } : {}
		});
		if (otherKeys.length === 0) return included;
		if (!isPlainObject(included)) throw new ConfigIncludeError("Sibling keys require included content to be an object", typeof includeValue === "string" ? includeValue : INCLUDE_KEY);
		const rest = {};
		for (const key of otherKeys) rest[key] = this.process(obj[key], [...logicalPath, key], hasArrayAncestor);
		return deepMerge(included, rest);
	}
	resolveInclude(value, logicalPath, hasArrayAncestor) {
		if (typeof value === "string") return this.loadFile(value, logicalPath, hasArrayAncestor);
		if (Array.isArray(value)) {
			const resolvedEntries = value.map((item) => {
				if (typeof item !== "string") throw new ConfigIncludeError(`Invalid $include array item: expected string, got ${typeof item}`, String(item));
				return this.loadFile(item, logicalPath, hasArrayAncestor);
			});
			return {
				value: resolvedEntries.reduce((current, entry) => deepMerge(current, entry.value), {}),
				targetPaths: resolvedEntries.map((entry) => entry.targetPath)
			};
		}
		throw new ConfigIncludeError(`Invalid $include value: expected string or array of strings, got ${typeof value}`, String(value));
	}
	loadFile(includePath, logicalPath, hasArrayAncestor) {
		const { resolvedPath, root } = this.resolvePath(includePath);
		this.checkCircular(resolvedPath);
		this.checkDepth(includePath);
		const raw = this.readFile(includePath, resolvedPath, root);
		const parsed = this.parseFile(includePath, resolvedPath, raw);
		return {
			value: this.processNested(resolvedPath, parsed, logicalPath, hasArrayAncestor),
			targetPath: resolvedPath
		};
	}
	resolvePath(includePath) {
		if (includePath.includes("\0")) throw new ConfigIncludeError("Include path must not contain null bytes", includePath);
		if (includePath.length >= MAX_INCLUDE_PATH_LENGTH) throw new ConfigIncludeError(`Include path exceeds maximum length (${MAX_INCLUDE_PATH_LENGTH} characters)`, includePath);
		const configDir = path.dirname(this.basePath);
		const resolved = path.isAbsolute(includePath) ? includePath : path.resolve(configDir, includePath);
		const normalized = path.normalize(resolved);
		if (normalized.length >= MAX_INCLUDE_PATH_LENGTH) throw new ConfigIncludeError(`Resolved include path exceeds maximum length (${MAX_INCLUDE_PATH_LENGTH} characters)`, includePath);
		const lexicalMatch = this.findContainingRoot(normalized, "rootDir");
		if (!lexicalMatch) throw new ConfigIncludeError(`Include path escapes config directory: ${includePath} (root: ${this.rootDir})`, includePath);
		this.resolver.onLexicalPath?.(normalized);
		try {
			const real = fs.realpathSync(normalized);
			const realMatch = this.findContainingRoot(real, "rootRealDir");
			if (!realMatch) throw new ConfigIncludeError(`Include path resolves outside config directory (symlink): ${includePath} (root: ${this.rootDir})`, includePath);
			return {
				resolvedPath: normalized,
				root: realMatch
			};
		} catch (err) {
			if (err instanceof ConfigIncludeError) throw err;
			if (isMissingPathError(err)) return {
				resolvedPath: normalized,
				root: lexicalMatch
			};
			throw new ConfigIncludeError(`Failed to resolve include file realpath: ${includePath} (resolved: ${normalized})`, includePath, err instanceof Error ? err : void 0);
		}
	}
	findContainingRoot(candidate, field) {
		if (isPathInside(this.boundary.configRoot[field], candidate)) return this.boundary.configRoot;
		for (const root of this.boundary.allowedRoots) if (isPathInside(root[field], candidate)) return root;
		return null;
	}
	checkCircular(resolvedPath) {
		if (this.visited.has(resolvedPath)) throw new CircularIncludeError([...this.visited, resolvedPath]);
	}
	checkDepth(includePath) {
		if (this.depth >= 10) throw new ConfigIncludeError(`Maximum include depth (10) exceeded at: ${includePath}`, includePath);
	}
	readFile(includePath, resolvedPath, root) {
		try {
			if (this.resolver.readFileWithGuards) return this.resolver.readFileWithGuards({
				includePath,
				resolvedPath,
				rootRealDir: root.rootRealDir
			});
			return this.resolver.readFile(resolvedPath);
		} catch (err) {
			if (err instanceof ConfigIncludeError) throw err;
			throw new ConfigIncludeError(`Failed to read include file: ${includePath} (resolved: ${resolvedPath})`, includePath, err instanceof Error ? err : void 0);
		}
	}
	parseFile(includePath, resolvedPath, raw) {
		try {
			return this.resolver.parseJson(raw);
		} catch (err) {
			throw new ConfigIncludeError(`Failed to parse include file: ${includePath} (resolved: ${resolvedPath})`, includePath, err instanceof Error ? err : void 0);
		}
	}
	processNested(resolvedPath, parsed, logicalPath, hasArrayAncestor) {
		const nested = new IncludeProcessor(resolvedPath, this.resolver, this.boundary, this.rootProjectionKeys);
		nested.visited = /* @__PURE__ */ new Set([...this.visited, resolvedPath]);
		nested.depth = this.depth + 1;
		return nested.process(parsed, logicalPath, hasArrayAncestor);
	}
};
function safeRealpath(target) {
	try {
		return fs.realpathSync(target);
	} catch {
		return target;
	}
}
/** Capture the lexical and canonical include roots once for a resolver traversal. */
function createConfigIncludeBoundary(configPath, allowedRoots = []) {
	const configRootDir = path.normalize(path.dirname(configPath));
	return {
		configRoot: {
			rootDir: configRootDir,
			rootRealDir: path.normalize(safeRealpath(configRootDir))
		},
		allowedRoots: allowedRoots.filter((entry) => typeof entry === "string" && entry.length > 0 && path.isAbsolute(entry)).map((entry) => {
			const rootDir = path.normalize(entry);
			return {
				rootDir,
				rootRealDir: path.normalize(safeRealpath(rootDir))
			};
		})
	};
}
function readConfigIncludeFileWithGuards(params) {
	const ioFs = params.ioFs ?? fs;
	const maxBytes = params.maxBytes ?? MAX_INCLUDE_FILE_BYTES;
	if (!canUseRootFileOpen(ioFs)) {
		const raw = ioFs.readFileSync(params.resolvedPath, "utf-8");
		try {
			params.onResolvedPath?.(path.normalize(ioFs.realpathSync(params.resolvedPath)));
		} catch {}
		return raw;
	}
	const opened = openRootFileSync({
		absolutePath: params.resolvedPath,
		rootPath: params.rootRealDir,
		rootRealPath: params.rootRealDir,
		boundaryLabel: "config directory",
		skipLexicalRootCheck: true,
		rejectSymlinks: false,
		maxBytes,
		ioFs
	});
	if (!opened.ok) {
		if (opened.reason === "validation") throw new ConfigIncludeError(`Include file failed security checks (regular file, max ${maxBytes} bytes, no hardlinks): ${params.includePath}`, params.includePath);
		throw new ConfigIncludeError(`Failed to read include file: ${params.includePath} (resolved: ${params.resolvedPath})`, params.includePath, opened.error instanceof Error ? opened.error : void 0);
	}
	try {
		const raw = ioFs.readFileSync(opened.fd, "utf-8");
		params.onResolvedPath?.(path.normalize(opened.path));
		return raw;
	} finally {
		ioFs.closeSync(opened.fd);
	}
}
const defaultResolver = {
	readFile: (p) => fs.readFileSync(p, "utf-8"),
	readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) => readConfigIncludeFileWithGuards({
		includePath,
		resolvedPath,
		rootRealDir
	}),
	parseJson: parseJsonWithJson5Fallback
};
function resolveConfigIncludesWithinBoundary(obj, configPath, resolver, boundary, rootProjectionKeys) {
	return new IncludeProcessor(configPath, resolver, boundary, rootProjectionKeys).process(obj);
}
/**
* Resolves all $include directives in a parsed config object.
*/
function resolveConfigIncludes(obj, configPath, resolver = defaultResolver, options = {}) {
	return resolveConfigIncludesWithinBoundary(obj, configPath, resolver, createConfigIncludeBoundary(configPath, options.allowedRoots ?? []));
}
/**
* Resolves one top-level config field through the canonical include graph while
* leaving unrelated top-level branches untouched. Early bootstrap readers use
* this when a malformed sibling must not hide an independently valid setting.
*/
function resolveConfigIncludesForTopLevelKey(obj, configPath, key, resolver = defaultResolver, options = {}) {
	return resolveConfigIncludesWithinBoundary(obj, configPath, resolver, createConfigIncludeBoundary(configPath, options.allowedRoots ?? []), /* @__PURE__ */ new Set([key]));
}
//#endregion
//#region src/infra/test-runtime-env.ts
/** Detects Vitest/test execution from the env shape used by local and worker processes. */
function isVitestRuntimeEnv(env = process.env) {
	const vitest = env.VITEST;
	return vitest === "true" || vitest === "1" || env.VITEST_POOL_ID !== void 0 || env.VITEST_WORKER_ID !== void 0 || env.NODE_ENV === "test";
}
/** Enables the shared fast-test shortcuts only inside a detected test runtime. */
function isFastTestRuntimeEnv(env = process.env) {
	return env.OPENCLAW_TEST_FAST === "1" && (isVitestRuntimeEnv(env) || env !== process.env && isVitestRuntimeEnv(process.env));
}
//#endregion
//#region src/config/state-dir.ts
const LEGACY_STATE_DIRNAMES = [".clawdbot"];
const NEW_STATE_DIRNAME = ".openclaw";
function resolveDefaultHomeDir() {
	return resolveRequiredHomeDir(process.env, os.homedir);
}
function resolveLegacyStateDirs(homedir = resolveDefaultHomeDir) {
	return LEGACY_STATE_DIRNAMES.map((dir) => path.join(homedir(), dir));
}
function resolveNewStateDir(homedir = resolveDefaultHomeDir) {
	return path.join(homedir(), NEW_STATE_DIRNAME);
}
/**
* State directory for mutable data (sessions, logs, caches).
* Can be overridden via OPENCLAW_STATE_DIR.
* Default: ~/.openclaw
*/
function resolveStateDir(env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) return resolveHomeRelativePath(override, {
		env,
		homedir: effectiveHomedir
	});
	return resolveStateDirFromHome(env, effectiveHomedir);
}
/** Select a default state directory from the caller's already resolved home. */
function resolveStateDirFromHome(env, effectiveHomedir) {
	const newDir = resolveNewStateDir(effectiveHomedir);
	if (isFastTestRuntimeEnv(env)) return newDir;
	if (fs.existsSync(newDir)) return newDir;
	const existingLegacy = resolveLegacyStateDirs(effectiveHomedir).find((dir) => {
		try {
			return fs.existsSync(dir);
		} catch {
			return false;
		}
	});
	if (existingLegacy) return existingLegacy;
	return newDir;
}
//#endregion
//#region src/config/paths.ts
/**
* Nix mode detection: When OPENCLAW_NIX_MODE=1, the gateway is running under Nix.
* In this mode:
* - No auto-install flows should be attempted
* - Missing dependencies should produce actionable Nix-specific error messages
* - Config is managed externally (read-only from Nix perspective)
*/
function resolveIsNixMode(env = process.env) {
	return env.OPENCLAW_NIX_MODE === "1";
}
resolveIsNixMode();
const CONFIG_FILENAME = "openclaw.json";
const LEGACY_CONFIG_FILENAMES = ["clawdbot.json"];
/** Build a homedir thunk that respects OPENCLAW_HOME for the given env. */
function envHomedir(env) {
	return () => resolveRequiredHomeDir(env, os.homedir);
}
function resolveUserPath(input, env = process.env, homedir = envHomedir(env)) {
	return resolveHomeRelativePath(input, {
		env,
		homedir
	});
}
/**
* Optional allowlist of directories that `$include` directives may resolve
* outside the config directory. Set via `OPENCLAW_INCLUDE_ROOTS` as a
* platform-delimited path list (`:` on POSIX, `;` on Windows).
*
* Each entry is tilde-expanded and resolved to an absolute path. Entries that
* cannot be resolved or that are not absolute after expansion are dropped.
*
* Returns an empty array when the var is unset or contains no usable entries,
* preserving the historical behavior where `$include` is confined to the
* directory containing `openclaw.json`.
*/
function resolveIncludeRoots(env = process.env, homedir = envHomedir(env)) {
	const raw = env.OPENCLAW_INCLUDE_ROOTS?.trim();
	if (!raw) return [];
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const seen = /* @__PURE__ */ new Set();
	const roots = [];
	for (const entry of raw.split(path.delimiter)) {
		const trimmed = entry.trim();
		if (!trimmed) continue;
		const resolved = path.resolve(resolveHomeRelativePath(trimmed, {
			env,
			homedir: effectiveHomedir
		}));
		if (!path.isAbsolute(resolved) || seen.has(resolved)) continue;
		seen.add(resolved);
		roots.push(resolved);
	}
	return roots;
}
resolveStateDir();
/**
* Config file path (JSON or JSON5).
* Can be overridden via OPENCLAW_CONFIG_PATH.
* Default: ~/.openclaw/openclaw.json (or $OPENCLAW_STATE_DIR/openclaw.json)
*/
function resolveCanonicalConfigPath(env = process.env, stateDir) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath(override, env, envHomedir(env));
	return path.join(stateDir ?? resolveStateDir(env, envHomedir(env)), CONFIG_FILENAME);
}
/**
* Resolve the active config path by preferring existing config candidates
* before falling back to the canonical path.
*/
function resolveConfigPathCandidate(env = process.env, homedir = envHomedir(env)) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath(override, env, homedir);
	if (isFastTestRuntimeEnv(env)) return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
	const existing = resolveDefaultConfigCandidates(env, homedir).find((candidate) => {
		try {
			return fs.existsSync(candidate);
		} catch {
			return false;
		}
	});
	if (existing) return existing;
	return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
}
/**
* Active config path (prefers existing config files).
*/
function resolveConfigPath(env = process.env, stateDir, homedir = envHomedir(env)) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath(override, env, homedir);
	const selectedStateDir = stateDir ?? resolveStateDir(env, envHomedir(env));
	if (isFastTestRuntimeEnv(env)) return path.join(selectedStateDir, CONFIG_FILENAME);
	const stateOverride = env.OPENCLAW_STATE_DIR?.trim();
	const existing = [path.join(selectedStateDir, CONFIG_FILENAME), ...LEGACY_CONFIG_FILENAMES.map((name) => path.join(selectedStateDir, name))].find((candidate) => {
		try {
			return fs.existsSync(candidate);
		} catch {
			return false;
		}
	});
	if (existing) return existing;
	if (stateOverride) return path.join(selectedStateDir, CONFIG_FILENAME);
	const defaultStateDir = resolveStateDir(env, homedir);
	if (path.resolve(selectedStateDir) === path.resolve(defaultStateDir)) return resolveConfigPathCandidate(env, homedir);
	return path.join(selectedStateDir, CONFIG_FILENAME);
}
resolveConfigPathCandidate();
/**
* Resolve default config path candidates across default locations.
* Order: explicit config path → state-dir-derived paths → new default.
*/
function resolveDefaultConfigCandidates(env = process.env, homedir = envHomedir(env)) {
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const explicit = env.OPENCLAW_CONFIG_PATH?.trim();
	if (explicit) return [resolveUserPath(explicit, env, effectiveHomedir)];
	const candidates = [];
	const openclawStateDir = env.OPENCLAW_STATE_DIR?.trim();
	if (openclawStateDir) {
		const resolved = resolveUserPath(openclawStateDir, env, effectiveHomedir);
		candidates.push(path.join(resolved, CONFIG_FILENAME));
		candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path.join(resolved, name)));
	}
	const defaultDirs = [resolveNewStateDir(effectiveHomedir), ...resolveLegacyStateDirs(effectiveHomedir)];
	for (const dir of defaultDirs) {
		candidates.push(path.join(dir, CONFIG_FILENAME));
		candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path.join(dir, name)));
	}
	return candidates;
}
//#endregion
//#region src/logging/state.ts
const LOGGING_STATE_KEY = Symbol.for("openclaw.loggingState");
const APPLIED_LOGGING_CONFIG_UNOWNED = "unowned";
function createUnownedAppliedLoggingConfig() {
	return APPLIED_LOGGING_CONFIG_UNOWNED;
}
function createLoggingState() {
	return {
		appliedConfig: createUnownedAppliedLoggingConfig(),
		cachedLogger: null,
		cachedSettings: null,
		cachedConsoleSettings: null,
		overrideSettings: null,
		invalidEnvLogLevelValue: null,
		consolePatched: false,
		forceConsoleToStderr: false,
		earlyConsoleRoutingRestore: null,
		consoleTimestampPrefix: false,
		consoleSubsystemFilter: null,
		streamErrorHandlersInstalled: false,
		rawConsole: null
	};
}
const globalStore = globalThis;
const loggingState = globalStore[LOGGING_STATE_KEY] ?? createLoggingState();
if (!Object.hasOwn(loggingState, "appliedConfig")) loggingState.appliedConfig = APPLIED_LOGGING_CONFIG_UNOWNED;
globalStore[LOGGING_STATE_KEY] = loggingState;
//#endregion
//#region src/logging/config.ts
let cachedLoggingConfig;
function resolveLoggingConfigSelector() {
	const env = process.env;
	return [
		env.OPENCLAW_CONFIG_PATH,
		env.OPENCLAW_STATE_DIR,
		env.OPENCLAW_HOME,
		env.OPENCLAW_PROFILE,
		env.HOME,
		env.USERPROFILE,
		env.HOMEDRIVE,
		env.HOMEPATH,
		env.PREFIX,
		env.ANDROID_DATA,
		env.OPENCLAW_TEST_FAST,
		tryProcessCwd() ?? ""
	].map((value) => value ?? "").join("\0");
}
function resolvePartialDiagnosticLoggingConfig(logging) {
	if (!isRecord(logging)) return;
	const partial = {};
	if (typeof logging.consoleStyle === "string") try {
		const resolved = resolveConfigEnvVars({ consoleStyle: logging.consoleStyle });
		if (isRecord(resolved) && (resolved.consoleStyle === "pretty" || resolved.consoleStyle === "compact" || resolved.consoleStyle === "json")) partial.consoleStyle = resolved.consoleStyle;
	} catch {}
	if (Array.isArray(logging.redactPatterns)) try {
		const resolved = resolveConfigEnvVars({ redactPatterns: logging.redactPatterns });
		if (isRecord(resolved) && Array.isArray(resolved.redactPatterns) && resolved.redactPatterns.every((entry) => typeof entry === "string")) partial.redactPatterns = resolved.redactPatterns;
	} catch {}
	return Object.keys(partial).length > 0 ? partial : void 0;
}
/** Reads the logging block from config, caching by resolved config path. */
function readLoggingConfig() {
	try {
		if (loggingState.appliedConfig !== "unowned") return loggingState.appliedConfig;
		const selector = resolveLoggingConfigSelector();
		if (cachedLoggingConfig?.selector === selector) return cachedLoggingConfig.logging;
		const configPath = resolveConfigPath();
		if (!fs.existsSync(configPath)) {
			cachedLoggingConfig = {
				selector,
				logging: void 0
			};
			return;
		}
		const parsed = parseJsonWithJson5Fallback(fs.readFileSync(configPath, "utf8"));
		const allowedRoots = resolveIncludeRoots();
		let includedConfig;
		try {
			includedConfig = resolveConfigIncludesForTopLevelKey(parsed, configPath, "logging", void 0, { allowedRoots });
		} catch {
			const directLogging = isRecord(parsed) ? parsed.logging : void 0;
			if (directLogging === void 0) return;
			try {
				includedConfig = resolveConfigIncludes({ logging: directLogging }, configPath, void 0, { allowedRoots });
			} catch {
				return resolvePartialDiagnosticLoggingConfig(directLogging);
			}
		}
		let resolvedConfig;
		try {
			resolvedConfig = resolveConfigEnvVars(includedConfig);
		} catch {
			return resolvePartialDiagnosticLoggingConfig(isRecord(includedConfig) ? includedConfig.logging : void 0);
		}
		const logging = isRecord(resolvedConfig) ? resolvedConfig.logging : void 0;
		const resolvedLogging = isRecord(logging) ? logging : void 0;
		cachedLoggingConfig = {
			selector,
			logging: resolvedLogging
		};
		return resolvedLogging;
	} catch {
		return;
	}
}
//#endregion
//#region packages/net-policy/src/redact-sensitive-url.ts
const SENSITIVE_URL_QUERY_PARAM_NAMES = /* @__PURE__ */ new Set([
	"token",
	"key",
	"api_key",
	"apikey",
	"secret",
	"access_token",
	"auth_token",
	"password",
	"pass",
	"passwd",
	"auth",
	"jwt",
	"session",
	"id_token",
	"code",
	"client_secret",
	"app_secret",
	"hook_token",
	"refresh_token",
	"signature",
	"x_amz_signature",
	"x_amz_security_token",
	"private_key",
	"credential",
	"authorization",
	"sig",
	"x_api_key",
	"x_access_token",
	"x_auth_token"
]);
const URL_QUERY_NAME_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
const SUFFIXED_OR_SCOPED_TOKEN_QUERY_PARAM_RE = /(?:^|_)token(?:_[a-f0-9]{16,})?$/u;
const TELEGRAM_BOT_TOKEN_PATH_RE = /\/bot\d{6,}(?::|%3[aA])[A-Za-z0-9_-]{20,}(?=\/|$)/giu;
const MAX_NESTED_URL_REDACTION_DEPTH = 8;
const URL_SCHEME_RE = /(?:^|[^a-z\d+.-])[a-z][a-z\d+.-]{0,31}:/iu;
const SPECIAL_SCHEME_AUTHORITY_RE = /\b(?:https?|wss?|ftp):[\\/]{0,2}[^\\/?#\s]*/giu;
const SPECIAL_SCHEME_SPILLED_USERINFO_RE = /\b(?:https?|wss?|ftp):[\\/]{0,2}[^\s]*@[^\\/?#\s]*/giu;
const PROTOCOL_RELATIVE_AUTHORITY_RE = /[\\/]{2,}[^\\/?#\s]*/gu;
function redactSensitiveUrlPath(value) {
	return value.replace(TELEGRAM_BOT_TOKEN_PATH_RE, "/bot***");
}
function normalizeUrlQueryParamName(name) {
	let current = name.replace(URL_QUERY_NAME_SEPARATOR_RE, "");
	for (let depth = 0; depth <= MAX_NESTED_URL_REDACTION_DEPTH; depth += 1) {
		let decoded;
		try {
			decoded = decodeURIComponent(current).replace(URL_QUERY_NAME_SEPARATOR_RE, "");
		} catch {
			return {
				value: normalizeLowercaseStringOrEmpty(current).replaceAll("-", "_"),
				unresolvedEncoding: current.includes("%")
			};
		}
		if (decoded === current) return {
			value: normalizeLowercaseStringOrEmpty(current).replaceAll("-", "_"),
			unresolvedEncoding: false
		};
		current = decoded;
	}
	return {
		value: normalizeLowercaseStringOrEmpty(current).replaceAll("-", "_"),
		unresolvedEncoding: current.includes("%")
	};
}
function looksLikeNestedUrlValue(value) {
	if (URL_SCHEME_RE.test(value)) return true;
	const forwardAuthorityIndex = value.indexOf("//");
	const backwardAuthorityIndex = value.indexOf("\\\\");
	const authorityIndex = forwardAuthorityIndex < 0 ? backwardAuthorityIndex : backwardAuthorityIndex < 0 ? forwardAuthorityIndex : Math.min(forwardAuthorityIndex, backwardAuthorityIndex);
	if (authorityIndex >= 0 && value.includes("@", authorityIndex + 2)) return true;
	const queryIndex = value.search(/[?&]/u);
	if (queryIndex >= 0 && value.includes("=", queryIndex + 1)) return true;
	const fragmentIndex = value.indexOf("#");
	if (fragmentIndex >= 0 && value.includes("=", fragmentIndex + 1)) return true;
	return /%[\da-f]{2}/iu.test(value);
}
/** True for auth-like URL query parameter names that should be redacted. */
function isSensitiveUrlQueryParamName(name) {
	const normalized = normalizeUrlQueryParamName(name);
	return normalized.unresolvedEncoding || SENSITIVE_URL_QUERY_PARAM_NAMES.has(normalized.value) || SUFFIXED_OR_SCOPED_TOKEN_QUERY_PARAM_RE.test(normalized.value);
}
function redactDirectSensitiveUrl(value) {
	try {
		const parsed = new URL(value);
		let mutated = false;
		const redactedPath = redactSensitiveUrlPath(parsed.pathname);
		if (redactedPath !== parsed.pathname) {
			parsed.pathname = redactedPath;
			mutated = true;
		}
		if (parsed.username || parsed.password) {
			parsed.username = parsed.username ? "***" : "";
			parsed.password = parsed.password ? "***" : "";
			mutated = true;
		}
		for (const key of Array.from(parsed.searchParams.keys())) if (isSensitiveUrlQueryParamName(key)) {
			parsed.searchParams.set(key, "***");
			mutated = true;
		}
		return mutated ? parsed.toString() : value;
	} catch {
		return value;
	}
}
function redactQueryString(value, depth) {
	const params = new URLSearchParams(value);
	const entries = Array.from(params.entries());
	const redactedEntries = [];
	const seenSensitiveKeys = /* @__PURE__ */ new Set();
	let mutated = false;
	for (const [key, entryValue] of entries) {
		if (isSensitiveUrlQueryParamName(key)) {
			mutated = true;
			if (!seenSensitiveKeys.has(key)) {
				seenSensitiveKeys.add(key);
				redactedEntries.push([key, "***"]);
			}
			continue;
		}
		const redactedKey = redactNestedUrlValue(key, depth + 1);
		const redactedValue = redactNestedUrlValue(entryValue, depth + 1);
		if (redactedKey !== key || redactedValue !== entryValue) mutated = true;
		redactedEntries.push([redactedKey, redactedValue]);
	}
	if (!mutated) return value;
	const redactedParams = new URLSearchParams();
	for (const [key, entryValue] of redactedEntries) redactedParams.append(key, entryValue);
	return redactedParams.toString();
}
function redactUrlLikeFallback(value) {
	return redactSensitiveUrlPath(redactEmbeddedUrlUserInfo(value).replace(/([?&])([^=&]+)=([^&]*)/g, (match, prefix, key) => isSensitiveUrlQueryParamName(key) ? `${prefix}${key}=***` : match));
}
function redactAuthorityUserInfo(candidate, authorityStart) {
	const authority = candidate.slice(authorityStart);
	const userInfoEnd = authority.lastIndexOf("@");
	if (userInfoEnd < 0) return candidate;
	return `${candidate.slice(0, authorityStart)}***:***@${authority.slice(userInfoEnd + 1)}`;
}
function redactEmbeddedUrlUserInfo(value) {
	return value.replace(SPECIAL_SCHEME_AUTHORITY_RE, (candidate) => {
		let authorityStart = candidate.indexOf(":") + 1;
		while (authorityStart < candidate.length && (candidate[authorityStart] === "/" || candidate[authorityStart] === "\\")) authorityStart += 1;
		return redactAuthorityUserInfo(candidate, authorityStart);
	}).replace(SPECIAL_SCHEME_SPILLED_USERINFO_RE, (candidate) => {
		let authorityStart = candidate.indexOf(":") + 1;
		while (authorityStart < candidate.length && (candidate[authorityStart] === "/" || candidate[authorityStart] === "\\")) authorityStart += 1;
		const userInfoEnd = candidate.lastIndexOf("@");
		const firstReservedDelimiter = candidate.slice(authorityStart).search(/[\\/?#]/u);
		if (userInfoEnd < 0 || firstReservedDelimiter < 0) return candidate;
		const absoluteReservedDelimiter = authorityStart + firstReservedDelimiter;
		if (absoluteReservedDelimiter >= userInfoEnd) return candidate;
		const credentialSeparator = candidate.indexOf(":", authorityStart);
		if (credentialSeparator < 0 || credentialSeparator > absoluteReservedDelimiter) return candidate;
		const authorityPrefix = candidate.slice(authorityStart, absoluteReservedDelimiter);
		const possiblePort = candidate.slice(credentialSeparator + 1, absoluteReservedDelimiter);
		if (/^\d+$/u.test(possiblePort) || /^\[[^\]]+\](?::\d+)?$/u.test(authorityPrefix)) return candidate;
		return `${candidate.slice(0, authorityStart)}***:***@${candidate.slice(userInfoEnd + 1)}`;
	}).replace(PROTOCOL_RELATIVE_AUTHORITY_RE, (candidate) => {
		let authorityStart = 0;
		while (authorityStart < candidate.length && (candidate[authorityStart] === "/" || candidate[authorityStart] === "\\")) authorityStart += 1;
		return redactAuthorityUserInfo(candidate, authorityStart);
	});
}
function hasUnresolvedEmbeddedUrlUserInfo(value) {
	for (const match of value.matchAll(/(?:\b(?:https?|wss?|ftp):[\\/]{0,2}|[\\/]{2,})/giu)) {
		const remainder = value.slice((match.index ?? 0) + match[0].length);
		const userInfoEnd = remainder.search(/(?<!\*\*\*:\*\*\*)@/u);
		const authorityEnd = remainder.search(/[\\/?#]/u);
		const pathBeforeAt = remainder.slice(authorityEnd + 1, userInfoEnd);
		if (userInfoEnd >= 0 && (authorityEnd < 0 || userInfoEnd <= authorityEnd || remainder[authorityEnd] === "/" && (pathBeforeAt.includes(":") || /^[^/?#\s]+\.[^/?#\s]+(?:[/?#]|$)/u.test(remainder.slice(userInfoEnd + 1))))) return true;
	}
	return false;
}
function redactRelativeUrlFragment(value, depth) {
	const fragmentIndex = value.indexOf("#");
	if (fragmentIndex < 0) return value;
	const fragment = value.slice(fragmentIndex + 1);
	const redactedFragment = redactFragment(fragment, depth + 1);
	return redactedFragment === fragment ? value : `${value.slice(0, fragmentIndex + 1)}${redactedFragment}`;
}
function redactFragment(value, depth) {
	if (!value) return value;
	if (depth > MAX_NESTED_URL_REDACTION_DEPTH && looksLikeNestedUrlValue(value)) return "***";
	const wholeUrl = redactSensitiveUrlAtDepth(value, depth);
	if (wholeUrl.parsedWholeUrl) return redactUrlLikeFallback(wholeUrl.value);
	const candidate = value;
	const firstQueryDelimiter = candidate.search(/[?&]/u);
	const firstEquals = candidate.indexOf("=");
	if (firstEquals >= 0 && (firstQueryDelimiter < 0 || firstEquals < firstQueryDelimiter)) return redactQueryString(candidate, depth);
	const hashRouterQueryIndex = candidate.indexOf("?");
	if (hashRouterQueryIndex >= 0) {
		const redactedQuery = redactQueryString(candidate.slice(hashRouterQueryIndex + 1), depth);
		return `${redactEncodedUrlLikeString(redactUrlLikeFallback(candidate.slice(0, hashRouterQueryIndex + 1)), depth + 1)}${redactedQuery}`;
	}
	const fallback = redactUrlLikeFallback(candidate);
	if (!looksLikeNestedUrlValue(fallback)) return fallback;
	let decoded;
	try {
		decoded = decodeURIComponent(fallback);
	} catch {
		return "***";
	}
	if (decoded === fallback) return fallback;
	const redactedDecoded = redactFragment(decoded, depth + 1);
	return redactedDecoded === decoded ? fallback : encodeURIComponent(redactedDecoded);
}
function redactEncodedNestedUrlPath(value, depth) {
	if (!looksLikeNestedUrlValue(value)) return value;
	if (depth > MAX_NESTED_URL_REDACTION_DEPTH) return "***";
	let decoded;
	try {
		decoded = decodeURIComponent(value);
	} catch {
		return "***";
	}
	if (decoded === value) return value;
	const direct = redactSensitiveUrlLikeStringAtDepth(decoded, depth);
	if (direct.value !== decoded || hasUnresolvedEmbeddedUrlUserInfo(decoded)) return direct.value !== decoded ? direct.value : "***";
	if (direct.parsedWholeUrl) return value;
	const nested = redactEncodedNestedUrlPath(decoded, depth + 1);
	return nested === decoded ? value : nested;
}
function redactSensitiveUrlAtDepth(value, depth) {
	try {
		const directRedaction = redactDirectSensitiveUrl(value);
		const parsed = new URL(directRedaction);
		if (depth > MAX_NESTED_URL_REDACTION_DEPTH) return {
			value: "***",
			parsedWholeUrl: true
		};
		let mutated = directRedaction !== value;
		const redactedNestedPath = redactEmbeddedUrlUserInfo(redactEncodedNestedUrlPath(parsed.pathname, depth + 1));
		if (redactedNestedPath !== parsed.pathname) {
			const originalPath = parsed.pathname;
			parsed.pathname = redactedNestedPath;
			if (parsed.pathname === originalPath) return {
				value: directRedaction,
				parsedWholeUrl: false
			};
			mutated = true;
		}
		const redactedQuery = redactQueryString(parsed.search.slice(1), depth);
		if (redactedQuery !== parsed.search.slice(1)) {
			parsed.search = redactedQuery;
			mutated = true;
		}
		const fragment = parsed.hash.slice(1);
		const redactedHash = redactFragment(fragment, depth + 1);
		if (redactedHash !== fragment) {
			parsed.hash = redactedHash;
			mutated = true;
		}
		return {
			value: mutated ? parsed.toString() : value,
			parsedWholeUrl: true
		};
	} catch {
		return {
			value,
			parsedWholeUrl: false
		};
	}
}
function redactSensitiveUrlLikeStringAtDepth(value, depth) {
	const redactedUrl = redactSensitiveUrlAtDepth(value, depth);
	if (redactedUrl.parsedWholeUrl) return redactedUrl;
	return {
		value: redactEncodedUrlLikeString(redactRelativeUrlFragment(redactUrlLikeFallback(redactedUrl.value), depth), depth + 1),
		parsedWholeUrl: false
	};
}
function redactEncodedUrlLikeString(value, depth) {
	if (!looksLikeNestedUrlValue(value)) return value;
	if (depth > MAX_NESTED_URL_REDACTION_DEPTH) return "***";
	let decoded;
	try {
		decoded = decodeURIComponent(value);
	} catch {
		return "***";
	}
	if (decoded === value) return value;
	const redactedDecoded = redactSensitiveUrlLikeStringAtDepth(decoded, depth + 1);
	if (redactedDecoded.value !== decoded || redactedDecoded.parsedWholeUrl) return redactedDecoded.value === decoded ? value : redactedDecoded.value;
	return hasUnresolvedEmbeddedUrlUserInfo(decoded) ? "***" : value;
}
function redactNestedUrlValue(value, depth) {
	if (!looksLikeNestedUrlValue(value)) return value;
	if (depth > MAX_NESTED_URL_REDACTION_DEPTH) return "***";
	const direct = redactSensitiveUrlLikeStringAtDepth(value, depth);
	if (direct.value !== value) return direct.value;
	if (hasUnresolvedEmbeddedUrlUserInfo(value)) return "***";
	if (direct.parsedWholeUrl) return value;
	let decoded;
	try {
		decoded = decodeURIComponent(value);
	} catch {
		return "***";
	}
	if (decoded === value || !looksLikeNestedUrlValue(decoded)) return value;
	const redactedDecoded = redactNestedUrlValue(decoded, depth + 1);
	return redactedDecoded === decoded ? value : encodeURIComponent(redactedDecoded);
}
/** Redacts sensitive URL-looking substrings even when the full value is not a valid URL. */
function redactSensitiveUrlLikeString(value) {
	return redactSensitiveUrlLikeStringAtDepth(value, 0).value;
}
//#endregion
//#region packages/acp-core/src/structured-auth-redaction.ts
const HTTP_AUTH_SCHEME_PATTERN = "[A-Za-z0-9!#$%&'*+.^_`|~-]+";
const HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN = String.raw`(?:\[REDACTED\]|[^\s\\"',;&#?<>)}\]]+)`;
const HTTP_AUTH_SERIALIZED_TAB_PATTERN = String.raw`\\{1,64}t`;
const HTTP_AUTH_SERIALIZED_INDENT_PATTERN = String.raw`(?:[ \t]+|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})`;
const HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]*)`;
const HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]+)`;
const HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t\r\n]*|[ \t]*\\{1,64}r\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*)`;
const HTTP_AUTH_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_-]|\\{1,64}[rn])`;
const HTTP_AUTH_SERIALIZED_QUOTE_PATTERN = String.raw`(?:\\{1,64}["']|["']|)`;
String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:x-goog-api-key|api-key|apikey|x-api-token|x-access-token)${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
const STRUCTURED_AUTH_HEADER_RE = new RegExp(String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:Proxy-)?Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_SCHEME_PATTERN})${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}`, "giu");
const AUTH_PARAM_NAME_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
const AUTH_PARAM_TOKEN_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
const AWS_SCOPE_VALUE_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~:/-]+/u;
function skipHorizontalWhitespace(value, start) {
	let cursor = start;
	while (value[cursor] === " " || value[cursor] === "	") cursor += 1;
	return cursor;
}
function readSerializedLineEnd(value, start) {
	let cursor = start;
	let slashCount = 0;
	while (slashCount < 64 && value[cursor] === "\\") {
		slashCount += 1;
		cursor += 1;
	}
	if (slashCount === 0) return null;
	if (value[cursor] === "n") return cursor + 1;
	if (value[cursor] !== "r") return null;
	cursor += 1;
	slashCount = 0;
	while (slashCount < 64 && value[cursor] === "\\") {
		slashCount += 1;
		cursor += 1;
	}
	return slashCount > 0 && value[cursor] === "n" ? cursor + 1 : null;
}
function readSerializedTabEnd(value, start) {
	let cursor = start;
	let slashCount = 0;
	while (slashCount < 64 && value[cursor] === "\\") {
		slashCount += 1;
		cursor += 1;
	}
	return slashCount > 0 && value[cursor] === "t" ? cursor + 1 : null;
}
function skipAuthWhitespace(value, start) {
	let cursor = start;
	for (;;) {
		cursor = skipHorizontalWhitespace(value, cursor);
		const tabEnd = readSerializedTabEnd(value, cursor);
		if (tabEnd !== null) {
			cursor = tabEnd;
			continue;
		}
		const lineEnd = value[cursor] === "\r" && value[cursor + 1] === "\n" ? cursor + 2 : value[cursor] === "\n" ? cursor + 1 : readSerializedLineEnd(value, cursor);
		if (lineEnd === null || value[lineEnd] !== " " && value[lineEnd] !== "	" && readSerializedTabEnd(value, lineEnd) === null) return cursor;
		cursor = lineEnd;
	}
}
function readAuthParamName(value, start) {
	const match = AUTH_PARAM_NAME_RE.exec(value.slice(start));
	return match ? {
		name: match[0].toLowerCase(),
		end: start + match[0].length
	} : null;
}
function isAuthHeaderStart(value, index) {
	const previous = value[index - 1];
	let serializedLineBoundary = false;
	if (previous === "n" || previous === "r") {
		let slashCursor = index - 2;
		let slashCount = 0;
		while (slashCount < 64 && value[slashCursor] === "\\") {
			slashCount += 1;
			slashCursor -= 1;
		}
		serializedLineBoundary = slashCount > 0;
	}
	if (!serializedLineBoundary && previous !== void 0 && /[A-Za-z0-9_-]/u.test(previous)) return false;
	const proxyName = "proxy-authorization";
	const directName = "authorization";
	const candidate = value.slice(index, index + 19).toLowerCase();
	const name = candidate === proxyName ? proxyName : candidate.startsWith(directName) ? directName : null;
	if (!name) return false;
	let cursor = index + name.length;
	let slashCount = 0;
	while (slashCount < 64 && value[cursor] === "\\") {
		slashCount += 1;
		cursor += 1;
	}
	if (value[cursor] === "\"" || value[cursor] === "'") cursor += 1;
	else if (slashCount > 0) return false;
	cursor = skipHorizontalWhitespace(value, cursor);
	return value[cursor] === ":" || value[cursor] === "=";
}
function findNextAuthParamStart(value, start) {
	let cursor = start;
	for (;;) {
		cursor = skipAuthWhitespace(value, cursor);
		if (cursor > start && isAuthHeaderStart(value, cursor)) return null;
		if (cursor >= value.length || value[cursor] === "\r" || value[cursor] === "\n" || value[cursor] === ";") return null;
		if (value[cursor] === ",") {
			cursor += 1;
			continue;
		}
		const param = readAuthParamName(value, cursor);
		if (param) {
			const equals = skipAuthWhitespace(value, param.end);
			if (value[equals] === "=" && value[equals + 1] !== "=") return cursor;
		}
		while (cursor < value.length) {
			const whitespaceEnd = skipAuthWhitespace(value, cursor);
			if (whitespaceEnd > cursor) {
				cursor = whitespaceEnd;
				continue;
			}
			if (cursor > start && isAuthHeaderStart(value, cursor)) return null;
			const char = value[cursor];
			if (char === "\r" || char === "\n" || char === ";") return null;
			cursor += 1;
			if (char === ",") break;
		}
	}
}
function usesAuthParams(scheme) {
	return scheme === "digest" || scheme === "hawk" || scheme.startsWith("aws4-");
}
function findAuthFieldEnd(value, start) {
	let cursor = start;
	while (cursor < value.length) {
		const whitespaceEnd = skipAuthWhitespace(value, cursor);
		if (whitespaceEnd > cursor) {
			cursor = whitespaceEnd;
			continue;
		}
		if (cursor > start && isAuthHeaderStart(value, cursor)) break;
		const char = value[cursor];
		if (char === "\r" || char === "\n" || char === ";" || char === "\\" || char === "\"" || char === "'" || char === "}" || char === "]") break;
		cursor += 1;
	}
	return cursor;
}
function readParamValue(value, start, options) {
	let escapedQuoteSlashCount = 0;
	while (value[start + escapedQuoteSlashCount] === "\\") escapedQuoteSlashCount += 1;
	const escapedQuotes = escapedQuoteSlashCount > 0 && value[start + escapedQuoteSlashCount] === "\"";
	const quote = value[start] === "\"" || value[start] === "'" ? value[start] : void 0;
	if (quote || escapedQuotes) {
		let cursor = start + (escapedQuotes ? escapedQuoteSlashCount + 1 : 1);
		while (cursor < value.length) {
			if (value[cursor] === "\r" || value[cursor] === "\n") {
				const whitespaceEnd = skipAuthWhitespace(value, cursor);
				if (whitespaceEnd === cursor) break;
				cursor = whitespaceEnd;
				continue;
			}
			if (escapedQuotes && value[cursor] === "\\") {
				let slashEnd = cursor + 1;
				while (value[slashEnd] === "\\") slashEnd += 1;
				if (value[slashEnd] === "\"") {
					if ((slashEnd - cursor) % (2 * (escapedQuoteSlashCount + 1)) === escapedQuoteSlashCount) return slashEnd + 1;
					cursor = slashEnd + 1;
					continue;
				}
				cursor = slashEnd;
				continue;
			}
			if (!escapedQuotes && value[cursor] === "\\" && cursor + 1 < value.length) {
				cursor += 2;
				continue;
			}
			if (!escapedQuotes && value[cursor] === quote) return cursor + 1;
			cursor += 1;
		}
		return cursor > start + 1 ? cursor : null;
	}
	if (options.signedHeaders) {
		const match = /^:?[A-Za-z0-9!#$%&'*+.^_`|~-]+(?:;:?[A-Za-z0-9!#$%&'*+.^_`|~-]+)*/u.exec(value.slice(start));
		if (!match) return null;
		const end = start + match[0].length;
		const next = value[end];
		return next === void 0 || next === "," || next === " " || next === "	" || next === "\r" || next === "\n" ? end : null;
	}
	const match = (options.awsScope ? AWS_SCOPE_VALUE_RE : AUTH_PARAM_TOKEN_RE).exec(value.slice(start));
	return match ? start + match[0].length : null;
}
function findStructuredAuthParamRanges(value) {
	const ranges = [];
	for (const header of value.matchAll(STRUCTURED_AUTH_HEADER_RE)) {
		const scheme = (header[2] ?? "").toLowerCase();
		let cursor = (header.index ?? 0) + header[0].length;
		const rangeStart = cursor;
		let rangeEnd = cursor;
		const directParam = readAuthParamName(value, cursor);
		const directEquals = directParam ? skipAuthWhitespace(value, directParam.end) : void 0;
		if (!directParam || directEquals === void 0 || value[directEquals] !== "=" || value[directEquals + 1] === "=") {
			if (value[skipAuthWhitespace(value, cursor)] !== "," && !usesAuthParams(scheme)) continue;
			const firstParamStart = findNextAuthParamStart(value, cursor);
			if (firstParamStart === null) continue;
			cursor = firstParamStart;
		}
		for (;;) {
			const param = readAuthParamName(value, cursor);
			if (!param) break;
			cursor = skipAuthWhitespace(value, param.end);
			if (value[cursor] !== "=") break;
			cursor = skipAuthWhitespace(value, cursor + 1);
			const valueEnd = readParamValue(value, cursor, {
				awsScope: scheme.startsWith("aws4-") && param.name === "credential",
				signedHeaders: param.name === "signedheaders"
			});
			if (valueEnd === null) {
				const nextParamStart = findNextAuthParamStart(value, cursor);
				if (nextParamStart !== null) {
					cursor = nextParamStart;
					continue;
				}
				rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, cursor));
				break;
			}
			rangeEnd = valueEnd;
			const separator = skipAuthWhitespace(value, valueEnd);
			if (value[separator] !== ",") {
				if (value[separator] !== void 0 && value[separator] !== "\r" && value[separator] !== "\n" && value[separator] !== ";" && value[separator] !== "\\" && value[separator] !== "\"" && value[separator] !== "'" && value[separator] !== "}" && value[separator] !== "]") {
					const nextParamStart = findNextAuthParamStart(value, separator);
					if (nextParamStart !== null) {
						cursor = nextParamStart;
						continue;
					}
					rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, separator));
				}
				break;
			}
			const nextParamStart = findNextAuthParamStart(value, separator + 1);
			if (nextParamStart === null) break;
			cursor = nextParamStart;
		}
		if (rangeEnd > rangeStart) ranges.push({
			start: rangeStart,
			end: rangeEnd
		});
	}
	return ranges;
}
function redactStructuredAuthHeaders(value, replacement) {
	const ranges = findStructuredAuthParamRanges(value);
	if (ranges.length === 0) return value;
	const merged = [];
	for (const range of ranges) {
		const previous = merged.at(-1);
		if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
		else merged.push({ ...range });
	}
	const parts = [];
	let cursor = 0;
	for (const range of merged) {
		parts.push(value.slice(cursor, range.start), replacement);
		cursor = range.end;
	}
	parts.push(value.slice(cursor));
	return parts.join("");
}
//#endregion
//#region src/security/safe-regex.ts
const SAFE_REGEX_CACHE_MAX = 256;
const safeRegexCache = /* @__PURE__ */ new Map();
function createParseFrame() {
	return {
		lastToken: null,
		containsRepetition: false,
		hasAlternation: false,
		branchMinLength: 0,
		branchMaxLength: 0,
		altMinLength: null,
		altMaxLength: null
	};
}
function addLength(left, right) {
	if (!Number.isFinite(left) || !Number.isFinite(right)) return Number.POSITIVE_INFINITY;
	return left + right;
}
function multiplyLength(length, factor) {
	if (!Number.isFinite(length)) return factor === 0 ? 0 : Number.POSITIVE_INFINITY;
	return length * factor;
}
function recordAlternative(frame) {
	if (frame.altMinLength === null || frame.altMaxLength === null) {
		frame.altMinLength = frame.branchMinLength;
		frame.altMaxLength = frame.branchMaxLength;
		return;
	}
	frame.altMinLength = Math.min(frame.altMinLength, frame.branchMinLength);
	frame.altMaxLength = Math.max(frame.altMaxLength, frame.branchMaxLength);
}
function readQuantifier(source, index) {
	const ch = source[index];
	const consumed = source[index + 1] === "?" ? 2 : 1;
	if (ch === "*") return {
		consumed,
		minRepeat: 0,
		maxRepeat: null
	};
	if (ch === "+") return {
		consumed,
		minRepeat: 1,
		maxRepeat: null
	};
	if (ch === "?") return {
		consumed,
		minRepeat: 0,
		maxRepeat: 1
	};
	if (ch !== "{") return null;
	let i = index + 1;
	while (i < source.length && /\d/.test(source.charAt(i))) i += 1;
	if (i === index + 1) return null;
	const minRepeat = Number.parseInt(source.slice(index + 1, i), 10);
	let maxRepeat = minRepeat;
	if (source[i] === ",") {
		i += 1;
		const maxStart = i;
		while (i < source.length && /\d/.test(source.charAt(i))) i += 1;
		maxRepeat = i === maxStart ? null : Number.parseInt(source.slice(maxStart, i), 10);
	}
	if (source[i] !== "}") return null;
	i += 1;
	if (source[i] === "?") i += 1;
	if (maxRepeat !== null && maxRepeat < minRepeat) return null;
	return {
		consumed: i - index,
		minRepeat,
		maxRepeat
	};
}
function tokenizePattern(source) {
	const tokens = [];
	let inCharClass = false;
	for (let i = 0; i < source.length; i += 1) {
		const ch = source[i];
		if (inCharClass) {
			if (ch === "\\") {
				i += 1;
				continue;
			}
			if (ch === "]") inCharClass = false;
			continue;
		}
		if (ch === "\\") {
			i += 1;
			tokens.push({ kind: "simple-token" });
			continue;
		}
		if (ch === "[") {
			inCharClass = true;
			tokens.push({ kind: "simple-token" });
			continue;
		}
		if (ch === "(") {
			tokens.push({ kind: "group-open" });
			continue;
		}
		if (ch === ")") {
			tokens.push({ kind: "group-close" });
			continue;
		}
		if (ch === "|") {
			tokens.push({ kind: "alternation" });
			continue;
		}
		const quantifier = readQuantifier(source, i);
		if (quantifier) {
			tokens.push({
				kind: "quantifier",
				quantifier
			});
			i += quantifier.consumed - 1;
			continue;
		}
		tokens.push({ kind: "simple-token" });
	}
	return tokens;
}
function analyzeTokensForNestedRepetition(tokens) {
	const frames = [createParseFrame()];
	const emitToken = (token) => {
		const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
		frame.lastToken = token;
		if (token.containsRepetition) frame.containsRepetition = true;
		frame.branchMinLength = addLength(frame.branchMinLength, token.minLength);
		frame.branchMaxLength = addLength(frame.branchMaxLength, token.maxLength);
	};
	const emitSimpleToken = () => {
		emitToken({
			containsRepetition: false,
			hasAmbiguousAlternation: false,
			minLength: 1,
			maxLength: 1
		});
	};
	for (const token of tokens) {
		if (token.kind === "simple-token") {
			emitSimpleToken();
			continue;
		}
		if (token.kind === "group-open") {
			frames.push(createParseFrame());
			continue;
		}
		if (token.kind === "group-close") {
			if (frames.length > 1) {
				const frame = frames.pop();
				if (frame.hasAlternation) recordAlternative(frame);
				const groupMinLength = frame.hasAlternation ? frame.altMinLength ?? 0 : frame.branchMinLength;
				const groupMaxLength = frame.hasAlternation ? frame.altMaxLength ?? 0 : frame.branchMaxLength;
				emitToken({
					containsRepetition: frame.containsRepetition,
					hasAmbiguousAlternation: frame.hasAlternation && frame.altMinLength !== null && frame.altMaxLength !== null && frame.altMinLength !== frame.altMaxLength,
					minLength: groupMinLength,
					maxLength: groupMaxLength
				});
			}
			continue;
		}
		if (token.kind === "alternation") {
			const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
			frame.hasAlternation = true;
			recordAlternative(frame);
			frame.branchMinLength = 0;
			frame.branchMaxLength = 0;
			frame.lastToken = null;
			continue;
		}
		const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
		const previousToken = frame.lastToken;
		if (!previousToken) continue;
		if (previousToken.containsRepetition) return true;
		if (previousToken.hasAmbiguousAlternation && token.quantifier.maxRepeat === null) return true;
		const previousMinLength = previousToken.minLength;
		const previousMaxLength = previousToken.maxLength;
		previousToken.minLength = multiplyLength(previousToken.minLength, token.quantifier.minRepeat);
		previousToken.maxLength = token.quantifier.maxRepeat === null ? Number.POSITIVE_INFINITY : multiplyLength(previousToken.maxLength, token.quantifier.maxRepeat);
		previousToken.containsRepetition = true;
		frame.containsRepetition = true;
		frame.branchMinLength = frame.branchMinLength - previousMinLength + previousToken.minLength;
		frame.branchMaxLength = addLength(Number.isFinite(frame.branchMaxLength) && Number.isFinite(previousMaxLength) ? frame.branchMaxLength - previousMaxLength : Number.POSITIVE_INFINITY, previousToken.maxLength);
	}
	return false;
}
function hasNestedRepetition(source) {
	return analyzeTokensForNestedRepetition(tokenizePattern(source));
}
function compileSafeRegexDetailed(source, flags = "") {
	const trimmed = source.trim();
	if (!trimmed) return {
		regex: null,
		source: trimmed,
		flags,
		reason: "empty"
	};
	const cacheKey = `${flags}::${trimmed}`;
	if (safeRegexCache.has(cacheKey)) return safeRegexCache.get(cacheKey) ?? {
		regex: null,
		source: trimmed,
		flags,
		reason: "invalid-regex"
	};
	let result;
	if (hasNestedRepetition(trimmed)) result = {
		regex: null,
		source: trimmed,
		flags,
		reason: "unsafe-nested-repetition"
	};
	else try {
		result = {
			regex: new RegExp(trimmed, flags),
			source: trimmed,
			flags,
			reason: null
		};
	} catch {
		result = {
			regex: null,
			source: trimmed,
			flags,
			reason: "invalid-regex"
		};
	}
	safeRegexCache.set(cacheKey, result);
	pruneMapToMaxSize(safeRegexCache, SAFE_REGEX_CACHE_MAX);
	return result;
}
//#endregion
//#region src/security/config-regex.ts
function normalizeRejectReason(result) {
	if (result.reason === null || result.reason === "empty") return null;
	return result.reason;
}
/**
* Compile a single user-configured regex with the shared safe-regex guardrails.
* Returns null for blank patterns so optional config entries can be skipped silently.
*/
function compileConfigRegex(pattern, flags = "") {
	const result = compileSafeRegexDetailed(pattern, flags);
	if (result.reason === "empty") return null;
	return {
		regex: result.regex,
		pattern: result.source,
		flags: result.flags,
		reason: normalizeRejectReason(result)
	};
}
//#endregion
//#region src/logging/redact-bounded.ts
const REDACT_REGEX_CHUNK_THRESHOLD = 32768;
const REDACT_REGEX_CHUNK_SIZE = 16384;
/** Applies a regex replacement in chunks once input crosses the redaction size threshold. */
function replacePatternBounded(text, pattern, replacer, options) {
	const chunkThreshold = options?.chunkThreshold ?? REDACT_REGEX_CHUNK_THRESHOLD;
	const chunkSize = options?.chunkSize ?? REDACT_REGEX_CHUNK_SIZE;
	if (chunkThreshold <= 0 || chunkSize <= 0 || text.length <= chunkThreshold) return text.replace(pattern, replacer);
	let output;
	for (let index = 0; index < text.length; index += chunkSize) {
		const chunk = text.slice(index, index + chunkSize);
		const replaced = chunk.replace(pattern, replacer);
		if (output !== void 0) output += replaced;
		else if (replaced !== chunk) output = text.slice(0, index) + replaced;
	}
	return output ?? text;
}
//#endregion
//#region src/logging/redact-edit-composition.ts
/** Compose sorted, disjoint current-value edits while retaining original source spans. */
function composeRedactionEdits(length, previous, edits) {
	if (previous.length === 0) return edits;
	const pieces = [];
	let source = 0;
	for (const edit of previous) {
		if (source < edit.start) pieces.push({
			start: source,
			end: edit.start
		});
		pieces.push(edit);
		source = edit.end;
	}
	if (source < length) pieces.push({
		start: source,
		end: length
	});
	const output = [];
	let index = 0;
	let offset = 0;
	let position = 0;
	const consume = (end, keep) => {
		if (end === position) {
			const piece = pieces[index];
			if (!piece) return {
				start: length,
				end: length
			};
			const start = piece.replacement === void 0 ? piece.start + offset : piece.start;
			return {
				start,
				end: piece.replacement !== void 0 && offset > 0 ? piece.end : start
			};
		}
		let sourceStart;
		let sourceEnd = 0;
		while (position < end) {
			const piece = expectDefined(pieces[index], "current redaction piece");
			const size = piece.replacement?.length ?? piece.end - piece.start;
			const count = Math.min(size - offset, end - position);
			const start = piece.replacement === void 0 ? piece.start + offset : piece.start;
			const finish = piece.replacement === void 0 ? start + count : piece.end;
			sourceStart ??= start;
			sourceEnd = finish;
			if (keep && count > 0) output.push({
				start,
				end: finish,
				replacement: piece.replacement?.slice(offset, offset + count)
			});
			position += count;
			offset += count;
			if (offset === size) {
				index += 1;
				offset = 0;
			}
		}
		return {
			start: sourceStart ?? sourceEnd,
			end: sourceEnd
		};
	};
	for (const edit of edits) {
		consume(edit.start, true);
		output.push({
			...consume(edit.end, false),
			replacement: edit.replacement
		});
	}
	while (index < pieces.length) {
		const piece = expectDefined(pieces[index], "remaining redaction piece");
		consume(position + (piece.replacement?.length ?? piece.end - piece.start) - offset, true);
	}
	const composed = [];
	let fragments = [];
	let pending;
	const flush = () => {
		if (pending) {
			pending.replacement = fragments.join("");
			composed.push(pending);
			pending = void 0;
			fragments = [];
		}
	};
	for (const piece of output) {
		if (piece.replacement === void 0) {
			flush();
			continue;
		}
		const sameEmptySpan = pending && pending.start === piece.start && pending.end === piece.end && piece.start === piece.end;
		if (!pending || piece.start >= pending.end && !sameEmptySpan) {
			flush();
			pending = {
				start: piece.start,
				end: piece.end,
				replacement: ""
			};
		} else pending.end = Math.max(pending.end, piece.end);
		fragments.push(piece.replacement);
	}
	flush();
	return composed;
}
/** Project source-span replacements onto a value that already contains replacements. */
function rebaseRedactionEdits(previous, edits) {
	let shift = 0;
	const spans = previous.map((edit) => {
		const start = edit.start + shift;
		shift += edit.replacement.length - (edit.end - edit.start);
		return {
			...edit,
			currentStart: start,
			currentEnd: edit.end + shift
		};
	});
	const boundary = (position, end) => {
		let low = 0;
		let high = spans.length;
		while (low < high) {
			const middle = low + high >>> 1;
			const span = expectDefined(spans[middle], "source redaction span");
			if (span.end < position || span.end === position && span.start !== span.end) low = middle + 1;
			else high = middle;
		}
		const span = spans[low];
		if (span && (position > span.start || position === span.start && span.start === span.end)) return end ? span.currentEnd : span.currentStart;
		const before = spans[low - 1];
		return position + (before ? before.currentEnd - before.end : 0);
	};
	return edits.map((edit) => ({
		start: boundary(edit.start, false),
		end: boundary(edit.end, true),
		replacement: edit.replacement
	}));
}
function mergeRedactionEdits(edits) {
	edits.sort((left, right) => left.start - right.start || left.end - right.end);
	const merged = [];
	for (const edit of edits) {
		const previous = merged.at(-1);
		if (!previous || edit.start >= previous.end) merged.push({ ...edit });
		else if (edit.start !== previous.start || edit.end !== previous.end || edit.replacement !== previous.replacement) {
			previous.end = Math.max(previous.end, edit.end);
			previous.replacement = "***";
		}
	}
	return merged;
}
function applyRedactionEdits(value, edits) {
	const parts = [];
	let cursor = 0;
	for (const edit of mergeRedactionEdits(edits)) {
		parts.push(value.slice(cursor, edit.start), edit.replacement);
		cursor = edit.end;
	}
	return parts.join("") + value.slice(cursor);
}
//#endregion
//#region src/logging/secret-redaction-registry.ts
const MIN_SECRET_VALUE_LENGTH = 6;
const state = resolveGlobalSingleton(Symbol.for("openclaw.secretRedactionRegistry"), () => ({
	registeredValues: /* @__PURE__ */ new Map(),
	registryRevision: 0,
	registeredValueRedactor: void 0
}));
function invalidateMatcher() {
	state.registryRevision += 1;
	state.registeredValueRedactor = void 0;
}
function hasRegisteredSecretValuesForRedaction() {
	return state.registeredValues.size > 0;
}
/** Replaces registered exact values while preserving the caller's mask convention. */
function redactRegisteredSecretValues(text, mask) {
	if (!text || state.registeredValues.size === 0) return text;
	state.registeredValueRedactor ??= createSecretValueRedactor([...state.registeredValues.keys()]);
	return state.registeredValueRedactor(text, mask);
}
function createSecretValueRedactor(values) {
	let compiledMatcher;
	let firstChars;
	return (text, mask) => {
		if (!text || values.length === 0) return text;
		let couldMatch = false;
		firstChars ??= new Set(values.map((value) => value.charAt(0)));
		for (const firstChar of firstChars) if (text.includes(firstChar)) {
			couldMatch = true;
			break;
		}
		if (!couldMatch) return text;
		if (!compiledMatcher) {
			const buckets = /* @__PURE__ */ new Map();
			for (const value of values.toSorted((left, right) => right.length - left.length)) {
				const prefix = value.slice(0, MIN_SECRET_VALUE_LENGTH);
				const bucket = buckets.get(prefix);
				if (bucket) bucket.push(value);
				else buckets.set(prefix, [value]);
			}
			compiledMatcher = {
				prefixes: new RegExp([...buckets.keys()].map(escapeRegExp).join("|"), "g"),
				buckets
			};
		}
		const { prefixes, buckets } = compiledMatcher;
		const matches = [];
		prefixes.lastIndex = 0;
		for (let match = prefixes.exec(text); match; match = prefixes.exec(text)) {
			const index = match.index;
			const value = buckets.get(match[0])?.find((candidate) => text.startsWith(candidate, index));
			if (value !== void 0) matches.push({
				index,
				value
			});
			prefixes.lastIndex = index + (value?.length ?? 1);
		}
		let result = "";
		let cursor = 0;
		for (const match of matches) {
			result += `${text.slice(cursor, match.index)}${mask(match.value, match.index)}`;
			cursor = match.index + match.value.length;
		}
		return result + text.slice(cursor);
	};
}
function resetSecretRedactionRegistryForTest() {
	state.registeredValues.clear();
	invalidateMatcher();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.secretRedactionRegistryTestApi")] = { resetSecretRedactionRegistryForTest };
//#endregion
//#region src/logging/redact-json-tokens.ts
const JSON_TOKEN_RE = /"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\]]/g;
function readScalarTokens(text, origins) {
	const tokens = [];
	const containers = [];
	const root = {
		key: "",
		path: [],
		origins,
		origin: origins.value,
		objectPath: true
	};
	const valueContext = (parent) => !parent ? root : parent.array ? {
		...parent.context,
		origin: parent.context.origins?.value ?? parent.context.origin,
		origins: parent.context.origins?.children.get(String(parent.nextIndex++))
	} : expectDefined(parent.field, "JSON object field context");
	for (const match of text.matchAll(JSON_TOKEN_RE)) {
		const raw = match[0];
		const parent = containers.at(-1);
		if (raw === "{" || raw === "[") {
			const context = valueContext(parent);
			const array = raw === "[";
			containers.push({
				array,
				nextIndex: 0,
				context: array ? {
					...context,
					objectPath: false
				} : context,
				start: match.index,
				tokenStart: tokens.length
			});
			continue;
		}
		if (raw === "}" || raw === "]") {
			const container = expectDefined(containers.pop(), "JSON container");
			if (container.tokenStart === tokens.length) {
				const end = match.index + 1;
				const value = text.slice(container.start, end);
				tokens.push({
					...container.context,
					isKey: false,
					string: false,
					value,
					start: container.start,
					end,
					escaped: false,
					edits: [],
					projectedEdits: [],
					currentValue: value,
					currentStart: container.start,
					currentEnd: end
				});
			}
			continue;
		}
		const start = match.index;
		const end = start + raw.length;
		const string = raw.startsWith("\"");
		const value = string ? JSON.parse(raw) : raw;
		let next = end;
		while (text[next] === " " || text[next] === "	" || text[next] === "\r" || text[next] === "\n") next += 1;
		const isKey = string && text[next] === ":";
		let context;
		if (isKey) {
			const container = expectDefined(parent, "JSON property container");
			const inherited = container.context;
			context = {
				key: "",
				path: [],
				origin: inherited.origin,
				objectPath: false,
				rootKey: inherited.rootKey,
				rootValueStart: inherited.rootValueStart
			};
			let valueStart = next + 1;
			while (text[valueStart] === " " || text[valueStart] === "	" || text[valueStart] === "\r" || text[valueStart] === "\n") valueStart += 1;
			container.field = {
				key: value,
				path: [...inherited.path, value],
				origins: inherited.origins?.children.get(value),
				origin: inherited.origins?.value ?? inherited.origin,
				objectPath: inherited.objectPath,
				rootKey: containers.length === 1 ? value : inherited.rootKey,
				rootValueStart: containers.length === 1 ? valueStart : inherited.rootValueStart
			};
		} else context = valueContext(parent);
		const origin = isKey ? {
			structured: false,
			primitiveMask: false
		} : context.origins?.value ?? context.origin;
		tokens.push({
			...context,
			origin,
			start,
			end,
			isKey,
			string,
			value,
			escaped: string && raw.includes("\\"),
			edits: [],
			projectedEdits: [],
			currentValue: value,
			currentStart: start,
			currentEnd: end
		});
	}
	return tokens;
}
function readBatchTokens(input, origins, preserveLines = false) {
	const tokens = [];
	let offset = 0;
	for (const line of input.split("\n")) {
		let json = false;
		try {
			JSON.parse(line);
			json = true;
		} catch {}
		if (json) for (const token of readScalarTokens(line, origins)) {
			token.deferEncoding = !token.string;
			token.start += offset;
			token.end += offset;
			token.currentStart += offset;
			token.currentEnd += offset;
			tokens.push(token);
		}
		else {
			const previous = tokens.at(-1);
			if (!preserveLines && previous?.raw && previous.end + 1 === offset) {
				previous.value += `\n${line}`;
				previous.currentValue = previous.value;
				previous.end = previous.currentEnd = offset + line.length;
			} else tokens.push({
				raw: true,
				origin: origins.value,
				key: "",
				path: [],
				objectPath: false,
				isKey: false,
				string: false,
				value: line,
				escaped: false,
				start: offset,
				end: offset + line.length,
				currentStart: offset,
				currentEnd: offset + line.length,
				currentValue: line,
				edits: [],
				projectedEdits: []
			});
		}
		offset += line.length + 1;
	}
	return tokens;
}
//#endregion
//#region src/logging/redact-pattern-runtime.ts
function parseRedactPatternSource(raw) {
	const literal = raw.match(/^\/(.+)\/([gimsuy]*)$/);
	if (!literal) return [raw, "gi"];
	const source = literal[1] ?? "";
	const flags = literal[2] ?? "";
	return [source, flags.includes("g") ? flags : `${flags}g`];
}
function readRedactMatch(args) {
	const inputIndex = args.length > 0 && typeof args[args.length - 1] === "object" && args[args.length - 1] !== null ? args.length - 2 : args.length - 1;
	const offsetIndex = inputIndex - 1;
	const match = typeof args[0] === "string" ? args[0] : "";
	const groups = args.slice(1, offsetIndex).map((value) => typeof value === "string" ? value : "");
	const offset = typeof args[offsetIndex] === "number" ? args[offsetIndex] : -1;
	return {
		match,
		groups,
		input: typeof args[inputIndex] === "string" ? args[inputIndex] : "",
		offset
	};
}
function getIndexedCaptureStart(pattern, input, match, matchOffset, captureIndex) {
	if (!(pattern instanceof RegExp) || matchOffset < 0 || !input) return null;
	try {
		const flags = pattern.flags.includes("d") ? pattern.flags : `${pattern.flags}d`;
		const indexedPattern = new RegExp(pattern.source, flags);
		indexedPattern.lastIndex = matchOffset;
		const indexedMatch = indexedPattern.exec(input);
		const captureIndices = indexedMatch?.indices?.[captureIndex + 1];
		if (!indexedMatch || indexedMatch.index !== matchOffset || indexedMatch[0] !== match) return null;
		if (!captureIndices) return null;
		return captureIndices[0] - matchOffset;
	} catch {
		return null;
	}
}
function hasBackreferenceToGroup(pattern, groupNumber) {
	return new RegExp(String.raw`\\${groupNumber}(?!\d)`).test(pattern.source);
}
function selectSecretCapture(match, groups) {
	const selected = {
		index: -1,
		value: match,
		captureCount: 0
	};
	for (let index = 0; index < groups.length; index++) {
		const value = groups[index];
		if (typeof value === "string" && value.length > 0) {
			selected.index = index;
			selected.value = value;
			selected.captureCount++;
		}
	}
	return selected;
}
function getSecretCaptureStart(pattern, input, match, matchOffset, selected) {
	const indexedTokenStart = getIndexedCaptureStart(pattern, input, match, matchOffset, selected.index);
	if (indexedTokenStart !== null) return indexedTokenStart;
	return pattern instanceof RegExp && selected.captureCount === 1 && selected.index >= 0 && hasBackreferenceToGroup(pattern, selected.index + 1) ? match.indexOf(selected.value) : match.lastIndexOf(selected.value);
}
const globalPatterns = /* @__PURE__ */ new WeakMap();
function* iterateRedactMatches(text, pattern) {
	if (!(pattern instanceof RegExp)) {
		yield* pattern.exec(text);
		return;
	}
	let regex = pattern;
	if (!pattern.global) {
		const cached = globalPatterns.get(pattern);
		regex = cached ?? new RegExp(pattern.source, `${pattern.flags}g`);
		if (!cached) globalPatterns.set(pattern, regex);
	}
	const unicode = regex.unicode || regex.flags.includes("v");
	let cursor = 0;
	while (cursor <= text.length) {
		const previousIndex = regex.lastIndex;
		let match;
		try {
			regex.lastIndex = cursor;
			match = regex.exec(text);
		} finally {
			regex.lastIndex = previousIndex;
		}
		if (!match) return;
		cursor = match.index + match[0].length;
		if (!match[0]) {
			const codePoint = text.codePointAt(cursor);
			cursor += unicode && codePoint !== void 0 && codePoint > 65535 ? 2 : 1;
		}
		yield {
			match: match[0],
			groups: match.slice(1).map((group) => group ?? ""),
			input: text,
			offset: match.index
		};
	}
}
function replaceRedactPattern(text, pattern, replace, replaceRegex) {
	if (pattern instanceof RegExp) return text.replace(pattern, replaceRegex ?? ((...args) => replace(readRedactMatch(args))));
	const parts = [];
	let end = 0;
	for (const match of iterateRedactMatches(text, pattern)) {
		parts.push(text.slice(end, match.offset), replace(match));
		end = match.offset + match.match.length;
	}
	return parts.length ? parts.join("") + text.slice(end) : text;
}
function redactPemBlock(block, marker) {
	const lines = block.split(/\r?\n/).filter(Boolean);
	if (lines.length < 2) return "***";
	return `${lines[0]}\n${marker}\n${lines[lines.length - 1]}`;
}
//#endregion
//#region src/logging/redact-json.ts
function getPatternRedactionEdits(value, pattern, getCapture) {
	const edits = [];
	for (const match of iterateRedactMatches(value, pattern)) {
		const capture = getCapture(match, pattern);
		const edit = capture?.redact({
			start: capture.start,
			end: capture.end,
			value: value.slice(capture.start, capture.end)
		});
		if (edit && edit.end >= edit.start) edits.push(edit);
	}
	return edits;
}
function stringBoundaries(text, token) {
	const boundaries = /* @__PURE__ */ new Map();
	let decoded = 0;
	for (let offset = token.start + 1; offset < token.end - 1; decoded += 1) {
		boundaries.set(offset, decoded);
		offset += text[offset] === "\\" ? text[offset + 1] === "u" ? 6 : 2 : 1;
	}
	boundaries.set(token.end - 1, decoded);
	return boundaries;
}
function decodedBoundary(text, token, offset) {
	if (!token.escaped) return offset - token.start - 1;
	token.boundaries ??= stringBoundaries(text, token);
	return token.boundaries.get(offset);
}
function encodedBoundary(text, token, offset) {
	if (!token.escaped) return token.start + 1 + offset;
	if (!token.encodedBoundaries) {
		token.boundaries ??= stringBoundaries(text, token);
		token.encodedBoundaries = [];
		for (const [encoded, decoded] of token.boundaries) token.encodedBoundaries[decoded] = encoded;
	}
	return expectDefined(token.encodedBoundaries[offset], "decoded JSON edit boundary");
}
function projectMessageEdits(input, tokens, message, getEdits) {
	const parts = new Map(message.parts.map((part) => [part.key, part]));
	const projected = [];
	for (const token of tokens) {
		if (!token.isKey && token.path.length === 1 && token.key === "message") continue;
		const part = token.rootKey === void 0 ? void 0 : parts.get(token.rootKey);
		if (!part) continue;
		if (!part.json && (token.isKey || (part.messageField ? token.path.length !== 2 || token.key !== "message" : token.path.length !== 1))) continue;
		const edits = getEdits(token);
		for (const edit of edits) {
			let start;
			let end;
			let replacement = edit.replacement;
			if (part.json) {
				const base = part.start - expectDefined(token.rootValueStart, "displayed JSON argument");
				if (token.string) {
					start = base + encodedBoundary(input, token, edit.start);
					end = base + encodedBoundary(input, token, edit.end);
					replacement = JSON.stringify(replacement).slice(1, -1);
				} else {
					start = base + token.start;
					end = base + token.end;
					replacement = JSON.stringify(replacement);
				}
			} else {
				start = part.start + edit.start;
				end = part.start + (part.primitiveLength ?? edit.end);
			}
			if (start < message.contentLength) projected.push({
				start,
				end: Math.min(end, message.contentLength),
				replacement,
				scalar: part.json && !token.string
			});
		}
	}
	return projected.toSorted((left, right) => left.start - right.start || left.end - right.end);
}
function firstIntersectingToken(tokens, start) {
	let low = 0;
	let high = tokens.length;
	while (low < high) {
		const middle = low + high >>> 1;
		if (expectDefined(tokens[middle], "bounded JSON token search").currentEnd <= start) low = middle + 1;
		else high = middle;
	}
	return low;
}
function updateCurrentToken(input, token) {
	if (token.raw || token.deferEncoding) {
		token.currentRaw = token.currentValue;
		return;
	}
	const parts = [];
	const encodedEdits = [];
	let cursor = token.start + (token.string ? 1 : 0);
	let encodedLength = 0;
	let decodedShift = 0;
	for (const edit of token.edits) {
		const start = token.string ? encodedBoundary(input, token, edit.start) : token.start + edit.start;
		const end = token.string ? encodedBoundary(input, token, edit.end) : token.start + edit.end;
		const replacement = JSON.stringify(edit.replacement).slice(1, -1);
		const encodedStart = encodedLength + start - cursor;
		const encodedEnd = encodedStart + replacement.length;
		encodedEdits.push({
			start: encodedStart,
			end: encodedEnd,
			decodedStart: edit.start + decodedShift,
			decodedEnd: edit.start + decodedShift + edit.replacement.length,
			sourceEnd: end,
			sourceDecodedEnd: edit.end,
			replacement
		});
		parts.push(input.slice(cursor, start), replacement);
		encodedLength = encodedEnd;
		decodedShift += edit.replacement.length - (edit.end - edit.start);
		cursor = end;
	}
	parts.push(input.slice(cursor, token.end - (token.string ? 1 : 0)));
	token.currentRaw = `"${parts.join("")}"`;
	token.encodedEdits = encodedEdits;
}
function currentDecodedBoundary(input, token, position, replacements) {
	const offset = position - token.currentStart - 1;
	const edits = token.encodedEdits;
	if (!edits) return decodedBoundary(input, token, token.start + 1 + offset);
	let low = 0;
	let high = edits.length;
	while (low < high) {
		const middle = low + high >>> 1;
		if (expectDefined(edits[middle], "current encoded edit").end < offset) low = middle + 1;
		else high = middle;
	}
	const edit = edits[low];
	if (edit && offset >= edit.start) {
		const within = offset - edit.start;
		if (!edit.replacement.includes("\\")) return edit.decodedStart + within;
		let boundaries = replacements.get(edit.replacement);
		if (!boundaries) {
			boundaries = /* @__PURE__ */ new Map();
			let decoded = 0;
			for (let encoded = 0; encoded < edit.replacement.length; decoded += 1) {
				boundaries.set(encoded, decoded);
				encoded += edit.replacement[encoded] === "\\" ? edit.replacement[encoded + 1] === "u" ? 6 : 2 : 1;
			}
			boundaries.set(edit.replacement.length, decoded);
			replacements.set(edit.replacement, boundaries);
		}
		const decoded = boundaries.get(within);
		return decoded === void 0 ? void 0 : edit.decodedStart + decoded;
	}
	const previous = edits[low - 1];
	const decoded = decodedBoundary(input, token, offset + (previous ? previous.sourceEnd - previous.end : token.start + 1));
	return decoded === void 0 ? void 0 : decoded + (previous ? previous.decodedEnd - previous.sourceDecodedEnd : 0);
}
function commitPatternEdits(token) {
	const pending = token.pending;
	token.pending = void 0;
	if (!pending) return false;
	const edits = mergeRedactionEdits(pending);
	const value = applyRedactionEdits(token.currentValue, edits);
	if (value === token.currentValue) return false;
	token.edits = composeRedactionEdits(token.value.length, token.edits, edits);
	token.currentValue = value;
	return true;
}
function changedRedactionEdits(previous, current) {
	let index = 0;
	return current.filter((edit) => {
		while (previous[index] && expectDefined(previous[index], "previous configured edit").start < edit.start) index += 1;
		const before = previous[index];
		return !before || before.start !== edit.start || before.end !== edit.end || before.replacement !== edit.replacement;
	});
}
function commitOriginalEdits(token, edits) {
	if (edits.length === 0) return false;
	const combined = mergeRedactionEdits([...token.edits, ...edits]);
	const value = applyRedactionEdits(token.value, combined);
	if (value === token.currentValue) return false;
	token.edits = combined;
	token.currentValue = value;
	return true;
}
function updateCurrentRecord(input, current, tokens, changed) {
	const parts = [];
	let cursor = 0;
	let shift = 0;
	for (const token of tokens) {
		const start = token.currentStart;
		const end = token.currentEnd;
		if (changed.has(token)) {
			updateCurrentToken(input, token);
			const raw = expectDefined(token.currentRaw, "changed JSON token");
			parts.push(current.slice(cursor, start), raw);
			cursor = end;
			token.currentStart = start + shift;
			shift += raw.length - (end - start);
		} else token.currentStart = start + shift;
		token.currentEnd = end + shift;
	}
	parts.push(current.slice(cursor));
	return parts.join("");
}
function projectedStringEnd(input, tokens, message, token, start, end) {
	const jsonParts = new Set(message.parts.filter((part) => part.json).map((part) => part.key));
	const spans = projectMessageEdits(input, tokens, message, (source) => source.string && !source.isKey && source.rootKey !== void 0 && jsonParts.has(source.rootKey) ? [{
		start: 0,
		end: source.value.length,
		replacement: ""
	}] : []).filter((span) => span.end < message.contentLength);
	const containing = rebaseRedactionEdits(token.edits, spans).filter((span) => span.start <= start && start < span.end && end <= span.end);
	return containing.length === 1 ? expectDefined(containing[0], "displayed source string").end : token.currentValue.length;
}
function redactJsonRecord(input, origins, patternPhases, getCapture, legacyFieldEdits, fieldEdits, prepEdits, skipDecodedPatterns, message, batch) {
	let tokens = batch ? [] : readScalarTokens(input, origins);
	const messageToken = message ? tokens.find((token) => !token.isKey && token.path.length === 1 && token.key === "message") : void 0;
	const replacementBoundaries = /* @__PURE__ */ new Map();
	let projectedMessageEdits = [];
	let projectedMessageValue = messageToken?.value ?? "";
	let current = input;
	const prepared = /* @__PURE__ */ new Set();
	for (const token of tokens) if (commitOriginalEdits(token, prepEdits(token))) prepared.add(token);
	if (prepared.size > 0) current = updateCurrentRecord(input, current, tokens, prepared);
	const decodedTokens = tokens.filter((token) => !token.isKey && token.string && !skipDecodedPatterns(token, token.currentValue));
	const projectMessage = () => {
		if (!messageToken || !message) return false;
		const projected = projectMessageEdits(input, tokens, message, (token) => {
			const edits = changedRedactionEdits(token.projectedEdits, token.edits);
			token.projectedEdits = token.edits;
			return edits;
		});
		if (projected.length === 0) return false;
		const sourceEdits = rebaseRedactionEdits(projectedMessageEdits, projected);
		const messageEdits = rebaseRedactionEdits(messageToken.edits, projected);
		let generatedIndex = 0;
		for (let index = 0; index < messageEdits.length; index += 1) {
			const edit = expectDefined(messageEdits[index], "projected message edit");
			const sourceEdit = expectDefined(sourceEdits[index], "projected source edit");
			const projection = expectDefined(projected[index], "source projection");
			while (messageToken.edits[generatedIndex] && expectDefined(messageToken.edits[generatedIndex], "generated message span").start < projection.start) generatedIndex += 1;
			const generated = messageToken.edits[generatedIndex];
			const scalarPromotion = projection.scalar && generated?.start === projection.start && generated.end === projection.end && edit.replacement === JSON.stringify(generated.replacement);
			const before = messageToken.currentValue.slice(edit.start, edit.end);
			if (!scalarPromotion && before !== edit.replacement && before !== projectedMessageValue.slice(sourceEdit.start, sourceEdit.end)) edit.replacement = projection.scalar ? JSON.stringify("***") : "***";
		}
		messageToken.pending = messageEdits;
		projectedMessageValue = applyRedactionEdits(projectedMessageValue, sourceEdits);
		projectedMessageEdits = composeRedactionEdits(messageToken.value.length, projectedMessageEdits, sourceEdits);
		return commitPatternEdits(messageToken);
	};
	for (const [phase, groups] of patternPhases.entries()) {
		const changed = /* @__PURE__ */ new Set();
		const pending = /* @__PURE__ */ new Set();
		const add = (token, edit) => {
			(token.pending ??= []).push(edit);
			pending.add(token);
		};
		for (const group of groups) {
			if (group.couldMatch && !group.couldMatch(current)) continue;
			for (const pattern of group.patterns) {
				if (phase === 0) for (const token of decodedTokens) for (const edit of getPatternRedactionEdits(token.currentValue, pattern, getCapture)) add(token, edit);
				else for (const match of iterateRedactMatches(current, pattern)) {
					const capture = getCapture(match, pattern);
					if (!capture || capture.end < capture.start) continue;
					if (batch && tokens.length === 0) tokens = readBatchTokens(input, origins, batch.preserveLines);
					for (let index = firstIntersectingToken(tokens, capture.start); index < tokens.length; index += 1) {
						const token = expectDefined(tokens[index], "serialized capture token");
						if (token.currentStart >= capture.end) break;
						const unquoted = token.raw || token.deferEncoding;
						const padding = unquoted ? 0 : 1;
						const captureInsideToken = capture.start >= token.currentStart + padding && capture.end <= token.currentEnd - padding;
						if (batch && token.isKey && !captureInsideToken) continue;
						const value = token.currentValue;
						if (!token.raw && !token.string && token.edits.length === 0) {
							add(token, {
								start: 0,
								end: value.length,
								replacement: "***"
							});
							continue;
						}
						let startPosition = Math.max(capture.start, token.currentStart + padding);
						let start = unquoted ? startPosition - token.currentStart : currentDecodedBoundary(input, token, startPosition, replacementBoundaries);
						let endPosition = Math.min(capture.end, token.currentEnd - padding);
						let end = unquoted ? endPosition - token.currentStart : currentDecodedBoundary(input, token, endPosition, replacementBoundaries);
						if (start === void 0 || end === void 0) {
							while (start === void 0) start = currentDecodedBoundary(input, token, --startPosition, replacementBoundaries);
							while (end === void 0) end = currentDecodedBoundary(input, token, ++endPosition, replacementBoundaries);
							const maskEnd = token === messageToken && message ? projectedStringEnd(input, tokens, message, token, start, end) : value.length;
							add(token, {
								start,
								end: maskEnd,
								replacement: "***"
							});
							continue;
						}
						if (end < start || batch && end === start) continue;
						const { start: captureStart, end: captureEnd } = capture;
						const edit = capture.redact({
							start,
							end,
							value: current.slice(Math.max(captureStart, token.currentStart + padding), Math.min(captureEnd, token.currentEnd - padding))
						});
						if (!edit) continue;
						let replacement = "***";
						if (captureInsideToken) try {
							replacement = unquoted ? edit.replacement : JSON.parse(`"${edit.replacement}"`);
						} catch {}
						add(token, {
							...edit,
							replacement
						});
					}
				}
				if (pending.size === 0) continue;
				for (const token of pending) if (!commitPatternEdits(token)) pending.delete(token);
				else if (phase === 0) changed.add(token);
				if (phase !== 0 && pending.size > 0) current = updateCurrentRecord(input, current, tokens, pending);
				pending.clear();
			}
		}
		for (const token of tokens) if (phase === 0) {
			token.pending = legacyFieldEdits(token, token.currentValue);
			if (commitPatternEdits(token)) changed.add(token);
		} else if (commitOriginalEdits(token, fieldEdits(token))) changed.add(token);
		if ((phase !== 0 || prepared.size > 0 || changed.size > 0) && projectMessage() && messageToken) changed.add(messageToken);
		if (changed.size > 0) current = updateCurrentRecord(input, current, tokens, changed);
	}
	if (messageToken && message) {
		const finished = message.finish(messageToken.currentValue);
		if (finished !== messageToken.currentValue) return applyRedactionEdits(current, [{
			start: messageToken.currentStart,
			end: messageToken.currentEnd,
			replacement: JSON.stringify(finished)
		}]);
	}
	return applyRedactionEdits(current, tokens.flatMap((token) => token.deferEncoding && token.edits.length > 0 ? [{
		start: token.currentStart,
		end: token.currentEnd,
		replacement: JSON.stringify(token.currentValue)
	}] : []));
}
//#endregion
//#region src/logging/redact-pem.ts
const PEM_REDACT_PATTERN_SOURCE = String.raw`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----`;
function createState() {
	return {
		scanner: {
			offset: 0,
			phase: "search",
			dashes: 0,
			keyword: "BEGIN ",
			keywordOffset: 0,
			start: 0,
			suffix: ""
		},
		matchEnd: 0
	};
}
function resetScanner(scanner, char) {
	scanner.phase = "search";
	scanner.dashes = char === "-" ? 1 : 0;
	scanner.suffix = "";
}
function* readDelimiters(text, scanner) {
	for (let index = 0; index < text.length; index += 1) {
		if (scanner.phase === "search" && scanner.dashes === 0) {
			const nextDash = text.indexOf("-", index);
			if (nextDash === -1) {
				scanner.offset += text.length - index;
				return;
			}
			scanner.offset += nextDash - index;
			index = nextDash;
		}
		const code = text.charCodeAt(index);
		const char = code >= 97 && code <= 122 ? String.fromCharCode(code - 32) : text.charAt(index);
		const offset = scanner.offset++;
		switch (scanner.phase) {
			case "search":
				if (char === "-") scanner.dashes = Math.min(5, scanner.dashes + 1);
				else if (scanner.dashes === 5 && (char === "B" || char === "E")) {
					scanner.phase = "keyword";
					scanner.keyword = char === "B" ? "BEGIN " : "END ";
					scanner.keywordOffset = 1;
					scanner.start = offset - 5;
				} else scanner.dashes = 0;
				break;
			case "keyword":
				if (char !== scanner.keyword.charAt(scanner.keywordOffset)) resetScanner(scanner, char);
				else if (++scanner.keywordOffset === scanner.keyword.length) {
					scanner.phase = "label";
					scanner.suffix = "";
				}
				break;
			case "label":
				if (char >= "A" && char <= "Z" || char === " ") scanner.suffix = (scanner.suffix + char).slice(-11);
				else if (char === "-" && scanner.suffix === "PRIVATE KEY") {
					scanner.phase = "close";
					scanner.dashes = 1;
				} else resetScanner(scanner, char);
				break;
			case "close": if (char !== "-") resetScanner(scanner, char);
			else if (++scanner.dashes === 5) {
				scanner.phase = "search";
				scanner.suffix = "";
				yield {
					kind: scanner.keyword === "BEGIN " ? "begin" : "end",
					start: scanner.start,
					end: offset + 1
				};
			}
		}
	}
}
function consumeDelimiter(state, delimiter) {
	if (!state.open) {
		if (delimiter.kind === "begin" && delimiter.start >= state.matchEnd) state.open = {
			start: delimiter.start,
			end: delimiter.end
		};
		return;
	}
	if (delimiter.kind !== "end" || delimiter.start <= state.open.end) return;
	const block = {
		start: state.open.start,
		end: delimiter.end,
		bodyStart: state.open.end,
		bodyEnd: delimiter.start
	};
	state.open = void 0;
	state.matchEnd = delimiter.end;
	return block;
}
function* matchPem(text, context, incomplete) {
	const state = {
		...context,
		scanner: { ...context.scanner },
		open: context.open && { ...context.open }
	};
	const origin = state.scanner.offset;
	for (const delimiter of readDelimiters(text, state.scanner)) {
		const block = consumeDelimiter(state, delimiter);
		if (!block) continue;
		const start = Math.max(0, (incomplete ? block.bodyStart : block.start) - origin);
		const end = (incomplete ? block.bodyEnd : block.end) - origin;
		if (end <= start) continue;
		yield {
			match: text.slice(start, end),
			groups: [],
			input: text,
			offset: start,
			...incomplete ? { replacement: "…redacted…" } : {}
		};
	}
	if (incomplete && state.open) {
		const start = Math.max(0, state.open.end - origin);
		if (start < text.length) yield {
			match: text.slice(start),
			groups: [],
			input: text,
			offset: start,
			replacement: "…redacted…"
		};
	}
}
const PEM_REDACT_MATCHER = {
	source: PEM_REDACT_PATTERN_SOURCE,
	exec(text) {
		return matchPem(text, createState(), false);
	},
	createContext() {
		let whenClosed = false;
		let whenOpen = true;
		return {
			prepend() {
				const closed = createState();
				const open = createState();
				open.open = {
					start: -1,
					end: -1
				};
				return {
					consume(text) {
						for (const delimiter of readDelimiters(text, closed.scanner)) {
							consumeDelimiter(closed, delimiter);
							consumeDelimiter(open, delimiter);
						}
					},
					finish() {
						const nextClosed = closed.open ? whenOpen : whenClosed;
						const nextOpen = open.open ? whenOpen : whenClosed;
						whenClosed = nextClosed;
						whenOpen = nextOpen;
						return whenClosed === whenOpen;
					}
				};
			},
			pattern: {
				source: PEM_REDACT_PATTERN_SOURCE,
				exec(text) {
					const state = createState();
					if (whenClosed) state.open = {
						start: -1,
						end: -1
					};
					return matchPem(text, state, true);
				}
			}
		};
	}
};
//#endregion
//#region src/logging/redact-patterns.ts
const PAYMENT_CREDENTIAL_ENV_KEYS = String.raw`CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN`;
const PAYMENT_CREDENTIAL_QUERY_KEYS = String.raw`card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token`;
const PAYMENT_CREDENTIAL_JSON_KEYS = String.raw`cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token`;
const AWS_SECRET_ACCESS_KEY_FIELD_KEYS = String.raw`aws[-_]?secret[-_]?access[-_]?key|awsSecretAccessKey|SecretAccessKey`;
const AUTH_QUERY_KEYS = String.raw`access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|apikey|client[-_]?secret|app[-_]?secret|private[-_]?key|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|token|key|secret|password|pass|passwd|auth|jwt|session|code|signature|x[-_]?amz[-_]?(?:signature|security[-_]?token)`;
const FORM_BODY_FIRST_PAIR_KEYS = String.raw`${AUTH_QUERY_KEYS}|app[-_]?secret|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const STANDALONE_ASSIGNMENT_SECRET_KEYS = String.raw`access_token|refresh_token|id_token|auth[-_]?token|hook[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|private[-_]?key|authorization|jwt|token|secret|password|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_ASSIGNMENT_SECRET_KEYS = String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_DIRECT_ASSIGNMENT_SECRET_KEYS = String.raw`access-token|refresh-token|id-token|auth-token|hook-token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|passphrase`;
const CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS = String.raw`password|passphrase|pass|passwd`;
const CLI_SECRET_FLAG_KEYS = String.raw`${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|api[-_]?key|hook[-_]?token|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|credential|private[-_]?key|client[-_]?secret|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const BODY_SECRET_KEYS = /* @__PURE__ */ new Set([
	"access_token",
	"auth_token",
	"awssecretaccesskey",
	"aws_secret_access_key",
	"hook_token",
	"refresh_token",
	"id_token",
	"token",
	"api_key",
	"apikey",
	"client_secret",
	"app_secret",
	"password",
	"pass",
	"passwd",
	"auth",
	"jwt",
	"session",
	"code",
	"signature",
	"x_amz_signature",
	"x_amz_security_token",
	"secret",
	"secretaccesskey",
	"credential",
	"private_key",
	"authorization",
	"key",
	"card_number",
	"card_cvc",
	"card_cvv",
	"cvc",
	"cvv",
	"security_code",
	"payment_credential",
	"shared_payment_token"
]);
const FORM_BODY_KEY_INVISIBLE_CHARS = String.raw`\p{C}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0`;
const ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g`;
const ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g`;
const STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN = String.raw`(^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60])((?:(?!\2)[^\r\n])+)\2`;
const STANDALONE_ASSIGNMENT_REDACT_PATTERN = String.raw`(^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60]?[^\s&#"'\x60<>]+)`;
const CONFIG_QUOTED_ASSIGNMENT_SECRET_KEYS = String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
const CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:(?:${CONFIG_QUOTED_ASSIGNMENT_SECRET_KEYS})(?:\s*:\s*|\s+=\s*|=\s*)|[a-z0-9][a-z0-9._-]{0,79}[-_](?:${CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*|[a-z0-9_.-]{1,80}\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*)(["'\x60])((?:(?!\2)[^\r\n])+)\2/g`;
const CONFIG_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})(?:\s*:\s*|\s+=\s*|=\s+)([^\s#"'\x60<>]+)/g`;
const CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:${CONFIG_DIRECT_ASSIGNMENT_SECRET_KEYS})=([^\s#"'\x60<>]+)/g`;
const CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])[a-z0-9][a-z0-9._-]{0,79}[-_](?:${CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*([^\s#"'\x60<>]+)/g`;
const CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])[a-z0-9_.-]{1,80}\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*([^\s#"'\x60<>]+)/g`;
const STRUCTURED_JSON_SECRET_REDACT_PATTERN = String.raw`"(?:apiKey|api_key|apiToken|api_token|bearerToken|bearer_token|token|secret|password|passwd|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token|accessToken|access_token|refreshToken|refresh_token|idToken|id_token|authToken|auth_token|clientSecret|client_secret|privateKey|private_key|secret_value|raw_secret|secret_input|key_material)"\s*:\s*"([^"]+)"`;
const STRUCTURED_JSON_PAYMENT_REDACT_PATTERN = String.raw`"(?:${PAYMENT_CREDENTIAL_JSON_KEYS})"\s*:\s*"([^"]+)"`;
const AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN = String.raw`(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|id[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret|private[-_]key|credential|authorization|secret[-_]value|raw[-_]secret|secret[-_]input|key[-_]material)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`;
const AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN = String.raw`(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`;
const BASE64_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9])(?<!;base64,[A-Za-z0-9+/=]*)`;
const IDENTIFIER_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9_])`;
function isAwsValueCharacter(char) {
	const code = char.charCodeAt(0);
	return code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || char === "/" || char === "+" || char === "=";
}
const AWS_SECRET_ACCESS_KEY_VALUE_RE = /(?=[A-Za-z0-9/+=]{0,39}[A-Z])(?=[A-Za-z0-9/+=]{0,39}[a-z])(?=[A-Za-z0-9/+=]{0,39}[0-9/+=])(?=[A-Za-z0-9/+=]{0,39}[G-Zg-z/+=])[A-Za-z0-9/+=]{40}/u;
const AWS_SECRET_ACCESS_KEY_RUN_RE = /[A-Za-z0-9/+=]{40}/u;
function couldMatchAwsSecretAccessKey(text) {
	return text.length >= 40 && AWS_SECRET_ACCESS_KEY_RUN_RE.test(text) && AWS_SECRET_ACCESS_KEY_VALUE_RE.test(text);
}
const AWS_VALUE_WHITESPACE_RE = /\s/;
const AWS_URL_SCHEME_CHARACTER_RE = /[A-Za-z0-9+.-]/;
const AWS_URL_SCHEME_START_RE = /[A-Za-z]/;
function* matchAwsSecretAccessKeys(text) {
	if (!couldMatchAwsSecretAccessKey(text)) return;
	const closingDelimiters = {
		"\"": "\"",
		"'": "'",
		"`": "`",
		"<": ">",
		"(": ")",
		"[": "]",
		"{": "}"
	};
	let runStart = -1;
	let schemeStart = -1;
	let url;
	let backslashes = 0;
	const runs = [];
	for (let index = 0; index <= text.length; index++) {
		const char = text[index] ?? "";
		const whitespace = index === text.length || AWS_VALUE_WHITESPACE_RE.test(char);
		const escapeDepth = backslashes;
		backslashes = char === "\\" ? backslashes + 1 : 0;
		if (char && isAwsValueCharacter(char)) {
			if (runStart === -1) runStart = index;
		} else if (runStart !== -1) {
			if (index - runStart === 40) runs.push({
				start: runStart,
				end: index,
				origin: runStart,
				url
			});
			else if (index - runStart > 40 && char === "@" && text[index - 41] === "/") runs.push({
				start: index - 40,
				end: index,
				origin: runStart,
				url
			});
			runStart = -1;
		}
		if (whitespace) {
			if (url) url.end = Math.min(url.end, index);
			for (const run of runs) {
				const context = run.url;
				const publicUrl = context && !context.hasAt && context.portValid && (context.portStart === -1 || (context.authorityEnd === -1 ? context.end : context.authorityEnd) > context.portStart + 1);
				const before = text[run.start - 1] ?? "";
				const after = text[run.end] ?? "";
				const slashCredential = run.start !== run.origin;
				const portCredential = context && context.portStart !== -1 && run.origin === context.portStart + 1 && context.authorityEnd > run.origin && run.end > context.authorityEnd && after === "@";
				if (!slashCredential && (before === "_" || isAwsValueCharacter(before)) || after === "_" || text.slice(run.origin - 8, run.origin) === ";base64," || publicUrl && !portCredential && run.start >= context.start && run.end <= context.end) continue;
				const match = text.slice(run.start, run.end);
				if (AWS_SECRET_ACCESS_KEY_VALUE_RE.test(match)) yield {
					match,
					groups: [match],
					input: text,
					offset: run.start
				};
			}
			runs.length = 0;
			schemeStart = -1;
			url = void 0;
			continue;
		}
		if (url && index >= url.start) {
			if (char === url.closing && escapeDepth === url.closingEscapeDepth) {
				url.end = Math.min(url.end, index);
				url = void 0;
			} else {
				if ("?#\"'<>`|()[]{}".includes(char)) url.end = Math.min(url.end, index);
				url.queryOrFragment ||= char === "?" || char === "#";
				if (url.authorityEnd === -1) {
					url.hasAt ||= char === "@";
					if ("/?#".includes(char)) url.authorityEnd = index;
					else if (index < url.end) {
						if (char === ":") {
							url.portValid &&= url.portStart === -1;
							url.portStart = index;
						} else if (url.portStart !== -1 && (char < "0" || char > "9")) url.portValid = false;
					}
				}
			}
		}
		if (AWS_URL_SCHEME_CHARACTER_RE.test(char)) {
			if (schemeStart === -1) schemeStart = index;
		} else {
			if ((!url || index >= url.end && !url.queryOrFragment) && char === ":" && text.startsWith("//", index + 1) && schemeStart !== -1 && AWS_URL_SCHEME_START_RE.test(text[schemeStart])) {
				const opening = text[schemeStart - 1];
				let closingEscapeDepth = 0;
				for (let offset = schemeStart - 2; offset >= 0 && text[offset] === "\\"; offset--) closingEscapeDepth++;
				url = {
					start: index + 3,
					end: text.length,
					authorityEnd: -1,
					portStart: -1,
					portValid: true,
					hasAt: false,
					queryOrFragment: false,
					closing: opening ? closingDelimiters[opening] : void 0,
					closingEscapeDepth
				};
			}
			schemeStart = -1;
		}
	}
}
const AWS_SECRET_ACCESS_KEY_MATCHER = Object.freeze({
	source: "aws-secret-access-key",
	exec: matchAwsSecretAccessKeys,
	couldMatch: couldMatchAwsSecretAccessKey
});
const TELEGRAM_BOT_TOKEN_REDACT_PATTERN = String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
const TELEGRAM_TOKEN_REDACT_PATTERN = String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
const CREDENTIAL_STYLE_HEADER_KEYS = "x-goog-api-key|api-key|apikey|x-api-token|x-access-token";
const GATEWAY_SECURITY_HEADER_KEYS = "X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token";
const CREDENTIAL_HEADER_FIELD_RE = new RegExp(`^(?:${CREDENTIAL_STYLE_HEADER_KEYS}|${GATEWAY_SECURITY_HEADER_KEYS})$`, "i");
const LOG_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_?&-]|\\{1,64}[rn])`;
const CREDENTIAL_STYLE_COLON_HEADER_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${CREDENTIAL_STYLE_HEADER_KEYS})${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*:${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
const CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${CREDENTIAL_STYLE_HEADER_KEYS})${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*=${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
const GATEWAY_SECURITY_COLON_HEADER_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${GATEWAY_SECURITY_HEADER_KEYS})\s*:\s*([^\s"',;]+)`;
const GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${GATEWAY_SECURITY_HEADER_KEYS})\s*=\s*([^\s"',;]+)`;
const FORM_AWARE_EQUALS_ASSIGNMENT_PATTERN_SOURCES = /* @__PURE__ */ new Set([CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN, GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN]);
const HTTP_AUTH_HEADER_REDACT_PATTERNS = [
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
	CREDENTIAL_STYLE_COLON_HEADER_REDACT_PATTERN,
	CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN
];
const AUTHORIZATION_BEARER_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bearer${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
const AUTHORIZATION_BASIC_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Basic${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
const AUTHORIZATION_BOT_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bot${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
const STANDALONE_BEARER_REDACT_PATTERN = String.raw`\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])`;
const SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES = /* @__PURE__ */ new Set([
	ENV_ASSIGNMENT_REDACT_PATTERN,
	ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_REDACT_PATTERN
]);
const CHUNK_UNSAFE_PATTERN_SOURCES = /* @__PURE__ */ new Set([
	TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
	TELEGRAM_TOKEN_REDACT_PATTERN,
	AUTHORIZATION_BEARER_REDACT_PATTERN,
	AUTHORIZATION_BASIC_REDACT_PATTERN,
	AUTHORIZATION_BOT_REDACT_PATTERN,
	STANDALONE_BEARER_REDACT_PATTERN,
	...HTTP_AUTH_HEADER_REDACT_PATTERNS
]);
const DEFAULT_REDACT_FIELD_PATTERNS = [
	ENV_ASSIGNMENT_REDACT_PATTERN,
	ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
	STRUCTURED_JSON_SECRET_REDACT_PATTERN,
	STRUCTURED_JSON_PAYMENT_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN,
	String.raw`--(?:${CLI_SECRET_FLAG_KEYS})=([^\s"']+)`,
	String.raw`--(?:${CLI_SECRET_FLAG_KEYS})\s+(?!(?:or|and)\b(?=\s+--))(["']?)([^\s"']+)\1`,
	AUTHORIZATION_BEARER_REDACT_PATTERN,
	AUTHORIZATION_BASIC_REDACT_PATTERN,
	AUTHORIZATION_BOT_REDACT_PATTERN,
	...HTTP_AUTH_HEADER_REDACT_PATTERNS,
	GATEWAY_SECURITY_COLON_HEADER_REDACT_PATTERN,
	GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN,
	STANDALONE_BEARER_REDACT_PATTERN,
	String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,
	String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,
	String.raw`(^|[\s,;])(?:${FORM_BODY_FIRST_PAIR_KEYS})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,
	STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN,
	PEM_REDACT_PATTERN_SOURCE,
	String.raw`(^|[\s,{])["']?(?:${AWS_SECRET_ACCESS_KEY_FIELD_KEYS})["']?\s*[:=]\s*(["']?)([A-Za-z0-9/+=]{40})(?![A-Za-z0-9/+=])\2`
];
const VENDOR_TOKEN_REDACT_PATTERNS = [
	String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,
	String.raw`(ghp_[A-Za-z0-9]{10,})`,
	String.raw`(github_pat_[A-Za-z0-9_]{10,})`,
	String.raw`(gho_[A-Za-z0-9]{10,})`,
	String.raw`(ghu_[A-Za-z0-9]{10,})`,
	String.raw`(ghs_[A-Za-z0-9]{10,})`,
	String.raw`(ghr_[A-Za-z0-9]{10,})`,
	String.raw`(glpat-[A-Za-z0-9._=\-]{20,})`,
	String.raw`(gloas-(?:[A-Fa-f0-9]{65,}|[A-Za-z0-9_-]{64}|[A-Fa-f0-9]{32,}))`,
	String.raw`(gldt-[A-Za-z0-9_-]{20,})`,
	String.raw`(glcbt-[A-Za-z0-9]{1,5}_[A-Za-z0-9_-]{20,})`,
	String.raw`(glptt-[A-Za-z0-9_-]{40,})`,
	String.raw`(glft-(?:[A-Za-z0-9_-]{20,}|[a-h0-9]+-[0-9]+_))`,
	String.raw`(glimt-[A-Za-z0-9_-]{25,})`,
	String.raw`(glagent-[A-Za-z0-9_-]{50,})`,
	String.raw`(glwt-[A-Za-z0-9_-]{20,})`,
	String.raw`(glsoat-[A-Za-z0-9_-]{20,})`,
	String.raw`(glffct-[A-Za-z0-9_-]{20,})`,
	String.raw`(glrt-[A-Za-z0-9._-]{20,})`,
	String.raw`(glrtr?-[A-Za-z0-9_-]{27,300}\.[0-9a-z]{2}\.[0-9a-z]{9})`,
	String.raw`(GR1348941[A-Za-z0-9_-]{20,})`,
	String.raw`(_gitlab_session=[A-Za-z0-9%._-]{20,})`,
	String.raw`(xox[baprs]-[A-Za-z0-9-]{10,})`,
	String.raw`(xapp-[A-Za-z0-9-]{10,})`,
	String.raw`(https:\/\/hooks\.slack\.com\/(?:services\/T[A-Z0-9]+\/B[A-Z0-9]+|workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19})\/[A-Za-z0-9]{20,})`,
	String.raw`(https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]{17,20}\/[A-Za-z0-9_-]{60,})`,
	String.raw`discord(?:.|\n|\r){0,40}?\b([A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27})\b`,
	String.raw`(gsk_[A-Za-z0-9_-]{10,})`,
	String.raw`(AIza[0-9A-Za-z\-_]{20,})`,
	String.raw`(ya29\.[0-9A-Za-z_\-./+=]{10,})`,
	String.raw`(1//0[0-9A-Za-z_\-./+=]{10,})`,
	String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
	String.raw`(pplx-[A-Za-z0-9_-]{10,})`,
	String.raw`(fal_[A-Za-z0-9_-]{10,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fc-[A-Za-z0-9]{10,})`,
	String.raw`(bb_live_[A-Za-z0-9_-]{10,})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(gAAAA[A-Za-z0-9_=-]{20,})`,
	String.raw`(sk_live_[A-Za-z0-9]{10,})`,
	String.raw`(sk_test_[A-Za-z0-9]{10,})`,
	String.raw`(rk_live_[A-Za-z0-9]{10,})`,
	String.raw`(SG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
	String.raw`(npm_[A-Za-z0-9]{10,})`,
	String.raw`(pypi-[A-Za-z0-9_-]{10,})`,
	String.raw`(dop_v1_[A-Za-z0-9]{10,})`,
	String.raw`(doo_v1_[A-Za-z0-9]{10,})`,
	String.raw`(dor_v1_[A-Za-z0-9]{10,})`,
	String.raw`(dp\.(?:ct|pt|sa|scim|audit)\.[A-Za-z0-9]{40,44})`,
	String.raw`(dp\.st\.[A-Za-z0-9]{40,44})`,
	String.raw`(dp\.st\.[a-z0-9_-]{2,35}\.[A-Za-z0-9]{40,44})`,
	String.raw`(dckr_(?:pat|oat)_[A-Za-z0-9_-]{27,32})`,
	String.raw`(bkua_[a-z0-9]{40})`,
	String.raw`(CCIPAT_[A-Za-z0-9]{22}_[A-Fa-f0-9]{40})`,
	String.raw`(sbp_[a-z0-9]{40})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(dapi[0-9a-f]{32}(?:-\d)?)`,
	String.raw`(dd[pw]_[A-Za-z0-9]{36})`,
	String.raw`(glsa_[A-Za-z0-9_]{41})`,
	String.raw`(glc_eyJ[A-Za-z0-9+/=]{60,160})`,
	String.raw`(nfp_[A-Za-z0-9_]{36})`,
	String.raw`(CFPAT-[A-Za-z0-9_\-]{40,})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATBB[A-Za-z0-9_=.-]{16,})`,
	String.raw`(BBDC-[A-Za-z0-9+/@_-]{40,50})`,
	String.raw`(HRKU-AA[A-Za-z0-9_-]{20,})`,
	String.raw`(pat-(?:eu|na)1-[A-Za-z0-9]{8}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{12})`,
	String.raw`(apify_api_[A-Za-z0-9\-]{20,})`,
	String.raw`(FlyV1 fm\d+_[A-Za-z0-9+/=,_-]{100,})`,
	String.raw`(fio-u-[A-Za-z0-9_-]{40,})`,
	String.raw`(^|[^A-Za-z0-9_])(am_[A-Za-z0-9_-]{10,})`,
	String.raw`(^|[^A-Za-z0-9_])(sk_[A-Za-z0-9_]{10,})`,
	String.raw`(tvly-[A-Za-z0-9]{10,})`,
	String.raw`(exa_[A-Za-z0-9]{10,})`,
	String.raw`(syt_[A-Za-z0-9]{10,})`,
	String.raw`(retaindb_[A-Za-z0-9]{10,})`,
	String.raw`(hsk-[A-Za-z0-9]{10,})`,
	String.raw`(mem0_[A-Za-z0-9]{10,})`,
	String.raw`(brv_[A-Za-z0-9]{10,})`,
	String.raw`(xai-[A-Za-z0-9]{30,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw-[A-Za-z0-9]{30,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw_[A-Za-z0-9]{30,})`,
	String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fpk_[A-Za-z0-9]{30,})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(AKIA[A-Z0-9]{16})`,
	String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ASIA[A-Z0-9]{16})`,
	String.raw`(AKID[A-Za-z0-9]{10,})`,
	String.raw`(LTAI[A-Za-z0-9]{10,})`,
	String.raw`(hf_[A-Za-z0-9]{10,})`,
	String.raw`(api_org_[A-Za-z0-9]{20,})`,
	String.raw`(r8_[A-Za-z0-9]{10,})`,
	TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
	TELEGRAM_TOKEN_REDACT_PATTERN
];
const DEFAULT_REDACT_PATTERNS = [...[...DEFAULT_REDACT_FIELD_PATTERNS, ...VENDOR_TOKEN_REDACT_PATTERNS], AWS_SECRET_ACCESS_KEY_MATCHER];
const TOOL_PAYLOAD_AMBIGUOUS_ASSIGNMENT_PATTERNS = /* @__PURE__ */ new Set([
	ENV_ASSIGNMENT_REDACT_PATTERN,
	ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
	STRUCTURED_JSON_SECRET_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN,
	AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
	STANDALONE_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN,
	CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN
]);
const TOOL_PAYLOAD_REDACT_PATTERNS = DEFAULT_REDACT_PATTERNS.filter((pattern) => typeof pattern !== "string" || !TOOL_PAYLOAD_AMBIGUOUS_ASSIGNMENT_PATTERNS.has(pattern));
//#endregion
//#region src/logging/redact-performance.ts
const redactionPerformance = channel("openclaw.redaction");
/** The capture subscriber receives counts and synchronous CPU time, never text or patterns. */
function startRedactionMeasurement(operation) {
	if (!redactionPerformance.hasSubscribers) return;
	const startedAt = performance.now();
	const cpu = process.threadCpuUsage();
	return (outcome, inputChars, patternCount) => {
		const elapsedMs = performance.now() - startedAt;
		const used = process.threadCpuUsage(cpu);
		redactionPerformance.publish({
			operation,
			outcome,
			pid: process.pid,
			threadId,
			isMainThread,
			elapsedMs,
			threadCpuMs: (used.user + used.system) / 1e3,
			...inputChars === void 0 ? {} : { inputChars },
			...patternCount === void 0 ? {} : { patternCount }
		});
	};
}
//#endregion
//#region src/shared/assistant-error-format.ts
const HTTP_STATUS_DELIMITER_RE = /(?:\s*:\s*|\s+)/;
new RegExp(`^(?:http\\s*)?(\\d{3})${HTTP_STATUS_DELIMITER_RE.source}(.+)$`, "i");
new RegExp(`^(?:http\\s*)?(\\d{3})(?:${HTTP_STATUS_DELIMITER_RE.source}([\\s\\S]+))?$`, "i");
const REFUSED_TRANSPORT_CODE_RE = /\beconnrefused\b/i;
const INTERRUPTED_TRANSPORT_CODE_RE = /\beconnreset\b|\beconnaborted\b|\benetreset\b|\bepipe\b/i;
const DNS_TRANSPORT_CODE_RE = /\benotfound\b|\beai_again\b/i;
const UNREACHABLE_TRANSPORT_CODE_RE = /\benetunreach\b|\behostunreach\b|\behostdown\b/i;
function isKnownTransportErrorCode(value) {
	return [
		REFUSED_TRANSPORT_CODE_RE,
		INTERRUPTED_TRANSPORT_CODE_RE,
		DNS_TRANSPORT_CODE_RE,
		UNREACHABLE_TRANSPORT_CODE_RE
	].some((pattern) => pattern.exec(value)?.[0] === value);
}
//#endregion
//#region src/logging/structured-authorization-code.ts
function pathEndsWith(path, suffix) {
	if (path.length < suffix.length) return false;
	return suffix.every((part, index) => path[path.length - suffix.length + index] === part);
}
function shouldRedactStructuredAuthorizationCode(normalizedKey, path, transportCode) {
	if (normalizedKey !== "code") return false;
	const normalizedPath = path.map((part) => part.toLowerCase());
	if (normalizedPath.length === 1 || pathEndsWith(normalizedPath, ["error", "code"]) || pathEndsWith(normalizedPath, ["nodeerror", "code"]) || pathEndsWith(normalizedPath, ["status", "code"]) || pathEndsWith(normalizedPath, ["details", "code"]) || pathEndsWith(normalizedPath, ["warnings", "code"])) return false;
	return !(transportCode !== void 0 && normalizedPath.length > 1 && normalizedPath.slice(0, -1).every((part) => part === "cause") && isKnownTransportErrorCode(transportCode));
}
//#endregion
//#region src/logging/redact.ts
const DEFAULT_REDACT_MODE = "tools";
const DEFAULT_REDACT_MIN_LENGTH = 18;
const DEFAULT_REDACT_KEEP_START = 6;
const shellReferencePreservingPatterns = /* @__PURE__ */ new WeakSet();
const chunkUnsafePatterns = /* @__PURE__ */ new WeakSet();
const formAwareEqualsAssignmentPatterns = /* @__PURE__ */ new WeakSet();
const sourceAssignmentPatterns = /* @__PURE__ */ new WeakSet();
let defaultResolvedPatterns;
let toolPayloadResolvedPatterns;
const FORM_BODY_KEY_OBFUSCATION_RE = new RegExp(String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]`, "gu");
const FORM_BODY_KEY_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
const FORM_BODY_PERCENT_ESCAPE_RE = /%[0-9A-Fa-f]{2}/u;
const FORM_BODY_KEY = String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*(?:[A-Za-z_]|%[0-9A-Fa-f]{2})(?:[A-Za-z0-9_.-]|%[0-9A-Fa-f]{2}|[${FORM_BODY_KEY_INVISIBLE_CHARS}+])*`;
const FORM_BODY_VALUE = "[^&\\s<>]*";
const URL_QUERY_VALUE = "[^&#\\s<>]*";
const FORM_BODY_PAIR = String.raw`${FORM_BODY_KEY}=${FORM_BODY_VALUE}`;
const FORM_BODY_RE = new RegExp(String.raw`^${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+$`, "u");
const FORM_BODY_SUBSTRING_RE = new RegExp(String.raw`(^|[\s:({\[,="'` + "`" + String.raw`])(${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+)`, "gu");
const ENCODED_FORM_PAIR_RE = new RegExp(String.raw`(^|[\s:({\[,="'` + "`" + String.raw`&])(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})`, "gu");
const FORM_BODY_CONTEXT_SINGLE_PAIR_RE = new RegExp(String.raw`(\b(?:body|form(?:[-_\s]?body)?)\s*[:=]\s*(["'\x60]?))(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})(["'\x60]?)`, "giu");
const URL_QUERY_PAIR_RE = new RegExp(String.raw`([?&])(${FORM_BODY_KEY})=(${URL_QUERY_VALUE})`, "gu");
const SECRET_VALUE_TRAILING_DELIMITER_RE = /(["'`,;)}\]]+)$/u;
const SECRET_VALUE_SUFFIX_RE = /^["'`,;)}\]]*$/u;
const SECRET_VALUE_QUOTE_CHARS = /* @__PURE__ */ new Set([
	"\"",
	"'",
	"`"
]);
const FORM_BODY_LINE_BREAK_SPLIT_RE = /(\r\n|\r|\n)/u;
const FORM_BODY_LINE_BREAK_SEGMENT_RE = /^(?:\r\n|\r|\n)$/u;
const STRUCTURED_SECRET_FIELD_RE = new RegExp(String.raw`^(?:api[-_]?key|apiKey|api[-_]?token|apiToken|bearer[-_]?token|bearerToken|token|secret|password|passwd|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|private[-_]?key|privateKey|access[-_]?token|accessToken|refresh[-_]?token|refreshToken|id[-_]?token|idToken|auth[-_]?token|authToken|client[-_]?secret|clientSecret|app[-_]?secret|appSecret|secret[-_]?value|secretValue|raw[-_]?secret|rawSecret|secret[-_]?input|secretInput|key|key[-_]?material|keyMaterial|jwt|session|signature|cookie|set[-_]?cookie|${PAYMENT_CREDENTIAL_QUERY_KEYS}|${PAYMENT_CREDENTIAL_JSON_KEYS})$`, "i");
const STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE = /^\$WORKSPACE_DIR\/[A-Za-z0-9._/-]+\.jsonl$/u;
const STRUCTURED_APP_PASSWORD_FIELD_RE = /^(?:apple|icloud|app[-_]?specific[-_]?password|appSpecificPassword|application[-_]?password|text|content|message|error|errorMessage|detail|details|reason)$/i;
const APP_SPECIFIC_PASSWORD_RE = /\b([a-z]{4}-[a-z]{4}-[a-z]{4}-[a-z]{4})\b/g;
const BENIGN_APP_PASSWORD_WORDS = /* @__PURE__ */ new Set([
	"case",
	"claw",
	"demo",
	"file",
	"main",
	"name",
	"open",
	"path",
	"slug",
	"test"
]);
const STRUCTURED_SECRET_ENV_FIELD_RE = new RegExp(String.raw`^(?:(?:[A-Z0-9]+[_-])+(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)|API[_-]?KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})$`, "i");
const DEFAULT_REDACT_PREFILTER_SOURCES = [
	String.raw`KEY|TOKEN|SECRET|PASSWORD|PASSWD|AUTH|COOKIE|SIGNATURE|CREDENTIAL|CARD|CVC|CVV|PAYMENT|PRIVATE KEY`,
	String.raw`security[-_]?code|\bpass\s*[=:]|\bpassphrase\s*[=:]|_(?:password|pass|passphrase|passwd)\s*[=:]|jwt\s*[=:]|session=|code=|\bsig\s*=`,
	String.raw`\bBearer\s+`,
	String.raw`:\/\/[^\/\s:@]*:[^\s@]+@`,
	String.raw`sk-|gh[opsur]_|github_pat_|glpat-|gloas-|gldt-|glcbt-|glptt-|glft-|glimt-|glagent-|glwt-|glsoat-|glffct-|glrt-|glrtr-|GR1348941|_gitlab_session=|xox[baprs]-|xapp-|hooks\.slack\.com|discord|gsk_|AIza|ya29\.|1\/\/0|eyJ|pplx-|fal_|fc-|bb_live_|gAAAA|[sr]k_(?:live|test)_|SG\.|npm_|pypi-|do[opr]_v1_|dp\.(?:ct|pt|sa|st|scim|audit)\.|dckr_|bkua_|CCIPAT_|sbp_|dapi[0-9a-f]|dd[pw]_|glsa_|nfp_|CFPAT-|ATCTT3|ATATT|ATBB|BBDC-|HRKU-|pat-(?:eu|na)1-|apify_api_|FlyV1|fio-u-|tvly-|exa_|syt_|retaindb_|mem0_|brv_|xai-|fw-|fw_|fpk_`,
	String.raw`(?:^|[^A-Za-z0-9_])(?:am_|sk_)`,
	String.raw`A[KS]IA[A-Z0-9]|AKID|LTAI|hf_|api_org_|r8_`,
	String.raw`\bbot\d{6,}:|\b\d{6,}:[A-Za-z0-9_-]{20,}`,
	String.raw`%[0-9A-Fa-f]{2}[${FORM_BODY_KEY_INVISIBLE_CHARS}+A-Za-z0-9_%.-]*=`,
	String.raw`=(?<=(?:\+|[${FORM_BODY_KEY_INVISIBLE_CHARS}])(?:[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*[A-Za-z0-9_%.-])+[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*=)|=(?<=[A-Za-z0-9_%.-][${FORM_BODY_KEY_INVISIBLE_CHARS}+]+=)`
];
const DEFAULT_REDACT_PREFILTER_RE = new RegExp(`(?:${DEFAULT_REDACT_PREFILTER_SOURCES.join("|")})`, "iu");
const FULL_CONTEXT_REDACT_EXTRA_TRIGGERS_RE = /JWT|Bearer\s+|am_|sk_|(?<!\d)\d{6,}:[A-Za-z0-9_-]{20,}/i;
function normalizeMode(value) {
	return value === "off" ? "off" : DEFAULT_REDACT_MODE;
}
function parsePattern(raw) {
	if (raw === PEM_REDACT_PATTERN_SOURCE) return PEM_REDACT_MATCHER;
	if (typeof raw !== "string" && !(raw instanceof RegExp)) return raw;
	let pattern = null;
	if (raw instanceof RegExp) {
		if (raw.flags.includes("g")) pattern = raw;
		else pattern = new RegExp(raw.source, `${raw.flags}g`);
	} else if (raw.trim()) pattern = compileConfigRegex(...parseRedactPatternSource(raw))?.regex ?? null;
	if (pattern && typeof raw === "string" && SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES.has(raw)) shellReferencePreservingPatterns.add(pattern);
	if (pattern && typeof raw === "string" && TOOL_PAYLOAD_AMBIGUOUS_ASSIGNMENT_PATTERNS.has(raw)) sourceAssignmentPatterns.add(pattern);
	if (pattern && typeof raw === "string" && FORM_AWARE_EQUALS_ASSIGNMENT_PATTERN_SOURCES.has(raw)) formAwareEqualsAssignmentPatterns.add(pattern);
	if (pattern && typeof raw === "string" && (raw.startsWith(BASE64_SAFE_TOKEN_BOUNDARY) || raw.startsWith(IDENTIFIER_SAFE_TOKEN_BOUNDARY) || CHUNK_UNSAFE_PATTERN_SOURCES.has(raw))) chunkUnsafePatterns.add(pattern);
	return pattern;
}
function resolvePatterns(value) {
	if (value === TOOL_PAYLOAD_REDACT_PATTERNS) {
		toolPayloadResolvedPatterns ??= TOOL_PAYLOAD_REDACT_PATTERNS.map(parsePattern).filter((re) => Boolean(re));
		return toolPayloadResolvedPatterns;
	}
	if (!value?.length || value === DEFAULT_REDACT_PATTERNS) {
		defaultResolvedPatterns ??= DEFAULT_REDACT_PATTERNS.map(parsePattern).filter((re) => Boolean(re));
		return defaultResolvedPatterns;
	}
	return [.../* @__PURE__ */ new Set([...value.map(parsePattern).filter((re) => Boolean(re)), AWS_SECRET_ACCESS_KEY_MATCHER])];
}
function usesBuiltInRedactPatterns(value) {
	return !value?.length || value === DEFAULT_REDACT_PATTERNS || value === TOOL_PAYLOAD_REDACT_PATTERNS;
}
function maskToken(token) {
	if (token === "***") return token;
	if (token.length < DEFAULT_REDACT_MIN_LENGTH) return "***";
	return `${sliceUtf16Safe(token, 0, DEFAULT_REDACT_KEEP_START)}…${sliceUtf16Safe(token, -4)}`;
}
function splitSecretValueForMask(token) {
	const openingQuote = token[0] ?? "";
	if (SECRET_VALUE_QUOTE_CHARS.has(openingQuote)) {
		const closingQuoteIndex = token.lastIndexOf(openingQuote);
		if (closingQuoteIndex > 0) {
			const suffix = token.slice(closingQuoteIndex + 1);
			if (SECRET_VALUE_SUFFIX_RE.test(suffix)) return {
				maskable: token.slice(1, closingQuoteIndex),
				suffix,
				maskStart: 0,
				maskEnd: closingQuoteIndex + 1
			};
		}
		const tokenWithoutLeadingQuote = token.slice(1);
		const trailingDelimiter = tokenWithoutLeadingQuote.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
		const maskable = trailingDelimiter && trailingDelimiter.length < tokenWithoutLeadingQuote.length ? tokenWithoutLeadingQuote.slice(0, -trailingDelimiter.length) : tokenWithoutLeadingQuote;
		return {
			maskable,
			suffix: trailingDelimiter && trailingDelimiter.length < tokenWithoutLeadingQuote.length ? trailingDelimiter : "",
			maskStart: 0,
			maskEnd: 1 + maskable.length
		};
	}
	const trailingDelimiter = token.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
	const maskable = trailingDelimiter && trailingDelimiter.length < token.length ? token.slice(0, -trailingDelimiter.length) : token;
	return {
		maskable,
		suffix: maskable === token ? "" : trailingDelimiter,
		maskStart: 0,
		maskEnd: maskable.length
	};
}
function splitFormAwareCredentialValue(token) {
	const pairBoundary = token.search(/&[A-Za-z_][A-Za-z0-9_.-]*=/u);
	return pairBoundary < 0 ? {
		secret: token,
		suffix: ""
	} : {
		secret: token.slice(0, pairBoundary),
		suffix: token.slice(pairBoundary)
	};
}
function maskSecretValue(token, options) {
	const { maskable, suffix } = splitSecretValueForMask(token);
	return `${options?.hinted ? maskToken(maskable) : "***"}${suffix}`;
}
function normalizeSensitiveKeyName(value) {
	const stripped = value.replace(FORM_BODY_KEY_SEPARATOR_RE, "");
	try {
		return decodeURIComponent(stripped).replace(FORM_BODY_KEY_SEPARATOR_RE, "").toLowerCase().replaceAll("-", "_");
	} catch {
		return stripped.toLowerCase().replaceAll("-", "_");
	}
}
function isSensitiveBodyKey(key) {
	return isSensitiveUrlQueryParamName(key) || BODY_SECRET_KEYS.has(normalizeSensitiveKeyName(key));
}
function hasEncodedOrInvisibleFormKey(key) {
	return FORM_BODY_PERCENT_ESCAPE_RE.test(key) || key.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") !== key;
}
function visitSensitiveAssignments(text, kind, visit) {
	if (!text || kind === "url" && !text.includes("?")) return;
	if (kind === "encoded" && !text.includes("%") && text.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") === text) return;
	if (kind === "context" && !/[=:]/u.test(text)) return;
	const visitPair = (key, token, valueOffset) => {
		if (kind === "encoded" && !hasEncodedOrInvisibleFormKey(key)) return;
		if (!isSensitiveBodyKey(key)) return;
		const { maskable, maskStart, maskEnd } = splitSecretValueForMask(token);
		visit(valueOffset + maskStart, valueOffset + maskEnd, maskable);
	};
	if (kind === "form") {
		let cursor = 0;
		for (const pair of text.split("&")) {
			const equalsIndex = pair.indexOf("=");
			if (equalsIndex >= 0) visitPair(pair.slice(0, equalsIndex), pair.slice(equalsIndex + 1), cursor + equalsIndex + 1);
			cursor += pair.length + 1;
		}
		return;
	}
	const pattern = kind === "url" ? URL_QUERY_PAIR_RE : kind === "encoded" ? ENCODED_FORM_PAIR_RE : FORM_BODY_CONTEXT_SINGLE_PAIR_RE;
	const keyIndex = kind === "context" ? 3 : 2;
	pattern.lastIndex = 0;
	try {
		for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
			const prefix = match[1] ?? "";
			const key = match[keyIndex] ?? "";
			visitPair(key, match[keyIndex + 1] ?? "", match.index + prefix.length + key.length + 1);
		}
	} finally {
		pattern.lastIndex = 0;
	}
}
function redactAssignmentValues(text, kind, onEdits) {
	const parts = [];
	const edits = [];
	let cursor = 0;
	visitSensitiveAssignments(text, kind, (start, end, maskable) => {
		const replacement = kind === "url" ? maskToken(maskable) : "***";
		parts.push(text.slice(cursor, start), replacement);
		if (onEdits) edits.push({
			start,
			end,
			replacement
		});
		cursor = end;
	});
	if (edits.length > 0) onEdits?.(edits);
	return parts.length > 0 ? parts.join("") + text.slice(cursor) : text;
}
function redactFormBodyLine(text, onEdits) {
	if (!text) return text;
	const contextRedacted = redactAssignmentValues(redactAssignmentValues(text, "encoded", onEdits), "context", onEdits);
	if (!contextRedacted.includes("&")) return contextRedacted;
	if (FORM_BODY_RE.test(contextRedacted)) return redactAssignmentValues(contextRedacted, "form", onEdits);
	const substringEdits = [];
	const redacted = contextRedacted.replace(FORM_BODY_SUBSTRING_RE, (match, prefix, body, offset) => {
		const redactedBody = redactAssignmentValues(body, "form", onEdits ? (edits) => {
			for (const edit of edits) substringEdits.push({
				...edit,
				start: offset + prefix.length + edit.start,
				end: offset + prefix.length + edit.end
			});
		} : void 0);
		return redactedBody === body ? match : `${prefix}${redactedBody}`;
	});
	if (substringEdits.length > 0) onEdits?.(substringEdits);
	return redactAssignmentValues(redactAssignmentValues(redacted, "encoded", onEdits), "context", onEdits);
}
function redactFormBody(text, onEdits) {
	if (!text.includes("=")) return text;
	if (FORM_BODY_LINE_BREAK_SPLIT_RE.test(text)) {
		let offset = 0;
		return text.split(FORM_BODY_LINE_BREAK_SPLIT_RE).map((segment) => {
			const result = FORM_BODY_LINE_BREAK_SEGMENT_RE.test(segment) ? segment : redactFormBodyLine(segment, onEdits ? (edits) => onEdits(edits.map((edit) => ({
				...edit,
				start: offset + edit.start,
				end: offset + edit.end
			}))) : void 0);
			offset += result.length;
			return result;
		}).join("");
	}
	return redactFormBodyLine(text, onEdits);
}
function isShellReferenceToKey(key, value) {
	if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) return false;
	const bare = value.match(/^\$([A-Z_][A-Z0-9_]*)$/);
	if (bare) return bare[1] === key;
	return value.match(/^\$\{([A-Z_][A-Z0-9_]*)(?::[-=?+])?\}$/)?.[1] === key;
}
function maskSecretFieldValue(key, value) {
	const expansion = value.match(/^\$\{([A-Z_][A-Z0-9_]*):[-=?+][^{}]+\}(?![\s\S])/);
	if (expansion && expansion[1] === key) return `${value.slice(0, value.indexOf(":") + 2)}***}`;
	return "***";
}
function readEnvAssignmentKey(match) {
	return match.match(/\b([A-Z_][A-Z0-9_]*)\b\s*[=:]/)?.[1];
}
function shouldPreserveShellReferenceMatch(match, token) {
	const key = readEnvAssignmentKey(match);
	return key ? isShellReferenceToKey(key, token) : false;
}
function isEmptyShellParameterExpansionTail(token) {
	return /^[-=?+]\}$/.test(token);
}
function prepareRedactionCapture({ match, groups, input, offset, replacement: policyReplacement }, pattern, preserveSourceAssignment) {
	if (match.includes("PRIVATE KEY-----")) return {
		start: offset,
		end: offset + match.length,
		value: match,
		redact: (target) => ({
			start: target.start,
			end: target.end,
			value: target.value,
			replacement: policyReplacement ?? redactPemBlock(target.value, "…redacted…")
		})
	};
	const selected = selectSecretCapture(match, groups);
	if (selected.value === "***") return;
	const tokenIndex = selected.value === match ? 0 : getSecretCaptureStart(pattern, input, match, offset, selected);
	if (tokenIndex < 0) return;
	const start = offset + tokenIndex;
	return {
		start,
		end: start + selected.value.length,
		value: selected.value,
		redact: (target) => {
			const token = target.value;
			if (sourceAssignmentPatterns.has(pattern) && preserveSourceAssignment?.(input, offset + getSecretCaptureStart(pattern, input, match, offset, selected))) return;
			const formAwareValue = formAwareEqualsAssignmentPatterns.has(pattern) ? splitFormAwareCredentialValue(token) : {
				secret: token,
				suffix: ""
			};
			if (splitSecretValueForMask(formAwareValue.secret).maskable === "***") return;
			const isShellReferencePattern = shellReferencePreservingPatterns.has(pattern);
			if (isShellReferencePattern && (shouldPreserveShellReferenceMatch(match, token) || isEmptyShellParameterExpansionTail(token))) return;
			const masked = policyReplacement ?? (preserveSourceAssignment && sourceAssignmentPatterns.has(pattern) ? maskSecretValue(token) : isShellReferencePattern ? maskToken(token) : `${maskSecretValue(formAwareValue.secret, { hinted: true })}${formAwareValue.suffix}`);
			return {
				start: target.start,
				end: target.end,
				replacement: masked
			};
		}
	};
}
function redactMatch(match, pattern, preserveSourceAssignment) {
	const capture = prepareRedactionCapture(match, pattern, preserveSourceAssignment);
	const edit = capture?.redact(capture);
	return edit ? match.match.slice(0, edit.start - match.offset) + edit.replacement + match.match.slice(edit.end - match.offset) : match.match;
}
function redactText(text, patterns, options) {
	const finishMeasurement = startRedactionMeasurement("text");
	let outcome = "error";
	try {
		let next = redactFormBody(redactAssignmentValues(redactStructuredAuthHeaders(text, "***"), "url"));
		let pattern;
		const replace = (match) => redactMatch(match, pattern, options?.preserveSourceAssignment);
		const replaceRegex = (...args) => replace(readRedactMatch(args));
		for (pattern of patterns) next = pattern instanceof RegExp && !options?.fullContext && !chunkUnsafePatterns.has(pattern) ? replacePatternBounded(next, pattern, replaceRegex) : replaceRedactPattern(next, pattern, replace, replaceRegex);
		outcome = "ok";
		return next;
	} finally {
		finishMeasurement?.(outcome, text.length, patterns.length);
	}
}
function couldMatchDefaultRedactPatterns(text) {
	return DEFAULT_REDACT_PREFILTER_RE.test(text) || AWS_SECRET_ACCESS_KEY_MATCHER.couldMatch(text);
}
function couldMatchDefaultFullContextPatterns(text) {
	return couldMatchDefaultRedactPatterns(text) || FULL_CONTEXT_REDACT_EXTRA_TRIGGERS_RE.test(text);
}
function looksLikeAppSpecificPassword(candidate) {
	return candidate.split("-").every((part) => !BENIGN_APP_PASSWORD_WORDS.has(part.toLowerCase()));
}
function redactAppSpecificPasswords(text) {
	return replacePatternBounded(text, APP_SPECIFIC_PASSWORD_RE, (match, token) => looksLikeAppSpecificPassword(token) ? maskToken(token) : match);
}
function resolveConfigRedaction() {
	const cfg = readLoggingConfig();
	return {
		mode: DEFAULT_REDACT_MODE,
		patterns: cfg?.redactPatterns
	};
}
function resolveRedactOptions(options) {
	const resolved = options ?? resolveConfigRedaction();
	const mode = normalizeMode(resolved.mode);
	return {
		mode,
		patterns: mode === "off" ? [] : resolvePatterns(resolved.patterns)
	};
}
function redactSensitiveText(text, options) {
	if (!text) return text;
	return redactSensitiveTextWithOptions(redactRegisteredSecretValues(text, maskToken), options ?? resolveConfigRedaction());
}
function redactSensitiveTextWithOptions(exactRedacted, resolvedOptions) {
	if (normalizeMode(resolvedOptions.mode) === "off") return exactRedacted;
	if (usesBuiltInRedactPatterns(resolvedOptions.patterns) && !couldMatchDefaultRedactPatterns(exactRedacted)) return exactRedacted;
	return redactText(exactRedacted, resolveRedactOptions(resolvedOptions).patterns);
}
function resolveToolPayloadRedaction(loggingConfig = readLoggingConfig()) {
	const userPatterns = loggingConfig?.redactPatterns;
	return {
		mode: "tools",
		patterns: userPatterns && userPatterns.length > 0 ? [...userPatterns, ...DEFAULT_REDACT_PATTERNS] : void 0
	};
}
function isSensitiveFieldKey(key) {
	return STRUCTURED_SECRET_FIELD_RE.test(key) || STRUCTURED_SECRET_ENV_FIELD_RE.test(key);
}
function isPublicShareIdPath(path) {
	if (path.at(-1)?.toLowerCase() !== "id") return false;
	return path.at(-2)?.toLowerCase().replaceAll("-", "").replaceAll("_", "") === "publicshare";
}
function redactSensitiveFieldValueWithOptions(key, value, options, path = [key], objectPath = true) {
	const exactRedacted = redactRegisteredSecretValues(value, maskToken);
	if (isPublicShareIdPath(path)) return maskToken(exactRedacted);
	const fieldOptions = isSensitiveFieldKey(key) && options.sensitiveFieldPatterns ? {
		...options,
		patterns: options.sensitiveFieldPatterns
	} : options;
	const resolved = resolveRedactOptions(fieldOptions);
	if (resolved.mode === "off") return exactRedacted;
	const redacted = !usesBuiltInRedactPatterns(fieldOptions.patterns) || couldMatchDefaultRedactPatterns(exactRedacted) ? redactText(exactRedacted, resolved.patterns) : exactRedacted;
	if (redacted !== value || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key)) {
		const appRedacted = redactAppSpecificPasswords(redacted);
		if (appRedacted !== value) return appRedacted;
	}
	if (redacted !== value) return redacted;
	return shouldRedactStructuredStringField(key, exactRedacted, path, objectPath) ? maskToken(exactRedacted) : exactRedacted;
}
function shouldRedactStructuredPrimitiveField(key, path) {
	const normalizedKey = key.toLowerCase();
	return isPublicShareIdPath(path) || shouldRedactStructuredAuthorizationCode(normalizedKey, path) || isSensitiveFieldKey(key);
}
function isPlainRedactableObject(value) {
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function redactStructuredSecretValue(key, value, seen, options, path = key ? [key] : [], objectPath = true) {
	if (typeof value === "string") return redactSensitiveFieldValueWithOptions(key, value, options, path, objectPath);
	if (value === null || value === void 0) return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return shouldRedactStructuredPrimitiveField(key, path) ? "***" : value;
	if (Array.isArray(value)) {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		const out = value.map((entry) => redactStructuredSecretValue(key, entry, seen, options, path, false));
		seen.delete(value);
		return out;
	}
	if (typeof value === "object") {
		if (seen.has(value)) return "[Circular]";
		if (!isPlainRedactableObject(value)) return value;
		seen.add(value);
		const entries = Object.entries(value);
		for (const entry of entries) {
			const [name, child] = entry;
			entry[1] = redactStructuredSecretValue(name, child, seen, options, [...path, name], objectPath);
		}
		seen.delete(value);
		return Object.fromEntries(entries);
	}
	return value;
}
function redactSecretsWithOptions(value, options) {
	if (typeof value === "string") return redactSensitiveText(value, options);
	if (value === null || value === void 0) return value;
	if (typeof value !== "object") return value;
	return redactStructuredSecretValue("", value, /* @__PURE__ */ new WeakSet(), options);
}
function redactSecrets(value) {
	return redactSecretsWithOptions(value, resolveToolPayloadRedaction());
}
function preservesStructuredReference(key, value) {
	return key.toLowerCase() === "session" && STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE.test(value) || isShellReferenceToKey(key, value);
}
function shouldRedactStructuredStringField(key, value, path, objectPath) {
	return shouldRedactStructuredAuthorizationCode(key.toLowerCase(), path, objectPath ? value : void 0) || isSensitiveFieldKey(key) && !preservesStructuredReference(key, value);
}
function classifyLogFieldProtection(key, path, objectPath, value) {
	return (value === void 0 ? shouldRedactStructuredPrimitiveField(key, path) : isPublicShareIdPath(path) || shouldRedactStructuredStringField(key, value, path, objectPath)) ? "legacy" : CREDENTIAL_HEADER_FIELD_RE.test(key) ? "header" : void 0;
}
function getFieldRecordEdits(field, mode) {
	const { key, value, path, objectPath } = field;
	if (mode === "off" || !field.string && value === "null" || !classifyLogFieldProtection(key, path, objectPath, field.string ? value : void 0)) return [];
	return [{
		start: 0,
		end: value.length,
		replacement: maskSecretFieldValue(key, value)
	}];
}
function getTextRecordEdits(field, mode, fileFields) {
	const { value } = field;
	if (field.isKey || fileFields && !field.origin.structured) return [];
	if (fileFields && field.origin.primitiveMask) return [{
		start: 0,
		end: value.length,
		replacement: "***"
	}];
	if (!field.string) return [];
	const edits = [];
	const registered = redactRegisteredSecretValues(value, (secret, start) => {
		const replacement = maskToken(secret);
		edits.push({
			start,
			end: start + secret.length,
			replacement
		});
		return replacement;
	});
	if (fileFields && isPublicShareIdPath(field.path)) return [{
		start: 0,
		end: value.length,
		replacement: maskToken(registered)
	}];
	if (mode === "off") return edits;
	let combined = edits;
	const receive = (added) => {
		combined = composeRedactionEdits(value.length, combined, added);
	};
	const headers = findStructuredAuthParamRanges(registered).map(({ start, end }) => ({
		start,
		end,
		replacement: "***"
	}));
	receive(headers);
	redactFormBody(redactAssignmentValues(applyRedactionEdits(registered, headers), "url", receive), receive);
	return combined;
}
function getLegacyFieldRecordEdits(field, value, beforeConversion = false) {
	const { key, value: original, path, objectPath } = field;
	if (field.isKey || !field.origin.structured || !field.string) return [];
	if (isPublicShareIdPath(path)) return [];
	const edits = [];
	if (value !== original || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key)) {
		for (const match of value.matchAll(APP_SPECIFIC_PASSWORD_RE)) if (looksLikeAppSpecificPassword(match[0])) edits.push({
			start: match.index,
			end: match.index + match[0].length,
			replacement: maskToken(match[0])
		});
	}
	if (edits.length > 0 || value !== original) return edits;
	const protection = classifyLogFieldProtection(key, path, objectPath, value);
	return protection === "legacy" || beforeConversion && protection === "header" ? [{
		start: 0,
		end: value.length,
		replacement: maskToken(value)
	}] : [];
}
function resolveFileLogRedactOptions() {
	return resolveRedactOptions(resolveToolPayloadRedaction());
}
const preparationPatterns = [
	{
		source: "registered secret values",
		*exec(input) {
			const matches = [];
			redactRegisteredSecretValues(input, (secret, offset) => {
				matches.push({
					match: secret,
					groups: [],
					input,
					offset,
					replacement: maskToken(secret)
				});
				return secret;
			});
			yield* matches;
		}
	},
	{
		source: "structured authorization parameters",
		*exec(input) {
			for (const { start, end } of findStructuredAuthParamRanges(input)) yield {
				match: input.slice(start, end),
				groups: [],
				input,
				offset: start,
				replacement: "***"
			};
		}
	},
	{
		source: "URL query assignments",
		*exec(input) {
			const edits = [];
			redactAssignmentValues(input, "url", (added) => edits.push(...added));
			for (const edit of edits) yield {
				match: input.slice(edit.start, edit.end),
				groups: [],
				input,
				offset: edit.start,
				replacement: edit.replacement
			};
		}
	},
	{
		source: "form bodies",
		*exec(input) {
			let edits = [];
			redactFormBody(input, (added) => {
				edits = composeRedactionEdits(input.length, edits, added);
			});
			for (const edit of edits) yield {
				match: input.slice(edit.start, edit.end),
				groups: [],
				input,
				offset: edit.start,
				replacement: edit.replacement
			};
		}
	}
];
const CONSOLE_STRUCTURAL_FIELDS = /* @__PURE__ */ new Set(["time", "level"]);
function prepareFileToJsonReceivers(record, patterns) {
	const decoded = /* @__PURE__ */ new WeakSet();
	const active = /* @__PURE__ */ new WeakSet();
	const visit = (value, key, path, objectPath, decode) => {
		if (typeof value === "string" && decode) {
			const field = {
				key,
				path,
				objectPath,
				value,
				isKey: false,
				string: true,
				origin: {
					structured: true,
					primitiveMask: false
				}
			};
			let current = applyRedactionEdits(value, getTextRecordEdits(field, "tools", true));
			if (!isPublicShareIdPath(path)) for (const pattern of patterns) current = applyRedactionEdits(current, getPatternRedactionEdits(current, pattern, prepareRedactionCapture));
			return applyRedactionEdits(current, getLegacyFieldRecordEdits(field, current, true));
		}
		if (value === null || typeof value !== "object") return decode && [
			"number",
			"boolean",
			"bigint"
		].includes(typeof value) && classifyLogFieldProtection(key, path, objectPath, void 0) ? "***" : value;
		if (!Array.isArray(value) && !isPlainRedactableObject(value)) return value;
		if (active.has(value)) return "[Circular]";
		active.add(value);
		let clone;
		let decodeFields = decode;
		if (Array.isArray(value)) clone = value.map((entry) => visit(entry, key, path, false, decodeFields));
		else {
			const entries = Object.entries(value);
			decodeFields ||= entries.some(([name, entry]) => name === "toJSON" && typeof entry === "function");
			clone = Object.fromEntries(entries.map(([name, entry]) => [name, visit(entry, name, [...path, name], objectPath, decodeFields)]));
		}
		if (decodeFields) decoded.add(clone);
		active.delete(value);
		return clone;
	};
	return {
		record: visit(record, "", [], true, false),
		decoded
	};
}
/** Converts native values once and applies configured and structural protection before output. */
function redactLogRecord(record, options, finish) {
	const finishMeasurement = startRedactionMeasurement("log-record");
	let outcome = "error";
	let inputChars;
	try {
		const resolved = resolveRedactOptions();
		const prepared = options.format === "console" ? {
			record,
			decoded: /* @__PURE__ */ new WeakSet()
		} : prepareFileToJsonReceivers(record, options.decodedOptions?.patterns ?? resolved.patterns);
		const ordinary = {
			structured: true,
			primitiveMask: false
		};
		const origins = {
			value: ordinary,
			children: /* @__PURE__ */ new Map()
		};
		const ancestors = [];
		const json = JSON.stringify(prepared.record, function(key, value) {
			while (ancestors.length > 0 && ancestors.at(-1)?.value !== this) ancestors.pop();
			const parent = ancestors.at(-1);
			const array = Array.isArray(this);
			const fieldKey = array && parent ? parent.key : key;
			const path = array && parent ? parent.path : parent ? [...parent.path, key] : [];
			const source = !parent ? prepared.record : parent.structured && options.format !== "console" ? Reflect.get(this, key) : value;
			const structured = (parent?.structured ?? true) && (source === null || typeof source !== "object" || !prepared.decoded.has(source) && source === value && (Array.isArray(source) || isPlainRedactableObject(source)));
			const primitiveMask = structured && [
				"number",
				"boolean",
				"bigint"
			].includes(typeof source) && classifyLogFieldProtection(fieldKey, path, !array, void 0) === "legacy";
			const circular = value !== null && typeof value === "object" && ancestors.some((frame) => frame.value === value);
			const emitted = circular ? "[Circular]" : typeof value === "bigint" ? String(value) : value;
			const container = emitted !== null && typeof emitted === "object";
			let node = origins;
			if (parent && parent.structured && (container || !structured || primitiveMask || circular)) {
				node = {
					value: {
						structured: structured && !circular,
						primitiveMask
					},
					children: /* @__PURE__ */ new Map()
				};
				parent.origins.children.set(key, node);
			} else if (parent) node = parent.origins;
			else origins.value = {
				structured,
				primitiveMask
			};
			if (container) ancestors.push({
				value: emitted,
				path,
				key: fieldKey,
				origins: node,
				structured
			});
			return emitted;
		});
		inputChars = json.length;
		let materialized = JSON.parse(json);
		const message = options.deriveMessage?.(materialized);
		if (message) {
			origins.children.set("message", {
				value: ordinary,
				children: /* @__PURE__ */ new Map()
			});
			if (Object.hasOwn(materialized, "message")) materialized.message = message.text;
			else {
				const entries = Object.entries(materialized);
				entries.splice(entries.findIndex(([key]) => key === "hostname") + 1, 0, ["message", message.text]);
				materialized = Object.fromEntries(entries);
			}
		}
		const serialized = message ? JSON.stringify(materialized) : json;
		const decodedPatterns = options.decodedOptions?.patterns ?? resolved.patterns;
		const result = finish(redactJsonRecord(serialized, origins, [[{ patterns: decodedPatterns }], [{ patterns: preparationPatterns }, {
			patterns: resolved.patterns,
			...resolved.patterns === defaultResolvedPatterns ? { couldMatch: couldMatchDefaultFullContextPatterns } : {}
		}]], prepareRedactionCapture, options.format === "console" ? () => [] : getLegacyFieldRecordEdits, (field) => getFieldRecordEdits(field, resolved.mode), (field) => getTextRecordEdits(field, resolved.mode, options.format !== "console"), (field, currentValue) => (options.format === "console" ? field.path.length === 1 && CONSOLE_STRUCTURAL_FIELDS.has(field.key) : !field.origin.structured || field.origin.primitiveMask || isPublicShareIdPath(field.path)) || decodedPatterns === defaultResolvedPatterns && !couldMatchDefaultFullContextPatterns(currentValue), message), message ? serialized : void 0);
		outcome = "ok";
		return result;
	} finally {
		finishMeasurement?.(outcome, inputChars);
	}
}
function redactLogRecordForTransport(record, options = {}) {
	return redactLogRecord(record, options, (redacted) => JSON.parse(redacted));
}
function serializeRedactedFileLogRecord(record, options = {}) {
	return redactLogRecord(record, options, (redacted, canonical) => redacted === canonical ? redacted : JSON.stringify(JSON.parse(redacted)));
}
//#endregion
export { isMissingPathError as _, serializeRedactedFileLogRecord as a, redactSensitiveUrlLikeString as c, resolveStateDir as d, getSealedRuntimeSecureTempRoot as f, hasErrnoCode as g, truncateUtf16Safe as h, resolveFileLogRedactOptions as i, readLoggingConfig as l, sliceUtf16Safe as m, redactSecrets as n, hasRegisteredSecretValuesForRedaction as o, escapeRegExp as p, redactSensitiveText as r, redactRegisteredSecretValues as s, redactLogRecordForTransport as t, loggingState as u };
