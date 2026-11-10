import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DPfGDWk1.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { s as createAgentDatabaseAdmissionErrorShape, t as AgentDatabaseAdmissionError } from "./agent-database-admission-CeDA0ojh.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as IncognitoSessionEndedError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { n as copyErrorDiagnostic } from "./error-diagnostics-Cgksm9ND.mjs";
//#region src/gateway/error-shape.ts
/** Preserve typed refusals while allowing each surface's existing error message. */
function errorShapeFromError(code, error, opts) {
	const { message, ...metadata } = opts ?? {};
	const ended = collectNestedErrorCandidates(error).find((candidate) => candidate instanceof IncognitoSessionEndedError);
	const shape = error instanceof AgentDatabaseAdmissionError ? createAgentDatabaseAdmissionErrorShape(error.refusal) : ended instanceof IncognitoSessionEndedError ? errorShape(ErrorCodes.UNAVAILABLE, ended.message, {
		...metadata,
		retryable: false,
		details: { code: ended.code }
	}) : errorShape(code, message ?? formatErrorMessageWithCode(error), metadata);
	copyErrorDiagnostic(error, shape);
	return shape;
}
//#endregion
export { errorShapeFromError as t };
