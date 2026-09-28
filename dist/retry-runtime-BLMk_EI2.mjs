import "./retry-C0DLN1oj.mjs";
import "./retry-after-fXey-0uQ.mjs";
import "./retryable-network-errors-D2gJmBqw.mjs";
import "./retry-policy-DICHODdx.mjs";
//#region src/plugin-sdk/retry-runtime.ts
/** Transient failures that prove the request did not reach the remote server. */
const PRE_CONNECT_NETWORK_ERROR_CODES = /* @__PURE__ */ new Set([
	"EAI_AGAIN",
	"ECONNREFUSED",
	"ENETUNREACH",
	"ENOTFOUND",
	"UND_ERR_CONNECT_TIMEOUT"
]);
/** Network failures that are transient for idempotent or deduplicated requests. */
const TRANSIENT_NETWORK_ERROR_CODES = /* @__PURE__ */ new Set([
	...PRE_CONNECT_NETWORK_ERROR_CODES,
	"ECONNRESET",
	"EPIPE",
	"ETIMEDOUT",
	"UND_ERR_BODY_TIMEOUT",
	"UND_ERR_HEADERS_TIMEOUT",
	"UND_ERR_SOCKET"
]);
/** Classifies a normalized transport code without imposing a plugin-specific error shape. */
function classifyTransientNetworkErrorCode(code) {
	const normalized = code?.trim().toUpperCase();
	if (!normalized) return;
	if (PRE_CONNECT_NETWORK_ERROR_CODES.has(normalized)) return "pre-connect";
	return TRANSIENT_NETWORK_ERROR_CODES.has(normalized) ? "ambiguous" : void 0;
}
//#endregion
export { classifyTransientNetworkErrorCode as t };
