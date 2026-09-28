import { n as zoomMeetingsInvalidRequest, r as zoomMeetingsConfig } from "./errors-DcrAT0wd.mjs";
import { MeetingPlatformAdapter } from "openclaw/plugin-sdk/meeting-runtime";
import { addTimerTimeoutGraceMs } from "openclaw/plugin-sdk/number-runtime";
import { callGatewayFromCli } from "openclaw/plugin-sdk/gateway-runtime";
//#region extensions/zoom-meetings/src/cli.ts
function resolveZoomMeetingsCliGatewayTimeoutMs(config, options) {
	const operationTimeoutMs = zoomMeetingsConfig.resolveGatewayOperationTimeoutMs(config);
	const probeTimeoutMs = options.probe ? MeetingPlatformAdapter.resolveProbeTimeoutMs(options.requestedTimeoutMs, config.chrome.joinTimeoutMs, zoomMeetingsInvalidRequest) : void 0;
	return probeTimeoutMs === void 0 ? operationTimeoutMs : addTimerTimeoutGraceMs(operationTimeoutMs, probeTimeoutMs) ?? 1;
}
function registerZoomMeetingsCli(params) {
	MeetingPlatformAdapter.registerPluginCli({
		...params,
		callGateway: callGatewayFromCli,
		commandName: "zoommeetings",
		methodPrefix: "zoommeetings",
		descriptions: {
			root: "Join and manage Zoom meeting guests",
			join: "join a Zoom meeting as a guest",
			leave: "leave a Zoom meeting",
			status: "show Zoom meeting session status",
			setup: "check Zoom meeting prerequisites",
			testSpeech: "join and verify talk-back output",
			testListen: "join in transcribe mode and report caption support"
		},
		resolveGatewayTimeoutMs: ({ config, method, requestedTimeoutMs }) => resolveZoomMeetingsCliGatewayTimeoutMs(config, {
			probe: method === "zoommeetings.testSpeech" || method === "zoommeetings.testListen",
			requestedTimeoutMs
		})
	});
}
//#endregion
export { registerZoomMeetingsCli };
