import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { n as normalizeIMessageGuid, t as resolveIMessageReactionContext } from "./reaction-context-Br-vAJFp.mjs";
import { createQuestionReactionTargetStore, questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
//#region extensions/imessage/src/question-reactions.ts
var question_reactions_exports = /* @__PURE__ */ __exportAll({
	hasIMessageQuestionReactionTarget: () => hasIMessageQuestionReactionTarget,
	maybeResolveIMessageQuestionReaction: () => maybeResolveIMessageQuestionReaction,
	registerIMessageQuestionReactionTargetForDeliveredPayload: () => registerIMessageQuestionReactionTargetForDeliveredPayload
});
function buildKey(identity) {
	const account = identity.accountId.trim();
	const guid = normalizeIMessageGuid(identity.messageGuid);
	return account && guid ? `${account}:${guid}` : null;
}
const questionReactionTargets = createQuestionReactionTargetStore({
	channel: "imessage",
	channelDisplayName: "iMessage",
	buildKey,
	registerChannelDelivery: questionGatewayRuntime.registerChannelDelivery,
	resolveReaction: questionGatewayRuntime.resolveReaction
});
function reactionCandidates(message, bodyText) {
	const reaction = resolveIMessageReactionContext(message, bodyText);
	if (!reaction) return null;
	const guids = Array.from(new Set([...reaction.targetGuids ?? [], reaction.targetGuid ?? ""].map(normalizeIMessageGuid).filter(Boolean)));
	return guids.length > 0 ? {
		action: reaction.action,
		emoji: reaction.emoji,
		guids
	} : null;
}
function registerIMessageQuestionReactionTargetForDeliveredPayload(params) {
	const binding = questionGatewayRuntime.readReactionBinding(params.payload);
	if (params.target.channel !== "imessage" || !binding) return false;
	let registered = false;
	for (const result of params.results) {
		if (result.channel !== "imessage") continue;
		const guid = typeof result.meta?.imessageMessageGuid === "string" ? result.meta.imessageMessageGuid : result.messageId;
		if (/^\d+$/u.test(normalizeIMessageGuid(guid))) continue;
		registered = questionReactionTargets.register(binding, {
			accountId: params.accountId,
			messageGuid: guid
		}) || registered;
	}
	return registered;
}
function hasIMessageQuestionReactionTarget(params) {
	const reaction = reactionCandidates(params.message, params.bodyText);
	if (!reaction || reaction.action !== "added" || questionGatewayRuntime.resolveReactionIndex(reaction.emoji) === void 0) return false;
	return questionReactionTargets.has(reaction.guids.map((messageGuid) => ({
		accountId: params.accountId,
		messageGuid
	})));
}
async function maybeResolveIMessageQuestionReaction(params) {
	const reaction = reactionCandidates(params.message, params.bodyText);
	const optionIndex = reaction ? questionGatewayRuntime.resolveReactionIndex(reaction.emoji) : void 0;
	if (!reaction || reaction.action === "removed" || optionIndex === void 0) return false;
	return await questionReactionTargets.resolve({
		identities: reaction.guids.map((messageGuid) => ({
			accountId: params.accountId,
			messageGuid
		})),
		optionIndex,
		cfg: params.cfg,
		senderId: params.senderId,
		gatewayUrl: params.gatewayUrl,
		logDebug: params.logDebug
	});
}
//#endregion
export { maybeResolveIMessageQuestionReaction as n, question_reactions_exports as r, hasIMessageQuestionReactionTarget as t };
