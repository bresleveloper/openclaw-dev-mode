// extensions/whatsapp/src/group-session-contract.ts
function resolveLegacyGroupSessionKey(ctx) {
	const from = ctx.From?.trim() ?? "";
	const normalized = from.toLowerCase();
	if (!from || from.includes(":") || !normalized.endsWith("@g.us")) return null;
	return {
		key: `whatsapp:group:${normalized}`,
		channel: "whatsapp",
		id: normalized,
		chatType: "group"
	};
}
export { resolveLegacyGroupSessionKey as t };
