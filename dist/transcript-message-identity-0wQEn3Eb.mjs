import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/config/sessions/transcript-message-identity.ts
function readMessageIdempotencyKey(message) {
	return normalizeNullableString(asOptionalRecord(message)?.idempotencyKey);
}
//#endregion
export { readMessageIdempotencyKey as t };
