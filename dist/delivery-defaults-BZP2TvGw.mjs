import { n as assertCanonicalCronDeliveryMode } from "./delivery-codec-DMPX9PBc.mjs";
//#region src/cron/delivery-defaults.ts
/** Shared create- and run-time defaults for cron result delivery. */
/**
* Keep create-time normalization, direct service persistence, and run-time
* planning on one target policy; disagreement silently drops cron results.
*/
function shouldDefaultCronDeliveryToAnnounce(params) {
	if (params.payloadKind !== "agentTurn" && params.payloadKind !== "command" && params.payloadKind !== "script") return false;
	return params.sessionTarget === "isolated" || params.sessionTarget === "current" || typeof params.sessionTarget === "string" && params.sessionTarget.startsWith("session:");
}
/** Resolves the configured mode without loading runtime destination routing. */
function resolveCronDeliveryMode(job) {
	assertCanonicalCronDeliveryMode(job.delivery);
	if (job.delivery) return job.delivery.mode;
	return job.payload && job.sessionTarget && shouldDefaultCronDeliveryToAnnounce({
		payloadKind: job.payload.kind,
		sessionTarget: job.sessionTarget
	}) ? "announce" : "none";
}
//#endregion
export { shouldDefaultCronDeliveryToAnnounce as n, resolveCronDeliveryMode as t };
