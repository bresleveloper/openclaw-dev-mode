import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import "./registry-BKdVEB34.mjs";
import { i as resolveCommandAuthorization } from "./command-auth-2PSSAYYJ.mjs";
import { r as normalizeCommandBody } from "./commands-registry-normalize-DJeLLZwD.mjs";
import { a as stripMentions } from "./mentions-BKW6zinj.mjs";
//#region src/auto-reply/reply/commands-context.ts
/** Builds normalized command context from inbound message and authorization state. */
/** Selection and execution must bind to the same channel, including origin-routed turns. */
function resolveCommandChannel(ctx) {
	return normalizeLowercaseStringOrEmpty(ctx.OriginatingChannel ?? ctx.Provider ?? ctx.Surface);
}
/** Builds command routing/auth metadata consumed by command handlers. */
function buildCommandContext(params) {
	const { ctx, cfg, agentId, sessionKey, isGroup, triggerBodyNormalized } = params;
	const auth = resolveCommandAuthorization({
		ctx,
		cfg,
		commandAuthorized: params.commandAuthorized
	});
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
export { resolveCommandChannel as n, buildCommandContext as t };
