import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/gateway/node-invoke-request.ts
function buildNodeInvokeRequest(params) {
	return {
		id: params.id,
		nodeId: params.nodeId,
		command: params.command,
		paramsJSON: params.params === void 0 ? null : JSON.stringify(params.params),
		timeoutMs: params.timeoutMs,
		idempotencyKey: params.idempotencyKey,
		sessionKey: normalizeOptionalString(params.sessionKey)
	};
}
/** Measure the same outer encoding sent to nodes, including paramsJSON escaping. */
function serializeNodeEvent(event, payload) {
	return JSON.stringify({
		type: "event",
		event,
		payload
	});
}
//#endregion
export { serializeNodeEvent as n, buildNodeInvokeRequest as t };
