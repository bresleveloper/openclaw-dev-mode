import { t as isApprovalNotFoundError } from "./approval-errors-DHiqam1A.js";
import "./error-runtime-Ck1CsJM-.js";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-oPqfzhN6.js";
import "./approval-gateway-runtime-055vq4ud.js";
//#region extensions/imessage/src/approval-resolver.ts
async function resolveIMessageApproval(params) {
	await resolveApprovalOverGateway({
		cfg: params.cfg,
		approvalId: params.approvalId,
		decision: params.decision,
		senderId: params.senderId,
		gatewayUrl: params.gatewayUrl,
		clientDisplayName: `iMessage approval (${params.senderId?.trim() || "unknown"})`
	});
}
//#endregion
export { isApprovalNotFoundError, resolveIMessageApproval };
