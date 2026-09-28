import { A as parseCatalogPage, W as detachCodexCatalogString } from "./session-catalog-native-projection-DowriLid.mjs";
import { i as retainCodexCatalogRow } from "./session-catalog-index-order-hcdz07yN.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import { setImmediate } from "node:timers/promises";
//#region extensions/codex/src/session-catalog-index-state.ts
const CODEX_CATALOG_STATE_NAMESPACE = "session-catalog-resident";
/** Durable metadata never asserts that a native process is still running. */
function codexCatalogMetadataPage(page) {
	return { sessions: page.sessions.map(({ status: _status, activeFlags: _flags, ...session }) => ({
		...session,
		status: "notLoaded"
	})) };
}
function readStoredCodexCatalogRow(value) {
	if (!isRecord(value) || value.version !== 1 || value.kind !== "row" || !isRecord(value.row)) return;
	const row = value.row;
	if (typeof row.threadId !== "string" || !row.threadId || row.threadId.length > 256 || typeof row.archived !== "boolean" || typeof row.nativeMetadata !== "boolean" || row.preview !== void 0 && (typeof row.preview !== "string" || row.preview.length > 500) || row.sourceOrder !== void 0 && (typeof row.sourceOrder !== "number" || !Number.isSafeInteger(row.sourceOrder)) || row.rolloutPath !== void 0 && (typeof row.rolloutPath !== "string" || row.rolloutPath.length > 4096) || !(row.updatedAt === null || typeof row.updatedAt === "number" && Number.isFinite(row.updatedAt)) || !(row.recencyAt === null || typeof row.recencyAt === "number" && Number.isFinite(row.recencyAt))) return;
	try {
		const page = parseCatalogPage(row.page);
		if (page.sessions.length > 1 || page.sessions.some((session) => session.threadId !== row.threadId)) return;
		const fingerprint = isRecord(row.fingerprint) && typeof row.fingerprint.mtimeMs === "number" && Number.isFinite(row.fingerprint.mtimeMs) && typeof row.fingerprint.size === "number" && Number.isFinite(row.fingerprint.size) ? {
			mtimeMs: row.fingerprint.mtimeMs,
			size: row.fingerprint.size
		} : void 0;
		return {
			threadId: detachCodexCatalogString(row.threadId),
			updatedAt: row.updatedAt,
			recencyAt: row.recencyAt,
			archived: row.archived,
			nativeMetadata: row.nativeMetadata,
			page: codexCatalogMetadataPage(page),
			...typeof row.preview === "string" ? { preview: detachCodexCatalogString(row.preview) } : {},
			...typeof row.sourceOrder === "number" ? { sourceOrder: row.sourceOrder } : {},
			...typeof row.rolloutPath === "string" ? { rolloutPath: detachCodexCatalogString(row.rolloutPath) } : {},
			...fingerprint ? { fingerprint } : {}
		};
	} catch {
		return;
	}
}
/** An incomplete cache cannot prove which native rows precede an issued cursor. */
async function readCodexCatalogSnapshot(state) {
	const entries = await state?.entries() ?? [];
	const rows = /* @__PURE__ */ new Map();
	const keys = /* @__PURE__ */ new Map();
	const obsolete = /* @__PURE__ */ new Set();
	let cleanupIncomplete = false;
	let valid = true;
	const discard = (key) => {
		if (obsolete.has(key)) return;
		if ((key === "complete" || obsolete.size - Number(obsolete.has("complete")) < 2e4) && Buffer.byteLength(key) <= 512) obsolete.add(detachCodexCatalogString(key));
		else {
			cleanupIncomplete = true;
			obsolete.add("complete");
		}
	};
	let complete = false;
	let overflow = false;
	for (const entry of entries) {
		if (Buffer.byteLength(entry.key) > 512) {
			valid = false;
			discard(entry.key);
			continue;
		}
		if (entry.value?.version === 1 && entry.value.kind === "complete") {
			complete = true;
			overflow ||= entry.value.overflow === true;
			continue;
		}
		const row = readStoredCodexCatalogRow(entry.value);
		if (row) {
			const evicted = retainCodexCatalogRow(rows, row);
			if (evicted) {
				discard(evicted === row ? entry.key : keys.get(evicted.threadId));
				keys.delete(evicted.threadId);
			}
			if (evicted !== row) keys.set(row.threadId, detachCodexCatalogString(entry.key));
		} else {
			valid = false;
			discard(entry.key);
		}
	}
	complete &&= valid;
	if (!complete) {
		rows.clear();
		for (const entry of entries) discard(entry.key);
		if (entries.length) obsolete.add("complete");
	}
	return {
		rows: [...rows.values()],
		complete,
		overflow,
		obsolete,
		cleanupIncomplete
	};
}
/** Serializes reconstructible cache writes without blocking resident queries. */
var CodexCatalogPersistence = class {
	invalidate(error) {
		if (!this.failed) this.report(error);
		this.failed = true;
		this.queue("complete", void 0);
	}
	constructor(state, report) {
		this.state = state;
		this.report = report;
		this.pending = /* @__PURE__ */ new Map();
		this.failed = false;
		this.retired = false;
	}
	hasActiveWork() {
		return this.writing !== void 0 || this.pending.size > 0;
	}
	async readSnapshot() {
		await this.drain();
		return await readCodexCatalogSnapshot(this.state);
	}
	key(threadId) {
		return `thread:${createHash("sha256").update(threadId).digest("hex")}`;
	}
	put(row) {
		if (!this.state || this.retired) return;
		this.queue(this.key(row.threadId), {
			version: 1,
			kind: "row",
			row
		});
	}
	remove(threadId) {
		this.queue(this.key(threadId), void 0);
	}
	async pruneObsolete(keys, currentRows) {
		const currentKeys = new Set(Array.from(currentRows, (row) => this.key(row.threadId)));
		for (const key of keys) if (!currentKeys.has(key)) this.queue(key, void 0);
		await this.drain();
	}
	async finishHydration(overflow = false) {
		await this.drain();
		if (!this.failed) {
			this.queue("complete", {
				version: 1,
				kind: "complete",
				...overflow ? { overflow: true } : {}
			});
			await this.drain();
		}
	}
	async drain() {
		while (this.writing) await this.writing;
	}
	retire() {
		this.retired = true;
		return this.drain();
	}
	queue(key, value) {
		if (!this.state || this.retired && (!this.writing || key !== "complete" || value !== void 0)) return;
		if (key !== "complete" && !this.pending.has(key) && this.pending.size - Number(this.pending.has("complete")) >= 2e4) {
			this.invalidate(/* @__PURE__ */ new Error("Codex catalog persistence queue reached its resident row limit"));
			return;
		}
		this.pending.set(key, value);
		this.writing ??= this.writePending();
	}
	async writePending() {
		try {
			await setImmediate();
			for (const [key, value] of this.pending) {
				this.pending.delete(key);
				try {
					if (value) await this.state.register(key, value);
					else await this.state.delete(key);
				} catch (error) {
					if (!this.failed) this.invalidate(error);
				}
			}
		} finally {
			this.writing = void 0;
		}
	}
};
//#endregion
export { CodexCatalogPersistence as n, codexCatalogMetadataPage as r, CODEX_CATALOG_STATE_NAMESPACE as t };
