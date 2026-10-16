import { o as __exportAll } from "./doctor-contract-api-CGS80vmV.mjs";
import { i as resolveSignalDeliveredConversationKey } from "./approval-auth-BITw96pZ.mjs";
import { c as resolveSignalApprovalTargetAuthorKeys, o as registerSignalApprovalReactionTargetForDeliveredPayload } from "./approval-reactions-BHIX1jwY.mjs";
import { createQuestionReactionTargetStore, questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { normalizeAccountId } from "openclaw/plugin-sdk/routing";
//#region extensions/signal/src/question-reactions.ts
function buildKey(identity) {
	const values = [
		identity.accountId,
		identity.conversationKey,
		identity.messageId
	].map((value) => value.trim());
	return values.every(Boolean) ? values.join(":") : null;
}
const questionReactionTargets = createQuestionReactionTargetStore({
	channel: "signal",
	channelDisplayName: "Signal",
	buildKey,
	identityMatches: (stored, incoming) => Boolean(stored && incoming?.some((authorKey) => stored.includes(authorKey))),
	registerChannelDelivery: questionGatewayRuntime.registerChannelDelivery,
	resolveReaction: questionGatewayRuntime.resolveReaction
});
function registerSignalQuestionReactionTargetForDeliveredPayload(params) {
	const binding = questionGatewayRuntime.readReactionBinding(params.payload);
	if (params.target.channel !== "signal" || !binding) return false;
	const conversationKey = resolveSignalDeliveredConversationKey({
		cfg: params.cfg,
		...params.target
	});
	const targetAuthorKeys = resolveSignalApprovalTargetAuthorKeys(params);
	if (!conversationKey || targetAuthorKeys.length === 0) return false;
	const accountId = normalizeAccountId(params.target.accountId ?? void 0);
	let registered = false;
	for (const result of params.results) {
		const messageId = result.channel === "signal" ? result.messageId.trim() : "";
		if (!messageId || messageId === "unknown") continue;
		registered = questionReactionTargets.register(binding, {
			accountId,
			conversationKey,
			messageId
		}, targetAuthorKeys) || registered;
	}
	return registered;
}
async function maybeResolveSignalQuestionReaction(params) {
	if (params.isRemove) return false;
	const optionIndex = questionGatewayRuntime.resolveReactionIndex(params.reactionKey);
	if (optionIndex === void 0) return false;
	const authorKeys = resolveSignalApprovalTargetAuthorKeys(params);
	return await questionReactionTargets.resolve({
		identities: [{
			accountId: params.accountId,
			conversationKey: params.conversationKey,
			messageId: params.messageId
		}],
		optionIndex,
		cfg: params.cfg,
		senderId: params.actorId,
		gatewayUrl: params.gatewayUrl,
		metadata: authorKeys,
		logDebug: params.logDebug
	});
}
//#endregion
//#region extensions/signal/src/reaction-targets.ts
var reaction_targets_exports = /* @__PURE__ */ __exportAll({ registerSignalReactionTargetsForDeliveredPayload: () => registerSignalReactionTargetsForDeliveredPayload });
async function registerSignalReactionTargetsForDeliveredPayload(params) {
	registerSignalQuestionReactionTargetForDeliveredPayload(params);
	await registerSignalApprovalReactionTargetForDeliveredPayload(params);
}
//#endregion
export { registerSignalReactionTargetsForDeliveredPayload as n, maybeResolveSignalQuestionReaction as r, reaction_targets_exports as t };
