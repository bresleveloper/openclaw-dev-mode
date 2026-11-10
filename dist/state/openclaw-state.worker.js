import { r as assertExistingDatabaseIdentity } from "../sqlite-worker-identity-DLqVBf5J.mjs";
import { r as isPostgresSqlConnection } from "../sql-connection-DmQzXTVz.mjs";
import { t as assertNoActiveSqliteReaders } from "../sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { S as retainOpenClawStateDatabase, m as openClawStateDatabaseCache } from "../openclaw-state-db-cache-R1v7ogY0.mjs";
import { t as assertTransactionUsable } from "../sqlite-transaction-CpDyZPQ0.mjs";
import { t as SQLITE_WORKER_SOURCE_FENCE } from "../sqlite-source-fence-contract-B6Eyonhd.mjs";
import { a as SQLITE_WORKER_PREPARE_ADMITTED, i as SQLITE_WORKER_OPERATION_CLEANUP, o as SQLITE_WORKER_PREPARE_COMMAND } from "../sqlite-worker-contract-DhDutMia.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "../sqlite-worker-operation-admission-puNZKEvP.mjs";
import { c as withSqliteWorkerExistingDatabase, i as getSqliteWorkerStateContext } from "../sqlite-worker-state-context-QuvwmAax.mjs";
import { _ as ensureSecretStoreSchema } from "../openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { i as openOpenClawStateDatabase, o as reconcileOpenClawStateSchemaPublication, u as runOpenClawStateWriteTransaction } from "../openclaw-state-db-BtDOU_3j.mjs";
import { i as executeOpenClawStateLeaseCommand, t as acquireOpenClawStateLeaseInWorker } from "../openclaw-state-lease-worker-D3xn0u2j.mjs";
import { n as pluginStateWorkerOperations, t as isPluginStateWorkerCommand } from "../plugin-state-worker-contract-BsKBfdig.mjs";
import { n as loadDeviceIdentityIfPresent, r as loadOrCreateDeviceIdentity } from "../device-identity-8y_iX6az.mjs";
import { t as refreshSqlitePlannerStatistics } from "../sqlite-planner-statistics-B3MHdzD6.mjs";
import { t as createWorkerOperationRegistry } from "../worker-operation-registry-DhUe8rTN.mjs";
const stateWorkerRegistry = createWorkerOperationRegistry({
	clawAdoption: () => import("../claw-adoption.worker-CguIqAea.mjs").then((m) => m.clawAdoptionOperations),
	machineState: () => import("../config-machine-state.worker-C-3Chjgn.mjs").then((m) => m.machineStateOperations),
	localOnboarding: () => import("../local-onboarding-state.worker-CG4jMYU0.mjs").then((m) => m.localOnboardingOperations),
	agentDeletion: () => import("../agent-deletion.worker-BP-GzHXS.mjs").then((m) => m.agentDeletionOperations),
	agentRecovery: () => import("../agent-deletion-recovery.worker-DWPfEp1T.mjs").then((m) => m.agentRecoveryOperations),
	gatewayBoot: () => import("../gateway-boot-lifecycle.worker-D3rCOtIc.mjs").then((m) => m.gatewayBootOperations),
	localWorkspace: () => import("../local-workspace-store.worker-C8QCmjqJ.mjs").then((m) => m.localWorkspaceOperations),
	generatedHtmlProvenance: () => import("../generated-html-provenance.worker-DNy0BqIM.mjs").then((m) => m.generatedHtmlProvenanceOperations),
	mentions: () => import("../mention-inbox.worker-zPj-CANX.mjs").then((m) => m.mentionWorkerOperations),
	config: () => import("../config-journal-snapshot.worker-D52cspfJ.mjs").then((m) => m.configSnapshotOperations),
	diagnostic: () => import("../sqlite-audit-record.worker-B42fOc3g.mjs").then((m) => m.diagnosticOperations),
	restartSentinel: () => import("../restart-sentinel.worker-CJzpjKe0.mjs").then((m) => m.restartSentinelOperations),
	preparedPoolPresence: () => import("../prepared-pool-presence.worker-CPHQdDfB.mjs").then((m) => m.preparedPoolPresenceOperations),
	clawProvenance: () => import("../provenance-write.worker-CQqqZENO.mjs").then((m) => m.clawProvenanceOperations),
	projects: () => import("../project-registry.worker-DnWqhopt.mjs").then((m) => m.projectRegistryOperations),
	operatorApprovals: () => import("../operator-approval-store.worker-BJdP-I8k.mjs").then((m) => m.operatorApprovalOperations),
	execApprovals: () => import("../exec-approvals-authorization.worker-BR2S_oca.mjs").then((m) => m.execAuthorizationOperations),
	userGitHubConnections: () => import("../user-github-connections.worker-i4oXkldj.mjs").then((m) => m.userGitHubConnectionOperations),
	githubPublications: () => import("../github-publication.worker-T35iKtXh.mjs").then((m) => m.publicationOperations),
	userBackground: async () => (await import("../user-background.worker-DuS0Y7cZ.mjs")).userBackgroundOperations,
	userProfiles: () => import("../user-profiles.worker-D8NREdEY.mjs").then((m) => m.userProfileOperations),
	githubSecrets: () => import("../secret-store-github-handoff.worker-dLQFY5SJ.mjs").then((m) => m.githubSetupOperations),
	githubSetup: () => import("../secret-store-github-handoff.worker-dLQFY5SJ.mjs").then((m) => m.githubSetupOperations),
	agentDatabaseRegistry: () => import("../openclaw-agent-db-registry.worker-BfM_cQFX.mjs").then((m) => m.agentDatabaseRegistryOperations),
	authProfiles: () => import("../store.worker-D_iMhUSR.mjs").then((m) => m.authProfileOperations),
	pluginModelCatalogCredentials: () => import("../plugin-model-catalog-read.worker-B_Ionf7V.mjs").then((m) => m.pluginModelCatalogCredentialReadOperations),
	plugins: () => import("../state.worker-CBxC8zM_.mjs").then((m) => m.pluginRuntimeOperations),
	acpReplay: () => import("../event-ledger.worker-BRq0n2Zo.mjs").then((m) => m.acpReplayOperations),
	acp: () => import("../session-meta-write.worker-DLnWFaFH.mjs").then((m) => m.acpSessionOperations),
	skillLibrary: () => import("../store.worker-DXskg9jT.mjs").then((m) => m.skillLibraryOperations),
	skillUploads: () => import("../upload-store.worker-C_gGRSwC.mjs").then((m) => m.skillUploadOperations),
	skills: () => import("../changes.worker-DJe1tCD6.mjs").then((m) => m.skillWorkshopOperations),
	transcripts: () => import("../store-worker-write-CO46DUy9.mjs").then((m) => m.transcriptWriteOperations),
	webPush: () => import("../push-web-store.worker-2bxnUmUd.mjs").then((m) => m.webPushOperations),
	apns: () => import("../push-apns-store.worker-znJDIb_I.mjs").then((m) => m.apnsOperations),
	worktrees: () => import("../dispatch.worker-DzeB2ams.mjs").then((m) => m.worktreeOperations),
	mcpOAuth: () => import("../mcp-oauth-store.worker-gBbiaSdK.mjs").then((m) => m.mcpOAuthOperations),
	legacyMcpOAuth: () => import("../state-migrations.mcp-oauth.worker-CWwjm1us.mjs").then((m) => m.legacyMcpOAuthOperations),
	nativeHookRelay: () => import("../native-hook-relay-store.worker-qFcX1aS3.mjs").then((m) => m.nativeHookRelayOperations),
	audit: () => import("../audit-event-writer.worker-B51q_hYf.mjs").then((m) => m.auditOperations),
	promotions: () => import("../promotions-feed.worker-B7unwgZ9.mjs").then((m) => m.promotionOperations),
	telemetry: () => import("../telemetry-store.worker-Dvz76mrd.mjs").then((m) => m.telemetryOperations),
	doctor: () => import("../doctor-state.worker-i3Ibg9nJ.mjs").then((m) => m.doctorOperations),
	modelCatalog: () => import("../remote-store.worker-7-ff5uSI.mjs").then((m) => m.modelCatalogOperations),
	managedImages: () => import("../managed-image-record-store.kernel-CGvx-9Eu.mjs").then((m) => m.managedImageRecordOperations),
	pluginBlob: () => import("../plugin-blob-store.worker-B6qAuHNy.mjs").then((m) => m.pluginBlobOperations),
	onboardingRecommendations: () => import("../onboarding-recommendations.kernel-DSJXIWn_.mjs").then((m) => m.onboardingRecommendationOperations),
	nodeWorker: () => import("../node-worker-journal.worker-Bp569TIH.mjs").then((m) => m.nodeWorkerJournalOperations),
	channelIngress: () => import("../ingress-queue.worker-MbDbLssD.mjs").then((m) => m.channelIngressOperations),
	channelPairing: () => import("../pairing-store.worker-m9rUdPJW.mjs").then((m) => m.channelPairingOperations),
	devicePairing: () => import("../device-pairing-core.worker-LDwvAm3e.mjs").then((m) => m.devicePairingOperations),
	node: () => import("../device-pairing-node.worker-SkzV7ilq.mjs").then((m) => m.nodePairingOperations),
	bootstrap: () => import("../device-bootstrap.worker-kernel-BqpFS6WU.mjs").then((m) => m.deviceBootstrapOperations),
	deliveryQueue: () => import("../delivery-queue.worker-rrLJy13s.mjs").then((m) => m.deliveryQueueOperations),
	sessionDelivery: () => import("../session-delivery-queue.worker-DMPBfb94.mjs").then((m) => m.sessionDeliveryOperations),
	conversationBindings: () => import("../current-conversation-bindings.worker-GkOuhnD4.mjs").then((m) => m.conversationBindingOperations),
	workerInference: () => import("../inference-store.worker-DN6BPSWu.mjs").then((m) => m.workerInferenceOperations),
	workerPlacements: () => import("../placement-lifecycle.worker-BbTYect9.mjs").then((m) => ({
		...m.placementLifecycleOperations,
		...m.placementReadOperations
	})),
	placementTools: () => import("../placement-session-tool-operations.worker-Cz0FSb6U.mjs").then((m) => m.placementSessionToolOperations),
	placementTurns: () => import("../placement-turn-claims.worker-CoWjxv5J.mjs").then((m) => m.placementTurnClaimOperations),
	placementJournals: () => import("../placement-workspace-journal.worker-CIl0Z8LG.mjs").then((m) => m.workspaceJournalOperations),
	placementTranscript: () => import("../transcript-commit-store.worker-CqtrI4WE.mjs").then((m) => m.workerTranscriptCommitOperations),
	workerEnvironments: () => import("../store.worker-Be-ou4oe.mjs").then((m) => m.workerEnvironmentOperations),
	repositoryWorkspaces: () => import("../session-repository-workspaces.worker-Bxck0N0C.mjs").then((m) => m.repositoryWorkspaceOperations)
});
//#endregion
//#region src/state/openclaw-state.worker.ts
const commandRegistry = createWorkerOperationRegistry({
	deviceAuth: async () => (await import("../device-auth-store.worker-BdvMDNYg.mjs")).deviceAuthWorkerOperations,
	restartLifecycle: () => import("../restart-lifecycle.worker-ftF-Z0B_.mjs").then((loaded) => loaded.restartLifecycleOperations),
	worktrees: async () => {
		const [templates, reserveCapacity, recoverPending] = await Promise.all([
			import("../template-registry.worker-BlQ3Mbau.mjs").then((loaded) => loaded.worktreeTemplateOperations),
			import("../capacity.worker-BmX_fg7R.mjs").then((loaded) => loaded.reserveWorktreeCapacityInWorker),
			import("../registry-run-end.worker-BkHbR-oK.mjs").then((loaded) => loaded.recoverPendingWorktreesInWorker)
		]);
		return {
			...templates,
			"worktrees.reserveCapacity": reserveCapacity,
			"worktrees.recoverPending": recoverPending
		};
	}
});
let agentCleanup;
let pluginState;
let capture;
let runtime;
let publicationSource;
function prepareStateCommand(commandType) {
	const prepared = stateWorkerRegistry.prepare(commandType);
	if (prepared) return prepared.then(() => prepareStateCommand(commandType));
	if (stateWorkerRegistry.has({
		type: commandType,
		input: void 0
	})) return;
	if (runtime) return runtime.prepareSharedStateCommand(commandType);
	return import("../openclaw-state-worker-runtime-DBgLpMzw.mjs").then((loaded) => {
		runtime = loaded;
		return runtime.prepareSharedStateCommand(commandType);
	});
}
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
	let publicationSourceReader;
	const retainCachedDatabase = () => {
		if (!nativeDatabase) {
			const database = openClawStateDatabaseCache.getCachedOpenClawStateDatabase(context.databasePath);
			if (database) {
				borrow = retainOpenClawStateDatabase(database);
				nativeDatabase = database;
			}
		}
	};
	const retainedDatabase = () => {
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
		return nativeDatabase;
	};
	const open = () => openOpenClawStateDatabase({
		database: retainedDatabase(),
		path: context.databasePath,
		env: getSqliteWorkerStateContext().environment
	});
	const write = (operation, transactionOptions, database = retainedDatabase(), env = getSqliteWorkerStateContext().environment) => runOpenClawStateWriteTransaction(operation, {
		database,
		path: context.databasePath,
		env
	}, transactionOptions);
	const writeAdmitted = (operation, { receipt, transactionEnvironment, ...options } = {}) => {
		const openedDatabase = open();
		return write((database) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const result = operation(database);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: receipt === "result" ? result : void 0
			});
			if (receipt === "result") deferSqliteWorkerCommitReceipt(database.db, result);
			return result;
		}, options, openedDatabase, transactionEnvironment === "process" ? process.env : void 0);
	};
	const operationContext = {
		open,
		write,
		writeAdmitted,
		stateOptions: () => ({
			path: context.databasePath,
			env: getSqliteWorkerStateContext().environment
		})
	};
	return {
		[SQLITE_WORKER_PREPARE_ADMITTED](command) {
			const source = command.type === "githubPublication.sourceFacts" || command.type === "githubPublications.shared" || command.type === "githubPublications.insert" || command.type === "githubPublications.personal" || command.type === "githubPublications.repository" ? command.input.source : void 0;
			if (source) {
				if (!publicationSource) throw new Error("GitHub publication source runtime is not prepared.");
				publicationSourceReader ??= publicationSource.createGitHubPublicationSourceWorker();
				publicationSourceReader.prepare(source, open().db);
			}
		},
		[SQLITE_WORKER_SOURCE_FENCE](command) {
			if (command.type === "githubPublications.shared" || command.type === "githubPublications.insert" || command.type === "githubPublications.personal" || command.type === "githubPublications.repository") {
				if (command.input.source) {
					if (!publicationSourceReader) throw new Error("GitHub publication source is unavailable.");
					return publicationSourceReader.fence(command.input.source);
				}
			}
		},
		[SQLITE_WORKER_OPERATION_CLEANUP]() {
			publicationSourceReader?.close();
		},
		async prepare(command) {
			if (command.type === "pluginState.executeOperation") {
				if (!pluginState) pluginState = await import("../plugin-state.worker-CnitK4vC.mjs");
				await pluginState.preparePluginStateOperation(command.input);
			}
		},
		[SQLITE_WORKER_PREPARE_COMMAND](commandType) {
			if (commandType === "githubPublication.sourceFacts" || commandType.startsWith("githubPublications.")) return Promise.all([publicationSource ? void 0 : import("../github-publication-source.worker-C0bNsI0I.mjs").then((loaded) => {
				publicationSource = loaded;
			}), commandType === "githubPublication.sourceFacts" ? void 0 : prepareStateCommand(commandType)]).then(() => void 0);
			if (commandType.startsWith("deviceAuth.") || commandType.startsWith("restartLifecycle.") || commandType.startsWith("worktrees.templates.") || commandType === "worktrees.reserveCapacity" || commandType === "worktrees.recoverPending") return commandRegistry.prepare(commandType);
			if (commandType.startsWith("capture.")) {
				if (capture) return;
				return import("../store.worker-ClOIlTzi.mjs").then((loaded) => {
					capture = loaded;
				});
			}
			if (commandType === "agentDatabases.releaseExitedLease") {
				if (agentCleanup) return;
				return import("../openclaw-agent-execution-cleanup.worker-C4sUUKas.mjs").then((loaded) => {
					agentCleanup = loaded;
				});
			}
			if (Object.hasOwn(pluginStateWorkerOperations, commandType)) {
				if (pluginState) return;
				return import("../plugin-state.worker-CnitK4vC.mjs").then((loaded) => {
					pluginState = loaded;
				});
			}
			if (commandType === "database.inspectIdle" || commandType === "database.walMaintenance" || commandType === "database.publishSchema" || commandType === "stateLease.acquire" || commandType === "deviceIdentity.read" || commandType === "deviceIdentity.load" || commandType === "stateLease.verify" || commandType === "stateLease.renew" || commandType === "stateLease.release") return;
			return prepareStateCommand(commandType);
		},
		execute(command) {
			if (closed) throw new Error("Shared-state worker is closed");
			if (command.type === "githubPublication.sourceFacts") {
				if (!publicationSourceReader) throw new Error("GitHub publication source is unavailable.");
				return publicationSourceReader.read(command.input.source);
			}
			if (commandRegistry.has(command)) return commandRegistry.execute(command, operationContext);
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
				retainCachedDatabase();
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
			if (command.type === "database.publishSchema") try {
				return reconcileOpenClawStateSchemaPublication({
					path: context.databasePath,
					env: getSqliteWorkerStateContext().environment
				});
			} finally {
				retainCachedDatabase();
			}
			if (command.type === "database.walMaintenance") {
				const database = open();
				const admit = (stage) => {
					requestSqliteWorkerOperationAdmission({
						stage,
						facts: void 0
					});
				};
				return database.walMaintenance.maintainPeriodic?.(command.input, admit, () => runOpenClawStateWriteTransaction(({ db }) => {
					admit("transaction");
					if (!isPostgresSqlConnection(db)) refreshSqlitePlannerStatistics(db);
					admit("commit");
				}, { database }, {
					busyTimeoutMs: 0,
					operationLabel: "state.planner-statistics"
				})) ?? { reclaimedPages: 0 };
			}
			if (command.type === "database.inspectIdle") {
				if (!nativeDatabase?.db.isOpen || openClawStateDatabaseCache.getCachedOpenClawStateDatabase(nativeDatabase.path) !== nativeDatabase) {
					if (!nativeDatabase && updateRunWriter) {
						updateRunWriter.assertSettled();
						return "healthy";
					}
					return "retire";
				}
				return nativeDatabase.walMaintenance.inspectIdle?.() ?? "retire";
			}
			if (isPluginStateWorkerCommand(command)) {
				if (!pluginState) throw new Error("Plugin-state worker command runtime is not prepared");
				return pluginState.executePluginStateCommand(command, {
					path: context.databasePath,
					env: getSqliteWorkerStateContext().environment
				}, retainedDatabase, nativeDatabase?.db.isOpen === true);
			}
			if (stateWorkerRegistry.has(command)) return stateWorkerRegistry.execute(command, operationContext);
			const currentRuntime = runtime;
			if (!currentRuntime) throw new Error("Shared-state worker command runtime is not prepared");
			if (command.type === "secrets.write" && !secretSchemaAdmitted) {
				runOpenClawStateWriteTransaction(({ db }) => ensureSecretStoreSchema(db), { database: open() }, { operationLabel: "secrets.store.admit" });
				secretSchemaAdmitted = true;
			}
			return currentRuntime.executeSharedStateCommand(command, context, open, write, () => updateRunWriter ??= currentRuntime.openUpdateRunWriter({
				path: context.databasePath,
				env: getSqliteWorkerStateContext().environment
			}));
		},
		assertSettled() {
			updateRunWriter?.assertSettled();
			if (nativeDatabase) {
				assertTransactionUsable(nativeDatabase.db);
				if (nativeDatabase.db.isOpen && nativeDatabase.db.isTransaction) throw new Error("Shared-state worker retained an unsettled transaction");
				if (nativeDatabase.db.isOpen && !isPostgresSqlConnection(nativeDatabase.db)) assertNoActiveSqliteReaders(nativeDatabase.db, "Shared-state worker");
			}
		},
		async close() {
			closed = true;
			try {
				publicationSourceReader?.close();
				updateRunWriter?.close();
			} finally {
				await borrow?.releaseAsync();
			}
		}
	};
}
//#endregion
export { createSqliteWorkerBackend, openExistingSqliteWorkerBackend };
