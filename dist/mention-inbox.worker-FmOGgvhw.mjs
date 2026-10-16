import "./sqlite-transaction-DsZ3X6nD.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as writeMentionStoreChanges, i as readMentionStoreSnapshot, r as readMentionStoreHead } from "./mention-inbox-store-C9lniJqc.mjs";
//#region src/gateway/mention-inbox.worker.ts
const mentionWorkerOperations = { "mentions.mutate": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => {
	requestSqliteWorkerOperationAdmission({
		stage: "transaction",
		facts: void 0
	});
	const head = readMentionStoreHead(db);
	let result;
	if (head.revision !== input.expectedHead.revision || head.nextSequence !== input.expectedHead.nextSequence) {
		const snapshot = readMentionStoreSnapshot(-1, db);
		if (!snapshot) throw new Error("Mention snapshot is unavailable inside its transaction");
		result = {
			kind: "conflict",
			snapshot
		};
	} else result = {
		kind: "committed",
		head: writeMentionStoreChanges(db, {
			...head,
			nextSequence: input.nextSequence
		}, new Map(input.changes))
	};
	requestSqliteWorkerOperationAdmission({
		stage: "commit",
		facts: void 0
	});
	if (result.kind === "committed") deferSqliteWorkerCommitReceipt(db, result);
	return result;
}, {
	database: open(),
	...stateOptions()
}, { operationLabel: "mentions.mutate" }) };
//#endregion
export { mentionWorkerOperations };
