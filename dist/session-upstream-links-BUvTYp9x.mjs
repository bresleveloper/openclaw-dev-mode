import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { n as rowToSessionUpstreamLink } from "./session-upstream-links.kernel-C5eUuqC0.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/sessions/session-upstream-links.ts
const log = createSubsystemLogger("sessions/upstream-links");
function getSessionUpstreamKysely(db) {
	return getNodeSqliteKysely(db);
}
function upsertSessionUpstreamLink(input, options = {}) {
	const now = options.now ?? Date.now();
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			options.assertCommitAllowed?.();
			const written = executeSqliteQuerySync(db, getSessionUpstreamKysely(db).insertInto("session_upstream_links").values({
				session_key: input.sessionKey,
				agent_id: input.agentId,
				catalog_id: input.catalogId,
				host_id: input.hostId,
				thread_id: input.threadId,
				upstream_kind: input.upstreamKind,
				upstream_ref_json: JSON.stringify(input.upstreamRef),
				last_marker_json: JSON.stringify(input.marker),
				last_scanned_at: null,
				created_at: now,
				updated_at: now
			}).onConflict((conflict) => options.ifAbsent ? conflict.columns(["session_key", "agent_id"]).doNothing() : conflict.columns(["session_key", "agent_id"]).doUpdateSet((eb) => {
				const sourceChanged = eb.or([
					eb("session_upstream_links.thread_id", "!=", eb.ref("excluded.thread_id")),
					eb("session_upstream_links.host_id", "!=", eb.ref("excluded.host_id")),
					eb("session_upstream_links.upstream_kind", "!=", eb.ref("excluded.upstream_kind")),
					eb("session_upstream_links.upstream_ref_json", "!=", eb.ref("excluded.upstream_ref_json"))
				]);
				return {
					agent_id: input.agentId,
					catalog_id: input.catalogId,
					host_id: input.hostId,
					thread_id: input.threadId,
					upstream_kind: input.upstreamKind,
					upstream_ref_json: JSON.stringify(input.upstreamRef),
					last_marker_json: eb.case().when(sourceChanged).then(JSON.stringify(input.marker)).else(eb.ref("session_upstream_links.last_marker_json")).end(),
					last_scanned_at: eb.case().when(sourceChanged).then(null).else(eb.ref("session_upstream_links.last_scanned_at")).end(),
					updated_at: now
				};
			}))).numAffectedRows === 1n;
			options.assertCommitAllowed?.();
			return written;
		}, options);
	} catch (error) {
		if (options.ifAbsent) throw error;
		log.warn(`failed to upsert session upstream link: ${String(error)}`);
		return false;
	}
}
function readSessionUpstreamLink(sessionKey, agentId, options = {}) {
	try {
		const { db } = openOpenClawStateDatabase(options);
		const row = executeSqliteQuerySync(db, getSessionUpstreamKysely(db).selectFrom("session_upstream_links").selectAll().where("session_key", "=", sessionKey).where("agent_id", "=", agentId)).rows[0];
		return row ? rowToSessionUpstreamLink(row) : void 0;
	} catch (error) {
		log.warn(`failed to read session upstream link: ${String(error)}`);
		return;
	}
}
function deleteSessionUpstreamLink(sessionKey, agentId, options = {}) {
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			options.assertCommitAllowed?.();
			const kysely = getSessionUpstreamKysely(db);
			if (options.expected) {
				const row = executeSqliteQuerySync(db, kysely.selectFrom("session_upstream_links").selectAll().where("session_key", "=", sessionKey).where("agent_id", "=", agentId)).rows[0];
				if (!row) return "absent";
				if (!isDeepStrictEqual(rowToSessionUpstreamLink(row), options.expected)) return "changed";
			}
			executeSqliteQuerySync(db, kysely.deleteFrom("session_upstream_links").where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
			options.assertCommitAllowed?.();
			return "deleted";
		}, options);
	} catch (error) {
		if (options.expected) throw error;
		log.warn(`failed to delete session upstream link: ${String(error)}`);
		return;
	}
}
async function listWatchedSessionUpstreamLinks(options = {}) {
	const grouped = /* @__PURE__ */ new Map();
	try {
		const links = await executeOpenClawStateWorker(captureOpenClawStateWorkerContext(options), {
			type: "sessionUpstream.listWatched",
			input: void 0
		});
		const keyCounts = /* @__PURE__ */ new Map();
		for (const link of links) keyCounts.set(link.sessionKey, (keyCounts.get(link.sessionKey) ?? 0) + 1);
		for (const link of links) {
			if ((keyCounts.get(link.sessionKey) ?? 0) > 1) {
				log.warn(`skipping ambiguous upstream links for ${link.sessionKey}: multiple agents adopt the same key`);
				continue;
			}
			const catalogLinks = grouped.get(link.catalogId) ?? [];
			catalogLinks.push(link);
			grouped.set(link.catalogId, catalogLinks);
		}
	} catch (error) {
		log.warn(`failed to list watched session upstream links: ${String(error)}`);
	}
	return grouped;
}
//#endregion
export { upsertSessionUpstreamLink as i, listWatchedSessionUpstreamLinks as n, readSessionUpstreamLink as r, deleteSessionUpstreamLink as t };
