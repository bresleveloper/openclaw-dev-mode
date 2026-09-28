import "./security-audit-shared-CK5rVR-1.mjs";
//#region extensions/feishu/src/message-action-contract.ts
const FEISHU_NATIVE_CHAT_TARGET_ALIASES = [
	"chatId",
	"chat_id",
	"channel_id"
];
function createMessageMutationTargetAliases() {
	return {
		aliases: ["messageId", ...FEISHU_NATIVE_CHAT_TARGET_ALIASES],
		deliveryTargetAliases: [...FEISHU_NATIVE_CHAT_TARGET_ALIASES]
	};
}
const messageActionTargetAliases = {
	read: { aliases: ["messageId"] },
	edit: createMessageMutationTargetAliases(),
	pin: createMessageMutationTargetAliases(),
	unpin: createMessageMutationTargetAliases(),
	"list-pins": { aliases: ["chatId"] },
	"channel-info": { aliases: ["chatId"] }
};
//#endregion
export { messageActionTargetAliases as t };
