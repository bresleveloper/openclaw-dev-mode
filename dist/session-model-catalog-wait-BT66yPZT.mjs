import { s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import { t as DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS } from "./timeouts-Th9Axx4o.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
//#region src/gateway/server-methods/session-model-catalog-wait.ts
var SessionModelCatalogUnavailableError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.error = errorShape(ErrorCodes.UNAVAILABLE, this.message, { retryable: true });
	}
};
function createSessionModelCatalogWait(signals, outcome = "The session was not created") {
	let deadline;
	const unavailable = new SessionModelCatalogUnavailableError(`The model catalog is still loading. ${outcome}; retry shortly.`);
	const stop = () => {
		throw unavailable;
	};
	return {
		unavailable,
		run: async (operation, authoritySignal) => {
			const signal = AbortSignal.any([...signals, authoritySignal].filter((value) => value !== void 0));
			if (signal.aborted) stop();
			deadline ??= performance.now() + DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS * 2 / 3;
			const remaining = deadline - performance.now();
			if (remaining <= 0) stop();
			return raceWithTimeout(operation, remaining, stop, {
				signal,
				onAbort: stop
			});
		},
		settle: async (operation) => {
			try {
				return {
					ok: true,
					value: await operation
				};
			} catch (error) {
				if (error !== unavailable) throw error;
				return {
					ok: false,
					error: unavailable.error
				};
			}
		}
	};
}
//#endregion
export { createSessionModelCatalogWait as n, SessionModelCatalogUnavailableError as t };
