import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
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
function buildNodeInvokeCancel(params) {
	return {
		invokeId: params.invokeId,
		nodeId: params.nodeId
	};
}
function buildNodeInvokeInput(params) {
	return {
		id: params.invokeId,
		nodeId: params.nodeId,
		seq: params.seq,
		payloadJSON: params.payloadJSON
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
export { serializeNodeEvent as i, buildNodeInvokeInput as n, buildNodeInvokeRequest as r, buildNodeInvokeCancel as t };
