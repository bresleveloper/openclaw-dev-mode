import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { r as resolveLegacyAgentRosterOwner } from "./legacy.roster-D0lEOcPT.mjs";
import { n as resolveCronJobsStorePathFromConfig } from "./paths-C7ju4So0.mjs";
import { r as tryResolveCronJobEffectiveAgentId } from "./agent-id-uYw1RFJQ.mjs";
import { t as createCronOwnerWriteRefusalError } from "./io.cron-owner-refusal-Cje_ZhR1.mjs";
import { r as loadLegacyCronRepairState } from "./legacy-repair-COrJZ9ct.mjs";
import { a as repairLegacyCronJobOwnersForDoctor } from "./store-repair--ssNPU7z.mjs";
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
	const hasExplicitOwner = (job) => tryResolveCronJobEffectiveAgentId({
		agentId: normalizeOptionalString(job?.agentId),
		sessionKey: normalizeOptionalString(job?.sessionKey)
	});
	if (!(state?.rawJobs.some((job) => !hasExplicitOwner(job)) || state?.ownerRows.some((row) => !hasExplicitOwner(safeParseJsonRecord(row.job_json))))) return [];
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
