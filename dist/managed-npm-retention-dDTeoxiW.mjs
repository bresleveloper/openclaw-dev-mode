import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as isNotFoundPathError, r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { a as safePathSegmentHashed } from "./install-safe-path-Nbwl6YSJ.mjs";
import { p as resolvePluginNpmProjectsDir, r as isPluginNpmProjectDir, s as resolveDefaultPluginNpmDir } from "./install-paths-DnOgVB7K.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/plugins/managed-npm-retention-contract.ts
/** Marker reason for packages preserved by an explicit `plugins uninstall --keep-files`. */
const RETAINED_MANAGED_NPM_KEEP_FILES_REASON = "removed-managed-npm-install-retained";
//#endregion
//#region src/plugins/npm-project-roots.ts
function isMissing(error) {
	return isNotFoundPathError(error);
}
function sortPaths(paths) {
	return paths.toSorted((left, right) => left.localeCompare(right));
}
/** Lists project-level npm roots managed below the plugin npm root. */
function listManagedPluginNpmProjectRootsSync(npmRoot) {
	const projectsDir = resolvePluginNpmProjectsDir(npmRoot);
	try {
		return sortPaths(fs.readdirSync(projectsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => path.join(projectsDir, entry.name)));
	} catch (error) {
		if (isMissing(error)) return [];
		throw error;
	}
}
/** Async variant of project-level managed npm root discovery. */
async function listManagedPluginNpmProjectRoots(npmRoot) {
	const projectsDir = resolvePluginNpmProjectsDir(npmRoot);
	try {
		return sortPaths((await fs$1.readdir(projectsDir, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => path.join(projectsDir, entry.name)));
	} catch (error) {
		if (isMissing(error)) return [];
		throw error;
	}
}
/** Returns the root npm install plus all managed project npm roots. */
function listManagedPluginNpmRootsSync(npmRoot) {
	return [npmRoot, ...listManagedPluginNpmProjectRootsSync(npmRoot)];
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
	for (const projectRoot of listManagedPluginNpmRootsSync(npmDir)) {
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
export { resolveRetainedManagedNpmInstallMarkerPath as a, listManagedPluginNpmProjectRootsSync as c, RETAINED_MANAGED_NPM_KEEP_FILES_REASON as d, markRetainedManagedNpmInstall as i, listManagedPluginNpmRoots as l, clearRetainedManagedNpmInstallMarker as n, resolveRetainedManagedNpmInstallPackageInfo as o, hasRetainedManagedNpmInstallMarker as r, restoreRetainedManagedNpmInstallMarkers as s, cleanupRetainedManagedNpmInstallGenerations as t, listManagedPluginNpmRootsSync as u };
