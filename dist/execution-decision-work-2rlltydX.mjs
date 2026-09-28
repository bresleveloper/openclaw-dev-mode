import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as validateDecisionReceiptV1 } from "./audit-run-validators-DIyIA-46.mjs";
import { o as parseExecutionIdentityAdmissionToken } from "./execution-identity-admission-3hhMmAVK.mjs";
import { n as recordExecutionDecisionFactInDatabase, o as pseudonymizeExecutionIdentityRef } from "./execution-decision-facts--8ty_5Z3.mjs";
//#region src/audit/execution-decision-work.ts
/** Private, bounded decision work projected by the canonical audit writer. */
const EXECUTION_DECISION_WORK_MAX_BYTES = 16384;
const EXECUTION_DECISION_RAW_REF_MAX_LENGTH = 4096;
const state = resolveGlobalSingleton(Symbol.for("openclaw.executionDecisionWorkSink"), () => ({ sink: void 0 }));
function isClosedPayloadRecord(value) {
	if (!isRecord(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function hasOnlyKeys(value, allowed) {
	const allowedKeys = new Set(allowed);
	return Object.keys(value).every((key) => allowedKeys.has(key));
}
function parseRawRef(params) {
	if (!isClosedPayloadRecord(params.value) || !hasOnlyKeys(params.value, ["namespace", "value"]) || typeof params.value.namespace !== "string" || !params.namespaces.includes(params.value.namespace) || typeof params.value.value !== "string" || params.value.value.length < 1 || params.value.value.length > EXECUTION_DECISION_RAW_REF_MAX_LENGTH) throw new Error("execution decision work violates its bounded ref contract");
	return {
		namespace: params.value.namespace,
		value: params.value.value
	};
}
function buildReceipt(params) {
	return {
		...params.receipt,
		contextId: params.token.contextId,
		executionId: params.token.executionId,
		runId: params.token.runId,
		action: {
			...params.receipt.action,
			...params.resourceRef ? { resourceRef: params.resourceRef } : {},
			...params.targetRef ? { targetRef: params.targetRef } : {}
		}
	};
}
/** Revalidate closed work before queue cloning, key access, or database access. */
function parseExecutionDecisionWork(value) {
	if (!isClosedPayloadRecord(value) || !hasOnlyKeys(value, [
		"workVersion",
		"token",
		"receipt",
		"refs"
	]) || value.workVersion !== 1 || !isClosedPayloadRecord(value.receipt) || !hasOnlyKeys(value.receipt, [
		"schemaVersion",
		"receiptId",
		"actionId",
		"occurredAt",
		"action",
		"decision",
		"enforcement",
		"source",
		"missingEvidence",
		"remediation"
	]) || !isClosedPayloadRecord(value.receipt.action) || !hasOnlyKeys(value.receipt.action, [
		"family",
		"operation",
		"summary"
	])) throw new Error("execution decision work violates its bounded contract");
	const token = parseExecutionIdentityAdmissionToken(value.token);
	let refs;
	if (value.refs !== void 0) {
		if (!isClosedPayloadRecord(value.refs) || !hasOnlyKeys(value.refs, ["resource", "target"])) throw new Error("execution decision work violates its bounded ref contract");
		refs = {
			...value.refs.resource !== void 0 ? { resource: parseRawRef({
				value: value.refs.resource,
				namespaces: ["credential-profile"]
			}) } : {},
			...value.refs.target !== void 0 ? { target: parseRawRef({
				value: value.refs.target,
				namespaces: ["model-route", "session"]
			}) } : {}
		};
	}
	const receipt = value.receipt;
	const candidate = buildReceipt({
		token,
		receipt,
		...refs?.resource ? { resourceRef: "private-resource-ref" } : {},
		...refs?.target ? { targetRef: "private-target-ref" } : {}
	});
	if (!validateDecisionReceiptV1(candidate)) throw new Error("execution decision work receipt violates DecisionReceiptV1");
	const encoded = JSON.stringify(value);
	if (Buffer.byteLength(encoded, "utf8") > EXECUTION_DECISION_WORK_MAX_BYTES) throw new Error("execution decision work exceeds 16 KiB");
	return {
		workVersion: 1,
		token,
		receipt,
		...refs ? { refs } : {}
	};
}
/** Project raw private refs at the audit owner, then persist only the bounded receipt. */
function processExecutionDecisionWorkInDatabase(value, options) {
	const work = parseExecutionDecisionWork(value);
	const db = openOpenClawStateDatabase(options).db;
	const resourceRef = work.refs?.resource ? pseudonymizeExecutionIdentityRef({
		db,
		kind: "credential",
		scope: work.refs.resource.namespace,
		value: work.refs.resource.value
	}) : void 0;
	const targetRef = work.refs?.target ? pseudonymizeExecutionIdentityRef({
		db,
		kind: "target",
		scope: work.refs.target.namespace,
		value: work.refs.target.value
	}) : void 0;
	const receipt = buildReceipt({
		token: work.token,
		receipt: work.receipt,
		...resourceRef ? { resourceRef } : {},
		...targetRef ? { targetRef } : {}
	});
	if (!validateDecisionReceiptV1(receipt)) throw new Error("execution decision work projection violates DecisionReceiptV1");
	return recordExecutionDecisionFactInDatabase(receipt, options);
}
/** Install the current process writer sink; callers never create a second writer. */
function configureExecutionDecisionWorkSink(sink) {
	state.sink = sink;
	return () => {
		if (state.sink === sink) state.sink = void 0;
	};
}
/** Offer one private work item to the lifecycle-owned FIFO. */
function recordExecutionDecisionWork(work) {
	return state.sink?.(work) ?? false;
}
//#endregion
export { recordExecutionDecisionWork as i, parseExecutionDecisionWork as n, processExecutionDecisionWorkInDatabase as r, configureExecutionDecisionWorkSink as t };
