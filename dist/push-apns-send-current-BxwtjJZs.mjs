//#region src/infra/push-apns-send-current.ts
function apnsSendInvalidatedError(signal) {
	return signal?.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("APNs send invalidated");
}
function throwIfApnsSendAborted(signal) {
	if (signal?.aborted) throw apnsSendInvalidatedError(signal);
}
/** Recheck cancellation after the asynchronous registration-ownership check. */
async function requireCurrentApnsSend(params) {
	throwIfApnsSendAborted(params.signal);
	if (params.isCurrent && !await params.isCurrent()) throw new Error("APNs send invalidated");
	throwIfApnsSendAborted(params.signal);
}
//#endregion
export { requireCurrentApnsSend as n, apnsSendInvalidatedError as t };
