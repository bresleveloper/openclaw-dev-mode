import { t as TEAMS_MEETINGS_CLI_METADATA } from "./.setup/cli-output-mode-DfEjC8Y8.mjs";
import { t as teamsMeetingsConfig } from "./.setup/config-BIqv-97D.mjs";
import { MeetingPlatformAdapter } from "openclaw/plugin-sdk/meeting-runtime";
import { normalizeAgentId } from "openclaw/plugin-sdk/routing";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { Type } from "typebox";
import { createMeetingBrowserAudioCaptureSource, createMeetingLeaveSource, createMeetingTranscriptSource } from "openclaw/plugin-sdk/meeting-page-script-runtime";
//#region extensions/teams-meetings/src/errors.ts
var TeamsMeetingsInvalidRequestError = class extends Error {};
function teamsMeetingsInvalidRequest(message) {
	return new TeamsMeetingsInvalidRequestError(message);
}
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
function teamsMeetingStatusCallSource() {
	return MeetingPlatformAdapter.createStatusCallSource({
		platform: {
			audioOutputElementIdPrefix: "openclaw-teams-audio-output-",
			displayName: "Teams",
			globals: {
				audioOutputs: "__openclawTeamsAudioOutputs",
				captions: "__openclawTeamsCaptions",
				meeting: "__openclawTeamsMeeting"
			},
			manualActionReasonPrefix: "teams"
		},
		captionEnableSource: `if (!captionsFinalized && canMutateSession && inCall && !captionsEnabledNow) {
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
    }`
	});
}
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-status-prejoin-source.ts
function teamsMeetingStatusPreludeSource(params) {
	return MeetingPlatformAdapter.createStatusPreludeSource(params, {
		controlLookupSource: `const buttons = [...document.querySelectorAll("button")];
  const findTextButton = (pattern) => buttons.find((button) => !button.disabled && pattern.test(label(button)));`,
		lifecycleSource: `  const continueInBrowser = first(selectors.continueInBrowser) ||
    findTextButton(/continue on this browser|join on the web|use the web app|continue without the app/i);
  if (canMutateSession && identityVerifiedBeforeCall && continueInBrowser) {
    continueInBrowser.click();
    notes.push("Continued to the Teams web client.");
    await waitForUi();
  }
  const guestInput = first(selectors.guestName) || [...document.querySelectorAll("input")].find((input) =>
    /enter your name|type your name|your name|display name/i.test(label(input) + " " + (input.placeholder || ""))
  );
  if (canMutateSession && identityVerifiedBeforeCall && autoJoin && guestInput && !guestInput.value) {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    guestInput.focus();
    if (setter) setter.call(guestInput, ${JSON.stringify(params.guestName)});
    else guestInput.value = ${JSON.stringify(params.guestName)};
    guestInput.dispatchEvent(new Event("input", { bubbles: true }));
    guestInput.dispatchEvent(new Event("change", { bubbles: true }));
  }
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
  const { isVirtualAudioDevice, isVirtualAudioDeviceNode, microphoneDeviceRoots, selectedMicrophoneLabel } = meetingAudioInput;
  let audioInputRouted;
  let audioInputDeviceLabel;
  let audioInputRouteError;
  const ensureVirtualAudioInput = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return false;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const input = devices.find(
        (device) => device.kind === "audioinput" && isVirtualAudioDevice(device.label)
      );
      if (!input?.deviceId) return false;
      audioInputDeviceLabel = input.label || "Virtual audio device";
      // Teams hides the selected-device control after admission. Reopen the in-call audio
      // options and verify the current selection before unmuting; installed devices alone
      // do not prove which microphone Teams is using.
      const preparedInput = window.__openclawTeamsMeeting;
      const preparedSelection = Boolean(
        readOnly &&
        preparedInput?.identity === expectedIdentity &&
        (!sessionId || preparedInput?.sessionId === sessionId) &&
        preparedInput?.audioInputDeviceId === input.deviceId
      );
      let selected = Boolean(selectedMicrophoneLabel()) || preparedSelection;
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
      if (selected && window.__openclawTeamsMeeting?.identity === expectedIdentity) {
        window.__openclawTeamsMeeting.audioInputDeviceId = input.deviceId;
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
      controlManualAction = manualActionFor("teams-audio-choice-required", "Select the OpenClaw virtual audio device as the Teams microphone and verify it is selected before enabling talk-back.");
    } else if (canMutateSession && microphoneState === "off") {
      microphone.click();
      await waitForUi();
      const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
      microphoneState = toggleState(currentMicrophone, "microphone");
      if (microphoneState === "on") {
        notes.push("Unmuted the Teams microphone after verifying the virtual audio input.");
      }
    }
    if (audioInputRouted && microphoneState !== "on") {
      controlManualAction = manualActionFor("teams-microphone-required", "Unmute the Teams microphone and verify the microphone control shows it is on, then retry joining.");
    }
  } else if (canMutateSession && identityVerified && !inCall && !allowMicrophone && microphoneState === "on") {
      microphone.click();
      await waitForUi();
      const currentMicrophone = first(selectors.microphone) || findTextButton(/mute|unmute|microphone/i);
      microphoneState = toggleState(currentMicrophone, "microphone");
      if (microphoneState === "off") {
        notes.push("Muted the Teams microphone for observe-only mode.");
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
        notes.push("Muted the Teams microphone because the virtual audio input could not be reverified.");
      }
    }
  }
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
		manualActionSource: `  const pageText = text(document.body);
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
  let microphonePermissionState;
  if (allowMicrophone && navigator.permissions?.query) {
    try {
      microphonePermissionState = (await navigator.permissions.query({ name: "microphone" })).state;
    } catch {}
  }
  const devicePermissionPrompt = !dismissedDevicePrompt && Boolean(
    first(selectors.permissionPrompt) || continueWithoutDevices
  );
  // Teams shows the same no-audio/video warning when only camera access is denied.
  // A granted microphone plus the verified virtual audio input is sufficient for talk-back.
  const permissionRequired = devicePermissionPrompt &&
    (!allowMicrophone || microphonePermissionState !== "granted");
  let manualAction;
  if (committedOwnerConflict && !canMutateSession) {
    manualAction = manualActionFor("teams-session-conflict", "This Teams tab is owned by another active meeting session.");
  } else if (!inCall && loginRequired) {
    manualAction = manualActionFor("teams-login-required", tenantLoginRequired ? "This Teams tenant requires sign-in or email verification. Complete it in the OpenClaw browser profile, then retry." : "Sign in to Microsoft Teams in the OpenClaw browser profile, then retry the meeting join.");
  } else if (!inCall && lobbyWaiting) {
    manualAction = manualActionFor("teams-admission-required", "Admit the OpenClaw guest from the Microsoft Teams lobby, then retry speech.");
  } else if (!inCall && permissionRequired) {
    manualAction = manualActionFor("teams-permission-required", allowMicrophone ? "Allow microphone permission for Teams in the OpenClaw browser profile, then retry." : "Dismiss the Teams device-permission prompt or continue without devices, then retry.");
  } else if (!inCall && controlManualAction) {
    manualAction = controlManualAction;
  }
  let clickedJoin = false;
  if (canMutateSession && identityVerified && autoJoin && !inCall && join && !join.disabled && !manualAction) {
    join.click();
    clickedJoin = true;
    notes.push("Clicked the Teams guest join button.");
  }`,
		platform: {
			displayName: "Teams",
			globals: {
				audioOutputs: "__openclawTeamsAudioOutputs",
				captionArchive: "__openclawTeamsCaptionArchive",
				captions: "__openclawTeamsCaptions",
				meeting: "__openclawTeamsMeeting"
			},
			manualActionReasonPrefix: "teams"
		}
	});
}
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-urls.ts
function parseTeamsMeetingIdentity(url) {
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
			return {
				kind: "work",
				key: threadId
			};
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
			return {
				kind: "consumer",
				key: `${meetCode.toLowerCase()}:p:${encodeURIComponent(passcode ?? "")}`
			};
		}
	} catch {
		return;
	}
}
function normalizeTeamsMeetingUrl(input) {
	if (typeof input !== "string" || !input.trim()) throw new Error("Microsoft Teams meeting URL is required");
	const value = input.trim();
	if (!parseTeamsMeetingIdentity(value)) throw new Error("Microsoft Teams meeting URL must use https://teams.microsoft.com/l/meetup-join/... or https://teams.live.com/meet/<id>");
	const parsed = new URL(value);
	parsed.hash = "";
	return parsed.toString();
}
function normalizeTeamsMeetingUrlForReuse(url) {
	const identity = parseTeamsMeetingIdentity(url);
	return identity ? `teams-${identity.kind}:${identity.key}` : void 0;
}
function isSameTeamsMeetingUrl(left, right) {
	const normalizedLeft = normalizeTeamsMeetingUrlForReuse(left);
	const normalizedRight = normalizeTeamsMeetingUrlForReuse(right);
	return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
}
function isRecoverableTeamsMeetingTab(tab, url) {
	if (url) return isSameTeamsMeetingUrl(tab.url, url);
	if (normalizeTeamsMeetingUrlForReuse(tab.url)) return true;
	try {
		const hostname = new URL(tab.url ?? "").hostname.toLowerCase();
		return (hostname === "login.microsoftonline.com" || hostname.endsWith(".microsoftonline.com")) && /sign in|microsoft|teams/i.test(tab.title ?? "");
	} catch {
		return false;
	}
}
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-page-scripts.ts
function teamsMeetingAudioCaptureScript(params) {
	return createMeetingBrowserAudioCaptureSource({
		...params,
		audioOutputsGlobal: "__openclawTeamsAudioOutputs",
		ownershipSource: `
      ${pageIdentityFunctionSource()}
      const expectedIdentity = ${JSON.stringify(normalizeTeamsMeetingUrlForReuse(params.meetingUrl))};
      const state = window.__openclawTeamsMeeting;
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
function teamsMeetingStatusScript(params) {
	const selectors = JSON.stringify(TEAMS_MEETING_SELECTORS);
	const expectedIdentity = normalizeTeamsMeetingUrlForReuse(params.meetingUrl);
	const toggleStateFunction = teamsMeetingToggleStateFunctionSource();
	return teamsMeetingStatusPreludeSource({
		...params,
		expectedIdentity,
		pageIdentitySource: pageIdentityFunctionSource(),
		selectors,
		toggleStateFunction
	}) + teamsMeetingStatusCallSource();
}
function teamsMeetingTranscriptScript(meetingUrl, meetingSessionId, finalize) {
	const expectedIdentity = normalizeTeamsMeetingUrlForReuse(meetingUrl);
	return createMeetingTranscriptSource({
		expectedIdentity,
		finalize,
		globals: {
			captionArchive: "__openclawTeamsCaptionArchive",
			captions: "__openclawTeamsCaptions",
			meeting: "__openclawTeamsMeeting"
		},
		meetingSessionId,
		pageIdentitySource: pageIdentityFunctionSource(),
		platformDisplayName: "Teams"
	});
}
function teamsMeetingLeaveScript(params) {
	const selectors = JSON.stringify(TEAMS_MEETING_SELECTORS);
	const expectedIdentity = normalizeTeamsMeetingUrlForReuse(params.meetingUrl);
	return createMeetingLeaveSource({
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
		expectedIdentity,
		leaveInitiated: params.leaveInitiated,
		meetingSessionId: params.meetingSessionId,
		pageIdentitySource: pageIdentityFunctionSource(),
		platform: {
			displayName: "Teams",
			globals: {
				audioOutputs: "__openclawTeamsAudioOutputs",
				meeting: "__openclawTeamsMeeting"
			}
		},
		selectors,
		sessionMatchSource: "const sessionMatched = !enforceSessionOwnership || state?.sessionId === expectedSessionId;"
	});
}
//#endregion
//#region extensions/teams-meetings/src/transports/teams-meetings-platform-constants.ts
const TEAMS_MEETINGS_NODE_COMMAND = "teamsmeetings.chrome";
const TEAMS_MEETINGS_BROWSER_NODE_ADAPTER = {
	displayName: "Microsoft Teams meetings",
	nodeCommandName: TEAMS_MEETINGS_NODE_COMMAND,
	nodeConfigPath: "plugins.entries.teams-meetings.config.chromeNode.node"
};
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
function classifyManualActionReason(reason) {
	switch (reason) {
		case "teams-login-required": return "login-required";
		case "teams-admission-required": return "admission-required";
		case "teams-permission-required": return "permission-required";
		case "teams-audio-choice-required": return "audio-choice-required";
		case "teams-session-conflict": return "session-conflict";
		case "browser-control-unavailable": return "browser-control-unavailable";
		default: return "custom";
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
	nodeCommandName: TEAMS_MEETINGS_NODE_COMMAND,
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
	browser: {
		buildAudioCaptureScript: teamsMeetingAudioCaptureScript,
		allowsMicrophone: MeetingPlatformAdapter.isTalkBackMode,
		buildStatusJoinScript: (params) => teamsMeetingStatusScript({
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
		shouldRetryJoinStatus: (health) => health.inCall === true && (health.manualAction?.reason === "teams-audio-choice-required" && health.audioInputRouted === true && health.audioOutputRouteRetryable === true || health.manualAction === void 0 && health.captionCaptureRequested === true && health.captioning !== true),
		browserControlUnavailable: () => ({
			category: "browser-control-unavailable",
			reason: "browser-control-unavailable",
			message: "Open the OpenClaw browser profile, finish the Teams sign-in, admission, or permission prompt, then retry."
		}),
		buildLeaveScript: (meetingUrl) => teamsMeetingLeaveScript({
			leaveInitiated: false,
			meetingSessionId: "",
			meetingUrl
		}),
		buildSessionLeaveScript: teamsMeetingLeaveScript,
		captions: {
			enabled: () => true,
			buildTranscriptScript: ({ finalize, meetingSessionId, meetingUrl }) => teamsMeetingTranscriptScript(meetingUrl, meetingSessionId, finalize)
		},
		permissions: ({ allowMicrophone, meetingUrl }) => {
			const origin = teamsMeetingOrigin(meetingUrl);
			return allowMicrophone && origin ? {
				origin,
				permissions: ["audioCapture"],
				optionalPermissions: ["speakerSelection"]
			} : void 0;
		}
	},
	parsing: {
		classifyManualActionReason,
		displayName: "Teams",
		invalidTranscriptMessage: "Microsoft Teams transcript payload is invalid.",
		malformedStatusMessage: "Microsoft Teams browser status JSON is malformed.",
		malformedTranscriptMessage: "Microsoft Teams transcript JSON is malformed."
	}
});
//#endregion
//#region extensions/teams-meetings/src/node-host.ts
const handleTeamsMeetingsNodeHostCommand = MeetingPlatformAdapter.createPluginNodeHostHandler({
	platform: TEAMS_MEETINGS_PLATFORM_ADAPTER,
	browserPageName: "Teams",
	meetingLabel: "Microsoft Teams meeting",
	defaultAudioInputCommand: teamsMeetingsConfig.defaultAudioInputCommand,
	defaultAudioOutputCommand: teamsMeetingsConfig.defaultAudioOutputCommand,
	sharePrerequisiteDeadline: true
});
//#endregion
//#region extensions/teams-meetings/src/node-invoke-policy.ts
function createTeamsMeetingsNodeInvokePolicy(config) {
	return MeetingPlatformAdapter.createPluginNodeInvokePolicy(config, {
		deniedCode: "TEAMS_MEETINGS_NODE_POLICY_DENIED",
		platform: TEAMS_MEETINGS_PLATFORM_ADAPTER
	});
}
//#endregion
//#region extensions/teams-meetings/src/runtime-probes.ts
const probes = MeetingPlatformAdapter.createRuntimeProbes({
	defaultSpeechMessage: "Say exactly: Microsoft Teams speech test complete.",
	invalidRequest: teamsMeetingsInvalidRequest,
	resolveTimeoutMs: (input, fallback) => MeetingPlatformAdapter.resolveProbeTimeoutMs(input, fallback, teamsMeetingsInvalidRequest),
	shouldWaitForListening: ({ chrome }) => Boolean(chrome?.launched || chrome?.browserTab?.targetId),
	talkBackMode: MeetingPlatformAdapter.isTalkBackMode
});
const testTeamsMeetingListening = probes.testListening;
const testTeamsMeetingSpeech = probes.testSpeech;
//#endregion
//#region extensions/teams-meetings/src/transports/chrome.ts
const chromeTransport = MeetingPlatformAdapter.createPluginChromeTransport({
	meetingLabel: "Microsoft Teams meeting",
	platform: TEAMS_MEETINGS_PLATFORM_ADAPTER,
	preserveTrackedBrowserOnEngineFailure: false,
	runtime: MeetingPlatformAdapter.createChromeRuntimeBindings()
});
const assertTeamsMeetingsAudioAvailable = chromeTransport.assertAudioDeviceAvailable;
const launchTeamsMeetingInChrome = chromeTransport.launchInChrome;
const launchTeamsMeetingOnNode = chromeTransport.launchOnNode;
const leaveTeamsMeetingInBrowser = chromeTransport.leaveInBrowser;
const readTeamsMeetingTranscript = chromeTransport.readTranscript;
const recoverCurrentTeamsMeetingTab = chromeTransport.recoverCurrentTab;
//#endregion
//#region extensions/teams-meetings/src/runtime-setup.ts
const getTeamsMeetingsSetupStatus = MeetingPlatformAdapter.createRuntimeSetup({
	assertAudioDeviceAvailable: assertTeamsMeetingsAudioAvailable,
	captionsMessage: (mode) => mode === "transcribe" ? "Teams caption scraping is disabled pending live selector validation; transcript snapshots are empty" : "Caption scraping is not used by talk-back modes",
	connectedNodeMessage: (node) => `Connected Teams meeting node ready: ${node}`,
	guestJoinCheck: (config) => {
		const ok = Boolean(config.chrome.guestName && config.chrome.autoJoin && config.chrome.reuseExistingTab);
		return {
			ok,
			message: ok ? "Guest name, auto-join, and tab reuse are configured" : "Set chrome.guestName, chrome.autoJoin, and chrome.reuseExistingTab for unattended guest joins"
		};
	},
	missingNodeIdMessage: "Connected Microsoft Teams meetings node did not include a node id.",
	nodeAdapter: TEAMS_MEETINGS_BROWSER_NODE_ADAPTER
});
//#endregion
//#region extensions/teams-meetings/src/runtime.ts
const TeamsMeetingsRuntime = MeetingPlatformAdapter.createRuntimeFacade({
	platform: TEAMS_MEETINGS_PLATFORM_ADAPTER,
	transport: {
		launchInChrome: launchTeamsMeetingInChrome,
		launchOnNode: launchTeamsMeetingOnNode,
		leaveInBrowser: leaveTeamsMeetingInBrowser,
		readTranscript: readTeamsMeetingTranscript,
		recoverCurrentTab: recoverCurrentTeamsMeetingTab
	},
	probes: {
		setupStatus: getTeamsMeetingsSetupStatus,
		testListening: testTeamsMeetingListening,
		testSpeech: testTeamsMeetingSpeech
	},
	messages: {
		durableTranscripts: {
			providerId: "teams",
			providerName: "Microsoft Teams"
		},
		joined: {
			local: "Teams guest joined in local Chrome with realtime audio through the native virtual-audio backend.",
			node: "Teams guest joined in Chrome on the selected node with realtime audio through the node bridge.",
			transcribe: "Teams guest joined observe-only with live-caption transcript capture.",
			waiting: "Teams guest join is waiting for the browser to become ready before starting realtime audio."
		},
		leaveFailed: (error) => `Browser control could not leave the Teams meeting tab: ${error}`,
		noTrackedTab: "No tracked Teams meeting tab; leave the browser meeting manually if it is still active.",
		sharedTab: "Kept the shared Teams meeting tab open for another active session.",
		sessionRuntime: {
			previousBrowserLeaveFailed: "Could not leave the previous Teams meeting tab before reassignment.",
			reassignedSessionNote: "Ended before the same Teams meeting tab was reassigned to another agent.",
			reusedSessionNote: "Reused existing active Microsoft Teams meeting session.",
			replacementBrowserLeaveFailed: "Could not leave the previous Teams meeting tab before reassignment.",
			speechBlockedFallback: "Realtime speech blocked until Microsoft Teams is ready.",
			speech: {
				audioBridgeUnavailable: "Realtime speech requires an active Chrome audio bridge.",
				browserUnverified: "Microsoft Teams browser state has not been verified yet.",
				microphoneMuted: "Turn on the OpenClaw Teams microphone before asking OpenClaw to speak.",
				microphoneMutedReason: "teams-microphone-muted",
				notInCall: "Microsoft Teams has not reported that the browser guest is in the call.",
				notInCallReason: "not-in-call",
				browserUnverifiedReason: "browser-unverified",
				audioBridgeUnavailableReason: "audio-bridge-unavailable"
			}
		}
	}
});
//#endregion
//#region extensions/teams-meetings/index.ts
var teams_meetings_default = MeetingPlatformAdapter.createPluginShellEntry({
	platform: TEAMS_MEETINGS_PLATFORM_ADAPTER,
	browserGuestLabel: "Microsoft Teams meeting",
	configSchema: teamsMeetingsConfig.configSchema,
	invalidRequest: teamsMeetingsInvalidRequest,
	isInvalidRequest: (error) => error instanceof TeamsMeetingsInvalidRequestError,
	toolParameters: Type.Object({
		action: Type.String({ enum: [
			"join",
			"leave",
			"status",
			"transcript",
			"speak"
		] }),
		url: Type.Optional(Type.String({ description: "Microsoft Teams meeting URL" })),
		transport: Type.Optional(Type.String({ enum: ["chrome", "chrome-node"] })),
		mode: Type.Optional(Type.String({ enum: [
			"agent",
			"bidi",
			"transcribe"
		] })),
		sessionId: Type.Optional(Type.String({ description: "Teams meeting session ID" })),
		sinceIndex: Type.Optional(Type.Integer({
			minimum: 0,
			description: "Resume transcript from this index"
		})),
		message: Type.Optional(Type.String({ description: "Instructions to speak" }))
	}),
	resolveGatewayTimeoutMs: teamsMeetingsConfig.resolveGatewayOperationTimeoutMs,
	normalizeRequesterSessionKey: normalizeOptionalString,
	normalizeToolAgentId: (agentId) => agentId ? normalizeAgentId(agentId) : void 0,
	resolveToolRuntime: async (api, agentId) => {
		const trustedRouting = Boolean(agentId && agentId !== "main");
		const useRuntime = trustedRouting ? await api.runtime.gateway.isAvailable() : false;
		if (trustedRouting && !useRuntime) throw new Error("Per-agent Microsoft Teams meeting routing requires a Gateway-hosted agent run.");
		return useRuntime ? api.runtime : void 0;
	},
	transcriptSource: {
		id: "teams",
		aliases: [
			"teams-meetings",
			"microsoft-teams",
			"msteams"
		]
	},
	runtime: TeamsMeetingsRuntime,
	nodeHandler: handleTeamsMeetingsNodeHostCommand,
	createNodePolicy: createTeamsMeetingsNodeInvokePolicy,
	registerNodeWhen: () => true,
	cli: {
		descriptor: TEAMS_MEETINGS_CLI_METADATA.descriptor,
		load: async () => (await import("./.setup/cli-CJq2iprb.mjs")).registerTeamsMeetingsCli
	}
});
//#endregion
export { teams_meetings_default as default };
