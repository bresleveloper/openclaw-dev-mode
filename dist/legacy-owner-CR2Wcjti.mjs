import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { r as resolveLegacyAgentRosterOwner } from "./legacy.roster-BkkM_O4n.mjs";
import { r as resolveCronJobsStorePathFromConfig } from "./paths-C7jZRDkL.mjs";
import { t as createCronOwnerWriteRefusalError } from "./io.cron-owner-refusal-DQsCD4nO.mjs";
import { r as loadLegacyCronRepairState } from "./legacy-repair-nZFYDmBL.mjs";
import { o as repairLegacyCronJobOwnersForDoctor, s as resolveStoredCronJobOwner } from "./store-repair-CESfdSN7.mjs";
//#region src/commands/doctor/cron/legacy-owner.ts
/** Runs under Doctor's config lock before retiring the source roster's owner marker. */
async function repairLegacyCronOwnersBeforeConfigWrite(params) {
	const env = params.env ?? process.env;
	const source = params.snapshot.sourceConfigBeforeMigrations ?? params.snapshot.sourceConfig;
	const legacyOwner = [params.snapshot.sourceConfigBeforeMigrations, params.snapshot.parsed].map(resolveLegacyAgentRosterOwner).find((owner) => owner !== void 0);
	if (!legacyOwner) return [];
	params.assertCurrent?.();
	const storePath = resolveCronJobsStorePathFromConfig(source, env);
	const state = await loadLegacyCronRepairState({
		cfg: params.snapshot.config,
		storePath,
		env,
		readOnly: true
	});
	params.assertCurrent?.();
	if (!(state?.rawJobs.some((job) => !resolveStoredCronJobOwner(job)) || state?.ownerRows.some((row) => !resolveStoredCronJobOwner(safeParseJsonRecord(row.job_json))))) return [];
	if (!listAgentEntries(params.nextConfig).some((entry) => normalizeAgentId(entry.id) === normalizeAgentId(legacyOwner))) throw createCronOwnerWriteRefusalError(`Doctor cannot retire legacy cron owner ${legacyOwner} while its jobs are unassigned. Preserve that agent and rerun "openclaw doctor --fix" first.`);
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	if (!maintenance?.ownsSchemaMaintenance) throw createCronOwnerWriteRefusalError("Cron ownership repair requires Doctor maintenance. Run \"openclaw doctor --fix\" before retrying the config write.");
	const assertCurrent = () => {
		params.assertCurrent?.();
		maintenance.assertDatabaseAccess(resolveOpenClawStateSqlitePath(env));
	};
	const result = await repairLegacyCronJobOwnersForDoctor({ env }, {
		assertCurrent,
		assertOwnedInTransaction: assertCurrent
	}, storePath, legacyOwner);
	assertCurrent();
	return result.changed > 0 ? [`Preserved ownership for ${result.changed} legacy cron job(s); unassigned jobs retain ${legacyOwner}.`, `Saved pre-repair cron backup: ${result.backupPath}`] : [];
}
//#endregion
export { repairLegacyCronOwnersBeforeConfigWrite };
