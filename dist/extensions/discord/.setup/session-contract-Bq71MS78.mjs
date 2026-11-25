// extensions/discord/src/session-contract.ts
function deriveLegacySessionChatType(sessionKey) {
	return /^discord:(?:[^:]+:)?guild-[^:]+:channel-[^:]+$/.test(sessionKey) ? "channel" : void 0;
}
export { deriveLegacySessionChatType as t };
