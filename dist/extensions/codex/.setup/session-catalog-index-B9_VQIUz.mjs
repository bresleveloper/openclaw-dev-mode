import { C as boundedCatalogString, D as filterCatalogPageByTitle, E as codexCatalogThreadStatus, P as readControlCursor, T as codexCatalogThreadName, U as CODEX_CATALOG_MAX_ROWS, b as MAX_CWD_LENGTH, f as setCodexCatalogSource, k as normalizeLimit, l as getCodexCatalogSource, r as projectCodexCatalogNativeThread, v as CatalogParamsError } from "./session-catalog-native-projection-DowriLid.mjs";
import { i as subscribeCodexCatalogEvents } from "./session-catalog-events-Bj6j94E_.mjs";
import { i as retainCodexCatalogRow, n as codexCatalogRowRecency, r as compareCodexCatalogRows, t as CodexCatalogOrdering } from "./session-catalog-index-order-hcdz07yN.mjs";
import { n as CodexCatalogPersistence, r as codexCatalogMetadataPage } from "./session-catalog-index-state-Dgh8ORJm.mjs";
import { a as withCodexCatalogListRequest, s as CodexCatalogAvailability } from "./session-catalog-Pno1xGcl.mjs";
import { a as reportCodexCatalogSpawnFailure, n as findCodexAppServerSpawnError } from "./spawn-error-CL3n6MAa.mjs";
import { CodexCatalogProjectionCapacityError, CodexCatalogProjections, a as resolveCodexCatalogRolloutFingerprint, i as readCodexCatalogRollout, mergeCodexCatalogRolloutRow, n as indexCodexCatalogRowsByRollout, o as scanCodexCatalogRollouts, projectCodexCatalogThread, r as isCodexCatalogRolloutPathCovered, t as codexCatalogRolloutLogicalPath } from "./session-catalog-projection-zK_PUsiE.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-registration";
import { setImmediate as setImmediate$1 } from "node:timers/promises";
import { coerceErrorMessage, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { sanitizeTerminalText } from "openclaw/plugin-sdk/text-chunking";
//#region extensions/codex/src/session-catalog-currency.ts
const SAFETY_INTERVAL_MS = 9e5;
/** One periodic reconciliation cycle per home, without a recursive watcher inventory. */
var CodexCatalogCurrency = class {
	constructor(options) {
		this.options = options;
		this.closed = false;
		this.nativeDirty = false;
		this.nextNativeAt = 0;
		this.nextFilesAt = 0;
	}
	hasActiveWork() {
		return this.hydration !== void 0 || this.initial !== void 0 || this.running !== void 0;
	}
	assertRunnable() {
		if (this.terminalFailure) throw this.terminalFailure;
	}
	stopForTerminalFailure(error) {
		const failure = findCodexAppServerSpawnError(error);
		if (!failure) return false;
		if (!this.closed) {
			this.terminalFailure = failure;
			this.close();
			reportCodexCatalogSpawnFailure(failure);
		}
		return true;
	}
	scheduleHydration(run) {
		if (this.closed || this.hydration) return;
		this.hydration = setImmediate(() => {
			this.hydration = void 0;
			(this.options.runBackground ? this.options.runBackground(run) : run()).catch((error) => this.options.report(error));
		});
		this.hydration.unref();
	}
	cancelHydration() {
		clearImmediate(this.hydration);
		this.hydration = void 0;
	}
	requestNativeRefresh() {
		this.nativeDirty = true;
	}
	start() {
		if (this.closed || this.timer) return;
		this.nextNativeAt = Date.now() + SAFETY_INTERVAL_MS;
		this.nextFilesAt = this.nextNativeAt;
		this.timer = setInterval(() => {
			if (this.running) return;
			const startedAt = Date.now();
			const full = startedAt >= this.nextNativeAt;
			const filesDue = this.options.local && startedAt >= this.nextFilesAt;
			if (!full && !filesDue && !this.nativeDirty) return;
			const nativeDue = full || this.nativeDirty;
			this.nativeDirty = false;
			if (full) this.nextNativeAt = startedAt + SAFETY_INTERVAL_MS;
			if (filesDue) this.nextFilesAt = startedAt + SAFETY_INTERVAL_MS;
			const run = async () => {
				if (filesDue) await this.options.reconcileFiles();
				if (nativeDue) await this.options.reconcileNative(full);
			};
			this.running = (this.options.runBackground ? this.options.runBackground(run) : run()).catch((error) => {
				this.options.report(new Error(`Codex catalog reconciliation failed; waiting for new activity or the next safety cycle: ${coerceErrorMessage(error)}`, { cause: error }));
			}).finally(() => {
				this.running = void 0;
			});
		}, 3e4);
		this.timer.unref();
		if (this.options.local) {
			this.initial = setTimeout(() => {
				this.initial = void 0;
				this.options.reconcileFiles().catch((error) => this.options.report(error));
			}, 0);
			this.initial.unref();
		}
	}
	close() {
		this.closed = true;
		this.cancelHydration();
		clearInterval(this.timer);
		this.timer = void 0;
		clearTimeout(this.initial);
		this.initial = void 0;
		return this.running;
	}
};
//#endregion
//#region extensions/codex/src/session-catalog-index-cursor.ts
function readCodexCatalogCursor(homeId, params) {
	const queryId = createHash("sha256").update(JSON.stringify([
		homeId,
		params.cwd?.trim() ?? "",
		params.searchTerm?.trim().toLocaleLowerCase() ?? ""
	])).digest("hex").slice(0, 16);
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
//#endregion
//#region extensions/codex/src/session-catalog-index-events.ts
/** Event scheduling only; the index owns row publication and stale-read fencing. */
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
			this.enqueueRefresh(id, readThread, source, event.method === "turn/started" ? this.owner.reserveTurnStartOrder() : void 0);
		}
	}
	hasCapacity() {
		if (this.pending.size + this.upserting.size < 2e4) return true;
		this.owner.report(/* @__PURE__ */ new Error("Codex catalog event queue reached its resident row limit"));
		return false;
	}
	enqueueRefresh(id, readThread, source, sourceOrder) {
		this.owner.requestNativeRefresh();
		const existing = this.pending.get(id);
		if (existing) {
			existing.readThread = readThread;
			existing.source = source;
			existing.dirty = true;
			existing.sourceOrder = sourceOrder ?? existing.sourceOrder;
			return;
		}
		if (!this.hasCapacity()) return;
		const pending = {
			readThread,
			source,
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
					const observedSource = pending.source;
					try {
						if (observedSource.closed) throw new Error("Codex catalog observation source closed before its metadata read");
						const published = await this.owner.refresh(id, pending.readThread, observedSourceOrder);
						if (published && pending.sourceOrder === observedSourceOrder) pending.sourceOrder = void 0;
						else if (!published && pending.sourceOrder !== void 0) pending.dirty = true;
					} catch (error) {
						if (observedSource.closed) {
							if (pending.source === observedSource) pending.dirty = false;
							this.owner.report(new Error("Codex catalog observation interrupted by client closure; metadata refresh deferred to the current catalog owner", { cause: error }));
						} else this.owner.report(error);
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
//#endregion
//#region extensions/codex/src/session-catalog-index-field.ts
/** Orders field observations independently from catalog row publication. */
var CodexCatalogField = class {
	constructor() {
		this.revision = 0;
		this.minimumCapture = 0;
		this.entries = /* @__PURE__ */ new Map();
	}
	capture() {
		return ++this.revision;
	}
	update(threadId, value) {
		this.put(threadId, {
			revision: ++this.revision,
			value
		});
	}
	observe(threadId, value, capturedRevision) {
		if (capturedRevision < this.minimumCapture || (this.entries.get(threadId)?.revision ?? 0) > capturedRevision) return false;
		this.put(threadId, {
			revision: capturedRevision,
			value
		});
		return true;
	}
	get(threadId) {
		return this.entries.get(threadId)?.value;
	}
	some(predicate) {
		for (const entry of this.entries.values()) if (entry.value !== void 0 && predicate(entry.value)) return true;
		return false;
	}
	delete(threadId) {
		this.put(threadId, { revision: ++this.revision });
	}
	deleteWhere(predicate) {
		for (const [threadId, entry] of this.entries) if (entry.value !== void 0 && predicate(entry.value)) this.delete(threadId);
	}
	invalidate() {
		this.minimumCapture = ++this.revision;
		this.entries.clear();
	}
	put(threadId, entry) {
		const id = boundedCatalogString(threadId, 256);
		if (!id) return;
		this.entries.delete(id);
		this.entries.set(id, entry);
		if (this.entries.size > 2e4) {
			const oldest = this.entries.entries().next().value;
			if (oldest) {
				this.minimumCapture = Math.max(this.minimumCapture, oldest[1].revision);
				this.entries.delete(oldest[0]);
			}
		}
	}
};
//#endregion
//#region extensions/codex/src/session-catalog-index-names.ts
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
//#endregion
//#region extensions/codex/src/session-catalog-index-observations.ts
/** Fences asynchronous observations against later catalog mutations. */
var CodexCatalogObservations = class {
	constructor() {
		this.revision = 0;
		this.minimumCapture = 0;
		this.mutations = /* @__PURE__ */ new Map();
		this.observations = /* @__PURE__ */ new Map();
	}
	hasActiveWork() {
		return this.observations.size > 0;
	}
	mark(threadId) {
		this.revision++;
		if (this.observations.size) {
			const id = boundedCatalogString(threadId, 256);
			if (!id) return;
			this.mutations.delete(id);
			this.mutations.set(id, this.revision);
			if (this.mutations.size > 2e4) {
				const oldest = this.mutations.entries().next().value;
				this.minimumCapture = Math.max(this.minimumCapture, oldest[1]);
				this.mutations.delete(oldest[0]);
			}
		}
	}
	async observe(read) {
		const token = Symbol("catalog observation");
		const revision = this.revision;
		this.observations.set(token, revision);
		try {
			return await read((id) => revision >= this.minimumCapture && (this.mutations.get(id) ?? 0) <= revision);
		} finally {
			this.observations.delete(token);
			const oldest = this.observations.values().next().value ?? Infinity;
			for (const [id, changed] of this.mutations) {
				if (changed > oldest) break;
				this.mutations.delete(id);
			}
		}
	}
};
//#endregion
//#region extensions/codex/src/session-catalog-index-query.ts
/** Keyset pagination remains valid when the anchor row is archived or deleted. */
function prepareCodexCatalogQuery(params, prepared) {
	const limit = Math.min(normalizeLimit(params.limit, "limit"), 64);
	const cwd = params.cwd?.trim();
	const search = params.searchTerm?.trim().toLocaleLowerCase();
	const { queryId, anchor } = prepared;
	const cursor = (row, backwards) => encodeCodexResidentCursor(queryId, row, backwards);
	return (ordered, liveStatus, liveSettings, availability) => {
		const { complete, frontier } = availability;
		if (!complete && !frontier) return;
		if (!complete && frontier && anchor?.backwards && compareCodexCatalogRows(frontier, anchor) < 0) return;
		const candidates = complete && !cwd && !search ? ordered : ordered.filter((row) => {
			const session = row.page.sessions[0];
			return session && (complete || !frontier || compareCodexCatalogRows(row, frontier) <= 0) && (!cwd || (liveSettings.get(row.threadId)?.cwd ?? session.cwd) === cwd) && (!search || (session.name ?? session.fallbackName)?.toLocaleLowerCase().includes(search));
		});
		const selected = anchor?.backwards ? candidates.filter((row) => row.threadId !== anchor.threadId) : candidates;
		let start = 0;
		let end;
		const after = (row) => !anchor || compareCodexCatalogRows(row, anchor) > 0;
		if (anchor) {
			const at = selected.findIndex(after);
			const boundary = at < 0 ? selected.length : at;
			if (anchor.backwards) {
				end = boundary;
				start = Math.max(0, boundary - limit);
			} else start = boundary;
		}
		let page = selected.slice(start, end ?? start + limit);
		if (anchor?.backwards && !page.length) {
			start = 0;
			page = candidates.slice(0, limit);
		}
		const first = page[0];
		const last = page.at(-1);
		let continuation = last && (anchor?.backwards ? !complete || candidates.some((row) => compareCodexCatalogRows(row, last) > 0) : start + page.length < selected.length) ? last : void 0;
		if (!complete && !continuation) {
			if (!anchor?.backwards && !last && (!frontier || !after(frontier))) return;
			continuation = frontier && (!last || compareCodexCatalogRows(frontier, last) > 0) ? frontier : last;
		}
		return {
			sessions: page.flatMap((row) => row.page.sessions.map(({ status: _storedStatus, activeFlags: _storedFlags, ...session }) => {
				const live = liveStatus.get(row.threadId);
				return {
					...session,
					...liveSettings.get(row.threadId),
					status: live?.status ?? "notLoaded",
					...live?.activeFlags ? { activeFlags: [...live.activeFlags] } : {}
				};
			})),
			...continuation ? { nextCursor: cursor(continuation, false) } : {},
			...first && start > 0 ? { backwardsCursor: cursor(first, true) } : {}
		};
	};
}
//#endregion
//#region extensions/codex/src/session-catalog-native-page.ts
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
			limit: 64,
			...useStateDbOnly ? { useStateDbOnly } : {},
			...cursor ? { cursor } : {}
		}, Math.max(0, CODEX_CATALOG_MAX_ROWS - offset));
		cursor = readControlCursor(page.nextCursor, "hydration response");
		if (cursor && cursors.has(cursor)) throw new Error("Codex catalog repeated a hydration cursor");
		if (cursor) {
			cursors.add(cursor);
			if (cursors.size > 2e4) cursors.delete(cursors.values().next().value);
		}
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
		const limit = Math.min(normalizeLimit(params.limit, "limit"), 64);
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
			const pageLimit = position.anchorThreadId ? 64 : limit;
			const statusRevision = this.status.capture();
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
			for (const row of page.rows) this.status.observe(row, statusRevision);
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
			const projected = filterCatalogPageByTitle({ sessions: rows.flatMap((row) => row.page.sessions).map(({ status: _storedStatus, activeFlags: _storedFlags, ...session }) => {
				const live = this.status.get(session.threadId);
				return Object.assign(session, this.settings.get(session.threadId), {
					status: live?.status ?? "notLoaded",
					...live?.activeFlags ? { activeFlags: [...live.activeFlags] } : {}
				});
			}).filter((session) => !cwd || session.cwd === cwd) }, params.searchTerm);
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
//#endregion
//#region extensions/codex/src/session-catalog-settings.ts
const MAX_SETTINGS_SOURCE_WITNESSES = 64;
/** Live settings overlay native stored metadata only while a supporting source stays open. */
var CodexCatalogSettingsIndex = class {
	constructor() {
		this.values = new CodexCatalogField();
	}
	update(threadId, settings, source) {
		if (source.closed) return;
		const cwd = boundedCatalogString(settings.cwd, MAX_CWD_LENGTH);
		const modelProvider = boundedCatalogString(settings.modelProvider, 500, "truncate");
		if (!cwd && !modelProvider) return;
		const bounded = {
			...cwd ? { cwd } : {},
			...modelProvider ? { modelProvider } : {}
		};
		const current = this.values.get(threadId);
		const sources = /* @__PURE__ */ new Set();
		if (current && current.settings.cwd === bounded.cwd && current.settings.modelProvider === bounded.modelProvider) {
			for (const witness of current.sources) if (!witness.closed) sources.add(witness);
		}
		if (sources.size < MAX_SETTINGS_SOURCE_WITNESSES) sources.add(source);
		this.values.update(threadId, {
			settings: bounded,
			sources
		});
	}
	get(threadId) {
		const current = this.values.get(threadId);
		if (current) {
			for (const source of current.sources) if (!source.closed) return current.settings;
		}
	}
	hasLiveCwd() {
		return this.values.some(({ settings, sources }) => {
			if (settings.cwd) {
				for (const source of sources) if (!source.closed) return true;
			}
			return false;
		});
	}
	delete(threadId) {
		this.values.delete(threadId);
	}
	withdraw(threadId, source) {
		const current = this.values.get(threadId);
		if (!current?.sources.delete(source)) return;
		for (const witness of current.sources) if (!witness.closed) return;
		this.values.delete(threadId);
	}
	invalidate(source) {
		if (!source) {
			this.values.invalidate();
			return;
		}
		this.values.deleteWhere((entry) => {
			entry.sources.delete(source);
			for (const witness of entry.sources) if (!witness.closed) return false;
			return true;
		});
	}
};
//#endregion
//#region extensions/codex/src/session-catalog-status.ts
const MAX_STATUS_SOURCE_WITNESSES = 64;
/** Equivalent broadcasts retain at most 64 source witnesses for each bounded resident row. */
var CodexCatalogStatusIndex = class {
	constructor() {
		this.values = new CodexCatalogField();
	}
	capture() {
		return this.values.capture();
	}
	update(threadId, status, source) {
		const next = this.next(threadId, status, source);
		if (next) this.values.update(threadId, next);
	}
	observe(row, revision) {
		const session = row.page.sessions[0];
		const source = getCodexCatalogSource(row);
		if (session && source) {
			const next = this.next(row.threadId, {
				status: session.status,
				...session.activeFlags ? { activeFlags: session.activeFlags } : {}
			}, source);
			if (next) this.values.observe(row.threadId, next, revision);
		}
	}
	get(threadId) {
		const current = this.values.get(threadId);
		if (current) {
			for (const source of current.sources) if (!source.closed) return current.status;
		}
	}
	delete(threadId) {
		this.values.delete(threadId);
	}
	invalidate(source) {
		if (!source) {
			this.values.invalidate();
			return;
		}
		this.values.deleteWhere((entry) => {
			entry.sources.delete(source);
			for (const witness of entry.sources) if (!witness.closed) return false;
			return true;
		});
	}
	next(threadId, status, source) {
		if (source.closed) return;
		const current = this.values.get(threadId);
		const sources = new Set([...current?.sources ?? []].filter((witness) => !witness.closed));
		if (status.status === "notLoaded" && current && current.status.status !== "notLoaded" && sources.size) {
			sources.delete(source);
			if (sources.size) return {
				status: current.status,
				sources
			};
		}
		const flags = status.activeFlags ?? [];
		const previousFlags = current?.status.activeFlags ?? [];
		if (current?.status.status === status.status && flags.length === previousFlags.length && flags.every((flag, index) => flag === previousFlags[index])) {
			if (sources.size < MAX_STATUS_SOURCE_WITNESSES) sources.add(source);
			return {
				status,
				sources
			};
		}
		return {
			status,
			sources: /* @__PURE__ */ new Set([source])
		};
	}
};
//#endregion
//#region extensions/codex/src/session-catalog-index.ts
/** One home owns resident queries and authoritative overflow discovery. */
var CodexCatalogIndex = class {
	constructor(options) {
		this.options = options;
		this.rows = /* @__PURE__ */ new Map();
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
		this.projections = new CodexCatalogProjections();
		this.observedFiles = /* @__PURE__ */ new Map();
		this.obsoleteStoredKeys = /* @__PURE__ */ new Set();
		this.sourceRevision = 0;
		this.ordering = new CodexCatalogOrdering();
		this.observations = new CodexCatalogObservations();
		this.currency = new CodexCatalogCurrency({
			local: Boolean(options.localSessionsRoot),
			reconcileFiles: () => this.reconcile(),
			reconcileNative: (full) => this.reconcileNative(full),
			runBackground: options.runBackground,
			report: (error) => this.report(error)
		});
		this.persistence = new CodexCatalogPersistence(options.state, (error) => this.report(error));
		this.events = new CodexCatalogIndexEvents({
			get: (id) => this.rows.get(id),
			updateStatus: (id, status, source) => {
				this.liveStatus.update(id, status, source);
				if (status.status === "notLoaded") this.liveSettings.withdraw(id, source);
			},
			updateSettings: (id, settings, source) => this.liveSettings.update(id, settings, source),
			rename: (id, name) => {
				this.currency.requestNativeRefresh();
				this.names.update(id, name);
				const row = this.rows.get(id);
				if (row && !this.closed) this.put(row);
			},
			upsert: (thread) => this.upsertThread(thread),
			reserveTurnStartOrder: () => this.ordering.reserveEvent(),
			requestNativeRefresh: () => this.currency.requestNativeRefresh(),
			refresh: (id, readThread, sourceOrder) => this.refreshThread(id, readThread, sourceOrder),
			archive: (id) => this.archive(id),
			remove: (id) => {
				this.currency.requestNativeRefresh();
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
				this.sourceRevision++;
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
		if (!this.closed && !this.currency.stopForTerminalFailure(error)) embeddedAgentLog.warn("Codex resident catalog background update failed", { error });
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
		const oldest = retainCodexCatalogRow(this.rows, row);
		this.overflow ||= this.rows.size >= CODEX_CATALOG_MAX_ROWS;
		this.ordering.invalidate();
		if (oldest?.threadId === row.threadId) return;
		if (oldest) this.evict(oldest.threadId);
		this.persistence.put(row);
	}
	evict(threadId) {
		this.rows.delete(threadId);
		this.ordering.invalidate();
		this.persistence.remove(threadId);
	}
	remove(threadId) {
		this.observations.mark(threadId);
		this.evict(threadId);
		this.liveStatus.delete(threadId);
		this.liveSettings.delete(threadId);
		this.names.delete(threadId);
	}
	async initialize() {
		this.assertCurrent();
		this.currency.assertRunnable();
		this.currency.cancelHydration();
		if (this.initialized && !this.needsNativeRefresh) return;
		if (!this.initializing) {
			this.availability.begin();
			const sourceRevision = this.sourceRevision;
			this.initializing = (async () => {
				await this.restore();
				await this.persistence.pruneObsolete(this.obsoleteStoredKeys, this.rows.values());
				this.obsoleteStoredKeys.clear();
				await this.reconcilingNative?.catch((error) => this.report(error));
				if (!this.initialized) {
					let observedRevision;
					do
						observedRevision = await this.hydrate(this.availability.complete);
					while (observedRevision !== this.sourceRevision);
					this.needsNativeRefresh = false;
				}
				if (this.needsNativeRefresh) {
					await this.reconcile();
					await this.reconcileNative();
					this.needsNativeRefresh = false;
				}
				this.initialized = true;
				this.failure = void 0;
				this.currency.start();
			})().catch((error) => {
				this.failure = { error };
				this.availability.fail(error);
				this.currency.stopForTerminalFailure(error);
				throw error;
			}).finally(() => {
				this.initializing = void 0;
				if (this.failure && sourceRevision !== this.sourceRevision) this.scheduleHydration();
			});
		}
		return this.initializing;
	}
	async restore() {
		if (this.restored) return;
		this.restoring ??= this.observations.observe(async (isCurrent) => {
			try {
				const snapshot = await this.persistence.readSnapshot();
				this.assertCurrent();
				if (snapshot.cleanupIncomplete) this.persistence.invalidate(/* @__PURE__ */ new Error("Codex catalog obsolete snapshot exceeds its cleanup limit"));
				for (const key of snapshot.obsolete) this.obsoleteStoredKeys.add(key);
				for (const row of snapshot.rows) if (isCurrent(row.threadId)) {
					const restored = row.rolloutPath ? {
						...row,
						rolloutPath: codexCatalogRolloutLogicalPath(row.rolloutPath)
					} : row;
					const patched = this.withName(restored);
					if (patched !== restored) this.persistence.put(patched);
					const evicted = retainCodexCatalogRow(this.rows, patched);
					if (evicted) this.evict(evicted.threadId);
					this.ordering.restore(row);
				}
				this.overflow ||= snapshot.overflow || this.rows.size >= 2e4;
				if (snapshot.complete) {
					this.availability.publish(void 0, true);
					this.initialized = true;
					this.needsNativeRefresh = true;
					this.currency.start();
				}
			} catch (error) {
				this.persistence.invalidate(error);
			}
			this.restored = true;
		});
		await this.restoring;
	}
	scheduleHydration() {
		if (this.initialized && !this.needsNativeRefresh || this.initializing || this.closed) return;
		this.currency.scheduleHydration(() => this.initialize());
	}
	captureFields() {
		return {
			status: this.liveStatus.capture(),
			name: this.names.capture()
		};
	}
	observeFields(row, revision) {
		const session = row.page.sessions[0];
		if (!session) return;
		this.liveStatus.observe(row, revision.status);
		if (session.name !== void 0 && this.names.observe(row.threadId, session.name, revision.name)) {
			const current = this.rows.get(row.threadId);
			if (current && current.page.sessions[0]?.name !== session.name) this.put(current);
		}
	}
	reconcileNative(full = true) {
		if (!this.options.localSessionsRoot && this.initializing && !this.initialized) return this.initializing;
		if (!this.reconcilingNative) this.reconcilingNative = this.hydrate(true, !full).then(() => void 0).finally(() => {
			this.reconcilingNative = void 0;
		});
		return this.reconcilingNative;
	}
	hydrate(useStateDbOnly = false, incremental = false) {
		const run = () => this.observations.observe((isCurrent) => this.hydratePages(isCurrent, useStateDbOnly, incremental));
		return this.options.runNativeWalk?.(run) ?? run();
	}
	async hydratePages(isCurrent, useStateDbOnly, incremental) {
		this.assertCurrent();
		const files = this.options.localSessionsRoot && !useStateDbOnly ? (await scanCodexCatalogRollouts(this.options.localSessionsRoot, /* @__PURE__ */ new Set())).files : /* @__PURE__ */ new Map();
		let observedRevision;
		let frontier;
		const batchOrder = this.ordering.captureBatch(this.availability.complete);
		const remaining = incremental ? void 0 : new Map(this.rows);
		const pages = readCodexCatalogHydrationPages(async (params, remainingRows) => {
			this.assertCurrent();
			const fieldRevision = this.captureFields();
			return {
				...await this.options.readNative(params, remainingRows),
				fieldRevision,
				sourceRevision: this.sourceRevision
			};
		}, useStateDbOnly);
		for await (const page of pages) {
			this.assertCurrent();
			observedRevision ??= page.sourceRevision;
			let sourceOrder = page.offset;
			let changed = false;
			for (const id of page.excludedThreadIds ?? []) if (isCurrent(id)) {
				changed ||= this.rows.has(id);
				this.remove(id);
			}
			for (const row of page.rows) {
				const position = sourceOrder++;
				if (position >= 2e4) continue;
				remaining?.delete(row.threadId);
				const previous = this.rows.get(row.threadId);
				this.observeFields(row, page.fieldRevision);
				if (!isCurrent(row.threadId)) {
					changed = true;
					continue;
				}
				const fingerprint = resolveCodexCatalogRolloutFingerprint(row.rolloutPath, useStateDbOnly ? previous : void 0, files);
				this.observations.mark(row.threadId);
				this.put({
					...row,
					sourceOrder: batchOrder(row, previous, position),
					...fingerprint ? { fingerprint } : {}
				});
				changed ||= this.rows.get(row.threadId) !== previous;
				frontier = this.rows.get(row.threadId) ?? frontier;
			}
			if (incremental && (!changed && page.rows.length > 0 || sourceOrder >= 2e4)) break;
			if (page.nextCursor) this.availability.publish(frontier);
		}
		if (remaining && (!useStateDbOnly || !this.options.localSessionsRoot)) {
			for (const [id, row] of remaining) if (isCurrent(id) && this.rows.get(id) === row) this.remove(id);
		}
		this.availability.publish(frontier, true);
		await this.persistence.finishHydration(this.overflow);
		return observedRevision ?? this.sourceRevision;
	}
	reconcile() {
		if (!this.reconciling) this.reconciling = this.observations.observe((isCurrent) => this.reconcileFiles(isCurrent)).finally(() => {
			this.reconciling = void 0;
		});
		return this.reconciling;
	}
	async reconcileFiles(isCurrent) {
		const root = this.options.localSessionsRoot;
		if (!root || !this.initialized || this.closed) return;
		this.assertCurrent();
		const byPath = indexCodexCatalogRowsByRollout(this.rows.values());
		const { files, present } = await scanCodexCatalogRollouts(root, new Set(byPath.keys()));
		this.assertCurrent();
		const observed = new Map(files);
		for (const [file, fingerprint] of files) {
			const previous = byPath.get(codexCatalogRolloutLogicalPath(file));
			const known = this.observedFiles.get(file) ?? previous?.fingerprint;
			if (known?.mtimeMs === fingerprint.mtimeMs && known.size === fingerprint.size) continue;
			this.currency.requestNativeRefresh();
			observed.delete(file);
			if (known) observed.set(file, known);
			let thread;
			try {
				thread = await readCodexCatalogRollout(root, file);
			} catch (error) {
				this.assertCurrent();
				this.report(error);
				continue;
			}
			this.assertCurrent();
			if (!thread) {
				observed.set(file, fingerprint);
				continue;
			}
			if (!isCurrent(thread.id)) continue;
			const existing = this.rows.get(thread.id);
			if (existing?.rolloutPath && codexCatalogRolloutLogicalPath(existing.rolloutPath) !== codexCatalogRolloutLogicalPath(file)) {
				observed.set(file, fingerprint);
				continue;
			}
			if (!existing && !thread.preview) {
				observed.set(file, fingerprint);
				continue;
			}
			thread.preview ||= existing?.preview;
			const projected = await projectCodexCatalogThread(thread, root);
			this.assertCurrent();
			if (!isCurrent(thread.id)) continue;
			observed.set(file, fingerprint);
			const row = projected.rows[0];
			if (!row) continue;
			this.observations.mark(row.threadId);
			this.put(mergeCodexCatalogRolloutRow(row, existing, fingerprint));
			await setImmediate$1();
		}
		for (const row of byPath.values()) if (row.rolloutPath && isCodexCatalogRolloutPathCovered(root, row.rolloutPath) && !present.has(codexCatalogRolloutLogicalPath(row.rolloutPath)) && this.rows.get(row.threadId) === row) {
			this.currency.requestNativeRefresh();
			this.remove(row.threadId);
		}
		this.observedFiles = observed;
	}
	upsertThread(thread) {
		if (this.closed) return Promise.resolve();
		try {
			this.assertCurrent();
		} catch {
			return Promise.resolve();
		}
		try {
			this.currency.requestNativeRefresh();
			return this.upsertPreparedThread(projectCodexCatalogNativeThread(thread, sanitizeTerminalText));
		} catch (error) {
			return Promise.reject(toErrorObject(error, "Codex catalog projection failed"));
		}
	}
	upsertPreparedThread(prepared) {
		return this.projections.run(() => {
			this.observations.mark(prepared.id);
			const fields = this.captureFields();
			return this.observations.observe((isCurrent) => this.projectThread(prepared, isCurrent, fields));
		}).then(() => void 0).catch((error) => {
			if (!(error instanceof CodexCatalogProjectionCapacityError)) throw error;
			this.report(error);
		});
	}
	refreshThread(id, readThread, sourceOrder) {
		this.assertCurrent();
		this.observations.mark(id);
		const fields = this.captureFields();
		return this.projections.run(() => this.observations.observe((isCurrent) => readThread(id).then((thread) => {
			const prepared = projectCodexCatalogNativeThread(thread, sanitizeTerminalText);
			if (prepared.id !== id) throw new Error("Codex catalog refresh returned a different thread");
			return this.closed ? true : this.projectThread(prepared, isCurrent, fields, sourceOrder);
		})));
	}
	async projectThread(thread, isCurrent, fieldRevision, sourceOrder) {
		const projected = await projectCodexCatalogThread(thread, this.options.localSessionsRoot);
		if (this.closed) return true;
		const row = projected.rows[0];
		if (row) this.observeFields(row, fieldRevision);
		if (!isCurrent(thread.id)) return false;
		if (projected.excludedThreadIds?.includes(thread.id)) this.remove(thread.id);
		if (row) {
			const previous = this.rows.get(thread.id);
			const fingerprint = resolveCodexCatalogRolloutFingerprint(row.rolloutPath, previous);
			this.observations.mark(thread.id);
			this.put({
				...row,
				...sourceOrder !== void 0 ? { sourceOrder } : {},
				...fingerprint ? { fingerprint } : {}
			});
		}
		return true;
	}
	archive(threadId) {
		if (this.closed) return;
		this.currency.requestNativeRefresh();
		this.observations.mark(threadId);
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
		return Boolean(this.initializing || !this.restored && this.restoring || this.reconciling || this.reconcilingNative || this.currency.hasActiveWork() || this.observations.hasActiveWork() || this.events.hasActiveWork() || this.persistence.hasActiveWork());
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
				const ordered = this.ordering.read(this.rows);
				const page = query?.(ordered, this.liveStatus, this.liveSettings, this.availability);
				if (cursor.kind === "native" || this.overflow && (params.cwd || params.searchTerm || page && !page.nextCursor)) return await this.nativePages.list(params, cursor, this.options, request);
				if (page) return page;
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
		this.currency.close();
		return this.persistence.retire();
	}
	async close() {
		const writes = this.retire();
		await Promise.allSettled([
			this.initializing,
			this.restoring,
			this.reconciling,
			this.reconcilingNative,
			this.currency.close(),
			writes,
			this.events.close()
		]);
		this.rows.clear();
		this.observedFiles.clear();
		this.ordering.invalidate();
	}
};
//#endregion
export { CodexCatalogIndex };
