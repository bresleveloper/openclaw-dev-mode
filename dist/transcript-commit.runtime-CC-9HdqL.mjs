import "./src-CdRlGRnW.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveTerminalAssistantTranscriptRunId, t as attachSessionTranscriptRunId } from "./transcript-events-DUHAZLVw.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-WjVavOYj.mjs";
import { i as captureOwnedTranscriptWriteAssertion, u as withOwnedSessionTranscriptWriterFence } from "./transcript-write-context-m7NE2aEm.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpPONdtx.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { d as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Dv1lK4ND.mjs";
import { m as publishSessionEntryWorkerMetadataInvalidation } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { p as publishTranscriptUpdate } from "./session-history-eviction-Cj2-Mfrh.mjs";
import { h as redactTranscriptMessage, l as redactTranscriptMessageForStorage } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { m as withTranscriptWriteTransaction } from "./session-accessor.sqlite-transcript-write-Kl-_Ewp0.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-Dcmz1NrH.mjs";
import { n as isCommittedAgentMessage, r as prepareTranscriptCommit, t as applyPreparedTranscriptCommit } from "./transcript-commit.kernel-CqIUShGF.mjs";
import { p as prepareWorkerTurnTranscriptMessage } from "./placement-turn-claim-events-BCSz3C5d.mjs";
import { n as restoreSessionColdTranscript } from "./session-cold-storage-VucmqvVN.mjs";
//#region src/gateway/worker-environments/transcript-commit.runtime.ts
const log = createSubsystemLogger("gateway/worker-transcript");
const moduleUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.workerTranscriptCommit);
async function applyWorkerTranscriptCommit(params) {
	const target = withOwnedSessionTranscriptWriterFence({
		...captureSessionTranscriptTargetBinding(params.target),
		expectedLifecycleRevision: params.target.expectedLifecycleRevision,
		expectedWriterRunId: params.target.expectedWriterRunId
	});
	const options = toDatabaseOptions(resolveSqliteTranscriptScope(target));
	const assertOwned = captureOwnedTranscriptWriteAssertion(target);
	const assertCurrent = () => {
		params.assertCurrent();
		assertOwned();
	};
	assertCurrent();
	const redactedMessages = params.messages.map((message) => attachSessionTranscriptRunId(redactTranscriptMessage(message, params.config), params.runId));
	const { env: _env, ...scope } = target;
	const input = {
		scope,
		messages: params.messages,
		lifecycleRevision: target.expectedLifecycleRevision,
		requestedBaseLeafId: params.requestedBaseLeafId,
		recoverPersistedBatch: params.recoverPersistedBatch,
		cwd: process.cwd()
	};
	const prepareFresh = (recoveredCount) => {
		const messages = redactedMessages.slice(recoveredCount);
		if (!messages.every(isCommittedAgentMessage)) return;
		return messages.map((message) => {
			if (message.role === "assistant") {
				Object.assign(message, prepareWorkerTurnTranscriptMessage(params.identity, message));
				applyAssistantDeliveryDirectives(message);
			}
			return redactTranscriptMessageForStorage(message, { config: params.config });
		});
	};
	let applied;
	if (isIncognitoSessionKey(target.sessionKey)) {
		let projectionNeedsReconcile = false;
		applied = await withTranscriptWriteTransaction(target, () => {
			assertCurrent();
			const nativeInput = {
				...input,
				scope: target
			};
			const plan = prepareTranscriptCommit(nativeInput);
			if (!plan.result.ok || plan.result.messages.length === input.messages.length) return plan.result;
			const messages = prepareFresh(plan.result.messages.length);
			if (!messages) return {
				ok: false,
				reason: "invalid-batch"
			};
			const result = applyPreparedTranscriptCommit(nativeInput, plan, messages, () => {
				projectionNeedsReconcile = true;
			});
			assertCurrent();
			return result;
		});
		if (projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
			...options,
			preferredSessionId: target.sessionId
		});
	} else {
		await restoreSessionColdTranscript(target, assertCurrent);
		assertCurrent();
		const execution = captureOpenClawAgentDatabaseExecution(options);
		let worker;
		let outcome;
		try {
			worker = await openOpenClawAgentSqliteWorkerStore(options, { execution }, {
				moduleUrl,
				input: void 0
			});
			outcome = {
				ok: true,
				value: await worker.run(async (writer) => {
					const databaseIdentity = execution.fileIdentity;
					if (!databaseIdentity) throw new Error("Worker transcript has no prepared database identity");
					const plan = await writer.execute({
						type: "transcript.prepare",
						input: {
							...input,
							scope: {
								...scope,
								storePath: databaseIdentity.nativeLocation
							}
						}
					});
					assertCurrent();
					if (!plan.ok || plan.messages.length === input.messages.length) return plan;
					const messages = prepareFresh(plan.messages.length);
					if (!messages) return {
						ok: false,
						reason: "invalid-batch"
					};
					assertCurrent();
					const committed = await writer.execute({
						type: "transcript.commit",
						input: { messages }
					});
					if (committed.result.ok && committed.result.messages.some((message) => message.appended)) publishSessionEntryWorkerMetadataInvalidation({
						agentId: target.agentId,
						storePath: execution.path,
						databaseIdentity: databaseIdentity.physicalIdentity,
						sessionKey: target.sessionKey
					});
					if (committed.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
						...options,
						preferredSessionId: target.sessionId
					});
					return committed.result;
				}, assertCurrent)
			};
		} catch (error) {
			outcome = {
				ok: false,
				error
			};
		}
		const cleanupFailures = [];
		try {
			await worker?.close();
		} catch (error) {
			cleanupFailures.push(error);
		}
		try {
			await execution.release();
		} catch (error) {
			cleanupFailures.push(error);
		}
		if (cleanupFailures.length > 0) {
			const cleanupError = createSqliteLifecycleAggregateError([...outcome.ok ? [] : [outcome.error], ...cleanupFailures], "Worker transcript operation and cleanup failed", outcome.ok ? cleanupFailures[0] : outcome.error ?? cleanupFailures[0]);
			if (!outcome.ok) throw cleanupError;
			try {
				log.warn(`Worker transcript completed before cleanup failed: ${formatErrorMessage(cleanupError)}`);
			} catch {}
		}
		if (!outcome.ok) throw outcome.error;
		applied = outcome.value;
	}
	if (!applied.ok) return applied;
	for (const message of applied.messages) {
		if (!message.appended) continue;
		const runId = resolveTerminalAssistantTranscriptRunId(message.message, params.runId);
		await publishTranscriptUpdate(params.target, {
			lifecycleRevision: applied.lifecycleRevision,
			message: message.message,
			messageId: message.messageId,
			messageSeq: message.messageSeq,
			...runId ? { runId } : {}
		});
	}
	return applied;
}
async function commitWorkerTranscript(options, store, sessionId, params) {
	const input = {
		environmentId: params.identity.environmentId,
		sessionId,
		runEpoch: params.request.runEpoch,
		seq: params.request.seq,
		requestHash: sha256Hex(stableStringify({
			baseLeafId: params.request.baseLeafId,
			messages: params.request.messages
		}))
	};
	const complete = (outcome) => store.complete({
		...input,
		outcome
	}, params.assertCurrent);
	const config = options.getConfig();
	const target = withOwnedSessionTranscriptWriterFence({
		...captureSessionTranscriptTargetBinding(params.sessionTarget),
		expectedLifecycleRevision: params.sessionTarget.expectedLifecycleRevision,
		expectedWriterRunId: params.sessionTarget.expectedWriterRunId
	});
	const messages = params.request.messages.map((message, index) => ({
		...structuredClone(message),
		idempotencyKey: `worker-commit-${sha256Base64Url([
			sessionId,
			params.request.runEpoch,
			params.request.seq,
			index
		].join("\0"))}`
	}));
	const requestedBaseLeafId = params.request.baseLeafId;
	params.assertCurrent();
	const started = await store.begin(input, params.assertCurrent);
	if (started.kind === "replay") {
		params.assertCurrent();
		return started.outcome;
	}
	if (started.kind === "rejected") {
		params.assertCurrent();
		return {
			ok: false,
			reason: "invalid-batch"
		};
	}
	let authorityFailure;
	let applied;
	try {
		applied = await applyWorkerTranscriptCommit({
			assertCurrent: () => {
				try {
					params.assertCurrent();
				} catch (error) {
					authorityFailure = { error };
					throw error;
				}
			},
			config,
			identity: params.identity,
			messages,
			recoverPersistedBatch: started.kind === "recover",
			requestedBaseLeafId,
			runId: params.identity.runId,
			target
		});
	} catch (error) {
		if (started.kind === "claimed" && authorityFailure && authorityFailure.error === error) await store.discardUncommitted(input);
		throw error;
	}
	if (!applied.ok) return await complete({
		ok: false,
		reason: applied.reason
	});
	const entryIds = applied.messages.map((message) => message.messageId);
	const newLeafId = entryIds.at(-1);
	if (entryIds.length !== messages.length || !newLeafId) return await complete({
		ok: false,
		reason: "invalid-batch"
	});
	return await complete({
		ok: true,
		result: {
			entryIds,
			newLeafId
		}
	});
}
//#endregion
export { commitWorkerTranscript };
