import { g as resolveReactionLevel } from "./status-helpers-MWPCenO2.mjs";
import { r as inspectTelegramAccount } from "./account-inspect-Dp1wulI-.mjs";
//#region extensions/telegram/src/reaction-level.ts
function resolveTelegramReactionLevel(params) {
	return resolveReactionLevel({
		value: inspectTelegramAccount(params).config.reactionLevel,
		defaultLevel: "minimal",
		invalidFallback: "ack"
	});
}
//#endregion
export { resolveTelegramReactionLevel as t };
