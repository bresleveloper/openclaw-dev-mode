import { r as listVisiblePendingApprovalRequests } from "./approval-record-lookup-KFM8XG5s.mjs";
//#region src/gateway/server-methods/system-agent-approvals.ts
const systemAgentApprovalHandlers = { "openclaw.approval.list": async ({ respond, client, context }) => {
	const manager = context.systemAgentApprovalManager;
	respond(true, manager ? await listVisiblePendingApprovalRequests({
		manager,
		client,
		...client?.authenticatedUserProfile ? { getCfg: context.getRuntimeConfig } : {}
	}) : [], void 0);
} };
//#endregion
export { systemAgentApprovalHandlers };
