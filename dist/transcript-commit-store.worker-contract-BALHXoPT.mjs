import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/gateway/worker-environments/transcript-commit-store.worker-contract.ts
function isCommitResult(value) {
	return isRecord(value) && Array.isArray(value.entryIds) && value.entryIds.length > 0 && value.entryIds.every((entry) => typeof entry === "string" && entry.length > 0) && typeof value.newLeafId === "string" && value.newLeafId.length > 0;
}
function isCommitErrorReason(value) {
	return value === "stale-base-leaf" || value === "epoch-mismatch" || value === "invalid-batch" || value === "session-not-attached";
}
function isWorkerTranscriptCommitOutcome(value) {
	return isRecord(value) && (value.ok === true && isCommitResult(value.result) || value.ok === false && isCommitErrorReason(value.reason));
}
function isWorkerTranscriptCommitBeginResult(value) {
	return isRecord(value) && (value.kind === "claimed" || value.kind === "recover" || value.kind === "replay" && isWorkerTranscriptCommitOutcome(value.outcome) || value.kind === "rejected" && (value.reason === "conflict" || value.reason === "out-of-order" && typeof value.expectedSeq === "number" && Number.isSafeInteger(value.expectedSeq) && value.expectedSeq > 0));
}
//#endregion
export { isWorkerTranscriptCommitOutcome as n, isWorkerTranscriptCommitBeginResult as t };
