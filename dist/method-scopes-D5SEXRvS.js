import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as getPluginRegistryState } from "./runtime-state-CDEoJIrS.js";
import { n as resolveReservedGatewayMethodScope } from "./gateway-method-policy-BQVhuE4m.js";
import { a as isDynamicOperatorGatewayMethod, c as resolveCoreOperatorGatewayMethodScope, i as isCoreNodeGatewayMethod, r as isCoreGatewayMethodClassified } from "./core-descriptors-B2lASufG.js";
import { a as TALK_SECRETS_SCOPE, i as READ_SCOPE, n as APPROVALS_SCOPE, o as WRITE_SCOPE, r as PAIRING_SCOPE, s as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-CS3xdS-V.js";
//#region src/gateway/method-scopes.ts
/** Default scopes granted to CLI/operator clients when no narrower local policy is known. */
const CLI_DEFAULT_OPERATOR_SCOPES = [
	ADMIN_SCOPE,
	READ_SCOPE,
	WRITE_SCOPE,
	APPROVALS_SCOPE,
	PAIRING_SCOPE,
	TALK_SECRETS_SCOPE
];
function resolveScopedMethod(method) {
	const explicitScope = resolveCoreOperatorGatewayMethodScope(method);
	if (explicitScope) return explicitScope;
	const reservedScope = resolveReservedGatewayMethodScope(method);
	if (reservedScope) return reservedScope;
	const pluginScope = (getPluginRegistryState()?.activeRegistry?.gatewayMethodDescriptors?.find((descriptor) => descriptor.name === method))?.scope;
	return pluginScope === "node" || pluginScope === "dynamic" ? void 0 : pluginScope;
}
/** Returns true when a method requires the approvals operator scope. */
function isApprovalMethod(method) {
	return resolveScopedMethod(method) === APPROVALS_SCOPE;
}
/** Returns true when a method is reserved for node-role clients instead of operators. */
function isNodeRoleMethod(method) {
	return isCoreNodeGatewayMethod(method);
}
/** Returns true when a method requires admin operator scope. */
function isAdminOnlyMethod(method) {
	return resolveScopedMethod(method) === ADMIN_SCOPE;
}
/** Resolves the required static operator scope for a gateway method, if one exists. */
function resolveRequiredOperatorScopeForMethod(method) {
	return resolveScopedMethod(method);
}
function resolveSessionActionRegisteredScopes(params) {
	if (!params || typeof params !== "object" || Array.isArray(params)) return;
	const pluginId = normalizeOptionalString(params.pluginId);
	const actionId = normalizeOptionalString(params.actionId);
	if (!pluginId || !actionId) return;
	const registration = getPluginRegistryState()?.activeRegistry?.sessionActions?.find((entry) => entry.pluginId === pluginId && entry.action.id === actionId);
	if (!registration) return;
	const requiredScopes = registration.action.requiredScopes;
	return requiredScopes && requiredScopes.length > 0 ? [...requiredScopes] : [WRITE_SCOPE];
}
function resolveSessionActionLeastPrivilegeScopes(params) {
	const registeredScopes = resolveSessionActionRegisteredScopes(params);
	if (registeredScopes) return registeredScopes;
	if (params && typeof params === "object" && !Array.isArray(params)) {
		const pluginId = normalizeOptionalString(params.pluginId);
		const actionId = normalizeOptionalString(params.actionId);
		if (pluginId && actionId) return [...CLI_DEFAULT_OPERATOR_SCOPES];
	}
	return [WRITE_SCOPE];
}
function resolveDynamicLeastPrivilegeOperatorScopesForMethod(method, params) {
	if (method === "plugins.sessionAction") return resolveSessionActionLeastPrivilegeScopes(params);
	return [WRITE_SCOPE];
}
/** Returns the narrowest known operator scopes needed to call a gateway method. */
function resolveLeastPrivilegeOperatorScopesForMethod(method, params) {
	if (isDynamicOperatorGatewayMethod(method)) return resolveDynamicLeastPrivilegeOperatorScopesForMethod(method, params);
	const requiredScope = resolveRequiredOperatorScopeForMethod(method);
	if (requiredScope) return [requiredScope];
	return [];
}
/** Checks whether a presented operator scope set authorizes a gateway method call. */
function authorizeOperatorScopesForMethod(method, scopes, params) {
	if (scopes.includes("operator.admin")) return { allowed: true };
	if (isDynamicOperatorGatewayMethod(method)) {
		const registeredScopes = resolveSessionActionRegisteredScopes(params);
		if (!registeredScopes && params && typeof params === "object" && !Array.isArray(params)) {
			const pluginId = normalizeOptionalString(params.pluginId);
			const actionId = normalizeOptionalString(params.actionId);
			if (!pluginId || !actionId) return scopes.some((scope) => isOperatorScope(scope)) ? { allowed: true } : {
				allowed: false,
				missingScope: WRITE_SCOPE
			};
		}
		const missingScope = (registeredScopes ?? ["operator.write"]).find((scope) => {
			return !scopes.includes(scope) && !(scope === "operator.read" && scopes.includes("operator.write"));
		});
		return missingScope ? {
			allowed: false,
			missingScope
		} : { allowed: true };
	}
	return authorizeOperatorScopesForRequiredScope(resolveRequiredOperatorScopeForMethod(method) ?? "operator.admin", scopes);
}
/** Checks a method registry's already-resolved static scope against presented operator scopes. */
function authorizeOperatorScopesForRequiredScope(requiredScope, scopes) {
	if (scopes.includes("operator.admin")) return { allowed: true };
	if (requiredScope === "operator.read") {
		if (scopes.includes("operator.read") || scopes.includes("operator.write")) return { allowed: true };
		return {
			allowed: false,
			missingScope: READ_SCOPE
		};
	}
	if (scopes.includes(requiredScope)) return { allowed: true };
	return {
		allowed: false,
		missingScope: requiredScope
	};
}
/** Returns true when a method has any core, node, dynamic, reserved, or plugin scope policy. */
function isGatewayMethodClassified(method) {
	if (isNodeRoleMethod(method)) return true;
	if (isDynamicOperatorGatewayMethod(method)) return true;
	return isCoreGatewayMethodClassified(method) || resolveRequiredOperatorScopeForMethod(method) !== void 0;
}
//#endregion
export { isApprovalMethod as a, resolveLeastPrivilegeOperatorScopesForMethod as c, isAdminOnlyMethod as i, resolveRequiredOperatorScopeForMethod as l, authorizeOperatorScopesForMethod as n, isGatewayMethodClassified as o, authorizeOperatorScopesForRequiredScope as r, isNodeRoleMethod as s, CLI_DEFAULT_OPERATOR_SCOPES as t };
