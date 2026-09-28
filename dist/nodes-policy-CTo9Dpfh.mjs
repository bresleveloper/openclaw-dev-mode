import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import "./node-commands-BLhGKTZa.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
//#region src/gateway/server-methods/nodes-policy.ts
const nodeInvokePolicy = {
	wakeThrottleMs: 15e3,
	wakeNudgeThrottleMs: 6e5,
	pendingActionTtlMs: 6e5,
	pendingActionMaxPerNode: 64,
	canReadPendingNodePairing(client) {
		const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
		return scopes.includes("operator.admin") || scopes.includes("operator.pairing");
	},
	clientHasOperatorAdminScope(client) {
		return (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(ADMIN_SCOPE);
	},
	rejectClaudeAgentRun(command, respond) {
		if (command !== "agent.cli.claude.run.v1") return false;
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "node.invoke does not allow Claude agent runs; use sessions.catalog.continue", { details: { command } }));
		return true;
	}
};
//#endregion
export { nodeInvokePolicy as t };
