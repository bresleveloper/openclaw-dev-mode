import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as readDatabasePathIdentitySync, n as assertDatabasePathIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { r as SqliteTranscriptMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { a as captureExternalSessionCommitGuard, c as prepareSessionSourceAuthority, t as acceptSessionSourceValidation, u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as withTranscriptLockSettlement, r as withLockedSessionTranscriptReads } from "./session-transcript-execution-read-Cv-mpCgi.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { o as sanitizeTranscriptMessageForStorage } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { r as captureSessionPendingInputWorkerCustody } from "./session-accessor.sqlite-pending-inputs-dFWJwbQM.mjs";
import { i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { n as publishTranscriptUpdate } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-CSunl6ZV.mjs";
import { r as prepareTranscriptMessageAppendForWorker } from "./session-accessor.sqlite-transcript-message-append-DFcvBgrv.mjs";
import { t as assertLegacyTranscriptPreparation } from "./session-transcript-preparation-HBORI9r1.mjs";
import { t as executeSessionMessageRewriteOperation } from "./session-message-rewrite-domain-D1FyYmve.mjs";
//#region src/config/sessions/session-transcript-locked-write.ts
/** One callback retains its canonical writer through reads and accepted settlement. */
async function withWorkerTranscriptWriteLock(scope, ownerScope, run, native) {
	const assertOwned = captureOwnedTranscriptWriteAssertion(ownerScope);
	const custody = captureSessionPendingInputWorkerCustody();
	const database = {
		...toDatabaseOptions(scope),
		path: scope.path
	};
	const identity = readDatabasePathIdentitySync(scope.path);
	const execution = captureOpenClawAgentDatabaseExecution(database, identity.key.startsWith("file:") ? { expectedIdentity: {
		kind: "file",
		physicalIdentity: identity.key.slice(5),
		nativeLocation: identity.canonicalPath,
		birthtime: identity.birthtime
	} } : { expectedCreationIdentity: identity });
	const resolved = {
		agentId: scope.agentId,
		databaseAgentId: scope.databaseAgentId,
		env: captureSessionTranscriptStorageEnvironment(scope.env),
		path: scope.path,
		ownerStorePath: scope.ownerStorePath,
		sessionKey: scope.sessionKey,
		sessionId: scope.sessionId
	};
	const fenced = scope;
	let releaseExecution = true;
	try {
		const owned = await prepareSessionSourceAuthority(assertOwned);
		if (owned.nativeSource) try {
			execution.assertCurrent();
			releaseExecution = false;
			await execution.release();
			assertDatabasePathIdentity(scope.path, identity);
			return await native(fenced, run, false, void 0, void 0, ownerScope);
		} finally {
			await owned.release?.();
		}
		let freshSource;
		let fresh = false;
		let custodyRequired = false;
		const assertCurrent = () => {
			execution.assertCurrent();
			owned.assertCurrent();
			if (fresh) freshSource?.assertCurrent();
		};
		releaseExecution = false;
		const result = await runSessionEntryWorkerOperation({
			database,
			agentId: resolved.agentId,
			assertCurrent,
			candidateKind: "session-transcript-locked",
			retainedExecution: execution,
			releaseSource: () => releaseSessionSourceAuthorities([{ release: () => execution.release() }, owned]),
			prepareWorker: (writer, source) => ({
				async prepare() {
					const { restoreSessionColdTranscript, SessionColdSourceReboundError } = await import("./session-cold-storage-Doo7Aerf.mjs");
					assertCurrent();
					const assertRestorationCurrent = () => {
						execution.assertCurrent();
						(owned.assertPreparedCurrent ?? owned.assertCurrent)();
					};
					try {
						await restoreSessionColdTranscript(fenced, assertRestorationCurrent, {
							target: resolved,
							acceptSourceValidation: (validation) => acceptSessionSourceValidation(owned, validation),
							readMetadata: async () => {
								const metadata = await runOpenClawAgentWorkerWrite(database, () => writer.runExisting(source, (worker) => executeSessionMessageRewriteOperation(worker, database.agentId, {
									type: "session.transcript.lock.cold",
									input: { scope: resolved }
								})));
								if (!metadata) throw new Error("Locked transcript lost its admitted database");
								return metadata.archive;
							}
						}, {
							kind: "locked",
							agentId: resolved.agentId,
							sessionKey: resolved.sessionKey,
							sources: owned.checks.map((check) => check.predicate),
							fence: {
								expectedOwner: fenced.expectedOwner,
								expectedLifecycleRevision: fenced.expectedLifecycleRevision,
								expectedWriterRunId: fenced.expectedWriterRunId
							}
						});
					} catch (error) {
						if (error instanceof SessionColdSourceReboundError) {
							const { index, facts } = error.refusal;
							(Number.isInteger(index) && index >= 0 ? owned.checks[index] : void 0)?.refuse(facts);
							throw new Error("Cold transcript source refusal omitted its prepared assertion", { cause: error });
						}
						throw error;
					}
					assertCurrent();
				},
				beforeWrite: assertCurrent,
				async release() {}
			}),
			onTransactionFacts(facts) {
				if (!isRecord(facts)) return false;
				if (facts.kind === "session-transcript-lock-source") {
					fresh = facts.fresh === true;
					const authority = fresh ? freshSource : owned;
					if (authority) {
						acceptSessionSourceValidation(authority, facts.sourceValidation);
						authority.assertCurrent();
					}
					return true;
				}
				if (facts.kind === "session-transcript-lock-custody") {
					if (!custody) throw new Error("Locked transcript has no pending-input custody");
					custodyRequired = true;
					custody.assertCurrent(facts.authority, assertCurrent);
					return true;
				}
				return false;
			},
			assertCandidate(candidate) {
				if (custodyRequired) custody?.assertCurrent(candidate.authority, assertCurrent);
			},
			onAcknowledged(candidate) {
				if (candidate.custody) custody?.publish(candidate.custody);
				if (candidate.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
					...database,
					preferredSessionId: resolved.sessionId
				});
			},
			onCommitted: (candidate) => candidate,
			async run(worker, commit) {
				const claim = execution.captureGenerationClaim();
				const target = {
					scope: resolved,
					fence: {
						expectedWriterRunId: fenced.expectedWriterRunId,
						expectedLifecycleRevision: fenced.expectedLifecycleRevision,
						expectedOwner: fenced.expectedOwner
					},
					sources: owned.checks.map((check) => check.predicate)
				};
				let snapshot;
				const value = await withTranscriptLockSettlement((queue) => {
					const queued = (operation, signal) => queue(() => {
						assertCurrent();
						return operation();
					}, signal);
					const mutate = async (input) => {
						const receipt = await commit(() => executeSessionMessageRewriteOperation(worker, database.agentId, {
							type: "session.transcript.lock.commit",
							input
						}));
						if (!("kind" in receipt)) throw new Error("Locked transcript omitted its committed receipt");
						if (receipt.result?.anchor) Object.freeze(receipt.result.anchor);
						if (snapshot) snapshot = receipt.snapshot;
						return receipt;
					};
					const prepareWithLockedReads = (prepare) => withTranscriptLockSettlement((queueRead) => withLockedSessionTranscriptReads({
						canonicalPath: identity.canonicalPath,
						claim,
						worker,
						assertCurrent,
						queue: queueRead
					}, prepare));
					const append = async (options, sequenced) => {
						assertLegacyTranscriptPreparation(fenced, options);
						const { config, message: originalMessage, preparation, prepareMessageAfterIdempotencyCheck: legacyPrepare, prepareMessageAfterIdempotencyCheckAsync, beforeFreshMessageCommit, ...serializable } = options;
						if (preparation && (legacyPrepare || beforeFreshMessageCommit)) throw new Error("Choose preparation or the legacy transcript callback form, not both.");
						const prepare = preparation?.prepareMessage ?? prepareMessageAfterIdempotencyCheckAsync;
						const source = preparation?.source ?? beforeFreshMessageCommit;
						const freshGuard = captureExternalSessionCommitGuard(source);
						const input = {
							...target,
							options: {
								...serializable,
								message: originalMessage === void 0 ? void 0 : originalMessage === null ? null : {
									role: isRecord(originalMessage) && originalMessage.role === "user" ? "user" : void 0,
									idempotencyKey: isRecord(originalMessage) && typeof originalMessage.idempotencyKey === "string" ? originalMessage.idempotencyKey : void 0
								}
							},
							snapshot,
							custody: custody?.facts,
							relocation: custody?.relocation
						};
						const expected = prepare || source || custody && input.options.message?.role === "user" && typeof input.options.message.idempotencyKey === "string" ? await executeSessionMessageRewriteOperation(worker, database.agentId, {
							type: "session.transcript.lock.prepare",
							input
						}) : void 0;
						const authority = await prepareWithLockedReads(() => prepareSessionSourceAuthority(expected?.pending || expected?.existing ? void 0 : freshGuard));
						if (freshGuard?.nativeSource || authority.nativeSource || legacyPrepare && !prepare) try {
							return await native(fenced, async (context) => sequenced ? context.appendMessageWithMessageSequence(options) : { result: await context.appendMessage(options) }, true, snapshot, (next) => {
								snapshot = next;
							}, ownerScope);
						} finally {
							await authority.release?.();
						}
						fresh = false;
						freshSource = authority;
						try {
							let message = originalMessage;
							if (prepare && expected && !expected.pending && !expected.existing) message = await prepareWithLockedReads(() => prepare(originalMessage));
							assertCurrent();
							const preparedMessageJson = expected?.pending || prepare && expected?.existing ? void 0 : isRecord(message) ? prepareTranscriptMessageAppendForWorker({
								message,
								config
							}).messageJson : JSON.stringify(sanitizeTranscriptMessageForStorage(message));
							const receipt = await mutate({
								...input,
								kind: "message",
								freshSources: authority.checks.map((check) => check.predicate),
								freshAuthorityPrepared: !source || !expected?.pending && !expected?.existing,
								sequenced,
								preparedMessageJson,
								...prepare && expected ? { preparation: {
									prepared: !expected.pending && !expected.existing,
									version: expected.version
								} } : {}
							});
							return {
								lifecycleRevision: receipt.lifecycleRevision,
								messageSeq: receipt.messageSeq,
								result: receipt.result
							};
						} finally {
							fresh = false;
							freshSource = void 0;
							await authority.release?.();
						}
					};
					return withLockedSessionTranscriptReads({
						canonicalPath: identity.canonicalPath,
						claim,
						worker,
						assertCurrent,
						queue: queued
					}, () => run({
						publishUpdate: (update) => queued(() => publishTranscriptUpdate(fenced, update)),
						readEvents: () => queued(async () => {
							const read = await executeSessionMessageRewriteOperation(worker, database.agentId, {
								type: "session.transcript.lock.read",
								input: { scope: resolved }
							});
							assertCurrent();
							snapshot = {
								kind: "current",
								rows: read.rows
							};
							return read.events;
						}),
						readMessageFacts: (params) => queued(async () => {
							const facts = await executeSessionMessageRewriteOperation(worker, database.agentId, {
								type: "session.transcript.lock.facts",
								input: {
									...target,
									idempotencyKeys: params.idempotencyKeys,
									sourceRunId: params.sourceRunId
								}
							});
							assertCurrent();
							for (const anchor of facts.anchorsByIdempotencyKey.values()) Object.freeze(anchor);
							return facts;
						}),
						appendMessage: (options) => queued(async () => (await append(options, false)).result),
						appendMessageWithMessageSequence: (options) => queued(() => append(options, true)),
						replaceEvents: (events) => queued(async () => {
							if (snapshot?.kind === "stale") throw new SqliteTranscriptMutationConflictError(resolved.sessionId);
							snapshot = (await mutate({
								...target,
								kind: "replace",
								events,
								snapshot
							})).snapshot;
						})
					}));
				});
				execution.assertCurrent();
				return { value };
			}
		});
		if (!("value" in result)) throw new Error("Locked transcript omitted its callback result");
		return result.value;
	} finally {
		if (releaseExecution) await execution.release();
	}
}
//#endregion
export { withWorkerTranscriptWriteLock };
