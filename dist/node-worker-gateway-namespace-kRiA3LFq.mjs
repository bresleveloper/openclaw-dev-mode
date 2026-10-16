import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/node-worker-gateway-namespace.ts
function nodeWorkerGatewayNamespace(gatewayDeviceId) {
	return `gateway-${createHash("sha256").update(gatewayDeviceId).digest("hex").slice(0, 32)}`;
}
//#endregion
export { nodeWorkerGatewayNamespace as t };
