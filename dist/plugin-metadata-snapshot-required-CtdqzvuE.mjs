import { i as isPluginSourceModulePath, u as tryNativeRequireModule } from "./native-module-require-CFiIAPP0.mjs";
import { r as snapshotReaderSlot } from "./plugin-metadata-snapshot-readers-NmF34DMg.mjs";
import { fileURLToPath } from "node:url";
//#region src/plugins/plugin-metadata-snapshot-required.ts
function loadRequiredSnapshotReaders() {
	const source = isPluginSourceModulePath(fileURLToPath(import.meta.url));
	const modulePath = fileURLToPath(new URL(source ? "./plugin-metadata-readers.runtime.ts" : "./plugin-metadata-readers.runtime.js", import.meta.url));
	const native = tryNativeRequireModule(modulePath);
	if (!native.ok) throw new Error(`Host plugin metadata runtime requires native loading: ${modulePath}`);
	return native.moduleExport;
}
/** Reads current policy through its canonical owner, requiring a working runtime. */
function getCurrentPluginMetadataSnapshotRequiredRuntime(params) {
	return (snapshotReaderSlot.getCurrentPluginMetadataSnapshot ?? loadRequiredSnapshotReaders().getCurrentPluginMetadataSnapshot)(params);
}
/** Loads metadata through its canonical owner without suppressing discovery errors. */
function loadPluginMetadataSnapshotRuntime(params) {
	return (snapshotReaderSlot.loadPluginMetadataSnapshot ?? loadRequiredSnapshotReaders().loadPluginMetadataSnapshot)(params);
}
//#endregion
export { loadPluginMetadataSnapshotRuntime as n, getCurrentPluginMetadataSnapshotRequiredRuntime as t };
