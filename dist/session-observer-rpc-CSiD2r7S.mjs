import { Ca as validateSessionsObserverVisibilityParams, Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as defineValidatedGatewayHandler } from "./validation--xIH1Pj-.mjs";
//#region src/gateway/session-observer-rpc.ts
const sessionObserverHandlers = { "sessions.observer.visibility": defineValidatedGatewayHandler("sessions.observer.visibility", validateSessionsObserverVisibilityParams, ({ params, respond, client, context }) => {
	if (!client?.connId || !context.isConnectionActive?.(client.connId)) {
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
}) };
//#endregion
export { sessionObserverHandlers };
