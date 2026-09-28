import { OPENCODE_SESSION_ID_PATTERN } from "./session-catalog-shared.js";
import { isRecord, normalizeBoundedOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import process from "node:process";
import { sessionCatalogPaging } from "openclaw/plugin-sdk/session-catalog";
import { runCommandBuffered } from "openclaw/plugin-sdk/process-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { materializeWindowsSpawnProgram, resolveWindowsSpawnProgram } from "openclaw/plugin-sdk/windows-spawn";
//#region extensions/opencode/session-catalog.ts
const LOCAL_HOST_ID = "gateway";
const MAX_SEARCH_LENGTH = 500;
const MAX_CLI_LIST_SESSIONS = 1e4;
const MAX_CLI_OUTPUT_BYTES = 33554432;
const CLI_TIMEOUT_MS = 3e4;
const OPENCODE_QUERY_CACHE_TTL_MS = 32e3;
const OPENCODE_QUERY_CACHE_MAX_ENTRIES = 32;
const SAFE_ENV_KEYS = [
	"APPDATA",
	"COMSPEC",
	"HOME",
	"LANG",
	"LC_ALL",
	"LOCALAPPDATA",
	"OPENCODE_DB",
	"PATH",
	"Path",
	"PATHEXT",
	"SYSTEMROOT",
	"TEMP",
	"TMP",
	"TMPDIR",
	"USERPROFILE",
	"WINDIR",
	"XDG_CACHE_HOME",
	"XDG_CONFIG_HOME",
	"XDG_DATA_HOME",
	"XDG_STATE_HOME"
];
const openCodeConfigIdentities = /* @__PURE__ */ new WeakMap();
const openCodeQueryCache = /* @__PURE__ */ new Map();
let nextOpenCodeConfigIdentity = 1;
function openCodeQueryCacheKey(query, configIdentity) {
	let identity = openCodeConfigIdentities.get(configIdentity);
	if (identity === void 0) {
		identity = nextOpenCodeConfigIdentity++;
		openCodeConfigIdentities.set(configIdentity, identity);
	}
	const environment = SAFE_ENV_KEYS.map((key) => `${key}=${process.env[key] ?? ""}`).join("\0");
	return `${String(identity)}\0${environment}\0${query}`;
}
const isExactOpenCodeSessionCursor = sessionCatalogPaging.isExactCursor;
const OPENCODE_PARAMETER_MESSAGES = {
	listNotObject: "OpenCode session list parameters must be an object",
	unknownListParameter: (key) => `unknown OpenCode session list parameter: ${key}`,
	invalidSearchTerm: "searchTerm is invalid",
	readNotObject: "OpenCode session read parameters must be an object",
	unknownReadParameter: (key) => `unknown OpenCode session read parameter: ${key}`,
	invalidThreadId: "threadId is invalid"
};
async function runOpenCode(args) {
	const invocation = materializeWindowsSpawnProgram(resolveWindowsSpawnProgram({
		command: "opencode",
		platform: process.platform,
		env: process.env,
		execPath: process.execPath,
		packageName: "opencode-ai"
	}), args);
	const env = {
		OPENCODE_PURE: "1",
		NO_COLOR: "1"
	};
	for (const key of SAFE_ENV_KEYS) if (process.env[key] !== void 0) env[key] = process.env[key];
	const result = await runCommandBuffered([invocation.command, ...invocation.argv], {
		baseEnv: {},
		env,
		input: "",
		maxCombinedOutputBytes: MAX_CLI_OUTPUT_BYTES,
		maxOutputBytes: MAX_CLI_OUTPUT_BYTES,
		terminateOnOutputError: true,
		timeoutMs: CLI_TIMEOUT_MS
	});
	if (result.termination === "output-limit") throw new Error("OpenCode session output exceeded the safety limit");
	if (result.errorStream) {
		const message = result.error?.message ?? "unknown error";
		throw new Error(`OpenCode ${result.errorStream} stream failed: ${message}`, { cause: result.error });
	}
	if (result.termination === "error" && result.error) throw result.error;
	if (result.code !== 0) {
		const detail = result.stderr.toString("utf8").trim();
		throw new Error(detail || `OpenCode exited with code ${String(result.code)}`);
	}
	return result.stdout.toString("utf8");
}
async function queryOpenCodeDatabase(query) {
	const output = await runOpenCode([
		"--pure",
		"db",
		query,
		"--format",
		"json"
	]);
	return output.trim() ? JSON.parse(output) : [];
}
async function queryCachedOpenCodeSessions(query, options) {
	const key = openCodeQueryCacheKey(query, options.configIdentity ?? process.env);
	const cached = openCodeQueryCache.get(key);
	if (options.forceRefresh !== true && cached && cached.expiresAt > Date.now()) {
		openCodeQueryCache.delete(key);
		openCodeQueryCache.set(key, cached);
		return await cached.result;
	}
	if (cached) openCodeQueryCache.delete(key);
	const result = queryOpenCodeDatabase(query);
	const entry = {
		expiresAt: Date.now() + OPENCODE_QUERY_CACHE_TTL_MS,
		result
	};
	openCodeQueryCache.set(key, entry);
	while (openCodeQueryCache.size > OPENCODE_QUERY_CACHE_MAX_ENTRIES) {
		const oldest = openCodeQueryCache.keys().next();
		if (oldest.done) break;
		openCodeQueryCache.delete(oldest.value);
	}
	try {
		const value = await result;
		entry.resolved = true;
		return value;
	} catch (error) {
		if (openCodeQueryCache.get(key) === entry) {
			if (cached?.resolved) openCodeQueryCache.set(key, cached);
			else openCodeQueryCache.delete(key);
		}
		throw error;
	}
}
async function exportOpenCodeSession(threadId) {
	const output = await runOpenCode([
		"--pure",
		"export",
		threadId
	]);
	return JSON.parse(output);
}
function parseOpenCodeSession(value) {
	if (!isRecord(value)) return;
	const threadId = normalizeBoundedOptionalString(value.id, 256);
	if (!threadId || !OPENCODE_SESSION_ID_PATTERN.test(threadId)) return;
	const name = normalizeBoundedOptionalString(value.title, 1e3);
	const cwd = normalizeBoundedOptionalString(value.directory, 4096);
	const createdAt = typeof value.created === "number" && Number.isFinite(value.created) ? value.created : void 0;
	const updatedAt = typeof value.updated === "number" && Number.isFinite(value.updated) ? value.updated : void 0;
	return {
		threadId,
		...name ? { name } : {},
		...cwd ? { cwd } : {},
		status: "stored",
		...createdAt !== void 0 ? { createdAt } : {},
		...updatedAt !== void 0 ? {
			updatedAt,
			recencyAt: updatedAt
		} : {},
		source: "opencode-cli",
		modelProvider: "opencode",
		archived: false,
		canContinue: true,
		canArchive: false
	};
}
async function listLocalOpenCodeSessionPage(value, options = {}) {
	const params = sessionCatalogPaging.parseListParams(value, {
		searchMaxLength: MAX_SEARCH_LENGTH,
		messages: OPENCODE_PARAMETER_MESSAGES
	});
	const offset = sessionCatalogPaging.decodeCursor(params.cursor);
	const requestedCount = params.searchTerm ? MAX_CLI_LIST_SESSIONS : Math.min(MAX_CLI_LIST_SESSIONS, offset + params.limit + 1);
	const parsed = await queryCachedOpenCodeSessions([
		"SELECT id, title, time_created AS created, time_updated AS updated,",
		"project_id AS projectId, directory FROM session",
		"WHERE parent_id IS NULL AND time_archived IS NULL",
		`ORDER BY time_updated DESC, id DESC LIMIT ${String(requestedCount)}`
	].join(" "), options);
	if (!Array.isArray(parsed) || parsed.length > MAX_CLI_LIST_SESSIONS) throw new Error("OpenCode returned an invalid session list");
	const needle = params.searchTerm?.toLocaleLowerCase();
	const sessions = parsed.flatMap((entry) => {
		const session = parseOpenCodeSession(entry);
		return session ? [session] : [];
	}).filter((session) => {
		if (!needle) return true;
		return [
			session.threadId,
			session.name,
			session.cwd
		].some((field) => field?.toLocaleLowerCase().includes(needle));
	});
	const page = sessions.slice(offset, offset + params.limit);
	return {
		sessions: page,
		...offset + page.length < sessions.length ? { nextCursor: sessionCatalogPaging.encodeCursor(offset + page.length) } : {}
	};
}
async function requireLocalOpenCodeSession(threadId) {
	const session = (await listLocalOpenCodeSessionPage({
		searchTerm: threadId,
		limit: 100
	})).sessions.find((candidate) => candidate.threadId === threadId);
	if (!session) throw new Error("OpenCode session is unavailable");
	return session;
}
function jsonText(value, maxLength = 2e4) {
	try {
		const text = JSON.stringify(value);
		return text.length > maxLength ? `${truncateUtf16Safe(text, maxLength)}…` : text;
	} catch {
		return;
	}
}
function timestampFromInfo(info) {
	if (!isRecord(info.time) || typeof info.time.created !== "number") return;
	const date = new Date(info.time.created);
	return Number.isNaN(date.getTime()) ? void 0 : date.toISOString();
}
function openCodeTranscriptItems(value) {
	if (!isRecord(value) || !Array.isArray(value.messages)) throw new Error("OpenCode returned an invalid session export");
	return value.messages.flatMap((message) => {
		if (!isRecord(message) || !isRecord(message.info) || !Array.isArray(message.parts)) return [];
		const info = message.info;
		const role = info.role;
		const messageId = normalizeBoundedOptionalString(info.id, 256);
		const timestamp = timestampFromInfo(info);
		const modelId = role === "assistant" ? normalizeBoundedOptionalString(info.modelID, 256) : isRecord(info.model) ? normalizeBoundedOptionalString(info.model.modelID, 256) : void 0;
		const providerId = role === "assistant" ? normalizeBoundedOptionalString(info.providerID, 256) : isRecord(info.model) ? normalizeBoundedOptionalString(info.model.providerID, 256) : void 0;
		const model = providerId && modelId ? `${providerId}/${modelId}` : modelId;
		return message.parts.flatMap((part, partIndex) => {
			if (!isRecord(part)) return [];
			const id = normalizeBoundedOptionalString(part.id, 256) ?? (messageId ? `${messageId}:${String(partIndex)}` : void 0);
			const common = {
				...id ? { id } : {},
				...timestamp ? { timestamp } : {},
				...model ? { model } : {}
			};
			if (part.type === "text" && typeof part.text === "string") return [{
				...common,
				type: role === "user" ? "userMessage" : "agentMessage",
				text: part.text
			}];
			if (part.type === "reasoning" && typeof part.text === "string") return [{
				...common,
				type: "reasoning",
				text: part.text
			}];
			if (part.type === "tool") {
				const tool = normalizeBoundedOptionalString(part.tool, 256) ?? "tool";
				const state = isRecord(part.state) ? part.state : void 0;
				const callText = state && "input" in state ? jsonText(state.input) : void 0;
				const resultText = state?.status === "completed" && typeof state.output === "string" ? state.output : state?.status === "error" && typeof state.error === "string" ? state.error : void 0;
				return [{
					...common,
					type: "toolCall",
					text: callText ? `${tool}\n${callText}` : tool
				}, ...resultText ? [{
					...common,
					...id ? { id: `${id}:result` } : {},
					type: "toolResult",
					text: resultText
				}] : []];
			}
			if (part.type === "file") {
				const filename = normalizeBoundedOptionalString(part.filename, 1e3);
				const mime = normalizeBoundedOptionalString(part.mime, 256);
				return [{
					...common,
					type: "other",
					text: `[Attachment${filename ? `: ${filename}` : ""}${mime ? ` (${mime})` : ""}]`
				}];
			}
			return [];
		});
	});
}
async function readLocalOpenCodeTranscriptPage(value) {
	const params = sessionCatalogPaging.parseReadParams(value, {
		threadIdMaxLength: 256,
		threadIdPattern: OPENCODE_SESSION_ID_PATTERN,
		messages: OPENCODE_PARAMETER_MESSAGES
	});
	const offset = sessionCatalogPaging.decodeCursor(params.cursor);
	const items = openCodeTranscriptItems(await exportOpenCodeSession(params.threadId));
	const page = sessionCatalogPaging.boundTranscriptPage(items, params.limit, offset);
	return {
		hostId: LOCAL_HOST_ID,
		label: "Local OpenCode",
		threadId: params.threadId,
		...page
	};
}
//#endregion
export { exportOpenCodeSession, isExactOpenCodeSessionCursor, listLocalOpenCodeSessionPage, queryOpenCodeDatabase, readLocalOpenCodeTranscriptPage, requireLocalOpenCodeSession };
