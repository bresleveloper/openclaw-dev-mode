import "./paths-DehQwyE0.mjs";
import { o as loadNodeHostConfigReadOnly } from "./config-DLlmgxee.mjs";
//#region src/commands/status.node-mode.ts
function resolveNodeGatewayTarget(gateway) {
	return gateway?.host ? `${gateway.host}:${gateway.port ?? 18789}` : "(gateway address unknown)";
}
function hasRunningRuntime(runtime) {
	return runtime?.status === "running" || typeof runtime?.pid === "number";
}
function isNodeServiceActive(node) {
	if (node.installed !== true) return false;
	if (node.externallyManaged === true) return true;
	if (node.loadState?.status === "loaded") return true;
	return hasRunningRuntime(node.runtime);
}
/** Returns node-only gateway context when node is active and the local gateway is intentionally absent. */
async function resolveNodeOnlyGatewayInfo(params) {
	if (params.daemon.installed !== false || !isNodeServiceActive(params.node)) return null;
	const gatewayTarget = resolveNodeGatewayTarget((await loadNodeHostConfigReadOnly())?.gateway);
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
