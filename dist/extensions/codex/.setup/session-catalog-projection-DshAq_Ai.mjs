import { D as toCatalogSession, N as detachCodexCatalogString, O as truncateCodexCatalogPreview, S as readControlCursor, d as boundedCatalogString } from "./session-catalog-parsing-BS06j5dj.mjs";
import { p as isOpenClawManagedCodexThread } from "./auth-cache-key-DS0mnvrR.mjs";
import { n as codexCatalogRowRecency } from "./session-catalog-index-order-Zr1Fcc_7.mjs";
import { c as getCodexCatalogSource, d as setCodexCatalogSource, s as copyCodexCatalogSource } from "./session-catalog-native-projection-BLwj5FZe.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import { extractErrorCode } from "openclaw/plugin-sdk/error-runtime";
import fs from "node:fs/promises";
import { constants, createZstdDecompress } from "node:zlib";
import { root } from "openclaw/plugin-sdk/file-access-runtime";
// extensions/codex/src/session-catalog-rollouts.ts
const loadTextChunking = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/text-chunking"));
const WINDOW_BYTES = 131072;
const ROLLOUT_SOURCE_DENIAL_CODES = /* @__PURE__ */ new Set([
	"symlink",
	"hardlink",
	"outside-workspace",
	"invalid-path",
	"device-path",
	"not-file",
	"path-alias"
]);
/** Codex returns the plain logical path for either rollout representation. */
function codexCatalogRolloutLogicalPath(rolloutPath) {
	return rolloutPath.replace(/\.zst$/u, "");
}
function resolveCodexCatalogRolloutFingerprint(rolloutPath, previous, files) {
	const logicalPath = rolloutPath && codexCatalogRolloutLogicalPath(rolloutPath);
	if (!logicalPath) return;
	return files?.get(logicalPath) ?? files?.get(`${logicalPath}.zst`) ?? (previous?.rolloutPath && codexCatalogRolloutLogicalPath(previous.rolloutPath) === logicalPath ? previous.fingerprint : void 0);
}
function* records(bytes, skipFirst) {
	const text = bytes.toString("utf8");
	let start = skipFirst ? text.indexOf("\n") + 1 : 0;
	for (let end; (end = text.indexOf("\n", start)) !== -1; start = end + 1) {
		const line = text.slice(start, end);
		if (start > 0 && !/"(?:user_message|item_completed|task_started|turn_started|thread_settings_applied)"|\\u/u.test(line)) continue;
		try {
			const value = JSON.parse(line);
			yield isRecord(value) ? value : void 0;
		} catch {
			yield void 0;
		}
	}
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
	return truncateCodexCatalogPreview(message ?? "", sanitize) || (image ? "[Image]" : audio ? "[Audio]" : void 0);
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
		const envelope = first.next().value;
		if (envelope?.type !== "session_meta" || !isRecord(envelope.payload)) return;
		const metadata = envelope.payload;
		const id = boundedCatalogString(metadata.id, 256);
		const createdAt = typeof metadata.timestamp === "string" ? Date.parse(metadata.timestamp) : NaN;
		if (!id || !Number.isFinite(createdAt)) return;
		const windows = [first];
		if (!compressed && stat.size > head.length) {
			const offset = Math.max(head.length, stat.size - WINDOW_BYTES);
			const bytes = Buffer.alloc(stat.size - offset);
			await handle.read(bytes, 0, bytes.length, offset);
			windows.push(records(bytes, true));
		}
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
		const { sanitizeTerminalText } = await loadTextChunking();
		for (const window of windows) for (const record of window) {
			if (record?.type !== "event_msg" || !isRecord(record.payload)) continue;
			const payload = record.payload;
			if (window === first && !thread.preview) {
				const preview = previewFromEvent(payload, sanitizeTerminalText);
				if (preview) thread.preview = preview;
			}
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
// extensions/codex/src/session-catalog-projection.ts
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
	hasActiveWork() {
		return this.active > 0;
	}
	async run(work) {
		if (this.active >= 2e4) throw new CodexCatalogProjectionCapacityError();
		this.active++;
		try {
			return await work();
		} finally {
			this.active--;
		}
	}
};
/** Consumes metadata already bounded by the native transport or rollout projector. */
async function projectCodexCatalogPage(response, params = {}) {
	const { diagnostics } = params;
	const responseStarted = performance.now();
	const rows = [];
	const excludedThreadIds = [];
	try {
		const backwardsCursor = readControlCursor(response.backwardsCursor, "backwards response");
		for (const thread of response.data) {
			if (thread.ephemeral === true) {
				excludedThreadIds.push(thread.id);
				continue;
			}
			const page = { sessions: [] };
			if (await isOpenClawManagedCodexThread(thread, params.localSessionsRoot, diagnostics ?? void 0)) {
				const rolloutPath = thread.path?.trim();
				page.managedThreads = [{
					threadId: thread.id,
					...rolloutPath ? { rolloutPath } : {}
				}];
			} else {
				const session = toCatalogSession(thread, thread.preview);
				if (session) page.sessions.push(session);
			}
			rows.push(setCodexCatalogSource({
				threadId: thread.id,
				archived: false,
				nativeMetadata: true,
				...thread.preview != null ? { preview: thread.preview } : {},
				...thread.path ? { rolloutPath: thread.path } : {},
				updatedAt: thread.updatedAt ?? null,
				recencyAt: thread.recencyAt ?? null,
				page
			}, getCodexCatalogSource(thread)));
		}
		return {
			rows,
			...excludedThreadIds.length ? { excludedThreadIds } : {},
			nextCursor: readControlCursor(response.nextCursor, "next response"),
			backwardsCursor
		};
	} finally {
		if (diagnostics) diagnostics.fields.postResponseMs = (diagnostics.fields.postResponseMs ?? 0) + performance.now() - responseStarted;
	}
}
/** Native activity/path changes invalidate the retained first-user preview. */
function canReuseCodexCatalogPreview(row, thread) {
	return Boolean(row && !row.archived && row.updatedAt === (thread.updatedAt ?? null) && row.recencyAt === (thread.recencyAt ?? null) && (row.rolloutPath ? codexCatalogRolloutLogicalPath(row.rolloutPath) : void 0) === (thread.path ? codexCatalogRolloutLogicalPath(thread.path) : void 0));
}
async function projectCodexCatalogDeltaPage(response, params) {
	const reusable = response.data.map((thread) => {
		const row = params.getRow(thread.id);
		if (thread.ephemeral === true || !row || !canReuseCodexCatalogPreview(row, thread)) return;
		if (row.page.sessions.length === 0) return copyCodexCatalogSource(thread, {
			...row,
			nativeMetadata: true
		});
		if (thread.preview != null && Boolean(thread.preview) !== Boolean(row.preview)) return;
		const session = toCatalogSession(thread, row.preview);
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
export { CodexCatalogProjectionCapacityError, CodexCatalogProjections, canReuseCodexCatalogPreview, mergeCodexCatalogRolloutRow, readCodexCatalogRollout as n, projectCodexCatalogDeltaPage, projectCodexCatalogPage, resolveCodexCatalogRolloutFingerprint as r, codexCatalogRolloutLogicalPath as t };
