import { r as createLazyRuntimeModule } from "../lazy-runtime-CJrzFzqU.mjs";
import { t as assertNoActiveSqliteReaders } from "../sqlite-reader-lifecycle-CYQdd96B.mjs";
import { n as assertExistingDatabaseIdentity } from "../sqlite-worker-identity-KSR14F6C.mjs";
import { t as assertTransactionUsable } from "../sqlite-transaction-DsZ3X6nD.mjs";
import { x as assertOpenClawStateDatabaseOwner } from "../openclaw-state-db-fast-path-CPAamWzU.mjs";
import { b as retainOpenClawStateDatabase, f as openClawStateDatabaseCache } from "../openclaw-state-db-cache-BKCnj4of.mjs";
import { o as SQLITE_WORKER_PREPARE_COMMAND } from "../sqlite-worker-contract-C51cJHzg.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "../sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { i as getSqliteWorkerStateContext, s as withSqliteWorkerExistingDatabase } from "../sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "../openclaw-state-db-D1jWDzK3.mjs";
import { g as ensureSecretStoreSchema } from "../openclaw-state-db-schema-additive-CzAgdzE5.mjs";
import { n as readPluginMetadataStateRowSync } from "../installed-plugin-index-row-CeyMwv4w.mjs";
import { n as pluginStateWorkerOperations, t as isPluginStateWorkerCommand } from "../plugin-state-worker-contract-BGdodjwz.mjs";
import { n as loadDeviceIdentityIfPresent, r as loadOrCreateDeviceIdentity } from "../device-identity-KmxGQO-v.mjs";
import { i as executeOpenClawStateLeaseCommand, t as acquireOpenClawStateLeaseInWorker } from "../openclaw-state-lease-worker-Bfyut3YB.mjs";
//#region src/state/openclaw-state.worker.ts
const loadAgentCleanup = createLazyRuntimeModule(() => import("../openclaw-agent-execution-cleanup.worker-BeJVxnzB.mjs"));
let agentCleanup;
const loadPluginState = createLazyRuntimeModule(() => import("../plugin-state.worker-BUNxaVum.mjs"));
let pluginState;
const loadCapture = createLazyRuntimeModule(() => import("../store.worker-BYz186R1.mjs"));
let capture;
const loadRuntime = createLazyRuntimeModule(() => import("../openclaw-state-worker-runtime-CImwF0yk.mjs"));
let runtime;
function stateDatabaseInitializationEnvironment() {
	const context = getSqliteWorkerStateContext();
	return context.initializationEnvironment ?? context.environment;
}
function createSqliteWorkerBackend(_input, context) {
	if (context.preparation?.type === "deviceIdentity") loadOrCreateDeviceIdentity({
		path: context.databasePath,
		env: stateDatabaseInitializationEnvironment(),
		identityKey: context.preparation.identityKey
	});
	return createSharedStateWorkerBackend(context, openOpenClawStateDatabase({
		path: context.databasePath,
		env: stateDatabaseInitializationEnvironment(),
		initializationAgentPaths: getSqliteWorkerStateContext().initializationAgentPaths
	}));
}
function openExistingSqliteWorkerBackend(_input, context) {
	const identity = context.existingIdentity;
	assertExistingDatabaseIdentity(context.databasePath, identity);
	const backend = createSharedStateWorkerBackend(context, void 0, identity);
	return {
		...backend,
		execute(command) {
			return withSqliteWorkerExistingDatabase(context.databasePath, identity, () => backend.execute(command));
		}
	};
}
function createSharedStateWorkerBackend(context, initialDatabase, existingIdentity) {
	let nativeDatabase = initialDatabase;
	let updateRunWriter;
	let borrow = nativeDatabase ? retainOpenClawStateDatabase(nativeDatabase) : void 0;
	let closed = false;
	let secretSchemaAdmitted = false;
	const open = () => {
		if (!nativeDatabase) {
			const opened = openOpenClawStateDatabase({
				path: context.databasePath,
				env: stateDatabaseInitializationEnvironment(),
				initializationAgentPaths: getSqliteWorkerStateContext().initializationAgentPaths
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
			if (commandType.startsWith("capture.")) {
				if (capture) return;
				return loadCapture().then((loaded) => {
					capture = loaded;
				});
			}
			if (commandType === "agentDatabases.releaseExitedLease") {
				if (agentCleanup) return;
				return loadAgentCleanup().then((loaded) => {
					agentCleanup = loaded;
				});
			}
			if (Object.hasOwn(pluginStateWorkerOperations, commandType)) {
				if (pluginState) return;
				return loadPluginState().then((loaded) => {
					pluginState = loaded;
				});
			}
			if (commandType === "plugins.metadata.read" || commandType === "database.inspectIdle" || commandType === "database.walMaintenance" || commandType === "stateLease.acquire" || commandType === "deviceIdentity.read" || commandType === "deviceIdentity.load" || commandType === "stateLease.verify" || commandType === "stateLease.renew" || commandType === "stateLease.release") return;
			if (runtime) return runtime.prepareSharedStateCommand(commandType);
			return loadRuntime().then((loaded) => {
				runtime = loaded;
				return runtime.prepareSharedStateCommand(commandType);
			});
		},
		execute(command) {
			if (closed) throw new Error("Shared-state worker is closed");
			if (command.type === "capture.upsertSession" || command.type === "capture.endSession" || command.type === "capture.persistPayload" || command.type === "capture.recordEvent" || command.type === "capture.recordEventWithPayload" || command.type === "capture.listSessions" || command.type === "capture.getSessionEvents" || command.type === "capture.summarizeSessionCoverage" || command.type === "capture.readBlob" || command.type === "capture.queryPreset" || command.type === "capture.deleteSessions" || command.type === "capture.purgeAll") {
				if (!capture) throw new Error("Capture worker command runtime is not prepared");
				return capture.executeCaptureCommand(command, open());
			}
			if (command.type === "deviceIdentity.read") return loadDeviceIdentityIfPresent({
				path: context.databasePath,
				identityKey: command.input.identityKey,
				env: getSqliteWorkerStateContext().environment
			});
			if (command.type === "deviceIdentity.load") try {
				return loadOrCreateDeviceIdentity({
					path: context.databasePath,
					identityKey: command.input.identityKey,
					env: stateDatabaseInitializationEnvironment()
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
			if (command.type === "stateLease.acquire") {
				if (command.input.schemaPolicy === "existing" && existingIdentity) assertExistingDatabaseIdentity(context.databasePath, existingIdentity);
				return acquireOpenClawStateLeaseInWorker(command.input, context.databasePath, open);
			}
			if (command.type === "stateLease.verify" || command.type === "stateLease.renew" || command.type === "stateLease.release") return executeOpenClawStateLeaseCommand(command, open());
			if (command.type === "plugins.metadata.read") return readPluginMetadataStateRowSync(command.input.selector, {
				path: context.databasePath,
				env: getSqliteWorkerStateContext().environment
			}, command.input.artifactPreservingReadOnly);
			if (command.type === "database.walMaintenance") return open().walMaintenance.maintainPeriodic?.(command.input, (stage) => {
				requestSqliteWorkerOperationAdmission({
					stage,
					facts: void 0
				});
			}) ?? { reclaimedPages: 0 };
			if (command.type === "database.inspectIdle") {
				if (!nativeDatabase?.db.isOpen || openClawStateDatabaseCache.getCachedOpenClawStateDatabase(nativeDatabase.path) !== nativeDatabase) {
					if (!nativeDatabase && updateRunWriter) {
						updateRunWriter.assertSettled();
						return "healthy";
					}
					return "retire";
				}
				assertOpenClawStateDatabaseOwner(nativeDatabase.db, { pathname: nativeDatabase.path });
				return nativeDatabase.walMaintenance.inspectIdle?.() ?? "retire";
			}
			if (isPluginStateWorkerCommand(command)) {
				if (!pluginState) throw new Error("Plugin-state worker command runtime is not prepared");
				return pluginState.executePluginStateCommand(command, {
					path: context.databasePath,
					env: getSqliteWorkerStateContext().environment
				}, open, nativeDatabase?.db.isOpen === true);
			}
			const currentRuntime = runtime;
			if (!currentRuntime) throw new Error("Shared-state worker command runtime is not prepared");
			if (command.type === "secrets.write" && !secretSchemaAdmitted) {
				runOpenClawStateWriteTransaction(({ db }) => ensureSecretStoreSchema(db), { database: open() }, { operationLabel: "secrets.store.admit" });
				secretSchemaAdmitted = true;
			}
			return currentRuntime.executeSharedStateCommand(command, context, open, () => updateRunWriter ??= currentRuntime.openUpdateRunWriter({
				path: context.databasePath,
				env: getSqliteWorkerStateContext().environment
			}));
		},
		assertSettled() {
			updateRunWriter?.assertSettled();
			if (nativeDatabase) {
				assertTransactionUsable(nativeDatabase.db);
				if (nativeDatabase.db.isOpen && nativeDatabase.db.isTransaction) throw new Error("Shared-state worker retained an unsettled transaction");
				if (nativeDatabase.db.isOpen) assertNoActiveSqliteReaders(nativeDatabase.db, "Shared-state worker");
			}
		},
		async close() {
			closed = true;
			try {
				updateRunWriter?.close();
			} finally {
				await borrow?.releaseAsync();
			}
		}
	};
}
//#endregion
export { createSqliteWorkerBackend, openExistingSqliteWorkerBackend };
