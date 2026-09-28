import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { S as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-CHv_0noy.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-5XnUHpKM.mjs";
import "./delivery-queue-sqlite-BghoE75G.mjs";
import { t as drainPendingDeliveriesCore } from "./delivery-queue-recovery-DYFcangb.mjs";
//#region src/plugin-sdk/delivery-queue-runtime.ts
const loadOutboundDeliverRuntime = createLazyRuntimeModule(() => import("./deliver-runtime-Qd_aN6nb.mjs"));
/**
* Drain queued outbound payloads after a channel reconnect or transport recovery.
* When no deliver function is provided, the heavy outbound delivery runtime is
* loaded lazily so importing this SDK subpath does not eagerly bind send internals.
*/
async function drainPendingDeliveries(opts) {
	const capturedState = captureDeliveryQueueStateContext(opts.stateDir);
	await runWithGatewayIndependentRootWorkAdmission(async () => {
		const deliver = opts.deliver ?? (await loadOutboundDeliverRuntime()).deliverOutboundPayloadsInternal;
		await drainPendingDeliveriesCore({
			...opts,
			deliver,
			selectEntry: (entry, now) => entry.deliveryCompletion?.kind === "conversation" ? {
				match: false,
				bypassBackoff: false
			} : opts.selectEntry(entry, now)
		}, opts.deliver ? void 0 : deliver, capturedState);
	}, "delivery-queue:drain");
}
//#endregion
export { drainPendingDeliveries as t };
