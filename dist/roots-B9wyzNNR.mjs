import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import "./utils-DgZn2dLu.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-DkyLPnyV.mjs";
import { i as resolveOpenClawDevSourceRoot } from "./dev-source-root-T6MQRtRo.mjs";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-R7__5hE9.mjs";
import path from "node:path";
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
export { resolvePluginSourceRoots as n, resolvePluginCacheInputs as t };
