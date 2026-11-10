import { n as resolveBunGlobalInstallOwner } from "./detect-package-manager-Bj0ojQ-Y.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/update-native-package-owner.ts
/**
* Resolves pnpm's global-dir from its active global package root.
* pnpm 10 used `<globalDir>/<version>/node_modules`; pnpm 11 uses
* `<globalDir>/v<version>` with isolated package projects below it.
*/
function resolvePnpmGlobalDirFromGlobalRoot(globalRoot) {
	const trimmed = globalRoot?.trim();
	if (!trimmed) return null;
	const normalized = path.resolve(trimmed);
	if (/^v\d+$/u.test(path.basename(normalized))) return path.dirname(normalized);
	if (path.basename(normalized) !== "node_modules") return null;
	const layoutDir = path.dirname(normalized);
	return /^\d+$/u.test(path.basename(layoutDir)) ? path.dirname(layoutDir) : null;
}
function resolvePnpmHome(globalRoot) {
	const globalDir = resolvePnpmGlobalDirFromGlobalRoot(globalRoot);
	return globalDir && path.basename(globalDir) === "global" ? path.dirname(globalDir) : null;
}
/** Resolve the installation-local launcher before considering pnpm from PATH. */
function resolvePnpmCommand(globalRoot) {
	const home = resolvePnpmHome(globalRoot);
	if (!home) return;
	const dirs = path.basename(globalRoot ?? "") === "node_modules" ? [home, path.join(home, "bin")] : [path.join(home, "bin"), home];
	const name = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
	return dirs.map((dir) => path.join(dir, name)).find(fs.existsSync);
}
/** Native activation replaces the complete manager project, not only its package directory. */
function resolveNativePackageProjectRoot(target, env = process.env) {
	if (target.manager === "pnpm") return resolvePnpmGlobalDirFromGlobalRoot(target.globalRoot);
	if (target.manager !== "bun") return null;
	const owner = resolveBunGlobalInstallOwner(target.packageRoot, env);
	if (owner) return owner.globalProjectRoot;
	const modules = target.globalRoot?.trim();
	if (!modules) return null;
	const normalized = path.resolve(modules);
	return path.basename(normalized) === "node_modules" ? path.dirname(normalized) : null;
}
//#endregion
export { resolvePnpmHome as i, resolvePnpmCommand as n, resolvePnpmGlobalDirFromGlobalRoot as r, resolveNativePackageProjectRoot as t };
