//#region src/config/sessions/session-accessor.sqlite-transcript-append-result.ts
function isTranscriptMessageAppendCurrentTail(snapshot) {
	return snapshot.result !== void 0 && snapshot.visibleTail.generation !== null && snapshot.visibleTail.generation === snapshot.after.generation && snapshot.visibleTail.entryId === snapshot.result.messageId;
}
function requireTranscriptEventAppendSnapshot(result, message) {
	if (result.ok && result.value.result.appended) return {
		...result.value,
		result: result.value.result
	};
	const cause = result.ok ? { code: "transcript-event-not-appended" } : result.error;
	throw new Error(`${message}: ${cause.code}`, { cause });
}
//#endregion
export { requireTranscriptEventAppendSnapshot as n, isTranscriptMessageAppendCurrentTail as t };
