//#region packages/media-core/src/content-length.ts
/** Parses a Content-Length header as a safe integer or rejects malformed values. */
function parseMediaContentLength(raw) {
	if (raw === null) return null;
	const trimmed = raw.trim();
	if (!/^\d+$/.test(trimmed)) throw new Error(`invalid content-length header: ${raw}`);
	const size = Number(trimmed);
	if (!Number.isSafeInteger(size)) throw new Error(`invalid content-length header: ${raw}`);
	return size;
}
//#endregion
export { parseMediaContentLength as t };
