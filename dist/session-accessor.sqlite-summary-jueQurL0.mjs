import { o as iterateSqliteQuerySync, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { a as withSqlitePostCommitPublications } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as sessionEntrySnapshotColumns } from "./session-entry-snapshots-DO3oGsuC.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { o as projectSqliteSessionParticipantsBatch, t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { r as parseSessionEntryJson } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { d as readWithCanonicalSessionReaderContinuation, g as canonicalSessionKeyMigrationRequiredError, r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-D1TSJMmX.mjs";
//#region src/config/sessions/session-accessor.sqlite-summary.ts
/** Reads counts and bounded recent session payloads without warming the store cache. */
function readSessionStoreSummaryReadOnly(scope, options) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const summary = {
		count: 0,
		recent: [],
		byAgent: new Map(options.agentIds.map((agentId) => [agentId, {
			count: 0,
			recent: []
		}]))
	};
	const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, options.continuation, () => withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const db = getSessionKysely(database.db);
		const batchSize = Math.min(128, Math.max(1, Math.ceil(options.recentLimit) || 1) * Math.max(1, summary.byAgent.size));
		let candidates = [];
		const readCandidates = () => {
			if (candidates.length === 0) return;
			const rows = candidates;
			candidates = [];
			const storedRows = new Map(executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").selectAll().select(sessionEntrySnapshotColumns).where("session_key", "in", sqliteStringSet(rows.map((row) => row.sessionKey)))).rows.map((row) => [row.session_key, row]));
			const selectedEntries = [];
			for (const { sessionKey, entryValid, agent } of rows) {
				const needsRecent = summary.recent.length < options.recentLimit || agent !== void 0 && agent.recent.length < options.recentLimit;
				if (entryValid === 1 && !needsRecent) {
					summary.count += 1;
					if (agent) agent.count += 1;
					continue;
				}
				const stored = storedRows.get(sessionKey);
				if (!stored) continue;
				const { current_session_id: _currentSessionId, ...listRow } = stored;
				const entry = parseSessionEntryJson(listRow);
				if (!entry) continue;
				summary.count += 1;
				const selected = {
					sessionKey,
					entry
				};
				selectedEntries.push(selected);
				if (summary.recent.length < options.recentLimit) summary.recent.push(selected);
				if (agent) {
					agent.count += 1;
					if (agent.recent.length < options.recentLimit) agent.recent.push(selected);
				}
			}
			if (selectedEntries.length === 0) return;
			const projected = projectSqliteSessionParticipantsBatch(database.db, new Map(selectedEntries.map(({ sessionKey, entry }) => [sessionKey, entry])));
			for (const { sessionKey, entry } of selectedEntries) {
				Object.assign(entry, projected.get(sessionKey));
				const deliveryCanonicalKey = resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry);
				if (deliveryCanonicalKey !== sessionKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${deliveryCanonicalKey}`);
			}
		};
		for (const row of iterateSqliteQuerySync(database.db, db.selectFrom("session_nodes").select(["session_key", "entry_valid"]).orderBy("updated_at", "desc").orderBy("session_key", "asc"))) {
			const owner = parseAgentSessionKey(row.session_key)?.agentId;
			if (!owner || isInternalSessionEffectsKey(row.session_key)) continue;
			const agent = summary.byAgent.get(owner);
			if (row.entry_valid === 1 && summary.recent.length >= options.recentLimit && (!agent || agent.recent.length >= options.recentLimit)) {
				summary.count += 1;
				if (agent) agent.count += 1;
				continue;
			}
			candidates.push({
				sessionKey: row.session_key,
				entryValid: row.entry_valid,
				agent
			});
			if (candidates.length >= batchSize) readCandidates();
		}
		readCandidates();
		return summary;
	}))), toDatabaseOptions(resolved));
	return result.found ? result.value : summary;
}
//#endregion
export { readSessionStoreSummaryReadOnly as t };
