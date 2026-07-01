//#region extensions/telegram/src/send-runtime.ts
let telegramSendModulePromise;
async function loadTelegramSendModule() {
	telegramSendModulePromise ??= import("./send-C5V1J75C.js");
	return await telegramSendModulePromise;
}
//#endregion
export { loadTelegramSendModule as t };
