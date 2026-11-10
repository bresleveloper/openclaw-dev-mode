import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
//#region src/plugins/plugin-metadata-snapshot-readers.ts
const readerLifetime = resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaderCustody"), () => ({ owners: 0 }));
const readerKeys = [
	"adoptCurrentPluginMetadataSnapshotIfAbsent",
	"getCurrentPluginMetadataSnapshot",
	"resolvePluginMetadataSnapshot",
	"loadPluginMetadataSnapshot"
];
const snapshotReaderSlot = resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaders"), () => ({}), (readers) => {
	if (!readerLifetime.owners) for (const key of readerKeys) delete readers[key];
}, "close-only");
/** Keep the running installation's readers until the Gateway finishes closing. */
function retainPluginMetadataSnapshotReaders() {
	readerLifetime.owners = 1;
	for (const key of readerKeys) {
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
	return () => {
		readerLifetime.owners = 0;
		for (const key of readerKeys) Object.defineProperty(snapshotReaderSlot, key, {
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
