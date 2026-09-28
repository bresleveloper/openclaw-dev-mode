import crypto from "node:crypto";
//#region src/config/sessions/session-entry-json.ts
function hasValidSessionEntryIdentity(entry) {
	return typeof entry.sessionId === "string" && typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt);
}
function parseSqliteSessionEntryRecord(row) {
	try {
		const parsed = JSON.parse(row.entry_json);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
		const record = parsed;
		if (!hasValidSessionEntryIdentity(record)) return null;
		if (row.current_session_id !== void 0 && row.current_session_id !== record.sessionId || row.updated_at !== void 0 && row.updated_at !== record.updatedAt) return null;
		return record;
	} catch {
		return null;
	}
}
//#endregion
//#region src/routing/conversation-ref.ts
/** Canonicalizes an adapter target into the peer id used by inbound routing. */
function normalizeConversationPeerId(channel, value) {
	let normalized = value.trim();
	const channelPrefix = `${channel.trim().toLowerCase()}:`;
	if (normalized.toLowerCase().startsWith(channelPrefix)) normalized = normalized.slice(channelPrefix.length).trim();
	return normalized.replace(/^(user|channel|group|conversation|room|dm|thread):/i, "").trim();
}
/** Builds an opaque address from canonical transport identity, never from model-session state. */
function buildConversationRef(params) {
	return `conv_${crypto.createHash("sha256").update(JSON.stringify([
		params.channel,
		params.accountId,
		params.kind,
		params.peerId,
		params.parentConversationRef ?? "",
		params.threadId ?? ""
	])).digest("hex").slice(0, 32)}`;
}
//#endregion
export { parseSqliteSessionEntryRecord as i, normalizeConversationPeerId as n, hasValidSessionEntryIdentity as r, buildConversationRef as t };
