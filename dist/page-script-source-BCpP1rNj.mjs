//#region src/meeting-bot/browser-audio-capture-source.ts
/** Captures browser playback before the native virtual microphone bus. */
function createMeetingBrowserAudioCaptureSource(params) {
	return `async () => {
  const action = ${JSON.stringify(params.action)};
  const captureId = ${JSON.stringify(params.captureId)};
  const sessionId = ${JSON.stringify(params.meetingSessionId)};
  const ownsSession = () => { ${params.ownershipSource} };
  const current = window.__openclawMeetingRemoteAudio;
  if (action === "stop") {
    if (current?.captureId === captureId) await current.stop();
    return JSON.stringify({ closed: true, captureId });
  }
  if (action === "pull") {
    if (!current || current.captureId !== captureId || !current.isCurrent()) {
      if (current?.captureId === captureId) await current.stop();
      return JSON.stringify({ closed: true, captureId });
    }
    current.lastPull = Date.now();
    current.scan();
    if (current.error) throw new Error(current.error);
    const chunks = current.chunks.splice(0);
    let binary = "";
    for (const chunk of chunks) for (const byte of chunk) binary += String.fromCharCode(byte);
    return JSON.stringify({ captureId, isolated: true, base64: btoa(binary) });
  }
  if (!ownsSession()) throw new Error("Meeting audio capture no longer owns this browser session.");
  if (current) throw new Error("Meeting browser audio capture is already active.");
  const context = new AudioContext({ sampleRate: 24000 });
  const entries = new Map();
  const pendingMute = new Map();
  const sourceNodes = new Map();
  const mutedBridges = new Map();
  const chunks = [];
  let observer;
  let timer;
  let processor;
  let stopped = false;
  let deviceRefresh;
  let inputDevices = new Set(["default", "communications"]);
  let inputGroups = new Set();
  const sourceUrl = (element) => String(element.currentSrc || element.src || "");
  const ownsMutedSource = (entry, liveTracks) => entry.stream
    ? entry.element.srcObject === entry.stream &&
      (liveTracks ?? entry.stream.getAudioTracks().filter((track) => track.readyState === "live"))
        .every((track) => entry.tracks.includes(track))
    : !entry.element.srcObject && sourceUrl(entry.element) === entry.url;
  const sameSource = (entry) => {
    const liveTracks = entry.stream && entry.element.srcObject === entry.stream
      ? entry.stream.getAudioTracks().filter((track) => track.readyState === "live")
      : undefined;
    return ownsMutedSource(entry, liveTracks) && (!entry.stream || (
      liveTracks.length === entry.tracks.length &&
      entry.tracks.every((track) => track.readyState === "live")
    ));
  };
  const restoreOwnedMute = (entry, restore = capture.isCurrent()) => {
    if (restore && ownsMutedSource(entry)) entry.element.muted = entry.muted;
  };
  const capture = {
    captureId, sessionId, chunks, lastPull: Date.now(), error: undefined,
    isCurrent: () => !stopped && window.__openclawMeetingRemoteAudio === capture && ownsSession(),
    stop: async () => {
      if (stopped) return;
      const restore = capture.isCurrent();
      stopped = true;
      clearInterval(timer);
      observer?.disconnect();
      document.removeEventListener("play", scan, true);
      document.removeEventListener("loadedmetadata", scan, true);
      window.removeEventListener("pagehide", onPageHide);
      navigator.mediaDevices.removeEventListener("devicechange", onDeviceChange);
      for (const entry of entries.values()) {
        if (entry.captured) entry.captured.getTracks().forEach((track) => track.stop());
        restoreOwnedMute(entry, restore);
      }
      for (const entry of pendingMute.values()) {
        restoreOwnedMute(entry, restore);
      }
      for (const entry of mutedBridges.values()) {
        restoreOwnedMute(entry, restore);
      }
      entries.clear();
      pendingMute.clear();
      for (const node of sourceNodes.values()) node.disconnect();
      sourceNodes.clear();
      mutedBridges.clear();
      chunks.length = 0;
      processor?.disconnect();
      if (window.__openclawMeetingRemoteAudio === capture) delete window.__openclawMeetingRemoteAudio;
      await context.close();
    },
    scan: () => scan(),
  };
  const onPageHide = () => { void capture.stop(); };
  const ownedOutputEntries = () => {
    const all = ${params.audioOutputsGlobal ? `window[${JSON.stringify(params.audioOutputsGlobal)}]` : "undefined"};
    return Array.isArray(all) ? all.filter((entry) => entry?.sessionId === sessionId) : [];
  };
  const outputSources = (entry) => Array.isArray(entry.sources) ? entry.sources : entry.source
    ? [{ element: entry.source, muted: Boolean(entry.sourceMuted), stream: entry.stream }]
    : [];
  const hasDeviceTrack = (tracks) => tracks.some((track) => {
    const settings = track.getSettings();
    // Chromium receiver tracks also have deviceId (equal to the track id).
    // Only device identities actually enumerated as inputs identify microphone audio.
    return Boolean(inputDevices.has(settings.deviceId) || inputGroups.has(settings.groupId));
  });
  const refreshDevices = () => {
    deviceRefresh ??= (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      if (!capture.isCurrent()) throw new Error("Meeting changed while audio devices were being inspected.");
      const inputs = devices.filter((device) => device.kind === "audioinput");
      inputDevices = new Set(["default", "communications", ...inputs.map((device) => device.deviceId).filter(Boolean)]);
      inputGroups = new Set(inputs.map((device) => device.groupId).filter(Boolean));
    })().finally(() => { deviceRefresh = undefined; });
    return deviceRefresh;
  };
  const onDeviceChange = () => {
    chunks.length = 0;
    void refreshDevices().then(scan).catch((error) => {
      capture.error = error?.message || String(error);
      void capture.stop();
    });
  };
  function scan() {
    if (!capture.isCurrent() || Date.now() - capture.lastPull > 10000) {
      void capture.stop();
      return;
    }
    if (deviceRefresh) return;
    try {
      const bridges = ownedOutputEntries();
      const bridgeElements = new Set(bridges.map((entry) => entry.bridge).filter(Boolean));
      for (const [bridge, entry] of mutedBridges) {
        if (!bridgeElements.has(bridge) || !ownsMutedSource(entry)) {
          restoreOwnedMute(entry);
          mutedBridges.delete(bridge);
        }
      }
      const ownedSources = new Map(bridges.flatMap((entry) => outputSources(entry).map((source) => [source.element, source])));
      const elements = new Set(document.querySelectorAll("audio, video"));
      for (const [element, entry] of pendingMute) {
        if (!elements.has(element)) {
          restoreOwnedMute(entry);
          pendingMute.delete(element);
        }
      }
      for (const [element, entry] of entries) {
        if (!elements.has(element) || !sameSource(entry) || hasDeviceTrack(entry.tracks)) {
          chunks.length = 0;
          if (entry.captured) entry.captured.getTracks().forEach((track) => track.stop());
          // Retain the source and track identities when input goes idle so stop
          // can undo our mute without touching replacement media on this element.
          if (elements.has(element)) pendingMute.set(element, entry);
          else restoreOwnedMute(entry);
          entries.delete(element);
        }
      }
      for (const entry of entries.values()) {
        entry.element.muted = true;
      }
      for (const element of elements) {
        if (bridgeElements.has(element) || entries.has(element)) continue;
        const owned = ownedSources.get(element);
        const pending = pendingMute.get(element);
        const originalMute = pending ? pending.muted
          : owned && owned.stream === element.srcObject ? owned.muted : element.muted;
        if (originalMute) continue;
        const stream = element.srcObject;
        const tracks = stream?.getAudioTracks?.().filter((track) => track.readyState === "live") || [];
        // Device-backed tracks include the virtual microphone and must never enter provider input.
        if (hasDeviceTrack(tracks)) {
          if (pending) restoreOwnedMute(pending);
          pendingMute.delete(element);
          continue;
        }
        if (stream && !tracks.length) continue;
        if (!stream && (!sourceUrl(element) || element.readyState < 2)) continue;
        if (entries.size + pendingMute.size >= 64 && !pending) throw new Error("Meeting remote audio source limit exceeded.");
        const captured = stream ? undefined : element.captureStream();
        const audioTracks = stream ? tracks : captured.getAudioTracks();
        if (!audioTracks.length || hasDeviceTrack(audioTracks)) {
          captured?.getTracks().forEach((track) => track.stop());
          continue;
        }
        entries.set(element, { element, stream, url: sourceUrl(element), muted: Boolean(originalMute), captured, tracks: audioTracks });
        pendingMute.delete(element);
        element.muted = true;
      }
      const tracks = new Set([...entries.values()].flatMap((entry) => entry.tracks));
      if (tracks.size > 64) throw new Error("Meeting remote audio track limit exceeded.");
      for (const [track, node] of sourceNodes) {
        if (!tracks.has(track)) { node.disconnect(); sourceNodes.delete(track); }
      }
      for (const track of tracks) {
        if (sourceNodes.has(track)) continue;
        const node = context.createMediaStreamSource(new MediaStream([track]));
        node.connect(processor);
        sourceNodes.set(track, node);
      }
      for (const entry of bridges) {
        if (!entry.bridge) continue;
        if (!mutedBridges.has(entry.bridge)) mutedBridges.set(entry.bridge, {
          element: entry.bridge,
          muted: entry.bridge.muted,
          stream: entry.bridge.srcObject,
          tracks: entry.bridge.srcObject?.getAudioTracks?.() || [],
          url: sourceUrl(entry.bridge),
        });
        entry.bridge.muted = true;
      }
    } catch (error) {
      capture.error = error?.message || String(error);
      void capture.stop();
    }
  }
  window.__openclawMeetingRemoteAudio = capture;
  try {
    navigator.mediaDevices.addEventListener("devicechange", onDeviceChange);
    await refreshDevices();
    // Page CSP can prohibit blob AudioWorklet modules. This native WebAudio node
    // needs neither an injected module nor a CSP bypass and emits ~21 ms frames.
    processor = context.createScriptProcessor(512, 1, 1);
    processor.connect(context.destination);
    processor.onaudioprocess = ({ inputBuffer }) => {
      if (!capture.isCurrent()) { void capture.stop(); return; }
      if (deviceRefresh) return;
      // Recheck source identity before admitting an asynchronously delivered render quantum.
      if ([...entries.values()].some((entry) => !sameSource(entry))) { chunks.length = 0; scan(); return; }
      const data = inputBuffer.getChannelData(0);
      const pcm = new Uint8Array(data.length * 2);
      const view = new DataView(pcm.buffer);
      for (let index = 0; index < data.length; index++) view.setInt16(index * 2, Math.round(Math.max(-1, Math.min(1, data[index])) * 32767), true);
      chunks.push(pcm);
      // One second of 512-sample frames; stale backlog never grows without bound.
      if (chunks.length > 47) chunks.splice(0, chunks.length - 47);
    };
    await context.resume();
    if (!capture.isCurrent() || context.state !== "running") throw new Error("Meeting browser audio capture could not start. Enable audio playback in the meeting tab and retry.");
    scan();
    if (capture.error) throw new Error(capture.error);
    observer = new MutationObserver(scan);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener("play", scan, true);
    document.addEventListener("loadedmetadata", scan, true);
    window.addEventListener("pagehide", onPageHide);
    timer = setInterval(scan, 100);
    return JSON.stringify({ captureId, isolated: true });
  } catch (error) {
    await capture.stop();
    throw error;
  }
}`;
}
//#endregion
//#region src/meeting-bot/audio-bridge-source.ts
const MEETING_AUDIO_BRIDGE_SOURCE = `  const mediaSourceUrl = (element) => String(element?.currentSrc || element?.src || "");
  const bridgeSources = (entry) => Array.isArray(entry?.sources)
    ? entry.sources
    : entry?.source
      ? [{ element: entry.source, muted: Boolean(entry.sourceMuted), pending: Boolean(entry.pending), stream: entry.stream, url: entry.sourceUrl }]
      : [];
  const bridgeSourceMatches = (element, source) => {
    if (!element) return false;
    if (source?.pending && mediaSourceIsEmpty(element) && !source.stream && !source.url) return true;
    if (source?.stream || element.srcObject) return element.srcObject === source?.stream;
    const currentUrl = mediaSourceUrl(element);
    return Boolean(source?.url && currentUrl && source.url === currentUrl);
  };
  const mediaSourceIsEmpty = (element) => Boolean(
    element && !element.srcObject && !mediaSourceUrl(element)
  );
  const restoreAudioBridgeSource = (source) => {
    const element = source?.element;
    // An empty element may receive a replacement source after cleanup. Keep it
    // silent because there is no source identity that is safe to restore.
    if (mediaSourceIsEmpty(element)) {
      element.muted = true;
      return;
    }
    // Teams reuses media elements across source changes. Restore only the exact
    // source this bridge muted.
    if (!bridgeSourceMatches(element, source)) return;
    const detachedLiveSource = Boolean(
      element.isConnected === false &&
      element.srcObject?.getAudioTracks?.().some((track) => track.readyState === "live")
    );
    if (detachedLiveSource) {
      element.muted = true;
      element.pause?.();
      element.srcObject = null;
      return;
    }
    element.muted = Boolean(source.muted);
  };
  const retireAudioBridge = (entry, restoreSources = true) => {
    if (restoreSources) bridgeSources(entry).forEach(restoreAudioBridgeSource);
    entry?.bridge?.pause?.();
    if (entry?.bridge) entry.bridge.srcObject = null;
    entry?.bridge?.remove?.();
  };`;
//#endregion
//#region src/meeting-bot/status-call-ownership-source.ts
/**
* In-page prelude for platforms that opt into live ownership checks during the shared status tail's
* media routing. It opens the `audioOutputRouting` block that the tail closes after routing.
*/
function createMeetingRoutingOwnershipSource(params) {
	return `
  const routingSources = [];
  const routingBridges = [];
  const recheckAudioOwnership = () => {
    if (${params.liveOwnershipSource}) return true;
    // A session that took over the page now owns this media; undoing our pass would clobber its routing.
    const replacedBy = window[${params.meetingGlobal}]?.sessionId;
    if (canMutateSession && !(replacedBy && replacedBy !== sessionId)) {
      routingBridges.forEach((entry) => retireAudioBridge(entry, false));
      retireOwnedAudioBridges();
      routingSources.forEach((source) => {
        restoreAudioBridgeSource(source);
        // A direct sink change can finish after ownership moved; return that exact source's playback.
        if (bridgeSourceMatches(source.element, source) && source.element.sinkId !== source.sinkId) {
          const pending = (window.__openclawMeetingSinkRestores ||= new Set());
          const restore = source.element
            .setSinkId(source.sinkId)
            .catch(() => {})
            .finally(() => pending.delete(restore));
          pending.add(restore);
        }
      });
    }
    audioOutputRouted = false;
    audioOutputRouteRetryable = true;
    notes.push("Call ownership changed during audio routing; stopped this pass.");
    return false;
  };
  // Restores from an earlier ownership loss stay in flight until they settle, so every overlapping
  // pass waits for them before routing again.
  if (window.__openclawMeetingSinkRestores?.size) {
    await Promise.allSettled([...window.__openclawMeetingSinkRestores]);
  }
  audioOutputRouting: {`;
}
//#endregion
//#region src/meeting-bot/status-call-source.ts
function createMeetingStatusCallSource(options) {
	const captionSettleMs = options.captionSettleMs ?? 1e3;
	const audioOutputsGlobal = JSON.stringify(options.platform.globals.audioOutputs);
	const captionsGlobal = JSON.stringify(options.platform.globals.captions);
	const meetingGlobal = JSON.stringify(options.platform.globals.meeting);
	const transcriptMaxLines = options.transcriptMaxLines ?? 500;
	const withLiveOwnership = (source) => options.liveOwnershipSource === void 0 ? "" : source;
	const ownershipCheck = (indent) => withLiveOwnership(`\n${" ".repeat(indent)}if (!recheckAudioOwnership()) break audioOutputRouting;`);
	return `  let audioOutputRouted;
  let audioOutputDeviceLabel;
  let audioOutputRouteError;
  let audioOutputRouteRetryable = false;${options.liveOwnershipSource === void 0 ? "" : createMeetingRoutingOwnershipSource({
		liveOwnershipSource: options.liveOwnershipSource,
		meetingGlobal
	})}
  const remoteCapture = window.__openclawMeetingRemoteAudio;
  if (remoteCapture && remoteCapture.sessionId === sessionId && remoteCapture.isCurrent()) {
    if (canMutateSession) remoteCapture.scan();
    audioOutputRouted = remoteCapture.isCurrent();
    audioOutputDeviceLabel = "Isolated browser playback";
  } else if (inCall && allowMicrophone && navigator.mediaDevices?.enumerateDevices) {
    const media = [...document.querySelectorAll("audio, video")].filter(
      (element) =>
        typeof element.setSinkId === "function" &&
        !String(element.id || "").startsWith(${JSON.stringify(options.platform.audioOutputElementIdPrefix)}),
    );
    if (media.length > 0) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();${ownershipCheck(8)}
        const output = devices.find(
          (device) => device.kind === "audiooutput" && isVirtualAudioDevice(device.label)
        );
        if (output?.deviceId) {
          const routeErrors = [];
          const liveStream = (element) =>
            element.srcObject?.getAudioTracks?.().some((track) => track.readyState === "live")
              ? element.srcObject
              : undefined;
          const allBridgeEntries = Array.isArray(window[${audioOutputsGlobal}])
            ? window[${audioOutputsGlobal}]
            : [];
          const retainedBridgeEntries = allBridgeEntries.filter((entry) => !bridgeOwnedBySession(entry));
          const previousBridgeEntries = allBridgeEntries.filter(bridgeOwnedBySession);
          const originalMuteBySource = new Map(previousBridgeEntries.flatMap((entry) =>
            bridgeSources(entry).flatMap((source) =>
              source?.element ? [[source.element, Boolean(source.muted)]] : []
            )
          ));
          const bridgedElements = new Set(previousBridgeEntries.flatMap((entry) =>
            bridgeSources(entry).map((source) => source?.element).filter(Boolean)
          ));
          const routeCandidates = media
            .map((element) => ({ element, stream: liveStream(element) }))
            // Teams mutes local/self-view and intentionally suppressed playback. Preserve
            // that product decision; only our own already-bridged source stays eligible.
            .filter((entry) => !entry.element.muted || bridgedElements.has(entry.element));
          // The self-view often exists before Teams attaches remote playback. With the
          // required output present, an all-filtered list is still a transient DOM state.
          if (routeCandidates.length === 0) audioOutputRouteRetryable = true;
          if (canMutateSession) {
            for (const { element } of routeCandidates) {
              if (!originalMuteBySource.has(element)) {
                originalMuteBySource.set(element, Boolean(element.muted));
              }
              // Sink changes are asynchronous. Silence the physical output until either
              // the source or its fallback bridge is confirmed on the virtual device.
              ${withLiveOwnership(`routingSources.push({
                element,
                muted: originalMuteBySource.get(element),
                sinkId: element.sinkId,
                stream: element.srcObject,
                url: mediaSourceUrl(element),
              });
              `)}element.muted = true;
            }
          }
          const currentSources = new Set(routeCandidates.map((entry) => entry.element));
          const bridgeEntries = previousBridgeEntries.filter((entry) =>
            entry?.source &&
            entry?.stream === liveStream(entry.source) &&
            entry?.bridge?.isConnected &&
            currentSources.has(entry.source)
          );
          const suspendedBySource = new Map();
          for (const entry of previousBridgeEntries) {
            if (bridgeEntries.includes(entry)) continue;
            for (const source of bridgeSources(entry)) {
              if (
                !source?.element ||
                source.muted ||
                !bridgeSourceMatches(source.element, source)
              ) continue;
              const sourceStillPresent = currentSources.has(source.element);
              const detachedLiveSource = !sourceStillPresent && Boolean(liveStream(source.element));
              if (!sourceStillPresent && !detachedLiveSource) continue;
              suspendedBySource.set(source.element, {
                detached: detachedLiveSource,
                sessionId: entry.sessionId || sessionId,
                source: source.element,
                sourceMuted: false,
                sourceUrl: mediaSourceUrl(source.element) || source.url,
                stream: source.element.srcObject,
                suspended: true,
              });
            }
          }
          if (canMutateSession) {
            // One bridge owns one Teams playback element. Stream or element replacement
            // retires that bridge so it cannot keep playing or satisfy route verification.
            previousBridgeEntries.filter((entry) => !bridgeEntries.includes(entry)).forEach((entry) => {
              for (const source of bridgeSources(entry)) {
                if (
                  !source?.element ||
                  suspendedBySource.has(source.element) ||
                  currentSources.has(source.element)
                ) continue;
                restoreAudioBridgeSource(source);
              }
              // Reused current elements stay silent until this pass confirms their
              // replacement source; unrelated exact sources were restored above.
              retireAudioBridge(entry, false);
            });
          }
          const routed = [];
          for (const { element, stream } of routeCandidates) {
            let entry = bridgeEntries.find((candidate) => candidate.source === element);
            let elementRouted = element.sinkId === output.deviceId;
            let directRouteError;
            if (canMutateSession && !elementRouted) {
              try {
                await element.setSinkId(output.deviceId);${ownershipCheck(16)}
                elementRouted = element.sinkId === output.deviceId;
              } catch (error) {${ownershipCheck(16)}
                directRouteError = {
                  message: error?.message || String(error),
                  retryable: error?.name === "AbortError",
                };
              }
            }
            if (elementRouted && entry && canMutateSession) {
              const bridgedIndex = bridgeEntries.indexOf(entry);
              if (bridgedIndex >= 0) {
                const [bridged] = bridgeEntries.splice(bridgedIndex, 1);
                retireAudioBridge(bridged);
                entry = undefined;
              }
            }
            // Direct sink routing is valid for src/MediaSource and pre-attachment elements.
            // A live MediaStream is required only when the hidden bridge fallback is needed.
            if (elementRouted) {
              if (canMutateSession && originalMuteBySource.has(element)) {
                element.muted = originalMuteBySource.get(element);
              }
              suspendedBySource.delete(element);
              routed.push(true);
              continue;
            }
            if (!stream) {
              const hasLoadedPlaybackSource = Number(element.readyState) > 0;
              routed.push(false);
              if (hasLoadedPlaybackSource && directRouteError) routeErrors.push(directRouteError);
              if (!hasLoadedPlaybackSource) audioOutputRouteRetryable = true;
              if (canMutateSession && originalMuteBySource.get(element) === false) {
                // Teams may attach the remote MediaStream after creating its media element.
                // Keep it silent until a later serialized status poll routes that source.
                suspendedBySource.set(element, {
                  sessionId,
                  pending: true,
                  source: element,
                  sourceMuted: false,
                  sourceUrl: mediaSourceUrl(element),
                  stream: element.srcObject,
                  suspended: true,
                });
              }
              continue;
            }
            if (!elementRouted && stream) {
              if (!entry && canMutateSession) {
                const bridge = document.createElement("audio");
                bridge.id = ${JSON.stringify(options.platform.audioOutputElementIdPrefix)} + bridgeEntries.length;
                bridge.autoplay = false;
                bridge.hidden = true;
                bridge.srcObject = stream;
                document.body.appendChild(bridge);
                entry = {
                  bridge,
                  playing: false,
                  sessionId,
                  source: element,
                  sourceMuted: originalMuteBySource.has(element)
                    ? originalMuteBySource.get(element)
                    : Boolean(element.muted),
                  sourceUrl: mediaSourceUrl(element),
                  stream,
                };
                bridgeEntries.push(entry);${withLiveOwnership("\n                routingBridges.push(entry);")}
                suspendedBySource.delete(element);
              }
              if (entry?.bridge) {
                try {
                  if (canMutateSession) {
                    if (entry.bridge.sinkId !== output.deviceId) {
                      await entry.bridge.setSinkId(output.deviceId);${ownershipCheck(22)}
                    }
                    await entry.bridge.play();${ownershipCheck(20)}
                    entry.playing = true;
                  }
                  elementRouted =
                    entry.bridge.sinkId === output.deviceId && entry.playing === true;
                  if (elementRouted) {
                    suspendedBySource.delete(element);
                    if (canMutateSession && !entry.sourceMuted) element.muted = true;
                  }
                } catch (error) {${ownershipCheck(18)}
                  entry.playing = false;
                  if (canMutateSession) retireAudioBridge(entry, false);
                  routeErrors.push({
                    message: error?.message || String(error),
                    retryable: error?.name === "AbortError",
                  });
                }
              }
            }
            routed.push(elementRouted);
          }
          if (canMutateSession) {
            const nextBridgeEntries = [
              ...retainedBridgeEntries,
              ...bridgeEntries,
              ...suspendedBySource.values(),
            ];
            if (nextBridgeEntries.length > 0) {
              window[${audioOutputsGlobal}] = nextBridgeEntries;
            } else {
              delete window[${audioOutputsGlobal}];
            }
          }
          audioOutputRouted = routed.length > 0 && routed.every(Boolean);
          if (canMutateSession && !audioOutputRouted) suspendOwnedAudioBridges();
          if (audioOutputRouted && bridgeEntries.length > 0) {
            notes.push(
              "Routed ${options.platform.displayName} remote audio to " +
              (output.label || "the virtual audio device") +
              " through MediaStream bridges."
            );
          }
          audioOutputDeviceLabel = output.label || "Virtual audio device";
          // An unloaded Teams media element can reject setSinkId before its stream
          // arrives. Keep that state retryable; loaded-source failures are terminal.
          if (!audioOutputRouted && routed.length > 0 && routeErrors.length > 0) {
            audioOutputRouteError = routeErrors[routeErrors.length - 1]?.message;
            audioOutputRouteRetryable = routeErrors.every((error) => error.retryable === true);
          }
        } else {
          audioOutputRouted = false;
          if (canMutateSession) suspendOwnedAudioBridges();
          notes.push("The OpenClaw virtual audio speaker output was not visible to ${options.platform.displayName}.");
        }
      } catch (error) {${ownershipCheck(8)}
        audioOutputRouted = false;
        audioOutputRouteError = error?.message || String(error);
        if (canMutateSession) suspendOwnedAudioBridges();
      }
      if (!audioOutputRouted && audioOutputRouteError) {
        notes.push("Could not route ${options.platform.displayName} speaker output to the OpenClaw virtual audio device: " + audioOutputRouteError);
      }
    } else {
      audioOutputRouted = false;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();${ownershipCheck(8)}
        const output = devices.find(
          (device) => device.kind === "audiooutput" && isVirtualAudioDevice(device.label)
        );
        if (output?.deviceId) {
          // Teams can briefly remove every media element during an in-call rerender.
          // Retry only after proving the required output still exists.
          audioOutputRouteRetryable = true;
          audioOutputDeviceLabel = output.label || "Virtual audio device";
        } else {
          notes.push("The OpenClaw virtual audio speaker output was not visible to ${options.platform.displayName}.");
        }
      } catch (error) {${ownershipCheck(8)}
        audioOutputRouteError = error?.message || String(error);
        notes.push("Could not inspect ${options.platform.displayName} speaker outputs: " + audioOutputRouteError);
      }
      // Suspend ownership until the source returns; call teardown retires it.
      if (canMutateSession) suspendOwnedAudioBridges();
    }
  } else if (inCall && allowMicrophone) {
    audioOutputRouted = false;
    if (canMutateSession) retireOwnedAudioBridges();
  }
${withLiveOwnership("  }\n")}${options.afterAudioRoutingSource ? `  ${options.afterAudioRoutingSource}\n${withLiveOwnership("  recheckAudioOwnership();\n")}` : ""}  let captioning = false;
  let captionsEnabledAttempted = false;
  let transcriptLines = 0;
  let lastCaptionAt;
  let lastCaptionSpeaker;
  let lastCaptionText;
  let recentTranscript = [];
  const captionState = (() => {
    let active = window[${captionsGlobal}];
    const activeOwnedByRequest = Boolean(
      !active || (sessionId && (!active.sessionId || active.sessionId === sessionId))
    );
    if (!identityVerified) {
      if (identityAwaitingRerender && activeOwnedByRequest) return active;
      if (canMutateSession && activeOwnedByRequest) finalizeOwnedCaptions();
      return undefined;
    }
    if (!activeOwnedByRequest) {
      const replacedPriorOwner = Boolean(
        canMutateSession &&
        active?.sessionId &&
        active.sessionId !== sessionId
      );
      if (replacedPriorOwner) {
        if (priorMeeting?.sessionId === active.sessionId) {
          active.identity ||= priorMeeting.identity;
        }
        finalizeCaptionState(active);
      }
      else if (!canMutateSession || !captureCaptions || active?.finalized !== true) return undefined;
      archiveFinalizedCaptions(active);
      if (active.settleTimer !== undefined) clearTimeout(active.settleTimer);
      active.observer?.disconnect?.();
      delete window[${captionsGlobal}];
      active = undefined;
    }
    if (!captureCaptions) {
      if (!canMutateSession) return undefined;
      if (active?.settleTimer !== undefined) clearTimeout(active.settleTimer);
      active?.observer?.disconnect?.();
      if (active) delete window[${captionsGlobal}];
      return undefined;
    }
    if (!inCall && !active) return undefined;
    if (!active && !canMutateSession) return undefined;
    if (!active) {
      window[${captionsGlobal}] = {
        sessionId,
        identity: expectedIdentity,
        epoch: crypto.randomUUID(),
        enabledAttempted: false,
        observerInstalled: false,
        observer: undefined,
        droppedLines: 0,
        lines: [],
        settled: [],
        settleTimer: undefined,
        visible: [],
      };
    }
    return window[${captionsGlobal}];
  })();
  const normalizeCaption = (speaker, captionText) => {
    if (!captionState) return undefined;
    const clean = String(captionText || "").replace(/\\s+/g, " ").trim();
    const cleanSpeaker = String(speaker || "").replace(/\\s+/g, " ").trim();
    if (!clean) return undefined;
    return { speaker: cleanSpeaker || undefined, text: clean };
  };
  const captionRowIdentity = (row) => {
    // aria-posinset identifies the logical caption item across virtual-list
    // rerenders. DOM ids and data indexes can belong to the recycled element.
    const value = row?.getAttribute?.("aria-posinset");
    return typeof value === "string" && value.trim()
      ? "aria-posinset:" + value.trim()
      : undefined;
  };
  const sameCaptionUtterance = (prior, current) => {
    if (prior.rowIdentity || current.rowIdentity) {
      return Boolean(
        prior.rowIdentity &&
        current.rowIdentity &&
        prior.rowIdentity === current.rowIdentity
      );
    }
    if (prior.speaker && current.speaker && prior.speaker !== current.speaker) return false;
    return prior.node === current.node;
  };
  const sameCaptionRow = (left, right) =>
    right.rowIdentity
      ? left.rowIdentity === right.rowIdentity
      : left.node === right.node;
  const commitCaptionLines = (state, entries) => {
    state.lines.push(...entries.map((entry) => {
      entry.utteranceId ||= crypto.randomUUID();
      return {
        at: entry.at,
        speaker: entry.speaker,
        text: entry.text,
        utteranceId: entry.utteranceId,
      };
    }));
    const excess = state.lines.length - ${transcriptMaxLines};
    if (excess > 0) {
      state.lines.splice(0, excess);
      state.droppedLines = (state.droppedLines || 0) + excess;
    }
    const settled = [...state.settled];
    for (const entry of entries) {
      const priorIndex = settled.findIndex((candidate) => sameCaptionRow(candidate, entry));
      if (priorIndex >= 0) settled.splice(priorIndex, 1, { ...entry });
      else settled.push({ ...entry });
    }
    const retainedLineIds = new Set(state.lines.map((entry) => entry.utteranceId));
    state.settled = settled.filter((entry) => retainedLineIds.has(entry.utteranceId));
  };
  const scheduleCaptionSettle = () => {
    if (!captionState || captionState.visible.length === 0) return;
    if (captionState.settleTimer !== undefined) clearTimeout(captionState.settleTimer);
    const pendingState = captionState;
    pendingState.settleTimer = setTimeout(() => {
      if (window[${captionsGlobal}] !== pendingState) return;
      commitCaptionLines(pendingState, pendingState.visible);
      pendingState.visible = [];
      pendingState.settleTimer = undefined;
    }, ${captionSettleMs});
  };
  const captionCaptureMatchesCurrentMeeting = () => {
    if (
      !captionState ||
      captionState.finalized === true ||
      window[${captionsGlobal}] !== captionState
    ) return false;
    const observedIdentity = meetingIdentity(location.href);
    const observedMeeting = window[${meetingGlobal}];
    const identityConflicts = Boolean(
      observedIdentity && expectedIdentity && observedIdentity !== expectedIdentity
    );
    const sessionConflicts = Boolean(
      observedMeeting?.sessionId && sessionId && observedMeeting.sessionId !== sessionId
    );
    if (identityConflicts || sessionConflicts) {
      // The observer outlives Teams SPA navigation. Freeze the old buffer before
      // any caption nodes from the replacement meeting can be attributed to it.
      finalizeOwnedCaptions();
      return false;
    }
    if (observedIdentity === expectedIdentity) return true;
    const observedMarkerAgeMs = Date.now() - (observedMeeting?.verifiedAt || 0);
    const observedAwaitingRerender = Boolean(
      !observedIdentity &&
      observedMeeting?.identity === expectedIdentity &&
      (!observedMeeting.sessionId || !sessionId || observedMeeting.sessionId === sessionId) &&
      observedMeeting.inCallControl?.isConnected === false &&
      observedMeeting.inCallUrl === location.href &&
      observedMarkerAgeMs >= 0 &&
      observedMarkerAgeMs < 5_000
    );
    if (observedAwaitingRerender) return true;
    return Boolean(
      observedMeeting?.identity === expectedIdentity &&
      (!observedMeeting.sessionId || !sessionId || observedMeeting.sessionId === sessionId) &&
      observedMeeting.inCallControl?.isConnected !== false &&
      observedMeeting.inCallUrl === location.href
    );
  };
  const scrapeCaptions = (mutations = []) => {
    if (!captionCaptureMatchesCurrentMeeting()) return;
    const content = firstRaw(selectors.captionContent);
    const rows = content
      ? selectors.captionRows.flatMap((selector) => [...content.querySelectorAll(selector)])
      : [];
    captionState.settled = Array.isArray(captionState.settled) ? captionState.settled : [];
    const removedNodes = mutations.flatMap((mutation) => [...(mutation.removedNodes || [])]);
    const rowWasRemoved = (entry) => removedNodes.some((node) =>
      node === entry.node || node?.contains?.(entry.node)
    );
    const removedVisible = captionState.visible.filter(rowWasRemoved);
    if (removedVisible.length > 0) {
      if (captionState.settleTimer !== undefined) clearTimeout(captionState.settleTimer);
      captionState.settleTimer = undefined;
      captionState.visible = captionState.visible.filter((entry) => !rowWasRemoved(entry));
      commitCaptionLines(captionState, removedVisible);
    }
    const retainedLineIds = new Set(captionState.lines.map((entry) => entry.utteranceId));
    captionState.settled = captionState.settled.filter((entry) =>
      entry.rowIdentity
        ? retainedLineIds.has(entry.utteranceId)
        : !rowWasRemoved(entry) && rows.some((row) => sameCaptionRow(entry, {
            node: row,
            rowIdentity: captionRowIdentity(row),
          }))
    );
    const parsedRows = rows.flatMap((row) => {
      const speaker = text(firstWithin(row, selectors.captionAuthor));
      const captionText = text(firstWithin(row, selectors.captionText));
      const parsed = normalizeCaption(speaker, captionText);
      if (!parsed) return [];
      const current = { ...parsed, node: row, rowIdentity: captionRowIdentity(row) };
      const settledIndex = captionState.settled.findIndex((entry) =>
        sameCaptionRow(entry, current)
      );
      const settled = settledIndex >= 0 ? captionState.settled[settledIndex] : undefined;
      if (
        settled &&
        settled.text === current.text &&
        (settled.speaker || "") === (current.speaker || "")
      ) return [];
      if (settled?.rowIdentity && settled.rowIdentity === current.rowIdentity) {
        const committed = captionState.lines.find((entry) =>
          entry.utteranceId === settled.utteranceId
        );
        if (committed) {
          committed.speaker = current.speaker || committed.speaker;
          committed.text = current.text;
        }
        captionState.settled.splice(settledIndex, 1, {
          ...settled,
          ...current,
          speaker: current.speaker || settled.speaker,
        });
        return [];
      }
      if (settledIndex >= 0) captionState.settled.splice(settledIndex, 1);
      return [current];
    });
    if (parsedRows.length === 0) {
      if (captionState.visible.length > 0 && captionState.settleTimer === undefined) {
        scheduleCaptionSettle();
      }
      return;
    }
    const unmatchedPrevious = [...captionState.visible];
    const nextVisible = [];
    const now = Date.now();
    let captionChanged = false;
    for (const row of parsedRows) {
      const priorIndex = unmatchedPrevious.findIndex((candidate) => sameCaptionRow(candidate, row));
      const candidate = priorIndex >= 0 ? unmatchedPrevious[priorIndex] : undefined;
      const prior = candidate && sameCaptionUtterance(candidate, row)
        ? unmatchedPrevious.splice(priorIndex, 1)[0]
        : undefined;
      if (prior) {
        captionChanged ||=
          prior.text !== row.text ||
          prior.speaker !== row.speaker ||
          prior.node !== row.node;
        prior.speaker = row.speaker || prior.speaker;
        prior.text = row.text;
        prior.node = row.node;
        prior.rowIdentity = row.rowIdentity || prior.rowIdentity;
        prior.seenAt = now;
        nextVisible.push(prior);
      } else {
        captionChanged = true;
        nextVisible.push({
          at: new Date().toISOString(),
          node: row.node,
          rowIdentity: row.rowIdentity,
          seenAt: now,
          speaker: row.speaker,
          text: row.text,
        });
      }
    }
    captionChanged ||= unmatchedPrevious.length > 0;
    commitCaptionLines(captionState, unmatchedPrevious);
    captionState.visible = nextVisible;
    // Identity-less rows stay mutable while rendered; removal is their only
    // reliable utterance boundary. Stable logical rows may settle on quiet.
    if (
      (captionChanged || captionState.settleTimer === undefined) &&
      captionState.visible.every((entry) => entry.rowIdentity)
    ) {
      scheduleCaptionSettle();
    }
  };
  if (captionState) {
    const captionsFinalized = captionState.finalized === true;
    let captionsEnabledNow = captionsFinalized
      ? Boolean(captionState.enabledAttempted)
      : Boolean(firstRaw(selectors.captionRenderer) || firstRaw(selectors.captionsOff));
    ${options.captionEnableSource}
    if (!captionsFinalized && canMutateSession) captionState.enabledAttempted = captionsEnabledNow;
    captionsEnabledAttempted = Boolean(captionState.enabledAttempted);
    if (!captionsFinalized && canMutateSession && inCall && !captionState.observerInstalled) {
      captionState.observerInstalled = true;
      captionState.observer = new MutationObserver(scrapeCaptions);
      captionState.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      notes.push("Installed ${options.platform.displayName} live-caption observer.");
    }
    if (!captionsFinalized && canMutateSession && inCall) scrapeCaptions();
    const allLines = [...captionState.lines, ...captionState.visible];
    const lines = allLines.slice(-${transcriptMaxLines});
    const last = lines[lines.length - 1];
    captioning = captionsEnabledNow;
    transcriptLines = (captionState.droppedLines || 0) + allLines.length;
    lastCaptionAt = last?.at;
    lastCaptionSpeaker = last?.speaker;
    lastCaptionText = last?.text;
    recentTranscript = lines.slice(-5).map((entry) => ({
      at: entry.at,
      speaker: entry.speaker,
      text: entry.text,
    }));
  }
  if (inCall && allowMicrophone && !manualAction) {
    if (audioInputRouted !== true || audioOutputRouted !== true) {
      manualAction = manualActionFor("${options.platform.manualActionReasonPrefix}-audio-choice-required", "Verify the OpenClaw virtual audio device is selected as both the ${options.platform.displayName} microphone and speaker before starting talk-back.");
    } else if (micMuted !== false) {
      manualAction = manualActionFor("${options.platform.manualActionReasonPrefix}-microphone-required", "Unmute the ${options.platform.displayName} microphone and verify the microphone control shows it is on before starting talk-back.");
    }
  }
  return JSON.stringify({
    clickedContinueInBrowser: Boolean(continueInBrowser),
    clickedJoin,
    inCall,
    ${options.extraResultSource ?? ""}
    micMuted,
    cameraOff,
    lobbyWaiting,
    captionCaptureRequested: captureCaptions,
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
    audioOutputRouteRetryable,
    manualAction,
    title: document.title,
    url: location.href,
    notes,
  });
}`;
}
//#endregion
//#region src/meeting-bot/status-prejoin-fragments.ts
function createMeetingStatusPreludeFragments({ guestName, displayName, manualActionReasonPrefix }) {
	return {
		guestName: (replaceExisting) => `  const guestInput = first(selectors.guestName) || [...document.querySelectorAll("input")].find((input) =>
    /enter your name|type your name|your name|display name/i.test(label(input) + " " + (input.placeholder || ""))
  );
  if (canMutateSession && identityVerifiedBeforeCall && autoJoin && guestInput && ${replaceExisting ? `guestInput.value !== ${JSON.stringify(guestName)}` : "!guestInput.value"}) {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    guestInput.focus();
    if (setter) setter.call(guestInput, ${JSON.stringify(guestName)});
    else guestInput.value = ${JSON.stringify(guestName)};
    guestInput.dispatchEvent(new Event("input", { bubbles: true }));
    guestInput.dispatchEvent(new Event("change", { bubbles: true }));
  }`,
		preservedIdentity: `  const identityPreservedInCall = Boolean(
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
  const identityVerified = identityVerifiedBeforeCall || identityPreservedInCall;`,
		virtualAudioInput: ({ beforeEnumerationSource = "", selectionSource, afterSelectionSource = "" }) => `  const { isVirtualAudioDevice, isVirtualAudioDeviceNode, microphoneDeviceRoots, selectedMicrophoneLabel } = meetingAudioInput;
  let audioInputRouted;
  let audioInputDeviceLabel;
  let audioInputRouteError;
  const ensureVirtualAudioInput = async () => {
${beforeEnumerationSource}    if (!navigator.mediaDevices?.enumerateDevices) return false;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const input = devices.find(
        (device) => device.kind === "audioinput" && isVirtualAudioDevice(device.label)
      );
      if (!input?.deviceId) return false;
      audioInputDeviceLabel = input.label || "Virtual audio device";
      // ${displayName} hides the selected-device control after admission. Reopen the in-call audio
      // options and verify the current selection before unmuting; installed devices alone
      // do not prove which microphone ${displayName} is using.
${selectionSource}
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
${afterSelectionSource}      return selected;
    } catch (error) {
      audioInputRouteError = error?.message || String(error);
      return false;
    }
  };`,
		prejoinMicrophone: ({ unroutedSource, afterRoutedSource = "", muteInCall }) => `  if (identityVerified && !inCall && allowMicrophone && microphone) {
    audioInputRouted = await ensureVirtualAudioInput();
    if (!audioInputRouted) {
      if (canMutateSession && microphoneState === "on") {
        microphone.click();
        await refreshMicrophoneState();
      }
${unroutedSource}
    } else if (canMutateSession && microphoneState === "off") {
      microphone.click();
      await refreshMicrophoneState();
      if (microphoneState === "on") {
        notes.push("Unmuted the ${displayName} microphone after verifying the virtual audio input.");
      }
    }
${afterRoutedSource}  } else if (canMutateSession && identityVerified && ${muteInCall ? "" : "!inCall && "}!allowMicrophone && microphoneState === "on") {
      microphone.click();
      await refreshMicrophoneState();
      if (microphoneState === "off") {
        notes.push("Muted the ${displayName} microphone for observe-only mode.");
      }
  }`,
		inCallMicrophone: `  if (identityVerified && inCall && allowMicrophone) {
    if (!selectedMicrophoneLabel() && canMutateSession && microphoneState === "on") {
      microphone?.click();
      await refreshMicrophoneState();
    }
    audioInputRouted = await ensureVirtualAudioInput();
    if (audioInputRouted && canMutateSession && microphoneState === "off") {
      microphone?.click();
      await refreshMicrophoneState();
    } else if (!audioInputRouted && canMutateSession && microphoneState === "on") {
      microphone?.click();
      await refreshMicrophoneState();
      if (microphoneState === "off") {
        notes.push("Muted the ${displayName} microphone because the virtual audio input could not be reverified.");
      }
    }
  }`,
		manualActions: ({ loginDisplayName = displayName, inCallControls }) => `  let microphonePermissionState;
  if (allowMicrophone && navigator.permissions?.query) {
    try {
      microphonePermissionState = (await navigator.permissions.query({ name: "microphone" })).state;
    } catch {}
  }
  const devicePermissionPrompt = !dismissedDevicePrompt && Boolean(
    first(selectors.permissionPrompt) || continueWithoutDevices
  );
  // ${displayName} shows the same no-audio/video warning when only camera access is denied.
  // A granted microphone plus the verified virtual audio input is sufficient for talk-back.
  const permissionRequired = devicePermissionPrompt &&
    (!allowMicrophone || microphonePermissionState !== "granted");
  let manualAction;
  if (committedOwnerConflict && !canMutateSession) {
    manualAction = manualActionFor("${manualActionReasonPrefix}-session-conflict", "This ${displayName} tab is owned by another active meeting session.");
  } else if (!inCall && loginRequired) {
    manualAction = manualActionFor("${manualActionReasonPrefix}-login-required", tenantLoginRequired ? "This ${displayName} tenant requires sign-in or email verification. Complete it in the OpenClaw browser profile, then retry." : "Sign in to ${loginDisplayName} in the OpenClaw browser profile, then retry the meeting join.");
  } else if (!inCall && lobbyWaiting) {
    manualAction = manualActionFor("${manualActionReasonPrefix}-admission-required", "Admit the OpenClaw guest from the ${loginDisplayName} lobby, then retry speech.");
  } else if (!inCall && permissionRequired) {
    manualAction = manualActionFor("${manualActionReasonPrefix}-permission-required", allowMicrophone ? "Allow microphone permission for ${displayName} in the OpenClaw browser profile, then retry." : "Dismiss the ${displayName} device-permission prompt or continue without devices, then retry.");
  } else if (${inCallControls ? "" : "!inCall && "}controlManualAction) {
    manualAction = controlManualAction;
  }
  let clickedJoin = false;
  if (canMutateSession && identityVerified && autoJoin && !inCall && join && !join.disabled && !manualAction) {
    join.click();
    clickedJoin = true;
    notes.push("Clicked the ${displayName} guest join button.");
  }`
	};
}
//#endregion
//#region src/meeting-bot/status-prejoin-source.ts
function createMeetingStatusPreludeSource(params, options) {
	const audioOutputsGlobal = JSON.stringify(options.platform.globals.audioOutputs);
	const captionArchiveGlobal = JSON.stringify(options.platform.globals.captionArchive);
	const captionsGlobal = JSON.stringify(options.platform.globals.captions);
	const meetingGlobal = JSON.stringify(options.platform.globals.meeting);
	const transcriptMaxLines = options.transcriptMaxLines ?? 500;
	const fragments = createMeetingStatusPreludeFragments({
		...options.platform,
		guestName: params.guestName
	});
	const resolveSource = (source) => typeof source === "function" ? source(fragments) : source;
	return `async () => {
  ${params.pageIdentitySource}
  ${options.setupSource ?? ""}
  const parseToggleState = ${params.toggleStateFunction};
  const selectors = ${params.selectors};
  const expectedIdentity = ${JSON.stringify(params.expectedIdentity)};
  const allowMicrophone = ${JSON.stringify(params.allowMicrophone)};
  const allowSessionAdoption = ${JSON.stringify(params.allowSessionAdoption)};
  const autoJoin = ${JSON.stringify(params.autoJoin)};
  const captureCaptions = ${JSON.stringify(params.captureCaptions)};
  const readOnly = ${JSON.stringify(Boolean(params.readOnly))};
  const sessionId = ${JSON.stringify(params.meetingSessionId)};
  const identityRetentionMs = ${JSON.stringify(Math.max(3e4, params.waitForInCallMs))};
  const text = (node) => (node?.innerText || node?.textContent || "").trim();
  const label = (node) => [
    node?.getAttribute?.("aria-label"),
    node?.getAttribute?.("title"),
    node?.getAttribute?.("data-tid"),
    text(node),
  ].filter(Boolean).join(" ");
  const manualActionFor = (reason, message) => ({ reason, message });
  const clickable = (node) => node?.matches?.("button")
    ? node
    : node?.querySelector?.("button") || node?.closest?.("button") || node;
  const first = (list) => clickable(firstRaw(list));
  const firstRaw = (list) => {
    for (const selector of list) {
      const node = document.querySelector(selector);
      if (node) return node;
    }
    return undefined;
  };
  const firstWithin = (root, list) => {
    if (!root) return undefined;
    for (const selector of list) {
      if (root.matches?.(selector)) return root;
      const node = root.querySelector?.(selector);
      if (node) return node;
    }
    return undefined;
  };
  // Keep these names scoped: older plugin lifecycle fragments declare their own helpers.
  const meetingAudioInput = (() => {
    const isVirtualAudioDevice = (value) =>
      /^(?:blackhole 2ch(?: \\(virtual\\))?|openclaw meeting audio)$/i.test(
        String(value || "").replace(/\\s+/g, " ").trim()
      );
    const isVirtualAudioDeviceNode = (node) => [
      node?.getAttribute?.("aria-label"),
      node?.getAttribute?.("title"),
      node?.label,
      node?.value,
      text(node),
    ].some(isVirtualAudioDevice);
    const microphoneDeviceRoots = () => {
      // Consumer in-call controls expose the listbox itself, without the prejoin
      // selected-device button/combobox wrapper.
      const control = firstRaw(selectors.microphoneDevice) || firstRaw(selectors.microphoneDeviceMenu);
      if (!control) return { control, roots: [] };
      const roots = [control];
      const scope = control.closest?.(selectors.microphoneDeviceScope);
      if (scope && !roots.includes(scope)) roots.push(scope);
      const listboxId = control.getAttribute?.("aria-controls");
      const listbox = listboxId ? document.getElementById?.(listboxId) : undefined;
      if (listbox && !roots.includes(listbox)) roots.push(listbox);
      const liveMenu = firstRaw(selectors.microphoneDeviceMenu);
      if (liveMenu && !roots.includes(liveMenu)) roots.push(liveMenu);
      return { control, roots };
    };
    const selectedMicrophoneLabel = () => {
      const { control, roots } = microphoneDeviceRoots();
      const selectedOption = control?.selectedOptions?.[0];
      if (selectedOption && isVirtualAudioDeviceNode(selectedOption)) {
        return label(selectedOption) || selectedOption.value;
      }
      if (control && isVirtualAudioDeviceNode(control)) return label(control) || control.value;
      for (const root of roots) {
        const selected = firstWithin(root, selectors.selectedMicrophoneDevice);
        if (selected && isVirtualAudioDeviceNode(selected)) {
          return label(selected) || selected.value;
        }
      }
      return undefined;
    };
    return { isVirtualAudioDevice, isVirtualAudioDeviceNode, microphoneDeviceRoots, selectedMicrophoneLabel };
  })();
  ${options.controlLookupSource}
  const waitForUi = () => new Promise((resolve) => setTimeout(resolve, 120));
  const bridgeOwnedBySession = (entry) => Boolean(
    sessionId && (!entry?.sessionId || entry.sessionId === sessionId)
  );
  ${MEETING_AUDIO_BRIDGE_SOURCE}
  const retireOwnedAudioBridges = (restoreSources = true) => {
    const entries = Array.isArray(window[${audioOutputsGlobal}])
      ? window[${audioOutputsGlobal}]
      : [];
    const retained = [];
    for (const entry of entries) {
      if (!bridgeOwnedBySession(entry)) {
        retained.push(entry);
        continue;
      }
      retireAudioBridge(entry, restoreSources);
    }
    if (retained.length > 0) window[${audioOutputsGlobal}] = retained;
    else delete window[${audioOutputsGlobal}];
  };
  const suspendOwnedAudioBridges = (adopt = false) => {
    const entries = Array.isArray(window[${audioOutputsGlobal}])
      ? window[${audioOutputsGlobal}]
      : [];
    const retained = [];
    const suspendedBySource = new Map();
    for (const entry of entries) {
      if (!adopt && !bridgeOwnedBySession(entry)) {
        retained.push(entry);
        continue;
      }
      // This pending entry owns the muted element until a later serialized
      // status poll sees and routes the attached playback source.
      if (
        !adopt &&
        entry?.pending &&
        bridgeSources(entry).some((source) => bridgeSourceMatches(source?.element, source))
      ) {
        retained.push(entry);
        continue;
      }
      for (const source of bridgeSources(entry)) {
        if (!source?.element || suspendedBySource.has(source.element)) continue;
        if (!bridgeSourceMatches(source.element, source)) {
          restoreAudioBridgeSource(source);
          continue;
        }
        suspendedBySource.set(source.element, {
          sessionId: adopt ? sessionId : entry.sessionId || sessionId,
          source: source.element,
          sourceMuted: Boolean(source.muted),
          sourceUrl: adopt ? mediaSourceUrl(source.element) || source.url : source.url,
          stream: source.element.srcObject,
          suspended: true,
        });
      }
      retireAudioBridge(entry, false);
    }
    const next = [...retained, ...suspendedBySource.values()];
    if (next.length > 0) window[${audioOutputsGlobal}] = next;
    else delete window[${audioOutputsGlobal}];
  };
  const adoptAudioBridgeSourcesForSession = () => suspendOwnedAudioBridges(true);
  const retireOwnedCaptions = () => {
    const active = window[${captionsGlobal}];
    const owned = Boolean(
      active && sessionId && (!active.sessionId || active.sessionId === sessionId)
    );
    if (!owned) return;
    if (active.settleTimer !== undefined) clearTimeout(active.settleTimer);
    active.observer?.disconnect?.();
    delete window[${captionsGlobal}];
  };
  const finalizeCaptionState = (active) => {
    if (!active) return;
    if (active.settleTimer !== undefined) clearTimeout(active.settleTimer);
    active.settleTimer = undefined;
    active.observer?.disconnect?.();
    active.observer = undefined;
    active.observerInstalled = false;
    active.lines = Array.isArray(active.lines) ? active.lines : [];
    if (Array.isArray(active.visible) && active.visible.length > 0) {
      active.lines.push(...active.visible.map((entry) => ({
        at: entry.at,
        speaker: entry.speaker,
        text: entry.text,
      })));
      active.visible = [];
    }
    const excess = active.lines.length - ${transcriptMaxLines};
    if (excess > 0) {
      active.lines.splice(0, excess);
      active.droppedLines = (active.droppedLines || 0) + excess;
    }
    active.finalized = true;
    active.finalizedAt = Date.now();
  };
  const archiveFinalizedCaptions = (active) => {
    if (active?.finalized !== true || !active.sessionId) return;
    const archive = window[${captionArchiveGlobal}] &&
        typeof window[${captionArchiveGlobal}] === "object"
      ? window[${captionArchiveGlobal}]
      : {};
    archive[active.sessionId] = active;
    const retained = Object.entries(archive)
      .sort((left, right) => Number(right[1]?.finalizedAt || 0) - Number(left[1]?.finalizedAt || 0))
      .slice(0, 4);
    window[${captionArchiveGlobal}] = Object.fromEntries(retained);
  };
  const finalizeOwnedCaptions = () => {
    const active = window[${captionsGlobal}];
    const owned = Boolean(
      active && sessionId && (!active.sessionId || active.sessionId === sessionId)
    );
    if (owned) {
      active.identity ||= priorMeeting?.identity || expectedIdentity;
      finalizeCaptionState(active);
    }
  };
  const toggleState = (node, kind) => parseToggleState({
    kind,
    ariaPressed: node?.getAttribute?.("aria-pressed"),
    ariaChecked: node?.getAttribute?.("aria-checked"),
    checked: typeof node?.checked === "boolean" ? node.checked : undefined,
    iconClass: node?.querySelector?.("svg")?.getAttribute?.("class"),
    label: label(node),
  });
  const notes = [];
  const currentIdentity = meetingIdentity(location.href);
  const priorMeeting = window[${meetingGlobal}];
  if (expectedIdentity && currentIdentity && currentIdentity !== expectedIdentity) {
    // A confirmed SPA transition must stop resources still owned by this
    // request, while preserving any newer session already committed to the tab.
    retireOwnedAudioBridges();
    finalizeOwnedCaptions();
    const requestOwnsMeeting = Boolean(
      priorMeeting &&
      sessionId &&
      (!priorMeeting.sessionId || priorMeeting.sessionId === sessionId)
    );
    if (requestOwnsMeeting) delete window[${meetingGlobal}];
    return JSON.stringify({
      inCall: false,
      manualAction: manualActionFor("${options.platform.manualActionReasonPrefix}-session-conflict", "The tracked ${options.platform.displayName} tab now shows a different meeting. Return to the requested meeting link, then retry."),
      title: document.title,
      url: location.href,
      notes,
    });
  }
  const meetingOwnerConflict = Boolean(
    priorMeeting?.sessionId && priorMeeting.sessionId !== sessionId
  );
  const captionOwnerConflict = Boolean(
    window[${captionsGlobal}]?.sessionId &&
    window[${captionsGlobal}].sessionId !== sessionId
  );
  const committedOwnerConflict = meetingOwnerConflict || captionOwnerConflict;
  const canRepairCaptionOwner = Boolean(
    !meetingOwnerConflict && priorMeeting?.sessionId === sessionId
  );
  const canMutateSession = Boolean(
    !readOnly &&
    sessionId &&
    (!committedOwnerConflict || canRepairCaptionOwner || allowSessionAdoption)
  );
  const identityMatchedUrl = Boolean(expectedIdentity && currentIdentity === expectedIdentity);
  const identityVerifiedBeforeCall = identityMatchedUrl;
  const previousRemoteCapture = window.__openclawMeetingRemoteAudio;
  if (canMutateSession && allowSessionAdoption && previousRemoteCapture && previousRemoteCapture.sessionId !== sessionId) {
    await previousRemoteCapture.stop();
  }
  ${resolveSource(options.lifecycleSource)}
  const micMuted = microphoneState === "off" ? true : microphoneState === "on" ? false : undefined;
  const cameraOff = cameraState === "off" ? true : cameraState === "on" ? false : undefined;
  ${resolveSource(options.manualActionSource)}
`;
}
//#endregion
//#region src/meeting-bot/page-script-source.ts
function createMeetingPageScripts(options) {
	const identity = (meetingUrl) => {
		const expectedIdentity = options.normalizeUrl(meetingUrl);
		return {
			expectedIdentity,
			pageIdentitySource: options.pageIdentitySource(expectedIdentity)
		};
	};
	return {
		audioCapture: (params) => {
			const page = identity(params.meetingUrl);
			return createMeetingBrowserAudioCaptureSource({
				...params,
				audioOutputsGlobal: options.platform.globals.audioOutputs,
				ownershipSource: options.audioOwnershipSource?.(page) ?? `
      ${page.pageIdentitySource}
      const expectedIdentity = ${JSON.stringify(page.expectedIdentity)};
      const state = ${pageGlobalSource(options.platform.globals.meeting)};
      return Boolean(expectedIdentity && state?.sessionId === sessionId &&
        state.identity === expectedIdentity && !state.leavePending &&
        (meetingIdentity(location.href) === expectedIdentity ||
          (state.inCallUrl === location.href && state.inCallControl?.isConnected)));
    `
			});
		},
		status: (params) => createMeetingStatusPreludeSource({
			...params,
			...identity(params.meetingUrl),
			selectors: JSON.stringify(options.selectors),
			toggleStateFunction: options.toggleStateFunction()
		}, {
			...options.statusPrelude,
			platform: options.platform
		}) + createMeetingStatusCallSource({
			...options.statusCall,
			platform: options.platform
		}),
		transcript: (meetingUrl, meetingSessionId, finalize) => createMeetingTranscriptSource({
			...identity(meetingUrl),
			finalize,
			globals: options.platform.globals,
			meetingSessionId,
			platformDisplayName: options.platform.displayName
		}),
		leave: (params) => createMeetingLeaveSource({
			...options.leave,
			...identity(params.meetingUrl),
			leaveInitiated: params.leaveInitiated,
			meetingSessionId: params.meetingSessionId,
			platform: options.platform,
			selectors: JSON.stringify(options.selectors)
		})
	};
}
function pageGlobalSource(name) {
	if (!/^[$A-Z_a-z][$\w]*$/u.test(name)) throw new Error(`Invalid meeting page global: ${name}`);
	return `window.${name}`;
}
function createMeetingTranscriptSource(params) {
	const transcriptMaxLines = params.transcriptMaxLines ?? 500;
	const meetingGlobal = pageGlobalSource(params.globals.meeting);
	const captionsGlobal = pageGlobalSource(params.globals.captions);
	const captionArchiveGlobal = pageGlobalSource(params.globals.captionArchive);
	return `() => {
  ${params.pageIdentitySource}
  const expectedIdentity = ${JSON.stringify(params.expectedIdentity)};
  const expectedSessionId = ${JSON.stringify(params.meetingSessionId)};
  const currentIdentity = meetingIdentity(location.href);
  const state = ${meetingGlobal};
  const activeCaptions = ${captionsGlobal};
  const archivedCaptions = ${captionArchiveGlobal}?.[expectedSessionId];
  const captions = activeCaptions &&
      (!activeCaptions.sessionId || activeCaptions.sessionId === expectedSessionId)
    ? activeCaptions
    : archivedCaptions;
  // A same-session finalized buffer belongs to the departed call even if ${params.platformDisplayName}
  // immediately navigated this tab into another meeting before transcript pickup.
  const useFinalizedCaptions = Boolean(
    captions?.finalized === true &&
    captions?.identity === expectedIdentity &&
    (!captions?.sessionId || captions.sessionId === expectedSessionId)
  );
  const effectiveIdentity = useFinalizedCaptions
    ? captions.identity
    : currentIdentity || state?.identity || captions?.identity;
  if (!expectedIdentity || effectiveIdentity !== expectedIdentity) {
    return JSON.stringify({ urlMatched: false, droppedLines: 0, lines: [] });
  }
  if (!useFinalizedCaptions && state?.sessionId && state.sessionId !== expectedSessionId) {
    return JSON.stringify({ urlMatched: true, sessionMatched: false, droppedLines: 0, lines: [] });
  }
  if (captions?.sessionId && captions.sessionId !== expectedSessionId) {
    return JSON.stringify({ urlMatched: true, sessionMatched: false, droppedLines: 0, lines: [] });
  }
  if (${JSON.stringify(params.finalize)} && Array.isArray(captions?.visible) && captions.visible.length > 0) {
    if (captions.settleTimer !== undefined) clearTimeout(captions.settleTimer);
    captions.settleTimer = undefined;
    captions.lines = Array.isArray(captions.lines) ? captions.lines : [];
    captions.lines.push(...captions.visible.map((entry) => ({
      at: entry.at,
      speaker: entry.speaker,
      text: entry.text,
    })));
    captions.visible = [];
    const excess = captions.lines.length - ${transcriptMaxLines};
    if (excess > 0) {
      captions.lines.splice(0, excess);
      captions.droppedLines = (captions.droppedLines || 0) + excess;
    }
  }
  if (${JSON.stringify(params.finalize)} && captions) {
    if (captions.settleTimer !== undefined) clearTimeout(captions.settleTimer);
    captions.settleTimer = undefined;
    captions.observer?.disconnect?.();
    captions.observer = undefined;
    captions.observerInstalled = false;
    captions.identity = expectedIdentity;
    captions.finalized = true;
    captions.finalizedAt = Date.now();
  }
  const allLines = [
    ...(Array.isArray(captions?.lines) ? captions.lines : []),
    ...(${JSON.stringify(params.finalize)} || !Array.isArray(captions?.visible) ? [] : captions.visible),
  ];
  const visibleOverflow = Math.max(0, allLines.length - ${transcriptMaxLines});
  const lines = allLines.slice(-${transcriptMaxLines});
  const result = {
    urlMatched: true,
    sessionMatched: true,
    epoch: typeof captions?.epoch === "string" ? captions.epoch : undefined,
    droppedLines: (Number.isFinite(captions?.droppedLines)
      ? Math.max(0, Math.trunc(captions.droppedLines))
      : 0) + visibleOverflow,
    lines: lines.map((line) => ({
      at: typeof line?.at === "string" ? line.at : undefined,
      speaker: typeof line?.speaker === "string" ? line.speaker : undefined,
      text: typeof line?.text === "string" ? line.text : "",
    })).filter((line) => line.text),
  };
  return JSON.stringify(result);
}`;
}
function createMeetingOwnedAudioLeaveSource(params) {
	const audioOutputsGlobal = pageGlobalSource(params.audioOutputsGlobal);
	return `const retireOwnedAudioBridges = () => {
    ${MEETING_AUDIO_BRIDGE_SOURCE}
    const entries = Array.isArray(${audioOutputsGlobal})
      ? ${audioOutputsGlobal}
      : [];
    const retained = [];
    const activeSessionId = expectedSessionId || state?.sessionId;
    for (const entry of entries) {
      const ownedByActiveSession = Boolean(
        !entry?.sessionId || (activeSessionId && entry.sessionId === activeSessionId)
      );
      if (!ownedByActiveSession) {
        retained.push(entry);
        continue;
      }
      retireAudioBridge(entry);
    }
    if (retained.length > 0) ${audioOutputsGlobal} = retained;
    else delete ${audioOutputsGlobal};
  };`;
}
function createMeetingLeaveSource(params) {
	const documentSetupSource = params.documentSetupSource ? `${params.documentSetupSource}\n  ` : "";
	const meetingStateSource = params.meetingStateSource ? `      ${params.meetingStateSource}\n` : "";
	const meetingGlobal = pageGlobalSource(params.platform.globals.meeting);
	return `() => {
  ${params.pageIdentitySource}
  ${documentSetupSource}const selectors = ${params.selectors};
  const expectedIdentity = ${JSON.stringify(params.expectedIdentity)};
  const expectedSessionId = ${JSON.stringify(params.meetingSessionId)};
  const leaveInitiated = ${JSON.stringify(params.leaveInitiated)};
  const currentIdentity = meetingIdentity(location.href);
  const state = ${meetingGlobal};
  const enforceSessionOwnership = Boolean(expectedSessionId);
  if (enforceSessionOwnership && state?.sessionId && state.sessionId !== expectedSessionId) {
    return JSON.stringify({ departed: false, sessionConflict: true, sessionMatched: false, urlMatched: true });
  }
  ${params.sessionMatchSource}
  const retainedLeaveOwnership = Boolean(!sessionMatched && leaveInitiated);
  if (!sessionMatched && !retainedLeaveOwnership) {
    return JSON.stringify({ departed: false, sessionMatched: false, urlMatched: true });
  }
  ${createMeetingOwnedAudioLeaveSource({ audioOutputsGlobal: params.platform.globals.audioOutputs })}
  ${params.controlSource}
  const preservedCallMatches = Boolean(
    expectedIdentity &&
    !currentIdentity &&
    state?.identity === expectedIdentity &&
    state?.inCallControl === leave &&
    state?.inCallUrl === location.href &&
    leave &&
    leave.isConnected !== false
  );
  const pendingLeaveMatches = Boolean(
    expectedIdentity &&
    state?.identity === expectedIdentity &&
    state?.leavePending === true &&
    state?.inCallUrl === location.href &&
    Date.now() - state?.leavePendingAt < 10_000
  );
  const rerenderPendingMatches = Boolean(
    expectedIdentity &&
    !currentIdentity &&
    state?.identity === expectedIdentity &&
    state?.inCallControl?.isConnected === false &&
    state?.inCallUrl === location.href &&
    Date.now() - state?.verifiedAt < 5_000 &&
    !leave
  );
  const meetingIdentityMatches = Boolean(
    currentUrlMatches || preservedCallMatches || pendingLeaveMatches || rerenderPendingMatches
  );
  // ${params.platform.displayName} can replace the document between our Leave click and its post-call marker.
  // Retain request ownership only while no identity or live-call control contradicts it.
  const initiatedLeaveTransitionMatches = Boolean(
    leaveInitiated &&
    !currentIdentity &&
    !leave &&
    (!state?.identity || state.identity === expectedIdentity)
  );
  if (${params.departedMarkerSource} && (meetingIdentityMatches || initiatedLeaveTransitionMatches)) {
    retireOwnedAudioBridges();
    if (sessionMatched) delete ${meetingGlobal};
    return JSON.stringify({ departed: true, sessionMatched: true, urlMatched: true });
  }
  if (!meetingIdentityMatches && !initiatedLeaveTransitionMatches) {
    return JSON.stringify({ departed: false, urlMatched: false });
  }
  if (!sessionMatched) {
    return JSON.stringify({ departed: false, urlMatched: true });
  }
  if (confirmation) {
    confirmation.click();
    return JSON.stringify({ departed: false, leaveAction: "confirm", urlMatched: true });
  }
  if (leave) {
    ${meetingGlobal} = {
      ...state,
      identity: expectedIdentity,
${meetingStateSource}      inCallControl: leave,
      inCallUrl: location.href,
      leavePending: true,
      leavePendingAt: Date.now(),
    };
    leave.click();
    return JSON.stringify({ departed: false, leaveAction: "leave", urlMatched: true });
  }
  return JSON.stringify({ departed: false, urlMatched: true });
}`;
}
//#endregion
export { createMeetingStatusCallSource as a, createMeetingStatusPreludeSource as i, createMeetingPageScripts as n, createMeetingBrowserAudioCaptureSource as o, createMeetingTranscriptSource as r, createMeetingLeaveSource as t };
