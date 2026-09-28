import { MeetingPlatformAdapter } from "openclaw/plugin-sdk/meeting-runtime";
import { addTimerTimeoutGraceMs } from "openclaw/plugin-sdk/number-runtime";
import { REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME } from "openclaw/plugin-sdk/realtime-voice";
//#region extensions/zoom-meetings/src/config.ts
const zoomMeetingsConfig = MeetingPlatformAdapter.createPluginConfigSchema({
	defaultRealtimeInstructions: `You are joining a private Zoom meeting as an OpenClaw voice transport. Keep spoken replies brief and natural. In agent mode, wait for OpenClaw consult results and speak them exactly. In bidi mode, answer directly and call ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} for deeper reasoning, current information, or tools.`,
	resolveGatewayOperationTimeoutMs: (config) => Math.max(6e4, addTimerTimeoutGraceMs(config.chrome.joinTimeoutMs, config.chrome.waitForInCallMs + config.chrome.joinTimeoutMs + 3e4) ?? 1)
});
//#endregion
//#region extensions/zoom-meetings/src/errors.ts
var ZoomMeetingsInvalidRequestError = class extends Error {};
function zoomMeetingsInvalidRequest(message) {
	return new ZoomMeetingsInvalidRequestError(message);
}
//#endregion
export { zoomMeetingsInvalidRequest as n, zoomMeetingsConfig as r, ZoomMeetingsInvalidRequestError as t };
