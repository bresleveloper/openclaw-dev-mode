import "./operator-scopes-D-CL26h0.mjs";
//#region src/shared/gateway-method-policy.ts
const RESERVED_ADMIN_GATEWAY_METHOD_PREFIXES = [
	"exec.approvals.",
	"config.",
	"wizard.",
	"update."
];
const RESERVED_ADMIN_GATEWAY_METHOD_SCOPE = "operator.admin";
/** Return whether a gateway method is reserved for operator admin calls. */
function isReservedAdminGatewayMethod(method) {
	return RESERVED_ADMIN_GATEWAY_METHOD_PREFIXES.some((prefix) => method.startsWith(prefix));
}
/** Resolve the mandatory scope for reserved gateway methods. */
function resolveReservedGatewayMethodScope(method) {
	if (!isReservedAdminGatewayMethod(method)) return;
	return RESERVED_ADMIN_GATEWAY_METHOD_SCOPE;
}
/** Coerce plugin-declared scopes away from unsafe reserved gateway method scopes. */
function normalizePluginGatewayMethodScope(method, scope) {
	const reservedScope = resolveReservedGatewayMethodScope(method);
	if (!reservedScope || !scope || scope === reservedScope) return {
		scope,
		coercedToReservedAdmin: false
	};
	return {
		scope: reservedScope,
		coercedToReservedAdmin: true
	};
}
//#endregion
//#region src/gateway/methods/descriptor.ts
/** Scope marker for methods that only authenticated node clients may call. */
const NODE_GATEWAY_METHOD_SCOPE = "node";
/** Scope marker for methods whose handler derives the required operator scope at runtime. */
const DYNAMIC_GATEWAY_METHOD_SCOPE = "dynamic";
/** Creates a plugin-owned method descriptor with plugin namespace scope normalization. */
function createPluginGatewayMethodDescriptor(params) {
	const normalizedScope = normalizePluginGatewayMethodScope(params.name, params.scope).scope;
	return {
		name: params.name,
		handler: params.handler,
		owner: {
			kind: "plugin",
			pluginId: params.pluginId
		},
		profileAccess: params.profileAccess ?? "required",
		scope: normalizedScope ?? "operator.admin"
	};
}
//#endregion
export { resolveReservedGatewayMethodScope as a, normalizePluginGatewayMethodScope as i, NODE_GATEWAY_METHOD_SCOPE as n, createPluginGatewayMethodDescriptor as r, DYNAMIC_GATEWAY_METHOD_SCOPE as t };
