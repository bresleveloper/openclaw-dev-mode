import { u as WRITE_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as CLI_DEFAULT_OPERATOR_SCOPES } from "./method-scopes-C7g7eSZh.mjs";
import { d as resolveTrustedHttpOperatorScopes, h as applyHttpOperatorRoleScopeCeiling } from "./http-auth-utils-DnAyBVQj.mjs";
import { n as getHeader } from "./http-header-value-Be14tJQx.mjs";
//#region src/gateway/server/plugin-route-runtime-scopes.ts
/** Resolves the scopes a plugin route receives after gateway HTTP authentication. */
function resolvePluginRouteRuntimeOperatorScopes(req, requestAuth, surface = "write-default") {
	if (requestAuth.authMethod === "device-token") {
		const deviceScopes = applyHttpOperatorRoleScopeCeiling(requestAuth.deviceOperatorScopes ?? [], requestAuth);
		return surface === "trusted-operator" ? deviceScopes : [WRITE_SCOPE].filter((scope) => roleScopesAllow({
			role: "operator",
			requestedScopes: [scope],
			allowedScopes: deviceScopes
		}));
	}
	if (surface === "trusted-operator" ? requestAuth.trustDeclaredOperatorScopes : requestAuth.authMethod === "trusted-proxy" && getHeader(req, "x-openclaw-scopes") !== void 0) return resolveTrustedHttpOperatorScopes(req, requestAuth);
	const defaultScopes = surface === "trusted-operator" ? [...CLI_DEFAULT_OPERATOR_SCOPES] : [WRITE_SCOPE];
	return applyHttpOperatorRoleScopeCeiling(defaultScopes, requestAuth);
}
//#endregion
export { resolvePluginRouteRuntimeOperatorScopes as t };
