import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
//#region src/gateway/server-methods/response.ts
function respondUnavailable(respond, err) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
}
async function respondUnavailableOnThrow(respond, fn) {
	try {
		await fn();
	} catch (err) {
		if (err instanceof SessionMutationAuthorizationChangedError) throw err;
		respondUnavailable(respond, err);
	}
}
//#endregion
export { respondUnavailableOnThrow as n, respondUnavailable as t };
