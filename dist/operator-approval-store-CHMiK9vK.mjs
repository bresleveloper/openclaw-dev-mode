import { a as extractErrorCode, i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as batchStateDomainPublications } from "./state-domain-publication-CEKqcWHX.mjs";
import { l as reserveSqliteWorkerInputPreparation, n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { t as execApprovalsPublication } from "./exec-approvals-publication-BPITitc6.mjs";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-CP5xMNf9.mjs";
import { n as operatorStandingGrantPublication, t as operatorApprovalPublication } from "./operator-approval-store.publication-DMDGNuqi.mjs";
import { o as decodeOperatorApprovalHistoryCursor } from "./operator-approval-store.rows-CDZY6GCx.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
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
function execute(type, { databaseOptions, assertCurrent, guard, ...input }, options) {
	const context = options?.context ?? captureOpenClawStateWorkerContext({
		...databaseOptions,
		path: databaseOptions?.database?.path ?? databaseOptions?.path
	});
	const captured = structuredClone(input);
	const assertCallerCurrent = AsyncLocalStorage.bind(() => {
		guard?.assertCurrent();
		assertCurrent?.();
	});
	if (guard?.family === "native-compatibility") warnPluginSdkDeprecation({
		family: "native-approval-callback",
		method: "GatewayRequestHandlerOptions.sessionMutationCommitGuard (approval persistence)",
		replacement: "api.runtime.gateway.request approval methods with host-bound authority"
	});
	let admission;
	const createAdmission = (operation) => {
		let commitAdmitted = false;
		const retained = createSqliteWorkerWriteAdmission((request) => {
			context.admission.assertCurrent();
			if (request.stage === "commit") {
				assertCallerCurrent();
				commitAdmitted = true;
			}
		}, [context.admission.databasePath])(operation);
		admission = retained.admission;
		const owner = {
			identity: context.admission.identity.key,
			assertCurrent: context.assertPublicationCurrent ?? context.admission.assertCurrent
		};
		const approvals = operatorApprovalPublication.begin(owner);
		const grants = operatorStandingGrantPublication.begin(owner);
		const exec = execApprovalsPublication.begin({
			...owner,
			publishPending: options?.changesExecPolicy === true
		});
		observeSqliteWorkerCommittedFacts(admission, ({ facts }) => {
			batchStateDomainPublications(() => {
				approvals.committed(isRecord(facts) ? facts.approvalFacts : void 0);
				grants.committed(isRecord(facts) ? facts.standingGrantFacts : void 0);
				exec.committed(isRecord(facts) ? facts.execFacts : void 0);
			});
		});
		const finish = admission.finish.bind(admission);
		admission.finish = () => {
			try {
				finish();
			} finally {
				const confirmed = admission?.settlement?.kind === "completed";
				const rolledBack = confirmed && !admission?.committed && !commitAdmitted;
				approvals.finish(confirmed, rolledBack);
				grants.finish(confirmed, rolledBack);
				exec.finish(confirmed, rolledBack);
			}
		};
		return retained;
	};
	return runApprovalStoreOperation(context, captured, async (scope, preparation) => {
		try {
			if (options?.read) {
				assertCallerCurrent();
				const result = await readApprovalStoreCommand(context, options.read.command);
				context.admission.assertCurrent();
				assertCallerCurrent();
				const value = options.read.project(result);
				if (value !== void 0) return value;
			}
			return await preparation.handoff(() => scope.execute({
				type,
				input: captured
			}));
		} finally {
			const facts = admission?.committed?.facts;
			if (options?.onCommitted && isRecord(facts) && facts.type === "operatorApprovals.resolve" && typeof facts.resolutionKey === "string") options.onCommitted(facts.resolutionKey);
		}
	}, { createAdmission });
}
function recoverOperatorApprovalsOnStartup(params) {
	return execute("operatorApprovals.recoverStartup", params);
}
function insertOperatorApproval(params) {
	return execute("operatorApprovals.insert", params);
}
function getOperatorApprovalDetailed(params) {
	return execute("operatorApprovals.get", params);
}
function listPendingOperatorApprovals(params = {}) {
	const { databaseOptions: _databaseOptions, assertCurrent: _assertCurrent, guard: _guard, ...input } = params;
	return execute("operatorApprovals.pending", params, { read: {
		command: {
			type: "operatorApprovals.pending",
			input
		},
		project: (result) => result.type === "operatorApprovals.pending" && !result.pending.corrupt.length ? result.pending.records : void 0
	} });
}
function resolveOperatorApproval(params) {
	const { onCommitted, ...input } = params;
	return execute("operatorApprovals.resolve", input, {
		onCommitted,
		changesExecPolicy: input.decision === "allow-always" && input.mcpToolGrant !== void 0
	});
}
function forceDenyOperatorApproval(params) {
	return execute("operatorApprovals.deny", params);
}
function expireDueOperatorApprovals(params) {
	return execute("operatorApprovals.expire", params, { read: {
		command: {
			type: "operatorApprovals.hasDue",
			nowMs: params.nowMs ?? Date.now()
		},
		project: (result) => result.type === "operatorApprovals.hasDue" && !result.hasDue ? {
			affected: 0,
			records: []
		} : void 0
	} });
}
function consumeOperatorApprovalAllowOnce(params) {
	return execute("operatorApprovals.consume", params);
}
async function readApprovalStoreCommand(context, command) {
	const result = await executeExistingOpenClawStateRead({
		env: context.environment,
		path: context.admission.databasePath
	}, command);
	if (!result?.ok || result.type !== command.type) throw new Error("Operator approval database became unavailable");
	return result;
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
		const result = await readApprovalStoreCommand(context, captured);
		assertOperationCurrent();
		const value = project(result);
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
function validateCronStandingGrant(params) {
	const { databaseOptions, assertCurrent, guard, ...input } = params;
	return readApprovalStore({
		type: "operatorApprovals.validateCronGrant",
		input
	}, {
		databaseOptions,
		assertCurrent,
		guard
	}, (result) => result.type === "operatorApprovals.validateCronGrant" ? result.result : void 0);
}
function consumeCronStandingGrant(context, input, assertCurrent) {
	return execute("operatorApprovals.consumeCronGrant", {
		...input,
		assertCurrent
	}, { context });
}
function readPlacementStandingGrant(input, options) {
	return readApprovalStore({
		type: "operatorApprovals.placementGrant",
		input
	}, options, (result) => result.type === "operatorApprovals.placementGrant" ? result.rows : void 0);
}
//#endregion
export { getOperatorApprovalDetailed as a, isOperatorApprovalStoreRefusal as c, listTerminalOperatorApprovals as d, readPlacementStandingGrant as f, validateCronStandingGrant as g, revokeCronStandingGrant as h, forceDenyOperatorApproval as i, listCronStandingGrants as l, resolveOperatorApproval as m, consumeOperatorApprovalAllowOnce as n, insertOperatorApproval as o, recoverOperatorApprovalsOnStartup as p, expireDueOperatorApprovals as r, isOperatorApprovalStoreOutcomeUnknown as s, consumeCronStandingGrant as t, listPendingOperatorApprovals as u };
