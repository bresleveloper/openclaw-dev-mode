import { t as resolveReactionLevel } from "./reaction-level-Dq0rYo3y.js";
import "./status-helpers-DjJ0OuL_.js";
import { t as resolveMergedWhatsAppAccountConfig } from "./account-config-DKHSVT_Q.js";
//#region extensions/whatsapp/src/reaction-level.ts
/** Resolve the effective reaction level and its implications for WhatsApp. */
function resolveWhatsAppReactionLevel(params) {
	return resolveReactionLevel({
		value: resolveMergedWhatsAppAccountConfig({
			cfg: params.cfg,
			accountId: params.accountId
		}).reactionLevel,
		defaultLevel: "minimal",
		invalidFallback: "minimal"
	});
}
//#endregion
export { resolveWhatsAppReactionLevel as t };
