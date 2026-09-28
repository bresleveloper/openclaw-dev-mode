import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import * as module from "node:module";
import path from "node:path";
//#region src/infra/node-compile-cache-env.ts
const COMPILE_CACHE_BASE_KEY = Symbol.for("openclaw.nodeCompileCacheBase");
function compileCacheOwner() {
	return resolveGlobalSingleton(COMPILE_CACHE_BASE_KEY, () => ({}));
}
/** Enable through OpenClaw, retaining only the input to a successful first enable. */
function enableOwnedNodeCompileCache(directory) {
	const baseDirectory = path.resolve(directory);
	const result = module.enableCompileCache(directory);
	const enabled = module.constants?.compileCacheStatus?.ENABLED;
	if (enabled !== void 0 && result?.status === enabled) compileCacheOwner().baseDirectory ??= baseDirectory;
}
function resolveNodeCompileCacheEnv(env = process.env) {
	if (env.NODE_COMPILE_CACHE !== void 0 || env.NODE_DISABLE_COMPILE_CACHE !== void 0) return env;
	const directory = compileCacheOwner().baseDirectory;
	return directory ? {
		...env,
		NODE_COMPILE_CACHE: directory
	} : env;
}
//#endregion
export { resolveNodeCompileCacheEnv as n, enableOwnedNodeCompileCache as t };
