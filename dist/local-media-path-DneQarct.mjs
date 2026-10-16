import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BdNs7xa2.mjs";
import path from "node:path";
import { safeFileURLToPath } from "@openclaw/fs-safe/advanced";
//#region src/media/local-media-path.ts
const DATA_URL_RE = /^data:/i;
const WINDOWS_DRIVE_RE = /^[A-Za-z]:[\\/]/;
/** Resolves a media source to a local path when it is not a remote or data URL. */
function resolveLocalMediaPath(source) {
	const trimmed = source.trim();
	if (!trimmed || isPassThroughRemoteMediaSource(trimmed) || DATA_URL_RE.test(trimmed)) return;
	if (/^file:/iu.test(trimmed)) try {
		return safeFileURLToPath(trimmed);
	} catch {
		return;
	}
	if (trimmed.startsWith("~")) return resolveUserPath(trimmed);
	if (path.isAbsolute(trimmed) || WINDOWS_DRIVE_RE.test(trimmed)) return path.resolve(trimmed);
}
//#endregion
export { resolveLocalMediaPath as t };
