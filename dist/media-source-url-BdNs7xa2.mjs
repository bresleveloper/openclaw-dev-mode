//#region packages/media-core/src/media-source-url.ts
const REMOTE_MEDIA_URL_RE = /^(?:https?|mxc|buffer):\/\//i;
/** Returns true for remote media URLs that should stay URL-backed instead of local-file-backed. */
function isPassThroughRemoteMediaSource(value) {
	const normalized = value?.trim() ?? "";
	return REMOTE_MEDIA_URL_RE.test(normalized);
}
//#endregion
export { isPassThroughRemoteMediaSource as t };
