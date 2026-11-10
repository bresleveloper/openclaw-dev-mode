import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { a as rewriteModelRefs } from "./legacy-config-migrations.runtime.models.refs-Ceq33O_-.mjs";
import { r as rewriteProviderModelRef } from "./provider-rename-CzX16E87.mjs";
import { a as repairCronJobsForDoctor, r as inspectCronJobsForDoctor } from "./store-repair-CESfdSN7.mjs";
//#region src/commands/doctor/shared/provider-rename-state.ts
/** Repair persisted definitions across every cron partition, not just the configured store. */
async function maybeRepairProviderRenameCronJobs(params) {
	if (params.renames.length === 0) return {
		changes: [],
		warnings: []
	};
	const env = params.env ?? process.env;
	try {
		const inventory = await inspectCronJobsForDoctor({ env });
		const renames = params.renames;
		const requested = [];
		const referenceChanges = [];
		for (const job of inventory.jobs) {
			if (!job.definition) continue;
			const payload = rewriteModelRefs(job.definition.payload, `cron.${JSON.stringify([job.storeKey, job.id])}.payload`, referenceChanges, (ref) => rewriteProviderModelRef(ref, renames) ?? null);
			if (payload.changed) requested.push({
				job,
				definition: {
					...job.definition,
					payload: payload.value
				}
			});
		}
		if (requested.length === 0) return {
			changes: [],
			warnings: []
		};
		if (!params.shouldRepair) return {
			changes: [],
			warnings: [`Provider renames affect ${requested.length} persisted cron job(s). Run "openclaw doctor --fix" to repair their model references.`, ...referenceChanges.map((change) => change.replace(/^Upgraded /, "Would upgrade "))]
		};
		const maintenance = getOpenClawDatabaseMaintenanceScope();
		if (!maintenance?.ownsSchemaMaintenance) throw new Error("Cron provider rename requires Doctor maintenance. Run \"openclaw doctor --fix\".");
		const assertCurrent = () => {
			maintenance.assertDatabaseAccess(resolveOpenClawStateSqlitePath(env));
		};
		const result = await repairCronJobsForDoctor({ env }, {
			assertCurrent,
			assertOwnedInTransaction: assertCurrent
		}, inventory, requested);
		return {
			changes: result.changed > 0 ? [
				`Renamed provider model references in ${result.changed} persisted cron job(s).`,
				...referenceChanges,
				`Saved pre-repair cron backup: ${result.backupPath}`
			] : [],
			warnings: []
		};
	} catch (error) {
		return {
			changes: [],
			warnings: [`Failed repairing cron provider model references: ${formatErrorMessage(error)}`]
		};
	}
}
//#endregion
export { maybeRepairProviderRenameCronJobs };
