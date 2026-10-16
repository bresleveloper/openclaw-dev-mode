import { n as formatErrorMessageWithCode } from "./errors-O33D01XW.mjs";
import { s as createAgentDatabaseAdmissionErrorShape, t as AgentDatabaseAdmissionError } from "./agent-database-admission-dWNS6Rcs.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as copyErrorDiagnostic } from "./error-diagnostics-3wa3M_GE.mjs";
//#region src/gateway/error-shape.ts
/** Preserve typed refusals while allowing each surface's existing error message. */
function errorShapeFromError(code, error, opts) {
	const { message, ...metadata } = opts ?? {};
	const shape = error instanceof AgentDatabaseAdmissionError ? createAgentDatabaseAdmissionErrorShape(error.refusal) : errorShape(code, message ?? formatErrorMessageWithCode(error), metadata);
	copyErrorDiagnostic(error, shape);
	return shape;
}
//#endregion
export { errorShapeFromError as t };
