import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as createSqliteWorkerTransferCollector } from "./sqlite-worker-transfer-BHUd6Qxu.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { t as memorySessionActorOwners, wt as createSessionActorWithExecutor } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { A as projectSessionSharingEntry, s as publishRetainedSessionEntryChange } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { o as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { t as createSessionActorReplica } from "./session-actor-replica-D_j2y4I5.mjs";
import { n as publishCommittedSessionTranscriptReceipts } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { n as retainSessionEntryWorkerPublication, s as captureSessionEntryMaintenanceAgeChange, u as publishSessionEntryMaintenanceAgeChanges } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { a as withSessionEntryWorker } from "./session-accessor.sqlite-replacement-worker-BpIicMPG.mjs";
import { r as parseSessionEntryMetadataReceipts } from "./session-entry-metadata-receipt-Cz-lTw0a.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-actor-read-error.ts
/** A read lost publication to newer state; no actor command was accepted. */
var SessionActorReadInvalidatedError = class extends Error {
	constructor() {
		super("Session actor changed before its read could publish");
		this.name = "SessionActorReadInvalidatedError";
	}
};
//#endregion
//#region src/config/sessions/session-actor-sqlite.ts
const executePhase = {
	acceptInput: (scope, input) => scope.execute({
		type: "session.actor.acceptInput",
		input
	}),
	adoptRun: (scope, input) => scope.execute({
		type: "session.actor.adoptRun",
		input
	}),
	appendToolResult: (scope, input) => scope.execute({
		type: "session.actor.appendToolResult",
		input
	}),
	appendTranscriptEvent: (scope, input) => scope.execute({
		type: "session.actor.appendTranscriptEvent",
		input
	}),
	completeTurn: (scope, input) => scope.execute({
		type: "session.actor.completeTurn",
		input
	}),
	deliveryPending: (scope, input) => scope.execute({
		type: "session.actor.deliveryPending",
		input
	}),
	deliverySettled: (scope, input) => scope.execute({
		type: "session.actor.deliverySettled",
		input
	}),
	patch: (scope, input) => scope.execute({
		type: "session.actor.patch",
		input
	})
};
function errorFacts(error) {
	return error instanceof Error ? {
		name: error.name,
		message: error.message
	} : {
		name: "Error",
		message: "Session actor operation failed"
	};
}
/** SQLite admission and settlement stay with the durable transport. */
function createSqliteSessionActorExecutor(params) {
	const { target } = params;
	let fenced = false;
	const authorize = (authority, observe) => {
		let actorAdmissionSeen = false;
		return (request, native, grant) => {
			params.assertAccepted();
			authority.assertCurrent();
			let beforeRelease;
			const facts = isRecord(request.facts) && request.facts.kind !== "session-actor-admission" && Object.hasOwn(request.facts, "publication") ? request.facts.publication : request.facts;
			if (isRecord(facts) && facts.kind === "session-actor-admission") {
				actorAdmissionSeen = true;
				if (request.stage !== "transaction" && request.stage !== "commit" || !isRecord(facts.snapshot) || !isDeepStrictEqual(facts.snapshot.target, target)) throw new Error("Session actor admission belongs to another target");
				const snapshot = facts.snapshot;
				const publication = facts.publication;
				beforeRelease = observe?.(native, publication, request.stage, snapshot, facts.entryPublication);
				authority.authorize(request.stage, snapshot, isRecord(publication) && publication.kind === "session-actor-outcome" ? publication.publication : publication);
			} else if (actorAdmissionSeen && (request.stage === "commit" || request.stage === "transaction" && facts !== void 0)) throw new Error("Session actor command omitted its admission evidence");
			authority.assertCurrent();
			params.assertAccepted();
			if (!grant(beforeRelease)) throw new Error("Session actor authority expired");
		};
	};
	const read = async (authority) => {
		for (let attempt = 0;; attempt += 1) try {
			return await params.transport.run(async (scope) => {
				params.assertReadable();
				authority.assertCurrent();
				let snapshot = params.replica.read();
				if (!snapshot) {
					const install = params.replica.beginRead();
					snapshot = await scope.execute({
						type: "session.actor.read",
						input: { target }
					});
					install(snapshot);
					snapshot = params.replica.read();
				}
				if (!snapshot) throw new SessionActorReadInvalidatedError();
				fenced = false;
				params.assertReadable();
				authority.assertCurrent();
				authority.authorize("commit", snapshot);
				authority.assertCurrent();
				params.assertReadable();
				return snapshot;
			}, authorize(authority));
		} catch (error) {
			if (attempt > 0 || !(error instanceof SessionActorReadInvalidatedError)) throw error;
		}
	};
	const command = async (name, input, authority, observer) => {
		const captured = input;
		let native;
		let previousEntry;
		let capturedPreviousEntry = false;
		let running;
		let committed;
		let candidate;
		let entryPublicationSettled = false;
		let entryPublication;
		const transfer = createSqliteWorkerTransferCollector("outcome", (value) => {
			if (candidate !== void 0) throw new Error("Session actor transferred more than one outcome");
			candidate = value;
		});
		const unknown = (error) => {
			if (target.database.kind === "file" && !entryPublication) publishRetainedSessionEntryChange(target.database.physicalIdentity, target.sessionKey, void 0, previousEntry, false);
			return {
				kind: "unknown",
				target,
				commandId: captured.commandId,
				error: errorFacts(error)
			};
		};
		const preserveFailure = (error, origin) => {
			if (!committed) return unknown(error);
			const failure = {
				...errorFacts(error),
				...origin ? { origin } : {}
			};
			committed = {
				...committed,
				failure: committed.failure ? {
					name: "AggregateError",
					message: `${committed.failure.message}; ${failure.message}`
				} : failure
			};
			return committed;
		};
		let outcome;
		try {
			outcome = await params.transport.run((scope) => {
				running = (async () => {
					if (fenced) return unknown(/* @__PURE__ */ new Error("Session actor requires reconciliation before another command"));
					const pending = params.replica.beginCommand();
					const reply = await executePhase[name](scope, {
						...captured,
						target
					}).then((value) => ({
						ok: true,
						value
					}), (error) => ({
						ok: false,
						error
					}));
					let result;
					if (native) {
						const settled = await native.retained.settled;
						const witness = native.admission.committed?.facts;
						const evidence = isRecord(witness) && witness.kind === "session-actor-committed-transfer" ? transfer.completed && witness.transferId === transfer.id ? candidate : void 0 : witness;
						const receipt = isRecord(evidence) ? evidence.receipt : void 0;
						if (isRecord(evidence) && evidence.kind === "committed" && isRecord(receipt) && receipt.kind === "session-actor-committed" && receipt.commandId === captured.commandId && receipt.phaseId === captured.phaseId && receipt.phase === name) {
							committed = evidence;
							if (!reply.ok) preserveFailure(reply.error, "response");
							else if (reply.value.kind === "committed" && reply.value.failure) committed = {
								...committed,
								failure: reply.value.failure
							};
							result = committed;
							try {
								if (target.database.kind === "file") {
									const entry = committed.receipt.postimage.entry;
									if (!entryPublication) publishRetainedSessionEntryChange(target.database.physicalIdentity, target.sessionKey, entry ? projectSessionSharingEntry(entry) : void 0, previousEntry, true, entry);
									if (entry && (previousEntry || !entryPublication)) {
										const change = captureSessionEntryMaintenanceAgeChange({
											sessionKey: target.sessionKey,
											entry,
											previousEntry
										});
										if (!isDeepStrictEqual(change.entry, change.previousEntry)) publishSessionEntryMaintenanceAgeChanges(target.database.physicalIdentity, [change]);
									}
								}
								if (entryPublication && target.database.kind === "file") {
									const databaseIdentity = target.database.physicalIdentity;
									const { facts, owner } = entryPublication;
									owner.settleMetadata(facts.receipts, [], (previous, current) => publishCommittedSessionIdentity(facts.agentId, databaseIdentity, previous, current));
									entryPublicationSettled = true;
								}
								publishCommittedSessionTranscriptReceipts(committed.receipt.transcript.authorityReceipts);
								observer?.committed(committed);
							} catch (error) {
								result = preserveFailure(error);
							}
						} else if (witness === void 0 && reply.ok && (reply.value.kind === "rolled-back" || reply.value.kind === "stale-version") && (settled.kind === "not-entered" || native.admission.settlement?.kind === "completed")) {
							const failure = native.admission.failure;
							result = native.admission.failureSource === "protocol" || hasSqliteWorkerOutcomeUnknown(failure) ? unknown(failure) : failure === void 0 ? reply.value : {
								kind: "rolled-back",
								error: errorFacts(failure)
							};
						} else result = unknown(reply.ok ? /* @__PURE__ */ new Error("Unconfirmed actor settlement") : reply.error);
					} else if (reply.ok && reply.value.kind === "rolled-back") result = reply.value;
					else result = unknown(reply.ok ? /* @__PURE__ */ new Error("Actor command omitted native settlement") : reply.error);
					if (entryPublication && !entryPublicationSettled) {
						entryPublication.owner.settle(void 0, result.kind === "unknown" || result.kind === "committed");
						entryPublicationSettled = true;
					}
					if (result.kind === "unknown") fenced = true;
					if (result.kind === "stale-version") try {
						authority.assertCurrent();
						authority.authorize("commit", result.postimage);
						authority.assertCurrent();
						params.assertAccepted();
					} catch (error) {
						result = {
							kind: "rolled-back",
							error: errorFacts(error)
						};
					}
					try {
						if (!pending.settle(result)) params.replica.invalidate();
						if (!native) params.replica.invalidate();
					} catch (error) {
						params.replica.invalidate();
						result = preserveFailure(error);
					}
					return result;
				})();
				return running;
			}, authorize(authority, (admission, publication, stage, snapshot, entryFacts) => {
				native = admission;
				if (stage === "transaction" && !capturedPreviousEntry) {
					previousEntry = snapshot.entry;
					capturedPreviousEntry = true;
				}
				if (isRecord(publication) && publication.kind === "session-actor-outcome") transfer.accept(publication.transfer);
				if (stage === "commit" && entryFacts !== void 0) {
					const databaseIdentity = target.database.kind === "file" ? target.database.physicalIdentity : void 0;
					const receipts = isRecord(entryFacts) ? parseSessionEntryMetadataReceipts(entryFacts.receipts) : void 0;
					if (!isRecord(entryFacts) || typeof entryFacts.agentId !== "string" || typeof entryFacts.storePath !== "string" || !receipts || databaseIdentity === void 0 || receipts.some((receipt) => receipt.source.identity !== databaseIdentity)) throw new Error("Session actor omitted its entry publication receipt");
					const facts = {
						agentId: entryFacts.agentId,
						storePath: entryFacts.storePath,
						receipts
					};
					return () => {
						const owner = retainSessionEntryWorkerPublication({
							...facts,
							databaseIdentity
						});
						entryPublication = {
							facts,
							owner
						};
						owner.begin(receipts.flatMap((receipt) => [...receipt.facts.keys()]), receipts.flatMap((receipt) => [...receipt.facts].flatMap(([key, fact]) => fact.kind === "postimage" && fact.value.facts.clearMembers ? [key] : [])), receipts.flatMap((receipt) => [...receipt.facts].flatMap(([key, fact]) => fact.kind === "postimage" && fact.value.sharingChange === "unchanged" ? [key] : [])), receipts.flatMap((receipt) => [...receipt.facts].flatMap(([key, fact]) => fact.kind === "postimage" && !fact.value.facts.lifecycleChanged ? [key] : [])), void 0, new Map(receipts.flatMap((receipt) => [...receipt.facts].flatMap(([key, fact]) => fact.kind === "postimage" ? [[key, fact.value.entry]] : []))));
					};
				}
			}));
		} catch (error) {
			if (running) try {
				outcome = await running;
				if (outcome.kind === "committed") outcome = preserveFailure(error);
			} catch (settlementError) {
				if (native) await native.retained.settled;
				outcome = preserveFailure(settlementError);
			}
			else outcome = hasSqliteWorkerOutcomeUnknown(error) ? unknown(error) : {
				kind: "rolled-back",
				error: errorFacts(error)
			};
			params.replica.invalidate();
		}
		if (entryPublication && !entryPublicationSettled) entryPublication.owner.settle(void 0, outcome.kind === "unknown" || outcome.kind === "committed");
		if (outcome.kind === "committed" && params.transport.afterCommitted) try {
			const prepared = await params.transport.afterCommitted(outcome);
			if (prepared) {
				committed = {
					...outcome,
					value: prepared.value
				};
				outcome = committed;
			}
		} catch (error) {
			outcome = preserveFailure(error);
		}
		if (outcome.kind === "unknown") {
			fenced = true;
			params.replica.invalidate();
		}
		return outcome;
	};
	const snapshot = (authority) => {
		params.assertReadable();
		authority.assertCurrent();
		const installed = fenced ? void 0 : params.replica.read();
		if (installed) {
			authority.authorize("commit", installed);
			authority.assertCurrent();
			params.assertReadable();
		}
		return installed;
	};
	return {
		snapshot,
		read,
		command,
		retain: params.transport.retain?.bind(params.transport),
		async release() {
			params.replica.close();
			await params.transport.release();
		}
	};
}
//#endregion
//#region src/config/sessions/session-actor.ts
/** The durable transport uses the same lifetime and phase owner as the memory backend. */
function createSessionActor(params) {
	return createSessionActorWithExecutor({
		target: params.target,
		lifetime: params.lifetime,
		createExecutor: (guards) => createSqliteSessionActorExecutor({
			...params,
			...guards
		})
	});
}
//#endregion
//#region src/config/sessions/session-actor-durable.ts
/** Capture once; every command borrows the existing physical writer admission. */
function captureDurableSessionActor(params) {
	const database = {
		...params.database,
		env: Object.freeze({ ...params.database.env ?? process.env })
	};
	const execution = captureOpenClawAgentDatabaseExecution(database, { expectedIdentity: params.target.database });
	const lifetime = {
		assertAdmission: () => params.lifetime.assertAdmission?.(),
		assertCurrent: () => {
			params.lifetime.assertCurrent();
			execution.assertCurrent();
		},
		assertReadable: () => {
			params.lifetime.assertReadable();
			execution.assertCurrent();
		}
	};
	return createSessionActor({
		target: params.target,
		lifetime,
		replica: createSessionActorReplica({
			target: params.target,
			lifetime,
			currentGeneration() {
				return execution.capturePreparedGenerationClaim()?.incarnation;
			}
		}),
		transport: {
			run: (operation, authorize) => withSessionEntryWorker(database, execution.fileIdentity?.physicalIdentity, lifetime.assertCurrent, async (_execution, source) => {
				await execution.prepare(source);
				return operation({ async execute(command) {
					const result = await execution.runExisting(source, (worker) => worker.execute(command));
					if (result === void 0) throw new Error("Session actor database disappeared");
					return result;
				} });
			}, void 0, execution, void 0, void 0, void 0, (admission, retained, request, grant) => {
				authorize(request, {
					admission,
					retained
				}, grant);
				return true;
			}),
			release: () => execution.release()
		}
	});
}
/** One actor contract selects either its durable worker or memory owner at acquisition. */
function createSessionActorFactory(database) {
	const captured = {
		...database,
		env: Object.freeze({ ...database.env ?? process.env })
	};
	return { async acquire(requestedTarget, lifetime) {
		lifetime.assertAdmission?.();
		lifetime.assertCurrent();
		if (requestedTarget.database.kind === "memory") {
			const owner = memorySessionActorOwners.get(captured);
			return owner.acquire({
				sessionKey: requestedTarget.sessionKey,
				database: "handle" in requestedTarget.database ? requestedTarget.database : owner.identity
			}, lifetime);
		}
		const target = {
			sessionKey: requestedTarget.sessionKey,
			database: structuredClone(requestedTarget.database)
		};
		return captureDurableSessionActor({
			database: captured,
			target: {
				sessionKey: target.sessionKey,
				database: target.database
			},
			lifetime
		});
	} };
}
//#endregion
export { createSessionActorFactory as n, captureDurableSessionActor as t };
