import { r as runWithSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { r as getChildLogger } from "./logger-Mnn26Jj7.mjs";
import { g as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { a as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-DBug3LUA.mjs";
import { D as invalidateSessionEntryMaintenanceAgeFact } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { n as logSqliteReclamationWorkerOutcome } from "./session-accessor.sqlite-reclamation-worker-diagnostics-hJYsjFvr.mjs";
import { i as runSessionEntryWorkerMutation } from "./session-accessor.sqlite-replacement-worker-9fiwLkM3.mjs";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/config/sessions/session-accessor.sqlite-maintenance-worker.ts
function runSessionMaintenanceMetadataInWorker(params) {
	const { plan, claim } = params;
	params.assertCurrent();
	const identity = claim.identity;
	if (typeof identity !== "string") throw new Error("Session maintenance requires its captured file database");
	const preparationId = randomUUID();
	const startedAt = performance.now();
	let workerThreadId;
	const observeCompletion = (outcome, failure) => logSqliteReclamationWorkerOutcome({
		startedAt,
		kind: plan.kind,
		workerThreadId,
		outcome,
		failure
	});
	return runSessionEntryWorkerMutation(plan.databaseOptions, identity, params.assertCurrent, async (worker) => {
		const input = plan.kind === "maintenance-plan" ? {
			kind: plan.kind,
			preparationId,
			protection: {
				activeSessionKeys: plan.input.activeSessionKeys,
				preservation: plan.input.preservation
			}
		} : plan;
		const result = await worker.execute({
			type: "session.maintenance.metadata",
			input
		});
		workerThreadId = result.workerThreadId;
		if (params.diagnostics) params.diagnostics.workerThreadId = result.workerThreadId;
		return result;
	}, {
		identityAgentId: plan.databaseOptions.agentId,
		onResult(result) {
			const openDatabase = getOpenClawAgentDatabaseIfOpen(plan.databaseOptions);
			const database = openDatabase && findOpenClawAgentDatabaseIdentity(openDatabase)?.identity === identity ? openDatabase : void 0;
			if (!result) {
				if (database) invalidateSessionEntryMaintenanceAgeFact(database.db);
				return;
			}
			params.onWorkerResult?.(result, identity);
			if (result.kind === "maintenance-statistics" && database) try {
				params.assertCurrent();
				runWithSqliteBusyTimeout(database.db, 0, () => {
					database.db.exec("ANALYZE sqlite_schema;");
				});
			} catch (error) {
				try {
					getChildLogger({ subsystem: "session-sqlite" }).warn("Committed SQLite session statistics could not refresh parent planner metadata", {
						agentId: database.agentId,
						error,
						path: database.path
					});
				} catch {}
			}
		}
	}, {
		signal: params.signal,
		prepare: plan.kind === "maintenance-plan" ? (execution, source) => {
			let attempted = false;
			const cleanupSource = {
				assertCurrent: () => execution.assertCurrent(),
				createAdmission(binding) {
					return () => ({
						nativeLocations: binding.nativeLocations,
						admission: createSqliteWorkerOperationAdmission((request, grant) => {
							if (request.stage !== "prepare") throw new Error("Maintenance preparation cleanup cannot open or write storage");
							binding.authorize(request);
							if (!grant()) throw new Error("Maintenance preparation cleanup authority expired");
						}, binding.attachment)
					});
				}
			};
			return {
				beforeWrite() {
					Object.assign(plan.input, params.refreshMaintenanceProtection?.());
					params.assertCurrent();
				},
				async prepare() {
					attempted = true;
					if (!await execution.runExisting(source, async (worker) => {
						await worker.execute({
							type: "session.maintenance.prepare",
							input: {
								id: preparationId,
								input: plan.input,
								ageOwner: plan.ageOwner,
								ageChanges: plan.ageChanges
							}
						}, { signal: params.signal });
						return true;
					})) throw new Error("Session database disappeared during maintenance preparation");
				},
				async release() {
					if (!attempted) return;
					await execution.runExisting(cleanupSource, (worker) => worker.execute({
						type: "session.maintenance.release",
						input: { id: preparationId }
					}), { retireNativeOnFailure: true });
				}
			};
		} : void 0
	}).then((result) => {
		observeCompletion("resolved");
		return result;
	}, (error) => {
		observeCompletion("rejected", error);
		throw error;
	});
}
//#endregion
export { runSessionMaintenanceMetadataInWorker };
