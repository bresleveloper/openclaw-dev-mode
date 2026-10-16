//#region src/gateway/worker-environments/bootstrap-timeouts.ts
const DEFAULT_BOOTSTRAP_TIMEOUT_MS = 6e5;
const BUNDLE_TRANSFER_MIN_THROUGHPUT_BYTES_PER_SECOND = 125e3;
const BUNDLE_TRANSFER_TIMEOUT_MAX_MS = 36e5;
const BOOTSTRAP_OPERATION_HEADROOM_MS = 3e5;
const NODE_ENROLLMENT_TIMEOUT_MS = 6e5;
const MAX_NODE_BOOTSTRAP_TIMEOUT_MS = 63e5;
function bundleTransferTimeoutMs(tarballBytes, floorMs) {
	if (!Number.isSafeInteger(tarballBytes) || tarballBytes < 0) throw new Error("Worker bundle artifact has an invalid tarball size");
	return Math.min(BUNDLE_TRANSFER_TIMEOUT_MAX_MS, Math.max(floorMs, Math.ceil(tarballBytes / BUNDLE_TRANSFER_MIN_THROUGHPUT_BYTES_PER_SECOND) * 1e3));
}
/** Bounds the complete bootstrap lifecycle without preempting any permitted phase. */
function workerBootstrapOperationTimeoutMs(artifact) {
	const transferTimeoutMs = "tarballBytes" in artifact ? bundleTransferTimeoutMs(artifact.tarballBytes, DEFAULT_BOOTSTRAP_TIMEOUT_MS) : 0;
	return DEFAULT_BOOTSTRAP_TIMEOUT_MS * 3 + transferTimeoutMs + BOOTSTRAP_OPERATION_HEADROOM_MS;
}
//#endregion
export { workerBootstrapOperationTimeoutMs as a, bundleTransferTimeoutMs as i, MAX_NODE_BOOTSTRAP_TIMEOUT_MS as n, NODE_ENROLLMENT_TIMEOUT_MS as r, DEFAULT_BOOTSTRAP_TIMEOUT_MS as t };
