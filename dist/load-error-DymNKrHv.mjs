import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload, t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
//#region src/cron/store/load-error.ts
function serializeCronLoadError(value) {
	const error = value instanceof Error ? value : new Error(String(value));
	const code = "code" in error ? error.code : void 0;
	const sharedState = encodeOpenClawStateWorkerError(error, { includeOrdinary: true });
	return {
		name: error.name,
		message: error.message,
		...typeof code === "string" || typeof code === "number" ? { code } : {},
		...sharedState ? { sharedState } : {}
	};
}
function restoreCronLoadError(value) {
	const error = Object.assign(new Error(value.message), {
		name: value.name,
		...value.code === void 0 ? {} : { code: value.code }
	});
	if (value.sharedState) retainOpenClawStateWorkerErrorPayload(error, value.sharedState);
	return hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
}
//#endregion
export { serializeCronLoadError as n, restoreCronLoadError as t };
