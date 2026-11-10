import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { d as isSqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as prepareSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { n as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import { s as getOwnedSessionTranscriptActor } from "./transcript-write-context-C02sC3zd.mjs";
import { t as isTranscriptMessageAppendCurrentTail } from "./session-accessor.sqlite-transcript-append-result-BjgvnUCa.mjs";
import { r as prepareTranscriptMessageAppendForWorker } from "./session-accessor.sqlite-transcript-message-append-DFcvBgrv.mjs";
import { t as captureSessionMessageAdmission } from "./session-manager-message-admission-EoHliJb3.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
import { t as SessionTranscriptMessageCommittedError } from "./session-manager-message-error-CdpV1a6G.mjs";
import { t as createSessionManagerPublicationHooks } from "./session-manager-publication-vZ305gn3.mjs";
import { t as appendSessionManagerActor } from "./session-manager-actor-append-R1mAyZ4o.mjs";
//#region src/agents/sessions/session-manager-message-runtime.ts
const moduleUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionManagerMetadata);
/** The existing session domain owns the transaction; only committed facts return to its caller. */
async function appendSessionTranscriptMessage(input) {
	const prepared = prepareTranscriptMessageAppendForWorker(input);
	Object.freeze(prepared.persistedMessage);
	input.assertCurrent();
	const actorBinding = getOwnedSessionTranscriptActor(input.target);
	if (actorBinding) return appendOwnedActorTranscriptMessage(input, prepared, actorBinding.actor, actorBinding.database);
	if (!input.candidate) throw new Error("Unbound transcript append requires a captured store candidate");
	return appendUnboundSdkTranscriptMessage({
		...input,
		candidate: input.candidate
	}, prepared);
}
function readCommittedMessage(append, prepared) {
	const persisted = append.snapshot;
	if (!persisted.ok) throw new Error("Session transcript message was not persisted", { cause: persisted.error });
	const result = persisted.value.result;
	if (!result) throw new Error("Session transcript message was not persisted");
	return {
		result: {
			messageId: result.messageId,
			message: result.message ?? prepared.persistedMessage,
			appended: result.appended,
			currentTail: isTranscriptMessageAppendCurrentTail(persisted.value)
		},
		version: persisted.value.after,
		lifecycleRevision: persisted.value.lifecycleRevision
	};
}
function throwTranscriptAppendError(error, committed, target) {
	if (committed) throw new SessionTranscriptMessageCommittedError(committed.result.messageId, error, target, committed.version, committed.lifecycleRevision);
	if (error instanceof Error && collectNestedErrorCandidates(error).some((cause) => isSqliteWorkerError(cause, "outcome-unknown"))) recordModelFallbackStop(error);
	throw error;
}
async function appendOwnedActorTranscriptMessage(input, prepared, actor, options) {
	const databasePath = options.path;
	const assertCurrent = () => {
		input.assertCurrent();
		if (input.candidate) assertSessionStoreReadCandidate(databasePath, [input.candidate]);
		actor.assertCurrent();
	};
	let committed;
	try {
		const { env: _env, ...writeTarget } = input.target;
		const receipt = await appendSessionManagerActor({
			actor,
			toolResult: false,
			assertCurrent,
			append: {
				kind: "message",
				input: {
					scope: {
						...writeTarget,
						storePath: databasePath
					},
					messageJson: prepared.messageJson,
					cwd: input.cwd
				}
			},
			onCommitted(append) {
				if (append.kind !== "message") throw new Error("Session actor omitted the committed transcript message");
				committed = readCommittedMessage(append.value, prepared);
			}
		});
		if (receipt.failure) throw receipt.failure;
		assertCurrent();
		if (!committed) throw new Error("Session actor omitted its committed transcript observation");
		if (receipt.committed.value.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
			...options,
			preferredSessionId: input.target.sessionId
		});
		return committed.result;
	} catch (error) {
		return throwTranscriptAppendError(error, committed, input.target);
	}
}
/** Released unbound SDK calls retain their native metadata adapter. */
async function appendUnboundSdkTranscriptMessage(input, prepared) {
	const resolved = await prepareSqliteTranscriptReadScope(input.target);
	const options = toDatabaseOptions(resolved);
	const databasePath = resolveOpenClawAgentSqlitePath(options);
	const assertCurrent = () => {
		input.assertCurrent();
		assertSessionStoreReadCandidate(databasePath, [input.candidate]);
	};
	assertCurrent();
	const admission = captureSessionMessageAdmission(assertCurrent);
	const execution = captureOpenClawAgentDatabaseExecution(options);
	const publication = createSessionManagerPublicationHooks({
		agentId: input.target.agentId,
		storePath: execution.path,
		databaseIdentity: () => execution.fileIdentity?.physicalIdentity
	});
	const { env: _env, ...writeTarget } = input.target;
	let worker;
	let committed;
	const failures = [];
	try {
		worker = await openOpenClawAgentSqliteWorkerStore(options, { execution }, {
			moduleUrl,
			input: void 0,
			assertAdmission: (request) => admission.assertAdmission(publication.unwrap(request)),
			onAdmitted: publication.onAdmitted,
			observeAdmission: publication.observeAdmission
		});
		await worker.run(async (scope) => {
			const reply = await scope.execute({
				type: "session.transcript.appendMessage",
				input: {
					scope: {
						...writeTarget,
						storePath: execution.path
					},
					messageJson: prepared.messageJson,
					cwd: input.cwd,
					...admission.control
				}
			});
			if (!reply.ok) throw new SessionTranscriptWriterClaimReboundError(reply.refusal);
			committed = readCommittedMessage(reply.value, prepared);
			admission.publish(reply.value.pendingInputReceipt);
			assertCurrent();
			if (reply.value.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
				...options,
				preferredSessionId: input.target.sessionId
			});
		}, assertCurrent);
	} catch (error) {
		failures.push(error);
	} finally {
		for (const release of [() => worker?.close(), () => execution.release()]) try {
			await release();
		} catch (error) {
			failures.push(error);
		}
	}
	try {
		if (failures.length > 1) throw createSqliteLifecycleAggregateError(failures, "Session transcript append and cleanup failed", failures[0]);
		if (failures.length === 1) throw failures[0];
		assertCurrent();
	} catch (error) {
		return throwTranscriptAppendError(error, committed, input.target);
	}
	if (!committed) throw new Error("Session transcript message was not persisted");
	return committed.result;
}
//#endregion
export { appendSessionTranscriptMessage };
