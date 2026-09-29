import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as readFileDescriptorBoundedSync } from "./boundary-file-read-D-Aa04On.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as tryResolveDefaultAgentId, S as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import { a as iterateSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { l as createPrivateSqliteTempDirectorySync } from "./sqlite-snapshot-staging-BNvNaOwn.mjs";
import { o as hasInternalRuntimeContext, p as stripInternalRuntimeContext } from "./internal-runtime-context-BH-o1oq1.mjs";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-eRv24eIu.mjs";
import { a as isPrimarySessionTranscriptFileName } from "./artifacts-C9weQ_MG.mjs";
import { s as resolveSessionFilePathCore } from "./paths-CcMbq5NY.mjs";
import { S as isLegacyCodexProviderId } from "./codex-route-model-ref-CXtvdgWA.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { O as migrateLegacySessionCreator } from "./openclaw-agent-db-schema-helpers-D9qnl2Yp.mjs";
import { u as inspectOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import "./openclaw-agent-db-CaQAStOA.mjs";
import { s as transcriptEventJsonSql, x as isIndexedSessionEntry } from "./transcript-payload-qsg5dB6v.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { c as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { a as getSessionKysely } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { c as scanSessionTranscriptNavigation, f as selectSessionTranscriptTreePathNodes, i as mergeSessionTranscriptTreePaths, l as scanSessionTranscriptTree, n as isSessionTranscriptLeafControl, t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-3xvvNd9-.mjs";
import { o as resolveStoredSessionOwnerAgentId } from "./session-store-key-BoleEY7N.mjs";
import "./session-manager-codec-DW3_Rlj9.mjs";
import { C as readMigrationArtifactIdentity, _ as uniqueRestoreMoves, i as canonicalMigrationFilePath } from "./doctor-session-sqlite-migration-run-Dta_SQ4O.mjs";
import { n as assertDoctorSqliteMaintenancePathsNotAliased } from "./doctor-sqlite-maintenance-lock-7TRGuHpb.mjs";
import { n as normalizeLegacySessionEntryDelivery } from "./state-migrations.legacy-session-store-BJKmjQA9.mjs";
import { l as readTranscriptFingerprint, n as createTranscriptEventReader } from "./doctor-session-sqlite-readers-un_PyUoF.mjs";
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
				const metadata = { ...entry };
				delete metadata.message;
				const navigation = {};
				for (const key of [
					"type",
					"id",
					"parentId",
					"targetId",
					"appendParentId",
					"appendMode"
				]) if (Object.hasOwn(metadata, key)) navigation[key] = metadata[key];
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
//#region src/commands/doctor-session-sqlite-verification.ts
/** Offline destination ownership and conservative adoption of historical import evidence. */
function verifyTranscriptEvents(database, source, allowMissingSuffix = false) {
	return withSqliteSessionImportStage((stage) => {
		let seq = 0;
		const validate = createTranscriptEventReader(source.path, source.sessionId, false, readTranscriptFingerprint(source.path), source.originalPath)((event) => stage.append(0, seq++, JSON.stringify(event)));
		const repair = stage.repairLegacyTranscript(0);
		if (repair.repaired || !repair.recognized) return;
		const db = getSessionKysely(database);
		const sourceRows = stage.rows(0)[Symbol.iterator]();
		try {
			let expected = sourceRows.next();
			for (const event of iterateSqliteQuerySync(database, db.selectFrom("transcript_events").select(transcriptEventJsonSql(database).as("event_json")).where("session_id", "=", source.sessionId).orderBy("seq", "asc"))) {
				if (allowMissingSuffix) {
					stage.addSeen(event.event_json);
					const entry = JSON.parse(event.event_json);
					if (isRecord(entry) && typeof entry.id === "string") stage.addSeen(`id\0${entry.id}`);
				}
				if (expected.done) break;
				if (event.event_json === expected.value.eventJson) {
					expected = sourceRows.next();
					if (expected.done) break;
				}
			}
			let missingEvents = 0;
			if (allowMissingSuffix) while (!expected.done) {
				const entry = JSON.parse(expected.value.eventJson);
				if (stage.contains(expected.value.eventJson) || isRecord(entry) && typeof entry.id === "string" && stage.contains(`id\0${entry.id}`)) return;
				missingEvents += 1;
				expected = sourceRows.next();
			}
			validate();
			return expected.done ? {
				events: seq,
				missingEvents
			} : void 0;
		} finally {
			sourceRows.return?.();
		}
	});
}
/** Read-only content proof for Doctor's informational missing-index finding. */
function verifyCanonicalSessionTranscriptSources(params) {
	const verified = withOpenClawAgentDatabaseReadOnly((database) => {
		let events = 0;
		let missingEvents = 0;
		for (const source of params.sources) {
			const verifiedSource = verifyTranscriptEvents(database.db, {
				...source,
				originalPath: source.originalPath ?? source.path
			}, params.allowMissingSuffix);
			if (!verifiedSource) return;
			events += verifiedSource.events;
			missingEvents += verifiedSource.missingEvents;
		}
		return {
			entries: params.sources.length,
			events,
			missingEvents
		};
	}, {
		agentId: params.target.agentId,
		path: params.target.sqlitePath,
		env: params.env
	});
	return verified.found ? verified.value : void 0;
}
/** Keep one owner proof per database; fence in-place writes and sidecar changes after awaits. */
function createRecoveryDestinationVerifier(stateDir) {
	const destinations = /* @__PURE__ */ new Map();
	return (refs) => {
		for (const { target } of refs) {
			const paths = resolveSqliteDatabaseFilePaths(target.sqlitePath);
			assertDoctorSqliteMaintenancePathsNotAliased("update recovery cleanup", paths, [stateDir]);
			const expected = destinations.get(target.sqlitePath);
			if (!expected) {
				const owner = inspectOpenClawAgentDatabaseOwner(target.sqlitePath);
				if (owner.status !== "owned" || owner.agentId !== target.agentId) throw new Error("destination database ownership cannot be verified");
			}
			const files = paths.map((file) => fs.lstatSync(file, {
				bigint: true,
				throwIfNoEntry: false
			}));
			if (!files[0]?.isFile() || files.some((file) => file && (!file.isFile() || file.nlink !== 1n)) || expected && (expected.agentId !== target.agentId || files.some((file, index) => [
				"dev",
				"ino",
				"ctimeNs",
				"mtimeNs",
				"size"
			].some((key) => file?.[key] !== expected.files[index]?.[key])))) throw new Error("Recovery destination database changed; preview cleanup again.");
			if (!expected) destinations.set(target.sqlitePath, {
				agentId: target.agentId,
				files
			});
		}
	};
}
function verifyHistoricalMigrationArtifact(params) {
	const { target, move, env } = params;
	if (move.kind !== "legacy-store" && move.kind !== "transcript") return;
	const identity = readMigrationArtifactIdentity(move.archivePath);
	const indexMove = move.kind === "legacy-store" ? move : uniqueRestoreMoves(target).find((item) => item.kind === "legacy-store");
	if (!indexMove) return;
	readMigrationArtifactIdentity(indexMove.archivePath);
	const fd = fs.openSync(indexMove.archivePath, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0));
	let index;
	try {
		index = JSON.parse(readFileDescriptorBoundedSync(fd, fs.fstatSync(fd).size).toString("utf8"));
	} finally {
		fs.closeSync(fd);
	}
	if (!isRecord(index)) return;
	const entries = move.kind === "legacy-store" ? Object.entries(index) : move.sessionKey ? [[move.sessionKey, index[move.sessionKey]]] : [];
	if (move.kind === "transcript" && entries.length !== 1) return;
	const dependencies = new Set(move.kind === "legacy-store" ? uniqueRestoreMoves(target).filter((item) => item.kind === "transcript").map((item) => item.sourcePath) : []);
	const verified = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getSessionKysely(database.db);
		for (const [key, raw] of entries) {
			if (typeof key !== "string" || !isRecord(raw) || typeof raw.sessionId !== "string" || !raw.sessionId.trim() || typeof raw.updatedAt !== "number") return false;
			const sessionId = raw.sessionId;
			const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").select(["current_session_id", "entry_json"]).where("session_key", "=", key));
			if (!row || row.current_session_id !== raw.sessionId) return false;
			const current = JSON.parse(row.entry_json);
			const entry = {
				...raw,
				sessionId,
				updatedAt: raw.updatedAt
			};
			const normalized = migrateLegacySessionCreator(normalizeLegacySessionEntryDelivery(entry));
			if (!isRecord(current) || Object.entries(normalized).some(([field, value]) => field !== "sessionFile" && JSON.stringify(current[field]) !== JSON.stringify(value))) return false;
			if (move.kind !== "transcript") {
				for (const source of resolveLegacyTranscriptPaths(target, entry).transcriptDependencies) dependencies.add(canonicalMigrationFilePath(source));
				continue;
			}
			if (!verifyTranscriptEvents(database.db, {
				path: move.archivePath,
				originalPath: move.sourcePath,
				sessionId
			})) return false;
		}
		return true;
	}, {
		agentId: target.agentId,
		path: target.sqlitePath,
		env
	});
	if (!verified.found || !verified.value) return;
	return {
		identity,
		classification: "imported",
		reason: "verified-historical-import",
		dependencies: [...dependencies],
		disposal: { state: "retained" }
	};
}
//#endregion
export { hasBrokenPromptRewriteBranch as a, isLegacySessionRecordOwnedByTarget as c, resolveLegacyTranscriptPaths as d, shouldFilterLegacySessionRecordsByTarget as f, withSqliteSessionImportStage as i, listLegacySessionTranscriptFiles as l, verifyCanonicalSessionTranscriptSources as n, normalizeLegacyOpenAICodexTranscriptMetadata as o, verifyHistoricalMigrationArtifact as r, selectActivePath as s, createRecoveryDestinationVerifier as t, readLegacySessionStoreEntries as u };
