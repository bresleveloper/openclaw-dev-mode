import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
//#region src/gateway/server-methods/agent-runtime-authority.ts
function hasActiveAgentRuntimeAuthority(client, context, assertCallerCurrent) {
	try {
		assertCallerCurrent?.();
	} catch {
		return false;
	}
	const identity = client?.internal?.agentRuntimeIdentity;
	const validate = context.validateAgentRuntimeApprovalAuthority;
	return !identity || !validate || validate(identity);
}
function assertActiveAgentRuntimeAuthority(client, context, assertCallerCurrent) {
	if (!hasActiveAgentRuntimeAuthority(client, context, assertCallerCurrent)) throw new TypeError("agent runtime authority is no longer active");
}
function createAgentRuntimeAuthorityGuard(client, context, respond, assertCallerCurrent) {
	const hasActive = () => hasActiveAgentRuntimeAuthority(client, context, assertCallerCurrent);
	return {
		commitGuard: assertCallerCurrent || client?.internal?.agentRuntimeIdentity && context.validateAgentRuntimeApprovalAuthority ? () => assertActiveAgentRuntimeAuthority(client, context, assertCallerCurrent) : void 0,
		ensureActive() {
			if (hasActive()) return true;
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent runtime authority is no longer active"));
			return false;
		},
		handleClosedError(error) {
			if (error instanceof TypeError && !hasActive()) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
				return;
			}
			throw error;
		},
		hasActive
	};
}
//#endregion
export { createAgentRuntimeAuthorityGuard as n, hasActiveAgentRuntimeAuthority as r, assertActiveAgentRuntimeAuthority as t };
