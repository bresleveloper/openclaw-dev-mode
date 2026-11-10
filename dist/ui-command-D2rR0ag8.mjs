import { a as hasGatewayClientCap, n as GATEWAY_CLIENT_IDS, t as GATEWAY_CLIENT_CAPS } from "./client-info-BgcoFakQ.mjs";
import { Ng as errorShape, gs as validateUiCommandReportParams, hs as validateUiCommandParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { c as resolveGatewayPersonalToolParticipant, o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import { r as defineValidatedGatewayMethod } from "./validation--xIH1Pj-.mjs";
import { t as assertActiveAgentRuntimeAuthority } from "./agent-runtime-authority-B3KjbGu2.mjs";
import { t as captureGatewayUiCommandTarget } from "./ui-command-target-WjDnJd4j.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/ui-command.ts
const PRESENTATION_TIMEOUT_MS = 8e3;
const presentations = /* @__PURE__ */ new Map();
function waitForPresentation(requestId, recipient, portalId) {
	return new Promise((resolve) => {
		const finish = (presentation) => {
			clearTimeout(timer);
			recipient.connectionSignal?.removeEventListener("abort", disconnected);
			presentations.delete(requestId);
			resolve(presentation);
		};
		const unverified = (reason) => finish({
			...portalId ? { portalId } : {},
			status: "unverified",
			reason
		});
		const disconnected = () => unverified("client-disconnected");
		const timer = setTimeout(() => unverified("client-timeout"), PRESENTATION_TIMEOUT_MS);
		presentations.set(requestId, {
			recipient,
			portalId,
			finish
		});
		recipient.connectionSignal?.addEventListener("abort", disconnected, { once: true });
	});
}
function dispatchUiCommandToRequester({ params: commandParams, context, client, beforeDispatch }) {
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
	const requiredCommandCapability = normalizedParams.command.kind === "agent-github-settings" ? GATEWAY_CLIENT_CAPS.UI_AGENT_GITHUB_SETTINGS : void 0;
	const target = participant ? participant.gatewayUiCommandTarget : runtimeIdentity ? runtimeIdentity.gatewayUiCommandTarget : getGatewayToolCallerIdentity()?.gatewayUiCommandTarget ?? captureGatewayUiCommandTarget(client);
	let selectedRecipient;
	const connIds = context.getClientConnIds?.((recipient) => {
		const selected = target !== void 0 && recipient.connId === target.connId && !recipient.invalidated && !recipient.connectionSignal?.aborted && (!target.profileId || recipient.authenticatedUserProfile?.profileId === target.profileId) && recipient.connect.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI && hasGatewayClientCap(recipient.connect.caps, GATEWAY_CLIENT_CAPS.UI_COMMANDS) && (!requiredCommandCapability || hasGatewayClientCap(recipient.connect.caps, requiredCommandCapability));
		if (selected) selectedRecipient = recipient;
		return selected;
	}) ?? /* @__PURE__ */ new Set();
	if (connIds.size === 0) return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, target ? "requesting Control UI is no longer connected; ask again from the open Control UI" : "no requesting Control UI; ask from the Control UI to change its view")
	};
	participant?.assertCurrent();
	if (selectedRecipient) beforeDispatch?.(selectedRecipient);
	context.broadcastToConnIds("ui.command", normalizedParams, connIds);
	return { ok: true };
}
const uiCommandHandlers = {
	"ui.command.result": defineValidatedGatewayMethod("ui.command.result", validateUiCommandReportParams, ({ params, client, respond }) => {
		const pending = presentations.get(params.requestId);
		if (!pending || client?.connect.client.id !== GATEWAY_CLIENT_IDS.CONTROL_UI || client.connId !== pending.recipient.connId || pending.recipient.invalidated || pending.recipient.connectionSignal?.aborted || client.invalidated || client.connectionSignal?.aborted || pending.portalId && params.presentation.portalId !== pending.portalId) {
			respond(true, { ok: false });
			return;
		}
		pending.finish(params.presentation);
		respond(true, { ok: true });
	}),
	"ui.command": defineValidatedGatewayMethod("ui.command", validateUiCommandParams, async (options) => {
		assertActiveAgentRuntimeAuthority(options.client, options.context);
		const command = options.params.command;
		const requestId = command.kind === "panel" && command.panel === "portal" && command.open ? randomUUID() : void 0;
		let observation;
		const result = dispatchUiCommandToRequester({
			...options,
			params: {
				command,
				...options.params.sessionKey ? { sessionKey: options.params.sessionKey } : {},
				...options.params.agentId ? { agentId: options.params.agentId } : {},
				...requestId ? { requestId } : {}
			},
			beforeDispatch: requestId ? (recipient) => {
				observation = waitForPresentation(requestId, recipient, "portalId" in command ? command.portalId : void 0);
			} : void 0
		});
		if (result.ok) {
			const presentation = observation ? await observation : void 0;
			assertActiveAgentRuntimeAuthority(options.client, options.context);
			resolveGatewayPersonalToolParticipant(options.client?.internal?.agentRuntimeIdentity)?.assertCurrent();
			const reply = {
				ok: true,
				...presentation ? {
					delivery: "dispatched",
					presentation
				} : {}
			};
			options.respond(true, reply);
		} else options.respond(false, void 0, result.error);
	}, (error) => errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : String(error)))
};
//#endregion
export { uiCommandHandlers as n, dispatchUiCommandToRequester as t };
