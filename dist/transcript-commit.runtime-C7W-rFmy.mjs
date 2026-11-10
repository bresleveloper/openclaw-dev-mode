import "./src-Djeo9OvP.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { l as resolveTerminalAssistantTranscriptRunId, n as attachSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { m as prepareWorkerTurnTranscriptMessage } from "./placement-turn-claim-events-C-F0mgX3.mjs";
import { _ as isCommittedAgentMessage } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { s as publishSessionEntryWorkerMetadataInvalidation } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { r as readTranscriptMessageIdempotencyKey } from "./session-transcript-entry-message-Q75Efb-t.mjs";
import { r as getSessionActorStorageBinding } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { s as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { n as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import { f as sanitizeTranscriptMessage, o as sanitizeTranscriptMessageForStorage } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { h as withOwnedSessionTranscriptWriterFence, i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { n as publishTranscriptUpdate } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { r as restoreSessionColdTranscript } from "./session-cold-storage-BJd_oJjB.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-CHjQRvEC.mjs";
//#region src/gateway/worker-environments/transcript-commit.runtime.ts
const log = createSubsystemLogger("gateway/worker-transcript");
const moduleUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.workerTranscriptCommit);
async function applyWorkerTranscriptCommit(params) {
	const target = withOwnedSessionTranscriptWriterFence({
		...captureSessionTranscriptTargetBinding(params.target),
		expectedLifecycleRevision: params.target.expectedLifecycleRevision,
		expectedWriterRunId: params.target.expectedWriterRunId
	});
	const assertOwned = captureOwnedTranscriptWriteAssertion(target);
	const assertCurrent = () => {
		params.assertCurrent();
		assertOwned();
	};
	assertCurrent();
	const normalizedMessages = params.messages.map((message) => attachSessionTranscriptRunId(sanitizeTranscriptMessage(message), params.runId));
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
		const messages = normalizedMessages.slice(recoveredCount);
		if (!messages.every(isCommittedAgentMessage)) return;
		return messages.map((message) => {
			if (message.role === "assistant") {
				Object.assign(message, prepareWorkerTurnTranscriptMessage(params.identity, message));
				applyAssistantDeliveryDirectives(message);
			}
			return sanitizeTranscriptMessageForStorage(message);
		});
	};
	let applied;
	let memoryOutcome;
	const memory = getSessionActorStorageBinding(target);
	if (memory) {
		const preparedMessages = prepareFresh(0);
		if (!preparedMessages) return {
			ok: false,
			reason: "invalid-batch"
		};
		const { scope: _scope, ...batch } = input;
		if (!params.memoryReceipt) throw new Error("Memory transcript commit requires its batch receipt");
		const outcome = await memory.actor.storage.mutate({
			type: "session.workerTranscript.commit",
			input: {
				scope: target,
				batch,
				preparedMessages,
				receipt: params.memoryReceipt
			}
		}, {
			...memory.authority,
			assertCurrent() {
				memory.authority.assertCurrent();
				assertCurrent();
			}
		});
		const committed = readSessionActorStorageResult(outcome);
		applied = committed.result;
		memoryOutcome = committed.outcome;
	} else {
		const options = toDatabaseOptions(resolveSqliteTranscriptScope(target));
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
						sessionKey: target.sessionKey,
						entry: committed.entry
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
		for (const close of [() => worker?.close(), () => execution.release()]) try {
			await close();
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
	if (!applied.ok) return {
		...applied,
		...memoryOutcome ? { memoryOutcome } : {}
	};
	for (const message of applied.messages) {
		const itemId = message.message.role === "assistant" ? params.assistantItemIds.get(readTranscriptMessageIdempotencyKey(message.message) ?? "") : void 0;
		if (!message.appended && (!itemId || message.messageSeq === void 0)) continue;
		const runId = resolveTerminalAssistantTranscriptRunId(message.message, params.runId);
		assertCurrent();
		await publishTranscriptUpdate(params.target, {
			lifecycleRevision: applied.lifecycleRevision,
			message: message.message,
			messageId: message.messageId,
			messageSeq: message.messageSeq,
			...itemId ? { assistantItemIds: [itemId] } : {},
			...runId ? { runId } : {}
		});
	}
	return {
		...applied,
		...memoryOutcome ? { memoryOutcome } : {}
	};
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
	const config = options.getConfig();
	const target = withOwnedSessionTranscriptWriterFence({
		...captureSessionTranscriptTargetBinding(params.sessionTarget),
		expectedLifecycleRevision: params.sessionTarget.expectedLifecycleRevision,
		expectedWriterRunId: params.sessionTarget.expectedWriterRunId
	});
	const assistantItemIds = /* @__PURE__ */ new Map();
	const messages = params.request.messages.map((message, index) => {
		const idempotencyKey = `worker-commit-${sha256Base64Url([
			sessionId,
			params.request.runEpoch,
			params.request.seq,
			index
		].join("\0"))}`;
		if (message.role === "assistant") {
			const { itemId, ...assistant } = structuredClone(message);
			if (itemId) assistantItemIds.set(idempotencyKey, itemId);
			return {
				...assistant,
				idempotencyKey
			};
		}
		return {
			...structuredClone(message),
			idempotencyKey
		};
	});
	const requestedBaseLeafId = params.request.baseLeafId;
	if (getSessionActorStorageBinding(target)) {
		const applied = await applyWorkerTranscriptCommit({
			assertCurrent: params.assertCurrent,
			config,
			identity: params.identity,
			messages,
			assistantItemIds,
			recoverPersistedBatch: false,
			memoryReceipt: input,
			requestedBaseLeafId,
			runId: params.identity.runId,
			target
		});
		if (!applied.memoryOutcome) throw new Error("Memory transcript commit omitted its batch receipt");
		return applied.memoryOutcome;
	}
	if (!store) throw new Error("Durable transcript commit requires its ledger");
	const complete = (outcome) => store.complete({
		...input,
		outcome
	}, params.assertCurrent);
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
			assistantItemIds,
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
