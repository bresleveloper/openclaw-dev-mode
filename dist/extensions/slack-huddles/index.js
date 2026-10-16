import { SLACK_HUDDLES_CLI_METADATA } from "./cli-metadata.js";
import { MeetingPlatformAdapter } from "openclaw/plugin-sdk/meeting-runtime";
import { addTimerTimeoutGraceMs } from "openclaw/plugin-sdk/number-runtime";
import { REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME } from "openclaw/plugin-sdk/realtime-voice";
//#region extensions/slack-huddles/src/errors.ts
var SlackHuddlesInvalidRequestError = class extends Error {};
//#endregion
//#region extensions/slack-huddles/src/transports/slack-huddles-selectors.ts
const SLACK_HUDDLE_SELECTORS = {
	preview: ["[data-qa=\"huddle_join_preview_modal\"]"],
	join: ["[data-qa=\"huddle_join_preview_modal_go\"]"],
	confirmation: ["[data-qa=\"huddle_join_modal\"]", "[data-qa=\"huddle_in_thread_speed_bump_modal\"]"],
	multiDevice: ["[data-qa=\"huddle_multi_device_modal_switch_device\"]", "[data-qa=\"huddle_multi_device_modal_use_both_device\"]"],
	previewMicrophone: ["[data-qa=\"huddle_join_preview_mic_button\"]"],
	microphone: [
		"button[role=\"switch\"][aria-label=\"Microphone\"]",
		"[data-qa=\"huddle_sidebar_footer_mute_button\"]",
		"[data-qa=\"segmented-mute-button-main\"]",
		"button[aria-describedby=\"microphone-info\"]"
	],
	mutedIcon: ["[data-qa=\"huddle_mic_icon_mute\"]"],
	unmutedIcon: ["[data-qa=\"huddle_mic_icon_unmute\"]"],
	leave: ["[data-qa=\"huddle_toolbar__leave_button\"]", "[data-qa=\"huddle_mini_player_leave_button\"]"],
	inCall: [
		"[data-qa=\"huddle_toolbar__leave_button\"]",
		"[data-qa=\"huddle_mini_player_leave_button\"]",
		"[data-qa=\"huddle_sidebar_footer\"]",
		"[data-qa=\"huddle_toolbar_buttons_center\"]"
	],
	channelHeader: [".p-huddle_channel_header_button__container"],
	channelHeaderInHuddle: [".p-huddle_channel_header_button--in_huddle"],
	huddleSurfaces: [
		"[data-qa=\"huddle_join_preview_modal\"]",
		"[role=\"dialog\"]",
		"[data-qa=\"huddle_sidebar_footer\"]",
		"[data-qa=\"huddle_toolbar_buttons_center\"]",
		"[data-qa=\"huddle_mini_player\"]"
	],
	signIn: [
		"form[action*=\"signin\"]",
		"input[name=\"email\"]",
		"input[type=\"password\"]"
	],
	title: ["[data-qa=\"huddle_window_titlebar_title\"]", "[data-qa=\"huddle_details_title\"]"],
	participants: ["[data-qa^=\"huddle_peer_tile_userId_\"]", "[data-qa=\"huddle_avatar_stack__member\"]"],
	deviceSettings: ["[data-qa=\"huddle-toolbar-mic-popover-button\"]"],
	audioDeviceOptions: ["[data-qa^=\"av-microphone-device-menu-item_\"]"],
	microphoneDevice: ["#microphone-info"],
	microphoneDeviceMenu: [],
	microphoneDeviceScope: "[role=\"dialog\"]",
	selectedMicrophoneDevice: ["option:checked", "[role=\"option\"][aria-selected=\"true\"]"],
	captionsOff: [],
	captionRenderer: [
		".p-huddle_closed_captions",
		".p-huddle_closed_caption_event__event_text",
		"[data-qa=\"huddle_transcribe_event\"]"
	],
	captionContent: ["body"],
	captionRows: [".p-huddle_closed_caption_event__wrapper, :has(> .p-huddle_closed_caption_event__member_name):has(> .p-huddle_closed_caption_event__event_text), [data-qa=\"huddle_transcribe_event\"]"],
	captionAuthor: [".p-huddle_closed_caption_event__member_name"],
	captionText: [".p-huddle_closed_caption_event__event_text span[data-qa=\"huddle_closed_caption_event\"]", "[data-qa=\"huddle_transcribe_event\"]"]
};
//#endregion
//#region extensions/slack-huddles/src/transports/slack-huddles-status-call-source.ts
const slackHuddleStatusCall = {
	liveOwnershipSource: "authorityHolds()",
	afterAudioRoutingSource: `if (inCall && !authorityHolds()) inCall = false;
  if (inCall && allowMicrophone) {
    refreshAudioInput();
    if (canMutateSession && !audioInputRouted && readMicrophone() === "on") await setMicrophone("off");
  }`,
	captionEnableSource: `if (inCall && !authorityHolds()) {
      inCall = false;
      notes.push("Slack huddle membership changed during status; captions were not collected.");
    }
    if (inCall && captureCaptions && !captionsEnabledNow) {
      notes.push("Slack captions are off or not visible. Enable the Slack preference to turn on captions by default when joining huddles.");
    }`,
	extraResultSource: `inCall: inCall && authorityHolds(),
    meetingTitle: inCall && authorityHolds() ? text(firstRaw(selectors.title)) || undefined : undefined,
    participantCount: inCall && authorityHolds()
      ? new Set(selectors.participants.flatMap((selector) => [...document.querySelectorAll(selector)])).size
      : undefined,`
};
//#endregion
//#region extensions/slack-huddles/src/transports/slack-huddles-status-prejoin-source.ts
const SLACK_HUDDLE_JOIN_SETTLE_MS = 3e4;
const slackHuddleStatusPrelude = {
	controlLookupSource: `const findTextButton = (root, pattern) => [...(root?.querySelectorAll("button") || [])]
    .find((button) => !button.disabled && pattern.test(text(button)));
  const unavailable = (node) => !node || node.disabled || node.getAttribute?.("aria-disabled") === "true";`,
	lifecycleSource: `const continueInBrowser = undefined;
  const preview = firstRaw(selectors.preview);
  const join = first(selectors.join) || findTextButton(preview, /^join huddle$/i);
  const leave = first(selectors.leave);
  const inCallControl = leave || firstRaw(selectors.inCall);
  const huddleSurfaces = selectors.huddleSurfaces.flatMap((selector) => [...document.querySelectorAll(selector)])
    .filter((node) => node.isConnected !== false && !node.hidden && node.getAttribute?.("hidden") === null &&
      node.getAttribute?.("aria-hidden") !== "true" && node.getClientRects?.().length !== 0);
  const huddleText = huddleSurfaces.map(text).join(" ");
  const lobbyWaiting = huddleSurfaces.some((root) => findTextButton(root, /^request to join$/i)) ||
    /waiting (?:for .* )?(?:to (?:join|let you in)|for approval)|request (?:has been )?sent/i.test(huddleText);
  const sameRecordedIdentity = priorMeeting?.identity === expectedIdentity;
  const identityAwaitingRerender = false;
  const identityVerified = identityVerifiedBeforeCall;
  const confirmation = firstRaw(selectors.confirmation);
  const multiDevice = firstRaw(selectors.multiDevice);
  // Slack keeps a huddle running while the client shows other channels and may reuse its global
  // toolbar, so neither URLs nor call controls prove which huddle is live. Only the viewed channel's
  // header state establishes membership; without it the adapter fails closed.
  const joinSettling = Boolean(sameRecordedIdentity && priorMeeting.joinRequested === true &&
    Date.now() - (priorMeeting.joinRequestedAt || 0) < ${SLACK_HUDDLE_JOIN_SETTLE_MS});
  // Channel ids are workspace-scoped: a channel-only session counts as a member only once bound to its
  // workspace. Binding happens here, before any await; read-only or team-less views cannot bind and
  // fail closed. The page identity then rejects other workspaces.
  const channelOnlySession = Boolean(expectedIdentity && !/^slack-huddle:[TE][A-Z0-9]+:/.test(expectedIdentity));
  const headerMember = identityVerified && Boolean(firstRaw(selectors.channelHeaderInHuddle));
  let workspaceBound = !channelOnlySession || Boolean(window.__openclawSlackHuddleWorkspaces?.[expectedIdentity]);
  // Only a session that owns this page lifetime's marker may bind; after a reload an established
  // session has no marker and fails closed rather than adopting whatever workspace is showing.
  const ownsPageMarker = Boolean(sameRecordedIdentity && priorMeeting.sessionId === sessionId &&
    priorMeeting.bindable === true);
  if (!workspaceBound && headerMember && canMutateSession && ownsPageMarker && inCallControl && !preview &&
      !confirmation && !multiDevice) {
    let pageTeam;
    try {
      pageTeam = new URL(location.href).pathname.match(/^\\/(?:client|huddle)\\/([TE][A-Z0-9]{8,})\\//)?.[1];
    } catch {}
    if (pageTeam) {
      (window.__openclawSlackHuddleWorkspaces ||= {})[expectedIdentity] = pageTeam;
      workspaceBound = true;
    }
  }
  const huddleMember = headerMember && workspaceBound;
  let inCall = Boolean(huddleMember && inCallControl && !preview && !confirmation && !multiDevice);
  // Status work awaits permission queries and UI settling, so authority is rechecked right before each
  // click: this session still owns the page marker (and is not leaving), plus the in-call membership
  // header, or the same preview with no other call live.
  const markerOwned = () => {
    const marker = window.__openclawSlackHuddle;
    return !marker || (marker.sessionId === sessionId && !marker.leavePending);
  };
  const authorityHolds = () => meetingIdentity(location.href) === expectedIdentity && markerOwned() &&
    !firstRaw(selectors.confirmation) && !firstRaw(selectors.multiDevice) && (inCall
    ? Boolean(firstRaw(selectors.channelHeaderInHuddle))
    : Boolean(preview && firstRaw(selectors.preview) === preview && !firstRaw(selectors.inCall)));
  let authorityLost = false;
  const act = (node) => {
    if (authorityLost || !authorityHolds()) {
      authorityLost = true;
      return false;
    }
    node.click();
    return true;
  };
  if (canMutateSession && identityVerified && meetingOwnerConflict) adoptAudioBridgeSourcesForSession();
  if (canMutateSession && !inCall) retireOwnedAudioBridges();
  if (canMutateSession && identityVerified) {
    window.__openclawSlackHuddle = {
      ...(sameRecordedIdentity && !meetingOwnerConflict ? priorMeeting : {}),
      identity: expectedIdentity,
      sessionId: sessionId || priorMeeting?.sessionId,
      verifiedAt: Date.now(),
      // Only a marker born before any live call (pre-join, admission, or our own Join) may later bind a
      // workspace; one first written beside an already-live, unbound call never can.
      bindable: (sameRecordedIdentity && !meetingOwnerConflict && priorMeeting.bindable === true) || !inCallControl,
      ...(inCall ? { inCallControl, inCallUrl: location.href, joinRequested: false } : {}),
      ...(!inCall && inCallControl && (confirmation || multiDevice) ? { joinRequested: false } : {}),
    };
  } else if (canMutateSession && priorMeeting && !currentIdentity && !lobbyWaiting) {
    delete window.__openclawSlackHuddle;
  }
  const currentMicrophone = () => preview ? first(selectors.previewMicrophone) : first(selectors.microphone);
  const readMicrophone = () => {
    const current = currentMicrophone();
    return toggleState(current, "microphone") || (!preview && (
      firstWithin(current, selectors.mutedIcon) ? "off" :
      firstWithin(current, selectors.unmutedIcon) ? "on" : undefined
    ));
  };
  let microphoneState = identityVerified ? readMicrophone() : undefined;
  const camera = document.querySelector('button[role="switch"][aria-label="Camera"]');
  let cameraState = identityVerified ? (toggleState(camera, "camera") || (!camera ? "off" : undefined)) : undefined;
  const { isVirtualAudioDevice, selectedMicrophoneLabel } = meetingAudioInput;
  let audioInputRouted;
  let audioInputDeviceLabel;
  let audioInputRouteError;
  if (identityVerified && allowMicrophone) {
    audioInputDeviceLabel = selectedMicrophoneLabel();
    audioInputRouted = Boolean(audioInputDeviceLabel);
  }
  let manualAction;
  const hostname = location.hostname.toLowerCase();
  const loginPage = (hostname === "slack.com" || /^[a-z0-9-]+\\.slack\\.com$/.test(hostname)) &&
    /^\\/(?:signin|workspace-signin|get-started|check-login|ssb\\/signin)(?:\\/|$)/i.test(location.pathname);
  let microphonePermissionState;
  if (allowMicrophone && navigator.permissions?.query) {
    try { microphonePermissionState = (await navigator.permissions.query({ name: "microphone" })).state; } catch {}
  }
  if (committedOwnerConflict && !canMutateSession) {
    manualAction = manualActionFor("slack-session-conflict", "This Slack tab is owned by another active huddle session.");
  } else if (!inCall && (loginPage || firstRaw(selectors.signIn))) {
    manualAction = manualActionFor("slack-login-required", "Sign the OpenClaw Chrome profile into Slack as the claw's Slack account, then retry.");
  } else if (!inCall && inCallControl && !confirmation && !multiDevice && !joinSettling) {
    manualAction = manualActionFor("slack-session-conflict", "Slack does not show this account in the requested huddle while another call is live. Leave that huddle or reopen the requested channel, then retry.");
  } else if (multiDevice) {
    manualAction = manualActionFor("slack-session-conflict", "This Slack account is already in a huddle on another device. Resolve the Slack device prompt, then retry.");
  } else if (confirmation) {
    manualAction = manualActionFor("slack-confirmation-required", "Complete the Slack confirmation, then retry: " + text(confirmation));
  } else if (!inCall && lobbyWaiting) {
    manualAction = manualActionFor("slack-admission-required", "Request to join this huddle in Slack and wait for admission, then retry status.");
  } else if (!inCall && join && /^start huddle$/i.test(text(join))) {
    manualAction = manualActionFor("slack-huddle-not-active", "No one is in this huddle yet. Start the huddle in Slack, then ask again.");
  } else if ((allowMicrophone && (microphonePermissionState === "denied" || microphonePermissionState === "prompt")) ||
    (!inCall && /allow (?:slack (?:to )?)?(?:access to |use (?:your )?)?(?:the |your )?microphone|microphone permission/i.test(huddleText))) {
    manualAction = manualActionFor("slack-permission-required", "Allow Slack microphone permission in the OpenClaw Chrome profile, then retry.");
  }
  // Toggle state can change during awaits (a person may mute or unmute), so each toggle re-reads the
  // live control right before clicking and only clicks when the live state differs from the target.
  const currentCamera = () => document.querySelector('button[role="switch"][aria-label="Camera"]');
  const setMicrophone = async (desired) => {
    const control = currentMicrophone();
    const live = readMicrophone();
    // Unmuting is only safe while Slack still reports the virtual microphone as its selected input.
    const safe = desired !== "on" || Boolean(selectedMicrophoneLabel());
    if (live && live !== desired && safe && !unavailable(control) && act(control)) {
      await waitForUi();
    }
    microphoneState = readMicrophone();
  };
  const ownsCameraScope = inCall || Boolean(preview);
  if (canMutateSession && identityVerified && ownsCameraScope && !manualAction) {
    const control = currentCamera();
    if (toggleState(control, "camera") === "on" && !unavailable(control) && act(control)) {
      await waitForUi();
    }
    cameraState = toggleState(currentCamera(), "camera") || (!currentCamera() ? "off" : undefined);
  }
  // Slack can switch the selected input during awaited work; routing decisions use a fresh read.
  const refreshAudioInput = () => {
    if (identityVerified && allowMicrophone) {
      audioInputDeviceLabel = selectedMicrophoneLabel();
      audioInputRouted = Boolean(audioInputDeviceLabel);
    }
  };
  refreshAudioInput();
  if (canMutateSession && identityVerified && inCall && allowMicrophone && !audioInputRouted && !manualAction) {
    await setMicrophone("off");
    const audioSettings = first(selectors.deviceSettings);
    if (!unavailable(audioSettings) && act(audioSettings)) {
      await waitForUi();
      const choice = selectors.audioDeviceOptions.flatMap((selector) => [...document.querySelectorAll(selector)])
        .find((node) => isVirtualAudioDevice(text(node)) && !unavailable(node));
      const target = choice ? clickable(choice) : undefined;
      if (target && act(target)) {
        await waitForUi();
      }
      audioInputDeviceLabel = selectedMicrophoneLabel();
      audioInputRouted = Boolean(audioInputDeviceLabel);
    }
  }
  if (canMutateSession && identityVerified && !manualAction && (inCall || (autoJoin && join && /^join huddle$/i.test(text(join))))) {
    // Always join muted: the Join transition itself can switch Slack's input. Unmute only in the call,
    // once membership is proven and Slack reports the virtual input, so a physical microphone never goes live.
    refreshAudioInput();
    let desiredMicrophoneState = inCall && allowMicrophone && audioInputRouted ? "on" : "off";
    await setMicrophone(desiredMicrophoneState);
    // Muting is safe whatever the input, so one post-check ends the race: if Slack left the virtual
    // input during that await, mute rather than leave a physical microphone live.
    refreshAudioInput();
    if (desiredMicrophoneState === "on" && !audioInputRouted) {
      desiredMicrophoneState = "off";
      await setMicrophone("off");
    }
    if (microphoneState !== desiredMicrophoneState && !authorityLost) {
      manualAction = manualActionFor("slack-microphone-required", !allowMicrophone
        ? "Turn off the Slack huddle microphone for observe-only mode, then retry."
        : desiredMicrophoneState === "on"
          ? "Turn on the Slack huddle microphone, then retry."
          : "Mute the Slack huddle microphone until the OpenClaw virtual microphone is selected, then retry.");
    }
  }
  if (identityVerified && ownsCameraScope && cameraState !== "off" && !manualAction) {
    manualAction = manualActionFor("slack-camera-required", "Turn off the Slack huddle camera, then retry.");
  }
  let clickedJoin = false;
  if (canMutateSession && identityVerified && autoJoin && !inCall && !manualAction && !authorityLost &&
      !unavailable(join) && /^join huddle$/i.test(text(join))) {
    // Last-moment gate: earlier camera and microphone reads predate awaited work.
    if (!authorityHolds()) {
      authorityLost = true;
    } else if (toggleState(currentCamera(), "camera") === "on") {
      manualAction = manualActionFor("slack-camera-required", "Turn off the Slack huddle camera, then retry.");
    } else if (readMicrophone() === "on") {
      manualAction = manualActionFor("slack-microphone-required", "Mute the Slack huddle microphone before joining, then retry.");
    } else {
      window.__openclawSlackHuddle.joinRequested = true;
      window.__openclawSlackHuddle.joinRequestedAt = Date.now();
      join.click();
      clickedJoin = true;
      notes.push("Clicked Join Huddle for an active Slack huddle.");
    }
  }
  // Everything reported after this point (captions, audio, metadata) reflects the huddle at return time.
  if (inCall && !authorityHolds()) {
    inCall = false;
    authorityLost = true;
  }
  // A workspace binding ends only on proven departure: this session's own channel view (the identity
  // enforces the bound workspace) shows this device out of the huddle.
  if (canMutateSession && channelOnlySession && !inCallControl && !joinSettling &&
      meetingIdentity(location.href) === expectedIdentity &&
      firstRaw(selectors.channelHeader) && !firstRaw(selectors.channelHeaderInHuddle)) {
    delete window.__openclawSlackHuddleWorkspaces?.[expectedIdentity];
  }
  if (authorityLost) {
    notes.push("Slack huddle state changed during status; later controls were left untouched.");
    const promptNow = firstRaw(selectors.multiDevice) || firstRaw(selectors.confirmation);
    if (!manualAction && promptNow) {
      manualAction = firstRaw(selectors.multiDevice)
        ? manualActionFor("slack-session-conflict", "This Slack account is already in a huddle on another device. Resolve the Slack device prompt, then retry.")
        : manualActionFor("slack-confirmation-required", "Complete the Slack confirmation, then retry: " + text(promptNow));
    }
  }`,
	manualActionSource: ""
};
//#endregion
//#region extensions/slack-huddles/src/transports/slack-huddles-urls.ts
function parseSlackHuddleIdentity(input) {
	if (!input) return;
	const value = input.trim();
	const channel = value.replace(/^(?:slack:)?channel:/i, "");
	if (/^[CGD][A-Z0-9]{8,}$/.test(channel)) return { channel };
	const qualified = value.match(/^(?:slack:)?team:([^:]+):channel:([^:]+)$/i);
	const team = qualified?.[1];
	const qualifiedChannel = qualified?.[2];
	if (team && qualifiedChannel && /^[TE][A-Z0-9]{8,}$/.test(team) && /^[CGD][A-Z0-9]{8,}$/.test(qualifiedChannel)) return {
		team,
		channel: qualifiedChannel
	};
	const url = URL.parse(value);
	if (!url || url.protocol !== "https:" || url.port || url.username || url.password || !/^[a-z0-9-]+\.slack\.com$/i.test(url.hostname)) return;
	const match = url.pathname.match(/^\/huddle\/(?:([TE][A-Z0-9]{8,})\/)?([CGD][A-Z0-9]{8,})\/?$/);
	const matchedChannel = match?.[2];
	return matchedChannel ? {
		team: match?.[1],
		channel: matchedChannel
	} : void 0;
}
function normalizeSlackHuddleUrl(input) {
	const identity = typeof input === "string" ? parseSlackHuddleIdentity(input) : void 0;
	if (!identity) throw new SlackHuddlesInvalidRequestError("Use a Slack Copy huddle link (https://app.slack.com/huddle/TEAM/CHANNEL), an uppercase channel id such as C0123ABCD or channel:C0123ABCD, or team:T0123ABCD:channel:C0123ABCD. Message permalinks, user ids, and slack:// links are not huddle links.");
	return `https://app.slack.com/huddle/${identity.team ? `${identity.team}/` : ""}${identity.channel}`;
}
function normalizeSlackHuddleUrlForReuse(url) {
	const identity = parseSlackHuddleIdentity(url);
	if (!identity) return;
	return identity.team ? `slack-huddle:${identity.team}:${identity.channel}` : `slack-huddle:${identity.channel}`;
}
function isSameSlackHuddleUrl(left, right) {
	const identity = normalizeSlackHuddleUrlForReuse(left);
	return Boolean(identity && identity === normalizeSlackHuddleUrlForReuse(right));
}
function isRecoverableSlackHuddleTab(tab, url) {
	return url ? isSameSlackHuddleUrl(tab.url, url) : Boolean(normalizeSlackHuddleUrlForReuse(tab.url));
}
//#endregion
//#region extensions/slack-huddles/src/transports/slack-huddles-page-scripts.ts
function pageIdentityFunctionSource(expectedIdentity) {
	return `const meetingIdentity = (rawUrl) => {
    try {
      const url = new URL(rawUrl);
      if (url.protocol !== "https:" || url.port || url.username || url.password ||
          !/^[a-z0-9-]+\\.slack\\.com$/i.test(url.hostname)) return undefined;
      const match = url.pathname.match(/^\\/huddle\\/(?:([TE][A-Z0-9]{8,})\\/)?([CGD][A-Z0-9]{8,})\\/?$/) ||
        (url.hostname === "app.slack.com" && url.pathname.match(/^\\/client\\/([TE][A-Z0-9]{8,})\\/([CGD][A-Z0-9]{8,})(?:\\/.*)?$/));
      if (!match) return undefined;
      const key = ${/^slack-huddle:[TE][A-Z0-9]+:/.test(expectedIdentity ?? "")} ? (match[1] || "unknown-team") + ":" + match[2] : match[2];
      const identity = "slack-huddle:" + key;
      if (rawUrl !== location.href) return identity;
      const boundWorkspace = window.__openclawSlackHuddleWorkspaces?.[identity];
      if (boundWorkspace && match[1] !== boundWorkspace) return "slack-huddle-other-workspace:" + key;
      // The URL names only the viewed channel. While a call is live, only Slack's membership header for
      // that channel (or this session's own settling Join) vouches for it; anything else fails closed.
      const hooks = ${JSON.stringify({
		inHuddle: SLACK_HUDDLE_SELECTORS.channelHeaderInHuddle,
		inCall: SLACK_HUDDLE_SELECTORS.inCall
	})};
      const found = (list) => list.some((selector) => document.querySelector(selector));
      const marker = window.__openclawSlackHuddle;
      const settlingJoin = marker?.identity === identity && marker.joinRequested === true &&
        Date.now() - (marker.joinRequestedAt || 0) < ${SLACK_HUDDLE_JOIN_SETTLE_MS};
      if (found(hooks.inHuddle)) return identity;
      // Live captions always need membership; a live call without it passes only while our Join settles.
      const captions = window.__openclawSlackHuddleCaptions;
      const captionsActive = Boolean(captions && captions.finalized !== true);
      return captionsActive || (found(hooks.inCall) && !settlingJoin)
        ? "slack-huddle-unverified:" + key
        : identity;
    } catch { return undefined; }
  };`;
}
const slackHuddlePageScripts = MeetingPlatformAdapter.createPageScripts({
	platform: {
		audioOutputElementIdPrefix: "openclaw-slack-huddle-audio-output-",
		manualActionReasonPrefix: "slack",
		displayName: "Slack huddle",
		globals: {
			audioOutputs: "__openclawSlackHuddleAudioOutputs",
			captionArchive: "__openclawSlackHuddleCaptionArchive",
			captions: "__openclawSlackHuddleCaptions",
			meeting: "__openclawSlackHuddle"
		}
	},
	normalizeUrl: normalizeSlackHuddleUrlForReuse,
	pageIdentitySource: pageIdentityFunctionSource,
	selectors: SLACK_HUDDLE_SELECTORS,
	toggleStateFunction: () => `(input) => {
      if (input?.ariaChecked === "true") return "on";
      if (input?.ariaChecked === "false") return "off";
      if (/^unmute microphone(?: unmute microphone)?$/i.test(input?.label || "")) return "off";
      if (/^mute microphone(?: mute microphone)?$/i.test(input?.label || "")) return "on";
      return undefined;
    }`,
	statusPrelude: slackHuddleStatusPrelude,
	statusCall: slackHuddleStatusCall,
	audioOwnershipSource: ({ expectedIdentity, pageIdentitySource }) => `
      ${pageIdentitySource}
      const expectedIdentity = ${JSON.stringify(expectedIdentity)};
      const state = window.__openclawSlackHuddle;
      // Audio never rides on the join-settle exception: Slack's header must show membership, and a
      // channel-only session must already be bound to its workspace.
      const member = ${JSON.stringify(SLACK_HUDDLE_SELECTORS.channelHeaderInHuddle)}
        .some((selector) => document.querySelector(selector));
      const workspaceBound = /^slack-huddle:[TE][A-Z0-9]+:/.test(expectedIdentity || "") ||
        Boolean(window.__openclawSlackHuddleWorkspaces?.[expectedIdentity]);
      return Boolean(expectedIdentity && state?.sessionId === sessionId &&
        state.identity === expectedIdentity && !state.leavePending &&
        meetingIdentity(location.href) === expectedIdentity && member && workspaceBound);
    `,
	leave: {
		controlSource: `const firstMatch = (list) => list.map((selector) => document.querySelector(selector)).find(Boolean);
  const headerInHuddle = Boolean(expectedIdentity && currentIdentity === expectedIdentity &&
    firstMatch(selectors.channelHeaderInHuddle));
  // A channel-only session must still hold its workspace binding (lost on reload) to press Leave.
  const workspaceBound = /^slack-huddle:[TE][A-Z0-9]+:/.test(expectedIdentity || "") ||
    Boolean(window.__openclawSlackHuddleWorkspaces?.[expectedIdentity]);
  const member = headerInHuddle && workspaceBound;
  const switchPrompt = Boolean(firstMatch(selectors.confirmation) || firstMatch(selectors.multiDevice));
  const leave = member && !switchPrompt ? firstMatch(selectors.leave) : undefined;
  const confirmation = undefined;
  // Missing call controls can be a re-render, and a settling Join can still land; only Slack's header,
  // with no Join outstanding, proves the account left.
  const joinSettling = state?.identity === expectedIdentity && state.joinRequested === true &&
    Date.now() - (state.joinRequestedAt || 0) < ${SLACK_HUDDLE_JOIN_SETTLE_MS};
  const provenDeparted = Boolean(firstMatch(selectors.channelHeader)) && !headerInHuddle && !joinSettling;
  const currentUrlMatches = Boolean(expectedIdentity && currentIdentity === expectedIdentity);`,
		departedMarkerSource: "provenDeparted",
		meetingStateSource: "sessionId: expectedSessionId || state?.sessionId,",
		sessionMatchSource: `const sessionMatched = !enforceSessionOwnership ||
      state?.sessionId === expectedSessionId ||
      (!state?.sessionId && currentIdentity === expectedIdentity && (!state?.identity || state.identity === expectedIdentity));`
	}
});
//#endregion
//#region extensions/slack-huddles/src/transports/slack-huddles-platform-adapter.ts
function slackHuddleOrigin(meetingUrl) {
	return normalizeSlackHuddleUrlForReuse(meetingUrl) ? "https://app.slack.com" : void 0;
}
const SLACK_HUDDLES_PLATFORM_ADAPTER = MeetingPlatformAdapter.create({
	id: "slack-huddles",
	displayName: "Slack huddles",
	browserLabel: "Slack huddle",
	logScope: "[slack-huddles]",
	agentConsult: {
		surface: "a private Slack huddle",
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
		idPrefix: "slack_huddle",
		participantIdentity: (transport) => transport === "chrome-node" ? "Slack user in Chrome on a paired node" : "Slack user in the OpenClaw Chrome profile"
	},
	nodeCommandName: "slackhuddles.chrome",
	nodeConfigPath: "plugins.entries.slack-huddles.config.chromeNode.node",
	urls: {
		validateAndNormalize: normalizeSlackHuddleUrl,
		normalizeForReuse: normalizeSlackHuddleUrlForReuse,
		isSameMeeting: isSameSlackHuddleUrl,
		buildJoinUrl: (session) => session.url,
		accountHint: () => void 0,
		isPreferredJoinUrl: (url) => Boolean(normalizeSlackHuddleUrlForReuse(url)),
		isRecoverableTab: isRecoverableSlackHuddleTab,
		localeAction: () => void 0
	},
	...MeetingPlatformAdapter.createBrowserAdapterOptions({
		displayName: "Slack huddle",
		manualActionReasonPrefix: "slack",
		retryCaptions: false,
		unavailableMessage: "Open the OpenClaw browser profile, finish Slack sign-in, admission, or permission prompt, then retry.",
		origin: slackHuddleOrigin,
		scripts: slackHuddlePageScripts
	})
});
//#endregion
//#region extensions/slack-huddles/index.ts
const slackHuddlesPlugin = MeetingPlatformAdapter.defineBrowserMeetingPlugin({
	platform: SLACK_HUDDLES_PLATFORM_ADAPTER,
	labels: {
		meeting: "Slack huddle",
		participant: "Slack user",
		brand: "Slack",
		microphone: "Slack",
		browserPage: "Slack huddle"
	},
	config: {
		defaultRealtimeInstructions: `You are joining a private Slack huddle as an OpenClaw voice transport. Keep spoken replies brief and natural. In agent mode, wait for OpenClaw consult results and speak them exactly. In bidi mode, answer directly and call ${REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME} for deeper reasoning, current information, or tools.`,
		resolveGatewayOperationTimeoutMs: (config) => Math.max(6e4, addTimerTimeoutGraceMs(config.chrome.joinTimeoutMs, config.chrome.waitForInCallMs + config.chrome.joinTimeoutMs + 3e4) ?? 1)
	},
	InvalidRequestError: SlackHuddlesInvalidRequestError,
	toolUrlDescription: "Slack huddle link (Copy huddle link), or an uppercase Slack channel id such as C0123ABCD / channel:C0123ABCD for the huddle in that channel. Workspace-qualified team:T0123ABCD:channel:C0123ABCD (also with a slack: prefix) gives a team-qualified huddle link. In Slack conversations the Conversation info chat_id carries the channel reference.",
	transcriptSource: {
		id: "slack-huddle",
		aliases: ["slack-huddles"],
		providerName: "Slack huddle"
	},
	hooks: { isAwaitingAdmission: (session) => session.chrome?.health?.manualAction?.reason === "slack-admission-required" },
	notInCallMessage: "Slack has not reported that the Slack user is in the huddle.",
	microphoneMutedReason: "slack-microphone-muted",
	setup: {
		captionsMessage: () => "Slack captions depend on the account preference to turn on captions by default when joining huddles",
		connectedNodeMessage: (node) => `Connected Slack huddles node ready: ${node}`,
		guestJoinCheck: (config) => {
			const ok = config.chrome.autoJoin && (config.chrome.launch || config.chrome.reuseExistingTab);
			return {
				ok,
				message: ok ? "Auto-join and Chrome launch or reuse are configured; sign this profile into the dedicated Slack user account" : "Set chrome.autoJoin and either chrome.launch or chrome.reuseExistingTab, then sign the Chrome profile into Slack"
			};
		},
		missingNodeIdMessage: "Connected Slack huddles node did not include a node id."
	},
	defaultSpeechMessage: "Say exactly: Slack huddle speech test complete.",
	shouldWaitForListening: (session) => Boolean(session.chrome?.browserTab?.targetId),
	sharePrerequisiteDeadline: true,
	preserveTrackedBrowserOnEngineFailure: true,
	nodePolicyDeniedCode: "SLACK_HUDDLES_NODE_POLICY_DENIED",
	cli: {
		descriptor: SLACK_HUDDLES_CLI_METADATA.descriptor,
		joinDescription: "join a Slack huddle as the claw’s Slack user"
	}
});
var slack_huddles_default = slackHuddlesPlugin.plugin;
//#endregion
export { slack_huddles_default as default, slackHuddlesPlugin };
