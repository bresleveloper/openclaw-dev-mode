import { t as resolveReactionLevel } from "./reaction-level-Dq0rYo3y.js";
import "./status-helpers-DjJ0OuL_.js";
import { t as inspectTelegramAccount } from "./account-inspect-GEZdZ9dn.js";
//#region extensions/telegram/src/reaction-level.ts
/**
* Resolve the effective reaction level and its implications.
*/
function resolveTelegramReactionLevel(params) {
	return resolveReactionLevel({
		value: inspectTelegramAccount({
			cfg: params.cfg,
			accountId: params.accountId
		}).config.reactionLevel,
		defaultLevel: "minimal",
		invalidFallback: "ack"
	});
}
//#endregion
export { resolveTelegramReactionLevel as t };
