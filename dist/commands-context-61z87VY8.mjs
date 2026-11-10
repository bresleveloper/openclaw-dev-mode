import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { n as normalizeCommandBody } from "./commands-registry-normalize-BI2t-DKf.mjs";
import { a as stripMentions } from "./mentions-FwOIMA6L.mjs";
//#region src/auto-reply/reply/commands-context.ts
/** Selection and execution must bind to the same channel, including origin-routed turns. */
function resolveCommandChannel(ctx) {
	return normalizeLowercaseStringOrEmpty(ctx.OriginatingChannel ?? ctx.Provider ?? ctx.Surface);
}
function buildPluginCommandContext(params) {
	const { command, ctx } = params;
	return {
		senderId: command.senderId,
		channel: command.channel,
		channelId: command.channelId,
		isAuthorizedSender: command.isAuthorizedSender,
		senderIsOwner: command.senderIsOwner,
		assertOwnerCurrent: command.assertOwnerCurrent,
		gatewayClientScopes: ctx.GatewayClientScopes,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		config: params.cfg,
		from: command.from,
		to: command.to,
		originatingTo: normalizeOptionalString(ctx.OriginatingTo),
		accountId: ctx.AccountId ?? void 0,
		messageThreadId: typeof ctx.MessageThreadId === "string" || typeof ctx.MessageThreadId === "number" ? ctx.MessageThreadId : void 0,
		threadParentId: normalizeOptionalString(ctx.ThreadParentId)
	};
}
function buildCommandContext(params, auth) {
	const { ctx, cfg, agentId, sessionKey, isGroup, triggerBodyNormalized } = params;
	const surface = normalizeLowercaseStringOrEmpty(ctx.Surface ?? ctx.Provider);
	const channel = resolveCommandChannel(ctx);
	const from = auth.from ?? normalizeOptionalString(ctx.SenderId);
	const to = auth.to ?? normalizeOptionalString(ctx.OriginatingTo);
	const abortKey = sessionKey ?? from ?? to;
	const channelId = normalizeAnyChannelId(channel) ?? (channel ? channel : void 0);
	const rawBodyNormalized = triggerBodyNormalized;
	const commandBodyNormalized = normalizeCommandBody(isGroup ? stripMentions(rawBodyNormalized, ctx, cfg, agentId) : rawBodyNormalized, { botUsername: ctx.BotUsername });
	return {
		surface,
		channel,
		channelId: channelId ?? auth.providerId,
		accountId: normalizeOptionalString(ctx.AccountId),
		ownerList: auth.ownerList,
		senderIsOwner: auth.senderIsOwner,
		...auth.assertOwnerCurrent ? { assertOwnerCurrent: auth.assertOwnerCurrent } : {},
		isAuthorizedSender: auth.isAuthorizedSender,
		senderId: auth.senderId,
		abortKey,
		rawBodyNormalized,
		commandBodyNormalized,
		from,
		to
	};
}
//#endregion
export { buildPluginCommandContext as n, resolveCommandChannel as r, buildCommandContext as t };
