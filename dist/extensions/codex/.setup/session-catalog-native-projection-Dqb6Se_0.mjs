import { D as selectCodexCatalogPreviewInput, c as MAX_CWD_LENGTH, d as boundedCatalogString, k as truncateCodexCatalogPreview } from "./session-catalog-parsing-B-qWJh2x.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { n as defineCodexBuildState } from "./build-state-BgEYwu09.mjs";
import { n as detachCodexCatalogString } from "./session-catalog-limits-DEU36Qlo.mjs";
import { t as __exportAll } from "./session-binding-sidecars-BrdV95Fg.mjs";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/codex/src/session-catalog-source.ts
function hasLiveCodexCatalogSource(sources) {
	for (const source of sources) if (!source.closed) return true;
	return false;
}
const getSources = defineCodexBuildState("openclaw.codexCatalogSources", () => ({
	clients: /* @__PURE__ */ new WeakMap(),
	values: /* @__PURE__ */ new WeakMap()
}));
const getEphemeralObservers = defineCodexBuildState("openclaw.codexCatalogEphemeralObservers", () => /* @__PURE__ */ new WeakMap());
/** A passive lifetime fact; the token never retains its client or a lease. */
function codexCatalogSourceForClient(client) {
	const { clients } = getSources();
	let source = clients.get(client);
	if (!source) {
		source = { closed: false };
		clients.set(client, source);
	}
	return source;
}
function closeCodexCatalogClientSource(client) {
	const { clients } = getSources();
	const source = clients.get(client);
	if (source) {
		source.closed = true;
		getEphemeralObservers().delete(source);
	} else clients.set(client, { closed: true });
}
/** The catalog observer is bound once per physical source and released on closure. */
function observeCodexCatalogEphemeralThreads(source, observer) {
	getEphemeralObservers().set(source, observer);
}
function getCodexCatalogSource(value) {
	return value !== null && typeof value === "object" ? getSources().values.get(value) : void 0;
}
function setCodexCatalogSource(value, source) {
	if (source) getSources().values.set(value, source);
	return value;
}
/** Source attribution survives projection without becoming serialized row data. */
function copyCodexCatalogSource(from, to) {
	return setCodexCatalogSource(to, getCodexCatalogSource(from));
}
/** Stamp the final decoded objects, including any bounded catalog DTO replacement. */
function recordCodexCatalogResponseSource(method, result, source) {
	if (result === null || typeof result !== "object") return;
	if (method === "thread/list" && "data" in result && Array.isArray(result.data)) {
		setCodexCatalogSource(result, source);
		for (const thread of result.data) if (thread !== null && typeof thread === "object") setCodexCatalogSource(thread, source);
	} else if ((method === "thread/read" || method === "thread/start" || method === "thread/fork" || method === "thread/resume") && "thread" in result && result.thread !== null && typeof result.thread === "object") {
		setCodexCatalogSource(result, source);
		setCodexCatalogSource(result.thread, source);
		if ("ephemeral" in result.thread && result.thread.ephemeral === true && "id" in result.thread && typeof result.thread.id === "string") getEphemeralObservers().get(source)?.(result.thread.id);
	}
}
//#endregion
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
export { session_catalog_native_projection_exports as a, copyCodexCatalogSource as c, observeCodexCatalogEphemeralThreads as d, recordCodexCatalogResponseSource as f, reuseCodexCatalogPreview as i, getCodexCatalogSource as l, projectCodexCatalogNativeResponse as n, closeCodexCatalogClientSource as o, setCodexCatalogSource as p, projectCodexCatalogNativeThread as r, codexCatalogSourceForClient as s, CODEX_CATALOG_NATIVE_PAGE_LIMIT as t, hasLiveCodexCatalogSource as u };
