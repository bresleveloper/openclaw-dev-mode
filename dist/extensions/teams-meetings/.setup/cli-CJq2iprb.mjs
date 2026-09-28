import { t as teamsMeetingsConfig } from "./config-BIqv-97D.mjs";
import { MeetingPlatformAdapter } from "openclaw/plugin-sdk/meeting-runtime";
import { addTimerTimeoutGraceMs } from "openclaw/plugin-sdk/number-runtime";
import { callGatewayFromCli } from "openclaw/plugin-sdk/gateway-runtime";
//#region extensions/teams-meetings/src/cli.ts
function registerTeamsMeetingsCli(params) {
	MeetingPlatformAdapter.registerPluginCli({
		...params,
		callGateway: callGatewayFromCli,
		commandName: "teamsmeetings",
		methodPrefix: "teamsmeetings",
		descriptions: {
			root: "Join and manage Microsoft Teams meeting guests",
			join: "join a Teams meeting as a guest",
			leave: "leave a Teams meeting",
			status: "show Teams meeting session status",
			setup: "check Teams meeting prerequisites",
			testSpeech: "join and verify talk-back output",
			testListen: "join in transcribe mode and report caption support"
		},
		resolveGatewayTimeoutMs: ({ config, requestedTimeoutMs }) => Math.max(teamsMeetingsConfig.resolveGatewayOperationTimeoutMs(config), requestedTimeoutMs === void 0 ? 0 : addTimerTimeoutGraceMs(requestedTimeoutMs, 3e4) ?? 1)
	});
}
//#endregion
export { registerTeamsMeetingsCli };
