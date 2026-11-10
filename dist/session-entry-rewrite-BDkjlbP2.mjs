import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { i as executeSqliteQuerySync, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as assertOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { r as parseSqliteSessionEntryRecord } from "./session-entry-json-iiByG7LE.mjs";
import { c as runOpenClawAgentWriteTransaction, u as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as attachSessionEntrySnapshots } from "./session-entry-snapshot-values-CSxUX6LQ.mjs";
import { i as writeSessionEntrySnapshots, r as splitSessionEntrySnapshots, t as sessionEntrySnapshotColumns } from "./session-entry-snapshots-CwvH1YlE.mjs";
import { n as sessionDeliveryChannel, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as stripRuntimeOnlySessionSkillsFields, o as assertSupportedSessionStoreEntry, s as LEGACY_SESSION_ENTRY_STATE_FIELDS } from "./store-entry-shape-sjH_uIYB.mjs";
import { t as normalizeStatus } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { c as markCanonicalSessionValidationPending } from "./session-canonical-key-B7chVWi3.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { r as publishSessionEntryCacheInvalidation } from "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { c as invalidateSessionEntryMaintenanceAgeFact } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { t as deriveSessionPredicateColumns } from "./session-predicate-columns-DCy-hoSP.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
import { n as migrateLegacySessionRunOutcome } from "./session-entry-shape-DbHda4lP.mjs";
//#region src/commands/doctor/shared/session-entry-rewrite.ts
const DOCTOR_SESSION_REWRITE_BATCH_SIZE = 64;
function iterateDoctorSessionKeyBatches(sessionKeys) {
	return chunkItems(uniqueStrings(sessionKeys).toSorted(), DOCTOR_SESSION_REWRITE_BATCH_SIZE);
}
/** Select legacy state before loading raw rows into canonical validation or runtime projection. */
function scanDoctorSessionEntryRecords(scope, visit, expectedIdentity) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		assertOpenClawAgentDatabaseIdentity(database, expectedIdentity);
		for (const row of iterateSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select(["session_key", "entry_json"]).where(sql`CASE WHEN json_valid(entry_json) THEN EXISTS (
            SELECT 1 FROM json_each(entry_json)
            WHERE key IN (${sql.join(LEGACY_SESSION_ENTRY_STATE_FIELDS)})
              OR key IN ('provider', 'lastProvider', 'room')
              OR (key = 'pendingFinalDelivery' AND type IN ('true', 'false'))
              OR (key = 'status' AND value IN ('running', 'queued'))
          ) ELSE 1 END`))) {
			const entry = safeParseJsonRecord(row.entry_json);
			if (entry) {
				assertSupportedSessionStoreEntry(entry);
				visit({
					sessionKey: row.session_key,
					entry
				});
			}
		}
	}, toDatabaseOptions(resolved));
	if (!result.found) throw new Error(`Session database unavailable during raw state inspection: ${result.reason}`);
}
/** Startup normalizes legacy outcomes before canonical reads; clean stores stay read-only. */
async function repairLegacySessionRunOutcomes(scope, assertCurrent) {
	assertCurrent();
	const expectedIdentity = readDatabasePathIdentitySync(scope.storePath);
	const sessionKeys = [];
	scanDoctorSessionEntryRecords(scope, ({ entry, sessionKey }) => {
		if (entry.status === "running" || entry.status === "queued") sessionKeys.push(sessionKey);
	}, expectedIdentity);
	assertCurrent();
	return sessionKeys.length === 0 ? 0 : withOpenClawAgentDatabaseAsync(toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	})), () => rewriteDoctorSessionEntries({
		scope,
		sessionKeys,
		rawTransform: migrateLegacySessionRunOutcome,
		expectedIdentity,
		assertCurrent
	}), () => {
		assertCurrent();
		assertExistingDatabaseIdentity(scope.storePath, expectedIdentity.key, expectedIdentity.birthtime);
	});
}
/** Rewrites bounded entry batches after rereading each authoritative row inside its commit. */
function rewriteDoctorSessionEntries(params) {
	const resolved = resolveSqliteScope({
		...params.scope,
		sessionKey: ""
	});
	const databaseOptions = toDatabaseOptions(resolved);
	let rewritten = 0;
	for (const batch of iterateDoctorSessionKeyBatches(params.sessionKeys)) {
		params.assertCurrent?.();
		rewritten += runOpenClawAgentWriteTransaction((database) => {
			const assertRepairCurrent = () => {
				params.assertCurrent?.();
				if (params.expectedIdentity) assertOpenClawAgentDatabaseIdentity(database, params.expectedIdentity);
			};
			assertRepairCurrent();
			const db = getSessionKysely(database.db);
			let batchRewritten = 0;
			for (const sessionKey of batch) {
				const row = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
					"session_key",
					"current_session_id",
					"entry_json",
					"updated_at",
					"entry_valid"
				]).select(sessionEntrySnapshotColumns).where("session_key", "=", sessionKey)).rows[0];
				if (!row) continue;
				let entryJson;
				let nextEntry;
				let deliveryProjectionEntry;
				let runOutcome;
				let snapshots;
				let entryValid = row.entry_valid;
				if (params.rawTransform) {
					const entry = safeParseJsonRecord(row.entry_json);
					if (!entry) continue;
					assertSupportedSessionStoreEntry(entry);
					const previousSessionId = entry.sessionId;
					const previousUpdatedAt = entry.updatedAt;
					const previousFields = new Map(Object.entries(entry).map(([key, value]) => [key, JSON.stringify(value)]));
					const transformed = params.rawTransform(entry, sessionKey, row.updated_at);
					if (transformed.sessionId !== previousSessionId || transformed.updatedAt !== previousUpdatedAt) throw new Error("Raw session state repair cannot change session identity");
					let patched = sql.val(row.entry_json);
					for (const key of /* @__PURE__ */ new Set([...previousFields.keys(), ...Object.keys(transformed)])) {
						const value = JSON.stringify(transformed[key]);
						if (value === previousFields.get(key)) continue;
						const jsonPath = `$.${JSON.stringify(key)}`;
						patched = value === void 0 ? sql`json_remove(${patched}, ${jsonPath})` : sql`json_set(${patched}, ${jsonPath}, json(${value}))`;
					}
					entryJson = executeSqliteQuerySync(database.db, db.selectNoFrom(patched.as("entry_json"))).rows[0].entry_json;
					if (entryJson === row.entry_json) continue;
					if (previousFields.get("status") !== JSON.stringify(transformed.status)) runOutcome = transformed;
					const parsedEntry = parseSqliteSessionEntryRecord({
						...row,
						entry_json: entryJson
					});
					if (!parsedEntry) entryValid = 0;
					else if (params.updateDeliveryProjection && previousFields.get("delivery") !== JSON.stringify(transformed.delivery)) deliveryProjectionEntry = parsedEntry;
				} else {
					const entry = parseSqliteSessionEntryRecord(row);
					if (!entry) continue;
					assertSupportedSessionStoreEntry(entry);
					attachSessionEntrySnapshots(entry, row);
					const previousJson = JSON.stringify(entry);
					const previousStatus = entry.status;
					const transformedEntry = params.transform(entry, sessionKey);
					if (JSON.stringify(transformedEntry) === previousJson) continue;
					nextEntry = stripRuntimeOnlySessionSkillsFields(transformedEntry);
					({entryJson, snapshots} = splitSessionEntrySnapshots(nextEntry));
					if (!parseSqliteSessionEntryRecord({
						...row,
						entry_json: entryJson
					})) continue;
					entryValid = 1;
					if (previousStatus !== nextEntry.status) runOutcome = nextEntry;
				}
				assertRepairCurrent();
				invalidateSessionEntryMaintenanceAgeFact(database.db);
				markCanonicalSessionValidationPending(database, [sessionKey]);
				const runProjection = runOutcome ? {
					status: normalizeStatus(runOutcome.status),
					ended_at: asFiniteNumber(runOutcome.endedAt) ?? null
				} : void 0;
				const predicateColumns = deriveSessionPredicateColumns(entryJson);
				executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({
					entry_json: entryJson,
					...predicateColumns,
					session_started_at: sql`${predicateColumns.session_started_at}`,
					entry_valid: entryValid,
					...runProjection ? { status: runProjection.status } : {}
				}).where("session_key", "=", sessionKey));
				if (snapshots) writeSessionEntrySnapshots(database, sessionKey, snapshots);
				const projected = deliveryProjectionEntry ?? nextEntry;
				const deliveryProjection = projected && params.updateDeliveryProjection ? {
					account_id: deliveryContextFromSession(projected)?.accountId ?? null,
					channel: sessionDeliveryChannel(projected) ?? null
				} : void 0;
				if (deliveryProjection || runProjection) executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({
					...deliveryProjection,
					...runProjection
				}).where("session_id", "=", row.current_session_id));
				publishSessionEntryCacheInvalidation(database, { sessionKey });
				batchRewritten += 1;
			}
			assertRepairCurrent();
			return batchRewritten;
		}, databaseOptions, {
			operationLabel: "doctor.rewrite-session-entries",
			repairAdmission: {
				expectedIdentity: params.expectedIdentity,
				assertCurrent: params.assertCurrent
			}
		});
	}
	return rewritten;
}
//#endregion
export { scanDoctorSessionEntryRecords as i, repairLegacySessionRunOutcomes as n, rewriteDoctorSessionEntries as r, iterateDoctorSessionKeyBatches as t };
