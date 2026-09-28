import { n as GATEWAY_CLIENT_IDS } from "./client-info-B_ICKCYw.mjs";
//#region src/gateway/ui-command-target.ts
function captureGatewayUiCommandTarget(client) {
	const connId = client?.connId?.trim();
	if (!connId || client?.connect.client.id !== GATEWAY_CLIENT_IDS.CONTROL_UI || client.internal?.syntheticClient || client.invalidated || client.connectionSignal?.aborted) return;
	return Object.freeze({
		connId,
		...client.authenticatedUserProfile?.profileId ? { profileId: client.authenticatedUserProfile.profileId } : {}
	});
}
//#endregion
export { captureGatewayUiCommandTarget as t };
