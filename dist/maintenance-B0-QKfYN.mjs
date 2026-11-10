import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as normalizeDatabasePath } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as sessionChanges, i as sessionChangeScopeAffectsStoredRows } from "./session-row-changes-vFaNnKNM.mjs";
import { x as isCronRunSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { T as runWithGatewayIndependentRootWorkAdmission, f as isGatewayRestartDrainError } from "./gateway-work-admission-FWbk4b3p.mjs";
import { n as prepareAgentDatabaseDeletionSnapshotRead } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { _ as readAgentDatabaseAdmissionRefusal, m as listAgentDatabaseAdmissionRefusals } from "./agent-database-admission-CeDA0ojh.mjs";
import { n as getAgentDatabaseStartupAdmission } from "./agent-database-startup-DQZqWc4z.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { s as resolveConfiguredAgentDatabaseTargets } from "./targets-DJGC6v85.mjs";
import "./config-B3oiWDlr.mjs";
import { r as runSessionRegistryMaintenanceForStore } from "./sessions-CnzPI1yx.mjs";
import { n as resolveAllAgentSessionStoreTargetsAsync } from "./targets-runtime-l9s-sghb.mjs";
import { r as createRetainedAgentDatabaseMatcherFromSnapshot } from "./agent-deletion-discovery-WZhAVK2X.mjs";
import { n as subscribeCronRunHistoryChanges } from "./run-history-changes-COkgXpaK.mjs";
import { r as loadCronJobsStore } from "./store-HF7PvtRl.mjs";
import { t as maintainCronRunHistory } from "./run-history-B9OUB_d1.mjs";
//#region src/cron/session-registry-maintenance.ts
const log$1 = createSubsystemLogger("cron/maintenance");
const SESSION_REGISTRY_RETENTION_MS = 6048e5;
function resolveExplicitCronSessionSegment(sessionKey) {
	return /^(?:agent:[^:]+:)?cron:([^:]+)$/u.exec(sessionKey?.trim() ?? "")?.[1]?.toLowerCase();
}
async function readRunningCronJobIds(cronStorePath) {
	try {
		const runningJobs = (await loadCronJobsStore(cronStorePath)).jobs.filter((job) => typeof job.state?.runningAtMs === "number");
		const ids = /* @__PURE__ */ new Set();
		for (const job of runningJobs) {
			ids.add(job.id.toLowerCase());
			if (job.sessionTarget === "main") continue;
			const explicitSessionSegment = resolveExplicitCronSessionSegment(job.sessionKey);
			if (explicitSessionSegment) ids.add(explicitSessionSegment);
		}
		return {
			ok: true,
			ids,
			count: runningJobs.length
		};
	} catch (err) {
		return {
			ok: false,
			reason: formatErrorMessage(err)
		};
	}
}
async function runSessionRegistryMaintenance(params) {
	params.assertCurrent?.();
	const cfg = readRuntimeConfig();
	const runningCronJobs = await readRunningCronJobIds(params.cronStorePath);
	params.assertCurrent?.();
	if (!runningCronJobs.ok) return {
		retentionMs: SESSION_REGISTRY_RETENTION_MS,
		runningCronJobs: 0,
		pruned: 0,
		skippedStores: 0,
		stores: [],
		nextSweepAtMs: Date.now() + 6e4,
		skippedReason: `cron store unreadable: ${runningCronJobs.reason}`
	};
	const env = process.env;
	return await prepareAgentDatabaseDeletionSnapshotRead({ env }).withCurrentSnapshot(async (snapshot, assertSnapshotCurrent) => {
		const stores = listAgentDatabaseAdmissionRefusals({ env }).filter((refusal) => readAgentDatabaseAdmissionRefusal(refusal.agentId, { env })).flatMap((refusal) => refusal.paths.map((storePath) => ({
			agentId: refusal.agentId,
			storePath,
			skippedReason: refusal.code
		})));
		const assertCurrent = () => {
			params.assertCurrent?.();
			assertSnapshotCurrent();
		};
		assertCurrent();
		const registeredDatabases = (snapshot?.registeredAgentDatabases ?? []).filter((entry) => entry.schemaVersion === 27);
		const isRetained = createRetainedAgentDatabaseMatcherFromSnapshot(env, () => resolveConfiguredAgentDatabaseTargets(cfg, {
			env,
			registeredDatabases
		}), snapshot);
		const deletedAgents = new Map(snapshot?.deletedAgents.map(({ agentId, status }) => [agentId, status]));
		const targets = await resolveAllAgentSessionStoreTargetsAsync(cfg, {
			env,
			registeredDatabases
		});
		const eligibleTargets = [];
		for (const target of targets) {
			assertCurrent();
			const deletion = deletedAgents.get(target.agentId) ?? "absent";
			const databasePath = deletion !== "absent" ? target.storePath : resolveSqliteTargetFromSessionStorePath(target.storePath, {
				agentId: target.agentId,
				env,
				registeredDatabases
			}).path;
			const retained = deletion === "absent" ? isRetained(databasePath, target.agentId) : void 0;
			if (deletion !== "absent" || typeof retained === "object") {
				stores.push({
					...target,
					skippedReason: deletion === "pending" ? "agent-deletion-pending" : "agent-deletion-complete"
				});
				continue;
			}
			if (retained) {
				const reason = retained === "held" ? "deletion journal reconstruction" : "deletion journal unavailable";
				const warning = `Held agent ${target.agentId} database ${databasePath} (${reason}); skipped session retention. Run "${formatCliCommand("openclaw doctor --fix", env)}" for explicit restoration guidance.`;
				log$1.warn(warning);
				stores.push({
					...target,
					skippedReason: "agent-store-held",
					warning
				});
				continue;
			}
			eligibleTargets.push(target);
		}
		const incompleteInventory = stores.some((store) => "skippedReason" in store && store.skippedReason !== "agent-deletion-pending" && store.skippedReason !== "agent-deletion-complete" && !deletedAgents.has(store.agentId));
		for (const target of incompleteInventory ? [] : eligibleTargets) {
			assertCurrent();
			const result = await runSessionRegistryMaintenanceForStore({
				...target,
				apply: params.apply,
				retentionMs: SESSION_REGISTRY_RETENTION_MS,
				runningCronJobIds: runningCronJobs.ids,
				childStores: eligibleTargets,
				assertCurrent
			});
			assertCurrent();
			stores.push({
				agentId: target.agentId,
				storePath: target.storePath,
				pruned: result.pruned,
				preservedRunning: result.preservedRunning,
				nextSweepAtMs: result.nextSweepAtMs
			});
		}
		const deadlines = stores.flatMap((store) => "nextSweepAtMs" in store ? store.nextSweepAtMs === null ? [] : [store.nextSweepAtMs] : store.skippedReason === "agent-deletion-complete" ? [] : [Date.now() + 6e4]);
		if (incompleteInventory) deadlines.push(Date.now() + 6e4);
		return {
			...incompleteInventory ? { skippedReason: "session child inventory incomplete" } : {},
			nextSweepAtMs: deadlines.length > 0 ? Math.min(...deadlines) : null,
			retentionMs: SESSION_REGISTRY_RETENTION_MS,
			runningCronJobs: runningCronJobs.count,
			pruned: stores.reduce((total, store) => total + ("pruned" in store ? store.pruned : 0), 0),
			skippedStores: stores.filter((store) => "skippedReason" in store).length,
			stores
		};
	});
}
//#endregion
//#region src/cron/maintenance.ts
const log = createSubsystemLogger("cron/maintenance");
let scope;
let scheduledSweep;
let nextHistorySweepAtMs = Infinity;
let nextRegistrySweepAtMs = Infinity;
let unsubscribeSessionChanges;
let unsubscribeHistoryChanges;
let unsubscribeDatabaseLifecycle;
function scheduleSweep(getCronStorePath) {
	if (!scope || scope.signal.aborted || scheduledSweep) return;
	const atMs = Math.min(nextHistorySweepAtMs, nextRegistrySweepAtMs);
	if (!Number.isFinite(atMs)) return;
	const { signal } = scope;
	scope.schedule({
		id: "cron-maintenance",
		atMs,
		run: () => scheduledSweep ??= sweep(signal, getCronStorePath).finally(() => {
			scheduledSweep = void 0;
			scheduleSweep(getCronStorePath);
		})
	});
}
async function sweep(signal, getCronStorePath) {
	let admitted = false;
	try {
		const preparation = getAgentDatabaseStartupAdmission()?.pendingPreparation;
		if (preparation) {
			log.info("Cron maintenance deferred until agent database startup preparation completes");
			await racePromiseWithAbortSignal(preparation, signal);
		}
		await runWithGatewayIndependentRootWorkAdmission(async () => {
			admitted = true;
			const context = captureOpenClawStateWorkerContext();
			const assertCurrent = context.admission.assertCurrent;
			const now = scope?.now() ?? Date.now();
			if (nextHistorySweepAtMs <= now) {
				nextHistorySweepAtMs = Infinity;
				try {
					const result = await maintainCronRunHistory(context, assertCurrent);
					assertCurrent();
					nextHistorySweepAtMs = Math.min(nextHistorySweepAtMs, result.nextSweepAtMs ?? Infinity);
				} catch (error) {
					nextHistorySweepAtMs = Math.min(nextHistorySweepAtMs, now + 6e4);
					throw error;
				}
			}
			if (nextRegistrySweepAtMs <= now) {
				nextRegistrySweepAtMs = Infinity;
				try {
					const result = await runSessionRegistryMaintenance({
						apply: true,
						assertCurrent,
						cronStorePath: getCronStorePath()
					});
					assertCurrent();
					nextRegistrySweepAtMs = Math.min(nextRegistrySweepAtMs, result.nextSweepAtMs ?? Infinity);
					if (result.skippedReason) log.warn("Session registry maintenance skipped", { reason: result.skippedReason });
				} catch (error) {
					nextRegistrySweepAtMs = Math.min(nextRegistrySweepAtMs, now + 6e4);
					throw error;
				}
			}
		}, "cron:maintenance", signal);
	} catch (error) {
		const now = scope?.now() ?? Date.now();
		if (nextHistorySweepAtMs <= now) nextHistorySweepAtMs = now + 6e4;
		if (nextRegistrySweepAtMs <= now) nextRegistrySweepAtMs = now + 6e4;
		if (admitted || !signal.aborted && !isGatewayRestartDrainError(error)) log.warn("Cron maintenance failed", { error });
	}
}
/** Gateway lifecycle owns retention even when scheduled execution is disabled. */
function startCronMaintenance(scheduler, getCronStorePath) {
	if (scope && !scope.signal.aborted) return;
	scope = scheduler.scope();
	nextHistorySweepAtMs = nextRegistrySweepAtMs = scope.now() + 5e3;
	const invalidateHistory = () => {
		if (scope) {
			nextHistorySweepAtMs = Math.min(nextHistorySweepAtMs, scope.now() + 6e4);
			scheduleSweep(getCronStorePath);
		}
	};
	unsubscribeHistoryChanges = subscribeCronRunHistoryChanges((databasePath) => {
		if (normalizeDatabasePath(databasePath) === resolveOpenClawStateSqlitePath()) invalidateHistory();
	});
	unsubscribeDatabaseLifecycle = registerOpenClawStateDatabaseLifecycleListener((event) => {
		if (event.kind !== "opened") invalidateHistory();
	});
	unsubscribeSessionChanges = sessionChanges.subscribeFacts((change) => {
		if (!("all" in change ? change.scope === "config" || sessionChangeScopeAffectsStoredRows(change) : sessionChangeScopeAffectsStoredRows(change) && isCronRunSessionKey(change.sessionKey))) return;
		if (scope) nextRegistrySweepAtMs = Math.min(nextRegistrySweepAtMs, scope.now() + 6e4);
		scheduleSweep(getCronStorePath);
	});
	scheduleSweep(getCronStorePath);
}
async function stopCronMaintenance() {
	unsubscribeSessionChanges?.();
	unsubscribeSessionChanges = void 0;
	unsubscribeHistoryChanges?.();
	unsubscribeHistoryChanges = void 0;
	unsubscribeDatabaseLifecycle?.();
	unsubscribeDatabaseLifecycle = void 0;
	await Promise.all([scope?.stop(), scheduledSweep]);
}
//#endregion
export { startCronMaintenance, stopCronMaintenance };
