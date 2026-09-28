//#region extensions/google-meet/src/browser-manual-action-error.ts
var GoogleMeetBrowserManualActionError = class extends Error {
	constructor(payload) {
		super(`${payload.manualAction.reason}: ${payload.manualAction.message}`);
		this.name = "GoogleMeetBrowserManualActionError";
		this.payload = {
			source: "browser",
			error: this.message,
			...payload
		};
	}
};
function isGoogleMeetBrowserManualActionError(error) {
	return error instanceof GoogleMeetBrowserManualActionError;
}
//#endregion
//#region extensions/google-meet/src/transports/google-meet-platform-constants.ts
const GOOGLE_MEET_NODE_COMMAND = "googlemeet.chrome";
const GOOGLE_MEET_BROWSER_NODE_ADAPTER = {
	displayName: "Google Meet",
	nodeCommandName: GOOGLE_MEET_NODE_COMMAND,
	nodeConfigPath: "plugins.entries.google-meet.config.chromeNode.node"
};
//#endregion
export { isGoogleMeetBrowserManualActionError as i, GOOGLE_MEET_NODE_COMMAND as n, GoogleMeetBrowserManualActionError as r, GOOGLE_MEET_BROWSER_NODE_ADAPTER as t };
