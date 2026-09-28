import { c as toRetryError, i as createRetryRunner } from "./src-D4OikzaT.mjs";
import { n as recordRetryAttemptErrors, t as getRetryAttemptErrors } from "./retry-attempt-errors-BSlvmGqS.mjs";
import { t as generateSecureFraction } from "./secure-random-BJtJxP9Y.mjs";
//#region src/infra/retry.ts
function createRetryFailure(rawAttemptErrors) {
	const attemptErrors = rawAttemptErrors.flatMap((err) => getRetryAttemptErrors(err) ?? [err]);
	const failure = toRetryError(attemptErrors.at(-1) ?? /* @__PURE__ */ new Error("Retry failed"), "Non-Error thrown");
	if (attemptErrors.length > 1) recordRetryAttemptErrors(failure, attemptErrors);
	return failure;
}
/** Runs an async operation until it succeeds, policy stops, or attempts are exhausted. */
const retryAsync = createRetryRunner({
	random: generateSecureFraction,
	createFailure: createRetryFailure
});
//#endregion
export { retryAsync as t };
