import { n as GOOGLE_MEET_NODE_COMMAND } from "./google-meet-platform-constants-CnRfrYX7.mjs";
import { t as normalizeMeetUrl } from "./meet-url-BP2Jlvjs.mjs";
import { a as isSameMeetUrlForReuse, i as isRecoverableMeetTab, n as forceMeetEnglishUi, o as normalizeMeetUrlForReuse, r as isEnglishMeetTab, s as readMeetAuthUser, t as createMeetWithBrowserProxyOnNode } from "./chrome-create-Bh1L33pr.mjs";
import { asRecord, filterStringEntries, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { MeetingPlatformAdapter } from "openclaw/plugin-sdk/meeting-runtime";
import { createMeetingBrowserAudioCaptureSource } from "openclaw/plugin-sdk/meeting-page-script-runtime";
//#region extensions/google-meet/src/transports/types.ts
const GOOGLE_MEET_TRANSCRIPT_MAX_LINES = 2e3;
//#endregion
//#region extensions/google-meet/src/transports/google-meet-caption-scripts.ts
const CAPTION_LINE_COMMIT_SOURCE = `
  const captionSelf = (value) => value === true ? "self" : value === false ? "other" : "unknown";
  const captionHistoryKey = (text, ownEcho) => JSON.stringify([text, captionSelf(ownEcho)]);
  const captionObservedEcho = (entry) => entry.provenance?.self === "self" ? true : entry.provenance?.self === "other" ? false : undefined;
  const captionOriginMatches = (entry, row) => {
    if (entry.node === row.node && entry.speaker === row.speaker) return true;
    const previous = captionObservedEcho(entry);
    return previous === undefined || row.ownEcho === undefined || previous === row.ownEcho;
  };
  const captionProvenance = (state, row) => Object.freeze({
    observer: "google-meet-caption-dom",
    observationId: (state.sessionId || "unscoped") + ":" + state.epoch + ":observation:" + (state.nextObservationId = (state.nextObservationId || 0) + 1),
    ...(state.sessionId ? { sessionId: state.sessionId } : {}),
    epoch: state.epoch,
    observedAt: new Date(Date.now()).toISOString(),
    ...(row.speaker ? { speaker: row.speaker } : {}),
    self: captionSelf(row.ownEcho)
  });
  const captionLine = (entry) => ({
    at: entry.at,
    speaker: entry.speaker,
    text: entry.text,
    ...(entry.source ? { source: { ...entry.source } } : {}),
    ...(entry.provenance ? { provenance: { ...entry.provenance } } : {})
  });
  const rememberCaptionSource = (state, entry) => {
    if (!entry.source || !state.sourceHistory) return;
    state.sourceRevisions?.set(entry.source.id, Math.max(state.sourceRevisions.get(entry.source.id) || 0, Number(entry.source.revision)));
    // Remember every retained native origin without weakening its sticky source authority.
    const key = captionHistoryKey(entry.text, captionObservedEcho(entry));
    if (state.sourceHistory.has(key) || state.sourceHistory.size < ${GOOGLE_MEET_TRANSCRIPT_MAX_LINES}) {
      state.sourceHistory.set(key, { ...entry.source });
    }
  };
  const reviseCaptionSource = (state, entry, changes) => {
    if (!entry.source) return;
    const revision = Number(entry.source.revision);
    if (revision < (state.sourceRevisions?.get(entry.source.id) || 0)) {
      entry.source = undefined;
      return;
    }
    entry.source = { ...entry.source, ...changes, revision: String(revision + 1) };
  };
  const commitLines = (state, entries, stillVisible = []) => {
    state.lines = Array.isArray(state.lines) ? state.lines : [];
    const liveSources = new Set(stillVisible.flatMap((entry) => entry.source ? [entry.source.id] : []));
    for (const entry of entries) {
      if (entry.source && Number(entry.source.revision) < (state.sourceRevisions?.get(entry.source.id) || 0)) entry.source = undefined;
      if (entry.source && !entry.source.finalized && !liveSources.has(entry.source.id)) {
        reviseCaptionSource(state, entry, { finalized: true });
      }
      rememberCaptionSource(state, entry);
      state.lines.push(captionLine(entry));
    }
    const excess = state.lines.length - ${GOOGLE_MEET_TRANSCRIPT_MAX_LINES};
    if (excess > 0) {
      state.lines.splice(0, excess);
      state.droppedLines = (state.droppedLines || 0) + excess;
    }
  };
`;
function meetTranscriptScript(meetingUrl, meetingSessionId, finalize) {
	const expectedMeetingUrl = normalizeMeetUrlForReuse(meetingUrl);
	return `() => {
  const expectedMeetingUrl = ${JSON.stringify(expectedMeetingUrl)};
  const expectedSessionId = ${JSON.stringify(meetingSessionId)};
  let currentMeetingUrl;
  try {
    const currentUrl = new URL(location.href);
    currentMeetingUrl = currentUrl.origin + currentUrl.pathname.toLowerCase().replace(/\\/$/, "");
  } catch {
    return JSON.stringify({ urlMatched: false });
  }
  if (!expectedMeetingUrl || currentMeetingUrl !== expectedMeetingUrl) {
    return JSON.stringify({ urlMatched: false });
  }
  const state = window.__openclawMeetCaptions;
  ${CAPTION_LINE_COMMIT_SOURCE}
  if (state?.sessionId && state.sessionId !== expectedSessionId) {
    return JSON.stringify({ urlMatched: true, sessionMatched: false });
  }
  if (${JSON.stringify(finalize)} && Array.isArray(state?.visible) && state.visible.length > 0) {
    if (state.settleTimer !== undefined) clearTimeout(state.settleTimer);
    state.settleTimer = undefined;
    commitLines(state, state.visible);
    state.visible = [];
  }
  const lines = Array.isArray(state?.lines) ? state.lines : [];
  return JSON.stringify({
    urlMatched: true,
    sessionMatched: true,
    epoch: typeof state?.epoch === "string" ? state.epoch : undefined,
    droppedLines: Number.isFinite(state?.droppedLines) ? Math.max(0, Math.trunc(state.droppedLines)) : 0,
    lines: lines.map((line) => ({
      at: typeof line?.at === "string" ? line.at : undefined,
      speaker: typeof line?.speaker === "string" ? line.speaker : undefined,
      text: typeof line?.text === "string" ? line.text : "",
      ...(line?.source ? { source: { ...line.source } } : {}),
      ...(line?.provenance ? { provenance: { ...line.provenance } } : {})
    })).filter((line) => line.text),
    pendingLines: (Array.isArray(state?.visible) ? state.visible : []).map(captionLine)
  });
}`;
}
//#endregion
//#region extensions/google-meet/src/transports/google-meet-caption-observer-source.ts
const GOOGLE_MEET_CAPTION_SETTLE_MS = 1e3;
const GOOGLE_MEET_CAPTION_OBSERVER_SOURCE = `
  let captioning = false;
  let captionsEnabledAttempted = false;
  let transcriptLines = 0;
  let lastCaptionAt;
  let lastCaptionSpeaker;
  let lastCaptionText;
  let recentTranscript = [];
  const captionSelector = '[role="region"][aria-label*="aption" i], [aria-live="polite"][role="region"], div[aria-live="polite"]';
  const captionState = (() => {
    if (!captureCaptions) return undefined;
    const w = window;
    if (!inCall && !w.__openclawMeetCaptions) return undefined;
    // A reused tab starts a fresh logical transcript for each OpenClaw session.
    // Status refreshes omit the id, so they preserve the active page-owned buffer.
    if (!w.__openclawMeetCaptions || (captionSessionId && w.__openclawMeetCaptions.sessionId !== captionSessionId)) {
      if (w.__openclawMeetCaptions?.settleTimer !== undefined) {
        clearTimeout(w.__openclawMeetCaptions.settleTimer);
      }
      w.__openclawMeetCaptions?.observer?.disconnect?.();
      w.__openclawMeetCaptions = {
        sessionId: captionSessionId,
        // Epochs cross document lifetimes in the runtime transcript cursor.
        // Strong UUIDs keep a reloaded page distinct from its prior buffer.
        epoch: crypto.randomUUID(),
        enabledAttempted: false,
        observerInstalled: false,
        observer: undefined,
        droppedLines: 0,
        nextSourceId: 0,
        nextObservationId: 0,
        sourceNodes: new WeakMap(),
        sourceHistory: new Map(),
        sourceRevisions: new Map(),
        lines: [],
        settleTimer: undefined,
        visible: []
      };
    }
    return w.__openclawMeetCaptions;
  })();
  const normalizeCaption = (speaker, captionText) => {
    if (!captionState) return;
    const clean = String(captionText || "").replace(/\\s+/g, " ").trim();
    const cleanSpeaker = String(speaker || "").replace(/\\s+/g, " ").trim();
    if (!clean || clean.length < 2) return undefined;
    if (/^(turn on captions|turn off captions|captions)$/i.test(clean)) return undefined;
    return { speaker: cleanSpeaker || undefined, text: clean };
  };
  ${CAPTION_LINE_COMMIT_SOURCE}
  const captionOwnEcho = (node) => {
    const marked = node?.closest?.('[data-is-self]') || node;
    const value = marked?.getAttribute?.("data-is-self");
    return value === "true" ? true : value === "false" ? false : undefined;
  };
  const sourceForCaption = (row, continuing) => {
    // Text is only a replay lookup, never the minted identity. Keep the original
    // handle for ambiguous repeated utterances; their transcript entries remain.
    const known = captionState.sourceNodes?.get(row.node);
    const sameLifecycle = known && captionOriginMatches(known, row) && (continuing || known.text === row.text ||
      known.text.startsWith(row.text) || row.text.startsWith(known.text));
    if (sameLifecycle && !known.source) return undefined;
    if (sameLifecycle && known.text !== row.text && known.text.startsWith(row.text)) return undefined;
    const remembered = sameLifecycle ? known.source : captionState.sourceHistory?.get(captionHistoryKey(row.text, row.ownEcho));
    if (remembered) {
      if (Number(remembered.revision) < (captionState.sourceRevisions?.get(remembered.id) || 0)) return undefined;
      return sameLifecycle && known.text !== row.text
        ? { ...remembered, revision: String(Number(remembered.revision) + 1), finalized: false }
        : { ...remembered };
    }
    // Missing attribution cannot turn remembered speech into fresh authority.
    const unknown = captionState.sourceHistory?.get(captionHistoryKey(row.text, undefined));
    // A text correction does not resolve the native attribution of its older observation.
    if (unknown || (row.ownEcho === undefined && [true, false].some((self) => captionState.sourceHistory?.has(captionHistoryKey(row.text, self))))) return undefined;
    // At the replay bound, retain row provenance but do not mint new authority.
    if (!captionState.sessionId || !captionState.sourceHistory || row.text.length > 16_384 || captionState.sourceHistory.size >= ${GOOGLE_MEET_TRANSCRIPT_MAX_LINES}) return undefined;
    captionState.nextSourceId += 1;
    return {
      id: captionState.sessionId + ":" + captionState.epoch + ":" + captionState.nextSourceId,
      epoch: captionState.epoch,
      revision: "1",
      finalized: false,
      ...(row.ownEcho === undefined ? {} : { ownEcho: row.ownEcho })
    };
  };
  const scrapeCaptions = () => {
    if (!captionState) return;
    const regions = [...document.querySelectorAll(captionSelector)];
    const rows = [];
    for (const region of regions) {
      const raw = text(region);
      if (!raw) continue;
      const pieces = raw.split(/\\n+/).map((part) => part.trim()).filter(Boolean);
      const row = pieces.length >= 2
        ? normalizeCaption(pieces[0], pieces.slice(1).join(" "))
        : normalizeCaption("", pieces[0] || raw);
      if (row) rows.push({ ...row, node: region, ownEcho: captionOwnEcho(region) });
    }
    if (rows.length === 0) {
      // Meet briefly removes caption rows while rerendering. Keep them mutable
      // for one settle window so a DOM gap cannot fabricate a repeated line.
      if (captionState.visible.length > 0 && captionState.settleTimer === undefined) {
        const pendingState = captionState;
        pendingState.settleTimer = setTimeout(() => {
          if (window.__openclawMeetCaptions !== pendingState) return;
          commitLines(pendingState, pendingState.visible);
          pendingState.visible = [];
          pendingState.settleTimer = undefined;
        }, ${GOOGLE_MEET_CAPTION_SETTLE_MS});
      }
      return;
    }
    if (captionState.settleTimer !== undefined) {
      clearTimeout(captionState.settleTimer);
      captionState.settleTimer = undefined;
    }
    const previous = Array.isArray(captionState.visible) ? captionState.visible : [];
    const unmatchedPrevious = [...previous];
    const nextVisible = [];
    const retired = [];
    const now = Date.now();
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const sameNodeIndex = unmatchedPrevious.findIndex((candidate) => candidate.node === row.node);
      const matchesPrior = (candidate) => {
        const sameTextLifecycle =
          candidate.text === row.text ||
          row.text.startsWith(candidate.text) ||
          candidate.text.startsWith(row.text);
        const sameDomLifecycle =
          candidate.node === row.node || now - candidate.seenAt <= ${GOOGLE_MEET_CAPTION_SETTLE_MS};
        return candidate.speaker === row.speaker && captionOriginMatches(candidate, row) && sameTextLifecycle && sameDomLifecycle;
      };
      const priorIndex = sameNodeIndex >= 0
        ? (matchesPrior(unmatchedPrevious[sameNodeIndex]) ? sameNodeIndex : -1)
        : unmatchedPrevious.findIndex(matchesPrior);
      const prior = priorIndex >= 0 ? unmatchedPrevious.splice(priorIndex, 1)[0] : undefined;
      if (prior) {
        if (prior.source && Number(prior.source.revision) < (captionState.sourceRevisions?.get(prior.source.id) || 0)) prior.source = undefined;
        // A shortening often accompanies a DOM redraw; preserve the fuller line.
        const changed = prior.text !== row.text && !prior.text.startsWith(row.text);
        const ownEcho = prior.source?.ownEcho === true || row.ownEcho === true
          ? true : prior.source?.ownEcho ?? row.ownEcho;
        if (prior.source && (changed || ownEcho !== prior.source.ownEcho)) {
          reviseCaptionSource(captionState, prior, { finalized: changed ? false : prior.source.finalized, ...(ownEcho === undefined ? {} : { ownEcho }) });
        }
        if (changed || prior.node !== row.node || prior.provenance?.self !== captionSelf(row.ownEcho)) prior.provenance = captionProvenance(captionState, row);
        if (changed) prior.text = row.text;
        prior.node = row.node;
        prior.seenAt = now;
        captionState.sourceNodes?.set(row.node, prior);
        rememberCaptionSource(captionState, prior);
        nextVisible.push(prior);
        continue;
      }
      // Keep the transcript's existing non-prefix line boundary, while a reused
      // live DOM row cannot turn a correction into a fresh participation source.
      const continuingIndex = unmatchedPrevious.findIndex((candidate) => candidate.node === row.node);
      const continuing = continuingIndex >= 0 ? unmatchedPrevious.splice(continuingIndex, 1)[0] : undefined;
      if (continuing) retired.push(continuing);
      const entry = {
        at: new Date().toISOString(),
        node: row.node,
        seenAt: now,
        speaker: row.speaker,
        text: row.text,
        source: sourceForCaption(row, Boolean(continuing)),
        provenance: captionProvenance(captionState, row)
      };
      const ownEcho = entry.source?.ownEcho === true || row.ownEcho === true
        ? true : entry.source?.ownEcho ?? row.ownEcho;
      if (entry.source && ownEcho !== entry.source.ownEcho) {
        reviseCaptionSource(captionState, entry, { ownEcho });
      }
      captionState.sourceNodes?.set(row.node, entry);
      rememberCaptionSource(captionState, entry);
      nextVisible.push(entry);
    }
    commitLines(captionState, [...retired, ...unmatchedPrevious], nextVisible);
    captionState.visible = nextVisible;
  };
  if (captionState) {
    if (!readOnly && inCall && !captionState.enabledAttempted) {
      const captionButton = findButton(/turn on captions|show captions|captions/i);
      const captionLabel = captionButton ? (captionButton.getAttribute("aria-label") || captionButton.getAttribute("data-tooltip") || text(captionButton)) : "";
      if (captionButton) {
        captionState.enabledAttempted = true;
        captionsEnabledAttempted = true;
        if (!/turn off captions|hide captions/i.test(captionLabel)) {
          captionButton.click();
          notes.push("Attempted to enable Meet captions for observe-only transcript health.");
        }
      }
    } else if (captionState.enabledAttempted) {
      captionsEnabledAttempted = true;
    }
    if (inCall && !captionState.observerInstalled) {
      captionState.observerInstalled = true;
      captionState.observer = new MutationObserver(scrapeCaptions);
      captionState.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["data-is-self"]
      });
      notes.push("Installed Meet caption observer for observe-only transcript health.");
    }
    if (inCall) {
      scrapeCaptions();
    }
    const committedLines = Array.isArray(captionState.lines) ? captionState.lines : [];
    const visibleLines = Array.isArray(captionState.visible) ? captionState.visible : [];
    const lines = [...committedLines, ...visibleLines];
    const last = lines[lines.length - 1];
    captioning = document.querySelector(captionSelector) !== null || lines.length > 0;
    transcriptLines = (captionState.droppedLines || 0) + lines.length;
    lastCaptionAt = last?.at;
    lastCaptionSpeaker = last?.speaker;
    lastCaptionText = last?.text;
    recentTranscript = lines.slice(-5).map(captionLine);
  }
`;
//#endregion
//#region extensions/google-meet/src/transports/google-meet-page-scripts.ts
function meetAudioCaptureScript(params) {
	return createMeetingBrowserAudioCaptureSource({
		...params,
		ownershipSource: `
      const expectedUrl = ${JSON.stringify(normalizeMeetUrlForReuse(params.meetingUrl))};
      const currentUrl = new URL(location.href);
      return Boolean(expectedUrl && window.__openclawMeetAudioSession === sessionId &&
        currentUrl.origin + currentUrl.pathname.toLowerCase().replace(/[/]$/, "") === expectedUrl &&
        [...document.querySelectorAll("button")].some((button) =>
          /leave call/i.test(button.getAttribute("aria-label") || button.textContent || "")));
    `
	});
}
function meetStatusScript(params) {
	return `async () => {
  const text = (node) => (node?.innerText || node?.textContent || "").trim();
  const manualActionFor = (reason, message) => ({ reason, message });
  const allowMicrophone = ${JSON.stringify(params.allowMicrophone)};
  const captionSessionId = ${JSON.stringify(params.captionSessionId)};
  const captureCaptions = ${JSON.stringify(params.captureCaptions)};
  const readOnly = ${JSON.stringify(Boolean(params.readOnly))};
  const buttons = () => [...document.querySelectorAll('button')];
  const buttonLabel = (button) =>
    [
      button.getAttribute("aria-label"),
      button.getAttribute("data-tooltip"),
      text(button),
    ]
      .filter(Boolean)
      .join(" ");
  const buttonLabels = buttons().map(buttonLabel).filter(Boolean);
  const notes = [];
  let audioInputRouted;
  let audioInputDeviceLabel;
  let audioInputRouteError;
  let audioOutputRouted;
  let audioOutputDeviceLabel;
  let audioOutputRouteError;
  const findButton = (pattern) =>
    buttons().find((button) => {
      const label = buttonLabel(button);
      return pattern.test(label) && !button.disabled;
    });
  const findCallControlButton = (pattern) =>
    buttons().find((button) => {
      const label = buttonLabel(button);
      return pattern.test(label) && !/remotely mute|someone else/i.test(label) && !button.disabled;
    });
  const audioDeviceFamily = (value) => {
    const label = String(value || '');
    if (/\\bOpenClaw Meeting Audio\\b/i.test(label)) return 'openclaw-meeting-audio';
    if (/\\bBlackHole\\s+2ch\\b/i.test(label)) return 'blackhole-2ch';
    return undefined;
  };
  const isMeetingAudioDevice = (value) => Boolean(audioDeviceFamily(value));
  const deviceNodeLabel = (node) => [
    node?.getAttribute?.('aria-label'),
    node?.getAttribute?.('data-tooltip'),
    node?.getAttribute?.('title'),
    node?.label,
    node?.textContent,
    node?.innerText,
  ].filter(Boolean).join(' ').trim();
  const waitForUi = () => new Promise((resolve) => setTimeout(resolve, 100));
  const input = [...document.querySelectorAll('input')].find((el) =>
    /your name/i.test(el.getAttribute('aria-label') || el.placeholder || '')
  );
  if (!readOnly && ${JSON.stringify(params.autoJoin)} && input && !input.value) {
    input.focus();
    input.value = ${JSON.stringify(params.guestName)};
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  const pageText = text(document.body).toLowerCase();
  const permissionText = [pageText, ...buttonLabels].join("\\n");
  const host = location.hostname.toLowerCase();
  const pageUrl = location.href;
  const permissionNeeded = /permission needed|microphone problem|speaker problem|allow.*(microphone|camera)|blocked.*(microphone|camera)|permission.*(microphone|camera|speaker)/i.test(permissionText);
  let mic = findCallControlButton(/^\\s*turn (?:off|on) microphone\\b/i);
  if (!mic) {
    const callControls = document.querySelector('[role="region"][aria-label="Call controls"]');
    mic = [...(callControls?.querySelectorAll('button') || [])].find((button) =>
      /^\\s*turn (?:off|on) microphone\\b/i.test(buttonLabel(button))
    );
  }
  const joinElsewhere = findButton(/join here too/i);
  const microphoneChoice = findButton(/\\buse microphone\\b/i);
  const noMicrophoneChoice = findButton(/\\b(continue|join|use) without (microphone|mic)\\b|\\bnot now\\b/i);
  if (!readOnly && allowMicrophone && microphoneChoice) {
    microphoneChoice.click();
    notes.push("Accepted Meet microphone prompt with browser automation.");
    await waitForUi();
  } else if (!readOnly && !allowMicrophone && noMicrophoneChoice) {
    noMicrophoneChoice.click();
    notes.push("Skipped Meet microphone prompt for observe-only mode.");
    await waitForUi();
  }
  const findMicrophoneDeviceControl = () => {
    const selectors = [
      'select[aria-label*="microphone" i]',
      'select[name*="microphone" i]',
      '[role="combobox"][aria-label*="microphone" i]',
      '[role="listbox"][aria-label*="microphone" i]',
      '[aria-haspopup="listbox"][aria-label*="microphone" i]',
    ];
    for (const selector of selectors) {
      const control = document.querySelector(selector);
      if (control) return control;
    }
    return undefined;
  };
  const selectedMicrophoneLabel = () => {
    const control = findMicrophoneDeviceControl();
    const nativeSelected = control?.selectedOptions?.[0];
    if (nativeSelected && isMeetingAudioDevice(deviceNodeLabel(nativeSelected))) {
      return deviceNodeLabel(nativeSelected);
    }
    const controlledId = control?.getAttribute?.('aria-controls');
    const optionsRoot = controlledId ? document.getElementById?.(controlledId) : control;
    const selected = [...(optionsRoot?.querySelectorAll?.(
      '[role="option"][aria-selected="true"], [role="menuitemradio"][aria-checked="true"], [role="radio"][aria-checked="true"]'
    ) || [])].find((node) => isMeetingAudioDevice(deviceNodeLabel(node)));
    if (selected) return deviceNodeLabel(selected);
    const role = control?.getAttribute?.('role');
    if (
      !control?.options &&
      role !== 'listbox' &&
      control &&
      isMeetingAudioDevice(deviceNodeLabel(control))
    ) {
      return deviceNodeLabel(control);
    }
    return undefined;
  };
  const openMicrophoneDeviceSettings = async () => {
    if (findMicrophoneDeviceControl()) return;
    const candidates = () => [
      ...document.querySelectorAll('button, [role="menuitem"], [role="tab"]'),
    ];
    const direct = candidates().find((node) =>
      /\\b(?:audio|microphone|device) settings\\b/i.test(deviceNodeLabel(node)) && !node.disabled
    );
    let settings = direct || candidates().find((node) =>
      /^\\s*settings\\s*$/i.test(deviceNodeLabel(node)) && !node.disabled
    );
    if (!settings && !readOnly) {
      const moreOptions = candidates().find((node) =>
        /^\\s*more options\\s*$/i.test(deviceNodeLabel(node)) && !node.disabled
      );
      if (moreOptions) {
        moreOptions.click();
        await waitForUi();
        settings = candidates().find((node) =>
          /^\\s*settings\\s*$/i.test(deviceNodeLabel(node)) && !node.disabled
        );
      }
    }
    if (!settings || readOnly) return;
    settings.click();
    await waitForUi();
    const audioTab = [...document.querySelectorAll('button, [role="tab"]')].find((node) =>
      /^\\s*audio\\s*$/i.test(deviceNodeLabel(node)) && !node.disabled
    );
    if (audioTab) {
      audioTab.click();
      await waitForUi();
    }
  };
  const routeMeetAudioInput = async () => {
    if (
      !allowMicrophone ||
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.enumerateDevices
    ) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const input = devices.find((device) =>
        device.kind === 'audioinput' && isMeetingAudioDevice(device.label)
      );
      if (!input?.deviceId) {
        audioInputRouted = false;
        audioInputRouteError = 'A supported virtual microphone was not visible to Meet.';
        return;
      }
      audioInputDeviceLabel = input.label || 'OpenClaw meeting audio';
      const inputFamily = audioDeviceFamily(audioInputDeviceLabel);
      if (audioDeviceFamily(selectedMicrophoneLabel()) === inputFamily) {
        audioInputRouted = true;
        return;
      }
      if (readOnly) {
        audioInputRouted = false;
        return;
      }
      await openMicrophoneDeviceSettings();
      const control = findMicrophoneDeviceControl();
      if (!control) {
        audioInputRouted = false;
        audioInputRouteError = 'Meet microphone device selector was not available.';
        return;
      }
      const nativeOptions = [...(control.options || [])];
      const nativeOption = nativeOptions.find(
        (option) => audioDeviceFamily(deviceNodeLabel(option)) === inputFamily
      );
      if (nativeOption) {
        control.value = nativeOption.value;
        nativeOption.selected = true;
        control.dispatchEvent(new Event('input', { bubbles: true }));
        control.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        control.click?.();
        await waitForUi();
        const choices = [...document.querySelectorAll(
          '[role="option"], [role="menuitemradio"], [role="radio"]'
        )];
        const choice = choices.find(
          (node) => audioDeviceFamily(deviceNodeLabel(node)) === inputFamily && !node.disabled
        );
        choice?.click?.();
      }
      await waitForUi();
      audioInputRouted = audioDeviceFamily(selectedMicrophoneLabel()) === inputFamily;
      if (audioInputRouted) {
        notes.push(\`Selected \${audioInputDeviceLabel} as the Meet microphone.\`);
      } else {
        audioInputRouteError = \`Meet did not confirm \${audioInputDeviceLabel} as its microphone.\`;
      }
    } catch (error) {
      audioInputRouted = false;
      audioInputRouteError = error?.message || String(error);
      notes.push(\`Could not select the Meet virtual microphone: \${audioInputRouteError}\`);
    }
  };
  await routeMeetAudioInput();
  mic = findCallControlButton(/^\\s*turn (?:off|on) microphone\\b/i) || mic;
  if (
    !readOnly &&
    allowMicrophone &&
    audioInputRouted !== true &&
    mic &&
    /turn off microphone/i.test(buttonLabel(mic))
  ) {
    mic.click();
    notes.push("Muted the Meet microphone because the virtual audio input was not verified.");
    mic = findCallControlButton(/^\\s*turn (?:off|on) microphone\\b/i) || mic;
  }
  if (!readOnly && allowMicrophone && audioInputRouted === true && mic && /turn on microphone/i.test(buttonLabel(mic))) {
    mic.click();
    notes.push("Turned on the Meet microphone after verifying the virtual audio input.");
  }
  if (!readOnly && !allowMicrophone && mic && /turn off microphone/i.test(mic.getAttribute('aria-label') || text(mic))) {
    mic.click();
    notes.push("Muted Meet microphone for observe-only mode.");
  }
  const join = !readOnly && ${JSON.stringify(params.autoJoin)}
    ? findButton(/join now|ask to join/i)
    : null;
  if (join) join.click();
  const inCall = buttons().some((button) => /leave call/i.test(button.getAttribute('aria-label') || text(button)));
  if (!readOnly && inCall && captionSessionId) {
    const activeCapture = window.__openclawMeetingRemoteAudio;
    if (activeCapture && activeCapture.sessionId !== captionSessionId) {
      return JSON.stringify({ inCall: false, manualAction: manualActionFor("meet-session-conflict", "This Meet tab belongs to another active audio session."), url: location.href, notes });
    }
    window.__openclawMeetAudioSession = captionSessionId;
  }
  const routeMeetAudioOutput = async () => {
    const remoteCapture = window.__openclawMeetingRemoteAudio;
    if (remoteCapture && remoteCapture.sessionId === captionSessionId && remoteCapture.isCurrent()) {
      if (!readOnly) remoteCapture.scan();
      audioOutputRouted = remoteCapture.isCurrent();
      audioOutputDeviceLabel = "Isolated browser playback";
      return;
    }
    if (
      !allowMicrophone ||
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.enumerateDevices
    ) return;
    const mediaElements = [...document.querySelectorAll('audio, video')]
      .filter((el) => typeof el.setSinkId === 'function');
    if (mediaElements.length === 0) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputFamily = audioDeviceFamily(audioInputDeviceLabel);
      const output = devices.find((device) =>
        device.kind === 'audiooutput' &&
        inputFamily &&
        audioDeviceFamily(device.label) === inputFamily
      ) || devices.find((device) =>
        device.kind === 'audiooutput' && isMeetingAudioDevice(device.label)
      );
      if (!output?.deviceId) {
        audioOutputRouted = false;
        if (devices.some((device) => device.kind === 'audiooutput')) {
          notes.push("A supported virtual speaker output was not visible to Meet.");
        }
        return;
      }
      let routed = 0;
      for (const element of mediaElements) {
        if (element.sinkId !== output.deviceId) {
          if (readOnly) {
            continue;
          }
          await element.setSinkId(output.deviceId);
          routed += 1;
        }
      }
      audioOutputRouted = mediaElements.some((element) => element.sinkId === output.deviceId);
      audioOutputDeviceLabel = output.label || "OpenClaw meeting audio";
      if (!readOnly && audioOutputRouted) {
        notes.push(
          routed > 0
            ? \`Routed Meet media output to \${audioOutputDeviceLabel}.\`
            : \`Meet media output already routed to \${audioOutputDeviceLabel}.\`
        );
      }
    } catch (error) {
      audioOutputRouted = false;
      audioOutputRouteError = error?.message || String(error);
      notes.push(\`Could not route Meet speaker output to the virtual audio device: \${audioOutputRouteError}\`);
    }
  };
  if (inCall) {
    await routeMeetAudioOutput();
  }
  ${GOOGLE_MEET_CAPTION_OBSERVER_SOURCE}
  const lobbyWaiting = !inCall && /asking to be let in|you.?ll join when someone lets you in|waiting to be let in|ask to join/i.test(pageText);
  const leaveReason = !inCall && /you left the meeting|you.?ve left the meeting|removed from the meeting|you were removed|call ended|meeting ended/i.test(pageText)
    ? pageText.match(/you left the meeting|you.?ve left the meeting|removed from the meeting|you were removed|call ended|meeting ended/i)?.[0]
    : undefined;
  let manualAction;
  if (!inCall && (host === "accounts.google.com" || /use your google account|to continue to google meet|choose an account|sign in to (join|continue)/i.test(pageText))) {
    manualAction = manualActionFor("google-login-required", "Sign in to Google in the OpenClaw browser profile, then retry the Meet join.");
  } else if (!inCall && joinElsewhere) {
    manualAction = manualActionFor("meet-session-conflict", "Meet is already active in another tab or device. Leave that session or reuse an English-pinned tab before retrying.");
  } else if (!inCall && /asking to be let in|you.?ll join when someone lets you in|waiting to be let in|ask to join/i.test(pageText)) {
    manualAction = manualActionFor("meet-admission-required", "Admit the OpenClaw browser participant in Google Meet, then retry speech.");
  } else if (permissionNeeded) {
    manualAction = manualActionFor("meet-permission-required", allowMicrophone ? "Allow microphone/camera/speaker permissions for Meet in the OpenClaw browser profile, then retry." : "Join without microphone/camera permissions in the OpenClaw browser profile, then retry.");
  } else if (inCall && allowMicrophone && (audioInputRouted !== true || audioOutputRouted !== true)) {
    manualAction = manualActionFor(
      "meet-audio-choice-required",
      "Select BlackHole 2ch or OpenClaw Meeting Audio as both the Meet microphone and speaker, then retry."
    );
  } else if (!inCall && (allowMicrophone ? !microphoneChoice : !noMicrophoneChoice) && /do you want people to hear you in the meeting/i.test(pageText)) {
    manualAction = manualActionFor("meet-audio-choice-required", allowMicrophone ? "Meet is showing the microphone choice. Click Use microphone in the OpenClaw browser profile, then retry." : "Meet is showing the microphone choice. Choose the no-microphone option in the OpenClaw browser profile, then retry.");
  }
  return JSON.stringify({
    clickedJoin: Boolean(join),
    clickedMicrophoneChoice: Boolean(allowMicrophone && microphoneChoice),
    inCall,
    micMuted: mic ? /turn on microphone/i.test(buttonLabel(mic)) : undefined,
    lobbyWaiting,
    leaveReason,
    captioning,
    captionsEnabledAttempted,
    transcriptLines,
    lastCaptionAt,
    lastCaptionSpeaker,
    lastCaptionText,
    recentTranscript,
    audioInputRouted,
    audioInputDeviceLabel,
    audioInputRouteError,
    audioOutputRouted,
    audioOutputDeviceLabel,
    audioOutputRouteError,
    manualAction,
    title: document.title,
    url: pageUrl,
    notes
  });
}`;
}
function meetLeaveScript(meetingUrl) {
	const expectedMeetingUrl = normalizeMeetUrlForReuse(meetingUrl);
	return `() => {
  const expectedMeetingUrl = ${JSON.stringify(expectedMeetingUrl)};
  let currentMeetingUrl;
  try {
    const currentUrl = new URL(location.href);
    currentMeetingUrl = currentUrl.origin + currentUrl.pathname.toLowerCase().replace(/\\/$/, "");
  } catch {
    return JSON.stringify({ departed: false });
  }
  if (!expectedMeetingUrl) {
    return JSON.stringify({ departed: false });
  }
  if (currentMeetingUrl !== expectedMeetingUrl) {
    return JSON.stringify({ departed: true, urlMatched: false });
  }
  const text = (node) => (node?.innerText || node?.textContent || "").trim();
  // Locale-independent fallback: Meet renders the leave control as a Material
  // Symbols icon whose ligature text is "call_end" in every UI language, so a
  // localized aria-label (e.g. "Anruf verlassen") still resolves to the button.
  const hasLeaveIcon = (button) => {
    const icon = button.querySelector ? button.querySelector("i") : null;
    return icon ? (icon.textContent || "").trim() === "call_end" : false;
  };
  const buttons = [...document.querySelectorAll('button')];
  const label = (button) => [
    button.getAttribute("aria-label"),
    button.getAttribute("data-tooltip"),
    text(button),
  ]
    .filter(Boolean)
    .join(" ");
  const postCall = buttons.some((button) => /\\b(rejoin|return to home screen)\\b/i.test(label(button)));
  if (postCall) {
    return JSON.stringify({ departed: true, urlMatched: true });
  }
  // Managed join tabs are reused only after the English-tab gate or opened
  // through the English-UI helper, so follow-up labels are pinned to English.
  const confirmation = buttons.find((button) => {
    return !button.disabled && /\\bleave meeting\\b/i.test(label(button));
  });
  if (confirmation) {
    confirmation.click();
    return JSON.stringify({ departed: false, leaveAction: "confirm", urlMatched: true });
  }
  const leave = buttons.find((button) => {
    if (button.disabled) return false;
    return /leave call/i.test(label(button)) || hasLeaveIcon(button);
  });
  if (leave) {
    leave.click();
    return JSON.stringify({ departed: false, leaveAction: "leave", urlMatched: true });
  }
  return JSON.stringify({ departed: false, urlMatched: true });
}`;
}
//#endregion
//#region extensions/google-meet/src/transports/twilio.ts
const DTMF_PATTERN = /^[0-9*#wWpP,]+$/;
function normalizeDialInNumber(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	const compact = normalized.replace(/[()\s.-]/g, "");
	if (!/^\+?[0-9]{5,20}$/.test(compact)) throw new Error("dialInNumber must be a phone number");
	return compact;
}
function normalizeDtmfSequence(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	const compact = normalized.replace(/\s+/g, "");
	if (!DTMF_PATTERN.test(compact)) throw new Error("dtmfSequence may only contain digits, *, #, comma, w, p");
	return compact;
}
function buildMeetDtmfSequence(params) {
	const explicit = normalizeDtmfSequence(params.dtmfSequence);
	if (explicit) return explicit;
	const pin = normalizeOptionalString(params.pin);
	if (!pin) return;
	const compactPin = pin.replace(/\s+/g, "");
	if (!/^[0-9]+#?$/.test(compactPin)) throw new Error("pin may only contain digits and an optional trailing #");
	return compactPin.endsWith("#") ? compactPin : `${compactPin}#`;
}
function prefixDtmfWait(sequence, delayMs) {
	if (!sequence || delayMs <= 0) return sequence;
	const waitCount = Math.ceil(delayMs / 500);
	if (waitCount <= 0) return sequence;
	return `${"w".repeat(waitCount)}${sequence}`;
}
//#endregion
//#region extensions/google-meet/src/transports/google-meet-platform-adapter.ts
function parsePermissionGrantNotes(result) {
	const unsupportedPermissions = filterStringEntries(asRecord(result).unsupportedPermissions);
	const notes = ["Granted Meet microphone/camera permissions through browser control."];
	if (unsupportedPermissions.includes("speakerSelection")) notes.push("Chrome did not accept the optional Meet speaker-selection permission.");
	return notes;
}
const manualActionCategories = /* @__PURE__ */ new Map([
	["browser-control-unavailable", "browser-control-unavailable"],
	["google-login-required", "login-required"],
	["meet-admission-required", "admission-required"],
	["meet-audio-choice-required", "audio-choice-required"],
	["meet-locale-required", "locale-required"],
	["meet-permission-required", "permission-required"],
	["meet-session-conflict", "session-conflict"]
]);
function classifyManualActionReason(reason) {
	return manualActionCategories.get(reason) ?? "custom";
}
const GOOGLE_MEET_PLATFORM_ADAPTER = MeetingPlatformAdapter.create({
	id: "google-meet",
	displayName: "Google Meet",
	browserLabel: "Meet",
	logScope: "[google-meet]",
	agentConsult: {
		surface: "a private Google Meet",
		userLabel: "Participant",
		assistantLabel: "Agent",
		questionSourceLabel: "participant",
		workingResponseLabel: "participant",
		extraSystemPrompt: [
			"You are a behind-the-scenes consultant for a live meeting voice agent.",
			"Prioritize a fast, speakable answer over exhaustive investigation.",
			"For tool-backed status checks, prefer one or two bounded read-only queries before answering.",
			"Do not print secret values or dump environment variables; only check whether required configuration is present.",
			"Be accurate, brief, and speakable."
		].join(" ")
	},
	session: {
		idPrefix: "meet",
		participantIdentity: (transport) => transport === "twilio" ? "Twilio phone participant" : transport === "chrome-node" ? "signed-in Google Chrome profile on a paired node" : "signed-in Google Chrome profile"
	},
	nodeCommandName: GOOGLE_MEET_NODE_COMMAND,
	nodeConfigPath: "plugins.entries.google-meet.config.chromeNode.node",
	urls: {
		validateAndNormalize: normalizeMeetUrl,
		normalizeForReuse: normalizeMeetUrlForReuse,
		isSameMeeting: isSameMeetUrlForReuse,
		buildJoinUrl: (session) => forceMeetEnglishUi(session.url),
		accountHint: readMeetAuthUser,
		isPreferredJoinUrl: isEnglishMeetTab,
		isRecoverableTab: isRecoverableMeetTab,
		localeAction: (tab) => {
			if (!normalizeMeetUrlForReuse(tab.url) || isEnglishMeetTab(tab.url)) return;
			return {
				category: "locale-required",
				reason: "meet-locale-required",
				message: "The existing Meet tab is not pinned to English. Open the meeting with ?hl=en, then retry recovery."
			};
		}
	},
	browser: {
		buildAudioCaptureScript: meetAudioCaptureScript,
		allowsMicrophone: MeetingPlatformAdapter.isTalkBackMode,
		buildStatusJoinScript: (params) => meetStatusScript({
			allowMicrophone: MeetingPlatformAdapter.isTalkBackMode(params.mode),
			autoJoin: params.autoJoin,
			captionSessionId: params.meetingSessionId || void 0,
			captureCaptions: params.captureCaptions,
			guestName: params.guestName,
			readOnly: params.readOnly
		}),
		shouldRetryJoinStatus: (health) => health.inCall === true && health.manualAction?.reason === "meet-audio-choice-required" && (health.audioInputRouted !== true || health.audioOutputRouted !== true),
		browserControlUnavailable: () => ({
			category: "browser-control-unavailable",
			reason: "browser-control-unavailable",
			message: "Open the OpenClaw browser profile, finish Google Meet login, admission, or permission prompts, then retry."
		}),
		buildLeaveScript: meetLeaveScript,
		captions: {
			enabled: (_mode) => true,
			buildTranscriptScript: ({ finalize, meetingSessionId, meetingUrl }) => meetTranscriptScript(meetingUrl, meetingSessionId, finalize)
		},
		permissions: ({ allowMicrophone }) => allowMicrophone ? {
			origin: "https://meet.google.com",
			permissions: ["audioCapture", "videoCapture"],
			optionalPermissions: ["speakerSelection"]
		} : void 0,
		permissionNotes: ({ allowMicrophone, error, result }) => {
			if (!allowMicrophone) return ["Observe-only mode skips Meet microphone/camera permission grants."];
			if (error) return [`Could not grant Meet media permissions automatically: ${formatErrorMessage(error)}`];
			return parsePermissionGrantNotes(result);
		}
	},
	create: { browser: createMeetWithBrowserProxyOnNode },
	dialIn: { buildPlan: (params) => {
		const number = normalizeDialInNumber(params.dialInNumber ?? params.defaultDialInNumber);
		const pin = params.pin ?? params.defaultPin;
		const rawDtmfSequence = buildMeetDtmfSequence({
			pin,
			dtmfSequence: params.dtmfSequence ?? params.defaultDtmfSequence
		});
		return {
			number,
			pin,
			dtmfSequence: params.dtmfSequence || params.defaultDtmfSequence ? rawDtmfSequence : prefixDtmfWait(rawDtmfSequence, params.dtmfDelayMs)
		};
	} },
	parsing: {
		classifyManualActionReason,
		displayName: "Meet",
		invalidTranscriptMessage: "Google Meet transcript payload is invalid.",
		malformedStatusMessage: "Google Meet browser status JSON is malformed.",
		malformedTranscriptMessage: "Google Meet transcript JSON is malformed.",
		statusFields: (parsed) => ({ leaveReason: typeof parsed.leaveReason === "string" ? parsed.leaveReason : void 0 })
	}
});
//#endregion
export { normalizeDialInNumber as n, GOOGLE_MEET_PLATFORM_ADAPTER as t };
