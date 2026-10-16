import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-B5B8MlNt.mjs";
//#region src/agents/workspace-file-cache.ts
const MAX_WORKSPACE_FILE_CACHE_BYTES = 6 * MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES;
const workspaceFileCache = new LruCache(64, {
	maxBytes: MAX_WORKSPACE_FILE_CACHE_BYTES,
	sizeOf: (entry) => entry.sizeBytes
});
function readWorkspaceFileCache(filePath, identity) {
	const entry = workspaceFileCache.get(filePath);
	if (!entry) return;
	if (entry.identity !== identity) {
		workspaceFileCache.delete(filePath);
		return;
	}
	return entry.content;
}
function writeWorkspaceFileCache(params) {
	workspaceFileCache.set(params.filePath, {
		content: params.content,
		identity: params.identity,
		sizeBytes: Buffer.byteLength(params.content, "utf8")
	});
}
function retireWorkspaceFileCache(workspaceRoot) {
	const rootIdentityPath = workspaceRoot.normalize("NFC");
	for (const filePath of workspaceFileCache.keys()) if (isPathInside(rootIdentityPath, filePath.normalize("NFC"))) workspaceFileCache.delete(filePath);
}
//#endregion
export { retireWorkspaceFileCache as n, writeWorkspaceFileCache as r, readWorkspaceFileCache as t };
