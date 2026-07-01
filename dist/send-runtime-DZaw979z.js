//#region extensions/telegram/src/send-runtime.ts
let telegramSendModulePromise;
async function loadTelegramSendModule() {
	telegramSendModulePromise ??= import("./send-Ci-_KU1B.js");
	return await telegramSendModulePromise;
}
//#endregion
export { loadTelegramSendModule as t };
