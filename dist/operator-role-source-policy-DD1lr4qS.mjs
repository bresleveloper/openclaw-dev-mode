import { isDeepStrictEqual } from "node:util";
//#region src/gateway/operator-role-source-policy.ts
/** Model ceilings can narrow a run without retiring its original operator source. */
function sourceRolePolicy(role) {
	if (!role) return;
	const { modelPolicy: _modelPolicy, ...sourcePolicy } = role;
	return sourcePolicy;
}
function sourceRolePolicies(roles) {
	return roles ? {
		...roles,
		definitions: Object.fromEntries(Object.entries(roles.definitions).map(([name, role]) => [name, sourceRolePolicy(role)]))
	} : void 0;
}
/** Compare role keys as record keys; administrator-chosen names may contain dots. */
function haveSameOperatorRoleSourcePolicies(previous, next) {
	if (!previous || !next) return false;
	return isDeepStrictEqual(sourceRolePolicies(previous), sourceRolePolicies(next));
}
//#endregion
export { sourceRolePolicies as n, sourceRolePolicy as r, haveSameOperatorRoleSourcePolicies as t };
