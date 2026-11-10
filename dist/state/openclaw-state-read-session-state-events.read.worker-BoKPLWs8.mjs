import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { n as normalizeSqliteNumber } from "./openclaw-state-read-sqlite-number-DZt1m75H.mjs";
import { r as runSqliteDeferredTransactionSync } from "./openclaw-state-read-sqlite-transaction-gPY-7Ojc.mjs";
import { b as SESSION_WATCH_PROVENANCE_AMBIENT_GROUP } from "./openclaw-state-read.worker.js";
import { f as getSessionStateKysely, h as isSessionStateWatchAddress, m as rowToSessionStateEvent, p as normalizeOptionalSqliteNumber } from "./openclaw-state-read-openclaw-state-read-handlers-BUnsgff9.mjs";
//#region src/sessions/session-state-events.read.worker.ts
const sessionStateReadOperations = {
	"sessionState.pendingNotices": (_input, db) => ({
		type: "sessionState.pendingNotices",
		cursors: executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").selectAll().whereRef("material_sequence", ">", "last_seen_sequence")).rows.map((row) => ({
			watcherSessionKey: row.watcher_session_key,
			targetSessionKey: row.target_session_key,
			watcherStorePath: row.watcher_store_path ?? null
		})).filter(isSessionStateWatchAddress)
	}),
	"sessionState.ambientTargets": (input, db) => ({
		type: "sessionState.ambientTargets",
		targets: executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").select("target_session_key").where("watcher_session_key", "=", input.watcherSessionKey).where("provenance", "=", SESSION_WATCH_PROVENANCE_AMBIENT_GROUP)).rows.map((row) => row.target_session_key).filter((targetSessionKey) => isSessionStateWatchAddress({
			watcherSessionKey: input.watcherSessionKey,
			targetSessionKey
		}))
	}),
	"sessionState.versions": (refs, db) => {
		const keys = [...new Set(refs.map((ref) => ref.sessionKey).filter(Boolean))];
		const versions = /* @__PURE__ */ new Map();
		for (let offset = 0; offset < keys.length; offset += 500) {
			const rows = executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select([
				"session_key",
				"agent_id",
				"last_sequence"
			]).where("session_key", "in", keys.slice(offset, offset + 500))).rows;
			for (const row of rows) {
				let sessions = versions.get(row.agent_id);
				if (!sessions) {
					sessions = /* @__PURE__ */ new Map();
					versions.set(row.agent_id, sessions);
				}
				sessions.set(row.session_key, normalizeSqliteNumber(row.last_sequence) ?? 0);
			}
		}
		return {
			type: "sessionState.versions",
			versions: Object.fromEntries([...versions].map(([agentId, sessions]) => [agentId, Object.fromEntries(sessions)]))
		};
	},
	"sessionState.events": (input, db) => runSqliteDeferredTransactionSync(db, () => {
		const { sessionKey, agentId, afterSequence } = input;
		const boundedLimit = Math.max(1, Math.min(200, Math.floor(input.limit)));
		const kysely = getSessionStateKysely(db);
		const rows = executeSqliteQuerySync(db, kysely.selectFrom("session_state_events").selectAll().where("session_key", "=", sessionKey).where("agent_id", "=", agentId).where("sequence", ">", afterSequence).orderBy("sequence", "asc").limit(boundedLimit + 1)).rows;
		const earliest = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_state_events").select((eb) => eb.fn.min("sequence").as("sequence")).where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
		const headRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_state_heads").select(["last_sequence", "pruned_max_sequence"]).where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
		const head = normalizeOptionalSqliteNumber(headRow?.last_sequence) ?? 0;
		const prunedMax = normalizeOptionalSqliteNumber(headRow?.pruned_max_sequence) ?? 0;
		return {
			type: "sessionState.events",
			page: {
				events: rows.slice(0, boundedLimit).map(rowToSessionStateEvent),
				truncated: rows.length > boundedLimit,
				earliestAvailableSequence: normalizeOptionalSqliteNumber(earliest?.sequence) ?? (head > 0 ? head + 1 : 0),
				historyGap: afterSequence < prunedMax
			}
		};
	})
};
//#endregion
export { sessionStateReadOperations };
