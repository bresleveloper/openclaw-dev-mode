import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import "./utils-gjJ-tD2q.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-LfC_CFuw.mjs";
import { i as resolveOpenClawDevSourceRoot } from "./dev-source-root-TlYYNN5t.mjs";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-CulPgmRu.mjs";
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
