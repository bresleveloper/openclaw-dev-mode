import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { t as readBackupArchiveDirectories } from "./backup-run-records-BXl2ZzeJ.mjs";
import { r as maintainBackupScratch } from "./backup-scratch-CTd0Pvbc.mjs";
import os from "node:os";
//#region src/commands/doctor-backup-scratch.ts
async function noteBackupScratchHealth(env, shouldRepair) {
	const roots = [os.tmpdir()];
	try {
		roots.push(...await readBackupArchiveDirectories(env));
	} catch (error) {
		note(`Cannot discover recorded backup scratch locations: ${formatErrorMessage(error)}`, "Backups");
	}
	const report = await maintainBackupScratch({
		roots,
		repair: shouldRepair
	});
	const lines = [
		...report.unchecked.map((directory) => `Backup scratch awaiting lifecycle check: ${directory}. Run \`openclaw doctor --fix\` to remove it if abandoned.`),
		...report.reclaimed.map((directory) => `Removed abandoned backup scratch: ${directory}`),
		...report.alreadyReclaimed.map((directory) => `Backup scratch already reclaimed: ${directory}`),
		...report.active.map((directory) => `Kept active backup scratch: ${directory}`),
		...report.warnings
	];
	if (lines.length) note(lines.join("\n"), "Backup scratch");
}
//#endregion
export { noteBackupScratchHealth };
