//#region extensions/whatsapp/src/reaction-target.ts
function buildWhatsAppReactionTargetKey(identity) {
	const parts = [
		identity.accountId,
		identity.remoteJid,
		identity.messageId
	].map((part) => part.trim());
	return parts.every(Boolean) ? parts.join(":") : void 0;
}
//#endregion
export { buildWhatsAppReactionTargetKey as t };
