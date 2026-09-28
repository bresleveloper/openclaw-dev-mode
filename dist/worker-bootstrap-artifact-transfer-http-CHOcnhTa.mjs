import { c as classifyWorkerBootstrapArtifactTransferPath, r as WORKER_BOOTSTRAP_ARTIFACT_TRANSFER_PATH } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { n as handleArtifactTransferHttpRequest, t as createArtifactTransferHttpCallback } from "./artifact-transfer-http-q-7Awi1t.mjs";
//#region src/gateway/worker-environments/worker-bootstrap-artifact-transfer-http.ts
function handleWorkerBootstrapArtifactTransferHttpRequest(params) {
	const callback = params.callback;
	return handleArtifactTransferHttpRequest({
		...params,
		classifyPath: classifyWorkerBootstrapArtifactTransferPath,
		routePrefix: `${WORKER_BOOTSTRAP_ARTIFACT_TRANSFER_PATH}/artifacts/`,
		callback: callback ? ({ artifactKey, ...request }) => callback({
			...request,
			artifactSha256: artifactKey
		}) : void 0
	});
}
function createWorkerBootstrapArtifactTransferHttpCallback(service) {
	const callback = createArtifactTransferHttpCallback(service);
	return ({ artifactSha256, ...request }) => callback({
		...request,
		artifactKey: artifactSha256
	});
}
//#endregion
export { handleWorkerBootstrapArtifactTransferHttpRequest as n, createWorkerBootstrapArtifactTransferHttpCallback as t };
