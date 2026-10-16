import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { c as pruneCurrentConversationBindingListInTransaction, d as readCurrentConversationBindingSelectionInDatabase, f as updateCurrentConversationBindingRecordInDatabase, l as readCurrentConversationBindingListInDatabase, u as readCurrentConversationBindingResolutionInDatabase } from "./current-conversation-bindings.kernel-DgNBja26.mjs";
//#region src/infra/outbound/current-conversation-bindings.worker.ts
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
	"conversationBindings.readSelection": (input, { stateOptions }) => withExistingOpenClawStateDatabaseReadOnly(({ db }) => readCurrentConversationBindingSelectionInDatabase(db, input), stateOptions()) ?? input.map(() => null),
	"conversationBindings.listBySession": (input, { open, stateOptions }) => {
		const database = open();
		const prepared = readCurrentConversationBindingListInDatabase(database.db, input.targetSessionKey, input.scope);
		if (!prepared.requiresPrune) return prepared.records;
		return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const records = pruneCurrentConversationBindingListInTransaction(db, input.targetSessionKey, input.scope);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return records;
		}, {
			database,
			...stateOptions()
		});
	},
	"conversationBindings.resolve": (input, { open, stateOptions }) => {
		const database = open();
		const result = readCurrentConversationBindingResolutionInDatabase(database.db, input);
		if (!result.repair) return result.record;
		return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const record = updateCurrentConversationBindingRecordInDatabase(db, input, (current) => current).current;
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return record;
		}, {
			database,
			...stateOptions()
		});
	},
	"conversationBindings.touch": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const record = touchCurrentConversationBindingInDatabase(db, input);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return record;
	}, {
		database: open(),
		...stateOptions()
	})
};
//#endregion
export { conversationBindingOperations };
