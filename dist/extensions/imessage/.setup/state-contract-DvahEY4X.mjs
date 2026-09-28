import { createHash } from "node:crypto";
//#region extensions/imessage/src/state-contract.ts
const IMESSAGE_REPLY_CACHE_NAMESPACE = "imessage.reply-cache";
const IMESSAGE_REPLY_CACHE_MAX_ENTRIES = 2e3;
const IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE = "imessage.reply-cache-counter";
const IMESSAGE_REPLY_CACHE_COUNTER_KEY = "short-id-counter";
const IMESSAGE_REPLY_CACHE_TTL_MS = 216e5;
function resolveIMessageReplyCacheEntryKey(messageId) {
	return createHash("sha256").update(messageId, "utf8").digest("hex").slice(0, 32);
}
const MAX_FAILURE_RETRY_MAP_SIZE = 512;
const MAX_FAILURE_RETRY_MAP_JSON_BYTES = 48e3;
const textEncoder = new TextEncoder();
const IMESSAGE_CATCHUP_CURSOR_NAMESPACE = "imessage.catchup-cursors";
function resolveIMessageCatchupCursorKey(accountId) {
	return createHash("sha256").update(accountId, "utf8").digest("hex").slice(0, 32);
}
/**
* Bound the retry map so a pathological storm of unique failing GUIDs
* cannot grow the cursor value without limit. Keeps the `maxSize` entries
* with the highest counts (closest to give-up) when over the bound.
*/
function capFailureRetriesMap(map, maxSize = MAX_FAILURE_RETRY_MAP_SIZE, maxBytes = MAX_FAILURE_RETRY_MAP_JSON_BYTES) {
	const entries = Object.entries(map);
	if (entries.length <= maxSize && textEncoder.encode(JSON.stringify(map)).byteLength <= maxBytes) return map;
	entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
	const capped = {};
	for (const [guid, count] of entries.slice(0, maxSize)) {
		capped[guid] = count;
		if (textEncoder.encode(JSON.stringify(capped)).byteLength > maxBytes) {
			delete capped[guid];
			break;
		}
	}
	return capped;
}
const IMESSAGE_SENT_ECHOES_TTL_MS = 432e5;
const IMESSAGE_SENT_ECHOES_NAMESPACE = "imessage.sent-echoes";
function resolveIMessageSentEchoEntryKey(entry) {
	return createHash("sha256").update(JSON.stringify([
		entry.scope,
		entry.text ?? "",
		resolveIMessageEchoMediaKey(entry.media) ?? "",
		entry.messageId ?? "",
		entry.timestamp
	])).digest("hex").slice(0, 32);
}
function resolveIMessageEchoMediaKey(media) {
	const contentType = media?.contentType?.trim().toLowerCase() || void 0;
	const kind = media?.kind && media.kind !== "unknown" ? media.kind : void 0;
	if (kind) return `kind:${kind}`;
	const normalizedContentType = contentType?.split(";", 1)[0]?.trim();
	return normalizedContentType ? `mime:${normalizedContentType}` : void 0;
}
//#endregion
export { IMESSAGE_REPLY_CACHE_NAMESPACE as a, IMESSAGE_SENT_ECHOES_TTL_MS as c, resolveIMessageEchoMediaKey as d, resolveIMessageReplyCacheEntryKey as f, IMESSAGE_REPLY_CACHE_MAX_ENTRIES as i, capFailureRetriesMap as l, IMESSAGE_REPLY_CACHE_COUNTER_KEY as n, IMESSAGE_REPLY_CACHE_TTL_MS as o, resolveIMessageSentEchoEntryKey as p, IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE as r, IMESSAGE_SENT_ECHOES_NAMESPACE as s, IMESSAGE_CATCHUP_CURSOR_NAMESPACE as t, resolveIMessageCatchupCursorKey as u };
