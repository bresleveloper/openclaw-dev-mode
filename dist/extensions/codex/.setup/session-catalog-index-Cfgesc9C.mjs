import { N as detachCodexCatalogString, P as rememberCodexCatalogCursor, S as readControlCursor, _ as normalizeLimit, c as MAX_CWD_LENGTH, d as boundedCatalogString, h as filterCatalogPageByTitle, j as CODEX_CATALOG_MAX_ROWS, m as codexCatalogThreadStatus, o as CatalogParamsError, p as codexCatalogThreadName } from "./session-catalog-parsing-BS06j5dj.mjs";
import { f as subscribeCodexCatalogEvents } from "./auth-cache-key-DS0mnvrR.mjs";
import { p as CodexCatalogResponseTooLargeError } from "./attempt-timeouts-m7WOwoeF.mjs";
import { i as retainCodexCatalogRow, n as codexCatalogRowRecency, r as compareCodexCatalogRows, t as CodexCatalogOrdering } from "./session-catalog-index-order-Zr1Fcc_7.mjs";
import { c as codexCatalogMetadataPage, i as CodexCatalogAvailability, r as withCodexCatalogListRequest, s as CodexCatalogPersistence } from "./session-catalog-list-request-DZMPdVf5.mjs";
import { c as getCodexCatalogSource, d as setCodexCatalogSource, n as projectCodexCatalogNativeThread } from "./session-catalog-native-projection-BLwj5FZe.mjs";
import { a as reportCodexCatalogSpawnFailure, n as findCodexAppServerSpawnError } from "./spawn-error-DnFx1wgz.mjs";
import { CodexCatalogProjectionCapacityError, CodexCatalogProjections, mergeCodexCatalogRolloutRow, n as readCodexCatalogRollout, projectCodexCatalogPage, r as resolveCodexCatalogRolloutFingerprint, t as codexCatalogRolloutLogicalPath } from "./session-catalog-projection-DshAq_Ai.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import fs from "node:fs";
import path from "node:path";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-registration";
import { coerceErrorMessage, extractErrorCode } from "openclaw/plugin-sdk/error-runtime";
import { isDeepStrictEqual } from "node:util";
import fs$1 from "node:fs/promises";
import { setImmediate as setImmediate$1 } from "node:timers/promises";
import { sha256Hex } from "openclaw/plugin-sdk/node-crypto-runtime";
import { sanitizeTerminalText } from "openclaw/plugin-sdk/text-chunking";
// extensions/codex/src/session-catalog-index-cursor.ts
function readCodexCatalogCursor(homeId, params) {
	const queryId = sha256Hex(JSON.stringify([
		homeId,
		params.cwd?.trim() ?? "",
		params.searchTerm?.trim().toLocaleLowerCase() ?? ""
	])).slice(0, 16);
	const encoded = readControlCursor(params.cursor, "request");
	if (!encoded) return {
		kind: "resident",
		queryId
	};
	const invalid = () => new CatalogParamsError("invalid Codex resident catalog cursor");
	let value;
	try {
		value = JSON.parse(Buffer.from(encoded, "base64url").toString());
	} catch {
		throw invalid();
	}
	if (!Array.isArray(value) || value.length !== 5 || value[0] !== queryId) throw invalid();
	if (value[1] === "native") {
		if (value[2] !== null && typeof value[2] !== "string" || typeof value[3] !== "boolean" || value[4] !== null && (typeof value[4] !== "string" || !value[4] || value[4].length > 256)) throw invalid();
		return {
			kind: "native",
			queryId,
			backwards: value[3],
			...value[2] !== null ? { cursor: readControlCursor(value[2], "native request") } : {},
			...value[4] !== null ? { anchorThreadId: value[4] } : {}
		};
	}
	if (typeof value[1] !== "number" || !Number.isFinite(value[1]) || typeof value[2] !== "string" || value[2].length > 256 || typeof value[3] !== "number" || !Number.isSafeInteger(value[3]) || typeof value[4] !== "boolean") throw invalid();
	return {
		kind: "resident",
		queryId,
		anchor: {
			updatedAt: value[1],
			recencyAt: value[1],
			threadId: value[2],
			sourceOrder: value[3],
			backwards: value[4]
		}
	};
}
function encodeCodexResidentCursor(queryId, row, backwards) {
	return Buffer.from(JSON.stringify([
		queryId,
		codexCatalogRowRecency(row),
		row.threadId,
		row.sourceOrder ?? 0,
		backwards
	])).toString("base64url");
}
function encodeCodexNativeCursor(cursor) {
	const value = Buffer.from(JSON.stringify([
		cursor.queryId,
		"native",
		cursor.cursor ?? null,
		cursor.backwards,
		cursor.anchorThreadId ?? null
	])).toString("base64url");
	readControlCursor(value, "native continuation");
	return value;
}
// extensions/codex/src/session-catalog-index-events.ts
/** Coalesces metadata refreshes while the index owns row publication. */
var CodexCatalogIndexEvents = class {
	constructor(owner) {
		this.owner = owner;
		this.closed = false;
		this.pending = /* @__PURE__ */ new Map();
		this.upserting = /* @__PURE__ */ new Set();
	}
	hasActiveWork() {
		return this.pending.size > 0 || this.upserting.size > 0;
	}
	handle(event, readThread, source) {
		if (this.closed || !isRecord(event.params)) return;
		const params = event.params;
		if (event.method === "thread/started") {
			if (!isRecord(params.thread) || typeof params.thread.id !== "string") return;
			const thread = params.thread;
			if (!thread.ephemeral && !thread.preview?.trim() && thread.recencyAt == null) return;
			if (!this.hasCapacity()) return;
			const operation = this.owner.upsert(setCodexCatalogSource(thread, source)).catch((error) => this.owner.report(error)).finally(() => this.upserting.delete(operation));
			this.upserting.add(operation);
			return;
		}
		const id = boundedCatalogString(params.threadId, 256);
		if (!id) return;
		if (event.method === "thread/archived" || event.method === "thread/deleted") {
			const pending = this.pending.get(id);
			if (pending) {
				pending.dirty = false;
				pending.sourceOrder = void 0;
			}
			if (event.method === "thread/deleted") this.owner.remove(id);
			else this.owner.archive(id);
			return;
		}
		if (event.method === "thread/name/updated") {
			this.owner.rename(id, codexCatalogThreadName(params.threadName ?? null) ?? null);
			return;
		}
		if (event.method === "thread/status/changed") {
			if (!isRecord(params.status)) return;
			this.owner.updateStatus(id, codexCatalogThreadStatus(params.status), source);
			return;
		}
		if (event.method === "thread/settings/updated") {
			const settings = params.threadSettings;
			if (isRecord(settings)) this.owner.updateSettings(id, {
				...typeof settings.cwd === "string" ? { cwd: settings.cwd } : {},
				...typeof settings.modelProvider === "string" ? { modelProvider: settings.modelProvider } : {}
			}, source);
			return;
		}
		if (event.method === "turn/started" || event.method === "turn/completed" || event.method === "thread/unarchived" || event.method === "thread/reverted") {
			if (event.method !== "thread/unarchived" && this.owner.get(id)?.archived) return;
			this.enqueueRefresh(id, readThread, event.method === "turn/started" ? this.owner.reserveTurnStartOrder() : void 0);
		}
	}
	hasCapacity() {
		if (this.pending.size + this.upserting.size < 2e4) return true;
		this.owner.report(/* @__PURE__ */ new Error("Codex catalog event queue reached its resident row limit"));
		return false;
	}
	enqueueRefresh(id, readThread, sourceOrder) {
		this.owner.requestNativeRefresh();
		const existing = this.pending.get(id);
		if (existing) {
			existing.readThread = readThread;
			existing.dirty = true;
			existing.sourceOrder = sourceOrder ?? existing.sourceOrder;
			return;
		}
		if (!this.hasCapacity()) return;
		const pending = {
			readThread,
			dirty: true,
			sourceOrder,
			promise: Promise.resolve()
		};
		this.pending.set(id, pending);
		pending.promise = Promise.resolve().then(async () => {
			try {
				while (!this.closed && pending.dirty) {
					pending.dirty = false;
					const observedSourceOrder = pending.sourceOrder;
					try {
						await this.owner.refresh(id, pending.readThread, observedSourceOrder);
						if (pending.sourceOrder === observedSourceOrder) pending.sourceOrder = void 0;
					} catch (error) {
						this.owner.report(error);
					}
				}
			} finally {
				this.pending.delete(id);
			}
		});
	}
	async close() {
		this.closed = true;
		await Promise.allSettled([...this.upserting, ...[...this.pending.values()].map((entry) => entry.promise)]);
	}
};
// extensions/codex/src/session-catalog-index-field.ts
/** Bounded display observations; later publications replace earlier ones. */
var CodexCatalogField = class {
	constructor() {
		this.entries = /* @__PURE__ */ new Map();
	}
	update(threadId, value) {
		this.entries.delete(threadId);
		this.entries.set(threadId, value);
		if (this.entries.size > 2e4) this.entries.delete(this.entries.keys().next().value);
	}
	get(threadId) {
		return this.entries.get(threadId);
	}
	some(predicate) {
		for (const entry of this.entries.values()) if (predicate(entry)) return true;
		return false;
	}
	delete(threadId) {
		this.entries.delete(threadId);
	}
	deleteWhere(predicate) {
		for (const [threadId, entry] of this.entries) if (predicate(entry)) this.delete(threadId);
	}
	invalidate() {
		this.entries.clear();
	}
};
/** Live field values retain source-lifetime invalidation. */
var CodexCatalogLiveField = class {
	constructor() {
		this.values = new CodexCatalogField();
	}
	get(threadId) {
		const current = this.values.get(threadId);
		return current && !current.source.closed ? current.value : void 0;
	}
	delete(threadId) {
		this.values.delete(threadId);
	}
	invalidate(source) {
		if (!source) {
			this.values.invalidate();
			return;
		}
		this.values.deleteWhere((entry) => entry.source === source);
	}
};
// extensions/codex/src/session-catalog-rollout-scanner.ts
const DIRECTORY_PARTS = [
	/^\d{4}$/,
	/^(?:0[1-9]|1[0-2])$/,
	/^(?:0[1-9]|[12]\d|3[01])$/
];
const ROLLOUT_FILE_NAME = /\.jsonl(?:\.zst)?$/;
const MAX_WATCHED_DIRECTORIES = 256;
const SCAN_BATCH_SIZE = 64;
const DARWIN_WATCH_ARM_MS = 250;
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
		if (extractErrorCode(error) === "ENOENT") return;
		throw error;
	}
}
function sameDirectory(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.ctimeMs === right.ctimeMs && left.mtimeMs === right.mtimeMs;
}
/** The resident home owns a bounded watcher cache; unwatchable leaves are scanned in full. */
var CodexCatalogRolloutScanner = class {
	constructor(sessionsRoot) {
		this.sessionsRoot = sessionsRoot;
		this.directories = /* @__PURE__ */ new Map();
		this.cachedFiles = 0;
		this.closed = false;
	}
	async scan(trackedPaths) {
		await setImmediate$1();
		try {
			return await this.walk(trackedPaths);
		} catch (error) {
			for (const cached of this.directories.values()) cached.dirty = true;
			throw error;
		}
	}
	forget(directory) {
		const cached = this.directories.get(directory);
		if (cached) {
			this.cachedFiles -= cached.files.size;
			this.directories.delete(directory);
			cached.watcher.close();
		}
	}
	watch(directory, stat) {
		if (this.closed || directory.length > 4096 || this.directories.size >= MAX_WATCHED_DIRECTORIES) return;
		try {
			const watcher = fs.watch(directory, { persistent: false });
			const cached = {
				watcher,
				stat,
				dirty: true,
				armAt: process.platform === "darwin" ? performance.now() + DARWIN_WATCH_ARM_MS : 0,
				files: /* @__PURE__ */ new Map()
			};
			watcher.on("change", () => {
				cached.dirty = true;
			});
			const withdraw = () => {
				if (this.directories.get(directory) === cached) this.forget(directory);
			};
			watcher.on("error", withdraw);
			watcher.on("close", withdraw);
			this.directories.set(directory, cached);
			return cached;
		} catch {
			return;
		}
	}
	async walk(trackedPaths) {
		if (this.closed) throw new Error("Codex catalog rollout scanner is closed");
		const present = /* @__PURE__ */ new Set();
		const unvisited = new Set(this.directories.keys());
		const candidates = new NewestRolloutCandidates();
		let processed = 0;
		const offer = (file, fingerprint) => {
			if (trackedPaths.has(codexCatalogRolloutLogicalPath(file))) present.add(codexCatalogRolloutLogicalPath(file));
			candidates.offer([file, fingerprint]);
		};
		const scan = async (directory, depth, rootReal) => {
			if (this.closed) throw new Error("Codex catalog rollout scanner is closed");
			if (await unlessMissing(fs$1.realpath(directory)) !== directory) return;
			const directoryPattern = DIRECTORY_PARTS[depth];
			const stat = !directoryPattern ? await unlessMissing(fs$1.lstat(directory)) : void 0;
			let cached = this.directories.get(directory);
			if (!directoryPattern) {
				if (!stat?.isDirectory() || stat.isSymbolicLink()) return;
				unvisited.delete(directory);
				if (cached && !sameDirectory(cached.stat, stat)) {
					this.forget(directory);
					cached = void 0;
				}
				if (cached && !cached.dirty) {
					for (const [file, fingerprint] of cached.files) {
						offer(file, fingerprint);
						if (++processed % SCAN_BATCH_SIZE === 0) await setImmediate$1();
					}
					return;
				}
				cached ??= this.watch(directory, stat);
			}
			if (cached) cached.dirty = performance.now() < cached.armAt;
			const retained = cached ? /* @__PURE__ */ new Map() : void 0;
			let cacheable = true;
			const entries = await unlessMissing(fs$1.opendir(directory));
			if (!entries) {
				this.forget(directory);
				return;
			}
			for await (const entry of entries) {
				if (this.closed) throw new Error("Codex catalog rollout scanner is closed");
				if (++processed % SCAN_BATCH_SIZE === 0) await setImmediate$1();
				const file = path.join(directory, entry.name);
				if (directoryPattern) {
					if (entry.isDirectory() && directoryPattern.test(entry.name)) await scan(file, depth + 1, rootReal);
				} else if (entry.isFile() && ROLLOUT_FILE_NAME.test(entry.name)) {
					const fileStat = await unlessMissing(fs$1.lstat(file));
					if (!fileStat?.isFile() || fileStat.nlink !== 1) continue;
					const physicalPath = path.join(this.sessionsRoot, path.relative(rootReal, file));
					if (physicalPath.length > 4096) continue;
					if (physicalPath !== codexCatalogRolloutLogicalPath(physicalPath)) {
						const plain = await unlessMissing(fs$1.lstat(codexCatalogRolloutLogicalPath(file)));
						if (plain?.isFile() && plain.nlink === 1) continue;
					}
					const fingerprint = {
						mtimeMs: fileStat.mtimeMs,
						size: fileStat.size
					};
					const detached = detachCodexCatalogString(physicalPath);
					offer(detached, fingerprint);
					if (retained && cacheable) {
						retained.set(detached, fingerprint);
						if (this.cachedFiles - (cached?.files.size ?? 0) + retained.size > 2e4) {
							cacheable = false;
							retained.clear();
						}
					}
				}
			}
			if (cached && retained && stat) {
				if (cacheable && !this.closed && this.directories.get(directory) === cached) {
					this.cachedFiles += retained.size - cached.files.size;
					cached.files = retained;
					cached.stat = stat;
				} else this.forget(directory);
			}
		};
		const rootStat = await unlessMissing(fs$1.lstat(this.sessionsRoot));
		if (rootStat?.isDirectory() && !rootStat.isSymbolicLink()) {
			const rootReal = await unlessMissing(fs$1.realpath(this.sessionsRoot));
			if (rootReal) await scan(rootReal, 0, rootReal);
		}
		for (const directory of unvisited) this.forget(directory);
		return {
			files: candidates.finish(),
			present
		};
	}
	close() {
		this.closed = true;
		for (const directory of this.directories.keys()) this.forget(directory);
	}
};
// extensions/codex/src/session-catalog-index-files.ts
/** Plan file reconciliation; the index retains every publication and lifetime decision. */
async function reconcileCodexCatalogFiles(root, owner) {
	const byPath = /* @__PURE__ */ new Map();
	let processed = 0;
	for (const row of owner.rows.values()) {
		if (row.rolloutPath) byPath.set(codexCatalogRolloutLogicalPath(row.rolloutPath), row);
		if (++processed % 128 === 0) {
			await setImmediate$1();
			owner.assertCurrent();
		}
	}
	const { files, present } = await owner.scanner.scan(byPath);
	owner.assertCurrent();
	for (const [file, fingerprint] of files) {
		if (++processed % 128 === 0) {
			await setImmediate$1();
			owner.assertCurrent();
		}
		const known = owner.observedFiles.get(file) ?? byPath.get(codexCatalogRolloutLogicalPath(file))?.fingerprint;
		if (known?.mtimeMs === fingerprint.mtimeMs && known.size === fingerprint.size) continue;
		owner.requestNativeRefresh();
		let thread;
		try {
			thread = await readCodexCatalogRollout(root, file);
		} catch (error) {
			owner.assertCurrent();
			if (known) files.set(file, known);
			else files.delete(file);
			owner.report(error);
			continue;
		}
		owner.assertCurrent();
		if (!thread) continue;
		const existing = owner.rows.get(thread.id);
		if (existing?.rolloutPath && codexCatalogRolloutLogicalPath(existing.rolloutPath) !== codexCatalogRolloutLogicalPath(file)) continue;
		if (!existing && !thread.preview) continue;
		thread.preview ||= existing?.preview;
		const projected = await projectCodexCatalogPage({ data: [projectCodexCatalogNativeThread(thread, sanitizeTerminalText)] }, { localSessionsRoot: root });
		owner.assertCurrent();
		const row = projected.rows[0];
		if (!row) continue;
		owner.put(mergeCodexCatalogRolloutRow(row, existing, fingerprint));
		await setImmediate$1();
	}
	for (const [logicalPath, row] of byPath) {
		if (++processed % 128 === 0) {
			await setImmediate$1();
			owner.assertCurrent();
		}
		if (row.rolloutPath && !present.has(logicalPath) && isCodexCatalogRolloutPathCovered(root, row.rolloutPath) && owner.rows.get(row.threadId) === row) {
			owner.requestNativeRefresh();
			owner.remove(row.threadId);
		}
	}
	return files;
}
// extensions/codex/src/session-catalog-index-names.ts
function applyCodexCatalogName(row, name) {
	if (name === void 0) return row;
	return {
		...row,
		page: { sessions: row.page.sessions.map(({ fallbackName: _fallback, ...session }) => ({
			...session,
			name,
			...!name && row.preview ? { fallbackName: row.preview } : {}
		})) }
	};
}
// extensions/codex/src/session-catalog-status.ts
function applyCodexCatalogLiveFields({ status: _storedStatus, activeFlags: _storedFlags, ...session }, live, settings) {
	return {
		...session,
		...settings,
		status: session.catalogError ? "systemError" : live?.status ?? "notLoaded",
		...live?.activeFlags ? { activeFlags: [...live.activeFlags] } : {}
	};
}
/** One latest display observation; native actions verify their own current state. */
var CodexCatalogStatusIndex = class extends CodexCatalogLiveField {
	update(threadId, status, source) {
		if (source.closed) return;
		const current = this.values.get(threadId);
		if (status.status === "notLoaded" && current && !current.source.closed && current.source !== source) return;
		this.values.update(threadId, {
			value: status,
			source
		});
	}
	observe(row) {
		const session = row.page.sessions[0];
		const source = getCodexCatalogSource(row);
		if (session && source) this.update(row.threadId, {
			status: session.status,
			...session.activeFlags ? { activeFlags: session.activeFlags } : {}
		}, source);
	}
};
// extensions/codex/src/session-catalog-index-query.ts
/** Keyset pagination remains valid when the anchor row is archived or deleted. */
function prepareCodexCatalogQuery(params, prepared) {
	const limit = Math.min(normalizeLimit(params.limit, "limit"), 64);
	const cwd = params.cwd?.trim();
	const search = params.searchTerm?.trim().toLocaleLowerCase().normalize("NFC");
	const { queryId, anchor } = prepared;
	const cursor = (row, backwards) => encodeCodexResidentCursor(queryId, row, backwards);
	return (ordered, liveStatus, liveSettings, availability) => {
		const { complete, frontier } = availability;
		if (!complete && !frontier) return;
		if (!complete && frontier && anchor?.backwards && compareCodexCatalogRows(frontier, anchor) < 0) return;
		function* candidates() {
			for (const { row, searchText } of ordered) {
				if (!complete && frontier && compareCodexCatalogRows(row, frontier) > 0) break;
				if ((!cwd || (liveSettings.get(row.threadId)?.cwd ?? row.page.sessions[0].cwd) === cwd) && (!search || searchText.includes(search))) yield row;
			}
		}
		let hasPrevious = false;
		const page = [];
		let continuation;
		const after = (row) => !anchor || compareCodexCatalogRows(row, anchor) > 0;
		for (const row of candidates()) {
			if (anchor?.backwards) {
				if (row.threadId === anchor.threadId) continue;
				if (after(row)) break;
				if (page.length === limit) {
					page.shift();
					hasPrevious = true;
				}
			} else if (!after(row)) {
				hasPrevious = true;
				continue;
			} else if (page.length === limit) {
				continuation = page.at(-1);
				break;
			}
			page.push(row);
		}
		if (anchor?.backwards && !page.length) {
			hasPrevious = false;
			for (const row of candidates()) {
				page.push(row);
				if (page.length === limit) break;
			}
		}
		const first = page[0];
		const last = page.at(-1);
		if (anchor?.backwards && last) {
			for (const row of candidates()) if (!complete || compareCodexCatalogRows(row, last) > 0) {
				continuation = last;
				break;
			}
		}
		if (!complete && !continuation) {
			if (!anchor?.backwards && !last && (!frontier || !after(frontier))) return;
			continuation = frontier && (!last || compareCodexCatalogRows(frontier, last) > 0) ? frontier : last;
		}
		return {
			sessions: page.map((row) => applyCodexCatalogLiveFields(row.page.sessions[0], liveStatus.get(row.threadId), liveSettings.get(row.threadId))),
			...continuation ? { nextCursor: cursor(continuation, false) } : {},
			...first && hasPrevious ? { backwardsCursor: cursor(first, true) } : {}
		};
	};
}
// extensions/codex/src/session-catalog-index-row.ts
/** Equal previews share detached text only while resident rows reference it. */
var CodexCatalogPreviews = class {
	constructor() {
		this.values = /* @__PURE__ */ new Map();
	}
	retain(row, previous) {
		const preview = row.preview;
		if (previous?.preview !== preview) this.release(previous?.preview);
		if (preview === void 0) return;
		let shared = this.values.get(preview);
		if (!shared) {
			shared = {
				value: preview,
				references: 0
			};
			this.values.set(preview, shared);
		}
		if (previous?.preview !== preview) shared.references++;
		row.preview = shared.value;
		for (const session of row.page.sessions) if (session.fallbackName === preview) session.fallbackName = shared.value;
	}
	release(preview) {
		if (preview === void 0) return;
		const shared = this.values.get(preview);
		if (--shared.references === 0) this.values.delete(preview);
	}
	clear() {
		this.values.clear();
	}
};
// extensions/codex/src/session-catalog-native-page.ts
const NATIVE_PAGE_SIZE = 16;
/** Background walks share bounded native pages; the index decides when a prefix is current. */
async function* readCodexCatalogHydrationPages(read, useStateDbOnly) {
	let cursor;
	let offset = 0;
	const cursors = /* @__PURE__ */ new Set();
	do {
		const page = await read({
			archived: false,
			modelProviders: [],
			sortKey: "recency_at",
			sortDirection: "desc",
			limit: NATIVE_PAGE_SIZE,
			...useStateDbOnly ? { useStateDbOnly } : {},
			...cursor ? { cursor } : {}
		}, Math.max(0, CODEX_CATALOG_MAX_ROWS - offset));
		cursor = readControlCursor(page.nextCursor, "hydration response");
		if (cursor && cursors.has(cursor)) throw new Error("Codex catalog repeated a hydration cursor");
		if (cursor) rememberCodexCatalogCursor(cursors, cursor);
		yield {
			...page,
			nextCursor: cursor,
			offset
		};
		offset += page.rows.length;
		await setImmediate$1();
	} while (cursor);
}
/** The resident limit bounds storage, never authoritative discovery. */
var CodexCatalogNativePages = class {
	constructor(settings, status) {
		this.settings = settings;
		this.status = status;
	}
	async list(params, prepared, options, request) {
		const limit = Math.min(normalizeLimit(params.limit, "limit"), NATIVE_PAGE_SIZE);
		const cwd = params.cwd?.trim();
		let position = prepared.kind === "native" ? prepared : {
			kind: "native",
			queryId: prepared.queryId,
			backwards: prepared.anchor?.backwards ?? false,
			...prepared.anchor ? { anchorThreadId: prepared.anchor.threadId } : {}
		};
		const at = (cursor, backwards, anchorThreadId) => ({
			kind: "native",
			queryId: prepared.queryId,
			backwards,
			...cursor ? { cursor } : {},
			...anchorThreadId ? { anchorThreadId } : {}
		});
		while (request.hasPages) {
			options.assertCurrent();
			const filterCwdLocally = Boolean(cwd && this.settings.hasLiveCwd());
			const ascending = position.backwards && !position.anchorThreadId;
			const pageLimit = position.anchorThreadId ? NATIVE_PAGE_SIZE : limit;
			const page = await request.read(Number.POSITIVE_INFINITY, () => options.readNative({
				archived: false,
				modelProviders: [],
				useStateDbOnly: true,
				sortKey: "recency_at",
				sortDirection: ascending ? "asc" : "desc",
				limit: pageLimit,
				...cwd && !filterCwdLocally ? { cwd } : {},
				...position.cursor ? { cursor: position.cursor } : {}
			}, pageLimit, request));
			options.assertCurrent();
			for (const row of page.rows) this.status.observe(row);
			if (cwd && !filterCwdLocally && this.settings.hasLiveCwd()) continue;
			let rows = ascending ? page.rows.toReversed() : page.rows;
			let next = (ascending ? page.backwardsCursor : page.nextCursor) ? at(ascending ? page.backwardsCursor : page.nextCursor, false) : void 0;
			let previous = (ascending ? page.nextCursor : page.backwardsCursor) ? at(ascending ? page.nextCursor : page.backwardsCursor, true) : void 0;
			if (position.anchorThreadId) {
				const anchor = rows.findIndex((row) => row.threadId === position.anchorThreadId);
				if (anchor < 0) {
					if (!page.nextCursor || page.nextCursor === position.cursor) throw new CatalogParamsError("Codex catalog changed; refresh before continuing this page");
					position = at(page.nextCursor, position.backwards, position.anchorThreadId);
					continue;
				}
				const start = position.backwards ? Math.max(0, anchor - limit) : anchor + 1;
				const end = position.backwards ? anchor : Math.min(rows.length, start + limit);
				const selected = rows.slice(start, end);
				if (!selected.length) {
					const continuation = position.backwards ? previous : next;
					if (continuation) {
						position = continuation;
						continue;
					}
				}
				const first = selected[0];
				const last = selected.at(-1);
				if (first && last) {
					next = end < rows.length ? at(position.cursor, false, last.threadId) : next;
					previous = start > 0 ? at(position.cursor, true, first.threadId) : previous;
				}
				rows = selected;
			} else if (!position.cursor && !position.backwards) previous = void 0;
			const projected = filterCatalogPageByTitle({ sessions: rows.flatMap((row) => row.page.sessions).map((session) => applyCodexCatalogLiveFields(session, this.status.get(session.threadId), this.settings.get(session.threadId))).filter((session) => !cwd || session.cwd === cwd) }, params.searchTerm);
			const continuation = position.backwards ? previous : next;
			if ((params.searchTerm || filterCwdLocally) && !projected.sessions.length && continuation) {
				if (encodeCodexNativeCursor(continuation) === encodeCodexNativeCursor(position)) throw new CatalogParamsError("Codex catalog repeated a native continuation");
				position = continuation;
				continue;
			}
			const managedThreads = rows.flatMap((row) => row.page.managedThreads ?? []);
			return {
				...projected,
				...managedThreads.length ? { managedThreads } : {},
				...next ? { nextCursor: encodeCodexNativeCursor(next) } : {},
				...previous ? { backwardsCursor: encodeCodexNativeCursor(previous) } : {}
			};
		}
		const continuation = encodeCodexNativeCursor(position);
		return {
			sessions: [],
			...position.backwards ? { backwardsCursor: continuation } : { nextCursor: continuation }
		};
	}
};
// extensions/codex/src/session-catalog-settings.ts
/** Live settings overlay native stored metadata only while a supporting source stays open. */
var CodexCatalogSettingsIndex = class extends CodexCatalogLiveField {
	update(threadId, settings, source) {
		if (source.closed) return;
		const cwd = boundedCatalogString(settings.cwd, MAX_CWD_LENGTH);
		const modelProvider = boundedCatalogString(settings.modelProvider, 500, "truncate");
		if (!cwd && !modelProvider) return;
		const bounded = {
			...cwd ? { cwd } : {},
			...modelProvider ? { modelProvider } : {}
		};
		this.values.update(threadId, {
			value: bounded,
			source
		});
	}
	hasLiveCwd() {
		return this.values.some(({ value, source }) => Boolean(value.cwd) && !source.closed);
	}
	withdraw(threadId, source) {
		if (this.values.get(threadId)?.source === source) this.values.delete(threadId);
	}
};
// extensions/codex/src/session-catalog-index.ts
const SAFETY_INTERVAL_MS = 9e5;
/** One home owns resident queries and authoritative overflow discovery. */
var CodexCatalogIndex = class {
	constructor(options) {
		this.options = options;
		this.rows = /* @__PURE__ */ new Map();
		this.previews = new CodexCatalogPreviews();
		this.availability = new CodexCatalogAvailability();
		this.liveStatus = new CodexCatalogStatusIndex();
		this.liveSettings = new CodexCatalogSettingsIndex();
		this.nativePages = new CodexCatalogNativePages(this.liveSettings, this.liveStatus);
		this.names = new CodexCatalogField();
		this.initialized = false;
		this.overflow = false;
		this.needsNativeRefresh = false;
		this.restored = false;
		this.closed = false;
		this.nativeDirty = false;
		this.nextNativeAt = 0;
		this.nextFilesAt = 0;
		this.projections = new CodexCatalogProjections();
		this.observedFiles = /* @__PURE__ */ new Map();
		this.obsoleteStoredKeys = /* @__PURE__ */ new Set();
		this.ordering = new CodexCatalogOrdering();
		this.rolloutScanner = options.localSessionsRoot ? new CodexCatalogRolloutScanner(options.localSessionsRoot) : void 0;
		this.runBackground = options.runBackground ?? ((run) => run());
		this.persistence = new CodexCatalogPersistence(options.state, (error) => this.report(error));
		this.events = new CodexCatalogIndexEvents({
			get: (id) => this.rows.get(id),
			updateStatus: (id, status, source) => {
				this.liveStatus.update(id, status, source);
				if (status.status === "notLoaded") this.liveSettings.withdraw(id, source);
			},
			updateSettings: (id, settings, source) => this.liveSettings.update(id, settings, source),
			rename: (id, name) => {
				this.nativeDirty = true;
				this.names.update(id, name);
				const row = this.rows.get(id);
				if (row && !this.closed) this.put(row);
			},
			upsert: (thread) => this.upsertThread(thread),
			reserveTurnStartOrder: () => this.ordering.reserveEvent(),
			requestNativeRefresh: () => this.nativeDirty = true,
			refresh: (id, readThread, sourceOrder) => this.refreshThread(id, readThread, sourceOrder),
			archive: (id) => this.archive(id),
			remove: (id) => {
				this.nativeDirty = true;
				this.remove(id);
			},
			report: (error) => this.report(error)
		});
		this.unsubscribe = subscribeCodexCatalogEvents(options.homeId, (event, readThread, source) => this.events.handle(event, readThread, source), {
			onEphemeralThread: (id) => this.remove(id),
			onClose: (source) => {
				this.liveStatus.invalidate(source);
				this.liveSettings.invalidate(source);
			},
			onResume: (response, source) => {
				this.liveSettings.update(response.thread.id, response, source);
				return this.upsertThread(setCodexCatalogSource(response.thread, source));
			},
			onRemoteReady: () => {
				if (this.closed || options.localSessionsRoot) return;
				if (!this.initializing) {
					this.initialized = false;
					this.scheduleHydration();
				}
			}
		});
	}
	assertCurrent() {
		if (this.closed) throw new Error("Codex resident catalog is closed");
		try {
			this.options.assertCurrent();
		} catch (error) {
			this.close();
			throw error;
		}
	}
	report(error) {
		const overflow = CodexCatalogResponseTooLargeError.fromError(error);
		if (overflow && overflow === this.reportedOverflow) return;
		this.reportedOverflow = overflow;
		if (!this.closed && !this.stopForTerminalFailure(error)) embeddedAgentLog.warn("Codex resident catalog background update failed", { error });
	}
	withName(row) {
		const known = this.names.get(row.threadId);
		return applyCodexCatalogName(row, known !== void 0 ? known : this.rows.get(row.threadId)?.page.sessions[0]?.name);
	}
	put(candidate) {
		if (this.closed) return;
		const previous = this.rows.get(candidate.threadId);
		const preview = candidate.preview ?? previous?.preview;
		const patched = this.withName({
			...candidate,
			...preview !== void 0 ? { preview } : {}
		});
		const row = {
			...patched,
			page: codexCatalogMetadataPage(patched.page),
			...patched.rolloutPath ? { rolloutPath: codexCatalogRolloutLogicalPath(patched.rolloutPath) } : {},
			sourceOrder: this.ordering.position(patched, previous)
		};
		if (isDeepStrictEqual(previous, row)) return;
		this.previews.retain(row, previous);
		const oldest = retainCodexCatalogRow(this.rows, row);
		this.overflow ||= this.rows.size >= CODEX_CATALOG_MAX_ROWS;
		if (oldest?.threadId === row.threadId) {
			this.previews.release(row.preview);
			return;
		}
		if (oldest) this.evict(oldest.threadId, oldest);
		this.ordering.put(row, previous);
		this.persistence.put(row);
	}
	evict(threadId, row = this.rows.get(threadId)) {
		this.rows.delete(threadId);
		if (row) {
			this.previews.release(row.preview);
			this.ordering.remove(row);
		}
		this.persistence.remove(threadId);
	}
	remove(threadId) {
		this.evict(threadId);
		this.liveStatus.delete(threadId);
		this.liveSettings.delete(threadId);
		this.names.delete(threadId);
	}
	async initialize() {
		this.assertCurrent();
		if (this.terminalFailure) throw this.terminalFailure;
		clearImmediate(this.hydration);
		this.hydration = void 0;
		if (this.initialized && !this.needsNativeRefresh) return;
		if (!this.initializing) {
			this.availability.begin();
			this.initializing = (async () => {
				await this.restore();
				await this.persistence.pruneObsolete(this.obsoleteStoredKeys, this.rows.values());
				this.obsoleteStoredKeys.clear();
				await this.reconcilingNative?.catch((error) => this.report(error));
				if (!this.initialized) await this.hydrate(this.availability.complete);
				else if (this.needsNativeRefresh) {
					await this.reconcile();
					await this.reconcileNative();
				}
				this.needsNativeRefresh = false;
				this.initialized = true;
				this.startCurrency();
			})().catch((error) => {
				this.availability.fail(error);
				this.stopForTerminalFailure(error);
				throw error;
			}).finally(() => {
				this.initializing = void 0;
			});
		}
		return this.initializing;
	}
	async restore() {
		if (this.restored) return;
		this.restoring ??= (async () => {
			try {
				const snapshot = await this.persistence.readSnapshot();
				this.assertCurrent();
				if (snapshot.cleanupIncomplete) this.persistence.invalidate(/* @__PURE__ */ new Error("Codex catalog obsolete snapshot exceeds its cleanup limit"));
				for (const key of snapshot.obsolete) this.obsoleteStoredKeys.add(key);
				let restoredRows = 0;
				for (const row of snapshot.rows) {
					if (++restoredRows % 128 === 0) {
						await setImmediate$1();
						this.assertCurrent();
					}
					const restored = row.rolloutPath ? {
						...row,
						rolloutPath: codexCatalogRolloutLogicalPath(row.rolloutPath)
					} : row;
					const patched = this.withName(restored);
					if (patched !== restored) this.persistence.put(patched);
					const previous = this.rows.get(patched.threadId);
					this.previews.retain(patched, previous);
					const evicted = retainCodexCatalogRow(this.rows, patched);
					if (evicted) this.evict(evicted.threadId, evicted);
					if (evicted !== patched) this.ordering.put(patched, previous);
					this.ordering.restore(row);
				}
				this.overflow ||= snapshot.overflow || this.rows.size >= 2e4;
				if (snapshot.complete) {
					this.availability.publish(void 0, true);
					this.initialized = true;
					this.needsNativeRefresh = true;
					this.startCurrency();
				}
			} catch (error) {
				this.persistence.invalidate(error);
			}
			this.restored = true;
		})();
		await this.restoring;
	}
	scheduleHydration() {
		if (this.initialized && !this.needsNativeRefresh || this.initializing || this.closed) return;
		if (this.terminalFailure || this.hydration) return;
		this.hydration = setImmediate(() => {
			this.hydration = void 0;
			this.runBackground(() => this.initialize()).catch((error) => this.report(error));
		});
		this.hydration.unref();
	}
	stopForTerminalFailure(error) {
		const failure = findCodexAppServerSpawnError(error);
		if (!failure) return false;
		if (!this.closed && !this.terminalFailure) {
			this.terminalFailure = failure;
			this.stopCurrency();
			reportCodexCatalogSpawnFailure(failure);
		}
		return true;
	}
	/** Full safety walks serve catalog demand; an idle resident index does not start one. */
	refreshNativeIfDue() {
		if (!this.currencyTimer || Date.now() < this.nextNativeAt || this.safetyRefresh) return;
		const refresh = async () => {
			if (this.currencyWork) await this.currencyWork;
			if (this.closed || this.terminalFailure || Date.now() < this.nextNativeAt) return;
			const run = () => this.reconcileNative(true);
			await Promise.resolve().then(() => this.runBackground(run)).catch((error) => {
				this.report(new Error(`Codex catalog reconciliation failed; waiting for the next safety interval and catalog demand: ${coerceErrorMessage(error)}`, { cause: error }));
			});
			this.nextNativeAt = Date.now() + SAFETY_INTERVAL_MS;
		};
		this.safetyRefresh = refresh().finally(() => {
			this.safetyRefresh = void 0;
		});
	}
	startCurrency() {
		if (this.closed || this.terminalFailure || this.currencyTimer) return;
		this.nextNativeAt = Date.now() + SAFETY_INTERVAL_MS;
		this.nextFilesAt = this.nextNativeAt;
		this.currencyTimer = setInterval(() => {
			if (this.currencyWork) return;
			const startedAt = Date.now();
			const filesDue = this.rolloutScanner !== void 0 && startedAt >= this.nextFilesAt;
			const nativeDue = this.nativeDirty && !this.safetyRefresh;
			if (!filesDue && !nativeDue) return;
			if (nativeDue) this.nativeDirty = false;
			if (filesDue) this.nextFilesAt = startedAt + SAFETY_INTERVAL_MS;
			const run = async () => {
				if (filesDue) await this.reconcile();
				if (nativeDue) await this.reconcileNative(false);
			};
			this.currencyWork = this.runBackground(run).catch((error) => {
				this.report(new Error(`Codex catalog reconciliation failed; waiting for new activity or the next file safety cycle: ${coerceErrorMessage(error)}`, { cause: error }));
			}).finally(() => {
				this.currencyWork = void 0;
			});
		}, 3e4);
		this.currencyTimer.unref();
		if (this.rolloutScanner) {
			this.initialScan = setTimeout(() => {
				this.initialScan = void 0;
				this.reconcile().catch((error) => this.report(error));
			}, 0);
			this.initialScan.unref();
		}
	}
	stopCurrency() {
		clearImmediate(this.hydration);
		this.hydration = void 0;
		clearInterval(this.currencyTimer);
		this.currencyTimer = void 0;
		clearTimeout(this.initialScan);
		this.initialScan = void 0;
	}
	observeFields(row) {
		const session = row.page.sessions[0];
		if (!session) return;
		this.liveStatus.observe(row);
		if (session.name !== void 0) {
			this.names.update(row.threadId, session.name);
			const current = this.rows.get(row.threadId);
			if (current && current.page.sessions[0]?.name !== session.name) this.put(current);
		}
	}
	reconcileNative(full = true) {
		if (!this.options.localSessionsRoot && this.initializing && !this.initialized) return this.initializing;
		if (!this.reconcilingNative) this.reconcilingNative = this.hydrate(true, !full).finally(() => {
			this.reconcilingNative = void 0;
		});
		return this.reconcilingNative;
	}
	hydrate(useStateDbOnly = false, incremental = false) {
		const run = () => this.hydratePages(useStateDbOnly, incremental);
		return this.options.runNativeWalk?.(run) ?? run();
	}
	async hydratePages(useStateDbOnly, incremental) {
		this.assertCurrent();
		const files = this.rolloutScanner && !useStateDbOnly ? (await this.rolloutScanner.scan(/* @__PURE__ */ new Set())).files : /* @__PURE__ */ new Map();
		this.assertCurrent();
		let frontier;
		const batchOrder = this.ordering.captureBatch(this.availability.complete);
		const remaining = !incremental && (!useStateDbOnly || !this.options.localSessionsRoot) ? new Map(this.rows) : void 0;
		const pages = readCodexCatalogHydrationPages(async (params, remainingRows) => {
			this.assertCurrent();
			return await this.options.readNative(params, remainingRows);
		}, useStateDbOnly);
		for await (const page of pages) {
			this.assertCurrent();
			let sourceOrder = page.offset;
			let changed = false;
			for (const id of page.excludedThreadIds ?? []) {
				changed ||= this.rows.has(id);
				this.remove(id);
			}
			for (const row of page.rows) {
				const position = sourceOrder++;
				if (position >= 2e4) continue;
				remaining?.delete(row.threadId);
				const previous = this.rows.get(row.threadId);
				this.observeFields(row);
				const fingerprint = resolveCodexCatalogRolloutFingerprint(row.rolloutPath, useStateDbOnly ? previous : void 0, files);
				this.put({
					...row,
					sourceOrder: batchOrder(row, previous, position),
					...fingerprint ? { fingerprint } : {}
				});
				changed ||= this.rows.get(row.threadId) !== previous;
				frontier = this.rows.get(row.threadId) ?? frontier;
			}
			if (incremental && (!changed && page.rows.length > 0 || sourceOrder >= 2e4)) break;
			if (page.nextCursor) {
				this.availability.publish(frontier);
				await setImmediate$1();
				this.assertCurrent();
			}
		}
		remaining?.forEach((row, id) => {
			if (this.rows.get(id) === row) this.remove(id);
		});
		this.availability.publish(frontier, true);
		await this.persistence.finishHydration(this.overflow);
	}
	reconcile() {
		if (!this.reconciling) this.reconciling = this.reconcileFiles().finally(() => {
			this.reconciling = void 0;
		});
		return this.reconciling;
	}
	async reconcileFiles() {
		const root = this.options.localSessionsRoot;
		if (!root || !this.rolloutScanner || !this.initialized || this.closed) return;
		this.assertCurrent();
		this.observedFiles = await reconcileCodexCatalogFiles(root, {
			rows: this.rows,
			observedFiles: this.observedFiles,
			scanner: this.rolloutScanner,
			assertCurrent: () => this.assertCurrent(),
			requestNativeRefresh: () => this.nativeDirty = true,
			report: (error) => this.report(error),
			put: (row) => this.put(row),
			remove: (id) => this.remove(id)
		});
	}
	async upsertThread(thread) {
		try {
			this.assertCurrent();
		} catch {
			return;
		}
		this.nativeDirty = true;
		const prepared = projectCodexCatalogNativeThread(thread, sanitizeTerminalText);
		try {
			await this.projections.run(() => this.projectThread(prepared));
		} catch (error) {
			if (!(error instanceof CodexCatalogProjectionCapacityError)) throw error;
			this.report(error);
		}
	}
	refreshThread(id, readThread, sourceOrder) {
		this.assertCurrent();
		return this.projections.run(async () => {
			const thread = await readThread(id);
			const prepared = projectCodexCatalogNativeThread(thread, sanitizeTerminalText);
			if (prepared.id !== id) throw new Error("Codex catalog refresh returned a different thread");
			if (!this.closed) await this.projectThread(prepared, sourceOrder);
		});
	}
	async projectThread(thread, sourceOrder) {
		const projected = await projectCodexCatalogPage({ data: [thread] }, { localSessionsRoot: this.options.localSessionsRoot });
		if (this.closed) return;
		const row = projected.rows[0];
		if (row) this.observeFields(row);
		if (projected.excludedThreadIds?.includes(thread.id)) this.remove(thread.id);
		if (row) {
			const previous = this.rows.get(thread.id);
			const fingerprint = resolveCodexCatalogRolloutFingerprint(row.rolloutPath, previous);
			this.put({
				...row,
				...sourceOrder !== void 0 ? { sourceOrder } : {},
				...fingerprint ? { fingerprint } : {}
			});
		}
	}
	archive(threadId) {
		if (this.closed) return;
		this.nativeDirty = true;
		this.liveStatus.delete(threadId);
		this.liveSettings.delete(threadId);
		this.names.delete(threadId);
		const row = this.rows.get(threadId);
		if (row) this.put({
			...row,
			archived: true
		});
		else this.persistence.remove(threadId);
	}
	get(threadId) {
		return this.rows.get(threadId);
	}
	hasActiveWork() {
		return Boolean(this.initializing || !this.restored && this.restoring || this.reconciling || this.reconcilingNative || this.projections.hasActiveWork() || this.hydration !== void 0 || this.initialScan !== void 0 || this.currencyWork !== void 0 || this.safetyRefresh !== void 0 || this.events.hasActiveWork() || this.persistence.hasActiveWork());
	}
	async list(params, deadline = performance.now() + (this.options.requestTimeoutMs ?? 6e4)) {
		return await withCodexCatalogListRequest(async (request) => {
			const expiresAt = request.constrainDeadline(deadline);
			const cursor = readCodexCatalogCursor(this.options.homeId, params);
			const query = cursor.kind === "resident" ? prepareCodexCatalogQuery(params, cursor) : void 0;
			await this.availability.until(this.restore(), expiresAt);
			this.assertCurrent();
			this.scheduleHydration();
			for (;;) {
				this.assertCurrent();
				const ordered = this.ordering.read();
				const page = query?.(ordered, this.liveStatus, this.liveSettings, this.availability);
				if (cursor.kind === "native" || this.overflow && (params.cwd || params.searchTerm || page && !page.nextCursor)) return await this.nativePages.list(params, cursor, this.options, request);
				if (page) {
					this.refreshNativeIfDue();
					return page;
				}
				await this.availability.next(expiresAt);
			}
		});
	}
	/** Fence future publications before a replacement opens the same persisted home. */
	retire() {
		this.closed = true;
		this.availability.fail(/* @__PURE__ */ new Error("Codex resident catalog is closed"));
		this.liveStatus.invalidate();
		this.liveSettings.invalidate();
		this.unsubscribe();
		this.rolloutScanner?.close();
		this.stopCurrency();
		return this.persistence.retire();
	}
	async close() {
		await Promise.allSettled([
			this.retire(),
			this.initializing,
			this.restoring,
			this.reconciling,
			this.reconcilingNative,
			this.currencyWork,
			this.safetyRefresh,
			this.events.close()
		]);
		this.rows.clear();
		this.previews.clear();
		this.observedFiles.clear();
		this.ordering.clear();
	}
};
export { CodexCatalogIndex };
