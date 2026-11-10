import { On as throwSqliteLifecycleErrors } from "./sqlite-readonly-sqlite-busy-timeout-CPLgQzS6.mjs";
import { A as resolveRuntimeProcessEntrypointUrl, l as prepareSqliteReadOnlyCopyInProcess, vn as SqliteSnapshotCleanupError } from "./sqlite-readonly-location.worker.js";
import { r as createStateReadPool, t as requestBytes } from "./sqlite-readonly-openclaw-state-read-request-Bx6fxAMd.mjs";
//#region src/state/openclaw-state-read-snapshot.ts
/** The native snapshot child owns copies; its SQL worker owns admission and queries. */
async function readStateSnapshot(input, context) {
	const pool = createStateReadPool(resolveRuntimeProcessEntrypointUrl("stateRead"));
	let prepared;
	const run = async (request) => {
		const task = pool.runTask(request, {
			inputBytes: requestBytes(request),
			diagnosticOperation: request.command.type
		});
		const [outcome] = await Promise.allSettled([task.result]);
		const errors = outcome.status === "rejected" ? [outcome.reason] : [];
		try {
			await task.close(request.command.type !== "admit" || outcome.status === "rejected" || !outcome.value.ok || Boolean(outcome.value.nativeCleanupFailure) ? { retire: true } : void 0);
		} catch (error) {
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, "Shared-state snapshot task and cleanup failed");
		if (outcome.status === "rejected") throw outcome.reason;
		return outcome.value;
	};
	const read = async () => {
		const request = {
			context: input.context,
			databasePath: context.path,
			location: context.path,
			checkFreshAdmission: true,
			command: { type: "admit" }
		};
		const admitted = await run(request);
		if (!admitted.ok) return admitted;
		prepared = await prepareSqliteReadOnlyCopyInProcess(context.path, input.stagingRoot, input.expectedSourceIdentity);
		return run({
			...request,
			location: prepared.location,
			snapshotRoot: prepared.cleanupRoot,
			command: input.command
		});
	};
	const [outcome] = await Promise.allSettled([read()]);
	const errors = outcome.status === "rejected" ? [outcome.reason] : [];
	let readersClosed = false;
	try {
		await pool.close();
		readersClosed = true;
	} catch (error) {
		errors.push(error);
	}
	if (prepared && readersClosed) try {
		if (!await prepared.cleanupAsync()) throw new SqliteSnapshotCleanupError("Shared-state snapshot cleanup failed");
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Shared-state snapshot read and cleanup failed");
	if (outcome.status === "rejected") throw outcome.reason;
	return outcome.value;
}
const stateSnapshotReadOperations = { "stateSnapshot.read": readStateSnapshot };
//#endregion
export { stateSnapshotReadOperations };
