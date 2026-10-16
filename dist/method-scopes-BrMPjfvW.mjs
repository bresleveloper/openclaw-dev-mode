import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as getPluginRegistryForContext } from "./gateway-request-scope-BSmCVVpP.mjs";
import { a as READ_SCOPE, f as isOperatorScope, i as QUESTIONS_SCOPE, l as TALK_SECRETS_SCOPE, n as APPROVALS_SCOPE, r as PAIRING_SCOPE, t as ADMIN_SCOPE, u as WRITE_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { a as resolveReservedGatewayMethodScope } from "./descriptor-CsSjfpp-.mjs";
import { M as isBrowserProxyNodeInvokeCommand, j as isAdminOnlyNodeInvokeCommand } from "./node-commands-BLhGKTZa.mjs";
import { a as roleScopesAllow, n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { n as validateSessionsMoveParams, t as validateSessionsDispatchParams } from "./session-placement-validators-pPSh_0wv.mjs";
import { n as resolveSessionMethodScope, t as resolveBaseSessionMutationRequiredScope } from "./session-method-scopes-base-CcbSY8lP.mjs";
import { a as isDynamicOperatorGatewayMethod, l as resolveCoreOperatorGatewayMethodScope, r as isCoreGatewayMethodClassified } from "./core-method-policy-CcBevufV.mjs";
//#region src/shared/session-method-scopes.ts
/** Returns the exact Gateway/CLI scope for params-aware session mutations. */
function resolveDynamicSessionMutationRequiredScope(method, params) {
	if (method === "sessions.dispatch") {
		if (!validateSessionsDispatchParams(params)) return "operator.write";
		return params.deviceId !== void 0 || params.autoDevice === true ? "operator.write" : "operator.admin";
	}
	if (method === "sessions.move") return validateSessionsMoveParams(params) && params.target.kind === "profile" ? "operator.admin" : "operator.write";
	return resolveBaseSessionMutationRequiredScope(method, params);
}
//#endregion
//#region src/gateway/agent-command-policy.ts
/** Commands routed through `agent` that mutate session lifecycle state. */
const AGENT_SESSION_RESET_COMMAND_RE = /^\/(new|reset)(?:\s+([\s\S]*))?$/i;
/** Returns true when an agent message requests a session reset. */
function isAgentSessionResetCommand(message) {
	return typeof message === "string" && AGENT_SESSION_RESET_COMMAND_RE.test(message);
}
//#endregion
//#region src/gateway/node-browser-proxy-policy.ts
function isForbiddenBrowserProxyMutation(params) {
	if (!params || typeof params !== "object") return false;
	const candidate = params;
	const method = normalizeOptionalString(candidate.method)?.toUpperCase();
	const path = normalizeOptionalString(candidate.path);
	if (!method || !path) return false;
	const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
	const normalizedPath = withLeadingSlash.length <= 1 ? withLeadingSlash : withLeadingSlash.replace(/\/+$/, "");
	if (method === "POST" && (normalizedPath === "/profiles/create" || normalizedPath === "/reset-profile")) return true;
	return method === "DELETE" && /^\/profiles\/[^/]+$/.test(normalizedPath);
}
//#endregion
//#region src/gateway/method-scopes.ts
/** Default scopes granted to CLI/operator clients when no narrower local policy is known. */
const CLI_DEFAULT_OPERATOR_SCOPES = [
	ADMIN_SCOPE,
	READ_SCOPE,
	WRITE_SCOPE,
	APPROVALS_SCOPE,
	QUESTIONS_SCOPE,
	PAIRING_SCOPE,
	TALK_SECRETS_SCOPE
];
function resolveScopedMethod(method) {
	const explicitScope = resolveCoreOperatorGatewayMethodScope(method);
	if (explicitScope) return explicitScope;
	const reservedScope = resolveReservedGatewayMethodScope(method);
	if (reservedScope) return reservedScope;
	const pluginScope = (getPluginRegistryForContext()?.gatewayMethodDescriptors?.find((descriptor) => descriptor.name === method))?.scope;
	return pluginScope === "node" || pluginScope === "dynamic" ? void 0 : pluginScope;
}
function isApprovalMethod(method) {
	return resolveScopedMethod(method) === APPROVALS_SCOPE;
}
function resolveSessionActionRegisteredScopes(params) {
	const record = asOptionalRecord(params);
	if (!record) return;
	const pluginId = normalizeOptionalString(record.pluginId);
	const actionId = normalizeOptionalString(record.actionId);
	if (!pluginId || !actionId) return;
	const registration = getPluginRegistryForContext()?.sessionActions?.find((entry) => entry.pluginId === pluginId && entry.action.id === actionId);
	if (!registration) return;
	const requiredScopes = registration.action.requiredScopes;
	return requiredScopes && requiredScopes.length > 0 ? [...requiredScopes] : [WRITE_SCOPE];
}
function resolveSessionActionLeastPrivilegeScopes(params) {
	const registeredScopes = resolveSessionActionRegisteredScopes(params);
	if (registeredScopes) return registeredScopes;
	const record = asOptionalRecord(params);
	if (record) {
		const pluginId = normalizeOptionalString(record.pluginId);
		const actionId = normalizeOptionalString(record.actionId);
		if (pluginId && actionId) return [...CLI_DEFAULT_OPERATOR_SCOPES];
	}
	return [WRITE_SCOPE];
}
function resolveDynamicLeastPrivilegeOperatorScopesForMethod(method, params) {
	if (method === "plugins.sessionAction") return resolveSessionActionLeastPrivilegeScopes(params);
	const record = asOptionalRecord(params);
	if (method === "agent") return isAgentSessionResetCommand(record?.message) ? [ADMIN_SCOPE] : [WRITE_SCOPE];
	if (method === "node.invoke") {
		const command = record?.command;
		if (isBrowserProxyNodeInvokeCommand(command) && isForbiddenBrowserProxyMutation(record?.params)) return [WRITE_SCOPE];
		return isAdminOnlyNodeInvokeCommand(command) ? [ADMIN_SCOPE] : [WRITE_SCOPE];
	}
	if (method === "talk.config") return record?.includeSecrets === true ? [READ_SCOPE, TALK_SECRETS_SCOPE] : [READ_SCOPE];
	if (method === "environments.list") {
		const runtimeId = record && "runtimeId" in record ? record.runtimeId : void 0;
		return typeof runtimeId === "string" && runtimeId ? [WRITE_SCOPE] : [READ_SCOPE];
	}
	if (method === "channels.pairing.approve") return record?.bootstrapCommandOwner === true ? [PAIRING_SCOPE, ADMIN_SCOPE] : [PAIRING_SCOPE];
	if (method === "fs.listDir") return [record && Object.hasOwn(record, "nodeId") ? ADMIN_SCOPE : WRITE_SCOPE];
	if (method === "sessions.patch" || method === "sessions.patchMany" || method === "sessions.create" || method === "sessions.dispatch" || method === "sessions.move") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.write"];
	if (method === "sessions.delete") return [resolveDynamicSessionMutationRequiredScope(method, params) ?? "operator.admin"];
	return [WRITE_SCOPE];
}
function findMissingOperatorScope(requiredScopes, scopes) {
	return requiredScopes.find((scope) => !operatorScopeSatisfied(scope, scopes));
}
/** Returns the narrowest known operator scopes needed to call a gateway method. */
function resolveLeastPrivilegeOperatorScopesForMethod(method, params) {
	if (isDynamicOperatorGatewayMethod(method)) return resolveDynamicLeastPrivilegeOperatorScopesForMethod(method, params);
	const requiredScope = resolveScopedMethod(method);
	if (requiredScope) return [requiredScope];
	return [];
}
/** Projects requested scopes through the original grant and this call's exact scope policy. */
function projectOperatorScopesForMethod(params) {
	const requiredScopes = params.requiredScope ? [params.requiredScope] : resolveLeastPrivilegeOperatorScopesForMethod(params.method, params.requestParams);
	const sessionScope = params.sessionScope ?? resolveSessionMethodScope(params.method, params.requestParams);
	return params.requestedScopes.flatMap((requestedScope) => {
		if (roleScopesAllow({
			role: "operator",
			requestedScopes: [requestedScope],
			allowedScopes: params.allowedScopes
		})) return [requestedScope];
		if (!isOperatorScope(requestedScope) || !requiredScopes.includes(requestedScope)) return [];
		const authorization = authorizeOperatorScopesForRequiredScope(requestedScope, params.allowedScopes, sessionScope, params.method);
		return authorization.allowed && authorization.sessionScope ? [authorization.sessionScope] : [];
	});
}
/** Checks whether a presented operator scope set authorizes a gateway method call. */
function authorizeOperatorScopesForMethod(method, scopes, params) {
	if (scopes.includes("operator.admin")) return { allowed: true };
	if (isDynamicOperatorGatewayMethod(method)) {
		if (method === "plugins.sessionAction") {
			const registeredScopes = resolveSessionActionRegisteredScopes(params);
			const record = asOptionalRecord(params);
			if (!registeredScopes && record) {
				const pluginId = normalizeOptionalString(record.pluginId);
				const actionId = normalizeOptionalString(record.actionId);
				if (!pluginId || !actionId) return scopes.some((scope) => isOperatorScope(scope)) ? { allowed: true } : {
					allowed: false,
					missingScope: WRITE_SCOPE
				};
			}
			const missingScope = findMissingOperatorScope(registeredScopes ?? ["operator.write"], scopes);
			return missingScope ? {
				allowed: false,
				missingScope
			} : { allowed: true };
		}
		const missingScope = findMissingOperatorScope(resolveDynamicLeastPrivilegeOperatorScopesForMethod(method, params), scopes);
		return missingScope ? authorizeOperatorScopesForRequiredScope(missingScope, scopes, resolveSessionMethodScope(method, params), method) : { allowed: true };
	}
	return authorizeOperatorScopesForRequiredScope(resolveScopedMethod(method) ?? "operator.admin", scopes, resolveSessionMethodScope(method, params), method);
}
/** Checks a method registry's already-resolved static scope against presented operator scopes. */
function authorizeOperatorScopesForRequiredScope(requiredScope, scopes, sessionScope, method) {
	if (operatorScopeSatisfied(requiredScope, scopes)) return { allowed: true };
	if ((requiredScope === "operator.read" && sessionScope === "operator.sessions.read" || (requiredScope === "operator.write" || requiredScope === "operator.questions" && method?.startsWith("question.")) && sessionScope === "operator.sessions.write") && operatorScopeSatisfied(sessionScope, scopes)) return {
		allowed: true,
		sessionScope
	};
	return {
		allowed: false,
		missingScope: requiredScope
	};
}
/** Returns true when a method has any core, node, dynamic, reserved, or plugin scope policy. */
function isGatewayMethodClassified(method) {
	return isCoreGatewayMethodClassified(method) || resolveScopedMethod(method) !== void 0;
}
//#endregion
export { isGatewayMethodClassified as a, isForbiddenBrowserProxyMutation as c, isApprovalMethod as i, AGENT_SESSION_RESET_COMMAND_RE as l, authorizeOperatorScopesForMethod as n, projectOperatorScopesForMethod as o, authorizeOperatorScopesForRequiredScope as r, resolveLeastPrivilegeOperatorScopesForMethod as s, CLI_DEFAULT_OPERATOR_SCOPES as t };
