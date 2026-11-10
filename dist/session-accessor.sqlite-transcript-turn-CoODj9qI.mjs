import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { m as SessionPendingInputCustodyError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { r as SqliteTranscriptMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { c as SqliteWorkerError, p as retainSqliteWorkerErrorCode } from "./sqlite-worker-contract-DhDutMia.mjs";
import { c as prepareSessionSourceAuthority, t as acceptSessionSourceValidation, u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { R as ensureSessionGoalOperationsSchema } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { t as runOpenClawAgentPathWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { M as buildRestartRecoveryExpectedState } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { r as getCliHistoryWriter } from "./cli-history-boundary-B1eSXpAQ.mjs";
import { i as toDatabaseOptions, r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { i as prepareSessionIdentityPublication, o as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import { i as assertSessionGoalOperationTime, r as applySessionGoalOperation, s as prepareSessionTurnGoalMessage } from "./goals-operation-policy-qSLTo9UN.mjs";
import { d as readWithCanonicalSessionAdmission } from "./session-canonical-key-B7chVWi3.mjs";
import { n as captureSessionActorStorageOwner, o as runWithSessionActorStorage, r as getSessionActorStorageBinding, s as withSessionActorStorage, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as prepareSqliteScope, l as runExclusiveSqliteSessionWrite, n as captureLifecycleDatabaseScope, s as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
import { r as captureOpenClawAgentDatabaseExecution, s as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { l as projectionLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { n as IncognitoSessionMissingError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { o as sanitizeTranscriptMessageForStorage } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { S as runSqliteSessionDeletionTransaction } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { p as resolveSessionPendingInputAppend, r as captureSessionPendingInputWorkerCustody } from "./session-accessor.sqlite-pending-inputs-dFWJwbQM.mjs";
import { c as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { a as readTranscriptMessageByScopedIdempotencyKey } from "./session-accessor.sqlite-transcript-identity-BbaLin80.mjs";
import { a as withSessionEntryWorker, r as prepareSessionEntryReplacementDatabase } from "./session-accessor.sqlite-replacement-worker-BpIicMPG.mjs";
import { n as createSessionActorFactory } from "./session-actor-durable-CYW-aqH_.mjs";
import { i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-CSunl6ZV.mjs";
import { t as installCommittedTranscriptMessageSequences } from "./session-accessor.sqlite-transcript-sequences-B5FCjqGn.mjs";
import { n as normalizeTranscriptMessagePreparation, t as assertLegacyTranscriptPreparation } from "./session-transcript-preparation-HBORI9r1.mjs";
import { n as readSessionGoalOperationInDatabase, r as readSessionGoalOperationReceipt } from "./goals-operations-DPpmJyei.mjs";
import { n as prepareSessionTurnPredicates, r as prepareSessionTurnRouting } from "./session-turn-predicate-DmzgQUpv.mjs";
import { n as sqliteSessionTranscriptTurnRebound, t as createSessionTranscriptTurnKernel } from "./session-turn.kernel-S1FdspyZ.mjs";
import { randomUUID } from "node:crypto";
import { isMainThread } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-input-actor.ts
const recorderBindings = /* @__PURE__ */ new WeakMap();
function registerUserTurnInputActor(recorder, bind) {
	recorderBindings.set(recorder, bind);
}
/** Internal handoff only: the released recorder shape does not grant actor authority. */
function bindUserTurnInputActor(recorder, binding) {
	const bind = recorderBindings.get(recorder);
	if (!bind) throw new Error("Input actor requires a factory-owned transcript recorder");
	bind(binding);
}
/** Capture the selected owner; never redirect an incognito target to a file. */
async function acquireSessionInputActor(requestedTarget, lifetime, followRegistration) {
	const agentId = requestedTarget.readSource?.agentId ?? requestedTarget.agentId;
	if (!agentId) throw new Error("Input actor requires its captured agent owner");
	const sessionKey = resolveSqliteSessionKey(requestedTarget.target.storeKeys[0] ?? requestedTarget.target.canonicalKey, agentId);
	const target = {
		...requestedTarget,
		target: {
			...requestedTarget.target,
			canonicalKey: sessionKey
		}
	};
	const database = {
		agentId,
		path: target.readSource?.path ?? target.storePath,
		env: target.env
	};
	lifetime.assertCurrent();
	const input = {
		...database,
		storePath: database.path,
		sessionKey
	};
	const authority = {
		assertCurrent: () => lifetime.assertCurrent(),
		authorize: () => lifetime.assertCurrent()
	};
	if (captureSessionActorStorageOwner(input, authority)) {
		const memory = await acquireSessionActorStorage(input, {
			lifetime,
			authority
		});
		if (!memory) return;
		return {
			actor: memory.actor,
			storageAuthority: memory.authority,
			target: {
				...target,
				readSource: {
					agentId: memory.agentId,
					path: memory.path,
					databaseIdentity: memory.actor.target.database.incarnation
				}
			}
		};
	}
	const { createSessionActorFactory } = await import("./session-actor-durable-D5JBv-3r.mjs");
	lifetime.assertCurrent();
	const execution = captureOpenClawAgentDatabaseExecution(database, { expectedIdentity: target.readSource && {
		kind: "file",
		physicalIdentity: target.readSource.databaseIdentity,
		birthtime: target.readSource.databaseBirthtime,
		nativeLocation: database.path
	} });
	try {
		if (!execution.fileIdentity) await prepareSessionEntryReplacementDatabase(database, () => lifetime.assertCurrent(), execution, followRegistration);
		const identity = execution.fileIdentity;
		if (!identity) throw new Error("Input actor has no admitted physical database");
		return {
			actor: await createSessionActorFactory(database).acquire({
				database: identity,
				sessionKey
			}, lifetime),
			target: {
				...target,
				readSource: target.readSource ?? {
					agentId: database.agentId,
					path: database.path,
					databaseIdentity: identity.physicalIdentity,
					databaseBirthtime: identity.birthtime
				}
			}
		};
	} finally {
		await execution.release();
	}
}
const inputActor = new AsyncLocalStorage();
/** Recorder calls capture their binding before yielding; handoff never redirects accepted work. */
function withSessionInputActor(binding, run) {
	return inputActor.run(binding, run);
}
async function getSessionInputActor(scope) {
	const binding = inputActor.getStore();
	if (!binding) {
		const memory = getSessionActorStorageBinding(scope);
		if (memory) {
			const identity = memory.actor.target.database;
			if (identity.kind !== "memory") throw new Error("Memory input actor requires its selected memory owner");
			return {
				actor: memory.actor,
				phase: "adoptRun",
				storageAuthority: memory.authority,
				target: {
					agentId: memory.agentId,
					storePath: memory.path,
					target: {
						canonicalKey: memory.actor.target.sessionKey,
						storeKeys: [memory.actor.target.sessionKey]
					},
					readSource: {
						agentId: memory.agentId,
						path: memory.path,
						databaseIdentity: identity.incarnation
					}
				},
				snapshot(authority) {
					return memory.actor.snapshot(authority);
				}
			};
		}
		return;
	}
	const acquired = await binding.acquire();
	if (!acquired) return;
	if (acquired.target.target.canonicalKey !== resolveSqliteSessionKey(scope.sessionKey, scope.agentId)) throw new Error("Input actor differs from the recorder's admitted target");
	const custody = captureSessionPendingInputWorkerCustody();
	return {
		...acquired,
		phase: binding.phase,
		storageAuthority: acquired.storageAuthority ?? getSessionActorStorageBinding(scope)?.authority,
		snapshot(authority) {
			try {
				return acquired.actor.snapshot(authority);
			} catch (error) {
				if (custody) throw new SessionPendingInputCustodyError("Pending input actor is unavailable", { cause: error });
				throw error;
			}
		}
	};
}
function throwSessionInputActorFailure(outcome, authorityFailure) {
	if (outcome.kind === "unknown") throw new SqliteWorkerError(outcome.error.message, "outcome-unknown");
	if (authorityFailure !== void 0) throw toErrorObject(authorityFailure, "Input actor authority rejected the operation");
	throw Object.assign(new Error(outcome.error.message), { name: outcome.error.name });
}
//#endregion
//#region src/config/sessions/session-actor-scope.ts
/** Reprepare only an explicitly refused version, never an uncertain accepted write. */
async function runSessionActorCommand(actor, authority, command) {
	if (actor.target.database.kind === "memory") return command(void 0);
	const run = async () => {
		const outcome = await command(actor.snapshot(authority));
		return outcome.kind === "stale-version" ? command(outcome.postimage) : outcome;
	};
	return actor.target.database.kind === "file" ? runOpenClawAgentPathWriteAdmission(actor.target.database.nativeLocation, run, true, void 0, void 0, "session-actor.command") : run();
}
/** Retain the captured physical writer, never reselect a target after an accepted command. */
async function withSessionActor(input, lifetime, consume) {
	lifetime.assertAdmission?.();
	lifetime.assertCurrent();
	const authority = {
		assertCurrent: () => lifetime.assertCurrent(),
		authorize: () => lifetime.assertCurrent()
	};
	if (captureSessionActorStorageOwner(input, authority)) {
		const binding = await acquireSessionActorStorage(input, {
			lifetime,
			authority
		});
		if (!binding) return;
		try {
			return await runWithSessionActorStorage(binding, () => consume(binding.actor));
		} finally {
			await binding.actor.release();
		}
	}
	const scope = await prepareSqliteScope(input);
	lifetime.assertCurrent();
	const options = toDatabaseOptions(scope);
	const database = {
		...options,
		path: resolveOpenClawAgentSqlitePath(options)
	};
	const identity = readDatabasePathIdentitySync(database.path);
	if (!identity.key.startsWith("file:")) return;
	const target = {
		database: {
			kind: "file",
			physicalIdentity: identity.key.slice(5),
			birthtime: identity.birthtime,
			nativeLocation: identity.canonicalPath
		},
		sessionKey: scope.sessionKey
	};
	const actor = await createSessionActorFactory({
		...database,
		path: identity.canonicalPath
	}).acquire(target, lifetime);
	try {
		return await consume(actor);
	} finally {
		await actor.release();
	}
}
//#endregion
//#region src/config/sessions/session-transcript-commit-completion.ts
/** Accept every synchronous callback before yielding, then join its explicit committed work. */
function completeSessionTranscriptCommit(messages, onMessageCommitted, turn) {
	if (!onMessageCommitted) return;
	const pending = [];
	let accepting = true;
	let failed = false;
	let failure;
	const accept = (complete) => {
		if (!accepting) throw new Error("Transcript committed completion admission is closed");
		const completion = complete();
		completion.catch(() => void 0);
		pending.push(completion);
	};
	try {
		for (const message of messages) onMessageCommitted(message, accept, turn);
	} catch (error) {
		failed = true;
		failure = error;
	} finally {
		accepting = false;
	}
	if (pending.length === 0) {
		if (failed) throw failure;
		return;
	}
	return Promise.allSettled(pending).then((results) => {
		if (failed) throw failure;
		for (const result of results) if (result.status === "rejected") throw result.reason;
	});
}
//#endregion
//#region src/config/sessions/session-input-preparation.ts
/** Prepare fresh input from complete MAIN facts; canonical retry bodies stay with their reader. */
function prepareSessionInputFromReplica(plan, hot, scope) {
	if (plan.options.sessionTurnMutation || hot.transcript.modelContext.kind !== "resident" || hot.target.sessionKey !== plan.sessionKey) return;
	if (!createSessionTranscriptTurnKernel(scope, plan.options).resolveExpectedEntry(hot.entry ? { entry: hot.entry } : void 0)) return;
	for (const source of plan.ownerSources ?? []) {
		const identity = hot.target.database;
		const sourceIdentity = identity.kind === "file" ? identity.physicalIdentity : identity.incarnation;
		if (source.source.databaseIdentity !== sourceIdentity || source.source.agentId !== scope.agentId || source.source.path !== scope.path || source.sessionKey !== plan.sessionKey || source.conversationAlternatives || Boolean(source.expected) !== Boolean(hot.entry) || source.fields.some((field) => !isDeepStrictEqual(source.expected?.[field], hot.entry?.[field])) || source.members && !isDeepStrictEqual(source.members, hot.members.map((member) => member.identityId)) || source.transcript && (source.transcript.sessionId !== scope.sessionId || !isDeepStrictEqual(source.transcript.version, hot.transcript.version))) return;
	}
	const messages = [];
	for (const append of plan.options.messages) {
		if (!isRecord(append.message) || append.message.role !== "user") return;
		const key = readMessageIdempotencyKey(append.message);
		if (append.idempotencyLookup === "scan-assistant" || key && hot.transcript.idempotency.some((row) => row.key === key)) return;
		const pending = key ? hot.pendingInputs.find((row) => row.idempotency_key === key) : void 0;
		if (!pending && key) return;
		if (pending && (!plan.custody || pending.input_id !== plan.custody.inputId || pending.state !== "queued" || pending.consumed_event_id !== null)) return;
		messages.push({
			pending: Boolean(pending),
			existing: void 0
		});
	}
	return {
		ownerSourceValidation: plan.ownerSources?.length ? { conversationMatches: [] } : void 0,
		result: void 0,
		messages,
		coldArchive: void 0,
		version: hot.transcript.version,
		expectedSessionState: buildRestartRecoveryExpectedState(hot.entry ?? {
			sessionId: scope.sessionId,
			updatedAt: 0
		}),
		goalId: void 0
	};
}
//#endregion
//#region src/config/sessions/session-turn-cold.ts
/** Cold restoration changes storage before append, under the same selected owner. */
async function restoreSessionTurnColdTranscript(scope, options, assertCurrent, initialSessionEntry) {
	const { restoreSessionColdTranscript, SessionColdSourceReboundError, SessionColdTurnReboundError } = await import("./session-cold-storage-Doo7Aerf.mjs");
	const source = options.ownerSource;
	const sources = source?.checks.map(({ predicate }) => predicate);
	const guard = options.keyFormat === "agent-qualified" || sources?.length ? {
		kind: "turn",
		agentId: scope.agentId,
		sessionKey: scope.sessionKey,
		options: {
			keyFormat: options.keyFormat,
			expectedSessionId: options.expectedSessionId,
			selectedSessionId: options.selectedSessionId,
			selectedLifecycleRevision: options.selectedLifecycleRevision,
			expectedLifecycleRevision: options.expectedLifecycleRevision,
			expectedWriterRunId: options.expectedWriterRunId,
			expectedSessionState: options.expectedSessionState,
			initialSessionEntry
		},
		goalOperation: options.sessionTurnMutation?.operation,
		sources
	} : void 0;
	const target = {
		...scope,
		storePath: scope.path
	};
	assertCurrent();
	try {
		if (source && sources?.length) await withSessionHistoryWorkerDatabase(toDatabaseOptions(scope), async (owner) => {
			const assertAllowed = () => {
				assertCurrent();
				owner.assertCurrent();
			};
			await restoreSessionColdTranscript(target, assertAllowed, {
				target: scope,
				acceptSourceValidation: (validation) => acceptSessionSourceValidation(source, validation),
				readMetadata: async () => (await owner.readColdMetadata({
					sessionId: scope.sessionId,
					env: scope.env ?? process.env
				})).archive
			}, guard);
		}, projectionLane);
		else await restoreSessionColdTranscript(target, assertCurrent, void 0, guard);
	} catch (error) {
		if (error instanceof SessionColdTurnReboundError) return {
			...error.result,
			sessionFile: options.sessionFile
		};
		if (error instanceof SessionColdSourceReboundError) source?.checks[error.refusal.index]?.refuse(error.refusal.facts);
		throw error;
	}
}
//#endregion
//#region src/config/sessions/session-turn-publication.ts
function publishCommittedSessionTurn(candidate, { scope, database, options, custody, committedCompletions, execution, inputActor }) {
	try {
		if (candidate.custody) custody?.publish(candidate.custody);
		installCommittedTranscriptMessageSequences(candidate.result.appendedMessages, candidate.sequences);
		try {
			const completion = completeSessionTranscriptCommit(candidate.result.appendedMessages, options.onMessageCommitted, candidate.result);
			if (completion) {
				completion.catch(() => void 0);
				committedCompletions.push(completion);
			}
		} catch (error) {
			const completion = Promise.reject(toErrorObject(error, "Session transcript completion failed"));
			completion.catch(() => void 0);
			committedCompletions.push(completion);
		}
		if (options.onCommittedSource && !candidate.result.rejectedReason && candidate.result.sessionEntry) {
			const identity = execution?.fileIdentity;
			const originalSource = inputActor?.target.readSource;
			if (!identity && !originalSource) throw new Error("Committed transcript turn omitted its admitted database identity");
			options.onCommittedSource(originalSource ?? {
				agentId: scope.agentId,
				path: database.path,
				databaseIdentity: identity.physicalIdentity,
				databaseBirthtime: identity?.birthtime
			}, candidate.result.sessionEntry);
		}
	} finally {
		if (candidate.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
			...database,
			preferredSessionId: scope.sessionId
		});
	}
}
function completeSessionTurnPublication(candidate, agentId, identity, published) {
	if (published) publishCommittedSessionIdentity(agentId, identity, published.previous, published.current, published.prepared);
	return candidate.result;
}
//#endregion
//#region src/config/sessions/session-turn.ts
async function appendSessionTurnInWorker(requested, options, context, native) {
	const scope = captureLifecycleDatabaseScope(requested);
	const database = {
		...toDatabaseOptions(scope),
		path: scope.path
	};
	const inputActor = await getSessionInputActor(scope);
	if (inputActor && inputActor.target.readSource?.path !== database.path) throw new Error("Input actor changed the transcript's physical target");
	const memory = inputActor?.actor.target.database.kind === "memory";
	const execution = inputActor ? void 0 : captureOpenClawAgentDatabaseExecution(database);
	const ownerSource = options.ownerSource;
	const custody = captureSessionPendingInputWorkerCustody();
	const cliWriter = getCliHistoryWriter({
		...scope,
		storePath: scope.path
	});
	let custodyRequired = false;
	const freshCommitGuards = /* @__PURE__ */ new Set();
	const sources = [];
	const committedCompletions = [];
	const assertCurrent = () => {
		execution?.assertCurrent();
		inputActor?.storageAuthority?.assertCurrent();
		(ownerSource?.assertPreparedCurrent ?? ownerSource?.assertCurrent)?.();
		options.assertCurrent?.();
		options.sessionTurnMutation?.assertCurrent?.();
		if (options.sessionTurnMutation) assertSessionGoalOperationTime(options.sessionTurnMutation.operation, Date.now());
		cliWriter?.assertCurrent();
		for (const guard of freshCommitGuards) guard();
	};
	const { onMessageCommitted: _onMessageCommitted, onCommittedSource: _onCommittedSource, assertCurrent: _assertCurrent, sessionTurnMutation, messages, config: _config, ownerSource: _ownerSource, ...serializable } = options;
	const plan = {
		agentId: scope.agentId,
		sessionKey: scope.sessionKey,
		options: {
			...serializable,
			initialSessionEntry: options.initialSessionEntry ? structuredClone(options.initialSessionEntry) : void 0,
			messages: [],
			sessionTurnMutation: sessionTurnMutation ? {
				kind: sessionTurnMutation.kind,
				operation: sessionTurnMutation.operation,
				runId: sessionTurnMutation.runId,
				routingPredicate: sessionTurnMutation.routingPredicate
			} : void 0
		},
		cliWriter: cliWriter ? {
			runId: cliWriter.runId,
			authFingerprint: cliWriter.authFingerprint,
			lifecycleRevision: cliWriter.lifecycleRevision
		} : void 0,
		ownerSources: ownerSource?.checks.map(({ predicate }) => predicate),
		custody: custody?.facts,
		relocation: custody?.relocation
	};
	const actor = inputActor?.actor;
	let inputExpectedState = options.expectedSessionState;
	const fixedVoiceTranscript = !actor && !memory && Boolean(options.voiceTranscript) && !custody && !cliWriter && !options.sessionTurnMutation && !options.sessionLifecyclePatch && !options.initialSessionEntry && messages.every((message) => !message.shouldAppend && !message.workerPreparation && !message.preparation && !message.prepareMessageAfterIdempotencyCheck && !message.beforeFreshMessageCommit && !message.shouldAppendInTransaction && !message.predicate);
	const prepareColdTranscript = !memory && !fixedVoiceTranscript && !messages.some((append) => append.shouldAppend) && (Boolean(sessionTurnMutation) || messages.some((append) => append.workerPreparation || isRecord(append.message) && append.message.role === "user" && typeof append.message.idempotencyKey === "string"));
	if (prepareColdTranscript) plan.prepareColdTranscript = true;
	let outcome = await (async () => {
		const restore = async () => {
			if (memory) return;
			return restoreSessionTurnColdTranscript(scope, options, assertCurrent, plan.options.initialSessionEntry);
		};
		if (!prepareColdTranscript) {
			const rebound = await restore();
			if (rebound) return rebound;
		}
		const operation = {
			database,
			retainedExecution: execution,
			agentId: scope.agentId,
			assertCurrent,
			candidateKind: "session-turn",
			onTransactionFacts(facts) {
				if (isRecord(facts) && facts.kind === "session-turn-owner") {
					if (!ownerSource) throw new Error("Session turn omitted its owner source authority");
					acceptSessionSourceValidation(ownerSource, facts.sourceValidation);
					return true;
				}
				if (isRecord(facts) && facts.kind === "session-turn-fresh") {
					const source = typeof facts.index === "number" ? sources[facts.index] : void 0;
					if (!source) throw new Error("Session turn omitted its fresh-message authority");
					acceptSessionSourceValidation(source, facts.sourceValidation);
					source.assertCurrent();
					freshCommitGuards.add(source.assertCurrent);
					return true;
				}
				if (!isRecord(facts) || facts.kind !== "session-turn-custody" && !(memory && facts.kind === "session-message" && facts.check === "pending")) return false;
				if (!custody) throw new Error("Session turn has no pending-input owner");
				custody.assertCurrent(facts.authority, assertCurrent);
				custodyRequired = true;
				return true;
			},
			assertCandidate(candidate) {
				if (custodyRequired) custody?.assertCurrent(candidate.authority, assertCurrent);
			},
			async run(prepareTurn, commit) {
				if (fixedVoiceTranscript) {
					plan.options.messages = messages.map(({ config: _messageConfig, ...message }) => ({
						...message,
						message: options.atomicGroup === true ? message.message : sanitizeTranscriptMessageForStorage(message.message)
					}));
					return commit();
				}
				const prepareOwnedTurn = async () => {
					const prepared = await prepareTurn();
					if (prepared.refusedOwnerSource) {
						ownerSource?.checks[prepared.refusedOwnerSource.index]?.refuse(prepared.refusedOwnerSource.facts);
						throw new Error("Session owner source refusal omitted its authority assertion");
					}
					if (ownerSource) acceptSessionSourceValidation(ownerSource, prepared.ownerSourceValidation);
					if (actor) inputExpectedState ??= prepared.expectedSessionState;
					return prepared;
				};
				if (messages.some((append) => append.shouldAppend)) {
					const selected = await prepareOwnedTurn();
					assertCurrent();
					if (selected.result) return selected.result;
				}
				const accepted = [];
				for (const append of messages) {
					if (!append.shouldAppend || await append.shouldAppend(context)) accepted.push(append);
					assertCurrent();
				}
				plan.options.messages = accepted.map(({ config: _messageConfig, workerPreparation: _preparation, preparation: _publicPreparation, shouldAppend: _shouldAppend, shouldAppendInTransaction: _predicate, prepareMessageAfterIdempotencyCheck: _prepare, beforeFreshMessageCommit: _guard, ...append }) => append);
				const preparation = actor || sessionTurnMutation || accepted.some((append) => append.workerPreparation || isRecord(append.message) && append.message.role === "user" && typeof append.message.idempotencyKey === "string") ? await prepareOwnedTurn() : void 0;
				assertCurrent();
				if (preparation?.result) return preparation.result;
				if (preparation?.coldArchive) return { kind: "restore-cold-transcript" };
				for (const [index, append] of accepted.entries()) {
					const hooks = append.workerPreparation;
					const facts = preparation?.messages[index];
					if (!facts?.pending && !facts?.existing && hooks?.beforeFreshMessageCommit) {
						const source = await prepareSessionSourceAuthority(hooks.beforeFreshMessageCommit);
						sources[index] = source;
						if (!actor && source.nativeSource || memory && source.hasOpaqueCheck || source.checks.some((check) => check.predicate.source.path !== database.path)) {
							assertCurrent();
							if (actor) throw new Error("Incognito turns require source authority prepared for the same actor");
							return native(accepted.map(({ shouldAppend: _shouldAppend, ...message }) => message));
						}
					}
				}
				plan.options.preparedGoalId = preparation?.goalId;
				for (const [index, append] of plan.options.messages.entries()) {
					const hooks = accepted[index].workerPreparation;
					const facts = preparation?.messages[index];
					const prepare = hooks?.prepareMessageAfterIdempotencyCheckAsync ?? hooks?.prepareMessageAfterIdempotencyCheck;
					let message = prepareSessionTurnGoalMessage(append.message, sessionTurnMutation, preparation?.goalId);
					if (!facts?.pending && !facts?.existing && prepare) {
						if (hooks?.prepareMessageAfterIdempotencyCheckAsync) append.preparationVersion = preparation?.version;
						message = await prepare(message);
						assertCurrent();
					}
					if (!facts?.pending && message !== void 0 && hooks?.beforeFreshMessageCommit) {
						append.sources = sources[index]?.checks.map(({ predicate }) => predicate);
						append.freshGuard = true;
					}
					if (!facts?.pending && message !== void 0 && options.atomicGroup !== true) message = sanitizeTranscriptMessageForStorage(message);
					plan.options.messages[index] = {
						...append,
						message: prepare ? append.message : message,
						...prepare && !facts?.pending ? { preparedMessage: {
							prepared: !facts?.existing,
							expected: facts?.existing,
							message
						} } : {}
					};
				}
				assertCurrent();
				return commit();
			},
			onAcknowledged(candidate) {
				publishCommittedSessionTurn(candidate, {
					scope,
					database,
					options,
					custody,
					committedCompletions,
					execution,
					inputActor
				});
			},
			async onCommitted(candidate, published, identity) {
				return completeSessionTurnPublication(candidate, scope.agentId, identity, published);
			}
		};
		const run = () => {
			if (actor && inputActor) {
				let authorityFailure;
				const checkAuthority = (check) => {
					try {
						check();
					} catch (error) {
						authorityFailure = error;
						throw error;
					}
				};
				const authority = {
					assertCurrent: () => checkAuthority(assertCurrent),
					authorize(stage, state, publication) {
						checkAuthority(() => {
							inputActor.storageAuthority?.authorize(stage, state, publication);
							operation.onTransactionFacts(publication);
							if (isRecord(publication) && publication.kind === "session-turn") operation.assertCandidate(publication);
							assertCurrent();
						});
					}
				};
				return operation.run(async () => {
					if (memory) {
						const hot = inputActor.snapshot(authority);
						return (hot && prepareSessionInputFromReplica(plan, hot, scope)) ?? actor.storage.read({
							type: "session.turn.prepare",
							input: plan
						}, authority);
					}
					return withSessionEntryWorker(database, void 0, assertCurrent, (preparedExecution, source) => preparedExecution.runExisting(source, (worker) => worker.execute({
						type: "session.turn.prepare",
						input: plan
					})).then((prepared) => {
						if (!prepared) throw new Error("Input preparation lost its database");
						return prepared;
					}), void 0, void 0, void 0, void 0, (publication) => {
						operation.onTransactionFacts(publication);
					});
				}, async () => {
					let expectedState = inputExpectedState;
					let candidate;
					const actorOutcome = await runSessionActorCommand({
						...actor,
						snapshot: (current) => inputActor.snapshot(current)
					}, authority, async (snapshot) => {
						if (snapshot) expectedState ??= buildRestartRecoveryExpectedState(snapshot.entry ?? {
							sessionId: options.expectedSessionId,
							updatedAt: 0
						});
						if (!expectedState) throw new Error("Input preparation omitted its lifecycle expectation");
						const record = (turn) => {
							if (!turn) throw new Error("Input actor omitted its committed turn");
							candidate = turn;
							operation.onAcknowledged(turn);
						};
						const phase = options.initialSessionEntry ? "acceptInput" : inputActor.phase;
						const command = {
							commandId: randomUUID(),
							phaseId: `${phase}:${options.expectedSessionId}`,
							expectedState,
							lifecycle: {},
							turn: plan
						};
						return phase === "acceptInput" ? actor.acceptInput(command, authority, { committed: (commit) => record(commit.value.turn) }) : actor.adoptRun({
							...command,
							sessionId: options.expectedSessionId
						}, authority, { committed: (commit) => record(commit.value) });
					});
					if (actorOutcome.kind !== "committed") throwSessionInputActorFailure(actorOutcome, authorityFailure);
					if (actorOutcome.failure && actorOutcome.failure.origin !== "response") throw Object.assign(new Error(actorOutcome.failure.message), { name: actorOutcome.failure.name });
					if (!candidate) throw new Error("Input actor omitted its committed receipt");
					return candidate.result;
				});
			}
			return runSessionEntryWorkerOperation({
				...operation,
				run: (worker, commit) => operation.run(() => worker.execute({
					type: "session.turn.prepare",
					input: plan
				}), () => commit(() => worker.execute({
					type: "session.turn.commit",
					input: plan
				})))
			});
		};
		for (let restorations = 0;; restorations++) {
			const result = await run();
			if (!("kind" in result)) return result;
			if (restorations === 2) throw new SessionTranscriptColdError(scope.sessionId);
			const rebound = await restore();
			if (rebound) return rebound;
		}
	})().then((value) => ({
		ok: true,
		value
	}), (error) => ({
		ok: false,
		error
	}));
	const completionErrors = (await Promise.allSettled(committedCompletions)).flatMap((completion) => completion.status === "rejected" ? [completion.reason] : []);
	if (completionErrors.length) try {
		throwSqliteLifecycleErrors([...!outcome.ok ? [outcome.error] : [], ...completionErrors], "Session turn committed completion failed");
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	try {
		try {
			await releaseSessionSourceAuthorities(sources.filter((source) => source !== void 0));
		} finally {
			await execution?.release();
		}
	} catch (error) {
		if (outcome.ok) throw error;
		throw retainSqliteWorkerErrorCode(createSqliteLifecycleAggregateError([outcome.error, error], "Session turn and executor cleanup failed", outcome.error), outcome.error);
	}
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-turn.ts
/** Appends a guarded transcript turn and touches its session row in one queued write. */
async function appendExpectedSessionTranscriptTurn(scope, requestedOptions, ownerScope = scope) {
	const assertOwnedWrite = captureOwnedTranscriptWriteAssertion({
		...ownerScope,
		sessionId: requestedOptions.expectedSessionId
	});
	const target = {
		...scope,
		sessionId: requestedOptions.expectedSessionId
	};
	if (!getSessionActorStorageBinding(target)) {
		const assertCurrent = () => {
			assertOwnedWrite();
			requestedOptions.assertCurrent?.();
		};
		const authority = {
			assertCurrent,
			authorize: assertCurrent
		};
		if (captureSessionActorStorageOwner(target, authority)) {
			const result = await withSessionActorStorage(target, {
				authority,
				lifetime: {
					assertCurrent,
					assertReadable: assertCurrent
				},
				create: Boolean(requestedOptions.initialSessionEntry)
			}, () => appendExpectedSessionTranscriptTurn(scope, requestedOptions, ownerScope));
			if (!result) throw new IncognitoSessionMissingError();
			return result;
		}
	}
	if (requestedOptions.ownerSource) return appendPreparedSessionTranscriptTurn(scope, requestedOptions, assertOwnedWrite);
	const ownerSource = await prepareSessionSourceAuthority(assertOwnedWrite);
	const errors = [];
	try {
		return await appendPreparedSessionTranscriptTurn(scope, {
			...requestedOptions,
			ownerSource
		}, assertOwnedWrite);
	} catch (error) {
		errors.push(error);
		throw error;
	} finally {
		await releaseSessionSourceAuthorities([ownerSource], errors);
	}
}
async function appendPreparedSessionTranscriptTurn(scope, requestedOptions, assertOwnedWrite, nativeReservation) {
	const memory = getSessionActorStorageBinding({
		...scope,
		sessionId: requestedOptions.expectedSessionId
	});
	let options = nativeReservation ? requestedOptions : {
		...requestedOptions,
		messages: requestedOptions.messages.map((message) => {
			assertLegacyTranscriptPreparation(scope, message);
			return normalizeTranscriptMessagePreparation(message);
		})
	};
	if (options.messages.some((message) => message.workerPreparation?.prepareMessageAfterIdempotencyCheckAsync) && (options.messages.length !== 1 || options.messages.some((message) => message.predicate || message.shouldAppendInTransaction))) throw new Error("Awaited transcript preparation requires one message without transaction predicates");
	const resolved = memory ? {
		agentId: memory.agentId,
		path: memory.path,
		sessionKey: memory.actor.target.sessionKey,
		sessionId: options.expectedSessionId,
		env: scope.env ?? process.env
	} : captureLifecycleDatabaseScope(resolveSqliteTranscriptScope({
		...scope,
		sessionId: options.expectedSessionId
	}));
	const context = {
		agentId: resolved.agentId,
		sessionId: options.expectedSessionId,
		sessionKey: resolved.sessionKey,
		...scope.storePath ? { storePath: scope.storePath } : {}
	};
	const keys = /* @__PURE__ */ new Set();
	const independentPreparation = !options.messages.some((message) => message.workerPreparation) || options.messages.every((append) => {
		const key = readMessageIdempotencyKey(append.message);
		const repeated = key !== null && keys.has(key);
		if (key) keys.add(key);
		return !append.workerPreparation || !append.predicate && !repeated;
	});
	const inputActor = !nativeReservation && await getSessionInputActor(resolved);
	if (!nativeReservation && independentPreparation && !options.ownerSource?.nativeSource && !options.ownerSource?.hasOpaqueCheck && (isMainThread || inputActor && inputActor.actor.target.database.kind === "memory") && (inputActor || supportsOpenClawAgentDatabaseExecution(toDatabaseOptions(resolved))) && options.messages.every((message) => {
		const guard = message.workerPreparation?.beforeFreshMessageCommit;
		return !message.shouldAppendInTransaction && !message.prepareMessageAfterIdempotencyCheck && !message.beforeFreshMessageCommit && (inputActor || !guard?.nativeSource);
	})) return appendSessionTurnInWorker(resolved, options, context, (messages) => appendPreparedSessionTranscriptTurn({
		...scope,
		storePath: resolved.path,
		env: resolved.env
	}, {
		...options,
		messages
	}, assertOwnedWrite, true));
	if (memory || inputActor) throw new Error("Actor transcript turns require preparation outside the transaction");
	if (options.ownerSource?.checks.length) throw new Error("Prepared transcript owner authority requires worker-compatible message preparation");
	const assertRequestedCurrent = options.assertCurrent;
	options = {
		...options,
		assertCurrent: () => {
			assertOwnedWrite();
			assertRequestedCurrent?.();
		}
	};
	options.assertCurrent?.();
	if (options.acceptedResultGuard || options.sessionTurnMutation?.routingPredicate) await prepareSessionTurnPredicates();
	const { readEntry, resolveExpectedEntry } = createSessionTranscriptTurnKernel(resolved, options);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
	const rebound = /* @__PURE__ */ new Error("Session changed before cold transcript restoration");
	let restoreEntry;
	try {
		options.assertCurrent?.();
		await restoreSessionColdTranscript({
			...scope,
			sessionId: options.expectedSessionId
		}, options.keyFormat === "agent-qualified" ? () => {
			options.assertCurrent?.();
			options.sessionTurnMutation?.assertCurrent?.();
			const current = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => {
				restoreEntry = readEntry(database);
				return resolveExpectedEntry(restoreEntry) || restoreEntry?.entry.sessionId === options.expectedSessionId && options.sessionTurnMutation && readSessionGoalOperationInDatabase(database, {
					sessionKey: resolved.sessionKey,
					expectedSessionId: options.expectedSessionId,
					operation: options.sessionTurnMutation.operation
				});
			}), toDatabaseOptions(resolved));
			if (current.found ? current.value : resolveExpectedEntry(void 0)) return;
			throw rebound;
		} : options.assertCurrent);
	} catch (error) {
		if (error !== rebound) throw error;
		return sqliteSessionTranscriptTurnRebound(restoreEntry, options.sessionFile);
	}
	return await (nativeReservation ? (_scope, run) => run() : runExclusiveSqliteSessionWrite)(resolved, async () => {
		const mutation = options.sessionTurnMutation;
		options.assertCurrent?.();
		mutation?.assertCurrent?.();
		const preparedDatabase = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		prepareSessionTurnRouting(mutation?.routingPredicate, resolved.env)?.(preparedDatabase);
		if (mutation) ensureSessionGoalOperationsSchema(preparedDatabase.db);
		const preparedEntry = readEntry(preparedDatabase);
		const preparedReplay = mutation ? readSessionGoalOperationReceipt(preparedDatabase.db, resolved.sessionKey, options.expectedSessionId, mutation.operation) : void 0;
		if (preparedReplay) {
			if (preparedEntry?.entry.sessionId !== options.expectedSessionId) return sqliteSessionTranscriptTurnRebound(preparedEntry, options.sessionFile);
			return {
				appendedMessages: [],
				sessionEntry: preparedEntry.entry,
				sessionFile: options.sessionFile,
				sessionTurnMutationResult: {
					result: preparedReplay,
					replayed: true
				}
			};
		}
		const expectedEntry = resolveExpectedEntry(preparedEntry);
		if (!expectedEntry) return sqliteSessionTranscriptTurnRebound(preparedEntry, options.sessionFile);
		const messages = await selectAppendableSqliteTranscriptTurnMessages(context, options.messages);
		const preparingAsync = messages.some((append) => append.workerPreparation?.prepareMessageAfterIdempotencyCheckAsync);
		const preparedGoalId = preparingAsync && mutation ? applySessionGoalOperation(expectedEntry, mutation.operation, Date.now())?.id : void 0;
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const identity = preparingAsync ? readOpenClawAgentDatabaseIdentity(database) : void 0;
		const version = preparingAsync ? readTranscriptContextVersionInTransaction(database, resolved.sessionId) : void 0;
		const preparedMessages = /* @__PURE__ */ new Set();
		const asyncMessages = /* @__PURE__ */ new Set();
		for (const append of messages) {
			const hooks = append.workerPreparation;
			const prepare = hooks?.prepareMessageAfterIdempotencyCheckAsync;
			if (!prepare) continue;
			asyncMessages.add(append);
			const current = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
			const key = readMessageIdempotencyKey(append.message);
			const existing = key && append.idempotencyLookup !== "caller-checked" ? readTranscriptMessageByScopedIdempotencyKey(current, resolved, key, append.idempotencyLookup) : void 0;
			const pending = resolveSessionPendingInputAppend(current, resolved, append.message);
			if (!existing && !pending) preparedMessages.add(append);
			const message = existing || pending ? append.message : await prepare(prepareSessionTurnGoalMessage(append.message, mutation, preparedGoalId));
			append.workerPreparation = {
				...hooks,
				prepareMessageAfterIdempotencyCheckAsync: void 0,
				prepareMessageAfterIdempotencyCheck: () => message
			};
		}
		let result = sqliteSessionTranscriptTurnRebound(preparedEntry, options.sessionFile);
		const { commit } = createSessionTranscriptTurnKernel(resolved, {
			...options,
			...preparedGoalId ? { preparedGoalId } : {}
		}, prepareSessionTurnRouting(mutation?.routingPredicate, resolved.env));
		const failures = [];
		let completion;
		const publish = runSqliteSessionDeletionTransaction((transactionDb) => {
			const currentIdentity = identity ? readOpenClawAgentDatabaseIdentity(transactionDb) : void 0;
			const transactionVersion = identity ? readTranscriptContextVersionInTransaction(transactionDb, resolved.sessionId) : void 0;
			for (const append of messages) {
				if (!asyncMessages.has(append)) continue;
				const beforeFreshMessageCommit = append.workerPreparation?.beforeFreshMessageCommit ?? append.beforeFreshMessageCommit;
				append.workerPreparation = {
					...append.workerPreparation,
					beforeFreshMessageCommit: () => {
						if (!preparedMessages.has(append) || identity?.identity !== currentIdentity?.identity || identity?.birthtime !== currentIdentity?.birthtime || !isDeepStrictEqual(version, transactionVersion)) throw new SqliteTranscriptMutationConflictError(resolved.sessionId);
						beforeFreshMessageCommit?.();
					}
				};
			}
			const committed = commit(transactionDb, messages);
			result = committed.result;
			if (!stageSqliteTransactionState(transactionDb.db, {
				stage: () => void 0,
				commit: () => {
					try {
						completion = completeSessionTranscriptCommit(result.appendedMessages, options.onMessageCommitted, result);
						completion?.catch(() => void 0);
					} catch (error) {
						failures.push(error);
					}
				},
				rollback: () => void 0
			})) throw new Error("Transcript completion requires managed commit settlement");
			if (options.onCommittedSource && !result.rejectedReason && result.sessionEntry) {
				const committedIdentity = readOpenClawAgentDatabaseIdentity(transactionDb);
				const source = {
					agentId: transactionDb.agentId,
					path: transactionDb.path,
					databaseIdentity: committedIdentity.identity,
					databaseBirthtime: committedIdentity.birthtime
				};
				const entry = result.sessionEntry;
				if (!stageSqliteTransactionState(transactionDb.db, {
					stage: () => void 0,
					commit: () => {
						try {
							options.onCommittedSource?.(source, entry);
						} catch (error) {
							failures.push(error);
						}
					},
					rollback: () => void 0
				})) throw new Error("Transcript source publication requires managed commit settlement");
			}
			return committed.identity ? prepareSessionIdentityPublication(transactionDb, resolved.agentId, committed.identity.previous, committed.identity.current) : void 0;
		}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.append-turn" });
		try {
			publish?.();
		} catch (error) {
			failures.push(error);
		}
		try {
			await completion;
		} catch (error) {
			failures.push(error);
		}
		throwSqliteLifecycleErrors(failures, "Transcript committed publication failed");
		return result;
	}, "session.transcript.turn");
}
async function selectAppendableSqliteTranscriptTurnMessages(context, messages) {
	const selected = [];
	for (const append of messages) if (append.shouldAppend ? await append.shouldAppend(context) : true) selected.push({ ...append });
	return selected;
}
//#endregion
export { acquireSessionInputActor as a, registerUserTurnInputActor as c, withSessionActor as i, throwSessionInputActorFailure as l, completeSessionTranscriptCommit as n, bindUserTurnInputActor as o, runSessionActorCommand as r, getSessionInputActor as s, appendExpectedSessionTranscriptTurn as t, withSessionInputActor as u };
