import { t as drainPendingDeliveries$1 } from "./delivery-queue-DIb9aJYR.js";
//#region src/plugin-sdk/delivery-queue-runtime.ts
let outboundDeliverRuntimePromise = null;
async function loadOutboundDeliverRuntime() {
	outboundDeliverRuntimePromise ??= import("./deliver-runtime-D7PohT6F.js");
	return await outboundDeliverRuntimePromise;
}
/**
* Drain queued outbound payloads after a channel reconnect or transport recovery.
* When no deliver function is provided, the heavy outbound delivery runtime is
* loaded lazily so importing this SDK subpath does not eagerly bind send internals.
*/
async function drainPendingDeliveries(opts) {
	const deliver = opts.deliver ?? (await loadOutboundDeliverRuntime()).deliverOutboundPayloadsInternal;
	await drainPendingDeliveries$1({
		...opts,
		deliver
	});
}
//#endregion
export { drainPendingDeliveries as t };
