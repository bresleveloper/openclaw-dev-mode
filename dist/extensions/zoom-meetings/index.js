import { ZOOM_MEETINGS_CLI_METADATA } from "./cli-metadata.js";
import { MeetingPlatformAdapter } from "openclaw/plugin-sdk/meeting-runtime";
import { addTimerTimeoutGraceMs } from "openclaw/plugin-sdk/number-runtime";
import { REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME } from "openclaw/plugin-sdk/realtime-voice";
//#region extensions/zoom-meetings/src/errors.ts
var ZoomMeetingsInvalidRequestError = class extends Error {};
//#endregion
//#region extensions/zoom-meetings/src/transports/zoom-meetings-selectors.ts
const ZOOM_MEETING_SELECTORS = {
	continueInBrowser: [],
	guestName: ["input#input-for-name"],
	join: ["button.preview-join-button"],
	microphone: [
		"button#preview-audio-control-button",
		"button[aria-label=\"mute my microphone\" i]",
		"button[aria-label=\"unmute my microphone\" i]"
	],
	camera: ["button#preview-video-control-button", "button.send-video-container__btn"],
	deviceSettings: ["button[aria-label=\"More audio controls\" i]"],
	microphoneDevice: ["[aria-label*=\"microphone\" i][role=\"combobox\"]"],
	microphoneDeviceMenu: [
		".audio-option-menu__pop-menu",
		"[role=\"listbox\"]",
		"[role=\"menu\"]"
	],
	microphoneDeviceScope: "[data-tid=\"device-settings-microphone\"]",
	selectedMicrophoneDevice: [
		"a[role=\"button\"][aria-label^=\"Select a microphone\" i][aria-label$=\"selected\" i]",
		"option:checked",
		"[role=\"option\"][aria-selected=\"true\"]",
		"[role=\"menuitemradio\"][aria-checked=\"true\"]"
	],
	audioDeviceOptions: [
		"a[role=\"button\"][aria-label^=\"Select a microphone\" i]",
		"option",
		"[role=\"option\"]",
		"[role=\"menuitemradio\"]"
	],
	leave: ["button[aria-label=\"Leave\" i]"],
	leaveConfirmation: [
		"button.leave-meeting-options__btn",
		"button.zm-btn--danger",
		"button[aria-label=\"Leave Meeting\" i]"
	],
	postCall: [
		".meeting-ended",
		".post-meeting",
		".leave-meeting-page"
	],
	lobby: [
		".waiting-room-container",
		"[class*=\"waiting-room\"]",
		"[class*=\"waitingRoom\"]"
	],
	signIn: ["a[href*=\"/signin\"]", "button[aria-label*=\"sign in\" i]"],
	passcode: [
		"input[type=\"password\"]",
		"input[id*=\"passcode\" i]",
		"input[name*=\"passcode\" i]",
		"input[aria-label*=\"passcode\" i]"
	],
	captcha: [
		"iframe[src*=\"recaptcha\" i]",
		"iframe[title*=\"captcha\" i]",
		".g-recaptcha",
		"[data-sitekey]",
		"[class*=\"captcha\" i]"
	],
	permissionPrompt: [".pepc-permission-dialog"],
	moreActions: ["button.more-button", ".footer-more-button button"],
	captions: [
		"a[aria-label*=\"Show Captions\" i]",
		"a[aria-label=\"Captions\" i]",
		"[role=\"button\"][aria-label=\"Captions\" i]"
	],
	captionsOff: ["a[aria-label*=\"Hide Captions\" i]"],
	captionRenderer: [".live-transcription-subtitle__box"],
	captionContent: ["body"],
	captionRows: ["#live-transcription-subtitle"],
	captionAuthor: [
		".zmu-data-selector-item__icon",
		".live-transcription-subtitle__speaker",
		"[class*=\"transcription\"][class*=\"speaker\"]"
	],
	captionText: [
		".live-transcription-subtitle__item",
		".live-transcription-subtitle__text",
		"[class*=\"transcription\"][class*=\"text\"]",
		".live-transcription-subtitle__box"
	]
};
//#endregion
//#region extensions/zoom-meetings/src/transports/zoom-meetings-status-call-source.ts
const zoomMeetingStatusCall = {
	captionEnableSource: `if (!captionsFinalized && canMutateSession && inCall && !captionsEnabledNow) {
      let captionButton = first(selectors.captions);
      if (!captionButton) {
        (first(selectors.moreActions) || findTextButton(/^more$/i))?.click?.();
        await waitForUi();
        captionButton = first(selectors.captions);
      }
      if (captionButton) {
        const captionLabel = label(captionButton);
        const alreadyEnabled = captionButton.getAttribute?.("aria-checked") === "true" ||
          /hide (?:live )?captions|turn off captions/i.test(captionLabel) ||
          Boolean(firstRaw(selectors.captionsOff));
        if (!alreadyEnabled) {
          captionButton.click();
          await waitForUi();
          const showCaptions = first(selectors.captions);
          if (showCaptions && showCaptions !== captionButton && /show captions/i.test(label(showCaptions))) {
            showCaptions.click();
            await waitForUi();
          }
          const saveLanguage = findTextButton(/^save$/i);
          if (saveLanguage && /caption language/i.test(text(document.body))) {
            saveLanguage.click();
            await waitForUi();
          }
        }
        const currentCaptionButton = first(selectors.captions) || captionButton;
        const currentLabel = label(currentCaptionButton);
        captionsEnabledNow = currentCaptionButton.getAttribute?.("aria-checked") === "true" ||
          /hide (?:live )?captions|turn off captions/i.test(currentLabel) ||
          Boolean(firstRaw(selectors.captionRenderer)) ||
          Boolean(firstRaw(selectors.captionsOff));
        if (captionsEnabledNow && !alreadyEnabled) {
          notes.push("Enabled Zoom live captions for transcript capture.");
        }
      }
    }`,
	extraResultSource: "meetingEnded,"
};
//#endregion
//#region extensions/zoom-meetings/src/transports/zoom-meetings-status-prejoin-source.ts
const zoomMeetingStatusPrelude = {
	controlLookupSource: `const findTextButton = (pattern) => [...document.querySelectorAll("button")]
    .find((button) => !button.disabled && pattern.test(label(button)));
  const findTextControl = (pattern) =>
    [...document.querySelectorAll('button, a, [role="button"]')]
      .find((control) => !control.disabled && pattern.test(label(control)));`,
	lifecycleSource: (sources) => `  const continueInBrowser = first(selectors.continueInBrowser) ||
    findTextButton(/join from browser|continue on this browser|join on the web|use the web app|continue without the app/i);
  if (canMutateSession && identityVerifiedBeforeCall && continueInBrowser) {
    continueInBrowser.click();
    notes.push("Continued to the Zoom web client.");
    await waitForUi();
  }
${sources.guestName(true)}
  const leave = first(selectors.leave);
  let continueWithoutDevices = findTextControl(/\\bcontinue without (?:audio or video|microphone(?: and camera)?)\\b/i);
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
    notes.push("Continued past the Zoom device prompt in observe-only mode.");
    await waitForUi();
    continueWithoutDevices = findTextControl(
      /\\bcontinue without (?:audio or video|microphone(?: and camera)?)\\b/i
    );
    if (continueWithoutDevices) {
      continueWithoutDevices.click();
      await waitForUi();
    }
  } else if (
    canMutateSession &&
    identityVerifiedBeforeCall &&
    !leave &&
    autoJoin &&
    allowMicrophone
  ) {
    const useMicrophone = document.querySelector('usermedia.pepc-permission-dialog__permission-button[type*="microphone"]');
    if (useMicrophone) {
      useMicrophone.click();
      notes.push("Requested Zoom microphone access from the prejoin prompt.");
      await waitForUi();
    }
  }
  const pageText = text(document.body);
  const pageTextLower = pageText.toLowerCase();
  const lobbyWaiting = Boolean(first(selectors.lobby)) ||
    /host will let you in soon|waiting for the host to start|someone will let you in shortly|waiting for someone to let you in|when someone admits you|you.?re in the lobby|we.?ve let people in the meeting know you.?re waiting/i.test(pageTextLower);

  const devicesDisabled = Boolean(!allowMicrophone && (dismissedDevicePrompt || (priorMeeting?.identity === expectedIdentity && (!sessionId || priorMeeting?.sessionId === sessionId) && priorMeeting?.devicesDisabled === true)));
  // Zoom replaces the meeting URL after admission; retain only an adopted in-call control.
  // Lobby ownership remains durable because host admission has no bounded wait.
  const markerAgeMs = Date.now() - (priorMeeting?.verifiedAt || 0);
  const inCallControlDisconnected = Boolean(!currentIdentity && priorMeeting?.identity === expectedIdentity && priorMeeting?.inCallControl?.isConnected === false);
  if (inCallControlDisconnected && !leave) priorMeeting.inCallControlLostAt ||= Date.now();
  const inCallControlLossAgeMs = Date.now() - (priorMeeting?.inCallControlLostAt || Date.now());
  const identityAdoptedInCall = Boolean(
    !currentIdentity &&
    priorMeeting?.identity === expectedIdentity &&
    !priorMeeting?.inCallControl &&
    (
      priorMeeting?.awaitingAdmission === true ||
      (markerAgeMs >= 0 && markerAgeMs < identityRetentionMs)
    ) &&
    leave &&
    leave.isConnected !== false
  );
  const identityRerenderedInCall = Boolean(
    inCallControlDisconnected &&
    priorMeeting.inCallControl !== leave &&
    priorMeeting?.inCallUrl === location.href &&
    leave &&
    leave.isConnected !== false
  );
  const identityAwaitingRerender = Boolean(
    inCallControlDisconnected &&
    inCallControlLossAgeMs >= 0 &&
    inCallControlLossAgeMs < 5_000 &&
    !leave
  );
${sources.preservedIdentity}
  const meetingEnded = Boolean(
    [...document.querySelectorAll(".zm-modal-body-title")].some((node) =>
      /meeting (?:has been ended by host|has ended)/i.test(text(node))
    ) ||
    (
      inCallControlDisconnected &&
      inCallControlLossAgeMs >= 5_000 &&
      !leave
    )
  );
  const inCall = Boolean(identityVerified && leave && !meetingEnded);
  if (canMutateSession && identityVerified && meetingOwnerConflict) {
    // The tab can survive a Zoom SPA meeting/session change. Old hidden bridges
    // must stop, while their muted source streams remain eligible for the new owner.
    adoptAudioBridgeSourcesForSession();
  }
  if (canMutateSession && !inCall && !identityAwaitingRerender) retireOwnedAudioBridges();
  if (canMutateSession && (identityVerifiedBeforeCall || identityPreservedInCall)) {
    window.__openclawZoomMeeting = {
      ...(priorMeeting?.identity === expectedIdentity && !meetingOwnerConflict ? priorMeeting : {}),
      identity: expectedIdentity,
      sessionId: sessionId || priorMeeting?.sessionId,
      verifiedAt: Date.now(),
      awaitingAdmission: !inCall && lobbyWaiting,
      devicesDisabled,
      ...(inCall ? { inCallControl: leave, inCallControlLostAt: undefined, inCallUrl: location.href } : {}),
    };
  } else if (
    canMutateSession &&
    !currentIdentity &&
    priorMeeting &&
    !identityAwaitingRerender &&
    (
      priorMeeting.inCallControl ||
      (priorMeeting.awaitingAdmission !== true && markerAgeMs >= identityRetentionMs)
    )
  ) {
    delete window.__openclawZoomMeeting;
  }
  const microphone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
  let microphoneState = identityVerified ? (toggleState(microphone, "microphone") || (devicesDisabled ? "off" : undefined)) : undefined;
  const refreshMicrophoneState = async () => {
    await waitForUi();
    const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
    microphoneState = toggleState(currentMicrophone, "microphone");
  };
  const camera = first(selectors.camera) || findTextButton(/camera|video/i);
  let cameraState = identityVerified ? (toggleState(camera, "camera") || (devicesDisabled ? "off" : undefined)) : undefined;
  let controlManualAction;
  const passcodeInput = firstRaw(selectors.passcode);
  const passcodeRequired = Boolean(passcodeInput) &&
    /meeting passcode|enter (?:the )?passcode|invalid passcode|incorrect passcode/i.test(
      pageText + " " + label(passcodeInput)
    );
  const captchaRequired = Boolean(firstRaw(selectors.captcha)) ||
    /complete (?:the )?captcha|security check|verify (?:that )?you(?:'re| are) (?:a )?human/i.test(pageTextLower);
  if (identityVerified && !inCall && passcodeRequired) {
    controlManualAction = manualActionFor("zoom-passcode-required", "Enter the Zoom meeting passcode in the OpenClaw browser profile, then retry joining.");
  } else if (identityVerified && !inCall && captchaRequired) {
    controlManualAction = manualActionFor("zoom-captcha-required", "Complete Zoom's security check in the OpenClaw browser profile, then retry joining.");
  }

  if (
    canMutateSession &&
    identityVerified &&
    camera &&
    cameraState === "on" &&
    !controlManualAction
  ) {
    camera.click();
    await waitForUi();
    const continueWithoutCamera = findTextControl(/\\bcontinue without camera\\b/i);
    if (continueWithoutCamera) {
      clickable(continueWithoutCamera)?.click?.();
      await waitForUi();
    }
    const currentCamera = first(selectors.camera) || findTextButton(/camera|video/i);
    cameraState = toggleState(currentCamera, "camera");
    if (cameraState === "off") {
      notes.push(inCall ? "Turned the Zoom camera off after admission." : "Turned the Zoom camera off before joining.");
    }
  }
  const join = first(selectors.join) ||
    findTextButton(/^\\s*(join|join now|ask to join|join meeting)\\s*$/i);
  if (
    identityVerified &&
    (inCall || join) &&
    cameraState !== "off" &&
    !controlManualAction
  ) {
    controlManualAction = manualActionFor("zoom-camera-required", inCall ? "Turn the Zoom camera off and verify the in-call camera control shows it is off." : "Turn the Zoom camera off and verify the camera control shows it is off, then retry joining.");
  }
${sources.virtualAudioInput({
		beforeEnumerationSource: `    const preparedInput = window.__openclawZoomMeeting;
    if (preparedInput?.identity === expectedIdentity && (!sessionId || preparedInput?.sessionId === sessionId)) {
      delete preparedInput.audioInputDeviceId;
    }
`,
		selectionSource: `      let selected = Boolean(selectedMicrophoneLabel());`
	})}
${sources.prejoinMicrophone({
		unroutedSource: `      notes.push("The virtual audio input will be selected from Zoom's in-call audio controls.");`,
		muteInCall: true
	})}
${sources.inCallMicrophone}
  if (
    identityVerified &&
    (inCall || join) &&
    !allowMicrophone &&
    microphoneState !== "off" &&
    !controlManualAction
  ) {
    controlManualAction = manualActionFor("zoom-microphone-required", inCall ? "Mute the Zoom microphone and verify it stays muted for observe-only mode." : "Mute the Zoom microphone and verify the microphone control shows it is off, then retry joining.");
  }`,
	manualActionSource: (sources) => `  const signInControl = first(selectors.signIn);
  const tenantLoginRequired =
    /authorized attendees only|meeting is for authorized attendees|sign in to join|verify your email|enter the code sent to/i.test(pageTextLower);
  const loginRequired = tenantLoginRequired ||
    (Boolean(signInControl) && !guestInput && !join && /sign in to (?:join|continue)|sign in to your account/i.test(pageTextLower));
${sources.manualActions({ inCallControls: true })}`,
	setupSource: `const topDocument = globalThis.document;
  const document = topDocument.querySelector("#webclient")?.contentDocument || topDocument;
  const pageWindow = document.defaultView || globalThis;
  const HTMLInputElement = pageWindow.HTMLInputElement || globalThis.HTMLInputElement;
  const Event = pageWindow.Event || globalThis.Event;
  const MutationObserver = pageWindow.MutationObserver || globalThis.MutationObserver;`
};
//#endregion
//#region extensions/zoom-meetings/src/transports/zoom-meetings-urls.ts
function isZoomHostname(hostname) {
	return hostname === "zoom.us" || hostname.endsWith(".zoom.us");
}
function parseZoomMeetingIdentity(url) {
	if (!url) return;
	const parsed = URL.parse(url);
	if (!parsed || parsed.protocol !== "https:" || parsed.port || parsed.username || parsed.password || !isZoomHostname(parsed.hostname.toLowerCase())) return;
	const invitation = parsed.pathname.match(/^\/j\/(\d{9,11})\/?$/);
	const webClient = parsed.hostname.toLowerCase() === "app.zoom.us" ? parsed.pathname.match(/^\/wc\/(\d{9,11})\/join\/?$/) : void 0;
	const meetingId = invitation?.[1] ?? webClient?.[1];
	return meetingId ? {
		kind: invitation ? "invitation" : "web-client",
		meetingId,
		passcode: parsed.searchParams.get("pwd") || void 0
	} : void 0;
}
function normalizeZoomMeetingUrl(input) {
	if (typeof input !== "string" || !input.trim()) throw new Error("Zoom meeting URL is required");
	const value = input.trim();
	if (!parseZoomMeetingIdentity(value)) throw new Error("Zoom meeting URL must use https://<account>.zoom.us/j/<meeting-id>");
	const parsed = new URL(value);
	parsed.hash = "";
	return parsed.toString();
}
function normalizeZoomMeetingUrlForReuse(url) {
	const identity = parseZoomMeetingIdentity(url);
	return identity ? `zoom:${identity.meetingId}` : void 0;
}
function isSameZoomMeetingUrl(left, right) {
	const normalizedLeft = normalizeZoomMeetingUrlForReuse(left);
	const normalizedRight = normalizeZoomMeetingUrlForReuse(right);
	return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
}
function hasSameZoomMeetingJoinCredential(left, right) {
	const leftIdentity = parseZoomMeetingIdentity(left);
	const rightIdentity = parseZoomMeetingIdentity(right);
	return Boolean(leftIdentity && rightIdentity && leftIdentity.meetingId === rightIdentity.meetingId && leftIdentity.passcode === rightIdentity.passcode);
}
function isRecoverableZoomMeetingTab(tab, url) {
	if (url) {
		const tabIdentity = parseZoomMeetingIdentity(tab.url);
		const requestedIdentity = parseZoomMeetingIdentity(url);
		if (!tabIdentity || !requestedIdentity || tabIdentity.meetingId !== requestedIdentity.meetingId) return false;
		return tabIdentity.kind !== "invitation" || requestedIdentity.kind !== "invitation" ? true : tabIdentity.passcode === requestedIdentity.passcode;
	}
	if (normalizeZoomMeetingUrlForReuse(tab.url)) return true;
	const hostname = URL.parse(tab.url ?? "")?.hostname.toLowerCase();
	return Boolean(hostname && isZoomHostname(hostname) && /sign in|verification|zoom/i.test(tab.title ?? ""));
}
//#endregion
//#region extensions/zoom-meetings/src/transports/zoom-meetings-page-scripts.ts
function pageIdentityFunctionSource() {
	return `const meetingIdentity = (rawUrl) => {
    try {
      const parsed = new URL(rawUrl);
      const host = parsed.hostname.toLowerCase();
      if (
        parsed.protocol !== "https:" ||
        !(host === "zoom.us" || host.endsWith(".zoom.us"))
      ) return undefined;
      const invitation = parsed.pathname.match(/^\\/j\\/(\\d{9,11})\\/?$/);
      const webClient = parsed.pathname.match(/^\\/wc\\/(\\d{9,11})\\/join\\/?$/);
      const meetingId = invitation?.[1] || webClient?.[1];
      return meetingId ? "zoom:" + meetingId : undefined;
    } catch {}
    return undefined;
  };`;
}
function zoomMeetingToggleStateFunctionSource() {
	return `(input) => {
    const pressed = String(input?.ariaPressed || "").toLowerCase();
    if (pressed === "true") return "on";
    if (pressed === "false") return "off";
    const checked = String(input?.ariaChecked ?? input?.checked ?? "").toLowerCase();
    if (checked === "true") return "on";
    if (checked === "false") return "off";
    const iconClass = String(input?.iconClass || "");
    if (input?.kind === "camera" && /videooff/i.test(iconClass)) return "off";
    if (input?.kind === "camera" && /videoon/i.test(iconClass)) return "on";
    const value = String(input?.label || "").toLowerCase().replace(/\\s+/g, " ").trim();
    if (!value) return undefined;
    if (input?.kind === "camera") {
      if (/\\bturn (?:your )?camera off\\b|\\bturn off (?:your )?camera\\b|\\bstop video\\b|\\bdisable (?:your )?(?:camera|video)\\b/.test(value)) return "on";
      if (/\\bturn (?:your )?camera on\\b|\\bturn on (?:your )?camera\\b|\\bstart video\\b|\\benable (?:your )?(?:camera|video)\\b/.test(value)) return "off";
      if (/\\b(?:camera|video) (?:is |currently )?(?:off|disabled)\\b/.test(value)) return "off";
      if (/\\b(?:camera|video) (?:is |currently )?(?:on|enabled)\\b/.test(value)) return "on";
      return undefined;
    }
    if (/^mute(?: mute)?$|\\bturn (?:your |my )?(?:microphone|mic) off\\b|\\bturn off (?:your |my )?(?:microphone|mic)\\b|\\bmute (?:your |my )?(?:microphone|mic)\\b|\\bdisable (?:your |my )?(?:microphone|mic)\\b/.test(value)) return "on";
    if (/^unmute(?: unmute)?$|\\bturn (?:your |my )?(?:microphone|mic) on\\b|\\bturn on (?:your |my )?(?:microphone|mic)\\b|\\bunmute (?:your |my )?(?:microphone|mic)\\b|\\benable (?:your |my )?(?:microphone|mic)\\b/.test(value)) return "off";
    if (/\\b(?:microphone|mic) (?:is |currently )?(?:off|muted|disabled)\\b/.test(value)) return "off";
    if (/\\b(?:microphone|mic) (?:is |currently )?(?:on|unmuted|enabled)\\b/.test(value)) return "on";
    return undefined;
  }`;
}
const zoomMeetingPageScripts = MeetingPlatformAdapter.createPageScripts({
	platform: {
		audioOutputElementIdPrefix: "openclaw-zoom-audio-output-",
		manualActionReasonPrefix: "zoom",
		displayName: "Zoom",
		globals: {
			audioOutputs: "__openclawZoomAudioOutputs",
			captionArchive: "__openclawZoomCaptionArchive",
			captions: "__openclawZoomCaptions",
			meeting: "__openclawZoomMeeting"
		}
	},
	normalizeUrl: normalizeZoomMeetingUrlForReuse,
	pageIdentitySource: pageIdentityFunctionSource,
	selectors: ZOOM_MEETING_SELECTORS,
	toggleStateFunction: zoomMeetingToggleStateFunctionSource,
	statusPrelude: zoomMeetingStatusPrelude,
	statusCall: zoomMeetingStatusCall,
	leave: {
		controlSource: `const first = (list) => {
    for (const selector of list) {
      const node = document.querySelector(selector);
      if (!node) continue;
      return node.matches?.("button") ? node : node.querySelector?.("button") || node.closest?.("button") || node;
    }
    return undefined;
  };
  const text = (node) => (node?.innerText || node?.textContent || "").trim();
  const findTextButton = (pattern) => [...document.querySelectorAll("button")]
    .find((button) => !button.disabled && pattern.test(text(button)));
  const leave = first(selectors.leave);
  const confirmation = first(selectors.leaveConfirmation) ||
    findTextButton(/^leave meeting$/i);
  const postCall = !leave && (
    first(selectors.postCall) ||
    [...document.querySelectorAll(".zm-modal-body-title")]
      .find((node) => /meeting has been ended by host|you left the meeting|meeting has ended/i.test(text(node)))
  );
  const currentUrlMatches = Boolean(expectedIdentity && currentIdentity === expectedIdentity);
  let webClientHome = false;
  try {
    const currentUrl = new URL(location.href);
    webClientHome = !leave && currentUrl.hostname === "app.zoom.us" && /^\\/wc\\/?$/.test(currentUrl.pathname);
  } catch {}`,
		departedMarkerSource: "(postCall || webClientHome)",
		documentSetupSource: `const topDocument = globalThis.document;
  const document = topDocument.querySelector("#webclient")?.contentDocument || topDocument;`,
		meetingStateSource: "sessionId: expectedSessionId || state?.sessionId,",
		sessionMatchSource: `const sessionAdoptedFromUrl = Boolean(
    enforceSessionOwnership &&
    !state?.sessionId &&
    currentIdentity === expectedIdentity &&
    (!state?.identity || state.identity === expectedIdentity)
  );
  const sessionMatched = !enforceSessionOwnership ||
    state?.sessionId === expectedSessionId ||
    sessionAdoptedFromUrl;`
	}
});
//#endregion
//#region extensions/zoom-meetings/src/transports/zoom-meetings-platform-adapter.ts
function zoomMeetingOrigin(meetingUrl) {
	return normalizeZoomMeetingUrlForReuse(meetingUrl) ? "https://app.zoom.us" : void 0;
}
const ZOOM_MEETINGS_PLATFORM_ADAPTER = MeetingPlatformAdapter.create({
	id: "zoom-meetings",
	displayName: "Zoom meetings",
	browserLabel: "Zoom meeting",
	logScope: "[zoom-meetings]",
	agentConsult: {
		surface: "a private Zoom meeting",
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
		idPrefix: "zoom_meeting",
		participantIdentity: (transport) => transport === "chrome-node" ? "Zoom guest in Chrome on a paired node" : "Zoom guest in the OpenClaw Chrome profile"
	},
	nodeCommandName: "zoommeetings.chrome",
	nodeConfigPath: "plugins.entries.zoom-meetings.config.chromeNode.node",
	urls: {
		validateAndNormalize: normalizeZoomMeetingUrl,
		normalizeForReuse: normalizeZoomMeetingUrlForReuse,
		isSameMeeting: isSameZoomMeetingUrl,
		buildJoinUrl: (session) => session.url,
		accountHint: () => void 0,
		isPreferredJoinUrl: (url) => Boolean(normalizeZoomMeetingUrlForReuse(url)),
		isRecoverableTab: isRecoverableZoomMeetingTab,
		localeAction: () => void 0
	},
	...MeetingPlatformAdapter.createBrowserAdapterOptions({
		displayName: "Zoom",
		manualActionReasonPrefix: "zoom",
		admissionReasons: ["zoom-passcode-required", "zoom-captcha-required"],
		retryCaptions: true,
		unavailableMessage: "Open the OpenClaw browser profile, finish the Zoom sign-in, admission, or permission prompt, then retry.",
		origin: zoomMeetingOrigin,
		scripts: zoomMeetingPageScripts,
		statusFields: (parsed) => ({ meetingEnded: typeof parsed.meetingEnded === "boolean" ? parsed.meetingEnded : void 0 })
	})
});
//#endregion
//#region extensions/zoom-meetings/index.ts
const zoomMeetingsPlugin = MeetingPlatformAdapter.defineBrowserMeetingPlugin({
	platform: ZOOM_MEETINGS_PLATFORM_ADAPTER,
	labels: {
		meeting: "Zoom meeting",
		participant: "Zoom guest",
		brand: "Zoom",
		microphone: "Zoom",
		browserPage: "Zoom"
	},
	config: {
		defaultRealtimeInstructions: `You are joining a private Zoom meeting as an OpenClaw voice transport. Keep spoken replies brief and natural. In agent mode, wait for OpenClaw consult results and speak them exactly. In bidi mode, answer directly and call ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} for deeper reasoning, current information, or tools.`,
		resolveGatewayOperationTimeoutMs: (config) => Math.max(6e4, addTimerTimeoutGraceMs(config.chrome.joinTimeoutMs, config.chrome.waitForInCallMs + config.chrome.joinTimeoutMs + 3e4) ?? 1)
	},
	InvalidRequestError: ZoomMeetingsInvalidRequestError,
	toolUrlDescription: "Zoom meeting URL",
	transcriptSource: {
		id: "zoom",
		aliases: ["zoom-meetings"],
		providerName: "Zoom"
	},
	hooks: {
		normalizeJoinRequest: (request, context) => {
			const resolved = context.resolvedJoin(request);
			return {
				...request,
				agentId: resolved.agentId,
				url: resolved.url
			};
		},
		isAwaitingAdmission: (session) => session.chrome?.health?.lobbyWaiting === true || session.chrome?.health?.manualAction?.reason === "zoom-admission-required",
		afterStatusRefresh: async (session, context) => {
			const confirmedTabMissing = session.chrome?.health?.status === "browser-tab-missing";
			if (session.state === "active" && confirmedTabMissing) {
				session.browserLeft = true;
				await context.endSession(session.id, { keepBrowserTab: true });
			} else if (session.state === "active" && session.chrome?.health?.meetingEnded === true) await context.endSession(session.id);
		},
		refreshReusableSession: async (session, request, context) => {
			await context.refreshBrowserHealth(session, {
				force: true,
				readOnly: false
			});
			const browser = session.chrome;
			const health = browser?.health;
			const staleSession = !browser?.browserTab || health?.meetingEnded === true || health?.manualAction?.reason === "zoom-session-conflict" || health?.manualAction?.reason === "browser-control-unavailable" || health?.bridgeClosed === true;
			const replacePendingJoin = health?.inCall !== true && health?.manualAction?.reason === "zoom-passcode-required" && !hasSameZoomMeetingJoinCredential(session.url, request.url);
			if (!staleSession && !replacePendingJoin) return;
			session.state = "ended";
			session.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
			context.noteSession(session, replacePendingJoin ? "Ended pending Zoom session after receiving a corrected meeting credential." : "Ended stale Zoom session before opening a replacement.");
			context.deleteRequesterSessionKey(session.id);
			return { keepBrowserTab: !replacePendingJoin && health?.meetingEnded !== true && health?.bridgeClosed !== true };
		},
		isAudioBridgeActive: (session) => Boolean(session.chrome?.audioBridge && session.chrome.health?.bridgeClosed !== true),
		afterAudioBridgeAttached: (session) => {
			if (session.chrome) session.chrome.health = {
				...session.chrome.health,
				bridgeClosed: false
			};
		},
		validateLaunchResult: (result) => {
			if (result.browser?.meetingEnded === true) throw new Error("The Zoom meeting has already ended.");
		},
		recordBrowserRecoveryFailure: (session, failure) => {
			if (!session.chrome) return;
			if (failure.kind === "missing") {
				session.chrome.browserTab = void 0;
				session.browserLeft = true;
			}
			session.chrome.health = {
				...session.chrome.health,
				inCall: false,
				micMuted: void 0,
				captioning: false,
				audioInputRouted: false,
				audioOutputRouted: false,
				manualAction: {
					reason: "browser-control-unavailable",
					message: failure.message
				},
				status: failure.kind === "missing" ? "browser-tab-missing" : "browser-control",
				notes: [...(session.chrome.health?.notes ?? []).filter((note) => note !== failure.message), failure.message]
			};
			session.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
		}
	},
	browserReadinessFailed: (error) => `Zoom browser readiness refresh failed: ${error}`,
	microphoneMutedReason: "zoom-microphone-muted",
	setup: {
		captionsMessage: (mode) => mode === "transcribe" ? "Zoom live-caption capture is enabled and ready" : "Caption scraping is not used by talk-back modes",
		connectedNodeMessage: (node) => `Connected Zoom meeting node ready: ${node}`,
		guestJoinCheck: (config) => {
			const ok = Boolean(config.chrome.guestName && config.chrome.autoJoin && (config.chrome.launch || config.chrome.reuseExistingTab));
			return {
				ok,
				message: ok ? "Guest name, auto-join, and a Chrome launch or reuse path are configured" : "Set chrome.guestName, chrome.autoJoin, and either chrome.launch or chrome.reuseExistingTab for unattended guest joins"
			};
		},
		missingNodeIdMessage: "Connected Zoom meetings node did not include a node id."
	},
	defaultSpeechMessage: "Say exactly: Zoom speech test complete.",
	shouldWaitForListening: (session) => Boolean(session.chrome?.browserTab?.targetId),
	sharePrerequisiteDeadline: true,
	preserveTrackedBrowserOnEngineFailure: true,
	nodePolicyDeniedCode: "ZOOM_MEETINGS_NODE_POLICY_DENIED",
	cli: {
		descriptor: ZOOM_MEETINGS_CLI_METADATA.descriptor,
		joinDescription: "join a Zoom meeting as a guest"
	}
});
var zoom_meetings_default = zoomMeetingsPlugin.plugin;
//#endregion
export { zoom_meetings_default as default, zoomMeetingsPlugin };
