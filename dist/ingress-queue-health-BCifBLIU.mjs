import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { r as resolveChannelIngressStateEnv, t as channelIngressHealthCache } from "./ingress-queue-health-cache-CyEdhKLC.mjs";
//#region src/channels/message/ingress-queue-health.ts
/** Redacted health diagnostics for durable channel ingress queues. */
async function countFailedChannelIngressQueueEntries(stateDir, context) {
	const cache = context ? channelIngressHealthCache(context) : void 0;
	if (cache?.failed) return cache.failed;
	const reply = await executeExistingOpenClawStateRead({ env: resolveChannelIngressStateEnv(stateDir) }, { type: "channelIngress.failedHealth" });
	if (!reply) return [];
	if (!reply.ok || reply.type !== "channelIngress.failedHealth") throw new Error("Channel ingress failed health reader returned an unexpected result");
	if (cache) cache.failed = reply.result;
	return reply.result;
}
async function countChannelIngressQueuePressure(stateDir, context) {
	const cache = context ? channelIngressHealthCache(context) : void 0;
	const now = Date.now();
	if (cache?.pressure && now >= cache.pressure.readAtMs && now < (cache.pressure.nextClaimExpiryAtMs ?? Infinity)) return cache.pressure.pressure;
	const reply = await executeExistingOpenClawStateRead({ env: resolveChannelIngressStateEnv(stateDir) }, {
		type: "channelIngress.pressureHealth",
		input: { now }
	});
	if (!reply) return [];
	if (!reply.ok || reply.type !== "channelIngress.pressureHealth") throw new Error("Channel ingress pressure reader returned an unexpected result");
	if (cache) cache.pressure = {
		...reply.result,
		readAtMs: now
	};
	return reply.result.pressure;
}
//#endregion
export { countFailedChannelIngressQueueEntries as n, countChannelIngressQueuePressure as t };
