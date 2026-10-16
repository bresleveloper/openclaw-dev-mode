import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { n as resolveCronJobsStorePathFromConfig } from "./paths-C7ju4So0.mjs";
import { n as loadCronJobsStoreWithConfigJobsReadOnly } from "./read-only-BnZqzQN0.mjs";
import { a as summarizeBackupFreshness, o as summarizeBackupTargets, r as readBackupRuns } from "./backup-run-records-BXl2ZzeJ.mjs";
import { i as summarizeBackupSchedules } from "./backup-command-DM-EcqY5.mjs";
//#region src/commands/backup-health.ts
const BACKUP_STALE_AFTER_MS = 12096e5;
/** Format the compact status overview value for the latest backup attempt. */
function buildBackupStatusValue(params) {
	const latest = params.freshness.latest;
	if (!latest) return "none recorded";
	const age = params.formatTimeAgo(Math.max(0, (params.now ?? Date.now()) - latest.createdAt));
	return latest.status === "ok" ? `last ok ${age} (${latest.kind}${latest.pushFailed ? ", push failing" : ""})` : `last attempt failed ${age} (${latest.kind})`;
}
/** Build the informational Doctor hint for missing or stale successful backups. */
function buildBackupDoctorHint(params) {
	const latestOk = params.freshness.latestOk;
	if (latestOk?.pushFailed) return ["The newest local Git backup succeeded, but its requested push failed.", `Check the configured Git remote for ${latestOk.archivePath}, then retry the backup.`].join("\n");
	if (!(!latestOk || (params.now ?? Date.now()) - latestOk.createdAt > BACKUP_STALE_AFTER_MS)) return null;
	return [
		latestOk ? "The newest successful backup is more than 14 days old." : "No successful backup is recorded.",
		`Create one now with ${formatCliCommand("openclaw backup create")}.`,
		`Schedule versioned backups with ${formatCliCommand("openclaw backup enable --repository <dir>")}.`
	].join("\n");
}
/** Report each scheduled destination independently of other successful backups. */
function buildOffsiteBackupDoctorHints(params) {
	const targets = summarizeBackupTargets(params.runs);
	const now = params.now ?? Date.now();
	return params.schedules.flatMap((schedule) => {
		if (schedule.mode !== "offsite" || !schedule.enabled) return [];
		const target = targets.find((entry) => entry.kind === "archive" && entry.target === schedule.target && entry.namespace === schedule.namespace);
		const failed = target?.latest.status === "failed";
		const stale = !target?.latestOk || now - target.latestOk.createdAt > 3 * schedule.everyMs;
		if (!failed && !stale) return [];
		return [`${failed ? `The newest offsite backup attempt to ${schedule.target} failed${target.latest.error ? `: ${target.latest.error}` : "."}` : target?.latestOk ? `The newest successful offsite backup to ${schedule.target} is older than three scheduled intervals.` : `No successful offsite backup to ${schedule.target} is recorded.`}\nCheck the destination with ${formatCliCommand(`openclaw storage test ${schedule.target}`)}.`];
	});
}
/** Emit non-repairing freshness hints; configuration and ledger reads never probe destinations. */
async function noteBackupDoctorHint(env, cfg) {
	const runs = await readBackupRuns(env);
	const hint = buildBackupDoctorHint({ freshness: summarizeBackupFreshness(runs) });
	const hints = hint ? [hint] : [];
	if (cfg) {
		const loaded = await loadCronJobsStoreWithConfigJobsReadOnly(resolveCronJobsStorePathFromConfig(cfg, env), env);
		hints.push(...buildOffsiteBackupDoctorHints({
			runs,
			schedules: summarizeBackupSchedules(loaded.store.jobs)
		}));
	}
	if (hints.length) note(hints.join("\n\n"), "Backups");
}
//#endregion
export { noteBackupDoctorHint as n, buildBackupStatusValue as t };
