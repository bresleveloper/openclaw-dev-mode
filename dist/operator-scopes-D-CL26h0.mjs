//#region src/gateway/operator-scopes.ts
const ADMIN_SCOPE = "operator.admin";
const READ_SCOPE = "operator.read";
const WRITE_SCOPE = "operator.write";
const SESSION_READ_SCOPE = "operator.sessions.read";
const SESSION_WRITE_SCOPE = "operator.sessions.write";
const APPROVALS_SCOPE = "operator.approvals";
const QUESTIONS_SCOPE = "operator.questions";
const PAIRING_SCOPE = "operator.pairing";
const TALK_SCOPE = "operator.talk";
const TALK_SECRETS_SCOPE = "operator.talk.secrets";
const KNOWN_OPERATOR_SCOPES = /* @__PURE__ */ new Set([
	ADMIN_SCOPE,
	READ_SCOPE,
	WRITE_SCOPE,
	SESSION_READ_SCOPE,
	SESSION_WRITE_SCOPE,
	APPROVALS_SCOPE,
	QUESTIONS_SCOPE,
	PAIRING_SCOPE,
	TALK_SCOPE,
	TALK_SECRETS_SCOPE
]);
/** Narrows untrusted auth-token scope entries to the gateway's closed scope set. */
function isOperatorScope(value) {
	return typeof value === "string" && KNOWN_OPERATOR_SCOPES.has(value);
}
/** Filters unknown strings down to unique operator scopes; undefined stays undefined. */
function normalizeOperatorScopeList(scopes) {
	if (!Array.isArray(scopes)) return;
	const normalized = [];
	for (const scope of scopes) if (isOperatorScope(scope) && !normalized.includes(scope)) normalized.push(scope);
	return normalized;
}
//#endregion
export { READ_SCOPE as a, TALK_SCOPE as c, isOperatorScope as d, normalizeOperatorScopeList as f, QUESTIONS_SCOPE as i, TALK_SECRETS_SCOPE as l, APPROVALS_SCOPE as n, SESSION_READ_SCOPE as o, PAIRING_SCOPE as r, SESSION_WRITE_SCOPE as s, ADMIN_SCOPE as t, WRITE_SCOPE as u };
