//#region extensions/telegram/src/send-runtime.ts
let telegramSendModulePromise;
async function loadTelegramSendModule() {
	telegramSendModulePromise ??= import("./send-Drv7csvr.js");
	return await telegramSendModulePromise;
}
//#endregion
export { loadTelegramSendModule as t };
