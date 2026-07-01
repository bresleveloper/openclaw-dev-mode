import { n as waitForEventLoopReady, t as startGatewayClientWithReadinessWait } from "./readiness-BrG0HxCD.js";
//#region src/gateway/client-start-readiness.ts
/** Starts a gateway client once the shared event-loop readiness check passes. */
function startGatewayClientWhenEventLoopReady(client, options = {}) {
	return startGatewayClientWithReadinessWait(waitForEventLoopReady, client, options);
}
//#endregion
export { startGatewayClientWhenEventLoopReady as t };
