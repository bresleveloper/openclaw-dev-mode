import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { d as readDatabasePathIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { s as hasWorktreeUnknownOutcome } from "./errors-WYf-uyBk.mjs";
import { n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-BPKnfJ8N.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { d as runSqliteWorkerStoreOperation } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as withOpenClawStateLeasesWorkerAdmission } from "./openclaw-state-lease-worker-owner-kokQJCiD.mjs";
import { i as releaseOpenClawStateLeaseBestEffort } from "./openclaw-state-lease-storage-CoE2b53O.mjs";
import { n as withOpenClawStateLeaseAsync } from "./openclaw-state-lease-B69mLcu_.mjs";
import { t as runGitWorkerOperation } from "./git-worker-DahANBH3.mjs";
import { a as WORKTREE_CAPACITY_RESERVATION_SCOPE, o as WORKTREE_CREATE_LEASE_SCOPE, s as WORKTREE_MUTATION_LEASE_SCOPE } from "./registry-publication-BJype9QG.mjs";
import { r as runWithOpenClawStateLeasesWorker } from "./openclaw-state-lease-worker-operation-DL82kt2g.mjs";
import { i as timeWorktreePreparationPhase, r as startWorktreePreparationPhase } from "./preparation-timing-BalEUWpk.mjs";
import { i as captureWorktreeRunEndContext, o as retainWorktreeRunEndFailure } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { a as runWorktreeRunEndCommand } from "./registry-run-end-C_3vIy6v.mjs";
import { randomUUID } from "node:crypto";
import { hostname } from "node:os";
//#region src/agents/worktrees/capacity-store.ts
async function reserveWorktreeCapacity(params) {
	return await runWithOpenClawStateLeasesWorker(params.leaseSet.leases, params.leaseSet.context, (scope, leases) => scope.execute({
		type: "worktrees.reserveCapacity",
		input: {
			...params.request,
			leases,
			predicates: params.predicates
		}
	}), {
		assertCurrent: params.assertCurrent,
		beforeCommit: params.assertCurrent,
		signal: params.signal
	});
}
/** Exact-token release outlives caller cancellation, after the allocation owner joined native work. */
async function releaseWorktreeCapacity(params) {
	const { openOpenClawStateWorkerCleanupStore } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	const databasePath = params.context.admission.databasePath;
	const identity = await readDatabasePathIdentity(databasePath);
	if (identity.key !== params.context.admission.identity.key) throw new Error("Managed worktree reservation cleanup cannot adopt a replacement database");
	params.assertCurrent();
	const cleanupContext = {
		environment: params.context.environment,
		existingSchemaPath: params.context.existingSchemaPath,
		stateIntegrity: params.context.stateIntegrity
	};
	const store = await openOpenClawStateWorkerCleanupStore(databasePath, cleanupContext, params.assertCurrent, identity, params.context.maintenanceScope);
	if (!store) throw new Error("Managed worktree reservation cleanup lost its original database");
	let settled;
	const errors = [];
	try {
		await runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
			type: "stateLease.release",
			input: {
				identity: {
					scope: WORKTREE_CAPACITY_RESERVATION_SCOPE,
					key: params.key,
					owner: params.key
				},
				databaseIdentity: identity.key,
				operationLabel: "agents.worktrees.capacity-release"
			}
		}), cleanupContext, params.assertCurrent, (operation) => {
			settled = operation.settled;
			return {
				nativeLocations: [databasePath],
				admission: createSqliteWorkerOperationAdmission((_request, grant) => {
					params.assertCurrent();
					grant();
				})
			};
		});
	} catch (error) {
		errors.push(error);
	} finally {
		await settled;
	}
	try {
		await store.close();
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Managed worktree reservation release and worker close failed");
}
//#endregion
//#region src/agents/worktrees/capacity.ts
const WORKTREE_SETUP_HEADROOM_BYTES = 4 * 1024 ** 3;
const pendingCapacityReleases = /* @__PURE__ */ new Set();
/** Failed exact-token releases stay owned until a later admission or maintenance pass succeeds. */
async function retryWorktreeCapacityReleases(env) {
	if (pendingCapacityReleases.size === 0) return [];
	const failures = [];
	const current = captureOpenClawStateWorkerContext({ env }).admission;
	for (const cleanup of pendingCapacityReleases) {
		const original = cleanup.context.admission;
		if (original.databasePath !== current.databasePath || original.identity.key !== current.identity.key) continue;
		try {
			await cleanup.retry();
		} catch (error) {
			failures.push(error);
		}
	}
	return failures;
}
var WorktreeCapacityContentionError = class extends Error {
	constructor(message, reservationKey) {
		super(message);
		this.reservationKey = reservationKey;
		this.name = "WorktreeCapacityContentionError";
	}
};
async function requireAllocationSpace(guard, env, target, repository, bytes = 0) {
	await timeWorktreePreparationPhase("diskAdmission", () => guard.requireDiskSpace([
		{
			path: target,
			bytes
		},
		{
			path: repository.commonDir,
			bytes: 0
		},
		{
			path: repository.sourceRoot,
			bytes: 0
		},
		{
			path: resolveStateDir(env),
			bytes: 0
		}
	], "worktree allocation"));
}
/** Byte debt survives lease expiry until its native work settles, like existing worktree run custody. */
function createWorktreeDiskAdmission(params) {
	const key = randomUUID();
	const context = captureWorktreeRunEndContext(params.env);
	const { leaseSet, assertCurrent: assertWorkerCurrent } = params.workerAuthority;
	const predicates = structuredClone(params.workerAuthority.predicates);
	const owner = {
		pid: process.pid,
		host: hostname(),
		startedAt: getFileLockProcessStartTime(process.pid)
	};
	let reserved = false;
	let closed = false;
	let releasing;
	const release = () => {
		closed = true;
		if (!reserved) return Promise.resolve();
		return releasing ??= (async () => {
			try {
				await releaseOpenClawStateLeaseBestEffort({
					scope: WORKTREE_CAPACITY_RESERVATION_SCOPE,
					key,
					owner: key,
					database: {
						scope: "shared",
						options: {
							path: context.admission.databasePath,
							env: context.environment
						}
					},
					leaseLabel: "managed worktree capacity reservation",
					operationLabel: "agents.worktrees.capacity-release"
				}, () => releaseWorktreeCapacity({
					context,
					key,
					assertCurrent: () => {
						if (!closed || !reserved) throw new Error("Managed worktree reservation cleanup is no longer owned");
					}
				}));
				reserved = false;
				pendingCapacityReleases.delete(cleanup);
			} catch (cause) {
				pendingCapacityReleases.add(cleanup);
				throw new Error("Managed worktree disk reservation cleanup failed; capacity release is unconfirmed", { cause });
			} finally {
				releasing = void 0;
			}
		})();
	};
	const cleanup = {
		context,
		retry: release
	};
	return {
		requireDiskSpace: async (demands, purpose, snapshot = false, signal = params.workerAuthority.signal) => {
			if (closed) throw new Error("Managed worktree disk admission has closed");
			signal?.throwIfAborted();
			params.assertCurrent();
			if (pendingCapacityReleases.size > 0) {
				await racePromiseWithAbortSignal(retryWorktreeCapacityReleases(params.env), signal);
				params.assertCurrent();
			}
			reserved = true;
			const result = await reserveWorktreeCapacity({
				leaseSet,
				request: {
					key,
					owner,
					demands,
					purpose,
					snapshot
				},
				predicates,
				signal,
				assertCurrent: () => {
					context.admission.assertCurrent();
					assertWorkerCurrent?.();
				}
			});
			params.assertCurrent();
			if (!result.admitted) throw result.reservationKey ? new WorktreeCapacityContentionError(result.message, result.reservationKey) : new Error(result.message);
		},
		release
	};
}
async function estimateWorktreeGitBytes(repoRoot, ref, options = {}) {
	return await runGitWorkerOperation({
		type: "worktree.git-size",
		input: {
			repoRoot,
			ref,
			replacementRefBase: process.env.GIT_REPLACE_REF_BASE ?? "refs/replace/",
			preparationKey: options.preparationKey
		}
	}, options);
}
/** Budget a full snapshot checkout or the destination blobs written over a source clone. */
async function estimateWorktreeCheckoutTransitionBytes(repoRoot, baseRef, targetRef, options = {}) {
	return await runGitWorkerOperation({
		type: "worktree.checkout-transition-size",
		input: {
			repoRoot,
			baseRef,
			targetRef,
			replacementRefBase: process.env.GIT_REPLACE_REF_BASE ?? "refs/replace/"
		}
	}, options);
}
/** Each call measures current files; allocation cannot use a settled directory-size cache. */
async function directorySizeBytes(root, excludeGit = false, options = {}) {
	return await runGitWorkerOperation({
		type: "worktree.directory-size",
		input: {
			root,
			excludeGit
		}
	}, options);
}
//#endregion
//#region src/agents/worktrees/pending-slots.ts
async function readWorktreeSlotCount(env) {
	const context = captureWorktreeRunEndContext(env);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.slotCount",
		input: void 0
	});
}
async function readPendingWorktrees(env) {
	const context = captureWorktreeRunEndContext(env);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.pendingSlots",
		input: void 0
	});
}
function reservePendingWorktree(env, record, authority) {
	return runWorktreeRunEndCommand(captureWorktreeRunEndContext(env), {
		type: "worktrees.reservePending",
		input: {
			value: {
				record,
				owner: {
					pid: process.pid,
					host: hostname(),
					startedAt: getFileLockProcessStartTime(process.pid)
				}
			},
			receipt: randomUUID()
		}
	}, authority);
}
function releasePendingWorktree(env, id, authority) {
	return runWorktreeRunEndCommand(captureWorktreeRunEndContext(env), {
		type: "worktrees.releasePending",
		input: {
			value: { id },
			receipt: randomUUID()
		}
	}, authority);
}
function recoverPendingWorktrees(env, authority) {
	return runWorktreeRunEndCommand(captureWorktreeRunEndContext(env), {
		type: "worktrees.recoverPending",
		input: {
			value: void 0,
			receipt: randomUUID()
		}
	}, authority);
}
//#endregion
//#region src/agents/worktrees/allocation.ts
const WORKTREE_CREATE_LEASE_MS = 6e4;
const WORKTREE_CREATE_LEASE_WAIT_MS = 18e5;
/** Serialize slot admission and count-changing maintenance across repositories and processes. */
async function withWorktreeAllocationLease(params, run) {
	return await withWorktreeLease(params, WORKTREE_CREATE_LEASE_SCOPE, "capacity", (guard) => timeWorktreePreparationPhase("reservation", async () => {
		await recoverPendingWorktrees(params.env, guard.workerAuthority);
		return params.id ? withWorktreeMutationLease({
			...params,
			...guard,
			id: params.id
		}, run) : run(guard);
	}));
}
/** Registered retirement owns only its checkout; disk admission accounts for concurrent writes. */
async function withWorktreeMutationLease(params, run) {
	return await withWorktreeLease(params, WORKTREE_MUTATION_LEASE_SCOPE, params.id, run);
}
async function waitForWorktreeCapacity(error, params) {
	params.commitGuard?.();
	const waiting = startWorktreeWait(params.waitBudget);
	const finishWait = startWorktreePreparationPhase("capacityWait");
	try {
		await withOpenClawStateLeaseAsync({
			scope: WORKTREE_CAPACITY_RESERVATION_SCOPE,
			key: error.reservationKey,
			leaseMs: WORKTREE_CREATE_LEASE_MS,
			waitMs: waiting.waitMs,
			signal: params.signal,
			leaseLabel: "managed worktree disk admission",
			operationLabel: "agents.worktrees.capacity-wait"
		}, captureWorktreeRunEndContext(params.env), async () => {
			waiting.end();
			finishWait();
			params.commitGuard?.();
		});
	} catch (acquisitionError) {
		waiting.end(acquisitionError);
		throw acquisitionError;
	} finally {
		waiting.end();
		finishWait();
	}
}
function startWorktreeWait(budget) {
	const startedAt = performance.now();
	let active = true;
	return {
		waitMs: Math.max(0, Math.floor(budget?.remainingMs ?? 18e5)),
		end(error) {
			if (!active) return;
			active = false;
			if (budget) budget.remainingMs = Math.max(0, budget.remainingMs - (performance.now() - startedAt));
			if (budget && error instanceof OpenClawStateLeaseError && error.code === "OPENCLAW_STATE_LEASE_HELD") throw new Error("Managed worktree creation timed out waiting for capacity or checkout custody; inspect openclaw worktrees list and run openclaw worktrees gc before retrying.", { cause: error });
		}
	};
}
async function withWorktreeLease(params, scope, key, run) {
	const acquisition = new AbortController();
	const abortAcquisition = () => acquisition.abort(params.signal?.reason);
	params.signal?.addEventListener("abort", abortAcquisition, { once: true });
	if (params.signal?.aborted) abortAcquisition();
	const waiting = startWorktreeWait(params.waitBudget);
	const finishWait = startWorktreePreparationPhase(scope === "core:managed-worktrees:create" ? "allocationWait" : "mutationWait");
	let finishRelease;
	try {
		params.commitGuard?.();
		const captured = captureWorktreeRunEndContext(params.env);
		const inherited = params.workerAuthority?.leaseSet;
		const context = inherited?.context ?? captured;
		if (context.admission.coordinationKey !== captured.admission.coordinationKey) throw new Error("Managed worktree lease set belongs to another database");
		return await withOpenClawStateLeaseAsync({
			scope,
			key,
			leaseMs: WORKTREE_CREATE_LEASE_MS,
			waitMs: waiting.waitMs,
			heartbeat: "worker",
			leaseLabel: "managed worktree allocation lease",
			operationLabel: "agents.worktrees.allocation",
			signal: acquisition.signal
		}, context, (lease) => {
			waiting.end();
			const leaseSet = {
				context,
				leases: [...inherited?.leases ?? [], lease],
				mutationWorktreeIds: [...inherited?.mutationWorktreeIds ?? [], ...scope === "core:managed-worktrees:mutation" ? [key] : []]
			};
			return withOpenClawStateLeasesWorkerAdmission(leaseSet.leases, context, async (authority) => {
				finishWait();
				params.signal?.removeEventListener("abort", abortAcquisition);
				const signal = params.signal ? AbortSignal.any([params.signal, lease.signal]) : lease.signal;
				const assertOwned = () => {
					authority.assertCurrent();
				};
				const commitGuard = () => {
					assertOwned();
					signal.throwIfAborted();
					params.commitGuard?.();
				};
				const workerAuthority = {
					leaseSet,
					predicates: params.workerAuthority?.predicates,
					assertCurrent: () => {
						captured.admission.assertCurrent();
						signal.throwIfAborted();
						(params.workerAuthority ? params.workerAuthority.assertCurrent : params.commitGuard)?.();
					}
				};
				const capacity = createWorktreeDiskAdmission({
					env: params.env,
					workerAuthority,
					assertCurrent: commitGuard
				});
				let releaseCapacity = true;
				try {
					const result = await run({
						signal,
						waitBudget: params.waitBudget,
						commitGuard,
						rollbackGuard: () => {
							assertOwned();
							params.rollbackGuard?.();
						},
						workerAuthority,
						requireDiskSpace: capacity.requireDiskSpace
					});
					signal.throwIfAborted();
					return result;
				} catch (error) {
					if (hasWorktreeUnknownOutcome(error)) {
						releaseCapacity = false;
						retainWorktreeRunEndFailure(error);
						throw error;
					}
					if (params.signal?.aborted) {
						assertOwned();
						throw new OpenClawStateLeaseError("managed worktree allocation lease operation was aborted", {
							code: "OPENCLAW_STATE_LEASE_ABORTED",
							cause: params.signal.reason
						});
					}
					throw error;
				} finally {
					finishRelease = startWorktreePreparationPhase("leaseRelease");
					if (releaseCapacity) await capacity.release();
				}
			});
		});
	} catch (error) {
		waiting.end(error);
		throw error;
	} finally {
		waiting.end();
		finishWait();
		finishRelease?.();
		params.signal?.removeEventListener("abort", abortAcquisition);
	}
}
//#endregion
export { withWorktreeMutationLease as a, releasePendingWorktree as c, WorktreeCapacityContentionError as d, directorySizeBytes as f, retryWorktreeCapacityReleases as g, requireAllocationSpace as h, withWorktreeAllocationLease as i, reservePendingWorktree as l, estimateWorktreeGitBytes as m, startWorktreeWait as n, readPendingWorktrees as o, estimateWorktreeCheckoutTransitionBytes as p, waitForWorktreeCapacity as r, readWorktreeSlotCount as s, WORKTREE_CREATE_LEASE_WAIT_MS as t, WORKTREE_SETUP_HEADROOM_BYTES as u };
