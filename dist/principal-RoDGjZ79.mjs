import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-B_ICKCYw.mjs";
import { i as transferGatewayLocalUserIngress } from "./local-user-ingress-B0Jbf3Pk.mjs";
//#region src/gateway/agent-turn/principal.ts
/** Captures the transport identity without rebuilding its trusted metadata. */
function captureAgentTurnPrincipal(client) {
	if (!client) return null;
	const principal = {
		authenticatedUserId: client.authenticatedUserId,
		authenticatedUserProfile: client.authenticatedUserProfile,
		connId: client.connId,
		connect: client.connect,
		internal: client.internal,
		isDeviceTokenAuth: client.isDeviceTokenAuth
	};
	transferGatewayLocalUserIngress(client, principal);
	return principal;
}
/** Preserve capability-gated tool-event observation across agent turn entry paths. */
function resolveAgentTurnRunObserver(params) {
	const connId = params.principal?.connId;
	return connId && hasGatewayClientCap(params.principal?.connect?.caps, GATEWAY_CLIENT_CAPS.TOOL_EVENTS) ? (runId) => params.registerToolEventRecipient(runId, connId) : void 0;
}
//#endregion
export { resolveAgentTurnRunObserver as n, captureAgentTurnPrincipal as t };
