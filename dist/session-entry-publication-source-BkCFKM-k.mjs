import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { T as readSqliteDatabasePendingWriteToken, j as readSqliteDatabaseWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { d as readSqliteNativeMutationRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { serialize } from "node:v8";
//#region src/config/sessions/session-entry-publication-source.ts
const MAX_SESSION_ENTRY_PUBLICATION_BYTES = 8388608;
/** Optional cache facts cannot consume the required receipt's transport allowance. */
function hasSessionEntryPublicationCapacity(envelope) {
	try {
		return serialize(envelope).byteLength <= MAX_SESSION_ENTRY_PUBLICATION_BYTES;
	} catch {
		return false;
	}
}
const selectedSources = resolveGlobalSingleton(Symbol.for("openclaw.sessionEntryPublicationSources"), () => /* @__PURE__ */ new WeakMap());
/** Dropped optional facts cannot be certified again when native publication settles. */
function discardSessionEntryPublicationSource(source) {
	selectedSources.delete(source);
	delete source.writeToken;
}
/** Selection and final serialization must describe the same native transaction state. */
function captureSessionEntryPublicationSource(database, source) {
	const mutationRevision = readSqliteNativeMutationRevision(database);
	if (mutationRevision !== void 0) selectedSources.set(source, {
		database,
		mutationRevision
	});
	return source;
}
/** Seal final worker candidates or committed native publications after their last row mutation. */
function sealSessionEntryPublicationSource(source) {
	const selected = selectedSources.get(source);
	source.writeToken = selected && readSqliteNativeMutationRevision(selected.database) === selected.mutationRevision ? selected.database.isTransaction ? readSqliteDatabasePendingWriteToken(selected.database) : readSqliteDatabaseWriteTokenForPath(source.canonicalPath ?? source.filename) : void 0;
}
//#endregion
export { sealSessionEntryPublicationSource as i, discardSessionEntryPublicationSource as n, hasSessionEntryPublicationCapacity as r, captureSessionEntryPublicationSource as t };
