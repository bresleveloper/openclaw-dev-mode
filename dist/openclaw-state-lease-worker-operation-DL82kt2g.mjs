import { i as withOpenClawStateLeasesWorkerAdmission, r as withOpenClawStateLeaseWorkerAdmission } from "./openclaw-state-lease-worker-owner-kokQJCiD.mjs";
import { r as prepareOpenClawStateLeaseStorageRuntime } from "./openclaw-state-lease-worker-storage-DRWyFRQ1.mjs";
//#region src/state/openclaw-state-lease-worker-operation.ts
/** Both importers must resolve their transport before package replacement. */
async function prepareOpenClawStateLeaseWorkerRuntime() {
	await Promise.all([prepareOpenClawStateLeaseStorageRuntime(), import("./openclaw-state-worker-store-1jCE83ab.mjs")]);
}
/** Retain the actual lease until every admitted worker transaction has settled. */
function runWithOpenClawStateLeaseWorker(lease, context, operation, authority) {
	return withOpenClawStateLeaseWorkerAdmission(lease, context.admission.databasePath, async (admission) => {
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
		return runOpenClawStateWorkerOperation(context, (scope) => operation(scope, admission.identity), {
			assertCurrent: admission.assertCurrent,
			createAdmission: admission.createAdmission,
			signal: authority?.signal
		});
	}, authority);
}
/** Share one actor operation while every original lease retains its native settlement. */
function runWithOpenClawStateLeasesWorker(leases, context, operation, authority) {
	return withOpenClawStateLeasesWorkerAdmission(leases, context, async (admission) => {
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
		admission.assertCurrent();
		return runOpenClawStateWorkerOperation(context, (scope) => operation(scope, admission.identities), {
			assertCurrent: admission.assertCurrent,
			createAdmission: admission.createAdmission,
			signal: authority?.signal
		});
	}, authority);
}
//#endregion
export { runWithOpenClawStateLeaseWorker as n, runWithOpenClawStateLeasesWorker as r, prepareOpenClawStateLeaseWorkerRuntime as t };
