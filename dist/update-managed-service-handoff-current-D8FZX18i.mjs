import { t as resolveUpdateInstallRoot } from "./update-install-root-DH-onosx.mjs";
import { t as createManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-C2LEup70.mjs";
import { c as readControlPlaneUpdateSentinelMeta } from "./update-control-plane-sentinel-Du9790-7.mjs";
//#region src/infra/update-managed-service-handoff-current.ts
const activeManagedServiceUpdateHandoffs = /* @__PURE__ */ new Map();
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
export { isCurrentManagedServiceUpdateHandoffProcess as n, readManagedServiceUpdateHandoffLease as r, activeManagedServiceUpdateHandoffs as t };
