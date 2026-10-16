import { a as workerBootstrapOperationTimeoutMs } from "./bootstrap-timeouts-CDaMuZ4A.mjs";
import { n as createArtifactTransferService } from "./artifact-transfer-service-BjhnzCAB.mjs";
//#region src/gateway/worker-environments/node-worker-bundle-transfer-service.ts
function createNodeWorkerBundleTransferService(options = {}) {
	const transfer = createArtifactTransferService(options);
	return {
		...transfer,
		prepare(params) {
			const { token } = transfer.prepare({
				...params,
				artifactKey: params.artifact.bundleHash,
				ttlMs: workerBootstrapOperationTimeoutMs(params.artifact),
				maxServes: 256
			});
			return {
				token,
				input: {
					gatewayNamespace: params.gatewayNamespace,
					...params.bundlePrewarm ? { bundlePrewarm: params.bundlePrewarm } : {},
					build: {
						bundleHash: params.artifact.bundleHash,
						openclawVersion: params.artifact.openclawVersion,
						protocolFeatures: [...params.artifact.protocolFeatures]
					},
					archive: {
						token,
						sha256: params.artifact.tarballSha256,
						bytes: params.artifact.tarballBytes
					}
				}
			};
		}
	};
}
//#endregion
export { createNodeWorkerBundleTransferService };
