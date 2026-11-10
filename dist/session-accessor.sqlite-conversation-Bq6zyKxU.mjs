import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { f as sqliteStringSetEntries, i as executeSqliteQuerySync, r as encodeSqliteStringSet } from "./kysely-sync-9fPQaMlh.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as serializeStoredConversationRouteContext, i as refreshStoredConversationRouteContext, n as parseConversationRouteContext } from "./conversation-route-context-ulGSQNwr.mjs";
import { n as conversationIdentityFromSessionEntry } from "./conversation-identity-BApT92qN.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as conversationPublication } from "./session-accessor.sqlite-conversation-publication-BbZ3cmHn.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-conversation.ts
/** Keeps a previously observed route peer when a generic session writer has no route facts. */
function preserveSessionConversationIdentity(params) {
	if (params.sessionIds.length === 0) return params.identity;
	const db = getSessionKysely(params.database.db);
	const row = executeSqliteQuerySync(params.database.db, db.selectFrom("session_conversations as sc").innerJoin("conversations as c", "c.conversation_id", "sc.conversation_id").select([
		"c.conversation_id",
		"c.channel",
		"c.account_id",
		"c.kind",
		"c.peer_id",
		"c.delivery_target",
		"c.parent_conversation_id",
		"c.thread_id",
		"c.native_channel_id",
		"c.native_direct_user_id",
		"c.label",
		"c.metadata_json"
	]).where("sc.session_id", "in", params.sessionIds).where("c.channel", "=", params.identity.channel).where("c.account_id", "=", params.identity.accountId).where("c.kind", "=", params.identity.kind).where("c.delivery_target", "=", params.identity.deliveryTarget).where("sc.role", "in", ["primary", "participant"]).where("c.thread_id", params.identity.threadId ? "=" : "is", params.identity.threadId ?? null).orderBy("sc.last_seen_at", "desc").limit(1)).rows[0];
	const metadata = row?.metadata_json ? safeParseJsonRecord(row.metadata_json) : void 0;
	return row ? {
		conversationRef: row.conversation_id,
		channel: row.channel,
		accountId: row.account_id,
		kind: params.identity.kind,
		peerId: row.peer_id,
		deliveryTarget: row.delivery_target,
		...row.parent_conversation_id ? { parentConversationRef: row.parent_conversation_id } : {},
		...row.thread_id ? { threadId: row.thread_id } : {},
		...row.native_channel_id ? { nativeChannelId: row.native_channel_id } : {},
		...row.native_direct_user_id ? { nativeDirectUserId: row.native_direct_user_id } : {},
		...params.identity.label ?? row.label ? { label: params.identity.label ?? row.label } : {},
		...metadata ? { metadata } : {}
	} : params.identity;
}
/** Shared-main DMs multiplex peers through one context; every other routed session has one primary. */
function prepareSessionConversationForWrite(params) {
	if (!params.observeConversation && params.routeContext === void 0 && params.canonicalPreviousEntry?.sessionId === params.entry.sessionId && params.canonicalPreviousEntry.lifecycleRevision === params.entry.lifecycleRevision && params.previousWindow?.session_id === params.entry.sessionId && params.previousWindow.session_scope === params.sessionScope && isDeepStrictEqual(conversationIdentityFromSessionEntry(params.entry), conversationIdentityFromSessionEntry(params.canonicalPreviousEntry))) return {
		conversation: null,
		primaryConversationId: params.previousWindow.primary_conversation_id
	};
	const routeContext = params.routeContext === null ? null : params.routeContext === void 0 ? void 0 : parseConversationRouteContext(params.routeContext);
	if (params.routeContext !== void 0 && params.routeContext !== null && !routeContext) throw new Error("Invalid conversation route context");
	const identity = conversationIdentityFromSessionEntry(params.entry, routeContext);
	if (!identity) return {
		conversation: null,
		primaryConversationId: null
	};
	const conversation = {
		identity: routeContext === void 0 ? preserveSessionConversationIdentity({
			database: params.database,
			identity,
			sessionIds: [params.entry.sessionId, params.previousEntry?.sessionId].filter((sessionId) => Boolean(sessionId))
		}) : identity,
		role: params.sessionScope === "shared-main" && identity.kind === "direct" ? "participant" : "primary",
		...routeContext !== void 0 ? { routeContext } : {}
	};
	return {
		conversation,
		primaryConversationId: conversation.role === "primary" ? conversation.identity.conversationRef : null
	};
}
function prepareConversationIdentities(identities) {
	if (!identities.length) return;
	const current = new Map(identities.map((identity) => [identity.conversationRef, identity]));
	return encodeSqliteStringSet([...current.values()].flatMap((identity) => [
		identity.conversationRef,
		identity.channel,
		identity.accountId,
		identity.kind,
		identity.peerId,
		identity.deliveryTarget,
		identity.parentConversationRef ?? null,
		identity.threadId ?? null,
		identity.nativeChannelId ?? null,
		identity.nativeDirectUserId ?? null,
		identity.label ?? null,
		identity.metadata ? JSON.stringify(identity.metadata) : null
	]));
}
/** Upserts addresses before session rows so their primary-conversation FKs remain valid. */
function upsertConversationIdentities(database, encoded, updatedAt) {
	if (encoded === void 0) return;
	const db = getSessionKysely(database.db);
	const columns = [
		"conversation_id",
		"channel",
		"account_id",
		"kind",
		"peer_id",
		"delivery_target",
		"parent_conversation_id",
		"thread_id",
		"native_channel_id",
		"native_direct_user_id",
		"label",
		"metadata_json"
	];
	const fields = sqliteStringSetEntries(encoded).as("field");
	const rows = executeSqliteQuerySync(database.db, db.insertInto("conversations").columns([
		...columns,
		"created_at",
		"updated_at"
	]).expression((query) => query.selectFrom(fields).select((eb) => [
		...columns.map((column, index) => eb.fn.max(eb.case().when(eb("field.key", "%", columns.length), "=", index).then(eb.ref("field.value")).end()).as(column)),
		eb.val(updatedAt).as("created_at"),
		eb.val(updatedAt).as("updated_at")
	]).where("field.key", ">=", 0).groupBy((eb) => eb.cast(eb("field.key", "/", columns.length), "integer")).orderBy((eb) => eb.cast(eb("field.key", "/", columns.length), "integer"))).onConflict((conflict) => conflict.column("conversation_id").doUpdateSet((eb) => ({
		channel: eb.ref("excluded.channel"),
		account_id: eb.ref("excluded.account_id"),
		kind: eb.ref("excluded.kind"),
		peer_id: eb.ref("excluded.peer_id"),
		delivery_target: eb.ref("excluded.delivery_target"),
		parent_conversation_id: eb.ref("excluded.parent_conversation_id"),
		thread_id: eb.ref("excluded.thread_id"),
		native_channel_id: eb.ref("excluded.native_channel_id"),
		native_direct_user_id: eb.ref("excluded.native_direct_user_id"),
		label: eb.ref("excluded.label"),
		metadata_json: eb.ref("excluded.metadata_json"),
		updated_at: updatedAt
	}))).returningAll()).rows;
	return conversationPublication.stageRows(database, { catalogues: rows });
}
/** Links one external address to its local context without conflating the two identities. */
function linkSessionConversation(params) {
	const { database, sessionId, conversation, updatedAt } = params;
	const db = getSessionKysely(database.db);
	const readAssociation = (candidateSessionId) => executeSqliteQuerySync(database.db, db.selectFrom("session_conversations").select(["last_seen_at", "route_context_json"]).where("session_id", "=", candidateSessionId).where("conversation_id", "=", conversation.identity.conversationRef).orderBy("last_seen_at", "desc").limit(1)).rows[0];
	const existingAssociation = conversation.routeContext === void 0 ? readAssociation(sessionId) ?? (params.previousSessionId && params.previousSessionId !== sessionId ? readAssociation(params.previousSessionId) : void 0) : void 0;
	const routeContextJson = conversation.routeContext === void 0 ? existingAssociation ? refreshStoredConversationRouteContext(existingAssociation.route_context_json, existingAssociation.last_seen_at, updatedAt) : null : serializeStoredConversationRouteContext(conversation.routeContext, updatedAt);
	const associations = [];
	const removedAssociations = [];
	if (conversation.role === "primary") {
		const stalePrimaryRows = executeSqliteQuerySync(database.db, db.deleteFrom("session_conversations").where("session_id", "=", sessionId).where("role", "=", "primary").where("conversation_id", "!=", conversation.identity.conversationRef).returningAll()).rows;
		if (stalePrimaryRows.length > 0) {
			const related = executeSqliteQuerySync(database.db, db.insertInto("session_conversations").values(stalePrimaryRows.map((row) => ({
				session_id: sessionId,
				conversation_id: row.conversation_id,
				role: "related",
				route_context_json: refreshStoredConversationRouteContext(row.route_context_json, row.last_seen_at, updatedAt),
				first_seen_at: row.first_seen_at,
				last_seen_at: updatedAt
			}))).onConflict((conflict) => conflict.columns([
				"session_id",
				"conversation_id",
				"role"
			]).doUpdateSet((eb) => ({
				route_context_json: eb.ref("excluded.route_context_json"),
				last_seen_at: updatedAt
			}))).returningAll()).rows;
			associations.push(...related);
			removedAssociations.push(...stalePrimaryRows);
		}
	}
	const removed = executeSqliteQuerySync(database.db, db.deleteFrom("session_conversations").where("session_id", "=", sessionId).where("conversation_id", "=", conversation.identity.conversationRef).where("role", "!=", conversation.role).returningAll()).rows;
	removedAssociations.push(...removed);
	const linked = executeSqliteQuerySync(database.db, db.insertInto("session_conversations").values({
		session_id: sessionId,
		conversation_id: conversation.identity.conversationRef,
		role: conversation.role,
		route_context_json: routeContextJson,
		first_seen_at: updatedAt,
		last_seen_at: updatedAt
	}).onConflict((conflict) => conflict.columns([
		"session_id",
		"conversation_id",
		"role"
	]).doUpdateSet({
		route_context_json: routeContextJson,
		last_seen_at: updatedAt
	})).returningAll()).rows;
	associations.push(...linked);
	conversationPublication.stageRows(database, {
		associations,
		removedAssociations
	});
}
//#endregion
export { upsertConversationIdentities as i, prepareConversationIdentities as n, prepareSessionConversationForWrite as r, linkSessionConversation as t };
