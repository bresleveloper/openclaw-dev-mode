import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CUdBruRD.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, o as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { n as runOpenClawAgentWorkerWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { o as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { o as mergeRestartRecoveryTerminalDeliveryEvidence } from "./restart-recovery-state-IiHiWzPq.mjs";
import { n as pinConversationDatabaseScope } from "./conversation-registry-BBlnTeMo.mjs";
import { r as getOwedHarnessCompletionTask } from "./agent-harness-completion-recovery-DUkxTVTf.mjs";
import { i as resolveMessageReceiptPrimaryId } from "./receipt-Be_FOFUF.mjs";
import { n as ConversationDeliveryMissingError, t as ConversationDeliveryInputError } from "./conversation-delivery-store.types-CMzZxTv2.mjs";
import { n as resolveDeliveryQueueStateEnv } from "./delivery-queue-state-context-BiGOf1E1.mjs";
import "./delivery-queue-sqlite-CZH3GILC.mjs";
//#region src/config/sessions/conversation-delivery-store.ts
async function deliveryResult(operation) {
	try {
		return await operation();
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === "ConversationDeliveryInputError") throw new ConversationDeliveryInputError(error.message);
			if (error.name === "ConversationDeliveryMissingError") throw new ConversationDeliveryMissingError(error.message);
		}
		throw error;
	}
}
function readConversationDelivery(scope, lookup) {
	const { options, scope: preparedScope } = pinConversationDatabaseScope(scope);
	const captured = structuredClone(lookup);
	return deliveryResult(() => runOpenClawAgentWriteAdmission(options, () => withSessionHistoryWorkerDatabase(options, (reader) => reader.readConversationDelivery({
		lookup: captured,
		env: preparedScope.env
	}))));
}
async function getConversationDeliveryOperation(scope, operationId, expectedInput) {
	return readConversationDelivery(scope, {
		operationId,
		expectedInput
	});
}
async function findConversationTurnDeliveryByReplyTarget(scope, params) {
	return readConversationDelivery(scope, params);
}
function writeConversationDelivery(scope, type, input, assertCurrent = () => {}) {
	const { options } = pinConversationDatabaseScope(scope);
	const execution = captureOpenClawAgentDatabaseExecution(options);
	const captured = structuredClone(input);
	return deliveryResult(async () => {
		try {
			const result = await runOpenClawAgentWorkerWrite(options, () => execution.runExisting({
				assertCurrent,
				createAdmission(binding) {
					return () => ({
						nativeLocations: binding.nativeLocations,
						admission: createSqliteWorkerOperationAdmission((request, grant) => {
							binding.authorize(request);
							assertCurrent();
							if (!grant()) throw new Error("Conversation delivery authority expired");
						}, binding.attachment)
					});
				}
			}, (worker) => worker.execute({
				type,
				input: captured
			})));
			if (!result) throw new ConversationDeliveryMissingError("Conversation delivery database is missing");
			return result;
		} finally {
			await execution.release();
		}
	});
}
async function beginConversationDeliveryOperation(scope, params, assertCurrent) {
	return writeConversationDelivery(scope, "conversation.delivery.begin", params, assertCurrent);
}
function updateConversationDeliveryOperation(scope, params, assertCurrent) {
	return writeConversationDelivery(scope, "conversation.delivery.transition", params, assertCurrent);
}
async function markConversationDeliveryQueued(scope, operationId, queueId) {
	return updateConversationDeliveryOperation(scope, {
		operationId,
		status: "queued",
		queueId,
		allowedFrom: ["created"]
	});
}
async function markConversationDeliverySent(scope, operationId, platformMessageId) {
	return updateConversationDeliveryOperation(scope, {
		operationId,
		status: "sent",
		...platformMessageId ? { platformMessageId } : {},
		allowedFrom: ["created", "queued"]
	});
}
async function markConversationDeliverySuppressed(scope, operationId) {
	return updateConversationDeliveryOperation(scope, {
		operationId,
		status: "suppressed",
		allowedFrom: ["created", "queued"]
	});
}
async function markConversationDeliveryRejected(scope, operationId, rejectionError) {
	const normalizedError = rejectionError.trim();
	if (!normalizedError) throw new Error("Conversation delivery rejection error is required");
	return updateConversationDeliveryOperation(scope, {
		operationId,
		status: "rejected",
		rejectionError: normalizedError,
		allowedFrom: ["created", "queued"]
	});
}
async function markConversationDeliveryUnknown(scope, operationId) {
	return updateConversationDeliveryOperation(scope, {
		operationId,
		status: "unknown",
		allowedFrom: ["created", "queued"]
	});
}
async function markConversationDeliveryReplied(scope, params, assertCurrent) {
	return updateConversationDeliveryOperation(scope, {
		operationId: params.operationId,
		status: "replied",
		reply: params.reply,
		allowedFrom: ["queued", "sent"],
		session: params.session
	}, assertCurrent);
}
//#endregion
//#region src/infra/outbound/delivery-completion.ts
function captureConversationDeliveryTarget(scope) {
	return {
		workerContext: captureOpenClawStateWorkerContext({ env: scope.env }),
		agentId: scope.agentId,
		databaseAgentId: scope.databaseAgentId,
		storePath: scope.storePath,
		stateDir: resolveStateDir(scope.env),
		...isGatewayExternallySupervised(scope.env) ? { supervisorMode: "external" } : {}
	};
}
function resolveConversationDeliveryScope(completion, stateDir, stateContext, target) {
	const scope = {
		agentId: completion.agentId,
		...completion.storePath ? { storePath: completion.storePath } : {},
		env: resolveDeliveryQueueStateEnv(stateDir, target ?? stateContext)
	};
	if (!target) return scope;
	const options = toDatabaseOptions(resolveSqliteReadScope(scope));
	if (normalizeAgentId(scope.agentId) !== normalizeAgentId(target.agentId) || options.agentId !== target.databaseAgentId || !isSameOpenClawAgentDatabasePath(resolveOpenClawAgentSqlitePath(options), target.storePath)) throw new Error("Conversation delivery target does not match durable custody");
	return {
		...scope,
		storePath: target.storePath,
		databaseAgentId: target.databaseAgentId
	};
}
async function conversationResult(completion, update, stateDir, stateContext, target) {
	let record;
	try {
		record = await update(resolveConversationDeliveryScope(completion, stateDir, stateContext, target));
	} catch (error) {
		if (error instanceof ConversationDeliveryMissingError) return { state: "stale" };
		throw error;
	}
	const delivered = record.status === "sent" || record.status === "replied";
	return {
		state: delivered ? "delivered" : record.status === "suppressed" || record.status === "rejected" || record.status === "unknown" ? record.status : "queued",
		...delivered && (record.platformMessageId || record.preparedMessageId) ? { platformMessageId: record.platformMessageId ?? record.preparedMessageId } : {},
		...record.status === "rejected" && record.rejectionError ? { rejectionError: record.rejectionError } : {}
	};
}
async function settlePendingFinalDelivery(completion, state, expectedStates, options = {}) {
	let settled = "stale";
	let wakeRecovery = false;
	await patchSessionEntryCore({
		agentId: completion.agentId,
		sessionKey: completion.sessionKey,
		storePath: completion.storePath,
		env: resolveDeliveryQueueStateEnv(options.stateDir, options.stateContext)
	}, (entry) => {
		const internalEntry = entry;
		if (internalEntry.sessionId !== completion.sessionId || internalEntry.pendingFinalDelivery?.intentId !== completion.intentId) return null;
		const deliveries = internalEntry.pendingFinalDelivery.deliveries;
		const index = deliveries?.findIndex(({ id }) => id === completion.deliveryId) ?? -1;
		if (!deliveries || index < 0) return null;
		const authority = completion.sessionWriterDeliveryAuthority;
		const claim = authority?.harnessCompletion;
		if (completion.agentId !== void 0 && (authority?.agentId !== void 0 && normalizeAgentId(authority.agentId) !== normalizeAgentId(completion.agentId) || claim && normalizeAgentId(claim.requesterAgentId) !== normalizeAgentId(completion.agentId))) return null;
		if (claim && (!authority || authority.sessionKey !== completion.sessionKey || authority.storePath !== void 0 && authority.storePath !== completion.storePath || claim.requesterSessionKey !== completion.sessionKey || claim.sessionId !== completion.sessionId || authority.expectedSessionId !== completion.sessionId || authority.agentId !== void 0 && authority.agentId !== claim.requesterAgentId || authority.expectedLifecycleRevision !== void 0 && authority.expectedLifecycleRevision !== internalEntry.lifecycleRevision || authority.expectedWriterRunId !== void 0 && authority.expectedWriterRunId !== internalEntry.activeWriterRunId || !getOwedHarnessCompletionTask(claim, internalEntry))) return null;
		const current = deliveries[index].state;
		if (expectedStates && !expectedStates.some((expected) => expected === current)) return null;
		settled = current === "delivered" || current === "suppressed" || current === "unknown" && state === "unknown" ? current : state;
		const pending = internalEntry.pendingFinalDelivery;
		const existingNotice = internalEntry.pendingDeliveryNotice;
		const owedNotice = settled === "unknown" && (current === "queued" || current === "unknown") && pending.context && pending.intentId && existingNotice?.intentId !== pending.intentId && (!existingNotice || existingNotice.createdAt <= pending.createdAt) ? { pendingDeliveryNotice: {
			createdAt: pending.createdAt,
			context: pending.context,
			intentId: pending.intentId,
			state: "owed"
		} } : void 0;
		const updatedDeliveries = deliveries.with(index, {
			id: completion.deliveryId,
			state: settled
		});
		const result = options.identifiedResult;
		const platformMessageId = result ? readPlatformMessageId(result) : void 0;
		const context = pending.context;
		const terminalEvidence = claim && result && platformMessageId && result.channel === context?.channel && context?.to && (!result.target || result.target.id === context.to) && settled === "delivered" && updatedDeliveries.every((delivery) => delivery.state === "delivered") ? mergeRestartRecoveryTerminalDeliveryEvidence(internalEntry.restartRecoveryTerminalDeliveryEvidence, [{
			runId: claim.sourceRunId,
			harnessCompletion: claim,
			deliveryContext: context,
			captured: true,
			payloads: [{ visible: true }],
			deliveryStatus: {
				status: "sent",
				resultCount: 1
			},
			durableFinalReceipt: {
				intentId: completion.intentId,
				deliveryId: completion.deliveryId,
				platformMessageId
			}
		}]) : void 0;
		const clearsNotice = existingNotice?.state !== "acknowledged" && !updatedDeliveries.some((delivery) => delivery.state === "unknown") && settled !== "queued" && settled !== "unknown" && existingNotice?.intentId === pending.intentId;
		if (settled === current && !owedNotice && !clearsNotice && !terminalEvidence) return null;
		wakeRecovery = settled !== "queued" && internalEntry.status === "running" && internalEntry.abortedLastRun === true;
		return {
			...internalEntry.mainRestartRecovery ? { mainRestartRecovery: {
				...internalEntry.mainRestartRecovery,
				revision: internalEntry.mainRestartRecovery.revision + 1
			} } : {},
			pendingFinalDelivery: {
				...internalEntry.pendingFinalDelivery,
				deliveries: updatedDeliveries
			},
			...clearsNotice ? { pendingDeliveryNotice: void 0 } : owedNotice,
			...terminalEvidence ? { restartRecoveryTerminalDeliveryEvidence: terminalEvidence } : {}
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true,
		preserveActivity: options.preserveActivity,
		workerGuard: {}
	});
	if (wakeRecovery) {
		const { scheduleMainSessionRecoveryPendingTarget } = await import("./main-session-recovery-owner-release-C9ZWvfgG.mjs");
		scheduleMainSessionRecoveryPendingTarget({
			...completion.agentId !== void 0 ? { agentId: completion.agentId } : {},
			sessionId: completion.sessionId,
			sessionKey: completion.sessionKey,
			...options.stateDir !== void 0 ? { stateDir: options.stateDir } : {},
			storePath: completion.storePath
		});
	}
	return { state: settled };
}
function readPlatformMessageId(result) {
	return (result.receipt ? resolveMessageReceiptPrimaryId(result.receipt) : void 0) ?? (result.messageId.trim() || void 0);
}
/** Records queue ownership before either the live sender or recovery crosses platform I/O. */
async function markDurableDeliveryQueued(completion, queueId, expectedPendingFinalState, stateDir, stateContext, target) {
	return completion.kind === "pending-final" ? await settlePendingFinalDelivery(completion, "queued", expectedPendingFinalState ? ["prepared", "queued"] : void 0, {
		stateDir,
		stateContext
	}) : conversationResult(completion, (scope) => markConversationDeliveryQueued(scope, completion.operationId, queueId), stateDir, stateContext, target);
}
/** Finalizes owner state from identified platform evidence before queue acknowledgement. */
async function completeDurableDelivery(completion, result, stateDir, stateContext, target) {
	return completion.kind === "pending-final" ? await settlePendingFinalDelivery(completion, "delivered", void 0, {
		stateDir,
		stateContext,
		identifiedResult: result
	}) : conversationResult(completion, (scope) => markConversationDeliverySent(scope, completion.operationId, readPlatformMessageId(result)), stateDir, stateContext, target);
}
/** Finalizes a policy-suppressed send before its durable intent is acknowledged. */
async function suppressDurableDelivery(completion, stateDir, stateContext, target) {
	return completion.kind === "pending-final" ? await settlePendingFinalDelivery(completion, "suppressed", void 0, {
		stateDir,
		stateContext
	}) : conversationResult(completion, (scope) => markConversationDeliverySuppressed(scope, completion.operationId), stateDir, stateContext, target);
}
/** Finalizes a permanent provider rejection that provably preceded platform I/O. */
async function rejectDurableDelivery(completion, error, stateDir, stateContext, target) {
	return completion.kind === "pending-final" ? await settlePendingFinalDelivery(completion, "suppressed", void 0, {
		stateDir,
		stateContext
	}) : conversationResult(completion, (scope) => markConversationDeliveryRejected(scope, completion.operationId, error), stateDir, stateContext, target);
}
/** Makes a dead-lettered durable send terminal without allowing a blind replay. */
async function failDurableDelivery(completion, stateDir, stateContext, target) {
	return completion.kind === "pending-final" ? await settlePendingFinalDelivery(completion, "unknown", void 0, {
		stateDir,
		stateContext
	}) : conversationResult(completion, (scope) => markConversationDeliveryUnknown(scope, completion.operationId), stateDir, stateContext, target);
}
/** Settles the completion owner from the final evidence held by its lifecycle owner. */
async function settleDurableDelivery(completion, evidence, stateDir, stateContext, target) {
	return "result" in evidence ? completeDurableDelivery(completion, evidence.result, stateDir, stateContext, target) : evidence.platformSendStarted ? failDurableDelivery(completion, stateDir, stateContext, target) : suppressDurableDelivery(completion, stateDir, stateContext, target);
}
//#endregion
export { rejectDurableDelivery as a, settlePendingFinalDelivery as c, getConversationDeliveryOperation as d, markConversationDeliveryReplied as f, markDurableDeliveryQueued as i, beginConversationDeliveryOperation as l, markConversationDeliverySuppressed as m, completeDurableDelivery as n, resolveConversationDeliveryScope as o, markConversationDeliverySent as p, failDurableDelivery as r, settleDurableDelivery as s, captureConversationDeliveryTarget as t, findConversationTurnDeliveryByReplyTarget as u };
