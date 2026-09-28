import { l as getPluginCacheRoot, o as getPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { r as getPluginRegistryState } from "./runtime-state-C5tDvNBc.mjs";
import { i as getPluginRuntimeGatewayRequestScope, n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import path from "node:path";
//#region src/plugins/runtime-context.ts
function isSourceInsideRecordRoot(record, rootDir, source, roots) {
	if (process.platform === "win32" || !path.isAbsolute(rootDir)) return isPathInside(rootDir, source);
	let prepared = roots.get(record);
	if (prepared?.rootDir !== rootDir) {
		const resolvedRootDir = path.resolve(rootDir);
		prepared = {
			rootDir,
			resolvedRootDir,
			prefix: resolvedRootDir.endsWith(path.sep) ? resolvedRootDir : resolvedRootDir + path.sep
		};
		roots.set(record, prepared);
	}
	return source === prepared.resolvedRootDir || source.startsWith(prepared.prefix);
}
/** Exact context identity disambiguates package siblings; a unique root works for host callers. */
function resolvePluginRuntimeRecord(params) {
	const root = params.pluginRoot ? getPluginCacheRoot(params.pluginRoot).rootDir : void 0;
	const source = params.modulePath ? path.resolve(params.modulePath) : void 0;
	const roots = getPluginCache().runtimeRecordRoots;
	const pluginId = params.pluginId ?? getPluginRegistryState()?.registrationContext?.pluginId ?? getPluginRuntimeGatewayRequestScope()?.pluginId;
	const records = getPluginRegistryForContext()?.plugins ?? [];
	const matchesSource = (record) => record.rootDir && (root ? getPluginCacheRoot(record.rootDir).rootDir === root : isSourceInsideRecordRoot(record, record.rootDir, source, roots) || getPluginInstance(record)?.hasModuleSource(source) === true);
	if (pluginId !== void 0) {
		const owner = records.find((record) => record.id === pluginId && matchesSource(record));
		if (owner) return owner;
	}
	let first;
	let count = 0;
	for (const record of records) {
		if (pluginId !== void 0 && record.id === pluginId || !matchesSource(record)) continue;
		first ??= record;
		count++;
	}
	if (count > 1 || params.pluginId && count) throw new Error(`Plugin public surface ${root ?? source} has ambiguous runtime ownership; specify its plugin id.`);
	return first;
}
//#endregion
export { resolvePluginRuntimeRecord as t };
