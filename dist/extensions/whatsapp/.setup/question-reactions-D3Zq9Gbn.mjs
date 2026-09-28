import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { a as resolveWhatsAppAccount } from "./accounts-D_NGDjCx.mjs";
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
function addCandidate(values, value) {
	const normalized = value?.trim();
	if (normalized && !values.includes(normalized)) values.push(normalized);
}
function listDeliveredIdentities(results) {
	const identities = [];
	const seen = /* @__PURE__ */ new Set();
	const add = (messageId, remoteJid) => {
		const id = messageId?.trim() ?? "";
		const jid = remoteJid?.trim() ?? "";
		const key = `${jid}:${id}`;
		if (id && id !== "unknown" && jid && !seen.has(key)) {
			seen.add(key);
			identities.push({
				messageId: id,
				remoteJid: jid
			});
		}
	};
	for (const result of results) {
		if (result.channel !== "whatsapp") continue;
		add(result.messageId, result.toJid);
		for (const raw of result.receipt?.raw ?? []) add(raw.messageId, raw.toJid);
		for (const part of result.receipt?.parts ?? []) add(part.raw?.messageId ?? part.platformMessageId, part.raw?.toJid);
	}
	return identities;
}
function registerWhatsAppQuestionReactionTargetForDeliveredPayload(params) {
	const binding = questionGatewayRuntime.readReactionBinding(params.payload);
	if (params.target.channel !== "whatsapp" || !binding) return false;
	const accountId = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.target.accountId
	}).accountId;
	let registered = false;
	for (const identity of listDeliveredIdentities(params.results)) registered = questionReactionTargets.register(binding, {
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
	const remoteJids = [];
	addCandidate(remoteJids, reaction?.key?.remoteJid);
	addCandidate(remoteJids, params.msg.key?.remoteJid);
	const candidates = [];
	for (const remoteJid of remoteJids) {
		addCandidate(candidates, remoteJid);
		for (const mapped of await params.resolveReactionTargetJids?.(remoteJid) ?? []) addCandidate(candidates, mapped);
	}
	return await questionReactionTargets.resolve({
		identities: candidates.map((remoteJid) => ({
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
