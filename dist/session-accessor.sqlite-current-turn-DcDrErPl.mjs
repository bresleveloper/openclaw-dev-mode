import { o as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-BGrlGphn.mjs";
import { i as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-D-WNA1Ka.mjs";
import { g as readTranscriptEventAtSeqInTransaction } from "./session-accessor.sqlite-read-DO8t28O6.mjs";
import { r as readActiveTranscriptEntryAnchorInTransaction } from "./session-accessor.sqlite-transcript-anchor-B0dOIy5w.mjs";
//#region src/config/sessions/session-accessor.sqlite-current-turn.ts
/** Pair one active entry with the exact hydrated view without traversing transcript history. */
function readSessionTranscriptCurrentTurnEntry(scope, options) {
	return withCurrentProjectionSnapshot(scope, ({ database, resolved }) => {
		const fence = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		});
		const version = readTranscriptContextVersionInTransaction(database, resolved.sessionId);
		if (version.generation !== options.version.generation || version.rawSeq !== options.version.rawSeq || version.updatedAt !== options.version.updatedAt) throw new Error("Persisted user turn changed before replay admission");
		const anchor = readActiveTranscriptEntryAnchorInTransaction({
			database,
			resolved: {
				...resolved,
				sessionKey: resolved.sessionKey ?? scope.sessionKey
			},
			entryId: options.entryId
		});
		if (fence && anchor && anchor.rawSeq >= fence.beforeRawSeq) return {
			kind: "current-turn-entry",
			version
		};
		return {
			kind: "current-turn-entry",
			version,
			anchor,
			event: options.includeEntry && anchor ? readTranscriptEventAtSeqInTransaction(database, resolved.sessionId, anchor.rawSeq)?.event : void 0
		};
	}, options);
}
//#endregion
export { readSessionTranscriptCurrentTurnEntry as t };
