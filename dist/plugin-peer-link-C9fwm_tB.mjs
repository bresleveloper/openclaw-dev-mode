import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { o as safeRealpathSync } from "./path-safety-0BfxAYBQ.mjs";
import "./path-safety-Cc0rrc_m.mjs";
import "./errors-DnjwnOju.mjs";
import { u as readRootJsonObjectSync } from "./json-files-C0HSMh2Z.mjs";
import { c as resolvePluginInstallDir } from "./install-paths-DnOgVB7K.mjs";
import { lstatSync, symlinkSync, unlinkSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/plugins/npm-package-dirs.ts
async function listNpmPackageDirs(npmRoot, options) {
	const readEntries = async (dir) => {
		try {
			const entries = await fs$1.readdir(dir, { withFileTypes: true });
			return options.sortEntries ? entries.toSorted((left, right) => left.name.localeCompare(right.name)) : entries;
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return [];
			throw error;
		}
	};
	const nodeModulesDir = path.join(npmRoot, "node_modules");
	const packageDirs = [];
	for (const entry of await readEntries(nodeModulesDir)) {
		if (!options.includeEntry(entry, false)) continue;
		const entryPath = path.join(nodeModulesDir, entry.name);
		if (entry.name.startsWith("@")) {
			for (const scopedEntry of await readEntries(entryPath)) if (options.includeEntry(scopedEntry, true)) packageDirs.push(path.join(entryPath, scopedEntry.name));
		} else packageDirs.push(entryPath);
	}
	return packageDirs;
}
//#endregion
//#region src/plugins/plugin-peer-link.ts
/** Resolve the host declaration consistently for peer, direct, and optional dependencies. */
function resolveOpenClawHostDependency(manifest) {
	for (const declaration of [
		"peerDependencies",
		"optionalDependencies",
		"dependencies"
	]) {
		const dependencies = manifest[declaration];
		const spec = typeof dependencies === "object" && dependencies !== null && !Array.isArray(dependencies) ? dependencies.openclaw : void 0;
		if (typeof spec === "string" && spec) return {
			declaration,
			spec
		};
	}
	return null;
}
async function readSafePackageManifest(packageDir) {
	const result = readRootJsonObjectSync({
		rootDir: packageDir,
		relativePath: "package.json",
		boundaryLabel: "installed plugin package directory"
	});
	if (!result.ok) {
		if (result.reason === "open" && result.failure.error?.code === "ENOENT") return null;
		if (result.reason === "parse") throw new SyntaxError(result.error);
		if (result.reason === "open" && result.failure.error instanceof Error) throw result.failure.error;
		throw new Error(`Could not safely read package.json from ${packageDir}: ${result.reason === "open" ? result.failure.reason : result.error}`);
	}
	return result.value;
}
async function readPackageOpenClawLinkDependencies(packageDir) {
	const manifest = await readSafePackageManifest(packageDir);
	const dependency = manifest ? resolveOpenClawHostDependency(manifest) : null;
	return dependency ? { openclaw: dependency.spec } : {};
}
async function listManagedNpmRootPackageDirs(npmRoot) {
	return (await listNpmPackageDirs(npmRoot, { includeEntry: (entry, scoped) => entry.isDirectory() && (scoped || !entry.name.startsWith(".")) })).toSorted((a, b) => a.localeCompare(b));
}
async function safeRealpath(filePath) {
	try {
		return await fs$1.realpath(filePath);
	} catch {
		return null;
	}
}
function managedPackageNameFromDir(params) {
	return path.relative(path.join(params.npmRoot, "node_modules"), params.packageDir).split(path.sep).join("/");
}
function auditOpenClawPeerDependency(params) {
	const packageName = params.packageName ?? (params.npmRoot ? managedPackageNameFromDir({
		npmRoot: params.npmRoot,
		packageDir: params.packageDir
	}) : path.basename(params.packageDir));
	const nodeModulesDir = path.join(params.packageDir, "node_modules");
	try {
		const existing = lstatSync(nodeModulesDir);
		if (!existing.isDirectory() || existing.isSymbolicLink()) return {
			packageName,
			packageDir: params.packageDir,
			reason: `${nodeModulesDir} is not a real directory`
		};
	} catch (error) {
		if (error.code === "ENOENT") return {
			packageName,
			packageDir: params.packageDir,
			reason: `missing ${path.join(nodeModulesDir, "openclaw")}`
		};
		throw error;
	}
	const linkPath = path.join(nodeModulesDir, "openclaw");
	const currentTarget = safeRealpathSync(linkPath);
	if (!currentTarget) return {
		packageName,
		packageDir: params.packageDir,
		reason: `missing ${linkPath}`
	};
	const expectedTarget = safeRealpathSync(params.hostRoot) ?? params.hostRoot;
	if (currentTarget !== expectedTarget) return {
		packageName,
		packageDir: params.packageDir,
		reason: `${linkPath} points to ${currentTarget} instead of ${expectedTarget}`
	};
	return null;
}
function auditOpenClawPeerDependencyLinkSync(params) {
	const packageName = params.packageName ?? path.basename(params.packageDir);
	const hostRoot = resolveOpenClawPackageRootSync({
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		cwd: process.cwd()
	});
	if (!hostRoot) return {
		packageName,
		packageDir: params.packageDir,
		reason: "could not locate openclaw package root"
	};
	return auditOpenClawPeerDependency({
		hostRoot,
		packageDir: params.packageDir,
		packageName
	});
}
async function auditOpenClawPeerDependencyLink(params) {
	return auditOpenClawPeerDependencyLinkSync(params);
}
/** Audit the installed host only when the package actually declares an OpenClaw dependency. */
async function auditDeclaredOpenClawHostDependency(params) {
	const dependencies = await readPackageOpenClawLinkDependencies(params.packageDir);
	if (!Object.hasOwn(dependencies, "openclaw")) return null;
	return await auditOpenClawPeerDependencyLink(params);
}
async function ensureRealNodeModulesDir(params) {
	const nodeModulesDir = path.join(params.installedDir, "node_modules");
	let existing;
	try {
		existing = await fs$1.lstat(nodeModulesDir);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	if (!existing) {
		await params.beforePersistentEffect?.();
		params.beforePersistentApply?.();
		await fs$1.mkdir(nodeModulesDir, { recursive: true });
		existing = await fs$1.lstat(nodeModulesDir);
	}
	if (!existing.isDirectory() || existing.isSymbolicLink()) {
		params.logger.warn?.(`Skipping openclaw peerDependency link because ${nodeModulesDir} is not a real directory.`);
		return null;
	}
	return nodeModulesDir;
}
async function linkOpenClawPeerDependency(params) {
	const nodeModulesDir = await ensureRealNodeModulesDir(params);
	if (!nodeModulesDir) return "skipped";
	const linkPath = path.join(nodeModulesDir, params.peerName);
	const expectedTarget = await safeRealpath(params.hostRoot) ?? params.hostRoot;
	if (await safeRealpath(linkPath) === expectedTarget) return "unchanged";
	const warn = (error) => {
		params.beforePersistentApply?.();
		params.logger.warn?.(`Failed to symlink peerDependency "${params.peerName}": ${String(error)}`);
		return "skipped";
	};
	let existing;
	try {
		existing = await fs$1.lstat(linkPath).catch((error) => {
			if (hasErrnoCode(error, "ENOENT")) return null;
			throw error;
		});
		if (existing && !existing.isSymbolicLink() && (params.peerName !== "openclaw" || !existing.isDirectory() || await readPackageName(linkPath) !== "openclaw")) {
			params.logger.warn?.(`Skipping openclaw peerDependency link because ${linkPath} already exists and is not a symlink.`);
			return "skipped";
		}
	} catch (error) {
		return warn(error);
	}
	if (existing) {
		await params.beforePersistentEffect?.();
		params.beforePersistentApply?.();
		try {
			if (existing.isSymbolicLink()) unlinkSync(linkPath);
			else await fs$1.rm(linkPath, {
				recursive: true,
				force: true
			});
		} catch (error) {
			return warn(error);
		}
	}
	await params.beforePersistentEffect?.();
	params.beforePersistentApply?.();
	try {
		symlinkSync(params.hostRoot, linkPath, "junction");
		params.logger.info?.(`Linked peerDependency "${params.peerName}" -> ${params.hostRoot}`);
		return "linked";
	} catch (error) {
		return warn(error);
	}
}
async function readPackageName(packageDir) {
	const manifest = await readSafePackageManifest(packageDir);
	return typeof manifest?.name === "string" ? manifest.name : void 0;
}
/**
* Symlink the host openclaw package for plugins that declare it as a dependency.
* Plugin package managers still own third-party dependencies; this only wires
* the host SDK package into the plugin-local Node graph.
*/
async function linkOpenClawPeerDependencies(params) {
	const peers = Object.keys(params.peerDependencies).filter((name) => name === "openclaw");
	if (peers.length === 0) return {
		repaired: 0,
		skipped: 0
	};
	const hostRoot = params.hostRoot ?? resolveOpenClawPackageRootSync({
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		cwd: process.cwd()
	});
	if (!hostRoot) {
		params.logger.warn?.("Could not locate openclaw package root to symlink peerDependencies; plugin may fail to resolve openclaw at runtime.");
		return {
			repaired: 0,
			skipped: peers.length
		};
	}
	let repaired = 0;
	let skipped = 0;
	for (const peerName of peers) {
		const result = await linkOpenClawPeerDependency({
			hostRoot,
			installedDir: params.installedDir,
			peerName,
			logger: params.logger,
			beforePersistentApply: params.beforePersistentApply,
			beforePersistentEffect: params.beforePersistentEffect
		});
		if (result === "linked") repaired += 1;
		else if (result === "skipped") skipped += 1;
	}
	return {
		repaired,
		skipped
	};
}
/**
* Repair registry-owned installs named by the authoritative install ledger.
* Local/path installs and symlink escapes remain developer-owned and are never mutated.
*/
async function reconcileRegisteredOpenClawHostLinks(params) {
	const extensionsRoot = path.resolve(params.extensionsDir);
	const extensionsRootRealPath = await safeRealpath(extensionsRoot);
	if (!extensionsRootRealPath) return {
		checked: 0,
		repaired: 0,
		skipped: 0,
		issues: []
	};
	let checked = 0;
	let repaired = 0;
	let skipped = 0;
	const issues = [];
	for (const [pluginId, record] of Object.entries(params.installRecords).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (record.source !== "npm" && record.source !== "clawhub" || !record.installPath?.trim()) continue;
		let packageDir;
		let expectedPackageDir;
		try {
			packageDir = path.resolve(resolveUserPath(record.installPath, params.env));
			expectedPackageDir = path.resolve(resolvePluginInstallDir(pluginId, extensionsRoot));
		} catch {
			continue;
		}
		if (packageDir !== expectedPackageDir) continue;
		const packageRealPath = await safeRealpath(packageDir);
		const expectedPackageRealPath = path.join(extensionsRootRealPath, path.relative(extensionsRoot, expectedPackageDir));
		if (!packageRealPath || !isPathInside(extensionsRootRealPath, packageRealPath) || packageRealPath !== expectedPackageRealPath) continue;
		let dependencies;
		try {
			dependencies = await readPackageOpenClawLinkDependencies(packageDir);
		} catch (error) {
			if (!params.onPackageReadError) throw error;
			params.onPackageReadError(error, packageDir);
			skipped += 1;
			continue;
		}
		if (!Object.hasOwn(dependencies, "openclaw")) continue;
		checked += 1;
		const issue = await auditOpenClawPeerDependencyLink({
			packageDir,
			packageName: pluginId
		});
		if (!issue) continue;
		issues.push(issue);
		if (params.mode !== "repair") continue;
		const result = await linkOpenClawPeerDependencies({
			installedDir: packageDir,
			peerDependencies: dependencies,
			logger: params.logger ?? {},
			beforePersistentApply: params.beforePersistentApply,
			beforePersistentEffect: params.beforePersistentEffect
		});
		repaired += result.repaired;
		skipped += result.skipped;
	}
	return {
		checked,
		repaired,
		skipped,
		issues
	};
}
async function relinkOpenClawPeerDependenciesInManagedNpmRoot(params) {
	let checked = 0;
	let attempted = 0;
	let repaired = 0;
	let skipped = 0;
	for (const packageDir of await listManagedNpmRootPackageDirs(params.npmRoot)) {
		let openClawLinkDependencies;
		try {
			openClawLinkDependencies = await readPackageOpenClawLinkDependencies(packageDir);
		} catch (error) {
			if (!params.onPackageReadError) throw error;
			params.onPackageReadError(error, packageDir);
			skipped += 1;
			continue;
		}
		if (!Object.hasOwn(openClawLinkDependencies, "openclaw")) continue;
		checked += 1;
		const result = await linkOpenClawPeerDependencies({
			installedDir: packageDir,
			peerDependencies: openClawLinkDependencies,
			logger: params.logger,
			beforePersistentApply: params.beforePersistentApply,
			beforePersistentEffect: params.beforePersistentEffect
		});
		attempted += 1;
		repaired += result.repaired;
		skipped += result.skipped;
	}
	return {
		checked,
		attempted,
		repaired,
		skipped
	};
}
async function auditOpenClawPeerDependenciesInManagedNpmRoot(params) {
	const hostRoot = resolveOpenClawPackageRootSync({
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		cwd: process.cwd()
	});
	if (!hostRoot) return {
		checked: 0,
		broken: 0,
		issues: []
	};
	let checked = 0;
	const issues = [];
	for (const packageDir of await listManagedNpmRootPackageDirs(params.npmRoot)) {
		let openClawLinkDependencies;
		try {
			openClawLinkDependencies = await readPackageOpenClawLinkDependencies(packageDir);
		} catch (error) {
			if (!params.onPackageReadError) throw error;
			params.onPackageReadError(error, packageDir);
			continue;
		}
		if (!Object.hasOwn(openClawLinkDependencies, "openclaw")) continue;
		checked += 1;
		const issue = auditOpenClawPeerDependency({
			hostRoot,
			npmRoot: params.npmRoot,
			packageDir
		});
		if (issue) issues.push(issue);
	}
	return {
		checked,
		broken: issues.length,
		issues
	};
}
//#endregion
export { linkOpenClawPeerDependencies as a, resolveOpenClawHostDependency as c, auditOpenClawPeerDependencyLinkSync as i, listNpmPackageDirs as l, auditOpenClawPeerDependenciesInManagedNpmRoot as n, reconcileRegisteredOpenClawHostLinks as o, auditOpenClawPeerDependencyLink as r, relinkOpenClawPeerDependenciesInManagedNpmRoot as s, auditDeclaredOpenClawHostDependency as t };
