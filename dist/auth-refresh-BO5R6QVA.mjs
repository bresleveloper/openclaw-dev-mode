import { f as isGatewayClientRequestError, h as isImplicitLocalGatewayTarget, n as GatewayLocalBackendSharedAuthUnavailableError, o as callGateway } from "./call-C_MP4_Gs.mjs";
import { a as isGatewayTransportError } from "./transport-error-C-c71VUr.mjs";
//#region src/commands/models/auth-refresh.ts
/** Shared gateway refresh for CLI auth writes made outside the gateway process. */
async function refreshRunningGatewayAuthState(agentId, operation, runtime) {
	let gatewayConnected = false;
	let localTarget;
	try {
		localTarget = await isImplicitLocalGatewayTarget({});
		if ((await callGateway({
			method: "models.authRefresh",
			params: {
				operation,
				...agentId ? { agentId } : {}
			},
			timeoutMs: 3e3,
			requireLocalBackendSharedAuth: true,
			onHelloOk: () => {
				gatewayConnected = true;
			}
		})).refreshed) return "refreshed";
	} catch (error) {
		if (isGatewayClientRequestError(error) && error.gatewayCode === "INVALID_REQUEST" && error.message === "unknown method: models.authRefresh") await callGateway({
			method: "models.authStatus",
			params: {
				refresh: true,
				...agentId ? { agentId } : {}
			},
			timeoutMs: 3e3,
			requireLocalBackendSharedAuth: true
		}).catch(() => void 0);
		if (error instanceof GatewayLocalBackendSharedAuthUnavailableError && localTarget === false) {
			runtime.error("Warning: Model auth changes were saved on this host, but the configured Gateway does not share this auth state. Run the auth command on the Gateway host (the far end of any SSH tunnel).");
			return "gateway-rejected";
		}
		if (localTarget === true && !gatewayConnected && isGatewayTransportError(error) && error.kind === "closed" && error.code === void 0 && error.reason?.includes("ECONNREFUSED")) return "gateway-unreachable";
	}
	runtime.error(localTarget === true ? `Warning: Model auth changes were saved, but the ${gatewayConnected ? "running" : "local"} Gateway could not refresh them. Run \`openclaw gateway restart\` to apply the saved changes.` : "Warning: Model auth changes were saved, but the configured Gateway could not be identified or refreshed. Apply the auth change on the Gateway host, or restart it there.");
	return gatewayConnected ? "gateway-rejected" : "gateway-unreachable";
}
//#endregion
export { refreshRunningGatewayAuthState as t };
