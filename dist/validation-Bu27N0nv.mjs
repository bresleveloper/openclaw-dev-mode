import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { w as formatValidationErrors } from "./worker-protocol-primitives-BajTgPT4.mjs";
//#region src/gateway/server-methods/validation.ts
function validateGatewayMethodParams(params, validate, method) {
	if (validate(params)) return;
	return errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params: ${formatValidationErrors(validate.errors)}`);
}
function assertValidParams(params, validate, method, respond) {
	const error = validateGatewayMethodParams(params, validate, method);
	if (!error) return true;
	respond(false, void 0, error);
	return false;
}
function hasValidMethodParams(options, validate, method) {
	return assertValidParams(options.params, validate, method, options.respond);
}
function defineValidatedGatewayHandler(method, validate, handler, mapError) {
	const run = mapError ? async (options) => {
		try {
			await handler(options);
		} catch (error) {
			options.respond(false, void 0, mapError(error));
		}
	} : handler;
	return (options) => {
		if (!hasValidMethodParams(options, validate, method)) return;
		return run(options);
	};
}
/** Bind a core method to its schema before exposing it through the open plugin registry. */
function defineValidatedGatewayMethod(method, validate, handler, mapError) {
	return defineValidatedGatewayHandler(method, validate, handler, mapError);
}
//#endregion
export { validateGatewayMethodParams as i, defineValidatedGatewayHandler as n, defineValidatedGatewayMethod as r, assertValidParams as t };
