import { n as runOpenClawAgentWorkerWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { i as ConversationDeliveryMissingError, r as ConversationDeliveryInputError } from "./conversation-delivery-policy-BttgDEjN.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { g as targetDiscoveryLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as createSessionWorkerExecutionSource } from "./session-worker-execution-source-CQwDQ8va.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { n as pinConversationDatabaseScope } from "./conversation-registry-DdNx9ZQ8.mjs";
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
	const memory = captureSessionActorStorageOwner({
		agentId: scope.databaseAgentId ?? scope.agentId,
		storePath: scope.storePath,
		env: scope.env
	}, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) {
		const binding = memory.binding && memory.binding.agentId === memory.agentId && memory.binding.path === memory.path ? memory.binding : void 0;
		return deliveryResult(async () => binding ? binding.actor.storage.read({
			type: "session.conversation.delivery.read",
			input: lookup
		}, memory.authority) : memory.owner?.readConversationAfterWrites({
			type: "session.conversation.delivery.read",
			input: lookup
		}, memory.authority));
	}
	const { options, scope: preparedScope } = pinConversationDatabaseScope(scope);
	const captured = structuredClone(lookup);
	return deliveryResult(() => runOpenClawAgentWriteAdmission(options, () => withSessionHistoryWorkerDatabase(options, (reader) => reader.readConversationDelivery({
		lookup: captured,
		env: preparedScope.env
	}), targetDiscoveryLane)));
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
function writeConversationDelivery(scope, ...[type, input, assertCurrent = () => {}]) {
	const memory = captureSessionActorStorageOwner({
		agentId: scope.databaseAgentId ?? scope.agentId,
		storePath: scope.storePath,
		env: scope.env
	}, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) return deliveryResult(async () => {
		const authority = {
			...memory.authority,
			assertCurrent() {
				memory.authority.assertCurrent();
				assertCurrent();
			}
		};
		const binding = memory.binding && memory.binding.agentId === memory.agentId && memory.binding.path === memory.path ? memory.binding : void 0;
		if (!binding) {
			if (!memory.owner) throw new ConversationDeliveryMissingError("Conversation delivery owner is missing");
			return type === "conversation.delivery.begin" ? memory.owner.mutateConversation({
				type: "session.conversation.delivery.begin",
				input
			}, authority) : memory.owner.mutateConversation({
				type: "session.conversation.delivery.transition",
				input
			}, authority);
		}
		const outcome = type === "conversation.delivery.begin" ? await binding.actor.storage.mutate({
			type: "session.conversation.delivery.begin",
			input
		}, authority) : await binding.actor.storage.mutate({
			type: "session.conversation.delivery.transition",
			input
		}, authority);
		return readSessionActorStorageResult(outcome);
	});
	const { options } = pinConversationDatabaseScope(scope);
	const execution = captureOpenClawAgentDatabaseExecution(options);
	const captured = structuredClone(input);
	return deliveryResult(async () => {
		try {
			const result = await runOpenClawAgentWorkerWrite(options, () => execution.runExisting(createSessionWorkerExecutionSource(assertCurrent, "Conversation delivery authority expired"), (worker) => worker.execute({
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
async function markConversationDeliveryQueued(scope, operationId, queueId) {
	return writeConversationDelivery(scope, "conversation.delivery.transition", {
		operationId,
		status: "queued",
		queueId,
		allowedFrom: ["created"]
	});
}
async function markConversationDeliverySent(scope, operationId, platformMessageId) {
	return writeConversationDelivery(scope, "conversation.delivery.transition", {
		operationId,
		status: "sent",
		...platformMessageId ? { platformMessageId } : {},
		allowedFrom: ["created", "queued"]
	});
}
async function markConversationDeliverySuppressed(scope, operationId) {
	return writeConversationDelivery(scope, "conversation.delivery.transition", {
		operationId,
		status: "suppressed",
		allowedFrom: ["created", "queued"]
	});
}
async function markConversationDeliveryRejected(scope, operationId, rejectionError) {
	const normalizedError = rejectionError.trim();
	if (!normalizedError) throw new Error("Conversation delivery rejection error is required");
	return writeConversationDelivery(scope, "conversation.delivery.transition", {
		operationId,
		status: "rejected",
		rejectionError: normalizedError,
		allowedFrom: ["created", "queued"]
	});
}
async function markConversationDeliveryUnknown(scope, operationId) {
	return writeConversationDelivery(scope, "conversation.delivery.transition", {
		operationId,
		status: "unknown",
		allowedFrom: ["created", "queued"]
	});
}
async function markConversationDeliveryReplied(scope, params, assertCurrent) {
	return writeConversationDelivery(scope, "conversation.delivery.transition", {
		operationId: params.operationId,
		status: "replied",
		reply: params.reply,
		allowedFrom: ["queued", "sent"],
		session: params.session
	}, assertCurrent);
}
//#endregion
export { markConversationDeliveryRejected as a, markConversationDeliverySuppressed as c, markConversationDeliveryQueued as i, markConversationDeliveryUnknown as l, findConversationTurnDeliveryByReplyTarget as n, markConversationDeliveryReplied as o, getConversationDeliveryOperation as r, markConversationDeliverySent as s, beginConversationDeliveryOperation as t };
