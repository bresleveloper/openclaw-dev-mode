import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { n as createScopedSqliteReadOnlyWorker, p as isSameSqliteReadOnlyWorkerLaunch, t as captureSqliteReadOnlyWorkerLaunch } from "./sqlite-readonly-worker-CmkAsqCm.mjs";
//#region src/infra/sqlite-snapshot-staging-owner.ts
/** Private token connections share one process, never a copy/read worker permit. */
function createStagingOwner() {
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
		worker ??= createScopedSqliteReadOnlyWorker({
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
	return { async allocate(root, allowLegacyWorker, signal) {
		signal?.throwIfAborted();
		const launch = captureSqliteReadOnlyWorkerLaunch();
		return run(async () => {
			signal?.throwIfAborted();
			const current = await session(launch);
			let directory;
			try {
				signal?.throwIfAborted();
				const result = await current.run(root, { mode: allowLegacyWorker ? "staging-create-legacy" : "staging-create" });
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
	} };
}
function allocateWorkerOwnedSqliteSnapshotDirectory(root, allowLegacyWorker, signal) {
	return resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotStagingOwner"), createStagingOwner).allocate(root, allowLegacyWorker, signal);
}
//#endregion
export { allocateWorkerOwnedSqliteSnapshotDirectory };
