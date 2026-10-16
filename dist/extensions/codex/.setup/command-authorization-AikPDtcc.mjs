//#region extensions/codex/src/command-authorization.ts
const CODEX_NATIVE_EXECUTION_AUTH_ERROR = "Only an owner or operator.admin can control Codex native execution.";
const CODEX_HOST_INSPECTION_AUTH_ERROR = "Only an owner or operator.admin can inspect Codex host state.";
const CODEX_FULL_PERMISSIONS_AUTH_ERROR = "Full Codex permissions require operator.admin. Choose Admin in the Control UI permission picker, or use an admin-authenticated CLI.";
function hasCodexAdminScope(ctx) {
	return ctx.gatewayClientScopes?.includes("operator.admin") === true;
}
function canMutateCodexHost(ctx) {
	return ctx.senderIsOwner === true || hasCodexAdminScope(ctx);
}
function assertCodexHostOwnerCurrent(ctx) {
	if (!hasCodexAdminScope(ctx)) ctx.assertOwnerCurrent?.();
}
//#endregion
export { canMutateCodexHost as a, assertCodexHostOwnerCurrent as i, CODEX_HOST_INSPECTION_AUTH_ERROR as n, hasCodexAdminScope as o, CODEX_NATIVE_EXECUTION_AUTH_ERROR as r, CODEX_FULL_PERMISSIONS_AUTH_ERROR as t };
