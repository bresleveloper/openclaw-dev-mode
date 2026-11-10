import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { i as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { c as invalidateSessionEntryMaintenanceAgeFact } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { i as runSessionEntryWorkerMutation } from "./session-accessor.sqlite-replacement-worker-BpIicMPG.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-accessor.sqlite-maintenance-worker.ts
function runSessionMaintenanceMetadataInWorker(params) {
	const { plan, claim } = params;
	params.assertCurrent();
	const identity = claim.identity;
	if (typeof identity !== "string") throw new Error("Session maintenance requires its captured file database");
	const preparationId = randomUUID();
	return runSessionEntryWorkerMutation(plan.databaseOptions, identity, params.assertCurrent, async (worker) => {
		const input = plan.kind === "maintenance-plan" ? {
			kind: plan.kind,
			preparationId,
			protection: {
				activeSessionKeys: plan.input.activeSessionKeys,
				preparedAgeFactCurrent: plan.input.preparedAgeFactCurrent,
				preservation: plan.input.preservation
			}
		} : plan;
		const result = await worker.execute({
			type: "session.maintenance.metadata",
			input
		});
		if (params.diagnostics) params.diagnostics.workerThreadId = result.workerThreadId;
		return result;
	}, {
		identityAgentId: plan.databaseOptions.agentId,
		beforeCommit(publication) {
			if (plan.kind === "maintenance-plan") params.assertMaintenanceCommitAllowed?.(publication.maintenancePlans);
		},
		onResult(result) {
			const openDatabase = getOpenClawAgentDatabaseIfOpen(plan.databaseOptions);
			const database = openDatabase && findOpenClawAgentDatabaseIdentity(openDatabase)?.identity === identity ? openDatabase : void 0;
			if (!result) {
				if (database) invalidateSessionEntryMaintenanceAgeFact(database.db);
				return;
			}
			params.onWorkerResult?.(result, identity);
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
	});
}
//#endregion
export { runSessionMaintenanceMetadataInWorker };
