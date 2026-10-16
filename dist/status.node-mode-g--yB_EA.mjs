import "./paths-DGIwWbpu.mjs";
import { a as loadNodeHostConfig } from "./config-BO4n0NZx.mjs";
//#region src/commands/status.node-mode.ts
function resolveNodeGatewayTarget(gateway) {
	return gateway?.host ? `${gateway.host}:${gateway.port ?? 18789}` : "(gateway address unknown)";
}
function isNodeServiceActive(node) {
	if (node.installed !== true) return false;
	if (node.externallyManaged === true) return true;
	if (node.loadState?.status === "loaded") return true;
	return node.runtime?.status === "running" || typeof node.runtime?.pid === "number";
}
/** Returns node-only gateway context when node is active and the local gateway is intentionally absent. */
async function resolveNodeOnlyGatewayInfo(params) {
	if (params.daemon.installed !== false || !isNodeServiceActive(params.node)) return null;
	const gatewayTarget = resolveNodeGatewayTarget((await loadNodeHostConfig())?.gateway);
	return {
		gatewayTarget,
		gatewayValue: `node → ${gatewayTarget} · no local gateway`,
		connectionDetails: [
			"Node-only mode detected",
			"Local gateway: not expected on this machine",
			`Remote gateway target: ${gatewayTarget}`,
			"Inspect the remote gateway host for live channel and health details."
		].join("\n")
	};
}
//#endregion
export { resolveNodeOnlyGatewayInfo as t };
