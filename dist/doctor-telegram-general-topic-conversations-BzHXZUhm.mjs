import { n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as buildConversationRef } from "./conversation-ref-8kIjGCCc.mjs";
import { f as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CaQAStOA.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite, l as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-Dmb8-YXN.mjs";
import { f as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { i as projectExistingAgentDatabaseTargets } from "./doctor-session-sqlite-readers-un_PyUoF.mjs";
import { t as runDoctorAgentDatabaseOperation } from "./doctor-agent-database-operation-D6qFKdT4.mjs";
//#region src/commands/doctor-telegram-general-topic-conversations.ts
/** Doctor repair for Telegram General-topic conversation identities written before #113063. */
const GENERAL_TOPIC_ID = "1";
const LEGACY_GENERAL_TARGET = /^telegram:(-?\d+):topic:1$/u;
function canonicalIdentity(row) {
	const targetMatch = LEGACY_GENERAL_TARGET.exec(row.delivery_target);
	if (row.channel !== "telegram" || row.kind !== "group" || row.thread_id !== GENERAL_TOPIC_ID || row.parent_conversation_id !== null || !targetMatch || row.peer_id !== `${targetMatch[1]}:topic:${GENERAL_TOPIC_ID}`) return null;
	const peerId = targetMatch[1];
	return {
		conversationId: buildConversationRef({
			channel: row.channel,
			accountId: row.account_id,
			kind: "group",
			peerId,
			threadId: GENERAL_TOPIC_ID
		}),
		deliveryTarget: `telegram:${peerId}`,
		peerId
	};
}
function listLegacyRows(database) {
	const db = getSessionKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("conversations").selectAll().where("channel", "=", "telegram").where("kind", "=", "group").where("thread_id", "=", GENERAL_TOPIC_ID).where("parent_conversation_id", "is", null)).rows.filter((row) => canonicalIdentity(row) !== null);
}
function resolveRepairScopes(cfg, env) {
	return projectExistingAgentDatabaseTargets(resolveAllAgentSessionStoreTargetsSync(cfg, { env }), env, cfg).map((target) => {
		return {
			scope: resolveSqliteReadScope({
				agentId: target.agentId,
				env,
				storePath: target.storePath
			}),
			storePath: target.storePath
		};
	});
}
/** Finds stale General-topic rows without creating or migrating agent databases. */
function detectTelegramGeneralTopicConversationRepairs(params) {
	const env = params.env ?? process.env;
	return resolveRepairScopes(params.cfg, env).flatMap(({ scope, storePath }) => {
		const databaseOptions = toDatabaseOptions(scope);
		const inspected = runDoctorAgentDatabaseOperation({
			agentId: scope.agentId,
			path: databaseOptions.path ?? storePath,
			run: () => withOpenClawAgentDatabaseReadOnly((database) => listLegacyRows(database.db).flatMap((row) => {
				const canonical = canonicalIdentity(row);
				return canonical && canonical.conversationId !== row.conversation_id ? [{
					agentId: scope.agentId,
					canonicalConversationId: canonical.conversationId,
					legacyConversationId: row.conversation_id,
					storePath
				}] : [];
			}), databaseOptions)
		});
		return inspected.ok && inspected.value.found ? inspected.value.value : [];
	});
}
const roleRank = {
	related: 0,
	participant: 1,
	primary: 2
};
function canonicalizeLegacySessionEntry(entry, legacyTarget, canonicalTarget) {
	const delivery = entry.delivery;
	if (delivery?.kind !== "external" || delivery.context.channel !== "telegram" || String(delivery.context.threadId) !== GENERAL_TOPIC_ID || delivery.context.to !== legacyTarget) return null;
	return {
		...entry,
		delivery: {
			...delivery,
			context: {
				...delivery.context,
				to: canonicalTarget
			},
			route: {
				...delivery.route,
				target: {
					...delivery.route.target,
					to: canonicalTarget,
					...delivery.route.target?.rawTo === legacyTarget ? { rawTo: canonicalTarget } : {}
				}
			},
			origin: delivery.origin.to === legacyTarget ? {
				...delivery.origin,
				to: canonicalTarget
			} : delivery.origin
		}
	};
}
function repairLegacyRow(database, legacyConversationId) {
	const db = getSessionKysely(database.db);
	const legacy = executeSqliteQuerySync(database.db, db.selectFrom("conversations").selectAll().where("conversation_id", "=", legacyConversationId)).rows[0];
	const canonical = legacy ? canonicalIdentity(legacy) : null;
	if (!legacy || !canonical || canonical.conversationId === legacy.conversation_id) return false;
	const existing = executeSqliteQuerySync(database.db, db.selectFrom("conversations").selectAll().where("conversation_id", "=", canonical.conversationId)).rows[0];
	if (existing && (existing.channel !== "telegram" || existing.account_id !== legacy.account_id || existing.kind !== "group" || existing.peer_id !== canonical.peerId || existing.thread_id !== GENERAL_TOPIC_ID || existing.parent_conversation_id !== null)) throw new Error(`canonical Telegram conversation id collision: ${canonical.conversationId}`);
	const merged = existing ?? legacy;
	executeSqliteQuerySync(database.db, db.insertInto("conversations").values({
		...merged,
		conversation_id: canonical.conversationId,
		peer_id: canonical.peerId,
		delivery_target: canonical.deliveryTarget,
		created_at: Math.min(existing?.created_at ?? legacy.created_at, legacy.created_at),
		updated_at: Math.max(existing?.updated_at ?? legacy.updated_at, legacy.updated_at),
		native_channel_id: existing?.native_channel_id ?? legacy.native_channel_id,
		native_direct_user_id: existing?.native_direct_user_id ?? legacy.native_direct_user_id,
		label: existing?.label ?? legacy.label,
		metadata_json: existing?.metadata_json ?? legacy.metadata_json
	}).onConflict((conflict) => conflict.column("conversation_id").doUpdateSet({
		created_at: Math.min(existing?.created_at ?? legacy.created_at, legacy.created_at),
		updated_at: Math.max(existing?.updated_at ?? legacy.updated_at, legacy.updated_at),
		native_channel_id: existing?.native_channel_id ?? legacy.native_channel_id,
		native_direct_user_id: existing?.native_direct_user_id ?? legacy.native_direct_user_id,
		label: existing?.label ?? legacy.label,
		metadata_json: existing?.metadata_json ?? legacy.metadata_json
	})));
	const boundWindows = executeSqliteQuerySync(database.db, db.selectFrom("session_conversations as sc").innerJoin("session_windows as sw", "sw.session_id", "sc.session_id").select(["sw.session_id", "sw.session_key"]).where("sc.conversation_id", "=", legacy.conversation_id)).rows;
	for (const window of boundWindows) {
		const current = readExactSessionEntryRow(database, window.session_key);
		if (!current || current.entry.sessionId !== window.session_id) continue;
		const normalized = canonicalizeLegacySessionEntry(current.entry, legacy.delivery_target, canonical.deliveryTarget);
		if (normalized) writeSessionEntry(database, window.session_key, normalized, { previousEntry: current.entry });
	}
	const conversationIds = [legacy.conversation_id, canonical.conversationId];
	const bindings = executeSqliteQuerySync(database.db, db.selectFrom("session_conversations").selectAll().where("conversation_id", "in", conversationIds)).rows;
	const mergedBindings = /* @__PURE__ */ new Map();
	for (const binding of bindings) {
		const current = mergedBindings.get(binding.session_id);
		const currentRank = roleRank[current?.role] ?? -1;
		const selected = (roleRank[binding.role] ?? -1) > currentRank ? binding : current ?? binding;
		mergedBindings.set(binding.session_id, {
			...selected,
			conversation_id: canonical.conversationId,
			first_seen_at: Math.min(current?.first_seen_at ?? binding.first_seen_at, binding.first_seen_at),
			last_seen_at: Math.max(current?.last_seen_at ?? binding.last_seen_at, binding.last_seen_at)
		});
	}
	executeSqliteQuerySync(database.db, db.deleteFrom("session_conversations").where("conversation_id", "in", conversationIds));
	if (mergedBindings.size > 0) executeSqliteQuerySync(database.db, db.insertInto("session_conversations").values([...mergedBindings.values()]));
	executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({ primary_conversation_id: canonical.conversationId }).where("primary_conversation_id", "=", legacy.conversation_id));
	executeSqliteQuerySync(database.db, db.updateTable("conversation_deliveries").set({ conversation_id: canonical.conversationId }).where("conversation_id", "=", legacy.conversation_id));
	executeSqliteQuerySync(database.db, db.updateTable("conversations").set({ parent_conversation_id: canonical.conversationId }).where("parent_conversation_id", "=", legacy.conversation_id));
	executeSqliteQuerySync(database.db, db.deleteFrom("conversations").where("conversation_id", "=", legacy.conversation_id));
	return true;
}
/** Canonicalizes stale rows and merges every durable reference in one transaction per agent DB. */
async function repairTelegramGeneralTopicConversations(params) {
	const env = params.env ?? process.env;
	let repaired = 0;
	for (const { scope } of resolveRepairScopes(params.cfg, env)) await runExclusiveSqliteSessionWrite(scope, async () => {
		repaired += runOpenClawAgentWriteTransaction((database) => {
			let databaseRepairs = 0;
			for (const row of listLegacyRows(database.db)) if (repairLegacyRow(database, row.conversation_id)) databaseRepairs += 1;
			return databaseRepairs;
		}, toDatabaseOptions(scope), { operationLabel: "doctor-telegram-general-topic" });
	}, "doctor-telegram-general-topic");
	return repaired;
}
//#endregion
export { detectTelegramGeneralTopicConversationRepairs, repairTelegramGeneralTopicConversations };
