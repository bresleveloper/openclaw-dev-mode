import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { n as defineCodexBuildState } from "./build-state-C7EnDVgr.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { asFiniteNumber, isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/codex/src/app-server/protocol-session-source.ts
const CODEX_INTERACTIVE_THREAD_SOURCE_KINDS = ["cli", "vscode"];
const CODEX_INTERACTIVE_CUSTOM_THREAD_SOURCES = ["atlas", "chatgpt"];
//#endregion
//#region extensions/codex/src/session-catalog-limits.ts
var session_catalog_limits_exports = /* @__PURE__ */ __exportAll({
	CODEX_CATALOG_MAX_ROWS: () => CODEX_CATALOG_MAX_ROWS,
	CODEX_CATALOG_MAX_STATE_KEY_BYTES: () => 512,
	detachCodexCatalogString: () => detachCodexCatalogString
});
const CODEX_CATALOG_MAX_ROWS = 2e4;
/** Preserve UTF-16 code units without retaining an oversized source string. */
function detachCodexCatalogString(value) {
	return Buffer.from(value, "utf16le").toString("utf16le");
}
//#endregion
//#region extensions/codex/src/session-catalog-parsing.ts
const DEFAULT_PAGE_LIMIT = 50;
const CODEX_APP_SERVER_THREADS_CAPABILITY = "codex-app-server-threads";
const CODEX_APP_SERVER_THREADS_LIST_COMMAND = "codex.appServer.threads.list.v1";
const CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND = "codex.appServer.thread.turns.list.v1";
const CODEX_CATALOG_TRANSCRIPT_READ_COMMAND = "codex.sessionCatalog.transcript.read.v1";
const CODEX_LOCAL_SESSION_HOST_ID = "gateway:local";
const NODE_INVOKE_TIMEOUT_MS = 65e3;
const MAX_SEARCH_LENGTH = 500;
const MAX_CURSOR_LENGTH = 4096;
const MAX_CURSOR_COUNT = 100;
const MAX_HOST_ID_LENGTH = 256;
const MAX_CWD_LENGTH = 4096;
const MAX_SESSION_NAME_LENGTH = 500;
const MAX_SESSION_PREVIEW_LENGTH = 500;
const SESSION_PREVIEW_PREFIX_LENGTH = 2048;
const MAX_SESSION_KEY_LENGTH = 1024;
const MAX_METADATA_LENGTH = 500;
const MAX_ACTIVE_FLAGS = 16;
const MAX_TRANSCRIPT_PAGE_BYTES = 20971520;
var CatalogParamsError = class extends Error {};
function readControlCursor(value, label) {
	if (value === void 0 || value === null) return;
	if (typeof value !== "string" || !value.trim() || value.length > 4096) throw new CatalogParamsError(`invalid Codex session catalog ${label} cursor`);
	return detachCodexCatalogString(value);
}
function boundedCatalogString(value, maxLength, overflow = "omit") {
	if (typeof value !== "string") return;
	const normalized = value.trim();
	if (!normalized) return;
	if (normalized.length <= maxLength) return detachCodexCatalogString(normalized);
	return overflow === "truncate" ? detachCodexCatalogString(truncateUtf16Safe(normalized, maxLength)) : void 0;
}
function catalogPreview(value, sanitize) {
	if (typeof value !== "string") return;
	return boundedCatalogString(sanitize(value.replace(/\s+/g, " ")), MAX_SESSION_PREVIEW_LENGTH, "truncate");
}
/** Select a bounded input only for the canonical terminal sanitizer. */
function selectCodexCatalogPreviewInput(value) {
	if (value.length <= SESSION_PREVIEW_PREFIX_LENGTH) return value;
	const prefix = value.slice(0, SESSION_PREVIEW_PREFIX_LENGTH).replace(/\s+/g, " ").trim();
	return prefix.length > MAX_SESSION_PREVIEW_LENGTH && !/\p{Cc}/u.test(prefix) ? prefix : value;
}
/** Detach the small preview from V8's potentially large sliced-string backing store. */
function truncateCodexCatalogPreview(value, sanitize) {
	return Buffer.from(catalogPreview(value, sanitize) ?? "", "utf8").toString("utf8");
}
function normalizeInteractiveThreadSource(source) {
	if (CODEX_INTERACTIVE_THREAD_SOURCE_KINDS.some((kind) => kind === source) || CODEX_INTERACTIVE_CUSTOM_THREAD_SOURCES.some((kind) => kind === source)) return source;
	if (isRecord(source) && CODEX_INTERACTIVE_CUSTOM_THREAD_SOURCES.some((kind) => kind === source.custom)) return source.custom;
}
function isInteractiveThreadSource(source) {
	return normalizeInteractiveThreadSource(source) !== void 0;
}
function codexCatalogThreadName(value) {
	return value === null ? null : boundedCatalogString(value, MAX_SESSION_NAME_LENGTH, "truncate");
}
function codexCatalogThreadStatus(status) {
	const activeFlags = [];
	if (status?.type === "active" && Array.isArray(status.activeFlags)) for (const flag of status.activeFlags) {
		const normalized = boundedCatalogString(flag, 128);
		if (normalized) activeFlags.push(normalized);
		if (activeFlags.length === MAX_ACTIVE_FLAGS) break;
	}
	return {
		status: boundedCatalogString(status?.type, 64) ?? "notLoaded",
		...activeFlags.length ? { activeFlags } : {}
	};
}
function toCatalogSession(thread, archived, sanitize, preparedPreview) {
	const source = normalizeInteractiveThreadSource(thread.source);
	if (!source) return;
	const threadId = boundedCatalogString(thread.id, 256);
	if (!threadId) return;
	const gitInfo = isRecord(thread.gitInfo) ? thread.gitInfo : void 0;
	const sessionId = boundedCatalogString(thread.sessionId, 256);
	const name = codexCatalogThreadName(thread.name);
	const fallbackName = name ? void 0 : preparedPreview ? preparedPreview.value : catalogPreview(thread.preview, sanitize);
	const cwd = boundedCatalogString(thread.cwd, MAX_CWD_LENGTH);
	const modelProvider = boundedCatalogString(thread.modelProvider, MAX_METADATA_LENGTH, "truncate");
	const cliVersion = boundedCatalogString(thread.cliVersion, MAX_METADATA_LENGTH, "truncate");
	const gitBranch = boundedCatalogString(gitInfo?.branch, MAX_METADATA_LENGTH, "truncate");
	return {
		threadId,
		...codexCatalogThreadStatus(thread.status),
		archived,
		...sessionId ? { sessionId } : {},
		...thread.name === null ? { name: null } : name ? { name } : {},
		...fallbackName ? { fallbackName } : {},
		...cwd ? { cwd } : {},
		...typeof thread.createdAt === "number" && Number.isFinite(thread.createdAt) ? { createdAt: thread.createdAt } : {},
		...typeof thread.updatedAt === "number" && Number.isFinite(thread.updatedAt) ? { updatedAt: thread.updatedAt } : {},
		...typeof thread.recencyAt === "number" && Number.isFinite(thread.recencyAt) ? { recencyAt: thread.recencyAt } : thread.recencyAt === null ? { recencyAt: null } : {},
		source,
		...modelProvider ? { modelProvider } : {},
		...cliVersion ? { cliVersion } : {},
		...gitBranch ? { gitBranch } : {}
	};
}
function normalizeLimit(value, key) {
	if (value === void 0) return DEFAULT_PAGE_LIMIT;
	if (!Number.isInteger(value) || value < 1 || value > 100) throw new CatalogParamsError(`${key} must be an integer from 1 to 100`);
	return value;
}
function readBoundedOptionalString(params, key, maxLength) {
	const value = params[key];
	if (value === void 0) return;
	if (typeof value !== "string") throw new CatalogParamsError(`${key} must be a string`);
	const trimmed = value.trim();
	if (!trimmed) return;
	if (trimmed.length > maxLength) throw new CatalogParamsError(`${key} must be at most ${maxLength} characters`);
	return trimmed;
}
function requireOnlyKeys(params, allowed) {
	const unknown = Object.keys(params).find((key) => !allowed.has(key));
	if (unknown) throw new CatalogParamsError(`unknown Codex session catalog parameter: ${unknown}`);
}
function readPageParams(value) {
	if (!isRecord(value)) throw new CatalogParamsError("Codex session catalog parameters must be an object");
	const params = value;
	requireOnlyKeys(params, /* @__PURE__ */ new Set([
		"cursor",
		"limit",
		"searchTerm",
		"cwd"
	]));
	const cursor = readBoundedOptionalString(params, "cursor", MAX_CURSOR_LENGTH);
	const searchTerm = readBoundedOptionalString(params, "searchTerm", MAX_SEARCH_LENGTH);
	const cwd = readBoundedOptionalString(params, "cwd", MAX_CWD_LENGTH);
	return {
		limit: normalizeLimit(params.limit, "limit"),
		...cursor ? { cursor } : {},
		...searchTerm ? { searchTerm } : {},
		...cwd ? { cwd } : {}
	};
}
function readGatewayParams(value) {
	if (value !== void 0 && !isRecord(value)) throw new CatalogParamsError("Codex session catalog parameters must be an object");
	const params = isRecord(value) ? value : {};
	requireOnlyKeys(params, /* @__PURE__ */ new Set([
		"search",
		"limitPerHost",
		"hostIds",
		"cursors"
	]));
	const search = readBoundedOptionalString(params, "search", MAX_SEARCH_LENGTH);
	let hostIds;
	if (params.hostIds !== void 0) {
		if (!Array.isArray(params.hostIds) || params.hostIds.length > 100) throw new CatalogParamsError(`hostIds must contain at most 100 host ids`);
		hostIds = [...new Set(params.hostIds.map((hostId) => readHostId(hostId)))];
	}
	let cursors;
	if (params.cursors !== void 0) {
		if (!isRecord(params.cursors)) throw new CatalogParamsError("cursors must be an object");
		const entries = Object.entries(params.cursors);
		if (entries.length > MAX_CURSOR_COUNT) throw new CatalogParamsError(`cursors may contain at most ${MAX_CURSOR_COUNT} hosts`);
		cursors = {};
		for (const [hostId, cursor] of entries) {
			const normalizedHostId = hostId.trim();
			if (normalizedHostId.length === 0 || normalizedHostId.length > MAX_HOST_ID_LENGTH || !normalizedHostId.startsWith("gateway:") && !normalizedHostId.startsWith("node:")) throw new CatalogParamsError(`invalid Codex session catalog host id: ${hostId}`);
			if (typeof cursor !== "string" || !cursor.trim() || cursor.trim().length > 4096) throw new CatalogParamsError(`invalid cursor for Codex session catalog host: ${hostId}`);
			cursors[normalizedHostId] = cursor.trim();
		}
	}
	return {
		limitPerHost: normalizeLimit(params.limitPerHost, "limitPerHost"),
		...search ? { search } : {},
		...hostIds && hostIds.length > 0 ? { hostIds } : {},
		...cursors && Object.keys(cursors).length > 0 ? { cursors } : {}
	};
}
function readHostId(value) {
	if (typeof value !== "string") throw new CatalogParamsError("Codex session catalog host ids must be strings");
	const hostId = value.trim();
	if (hostId.length === 0 || hostId.length > MAX_HOST_ID_LENGTH || !hostId.startsWith("gateway:") && !hostId.startsWith("node:")) throw new CatalogParamsError(`invalid Codex session catalog host id: ${value}`);
	return hostId;
}
function parseJsonParams(paramsJSON) {
	if (!paramsJSON?.trim()) return {};
	try {
		return JSON.parse(paramsJSON);
	} catch (error) {
		throw new Error("Codex session catalog parameters must be valid JSON", { cause: error });
	}
}
function parseOptionalCatalogString(value, field, maxLength) {
	if (value === void 0) return;
	if (typeof value !== "string" || value.length > maxLength) throw new Error(`Codex session catalog returned an invalid ${field}`);
	return detachCodexCatalogString(value);
}
function parseCatalogSession(value, options = {}) {
	if (!isRecord(value) || typeof value.threadId !== "string" || !value.threadId.trim() || value.threadId.length > 256 || value.archived !== false) throw new Error("Codex session catalog returned an invalid session");
	const status = parseOptionalCatalogString(value.status, "status", 64);
	if (!status?.trim()) throw new Error("Codex session catalog returned an invalid status");
	if (value.activeFlags !== void 0 && !Array.isArray(value.activeFlags)) throw new Error("Codex session catalog returned invalid active flags");
	if (Array.isArray(value.activeFlags) && value.activeFlags.length > MAX_ACTIVE_FLAGS) throw new Error("Codex session catalog returned too many active flags");
	const activeFlags = Array.isArray(value.activeFlags) ? value.activeFlags.map((entry) => {
		const flag = parseOptionalCatalogString(entry, "active flag", 128);
		if (flag === void 0) throw new Error("Codex session catalog returned an invalid active flag");
		return flag;
	}) : void 0;
	const sessionId = parseOptionalCatalogString(value.sessionId, "session id", 256);
	const name = value.name === null ? null : parseOptionalCatalogString(value.name, "session name", MAX_SESSION_NAME_LENGTH);
	const fallbackName = parseOptionalCatalogString(value.fallbackName, "session fallback name", MAX_SESSION_PREVIEW_LENGTH);
	const cwd = parseOptionalCatalogString(value.cwd, "cwd", MAX_CWD_LENGTH);
	const source = parseOptionalCatalogString(value.source, "source", MAX_METADATA_LENGTH);
	const modelProvider = parseOptionalCatalogString(value.modelProvider, "model provider", MAX_METADATA_LENGTH);
	const cliVersion = parseOptionalCatalogString(value.cliVersion, "CLI version", MAX_METADATA_LENGTH);
	const gitBranch = parseOptionalCatalogString(value.gitBranch, "Git branch", MAX_METADATA_LENGTH);
	const sessionKey = options.allowSessionKey ? parseOptionalCatalogString(value.sessionKey, "OpenClaw session key", MAX_SESSION_KEY_LENGTH) : void 0;
	const createdAt = asFiniteNumber(value.createdAt);
	const updatedAt = asFiniteNumber(value.updatedAt);
	const recencyAt = value.recencyAt === null ? null : asFiniteNumber(value.recencyAt);
	return {
		threadId: detachCodexCatalogString(value.threadId),
		status,
		archived: value.archived,
		...sessionId !== void 0 ? { sessionId } : {},
		...name !== void 0 ? { name } : {},
		...fallbackName !== void 0 ? { fallbackName } : {},
		...cwd !== void 0 ? { cwd } : {},
		...activeFlags && activeFlags.length > 0 ? { activeFlags } : {},
		...createdAt !== void 0 ? { createdAt } : {},
		...updatedAt !== void 0 ? { updatedAt } : {},
		...recencyAt !== void 0 ? { recencyAt } : {},
		...source !== void 0 ? { source } : {},
		...modelProvider !== void 0 ? { modelProvider } : {},
		...cliVersion !== void 0 ? { cliVersion } : {},
		...gitBranch !== void 0 ? { gitBranch } : {},
		...sessionKey !== void 0 ? { sessionKey } : {}
	};
}
function parseCatalogPage(value, options = {}) {
	if (!isRecord(value) || !Array.isArray(value.sessions) || value.sessions.length > 100) throw new Error("Codex session catalog returned an invalid page");
	const nextCursor = parseOptionalCatalogString(value.nextCursor, "next cursor", MAX_CURSOR_LENGTH);
	const sourceHomeId = parseOptionalCatalogString(value.sourceHomeId, "source home id", 256);
	const backwardsCursor = parseOptionalCatalogString(value.backwardsCursor, "backwards cursor", MAX_CURSOR_LENGTH);
	return {
		sessions: value.sessions.map((session) => parseCatalogSession(session, options)),
		...sourceHomeId ? { sourceHomeId } : {},
		...typeof value.canContinueCodex === "boolean" ? { canContinueCodex: value.canContinueCodex } : {},
		...nextCursor ? { nextCursor } : {},
		...backwardsCursor ? { backwardsCursor } : {}
	};
}
function filterCatalogPageByTitle(page, searchTerm) {
	if (!searchTerm) return page;
	return {
		...page,
		sessions: page.sessions.filter((session) => (session.name ?? session.fallbackName)?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))
	};
}
function unwrapNodeInvokePayload(value) {
	if (!isRecord(value)) return value;
	if (typeof value.payloadJSON === "string" && value.payloadJSON.trim()) try {
		return JSON.parse(value.payloadJSON);
	} catch (error) {
		throw new Error("Codex node returned malformed session catalog JSON", { cause: error });
	}
	return "payload" in value ? value.payload : value;
}
function catalogErrorDetail(error) {
	if (error instanceof Error) return error.message.trim();
	if (typeof error === "string") return error.trim();
	if (error && typeof error === "object" && "message" in error) {
		const message = error.message;
		return typeof message === "string" ? message.trim() : "";
	}
	return "";
}
function catalogError(code, error) {
	const summary = {
		APP_SERVER_UNAVAILABLE: "Codex app-server is unavailable on this host",
		NODE_INVOKE_FAILED: "The paired node could not return its Codex session catalog",
		NODE_LIST_FAILED: "Paired nodes could not be listed"
	}[code] ?? "Codex session catalog request failed";
	const detail = code === "NODE_LIST_FAILED" ? catalogErrorDetail(error) : "";
	return {
		code,
		message: detail && detail !== summary ? `${summary}: ${detail}` : summary
	};
}
function parseTranscriptPage(value) {
	if (!isRecord(value) || !Array.isArray(value.data) || value.data.length > 50 || value.data.some((turn) => !isRecord(turn) || !Array.isArray(turn.items) || turn.items.some((item) => !isRecord(item)))) throw new Error("Codex app-server returned an invalid transcript page");
	const nextCursor = readControlCursor(value.nextCursor, "transcript next response");
	const backwardsCursor = readControlCursor(value.backwardsCursor, "transcript backwards response");
	const page = {
		data: value.data,
		...nextCursor ? { nextCursor } : {},
		...backwardsCursor ? { backwardsCursor } : {}
	};
	if (Buffer.byteLength(JSON.stringify(page), "utf8") > 20971520) throw new Error("Codex app-server transcript page exceeds the safe response size");
	return page;
}
function requireBoundThread(entry) {
	if (!entry.boundThreadId) throw new CatalogParamsError("Codex adoption is missing its bound thread. Retry.");
	return entry.boundThreadId;
}
//#endregion
//#region extensions/codex/src/session-catalog-source.ts
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
	if (typeof thread.originator === "string") row.originator = detachCodexCatalogString(thread.originator.slice(0, 500));
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
	const source = typeof thread.source === "string" ? detachCodexCatalogString(thread.source.slice(0, 500)) : void 0;
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
export { parseCatalogPage as A, toCatalogSession as B, boundedCatalogString as C, filterCatalogPageByTitle as D, codexCatalogThreadStatus as E, readGatewayParams as F, session_catalog_limits_exports as G, unwrapNodeInvokePayload as H, readPageParams as I, CODEX_INTERACTIVE_THREAD_SOURCE_KINDS as K, requireBoundThread as L, parseTranscriptPage as M, readBoundedOptionalString as N, isInteractiveThreadSource as O, readControlCursor as P, requireOnlyKeys as R, NODE_INVOKE_TIMEOUT_MS as S, codexCatalogThreadName as T, CODEX_CATALOG_MAX_ROWS as U, truncateCodexCatalogPreview as V, detachCodexCatalogString as W, CODEX_LOCAL_SESSION_HOST_ID as _, session_catalog_native_projection_exports as a, MAX_CWD_LENGTH as b, copyCodexCatalogSource as c, recordCodexCatalogResponseSource as d, setCodexCatalogSource as f, CODEX_CATALOG_TRANSCRIPT_READ_COMMAND as g, CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND as h, reuseCodexCatalogPreview as i, parseJsonParams as j, normalizeLimit as k, getCodexCatalogSource as l, CODEX_APP_SERVER_THREADS_LIST_COMMAND as m, projectCodexCatalogNativeResponse as n, closeCodexCatalogClientSource as o, CODEX_APP_SERVER_THREADS_CAPABILITY as p, projectCodexCatalogNativeThread as r, codexCatalogSourceForClient as s, CODEX_CATALOG_NATIVE_PAGE_LIMIT as t, observeCodexCatalogEphemeralThreads as u, CatalogParamsError as v, catalogError as w, MAX_TRANSCRIPT_PAGE_BYTES as x, MAX_CURSOR_LENGTH as y, selectCodexCatalogPreviewInput as z };
