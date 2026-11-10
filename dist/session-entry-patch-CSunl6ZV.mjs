import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as createSqliteWorkerTransferCollector } from "./sqlite-worker-transfer-BHUd6Qxu.mjs";
import { c as SqliteWorkerError, u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { t as acceptSessionSourceValidation } from "./session-source-authority-fdILH-PW.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { o as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { l as retainSessionTranscriptWorkerPublication } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { n as retainSessionEntryWorkerPublication } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { a as withSessionEntryWorker } from "./session-accessor.sqlite-replacement-worker-BpIicMPG.mjs";
//#region src/config/sessions/session-entry-patch.ts
async function patchSessionEntryInWorker(params) {
	let source = params.preparedSource;
	const sourceChecks = source?.checks ?? [];
	const releaseSource = () => {
		const held = source;
		source = void 0;
		return held?.release?.();
	};
	let input = params.reduction;
	const ensureIdentitySource = params.guard?.ensureIdentitySource;
	let transactionFacts;
	let commitRefusal;
	let committing = false;
	return await runSessionEntryWorkerOperation({
		...params,
		releaseSource,
		candidateKind: "session-entry-patch",
		assertPrepared: () => {
			params.guard?.assertCurrent?.();
			source?.assertCurrent();
		},
		assertCandidate: (candidate) => {
			if (candidate.refusedSource) {
				sourceChecks[candidate.refusedSource.index]?.refuse(candidate.refusedSource.facts);
				throw new Error("Session source refusal omitted its prepared assertion");
			}
			if (candidate.entry !== null) {
				params.assertCommitAllowed?.();
				params.guard?.assertCurrent?.();
				source?.assertCurrent();
				params.guard?.assertMutationAllowed?.();
				if (ensureIdentitySource) {
					if (!transactionFacts) throw new Error("Entry ensure omitted its transaction authority facts");
					ensureIdentitySource.assertCurrent(transactionFacts);
				}
			}
		},
		onTransactionFacts: (value) => {
			if (committing && value === void 0 && params.shouldCommit?.() === false) {
				commitRefusal = /* @__PURE__ */ new Error("Session entry patch was cancelled before mutation");
				throw commitRefusal;
			}
			if (isRecord(value) && value.kind === "session-entry-patch-validated") params.guard?.assertMutationAllowed?.();
			if (source && isRecord(value) && value.kind === "session-entry-patch-validated") acceptSessionSourceValidation(source, value.sourceValidation);
			if (ensureIdentitySource && isRecord(value) && value.kind === "session-entry-patch-validated") {
				if (!isRecord(value.authority)) throw new Error("Entry ensure omitted its transaction authority facts");
				transactionFacts = value.authority;
				ensureIdentitySource.assertCurrent(transactionFacts);
			}
			return false;
		},
		prepareWorker: params.reduction ? void 0 : (execution, executionSource) => ({
			async prepare() {
				params.assertCurrent();
				params.guard?.assertCurrent?.();
				source?.assertCurrent();
				const snapshot = await runOpenClawAgentWorkerWrite(params.database, () => execution.runExisting(executionSource, (worker) => worker.execute({
					type: "session.entry.patch.prepare",
					input: params.selection
				})));
				if (!snapshot) throw new Error("Session database disappeared before patching");
				params.assertCurrent();
				params.guard?.assertCurrent?.();
				input = await params.prepare(snapshot);
				params.assertCurrent();
				params.guard?.assertCurrent?.();
			},
			beforeWrite() {},
			async release() {}
		}),
		async run(worker, commit) {
			const prepared = input;
			if (!prepared) return {
				entry: null,
				wrote: false
			};
			if (source) {
				prepared.sources = sourceChecks.map((check) => check.predicate);
				source.assertCurrent();
			}
			committing = true;
			return commit(() => worker.execute({
				type: "session.entry.patch.commit",
				input: prepared
			}));
		},
		onAcknowledged(committed, fileIdentity) {
			if (committed.applied && committed.entry && committed.publication) params.onCommittedSource?.({
				agentId: params.database.agentId,
				path: params.database.path,
				databaseIdentity: fileIdentity.physicalIdentity,
				databaseBirthtime: fileIdentity.birthtime
			}, structuredClone(committed.entry));
		},
		async onCommitted(committed, published, identity) {
			try {
				if (committed.applied && committed.entry) {
					const entry = structuredClone(committed.entry);
					if (committed.transcriptPredicate) params.onCommitted?.(entry, committed.transcriptPredicate);
					else params.onCommitted?.(entry);
				}
			} finally {
				if (published) publishCommittedSessionIdentity(params.agentId, identity, published.previous, published.current, published.prepared);
			}
			await releaseSource();
			return {
				entry: committed.entry,
				wrote: Boolean(committed.publication)
			};
		}
	}).catch((error) => {
		if (error === commitRefusal) return {
			entry: null,
			wrote: false
		};
		throw error;
	});
}
async function runSessionEntryWorkerOperation(params) {
	let publication;
	let transcriptPublication;
	let committing = false;
	let settlement = {};
	const createTransfer = () => createSqliteWorkerTransferCollector("patch", (value) => {
		if (settlement.candidate || !isRecord(value) || value.kind !== params.candidateKind) throw new Error("Session patch returned an invalid publication candidate");
		settlement.candidate = value;
	});
	let transfer = createTransfer();
	const matchesReceipt = (raw) => {
		const receipt = params.nativeSettlement ? params.nativeSettlement.readCommitReceipt(raw) : raw;
		return isRecord(receipt) && receipt.kind === "session-entry-patch-committed" && transfer.completed && receipt.transferId === transfer.id;
	};
	return withSessionEntryWorker(params.database, params.databaseIdentity, params.assertCurrent, async (execution, source, context) => {
		await execution.prepare(source);
		params.assertCurrent();
		params.assertPrepared?.();
		const identity = execution.fileIdentity;
		if (!identity) throw new Error("Session patch has no admitted physical database");
		publication = retainSessionEntryWorkerPublication({
			agentId: params.agentId,
			storePath: params.database.path,
			databaseIdentity: identity.physicalIdentity
		});
		transcriptPublication = retainSessionTranscriptWorkerPublication({
			agentId: params.agentId,
			storePath: params.database.path,
			databaseIdentity: identity.physicalIdentity
		});
		const result = await execution.runExisting(source, (worker) => params.run(worker, async (send) => {
			settlement = {};
			transfer = createTransfer();
			committing = true;
			const outcome = await send().then(ok, err);
			let acknowledged = outcome.ok && matchesReceipt(outcome.value);
			let unknown = !outcome.ok && hasSqliteWorkerOutcomeUnknown(outcome.error);
			if (settlement.admitted) {
				await settlement.admitted.retained.settled;
				acknowledged ||= matchesReceipt(settlement.admitted.admission.committed?.facts);
				unknown = settlement.admitted.admission.settlement?.kind !== "completed" || unknown && !acknowledged;
			}
			const nativeOutcome = await params.nativeSettlement?.settle(outcome, acknowledged);
			unknown ||= nativeOutcome === "unknown" || !acknowledged && (outcome.ok || Boolean(settlement.admitted?.admission.committed && nativeOutcome !== "rolled-back"));
			const committed = acknowledged ? settlement.candidate : void 0;
			let publicationError;
			let publishedResult;
			try {
				const failures = [];
				try {
					if (committed) params.onAcknowledged?.(committed, identity);
				} catch (error) {
					failures.push(error);
				}
				try {
					const transcriptChanges = transcriptPublication?.settle(Boolean(committed), unknown);
					const published = publication?.settle(committed?.publication, unknown, transcriptChanges);
					if (committed) publishedResult = { value: await params.onCommitted(committed, published, identity.physicalIdentity, context, identity) };
				} catch (error) {
					failures.push(error);
				}
				throwSqliteLifecycleErrors(failures, "Session commit publication failed");
			} catch (error) {
				if (!unknown) throw error;
				publicationError = error;
			}
			if (!unknown && !outcome.ok && !committed) throw outcome.error;
			if (unknown || !publishedResult) {
				const error = new SqliteWorkerError("Session patch has no confirmed native completion and commit receipt", "outcome-unknown");
				error.cause = publicationError ?? params.nativeSettlement?.failure ?? (outcome.ok ? void 0 : outcome.error);
				throw error;
			}
			return publishedResult.value;
		}));
		if (result === void 0) throw new Error("Session database disappeared before patching");
		return result;
	}, (admission, retained, facts) => {
		if (!committing) return;
		if (isRecord(facts) && isRecord(facts.publication) && facts.publication.transfer) transfer.accept(facts.publication.transfer);
		if (!isRecord(facts) || !matchesReceipt(facts.publication) || !settlement.candidate) throw new Error("Session patch commit omitted its exact candidate");
		params.assertCandidate?.(settlement.candidate);
		settlement.admitted = {
			admission,
			retained
		};
		transcriptPublication?.begin(settlement.candidate.publication?.transcriptPublication ? void 0 : settlement.candidate.transcriptPublication);
		const receipt = settlement.candidate.publication;
		if (receipt) publication?.begin(receipt.changedKeys, receipt.membershipInvalidatedKeys, receipt.sharingUnchangedKeys, receipt.generationUnchangedKeys, receipt.transcriptPublication, new Map([...receipt.current].filter(([key]) => !receipt.unavailableParticipantKeys?.includes(key))));
	}, params.retainedExecution, void 0, params.prepareWorker, (facts) => {
		if (!isRecord(facts)) return;
		const value = facts.publication;
		if (params.onTransactionFacts?.(value)) return;
		if (!committing) return;
		if (value === void 0 || isRecord(value) && value.kind === "session-entry-patch-validated") params.assertPrepared?.();
		else if (isRecord(value) && value.kind === "session-entry-patch-transfer") transfer.accept(value.transfer);
		else throw new Error("Session patch returned unexpected transaction facts");
	}, params.nativeSettlement?.onAdmission, params.releaseSource, "write", params.expectedCreationIdentity);
}
//#endregion
export { runSessionEntryWorkerOperation as n, patchSessionEntryInWorker as t };
