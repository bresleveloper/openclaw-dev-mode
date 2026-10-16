import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { d as sql, o as iterateSqliteQuerySync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { m as assertOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as parseSqliteSessionEntryRecord } from "./session-entry-json-CtwFM7Hi.mjs";
import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { a as writeSessionEntrySnapshots, i as splitSessionEntrySnapshots, n as sessionEntrySnapshotColumns, t as attachSessionEntrySnapshots } from "./session-entry-snapshots-DO3oGsuC.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { n as sessionDeliveryChannel, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { a as stripRuntimeOnlySessionSkillsFields, o as assertSupportedSessionStoreEntry, s as LEGACY_SESSION_ENTRY_STATE_FIELDS } from "./store-entry-shape-BzuAi3ao.mjs";
import { D as invalidateSessionEntryMaintenanceAgeFact, r as publishSessionEntryCacheInvalidation } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
//#region src/commands/doctor/shared/session-entry-rewrite.ts
const DOCTOR_SESSION_REWRITE_BATCH_SIZE = 64;
function iterateDoctorSessionKeyBatches(sessionKeys) {
	return chunkItems(uniqueStrings(sessionKeys).toSorted(), DOCTOR_SESSION_REWRITE_BATCH_SIZE);
}
function parseDoctorSessionEntryRecord(entryJson) {
	try {
		const entry = JSON.parse(entryJson);
		return isRecord(entry) ? entry : void 0;
	} catch {
		return;
	}
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
          ) ELSE 1 END`))) {
			const entry = parseDoctorSessionEntryRecord(row.entry_json);
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
			params.assertCurrent?.();
			if (params.expectedIdentity) assertOpenClawAgentDatabaseIdentity(database, params.expectedIdentity);
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
				let snapshots;
				let entryValid = row.entry_valid;
				if (params.rawTransform) {
					const entry = parseDoctorSessionEntryRecord(row.entry_json);
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
					const transformedEntry = params.transform(entry, sessionKey);
					if (JSON.stringify(transformedEntry) === previousJson) continue;
					nextEntry = stripRuntimeOnlySessionSkillsFields(transformedEntry);
					({entryJson, snapshots} = splitSessionEntrySnapshots(nextEntry));
					if (!parseSqliteSessionEntryRecord({
						...row,
						entry_json: entryJson
					})) continue;
					entryValid = 1;
				}
				params.assertCurrent?.();
				if (params.expectedIdentity) assertOpenClawAgentDatabaseIdentity(database, params.expectedIdentity);
				invalidateSessionEntryMaintenanceAgeFact(database.db);
				executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_json: entryJson }).where("session_key", "=", sessionKey));
				if (snapshots) writeSessionEntrySnapshots(database, sessionKey, snapshots);
				executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_valid: entryValid }).where("session_key", "=", sessionKey));
				const projected = deliveryProjectionEntry ?? nextEntry;
				if (projected && params.updateDeliveryProjection) executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({
					account_id: deliveryContextFromSession(projected)?.accountId ?? null,
					channel: sessionDeliveryChannel(projected) ?? null
				}).where("session_id", "=", row.current_session_id));
				publishSessionEntryCacheInvalidation(database, { sessionKey });
				batchRewritten += 1;
			}
			params.assertCurrent?.();
			if (params.expectedIdentity) assertOpenClawAgentDatabaseIdentity(database, params.expectedIdentity);
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
export { rewriteDoctorSessionEntries as n, scanDoctorSessionEntryRecords as r, iterateDoctorSessionKeyBatches as t };
