import { t as isApprovalNotFoundError } from "./approval-errors-BEB18t3G.js";
import "./error-runtime-CDUW9C58.js";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-EFwtO4Xe.js";
import "./approval-gateway-runtime-lJMIDx62.js";
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
