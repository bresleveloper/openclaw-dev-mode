import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { c as readCurrentConversationBindingListInDatabase, d as readCurrentConversationBindingSelectionInDatabase, f as removeCurrentConversationBindingsInDatabase, l as readCurrentConversationBindingListsInDatabase, p as updateCurrentConversationBindingRecordInDatabase, r as bindCurrentConversationInDatabase, s as pruneCurrentConversationBindingListInTransaction, u as readCurrentConversationBindingResolutionInDatabase, v as withCurrentConversationBindingWorkerReceipt } from "./current-conversation-bindings.kernel-CQnqjy0h.mjs";
//#region src/infra/outbound/current-conversation-bindings.worker.ts
function runBindingTransaction(context, update, database = context.open()) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = withCurrentConversationBindingWorkerReceipt(db, () => update(db));
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return result;
	}, {
		database,
		...context.stateOptions()
	});
}
/** The caller holds the shared-state write transaction and current host admission. */
function touchCurrentConversationBindingInDatabase(db, input) {
	const conversation = input.conversation;
	return updateCurrentConversationBindingRecordInDatabase(db, conversation, (current) => {
		if (current?.bindingId !== input.bindingId) return current;
		if (!input.accountPolicy) return {
			...current,
			metadata: {
				...current.metadata,
				lastActivityAt: input.at
			}
		};
		const { idleTimeoutMs, maxAgeMs } = input.accountPolicy;
		const idleExpiresAt = idleTimeoutMs > 0 ? input.at + idleTimeoutMs : void 0;
		const maxAgeExpiresAt = maxAgeMs > 0 ? current.boundAt + maxAgeMs : void 0;
		return {
			bindingId: `${conversation.accountId}:${conversation.conversationId}`,
			targetSessionKey: current.targetSessionKey,
			targetKind: input.accountPolicy.targetKinds[current.targetKind],
			conversation,
			status: "active",
			boundAt: current.boundAt,
			expiresAt: idleExpiresAt != null && maxAgeExpiresAt != null ? Math.min(idleExpiresAt, maxAgeExpiresAt) : idleExpiresAt ?? maxAgeExpiresAt,
			metadata: {
				...current.metadata,
				agentId: typeof current.metadata?.agentId === "string" ? current.metadata.agentId : void 0,
				label: typeof current.metadata?.label === "string" ? current.metadata.label : void 0,
				boundBy: typeof current.metadata?.boundBy === "string" ? current.metadata.boundBy : void 0,
				lastActivityAt: input.at,
				idleTimeoutMs,
				maxAgeMs
			}
		};
	}).current;
}
const conversationBindingOperations = {
	"conversationBindings.bind": (input, { write }) => {
		return write(({ db }) => {
			const record = withCurrentConversationBindingWorkerReceipt(db, () => bindCurrentConversationInDatabase(db, input, (requiresAgentId) => requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: requiresAgentId
			})));
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return record;
		});
	},
	"conversationBindings.remove": (input, { write }) => {
		return write(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const records = withCurrentConversationBindingWorkerReceipt(db, () => removeCurrentConversationBindingsInDatabase(db, input));
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return records;
		});
	},
	"conversationBindings.readSelection": (input, { stateOptions }) => withExistingOpenClawStateDatabaseReadOnly(({ db }) => readCurrentConversationBindingSelectionInDatabase(db, input), stateOptions()) ?? input.map(() => null),
	"conversationBindings.listBySessions": (input, context) => {
		const database = context.open();
		const prepared = readCurrentConversationBindingListsInDatabase(database.db, input.targetSessionKeys, input.scope);
		if (!prepared.some((list) => list.requiresPrune)) return prepared.map((list) => list.records);
		return runBindingTransaction(context, (db) => prepared.map((list, index) => {
			const key = input.targetSessionKeys[index];
			const current = list.requiresPrune ? list : readCurrentConversationBindingListInDatabase(db, key, input.scope);
			return current.requiresPrune ? pruneCurrentConversationBindingListInTransaction(db, key, input.scope) : current.records;
		}), database);
	},
	"conversationBindings.resolve": (input, context) => {
		const database = context.open();
		const result = readCurrentConversationBindingResolutionInDatabase(database.db, input);
		if (!result.repair) return result.record;
		return runBindingTransaction(context, (db) => updateCurrentConversationBindingRecordInDatabase(db, input, (current) => current).current, database);
	},
	"conversationBindings.touch": (input, context) => runBindingTransaction(context, (db) => touchCurrentConversationBindingInDatabase(db, input))
};
//#endregion
export { conversationBindingOperations };
