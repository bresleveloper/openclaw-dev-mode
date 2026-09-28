import { c as PI_SESSION_READ_COMMAND, i as PI_LOCAL_SESSION_HOST_ID, l as PI_TERMINAL_RESUME_COMMAND, n as piSessionStore, o as PI_SESSIONS_LIST_COMMAND, r as piSessionStoreAvailable, s as PI_SESSION_ID_PATTERN, t as piAcpSessionStoreRoot } from "./pi-session-paths-CIvyk6KB.mjs";
import { parseDateFirstTimestampMs } from "openclaw/plugin-sdk/number-runtime";
import { createReadStream } from "node:fs";
import path from "node:path";
import { isRecord, normalizeBoundedOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveNodeHostExecutable } from "openclaw/plugin-sdk/node-host";
import { createSessionCatalogFamily, importSessionCatalogHistory, isExternalUserText, listAdoptedSessionCatalogSessions, sessionCatalogAdoptedSessionKey } from "openclaw/plugin-sdk/session-catalog";
import fs$1 from "node:fs/promises";
import { resolveAcpSessionAvailability } from "openclaw/plugin-sdk/acp-runtime";
import process from "node:process";
import { resolveSessionAgentIdsStrict } from "openclaw/plugin-sdk/agent-scope-runtime";
import { sessionCatalogPaging } from "openclaw/plugin-sdk/session-catalog-paging";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { runTasksWithConcurrency } from "openclaw/plugin-sdk/concurrency-runtime";
import { isPathStrictlyInside, readFileRangeAsync } from "openclaw/plugin-sdk/file-access-runtime";
//#region extensions/acpx/src/pi-session-timestamp.ts
/** Preserve Pi JSONL's date-first string contract while accepting numeric millisecond values. */
function parsePiSessionTimestampMs(value) {
	return parseDateFirstTimestampMs(value);
}
//#endregion
//#region extensions/acpx/src/pi-session-store.ts
const MAX_DISCOVERY_FILES = 1e4;
const SUMMARY_SCAN_BATCH_SIZE = 100;
const MAX_SUMMARY_CACHE_ENTRIES = 256;
const MAX_SESSION_BYTES = 33554432;
const MAX_SUMMARY_LINE_BYTES = 1048576;
const APPEND_PROOF_EDGE_BYTES = 65536;
const IO_CONCURRENCY = 8;
const PI_FILE_CANDIDATE_CACHE_TTL_MS = 32e3;
const PI_FILE_CANDIDATE_CACHE_MAX_ENTRIES = 8;
const SESSION_ID_PATTERN = /^(?!-)[A-Za-z0-9._:-]{1,256}$/u;
const summaryCache = /* @__PURE__ */ new Map();
const threadFileCache = /* @__PURE__ */ new Map();
const piFileCandidateCache = /* @__PURE__ */ new Map();
function threadCacheKey(storeRoot, threadId) {
	return `${storeRoot}\0${threadId}`;
}
function forgetCachedSummary(file) {
	const cached = summaryCache.get(file);
	const threadId = cached?.summary?.threadId;
	if (cached && threadId) {
		const key = threadCacheKey(cached.storeRoot, threadId);
		if (threadFileCache.get(key) === file) threadFileCache.delete(key);
	}
	summaryCache.delete(file);
}
function cacheSummary(file, value) {
	forgetCachedSummary(file);
	summaryCache.set(file, value);
	while (summaryCache.size > MAX_SUMMARY_CACHE_ENTRIES) {
		const oldest = summaryCache.keys().next().value;
		if (typeof oldest !== "string") break;
		forgetCachedSummary(oldest);
	}
}
async function discoverPiSessionFiles(env) {
	const store = piSessionStore(env);
	const resolvedRoot = await realpathOrResolve(store.root);
	let entries;
	try {
		entries = await fs$1.readdir(resolvedRoot, { withFileTypes: true });
	} catch {
		return {
			root: store.root,
			files: []
		};
	}
	if (store.flat) return {
		root: store.root,
		files: entries.filter((entry) => entry.isFile() && entry.name.endsWith(".jsonl")).slice(0, MAX_DISCOVERY_FILES).map((entry) => path.join(resolvedRoot, entry.name))
	};
	const files = [];
	for (const entry of entries) {
		if (!entry.isDirectory() || files.length >= MAX_DISCOVERY_FILES) continue;
		const directory = path.join(resolvedRoot, entry.name);
		let children;
		try {
			children = await fs$1.readdir(directory, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const child of children) if (child.isFile() && child.name.endsWith(".jsonl")) {
			files.push(path.join(directory, child.name));
			if (files.length >= MAX_DISCOVERY_FILES) break;
		}
	}
	return {
		root: store.root,
		files
	};
}
async function realpathOrResolve(value) {
	try {
		return await fs$1.realpath(value);
	} catch {
		return path.resolve(value);
	}
}
async function scanPiFileCandidates(env) {
	const { root, files } = await discoverPiSessionFiles(env);
	const configuredAcpRoot = piAcpSessionStoreRoot(env);
	const acpRoot = configuredAcpRoot ? await realpathOrResolve(configuredAcpRoot) : void 0;
	const { results: candidates } = await runTasksWithConcurrency({
		tasks: files.map((file) => async () => {
			try {
				const stats = await fs$1.stat(file);
				return stats.isFile() ? {
					file,
					storeRoot: root,
					identity: `${String(stats.dev)}:${String(stats.ino)}:${String(stats.birthtimeMs)}`,
					mtimeMs: stats.mtimeMs,
					size: stats.size,
					resumable: acpRoot ? isPathStrictlyInside(acpRoot, file) : false
				} : void 0;
			} catch {
				return;
			}
		}),
		limit: IO_CONCURRENCY,
		throwOnError: true
	});
	return candidates.filter((candidate) => candidate !== void 0).toSorted((left, right) => right.mtimeMs - left.mtimeMs);
}
async function piFileCandidates(env) {
	const store = piSessionStore(env);
	const key = `${store.root}\0${store.flat}\0${piAcpSessionStoreRoot(env) ?? ""}`;
	const cached = piFileCandidateCache.get(key);
	if (cached && cached.expiresAt > Date.now()) {
		piFileCandidateCache.delete(key);
		piFileCandidateCache.set(key, cached);
		return await cached.candidates;
	}
	if (cached) piFileCandidateCache.delete(key);
	const candidates = scanPiFileCandidates(env);
	const entry = {
		expiresAt: Date.now() + PI_FILE_CANDIDATE_CACHE_TTL_MS,
		candidates
	};
	piFileCandidateCache.set(key, entry);
	while (piFileCandidateCache.size > PI_FILE_CANDIDATE_CACHE_MAX_ENTRIES) {
		const oldest = piFileCandidateCache.keys().next();
		if (oldest.done) break;
		piFileCandidateCache.delete(oldest.value);
	}
	try {
		return await candidates;
	} catch (error) {
		if (piFileCandidateCache.get(key) === entry) piFileCandidateCache.delete(key);
		throw error;
	}
}
function parsePiJsonLines(content) {
	return content.split(/\r?\n/u).flatMap((line) => {
		if (!line.trim()) return [];
		try {
			const value = JSON.parse(line);
			return isRecord(value) ? [value] : [];
		} catch {
			return [];
		}
	});
}
function textFromContent$2(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.flatMap((part) => isRecord(part) && part.type === "text" && typeof part.text === "string" ? [part.text] : []).join("\n");
}
function processSummaryLine(state, line) {
	const entry = parsePiJsonLines((line.at(-1) === 13 ? line.subarray(0, -1) : line).toString("utf8"))[0];
	if (!entry) return;
	if (!state.header) {
		if (entry.type !== "session") {
			state.invalid = true;
			return;
		}
		state.header = entry;
		return;
	}
	if (entry.type === "session_info") state.name = normalizeBoundedOptionalString(entry.name, 1e3);
	else if (!state.firstMessage && entry.type === "message" && isRecord(entry.message) && entry.message.role === "user") state.firstMessage = normalizeBoundedOptionalString(textFromContent$2(entry.message.content), 1e3);
}
function appendSummaryBytes(state, bytes) {
	if (state.discarding || bytes.length === 0) return;
	if (state.pending.length + bytes.length > MAX_SUMMARY_LINE_BYTES) {
		state.pending = Buffer.alloc(0);
		state.discarding = true;
		return;
	}
	state.pending = state.pending.length === 0 ? Buffer.from(bytes) : Buffer.concat([state.pending, bytes]);
}
async function scanSummaryAppend(candidate, start, state) {
	if (start >= candidate.size || state.invalid) return;
	const stream = createReadStream(candidate.file, {
		start,
		end: candidate.size - 1
	});
	for await (const value of stream) {
		const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
		let offset = 0;
		while (offset < chunk.length) {
			const newline = chunk.indexOf(10, offset);
			const end = newline < 0 ? chunk.length : newline;
			appendSummaryBytes(state, chunk.subarray(offset, end));
			if (newline < 0) break;
			if (!state.discarding) processSummaryLine(state, state.pending);
			state.pending = Buffer.alloc(0);
			state.discarding = false;
			if (state.invalid) return;
			offset = newline + 1;
		}
	}
}
async function readAppendProof(file, size) {
	const length = Math.min(size, APPEND_PROOF_EDGE_BYTES);
	if (length === 0) return {
		head: Buffer.alloc(0),
		tail: Buffer.alloc(0)
	};
	const handle = await fs$1.open(file, "r");
	try {
		const head = Buffer.alloc(length);
		const tail = Buffer.alloc(length);
		const [headRead, tailRead] = await Promise.all([handle.read(head, 0, length, 0), handle.read(tail, 0, length, size - length)]);
		return {
			head: head.subarray(0, headRead.bytesRead),
			tail: tail.subarray(0, tailRead.bytesRead)
		};
	} finally {
		await handle.close();
	}
}
async function cachedPrefixIsUnchanged(candidate, cached) {
	if (cached.identity !== candidate.identity || cached.size >= candidate.size) return false;
	const current = await readAppendProof(candidate.file, cached.size);
	return current.head.equals(cached.appendProof.head) && current.tail.equals(cached.appendProof.tail);
}
async function readPiSessionSummary(candidate) {
	const cached = summaryCache.get(candidate.file);
	if (cached?.mtimeMs === candidate.mtimeMs && cached.size === candidate.size) {
		summaryCache.delete(candidate.file);
		summaryCache.set(candidate.file, cached);
		return cached.summary ? {
			...cached.summary,
			canContinue: candidate.resumable
		} : cached.summary;
	}
	let summary;
	let scanState;
	let appendProof;
	try {
		const resumable = cached && await cachedPrefixIsUnchanged(candidate, cached) ? cached : void 0;
		scanState = resumable ? {
			...resumable.scanState,
			pending: Buffer.from(resumable.scanState.pending)
		} : {
			pending: Buffer.alloc(0),
			discarding: false,
			invalid: false
		};
		await scanSummaryAppend(candidate, resumable?.size ?? 0, scanState);
		appendProof = await readAppendProof(candidate.file, candidate.size);
		const projectedState = {
			...scanState,
			pending: Buffer.from(scanState.pending)
		};
		if (!projectedState.discarding && projectedState.pending.length > 0) processSummaryLine(projectedState, projectedState.pending);
		const { header, name, firstMessage } = projectedState;
		const version = header?.type === "session" && typeof header.version === "number" ? header.version : 1;
		const threadId = header?.type === "session" ? normalizeBoundedOptionalString(header.id, 256) : void 0;
		if (header && threadId && SESSION_ID_PATTERN.test(threadId)) {
			const cwd = normalizeBoundedOptionalString(header.cwd, 4096);
			const createdAt = parsePiSessionTimestampMs(header.timestamp);
			summary = {
				file: candidate.file,
				version,
				threadId,
				...name || firstMessage ? { name: name ?? firstMessage } : {},
				...cwd ? { cwd } : {},
				status: "stored",
				...createdAt !== void 0 ? { createdAt } : {},
				updatedAt: candidate.mtimeMs,
				recencyAt: candidate.mtimeMs,
				source: "pi-cli",
				modelProvider: "pi",
				archived: false,
				canContinue: candidate.resumable,
				canArchive: false
			};
		}
	} catch {
		return cached?.summary;
	}
	if (cached?.summary?.threadId && cached.summary.threadId !== summary?.threadId) threadFileCache.delete(threadCacheKey(cached.storeRoot, cached.summary.threadId));
	cacheSummary(candidate.file, {
		...candidate,
		summary,
		scanState,
		appendProof
	});
	if (summary) threadFileCache.set(threadCacheKey(candidate.storeRoot, summary.threadId), candidate.file);
	return summary;
}
function summaryMatches(summary, needle) {
	if (!needle) return true;
	return [
		summary.threadId,
		summary.name,
		summary.cwd
	].some((field) => field?.toLocaleLowerCase().includes(needle));
}
async function listPiSummaryPage(env, params) {
	const candidates = await piFileCandidates(env);
	const activeFiles = new Set(candidates.map((candidate) => candidate.file));
	for (const file of summaryCache.keys()) if (!activeFiles.has(file)) forgetCachedSummary(file);
	const target = params.offset + params.limit + 1;
	const matches = [];
	const needle = params.searchTerm?.toLocaleLowerCase();
	for (let index = 0; index < candidates.length && matches.length < target; index += SUMMARY_SCAN_BATCH_SIZE) {
		const batch = candidates.slice(index, index + SUMMARY_SCAN_BATCH_SIZE);
		const { results: summaries } = await runTasksWithConcurrency({
			tasks: batch.map((candidate) => () => readPiSessionSummary(candidate)),
			limit: IO_CONCURRENCY,
			throwOnError: true
		});
		for (const summary of summaries) if (summary && summaryMatches(summary, needle)) {
			matches.push(summary);
			if (matches.length >= target) break;
		}
	}
	return {
		summaries: matches.slice(params.offset, params.offset + params.limit),
		hasMore: matches.length > params.offset + params.limit
	};
}
async function findPiSummary(threadId, env) {
	const candidates = await piFileCandidates(env);
	for (let index = 0; index < candidates.length; index += SUMMARY_SCAN_BATCH_SIZE) {
		const { results: summaries } = await runTasksWithConcurrency({
			tasks: candidates.slice(index, index + SUMMARY_SCAN_BATCH_SIZE).map((candidate) => () => readPiSessionSummary(candidate)),
			limit: IO_CONCURRENCY,
			throwOnError: true
		});
		const match = summaries.find((summary) => summary?.threadId === threadId);
		if (match) return match;
	}
}
async function readPiSessionFileBaseline(threadId, env) {
	const summary = await findPiSummary(threadId, env);
	if (!summary?.canContinue || summary.version < 3) return;
	try {
		const stats = await fs$1.stat(summary.file);
		return stats.isFile() ? {
			filePath: summary.file,
			offset: stats.size
		} : void 0;
	} catch {
		return;
	}
}
async function readPiSessionById(threadId, env) {
	const cacheKey = threadCacheKey(piSessionStore(env).root, threadId);
	let file = threadFileCache.get(cacheKey);
	for (let attempt = 0; attempt < 2; attempt += 1) {
		if (!file) file = (await findPiSummary(threadId, env))?.file;
		if (!file) throw new Error("Pi session was not found");
		try {
			const stats = await fs$1.stat(file);
			if (!stats.isFile()) throw new Error("Pi session is not a file");
			if (stats.size > MAX_SESSION_BYTES) throw new RangeError("Pi session exceeds the 32 MiB read safety limit");
			const entries = parsePiJsonLines(await fs$1.readFile(file, "utf8"));
			if (entries[0]?.type === "session" && entries[0].id === threadId) return entries;
		} catch (error) {
			if (error instanceof RangeError) throw error;
			if (attempt > 0) throw new Error("Pi session is unavailable", { cause: error });
		}
		threadFileCache.delete(cacheKey);
		file = void 0;
	}
	throw new Error("Pi session changed during read");
}
//#endregion
//#region extensions/acpx/src/pi-session-catalog.ts
const MAX_SEARCH_LENGTH = 500;
const isExactPiSessionCursor = sessionCatalogPaging.isExactCursor;
function textFromContent$1(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.flatMap((part) => {
		if (!isRecord(part)) return [];
		if (part.type === "text" && typeof part.text === "string") return [part.text];
		if (part.type === "image") {
			const mimeType = normalizeBoundedOptionalString(part.mimeType, 128);
			return [mimeType ? `[image: ${mimeType}]` : "[image]"];
		}
		return [];
	}).join("\n");
}
const PI_PARAMETER_MESSAGES = {
	listNotObject: "Pi session list parameters must be an object",
	unknownListParameter: (key) => `unknown Pi session list parameter: ${key}`,
	invalidSearchTerm: "searchTerm is invalid",
	readNotObject: "Pi session read parameters must be an object",
	unknownReadParameter: (key) => `unknown Pi session read parameter: ${key}`,
	invalidThreadId: "threadId is invalid"
};
async function listLocalPiSessionPage(value) {
	const params = sessionCatalogPaging.parseListParams(value, {
		searchMaxLength: MAX_SEARCH_LENGTH,
		messages: PI_PARAMETER_MESSAGES
	});
	const offset = sessionCatalogPaging.decodeCursor(params.cursor);
	const { summaries, hasMore } = await listPiSummaryPage(process.env, {
		offset,
		limit: params.limit,
		...params.searchTerm ? { searchTerm: params.searchTerm } : {}
	});
	const page = summaries.map(({ file: _file, version: _version, ...session }) => session);
	return {
		sessions: page,
		...hasMore ? { nextCursor: sessionCatalogPaging.encodeCursor(offset + page.length) } : {}
	};
}
function isoTimestamp(message, entry) {
	const value = parsePiSessionTimestampMs(message.timestamp) ?? parsePiSessionTimestampMs(entry.timestamp);
	if (value === void 0) return;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? void 0 : date.toISOString();
}
function jsonText(value, maxLength = 2e4) {
	try {
		const text = JSON.stringify(value);
		return text.length > maxLength ? `${truncateUtf16Safe(text, maxLength)}…` : text;
	} catch {
		return;
	}
}
function activePiEntries(entries) {
	const header = entries[0];
	if ((header?.type === "session" && typeof header.version === "number" ? header.version : 1) < 2) return entries.slice(1);
	const body = entries.filter((entry) => entry.type !== "session" && normalizeBoundedOptionalString(entry.id, 256));
	const byId = new Map(body.map((entry) => [String(entry.id), entry]));
	const active = [];
	let current = body.at(-1);
	const visited = /* @__PURE__ */ new Set();
	while (current) {
		const id = String(current.id);
		if (visited.has(id)) break;
		visited.add(id);
		active.push(current);
		const parentId = normalizeBoundedOptionalString(current.parentId, 256);
		current = parentId ? byId.get(parentId) : void 0;
	}
	return active.toReversed();
}
function piMessageItems(entry) {
	if (!isRecord(entry.message)) return [];
	const message = entry.message;
	const role = message.role;
	const id = normalizeBoundedOptionalString(entry.id, 256);
	const timestamp = isoTimestamp(message, entry);
	const model = normalizeBoundedOptionalString(message.model, 256);
	const provider = normalizeBoundedOptionalString(message.provider, 256);
	const modelRef = provider && model ? `${provider}/${model}` : model;
	const common = {
		...id ? { id } : {},
		...timestamp ? { timestamp } : {},
		...modelRef ? { model: modelRef } : {}
	};
	if (role === "user") {
		const text = textFromContent$1(message.content);
		return text ? [{
			...common,
			type: "userMessage",
			text
		}] : [];
	}
	if (role === "toolResult") {
		const toolName = normalizeBoundedOptionalString(message.toolName, 256);
		const text = textFromContent$1(message.content);
		return [{
			...common,
			type: "toolResult",
			text: toolName ? `${toolName}\n${text}` : text
		}];
	}
	if (role === "bashExecution") {
		const command = normalizeBoundedOptionalString(message.command, 4096) ?? "bash";
		const output = typeof message.output === "string" ? message.output : "";
		const status = message.cancelled === true ? "command cancelled" : typeof message.exitCode === "number" && message.exitCode !== 0 ? `command exited with code ${String(message.exitCode)}` : "";
		return [{
			...common,
			type: "toolCall",
			text: `bash\n${command}`
		}, {
			...common,
			...id ? { id: `${id}:result` } : {},
			type: "toolResult",
			text: [output, status].filter(Boolean).join("\n\n")
		}];
	}
	if (role === "custom" || role === "hookMessage") {
		if (message.display !== true) return [];
		const customType = normalizeBoundedOptionalString(message.customType, 256);
		const text = textFromContent$1(message.content);
		return text ? [{
			...common,
			type: "other",
			text: customType ? `${customType}\n${text}` : text
		}] : [];
	}
	if (role !== "assistant" || !Array.isArray(message.content)) return [];
	return message.content.flatMap((part, index) => {
		if (!isRecord(part)) return [];
		const partCommon = {
			...common,
			...id ? { id: `${id}:${String(index)}` } : {}
		};
		if (part.type === "text" && typeof part.text === "string") return [{
			...partCommon,
			type: "agentMessage",
			text: part.text
		}];
		if (part.type === "thinking" && typeof part.thinking === "string") return [{
			...partCommon,
			type: "reasoning",
			text: part.thinking
		}];
		if (part.type === "toolCall") {
			const name = normalizeBoundedOptionalString(part.name, 256) ?? "tool";
			const args = jsonText(part.arguments);
			return [{
				...partCommon,
				type: "toolCall",
				text: args ? `${name}\n${args}` : name
			}];
		}
		return [];
	});
}
function piTranscriptItems(entries) {
	return activePiEntries(entries).flatMap((entry) => {
		if (entry.type === "message") return piMessageItems(entry);
		const id = normalizeBoundedOptionalString(entry.id, 256);
		const timestamp = normalizeBoundedOptionalString(entry.timestamp, 128);
		const common = {
			...id ? { id } : {},
			...timestamp ? { timestamp } : {}
		};
		if (entry.type === "compaction" && typeof entry.summary === "string") return [{
			...common,
			type: "other",
			text: entry.summary
		}];
		if (entry.type === "branch_summary" && typeof entry.summary === "string") return [{
			...common,
			type: "other",
			text: entry.summary
		}];
		if (entry.type === "custom_message" && entry.display === true) {
			const text = textFromContent$1(entry.content);
			return text ? [{
				...common,
				type: "other",
				text
			}] : [];
		}
		return [];
	});
}
async function readLocalPiTranscriptPage(value) {
	const params = sessionCatalogPaging.parseReadParams(value, {
		threadIdMaxLength: 256,
		threadIdPattern: PI_SESSION_ID_PATTERN,
		messages: PI_PARAMETER_MESSAGES
	});
	const offset = sessionCatalogPaging.decodeCursor(params.cursor);
	const items = piTranscriptItems(await readPiSessionById(params.threadId, process.env));
	const page = sessionCatalogPaging.boundTranscriptPage(items, params.limit, offset);
	return {
		hostId: PI_LOCAL_SESSION_HOST_ID,
		label: "Local Pi",
		threadId: params.threadId,
		...page
	};
}
//#endregion
//#region extensions/acpx/src/pi-session-upstream-activity.ts
const MAX_PI_UPSTREAM_SCAN_BYTES = 1048576;
function parseCompletePiRows(tail) {
	const entries = [];
	let lineStart = 0;
	let classifiedBytes = 0;
	for (let index = 0; index < tail.length; index += 1) {
		if (tail[index] !== 10) continue;
		const line = tail.subarray(lineStart, index).toString("utf8").trim();
		if (line) try {
			const value = JSON.parse(line);
			if (!isRecord(value)) break;
			entries.push(value);
		} catch {
			break;
		}
		classifiedBytes = index + 1;
		lineStart = index + 1;
	}
	return {
		entries,
		classifiedBytes
	};
}
function textFromContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return;
	return content.flatMap((part) => isRecord(part) && part.type === "text" && typeof part.text === "string" ? [part.text] : []).join("\n") || void 0;
}
function readFilePath(probe) {
	return isRecord(probe.upstreamRef) && typeof probe.upstreamRef.filePath === "string" ? probe.upstreamRef.filePath : void 0;
}
function readMarkerOffset(probe) {
	return isRecord(probe.marker) && Number.isSafeInteger(probe.marker.offset) && Number(probe.marker.offset) >= 0 ? Number(probe.marker.offset) : void 0;
}
async function linkContinuedPiSession(sessionKey, threadId) {
	try {
		const baseline = await readPiSessionFileBaseline(threadId, process.env);
		return baseline ? {
			sessionKey,
			upstream: {
				kind: "pi-cli",
				ref: { filePath: baseline.filePath },
				marker: { offset: baseline.offset }
			}
		} : { sessionKey };
	} catch {
		return { sessionKey };
	}
}
async function checkPiSessionUpstreamActivity(probe) {
	if (probe.hostId !== "gateway" || probe.upstreamKind !== "pi-cli") return;
	const filePath = readFilePath(probe);
	const markerOffset = readMarkerOffset(probe);
	if (!filePath || markerOffset === void 0) return;
	let handle;
	try {
		handle = await fs$1.open(filePath, "r");
	} catch (error) {
		return isRecord(error) && error.code === "ENOENT" ? {
			kind: "missing",
			sessionKey: probe.sessionKey
		} : void 0;
	}
	try {
		const stat = await handle.stat();
		if (!stat.isFile()) return {
			kind: "missing",
			sessionKey: probe.sessionKey
		};
		if (stat.size <= markerOffset) return;
		const readLength = Math.min(stat.size - markerOffset, MAX_PI_UPSTREAM_SCAN_BYTES);
		const { entries, classifiedBytes } = parseCompletePiRows(await readFileRangeAsync(handle, markerOffset, readLength));
		if (classifiedBytes === 0) return;
		let humanTurns = 0;
		let occurredAt;
		for (const entry of entries) {
			if (entry.type !== "message" || !isRecord(entry.message) || entry.message.role !== "user") continue;
			const text = textFromContent(entry.message.content);
			if (!isExternalUserText(probe, text)) continue;
			humanTurns += 1;
			occurredAt = Math.max(occurredAt ?? 0, parsePiSessionTimestampMs(entry.message.timestamp) ?? parsePiSessionTimestampMs(entry.timestamp) ?? stat.mtimeMs);
		}
		const nextOffset = markerOffset + classifiedBytes;
		return {
			kind: "activity",
			sessionKey: probe.sessionKey,
			humanTurns,
			nextMarker: { offset: nextOffset },
			...humanTurns > 0 ? {
				occurredAt: occurredAt ?? stat.mtimeMs,
				dedupeId: String(nextOffset)
			} : {}
		};
	} finally {
		await handle.close();
	}
}
async function checkPiUpstreamActivity(probes) {
	const outcomes = [];
	for (const probe of probes) try {
		const outcome = await checkPiSessionUpstreamActivity(probe);
		if (outcome) outcomes.push(outcome);
	} catch {}
	return outcomes;
}
//#endregion
//#region extensions/acpx/src/pi-session-catalog-runtime.ts
const NODE_TIMEOUT_MS = 2e4;
const ACPX_BACKEND_ID = "acpx";
const PI_ACP_AGENT_ID = "pi";
const PI_ADOPTED_SESSION_KEY_PREFIX = "plugin:acpx:catalog-adopt:pi:";
async function requireLocalPiSession(threadId) {
	const session = (await listLocalPiSessionPage({
		searchTerm: threadId,
		limit: 100
	})).sessions.find((candidate) => candidate.threadId === threadId);
	if (!session) throw new Error("Pi session is unavailable");
	return session;
}
function currentPiCatalogConfig(api) {
	return api.runtime.config?.current?.() ?? api.config ?? {};
}
function resolvePiContinuationAvailability(api) {
	const availability = resolveAcpSessionAvailability({
		config: currentPiCatalogConfig(api),
		backendId: ACPX_BACKEND_ID,
		agentId: PI_ACP_AGENT_ID
	});
	if (!availability.available) return availability;
	return resolveNodeHostExecutable("pi", {
		env: process.env,
		pathEnv: process.env.PATH ?? "",
		strategy: "fallback"
	}) ? { available: true } : {
		available: false,
		message: "Pi CLI is unavailable"
	};
}
function listAdoptedPiSessions(api, agentId, sessionEntries) {
	return listAdoptedSessionCatalogSessions({
		...agentId ? { agentId } : {},
		config: currentPiCatalogConfig(api),
		pluginId: api.id,
		runtime: api.runtime,
		sessionEntries,
		sourceFromEntry: (entry) => {
			const acpx = isRecord(entry.pluginExtensions?.acpx) ? entry.pluginExtensions.acpx : void 0;
			const marker = acpx && isRecord(acpx.piSessionCatalog) ? acpx.piSessionCatalog : void 0;
			return marker && typeof marker.sourceThreadId === "string" ? {
				hostId: PI_LOCAL_SESSION_HOST_ID,
				threadId: marker.sourceThreadId
			} : void 0;
		}
	});
}
async function createAdoptedPiSession(params) {
	const config = currentPiCatalogConfig(params.api);
	const marker = { sourceThreadId: params.threadId };
	return { sessionKey: (await params.api.runtime.agent.session.createSessionEntry({
		cfg: config,
		key: sessionCatalogAdoptedSessionKey(PI_ADOPTED_SESSION_KEY_PREFIX, params.threadId),
		agentId: params.agentId,
		recoverMatchingInitialEntry: true,
		...params.session.name ? { displayName: params.session.name } : {},
		...params.session.cwd ? { spawnedCwd: params.session.cwd } : {},
		initialEntry: {
			acpBackendId: ACPX_BACKEND_ID,
			acpSessionBinding: {
				acpAgentId: PI_ACP_AGENT_ID,
				agentSessionId: params.threadId
			},
			pluginExtensions: { acpx: { piSessionCatalog: marker } }
		},
		afterCreate: async (entry) => {
			await importSessionCatalogHistory({
				catalogId: "pi",
				threadId: params.threadId,
				read: async ({ cursor, limit }) => await readLocalPiTranscriptPage({
					threadId: params.threadId,
					limit,
					...cursor ? { cursor } : {}
				}),
				sessionId: entry.sessionId,
				sessionKey: entry.key,
				agentId: entry.agentId,
				...params.session.cwd ? { cwd: params.session.cwd } : {},
				config
			});
			return { pluginExtensions: { acpx: { piSessionCatalog: marker } } };
		}
	})).key };
}
function assertPiLocalAccess(hostId, allowProcessHomeFallback) {
	if (hostId === "gateway" && allowProcessHomeFallback === false && piSessionStore(process.env).usesProcessHomeFallback) throw new Error("local Pi sessions are unavailable in isolated state");
}
async function listPiSessions(params) {
	return await listLocalPiSessionPage(params);
}
async function readPiSession(params) {
	return await readLocalPiTranscriptPage(params);
}
function createPiSessionCatalogRuntime(api) {
	return createSessionCatalogFamily({
		runtime: api.runtime,
		local: {
			hostId: PI_LOCAL_SESSION_HOST_ID,
			label: "Local Pi",
			available: (query) => {
				const store = piSessionStore(process.env);
				return (query.allowProcessHomeFallback !== false || !store.usesProcessHomeFallback) && piSessionStoreAvailable(process.env, store);
			},
			list: async (query) => await listLocalPiSessionPage({
				limit: query.limitPerHost,
				...query.search ? { searchTerm: query.search } : {},
				cursor: query.cursors?.[PI_LOCAL_SESSION_HOST_ID]
			}),
			read: async (request) => await readLocalPiTranscriptPage({
				threadId: request.threadId,
				...request.limit ? { limit: request.limit } : {},
				...request.cursor !== void 0 ? { cursor: request.cursor } : {}
			}),
			assertAccess: assertPiLocalAccess
		},
		node: {
			listCommand: PI_SESSIONS_LIST_COMMAND,
			readCommand: PI_SESSION_READ_COMMAND,
			terminalCommand: PI_TERMINAL_RESUME_COMMAND,
			timeoutMs: NODE_TIMEOUT_MS,
			maxHosts: 100,
			maxPageLimit: 100,
			sessionIdPattern: PI_SESSION_ID_PATTERN
		},
		capabilities: {
			local: () => ({
				canContinue: resolvePiContinuationAvailability(api).available,
				canOpenTerminal: resolveNodeHostExecutable("pi", {
					env: process.env,
					pathEnv: process.env.PATH ?? "",
					strategy: "fallback"
				}) !== void 0
			}),
			node: (node) => {
				return {
					canContinue: false,
					canOpenTerminal: (node.invocableCommands ?? node.commands)?.includes(PI_TERMINAL_RESUME_COMMAND) === true
				};
			},
			project: (session, capabilities) => ({
				...session,
				canContinue: capabilities.canContinue && session.canContinue,
				canOpenTerminal: capabilities.canOpenTerminal
			})
		},
		messages: {
			invalidNodeCursor: "Pi node returned an invalid cursor",
			invalidNodeSessionPage: "Pi node returned an invalid session page",
			invalidNodeTranscriptPage: "Pi node returned an invalid transcript page",
			invalidHostId: "Pi session catalog hostId is invalid",
			localReadFailed: "Local Pi sessions are unavailable",
			nodeInvokeFailed: "Paired node Pi sessions are unavailable",
			nodeReadUnavailable: "paired-node Pi session host is unavailable",
			nodeTerminalUnavailable: "paired-node Pi terminal is unavailable",
			sessionUnavailable: "Pi session is unavailable"
		},
		continuation: {
			resolveAgentId: (agentId) => resolveSessionAgentIdsStrict({
				config: api.config,
				agentId
			}).sessionAgentId,
			availability: () => resolvePiContinuationAvailability(api),
			listAdopted: (agentId, sessionEntries) => listAdoptedPiSessions(api, agentId, sessionEntries),
			loadSession: requireLocalPiSession,
			validateSession: (session) => {
				if (!session.canContinue) throw new Error("Pi session is outside the session store supported by pi-acp");
			},
			create: async (params) => await createAdoptedPiSession({
				api,
				...params
			}),
			complete: async (continued, threadId) => await linkContinuedPiSession(continued.sessionKey, threadId),
			nodeReadOnlyMessage: "paired-node Pi session rows are view-only"
		},
		terminal: {
			executable: "pi",
			uploadPathStyle: "native",
			args: (threadId) => ["--session", threadId],
			title: (threadId) => `pi --session ${threadId.slice(0, 12)}…`,
			requireLocalSession: requireLocalPiSession,
			unavailableMessage: "Pi CLI is unavailable"
		},
		checkUpstreamActivity: (probes, policy) => checkPiUpstreamActivity(probes.filter((probe) => probe.hostId !== "gateway" || policy?.allowProcessHomeFallback !== false || !piSessionStore(process.env).usesProcessHomeFallback))
	}, isExactPiSessionCursor);
}
//#endregion
export { createPiSessionCatalogRuntime, listPiSessions, readPiSession, requireLocalPiSession };
