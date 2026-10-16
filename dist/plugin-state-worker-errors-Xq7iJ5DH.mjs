import { a as PluginStateStoreError, n as hydrateOpenClawStateWorkerError, o as capturePluginStateErrorCause, r as retainOpenClawStateWorkerErrorPayload, t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import "./plugin-state-store.kernel-DUORZ5yM.mjs";
//#region src/plugin-state/plugin-state-worker-errors.ts
const errorConstructors = /* @__PURE__ */ new Map([
	["Error", Error],
	["TypeError", TypeError],
	["SyntaxError", SyntaxError],
	["RangeError", RangeError],
	["ReferenceError", ReferenceError],
	["URIError", URIError],
	["EvalError", EvalError]
]);
function restoreCause(value) {
	if (value && "canonical" in value) {
		const retained = /* @__PURE__ */ new Error("SQLite worker error cause");
		retainOpenClawStateWorkerErrorPayload(retained, value.canonical);
		return hydrateOpenClawStateWorkerError(retained, { includeOrdinary: true });
	}
	const Constructor = value ? errorConstructors.get(value.name) ?? Error : Error;
	return value ? Object.assign(new Constructor(value.message, { cause: restoreCause(value.cause) }), {
		name: value.name,
		...value.errorCode === void 0 ? {} : { code: value.errorCode },
		...value.errcode === void 0 ? {} : { errcode: value.errcode },
		...value.errno === void 0 ? {} : { errno: value.errno }
	}) : void 0;
}
function capturePluginStateWorkerFailure(error) {
	const cause = capturePluginStateErrorCause(error.cause, (value) => encodeOpenClawStateWorkerError(value, { includeOrdinary: value instanceof AggregateError }));
	return {
		message: error.message,
		code: error.code,
		operation: error.operation,
		owner: error.owner,
		...error.path === void 0 ? {} : { path: error.path },
		...cause ? { cause } : {}
	};
}
function restorePluginStateWorkerFailure(error) {
	return new PluginStateStoreError(error.message, {
		code: error.code,
		operation: error.operation,
		owner: error.owner,
		...error.path === void 0 ? {} : { path: error.path },
		cause: restoreCause(error.cause)
	});
}
//#endregion
export { restorePluginStateWorkerFailure as n, capturePluginStateWorkerFailure as t };
