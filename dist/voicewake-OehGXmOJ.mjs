import { p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as respondUnavailableOnThrow } from "./response-BKwLtoRW.mjs";
import { n as loadVoiceWakeConfig, r as setVoiceWakeTriggers, t as defaultVoiceWakeTriggers } from "./voicewake-BOeoS3Qx.mjs";
//#region src/gateway/server-utils.ts
function normalizeVoiceWakeTriggers(input) {
	const cleaned = normalizeTrimmedStringList(input).slice(0, 32).map((value) => truncateUtf16Safe(value, 64));
	return cleaned.length > 0 ? cleaned : defaultVoiceWakeTriggers();
}
//#endregion
//#region src/gateway/server-methods/voicewake.ts
/** Gateway request handlers for reading and updating voice wake triggers. */
const voicewakeHandlers = {
	"voicewake.get": async ({ respond }) => {
		await respondUnavailableOnThrow(respond, async () => {
			respond(true, { triggers: (await loadVoiceWakeConfig()).triggers });
		});
	},
	"voicewake.set": async ({ params, respond, context }) => {
		if (!Array.isArray(params.triggers)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "voicewake.set requires triggers: string[]"));
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			const triggers = normalizeVoiceWakeTriggers(params.triggers);
			const cfg = await setVoiceWakeTriggers(triggers);
			context.broadcastVoiceWakeChanged(cfg.triggers);
			respond(true, { triggers: cfg.triggers });
		});
	}
};
//#endregion
export { voicewakeHandlers };
