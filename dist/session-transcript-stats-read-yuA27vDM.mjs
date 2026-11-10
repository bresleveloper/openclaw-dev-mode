import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as IncognitoSessionSyncAccessError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { t as readTranscriptStatsBatchReadOnlySync$1 } from "./session-accessor.sqlite-transcript-stats-read-VFRrZZmv.mjs";
import { isMainThread } from "node:worker_threads";
//#region packages/memory-host-sdk/src/host/session-memory-authority.ts
/** Synchronous SDK calls cannot open memory-only session storage. */
function assertBoundIncognitoMemorySyncAccess(scope, method, replacement) {
	if (captureMemoryOwner(scope)) throw new IncognitoSessionSyncAccessError(method, replacement);
}
function captureMemoryOwner(scope) {
	const signal = getAsyncWorkSignal();
	const assertCurrent = () => signal?.throwIfAborted();
	return captureSessionActorStorageOwner(scope, {
		assertCurrent,
		authorize: assertCurrent
	});
}
//#endregion
//#region packages/memory-host-sdk/src/host/session-transcript-stats-read.ts
/** @deprecated Await readTranscriptStatsBatchReadOnlyAsync. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
function readTranscriptStatsBatchReadOnlySync(scopes) {
	if (isMainThread) warnPluginSdkDeprecation({
		family: "session-store",
		method: "readTranscriptStatsBatchReadOnlySync",
		replacement: "readTranscriptStatsBatchReadOnlyAsync"
	});
	for (const scope of scopes) assertBoundIncognitoMemorySyncAccess(scope, "readTranscriptStatsBatchReadOnlySync", "readTranscriptStatsBatchReadOnlyAsync");
	return readTranscriptStatsBatchReadOnlySync$1(scopes);
}
//#endregion
export { assertBoundIncognitoMemorySyncAccess as n, captureMemoryOwner as r, readTranscriptStatsBatchReadOnlySync as t };
