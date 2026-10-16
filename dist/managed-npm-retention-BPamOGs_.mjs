import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as isNotFoundPathError, r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { u as tryReadJsonSync } from "./json-files-C5mNTScg.mjs";
import { a as safePathSegmentHashed } from "./install-safe-path-CvmSx2MJ.mjs";
import { m as validatePluginId, p as resolvePluginNpmProjectsDir, r as isPluginNpmProjectDir, s as resolveDefaultPluginNpmDir } from "./install-paths-R7__5hE9.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/plugins/managed-npm-retention-contract.ts
/** Marker reason for packages preserved by an explicit `plugins uninstall --keep-files`. */
const RETAINED_MANAGED_NPM_KEEP_FILES_REASON = "removed-managed-npm-install-retained";
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
		return sortPaths(fs.readdirSync(projectsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => path.join(projectsDir, entry.name)));
	} catch (error) {
		if (isNotFoundPathError(error)) return [];
		throw error;
	}
}
/** Lists admitted projects with the manifest that established their managed ownership. */
function listManagedPluginNpmProjectsSync(npmRoot) {
	return readManagedProjects(listPluginNpmProjectCandidatesSync(npmRoot), npmRoot);
}
/** Async variant of project-level managed npm root discovery. */
async function listManagedPluginNpmProjectRoots(npmRoot) {
	const projectsDir = resolvePluginNpmProjectsDir(npmRoot);
	try {
		return readManagedProjects((await fs$1.readdir(projectsDir, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => path.join(projectsDir, entry.name)), npmRoot).map(({ projectRoot }) => projectRoot);
	} catch (error) {
		if (isNotFoundPathError(error)) return [];
		throw error;
	}
}
/** Returns the root npm install plus all managed project npm roots. */
function listManagedPluginNpmRootsSync(npmRoot) {
	return [npmRoot, ...listManagedPluginNpmProjectsSync(npmRoot).map(({ projectRoot }) => projectRoot)];
}
/** Async variant of managed npm root discovery. */
async function listManagedPluginNpmRoots(npmRoot) {
	return [npmRoot, ...await listManagedPluginNpmProjectRoots(npmRoot)];
}
//#endregion
//#region src/plugins/managed-npm-retention.ts
const RETAINED_MANAGED_NPM_INSTALL_MARKER_DIR = ".openclaw-retained-npm-installs";
function markerPreservesPackageFiles(markerPath) {
	try {
		const marker = JSON.parse(fs.readFileSync(markerPath, "utf8"));
		return isRecord(marker) && marker.reason === "removed-managed-npm-install-retained";
	} catch {
		return false;
	}
}
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
function resolveRetainedManagedNpmInstallMarkerPath(packageDir) {
	const info = resolveRetainedManagedNpmInstallPackageInfo(packageDir);
	if (!info) throw new Error("retained npm install marker requires a node_modules package directory");
	return info.markerPath;
}
function hasRetainedManagedNpmInstallMarker(packageDir) {
	const info = resolveRetainedManagedNpmInstallPackageInfo(packageDir);
	return info ? fs.existsSync(info.markerPath) : false;
}
async function clearRetainedManagedNpmInstallMarker(packageDir, assertCurrent) {
	const info = resolveRetainedManagedNpmInstallPackageInfo(packageDir);
	if (!info) return false;
	assertCurrent?.();
	try {
		await fs.promises.rm(info.markerPath, { force: true });
	} catch (error) {
		assertCurrent?.();
		if (error.code === "ENOENT") return false;
		throw error;
	}
	assertCurrent?.();
	try {
		await fs.promises.rmdir(path.dirname(info.markerPath));
	} catch {
		assertCurrent?.();
	}
	return true;
}
async function markRetainedManagedNpmInstall(params) {
	const info = resolveRetainedManagedNpmInstallPackageInfo(params.packageDir);
	if (!info) return false;
	let stat;
	try {
		stat = await fs.promises.stat(params.packageDir);
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
	if (!stat.isDirectory()) return false;
	params.assertCurrent?.();
	await fs.promises.mkdir(path.dirname(info.markerPath), { recursive: true });
	params.assertCurrent?.();
	await fs.promises.writeFile(info.markerPath, `${JSON.stringify({
		version: 1,
		pluginId: params.pluginId,
		retainedAt: params.retainedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
		reason: params.reason
	}, null, 2)}\n`, "utf8");
	return true;
}
/** Restore markers only while the same index transaction still owns compensation. */
async function restoreRetainedManagedNpmInstallMarkers(params) {
	for (const snapshot of params.clearedMarkerSnapshots) {
		params.assertCurrent();
		await fs.promises.mkdir(path.dirname(snapshot.markerPath), { recursive: true });
		params.assertCurrent();
		await fs.promises.writeFile(snapshot.markerPath, snapshot.contents, "utf8");
	}
	for (const markerPath of params.createdMarkerPaths) {
		params.assertCurrent();
		await fs.promises.rm(markerPath, { force: true });
	}
}
function listManagedNpmPackageDirs(npmRoot) {
	const nodeModulesDir = path.join(npmRoot, "node_modules");
	let entries;
	try {
		entries = fs.readdirSync(nodeModulesDir, { withFileTypes: true });
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
	return entries.flatMap((entry) => {
		if (!entry.isDirectory()) return [];
		if (!entry.name.startsWith("@")) return [path.join(nodeModulesDir, entry.name)];
		return fs.readdirSync(path.join(nodeModulesDir, entry.name), { withFileTypes: true }).filter((scopedEntry) => scopedEntry.isDirectory()).map((scopedEntry) => path.join(nodeModulesDir, entry.name, scopedEntry.name));
	});
}
function isOwnedManagedNpmProject(params) {
	return listManagedNpmPackageDirs(params.projectRoot).some((packageDir) => {
		const info = resolveRetainedManagedNpmInstallPackageInfo(packageDir);
		return Boolean(info && params.markerNames.has(path.basename(info.markerPath)) && isPluginNpmProjectDir({
			npmDir: params.npmDir,
			packageName: info.packageName,
			projectDir: params.projectRoot
		}));
	});
}
async function cleanupRetainedLegacyNpmPackages(params) {
	let removed = 0;
	for (const packageDir of listManagedNpmPackageDirs(params.npmRoot)) {
		if (!hasRetainedManagedNpmInstallMarker(packageDir) || markerPreservesPackageFiles(resolveRetainedManagedNpmInstallMarkerPath(packageDir)) || params.activeInstallPaths.some((installPath) => isPathInside(packageDir, installPath))) continue;
		try {
			await fs.promises.rm(packageDir, {
				recursive: true,
				force: true
			});
			await clearRetainedManagedNpmInstallMarker(packageDir);
			removed += 1;
		} catch (error) {
			params.onError?.(error, packageDir);
		}
	}
	return removed;
}
async function cleanupRetainedManagedNpmInstallGenerations(params = {}) {
	const npmDir = params.npmDir ?? resolveDefaultPluginNpmDir(params.env);
	const projectsDir = resolvePluginNpmProjectsDir(npmDir);
	const activeInstallPaths = Array.from(params.activeInstallPaths ?? [], (installPath) => path.resolve(installPath));
	let removed = 0;
	for (const projectRoot of [npmDir, ...listPluginNpmProjectCandidatesSync(npmDir)]) {
		if (path.resolve(projectRoot) === path.resolve(npmDir)) {
			removed += await cleanupRetainedLegacyNpmPackages({
				npmRoot: projectRoot,
				activeInstallPaths,
				onError: params.onError
			});
			continue;
		}
		const markerDir = path.join(projectRoot, RETAINED_MANAGED_NPM_INSTALL_MARKER_DIR);
		let markerEntries;
		try {
			markerEntries = fs.readdirSync(markerDir, { withFileTypes: true }).filter((entry) => entry.isFile());
		} catch (error) {
			if (error.code === "ENOENT") continue;
			params.onError?.(error, projectRoot);
			continue;
		}
		if (markerEntries.length === 0 || markerEntries.some((entry) => markerPreservesPackageFiles(path.join(markerDir, entry.name))) || !isPathInside(projectsDir, projectRoot) || !isOwnedManagedNpmProject({
			markerNames: new Set(markerEntries.map((entry) => entry.name)),
			npmDir,
			projectRoot
		}) || activeInstallPaths.some((installPath) => isPathInside(projectRoot, installPath))) continue;
		try {
			await fs.promises.rm(projectRoot, {
				recursive: true,
				force: true
			});
			removed += 1;
		} catch (error) {
			params.onError?.(error, projectRoot);
		}
	}
	return removed;
}
//#endregion
export { resolveRetainedManagedNpmInstallMarkerPath as a, listManagedPluginNpmProjectsSync as c, RETAINED_MANAGED_NPM_KEEP_FILES_REASON as d, markRetainedManagedNpmInstall as i, listManagedPluginNpmRoots as l, clearRetainedManagedNpmInstallMarker as n, resolveRetainedManagedNpmInstallPackageInfo as o, hasRetainedManagedNpmInstallMarker as r, restoreRetainedManagedNpmInstallMarkers as s, cleanupRetainedManagedNpmInstallGenerations as t, listManagedPluginNpmRootsSync as u };
