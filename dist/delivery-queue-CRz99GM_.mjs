import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { j as readSqliteDatabaseWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-CaSenm_x.mjs";
import { p as listContextEngineQuarantines } from "./registry-BNFZRyO5.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-jMYRv0Lv.mjs";
import { t as countFailedDeliveryQueueEntries } from "./delivery-queue-sqlite-BYjmoa0a.mjs";
import { n as countFailedChannelIngressQueueEntries, t as countChannelIngressQueuePressure } from "./ingress-queue-health-BCifBLIU.mjs";
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
async function readQueueHealth(message, read, onFailure) {
	try {
		return await read();
	} catch (error) {
		onFailure?.();
		if (isDiagnosticFlagEnabled("health")) healthLog.info(message, { error: formatErrorMessage(error) });
		return [];
	}
}
let failedQueueHealthCache;
async function readFailedQueueHealth(context) {
	const writeToken = "stateContext" in context ? readSqliteDatabaseWriteTokenForPath(context.stateContext.workerContext.admission.databasePath) : void 0;
	if (writeToken && failedQueueHealthCache?.writeToken === writeToken) return failedQueueHealthCache;
	let failedRead = false;
	const onFailure = () => {
		failedRead = true;
	};
	const health = { failed: await readQueueHealth("outbound delivery queue health read failed", () => {
		if ("error" in context) throw context.error;
		return countFailedDeliveryQueueEntries(void 0, context.stateContext);
	}, onFailure) };
	if (writeToken && !failedRead) failedQueueHealthCache = {
		...health,
		writeToken
	};
	return health;
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
	const { failed } = await readFailedQueueHealth(context);
	const stateContext = "stateContext" in context ? context.stateContext : void 0;
	const ingressFailed = await readQueueHealth("channel ingress failed queue health read failed", () => countFailedChannelIngressQueueEntries(stateContext?.stateDir, stateContext?.workerContext));
	const ingressPressure = cachedIngressPressure ?? await readQueueHealth("channel ingress pressure health read failed", () => countChannelIngressQueuePressure(stateContext?.stateDir, stateContext?.workerContext));
	if (failed.length === 0 && ingressFailed.length === 0 && ingressPressure.length === 0) return;
	return {
		failed,
		...ingressFailed.length > 0 ? { ingressFailed } : {},
		...ingressPressure.length > 0 ? { ingressPressure } : {}
	};
}
//#endregion
export { captureDeliveryQueueHealthContext as n, buildContextEngineHealthSummary as r, buildDeliveryQueueHealthSummary as t };
