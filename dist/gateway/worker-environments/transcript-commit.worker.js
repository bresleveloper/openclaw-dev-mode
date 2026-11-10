import { r as runSqliteDeferredTransactionSync } from "../../sqlite-transaction-CpDyZPQ0.mjs";
import { i as getSqliteWorkerStateContext } from "../../sqlite-worker-state-context-QuvwmAax.mjs";
import { c as runOpenClawAgentWriteTransaction, o as openOpenClawAgentDatabase } from "../../openclaw-agent-db-_fC-kf1x.mjs";
import { _ as isCommittedAgentMessage, v as prepareTranscriptCommitFromSnapshot } from "../../session-actor-memory-owner-BSARM2d5.mjs";
import { i as toDatabaseOptions } from "../../session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as readTranscriptMessageIdempotencyKey } from "../../session-transcript-entry-message-Q75Efb-t.mjs";
import { s as resolveSqliteTranscriptScope } from "../../session-accessor.sqlite-scope-9ysL95gx.mjs";
import { c as readTranscriptContextVersionInTransaction } from "../../session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { f as loadTranscriptReadSnapshotSync } from "../../session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { d as replaceSessionEntrySync, i as loadSessionEntry } from "../../session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { i as appendTranscriptMessageSnapshotSync } from "../../session-accessor.sqlite-transcript-write-B1_nzUQQ.mjs";
//#region src/gateway/worker-environments/transcript-commit.kernel.ts
function prepareTranscriptCommit(input) {
	return prepareTranscriptCommitFromSnapshot(input, loadSessionEntry(input.scope), () => loadTranscriptReadSnapshotSync(input.scope));
}
/** The caller owns one synchronous transaction around validation, append, and metadata. */
function applyPreparedTranscriptCommit(input, plan, freshMessages, onProjectionReconcileNeeded, onSessionEntryUpdated) {
	if (!plan.result.ok) return plan.result;
	const currentEntry = loadSessionEntry(input.scope);
	if (!currentEntry || currentEntry.sessionId !== input.scope.sessionId) return {
		ok: false,
		reason: "session-not-attached"
	};
	if (currentEntry.lifecycleRevision !== plan.result.lifecycleRevision) return {
		ok: false,
		reason: "invalid-batch"
	};
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteTranscriptScope(input.scope)));
	const version = readTranscriptContextVersionInTransaction(database, input.scope.sessionId);
	if (!plan.version || version.generation !== plan.version.generation || version.rawSeq !== plan.version.rawSeq || version.updatedAt !== plan.version.updatedAt) return {
		ok: false,
		reason: "stale-base-leaf"
	};
	if (plan.result.messages.length === input.messages.length) return plan.result;
	const recoveredCount = plan.result.messages.length;
	if (freshMessages.length !== input.messages.length - recoveredCount || !freshMessages.every((message, index) => isCommittedAgentMessage(message) && readTranscriptMessageIdempotencyKey(message)?.trim() === readTranscriptMessageIdempotencyKey(input.messages[recoveredCount + index])?.trim())) return {
		ok: false,
		reason: "invalid-batch"
	};
	const messages = [...plan.result.messages];
	let parentId = plan.parentId;
	let nextMessageSeq = plan.nextMessageSeq;
	for (const message of freshMessages) {
		const snapshot = appendTranscriptMessageSnapshotSync(input.scope, {
			message,
			cwd: input.cwd,
			parentId,
			appendIntent: "active-branch",
			idempotencyLookup: "caller-checked"
		}, void 0, {
			scheduleProjectionReconcile: false,
			onProjectionReconcileNeeded
		});
		if (!snapshot.ok || !snapshot.value.result?.appended) throw new Error("Worker transcript message was not persisted", { cause: snapshot.ok ? void 0 : snapshot.error });
		const result = snapshot.value.result;
		parentId = result.messageId;
		nextMessageSeq += 1;
		messages.push({
			appended: true,
			message: result.message,
			messageId: result.messageId,
			messageSeq: nextMessageSeq
		});
	}
	const entry = loadSessionEntry(input.scope);
	if (!entry || entry.sessionId !== input.scope.sessionId || entry.lifecycleRevision !== plan.result.lifecycleRevision) throw new Error("Worker transcript session changed inside its transaction");
	const updatedEntry = {
		...entry,
		updatedAt: Math.max(entry.updatedAt ?? 0, Date.now())
	};
	replaceSessionEntrySync(input.scope, updatedEntry);
	onSessionEntryUpdated?.(updatedEntry);
	return {
		...plan.result,
		messages
	};
}
//#endregion
//#region src/gateway/worker-environments/transcript-commit.worker.ts
/** The canonical agent actor owns the connection and writer admission. */
function bindSqliteWorkerBackend(_input, context) {
	let prepared;
	let closed = false;
	return {
		execute(command) {
			if (closed) throw new Error("Worker transcript domain is closed");
			if (command.type === "transcript.prepare") {
				if (prepared) throw new Error("Worker transcript batch is already prepared");
				const input = {
					...command.input,
					scope: {
						...command.input.scope,
						storePath: context.databasePath,
						env: getSqliteWorkerStateContext().environment
					}
				};
				if (command.input.scope.storePath !== context.databasePath) throw new Error("Worker transcript target changed its database owner");
				const plan = runSqliteDeferredTransactionSync(context.database, () => prepareTranscriptCommit(input));
				prepared = {
					input,
					plan
				};
				return plan.result;
			}
			if (!prepared) throw new Error("Worker transcript batch was not prepared");
			const { input, plan } = prepared;
			prepared = void 0;
			return runOpenClawAgentWriteTransaction((database) => {
				if (database.db !== context.database) throw new Error("Worker transcript lost its canonical connection");
				context.admit("transaction");
				let projectionNeedsReconcile = false;
				let entry;
				const result = applyPreparedTranscriptCommit(input, plan, command.input.messages, () => {
					projectionNeedsReconcile = true;
				}, (updatedEntry) => {
					entry = updatedEntry;
				});
				context.admit("commit");
				return {
					result,
					projectionNeedsReconcile,
					entry
				};
			}, toDatabaseOptions(resolveSqliteTranscriptScope(input.scope)), { operationLabel: "worker.transcript.commit" });
		},
		assertSettled() {
			if (context.database.isTransaction) throw new Error("Worker transcript command left a transaction open");
		},
		close() {
			closed = true;
			prepared = void 0;
		}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
