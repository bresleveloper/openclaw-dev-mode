import { u as normalizeOptionalStringifiedId } from "./string-coerce-CIXf7egm.mjs";
//#region src/infra/outbound/thread-id.ts
/** Normalizes channel thread/topic ids before outbound payload construction. */
function normalizeOutboundThreadId(value) {
	return normalizeOptionalStringifiedId(value);
}
//#endregion
export { normalizeOutboundThreadId as t };
