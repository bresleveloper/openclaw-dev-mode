import { i as NODE_SYSTEM_RUN_COMMANDS, t as NODE_BROWSER_PROXY_COMMAND } from "./node-commands-SnI8Vs7F.js";
//#region src/infra/node-pairing-authz.ts
const OPERATOR_PAIRING_SCOPE = "operator.pairing";
const OPERATOR_WRITE_SCOPE = "operator.write";
const OPERATOR_ADMIN_SCOPE = "operator.admin";
const ADMIN_APPROVAL_COMMANDS = [...NODE_SYSTEM_RUN_COMMANDS, NODE_BROWSER_PROXY_COMMAND];
/** Map declared node commands to the least operator scopes needed for approval. */
function resolveNodePairApprovalScopes(commands) {
	const normalized = Array.isArray(commands) ? commands.filter((command) => typeof command === "string") : [];
	if (normalized.some((command) => ADMIN_APPROVAL_COMMANDS.some((allowed) => allowed === command))) return [OPERATOR_PAIRING_SCOPE, OPERATOR_ADMIN_SCOPE];
	if (normalized.length > 0) return [OPERATOR_PAIRING_SCOPE, OPERATOR_WRITE_SCOPE];
	return [OPERATOR_PAIRING_SCOPE];
}
//#endregion
export { resolveNodePairApprovalScopes as t };
