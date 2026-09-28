import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { a as isPersistentSystemAgentOperation } from "./operations-parse-B6VcQhEV.mjs";
import { createHash } from "node:crypto";
//#region src/system-agent/operator-approval.ts
/** Canonical operation fingerprint used to bind approval to one exact mutation. */
function hashSystemAgentOperation(operation) {
	return createHash("sha256").update(stableStringify(operation)).digest("hex");
}
const APPROVE_RE = /^(?:y|yes|yeah|yep|yup|sure|ok|okay|approve|approved|apply|confirm|confirmed|do it|go ahead|sounds good|yes please|please do)$/i;
const DECLINE_RE = /^(?:n|no|nope|nah|skip|not now|cancel|stop|abort|later|decline|don'?t)\b/i;
/** Deterministic whole-message approvals and prefix declines. */
function classifySystemAgentApprovalText(message) {
	const normalized = message.trim().replace(/[.!?,\s]+$/u, "").toLowerCase();
	if (!normalized) return "other";
	if (APPROVE_RE.test(normalized)) return "approve";
	if (DECLINE_RE.test(normalized)) return "decline";
	return "other";
}
function resolvePendingOperatorProposal(pending, proposalRef) {
	const operation = pending ?? proposalRef.operation;
	if (!operation || !isPersistentSystemAgentOperation(operation)) return null;
	const hash = hashSystemAgentOperation(operation);
	if (proposalRef.current && proposalRef.current !== hash) return null;
	return {
		operation,
		hash
	};
}
async function resolveOperatorApprovalDecision(params) {
	const proposal = params.getProposal();
	if (!proposal || proposal.hash !== params.proposalHash) return null;
	if (params.decision !== "allow-once") {
		params.clear();
		return params.denied();
	}
	params.clear();
	return await params.apply(proposal.operation);
}
//#endregion
export { resolvePendingOperatorProposal as i, hashSystemAgentOperation as n, resolveOperatorApprovalDecision as r, classifySystemAgentApprovalText as t };
