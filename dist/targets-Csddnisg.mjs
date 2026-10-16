import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { d as resolveAcpSessionTarget } from "./manager.utils-Bvd6j1MX.mjs";
import { a as normalizeConversationTargetRef } from "./current-conversation-binding-row-BCcBsEeZ.mjs";
import { i as resolveConversationBindingContextFromAcpCommand, n as resolveConversationBindingAccountIdFromMessage, o as resolveConversationBindingThreadIdFromMessage, r as resolveConversationBindingChannelFromMessage, t as resolveEffectiveResetTargetSessionKey } from "./acp-reset-target-BoR9NsWR.mjs";
import { t as bindAgentToolGatewayRequest } from "./in-process-gateway-Dcrh-ATi.mjs";
import { u as SESSION_ID_RE } from "./sessions-resolution-ZZ7dnwCs.mjs";
import { n as resolveRequesterSessionKey } from "./shared-BZfsOBpm.mjs";
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
		threadId: resolveConversationBindingThreadIdFromMessage(params.ctx)
	};
}
//#endregion
//#region src/auto-reply/reply/commands-acp/targets.ts
async function resolveSessionKeyByToken(token, commandParams) {
	const trimmed = token.trim();
	if (!trimmed) return null;
	const attempts = [{ key: trimmed }];
	if (SESSION_ID_RE.test(trimmed)) attempts.push({ sessionId: trimmed });
	attempts.push({ label: trimmed });
	const callGateway = bindAgentToolGatewayRequest({ hostedOnly: true });
	for (const params of attempts) {
		const resolved = await callGateway({
			method: "sessions.resolve",
			params: {
				...params,
				allowMissing: true,
				agentId: parseAgentSessionKey(trimmed)?.agentId ?? commandParams.agentId
			},
			timeoutMs: 8e3
		});
		const key = normalizeOptionalString(resolved?.key);
		if (key) return resolveAcpSessionTarget({
			cfg: commandParams.cfg,
			sessionKey: key,
			agentId: normalizeOptionalString(resolved?.agentId)
		});
		if (Array.isArray(resolved?.candidates) && resolved.candidates.length) throw new Error(`Ambiguous ACP session target: ${trimmed}. Use an agent-qualified key.`);
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
	if (threadBound) return {
		ok: true,
		...resolveAcpSessionTarget({
			cfg: params.commandParams.cfg,
			sessionKey: threadBound,
			agentId: threadBound === params.commandParams.sessionKey ? params.commandParams.agentId : void 0
		})
	};
	if (token) return {
		ok: false,
		error: `Unable to resolve session target: ${token}`
	};
	const fallback = resolveRequesterSessionKey(params.commandParams, { preferCommandTarget: true });
	if (!fallback) return {
		ok: false,
		error: "Missing session key."
	};
	return {
		ok: true,
		...resolveAcpSessionTarget({
			cfg: params.commandParams.cfg,
			sessionKey: fallback,
			agentId: params.commandParams.agentId
		})
	};
}
//#endregion
export { resolveBoundAcpThreadSessionKey as n, resolveAcpCommandBindingContext as r, resolveAcpTargetSessionKey as t };
