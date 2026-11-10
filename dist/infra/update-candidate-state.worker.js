import { parentPort } from "node:worker_threads";
//#region src/infra/update-candidate-state.worker.ts
async function snapshotCandidateState() {
	const chunks = [];
	for await (const chunk of process.stdin) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
	if ("stateDir" in input) input.env = {
		...input.env,
		OPENCLAW_STATE_DIR: input.stateDir
	};
	const { createUpdateStateInspectionReporter } = await import("../update-candidate-state.diagnostics-B2p5HLry.mjs");
	const { discoverUpdateStateSchemaInspectionInProcess, readUpdateCandidateStateInventoryInProcess, readUpdateStateSchemaVersionsInProcess, snapshotUpdateCandidateState } = await import("../update-candidate-state-CV7O5yg_.mjs");
	switch (input.mode) {
		case "database-restore-preparation": {
			const { prepareUpdateDatabaseRestoreSourceInProcess } = await import("../update-database-restore-source-BjWCEOMb.mjs");
			return prepareUpdateDatabaseRestoreSourceInProcess(input);
		}
		case "database-generations": {
			const { readUpdatePhysicalDatabaseGenerations } = await import("../update-physical-database-generations-DvvZmsM_.mjs");
			return readUpdatePhysicalDatabaseGenerations(input.paths);
		}
		case "inventory": {
			const { databases, ...inventory } = await readUpdateCandidateStateInventoryInProcess({
				...input,
				onProgress: createUpdateStateInspectionReporter(!input.streamProgress, input.streamEntryProgress)
			});
			return {
				...inventory,
				databases: [...databases]
			};
		}
		case "database-backup": {
			const { createUpdateDatabaseBackupInProcess } = await import("../update-database-backup-Db4CAhj5.mjs");
			return createUpdateDatabaseBackupInProcess({
				...input,
				onProgress: createUpdateStateInspectionReporter()
			});
		}
		case "snapshot": return snapshotUpdateCandidateState({
			...input,
			onProgress: createUpdateStateInspectionReporter(!input.streamProgress, input.streamEntryProgress)
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
if (parentPort) {
	const { assertDirectoryIdentitySync } = await import("@openclaw/fs-safe/advanced");
	const { root } = await import("../fs-safe-MZ5T9fjO.mjs");
	const { copyUpdateCandidatePluginFile } = await import("../update-candidate-plugin-file-CnWkDA-i.mjs");
	const { hashFileMutationSnapshotSync } = await import("../file-descriptor-Dn0S3SAe.mjs");
	const { serveWorkerTasks } = await import("../worker-task-server-BxttNAkS.mjs");
	let destination;
	serveWorkerTasks(async (input, _channel, control) => control.runNativeSection(async () => {
		const request = input;
		try {
			if ("type" in request) return {
				type: "hashed",
				sha256: hashFileMutationSnapshotSync(request.filePath, request.expected)
			};
			assertDirectoryIdentitySync(request.privateRoot, request.rootIdentity);
			if (destination?.path !== request.privateRoot) destination = {
				path: request.privateRoot,
				root: await root(request.privateRoot)
			};
			assertDirectoryIdentitySync(request.privateRoot, request.rootIdentity);
			await copyUpdateCandidatePluginFile(request, destination.root);
			return { type: "copied" };
		} catch (error) {
			return {
				type: "failed",
				error: error instanceof Error ? error : new Error(String(error)),
				...error instanceof Error && "code" in error && typeof error.code === "string" ? { code: error.code } : {},
				...error instanceof Error && "details" in error ? { details: error.details } : {}
			};
		}
	}));
} else {
	const { routeLogsToStderr } = await import("../console-UDkTq6wd.mjs");
	routeLogsToStderr();
	const { formatUpdateStateInspectionError } = await import("../update-candidate-state.diagnostics-B2p5HLry.mjs");
	snapshotCandidateState().then((value) => process.stdout.write(JSON.stringify(value))).catch((error) => {
		process.stderr.write(formatUpdateStateInspectionError(error));
		process.exitCode = 1;
	});
}
//#endregion
export {};
