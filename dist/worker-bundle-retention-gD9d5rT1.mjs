import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { n as isTerminalWorkerEnvironmentState } from "./state-DfozG-Xp.mjs";
import { n as readWorkerPreparation } from "./preparation-identity.schema-D-YjGy-J.mjs";
//#region src/gateway/worker-environments/worker-bundle-retention.ts
const RECOVERY_BUNDLE_PLACEMENT_STATES = /* @__PURE__ */ new Set([
	"syncing",
	"starting",
	"active",
	"draining",
	"reconciling"
]);
function listRetainedWorkerBundleHashes(params) {
	return uniqueStrings([...params.environments.flatMap((record) => {
		if (isTerminalWorkerEnvironmentState(record.state)) return [];
		const bundleHash = record.bootstrapReceipt?.bundleHash ?? (record.state === "provisioning" ? readWorkerPreparation(record.profileSnapshot)?.artifacts.workerBundleHash : void 0);
		return bundleHash ? [bundleHash] : [];
	}), ...params.placements.flatMap((placement) => placement.workerBundleHash && RECOVERY_BUNDLE_PLACEMENT_STATES.has(placement.state) ? [placement.workerBundleHash] : [])]);
}
//#endregion
export { listRetainedWorkerBundleHashes as t };
