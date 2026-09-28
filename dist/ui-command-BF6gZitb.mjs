import { a as hasGatewayClientCap, n as GATEWAY_CLIENT_IDS, t as GATEWAY_CLIENT_CAPS } from "./client-info-B_ICKCYw.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Wo as validateUiCommandParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-BoleEY7N.mjs";
import { i as getGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { n as defineValidatedGatewayMethod } from "./validation-CFv_zneu.mjs";
import { t as captureGatewayUiCommandTarget } from "./ui-command-target-BjxTvhuM.mjs";
//#region src/gateway/server-methods/ui-command.ts
function dispatchUiCommandToRequester({ params: commandParams, context, client }) {
	const commandSessionKey = "sessionKey" in commandParams.command ? commandParams.command.sessionKey : commandParams.sessionKey;
	const requestedSession = commandSessionKey ? resolveRequestedSessionAgentId(context.getRuntimeConfig(), commandSessionKey, commandParams.agentId) : void 0;
	if (requestedSession && !requestedSession.ok) return {
		ok: false,
		error: requestedSession.error
	};
	const canonicalSessionKey = commandSessionKey && requestedSession?.ok ? resolveStoredSessionKeyForAgentStore({
		cfg: context.getRuntimeConfig(),
		agentId: requestedSession.agentId,
		sessionKey: commandSessionKey
	}) : void 0;
	const normalizedParams = {
		...commandParams,
		...canonicalSessionKey ? { sessionKey: canonicalSessionKey } : {},
		...requestedSession?.ok ? { agentId: requestedSession.agentId } : {},
		command: canonicalSessionKey && "sessionKey" in commandParams.command ? {
			...commandParams.command,
			sessionKey: canonicalSessionKey
		} : commandParams.command
	};
	const runtimeIdentity = client?.internal?.agentRuntimeIdentity;
	const target = runtimeIdentity ? runtimeIdentity.gatewayUiCommandTarget : getGatewayToolCallerIdentity()?.gatewayUiCommandTarget ?? captureGatewayUiCommandTarget(client);
	const connIds = context.getClientConnIds?.((recipient) => target !== void 0 && recipient.connId === target.connId && !recipient.invalidated && !recipient.connectionSignal?.aborted && (!target.profileId || recipient.authenticatedUserProfile?.profileId === target.profileId) && recipient.connect.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI && hasGatewayClientCap(recipient.connect.caps, GATEWAY_CLIENT_CAPS.UI_COMMANDS)) ?? /* @__PURE__ */ new Set();
	if (connIds.size === 0) return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, target ? "requesting Control UI is no longer connected; ask again from the open Control UI" : "no requesting Control UI; ask from the Control UI to change its view")
	};
	context.broadcastToConnIds("ui.command", normalizedParams, connIds);
	return { ok: true };
}
const uiCommandHandlers = { "ui.command": defineValidatedGatewayMethod("ui.command", validateUiCommandParams, (options) => {
	const result = dispatchUiCommandToRequester(options);
	if (result.ok) options.respond(true, { ok: true });
	else options.respond(false, void 0, result.error);
}) };
//#endregion
export { uiCommandHandlers as n, dispatchUiCommandToRequester as t };
