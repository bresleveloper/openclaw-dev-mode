import { i as normalizeBoundedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { o as ClaudeCatalogParamsError } from "./session-catalog-shared-CiyzxK6Y.mjs";
import "./session-catalog-adoption-C3d_naEs.mjs";
import { r as parsePullRequestSummary, t as MAX_STRING_LENGTH } from "./session-catalog-desktop-BdfDgLqz.mjs";
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
function readParams(value, scope, allowed) {
	if (!isRecord(value)) throw new ClaudeCatalogParamsError(`Claude session ${scope} parameters must be an object`);
	const unknown = Object.keys(value).find((key) => !allowed.includes(key));
	if (unknown) throw new ClaudeCatalogParamsError(`unknown Claude session ${scope} parameter: ${unknown}`);
	return value;
}
function readListParams(value) {
	if (value === void 0 || value === null) return { limit: DEFAULT_PAGE_LIMIT };
	const params = readParams(value, "catalog", [
		"cursor",
		"limit",
		"searchTerm"
	]);
	const cursor = readOptionalCursor(params.cursor, "catalog");
	const searchTerm = normalizeBoundedOptionalString(params.searchTerm, MAX_SEARCH_LENGTH);
	return {
		limit: readLimit(params.limit, DEFAULT_PAGE_LIMIT, 100),
		...cursor ? { cursor } : {},
		...searchTerm ? { searchTerm } : {}
	};
}
function readTranscriptParams(value) {
	const params = readParams(value, "read", [
		"threadId",
		"cursor",
		"limit"
	]);
	const threadId = normalizeBoundedOptionalString(params.threadId, 256);
	if (!threadId || !/^[A-Za-z0-9._:-]+$/.test(threadId)) throw new ClaudeCatalogParamsError("threadId is invalid");
	const cursor = readOptionalCursor(params.cursor, "transcript");
	return {
		threadId,
		limit: readLimit(params.limit, DEFAULT_TRANSCRIPT_LIMIT, 50),
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
		const session = {
			threadId,
			status: "stored",
			source,
			modelProvider: "anthropic",
			archived: false
		};
		for (const [key, maxLength] of [
			["name", 500],
			["cwd", MAX_STRING_LENGTH],
			["color", MAX_STRING_LENGTH],
			["cliVersion", 256],
			["gitBranch", 500]
		]) {
			if (key === "name" && candidate[key] === null) {
				session.name = null;
				continue;
			}
			if (!(key in candidate)) continue;
			const parsed = normalizeBoundedOptionalString(candidate[key], maxLength);
			if (!parsed) throw new Error("Claude node returned an invalid session");
			session[key] = parsed;
		}
		for (const key of [
			"createdAt",
			"updatedAt",
			"recencyAt"
		]) {
			if (!(key in candidate)) continue;
			if (key === "recencyAt" && candidate[key] === null) {
				session.recencyAt = null;
				continue;
			}
			const parsed = candidate[key];
			if (typeof parsed !== "number" || !Number.isFinite(parsed)) throw new Error("Claude node returned an invalid session");
			session[key] = parsed;
		}
		const pullRequest = parsePullRequestSummary(candidate.pullRequest);
		if (pullRequest) session.pullRequest = pullRequest;
		return session;
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
	const params = readParams(value, "catalog", [
		"search",
		"limitPerHost",
		"hostIds",
		"cursors"
	]);
	const search = normalizeBoundedOptionalString(params.search, MAX_SEARCH_LENGTH);
	let hostIds;
	if (params.hostIds !== void 0) {
		if (!Array.isArray(params.hostIds) || params.hostIds.length > 100) throw new ClaudeCatalogParamsError("hostIds must be a bounded array");
		hostIds = [...new Set(params.hostIds.map((hostId) => {
			const normalized = normalizeBoundedOptionalString(hostId, 256);
			if (!normalized || normalized !== "gateway:local" && !normalized.startsWith("node:")) throw new ClaudeCatalogParamsError("hostId is invalid");
			return normalized;
		}))];
	}
	let cursors;
	if (params.cursors !== void 0) {
		if (!isRecord(params.cursors) || Object.keys(params.cursors).length > 100) throw new ClaudeCatalogParamsError("cursors must be a bounded object");
		cursors = Object.fromEntries(Object.entries(params.cursors).map(([hostId, cursor]) => {
			return [hostId, readRequiredCursor(cursor, `cursor for ${hostId} is invalid`)];
		}));
	}
	return {
		limitPerHost: readLimit(params.limitPerHost, DEFAULT_PAGE_LIMIT, 100),
		...search ? { search } : {},
		...hostIds ? { hostIds } : {},
		...cursors ? { cursors } : {}
	};
}
//#endregion
export { encodeOffset as a, readListParams as c, readTranscriptParams as d, unwrapNodePayload as f, decodeOffset as i, readNodePageCursor as l, MAX_PAGE_LIMIT as n, parseCatalogPage as o, MAX_TRANSCRIPT_LIMIT as r, parseGatewayQuery as s, MAX_HOSTS as t, readOptionalCursor as u };
