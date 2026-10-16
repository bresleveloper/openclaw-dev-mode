import { a as hasGatewayClientCap, n as GATEWAY_CLIENT_IDS, t as GATEWAY_CLIENT_CAPS } from "./client-info-C8RatpKO.mjs";
import { $o as validateUiCommandParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { o as resolveStoredSessionKeyForAgentStore } from "./session-store-key-Ci099tm9.mjs";
import { a as getGatewayToolCallerIdentity, s as resolveGatewayPersonalToolParticipant } from "./gateway-caller-context-DWr-fdGt.mjs";
import { t as assertActiveAgentRuntimeAuthority } from "./agent-runtime-authority-Bf7e1KZt.mjs";
import { r as defineValidatedGatewayMethod } from "./validation-Bu27N0nv.mjs";
import { t as captureGatewayUiCommandTarget } from "./ui-command-target-BHjiDymC.mjs";
//#region src/gateway/server-methods/ui-command.ts
function dispatchUiCommandToRequester({ params: commandParams, context, client }) {
	const runtimeIdentity = client?.internal?.agentRuntimeIdentity;
	const participant = resolveGatewayPersonalToolParticipant(runtimeIdentity);
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
	const target = participant ? participant.gatewayUiCommandTarget : runtimeIdentity ? runtimeIdentity.gatewayUiCommandTarget : getGatewayToolCallerIdentity()?.gatewayUiCommandTarget ?? captureGatewayUiCommandTarget(client);
	const connIds = context.getClientConnIds?.((recipient) => target !== void 0 && recipient.connId === target.connId && !recipient.invalidated && !recipient.connectionSignal?.aborted && (!target.profileId || recipient.authenticatedUserProfile?.profileId === target.profileId) && recipient.connect.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI && hasGatewayClientCap(recipient.connect.caps, GATEWAY_CLIENT_CAPS.UI_COMMANDS)) ?? /* @__PURE__ */ new Set();
	if (connIds.size === 0) return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, target ? "requesting Control UI is no longer connected; ask again from the open Control UI" : "no requesting Control UI; ask from the Control UI to change its view")
	};
	participant?.assertCurrent();
	context.broadcastToConnIds("ui.command", normalizedParams, connIds);
	return { ok: true };
}
const uiCommandHandlers = { "ui.command": defineValidatedGatewayMethod("ui.command", validateUiCommandParams, (options) => {
	try {
		assertActiveAgentRuntimeAuthority(options.client, options.context);
		const result = dispatchUiCommandToRequester(options);
		if (result.ok) options.respond(true, { ok: true });
		else options.respond(false, void 0, result.error);
	} catch (error) {
		options.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : String(error)));
	}
}) };
//#endregion
export { uiCommandHandlers as n, dispatchUiCommandToRequester as t };
