import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
//#region src/channels/plugins/tts-capabilities.ts
function resolveChannelTtsVoiceDelivery(channel) {
	const channelId = normalizeAnyChannelId(channel);
	if (!channelId) return;
	return getChannelPlugin(channelId)?.capabilities.tts?.voice;
}
//#endregion
export { resolveChannelTtsVoiceDelivery as t };
