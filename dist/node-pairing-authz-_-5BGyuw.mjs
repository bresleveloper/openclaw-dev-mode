import { n as filterStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { M as isAdminOnlyNodeInvokeCommand, a as NODE_EXEC_APPROVALS_COMMANDS, m as NODE_SYSTEM_RUN_COMMANDS } from "./node-commands-Bxo-2Y4j.mjs";
//#region src/infra/node-pairing-authz.ts
function isAdminPairApprovalCommand(command) {
	return isAdminOnlyNodeInvokeCommand(command) || NODE_SYSTEM_RUN_COMMANDS.some((allowed) => allowed === command) || NODE_EXEC_APPROVALS_COMMANDS.some((allowed) => allowed === command);
}
/** Map declared node commands to the least operator scopes needed for approval. */
function resolveNodePairApprovalScopes(commands) {
	const normalized = filterStringEntries(commands);
	if (normalized.some(isAdminPairApprovalCommand)) return ["operator.pairing", "operator.admin"];
	if (normalized.length > 0) return ["operator.pairing", "operator.write"];
	return ["operator.pairing"];
}
//#endregion
export { resolveNodePairApprovalScopes as t };
