import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as createSqliteWorkerTransferOwner } from "./sqlite-worker-transfer-BHUd6Qxu.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { c as runOpenClawAgentWriteTransaction, i as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { Q as projectSessionEntryPatch } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { i as sealSessionEntryPublicationSource } from "./session-entry-publication-source-BkCFKM-k.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-B7chVWi3.mjs";
import { s as readStagedSessionTranscriptAuthority } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import { t as assertCapturedSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { u as prepareSessionActorEntryPatch } from "./session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
import { g as readSessionEntrySelectionSnapshot, h as readLifecycleTargetSnapshot, m as normalizeLifecycleTarget } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { i as readSessionEntryPatchPredicate, r as writeSessionEntryPatchInDatabase, t as applySessionEntryPatchInDatabase } from "./session-accessor.sqlite-entry-mutation-DzzqdA6S.mjs";
import { r as prepareSessionEntryReplacementPublication, t as boundSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
import { n as captureTrajectoryRuntimeRetentionMetadataMutation } from "./runtime-retention.sqlite-DfZeO9Sv.mjs";
import { n as readSessionPendingInputAuthorityFactsInTransaction } from "./session-pending-input-authority.kernel-Cz8X54WZ.mjs";
import { n as readSessionSourceValidation } from "./session-source-predicate.worker-CY9FAsb_.mjs";
//#region src/config/sessions/session-entry-patch.worker.ts
/** Private write domains borrow one canonical connection and its admission lifecycle. */
function bindSessionWorkerBackend(input, bound, domain, createExecute, owner = domain) {
	const options = {
		agentId: input.agentId,
		path: bound.databasePath,
		env: getSqliteWorkerStateContext().environment
	};
	const database = getOpenClawAgentDatabaseIfOpen(options);
	if (!database || database.db !== bound.database || database.path !== bound.databasePath) throw new Error(`${owner} lost its canonical database owner`);
	return {
		execute: createExecute(createSessionWorkerOperationContext(database, options, bound, domain), database),
		assertSettled() {
			assertTransactionUsable(database.db);
			if (database.db.isTransaction) throw new Error(`${domain} transaction did not settle`);
		},
		close() {}
	};
}
/** Connection-bound domains share the executor's transaction and publication grants. */
function createSessionWorkerOperationContext(database, options, bound, domain) {
	const native = database.db;
	const context = {
		options,
		open: () => database,
		admit(stage, publication) {
			bound.admit(stage, (request, dispatch) => {
				if (!isRecord(request.facts)) throw new Error(`${domain} admission omitted its database identity`);
				dispatch({
					...request,
					facts: {
						...request.facts,
						publication
					}
				});
			});
		},
		writeTransaction(operationLabel, owner, write, diagnosticContext) {
			return runOpenClawAgentWriteTransaction((current) => {
				if (current.db !== native) throw new Error(`${owner} lost its canonical database owner`);
				context.admit("transaction");
				return write(current);
			}, options, {
				operationLabel,
				diagnosticContext
			});
		}
	};
	return context;
}
function readSessionEntryPatchSnapshot(database, selection, includeWindowFacts) {
	let sessionKey;
	if (selection.kind === "entry") sessionKey = selection.exact ? selection.sessionKey : selection.sessionKey.trim();
	else {
		const target = normalizeLifecycleTarget(selection.target);
		if (target.storeKeys.length === 1) sessionKey = target.canonicalKey;
	}
	const actor = sessionKey === void 0 ? void 0 : prepareSessionActorEntryPatch(database, sessionKey);
	if (actor) return [actor.snapshot()];
	return selection.kind === "target" ? readLifecycleTargetSnapshot(database, selection.target, { includeWindowFacts }) : readSessionEntrySelectionSnapshot(database, selection.sessionKey, selection.exact, includeWindowFacts);
}
function commitSessionEntryPatch(input, { writeTransaction, admit }) {
	return writeTransaction(input.operationLabel, "Session patch", (database) => {
		if (input.ensureIdentitySource && (!("operation" in input) || input.operation.kind !== "ensure-identity")) throw new Error("Transaction-local entry authority requires a closed ensure");
		if (input.ensureIdentitySource) assertCapturedSessionEntryReadSource(input.ensureIdentitySource.source, database);
		let authority;
		let result;
		const actorPatch = prepareSessionActorEntryPatch(database, input.sessionKey);
		const predicate = actorPatch ? actorPatch.readPredicate(input.shouldCommitIf) : readSessionEntryPatchPredicate(database, input.sessionKey, input.shouldCommitIf);
		if (!predicate.matches) result = {
			kind: "session-entry-patch",
			entry: null,
			applied: false
		};
		else {
			const publishRetention = "operation" in input || input.next ? captureTrajectoryRuntimeRetentionMetadataMutation(database.db) : void 0;
			const options = {
				consumePendingReset: input.consumePendingReset,
				providerReviewMutation: input.providerReviewMutation,
				workerGuard: {
					cliHistory: input.cliHistory,
					conversation: input.conversation
				},
				assertCommitAllowed: () => {
					const validation = readSessionSourceValidation(database, input.sources);
					const { refusedSource } = validation;
					if (refusedSource) {
						result = {
							kind: "session-entry-patch",
							entry: null,
							applied: false,
							refusedSource
						};
						transferSessionEntryWorkerCandidate(database, admit, result);
						throw new Error("Session source refusal was not rejected");
					}
					admit("transaction", {
						kind: "session-entry-patch-validated",
						...authority ? { authority } : {},
						sourceValidation: validation
					});
				}
			};
			let mutation;
			if ("operation" in input) {
				if (input.validateCanonicalKeys) assertCanonicalSqliteSessionKeysCurrent(database);
				const fresh = readSessionEntryPatchSnapshot(database, input.selection, true);
				if (input.ensureIdentitySource) {
					const target = input.selection.kind === "target" ? input.selection.target : {
						canonicalKey: input.selection.sessionKey,
						storeKeys: [input.selection.sessionKey]
					};
					if (target.canonicalKey !== input.sessionKey || ![target.canonicalKey, ...target.storeKeys].includes(input.ensureIdentitySource.sessionKey)) throw new Error("Entry ensure authority belongs to another session target");
					const sourceKey = fresh[0]?.sessionKey ?? input.sessionKey;
					authority = readSessionPendingInputAuthorityFactsInTransaction(database, sourceKey, input.ensureIdentitySource.agentId, /* @__PURE__ */ new Map([[sourceKey, fresh[0]?.entry]]));
				}
				const existing = fresh[0]?.entry;
				const writeBase = existing ?? input.fallbackEntry;
				if (!writeBase) {
					result = {
						kind: "session-entry-patch",
						entry: null,
						applied: false
					};
					return transferSessionEntryWorkerCandidate(database, admit, result);
				}
				const next = projectSessionEntryPatch({
					...input,
					existing,
					writeBase,
					operation: input.operation
				});
				mutation = writeSessionEntryPatchInDatabase(database, {
					sessionKey: input.sessionKey,
					fresh,
					writeBase,
					next,
					options
				});
			} else mutation = applySessionEntryPatchInDatabase(database, {
				...input,
				readSnapshot: (current) => readSessionEntryPatchSnapshot(current, input.selection, true),
				options
			});
			const publication = mutation.identity ? prepareSessionEntryReplacementPublication({
				...mutation.identity,
				pendingArchiveRecovery: false,
				membershipInvalidatedKeys: [],
				maintenancePlans: []
			}, database, {
				captureFullFacts: true,
				postimages: mutation.postimages
			}) : void 0;
			if (mutation.identity) publishRetention?.();
			if (publication && mutation.postimages) actorPatch?.publish(mutation.postimages, publication);
			result = {
				kind: "session-entry-patch",
				entry: mutation.entry,
				applied: mutation.applied,
				publication,
				transcriptPredicate: mutation.entry.sessionId === predicate.transcriptPredicate?.sessionId ? predicate.transcriptPredicate : void 0
			};
		}
		return transferSessionEntryWorkerCandidate(database, admit, result);
	});
}
function transferSessionEntryWorkerCandidate(database, admit, result, wrapReceipt) {
	const transfer = createSqliteWorkerTransferOwner();
	const transcriptPublication = readStagedSessionTranscriptAuthority(database);
	const candidate = transcriptPublication ? {
		...result,
		transcriptPublication
	} : result;
	if (result.publication) {
		if (result.publication.source && (result.publication.fullEntries?.size || result.publication.actorPostimages?.size)) sealSessionEntryPublicationSource(result.publication.source);
		boundSessionEntryReplacementPublication(result.publication, candidate);
	}
	const handle = transfer.start([{
		kind: "patch",
		value: candidate
	}].values(), { kinds: ["patch"] });
	try {
		let frame = transfer.next(handle.id);
		let finalFrames;
		for (;;) {
			const next = transfer.next(handle.id);
			if (next.done) {
				finalFrames = [frame, next];
				break;
			}
			admit("transaction", {
				kind: "session-entry-patch-transfer",
				transfer: {
					handle,
					frames: [frame]
				}
			});
			frame = next;
		}
		const receipt = {
			kind: "session-entry-patch-committed",
			transferId: handle.id
		};
		const publication = wrapReceipt ? wrapReceipt(receipt) : receipt;
		deferSqliteWorkerCommitReceipt(database.db, publication);
		admit("commit", {
			...publication,
			transfer: {
				handle,
				frames: finalFrames
			}
		});
		return publication;
	} finally {
		transfer.cancel();
	}
}
//#endregion
export { transferSessionEntryWorkerCandidate as i, commitSessionEntryPatch as n, readSessionEntryPatchSnapshot as r, bindSessionWorkerBackend as t };
