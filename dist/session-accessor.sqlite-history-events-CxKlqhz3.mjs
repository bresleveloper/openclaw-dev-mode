import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-D-WNA1Ka.mjs";
import { a as readSessionTranscriptHistoryEventPageFromProjection, l as resolveVisibleHistoryEventCount, s as readTranscriptDisplayDeltaFromProjection, t as readRecentSessionTranscriptHistoryEventsFromProjection } from "./session-accessor.sqlite-history-query-Be6-ei7a.mjs";
//#region src/config/sessions/session-accessor.sqlite-history-events.ts
function readTranscriptDisplayDelta(scope, limits = {}) {
	const readLimits = { ...limits };
	return withCurrentProjectionSnapshot(scope, (projection) => readTranscriptDisplayDeltaFromProjection(projection, readLimits));
}
function readRecentSessionTranscriptHistoryEvents(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => readRecentSessionTranscriptHistoryEventsFromProjection(projection, options), options);
}
function readSessionTranscriptHistoryEventPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => readSessionTranscriptHistoryEventPageFromProjection(projection, options), options);
}
function readSessionTranscriptHistoryEventCount(scope) {
	return withCurrentProjectionSnapshot(scope, resolveVisibleHistoryEventCount);
}
//#endregion
export { readTranscriptDisplayDelta as i, readSessionTranscriptHistoryEventCount as n, readSessionTranscriptHistoryEventPage as r, readRecentSessionTranscriptHistoryEvents as t };
