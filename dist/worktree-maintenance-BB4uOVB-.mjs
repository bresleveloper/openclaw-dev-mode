import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import "./errors-DPfGDWk1.mjs";
import { s as getRuntimeConfigSnapshotMetadata } from "./runtime-snapshot-BBYDJbw9.mjs";
import { D as tryResolveLegacyDataOwnerAgentId, E as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { T as runWithGatewayIndependentRootWorkAdmission, h as isGatewayWorkAdmissionClosed } from "./gateway-work-admission-FWbk4b3p.mjs";
import { C as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-BtDOU_3j.mjs";
import { a as managedWorktrees, i as WORKTREE_GC_INTERVAL_MS, o as WorktreeGcProgress } from "./service-BPAgan76.mjs";
import { t as createManagedWorktreeOwnerPolicy } from "./owner-protection-IbYRKTX9.mjs";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/worktree-maintenance.ts
const owners = /* @__PURE__ */ new WeakMap();
function captureCleanupInputs(config) {
	const defaults = config.agents?.defaults;
	return {
		worktreeRoot: config.worktreeRoot,
		worktreeMaxCount: config.worktreeMaxCount,
		sessionStore: config.session?.store,
		mainKey: config.session?.mainKey,
		sessionScope: config.session?.scope,
		agentIds: listAgentIds(config),
		compatibilityOwner: tryResolveLegacyCompatibilityAgentId(config),
		legacyDataOwner: tryResolveLegacyDataOwnerAgentId(config),
		sessionStoreOwner: defaults?.sessionStore?.agentId,
		storeAgentIds: listConfiguredSessionStoreAgentIds(config),
		workspace: defaults?.workspace,
		sandboxMode: defaults?.sandbox?.mode,
		agents: listAgentEntries(config).map(({ id, workspace, agentDir, sandbox }) => ({
			id,
			workspace,
			agentDir,
			sandboxMode: sandbox?.mode
		}))
	};
}
/** Hourly and requested cleanup share a cursor, admission, progress, and shutdown drain. */
function startWorktreeMaintenance(params) {
	const previousDrain = owners.get(params.getRuntimeConfig)?.stop();
	const scheduler = params.scheduler.scope();
	const inOwnerContext = AsyncLocalStorage.snapshot();
	let receipt;
	let inFlight;
	let archivePending = false;
	const isActive = () => !scheduler.signal.aborted && owners.get(params.getRuntimeConfig) === owner && !isGatewayWorkAdmissionClosed();
	const assertActive = () => {
		if (!isActive()) throw new Error("Worktree cleanup canceled because the Gateway maintenance owner is stopping");
	};
	const owner = {
		request: ({ jobId, retryDeferred } = {}) => {
			assertActive();
			if (jobId) {
				if (!receipt || receipt.jobId !== jobId) throw new Error("Worktree cleanup job is no longer available; only the latest job is retained");
				return structuredClone(receipt);
			}
			if (receipt?.state === "queued" || receipt?.state === "running") return structuredClone(receipt);
			const config = params.getRuntimeConfig();
			const cleanupInputs = captureCleanupInputs(config);
			let checkedConfig = config;
			let checkedPublication = getRuntimeConfigSnapshotMetadata();
			const current = {
				...new WorktreeGcProgress().result,
				jobId: randomUUID(),
				state: "queued",
				startedAt: null,
				completedAt: null,
				error: null
			};
			receipt = current;
			const assertCurrent = () => {
				assertActive();
				const nextConfig = params.getRuntimeConfig();
				const publication = getRuntimeConfigSnapshotMetadata();
				if (nextConfig !== checkedConfig || publication !== checkedPublication) {
					if (!isDeepStrictEqual(captureCleanupInputs(nextConfig), cleanupInputs)) throw new Error("Worktree cleanup canceled because its runtime configuration changed");
					checkedConfig = nextConfig;
					checkedPublication = publication;
				}
			};
			inOwnerContext(() => scheduler.schedule({
				id: "maintenance:worktrees:run",
				delayMs: 0,
				run: () => {
					current.state = "running";
					current.startedAt = scheduler.now();
					let batchStartedAt = scheduler.now();
					let batchItems = 0;
					inFlight = runWithGatewayIndependentRootWorkAdmission(async () => {
						await previousDrain;
						assertCurrent();
						const result = await (params.runGc ? params.runGc() : managedWorktrees.gc({
							...createManagedWorktreeOwnerPolicy(config),
							retryDeferred,
							signal: scheduler.signal,
							commitGuard: assertCurrent,
							checkpoint: async (progress) => {
								Object.assign(current, progress);
								assertCurrent();
								if (++batchItems < 8 && scheduler.now() - batchStartedAt < 5e3) return;
								await new Promise((resolve, reject) => {
									const abort = () => reject(toErrorObject(scheduler.signal.reason, "Worktree cleanup canceled"));
									scheduler.signal.addEventListener("abort", abort, { once: true });
									scheduler.schedule({
										id: "maintenance:worktrees:resume",
										delayMs: 1e3,
										run: () => {
											scheduler.signal.removeEventListener("abort", abort);
											resolve();
										}
									});
								});
								assertCurrent();
								batchItems = 0;
								batchStartedAt = scheduler.now();
							}
						}));
						assertCurrent();
						if (result) {
							Object.assign(current, result);
							params.onComplete(result);
						}
						current.state = "completed";
					}, "runtime:worktree-cleanup", scheduler.signal).catch((error) => {
						current.state = "failed";
						current.error = error instanceof Error ? error.message : String(error);
						params.onError(current.error);
					}).finally(() => {
						current.completedAt = scheduler.now();
						inFlight = void 0;
						if (archivePending && isActive()) {
							archivePending = false;
							owner.request();
						}
					});
					return inFlight;
				}
			}));
			return structuredClone(current);
		},
		notifyArchive: () => {
			if (!isActive()) return;
			if (receipt?.state === "running") archivePending = true;
			else owner.request();
		},
		stop: async () => {
			await scheduler.stop();
			await inFlight;
			await previousDrain;
			if (owners.get(params.getRuntimeConfig) === owner) owners.delete(params.getRuntimeConfig);
		}
	};
	owners.set(params.getRuntimeConfig, owner);
	scheduler.schedule({
		id: "maintenance:worktrees",
		delayMs: WORKTREE_GC_INTERVAL_MS,
		everyMs: WORKTREE_GC_INTERVAL_MS,
		phase: "maintenance",
		run: () => {
			if (!isGatewayWorkAdmissionClosed()) owner.request();
		}
	});
	return owner;
}
function requestGatewayWorktreeMaintenance(getRuntimeConfig, options = {}) {
	const owner = owners.get(getRuntimeConfig);
	if (!owner) throw new Error("Worktree maintenance is not running; wait for Gateway startup to finish");
	return owner.request(options);
}
/** Durable archive metadata survives startup and shutdown without a live maintenance owner. */
function notifyGatewayWorktreeArchive(getRuntimeConfig) {
	owners.get(getRuntimeConfig)?.notifyArchive();
}
//#endregion
export { requestGatewayWorktreeMaintenance as n, startWorktreeMaintenance as r, notifyGatewayWorktreeArchive as t };
