import { n as GOOGLE_MEET_NODE_COMMAND } from "./google-meet-platform-constants-CnRfrYX7.mjs";
import { n as DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND, t as DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND } from "./config-BXGAMntj.mjs";
import { t as GOOGLE_MEET_PLATFORM_ADAPTER } from "./google-meet-platform-adapter-CKXMbP3X.mjs";
import { MeetingPlatformAdapter } from "openclaw/plugin-sdk/meeting-runtime";
//#region extensions/google-meet/src/node-host.ts
function normalizeMeetKey(value) {
	if (!value) return;
	try {
		const url = new URL(value);
		if (url.hostname.toLowerCase() !== "meet.google.com") return value;
		return /^\/([a-z]{3}-[a-z]{4}-[a-z]{3})(?:$|[/?#])/i.exec(url.pathname)?.[1]?.toLowerCase() ?? value;
	} catch {
		return value;
	}
}
const handleGoogleMeetNodeHostCommand = MeetingPlatformAdapter.createNodeHostHandler({
	commandName: GOOGLE_MEET_NODE_COMMAND,
	displayName: "Google Meet",
	browserLabel: "Meet",
	bridgeIdPrefix: "meet_node_",
	defaultAudioInputCommand: DEFAULT_GOOGLE_MEET_AUDIO_INPUT_COMMAND,
	defaultAudioOutputCommand: DEFAULT_GOOGLE_MEET_AUDIO_OUTPUT_COMMAND,
	defaultAudio: {
		backend: "auto",
		bufferBytes: 4096,
		format: "pcm16-24khz"
	},
	meetingLabel: "Google Meet",
	sharePrerequisiteDeadline: true,
	talkBackModes: /* @__PURE__ */ new Set([
		"agent",
		"bidi",
		"realtime"
	]),
	agentMode: "agent",
	normalizeUrl: (url) => GOOGLE_MEET_PLATFORM_ADAPTER.urls.validateAndNormalize(url),
	normalizeMeetingKey: normalizeMeetKey,
	browser: {
		application: "Google Chrome",
		buildProfileArgs: (profile) => ["--args", `--profile-directory=${profile}`],
		openedStatus: "chrome-opened",
		openedNotes: ["Browser page control is handled by OpenClaw browser automation when using chrome-node."]
	}
});
//#endregion
export { handleGoogleMeetNodeHostCommand };
