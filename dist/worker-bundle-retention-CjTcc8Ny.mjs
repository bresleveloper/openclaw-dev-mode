import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as readWorkerProjectPreparation } from "./preparation-identity-B9ncl7Bw.mjs";
//#region src/gateway/worker-environments/worker-bundle-retention.ts
const TERMINAL_ENVIRONMENT_STATES = /* @__PURE__ */ new Set([
	"destroyed",
	"failed",
	"orphaned"
]);
const RECOVERY_BUNDLE_PLACEMENT_STATES = /* @__PURE__ */ new Set([
	"syncing",
	"starting",
	"active",
	"draining",
	"reconciling"
]);
function listRetainedWorkerBundleHashes(params) {
	return uniqueStrings([...params.environments.flatMap((record) => {
		if (TERMINAL_ENVIRONMENT_STATES.has(record.state)) return [];
		const bundleHash = record.bootstrapReceipt?.bundleHash ?? (record.state === "provisioning" ? readWorkerProjectPreparation(record.profileSnapshot.project)?.artifacts.workerBundleHash : void 0);
		return bundleHash ? [bundleHash] : [];
	}), ...params.placements.flatMap((placement) => placement.workerBundleHash && RECOVERY_BUNDLE_PLACEMENT_STATES.has(placement.state) ? [placement.workerBundleHash] : [])]);
}
//#endregion
export { listRetainedWorkerBundleHashes as t };
