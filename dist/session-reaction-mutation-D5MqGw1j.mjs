import { Np as isReactionEmoji } from "./src-pLJQA6J5.mjs";
import { t as setSessionReactionAsync } from "./session-reaction-store-CRimN3Hk.mjs";
//#region src/gateway/session-reaction-mutation.ts
/** The shared local commit/event path. Transport mirroring belongs to the caller. */
async function commitSessionReaction(params) {
	if (!isReactionEmoji(params.emoji)) throw new Error("one emoji grapheme is required");
	params.assertCurrent();
	const write = await setSessionReactionAsync(params.scope, {
		messageId: params.messageId,
		emoji: params.emoji,
		identityId: params.identityId ?? params.actor.id,
		identityLabel: params.actor.label,
		remove: params.remove,
		expectedSessionId: params.sessionId,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent();
	if (write.changed) params.context.broadcast("session.reaction", {
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		sessionId: params.sessionId,
		messageId: params.messageId,
		emoji: params.emoji,
		action: params.remove ? "removed" : "added",
		actor: params.actor,
		reactions: write.reactions
	}, {
		sessionKeys: [.../* @__PURE__ */ new Set([params.sessionKey, ...params.sessionKeys ?? []])].toSorted(),
		agentId: params.agentId
	});
	return write;
}
//#endregion
export { commitSessionReaction as t };
