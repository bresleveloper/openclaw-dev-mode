import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-C5zAusBU.mjs";
import { i as listContextEngineQuarantines } from "./registry-Bqh30cGD.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-5XnUHpKM.mjs";
import { t as countFailedDeliveryQueueEntries } from "./delivery-queue-sqlite-BghoE75G.mjs";
import { n as countFailedChannelIngressQueueEntries, t as countChannelIngressQueuePressure } from "./ingress-queue-health-CB-tSDXR.mjs";
//#region src/gateway/health/context-engine.ts
/** Projects active context-engine quarantines into the public health shape. */
function buildContextEngineHealthSummary() {
	const quarantined = listContextEngineQuarantines().map((entry) => {
		const summary = {
			engineId: entry.engineId,
			operation: entry.operation,
			reason: entry.reason,
			failedAt: entry.failedAt.getTime()
		};
		return entry.owner ? Object.assign(summary, { owner: entry.owner }) : summary;
	});
	return quarantined.length > 0 ? { quarantined } : void 0;
}
//#endregion
//#region src/gateway/health/delivery-queue.ts
const healthLog = createSubsystemLogger("health");
const debugHealth = (message, error) => {
	if (isDiagnosticFlagEnabled("health")) healthLog.info(message, { error: formatErrorMessage(error) });
};
async function readQueueHealth(message, read) {
	try {
		return await read();
	} catch (error) {
		debugHealth(message, error);
		return [];
	}
}
function captureDeliveryQueueHealthContext() {
	try {
		return { stateContext: captureDeliveryQueueStateContext() };
	} catch (error) {
		return { error };
	}
}
/** Builds redacted inbound pressure and dead-letter health for gateway snapshots. */
async function buildDeliveryQueueHealthSummary(cachedIngressPressure, context = captureDeliveryQueueHealthContext()) {
	const failed = await readQueueHealth("outbound delivery queue health read failed", () => {
		if ("error" in context) throw context.error;
		return countFailedDeliveryQueueEntries(void 0, context.stateContext);
	});
	const ingressFailed = await readQueueHealth("channel ingress failed queue health read failed", countFailedChannelIngressQueueEntries);
	const ingressPressure = cachedIngressPressure ?? await readQueueHealth("channel ingress pressure health read failed", countChannelIngressQueuePressure);
	if (failed.length === 0 && ingressFailed.length === 0 && ingressPressure.length === 0) return;
	return {
		failed,
		...ingressFailed.length > 0 ? { ingressFailed } : {},
		...ingressPressure.length > 0 ? { ingressPressure } : {}
	};
}
//#endregion
export { captureDeliveryQueueHealthContext as n, buildContextEngineHealthSummary as r, buildDeliveryQueueHealthSummary as t };
