import { serveWorkerTasks } from "openclaw/plugin-sdk/worker-task-server";
import { sanitizeTerminalText } from "openclaw/plugin-sdk/terminal-safe-text";
import { isRecord, truncateUtf16Safe } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/codex/src/app-server/protocol-json.ts
function isRpcResponse(message) {
	return message !== null && typeof message === "object" && "id" in message && (typeof message.id === "number" || typeof message.id === "string") && !("method" in message);
}
// extensions/codex/src/app-server/protocol.ts
function isJsonObject(value) {
	return isRecord(value);
}
// extensions/codex/src/session-catalog-limits.ts
/** Preserve UTF-16 code units without retaining an oversized source string. */
function detachCodexCatalogString(value) {
	return Buffer.from(value, "utf16le").toString("utf16le");
}
const MAX_CWD_LENGTH = 4096;
const MAX_SESSION_PREVIEW_LENGTH = 500;
const SESSION_PREVIEW_PREFIX_LENGTH = 2048;
function boundedCatalogString(value, maxLength, overflow = "omit") {
	if (typeof value !== "string") return;
	const normalized = value.trim();
	if (!normalized) return;
	if (normalized.length <= maxLength) return detachCodexCatalogString(normalized);
	return overflow === "truncate" ? detachCodexCatalogString(truncateUtf16Safe(normalized, maxLength)) : void 0;
}
/** Detach the small preview from V8's potentially large sliced-string backing store. */
function truncateCodexCatalogPreview(value, sanitize) {
	let normalized;
	if (value.length > SESSION_PREVIEW_PREFIX_LENGTH) {
		const prefix = value.slice(0, SESSION_PREVIEW_PREFIX_LENGTH).replace(/\s+/g, " ").trim();
		if (prefix.length > MAX_SESSION_PREVIEW_LENGTH && !/\p{Cc}/u.test(prefix)) normalized = prefix;
	}
	const preview = truncateUtf16Safe(normalized ?? sanitize(value.replace(/\s+/g, " ")).trim(), MAX_SESSION_PREVIEW_LENGTH);
	return Buffer.from(preview, "utf8").toString("utf8");
}
// extensions/codex/package.json
var version = "2026.11.10";
// extensions/codex/src/build-state.ts
/**
* Duplicate module copies share one immutable published version's state.
* In-process restarts retain old records and callbacks for their old owners.
* Local rebuilds without a version bump deliberately share the same state.
*/
function codexBuildSymbol(name) {
	return Symbol.for(`${name}@${version}`);
}
function defineCodexBuildState(name, create) {
	const key = codexBuildSymbol(name);
	const globalState = globalThis;
	return () => globalState[key] ??= create();
}
// extensions/codex/src/session-catalog-source.ts
const getSources = defineCodexBuildState("openclaw.codexCatalogSources", () => ({
	clients: /* @__PURE__ */ new WeakMap(),
	values: /* @__PURE__ */ new WeakMap()
}));
defineCodexBuildState("openclaw.codexCatalogEphemeralObservers", () => /* @__PURE__ */ new WeakMap());
function getCodexCatalogSource(value) {
	return getSources().values.get(value);
}
function setCodexCatalogSource(value, source) {
	if (source) getSources().values.set(value, source);
	return value;
}
/** Source attribution survives projection without becoming serialized row data. */
function copyCodexCatalogSource(from, to) {
	return setCodexCatalogSource(to, getCodexCatalogSource(from));
}
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
	else if (typeof rawPreview === "string") row.preview = rawPreview ? truncateCodexCatalogPreview(rawPreview, sanitize) : "";
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
	const data = [];
	for (let index = 0; index < Math.min(limit, response.data.length); index++) data.push(projectCodexCatalogNativeThread(response.data[index], sanitize, cachedPreview));
	const page = { data };
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
		path: thread.path ?? null,
		updatedAt: thread.updatedAt ?? null,
		recencyAt: thread.recencyAt ?? null
	});
	return preview !== void 0 && preview.length <= 500 && (rawPreviewNonempty === void 0 || rawPreviewNonempty === Boolean(preview)) ? preview : void 0;
}
// extensions/codex/src/app-server/client-catalog-route.ts
function codexCatalogResponseRoute(id) {
	return typeof id === "number" && Number.isSafeInteger(id) && id >= 2 ** 52 ? {
		id,
		kind: id % 2 === 1 ? "list" : "thread"
	} : void 0;
}
// extensions/codex/src/app-server/client-message-decoder.ts
/** Parses the single JSON value in an app-server LF-delimited frame. */
function parseCodexAppServerMessage(line, reportError) {
	const frame = line.trim();
	if (!frame) return;
	try {
		return JSON.parse(frame);
	} catch {
		reportError({
			byteCount: Buffer.byteLength(frame),
			charCount: frame.length,
			fragmentCount: 1
		});
		return;
	}
}
// extensions/codex/src/app-server/client-catalog-response.ts
/** Each worker invocation parses and projects one complete transport frame. */
function decodeCodexCatalogFrame(input) {
	const failures = [];
	const parsed = parseCodexAppServerMessage(Buffer.from(input.bytes.buffer, input.bytes.byteOffset, input.bytes.byteLength).toString("utf8"), (failure) => failures.push(failure));
	if (input.oversizedSingleton) try {
		if (input.route === "unresolved" || !isRpcResponse(parsed) || parsed.id !== input.route.id || parsed.error || !isJsonObject(parsed.result) || !Array.isArray(parsed.result.data) || parsed.result.data.length !== 1 || parsed.result.nextCursor === void 0) return { failures };
		const page = projectCodexCatalogNativeResponse(parsed.result, sanitizeTerminalText, void 0, 1);
		page.data[0].catalogError = "oversized-thread";
		if (input.remainingRows === 0) page.data = [];
		return {
			message: {
				id: parsed.id,
				result: page
			},
			failures
		};
	} catch {
		return { failures };
	}
	return {
		...projectCodexCatalogMessage(parsed, input),
		failures
	};
}
function projectCodexCatalogMessage(parsed, input, cachedPreview) {
	const result = { failures: [] };
	if (!isJsonObject(parsed)) return result;
	result.message = parsed;
	if (!isRpcResponse(parsed)) return result;
	const message = parsed;
	const route = codexCatalogResponseRoute(message.id);
	if (message.error || !route) return result;
	const remainingRows = input.route === "unresolved" ? 0 : input.remainingRows;
	try {
		if (!isJsonObject(message.result)) throw new Error("Codex catalog response contains an invalid result");
		if (route.kind === "list") {
			const raw = message.result;
			const page = projectCodexCatalogNativeResponse(raw, sanitizeTerminalText, cachedPreview, remainingRows);
			message.result = page;
			if (!cachedPreview) {
				const rows = raw.data;
				const states = Array.isArray(rows) ? page.data.map((_, index) => {
					const row = rows[index];
					return isJsonObject(row) && typeof row.preview === "string" ? Boolean(row.preview) : void 0;
				}) : [];
				result.preview = {
					rows: page.data,
					states
				};
			}
		} else {
			const thread = message.result.thread;
			message.result = { thread: {
				...projectCodexCatalogNativeThread(thread, sanitizeTerminalText),
				...isJsonObject(thread) && typeof thread.cwd === "string" ? { cwd: thread.cwd } : {},
				...isJsonObject(thread) && (thread.historyMode === "paginated" || thread.historyMode === "legacy") ? { historyMode: thread.historyMode } : {}
			} };
		}
	} catch (error) {
		delete result.message;
		result.projectionError = {
			id: route.id,
			error: error instanceof Error ? error : new Error("Codex catalog projection failed", { cause: error })
		};
	}
	return result;
}
// extensions/codex/catalog-page.worker.ts
serveWorkerTasks((input) => {
	return decodeCodexCatalogFrame(input);
});
export {};
