import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { t as resolveChannelIngressStateEnv } from "./ingress-queue-client-BTyDwm0g.mjs";
//#region src/channels/message/ingress-queue-health.ts
/** Redacted health diagnostics for durable channel ingress queues. */
async function countFailedChannelIngressQueueEntries(stateDir) {
	const reply = await executeExistingOpenClawStateRead({ env: resolveChannelIngressStateEnv(stateDir) }, { type: "channelIngress.failedHealth" });
	if (!reply) return [];
	if (!reply.ok || reply.type !== "channelIngress.failedHealth") throw new Error("Channel ingress failed health reader returned an unexpected result");
	return reply.result;
}
async function countChannelIngressQueuePressure(stateDir) {
	const reply = await executeExistingOpenClawStateRead({ env: resolveChannelIngressStateEnv(stateDir) }, {
		type: "channelIngress.pressureHealth",
		input: { now: Date.now() }
	});
	if (!reply) return [];
	if (!reply.ok || reply.type !== "channelIngress.pressureHealth") throw new Error("Channel ingress pressure reader returned an unexpected result");
	return reply.result;
}
//#endregion
export { countFailedChannelIngressQueueEntries as n, countChannelIngressQueuePressure as t };
