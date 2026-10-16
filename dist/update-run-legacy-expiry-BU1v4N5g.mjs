//#region src/infra/update-run-legacy-expiry.ts
const LEGACY_UPDATE_RUN_EXPIRED_REASON = "legacy-driver-expired";
const LEGACY_UPDATE_RUN_EXPIRY_MS = 864e5;
const LEGACY_UPDATE_RUN_ADVISORY = "A 2026.9.2-era update never progressed past admission; treated as abandoned after 24 h; run `openclaw update` to retry.";
/** The approved legacy expiry applies only to an untouched, identityless admission. */
function isExpiredLegacyUpdateRun(run) {
	const initial = run.steps[0];
	return run.status === "running" && run.phase === "requested" && run.finishedAtMs === null && run.updatedAtMs === run.createdAtMs && !run.origin.driver && !run.origin.previousDrivers?.length && run.steps.length === 1 && initial?.step === "requested" && initial.status === "in_progress" && initial.startedAtMs === run.createdAtMs && initial.endedAtMs === void 0 && Date.now() - run.createdAtMs > LEGACY_UPDATE_RUN_EXPIRY_MS;
}
//#endregion
export { LEGACY_UPDATE_RUN_EXPIRED_REASON as n, isExpiredLegacyUpdateRun as r, LEGACY_UPDATE_RUN_ADVISORY as t };
