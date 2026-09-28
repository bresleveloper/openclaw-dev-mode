import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { createHash } from "node:crypto";
//#region src/audit/runtime-action-decision.ts
/** Bounded execution facts for owner-controlled runtime gates and actions. */
const state = resolveGlobalSingleton(Symbol.for("openclaw.runtimeActionDecisionSink"), () => ({ sink: void 0 }));
function configureRuntimeActionDecisionSink(sink) {
	state.sink = sink;
	return () => {
		if (state.sink === sink) state.sink = void 0;
	};
}
function receiptId(params) {
	return `runtime-action:${createHash("sha256").update(JSON.stringify([
		params.contextId,
		params.owner,
		params.operation,
		params.reasonCode,
		params.discriminator ?? null
	])).digest("base64url").slice(0, 32)}`;
}
/** Queue one owner-bound fact after exact execution admission. */
function recordRuntimeActionDecision(params) {
	const token = params.token;
	if (!token || !state.sink) return false;
	const id = receiptId({
		contextId: token.contextId,
		owner: params.owner,
		operation: params.operation,
		reasonCode: params.reasonCode,
		discriminator: params.discriminator
	});
	return state.sink({
		schemaVersion: 1,
		receiptId: id,
		contextId: token.contextId,
		executionId: token.executionId,
		runId: token.runId,
		occurredAt: params.occurredAt ?? Date.now(),
		action: {
			family: params.family,
			operation: params.operation,
			summary: params.summary
		},
		decision: {
			outcome: params.outcome,
			reasonCode: params.reasonCode
		},
		enforcement: {
			coverageState: params.coverageState,
			evaluatorRef: params.owner,
			policyRefs: params.policyRefs ?? [],
			grantRefs: [],
			contextFieldsUsed: [
				"contextId",
				"executionId",
				"runId"
			]
		},
		source: {
			owner: params.owner,
			recordRef: id,
			decisionBoundary: params.decisionBoundary
		},
		missingEvidence: params.missingEvidence ?? [],
		remediation: params.remediation
	});
}
//#endregion
export { recordRuntimeActionDecision as n, configureRuntimeActionDecisionSink as t };
