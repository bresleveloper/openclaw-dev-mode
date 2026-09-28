import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as normalizeBoundedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { o as ClaudeCatalogParamsError } from "./session-catalog-shared-CiyzxK6Y.mjs";
import "./session-catalog-adoption-C3d_naEs.mjs";
import { i as parsePullRequestSummary, t as MAX_STRING_LENGTH } from "./session-catalog-desktop-DyuCxlpA.mjs";
import { t as isExactClaudeSessionCursor } from "./session-catalog-cursor-NPLrVaSJ.mjs";
//#region extensions/anthropic/session-catalog-parsing.ts
const DEFAULT_PAGE_LIMIT = 50;
const MAX_PAGE_LIMIT = 100;
const DEFAULT_TRANSCRIPT_LIMIT = 20;
const MAX_TRANSCRIPT_LIMIT = 50;
const MAX_HOSTS = 100;
const MAX_SEARCH_LENGTH = 500;
function encodeOffset(offset) {
	return Buffer.from(JSON.stringify({ offset }), "utf8").toString("base64url");
}
function decodeOffset(cursor, label) {
	if (cursor === void 0) return 0;
	if (!isExactClaudeSessionCursor(cursor)) throw new ClaudeCatalogParamsError(`${label} cursor is invalid`);
	try {
		const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
		if (!isRecord(parsed) || !Number.isSafeInteger(parsed.offset) || parsed.offset < 0) throw new Error("invalid offset");
		return parsed.offset;
	} catch (error) {
		throw new ClaudeCatalogParamsError(`${label} cursor is invalid`, { cause: error });
	}
}
function readLimit(value, fallback, max) {
	if (value === void 0) return fallback;
	if (!Number.isInteger(value) || value < 1 || value > max) throw new ClaudeCatalogParamsError(`limit must be an integer from 1 to ${max}`);
	return value;
}
function readRequiredCursor(value, message) {
	if (!isExactClaudeSessionCursor(value)) throw new ClaudeCatalogParamsError(message);
	return value;
}
function readOptionalCursor(value, label) {
	if (value === void 0) return;
	return readRequiredCursor(value, `${label} cursor is invalid`);
}
function readListParams(value) {
	if (value === void 0 || value === null) return { limit: DEFAULT_PAGE_LIMIT };
	if (!isRecord(value)) throw new ClaudeCatalogParamsError("Claude session catalog parameters must be an object");
	const allowed = /* @__PURE__ */ new Set([
		"cursor",
		"limit",
		"searchTerm"
	]);
	const unknown = Object.keys(value).find((key) => !allowed.has(key));
	if (unknown) throw new ClaudeCatalogParamsError(`unknown Claude session catalog parameter: ${unknown}`);
	const cursor = readOptionalCursor(value.cursor, "catalog");
	const searchTerm = normalizeBoundedOptionalString(value.searchTerm, MAX_SEARCH_LENGTH);
	return {
		limit: readLimit(value.limit, DEFAULT_PAGE_LIMIT, 100),
		...cursor ? { cursor } : {},
		...searchTerm ? { searchTerm } : {}
	};
}
function readTranscriptParams(value, options = {}) {
	if (!isRecord(value)) throw new ClaudeCatalogParamsError("Claude session read parameters must be an object");
	const allowed = /* @__PURE__ */ new Set([
		"threadId",
		"cursor",
		"limit",
		...options.includeHostId ? ["hostId"] : []
	]);
	const unknown = Object.keys(value).find((key) => !allowed.has(key));
	if (unknown) throw new ClaudeCatalogParamsError(`unknown Claude session read parameter: ${unknown}`);
	const threadId = normalizeBoundedOptionalString(value.threadId, 256);
	if (!threadId || !/^[A-Za-z0-9._:-]+$/.test(threadId)) throw new ClaudeCatalogParamsError("threadId is invalid");
	const cursor = readOptionalCursor(value.cursor, "transcript");
	return {
		threadId,
		limit: readLimit(value.limit, DEFAULT_TRANSCRIPT_LIMIT, 50),
		...cursor ? { cursor } : {}
	};
}
function readNodePageCursor(value, invalidPageMessage) {
	if (!("nextCursor" in value)) return;
	if (!isExactClaudeSessionCursor(value.nextCursor)) throw new Error(invalidPageMessage);
	return value.nextCursor;
}
function parseCatalogPage(value) {
	if (!isRecord(value) || !Array.isArray(value.sessions) || value.sessions.length > 100) throw new Error("Claude node returned an invalid session page");
	const sessions = value.sessions.map((candidate) => {
		if (!isRecord(candidate)) throw new Error("Claude node returned an invalid session");
		const threadId = normalizeBoundedOptionalString(candidate.threadId, 256);
		const source = candidate.source;
		if (!threadId || candidate.archived !== false || candidate.status !== "stored" || source !== "claude-cli" && source !== "claude-desktop" || candidate.modelProvider !== "anthropic") throw new Error("Claude node returned an invalid session");
		const parseStringField = (key, maxLength = MAX_STRING_LENGTH) => {
			if (!(key in candidate)) return;
			const parsed = normalizeBoundedOptionalString(candidate[key], maxLength);
			if (!parsed) throw new Error("Claude node returned an invalid session");
			return parsed;
		};
		const parseNumberField = (key, nullable = false) => {
			if (!(key in candidate)) return;
			if (nullable && candidate[key] === null) return null;
			const parsed = candidate[key];
			if (typeof parsed !== "number" || !Number.isFinite(parsed)) throw new Error("Claude node returned an invalid session");
			return parsed;
		};
		let name;
		if (candidate.name === null) name = null;
		else name = parseStringField("name", 500);
		const cwd = parseStringField("cwd");
		const color = parseStringField("color");
		const createdAt = parseNumberField("createdAt");
		const updatedAt = parseNumberField("updatedAt");
		const recencyAt = parseNumberField("recencyAt", true);
		const cliVersion = parseStringField("cliVersion", 256);
		const gitBranch = parseStringField("gitBranch", 500);
		const pullRequest = parsePullRequestSummary(candidate.pullRequest);
		return {
			threadId,
			status: "stored",
			source,
			modelProvider: "anthropic",
			archived: false,
			...name !== void 0 ? { name } : {},
			...color ? { color } : {},
			...cwd ? { cwd } : {},
			...createdAt !== void 0 ? { createdAt } : {},
			...updatedAt !== void 0 ? { updatedAt } : {},
			...recencyAt !== void 0 ? { recencyAt } : {},
			...cliVersion ? { cliVersion } : {},
			...gitBranch ? { gitBranch } : {},
			...pullRequest ? { pullRequest } : {}
		};
	});
	const nextCursor = readNodePageCursor(value, "Claude node returned an invalid session page");
	return {
		sessions,
		...nextCursor ? { nextCursor } : {}
	};
}
function unwrapNodePayload(value) {
	if (isRecord(value) && typeof value.payloadJSON === "string") return JSON.parse(value.payloadJSON);
	return value;
}
function parseGatewayQuery(value) {
	if (value === void 0 || value === null) return { limitPerHost: DEFAULT_PAGE_LIMIT };
	if (!isRecord(value)) throw new ClaudeCatalogParamsError("Claude session catalog parameters must be an object");
	const allowed = /* @__PURE__ */ new Set([
		"search",
		"limitPerHost",
		"hostIds",
		"cursors"
	]);
	const unknown = Object.keys(value).find((key) => !allowed.has(key));
	if (unknown) throw new ClaudeCatalogParamsError(`unknown Claude session catalog parameter: ${unknown}`);
	const search = normalizeBoundedOptionalString(value.search, MAX_SEARCH_LENGTH);
	let hostIds;
	if (value.hostIds !== void 0) {
		if (!Array.isArray(value.hostIds) || value.hostIds.length > 100) throw new ClaudeCatalogParamsError("hostIds must be a bounded array");
		hostIds = [...new Set(value.hostIds.map((hostId) => {
			const normalized = normalizeBoundedOptionalString(hostId, 256);
			if (!normalized || normalized !== "gateway:local" && !normalized.startsWith("node:")) throw new ClaudeCatalogParamsError("hostId is invalid");
			return normalized;
		}))];
	}
	let cursors;
	if (value.cursors !== void 0) {
		if (!isRecord(value.cursors) || Object.keys(value.cursors).length > 100) throw new ClaudeCatalogParamsError("cursors must be a bounded object");
		cursors = Object.fromEntries(Object.entries(value.cursors).map(([hostId, cursor]) => {
			return [hostId, readRequiredCursor(cursor, `cursor for ${hostId} is invalid`)];
		}));
	}
	return {
		limitPerHost: readLimit(value.limitPerHost, DEFAULT_PAGE_LIMIT, 100),
		...search ? { search } : {},
		...hostIds ? { hostIds } : {},
		...cursors ? { cursors } : {}
	};
}
//#endregion
export { encodeOffset as a, readListParams as c, readTranscriptParams as d, unwrapNodePayload as f, decodeOffset as i, readNodePageCursor as l, MAX_PAGE_LIMIT as n, parseCatalogPage as o, MAX_TRANSCRIPT_LIMIT as r, parseGatewayQuery as s, MAX_HOSTS as t, readOptionalCursor as u };
