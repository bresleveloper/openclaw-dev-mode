import { a as normalizeChannelId, t as getChannelPlugin } from "./registry-Ba1KQQW12.js";
import "./chat-target-prefixes-BOB5HAjR.js";
//#region src/channels/plugins/tts-capabilities.ts
/**
* Channel TTS voice capability resolver.
*
* Reads channel-advertised voice delivery support for prompt and runtime routing.
*/
function resolveChannelTtsVoiceDelivery(channel) {
	const channelId = normalizeChannelId(channel);
	if (!channelId) return;
	return getChannelPlugin(channelId)?.capabilities.tts?.voice;
}
//#endregion
export { resolveChannelTtsVoiceDelivery as t };
