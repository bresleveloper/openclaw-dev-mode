import { a as getGatewayToolCallerIdentity } from "./gateway-caller-context-DWr-fdGt.mjs";
//#region src/gateway/server-methods/gateway-personal-caller.ts
function isSyntheticGatewayCaller(client) {
	return Boolean(client?.internal?.syntheticClient || client?.internal?.agentToolCaller || client?.internal?.agentRuntimeIdentity || getGatewayToolCallerIdentity());
}
function isIneligiblePersonalGatewayCaller(client) {
	const actor = client.internal?.operatorRoleActor;
	return isSyntheticGatewayCaller(client) || Boolean(actor && (actor.kind !== "system" || !client.authenticatedUserProfile));
}
//#endregion
export { isSyntheticGatewayCaller as n, isIneligiblePersonalGatewayCaller as t };
