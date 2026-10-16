import { n as readPackageManagerSpec } from "./package-json-DuhFvY5l.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/infra/detect-package-manager.ts
async function exists(p) {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}
/** Resolves Bun's global project from its installed owner rather than unrelated caller settings. */
function resolveBunGlobalInstallOwner(pkgRoot, env = process.env) {
	const configuredInstall = env.BUN_INSTALL?.trim();
	const configuredGlobalProject = env.BUN_INSTALL_GLOBAL_DIR?.trim();
	if (pkgRoot == null) {
		const bunInstall = configuredInstall || path.join(os.homedir(), ".bun");
		const globalProjectRoot = path.resolve(configuredGlobalProject || path.join(bunInstall, "install", "global"));
		return {
			globalRoot: path.join(globalProjectRoot, "node_modules"),
			globalProjectRoot,
			...!configuredGlobalProject || configuredInstall ? { bunInstall: path.resolve(bunInstall) } : {}
		};
	}
	const trimmed = pkgRoot.trim();
	if (!trimmed) return null;
	let globalRoot = path.dirname(path.resolve(trimmed));
	if (path.basename(globalRoot).startsWith("@")) globalRoot = path.dirname(globalRoot);
	if (path.basename(globalRoot) !== "node_modules") return null;
	const globalProjectRoot = path.dirname(globalRoot);
	const installRoot = path.dirname(globalProjectRoot);
	const conventionalLayout = path.basename(globalProjectRoot) === "global" && path.basename(installRoot) === "install";
	const configuredProjectMatches = configuredGlobalProject !== void 0 && path.resolve(configuredGlobalProject) === globalProjectRoot;
	if (!conventionalLayout && !configuredProjectMatches) return null;
	const bunInstall = conventionalLayout ? path.dirname(installRoot) : configuredInstall;
	return {
		globalRoot,
		globalProjectRoot,
		...bunInstall ? { bunInstall: path.resolve(bunInstall) } : {}
	};
}
function resolvePnpmNodeModulesRoot(root) {
	const resolved = path.resolve(root);
	const parts = resolved.split(path.sep);
	const pnpmIndex = parts.lastIndexOf(".pnpm");
	if (pnpmIndex > 0) {
		const layoutRoot = parts.slice(0, pnpmIndex).join(path.sep) || path.sep;
		return path.basename(layoutRoot) === "node_modules" ? layoutRoot : path.join(layoutRoot, "node_modules");
	}
	const parent = path.dirname(resolved);
	return path.basename(parent) === "node_modules" ? parent : null;
}
async function isPnpmOwnedPackageRoot(root) {
	const nodeModulesRoot = resolvePnpmNodeModulesRoot(root);
	return nodeModulesRoot !== null && await exists(path.join(nodeModulesRoot, ".modules.yaml"));
}
/** Detects the package manager that owns a package root from manifests, locks, and install layout. */
async function detectPackageManager(root) {
	const pm = (await readPackageManagerSpec(root))?.split("@")[0]?.trim();
	const files = await fs.readdir(root).catch(() => []);
	const hasNpmShrinkwrap = files.includes("npm-shrinkwrap.json");
	const hasPnpmLock = files.includes("pnpm-lock.yaml");
	const hasBunLock = files.includes("bun.lock") || files.includes("bun.lockb");
	if (resolveBunGlobalInstallOwner(root)) return "bun";
	if (hasNpmShrinkwrap) {
		if (pm === "pnpm" && (hasPnpmLock || await isPnpmOwnedPackageRoot(root))) return "pnpm";
		if (pm === "bun" && hasBunLock) return "bun";
		return "npm";
	}
	if (pm === "pnpm" || pm === "bun" || pm === "npm") return pm;
	if (hasPnpmLock) return "pnpm";
	if (hasBunLock) return "bun";
	if (files.includes("package-lock.json")) return "npm";
	return null;
}
//#endregion
export { resolveBunGlobalInstallOwner as n, detectPackageManager as t };
