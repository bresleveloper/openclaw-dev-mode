import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, c as prepareSqliteQuerySync, i as executeSqliteQueryTakeFirstSync, l as prepareSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { c as registerNodeSqliteDisposeCallback, r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { n as createCpuTrackedWorker } from "./worker-cpu-DU6Cf6Aq.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as normalizeCliSessionReseedReceipt, r as getCliSessionBinding } from "./cli-session-binding-CMk8AbZT.mjs";
import { d as readPersistedMediaFacts, o as isImageMediaFact } from "./media-facts-CJdQ4R61.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { i as stripInboundMetadata } from "./strip-inbound-meta-BWIgBUDF.mjs";
import { b as withTranscriptRedactionSnapshot } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import { u as stripInlineDirectiveTagsForDisplay } from "./directive-tags-CHfxUaYi.mjs";
import { n as resolveTranscriptPageEnd, t as resolveHistoryAnchorPageRange } from "./transcript-anchor-page-VHli4oQ1.mjs";
import { r as isOpenClawCliImageCachePath } from "./images.media-refs-BF5D5dWC.mjs";
import { r as dropPreSessionStartAnnouncePairs } from "./chat-display-projection.history-C7mOEuaq.mjs";
import { n as hashCliImageTurnEntryId, r as readCliImageTurnContext } from "./cli-image-turn-correlation-BVXO9f3I.mjs";
import { a as parseClaudeCliHistoryEntry, d as readRoutedPromptView, f as stripCliPromptDecorations, i as decodeClaudeCliProjectEntry, n as cleanClaudeCliImportedUserDisplay, r as createClaudeReseedImportState, s as redactClaudeCliHistoryMessage, t as appendCoalescedClaudeCliToolMessage, u as resolveClaudeCliSessionFilePathAsync } from "./cli-session-history.claude-CNMg7OUG.mjs";
import { i as readChatHistoryPaginationKey, n as readChatHistoryMessageId, o as readIncrementalChatHistoryTail, r as readChatHistoryMessageSeq } from "./session-history-tail-B4XoDl5j.mjs";
import fs from "node:fs";
import { setImmediate } from "node:timers/promises";
import readline from "node:readline";
//#region src/gateway/cli-session-history-index.worker.ts
const INDEX_INSERT_BATCH_ROWS = 65;
const INDEX_ORDINAL_BATCH_ROWS = 256;
const INDEX_INSERT_BATCH_BYTES = 1048576;
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
function isClaudeCliImportedUserMessage(message, role) {
	if (role !== "user") return false;
	const meta = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"]);
	return normalizeOptionalString(meta?.importedFrom) === "claude-cli";
}
function extractComparableText(record, role) {
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
	const isClaudeImport = isClaudeCliImportedUserMessage(record, role);
	const stripResult = isClaudeImport ? stripTrailingCliImageMentions(joined) : {
		text: joined,
		stripped: false
	};
	const normalizeText = (value) => {
		return stripInlineDirectiveTagsForDisplay(role === "user" ? stripInboundMetadata(value) : value).text.replace(/\s+/g, " ").trim();
	};
	const normalized = normalizeText(stripResult.text);
	const withoutDecorations = isClaudeImport ? stripCliPromptDecorations(rawText) : rawText;
	const undecoratedText = withoutDecorations !== rawText ? normalizeText(stripTrailingCliImageMentions(withoutDecorations.trim()).text) : void 0;
	const meta = asOptionalRecord(record["__openclaw"]);
	const routed = role === "user" ? readRoutedPromptView(record.provenance, joined, isClaudeImport) : void 0;
	const routedBody = routed && normalizeText(isClaudeImport ? stripTrailingCliImageMentions(routed.body.trim()).text : routed.body);
	const storedImageTurnKey = normalizeOptionalString(meta?.cliImageTurnKey);
	return {
		hasCliImageMentions: stripResult.stripped,
		...stripResult.stripped && isClaudeImport ? { cliImageTurnKey: storedImageTurnKey ?? readCliImageTurnContext(joined) } : {},
		...normalized ? { text: normalized } : {},
		...undecoratedText ? { undecoratedText } : {},
		...routed && routedBody ? { routedKey: JSON.stringify([routed.sender, routedBody]) } : {}
	};
}
function prepareComparableMessage(record, externalIdentityKey) {
	const role = readStringValue(record.role);
	const comparableText = extractComparableText(record, role);
	return {
		externalIdentityKey,
		hasCliImageMentions: comparableText.hasCliImageMentions,
		...comparableText.cliImageTurnKey ? { cliImageTurnKey: comparableText.cliImageTurnKey } : {},
		role,
		text: comparableText.text,
		undecoratedText: comparableText.undecoratedText,
		routedKey: comparableText.routedKey,
		timestamp: asFiniteNumber(record.timestamp)
	};
}
function resolveImportedExternalIdentityKey(message) {
	const meta = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"]);
	const externalId = normalizeOptionalString(meta?.externalId);
	return externalId ? JSON.stringify([
		externalId,
		normalizeOptionalString(meta?.importedFrom),
		normalizeOptionalString(meta?.cliSessionId)
	]) : void 0;
}
/** Reconstructible display index; canonical transcript bytes are never changed. */
var CliSessionHistoryIndex = class {
	constructor(memoryOnly = false) {
		this.pendingImports = [];
		this.pendingImportBytes = 0;
		this.nextLocal = 0;
		this.nextImport = 0;
		this.expanded = false;
		this.count = 0;
		this.database = openNodeSqliteDatabase(memoryOnly ? ":memory:" : "");
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
	row(message, id, localSeq) {
		const record = asOptionalRecord(message);
		const meta = asOptionalRecord(record?.["__openclaw"]);
		const externalIdentityKey = resolveImportedExternalIdentityKey(message);
		const comparable = record?.role === "user" || record?.role === "assistant" ? prepareComparableMessage(record, externalIdentityKey) : {
			hasCliImageMentions: false,
			externalIdentityKey,
			timestamp: asFiniteNumber(record?.timestamp)
		};
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
			role: comparable.role ?? null,
			text: comparable.text === void 0 ? null : JSON.stringify(comparable.text),
			undecorated_text: comparable.undecoratedText === void 0 ? null : JSON.stringify(comparable.undecoratedText),
			routed_key: comparable.routedKey ?? null,
			timestamp: comparable.timestamp ?? null,
			external_key: comparable.externalIdentityKey ?? null,
			image_key: localSeq === void 0 ? comparable.cliImageTurnKey ?? null : localImage ? (entryId ? hashCliImageTurnEntryId(entryId) : comparable.cliImageTurnKey) ?? null : null,
			image_mentions: comparable.hasCliImageMentions ? 1 : 0,
			metadata: meta ? JSON.stringify(meta) : null,
			consumed: 0,
			ordinal: null
		};
	}
	appendLocal(messages) {
		for (let offset = 0; offset < messages.length; offset += INDEX_INSERT_BATCH_ROWS) {
			const rows = messages.slice(offset, offset + INDEX_INSERT_BATCH_ROWS).map(({ message, seq }) => {
				const id = seq - 1;
				this.nextLocal = Math.max(this.nextLocal, id + 1);
				return this.row(message, id, seq);
			});
			runSqliteImmediateTransactionSync(this.database, () => {
				for (const row of rows) this.insertMessage(row);
			});
		}
	}
	appendImported(message) {
		const row = this.row(message, this.nextImport++);
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
		const matchers = {
			text: {
				withIdentity: textMatchers(true, "text"),
				withoutIdentity: textMatchers(false, "text")
			},
			routed_key: {
				withIdentity: textMatchers(true, "routed_key"),
				withoutIdentity: textMatchers(false, "routed_key")
			}
		};
		const consume = prepareSqliteQuerySync(this.database, (parameter) => this.db.updateTable("messages").set({
			metadata: parameter((row) => row.metadata),
			consumed: 1,
			external_key: parameter((row) => row.external_key)
		}).where("id", "=", parameter((row) => row.id)));
		const minimumOrder = (role, text) => this.readOrderFloor({
			role: role ?? "",
			text
		})?.minimum_order ?? 0;
		const advance = (imported, matched) => {
			for (const text of /* @__PURE__ */ new Set([
				imported.text,
				matched.text === imported.text ? imported.text : imported.undecorated_text,
				imported.routed_key
			])) if (text) this.advanceOrderFloor({
				role: imported.role ?? "",
				text,
				minimumOrder: matched.id + 1
			});
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
				for (const imported of batch) {
					let duplicate = imported.external_key ? matchExternal(imported.external_key) : void 0;
					if (duplicate) {
						advance(imported, duplicate);
						continue;
					}
					if (imported.image_mentions && imported.image_key) duplicate = matchImage(imported.image_key);
					if (!duplicate && !imported.image_mentions) {
						const importedFloor = imported.text ? minimumOrder(imported.role, imported.text) : 0;
						for (const [column, text] of [
							["text", imported.text],
							["text", imported.undecorated_text],
							["routed_key", imported.routed_key]
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
							if (duplicate) break;
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
							external_key: resolveImportedExternalIdentityKey({ __openclaw: meta }) ?? null
						});
						advance(imported, duplicate);
					} else {
						this.insertMessage({
							...imported,
							id: this.nextLocal++,
							payload: null,
							import_ref: imported.id,
							consumed: 1
						});
						this.expanded = true;
					}
				}
			});
		}
		const order = executeSqliteQuerySync(this.database, this.db.selectFrom("messages").select(["id", "timestamp"]).orderBy("id")).rows;
		if (this.expanded) order.sort((a, b) => a.timestamp !== null && b.timestamp !== null && a.timestamp !== b.timestamp ? a.timestamp - b.timestamp : a.id - b.id);
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
function fingerprint(stats) {
	return [
		stats.dev,
		stats.ino,
		stats.size,
		stats.mtimeMs,
		stats.ctimeMs
	].join(":");
}
async function resolveClaudeCliHistorySource(params) {
	const candidate = await resolveClaudeCliSessionFilePathAsync(params);
	if (!candidate) return;
	try {
		const filePath = await fs.promises.realpath(candidate);
		const stats = await fs.promises.stat(filePath);
		const sourceFingerprint = fingerprint(stats);
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
			deferProfileDisplay: true
		})).rawMessages.length) return;
	}
	const redaction = params.cliHistoryRedaction;
	if (!redaction) throw new Error("CLI history requires prepared transcript redaction");
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
		params.entry?.sessionStartedAt,
		redaction.policyToken
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
		const index = new CliSessionHistoryIndex(!revision?.database);
		try {
			await withTranscriptRedactionSnapshot(redaction, () => visitClaudeCliSessionMessages(source[0], native, (message) => index.appendImported(message), source[2]));
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
	const sequence = (message) => {
		const id = readChatHistoryMessageId(message);
		const seq = readChatHistoryMessageSeq(message);
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
	return {
		dispose: () => {
			if (!cached.database) index.close();
		},
		sequence,
		applyPagination(historyPage) {
			if (historyPage.pagination) historyPage.pagination.messageSequences = Object.fromEntries(historyPage.messages.flatMap((message) => {
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
			readSessionMessagesAroundIdWithStatsAsync: async (_scope, options) => {
				const ordinal = index.ordinal(options.messageId);
				const range = ordinal === void 0 ? void 0 : resolveHistoryAnchorPageRange(index.count, ordinal, options);
				return {
					messages: range ? await readRange(range.readStart, range.endExclusive, options.maxBytes) : [],
					totalMessages: index.count,
					found: Boolean(range),
					offset: range?.offset ?? 0,
					hasOverreadContext: range?.hasOverreadContext ?? false,
					displaySource: key
				};
			}
		}
	};
}
//#endregion
export { prepareCliSessionHistoryReader };
