//#region extensions/telegram/src/send-runtime.ts
let telegramSendModulePromise;
async function loadTelegramSendModule() {
	telegramSendModulePromise ??= import("./send-BldFwsgg.js");
	return await telegramSendModulePromise;
}
//#endregion
export { loadTelegramSendModule as t };
