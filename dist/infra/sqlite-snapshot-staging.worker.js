import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { s as readDatabaseFileIdentity } from "../sqlite-worker-identity-KSR14F6C.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "../sqlite-lifecycle-errors-DuOygjcn.mjs";
import { t as SqliteSnapshotCleanupError } from "../sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { n as isSameSqliteReadOnlyWorkerLaunch } from "../sqlite-readonly-worker-session-DK-j16po.mjs";
import { t as encodeOpenClawStateWorkerError } from "../openclaw-state-worker-error-Cmtk9G4_.mjs";
import { n as createSqliteReadOnlyNativeResourceClient, t as SQLITE_NATIVE_RESOURCE_PORT } from "../sqlite-readonly-native-resource.types-Dze2GxGD.mjs";
import { t as serveOwnedWorkerTasks } from "../worker-task-server-BC_7U18u.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { MessagePort, workerData } from "node:worker_threads";
//#region src/infra/sqlite-snapshot-staging-runtime.ts
/** Private token connections share one process, never a copy/read worker permit. */
function createSqliteSnapshotStagingRuntime(createSession) {
	let worker;
	let directories = 0;
	let activeLaunch;
	let closing;
	let pending = Promise.resolve();
	function run(operation) {
		const result = pending.then(operation);
		pending = result.then(() => void 0, () => void 0);
		return result;
	}
	async function closeSession(current) {
		closing = current;
		await current.close();
		if (worker === current) worker = void 0;
		if (directories === 0) activeLaunch = void 0;
		closing = void 0;
	}
	async function session(launch) {
		if (closing) await closeSession(closing);
		if (activeLaunch && !isSameSqliteReadOnlyWorkerLaunch(activeLaunch, launch)) throw new Error("SQLite snapshot staging owner launch context changed; retire its snapshots before retrying");
		if (worker?.isRetired()) await closeSession(worker);
		worker ??= createSession({
			...launch,
			retainLifetime: false,
			retainOnOperationError: true
		});
		if (!worker.compatible(launch)) throw new Error("SQLite snapshot staging owner launch context changed; retire its snapshots before retrying");
		return worker;
	}
	async function retireToken(current, directory, launch) {
		let failure;
		if (!current.isRetired()) try {
			await current.run(directory, { mode: "staging-retire" });
			return current;
		} catch (error) {
			if (!current.isRetired()) throw error;
			failure = error;
		}
		try {
			await closeSession(current);
			const replacement = await session(launch);
			await replacement.run(directory, { mode: "staging-reconcile" });
			return replacement;
		} catch (error) {
			if (failure !== void 0) throw createSqliteLifecycleAggregateError([failure, error], "SQLite snapshot retirement and reconciliation failed", failure);
			throw error;
		}
	}
	return {
		close() {
			return run(async () => {
				if (directories !== 0) throw new Error("SQLite snapshot staging owner still has retained directories");
				if (closing) await closeSession(closing);
				if (worker) await closeSession(worker);
			});
		},
		async allocate(root, allowLegacyWorker, launch, preparationId) {
			return run(async () => {
				const current = await session(launch);
				let directory;
				try {
					const result = await current.run(root, {
						mode: allowLegacyWorker ? "staging-create-legacy" : "staging-create",
						preparationId
					});
					if (typeof result !== "string") throw new Error("SQLite snapshot staging owner returned an invalid directory");
					directory = result;
					activeLaunch ??= launch;
					directories++;
				} catch (error) {
					if (directories === 0) try {
						await closeSession(current);
					} catch (cleanupError) {
						throw createSqliteLifecycleAggregateError([error, cleanupError], "SQLite snapshot allocation and owner cleanup failed", error);
					}
					throw error;
				}
				let tokenRetired = false;
				let lastDirectory = false;
				let complete = false;
				let retirementSession = current;
				return {
					directory,
					retire: () => run(async () => {
						if (complete) return;
						if (!tokenRetired) {
							retirementSession = await retireToken(current, directory, launch);
							tokenRetired = true;
							lastDirectory = --directories === 0;
						}
						if (lastDirectory) await closeSession(retirementSession);
						complete = true;
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
function readPath(value) {
	if (typeof value !== "string" || value.length === 0 || value.includes("\0")) throw new Error("SQLite snapshot staging requires a nonempty filesystem path");
	return value;
}
function readLaunch(value) {
	if (!isRecord(value) || !isRecord(value.env) || !isRecord(value.transport) || value.transport.kind !== "native") throw new Error("SQLite snapshot staging requires its captured native launch");
	const entries = [];
	for (const [key, item] of Object.entries(value.env)) {
		if (key.length === 0 || key.includes("=") || key.includes("\0") || item !== void 0 && (typeof item !== "string" || item.includes("\0"))) throw new Error("SQLite snapshot staging received an invalid launch environment");
		entries.push([key, item]);
	}
	return {
		env: Object.fromEntries(entries),
		cwd: readPath(value.cwd),
		transport: { kind: "native" }
	};
}
function readCommand(value) {
	if (!isRecord(value) || typeof value.allowLegacyWorker !== "boolean" || typeof value.preparationId !== "number" || !Number.isSafeInteger(value.preparationId) || value.preparationId < 1) throw new Error("SQLite snapshot staging requires an allocation command");
	const launch = readLaunch(value.launch);
	const allocation = {
		preparationId: value.preparationId,
		root: path.resolve(launch.cwd, readPath(value.root)),
		allowLegacyWorker: value.allowLegacyWorker,
		launch
	};
	if (value.type === "allocate" && value.abortPort === void 0) return {
		type: "allocate",
		...allocation
	};
	if (value.type !== "prepare" || typeof value.preserveSourceArtifacts !== "boolean" || typeof value.deadlineOwnedByCaller !== "boolean" || value.abortPort !== void 0 && !(value.abortPort instanceof MessagePort)) throw new Error("SQLite snapshot staging requires a valid preparation command");
	const expectedSourceIdentity = value.expectedSourceIdentity === void 0 ? void 0 : readDatabaseFileIdentity(value.expectedSourceIdentity);
	if (expectedSourceIdentity && !value.preserveSourceArtifacts) throw new Error("SQLite source identity requires artifact-preserving preparation");
	return {
		type: "prepare",
		...allocation,
		pathname: path.resolve(launch.cwd, readPath(value.pathname)),
		preserveSourceArtifacts: value.preserveSourceArtifacts,
		expectedSourceIdentity,
		deadlineOwnedByCaller: value.deadlineOwnedByCaller,
		abortPort: value.abortPort
	};
}
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
	const port = isRecord(value) && value.abortPort instanceof MessagePort ? value.abortPort : void 0;
	let abort;
	try {
		const command = readCommand(value);
		const controller = new AbortController();
		if (command.type === "prepare" && port) {
			abort = (message) => {
				if (isRecord(message) && message.type === "abort") controller.abort(/* @__PURE__ */ new Error("SQLite snapshot preparation stopped"));
			};
			port.on("message", abort);
		}
		let directory;
		try {
			const owned = await runtime.allocate(command.root, command.allowLegacyWorker, command.launch, command.preparationId);
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
			const location = await native.runOnce(command.pathname, {
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
