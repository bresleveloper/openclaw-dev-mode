import { n as callGatewayFromCli } from "./gateway-rpc-Cl_Z2Z7Q.mjs";
import { t as registerMeetingPluginCli } from "./plugin-cli-B8jd8x_k.mjs";
//#region src/meeting-bot/browser-plugin-cli.ts
function registerBrowserMeetingCli(options) {
	const commandName = options.descriptor.name;
	registerMeetingPluginCli({
		...options,
		callGateway: options.callGateway ?? callGatewayFromCli,
		commandName,
		methodPrefix: commandName,
		descriptions: {
			root: options.descriptor.description,
			join: options.joinDescription,
			leave: `leave a ${options.meetingLabel}`,
			status: `show ${options.meetingLabel} session status`,
			setup: `check ${options.meetingLabel} prerequisites`,
			testSpeech: "join and verify talk-back output",
			testListen: "join in transcribe mode and report caption support"
		},
		resolveGatewayTimeoutMs: ({ config, method, requestedTimeoutMs }) => options.resolveTimeoutMs(config, {
			probe: method === `${commandName}.testSpeech` || method === `${commandName}.testListen`,
			requestedTimeoutMs
		})
	});
}
//#endregion
export { registerBrowserMeetingCli };
