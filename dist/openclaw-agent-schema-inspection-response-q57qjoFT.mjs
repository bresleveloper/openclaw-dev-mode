import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { Fn as object, Jn as string, Pn as number, sr as unknown } from "./schemas-BOYIvvln.mjs";
import { r as formatSqliteReadOnlyInspectionFailure } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload, t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { n as serializeNativeErrorResponse, t as restoreNativeErrorResponse } from "./native-error-response-Bg_O-hkf.mjs";
//#region src/infra/native-error-response-schema.ts
const nativeErrorDetailsSchema = object({
	message: string(),
	code: string().optional(),
	errcode: number().optional()
});
//#endregion
//#region src/state/openclaw-agent-schema-inspection-response.ts
const agentSchemaInspectionErrorSchema = nativeErrorDetailsSchema.extend({
	name: string(),
	cause: nativeErrorDetailsSchema.optional()
}).extend({ stateError: unknown().optional() });
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
export { restoreAgentSchemaInspectionError as n, serializeAgentSchemaInspectionError as r, agentSchemaInspectionErrorSchema as t };
