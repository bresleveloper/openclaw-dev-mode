import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as isPlainObject } from "./plain-object-BFvGATnd.mjs";
import { o as openRootFileSync, t as canUseRootFileOpen } from "./boundary-file-read-CCth2Hwg.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as mergeDeep } from "./deep-merge-B-AVx-Uc.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isPathInside as isPathInside$1, isPathInsideWithRealpath as isPathInsideWithRealpath$1 } from "@openclaw/fs-safe/path";
//#region src/security/scan-paths.ts
/** Return true for extension paths intentionally skipped by source scanners. */
function extensionUsesSkippedScannerPath(entry) {
	return entry.split(/[\\/]+/).filter(Boolean).some((segment) => segment === "node_modules" || segment.startsWith(".") && segment !== "." && segment !== "..");
}
//#endregion
//#region src/config/includes.ts
/**
* Config includes: $include directive for modular configs
*
* @example
* ```json5
* {
*   "$include": "./base.json5",           // single file
*   "$include": ["./a.json5", "./b.json5"] // merge multiple
* }
* ```
*/
const INCLUDE_KEY = "$include";
const MAX_INCLUDE_FILE_BYTES = 2097152;
/** Maximum length for $include path and resolved path (CWE-22 hardening). */
const MAX_INCLUDE_PATH_LENGTH = 4096;
function hashConfigIncludeRaw(raw) {
	const hash = crypto.createHash("sha256");
	if (raw === null) hash.update("missing");
	else {
		hash.update("present\0");
		hash.update(raw, "utf-8");
	}
	return hash.digest("hex");
}
/** Resolve an include write target through its current ancestors and allowed roots. */
function resolveConfigIncludeWritePath(params) {
	const resolvedPath = path.normalize(path.resolve(params.includePath));
	const roots = [path.dirname(params.configPath), ...params.allowedRoots ?? []].filter((root) => path.isAbsolute(root)).map((root) => path.normalize(root));
	if (!roots.some((root) => isPathInside$1(root, resolvedPath))) throw new ConfigIncludeError(`Include write path escapes config directory: ${params.includePath}`, params.includePath);
	const canonicalPath = path.normalize(resolvePathViaExistingAncestorSync(resolvedPath));
	if (!roots.map((root) => path.normalize(safeRealpath(root))).some((root) => isPathInside$1(root, canonicalPath))) throw new ConfigIncludeError(`Include write path resolves outside config directory (symlink): ${params.includePath}`, params.includePath);
	return canonicalPath;
}
/**
* Whether an include target canonically resolves inside the config directory.
* Write eligibility must use the canonical form: a symlink beneath the config
* directory can point at an external OPENCLAW_INCLUDE_ROOTS file that reads
* accept but the guarded include writer rejects.
*/
function isInternalIncludeWriteTarget(params) {
	const resolvedPath = path.normalize(path.resolve(params.includePath));
	const configDir = path.normalize(path.dirname(path.resolve(params.configPath)));
	if (!isPathInside$1(configDir, resolvedPath)) return false;
	const canonicalPath = path.normalize(resolvePathViaExistingAncestorSync(resolvedPath));
	const canonicalDir = path.normalize(resolvePathViaExistingAncestorSync(configDir));
	return isPathInside$1(canonicalDir, canonicalPath);
}
function isConfigContainer(value) {
	return Array.isArray(value) || isPlainObject(value);
}
function includeLogicalPath(link) {
	const parts = [];
	for (let current = link; current; current = current.parent) parts.push(current.key);
	return parts.toReversed();
}
var ConfigIncludeError = class extends Error {
	constructor(message, includePath, cause) {
		super(message);
		this.includePath = includePath;
		this.cause = cause;
		this.name = "ConfigIncludeError";
	}
};
/** File access failed; the included configuration has not been validated. */
var ConfigIncludeReadError = class extends ConfigIncludeError {
	constructor(..._args) {
		super(..._args);
		this.name = "ConfigIncludeReadError";
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
var IncludeProcessor = class {
	constructor(basePath, resolver, boundary, rootProjectionKeys) {
		this.basePath = basePath;
		this.resolver = resolver;
		this.boundary = boundary;
		this.rootProjectionKeys = rootProjectionKeys;
	}
	get rootDir() {
		return this.boundary.configRoot.rootDir;
	}
	process(obj) {
		const stack = [];
		let current = this.traverseValue(obj, null, false, {
			basePath: this.basePath,
			visited: /* @__PURE__ */ new Set([path.normalize(this.basePath)]),
			depth: 0
		});
		let delivered = void 0;
		for (;;) {
			const step = current.next(delivered);
			if (step.done) {
				const parent = stack.pop();
				if (!parent) return step.value;
				delivered = step.value;
				current = parent;
				continue;
			}
			stack.push(current);
			current = this.traverseValue(step.value.value, step.value.pathLink, step.value.hasArrayAncestor, step.value.context);
		}
	}
	*traverseValue(value, pathLink, hasArrayAncestor, context) {
		if (Array.isArray(value)) {
			const result = [];
			for (const [index, item] of value.entries()) result.push(isConfigContainer(item) ? yield {
				value: item,
				pathLink: {
					parent: pathLink,
					key: String(index)
				},
				hasArrayAncestor: true,
				context
			} : item);
			return result;
		}
		if (!isPlainObject(value)) return value;
		if (!("$include" in value)) {
			const isRoot = pathLink === null;
			const result = {};
			for (const [key, entry] of Object.entries(value)) {
				if (isRoot && this.rootProjectionKeys && !this.rootProjectionKeys.has(key)) continue;
				result[key] = isConfigContainer(entry) ? yield {
					value: entry,
					pathLink: {
						parent: pathLink,
						key
					},
					hasArrayAncestor,
					context
				} : entry;
			}
			return result;
		}
		return yield* this.traverseInclude(value, pathLink, hasArrayAncestor, context);
	}
	*traverseInclude(obj, pathLink, hasArrayAncestor, context) {
		const includeValue = obj[INCLUDE_KEY];
		const isRoot = pathLink === null;
		const siblingKeys = Object.keys(obj).filter((key) => key !== "$include" && (!isRoot || !this.rootProjectionKeys || this.rootProjectionKeys.has(key)));
		const multiple = Array.isArray(includeValue);
		if (!multiple && typeof includeValue !== "string") throw new ConfigIncludeError(`Invalid $include value: expected string or array of strings, got ${typeof includeValue}`, String(includeValue));
		const entries = [];
		for (const item of multiple ? includeValue : [includeValue]) {
			if (typeof item !== "string") throw new ConfigIncludeError(`Invalid $include array item: expected string, got ${typeof item}`, String(item));
			const loaded = this.loadFileSync(item, context);
			entries.push({
				value: yield {
					value: loaded.parsed,
					pathLink,
					hasArrayAncestor,
					context: loaded.nestedContext
				},
				targetPath: loaded.resolvedPath
			});
		}
		const included = multiple ? entries.reduce((current, entry) => deepMerge(current, entry.value), {}) : entries[0].value;
		this.resolver.onIncludeResolved?.({
			path: includeLogicalPath(pathLink),
			value: included,
			kind: multiple ? "multiple" : "single",
			hasSiblingOverrides: siblingKeys.length > 0,
			hasArrayAncestor,
			...multiple ? { targetPaths: entries.map((entry) => entry.targetPath) } : { targetPath: entries[0].targetPath }
		});
		if (siblingKeys.length === 0) return included;
		if (!isPlainObject(included)) throw new ConfigIncludeError("Sibling keys require included content to be an object", typeof includeValue === "string" ? includeValue : INCLUDE_KEY);
		const rest = {};
		for (const key of siblingKeys) {
			const sibling = obj[key];
			rest[key] = isConfigContainer(sibling) ? yield {
				value: sibling,
				pathLink: {
					parent: pathLink,
					key
				},
				hasArrayAncestor,
				context
			} : sibling;
		}
		return deepMerge(included, rest);
	}
	loadFileSync(includePath, context) {
		const { resolvedPath, root } = this.resolvePath(includePath, context);
		if (context.visited.has(resolvedPath)) throw new CircularIncludeError([...context.visited, resolvedPath]);
		if (context.depth >= 10) throw new ConfigIncludeError(`Maximum include depth (10) exceeded at: ${includePath}`, includePath);
		const raw = this.readFile(includePath, resolvedPath, root);
		return {
			parsed: this.parseFile(includePath, resolvedPath, raw),
			resolvedPath,
			nestedContext: {
				basePath: resolvedPath,
				visited: /* @__PURE__ */ new Set([...context.visited, resolvedPath]),
				depth: context.depth + 1
			}
		};
	}
	resolvePath(includePath, context) {
		if (includePath.includes("\0")) throw new ConfigIncludeError("Include path must not contain null bytes", includePath);
		if (includePath.length >= MAX_INCLUDE_PATH_LENGTH) throw new ConfigIncludeError(`Include path exceeds maximum length (${MAX_INCLUDE_PATH_LENGTH} characters)`, includePath);
		const configDir = path.dirname(context.basePath);
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
			throw new ConfigIncludeReadError(`Failed to resolve include file realpath: ${includePath} (resolved: ${normalized})`, includePath, err instanceof Error ? err : void 0);
		}
	}
	findContainingRoot(candidate, field) {
		if (isPathInside$1(this.boundary.configRoot[field], candidate)) return this.boundary.configRoot;
		for (const root of this.boundary.allowedRoots) if (isPathInside$1(root[field], candidate)) return root;
		return null;
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
			throw new ConfigIncludeReadError(`Failed to read include file: ${includePath} (resolved: ${resolvedPath})`, includePath, err instanceof Error ? err : void 0);
		}
	}
	parseFile(includePath, resolvedPath, raw) {
		try {
			return this.resolver.parseJson(raw);
		} catch (err) {
			throw new ConfigIncludeError(`Failed to parse include file: ${includePath} (resolved: ${resolvedPath})`, includePath, err instanceof Error ? err : void 0);
		}
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
		throw new ConfigIncludeReadError(`Failed to read include file: ${params.includePath} (resolved: ${params.resolvedPath})`, params.includePath, opened.error instanceof Error ? opened.error : void 0);
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
	readFileWithGuards: readConfigIncludeFileWithGuards,
	parseJson: parseJsonWithJson5Fallback
};
/**
* Creates a resolver that shares one immutable root snapshot across independent
* include resolutions. Used when callers must isolate malformed sibling graphs.
*/
function createConfigIncludeResolutionSession(configPath, allowedRoots = []) {
	const boundary = createConfigIncludeBoundary(configPath, allowedRoots);
	return (obj, basePath, resolver = defaultResolver) => new IncludeProcessor(basePath, resolver, boundary).process(obj);
}
/**
* Resolves all $include directives in a parsed config object.
*/
function resolveConfigIncludes(obj, configPath, resolver = defaultResolver, options = {}) {
	return new IncludeProcessor(configPath, resolver, createConfigIncludeBoundary(configPath, options.allowedRoots ?? [])).process(obj);
}
/**
* Resolves one top-level config field through the canonical include graph while
* leaving unrelated top-level branches untouched. Early bootstrap readers use
* this when a malformed sibling must not hide an independently valid setting.
*/
function resolveConfigIncludesForTopLevelKey(obj, configPath, key, resolver = defaultResolver, options = {}) {
	return new IncludeProcessor(configPath, resolver, createConfigIncludeBoundary(configPath, options.allowedRoots ?? []), /* @__PURE__ */ new Set([key])).process(obj);
}
//#endregion
export { createConfigIncludeResolutionSession as a, readConfigIncludeFileWithGuards as c, resolveConfigIncludesForTopLevelKey as d, extensionUsesSkippedScannerPath as f, INCLUDE_KEY as i, resolveConfigIncludeWritePath as l, isPathInsideWithRealpath$1 as m, ConfigIncludeError as n, hashConfigIncludeRaw as o, isPathInside$1 as p, ConfigIncludeReadError as r, isInternalIncludeWriteTarget as s, CircularIncludeError as t, resolveConfigIncludes as u };
