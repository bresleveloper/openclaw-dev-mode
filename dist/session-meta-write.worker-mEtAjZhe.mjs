import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { c as legacyAcpMigrationBindingMatches, d as recordLegacyAcpMigrationCompletion } from "./session-accessor.sqlite-acp-provenance-tjrzB-wk.mjs";
import { r as mergeSessionEntry } from "./types-BZlUzQZy.mjs";
import { c as selectAcpSessionRow, l as selectAcpSessionRowForRead, n as buildAcpDatabaseSessionKey, t as acpSessionRowMatchesEntry } from "./session-meta-keys-Bj_FyJ-3.mjs";
import { t as assertAcpSessionMutationEntry } from "./session-meta-entry.kernel-Cn1WSw9n.mjs";
import { r as rowToAcpSessionMeta } from "./session-meta-readonly-CvCR0QQG.mjs";
import { t as applyAcpSessionMutation } from "./session-meta-write.kernel-BOulBPup.mjs";
import { n as readAcpSessionSourceInWorker, t as readAcpSessionControlInWorker } from "./session-meta-source.worker-BvhogCuh.mjs";
import { randomUUID } from "node:crypto";
import { MessageChannel, receiveMessageOnPort } from "node:worker_threads";
//#region src/acp/runtime/session-meta-write.worker.ts
const acpSessionOperations = {
	"acp.prepareMutation": (input, { open }) => prepareAcpSessionMutationInWorker(open(), input),
	"acp.commitMutation": (input, { open }) => commitAcpSessionMutationInWorker(open(), input)
};
function readControlledAcpSessionMutation(database, control) {
	const { entry, row } = readAcpSessionControlInWorker(database, control);
	if (!entry || !row) throw new Error("ACP controlled metadata is no longer present before mutation");
	const destination = selectAcpSessionRow(database.db, buildAcpDatabaseSessionKey(control.sessionKey, control.agentId));
	if (destination && !acpSessionRowMatchesEntry(destination, entry)) throw new Error("ACP controlled metadata destination binding changed before mutation");
	return {
		entry,
		row
	};
}
function prepareAcpSessionMutationInWorker(database, input) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const controlled = input.control ? readControlledAcpSessionMutation(database, input.control) : void 0;
		const { entry } = controlled ?? readAcpSessionSourceInWorker(input, "metadata preparation");
		if (controlled) assertAcpSessionMutationEntry(entry, input.entry ?? null, input.expectedControlBinding, "metadata preparation");
		const row = controlled?.row ?? selectAcpSessionRowForRead(db, {
			...input.read,
			entry
		});
		const preparation = {
			entry,
			current: row ? rowToAcpSessionMeta(row) : void 0,
			currentRowKey: row?.session_key,
			currentRowSessionId: row?.session_id,
			preparedEntry: mergeSessionEntry(entry, {
				updatedAt: input.updatedAt,
				...entry ? {} : { lifecycleRevision: randomUUID() }
			})
		};
		const { port1, port2 } = new MessageChannel();
		try {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: {
					nonce: input.nonce,
					preparation,
					preparationPort: port2
				}
			}, [port2]);
			if (!receiveMessageOnPort(port1)?.message) throw new Error("ACP metadata callback returned no admitted decision");
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: { nonce: input.nonce }
			});
			return preparation;
		} finally {
			port1.close();
			port2.close();
		}
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "acp.metadata.prepare" });
}
function consumeSources(database, input) {
	const current = readAcpSessionSourceInWorker(input, "legacy source consumption");
	for (const source of current.sources) if (legacyAcpMigrationBindingMatches(source, current.entry)) recordLegacyAcpMigrationCompletion(database.db, source, input.updatedAt);
}
function commitAcpSessionMutationInWorker(database, input) {
	return runOpenClawStateWriteTransaction((current) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: { nonce: input.nonce }
		});
		if (input.control) {
			const { row } = readControlledAcpSessionMutation(current, input.control);
			if (row.session_key !== input.currentRowKey || row.session_id !== input.currentRowSessionId) throw new Error("ACP controlled metadata binding changed before commit");
		}
		consumeSources(current, input);
		const db = current.db;
		applyAcpSessionMutation(db, input);
		const receipt = { nonce: input.nonce };
		deferSqliteWorkerCommitReceipt(db, receipt);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: receipt
		});
		return receipt;
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "acp.metadata.commit" });
}
//#endregion
export { acpSessionOperations };
