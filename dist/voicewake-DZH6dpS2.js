import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import "./src-CSp7rUPX.js";
import { t as formatForLog } from "./ws-log-UD7Od6QM.js";
import { i as setVoiceWakeTriggers, n as normalizeVoiceWakeTriggers, r as loadVoiceWakeConfig } from "./server-utils-DsMt4SeL.js";
//#region src/gateway/server-methods/voicewake.ts
/** Gateway request handlers for reading and updating voice wake triggers. */
const voicewakeHandlers = {
	"voicewake.get": async ({ respond }) => {
		try {
			respond(true, { triggers: (await loadVoiceWakeConfig()).triggers });
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	"voicewake.set": async ({ params, respond, context }) => {
		if (!Array.isArray(params.triggers)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "voicewake.set requires triggers: string[]"));
			return;
		}
		try {
			const cfg = await setVoiceWakeTriggers(normalizeVoiceWakeTriggers(params.triggers));
			context.broadcastVoiceWakeChanged(cfg.triggers);
			respond(true, { triggers: cfg.triggers });
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	}
};
//#endregion
export { voicewakeHandlers };
