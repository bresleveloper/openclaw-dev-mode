import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as parseStoredConversationRouteContext } from "./conversation-route-context-ulGSQNwr.mjs";
import { n as selectUniqueConversationRows, t as normalizeStoredConversationRef } from "./conversation-record-policy-Be1VfHuC.mjs";
import { n as parseSessionEntryJson } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
//#region src/config/sessions/session-accessor.sqlite-conversation-read.ts
function selectConversationRowsFromDatabase(database, options = {}) {
	let query = getNodeSqliteKysely(database.db).selectFrom("conversations as c").leftJoin("session_conversations as sc", "sc.conversation_id", "c.conversation_id").leftJoin("session_windows as s", "s.session_id", "sc.session_id").leftJoin("session_nodes as sn", "sn.session_key", "s.session_key").select([
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
		"c.created_at as conversation_created_at",
		"c.updated_at as conversation_updated_at",
		"sc.role",
		"sc.route_context_json",
		"sc.first_seen_at",
		"sc.last_seen_at",
		"s.session_id as associated_session_id",
		"sn.current_session_id as current_session_id",
		"sn.entry_json as current_entry_json",
		"sn.session_key as current_session_key"
	]);
	const channel = normalizeOptionalLowercaseString(options.channel);
	if (channel) query = query.where("c.channel", "=", channel);
	if (options.conversationRef !== void 0) query = query.where("c.conversation_id", "=", normalizeStoredConversationRef(options.conversationRef));
	if (options.conversationRefs !== void 0) query = query.where("c.conversation_id", "in", sqliteStringSet(options.conversationRefs.map(normalizeStoredConversationRef)));
	if (options.currentSession) query = query.where("sn.session_key", "=", options.currentSession.sessionKey).where("s.session_id", "=", options.currentSession.sessionId);
	if (options.primarySession) query = query.where("s.session_id", "=", options.primarySession.sessionId).where("s.session_key", "=", options.primarySession.sessionKey).where("sn.current_session_id", "=", options.primarySession.sessionId).where("sn.entry_valid", "=", 1).whereRef("s.primary_conversation_id", "=", "c.conversation_id").where("sc.role", "=", "primary");
	if (options.currentBindingOnly) query = query.whereRef("s.session_id", "=", "sn.current_session_id").where("sn.entry_valid", "=", 1).where((eb) => eb.or([eb("sc.role", "=", "participant"), eb.and([eb("sc.role", "=", "primary"), eb("s.primary_conversation_id", "=", eb.ref("c.conversation_id"))])]));
	const rows = executeSqliteQuerySync(database.db, query.orderBy((eb) => eb.fn.coalesce("sc.last_seen_at", "c.updated_at"), "desc").orderBy("sn.updated_at", "desc")).rows;
	const mapConversationRow = (row) => {
		if (row.kind !== "direct" && row.kind !== "group" && row.kind !== "channel") return null;
		const role = row.role === "primary" || row.role === "participant" || row.role === "related" ? row.role : void 0;
		const hasCurrentBinding = (row.current_entry_json ? parseSessionEntryJson({ entry_json: row.current_entry_json }) : null)?.sessionId === row.current_session_id;
		const associationIsCurrent = hasCurrentBinding && row.associated_session_id === row.current_session_id;
		const routeContext = parseStoredConversationRouteContext(row.route_context_json, row.last_seen_at);
		return {
			associationIsCurrent,
			record: {
				conversationRef: row.conversation_id,
				channel: row.channel,
				accountId: row.account_id,
				kind: row.kind,
				peerId: row.peer_id,
				target: row.delivery_target,
				...row.parent_conversation_id ? { parentConversationRef: row.parent_conversation_id } : {},
				...row.thread_id ? { threadId: row.thread_id } : {},
				...row.native_channel_id ? { nativeChannelId: row.native_channel_id } : {},
				...row.native_direct_user_id ? { nativeDirectUserId: row.native_direct_user_id } : {},
				...row.label ? { label: row.label } : {},
				...role && hasCurrentBinding && row.current_session_id && row.current_session_key ? {
					sessionId: row.current_session_id,
					sessionKey: row.current_session_key,
					role
				} : {},
				...role ? { observedFromSession: true } : {},
				...routeContext ? { routeContextObserved: true } : {},
				...routeContext?.context ? { routeContext: routeContext.context } : {},
				firstSeenAt: row.first_seen_at ?? row.conversation_created_at,
				lastSeenAt: row.last_seen_at ?? row.conversation_updated_at
			}
		};
	};
	return selectUniqueConversationRows(rows, {
		conversationRef: (row) => row.conversation_id,
		map: mapConversationRow,
		limit: options.limit
	});
}
function resolveConversationInDatabase(database, conversationRef) {
	return selectConversationRowsFromDatabase(database, {
		conversationRef,
		limit: 1
	})[0];
}
//#endregion
export { selectConversationRowsFromDatabase as n, resolveConversationInDatabase as t };
