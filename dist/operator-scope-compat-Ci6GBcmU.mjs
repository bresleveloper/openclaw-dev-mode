//#region src/shared/operator-scope-compat.ts
const OPERATOR_ROLE = "operator";
const OPERATOR_ADMIN_SCOPE = "operator.admin";
const OPERATOR_READ_SCOPE = "operator.read";
const OPERATOR_TALK_SCOPE = "operator.talk";
const OPERATOR_WRITE_SCOPE = "operator.write";
const OPERATOR_SESSION_READ_SCOPE = "operator.sessions.read";
const OPERATOR_SESSION_WRITE_SCOPE = "operator.sessions.write";
const OPERATOR_SCOPE_PREFIX = "operator.";
function operatorScopeSatisfied(requestedScope, granted) {
	if (!requestedScope.startsWith(OPERATOR_SCOPE_PREFIX)) return false;
	return granted.includes(requestedScope) || granted.includes(OPERATOR_ADMIN_SCOPE) || (requestedScope === OPERATOR_READ_SCOPE || requestedScope === OPERATOR_TALK_SCOPE || requestedScope === OPERATOR_SESSION_READ_SCOPE || requestedScope === OPERATOR_SESSION_WRITE_SCOPE) && granted.includes(OPERATOR_WRITE_SCOPE) || requestedScope === OPERATOR_SESSION_READ_SCOPE && (granted.includes(OPERATOR_READ_SCOPE) || granted.includes(OPERATOR_SESSION_WRITE_SCOPE));
}
/** Returns true when a role grant satisfies requested scopes, including operator implications. */
function roleScopesAllow(params) {
	return resolveMissingRequestedScope(params) === null;
}
/** Keeps only permissions shared by both ceilings, including implied operator scopes. */
function intersectOperatorScopes(scopes, ceiling) {
	if (roleScopesAllow({
		role: "operator",
		requestedScopes: scopes,
		allowedScopes: ceiling
	})) return [...scopes];
	const result = [.../* @__PURE__ */ new Set([...scopes, ...ceiling])].filter((scope) => roleScopesAllow({
		role: "operator",
		requestedScopes: [scope],
		allowedScopes: scopes
	}) && roleScopesAllow({
		role: "operator",
		requestedScopes: [scope],
		allowedScopes: ceiling
	}));
	for (const scope of [OPERATOR_SESSION_WRITE_SCOPE, OPERATOR_SESSION_READ_SCOPE]) if (operatorScopeSatisfied(scope, scopes) && operatorScopeSatisfied(scope, ceiling) && !operatorScopeSatisfied(scope, result)) result.push(scope);
	return result;
}
/** Returns the original first requested scope not covered by the role's allowed scopes. */
function resolveMissingRequestedScope(params) {
	const role = params.role.trim();
	const prefix = `${role}.`;
	const allowedScopes = params.allowedScopes.map((scope) => scope.trim());
	for (const scope of params.requestedScopes) {
		const requestedScope = scope.trim();
		if (!requestedScope) continue;
		if (!(role === OPERATOR_ROLE ? operatorScopeSatisfied(requestedScope, allowedScopes) : requestedScope.startsWith(prefix) && allowedScopes.includes(requestedScope))) return scope;
	}
	return null;
}
/** Returns the first requested scope that does not belong to any requested role. */
function resolveScopeOutsideRequestedRoles(params) {
	const prefixes = params.requestedRoles.map((role) => `${role.trim()}.`);
	for (const scope of params.requestedScopes) {
		const requestedScope = scope.trim();
		if (!prefixes.some((prefix) => !requestedScope || requestedScope.startsWith(prefix))) return scope;
	}
	return null;
}
//#endregion
export { roleScopesAllow as a, resolveScopeOutsideRequestedRoles as i, operatorScopeSatisfied as n, resolveMissingRequestedScope as r, intersectOperatorScopes as t };
