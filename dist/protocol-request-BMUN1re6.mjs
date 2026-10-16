//#region packages/gateway-client/src/protocol-request.ts
const gatewayResponseErrors = /* @__PURE__ */ new WeakSet();
/** Distinguishes correlated Gateway responses from locally constructed transport errors. */
function isGatewayProtocolResponseError(error) {
	return error instanceof Error && gatewayResponseErrors.has(error);
}
var GatewayProtocolRequestError = class extends Error {
	constructor(error) {
		super(error.message ?? "request failed");
		this.name = "GatewayProtocolRequestError";
		this.code = error.code ?? "UNAVAILABLE";
		this.gatewayCode = this.code;
		this.details = error.details;
		this.retryable = error.retryable === true;
		this.retryAfterMs = error.retryAfterMs;
	}
};
/** Preserve response metadata after custom factories without adding it to error JSON. */
function retainGatewayResponsePayload(error, payload) {
	gatewayResponseErrors.add(error);
	Object.defineProperty(error, "responsePayload", {
		value: payload,
		enumerable: false,
		configurable: true
	});
}
/** A local transport deadline, distinct from a Gateway's authoritative rejection. */
var GatewayProtocolRequestTimeoutError = class extends Error {
	constructor(params, message = `gateway request timed out after ${params.timeoutMs}ms: ${params.method}`) {
		super(message);
		this.code = "CLIENT_TIMEOUT";
		this.name = "GatewayProtocolRequestTimeoutError";
		this.method = params.method;
		this.timeoutMs = params.timeoutMs;
		this.requestSent = params.requestSent;
	}
};
//#endregion
export { retainGatewayResponsePayload as i, GatewayProtocolRequestTimeoutError as n, isGatewayProtocolResponseError as r, GatewayProtocolRequestError as t };
