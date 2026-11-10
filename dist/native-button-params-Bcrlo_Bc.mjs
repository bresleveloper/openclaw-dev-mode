//#region extensions/telegram/src/action-names.ts
const TELEGRAM_MESSAGE_ACTION_MAP = {
	delete: "deleteMessage",
	edit: "editMessage",
	"emoji-list": "emoji-list",
	poll: "poll",
	react: "react",
	read: "read",
	send: "sendMessage",
	sticker: "sendSticker",
	"sticker-search": "searchSticker",
	"topic-create": "createForumTopic",
	"topic-edit": "editForumTopic"
};
//#endregion
//#region extensions/telegram/src/native-button-params.ts
function rejectTelegramNativeButtonParams(params) {
	if (params.buttons !== void 0) throw new Error("Telegram native \"buttons\" is unsupported. Use presentation: {\"blocks\":[{\"type\":\"buttons\",\"buttons\":[{\"label\":\"Yes\",\"action\":{\"type\":\"callback\",\"value\":\"yes\"}}]}]}.");
}
//#endregion
export { TELEGRAM_MESSAGE_ACTION_MAP as n, rejectTelegramNativeButtonParams as t };
