import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { c as withTimeout } from "./fs-safe-RNq3oO57.js";
import "./error-runtime-CDUW9C58.js";
import "./text-utility-runtime-CEmCehV8.js";
import { t as MessagingApiClient } from "./messagingApiClient-BSDrulNf.js";
//#region extensions/line/src/probe.ts
async function probeLineBot(channelAccessToken, timeoutMs = 5e3) {
	if (!channelAccessToken?.trim()) return {
		ok: false,
		error: "Channel access token not configured"
	};
	const client = new MessagingApiClient({ channelAccessToken: channelAccessToken.trim() });
	try {
		const profile = await withTimeout(client.getBotInfo(), timeoutMs);
		return {
			ok: true,
			bot: {
				displayName: profile.displayName,
				userId: profile.userId,
				basicId: profile.basicId,
				pictureUrl: profile.pictureUrl
			}
		};
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
//#endregion
export { probeLineBot as t };
