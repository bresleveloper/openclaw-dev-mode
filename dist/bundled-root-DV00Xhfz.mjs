import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-BGJkK8G5.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/channels/plugins/bundled-root.ts
/**
* Bundled channel package-root resolver.
*
* Computes cache scopes for generated channel metadata across source and packaged layouts.
*/
const OPENCLAW_PACKAGE_ROOT = resolveOpenClawPackageRootSync({
	argv1: process.argv[1],
	cwd: process.cwd(),
	moduleUrl: import.meta.url.startsWith("file:") ? import.meta.url : void 0
}) ?? (import.meta.url.startsWith("file:") ? path.resolve(fileURLToPath(new URL("../../..", import.meta.url))) : process.cwd());
function derivePackageRootFromExtensionsDir(extensionsDir) {
	const parentDir = path.dirname(extensionsDir);
	const parentBase = path.basename(parentDir);
	if (parentBase === "dist" || parentBase === "dist-runtime") return path.dirname(parentDir);
	return parentDir;
}
/**
* Resolves the package/cache scope used for bundled channel plugin metadata.
*/
function resolveBundledChannelRootScope(env = process.env) {
	const bundledPluginsDir = resolveBundledPluginsDir(env);
	if (!bundledPluginsDir) return {
		packageRoot: OPENCLAW_PACKAGE_ROOT,
		cacheKey: OPENCLAW_PACKAGE_ROOT
	};
	const resolvedPluginsDir = path.resolve(bundledPluginsDir);
	return {
		packageRoot: path.basename(resolvedPluginsDir) === "extensions" ? derivePackageRootFromExtensionsDir(resolvedPluginsDir) : resolvedPluginsDir,
		cacheKey: resolvedPluginsDir,
		pluginsDir: resolvedPluginsDir
	};
}
//#endregion
export { resolveBundledChannelRootScope as t };
