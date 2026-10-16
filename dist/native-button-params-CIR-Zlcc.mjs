//#region extensions/telegram/src/native-button-params.ts
function rejectTelegramNativeButtonParams(params) {
	if (params.buttons === void 0) return;
	throw new Error("Telegram native \"buttons\" is unsupported. Use presentation: {\"blocks\":[{\"type\":\"buttons\",\"buttons\":[{\"label\":\"Yes\",\"action\":{\"type\":\"callback\",\"value\":\"yes\"}}]}]}.");
}
//#endregion
export { rejectTelegramNativeButtonParams as t };
