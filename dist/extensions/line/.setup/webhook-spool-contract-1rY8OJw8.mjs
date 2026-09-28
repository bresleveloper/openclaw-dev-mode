import { isRecord, normalizeNullableString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/line/src/webhook-spool-contract.ts
/** Message the canonical decoder attaches when it rejects a spool payload. The
*  upgrade migration matches this signature to recover rows the pre-fix decoder
*  dead-lettered; the identity fence writes a different message on purpose. */
const LINE_WEBHOOK_SPOOL_INVALID_PAYLOAD_MESSAGE = "LINE webhook spool payload is invalid.";
/** Dead-letter reason for undecodable events; shared so the migration's
*  recovery signature can never drift from what the spool writes. */
const LINE_WEBHOOK_SPOOL_INVALID_EVENT_REASON = "invalid-event";
/** Defined locally (not via createChannelIngressError) because this module sits
*  in the doctor contract closure, which must stay off the channel-outbound
*  runtime barrel; the spool's permanent-failure classifier matches by class. */
var LineWebhookPayloadError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "LineWebhookPayloadError";
	}
};
/** Message ids preserve the shipped replay-guard keyspace; other events use LINE's delivery id. */
function eventIdFor(event) {
	if (!isRecord(event)) throw new LineWebhookPayloadError("LINE webhook event must be an object.");
	if (event.type === "message") {
		const message = isRecord(event.message) ? event.message : void 0;
		const messageId = normalizeNullableString(message?.id);
		if (messageId) return `message:${messageId}`;
	}
	const webhookEventId = normalizeNullableString(event.webhookEventId);
	if (webhookEventId) return `event:${webhookEventId}`;
	throw new LineWebhookPayloadError("LINE webhook event is missing a stable delivery id.");
}
/** Pre-drain (#109655) rows were keyed by the raw webhookEventId, before the
*  message:/event: keyspace. The upgrade migration uses this prior derivation as its
*  identity fence so a genuinely changed event still dead-letters. */
function legacyEventIdFor(event) {
	if (!isRecord(event)) return null;
	return normalizeNullableString(event.webhookEventId);
}
function laneKeyFor(event, eventId) {
	if (!isRecord(event)) return eventId;
	const source = isRecord(event.source) ? event.source : void 0;
	if (source?.type === "group") {
		const groupId = normalizeNullableString(source.groupId);
		if (groupId) return `group:${groupId}`;
	}
	if (source?.type === "room") {
		const roomId = normalizeNullableString(source.roomId);
		if (roomId) return `room:${roomId}`;
	}
	if (source?.type === "user") {
		const userId = normalizeNullableString(source.userId);
		if (userId) return `user:${userId}`;
	}
	return eventId;
}
function errorText(error) {
	return error instanceof Error ? error.message : String(error);
}
//#endregion
export { eventIdFor as a, errorText as i, LINE_WEBHOOK_SPOOL_INVALID_PAYLOAD_MESSAGE as n, laneKeyFor as o, LineWebhookPayloadError as r, legacyEventIdFor as s, LINE_WEBHOOK_SPOOL_INVALID_EVENT_REASON as t };
