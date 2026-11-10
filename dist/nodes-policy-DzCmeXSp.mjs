import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import "./operator-scopes-BO7_XQCg.mjs";
import "./node-commands-Bxo-2Y4j.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
//#region src/gateway/server-methods/nodes-policy.ts
const nodeInvokePolicy = {
	wakeThrottleMs: 15e3,
	wakeNudgeThrottleMs: 6e5,
	pendingActionTtlMs: 6e5,
	pendingActionMaxPerNode: 64,
	canReadPendingNodePairing(client) {
		const scopes = client?.connect.scopes ?? [];
		return scopes.includes("operator.admin") || scopes.includes("operator.pairing");
	},
	rejectClaudeAgentRun(command, respond) {
		if (command !== "agent.cli.claude.run.v1") return false;
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "node.invoke does not allow Claude agent runs; use sessions.catalog.continue", { details: { command } }));
		return true;
	}
};
//#endregion
export { nodeInvokePolicy as t };
