import { g as resolveReactionLevel } from "./status-helpers-wGusDyWV.mjs";
import { r as inspectTelegramAccount } from "./account-inspect-3RXAaivH.mjs";
//#region extensions/telegram/src/reaction-level.ts
/**
* Resolve the effective reaction level and its implications.
*/
function resolveTelegramReactionLevel(params) {
	const account = inspectTelegramAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return resolveReactionLevel({
		value: account.config.reactionLevel,
		defaultLevel: "minimal",
		invalidFallback: "ack"
	});
}
//#endregion
export { resolveTelegramReactionLevel as t };
