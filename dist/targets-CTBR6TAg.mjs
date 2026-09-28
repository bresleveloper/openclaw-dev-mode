import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { c as resolveAcpSessionTarget } from "./manager.utils-BcgCrYZC.mjs";
import { t as resolveEffectiveResetTargetSessionKey } from "./acp-reset-target-rsWh_4b4.mjs";
import { t as bindAgentToolGatewayRequest } from "./in-process-gateway-BvSta947.mjs";
import { y as SESSION_ID_RE } from "./sessions-helpers-0nPieSUh.mjs";
import { t as resolveAcpCommandBindingContext } from "./context-CA8irbRa.mjs";
import { r as resolveRequesterSessionKey } from "./shared-CBqrl8ni.mjs";
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
export { resolveBoundAcpThreadSessionKey as n, resolveAcpTargetSessionKey as t };
