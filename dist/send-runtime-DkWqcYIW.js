//#region extensions/telegram/src/send-runtime.ts
let telegramSendModulePromise;
async function loadTelegramSendModule() {
	telegramSendModulePromise ??= import("./send-6wjz4Di1.js");
	return await telegramSendModulePromise;
}
//#endregion
export { loadTelegramSendModule as t };
