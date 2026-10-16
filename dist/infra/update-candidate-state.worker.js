import { a as discoverUpdateStateSchemaInspectionInProcess, d as snapshotUpdateCandidateState, l as readUpdateStateSchemaVersionsInProcess, o as readUpdateCandidateStateInventoryInProcess, v as createUpdateStateInspectionReporter, y as formatUpdateStateInspectionError } from "../update-candidate-state-CO0vwfHU.mjs";
//#region src/infra/update-candidate-state.worker.ts
async function snapshotCandidateState() {
	const chunks = [];
	for await (const chunk of process.stdin) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
	switch (input.mode) {
		case "database-restore-preparation": {
			const { prepareUpdateDatabaseRestoreSourceInProcess } = await import("../update-database-restore-source-CcY6kqH-.mjs");
			return prepareUpdateDatabaseRestoreSourceInProcess(input);
		}
		case "database-generations": {
			const { readUpdateDatabaseGenerations } = await import("../update-database-generations-Dgu9M_BW.mjs");
			return readUpdateDatabaseGenerations(input.paths);
		}
		case "inventory": {
			const { databases, ...inventory } = await readUpdateCandidateStateInventoryInProcess({
				...input,
				onProgress: createUpdateStateInspectionReporter(!input.streamProgress)
			});
			return {
				...inventory,
				databases: [...databases]
			};
		}
		case "database-backup": {
			const { createUpdateDatabaseBackupInProcess } = await import("../update-database-backup-PdXaL6iD.mjs");
			return createUpdateDatabaseBackupInProcess({
				...input,
				onProgress: createUpdateStateInspectionReporter()
			});
		}
		case "snapshot": return snapshotUpdateCandidateState({
			...input,
			onProgress: createUpdateStateInspectionReporter(!input.streamProgress)
		});
		case "discover": return discoverUpdateStateSchemaInspectionInProcess({
			...input,
			onProgress: createUpdateStateInspectionReporter()
		});
		case "versions": return readUpdateStateSchemaVersionsInProcess({
			...input,
			onProgress: createUpdateStateInspectionReporter(!input.inspectionPlan)
		});
		default: throw new Error("Unknown update state inspection mode");
	}
}
snapshotCandidateState().then((value) => process.stdout.write(JSON.stringify(value))).catch((error) => {
	process.stderr.write(formatUpdateStateInspectionError(error));
	process.exitCode = 1;
});
//#endregion
export {};
