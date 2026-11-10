import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { G as sqliteSessionIdWriteScope, U as withSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-B2RKADOj.mjs";
import { F as hasPendingInputConsumptionColumn, I as hasSessionPendingInputsSchema } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { r as parseSqliteSessionEntryRecord } from "./session-entry-json-iiByG7LE.mjs";
import { c as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { c as transcriptEventJsonSql, i as prepareTranscriptPayload } from "./transcript-payload-Cu49oQKq.mjs";
import { a as resolveSessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { v as hasMainSessionRecoveryClaim } from "./store-maintenance-BqMt1Twc.mjs";
import { t as readLegacyCompactionHistory } from "./legacy-compaction-history-DS8GebGO.mjs";
import { i as projectCanonicalSessionEntryShape } from "./store-entry-shape-sjH_uIYB.mjs";
import { n as parseSessionEntryJson } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { c as collectSessionStateIdsForEntry } from "./transcript-event-media-C4aKs47S.mjs";
import { i as publishUnchangedSessionTranscriptAuthority, s as readStagedSessionTranscriptAuthority } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import { i as readSessionColdTranscript } from "./session-cold-storage-state-CWFSrppd.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { n as deleteSessionTranscriptFtsRowsInTransaction, r as selectSessionTranscriptFtsRows, t as createSessionTranscriptFtsInserter } from "./session-transcript-fts-BGvn_VQW.mjs";
import { r as publishEncodedSessionTranscriptArchive } from "./session-accessor.sqlite-archive-artifact-2spMMDfj.mjs";
import { n as readSessionStateDeleteSnapshot, r as sqliteSessionStateDeleteSnapshotsEqual } from "./session-accessor.sqlite-delete-snapshot-C7Nn_aNm.mjs";
import { t as collectSessionAdmissionReferences } from "./session-history-eviction-candidates-CgN7hDVZ.mjs";
import { r as resolveTranscriptAppendRefusal } from "./session-accessor.sqlite-transcript-write-guard-C3zmfbiJ.mjs";
import { n as readSessionGoalOperationInDatabase } from "./goals-operations-DPpmJyei.mjs";
import { n as sqliteSessionTranscriptTurnRebound, t as createSessionTranscriptTurnKernel } from "./session-turn.kernel-S1FdspyZ.mjs";
import { n as readSessionSourceValidation } from "./session-source-predicate.worker-CY9FAsb_.mjs";
import { r as readSessionColdLockedValidation } from "./session-cold-storage-source-guard.worker-CKWg0m5n.mjs";
import { a as sessionColdRecordSchema, i as resolveSessionColdArchivePath, n as decodeSessionColdRecords, o as verifyPublishedSessionColdArchive, r as readVerifiedSessionColdArchive, t as MAX_COLD_ARCHIVE_BYTES } from "./session-cold-storage-codec-C4tx_d3q.mjs";
import fs from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import zlib from "node:zlib";
import { pipeline } from "node:stream/promises";
//#region src/config/sessions/session-cold-storage-eligibility.ts
/** Cold storage preserves logical owners; only activity and explicit cross-generation references protect bytes. */
function readSessionColdStorageProtection(database, beforeMs, liveSessionKeys) {
	const db = getNodeSqliteKysely(database.db);
	const protectedIds = /* @__PURE__ */ new Set();
	const busyKeys = new Set(liveSessionKeys);
	for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"session_key",
		"current_session_id",
		"updated_at",
		"last_activity_at",
		"last_interaction_at",
		"entry_json"
	]))) {
		const record = parseSqliteSessionEntryRecord(row);
		const entry = record ? projectCanonicalSessionEntryShape(record) : void 0;
		const recoveryPending = !entry?.mainRestartRecovery?.tombstone && (entry?.restartRecoveryBeforeAgentReplyState === "admitted" || entry?.restartRecoveryBeforeAgentReplyState === "pending" || entry?.restartRecoveryBeforeAgentReplyState === "continue" || entry?.restartRecoveryDeliveryReceiptState === "terminal-pending" || hasMainSessionRecoveryClaim(entry));
		if (!entry || recoveryPending) busyKeys.add(row.session_key);
		if (Math.max(row.updated_at, row.last_activity_at ?? 0, row.last_interaction_at ?? 0) >= beforeMs) protectedIds.add(row.current_session_id);
		if (!entry) continue;
		if (entry.previousSessionId) protectedIds.add(entry.previousSessionId);
		for (const id of entry.usageFamilySessionIds ?? []) if (id !== row.current_session_id) protectedIds.add(id);
		for (const checkpoint of readLegacyCompactionHistory(entry)) for (const id of [
			checkpoint.sessionId,
			checkpoint.preCompaction.sessionId,
			checkpoint.postCompaction.sessionId
		]) if (id && id !== row.current_session_id) protectedIds.add(id);
	}
	for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").where((eb) => eb.or([
		...busyKeys.size > 0 ? [eb("session_key", "in", sqliteStringSet([...busyKeys]))] : [],
		eb("updated_at", ">=", beforeMs),
		eb(eb.fn.coalesce("transcript_updated_at", eb.val(0)), ">=", beforeMs)
	])))) protectedIds.add(row.session_id);
	if (hasSessionPendingInputsSchema(database.db)) for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_pending_inputs").select("session_id").where("state", "in", ["queued", "interrupted"]).$if(hasPendingInputConsumptionColumn(database.db), (query) => query.where("consumed_event_id", "is", null)))) protectedIds.add(row.session_id);
	return protectedIds;
}
//#endregion
//#region src/config/sessions/session-cold-storage-inventory.ts
function readSessionColdStorageInventory(database) {
	if (!database) return {
		hotTranscripts: 0,
		coldTranscripts: 0,
		embeddedArchiveBytes: 0
	};
	return runSqliteDeferredTransactionSync(database.db, () => {
		const db = getNodeSqliteKysely(database.db);
		const cold = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_cold_archives").select((eb) => [eb.fn.countAll().as("count"), eb.fn.sum("archive_bytes").filterWhere("storage", "=", "sqlite").as("bytes")]));
		return {
			hotTranscripts: executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows as window").leftJoin("session_transcript_cold_archives as cold", "cold.session_id", "window.session_id").select((eb) => eb.fn.countAll().as("count")).where("cold.session_id", "is", null).where((eb) => eb.exists(eb.selectFrom("transcript_events as event").select("event.seq").whereRef("event.session_id", "=", "window.session_id"))))?.count ?? 0,
			embeddedArchiveBytes: cold?.bytes ?? 0,
			coldTranscripts: cold?.count ?? 0
		};
	}, {
		databaseLabel: database.path,
		operationLabel: "session cold storage inventory"
	});
}
//#endregion
//#region src/config/sessions/session-cold-storage-selection.ts
function selectSessionColdBatch(input) {
	return withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
		const db = getNodeSqliteKysely(database.db);
		const admissions = collectSessionAdmissionReferences({
			database,
			admissionIdentities: [...input.admissionIdentities, ...input.liveSessionKeys]
		});
		const cooled = new Set(input.cooledSessionIds);
		const excluded = readSessionColdStorageProtection(database, input.beforeMs, new Set(input.liveSessionKeys));
		for (const id of [...admissions, ...cooled]) excluded.add(id);
		const externalizations = executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_cold_archives").select("session_id").where("storage", "=", "sqlite").$if(cooled.size + admissions.size > 0, (query) => query.where("session_id", "not in", sqliteStringSet([...cooled, ...admissions]))).orderBy("archived_at").orderBy("session_id").limit(input.maxTranscripts)).rows.flatMap((row) => {
			const archive = readSessionColdTranscript(database.db, row.session_id);
			return archive ? [archive] : [];
		});
		const plans = (externalizations.length < input.maxTranscripts ? executeSqliteQuerySync(database.db, db.selectFrom("session_windows as window").leftJoin("session_transcript_cold_archives as cold", "cold.session_id", "window.session_id").select("window.session_id").where("cold.session_id", "is", null).$if(excluded.size > 0, (query) => query.where("window.session_id", "not in", sqliteStringSet([...excluded]))).where("window.transcript_updated_at", "<", input.beforeMs).where((eb) => eb.exists(eb.selectFrom("transcript_events as event").select("event.seq").whereRef("event.session_id", "=", "window.session_id"))).orderBy("window.transcript_updated_at").orderBy("window.session_id").limit(input.maxTranscripts - externalizations.length)).rows : []).flatMap(({ session_id: sessionId }) => {
			const snapshot = readSessionStateDeleteSnapshot(database.db, sessionId);
			return snapshot.generation && snapshot.lastSeq !== null ? [{
				databaseOptions: input.databaseOptions,
				sessionId,
				snapshot
			}] : [];
		});
		let freePages = 0;
		if (plans.length + externalizations.length === 0) freePages = Number(database.db.prepare("PRAGMA freelist_count").get()?.freelist_count ?? 0);
		return {
			plans,
			externalizations,
			freePages
		};
	}, {
		databaseLabel: database.path,
		operationLabel: "cold transcript selection"
	}), input.databaseOptions);
}
/** Keys whose live admissions protect any selected generation, including entry references. */
function readSessionAdmissionProtectionKeys(database, sessionIds) {
	const selected = new Set(sessionIds);
	const keys = /* @__PURE__ */ new Set();
	if (selected.size === 0) return keys;
	const db = getNodeSqliteKysely(database.db);
	for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"session_key",
		"current_session_id",
		"entry_json"
	]))) {
		const entry = parseSessionEntryJson(row);
		if (selected.has(row.current_session_id) || entry && collectSessionStateIdsForEntry(entry).some((id) => selected.has(id))) keys.add(normalizeStoreSessionKey(row.session_key));
	}
	for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_key").where("session_id", "in", sqliteStringSet(sessionIds)))) keys.add(normalizeStoreSessionKey(row.session_key));
	return keys;
}
//#endregion
//#region src/config/sessions/session-cold-storage-worker.ts
async function prepareSessionColdArchiveInWorker(plan, maxBytes) {
	if (!plan.snapshot.generation) throw new Error("Cannot archive a transcript without its generation");
	const directory = path.dirname(resolveSessionColdArchivePath(plan.databaseOptions.path, `${"0".repeat(64)}.jsonl.zst`));
	fs.mkdirSync(directory, {
		recursive: true,
		mode: 448
	});
	const stagePath = path.join(directory, `${randomUUID()}.tmp`);
	const compressedPath = `${stagePath}.zst`;
	let eventCount = 0;
	let rawBytes = 0;
	let stagedBytes = 0;
	try {
		const fd = fs.openSync(stagePath, "wx", 384);
		try {
			let pending = "";
			const write = (record) => {
				const line = `${JSON.stringify(record)}\n`;
				stagedBytes += Buffer.byteLength(line);
				if (stagedBytes > maxBytes) throw new ColdArchiveLimitError();
				pending += line;
				if (pending.length >= 65536) {
					fs.writeSync(fd, pending);
					pending = "";
				}
			};
			if (!withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
				if (!sqliteSessionStateDeleteSnapshotsEqual(readSessionStateDeleteSnapshot(database.db, plan.sessionId), plan.snapshot)) throw new Error("Transcript changed before cold archive preparation");
				const db = getNodeSqliteKysely(database.db);
				write({
					kind: "header",
					version: 1,
					sessionId: plan.sessionId,
					generation: plan.snapshot.generation
				});
				for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("transcript_events").select("seq").select(transcriptEventJsonSql(database.db).as("event_json")).select("created_at").where("session_id", "=", plan.sessionId).orderBy("seq"))) {
					eventCount++;
					rawBytes += Buffer.byteLength(row.event_json);
					write({
						kind: "event",
						row
					});
				}
				for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities").select([
					"event_id",
					"seq",
					"event_type",
					"parent_id",
					"message_idempotency_key",
					"created_at"
				]).where("session_id", "=", plan.sessionId).orderBy("seq").orderBy("event_id"))) write({
					kind: "identity",
					row
				});
				for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_transcript_active_events").select([
					"active_position",
					"event_seq",
					"message_position",
					"context_eligible"
				]).where("session_id", "=", plan.sessionId).orderBy("active_position"))) write({
					kind: "active",
					row
				});
				for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_transcript_index_state").select([
					"indexed_seq",
					"leaf_event_id",
					"needs_rebuild",
					"active_event_count",
					"active_message_count",
					"updated_at"
				]).where("session_id", "=", plan.sessionId))) write({
					kind: "index",
					row
				});
				for (const row of iterateSqliteQuerySync(database.db, selectSessionTranscriptFtsRows(database.db, plan.sessionId))) write(sessionColdRecordSchema.parse({
					kind: "fts",
					row
				}));
			}, {
				databaseLabel: database.path,
				operationLabel: "cold transcript snapshot"
			}), plan.databaseOptions).found || eventCount === 0) throw new Error("Cannot archive a missing or empty transcript");
			if (pending) fs.writeSync(fd, pending);
		} finally {
			fs.closeSync(fd);
		}
		await pipeline(fs.createReadStream(stagePath), zlib.createZstdCompress(), fs.createWriteStream(compressedPath, {
			flags: "wx",
			mode: 384
		}));
		const bytes = fs.readFileSync(compressedPath);
		const sha256 = createHash("sha256").update(bytes).digest("hex");
		const archiveName = `${sha256}.jsonl.zst`;
		publishEncodedSessionTranscriptArchive({
			archiveDirectory: directory,
			archiveName,
			bytes,
			sha256
		});
		requireDirectorySync(syncDirectorySync(directory), "Cold archive directory");
		requireDirectorySync(syncDirectorySync(path.dirname(directory)), "Session artifact directory");
		const archive = {
			session_id: plan.sessionId,
			generation: plan.snapshot.generation,
			archive_name: archiveName,
			archive_sha256: sha256,
			archive_bytes: bytes.length,
			event_count: eventCount,
			raw_bytes: rawBytes + eventCount - 1,
			last_seq: plan.snapshot.lastSeq,
			archived_at: Date.now(),
			storage: "file",
			archive_blob: null
		};
		decodeSessionColdRecords(bytes, archive);
		return {
			plan,
			archive,
			envelopeBytes: stagedBytes
		};
	} finally {
		fs.rmSync(stagePath, { force: true });
		fs.rmSync(compressedPath, { force: true });
	}
}
var ColdArchiveLimitError = class extends Error {};
async function prepareExternalization(input, expected, maxBytes) {
	const opened = withOpenClawAgentDatabaseReadOnly((database) => executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_transcript_cold_archives").selectAll().where("session_id", "=", expected.session_id)).rows[0], input.databaseOptions);
	const archive = opened.found ? opened.value : void 0;
	if (!archive || archive.storage !== "sqlite" || archive.generation !== expected.generation || archive.archive_sha256 !== expected.archive_sha256) return;
	const bytes = await readVerifiedSessionColdArchive({
		storePath: input.databaseOptions.path,
		archive
	});
	let envelopeBytes;
	try {
		envelopeBytes = zlib.zstdDecompressSync(bytes, { maxOutputLength: maxBytes }).byteLength;
	} catch (error) {
		if (hasErrnoCode(error, "ERR_BUFFER_TOO_LARGE")) throw new ColdArchiveLimitError();
		throw error;
	}
	const directory = path.dirname(resolveSessionColdArchivePath(input.databaseOptions.path, archive.archive_name));
	publishEncodedSessionTranscriptArchive({
		archiveDirectory: directory,
		archiveName: archive.archive_name,
		bytes,
		sha256: archive.archive_sha256
	});
	requireDirectorySync(syncDirectorySync(directory), "Cold archive directory");
	requireDirectorySync(syncDirectorySync(path.dirname(directory)), "Session artifact directory");
	return {
		archive: expected,
		envelopeBytes
	};
}
async function prepareSessionColdBatchInWorker(input) {
	const result = {
		freePages: 0,
		protectionKeys: [],
		prepared: [],
		externalizations: [],
		oversizedSessionIds: [],
		envelopeBytes: 0
	};
	const selection = selectSessionColdBatch(input);
	if (!selection.found) return result;
	result.freePages = selection.value.freePages;
	const maxBytes = Math.min(input.maxBytes, MAX_COLD_ARCHIVE_BYTES);
	const candidates = [...selection.value.externalizations.map((archive) => ({
		kind: "externalize",
		archive
	})), ...selection.value.plans.map((plan) => ({
		kind: "archive",
		plan
	}))];
	for (const candidate of candidates.slice(0, 128)) {
		const remaining = maxBytes - result.envelopeBytes;
		if (remaining <= 0) break;
		try {
			if (candidate.kind === "archive") {
				const prepared = await prepareSessionColdArchiveInWorker(candidate.plan, remaining);
				result.prepared.push(prepared);
				result.envelopeBytes += prepared.envelopeBytes;
			} else {
				const prepared = await prepareExternalization(input, candidate.archive, remaining);
				if (prepared) {
					result.externalizations.push(prepared);
					result.envelopeBytes += prepared.envelopeBytes;
				}
			}
		} catch (error) {
			if (!(error instanceof ColdArchiveLimitError)) throw error;
			if (remaining === 67108864) result.oversizedSessionIds.push(candidate.kind === "archive" ? candidate.plan.sessionId : candidate.archive.session_id);
			result.envelopeBytes = maxBytes;
			break;
		}
	}
	const included = [...result.prepared.map((item) => item.plan.sessionId), ...result.externalizations.map((item) => item.archive.session_id)];
	if (included.length > 0) {
		const protection = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => [...readSessionAdmissionProtectionKeys(database, included)], {
			databaseLabel: database.path,
			operationLabel: "cold admission protection"
		}), input.databaseOptions);
		if (!protection.found) throw new Error("Cold transcript database disappeared during preparation");
		result.protectionKeys = protection.value;
	}
	return result;
}
async function prepareSessionColdRestoreInWorker(plan) {
	const opened = withOpenClawAgentDatabaseReadOnly((database) => executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_transcript_cold_archives").selectAll().where("session_id", "=", plan.sessionId)).rows[0], plan.databaseOptions);
	if (!opened.found || !opened.value || opened.value.archive_sha256 !== plan.archive.archive_sha256) throw new Error("Cold transcript changed before restoration");
	const archive = opened.value;
	return decodeSessionColdRecords(await readVerifiedSessionColdArchive({
		storePath: plan.databaseOptions.path,
		archive
	}), archive);
}
function mutateSessionColdTranscriptInWorker(plan, records, onCommit, sourceGuard) {
	return runOpenClawAgentWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const result = {
			archivedTranscripts: 0,
			externalizedTranscripts: 0,
			restored: false
		};
		let sourceValidation;
		if (plan.kind === "cold-maintain") {
			onCommit(database);
			return result;
		}
		if (plan.kind === "cold-batch") {
			if ([...readSessionAdmissionProtectionKeys(database, [...plan.prepared.map((item) => item.plan.sessionId), ...plan.externalizations.map((item) => item.archive.session_id)])].some((key) => !plan.protectionKeys.includes(key))) throw new Error("Transcript ownership changed; cold archival was canceled");
			const protectedIds = readSessionColdStorageProtection(database, plan.beforeMs, new Set(plan.liveSessionKeys));
			const archivedIds = [];
			for (const prepared of plan.prepared) {
				const { sessionId, snapshot } = prepared.plan;
				const fresh = readSessionStateDeleteSnapshot(database.db, sessionId);
				if (readSessionColdTranscript(database.db, sessionId) || protectedIds.has(sessionId) || !sqliteSessionStateDeleteSnapshotsEqual(fresh, snapshot) || fresh.transcriptUpdatedAt === null || fresh.transcriptUpdatedAt >= plan.beforeMs) continue;
				verifyPublishedSessionColdArchive(plan.databaseOptions.path, prepared.archive);
				withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(sessionId)], () => {
					executeSqliteQuerySync(database.db, db.insertInto("session_transcript_cold_archives").values(prepared.archive));
					executeSqliteQuerySync(database.db, db.deleteFrom("transcript_events").where("session_id", "=", sessionId));
					archivedIds.push(sessionId);
					executeSqliteQuerySync(database.db, db.deleteFrom("session_transcript_index_state").where("session_id", "=", sessionId));
				});
				if (fresh.sessionKey) publishUnchangedSessionTranscriptAuthority(database, fresh.sessionKey);
				result.archivedTranscripts++;
			}
			if (archivedIds.length > 0) deleteSessionTranscriptFtsRowsInTransaction(database.db, archivedIds);
			for (const { archive } of plan.externalizations) {
				const current = readSessionColdTranscript(database.db, archive.session_id);
				if (!current || current.storage !== "sqlite" || current.generation !== archive.generation || current.archive_sha256 !== archive.archive_sha256 || current.archive_name !== archive.archive_name) continue;
				verifyPublishedSessionColdArchive(plan.databaseOptions.path, archive);
				withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(archive.session_id)], () => executeSqliteQuerySync(database.db, db.updateTable("session_transcript_cold_archives").set({
					storage: "file",
					archive_blob: null
				}).where("session_id", "=", archive.session_id)));
				result.externalizedTranscripts++;
			}
		} else {
			if (plan.guard?.kind === "turn") {
				const { sessionKey, options, goalOperation } = plan.guard;
				const kernel = createSessionTranscriptTurnKernel({
					agentId: plan.guard.agentId,
					path: database.path,
					sessionId: plan.sessionId,
					sessionKey
				}, {
					...options,
					messages: [],
					sessionFile: ""
				});
				const selected = kernel.readEntry(database);
				const entries = /* @__PURE__ */ new Map([[sessionKey, selected?.entry]]);
				sourceValidation = sourceGuard ? sourceGuard.read(database, entries) : readSessionSourceValidation(database, plan.guard.sources, void 0, entries);
				const { refusedSource } = sourceValidation;
				if (refusedSource) return {
					...result,
					refusedSource
				};
				if (plan.guard.requireActive && resolveSessionWorkStartError(sessionKey, selected?.entry) || !kernel.resolveExpectedEntry(selected) && !(selected?.entry.sessionId === options.expectedSessionId && goalOperation && readSessionGoalOperationInDatabase(database, {
					sessionKey,
					expectedSessionId: options.expectedSessionId,
					operation: goalOperation
				}))) return {
					...result,
					turnRebound: sqliteSessionTranscriptTurnRebound(selected, "")
				};
			} else if (plan.guard?.kind === "locked") {
				const validation = readSessionColdLockedValidation({
					database,
					sessionId: plan.sessionId,
					guard: plan.guard,
					sourceGuard
				}, resolveTranscriptAppendRefusal);
				sourceValidation = validation.sourceValidation;
				if (sourceValidation.refusedSource || validation.writerRefusal) return {
					...result,
					refusedSource: sourceValidation.refusedSource,
					writerRefusal: validation.writerRefusal
				};
			}
			const current = readSessionColdTranscript(database.db, plan.sessionId);
			if (!current) return result;
			if (current.generation !== plan.archive.generation || current.archive_sha256 !== plan.archive.archive_sha256 || !records) throw new Error("Cold transcript changed during restoration");
			const session_id = plan.sessionId;
			const insertFts = createSessionTranscriptFtsInserter(database.db, session_id);
			withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(session_id)], () => {
				for (const record of records) switch (record.kind) {
					case "header": break;
					case "event":
						executeSqliteQuerySync(database.db, db.insertInto("transcript_events").values({
							session_id,
							seq: record.row.seq,
							created_at: record.row.created_at,
							...prepareTranscriptPayload(database.db, record.row.event_json)
						}));
						break;
					case "identity":
						executeSqliteQuerySync(database.db, db.insertInto("transcript_event_identities").values({
							session_id,
							...record.row
						}));
						break;
					case "active":
						executeSqliteQuerySync(database.db, db.insertInto("session_transcript_active_events").values({
							session_id,
							...record.row
						}));
						break;
					case "index":
						executeSqliteQuerySync(database.db, db.insertInto("session_transcript_index_state").values({
							session_id,
							...record.row
						}));
						break;
					case "fts": insertFts({
						messageId: record.row.message_id,
						text: record.row.text,
						role: record.row.role,
						timestamp: record.row.timestamp
					});
				}
				executeSqliteQuerySync(database.db, db.deleteFrom("session_transcript_cold_archives").where("session_id", "=", session_id));
			});
			result.restored = true;
			result.sessionKey = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_key").where("session_id", "=", session_id))?.session_key;
		}
		if (result.restored && result.sessionKey) publishUnchangedSessionTranscriptAuthority(database, result.sessionKey);
		result.transcriptPublication = readStagedSessionTranscriptAuthority(database);
		onCommit(database, sourceValidation);
		sourceGuard?.assertForeign();
		return result;
	}, plan.databaseOptions, { operationLabel: "session cold storage" });
}
function readSessionColdStorageInventoryInWorker(options) {
	const counts = withOpenClawAgentDatabaseReadOnly(readSessionColdStorageInventory, options);
	return counts.found ? counts.value : readSessionColdStorageInventory();
}
function readSessionColdMetadataInWorker(options, sessionId) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionColdTranscript(database.db, sessionId), options);
	return result.found ? result.value : void 0;
}
//#endregion
export { mutateSessionColdTranscriptInWorker, prepareSessionColdBatchInWorker, prepareSessionColdRestoreInWorker, readSessionColdMetadataInWorker, readSessionColdStorageInventoryInWorker };
