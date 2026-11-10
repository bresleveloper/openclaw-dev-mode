import { D as selectCodexCatalogPreviewInput, c as MAX_CWD_LENGTH, d as boundedCatalogString, k as truncateCodexCatalogPreview } from "./session-catalog-parsing-DYjky6qv.mjs";
import { r as isJsonObject } from "./protocol-CaPAVwe9.mjs";
import { n as detachCodexCatalogString } from "./session-catalog-limits-B80bYk1h.mjs";
import { r as copyCodexCatalogSource } from "./session-catalog-source-umdHvszf.mjs";
import { t as __exportAll } from "./session-binding-sidecars-D0c8mmZ9.mjs";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/codex/src/session-catalog-native-projection.ts
var session_catalog_native_projection_exports = /* @__PURE__ */ __exportAll({
	CODEX_CATALOG_NATIVE_PAGE_LIMIT: () => 64,
	projectCodexCatalogNativeResponse: () => projectCodexCatalogNativeResponse,
	projectCodexCatalogNativeThread: () => projectCodexCatalogNativeThread,
	reuseCodexCatalogPreview: () => reuseCodexCatalogPreview
});
const CODEX_CATALOG_NATIVE_PAGE_LIMIT = 64;
const STRING_FIELDS = [
	[
		"name",
		500,
		"truncate"
	],
	[
		"cwd",
		MAX_CWD_LENGTH,
		"omit"
	],
	[
		"modelProvider",
		500,
		"truncate"
	],
	[
		"cliVersion",
		500,
		"truncate"
	]
];
/** Drop unused native fields before catalog-owned asynchronous work can retain them. */
function projectCodexCatalogNativeThread(thread, sanitize, cachedPreview) {
	if (!isJsonObject(thread)) throw new Error("Codex catalog response contains an invalid thread");
	const id = boundedCatalogString(thread.id, 256);
	if (!id) throw new Error("Codex catalog response contains an invalid thread id");
	const row = {
		id,
		projectId: boundedCatalogString(thread.projectId, 256, "omit") ?? null
	};
	const sessionId = boundedCatalogString(thread.sessionId, 256, "omit");
	if (sessionId) row.sessionId = sessionId;
	if (thread.ephemeral === true) return copyCodexCatalogSource(thread, {
		...row,
		ephemeral: true
	});
	for (const [field, limit, overflow] of STRING_FIELDS) {
		const value = thread[field];
		const bounded = boundedCatalogString(value, limit, overflow);
		if (value === null || bounded !== void 0) row[field] = bounded ?? null;
	}
	if (typeof thread.path === "string") {
		if (thread.path.length > 4096) throw new Error("Codex catalog rollout path exceeds its length limit");
		row.path = detachCodexCatalogString(thread.path);
	} else if (thread.path === null) row.path = null;
	if (typeof thread.originator === "string") row.originator = detachCodexCatalogString(truncateUtf16Safe(thread.originator, 500));
	for (const field of [
		"createdAt",
		"updatedAt",
		"recencyAt"
	]) {
		const value = thread[field];
		if (value === null || typeof value === "number" && Number.isFinite(value)) row[field] = value;
	}
	const rawPreview = thread.preview;
	const preview = reuseCodexCatalogPreview(row, typeof rawPreview === "string" ? Boolean(rawPreview) : void 0, cachedPreview);
	if (preview !== void 0) row.preview = preview;
	else if (typeof rawPreview === "string") row.preview = rawPreview ? truncateCodexCatalogPreview(selectCodexCatalogPreviewInput(rawPreview), sanitize) : "";
	else if (rawPreview === null) row.preview = null;
	const source = thread.source;
	if (source === "cli" || source === "vscode" || source === "exec" || source === "appServer" || source === "unknown") row.source = source;
	else if (isJsonObject(thread.source) && typeof thread.source.custom === "string" && thread.source.custom.length <= 500) row.source = { custom: detachCodexCatalogString(thread.source.custom) };
	if (isJsonObject(thread.gitInfo)) {
		const branch = boundedCatalogString(thread.gitInfo.branch, 500, "truncate");
		if (branch !== void 0) row.gitInfo = { branch };
	}
	if (isJsonObject(thread.status)) {
		const type = boundedCatalogString(thread.status.type, 64);
		if (type === "active" || type === "idle" || type === "notLoaded" || type === "systemError") {
			const activeFlags = type === "active" && Array.isArray(thread.status.activeFlags) ? thread.status.activeFlags.slice(0, 16).flatMap((flag) => {
				const bounded = boundedCatalogString(flag, 128, "omit");
				return bounded ? [bounded] : [];
			}) : void 0;
			row.status = type === "active" ? {
				type,
				...activeFlags ? { activeFlags } : {}
			} : { type };
		}
	}
	return copyCodexCatalogSource(thread, row);
}
/** Keep only the admitted prefix before an RPC promise retains its response. */
function projectCodexCatalogNativeResponse(response, sanitize, cachedPreview, remainingRows = 64) {
	if (!Array.isArray(response.data) || response.data.length > 64) throw new Error("Codex catalog response exceeds its native page limit");
	const limit = Number.isFinite(remainingRows) ? Math.max(0, Math.min(64, Math.floor(remainingRows))) : 0;
	const page = { data: response.data.slice(0, limit).map((thread) => projectCodexCatalogNativeThread(thread, sanitize, cachedPreview)) };
	for (const field of ["nextCursor", "backwardsCursor"]) {
		const value = response[field];
		if (value === null) page[field] = null;
		else if (value !== void 0) {
			if (typeof value !== "string" || value.length > 4096) throw new Error("Codex catalog response contains an invalid cursor");
			page[field] = detachCodexCatalogString(value);
		}
	}
	return page;
}
/** Reuse resident text without transferring a cache or an unbounded native preview. */
function reuseCodexCatalogPreview(thread, rawPreviewNonempty, cachedPreview) {
	const preview = cachedPreview?.({
		id: thread.id,
		path: typeof thread.path === "string" ? thread.path : null,
		updatedAt: typeof thread.updatedAt === "number" ? thread.updatedAt : null,
		recencyAt: typeof thread.recencyAt === "number" ? thread.recencyAt : null
	});
	return preview !== void 0 && preview.length <= 500 && (rawPreviewNonempty === void 0 || rawPreviewNonempty === Boolean(preview)) ? preview : void 0;
}
//#endregion
export { session_catalog_native_projection_exports as a, reuseCodexCatalogPreview as i, projectCodexCatalogNativeResponse as n, projectCodexCatalogNativeThread as r, CODEX_CATALOG_NATIVE_PAGE_LIMIT as t };
