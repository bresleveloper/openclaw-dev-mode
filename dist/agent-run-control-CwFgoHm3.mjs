import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { m as wrapCurrentPluginInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { Im as TALK_VOICE_CHANGE_TIMEOUT_MS } from "./src-pLJQA6J5.mjs";
import { i as ACTIVE_EMBEDDED_RUNS, o as ACTIVE_EMBEDDED_RUN_REGISTRATIONS } from "./run-state-DZ4Vfz1J.mjs";
import { a as bindWorkerToolPreparation } from "./host-private-capabilities-eTr803c9.mjs";
import { h as getAttachedBackend, z as resolveReplyRunForCurrentSessionId } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { r as bindPreparedToolAuthority } from "./tool-authority-preparation-m_5xD16r.mjs";
import { o as getDiagnosticSessionActivitySnapshot } from "./diagnostic-run-activity-CaoGYSHp.mjs";
import { c as formatRealtimeVoiceAgentQueueRejection, d as resolveRealtimeVoiceAgentControlIntent, i as buildRealtimeVoiceAgentCancelProviderResult, l as formatRealtimeVoiceAgentStatus, o as buildRealtimeVoiceAgentFollowupSteeringText } from "./agent-run-control-shared-CErtQzFX.mjs";
//#region src/talk/voice-selection-control.ts
const runs = resolveGlobalMap(Symbol.for("openclaw.realtimeVoiceSelectionRuns"), "close-and-restart");
/** Channel transports keep their connection lifecycle and expose only the current call operation. */
function registerRealtimeVoiceSelection(owner) {
	const registeredOwner = wrapCurrentPluginInstance(owner);
	let active = true;
	let changing = false;
	const callAbort = new AbortController();
	const bindings = /* @__PURE__ */ new Set();
	const assertCurrent = () => {
		if (!active) throw new Error("Voice call is no longer active");
		registeredOwner.assertCurrent();
	};
	const boundOwner = {
		...registeredOwner,
		assertCurrent,
		read: () => {
			assertCurrent();
			const selection = registeredOwner.read();
			return {
				...selection,
				voices: [...selection.voices]
			};
		},
		changeVoice: async (query, request) => {
			const signal = AbortSignal.any([
				callAbort.signal,
				AbortSignal.timeout(TALK_VOICE_CHANGE_TIMEOUT_MS),
				...request.signal ? [request.signal] : []
			]);
			const assertRequestCurrent = () => {
				signal.throwIfAborted();
				assertCurrent();
				request.assertCurrent();
			};
			assertRequestCurrent();
			if (changing) throw new Error("A voice change is already in progress for this call");
			const selection = registeredOwner.read();
			if (!selection.canChange) throw new Error("This call cannot change voices");
			const voice = selection.voices.find((candidate) => candidate.toLowerCase() === query.trim().toLowerCase());
			if (!voice) throw new Error("Voice is not in this call's catalog; list the available voices first");
			if (voice === selection.voice) return;
			changing = true;
			try {
				await registeredOwner.changeVoice(voice, {
					assertCurrent: assertRequestCurrent,
					signal
				});
				assertRequestCurrent();
				if (registeredOwner.read().voice !== voice) throw new Error("The replacement call did not apply the requested voice");
			} finally {
				changing = false;
			}
		}
	};
	return {
		bindRun: ({ runId, assertCurrent: assertRunCurrent }) => {
			assertCurrent();
			assertRunCurrent();
			if (runs.has(runId)) throw new Error("The agent run already belongs to a voice call");
			const binding = {
				owner: boundOwner,
				assertCurrent: () => {
					assertCurrent();
					assertRunCurrent();
					if (runs.get(runId) !== binding) throw new Error("The agent no longer owns this voice call");
				}
			};
			runs.set(runId, binding);
			bindings.add(runId);
			return () => {
				if (runs.get(runId) === binding) runs.delete(runId);
				bindings.delete(runId);
			};
		},
		unregister: () => {
			active = false;
			callAbort.abort(/* @__PURE__ */ new Error("Voice call closed"));
			for (const runId of bindings) if (runs.get(runId)?.owner === boundOwner) runs.delete(runId);
			bindings.clear();
		}
	};
}
function resolveRealtimeVoiceSelectionRun(runId) {
	const binding = runs.get(runId);
	if (!binding) return;
	const { owner } = binding;
	const read = () => {
		binding.assertCurrent();
		return {
			...owner.read(),
			voiceSessionId: owner.voiceSessionId,
			sessionKey: owner.sessionKey
		};
	};
	return {
		agentId: owner.agentId,
		sessionKey: owner.sessionKey,
		voiceSessionId: owner.voiceSessionId,
		assertCurrent: binding.assertCurrent,
		read,
		changeVoice: async (voice, request) => {
			const assertCurrent = () => {
				binding.assertCurrent();
				request.assertCurrent();
			};
			await owner.changeVoice(voice, {
				assertCurrent,
				signal: request.signal
			});
			assertCurrent();
			return {
				...read(),
				status: "applied"
			};
		}
	};
}
//#endregion
//#region src/talk/agent-run-control-owner.ts
/** A session-wide request selects one existing owner; later work cannot inherit it. */
function captureRealtimeVoiceRunOwner(sessionId, sessionKey) {
	const handle = ACTIVE_EMBEDDED_RUNS.get(sessionId);
	const registration = handle ? ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) : void 0;
	const operation = resolveReplyRunForCurrentSessionId(sessionId);
	if (!handle && !operation) return;
	const runId = handle?.runId;
	const handleFingerprint = handle?.toolAuthorityFingerprint;
	const fingerprint = handleFingerprint ?? operation?.toolAuthorityFingerprint;
	const isCurrent = () => {
		if (operation && (operation.result || operation.key !== sessionKey || operation.sessionId !== sessionId || resolveReplyRunForCurrentSessionId(sessionId) !== operation || handle && getAttachedBackend(operation) !== handle)) return false;
		if (handle && (ACTIVE_EMBEDDED_RUNS.get(sessionId) !== handle || ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(handle) !== registration || registration?.sessionKey !== void 0 && registration.sessionKey !== sessionKey || handle.runId !== runId || handle.toolAuthorityFingerprint !== handleFingerprint || handle.isStopped?.() || handle.isAborted?.())) return false;
		try {
			registration?.toolAuthority?.assertActive();
			return true;
		} catch {
			return false;
		}
	};
	return {
		isCurrent,
		matchesCaller: (overlay) => {
			if (!isCurrent()) return false;
			const projected = registration?.toolAuthority ? registration.toolAuthority.project(overlay) : operation?.projectToolAuthorityFingerprint(overlay);
			return Boolean(fingerprint && projected === fingerprint && isCurrent());
		}
	};
}
//#endregion
//#region src/talk/agent-run-control.ts
const controlResultPresentation = {
	speak: true,
	show: true,
	suppress: false
};
/** Host error projection needs server-side redaction, outside browser-shared contracts. */
function buildRealtimeVoiceAgentErrorProviderResult(error) {
	return isAbortError(error) ? buildRealtimeVoiceAgentCancelProviderResult() : { error: formatErrorMessage(error) };
}
/** Apply a spoken status, cancel, steer, or follow-up request to an active run. */
async function controlRealtimeVoiceAgentRun(params, providedDeps) {
	const sessionKey = params.sessionKey.trim();
	const text = params.text.trim();
	const mode = resolveRealtimeVoiceAgentControlIntent({
		text,
		mode: params.mode
	}).mode;
	const controlResultContext = {
		mode,
		sessionKey
	};
	const target = params.runTarget;
	let commands = providedDeps;
	if (!commands && target && !target.signal.aborted && target.isCurrent()) commands = (await import("./agent-run-control.runtime.js")).realtimeVoiceControlRuntime;
	const projections = commands ?? (target === void 0 ? await import("./active-run-projections-Dq7HVD2W.mjs") : void 0);
	const resolveCurrentRun = () => {
		const candidate = target && !target.signal.aborted && target.isCurrent() ? commands?.resolveActiveEmbeddedRunOwnerByRunId?.(target.runId) ?? commands?.resolveActiveReplyRunOwnerForSignal?.(target.signal) : void 0;
		const exactOwner = candidate?.sessionKey === sessionKey && target?.isCurrent(candidate.sessionId) ? candidate : void 0;
		return {
			sessionId: target === void 0 ? projections?.resolveActiveEmbeddedRunSessionId(sessionKey) : exactOwner?.sessionId,
			exactOwner
		};
	};
	let current = resolveCurrentRun();
	const legacyOwner = target === void 0 && !providedDeps && current.sessionId ? captureRealtimeVoiceRunOwner(current.sessionId, sessionKey) : void 0;
	const legacySessionId = current.sessionId;
	const isLegacyCurrent = () => providedDeps !== void 0 || current.sessionId === legacySessionId && legacyOwner?.isCurrent() === true;
	const readActivity = providedDeps?.getDiagnosticSessionActivitySnapshot ?? getDiagnosticSessionActivitySnapshot;
	const activity = target === void 0 ? readActivity({
		sessionId: current.sessionId,
		sessionKey
	}) : current.sessionId ? readActivity({ sessionId: current.sessionId }) : void 0;
	const active = Boolean(current.sessionId || activity?.activeWorkKind || activity?.hasActiveEmbeddedRun);
	if (mode === "status") return {
		ok: true,
		...controlResultContext,
		...current.sessionId ? { sessionId: current.sessionId } : {},
		active,
		message: formatRealtimeVoiceAgentStatus({
			active,
			recentEvents: params.recentEvents,
			activity
		}),
		...controlResultPresentation
	};
	const noActiveRun = () => ({
		ok: false,
		...controlResultContext,
		active: false,
		...mode === "cancel" ? { aborted: false } : { queued: false },
		reason: "no_active_run",
		message: `There is no active OpenClaw run to ${mode === "cancel" ? "cancel" : "steer"}.`,
		...controlResultPresentation
	});
	if (!current.sessionId || target === void 0 && !isLegacyCurrent()) return noActiveRun();
	if (!commands) {
		commands = (await import("./agent-run-control.runtime.js")).realtimeVoiceControlRuntime;
		current = resolveCurrentRun();
	}
	const { sessionId, exactOwner } = current;
	if (!sessionId || target === void 0 && !isLegacyCurrent()) return noActiveRun();
	const deferMessagePreparation = !providedDeps && Boolean(target || legacyOwner);
	const toolAuthorityOverlay = params.getToolAuthorityOverlay?.();
	if (toolAuthorityOverlay && (mode === "cancel" || !deferMessagePreparation)) await params.prepareToolAuthorityOverlay?.(toolAuthorityOverlay);
	if (resolveCurrentRun().sessionId !== sessionId || (target ? !target.isCurrent(sessionId) : !isLegacyCurrent())) return noActiveRun();
	if (mode === "cancel") {
		const aborted = target === void 0 ? commands.abortEmbeddedAgentRun(sessionId) : exactOwner?.abort() === true;
		const message = aborted ? "Cancelled the active OpenClaw run." : "OpenClaw could not cancel the active run.";
		return {
			ok: aborted,
			...controlResultContext,
			sessionId,
			active: true,
			aborted,
			...aborted ? {} : { reason: "abort_rejected" },
			message,
			...controlResultPresentation,
			...aborted ? { providerResult: buildRealtimeVoiceAgentCancelProviderResult(message) } : {}
		};
	}
	const prepareMessage = () => {
		const steeringText = [params.getSteeringContext?.(), text].filter(Boolean).join("\n\n");
		const steerText = mode === "followup" ? buildRealtimeVoiceAgentFollowupSteeringText(steeringText) : steeringText;
		options.userTurnTranscriptRecorder = params.createUserTurnTranscriptRecorder?.(steerText);
		return steerText;
	};
	const options = {
		steeringMode: "all",
		debounceMs: 0,
		isInboundUserMessage: true,
		toolAuthorityOverlay,
		taskSuggestionDeliveryMode: void 0
	};
	const steerText = deferMessagePreparation ? text : prepareMessage();
	const prepareCurrent = async () => {
		const overlay = params.getToolAuthorityOverlay?.();
		if (overlay) await params.prepareToolAuthorityOverlay?.(overlay);
		options.toolAuthorityOverlay = overlay;
	};
	const canInject = () => {
		options.toolAuthorityOverlay?.operatorAuthority?.assertCurrent();
		return target ? !target.signal.aborted && target.isCurrent(sessionId) : legacyOwner?.isCurrent() === true;
	};
	const outcome = target || legacyOwner ? commands.queueGuardedEmbeddedAgentMessageWithOutcomeAsync ? await commands.queueGuardedEmbeddedAgentMessageWithOutcomeAsync(sessionId, steerText, options, canInject, bindPreparedToolAuthority(bindWorkerToolPreparation({
		assertCurrent: () => {
			if (!canInject()) throw new Error("The original Talk run is no longer current");
		},
		compatAssertCurrent: () => {
			const overlay = params.getToolAuthorityOverlay?.();
			options.toolAuthorityOverlay = overlay;
			if (overlay && legacyOwner && !legacyOwner.matchesCaller(overlay)) throw new Error("The original Talk caller authority no longer matches");
		},
		prepareCurrent,
		prepareMessage: deferMessagePreparation ? async () => {
			await prepareCurrent();
			return prepareMessage();
		} : void 0
	}))) : {
		queued: false,
		sessionId,
		gatewayHealth: "live",
		reason: "guarded_injection_unsupported"
	} : await commands.queueEmbeddedAgentMessageWithOutcomeAsync(sessionId, steerText, options);
	if (!outcome.queued) return {
		ok: false,
		...controlResultContext,
		sessionId: outcome.sessionId,
		active: true,
		queued: false,
		reason: outcome.reason,
		message: formatRealtimeVoiceAgentQueueRejection(mode, outcome.reason),
		...controlResultPresentation
	};
	const unconfirmed = outcome.transcriptCommit === "unconfirmed";
	const message = unconfirmed ? "OpenClaw could not confirm that input. It was not sent again; check the conversation before retrying." : mode === "followup" ? "Queued that follow-up for the active OpenClaw run." : "Got it. I steered the active run.";
	return {
		ok: !unconfirmed,
		...controlResultContext,
		sessionId: outcome.sessionId,
		active: true,
		queued: true,
		target: outcome.target,
		...unconfirmed ? { reason: "delivery_unconfirmed" } : {},
		message,
		...controlResultPresentation,
		...outcome.enqueuedAtMs !== void 0 ? { enqueuedAtMs: outcome.enqueuedAtMs } : {},
		...outcome.deliveredAtMs !== void 0 ? { deliveredAtMs: outcome.deliveredAtMs } : {}
	};
}
//#endregion
export { resolveRealtimeVoiceSelectionRun as i, controlRealtimeVoiceAgentRun as n, registerRealtimeVoiceSelection as r, buildRealtimeVoiceAgentErrorProviderResult as t };
