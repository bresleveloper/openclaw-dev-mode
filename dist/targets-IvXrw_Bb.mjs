import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { d as stringifyRouteThreadId } from "./channel-route-2bD3dZs2.mjs";
import { d as resolveAcpSessionTarget } from "./manager.utils-L7wnnIwz.mjs";
import { S as normalizeConversationTargetRef } from "./current-conversation-bindings.kernel-CQnqjy0h.mjs";
import { i as resolveConversationBindingContextFromAcpCommand, n as resolveConversationBindingAccountIdFromMessage, r as resolveConversationBindingChannelFromMessage, t as resolveEffectiveResetTargetSessionKey } from "./acp-reset-target-CTfpJQfY.mjs";
import { t as bindAgentToolGatewayRequest } from "./in-process-gateway-DaAxH7mK.mjs";
import { d as SESSION_ID_RE } from "./sessions-resolution-CQXReb8R.mjs";
import { t as resolveCommandSourceSessionKey } from "./command-source-session-key-DAZwRkfj.mjs";
//#region src/auto-reply/reply/commands-acp/context.ts
function resolveAcpCommandBindingContext(params) {
	const resolved = resolveConversationBindingContextFromAcpCommand(params);
	if (resolved) return normalizeConversationTargetRef(resolved);
	return {
		channel: resolveConversationBindingChannelFromMessage(params.ctx, params.command.channel),
		accountId: resolveConversationBindingAccountIdFromMessage({
			ctx: params.ctx,
			cfg: params.cfg,
			commandChannel: params.command.channel
		}),
		threadId: stringifyRouteThreadId(params.ctx.MessageThreadId)
	};
}
//#endregion
//#region src/auto-reply/reply/commands-acp/targets.ts
async function resolveSessionKeyByToken(token, commandParams) {
	const attempts = [{ key: token }];
	if (SESSION_ID_RE.test(token)) attempts.push({ sessionId: token });
	attempts.push({ label: token });
	const callGateway = bindAgentToolGatewayRequest({ hostedOnly: true });
	for (const params of attempts) {
		const resolved = await callGateway({
			method: "sessions.resolve",
			params: {
				...params,
				allowMissing: true,
				agentId: parseAgentSessionKey(token)?.agentId ?? commandParams.agentId
			},
			timeoutMs: 8e3
		});
		const key = normalizeOptionalString(resolved?.key);
		if (key) return resolveAcpSessionTarget({
			cfg: commandParams.cfg,
			sessionKey: key,
			agentId: normalizeOptionalString(resolved?.agentId)
		});
		if (Array.isArray(resolved?.candidates) && resolved.candidates.length) throw new Error(`Ambiguous ACP session target: ${token}. Use an agent-qualified key.`);
	}
	return null;
}
async function resolveBoundAcpThreadSessionKey(params, commandTargetSessionKey) {
	const activeSessionKey = normalizeOptionalString(params.ctx.CommandTargetSessionKey) ?? normalizeOptionalString(params.sessionKey);
	const bindingContext = resolveAcpCommandBindingContext(params);
	return await resolveEffectiveResetTargetSessionKey({
		cfg: params.cfg,
		channel: bindingContext.channel,
		accountId: bindingContext.accountId,
		conversationId: bindingContext.conversationId,
		parentConversationId: bindingContext.parentConversationId,
		commandTargetSessionKey,
		activeSessionKey,
		allowNonAcpBindingSessionKey: true,
		skipConfiguredFallbackWhenActiveSessionNonAcp: false
	});
}
async function resolveAcpTargetSessionKey(params) {
	const token = normalizeOptionalString(params.token) ?? "";
	if (token) try {
		const resolved = await resolveSessionKeyByToken(token, params.commandParams);
		if (resolved) return {
			ok: true,
			...resolved
		};
	} catch (error) {
		return {
			ok: false,
			error: formatErrorMessage(error)
		};
	}
	const threadBound = await resolveBoundAcpThreadSessionKey(params.commandParams);
	params.commandParams.opts?.abortSignal?.throwIfAborted();
	const sessionKey = threadBound || !token && resolveCommandSourceSessionKey(params.commandParams, { preferCommandTarget: true });
	if (!sessionKey) return {
		ok: false,
		error: token ? `Unable to resolve session target: ${token}` : "Missing session key."
	};
	return {
		ok: true,
		...resolveAcpSessionTarget({
			cfg: params.commandParams.cfg,
			sessionKey,
			agentId: threadBound && threadBound !== params.commandParams.sessionKey ? void 0 : params.commandParams.agentId
		})
	};
}
//#endregion
export { resolveBoundAcpThreadSessionKey as n, resolveAcpCommandBindingContext as r, resolveAcpTargetSessionKey as t };
