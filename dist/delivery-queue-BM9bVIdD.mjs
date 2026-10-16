import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-NlcA0RRK.mjs";
import { u as listContextEngineQuarantines } from "./registry-DLLqqQAy.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-BiGOf1E1.mjs";
import { t as countFailedDeliveryQueueEntries } from "./delivery-queue-sqlite-CZH3GILC.mjs";
import { n as countFailedChannelIngressQueueEntries, t as countChannelIngressQueuePressure } from "./ingress-queue-health-CLZrcoZ-.mjs";
//#region src/gateway/health/context-engine.ts
/** Projects active context-engine quarantines into the public health shape. */
async function buildContextEngineHealthSummary() {
	const quarantined = (await listContextEngineQuarantines()).map((entry) => {
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
async function readQueueHealth(message, read) {
	try {
		return await read();
	} catch (error) {
		if (isDiagnosticFlagEnabled("health")) healthLog.info(message, { error: formatErrorMessage(error) });
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
