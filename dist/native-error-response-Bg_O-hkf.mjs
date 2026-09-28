import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
//#region src/infra/native-error-response.ts
function nativeErrorDetails(error) {
	const nativeError = error;
	return {
		message: error.message,
		code: nativeError.code,
		errcode: nativeError.errcode
	};
}
function serializeNativeErrorResponse(value) {
	const error = toStringifiedError(value);
	return {
		name: error.name,
		...nativeErrorDetails(error),
		...error.cause instanceof Error ? { cause: nativeErrorDetails(error.cause) } : {}
	};
}
function restoreNativeErrorResponse(value) {
	const cause = value.cause ? Object.assign(new Error(value.cause.message), value.cause) : void 0;
	return Object.assign(new Error(value.message, cause ? { cause } : void 0), {
		name: value.name,
		code: value.code,
		errcode: value.errcode
	});
}
//#endregion
export { serializeNativeErrorResponse as n, restoreNativeErrorResponse as t };
