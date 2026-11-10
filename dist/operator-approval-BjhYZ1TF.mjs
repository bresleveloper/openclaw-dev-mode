import "./src-Djeo9OvP.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { a as isPersistentSystemAgentOperation } from "./operations-parse-B9TfqALv.mjs";
import { createHash } from "node:crypto";
//#region src/system-agent/operator-approval.ts
const APPROVAL_RETRY_GUIDANCE = "If the change is still needed, submit a fresh request and approve it in the Control UI or OpenClaw apps, or through the approval prompt in the requesting chat. Retrying alone does not approve the change.";
const SYSTEM_AGENT_APPROVAL_APPLICATION_UNCONFIRMED_TEXT = "The approved change's application status is unconfirmed. Check the current settings and OpenClaw status before retrying.";
const SYSTEM_AGENT_APPROVAL_TERMINAL_MESSAGES = {
	expired: `OpenClaw approval request expired without a decision. No change was made. The expired request can no longer be approved. ${APPROVAL_RETRY_GUIDANCE}`,
	cancelled: `OpenClaw change cancelled before application. No change was made. The approval request is no longer active. ${APPROVAL_RETRY_GUIDANCE}`,
	failed: `OpenClaw change failed to complete. ${SYSTEM_AGENT_APPROVAL_APPLICATION_UNCONFIRMED_TEXT}`
};
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
export { resolveOperatorApprovalDecision as a, hashSystemAgentOperation as i, SYSTEM_AGENT_APPROVAL_TERMINAL_MESSAGES as n, resolvePendingOperatorProposal as o, classifySystemAgentApprovalText as r, SYSTEM_AGENT_APPROVAL_APPLICATION_UNCONFIRMED_TEXT as t };
