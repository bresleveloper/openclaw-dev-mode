import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Ui as validateSessionsObserverVisibilityParams, _h as formatValidationErrors } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
//#region src/gateway/session-observer-rpc.ts
const sessionObserverHandlers = { "sessions.observer.visibility": ({ params, respond, client, context }) => {
	if (!validateSessionsObserverVisibilityParams(params)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid sessions.observer.visibility params: ${formatValidationErrors(validateSessionsObserverVisibilityParams.errors)}`));
		return;
	}
	if (!client?.connId) {
		respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "Session observer visibility requires a connected client."));
		return;
	}
	if (!context.sessionObserver) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Session observer is unavailable."));
		return;
	}
	const { visible } = params;
	context.sessionObserver.setConnectionVisibility(client.connId, visible);
	respond(true, { ok: true });
} };
//#endregion
export { sessionObserverHandlers };
