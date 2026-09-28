import { n as GOOGLE_MEET_NODE_COMMAND } from "./google-meet-platform-constants-Bs5iAg3E.mjs";
import { t as GOOGLE_MEET_PLATFORM_ADAPTER } from "./google-meet-platform-adapter-DQZ74Kd5.mjs";
import { createMeetingBrowserNodeInvokePolicy } from "openclaw/plugin-sdk/meeting-runtime";
//#region extensions/google-meet/src/node-invoke-policy.ts
const GOOGLE_MEET_CHROME_NODE_COMMAND = GOOGLE_MEET_NODE_COMMAND;
const START_MODES = /* @__PURE__ */ new Set([
	"agent",
	"bidi",
	"realtime",
	"transcribe"
]);
function createGoogleMeetChromeNodeInvokePolicy(config) {
	return createMeetingBrowserNodeInvokePolicy({
		commandName: GOOGLE_MEET_CHROME_NODE_COMMAND,
		displayName: "Google Meet",
		deniedCode: "GOOGLE_MEET_NODE_POLICY_DENIED",
		supportedModes: START_MODES,
		normalizeUrl: (url) => GOOGLE_MEET_PLATFORM_ADAPTER.urls.validateAndNormalize(url),
		useConfiguredSetupCommands: true,
		start: config.chrome
	});
}
//#endregion
export { GOOGLE_MEET_CHROME_NODE_COMMAND, createGoogleMeetChromeNodeInvokePolicy };
