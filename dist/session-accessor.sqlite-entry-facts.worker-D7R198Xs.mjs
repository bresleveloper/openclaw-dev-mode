import { g as readStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync, m as expressionBuilder } from "./kysely-sync-9fPQaMlh.mjs";
import { n as sessionEntrySnapshotColumnsForKeys } from "./session-entry-snapshots-CwvH1YlE.mjs";
import { c as jsonOrderedArray, i as jsonArrayValue } from "./json-values-BQ6WshKk.mjs";
import { t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { a as canonicalSessionValidationQuery } from "./session-canonical-key-B7chVWi3.mjs";
import { a as readParticipantRecord, s as withProjectedParticipants } from "./session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
import { n as parseReadableSessionEntryData } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-entry-facts.worker.ts
function readInteger(value) {
	if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new RangeError("Session fact integer cannot be represented safely");
	return value;
}
function readRows(value) {
	const rows = JSON.parse(value);
	if (!Array.isArray(rows) || !rows.every(Array.isArray)) throw new Error("Invalid stored session fact rows");
	return rows;
}
/** One statement snapshot owns the entry, participant aggregates and membership records. */
function readExactSessionEntryFactsInDatabase(database, sessionKeys, projection = "full") {
	if (sessionKeys.length > 64) throw new Error(`Session entry facts support at most 64 keys`);
	const lookupKeys = [...new Set(sessionKeys.flatMap(collectSessionEntryLookupKeys))];
	const eb = expressionBuilder();
	const participants = eb.selectFrom("session_participants").select((builder) => jsonOrderedArray(database.db, jsonArrayValue(database.db, [
		builder.ref("identity_namespace"),
		builder.ref("actor_id"),
		builder.ref("contribution_count"),
		builder.ref("first_prompted_at"),
		builder.ref("last_prompted_at")
	]), [
		builder.ref("first_prompted_at"),
		builder.ref("actor_id"),
		builder.ref("identity_namespace")
	]).as("records")).whereRef("session_participants.session_key", "=", "session_nodes.session_key").$asScalar();
	const membership = eb.selectFrom("session_members").select((builder) => jsonOrderedArray(database.db, jsonArrayValue(database.db, [
		builder.ref("identity_id"),
		builder.ref("added_by"),
		builder.ref("added_at")
	]), [builder.ref("identity_id")]).as("records")).whereRef("session_members.session_key", "=", "session_nodes.session_key").$asScalar();
	const rows = executeSqliteQuerySync(database.db, canonicalSessionValidationQuery(database, { metadata: true }).select("session_nodes.updated_at").select(sessionEntrySnapshotColumnsForKeys(void 0, projection)).select([participants.as("participant_records_json"), membership.as("members_json")]).where("session_nodes.session_key", "in", sqliteStringSet(lookupKeys))).rows;
	const byKey = new Map(rows.map((row) => [row.session_key, {
		row,
		entry: parseReadableSessionEntryData(database, row, projection)
	}]));
	const entries = [];
	const members = {};
	const participantRecords = {};
	for (const sessionKey of sessionKeys) {
		const selected = byKey.get(toUSVString(sessionKey));
		if (!selected?.entry) continue;
		const { row, entry } = selected;
		const records = readRows(row.participant_records_json).map((participant) => readParticipantRecord({
			identity_namespace: expectDefined(readStringValue(participant[0]), "session participant identity namespace"),
			actor_id: expectDefined(readStringValue(participant[1]), "session participant actor ID"),
			contribution_count: readInteger(participant[2]),
			first_prompted_at: participant[3] === null ? null : readInteger(participant[3]),
			last_prompted_at: participant[4] === null ? null : readInteger(participant[4])
		}));
		entries.push({
			sessionKey,
			entry: withProjectedParticipants(entry, records)
		});
		members[sessionKey] = readRows(row.members_json).map((member) => ({
			identityId: expectDefined(readStringValue(member[0]), "session member identity ID"),
			addedBy: expectDefined(readStringValue(member[1]), "session member added-by identity"),
			addedAt: readInteger(member[2])
		}));
		if (records.length) participantRecords[sessionKey] = records;
	}
	return {
		entries,
		members,
		participantRecords
	};
}
//#endregion
export { readExactSessionEntryFactsInDatabase as t };
