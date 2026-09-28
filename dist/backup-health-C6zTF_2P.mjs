import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { n as readBackupRunFreshness } from "./backup-run-records-CBOO28UK.mjs";
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
/** Emit the non-repairing backup freshness hint when it applies. */
async function noteBackupDoctorHint(env) {
	const hint = buildBackupDoctorHint({ freshness: await readBackupRunFreshness(env) });
	if (hint) note(hint, "Backups");
}
//#endregion
export { noteBackupDoctorHint as n, buildBackupStatusValue as t };
