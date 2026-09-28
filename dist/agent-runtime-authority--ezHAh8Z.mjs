import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
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
function ensureActiveAgentRuntimeAuthority(params) {
	if (hasActiveAgentRuntimeAuthority(params.client, params.context, params.assertCallerCurrent)) return true;
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent runtime authority is no longer active"));
	return false;
}
function createAgentRuntimeAuthorityGuard(client, context, respond, assertCallerCurrent) {
	const hasActive = () => hasActiveAgentRuntimeAuthority(client, context, assertCallerCurrent);
	return {
		commitGuard: assertCallerCurrent || client?.internal?.agentRuntimeIdentity && context.validateAgentRuntimeApprovalAuthority ? () => assertActiveAgentRuntimeAuthority(client, context, assertCallerCurrent) : void 0,
		ensureActive: () => ensureActiveAgentRuntimeAuthority({
			client,
			context,
			respond,
			assertCallerCurrent
		}),
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
