import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
//#region src/config/sessions/transcript-message-identity.ts
function readMessageIdempotencyKey(message) {
	if (!isRecord(message)) return null;
	const value = message.idempotencyKey;
	return typeof value === "string" && value.trim() ? value.trim() : null;
}
//#endregion
export { readMessageIdempotencyKey as t };
