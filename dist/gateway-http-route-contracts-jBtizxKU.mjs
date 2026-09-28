//#region src/gateway/gateway-http-route-contracts.ts
const GATEWAY_PROBE_ROUTES = /* @__PURE__ */ new Map([
	["/health", "live"],
	["/healthz", "live"],
	["/ready", "ready"],
	["/readyz", "ready"],
	["/startup", "startup"],
	["/startupz", "startup"]
]);
const MCP_APP_STANDALONE_PATH = "/__openclaw__/mcp-app";
const MCP_APP_STANDALONE_VIEW_PATH = `${MCP_APP_STANDALONE_PATH}/view`;
const WORKER_GATEWAY_PATH = "/__openclaw__/worker";
const NODE_WORKER_BUNDLE_TRANSFER_NAMESPACE = "/__openclaw__/worker-bundle";
const NODE_WORKSPACE_TRANSFER_NAMESPACE = "/__openclaw__/worker-transfer";
const WORKER_BOOTSTRAP_ARTIFACT_TRANSFER_PATH = "/__openclaw__/worker-bootstrap";
function classifyGatewayProbePath(pathname) {
	for (const [root, status] of GATEWAY_PROBE_ROUTES) {
		if (pathname === root) return status;
		if (pathname.startsWith(`${root}/`)) return "namespace";
	}
	return "outside";
}
function classifyMcpAppStandalonePath(pathname) {
	if (pathname === "/__openclaw__/mcp-app") return "shell";
	if (pathname === MCP_APP_STANDALONE_VIEW_PATH) return "view";
	return pathname.startsWith(`/__openclaw__/mcp-app/`) ? "namespace" : "outside";
}
function classifyWorkerGatewayPath(pathname) {
	if (pathname === WORKER_GATEWAY_PATH) return "worker";
	return pathname.startsWith(`${WORKER_GATEWAY_PATH}/`) ? "namespace" : "outside";
}
function classifyNodeWorkerBundleTransferPath(pathname) {
	return pathname === NODE_WORKER_BUNDLE_TRANSFER_NAMESPACE || pathname.startsWith(`${NODE_WORKER_BUNDLE_TRANSFER_NAMESPACE}/`) ? "namespace" : "outside";
}
function classifyNodeWorkspaceTransferPath(pathname) {
	return pathname === NODE_WORKSPACE_TRANSFER_NAMESPACE || pathname.startsWith(`${NODE_WORKSPACE_TRANSFER_NAMESPACE}/`) ? "namespace" : "outside";
}
function classifyWorkerBootstrapArtifactTransferPath(pathname) {
	return pathname === "/__openclaw__/worker-bootstrap" || pathname.startsWith(`/__openclaw__/worker-bootstrap/`) ? "namespace" : "outside";
}
//#endregion
export { classifyMcpAppStandalonePath as a, classifyWorkerBootstrapArtifactTransferPath as c, classifyGatewayProbePath as i, classifyWorkerGatewayPath as l, MCP_APP_STANDALONE_VIEW_PATH as n, classifyNodeWorkerBundleTransferPath as o, WORKER_BOOTSTRAP_ARTIFACT_TRANSFER_PATH as r, classifyNodeWorkspaceTransferPath as s, MCP_APP_STANDALONE_PATH as t };
