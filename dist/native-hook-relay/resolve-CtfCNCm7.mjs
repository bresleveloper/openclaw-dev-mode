import { i as extractErrorCode } from "./error-coercion-DKQY4wyF.mjs";
import { D as isRecord, S as resolveGlobalSingleton, T as asOptionalRecord, a as asPositiveFiniteNumber, g as normalizeLowercaseStringOrEmpty, i as asNonNegativeFiniteNumber, m as resolvePositiveTimerTimeoutMs, r as asFiniteNumber, s as asSafeIntegerInRange, v as normalizeOptionalLowercaseString, w as asOptionalObjectRecord, y as normalizeOptionalString } from "./number-coercion-CmpLVzZ6.mjs";
import { C as getProcessPluginCache, D as materializePluginCacheError, E as invalidatePluginCacheMetadata, R as isSqliteLockError, S as getPluginCacheRoot, T as getScopedPluginCaches, _ as resolveOpenClawPackageRootSync, b as getPluginCache, g as resolveCompatibilityHostVersion, k as getPluginExecutionFrame, v as PluginCacheFactInvalidatedError, w as getScopedPluginCache, x as getPluginCacheRetirementSignal, y as bindPluginCacheRoot } from "./sqlite-user-version-C7PVO8Wf.mjs";
import { a as normalizeWindowsPathPreservingCase, d as resolveUserPath, f as tryProcessCwd, i as normalizeWindowsPathForComparison$1, n as isNotFoundPathError, o as resolveConfigDir, r as isPathInside$2 } from "./utils-BfTq4rUg.mjs";
import { $ as secretRefKey, A as hasErrnoCode, D as parseJsonWithJson5Fallback, F as resolveRootPathSync, I as matchRootFileOpenFailure, J as SINGLE_VALUE_FILE_REF_ID, L as openRootFileSync, M as isMissingPathError, P as resolvePathViaExistingAncestorSync$1, Q as resolveSecretRefProviderSourceMismatch, X as isValidSecretProviderAlias, Y as isBuiltInDefaultSecretProviderRef, Z as normalizeAndGroupSecretRefs, _ as resolveIsNixMode, l as registerSecretValueForRedaction, nt as parseConfigPathArrayIndex, q as ENV_SECRET_REF_ID_RE, r as redactSensitiveText, rt as isBlockedObjectKey$1, st as expectDefined, v as resolveStateDir, y as isVitestRuntimeEnv, z as readFileDescriptorBoundedSync$1 } from "./redact-TLu2QTmL.mjs";
import { a as executeExistingOpenClawStateRead, c as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, f as isDeeplyFrozenPlainData, i as listAgentIds, l as withExistingOpenClawStateDatabaseReadOnly, o as getActiveOpenClawStateDatabaseReadSnapshot, r as resolveAgentWorkspaceDir, s as isArtifactPreservingStateRead, x as safeParseJson } from "./openclaw-state-db-Bj56_1ny.mjs";
import { a as normalizeTrimmedStringList, c as normalizeUniqueTrimmedStringList, i as normalizeStringEntries, l as sortUniqueStrings, n as normalizeOptionalTrimmedStringList, o as normalizeUniqueSingleOrTrimmedStringList, r as normalizeSortedUniqueTrimmedStringList, t as normalizeArrayBackedTrimmedStringList, u as uniqueStrings } from "./string-normalization-C9v1UMOm.mjs";
import { n as formatErrorMessageWithCode, t as formatErrorMessage } from "./errors-BwnhmTMH.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D1QtF7Ci.mjs";
import { L as executeSqliteQuerySync, R as executeSqliteQueryTakeFirstSync, z as getNodeSqliteKysely } from "./openclaw-state-db-schema-migration-required-DtltEO1E.mjs";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import { s as tableExists } from "./openclaw-state-db-schema-version-CNeUiDjx.mjs";
import { r as sha256Hex } from "./crypto-digest-DFe1GlHl.mjs";
import { r as getOrCreatePromise } from "./lazy-promise-DLFIcwoO.mjs";
import { o as isTruthyEnvValue } from "./host-env-security-Dgi-NhWK.mjs";
import { et as compareOpenClawVersions, z as decodeMountInfoPath } from "./openclaw-state-db-cache-BjVpQwyn.mjs";
import { n as readSecureFile, t as FsSafeError } from "./fs-safe-JcIGlJ4o.mjs";
import { _ as MANIFEST_KEY, h as resolveOfficialExternalPluginId, o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-BYyeyJUb.mjs";
import { a as isPrereleaseResolutionAllowed, i as resolveOfficialExternalPluginLegacyIds, o as parseRegistryNpmSpec, r as resolveOfficialExternalPluginInstall, s as BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES, t as getOfficialExternalPluginCatalogEntryForPackage } from "./official-external-plugin-catalog-BvaPRPMo.mjs";
import { B as number, F as array, H as strictObject, I as boolean, J as isStateDatabaseReadAdmissionInvalidatedError, R as literal, U as string, V as object, W as union, _ as acquireSqliteStagingToken, g as SQLITE_STAGING_TOKEN_FILES, st as throwSqliteLifecycleErrors } from "./sqlite-readonly-location-cleanup-CmRNKiuM.mjs";
import { o as sanitizeForLog, t as createSubsystemLogger } from "./subsystem-M2sQt_up.mjs";
import { t as resolveRuntimeArgs } from "./runtime-worker-url-QXcu2VO1.mjs";
import { c as SecretStoreValidationError, s as SECRET_STORE_VALUE_MAX_BYTES } from "./sqlite-worker-transfer-DphMZ7LJ.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import "./openclaw-state-worker-store-DJL0WCzh.mjs";
import { t as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-DzNKG4ET.mjs";
import "./temp-artifact-cleanup-ClhKIDFh.mjs";
import { i as resolvePluginSourceCapturesDirectory, n as isLegacyPluginSourceCaptureName, r as resolvePluginSourceCaptureFallbackPrefix, t as PLUGIN_SOURCE_CAPTURE_PREFIX } from "./plugin-source-capture-path-DrCyVB7i.mjs";
import { t as runCommandWithTimeout } from "./exec-B7W00oZE.mjs";
import { createRequire } from "node:module";
import fsSync, { lstatSync, realpathSync } from "node:fs";
import path from "node:path";
import os, { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import crypto, { randomBytes, randomUUID } from "node:crypto";
import { formatPosixMode, readRegularFileSync, safePathSegmentHashed } from "@openclaw/fs-safe/advanced";
import { AsyncLocalStorage } from "node:async_hooks";
import { isPathInside, safeStatSync } from "@openclaw/fs-safe/path";
import fs from "node:fs/promises";
import { prerelease, satisfies, valid } from "semver";
import "node:buffer";
import { tryReadJsonSync } from "@openclaw/fs-safe/json";
import "commander";
import "@openclaw/fs-safe/atomic";
import pMap from "p-map";
import { inspectPathPermissions, safeStat } from "@openclaw/fs-safe/permissions";
//#region packages/normalization-core/src/stable-stringify.ts
const preserveString = (value) => value;
/** Deterministically stringifies values, optionally normalizing strings before key ordering. */
function stableStringify(value, normalizeString = preserveString) {
	return stringifyStableValue(value, /* @__PURE__ */ new WeakSet(), normalizeString);
}
function stringifyStableValue(value, stack, normalizeString, write) {
	if (value === null || value === void 0) return String(value);
	if (typeof value === "number" && !Number.isFinite(value)) return JSON.stringify(String(value));
	if (typeof value === "bigint") return JSON.stringify(value.toString());
	if (typeof value === "string") return JSON.stringify(normalizeString(value));
	if (typeof value !== "object") return JSON.stringify(value) ?? "null";
	if (stack.has(value)) return JSON.stringify("[Circular]");
	stack.add(value);
	try {
		return stringifyObjectValue(value, stack, normalizeString, write);
	} finally {
		stack.delete(value);
	}
}
function stringifyObjectValue(value, stack, normalizeString, write) {
	if (value instanceof Error) return stringifyStableValue({
		name: value.name,
		message: value.message,
		stack: value.stack
	}, stack, normalizeString, write);
	if (value instanceof Uint8Array) return stringifyStableValue({
		type: "Uint8Array",
		data: encodeBase64(value)
	}, stack, normalizeString, write);
	if (Array.isArray(value)) {
		if (write) {
			write("[");
			let separator = "";
			for (const entry of value) {
				write(separator);
				write(stringifyStableValue(entry, stack, normalizeString, write));
				separator = ",";
			}
			write("]");
			return "";
		}
		const serializedEntries = [];
		for (const entry of value) serializedEntries.push(stringifyStableValue(entry, stack, normalizeString));
		return `[${serializedEntries.join(",")}]`;
	}
	const record = value;
	const keys = Object.keys(record);
	const fields = normalizeString === preserveString ? keys.sort() : keys.map((key) => ({
		key,
		normalizedKey: normalizeString(key)
	})).sort((left, right) => {
		return compareStableStrings(left.normalizedKey, right.normalizedKey) || compareStableStrings(left.key, right.key);
	});
	write?.("{");
	const serializedFields = normalizeString === preserveString ? keys : [];
	let separator = "";
	let fieldIndex = 0;
	for (const field of fields) {
		const key = typeof field === "string" ? field : field.key;
		const prefix = `${JSON.stringify(typeof field === "string" ? field : field.normalizedKey)}:`;
		if (write) {
			write(`${separator}${prefix}`);
			write(stringifyStableValue(record[key], stack, normalizeString, write));
			separator = ",";
		} else serializedFields[fieldIndex++] = `${prefix}${stringifyStableValue(record[key], stack, normalizeString)}`;
	}
	if (write) {
		write("}");
		return "";
	}
	return `{${serializedFields.join(",")}}`;
}
function encodeBase64(value) {
	let binary = "";
	for (const byte of value) binary += String.fromCharCode(byte);
	return btoa(binary);
}
function compareStableStrings(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
}
//#endregion
//#region src/plugins/path-safety.ts
/** Plugin-local re-export of shared path safety helpers for plugin install/runtime code. */
function canProbeWindowsPhysicalAlias(rootPath, targetPath) {
	const driveRoot = /^(?:[\\/]{2}[?.][\\/])?[A-Za-z]:[\\/]/.exec(targetPath)?.[0];
	if (driveRoot) return isPathInside(driveRoot, targetPath);
	const normalizedRoot = normalizeWindowsPathPreservingCase(rootPath);
	const probeRoot = isPathInside(rootPath, normalizedRoot) && isPathInside(normalizedRoot, rootPath) ? path.win32.parse(normalizedRoot).root || normalizedRoot : rootPath;
	return isPathInside(probeRoot, targetPath);
}
/** Resolves matching physical spellings when Windows presents one tree through different aliases. */
function resolvePhysicalPathInsideRootSync(rootPath, targetPath) {
	if (process.platform !== "win32") return;
	try {
		if (!canProbeWindowsPhysicalAlias(rootPath, targetPath) && !canProbeWindowsPhysicalAlias(fsSync.realpathSync(rootPath), targetPath)) return;
		const root = fsSync.statSync(rootPath, { bigint: true });
		if (!root.isDirectory() || root.ino === 0n) return;
		let current = path.resolve(targetPath);
		while (true) {
			const candidate = fsSync.statSync(current, { bigint: true });
			if (candidate.dev === root.dev && candidate.ino === root.ino) {
				const physicalRoot = fsSync.realpathSync(current);
				return {
					rootPath: physicalRoot,
					targetPath: path.resolve(physicalRoot, path.relative(current, targetPath)),
					rootIdentity: Object.freeze({
						dev: root.dev,
						ino: root.ino
					})
				};
			}
			const parent = path.dirname(current);
			if (parent === current) return;
			current = parent;
		}
	} catch {
		return;
	}
}
function isPathInside$1(rootPath, targetPath) {
	return isPathInside(rootPath, targetPath) || resolvePhysicalPathInsideRootSync(rootPath, targetPath) !== void 0;
}
function createIdentityBoundRootFileFs(rootPath, expected) {
	const lstatSync = ((...args) => {
		const stat = Reflect.apply(fsSync.lstatSync, fsSync, args);
		if (args[0] === rootPath) {
			const dev = typeof stat.dev === "bigint" ? stat.dev : BigInt(stat.dev);
			const ino = typeof stat.ino === "bigint" ? stat.ino : BigInt(stat.ino);
			if (!stat.isDirectory() || dev !== expected.dev || ino !== expected.ino) throw new FsSafeError("path-mismatch", "plugin root identity changed during alias reconciliation");
		}
		return stat;
	});
	return {
		closeSync: fsSync.closeSync,
		constants: fsSync.constants,
		fstatSync: fsSync.fstatSync,
		lstatSync,
		openSync: fsSync.openSync,
		readFileSync: fsSync.readFileSync,
		realpathSync: fsSync.realpathSync
	};
}
/** Opens a plugin artifact after reconciling Windows root aliases. */
function openPluginRootFileSync(params) {
	const admittedRoot = params.rootRealPath ?? params.rootPath;
	const physical = isPathInside(admittedRoot, params.filePath) ? void 0 : resolvePhysicalPathInsideRootSync(admittedRoot, params.filePath);
	return openRootFileSync({
		absolutePath: physical?.targetPath ?? params.filePath,
		rootPath: physical?.rootPath ?? params.rootPath,
		rootRealPath: physical?.rootPath ?? params.rootRealPath,
		boundaryLabel: params.boundaryLabel ?? "plugin root",
		rejectHardlinks: params.rejectHardlinks,
		maxBytes: params.maxBytes,
		skipLexicalRootCheck: physical ? true : void 0,
		ioFs: physical ? createIdentityBoundRootFileFs(physical.rootPath, physical.rootIdentity) : void 0
	});
}
//#endregion
//#region src/plugins/plugin-cache-files.ts
const DEFAULT_PLUGIN_METADATA_MAX_BYTES = 16777216;
function capturedPluginFile(filePath, rootRealPath, contents, stat) {
	return {
		ok: true,
		path: filePath,
		rootRealPath,
		contents,
		hash: crypto.createHash("sha256").update(contents).digest("hex"),
		signature: {
			size: stat.size,
			mtimeMs: stat.mtimeMs,
			ctimeMs: stat.ctimeMs
		}
	};
}
function entryKey(relativePath, rejectHardlinks) {
	return JSON.stringify([path.normalize(relativePath), rejectHardlinks]);
}
function enforceFileSize(entry, maxBytes, reason = "validation", filePath) {
	if (entry.ok && maxBytes !== void 0 && Math.max(entry.signature.size, entry.contents.length) > maxBytes) return {
		ok: false,
		failure: {
			ok: false,
			reason,
			error: new FsSafeError("too-large", `File exceeds ${maxBytes} bytes: ${filePath ?? entry.path}`)
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
	return facts.exists ??= fsSync.existsSync(targetPath);
}
function resolveRealpath(targetPath) {
	if (path.resolve(targetPath) === targetPath && pluginCacheRealpathSync(targetPath, true) === targetPath) return targetPath;
	return fsSync.realpathSync(targetPath);
}
function pluginCacheRealpathSync(targetPath, native = false) {
	const facts = pathFacts(targetPath);
	const key = native ? "nativeRealpath" : "realpath";
	if (facts[key] === void 0) try {
		facts[key] = native ? fsSync.realpathSync.native(targetPath) : resolveRealpath(targetPath);
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
			facts.stat = fsSync.statSync(targetPath);
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
		facts.lstat = fsSync.lstatSync(targetPath);
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
			entries: fsSync.readdirSync(targetPath, { withFileTypes: true })
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
			fsSync.closeSync(opened.fd);
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
			const contents = maxBytes === void 0 ? fsSync.readFileSync(opened.fd) : readFileDescriptorBoundedSync$1(opened.fd, maxBytes);
			entry = capturedPluginFile(opened.path, opened.rootRealPath, contents, opened.stat);
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
			fsSync.closeSync(opened.fd);
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
		entry = capturedPluginFile(path.join(canonicalRoot, filename), canonicalRoot, contents, stat);
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
	return enforceFileSize(entry, params.maxBytes, "io", absolutePath);
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
//#region src/plugins/package-entrypoints.ts
const PUBLIC_SURFACE_SOURCE_EXTENSIONS = [
	".ts",
	".mts",
	".js",
	".mjs",
	".cts",
	".cjs"
];
/** True when a package entrypoint needs built JavaScript candidates. */
function isTypeScriptPackageEntry(entryPath) {
	return [
		".ts",
		".tsx",
		".mts",
		".cts"
	].includes(path.extname(entryPath).toLowerCase());
}
/** Lists built runtime entry candidates for a TypeScript package entrypoint. */
function listBuiltRuntimeEntryCandidates(entryPath) {
	if (!isTypeScriptPackageEntry(entryPath)) return [];
	const normalized = entryPath.replace(/\\/g, "/");
	const withoutExtension = normalized.replace(/\.[^.]+$/u, "");
	const normalizedRelative = withoutExtension.replace(/^\.\//u, "");
	const distWithoutExtension = normalizedRelative.startsWith("src/") ? `./dist/${normalizedRelative.slice(4)}` : `./dist/${normalizedRelative}`;
	const sourceExtension = path.extname(normalized).toLowerCase();
	const outputExtensions = sourceExtension === ".mts" ? [
		".mjs",
		".js",
		".cjs"
	] : sourceExtension === ".cts" ? [
		".cjs",
		".js",
		".mjs"
	] : [
		".js",
		".mjs",
		".cjs"
	];
	return [
		distWithoutExtension,
		...normalizedRelative.startsWith("src/") ? [`./dist/${normalizedRelative}`] : [],
		withoutExtension
	].flatMap((basePath) => outputExtensions.map((extension) => `${basePath}${extension}`));
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
	return manifest?.[MANIFEST_KEY];
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
//#region src/plugins/plugin-runtime-artifact-selection.ts
/** Built hosts default only checkout plugins to compiled execution, not installed packages. */
function resolvePluginRuntimeArtifactPreference(preferBuiltPluginArtifacts) {
	if (preferBuiltPluginArtifacts !== void 0) return preferBuiltPluginArtifacts ? "all" : "source";
	return /\.[cm]?js$/.test(new URL(import.meta.url).pathname) ? "bundled" : "source";
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
		fsSync.mkdirSync(DISABLED_BUNDLED_PLUGINS_DIR, { recursive: true });
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
	return trustedBundledPluginRootsForPackageRoot(params.packageRoot).map((trustedRoot) => safeRealpathSync(trustedRoot)).some((trustedRoot) => trustedRoot !== null && isPathInside$2(realPackageRoot, trustedRoot) && isPathInside$2(trustedRoot, realPluginRoot));
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
	if (realActiveDir && isPathInside$2(realActiveDir, realRootDir)) return false;
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
//#region src/channels/bundled-channel-catalog-read.ts
const OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH = path.join("dist", "channel-catalog.json");
function listPackageRoots() {
	return uniqueStrings([resolveOpenClawPackageRootSync({ cwd: process.cwd() }), resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url })].filter((entry) => Boolean(entry)));
}
function readBundledExtensionCatalogEntriesSync(pluginsDir) {
	if (!pluginsDir) return [];
	try {
		return readPluginCacheDirectory(pluginsDir).filter((entry) => entry.isDirectory()).flatMap((entry) => {
			const parsed = readPluginCacheJsonFile(path.join(pluginsDir, entry.name, "package.json"));
			return parsed.ok && isRecord(parsed.value) ? [parsed.value] : [];
		});
	} catch {
		return [];
	}
}
function readOfficialCatalogFileSync() {
	const bundledExternalEntries = BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES.filter((entry) => typeof entry === "object" && entry !== null);
	for (const packageRoot of listPackageRoots()) {
		const payload = readPluginCacheJsonFile(path.join(packageRoot, OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH));
		if (payload.ok && isRecord(payload.value)) {
			const entries = Array.isArray(payload.value.entries) ? payload.value.entries.filter((entry) => isRecord(entry)) : [];
			return [...bundledExternalEntries, ...entries];
		}
	}
	return bundledExternalEntries;
}
function isChannelCatalogEntryLike(entry) {
	return "openclaw" in entry;
}
function toBundledChannelEntry(entry) {
	const channel = isChannelCatalogEntryLike(entry) ? entry.openclaw?.channel : entry;
	const id = normalizeOptionalLowercaseString(channel?.id);
	if (!id || !channel) return null;
	return {
		id,
		channel,
		aliases: Array.isArray(channel.aliases) ? channel.aliases.map((alias) => normalizeOptionalLowercaseString(alias)).filter((alias) => Boolean(alias)) : [],
		order: typeof channel.order === "number" && Number.isFinite(channel.order) ? channel.order : Number.MAX_SAFE_INTEGER
	};
}
function listBundledChannelCatalogEntries() {
	const pluginsDir = resolveBundledPluginsDir();
	const catalogs = getPluginCache().metadata.bundledChannelCatalogs;
	const key = JSON.stringify([process.cwd(), pluginsDir]);
	const cached = catalogs.get(key);
	if (cached) return cached;
	const entries = /* @__PURE__ */ new Map();
	for (const entry of readBundledExtensionCatalogEntriesSync(pluginsDir)) {
		const channelEntry = toBundledChannelEntry(entry);
		if (channelEntry) entries.set(channelEntry.id, channelEntry);
	}
	for (const entry of readOfficialCatalogFileSync()) {
		const channelEntry = toBundledChannelEntry(entry);
		if (channelEntry) entries.set(channelEntry.id, entries.get(channelEntry.id) ?? channelEntry);
	}
	const catalog = Array.from(entries.values()).toSorted((left, right) => left.order - right.order || left.id.localeCompare(right.id));
	catalogs.set(key, catalog);
	return catalog;
}
//#endregion
//#region src/channels/bundled-channel-ids.generated.ts
const GENERATED_BUNDLED_CHANNEL_IDS = [
	{
		channelId: "a2a",
		order: 75,
		label: "A2A"
	},
	{
		channelId: "buzz",
		order: 56,
		label: "Buzz"
	},
	{
		channelId: "clickclack",
		order: 85,
		label: "ClickClack"
	},
	{
		channelId: "discord",
		label: "Discord"
	},
	{
		channelId: "feishu",
		aliases: ["lark"],
		order: 35,
		label: "Feishu"
	},
	{
		channelId: "googlechat",
		aliases: ["gchat", "google-chat"],
		order: 55,
		label: "Google Chat"
	},
	{
		channelId: "imessage",
		aliases: ["imsg"],
		label: "iMessage"
	},
	{
		channelId: "irc",
		aliases: ["internet-relay-chat"],
		label: "IRC"
	},
	{
		channelId: "line",
		order: 75,
		label: "LINE"
	},
	{
		channelId: "matrix",
		order: 70,
		label: "Matrix"
	},
	{
		channelId: "mattermost",
		order: 65,
		label: "Mattermost"
	},
	{
		channelId: "msteams",
		aliases: ["teams"],
		order: 60,
		label: "Microsoft Teams"
	},
	{
		channelId: "nextcloud-talk",
		aliases: ["nc", "nc-talk"],
		order: 65,
		label: "Nextcloud Talk"
	},
	{
		channelId: "nostr",
		order: 55,
		label: "Nostr"
	},
	{
		channelId: "qa-channel",
		order: 999,
		configurable: false,
		label: "QA Channel"
	},
	{
		channelId: "raft",
		order: 72,
		label: "Raft"
	},
	{
		channelId: "reef",
		label: "Reef"
	},
	{
		channelId: "signal",
		label: "Signal"
	},
	{
		channelId: "slack",
		label: "Slack"
	},
	{
		channelId: "sms",
		order: 88,
		label: "SMS"
	},
	{
		channelId: "synology-chat",
		order: 90,
		label: "Synology Chat"
	},
	{
		channelId: "telegram",
		label: "Telegram"
	},
	{
		channelId: "tlon",
		order: 90,
		label: "Tlon"
	},
	{
		channelId: "twitch",
		aliases: ["twitch-chat"],
		label: "Twitch"
	},
	{
		channelId: "whatsapp",
		label: "WhatsApp"
	},
	{
		channelId: "zalo",
		aliases: ["zl"],
		order: 80,
		label: "Zalo"
	},
	{
		channelId: "zalouser",
		aliases: ["zlu"],
		order: 85,
		label: "Zalo Personal"
	}
];
//#endregion
//#region src/channels/ids.ts
function listBundledChatChannelEntries() {
	return GENERATED_BUNDLED_CHANNEL_IDS.filter((entry) => entry.configurable !== false).map((entry) => ({
		id: normalizeOptionalLowercaseString(entry.channelId) ?? entry.channelId,
		aliases: entry.aliases ?? [],
		label: entry.label?.trim() || void 0,
		order: entry.order ?? Number.MAX_SAFE_INTEGER
	})).toSorted((left, right) => left.order - right.order || left.id.localeCompare(right.id, "en", { sensitivity: "base" }));
}
const BUNDLED_CHAT_CHANNEL_ENTRIES = Object.freeze(listBundledChatChannelEntries());
const CHAT_CHANNEL_ID_SET = new Set(BUNDLED_CHAT_CHANNEL_ENTRIES.map((entry) => entry.id));
Object.freeze(BUNDLED_CHAT_CHANNEL_ENTRIES.map((entry) => entry.id));
const CHAT_CHANNEL_ALIASES = Object.freeze(Object.fromEntries(BUNDLED_CHAT_CHANNEL_ENTRIES.flatMap((entry) => entry.aliases.map((alias) => [alias, entry.id]))));
function normalizeRuntimeBundledChatChannelId(normalized) {
	return listBundledChannelCatalogEntries().find((entry) => entry.id === normalized || entry.aliases.includes(normalized))?.id ?? null;
}
function normalizeChatChannelId(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return null;
	const resolved = CHAT_CHANNEL_ALIASES[normalized] ?? normalized;
	return CHAT_CHANNEL_ID_SET.has(resolved) ? resolved : normalizeRuntimeBundledChatChannelId(normalized);
}
//#endregion
//#region src/plugins/default-enablement.ts
/** True when a plugin should be enabled by default for a platform. */
function isPluginEnabledByDefaultForPlatform(plugin, platform = process.platform) {
	if (plugin.enabledByDefault === true) return true;
	return plugin.enabledByDefaultOnPlatforms?.includes(platform) === true;
}
//#endregion
//#region src/plugins/slots.ts
/** Applies mutually exclusive plugin slot selection for memory and context-engine plugins. */
const DEFAULT_SLOT_BY_KEY = {
	memory: "memory-core",
	contextEngine: "legacy"
};
Object.keys(DEFAULT_SLOT_BY_KEY);
/** Returns the implicit plugin id that owns a slot before config overrides it. */
function defaultSlotIdForKey(slotKey) {
	return DEFAULT_SLOT_BY_KEY[slotKey];
}
/** Raw `plugins.slots[key]`: `none` turns the slot off, blank leaves it unset. */
function normalizeSlotValue(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	if (normalizeOptionalLowercaseString(trimmed) === "none") return null;
	return trimmed;
}
function resolveSlotSelection(slotKey, value) {
	const normalized = normalizeSlotValue(value);
	if (normalized === void 0) return {
		kind: "default",
		pluginId: defaultSlotIdForKey(slotKey)
	};
	return normalized === null ? { kind: "off" } : {
		kind: "pinned",
		pluginId: normalized
	};
}
//#endregion
//#region src/plugins/config-normalization-shared.ts
/** Default plugin id normalizer for already-canonical ids. */
const identityNormalizePluginId = (id) => id.trim();
function normalizePluginConfigList(value, normalizePluginId) {
	if (!Array.isArray(value)) return [];
	return value.map((entry) => typeof entry === "string" ? normalizePluginId(entry) : "").filter(Boolean);
}
function normalizeHookTimeoutMs(value) {
	return asSafeIntegerInRange(value, {
		min: 1,
		max: 6e5
	});
}
function normalizeHookTimeouts(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [hookName, timeoutMs] of Object.entries(value)) {
		const normalizedTimeoutMs = normalizeHookTimeoutMs(timeoutMs);
		if (normalizedTimeoutMs !== void 0) normalized[hookName] = normalizedTimeoutMs;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizePluginHooks(value) {
	if (!isRecord(value)) return;
	const hooks = {};
	for (const key of ["allowPromptInjection", "allowConversationAccess"]) if (typeof value[key] === "boolean") hooks[key] = value[key];
	const timeoutMs = normalizeHookTimeoutMs(value.timeoutMs);
	const timeouts = normalizeHookTimeouts(value.timeouts);
	if (timeoutMs !== void 0) hooks.timeoutMs = timeoutMs;
	if (timeouts !== void 0) hooks.timeouts = timeouts;
	return Object.keys(hooks).length > 0 ? hooks : void 0;
}
function normalizePluginModelConfig(value, kind) {
	if (!isRecord(value)) return;
	const config = {};
	if (typeof value.allowModelOverride === "boolean") config.allowModelOverride = value.allowModelOverride;
	for (const [key, configuredKey] of [["allowedModels", "hasAllowedModelsConfig"], ["allowedCompletionModels", "hasAllowedCompletionModelsConfig"]]) {
		if (key === "allowedCompletionModels" && kind !== "llm") continue;
		const models = normalizeArrayBackedTrimmedStringList(value[key]);
		if (models) {
			config[configuredKey] = true;
			if (models.length > 0) config[key] = models;
		}
	}
	if (kind === "llm") {
		for (const key of ["allowAuthProfileOverride", "allowAgentIdOverride"]) if (typeof value[key] === "boolean") config[key] = value[key];
	}
	return Object.keys(config).length > 0 ? config : void 0;
}
function normalizePluginEntries(entries, normalizePluginId) {
	if (!isRecord(entries)) return {};
	const normalized = {};
	for (const [key, value] of Object.entries(entries)) {
		const normalizedKey = normalizePluginId(key);
		if (!normalizedKey) continue;
		if (!isRecord(value)) {
			normalized[normalizedKey] = {};
			continue;
		}
		const entry = value;
		normalized[normalizedKey] = {
			...normalized[normalizedKey],
			enabled: typeof entry.enabled === "boolean" ? entry.enabled : normalized[normalizedKey]?.enabled,
			hooks: normalizePluginHooks(entry.hooks) ?? normalized[normalizedKey]?.hooks,
			subagent: normalizePluginModelConfig(entry.subagent, "subagent") ?? normalized[normalizedKey]?.subagent,
			llm: normalizePluginModelConfig(entry.llm, "llm") ?? normalized[normalizedKey]?.llm,
			config: "config" in entry ? entry.config : normalized[normalizedKey]?.config
		};
	}
	return normalized;
}
/** Normalizes plugin config while allowing callers to resolve aliases first. */
function normalizePluginsConfigWithResolverCore(config, normalizePluginId = identityNormalizePluginId) {
	const memorySlot = resolveSlotSelection("memory", config?.slots?.memory);
	return {
		enabled: config?.enabled ?? true,
		allow: normalizePluginConfigList(config?.allow, normalizePluginId),
		deny: normalizePluginConfigList(config?.deny, normalizePluginId),
		loadPaths: normalizePluginConfigList(config?.load?.paths, identityNormalizePluginId),
		slots: {
			memory: memorySlot.kind === "off" ? null : memorySlot.pluginId,
			contextEngine: normalizeSlotValue(config?.slots?.contextEngine)
		},
		entries: normalizePluginEntries(config?.entries, normalizePluginId)
	};
}
/**
* Enables an owner for any enabled channel; disables it only when all channels are off.
* Unspecified channels leave the plugin's own activation policy in control.
*/
function resolveChannelConfigEnablement(cfg, pluginId, channelIds = []) {
	const channels = cfg?.channels;
	if (!channels) return;
	const enablement = (channelIds.length ? channelIds.map((channelId) => normalizeChatChannelId(channelId) ?? channelId) : [normalizeChatChannelId(pluginId)]).map((channelId) => {
		const entry = channelId ? channels[channelId] : void 0;
		return isRecord(entry) ? entry.enabled : void 0;
	});
	if (enablement.includes(true)) return true;
	return enablement.every((enabled) => enabled === false) ? false : void 0;
}
//#endregion
//#region src/plugins/plugin-policy-id.ts
/**
* Canonicalizes a plugin id for comparison against `plugins.allow`, `plugins.deny`, and
* `plugins.entries`, which are lowercase-normalized when config is normalized. A manifest declares
* its id in whatever case its author chose, so policy must compare this derived key rather than the
* declared id. The declared id itself stays untouched: the loader matches it against the plugin's
* runtime export id, and rewriting it would break plugins whose export matches a mixed-case manifest.
*/
function normalizePluginPolicyId(id) {
	return normalizeOptionalLowercaseString(id) ?? "";
}
//#endregion
//#region src/plugins/config-activation-shared.ts
function resolveExplicitPluginSelectionShared(params) {
	const policyId = normalizePluginPolicyId(params.id);
	if (params.config.entries[policyId]?.enabled === true) return "enabled in config";
	if (params.origin === "bundled" && resolveChannelConfigEnablement(params.rootConfig, params.id, params.channelIds) === true) return "channel enabled in config";
	if (params.config.slots.memory === params.id) return "selected memory slot";
	if (params.config.slots.contextEngine === params.id) return "selected context engine slot";
	if (params.origin !== "bundled" && params.config.allow.includes(policyId)) return "selected in allowlist";
}
function resolvePluginActivationStateShared(params) {
	const activationSource = params.activationSource ?? {
		plugins: params.config,
		rootConfig: params.rootConfig
	};
	const explicitReason = resolveExplicitPluginSelectionShared({
		id: params.id,
		origin: params.origin,
		config: activationSource.plugins,
		rootConfig: activationSource.rootConfig,
		channelIds: params.channelIds
	});
	const decision = (source, details = {}) => ({
		enabled: source !== "disabled",
		activated: source !== "disabled",
		explicitlyEnabled: explicitReason !== void 0,
		source,
		reason: void 0,
		...details
	});
	if (!params.config.enabled) return decision("disabled", { reason: "plugins disabled" });
	const policyId = normalizePluginPolicyId(params.id);
	if (params.config.deny.includes(policyId)) return decision("disabled", { reason: "blocked by denylist" });
	const entry = params.config.entries[policyId];
	if (entry?.enabled === false) return decision("disabled", { reason: "disabled in config" });
	if (resolveChannelConfigEnablement(activationSource.rootConfig ?? params.rootConfig, params.id, params.channelIds) === false) return decision("disabled", { reason: "channel disabled in config" });
	const explicitlyAllowed = params.config.allow.includes(policyId);
	if (params.origin === "workspace" && !explicitlyAllowed && entry?.enabled !== true && explicitReason !== "selected context engine slot") return decision("disabled", { reason: "workspace plugin (disabled by default)" });
	if (params.config.slots.memory === params.id) return decision("explicit", {
		explicitlyEnabled: true,
		reason: "selected memory slot"
	});
	if (params.config.slots.contextEngine === params.id) return decision("explicit", {
		explicitlyEnabled: true,
		reason: "selected context engine slot"
	});
	if (params.allowBundledChannelExplicitBypassesAllowlist === true && explicitReason === "channel enabled in config") return decision("explicit", {
		explicitlyEnabled: true,
		reason: explicitReason
	});
	if (params.config.allow.length > 0 && !explicitlyAllowed) return decision("disabled", { reason: "not in allowlist" });
	if (explicitReason) return decision("explicit", {
		explicitlyEnabled: true,
		reason: explicitReason
	});
	if (params.autoEnabledReason) return decision("auto", {
		explicitlyEnabled: false,
		reason: params.autoEnabledReason
	});
	if (entry?.enabled === true) return decision("auto", {
		explicitlyEnabled: false,
		reason: "enabled by effective config"
	});
	if (params.origin === "bundled" && resolveChannelConfigEnablement(params.rootConfig, params.id, params.channelIds) === true) return decision("auto", {
		explicitlyEnabled: false,
		reason: "channel configured"
	});
	if (params.origin === "bundled" && params.enabledByDefault === true) return decision("default", {
		explicitlyEnabled: false,
		reason: "bundled default enablement"
	});
	if (params.origin === "bundled") return decision("disabled", {
		explicitlyEnabled: false,
		reason: "bundled (disabled by default)"
	});
	return decision("default");
}
//#endregion
//#region src/plugins/config-state.ts
/** Normalizes plugin config and resolves effective enablement, slots, and activation sources. */
const BUILT_IN_PLUGIN_ALIAS_LOOKUP = /* @__PURE__ */ new Map([
	["google-gemini-cli", "google"],
	["minimax-portal", "minimax"],
	["minimax-portal-auth", "minimax"]
]);
/** Normalizes user/config plugin ids into the canonical lowercase key form. */
function normalizePluginId(id) {
	const normalized = normalizeOptionalLowercaseString(id) ?? "";
	return BUILT_IN_PLUGIN_ALIAS_LOOKUP.get(normalized) ?? normalized;
}
/** Builds caller-owned policy without exposing the host's prepared objects. */
const createNormalizedPluginsConfig = (config) => normalizePluginsConfigWithResolverCore(config, normalizePluginId);
const normalizePluginsConfig = (config) => {
	if (preparedRuntimePluginsConfig && preparedRuntimePluginsConfig.source === config) return preparedRuntimePluginsConfig.value;
	return createNormalizedPluginsConfig(config);
};
let preparedRuntimePluginsConfig;
function resolveEffectivePluginActivationState(params) {
	return resolvePluginActivationStateShared({
		...params,
		allowBundledChannelExplicitBypassesAllowlist: true
	});
}
//#endregion
//#region packages/model-catalog-core/src/provider-id.ts
function normalizeProviderId(provider) {
	return normalizeLowercaseStringOrEmpty(provider);
}
//#endregion
//#region src/secrets/resolve-errors.ts
/** Error for failures that affect an entire configured secret provider. */
var SecretProviderResolutionError = class extends Error {
	constructor(params) {
		super(params.message, params.cause !== void 0 ? { cause: params.cause } : void 0);
		this.scope = "provider";
		this.name = "SecretProviderResolutionError";
		this.code = params.code;
		this.source = params.source;
		this.provider = params.provider;
	}
};
/** Error for failures limited to one SecretRef id under a provider. */
var SecretRefResolutionError = class extends Error {
	constructor(params) {
		super(params.message, params.cause !== void 0 ? { cause: params.cause } : void 0);
		this.scope = "ref";
		this.name = "SecretRefResolutionError";
		this.code = params.code;
		this.source = params.source;
		this.provider = params.provider;
		this.refId = params.refId;
	}
};
function isSecretResolutionError(value) {
	return value instanceof SecretProviderResolutionError || value instanceof SecretRefResolutionError;
}
/** Sanitized provider detail suitable for operator-facing diagnostics. */
function describeSecretResolutionOperatorDiagnostic(value) {
	if (value instanceof SecretRefResolutionError && value.code === "SECRET_REF_REDACTED_VALUE") return `Secret reference "${value.source}:${value.provider}:${value.refId}" resolves to a redaction placeholder`;
	if (value instanceof SecretProviderResolutionError && value.code === "SECRET_PROVIDER_PATH_SECURITY_UNVERIFIABLE") return "Windows path security could not be verified";
}
/** Sanitized recovery action suitable for operator-facing diagnostics. */
function describeSecretResolutionOperatorRecovery(value) {
	if (value instanceof SecretRefResolutionError && value.code === "SECRET_REF_REDACTED_VALUE") return "Run openclaw doctor --fix to repair a store-backed Gateway token; supply a real credential for other secrets, then restart the Gateway and reconnect or re-pair clients";
	if (!(value instanceof SecretProviderResolutionError) || value.code !== "SECRET_PROVIDER_PATH_SECURITY_UNVERIFIABLE") return;
	return value.source === "exec" ? "Restore Windows path security verification, or use an existing provider command whose owner and ACLs OpenClaw can verify" : "Restore Windows path security verification, or use an existing secret file whose owner and ACLs OpenClaw can verify";
}
function providerResolutionError(params) {
	return new SecretProviderResolutionError({
		...params,
		code: params.code ?? "SECRET_PROVIDER_UNAVAILABLE"
	});
}
function refResolutionError(params) {
	return new SecretRefResolutionError(params);
}
const REDACTED_SECRET_VALUES = /* @__PURE__ */ new Set([
	"__OPENCLAW_REDACTED__",
	"REDACTED",
	"xoxb-REDACTED",
	"xapp-REDACTED",
	"***",
	"[redacted]",
	"[REDACTED]",
	"<redacted>",
	"[REDACTED_PRIVATE_KEY]",
	"[REDACTED CREDENTIAL]"
]);
function isRedactedSecretValue(value) {
	return typeof value === "string" && REDACTED_SECRET_VALUES.has(value.trim());
}
//#endregion
//#region src/agents/workspace-dirs.ts
/** Lists unique workspace directories for configured agents and the default agent. */
function listAgentWorkspaceDirs(cfg, env = process.env) {
	const dirs = /* @__PURE__ */ new Set();
	for (const agentId of listAgentIds(cfg)) dirs.add(resolveAgentWorkspaceDir(cfg, agentId, env));
	return [...dirs];
}
//#endregion
//#region src/plugins/current-plugin-metadata-state.ts
/** Owns config identity reuse for the current immutable metadata snapshot. */
const currentPluginMetadataConfigIdentityCache = {
	add(config) {
		getProcessPluginCache().metadata.current.configIdentities.add(config);
	},
	clear() {
		getProcessPluginCache().metadata.current.configIdentities = /* @__PURE__ */ new WeakSet();
	},
	has(config) {
		return getProcessPluginCache().metadata.current.configIdentities.has(config);
	}
};
/** Stores the process-current plugin metadata snapshot and compatible config fingerprints. */
function setCurrentPluginMetadataSnapshotState(snapshot, configFingerprint, compatiblePolicyHashes, compatibleConfigFingerprints, modelIdNormalizationPolicies, owner = "operation", envFingerprint, defaultDiscoveryCompatible = false, agentWorkspaceFingerprint) {
	const state = getProcessPluginCache().metadata.current;
	state.snapshot = snapshot;
	state.owner = owner;
	state.configFingerprint = snapshot ? configFingerprint : void 0;
	state.agentWorkspaceFingerprint = snapshot ? agentWorkspaceFingerprint : void 0;
	state.envFingerprint = snapshot ? envFingerprint : void 0;
	state.defaultDiscoveryCompatible = Boolean(snapshot && defaultDiscoveryCompatible);
	state.compatiblePolicyHashes = snapshot ? compatiblePolicyHashes : void 0;
	state.compatibleConfigFingerprints = snapshot ? compatibleConfigFingerprints : void 0;
	state.revision = Symbol("plugin-metadata-snapshot");
}
/** Reads the boot inventory without importing discovery into lightweight consumers. */
function getGatewayPluginMetadataSnapshot() {
	const cache = getPluginCache();
	if (cache.kind === "process" && cache.metadata.current.owner === "gateway") return cache.metadata.current.snapshot;
}
/** Captures the current snapshot and the policies eligible for process-wide publication. */
function getCurrentPluginMetadataSnapshotState() {
	const state = getProcessPluginCache().metadata.current;
	return {
		snapshot: state.snapshot,
		owner: state.owner,
		configFingerprint: state.configFingerprint,
		agentWorkspaceFingerprint: state.agentWorkspaceFingerprint,
		envFingerprint: state.envFingerprint,
		defaultDiscoveryCompatible: state.defaultDiscoveryCompatible,
		compatiblePolicyHashes: state.compatiblePolicyHashes,
		compatibleConfigFingerprints: state.compatibleConfigFingerprints,
		revision: state.revision
	};
}
//#endregion
//#region src/state/config-machine-state.ts
function normalizeConfigMachineStateKey(key) {
	const normalized = key.trim();
	if (!normalized) throw new Error("config machine state key must not be empty");
	return normalized;
}
function readConfigMachineStateRowInDatabase(database, key) {
	if (!tableExists(database, "config_machine_state")) return;
	const db = getNodeSqliteKysely(database);
	return executeSqliteQueryTakeFirstSync(database, db.selectFrom("config_machine_state").select(["value_json", "updated_at_ms"]).where("state_key", "=", normalizeConfigMachineStateKey(key)));
}
function readConfigMachineStateWithMetadata(key, options = {}, behavior = {}) {
	const read = ({ db: database }) => {
		const row = readConfigMachineStateRowInDatabase(database, key);
		return row ? {
			value: JSON.parse(row.value_json),
			updatedAtMs: row.updated_at_ms
		} : void 0;
	};
	return behavior.artifactPreservingReadOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(read, options) : withExistingOpenClawStateDatabaseReadOnly(read, options);
}
function readConfigMachineState(key, options = {}, behavior = {}) {
	return readConfigMachineStateWithMetadata(key, options, behavior)?.value;
}
//#endregion
//#region src/plugins/install-root-context.ts
const pluginInstallRootContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstallRootContext"), () => new AsyncLocalStorage());
/** Resolve the ordinary operator-owned plugin roots before a run redirects state. */
function resolvePluginInstallRoots(env = process.env, homedir = os.homedir) {
	const configDir = resolveConfigDir(env, homedir);
	return Object.freeze({
		extensionsDir: path.join(configDir, "extensions"),
		gitDir: path.join(configDir, "git"),
		npmDir: path.join(configDir, "npm"),
		stateDir: resolveStateDir(env, homedir)
	});
}
/** Return run-pinned install roots, or resolve the caller's ordinary roots. */
function resolveActivePluginInstallRoots(env = process.env, homedir = os.homedir) {
	return pluginInstallRootContext.getStore() ?? resolvePluginInstallRoots(env, homedir);
}
/** Artifact paths do not need the state directory's legacy-location filesystem probes. */
function resolveActivePluginInstallDir(kind, env = process.env, homedir = os.homedir) {
	const roots = pluginInstallRootContext.getStore();
	return roots ? roots[`${kind}Dir`] : path.join(resolveConfigDir(env, homedir), kind);
}
/** Return whether the current run pinned operator-owned plugin install roots. */
function hasActivePluginInstallRoots() {
	return pluginInstallRootContext.getStore() !== void 0;
}
//#endregion
//#region src/plugins/plugin-metadata-snapshot-readers.ts
const snapshotReaderSlot = resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaders"), () => ({}));
resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaderCustody"), () => ({ owners: 0 }));
/** Called at module evaluation; a retained Gateway keeps its registered readers. */
function registerPluginMetadataSnapshotReaders(readers) {
	Object.assign(snapshotReaderSlot, readers);
}
//#endregion
//#region src/plugins/plugin-source-capture-context.ts
const runInPluginSourceCaptureContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceCaptureContext"), () => AsyncLocalStorage.snapshot());
resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceCaptureMaintenance"), () => new AsyncLocalStorage());
//#endregion
//#region src/plugins/plugin-source-capture-native-loads.ts
/** The process-wide capture owner installs this observer once. */
function observePluginNativeLoads() {
	const paths = /* @__PURE__ */ new Set();
	const loadAddon = process.dlopen.bind(process);
	process.dlopen = (...args) => {
		try {
			const file = fsSync.realpathSync.native(args[1]);
			paths.add(process.platform === "win32" ? normalizeWindowsPathPreservingCase(file) : file);
		} catch {}
		return loadAddon(...args);
	};
	return paths;
}
function createPluginNativeCaptureCustody(ownedRoots) {
	const nativeLoadPaths = observePluginNativeLoads();
	const nativeReferences = /* @__PURE__ */ new Map();
	const retiringNativeRoots = /* @__PURE__ */ new Set();
	const retainedRoots = /* @__PURE__ */ new Set();
	return {
		nativeReferences,
		retiringNativeRoots,
		/** Independent inventories and loaded modules can retain the same native namespace. */
		isPluginSourceCaptureRetained(directory) {
			return [...ownedRoots, ...retainedRoots].some((root) => isPathInside$2(root, directory) || isPathInside$2(directory, root)) || [...nativeReferences.keys(), ...nativeLoadPaths].some((file) => isPathInside$2(directory, file));
		},
		/** Physical module lifetime outlives registration and CommonJS cache eviction. */
		retainLoadedPluginSourceCapture(directory) {
			if (![...nativeLoadPaths].some((file) => isPathInside$2(directory, file))) return false;
			const retained = [...ownedRoots].find((root) => isPathInside$2(root, directory)) ?? directory;
			if (![...retainedRoots].some((root) => isPathInside$2(root, retained) || isPathInside$2(retained, root))) process.emitWarning(`Plugin source capture cleanup: retained-by-loaded-module: ${retained}; cleanup deferred until the next startup`);
			retainedRoots.add(retained);
			return true;
		},
		/** Warm generations retain superseded snapshots until their local cache retires. */
		retainPluginNativeCapturePath(capturedPath) {
			const file = path.resolve(capturedPath);
			if ([...retiringNativeRoots].some((root) => file.startsWith(root + path.sep))) throw new Error("Plugin native capture is being reclaimed");
			nativeReferences.set(file, (nativeReferences.get(file) ?? 0) + 1);
			let released = false;
			return () => {
				if (released) return;
				released = true;
				const references = nativeReferences.get(file);
				if (references === 1) nativeReferences.delete(file);
				else nativeReferences.set(file, references - 1);
			};
		}
	};
}
//#endregion
//#region src/plugins/plugin-source-capture-directory.ts
const CAPTURE_GRACE_MS = 36e5;
const { instances, ownedRoots, nativeReferences, retiringNativeRoots, isPluginSourceCaptureRetained, retainLoadedPluginSourceCapture, retainPluginNativeCapturePath, sweeps, warningBackoff } = resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceCaptureInstances"), () => {
	const instanceRoots = /* @__PURE__ */ new Set();
	const nativeCustody = createPluginNativeCaptureCustody(instanceRoots);
	process.once("exit", () => {
		for (const [key, instance] of instances) try {
			const root = retireInstance(key, instance);
			if (root) removeInstanceSync(root, instance.pendingNative);
		} catch (error) {
			process.stderr.write(`Plugin source capture exit cleanup failed: ${String(error)}\n`);
		}
	});
	return {
		instances: /* @__PURE__ */ new Map(),
		ownedRoots: instanceRoots,
		...nativeCustody,
		sweeps: /* @__PURE__ */ new Map(),
		warningBackoff: /* @__PURE__ */ new Map()
	};
});
function retireInstance(key, instance) {
	if (instance.root && retainLoadedPluginSourceCapture(instance.root)) {
		instance.references.clear();
		scheduleCaptureCleanup(key, instance);
		return;
	}
	instance.closing = true;
	let removalRoot = instance.root;
	try {
		instance.token?.(true);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		instance.token?.();
		removalRoot = void 0;
	}
	if (instance.root) ownedRoots.delete(instance.root);
	instance.references.clear();
	instances.delete(key);
	scheduleCaptureCleanup(key, instance);
	return removalRoot;
}
function warn(error) {
	process.emitWarning(`Plugin source capture cleanup: ${String(error)}`);
}
/** Reclamation owns an existing native token until its captured payload is gone. */
async function reclaimInstance(directory, originalDirectory, nativeMaintenance) {
	const ownerPath = path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]);
	const family = SQLITE_STAGING_TOKEN_FILES.map((file) => fsSync.lstatSync(path.join(directory, file), { throwIfNoEntry: false }));
	const originalOwner = family[0];
	const captures = path.join(directory, "captures");
	const captured = fsSync.lstatSync(captures, { throwIfNoEntry: false });
	if (process.getuid && originalDirectory.uid !== process.getuid() || !originalOwner || family.some((file) => file && (!file.isFile() || file.nlink !== 1 || process.getuid && file.uid !== process.getuid())) || captured && !captured.isDirectory()) return;
	const unchanged = () => {
		const currentDirectory = fsSync.lstatSync(directory);
		const currentOwner = fsSync.lstatSync(ownerPath);
		return currentDirectory.dev === originalDirectory.dev && currentDirectory.ino === originalDirectory.ino && currentDirectory.isDirectory() && currentOwner.isFile() && currentOwner.nlink === 1 && currentOwner.dev === originalOwner.dev && currentOwner.ino === originalOwner.ino;
	};
	const release = acquireSqliteStagingToken(directory, "reclaim");
	let released = false;
	const errors = [];
	ownedRoots.add(directory);
	try {
		if (!unchanged()) return;
		const native = path.join(directory, "native");
		const nativeStat = fsSync.lstatSync(native, { throwIfNoEntry: false });
		await fs.rm(captures, {
			recursive: true,
			force: true
		});
		let retainedNative = Boolean(nativeStat);
		if (nativeStat?.isDirectory() && nativeMaintenance) {
			for (const nativeEntry of await fs.readdir(native, { withFileTypes: true })) {
				const nativeDirectory = path.join(native, nativeEntry.name);
				if (!nativeEntry.isDirectory()) continue;
				nativeMaintenance.assertCurrent();
				if (!unchanged()) return;
				const contained = (file) => file.startsWith(nativeDirectory + path.sep);
				if ([...nativeMaintenance.retainedPaths].some(contained) || [...nativeReferences.keys()].some(contained)) continue;
				retiringNativeRoots.add(nativeDirectory);
				try {
					await fs.rm(nativeDirectory, {
						recursive: true,
						force: true
					});
					nativeMaintenance.removed.push(nativeDirectory);
				} finally {
					retiringNativeRoots.delete(nativeDirectory);
				}
			}
			retainedNative = (await fs.readdir(native)).length > 0;
		}
		release(true);
		released = true;
		if (!retainedNative && unchanged()) {
			nativeMaintenance?.assertCurrent();
			await fs.rm(directory, {
				recursive: true,
				force: true
			});
		}
	} catch (error) {
		errors.push(error);
	} finally {
		try {
			if (!released) release();
		} catch (error) {
			errors.push(error);
		} finally {
			ownedRoots.delete(directory);
		}
		throwSqliteLifecycleErrors(errors, "Plugin source reclamation and cleanup failed");
	}
}
function removeInstanceSync(root, pendingNative = []) {
	if (retainLoadedPluginSourceCapture(root)) return;
	fsSync.rmSync(path.join(root, "captures"), {
		recursive: true,
		force: true
	});
	for (const directory of pendingNative) fsSync.rmSync(directory, {
		recursive: true,
		force: true
	});
	const native = path.join(root, "native");
	if (!fsSync.existsSync(native) || fsSync.readdirSync(native).length === 0) fsSync.rmSync(root, {
		recursive: true,
		force: true
	});
}
async function reclaimInstances(root, recordFailure, legacy = false, nativeMaintenance, fallbackPrefix) {
	let entries;
	try {
		entries = await fs.readdir(root, { withFileTypes: true });
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		return;
	}
	if (entries.length === 0) return;
	const cutoff = Date.now() - CAPTURE_GRACE_MS;
	let legacyAllowed;
	const lstatIfPresent = (file) => fs.lstat(file).catch((error) => {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	});
	for (const entry of entries) {
		if (!entry.isDirectory() || legacy && !isLegacyPluginSourceCaptureName(entry.name) || fallbackPrefix && !entry.name.startsWith(fallbackPrefix)) continue;
		const directory = path.join(root, entry.name);
		try {
			const stat = await fs.lstat(directory);
			const changed = legacy ? Math.max(stat.mtimeMs, stat.ctimeMs, stat.birthtimeMs) : stat.mtimeMs;
			if (!stat.isDirectory() || changed > cutoff && !nativeMaintenance?.startup) continue;
			const canonical = await fs.realpath(directory);
			if (ownedRoots.has(canonical) || retainLoadedPluginSourceCapture(canonical)) continue;
			const tokenPath = path.join(canonical, SQLITE_STAGING_TOKEN_FILES[0]);
			const nativeStat = await lstatIfPresent(path.join(canonical, "native"));
			const tokenStat = await lstatIfPresent(tokenPath);
			if (legacy && tokenStat) continue;
			if (!tokenStat) {
				if (fallbackPrefix || changed > cutoff) continue;
				if (nativeStat) continue;
				if (legacy) {
					if (legacyAllowed === void 0) {
						const { inspectOtherOpenClawProcesses } = await import("./openclaw-process-census-Cl9j7zvg.mjs");
						const census = inspectOtherOpenClawProcesses();
						legacyAllowed = "error" in census || census.pids.length === 0;
					}
					if (!legacyAllowed) continue;
					if (process.getuid && (await fs.lstat(canonical)).uid !== process.getuid()) continue;
				}
				const retired = path.join(root, `${legacy ? PLUGIN_SOURCE_CAPTURE_PREFIX : ""}${randomUUID()}`);
				await fs.rename(canonical, retired);
				await fs.rm(retired, {
					recursive: true,
					force: true
				});
				continue;
			}
			await reclaimInstance(canonical, stat, nativeMaintenance);
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT") && !isSqliteLockError(error)) recordFailure(error);
		}
	}
}
/** Coalesce active scans, but throttle diagnostics independently of cleanup retries. */
function sweepPluginSourceCaptureDirectories(stateDir) {
	const root = path.resolve(resolvePluginSourceCapturesDirectory(stateDir));
	let sweep = sweeps.get(root);
	if (!sweep) {
		let failures = 0;
		let firstFailure;
		const recordFailure = (error) => {
			if (failures++ === 0) firstFailure = error;
		};
		sweep = reclaimInstances(root, recordFailure).catch(recordFailure).then(() => reclaimInstances(tmpdir(), recordFailure, false, void 0, resolvePluginSourceCaptureFallbackPrefix(stateDir))).catch(recordFailure).then(async () => {
			const visited = /* @__PURE__ */ new Set();
			for (const candidate of [path.join(stateDir, "tmp"), tmpdir()]) try {
				const directory = await fs.realpath(candidate);
				if (!visited.has(directory)) {
					visited.add(directory);
					await reclaimInstances(directory, recordFailure, true);
				}
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) recordFailure(error);
			}
		}).then(() => {
			if (failures === 0) {
				warningBackoff.delete(root);
				return;
			}
			const now = Date.now();
			const previous = warningBackoff.get(root);
			if (previous && now < previous.next) return;
			const delay = Math.min((previous?.delay ?? CAPTURE_GRACE_MS / 2) * 2, 24 * CAPTURE_GRACE_MS);
			if (!previous && warningBackoff.size >= 32) {
				const oldest = warningBackoff.keys().next().value;
				if (oldest !== void 0) warningBackoff.delete(oldest);
			}
			warningBackoff.set(root, {
				next: now + delay,
				delay
			});
			warn(`${failures} cleanup failure(s) in ${root}; will retry. First: ${formatErrorMessage(firstFailure)}`);
		}).finally(() => sweeps.delete(root));
		sweeps.set(root, sweep);
	}
	return sweep;
}
function scheduleCaptureCleanup(key, instance) {
	const scheduler = [...instance.references].findLast((reference) => reference.scheduler && !reference.scheduler.signal.aborted)?.scheduler ?? void 0;
	if (instance.scheduler === scheduler) return;
	instance.scheduler = scheduler;
	instance.cleanupScope?.beginClose();
	instance.cleanupScope = void 0;
	if (!scheduler || instance.storage.placement === "temporary") return;
	const scope = scheduler.scope();
	instance.cleanupScope = scope;
	scope.signal.addEventListener("abort", () => scheduleCaptureCleanup(key, instance), { once: true });
	runInPluginSourceCaptureContext(() => scope.schedule({
		id: `plugin-source-captures:${key}`,
		delayMs: CAPTURE_GRACE_MS,
		everyMs: CAPTURE_GRACE_MS,
		run: () => sweepPluginSourceCaptureDirectories(instance.storage.stateDir)
	}));
}
resolveGlobalSingleton(Symbol.for("openclaw.pluginRuntimeCloseRetainedError"), () => class RetainedRuntimeError extends Error {
	constructor(cause) {
		super("Plugin runtime still owns resources; inspect cleanup failures before retrying Gateway close.", { cause });
		this.name = "PluginRuntimeCloseRetainedError";
	}
});
resolveGlobalSingleton(Symbol.for("openclaw.pluginRuntimeCloseCompletedError"), () => class CompletedRuntimeError extends AggregateError {});
//#endregion
//#region src/plugins/plugin-metadata-lifecycle.ts
const pluginMetadataProcessMemoClears = /* @__PURE__ */ new Map();
resolveGlobalSingleton(Symbol.for("openclaw.gatewayPluginMetadataOwners"), () => /* @__PURE__ */ new Set());
/** Registers a metadata clear hook with the lifetime of its facts. */
function registerPluginMetadataProcessMemoLifecycleClear(clearProcessMemo, options = { owner: "process" }) {
	pluginMetadataProcessMemoClears.set(clearProcessMemo, options.owner);
}
//#endregion
//#region src/plugins/installed-plugin-index-row.ts
const INSTALLED_PLUGIN_INDEX_STATE_KEY = "plugins.installedIndex";
/** Shared inspection commands use the same existing-only, artifact-preserving reader. */
function readPluginMetadataStateRowSync(selector, databaseOptions, artifactPreservingReadOnly = false) {
	const row = readPluginMetadataStateRowsSync([selector === "installed-index" ? INSTALLED_PLUGIN_INDEX_STATE_KEY : "plugins.bundledDiscovery"], databaseOptions, artifactPreservingReadOnly)[0];
	return row ? { value_json: row.value_json } : void 0;
}
/** Acquire related metadata facts from the same prepared database bytes. */
function readPluginMetadataStateRowsSync(stateKeys, databaseOptions, artifactPreservingReadOnly = false) {
	const read = ({ db }) => {
		if (!tableExists(db, "config_machine_state")) return [];
		return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("config_machine_state").select(["state_key", "value_json"]).where("state_key", "in", stateKeys)).rows;
	};
	return (artifactPreservingReadOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(read, databaseOptions) : withExistingOpenClawStateDatabaseReadOnly(read, databaseOptions)) ?? [];
}
//#endregion
//#region src/plugins/bundled-discovery-state.ts
function parseBundledDiscoveryMode(value) {
	return value === "compat" || value === "allowlist" ? value : void 0;
}
function readBundledDiscoveryFact(read) {
	try {
		return read();
	} catch (error) {
		if (isStateDatabaseReadAdmissionInvalidatedError(error)) throw new PluginCacheFactInvalidatedError("Plugin discovery read admission changed during preparation; retry the operation.", { cause: error });
		throw error;
	}
}
function resolveBundledDiscoveryOptions(options) {
	return options.path || options.database || !hasActivePluginInstallRoots() ? options : {
		...options,
		env: {
			...options.env ?? process.env,
			OPENCLAW_STATE_DIR: resolveActivePluginInstallRoots(options.env).stateDir
		}
	};
}
function readBundledDiscoveryMode(options = {}, behavior = {}) {
	const resolvedOptions = resolveBundledDiscoveryOptions(options);
	return parseBundledDiscoveryMode(readBundledDiscoveryFact(() => readConfigMachineState("plugins.bundledDiscovery", resolvedOptions, behavior)));
}
const discoveryState = resolveGlobalSingleton(Symbol.for("openclaw.bundledDiscoveryMode"), () => ({
	generation: {},
	snapshotModes: /* @__PURE__ */ new WeakMap()
}));
registerPluginMetadataProcessMemoLifecycleClear(() => {
	clearBundledDiscoveryModeMemo();
});
function resolveBundledDiscoveryMemoKey(env) {
	const scopedEnv = hasActivePluginInstallRoots() ? {
		...env,
		OPENCLAW_STATE_DIR: resolveActivePluginInstallRoots(env).stateDir
	} : env;
	return resolveOpenClawStateSqlitePath(scopedEnv);
}
/**
* Callers loading a registry with an explicit env pass it so the mode comes
* from that env's state root; omitting it reads the process root. Pinned
* install roots win over both, matching readBundledDiscoveryMode.
*/
function readBundledDiscoveryModeMemoized(env = process.env, behavior = {}, readPreparedValue) {
	const options = env === process.env ? {} : { env };
	const snapshot = behavior.artifactPreservingReadOnly || isArtifactPreservingStateRead() ? readBundledDiscoveryFact(() => getActiveOpenClawStateDatabaseReadSnapshot(resolveBundledDiscoveryOptions(options))) : void 0;
	if (snapshot || behavior.artifactPreservingReadOnly) {
		const prepared = snapshot && discoveryState.snapshotModes.get(snapshot);
		if (prepared) return prepared.value;
		const value = readBundledDiscoveryMode(options, behavior);
		if (snapshot) discoveryState.snapshotModes.set(snapshot, { value });
		return value;
	}
	const key = resolveBundledDiscoveryMemoKey(env);
	if (discoveryState.memoized?.key !== key) {
		const owner = getPluginCache();
		const prepared = owner.preparedBundledDiscoveryModes.get(key);
		if (prepared && "value" in prepared && prepared.value.generation === discoveryState.generation) {
			getPluginCacheRetirementSignal(owner).throwIfAborted();
			discoveryState.memoized = {
				key,
				value: prepared.value.value
			};
		} else discoveryState.memoized = {
			key,
			value: readPreparedValue ? parseBundledDiscoveryMode(readBundledDiscoveryFact(() => readPreparedValue(key))) : readBundledDiscoveryMode(env === process.env ? {} : { env })
		};
	}
	return discoveryState.memoized.value;
}
/**
* Clears the memo after a machine-state write so same-process readers observe
* the new mode. Without this, doctor's migration could cache the pre-migration
* absent mode and rebuild plugin indexes against stale strict-gate decisions.
*/
function clearBundledDiscoveryModeMemo() {
	discoveryState.memoized = void 0;
	discoveryState.snapshotModes = /* @__PURE__ */ new WeakMap();
	discoveryState.generation = {};
	for (const cache of /* @__PURE__ */ new Set([getPluginCache(), getProcessPluginCache()])) cache.preparedBundledDiscoveryModes.clear();
}
//#endregion
//#region src/plugins/compat/agent-list-runtime-projection-records.ts
const AGENT_LIST_RUNTIME_PROJECTION_COMPAT_RECORDS = [{
	code: "agent-list-runtime-projection",
	status: "deprecated",
	owner: "sdk",
	introduced: "2026-07-27",
	deprecated: "2026-10-02",
	warningStarts: "2026-10-02",
	removeAfter: "2027-01-02",
	replacement: "Canonical `cfg.agents.entries`, or `listAgentIds` / `resolveAgentConfig` from `openclaw/plugin-sdk/agent-runtime`",
	docsPath: "/plugins/sdk-migration/how-to-migrate#agent-roster-config",
	surfaces: ["non-enumerable runtime OpenClawConfig.agents.list projection"],
	diagnostics: ["plugin compatibility registry and migration documentation; no runtime warnings"],
	tests: ["src/config/runtime-overrides.test.ts", "src/plugins/compat/registry.test.ts"],
	releaseNote: "The runtime agents.list projection introduced in #113146 remains untyped compatibility for plugins built against stable SDK releases through 2026.9.x; authored configs use agents.entries without default markers."
}];
//#endregion
//#region src/plugins/compat/deprecation-marking.ts
const MARKING_DATE = "2026-07-25";
const DEPRECATION_MARKING = {
	status: "removal-pending",
	introduced: MARKING_DATE,
	deprecated: MARKING_DATE,
	warningStarts: MARKING_DATE,
	removeAfter: "2026-10-01"
};
/** The elapsed window does not replace each family's required reader-migration proof. */
const DEPRECATION_MARKING_COMPAT_RECORDS = [
	{
		code: "plugin-sdk-channel-setup-input-fields",
		...DEPRECATION_MARKING,
		owner: "channel",
		replacement: "plugin-local setup input intersections that declare each owning channel field; retain each field until a new published-plugin artifact sweep finds no reader",
		docsPath: "/plugins/sdk-migration#published-channel-setup-compatibility",
		surfaces: [
			"ChannelSetupInput.privateKey",
			"ChannelSetupInput.secret",
			"ChannelSetupInput.botToken",
			"ChannelSetupInput.appToken",
			"ChannelSetupInput.signingSecret",
			"ChannelSetupInput.mode",
			"ChannelSetupInput.cliPath",
			"ChannelSetupInput.authDir",
			"ChannelSetupInput.httpUrl",
			"ChannelSetupInput.httpPort",
			"ChannelSetupInput.webhookPath",
			"ChannelSetupInput.webhookUrl",
			"ChannelSetupInput.userId",
			"ChannelSetupInput.accessToken",
			"ChannelSetupInput.password",
			"ChannelSetupInput.deviceName",
			"ChannelSetupInput.url",
			"ChannelSetupInput.baseUrl",
			"ChannelSetupInput.code",
			"ChannelSetupInput.groupChannels",
			"ChannelSetupInput.dmAllowlist",
			"ChannelSetupInput.autoDiscoverChannels"
		],
		diagnostics: ["TypeScript @deprecated annotations on the reader-backed ChannelSetupInput compatibility tier", "published-plugin artifact reader sweep required before field removal"],
		tests: ["src/plugin-sdk/channel-setup.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "ChannelSetupInput keeps its reader-backed channel fields through the dated migration window while plugins move them into plugin-local input types."
	},
	{
		code: "plugin-sdk-broad-runtime-barrels",
		...DEPRECATION_MARKING,
		owner: "sdk",
		replacement: "focused plugin SDK subpaths for each runtime capability; retain until bundled and published plugins no longer import any of the seven broad barrels",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"openclaw/plugin-sdk/agent-runtime",
			"openclaw/plugin-sdk/agent-runtime loadModelCatalog params.useCache",
			"openclaw/plugin-sdk/agent-runtime loadModelCatalog params.cacheOnly",
			"openclaw/plugin-sdk/agent-runtime loadModelCatalog params.metadataSnapshot",
			"openclaw/plugin-sdk/agent-runtime loadModelCatalog",
			"openclaw/plugin-sdk/cli-runtime",
			"openclaw/plugin-sdk/conversation-runtime",
			"openclaw/plugin-sdk/hook-runtime",
			"openclaw/plugin-sdk/media-runtime",
			"openclaw/plugin-sdk/media-runtime buildAgentMediaPayload",
			"openclaw/plugin-sdk/plugin-runtime",
			"openclaw/plugin-sdk/security-runtime"
		],
		diagnostics: ["TypeScript @deprecated annotations on broad plugin SDK barrels", "plugin boundary report compatibility inventory"],
		tests: ["src/plugins/contracts/plugin-sdk-subpaths.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Broad agent, CLI, conversation, hook, media, plugin, and security runtime barrels remain available while bundled and external plugins migrate to focused subpaths."
	},
	{
		code: "plugin-sdk-provider-owned-helper-shims",
		...DEPRECATION_MARKING,
		owner: "provider",
		replacement: "provider-local auth, model, replay, OAuth, and stream helper APIs; retain until every helper is migrated in official providers and absent from published plugins",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"openclaw/plugin-sdk/provider-stream MOONSHOT_THINKING_STREAM_HOOKS",
			"openclaw/plugin-sdk/provider-stream-shared defaultToolStreamExtraParams",
			"openclaw/plugin-sdk/provider-stream-shared stripTrailingAnthropicAssistantPrefillWhenThinking",
			"openclaw/plugin-sdk/provider-stream-shared createAnthropicThinkingPrefillPayloadWrapper",
			"openclaw/plugin-sdk/provider-stream-shared OpenAICompatibleThinkingLevel",
			"openclaw/plugin-sdk/provider-stream-shared isOpenAICompatibleThinkingEnabled",
			"openclaw/plugin-sdk/provider-stream-shared DeepSeekV4ThinkingLevel",
			"openclaw/plugin-sdk/provider-stream-shared DeepSeekV4ReasoningEffort",
			"openclaw/plugin-sdk/provider-stream-shared createDeepSeekV4OpenAICompatibleThinkingWrapper",
			"openclaw/plugin-sdk/provider-stream-shared createThinkingOnlyFinalTextWrapper",
			"openclaw/plugin-sdk/provider-stream-shared createGoogleThinkingPayloadWrapper",
			"openclaw/plugin-sdk/provider-stream-shared createGoogleThinkingStreamWrapper",
			"openclaw/plugin-sdk/provider-model-shared isProxyReasoningUnsupportedModelHint",
			"openclaw/plugin-sdk/provider-model-shared NATIVE_ANTHROPIC_REPLAY_HOOKS",
			"openclaw/plugin-sdk/provider-model-shared PASSTHROUGH_GEMINI_REPLAY_HOOKS",
			"openclaw/plugin-sdk/provider-auth toFormUrlEncoded",
			"openclaw/plugin-sdk/provider-auth generatePkceVerifierChallenge",
			"openclaw/plugin-sdk/provider-oauth-runtime OAuthProvider",
			"openclaw/plugin-sdk/provider-oauth-runtime OAuthProviderInfo"
		],
		diagnostics: ["TypeScript @deprecated annotations naming provider-local replacements", "plugin boundary report compatibility inventory"],
		tests: ["src/plugins/contracts/plugin-sdk-subpaths.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Provider-specific auth, model, replay, OAuth, and stream shortcuts remain as deprecated SDK shims while providers move to their local APIs."
	},
	{
		code: "message-presentation-legacy-bridges",
		...DEPRECATION_MARKING,
		owner: "channel",
		replacement: "MessagePresentation values and channel presentation renderers; retain until reply producers and official channel packages no longer emit or read legacy interactive replies",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"InteractiveReplyButton.value",
			"InteractiveReplyButton.url",
			"InteractiveReplyButton.webApp",
			"InteractiveReplyButton.web_app",
			"InteractiveReplyOption.value",
			"InteractiveReplyButton",
			"InteractiveReplyOption",
			"InteractiveReplyBlock",
			"InteractiveReply",
			"normalizeInteractiveReply",
			"hasInteractiveReplyBlocks",
			"presentationToInteractiveReply",
			"presentationToInteractiveControlsReply",
			"interactiveReplyToPresentation",
			"resolveInteractiveTextFallback",
			"src/auto-reply ReplyPayload.interactive",
			"openclaw/plugin-sdk/reply-payload ReplyPayload.interactive",
			"reduceInteractiveReply",
			"@openclaw/discord buildDiscordInteractiveComponents",
			"@openclaw/slack buildSlackInteractiveBlocks"
		],
		diagnostics: ["TypeScript @deprecated annotations naming MessagePresentation replacements", "plugin boundary report compatibility inventory"],
		tests: [
			"src/interactive/payload.test.ts",
			"src/plugin-sdk/reply-payload.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Legacy interactive reply values and channel-specific rendering bridges remain available while producers migrate to MessagePresentation."
	},
	{
		code: "plugin-sdk-focused-compat-aliases",
		...DEPRECATION_MARKING,
		owner: "sdk",
		replacement: "the focused replacement named by each TypeScript @deprecated annotation; retain until every enumerated alias has zero bundled and published readers",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"openclaw/plugin-sdk/acp-runtime __testing",
			"openclaw/plugin-sdk/channel-inbound BuildChannelTurnContextParams",
			"openclaw/plugin-sdk/channel-inbound BuiltChannelTurnContext",
			"openclaw/plugin-sdk/channel-inbound buildChannelTurnContext",
			"openclaw/plugin-sdk/channel-inbound finalizeChannelInboundContext",
			"openclaw/plugin-sdk/channel-inbound filterChannelTurnSupplementalContext",
			"openclaw/plugin-sdk/channel-send-result ChannelSendRawResult",
			"openclaw/plugin-sdk/keyed-async-queue KeyedAsyncQueue.getTailMapForTesting",
			"openclaw/plugin-sdk/persistent-dedupe PersistentDedupeLegacyPathOptions.lockOptions",
			"openclaw/plugin-sdk/retry-runtime createTelegramRetryRunner",
			"openclaw/plugin-sdk/ssrf-policy SsrfPolicyOptions.allowPrivateNetwork",
			"openclaw/plugin-sdk/ssrf-policy ssrfPolicyFromAllowPrivateNetwork",
			"openclaw/plugin-sdk/tts-runtime TtsSynthesisStreamResult",
			"openclaw/plugin-sdk/tts-runtime TtsRuntimeFacade._test"
		],
		diagnostics: ["TypeScript @deprecated annotations naming focused replacements", "plugin boundary report compatibility inventory"],
		tests: [
			"src/plugin-sdk/channel-inbound.test.ts",
			"src/plugin-sdk/ssrf-policy.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Focused SDK compatibility aliases remain available through a dated window while callers adopt their annotated replacements."
	},
	{
		code: "agent-harness-terminal-result-aliases",
		...DEPRECATION_MARKING,
		owner: "agent-runtime",
		replacement: "AgentHarnessAttemptResult.terminal and AgentHarnessDeliveryDefaults.visibleReplies; retain until harness migration verifies that legacy terminal fields and sourceVisibleReplies are unread",
		docsPath: "/plugins/sdk-agent-harness",
		surfaces: [
			"AgentHarnessAttemptResult.aborted",
			"AgentHarnessAttemptResult.externalAbort",
			"AgentHarnessAttemptResult.timedOut",
			"AgentHarnessAttemptResult.idleTimedOut",
			"AgentHarnessAttemptResult.timedOutDuringCompaction",
			"AgentHarnessAttemptResult.timedOutDuringToolExecution",
			"AgentHarnessAttemptResult.timedOutByRunBudget",
			"AgentHarnessAttemptResult.promptError",
			"AgentHarnessAttemptResult.promptErrorSource",
			"AgentHarnessDeliveryDefaults.sourceVisibleReplies"
		],
		diagnostics: ["TypeScript @deprecated annotations on agent harness result and delivery defaults", "plugin boundary report compatibility inventory"],
		tests: ["src/agents/harness/settled-turn-finalization-result.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Agent harness result booleans and sourceVisibleReplies remain available while harnesses migrate to terminal outcomes and visibleReplies."
	},
	{
		code: "official-plugin-export-aliases",
		...DEPRECATION_MARKING,
		owner: "channel",
		replacement: "MessagePresentation renderers and host-owned timeout/runtime behavior; retain until minimum supported official plugin packages no longer import these aliases",
		docsPath: "/plugins/compatibility#current-compatibility-areas",
		surfaces: [
			"@openclaw/discord buildDiscordInteractiveComponents",
			"@openclaw/discord normalizeDiscordListenerTimeoutMs",
			"@openclaw/discord normalizeDiscordInboundWorkerTimeoutMs",
			"@openclaw/discord isAbortError",
			"@openclaw/discord runDiscordTaskWithTimeout",
			"@openclaw/slack buildSlackInteractiveBlocks"
		],
		diagnostics: ["TypeScript @deprecated annotations on published official-plugin exports", "plugin boundary report compatibility inventory"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "Published channel presentation and Discord timeout aliases remain available while consumers move to their canonical exports and host-owned behavior."
	},
	{
		code: "memory-host-compatibility-aliases",
		...DEPRECATION_MARKING,
		owner: "sdk",
		replacement: "canonical memory cache/FTS tables; retain until supported memory integrations are verified to use canonical tables without overrides and legacy table data remains preserved",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: ["@openclaw/memory-host-sdk ensureMemoryIndexSchema.embeddingCacheTable", "@openclaw/memory-host-sdk ensureMemoryIndexSchema.ftsTable"],
		diagnostics: ["TypeScript @deprecated annotations on memory-host SDK compatibility fields", "plugin boundary report memory-host SDK summary"],
		tests: ["packages/memory-host-sdk/src/host/memory-schema.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Memory-host table overrides remain available until supported artifact usage and legacy data preservation are verified."
	},
	{
		code: "plugin-runtime-api-compat-aliases",
		...DEPRECATION_MARKING,
		owner: "plugin-execution",
		replacement: "the namespaced plugin API and focused runtime methods named per surface; retain until all enumerated flat API and runtime aliases have no readers",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"OpenClawPluginApi.registerSessionExtension",
			"OpenClawPluginApi.enqueueNextTurnInjection",
			"OpenClawPluginApi.registerControlUiDescriptor",
			"OpenClawPluginApi.registerRuntimeLifecycle",
			"OpenClawPluginApi.registerAgentEventSubscription",
			"OpenClawPluginApi.emitAgentEvent",
			"OpenClawPluginApi.setRunContext",
			"OpenClawPluginApi.getRunContext",
			"OpenClawPluginApi.clearRunContext",
			"OpenClawPluginApi.registerSessionSchedulerJob",
			"OpenClawPluginApi.registerSessionAction",
			"OpenClawPluginApi.sendSessionAttachment",
			"OpenClawPluginApi.scheduleSessionTurn",
			"OpenClawPluginApi.unscheduleSessionTurnsByTag",
			"PluginHookContext.senderExternalId",
			"PluginAttachmentChannelHints.telegram",
			"PluginAttachmentChannelHints.slack",
			"AgentPromptSurfaceKind pi_main",
			"PluginRuntime.channel.reply.createReplyDispatcherWithTyping",
			"PluginRuntime.channel.reply.resolveHumanDelayConfig",
			"PluginRuntime.channel.reply.dispatchReplyFromConfig",
			"PluginRuntime.channel.reply.finalizeInboundContext",
			"PluginRuntime.channel.media.fetchRemoteMedia",
			"PluginRuntime.channel.session.resolveStorePath",
			"PluginRuntime.channel.session.recordInboundSession",
			"PluginRuntime.channel.inbound.runPreparedReply",
			"PluginRuntime.channel.turn",
			"PluginRuntime.system.requestHeartbeatNow"
		],
		diagnostics: ["TypeScript @deprecated annotations on plugin API and runtime aliases", "plugin boundary report compatibility inventory"],
		tests: [
			"src/plugins/captured-registration.test.ts",
			"src/plugins/runtime/index.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Flat plugin registration and broad runtime aliases remain available while plugins migrate to namespaced APIs and focused runtime methods."
	},
	{
		code: "plugin-provider-manifest-compat-aliases",
		...DEPRECATION_MARKING,
		owner: "provider",
		replacement: "manifest-owned plugin kind/setup metadata and model catalog registration; retain until providers no longer publish runtime kind or legacy catalog hooks",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"DefinePluginEntryOptions.kind",
			"SingleProviderPluginOptions.kind",
			"OpenClawPluginDefinition.kind",
			"PluginPackageChannel.cliAddOptions",
			"ProviderPlugin.catalog",
			"ProviderPlugin.staticCatalog",
			"ProviderPlugin.suppressBuiltInModel",
			"ProviderPlugin.augmentModelCatalog",
			"ProviderBuiltInModelSuppressionContext"
		],
		diagnostics: ["TypeScript @deprecated annotations on plugin manifest and provider catalog aliases", "plugin boundary report compatibility inventory"],
		tests: [
			"src/plugins/contracts/package-manifest.contract.test.ts",
			"src/plugins/contracts/provider-catalog-deprecation.contract.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Runtime plugin kind/setup metadata and provider catalog hooks remain available while plugins migrate ownership into manifests and catalog registrations."
	}
];
//#endregion
//#region src/plugins/compat/plugin-sdk-subpath-records.ts
const PLUGIN_SDK_SUBPATH_SEEDS = [
	{
		code: "plugin-sdk-channel-streaming-subpath",
		subpath: "channel-streaming",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-outbound`",
		releaseNote: "The deprecated `channel-streaming` Plugin SDK subpath was removed; plugins now import channel streaming helpers from `channel-outbound`."
	},
	{
		code: "plugin-sdk-config-runtime-subpath",
		subpath: "config-runtime",
		status: "removed",
		owner: "config",
		replacement: "`api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`",
		releaseNote: "The deprecated `config-runtime` Plugin SDK facade was removed by the approved September 30 retirement; migrate to `api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`."
	},
	{
		code: "plugin-sdk-inbound-reply-dispatch-subpath",
		subpath: "inbound-reply-dispatch",
		owner: "channel",
		removalGate: "next-plugin-sdk-major",
		replacement: "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`"
	},
	{
		code: "plugin-sdk-channel-reply-pipeline-subpath",
		subpath: "channel-reply-pipeline",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-outbound`",
		releaseNote: "The deprecated `channel-reply-pipeline` Plugin SDK facade was removed by the approved September 30 retirement; migrate to `openclaw/plugin-sdk/channel-outbound`."
	},
	{
		code: "plugin-sdk-infra-runtime-subpath",
		subpath: "infra-runtime",
		status: "removed",
		owner: "sdk",
		replacement: "focused typed subpaths including `openclaw/plugin-sdk/system-event-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/approval-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`; use injected runtime APIs for host operations without a public subpath",
		releaseNote: "The deprecated `infra-runtime` Plugin SDK facade was removed by the approved September 30 retirement; migrate to focused typed subpaths including `openclaw/plugin-sdk/system-event-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/approval-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`; use injected runtime APIs for host operations without a public subpath."
	},
	{
		code: "plugin-sdk-text-runtime-subpath",
		subpath: "text-runtime",
		status: "removed",
		owner: "sdk",
		replacement: "`openclaw/plugin-sdk/logging-core`, `openclaw/plugin-sdk/text-chunking`, `openclaw/plugin-sdk/text-utility-runtime`, and `openclaw/plugin-sdk/string-coerce-runtime`",
		releaseNote: "The deprecated `text-runtime` Plugin SDK facade was removed; plugins now import logging, chunking, text utility, and string coercion helpers from their focused subpaths."
	},
	{
		code: "plugin-sdk-channel-secret-runtime-subpath",
		subpath: "channel-secret-runtime",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-secret-basic-runtime` and `openclaw/plugin-sdk/channel-secret-tts-runtime`",
		releaseNote: "The deprecated `channel-secret-runtime` Plugin SDK subpath was removed; plugins now use the focused basic and TTS secret-runtime subpaths."
	},
	{
		code: "plugin-sdk-agent-config-primitives-subpath",
		subpath: "agent-config-primitives",
		status: "removed",
		owner: "config",
		replacement: "`openclaw/plugin-sdk/channel-config-schema`",
		releaseNote: "The deprecated `agent-config-primitives` Plugin SDK subpath was removed; plugins now use maintained config-schema primitives."
	},
	{
		code: "plugin-sdk-matrix-subpath",
		subpath: "matrix",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/run-command`",
		releaseNote: "The deprecated `matrix` Plugin SDK facade was removed; command execution now uses the generic `run-command` subpath."
	},
	{
		code: "plugin-sdk-channel-logging-subpath",
		subpath: "channel-logging",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`",
		releaseNote: "The deprecated `channel-logging` Plugin SDK subpath was removed; channel logging helpers now come from the inbound and outbound channel surfaces."
	},
	{
		code: "plugin-sdk-channel-lifecycle-subpath",
		subpath: "channel-lifecycle",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-outbound`",
		releaseNote: "The deprecated `channel-lifecycle` Plugin SDK facade was removed by the approved September 30 retirement; migrate to `openclaw/plugin-sdk/channel-outbound`."
	},
	{
		code: "plugin-sdk-channel-message-subpath",
		subpath: "channel-message",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`",
		releaseNote: "The deprecated `channel-message` Plugin SDK facade was removed by the approved September 30 retirement; migrate to `openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`."
	},
	{
		code: "plugin-sdk-group-access-subpath",
		subpath: "group-access",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-ingress-runtime`",
		releaseNote: "The deprecated `group-access` Plugin SDK subpath was removed; plugins now resolve message admission through `channel-ingress-runtime`."
	},
	{
		code: "plugin-sdk-zod-subpath",
		subpath: "zod",
		status: "removed",
		owner: "sdk",
		replacement: "the direct `zod` package import",
		releaseNote: "The deprecated `zod` Plugin SDK re-export was removed; plugins now import `zod` directly."
	}
];
function buildPluginSdkSubpathRecord(seed) {
	const shared = {
		code: seed.code,
		owner: seed.owner,
		introduced: "2026-07-06",
		replacement: seed.replacement,
		docsPath: "/plugins/sdk-migration",
		surfaces: [`openclaw/plugin-sdk/${seed.subpath}`],
		tests: ["src/plugins/compat/registry.test.ts"]
	};
	if ("status" in seed && seed.status === "removed") return {
		...shared,
		status: seed.status,
		diagnostics: ["plugin SDK compatibility registry and migration guide"],
		releaseNote: seed.releaseNote
	};
	return {
		...shared,
		status: "status" in seed ? seed.status : "deprecated",
		deprecated: "2026-07-06",
		warningStarts: "2026-07-06",
		removalGate: "removalGate" in seed ? seed.removalGate : void 0,
		diagnostics: ["repository deprecated API usage guard for core and bundled plugins; no external runtime import warning"]
	};
}
const PLUGIN_SDK_SUBPATH_RECORDS = PLUGIN_SDK_SUBPATH_SEEDS.map(buildPluginSdkSubpathRecord);
const BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_SEEDS = [
	{
		subpath: "media-understanding",
		status: "removal-pending",
		removeAfter: "2026-09-30",
		replacement: "`api.registerMediaUnderstandingProvider(...)` with provider-owned request helpers and types from `openclaw/plugin-sdk/plugin-entry`; retain the public subpath through the 2026-09-30 window while official plugin consumers migrate",
		docsPath: "/plugins/architecture"
	},
	{
		subpath: "memory-host-core",
		status: "removal-pending",
		removeAfter: "2026-09-30",
		replacement: "host-prepared memory prompts via `openclaw/plugin-sdk/core` and memory capability registration through the injected plugin API; retain the facade through the 2026-09-30 window and until a focused public-artifact read seam exists",
		docsPath: "/plugins/architecture-internals#context-engine-plugins"
	},
	{
		subpath: "plugin-config-runtime",
		status: "removal-pending",
		removeAfter: "2026-12-01",
		replacement: "`api.pluginConfig`, runtime tool context config, and focused `config-contracts`, `runtime-config-snapshot`, or `config-mutation` subpaths; retain the public subpath through the 2026-12-01 window while official plugin consumers migrate",
		docsPath: "/plugins/sdk-runtime"
	},
	{
		subpath: "tool-plugin",
		status: "deprecated",
		replacement: "retain the public subpath until plugin authoring has a nonexecuting static metadata replacement for `defineToolPlugin`; `getToolPluginMetadata` currently reads metadata only from an already-executed entry",
		docsPath: "/plugins/tool-plugins"
	}
];
function buildPublicSdkSubpathRecord({ subpath, ...compat }) {
	return {
		code: `plugin-sdk-${subpath}-public-demotion`,
		owner: "sdk",
		introduced: "2026-07-15",
		deprecated: "2026-07-15",
		warningStarts: "2026-07-15",
		...compat,
		surfaces: [`openclaw/plugin-sdk/${subpath}`],
		diagnostics: ["registry-backed public SDK demotion window; no external runtime import warning"],
		tests: ["src/plugins/compat/registry.test.ts"]
	};
}
const BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_RECORDS = BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_SEEDS.map(buildPublicSdkSubpathRecord);
//#endregion
//#region src/plugins/compat/session-persistence-records.ts
const SESSION_PERSISTENCE_COMPAT_RECORDS = [
	{
		code: "native-session-generation-sync-authority",
		status: "deprecated",
		owner: "agent-runtime",
		introduced: "2026-09-22",
		deprecated: "2026-10-03",
		warningStarts: "2026-10-03",
		removalGate: "next-plugin-sdk-major",
		replacement: "Await prepareNativeSessionGenerationAuthority, resolveNativeSessionBindingWithAuthority, and reclaimNativeSessionGenerationWithAuthority with NativeSessionGenerationOperationsV2. Retain released synchronous capture and two-argument mutation callbacks until published official harness readers migrate and a breaking release is explicitly approved.",
		docsPath: "/plugins/sdk-migration/compatibility-policy#native-session-generation-authority",
		surfaces: [
			"captureNativeSessionGenerationAuthority",
			"resolveNativeSessionBinding",
			"reclaimNativeSessionGeneration",
			"NativeSessionGenerationOperations"
		],
		diagnostics: ["TypeScript @deprecated annotations and migration documentation; no runtime warnings"],
		tests: [
			"src/plugin-sdk/agent-harness-session-compat.test.ts",
			"src/agents/harness/native-session/binding-generation.test.ts",
			"src/agents/harness/native-session/binding-generation-authority.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Native harnesses can admit binding operations through worker-backed session authority. Released official harness plugins retain synchronous authority capture and lineage-checking mutation callbacks across host upgrades."
	},
	{
		code: "session-manager-sync-persistence",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-10-01",
		deprecated: "2026-10-01",
		warningStarts: "2026-10-01",
		removalGate: "next-plugin-sdk-major",
		replacement: "Await the matching Async-suffixed SessionManager method, including the returned rewrite commit. Retain synchronous adapters only for shipped third-party contracts until the next Plugin SDK major and explicit breaking-release approval.",
		docsPath: "/plugins/sdk-migration/how-to-migrate#await-session-transcript-persistence",
		surfaces: [
			"SessionManager.appendMessage",
			"SessionManager.appendMessageWithTranscriptAnchor",
			"SessionManager.appendCompaction",
			"SessionManager.appendResetBoundary",
			"SessionManager.appendCustomEntry",
			"SessionManager.appendSessionInfo",
			"SessionManager.appendCustomMessageEntry",
			"SessionManager.appendLeafControl",
			"SessionManager.appendLabelChange",
			"SessionManager.branch",
			"SessionManager.branchWithSummary",
			"SessionManager.removeTrailingEntries",
			"SessionManager.persist",
			"SessionManager.prepareTranscriptRewrite",
			"SessionManager.appendMessageToTranscript",
			"SessionManager.open",
			"SessionManager.openBounded",
			"SessionManager.openDetachedBounded",
			"SessionManager.openModelContext",
			"SessionManager.setSessionTarget",
			"SessionManager.reloadPersistedTranscript"
		],
		diagnostics: ["TypeScript @deprecated annotations naming awaited twins", "one runtime DEP_SESSION_PERSISTENCE warning per method per process"],
		tests: [
			"src/plugins/compat/registry.test.ts",
			"src/agents/sessions/session-manager-async-entries.test.ts",
			"src/agents/sessions/session-manager-async-message.test.ts",
			"src/agents/sessions/session-manager-maintenance-async.test.ts"
		],
		releaseNote: "Plugins can await SessionManager transcript mutations through the existing SQLite worker. Synchronous methods retain their shipped return values as deprecated third-party adapters until the next Plugin SDK major; storage formats and update behavior are unchanged."
	},
	{
		code: "extension-session-sync-persistence",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-10-01",
		deprecated: "2026-10-01",
		warningStarts: "2026-10-01",
		removalGate: "next-plugin-sdk-major",
		replacement: "Await ExtensionAPI.appendEntryAsync, setSessionNameAsync, and setLabelAsync, and AgentSession.setSessionNameAsync. Existing synchronous third-party methods retain their void return contract until the next Plugin SDK major and explicit breaking-release approval.",
		docsPath: "/plugins/sdk-migration/how-to-migrate#await-extension-session-changes",
		surfaces: [
			"ExtensionAPI.appendEntry",
			"ExtensionAPI.setSessionName",
			"ExtensionAPI.setLabel",
			"AgentSession.setSessionName"
		],
		diagnostics: ["TypeScript @deprecated annotations, migration guide, and once-per-method DEP_SESSION_PERSISTENCE warning"],
		tests: ["src/plugins/compat/registry.test.ts", "src/agents/sessions/sdk.metadata-admission.test.ts"],
		releaseNote: "Extensions can await transcript entries, session names, and labels; the shipped synchronous methods remain third-party compatibility adapters through the next Plugin SDK major."
	},
	{
		code: "provider-replay-sync-persistence",
		status: "deprecated",
		owner: "provider",
		introduced: "2026-10-01",
		deprecated: "2026-10-01",
		warningStarts: "2026-10-01",
		removalGate: "next-plugin-sdk-major",
		replacement: "Use ProviderPlugin.sanitizeReplayHistoryAsync with ProviderSanitizeReplayHistoryContextV2 and await ProviderReplaySessionStateV2.appendCustomEntryAsync; use sanitizeGoogleGeminiReplayHistoryAsync for the shared Gemini implementation. Retain legacy third-party contexts and hooks until the next Plugin SDK major and explicit breaking-release approval.",
		docsPath: "/plugins/sdk-migration/how-to-migrate#await-provider-replay-metadata",
		surfaces: [
			"ProviderPlugin.sanitizeReplayHistory",
			"ProviderReplaySessionState.appendCustomEntry",
			"sanitizeGoogleGeminiReplayHistory"
		],
		diagnostics: ["TypeScript @deprecated annotations, versioned migration guide, and once-per-method DEP_SESSION_PERSISTENCE warning"],
		tests: [
			"src/plugins/compat/registry.test.ts",
			"src/plugins/provider-replay-helpers.test.ts",
			"src/plugins/provider-runtime.test.ts",
			"src/plugin-sdk/provider-model-shared.test.ts"
		],
		releaseNote: "Provider replay hooks can await committed transcript metadata through additive V2 context types. Legacy hooks, context types, and the synchronous Gemini helper remain available for third-party migration through the next Plugin SDK major."
	}
];
//#endregion
//#region src/plugins/compat/registry-records.ts
const ACTIVATION_HINT_METADATA = {
	status: "active",
	owner: "plugin-execution",
	introduced: "2026-04-24",
	docsPath: "/plugins/manifest",
	diagnostics: ["activation plan compat reason"],
	tests: ["src/plugins/activation-planner.test.ts"]
};
[
	...SESSION_PERSISTENCE_COMPAT_RECORDS,
	...AGENT_LIST_RUNTIME_PROJECTION_COMPAT_RECORDS,
	...PLUGIN_SDK_SUBPATH_RECORDS,
	...BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_RECORDS,
	...DEPRECATION_MARKING_COMPAT_RECORDS,
	{ ...ACTIVATION_HINT_METADATA },
	{ ...ACTIVATION_HINT_METADATA },
	{ ...ACTIVATION_HINT_METADATA },
	{ ...ACTIVATION_HINT_METADATA },
	{ ...ACTIVATION_HINT_METADATA },
	{ ...ACTIVATION_HINT_METADATA },
	{ ...ACTIVATION_HINT_METADATA }
];
//#endregion
//#region src/plugins/installed-plugin-index-hash.ts
/** Hashes JSON-serializable data with SHA-256. */
function hashJson(value) {
	return sha256Hex(JSON.stringify(value));
}
/** Hashes JSON-like data independently of object property insertion order. */
function hashStableJson(value) {
	return sha256Hex(stableStringify(value));
}
//#endregion
//#region src/plugins/installed-plugin-index-policy.ts
/** Hashes config policy inputs that can change installed plugin activation. */
function resolveInstalledPluginIndexPolicyHash(config, env, behavior = {}) {
	const normalized = normalizePluginsConfig(config?.plugins);
	const channelPolicy = {};
	const channels = config?.channels;
	if (channels && typeof channels === "object" && !Array.isArray(channels)) {
		for (const [channelId, value] of Object.entries(channels)) if (value && typeof value === "object" && !Array.isArray(value)) {
			const enabled = value.enabled;
			if (typeof enabled === "boolean") channelPolicy[channelId] = enabled;
		}
	}
	return hashJson({
		plugins: {
			enabled: normalized.enabled,
			allow: normalized.allow,
			deny: normalized.deny,
			bundledDiscovery: readBundledDiscoveryModeMemoized(env, behavior) ?? null,
			slots: normalized.slots,
			entries: Object.fromEntries(Object.entries(normalized.entries).flatMap(([pluginId, entry]) => typeof entry.enabled === "boolean" ? [[pluginId, entry.enabled]] : []).toSorted(([left], [right]) => left.localeCompare(right)))
		},
		channels: Object.fromEntries(Object.entries(channelPolicy).toSorted(([left], [right]) => left.localeCompare(right)))
	});
}
//#endregion
//#region src/plugins/bundled-load-path-aliases.ts
const PACKAGED_BUNDLED_ROOTS = [path.join("dist", "extensions"), path.join("dist-runtime", "extensions")];
/** Normalizes bundled lookup paths without preserving trailing separators. */
function normalizeBundledLookupPath(targetPath) {
	const normalized = path.normalize(targetPath);
	const root = path.parse(normalized).root;
	let trimmed = normalized;
	while (trimmed.length > root.length && (trimmed.endsWith(path.sep) || trimmed.endsWith("/"))) trimmed = trimmed.slice(0, -1);
	return trimmed;
}
function findPackagedBundledRoot(localPath) {
	const normalized = normalizeBundledLookupPath(localPath);
	for (const packagedRoot of PACKAGED_BUNDLED_ROOTS) {
		const marker = `${path.sep}${packagedRoot}`;
		const markerIndex = normalized.lastIndexOf(marker);
		if (markerIndex === -1) continue;
		const markerEnd = markerIndex + marker.length;
		if (normalized.length !== markerEnd && normalized[markerEnd] !== path.sep) continue;
		return {
			packageRoot: normalized.slice(0, markerIndex),
			bundledRoot: normalized.slice(0, markerEnd)
		};
	}
	return null;
}
/** Builds the legacy extensions root for a packaged bundled plugin root. */
function buildLegacyBundledRootPath(localPath) {
	const packaged = findPackagedBundledRoot(localPath);
	return packaged ? path.join(packaged.packageRoot, "extensions") : null;
}
//#endregion
//#region src/plugins/bundled-source-overlays.ts
/** Parses Linux mountinfo content into absolute mount points. */
function parseLinuxMountInfoMountPoints(mountInfo) {
	const mountPoints = /* @__PURE__ */ new Set();
	for (const line of mountInfo.split(/\r?\n/u)) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		const mountPoint = trimmed.split(" ")[4];
		if (!mountPoint) continue;
		mountPoints.add(path.resolve(decodeMountInfoPath(mountPoint)));
	}
	return mountPoints;
}
function readLinuxMountPoints() {
	const metadata = getPluginCache().metadata;
	if (!metadata.discoveryMountPoints) try {
		metadata.discoveryMountPoints = parseLinuxMountInfoMountPoints(fsSync.readFileSync("/proc/self/mountinfo", "utf8"));
	} catch {
		metadata.discoveryMountPoints = /* @__PURE__ */ new Set();
	}
	return metadata.discoveryMountPoints;
}
function isFilesystemMountPoint(targetPath) {
	const target = pluginCacheStatSync(targetPath);
	const parent = pluginCacheStatSync(path.dirname(targetPath));
	return Boolean(target && parent && (target.dev !== parent.dev || target.ino === parent.ino));
}
function sourceOverlaysDisabled(env) {
	const raw = normalizeOptionalLowercaseString(env.OPENCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS);
	return raw === "1" || raw === "true";
}
/** True when a path appears to be a mounted bundled source overlay. */
function isBundledSourceOverlayPath(params) {
	const resolved = path.resolve(params.sourcePath);
	return (params.mountPoints ?? readLinuxMountPoints()).has(resolved) || isFilesystemMountPoint(resolved);
}
/** Lists source overlay directories that shadow packaged bundled plugin dirs. */
function listBundledSourceOverlayDirs(params) {
	if (sourceOverlaysDisabled(params.env ?? process.env) || !params.bundledRoot) return [];
	const legacyRoot = buildLegacyBundledRootPath(params.bundledRoot);
	if (!legacyRoot || !pluginCacheExistsSync(legacyRoot)) return [];
	let entries;
	try {
		entries = readPluginCacheDirectory(legacyRoot);
	} catch {
		return [];
	}
	const mountPoints = params.mountPoints ?? readLinuxMountPoints();
	const legacyRootMounted = isBundledSourceOverlayPath({
		sourcePath: legacyRoot,
		mountPoints
	});
	const overlayDirs = [];
	for (const entry of entries) {
		if (!entry.isDirectory()) continue;
		const sourceDir = path.join(legacyRoot, entry.name);
		if (!pluginCacheExistsSync(path.join(params.bundledRoot, entry.name))) continue;
		if (!legacyRootMounted && !isBundledSourceOverlayPath({
			sourcePath: sourceDir,
			mountPoints
		})) continue;
		overlayDirs.push(sourceDir);
	}
	return overlayDirs.toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/plugins/candidate-install-owner.ts
const PLUGIN_CANDIDATE_INSTALL_OWNER = Symbol.for("openclaw.pluginCandidateInstallOwner");
function recordPluginCandidateInstallOwner(candidate, installOwner, ambiguous = false) {
	if (!installOwner && !ambiguous) return candidate;
	Object.defineProperty(candidate, PLUGIN_CANDIDATE_INSTALL_OWNER, {
		configurable: true,
		enumerable: true,
		value: ambiguous ? { ambiguous: true } : { installOwner }
	});
	return candidate;
}
function readPluginCandidateInstallOwner(candidate) {
	return candidate[PLUGIN_CANDIDATE_INSTALL_OWNER];
}
function resolvePluginCandidateInstallOwner(candidate) {
	return readPluginCandidateInstallOwner(candidate)?.installOwner;
}
function isPluginCandidateInstallOwnerAmbiguous(candidate) {
	return readPluginCandidateInstallOwner(candidate)?.ambiguous === true;
}
//#endregion
//#region packages/llm-core/src/model-data.ts
const MODEL_DATA_APIS = [
	"openai-completions",
	"openai-responses",
	"openai-chatgpt-responses",
	"anthropic-messages",
	"google-generative-ai",
	"google-interactions",
	"google-vertex",
	"github-copilot",
	"bedrock-converse-stream",
	"ollama",
	"pi-messages",
	"azure-openai-responses"
];
const MODEL_DATA_THINKING_FORMATS = [
	"openai",
	"openrouter",
	"deepseek",
	"together",
	"qwen",
	"qwen-chat-template",
	"zai"
];
const MODEL_DATA_THINKING_LEVELS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
//#endregion
//#region packages/model-catalog-core/src/model-catalog-types.ts
/** Supported API protocols for model catalog entries. */
const MODEL_CATALOG_APIS = [...MODEL_DATA_APIS];
/** Supported model thinking/reasoning wire formats. */
const MODEL_CATALOG_THINKING_FORMATS = [...MODEL_DATA_THINKING_FORMATS];
/** Narrow a string to a supported model catalog thinking format. */
function isModelCatalogThinkingFormat(value) {
	return MODEL_CATALOG_THINKING_FORMATS.includes(value);
}
/** Model-level thinking settings carried by provider catalog metadata. */
const MODEL_CATALOG_THINKING_LEVELS = [...MODEL_DATA_THINKING_LEVELS];
//#endregion
//#region packages/model-catalog-core/src/model-catalog-context-windows.ts
function normalizePositiveInteger$1(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function normalizeModelCatalogContextWindows(value) {
	if (!Array.isArray(value)) return;
	const seen = /* @__PURE__ */ new Set();
	const contextWindows = value.slice(0, 16).flatMap((entry) => {
		if (!isRecord(entry)) return [];
		const id = normalizeOptionalString(entry.id) ?? "";
		const label = normalizeOptionalString(entry.label) ?? "";
		const contextWindow = normalizePositiveInteger$1(entry.contextWindow);
		if (!id || !label || contextWindow === void 0 || seen.has(id)) return [];
		seen.add(id);
		return [{
			id,
			label,
			contextWindow
		}];
	});
	return contextWindows.length > 0 ? contextWindows.toSorted((left, right) => left.contextWindow - right.contextWindow || left.id.localeCompare(right.id)) : void 0;
}
function normalizeModelCatalogContextWindowSelection(value) {
	const contextWindows = normalizeModelCatalogContextWindows(value.contextWindows);
	const contextWindowDefault = normalizeOptionalString(value.contextWindowDefault);
	return contextWindowDefault && contextWindows?.some((option) => option.id === contextWindowDefault) ? {
		contextWindows,
		contextWindowDefault
	} : {};
}
//#endregion
//#region packages/model-catalog-core/src/model-catalog-normalize.ts
const MODEL_CATALOG_INPUTS = /* @__PURE__ */ new Set([
	"text",
	"image",
	"document"
]);
const MODEL_CATALOG_DISCOVERY_MODES = /* @__PURE__ */ new Set([
	"static",
	"refreshable",
	"runtime"
]);
const MODEL_CATALOG_STATUSES = /* @__PURE__ */ new Set([
	"available",
	"preview",
	"deprecated",
	"disabled"
]);
const MODEL_CATALOG_API_SET = new Set(MODEL_CATALOG_APIS);
/** Reject object keys that can mutate prototypes when copied into records. */
function isBlockedObjectKey(key) {
	return key === "__proto__" || key === "prototype" || key === "constructor";
}
function normalizeModelCatalogThinkingLevelMap(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const level of MODEL_CATALOG_THINKING_LEVELS) {
		const mapped = value[level];
		if (mapped === null) {
			normalized[level] = null;
			continue;
		}
		const normalizedValue = normalizeOptionalString(mapped);
		if (normalizedValue !== void 0) normalized[level] = normalizedValue;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeStringMap(value) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [rawKey, rawValue] of Object.entries(value)) {
		const key = normalizeOptionalString(rawKey);
		const mapValue = normalizeOptionalString(rawValue) ?? "";
		if (key && !isBlockedObjectKey(key) && mapValue) normalized[key] = mapValue;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeModelCatalogApi(value) {
	const api = normalizeOptionalString(value) ?? "";
	return MODEL_CATALOG_API_SET.has(api) ? api : void 0;
}
function normalizeModelCatalogInputs(value) {
	const inputs = normalizeTrimmedStringList(value).filter((input) => MODEL_CATALOG_INPUTS.has(input));
	return inputs.length > 0 ? inputs : void 0;
}
function normalizePositiveInteger(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function normalizeModelCatalogTieredCost(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (!isRecord(entry) || !Array.isArray(entry.range)) continue;
		const input = asNonNegativeFiniteNumber(entry.input);
		const output = asNonNegativeFiniteNumber(entry.output);
		const cacheRead = asNonNegativeFiniteNumber(entry.cacheRead);
		const cacheWrite = asNonNegativeFiniteNumber(entry.cacheWrite);
		if (input === void 0 || output === void 0 || cacheRead === void 0 || cacheWrite === void 0 || entry.range.length < 1 || entry.range.length > 2) continue;
		const rangeValues = entry.range.map((rangeValue) => asNonNegativeFiniteNumber(rangeValue));
		if (rangeValues.some((rangeValue) => rangeValue === void 0)) continue;
		normalized.push({
			input,
			output,
			cacheRead,
			cacheWrite,
			range: rangeValues.length === 1 ? [rangeValues[0]] : [rangeValues[0], rangeValues[1]]
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeModelCatalogCost(value) {
	if (!isRecord(value)) return;
	const cost = {};
	for (const field of [
		"input",
		"output",
		"cacheRead",
		"cacheWrite"
	]) {
		const normalized = asNonNegativeFiniteNumber(value[field]);
		if (normalized !== void 0) cost[field] = normalized;
	}
	const tieredPricing = normalizeModelCatalogTieredCost(value.tieredPricing);
	if (tieredPricing) cost.tieredPricing = tieredPricing;
	return Object.keys(cost).length > 0 ? cost : void 0;
}
function normalizeOpenRouterPrice(value) {
	if (!isRecord(value)) return;
	const maxPrice = {};
	for (const field of [
		"prompt",
		"completion",
		"image",
		"audio",
		"request"
	]) {
		const candidate = value[field];
		const normalized = normalizeOptionalString(candidate) ?? asFiniteNumber(candidate);
		if (normalized !== void 0) maxPrice[field] = normalized;
	}
	return Object.keys(maxPrice).length > 0 ? maxPrice : void 0;
}
function normalizeOpenRouterMetricPreference(value) {
	const numeric = asFiniteNumber(value);
	if (numeric !== void 0) return numeric;
	if (!isRecord(value)) return;
	const normalized = {};
	for (const field of [
		"p50",
		"p75",
		"p90",
		"p99"
	]) {
		const cutoff = asFiniteNumber(value[field]);
		if (cutoff !== void 0) normalized[field] = cutoff;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeOpenRouterSort(value) {
	const sort = normalizeOptionalString(value);
	if (sort) return sort;
	if (!isRecord(value)) return;
	const by = normalizeOptionalString(value.by);
	const partition = value.partition === null ? null : normalizeOptionalString(value.partition) ?? void 0;
	const normalized = {
		...by ? { by } : {},
		...partition !== void 0 ? { partition } : {}
	};
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeOpenRouterRouting(value) {
	if (!isRecord(value)) return;
	const routing = {
		...typeof value.allow_fallbacks === "boolean" ? { allow_fallbacks: value.allow_fallbacks } : {},
		...typeof value.require_parameters === "boolean" ? { require_parameters: value.require_parameters } : {},
		...value.data_collection === "deny" || value.data_collection === "allow" ? { data_collection: value.data_collection } : {},
		...typeof value.zdr === "boolean" ? { zdr: value.zdr } : {},
		...typeof value.enforce_distillable_text === "boolean" ? { enforce_distillable_text: value.enforce_distillable_text } : {}
	};
	for (const field of [
		"order",
		"only",
		"ignore",
		"quantizations"
	]) {
		const normalized = normalizeOptionalTrimmedStringList(value[field]);
		if (normalized) routing[field] = normalized;
	}
	const sort = normalizeOpenRouterSort(value.sort);
	if (sort) routing.sort = sort;
	const maxPrice = normalizeOpenRouterPrice(value.max_price);
	if (maxPrice) routing.max_price = maxPrice;
	for (const field of ["preferred_min_throughput", "preferred_max_latency"]) {
		const normalized = normalizeOpenRouterMetricPreference(value[field]);
		if (normalized !== void 0) routing[field] = normalized;
	}
	return Object.keys(routing).length > 0 ? routing : void 0;
}
function normalizeVercelGatewayRouting(value) {
	if (!isRecord(value)) return;
	const routing = {};
	for (const field of ["only", "order"]) {
		const normalized = normalizeOptionalTrimmedStringList(value[field]);
		if (normalized) routing[field] = normalized;
	}
	return Object.keys(routing).length > 0 ? routing : void 0;
}
function normalizeModelCatalogCompat(value) {
	if (!isRecord(value)) return;
	const compat = {};
	for (const field of [
		"supportsStore",
		"supportsPromptCacheKey",
		"supportsDeveloperRole",
		"supportsReasoningEffort",
		"supportsTemperature",
		"supportsInstructions",
		"supportsUsageInStreaming",
		"supportsTools",
		"supportsStrictMode",
		"supportsJsonSchemaResponseFormat",
		"requiresStringContent",
		"strictMessageKeys",
		"requiresToolResultName",
		"requiresAssistantAfterToolResult",
		"requiresThinkingAsText",
		"requiresReasoningContentOnAssistantMessages",
		"zaiToolStream",
		"sendSessionAffinityHeaders",
		"sendSessionIdHeader",
		"supportsEagerToolInputStreaming",
		"supportsLongCacheRetention",
		"supportsResponsesContinuation",
		"requiresOpenAiAnthropicToolPayload"
	]) if (typeof value[field] === "boolean") compat[field] = value[field];
	for (const field of ["toolSchemaProfile", "toolCallArgumentsEncoding"]) {
		const normalized = normalizeOptionalString(value[field]) ?? "";
		if (normalized) compat[field] = normalized;
	}
	for (const field of [
		"visibleReasoningDetailTypes",
		"supportedReasoningEfforts",
		"unsupportedToolSchemaKeywords"
	]) {
		const normalized = normalizeTrimmedStringList(value[field]);
		if (normalized.length > 0 || field === "supportedReasoningEfforts" && Array.isArray(value[field])) compat[field] = normalized;
	}
	if (isRecord(value.reasoningEffortMap)) {
		const reasoningEffortMap = Object.fromEntries(Object.entries(value.reasoningEffortMap).flatMap(([rawKey, rawMapped]) => {
			const key = rawKey.trim();
			const mapped = typeof rawMapped === "string" ? rawMapped.trim() : "";
			return key && mapped ? [[key, mapped]] : [];
		}));
		if (Object.keys(reasoningEffortMap).length > 0) compat.reasoningEffortMap = reasoningEffortMap;
	}
	const codeMode = normalizeOptionalString(value.codeMode) ?? "";
	if (codeMode === "preferred" || codeMode === "capable") compat.codeMode = codeMode;
	const maxTokensField = normalizeOptionalString(value.maxTokensField) ?? "";
	if (maxTokensField === "max_completion_tokens" || maxTokensField === "max_tokens") compat.maxTokensField = maxTokensField;
	const thinkingFormat = normalizeOptionalString(value.thinkingFormat) ?? "";
	if (isModelCatalogThinkingFormat(thinkingFormat)) compat.thinkingFormat = thinkingFormat;
	if (value.cacheControlFormat === "anthropic") compat.cacheControlFormat = "anthropic";
	const openRouterRouting = normalizeOpenRouterRouting(value.openRouterRouting);
	if (openRouterRouting) compat.openRouterRouting = openRouterRouting;
	const vercelGatewayRouting = normalizeVercelGatewayRouting(value.vercelGatewayRouting);
	if (vercelGatewayRouting) compat.vercelGatewayRouting = vercelGatewayRouting;
	return Object.keys(compat).length > 0 ? compat : void 0;
}
function normalizeModelCatalogStatus(value) {
	const status = normalizeOptionalString(value) ?? "";
	return MODEL_CATALOG_STATUSES.has(status) ? status : void 0;
}
function normalizeModelCatalogImageTokenMode(value) {
	const tokenMode = normalizeOptionalString(value) ?? "";
	if (tokenMode === "tile" || tokenMode === "detail" || tokenMode === "provider") return tokenMode;
}
function normalizeModelCatalogMediaInput(value) {
	if (!isRecord(value) || !isRecord(value.image)) return;
	const normalizedImage = {};
	for (const field of [
		"maxBytes",
		"maxPixels",
		"maxSidePx",
		"preferredSidePx"
	]) {
		const normalized = normalizePositiveInteger(value.image[field]);
		if (normalized !== void 0) normalizedImage[field] = normalized;
	}
	const tokenMode = normalizeModelCatalogImageTokenMode(value.image.tokenMode);
	if (tokenMode) normalizedImage.tokenMode = tokenMode;
	return Object.keys(normalizedImage).length > 0 ? { image: normalizedImage } : void 0;
}
function normalizeModelCatalogModel(value) {
	if (!isRecord(value)) return;
	const id = normalizeOptionalString(value.id) ?? "";
	if (!id) return;
	const name = normalizeOptionalString(value.name) ?? "";
	const api = normalizeModelCatalogApi(value.api);
	const baseUrl = normalizeOptionalString(value.baseUrl) ?? "";
	const headers = normalizeStringMap(value.headers);
	const input = normalizeModelCatalogInputs(value.input);
	const reasoning = typeof value.reasoning === "boolean" ? value.reasoning : void 0;
	const contextWindow = asPositiveFiniteNumber(value.contextWindow);
	const contextWindowSelection = normalizeModelCatalogContextWindowSelection(value);
	const contextTokens = normalizePositiveInteger(value.contextTokens);
	const maxTokens = asPositiveFiniteNumber(value.maxTokens);
	const thinkingLevelMap = normalizeModelCatalogThinkingLevelMap(value.thinkingLevelMap);
	const cost = normalizeModelCatalogCost(value.cost);
	const compat = normalizeModelCatalogCompat(value.compat);
	const mediaInput = normalizeModelCatalogMediaInput(value.mediaInput);
	const status = normalizeModelCatalogStatus(value.status);
	const statusReason = normalizeOptionalString(value.statusReason) ?? "";
	const replaces = normalizeTrimmedStringList(value.replaces);
	const replacedBy = normalizeOptionalString(value.replacedBy) ?? "";
	const tags = normalizeTrimmedStringList(value.tags);
	return {
		id,
		...name ? { name } : {},
		...api ? { api } : {},
		...baseUrl ? { baseUrl } : {},
		...headers ? { headers } : {},
		...input ? { input } : {},
		...reasoning !== void 0 ? { reasoning } : {},
		...contextWindow !== void 0 ? { contextWindow } : {},
		...contextWindowSelection,
		...contextTokens !== void 0 ? { contextTokens } : {},
		...maxTokens !== void 0 ? { maxTokens } : {},
		...thinkingLevelMap ? { thinkingLevelMap } : {},
		...cost ? { cost } : {},
		...compat ? { compat } : {},
		...mediaInput ? { mediaInput } : {},
		...status ? { status } : {},
		...statusReason ? { statusReason } : {},
		...replaces.length > 0 ? { replaces } : {},
		...replacedBy ? { replacedBy } : {},
		...tags.length > 0 ? { tags } : {}
	};
}
function normalizeModelCatalogProvider(value) {
	if (!isRecord(value)) return;
	const models = Array.isArray(value.models) ? value.models.map((entry) => normalizeModelCatalogModel(entry)).filter((entry) => Boolean(entry)) : [];
	if (models.length === 0) return;
	const baseUrl = normalizeOptionalString(value.baseUrl) ?? "";
	const api = normalizeModelCatalogApi(value.api);
	const headers = normalizeStringMap(value.headers);
	const defaultModel = normalizeOptionalString(value.defaultModel) ?? "";
	const defaultUtilityModel = normalizeOptionalString(value.defaultUtilityModel) ?? "";
	const recommended = Array.isArray(value.recommendedModels) ? value.recommendedModels.map(normalizeOptionalString) : [];
	const recommendedModels = recommended.length > 0 && new Set(recommended).size === recommended.length && recommended.every((id) => Boolean(id) && models.some((model) => model.id === id)) ? recommended : [];
	return {
		...baseUrl ? { baseUrl } : {},
		...api ? { api } : {},
		...headers ? { headers } : {},
		...defaultModel ? { defaultModel } : {},
		...defaultUtilityModel ? { defaultUtilityModel } : {},
		...recommendedModels.length > 0 ? { recommendedModels } : {},
		models
	};
}
function normalizeModelCatalogProviders(value, ownedProviders) {
	if (!isRecord(value)) return;
	const providers = {};
	for (const [rawProviderId, rawProvider] of Object.entries(value)) {
		const providerId = normalizeProviderId(rawProviderId);
		if (!providerId || !ownedProviders.has(providerId)) continue;
		const provider = normalizeModelCatalogProvider(rawProvider);
		if (provider) providers[providerId] = provider;
	}
	return Object.keys(providers).length > 0 ? providers : void 0;
}
function normalizeModelCatalogAliases(value, ownedProviders) {
	if (!isRecord(value)) return;
	const aliases = {};
	for (const [rawAlias, rawTarget] of Object.entries(value)) {
		const alias = normalizeProviderId(rawAlias);
		if (!alias || !isRecord(rawTarget)) continue;
		const provider = normalizeProviderId(normalizeOptionalString(rawTarget.provider) ?? "");
		if (!provider || !ownedProviders.has(provider)) continue;
		const api = normalizeModelCatalogApi(rawTarget.api);
		const baseUrl = normalizeOptionalString(rawTarget.baseUrl) ?? "";
		aliases[alias] = {
			provider,
			...api ? { api } : {},
			...baseUrl ? { baseUrl } : {}
		};
	}
	return Object.keys(aliases).length > 0 ? aliases : void 0;
}
function normalizeModelCatalogSuppressions(value) {
	if (!Array.isArray(value)) return;
	const suppressions = [];
	for (const entry of value) {
		if (!isRecord(entry)) continue;
		const provider = normalizeProviderId(normalizeOptionalString(entry.provider) ?? "");
		const model = normalizeOptionalString(entry.model) ?? "";
		if (!provider || !model) continue;
		const reason = normalizeOptionalString(entry.reason) ?? "";
		const replacedBy = isRecord(entry.retirement) ? normalizeOptionalString(entry.retirement.replacedBy) : void 0;
		const retirement = isRecord(entry.retirement) && (entry.retirement.replacedBy === void 0 || replacedBy) ? replacedBy ? { replacedBy } : {} : void 0;
		const rawWhen = isRecord(entry.when) ? entry.when : void 0;
		const baseUrlHosts = normalizeTrimmedStringList(rawWhen?.baseUrlHosts).map((host) => host.toLowerCase());
		const providerConfigApiIn = normalizeTrimmedStringList(rawWhen?.providerConfigApiIn).map((api) => api.toLowerCase());
		const when = baseUrlHosts.length > 0 || providerConfigApiIn.length > 0 ? {
			...baseUrlHosts.length > 0 ? { baseUrlHosts } : {},
			...providerConfigApiIn.length > 0 ? { providerConfigApiIn } : {}
		} : void 0;
		if (retirement && entry.when !== void 0 && (!rawWhen || !when || rawWhen.baseUrlHosts !== void 0 && baseUrlHosts.length === 0 || rawWhen.providerConfigApiIn !== void 0 && providerConfigApiIn.length === 0)) continue;
		suppressions.push({
			provider,
			model,
			...reason ? { reason } : {},
			...retirement ? { retirement } : {},
			...when ? { when } : {}
		});
	}
	return suppressions.length > 0 ? suppressions : void 0;
}
function normalizeModelCatalogDiscovery(value, ownedProviders) {
	if (!isRecord(value)) return;
	const discovery = {};
	for (const [rawProviderId, rawMode] of Object.entries(value)) {
		const providerId = normalizeProviderId(rawProviderId);
		const mode = normalizeOptionalString(rawMode) ?? "";
		if (providerId && ownedProviders.has(providerId) && MODEL_CATALOG_DISCOVERY_MODES.has(mode)) discovery[providerId] = mode;
	}
	return Object.keys(discovery).length > 0 ? discovery : void 0;
}
/** Normalize a raw model catalog object for the set of providers owned by a plugin/manifest. */
function normalizeModelCatalog(value, params) {
	if (!isRecord(value)) return;
	const ownedProviders = new Set([...params.ownedProviders].map(normalizeProviderId).filter(Boolean));
	const modelsDev = Object.fromEntries(Object.entries(normalizeStringMap(value.modelsDev) ?? {}).flatMap(([rawProviderId, sourceId]) => {
		const providerId = normalizeProviderId(rawProviderId);
		return ownedProviders.has(providerId) && !isBlockedObjectKey(providerId) ? [[providerId, sourceId]] : [];
	}));
	const providers = normalizeModelCatalogProviders(value.providers, ownedProviders);
	const aliases = normalizeModelCatalogAliases(value.aliases, ownedProviders);
	const suppressions = normalizeModelCatalogSuppressions(value.suppressions);
	const discovery = normalizeModelCatalogDiscovery(value.discovery, ownedProviders);
	const runtimeAugment = value.runtimeAugment === true;
	const catalog = {
		...Object.keys(modelsDev).length > 0 ? { modelsDev } : {},
		...providers ? { providers } : {},
		...aliases ? { aliases } : {},
		...suppressions ? { suppressions } : {},
		...discovery ? { discovery } : {},
		...runtimeAugment ? { runtimeAugment } : {}
	};
	return Object.keys(catalog).length > 0 ? catalog : void 0;
}
//#endregion
//#region packages/gateway-protocol/src/plugin-ui-capabilities.ts
/** Static UI contribution kinds, in canonical presentation order. */
const PLUGIN_UI_CAPABILITIES = [
	"page",
	"navigation",
	"panel",
	"action",
	"accessory",
	"widget",
	"replacement",
	"link-reader"
];
/** Omission is unspecified; an empty declaration explicitly advertises no UI. */
function validatePluginUiCapabilities(value) {
	if (value === void 0) return { ok: true };
	if (!Array.isArray(value)) return {
		ok: false,
		error: "must be an array"
	};
	for (const entry of value) if (!PLUGIN_UI_CAPABILITIES.some((candidate) => candidate === entry)) return {
		ok: false,
		error: `contains unknown UI capability ${JSON.stringify(entry)}`
	};
	return {
		ok: true,
		capabilities: PLUGIN_UI_CAPABILITIES.filter((capability) => value.includes(capability))
	};
}
//#endregion
//#region packages/plugin-package-contract/src/categories.ts
/** Active browse taxonomy, ordered with the core configuration surfaces first. */
const PLUGIN_CATEGORY_SLUGS = [
	"channels",
	"models",
	"agent-runtimes",
	"memory",
	"context",
	"voice",
	"web",
	"computer-use",
	"media",
	"security",
	"integrations",
	"developer-tools",
	"infrastructure",
	"documents-files",
	"inbox-collaboration",
	"productivity",
	"scheduling",
	"finance-payments",
	"sales-marketing",
	"data-analytics",
	"agent-orchestration",
	"research",
	"other"
];
/** Published declarations remain readable while authors adopt the active taxonomy. */
const LEGACY_PLUGIN_CATEGORY_SLUGS = [
	"tools",
	"runtime",
	"gateway"
];
const ACCEPTED_PLUGIN_CATEGORY_SLUGS = [...PLUGIN_CATEGORY_SLUGS, ...LEGACY_PLUGIN_CATEGORY_SLUGS];
/** Validate optional ordered package-owned plugin categories. */
function validatePluginCategories(value) {
	if (value === void 0) return { ok: true };
	if (!Array.isArray(value)) return {
		ok: false,
		error: "must be an array"
	};
	if (value.length < 1 || value.length > 3) return {
		ok: false,
		error: "must contain between 1 and 3 entries"
	};
	const categories = [];
	for (const entry of value) {
		const category = ACCEPTED_PLUGIN_CATEGORY_SLUGS.find((candidate) => candidate === entry);
		if (!category) return {
			ok: false,
			error: `contains unknown category ${JSON.stringify(entry)}`
		};
		if (categories.includes(category)) return {
			ok: false,
			error: "must not contain duplicates"
		};
		categories.push(category);
	}
	return {
		ok: true,
		categories
	};
}
//#endregion
//#region src/plugins/doctor-session-route-state-owner-types.ts
function coerceDoctorSessionRouteStateOwners(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		const candidate = asOptionalObjectRecord(entry);
		if (typeof candidate?.id !== "string" || typeof candidate.label !== "string") return [];
		const id = candidate.id.trim();
		const label = candidate.label.trim();
		if (!id || !label) return [];
		const owner = {
			id,
			label,
			providerIds: normalizeTrimmedStringList(candidate.providerIds),
			runtimeIds: normalizeTrimmedStringList(candidate.runtimeIds),
			cliSessionKeys: normalizeTrimmedStringList(candidate.cliSessionKeys),
			authProfilePrefixes: normalizeTrimmedStringList(candidate.authProfilePrefixes)
		};
		return [
			"providerIds",
			"runtimeIds",
			"cliSessionKeys",
			"authProfilePrefixes"
		].every((key) => candidate[key] === void 0 || owner[key].length > 0) ? [owner] : [];
	});
}
//#endregion
//#region src/plugins/manifest-contract-keys.ts
const PLUGIN_MANIFEST_CONTRACT_KEYS = [
	"codeModeExecutors",
	"embeddedExtensionFactories",
	"agentToolResultMiddleware",
	"trustedToolPolicies",
	"externalAuthProviders",
	"decisionProviders",
	"embeddingProviders",
	"speechProviders",
	"realtimeTranscriptionProviders",
	"realtimeVoiceProviders",
	"mediaUnderstandingProviders",
	"transcriptSourceProviders",
	"documentExtractors",
	"imageGenerationProviders",
	"videoGenerationProviders",
	"musicGenerationProviders",
	"webContentExtractors",
	"webFetchProviders",
	"webSearchProviders",
	"workerProviders",
	"storageProviders",
	"usageProviders",
	"migrationProviders",
	"gatewayMethodDispatch",
	"tools"
];
//#endregion
//#region src/plugins/manifest-capability-normalizers.ts
function normalizeDecisionCapabilities(value) {
	if (!isRecord(value) || !Array.isArray(value.questionTypes) || value.questionTypes.length === 0 || value.questionTypes.length > 3 || !value.questionTypes.every((kind) => kind === "boolean" || kind === "choice" || kind === "score")) return;
	const capabilities = { questionTypes: [...new Set(value.questionTypes)] };
	for (const key of [
		"maxQuestions",
		"maxChoiceAlternatives",
		"maxScoreLevels",
		"maxInputTokens"
	]) {
		const limit = value[key];
		if (typeof limit === "number" && Number.isSafeInteger(limit) && limit > 0) capabilities[key] = limit;
	}
	if (value.inputTokenScope === "encoded-question" || value.inputTokenScope === "state-plus-each-criterion") capabilities.inputTokenScope = value.inputTokenScope;
	if (typeof value.requiresBooleanCriteria === "boolean") capabilities.requiresBooleanCriteria = value.requiresBooleanCriteria;
	if (value.confidence === "provider-specific" || value.confidence === "none") capabilities.confidence = value.confidence;
	return capabilities;
}
/** Normalize provider-owned model descriptors without importing provider code. */
function normalizeManifestDecisionModels(value, providers) {
	const seen = /* @__PURE__ */ new Set();
	return normalizeManifestObjectList(value, (entry) => {
		const provider = normalizeOptionalString(entry.provider);
		const id = normalizeOptionalString(entry.id);
		const name = normalizeOptionalString(entry.name);
		if (!provider || !id || !name || !providers?.includes(provider)) return;
		const ref = `${provider}/${id}`;
		if (seen.has(ref)) return;
		const capabilities = normalizeDecisionCapabilities(entry.capabilities);
		seen.add(ref);
		return {
			provider,
			id,
			name,
			...capabilities ? { capabilities } : {}
		};
	});
}
/** Endpoint restrictions constrain a provider alias without changing stored credential identity. */
function normalizeManifestProviderAuthAliases(value) {
	return normalizeManifestRecord(value, (entry) => {
		if (typeof entry === "string") return normalizeOptionalString(entry);
		if (isRecord(entry)) {
			const provider = normalizeOptionalString(entry.provider);
			const baseUrls = normalizeTrimmedStringList(entry.baseUrls);
			if (provider && baseUrls.length > 0) return {
				provider,
				baseUrls
			};
		}
	});
}
function isPluginToolProfile(profile) {
	return profile === "minimal" || profile === "coding" || profile === "messaging" || profile === "full";
}
function normalizeStringListRecord(value) {
	return normalizeManifestRecord(value, normalizeOptionalTrimmedStringList);
}
function normalizeManifestStringRecord(value) {
	return normalizeManifestRecord(value, normalizeOptionalString);
}
function normalizeManifestMcpServers(value) {
	return normalizeNamedMetadataRecord(value, (server) => ({ ...server }));
}
function normalizeManifestRecord(value, normalizeEntry) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [rawId, rawEntry] of Object.entries(value)) {
		const id = normalizeOptionalString(rawId) ?? "";
		const entry = !id || isBlockedObjectKey$1(id) ? void 0 : normalizeEntry(rawEntry, id);
		if (entry) normalized[id] = entry;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeNamedMetadataRecord(value, normalizeEntry) {
	return normalizeManifestRecord(value, (entry, id) => isRecord(entry) ? normalizeEntry(entry, id) : void 0);
}
function normalizeManifestObjectList(value, normalizeEntry) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		const result = isRecord(entry) ? normalizeEntry(entry) : void 0;
		if (result !== void 0) normalized.push(result);
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizeManifestTranscriptSources(value, ownedProviders = []) {
	const locatorKeys = [
		"accountId",
		"guildId",
		"channelId",
		"meetingUrl"
	];
	return normalizeNamedMetadataRecord(value, (entry, id) => {
		if (!ownedProviders.includes(id)) return;
		const name = normalizeOptionalString(entry.name);
		const raw = entry.autoStart;
		const autoStart = isRecord(raw) && Object.entries(raw).every(([key, mode]) => locatorKeys.some((locator) => locator === key) && (mode === "optional" || mode === "required")) ? Object.fromEntries(Object.entries(raw)) : void 0;
		return name || autoStart ? {
			...name ? { name } : {},
			...autoStart ? { autoStart } : {}
		} : void 0;
	});
}
function isMediaUnderstandingCapability(value) {
	return value === "image" || value === "audio" || value === "video";
}
function normalizeMediaUnderstandingRecord(value, normalizeValue) {
	if (!isRecord(value)) return;
	const normalized = {};
	for (const [rawKey, rawValue] of Object.entries(value)) {
		if (!isMediaUnderstandingCapability(rawKey)) continue;
		const entry = normalizeValue(rawValue);
		if (entry !== void 0) normalized[rawKey] = entry;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeMediaUnderstandingCapabilities(value) {
	const values = normalizeTrimmedStringList(value).filter(isMediaUnderstandingCapability);
	return values.length > 0 ? values : void 0;
}
function normalizeMediaUnderstandingNativeDocumentInputs(value) {
	const values = normalizeTrimmedStringList(value).filter((entry) => entry === "pdf");
	return values.length > 0 ? values : void 0;
}
function normalizeMediaUnderstandingDocumentModels(value) {
	if (!isRecord(value)) return;
	const pdfRaw = value.pdf;
	if (!isRecord(pdfRaw)) return;
	const textExtraction = normalizeOptionalString(pdfRaw.textExtraction);
	const image = pdfRaw.image === false ? false : normalizeOptionalString(pdfRaw.image);
	const pdf = {
		...textExtraction ? { textExtraction } : {},
		...image !== void 0 ? { image } : {}
	};
	return Object.keys(pdf).length > 0 ? { pdf } : void 0;
}
function normalizeMediaUnderstandingProviderMetadata(value) {
	return normalizeNamedMetadataRecord(value, (rawMetadata) => {
		const capabilities = normalizeMediaUnderstandingCapabilities(rawMetadata.capabilities);
		const defaultModels = normalizeMediaUnderstandingRecord(rawMetadata.defaultModels, normalizeOptionalString);
		const autoPriority = normalizeMediaUnderstandingRecord(rawMetadata.autoPriority, (priority) => typeof priority === "number" && Number.isFinite(priority) ? priority : void 0);
		const nativeDocumentInputs = normalizeMediaUnderstandingNativeDocumentInputs(rawMetadata.nativeDocumentInputs);
		const documentModels = normalizeMediaUnderstandingDocumentModels(rawMetadata.documentModels);
		const metadata = {
			...capabilities ? { capabilities } : {},
			...defaultModels ? { defaultModels } : {},
			...autoPriority ? { autoPriority } : {},
			...nativeDocumentInputs ? { nativeDocumentInputs } : {},
			...documentModels ? { documentModels } : {}
		};
		return Object.keys(metadata).length > 0 ? metadata : void 0;
	});
}
function normalizeProviderBaseUrlGuard(value) {
	if (!isRecord(value)) return;
	const provider = normalizeOptionalString(value.provider);
	const allowedBaseUrls = normalizeTrimmedStringList(value.allowedBaseUrls);
	if (!provider || allowedBaseUrls.length === 0) return;
	const defaultBaseUrl = normalizeOptionalString(value.defaultBaseUrl);
	return {
		provider,
		...defaultBaseUrl ? { defaultBaseUrl } : {},
		allowedBaseUrls
	};
}
function normalizeCapabilityProviderAuthSignals(value) {
	return normalizeManifestObjectList(value, (rawSignal) => {
		const provider = normalizeOptionalString(rawSignal.provider);
		if (!provider) return;
		const providerBaseUrl = normalizeProviderBaseUrlGuard(rawSignal.providerBaseUrl);
		return {
			provider,
			...providerBaseUrl ? { providerBaseUrl } : {}
		};
	});
}
function normalizeCapabilityProviderModeConfigSignal(value) {
	if (!isRecord(value)) return;
	const pathResult = normalizeOptionalString(value.path);
	const defaultValue = normalizeOptionalString(value.default);
	const allowed = normalizeTrimmedStringList(value.allowed);
	const disallowed = normalizeTrimmedStringList(value.disallowed);
	const signal = {
		...pathResult ? { path: pathResult } : {},
		...defaultValue ? { default: defaultValue } : {},
		...allowed.length > 0 ? { allowed } : {},
		...disallowed.length > 0 ? { disallowed } : {}
	};
	return Object.keys(signal).length > 0 ? signal : void 0;
}
function normalizeCapabilityProviderConfigSignals(value) {
	return normalizeManifestObjectList(value, (rawSignal) => {
		const rootPath = normalizeOptionalString(rawSignal.rootPath);
		if (!rootPath) return;
		const overlayPath = normalizeOptionalString(rawSignal.overlayPath);
		const overlayMapPath = normalizeOptionalString(rawSignal.overlayMapPath);
		const required = normalizeTrimmedStringList(rawSignal.required);
		const requiredAny = normalizeTrimmedStringList(rawSignal.requiredAny);
		const mode = normalizeCapabilityProviderModeConfigSignal(rawSignal.mode);
		const signal = {
			rootPath,
			...overlayPath ? { overlayPath } : {},
			...overlayMapPath ? { overlayMapPath } : {},
			...required.length > 0 ? { required } : {},
			...requiredAny.length > 0 ? { requiredAny } : {},
			...mode ? { mode } : {}
		};
		return required.length > 0 || requiredAny.length > 0 || mode ? signal : void 0;
	});
}
function normalizeCapabilityProviderMetadataEntry(rawMetadata) {
	const aliases = normalizeTrimmedStringList(rawMetadata.aliases);
	const authProviders = normalizeTrimmedStringList(rawMetadata.authProviders);
	const authSignals = normalizeCapabilityProviderAuthSignals(rawMetadata.authSignals);
	const configSignals = normalizeCapabilityProviderConfigSignals(rawMetadata.configSignals);
	const referenceAudioInputs = rawMetadata.referenceAudioInputs === true ? true : void 0;
	const metadata = {
		...aliases.length > 0 ? { aliases } : {},
		...authProviders.length > 0 ? { authProviders } : {},
		...authSignals ? { authSignals } : {},
		...configSignals ? { configSignals } : {},
		...referenceAudioInputs ? { referenceAudioInputs } : {}
	};
	return Object.keys(metadata).length > 0 ? metadata : void 0;
}
function normalizeCapabilityProviderMetadata(value) {
	return normalizeNamedMetadataRecord(value, normalizeCapabilityProviderMetadataEntry);
}
function normalizePluginToolMetadata(value) {
	return normalizeNamedMetadataRecord(value, (rawMetadata) => {
		const providerMetadata = normalizeCapabilityProviderMetadataEntry(rawMetadata);
		const profiles = normalizeTrimmedStringList(rawMetadata.profiles).filter(isPluginToolProfile);
		const metadata = {
			...providerMetadata,
			...rawMetadata.optional === true ? { optional: true } : {},
			...profiles.length > 0 ? { profiles } : {},
			...rawMetadata.replaySafe === true ? { replaySafe: true } : {},
			...rawMetadata.sideEffecting === true ? { sideEffecting: true } : {}
		};
		return Object.keys(metadata).length > 0 ? metadata : void 0;
	});
}
function normalizeManifestCatalog(value) {
	if (!isRecord(value)) return;
	const featured = typeof value.featured === "boolean" ? value.featured : void 0;
	const order = typeof value.order === "number" && Number.isFinite(value.order) ? value.order : void 0;
	if (featured === void 0 && order === void 0) return;
	return {
		...featured !== void 0 ? { featured } : {},
		...order !== void 0 ? { order } : {}
	};
}
function normalizeManifestContracts(value) {
	if (!isRecord(value)) return;
	const contracts = {};
	for (const key of PLUGIN_MANIFEST_CONTRACT_KEYS) {
		const entries = normalizeTrimmedStringList(value[key]);
		if (entries.length > 0) contracts[key] = entries;
	}
	return Object.keys(contracts).length > 0 ? contracts : void 0;
}
function isManifestConfigLiteral(value) {
	return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function normalizeManifestDangerousConfigFlags(value) {
	return normalizeManifestObjectList(value, (entry) => {
		const pathValue = normalizeOptionalString(entry.path) ?? "";
		return pathValue && isManifestConfigLiteral(entry.equals) ? {
			path: pathValue,
			equals: entry.equals
		} : void 0;
	});
}
function normalizeManifestSecretInputPaths(value) {
	return normalizeManifestObjectList(value, (entry) => {
		const pathLocal = normalizeOptionalString(entry.path) ?? "";
		if (!pathLocal) return;
		const expected = entry.expected === "string" ? entry.expected : void 0;
		const ownerKind = entry.ownerKind === "capability" || entry.ownerKind === "route" ? entry.ownerKind : void 0;
		return {
			path: pathLocal,
			...expected ? { expected } : {},
			...ownerKind ? { ownerKind } : {}
		};
	});
}
function normalizeManifestConfigContracts(value) {
	if (!isRecord(value)) return;
	const compatibilityMigrationPaths = normalizeTrimmedStringList(value.compatibilityMigrationPaths);
	const compatibilityRuntimePaths = normalizeTrimmedStringList(value.compatibilityRuntimePaths);
	const rawSecretInputs = isRecord(value.secretInputs) ? value.secretInputs : void 0;
	const dangerousFlags = normalizeManifestDangerousConfigFlags(value.dangerousFlags);
	const secretInputPaths = rawSecretInputs ? normalizeManifestSecretInputPaths(rawSecretInputs.paths) : void 0;
	const secretInputs = secretInputPaths ? {
		...typeof rawSecretInputs?.bundledDefaultEnabled === "boolean" ? { bundledDefaultEnabled: rawSecretInputs.bundledDefaultEnabled } : {},
		paths: secretInputPaths
	} : void 0;
	const configContracts = {
		...compatibilityMigrationPaths.length > 0 ? { compatibilityMigrationPaths } : {},
		...compatibilityRuntimePaths.length > 0 ? { compatibilityRuntimePaths } : {},
		...dangerousFlags ? { dangerousFlags } : {},
		...secretInputs ? { secretInputs } : {}
	};
	return Object.keys(configContracts).length > 0 ? configContracts : void 0;
}
//#endregion
//#region src/plugins/manifest-command-aliases.ts
/** Normalizes manifest-declared CLI command aliases. */
/** Normalizes manifest command alias records, omitting invalid entries. */
function normalizeManifestCommandAliases(value) {
	if (!Array.isArray(value)) return;
	const normalized = [];
	for (const entry of value) {
		if (typeof entry === "string") {
			const name = normalizeOptionalString(entry) ?? "";
			if (name) normalized.push({ name });
			continue;
		}
		if (!isRecord(entry)) continue;
		const name = normalizeOptionalString(entry.name) ?? "";
		if (!name) continue;
		const kind = entry.kind === "runtime-slash" ? entry.kind : void 0;
		const cliCommand = normalizeOptionalString(entry.cliCommand) ?? "";
		normalized.push({
			name,
			...kind ? { kind } : {},
			...cliCommand ? { cliCommand } : {}
		});
	}
	return normalized.length > 0 ? normalized : void 0;
}
//#endregion
//#region src/plugins/manifest-config-groups.ts
/** Invalid presentation metadata leaves the plugin's complete flat settings form available. */
function normalizeConfigGroups(raw, schema) {
	if (!Array.isArray(raw) || raw.length === 0 || !isRecord(schema.properties)) return;
	const ids = /* @__PURE__ */ new Set();
	const assigned = /* @__PURE__ */ new Set();
	const groups = [];
	for (const entry of raw) {
		if (!isRecord(entry)) return;
		const id = typeof entry.id === "string" ? entry.id.trim() : "";
		const title = typeof entry.title === "string" ? entry.title.trim() : "";
		if (!id || !title || ids.has(id) || entry.order !== void 0 && !Number.isInteger(entry.order) || !Array.isArray(entry.properties) || entry.properties.length === 0) return;
		const properties = [];
		for (const property of entry.properties) {
			if (typeof property !== "string" || !property || !Object.hasOwn(schema.properties, property) || assigned.has(property)) return;
			assigned.add(property);
			properties.push(property);
		}
		ids.add(id);
		groups.push({
			id,
			title,
			...typeof entry.order === "number" ? { order: entry.order } : {},
			properties
		});
	}
	return groups;
}
//#endregion
//#region packages/model-catalog-core/src/model-catalog-pricing.ts
const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
const MODELS_DEV_CATALOG_URL = "https://models.opencode.ai/api.json";
const MODEL_PRICING_SOURCES = [
	{
		id: "openCode",
		label: "OpenCode",
		url: MODELS_DEV_CATALOG_URL,
		authoritative: true
	},
	{
		id: "venice",
		label: "Venice",
		url: "https://api.venice.ai/api/v1/models",
		authoritative: true
	},
	{
		id: "chutes",
		label: "Chutes",
		url: "https://llm.chutes.ai/v1/models",
		authoritative: true
	},
	{
		id: "cerebras",
		label: "Cerebras",
		url: "https://api.cerebras.ai/public/v1/models",
		authoritative: true
	},
	{
		id: "deepinfra",
		label: "DeepInfra",
		url: "https://api.deepinfra.com/models/list",
		authoritative: true
	},
	{
		id: "modelsDev",
		label: "models.dev",
		url: MODELS_DEV_CATALOG_URL,
		authoritative: false
	},
	{
		id: "openRouter",
		label: "OpenRouter",
		url: OPENROUTER_MODELS_URL,
		authoritative: false
	},
	{
		id: "liteLLM",
		label: "LiteLLM",
		url: "https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json",
		authoritative: false
	}
];
/** Normalize source policy without deciding which plugin owns the provider. */
function normalizeModelPricingProvider(value) {
	const record = asOptionalRecord(value);
	if (!record) return;
	const policy = typeof record.external === "boolean" ? { external: record.external } : {};
	for (const { id: sourceId } of MODEL_PRICING_SOURCES) {
		const raw = record[sourceId];
		if (raw === false) {
			policy[sourceId] = false;
			continue;
		}
		const row = asOptionalRecord(raw);
		const provider = normalizeProviderId(normalizeOptionalString(row?.provider) ?? "");
		const modelIdTransforms = normalizeTrimmedStringList(row?.modelIdTransforms).filter((entry) => entry === "version-dots");
		const source = {
			...provider ? { provider } : {},
			...row?.passthroughProviderModel === true ? { passthroughProviderModel: true } : {},
			...modelIdTransforms.length > 0 ? { modelIdTransforms } : {}
		};
		if (Object.keys(source).length > 0) policy[sourceId] = source;
	}
	return Object.keys(policy).length > 0 ? policy : void 0;
}
//#endregion
//#region src/plugins/plugin-provider-request-policy.ts
/** Manifest parsing and prepared metadata use the same provider request policy. */
function normalizeManifestProviderRequestProvider(value) {
	if (!isRecord(value)) return;
	const family = normalizeOptionalString(value.family);
	const compatibilityFamily = normalizeOptionalString(value.compatibilityFamily) === "moonshot" ? "moonshot" : void 0;
	const supportsStreamingUsage = isRecord(value.openAICompletions) ? value.openAICompletions.supportsStreamingUsage : void 0;
	const openAICompletions = typeof supportsStreamingUsage === "boolean" ? { supportsStreamingUsage } : void 0;
	const providerRequest = {
		...family ? { family } : {},
		...compatibilityFamily ? { compatibilityFamily } : {},
		...openAICompletions ? { openAICompletions } : {}
	};
	return Object.keys(providerRequest).length > 0 ? providerRequest : void 0;
}
//#endregion
//#region src/plugins/manifest-model-provider-normalizers.ts
const MAX_SECRET_PROVIDER_EXEC_ARGS = 128;
const MAX_SECRET_PROVIDER_EXEC_ARG_BYTES = 1024;
const MAX_SECRET_PROVIDER_EXEC_TIMEOUT_MS = 12e4;
const MAX_SECRET_PROVIDER_EXEC_OUTPUT_BYTES = 20971520;
const MAX_SECRET_PROVIDER_EXEC_PASS_ENV = 128;
const SECRET_PROVIDER_NODE_COMMAND_PLACEHOLDER = "${node}";
function normalizeManifestModelSupport(value) {
	if (!isRecord(value)) return;
	const modelPrefixes = normalizeTrimmedStringList(value.modelPrefixes);
	const modelPatterns = normalizeTrimmedStringList(value.modelPatterns);
	const modelSupport = {
		...modelPrefixes.length > 0 ? { modelPrefixes } : {},
		...modelPatterns.length > 0 ? { modelPatterns } : {}
	};
	return Object.keys(modelSupport).length > 0 ? modelSupport : void 0;
}
function normalizeOwnedProviderMap(value, ownedProvidersRaw, normalizePolicy) {
	if (!isRecord(value) || !isRecord(value.providers)) return;
	const ownedProviders = new Set([...ownedProvidersRaw].map((provider) => normalizeProviderId(provider)).filter(Boolean));
	const providers = {};
	for (const [rawProviderId, rawPolicy] of Object.entries(value.providers)) {
		const providerId = normalizeProviderId(rawProviderId);
		const policy = providerId && ownedProviders.has(providerId) ? normalizePolicy(rawPolicy) : null;
		if (providerId && policy) providers[providerId] = policy;
	}
	return Object.keys(providers).length > 0 ? providers : void 0;
}
function normalizeManifestModelPricing(value, params) {
	const providers = normalizeOwnedProviderMap(value, params.ownedProviders, normalizeModelPricingProvider);
	return providers ? { providers } : void 0;
}
function normalizeManifestModelIdPrefixRules(value) {
	return normalizeManifestObjectList(value, (rawRule) => {
		const modelPrefix = normalizeOptionalString(rawRule.modelPrefix);
		const prefix = normalizeOptionalString(rawRule.prefix);
		return modelPrefix && prefix ? {
			modelPrefix,
			prefix
		} : void 0;
	});
}
function normalizeManifestModelIdNormalizationProvider(value) {
	if (!isRecord(value)) return;
	const aliases = {};
	if (isRecord(value.aliases)) for (const [rawAlias, rawCanonical] of Object.entries(value.aliases)) {
		const alias = normalizeProviderId(rawAlias);
		const canonical = normalizeOptionalString(rawCanonical);
		if (alias && canonical) aliases[alias] = canonical;
	}
	const stripPrefixes = normalizeTrimmedStringList(value.stripPrefixes);
	const prefixWhenBare = normalizeOptionalString(value.prefixWhenBare);
	const prefixWhenBareAfterAliasStartsWith = normalizeManifestModelIdPrefixRules(value.prefixWhenBareAfterAliasStartsWith);
	const normalization = {
		...Object.keys(aliases).length > 0 ? { aliases } : {},
		...stripPrefixes.length > 0 ? { stripPrefixes } : {},
		...prefixWhenBare ? { prefixWhenBare } : {},
		...prefixWhenBareAfterAliasStartsWith ? { prefixWhenBareAfterAliasStartsWith } : {}
	};
	return Object.keys(normalization).length > 0 ? normalization : void 0;
}
function normalizeManifestModelIdNormalization(value, params) {
	const providers = normalizeOwnedProviderMap(value, params.ownedProviders, normalizeManifestModelIdNormalizationProvider);
	return providers ? { providers } : void 0;
}
function normalizeManifestProviderEndpoints(value) {
	return normalizeManifestObjectList(value, (rawEndpoint) => {
		const endpointClass = normalizeOptionalString(rawEndpoint.endpointClass);
		if (!endpointClass) return;
		const hosts = normalizeTrimmedStringList(rawEndpoint.hosts).map((host) => host.toLowerCase());
		const hostSuffixes = normalizeTrimmedStringList(rawEndpoint.hostSuffixes).map((host) => host.toLowerCase());
		const baseUrls = normalizeTrimmedStringList(rawEndpoint.baseUrls);
		const googleVertexRegion = normalizeOptionalString(rawEndpoint.googleVertexRegion);
		const googleVertexRegionHostSuffix = normalizeOptionalString(rawEndpoint.googleVertexRegionHostSuffix)?.toLowerCase();
		if (hosts.length === 0 && hostSuffixes.length === 0 && baseUrls.length === 0) return;
		return {
			endpointClass,
			...hosts.length > 0 ? { hosts } : {},
			...hostSuffixes.length > 0 ? { hostSuffixes } : {},
			...baseUrls.length > 0 ? { baseUrls } : {},
			...googleVertexRegion ? { googleVertexRegion } : {},
			...googleVertexRegionHostSuffix ? { googleVertexRegionHostSuffix } : {}
		};
	});
}
function normalizeManifestProviderRequest(value, params) {
	const providers = normalizeOwnedProviderMap(value, params.ownedProviders, normalizeManifestProviderRequestProvider);
	return providers ? { providers } : void 0;
}
function normalizeManifestPositiveInteger(value, max) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= max ? value : void 0;
}
function normalizeManifestSecretProviderIntegrations(value) {
	return normalizeNamedMetadataRecord(value, (rawIntegration) => {
		const command = normalizeOptionalString(rawIntegration.command);
		if (rawIntegration.source !== "exec" || command !== SECRET_PROVIDER_NODE_COMMAND_PLACEHOLDER) return;
		const providerAlias = normalizeOptionalString(rawIntegration.providerAlias);
		const displayName = normalizeOptionalString(rawIntegration.displayName);
		const description = normalizeOptionalString(rawIntegration.description);
		const args = [];
		if (Array.isArray(rawIntegration.args)) for (const entry of rawIntegration.args) {
			if (typeof entry !== "string" || entry.length > MAX_SECRET_PROVIDER_EXEC_ARG_BYTES) continue;
			args.push(entry);
			if (args.length >= MAX_SECRET_PROVIDER_EXEC_ARGS) break;
		}
		const timeoutMs = normalizeManifestPositiveInteger(rawIntegration.timeoutMs, MAX_SECRET_PROVIDER_EXEC_TIMEOUT_MS);
		const noOutputTimeoutMs = normalizeManifestPositiveInteger(rawIntegration.noOutputTimeoutMs, MAX_SECRET_PROVIDER_EXEC_TIMEOUT_MS);
		const maxOutputBytes = normalizeManifestPositiveInteger(rawIntegration.maxOutputBytes, MAX_SECRET_PROVIDER_EXEC_OUTPUT_BYTES);
		const env = normalizeManifestStringRecord(rawIntegration.env);
		const passEnv = normalizeTrimmedStringList(rawIntegration.passEnv).filter((entry) => ENV_SECRET_REF_ID_RE.test(entry)).slice(0, MAX_SECRET_PROVIDER_EXEC_PASS_ENV);
		return {
			...providerAlias ? { providerAlias } : {},
			...displayName ? { displayName } : {},
			...description ? { description } : {},
			source: "exec",
			command,
			...args.length > 0 ? { args } : {},
			...timeoutMs !== void 0 ? { timeoutMs } : {},
			...noOutputTimeoutMs !== void 0 ? { noOutputTimeoutMs } : {},
			...maxOutputBytes !== void 0 ? { maxOutputBytes } : {},
			...typeof rawIntegration.jsonOnly === "boolean" ? { jsonOnly: rawIntegration.jsonOnly } : {},
			...env ? { env } : {},
			...passEnv.length > 0 ? { passEnv } : {}
		};
	});
}
//#endregion
//#region src/plugins/manifest-platforms.ts
const MANIFEST_PLATFORMS = /* @__PURE__ */ new Set([
	"aix",
	"android",
	"darwin",
	"freebsd",
	"haiku",
	"linux",
	"openbsd",
	"sunos",
	"win32",
	"cygwin",
	"netbsd"
]);
function normalizeManifestPlatforms(value) {
	return normalizeTrimmedStringList(value).filter((platform) => MANIFEST_PLATFORMS.has(platform));
}
//#endregion
//#region src/cli/program/command-descriptor-utils.ts
const SAFE_COMMAND_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
/** Normalize and validate a command descriptor name for safe Commander registration. */
function normalizeCommandDescriptorName(name) {
	const normalized = name.trim();
	return SAFE_COMMAND_NAME_PATTERN.test(normalized) ? normalized : null;
}
/** Strip unsafe terminal content from descriptor descriptions. */
function sanitizeCommandDescriptorDescription(description) {
	return sanitizeForLog(description).trim();
}
//#endregion
//#region src/plugins/setup-presentation-url.ts
function normalizeSetupPresentationHttpsUrl(value) {
	const normalized = normalizeOptionalString(value);
	const url = normalized ? URL.parse(normalized) : null;
	if (!url) return;
	const canonical = url.toString();
	return url.protocol === "https:" && url.hostname && !url.username && !url.password && canonical.length <= 2048 ? canonical : void 0;
}
//#endregion
//#region src/plugins/manifest-setup-normalizers.ts
function normalizeManifestActivation(value) {
	if (!isRecord(value)) return;
	const activation = {};
	if (typeof value.onStartup === "boolean") activation.onStartup = value.onStartup;
	for (const key of [
		"onProviders",
		"onAgentHarnesses",
		"onCommands",
		"onChannels",
		"onRoutes",
		"onConfigPaths"
	]) {
		const entries = normalizeTrimmedStringList(value[key]);
		if (entries.length > 0) activation[key] = entries;
	}
	const onCapabilities = normalizeTrimmedStringList(value.onCapabilities).filter((capability) => capability === "provider" || capability === "channel" || capability === "tool" || capability === "hook");
	if (onCapabilities.length > 0) activation.onCapabilities = onCapabilities;
	return Object.keys(activation).length > 0 ? activation : void 0;
}
function normalizeChannelAccountKeyPolicies(value, channels) {
	if (!isRecord(value)) return;
	const policies = Object.create(null);
	for (const channel of channels) {
		if (isBlockedObjectKey$1(channel) || !Object.hasOwn(value, channel)) continue;
		const entry = value[channel];
		const field = isRecord(entry) ? normalizeOptionalString(entry.canonicalAliasesRequireOwnField) : void 0;
		if (field && !isBlockedObjectKey$1(field)) policies[channel] = { canonicalAliasesRequireOwnField: field };
	}
	return Object.keys(policies).length ? policies : void 0;
}
function normalizeManifestCliCommands(value) {
	if (!Array.isArray(value)) return;
	const seen = /* @__PURE__ */ new Set();
	return normalizeManifestObjectList(value, (entry) => {
		if (typeof entry.name !== "string" || typeof entry.description !== "string") return;
		const name = normalizeCommandDescriptorName(entry.name);
		const description = sanitizeCommandDescriptorDescription(entry.description);
		if (!name || !description || typeof entry.hasSubcommands !== "boolean" || seen.has(name)) return;
		seen.add(name);
		return {
			name,
			description,
			hasSubcommands: entry.hasSubcommands
		};
	}) ?? [];
}
function normalizeManifestSetupProviders(value) {
	return normalizeManifestObjectList(value, (entry) => {
		const id = normalizeOptionalString(entry.id) ?? "";
		if (!id) return;
		const authMethods = normalizeTrimmedStringList(entry.authMethods);
		const envVars = normalizeTrimmedStringList(entry.envVars);
		const authEvidence = normalizeManifestSetupProviderAuthEvidence(entry.authEvidence);
		return {
			id,
			...authMethods.length > 0 ? { authMethods } : {},
			...envVars.length > 0 ? { envVars } : {},
			...authEvidence ? { authEvidence } : {}
		};
	});
}
function normalizeManifestSetupProviderAuthEvidence(value) {
	return normalizeManifestObjectList(value, (entry) => {
		if (entry.type !== "local-file-with-env") return;
		const credentialMarker = normalizeOptionalString(entry.credentialMarker);
		if (!credentialMarker) return;
		const fileEnvVar = normalizeOptionalString(entry.fileEnvVar);
		const fallbackPaths = normalizeTrimmedStringList(entry.fallbackPaths);
		if (!fileEnvVar && fallbackPaths.length === 0) return;
		const requiresAnyEnv = normalizeTrimmedStringList(entry.requiresAnyEnv);
		const requiresAllEnv = normalizeTrimmedStringList(entry.requiresAllEnv);
		const source = normalizeOptionalString(entry.source);
		return {
			type: "local-file-with-env",
			...fileEnvVar ? { fileEnvVar } : {},
			...fallbackPaths.length > 0 ? { fallbackPaths } : {},
			...requiresAnyEnv.length > 0 ? { requiresAnyEnv } : {},
			...requiresAllEnv.length > 0 ? { requiresAllEnv } : {},
			credentialMarker,
			...source ? { source } : {}
		};
	});
}
function normalizeManifestSetup(value) {
	if (!isRecord(value)) return;
	const providers = normalizeManifestSetupProviders(value.providers);
	const cliBackends = normalizeTrimmedStringList(value.cliBackends);
	const configMigrations = normalizeTrimmedStringList(value.configMigrations);
	const nativeSessionCatalog = isRecord(value.nativeSessionCatalog) ? {
		label: normalizeOptionalString(value.nativeSessionCatalog.label) ?? "",
		description: normalizeOptionalString(value.nativeSessionCatalog.description),
		nodeCommands: normalizeTrimmedStringList(value.nativeSessionCatalog.nodeCommands),
		legacyDefaultEnabled: value.nativeSessionCatalog.legacyDefaultEnabled === true
	} : void 0;
	const requiresRuntime = typeof value.requiresRuntime === "boolean" ? value.requiresRuntime : void 0;
	const setup = {
		...providers ? { providers } : {},
		...cliBackends.length > 0 ? { cliBackends } : {},
		...configMigrations.length > 0 ? { configMigrations } : {},
		...nativeSessionCatalog?.label ? { nativeSessionCatalog: {
			label: nativeSessionCatalog.label,
			...nativeSessionCatalog.legacyDefaultEnabled ? { legacyDefaultEnabled: true } : {},
			...nativeSessionCatalog.nodeCommands.length > 0 ? { nodeCommands: nativeSessionCatalog.nodeCommands } : {},
			...nativeSessionCatalog.description ? { description: nativeSessionCatalog.description } : {}
		} } : {},
		...requiresRuntime !== void 0 ? { requiresRuntime } : {}
	};
	return Object.keys(setup).length > 0 ? setup : void 0;
}
function normalizeManifestQaRunners(value) {
	return normalizeManifestObjectList(value, (entry) => {
		const commandName = normalizeOptionalString(entry.commandName) ?? "";
		if (!commandName) return;
		const description = normalizeOptionalString(entry.description) ?? "";
		return {
			commandName,
			...description ? { description } : {}
		};
	});
}
function normalizeDashboardCapabilityBase(value, field, index) {
	if (!isRecord(value)) return `${field}[${index}] must be an object`;
	const id = normalizeOptionalString(value.id);
	const method = normalizeOptionalString(value.method);
	const description = normalizeOptionalString(value.description);
	if (!id || !/^[a-z0-9][a-z0-9._-]*$/u.test(id)) return `${field}[${index}].id must be a lowercase capability id`;
	if (!method) return `${field}[${index}].method must be a non-empty string`;
	if (!description) return `${field}[${index}].description must be a non-empty string`;
	return {
		id,
		method,
		description
	};
}
function normalizeManifestDashboard(value) {
	if (value === void 0) return { ok: true };
	if (!isRecord(value)) return {
		ok: false,
		error: "dashboard must be an object"
	};
	if (value.dataBindings !== void 0 && !Array.isArray(value.dataBindings)) return {
		ok: false,
		error: "dashboard.dataBindings must be an array"
	};
	if (value.actionVerbs !== void 0 && !Array.isArray(value.actionVerbs)) return {
		ok: false,
		error: "dashboard.actionVerbs must be an array"
	};
	const dataBindings = [];
	for (const [index, entry] of (value.dataBindings ?? []).entries()) {
		const normalized = normalizeDashboardCapabilityBase(entry, "dashboard.dataBindings", index);
		if (typeof normalized === "string") return {
			ok: false,
			error: normalized
		};
		dataBindings.push(normalized);
	}
	const actionVerbs = [];
	for (const [index, entry] of (value.actionVerbs ?? []).entries()) {
		const normalized = normalizeDashboardCapabilityBase(entry, "dashboard.actionVerbs", index);
		if (typeof normalized === "string") return {
			ok: false,
			error: normalized
		};
		const rawParamShape = isRecord(entry) ? entry.paramShape : void 0;
		if (rawParamShape !== void 0 && !isRecord(rawParamShape)) return {
			ok: false,
			error: `dashboard.actionVerbs[${index}].paramShape must be a JSON Schema object`
		};
		actionVerbs.push({
			...normalized,
			...rawParamShape ? { paramShape: rawParamShape } : {}
		});
	}
	if (dataBindings.length === 0 && actionVerbs.length === 0) return { ok: true };
	return {
		ok: true,
		dashboard: {
			...dataBindings.length > 0 ? { dataBindings } : {},
			...actionVerbs.length > 0 ? { actionVerbs } : {}
		}
	};
}
function normalizeManifestControlUi(value) {
	if (value === void 0) return ok(void 0);
	if (!isRecord(value) || Object.keys(value).some((key) => key !== "entry" && key !== "styles")) return err("controlUi must contain only entry and optional styles");
	const entry = typeof value.entry === "string" ? value.entry.replace(/^\.\//u, "") : "";
	if (entry.length > 512 || !/^dist\/(?:[\w-][\w.-]*\/)+[\w-][\w.-]*\.m?js$/u.test(entry)) return err("controlUi.entry must be a JavaScript file in a dedicated dist subdirectory");
	if (value.styles !== void 0 && (!Array.isArray(value.styles) || value.styles.length > 16)) return err("controlUi.styles must be an array of at most 16 stylesheets");
	const assetPrefix = entry.slice(0, entry.lastIndexOf("/") + 1);
	const styles = [];
	for (const rawStyle of value.styles ?? []) {
		const style = typeof rawStyle === "string" ? rawStyle.replace(/^\.\//u, "") : "";
		if (style.length > 512 || !style.startsWith(assetPrefix) || !/^(?:[\w-][\w.-]*\/)+[\w-][\w.-]*\.css$/u.test(style)) return err("controlUi.styles must contain CSS files under the entry's asset directory");
		if (!styles.includes(style)) styles.push(style);
	}
	return ok({
		entry,
		...styles.length > 0 ? { styles } : {}
	});
}
function normalizeProviderChannelLogin(value) {
	if (!isRecord(value) || Object.keys(value).some((key) => key !== "aliases")) return;
	if (value.aliases !== void 0 && (!Array.isArray(value.aliases) || value.aliases.some((alias) => typeof alias !== "string" || !alias.trim()))) return;
	const aliases = normalizeUniqueTrimmedStringList(value.aliases);
	return aliases.length > 0 ? { aliases } : {};
}
function normalizeProviderAuthChoices(value) {
	return normalizeManifestObjectList(value, (entry) => {
		const provider = normalizeOptionalString(entry.provider) ?? "";
		const method = normalizeOptionalString(entry.method) ?? "";
		const choiceId = normalizeOptionalString(entry.choiceId) ?? "";
		if (!provider || !method || !choiceId) return;
		const choiceLabel = normalizeOptionalString(entry.choiceLabel) ?? "";
		const choiceHint = normalizeOptionalString(entry.choiceHint) ?? "";
		const icon = normalizeSetupPresentationHttpsUrl(entry.icon);
		const website = normalizeSetupPresentationHttpsUrl(entry.website);
		const docsUrl = normalizeSetupPresentationHttpsUrl(entry.docsUrl);
		const assistantPriority = typeof entry.assistantPriority === "number" && Number.isFinite(entry.assistantPriority) ? entry.assistantPriority : void 0;
		const assistantVisibility = entry.assistantVisibility === "manual-only" || entry.assistantVisibility === "visible" || entry.assistantVisibility === "detected-only" ? entry.assistantVisibility : void 0;
		const deprecatedChoiceIds = normalizeTrimmedStringList(entry.deprecatedChoiceIds);
		const groupId = normalizeOptionalString(entry.groupId) ?? "";
		const groupLabel = normalizeOptionalString(entry.groupLabel) ?? "";
		const groupHint = normalizeOptionalString(entry.groupHint) ?? "";
		const optionKey = normalizeOptionalString(entry.optionKey) ?? "";
		const cliFlag = normalizeOptionalString(entry.cliFlag) ?? "";
		const cliOption = normalizeOptionalString(entry.cliOption) ?? "";
		const cliDescription = normalizeOptionalString(entry.cliDescription) ?? "";
		const appGuidedActionLabel = normalizeOptionalString(entry.appGuidedActionLabel) ?? "";
		const appGuidedAuth = entry.appGuidedAuth === "oauth" || entry.appGuidedAuth === "device-code" ? entry.appGuidedAuth : void 0;
		const onboardingScopes = normalizeTrimmedStringList(entry.onboardingScopes).filter((scope) => scope === "text-inference" || scope === "image-generation" || scope === "music-generation");
		const channelLogin = normalizeProviderChannelLogin(entry.channelLogin);
		return {
			provider,
			method,
			choiceId,
			...entry.modelTarget === "utility" ? { modelTarget: "utility" } : {},
			...entry.platforms !== void 0 ? { platforms: normalizeManifestPlatforms(entry.platforms) } : {},
			...choiceLabel ? { choiceLabel } : {},
			...choiceHint ? { choiceHint } : {},
			...icon ? { icon } : {},
			...website ? { website } : {},
			...docsUrl ? { docsUrl } : {},
			...assistantPriority !== void 0 ? { assistantPriority } : {},
			...assistantVisibility ? { assistantVisibility } : {},
			...deprecatedChoiceIds.length > 0 ? { deprecatedChoiceIds } : {},
			...groupId ? { groupId } : {},
			...groupLabel ? { groupLabel } : {},
			...groupHint ? { groupHint } : {},
			...entry.onboardingFeatured === true ? { onboardingFeatured: true } : {},
			...entry.appGuidedDiscovery === true ? { appGuidedDiscovery: true } : {},
			...optionKey ? { optionKey } : {},
			...cliFlag ? { cliFlag } : {},
			...cliOption ? { cliOption } : {},
			...cliDescription ? { cliDescription } : {},
			...entry.appGuidedSecret === true ? { appGuidedSecret: true } : {},
			...entry.personalAccount === true ? { personalAccount: true } : {},
			...appGuidedActionLabel ? { appGuidedActionLabel } : {},
			...appGuidedAuth ? { appGuidedAuth } : {},
			...entry.credentialOnly === true ? { credentialOnly: true } : {},
			...channelLogin ? { channelLogin } : {},
			...onboardingScopes.length > 0 ? { onboardingScopes } : {}
		};
	});
}
function normalizeConfigUiHints(value) {
	if (!isRecord(value)) return;
	const normalized = Object.create(null);
	for (const [hintPath, rawHint] of Object.entries(value)) {
		if (!isRecord(rawHint)) continue;
		const hint = { ...rawHint };
		if ("presentation" in hint && hint.presentation !== "phone-number") delete hint.presentation;
		normalized[hintPath] = hint;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizeChannelConfigs(value) {
	return normalizeNamedMetadataRecord(value, (rawEntry) => {
		const schema = isRecord(rawEntry.schema) ? rawEntry.schema : null;
		if (!schema) return;
		const uiHints = normalizeConfigUiHints(rawEntry.uiHints);
		const runtime = isRecord(rawEntry.runtime) && typeof rawEntry.runtime.safeParse === "function" ? rawEntry.runtime : void 0;
		const label = normalizeOptionalString(rawEntry.label) ?? "";
		const description = normalizeOptionalString(rawEntry.description) ?? "";
		const preferOver = normalizeTrimmedStringList(rawEntry.preferOver);
		const commandDefaults = normalizeManifestChannelCommandDefaults(rawEntry.commands);
		return {
			schema,
			...uiHints ? { uiHints } : {},
			...runtime ? { runtime } : {},
			...label ? { label } : {},
			...description ? { description } : {},
			...preferOver.length > 0 ? { preferOver } : {},
			...commandDefaults ? { commands: commandDefaults } : {}
		};
	});
}
function normalizeManifestChannelCommandDefaults(value) {
	if (!isRecord(value)) return;
	const commands = {};
	for (const key of ["nativeCommandsAutoEnabled", "nativeSkillsAutoEnabled"]) if (typeof value[key] === "boolean") commands[key] = value[key];
	return Object.keys(commands).length > 0 ? commands : void 0;
}
//#endregion
//#region packages/gateway-protocol/src/theme-ids.ts
/** Lightweight theme identifiers used while browser preferences boot. */
const BUILTIN_THEME_IDS = [
	"claw",
	"knot",
	"dash",
	"absolutely",
	"tide",
	"beacon",
	"phosphor",
	"crt",
	"manuscript",
	"rose",
	"miami"
];
const THEME_LOCAL_ID_PATTERN = new RegExp(`^[a-z0-9][a-z0-9_-]{0,63}$`);
function isBuiltinThemeId(value) {
	return BUILTIN_THEME_IDS.some((id) => id === value);
}
function isThemeId(value) {
	if (isBuiltinThemeId(value)) return true;
	if (typeof value !== "string" || value.length > 256) return false;
	const separator = value.lastIndexOf("/");
	const owner = value.slice(0, separator);
	return separator > 0 && !owner.startsWith("user/") && /^@?[a-z0-9][a-z0-9._-]*(?:\/[a-z0-9][a-z0-9._-]*)*$/i.test(owner) && THEME_LOCAL_ID_PATTERN.test(value.slice(separator + 1));
}
//#endregion
//#region packages/gateway-protocol/src/theme.ts
const THEME_COLOR_KEYS = [
	"background",
	"foreground",
	"card",
	"card-foreground",
	"popover",
	"popover-foreground",
	"primary",
	"primary-foreground",
	"secondary",
	"secondary-foreground",
	"muted",
	"muted-foreground",
	"accent",
	"accent-foreground",
	"destructive",
	"destructive-foreground",
	"border",
	"input",
	"ring"
];
const THEME_FONT_KEYS = ["font-sans", "font-mono"];
const THEME_MASCOT_VALUES = ["claw", "none"];
const THEME_CRITTER_IDS = ["penguin", "fedora"];
const THEME_AVATAR_HAT_IDS = [
	"fedora",
	"crown",
	"santa",
	"party",
	"pumpkin"
];
const THEME_ARTWORK_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,31}$/;
const MAX_THEME_DEFINITION_BYTES = 4096;
[
	{
		id: "claw",
		name: "Claw",
		description: "Signature coral red and teal on charcoal or pale surfaces, with Instrument Sans throughout. A balanced everyday workspace."
	},
	{
		id: "knot",
		name: "Knot",
		description: "Crimson accents on true black or clean white, with Geist typography. Sharp, minimal, and high contrast."
	},
	{
		id: "dash",
		name: "Dash",
		description: "Toasted caramel on deep cocoa or warm cream, with DM Sans controls and Fraunces serif chat. Warm and bookish."
	},
	{
		id: "absolutely",
		name: "Absolutely",
		description: "Terracotta clay on warm graphite or soft cream, with Space Grotesk controls and Lora serif chat. Quiet editorial character."
	},
	{
		id: "tide",
		name: "Tide",
		description: "Steel cyan on cool slate or pale blue-gray, with IBM Plex Sans throughout. Calm, technical, and understated."
	},
	{
		id: "beacon",
		name: "Beacon",
		description: "High-visibility amber on black or white, bold focus rings, and Atkinson Hyperlegible typography. Designed for maximum readability."
	},
	{
		id: "phosphor",
		name: "Phosphor",
		description: "Luminous green on green-tinted black or pale green, with JetBrains Mono throughout. A classic green terminal atmosphere."
	},
	{
		id: "crt",
		name: "CRT",
		description: "White phosphor and amber on tube black, with a light counterpart, JetBrains Mono, and nearly square corners. A retro computer console."
	},
	{
		id: "manuscript",
		name: "Manuscript",
		description: "Lapis blue and gold on aged paper, with a dark reading-room variant and Lora serif throughout. A quiet illuminated manuscript."
	},
	{
		id: "rose",
		name: "Rosé",
		description: "Dried rose and gold on deep plum-gray or soft rose-tinted cream, with DM Sans. Gentle, muted, and warm."
	},
	{
		id: "miami",
		name: "Miami",
		description: "Hot magenta and cyan on violet-black or pale lavender, with Space Grotesk. Bright neon energy and a synthwave character."
	}
].map((theme) => ({
	id: theme.id,
	name: theme.name,
	description: theme.description,
	source: "builtin",
	modes: ["light", "dark"]
}));
function requireRecord(value, label) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
	return value;
}
function requireKeys(value, allowed, label) {
	const unknown = Object.keys(value).find((key) => !allowed.includes(key));
	if (unknown) throw new Error(`${label} has unsupported field ${unknown}`);
}
function requireText(value, label, maxLength) {
	if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength || Array.from(value).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) throw new Error(`${label} must be nonempty text of at most ${maxLength} characters`);
	return value.trim();
}
const NUMBER = "[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:e[+-]?\\d+)?";
const COMPONENT = `${NUMBER}%?`;
const HUE = `${NUMBER}(?:deg|grad|rad|turn)?`;
const LEGACY_COLOR_FUNCTION = new RegExp(`^(?:(?:rgb|rgba)\\( *(?:${NUMBER} *, *${NUMBER} *, *${NUMBER}|${NUMBER}% *, *${NUMBER}% *, *${NUMBER}%)|(?:hsl|hsla)\\( *${HUE} *, *${NUMBER}% *, *${NUMBER}%)(?: *, *${COMPONENT})? *\\)$`, "i");
const COLOR_FUNCTION = new RegExp(`^(?:(?:rgb|rgba|oklab|lab)\\( *${COMPONENT} +${COMPONENT} +${COMPONENT}|(?:hsl|hsla)\\( *${HUE} +${COMPONENT} +${COMPONENT}|(?:oklch|lch)\\( *${COMPONENT} +${COMPONENT} +${HUE})(?: */ *${COMPONENT})? *\\)$`, "i");
const COLOR_SPACE_FUNCTION = new RegExp(`^color\\( *(?:srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020|xyz|xyz-d50|xyz-d65) +${COMPONENT} +${COMPONENT} +${COMPONENT}(?: */ *${COMPONENT})? *\\)$`, "i");
const FONT_IDENTIFIER = "(?:--[a-z0-9_-]*|-?[a-z_][a-z0-9_-]*)";
const FONT_FAMILY = `(?:"[a-z0-9 ,'._-]*"|'[a-z0-9 ,"._-]*'|${FONT_IDENTIFIER}(?: +${FONT_IDENTIFIER})*)`;
const FONT_FAMILY_LIST = new RegExp(`^${FONT_FAMILY}(?: *, *${FONT_FAMILY})*$`, "i");
const CSS_WIDE_KEYWORDS = /* @__PURE__ */ new Set([
	"inherit",
	"initial",
	"unset",
	"revert",
	"revert-layer"
]);
const GENERIC_FONT_FAMILIES = /* @__PURE__ */ new Set([
	"serif",
	"sans-serif",
	"monospace",
	"cursive",
	"fantasy",
	"system-ui",
	"ui-serif",
	"ui-sans-serif",
	"ui-monospace",
	"ui-rounded",
	"emoji",
	"math",
	"fangsong",
	"-webkit-body"
]);
function isFontFamilyList(value) {
	if (!FONT_FAMILY_LIST.test(value)) return false;
	return value.replace(/"[^"]*"|'[^']*'/g, "").split(",").every((family) => {
		const words = family.trim().toLowerCase().split(/ +/);
		return words.every((word) => !CSS_WIDE_KEYWORDS.has(word) && word !== "default" && (words.length === 1 || !GENERIC_FONT_FAMILIES.has(word)));
	});
}
function requireColor(value, label) {
	const color = requireText(value, label, 120);
	if (!/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color) && !/^(?:transparent|black|white)$/i.test(color) && !LEGACY_COLOR_FUNCTION.test(color) && !COLOR_FUNCTION.test(color) && !COLOR_SPACE_FUNCTION.test(color)) throw new Error(`${label} must be a hex, rgb, hsl, lab, lch, oklab, oklch, or color() color`);
	return color;
}
function normalizePalette(value, mode) {
	const palette = requireRecord(value, `theme.${mode}`);
	requireKeys(palette, [...THEME_COLOR_KEYS, ...THEME_FONT_KEYS], `theme.${mode}`);
	const entries = THEME_COLOR_KEYS.map((key) => [key, requireColor(palette[key], `theme.${mode}.${key}`)]);
	const result = { ...Object.fromEntries(entries) };
	for (const key of THEME_FONT_KEYS) {
		if (palette[key] === void 0) continue;
		const font = requireText(palette[key], `theme.${mode}.${key}`, 120);
		if (!isFontFamilyList(font)) throw new Error(`theme.${mode}.${key} must contain only font family names`);
		result[key] = font;
	}
	return result;
}
/** Rejects executable CSS and incomplete palettes before they reach storage or a stylesheet. */
function normalizeThemeDefinition(input, options) {
	const record = requireRecord(input, "theme");
	requireKeys(record, [
		"name",
		"description",
		"mascot",
		"workingPhrases",
		"critters",
		"avatarHat",
		"light",
		"dark"
	], "theme");
	const definition = {
		name: requireText(record.name, "theme.name", 80),
		description: requireText(record.description, "theme.description", 320),
		...record.light !== void 0 ? { light: normalizePalette(record.light, "light") } : {},
		...record.dark !== void 0 ? { dark: normalizePalette(record.dark, "dark") } : {}
	};
	if (record.mascot !== void 0) {
		const mascot = THEME_MASCOT_VALUES.find((candidate) => candidate === record.mascot);
		if (!mascot) throw new Error(`theme.mascot must be one of ${THEME_MASCOT_VALUES.join(", ")}`);
		definition.mascot = mascot;
	}
	if (record.workingPhrases !== void 0) {
		if (!Array.isArray(record.workingPhrases) || record.workingPhrases.length > 24) throw new Error(`theme.workingPhrases must be an array of at most 24 entries`);
		const phrases = Array.from(record.workingPhrases, (phrase, index) => requireText(phrase, `theme.workingPhrases[${index}]`, 24));
		if (new Set(phrases).size !== phrases.length) throw new Error("theme.workingPhrases must not contain duplicate entries after trimming");
		definition.workingPhrases = phrases;
	}
	if (record.critters !== void 0) {
		if (!Array.isArray(record.critters) || record.critters.length > 8) throw new Error("theme.critters must be an array of at most 8 entries");
		const allowedIds = [...THEME_CRITTER_IDS, ...options?.critterIds ?? []];
		const critters = Array.from(record.critters, (entry, index) => {
			const critter = allowedIds.find((id) => id === entry);
			if (!critter) throw new Error(`theme.critters[${index}] must be one of ${allowedIds.join(", ")}`);
			return critter;
		});
		if (new Set(critters).size !== critters.length) throw new Error("theme.critters must not contain duplicate entries");
		definition.critters = critters;
	}
	if (record.avatarHat !== void 0) {
		const allowedIds = [...THEME_AVATAR_HAT_IDS, ...options?.hatIds ?? []];
		const avatarHat = allowedIds.find((id) => id === record.avatarHat);
		if (!avatarHat) throw new Error(`theme.avatarHat must be one of ${allowedIds.join(", ")}`);
		definition.avatarHat = avatarHat;
	}
	if (!definition.light && !definition.dark) throw new Error("theme must provide at least one light or dark palette");
	if (new TextEncoder().encode(JSON.stringify(definition)).length > 4096) throw new Error(`theme definition exceeds ${MAX_THEME_DEFINITION_BYTES} bytes`);
	return definition;
}
//#endregion
//#region src/plugins/manifest-themes.ts
const MAX_PLUGIN_THEMES = 32;
const MAX_THEME_ARTWORK_ENTRIES = 8;
function objectProperties(value) {
	return value.type === "ObjectExpression" ? value.properties.filter((property) => property.type === "Property") : [];
}
function propertyName(property) {
	return property.key.type === "Identifier" ? property.key.name : property.key.type === "Literal" ? String(property.key.value) : "";
}
function validateArtworkDuplicates(source) {
	const { parseExpressionAt } = createRequire(import.meta.url)("acorn");
	const root = parseExpressionAt(`(${source}\n)`, 0, { ecmaVersion: "latest" });
	for (const property of objectProperties(root)) {
		if (propertyName(property) !== "themes" || property.value.type !== "ArrayExpression") continue;
		for (const theme of property.value.elements) {
			if (!theme || theme.type !== "ObjectExpression") continue;
			for (const artwork of objectProperties(theme)) {
				const kind = propertyName(artwork);
				if (kind !== "hats" && kind !== "critters") continue;
				const ids = /* @__PURE__ */ new Set();
				for (const entry of objectProperties(artwork.value)) {
					const id = propertyName(entry);
					if (ids.has(id)) throw new Error(`themes.${kind} has duplicate artwork ID ${id}`);
					ids.add(id);
				}
			}
		}
	}
}
function normalizeArtworkEntries(value, label, catalogIds) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be a map with at most ${MAX_THEME_ARTWORK_ENTRIES} entries`);
	const entries = Object.entries(value);
	if (entries.length > MAX_THEME_ARTWORK_ENTRIES) throw new Error(`${label} must be a map with at most ${MAX_THEME_ARTWORK_ENTRIES} entries`);
	for (const [id] of entries) if (!THEME_ARTWORK_ID_PATTERN.test(id) || catalogIds.includes(id)) throw new Error(`${label}.${id} must use a safe local ID outside the built-in catalog`);
	return entries;
}
function normalizeArtworkPath(value, label) {
	const relativePath = typeof value === "string" ? value.replace(/^\.\//, "") : "";
	if (!/^(?:[a-z0-9_-][a-z0-9._-]*\/)*[a-z0-9_-][a-z0-9._-]*\.svg$/i.test(relativePath)) throw new Error(`${label} must be an SVG file inside the plugin root`);
	return relativePath;
}
function normalizeArtwork(hats, critters, label) {
	return {
		...hats !== void 0 ? { hats: Object.fromEntries(normalizeArtworkEntries(hats, `${label}.hats`, THEME_AVATAR_HAT_IDS).map(([id, source]) => [id, normalizeArtworkPath(source, `${label}.hats.${id}`)])) } : {},
		...critters !== void 0 ? { critters: Object.fromEntries(normalizeArtworkEntries(critters, `${label}.critters`, THEME_CRITTER_IDS).map(([id, metadata]) => {
			const entryLabel = `${label}.critters.${id}`;
			if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) throw new Error(`${entryLabel} must be an object with an SVG source`);
			const { source, title, crossMs } = metadata;
			if (Object.keys(metadata).some((key) => ![
				"source",
				"title",
				"crossMs"
			].includes(key))) throw new Error(`${entryLabel} has unsupported fields`);
			if (title !== void 0 && (typeof title !== "string" || title.length > 60 || /[\p{Cc}\p{Cf}\p{Cs}]/u.test(title))) throw new Error(`${entryLabel}.title must be at most 60 printable characters`);
			if (crossMs !== void 0 && (typeof crossMs !== "number" || !Number.isInteger(crossMs) || crossMs < 5e3 || crossMs > 9e4)) throw new Error(`${entryLabel}.crossMs must be an integer from 5000 to 90000`);
			return [id, {
				source: normalizeArtworkPath(source, `${entryLabel}.source`),
				...title !== void 0 ? { title } : {},
				...crossMs !== void 0 ? { crossMs } : {}
			}];
		})) } : {}
	};
}
function normalizeManifestThemes(value, pluginId, manifestSource) {
	if (value === void 0) return { ok: true };
	if (!Array.isArray(value) || value.length > MAX_PLUGIN_THEMES) return {
		ok: false,
		error: `themes must be an array with at most ${MAX_PLUGIN_THEMES} entries`
	};
	if (value.length && (pluginId === "user" || !isThemeId(`${pluginId}/x`))) return {
		ok: false,
		error: "themes require a portable plugin ID outside the reserved user namespace"
	};
	const themes = [];
	const ids = /* @__PURE__ */ new Set();
	for (const [index, entry] of value.entries()) {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) return {
			ok: false,
			error: `themes[${index}] must be an object`
		};
		const { id, name, description, source, hats, critters } = entry;
		if (Object.keys(entry).some((key) => ![
			"id",
			"name",
			"description",
			"source",
			"hats",
			"critters"
		].includes(key)) || typeof id !== "string" || !THEME_LOCAL_ID_PATTERN.test(id) || ids.has(id) || typeof name !== "string" || !name.trim() || name.trim().length > 80 || typeof description !== "string" || !description.trim() || description.trim().length > 320 || Array.from(name + description).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127) || typeof source !== "string") return {
			ok: false,
			error: `themes[${index}] requires a unique safe id, name, description, and JSON source`
		};
		const relativePath = source.replace(/^\.\//, "");
		if (!/^(?:[a-z0-9_-][a-z0-9._-]*\/)*[a-z0-9_-][a-z0-9._-]*\.json$/i.test(relativePath)) return {
			ok: false,
			error: `themes[${index}].source must be a JSON file inside the plugin root`
		};
		try {
			themes.push({
				id,
				name: name.trim(),
				description: description.trim(),
				source: relativePath,
				...normalizeArtwork(hats, critters, `themes[${index}]`)
			});
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : "invalid theme artwork"
			};
		}
		ids.add(id);
	}
	if (manifestSource && themes.some((theme) => theme.hats || theme.critters)) try {
		validateArtworkDuplicates(manifestSource);
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : "invalid theme artwork"
		};
	}
	return {
		ok: true,
		themes
	};
}
//#endregion
//#region src/plugins/manifest.ts
/** Loads and normalizes OpenClaw plugin manifests, including contracts and config schemas. */
/** Canonical plugin manifest filename inside plugin roots. */
const PLUGIN_MANIFEST_FILENAME = "openclaw.plugin.json";
const MAX_PLUGIN_MANIFEST_BYTES = 262144;
const CORE_RESERVED_PLUGIN_IDS = /* @__PURE__ */ new Set(["node-mcp"]);
const VALID_PLUGIN_KINDS = /* @__PURE__ */ new Set(["memory", "context-engine"]);
function isCoreReservedPluginId(id) {
	return CORE_RESERVED_PLUGIN_IDS.has(normalizePluginPolicyId(id));
}
function parsePluginKind(raw) {
	const values = typeof raw === "string" ? [raw] : Array.isArray(raw) ? raw : [];
	const kinds = [];
	for (const value of values) {
		if (typeof value !== "string" || !VALID_PLUGIN_KINDS.has(value)) continue;
		const kind = value;
		if (!kinds.includes(kind)) kinds.push(kind);
	}
	return kinds.length === 0 ? void 0 : kinds.length === 1 ? kinds[0] : kinds;
}
function parseDoctorStateMigrationDescriptors(raw) {
	if (typeof raw === "boolean") return raw;
	if (!Array.isArray(raw)) return;
	const seen = /* @__PURE__ */ new Set();
	return raw.flatMap((value) => {
		if (!isRecord(value)) return [];
		const id = normalizeOptionalString(value.id);
		if (!id || seen.has(id)) return [];
		seen.add(id);
		return [{
			id,
			...value.doctorOnly === true ? { doctorOnly: true } : {},
			...value.phase === "after-session-repair" ? { phase: "after-session-repair" } : {}
		}];
	});
}
function parseManifestBackupResources(raw) {
	if (raw === void 0) return { ok: true };
	if (!Array.isArray(raw)) return {
		ok: false,
		error: "backupResources must be an array"
	};
	const resources = /* @__PURE__ */ new Map();
	for (const [index, entry] of raw.entries()) {
		if (!isRecord(entry) || Object.keys(entry).length !== 3 || !("disposition" in entry) || !("scope" in entry) || !("relativePath" in entry)) return {
			ok: false,
			error: `backupResources[${index}] must contain only disposition, scope, and relativePath`
		};
		const { disposition, scope, relativePath } = entry;
		if (disposition !== "include" && disposition !== "regenerable") return {
			ok: false,
			error: `backupResources[${index}].disposition is invalid`
		};
		if (scope !== "state" && scope !== "agent") return {
			ok: false,
			error: `backupResources[${index}].scope is invalid`
		};
		if (typeof relativePath !== "string" || !relativePath || relativePath.includes("\\") || relativePath.includes("\0") || path.posix.isAbsolute(relativePath) || path.win32.isAbsolute(relativePath) || /^[A-Za-z][A-Za-z\d+.-]*:/.test(relativePath) || relativePath.split("/").some((segment) => !segment || segment === "." || segment === "..")) return {
			ok: false,
			error: `backupResources[${index}].relativePath must be a strict relative POSIX path`
		};
		const resource = {
			disposition,
			scope,
			relativePath
		};
		resources.set(`${scope}\0${relativePath}\0${disposition}`, resource);
	}
	return {
		ok: true,
		resources: [...resources.entries()].toSorted(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([, resource]) => resource)
	};
}
function loadPluginManifest(rootDir, rejectHardlinks = true, rootRealPath) {
	const file = readPluginCacheFile({
		rootDir,
		relativePath: PLUGIN_MANIFEST_FILENAME,
		...rootRealPath !== void 0 ? { rootRealPath } : {},
		maxBytes: MAX_PLUGIN_MANIFEST_BYTES,
		rejectHardlinks
	});
	const manifestPath = file.ok ? file.path : path.join(rootDir, PLUGIN_MANIFEST_FILENAME);
	if (!file.ok) return matchRootFileOpenFailure(file.failure, {
		path: () => ({
			ok: false,
			error: `plugin manifest not found: ${manifestPath}`,
			manifestPath
		}),
		fallback: (failure) => ({
			ok: false,
			error: `unsafe plugin manifest path: ${manifestPath} (${failure.reason})`,
			manifestPath
		})
	});
	if (file.manifest) return file.manifest;
	const cacheResult = (result) => {
		return file.manifest = result;
	};
	const parsed = parsePluginCacheJson(file, { json5: true });
	if (!parsed.ok) return cacheResult({
		ok: false,
		error: `failed to parse plugin manifest: ${String(parsed.error)}`,
		manifestPath
	});
	const raw = parsed.value;
	if (!isRecord(raw)) return cacheResult({
		ok: false,
		error: "plugin manifest must be an object",
		manifestPath
	});
	const id = normalizeOptionalString(raw.id) ?? "";
	if (!id) return cacheResult({
		ok: false,
		error: "plugin manifest requires id",
		manifestPath
	});
	if (isCoreReservedPluginId(id)) return cacheResult({
		ok: false,
		error: `plugin manifest id "${id}" is reserved by OpenClaw core`,
		manifestPath
	});
	const configSchema = isRecord(raw.configSchema) ? raw.configSchema : null;
	if (!configSchema) return cacheResult({
		ok: false,
		error: "plugin manifest requires configSchema",
		manifestPath
	});
	const backupResources = parseManifestBackupResources(raw.backupResources);
	if (!backupResources.ok) return cacheResult({
		ok: false,
		error: `invalid plugin manifest backupResources: ${backupResources.error}`,
		manifestPath,
		diagnosticCode: "backup-resource-declaration-invalid"
	});
	const categories = validatePluginCategories(raw.categories);
	if (!categories.ok) return cacheResult({
		ok: false,
		error: `invalid plugin manifest categories: ${categories.error}`,
		manifestPath
	});
	const requiresPlugins = normalizeTrimmedStringList(raw.requiresPlugins);
	const enabledByDefaultOnPlatforms = normalizeManifestPlatforms(raw.enabledByDefaultOnPlatforms);
	const legacyPluginIds = normalizeTrimmedStringList(raw.legacyPluginIds);
	const autoEnableWhenConfiguredProviders = normalizeTrimmedStringList(raw.autoEnableWhenConfiguredProviders);
	const providers = normalizeTrimmedStringList(raw.providers);
	const channels = normalizeTrimmedStringList(raw.channels);
	const contracts = normalizeManifestContracts(raw.contracts);
	const cliBackends = normalizeTrimmedStringList(raw.cliBackends);
	const rawDoctorContract = isRecord(raw.doctorContract) ? raw.doctorContract : void 0;
	const stateMigrations = parseDoctorStateMigrationDescriptors(rawDoctorContract?.stateMigrations);
	const doctorContract = rawDoctorContract ? {
		...Object.fromEntries([
			"configRepair",
			"resolveSessionStoreAgentIds",
			"sessionRouteStateOwners"
		].flatMap((key) => typeof rawDoctorContract[key] === "boolean" ? [[key, rawDoctorContract[key]]] : [])),
		...stateMigrations !== void 0 ? { stateMigrations } : {}
	} : void 0;
	const manifestBeforeDashboard = {
		id,
		configSchema,
		..."categories" in categories ? { categories: categories.categories } : {},
		...backupResources.resources !== void 0 ? { backupResources: backupResources.resources } : {},
		...requiresPlugins.length > 0 ? { requiresPlugins } : {},
		...raw.enabledByDefault === true ? { enabledByDefault: true } : {},
		...enabledByDefaultOnPlatforms.length > 0 ? { enabledByDefaultOnPlatforms } : {},
		...legacyPluginIds.length > 0 ? { legacyPluginIds } : {},
		...autoEnableWhenConfiguredProviders.length > 0 ? { autoEnableWhenConfiguredProviders } : {},
		kind: parsePluginKind(raw.kind),
		channels,
		channelAccountKeyPolicies: normalizeChannelAccountKeyPolicies(raw.channelAccountKeyPolicies, channels),
		providers,
		providerCatalogEntry: normalizeOptionalString(raw.providerCatalogEntry),
		capabilityCatalogEntry: raw.capabilityCatalogEntry === void 0 ? void 0 : normalizeOptionalString(raw.capabilityCatalogEntry) ?? "",
		modelSupport: normalizeManifestModelSupport(raw.modelSupport),
		modelCatalog: normalizeModelCatalog(raw.modelCatalog, { ownedProviders: /* @__PURE__ */ new Set([...providers, ...cliBackends]) }),
		modelPricing: normalizeManifestModelPricing(raw.modelPricing, { ownedProviders: new Set(providers) }),
		modelIdNormalization: normalizeManifestModelIdNormalization(raw.modelIdNormalization, { ownedProviders: new Set(providers) }),
		providerEndpoints: normalizeManifestProviderEndpoints(raw.providerEndpoints),
		providerRequest: normalizeManifestProviderRequest(raw.providerRequest, { ownedProviders: new Set(providers) }),
		secretProviderIntegrations: normalizeManifestSecretProviderIntegrations(raw.secretProviderIntegrations),
		cliBackends,
		syntheticAuthRefs: normalizeTrimmedStringList(raw.syntheticAuthRefs),
		nonSecretAuthMarkers: normalizeTrimmedStringList(raw.nonSecretAuthMarkers),
		commandAliases: normalizeManifestCommandAliases(raw.commandAliases),
		cliCommands: normalizeManifestCliCommands(raw.cliCommands),
		providerUsageAuthEnvVars: normalizeStringListRecord(raw.providerUsageAuthEnvVars),
		providerAuthAliases: normalizeManifestProviderAuthAliases(raw.providerAuthAliases),
		providerAuthChoices: normalizeProviderAuthChoices(raw.providerAuthChoices),
		activation: normalizeManifestActivation(raw.activation),
		setup: normalizeManifestSetup(raw.setup),
		doctorContract,
		doctorHealthChecks: raw.doctorHealthChecks === true ? true : void 0,
		sessionRouteStateOwners: raw.sessionRouteStateOwners === void 0 ? void 0 : coerceDoctorSessionRouteStateOwners(raw.sessionRouteStateOwners),
		qaRunners: normalizeManifestQaRunners(raw.qaRunners)
	};
	const dashboardResult = normalizeManifestDashboard(raw.dashboard);
	if (!dashboardResult.ok) return cacheResult({
		ok: false,
		error: `invalid plugin manifest dashboard: ${dashboardResult.error}`,
		manifestPath
	});
	const uiCapabilities = validatePluginUiCapabilities(raw.uiCapabilities);
	const controlUiResult = normalizeManifestControlUi(raw.controlUi);
	if (!controlUiResult.ok) return cacheResult({
		ok: false,
		error: `invalid plugin manifest controlUi: ${controlUiResult.error}`,
		manifestPath
	});
	const themesResult = normalizeManifestThemes(raw.themes, id, file.contents.toString("utf8"));
	if (!themesResult.ok) return cacheResult({
		ok: false,
		error: `invalid plugin manifest themes: ${themesResult.error}`,
		manifestPath
	});
	return cacheResult({
		ok: true,
		...!uiCapabilities.ok ? { warnings: [`ignoring invalid plugin manifest uiCapabilities: ${uiCapabilities.error}`] } : {},
		manifest: {
			...manifestBeforeDashboard,
			dashboard: dashboardResult.dashboard,
			controlUi: controlUiResult.value,
			...uiCapabilities.ok && uiCapabilities.capabilities !== void 0 ? { uiCapabilities: uiCapabilities.capabilities } : {},
			themes: themesResult.themes,
			mcpServers: normalizeManifestMcpServers(raw.mcpServers),
			skills: normalizeTrimmedStringList(raw.skills),
			name: normalizeOptionalString(raw.name),
			description: normalizeOptionalString(raw.description),
			catalog: normalizeManifestCatalog(raw.catalog),
			version: normalizeOptionalString(raw.version),
			uiHints: normalizeConfigUiHints(raw.uiHints),
			configGroups: normalizeConfigGroups(raw.configGroups, configSchema),
			contracts,
			decisionModels: normalizeManifestDecisionModels(raw.decisionModels, contracts?.decisionProviders),
			transcriptSources: normalizeManifestTranscriptSources(raw.transcriptSources, contracts?.transcriptSourceProviders),
			mediaUnderstandingProviderMetadata: normalizeMediaUnderstandingProviderMetadata(raw.mediaUnderstandingProviderMetadata),
			imageGenerationProviderMetadata: normalizeCapabilityProviderMetadata(raw.imageGenerationProviderMetadata),
			videoGenerationProviderMetadata: normalizeCapabilityProviderMetadata(raw.videoGenerationProviderMetadata),
			musicGenerationProviderMetadata: normalizeCapabilityProviderMetadata(raw.musicGenerationProviderMetadata),
			toolMetadata: normalizePluginToolMetadata(raw.toolMetadata),
			configContracts: normalizeManifestConfigContracts(raw.configContracts),
			channelConfigs: normalizeChannelConfigs(raw.channelConfigs)
		},
		manifestPath
	});
}
//#endregion
//#region src/plugins/bundle-manifest.ts
/** Reads Agent/Codex/Claude/Cursor bundle manifests into OpenClaw plugin manifest metadata. */
/** Relative manifest path for Codex-style plugin bundles. */
const CODEX_BUNDLE_MANIFEST_RELATIVE_PATH = ".codex-plugin/plugin.json";
const CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH = ".claude-plugin/plugin.json";
const CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH = ".cursor-plugin/plugin.json";
const AGENT_BUNDLE_MANIFEST_RELATIVE_PATH = "plugin.json";
const AGENT_BUNDLE_EXTENSION_NAMESPACE = "ai.openclaw";
const AGENT_BUNDLE_MANIFEST_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";
const MAX_AGENT_BUNDLE_MANIFEST_BYTES = 262144;
const log$1 = createSubsystemLogger("plugins/bundle-manifest");
/** Normalizes string-or-list path fields from bundle manifests. */
function normalizeBundlePathList(value) {
	return normalizeUniqueSingleOrTrimmedStringList(value);
}
function mergeBundlePathLists(...groups) {
	return [...new Set(groups.flat())];
}
function hasInlineCapabilityValue(value) {
	if (typeof value === "string") return value.trim().length > 0;
	if (Array.isArray(value)) return value.length > 0;
	if (isRecord(value)) return Object.keys(value).length > 0;
	return value === true;
}
function slugifyPluginId(raw, rootDir) {
	const fallback = path.basename(rootDir);
	return (normalizeLowercaseStringOrEmpty(raw) || normalizeLowercaseStringOrEmpty(fallback)).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "bundle-plugin";
}
function loadBundleManifestFile(params) {
	const manifestPath = path.join(params.rootDir, params.manifestRelativePath);
	const file = readPluginCacheFile({
		rootDir: params.rootDir,
		rootRealPath: params.rootRealPath,
		relativePath: params.manifestRelativePath,
		rejectHardlinks: params.rejectHardlinks,
		maxBytes: MAX_AGENT_BUNDLE_MANIFEST_BYTES
	});
	if (!file.ok) return matchRootFileOpenFailure(file.failure, {
		path: () => {
			if (params.allowMissing) return {
				ok: true,
				raw: {},
				manifestPath
			};
			return {
				ok: false,
				error: `plugin manifest not found: ${manifestPath}`,
				manifestPath
			};
		},
		fallback: (failure) => ({
			ok: false,
			error: `unsafe plugin manifest path: ${manifestPath} (${failure.reason})`,
			manifestPath
		})
	});
	const result = parsePluginCacheJson(file, { json5: !params.strictJson });
	if (!result.ok) return {
		ok: false,
		error: `failed to parse plugin manifest: ${formatErrorMessage(result.error)}`,
		manifestPath
	};
	if (!isRecord(result.value)) return {
		ok: false,
		error: "plugin manifest must be an object",
		manifestPath
	};
	return {
		ok: true,
		raw: result.value,
		manifestPath
	};
}
function resolveCodexComponentDirs(raw, rootDir, component) {
	const declared = normalizeBundlePathList(raw[component]);
	if (declared.length > 0) return declared;
	return pluginCacheExistsSync(path.join(rootDir, component)) ? [component] : [];
}
function resolveCursorCommandRootDirs(raw, rootDir) {
	return resolveBundleComponentPaths(raw.commands, rootDir, [".cursor/commands"]);
}
function resolveCursorSkillDirs(raw, rootDir) {
	return mergeBundlePathLists(resolveBundleComponentPaths(raw.skills, rootDir, ["skills"]), resolveCursorCommandRootDirs(raw, rootDir));
}
function resolveCursorAgentDirs(raw, rootDir) {
	return resolveBundleComponentPaths(raw.subagents ?? raw.agents, rootDir, [".cursor/agents"]);
}
function resolveBundleComponentPaths(value, rootDir, defaults) {
	const declared = normalizeBundlePathList(value);
	return mergeBundlePathLists(defaults.filter((candidate) => pluginCacheExistsSync(path.join(rootDir, candidate))), declared);
}
function buildCursorCapabilities(raw, rootDir) {
	const capabilities = [
		...resolveCursorSkillDirs(raw, rootDir).length > 0 ? ["skills"] : [],
		...resolveCursorCommandRootDirs(raw, rootDir).length > 0 ? ["commands"] : [],
		...resolveCursorAgentDirs(raw, rootDir).length > 0 ? ["agents"] : []
	];
	for (const [capability, defaultPath] of [
		["hooks", ".cursor/hooks.json"],
		["rules", ".cursor/rules"],
		["mcpServers", ".mcp.json"]
	]) if (hasInlineCapabilityValue(raw[capability]) || pluginCacheExistsSync(path.join(rootDir, defaultPath))) capabilities.push(capability);
	return capabilities;
}
function resolveAgentSkillDirs(rootDir) {
	try {
		return pluginCacheStatSync(path.join(rootDir, "skills"))?.isDirectory() ? ["skills"] : [];
	} catch {
		return [];
	}
}
function resolveAgentActivation(raw, manifestPath) {
	if (raw.extensions === void 0) return;
	if (!isRecord(raw.extensions)) {
		log$1.warn(`ignoring Agent Plugins extensions in ${manifestPath}: expected an object`);
		return;
	}
	const openclawExtension = raw.extensions[AGENT_BUNDLE_EXTENSION_NAMESPACE];
	if (openclawExtension === void 0) return;
	if (!isRecord(openclawExtension)) {
		log$1.warn(`ignoring Agent Plugins ${AGENT_BUNDLE_EXTENSION_NAMESPACE} extension in ${manifestPath}: expected an object`);
		return;
	}
	return normalizeManifestActivation(openclawExtension.activation);
}
function loadBundleManifest(params) {
	const rejectHardlinks = params.rejectHardlinks ?? true;
	const manifestRelativePath = params.bundleFormat === "codex" ? CODEX_BUNDLE_MANIFEST_RELATIVE_PATH : params.bundleFormat === "cursor" ? CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH : params.bundleFormat === "agent" ? AGENT_BUNDLE_MANIFEST_RELATIVE_PATH : CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH;
	const loaded = loadBundleManifestFile({
		rootDir: params.rootDir,
		...params.rootRealPath !== void 0 ? { rootRealPath: params.rootRealPath } : {},
		manifestRelativePath,
		rejectHardlinks,
		allowMissing: params.bundleFormat === "claude",
		strictJson: params.bundleFormat === "agent"
	});
	if (!loaded.ok) return loaded;
	const raw = loaded.raw;
	const interfaceRecord = isRecord(raw.interface) ? raw.interface : void 0;
	const name = normalizeOptionalString(raw.name);
	const description = normalizeOptionalString(raw.description) ?? normalizeOptionalString(raw.shortDescription) ?? normalizeOptionalString(interfaceRecord?.shortDescription);
	const version = normalizeOptionalString(raw.version);
	const manifest = {
		id: slugifyPluginId(name, params.rootDir),
		name,
		description,
		version,
		skills: [],
		settingsFiles: [],
		hooks: [],
		bundleFormat: params.bundleFormat,
		activation: void 0,
		capabilities: []
	};
	if (params.bundleFormat === "agent") {
		if (raw.$schema !== AGENT_BUNDLE_MANIFEST_SCHEMA) return {
			ok: false,
			error: `root plugin.json is not an Agent Plugins manifest; expected $schema ${AGENT_BUNDLE_MANIFEST_SCHEMA}`,
			manifestPath: loaded.manifestPath
		};
		if (!name) return {
			ok: false,
			error: "agent plugin manifest name must be a non-empty string",
			manifestPath: loaded.manifestPath
		};
		manifest.skills = resolveAgentSkillDirs(params.rootDir);
		manifest.activation = resolveAgentActivation(raw, loaded.manifestPath);
		manifest.capabilities = [...manifest.skills.length > 0 ? ["skills"] : [], ...pluginCacheExistsSync(path.join(params.rootDir, "mcp.json")) ? ["mcpServers"] : []];
	} else {
		manifest.activation = normalizeManifestActivation(raw.activation);
		if (params.bundleFormat === "codex") {
			manifest.skills = resolveCodexComponentDirs(raw, params.rootDir, "skills");
			manifest.hooks = resolveCodexComponentDirs(raw, params.rootDir, "hooks");
			manifest.capabilities = [...manifest.skills.length > 0 ? ["skills"] : [], ...manifest.hooks.length > 0 ? ["hooks"] : []];
			for (const [capability, defaultPath] of [["mcpServers", ".mcp.json"], ["apps", ".app.json"]]) if (hasInlineCapabilityValue(raw[capability]) || pluginCacheExistsSync(path.join(params.rootDir, defaultPath))) manifest.capabilities.push(capability);
		} else if (params.bundleFormat === "cursor") {
			manifest.skills = resolveCursorSkillDirs(raw, params.rootDir);
			manifest.capabilities = buildCursorCapabilities(raw, params.rootDir);
		} else Object.assign(manifest, resolveClaudeComponents(raw, params.rootDir));
	}
	const extensions = isRecord(raw.extensions) ? raw.extensions : void 0;
	const openai = isRecord(extensions?.["com.openai"]) ? extensions["com.openai"] : void 0;
	const onboardingSkill = normalizeOptionalString(openai?.onboardingSkill);
	if (onboardingSkill) {
		const relative = path.normalize(onboardingSkill);
		if (!path.isAbsolute(relative) && relative !== ".." && !relative.startsWith(`..${path.sep}`) && path.basename(relative) === "SKILL.md" && manifest.skills.some((root) => {
			const fromRoot = path.relative(path.resolve(params.rootDir, root), path.resolve(params.rootDir, relative));
			return fromRoot !== ".." && !fromRoot.startsWith(`..${path.sep}`) && !path.isAbsolute(fromRoot);
		})) manifest.onboardingSkill = relative;
	}
	return {
		ok: true,
		manifest,
		manifestPath: loaded.manifestPath
	};
}
function resolveClaudeComponents(raw, rootDir) {
	const skillRoots = resolveBundleComponentPaths(raw.skills, rootDir, ["skills"]);
	const commands = resolveBundleComponentPaths(raw.commands, rootDir, ["commands"]);
	const agents = resolveBundleComponentPaths(raw.agents, rootDir, ["agents"]);
	const outputStyles = resolveBundleComponentPaths(raw.outputStyles, rootDir, ["output-styles"]);
	const skills = mergeBundlePathLists(skillRoots, commands, agents, outputStyles);
	const settingsFiles = pluginCacheExistsSync(path.join(rootDir, "settings.json")) ? ["settings.json"] : [];
	const hooks = resolveBundleComponentPaths(raw.hooks, rootDir, ["hooks/hooks.json"]);
	return {
		skills,
		settingsFiles,
		hooks,
		capabilities: [
			...skills.length > 0 ? ["skills"] : [],
			...commands.length > 0 ? ["commands"] : [],
			...agents.length > 0 ? ["agents"] : [],
			...hasInlineCapabilityValue(raw.hooks) || hooks.length > 0 ? ["hooks"] : [],
			...hasInlineCapabilityValue(raw.mcpServers) || resolveBundleComponentPaths(raw.mcpServers, rootDir, [".mcp.json"]).length > 0 ? ["mcpServers"] : [],
			...hasInlineCapabilityValue(raw.lspServers) || resolveBundleComponentPaths(raw.lspServers, rootDir, [".lsp.json"]).length > 0 ? ["lspServers"] : [],
			...hasInlineCapabilityValue(raw.outputStyles) || outputStyles.length > 0 ? ["outputStyles"] : [],
			...settingsFiles.length > 0 ? ["settings"] : []
		]
	};
}
function detectBundleManifestFormat(rootDir, hasPackageExtensions = false) {
	if (hasPackageExtensions && pluginCacheExistsSync(path.join(rootDir, "openclaw.plugin.json"))) return null;
	if (pluginCacheExistsSync(path.join(rootDir, ".codex-plugin/plugin.json"))) return "codex";
	if (pluginCacheExistsSync(path.join(rootDir, ".cursor-plugin/plugin.json"))) return "cursor";
	if (pluginCacheExistsSync(path.join(rootDir, ".claude-plugin/plugin.json"))) return "claude";
	if (pluginCacheExistsSync(path.join(rootDir, "openclaw.plugin.json"))) return null;
	if (pluginCacheExistsSync(path.join(rootDir, "plugin.json"))) {
		const agentManifest = loadBundleManifestFile({
			rootDir,
			manifestRelativePath: AGENT_BUNDLE_MANIFEST_RELATIVE_PATH,
			rejectHardlinks: false,
			strictJson: true
		});
		if (agentManifest.ok && agentManifest.raw.$schema === AGENT_BUNDLE_MANIFEST_SCHEMA) return "agent";
	}
	if (DEFAULT_PLUGIN_ENTRY_CANDIDATES.some((candidate) => pluginCacheExistsSync(path.join(rootDir, candidate)))) return null;
	if ([
		path.join(rootDir, "skills"),
		path.join(rootDir, "commands"),
		path.join(rootDir, "agents"),
		path.join(rootDir, "hooks", "hooks.json"),
		path.join(rootDir, ".mcp.json"),
		path.join(rootDir, ".lsp.json"),
		path.join(rootDir, "settings.json")
	].some((candidate) => pluginCacheExistsSync(candidate))) return "claude";
	return null;
}
//#endregion
//#region src/plugins/package-compat.ts
function normalizePartialComparableVersion(version) {
	const trimmed = version.trim();
	return /^[vV]?[0-9]+\.[0-9]+$/.test(trimmed) ? {
		version: `${trimmed}.0`,
		isPartial: true
	} : {
		version: trimmed,
		isPartial: false
	};
}
function normalizePluginApiVersionForComparator(version, target) {
	const normalizedCorrection = OPENCLAW_NUMERIC_CORRECTION_PATTERN.exec(version.trim())?.[1];
	if (normalizedCorrection) return normalizedCorrection;
	return prerelease(normalizePartialComparableVersion(target).version) ? version : OPENCLAW_RELEASE_SUFFIX_PATTERN.exec(version.trim())?.[1] ?? version;
}
function satisfiesComparator(version, token) {
	const trimmed = token.trim();
	if (!trimmed) return true;
	const match = /^(>=|<=|>|<|=|\^|~)?\s*(.+)$/.exec(trimmed);
	if (!match) return false;
	const operator = match[1] ?? "";
	const target = match[2]?.trim();
	if (!target || /^[<>=^~]/.test(target)) return false;
	const comparableVersion = normalizePluginApiVersionForComparator(version, target);
	const normalizedTarget = normalizePartialComparableVersion(target);
	const comparator = normalizedTarget.isPartial && !operator ? `>=${normalizedTarget.version}` : `${operator}${normalizedTarget.version}`;
	return satisfies(comparableVersion, comparator, { includePrerelease: true });
}
function satisfiesSemverRange(version, range) {
	if (range.includes("||")) return false;
	const tokens = normalizeStringEntries(range.trim().split(/\s+/));
	if (tokens.length === 0) return false;
	return tokens.every((token) => satisfiesComparator(version, token));
}
const OPENCLAW_RELEASE_SUFFIX_PATTERN = /^[vV]?(\d{4}\.[1-9]\d?\.[1-9]\d*)(?:-\d+|-(?:alpha|beta|rc)\.\d+)$/i;
const OPENCLAW_NUMERIC_CORRECTION_PATTERN = /^[vV]?(\d{4}\.[1-9]\d?\.[1-9]\d*)-\d+$/;
/** Resolves the plugin API compatibility range declared by package metadata. */
function resolvePackagePluginApiRange(packageMetadata) {
	if (!isRecord(packageMetadata) || !("compat" in packageMetadata)) return { ok: true };
	const compat = packageMetadata.compat;
	if (compat === void 0 || compat === null) return { ok: true };
	if (!isRecord(compat)) return {
		ok: false,
		error: "package.json openclaw.compat must be an object"
	};
	if (!("pluginApi" in compat)) return { ok: true };
	const pluginApi = compat.pluginApi;
	if (typeof pluginApi !== "string") return {
		ok: false,
		error: "package.json openclaw.compat.pluginApi must be a string"
	};
	const range = pluginApi.trim();
	if (!range) return {
		ok: false,
		error: "package.json openclaw.compat.pluginApi must not be empty"
	};
	return {
		ok: true,
		range
	};
}
/** Checks whether a host plugin API version satisfies a package plugin API range. */
function satisfiesPluginApiRange(pluginApiVersion, pluginApiRange) {
	if (!pluginApiRange) return true;
	return satisfiesSemverRange(pluginApiVersion, pluginApiRange);
}
//#endregion
//#region src/plugins/runtime-degraded-state.ts
/** Boot-stable quarantine state for configured plugins whose payload failed verification. */
const PLUGIN_AVAILABILITY_POLICY = {
	state: "configured-unavailable",
	severity: "warning",
	repairCommand: "openclaw doctor --fix"
};
//#endregion
//#region src/plugins/discovery-availability.ts
const CONFIGURED_PLUGIN_PATH_UNAVAILABLE = "configured-plugin-path-unavailable";
const CONFIGURED_PLUGIN_PATH_INSPECTION_FAILED = "configured-plugin-path-inspection-failed";
function shouldSkipIncompatiblePackagePluginApi(params) {
	if (params.origin === "bundled") return false;
	const packagePluginApiRangeCheck = resolvePackagePluginApiRange(params.packageManifest);
	if (!packagePluginApiRangeCheck.ok) {
		params.diagnostics.push({
			level: "warn",
			configDisposition: "preserve",
			source: path.join(params.packageDir, "package.json"),
			message: `invalid package plugin API metadata: ${packagePluginApiRangeCheck.error}; skipping discovery (check package.json openclaw.compat.pluginApi)`,
			pluginId: params.pluginId
		});
		return true;
	}
	const packagePluginApiRange = packagePluginApiRangeCheck.range;
	if (!packagePluginApiRange) return false;
	const compatibilityHostVersion = resolveCompatibilityHostVersion(params.env);
	if (satisfiesPluginApiRange(compatibilityHostVersion, packagePluginApiRange)) return false;
	params.diagnostics.push({
		level: "warn",
		configDisposition: "preserve",
		source: path.join(params.packageDir, "package.json"),
		message: `plugin requires plugin API ${packagePluginApiRange}, but this host is ${compatibilityHostVersion}; skipping discovery (check "openclaw --version", OPENCLAW_COMPATIBILITY_HOST_VERSION, or run "openclaw doctor")`,
		pluginId: params.pluginId
	});
	return true;
}
function pluginPathFailureDiagnostic(source, origin, error) {
	if (origin === "config" && !isMissingPathError(error)) {
		const errorCode = extractErrorCode(error) ?? "UNKNOWN";
		const fixHint = `${errorCode === "EACCES" || errorCode === "EPERM" ? `Fix permissions on ${source}` : errorCode === "ELOOP" ? `Fix the symbolic link loop at ${source}` : `Resolve the filesystem inspection error on ${source}`}, then run \`${PLUGIN_AVAILABILITY_POLICY.repairCommand}\`.`;
		return {
			level: "warn",
			code: CONFIGURED_PLUGIN_PATH_INSPECTION_FAILED,
			configDisposition: "preserve",
			errorCode,
			source,
			fixHint,
			message: `Configured plugin load path inspection failed: ${source} (${formatErrorMessageWithCode(error)}). Uninspected plugin configuration is preserved. ${fixHint}`
		};
	}
	return origin === "config" ? {
		level: "warn",
		code: CONFIGURED_PLUGIN_PATH_UNAVAILABLE,
		configDisposition: "preserve",
		source,
		message: `Configured plugin load path is unavailable: ${source}. Uninspected plugin configuration is preserved. Restore access to the path, then run \`${PLUGIN_AVAILABILITY_POLICY.repairCommand}\`.`
	} : {
		level: "error",
		source,
		message: `plugin path not found: ${source}`
	};
}
function inspectPluginLoadPath(source, origin, diagnostics) {
	try {
		const stat = pluginCacheStatSync(source, origin === "config");
		if (!stat && !pluginCacheExistsSync(source)) diagnostics.push(pluginPathFailureDiagnostic(source, origin, void 0));
		if (origin === "config" && stat) {
			if (stat.isDirectory()) readPluginCacheDirectory(source);
			else if (!stat.isFile()) throw Object.assign(/* @__PURE__ */ new Error("Plugin load path is not a regular file or directory"), { code: "ERR_INVALID_FILE_TYPE" });
		}
		return stat;
	} catch (error) {
		diagnostics.push(pluginPathFailureDiagnostic(source, origin, error));
		return null;
	}
}
//#endregion
//#region src/plugins/hardlink-policy.ts
/** Enforces plugin root hardlink policy with bundled and immutable Nix-store exceptions. */
const NIX_STORE_ROOT = "/nix/store";
/** Returns true when a plugin root resolves inside the immutable Nix store. */
function isNixStorePluginRoot(rootDir) {
	const rootRealPath = pluginCacheRealpathSync(rootDir) ?? path.resolve(rootDir);
	return rootRealPath === NIX_STORE_ROOT || rootRealPath.startsWith(`${NIX_STORE_ROOT}/`);
}
/** Decides whether plugin file hardlinks should fail boundary validation for one root. */
function shouldRejectHardlinkedPluginFiles(params) {
	if (params.origin === "bundled") return false;
	if (resolveIsNixMode(params.env) && isNixStorePluginRoot(params.rootDir)) return false;
	return true;
}
//#endregion
//#region src/plugins/discovery-required-plugins.ts
function addMissingRequiredPluginDiagnostics(result, params) {
	const candidatePolicyIds = new Set(result.candidates.map((candidate) => normalizePluginPolicyId(candidate.idHint)));
	const seen = /* @__PURE__ */ new Set();
	let configuredFileManifestPolicyIds;
	for (const candidate of result.candidates) for (const requiredPluginId of candidate.requiredPluginIds ?? []) {
		const requiredPolicyId = normalizePluginPolicyId(requiredPluginId);
		if (candidatePolicyIds.has(requiredPolicyId)) continue;
		if (!configuredFileManifestPolicyIds) {
			configuredFileManifestPolicyIds = /* @__PURE__ */ new Set();
			for (const configuredCandidate of result.candidates) {
				if (configuredCandidate.origin !== "config" || configuredCandidate.packageDir) continue;
				const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
					origin: configuredCandidate.origin,
					rootDir: configuredCandidate.rootDir,
					env: params.env
				});
				const manifest = loadPluginManifest(configuredCandidate.rootDir, rejectHardlinks);
				if (manifest.ok) configuredFileManifestPolicyIds.add(normalizePluginPolicyId(manifest.manifest.id));
			}
		}
		if (configuredFileManifestPolicyIds.has(requiredPolicyId)) continue;
		const key = `${normalizePluginPolicyId(candidate.idHint)}\0${requiredPolicyId}`;
		if (seen.has(key)) continue;
		seen.add(key);
		result.diagnostics.push({
			level: "warn",
			pluginId: candidate.idHint,
			source: candidate.requiredPluginSource ?? candidate.source,
			message: `plugin "${candidate.idHint}" requires plugin "${requiredPluginId}"; install "${requiredPluginId}" to use it`
		});
	}
}
//#endregion
//#region src/plugins/package-entry-resolution.ts
function reportPackageEntryDiagnostic(params, level, message) {
	params.diagnostics.push({
		level,
		...params.pluginIdHint ? { pluginId: params.pluginIdHint } : {},
		message,
		source: params.sourceLabel
	});
	return null;
}
function resolvePackageRuntimeExtensionEntries(params) {
	const declared = getPackageManifestMetadata(params.manifest ?? void 0)?.runtimeExtensions;
	const runtimeExtensions = [];
	if (!Array.isArray(declared)) return {
		ok: true,
		runtimeExtensions
	};
	for (const [index, entry] of declared.entries()) {
		const normalized = normalizeOptionalString(entry);
		if (!normalized) return {
			ok: false,
			error: `package.json openclaw.runtimeExtensions[${index}] must be a non-empty string`
		};
		runtimeExtensions.push(normalized);
	}
	if (runtimeExtensions.length > 0 && runtimeExtensions.length !== params.extensions.length) return {
		ok: false,
		error: `package.json openclaw.runtimeExtensions length (${runtimeExtensions.length}) must match openclaw.extensions length (${params.extensions.length})`
	};
	return {
		ok: true,
		runtimeExtensions
	};
}
function missingCompiledRuntimeEntryMessage(params) {
	const label = params.context === "install" ? "package install" : "installed plugin package";
	const recovery = params.context === "install" ? "retry installation after the publisher ships compiled JavaScript" : "update or reinstall the plugin after the publisher ships compiled JavaScript, or disable/uninstall the plugin until then";
	return `${label} requires compiled runtime output for TypeScript entry ${params.entry}: expected ${params.candidates.join(", ")}. This is a plugin packaging issue, not a local config problem; ${recovery}. TypeScript source fallback is only supported for source checkouts and local development paths.`;
}
function resolvePackageEntrySource(params) {
	const source = path.resolve(params.packageDir, params.entryPath);
	const rejectHardlinks = params.rejectHardlinks ?? true;
	const candidates = [source];
	const openCandidate = (absolutePath) => {
		const opened = checkPluginCacheEntry({
			rootDir: params.packageDir,
			relativePath: path.relative(params.packageDir, absolutePath),
			rootRealPath: params.packageRootRealPath,
			rejectHardlinks
		});
		if (!opened.ok) return matchRootFileOpenFailure(opened, {
			path: () => null,
			io: () => reportPackageEntryDiagnostic(params, "warn", `extension entry unreadable (I/O error): ${params.entryPath}`),
			fallback: () => reportPackageEntryDiagnostic(params, "error", `extension entry escapes package directory: ${params.entryPath}`)
		});
		return opened.exists ? opened.path : null;
	};
	if (!rejectHardlinks) {
		const builtCandidate = source.replace(/\.[^.]+$/u, ".js");
		if (builtCandidate !== source) candidates.push(builtCandidate);
	}
	for (const candidate of candidates) {
		if (!pluginCacheExistsSync(candidate)) continue;
		return openCandidate(candidate);
	}
	return openCandidate(source);
}
function resolveSafePackageEntry(params) {
	const absolutePath = path.resolve(params.packageDir, params.entryPath);
	if (pluginCacheExistsSync(absolutePath)) {
		const existingSource = resolvePackageEntrySource(params);
		if (!existingSource) return null;
		return {
			relativePath: path.relative(params.packageDir, absolutePath).replace(/\\/g, "/"),
			existingSource
		};
	}
	if (!checkPluginCacheEntry({
		rootDir: params.packageDir,
		relativePath: params.entryPath,
		rootRealPath: params.packageRootRealPath,
		rejectHardlinks: params.rejectHardlinks ?? true
	}).ok) return reportPackageEntryDiagnostic(params, "error", `extension entry escapes package directory: ${params.entryPath}`);
	return { relativePath: path.relative(params.packageDir, absolutePath).replace(/\\/g, "/") };
}
function resolvePackageRuntimeEntrySource(params) {
	const safeEntry = resolveSafePackageEntry(params);
	if (!safeEntry) return null;
	if (params.runtimeEntryPath) {
		const runtimeSource = resolvePackageEntrySource({
			...params,
			entryPath: params.runtimeEntryPath
		});
		if (runtimeSource) return runtimeSource;
		return reportPackageEntryDiagnostic(params, "error", `${params.runtimeEntryLabel ?? "runtime entry"} not found: ${params.runtimeEntryPath}`);
	}
	if (params.origin === "config" || params.origin === "global") {
		const builtEntryCandidates = listBuiltRuntimeEntryCandidates(safeEntry.relativePath);
		for (const candidate of builtEntryCandidates) {
			if (!pluginCacheExistsSync(path.resolve(params.packageDir, candidate))) continue;
			return resolvePackageEntrySource({
				...params,
				entryPath: candidate
			});
		}
		if ((params.requireBuiltRuntimeEntry ?? params.origin === "global") && isTypeScriptPackageEntry(safeEntry.relativePath)) return reportPackageEntryDiagnostic(params, "warn", missingCompiledRuntimeEntryMessage({
			context: "installed",
			entry: safeEntry.relativePath,
			candidates: builtEntryCandidates
		}));
	}
	if (safeEntry.existingSource) return safeEntry.existingSource;
	if (params.rejectHardlinks === false) {
		const trustedFallbackSource = resolvePackageEntrySource(params);
		if (trustedFallbackSource) return trustedFallbackSource;
	}
	return reportPackageEntryDiagnostic(params, "error", `${params.sourceEntryLabel ?? "extension entry"} not found: ${safeEntry.relativePath}`);
}
/** Resolves the runtime setup source for a plugin package manifest. */
function resolvePackageSetupSource(params) {
	const packageManifest = getPackageManifestMetadata(params.manifest ?? void 0);
	const setupEntryPath = normalizeOptionalString(packageManifest?.setupEntry);
	if (!setupEntryPath) return null;
	return resolvePackageRuntimeEntrySource({
		...params,
		entryPath: setupEntryPath,
		sourceEntryLabel: "setup entry",
		runtimeEntryPath: normalizeOptionalString(packageManifest?.runtimeSetupEntry),
		runtimeEntryLabel: "runtime setup entry",
		pluginIdHint: params.pluginIdHint ?? normalizeOptionalString(packageManifest?.plugin?.id) ?? normalizeOptionalString(packageManifest?.channel?.id)
	});
}
/** Keeps declarations paired with their runtime sources when earlier entries cannot resolve. */
function resolvePackageRuntimeExtensions(params) {
	const runtimeResolution = resolvePackageRuntimeExtensionEntries(params);
	if (!runtimeResolution.ok) {
		reportPackageEntryDiagnostic(params, "error", runtimeResolution.error);
		return [];
	}
	return params.extensions.flatMap((entryPath, index) => {
		const source = resolvePackageRuntimeEntrySource({
			...params,
			entryPath,
			sourceEntryLabel: "extension entry",
			runtimeEntryPath: runtimeResolution.runtimeExtensions[index],
			runtimeEntryLabel: "runtime extension entry"
		});
		return source ? [{
			entryPath,
			source
		}] : [];
	});
}
//#endregion
//#region src/plugins/plugin-lifecycle-trace.ts
/** Checks the opt-in plugin lifecycle tracing environment flag. */
function isPluginLifecycleTraceEnabled() {
	const raw = process.env.OPENCLAW_PLUGIN_LIFECYCLE_TRACE?.trim().toLowerCase();
	return raw === "1" || raw === "true" || raw === "yes";
}
function emitPluginLifecycleTrace(params) {
	const elapsedMs = Number(process.hrtime.bigint() - params.start) / 1e6;
	const detailText = Object.entries(params.details ?? {}).filter((entry) => entry[1] !== void 0).map(([key, value]) => `${key}=${typeof value === "string" ? JSON.stringify(value) : value}`).join(" ");
	const suffix = detailText ? ` ${detailText}` : "";
	console.error(`[plugins:lifecycle] phase=${JSON.stringify(params.phase)} ms=${elapsedMs.toFixed(2)} status=${params.status}${suffix}`);
}
/** Traces a synchronous plugin lifecycle phase when tracing is enabled. */
function tracePluginLifecyclePhase(phase, fn, details) {
	if (!isPluginLifecycleTraceEnabled()) return fn();
	const start = process.hrtime.bigint();
	let status = "error";
	try {
		const result = fn();
		status = "ok";
		return result;
	} finally {
		emitPluginLifecycleTrace({
			phase,
			start,
			status,
			details
		});
	}
}
//#endregion
//#region src/plugins/record-groups.ts
function groupPluginRecords(records, keyOf) {
	const groups = /* @__PURE__ */ new Map();
	for (const record of records) {
		const key = keyOf(record);
		const group = groups.get(key);
		if (group) group.push(record);
		else groups.set(key, [record]);
	}
	return groups;
}
//#endregion
//#region src/plugins/dev-source-root.ts
/** Env var that points bundled-plugin lookup at an OpenClaw source checkout. */
const OPENCLAW_DEV_SOURCE_ROOT_ENV = "OPENCLAW_DEV_SOURCE_ROOT";
function readPackageName(packageJsonPath) {
	try {
		const parsed = JSON.parse(fsSync.readFileSync(packageJsonPath, "utf-8"));
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
	return Boolean(hostRoot && pluginRoot && ["dist", "dist-runtime"].some((tree) => isPathInside$2(path.join(hostRoot, tree, "extensions"), pluginRoot)));
}
//#endregion
//#region src/plugins/install-paths.ts
/** Validates a plugin id for install path safety. */
function validatePluginId(pluginId) {
	const trimmed = pluginId.trim();
	if (!trimmed) return "invalid plugin name: missing";
	if (trimmed.includes("\\")) return "invalid plugin name: path separators not allowed";
	const segments = trimmed.split("/");
	if (segments.some((segment) => !segment)) return "invalid plugin name: malformed scope";
	if (segments.some((segment) => segment === "." || segment === "..")) return "invalid plugin name: reserved path segment";
	if (segments.length === 1) {
		if (trimmed.startsWith("@")) return "invalid plugin name: scoped ids must use @scope/name format";
		return null;
	}
	if (segments.length !== 2) return "invalid plugin name: path separators not allowed";
	if (!segments[0]?.startsWith("@") || segments[0].length < 2) return "invalid plugin name: scoped ids must use @scope/name format";
	return null;
}
/** Resolves the default directory for path-installed plugin extensions. */
function resolveDefaultPluginExtensionsDir(env = process.env, homedir) {
	return resolveActivePluginInstallDir("extensions", env, homedir);
}
/** Resolves the default directory for managed npm plugin installs. */
function resolveDefaultPluginNpmDir(env = process.env, homedir) {
	return resolveActivePluginInstallDir("npm", env, homedir);
}
/** Encodes an npm package name into a managed npm project directory name. */
function encodePluginNpmProjectDirName(packageName) {
	const trimmed = packageName.trim();
	if (!trimmed) throw new Error("invalid npm package name: missing");
	return safePathSegmentHashed(trimmed);
}
/** Resolves the directory containing managed npm plugin projects. */
function resolvePluginNpmProjectsDir(npmDir) {
	const npmBase = npmDir ? resolveUserPath(npmDir) : resolveDefaultPluginNpmDir();
	return path.join(npmBase, "projects");
}
/** Resolves the managed npm project directory for a package name. */
function resolvePluginNpmProjectDir(params) {
	return path.join(resolvePluginNpmProjectsDir(params.npmDir), encodePluginNpmProjectDirName(params.packageName));
}
const PLUGIN_NPM_GENERATION_PROJECT_SEPARATOR = "__openclaw-generation__";
const PLUGIN_NPM_GENERATION_KEY_DIR_NAME_PATTERN = new RegExp(`^g-[a-f0-9]{16}$`, "u");
/** Resolves the managed npm artifact-generation project directory prefix for a package. */
function resolvePluginNpmGenerationProjectDirPrefix(packageName) {
	return `${encodePluginNpmProjectDirName(packageName)}${PLUGIN_NPM_GENERATION_PROJECT_SEPARATOR}`;
}
/** Checks that a managed path preserves its npm-root-relative real path. */
function isPluginNpmManagedPath(params) {
	const npmDir = path.resolve(params.npmDir ?? resolveDefaultPluginNpmDir());
	const managedPath = path.resolve(params.managedPath);
	try {
		return lstatSync(npmDir).isDirectory() && path.relative(npmDir, managedPath) === path.relative(realpathSync(npmDir), params.allowMissing ? resolvePathViaExistingAncestorSync$1(managedPath) : realpathSync(managedPath));
	} catch {
		return false;
	}
}
/** Checks whether a project directory has the exact managed shape owned by a package. */
function isPluginNpmProjectDir(params) {
	const npmDir = path.resolve(params.npmDir ?? resolveDefaultPluginNpmDir());
	const projectDir = path.resolve(params.projectDir);
	if (path.dirname(projectDir) !== path.resolve(resolvePluginNpmProjectsDir(npmDir))) return false;
	if (!isPluginNpmManagedPath({
		managedPath: projectDir,
		npmDir
	})) return false;
	if (!isPluginNpmManagedPath({
		managedPath: path.join(projectDir, "node_modules", ...params.packageName.split("/")),
		npmDir,
		allowMissing: true
	})) return false;
	if (projectDir === path.resolve(resolvePluginNpmProjectDir(params))) return true;
	const projectName = path.basename(projectDir);
	const generationPrefix = resolvePluginNpmGenerationProjectDirPrefix(params.packageName);
	return projectName.startsWith(generationPrefix) && PLUGIN_NPM_GENERATION_KEY_DIR_NAME_PATTERN.test(projectName.slice(generationPrefix.length));
}
//#endregion
//#region src/plugins/roots.ts
function resolvePluginSourceRoots(params) {
	const env = params.env ?? process.env;
	const workspaceRoot = params.workspaceDir ? resolveUserPath(params.workspaceDir, env) : void 0;
	return {
		stock: resolveBundledPluginsDir(env),
		global: resolveDefaultPluginExtensionsDir(env),
		workspace: workspaceRoot ? path.join(workspaceRoot, ".openclaw", "extensions") : void 0
	};
}
function resolvePluginCacheInputs(params) {
	const env = params.env ?? process.env;
	return {
		roots: resolvePluginSourceRoots({
			workspaceDir: params.workspaceDir,
			env
		}),
		loadPaths: normalizeStringEntries((params.loadPaths ?? []).filter((entry) => typeof entry === "string")).map((entry) => resolveUserPath(entry, env)),
		devSourceRoot: resolveOpenClawDevSourceRoot(env)
	};
}
//#endregion
//#region src/plugins/status-dependencies-core.ts
function normalizeDependencyMap(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	const normalized = {};
	for (const [name, spec] of Object.entries(raw)) {
		const normalizedName = name.trim();
		if (!normalizedName || typeof spec !== "string" || !spec.trim()) continue;
		normalized[normalizedName] = spec.trim();
	}
	return normalized;
}
/** Normalizes raw package dependency maps into sorted plugin dependency specs. */
function normalizePluginDependencySpecs(params) {
	const dependencies = normalizeDependencyMap(params.dependencies);
	const optionalDependencies = normalizeDependencyMap(params.optionalDependencies);
	for (const name of Object.keys(optionalDependencies)) delete dependencies[name];
	return {
		dependencies,
		optionalDependencies
	};
}
//#endregion
//#region src/plugins/discovery.ts
/** Discovers plugin candidates from bundled, workspace, global, package, and bundle roots. */
const SCANNED_DIRECTORY_IGNORE_NAMES = /* @__PURE__ */ new Set([
	".git",
	".hg",
	".svn",
	".turbo",
	".yarn",
	".yarn-cache",
	"build",
	"coverage",
	"dist",
	"node_modules"
]);
function currentUid(overrideUid) {
	if (overrideUid !== void 0) return overrideUid;
	if (process.platform === "win32") return null;
	if (typeof process.getuid !== "function") return null;
	return process.getuid();
}
function checkSourceEscapesRoot(params) {
	const sourceRealPath = pluginCacheRealpathSync(params.source);
	const rootRealPath = pluginCacheRealpathSync(params.rootDir);
	if (!sourceRealPath || !rootRealPath) return null;
	if (isPathInside$1(rootRealPath, sourceRealPath)) return null;
	return {
		source: params.source,
		message: `blocked plugin candidate: source escapes plugin root (${params.source} -> ${sourceRealPath}; root=${rootRealPath})`
	};
}
function checkPathStatAndPermissions(params) {
	if (process.platform === "win32") return null;
	const pathsToCheck = [params.rootDir, params.source];
	const seen = /* @__PURE__ */ new Set();
	for (const targetPath of pathsToCheck) {
		const normalized = path.resolve(targetPath);
		if (seen.has(normalized)) continue;
		seen.add(normalized);
		let stat = pluginCacheStatSync(targetPath);
		if (!stat) return {
			source: targetPath,
			message: `blocked plugin candidate: cannot stat path (${targetPath})`
		};
		let modeBits = stat.mode & 511;
		if ((modeBits & 2) !== 0 && params.origin === "bundled") try {
			fsSync.chmodSync(targetPath, modeBits & -19);
			const repairedStat = refreshPluginCacheStat(targetPath);
			if (!repairedStat) return {
				source: targetPath,
				message: `blocked plugin candidate: cannot stat path (${targetPath})`
			};
			stat = repairedStat;
			modeBits = repairedStat.mode & 511;
		} catch {}
		if ((modeBits & 2) !== 0) return {
			source: targetPath,
			message: `blocked plugin candidate: world-writable path (${targetPath}, mode=${formatPosixMode(modeBits)})`
		};
		if (params.origin !== "bundled" && params.uid !== null && typeof stat.uid === "number" && stat.uid !== params.uid && stat.uid !== 0) return {
			source: targetPath,
			message: `blocked plugin candidate: suspicious ownership (${targetPath}, uid=${stat.uid}, expected uid=${params.uid} or root)`
		};
	}
	return null;
}
function isExtensionFile(filePath) {
	const ext = path.extname(filePath);
	if (!PUBLIC_SURFACE_SOURCE_EXTENSIONS.some((extension) => extension === ext)) return false;
	if (/\.d\.[cm]?ts$/.test(filePath)) return false;
	return !normalizeLowercaseStringOrEmpty(path.basename(filePath)).includes(".test.");
}
function shouldIgnoreScannedDirectory(dirName) {
	const normalized = normalizeLowercaseStringOrEmpty(dirName);
	return !normalized || SCANNED_DIRECTORY_IGNORE_NAMES.has(normalized) || normalized.endsWith(".bak") || normalized.includes(".backup-") || normalized.includes(".disabled");
}
function resolveScannedEntryType(entry, fullPath) {
	if (entry.isFile()) return "file";
	if (entry.isDirectory()) return "directory";
	if (!entry.isSymbolicLink()) return null;
	const stat = pluginCacheStatSync(fullPath);
	if (!stat) return null;
	if (stat.isFile()) return "file";
	if (stat.isDirectory()) return "directory";
	return null;
}
function resolvesToSameDirectory(left, right) {
	if (!left || !right) return false;
	const leftRealPath = pluginCacheRealpathSync(left);
	const rightRealPath = pluginCacheRealpathSync(right);
	if (leftRealPath && rightRealPath) return leftRealPath === rightRealPath;
	return path.resolve(left) === path.resolve(right);
}
function mergeCandidateInstallOwner(existing, candidateOwner, candidateOwnerAmbiguous) {
	const existingOwner = resolvePluginCandidateInstallOwner(existing);
	const ownerConflict = existingOwner && candidateOwner && existingOwner !== candidateOwner;
	if (isPluginCandidateInstallOwnerAmbiguous(existing) || candidateOwnerAmbiguous || ownerConflict) recordPluginCandidateInstallOwner(existing, void 0, true);
	else if (candidateOwner) recordPluginCandidateInstallOwner(existing, candidateOwner);
}
function prepareInstalledPluginPaths(installRecords, env, diagnostics) {
	const byPath = /* @__PURE__ */ new Map();
	const installedPluginDirKeys = /* @__PURE__ */ new Set();
	const managedPluginDirs = /* @__PURE__ */ new Set();
	const resolveRecordPath = (rawPath) => typeof rawPath === "string" && rawPath.trim() ? resolveUserPath(rawPath, env) : void 0;
	for (const [installOwner, record] of Object.entries(installRecords ?? {})) {
		const installPath = resolveRecordPath(record.installPath);
		const sourcePath = resolveRecordPath(record.sourcePath);
		for (const recordedPath of [installPath, sourcePath]) if (recordedPath && pluginCacheExistsSync(recordedPath)) {
			const key = resolveManagedPluginDirKey(recordedPath);
			if (key) managedPluginDirs.add(key);
		}
		const resolved = installPath ?? sourcePath;
		if (!resolved || !pluginCacheExistsSync(resolved)) continue;
		const pathKey = pluginCacheRealpathSync(resolved) ?? path.resolve(resolved);
		const requireBuiltRuntimeEntry = !(record.source === "path" && installPath && sourcePath && resolvesToSameDirectory(installPath, sourcePath));
		const existing = byPath.get(pathKey);
		if (existing) {
			existing.requireBuiltRuntimeEntry ||= requireBuiltRuntimeEntry;
			if (existing.installOwner !== installOwner) {
				delete existing.installOwner;
				existing.installOwnerAmbiguous = true;
				diagnostics.push({
					level: "error",
					source: resolved,
					message: "multiple plugin install records claim the same package path; refresh or reinstall the package before using managed lifecycle actions"
				});
			}
		} else {
			byPath.set(pathKey, {
				path: resolved,
				requireBuiltRuntimeEntry,
				installOwner
			});
			const dirKey = resolveManagedPluginDirKey(resolved);
			if (dirKey) installedPluginDirKeys.add(dirKey);
		}
	}
	return {
		installedPaths: [...byPath.values()],
		installedPluginDirKeys,
		managedPluginDirs
	};
}
function resolveManagedPluginDirKey(installedPath) {
	const stat = pluginCacheStatSync(installedPath);
	if (!stat) return null;
	const pluginDir = stat.isFile() ? path.dirname(installedPath) : installedPath;
	return pluginCacheRealpathSync(pluginDir) ?? path.resolve(pluginDir);
}
function isManagedPluginDir(params) {
	if (!params.managedPluginDirs || params.managedPluginDirs.size === 0) return false;
	const key = params.realpath ?? pluginCacheRealpathSync(params.dir) ?? path.resolve(params.dir);
	return params.managedPluginDirs.has(key);
}
function readPackageManifest(dir, rejectHardlinks = true, rootRealPath) {
	const file = readPluginCacheFile({
		rootDir: dir,
		...rootRealPath !== void 0 ? { rootRealPath } : {},
		relativePath: "package.json",
		rejectHardlinks
	});
	if (!file.ok) return null;
	const parsed = parsePluginCacheJson(file);
	return parsed.ok && isRecord(parsed.value) ? parsed.value : null;
}
function deriveIdHint(params) {
	const base = path.basename(params.filePath, path.extname(params.filePath));
	const pluginId = normalizeOptionalString(params.manifestId) ?? derivePackagePluginIdHint(params.packageName) ?? params.fallbackId;
	return params.hasMultipleExtensions ? `${pluginId}/${base}` : pluginId;
}
function derivePackagePluginIdHint(packageName) {
	const rawPackageName = normalizeOptionalString(packageName);
	if (!rawPackageName) return;
	const unscoped = rawPackageName.slice(rawPackageName.lastIndexOf("/") + 1);
	for (const suffix of ["-provider", "-plugin"]) if (unscoped.endsWith(suffix) && unscoped.length > suffix.length) return unscoped.slice(0, -suffix.length);
	return normalizeOptionalString(unscoped);
}
function resolvePluginPackageEntries(params) {
	const entryIdSources = groupPluginRecords(resolvePackageRuntimeExtensions(params), (entry) => deriveIdHint({
		filePath: entry.source,
		manifestId: params.manifestId,
		packageName: params.manifest?.name,
		fallbackId: path.basename(params.packageDir),
		hasMultipleExtensions: params.extensions.length > 1
	}));
	const entries = [];
	for (const [idHint, sources] of entryIdSources) {
		if (params.extensions.length > 1 && sources.length > 1) {
			params.diagnostics.push({
				level: "error",
				pluginId: idHint,
				source: params.sourceLabel,
				message: `plugin package entries collide on derived id "${idHint}" (${sources.map((entry) => path.relative(params.packageDir, entry.source)).join(", ")}); rename the entry files to unique basenames`
			});
			continue;
		}
		for (const entry of sources) entries.push({
			...entry,
			idHint
		});
	}
	return entries;
}
function pushInvalidPackageExtensionDiagnostic(params) {
	if (params.resolution.status !== "invalid" && params.resolution.status !== "empty") return false;
	params.diagnostics.push({
		level: "error",
		source: params.source,
		message: params.resolution.status === "invalid" ? params.resolution.error : "package.json openclaw.extensions is empty",
		...params.pluginId ? { pluginId: params.pluginId } : {}
	});
	return true;
}
function isSourceCheckoutExtensionsDir(extensionsDir) {
	const packageRoot = path.dirname(extensionsDir);
	return pluginCacheExistsSync(path.join(packageRoot, ".git")) && pluginCacheExistsSync(path.join(packageRoot, "pnpm-workspace.yaml")) && pluginCacheExistsSync(path.join(packageRoot, "src")) && hasUsableBundledPluginTree(extensionsDir);
}
function resolveBundledSourceCheckoutExtensionsDir(bundledRoot) {
	if (!bundledRoot) return;
	const legacyRoot = buildLegacyBundledRootPath(bundledRoot);
	if (!legacyRoot || !isPluginInPackageBundledRoots({
		rootDir: legacyRoot,
		packageRoot: path.dirname(legacyRoot)
	}) || !isSourceCheckoutExtensionsDir(legacyRoot)) return;
	return legacyRoot;
}
function isHostBundledPluginRoot(dir, env) {
	const bundledRoot = resolveBundledPluginsDir(env);
	const realDir = pluginCacheRealpathSync(dir) ?? path.resolve(dir);
	return [bundledRoot, resolveBundledSourceCheckoutExtensionsDir(bundledRoot)].some((root) => root && isPathInside$1(pluginCacheRealpathSync(root) ?? path.resolve(root), realDir));
}
function readChildDirectoryNames(dir) {
	if (!dir || !pluginCacheExistsSync(dir)) return /* @__PURE__ */ new Set();
	try {
		return new Set(sortUniqueStrings(readPluginCacheDirectory(dir).filter((entry) => entry.isDirectory()).map((entry) => entry.name)));
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function readBundledDistOptOutDirectoryNames(sourceExtensionsDir) {
	const names = /* @__PURE__ */ new Set();
	if (!sourceExtensionsDir) return names;
	for (const name of readChildDirectoryNames(sourceExtensionsDir)) if (getPackageManifestMetadata(readPackageManifest(path.join(sourceExtensionsDir, name), false) ?? void 0)?.build?.bundledDist === false) names.add(name);
	return names;
}
function createPluginScanner(env, ownershipUid) {
	const result = {
		candidates: [],
		diagnostics: []
	};
	const { candidates, diagnostics } = result;
	const attemptedSources = /* @__PURE__ */ new Map();
	function addCandidate(params) {
		const resolved = path.resolve(params.source);
		if (attemptedSources.has(resolved)) {
			const existing = attemptedSources.get(resolved);
			if (existing) mergeCandidateInstallOwner(existing, params.installOwner, params.installOwnerAmbiguous === true);
			return;
		}
		const resolvedRoot = pluginCacheRealpathSync(params.rootDir) ?? path.resolve(params.rootDir);
		const issue = checkSourceEscapesRoot({
			source: resolved,
			rootDir: resolvedRoot
		}) ?? checkPathStatAndPermissions({
			source: resolved,
			rootDir: resolvedRoot,
			origin: params.origin,
			uid: currentUid(ownershipUid)
		});
		if (issue) {
			diagnostics.push({
				level: "warn",
				...params.idHint ? { pluginId: params.idHint } : {},
				...issue
			});
			attemptedSources.set(resolved, void 0);
			return;
		}
		const manifest = params.manifest ?? null;
		const packageManifest = getPackageManifestMetadata(manifest ?? void 0);
		const packageDependencies = normalizePluginDependencySpecs({
			dependencies: manifest?.dependencies,
			optionalDependencies: manifest?.optionalDependencies
		});
		const candidate = {
			idHint: params.idHint,
			...params.effectivePluginId ? { effectivePluginId: params.effectivePluginId } : {},
			...params.diagnosticIdHint && params.diagnosticIdHint !== params.idHint ? { diagnosticIdHint: params.diagnosticIdHint } : {},
			source: resolved,
			setupSource: params.setupSource,
			rootDir: resolvedRoot,
			origin: params.origin,
			format: params.format ?? "openclaw",
			bundleFormat: params.bundleFormat,
			workspaceDir: params.workspaceDir,
			packageName: normalizeOptionalString(manifest?.name),
			packageVersion: normalizeOptionalString(manifest?.version),
			packageDescription: normalizeOptionalString(manifest?.description),
			packageDir: params.packageDir,
			packageManifest,
			packageDependencies: packageDependencies.dependencies,
			packageOptionalDependencies: packageDependencies.optionalDependencies,
			rawPackageManifest: manifest ?? void 0,
			bundledManifestId: params.bundledManifestId,
			bundledManifest: params.bundledManifest,
			bundledManifestPath: params.bundledManifestPath,
			...params.requiredPluginIds && params.requiredPluginIds.length > 0 ? { requiredPluginIds: params.requiredPluginIds } : {},
			...params.requiredPluginSource ? { requiredPluginSource: params.requiredPluginSource } : {}
		};
		recordPluginCandidateInstallOwner(candidate, params.installOwner, params.installOwnerAmbiguous === true);
		candidates.push(candidate);
		attemptedSources.set(resolved, candidate);
	}
	function discoverBundleInRoot(params) {
		const bundleFormat = detectBundleManifestFormat(params.rootDir);
		if (!bundleFormat) return false;
		const rootRealPath = pluginCacheRealpathSync(params.rootDir) ?? void 0;
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: params.origin,
			rootDir: params.rootDir,
			env
		});
		const bundleManifest = loadBundleManifest({
			rootDir: params.rootDir,
			...rootRealPath !== void 0 ? { rootRealPath } : {},
			bundleFormat,
			rejectHardlinks
		});
		if (!bundleManifest.ok) {
			diagnostics.push({
				level: "error",
				message: bundleManifest.error,
				source: bundleManifest.manifestPath
			});
			return false;
		}
		addCandidate({
			idHint: bundleManifest.manifest.id,
			source: params.rootDir,
			rootDir: params.rootDir,
			origin: params.origin,
			format: "bundle",
			bundleFormat,
			workspaceDir: params.workspaceDir,
			...params.installOwner ? { installOwner: params.installOwner } : {},
			...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {},
			manifest: params.manifest,
			packageDir: params.rootDir,
			bundledManifestId: bundleManifest.manifest.id,
			bundledManifestPath: bundleManifest.manifestPath
		});
		return true;
	}
	function discoverPluginDirectory(params) {
		const { dir, rootRealPath } = params;
		const requireBuiltRuntimeEntry = params.requireBuiltRuntimeEntry ?? isManagedPluginDir({
			dir,
			realpath: rootRealPath,
			managedPluginDirs: params.managedPluginDirs
		});
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: params.origin,
			rootDir: dir,
			env
		});
		const manifest = readPackageManifest(dir, rejectHardlinks, rootRealPath);
		const packageMetadata = getPackageManifestMetadata(manifest ?? void 0);
		const manifestResult = loadPluginManifest(dir, rejectHardlinks, rootRealPath);
		const candidateManifest = manifestResult.ok ? manifestResult : void 0;
		const manifestId = candidateManifest?.manifest.id;
		const pluginIdHint = normalizeOptionalString(manifestId) ?? normalizeOptionalString(packageMetadata?.plugin?.id) ?? normalizeOptionalString(packageMetadata?.channel?.id) ?? derivePackagePluginIdHint(manifest?.name) ?? path.basename(dir);
		if (shouldSkipIncompatiblePackagePluginApi({
			origin: params.origin,
			packageManifest: packageMetadata,
			pluginId: pluginIdHint,
			packageDir: dir,
			env,
			diagnostics
		})) return true;
		const extensionResolution = resolvePackageExtensionEntries(manifest ?? void 0);
		if (pushInvalidPackageExtensionDiagnostic({
			resolution: extensionResolution,
			source: dir,
			pluginId: pluginIdHint,
			diagnostics
		})) return true;
		const extensions = extensionResolution.status === "ok" ? extensionResolution.entries : [];
		const setupSource = resolvePackageSetupSource({
			packageDir: dir,
			...rootRealPath !== void 0 ? { packageRootRealPath: rootRealPath } : {},
			manifest,
			pluginIdHint,
			origin: params.origin,
			requireBuiltRuntimeEntry,
			sourceLabel: dir,
			diagnostics,
			rejectHardlinks
		});
		const addPackageCandidate = (source, idHint, effectivePluginId) => {
			addCandidate({
				idHint,
				...effectivePluginId ? { effectivePluginId } : {},
				diagnosticIdHint: pluginIdHint,
				source,
				...setupSource ? { setupSource } : {},
				rootDir: dir,
				origin: params.origin,
				workspaceDir: params.workspaceDir,
				...params.installOwner ? { installOwner: params.installOwner } : {},
				...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {},
				manifest,
				packageDir: dir,
				requiredPluginIds: candidateManifest?.manifest.requiresPlugins,
				requiredPluginSource: candidateManifest?.manifestPath
			});
		};
		if (extensions.length > 0) {
			const entries = resolvePluginPackageEntries({
				packageDir: dir,
				...rootRealPath !== void 0 ? { packageRootRealPath: rootRealPath } : {},
				manifest,
				extensions,
				manifestId: manifestId ?? normalizeOptionalString(packageMetadata?.plugin?.id),
				origin: params.origin,
				pluginIdHint,
				requireBuiltRuntimeEntry,
				sourceLabel: dir,
				diagnostics,
				rejectHardlinks
			});
			for (const entry of entries) addPackageCandidate(entry.source, entry.idHint, extensions.length > 1 ? entry.idHint : void 0);
			return true;
		}
		if (discoverBundleInRoot({
			rootDir: dir,
			origin: params.origin,
			workspaceDir: params.workspaceDir,
			...params.installOwner ? { installOwner: params.installOwner } : {},
			...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {},
			manifest
		})) return true;
		const indexFile = [...DEFAULT_PLUGIN_ENTRY_CANDIDATES].map((candidate) => path.join(dir, candidate)).find((candidate) => pluginCacheExistsSync(candidate));
		if (indexFile && isExtensionFile(indexFile)) {
			addPackageCandidate(indexFile, manifestId ?? path.basename(dir));
			return true;
		}
		return false;
	}
	function discoverInDirectory(params) {
		if (!pluginCacheExistsSync(params.dir)) return;
		let entries;
		try {
			entries = readPluginCacheDirectory(params.dir).toSorted((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
		} catch (err) {
			diagnostics.push(params.origin === "config" ? pluginPathFailureDiagnostic(params.dir, params.origin, err) : {
				level: "warn",
				message: `failed to read extensions dir: ${params.dir} (${String(err)})`,
				source: params.dir
			});
			return;
		}
		for (const entry of entries) {
			const fullPath = path.join(params.dir, entry.name);
			const entryType = resolveScannedEntryType(entry, fullPath);
			if (entryType === "file") {
				if (!(params.scanFiles ?? params.origin === "bundled") || !isExtensionFile(fullPath)) continue;
				addCandidate({
					idHint: path.basename(entry.name, path.extname(entry.name)),
					source: fullPath,
					rootDir: path.dirname(fullPath),
					origin: params.origin,
					workspaceDir: params.workspaceDir,
					...params.installOwner ? { installOwner: params.installOwner } : {},
					...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {}
				});
				continue;
			}
			if (entryType !== "directory") continue;
			if (params.skipDirectories?.has(entry.name)) continue;
			if (shouldIgnoreScannedDirectory(entry.name)) continue;
			const fullPathRealPath = pluginCacheRealpathSync(fullPath) ?? void 0;
			const fullPathDirKey = fullPathRealPath ?? path.resolve(fullPath);
			if (params.origin === "bundled" && !isPathInside$1(pluginCacheRealpathSync(params.dir) ?? path.resolve(params.dir), fullPathDirKey)) {
				diagnostics.push({
					level: "error",
					source: fullPath,
					message: `blocked plugin candidate: package directory escapes bundled root (${fullPath})`
				});
				continue;
			}
			if (params.skipRootDirKeys?.has(fullPathDirKey)) continue;
			discoverPluginDirectory({
				...params,
				dir: fullPath,
				rootRealPath: fullPathRealPath
			});
		}
	}
	function discoverFromPath(params) {
		const resolved = resolveUserPath(params.rawPath, env);
		const stat = inspectPluginLoadPath(resolved, params.origin, diagnostics);
		if (!stat) return;
		const origin = (params.origin === "config" || params.origin === "global") && isHostBundledPluginRoot(stat.isFile() ? path.dirname(resolved) : resolved, env) ? "bundled" : params.origin;
		if (stat.isFile()) {
			if (!isExtensionFile(resolved)) {
				diagnostics.push({
					level: "error",
					message: `plugin path is not a supported file: ${resolved}`,
					source: resolved
				});
				return;
			}
			addCandidate({
				idHint: path.basename(resolved, path.extname(resolved)),
				source: resolved,
				rootDir: path.dirname(resolved),
				origin,
				workspaceDir: params.workspaceDir,
				...params.installOwner ? { installOwner: params.installOwner } : {},
				...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {}
			});
			return;
		}
		if (stat.isDirectory()) {
			if (discoverPluginDirectory({
				...params,
				origin,
				dir: resolved,
				rootRealPath: pluginCacheRealpathSync(resolved) ?? void 0
			})) return;
			discoverInDirectory({
				dir: resolved,
				origin,
				workspaceDir: params.workspaceDir,
				...params.scanFiles !== void 0 || params.origin === "config" ? { scanFiles: params.scanFiles ?? true } : {},
				...params.requireBuiltRuntimeEntry !== void 0 ? { requireBuiltRuntimeEntry: params.requireBuiltRuntimeEntry } : {},
				...params.managedPluginDirs ? { managedPluginDirs: params.managedPluginDirs } : {},
				...params.skipRootDirKeys ? { skipRootDirKeys: params.skipRootDirKeys } : {}
			});
		}
	}
	function discoverConfiguredPaths(loadPaths, workspaceDir) {
		const firstConfigured = candidates.length;
		for (const loadPath of loadPaths) if (typeof loadPath === "string" && loadPath.trim()) discoverFromPath({
			rawPath: loadPath.trim(),
			origin: "config",
			workspaceDir
		});
		for (const candidate of candidates.slice(firstConfigured)) candidate.configSelected = true;
	}
	function finish() {
		const candidatesBySource = /* @__PURE__ */ new Map();
		const seenDiagnostics = /* @__PURE__ */ new Set();
		const uniqueDiagnostics = [];
		for (const candidate of candidates) {
			const key = pluginCacheRealpathSync(candidate.source) ?? path.resolve(candidate.source);
			const existing = candidatesBySource.get(key);
			if (existing) {
				const retained = candidate.origin === "bundled" ? candidate : existing;
				const duplicate = retained === candidate ? existing : candidate;
				if (duplicate.origin === "config" || duplicate.configSelected) retained.configSelected = true;
				if (duplicate.sourcePreferred) retained.sourcePreferred = true;
				mergeCandidateInstallOwner(retained, resolvePluginCandidateInstallOwner(duplicate), isPluginCandidateInstallOwnerAmbiguous(duplicate));
				candidatesBySource.set(key, retained);
				continue;
			}
			candidatesBySource.set(key, candidate);
		}
		for (const diagnostic of diagnostics) {
			const key = [
				diagnostic.level,
				diagnostic.pluginId ?? "",
				diagnostic.source ?? "",
				diagnostic.message
			].join("\0");
			if (seenDiagnostics.has(key)) continue;
			seenDiagnostics.add(key);
			uniqueDiagnostics.push(diagnostic);
		}
		result.candidates = [...candidatesBySource.values()];
		result.diagnostics = uniqueDiagnostics;
		return result;
	}
	return {
		result,
		discoverConfiguredPaths,
		discoverFromPath,
		discoverInDirectory,
		finish
	};
}
function discoveryPolicy(env, ownershipUid, bundledRoot) {
	return {
		ownershipUid: currentUid(ownershipUid),
		compatibilityHostVersion: resolveCompatibilityHostVersion(env),
		bundledRoot: bundledRoot ?? resolveBundledPluginsDir(env) ?? "",
		nix: resolveIsNixMode(env),
		sourceOverlaysDisabled: env.OPENCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS ?? "",
		home: env.OPENCLAW_HOME ?? "",
		userHome: env.HOME ?? "",
		userProfile: env.USERPROFILE ?? "",
		cwd: process.cwd()
	};
}
function discoverSharedPluginRoots(params) {
	const { roots, env } = params;
	const cache = getPluginCache().metadata.sharedDiscovery;
	const key = hashStableJson({
		roots,
		installRecords: Object.entries(params.installRecords ?? {}),
		rootScope: params.rootScope ?? "all",
		policy: discoveryPolicy(env, params.ownershipUid, roots.stock)
	});
	const cached = cache.get(key);
	if (cached) return cached;
	const scanner = createPluginScanner(env, params.ownershipUid);
	const { result, discoverInDirectory } = scanner;
	const workspaceCandidates = /* @__PURE__ */ new Set();
	const discoverWorkspacePath = (options) => {
		const first = result.candidates.length;
		scanner.discoverFromPath(options);
		for (const candidate of result.candidates.slice(first)) workspaceCandidates.add(candidate);
	};
	tracePluginLifecyclePhase("discovery scan", () => {
		for (const sourceOverlayDir of listBundledSourceOverlayDirs({
			bundledRoot: roots.stock,
			env
		})) {
			const firstOverlay = result.candidates.length;
			discoverWorkspacePath({
				rawPath: sourceOverlayDir,
				origin: "bundled"
			});
			for (const candidate of result.candidates.slice(firstOverlay)) candidate.sourcePreferred = true;
			result.diagnostics.push({
				level: "warn",
				source: sourceOverlayDir,
				message: "using bind-mounted bundled plugin source overlay; this source overrides the packaged dist bundle for the same plugin id"
			});
		}
		const sourceCheckoutDependencyDiagnostic = resolveSourceCheckoutDependencyDiagnostic(env);
		if (sourceCheckoutDependencyDiagnostic) result.diagnostics.push({
			level: "warn",
			source: sourceCheckoutDependencyDiagnostic.source,
			message: sourceCheckoutDependencyDiagnostic.message
		});
		const sourceCheckoutExtensionsDir = resolveBundledSourceCheckoutExtensionsDir(roots.stock);
		const bundledDistOptOutDirectories = readBundledDistOptOutDirectoryNames(sourceCheckoutExtensionsDir);
		if (sourceCheckoutExtensionsDir) for (const dirName of bundledDistOptOutDirectories) discoverWorkspacePath({
			rawPath: path.join(sourceCheckoutExtensionsDir, dirName),
			origin: "bundled"
		});
		if (roots.stock) discoverInDirectory({
			dir: roots.stock,
			origin: "bundled",
			skipDirectories: bundledDistOptOutDirectories
		});
		const sourceCheckoutMatchesBundledRoot = resolvesToSameDirectory(sourceCheckoutExtensionsDir, roots.stock);
		if (sourceCheckoutExtensionsDir && !sourceCheckoutMatchesBundledRoot) discoverInDirectory({
			dir: sourceCheckoutExtensionsDir,
			origin: "bundled",
			skipDirectories: readChildDirectoryNames(roots.stock)
		});
		if (params.rootScope !== "bundled") {
			const { installedPaths, installedPluginDirKeys, managedPluginDirs } = prepareInstalledPluginPaths(params.installRecords, env, result.diagnostics);
			for (const installedPath of installedPaths) discoverWorkspacePath({
				rawPath: installedPath.path,
				origin: "global",
				...installedPath.installOwner ? { installOwner: installedPath.installOwner } : {},
				...installedPath.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {},
				requireBuiltRuntimeEntry: installedPath.requireBuiltRuntimeEntry,
				managedPluginDirs,
				scanFiles: true
			});
			discoverInDirectory({
				dir: roots.global,
				origin: "global",
				managedPluginDirs,
				skipRootDirKeys: installedPluginDirKeys
			});
		}
	}, { scope: "shared" });
	const shared = {
		candidates: result.candidates.map((candidate) => ({
			candidate,
			usesWorkspace: workspaceCandidates.has(candidate)
		})),
		diagnostics: result.diagnostics
	};
	cache.set(key, shared);
	return shared;
}
function discoverOpenClawPlugins(params) {
	const env = params.env ?? process.env;
	const workspaceDir = normalizeOptionalString(params.workspaceDir);
	const workspaceRoot = workspaceDir ? resolveUserPath(workspaceDir, env) : void 0;
	const defaultRoots = resolvePluginSourceRoots({
		workspaceDir: workspaceRoot,
		env
	});
	const roots = params.bundledRoot ? {
		...defaultRoots,
		stock: path.resolve(params.bundledRoot)
	} : defaultRoots;
	const cache = getPluginCache().metadata.discovery;
	const key = hashStableJson({
		phase: "all",
		roots,
		workspaceDir,
		loadPaths: params.extraPaths ?? [],
		installRecords: Object.entries(params.installRecords ?? {}),
		rootScope: params.rootScope ?? "all",
		policy: discoveryPolicy(env, params.ownershipUid, roots.stock)
	});
	const cached = cache.get(key);
	if (cached) return cached;
	const scanner = createPluginScanner(env, params.ownershipUid);
	const { result, discoverInDirectory } = scanner;
	if (params.rootScope !== "bundled") tracePluginLifecyclePhase("discovery scan", () => {
		scanner.discoverConfiguredPaths(params.extraPaths ?? [], workspaceDir);
		const workspaceMatchesBundledRoot = resolvesToSameDirectory(workspaceRoot, roots.stock);
		if (roots.workspace && workspaceRoot && !workspaceMatchesBundledRoot) discoverInDirectory({
			dir: roots.workspace,
			origin: "workspace",
			workspaceDir: workspaceRoot
		});
	}, {
		scope: "scoped",
		extraPathCount: params.extraPaths?.length ?? 0
	});
	const shared = discoverSharedPluginRoots({
		roots: {
			stock: roots.stock,
			global: roots.global
		},
		installRecords: params.installRecords,
		ownershipUid: params.ownershipUid,
		env,
		rootScope: params.rootScope
	});
	for (const { candidate, usesWorkspace } of shared.candidates) result.candidates.push({
		...candidate,
		...usesWorkspace ? { workspaceDir } : {}
	});
	result.diagnostics.push(...shared.diagnostics);
	scanner.finish();
	addMissingRequiredPluginDiagnostics(result, { env });
	cache.set(key, result);
	return result;
}
//#endregion
//#region src/plugins/installed-plugin-index-facts.ts
/** Package facts share the existing generation; mutable management inputs stay uncached. */
function getInstalledPluginIndexFacts(index) {
	const entries = getPluginCache().metadata.indexFacts;
	const existing = entries.get(index);
	if (existing) return existing;
	if (!isDeeplyFrozenPlainData(index)) return;
	const facts = {};
	entries.set(index, facts);
	return facts;
}
//#endregion
//#region src/config/zod-schema.installs.ts
const InstallSourceSchema = union([
	literal("npm"),
	literal("archive"),
	literal("path"),
	literal("clawhub"),
	literal("git")
]);
const PluginInstallSourceSchema = union([InstallSourceSchema, literal("marketplace")]);
/** Zod object shape for persisted generic install records. */
const InstallRecordShape = {
	source: InstallSourceSchema,
	spec: string().optional(),
	sourcePath: string().optional(),
	installPath: string().optional(),
	version: string().optional(),
	resolvedName: string().optional(),
	resolvedVersion: string().optional(),
	resolvedSpec: string().optional(),
	integrity: string().optional(),
	shasum: string().optional(),
	resolvedAt: string().optional(),
	installedAt: string().optional(),
	clawhubUrl: string().optional(),
	clawhubPackage: string().optional(),
	clawhubFamily: union([literal("code-plugin"), literal("bundle-plugin")]).optional(),
	clawhubChannel: union([
		literal("official"),
		literal("community"),
		literal("private")
	]).optional(),
	clawhubTrustDisposition: union([
		literal("clean"),
		literal("review-recommended"),
		literal("review-required"),
		literal("blocked")
	]).optional(),
	clawhubTrustScanStatus: string().optional(),
	clawhubTrustModerationState: string().optional(),
	clawhubTrustReasons: array(string()).optional(),
	clawhubTrustPending: boolean().optional(),
	clawhubTrustStale: boolean().optional(),
	clawhubTrustCheckedAt: string().optional(),
	clawhubTrustAcknowledgedAt: string().optional(),
	artifactKind: union([literal("legacy-zip"), literal("npm-pack")]).optional(),
	artifactFormat: union([literal("zip"), literal("tgz")]).optional(),
	npmIntegrity: string().optional(),
	npmShasum: string().optional(),
	npmTarballName: string().optional(),
	clawpackSha256: string().optional(),
	clawpackSpecVersion: number().int().nonnegative().optional(),
	clawpackManifestSha256: string().optional(),
	clawpackSize: number().int().nonnegative().optional(),
	gitUrl: string().optional(),
	gitRef: string().optional(),
	gitCommit: string().optional()
};
object(InstallRecordShape);
const PluginInstallRecordShape = {
	...InstallRecordShape,
	source: PluginInstallSourceSchema,
	marketplaceName: string().optional(),
	marketplaceSource: string().optional(),
	marketplacePlugin: string().optional(),
	acceptedSurface: strictObject({
		channels: array(string().min(1)),
		providers: array(string().min(1)),
		tools: array(string().min(1)),
		contracts: array(string().min(1)),
		hooks: array(string().min(1)),
		mcpServers: array(string().min(1)),
		cliCommands: array(string().min(1)),
		cliBackends: array(string().min(1)),
		skills: array(string().min(1)),
		dangerousConfigFlags: array(string().min(1))
	}).optional(),
	acceptedSurfaceHash: string().optional(),
	acceptedSurfaceAt: string().optional(),
	acceptedSurfaceIntegrity: string().optional()
};
//#endregion
//#region src/config/plugin-install-record-map.ts
const PluginInstallRecordSchema = object(PluginInstallRecordShape).passthrough();
const NORMALIZED_STRING_FIELDS = [
	"spec",
	"sourcePath",
	"installPath",
	"version",
	"resolvedName",
	"resolvedVersion",
	"resolvedSpec",
	"integrity",
	"shasum",
	"resolvedAt",
	"installedAt",
	"clawhubUrl",
	"clawhubPackage",
	"clawhubTrustScanStatus",
	"clawhubTrustModerationState",
	"clawhubTrustCheckedAt",
	"clawhubTrustAcknowledgedAt",
	"npmIntegrity",
	"npmShasum",
	"npmTarballName",
	"clawpackSha256",
	"clawpackManifestSha256",
	"gitUrl",
	"gitRef",
	"gitCommit",
	"marketplaceName",
	"marketplaceSource",
	"marketplacePlugin",
	"acceptedSurfaceHash",
	"acceptedSurfaceAt",
	"acceptedSurfaceIntegrity"
];
function createPluginInstallRecordMap() {
	return Object.create(null);
}
function setPluginInstallRecordMapEntry(records, pluginId, record) {
	Object.defineProperty(records, pluginId, {
		configurable: true,
		enumerable: true,
		value: record,
		writable: true
	});
}
function getPluginInstallRecordMapEntry(records, pluginId) {
	return records && Object.hasOwn(records, pluginId) ? records[pluginId] : void 0;
}
function copyPluginInstallRecordMap(records) {
	const copied = createPluginInstallRecordMap();
	for (const [pluginId, record] of Object.entries(records ?? {})) setPluginInstallRecordMapEntry(copied, pluginId, record);
	return copied;
}
function parsePluginInstallRecord(value) {
	const parsed = PluginInstallRecordSchema.safeParse(value);
	if (!parsed.success) return null;
	const record = parsed.data;
	for (const field of NORMALIZED_STRING_FIELDS) {
		const fieldValue = record[field];
		if (fieldValue === void 0) continue;
		const normalized = fieldValue.trim();
		if (normalized) record[field] = normalized;
		else delete record[field];
	}
	if (record.clawhubTrustReasons) {
		const reasons = record.clawhubTrustReasons.map((entry) => entry.trim()).filter(Boolean);
		if (reasons.length > 0) record.clawhubTrustReasons = reasons;
		else delete record.clawhubTrustReasons;
	}
	return record;
}
function parsePluginInstallRecordMap(value) {
	if (!isRecord(value)) return null;
	const records = createPluginInstallRecordMap();
	for (const [pluginId, rawRecord] of Object.entries(value)) {
		const record = parsePluginInstallRecord(rawRecord);
		if (!record) return null;
		setPluginInstallRecordMapEntry(records, pluginId, record);
	}
	return records;
}
function inspectPluginInstallRecordMap(value) {
	if (value === void 0) return { status: "missing" };
	const records = parsePluginInstallRecordMap(value);
	return records ? {
		status: "valid",
		records
	} : { status: "invalid" };
}
//#endregion
//#region src/plugins/doctor-contract-artifact.ts
/** Resolves the Doctor artifact shared by loading, index hashing, and freshness. */
const CONTRACT_API_EXTENSIONS = [
	".js",
	".mjs",
	".cjs",
	".ts",
	".mts",
	".cts"
];
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const ORDERED_EXTENSIONS = CURRENT_MODULE_PATH.includes(`${path.sep}dist${path.sep}`) || CURRENT_MODULE_PATH.includes(`${path.sep}dist-runtime${path.sep}`) ? CONTRACT_API_EXTENSIONS : [...CONTRACT_API_EXTENSIONS.slice(3), ...CONTRACT_API_EXTENSIONS.slice(0, 3)];
["doctor-contract-api", "contract-api"].map((basename) => {
	const rootPaths = ORDERED_EXTENSIONS.map((extension) => `${basename}${extension}`);
	return {
		rootPaths,
		paths: rootPaths.flatMap((filename) => [filename, path.join("dist", filename)])
	};
});
//#endregion
//#region src/infra/clawhub-spec.ts
/** Parses explicit `clawhub:<name>[@version]` package specs for ClawHub installs. */
function parseClawHubPluginSpec(raw) {
	const trimmed = raw.trim();
	if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("clawhub:")) return null;
	const spec = trimmed.slice(8).trim();
	if (!spec) return null;
	const atIndex = spec.lastIndexOf("@");
	if (atIndex <= 0) return { name: spec };
	if (atIndex >= spec.length - 1) return null;
	const name = spec.slice(0, atIndex).trim();
	const version = spec.slice(atIndex + 1).trim();
	if (!name || !version) return null;
	return {
		name,
		version
	};
}
//#endregion
//#region src/plugins/manifest-install-owner.ts
const PLUGIN_MANIFEST_INSTALL_OWNER = Symbol.for("openclaw.pluginManifestInstallOwner");
function recordPluginManifestInstallOwner(record, installOwner, ambiguous = false) {
	if (!installOwner && !ambiguous) return record;
	Object.defineProperty(record, PLUGIN_MANIFEST_INSTALL_OWNER, {
		configurable: false,
		enumerable: true,
		value: ambiguous ? { ambiguous: true } : { installOwner }
	});
	return record;
}
path.join("plugins", "installs.json");
function resolveStoreEnv(options) {
	const env = options.env ?? process.env;
	if (options.stateDir) return {
		...env,
		OPENCLAW_STATE_DIR: options.stateDir
	};
	if (hasActivePluginInstallRoots()) return {
		...env,
		OPENCLAW_STATE_DIR: resolveActivePluginInstallRoots(env).stateDir
	};
	return env;
}
/** Resolves the canonical SQLite-backed installed plugin index path. */
function resolveInstalledPluginIndexStorePath(options = {}) {
	if (options.filePath) return options.filePath;
	return resolveOpenClawStateSqlitePath(resolveStoreEnv(options));
}
/** Resolves state database options for the installed plugin index store. */
function resolveInstalledPluginIndexStateDatabaseOptions(options = {}) {
	if (options.filePath) return {
		...options.env ? { env: options.env } : {},
		path: options.filePath
	};
	return { env: resolveStoreEnv(options) };
}
//#endregion
//#region src/plugins/installed-plugin-index-record-state.ts
/** Read failures must escape before either projection can authorize recovery or rebuilding. */
function readPersistedInstalledPluginIndexRowSync(options) {
	if (options.filePath?.endsWith(".json")) return;
	return readPluginMetadataStateRowSync("installed-index", resolveInstalledPluginIndexStateDatabaseOptions(options), options.artifactPreservingReadOnly);
}
/** Share the SQLite row while validating install records independently from index metadata. */
function getPersistedInstalledPluginIndexCacheEntry(options, readRow = () => readPersistedInstalledPluginIndexRowSync(options)) {
	const cache = getPluginCache().persistedInstalledIndex;
	const key = path.resolve(resolveInstalledPluginIndexStorePath(options));
	const current = cache.get(key);
	if (current && "value" in current) return current.value;
	const row = readRow();
	const entry = { state: row ? {
		status: "present",
		value: safeParseJson(row.value_json)
	} : { status: "missing" } };
	cache.set(key, { value: entry });
	return entry;
}
function inspectPersistedInstalledPluginIndexInstallRecords(entry) {
	if (!entry.records) {
		const state = entry.state;
		const records = (state.status === "present" ? state.value : void 0)?.index?.installRecords;
		entry.records = state.status === "missing" ? { status: "missing" } : records === void 0 ? { status: "invalid" } : inspectPluginInstallRecordMap(records);
	}
	return entry.records;
}
function inspectPersistedInstalledPluginIndexInstallRecordsSync(options = {}) {
	return inspectPersistedInstalledPluginIndexInstallRecords(getPersistedInstalledPluginIndexCacheEntry(options));
}
//#endregion
//#region src/plugins/npm-project-roots.ts
function sortPaths(paths) {
	return paths.toSorted((left, right) => left.localeCompare(right));
}
function readManagedProjects(projectDirs, npmDir) {
	return sortPaths(projectDirs).flatMap((projectRoot) => {
		const manifest = tryReadJsonSync(path.join(projectRoot, "package.json"));
		if (!isRecord(manifest) || !isRecord(manifest.dependencies)) return [];
		return Object.keys(manifest.dependencies).some((packageName) => validatePluginId(packageName) === null && isPluginNpmProjectDir({
			packageName,
			projectDir: projectRoot,
			npmDir
		})) ? [{
			projectRoot,
			manifest
		}] : [];
	});
}
/** Lists directory candidates; each consumer establishes its own package ownership. */
function listPluginNpmProjectCandidatesSync(npmRoot) {
	const projectsDir = resolvePluginNpmProjectsDir(npmRoot);
	try {
		return sortPaths(fsSync.readdirSync(projectsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => path.join(projectsDir, entry.name)));
	} catch (error) {
		if (isNotFoundPathError(error)) return [];
		throw error;
	}
}
/** Lists admitted projects with the manifest that established their managed ownership. */
function listManagedPluginNpmProjectsSync(npmRoot) {
	return readManagedProjects(listPluginNpmProjectCandidatesSync(npmRoot), npmRoot);
}
//#endregion
//#region src/plugins/managed-npm-retention.ts
const RETAINED_MANAGED_NPM_INSTALL_MARKER_DIR = ".openclaw-retained-npm-installs";
function resolveRetainedManagedNpmInstallPackageInfo(packageDir) {
	const resolvedPackageDir = path.resolve(packageDir);
	const packageBase = path.basename(resolvedPackageDir);
	const parentDir = path.dirname(resolvedPackageDir);
	const parentBase = path.basename(parentDir);
	const scopedPackage = parentBase.startsWith("@");
	const nodeModulesRoot = scopedPackage ? path.dirname(parentDir) : parentDir;
	if (path.basename(nodeModulesRoot) !== "node_modules") return null;
	const packageName = scopedPackage ? `${parentBase}/${packageBase}` : packageBase;
	if (!packageBase || packageBase === "." || !packageName.trim()) return null;
	const projectRoot = path.dirname(nodeModulesRoot);
	return {
		packageName,
		projectRoot,
		markerPath: path.join(projectRoot, RETAINED_MANAGED_NPM_INSTALL_MARKER_DIR, `${safePathSegmentHashed(packageName)}.json`)
	};
}
function hasRetainedManagedNpmInstallMarker(packageDir) {
	const info = resolveRetainedManagedNpmInstallPackageInfo(packageDir);
	return info ? fsSync.existsSync(info.markerPath) : false;
}
//#endregion
//#region src/plugins/installed-plugin-index-record-reader.ts
/** Reads installed-index records back into manifest registry records. */
function readJsonObjectFileSync(filePath) {
	const parsed = tryReadJsonSync(filePath);
	return isRecord(parsed) ? parsed : null;
}
function readStringRecord(value) {
	if (!isRecord(value)) return {};
	const record = {};
	for (const [key, raw] of Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (isBlockedObjectKey$1(key)) continue;
		if (typeof raw === "string" && raw.trim()) record[key] = raw.trim();
	}
	return record;
}
function hasPackagePluginMetadata(manifest) {
	const openclaw = manifest.openclaw;
	if (!isRecord(openclaw)) return false;
	const extensions = openclaw.extensions;
	return Array.isArray(extensions) && extensions.some((entry) => typeof entry === "string");
}
function readManifestPluginId(packageDir) {
	const manifest = readJsonObjectFileSync(path.join(packageDir, "openclaw.plugin.json"));
	return (typeof manifest?.id === "string" ? manifest.id.trim() : "") || void 0;
}
function resolveRecoveredManagedNpmRoot(options = {}) {
	return path.resolve(options.stateDir ? path.join(options.stateDir, "npm") : resolveDefaultPluginNpmDir(options.env));
}
function resolveRecoveredManagedNpmPluginId(params) {
	const { packageManifest } = params;
	if (!packageManifest || !hasPackagePluginMetadata(packageManifest)) return;
	const packageName = typeof packageManifest.name === "string" && packageManifest.name.trim() ? packageManifest.name.trim() : params.packageName;
	const pluginId = readManifestPluginId(params.packageDir) ?? packageName;
	return validatePluginId(pluginId) ? void 0 : pluginId;
}
function readManagedNpmInstallTimestampMs(params) {
	const timestampPaths = params.sharedLegacyRoot ? [params.packageDir] : [path.join(params.projectRoot, "package.json"), params.projectRoot];
	for (const filePath of timestampPaths) try {
		return fsSync.statSync(filePath).mtimeMs;
	} catch {}
	return 0;
}
function buildRecoveredManagedNpmInstallCandidatesForRoot(params) {
	const dependencies = readStringRecord(params.rootManifest?.dependencies);
	const candidates = [];
	for (const [packageName, dependencySpec] of Object.entries(dependencies)) {
		const packageDir = path.join(params.projectRoot, "node_modules", ...packageName.split("/"));
		if (!safeStatSync(packageDir)?.isDirectory()) continue;
		if (hasRetainedManagedNpmInstallMarker(packageDir)) continue;
		const packageManifest = readJsonObjectFileSync(path.join(packageDir, "package.json"));
		const pluginId = resolveRecoveredManagedNpmPluginId({
			packageName,
			packageDir,
			packageManifest
		});
		if (!pluginId) continue;
		const version = typeof packageManifest?.version === "string" && packageManifest.version.trim() ? packageManifest.version.trim() : void 0;
		candidates.push({
			pluginId,
			installTimestampMs: readManagedNpmInstallTimestampMs({
				packageDir,
				projectRoot: params.projectRoot,
				sharedLegacyRoot: params.sharedLegacyRoot
			}),
			installRecord: {
				source: "npm",
				spec: `${packageName}@${dependencySpec}`,
				installPath: packageDir,
				...version ? {
					version,
					resolvedName: packageName,
					resolvedVersion: version
				} : {},
				...version ? { resolvedSpec: `${packageName}@${version}` } : {}
			}
		});
	}
	return candidates;
}
/** Lists recoverable managed npm installs without assigning active precedence. */
function listRecoveredManagedNpmInstallCandidates(options = {}) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	return [...buildRecoveredManagedNpmInstallCandidatesForRoot({
		projectRoot: npmRoot,
		rootManifest: readJsonObjectFileSync(path.join(npmRoot, "package.json")),
		sharedLegacyRoot: true
	}), ...listManagedPluginNpmProjectsSync(npmRoot).flatMap(({ projectRoot, manifest }) => buildRecoveredManagedNpmInstallCandidatesForRoot({
		projectRoot,
		rootManifest: manifest,
		sharedLegacyRoot: false
	}))];
}
function recordsShareInstallPath(left, right) {
	if (!left?.installPath || !right.installPath) return false;
	return normalizeInstallPathForComparison(left.installPath) === normalizeInstallPathForComparison(right.installPath);
}
function normalizeInstallPathForComparison(filePath) {
	const resolved = path.resolve(filePath);
	return process.platform === "win32" ? normalizeWindowsPathForComparison$1(resolved) : resolved;
}
function pickMostRecentRecoveredManagedNpmCandidate(candidates) {
	return candidates.toSorted((left, right) => {
		const byTimestamp = right.installTimestampMs - left.installTimestampMs;
		if (byTimestamp !== 0) return byTimestamp;
		return (right.installRecord.installPath ?? "").localeCompare(left.installRecord.installPath ?? "");
	})[0];
}
function emitManagedNpmRecoveryFallbackWarning(params) {
	process.emitWarning(`Managed npm recovery found ${params.candidates.length} installs for plugin "${params.pluginId}" without an authoritative active path; selected the most recently installed candidate. Run \`openclaw doctor --fix\` to persist and retire stale generations.`, {
		code: "OPENCLAW_PLUGIN_INSTALL_RECOVERY_FALLBACK",
		type: "OpenClawPluginRecoveryWarning",
		detail: JSON.stringify({
			pluginId: params.pluginId,
			selectedInstallPath: params.selected.installRecord.installPath,
			candidates: params.candidates.map((candidate) => ({
				installPath: candidate.installRecord.installPath,
				installTimestampMs: candidate.installTimestampMs
			}))
		})
	});
}
function buildRecoveredManagedNpmInstallRecords(persisted, options = {}) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	const records = createPluginInstallRecordMap();
	const candidatesByPluginId = groupPluginRecords(listRecoveredManagedNpmInstallCandidates(options), (candidate) => candidate.pluginId);
	for (const [pluginId, candidates] of candidatesByPluginId) {
		const persistedRecord = getPluginInstallRecordMapEntry(persisted ?? void 0, pluginId);
		const authoritative = candidates.find((candidate) => recordsShareInstallPath(persistedRecord, candidate.installRecord));
		const selected = authoritative ?? pickMostRecentRecoveredManagedNpmCandidate(candidates);
		setPluginInstallRecordMapEntry(records, pluginId, selected.installRecord);
		const recoversUnavailableManagedPath = isUnavailableManagedNpmInstallRecord({
			npmRoot,
			persisted: persistedRecord,
			recovered: selected.installRecord
		});
		if (!authoritative && candidates.length > 1 && (!persistedRecord || recoversUnavailableManagedPath)) emitManagedNpmRecoveryFallbackWarning({
			pluginId,
			selected,
			candidates
		});
	}
	return records;
}
function readInstallRecordVersion(record) {
	return record?.resolvedVersion ?? record?.version;
}
function isUnavailableManagedNpmInstallRecord(params) {
	const installPath = params.persisted?.installPath;
	if (params.persisted?.source !== "npm" || !installPath) return false;
	try {
		if (fsSync.statSync(installPath).isDirectory()) return false;
	} catch (error) {
		if (!isNotFoundPathError(error)) return false;
	}
	const packageInfo = resolveRetainedManagedNpmInstallPackageInfo(installPath);
	if (!packageInfo || packageInfo.packageName !== params.recovered.resolvedName) return false;
	const npmRoot = normalizeInstallPathForComparison(params.npmRoot);
	return normalizeInstallPathForComparison(packageInfo.projectRoot) === npmRoot || normalizeInstallPathForComparison(path.dirname(packageInfo.projectRoot)) === normalizeInstallPathForComparison(resolvePluginNpmProjectsDir(params.npmRoot));
}
function mergeRecoveredManagedNpmMetadata(persisted, recovered, options = {}) {
	const next = {
		...persisted,
		...recovered
	};
	if (options.preservePersistedSpec) {
		const persistedSpec = persisted.spec ? parseRegistryNpmSpec(persisted.spec) : null;
		const selectorIsCompatible = persistedSpec !== null && isPrereleaseResolutionAllowed({
			spec: persistedSpec,
			resolvedVersion: recovered.resolvedVersion
		}) && (persistedSpec.selectorKind !== "exact-version" || persistedSpec.selector !== void 0 && recovered.resolvedVersion !== void 0 && compareValidSemver(persistedSpec.selector, recovered.resolvedVersion) === 0);
		if (persistedSpec?.name === recovered.resolvedName && selectorIsCompatible) next.spec = persisted.spec;
	}
	delete next.integrity;
	delete next.shasum;
	delete next.resolvedAt;
	delete next.installedAt;
	return next;
}
function mergeRecoveredManagedNpmRecord(params) {
	if (params.persisted && isUnavailableManagedNpmInstallRecord(params)) return mergeRecoveredManagedNpmMetadata(params.persisted, params.recovered, { preservePersistedSpec: true });
	const persistedVersion = readInstallRecordVersion(params.persisted);
	const recoveredVersion = readInstallRecordVersion(params.recovered);
	if (params.persisted?.source === "npm" && recordsShareInstallPath(params.persisted, params.recovered) && recoveredVersion && persistedVersion !== recoveredVersion) return mergeRecoveredManagedNpmMetadata(params.persisted, params.recovered);
	return params.persisted ?? params.recovered;
}
/** Merges persisted records with managed npm installs recovered from the current root. */
function mergeRecoveredManagedNpmInstallRecords(persisted, options) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	const recovered = buildRecoveredManagedNpmInstallRecords(persisted, options);
	const merged = copyPluginInstallRecordMap(persisted ?? void 0);
	for (const [pluginId, record] of Object.entries(recovered)) setPluginInstallRecordMapEntry(merged, pluginId, mergeRecoveredManagedNpmRecord({
		npmRoot,
		persisted: getPluginInstallRecordMapEntry(merged, pluginId),
		recovered: record
	}));
	return merged;
}
function requireLoadablePluginInstallRecordState(state) {
	if (state.status === "invalid") throw new Error("Persisted plugin install records are invalid. Run openclaw doctor to inspect and repair plugin installation state.");
	return state.status === "valid" ? state.records : null;
}
function resolveInstallRecordsCacheKey(options) {
	return [path.resolve(resolveInstalledPluginIndexStorePath(options)), resolveRecoveredManagedNpmRoot(options)].join("\0");
}
/** Synchronously loads installed plugin records, recovering managed npm installs and caching them. */
function loadInstalledPluginIndexInstallRecordsSync(params = {}) {
	const cacheKey = resolveInstallRecordsCacheKey(params);
	const cache = getPluginCache().installRecords;
	const cached = cache.get(cacheKey);
	if (cached) return copyPluginInstallRecordMap(cached);
	const records = mergeRecoveredManagedNpmInstallRecords(requireLoadablePluginInstallRecordState(inspectPersistedInstalledPluginIndexInstallRecordsSync(params)), params);
	cache.set(cacheKey, records);
	return copyPluginInstallRecordMap(records);
}
//#endregion
//#region src/plugins/official-external-install-records.ts
function resolveNpmSpecPackageName(spec) {
	return spec ? parseRegistryNpmSpec(spec)?.name : void 0;
}
function resolveClawHubSpecPackageName(spec) {
	return spec ? parseClawHubPluginSpec(spec)?.name : void 0;
}
function resolveExactNpmPackageName(value) {
	const packageName = resolveNpmSpecPackageName(value);
	return packageName && value.trim() === packageName ? packageName : void 0;
}
function resolveRecordedPackageNames(fields) {
	const packageNames = [];
	for (const [value, resolvePackageName] of fields) {
		if (value === void 0) continue;
		const packageName = resolvePackageName(value);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	return packageNames;
}
function resolveUnanimousRecordedNpmPackageName(record) {
	if (record.source !== "npm") return;
	const packageNames = resolveRecordedPackageNames([
		[record.spec, resolveNpmSpecPackageName],
		[record.resolvedName, resolveExactNpmPackageName],
		[record.resolvedSpec, resolveNpmSpecPackageName]
	]);
	return packageNames && new Set(packageNames).size === 1 ? packageNames[0] : void 0;
}
function hasTrustedOfficialNpmProvenance(record) {
	return record.source === "npm" && record.artifactKind === void 0 && record.sourcePath === void 0;
}
function resolveRecordedClawHubPackageNames(record) {
	return resolveRecordedPackageNames([
		[record.clawhubPackage, resolveExactNpmPackageName],
		[record.spec, resolveClawHubSpecPackageName],
		[record.resolvedSpec, (spec) => resolveClawHubSpecPackageName(spec) ?? resolveNpmSpecPackageName(spec)],
		[record.resolvedName, resolveExactNpmPackageName]
	]);
}
function isOfficialClawHubInstallRecord(record) {
	if (record.source !== "clawhub" || record.clawhubChannel !== "official") return false;
	return (record.clawhubUrl ?? "").trim().replace(/\/+$/, "") === "https://clawhub.ai";
}
/** Resolves one package identity from a current trusted official ClawHub install record. */
function resolveTrustedOfficialClawHubPackageName(record) {
	if (!isOfficialClawHubInstallRecord(record)) return;
	const packageNames = resolveRecordedClawHubPackageNames(record);
	return packageNames && new Set(packageNames).size === 1 ? packageNames[0] : void 0;
}
/** Binds official trust to the actual package and consistent recorded source identity. */
function isTrustedOfficialPluginInstallRecord(params) {
	const packageName = params.packageName?.trim();
	const entry = packageName ? getOfficialExternalPluginCatalogEntryForPackage(packageName) : void 0;
	if (!entry || resolveOfficialExternalPluginId(entry) !== params.pluginId && !resolveOfficialExternalPluginLegacyIds(entry).includes(params.pluginId)) return false;
	const install = resolveOfficialExternalPluginInstall(entry);
	const record = params.record;
	if (record.source === "npm") return hasTrustedOfficialNpmProvenance(record) && resolveNpmSpecPackageName(install?.npmSpec) === packageName && resolveUnanimousRecordedNpmPackageName(record) === packageName && (record.clawhubPackage === void 0 || resolveExactNpmPackageName(record.clawhubPackage) === packageName);
	return Boolean(install?.clawhubSpec || install?.npmSpec) && (record.clawhubPackage !== void 0 || record.spec !== void 0) && resolveTrustedOfficialClawHubPackageName(record) === packageName;
}
//#endregion
//#region src/plugins/installed-plugin-record-match.ts
function resolveCandidateInstallOwner(params) {
	if (isPluginCandidateInstallOwnerAmbiguous(params.candidate)) return;
	const installOwner = resolvePluginCandidateInstallOwner(params.candidate);
	if (installOwner) return Object.hasOwn(params.installRecords, installOwner) ? installOwner : void 0;
}
function matchesInstalledPluginRecord(params) {
	if (params.candidate.origin !== "global" && params.candidate.origin !== "config") return false;
	const installOwner = resolveCandidateInstallOwner(params);
	const record = installOwner ? params.installRecords[installOwner] : void 0;
	if (!record) return false;
	const candidatePaths = [
		params.candidate.rootDir,
		params.candidate.packageDir,
		params.candidate.source,
		params.candidate.setupSource
	].filter((entry) => typeof entry === "string" && entry.trim().length > 0).map((entry) => {
		const resolved = resolveUserPath(entry, params.env);
		return pluginCacheRealpathSync(resolved) ?? resolved;
	});
	const trackedPaths = (params.installPathOnly ? [record.installPath] : [record.installPath, record.sourcePath]).filter((entry) => typeof entry === "string" && entry.trim().length > 0).map((entry) => {
		const resolved = resolveUserPath(entry, params.env);
		return pluginCacheRealpathSync(resolved) ?? resolved;
	});
	if (candidatePaths.length === 0 || trackedPaths.length === 0) return false;
	return trackedPaths.some((trackedPath) => candidatePaths.some((candidatePath) => candidatePath === trackedPath || isPathInside$1(trackedPath, candidatePath) || isPathInside$1(candidatePath, trackedPath)));
}
function resolvePluginTrust(params) {
	const installOwner = resolveCandidateInstallOwner(params);
	const record = installOwner ? params.installRecords[installOwner] : void 0;
	const origin = params.candidate.origin;
	let reason;
	if (origin === "bundled") reason = "bundled";
	else if (isPluginCandidateInstallOwnerAmbiguous(params.candidate)) reason = "owner-ambiguous";
	else if (origin === "workspace" || record?.source === "path" || record?.source === "npm" && (record.artifactKind !== void 0 || record.sourcePath !== void 0)) reason = "origin-path";
	else if (!record || !installOwner) reason = "record-missing";
	else if (!matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.candidate,
		env: params.env,
		installRecords: params.installRecords,
		installPathOnly: true
	})) reason = "install-path-mismatch";
	else if (isTrustedOfficialPluginInstallRecord({
		pluginId: installOwner,
		packageName: params.candidate.packageName,
		record
	})) reason = "trusted-official";
	else if (record.source === "npm" && record.spec === void 0 && record.resolvedName === void 0 && record.resolvedSpec === void 0 || record.source === "clawhub" && record.clawhubUrl === void 0 && record.clawhubChannel === void 0) reason = "provenance-missing";
	else reason = "provenance-invalid";
	return {
		reason,
		registryPath: params.registryPath,
		origin,
		installSource: record?.source,
		installSpec: record?.spec === void 0 ? void 0 : redactSensitiveText(record.spec, { mode: "tools" })
	};
}
//#endregion
//#region packages/gateway-protocol/src/svg-image.ts
const SVG_PROLOGUE_WHITESPACE_RE = /\s*/y;
function skipSvgPrologueWhitespace(text, index) {
	SVG_PROLOGUE_WHITESPACE_RE.lastIndex = index;
	SVG_PROLOGUE_WHITESPACE_RE.exec(text);
	return SVG_PROLOGUE_WHITESPACE_RE.lastIndex;
}
function startsWithToken(text, index, token) {
	return text.slice(index, index + token.length).toLowerCase() === token;
}
/**
* Recognizes an SVG root element after an optional XML declaration and comments.
*
* An index scan rather than a regex on purpose: the equivalent
* `(?:<!--[\s\S]*?-->\s*)*<svg` backtracks exponentially on comment-like bytes that
* never reach a root element, and these bytes arrive from remote icon and
* link-favicon responses on the Gateway's single event loop, so one crafted
* response would stall every session. A comment ends at its first `-->`, so text
* between a closed comment and the root element is rejected, not absorbed.
*/
function startsWithSvgRootElement(text) {
	let index = skipSvgPrologueWhitespace(text, 0);
	if (startsWithToken(text, index, "<?xml")) {
		const declarationEnd = text.indexOf(">", index);
		if (declarationEnd < 0) return false;
		index = skipSvgPrologueWhitespace(text, declarationEnd + 1);
	}
	while (startsWithToken(text, index, "<!--")) {
		const commentEnd = text.indexOf("-->", index + 4);
		if (commentEnd < 0) return false;
		index = skipSvgPrologueWhitespace(text, commentEnd + 3);
	}
	if (!startsWithToken(text, index, "<svg")) return false;
	const delimiter = text[index + 4];
	return delimiter === ">" || delimiter === "/" && text[index + 5] === ">" || delimiter !== void 0 && /\s/u.test(delimiter);
}
/**
* SVG images stay self-contained: no script, document expansion, embedded
* documents, or outbound fetches can reach the browser through an image route.
*/
function isSelfContainedSvg(text) {
	return !text.includes("\0") && !/<!doctype|<!entity/iu.test(text) && !/<\s*(?:script|foreignObject|image|use|iframe)\b/iu.test(text) && !/\b(?:href|xlink:href|src)\s*=/iu.test(text) && startsWithSvgRootElement(text);
}
//#endregion
//#region src/plugins/portable-icon-paths.ts
/** Package-local artwork contracts shared by discovery and package builders. */
const PORTABLE_PLUGIN_ICON_PATH = "assets/icon.png";
const PLUGIN_ACTIVITY_ICON_PATH = "assets/activity.svg";
const PLUGIN_TOOL_ACTIVITY_ICON_DIR = "assets/activity";
const PLUGIN_ACTIVITY_ICON_MAX_BYTES = 32768;
function isPluginActivityToolName(value) {
	return /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$/u.test(value);
}
//#endregion
//#region src/plugins/manifest-theme-definitions.ts
/** Capture palettes and artwork so a published generation never reads changed files. */
function loadManifestThemeDefinitions(params) {
	if (!params.themes?.length) return;
	return params.themes.flatMap((theme) => {
		try {
			if (params.pluginId === "user" || !isThemeId(`${params.pluginId}/${theme.id}`)) throw new Error("qualified theme ID must be portable, outside user/, and at most 256 characters");
			const file = readPluginCacheFile({
				rootDir: params.rootDir,
				relativePath: theme.source,
				rejectHardlinks: params.rejectHardlinks,
				maxBytes: MAX_THEME_DEFINITION_BYTES * 4
			});
			if (!file.ok) throw new Error("source must be a readable JSON file inside the plugin root");
			const definition = normalizeThemeDefinition(JSON.parse(file.contents.toString("utf8")), {
				hatIds: Object.keys(theme.hats ?? {}),
				critterIds: Object.keys(theme.critters ?? {})
			});
			if (definition.name !== theme.name || definition.description !== theme.description) throw new Error("name and description must match the manifest declaration");
			const readSvg = (source) => {
				const svgFile = readPluginCacheFile({
					rootDir: params.rootDir,
					relativePath: source,
					rejectHardlinks: params.rejectHardlinks,
					maxBytes: PLUGIN_ACTIVITY_ICON_MAX_BYTES
				});
				if (!svgFile.ok) throw new Error(`artwork ${source} must be a readable SVG inside the plugin root, at most ${PLUGIN_ACTIVITY_ICON_MAX_BYTES} bytes`);
				const svg = svgFile.contents.toString("utf8");
				if (!isSelfContainedSvg(svg)) throw new Error(`artwork ${source} must be a self-contained SVG`);
				return svg;
			};
			const artwork = {
				...theme.hats ? { hats: Object.fromEntries(Object.entries(theme.hats).map(([id, source]) => [id, { svg: readSvg(source) }])) } : {},
				...theme.critters ? { critters: Object.fromEntries(Object.entries(theme.critters).map(([id, { source, ...metadata }]) => [id, {
					svg: readSvg(source),
					...metadata
				}])) } : {}
			};
			return [{
				id: theme.id,
				definition,
				...theme.hats || theme.critters ? { artwork } : {}
			}];
		} catch (error) {
			params.diagnostics.push({
				level: "warn",
				pluginId: params.pluginId,
				message: `theme ${theme.id} is unavailable: ${error instanceof Error ? error.message : "invalid definition"}`
			});
			return [];
		}
	});
}
//#endregion
//#region src/plugins/manifest-record.ts
function resolvePluginSourcePath(sourcePath) {
	if (pluginCacheExistsSync(sourcePath)) return sourcePath;
	if (sourcePath.endsWith(".ts")) {
		const jsPath = sourcePath.slice(0, -3) + ".js";
		if (pluginCacheExistsSync(jsPath)) return jsPath;
	}
	return sourcePath;
}
function isPluginRootPath(params) {
	const resolvedTargetPath = path.resolve(params.targetPath);
	if (!isPathInside$1(path.resolve(params.rootPath), resolvedTargetPath)) return false;
	const targetRealPath = pluginCacheRealpathSync(resolvedTargetPath);
	if (!targetRealPath) return params.targetMustExist !== true;
	if (!isPathInside$1(params.rootRealPath, targetRealPath)) return false;
	if (params.rejectHardlinks === true) {
		const targetStat = pluginCacheStatSync(resolvedTargetPath);
		if (!targetStat || targetStat.nlink > 1) return false;
	}
	return true;
}
function resolveManifestPluginSourcePath(params) {
	const pushDiagnostic = () => {
		params.diagnostics.push({
			level: "warn",
			pluginId: sanitizeForLog(params.pluginId),
			source: sanitizeForLog(params.manifestPath),
			message: `plugin manifest ${params.entryName} must resolve inside the plugin root; ignoring entry`
		});
	};
	if (!params.entry || path.isAbsolute(params.entry)) {
		pushDiagnostic();
		return;
	}
	const rootPath = path.resolve(params.rootDir);
	const rootRealPath = pluginCacheRealpathSync(rootPath) ?? rootPath;
	const sourcePath = path.resolve(rootPath, params.entry);
	if (!isPluginRootPath({
		rootPath,
		targetPath: sourcePath,
		rootRealPath,
		rejectHardlinks: params.rejectHardlinks,
		targetMustExist: pluginCacheExistsSync(sourcePath)
	})) {
		pushDiagnostic();
		return;
	}
	const resolvedSourcePath = resolvePluginSourcePath(sourcePath);
	if (!isPluginRootPath({
		rootPath,
		targetPath: resolvedSourcePath,
		rootRealPath,
		rejectHardlinks: params.rejectHardlinks,
		targetMustExist: pluginCacheExistsSync(resolvedSourcePath)
	})) {
		pushDiagnostic();
		return;
	}
	return resolvedSourcePath;
}
function resolvePortablePluginIcons(params) {
	let root;
	const resolveIcon = (relativePath) => {
		const iconPath = path.resolve(params.rootDir, relativePath);
		const iconStat = pluginCacheLstatSync(iconPath);
		if (!iconStat?.isFile() || params.rejectHardlinks && iconStat.nlink > 1) return;
		if (!root) {
			const rootPath = path.resolve(params.rootDir);
			root = {
				path: rootPath,
				realPath: pluginCacheRealpathSync(rootPath) ?? rootPath
			};
		}
		return isPluginRootPath({
			rootPath: root.path,
			targetPath: iconPath,
			rootRealPath: root.realPath,
			rejectHardlinks: params.rejectHardlinks,
			targetMustExist: true
		}) ? iconPath : void 0;
	};
	const iconPath = resolveIcon(PORTABLE_PLUGIN_ICON_PATH);
	const activityIconPath = resolveIcon(PLUGIN_ACTIVITY_ICON_PATH);
	const directory = path.resolve(params.rootDir, PLUGIN_TOOL_ACTIVITY_ICON_DIR);
	if (!isPluginRootPath({
		rootPath: params.rootDir,
		rootRealPath: params.rootDir === root?.path ? root.realPath : pluginCacheRealpathSync(params.rootDir) ?? params.rootDir,
		targetPath: directory,
		targetMustExist: true
	})) return {
		iconPath,
		activityIconPath
	};
	let entries;
	try {
		entries = readPluginCacheDirectory(directory);
	} catch {
		return {
			iconPath,
			activityIconPath
		};
	}
	if (entries.length > 128) return {
		iconPath,
		activityIconPath
	};
	const paths = [];
	for (const name of entries.map((entry) => entry.name).toSorted()) {
		const toolName = name.endsWith(".svg") ? name.slice(0, -4) : "";
		if (!isPluginActivityToolName(toolName)) continue;
		const toolIconPath = resolveIcon(`${PLUGIN_TOOL_ACTIVITY_ICON_DIR}/${name}`);
		if (toolIconPath) paths.push([toolName, toolIconPath]);
	}
	return {
		iconPath,
		activityIconPath,
		...paths.length ? { toolActivityIconPaths: Object.fromEntries(paths) } : {}
	};
}
function mergePackageChannelMetaIntoChannelConfigs(params) {
	const channelId = params.packageChannel?.id?.trim();
	if (!channelId || isBlockedObjectKey$1(channelId) || !params.channelConfigs || !Object.hasOwn(params.channelConfigs, channelId)) return params.channelConfigs;
	const existing = params.channelConfigs[channelId];
	if (!existing) return params.channelConfigs;
	const label = existing.label ?? normalizeOptionalString(params.packageChannel?.label) ?? "";
	const description = existing.description ?? normalizeOptionalString(params.packageChannel?.blurb) ?? "";
	const preferOver = existing.preferOver ?? normalizeOptionalTrimmedStringList(params.packageChannel?.preferOver);
	const commands = existing.commands ?? normalizeManifestChannelCommandDefaults(params.packageChannel?.commands);
	const merged = Object.create(null);
	for (const [key, value] of Object.entries(params.channelConfigs)) if (!isBlockedObjectKey$1(key)) merged[key] = value;
	merged[channelId] = {
		...existing,
		...label ? { label } : {},
		...description ? { description } : {},
		...preferOver?.length ? { preferOver } : {},
		...commands ? { commands } : {}
	};
	return merged;
}
function mergeManifestContracts(manifestContracts, catalogContracts) {
	if (!catalogContracts) return manifestContracts;
	const contracts = {};
	for (const key of PLUGIN_MANIFEST_CONTRACT_KEYS) {
		const merged = normalizeUniqueTrimmedStringList([...manifestContracts?.[key] ?? [], ...catalogContracts[key] ?? []]);
		if (merged.length > 0) contracts[key] = merged;
	}
	return Object.keys(contracts).length > 0 ? contracts : void 0;
}
function mergeCatalogChannelConfigs(params) {
	if (!params.catalogChannelConfigs) return params.manifestChannelConfigs;
	const merged = Object.create(null);
	for (const [key, value] of Object.entries(params.catalogChannelConfigs)) if (!isBlockedObjectKey$1(key)) merged[key] = value;
	for (const [key, value] of Object.entries(params.manifestChannelConfigs ?? {})) if (!isBlockedObjectKey$1(key)) {
		const catalogValue = merged[key];
		merged[key] = catalogValue ? {
			...catalogValue,
			...value,
			schema: value.schema ?? catalogValue.schema,
			...catalogValue.uiHints || value.uiHints ? { uiHints: {
				...catalogValue.uiHints,
				...value.uiHints
			} } : {},
			...value.runtime ?? catalogValue.runtime ? { runtime: value.runtime ?? catalogValue.runtime } : {},
			...value.label ?? catalogValue.label ? { label: value.label ?? catalogValue.label } : {},
			...value.description ?? catalogValue.description ? { description: value.description ?? catalogValue.description } : {},
			...value.preferOver ?? catalogValue.preferOver ? { preferOver: value.preferOver ?? catalogValue.preferOver } : {},
			...value.commands ?? catalogValue.commands ? { commands: value.commands ?? catalogValue.commands } : {}
		} : value;
	}
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function buildPluginManifestRecord(params) {
	const pluginId = params.candidate.effectivePluginId ?? params.manifest.id;
	const resolveCatalogEntry = (entryName) => {
		const entry = params.manifest[entryName];
		return entry === void 0 ? void 0 : resolveManifestPluginSourcePath({
			rootDir: params.candidate.rootDir,
			manifestPath: params.manifestPath,
			pluginId,
			entryName,
			entry,
			rejectHardlinks: params.rejectHardlinks,
			diagnostics: params.diagnostics
		});
	};
	const manifestChannelConfigs = params.candidate.origin === "bundled" && params.bundledChannelConfigCollector ? params.bundledChannelConfigCollector({
		pluginDir: params.candidate.packageDir ?? params.candidate.rootDir,
		manifest: params.manifest,
		packageManifest: params.candidate.packageManifest
	}) : params.manifest.channelConfigs;
	const officialCatalogManifest = params.candidate.origin !== "bundled" ? getOfficialExternalPluginCatalogManifest(getOfficialExternalPluginCatalogEntryForPackage(params.candidate.packageName) ?? {}) : void 0;
	const channelConfigs = mergePackageChannelMetaIntoChannelConfigs({
		channelConfigs: mergeCatalogChannelConfigs({
			manifestChannelConfigs,
			catalogChannelConfigs: officialCatalogManifest?.channelConfigs
		}),
		packageChannel: params.candidate.packageManifest?.channel
	});
	const packageChannelCommands = normalizeManifestChannelCommandDefaults(params.candidate.packageManifest?.channel?.commands);
	return {
		id: pluginId,
		categories: params.manifest.categories,
		backupResources: params.manifest.backupResources,
		doctorContract: params.manifest.doctorContract,
		doctorHealthChecks: params.manifest.doctorHealthChecks,
		sessionRouteStateOwners: params.manifest.sessionRouteStateOwners,
		name: normalizeOptionalString(params.manifest.name) ?? params.candidate.packageName,
		description: normalizeOptionalString(params.manifest.description) ?? params.candidate.packageDescription,
		catalog: normalizeManifestCatalog({
			featured: params.manifest.catalog?.featured ?? officialCatalogManifest?.catalog?.featured,
			order: params.manifest.catalog?.order ?? officialCatalogManifest?.catalog?.order
		}),
		...resolvePortablePluginIcons({
			rootDir: params.candidate.rootDir,
			rejectHardlinks: params.rejectHardlinks
		}),
		version: normalizeOptionalString(params.manifest.version) ?? params.candidate.packageVersion,
		packageName: params.candidate.packageName,
		packageVersion: params.candidate.packageVersion,
		packageDescription: params.candidate.packageDescription,
		enabledByDefault: params.manifest.enabledByDefault === true ? true : void 0,
		enabledByDefaultOnPlatforms: params.manifest.enabledByDefaultOnPlatforms,
		autoEnableWhenConfiguredProviders: params.manifest.autoEnableWhenConfiguredProviders,
		legacyPluginIds: params.manifest.legacyPluginIds,
		format: params.candidate.format ?? "openclaw",
		bundleFormat: params.candidate.bundleFormat,
		kind: params.manifest.kind,
		channels: params.manifest.channels ?? [],
		channelAccountKeyPolicies: params.manifest.channelAccountKeyPolicies,
		providers: params.manifest.providers ?? [],
		providerDiscoverySource: resolveCatalogEntry("providerCatalogEntry"),
		capabilityCatalogSource: params.manifest.capabilityCatalogEntry === void 0 ? void 0 : resolveCatalogEntry("capabilityCatalogEntry") ?? null,
		modelSupport: params.manifest.modelSupport,
		modelCatalog: params.manifest.modelCatalog,
		modelPricing: params.manifest.modelPricing,
		modelIdNormalization: params.manifest.modelIdNormalization,
		providerEndpoints: params.manifest.providerEndpoints,
		providerRequest: params.manifest.providerRequest,
		secretProviderIntegrations: params.manifest.secretProviderIntegrations,
		cliBackends: params.manifest.cliBackends ?? [],
		syntheticAuthRefs: params.manifest.syntheticAuthRefs ?? [],
		nonSecretAuthMarkers: params.manifest.nonSecretAuthMarkers ?? [],
		commandAliases: params.manifest.commandAliases,
		cliCommands: params.manifest.cliCommands,
		providerUsageAuthEnvVars: params.manifest.providerUsageAuthEnvVars,
		providerAuthAliases: params.manifest.providerAuthAliases,
		providerAuthChoices: params.manifest.providerAuthChoices,
		activation: params.manifest.activation,
		setup: params.manifest.setup,
		packageManifest: params.candidate.packageManifest,
		packageDependencies: params.candidate.packageDependencies,
		packageOptionalDependencies: params.candidate.packageOptionalDependencies,
		packageChannel: params.candidate.packageManifest?.channel,
		packageInstall: params.candidate.packageManifest?.install,
		trustedOfficialInstall: params.trust.reason === "trusted-official" ? true : void 0,
		trust: params.trust,
		qaRunners: params.manifest.qaRunners,
		dashboard: params.manifest.dashboard,
		controlUi: params.manifest.controlUi,
		uiCapabilities: params.manifest.uiCapabilities,
		themes: params.manifest.themes,
		themeDefinitions: loadManifestThemeDefinitions({
			pluginId,
			rootDir: params.candidate.rootDir,
			themes: params.manifest.themes,
			rejectHardlinks: params.rejectHardlinks,
			diagnostics: params.diagnostics
		}),
		mcpServers: params.manifest.mcpServers,
		skills: params.manifest.skills ?? [],
		settingsFiles: [],
		hooks: [],
		origin: params.candidate.origin,
		workspaceDir: params.candidate.workspaceDir,
		rootDir: params.candidate.rootDir,
		source: params.candidate.source,
		setupSource: params.candidate.setupSource,
		manifestPath: params.manifestPath,
		schemaCacheKey: params.schemaCacheKey,
		configSchema: params.configSchema,
		configUiHints: params.manifest.uiHints,
		configGroups: params.manifest.configGroups,
		contracts: mergeManifestContracts(params.manifest.contracts, officialCatalogManifest?.contracts),
		transcriptSources: params.manifest.transcriptSources,
		decisionModels: params.manifest.decisionModels,
		mediaUnderstandingProviderMetadata: params.manifest.mediaUnderstandingProviderMetadata,
		imageGenerationProviderMetadata: params.manifest.imageGenerationProviderMetadata,
		videoGenerationProviderMetadata: params.manifest.videoGenerationProviderMetadata,
		musicGenerationProviderMetadata: params.manifest.musicGenerationProviderMetadata,
		toolMetadata: params.manifest.toolMetadata,
		configContracts: params.manifest.configContracts,
		channelConfigs,
		...params.candidate.packageManifest?.channel?.id ? { channelCatalogMeta: {
			id: params.candidate.packageManifest.channel.id,
			...typeof params.candidate.packageManifest.channel.label === "string" ? { label: params.candidate.packageManifest.channel.label } : {},
			...typeof params.candidate.packageManifest.channel.blurb === "string" ? { blurb: params.candidate.packageManifest.channel.blurb } : {},
			...params.candidate.packageManifest.channel.preferOver ? { preferOver: params.candidate.packageManifest.channel.preferOver } : {},
			...packageChannelCommands ? { commands: packageChannelCommands } : {}
		} } : {}
	};
}
function buildBundleManifestRecord(params) {
	return {
		id: params.manifest.id,
		name: normalizeOptionalString(params.manifest.name) ?? params.candidate.idHint,
		description: normalizeOptionalString(params.manifest.description),
		...resolvePortablePluginIcons({
			rootDir: params.candidate.rootDir,
			rejectHardlinks: params.rejectHardlinks
		}),
		version: normalizeOptionalString(params.manifest.version),
		packageName: params.candidate.packageName,
		packageVersion: params.candidate.packageVersion,
		packageDescription: params.candidate.packageDescription,
		packageManifest: params.candidate.packageManifest,
		packageDependencies: params.candidate.packageDependencies,
		packageOptionalDependencies: params.candidate.packageOptionalDependencies,
		packageChannel: params.candidate.packageManifest?.channel,
		packageInstall: params.candidate.packageManifest?.install,
		format: "bundle",
		bundleFormat: params.candidate.bundleFormat,
		bundleCapabilities: params.manifest.capabilities,
		...params.manifest.onboardingSkill ? { onboardingSkill: params.manifest.onboardingSkill } : {},
		activation: params.manifest.activation,
		channels: [],
		providers: [],
		cliBackends: [],
		syntheticAuthRefs: [],
		nonSecretAuthMarkers: [],
		skills: params.manifest.skills ?? [],
		settingsFiles: params.manifest.settingsFiles ?? [],
		hooks: params.manifest.hooks ?? [],
		origin: params.candidate.origin,
		workspaceDir: params.candidate.workspaceDir,
		rootDir: params.candidate.rootDir,
		source: params.candidate.source,
		manifestPath: params.manifestPath,
		schemaCacheKey: void 0,
		configSchema: void 0,
		configUiHints: void 0,
		configContracts: void 0,
		channelConfigs: void 0
	};
}
//#endregion
//#region src/plugins/min-host-version.ts
/** Validation message for plugin minHostVersion manifest fields. */
const MIN_HOST_VERSION_FORMAT = "openclaw.install.minHostVersion must use a semver floor in the form \">=x.y.z[-prerelease][+build]\"";
const SEMVER_LABEL_RE = String.raw`\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?`;
const MIN_HOST_VERSION_RE = new RegExp(`^>=(${SEMVER_LABEL_RE})$`);
const LEGACY_MIN_HOST_VERSION_RE = new RegExp(`^(${SEMVER_LABEL_RE})$`);
/** Parses a plugin minHostVersion manifest field. */
function parseMinHostVersionRequirement(raw, options = {}) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return null;
	const match = trimmed.match(MIN_HOST_VERSION_RE) ?? (options.allowLegacyBareSemver ? trimmed.match(LEGACY_MIN_HOST_VERSION_RE) : null);
	if (!match) return null;
	const minimumLabel = match[1] ?? "";
	if (!valid(minimumLabel)) return null;
	return {
		raw: trimmed,
		minimumLabel
	};
}
/** Checks whether the current host satisfies a plugin minHostVersion requirement. */
function checkMinHostVersion(params) {
	if (params.minHostVersion === void 0) return {
		ok: true,
		requirement: null
	};
	const requirement = parseMinHostVersionRequirement(params.minHostVersion, { allowLegacyBareSemver: params.allowLegacyBareSemver });
	if (!requirement) return {
		ok: false,
		kind: "invalid",
		error: MIN_HOST_VERSION_FORMAT
	};
	const currentVersion = normalizeOptionalString(params.currentVersion) || "unknown";
	const comparison = compareOpenClawVersions(currentVersion, requirement.minimumLabel);
	if (comparison === null) return {
		ok: false,
		kind: "unknown_host_version",
		requirement
	};
	if (comparison < 0) return {
		ok: false,
		kind: "incompatible",
		requirement,
		currentVersion
	};
	return {
		ok: true,
		requirement
	};
}
//#endregion
//#region src/plugins/manifest-registry-build.ts
const PLUGIN_ORIGIN_RANK = {
	config: 0,
	workspace: 1,
	global: 2,
	bundled: 3
};
function rejectCaseFoldedIdCollisions(records, diagnostics) {
	const rejected = /* @__PURE__ */ new Set();
	for (const [policyId, matches] of groupPluginRecords(records, (record) => normalizePluginPolicyId(record.id))) {
		const declaredIds = [...new Set(matches.map((record) => record.id))].toSorted();
		if (declaredIds.length < 2) continue;
		const message = `plugin ids ${declaredIds.map((id) => JSON.stringify(id)).join(", ")} collide as normalized id ${JSON.stringify(policyId)}; refusing all colliding plugins`;
		for (const record of matches) {
			rejected.add(record);
			diagnostics.push({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message
			});
		}
	}
	return records.filter((record) => !rejected.has(record));
}
function pushNonBundledChannelConfigDescriptorDiagnostic(params) {
	if (params.record.origin === "bundled" || params.record.format === "bundle") return;
	const configuredEntry = params.normalized?.entries[params.record.id];
	if (params.normalized?.enabled === false || configuredEntry?.enabled === false || params.normalized?.deny.includes(params.record.id) || params.normalized?.allow.length && !params.normalized.allow.includes(params.record.id)) return;
	const declaredChannels = params.record.channels.map((channelId) => channelId.trim()).filter((channelId) => channelId.length > 0);
	if (declaredChannels.length === 0) return;
	const channelConfigs = params.record.channelConfigs ?? {};
	const missingChannels = declaredChannels.filter((channelId) => !Object.hasOwn(channelConfigs, channelId));
	if (missingChannels.length === 0) return;
	const safeMissingChannels = missingChannels.map(sanitizeForLog);
	params.diagnostics.push({
		level: "warn",
		pluginId: sanitizeForLog(params.record.id),
		source: sanitizeForLog(params.record.manifestPath),
		message: `channel plugin manifest declares ${safeMissingChannels.join(", ")} without channelConfigs metadata; add openclaw.plugin.json#channelConfigs so config schema and setup surfaces work before runtime loads. Channels without channelConfigs still appear in channel listings, but setup UI may be limited.`
	});
}
function dedupePluginDiagnostics(diagnostics, discoveryDiagnostics) {
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const diagnostic of diagnostics) {
		const key = JSON.stringify([
			diagnostic.level,
			diagnostic.pluginId ?? "",
			diagnostic.message,
			diagnostic.level === "error" || discoveryDiagnostics.has(diagnostic) ? diagnostic.source ?? "" : ""
		]);
		if (seen.has(key)) continue;
		seen.add(key);
		deduped.push(diagnostic);
	}
	return deduped;
}
function isStaleForeignBundledPin(params) {
	return isForeignBundledPluginRoot(params.candidate.rootDir, params.env) && !isBundledPluginInsideDevSourceRoot({
		rootDir: params.candidate.rootDir,
		env: params.env
	});
}
function resolveDuplicatePrecedenceRank(params) {
	if (params.candidate.origin === "config" || params.candidate.configSelected) return 0;
	if (params.candidate.origin === "bundled" && isBundledPluginInsideDevSourceRoot({
		rootDir: params.candidate.rootDir,
		env: params.env
	})) return 1;
	if (params.candidate.origin === "global" && !isStaleForeignBundledPin({
		candidate: params.candidate,
		env: params.env
	}) && matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.candidate,
		config: params.config,
		env: params.env,
		installRecords: params.installRecords
	})) return 2;
	if (params.candidate.origin === "bundled") return 3;
	if (params.candidate.origin === "workspace") return 4;
	return 5;
}
function isIntentionalInstalledBundledDuplicate(params) {
	const leftIsInstalled = matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.left,
		config: params.config,
		env: params.env,
		installRecords: params.installRecords
	});
	const rightIsInstalled = matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.right,
		config: params.config,
		env: params.env,
		installRecords: params.installRecords
	});
	return leftIsInstalled && !isStaleForeignBundledPin({
		candidate: params.left,
		env: params.env
	}) && params.right.origin === "bundled" && !isBundledPluginInsideDevSourceRoot({
		rootDir: params.right.rootDir,
		env: params.env
	}) || rightIsInstalled && !isStaleForeignBundledPin({
		candidate: params.right,
		env: params.env
	}) && params.left.origin === "bundled" && !isBundledPluginInsideDevSourceRoot({
		rootDir: params.left.rootDir,
		env: params.env
	});
}
function isSameGlobalPackageDuplicate(left, right) {
	if (left.origin !== "global" || right.origin !== "global") return false;
	const leftPackageName = normalizeOptionalString(left.packageName);
	const rightPackageName = normalizeOptionalString(right.packageName);
	if (!leftPackageName || leftPackageName !== rightPackageName) return false;
	const leftPackageVersion = normalizeOptionalString(left.packageVersion);
	const rightPackageVersion = normalizeOptionalString(right.packageVersion);
	return Boolean(leftPackageVersion && rightPackageVersion && leftPackageVersion === rightPackageVersion);
}
function buildPluginManifestRegistry(params) {
	const config = params.config ?? {};
	const normalized = normalizePluginsConfigWithResolverCore(config.plugins);
	const env = params.env ?? process.env;
	const registryPath = params.registryPath ?? resolveInstalledPluginIndexStorePath({ env });
	const { getInstallRecords } = params;
	const discovery = params.candidates ? {
		candidates: params.candidates,
		diagnostics: params.diagnostics ?? []
	} : params.discovery ?? discoverOpenClawPlugins({
		workspaceDir: params.workspaceDir,
		extraPaths: normalized.loadPaths,
		env,
		installRecords: getInstallRecords()
	});
	const discovered = new Set(discovery.diagnostics);
	const diagnostics = [...discovered];
	const candidates = discovery.candidates.toSorted((left, right) => Number(right.origin === "config" || right.configSelected === true) - Number(left.origin === "config" || left.configSelected === true));
	const seenIds = /* @__PURE__ */ new Map();
	const manifestWarnings = /* @__PURE__ */ new Map();
	const reportedExplicitOverrides = /* @__PURE__ */ new Set();
	const currentHostVersion = resolveCompatibilityHostVersion(env);
	const explicitConfiguredFileSources = new Set(normalized.loadPaths.map((loadPath) => resolveUserPath(loadPath, env)).filter((loadPath) => pluginCacheStatSync(loadPath)?.isFile() === true).map((loadPath) => path.resolve(loadPath)));
	for (const candidate of candidates) {
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: candidate.origin,
			rootDir: candidate.rootDir,
			env
		});
		const isBundleRecord = (candidate.format ?? "openclaw") === "bundle";
		const isManifestlessConfiguredFile = candidate.origin === "config" && explicitConfiguredFileSources.has(path.resolve(candidate.source)) && !pluginCacheExistsSync(path.join(candidate.rootDir, "openclaw.plugin.json"));
		if (isManifestlessConfiguredFile && isCoreReservedPluginId(candidate.idHint)) {
			diagnostics.push({
				level: "error",
				pluginId: candidate.idHint,
				source: candidate.source,
				message: `plugin manifest id "${candidate.idHint}" is reserved by OpenClaw core`
			});
			continue;
		}
		const manifestRes = candidate.origin === "bundled" && candidate.bundledManifest && candidate.bundledManifestPath ? {
			ok: true,
			manifest: candidate.bundledManifest,
			manifestPath: candidate.bundledManifestPath
		} : isBundleRecord && candidate.bundleFormat ? loadBundleManifest({
			rootDir: candidate.rootDir,
			bundleFormat: candidate.bundleFormat,
			rejectHardlinks
		}) : isManifestlessConfiguredFile ? {
			ok: true,
			manifest: {
				id: candidate.idHint,
				configSchema: {
					type: "object",
					additionalProperties: false
				},
				activation: { onStartup: true }
			},
			manifestPath: candidate.source
		} : loadPluginManifest(candidate.rootDir, rejectHardlinks);
		if (!manifestRes.ok) {
			diagnostics.push({
				level: "error",
				pluginId: candidate.diagnosticIdHint ?? candidate.idHint,
				message: manifestRes.error,
				source: manifestRes.manifestPath,
				..."diagnosticCode" in manifestRes && manifestRes.diagnosticCode ? { code: manifestRes.diagnosticCode } : {}
			});
			continue;
		}
		if ("warnings" in manifestRes && manifestRes.warnings) manifestWarnings.set(manifestRes.manifestPath, manifestRes.warnings);
		const manifest = manifestRes.manifest;
		const effectivePluginId = candidate.effectivePluginId ?? manifest.id;
		if (candidate.origin !== "bundled") {
			const packageManifestSource = path.join(candidate.packageDir ?? candidate.rootDir, "package.json");
			const allowLegacyBareMinHostVersion = candidate.origin === "global" && matchesInstalledPluginRecord({
				pluginId: effectivePluginId,
				candidate,
				config,
				env,
				installRecords: getInstallRecords()
			});
			const minHostVersionCheck = checkMinHostVersion({
				currentVersion: currentHostVersion,
				minHostVersion: candidate.packageManifest?.install?.minHostVersion,
				allowLegacyBareSemver: allowLegacyBareMinHostVersion
			});
			if (!minHostVersionCheck.ok) {
				diagnostics.push({
					level: minHostVersionCheck.kind === "invalid" ? "error" : "warn",
					pluginId: effectivePluginId,
					source: packageManifestSource,
					message: minHostVersionCheck.kind === "invalid" ? `plugin manifest invalid | ${minHostVersionCheck.error}` : minHostVersionCheck.kind === "unknown_host_version" ? `plugin requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host version could not be determined; skipping load` : `plugin requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host is ${minHostVersionCheck.currentVersion}; skipping load`
				});
				continue;
			}
			const packagePluginApiRangeCheck = resolvePackagePluginApiRange(candidate.packageManifest);
			if (!packagePluginApiRangeCheck.ok) {
				diagnostics.push({
					level: "error",
					pluginId: effectivePluginId,
					source: packageManifestSource,
					message: `plugin manifest invalid | ${packagePluginApiRangeCheck.error}`
				});
				continue;
			}
			const packagePluginApiRange = packagePluginApiRangeCheck.range;
			if (packagePluginApiRange && !satisfiesPluginApiRange(currentHostVersion, packagePluginApiRange)) {
				diagnostics.push({
					level: "warn",
					configDisposition: "preserve",
					pluginId: effectivePluginId,
					source: packageManifestSource,
					message: `plugin requires plugin API ${packagePluginApiRange}, but this host is ${currentHostVersion}; skipping load (check "openclaw --version", OPENCLAW_COMPATIBILITY_HOST_VERSION, or run "openclaw doctor")`
				});
				continue;
			}
		}
		const configSchema = "configSchema" in manifest ? manifest.configSchema : void 0;
		const schemaCacheKey = (() => {
			if (!configSchema || isManifestlessConfiguredFile) return;
			const file = readPluginCacheFile({
				rootDir: candidate.rootDir,
				relativePath: path.relative(candidate.rootDir, manifestRes.manifestPath),
				rejectHardlinks,
				maxBytes: 262144
			});
			return file.ok ? `${manifestRes.manifestPath}:${file.hash}` : manifestRes.manifestPath;
		})();
		const record = isBundleRecord ? buildBundleManifestRecord({
			manifest,
			candidate,
			manifestPath: manifestRes.manifestPath,
			rejectHardlinks
		}) : buildPluginManifestRecord({
			manifest,
			candidate,
			manifestPath: manifestRes.manifestPath,
			diagnostics,
			rejectHardlinks,
			schemaCacheKey,
			configSchema,
			trust: resolvePluginTrust({
				registryPath,
				pluginId: effectivePluginId,
				candidate,
				env,
				installRecords: getInstallRecords()
			}),
			...params.bundledChannelConfigCollector ? { bundledChannelConfigCollector: params.bundledChannelConfigCollector } : {}
		});
		if (candidate.sourcePreferred || candidate.origin === "bundled" && candidate.configSelected) record.sourcePreferred = true;
		recordPluginManifestInstallOwner(record, resolvePluginCandidateInstallOwner(candidate), isPluginCandidateInstallOwnerAmbiguous(candidate));
		const existing = seenIds.get(effectivePluginId);
		if (existing) {
			const samePath = existing.candidate.rootDir === candidate.rootDir;
			if ((() => {
				if (samePath) return true;
				const existingReal = pluginCacheRealpathSync(existing.candidate.rootDir);
				const candidateReal = pluginCacheRealpathSync(candidate.rootDir);
				return Boolean(existingReal && candidateReal && existingReal === candidateReal);
			})()) {
				if (record.sourcePreferred || existing.record.sourcePreferred) {
					record.sourcePreferred = true;
					existing.record.sourcePreferred = true;
				}
				if (PLUGIN_ORIGIN_RANK[candidate.origin] < PLUGIN_ORIGIN_RANK[existing.candidate.origin]) seenIds.set(effectivePluginId, {
					candidate,
					record
				});
				continue;
			}
			const candidateRank = resolveDuplicatePrecedenceRank({
				pluginId: effectivePluginId,
				candidate,
				config,
				env,
				installRecords: getInstallRecords()
			});
			const existingRank = resolveDuplicatePrecedenceRank({
				pluginId: effectivePluginId,
				candidate: existing.candidate,
				config,
				env,
				installRecords: getInstallRecords()
			});
			const candidateWins = candidateRank < existingRank;
			const winnerCandidate = candidateWins ? candidate : existing.candidate;
			const overriddenCandidate = candidateWins ? existing.candidate : candidate;
			if (candidateWins) seenIds.set(effectivePluginId, {
				candidate,
				record
			});
			if (isIntentionalInstalledBundledDuplicate({
				pluginId: effectivePluginId,
				left: candidate,
				right: existing.candidate,
				config,
				env,
				installRecords: getInstallRecords()
			})) continue;
			if (isSameGlobalPackageDuplicate(candidate, existing.candidate)) continue;
			const staleForeignPin = winnerCandidate.origin === "bundled" && isStaleForeignBundledPin({
				candidate: overriddenCandidate,
				env
			}) && matchesInstalledPluginRecord({
				pluginId: effectivePluginId,
				candidate: overriddenCandidate,
				env,
				installRecords: getInstallRecords()
			});
			const explicitOverride = !staleForeignPin && Math.min(candidateRank, existingRank) === 0 && candidateRank !== existingRank;
			if (explicitOverride) {
				if (reportedExplicitOverrides.has(effectivePluginId)) continue;
				reportedExplicitOverrides.add(effectivePluginId);
			}
			diagnostics.push({
				level: explicitOverride ? "info" : "warn",
				...explicitOverride ? { code: "explicit-config-plugin-selection" } : {},
				pluginId: effectivePluginId,
				source: overriddenCandidate.source,
				message: staleForeignPin ? `stale plugin install record: "${effectivePluginId}" is pinned to ${overriddenCandidate.rootDir}, which belongs to a different OpenClaw installation. This installation's bundled plugin is being used instead. No uninstall is needed to use the bundled plugin. Uninstalling, even with \`--keep-files\`, removes plugin configuration; re-enabling does not restore it.` : explicitOverride ? `duplicate plugin id resolved by explicit config-selected plugin; ${overriddenCandidate.origin} plugin will be overridden by config plugin (${winnerCandidate.source})` : `duplicate plugin id detected; ${overriddenCandidate.origin} plugin will be overridden by ${winnerCandidate.origin} plugin (${winnerCandidate.source})`
			});
			continue;
		}
		seenIds.set(effectivePluginId, {
			candidate,
			record
		});
	}
	const plugins = rejectCaseFoldedIdCollisions([...seenIds.values()].map(({ record }) => record), diagnostics);
	for (const record of plugins) {
		for (const warning of manifestWarnings.get(record.manifestPath) ?? []) diagnostics.push({
			level: "warn",
			pluginId: sanitizeForLog(record.id),
			source: sanitizeForLog(record.manifestPath),
			message: sanitizeForLog(warning)
		});
		pushNonBundledChannelConfigDescriptorDiagnostic({
			record,
			diagnostics,
			normalized
		});
	}
	return {
		plugins,
		diagnostics: dedupePluginDiagnostics(diagnostics, discovered)
	};
}
//#endregion
//#region src/plugins/manifest-registry.ts
function loadPluginManifestRegistryCore(params = {}) {
	if (!params.candidates && !params.discovery && !params.installRecords) {
		const gatewaySnapshot = getGatewayPluginMetadataSnapshot();
		if (gatewaySnapshot) return gatewaySnapshot.manifestRegistry;
	}
	const env = params.env ?? process.env;
	let installRecords = params.installRecords;
	return buildPluginManifestRegistry({
		...params,
		env,
		getInstallRecords: () => installRecords ??= loadInstalledPluginIndexInstallRecordsSync({ env })
	});
}
//#endregion
//#region src/plugins/manifest-registry-installed.ts
function resolveInstalledManifestRegistryIndexFingerprint(index) {
	const facts = getInstalledPluginIndexFacts(index);
	const cached = facts?.fingerprint;
	if (cached) return cached;
	const fingerprint = hashStableJson({
		version: index.version,
		hostContractVersion: index.hostContractVersion,
		compatRegistryVersion: index.compatRegistryVersion,
		migrationVersion: index.migrationVersion,
		policyHash: index.policyHash,
		installRecords: index.installRecords,
		diagnostics: index.diagnostics,
		plugins: index.plugins.map(({ doctorContractFile: _doctorContractFile, sourceAdmissions: _sourceAdmissions, packageBuild, ...plugin }) => ({
			...plugin,
			...packageBuild?.bundledDist === void 0 ? {} : { packageBuild: { bundledDist: packageBuild.bundledDist } }
		}))
	});
	if (facts) facts.fingerprint = fingerprint;
	return fingerprint;
}
//#endregion
//#region src/plugins/plugin-control-plane-context.ts
function resolvePluginDiscoveryContext(params = {}) {
	const paths = params.config?.plugins?.load?.paths;
	return resolvePluginCacheInputs({
		env: params.env ?? process.env,
		workspaceDir: params.workspaceDir,
		loadPaths: params.loadPaths ?? (Array.isArray(paths) ? paths : void 0)
	});
}
/** Resolves a stable fingerprint for plugin control-plane activation state. */
function resolvePluginControlPlaneFingerprint(params = {}) {
	const inventoryFingerprint = params.inventoryFingerprint ?? (params.index ? resolveInstalledManifestRegistryIndexFingerprint(params.index) : void 0);
	return hashJson({
		discovery: resolvePluginDiscoveryContext(params),
		policyFingerprint: params.policyHash ?? resolveInstalledPluginIndexPolicyHash(params.config, params.env),
		...inventoryFingerprint ? { inventoryFingerprint } : {},
		...params.activationFingerprint ? { activationFingerprint: params.activationFingerprint } : {}
	});
}
//#endregion
//#region src/plugins/plugin-metadata-env.ts
const PLUGIN_METADATA_ENV_KEYS = [
	"ANDROID_DATA",
	"APPDATA",
	"HOME",
	"OPENCLAW_BUNDLED_PLUGINS_DIR",
	"OPENCLAW_COMPATIBILITY_HOST_VERSION",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_DEV_SOURCE_ROOT",
	"OPENCLAW_DISABLE_BUNDLED_PLUGINS",
	"OPENCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS",
	"OPENCLAW_HOME",
	"OPENCLAW_NIX_MODE",
	"OPENCLAW_STATE_DIR",
	"PREFIX",
	"USERPROFILE",
	"XDG_CONFIG_HOME"
];
/** Compares discovery namespaces without resolving or probing filesystem roots. */
function resolvePluginMetadataEnvFingerprint(env = process.env) {
	return hashJson({
		env: Object.fromEntries(PLUGIN_METADATA_ENV_KEYS.flatMap((key) => {
			const value = env[key];
			return value === void 0 ? [] : [[key, value]];
		})),
		installRoots: hasActivePluginInstallRoots() ? resolveActivePluginInstallRoots() : void 0,
		trustBundledPluginsDirOverride: shouldTrustTestBundledPluginsDirOverride(env),
		cwd: tryProcessCwd()
	});
}
//#endregion
//#region src/plugins/plugin-scope.ts
/** Normalizes plugin id scope input into a sorted unique string list. */
function normalizePluginIdScope(ids) {
	return ids === void 0 ? void 0 : normalizeSortedUniqueTrimmedStringList(ids);
}
/** Serializes plugin scope for cache keys. */
function serializePluginIdScope(ids) {
	return ids === void 0 ? "__unscoped__" : JSON.stringify(ids);
}
//#endregion
//#region src/plugins/current-plugin-metadata-snapshot.ts
function resolveAgentWorkspaceFingerprint(config, env) {
	return JSON.stringify(listAgentWorkspaceDirs(config, env));
}
function prepareCurrentPluginMetadataSnapshotPublication(snapshot, options, owner = "operation") {
	const fingerprint = (config, policyHash) => resolvePluginControlPlaneFingerprint({
		config,
		env: options.env,
		index: snapshot.index,
		policyHash,
		workspaceDir: options.workspaceDir ?? snapshot.workspaceDir
	});
	const compatiblePolicyHashes = options.compatibleConfigs?.map((config) => resolveInstalledPluginIndexPolicyHash(config, options.env));
	const compatibleConfigFingerprints = options.compatibleConfigs?.map((config, index) => fingerprint(config, compatiblePolicyHashes?.[index]));
	const configFingerprint = fingerprint(options.config, snapshot.policyHash);
	const defaultDiscoveryConfigFingerprint = fingerprint({}, snapshot.policyHash);
	const defaultDiscoveryCompatible = configFingerprint === defaultDiscoveryConfigFingerprint || snapshot.configFingerprint === defaultDiscoveryConfigFingerprint || Boolean(compatibleConfigFingerprints?.includes(defaultDiscoveryConfigFingerprint));
	const envFingerprint = resolvePluginMetadataEnvFingerprint(options.env);
	const agentWorkspaceFingerprint = owner === "gateway" && options.config ? resolveAgentWorkspaceFingerprint(options.config, options.env) : void 0;
	const configIdentities = [...options.compatibleConfigs ?? []];
	if (options.config) {
		const policyHash = resolveInstalledPluginIndexPolicyHash(options.config, options.env);
		if (policyHash === snapshot.policyHash || Boolean(compatiblePolicyHashes?.includes(policyHash))) configIdentities.push(options.config);
	}
	return () => {
		if (getCurrentPluginMetadataSnapshotState().owner === "gateway" && owner !== "gateway") throw new Error("Gateway plugin metadata can only be replaced after shutdown");
		currentPluginMetadataConfigIdentityCache.clear();
		setCurrentPluginMetadataSnapshotState(snapshot, configFingerprint, compatiblePolicyHashes, compatibleConfigFingerprints, owner === "gateway" || defaultDiscoveryCompatible ? snapshot.owners.modelIdNormalizationPolicies : void 0, owner, envFingerprint, defaultDiscoveryCompatible, agentWorkspaceFingerprint);
		for (const config of configIdentities) currentPluginMetadataConfigIdentityCache.add(config);
	};
}
/** Publishes a prepared CLI snapshot without displacing a lifecycle owner. */
function adoptCurrentPluginMetadataSnapshotIfAbsent(snapshot, options = {}) {
	if (getScopedPluginCache()?.kind === "operation" || getCurrentPluginMetadataSnapshotState().snapshot !== void 0) return;
	prepareCurrentPluginMetadataSnapshotPublication(snapshot, options)();
}
/** Installation revokes operation facts even when it runs between metadata scopes. */
function revokeCurrentPluginMetadataSnapshotScopes() {
	const caches = new Set(getScopedPluginCaches());
	const runtimeCaches = /* @__PURE__ */ new Set();
	for (let scoped = getPluginExecutionFrame()?.metadataScope; scoped; scoped = scoped.parent) if (scoped.immutableRuntimeGeneration) runtimeCaches.add(scoped.cache);
	else caches.add(scoped.cache);
	for (const cache of caches) if (cache.kind === "operation" && !runtimeCaches.has(cache)) invalidatePluginCacheMetadata(cache);
}
function isScopedSnapshotInCurrentCache(scoped) {
	if (!scoped.immutableRuntimeGeneration && scoped.metadata !== scoped.cache.metadata) return false;
	const cache = getScopedPluginCache();
	return cache?.kind !== "operation" || scoped.cache === cache;
}
const NEEDS_PREPARED_POLICY = Symbol("needs-prepared-policy");
function resolveCompatiblePluginMetadataSnapshot(candidate, params, options = {}) {
	const snapshot = candidate.snapshot;
	if (!snapshot) return;
	if (candidate.immutableRuntimeGeneration) return snapshot;
	const env = params.env ?? process.env;
	if (candidate.envFingerprint !== resolvePluginMetadataEnvFingerprint(env)) return;
	const requestedPluginIds = normalizePluginIdScope(params.pluginIds ?? params.pluginIdScope?.resolve({ index: snapshot.index }));
	const snapshotPluginIds = normalizePluginIdScope(snapshot.pluginIds);
	if (requestedPluginIds !== void 0 && serializePluginIdScope(snapshotPluginIds) !== serializePluginIdScope(requestedPluginIds)) return;
	if (snapshotPluginIds !== void 0 && requestedPluginIds === void 0 && params.allowScopedSnapshot !== true) return;
	const requestedWorkspaceDir = params.workspaceDir ?? (params.allowWorkspaceScopedSnapshot === true || options.scopedOwnerContext === true ? snapshot.workspaceDir : void 0);
	if (snapshot.workspaceDir !== void 0 && requestedWorkspaceDir === void 0) return;
	if (requestedWorkspaceDir !== void 0 && (snapshot.workspaceDir ?? "") !== (requestedWorkspaceDir ?? "")) return;
	const canReuseCachedConfig = Boolean(params.config && candidate.hasConfigIdentity?.(params.config));
	if (canReuseCachedConfig && params.requireDefaultDiscoveryContext !== true) return snapshot;
	if (params.config && !canReuseCachedConfig && params.allowSynchronousPolicyRead === false) return NEEDS_PREPARED_POLICY;
	const requestedPolicyHash = params.config && !canReuseCachedConfig ? resolveInstalledPluginIndexPolicyHash(params.config, params.env) : void 0;
	if (requestedPolicyHash && snapshot.policyHash !== requestedPolicyHash) {
		if (!candidate.compatiblePolicyHashes?.includes(requestedPolicyHash)) return;
	}
	if (params.config && !canReuseCachedConfig) {
		const requestedConfigFingerprint = resolvePluginControlPlaneFingerprint({
			config: params.config,
			env,
			index: snapshot.index,
			policyHash: requestedPolicyHash,
			workspaceDir: requestedWorkspaceDir
		});
		if (!(candidate.configFingerprint === requestedConfigFingerprint || snapshot.configFingerprint === requestedConfigFingerprint || Boolean(candidate.compatibleConfigFingerprints?.includes(requestedConfigFingerprint)))) return;
	}
	if (params.requireDefaultDiscoveryContext === true && options.scopedOwnerContext !== true && candidate.defaultDiscoveryCompatible !== true) return;
	return snapshot;
}
function getCurrentPluginMetadataSnapshot(params = {}) {
	for (let scoped = getPluginExecutionFrame()?.metadataScope; scoped; scoped = scoped.parent) {
		if (!isScopedSnapshotInCurrentCache(scoped)) continue;
		const compatibleScoped = resolveCompatiblePluginMetadataSnapshot(scoped, params, { scopedOwnerContext: true });
		if (compatibleScoped === NEEDS_PREPARED_POLICY) return;
		if (compatibleScoped) return compatibleScoped;
	}
	const scopedCache = getScopedPluginCache();
	if (scopedCache && scopedCache !== getProcessPluginCache()) return;
	const state = getCurrentPluginMetadataSnapshotState();
	const compatible = resolveCompatiblePluginMetadataSnapshot({
		...state,
		hasConfigIdentity: (config) => currentPluginMetadataConfigIdentityCache.has(config),
		immutableRuntimeGeneration: state.owner === "gateway"
	}, params);
	return compatible === NEEDS_PREPARED_POLICY ? void 0 : compatible;
}
registerPluginMetadataSnapshotReaders({
	adoptCurrentPluginMetadataSnapshotIfAbsent,
	getCurrentPluginMetadataSnapshot
});
registerPluginMetadataProcessMemoLifecycleClear(revokeCurrentPluginMetadataSnapshotScopes, { owner: "operation" });
//#endregion
//#region src/utils/run-with-concurrency.ts
/** Runs async tasks with bounded concurrency while preserving result indexes. */
async function runTasksWithConcurrency(params) {
	const { tasks, limit, onTaskError, throwOnError = false } = params;
	const errorMode = params.errorMode ?? "continue";
	if (tasks.length === 0) return {
		results: [],
		firstError: void 0,
		hasError: false
	};
	const resolvedLimit = Number.isFinite(limit) ? Math.max(1, Math.min(Math.floor(limit), tasks.length)) : tasks.length;
	const results = Array.from({ length: tasks.length });
	let firstError = void 0;
	let hasError = false;
	return new Promise((resolve, reject) => {
		const runOne = async (task, index) => {
			if (errorMode === "stop" && hasError) return;
			try {
				results[index] = await task();
			} catch (error) {
				if (!hasError) {
					firstError = error;
					hasError = true;
				}
				let rejectionError = error;
				try {
					onTaskError?.(error, index);
				} catch (callbackError) {
					rejectionError = callbackError;
				}
				if (throwOnError) reject(rejectionError);
			}
		};
		const mapper = AsyncLocalStorage.bind((task, index) => Promise.resolve().then(() => runOne(task, index)));
		pMap(tasks.slice(), mapper, { concurrency: resolvedLimit }).then(() => resolve({
			results,
			firstError,
			hasError
		}), reject);
	});
}
//#endregion
//#region src/secrets/exec-provider-path-validation.ts
/** Checks the same command-path trust boundary before validation, writes, and execution. */
async function assertSecureExecCommandPath(params) {
	const commandPath = resolveUserPath(params.command);
	if (!commandPath) throw new Error(`${params.label} must be an absolute path.`);
	const stat = await safeStat(commandPath);
	if (!stat.ok) throw new Error(`${params.label} is not readable: ${commandPath}`);
	if (stat.isDir) throw new Error(`${params.label} must be a file: ${commandPath}`);
	if (stat.isSymlink) throw new Error(`${params.label} must not be a symlink: ${commandPath}`);
	if (params.trustedDirs && params.trustedDirs.length > 0) {
		if (!params.trustedDirs.map((entry) => resolveUserPath(entry)).some((dir) => isPathInside(dir, commandPath))) throw new Error(`${params.label} is outside trustedDirs: ${commandPath}`);
	}
	const perms = await inspectPathPermissions(commandPath);
	if (!perms.ok) throw new Error(`${params.label} permissions could not be verified: ${commandPath}`);
	if (perms.worldWritable || perms.groupWritable) throw new Error(`${params.label} permissions are too open: ${commandPath}`);
	if (process.platform === "win32" && perms.source === "unknown") throw new FsSafeError("permission-unverified", `${params.label} ACL verification unavailable on Windows for ${commandPath}. Move the command to a path whose ACLs OpenClaw can verify; there is no provider-level bypass.`);
	if (process.platform !== "win32" && typeof process.getuid === "function" && stat.uid != null) {
		const uid = process.getuid();
		if (stat.uid !== uid) throw new Error(`${params.label} must be owned by the current user (uid=${uid}): ${commandPath}`);
	}
	return commandPath;
}
//#endregion
//#region src/secrets/json-pointer.ts
/** JSON Pointer token helpers for file-backed secret refs. */
function failOrUndefined(params) {
	if (params.onMissing === "throw") throw new Error(params.message);
}
function decodeJsonPointerToken(token) {
	return token.replace(/~1/g, "/").replace(/~0/g, "~");
}
/**
* Reads a value from a JSON-like document using an absolute JSON Pointer.
* Missing segments throw by default; `onMissing: "undefined"` is for optional probes.
*/
function readJsonPointer(root, pointer, options = {}) {
	const onMissing = options.onMissing ?? "throw";
	if (!pointer.startsWith("/")) return failOrUndefined({
		onMissing,
		message: "File-backed secret ids must be absolute JSON pointers (for example: \"/providers/openai/apiKey\")."
	});
	const tokens = pointer.slice(1).split("/").map((token) => decodeJsonPointerToken(token));
	let current = root;
	for (const token of tokens) {
		if (Array.isArray(current)) {
			const index = parseConfigPathArrayIndex(token);
			if (index === void 0 || index >= current.length) return failOrUndefined({
				onMissing,
				message: `JSON pointer segment "${token}" is out of bounds.`
			});
			current = current[index];
			continue;
		}
		if (!isRecord(current) || !Object.hasOwn(current, token)) return failOrUndefined({
			onMissing,
			message: `JSON pointer segment "${token}" does not exist.`
		});
		current = current[token];
	}
	return current;
}
//#endregion
//#region src/plugins/manifest-owner-policy.ts
/** Resolves whether a manifest owner plugin is effectively activated. */
function isActivatedManifestOwner(params) {
	return resolveEffectivePluginActivationState({
		id: params.plugin.id,
		origin: params.plugin.origin,
		channelIds: params.plugin.channels,
		config: params.normalizedConfig,
		rootConfig: params.rootConfig,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin)
	}).activated;
}
//#endregion
//#region src/secrets/provider-integrations.ts
/** Materializes trusted plugin secret-provider integrations into exec provider configs. */
const NODE_COMMAND_PLACEHOLDER = "${node}";
function resolvePluginRelativePath(value, pluginRoot) {
	const resolved = path.resolve(pluginRoot, value);
	return isPathInside$2(pluginRoot, resolved) ? resolved : void 0;
}
function resolveArg(arg, pluginRoot) {
	if (!arg.startsWith("./") && !arg.startsWith("../")) return arg;
	return resolvePluginRelativePath(arg, pluginRoot);
}
function isSecurePosixPathStat(stat) {
	if (process.platform === "win32") return true;
	if ((stat.mode & 18) !== 0) return false;
	if (typeof process.getuid !== "function" || typeof stat.uid !== "number") return true;
	const uid = process.getuid();
	return stat.uid === uid || stat.uid === 0;
}
function resolveNodeEntrypointArg(params) {
	const entrypoint = params.integration.args?.[0];
	if (!entrypoint?.startsWith("./")) return;
	const resolved = resolvePluginRelativePath(entrypoint, params.pluginRoot);
	if (!resolved) return;
	try {
		const opened = openRootFileSync({
			absolutePath: resolved,
			rootPath: params.pluginRoot,
			boundaryLabel: "plugin root",
			rejectHardlinks: params.rejectHardlinks,
			symlinks: process.platform === "win32" ? "follow-parents-within-root" : "reject"
		});
		if (!opened.ok) return;
		try {
			if (!isSecurePosixPathStat(opened.stat)) return;
			if (process.platform !== "win32") for (let directory = path.dirname(opened.path);; directory = path.dirname(directory)) {
				const stat = fsSync.lstatSync(directory);
				if (!stat.isDirectory() || !isSecurePosixPathStat(stat)) return;
				if (directory === opened.rootRealPath) break;
			}
			return opened.path;
		} finally {
			fsSync.closeSync(opened.fd);
		}
	} catch {
		return;
	}
}
function materializeExecProviderConfig(integration, record, env) {
	const pluginRoot = record.rootDir;
	if (integration.command !== NODE_COMMAND_PLACEHOLDER) return;
	const nodeEntrypoint = resolveNodeEntrypointArg({
		integration,
		pluginRoot,
		rejectHardlinks: shouldRejectHardlinkedPluginFiles({
			origin: record.origin,
			rootDir: pluginRoot,
			env
		})
	});
	if (!nodeEntrypoint) return;
	const args = integration.args?.map((arg, index) => index === 0 ? nodeEntrypoint : resolveArg(arg, pluginRoot)).filter((arg) => arg !== void 0);
	if (integration.args && args?.length !== integration.args.length) return;
	return {
		source: "exec",
		command: process.execPath,
		...args ? { args: [...resolveRuntimeArgs(), ...args] } : {},
		...integration.timeoutMs !== void 0 ? { timeoutMs: integration.timeoutMs } : {},
		...integration.noOutputTimeoutMs !== void 0 ? { noOutputTimeoutMs: integration.noOutputTimeoutMs } : {},
		...integration.maxOutputBytes !== void 0 ? { maxOutputBytes: integration.maxOutputBytes } : {},
		...integration.jsonOnly === false ? { jsonOnly: false } : {},
		...integration.env ? { env: integration.env } : {},
		...integration.passEnv ? { passEnv: integration.passEnv } : {},
		trustedDirs: [.../* @__PURE__ */ new Set([path.dirname(process.execPath), pluginRoot])]
	};
}
function canExposeSecretProviderIntegrations(params) {
	if (params.record.origin !== "bundled" && params.record.origin !== "global") return false;
	return isActivatedManifestOwner({
		plugin: params.record,
		normalizedConfig: params.normalizedConfig,
		rootConfig: params.config
	});
}
/** Narrows a secret provider config to the plugin-integration exec shape. */
function isPluginIntegrationSecretProviderConfig(value) {
	return typeof value === "object" && value !== null && "source" in value && value.source === "exec" && "pluginIntegration" in value && typeof value.pluginIntegration === "object" && value.pluginIntegration !== null && "pluginId" in value.pluginIntegration && typeof value.pluginIntegration.pluginId === "string" && value.pluginIntegration.pluginId.trim().length > 0 && "integrationId" in value.pluginIntegration && typeof value.pluginIntegration.integrationId === "string" && value.pluginIntegration.integrationId.trim().length > 0;
}
/** Materializes an active trusted plugin secret-provider integration into an exec provider. */
function resolveSecretProviderIntegrationConfig(params) {
	const config = params.config ?? {};
	const normalizedConfig = normalizePluginsConfig(config.plugins);
	const env = params.env ?? process.env;
	const { pluginId, integrationId } = params.providerConfig.pluginIntegration;
	if (!isValidSecretProviderAlias(params.providerAlias)) return {
		ok: false,
		reason: `provider alias "${params.providerAlias}" is invalid`
	};
	const record = params.manifestRegistry.plugins.find((candidate) => candidate.id === pluginId);
	if (!record) return {
		ok: false,
		reason: `plugin "${pluginId}" is not installed`
	};
	if (!canExposeSecretProviderIntegrations({
		record,
		normalizedConfig,
		config
	})) return {
		ok: false,
		reason: `plugin "${pluginId}" is not active or is not from a trusted install origin`
	};
	const integration = record.secretProviderIntegrations?.[integrationId];
	if (!integration) return {
		ok: false,
		reason: `plugin "${record.id}" does not declare secret provider integration "${integrationId}"`
	};
	const materialized = materializeExecProviderConfig(integration, record, env);
	if (!materialized) return {
		ok: false,
		reason: `plugin "${record.id}" integration "${integrationId}" could not be materialized`
	};
	return {
		ok: true,
		providerConfig: materialized
	};
}
//#endregion
//#region src/secrets/sentinel.ts
const SECRET_SENTINEL_SOURCE = "oc-sent-v2\\.[A-Za-z0-9_-]+\\.end";
11 + Math.ceil(262288 / 3) + 4;
new RegExp(SECRET_SENTINEL_SOURCE, "g");
const secretSentinelKeys = resolveGlobalSingleton(Symbol.for("openclaw.secretSentinel.keys"), () => ({ keys: randomBytes(64) })).keys;
secretSentinelKeys.subarray(0, 32);
secretSentinelKeys.subarray(32);
//#endregion
//#region src/secrets/store/secret-store-validation.ts
function assertSecretStoreEnvName(name) {
	if (!ENV_SECRET_REF_ID_RE.test(name)) throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", `Secret store name must match ${String(ENV_SECRET_REF_ID_RE)}.`);
}
createSubsystemLogger("secrets/store");
async function readSecretStoreValue(params) {
	try {
		const name = params.name;
		assertSecretStoreEnvName(name);
		const context = params.context ?? captureOpenClawStateReadWorkerContext(params.database);
		params.assertCurrent?.();
		const reply = await executeExistingOpenClawStateRead({
			path: context.admission.databasePath,
			env: context.environment
		}, {
			type: "secrets.value",
			input: { name }
		}, {
			context,
			preferIndependentWarmRead: true
		});
		if (reply && (!reply.ok || reply.type !== "secrets.value")) throw new Error("Unexpected secret store value result.");
		const row = reply?.row;
		if (row?.kind === "secret") registerSecretValueForRedaction(row.value);
		context.admission.assertCurrent();
		params.assertCurrent?.();
		if (!row) return err({
			code: "SECRET_STORE_NOT_FOUND",
			message: `Secret store entry "${name}" was not found.`
		});
		return ok(row.value);
	} catch (error) {
		if (error instanceof SecretStoreValidationError) return err({
			code: "SECRET_STORE_INVALID_NAME",
			message: error.message
		});
		return err({
			code: "SECRET_STORE_UNAVAILABLE",
			message: "Secret store database is unavailable.",
			cause: error
		});
	}
}
//#endregion
//#region src/secrets/resolve-store.ts
const STORE_SECRET_REF_BATCH_MAX_BYTES = 512 * SECRET_STORE_VALUE_MAX_BYTES;
async function resolveStoreRefs(params) {
	const context = captureOpenClawStateReadWorkerContext(params.database);
	const resolved = /* @__PURE__ */ new Map();
	let resolvedBytes = 0;
	for (const ref of params.refs) {
		const result = await readSecretStoreValue({
			scope: { kind: "team" },
			name: ref.id,
			context
		});
		context.admission.assertCurrent();
		if (!result.ok) {
			if (result.error.code === "SECRET_STORE_NOT_FOUND" || result.error.code === "SECRET_STORE_INVALID_NAME") {
				params.onRefError(refResolutionError({
					code: result.error.code === "SECRET_STORE_NOT_FOUND" ? "SECRET_REF_NOT_FOUND" : "SECRET_REF_INVALID",
					source: "store",
					provider: params.providerName,
					refId: ref.id,
					message: result.error.message
				}));
				continue;
			}
			throw providerResolutionError({
				code: "SECRET_PROVIDER_UNAVAILABLE",
				source: "store",
				provider: params.providerName,
				message: result.error.message,
				cause: result.error.cause
			});
		}
		resolvedBytes += Buffer.byteLength(result.value, "utf8");
		if (resolvedBytes > STORE_SECRET_REF_BATCH_MAX_BYTES) throw providerResolutionError({
			code: "SECRET_PROVIDER_INVALID",
			source: "store",
			provider: params.providerName,
			message: `Store provider "${params.providerName}" exceeded its ${STORE_SECRET_REF_BATCH_MAX_BYTES}-byte batch limit.`
		});
		resolved.set(ref.id, result.value);
	}
	return resolved;
}
//#endregion
//#region src/secrets/shared.ts
/** Shared parsing helpers for secrets migration/runtime code. */
/**
* Narrows to strings that contain non-whitespace content.
*/
function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
/**
* Normalizes numeric config to a positive integer, falling back when the input is not finite.
*/
function normalizePositiveInt(value, fallback) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.max(1, Math.floor(value));
	return Math.max(1, Math.floor(fallback));
}
/**
* Normalizes timer values with the shared timeout coercion rules used by secret providers.
*/
function normalizePositiveTimerMs(value, fallback) {
	return resolvePositiveTimerTimeoutMs(value, fallback);
}
//#endregion
//#region src/secrets/resolve.ts
/** Resolves SecretRef values from env, file, exec, and store secret providers. */
const DEFAULT_PROVIDER_CONCURRENCY = 4;
const DEFAULT_MAX_REFS_PER_PROVIDER = 512;
const DEFAULT_MAX_BATCH_BYTES = 262144;
const DEFAULT_FILE_MAX_BYTES = 1048576;
const DEFAULT_FILE_TIMEOUT_MS = 5e3;
const DEFAULT_EXEC_TIMEOUT_MS = 5e3;
const DEFAULT_EXEC_MAX_OUTPUT_BYTES = 1048576;
const SAFE_EXEC_ERROR_CODES = /* @__PURE__ */ new Set(["AMBIGUOUS_DUPLICATE_KEY", "NOT_FOUND"]);
function throwUnknownProviderResolutionError(params) {
	if (isSecretResolutionError(params.err)) throw params.err;
	throw providerResolutionError({
		...process.platform === "win32" && (params.source === "file" || params.source === "exec") && params.err instanceof FsSafeError && params.err.code === "permission-unverified" ? { code: "SECRET_PROVIDER_PATH_SECURITY_UNVERIFIABLE" } : {},
		source: params.source,
		provider: params.provider,
		message: formatErrorMessage(params.err),
		cause: params.err
	});
}
function resolveConfiguredProvider(params) {
	const { ref, config } = params;
	const providerConfig = config.secrets?.providers?.[ref.provider];
	if (isBuiltInDefaultSecretProviderRef(config, ref)) {
		if (ref.source === "env") return { source: "env" };
		if (ref.source === "store") return { source: "store" };
	}
	if (!providerConfig) throw providerResolutionError({
		code: "SECRET_PROVIDER_NOT_CONFIGURED",
		source: ref.source,
		provider: ref.provider,
		message: `Secret provider "${ref.provider}" is not configured (ref: ${ref.source}:${ref.provider}:${ref.id}).`
	});
	const configuredSource = resolveSecretRefProviderSourceMismatch(config, ref);
	if (configuredSource) throw providerResolutionError({
		code: "SECRET_PROVIDER_INVALID",
		source: ref.source,
		provider: ref.provider,
		message: `Secret provider "${ref.provider}" has source "${configuredSource}" but ref requests "${ref.source}".`
	});
	if (isPluginIntegrationSecretProviderConfig(providerConfig)) {
		const resolved = resolveSecretProviderIntegrationConfig({
			manifestRegistry: params.manifestRegistry ?? getCurrentPluginMetadataSnapshot({
				config,
				env: params.env,
				allowWorkspaceScopedSnapshot: true
			})?.manifestRegistry ?? loadPluginManifestRegistryCore({
				config,
				env: params.env
			}),
			providerAlias: ref.provider,
			providerConfig,
			config,
			env: params.env
		});
		if (!resolved.ok) throw providerResolutionError({
			source: ref.source,
			provider: ref.provider,
			message: `Secret provider "${ref.provider}" plugin integration is unavailable: ${resolved.reason}.`
		});
		return resolved.providerConfig;
	}
	return providerConfig;
}
async function readFileProviderPayload(params) {
	const cacheKey = params.providerName;
	const cache = params.cache;
	const read = async () => {
		const filePath = resolveUserPath(params.providerConfig.path);
		const timeoutMs = normalizePositiveTimerMs(params.providerConfig.timeoutMs, DEFAULT_FILE_TIMEOUT_MS);
		const maxBytes = normalizePositiveInt(params.providerConfig.maxBytes, DEFAULT_FILE_MAX_BYTES);
		try {
			const { buffer: payload } = await readSecureFile({
				filePath,
				label: `secrets.providers.${params.providerName}.path`,
				io: {
					maxBytes,
					timeoutMs
				},
				permissions: { allowInsecure: false }
			});
			const text = payload.toString("utf8").replace(/^\uFEFF/, "");
			if (params.providerConfig.mode === "singleValue") return text.replace(/\r?\n$/, "");
			const parsed = JSON.parse(text);
			if (!isRecord(parsed)) throw new Error(`File provider "${params.providerName}" payload is not a JSON object.`);
			return parsed;
		} catch (error) {
			if (error instanceof FsSafeError && error.code === "timeout") throw new Error(`File provider "${params.providerName}" timed out after ${timeoutMs}ms.`, { cause: error });
			throw error;
		}
	};
	if (!cache) return await read();
	cache.filePayloadByProvider ??= /* @__PURE__ */ new Map();
	return await getOrCreatePromise(cache.filePayloadByProvider, cacheKey, read);
}
async function resolveEnvRefs(params) {
	const resolved = /* @__PURE__ */ new Map();
	const allowlist = params.providerConfig.allowlist ? new Set(params.providerConfig.allowlist) : null;
	for (const ref of params.refs) {
		if (allowlist && !allowlist.has(ref.id)) {
			params.onRefError(refResolutionError({
				code: "SECRET_REF_POLICY_DENIED",
				source: "env",
				provider: params.providerName,
				refId: ref.id,
				message: `Environment variable "${ref.id}" is not allowlisted in secrets.providers.${params.providerName}.allowlist.`
			}));
			continue;
		}
		const envValue = params.env[ref.id];
		if (!isNonEmptyString(envValue)) {
			params.onRefError(refResolutionError({
				code: "SECRET_REF_NOT_FOUND",
				source: "env",
				provider: params.providerName,
				refId: ref.id,
				message: `Environment variable "${ref.id}" is missing or empty.`
			}));
			continue;
		}
		resolved.set(ref.id, envValue);
	}
	return resolved;
}
async function resolveFileRefs(params) {
	const payload = await readFileProviderPayload({
		providerName: params.providerName,
		providerConfig: params.providerConfig,
		cache: params.cache
	});
	const mode = params.providerConfig.mode ?? "json";
	const resolved = /* @__PURE__ */ new Map();
	if (mode === "singleValue") {
		for (const ref of params.refs) {
			if (ref.id !== "value") {
				params.onRefError(refResolutionError({
					code: "SECRET_REF_INVALID",
					source: "file",
					provider: params.providerName,
					refId: ref.id,
					message: `singleValue file provider "${params.providerName}" expects ref id "${SINGLE_VALUE_FILE_REF_ID}".`
				}));
				continue;
			}
			resolved.set(ref.id, payload);
		}
		return resolved;
	}
	for (const ref of params.refs) try {
		resolved.set(ref.id, readJsonPointer(payload, ref.id, { onMissing: "throw" }));
	} catch (err) {
		params.onRefError(refResolutionError({
			code: "SECRET_REF_NOT_FOUND",
			source: "file",
			provider: params.providerName,
			refId: ref.id,
			message: formatErrorMessage(err),
			cause: err
		}));
	}
	return resolved;
}
function parseExecValues(params) {
	const trimmed = params.stdout.trim();
	if (!trimmed) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" returned empty stdout.`
	});
	let parsed;
	try {
		parsed = JSON.parse(trimmed);
	} catch {
		if (!params.jsonOnly && params.ids.length === 1) return { [expectDefined(params.ids[0], "ids entry at 0")]: trimmed };
		throw providerResolutionError({
			source: "exec",
			provider: params.providerName,
			message: `Exec provider "${params.providerName}" returned invalid JSON.`
		});
	}
	if (!isRecord(parsed)) {
		if (!params.jsonOnly && params.ids.length === 1 && typeof parsed === "string") return { [expectDefined(params.ids[0], "ids entry at 0")]: parsed };
		throw providerResolutionError({
			source: "exec",
			provider: params.providerName,
			message: `Exec provider "${params.providerName}" response must be an object.`
		});
	}
	if (parsed.protocolVersion !== 1) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" protocolVersion must be 1.`
	});
	const responseValues = parsed.values;
	if (!isRecord(responseValues)) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" response missing "values".`
	});
	const responseErrors = isRecord(parsed.errors) ? parsed.errors : null;
	const out = {};
	for (const id of params.ids) {
		if (responseErrors && Object.hasOwn(responseErrors, id)) {
			const entry = responseErrors[id];
			const code = isRecord(entry) && typeof entry.code === "string" ? entry.code : null;
			const safeCode = code && SAFE_EXEC_ERROR_CODES.has(code) ? code : null;
			params.onRefError(refResolutionError({
				code: safeCode === "NOT_FOUND" ? "SECRET_REF_NOT_FOUND" : "SECRET_REF_PROVIDER_ERROR",
				source: "exec",
				provider: params.providerName,
				refId: id,
				message: `Exec provider "${params.providerName}" failed for id "${id}"${safeCode ? ` (${safeCode})` : ""}.`
			}));
			continue;
		}
		if (!Object.hasOwn(responseValues, id)) {
			params.onRefError(refResolutionError({
				code: "SECRET_REF_NOT_FOUND",
				source: "exec",
				provider: params.providerName,
				refId: id,
				message: `Exec provider "${params.providerName}" response missing id "${id}".`
			}));
			continue;
		}
		out[id] = responseValues[id];
	}
	return out;
}
async function resolveExecRefs(params) {
	const ids = uniqueStrings(params.refs.map((ref) => ref.id));
	const secureCommandPath = await assertSecureExecCommandPath({
		command: params.providerConfig.command,
		label: `secrets.providers.${params.providerName}.command`,
		trustedDirs: params.providerConfig.trustedDirs
	});
	const input = JSON.stringify({
		protocolVersion: 1,
		provider: params.providerName,
		ids
	});
	if (Buffer.byteLength(input, "utf8") > DEFAULT_MAX_BATCH_BYTES) throw providerResolutionError({
		code: "SECRET_PROVIDER_INVALID",
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" request exceeded maxBatchBytes (${DEFAULT_MAX_BATCH_BYTES}).`
	});
	const childEnv = {};
	for (const key of params.providerConfig.passEnv ?? []) {
		const value = params.env[key];
		if (value !== void 0) childEnv[key] = value;
	}
	for (const [key, value] of Object.entries(params.providerConfig.env ?? {})) childEnv[key] = value;
	const timeoutMs = normalizePositiveTimerMs(params.providerConfig.timeoutMs, DEFAULT_EXEC_TIMEOUT_MS);
	const noOutputTimeoutMs = normalizePositiveTimerMs(params.providerConfig.noOutputTimeoutMs, timeoutMs);
	const maxOutputBytes = normalizePositiveInt(params.providerConfig.maxOutputBytes, DEFAULT_EXEC_MAX_OUTPUT_BYTES);
	const jsonOnly = params.providerConfig.jsonOnly ?? true;
	const result = await runCommandWithTimeout([secureCommandPath, ...params.providerConfig.args ?? []], {
		baseEnv: {},
		cwd: path.dirname(secureCommandPath),
		env: childEnv,
		input,
		killProcessTree: true,
		maxCombinedOutputBytes: maxOutputBytes,
		maxOutputBytes,
		noOutputTimeoutMs,
		outputCapture: "head",
		terminateOnOutputLimit: true,
		timeoutMs
	});
	if (result.termination === "timeout") throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" timed out after ${timeoutMs}ms.`
	});
	if (result.termination === "no-output-timeout") throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" produced no output for ${noOutputTimeoutMs}ms.`
	});
	if (result.outputLimitExceeded) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider output exceeded maxOutputBytes (${maxOutputBytes}).`
	});
	if (result.code !== 0) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" exited with code ${String(result.code)}.`
	});
	const values = parseExecValues({
		providerName: params.providerName,
		ids,
		stdout: result.stdout,
		jsonOnly,
		onRefError: params.onRefError
	});
	return new Map(Object.entries(values));
}
async function resolveProviderRefs(params) {
	try {
		if (params.providerConfig.source === "env") return await resolveEnvRefs({
			refs: params.refs,
			providerName: params.providerName,
			onRefError: params.onRefError,
			providerConfig: params.providerConfig,
			env: params.options.env ?? process.env
		});
		if (params.providerConfig.source === "file") return await resolveFileRefs({
			refs: params.refs,
			providerName: params.providerName,
			onRefError: params.onRefError,
			providerConfig: params.providerConfig,
			cache: params.options.cache
		});
		if (params.providerConfig.source === "store") return await resolveStoreRefs({
			refs: params.refs,
			providerName: params.providerName,
			onRefError: params.onRefError,
			database: { env: params.options.env ?? process.env }
		});
		if (params.providerConfig.source === "exec") {
			if (isPluginIntegrationSecretProviderConfig(params.providerConfig)) throw providerResolutionError({
				source: params.source,
				provider: params.providerName,
				message: `Secret provider "${params.providerName}" plugin integration was not materialized before exec resolution.`
			});
			return await resolveExecRefs({
				refs: params.refs,
				providerName: params.providerName,
				onRefError: params.onRefError,
				providerConfig: params.providerConfig,
				env: params.options.env ?? process.env
			});
		}
		throw providerResolutionError({
			source: params.source,
			provider: params.providerName,
			message: `Unsupported secret provider source "${String(params.providerConfig.source)}".`
		});
	} catch (err) {
		return throwUnknownProviderResolutionError({
			source: params.source,
			provider: params.providerName,
			err
		});
	}
}
function createProviderResolutionTasks(params) {
	return params.groups.map((group) => async () => {
		const refFailures = /* @__PURE__ */ new Map();
		const onRefError = (error) => {
			if (params.errorMode === "stop") throw error;
			refFailures.set(error.refId, error);
		};
		if (group.refs.length > DEFAULT_MAX_REFS_PER_PROVIDER) throw providerResolutionError({
			code: "SECRET_PROVIDER_INVALID",
			source: group.source,
			provider: group.providerName,
			message: `Secret provider "${group.providerName}" exceeded maxRefsPerProvider (${DEFAULT_MAX_REFS_PER_PROVIDER}).`
		});
		const providerConfig = resolveConfiguredProvider({
			ref: expectDefined(group.refs[0], "refs entry at 0"),
			config: params.options.config,
			env: params.options.env ?? process.env,
			manifestRegistry: params.options.manifestRegistry
		});
		const values = await resolveProviderRefs({
			refs: group.refs,
			source: group.source,
			providerName: group.providerName,
			providerConfig,
			options: params.options,
			onRefError
		});
		for (const ref of group.refs) {
			if (refFailures.has(ref.id)) continue;
			if (!values.has(ref.id)) {
				onRefError(refResolutionError({
					code: "SECRET_REF_PROVIDER_CONTRACT",
					source: group.source,
					provider: group.providerName,
					refId: ref.id,
					message: `Secret provider "${group.providerName}" did not return id "${ref.id}".`
				}));
				continue;
			}
			if (isRedactedSecretValue(values.get(ref.id))) onRefError(refResolutionError({
				code: "SECRET_REF_REDACTED_VALUE",
				source: group.source,
				provider: group.providerName,
				refId: ref.id,
				message: `Secret reference "${group.source}:${group.providerName}:${ref.id}" resolves to a redaction placeholder. Run openclaw doctor --fix to repair a store-backed Gateway token; supply a real credential for other secrets.`
			}));
		}
		return {
			group,
			values,
			refFailures
		};
	});
}
async function resolveSecretRefProviderGroups(params) {
	const groups = normalizeAndGroupSecretRefs(params.refs);
	const errorsByIndex = /* @__PURE__ */ new Map();
	const taskResults = await runTasksWithConcurrency({
		tasks: createProviderResolutionTasks({
			groups,
			options: params.options,
			errorMode: params.errorMode
		}),
		limit: DEFAULT_PROVIDER_CONCURRENCY,
		errorMode: params.errorMode,
		onTaskError: (error, index) => {
			errorsByIndex.set(index, error);
		}
	});
	const resolved = /* @__PURE__ */ new Map();
	const failures = [];
	for (const result of taskResults.results) {
		if (!result) continue;
		for (const ref of result.group.refs) {
			const error = result.refFailures.get(ref.id);
			if (error) failures.push({
				group: result.group,
				error
			});
			else resolved.set(secretRefKey(ref), result.values.get(ref.id));
		}
	}
	for (const [index, group] of groups.entries()) if (errorsByIndex.has(index)) failures.push({
		group,
		error: errorsByIndex.get(index)
	});
	return {
		resolved,
		failures,
		hasError: taskResults.hasError,
		firstError: taskResults.firstError
	};
}
/** Resolves a batch of SecretRefs, grouped by provider for bounded provider concurrency. */
async function resolveSecretRefValues(refs, options) {
	const result = await resolveSecretRefProviderGroups({
		refs,
		options,
		errorMode: "stop"
	});
	if (result.hasError) throw result.firstError;
	return result.resolved;
}
/** Resolves one SecretRef, using the optional shared runtime cache. */
async function resolveSecretRefValue(ref, options) {
	const cache = options.cache;
	const key = secretRefKey(ref);
	const resolve = async () => {
		const resolved = await resolveSecretRefValues([ref], options);
		if (!resolved.has(key)) throw refResolutionError({
			code: "SECRET_REF_PROVIDER_CONTRACT",
			source: ref.source,
			provider: ref.provider,
			refId: ref.id,
			message: `Secret reference "${key}" resolved to no value.`
		});
		return resolved.get(key);
	};
	if (!cache) return await resolve();
	cache.resolvedByRefKey ??= /* @__PURE__ */ new Map();
	return await getOrCreatePromise(cache.resolvedByRefKey, key, resolve);
}
/** Resolves one SecretRef and requires a non-empty string result. */
async function resolveSecretRefString(ref, options) {
	const resolved = await resolveSecretRefValue(ref, options);
	if (!isNonEmptyString(resolved)) throw new Error(`Secret reference "${ref.source}:${ref.provider}:${ref.id}" resolved to a non-string or empty value.`);
	return resolved;
}
//#endregion
export { describeSecretResolutionOperatorRecovery as a, describeSecretResolutionOperatorDiagnostic as i, resolveSecretRefValue as n, isSecretResolutionError as o, resolveSecretRefValues as r, resolveSecretRefString as t };
