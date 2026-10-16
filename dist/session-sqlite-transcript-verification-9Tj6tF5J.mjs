import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as readFileDescriptorBoundedSync } from "./boundary-file-read-CCth2Hwg.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { i as executeSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { p as createPrivateSqliteTempDirectorySync } from "./sqlite-snapshot-staging-BIgaAYlp.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { T as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { o as tryResolveDefaultAgentId } from "./agent-roster-BXD1uMJD.mjs";
import { a as isPrimarySessionTranscriptFileName } from "./artifacts-BvSTVPj-.mjs";
import { s as resolveSessionFilePathCore } from "./paths-dpReqUI8.mjs";
import { w as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./openclaw-state-db-D1jWDzK3.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { y as isLegacyCodexProviderId } from "./codex-route-model-ref-CA8y5Vff.mjs";
import { c as hasInternalRuntimeContext, g as stripInternalRuntimeContext } from "./internal-runtime-context-CAWYwg4i.mjs";
import { s as transcriptEventJsonSql, x as isIndexedSessionEntry } from "./transcript-payload-Yc_w8Yx5.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { c as scanSessionTranscriptNavigation, i as mergeSessionTranscriptTreePaths, l as scanSessionTranscriptTree, n as isSessionTranscriptLeafControl, p as selectSessionTranscriptTreePathNodes, t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-CaYJo8Xs.mjs";
import { t as projectTranscriptNavigationFields } from "./transcript-navigation-fields-BLtx25WG.mjs";
import { o as assertSupportedSessionStoreEntry } from "./store-entry-shape-BzuAi3ao.mjs";
import { s as resolveStoredSessionOwnerAgentId } from "./session-store-key-Ci099tm9.mjs";
import "./session-manager-codec-Dl5j6GJ-.mjs";
import { l as readTranscriptFingerprint, n as createTranscriptEventReader } from "./session-sqlite-migration-readers-D3juTq9n.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { hash } from "node:crypto";
//#region src/config/sessions/legacy-store-inspection.ts
function listLegacySessionTranscriptFiles(directory) {
	if (!fs.existsSync(directory)) return [];
	return fs.readdirSync(directory, { withFileTypes: true }).filter((item) => item.isFile() && isPrimarySessionTranscriptFileName(item.name)).map((item) => path.join(directory, item.name));
}
function readLegacySessionStoreEntries(target, issues, options = {}) {
	const openFlags = process.platform === "win32" ? "r" : fs.constants.O_RDONLY | fs.constants.O_NONBLOCK;
	let fd;
	try {
		fd = fs.openSync(options.sourcePath ?? target.storePath, openFlags);
	} catch (err) {
		if (options.allowMissingStore === true && hasErrnoCode(err, "ENOENT")) {
			try {
				if (!fs.statSync(path.dirname(target.storePath)).isDirectory()) issues.push({
					code: "store_unreadable",
					message: `${target.storePath}: parent path is not a directory`
				});
			} catch (parentErr) {
				if (!hasErrnoCode(parentErr, "ENOENT")) issues.push({
					code: "store_unreadable",
					message: `${target.storePath}: ${String(parentErr)}`
				});
			}
			return { entries: [] };
		}
		issues.push({
			code: "store_unreadable",
			message: `${target.storePath}: ${String(err)}`
		});
		return { entries: [] };
	}
	try {
		let parsed;
		let raw;
		try {
			const storeStat = fs.fstatSync(fd);
			if (!storeStat.isFile()) {
				issues.push({
					code: "store_unreadable",
					message: `${target.storePath}: not a regular file`
				});
				return { entries: [] };
			}
			raw = readFileDescriptorBoundedSync(fd, storeStat.size);
			parsed = JSON.parse(raw.toString("utf-8"));
		} catch (err) {
			issues.push({
				code: "store_unreadable",
				message: `${target.storePath}: ${String(err)}`
			});
			return { entries: [] };
		}
		if (!isRecord(parsed)) {
			issues.push({
				code: "store_not_object",
				message: `${target.storePath} does not contain an object session store.`
			});
			return { entries: [] };
		}
		const entries = [];
		for (const [sessionKey, value] of Object.entries(parsed)) {
			assertSupportedSessionStoreEntry(value);
			if (!isSessionEntry(value)) {
				issues.push({
					code: "entry_invalid",
					message: `${target.storePath}: session entry is missing a valid sessionId; skipped while preserving the original index for recovery.`,
					sessionKey
				});
				continue;
			}
			entries.push({
				entry: value,
				sessionKey
			});
		}
		return {
			entries,
			bytes: raw
		};
	} finally {
		fs.closeSync(fd);
	}
}
function isLegacySessionRecordOwnedByTarget(cfg, target, sessionKey) {
	if (target.sqlitePath) {
		const ownerAgentId = parseAgentSessionKey(sessionKey)?.agentId ?? cfg.agents?.defaults?.sessionStore?.agentId?.trim() ?? tryResolveLegacyCompatibilityAgentId(cfg);
		return ownerAgentId ? normalizeAgentId(ownerAgentId) === normalizeAgentId(target.agentId) : false;
	}
	const ownerAgentId = resolveStoredSessionOwnerAgentId({
		cfg,
		agentId: target.agentId,
		sessionKey
	});
	return ownerAgentId ? ownerAgentId === target.agentId : target.agentId === tryResolveDefaultAgentId(cfg);
}
function shouldFilterLegacySessionRecordsByTarget(target) {
	return !resolveUnsuffixedSqliteTargetFromSessionStorePath(target.storePath).agentId;
}
function resolveLegacyTranscriptPaths(target, entry, verifiedSourcePaths) {
	const legacySessionFile = typeof entry.sessionFile === "string" ? entry.sessionFile : void 0;
	if (parseSqliteSessionFileMarker(legacySessionFile)) return {
		transcriptCandidates: [],
		transcriptDependencies: []
	};
	const sessionsDir = path.dirname(target.storePath);
	const relocatedPath = legacySessionFile?.trim() ? path.join(sessionsDir, path.basename(legacySessionFile)) : void 0;
	let defaultPath;
	try {
		defaultPath = resolveSessionFilePathCore(entry.sessionId, entry, {
			agentId: target.agentId,
			sessionsDir
		});
	} catch (error) {
		if (!relocatedPath) throw error;
		defaultPath = relocatedPath;
	}
	const transcriptPaths = relocatedPath ? [defaultPath, relocatedPath] : [defaultPath];
	return {
		transcriptPath: transcriptPaths.find((file) => verifiedSourcePaths?.has(path.resolve(file))) ?? transcriptPaths.find((file) => fs.existsSync(file)) ?? (relocatedPath ? defaultPath : void 0),
		transcriptCandidates: transcriptPaths,
		transcriptDependencies: transcriptPaths.map((file) => path.join(sessionsDir, path.basename(file)))
	};
}
function isSessionEntry(value) {
	return isRecord(value) && typeof value.sessionId === "string" && value.sessionId.trim() !== "";
}
//#endregion
//#region src/config/sessions/legacy-transcript-repair.ts
/** Legacy transcript classification and provider repair shared by Doctor and its import spool. */
const OPENAI_PROVIDER_ID = "openai";
const LEGACY_OPENAI_CODEX_RESPONSES_API = "openai-codex-responses";
const OPENAI_CHATGPT_RESPONSES_API = "openai-chatgpt-responses";
function getEntryId(entry) {
	return typeof entry.id === "string" && entry.id.trim() ? entry.id : null;
}
function getParentId(entry) {
	return typeof entry.parentId === "string" && entry.parentId.trim() ? entry.parentId : null;
}
function getMessage(entry) {
	return isRecord(entry.message) ? entry.message : null;
}
function withSelectedParent(entry, parentId) {
	return entry.parentId === parentId ? entry : {
		...entry,
		parentId
	};
}
function normalizeLegacyOpenAICodexTranscriptMetadata(entries) {
	let changed = 0;
	for (const entry of entries) {
		const message = getMessage(entry);
		if (!message) continue;
		let touched = false;
		if (isLegacyCodexProviderId(message.provider)) {
			message.provider = OPENAI_PROVIDER_ID;
			touched = true;
		}
		if (message.api === LEGACY_OPENAI_CODEX_RESPONSES_API) {
			message.api = OPENAI_CHATGPT_RESPONSES_API;
			touched = true;
		}
		if (touched) changed += 1;
	}
	return changed;
}
function textFromContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return null;
	return content.map((part) => isRecord(part) && typeof part.text === "string" ? part.text : "").join("") || null;
}
function selectActivePath(entries) {
	const sessionEntries = entries.filter((entry) => entry.type !== "session");
	const tree = scanSessionTranscriptTree(sessionEntries);
	if (!tree.hasExplicitLeafUpdate) {
		const byId = /* @__PURE__ */ new Map();
		for (const entry of sessionEntries) {
			const id = getEntryId(entry);
			if (id) byId.set(id, entry);
		}
		const active = [];
		const seen = /* @__PURE__ */ new Set();
		let current = sessionEntries.at(-1);
		while (current) {
			const id = getEntryId(current);
			if (!id || seen.has(id)) return null;
			seen.add(id);
			active.unshift(current);
			const parentId = getParentId(current);
			current = parentId ? byId.get(parentId) : void 0;
		}
		return active.length > 0 ? { entries: active } : null;
	}
	if (!tree.hasLeafUpdate) return null;
	const visiblePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	return { entries: mergeSessionTranscriptTreePaths([visiblePath]).map((node) => withSelectedParent(node.entry, node.selectedParentId)) };
}
function hasBrokenPromptRewriteBranch(entries, activePath) {
	const activeIds = new Set(activePath.map(getEntryId).filter((id) => Boolean(id)));
	const keys = new Set(activePath.map((entry) => transcriptRepairUserKey(entry, false)).filter((key) => key !== void 0));
	return entries.some((entry) => !activeIds.has(getEntryId(entry) ?? "") && keys.has(transcriptRepairUserKey(entry, true) ?? ""));
}
function transcriptRepairUserKey(entry, strip) {
	const message = getMessage(entry);
	if (!getEntryId(entry) || message?.role !== "user") return;
	const text = textFromContent(message.content);
	if (text === null || strip && !hasInternalRuntimeContext(text)) return;
	const visible = (strip ? stripInternalRuntimeContext(text) : text).trim();
	return visible ? `${getParentId(entry) ?? ""}\0${visible}` : void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-import-stage.ts
function withSqliteSessionImportStage(run) {
	const directory = createPrivateSqliteTempDirectorySync(os.tmpdir(), "openclaw-session-import-");
	let database;
	try {
		const filename = path.join(directory, "transcripts.sqlite");
		fs.closeSync(fs.openSync(filename, "wx", 384));
		database = openNodeSqliteDatabase(filename);
		database.exec(`
      PRAGMA cache_size = -2048;
      PRAGMA temp_store = FILE;
      CREATE TABLE rows (
        source INTEGER NOT NULL, seq INTEGER NOT NULL, event_json TEXT NOT NULL,
        PRIMARY KEY (source, seq)
      ) WITHOUT ROWID;
      CREATE TABLE seen (hash BLOB NOT NULL, event_json TEXT NOT NULL);
      CREATE INDEX seen_hash ON seen(hash);
      CREATE TABLE tree (id TEXT PRIMARY KEY, node_json TEXT NOT NULL) WITHOUT ROWID;
      CREATE TABLE tree_sets (kind TEXT NOT NULL, id TEXT NOT NULL, PRIMARY KEY(kind, id)) WITHOUT ROWID;
      CREATE TABLE selected (id TEXT PRIMARY KEY, seq INTEGER NOT NULL, parent_id TEXT, visible INTEGER NOT NULL) WITHOUT ROWID;
      CREATE TABLE user_keys (id TEXT PRIMARY KEY, visible_key TEXT, stripped_key TEXT) WITHOUT ROWID;
      CREATE INDEX user_keys_visible ON user_keys(visible_key);
      BEGIN;
    `);
		return run(new SqliteSessionImportStage(database));
	} finally {
		try {
			database?.close();
		} finally {
			fs.rmSync(directory, {
				recursive: true,
				force: true
			});
		}
	}
}
var SqliteSessionImportStage = class {
	constructor(database) {
		this.database = database;
		this.rejected = false;
		this.insert = database.prepare("INSERT INTO rows VALUES (?, ?, ?)");
		this.read = database.prepare("SELECT seq, event_json AS eventJson FROM rows WHERE source = ? ORDER BY seq");
		this.findSeen = database.prepare("SELECT 1 FROM seen WHERE hash = ? AND event_json = ? LIMIT 1");
		this.insertSeen = database.prepare("INSERT INTO seen VALUES (?, ?)");
	}
	append(source, seq, eventJson) {
		this.insert.run(source, seq, eventJson);
	}
	rows(source) {
		return this.read.iterate(source);
	}
	resetSeen() {
		this.database.exec("DELETE FROM seen");
		this.rejected = false;
	}
	*iterateUnseenEvents(source) {
		for (const row of this.rows(source)) {
			const eventHash = hash("sha256", row.eventJson, "buffer");
			if (this.findSeen.get(eventHash, row.eventJson) !== void 0) continue;
			if (yield JSON.parse(row.eventJson)) this.insertSeen.run(eventHash, row.eventJson);
			else this.rejected = true;
		}
	}
	contains(eventJson) {
		return this.findSeen.get(hash("sha256", eventJson, "buffer"), eventJson) !== void 0;
	}
	get complete() {
		return !this.rejected;
	}
	addSeen(eventJson) {
		this.insertSeen.run(hash("sha256", eventJson, "buffer"), eventJson);
	}
	/** Plan branch repair on disk; only one transcript payload is decoded at a time. */
	repairLegacyTranscript(source) {
		this.database.exec("DELETE FROM tree; DELETE FROM tree_sets; DELETE FROM selected; DELETE FROM user_keys;");
		const put = this.database.prepare("INSERT OR REPLACE INTO tree VALUES (?, ?)");
		const get = this.database.prepare("SELECT node_json FROM tree WHERE id = ?");
		const lookup = (id) => {
			const row = get.get(id);
			return row ? JSON.parse(String(row.node_json)) : void 0;
		};
		const setInsert = this.database.prepare("INSERT OR IGNORE INTO tree_sets VALUES (?, ?)");
		const setHas = this.database.prepare("SELECT 1 FROM tree_sets WHERE kind = ? AND id = ?");
		const setClear = this.database.prepare("DELETE FROM tree_sets WHERE kind = ?");
		const diskSet = (kind) => ({
			add: (id) => {
				setInsert.run(kind, id);
			},
			has: (id) => setHas.get(kind, id) !== void 0,
			clear: () => {
				setClear.run(kind);
			}
		});
		const repeatedRows = diskSet("repeated");
		const user = this.database.prepare("INSERT OR REPLACE INTO user_keys VALUES (?, ?, ?)");
		const readRow = this.database.prepare("SELECT event_json FROM rows WHERE source = ? AND seq = ?");
		const update = this.database.prepare("UPDATE rows SET event_json = ? WHERE source = ? AND seq = ?");
		const normalizedRows = diskSet("normalized");
		const storedEventJson = (seq) => {
			const row = readRow.get(source, seq);
			if (!row) return;
			const eventJson = String(row.event_json);
			if (!normalizedRows.has(String(seq))) return eventJson;
			const entry = JSON.parse(eventJson);
			if (!isRecord(entry)) return eventJson;
			normalizeLegacyOpenAICodexTranscriptMetadata([entry]);
			return JSON.stringify(entry);
		};
		let changed = false;
		let recognized = true;
		let headerSeq;
		let lastEntry;
		let terminalControl;
		const rows = this.rows(source);
		function* entries() {
			for (const row of rows) {
				const entry = JSON.parse(row.eventJson);
				let eventJson = row.eventJson;
				if (!isRecord(entry)) {
					recognized = false;
					continue;
				}
				if (normalizeLegacyOpenAICodexTranscriptMetadata([entry]) > 0) {
					eventJson = JSON.stringify(entry);
					normalizedRows.add(String(row.seq));
					changed = true;
				}
				if (entry.type === "session") {
					if (headerSeq !== void 0 || typeof entry.id !== "string") recognized = false;
					headerSeq ??= row.seq;
					continue;
				}
				const visibleKey = transcriptRepairUserKey(entry, false);
				const strippedKey = transcriptRepairUserKey(entry, true);
				if (typeof entry.id === "string" && (visibleKey || strippedKey)) user.run(entry.id, visibleKey?.slice(visibleKey.indexOf("\0") + 1) ?? null, strippedKey ?? null);
				const indexed = isIndexedSessionEntry(entry);
				const leafControl = isSessionTranscriptLeafControl(entry);
				if (!indexed && !leafControl) recognized = false;
				if (typeof entry.id === "string" && (indexed || leafControl)) {
					const previous = lookup(entry.id);
					if (previous) {
						if (storedEventJson(Number(previous.entry.importSeq)) === eventJson) {
							repeatedRows.add(String(row.seq));
							changed = true;
							continue;
						}
					}
				}
				const navigation = projectTranscriptNavigationFields(entry);
				lastEntry = navigation;
				yield {
					...navigation,
					importSeq: row.seq
				};
			}
		}
		const navigation = scanSessionTranscriptNavigation(entries(), {
			byId: {
				get: lookup,
				has: (id) => get.get(id) !== void 0,
				set: (id, node) => {
					if (get.get(id)) recognized = false;
					put.run(id, JSON.stringify(node));
				}
			},
			addNode: (node) => {
				if (node.leafId !== void 0) terminalControl = isSessionTranscriptLeafControl(node.entry) ? node : void 0;
			},
			resetDescendantIds: diskSet("reset"),
			invalidLeafControlIds: diskSet("invalid")
		});
		for (const pending of this.database.prepare("SELECT id FROM tree_sets WHERE kind = 'normalized'").iterate()) {
			const seq = Number(pending.id);
			const eventJson = storedEventJson(seq);
			if (eventJson !== void 0) update.run(eventJson, source, seq);
		}
		this.database.prepare(`DELETE FROM rows WHERE source = ? AND CAST(seq AS TEXT) IN (
          SELECT id FROM tree_sets WHERE kind = 'repeated'
        )`).run(source);
		const select = this.database.prepare("INSERT OR REPLACE INTO selected VALUES (?, ?, ?, ?)");
		const selected = this.database.prepare("SELECT 1 FROM selected WHERE id = ?");
		const walk = (leaf, visible) => {
			const seen = diskSet("walk");
			seen.clear();
			let id = leaf;
			let child;
			while (id !== null) {
				if (seen.has(id)) return false;
				seen.add(id);
				const node = lookup(id);
				if (!node) {
					recognized = false;
					break;
				}
				if (!visible && (selected.get(id) || isCanonicalSessionTranscriptEntry(node.entry))) break;
				if (!isSessionTranscriptLeafControl(node.entry)) {
					if (child) select.run(child.id, Number(child.entry.importSeq), node.id, visible ? 1 : 0);
					child = node;
				}
				id = navigation.hasExplicitLeafUpdate ? node.parentId : typeof node.entry.parentId === "string" && node.entry.parentId.trim() ? node.entry.parentId : null;
			}
			if (child) select.run(child.id, Number(child.entry.importSeq), visible ? null : navigation.leafId, visible ? 1 : 0);
			return true;
		};
		const valid = walk(navigation.hasExplicitLeafUpdate ? navigation.leafId : typeof lastEntry?.id === "string" ? lastEntry.id : null, true);
		if (valid && this.database.prepare(`
      SELECT 1 FROM user_keys inactive
      JOIN user_keys active
      JOIN selected s ON s.id = active.id AND s.visible = 1
        AND inactive.stripped_key = COALESCE(s.parent_id, '') || char(0) || active.visible_key
      WHERE NOT EXISTS (SELECT 1 FROM selected WHERE id = inactive.id) LIMIT 1
    `).get() !== void 0 && headerSeq !== void 0) {
			if (navigation.hasExplicitLeafUpdate) {
				if (!walk(navigation.appendParentId, false)) recognized = false;
			}
			const chosen = this.database.prepare("SELECT seq, parent_id FROM selected ORDER BY seq");
			for (const selectedRow of chosen.iterate()) {
				const row = readRow.get(source, selectedRow.seq);
				const event = JSON.parse(String(row.event_json));
				if (navigation.hasExplicitLeafUpdate) event.parentId = selectedRow.parent_id;
				update.run(JSON.stringify(event), source, selectedRow.seq);
			}
			let controlSeq = null;
			if (terminalControl) {
				controlSeq = Number(terminalControl.entry.importSeq);
				const last = this.database.prepare("SELECT id FROM selected ORDER BY seq DESC LIMIT 1").get();
				const row = readRow.get(source, controlSeq);
				const event = JSON.parse(String(row.event_json));
				event.parentId = last?.id ?? null;
				event.appendParentId = navigation.appendParentId === null ? null : selected.get(navigation.appendParentId) ? navigation.appendParentId : last?.id ?? null;
				update.run(JSON.stringify(event), source, controlSeq);
				const next = this.database.prepare("SELECT MAX(seq) + 1 AS seq FROM rows WHERE source = ?").get(source);
				this.database.prepare("UPDATE rows SET seq = ? WHERE source = ? AND seq = ?").run(next.seq, source, controlSeq);
				controlSeq = Number(next.seq);
			}
			this.database.prepare(`DELETE FROM rows WHERE source = ? AND seq <> ?
        AND (? IS NULL OR seq <> ?) AND seq NOT IN (SELECT seq FROM selected)`).run(source, headerSeq, controlSeq, controlSeq);
			changed = true;
		}
		if (!valid || navigation.hasInvalidLeafControl || headerSeq === void 0) recognized = false;
		const count = this.database.prepare("SELECT COUNT(*) AS count FROM rows WHERE source = ?").get(source);
		return {
			repaired: changed,
			events: Number(count.count),
			recognized
		};
	}
};
//#endregion
//#region src/infra/session-sqlite-transcript-verification.ts
function verifyTranscriptEvents(database, source, mode = "ordered") {
	return withSqliteSessionImportStage((stage) => {
		let seq = 0;
		const validate = createTranscriptEventReader(source.path, source.sessionId, false, readTranscriptFingerprint(source.path), source.originalPath)((event) => stage.append(0, seq++, JSON.stringify(event)));
		if (mode === "ordered") {
			const repair = stage.repairLegacyTranscript(0);
			if (repair.repaired || !repair.recognized) return;
		}
		const db = getSessionKysely(database);
		const sqliteEvents = executeSqliteQueryTakeFirstSync(database, db.selectFrom("transcript_events").select((eb) => eb.fn.countAll().as("count")).where("session_id", "=", source.sessionId)).count;
		const sourceRows = stage.rows(0)[Symbol.iterator]();
		let expected = sourceRows.next();
		try {
			for (const event of iterateSqliteQuerySync(database, db.selectFrom("transcript_events").select(transcriptEventJsonSql(database).as("event_json")).where("session_id", "=", source.sessionId).orderBy("seq", "asc"))) {
				if (mode !== "ordered") {
					stage.addSeen(event.event_json);
					const entry = JSON.parse(event.event_json);
					if (isRecord(entry) && typeof entry.id === "string") stage.addSeen(`id\0${entry.id}`);
				}
				if (!expected.done && event.event_json === expected.value.eventJson) {
					expected = sourceRows.next();
					if (expected.done) break;
				}
			}
		} finally {
			sourceRows.return?.();
		}
		if (mode === "ordered" || expected.done) {
			validate();
			return expected.done ? {
				events: seq,
				missingEvents: 0,
				sqliteEvents
			} : void 0;
		}
		let missingEvents = 0;
		let firstMissing;
		for (const row of stage.rows(0)) {
			const entry = JSON.parse(row.eventJson);
			const id = isRecord(entry) && typeof entry.id === "string" ? entry.id : `row ${row.seq + 1}`;
			if (stage.contains(row.eventJson)) {
				if (firstMissing !== void 0) throw new Error(`Missing legacy event ${firstMissing} precedes existing event ${id}; only a missing suffix can be appended`);
				continue;
			}
			if (mode !== "appendable") return;
			if (stage.contains(`id\0${id}`)) throw new Error(`Legacy event ${id} conflicts with the SQLite event of the same identity`);
			firstMissing ??= id;
			missingEvents += 1;
		}
		if (missingEvents > 0) {
			const repair = stage.repairLegacyTranscript(0);
			if (repair.repaired || !repair.recognized) return;
		}
		validate();
		return {
			events: seq,
			missingEvents,
			sqliteEvents
		};
	});
}
/** Read-only content proof for Doctor's informational missing-index finding. */
function verifyCanonicalSessionTranscriptSources(params) {
	const verified = withOpenClawAgentDatabaseReadOnly((database) => {
		let events = 0;
		let missingEvents = 0;
		let sqliteEvents = 0;
		for (const source of params.sources) {
			const verifiedSource = verifyTranscriptEvents(database.db, {
				...source,
				originalPath: source.originalPath ?? source.path
			}, params.mode);
			if (!verifiedSource) return;
			events += verifiedSource.events;
			missingEvents += verifiedSource.missingEvents;
			sqliteEvents += verifiedSource.sqliteEvents;
		}
		return {
			entries: params.sources.length,
			events,
			missingEvents,
			sqliteEvents
		};
	}, {
		agentId: params.target.agentId,
		path: params.target.sqlitePath,
		env: params.env
	});
	return verified.found ? verified.value : void 0;
}
//#endregion
export { normalizeLegacyOpenAICodexTranscriptMetadata as a, listLegacySessionTranscriptFiles as c, shouldFilterLegacySessionRecordsByTarget as d, hasBrokenPromptRewriteBranch as i, readLegacySessionStoreEntries as l, verifyTranscriptEvents as n, selectActivePath as o, withSqliteSessionImportStage as r, isLegacySessionRecordOwnedByTarget as s, verifyCanonicalSessionTranscriptSources as t, resolveLegacyTranscriptPaths as u };
