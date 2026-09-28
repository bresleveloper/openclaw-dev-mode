import { o as classifyNodeWorkerBundleTransferPath } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { n as NODE_WORKER_BUNDLE_TRANSFER_PATH } from "./node-bundle-install-protocol-BJDQfJm4.mjs";
import { n as handleArtifactTransferHttpRequest, t as createArtifactTransferHttpCallback } from "./artifact-transfer-http-q-7Awi1t.mjs";
//#region src/gateway/worker-environments/node-worker-bundle-transfer-http.ts
function handleNodeWorkerBundleTransferHttpRequest(params) {
	const callback = params.callback;
	return handleArtifactTransferHttpRequest({
		...params,
		classifyPath: classifyNodeWorkerBundleTransferPath,
		routePrefix: `${NODE_WORKER_BUNDLE_TRANSFER_PATH}/bundles/`,
		callback: callback ? ({ artifactKey, ...request }) => callback({
			...request,
			bundleHash: artifactKey
		}) : void 0
	});
}
function createNodeWorkerBundleTransferHttpCallback(service) {
	const callback = createArtifactTransferHttpCallback({
		...service,
		authorize: ({ token, artifactKey }) => service.authorize({
			token,
			bundleHash: artifactKey
		})
	});
	return ({ bundleHash, ...request }) => callback({
		...request,
		artifactKey: bundleHash
	});
}
//#endregion
export { handleNodeWorkerBundleTransferHttpRequest as n, createNodeWorkerBundleTransferHttpCallback as t };
