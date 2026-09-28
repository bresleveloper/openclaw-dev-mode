import { _ as materializePluginCacheError, l as getPluginCacheRoot, r as bindPluginCacheRoot } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import { a as resolveRootPathSync } from "./boundary-path-BzetEUdq.mjs";
import { c as readFileDescriptorBoundedSync } from "./boundary-file-read-D-Aa04On.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { n as openPluginRootFileSync } from "./path-safety-Cc0rrc_m.mjs";
import { i as readRegularFileSync } from "./regular-file-D4i0kJHS.mjs";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.mjs";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/plugins/plugin-cache-files.ts
const DEFAULT_PLUGIN_METADATA_MAX_BYTES = 16777216;
function entryKey(relativePath, rejectHardlinks) {
	return JSON.stringify([path.normalize(relativePath), rejectHardlinks]);
}
function enforceFileSize(entry, maxBytes) {
	if (entry.ok && maxBytes !== void 0 && Math.max(entry.signature.size, entry.contents.length) > maxBytes) return {
		ok: false,
		failure: {
			ok: false,
			reason: "validation",
			error: new FsSafeError("too-large", `File exceeds ${maxBytes} bytes: ${entry.path}`)
		}
	};
	return entry;
}
function pathFacts(targetPath) {
	const absolute = path.resolve(targetPath);
	const root = getPluginCacheRoot(path.dirname(absolute));
	const key = path.basename(absolute);
	let facts = root.paths.get(key);
	if (!facts) {
		facts = {};
		root.paths.set(key, facts);
	}
	return facts;
}
function pluginCacheExistsSync(targetPath) {
	const facts = pathFacts(targetPath);
	return facts.exists ??= fs.existsSync(targetPath);
}
function resolveRealpath(targetPath) {
	if (path.resolve(targetPath) === targetPath && pluginCacheRealpathSync(targetPath, true) === targetPath) return targetPath;
	return fs.realpathSync(targetPath);
}
function pluginCacheRealpathSync(targetPath, native = false) {
	const facts = pathFacts(targetPath);
	const key = native ? "nativeRealpath" : "realpath";
	if (facts[key] === void 0) try {
		facts[key] = native ? fs.realpathSync.native(targetPath) : resolveRealpath(targetPath);
		pathFacts(facts[key])[key] = facts[key];
	} catch {
		facts[key] = null;
	}
	return facts[key];
}
/** A trusted owner that changes permissions replaces its own observed stat. */
function refreshPluginCacheStat(targetPath) {
	pathFacts(targetPath).stat = void 0;
	return pluginCacheStatSync(targetPath);
}
function pluginCacheStatSync(targetPath, throwOnError = false) {
	const facts = pathFacts(targetPath);
	if (facts.stat === void 0) {
		facts.statError = void 0;
		try {
			facts.stat = fs.statSync(targetPath);
			facts.exists = true;
		} catch (error) {
			materializePluginCacheError(error);
			facts.statError = error;
			facts.stat = null;
		}
	}
	if (facts.stat === null && throwOnError) throw facts.statError;
	return facts.stat;
}
/** Final symlink checks must retain lstat facts separately from followed target stats. */
function pluginCacheLstatSync(targetPath) {
	const facts = pathFacts(targetPath);
	if (facts.lstat === void 0) try {
		facts.lstat = fs.lstatSync(targetPath);
	} catch {
		facts.lstat = null;
	}
	return facts.lstat;
}
function readPluginCacheDirectory(targetPath) {
	const root = getPluginCacheRoot(targetPath);
	if (!root.directory) try {
		root.directory = {
			ok: true,
			entries: fs.readdirSync(targetPath, { withFileTypes: true })
		};
	} catch (error) {
		materializePluginCacheError(error);
		root.directory = {
			ok: false,
			error
		};
	}
	if (!root.directory.ok) throw root.directory.error;
	return root.directory.entries;
}
/** Discovery validation is immutable metadata; actual imports validate their own file identity. */
function checkPluginCacheEntry(params) {
	let root = getPluginCacheRoot(params.rootDir);
	const key = entryKey(params.relativePath, params.rejectHardlinks);
	const cached = root.checkedEntries.get(key);
	if (cached) return cached;
	const absolutePath = path.resolve(params.rootDir, params.relativePath);
	let checked;
	if (!pluginCacheExistsSync(absolutePath)) try {
		const resolved = resolveRootPathSync({
			absolutePath,
			rootPath: params.rootDir,
			rootCanonicalPath: params.rootRealPath,
			boundaryLabel: "plugin package directory"
		});
		root = bindPluginCacheRoot(params.rootDir, resolved.rootCanonicalPath);
		checked = {
			ok: true,
			path: resolved.canonicalPath,
			rootRealPath: resolved.rootCanonicalPath,
			exists: false
		};
	} catch (error) {
		checked = {
			ok: false,
			reason: "validation",
			error
		};
	}
	else {
		const opened = openPluginRootFileSync({
			filePath: absolutePath,
			rootPath: params.rootDir,
			rootRealPath: params.rootRealPath,
			boundaryLabel: "plugin package directory",
			rejectHardlinks: params.rejectHardlinks
		});
		if (!opened.ok) checked = opened;
		else {
			fs.closeSync(opened.fd);
			root = bindPluginCacheRoot(params.rootDir, opened.rootRealPath);
			Object.assign(pathFacts(opened.path), {
				exists: true,
				stat: opened.stat
			});
			checked = {
				ok: true,
				path: opened.path,
				rootRealPath: opened.rootRealPath,
				exists: true
			};
		}
	}
	if (!checked.ok) materializePluginCacheError(checked.error);
	root.checkedEntries.set(key, checked);
	return checked;
}
/** Reads metadata once under its original boundary policy, including absence and invalid files. */
function readPluginCacheFile(params) {
	const lexicalRoot = path.resolve(params.rootDir);
	let root = getPluginCacheRoot(lexicalRoot);
	const maxBytes = params.maxBytes === null ? void 0 : params.maxBytes ?? DEFAULT_PLUGIN_METADATA_MAX_BYTES;
	const key = entryKey(params.relativePath, params.rejectHardlinks);
	const limitKey = JSON.stringify([key, maxBytes]);
	const strict = params.rejectHardlinks ? void 0 : root.files.get(entryKey(params.relativePath, true));
	const cached = root.files.get(key) ?? root.files.get(limitKey) ?? (strict?.ok ? strict : void 0);
	if (cached) return enforceFileSize(cached, maxBytes);
	const requestedPath = path.resolve(lexicalRoot, params.relativePath);
	const checked = root.checkedEntries.get(key);
	if (pathFacts(requestedPath).exists === false || checked && (!checked.ok || !checked.exists)) {
		const entry = {
			ok: false,
			failure: checked && !checked.ok ? checked : {
				ok: false,
				reason: "path"
			}
		};
		root.files.set(key, entry);
		return entry;
	}
	const canonicalRoot = params.rootRealPath ?? pluginCacheRealpathSync(lexicalRoot) ?? lexicalRoot;
	const canonicalCached = getPluginCacheRoot(canonicalRoot).files.get(key);
	if (canonicalCached?.ok) {
		bindPluginCacheRoot(lexicalRoot, canonicalRoot);
		return enforceFileSize(canonicalCached, maxBytes);
	}
	const absolutePath = path.resolve(canonicalRoot, params.relativePath);
	const opened = openPluginRootFileSync({
		filePath: absolutePath,
		rootRealPath: canonicalRoot,
		rootPath: canonicalRoot,
		boundaryLabel: "plugin root",
		rejectHardlinks: params.rejectHardlinks,
		maxBytes
	});
	let entry;
	if (!opened.ok) {
		entry = {
			ok: false,
			failure: opened
		};
		if (opened.reason === "path" && opened.error && typeof opened.error === "object" && "code" in opened.error && opened.error.code === "ENOENT") {
			pathFacts(requestedPath).exists = false;
			pathFacts(absolutePath).exists = false;
		}
	} else {
		root = bindPluginCacheRoot(lexicalRoot, opened.rootRealPath);
		try {
			const contents = maxBytes === void 0 ? fs.readFileSync(opened.fd) : readFileDescriptorBoundedSync(opened.fd, maxBytes);
			entry = {
				ok: true,
				path: opened.path,
				rootRealPath: opened.rootRealPath,
				contents,
				hash: crypto.createHash("sha256").update(contents).digest("hex"),
				signature: {
					size: opened.stat.size,
					mtimeMs: opened.stat.mtimeMs,
					ctimeMs: opened.stat.ctimeMs
				}
			};
			Object.assign(pathFacts(absolutePath), {
				exists: true,
				stat: opened.stat
			});
			root.checkedEntries.set(key, {
				ok: true,
				path: opened.path,
				rootRealPath: opened.rootRealPath,
				exists: true
			});
		} catch (error) {
			entry = {
				ok: false,
				failure: {
					ok: false,
					reason: "io",
					error
				},
				failurePhase: "read"
			};
		} finally {
			fs.closeSync(opened.fd);
		}
	}
	if (!entry.ok) materializePluginCacheError(entry.failure.error);
	root.files.set(entry.ok ? key : limitKey, entry);
	return entry;
}
/** Catalog files retain the regular-file policy, which rejects final symlinks but allows hardlinks. */
function readPluginCacheRegularFile(params) {
	const absolutePath = path.resolve(params.filePath);
	const lexicalRoot = path.dirname(absolutePath);
	const canonicalRoot = pluginCacheRealpathSync(lexicalRoot) ?? lexicalRoot;
	const root = bindPluginCacheRoot(lexicalRoot, canonicalRoot);
	const filename = path.basename(absolutePath);
	const key = JSON.stringify(["regular", filename]);
	const limitKey = JSON.stringify([
		"regular",
		filename,
		params.maxBytes
	]);
	let entry = root.files.get(key) ?? root.files.get(limitKey);
	if (!entry && pathFacts(absolutePath).exists === false) {
		entry = {
			ok: false,
			failure: {
				ok: false,
				reason: "path"
			}
		};
		root.files.set(key, entry);
	}
	if (!entry) try {
		const { buffer: contents, stat } = readRegularFileSync({
			filePath: absolutePath,
			maxBytes: params.maxBytes
		});
		entry = {
			ok: true,
			path: path.join(canonicalRoot, filename),
			rootRealPath: canonicalRoot,
			contents,
			hash: crypto.createHash("sha256").update(contents).digest("hex"),
			signature: {
				size: stat.size,
				mtimeMs: stat.mtimeMs,
				ctimeMs: stat.ctimeMs
			}
		};
		Object.assign(pathFacts(absolutePath), {
			exists: true,
			stat
		});
		root.files.set(key, entry);
	} catch (error) {
		materializePluginCacheError(error);
		entry = {
			ok: false,
			failure: {
				ok: false,
				reason: "io",
				error
			}
		};
		root.files.set(error instanceof FsSafeError && error.code === "too-large" ? limitKey : key, entry);
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") pathFacts(absolutePath).exists = false;
	}
	if (entry.ok && params.maxBytes !== void 0 && Math.max(entry.signature.size, entry.contents.length) > params.maxBytes) return {
		ok: false,
		failure: {
			ok: false,
			reason: "io",
			error: new FsSafeError("too-large", `File exceeds ${params.maxBytes} bytes: ${absolutePath}`)
		}
	};
	return entry;
}
function readPluginCacheJsonFile(filePath, options = {}) {
	const file = readPluginCacheRegularFile({
		filePath,
		...options
	});
	return file.ok ? parsePluginCacheJson(file) : {
		ok: false,
		error: file.failure.error
	};
}
function parsePluginCacheJson(file, options = {}) {
	const key = options.json5 ? "json5" : "json";
	if (!file[key]) try {
		const source = file.contents.toString("utf8");
		file[key] = {
			ok: true,
			value: options.json5 ? parseJsonWithJson5Fallback(source) : JSON.parse(source)
		};
	} catch (error) {
		materializePluginCacheError(error);
		file[key] = {
			ok: false,
			error
		};
	}
	return file[key];
}
//#endregion
//#region src/plugins/package-manifest.ts
const DEFAULT_PLUGIN_ENTRY_CANDIDATES = [
	"index.ts",
	"index.js",
	"index.mjs",
	"index.cjs"
];
function getPackageManifestMetadata(manifest) {
	if (!manifest) return;
	return manifest[MANIFEST_KEY];
}
/** Package authoring metadata names source; the runtime manifest names only built assets. */
function controlUiSource(packageManifest) {
	const source = isRecord(packageManifest.openclaw) ? packageManifest.openclaw.controlUi : void 0;
	if (source === void 0) return;
	if (typeof source !== "string" || !source.trim()) throw new Error("package.json openclaw.controlUi must name a browser source entrypoint.");
	return source;
}
function resolvePackageExtensionEntries(manifest) {
	const rawOpenClaw = manifest?.[MANIFEST_KEY];
	if (rawOpenClaw === void 0 || rawOpenClaw === null) return {
		status: "missing",
		entries: []
	};
	if (!isRecord(rawOpenClaw)) return {
		status: "invalid",
		entries: [],
		error: "package.json openclaw must be an object"
	};
	const raw = rawOpenClaw.extensions;
	if (raw === void 0 || raw === null) return {
		status: "missing",
		entries: []
	};
	if (!Array.isArray(raw)) return {
		status: "invalid",
		entries: [],
		error: "package.json openclaw.extensions must be an array"
	};
	const entries = [];
	for (const [index, entry] of raw.entries()) {
		const normalized = normalizeOptionalString(entry);
		if (!normalized) return {
			status: "invalid",
			entries: [],
			error: `package.json openclaw.extensions[${index}] must be a non-empty string`
		};
		entries.push(normalized);
	}
	if (entries.length === 0) return {
		status: "empty",
		entries: []
	};
	return {
		status: "ok",
		entries
	};
}
//#endregion
export { checkPluginCacheEntry as a, pluginCacheLstatSync as c, readPluginCacheDirectory as d, readPluginCacheFile as f, resolvePackageExtensionEntries as i, pluginCacheRealpathSync as l, refreshPluginCacheStat as m, controlUiSource as n, parsePluginCacheJson as o, readPluginCacheJsonFile as p, getPackageManifestMetadata as r, pluginCacheExistsSync as s, DEFAULT_PLUGIN_ENTRY_CANDIDATES as t, pluginCacheStatSync as u };
