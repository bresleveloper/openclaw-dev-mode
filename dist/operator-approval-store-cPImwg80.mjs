import { i as extractErrorCode, r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { n as createSqliteWorkerWriteAdmission, u as reserveSqliteWorkerInputPreparation } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-PQSbpEtY.mjs";
import { o as decodeOperatorApprovalHistoryCursor } from "./operator-approval-store.rows-CUyuQiIg.mjs";
import "./operator-approval-store.transitions-CL3SwJLb.mjs";
import { serialize } from "node:v8";
//#region src/gateway/operator-approval-store.ts
/** Storage admission failure is not evidence that a pending row is corrupt. */
function isOperatorApprovalStoreRefusal(error) {
	return collectNestedErrorCandidates(error).some((cause) => isStateDatabaseReadAdmissionInvalidatedError(cause) || [
		"closed",
		"overloaded",
		"unavailable"
	].includes(extractErrorCode(cause) ?? ""));
}
function isOperatorApprovalStoreOutcomeUnknown(error) {
	return collectNestedErrorCandidates(error).some((cause) => extractErrorCode(cause) === "outcome-unknown");
}
const loadNativeStore = createLazyRuntimeModule(() => import("./operator-approval-store.native-BIjubym9.mjs"));
const leases = createKeyedFifoLeaseRegistry(Symbol.for("openclaw.operatorApprovalStoreLeases"));
async function runApprovalStoreOperation(context, input, operation, options, assertCurrent) {
	context.admission.assertCurrent();
	const preparation = reserveSqliteWorkerInputPreparation(serialize(input).byteLength);
	const lease = expectDefined(leases.reserve([context.admission.identity.key, `path:${context.admission.identity.canonicalPath}`]), "Operator approval storage lease");
	try {
		await lease.wait();
		preparation.assertCurrent();
		context.admission.assertCurrent();
		assertCurrent?.();
		return await runOpenClawStateWorkerOperation(context, (scope) => operation(scope, preparation), options);
	} finally {
		preparation.release();
		lease.release();
	}
}
function execute(type, { databaseOptions, assertCurrent, guard, ...input }, onCommitted) {
	const context = captureOpenClawStateWorkerContext({
		...databaseOptions,
		path: databaseOptions?.database?.path ?? databaseOptions?.path
	});
	const captured = structuredClone(input);
	const assertOperationCurrent = () => {
		context.admission.assertCurrent();
		guard?.assertCurrent();
		assertCurrent?.();
	};
	const native = guard?.family === "native-compatibility";
	let admission;
	const createWriteAdmission = createSqliteWorkerWriteAdmission(assertOperationCurrent, [context.admission.databasePath]);
	const createAdmission = (operation) => {
		const retained = createWriteAdmission(operation);
		admission = retained.admission;
		return retained;
	};
	const publishCommitted = (facts) => {
		if (onCommitted && isRecord(facts) && facts.type === "operatorApprovals.resolve" && typeof facts.resolutionKey === "string") onCommitted(facts.resolutionKey);
	};
	return runApprovalStoreOperation(context, captured, async (scope, preparation) => {
		if (native) {
			const store = await loadNativeStore();
			preparation.assertCurrent();
			assertOperationCurrent();
			preparation.release();
			return store.executeNativeOperatorApproval(type, captured, context, assertOperationCurrent, onCommitted ? publishCommitted : void 0);
		}
		try {
			return await preparation.handoff(() => scope.execute({
				type,
				input: captured
			}));
		} finally {
			publishCommitted(admission?.committed?.facts);
		}
	}, {
		assertCurrent: native ? void 0 : assertOperationCurrent,
		...native ? {} : { createAdmission }
	}, assertOperationCurrent);
}
function insertOperatorApproval(params) {
	return execute("operatorApprovals.insert", params);
}
function getOperatorApprovalDetailed(params) {
	return execute("operatorApprovals.get", params);
}
function listPendingOperatorApprovals(params = {}) {
	return execute("operatorApprovals.pending", params);
}
function resolveOperatorApproval(params) {
	const { onCommitted, ...input } = params;
	return execute("operatorApprovals.resolve", input, onCommitted);
}
function forceDenyOperatorApproval(params) {
	return execute("operatorApprovals.deny", params);
}
function expireDueOperatorApprovals(params) {
	return execute("operatorApprovals.expire", params);
}
function consumeOperatorApprovalAllowOnce(params) {
	return execute("operatorApprovals.consume", params);
}
async function readApprovalStore(command, { databaseOptions, assertCurrent, guard }, project) {
	const context = captureOpenClawStateWorkerContext({
		...databaseOptions,
		path: databaseOptions?.database?.path ?? databaseOptions?.path
	});
	const captured = structuredClone(command);
	const assertOperationCurrent = () => {
		context.admission.assertCurrent();
		guard?.assertCurrent();
		assertCurrent?.();
	};
	return runApprovalStoreOperation(context, captured, async (_scope, preparation) => {
		preparation.assertCurrent();
		assertOperationCurrent();
		preparation.release();
		const result = await executeExistingOpenClawStateRead({
			env: context.environment,
			path: context.admission.databasePath
		}, captured);
		assertOperationCurrent();
		const value = result?.ok && result.type === command.type ? project(result) : void 0;
		if (value !== void 0) return value;
		throw new Error("Operator approval database became unavailable");
	}, void 0, assertOperationCurrent);
}
async function listTerminalOperatorApprovals(params = {}) {
	const { databaseOptions, assertCurrent, guard, ...input } = params;
	if (input.cursor !== void 0) decodeOperatorApprovalHistoryCursor(input.cursor);
	return readApprovalStore({
		type: "operatorApprovals.history",
		input
	}, {
		databaseOptions,
		assertCurrent,
		guard
	}, (result) => result.type === "operatorApprovals.history" ? result.history : void 0);
}
function listCronStandingGrants(params = {}) {
	const { databaseOptions, assertCurrent, guard, ...input } = params;
	return readApprovalStore({
		type: "operatorApprovals.listCronGrants",
		input
	}, {
		databaseOptions,
		assertCurrent,
		guard
	}, (result) => result.type === "operatorApprovals.listCronGrants" ? result.grants : void 0);
}
function revokeCronStandingGrant(params) {
	return execute("operatorApprovals.revokeCronGrant", params);
}
//#endregion
export { insertOperatorApproval as a, listCronStandingGrants as c, resolveOperatorApproval as d, revokeCronStandingGrant as f, getOperatorApprovalDetailed as i, listPendingOperatorApprovals as l, expireDueOperatorApprovals as n, isOperatorApprovalStoreOutcomeUnknown as o, forceDenyOperatorApproval as r, isOperatorApprovalStoreRefusal as s, consumeOperatorApprovalAllowOnce as t, listTerminalOperatorApprovals as u };
