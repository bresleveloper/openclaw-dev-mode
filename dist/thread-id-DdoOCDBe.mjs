import { u as normalizeOptionalStringifiedId } from "./string-coerce-1VuiLaaR.mjs";
//#region src/infra/outbound/thread-id.ts
/** Normalizes channel thread/topic ids before outbound payload construction. */
function normalizeOutboundThreadId(value) {
	return normalizeOptionalStringifiedId(value);
}
//#endregion
export { normalizeOutboundThreadId as t };
