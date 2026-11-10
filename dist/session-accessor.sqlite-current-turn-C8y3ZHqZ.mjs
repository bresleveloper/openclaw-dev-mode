import { i as isIndexedSessionEntry } from "./session-entry-codec-DSMJ1XFN.mjs";
import { i as SessionWorkStartChangedError } from "./work-start-error-BI-UhSB2.mjs";
import { r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { h as readTranscriptEventAtSeqInTransaction } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { a as readActiveTranscriptEntryAnchorFromProjection, s as readActiveTranscriptEntryIdentityInSnapshot } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-BECHzdvs.mjs";
//#region src/config/sessions/session-accessor.sqlite-current-turn.ts
/** Pair one active entry with the exact hydrated view without traversing transcript history. */
function readSessionTranscriptCurrentTurnEntry(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const { database, resolved } = projection;
		const fence = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		});
		const version = projection.version;
		if (version.generation !== options.version.generation || version.rawSeq !== options.version.rawSeq || version.updatedAt !== options.version.updatedAt) throw new SessionWorkStartChangedError("Persisted user turn changed before replay admission. Retry the turn.");
		const anchor = readActiveTranscriptEntryAnchorFromProjection(projection, options.entryId);
		if (fence && anchor && anchor.rawSeq >= fence.beforeRawSeq) return {
			kind: "current-turn-entry",
			version
		};
		const identity = options.includeEntry ? readActiveTranscriptEntryIdentityInSnapshot(projection, options.entryId) : void 0;
		const event = identity && (!fence || identity.seq < fence.beforeRawSeq) ? readTranscriptEventAtSeqInTransaction(database, resolved.sessionId, identity.seq)?.event : void 0;
		return {
			kind: "current-turn-entry",
			version,
			anchor,
			event: identity && isIndexedSessionEntry(event) && event.id === options.entryId && event.parentId === identity.parentId ? event : void 0
		};
	}, options);
}
//#endregion
export { readSessionTranscriptCurrentTurnEntry };
