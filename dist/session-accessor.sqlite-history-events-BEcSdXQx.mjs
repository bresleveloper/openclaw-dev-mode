import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-DuXjRl_f.mjs";
import { c as readTranscriptDisplayDeltaFromProjection, n as readRecentSessionTranscriptHistoryEventsFromProjection, o as readSessionTranscriptHistoryEventPageFromProjection } from "./session-accessor.sqlite-history-query-B5DhrWSf.mjs";
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
//#endregion
export { readSessionTranscriptHistoryEventPage as n, readTranscriptDisplayDelta as r, readRecentSessionTranscriptHistoryEvents as t };
