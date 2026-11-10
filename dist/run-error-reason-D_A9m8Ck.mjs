import { p as resolveFailoverReasonFromError } from "./failover-error-Bjf0VdY2.mjs";
//#region src/cron/run-error-reason.ts
/** Resolve one cron-owned classification before falling back to provider error inference. */
function resolveCronRunErrorReason(error, provider, classification) {
	if (classification?.kind === "permanent" || classification?.kind === "aborted") return;
	if (classification?.kind === "reason") return classification.reason;
	if (!provider?.trim()) return;
	return resolveFailoverReasonFromError(error, provider) ?? void 0;
}
//#endregion
export { resolveCronRunErrorReason as t };
