import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { createHash } from "node:crypto";
//#region src/audit/message-action-decision.ts
/** Exact-execution facts for message-action boundaries without a durable owner record. */
const state = resolveGlobalSingleton(Symbol.for("openclaw.messageActionDecisionSink"), () => ({ sink: void 0 }));
function configureMessageActionDecisionSink(sink) {
	state.sink = sink;
	return () => {
		if (state.sink === sink) state.sink = void 0;
	};
}
function decisionId(params) {
	const identity = [
		params.contextId,
		params.actionId,
		params.reasonCode
	];
	if (params.receiptDiscriminator) identity.push(params.receiptDiscriminator);
	return `message-action:${createHash("sha256").update(JSON.stringify(identity)).digest("base64url").slice(0, 32)}`;
}
/** Queue one unowned action or policy fact after the exact admission tuple. */
function recordMessageActionDecision(params) {
	const token = params.token;
	if (!token || !state.sink) return false;
	const resourceRef = params.channel ? `channel:${params.channel}` : void 0;
	const receiptId = decisionId({
		contextId: token.contextId,
		actionId: params.actionId,
		reasonCode: params.reasonCode,
		receiptDiscriminator: params.receiptDiscriminator
	});
	return state.sink({
		schemaVersion: 1,
		receiptId,
		contextId: token.contextId,
		executionId: token.executionId,
		runId: token.runId,
		...params.actionId.length <= 256 ? { actionId: params.actionId } : {},
		occurredAt: params.occurredAt ?? Date.now(),
		action: {
			family: "message",
			operation: params.action,
			...resourceRef && resourceRef.length <= 256 ? { resourceRef } : {},
			summary: params.summary
		},
		decision: {
			outcome: params.outcome,
			reasonCode: params.reasonCode
		},
		enforcement: {
			coverageState: params.coverageState,
			evaluatorRef: "message-action",
			policyRefs: params.policyRefs ?? [],
			grantRefs: [],
			contextFieldsUsed: [
				"contextId",
				"executionId",
				"runId"
			]
		},
		source: {
			owner: "message-action",
			recordRef: receiptId,
			decisionBoundary: "message-tool.action"
		},
		missingEvidence: [],
		remediation: params.remediation
	});
}
//#endregion
export { recordMessageActionDecision as n, configureMessageActionDecisionSink as t };
