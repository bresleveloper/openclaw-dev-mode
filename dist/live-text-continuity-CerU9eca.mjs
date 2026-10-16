//#region src/gateway/live-text-continuity.ts
function isLiveTextAppend(previous, next) {
	return previous !== void 0 && next.snapshot.length === previous.length + next.delta.length && next.snapshot.startsWith(previous) && next.snapshot.endsWith(next.delta);
}
//#endregion
export { isLiveTextAppend as t };
