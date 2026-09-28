import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { n as readOpenedLocalAgentAvatarDataUrl } from "./identity-avatar-file-DbxXI2gj.mjs";
import fs from "node:fs";
import { createHash } from "node:crypto";
//#region src/gateway/assistant-avatar-cache.ts
const GATEWAY_AVATAR_DATA_URL_CACHE_MAX_ENTRIES = 4;
/** Include the representation version so a changed thumbnail policy cannot reuse old bytes. */
function gatewayAvatarImageRevision(source) {
	return createHash("sha256").update("thumbnail-128-png-v1:").update("file" in source ? JSON.stringify([source.file.path, source.file.stat]) : source.dataUrl).digest("hex").slice(0, 16);
}
function createGatewayAvatarDataUrlCache(params) {
	const maxEntries = params?.maxEntries ?? GATEWAY_AVATAR_DATA_URL_CACHE_MAX_ENTRIES;
	const read = params?.read ?? readOpenedLocalAgentAvatarDataUrl;
	const close = params?.close ?? ((fd) => fs.closeSync(fd));
	const entries = /* @__PURE__ */ new Map();
	return { read(opened) {
		const cached = entries.get(opened.path);
		if (cached && cached.ctimeMs === opened.stat.ctimeMs && cached.dev === opened.stat.dev && cached.ino === opened.stat.ino && cached.mtimeMs === opened.stat.mtimeMs && cached.size === opened.stat.size) {
			close(opened.fd);
			entries.delete(opened.path);
			entries.set(opened.path, cached);
			return cached.dataUrl;
		}
		entries.delete(opened.path);
		const dataUrl = read(opened);
		if (!dataUrl || maxEntries <= 0) return dataUrl;
		entries.set(opened.path, {
			ctimeMs: opened.stat.ctimeMs,
			dev: opened.stat.dev,
			ino: opened.stat.ino,
			mtimeMs: opened.stat.mtimeMs,
			size: opened.stat.size,
			dataUrl
		});
		pruneMapToMaxSize(entries, maxEntries);
		return dataUrl;
	} };
}
//#endregion
export { gatewayAvatarImageRevision as n, createGatewayAvatarDataUrlCache as t };
