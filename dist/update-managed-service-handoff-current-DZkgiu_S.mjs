import { t as createManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-CPNRSilB.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-Nv-hNWki.mjs";
import { c as readControlPlaneUpdateSentinelMeta } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
//#region src/infra/update-managed-service-handoff-current.ts
const activeManagedServiceUpdateHandoffs = /* @__PURE__ */ new Map();
/** A detached helper still shares the system unit's cgroup until it settles. */
function waitForSystemServiceUpdateHandoffs() {
	const updates = [...activeManagedServiceUpdateHandoffs.values()].filter((owner) => owner.operatorRestartWarning && !owner.settled);
	if (!updates.length) return;
	return (async () => {
		await Promise.all(updates.map(async (owner) => {
			await owner.flight;
			await owner.closed;
			if (!owner.settled) throw new Error("System-service updater settlement could not be confirmed.");
		}));
	})();
}
/** A transferred updater may manage its serving ancestor only under its current lease. */
async function isCurrentManagedServiceUpdateHandoffProcess(params) {
	const env = params.env ?? process.env;
	if (env.OPENCLAW_UPDATE_RUN_HANDOFF !== "1" || !params.runId) return false;
	const meta = await readControlPlaneUpdateSentinelMeta(env);
	const root = resolveUpdateInstallRoot(params.root);
	if (meta?.runId !== params.runId || !meta.handoffId || !meta.root || resolveUpdateInstallRoot(meta.root) !== root) return false;
	const lease = readManagedServiceUpdateHandoffLease(root, void 0, params.store);
	const store = params.store ?? createManagedHandoffLeaseStore();
	return lease?.owner === meta.handoffId && lease.executor.pid === process.pid && (store.isProcessIdentityCurrent(lease.executor) || process.connected && store.acceptParentBoundExecutor(lease));
}
function readManagedServiceUpdateHandoffLease(root, stale, selectedStore) {
	const owner = stale ?? activeManagedServiceUpdateHandoffs.get(root);
	const store = selectedStore ?? (owner ? owner.leaseStore : createManagedHandoffLeaseStore());
	const result = store?.read(root);
	if (!store || result?.kind !== "current") return result?.kind === "absent" ? null : void 0;
	const lease = result.lease;
	if (stale?.handoffId === lease.owner && JSON.stringify(stale.helper?.helper) === JSON.stringify(lease.helper) && (lease.action.kind !== "update" || stale.helper?.payload === lease.payload) && (lease.action.kind !== "triage" || stale.helper?.action.kind === "triage" && JSON.stringify(stale.helper.action.lifetime) === JSON.stringify(lease.action.lifetime)) && store.release(lease)) return null;
	return lease;
}
//#endregion
export { waitForSystemServiceUpdateHandoffs as i, isCurrentManagedServiceUpdateHandoffProcess as n, readManagedServiceUpdateHandoffLease as r, activeManagedServiceUpdateHandoffs as t };
