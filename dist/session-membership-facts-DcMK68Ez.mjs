import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { c as withSqlitePostCommitPublications } from "./sqlite-post-commit-22SfWsLt.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { o as runSqliteReadSnapshotSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as parseSessionEntryJson, r as selectSessionEntryRows } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-B7chVWi3.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as participantRecordsBySessionKey } from "./session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
import { _ as validateDeliveryCanonicalSessionEntry } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
//#region src/config/sessions/session-membership-facts.ts
/** The read-only worker projects a store once, then only keys named by committed publications. */
function readSessionMembershipFactsInDatabase(database, sessionKeys) {
	const { identity, birthtime } = readOpenClawAgentDatabaseIdentity(database);
	if (typeof identity !== "string") throw new Error("Durable session membership requires a physical database");
	return {
		kind: "session-membership-facts",
		identity,
		birthtime,
		facts: readSessionMembershipRowsInDatabase(database, sessionKeys)
	};
}
/** Connection-bound catalog rows; the transport supplies its own store identity. */
function readSessionMembershipRowsInDatabase(database, sessionKeys) {
	if (sessionKeys?.length === 0) return [];
	return withSqlitePostCommitPublications(sqlPublicationAnchor(database.db), () => runSqliteReadSnapshotSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		let entries = selectSessionEntryRows(database, "list").select("updated_at").orderBy("session_key");
		let members = getSessionKysely(database.db).selectFrom("session_members").select(["session_key", "identity_id"]).orderBy("session_key").orderBy("identity_id");
		if (sessionKeys) {
			entries = entries.where("session_key", "in", sqliteStringSet(sessionKeys));
			members = members.where("session_key", "in", sqliteStringSet(sessionKeys));
		}
		const facts = /* @__PURE__ */ new Map();
		const readableKeys = [];
		for (const row of executeSqliteQuerySync(database.db, entries).rows) {
			const entry = parseSessionEntryJson(row, "list");
			if (!entry) continue;
			const internal = isInternalSessionEffectsKey(row.session_key);
			if (!internal) validateDeliveryCanonicalSessionEntry(row.session_key, entry);
			readableKeys.push(row.session_key);
			facts.set(row.session_key, [
				row.session_key,
				internal ? null : normalizeOptionalString(entry.category) ?? null,
				[],
				{},
				entry.sessionId
			]);
		}
		const memberships = /* @__PURE__ */ new Map();
		for (const row of executeSqliteQuerySync(database.db, members).rows) {
			const values = memberships.get(row.session_key) ?? [];
			values.push(row.identity_id);
			memberships.set(row.session_key, values);
		}
		for (const [sessionKey, values] of memberships) {
			const current = facts.get(sessionKey);
			facts.set(sessionKey, [
				sessionKey,
				current?.[1] ?? null,
				values,
				current?.[3] ?? {},
				current?.[4] ?? null
			]);
		}
		for (const [sessionKey, records] of participantRecordsBySessionKey(database.db, readableKeys)) {
			const current = facts.get(sessionKey);
			facts.set(sessionKey, [
				sessionKey,
				current?.[1] ?? null,
				current?.[2] ?? [],
				{
					participants: records.map(({ identity: participantIdentity }) => ({ identity: participantIdentity })),
					participantCount: records.length
				},
				current?.[4] ?? null
			]);
		}
		return [...facts.values()];
	}));
}
//#endregion
export { readSessionMembershipFactsInDatabase };
