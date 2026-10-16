import { a as workerBootstrapOperationTimeoutMs } from "./bootstrap-timeouts-CDaMuZ4A.mjs";
import { n as createArtifactTransferService } from "./artifact-transfer-service-BjhnzCAB.mjs";
//#region src/gateway/worker-environments/worker-bootstrap-artifact-transfer-service.ts
function createWorkerBootstrapArtifactTransferService(options = {}) {
	const transfer = createArtifactTransferService(options);
	return {
		...transfer,
		prepare(params) {
			return transfer.prepare({
				...params,
				artifactKey: params.artifact.tarballSha256,
				ttlMs: workerBootstrapOperationTimeoutMs({ tarballBytes: params.transferBytes ?? params.artifact.tarballBytes }),
				maxServes: 256
			});
		}
	};
}
//#endregion
export { createWorkerBootstrapArtifactTransferService };
