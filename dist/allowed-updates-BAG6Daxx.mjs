import { API_CONSTANTS } from "grammy";
//#region extensions/telegram/src/allowed-updates.ts
const DEFAULT_TELEGRAM_UPDATE_TYPES = API_CONSTANTS.DEFAULT_UPDATE_TYPES;
function resolveTelegramAllowedUpdates() {
	const updates = DEFAULT_TELEGRAM_UPDATE_TYPES.filter((type) => type !== "stopped_message_generation");
	for (const type of ["message_reaction", "channel_post"]) if (!updates.includes(type)) updates.push(type);
	return updates;
}
//#endregion
export { resolveTelegramAllowedUpdates as t };
