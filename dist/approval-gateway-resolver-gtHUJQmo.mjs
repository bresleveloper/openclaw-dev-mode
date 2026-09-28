import { r as findChatChannelLabel } from "./ids-NACrHrny.mjs";
import { n as isWellFormedApprovalId } from "./approval-id-BTRnO3t1.mjs";
import { t as isApprovalNotFoundError } from "./approval-errors-BPkaCbRr.mjs";
import { t as getGatewayNativeApprovalRuntime } from "./approval-gateway-runtime-context-RP-DVAyK.mjs";
import { n as withOperatorApprovalsGatewayClient } from "./operator-approvals-client-rt3rlZL2.mjs";
//#region src/infra/approval-gateway-resolver.ts
async function resolveApprovalOverGateway(params) {
	const approvalKind = params.approvalKind;
	const resolveMethod = params.resolveMethod;
	const canonicalKind = approvalKind === "exec" || approvalKind === "plugin" || approvalKind === "system-agent" ? approvalKind : null;
	const legacyMethod = resolveMethod === "exec" || resolveMethod === "plugin" ? resolveMethod : null;
	const hasCanonicalKind = canonicalKind !== null;
	const hasLegacyMethod = legacyMethod !== null;
	const allowPluginFallback = params.allowPluginFallback;
	const gatewayRuntime = params.gatewayRuntime;
	if (approvalKind !== void 0) {
		if (!hasCanonicalKind || resolveMethod !== void 0 || allowPluginFallback !== void 0) throw new Error("canonical approval resolution requires exactly one valid owner kind");
	} else if (resolveMethod !== void 0 && !hasLegacyMethod || allowPluginFallback !== void 0 && typeof allowPluginFallback !== "boolean" || gatewayRuntime !== void 0) throw new Error("legacy approval resolution requires valid routing options");
	if (params.decision !== "allow-once" && params.decision !== "allow-always" && params.decision !== "deny") throw new Error("approval resolution requires a valid decision");
	const approvalId = params.approvalId;
	if (typeof approvalId !== "string" || !isWellFormedApprovalId(approvalId)) throw new Error("approval resolution requires an approval id");
	const senderId = params.senderId?.trim();
	const channel = params.channel?.trim();
	const accountId = params.accountId?.trim();
	if (Boolean(channel || accountId || senderId) && (!channel || !accountId || !senderId)) throw new Error("channel approval resolution requires channel, account, and sender identity");
	const reviewer = channel && accountId && senderId ? {
		channel,
		accountId,
		senderId
	} : void 0;
	const channelLabel = channel ? findChatChannelLabel(channel) ?? channel : void 0;
	const clientDisplayName = params.clientDisplayName ?? (channelLabel ? `${channelLabel} approval (${senderId ?? "unknown"})` : `Approval (${senderId ?? "unknown"})`);
	const canonicalGatewayRuntime = params.gatewayRuntime;
	if (canonicalGatewayRuntime && canonicalKind) return await canonicalGatewayRuntime.request("approval.resolve", {
		id: approvalId,
		kind: canonicalKind,
		decision: params.decision,
		...reviewer ? { reviewer } : {}
	}, { clientDisplayName });
	const requestWithClient = async (gatewayClient) => {
		if (hasCanonicalKind) {
			const resolveParams = {
				id: approvalId,
				kind: canonicalKind,
				decision: params.decision,
				...reviewer ? { reviewer } : {}
			};
			return await gatewayClient.request("approval.resolve", resolveParams);
		}
		const requestLegacyResolve = async (method) => {
			await gatewayClient.request(method, {
				id: approvalId,
				decision: params.decision,
				...reviewer ? { reviewer } : {}
			});
		};
		if (legacyMethod === "plugin" || !legacyMethod && approvalId.startsWith("plugin:")) {
			await requestLegacyResolve("plugin.approval.resolve");
			return;
		}
		try {
			await requestLegacyResolve("exec.approval.resolve");
		} catch (error) {
			if (allowPluginFallback !== true || !isApprovalNotFoundError(error)) throw error;
			await requestLegacyResolve("plugin.approval.resolve");
		}
	};
	const scopedGatewayRuntime = getGatewayNativeApprovalRuntime();
	const result = scopedGatewayRuntime ? await requestWithClient({ request: async (method, requestParams) => await scopedGatewayRuntime.request(method, requestParams, { clientDisplayName }) }) : await withOperatorApprovalsGatewayClient({
		config: params.cfg,
		gatewayUrl: params.gatewayUrl,
		clientDisplayName
	}, requestWithClient);
	return hasCanonicalKind ? result : void 0;
}
//#endregion
export { resolveApprovalOverGateway as t };
