import { t as __exportAll } from "./rolldown-runtime-BBjsoOtd.mjs";
import { s as normalizeIMessageGuid } from "./actions-FOjSVXxg.mjs";
import { t as resolveIMessageReactionContext } from "./reaction-context-7yLnHd5m.mjs";
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
function resolveQuestionReaction(params) {
	const reaction = resolveIMessageReactionContext(params.message, params.bodyText);
	if (!reaction || reaction.action !== "added") return null;
	const guids = [...new Set((reaction.targetGuids ?? []).map(normalizeIMessageGuid).filter(Boolean))];
	if (guids.length === 0) return null;
	const optionIndex = questionGatewayRuntime.resolveReactionIndex(reaction.emoji);
	return optionIndex === void 0 ? null : {
		optionIndex,
		identities: guids.map((messageGuid) => ({
			accountId: params.accountId,
			messageGuid
		}))
	};
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
	const reaction = resolveQuestionReaction(params);
	return reaction ? questionReactionTargets.has(reaction.identities) : false;
}
async function maybeResolveIMessageQuestionReaction(params) {
	const reaction = resolveQuestionReaction(params);
	if (!reaction) return false;
	return await questionReactionTargets.resolve({
		...reaction,
		cfg: params.cfg,
		senderId: params.senderId,
		gatewayUrl: params.gatewayUrl,
		logDebug: params.logDebug
	});
}
//#endregion
export { maybeResolveIMessageQuestionReaction as n, question_reactions_exports as r, hasIMessageQuestionReactionTarget as t };
