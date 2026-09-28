import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as loadVoiceWakeConfig, r as setVoiceWakeTriggers, t as normalizeVoiceWakeTriggers } from "./server-utils-BHpxAA43.mjs";
import { n as respondUnavailableOnThrow } from "./response-Chzawb7u.mjs";
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
