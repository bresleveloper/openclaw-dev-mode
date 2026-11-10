import { n as normalizeExecAsk } from "./exec-approvals-core-7oJu_fRe.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/exec-approvals-policy.ts
function requiresExecApproval(params) {
	if (params.ask === "always") return true;
	if (params.durableApprovalSatisfied === true) return false;
	return params.ask === "on-miss" && params.security === "allowlist" && (!params.analysisOk || !params.allowlistSatisfied);
}
function minSecurity(a, b) {
	const order = {
		deny: 0,
		allowlist: 1,
		full: 2
	};
	return order[a] <= order[b] ? a : b;
}
function maxAsk(a, b) {
	const order = {
		off: 0,
		"on-miss": 1,
		always: 2
	};
	return order[a] >= order[b] ? a : b;
}
const DEFAULT_EXEC_APPROVAL_DECISIONS = [
	"allow-once",
	"allow-always",
	"deny"
];
const OPTIONAL_EXEC_APPROVAL_DECISIONS = ["allow-always"];
function normalizeExecApprovalUnavailableDecisions(decisions) {
	return OPTIONAL_EXEC_APPROVAL_DECISIONS.filter((decision) => Array.isArray(decisions) && decisions.includes(decision));
}
function resolveExecApprovalAllowedDecisions(params) {
	if (normalizeExecAsk(params?.ask) === "always" || params?.allowAlwaysPersistence?.kind === "one-shot") return ["allow-once", "deny"];
	return DEFAULT_EXEC_APPROVAL_DECISIONS;
}
function resolveExecApprovalUnavailableDecisions(params) {
	const allowed = new Set(resolveExecApprovalAllowedDecisions(params));
	return OPTIONAL_EXEC_APPROVAL_DECISIONS.filter((decision) => !allowed.has(decision));
}
function resolveExecApprovalRequestAllowedDecisions(params) {
	const policyDecisions = resolveExecApprovalAllowedDecisions({ ask: params?.ask });
	const unavailableDecisions = new Set(normalizeExecApprovalUnavailableDecisions(params?.unavailableDecisions));
	if (unavailableDecisions.size === 0) return policyDecisions;
	return policyDecisions.filter((decision) => !unavailableDecisions.has(decision));
}
/** These worker commands may change grants/usage, never host execution floors. */
function assertExecApprovalsHostPolicyUnchanged(before, after) {
	const fields = (file) => ({
		security: file.defaults?.security,
		ask: file.defaults?.ask,
		agents: Object.fromEntries(Object.entries(file.agents ?? {}).filter(([, agent]) => agent.security !== void 0 || agent.ask !== void 0).map(([id, agent]) => [id, {
			security: agent.security,
			ask: agent.ask
		}]))
	});
	if (!isDeepStrictEqual(fields(before), fields(after))) throw new Error("Exec grant workers cannot change host security or ask policy");
}
//#endregion
export { requiresExecApproval as a, resolveExecApprovalUnavailableDecisions as c, normalizeExecApprovalUnavailableDecisions as i, maxAsk as n, resolveExecApprovalAllowedDecisions as o, minSecurity as r, resolveExecApprovalRequestAllowedDecisions as s, assertExecApprovalsHostPolicyUnchanged as t };
