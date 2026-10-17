import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { S as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-BiGOf1E1.mjs";
import "./delivery-queue-sqlite-CZH3GILC.mjs";
import { t as drainPendingDeliveriesCore } from "./delivery-queue-recovery-kW-G1ot6.mjs";
//#region src/plugin-sdk/delivery-queue-runtime.ts
const loadOutboundDeliverRuntime = createLazyRuntimeModule(() => import("./deliver-runtime-BizFctvf.mjs"));
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
