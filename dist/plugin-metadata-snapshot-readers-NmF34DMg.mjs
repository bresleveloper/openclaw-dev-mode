import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
//#region src/plugins/plugin-metadata-snapshot-readers.ts
const snapshotReaderSlot = resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaders"), () => ({}));
const readerCustody = resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaderCustody"), () => ({ owners: 0 }));
const readerKeys = [
	"adoptCurrentPluginMetadataSnapshotIfAbsent",
	"getCurrentPluginMetadataSnapshot",
	"resolvePluginMetadataSnapshot",
	"loadPluginMetadataSnapshot"
];
/** Keep the running installation's readers until its final Gateway finishes closing. */
function retainPluginMetadataSnapshotReaders() {
	if (readerCustody.owners++ === 0) for (const key of readerKeys) {
		let reader = snapshotReaderSlot[key];
		Object.defineProperty(snapshotReaderSlot, key, {
			configurable: true,
			enumerable: true,
			get: () => reader,
			set: (next) => {
				reader ??= next;
			}
		});
	}
	let released = false;
	return () => {
		if (released) return;
		released = true;
		if (--readerCustody.owners === 0) for (const key of readerKeys) Object.defineProperty(snapshotReaderSlot, key, {
			configurable: true,
			enumerable: true,
			writable: true,
			value: snapshotReaderSlot[key]
		});
	};
}
/** Called at module evaluation; a retained Gateway keeps its registered readers. */
function registerPluginMetadataSnapshotReaders(readers) {
	Object.assign(snapshotReaderSlot, readers);
}
//#endregion
export { retainPluginMetadataSnapshotReaders as n, snapshotReaderSlot as r, registerPluginMetadataSnapshotReaders as t };
