//#region src/cron/backup-command.ts
const SCHEDULED_BACKUP_DECLARATION_KEY = "openclaw-backup-scheduled";
const SCHEDULED_BACKUP_COMMAND = [
	"openclaw",
	"backup",
	"git",
	"create"
];
/** Identifies the command contract emitted by backup enable, not its display label. */
function isScheduledBackupCommand(job) {
	const payload = job.payload;
	return job.declarationKey === "openclaw-backup-scheduled" && payload.kind === "command" && SCHEDULED_BACKUP_COMMAND.every((part, index) => payload.argv[index] === part);
}
//#endregion
export { SCHEDULED_BACKUP_DECLARATION_KEY as n, isScheduledBackupCommand as r, SCHEDULED_BACKUP_COMMAND as t };
