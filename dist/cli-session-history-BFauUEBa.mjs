import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as createCpuTrackedWorker } from "./worker-cpu-c5lFIb1t.mjs";
import { c as registerNodeSqliteDisposeCallback, r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, l as prepareSqliteQuerySync, o as getNodeSqliteKysely, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { i as normalizeCliSessionReseedReceipt, r as getCliSessionBinding } from "./cli-session-binding-Dx1VbkI8.mjs";
import { f as readPersistedMediaFacts, s as isImageMediaFact } from "./media-facts-BIPREXi-.mjs";
import { u as stripInlineDirectiveTagsForDisplay } from "./directive-tags-DmdxLrNX.mjs";
import { o as stripInboundMetadata } from "./strip-inbound-meta-D65t0FgP.mjs";
import { n as resolveHistoryAnchorPageRange, r as resolveTranscriptPageEnd } from "./transcript-anchor-page-CKxnXLW4.mjs";
import { n as createTranscriptDisplaySource } from "./transcript-display-position-BHW0T3ai.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { r as dropPreSessionStartAnnouncePairs, s as isPreSessionStartAssistantMessage } from "./chat-display-projection.history-DKYX-kD-.mjs";
import { n as filterSessionMessageHistoryVisibility } from "./session-transcript-read-kernel-BP5-uRDU.mjs";
import { a as readChatHistoryMessageId, l as readIncrementalChatHistoryTail, o as readChatHistoryMessageSeq, s as readChatHistoryPaginationKey } from "./session-history-tail-C5LEM5f_.mjs";
import { n as isOpenClawCliImageCachePath } from "./images.media-refs-CKLFlAQM.mjs";
import { n as hashCliImageTurnEntryId, r as readCliImageTurnContext } from "./cli-image-turn-correlation-BVXO9f3I.mjs";
import { a as parseClaudeCliHistoryEntry, d as readRoutedPromptView, f as stripCliPromptDecorations, i as decodeClaudeCliProjectEntry, n as cleanClaudeCliImportedUserDisplay, r as createClaudeReseedImportState, s as redactClaudeCliHistoryMessage, t as appendCoalescedClaudeCliToolMessage, u as resolveClaudeCliSessionFilePathAsync } from "./cli-session-history.claude-YLsvkl4E.mjs";
import fs from "node:fs";
import { setImmediate } from "node:timers/promises";
import readline from "node:readline";
//#region src/gateway/cli-session-history-index-policy.ts
const DEDUPE_TIMESTAMP_WINDOW_MS = 3e5;
function stripTrailingCliImageMentions(text) {
	const lines = text.split("\n");
	let end = lines.length;
	while (end > 0) {
		const line = lines[end - 1]?.trim() ?? "";
		if (!line.startsWith("@") || !isOpenClawCliImageCachePath(line.slice(1))) break;
		end -= 1;
	}
	return end === lines.length ? {
		text,
		stripped: false
	} : {
		text: lines.slice(0, end).join("\n").trimEnd(),
		stripped: true
	};
}
function extractComparableText(record, role, imported) {
	const parts = [];
	const text = readStringValue(record.text);
	if (text !== void 0) parts.push(text);
	const rawContent = record.content;
	const content = readStringValue(rawContent);
	if (content !== void 0) parts.push(content);
	else if (Array.isArray(rawContent)) {
		for (const block of rawContent) if (block && typeof block === "object" && "text" in block) {
			const blockText = readStringValue(block.text);
			if (blockText !== void 0) parts.push(blockText);
		}
	}
	if (parts.length === 0) return { hasCliImageMentions: false };
	const rawText = parts.join("\n");
	const joined = rawText.trim();
	if (!joined) return { hasCliImageMentions: false };
	const meta = asOptionalRecord(record["__openclaw"]);
	const isClaudeImport = imported && role === "user" && normalizeOptionalString(meta?.importedFrom) === "claude-cli";
	const stripResult = isClaudeImport ? stripTrailingCliImageMentions(joined) : {
		text: joined,
		stripped: false
	};
	const normalizeText = (value) => {
		return stripInlineDirectiveTagsForDisplay(value).text.replace(/\s+/g, " ").trim();
	};
	const normalized = normalizeText(stripResult.text);
	const withoutDecorations = isClaudeImport ? stripCliPromptDecorations(rawText) : rawText;
	const cleanText = normalizeText(role === "user" ? stripInboundMetadata(isClaudeImport ? stripTrailingCliImageMentions(withoutDecorations.trim()).text : withoutDecorations) : withoutDecorations);
	const undecoratedText = cleanText !== normalized ? cleanText : void 0;
	const routed = role === "user" ? readRoutedPromptView(record.provenance, joined, isClaudeImport) : void 0;
	const routedBody = routed && normalizeText(stripInboundMetadata(isClaudeImport ? stripTrailingCliImageMentions(routed.body.trim()).text : routed.body));
	const originalRoutedBody = routed && normalizeText(routed.originalBody);
	const storedImageTurnKey = normalizeOptionalString(meta?.cliImageTurnKey);
	return {
		hasCliImageMentions: stripResult.stripped,
		...stripResult.stripped && isClaudeImport ? { cliImageTurnKey: storedImageTurnKey ?? readCliImageTurnContext(joined) } : {},
		...normalized ? { text: normalized } : {},
		...undecoratedText && !routed ? { undecoratedText } : {},
		...routed && routedBody && routedBody !== originalRoutedBody ? { cleanedRoutedKey: JSON.stringify([routed.sender, routedBody]) } : {},
		...role === "user" && (routedBody || cleanText) ? { scopedKey: JSON.stringify([routed?.sender ?? null, originalRoutedBody ?? cleanText]) } : {}
	};
}
function resolveImportedExternalIdentityKey(meta) {
	const externalId = normalizeOptionalString(meta?.externalId);
	return externalId ? JSON.stringify([
		externalId,
		normalizeOptionalString(meta?.importedFrom),
		normalizeOptionalString(meta?.cliSessionId)
	]) : void 0;
}
function createCliHistoryRow(message, id, localSeq) {
	const record = asOptionalRecord(message);
	const meta = asOptionalRecord(record?.["__openclaw"]);
	const role = record?.role === "user" || record?.role === "assistant" ? record.role : void 0;
	const comparable = record && role ? extractComparableText(record, role, localSeq === void 0) : { hasCliImageMentions: false };
	const localImage = record?.role === "user" && (readPersistedMediaFacts(record) ?? []).some(isImageMediaFact);
	const entryId = normalizeOptionalString(meta?.id);
	const serialized = JSON.stringify(message);
	return {
		id,
		local_seq: localSeq ?? null,
		import_ref: null,
		message_id: entryId === void 0 ? null : JSON.stringify(entryId),
		payload: localSeq === void 0 ? serialized : null,
		bytes: Buffer.byteLength(serialized, "utf8"),
		role: role ?? null,
		text: comparable.text === void 0 ? null : JSON.stringify([null, comparable.text]),
		undecorated_text: comparable.cleanedRoutedKey ?? (comparable.undecoratedText === void 0 ? null : JSON.stringify([null, comparable.undecoratedText])),
		routed_key: comparable.scopedKey ?? null,
		timestamp: asFiniteNumber(record?.timestamp) ?? null,
		external_key: resolveImportedExternalIdentityKey(meta) ?? null,
		image_key: localSeq === void 0 ? comparable.cliImageTurnKey ?? null : localImage ? (entryId ? hashCliImageTurnEntryId(entryId) : comparable.cliImageTurnKey) ?? null : null,
		image_mentions: comparable.hasCliImageMentions ? 1 : 0,
		metadata: meta ? JSON.stringify(meta) : null,
		consumed: 0,
		ordinal: null
	};
}
function mergeCliHistoryRow(imported, store) {
	const { matchExternal, matchImage, matchers, minimumOrder, consume } = store;
	const advance = (matched, matchedKey) => {
		const sameRoutedBody = imported.routed_key && !imported.routed_key.startsWith("[null,") && imported.routed_key === matched.routed_key;
		for (const text of /* @__PURE__ */ new Set([
			imported.text,
			matchedKey ?? (!sameRoutedBody && matched.text !== imported.text ? imported.undecorated_text : null),
			matchedKey === imported.routed_key || !matchedKey && !sameRoutedBody && matched.text !== imported.text || !imported.routed_key?.startsWith("[null,") ? imported.routed_key : null
		])) if (text) store.advanceOrderFloor({
			role: imported.role ?? "",
			text,
			minimumOrder: matched.id + 1
		});
	};
	let duplicate = imported.external_key ? matchExternal(imported.external_key) : void 0;
	let matchedKey;
	if (duplicate) {
		advance(duplicate);
		return true;
	}
	if (imported.image_mentions && imported.image_key) duplicate = matchImage(imported.image_key);
	if (!duplicate && !imported.image_mentions) {
		const importedFloor = imported.text ? minimumOrder(imported.role, imported.text) : 0;
		const routed = imported.routed_key && !imported.routed_key.startsWith("[null,");
		for (const [column, text] of [
			["text", imported.text],
			["routed_key", imported.routed_key],
			["routed_key", routed ? imported.undecorated_text : null]
		]) {
			if (!text || !imported.role) continue;
			const floor = text === imported.text ? importedFloor : Math.max(minimumOrder(imported.role, text), importedFloor);
			const match = imported.external_key ? matchers[column].withIdentity : matchers[column].withoutIdentity;
			const params = {
				role: imported.role,
				text,
				floor,
				timestamp: imported.timestamp
			};
			duplicate = imported.timestamp === null ? match.any(params) : match.window(params) ?? match.missing(params);
			if (duplicate) {
				matchedKey = text;
				break;
			}
		}
	}
	if (duplicate) {
		const meta = duplicate.metadata ? JSON.parse(duplicate.metadata) : {};
		const importedMeta = imported.metadata ? JSON.parse(imported.metadata) : {};
		let metadataChanged = false;
		for (const field of [
			"importedFrom",
			"externalId",
			"cliSessionId"
		]) {
			const value = normalizeOptionalString(importedMeta[field]);
			if (value && meta[field] === void 0) {
				meta[field] = value;
				metadataChanged = true;
			}
		}
		consume({
			id: duplicate.id,
			metadata: metadataChanged ? JSON.stringify(meta) : duplicate.metadata,
			external_key: resolveImportedExternalIdentityKey(meta) ?? null
		});
		advance(duplicate, matchedKey);
		return true;
	}
	return false;
}
function compareCliHistoryRows(a, b) {
	return a.timestamp !== null && b.timestamp !== null && a.timestamp !== b.timestamp ? a.timestamp - b.timestamp : a.id - b.id;
}
//#endregion
//#region src/gateway/cli-session-history-index-memory.ts
function addToGroup(groups, key, row) {
	const group = groups.get(key);
	if (group) group.push(row);
	else groups.set(key, [row]);
}
/** Request-owned display projection; the session actor remains the transcript owner. */
var MemoryCliSessionHistoryIndex = class {
	constructor() {
		this.messages = /* @__PURE__ */ new Map();
		this.imports = [];
		this.order = [];
		this.messageOrdinals = /* @__PURE__ */ new Map();
		this.nextLocal = 0;
		this.count = 0;
	}
	appendLocal(messages) {
		for (const { message, seq } of messages) {
			const id = seq - 1;
			this.nextLocal = Math.max(this.nextLocal, id + 1);
			if (!this.messages.has(id)) this.messages.set(id, createCliHistoryRow(message, id, seq));
		}
	}
	appendImported(message) {
		this.imports.push(createCliHistoryRow(message, this.imports.length));
	}
	finish() {
		const external = /* @__PURE__ */ new Map();
		const images = /* @__PURE__ */ new Map();
		const textGroups = {
			text: /* @__PURE__ */ new Map(),
			routed_key: /* @__PURE__ */ new Map()
		};
		const floors = /* @__PURE__ */ new Map();
		const key = (role, text) => JSON.stringify([role ?? "", text]);
		const registerExternal = (row) => {
			if (row.external_key && (external.get(row.external_key)?.id ?? -1) < row.id) external.set(row.external_key, row);
		};
		this.order = [...this.messages.values()].toSorted((a, b) => a.id - b.id);
		for (const row of this.order) {
			registerExternal(row);
			if (row.image_key) addToGroup(images, row.image_key, row);
			for (const column of ["text", "routed_key"]) {
				const text = row[column];
				if (text && row.role) addToGroup(textGroups[column], key(row.role, text), row);
			}
		}
		for (const row of this.imports) {
			const match = row.external_key ? external.get(row.external_key) : void 0;
			if (match) match.consumed = 1;
		}
		const textMatchers = (withIdentity, column) => {
			const create = (time) => (params) => {
				const candidates = textGroups[column].get(key(params.role, params.text)) ?? [];
				let start = 0;
				let end = candidates.length;
				while (start < end) {
					const middle = start + end >>> 1;
					if (candidates[middle].id < params.floor) start = middle + 1;
					else end = middle;
				}
				for (let index = start; index < candidates.length; index++) {
					const row = candidates[index];
					if (row.consumed || withIdentity && row.external_key !== null) continue;
					if (time === "missing" && row.timestamp !== null) continue;
					if (time === "window" && (row.timestamp === null || Math.abs(row.timestamp - (params.timestamp ?? 0)) > 3e5)) continue;
					return row;
				}
			};
			return {
				any: create("any"),
				window: create("window"),
				missing: create("missing")
			};
		};
		const store = {
			matchExternal: (identity) => external.get(identity),
			matchImage: (identity) => images.get(identity)?.find((row) => !row.consumed),
			matchers: {
				text: {
					withIdentity: textMatchers(true, "text"),
					withoutIdentity: textMatchers(false, "text")
				},
				routed_key: {
					withIdentity: textMatchers(true, "routed_key"),
					withoutIdentity: textMatchers(false, "routed_key")
				}
			},
			minimumOrder: (role, text) => floors.get(key(role, text)) ?? 0,
			advanceOrderFloor: ({ role, text, minimumOrder }) => {
				const identity = key(role, text);
				floors.set(identity, Math.max(floors.get(identity) ?? 0, minimumOrder));
			},
			consume: (match) => {
				const row = this.messages.get(match.id);
				Object.assign(row, match, { consumed: 1 });
				registerExternal(row);
			}
		};
		let expanded = false;
		for (const imported of this.imports) if (!mergeCliHistoryRow(imported, store)) {
			const row = {
				...imported,
				id: this.nextLocal++,
				payload: null,
				import_ref: imported.id,
				consumed: 1
			};
			this.messages.set(row.id, row);
			this.order.push(row);
			registerExternal(row);
			expanded = true;
		}
		if (expanded) this.order.sort(compareCliHistoryRows);
		this.order.forEach((row, ordinal) => {
			row.ordinal = ordinal;
			if (row.message_id && !this.messageOrdinals.has(row.message_id)) this.messageOrdinals.set(row.message_id, ordinal);
		});
		this.count = this.order.length;
	}
	get importedCount() {
		return this.imports.length;
	}
	rows(start, end) {
		return this.order.slice(Math.max(0, start), Math.max(0, end)).map(({ id, local_seq, metadata, ordinal, bytes }) => ({
			id,
			local_seq,
			metadata,
			ordinal,
			bytes
		}));
	}
	message(id) {
		const reference = this.messages.get(id)?.import_ref;
		const payload = reference == null ? void 0 : this.imports[reference]?.payload;
		return payload ? JSON.parse(payload) : void 0;
	}
	localOrdinal(seq) {
		const row = this.messages.get(seq - 1);
		return row?.local_seq === seq ? row.ordinal ?? void 0 : void 0;
	}
	ordinal(messageId) {
		return this.messageOrdinals.get(JSON.stringify(messageId));
	}
	close() {
		this.messages.clear();
		this.imports.length = 0;
		this.order.length = 0;
		this.messageOrdinals.clear();
	}
};
//#endregion
//#region src/gateway/cli-session-history-index.worker.ts
const INDEX_INSERT_BATCH_ROWS = 65;
const INDEX_ORDINAL_BATCH_ROWS = 256;
const INDEX_INSERT_BATCH_BYTES = 1048576;
/** Reconstructible display index; canonical transcript bytes are never changed. */
var CliSessionHistoryIndex = class {
	constructor() {
		this.pendingImports = [];
		this.pendingImportBytes = 0;
		this.nextLocal = 0;
		this.nextImport = 0;
		this.expanded = false;
		this.count = 0;
		this.database = openNodeSqliteDatabase("");
		this.db = getNodeSqliteKysely(this.database);
		const columns = `id INTEGER PRIMARY KEY, local_seq INTEGER, import_ref INTEGER, message_id TEXT, payload TEXT, bytes INTEGER NOT NULL, role TEXT,
      text TEXT, undecorated_text TEXT, routed_key TEXT, timestamp REAL, external_key TEXT, image_key TEXT,
      image_mentions INTEGER NOT NULL, metadata TEXT, consumed INTEGER NOT NULL,
      ordinal INTEGER`;
		this.database.exec(`PRAGMA journal_mode = OFF; PRAGMA synchronous = OFF; PRAGMA cache_size = -2048;
      CREATE TABLE messages (${columns}); CREATE TABLE imports (${columns});
      CREATE TABLE floors (role TEXT NOT NULL, text TEXT NOT NULL, minimum_order INTEGER NOT NULL, PRIMARY KEY(role,text));
      CREATE INDEX match_external ON messages(external_key, id);
      CREATE INDEX match_text ON messages(role, text, consumed, id);
      CREATE INDEX match_timed_text ON messages(role, text, consumed, id) WHERE timestamp IS NOT NULL;
      CREATE INDEX match_undated_text ON messages(role, text, consumed, id) WHERE timestamp IS NULL;
      CREATE INDEX match_routed ON messages(role, routed_key, consumed, id);
      CREATE INDEX match_image ON messages(image_key, consumed, id);
      CREATE INDEX message_identity ON messages(message_id);
      CREATE INDEX local_sequence ON messages(local_seq);
      CREATE UNIQUE INDEX history_ordinal ON messages(ordinal);`);
		enableNodeSqliteKyselyStatementCache(this.database);
		this.insertMessage = this.createInserter("messages");
		this.insertImport = this.createInserter("imports");
		this.readOrderFloor = prepareSqliteQueryTakeFirstSync(this.database, (parameter) => this.db.selectFrom("floors").select("minimum_order").where("role", "=", parameter((row) => row.role)).where("text", "=", parameter((row) => row.text)));
		this.advanceOrderFloor = prepareSqliteQuerySync(this.database, (parameter) => this.db.insertInto("floors").values({
			role: parameter((row) => row.role),
			text: parameter((row) => row.text),
			minimum_order: parameter((row) => row.minimumOrder)
		}).onConflict((conflict) => conflict.columns(["role", "text"]).doUpdateSet((eb) => ({ minimum_order: eb.fn("max", [eb.ref("floors.minimum_order"), eb.ref("excluded.minimum_order")]) }))));
		this.assignOrdinal = prepareSqliteQuerySync(this.database, (parameter) => this.db.updateTable("messages").set({ ordinal: parameter((row) => row.ordinal) }).where("id", "=", parameter((row) => row.id)));
	}
	createInserter(table) {
		return prepareSqliteQuerySync(this.database, (parameter) => {
			const query = this.db.insertInto(table).values({
				id: parameter((row) => row.id),
				local_seq: parameter((row) => row.local_seq),
				import_ref: parameter((row) => row.import_ref),
				message_id: parameter((row) => row.message_id),
				payload: parameter((row) => row.payload),
				bytes: parameter((row) => row.bytes),
				role: parameter((row) => row.role),
				text: parameter((row) => row.text),
				undecorated_text: parameter((row) => row.undecorated_text),
				routed_key: parameter((row) => row.routed_key),
				timestamp: parameter((row) => row.timestamp),
				external_key: parameter((row) => row.external_key),
				image_key: parameter((row) => row.image_key),
				image_mentions: parameter((row) => row.image_mentions),
				metadata: parameter((row) => row.metadata),
				consumed: parameter((row) => row.consumed),
				ordinal: parameter((row) => row.ordinal)
			});
			return table === "messages" ? query.onConflict((conflict) => conflict.column("id").doNothing()) : query;
		});
	}
	close() {
		this.pendingImports.length = 0;
		this.database.close();
	}
	appendLocal(messages) {
		for (let offset = 0; offset < messages.length; offset += INDEX_INSERT_BATCH_ROWS) {
			const rows = messages.slice(offset, offset + INDEX_INSERT_BATCH_ROWS).map(({ message, seq }) => {
				const id = seq - 1;
				this.nextLocal = Math.max(this.nextLocal, id + 1);
				return createCliHistoryRow(message, id, seq);
			});
			runSqliteImmediateTransactionSync(this.database, () => {
				for (const row of rows) this.insertMessage(row);
			});
		}
	}
	appendImported(message) {
		const row = createCliHistoryRow(message, this.nextImport++);
		if (this.pendingImportBytes + row.bytes > INDEX_INSERT_BATCH_BYTES) this.flushImports();
		this.pendingImports.push(row);
		this.pendingImportBytes += row.bytes;
		if (this.pendingImports.length >= INDEX_INSERT_BATCH_ROWS) this.flushImports();
	}
	flushImports() {
		if (!this.pendingImports.length) return;
		runSqliteImmediateTransactionSync(this.database, () => {
			for (const row of this.pendingImports) this.insertImport(row);
		});
		this.pendingImports.length = 0;
		this.pendingImportBytes = 0;
	}
	finish() {
		this.flushImports();
		executeSqliteQuerySync(this.database, this.db.updateTable("messages").set({ consumed: 1 }).where("id", "in", this.db.selectFrom("messages").select(({ fn }) => fn.max("id").as("id")).where("external_key", "in", this.db.selectFrom("imports").select("external_key").where("external_key", "is not", null)).groupBy("external_key")));
		const candidates = () => this.db.selectFrom("messages").select([
			"id",
			"text",
			"routed_key",
			"metadata"
		]);
		const matchExternal = prepareSqliteQueryTakeFirstSync(this.database, (parameter) => candidates().where("external_key", "=", parameter((key) => key)).orderBy("id", "desc").limit(1));
		const matchImage = prepareSqliteQueryTakeFirstSync(this.database, (parameter) => candidates().where("image_key", "=", parameter((key) => key)).where("local_seq", "is not", null).where("consumed", "=", 0).orderBy("id").limit(1));
		const textMatchers = (external, column) => {
			const create = (time) => prepareSqliteQueryTakeFirstSync(this.database, (parameter) => {
				let query = candidates().where("role", "=", parameter((row) => row.role)).where(column, "=", parameter((row) => row.text)).where("consumed", "=", 0).where("id", ">=", parameter((row) => row.floor)).orderBy("id").limit(1);
				if (external) query = query.where("external_key", "is", null);
				if (time === "window") query = query.where("timestamp", ">=", parameter((row) => (row.timestamp ?? 0) - DEDUPE_TIMESTAMP_WINDOW_MS)).where("timestamp", "<=", parameter((row) => (row.timestamp ?? 0) + DEDUPE_TIMESTAMP_WINDOW_MS));
				else if (time === "missing") query = query.where("timestamp", "is", null);
				return query;
			});
			return {
				any: create("any"),
				window: create("window"),
				missing: create("missing")
			};
		};
		const store = {
			matchExternal,
			matchImage,
			matchers: {
				text: {
					withIdentity: textMatchers(true, "text"),
					withoutIdentity: textMatchers(false, "text")
				},
				routed_key: {
					withIdentity: textMatchers(true, "routed_key"),
					withoutIdentity: textMatchers(false, "routed_key")
				}
			},
			consume: prepareSqliteQuerySync(this.database, (parameter) => this.db.updateTable("messages").set({
				metadata: parameter((row) => row.metadata),
				consumed: 1,
				external_key: parameter((row) => row.external_key)
			}).where("id", "=", parameter((row) => row.id))),
			minimumOrder: (role, text) => this.readOrderFloor({
				role: role ?? "",
				text
			})?.minimum_order ?? 0,
			advanceOrderFloor: (floor) => {
				this.advanceOrderFloor(floor);
			}
		};
		for (let offset = 0; offset < this.nextImport; offset += INDEX_INSERT_BATCH_ROWS) {
			const batch = executeSqliteQuerySync(this.database, this.db.selectFrom("imports").select([
				"id",
				"local_seq",
				"import_ref",
				"message_id",
				"bytes",
				"role",
				"text",
				"undecorated_text",
				"routed_key",
				"timestamp",
				"external_key",
				"image_key",
				"image_mentions",
				"metadata",
				"consumed",
				"ordinal"
			]).where("id", ">=", offset).orderBy("id").limit(INDEX_INSERT_BATCH_ROWS)).rows;
			runSqliteImmediateTransactionSync(this.database, () => {
				for (const imported of batch) if (!mergeCliHistoryRow(imported, store)) {
					this.insertMessage({
						...imported,
						id: this.nextLocal++,
						payload: null,
						import_ref: imported.id,
						consumed: 1
					});
					this.expanded = true;
				}
			});
		}
		const order = executeSqliteQuerySync(this.database, this.db.selectFrom("messages").select(["id", "timestamp"]).orderBy("id")).rows;
		if (this.expanded) order.sort(compareCliHistoryRows);
		for (let offset = 0; offset < order.length; offset += INDEX_ORDINAL_BATCH_ROWS) {
			const end = Math.min(order.length, offset + INDEX_ORDINAL_BATCH_ROWS);
			runSqliteImmediateTransactionSync(this.database, () => {
				for (let ordinal = offset; ordinal < end; ordinal++) this.assignOrdinal({
					id: order[ordinal].id,
					ordinal
				});
			});
		}
		this.count = order.length;
	}
	get importedCount() {
		return this.nextImport;
	}
	rows(start, end) {
		return executeSqliteQuerySync(this.database, this.db.selectFrom("messages").select([
			"id",
			"local_seq",
			"metadata",
			"ordinal",
			"bytes"
		]).where("ordinal", ">=", start).where("ordinal", "<", end).orderBy("ordinal")).rows;
	}
	message(id) {
		const row = executeSqliteQueryTakeFirstSync(this.database, this.db.selectFrom("messages").innerJoin("imports", "imports.id", "messages.import_ref").select("imports.payload").where("messages.id", "=", id));
		return row?.payload ? JSON.parse(row.payload) : void 0;
	}
	localOrdinal(seq) {
		return executeSqliteQueryTakeFirstSync(this.database, this.db.selectFrom("messages").select("ordinal").where("local_seq", "=", seq))?.ordinal ?? void 0;
	}
	ordinal(messageId) {
		return executeSqliteQueryTakeFirstSync(this.database, this.db.selectFrom("messages").select("ordinal").where("message_id", "=", JSON.stringify(messageId)).orderBy("ordinal").limit(1))?.ordinal ?? void 0;
	}
};
//#endregion
//#region src/gateway/cli-session-history.claude-snapshot.ts
const YIELD_BYTES = 262144;
const OFFTHREAD_JSONL_LINE_CHARS = 1048576;
const OVERSIZED_HISTORY_PLACEHOLDER = "[Claude CLI history record omitted from context because it exceeded 1 MiB.]";
const OVERSIZED_ENTRY_WORKER_SOURCE = `
  const { parentPort } = require("node:worker_threads");
  const boundedString = (value, max) =>
    typeof value === "string" && value.length <= max ? value : undefined;
  parentPort.on("message", (line) => {
    try {
      const entry = JSON.parse(line);
      const type = entry?.type;
      const message = entry?.message;
      if ((type !== "user" && type !== "assistant") || !message || message.role !== type) {
        parentPort.postMessage(null);
      } else {
        // An oversized tool result stays a tool result; as plain text it would render as a user turn.
        const blocks = Array.isArray(message.content) ? message.content : [];
        const toolResultsOnly = type === "user" && blocks.length > 0 &&
          blocks.every((block) => block?.type === "tool_result" && boundedString(block.tool_use_id, 1_024));
        const rawUsage = message.usage;
        const usage = rawUsage && typeof rawUsage === "object"
          ? Object.fromEntries(
              ["input_tokens", "output_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"]
                .flatMap((key) => Number.isFinite(rawUsage[key]) ? [[key, rawUsage[key]]] : []),
            )
          : undefined;
        parentPort.postMessage({
          type,
          timestamp: boundedString(entry.timestamp, 128),
          uuid: boundedString(entry.uuid, 1_024),
          isSidechain: entry.isSidechain === true,
          isMeta: entry.isMeta === true,
          isCompactSummary: entry.isCompactSummary === true,
          isVisibleInTranscriptOnly: entry.isVisibleInTranscriptOnly === true,
          message: {
            role: type,
            content: toolResultsOnly
              ? blocks.slice(0, 64).map((block) => ({
                  type: "tool_result",
                  tool_use_id: block.tool_use_id,
                  ...(block.is_error === true ? { is_error: true } : {}),
                  content: ${JSON.stringify(OVERSIZED_HISTORY_PLACEHOLDER)},
                }))
              : ${JSON.stringify(OVERSIZED_HISTORY_PLACEHOLDER)},
            model: boundedString(message.model, 256),
            stop_reason: boundedString(message.stop_reason, 128),
            usage,
          },
        });
      }
    } catch {
      parentPort.postMessage(null);
    }
  });
`;
async function decodeOversizedClaudeEntry(worker, line) {
	return await new Promise((resolve) => {
		let settled = false;
		const finish = (value) => {
			if (settled) return;
			settled = true;
			worker.off("message", finish);
			worker.off("error", fail);
			worker.off("exit", fail);
			resolve(value);
		};
		const fail = () => finish(null);
		worker.once("message", finish);
		worker.once("error", fail);
		worker.once("exit", fail);
		try {
			worker.postMessage(line, []);
		} catch {
			fail();
		}
	});
}
async function resolveClaudeCliHistorySource(params) {
	const candidate = await resolveClaudeCliSessionFilePathAsync(params);
	if (!candidate) return;
	try {
		const filePath = await fs.promises.realpath(candidate);
		const stats = await fs.promises.stat(filePath);
		const sourceFingerprint = [
			stats.dev,
			stats.ino,
			stats.size,
			stats.mtimeMs,
			stats.ctimeMs
		].join(":");
		return [
			filePath,
			JSON.stringify([
				filePath,
				sourceFingerprint,
				params.cliSessionId,
				params.localSessionId?.trim() || null,
				normalizeCliSessionReseedReceipt(params.reseedReceipt)
			]),
			stats.size
		];
	} catch {
		return;
	}
}
async function visitClaudeCliSessionMessages(filePath, params, visit, byteLength) {
	if (byteLength === 0) return;
	const messages = [];
	const toolNames = /* @__PURE__ */ new Map();
	const lines = readline.createInterface({
		input: fs.createReadStream(filePath, {
			encoding: "utf8",
			...byteLength === void 0 ? {} : { end: byteLength - 1 }
		}),
		crlfDelay: Number.POSITIVE_INFINITY
	});
	const reseedState = createClaudeReseedImportState(params);
	let bytesSinceYield = 0;
	let lineNumber = 0;
	let worker;
	try {
		for await (const line of lines) {
			lineNumber += 1;
			const oversized = line.length > OFFTHREAD_JSONL_LINE_CHARS;
			if (oversized) bytesSinceYield = 0;
			else {
				bytesSinceYield += Buffer.byteLength(line, "utf8") + 1;
				if (bytesSinceYield >= YIELD_BYTES) {
					bytesSinceYield = 0;
					await setImmediate();
				}
				if (!line.trim()) continue;
			}
			let parsedMessage = null;
			try {
				let entry;
				if (oversized) {
					if (!worker || worker.threadId === -1) {
						worker = createCpuTrackedWorker(OVERSIZED_ENTRY_WORKER_SOURCE, { eval: true });
						worker.on("error", () => {});
					}
					entry = await decodeOversizedClaudeEntry(worker, line);
				} else entry = decodeClaudeCliProjectEntry(line);
				if (!entry) continue;
				parsedMessage = parseClaudeCliHistoryEntry(entry, params.cliSessionId, lineNumber, toolNames, {
					reseedMode: "recover",
					reseedState
				});
			} catch {}
			if (parsedMessage) {
				appendCoalescedClaudeCliToolMessage(messages, parsedMessage);
				if (messages.length > 1) visit(redactClaudeCliHistoryMessage(messages.shift()));
			}
		}
	} finally {
		await worker?.terminate();
	}
	for (const message of messages) visit(redactClaudeCliHistoryMessage(message));
}
//#endregion
//#region src/gateway/cli-session-history.ts
const indexes = /* @__PURE__ */ new Map();
const MAX_INDEXES = 8;
function retire(identity) {
	const cached = indexes.get(identity);
	if (!cached) return;
	indexes.delete(identity);
	cached.release();
	cached.index.close();
}
/** Only this worker owns derived native history; requests receive selected rows. */
async function prepareCliSessionHistoryReader(params, readers) {
	if (params.ignoreCliSessionImports) return;
	const binding = getCliSessionBinding(params.entry, "claude-cli");
	if (!binding?.sessionId || !params.sessionId || !params.storePath) return;
	const readRevision = readers.readHistoryRevision;
	const revision = await readRevision?.();
	const scope = {
		agentId: params.sessionAgentId,
		sessionId: params.sessionId,
		sessionKey: params.canonicalKey,
		storePath: params.storePath,
		sessionEntry: params.entry
	};
	const provider = normalizeProviderId(params.provider ?? "");
	if (provider && provider !== "claude-cli" && provider !== "anthropic") {
		if ((await readIncrementalChatHistoryTail({
			entry: params.entry,
			readScope: scope,
			readers,
			effectiveMaxChars: params.effectiveMaxChars,
			max: params.max,
			maxBytes: params.maxHistoryBytes,
			offset: params.offset,
			readOnly: true,
			deferProfileDisplay: true,
			resolveCronJobName: () => void 0
		})).rawMessages.length) return;
	}
	const native = {
		cliSessionId: binding.sessionId,
		homeDir: params.cliHistoryHomeDir,
		localSessionId: params.sessionId,
		reseedReceipt: binding.reseedReceipt
	};
	const identity = JSON.stringify([
		params.storePath,
		params.sessionAgentId,
		params.sessionId
	]);
	const source = await resolveClaudeCliHistorySource(native);
	if (!source) {
		retire(identity);
		return;
	}
	const revisionKey = (value) => JSON.stringify([
		value.generation,
		value.indexedSeq,
		value.leafEventId
	]);
	const localRevision = revision ? revisionKey(revision) : void 0;
	const key = JSON.stringify([
		localRevision,
		source[1],
		params.entry?.sessionStartedAt
	]);
	let cached = revision?.database ? indexes.get(identity) : void 0;
	if (cached && (cached.database !== revision?.database || cached.key !== key)) {
		retire(identity);
		cached = void 0;
	}
	const assertCurrent = async () => {
		if (!revision || !readRevision) return;
		const current = await readRevision();
		if (current.database !== revision?.database || current.generation !== revision.generation) {
			if (revision?.database) retire(identity);
			throw new SessionTranscriptProjectionUnavailableError(params.sessionId, "window-changed");
		}
	};
	if (!cached) {
		const index = params.entry?.incognito === true ? new MemoryCliSessionHistoryIndex() : new CliSessionHistoryIndex();
		try {
			await visitClaudeCliSessionMessages(source[0], native, (message) => index.appendImported(message), source[2]);
			if (!index.importedCount) {
				index.close();
				return;
			}
			let beforeSeq;
			let readWindow;
			let displaySource;
			let activeSource = false;
			let leafEventId = revision?.leafEventId ?? null;
			let boundaryMessage;
			const localRow = (message) => {
				const seq = readChatHistoryMessageSeq(message);
				if (seq === void 0) throw new Error("Indexed CLI history requires a canonical source sequence");
				return {
					message,
					seq
				};
			};
			for (;;) {
				const page = await readers.readSessionMessagesPageWithStatsAsync(scope, {
					offset: 0,
					beforeSeq,
					maxMessages: 65,
					maxBytes: 1048576,
					allowOversizedFirst: true,
					allowResetArchiveFallback: true,
					readOnly: true,
					captureReadWindow: beforeSeq === void 0,
					expectedReadWindow: readWindow
				});
				await assertCurrent();
				if (page.windowReset) throw new SessionTranscriptProjectionUnavailableError(params.sessionId, "window-changed");
				if (beforeSeq === void 0) {
					readWindow = page.readWindow;
					displaySource = page.displaySource;
					activeSource = page.transcriptSource === "active";
					leafEventId = page.activeLeafEntryId ?? null;
				} else if (page.displaySource !== displaySource) throw new SessionTranscriptProjectionUnavailableError(params.sessionId, "window-changed");
				if (!page.messages.length) break;
				const oldestMessage = page.messages[0];
				const filtered = dropPreSessionStartAnnouncePairs(boundaryMessage === void 0 ? page.messages : [...page.messages, boundaryMessage], params.entry?.sessionStartedAt);
				index.appendLocal(filtered.filter((message) => message !== oldestMessage).map(localRow));
				boundaryMessage = filtered.includes(oldestMessage) ? oldestMessage : void 0;
				const oldest = readChatHistoryMessageSeq(page.messages[0]);
				if (oldest === void 0 || oldest <= 1) break;
				if (beforeSeq !== void 0 && oldest >= beforeSeq) throw new Error("CLI history index did not advance");
				beforeSeq = oldest;
				await setImmediate();
			}
			if (boundaryMessage !== void 0) index.appendLocal([localRow(boundaryMessage)]);
			const currentSource = await resolveClaudeCliHistorySource(native);
			await assertCurrent();
			index.finish();
			if (activeSource && revision?.database && currentSource?.[1] === source[1]) {
				cached = {
					database: revision?.database,
					key,
					index,
					readWindow,
					displaySource,
					leafEventId,
					release: registerNodeSqliteDisposeCallback(revision?.database, () => retire(identity))
				};
				indexes.set(identity, cached);
				while (indexes.size > MAX_INDEXES) retire(indexes.keys().next().value);
			} else cached = {
				key,
				index,
				readWindow,
				displaySource,
				leafEventId,
				release: () => {}
			};
		} catch (error) {
			index.close();
			throw error;
		}
	}
	if (cached.database) {
		indexes.delete(identity);
		indexes.set(identity, cached);
	}
	const index = cached.index;
	const indexCursorSource = createTranscriptDisplaySource([key]);
	let canonicalAnchorPage = false;
	const sequence = (message) => {
		const id = readChatHistoryMessageId(message);
		const seq = readChatHistoryMessageSeq(message);
		if (canonicalAnchorPage) return seq;
		const ordinal = id ? index.ordinal(id) : seq === void 0 ? void 0 : index.localOrdinal(seq);
		return ordinal === void 0 ? void 0 : ordinal + 1;
	};
	const readRange = async (start, end, maxBytes = Number.POSITIVE_INFINITY) => {
		const selected = index.rows(start, end);
		let bytes = 0;
		let first = selected.length;
		while (first > 0 && (first === selected.length || bytes + selected[first - 1].bytes <= maxBytes)) bytes += selected[--first].bytes;
		const window = selected.slice(first);
		const ranges = [];
		for (const row of window.filter((candidate) => candidate.local_seq !== null).toSorted((a, b) => a.local_seq - b.local_seq)) {
			const seq = row.local_seq;
			const prior = ranges.at(-1);
			if (prior && prior.end + 1 === seq && prior.end - prior.start < 64) {
				prior.end = seq;
				prior.bytes += row.bytes;
			} else ranges.push({
				start: seq,
				end: seq,
				bytes: row.bytes
			});
		}
		const localMessages = /* @__PURE__ */ new Map();
		for (const range of ranges) {
			const localPage = await readers.readSessionMessagesPageWithStatsAsync(scope, {
				offset: 0,
				beforeSeq: range.end + 1,
				maxMessages: range.end - range.start + 1,
				maxBytes: range.bytes + 1048576,
				allowOversizedFirst: true,
				allowResetArchiveFallback: true,
				readOnly: true,
				expectedReadWindow: cached.readWindow
			});
			await assertCurrent();
			if (localPage.windowReset || localPage.displaySource !== cached.displaySource) throw new SessionTranscriptProjectionUnavailableError(params.sessionId, "window-changed");
			for (const message of localPage.messages) {
				const seq = readChatHistoryMessageSeq(message);
				if (seq !== void 0) localMessages.set(seq, message);
			}
		}
		const messages = [];
		for (const row of window) {
			const message = row.local_seq === null ? cleanClaudeCliImportedUserDisplay(index.message(row.id)) : localMessages.get(row.local_seq);
			const record = asOptionalRecord(message);
			if (!record) throw new SessionTranscriptProjectionUnavailableError(params.sessionId, "window-changed");
			messages.push({
				...record,
				...row.metadata ? { __openclaw: JSON.parse(row.metadata) } : {}
			});
		}
		await assertCurrent();
		return messages;
	};
	const page = async (options) => {
		const end = resolveTranscriptPageEnd(index.count, options);
		const start = Math.max(0, end - Math.max(1, options.maxMessages));
		return {
			messages: await readRange(start, end, options.maxBytes),
			totalMessages: index.count,
			activeLeafEntryId: cached.leafEventId,
			transcriptSource: "active",
			displaySource: key,
			readWindow: {
				source: key,
				latestResetRawSeq: null
			}
		};
	};
	const readIndexedMessage = async (readScope, messageId, options) => {
		const ordinal = index.ordinal(messageId);
		if (ordinal === void 0) return {
			found: false,
			oversized: false
		};
		const [message] = await readRange(ordinal, ordinal + 1, options?.maxBytes);
		const precedingMessage = options?.historyVisibility && ordinal > 0 && isPreSessionStartAssistantMessage(message, options.historyVisibility.sessionStartedAt) ? (await readRange(ordinal - 1, ordinal))[0] : void 0;
		return filterSessionMessageHistoryVisibility({
			found: message !== void 0,
			oversized: false,
			message,
			seq: ordinal + 1,
			historyContext: {
				displaySource: key,
				precedingMessage
			}
		}, readScope, messageId, options?.historyVisibility, prepared.readers);
	};
	const prepared = {
		readIndexedMessage,
		dispose: () => {
			if (!cached.database) index.close();
		},
		sequence,
		applyPagination(historyPage) {
			const pagination = historyPage.pagination ?? historyPage.anchor;
			if (pagination) pagination.messageSequences = Object.fromEntries(historyPage.messages.flatMap((message) => {
				const id = readChatHistoryPaginationKey(message);
				const seq = sequence(message);
				return id && seq !== void 0 ? [[id, seq]] : [];
			}));
		},
		readers: {
			...readers,
			readRecentSessionMessagesWithStatsAsync: async (_scope, options) => page({
				...options,
				offset: 0
			}),
			readSessionMessagesPageWithStatsAsync: async (_scope, options) => page(options),
			readSessionMessagesAroundIdWithStatsAsync: async (anchorScope, options) => {
				const ordinal = index.ordinal(options.messageId);
				if (ordinal === void 0 || canonicalAnchorPage || params.pageCursor !== void 0 && params.pageCursor.source !== indexCursorSource) {
					canonicalAnchorPage = true;
					return await readers.readSessionMessagesAroundIdWithStatsAsync(anchorScope, options);
				}
				const range = resolveHistoryAnchorPageRange(index.count, ordinal, options);
				return {
					messages: await readRange(range.readStart, range.endExclusive, options.maxBytes),
					totalMessages: index.count,
					found: true,
					offset: range.offset,
					hasOverreadContext: range.hasOverreadContext,
					displaySource: key
				};
			}
		}
	};
	prepared.readers.readSessionMessageByIdAsync = (...args) => readCanonicalOrImportedMessage(readers, args, () => readIndexedMessage(...args));
	return prepared;
}
async function readCanonicalOrImportedMessage(readers, args, readImported) {
	const local = await readers.readSessionMessageByIdAsync(...args);
	return local.found || local.historyHidden ? local : readImported(local);
}
/** Canonical IDs retain archive access; imported-only IDs use the page owner's admitted index. */
async function readChatHistoryMessageFromReaders(params, readers) {
	const scope = {
		agentId: params.sessionAgentId,
		sessionId: params.sessionId,
		sessionKey: params.canonicalKey,
		storePath: params.storePath,
		sessionEntry: params.entry
	};
	const options = {
		allowResetArchiveFallback: true,
		historyVisibility: { sessionStartedAt: params.entry?.sessionStartedAt }
	};
	return readCanonicalOrImportedMessage(readers, [
		scope,
		params.messageId,
		options
	], async (missing) => {
		const cli = await prepareCliSessionHistoryReader(params, readers);
		try {
			return cli ? await cli.readIndexedMessage(scope, params.messageId, options) : missing;
		} finally {
			cli?.dispose();
		}
	});
}
//#endregion
export { prepareCliSessionHistoryReader, readChatHistoryMessageFromReaders };
