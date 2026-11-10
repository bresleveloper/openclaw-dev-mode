import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "../sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { t as SqliteSnapshotCleanupError } from "../sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { t as encodeOpenClawStateWorkerError } from "../openclaw-state-worker-error-B93Lf_P2.mjs";
import { n as createSqliteReadOnlyNativeResourceClient, t as SQLITE_NATIVE_RESOURCE_PORT } from "../sqlite-readonly-native-resource.types-DWL7LzZr.mjs";
import { t as serveOwnedWorkerTasks } from "../worker-task-server-sMsYUF1K.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { MessagePort, workerData } from "node:worker_threads";
//#region src/infra/sqlite-snapshot-staging-runtime.ts
/** Private token connections share one process, never a copy/read worker permit. */
function createSqliteSnapshotStagingRuntime(createSession) {
	let worker;
	let directories = 0;
	let pending = Promise.resolve();
	function run(operation) {
		const result = pending.then(operation);
		pending = result.then(() => void 0, () => void 0);
		return result;
	}
	async function closeSession(current) {
		await current.close();
		worker = void 0;
	}
	async function session(launch) {
		if (worker?.isRetired()) await closeSession(worker);
		worker ??= createSession({
			...launch,
			retainLifetime: false,
			retainOnOperationError: true
		});
		if (!worker.compatible(launch)) throw new Error("SQLite snapshot staging owner launch context changed; retire its snapshots before retrying");
		return worker;
	}
	return {
		close() {
			return run(async () => {
				if (directories !== 0) throw new Error("SQLite snapshot staging owner still has retained directories");
				if (worker) await closeSession(worker);
			});
		},
		async allocate(root, allowLegacyWorker, launch, preparationId) {
			return run(async () => {
				const current = await session(launch);
				let directory;
				try {
					directory = await current.run(root, {
						mode: allowLegacyWorker ? "staging-create-legacy" : "staging-create",
						preparationId
					});
					directories++;
				} catch (error) {
					if (directories === 0) try {
						await closeSession(current);
					} catch (cleanupError) {
						throw createSqliteLifecycleAggregateError([error, cleanupError], "SQLite snapshot allocation and owner cleanup failed", error);
					}
					throw error;
				}
				let retired = false;
				return {
					directory,
					retire: () => run(async () => {
						if (retired) return;
						await current.run(directory, { mode: "staging-retire" });
						retired = true;
						if (--directories === 0) await closeSession(current);
					})
				};
			});
		}
	};
}
//#endregion
//#region src/infra/sqlite-snapshot-staging.worker.ts
const resourcePort = isRecord(workerData) ? workerData[SQLITE_NATIVE_RESOURCE_PORT] : void 0;
if (!(resourcePort instanceof MessagePort)) throw new Error("SQLite snapshot staging requires its native lifetime owner");
const native = createSqliteReadOnlyNativeResourceClient(resourcePort);
const runtime = createSqliteSnapshotStagingRuntime((launch) => native.createSession(launch));
const directories = /* @__PURE__ */ new Map();
async function closeDirectory(directory) {
	const owned = directories.get(directory);
	if (!owned) return;
	if (!owned.removed) {
		await owned.retire();
		await fs.rm(directory, {
			force: true,
			recursive: true,
			maxRetries: 3,
			retryDelay: 20
		});
		owned.removed = true;
	}
	await native.removed(directory);
	directories.delete(directory);
}
async function closeResource(directory) {
	if (directory !== void 0) {
		await closeDirectory(directory);
		return;
	}
	const errors = [];
	for (const pending of directories.keys()) try {
		await closeDirectory(pending);
	} catch (error) {
		errors.push(error);
	}
	if (directories.size === 0) try {
		await runtime.close();
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "SQLite snapshot staging cleanup failed");
}
serveOwnedWorkerTasks(async (value) => {
	const command = value;
	const port = command.type === "prepare" ? command.abortPort : void 0;
	let abort;
	try {
		const controller = new AbortController();
		if (port) {
			abort = () => {
				controller.abort(/* @__PURE__ */ new Error("SQLite snapshot preparation stopped"));
			};
			port.on("message", abort);
		}
		let directory;
		try {
			const owned = await runtime.allocate(path.resolve(command.launch.cwd, command.root), command.allowLegacyWorker, command.launch, command.preparationId);
			directory = owned.directory;
			directories.set(directory, {
				retire: owned.retire,
				removed: false
			});
			if (command.type === "allocate") return {
				type: "allocated",
				directory
			};
			controller.signal.throwIfAborted();
			const location = await native.runOnce(path.resolve(command.launch.cwd, command.pathname), {
				mode: command.preserveSourceArtifacts ? "sync" : "async",
				stagingRoot: directory,
				expectedSourceIdentity: command.expectedSourceIdentity,
				signal: controller.signal
			}, {
				...command.launch,
				deadlineOwnedByCaller: command.deadlineOwnedByCaller
			});
			controller.signal.throwIfAborted();
			return {
				type: "prepared",
				directory,
				location
			};
		} catch (error) {
			let failure = error;
			let cleanupFailure = error instanceof SqliteSnapshotCleanupError;
			if (directory !== void 0) try {
				await closeDirectory(directory);
			} catch (cleanupError) {
				cleanupFailure = true;
				failure = createSqliteLifecycleAggregateError([error, cleanupError], "SQLite snapshot preparation and cleanup failed", error);
			}
			const encoded = encodeOpenClawStateWorkerError(failure, { includeOrdinary: true }) ?? encodeOpenClawStateWorkerError(/* @__PURE__ */ new Error("SQLite snapshot staging failed"), { includeOrdinary: true });
			if (!encoded) throw failure;
			return {
				type: "failed",
				error: encoded,
				...cleanupFailure ? { cleanupFailure: true } : {},
				...directory !== void 0 && directories.has(directory) ? { directory } : {}
			};
		}
	} finally {
		if (abort) port?.off("message", abort);
		port?.close();
	}
}, {
	closeResource,
	encodeResourceError: (error) => encodeOpenClawStateWorkerError(error, { includeOrdinary: true })
});
//#endregion
export {};
