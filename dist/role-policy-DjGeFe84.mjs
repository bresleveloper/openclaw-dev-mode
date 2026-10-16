import { i as isCoreNodeGatewayMethod } from "./core-method-policy-CcBevufV.mjs";
//#region src/gateway/role-policy.ts
/** Parses the untrusted role claim from connect params into the closed role set. */
function parseGatewayRole(roleRaw) {
	if (roleRaw === "operator" || roleRaw === "node") return roleRaw;
	return null;
}
/** Operators using shared auth may connect before device identity is established. */
function roleCanSkipDeviceIdentity(role, sharedAuthOk) {
	return role === "operator" && sharedAuthOk;
}
/** Keeps node-originated notifications off the operator RPC surface, and vice versa. */
function isRoleAuthorizedForMethod(role, method) {
	if (isCoreNodeGatewayMethod(method)) return role === "node";
	return role === "operator";
}
//#endregion
export { parseGatewayRole as n, roleCanSkipDeviceIdentity as r, isRoleAuthorizedForMethod as t };
