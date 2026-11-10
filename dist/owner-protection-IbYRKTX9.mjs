import { a as WorktreeRemovalLockError } from "./errors-WYf-uyBk.mjs";
import { a as sessionChanges, i as sessionChangeScopeAffectsStoredRows } from "./session-row-changes-vFaNnKNM.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { S as runExclusiveSessionLifecycleMutation, b as isSessionWorkAdmissionActive, y as isSessionLifecycleMutationActive } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { r as readResolvedSessionStoreTargetsInWorker } from "./session-accessor.entry-read-runtime-BoYobsOQ.mjs";
import "./service-BPAgan76.mjs";
import "./removal-git-BhpnO_Vq.mjs";
import { u as resolveSessionWorkerPlacementMutationError } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-DJzLYZPW.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
import { scheduler } from "node:timers/promises";
//#region src/agents/worktrees/owner-protection.ts
function createManagedWorktreeOwnerPolicy(cfg, now = Date.now) {
	let preparedOwners = /* @__PURE__ */ new Map();
	const cleanupOwner = new AsyncLocalStorage();
	const state = (ownerKind, ownerId, prepared) => {
		if (ownerKind !== "session") return "other";
		try {
			const cleanup = cleanupOwner.getStore();
			const ownsCleanup = cleanup?.ownerId === ownerId;
			const target = prepared?.target ?? (ownsCleanup ? cleanup.target : void 0);
			if (!target || ownsCleanup && cleanup.hasChanged()) return "active";
			const entry = target.entry;
			const activityAt = Math.max(entry?.lastInteractionAt ?? 0, entry?.updatedAt ?? 0);
			if (entry?.archivedAt === void 0 && activityAt > 0 && now() - activityAt <= 6048e5) return "active";
			const scope = resolveSessionStorePathCore(cfg.session?.store, { agentId: target.agentId });
			const identities = [
				target.canonicalKey,
				ownerId,
				entry?.sessionId
			];
			if (ownsCleanup && (cleanup.scope !== scope || cleanup.entry?.sessionId !== entry?.sessionId || cleanup.entry?.lifecycleRevision !== entry?.lifecycleRevision || cleanup.entry?.archivedAt !== entry?.archivedAt || !isDeepStrictEqual(cleanup.entry?.worktree, entry?.worktree))) return "active";
			if (isSessionWorkAdmissionActive(scope, identities) || !(ownsCleanup && cleanup.lifecycleHeld) && isSessionLifecycleMutationActive(scope, identities)) return "active";
			const placements = prepared?.placements ?? (ownsCleanup ? cleanup.placements : void 0);
			if (!placements) return "active";
			for (const placement of placements.current(target)) {
				if (placement.sessionKey !== target.canonicalKey && placement.sessionId !== entry?.sessionId) continue;
				if (placement.turnClaim || resolveSessionWorkerPlacementMutationError({
					action: "fork",
					context: {
						...placements.context,
						workerSessionPlacementService: { getMany: () => /* @__PURE__ */ new Map([[placement.sessionId, placement]]) }
					},
					key: target.canonicalKey,
					sessionId: placement.sessionId
				})) return "active";
			}
			return !entry || entry.archivedAt !== void 0 ? "retired" : "idle";
		} catch {
			return "active";
		}
	};
	return {
		prepareOwners: async (records) => {
			preparedOwners = /* @__PURE__ */ new Map();
			const ownerIds = [...new Set(records.flatMap((record) => record.removedAt === void 0 && record.ownerKind === "session" && record.ownerId ? [record.ownerId] : []))];
			const states = /* @__PURE__ */ new Map();
			try {
				const context = resolveSessionWorkerPlacementContext();
				if (!context.workerSessionPlacementService?.listAsync) throw new Error("Worker placement census is unavailable");
				const [targets, placements] = await Promise.all([readResolvedSessionStoreTargetsInWorker({
					cfg,
					sessionKeys: ownerIds
				}, "worktree"), context.workerSessionPlacementService.listAsync()]);
				preparedOwners = targets;
				const placementsByKey = /* @__PURE__ */ new Map();
				const placementsById = /* @__PURE__ */ new Map();
				for (const placement of placements) {
					const matches = placementsByKey.get(placement.sessionKey);
					if (matches) matches.push(placement);
					else placementsByKey.set(placement.sessionKey, [placement]);
					placementsById.set(placement.sessionId, placement);
				}
				const prepared = { placements: {
					context,
					*current(target) {
						yield* placementsByKey.get(target.canonicalKey) ?? [];
						const placement = placementsById.get(target.entry?.sessionId ?? "");
						if (placement && placement.sessionKey !== target.canonicalKey) yield placement;
					}
				} };
				for (const [index, id] of ownerIds.entries()) {
					if (index % 32 === 0) await scheduler.yield();
					const target = targets.get(id);
					states.set(id, target ? state("session", id, {
						...prepared,
						target
					}) : "active");
				}
			} catch {}
			return { readOwnerState: (kind, id) => kind === "session" ? states.get(id) ?? "active" : "other" };
		},
		readOwnerState: (kind, id) => state(kind, id),
		withOwnerCleanup: async (record, run, signal) => {
			if (record.ownerKind !== "session" || !record.ownerId) return await run((mutation) => mutation());
			const ownerId = record.ownerId;
			const expected = preparedOwners.get(ownerId);
			let target = expected;
			let changed = false;
			const stop = sessionChanges.subscribeFacts((change) => {
				if (sessionChangeScopeAffectsStoredRows(change) && ("all" in change || !target || change.sessionKey === ownerId || change.sessionKey === target.canonicalKey)) changed = true;
			});
			try {
				target = (await readResolvedSessionStoreTargetsInWorker({
					cfg,
					sessionKeys: [ownerId]
				}, "worktree")).get(ownerId);
				signal?.throwIfAborted();
				if (!target) throw new WorktreeRemovalLockError("busy", "worktree owner could not be read for cleanup");
				const initial = expected ?? target;
				const scope = resolveSessionStorePathCore(cfg.session?.store, { agentId: initial.agentId });
				const entry = initial.entry;
				const owner = {
					ownerId,
					scope,
					target,
					hasChanged: () => changed,
					entry: entry && {
						...entry,
						worktree: entry.worktree && { ...entry.worktree }
					}
				};
				const identities = [
					target.canonicalKey,
					ownerId,
					owner.entry?.sessionId
				];
				const context = resolveSessionWorkerPlacementContext();
				const store = context.workerSessionPlacementService;
				if (!store?.prepareMaintenancePlacements || !store.prepareSessionPlacement) throw new WorktreeRemovalLockError("busy", "worker placement preparation is unavailable");
				const inventory = await store.prepareMaintenancePlacements();
				let sessionPlacement;
				try {
					if (entry?.sessionId) sessionPlacement = await store.prepareSessionPlacement(entry.sessionId);
					const placements = {
						context,
						current: () => {
							inventory.assertCurrent();
							const current = sessionPlacement?.current();
							return current ? [...inventory.placements, current] : inventory.placements;
						}
					};
					return await cleanupOwner.run({
						...owner,
						placements
					}, () => run((mutation, options) => runExclusiveSessionLifecycleMutation("worktree-cleanup", {
						scope,
						identities,
						signal: options?.settle ? void 0 : signal,
						run: () => cleanupOwner.run({
							...owner,
							placements,
							lifecycleHeld: true
						}, mutation)
					})));
				} finally {
					sessionPlacement?.release();
					inventory.release();
				}
			} finally {
				stop();
			}
		}
	};
}
//#endregion
export { createManagedWorktreeOwnerPolicy as t };
