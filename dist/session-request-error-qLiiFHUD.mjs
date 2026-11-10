import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
//#region src/gateway/session-request-error.ts
function sessionCreationFailure(failure) {
	return {
		ok: false,
		error: failure.phase === "transcript" ? errorShape(ErrorCodes.UNAVAILABLE, `failed to create session transcript: ${failure.error}`) : failure.error
	};
}
function invalidSessionRequest(message, options) {
	return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, message, options)
	};
}
function unavailableSessionRequest(message) {
	return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, message)
	};
}
//#endregion
export { sessionCreationFailure as n, unavailableSessionRequest as r, invalidSessionRequest as t };
