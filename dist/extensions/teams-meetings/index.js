import { TEAMS_MEETINGS_CLI_METADATA } from "./cli-metadata.js";
import { MeetingPlatformAdapter } from "openclaw/plugin-sdk/meeting-runtime";
import { addTimerTimeoutGraceMs } from "openclaw/plugin-sdk/number-runtime";
import { REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME } from "openclaw/plugin-sdk/realtime-voice";
import { normalizeAgentId } from "openclaw/plugin-sdk/routing";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/teams-meetings/src/errors.ts
var TeamsMeetingsInvalidRequestError = class extends Error {};
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-selectors.ts
const TEAMS_MEETING_SELECTORS = {
	continueInBrowser: [
		"[data-tid=\"joinOnWeb\"]",
		"[data-tid=\"joinOnWebButton\"]",
		"button[data-tid=\"continue-on-browser\"]"
	],
	guestName: [
		"input[data-tid=\"prejoin-display-name-input\"]",
		"[data-tid=\"prejoin-display-name-input\"] input",
		"input[data-tid=\"guest-name-input\"]"
	],
	join: [
		"button[data-tid=\"prejoin-join-button\"]",
		"[data-tid=\"prejoin-join-button\"] button",
		"button[data-tid=\"join-now\"]",
		"button[data-tid=\"join-button\"]"
	],
	microphone: [
		"button[data-tid=\"toggle-mute\"]",
		"[data-tid=\"toggle-mute\"] button",
		"input[data-tid=\"toggle-mute\"]",
		"[data-tid=\"toggle-mute\"][role=\"switch\"]",
		"button[data-tid=\"microphone-button\"]"
	],
	camera: [
		"button[data-tid=\"toggle-video\"]",
		"[data-tid=\"toggle-video\"] button",
		"input[data-tid=\"toggle-video\"]",
		"[data-tid=\"toggle-video\"][role=\"switch\"]",
		"button[data-tid=\"camera-button\"]"
	],
	deviceSettings: [
		"button#audio-button-configure",
		"button[aria-label=\"Open audio options\"]",
		"button[data-tid=\"prejoin-device-settings-button\"]",
		"button[data-tid=\"device-settings-button\"]",
		"button[data-tid=\"audio-device-settings-button\"]"
	],
	microphoneDevice: [
		"button[data-tid=\"selected-microphone-display\"]",
		"[data-tid=\"microphone-select\"]",
		"[data-tid=\"audio-device-input\"]",
		"[data-tid=\"device-settings-microphone\"] [role=\"combobox\"]",
		"select[data-tid=\"microphone-select\"]"
	],
	microphoneDeviceMenu: ["[data-tid=\"microphone-settings\"][role=\"listbox\"]"],
	microphoneDeviceScope: "[data-tid=\"device-settings-microphone\"]",
	selectedMicrophoneDevice: ["option:checked", "[role=\"option\"][aria-selected=\"true\"]"],
	audioDeviceOptions: ["option", "[role=\"option\"]"],
	leave: [
		"button#hangup-button",
		"button[data-tid=\"call-hangup\"]",
		"[data-tid=\"call-hangup\"] button",
		"button[data-tid=\"hangup-button\"]",
		"button[data-tid=\"call-hangup-button\"]"
	],
	leaveConfirmation: [
		"button[data-tid=\"confirm-leave-button\"]",
		"button[data-tid=\"leave-meeting-confirm\"]",
		"button[data-tid=\"leave-call-confirm\"]"
	],
	postCall: [
		"button[data-tid=\"anon-meeting-end-screen-rejoin-button\"]",
		"[data-tid=\"call-ended-screen\"]",
		"[data-tid=\"post-call-screen\"]",
		"button[data-tid=\"prejoin-rejoin-button\"]"
	],
	lobby: ["[data-tid=\"lobby-screen\"]", "[data-tid=\"lobby-waiting-screen\"]"],
	signIn: [
		"button[data-tid=\"signin-button\"]",
		"button[data-tid=\"sign-in-button\"]",
		"[data-tid=\"auth-signin\"]"
	],
	permissionPrompt: [
		"[data-tid=\"device-permission-prompt\"]",
		"[data-tid=\"media-permission-prompt\"]",
		"[data-tid=\"browser-permission-error\"]"
	],
	moreActions: ["button[aria-label=\"More\"]"],
	captions: ["button#closed-captions-button", "[role=\"menuitem\"][title*=\"captions\" i]"],
	captionsOff: ["button[data-tid=\"closed-captions-turn-off-button\"]", "button#captions-panel-dismiss-button"],
	captionRenderer: ["[data-tid=\"closed-caption-renderer-wrapper\"]"],
	captionContent: ["[data-tid=\"closed-caption-v2-virtual-list-content\"]"],
	captionRows: ["div[role=\"log\"]"],
	captionAuthor: ["[data-tid=\"author\"]"],
	captionText: ["[data-tid=\"closed-caption-text\"]"]
};
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-status-call-source.ts
const teamsMeetingStatusCall = { captionEnableSource: `if (!captionsFinalized && canMutateSession && inCall && !captionsEnabledNow) {
      let captionButton = first(selectors.captions);
      if (!captionButton) {
        first(selectors.moreActions)?.click?.();
        await waitForUi();
        captionButton = first(selectors.captions);
      }
      if (captionButton) {
        const captionLabel = label(captionButton);
        const alreadyEnabled = captionButton.getAttribute?.("aria-checked") === "true" ||
          /hide live captions|turn off captions/i.test(captionLabel) ||
          Boolean(firstRaw(selectors.captionsOff));
        if (!alreadyEnabled) {
          captionButton.click();
          await waitForUi();
        }
        const currentLabel = label(captionButton);
        captionsEnabledNow = captionButton.getAttribute?.("aria-checked") === "true" ||
          /hide live captions|turn off captions/i.test(currentLabel) ||
          Boolean(firstRaw(selectors.captionRenderer)) ||
          Boolean(firstRaw(selectors.captionsOff));
        if (captionsEnabledNow && !alreadyEnabled) {
          notes.push("Enabled Teams live captions for transcript capture.");
        }
      }
    }` };
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-status-prejoin-source.ts
const teamsMeetingStatusPrelude = {
	controlLookupSource: `const buttons = [...document.querySelectorAll("button")];
  const findTextButton = (pattern) => buttons.find((button) => !button.disabled && pattern.test(label(button)));`,
	lifecycleSource: (sources) => `  const continueInBrowser = first(selectors.continueInBrowser) ||
    findTextButton(/continue on this browser|join on the web|use the web app|continue without the app/i);
  if (canMutateSession && identityVerifiedBeforeCall && continueInBrowser) {
    continueInBrowser.click();
    notes.push("Continued to the Teams web client.");
    await waitForUi();
  }
${sources.guestName(false)}
  const leave = first(selectors.leave);
  const continueWithoutDevices = findTextButton(/^continue without audio or video$/i);
  let dismissedDevicePrompt = false;
  if (
    canMutateSession &&
    identityVerifiedBeforeCall &&
    !leave &&
    autoJoin &&
    !allowMicrophone &&
    continueWithoutDevices
  ) {
    continueWithoutDevices.click();
    dismissedDevicePrompt = true;
    notes.push("Dismissed the Teams device prompt; selected audio is verified separately.");
    await waitForUi();
  }
  // Teams replaces the meeting URL after admission. Preserve identity only
  // while adopting the first in-call control or retaining that exact control.
  const markerAgeMs = Date.now() - (priorMeeting?.verifiedAt || 0);
  const identityAdoptedInCall = Boolean(
    !currentIdentity &&
    priorMeeting?.identity === expectedIdentity &&
    !priorMeeting?.inCallControl &&
    markerAgeMs >= 0 &&
    markerAgeMs < identityRetentionMs &&
    leave &&
    leave.isConnected !== false
  );
  const identityRerenderedInCall = Boolean(
    !currentIdentity &&
    priorMeeting?.identity === expectedIdentity &&
    priorMeeting?.inCallControl &&
    priorMeeting.inCallControl !== leave &&
    priorMeeting.inCallControl.isConnected === false &&
    priorMeeting?.inCallUrl === location.href &&
    markerAgeMs >= 0 &&
    markerAgeMs < 5_000 &&
    leave &&
    leave.isConnected !== false
  );
  const identityAwaitingRerender = Boolean(
    !currentIdentity &&
    priorMeeting?.identity === expectedIdentity &&
    priorMeeting?.inCallControl &&
    priorMeeting.inCallControl.isConnected === false &&
    priorMeeting?.inCallUrl === location.href &&
    markerAgeMs >= 0 &&
    markerAgeMs < 5_000 &&
    !leave
  );
${sources.preservedIdentity}
  const inCall = Boolean(identityVerified && leave);
  if (canMutateSession && identityVerified && meetingOwnerConflict) {
    // The tab can survive a Teams SPA meeting/session change. Old hidden bridges
    // must stop, while their muted source streams remain eligible for the new owner.
    adoptAudioBridgeSourcesForSession();
  }
  if (canMutateSession && !inCall && !identityAwaitingRerender) retireOwnedAudioBridges();
  if (canMutateSession && (identityVerifiedBeforeCall || identityPreservedInCall)) {
    window.__openclawTeamsMeeting = {
      ...(priorMeeting?.identity === expectedIdentity && !meetingOwnerConflict ? priorMeeting : {}),
      identity: expectedIdentity,
      sessionId: sessionId || priorMeeting?.sessionId,
      verifiedAt: Date.now(),
      ...(inCall ? { inCallControl: leave, inCallUrl: location.href } : {}),
    };
  } else if (
    canMutateSession &&
    !currentIdentity &&
    priorMeeting &&
    !identityAwaitingRerender &&
    (priorMeeting.inCallControl || markerAgeMs >= identityRetentionMs)
  ) {
    delete window.__openclawTeamsMeeting;
  }
  const microphone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
  let microphoneState = identityVerified ? toggleState(microphone, "microphone") : undefined;
  const refreshMicrophoneState = async () => {
    await waitForUi();
    const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
    microphoneState = toggleState(currentMicrophone, "microphone");
  };
  const camera = first(selectors.camera) || findTextButton(/camera|video/i);
  let cameraState = identityVerified ? toggleState(camera, "camera") : undefined;
  let controlManualAction;
  if (canMutateSession && identityVerified && !inCall && camera && cameraState === "on") {
    camera.click();
    await waitForUi();
    const currentCamera = first(selectors.camera) || findTextButton(/camera|video/i);
    cameraState = toggleState(currentCamera, "camera");
    if (cameraState === "off") {
      notes.push("Turned the Teams camera off before joining.");
    }
  }
  const join = first(selectors.join) || findTextButton(/^\\s*(join now|ask to join|join meeting)\\s*$/i);
  if (identityVerified && !inCall && join && cameraState !== "off") {
    controlManualAction = manualActionFor("teams-camera-required", "Turn the Teams camera off and verify the camera control shows it is off, then retry joining.");
  }
${sources.virtualAudioInput({
		selectionSource: `      const preparedInput = window.__openclawTeamsMeeting;
      const preparedSelection = Boolean(
        readOnly &&
        preparedInput?.identity === expectedIdentity &&
        (!sessionId || preparedInput?.sessionId === sessionId) &&
        preparedInput?.audioInputDeviceId === input.deviceId
      );
      let selected = Boolean(selectedMicrophoneLabel()) || preparedSelection;`,
		afterSelectionSource: `      if (selected && window.__openclawTeamsMeeting?.identity === expectedIdentity) {
        window.__openclawTeamsMeeting.audioInputDeviceId = input.deviceId;
      }
`
	})}
${sources.prejoinMicrophone({
		unroutedSource: `      controlManualAction = manualActionFor("teams-audio-choice-required", "Select the OpenClaw virtual audio device as the Teams microphone and verify it is selected before enabling talk-back.");`,
		afterRoutedSource: `    if (audioInputRouted && microphoneState !== "on") {
      controlManualAction = manualActionFor("teams-microphone-required", "Unmute the Teams microphone and verify the microphone control shows it is on, then retry joining.");
    }
`,
		muteInCall: false
	})}
${sources.inCallMicrophone}
  if (identityVerified && !inCall && join && !allowMicrophone && microphoneState !== "off") {
    controlManualAction = manualActionFor("teams-microphone-required", "Mute the Teams microphone and verify the microphone control shows it is off, then retry joining.");
  }
  if (identityVerified && !inCall && join && allowMicrophone && !controlManualAction) {
    if (!microphone) {
      controlManualAction = manualActionFor("teams-microphone-required", "Open Teams device settings and verify the microphone control before enabling talk-back.");
    } else if (audioInputRouted !== true) {
      controlManualAction = manualActionFor("teams-audio-choice-required", "Select the OpenClaw virtual audio device as the Teams microphone and verify it is selected before enabling talk-back.");
    } else if (microphoneState !== "on") {
      controlManualAction = manualActionFor("teams-microphone-required", "Unmute the Teams microphone and verify the microphone control shows it is on, then retry joining.");
    }
  }`,
	manualActionSource: (sources) => `  const pageText = text(document.body);
  const pageTextLower = pageText.toLowerCase();
  const lobbyWaiting = Boolean(first(selectors.lobby)) ||
    /someone will let you in shortly|waiting for someone to let you in|when someone admits you|you.?re in the lobby|we.?ve let people in the meeting know you.?re waiting/i.test(pageTextLower);
  const signInControl = first(selectors.signIn);
  const hostname = location.hostname.toLowerCase();
  const tenantLoginRequired =
    /only people with a work or school account|sign in with an account from this organization|anonymous users (?:can.?t|cannot) join|verify your email|enter the code sent to/i.test(pageTextLower);
  const loginRequired = hostname === "login.microsoftonline.com" ||
    hostname.endsWith(".microsoftonline.com") ||
    tenantLoginRequired ||
    (Boolean(signInControl) && !guestInput && !join && /sign in to (?:join|continue)|sign in to your account/i.test(pageTextLower));
${sources.manualActions({
		loginDisplayName: "Microsoft Teams",
		inCallControls: false
	})}`
};
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-urls.ts
function normalizeTeamsMeetingUrlForReuse(url) {
	if (!url) return;
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "https:" || parsed.port || parsed.username || parsed.password) return;
		const hostname = parsed.hostname.toLowerCase();
		if (hostname === "teams.microsoft.com") {
			const match = parsed.pathname.match(/^\/l\/meetup-join\/([^/]+)(?:\/0)?\/?$/i);
			if (!match?.[1]) return;
			const threadId = decodeURIComponent(match[1]);
			if (!/^19:[^/]+@thread\.(?:v2|tacv2)$/i.test(threadId)) return;
			return `teams-work:${threadId}`;
		}
		if (hostname === "teams.live.com") {
			const launcherMatch = (parsed.pathname.toLowerCase() === "/dl/launcher/launcher.html" ? parsed.searchParams.get("url") : void 0)?.match(/^\/_#\/meet\/([^/?#]+)(?:\?(.+))?$/i);
			let lightMeeting;
			if (parsed.pathname.toLowerCase() === "/light-meetings/launch") try {
				const coordinates = parsed.searchParams.get("coords");
				const decoded = coordinates && coordinates.length <= 16384 ? JSON.parse(Buffer.from(coordinates, "base64").toString("utf8")) : void 0;
				if (decoded && typeof decoded === "object") lightMeeting = decoded;
			} catch {
				return;
			}
			const match = parsed.pathname.match(/^\/meet\/([^/]+)\/?$/i) ?? launcherMatch ?? (typeof lightMeeting?.meetingCode === "string" ? [void 0, lightMeeting.meetingCode] : void 0);
			if (!match?.[1]) return;
			const meetCode = decodeURIComponent(match[1]);
			if (!/^[a-z0-9_-]+$/i.test(meetCode)) return;
			const passcode = launcherMatch ? new URLSearchParams(launcherMatch[2] ?? "").get("p") : typeof lightMeeting?.passcode === "string" ? lightMeeting.passcode : parsed.searchParams.get("p");
			return `teams-consumer:${meetCode.toLowerCase()}:p:${encodeURIComponent(passcode ?? "")}`;
		}
	} catch {
		return;
	}
}
function normalizeTeamsMeetingUrl(input) {
	if (typeof input !== "string" || !input.trim()) throw new Error("Microsoft Teams meeting URL is required");
	const value = input.trim();
	if (!normalizeTeamsMeetingUrlForReuse(value)) throw new Error("Microsoft Teams meeting URL must use https://teams.microsoft.com/l/meetup-join/... or https://teams.live.com/meet/<id>");
	const parsed = new URL(value);
	parsed.hash = "";
	return parsed.toString();
}
function isSameTeamsMeetingUrl(left, right) {
	const normalizedLeft = normalizeTeamsMeetingUrlForReuse(left);
	const normalizedRight = normalizeTeamsMeetingUrlForReuse(right);
	return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
}
function isRecoverableTeamsMeetingTab(tab, url) {
	if (url) return isSameTeamsMeetingUrl(tab.url, url);
	if (normalizeTeamsMeetingUrlForReuse(tab.url)) return true;
	const hostname = URL.parse(tab.url ?? "")?.hostname.toLowerCase();
	return Boolean(hostname && (hostname === "login.microsoftonline.com" || hostname.endsWith(".microsoftonline.com")) && /sign in|microsoft|teams/i.test(tab.title ?? ""));
}
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-page-scripts.ts
function pageIdentityFunctionSource() {
	return `const meetingIdentity = (rawUrl) => {
    try {
      const parsed = new URL(rawUrl);
      const host = parsed.hostname.toLowerCase();
      if (parsed.protocol !== "https:") return undefined;
      if (host === "teams.microsoft.com") {
        const match = parsed.pathname.match(/^\\/l\\/meetup-join\\/([^/]+)(?:\\/0)?\\/?$/i);
        if (!match?.[1]) return undefined;
        const threadId = decodeURIComponent(match[1]);
        return /^19:[^/]+@thread\\.(?:v2|tacv2)$/i.test(threadId)
          ? "teams-work:" + threadId
          : undefined;
      }
      if (host === "teams.live.com") {
        const launcherTarget = parsed.pathname.toLowerCase() === "/dl/launcher/launcher.html"
          ? parsed.searchParams.get("url")
          : undefined;
        const launcherMatch = launcherTarget?.match(/^\\/_#\\/meet\\/([^/?#]+)(?:\\?(.+))?$/i);
        let lightMeeting;
        if (parsed.pathname.toLowerCase() === "/light-meetings/launch") {
          try {
            const coordinates = parsed.searchParams.get("coords");
            const decoded = coordinates && coordinates.length <= 16_384
              ? JSON.parse(atob(coordinates))
              : undefined;
            if (decoded && typeof decoded === "object") lightMeeting = decoded;
          } catch {}
        }
        const match = parsed.pathname.match(/^\\/meet\\/([^/]+)\\/?$/i) || launcherMatch ||
          (typeof lightMeeting?.meetingCode === "string"
            ? [undefined, lightMeeting.meetingCode]
            : undefined);
        if (!match?.[1]) return undefined;
        const code = decodeURIComponent(match[1]);
        const passcode = launcherMatch
          ? new URLSearchParams(launcherMatch[2] || "").get("p")
          : typeof lightMeeting?.passcode === "string"
            ? lightMeeting.passcode
            : parsed.searchParams.get("p");
        return /^[a-z0-9_-]+$/i.test(code)
          ? "teams-consumer:" + code.toLowerCase() + ":p:" + encodeURIComponent(passcode || "")
          : undefined;
      }
    } catch {}
    return undefined;
  };`;
}
function teamsMeetingToggleStateFunctionSource() {
	return `(input) => {
    const pressed = String(input?.ariaPressed || "").toLowerCase();
    if (pressed === "true") return "on";
    if (pressed === "false") return "off";
    const checked = String(input?.ariaChecked ?? input?.checked ?? "").toLowerCase();
    if (checked === "true") return "on";
    if (checked === "false") return "off";
    const value = String(input?.label || "").toLowerCase().replace(/\\s+/g, " ").trim();
    if (!value) return undefined;
    if (input?.kind === "camera") {
      if (/\\bturn (?:your )?camera off\\b|\\bturn off (?:your )?camera\\b|\\bstop video\\b|\\bdisable (?:your )?(?:camera|video)\\b/.test(value)) return "on";
      if (/\\bturn (?:your )?camera on\\b|\\bturn on (?:your )?camera\\b|\\bstart video\\b|\\benable (?:your )?(?:camera|video)\\b/.test(value)) return "off";
      if (/\\b(?:camera|video) (?:is |currently )?(?:off|disabled)\\b/.test(value)) return "off";
      if (/\\b(?:camera|video) (?:is |currently )?(?:on|enabled)\\b/.test(value)) return "on";
      return undefined;
    }
    if (/^mute$|\\bturn (?:your )?(?:microphone|mic) off\\b|\\bturn off (?:your )?(?:microphone|mic)\\b|\\bmute (?:your )?(?:microphone|mic)\\b|\\bdisable (?:your )?(?:microphone|mic)\\b/.test(value)) return "on";
    if (/^unmute$|\\bturn (?:your )?(?:microphone|mic) on\\b|\\bturn on (?:your )?(?:microphone|mic)\\b|\\bunmute (?:your )?(?:microphone|mic)\\b|\\benable (?:your )?(?:microphone|mic)\\b/.test(value)) return "off";
    if (/\\b(?:microphone|mic) (?:is |currently )?(?:off|muted|disabled)\\b/.test(value)) return "off";
    if (/\\b(?:microphone|mic) (?:is |currently )?(?:on|unmuted|enabled)\\b/.test(value)) return "on";
    return undefined;
  }`;
}
const teamsMeetingPageScripts = MeetingPlatformAdapter.createPageScripts({
	platform: {
		audioOutputElementIdPrefix: "openclaw-teams-audio-output-",
		manualActionReasonPrefix: "teams",
		displayName: "Teams",
		globals: {
			audioOutputs: "__openclawTeamsAudioOutputs",
			captionArchive: "__openclawTeamsCaptionArchive",
			captions: "__openclawTeamsCaptions",
			meeting: "__openclawTeamsMeeting"
		}
	},
	normalizeUrl: normalizeTeamsMeetingUrlForReuse,
	pageIdentitySource: pageIdentityFunctionSource,
	selectors: TEAMS_MEETING_SELECTORS,
	toggleStateFunction: teamsMeetingToggleStateFunctionSource,
	statusPrelude: teamsMeetingStatusPrelude,
	statusCall: teamsMeetingStatusCall,
	leave: {
		controlSource: `const first = (list) => {
    for (const selector of list) {
      const node = document.querySelector(selector);
      if (!node) continue;
      return node.matches?.("button") ? node : node.querySelector?.("button") || node.closest?.("button") || node;
    }
    return undefined;
  };
  const leave = first(selectors.leave);
  const confirmation = first(selectors.leaveConfirmation);
  const postCall = first(selectors.postCall);
  const currentUrlMatches = Boolean(expectedIdentity && currentIdentity === expectedIdentity);`,
		departedMarkerSource: "postCall",
		sessionMatchSource: "const sessionMatched = !enforceSessionOwnership || state?.sessionId === expectedSessionId;"
	}
});
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-platform-adapter.ts
function teamsMeetingOrigin(meetingUrl) {
	try {
		const origin = new URL(meetingUrl).origin;
		return origin === "https://teams.microsoft.com" || origin === "https://teams.live.com" ? origin : void 0;
	} catch {
		return;
	}
}
const TEAMS_MEETINGS_PLATFORM_ADAPTER = MeetingPlatformAdapter.create({
	id: "teams-meetings",
	displayName: "Microsoft Teams meetings",
	browserLabel: "Teams meeting",
	logScope: "[teams-meetings]",
	agentConsult: {
		surface: "a private Microsoft Teams meeting",
		userLabel: "Participant",
		assistantLabel: "Agent",
		questionSourceLabel: "participant",
		workingResponseLabel: "participant",
		extraSystemPrompt: [
			"You are a behind-the-scenes consultant for a live meeting voice agent.",
			"Prioritize a fast, speakable answer over exhaustive investigation.",
			"Use only bounded, task-relevant tool calls.",
			"Never print secrets or dump environment variables.",
			"Be accurate, brief, and speakable."
		].join(" ")
	},
	session: {
		idPrefix: "teams_meeting",
		participantIdentity: (transport) => transport === "chrome-node" ? "Microsoft Teams guest in Chrome on a paired node" : "Microsoft Teams guest in the OpenClaw Chrome profile"
	},
	nodeCommandName: "teamsmeetings.chrome",
	nodeConfigPath: "plugins.entries.teams-meetings.config.chromeNode.node",
	urls: {
		validateAndNormalize: normalizeTeamsMeetingUrl,
		normalizeForReuse: normalizeTeamsMeetingUrlForReuse,
		isSameMeeting: isSameTeamsMeetingUrl,
		buildJoinUrl: (session) => session.url,
		accountHint: () => void 0,
		isPreferredJoinUrl: (url) => Boolean(normalizeTeamsMeetingUrlForReuse(url)),
		isRecoverableTab: isRecoverableTeamsMeetingTab,
		localeAction: () => void 0
	},
	...MeetingPlatformAdapter.createBrowserAdapterOptions({
		displayName: "Teams",
		transcriptDisplayName: "Microsoft Teams",
		manualActionReasonPrefix: "teams",
		retryCaptions: true,
		unavailableMessage: "Open the OpenClaw browser profile, finish the Teams sign-in, admission, or permission prompt, then retry.",
		origin: teamsMeetingOrigin,
		scripts: teamsMeetingPageScripts
	})
});
//#endregion
//#region extensions/teams-meetings/index.ts
const teamsMeetingsPlugin = MeetingPlatformAdapter.defineBrowserMeetingPlugin({
	platform: TEAMS_MEETINGS_PLATFORM_ADAPTER,
	labels: {
		meeting: "Microsoft Teams meeting",
		participant: "Teams guest",
		brand: "Microsoft Teams",
		microphone: "Teams",
		browserPage: "Teams",
		tab: "Teams meeting"
	},
	config: {
		defaultRealtimeInstructions: `You are joining a private Microsoft Teams meeting as an OpenClaw voice transport. Keep spoken replies brief and natural. In agent mode, wait for OpenClaw consult results and speak them exactly. In bidi mode, answer directly and call ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} for deeper reasoning, current information, or tools.`,
		resolveGatewayOperationTimeoutMs: (config) => Math.max(6e4, addTimerTimeoutGraceMs(config.chrome.joinTimeoutMs, 3e4) ?? 1)
	},
	InvalidRequestError: TeamsMeetingsInvalidRequestError,
	toolUrlDescription: "Microsoft Teams meeting URL",
	transcriptSource: {
		id: "teams",
		aliases: [
			"teams-meetings",
			"microsoft-teams",
			"msteams"
		],
		providerName: "Microsoft Teams"
	},
	microphoneMutedReason: "teams-microphone-muted",
	setup: {
		captionsMessage: (mode) => mode === "transcribe" ? "Teams live-caption capture is enabled and ready" : "Caption scraping is not used by talk-back modes",
		connectedNodeMessage: (node) => `Connected Teams meeting node ready: ${node}`,
		guestJoinCheck: (config) => {
			const ok = Boolean(config.chrome.guestName && config.chrome.autoJoin && config.chrome.reuseExistingTab);
			return {
				ok,
				message: ok ? "Guest name, auto-join, and tab reuse are configured" : "Set chrome.guestName, chrome.autoJoin, and chrome.reuseExistingTab for unattended guest joins"
			};
		},
		missingNodeIdMessage: "Connected Microsoft Teams meetings node did not include a node id."
	},
	defaultSpeechMessage: "Say exactly: Microsoft Teams speech test complete.",
	shouldWaitForListening: ({ chrome }) => Boolean(chrome?.launched || chrome?.browserTab?.targetId),
	sharePrerequisiteDeadline: true,
	preserveTrackedBrowserOnEngineFailure: false,
	nodePolicyDeniedCode: "TEAMS_MEETINGS_NODE_POLICY_DENIED",
	cli: {
		descriptor: TEAMS_MEETINGS_CLI_METADATA.descriptor,
		joinDescription: "join a Teams meeting as a guest",
		resolveTimeoutMs: (operationTimeoutMs, { requestedTimeoutMs }) => Math.max(operationTimeoutMs, requestedTimeoutMs === void 0 ? 0 : addTimerTimeoutGraceMs(requestedTimeoutMs, 3e4) ?? 1)
	},
	entry: {
		normalizeRequesterSessionKey: normalizeOptionalString,
		normalizeToolAgentId: (agentId) => agentId ? normalizeAgentId(agentId) : void 0,
		resolveToolRuntime: async (api, agentId) => {
			const trustedRouting = Boolean(agentId && agentId !== "main");
			const useRuntime = trustedRouting ? await api.runtime.gateway.isAvailable() : false;
			if (trustedRouting && !useRuntime) throw new Error("Per-agent Microsoft Teams meeting routing requires a Gateway-hosted agent run.");
			return useRuntime ? api.runtime : void 0;
		},
		registerNodeWhen: () => true
	}
});
var teams_meetings_default = teamsMeetingsPlugin.plugin;
//#endregion
export { teams_meetings_default as default, teamsMeetingsPlugin };
