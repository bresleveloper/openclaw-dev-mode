import { r as createLazyRuntimeModule } from "../lazy-runtime-BPNHa36e.mjs";
import { t as assertNoActiveSqliteReaders } from "../sqlite-reader-lifecycle-BmcnELSc.mjs";
import { t as assertTransactionUsable } from "../sqlite-transaction-DKSXLQhb.mjs";
import { b as retainOpenClawStateDatabase, p as openClawStateDatabaseCache } from "../openclaw-state-db-cache-Ci98mtX8.mjs";
import { D as assertOpenClawStateDatabaseOwner } from "../openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { n as readPluginMetadataStateRowSync } from "../installed-plugin-index-row-DAPhfvfQ.mjs";
import { r as openOpenClawStateDatabase } from "../openclaw-state-db-BFK9cMiV.mjs";
import { r as SQLITE_WORKER_PREPARE_COMMAND } from "../sqlite-worker-contract-DgNznZvn.mjs";
import { i as loadOrCreateDeviceIdentity, r as loadDeviceIdentityIfPresent } from "../device-identity-B_zMrBd6.mjs";
import { t as getSqliteWorkerStateContext } from "../sqlite-worker-state-context-C9ABaq_h.mjs";
import { r as executeOpenClawStateLeaseCommand, t as acquireOpenClawStateLeaseInWorker } from "../openclaw-state-lease-worker-7PIEU0ow.mjs";
//#region src/state/openclaw-state.worker.ts
const loadAgentCleanup = createLazyRuntimeModule(() => import("../openclaw-agent-execution-cleanup.worker-axZOkODY.mjs"));
let agentCleanup;
const loadRuntime = createLazyRuntimeModule(() => import("../openclaw-state-worker-runtime-CgC6siBY.mjs"));
let runtime;
function createSqliteWorkerBackend(_input, context) {
	if (context.preparation?.type === "deviceIdentity") loadOrCreateDeviceIdentity({
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment,
		identityKey: context.preparation.identityKey
	});
	return createSharedStateWorkerBackend(context, openOpenClawStateDatabase({
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	}));
}
function openExistingSqliteWorkerBackend(_input, context) {
	return createSharedStateWorkerBackend(context);
}
function createSharedStateWorkerBackend(context, initialDatabase) {
	let nativeDatabase = initialDatabase;
	let borrow = nativeDatabase ? retainOpenClawStateDatabase(nativeDatabase) : void 0;
	let closed = false;
	const open = () => {
		if (!nativeDatabase) {
			const opened = openOpenClawStateDatabase({
				path: context.databasePath,
				env: getSqliteWorkerStateContext().environment
			});
			borrow = retainOpenClawStateDatabase(opened);
			nativeDatabase = opened;
		}
		if (!nativeDatabase.db.isOpen || openClawStateDatabaseCache.getCachedOpenClawStateDatabase(nativeDatabase.path) !== nativeDatabase) throw new Error("Shared-state worker lost its retained native database");
		return openOpenClawStateDatabase({
			database: nativeDatabase,
			path: context.databasePath,
			env: getSqliteWorkerStateContext().environment
		});
	};
	return {
		[SQLITE_WORKER_PREPARE_COMMAND](commandType) {
			if (commandType === "agentDatabases.releaseExitedLease") {
				if (agentCleanup) return;
				return loadAgentCleanup().then((loaded) => {
					agentCleanup = loaded;
				});
			}
			if (commandType === "plugins.metadata.read" || commandType === "database.inspectIdle" || commandType === "stateLease.acquire" || commandType === "deviceIdentity.read" || commandType === "deviceIdentity.load" || commandType === "stateLease.verify" || commandType === "stateLease.renew" || commandType === "stateLease.release") return;
			if (runtime) return runtime.prepareSharedStateCommand(commandType);
			return loadRuntime().then((loaded) => {
				runtime = loaded;
				return runtime.prepareSharedStateCommand(commandType);
			});
		},
		execute(command) {
			if (closed) throw new Error("Shared-state worker is closed");
			if (command.type === "deviceIdentity.read") return loadDeviceIdentityIfPresent({
				path: context.databasePath,
				identityKey: command.input.identityKey,
				env: getSqliteWorkerStateContext().environment
			});
			if (command.type === "deviceIdentity.load") try {
				return loadOrCreateDeviceIdentity({
					path: context.databasePath,
					identityKey: command.input.identityKey,
					env: getSqliteWorkerStateContext().environment
				});
			} finally {
				const database = openClawStateDatabaseCache.getCachedOpenClawStateDatabase(context.databasePath);
				if (!nativeDatabase && database) {
					borrow = retainOpenClawStateDatabase(database);
					nativeDatabase = database;
				}
			}
			if (command.type === "agentDatabases.releaseExitedLease") {
				if (!agentCleanup) throw new Error("Agent database cleanup runtime is not prepared");
				return agentCleanup.executeAgentDatabaseCleanupCommand(command, open(), getSqliteWorkerStateContext().environment);
			}
			if (command.type === "stateLease.acquire") return acquireOpenClawStateLeaseInWorker(command.input, context.databasePath, open);
			if (command.type === "stateLease.verify" || command.type === "stateLease.renew" || command.type === "stateLease.release") return executeOpenClawStateLeaseCommand(command, open());
			if (command.type === "plugins.metadata.read") return readPluginMetadataStateRowSync(command.input.selector, {
				path: context.databasePath,
				env: getSqliteWorkerStateContext().environment
			}, command.input.artifactPreservingReadOnly);
			if (command.type === "database.inspectIdle") {
				if (!nativeDatabase?.db.isOpen || openClawStateDatabaseCache.getCachedOpenClawStateDatabase(nativeDatabase.path) !== nativeDatabase) return "retire";
				assertOpenClawStateDatabaseOwner(nativeDatabase.db, { pathname: nativeDatabase.path });
				return nativeDatabase.walMaintenance.inspectIdle?.() ?? "retire";
			}
			if (!runtime) throw new Error("Shared-state worker command runtime is not prepared");
			return runtime.executeSharedStateCommand(command, context, open, nativeDatabase?.db.isOpen === true);
		},
		assertSettled() {
			if (nativeDatabase) {
				assertTransactionUsable(nativeDatabase.db);
				if (nativeDatabase.db.isOpen && nativeDatabase.db.isTransaction) throw new Error("Shared-state worker retained an unsettled transaction");
				if (nativeDatabase.db.isOpen) assertNoActiveSqliteReaders(nativeDatabase.db, "Shared-state worker");
			}
		},
		close() {
			closed = true;
			borrow?.release();
		}
	};
}
//#endregion
export { createSqliteWorkerBackend, openExistingSqliteWorkerBackend };
