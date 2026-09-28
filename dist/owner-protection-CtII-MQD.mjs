import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { h as isSessionWorkAdmissionActive, m as isSessionLifecycleMutationActive } from "./session-lifecycle-admission-Pys9TN37.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { a as resolveSessionEntryAccessTarget } from "./session-accessor.entry-BFzDgQIL.mjs";
import { i as prepareSessionWorkerPlacementMutationCheck } from "./session-placement-lifecycle-DAKgxrlj.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-BLRgDgSo.mjs";
import "./service-BPmV9ykg.mjs";
//#region src/agents/worktrees/owner-protection.ts
function createManagedWorktreeOwnerPolicy(cfg, now = Date.now) {
	const placementChecks = /* @__PURE__ */ new Map();
	const state = (ownerKind, ownerId) => {
		if (ownerKind !== "session") return "other";
		try {
			const target = resolveSessionEntryAccessTarget({
				cfg,
				sessionKey: ownerId
			});
			const entry = target.entry;
			const scope = resolveSessionStorePathCore(cfg.session?.store, { agentId: target.agentId });
			const identities = [
				target.canonicalKey,
				ownerId,
				entry?.sessionId
			];
			if (isSessionWorkAdmissionActive(scope, identities) || isSessionLifecycleMutationActive(scope, identities)) return "active";
			let placementCheck = placementChecks.get(target.canonicalKey);
			if (placementCheck && placementCheck.sessionId !== entry?.sessionId) return "active";
			if (!placementCheck) {
				const context = resolveSessionWorkerPlacementContext();
				const store = context.workerSessionPlacementService;
				if (!store?.listForReconcile) return "active";
				const related = () => store.listForReconcile(target.canonicalKey).map((placement) => placement.sessionId).toSorted();
				const initial = related();
				const checks = [.../* @__PURE__ */ new Set([...initial, ...entry?.sessionId ? [entry.sessionId] : []])].map((sessionId) => prepareSessionWorkerPlacementMutationCheck({
					context,
					sessionId
				}));
				const assertCurrent = () => {
					if (JSON.stringify(related()) !== JSON.stringify(initial)) throw new Error("worktree worker placement changed during cleanup");
					for (const check of checks) check();
				};
				placementCheck = {
					sessionId: entry?.sessionId,
					assertCurrent
				};
				placementChecks.set(target.canonicalKey, placementCheck);
			}
			placementCheck.assertCurrent();
			if (!entry || entry.archivedAt !== void 0) return "retired";
			const activityAt = Math.max(entry?.lastInteractionAt ?? 0, entry?.updatedAt ?? 0);
			return activityAt > 0 && now() - activityAt <= 6048e5 ? "active" : "idle";
		} catch {
			return "active";
		}
	};
	return {
		shouldProtectOwner: (kind, id) => state(kind, id) === "active",
		shouldRemoveOwner: (kind, id) => state(kind, id) === "retired"
	};
}
//#endregion
export { createManagedWorktreeOwnerPolicy as t };
