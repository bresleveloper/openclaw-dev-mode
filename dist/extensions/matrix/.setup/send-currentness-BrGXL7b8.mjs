import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { AsyncLocalStorage } from "node:async_hooks";
//#region extensions/matrix/src/matrix/reaction-common.ts
const MATRIX_ANNOTATION_RELATION_TYPE = "m.annotation";
const MATRIX_REACTION_EVENT_TYPE = "m.reaction";
function normalizeMatrixReactionMessageId(messageId) {
	const normalized = messageId.trim();
	if (!normalized) throw new Error("Matrix reaction requires a messageId");
	return normalized;
}
function normalizeMatrixReactionEmoji(emoji) {
	const normalized = emoji.trim();
	if (!normalized) throw new Error("Matrix reaction requires an emoji");
	return normalized;
}
function buildMatrixReactionContent(messageId, emoji) {
	return { "m.relates_to": {
		rel_type: MATRIX_ANNOTATION_RELATION_TYPE,
		event_id: normalizeMatrixReactionMessageId(messageId),
		key: normalizeMatrixReactionEmoji(emoji)
	} };
}
function buildMatrixReactionRelationsPath(roomId, messageId) {
	return `/_matrix/client/v1/rooms/${encodeURIComponent(roomId)}/relations/${encodeURIComponent(normalizeMatrixReactionMessageId(messageId))}/${MATRIX_ANNOTATION_RELATION_TYPE}/${MATRIX_REACTION_EVENT_TYPE}`;
}
function extractMatrixReactionAnnotation(content) {
	if (!content || typeof content !== "object") return;
	const relatesTo = content["m.relates_to"];
	if (!relatesTo || typeof relatesTo !== "object") return;
	if (typeof relatesTo.rel_type === "string" && relatesTo.rel_type !== "m.annotation") return;
	const key = normalizeOptionalString(relatesTo.key) ?? "";
	if (!key) return;
	return {
		key,
		eventId: (normalizeOptionalString(relatesTo.event_id) ?? "") || void 0
	};
}
function extractMatrixReactionKey(content) {
	return extractMatrixReactionAnnotation(content)?.key;
}
function summarizeMatrixReactionEvents(events) {
	const summaries = /* @__PURE__ */ new Map();
	for (const event of events) {
		const key = extractMatrixReactionKey(event.content);
		if (!key) continue;
		const sender = normalizeOptionalString(event.sender) ?? "";
		const entry = summaries.get(key) ?? {
			key,
			count: 0,
			users: []
		};
		entry.count += 1;
		if (sender && !entry.users.includes(sender)) entry.users.push(sender);
		summaries.set(key, entry);
	}
	return Array.from(summaries.values());
}
function selectOwnMatrixReactionEventIds(events, userId, emoji) {
	const senderId = normalizeOptionalString(userId) ?? "";
	if (!senderId) return [];
	const targetEmoji = normalizeOptionalString(emoji);
	const ids = [];
	for (const event of events) {
		if ((normalizeOptionalString(event.sender) ?? "") !== senderId) continue;
		if (targetEmoji && extractMatrixReactionKey(event.content) !== targetEmoji) continue;
		const eventId = normalizeOptionalString(event.event_id);
		if (eventId) ids.push(eventId);
	}
	return ids;
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/send-currentness.ts
const sendCurrentness = new AsyncLocalStorage();
function withMatrixSendCurrentness(client, assertCurrent, run) {
	assertCurrent();
	return sendCurrentness.run({
		client,
		assertCurrent
	}, run);
}
function captureMatrixSendCurrentness(client) {
	const scope = sendCurrentness.getStore();
	return scope?.client === client ? scope.assertCurrent : void 0;
}
/** Shared sync and crypto work belongs to the client generation, not a sender. */
function withoutMatrixSendCurrentness(run) {
	return sendCurrentness.exit(run);
}
//#endregion
export { MATRIX_REACTION_EVENT_TYPE as a, extractMatrixReactionAnnotation as c, MATRIX_ANNOTATION_RELATION_TYPE as i, selectOwnMatrixReactionEventIds as l, withMatrixSendCurrentness as n, buildMatrixReactionContent as o, withoutMatrixSendCurrentness as r, buildMatrixReactionRelationsPath as s, captureMatrixSendCurrentness as t, summarizeMatrixReactionEvents as u };
