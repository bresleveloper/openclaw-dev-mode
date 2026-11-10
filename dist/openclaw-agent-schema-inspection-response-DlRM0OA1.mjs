import { f as toStringifiedError } from "./error-coercion-BwMr25F8.mjs";
import { r as formatSqliteReadOnlyInspectionFailure } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload, t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { n as serializeNativeErrorResponse, t as restoreNativeErrorResponse } from "./native-error-response-6ofCMHxA.mjs";
//#region src/state/openclaw-agent-schema-inspection-response.ts
function serializeAgentSchemaInspectionError(value) {
	const error = toStringifiedError(value);
	return {
		...serializeNativeErrorResponse(error),
		message: formatSqliteReadOnlyInspectionFailure(error),
		stateError: encodeOpenClawStateWorkerError(error)
	};
}
function restoreAgentSchemaInspectionError(value) {
	const error = restoreNativeErrorResponse(value);
	if (value.stateError) retainOpenClawStateWorkerErrorPayload(error, value.stateError);
	const restored = hydrateOpenClawStateWorkerError(error);
	restored.message = value.message;
	return restored;
}
//#endregion
export { serializeAgentSchemaInspectionError as n, restoreAgentSchemaInspectionError as t };
