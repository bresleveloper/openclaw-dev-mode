import "../src-CdRlGRnW.mjs";
import { t as expectDefined } from "../expect-lbe3Hgrh.mjs";
import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { o as sqliteReaderDatabasePathKey } from "../sqlite-reader-lifecycle-CYQdd96B.mjs";
import { n as assertExistingDatabaseIdentity, o as normalizeDatabasePath, u as readDatabasePathIdentitySync } from "../sqlite-worker-identity-KSR14F6C.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "../sqlite-lifecycle-errors-DuOygjcn.mjs";
import { t as assertTransactionUsable } from "../sqlite-transaction-DsZ3X6nD.mjs";
import { h as onSqliteWalCheckpoint } from "../sqlite-wal-DUSYRhyv.mjs";
import { b as retainOpenClawStateDatabase, y as requireOpenClawStateDatabaseIdentity } from "../openclaw-state-db-cache-BKCnj4of.mjs";
import { i as getOpenClawAgentDatabaseValidation, v as readOpenClawAgentDatabaseIdentity } from "../openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { a as SQLITE_WORKER_PREPARE_ADMITTED, i as SQLITE_WORKER_OPERATION_CLEANUP, t as SQLITE_WORKER_CLOSE_RECEIPT } from "../sqlite-worker-contract-C51cJHzg.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt, s as takeSqliteWorkerOperationAdmissionAttachment, t as SqliteWorkerOpenRefusedError } from "../sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "../openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "../openclaw-state-db-D1jWDzK3.mjs";
import { a as readAgentDeletionJournalStatusInDatabase } from "../agent-deletion-journal.read-Bkjt0nDs.mjs";
import { o as ensureOpenClawAgentDatabasePermissions } from "../openclaw-agent-db-schema-kFBuwbLx.mjs";
import { d as prepareOpenClawAgentDatabaseWorkerLease } from "../openclaw-agent-db-lease-D8zYIRzn.mjs";
import { i as closeOpenClawAgentDatabaseByPath, y as retainAgentDatabase } from "../openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { a as getOpenClawAgentDatabaseIfOpen, s as openOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "../openclaw-agent-db-DBug3LUA.mjs";
import { _ as prepareAgentNativeBindingOperation, a as loadAgentEntryPatchOperations, b as requestRestrictedAgentDatabaseAdmission, c as loadAgentPendingInputOperations, d as loadAgentReplacementOperations, f as loadAgentRestartRecoveryOperations, g as loadUsageCacheOperations, h as loadConversationDeliveryOperations, i as loadAgentCompoundOperations, l as loadAgentProviderReviewOperations, m as loadAgentTranscriptOperations, n as loadAgentArchiveOperations, o as loadAgentEntryReadOperations, p as loadAgentTrajectoryOperations, r as loadAgentArchivePruningOperations, s as loadAgentNativeBindingOperations, t as loadAgentAcpOperations, u as loadAgentReactionOperations, v as prepareAgentTranscript, y as createAgentDatabaseDomainOwner } from "../openclaw-agent-execution-operations-CtJayanR.mjs";
import { t as createWorkerOperationRegistry } from "../worker-operation-registry-DhUe8rTN.mjs";
import { MessageChannel, isMainThread, receiveMessageOnPort, threadId } from "node:worker_threads";
//#region src/state/openclaw-agent-execution-close.ts
/** Keep the native receipt and both cleanup modes with the same retirement owner. */
function createAgentDatabaseExecutionCloser(capture) {
	let receipt;
	return {
		[SQLITE_WORKER_CLOSE_RECEIPT]: () => receipt,
		closeAfterFailedOpen() {
			const { sharedBorrow, ...state } = capture();
			receipt = void 0;
			receipt = closeAgentDatabaseExecution({
				...state,
				releaseSharedBorrow: () => sharedBorrow?.release()
			});
		},
		async close() {
			const { sharedBorrow, ...state } = capture();
			receipt = void 0;
			await state.database?.walMaintenance.stop();
			const errors = [];
			try {
				receipt = closeAgentDatabaseExecution({
					...state,
					releaseSharedBorrow: () => {}
				});
			} catch (error) {
				errors.push(error);
			}
			try {
				await sharedBorrow?.releaseAsync();
			} catch (error) {
				errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, "Agent database cleanup failed");
		}
	};
}
function closeAgentDatabaseExecution({ database, identity, releasePreparations, closeDomain, releaseBorrow, releaseSharedBorrow }) {
	let checkpoint;
	const errors = [];
	for (const cleanup of [
		...releasePreparations,
		closeDomain,
		() => {
			if (!database) return;
			const closingPath = sqliteReaderDatabasePathKey(database.path);
			const stopObserving = onSqliteWalCheckpoint((observation) => {
				if (observation.databasePath === closingPath) checkpoint = {
					health: observation.health,
					observedAtNs: observation.observedAtNs,
					lastCompletedAtNs: observation.lastCompletedAtNs
				};
			});
			try {
				closeOpenClawAgentDatabaseByPath(database.path, database.agentId);
			} finally {
				stopObserving();
			}
		},
		() => releaseBorrow?.(),
		releaseSharedBorrow
	]) try {
		cleanup();
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Agent database cleanup failed");
	if (identity && checkpoint) return {
		identity: {
			key: `file:${identity.physicalIdentity}`,
			canonicalPath: identity.nativeLocation
		},
		incarnation: identity.incarnation,
		checkpoint
	};
}
//#endregion
//#region src/state/openclaw-agent-execution-incognito.worker.ts
/** The ephemeral arm retains one native owner for every admitted operation. */
function createIncognitoAgentDatabaseBackend(input, opening) {
	const options = {
		agentId: input.agentId,
		path: input.databasePath,
		env: input.environment
	};
	if (isMainThread || opening.databasePath !== input.databasePath || opening.target?.kind !== "ephemeral" || opening.target.handle !== input.identity.handle || opening.target.incarnation !== input.identity.incarnation || !isIncognitoOpenClawAgentSqlitePath(input.databasePath, options)) throw new Error("Incognito open differs from its worker-owned target");
	try {
		requestSqliteWorkerOperationAdmission({
			stage: "open",
			facts: input
		});
	} catch (error) {
		throw new SqliteWorkerOpenRefusedError(error);
	}
	if (getOpenClawAgentDatabaseIfOpen(options)) throw new Error("Incognito actor cannot adopt another native database");
	const database = openOpenClawAgentDatabase(options);
	const release = retainAgentDatabase(database.db);
	let closed = false;
	const close = () => {
		closed = true;
		closeOpenClawAgentDatabaseByPath(database.path, database.agentId);
		release();
	};
	try {
		if (database.db.location()) throw new Error("Incognito actor requires memory-only SQLite storage");
		requestSqliteWorkerOperationAdmission({
			stage: "prepare",
			facts: { identity: input.identity }
		});
	} catch (error) {
		try {
			close();
		} catch (cleanupError) {
			throw createSqliteLifecycleAggregateError([error, cleanupError], "Incognito open and cleanup failed", error);
		}
		throw error;
	}
	const assertCurrent = () => {
		if (closed || !database.db.isOpen || getOpenClawAgentDatabaseIfOpen(options) !== database) throw new Error("Incognito actor lost its retained native database");
	};
	let sessions;
	return {
		async prepare(command) {
			if (command.type !== "database.incognito.memory" && !sessions) {
				const { createIncognitoSessionWorker } = await import("../session-incognito.worker-D_r96hYf.mjs");
				sessions = createIncognitoSessionWorker(database, input.identity, input.environment);
			}
			if (command.type !== "database.incognito.memory") await sessions?.prepare(command);
		},
		execute(command) {
			assertCurrent();
			requestSqliteWorkerOperationAdmission({
				stage: "prepare",
				facts: { identity: input.identity }
			});
			if (command.type !== "database.incognito.memory") {
				if (!sessions) throw new Error("Incognito session operation was not prepared");
				return sessions.execute(command);
			}
			const pageCount = database.db.prepare("PRAGMA page_count").get()?.page_count;
			const pageSize = database.db.prepare("PRAGMA page_size").get()?.page_size;
			if (typeof pageCount !== "number" || typeof pageSize !== "number") throw new Error("Incognito memory diagnostics are unavailable");
			return {
				agentId: input.agentId,
				pageCount,
				pageSize,
				databaseBytes: pageCount * pageSize
			};
		},
		assertSettled() {
			assertCurrent();
			sessions?.assertSettled();
			if (database.db.isTransaction) throw new Error("Incognito command left an unsettled native transaction");
		},
		close() {
			sessions?.close();
			close();
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-execution-maintenance.ts
/** Metadata preparation and commit share the canonical actor's retained snapshots. */
function createAgentDatabaseMaintenanceOwner(context) {
	const preparations = /* @__PURE__ */ new Map();
	let maintenance;
	let replacements;
	const releasePreparation = (id) => {
		const preparation = preparations.get(id);
		if (preparation) {
			preparation.prepared.release();
			preparations.delete(id);
		}
	};
	return {
		operations: {
			"session.maintenance.release": ({ id }) => releasePreparation(id),
			"session.maintenance.prepare": (input) => {
				const kernel = expectDefined(maintenance, "Session maintenance kernel");
				context.assertFileIdentity();
				if (preparations.has(input.id)) throw new Error("Session maintenance preparation is already retained");
				if (preparations.size >= 2) throw new Error("Session maintenance preparation capacity is occupied");
				const prepared = kernel.prepareSessionMaintenanceInWorker({
					kind: "maintenance-plan",
					input: input.input,
					ageOwner: input.ageOwner,
					ageChanges: input.ageChanges,
					databaseOptions: context.databaseOptions
				});
				preparations.set(input.id, {
					plan: input,
					prepared
				});
			},
			"session.maintenance.metadata": (input) => {
				const kernel = expectDefined(maintenance, "Session maintenance kernel");
				const preparePublication = expectDefined(replacements, "Session replacement kernel").prepareSessionEntryReplacementPublication;
				const opened = context.openWriter();
				const previous = /* @__PURE__ */ new Map();
				const current = /* @__PURE__ */ new Map();
				let publication;
				const preparation = input.kind === "maintenance-plan" ? expectDefined(preparations.get(input.preparationId), "Session maintenance preparation") : void 0;
				if (preparation && input.kind === "maintenance-plan") Object.assign(preparation.plan.input, input.protection);
				const plan = input.kind === "maintenance-plan" ? {
					...expectDefined(preparation, "Session maintenance preparation").plan,
					kind: "maintenance-plan"
				} : input;
				const value = kernel.runSessionMaintenanceMetadataInTransaction({
					...plan,
					databaseOptions: context.databaseOptions
				}, {
					beforeMutation(database) {
						if (database.db !== opened.db) throw new Error("Session maintenance lost its canonical database owner");
						context.admit("transaction");
					},
					onArchived(sessionKey, before, after) {
						previous.set(sessionKey, before);
						current.set(sessionKey, after);
					},
					beforeCommit(database) {
						publication = preparePublication({
							pendingArchiveRecovery: false,
							previous,
							current,
							maintenancePlans: [],
							membershipInvalidatedKeys: []
						}, database);
						deferSqliteWorkerCommitReceipt(database.db, publication);
						context.admit("commit", publication);
					}
				}, preparation?.prepared);
				return value.kind === "maintenance-preservation-required" || value.kind === "maintenance-plan-stale" ? {
					kind: "not-committed",
					workerThreadId: threadId,
					value
				} : {
					kind: "committed",
					workerThreadId: threadId,
					value,
					publication: expectDefined(publication, "Session maintenance commit receipt")
				};
			}
		},
		prepare() {
			return Promise.all([import("../session-accessor.sqlite-maintenance-transaction-CqArhfLI.mjs"), import("../session-accessor.sqlite-replacement-state-DHSVLBH5.mjs")]).then(([metadata, replacement]) => {
				maintenance = metadata;
				replacements = replacement;
			});
		},
		cleanup(input) {
			if (input.kind === "maintenance-plan") releasePreparation(input.preparationId);
		},
		getPreparationReleases() {
			return [...preparations.keys()].map((id) => () => releasePreparation(id));
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-execution.worker.ts
function createSqliteWorkerBackend(input, opening) {
	if (input.kind === "ephemeral") return createIncognitoAgentDatabaseBackend(input, opening);
	const backend = openAgentDatabaseBackend(input, opening);
	try {
		backend.execute({
			type: "database.prepareWrite",
			input: void 0
		});
		backend.assertSettled?.();
		return backend;
	} catch (error) {
		try {
			backend.closeAfterFailedOpen();
		} catch (cleanupError) {
			throw createSqliteLifecycleAggregateError([error, cleanupError], "Agent creation and cleanup failed", error);
		}
		throw error;
	}
}
/** The broker supplies a private admission channel before invoking this native factory. */
const openExistingSqliteWorkerBackend = openAgentDatabaseBackend;
function openAgentDatabaseBackend(input, opening) {
	if (opening.databasePath !== input.databasePath) throw new Error("Agent database open does not match its captured execution owner");
	const admitOpen = () => {
		try {
			requestSqliteWorkerOperationAdmission({
				stage: "open",
				facts: input
			});
		} catch (error) {
			throw new SqliteWorkerOpenRefusedError(error);
		}
	};
	admitOpen();
	const options = {
		agentId: input.agentId,
		path: input.databasePath,
		env: input.environment
	};
	let admittedFileIdentity = input.creatingIdentity?.key ?? opening.existingIdentity ?? readDatabasePathIdentitySync(input.databasePath).key;
	let admittedFileBirthtime = input.creatingIdentity?.birthtime;
	const assertFileIdentity = () => {
		if (input.expectedIdentity) assertExistingDatabaseIdentity(input.databasePath, `file:${input.expectedIdentity.physicalIdentity}`, input.expectedIdentity.birthtime);
		const pathOnly = admittedFileIdentity.startsWith("path:");
		if (pathOnly || input.creatingIdentity) {
			const current = readDatabasePathIdentitySync(input.databasePath);
			if (pathOnly && current.key !== admittedFileIdentity || input.creatingIdentity && current.canonicalPath !== input.creatingIdentity.canonicalPath) throw new Error("Agent database target changed before creating open");
		}
		if (!pathOnly) assertExistingDatabaseIdentity(input.databasePath, admittedFileIdentity, admittedFileBirthtime);
	};
	let database;
	let shared;
	let sharedBorrow;
	let releaseBorrow;
	let identity;
	let openingFailure;
	let startupJournalRequested = false;
	let publicationStartupJournal;
	const readRequestPreparation = () => {
		const attachment = takeSqliteWorkerOperationAdmissionAttachment();
		if (!isRecord(attachment) || attachment.kind !== "agent-execution" || typeof attachment.startupJournal !== "boolean") throw new Error("Agent execution requires its request-local preparation facts");
		return attachment.startupJournal;
	};
	const readDeletionJournal = () => readAgentDeletionJournalStatusInDatabase(expectDefined(shared, "Agent execution shared-state owner").db, input.agentId) !== "absent";
	const openWriter = () => {
		let validation;
		if (!database) {
			admitOpen();
			assertFileIdentity();
			if (!shared) {
				shared = openOpenClawStateDatabase({
					path: input.stateDatabasePath,
					env: input.environment,
					initializationAgentPaths: [input.databasePath]
				});
				sharedBorrow = retainOpenClawStateDatabase(shared);
			}
			const lease = prepareOpenClawAgentDatabaseWorkerLease(options, shared, input.leaseId);
			const { port1, port2 } = new MessageChannel();
			try {
				requestSqliteWorkerOperationAdmission({
					stage: "prepare",
					facts: {
						kind: "shared-owner",
						identity: requireOpenClawStateDatabaseIdentity(shared),
						lease: lease.receipt,
						validationPort: port2
					}
				}, [port2]);
				lease.validation = receiveMessageOnPort(port1)?.message;
			} catch (error) {
				throw new SqliteWorkerOpenRefusedError(error);
			} finally {
				port1.close();
				port2.close();
			}
			assertFileIdentity();
			let registration;
			let openingResult;
			try {
				const opened = openOpenClawAgentDatabase(options, lease, {
					starting: () => requestSqliteWorkerOperationAdmission({
						stage: "prepare",
						facts: {
							kind: "agent-registration-start",
							lease: lease.receipt
						}
					}),
					committed(receipt) {
						registration = receipt;
					}
				});
				database = opened;
				releaseBorrow = retainAgentDatabase(opened.db);
				openingResult = {
					ok: true,
					value: opened
				};
			} catch (error) {
				openingFailure = { error };
				openingResult = {
					ok: false,
					error
				};
			}
			if (registration) try {
				requestSqliteWorkerOperationAdmission({
					stage: "prepare",
					facts: {
						kind: "agent-registration-committed",
						registration
					}
				});
			} catch (error) {
				if (!openingResult.ok) throw createSqliteLifecycleAggregateError([openingResult.error, error], `${String(openingResult.error)}; committed registration reporting failed: ${String(error)}`, openingResult.error);
				throw error;
			}
			if (!openingResult.ok) throw openingResult.error;
			const opened = openingResult.value;
			const nativeIdentity = readOpenClawAgentDatabaseIdentity(opened);
			if (typeof nativeIdentity.identity !== "string") throw new Error("Disk agent execution requires its canonical file identity");
			const openedFileIdentity = `file:${nativeIdentity.identity}`;
			if (admittedFileIdentity.startsWith("file:") && (openedFileIdentity !== admittedFileIdentity || admittedFileBirthtime !== void 0 && nativeIdentity.birthtime !== admittedFileBirthtime)) throw new Error("Agent writer differs from its admitted physical file");
			if (input.expectedIdentity && nativeIdentity.identity !== input.expectedIdentity.physicalIdentity) throw new Error("Agent writer differs from its expected physical file");
			admittedFileIdentity = openedFileIdentity;
			admittedFileBirthtime = nativeIdentity.birthtime;
			identity = {
				kind: "file",
				physicalIdentity: nativeIdentity.identity,
				birthtime: nativeIdentity.birthtime,
				incarnation: nativeIdentity.incarnation,
				nativeLocation: nativeIdentity.filename
			};
			validation = getOpenClawAgentDatabaseValidation(opened);
		}
		if (!database || !database.db.isOpen || getOpenClawAgentDatabaseIfOpen(options) !== database) throw new Error("Agent execution lost its retained native database");
		requestSqliteWorkerOperationAdmission({
			stage: "prepare",
			facts: {
				identity,
				validation,
				...startupJournalRequested ? { agentDeletionJournalPresent: readDeletionJournal() } : {}
			}
		});
		return database;
	};
	const admit = (stage, publication, requestAdmission) => {
		assertFileIdentity();
		const request = {
			stage,
			facts: {
				identity,
				...startupJournalRequested ? { agentDeletionJournalPresent: readDeletionJournal() } : {},
				...publication ? { publication } : {}
			}
		};
		requestRestrictedAgentDatabaseAdmission(request, requestAdmission);
		if (stage === "commit") ensureOpenClawAgentDatabasePermissions(input.databasePath, options);
	};
	const writeTransaction = (operationLabel, owner, write) => {
		const opened = openWriter();
		return runOpenClawAgentWriteTransaction((current) => {
			if (current.db !== opened.db) throw new Error(`${owner} lost its canonical database owner`);
			admit("transaction");
			return write(current);
		}, options, { operationLabel });
	};
	const maintenance = createAgentDatabaseMaintenanceOwner({
		databaseOptions: options,
		assertFileIdentity,
		openWriter,
		admit
	});
	const loadMaintenanceOperations = async () => maintenance.operations;
	const registry = createWorkerOperationRegistry({
		"session.entry.read": loadAgentEntryReadOperations,
		"session.entry.patch.prepare": loadAgentEntryPatchOperations,
		"session.entry.patch.commit": loadAgentEntryPatchOperations,
		"session.turn.prepare": loadAgentCompoundOperations,
		"session.turn.commit": loadAgentCompoundOperations,
		"session.lifecycle.reset": loadAgentCompoundOperations,
		"session.nativeBindings.delete": loadAgentNativeBindingOperations,
		"trajectory.events.append": loadAgentTrajectoryOperations,
		"session.archives.preparePublication": loadAgentArchiveOperations,
		"session.archives.recordPublication": loadAgentArchiveOperations,
		"session.transcript.initialize": loadAgentTranscriptOperations,
		"session.entries.replace": loadAgentReplacementOperations,
		"session.restart.recover": loadAgentRestartRecoveryOperations,
		"session.entry.acp": loadAgentAcpOperations,
		"session.providerReview.compare": loadAgentProviderReviewOperations,
		"session.reaction.set": loadAgentReactionOperations,
		"conversation.delivery.begin": loadConversationDeliveryOperations,
		"conversation.delivery.transition": loadConversationDeliveryOperations,
		"session.pendingInputs.withdraw": loadAgentPendingInputOperations,
		"session.pendingInputs.read": loadAgentPendingInputOperations,
		"session.pendingInputs.mutate": loadAgentPendingInputOperations,
		"session.pendingInputs.interruptHistory": loadAgentPendingInputOperations,
		"session.archivePruning.deletePublished": loadAgentArchivePruningOperations,
		"session.archivePruning.pruneRetention": loadAgentArchivePruningOperations,
		"session.archivePruning.removeLegacy": loadAgentArchivePruningOperations,
		"session.archivePruning.reclaimPages": loadAgentArchivePruningOperations,
		"session.maintenance.prepare": loadMaintenanceOperations,
		"session.maintenance.metadata": loadMaintenanceOperations,
		"session.maintenance.release": loadMaintenanceOperations,
		"usageCache.writeRollup": loadUsageCacheOperations,
		"usageCache.prune": loadUsageCacheOperations,
		"usageCache.acquireLock": loadUsageCacheOperations,
		"usageCache.releaseLock": loadUsageCacheOperations
	});
	const context = {
		open: openWriter,
		options,
		admit,
		writeTransaction,
		writeSharedTransaction(source, write) {
			const retained = expectDefined(shared, "Native binding shared-state owner");
			const sharedIdentity = requireOpenClawStateDatabaseIdentity(retained);
			if (sharedIdentity.key !== source.key || sharedIdentity.canonicalPath !== source.canonicalPath || sharedIdentity.birthtime !== source.birthtime) throw new Error("Native binding settlement changed its captured shared-state owner");
			assertExistingDatabaseIdentity(source.canonicalPath, source.key, source.birthtime);
			return runOpenClawStateWriteTransaction(write, {
				database: retained,
				path: retained.path,
				env: input.environment
			}, { operationLabel: "session.native-binding.settlement" });
		}
	};
	const domain = createAgentDatabaseDomainOwner({
		databasePath: input.databasePath,
		assertCurrent() {
			assertOpen();
			const current = openWriter();
			assertFileIdentity();
			return current.db;
		},
		assertCleanupCurrent() {
			if (!database || !identity || !database.db.isOpen || normalizeDatabasePath(database.db.location() ?? "") !== identity.nativeLocation || getOpenClawAgentDatabaseIfOpen(options) !== database) throw new Error("Agent cleanup lost its retained native database");
			assertFileIdentity();
		},
		admit: (stage, requestAdmission) => admit(stage, void 0, requestAdmission)
	});
	let closed = false;
	const assertOpen = () => {
		if (closed) throw new Error("Agent database execution owner is closed");
	};
	const executeCommand = (command) => {
		if (command.type === "database.domain.bind" || command.type === "database.domain.publish" || command.type === "database.domain.execute" || command.type === "database.domain.close") return domain.execute(command);
		if (command.type === "database.prepareWrite") {
			openWriter();
			return;
		}
		if (command.type === "database.walMaintenance") return openWriter().walMaintenance.maintainPeriodic?.(command.input, admit) ?? { reclaimedPages: 0 };
		return registry.execute(command, context);
	};
	return {
		...createAgentDatabaseExecutionCloser(() => {
			closed = true;
			return {
				database,
				identity,
				releasePreparations: maintenance.getPreparationReleases(),
				closeDomain: () => domain.close(),
				releaseBorrow,
				sharedBorrow
			};
		}),
		prepare(command) {
			if (command.type === "database.domain.bind" || command.type === "database.domain.publish" || command.type === "database.domain.execute" || command.type === "database.domain.close") return domain.prepare(command);
			const preparing = registry.prepare(command.type);
			if (command.type === "session.nativeBindings.delete") return Promise.all([preparing, prepareAgentNativeBindingOperation(command.input, input.environment)]).then(() => {});
			if (command.type === "session.maintenance.prepare" || command.type === "session.maintenance.metadata") return Promise.all([preparing, maintenance.prepare()]).then(() => {});
			if (command.type === "session.entries.replace" && command.input.initializeTranscript) return Promise.all([preparing, prepareAgentTranscript()]).then(() => {});
			return preparing;
		},
		[SQLITE_WORKER_PREPARE_ADMITTED](command) {
			if (command.type !== "database.domain.publish") return;
			publicationStartupJournal = readRequestPreparation();
			startupJournalRequested = publicationStartupJournal;
			try {
				return domain.preparePublication(command.input);
			} finally {
				startupJournalRequested = false;
			}
		},
		[SQLITE_WORKER_OPERATION_CLEANUP](command) {
			if (command.type === "session.maintenance.metadata") maintenance.cleanup(command.input);
			if (command.type === "database.domain.publish") {
				startupJournalRequested = publicationStartupJournal ?? false;
				try {
					domain.cleanupPublication(command.input.id);
				} finally {
					startupJournalRequested = false;
					publicationStartupJournal = void 0;
				}
			}
		},
		assertSettled() {
			if (openingFailure) throw openingFailure.error;
			domain.assertSettled();
			if (shared) {
				assertTransactionUsable(shared.db);
				if (!shared.db.isOpen || shared.db.isTransaction) throw new Error("Agent database command left its shared-state participant unsettled");
			}
			if (database) {
				assertTransactionUsable(database.db);
				if (!identity || !database.db.isOpen || database.db.isTransaction) throw new Error("Agent database command left an unsettled native connection");
			}
		},
		execute(command) {
			assertOpen();
			if (command.type === "database.domain.publish") {
				if (publicationStartupJournal === void 0) throw new Error("Agent publication lost its request-local preparation facts");
				startupJournalRequested = publicationStartupJournal;
			} else startupJournalRequested = readRequestPreparation();
			try {
				return executeCommand(command);
			} finally {
				startupJournalRequested = false;
			}
		}
	};
}
//#endregion
export { createSqliteWorkerBackend, openExistingSqliteWorkerBackend };
