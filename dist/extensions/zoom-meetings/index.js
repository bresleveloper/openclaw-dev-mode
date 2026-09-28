import { t as ZOOM_MEETINGS_CLI_METADATA } from "./.setup/cli-output-mode-DPg56N1-.mjs";
import { n as zoomMeetingsInvalidRequest, r as zoomMeetingsConfig, t as ZoomMeetingsInvalidRequestError } from "./.setup/errors-DcrAT0wd.mjs";
import { MeetingPlatformAdapter } from "openclaw/plugin-sdk/meeting-runtime";
import { normalizeAgentId } from "openclaw/plugin-sdk/routing";
import { Type } from "typebox";
import { createMeetingBrowserAudioCaptureSource, createMeetingLeaveSource, createMeetingTranscriptSource } from "openclaw/plugin-sdk/meeting-page-script-runtime";
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
function zoomMeetingStatusCallSource() {
	return MeetingPlatformAdapter.createStatusCallSource({
		platform: {
			audioOutputElementIdPrefix: "openclaw-zoom-audio-output-",
			displayName: "Zoom",
			globals: {
				audioOutputs: "__openclawZoomAudioOutputs",
				captions: "__openclawZoomCaptions",
				meeting: "__openclawZoomMeeting"
			},
			manualActionReasonPrefix: "zoom"
		},
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
	});
}
//#endregion
//#region extensions/zoom-meetings/src/transports/zoom-meetings-status-access-source.ts
function zoomMeetingStatusAccessSource() {
	return `  const passcodeInput = firstRaw(selectors.passcode);
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
`;
}
//#endregion
//#region extensions/zoom-meetings/src/transports/zoom-meetings-status-page-source.ts
function zoomMeetingStatusPageSource() {
	return `  const pageText = text(document.body);
  const pageTextLower = pageText.toLowerCase();
  const lobbyWaiting = Boolean(first(selectors.lobby)) ||
    /host will let you in soon|waiting for the host to start|someone will let you in shortly|waiting for someone to let you in|when someone admits you|you.?re in the lobby|we.?ve let people in the meeting know you.?re waiting/i.test(pageTextLower);
`;
}
//#endregion
//#region extensions/zoom-meetings/src/transports/zoom-meetings-status-prejoin-source.ts
function zoomMeetingStatusPreludeSource(params) {
	return MeetingPlatformAdapter.createStatusPreludeSource(params, {
		controlLookupSource: `const findTextButton = (pattern) => [...document.querySelectorAll("button")]
    .find((button) => !button.disabled && pattern.test(label(button)));
  const findTextControl = (pattern) =>
    [...document.querySelectorAll('button, a, [role="button"]')]
      .find((control) => !control.disabled && pattern.test(label(control)));`,
		lifecycleSource: `  const continueInBrowser = first(selectors.continueInBrowser) ||
    findTextButton(/join from browser|continue on this browser|join on the web|use the web app|continue without the app/i);
  if (canMutateSession && identityVerifiedBeforeCall && continueInBrowser) {
    continueInBrowser.click();
    notes.push("Continued to the Zoom web client.");
    await waitForUi();
  }
  const guestInput = first(selectors.guestName) || [...document.querySelectorAll("input")].find((input) =>
    /enter your name|type your name|your name|display name/i.test(label(input) + " " + (input.placeholder || ""))
  );
  if (canMutateSession && identityVerifiedBeforeCall && autoJoin && guestInput && guestInput.value !== ${JSON.stringify(params.guestName)}) {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    guestInput.focus();
    if (setter) setter.call(guestInput, ${JSON.stringify(params.guestName)});
    else guestInput.value = ${JSON.stringify(params.guestName)};
    guestInput.dispatchEvent(new Event("input", { bubbles: true }));
    guestInput.dispatchEvent(new Event("change", { bubbles: true }));
  }
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
  ${zoomMeetingStatusPageSource()}
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
  const identityPreservedInCall = Boolean(
    !currentIdentity &&
    priorMeeting?.identity === expectedIdentity &&
    leave &&
    leave.isConnected !== false &&
    (
      identityAdoptedInCall ||
      identityRerenderedInCall ||
      (
        priorMeeting?.inCallControl === leave &&
        priorMeeting?.inCallUrl === location.href
      )
    )
  );
  const identityVerified = identityVerifiedBeforeCall || identityPreservedInCall;
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
  const camera = first(selectors.camera) || findTextButton(/camera|video/i);
  let cameraState = identityVerified ? (toggleState(camera, "camera") || (devicesDisabled ? "off" : undefined)) : undefined;
  let controlManualAction;
  ${zoomMeetingStatusAccessSource()}
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
  const { isVirtualAudioDevice, isVirtualAudioDeviceNode, microphoneDeviceRoots, selectedMicrophoneLabel } = meetingAudioInput;
  let audioInputRouted;
  let audioInputDeviceLabel;
  let audioInputRouteError;
  const ensureVirtualAudioInput = async () => {
    const preparedInput = window.__openclawZoomMeeting;
    if (preparedInput?.identity === expectedIdentity && (!sessionId || preparedInput?.sessionId === sessionId)) {
      delete preparedInput.audioInputDeviceId;
    }
    if (!navigator.mediaDevices?.enumerateDevices) return false;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const input = devices.find(
        (device) => device.kind === "audioinput" && isVirtualAudioDevice(device.label)
      );
      if (!input?.deviceId) return false;
      audioInputDeviceLabel = input.label || "Virtual audio device";
      // Zoom hides the selected-device control after admission. Reopen the in-call audio
      // options and verify the current selection before unmuting; installed devices alone
      // do not prove which microphone Zoom is using.
      let selected = Boolean(selectedMicrophoneLabel());
      if (!selected && canMutateSession) {
        const settings = first(selectors.deviceSettings);
        if (settings) {
          settings.click();
          await waitForUi();
        }
        const { control } = microphoneDeviceRoots();
        if (control?.tagName?.toLowerCase() === "select") {
          const options = [...control.options];
          const option = options.find(isVirtualAudioDeviceNode);
          if (option) {
            control.value = option.value;
            control.dispatchEvent(new Event("change", { bubbles: true }));
            await waitForUi();
          }
        } else if (control) {
          clickable(control)?.click?.();
          await waitForUi();
        }
        const choices = microphoneDeviceRoots().roots.flatMap((root) =>
          selectors.audioDeviceOptions.flatMap((selector) => [
            ...(root.querySelectorAll?.(selector) || []),
          ])
        );
        const choice = choices.find(isVirtualAudioDeviceNode);
        if (choice && choice.getAttribute?.("aria-selected") !== "true") {
          clickable(choice)?.click?.();
          await waitForUi();
        }
        selected = Boolean(selectedMicrophoneLabel());
      }
      return selected;
    } catch (error) {
      audioInputRouteError = error?.message || String(error);
      return false;
    }
  };
  if (identityVerified && !inCall && allowMicrophone && microphone) {
    audioInputRouted = await ensureVirtualAudioInput();
    if (!audioInputRouted) {
      if (canMutateSession && microphoneState === "on") {
        microphone.click();
        await waitForUi();
        const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
        microphoneState = toggleState(currentMicrophone, "microphone");
      }
      notes.push("The virtual audio input will be selected from Zoom's in-call audio controls.");
    } else if (canMutateSession && microphoneState === "off") {
      microphone.click();
      await waitForUi();
      const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
      microphoneState = toggleState(currentMicrophone, "microphone");
      if (microphoneState === "on") {
        notes.push("Unmuted the Zoom microphone after verifying the virtual audio input.");
      }
    }
  } else if (canMutateSession && identityVerified && !allowMicrophone && microphoneState === "on") {
      microphone.click();
      await waitForUi();
      const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
      microphoneState = toggleState(currentMicrophone, "microphone");
      if (microphoneState === "off") {
        notes.push("Muted the Zoom microphone for observe-only mode.");
      }
  }
  if (identityVerified && inCall && allowMicrophone) {
    if (!selectedMicrophoneLabel() && canMutateSession && microphoneState === "on") {
      microphone?.click();
      await waitForUi();
      const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
      microphoneState = toggleState(currentMicrophone, "microphone");
    }
    audioInputRouted = await ensureVirtualAudioInput();
    if (audioInputRouted && canMutateSession && microphoneState === "off") {
      microphone?.click();
      await waitForUi();
      const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
      microphoneState = toggleState(currentMicrophone, "microphone");
    } else if (!audioInputRouted && canMutateSession && microphoneState === "on") {
      microphone?.click();
      await waitForUi();
      const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
      microphoneState = toggleState(currentMicrophone, "microphone");
      if (microphoneState === "off") {
        notes.push("Muted the Zoom microphone because the virtual audio input could not be reverified.");
      }
    }
  }
  if (
    identityVerified &&
    (inCall || join) &&
    !allowMicrophone &&
    microphoneState !== "off" &&
    !controlManualAction
  ) {
    controlManualAction = manualActionFor("zoom-microphone-required", inCall ? "Mute the Zoom microphone and verify it stays muted for observe-only mode." : "Mute the Zoom microphone and verify the microphone control shows it is off, then retry joining.");
  }`,
		manualActionSource: `  const signInControl = first(selectors.signIn);
  const tenantLoginRequired =
    /authorized attendees only|meeting is for authorized attendees|sign in to join|verify your email|enter the code sent to/i.test(pageTextLower);
  const loginRequired = tenantLoginRequired ||
    (Boolean(signInControl) && !guestInput && !join && /sign in to (?:join|continue)|sign in to your account/i.test(pageTextLower));
  let microphonePermissionState;
  if (allowMicrophone && navigator.permissions?.query) {
    try {
      microphonePermissionState = (await navigator.permissions.query({ name: "microphone" })).state;
    } catch {}
  }
  const devicePermissionPrompt = !dismissedDevicePrompt && Boolean(
    first(selectors.permissionPrompt) || continueWithoutDevices
  );
  // Zoom shows the same no-audio/video warning when only camera access is denied.
  // A granted microphone plus the verified virtual audio input is sufficient for talk-back.
  const permissionRequired = devicePermissionPrompt &&
    (!allowMicrophone || microphonePermissionState !== "granted");
  let manualAction;
  if (committedOwnerConflict && !canMutateSession) {
    manualAction = manualActionFor("zoom-session-conflict", "This Zoom tab is owned by another active meeting session.");
  } else if (!inCall && loginRequired) {
    manualAction = manualActionFor("zoom-login-required", tenantLoginRequired ? "This Zoom tenant requires sign-in or email verification. Complete it in the OpenClaw browser profile, then retry." : "Sign in to Zoom in the OpenClaw browser profile, then retry the meeting join.");
  } else if (!inCall && lobbyWaiting) {
    manualAction = manualActionFor("zoom-admission-required", "Admit the OpenClaw guest from the Zoom lobby, then retry speech.");
  } else if (!inCall && permissionRequired) {
    manualAction = manualActionFor("zoom-permission-required", allowMicrophone ? "Allow microphone permission for Zoom in the OpenClaw browser profile, then retry." : "Dismiss the Zoom device-permission prompt or continue without devices, then retry.");
  } else if (controlManualAction) {
    manualAction = controlManualAction;
  }
  let clickedJoin = false;
  if (canMutateSession && identityVerified && autoJoin && !inCall && join && !join.disabled && !manualAction) {
    join.click();
    clickedJoin = true;
    notes.push("Clicked the Zoom guest join button.");
  }`,
		platform: {
			displayName: "Zoom",
			globals: {
				audioOutputs: "__openclawZoomAudioOutputs",
				captionArchive: "__openclawZoomCaptionArchive",
				captions: "__openclawZoomCaptions",
				meeting: "__openclawZoomMeeting"
			},
			manualActionReasonPrefix: "zoom"
		},
		setupSource: `const topDocument = globalThis.document;
  const document = topDocument.querySelector("#webclient")?.contentDocument || topDocument;
  const pageWindow = document.defaultView || globalThis;
  const HTMLInputElement = pageWindow.HTMLInputElement || globalThis.HTMLInputElement;
  const Event = pageWindow.Event || globalThis.Event;
  const MutationObserver = pageWindow.MutationObserver || globalThis.MutationObserver;`
	});
}
//#endregion
//#region extensions/zoom-meetings/src/transports/zoom-meetings-urls.ts
function isZoomHostname(hostname) {
	return hostname === "zoom.us" || hostname.endsWith(".zoom.us");
}
function parseZoomMeetingIdentity(url) {
	if (!url) return;
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "https:" || parsed.port || parsed.username || parsed.password || !isZoomHostname(parsed.hostname.toLowerCase())) return;
		const invitation = parsed.pathname.match(/^\/j\/(\d{9,11})\/?$/);
		const webClient = parsed.hostname.toLowerCase() === "app.zoom.us" ? parsed.pathname.match(/^\/wc\/(\d{9,11})\/join\/?$/) : void 0;
		const meetingId = invitation?.[1] ?? webClient?.[1];
		return meetingId ? {
			kind: invitation ? "invitation" : "web-client",
			meetingId,
			passcode: parsed.searchParams.get("pwd") || void 0
		} : void 0;
	} catch {
		return;
	}
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
	try {
		return isZoomHostname(new URL(tab.url ?? "").hostname.toLowerCase()) && /sign in|verification|zoom/i.test(tab.title ?? "");
	} catch {
		return false;
	}
}
//#endregion
//#region extensions/zoom-meetings/src/transports/zoom-meetings-page-scripts.ts
function zoomMeetingAudioCaptureScript(params) {
	return createMeetingBrowserAudioCaptureSource({
		...params,
		audioOutputsGlobal: "__openclawZoomAudioOutputs",
		ownershipSource: `
      ${pageIdentityFunctionSource()}
      const expectedIdentity = ${JSON.stringify(normalizeZoomMeetingUrlForReuse(params.meetingUrl))};
      const state = window.__openclawZoomMeeting;
      return Boolean(expectedIdentity && state?.sessionId === sessionId &&
        state.identity === expectedIdentity && !state.leavePending &&
        (meetingIdentity(location.href) === expectedIdentity ||
          (state.inCallUrl === location.href && state.inCallControl?.isConnected)));
    `
	});
}
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
function zoomMeetingStatusScript(params) {
	const selectors = JSON.stringify(ZOOM_MEETING_SELECTORS);
	const expectedIdentity = normalizeZoomMeetingUrlForReuse(params.meetingUrl);
	const toggleStateFunction = zoomMeetingToggleStateFunctionSource();
	return zoomMeetingStatusPreludeSource({
		...params,
		expectedIdentity,
		pageIdentitySource: pageIdentityFunctionSource(),
		selectors,
		toggleStateFunction
	}) + zoomMeetingStatusCallSource();
}
function zoomMeetingTranscriptScript(meetingUrl, meetingSessionId, finalize) {
	const expectedIdentity = normalizeZoomMeetingUrlForReuse(meetingUrl);
	return createMeetingTranscriptSource({
		expectedIdentity,
		finalize,
		globals: {
			captionArchive: "__openclawZoomCaptionArchive",
			captions: "__openclawZoomCaptions",
			meeting: "__openclawZoomMeeting"
		},
		meetingSessionId,
		pageIdentitySource: pageIdentityFunctionSource(),
		platformDisplayName: "Zoom"
	});
}
function zoomMeetingLeaveScript(params) {
	const selectors = JSON.stringify(ZOOM_MEETING_SELECTORS);
	const expectedIdentity = normalizeZoomMeetingUrlForReuse(params.meetingUrl);
	return createMeetingLeaveSource({
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
		expectedIdentity,
		leaveInitiated: params.leaveInitiated,
		meetingSessionId: params.meetingSessionId,
		meetingStateSource: "sessionId: expectedSessionId || state?.sessionId,",
		pageIdentitySource: pageIdentityFunctionSource(),
		platform: {
			displayName: "Zoom",
			globals: {
				audioOutputs: "__openclawZoomAudioOutputs",
				meeting: "__openclawZoomMeeting"
			}
		},
		selectors,
		sessionMatchSource: `const sessionAdoptedFromUrl = Boolean(
    enforceSessionOwnership &&
    !state?.sessionId &&
    currentIdentity === expectedIdentity &&
    (!state?.identity || state.identity === expectedIdentity)
  );
  const sessionMatched = !enforceSessionOwnership ||
    state?.sessionId === expectedSessionId ||
    sessionAdoptedFromUrl;`
	});
}
//#endregion
//#region extensions/zoom-meetings/src/transports/zoom-meetings-platform-constants.ts
const ZOOM_MEETINGS_NODE_COMMAND = "zoommeetings.chrome";
const ZOOM_MEETINGS_BROWSER_NODE_ADAPTER = {
	displayName: "Zoom meetings",
	nodeCommandName: ZOOM_MEETINGS_NODE_COMMAND,
	nodeConfigPath: "plugins.entries.zoom-meetings.config.chromeNode.node"
};
//#endregion
//#region extensions/zoom-meetings/src/transports/zoom-meetings-platform-adapter.ts
function zoomMeetingOrigin(meetingUrl) {
	return normalizeZoomMeetingUrlForReuse(meetingUrl) ? "https://app.zoom.us" : void 0;
}
function classifyManualActionReason(reason) {
	switch (reason) {
		case "zoom-login-required": return "login-required";
		case "zoom-admission-required":
		case "zoom-passcode-required":
		case "zoom-captcha-required": return "admission-required";
		case "zoom-permission-required": return "permission-required";
		case "zoom-audio-choice-required": return "audio-choice-required";
		case "zoom-session-conflict": return "session-conflict";
		case "browser-control-unavailable": return "browser-control-unavailable";
		default: return "custom";
	}
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
	nodeCommandName: ZOOM_MEETINGS_NODE_COMMAND,
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
	browser: {
		buildAudioCaptureScript: zoomMeetingAudioCaptureScript,
		allowsMicrophone: MeetingPlatformAdapter.isTalkBackMode,
		buildStatusJoinScript: (params) => zoomMeetingStatusScript({
			allowMicrophone: MeetingPlatformAdapter.isTalkBackMode(params.mode),
			allowSessionAdoption: params.allowSessionAdoption,
			autoJoin: params.autoJoin,
			captureCaptions: params.captureCaptions,
			guestName: params.guestName,
			meetingSessionId: params.meetingSessionId || void 0,
			meetingUrl: params.url,
			readOnly: params.readOnly,
			waitForInCallMs: params.waitForInCallMs
		}),
		shouldRetryJoinStatus: (health) => health.inCall === true && (health.manualAction?.reason === "zoom-audio-choice-required" && health.audioInputRouted === true && health.audioOutputRouteRetryable === true || health.manualAction === void 0 && health.captionCaptureRequested === true && health.captioning !== true),
		browserControlUnavailable: () => ({
			category: "browser-control-unavailable",
			reason: "browser-control-unavailable",
			message: "Open the OpenClaw browser profile, finish the Zoom sign-in, admission, or permission prompt, then retry."
		}),
		buildLeaveScript: (meetingUrl) => zoomMeetingLeaveScript({
			leaveInitiated: false,
			meetingSessionId: "",
			meetingUrl
		}),
		buildSessionLeaveScript: zoomMeetingLeaveScript,
		captions: {
			enabled: () => true,
			buildTranscriptScript: ({ finalize, meetingSessionId, meetingUrl }) => zoomMeetingTranscriptScript(meetingUrl, meetingSessionId, finalize)
		},
		permissions: ({ allowMicrophone, meetingUrl }) => {
			const origin = zoomMeetingOrigin(meetingUrl);
			return allowMicrophone && origin ? {
				origin,
				permissions: ["audioCapture"],
				optionalPermissions: ["speakerSelection"]
			} : void 0;
		}
	},
	parsing: {
		classifyManualActionReason,
		displayName: "Zoom",
		invalidTranscriptMessage: "Zoom transcript payload is invalid.",
		malformedStatusMessage: "Zoom browser status JSON is malformed.",
		malformedTranscriptMessage: "Zoom transcript JSON is malformed.",
		statusFields: (parsed) => ({ meetingEnded: typeof parsed.meetingEnded === "boolean" ? parsed.meetingEnded : void 0 })
	}
});
//#endregion
//#region extensions/zoom-meetings/src/node-host.ts
const handleZoomMeetingsNodeHostCommand = MeetingPlatformAdapter.createPluginNodeHostHandler({
	platform: ZOOM_MEETINGS_PLATFORM_ADAPTER,
	browserPageName: "Zoom",
	meetingLabel: "Zoom meeting",
	defaultAudioInputCommand: zoomMeetingsConfig.defaultAudioInputCommand,
	defaultAudioOutputCommand: zoomMeetingsConfig.defaultAudioOutputCommand,
	sharePrerequisiteDeadline: true
});
//#endregion
//#region extensions/zoom-meetings/src/node-invoke-policy.ts
function createZoomMeetingsNodeInvokePolicy(config) {
	return MeetingPlatformAdapter.createPluginNodeInvokePolicy(config, {
		deniedCode: "ZOOM_MEETINGS_NODE_POLICY_DENIED",
		platform: ZOOM_MEETINGS_PLATFORM_ADAPTER
	});
}
//#endregion
//#region extensions/zoom-meetings/src/runtime-probes.ts
const probes = MeetingPlatformAdapter.createRuntimeProbes({
	defaultSpeechMessage: "Say exactly: Zoom speech test complete.",
	invalidRequest: zoomMeetingsInvalidRequest,
	resolveTimeoutMs: (input, fallback) => MeetingPlatformAdapter.resolveProbeTimeoutMs(input, fallback, zoomMeetingsInvalidRequest),
	shouldWaitForListening: (session) => Boolean(session.chrome?.browserTab?.targetId),
	talkBackMode: MeetingPlatformAdapter.isTalkBackMode
});
const testZoomMeetingListening = probes.testListening;
const testZoomMeetingSpeech = probes.testSpeech;
//#endregion
//#region extensions/zoom-meetings/src/transports/chrome.ts
const chromeTransport = MeetingPlatformAdapter.createPluginChromeTransport({
	meetingLabel: "Zoom meeting",
	platform: ZOOM_MEETINGS_PLATFORM_ADAPTER,
	preserveTrackedBrowserOnEngineFailure: true,
	runtime: MeetingPlatformAdapter.createChromeRuntimeBindings()
});
const assertZoomMeetingsAudioAvailable = chromeTransport.assertAudioDeviceAvailable;
const launchZoomMeetingInChrome = chromeTransport.launchInChrome;
const launchZoomMeetingOnNode = chromeTransport.launchOnNode;
const leaveZoomMeetingInBrowser = chromeTransport.leaveInBrowser;
const readZoomMeetingTranscript = chromeTransport.readTranscript;
const recoverCurrentZoomMeetingTab = chromeTransport.recoverCurrentTab;
//#endregion
//#region extensions/zoom-meetings/src/runtime-setup.ts
const getZoomMeetingsSetupStatus = MeetingPlatformAdapter.createRuntimeSetup({
	assertAudioDeviceAvailable: assertZoomMeetingsAudioAvailable,
	captionsMessage: (mode) => mode === "transcribe" ? "Zoom live-caption capture is enabled and ready" : "Caption scraping is not used by talk-back modes",
	connectedNodeMessage: (node) => `Connected Zoom meeting node ready: ${node}`,
	guestJoinCheck: (config) => {
		const ok = Boolean(config.chrome.guestName && config.chrome.autoJoin && (config.chrome.launch || config.chrome.reuseExistingTab));
		return {
			ok,
			message: ok ? "Guest name, auto-join, and a Chrome launch or reuse path are configured" : "Set chrome.guestName, chrome.autoJoin, and either chrome.launch or chrome.reuseExistingTab for unattended guest joins"
		};
	},
	missingNodeIdMessage: "Connected Zoom meetings node did not include a node id.",
	nodeAdapter: ZOOM_MEETINGS_BROWSER_NODE_ADAPTER
});
//#endregion
//#region extensions/zoom-meetings/src/runtime.ts
const ZoomMeetingsRuntime = MeetingPlatformAdapter.createRuntimeFacade({
	platform: ZOOM_MEETINGS_PLATFORM_ADAPTER,
	transport: {
		launchInChrome: launchZoomMeetingInChrome,
		launchOnNode: launchZoomMeetingOnNode,
		leaveInBrowser: leaveZoomMeetingInBrowser,
		readTranscript: readZoomMeetingTranscript,
		recoverCurrentTab: recoverCurrentZoomMeetingTab
	},
	probes: {
		setupStatus: getZoomMeetingsSetupStatus,
		testListening: testZoomMeetingListening,
		testSpeech: testZoomMeetingSpeech
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
	messages: {
		browserReadinessFailed: (error) => `Zoom browser readiness refresh failed: ${error}`,
		durableTranscripts: {
			providerId: "zoom",
			providerName: "Zoom"
		},
		joined: {
			local: "Zoom guest joined in local Chrome with realtime audio through the native virtual-audio backend.",
			node: "Zoom guest joined in Chrome on the selected node with realtime audio through the node bridge.",
			transcribe: "Zoom guest joined observe-only with live-caption transcript capture.",
			waiting: "Zoom guest join is waiting for the browser to become ready before starting realtime audio."
		},
		leaveFailed: (error) => `Browser control could not leave the Zoom meeting tab: ${error}`,
		noTrackedTab: "No tracked Zoom meeting tab; leave the browser meeting manually if it is still active.",
		sharedTab: "Kept the shared Zoom meeting tab open for another active session.",
		sessionRuntime: {
			previousBrowserLeaveFailed: "Could not leave the previous Zoom meeting tab before reassignment.",
			reassignedSessionNote: "Ended before the same Zoom meeting tab was reassigned to another agent.",
			reusedSessionNote: "Reused existing active Zoom meeting session.",
			replacementBrowserLeaveFailed: "Could not leave the previous Zoom meeting tab before reassignment.",
			speechBlockedFallback: "Realtime speech blocked until Zoom is ready.",
			speech: {
				audioBridgeUnavailable: "Realtime speech requires an active Chrome audio bridge.",
				browserUnverified: "Zoom browser state has not been verified yet.",
				microphoneMuted: "Turn on the OpenClaw Zoom microphone before asking OpenClaw to speak.",
				microphoneMutedReason: "zoom-microphone-muted",
				notInCall: "Zoom has not reported that the browser guest is in the call.",
				notInCallReason: "not-in-call",
				browserUnverifiedReason: "browser-unverified",
				audioBridgeUnavailableReason: "audio-bridge-unavailable"
			}
		}
	}
});
//#endregion
//#region extensions/zoom-meetings/index.ts
var zoom_meetings_default = MeetingPlatformAdapter.createPluginShellEntry({
	platform: ZOOM_MEETINGS_PLATFORM_ADAPTER,
	browserGuestLabel: "Zoom meeting",
	configSchema: zoomMeetingsConfig.configSchema,
	invalidRequest: zoomMeetingsInvalidRequest,
	isInvalidRequest: (error) => error instanceof ZoomMeetingsInvalidRequestError,
	toolParameters: Type.Object({
		action: Type.String({ enum: [
			"join",
			"leave",
			"status",
			"transcript",
			"speak"
		] }),
		url: Type.Optional(Type.String({ description: "Zoom meeting URL" })),
		transport: Type.Optional(Type.String({ enum: ["chrome", "chrome-node"] })),
		mode: Type.Optional(Type.String({ enum: [
			"agent",
			"bidi",
			"transcribe"
		] })),
		sessionId: Type.Optional(Type.String({ description: "Zoom meeting session ID" })),
		sinceIndex: Type.Optional(Type.Integer({
			minimum: 0,
			description: "Resume transcript from this index"
		})),
		message: Type.Optional(Type.String({ description: "Instructions to speak" }))
	}),
	resolveGatewayTimeoutMs: zoomMeetingsConfig.resolveGatewayOperationTimeoutMs,
	normalizeRequesterSessionKey: (value, trustedOwner) => trustedOwner && typeof value === "string" && value.trim() ? value.trim() : void 0,
	normalizeToolAgentId: (agentId) => normalizeAgentId(agentId),
	resolveToolRuntime: async (api) => {
		if (!await api.runtime.gateway.isAvailable()) throw new Error("Zoom meeting tools require a Gateway-hosted agent run.");
		return api.runtime;
	},
	transcriptSource: {
		id: "zoom",
		aliases: ["zoom-meetings"]
	},
	runtime: ZoomMeetingsRuntime,
	nodeHandler: handleZoomMeetingsNodeHostCommand,
	createNodePolicy: createZoomMeetingsNodeInvokePolicy,
	registerNodeWhen: (config) => config.enabled,
	cli: {
		descriptor: ZOOM_MEETINGS_CLI_METADATA.descriptor,
		load: async () => (await import("./.setup/cli-CYes3qso.mjs")).registerZoomMeetingsCli
	}
});
//#endregion
export { zoom_meetings_default as default };
