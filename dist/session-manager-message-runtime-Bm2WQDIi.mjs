import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { q as readLoggingConfig } from "./redact-DJ8j6ADa.mjs";
import { r as getSecretRedactionRegistryRevision } from "./secret-redaction-registry-DorVHn0l.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { u as isSqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-m7NE2aEm.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpPONdtx.mjs";
import { s as assertSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { a as prepareSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-DP2BCaGd.mjs";
import { r as prepareTranscriptMessageAppendForWorker } from "./session-accessor.sqlite-transcript-message-append-J9plH1Sq.mjs";
import { t as isTranscriptMessageAppendCurrentTail } from "./session-accessor.sqlite-transcript-append-result-BjgvnUCa.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BXDxJQSp.mjs";
import { t as SessionTranscriptMessageCommittedError } from "./session-manager-message-error-C6BAQhGS.mjs";
import { t as captureSessionMessageAdmission } from "./session-manager-message-admission-BHdwfpGy.mjs";
//#region src/agents/sessions/session-manager-message-runtime.ts
const moduleUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionManagerMetadata);
/** The existing session domain owns the transaction; only committed facts return to its caller. */
async function appendSessionTranscriptMessage(input) {
	const readRedactPatterns = () => input.config?.logging?.redactPatterns ?? readLoggingConfig()?.redactPatterns;
	let redactionRevision = getSecretRedactionRegistryRevision();
	let redactPatterns = readRedactPatterns()?.slice();
	const prepared = prepareTranscriptMessageAppendForWorker(input);
	Object.freeze(prepared.persistedMessage);
	const assertPrepared = () => {
		input.assertCurrent();
		const revision = getSecretRedactionRegistryRevision();
		const patterns = readRedactPatterns();
		if (revision !== redactionRevision || patterns?.length !== redactPatterns?.length || patterns?.some((pattern, index) => pattern !== redactPatterns?.[index])) {
			if (prepareTranscriptMessageAppendForWorker(input).messageJson !== prepared.messageJson) throw new Error("Transcript message redaction changed before persistence");
			redactionRevision = revision;
			redactPatterns = patterns?.slice();
		}
	};
	assertPrepared();
	const resolved = await prepareSqliteTranscriptReadScope(input.target);
	const options = toDatabaseOptions(resolved);
	const databasePath = resolveOpenClawAgentSqlitePath(options);
	const assertCurrent = () => {
		assertPrepared();
		assertSessionStoreReadCandidate(databasePath, [input.candidate]);
	};
	assertCurrent();
	const admission = captureSessionMessageAdmission(assertCurrent);
	const execution = captureOpenClawAgentDatabaseExecution(options);
	const { env: _env, ...writeTarget } = input.target;
	let worker;
	let committed;
	const failures = [];
	try {
		worker = await openOpenClawAgentSqliteWorkerStore(options, { execution }, {
			moduleUrl,
			input: void 0,
			assertAdmission: admission.assertAdmission
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
			const snapshot = reply.value.snapshot;
			if (!snapshot.ok) throw new Error("Session transcript message was not persisted", { cause: snapshot.error });
			if (!snapshot.value.result) throw new Error("Session transcript message was not persisted");
			committed = {
				messageId: snapshot.value.result.messageId,
				message: snapshot.value.result.message ?? prepared.persistedMessage,
				appended: snapshot.value.result.appended,
				currentTail: isTranscriptMessageAppendCurrentTail(snapshot.value),
				version: snapshot.value.after,
				lifecycleRevision: snapshot.value.lifecycleRevision
			};
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
		try {
			await worker?.close();
		} catch (error) {
			failures.push(error);
		}
		try {
			await execution.release();
		} catch (error) {
			failures.push(error);
		}
	}
	try {
		if (failures.length > 1) throw createSqliteLifecycleAggregateError(failures, "Session transcript append and cleanup failed", failures[0]);
		if (failures.length === 1) throw failures[0];
		assertCurrent();
	} catch (error) {
		if (committed) throw new SessionTranscriptMessageCommittedError(committed.messageId, error, input.target, committed.version, committed.lifecycleRevision);
		if (error instanceof Error && collectNestedErrorCandidates(error).some((cause) => isSqliteWorkerError(cause, "outcome-unknown"))) recordModelFallbackStop(error);
		throw error;
	}
	if (!committed) throw new Error("Session transcript message was not persisted");
	return {
		messageId: committed.messageId,
		message: committed.message,
		appended: committed.appended,
		currentTail: committed.currentTail
	};
}
//#endregion
export { appendSessionTranscriptMessage };
