import { t as createArtifactTransferService } from "./artifact-transfer-service-BmyCj22X.mjs";
//#region src/gateway/worker-environments/worker-bootstrap-artifact-transfer-service.ts
const BOOTSTRAP_TRANSFER_TTL_MS = 6e5;
function createWorkerBootstrapArtifactTransferService(options = {}) {
	const transfer = createArtifactTransferService(options);
	return {
		...transfer,
		prepare(params) {
			return transfer.prepare({
				...params,
				artifactKey: params.artifact.tarballSha256,
				ttlMs: BOOTSTRAP_TRANSFER_TTL_MS
			});
		}
	};
}
//#endregion
export { createWorkerBootstrapArtifactTransferService };
