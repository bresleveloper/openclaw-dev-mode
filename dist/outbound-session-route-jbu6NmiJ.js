import { t as buildOutboundBaseSessionKey } from "./base-session-key-BuRdSVQe.js";
import { n as buildThreadAwareOutboundSessionRoute } from "./core-BsEPrOqQ.js";
import "./channel-core-CSgoR9CB.js";
import "./routing-D2F-kIi9.js";
import { t as parseDiscordTarget } from "./target-parsing-Drh12j1V.js";
//#region extensions/discord/src/outbound-session-route.ts
function resolveDiscordOutboundSessionRoute(params) {
	const parsed = parseDiscordTarget(params.target, { defaultKind: resolveDiscordOutboundTargetKindHint(params) });
	if (!parsed) return null;
	const explicitThreadId = params.threadId == null ? void 0 : String(params.threadId).trim();
	const peerId = explicitThreadId || parsed.id;
	const isDm = parsed.kind === "user" && !explicitThreadId;
	const recipientSessionExact = /^\d+$/.test(peerId);
	const peer = {
		kind: isDm ? "direct" : "channel",
		id: peerId
	};
	const baseSessionKey = buildOutboundBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "discord",
		accountId: params.accountId,
		peer
	});
	return buildThreadAwareOutboundSessionRoute({
		route: {
			sessionKey: baseSessionKey,
			baseSessionKey,
			recipientSessionExact,
			peer,
			chatType: isDm ? "direct" : "channel",
			from: isDm ? `discord:${peerId}` : `discord:channel:${peerId}`,
			to: isDm ? `user:${peerId}` : `channel:${peerId}`
		},
		threadId: params.threadId,
		precedence: ["threadId"],
		useSuffix: false
	});
}
function resolveDiscordOutboundTargetKindHint(params) {
	const resolvedKind = params.resolvedTarget?.kind;
	if (resolvedKind === "user") return "user";
	if (resolvedKind === "group" || resolvedKind === "channel") return "channel";
	const target = params.target.trim();
	if (/^channel:/i.test(target)) return "channel";
	if (/^(user:|discord:|@|<@!?)/i.test(target)) return "user";
	return "channel";
}
//#endregion
export { resolveDiscordOutboundSessionRoute as t };
