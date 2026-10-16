import { a as NODE_EXEC_APPROVALS_COMMANDS, j as isAdminOnlyNodeInvokeCommand, m as NODE_SYSTEM_RUN_COMMANDS } from "./node-commands-BLhGKTZa.mjs";
//#region src/infra/node-pairing-authz.ts
function isAdminPairApprovalCommand(command) {
	return isAdminOnlyNodeInvokeCommand(command) || NODE_SYSTEM_RUN_COMMANDS.some((allowed) => allowed === command) || NODE_EXEC_APPROVALS_COMMANDS.some((allowed) => allowed === command);
}
/** Map declared node commands to the least operator scopes needed for approval. */
function resolveNodePairApprovalScopes(commands) {
	const normalized = Array.isArray(commands) ? commands.filter((command) => typeof command === "string") : [];
	if (normalized.some(isAdminPairApprovalCommand)) return ["operator.pairing", "operator.admin"];
	if (normalized.length > 0) return ["operator.pairing", "operator.write"];
	return ["operator.pairing"];
}
//#endregion
export { resolveNodePairApprovalScopes as t };
