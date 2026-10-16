import "./protocol-CANUwXJ3.mjs";
import { n as detachCodexCatalogString } from "./session-catalog-limits-DEU36Qlo.mjs";
import { asFiniteNumber, isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/codex/src/app-server/protocol-session-source.ts
const CODEX_INTERACTIVE_THREAD_SOURCE_KINDS = ["cli", "vscode"];
const CODEX_INTERACTIVE_CUSTOM_THREAD_SOURCES = ["atlas", "chatgpt"];
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
	return CODEX_INTERACTIVE_THREAD_SOURCE_KINDS.find((kind) => kind === source) ?? CODEX_INTERACTIVE_CUSTOM_THREAD_SOURCES.find((kind) => kind === source) ?? (isRecord(source) ? CODEX_INTERACTIVE_CUSTOM_THREAD_SOURCES.find((kind) => kind === source.custom) : void 0);
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
function normalizeLimit(value, key, fallback = DEFAULT_PAGE_LIMIT, max = 100) {
	if (value === void 0) return fallback;
	if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > max) throw new CatalogParamsError(`${key} must be an integer from 1 to ${max}`);
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
	const params = value ?? {};
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
			const normalizedHostId = readHostId(hostId);
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
const CATALOG_SESSION_STRINGS = [
	[
		"sessionId",
		"session id",
		256
	],
	[
		"name",
		"session name",
		MAX_SESSION_NAME_LENGTH
	],
	[
		"fallbackName",
		"session fallback name",
		MAX_SESSION_PREVIEW_LENGTH
	],
	[
		"cwd",
		"cwd",
		MAX_CWD_LENGTH
	],
	[
		"source",
		"source",
		MAX_METADATA_LENGTH
	],
	[
		"modelProvider",
		"model provider",
		MAX_METADATA_LENGTH
	],
	[
		"cliVersion",
		"CLI version",
		MAX_METADATA_LENGTH
	],
	[
		"gitBranch",
		"Git branch",
		MAX_METADATA_LENGTH
	],
	[
		"sessionKey",
		"OpenClaw session key",
		MAX_SESSION_KEY_LENGTH
	]
];
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
	const session = {
		threadId: detachCodexCatalogString(value.threadId),
		status,
		archived: value.archived
	};
	for (const [key, label, limit] of CATALOG_SESSION_STRINGS) {
		if (key === "sessionKey" && !options.allowSessionKey) continue;
		if (key === "name" && value.name === null) {
			session.name = null;
			continue;
		}
		const parsed = parseOptionalCatalogString(value[key], label, limit);
		if (parsed !== void 0) session[key] = parsed;
	}
	if (activeFlags?.length) session.activeFlags = activeFlags;
	for (const key of [
		"createdAt",
		"updatedAt",
		"recencyAt"
	]) {
		const parsed = asFiniteNumber(value[key]);
		if (parsed !== void 0) session[key] = parsed;
		else if (key === "recencyAt" && value.recencyAt === null) session.recencyAt = null;
	}
	return session;
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
function unwrapNodeInvokePayload(value, malformedMessage = "Codex node returned malformed session catalog JSON") {
	if (!isRecord(value)) return value;
	if (typeof value.payloadJSON === "string" && value.payloadJSON.trim()) try {
		return JSON.parse(value.payloadJSON);
	} catch (error) {
		throw new Error(malformedMessage, { cause: error });
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
export { unwrapNodeInvokePayload as A, readGatewayParams as C, selectCodexCatalogPreviewInput as D, requireOnlyKeys as E, toCatalogSession as O, readControlCursor as S, requireBoundThread as T, normalizeLimit as _, CODEX_LOCAL_SESSION_HOST_ID as a, parseTranscriptPage as b, MAX_CWD_LENGTH as c, boundedCatalogString as d, catalogError as f, isInteractiveThreadSource as g, filterCatalogPageByTitle as h, CODEX_CATALOG_TRANSCRIPT_READ_COMMAND as i, CODEX_INTERACTIVE_THREAD_SOURCE_KINDS as j, truncateCodexCatalogPreview as k, MAX_TRANSCRIPT_PAGE_BYTES as l, codexCatalogThreadStatus as m, CODEX_APP_SERVER_THREADS_LIST_COMMAND as n, CatalogParamsError as o, codexCatalogThreadName as p, CODEX_APP_SERVER_THREAD_TURNS_LIST_COMMAND as r, MAX_CURSOR_LENGTH as s, CODEX_APP_SERVER_THREADS_CAPABILITY as t, NODE_INVOKE_TIMEOUT_MS as u, parseCatalogPage as v, readPageParams as w, readBoundedOptionalString as x, parseJsonParams as y };
