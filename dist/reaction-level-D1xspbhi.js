import { t as resolveReactionLevel } from "./reaction-level-VzekD6C8.js";
import "./status-helpers-Dy-C1WAt.js";
import { t as resolveMergedWhatsAppAccountConfig } from "./account-config-Bqb_wJTl.js";
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
