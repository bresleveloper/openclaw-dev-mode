//#region src/infra/retry-attempt-errors.ts
const retryAttemptErrors = /* @__PURE__ */ new WeakMap();
function recordRetryAttemptErrors(error, attemptErrors) {
	retryAttemptErrors.set(error, [...attemptErrors]);
}
function getRetryAttemptErrors(err) {
	return err !== null && (typeof err === "object" || typeof err === "function") ? retryAttemptErrors.get(err) : void 0;
}
//#endregion
export { recordRetryAttemptErrors as n, getRetryAttemptErrors as t };
