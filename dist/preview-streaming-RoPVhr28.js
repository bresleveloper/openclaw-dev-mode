import { m as resolveChannelPreviewStreamMode } from "./streaming-DDEnlnFD.js";
import "./channel-outbound-BNKGCEf1.js";
//#region extensions/discord/src/preview-streaming.ts
function resolveDiscordPreviewStreamMode(params = {}) {
	if (params.streaming === void 0 && params.streamMode === void 0) return "progress";
	return resolveChannelPreviewStreamMode(params, "off");
}
//#endregion
export { resolveDiscordPreviewStreamMode as t };
