import "../src-Djeo9OvP.mjs";
import { t as expectDefined } from "../expect-lbe3Hgrh.mjs";
import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "../errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "../subsystem-mStysHHC.mjs";
import { c as normalizeDatabasePath, f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "../sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "../sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { s as sqliteReaderDatabasePathKey } from "../sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { t as captureSqliteNativeRuntimeAdmission } from "../node-sqlite-CYaq-2Hb.mjs";
import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "../kysely-sync-9fPQaMlh.mjs";
import { M as withAgentCreationClaimWitness, y as withAgentDeletionWorkerDatabaseCleanup } from "../openclaw-agent-db-resources-DIwq7LM6.mjs";
import { t as SqliteIntegrityError } from "../sqlite-integrity-06TCB-az.mjs";
import { S as retainOpenClawStateDatabase, x as requireOpenClawStateDatabaseIdentity } from "../openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as onSqliteWalCheckpoint } from "../sqlite-wal-checkpoint-CgnAfdqs.mjs";
import { t as assertTransactionUsable } from "../sqlite-transaction-CpDyZPQ0.mjs";
import { a as SQLITE_WORKER_PREPARE_ADMITTED, i as SQLITE_WORKER_OPERATION_CLEANUP, l as SqliteWorkerOpenRefusedError, o as SQLITE_WORKER_PREPARE_COMMAND, t as SQLITE_WORKER_CLOSE_RECEIPT } from "../sqlite-worker-contract-DhDutMia.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission, l as takeSqliteWorkerOperationAdmissionAttachment, u as withSqliteWorkerOperationAdmission } from "../sqlite-worker-operation-admission-puNZKEvP.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "../openclaw-agent-db-identity-CnM2kzVa.mjs";
import { a as readAgentDeletionJournalStatusInDatabase } from "../agent-deletion-journal.read-BzRzPvBo.mjs";
import { g as repairDoctorSqliteIndexCorruption, i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "../openclaw-state-db-BtDOU_3j.mjs";
import { b as mayShareAgentDatabaseFile, d as prepareOpenClawAgentDatabaseWorkerLease, f as readActiveOpenClawAgentDatabaseLeasesReadOnly } from "../openclaw-agent-db-lease-Brvd0WI4.mjs";
import { c as getOpenClawAgentDatabaseValidation } from "../openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { _ as retainAgentDatabase, i as closeOpenClawAgentDatabaseByPath } from "../openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { c as runOpenClawAgentWriteTransaction, i as getOpenClawAgentDatabaseIfOpen, o as openOpenClawAgentDatabase } from "../openclaw-agent-db-_fC-kf1x.mjs";
import { a as refreshOpenClawAgentDatabaseSchema } from "../openclaw-agent-db-schema-BUhCxlqc.mjs";
import { s as verifyOpenClawStateLeaseOwnership } from "../openclaw-state-lease-storage-CoE2b53O.mjs";
import { n as assertOpenClawStateLeaseWorkerOwnedInTransaction } from "../openclaw-state-lease-worker-D3xn0u2j.mjs";
import { t as createWorkerOperationRegistry } from "../worker-operation-registry-DhUe8rTN.mjs";
import { t as isSessionActorCommand } from "../session-actor-command-BBmRamW_.mjs";
import { n as assertAgentDeletionWorkerPredicate } from "../agent-deletion.worker-Bp9lB6Sk.mjs";
import { t as AGENT_FTS_SCHEMAS } from "../openclaw-agent-fts-schema-BEP0rp_S.mjs";
import { MessageChannel, MessagePort, receiveMessageOnPort, threadId } from "node:worker_threads";
import { isPromise } from "node:util/types";
//#region src/state/agent-deletion-cleanup.worker.ts
const log = createSubsystemLogger("state/agent-deletion");
/** Keep lease grants separate from the agent command's commit and publication grants. */
function withLeaseAdmission(guard, run) {
	const { port1, port2 } = new MessageChannel();
	let admission;
	try {
		requestSqliteWorkerOperationAdmission({
			stage: "prepare",
			facts: {
				kind: "agent-deletion-lease",
				guard,
				port: port2
			}
		}, [port2]);
		const received = receiveMessageOnPort(port1)?.message;
		if (!(received instanceof MessagePort)) throw new Error("Agent deletion lost its live lease admission");
		admission = received;
		return run((operation) => withSqliteWorkerOperationAdmission({ port: received }, operation));
	} finally {
		admission?.close();
		port1.close();
		port2.close();
	}
}
/** The executing agent worker holds agent -> shared locks through the actual agent COMMIT. */
function withAgentDeletionWorkerCleanup(guard, target, run) {
	if (guard.lease.scope !== "core:agent-deletion" || guard.lease.key !== guard.predicate.agentId) throw new Error("Agent deletion requires its original target lease");
	const assertSourceCurrent = () => {
		requestSqliteWorkerOperationAdmission({
			stage: "prepare",
			facts: {
				kind: "agent-deletion-current",
				guard
			}
		});
		target.assertFileCurrent();
	};
	const assertLease = (database) => {
		verifyOpenClawStateLeaseOwnership({
			...guard.lease,
			leaseLabel: "agent deletion",
			transaction: database.db
		});
	};
	const assertCurrent = () => {
		assertSourceCurrent();
		const database = target.shared();
		assertAgentDeletionWorkerPredicate(database, guard.predicate);
		assertLease(database);
	};
	return withAgentDeletionWorkerDatabaseCleanup({
		...target,
		ownsDatabase: target.agentId === guard.predicate.agentId,
		assertCurrent,
		assertJournal: (statePath, entries) => {
			if (statePath !== target.statePath) throw new Error(`Agent ${guard.predicate.agentId} deletion no longer owns database cleanup.`);
			assertSourceCurrent();
			const database = target.shared();
			assertAgentDeletionWorkerPredicate(database, guard.predicate, entries.find((entry) => entry.agentId === guard.predicate.agentId) ?? null);
			assertLease(database);
			return guard.predicate.agentId;
		},
		withCommit: (commit) => {
			let committed = false;
			try {
				withLeaseAdmission(guard, (inLeaseAdmission) => runOpenClawStateWriteTransaction((database) => {
					inLeaseAdmission(() => assertOpenClawStateLeaseWorkerOwnedInTransaction(database.db, guard.lease));
					assertAgentDeletionWorkerPredicate(database, guard.predicate);
					inLeaseAdmission(() => assertOpenClawStateLeaseWorkerOwnedInTransaction(database.db, guard.lease, "write", "commit"));
					assertSourceCurrent();
					assertLease(database);
					commit();
					committed = true;
				}, {
					database: target.shared(),
					path: target.statePath,
					env: target.env
				}, { operationLabel: "agent.deletion.agent-commit" }));
			} catch (error) {
				if (!committed) throw error;
				try {
					log.warn("Agent deletion committed, but releasing its state guard failed", {
						agentId: guard.predicate.agentId,
						error
					});
				} catch {}
			}
		}
	}, run);
}
//#endregion
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
//#region src/state/openclaw-agent-execution-domain.ts
/** A domain restriction must obtain exactly one grant for the original native stage. */
function requestRestrictedAgentDatabaseAdmission(request, restriction) {
	const { stage } = request;
	let admitted = false;
	const dispatch = (restricted) => {
		if (admitted || restricted.stage !== stage) throw new Error("Agent admission restriction changed its native stage");
		requestSqliteWorkerOperationAdmission(restricted);
		admitted = true;
	};
	if (restriction) restriction(request, dispatch);
	else dispatch(request);
	if (!admitted) throw new Error("Agent admission restriction omitted its native grant");
}
/** One admitted publication scope borrows the canonical connection; it never owns its close. */
function createAgentDatabaseDomainOwner(context) {
	let binding;
	let prepared;
	let failedBinding = false;
	const requireBinding = (id) => {
		if (!binding || binding.id !== id || !binding.authority.active) throw new Error("Agent database operation lost its bound publication scope");
		return binding;
	};
	const bind = (input) => {
		const database = context.assertCurrent();
		if (!prepared || prepared.id !== input.id || binding) throw new Error("Agent publication module was not prepared for this scope");
		const factory = prepared.factory;
		prepared = void 0;
		failedBinding = true;
		const authority = { active: true };
		try {
			const backend = factory(input.input, {
				databasePath: context.databasePath,
				database,
				admit: (stage, requestAdmission) => {
					if (!authority.active) throw new Error("Agent publication cleanup cannot admit a transaction");
					context.admit(stage, requestAdmission);
				}
			});
			if (isPromise(backend)) {
				backend.catch(() => {});
				throw new Error("Connection-bound publication factories must remain synchronous");
			}
			if (!isRecord(backend) || typeof backend.execute !== "function" || typeof backend.close !== "function" || typeof backend.assertSettled !== "function" || SQLITE_WORKER_PREPARE_COMMAND in backend && backend[SQLITE_WORKER_PREPARE_COMMAND] !== void 0 && typeof backend[SQLITE_WORKER_PREPARE_COMMAND] !== "function" || backend.prepare !== void 0 && typeof backend.prepare !== "function") throw new Error("Agent publication module returned an invalid connection-bound backend");
			binding = {
				id: input.id,
				backend,
				authority
			};
			failedBinding = false;
		} catch (error) {
			authority.active = false;
			throw error;
		}
	};
	const prepareCommand = async (input) => {
		const current = requireBinding(input.id);
		const loading = current.backend[SQLITE_WORKER_PREPARE_COMMAND]?.(input.command.type);
		if (loading) await loading;
		await current.backend.prepare?.(input.command);
		if (requireBinding(input.id) !== current) throw new Error("Agent publication changed during command preparation");
	};
	const closeBinding = () => {
		if (!binding) return;
		binding.authority.active = false;
		const closed = binding.backend.close();
		if (closed !== void 0) {
			closed.catch(() => {});
			throw new Error("Connection-bound publication cleanup must remain synchronous");
		}
		binding = void 0;
	};
	return {
		async prepare(command) {
			if (command.type === "database.domain.bind" || command.type === "database.domain.publish") {
				if (binding || prepared) throw new Error("Agent database already has an admitted publication scope");
				const url = new URL(command.input.moduleUrl);
				if (url.protocol !== "file:" || url.search || url.hash) throw new Error("Agent publication requires a static local module URL");
				const module = await import(url.href);
				if (!isRecord(module) || typeof module.bindSqliteWorkerBackend !== "function") throw new Error("Agent publication module must export bindSqliteWorkerBackend");
				const factory = module.bindSqliteWorkerBackend;
				prepared = {
					id: command.input.id,
					factory: (input, bindingContext) => factory(input, bindingContext)
				};
			} else if (command.type === "database.domain.execute") await prepareCommand(command.input);
		},
		async preparePublication(input) {
			bind(input);
			requireBinding(input.id).backend.assertSettled?.();
			await Promise.resolve();
			await prepareCommand(input);
		},
		cleanupPublication(id) {
			if (binding?.id === id) {
				context.assertCleanupCurrent();
				closeBinding();
			}
		},
		execute(command) {
			if (command.type === "database.domain.bind") {
				bind(command.input);
				return;
			}
			context.assertCurrent();
			const current = requireBinding(command.input.id);
			if (command.type === "database.domain.close") {
				closeBinding();
				return;
			}
			return current.backend.execute(command.input.command);
		},
		assertSettled() {
			prepared = void 0;
			if (failedBinding) throw new Error("Agent publication binding did not settle");
			if (binding && !binding.authority.active) throw new Error("Agent publication cleanup did not settle");
			binding?.backend.assertSettled?.();
		},
		close() {
			closeBinding();
			prepared = void 0;
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
				if (preparations.has(input.id)) throw new Error("Session maintenance preparation is already retained");
				if (preparations.size >= 2) throw new Error("Session maintenance preparation capacity is occupied");
				const prepared = kernel.prepareSessionMaintenanceInWorker({
					kind: "maintenance-plan",
					input: input.input,
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
					beforeCommit(database, maintenancePlan) {
						publication = preparePublication({
							pendingArchiveRecovery: false,
							previous,
							current,
							maintenancePlans: [],
							membershipInvalidatedKeys: []
						}, database);
						if (maintenancePlan) publication.maintenancePlans = [maintenancePlan];
						deferSqliteWorkerCommitReceipt(database.db, publication);
						context.admit("commit", publication);
					}
				}, preparation?.prepared);
				return value.kind === "maintenance-plan-stale" ? {
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
		repairStartupIntegrity(receipt, check, error, assertCurrent) {
			if (!(error instanceof SqliteIntegrityError) || !error.findings || check.databaseLabel !== receipt.path) return false;
			requestSqliteWorkerOperationAdmission({
				stage: "prepare",
				facts: { kind: "agent-startup-fts" }
			});
			const state = {
				env: context.databaseOptions.env,
				path: receipt.sharedStatePath
			};
			const changes = runOpenClawStateWriteTransaction(() => {
				assertCurrent();
				const owners = readActiveOpenClawAgentDatabaseLeasesReadOnly(state).filter((owner) => mayShareAgentDatabaseFile(owner.path, receipt.path));
				if (owners.length !== 1 || owners[0]?.lease_id !== receipt.leaseId) throw new Error("Startup FTS repair requires an exclusive live agent database lease");
				return repairDoctorSqliteIndexCorruption(check.database, check.databaseLabel, {
					label: `agent ${context.databaseOptions.agentId}`,
					ftsSchemas: AGENT_FTS_SCHEMAS,
					ftsOnly: true,
					assertCurrent,
					describeRepair(indexes) {
						const db = getNodeSqliteKysely(check.database).withSchema("main");
						const counts = indexes.map((name) => {
							const row = executeSqliteQueryTakeFirstSync(check.database, db.selectFrom(name).select((eb) => eb.fn.countAll().as("n")));
							return `${name}=${String(row?.n)}`;
						});
						return `Rebuilt stale SQLite FTS indexes (agent ${context.databaseOptions.agentId}): ${counts.join(", ")}; SQLite ${captureSqliteNativeRuntimeAdmission()?.version}. No table rows were removed.`;
					}
				});
			}, state);
			requestSqliteWorkerOperationAdmission({
				stage: "prepare",
				facts: {
					kind: "agent-startup-fts",
					message: changes.join(" ")
				}
			});
			return true;
		},
		prepare() {
			return Promise.all([import("../session-accessor.sqlite-maintenance-transaction-BycafGXa.mjs"), import("../session-accessor.sqlite-replacement-state-DwZOb6oS.mjs")]).then(([metadata, replacement]) => {
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
//#region src/trajectory/runtime-retention.contract.ts
function readTrajectoryRuntimeRetentionLease(attachment) {
	if (typeof attachment !== "object" || attachment === null || !("trajectoryRetentionLease" in attachment) || !(attachment.trajectoryRetentionLease instanceof SharedArrayBuffer) || attachment.trajectoryRetentionLease.byteLength !== 4) throw new Error("Trajectory retention lease is unavailable");
	return new Int32Array(attachment.trajectoryRetentionLease);
}
//#endregion
//#region src/state/openclaw-agent-execution-transcript.worker.ts
let transcript;
function prepareAgentTranscript() {
	return Promise.all([
		import("../session-accessor.sqlite-transcript-header-D791F-IB.mjs"),
		import("../session-accessor.sqlite-scope-CGGAwxzb.mjs"),
		import("../session-transcript-authority-U2H_IqtK.mjs")
	]).then(([header, scope, authority]) => {
		transcript = {
			initialize: header.ensureTranscriptHeader,
			assertIdentity: scope.assertSqliteTranscriptWriteIdentity,
			readPublication: authority.readStagedSessionTranscriptAuthority
		};
	});
}
async function loadAgentTranscriptOperations() {
	await prepareAgentTranscript();
	return { "session.transcript.initialize": (input, context) => {
		if (!transcript) throw new Error("Session transcript initialization was not prepared");
		const { initialize, readPublication } = transcript;
		const assertIdentity = transcript.assertIdentity;
		assertIdentity(input);
		return context.writeTransaction("session.entry.create-with-transcript", "Session transcript", (current) => {
			const publication = {
				kind: "session-transcript-initialized",
				sessionKey: input.sessionKey
			};
			initialize(current, {
				agentId: context.options.agentId,
				path: context.options.path,
				...input
			}, input.cwd, { onPlaceholderInserted: ({ sessionId }) => {
				publication.placeholder = { sessionId };
			} });
			publication.transcriptPublication = readPublication(current);
			deferSqliteWorkerCommitReceipt(current.db, publication);
			context.admit("commit", publication);
			return publication;
		});
	} };
}
function initializeReplacementTranscript(current, options, initialization) {
	if (!initialization) return;
	try {
		if (!transcript) throw new Error("Session transcript initialization was not prepared");
		const { initialize } = transcript;
		const assertIdentity = transcript.assertIdentity;
		assertIdentity(initialization);
		initialize(current, {
			agentId: options.agentId,
			path: options.path,
			...initialization
		}, initialization.cwd);
	} catch (error) {
		throw Object.assign(new Error(formatErrorMessage(error), { cause: error }), { name: "SessionTranscriptInitializationError" });
	}
}
async function loadAgentEntryDeletionOperations() {
	const deletion = await import("../session-entry-deletion.worker-CQuCebu9.mjs");
	return {
		"session.lifecycle.deletePlan": deletion.planSessionDeletionInAgentWorker,
		"session.lifecycle.delete": deletion.deleteSessionEntryInAgentWorker
	};
}
//#endregion
//#region src/state/openclaw-agent-execution-operations.ts
async function loadAgentTranscriptReadOperations() {
	const [raw, visible, memory, anchors, cold, fence, identity, reader, scopes, agents, errors, watermark] = await Promise.all([
		import("../session-accessor.sqlite-delta-DwedOiuj.mjs"),
		import("../session-accessor.sqlite-active-events-CL963ovG.mjs"),
		import("../capture.worker-CxC3t63k.mjs"),
		import("../session-transcript-anchor-read.kernel-BYxbiERy.mjs"),
		import("../session-cold-storage-state-BYOtueDs.mjs"),
		import("../session-transcript-read-fence-CgU0nt8y.mjs"),
		import("../sqlite-worker-identity-DHmkARqT.mjs"),
		import("../openclaw-agent-db-readonly-open-BdARscD6.mjs"),
		import("../session-accessor.sqlite-scope-helpers-C1omPVZS.mjs"),
		import("../normalization-core/agent-id.js"),
		import("../session-history-worker-errors-CAXUQRW2.mjs"),
		import("../session-accessor.sqlite-transcript-watermark-C90z9Qkv.mjs")
	]);
	const readResult = (read) => {
		try {
			return {
				ok: true,
				value: read()
			};
		} catch (error) {
			const encoded = errors.encodeSessionTranscriptWorkerError(error);
			if (!encoded) throw error;
			return {
				ok: false,
				error: encoded
			};
		}
	};
	const open = (input, context) => {
		const database = context.open();
		identity.assertExistingDatabaseIdentity(database.path, input.expectedIdentity.key, input.expectedIdentity.birthtime);
		if (input.scope) identity.assertExistingDatabaseIdentity(input.scope.storePath ?? database.path, input.expectedIdentity.key, input.expectedIdentity.birthtime);
		if (input.resolved) {
			if ((input.resolved.databaseAgentId ?? input.resolved.agentId) !== database.agentId) throw new Error("Prepared transcript read belongs to another agent database");
			identity.assertExistingDatabaseIdentity(input.resolved.path ?? database.path, input.expectedIdentity.key, input.expectedIdentity.birthtime);
			if (input.scope) {
				const scope = input.scope;
				if (scope.sessionId !== input.resolved.sessionId || scope.agentId !== void 0 && agents.normalizeAgentId(scope.agentId) !== input.resolved.agentId || scope.sessionKey !== void 0 && scopes.resolveSqliteSessionKey(scope.sessionKey, input.resolved.agentId) !== input.resolved.sessionKey) throw new Error("Prepared transcript read changed its captured session scope");
			}
		}
		return database;
	};
	const snapshot = (input, context, read) => {
		const database = open(input, context);
		return reader.readOpenClawAgentDatabaseSnapshot(database, () => read(database));
	};
	return {
		"session.transcript.watermark.read": (input, context) => readResult(() => {
			open(input, context);
			return watermark.readSessionTranscriptWatermark(input.scope);
		}),
		"session.transcript.rawDelta.read": (input, context) => readResult(() => {
			const result = snapshot(input, context, (database) => fence.runWithSessionTranscriptReadFence(input.admission, () => raw.readTranscriptRawDeltaInDatabase(database, input.resolved, input.limits)));
			return result.found ? result.value : { kind: "missing" };
		}),
		"session.transcript.visibleDelta.read": (input, context) => readResult(() => {
			open(input, context);
			return fence.runWithSessionTranscriptReadFence(input.admission, () => visible.readSessionTranscriptVisibleMessageDeltaCore(input.scope, input.limits, {
				readOnly: true,
				resolvedScope: input.resolved
			}));
		}),
		"session.transcript.memoryCapture.read": (input, context) => readResult(() => {
			open(input, context);
			return fence.runWithSessionTranscriptReadFence(input.admission, () => memory.readSessionMemoryCapture({
				scope: input.scope,
				resolvedScope: input.resolved,
				messageCount: input.messageCount
			}));
		}),
		"session.transcript.anchors.read": (input, context) => readResult(() => {
			const result = snapshot(input, context, (database) => anchors.readSessionTranscriptAnchorFactsInDatabase(database, input.resolved, input.selection));
			return result.found ? result.value : { anchors: [] };
		}),
		"session.transcript.coldMetadata.read": (input, context) => readResult(() => {
			const result = snapshot(input, context, (database) => cold.readSessionColdTranscript(database.db, input.sessionId));
			return result.found ? result.value : void 0;
		})
	};
}
async function loadAgentReplacementOperations() {
	const [kernel, { sealSessionEntryPublicationSource }, nativeBindings, transfers, predicates] = await Promise.all([
		import("../session-accessor.sqlite-replacement-state-DwZOb6oS.mjs"),
		import("../session-entry-publication-source-BipHjQlM.mjs"),
		import("../session-native-binding.worker-BqdyKfOD.mjs"),
		import("../session-entry-patch.worker-Dj-_GGdc.mjs"),
		import("../session-source-predicate.worker-BzKNn-nC.mjs")
	]);
	return { "session.entries.replace": (input, context) => {
		const replace = (current) => {
			const postimages = /* @__PURE__ */ new Map();
			const result = kernel.commitSessionEntryReplacementsInDatabase(current, input, () => {
				if (input.sources?.length) {
					const sourceValidation = predicates.readSessionSourceValidation(current, input.sources);
					context.admit("transaction", {
						kind: "session-entry-replacements-validated",
						sourceValidation
					});
					if (sourceValidation.refusedSource) throw new Error("Session source refusal was not rejected");
				}
				initializeReplacementTranscript(current, context.options, input.initializeTranscript);
			}, void 0, void 0, postimages);
			const publication = kernel.prepareSessionEntryReplacementPublication(result, current, {
				captureFullFacts: true,
				postimages
			});
			const candidate = {
				...result,
				publication
			};
			if (publication.source && publication.fullEntries?.size) sealSessionEntryPublicationSource(publication.source);
			kernel.boundSessionEntryReplacementPublication(publication, candidate);
			return candidate;
		};
		if (input.nativeBindings) return nativeBindings.runSessionNativeBindingTransaction(input.nativeBindings, context, "session.entry-replacements", "Session replacement", (current, wrapReceipt) => {
			const result = replace(current);
			const candidate = {
				kind: "session-entry-replacements",
				result,
				publication: result.publication
			};
			return transfers.transferSessionEntryWorkerCandidate(current, context.admit, candidate, wrapReceipt);
		});
		return context.writeTransaction("session.entry-replacements", "Session replacement", (current) => {
			const candidate = replace(current);
			const publication = candidate.publication;
			deferSqliteWorkerCommitReceipt(current.db, publication);
			context.admit("commit", publication);
			return candidate;
		});
	} };
}
async function loadAgentRestartRecoveryOperations() {
	const kernel = await import("../session-accessor.sqlite-recovery.worker-CFKRL7QH.mjs");
	return { "session.restart.recover": (input, { writeTransaction, admit }) => writeTransaction("session.lifecycle.recover-tombstone", "Session recovery", (current) => {
		const result = kernel.recoverRestartTombstoneInDatabase(current, input);
		deferSqliteWorkerCommitReceipt(current.db, result.publication ?? { kind: "session-restart-recovery-unchanged" });
		admit("commit", result.publication);
		return result;
	}) };
}
async function loadAgentEntryReadOperations() {
	const kernel = await import("../session-entry-read.worker-BuW35d-b.mjs");
	const result = await import("../session-entry-read-result.worker-C2oVKxPO.mjs");
	const cohort = await import("../session-entry-cohort.worker-CyeXJIkj.mjs");
	return {
		"session.entry.readResult": (input, { open }) => result.readSessionEntryResult(input, open()),
		"session.entry.read": (input, { open }) => {
			const database = open();
			return "sessionKeys" in input ? cohort.readSessionEntryCohort(database, input, (request) => kernel.readExactSessionEntriesWithLifecycle(request, database)) : cohort.readSessionEntryDataInDatabase(database, input.sessionKey);
		}
	};
}
async function loadAgentEntryPatchOperations() {
	const kernel = await import("../session-entry-patch.worker-Dj-_GGdc.mjs");
	return {
		"session.entry.patch.prepare": (input, { open }) => kernel.readSessionEntryPatchSnapshot(open(), input),
		"session.entry.patch.commit": kernel.commitSessionEntryPatch
	};
}
async function loadAgentCompoundOperations() {
	const turn = await import("../session-turn.worker-D3452ogr.mjs");
	const reset = await import("../session-reset.worker-DgQYuf4t.mjs");
	const lifecycle = await import("../config/sessions/session-lifecycle-projection.worker.js");
	await (await import("../session-turn-predicate-DvjkiMEN.mjs")).prepareSessionTurnPredicates();
	return {
		"session.turn.prepare": turn.prepareSessionTurn,
		"session.turn.commit": turn.commitSessionTurn,
		"session.lifecycle.reset": reset.commitSessionReset,
		"session.lifecycle.project": lifecycle.commitSessionLifecycleProjection
	};
}
async function loadAgentPurgeOperations() {
	const purge = await import("../session-agent-purge.worker-ByKqfhLx.mjs");
	return {
		"session.agentPurge.prepare": purge.prepareSessionAgentPurge,
		"session.agentPurge.commit": purge.commitSessionAgentPurge
	};
}
async function loadAgentMaintenanceFinalizationOperations() {
	const finalization = await import("../session-maintenance-finalization.worker-BgqypNHA.mjs");
	const maintenanceStore = await import("../session-accessor.sqlite-maintenance-store-MiklS5nj.mjs");
	return {
		"session.maintenance.finalize": finalization.finalizeSessionMaintenance,
		"session.maintenance.size": (input, { open }) => maintenanceStore.readSessionTranscriptJsonlBytesInDatabase(open(), input.sessionIds)
	};
}
async function loadAgentMessageCutOperations() {
	return { "session.messageCut.commit": (await import("../session-message-cut.worker-CVw9djdD.mjs")).commitSessionMessageCut };
}
async function loadAgentNativeBindingOperations() {
	return { "session.nativeBindings.delete": (await import("../session-native-binding.worker-BqdyKfOD.mjs")).deleteSessionWithNativeBindings };
}
async function prepareAgentNativeBindingOperation(input, env) {
	await (await import("../session-native-binding.worker-BqdyKfOD.mjs")).prepareSessionNativeBindingDeletion(input, env);
}
async function loadAgentTrajectoryOperations() {
	const kernel = await import("../runtime-store.sqlite-DVyUR2Ki.mjs");
	const retention = await import("../runtime-retention.sqlite-BIWx0LVH.mjs");
	return {
		"trajectory.events.append": (input, { writeTransaction, admit }) => {
			kernel.appendSqliteTrajectoryRuntimeEventsWithWriter(input, (label, write) => writeTransaction(label, "Trajectory append", (current) => {
				const result = write(current);
				deferSqliteWorkerCommitReceipt(current.db, result.receipt);
				admit("commit");
				return result;
			}));
		},
		"trajectory.retention.begin": (_input, { open }) => {
			return retention.beginTrajectoryRuntimeRetention(open().db, readTrajectoryRuntimeRetentionLease(takeSqliteWorkerOperationAdmissionAttachment()));
		},
		"trajectory.retention.delete": (input, { open, writeTransaction, admit }) => {
			const database = open();
			const batch = retention.selectTrajectoryRuntimeRetentionBatch(database.db, input);
			if (batch.refresh) return retention.deleteTrajectoryRuntimeRetention(database, batch);
			return writeTransaction("trajectory.runtime.retention.delete", "Trajectory retention", (current) => {
				const result = retention.deleteTrajectoryRuntimeRetention(current, batch);
				admit("commit");
				return result;
			});
		}
	};
}
async function loadAgentArchiveOperations() {
	const kernel = await import("../session-accessor.sqlite-archive-store-kernel-gK1kWZBW.mjs");
	return {
		"session.archives.preparePublication": (input, { writeTransaction, admit }) => writeTransaction("session.archive.publish", "Session archive publication", (current) => {
			const result = kernel.prepareSessionTranscriptArchivePublishPlans(current, input);
			admit("commit");
			return result;
		}),
		"session.archives.recordPublication": (input, { writeTransaction, admit }) => writeTransaction("session.archive.publish", "Session archive publication", (current) => {
			const result = kernel.recordSessionTranscriptArchivePublishResults(current, input.results, input.nowMs);
			admit("commit");
			return result;
		})
	};
}
async function loadAgentAcpOperations() {
	const kernel = await import("../session-meta-entry.worker-HdrLNhmc.mjs");
	return { "session.entry.acp": (input, { open, options, admit }) => kernel.mutateAcpSessionEntryInWorker(open(), options, input, admit) };
}
async function loadAgentProviderReviewOperations() {
	const kernel = await import("../provider-review-store.worker-BU4HxKph.mjs");
	return { "session.providerReview.compare": (input, { open, options, admit }) => kernel.compareSessionProviderReviewInWorker(open(), options, input, admit) };
}
async function loadAgentReactionOperations() {
	const kernel = await import("../session-reaction-store.kernel-C1Z0ax9_.mjs");
	return { "session.reaction.set": (input, { writeTransaction, admit }) => writeTransaction("session.reaction.set", "Reaction write", (current) => {
		const result = kernel.setSessionReactionInDatabase(current, input.sessionKey, input.params);
		admit("commit");
		return result;
	}) };
}
async function loadAgentPendingInputOperations() {
	const pending = await import("../session-pending-input-operations.kernel-DHG2vGAD.mjs");
	const kernel = await import("../session-pending-input-withdrawal.worker-B4iysCA5.mjs");
	const history = await import("../session-pending-input-history-reconcile-CCxqETcq.mjs");
	return {
		"session.pendingInputs.read": (input, { open }) => pending.readPendingInput(open(), input),
		"session.pendingInputs.mutate": (input, context) => pending.mutatePendingInput(input, context, deferSqliteWorkerCommitReceipt),
		"session.pendingInputs.interruptHistory": (input, { open, options, admit }) => {
			const database = open();
			return history.interruptPendingInputHistoryInDatabase(database, options, input, admit, (receipt) => deferSqliteWorkerCommitReceipt(database.db, receipt));
		},
		"session.pendingInputs.withdraw": (input, { open, options, admit }) => kernel.discardSessionPendingInputInWorker(open(), options, input, admit)
	};
}
async function loadAgentArchivePruningOperations() {
	const kernel = await import("../session-history-archive-pruning.worker-B9Ahif9p.mjs");
	return {
		"session.archivePruning.pruneRetention": (input, { open, options, admit }) => kernel.pruneSessionArchivesByRetentionInDatabase(open(), options, input, admit),
		"session.archivePruning.deletePublished": (input, { open, options, admit }) => kernel.deletePublishedSessionArchiveInDatabase(open(), options, input, admit),
		"session.archivePruning.removeLegacy": (input, { open, options, admit }) => kernel.removeLegacySessionArchiveInDatabase(open(), options, input.filePath, admit),
		"session.archivePruning.reclaimPages": (input, { open, admit }) => open().walMaintenance.reclaimFreePages({
			maxPages: input.maxPages,
			beforeMutation: () => admit("transaction"),
			onCommit: () => admit("commit")
		})
	};
}
async function loadConversationDeliveryOperations() {
	const kernel = await import("../conversation-delivery-store.kernel-DjsSNlVT.mjs");
	return {
		"conversation.delivery.begin": (input, { writeTransaction, admit }) => writeTransaction("conversation-delivery.begin", "Conversation delivery", (database) => {
			const result = kernel.beginConversationDeliveryInDatabase(database, input);
			admit("commit");
			return result;
		}),
		"conversation.delivery.transition": (input, { writeTransaction, admit }) => writeTransaction(`conversation-delivery.${input.status}`, "Conversation delivery", (database) => {
			const result = kernel.transitionConversationDeliveryInDatabase(database, input);
			admit("commit");
			return result;
		})
	};
}
async function loadConversationRegistryOperations() {
	const { deferConversationWorkerReceipt } = await import("../session-accessor.sqlite-conversation-publication-CvDaW4oq.mjs");
	const { prepareConversationIdentities, upsertConversationIdentities } = await import("../session-accessor.sqlite-conversation-Cbvwr50Z.mjs");
	const { selectConversationRowsFromDatabase, resolveConversationInDatabase } = await import("../session-accessor.sqlite-conversation-read-CxJds8G7.mjs");
	const { readConversationDeliveryInDatabase } = await import("../conversation-delivery-store.kernel-DjsSNlVT.mjs");
	return {
		"conversation.register": (input, { writeTransaction, admit }) => {
			const prepared = prepareConversationIdentities(input.identities);
			return writeTransaction("conversation.register", "Conversation registration", (database) => {
				const publication = upsertConversationIdentities(database, prepared, input.discoveredAt);
				if (publication && typeof publication.source.identity === "string") deferConversationWorkerReceipt(database.db, publication);
				const rows = input.query ? selectConversationRowsFromDatabase(database, input.query) : void 0;
				admit("commit");
				return rows;
			});
		},
		"conversation.authority": (input, { writeTransaction, admit }) => writeTransaction("conversation.authority", "Conversation authority", (database) => {
			const operation = "operationId" in input ? readConversationDeliveryInDatabase(database, input) : void 0;
			const conversationRef = "conversationRef" in input ? input.conversationRef : operation?.conversationRef;
			const facts = {
				operation: operation ? { conversationRef: operation.conversationRef } : void 0,
				conversation: conversationRef ? resolveConversationInDatabase(database, conversationRef) : void 0
			};
			admit("commit", {
				kind: "conversation-authority",
				facts
			});
			return facts;
		})
	};
}
async function loadSessionRowBackfillOperations() {
	const [{ backfillSessionRowTranscriptFieldsInDatabase }, { withSqliteDatabaseWriteScope }] = await Promise.all([import("../session-row-transcript-backfill.worker-DxZxFCir.mjs"), import("../sqlite-database-admission-BjnBrKZT.mjs")]);
	return { "session.rowTranscript.backfill": (input, { writeTransaction, admit }) => writeTransaction("session.rowTranscript.backfill", "Session row backfill", (database) => {
		const fields = withSqliteDatabaseWriteScope(database.db, [], () => backfillSessionRowTranscriptFieldsInDatabase(database, input));
		admit("commit");
		return fields;
	}) };
}
async function loadUsageCacheOperations() {
	const [{ pruneSessionCostUsageRollupsInDatabase, writeSessionCostUsageRollupInDatabase }, { withSqliteDatabaseWriteScope }] = await Promise.all([import("../session-cost-usage-cache.kernel-B6IdXEyg.mjs"), import("../sqlite-database-admission-BjnBrKZT.mjs")]);
	return {
		"usageCache.writeRollup": (input, { writeTransaction, admit }) => writeTransaction("session-cost-usage.rollup.write", "Usage cache", ({ db }) => {
			const result = withSqliteDatabaseWriteScope(db, [], () => writeSessionCostUsageRollupInDatabase(db, input));
			admit("commit");
			return result;
		}),
		"usageCache.prune": (input, { writeTransaction, admit }) => writeTransaction("session-cost-usage.rollup.prune", "Usage cache", ({ db }) => {
			withSqliteDatabaseWriteScope(db, [], () => pruneSessionCostUsageRollupsInDatabase(db, input));
			admit("commit");
		})
	};
}
//#endregion
//#region src/state/openclaw-agent-execution-preparation.ts
function readAgentDatabaseRequestPreparation() {
	const attachment = takeSqliteWorkerOperationAdmissionAttachment();
	if (!isRecord(attachment) || attachment.kind !== "agent-execution" || typeof attachment.startupJournal !== "boolean") throw new Error("Agent execution requires its request-local preparation facts");
	return {
		startupJournal: attachment.startupJournal,
		deletion: attachment.deletion
	};
}
//#endregion
//#region src/state/openclaw-agent-execution-voice-operations.ts
async function loadAgentVoiceSessionOperations() {
	const { readSessionSourceValidation } = await import("../session-source-predicate.worker-BzKNn-nC.mjs");
	const kernel = await import("../client-voice-session-write.kernel-C9dcAcrK.mjs");
	const store = await import("../client-voice-session-store-DocFJdpd.mjs");
	const entries = await import("../session-accessor.sqlite-entry-read-CMqjw2O9.mjs");
	const keys = await import("../session-accessor.sqlite-scope-helpers-C1omPVZS.mjs");
	const canonical = await import("../session-canonical-key-dylvEyT1.mjs");
	const { isIncognitoSessionKey } = await import("../incognito-session-key-B6L73Spz.mjs");
	const { readSessionPendingInputAuthorityFactsInTransaction } = await import("../session-pending-input-authority.kernel-CyS0w3sm.mjs");
	return {
		"voice.session.read": (input, { open }) => {
			const database = open();
			const record = store.readVoiceSessionRecordInTransaction(database, input.voiceSessionId);
			let entry;
			if (record && record.effects.length > 0 && !record.digestDeliveredAt && !isIncognitoSessionKey(record.sessionKey)) {
				canonical.assertCanonicalSqliteSessionKeysCurrent(database);
				const key = keys.resolveSqliteSessionKey(record.sessionKey, database.agentId);
				entry = entries.prepareExactSessionEntryRowReads(database, [key], "delivery", "canonical")(key)?.entry;
			}
			return {
				record,
				entry
			};
		},
		"voice.session.mutate": (input, { writeTransaction, admit }) => writeTransaction(`voice.session.${input.kind}`, "Voice session", (database) => {
			const sourceFacts = input.transactionSource ? readSessionPendingInputAuthorityFactsInTransaction(database, input.transactionSource.sessionKey, input.transactionSource.agentId) : void 0;
			const sourceValidation = readSessionSourceValidation(database, input.sources);
			if (sourceFacts || input.sources?.length) admit("transaction", {
				kind: "voice-session-authority",
				facts: sourceFacts,
				sourceValidation
			});
			if (sourceValidation.refusedSource) throw new Error("Voice session source refusal was not rejected");
			const entry = input.kind === "reserve" && input.transcriptSessionKey ? entries.readSessionEntryIdentity(database, keys.resolveSqliteSessionKey(input.transcriptSessionKey, database.agentId)) : void 0;
			if (input.kind === "reserve" && input.transcriptSessionKey && !entry?.sessionId) throw new Error(`agent session not found (${input.sessionKey})`);
			const result = {
				record: kernel.mutateVoiceSessionInDatabase(database, input),
				entry
			};
			deferSqliteWorkerCommitReceipt(database.db, result);
			admit("commit", sourceFacts ? {
				kind: "voice-session-authority",
				facts: sourceFacts
			} : void 0);
			return result;
		})
	};
}
//#endregion
//#region src/state/openclaw-agent-execution.worker.ts
function createSqliteWorkerBackend(input, opening) {
	const backend = openAgentDatabaseBackend(input, opening, true);
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
function openAgentDatabaseBackend(input, opening, preparingCreation = false) {
	if (opening.databasePath !== input.databasePath) throw new Error("Agent database open does not match its captured execution owner");
	let nativeOpenStarted = false;
	const admitOpen = () => {
		try {
			requestSqliteWorkerOperationAdmission({
				stage: "open",
				facts: input
			});
		} catch (error) {
			if (nativeOpenStarted) throw error;
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
		try {
			if (!database && input.expectedIdentity) assertExistingDatabaseIdentity(input.databasePath, `file:${input.expectedIdentity.physicalIdentity}`, input.expectedIdentity.birthtime);
			const pathOnly = admittedFileIdentity.startsWith("path:");
			if (!database && (pathOnly || input.creatingIdentity)) {
				const current = readDatabasePathIdentitySync(input.databasePath);
				if (pathOnly && current.key !== admittedFileIdentity || input.creatingIdentity && current.canonicalPath !== input.creatingIdentity.canonicalPath) throw new Error("Agent database target changed before creating open");
			}
			if (!pathOnly) assertExistingDatabaseIdentity(input.databasePath, admittedFileIdentity, admittedFileBirthtime);
		} catch (error) {
			if (preparingCreation && !database) throw new SqliteWorkerOpenRefusedError(error);
			throw error;
		}
	};
	let database;
	let shared;
	let sharedBorrow;
	let releaseBorrow;
	let identity;
	let openingFailure;
	let startupJournalRequested = false;
	let publicationPreparation;
	const openShared = () => {
		if (!shared) {
			shared = openOpenClawStateDatabase({
				path: input.stateDatabasePath,
				env: input.environment,
				initializationAgentPaths: [input.databasePath]
			});
			sharedBorrow = retainOpenClawStateDatabase(shared);
		}
		return shared;
	};
	const withPreparation = (preparation, run) => {
		startupJournalRequested = preparation.startupJournal;
		try {
			return preparation.deletion ? withAgentDeletionWorkerCleanup(preparation.deletion, {
				agentId: input.agentId,
				path: input.databasePath,
				statePath: input.stateDatabasePath,
				env: input.environment,
				shared: openShared,
				assertFileCurrent: assertFileIdentity
			}, run) : run();
		} finally {
			startupJournalRequested = false;
		}
	};
	const readDeletionJournal = () => readAgentDeletionJournalStatusInDatabase(expectDefined(shared, "Agent execution shared-state owner").db, input.agentId) !== "absent";
	const openClaimedWriter = (refreshSchema = false) => {
		let validation;
		if (!database) {
			admitOpen();
			assertFileIdentity();
			const sharedDatabase = openShared();
			const lease = prepareOpenClawAgentDatabaseWorkerLease(options, sharedDatabase, input.leaseId);
			const { port1, port2 } = new MessageChannel();
			try {
				requestSqliteWorkerOperationAdmission({
					stage: "prepare",
					facts: {
						kind: "shared-owner",
						identity: requireOpenClawStateDatabaseIdentity(sharedDatabase),
						lease: lease.receipt,
						validationPort: port2
					}
				}, [port2]);
				const preparation = receiveMessageOnPort(port1)?.message;
				lease.validation = preparation.validation;
				lease.integrityRevoked = preparation.integrityRevoked;
				lease.startupRepair = startupJournalRequested ? maintenance.repairStartupIntegrity.bind(void 0, lease.receipt) : void 0;
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
				nativeOpenStarted = true;
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
				if (!(error instanceof SqliteWorkerOpenRefusedError)) openingFailure = { error };
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
		if (refreshSchema) validation = refreshOpenClawAgentDatabaseSchema(database, admitOpen);
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
	const openWriter = (refreshSchema = false) => input.creationClaim ? withAgentCreationClaimWitness(input.creationClaim, admitOpen, () => openClaimedWriter(refreshSchema)) : openClaimedWriter(refreshSchema);
	const admit = (stage, publication, requestAdmission) => {
		requestRestrictedAgentDatabaseAdmission({
			stage,
			facts: {
				identity,
				...startupJournalRequested ? { agentDeletionJournalPresent: readDeletionJournal() } : {},
				...publication ? { publication } : {}
			}
		}, requestAdmission);
	};
	const writeTransaction = (operationLabel, owner, write, diagnosticContext) => {
		const opened = openWriter();
		return runOpenClawAgentWriteTransaction((current) => {
			if (current.db !== opened.db) throw new Error(`${owner} lost its canonical database owner`);
			admit("transaction");
			return write(current);
		}, options, {
			operationLabel,
			diagnosticContext
		});
	};
	const maintenance = createAgentDatabaseMaintenanceOwner({
		databaseOptions: options,
		openWriter,
		admit
	});
	const loadMaintenanceOperations = async () => maintenance.operations;
	const registry = createWorkerOperationRegistry({
		"session.entry.read": loadAgentEntryReadOperations,
		"session.entry.readResult": loadAgentEntryReadOperations,
		"voice.session.read": loadAgentVoiceSessionOperations,
		"voice.session.mutate": loadAgentVoiceSessionOperations,
		"session.entry.patch.prepare": loadAgentEntryPatchOperations,
		"session.entry.patch.commit": loadAgentEntryPatchOperations,
		"session.turn.prepare": loadAgentCompoundOperations,
		"session.turn.commit": loadAgentCompoundOperations,
		"session.lifecycle.reset": loadAgentCompoundOperations,
		"session.lifecycle.project": loadAgentCompoundOperations,
		"session.lifecycle.deletePlan": loadAgentEntryDeletionOperations,
		"session.lifecycle.delete": loadAgentEntryDeletionOperations,
		"session.agentPurge.prepare": loadAgentPurgeOperations,
		"session.agentPurge.commit": loadAgentPurgeOperations,
		"session.maintenance.finalize": loadAgentMaintenanceFinalizationOperations,
		"session.maintenance.size": loadAgentMaintenanceFinalizationOperations,
		"session.nativeBindings.delete": loadAgentNativeBindingOperations,
		"session.messageCut.commit": loadAgentMessageCutOperations,
		"trajectory.events.append": loadAgentTrajectoryOperations,
		"trajectory.retention.begin": loadAgentTrajectoryOperations,
		"trajectory.retention.delete": loadAgentTrajectoryOperations,
		"session.archives.preparePublication": loadAgentArchiveOperations,
		"session.archives.recordPublication": loadAgentArchiveOperations,
		"session.transcript.initialize": loadAgentTranscriptOperations,
		"session.transcript.rawDelta.read": loadAgentTranscriptReadOperations,
		"session.transcript.watermark.read": loadAgentTranscriptReadOperations,
		"session.transcript.visibleDelta.read": loadAgentTranscriptReadOperations,
		"session.transcript.memoryCapture.read": loadAgentTranscriptReadOperations,
		"session.transcript.anchors.read": loadAgentTranscriptReadOperations,
		"session.transcript.coldMetadata.read": loadAgentTranscriptReadOperations,
		"session.entries.replace": loadAgentReplacementOperations,
		"session.restart.recover": loadAgentRestartRecoveryOperations,
		"session.entry.acp": loadAgentAcpOperations,
		"session.providerReview.compare": loadAgentProviderReviewOperations,
		"session.reaction.set": loadAgentReactionOperations,
		"conversation.delivery.begin": loadConversationDeliveryOperations,
		"conversation.register": loadConversationRegistryOperations,
		"conversation.authority": loadConversationRegistryOperations,
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
		"session.rowTranscript.backfill": loadSessionRowBackfillOperations
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
			return openWriter().db;
		},
		assertCleanupCurrent() {
			if (!database || !identity || !database.db.isOpen || normalizeDatabasePath(database.db.location() ?? "") !== identity.nativeLocation || getOpenClawAgentDatabaseIfOpen(options) !== database) throw new Error("Agent cleanup lost its retained native database");
		},
		admit: (stage, requestAdmission) => admit(stage, void 0, requestAdmission)
	});
	let actor;
	let closed = false;
	const assertOpen = () => {
		if (closed) throw new Error("Agent database execution owner is closed");
	};
	const executeCommand = (command) => {
		if (isSessionActorCommand(command)) return expectDefined(actor, "Session actor command was not prepared").execute(command);
		if (command.type === "database.domain.bind" || command.type === "database.domain.publish" || command.type === "database.domain.execute" || command.type === "database.domain.close") return domain.execute(command);
		if (command.type === "database.prepareWrite") {
			openWriter(true);
			return;
		}
		if (command.type === "database.walMaintenance") return openWriter().walMaintenance.maintainPeriodic?.(command.input, admit) ?? { reclaimedPages: 0 };
		return registry.execute(command, context);
	};
	return {
		...createAgentDatabaseExecutionCloser(() => {
			closed = true;
			actor?.close();
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
			if (isSessionActorCommand(command)) return import("../session-actor.worker-bN5VUQKZ.mjs").then(async ({ createSessionActorWorker }) => {
				actor ??= createSessionActorWorker(context, () => {
					const current = expectDefined(identity, "Session actor requires a physical owner");
					return {
						kind: "file",
						physicalIdentity: current.physicalIdentity,
						birthtime: current.birthtime,
						nativeLocation: current.nativeLocation
					};
				});
				await actor.prepare(command);
			});
			if (command.type === "database.domain.bind" || command.type === "database.domain.publish" || command.type === "database.domain.execute" || command.type === "database.domain.close") return domain.prepare(command);
			const preparing = registry.prepare(command.type);
			if (command.type === "session.turn.commit" && command.input.options.voiceTranscript) return Promise.all([preparing, import("../session-turn.worker-D3452ogr.mjs").then((turn) => turn.prepareVoiceTranscriptCommit())]).then(() => {});
			const nativeBindings = command.type === "session.nativeBindings.delete" ? command.input : command.type === "session.messageCut.commit" || command.type === "session.lifecycle.delete" ? command.input.nativeBindings : command.type === "session.entries.replace" || command.type === "session.agentPurge.commit" || command.type === "session.maintenance.finalize" ? command.input.nativeBindings : void 0;
			if (nativeBindings) return Promise.all([
				preparing,
				prepareAgentNativeBindingOperation(nativeBindings, input.environment),
				command.type === "session.entries.replace" && command.input.initializeTranscript ? prepareAgentTranscript() : void 0
			]).then(() => {});
			if (command.type === "session.maintenance.prepare" || command.type === "session.maintenance.metadata") return Promise.all([preparing, maintenance.prepare()]).then(() => {});
			if (command.type === "session.entries.replace" && command.input.initializeTranscript) return Promise.all([preparing, prepareAgentTranscript()]).then(() => {});
			return preparing;
		},
		[SQLITE_WORKER_PREPARE_ADMITTED](command) {
			if (command.type !== "database.domain.publish") return;
			publicationPreparation = readAgentDatabaseRequestPreparation();
			return withPreparation(publicationPreparation, () => domain.preparePublication(command.input));
		},
		[SQLITE_WORKER_OPERATION_CLEANUP](command) {
			if (command.type === "session.maintenance.metadata") maintenance.cleanup(command.input);
			if (command.type === "database.domain.publish") try {
				withPreparation(publicationPreparation ?? { startupJournal: false }, () => domain.cleanupPublication(command.input.id));
			} finally {
				publicationPreparation = void 0;
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
			assertFileIdentity();
			if (command.type === "database.domain.publish") {
				if (publicationPreparation === void 0) throw new Error("Agent publication lost its request-local preparation facts");
				return withPreparation(publicationPreparation, () => executeCommand(command));
			}
			return withPreparation(readAgentDatabaseRequestPreparation(), () => executeCommand(command));
		}
	};
}
//#endregion
export { createSqliteWorkerBackend, openExistingSqliteWorkerBackend };
