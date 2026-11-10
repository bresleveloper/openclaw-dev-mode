import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as mergeSessionEntry } from "./types-BGDhC4_W.mjs";
import { c as legacyAcpMigrationBindingMatches, d as recordLegacyAcpMigrationCompletion } from "./session-accessor.sqlite-acp-provenance-Bl2TV_Gc.mjs";
import { c as selectAcpSessionRow, l as selectAcpSessionRowForRead, n as buildAcpDatabaseSessionKey, t as acpSessionRowMatchesEntry } from "./session-meta-keys-BWMCJN-1.mjs";
import { i as rowToAcpSessionMeta } from "./session-meta-readonly-CHaonIQO.mjs";
import { t as assertAcpSessionMutationEntry } from "./session-meta-entry.kernel-DisS3yfP.mjs";
import { t as applyAcpSessionMutation } from "./session-meta-write.kernel-Bl7f-Zcr.mjs";
import { n as readAcpSessionSourceInWorker, t as readAcpSessionControlInWorker } from "./session-meta-source.worker-Bm2sbUvG.mjs";
import { randomUUID } from "node:crypto";
//#region src/acp/runtime/session-meta-write.worker.ts
const acpSessionOperations = {
	"acp.prepareMutation": (input, { write }) => prepareAcpSessionMutationInWorker(write, input),
	"acp.commitMutation": (input, { write }) => commitAcpSessionMutationInWorker(write, input)
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
function readMutationSource(input, phase) {
	if ("kind" in input.source && input.source.kind === "memory") return input.source.snapshot;
	if ("kind" in input.source && input.source.kind === "reset") {
		const current = readAcpSessionSourceInWorker({
			...input,
			source: input.source
		}, phase);
		if (current.entry?.activeWriterRunId !== input.entry?.activeWriterRunId) throw new Error(`Canonical ACP session changed before ${phase}.`);
		return {
			entry: current.entry,
			sources: []
		};
	}
	return readAcpSessionSourceInWorker({
		...input,
		source: input.source
	}, phase);
}
function prepareAcpSessionMutationInWorker(write, input) {
	return write((database) => {
		const { db } = database;
		const controlled = input.control ? readControlledAcpSessionMutation(database, input.control) : void 0;
		const { entry } = controlled ?? readMutationSource(input, "metadata preparation");
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
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: {
				nonce: input.nonce,
				preparation
			}
		});
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: { nonce: input.nonce }
		});
		return preparation;
	}, { operationLabel: "acp.metadata.prepare" });
}
function consumeSources(database, input) {
	const current = readMutationSource(input, "legacy source consumption");
	for (const source of current.sources) if (legacyAcpMigrationBindingMatches(source, current.entry)) recordLegacyAcpMigrationCompletion(database.db, source, input.updatedAt);
}
function commitAcpSessionMutationInWorker(write, input) {
	return write((current) => {
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
		const facts = applyAcpSessionMutation(db, input);
		const receipt = {
			nonce: input.nonce,
			facts
		};
		deferSqliteWorkerCommitReceipt(db, receipt);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: receipt
		});
		return receipt;
	}, { operationLabel: "acp.metadata.commit" });
}
//#endregion
export { acpSessionOperations };
