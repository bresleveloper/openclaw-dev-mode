//#region src/media/inbound-media-uri.ts
/** Error raised when a media reference cannot be mapped to an allowed local media file. */
var MediaReferenceError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.name = "MediaReferenceError";
	}
};
/** Strips legacy MEDIA: prefixes while preserving canonical media:// references. */
function normalizeMediaReferenceSource(source) {
	const trimmed = source.trim();
	if (/^media:\/\//i.test(trimmed)) return trimmed;
	return trimmed.replace(/^\s*MEDIA\s*:\s*/i, "").trim();
}
/** Parses canonical inbound media-store URIs and rejects nested or cross-bucket references. */
function parseInboundMediaUri(source) {
	const normalizedSource = normalizeMediaReferenceSource(source);
	if (!/^media:\/\//i.test(normalizedSource)) return null;
	let parsed;
	try {
		parsed = new URL(normalizedSource);
	} catch (err) {
		throw new MediaReferenceError("invalid-path", `Invalid media URI: ${normalizedSource}`, { cause: err });
	}
	if (parsed.hostname !== "inbound") throw new MediaReferenceError("path-not-allowed", `Unsupported media URI location: ${parsed.hostname || "(missing)"}`);
	if (parsed.username || parsed.password || parsed.search || parsed.hash) throw new MediaReferenceError("invalid-path", `Invalid media URI: ${normalizedSource}`);
	let id;
	try {
		id = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
	} catch (err) {
		throw new MediaReferenceError("invalid-path", `Invalid media URI: ${normalizedSource}`, { cause: err });
	}
	if (!id || id === "." || id === ".." || id.includes("/") || id.includes("\\") || id.includes("\0")) throw new MediaReferenceError("invalid-path", `Invalid media URI: ${normalizedSource}`);
	return {
		id,
		normalizedSource
	};
}
//#endregion
export { normalizeMediaReferenceSource as n, parseInboundMediaUri as r, MediaReferenceError as t };
