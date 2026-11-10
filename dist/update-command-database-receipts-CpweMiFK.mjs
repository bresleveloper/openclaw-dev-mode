import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
//#region src/cli/update-cli/update-command-database-receipts.ts
function recordUpdateDatabaseWrites(backup, writes, step) {
	const paths = Object.keys(backup.sourceGenerations).toSorted();
	const receipt = {
		name: "database migration writes",
		command: "record Doctor database write fingerprints",
		cwd: backup.directory,
		durationMs: 0,
		exitCode: 0
	};
	if (!writes || JSON.stringify(Object.keys(writes.generations).toSorted()) !== JSON.stringify(paths)) receipt.warnings = ["Doctor did not provide complete database write-generation evidence; rollback requires the last verified generation to remain unchanged."];
	else {
		const expected = backup.migration?.to ?? backup.sourceGenerations;
		const from = writes.fromGenerations ?? expected;
		const fingerprint = sha256Hex(JSON.stringify(paths.map((file) => [file, writes.generations[file]])));
		receipt.diagnostics = [
			`Doctor interval ${step.name}; backup ${backup.directory}; from SHA-256 ${sha256Hex(JSON.stringify(paths.map((file) => [file, from[file]])))} to SHA-256 ${fingerprint}.`,
			`Post-migration write inventory: ${paths.length} databases; SHA-256 ${fingerprint}. Snapshots: ${backup.directory}.`,
			...paths.map((file) => `Database write fingerprint: ${file}; ${writes.generations[file] ?? "absent"}`)
		];
		if (!writes.unchanged || paths.some((file) => from[file] !== expected[file])) backup.restoreRefusal ??= "databases changed after snapshot capture; the writer is unknown";
		else if (!backup.restoreRefusal) backup.migration = {
			name: step.name,
			backup: backup.directory,
			from,
			to: writes.generations
		};
	}
	if (backup.restoreRefusal) receipt.warnings = [`Automatic database restoration unavailable: ${backup.restoreRefusal}. Snapshots retained at ${backup.directory}.`, ...receipt.warnings ?? []];
	return receipt;
}
//#endregion
export { recordUpdateDatabaseWrites as t };
