import { B as toCatalogSession, C as boundedCatalogString, P as readControlCursor, V as truncateCodexCatalogPreview, W as detachCodexCatalogString, c as copyCodexCatalogSource, f as setCodexCatalogSource, l as getCodexCatalogSource, r as projectCodexCatalogNativeThread, z as selectCodexCatalogPreviewInput } from "./session-catalog-native-projection-DowriLid.mjs";
import { a as isOpenClawManagedCodexThread } from "./session-catalog-events-Bj6j94E_.mjs";
import { n as codexCatalogRowRecency } from "./session-catalog-index-order-hcdz07yN.mjs";
import { asFiniteNumber, isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import fs from "node:fs/promises";
import { root } from "openclaw/plugin-sdk/file-access-runtime";
import { extractErrorCode, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { constants, createZstdDecompress } from "node:zlib";
import { sanitizeTerminalText } from "openclaw/plugin-sdk/text-chunking";
//#region extensions/codex/src/session-catalog-rollouts.ts
const WINDOW_BYTES = 131072;
const DIRECTORY_PARTS = [
	/^\d{4}$/,
	/^(?:0[1-9]|1[0-2])$/,
	/^(?:0[1-9]|[12]\d|3[01])$/
];
const ROLLOUT_FILE_NAME = /\.jsonl(?:\.zst)?$/;
const ROLLOUT_SOURCE_DENIAL_CODES = /* @__PURE__ */ new Set([
	"symlink",
	"hardlink",
	"outside-workspace",
	"invalid-path",
	"device-path",
	"not-file",
	"path-alias"
]);
function compareRolloutCandidates(left, right) {
	return left[1].mtimeMs - right[1].mtimeMs || (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0);
}
/** Retain only the newest fingerprints while streaming an arbitrarily large home. */
var NewestRolloutCandidates = class {
	constructor() {
		this.heap = [];
	}
	offer(candidate) {
		if (this.heap.length < 2e4) {
			let childIndex = this.heap.length;
			this.heap.push(candidate);
			while (childIndex > 0) {
				const parentIndex = Math.floor((childIndex - 1) / 2);
				const parent = this.heap[parentIndex];
				if (!parent || compareRolloutCandidates(parent, candidate) <= 0) break;
				this.heap[childIndex] = parent;
				childIndex = parentIndex;
			}
			this.heap[childIndex] = candidate;
			return;
		}
		const oldest = this.heap[0];
		if (!oldest || compareRolloutCandidates(candidate, oldest) <= 0) return;
		let parentIndex = 0;
		while (true) {
			let childIndex = parentIndex * 2 + 1;
			let child = this.heap[childIndex];
			if (!child) break;
			const right = this.heap[childIndex + 1];
			if (right && compareRolloutCandidates(right, child) < 0) {
				child = right;
				childIndex++;
			}
			if (compareRolloutCandidates(candidate, child) <= 0) break;
			this.heap[parentIndex] = child;
			parentIndex = childIndex;
		}
		this.heap[parentIndex] = candidate;
	}
	finish() {
		this.heap.sort((left, right) => compareRolloutCandidates(right, left));
		return new Map(this.heap);
	}
};
/** Codex returns the plain logical path for either rollout representation. */
function codexCatalogRolloutLogicalPath(rolloutPath) {
	return rolloutPath.replace(/\.zst$/u, "");
}
function resolveCodexCatalogRolloutFingerprint(rolloutPath, previous, files) {
	const logicalPath = rolloutPath && codexCatalogRolloutLogicalPath(rolloutPath);
	if (!logicalPath) return;
	return files?.get(logicalPath) ?? files?.get(`${logicalPath}.zst`) ?? (previous?.rolloutPath && codexCatalogRolloutLogicalPath(previous.rolloutPath) === logicalPath ? previous.fingerprint : void 0);
}
function indexCodexCatalogRowsByRollout(rows) {
	return new Map([...rows].flatMap((row) => row.rolloutPath ? [[codexCatalogRolloutLogicalPath(row.rolloutPath), row]] : []));
}
/** Absence is meaningful only inside the layout visited by the currency scan. */
function isCodexCatalogRolloutPathCovered(sessionsRoot, rolloutPath) {
	const directories = path.relative(sessionsRoot, rolloutPath).split(path.sep);
	const fileName = directories.pop();
	return fileName !== void 0 && ROLLOUT_FILE_NAME.test(fileName) && directories.length === DIRECTORY_PARTS.length && directories.every((part, index) => DIRECTORY_PARTS[index]?.test(part) === true);
}
async function unlessMissing(operation) {
	try {
		return await operation;
	} catch (error) {
		if (isRecord(error) && error.code === "ENOENT") return;
		throw error;
	}
}
/** Stat-only currency scan. Content is read separately, only for changed fingerprints. */
async function scanCodexCatalogRollouts(sessionsRoot, trackedPaths) {
	const present = /* @__PURE__ */ new Set();
	const rootStat = await unlessMissing(fs.lstat(sessionsRoot));
	if (!rootStat?.isDirectory() || rootStat.isSymbolicLink()) return {
		files: /* @__PURE__ */ new Map(),
		present
	};
	const rootReal = await unlessMissing(fs.realpath(sessionsRoot));
	if (!rootReal) return {
		files: /* @__PURE__ */ new Map(),
		present
	};
	const candidates = new NewestRolloutCandidates();
	const scan = async (directory, depth) => {
		if (await unlessMissing(fs.realpath(directory)) !== directory) return;
		const entries = await unlessMissing(fs.opendir(directory));
		if (!entries) return;
		const directoryPattern = DIRECTORY_PARTS[depth];
		for await (const entry of entries) {
			const file = path.join(directory, entry.name);
			if (directoryPattern) {
				if (entry.isDirectory() && directoryPattern.test(entry.name)) await scan(file, depth + 1);
			} else if (entry.isFile() && ROLLOUT_FILE_NAME.test(entry.name)) {
				const stat = await unlessMissing(fs.lstat(file));
				if (stat?.isFile() && stat.nlink === 1) {
					const physicalPath = path.join(sessionsRoot, path.relative(rootReal, file));
					if (physicalPath.length > 4096) continue;
					const logicalPath = codexCatalogRolloutLogicalPath(physicalPath);
					if (trackedPaths.has(logicalPath)) present.add(logicalPath);
					if (physicalPath !== logicalPath) {
						const plain = await unlessMissing(fs.lstat(codexCatalogRolloutLogicalPath(file)));
						if (plain?.isFile() && plain.nlink === 1) continue;
					}
					candidates.offer([detachCodexCatalogString(physicalPath), {
						mtimeMs: stat.mtimeMs,
						size: stat.size
					}]);
				}
			}
		}
	};
	await scan(rootReal, 0);
	return {
		files: candidates.finish(),
		present
	};
}
function records(bytes, skipFirst) {
	const text = bytes.toString("utf8");
	const lines = text.slice(0, text.lastIndexOf("\n") + 1).split("\n");
	if (skipFirst) lines.shift();
	return lines.flatMap((line) => {
		try {
			const value = JSON.parse(line);
			return isRecord(value) ? [value] : [];
		} catch {
			return [];
		}
	});
}
function sourceFromMetadata(value) {
	if (value === void 0) return "vscode";
	if (value === "cli" || value === "vscode" || value === "exec") return value;
	if (value === "mcp") return "appServer";
	if (isRecord(value)) {
		const custom = boundedCatalogString(value.custom, 500);
		if (custom) return { custom };
	}
	return "unknown";
}
function previewFromEvent(payload, sanitize) {
	let message;
	let image = false;
	let audio = false;
	if (payload.type === "user_message") {
		message = typeof payload.message === "string" ? payload.message : void 0;
		image = [payload.images, payload.local_images].some((items) => Array.isArray(items) && items.length > 0);
		audio = [payload.audio, payload.local_audio].some((items) => Array.isArray(items) && items.length > 0);
	} else if (payload.type === "item_completed" && isRecord(payload.item) && payload.item.type === "UserMessage" && Array.isArray(payload.item.content)) {
		const content = payload.item.content.filter(isRecord);
		message = content.flatMap((item) => item.type === "text" && typeof item.text === "string" ? [item.text] : []).join("");
		image = content.some((item) => item.type === "image" || item.type === "local_image");
		audio = content.some((item) => item.type === "audio" || item.type === "local_audio");
	}
	const prefix = "## My request for Codex:";
	if (message?.includes(prefix)) message = message.slice(message.indexOf(prefix) + 24);
	return truncateCodexCatalogPreview(selectCodexCatalogPreviewInput(message ?? ""), sanitize) || (image ? "[Image]" : audio ? "[Audio]" : void 0);
}
async function compressedHead(handle, size) {
	const input = Buffer.alloc(Math.min(size, WINDOW_BYTES));
	const { bytesRead } = await handle.read(input, 0, input.length, 0);
	const decoder = createZstdDecompress({
		chunkSize: 16384,
		params: { [constants.ZSTD_d_windowLogMax]: 25 }
	});
	decoder.end(input.subarray(0, bytesRead));
	const timer = setTimeout(() => decoder.destroy(/* @__PURE__ */ new Error("Rollout read timed out")), 5e3);
	const chunks = [];
	let sizeRead = 0;
	try {
		for await (const chunk of decoder) {
			const bounded = (Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)).subarray(0, WINDOW_BYTES - sizeRead);
			chunks.push(bounded);
			sizeRead += bounded.length;
			if (sizeRead === WINDOW_BYTES) break;
		}
		return Buffer.concat(chunks);
	} finally {
		clearTimeout(timer);
		decoder.destroy();
	}
}
/** Background-only display projection; never reads an entire large rollout. */
async function readCodexCatalogRollout(sessionsRoot, rolloutPath) {
	let opened;
	try {
		const rootStat = await fs.lstat(sessionsRoot);
		if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) return;
		opened = await (await root(sessionsRoot, {
			hardlinks: "reject",
			symlinks: "reject",
			maxBytes: Number.MAX_SAFE_INTEGER
		})).open(path.relative(sessionsRoot, rolloutPath));
		const { handle, stat } = opened;
		if (!stat.size) return;
		const compressed = rolloutPath.endsWith(".zst");
		const head = compressed ? await compressedHead(handle, stat.size) : Buffer.alloc(Math.min(stat.size, WINDOW_BYTES));
		if (!compressed) await handle.read(head, 0, head.length, 0);
		const first = records(head, false);
		const envelope = records(head.subarray(0, head.indexOf(10) + 1), false)[0];
		if (envelope?.type !== "session_meta" || !isRecord(envelope.payload)) return;
		const metadata = envelope.payload;
		const id = boundedCatalogString(metadata.id, 256);
		const createdAt = typeof metadata.timestamp === "string" ? Date.parse(metadata.timestamp) : NaN;
		if (!id || !Number.isFinite(createdAt)) return;
		let tail = first;
		if (!compressed && stat.size > head.length) {
			const offset = Math.max(head.length, stat.size - WINDOW_BYTES);
			const bytes = Buffer.alloc(stat.size - offset);
			await handle.read(bytes, 0, bytes.length, offset);
			tail = records(bytes, true);
		}
		const current = await handle.stat();
		if (stat.size !== current.size || stat.mtimeMs !== current.mtimeMs) return;
		const thread = {
			id,
			projectId: null,
			path: detachCodexCatalogString(rolloutPath),
			source: sourceFromMetadata(metadata.source),
			createdAt: createdAt / 1e3,
			updatedAt: stat.mtimeMs / 1e3,
			cwd: boundedCatalogString(metadata.cwd, 4096),
			originator: typeof metadata.originator === "string" && metadata.originator.length <= 500 ? detachCodexCatalogString(metadata.originator) : void 0,
			sessionId: boundedCatalogString(metadata.session_id, 256)
		};
		const { sanitizeTerminalText } = await import("openclaw/plugin-sdk/text-chunking");
		for (const record of first) if (record.type === "event_msg" && isRecord(record.payload)) {
			const preview = previewFromEvent(record.payload, sanitizeTerminalText);
			if (preview) {
				thread.preview = preview;
				break;
			}
		}
		for (const record of tail === first ? first : [...first, ...tail]) {
			if (record.type !== "event_msg" || !isRecord(record.payload)) continue;
			const payload = record.payload;
			if (payload.type === "task_started" || payload.type === "turn_started") {
				const startedAt = typeof payload.started_at === "number" ? payload.started_at : typeof record.timestamp === "string" ? Date.parse(record.timestamp) / 1e3 : NaN;
				if (Number.isFinite(startedAt)) thread.recencyAt = Math.max(thread.recencyAt ?? Number.NEGATIVE_INFINITY, Math.floor(startedAt));
			}
			if (payload.type === "thread_settings_applied" && isRecord(payload.thread_settings)) thread.cwd = boundedCatalogString(payload.thread_settings.cwd, 4096) ?? thread.cwd;
		}
		return thread;
	} catch (error) {
		const code = extractErrorCode(error);
		if (code && ROLLOUT_SOURCE_DENIAL_CODES.has(code)) return;
		throw error;
	} finally {
		await opened?.handle.close().catch(() => void 0);
	}
}
//#endregion
//#region extensions/codex/src/session-catalog-projection.ts
/** Single-thread responses remain owned by their native consumers. */
function projectCodexCatalogThread(thread, localSessionsRoot) {
	try {
		const prepared = projectCodexCatalogNativeThread(thread, sanitizeTerminalText);
		return projectCodexCatalogPage({ data: [prepared] }, {
			localSessionsRoot,
			sanitize: sanitizeTerminalText,
			source: getCodexCatalogSource(prepared)
		});
	} catch (error) {
		return Promise.reject(toErrorObject(error, "Codex catalog projection failed"));
	}
}
var CodexCatalogProjectionCapacityError = class extends Error {
	constructor() {
		super("Codex catalog projection queue reached its resident row limit");
	}
};
/** Direct mutations and events share one bound across asynchronous projection work. */
var CodexCatalogProjections = class {
	constructor() {
		this.active = 0;
	}
	run(work) {
		if (this.active >= 2e4) return Promise.reject(new CodexCatalogProjectionCapacityError());
		this.active++;
		try {
			return work().finally(() => {
				this.active--;
			});
		} catch (error) {
			this.active--;
			return Promise.reject(toErrorObject(error, "Codex catalog projection failed"));
		}
	}
};
async function projectCodexCatalogPage(response, params) {
	const { diagnostics, sanitize } = params;
	const responseStarted = performance.now();
	const rows = [];
	const excludedThreadIds = [];
	try {
		readControlCursor(response.backwardsCursor, "backwards response");
		for (const thread of response.data) if (typeof thread.preview === "string" && thread.preview) thread.preview = truncateCodexCatalogPreview(selectCodexCatalogPreviewInput(thread.preview), sanitize);
		for (const thread of response.data) {
			if (thread.ephemeral === true) {
				excludedThreadIds.push(thread.id);
				continue;
			}
			const page = { sessions: [] };
			if (await isOpenClawManagedCodexThread(thread, params.localSessionsRoot, diagnostics ?? void 0)) {
				const rolloutPath = typeof thread.path === "string" ? thread.path.trim() : "";
				page.managedThreads = [{
					threadId: thread.id,
					...rolloutPath ? { rolloutPath } : {}
				}];
			} else {
				const session = toCatalogSession(thread, false, sanitize, { value: typeof thread.preview === "string" ? thread.preview : void 0 });
				if (session) page.sessions.push(session);
			}
			rows.push(setCodexCatalogSource({
				threadId: thread.id,
				archived: false,
				nativeMetadata: true,
				...typeof thread.preview === "string" ? { preview: thread.preview } : {},
				...thread.path ? { rolloutPath: thread.path } : {},
				updatedAt: asFiniteNumber(thread.updatedAt) ?? null,
				recencyAt: asFiniteNumber(thread.recencyAt) ?? null,
				page
			}, params.source ?? getCodexCatalogSource(thread)));
		}
		return {
			rows,
			...excludedThreadIds.length ? { excludedThreadIds } : {},
			nextCursor: readControlCursor(response.nextCursor, "next response"),
			backwardsCursor: readControlCursor(response.backwardsCursor, "backwards response")
		};
	} finally {
		if (diagnostics) diagnostics.fields.postResponseMs = (diagnostics.fields.postResponseMs ?? 0) + performance.now() - responseStarted;
	}
}
/** Native activity/path changes invalidate the retained first-user preview. */
function canReuseCodexCatalogPreview(row, thread) {
	return Boolean(row && !row.archived && row.updatedAt === (asFiniteNumber(thread.updatedAt) ?? null) && row.recencyAt === (asFiniteNumber(thread.recencyAt) ?? null) && (row.rolloutPath ? codexCatalogRolloutLogicalPath(row.rolloutPath) : void 0) === (thread.path ? codexCatalogRolloutLogicalPath(thread.path) : void 0));
}
async function projectCodexCatalogDeltaPage(response, params) {
	const reusable = response.data.map((thread) => {
		const row = params.getRow(thread.id);
		if (thread.ephemeral === true || !row || !canReuseCodexCatalogPreview(row, thread)) return;
		if (row.page.sessions.length === 0) return copyCodexCatalogSource(thread, {
			...row,
			nativeMetadata: true
		});
		if (typeof thread.preview === "string" && Boolean(thread.preview) !== Boolean(row.preview)) return;
		const session = toCatalogSession(thread, false, params.sanitize, { value: row.preview });
		return copyCodexCatalogSource(thread, {
			...row,
			nativeMetadata: true,
			page: { sessions: session ? [session] : [] }
		});
	});
	const changed = await projectCodexCatalogPage({
		...response,
		data: response.data.filter((_thread, index) => !reusable[index])
	}, params);
	let changedIndex = 0;
	return {
		...changed,
		rows: reusable.flatMap((row, index) => response.data[index]?.ephemeral === true ? [] : [row ?? changed.rows[changedIndex++]])
	};
}
/** Sampled rollout content cannot supersede authoritative native settings. */
function mergeCodexCatalogRolloutRow(row, existing, fingerprint) {
	const recencyAt = row.recencyAt === null ? existing?.recencyAt ?? null : Math.max(row.recencyAt, existing?.recencyAt ?? row.recencyAt);
	const metadata = existing?.nativeMetadata ? existing : row;
	const preview = row.preview ?? metadata.preview;
	const sessions = metadata.page.sessions.map((session) => {
		const updated = Object.assign({}, session);
		delete updated.fallbackName;
		if (!session.name && preview) updated.fallbackName = preview;
		if (recencyAt !== null) updated.recencyAt = recencyAt;
		return updated;
	});
	const merged = {
		...metadata,
		nativeMetadata: existing?.nativeMetadata ?? false,
		archived: existing?.archived ?? false,
		recencyAt,
		fingerprint,
		...preview !== void 0 ? { preview } : {},
		page: {
			...metadata.page,
			sessions
		}
	};
	if (existing && codexCatalogRowRecency(merged) > codexCatalogRowRecency(existing)) delete merged.sourceOrder;
	return merged;
}
//#endregion
export { CodexCatalogProjectionCapacityError, CodexCatalogProjections, resolveCodexCatalogRolloutFingerprint as a, canReuseCodexCatalogPreview, readCodexCatalogRollout as i, mergeCodexCatalogRolloutRow, indexCodexCatalogRowsByRollout as n, scanCodexCatalogRollouts as o, projectCodexCatalogDeltaPage, projectCodexCatalogPage, projectCodexCatalogThread, isCodexCatalogRolloutPathCovered as r, codexCatalogRolloutLogicalPath as t };
