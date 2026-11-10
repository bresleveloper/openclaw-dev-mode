import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
//#region src/channels/plugins/tts-capabilities.ts
function resolveChannelTtsVoiceDelivery(channel) {
	const channelId = normalizeAnyChannelId(channel);
	if (!channelId) return;
	return getChannelPlugin(channelId)?.capabilities.tts?.voice;
}
//#endregion
export { resolveChannelTtsVoiceDelivery as t };
