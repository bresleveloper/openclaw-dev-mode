import { createHash } from "node:crypto";
//#region src/shared/worker-bundle-hash.ts
const WORKER_BUNDLE_MANIFEST_VERSION = "openclaw-worker-bundle-v1";
const WORKER_BUNDLE_ENTRY_PATH = "worker.mjs";
const WORKER_BUNDLE_GITHUB_EXEC_LAUNCHER_PATH = "github-exec-launcher.mjs";
const WORKER_BUNDLE_IMAGE_PROCESSOR_PATH = "image-processor.worker.mjs";
const WORKER_BUNDLE_RSYNC_RECEIVER_PATH = "workspace-rsync-receiver.mjs";
const WORKER_BUNDLE_ARTIFACT_PATHS = [
	WORKER_BUNDLE_GITHUB_EXEC_LAUNCHER_PATH,
	WORKER_BUNDLE_IMAGE_PROCESSOR_PATH,
	"service-child-group-anchor.mjs",
	"service-child-relay.mjs",
	"sqlite-store.worker.mjs",
	WORKER_BUNDLE_ENTRY_PATH,
	WORKER_BUNDLE_RSYNC_RECEIVER_PATH
];
/** Immutable source archive within the running node's owning package, outside its dist inventory. */
function workerBundleArchiveRelativePath(sha256) {
	if (!/^[a-f0-9]{64}$/u.test(sha256)) throw new Error("Invalid worker bundle archive SHA-256");
	return `worker-artifacts/${sha256}.tgz`;
}
function compareWorkerBundlePaths(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
}
/** Hashes the canonical worker manifest shared by Gateway bundles and node-local installs. */
function hashWorkerBundleManifest(entries) {
	const hash = createHash("sha256");
	hash.update(`${WORKER_BUNDLE_MANIFEST_VERSION}\0`);
	for (const entry of entries) hash.update(`${entry.path}\0${entry.mode.toString(8)}\0${entry.size}\0${entry.sha256}\0`);
	return hash.digest("hex");
}
//#endregion
export { compareWorkerBundlePaths as a, WORKER_BUNDLE_RSYNC_RECEIVER_PATH as i, WORKER_BUNDLE_ENTRY_PATH as n, hashWorkerBundleManifest as o, WORKER_BUNDLE_MANIFEST_VERSION as r, workerBundleArchiveRelativePath as s, WORKER_BUNDLE_ARTIFACT_PATHS as t };
