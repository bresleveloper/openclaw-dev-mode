import { t as __exportAll } from "./rolldown-runtime-BBjsoOtd.mjs";
import { a as resolveWhatsAppAccount } from "./accounts-F0vHuze2.mjs";
import { d as listWhatsAppDeliveredMessageIdentities } from "./send-CGUsUdoX.mjs";
import { normalizeUniqueTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createQuestionReactionTargetStore, questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
//#region extensions/whatsapp/src/question-reactions.ts
var question_reactions_exports = /* @__PURE__ */ __exportAll({
	maybeResolveWhatsAppQuestionReaction: () => maybeResolveWhatsAppQuestionReaction,
	registerWhatsAppQuestionReactionTargetForDeliveredPayload: () => registerWhatsAppQuestionReactionTargetForDeliveredPayload
});
function buildKey(identity) {
	const parts = [
		identity.accountId,
		identity.remoteJid,
		identity.messageId
	].map((part) => part.trim());
	return parts.every(Boolean) ? parts.join(":") : void 0;
}
const questionReactionTargets = createQuestionReactionTargetStore({
	channel: "whatsapp",
	channelDisplayName: "WhatsApp",
	buildKey,
	registerChannelDelivery: questionGatewayRuntime.registerChannelDelivery,
	resolveReaction: questionGatewayRuntime.resolveReaction
});
function registerWhatsAppQuestionReactionTargetForDeliveredPayload(params) {
	const binding = questionGatewayRuntime.readReactionBinding(params.payload);
	if (params.target.channel !== "whatsapp" || !binding) return false;
	const accountId = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.target.accountId
	}).accountId;
	let registered = false;
	for (const identity of listWhatsAppDeliveredMessageIdentities(params.results, () => true)) registered = questionReactionTargets.register(binding, {
		accountId,
		...identity
	}) || registered;
	return registered;
}
async function maybeResolveWhatsAppQuestionReaction(params) {
	const reaction = params.msg.message?.reactionMessage;
	const reactionKey = reaction?.text?.trim() ?? "";
	const messageId = reaction?.key?.id?.trim() ?? "";
	const optionIndex = questionGatewayRuntime.resolveReactionIndex(reactionKey);
	if (optionIndex === void 0 || !messageId) return false;
	const remoteJids = normalizeUniqueTrimmedStringList([reaction?.key?.remoteJid, params.msg.key?.remoteJid]);
	const candidates = [];
	for (const remoteJid of remoteJids) candidates.push(remoteJid, ...await params.resolveReactionTargetJids?.(remoteJid) ?? []);
	return await questionReactionTargets.resolve({
		identities: normalizeUniqueTrimmedStringList(candidates).map((remoteJid) => ({
			accountId: params.accountId,
			remoteJid,
			messageId
		})),
		optionIndex,
		cfg: params.cfg,
		senderId: params.senderId,
		gatewayUrl: params.gatewayUrl,
		logDebug: params.logDebug
	});
}
//#endregion
export { question_reactions_exports as n, maybeResolveWhatsAppQuestionReaction as t };
