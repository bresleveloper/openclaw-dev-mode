import { o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
//#region src/gateway/server-methods/gateway-personal-caller.ts
function isSyntheticGatewayCaller(client) {
	return Boolean(client?.internal?.syntheticClient || client?.internal?.agentToolCaller || client?.internal?.agentRuntimeIdentity || getGatewayToolCallerIdentity());
}
function isIneligiblePersonalGatewayCaller(client) {
	const actor = client.internal?.operatorRoleActor;
	const delegated = client.internal?.remoteIngressPrincipal;
	if (delegated) {
		try {
			delegated.signal.throwIfAborted();
			delegated.assertCurrent();
		} catch {
			return true;
		}
		if (client.authenticatedUserProfile?.profileId !== delegated.authenticatedUserProfile.profileId) return true;
		const delegatedActor = delegated.operatorRoleActor;
		return isSyntheticGatewayCaller(client) || (delegatedActor.kind === "operator" ? actor?.kind !== "operator" || actor.profileId !== delegatedActor.profileId : actor?.kind !== "system");
	}
	return isSyntheticGatewayCaller(client) || Boolean(actor && (actor.kind !== "system" || !client.authenticatedUserProfile));
}
/** Personal actions retain either the exact registered socket or the live host-bound grant. */
function hasCurrentPersonalGatewaySource(client, context) {
	if (!client || client.invalidated || client.connectionSignal?.aborted || client.connect.role !== "operator" || isIneligiblePersonalGatewayCaller(client)) return false;
	return Boolean(client.internal?.remoteIngressPrincipal || client.connId && context.getClientConnIds?.((current) => current === client).has(client.connId));
}
//#endregion
export { isIneligiblePersonalGatewayCaller as n, isSyntheticGatewayCaller as r, hasCurrentPersonalGatewaySource as t };
