import { r as snapshotReaderSlot } from "./plugin-metadata-snapshot-readers-NmF34DMg.mjs";
import { createRequire } from "node:module";
//#region src/plugins/plugin-metadata-snapshot.runtime.ts
/**
* Lazy bridge for plugin metadata snapshot reads. The snapshot modules pull
* the control-plane context (installed-plugin index/kysely), which light
* shared modules and doctor closures must not cold-load at import time.
*
* The snapshot module registers its reader here at eval time, so any process
* that published or scoped a snapshot serves reads through the registered
* instance. The require fallback only covers cold processes that never loaded
* the metadata system (built code loads .js; source/jiti paths resolve .ts).
*/
const require = createRequire(import.meta.url);
function createModuleLoader(candidates) {
	let loaded;
	let attempted = false;
	return () => {
		if (loaded) return loaded;
		if (attempted) return null;
		attempted = true;
		for (const candidate of candidates) try {
			loaded = require(candidate);
			return loaded;
		} catch {}
		return null;
	};
}
const loadCurrentSnapshotModule = createModuleLoader(["./current-plugin-metadata-snapshot.js", "./current-plugin-metadata-snapshot.ts"]);
const loadSnapshotLoaderModule = createModuleLoader(["./plugin-metadata-snapshot.js", "./plugin-metadata-snapshot.ts"]);
/** Reads the current plugin metadata snapshot, loading the snapshot graph lazily. */
function getCurrentPluginMetadataSnapshotRuntime(params) {
	return (snapshotReaderSlot.getCurrentPluginMetadataSnapshot ?? loadCurrentSnapshotModule()?.getCurrentPluginMetadataSnapshot)?.(params) ?? void 0;
}
/** Publishes through the loaded lifecycle owner without waking a cold metadata system. */
function adoptCurrentPluginMetadataSnapshotIfAbsentRuntime(snapshot, options) {
	snapshotReaderSlot.adoptCurrentPluginMetadataSnapshotIfAbsent?.(snapshot, options);
}
/**
* Resolves a plugin metadata snapshot, or undefined when the metadata system
* is unavailable (cold test workers without a CJS TS hook); callers treat that
* as "no manifest policies exist".
*/
function resolvePluginMetadataSnapshotRuntime(params) {
	return (snapshotReaderSlot.resolvePluginMetadataSnapshot ?? loadSnapshotLoaderModule()?.resolvePluginMetadataSnapshot)?.(params);
}
//#endregion
export { getCurrentPluginMetadataSnapshotRuntime as n, resolvePluginMetadataSnapshotRuntime as r, adoptCurrentPluginMetadataSnapshotIfAbsentRuntime as t };
