import { a as isGatewayClientProfilePending } from "./gateway-client-identity-DXWhtQve.mjs";
//#region src/system-agent/delegation-session.ts
function resolveSystemAgentDelegationKey(delegation) {
	return delegation ? JSON.stringify([delegation.agentId ?? null, delegation.sessionKey ?? null]) : void 0;
}
//#endregion
//#region src/gateway/server-methods/system-agent-session-owner.ts
function resolveSystemAgentSessionOwnerKey(params) {
	const delegationKey = resolveSystemAgentDelegationKey(params.delegation);
	if (delegationKey !== void 0) return delegationKey;
	const profileId = params.client?.authenticatedUserProfile?.profileId.trim();
	if (profileId) return `user:${profileId}`;
	if (isGatewayClientProfilePending(params.client)) return;
	const userId = params.client?.authenticatedUserId?.trim();
	if (userId) return `user:${userId}`;
	const deviceId = params.client?.connect.device?.id.trim();
	if (deviceId) return `device:${deviceId}`;
	const connId = params.client?.connId?.trim();
	return connId ? `connection:${connId}` : void 0;
}
//#endregion
export { resolveSystemAgentSessionOwnerKey as t };
