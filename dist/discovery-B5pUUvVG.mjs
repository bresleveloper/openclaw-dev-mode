import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as getPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { v as sortUniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import "./utils-gjJ-tD2q.mjs";
import { C as resolveIsNixMode } from "./paths-orClZ-2Z.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-jg_14gWz.mjs";
import { t as decodeMountInfoPath } from "./mountinfo-path-BCOIljp0.mjs";
import { n as isPathInside, t as formatPosixMode } from "./path-safety-n0YlfCVt.mjs";
import { a as pluginCacheRealpathSync, c as readPluginCacheFile, n as parsePluginCacheJson, o as pluginCacheStatSync, r as pluginCacheExistsSync, s as readPluginCacheDirectory, u as refreshPluginCacheStat } from "./plugin-cache-files-VxWaav6j.mjs";
import { t as PUBLIC_SURFACE_SOURCE_EXTENSIONS } from "./package-entrypoints-DCjwjOnD.mjs";
import { r as loadPluginManifest } from "./manifest-gUPkNRN0.mjs";
import { n as getPackageManifestMetadata, r as resolvePackageExtensionEntries, t as DEFAULT_PLUGIN_ENTRY_CANDIDATES } from "./package-manifest-Zddwuhx3.mjs";
import { c as resolveSourceCheckoutDependencyDiagnostic, i as isPluginInPackageBundledRoots, n as hasUsableBundledPluginTree, s as resolveBundledPluginsDir } from "./bundled-dir-LfC_CFuw.mjs";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-1GfPFu0U.mjs";
import { n as hashStableJson } from "./installed-plugin-index-hash-N3AVaUCF.mjs";
import { a as detectBundleManifestFormat, o as loadBundleManifest } from "./bundle-manifest-CQDvnPXX.mjs";
import { c as shouldSkipIncompatiblePackagePluginApi, i as inspectPluginLoadPath, s as pluginPathFailureDiagnostic } from "./discovery-availability-CEoTdFoo.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DiVSy6jb.mjs";
import { n as resolvePackageRuntimeExtensions, r as resolvePackageSetupSource } from "./package-entry-resolution-CshXgnB5.mjs";
import { n as resolvePluginSourceRoots } from "./roots-MVdSmrth.mjs";
import { i as normalizePluginDependencySpecs } from "./status-dependencies-core-CUcepTmO.mjs";
import fs from "node:fs";
import path from "node:path";
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
/** Editable installs have no reusable identity; npm replacement records invalidate installed code. */
function resolveImmutableInstallIdentity(origin, installOwner, installRecords) {
	const install = installOwner ? installRecords[installOwner] : void 0;
	if (origin !== "global" || install?.source !== "npm" || !install.integrity) return;
	return JSON.stringify([
		installOwner,
		install.installPath ?? "",
		install.resolvedSpec ?? install.spec ?? "",
		install.integrity,
		install.installedAt ?? ""
	]);
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
function findBundledRoot(localPath, roots = PACKAGED_BUNDLED_ROOTS) {
	const normalized = normalizeBundledLookupPath(localPath);
	for (const packagedRoot of roots) {
		const marker = `${path.sep}${packagedRoot}`;
		const markerIndex = normalized.lastIndexOf(marker);
		if (markerIndex === -1) continue;
		const markerEnd = markerIndex + marker.length;
		if (normalized.length !== markerEnd && normalized[markerEnd] !== path.sep) continue;
		return {
			packageRoot: normalized.slice(0, markerIndex),
			bundledRoot: normalized.slice(0, markerEnd),
			bundledLeaf: normalized.slice(markerEnd + path.sep.length)
		};
	}
	return null;
}
/** Parses a path under a packaged bundled plugin root. */
function parsePackagedBundledPluginPath(localPath) {
	const packaged = findBundledRoot(localPath);
	return packaged?.bundledLeaf ? packaged : null;
}
/** Builds the legacy extensions-root alias for a packaged bundled plugin path. */
function buildLegacyBundledPath(localPath) {
	const packaged = parsePackagedBundledPluginPath(localPath);
	if (!packaged) return null;
	return path.join(packaged.packageRoot, "extensions", packaged.bundledLeaf);
}
/** Builds the legacy extensions root for a packaged bundled plugin root. */
function buildLegacyBundledRootPath(localPath) {
	const packaged = findBundledRoot(localPath);
	return packaged ? path.join(packaged.packageRoot, "extensions") : null;
}
/** Parses a path under the legacy bundled extensions root. */
function parseLegacyBundledPluginPath(localPath) {
	const legacy = findBundledRoot(localPath, ["extensions"]);
	if (!legacy?.bundledLeaf) return null;
	return {
		packageRoot: legacy.packageRoot,
		legacyRoot: legacy.bundledRoot,
		bundledLeaf: legacy.bundledLeaf
	};
}
/** Builds current and legacy aliases for a packaged bundled plugin path. */
function buildBundledPluginLoadPathAliases(localPath) {
	const legacyPath = buildLegacyBundledPath(localPath);
	if (!legacyPath) return [];
	return [{
		kind: "current",
		path: localPath
	}, {
		kind: "legacy",
		path: legacyPath
	}];
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
		metadata.discoveryMountPoints = parseLinuxMountInfoMountPoints(fs.readFileSync("/proc/self/mountinfo", "utf8"));
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
		const bundledPeer = path.join(params.bundledRoot, entry.name);
		if (!pluginCacheExistsSync(bundledPeer)) continue;
		if (!legacyRootMounted && !isBundledSourceOverlayPath({
			sourcePath: sourceDir,
			mountPoints
		})) continue;
		overlayDirs.push(sourceDir);
	}
	return overlayDirs.toSorted((left, right) => left.localeCompare(right));
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
/** Traces an async plugin lifecycle phase when tracing is enabled. */
async function tracePluginLifecyclePhaseAsync(phase, fn, details) {
	if (!isPluginLifecycleTraceEnabled()) return fn();
	const start = process.hrtime.bigint();
	let status = "error";
	try {
		const result = await fn();
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
	if (isPathInside(rootRealPath, sourceRealPath)) return null;
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
			fs.chmodSync(targetPath, modeBits & -19);
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
	const type = entry.isSymbolicLink() ? pluginCacheStatSync(fullPath) : entry;
	return type?.isFile() ? "file" : type?.isDirectory() ? "directory" : null;
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
	return [bundledRoot, resolveBundledSourceCheckoutExtensionsDir(bundledRoot)].some((root) => root && isPathInside(pluginCacheRealpathSync(root) ?? path.resolve(root), realDir));
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
		const packageEntryParams = {
			packageDir: dir,
			...rootRealPath !== void 0 ? { packageRootRealPath: rootRealPath } : {},
			manifest,
			pluginIdHint,
			origin: params.origin,
			requireBuiltRuntimeEntry,
			sourceLabel: dir,
			diagnostics,
			rejectHardlinks
		};
		const setupSource = resolvePackageSetupSource(packageEntryParams);
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
				...packageEntryParams,
				extensions,
				manifestId: manifestId ?? normalizeOptionalString(packageMetadata?.plugin?.id)
			});
			for (const entry of entries) addPackageCandidate(entry.source, entry.idHint, extensions.length > 1 ? entry.idHint : void 0);
			return true;
		}
		const bundleFormat = detectBundleManifestFormat(dir);
		if (bundleFormat) {
			const bundleManifest = loadBundleManifest({
				rootDir: dir,
				...rootRealPath !== void 0 ? { rootRealPath } : {},
				bundleFormat,
				rejectHardlinks
			});
			if (!bundleManifest.ok) diagnostics.push({
				level: "error",
				message: bundleManifest.error,
				source: bundleManifest.manifestPath
			});
			else {
				addCandidate({
					idHint: bundleManifest.manifest.id,
					source: dir,
					rootDir: dir,
					origin: params.origin,
					format: "bundle",
					bundleFormat,
					workspaceDir: params.workspaceDir,
					...params.installOwner ? { installOwner: params.installOwner } : {},
					...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {},
					manifest,
					packageDir: dir,
					bundledManifestId: bundleManifest.manifest.id,
					bundledManifestPath: bundleManifest.manifestPath
				});
				return true;
			}
		}
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
			if (params.origin === "bundled" && !isPathInside(pluginCacheRealpathSync(params.dir) ?? path.resolve(params.dir), fullPathDirKey)) {
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
/** Discovers only explicit plugins.load.paths candidates without scanning shared roots. */
function discoverConfiguredPluginLoadPaths(params) {
	const env = params.env ?? process.env;
	const cache = getPluginCache().metadata.discovery;
	const key = hashStableJson({
		phase: params.deduplicate ? "configured-published" : "configured-raw",
		loadPaths: params.loadPaths,
		workspaceDir: params.workspaceDir,
		policy: discoveryPolicy(env, params.ownershipUid)
	});
	const cached = cache.get(key);
	if (cached) return cached;
	const scanner = createPluginScanner(env, params.ownershipUid);
	scanner.discoverConfiguredPaths(params.loadPaths, normalizeOptionalString(params.workspaceDir));
	const result = params.deduplicate ? scanner.finish() : scanner.result;
	cache.set(key, result);
	return result;
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
export { recordPluginCandidateInstallOwner as _, groupPluginRecords as a, tracePluginLifecyclePhaseAsync as c, buildBundledPluginLoadPathAliases as d, buildLegacyBundledRootPath as f, isPluginCandidateInstallOwnerAmbiguous as g, parsePackagedBundledPluginPath as h, resolvePluginPackageEntries as i, isBundledSourceOverlayPath as l, parseLegacyBundledPluginPath as m, discoverOpenClawPlugins as n, isPluginLifecycleTraceEnabled as o, normalizeBundledLookupPath as p, resolveBundledSourceCheckoutExtensionsDir as r, tracePluginLifecyclePhase as s, discoverConfiguredPluginLoadPaths as t, listBundledSourceOverlayDirs as u, resolveImmutableInstallIdentity as v, resolvePluginCandidateInstallOwner as y };
