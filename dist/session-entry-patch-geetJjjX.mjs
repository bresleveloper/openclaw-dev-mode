import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { r as createSqliteWorkerTransferReceiver } from "./sqlite-worker-transfer-e5ST79iV.mjs";
import { c as SqliteWorkerError, l as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { y as retainSessionEntryWorkerPublication } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { a as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-DY_MUUYo.mjs";
import { a as withSessionEntryWorker } from "./session-accessor.sqlite-replacement-worker-9fiwLkM3.mjs";
//#region src/config/sessions/session-entry-patch.ts
async function patchSessionEntryInWorker(params) {
	return runSessionEntryWorkerOperation({
		...params,
		candidateKind: "session-entry-patch",
		assertPrepared: () => params.guard?.assertCurrent?.(),
		assertCandidate: (candidate) => {
			if (candidate.entry !== null) params.guard?.assertCurrent?.();
		},
		async run(worker, commit) {
			const snapshot = await worker.execute({
				type: "session.entry.patch.prepare",
				input: params.selection
			});
			params.assertCurrent();
			params.guard?.assertCurrent?.();
			const input = await params.prepare(snapshot);
			params.assertCurrent();
			params.guard?.assertCurrent?.();
			return input ? commit(() => worker.execute({
				type: "session.entry.patch.commit",
				input
			})) : {
				entry: null,
				wrote: false
			};
		},
		onCommitted(committed, published, identity) {
			try {
				if (committed.publication && committed.entry) params.onCommitted?.(structuredClone(committed.entry));
			} finally {
				if (published) publishCommittedSessionIdentity(params.agentId, identity, published.previous, published.current, published.prepared);
			}
			return {
				entry: committed.entry,
				wrote: Boolean(committed.publication)
			};
		}
	});
}
async function runSessionEntryWorkerOperation(params) {
	let publication;
	let committing = false;
	let candidate;
	let transferId;
	let receiver;
	let transferred = false;
	let admitted;
	const matchesReceipt = (raw) => {
		const receipt = params.nativeSettlement ? params.nativeSettlement.readCommitReceipt(raw) : raw;
		return isRecord(receipt) && receipt.kind === "session-entry-patch-committed" && transferred && receipt.transferId === transferId;
	};
	return withSessionEntryWorker(params.database, params.databaseIdentity, params.assertCurrent, async (execution, source) => {
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
		const result = await execution.runExisting(source, (worker) => params.run(worker, async (send) => {
			committing = true;
			const outcome = await send().then((value) => ({
				ok: true,
				value
			}), (error) => ({
				ok: false,
				error
			}));
			let acknowledged = outcome.ok && matchesReceipt(outcome.value);
			let unknown = !outcome.ok && hasSqliteWorkerOutcomeUnknown(outcome.error);
			if (admitted) {
				await admitted.retained.settled;
				acknowledged ||= matchesReceipt(admitted.admission.committed?.facts);
				unknown = admitted.admission.settlement?.kind !== "completed";
			}
			const nativeOutcome = await params.nativeSettlement?.settle(outcome, acknowledged);
			unknown ||= nativeOutcome === "unknown" || Boolean(admitted && !acknowledged && nativeOutcome !== "rolled-back");
			const committed = acknowledged ? candidate : void 0;
			let publicationError;
			let publishedResult;
			try {
				const failures = [];
				try {
					if (committed) params.onAcknowledged?.(committed);
				} catch (error) {
					failures.push(error);
				}
				try {
					const published = publication?.settle(committed?.publication, unknown);
					if (committed) publishedResult = { value: await params.onCommitted(committed, published, identity.physicalIdentity) };
				} catch (error) {
					failures.push(error);
				}
				throwSqliteLifecycleErrors(failures, "Session commit publication failed");
			} catch (error) {
				if (!unknown) throw error;
				publicationError = error;
			}
			if (unknown) {
				const error = new SqliteWorkerError("Session patch has no confirmed native completion and commit receipt", "outcome-unknown");
				error.cause = publicationError ?? params.nativeSettlement?.failure ?? (outcome.ok ? void 0 : outcome.error);
				throw error;
			}
			if (!outcome.ok && !committed) throw outcome.error;
			if (!publishedResult) throw new SqliteWorkerError("Session operation omitted its committed result", "outcome-unknown");
			return publishedResult.value;
		}));
		if (result === void 0) throw new Error("Session database disappeared before patching");
		return result;
	}, (admission, retained, facts) => {
		if (!committing) return;
		if (!isRecord(facts) || !matchesReceipt(facts.publication) || !candidate) throw new Error("Session patch commit omitted its exact candidate");
		params.assertCandidate?.(candidate);
		admitted = {
			admission,
			retained
		};
		const receipt = candidate.publication;
		if (receipt) publication?.begin(receipt.changedKeys, receipt.membershipInvalidatedKeys, receipt.sharingUnchangedKeys);
	}, params.retainedExecution, void 0, params.prepareWorker, (facts) => {
		if (!isRecord(facts)) return;
		const value = facts.publication;
		if (params.onTransactionFacts?.(value)) return;
		if (!committing) return;
		if (value === void 0 || isRecord(value) && value.kind === "session-entry-patch-validated") params.assertPrepared?.();
		else if (isRecord(value) && value.kind === "session-entry-patch-transfer") {
			if (receiver || !isRecord(value.handle) || typeof value.handle.id !== "number" || !Array.isArray(value.handle.kinds) || value.handle.kinds.length !== 1 || value.handle.kinds[0] !== "patch") throw new Error("Session patch returned an invalid publication transfer");
			const handle = value.handle;
			transferId = handle.id;
			receiver = createSqliteWorkerTransferReceiver(handle, (record) => {
				if (candidate || record.kind !== "patch" || !isRecord(record.value) || record.value.kind !== params.candidateKind) throw new Error("Session patch returned an invalid publication candidate");
				candidate = record.value;
			});
		} else if (isRecord(value) && value.kind === "session-entry-patch-frame" && receiver) transferred = receiver.accept(value.frame) !== void 0;
		else throw new Error("Session patch returned unexpected transaction facts");
	}, params.nativeSettlement?.onAdmission);
}
//#endregion
export { runSessionEntryWorkerOperation as n, patchSessionEntryInWorker as t };
