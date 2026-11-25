// extensions/feishu/src/message-action-contract.ts
const FEISHU_NATIVE_CHAT_TARGET_ALIASES = [
	"chatId",
	"chat_id",
	"channel_id"
];
const messageMutationTargetAliases = {
	aliases: ["messageId", ...FEISHU_NATIVE_CHAT_TARGET_ALIASES],
	deliveryTargetAliases: FEISHU_NATIVE_CHAT_TARGET_ALIASES
};
const messageActionTargetAliases = {
	read: { aliases: ["messageId"] },
	edit: messageMutationTargetAliases,
	pin: messageMutationTargetAliases,
	unpin: messageMutationTargetAliases,
	"list-pins": { aliases: ["chatId"] },
	"channel-info": { aliases: ["chatId"] }
};
export { messageActionTargetAliases as t };
