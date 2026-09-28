import { f as resolveFailoverReasonFromError } from "./failover-error-BwAkMLuL.mjs";
//#region src/cron/run-error-reason.ts
/** Resolve one cron-owned classification before falling back to provider error inference. */
function resolveCronRunErrorReason(error, provider, classification) {
	if (classification?.kind === "permanent") return;
	if (classification?.kind === "reason") return classification.reason;
	return resolveFailoverReasonFromError(error, provider) ?? void 0;
}
//#endregion
export { resolveCronRunErrorReason as t };
