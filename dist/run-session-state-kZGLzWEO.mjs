import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-aKqR_F_U.mjs";
import "./agent-scope-config-IQKOEtZ4.mjs";
import { x as isCronSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as isSilentReplyPayloadText } from "./tokens-BTKQYTUd.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { i as resolveSessionAuthProfileOverrideSource } from "./auth-profile-override-provenance-B84_9MMh.mjs";
import "./logger-BHMMVs5C.mjs";
import { T as setReplyPayloadMetadata, s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import "./model-thinking-default-BQDdsH3k.mjs";
import "./session-runtime-compat-CJOaEEoJ.mjs";
import "./thinking-runtime-CYXCkx2Z.mjs";
import "./workspace-mlzi3k1x.mjs";
import { a as normalizeCronToolsAllowExecTarget, i as normalizeCronScheduledToolPolicy, o as normalizeCronToolsAllowExecTargetRequirement, r as normalizeCronScheduledToolCallerOrigin, u as stripCronPinnedExecGrant } from "./scheduled-tool-policy-pqnwO5x1.mjs";
import { n as buildSessionCreationStamp, r as inheritSessionCreationPolicy } from "./session-entry-provenance-C-JyMH54.mjs";
import { o as isHeartbeatAcknowledgementText } from "./heartbeat-vWflpIwS.mjs";
import { h as isSessionWorkAdmissionActive } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { D as hasSessionTranscriptEventsSync } from "./session-accessor.sqlite-transcript-write-CM5480eZ.mjs";
import { u as setSessionRuntimeModel } from "./types-ByCc34Vn.mjs";
import "./current-time-ojiw0e0p.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import "./usage-XXLoqJQC.mjs";
import "./timeout-Bjg7ga80.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-RBmrGrXG.mjs";
import { n as clearBootstrapSnapshotOnSessionBoundary } from "./bootstrap-cache-D3fnu3yg.mjs";
import { r as isExecLikeToolName } from "./tool-error-summary-Sp1u0x3c.mjs";
import { t as applyModelRuntimeDirective } from "./directive-handling.model-runtime-70H4lLy3.mjs";
import { r as mergeSessionSnapshotChanges } from "./session-snapshot-merge-Br9OMCio.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/cron/isolated-agent/helpers.ts
/** Normalizes isolated cron run output into summaries, delivery payloads, and error state. */
function normalizeCronFailureSignal(signal) {
	const message = normalizeOptionalString(signal?.message);
	if (signal?.fatalForCron !== true || !message) return;
	return {
		...signal,
		message,
		fatalForCron: true
	};
}
function formatCronFailureSignal(signal) {
	const kind = normalizeOptionalString(signal.kind) ?? "run";
	const code = normalizeOptionalString(signal.code);
	const source = normalizeOptionalString(signal.toolName) ?? normalizeOptionalString(signal.source);
	return `cron classifier: ${kind} failure${source ? ` from ${source}` : ""}${code ? ` (${code})` : ""}: ${signal.message}`;
}
function formatCronRunLevelError(error) {
	const direct = normalizeOptionalString(error);
	if (direct) return `cron isolated run failed: ${direct}`;
	if (!error || typeof error !== "object") return;
	const record = error;
	const message = normalizeOptionalString(record.message);
	if (message) return `cron isolated run failed: ${message}`;
	const kind = normalizeOptionalString(record.kind);
	if (kind) return `cron isolated run failed: ${kind}`;
	return "cron isolated run failed";
}
/** Picks a bounded cron run summary from plain text output. */
function pickSummaryFromOutput(text) {
	const clean = (text ?? "").trim();
	if (!clean) return;
	const limit = 2e3;
	return clean.length > limit ? `${truncateUtf16Safe(clean, limit)}…` : clean;
}
/** Picks the last non-empty payload text while ignoring terminal error payloads first. */
function pickLastNonEmptyTextFromPayloads(payloads) {
	for (let i = payloads.length - 1; i >= 0; i--) {
		if (payloads[i]?.isError) continue;
		const clean = (payloads[i]?.text ?? "").trim();
		if (clean) return clean;
	}
	for (let i = payloads.length - 1; i >= 0; i--) {
		if (isNonTerminalToolErrorWarning(payloads[i])) continue;
		const clean = (payloads[i]?.text ?? "").trim();
		if (clean) return clean;
	}
}
function isDeliverablePayload(payload) {
	if (!payload) return false;
	return hasOutboundReplyContent(payload, { trimText: true });
}
function payloadHasStructuredDeliveryContent(payload) {
	if (!payload) return false;
	return payload.mediaUrl !== void 0 || (payload.mediaUrls?.length ?? 0) > 0 || (payload.presentation?.blocks?.length ?? 0) > 0 || (payload.interactive?.blocks?.length ?? 0) > 0 || Object.keys(payload.channelData ?? {}).length > 0;
}
function payloadHasNonTextDeliveryContent(payload) {
	return hasOutboundReplyContent({
		...payload,
		text: void 0
	}, { trimText: true });
}
function isHeartbeatAcknowledgementPayload(payload) {
	return !payloadHasNonTextDeliveryContent(payload) && isHeartbeatAcknowledgementText(payload.text);
}
function resolveCronDeliveryPayloads(params) {
	if (params.payloads.length === 0) return {
		deliveryPayloads: [],
		deliveryDisposition: { kind: "empty" }
	};
	const hasNonTextContent = params.payloads.some(payloadHasNonTextDeliveryContent);
	const terminalText = params.finalAssistantVisibleText ?? params.payloads.at(-1)?.text;
	if (!hasNonTextContent && isHeartbeatAcknowledgementText(terminalText)) {
		const controlOnly = params.payloads.every((payload) => isHeartbeatAcknowledgementText(payload.text, 0));
		return {
			deliveryPayloads: params.payloads,
			deliveryDisposition: {
				kind: "heartbeat",
				controlOnly
			}
		};
	}
	return {
		deliveryPayloads: params.payloads.filter((payload) => !isHeartbeatAcknowledgementPayload(payload)),
		deliveryDisposition: { kind: "visible" }
	};
}
/** Picks the last payload with deliverable outbound content, preferring non-error payloads. */
function pickLastDeliverablePayload(payloads) {
	for (let i = payloads.length - 1; i >= 0; i--) {
		if (payloads[i]?.isError) continue;
		if (isDeliverablePayload(payloads[i])) return payloads[i];
	}
	for (let i = payloads.length - 1; i >= 0; i--) if (isDeliverablePayload(payloads[i])) return payloads[i];
}
/** Selects deliverable cron payloads while preserving multi-payload successful responses. */
function pickDeliverablePayloads(payloads) {
	const successfulDeliverablePayloads = payloads.filter((payload) => payload != null && payload.isError !== true && isDeliverablePayload(payload));
	if (successfulDeliverablePayloads.length > 0) return successfulDeliverablePayloads;
	const lastDeliverablePayload = pickLastDeliverablePayload(payloads);
	return lastDeliverablePayload ? [lastDeliverablePayload] : [];
}
function readToolErrorWarningName(payload) {
	return normalizeOptionalLowercaseString(payload && getReplyPayloadMetadata(payload)?.toolErrorWarning?.toolName);
}
function isNonTerminalToolErrorWarning(payload) {
	return Boolean(payload && getReplyPayloadMetadata(payload)?.nonTerminalToolErrorWarning);
}
function isSuccessfulCronPayload(payload) {
	return payload?.isError !== true && (isDeliverablePayload(payload) || payloadHasStructuredDeliveryContent(payload));
}
/** Resolves summary, output text, delivery payloads, and fatal-error state from cron run output. */
function resolveCronPayloadOutcome(params) {
	const fallbackOutputText = pickLastNonEmptyTextFromPayloads(params.payloads);
	const fallbackSummary = pickSummaryFromOutput(fallbackOutputText);
	const deliveryPayload = pickLastDeliverablePayload(params.payloads);
	const selectedDeliveryPayloads = pickDeliverablePayloads(params.payloads);
	const deliveryPayloadHasStructuredContent = payloadHasStructuredDeliveryContent(deliveryPayload);
	const hasErrorPayload = params.payloads.some((payload) => payload?.isError === true);
	const lastErrorPayloadIndex = params.payloads.findLastIndex((payload) => payload?.isError === true);
	const lastTextErrorPayload = params.payloads.findLast((payload) => payload?.isError === true && Boolean(payload?.text?.trim()));
	const lastErrorPayloadText = lastTextErrorPayload?.text?.trim();
	const errorPayloads = params.payloads.filter((payload) => payload?.isError === true);
	const finalText = normalizeOptionalString(params.finalAssistantVisibleText);
	const normalizedFinalAssistantVisibleText = finalText && !isSilentReplyPayloadText(finalText) ? finalText : void 0;
	const hasSuccessfulPayloadAfterLastError = !params.runLevelError && lastErrorPayloadIndex >= 0 && params.payloads.slice(lastErrorPayloadIndex + 1).some(isSuccessfulCronPayload);
	const hasSuccessfulPayloadBeforeLastError = !params.runLevelError && lastErrorPayloadIndex > 0 && params.payloads.slice(0, lastErrorPayloadIndex).some(isSuccessfulCronPayload);
	const lastErrorPayload = lastErrorPayloadIndex >= 0 ? params.payloads[lastErrorPayloadIndex] : void 0;
	const hasRecoveringTerminalOutput = normalizedFinalAssistantVisibleText !== void 0 || hasSuccessfulPayloadAfterLastError || hasSuccessfulPayloadBeforeLastError;
	const hasNonTerminalToolErrorWarning = !params.runLevelError && params.failureSignal?.fatalForCron !== true && hasRecoveringTerminalOutput && isNonTerminalToolErrorWarning(lastErrorPayload);
	const hasPendingPresentationWarning = !params.runLevelError && params.failureSignal?.fatalForCron !== true && lastErrorPayloadIndex >= 0 && readToolErrorWarningName(lastTextErrorPayload) === "message" && (normalizedFinalAssistantVisibleText !== void 0 || hasSuccessfulPayloadBeforeLastError);
	const hasStructuredDeliveryPayloads = selectedDeliveryPayloads.some((payload) => payloadHasStructuredDeliveryContent(payload));
	const hasRecoveredToolWarning = !params.runLevelError && params.failureSignal?.fatalForCron !== true && normalizedFinalAssistantVisibleText !== void 0 && !hasStructuredDeliveryPayloads && errorPayloads.length > 0 && errorPayloads.every((payload) => isExecLikeToolName(readToolErrorWarningName(payload) ?? ""));
	const hasFatalStructuredErrorPayload = hasErrorPayload && !hasSuccessfulPayloadAfterLastError && !hasPendingPresentationWarning && !hasNonTerminalToolErrorWarning && !hasRecoveredToolWarning;
	const shouldUseFinalAssistantVisibleText = (params.preferFinalAssistantVisibleText === true || hasRecoveredToolWarning) && normalizedFinalAssistantVisibleText !== void 0 && !hasFatalStructuredErrorPayload && !hasStructuredDeliveryPayloads;
	const summary = shouldUseFinalAssistantVisibleText ? pickSummaryFromOutput(normalizedFinalAssistantVisibleText) ?? fallbackSummary : fallbackSummary;
	const outputText = shouldUseFinalAssistantVisibleText ? normalizedFinalAssistantVisibleText : fallbackOutputText;
	const synthesizedText = normalizeOptionalString(outputText) ?? normalizeOptionalString(summary);
	const finalDeliveryPayload = shouldUseFinalAssistantVisibleText ? { text: normalizedFinalAssistantVisibleText } : void 0;
	if (finalDeliveryPayload && deliveryPayload && deliveryPayload.isError !== true && deliveryPayload.text === normalizedFinalAssistantVisibleText) {
		const tts = getReplyPayloadMetadata(deliveryPayload)?.tts;
		if (tts) setReplyPayloadMetadata(finalDeliveryPayload, { tts });
	}
	const resolvedDeliveryPayloads = finalDeliveryPayload ? [finalDeliveryPayload] : selectedDeliveryPayloads.length > 0 ? selectedDeliveryPayloads : synthesizedText ? [{ text: synthesizedText }] : [];
	const failureSignal = normalizeCronFailureSignal(params.failureSignal);
	const runLevelError = formatCronRunLevelError(params.runLevelError);
	const hasFatalErrorPayload = hasFatalStructuredErrorPayload || failureSignal !== void 0 || runLevelError !== void 0;
	const structuredErrorText = hasFatalStructuredErrorPayload ? lastErrorPayloadText ?? "cron isolated run returned an error payload" : void 0;
	const shouldUseRunLevelErrorPayload = runLevelError !== void 0 && structuredErrorText === void 0 && failureSignal === void 0;
	const fatalDeliveryText = structuredErrorText ?? failureSignal?.message ?? (shouldUseRunLevelErrorPayload ? runLevelError : void 0);
	const fatalDeliveryPayload = fatalDeliveryText ? {
		text: fatalDeliveryText,
		isError: true
	} : void 0;
	const delivery = fatalDeliveryPayload ? {
		deliveryPayloads: [fatalDeliveryPayload],
		deliveryDisposition: { kind: "visible" }
	} : resolveCronDeliveryPayloads({
		payloads: resolvedDeliveryPayloads,
		finalAssistantVisibleText: normalizedFinalAssistantVisibleText
	});
	return {
		summary: fatalDeliveryText ? pickSummaryFromOutput(fatalDeliveryText) ?? summary : summary,
		outputText: fatalDeliveryText ?? outputText,
		synthesizedText: fatalDeliveryText ?? synthesizedText,
		deliveryPayload: fatalDeliveryPayload ?? deliveryPayload,
		deliveryPayloads: delivery.deliveryPayloads,
		deliveryDisposition: delivery.deliveryDisposition,
		deliveryPayloadHasStructuredContent: fatalDeliveryPayload ? false : deliveryPayloadHasStructuredContent,
		hasFatalErrorPayload,
		hasFatalStructuredErrorPayload,
		embeddedRunError: structuredErrorText ? structuredErrorText : failureSignal ? formatCronFailureSignal(failureSignal) : runLevelError,
		pendingPresentationWarningError: hasPendingPresentationWarning ? lastErrorPayloadText : void 0
	};
}
//#endregion
//#region src/cron/isolated-agent/run-session-state.ts
/** Mutates and persists isolated cron session state around one run. */
function clearCronContextOwnerState(entry) {
	delete entry.contextTokens;
	delete entry.contextTokensSource;
	delete entry.contextBudgetStatus;
}
var CronSessionLifecycleClaimError = class extends Error {
	constructor(sessionKey, message = `Session "${sessionKey}" changed while starting work. Retry.`) {
		super(message);
		this.admissionDisposition = "session-conflict";
		this.name = "CronSessionLifecycleClaimError";
	}
};
function resolveCronLifecycleRevisionIdentity(lifecycleRevision) {
	return `cron-lifecycle-revision:${lifecycleRevision}`;
}
function cronTranscriptExists(params) {
	const sessionId = params.entry.sessionId?.trim();
	if (!sessionId) return false;
	try {
		return hasSessionTranscriptEventsSync({
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
	} catch {
		return false;
	}
}
function normalizeSessionField(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : void 0;
}
function projectCronOwnershipFields(entry) {
	const projected = { ...entry };
	delete projected.label;
	delete projected.pinnedAt;
	delete projected.updatedAt;
	return projected;
}
function toNonResumableCronSessionEntry(entry) {
	const next = { ...entry };
	delete next.sessionStartedAt;
	delete next.lastInteractionAt;
	delete next.cliSessionIds;
	delete next.cliSessionBindings;
	delete next.claudeCliSessionId;
	return next;
}
/** Creates the persistence callback that stores cron session metadata after a run. */
function createPersistCronSessionEntry(params) {
	return async (assertCommitAllowed, liveEntry = params.cronSession.sessionEntry) => {
		const resetBoundaryPending = params.cronSession.resetBoundaryPending !== void 0;
		if (assertCommitAllowed && resetBoundaryPending) throw new CronSessionLifecycleClaimError(params.agentSessionKey);
		const persistedEntry = isCronSessionKey(params.agentSessionKey) && liveEntry.sessionId && !cronTranscriptExists({
			entry: liveEntry,
			sessionKey: params.agentSessionKey,
			storePath: params.cronSession.storePath
		}) ? toNonResumableCronSessionEntry(liveEntry) : liveEntry;
		let committedEntry = persistedEntry;
		let mergedLiveEntry = liveEntry;
		await params.persistSessionEntry({
			storePath: params.cronSession.storePath,
			sessionKey: params.agentSessionKey,
			fallbackEntry: persistedEntry,
			assertCommitAllowed,
			...resetBoundaryPending ? { resetBoundary: {
				context: "preserve-tail",
				reason: "cron-stale",
				cwd: params.workspaceDir
			} } : {},
			update: (currentEntry) => {
				if (!currentEntry) {
					const creationStamp = buildSessionCreationStamp({
						via: "cron",
						actor: params.createdActor ?? { type: "system" },
						sandbox: params.sandbox
					});
					committedEntry = {
						...persistedEntry,
						...creationStamp
					};
					mergedLiveEntry = {
						...liveEntry,
						...creationStamp
					};
				}
				const ownsCurrentRevision = currentEntry?.lifecycleRevision === params.cronSession.lifecycleRevision;
				const currentRevisionActive = Boolean(currentEntry?.lifecycleRevision && isSessionWorkAdmissionActive(params.cronSession.storePath, [resolveCronLifecycleRevisionIdentity(currentEntry.lifecycleRevision)]));
				const initialEntryMatchesOwnershipFields = currentEntry !== void 0 && params.cronSession.initialSessionEntry !== void 0 && isDeepStrictEqual(projectCronOwnershipFields(currentEntry), projectCronOwnershipFields(params.cronSession.initialSessionEntry));
				const initialEntry = params.cronSession.initialSessionEntry;
				const initialLifecycleRevision = initialEntry?.lifecycleRevision;
				const currentContinuesInitialGeneration = currentEntry !== void 0 && initialEntry !== void 0 && initialLifecycleRevision !== void 0 && currentEntry.lifecycleRevision === initialLifecycleRevision && currentEntry.sessionId === initialEntry.sessionId;
				const canClaimInitialRevision = params.cronSession.initialSessionEntry ? !currentRevisionActive && (initialEntryMatchesOwnershipFields || currentContinuesInitialGeneration) : currentEntry === void 0;
				if (!ownsCurrentRevision && !canClaimInitialRevision) throw new CronSessionLifecycleClaimError(params.agentSessionKey);
				if ((ownsCurrentRevision || canClaimInitialRevision) && currentEntry && params.cronSession.initialSessionEntry) {
					committedEntry = mergeSessionSnapshotChanges({
						initial: params.cronSession.initialSessionEntry,
						next: persistedEntry,
						current: currentEntry
					});
					mergedLiveEntry = mergeSessionSnapshotChanges({
						initial: params.cronSession.initialSessionEntry,
						next: liveEntry,
						current: currentEntry
					});
				}
				return committedEntry;
			}
		});
		clearBootstrapSnapshotOnSessionBoundary({
			boundaryAppended: resetBoundaryPending,
			sessionKey: params.agentSessionKey
		});
		params.cronSession.resetBoundaryPending = void 0;
		params.cronSession.sessionEntry = mergedLiveEntry;
		params.cronSession.initialSessionEntry = structuredClone(committedEntry);
		params.cronSession.store[params.agentSessionKey] = committedEntry;
	};
}
/** Creates the hidden exact-run session owner used by detached media wakes. */
function createCronRunContinuationSession(params) {
	const scheduledToolPolicy = params.toolsAllow === void 0 ? void 0 : normalizeCronScheduledToolPolicy(params.scheduledToolPolicy);
	const scheduledToolCallerOrigin = normalizeCronScheduledToolCallerOrigin(params.scheduledToolCallerOrigin);
	const toolsAllowExecTarget = params.toolsAllow === void 0 ? void 0 : normalizeCronToolsAllowExecTarget(params.toolsAllowExecTarget);
	const toolsAllowExecTargetRequirement = params.toolsAllow === void 0 ? void 0 : normalizeCronToolsAllowExecTargetRequirement(params.toolsAllowExecTargetRequirement);
	const storedToolsAllow = stripCronPinnedExecGrant({
		toolsAllow: params.toolsAllow,
		requirement: toolsAllowExecTargetRequirement
	});
	const continuation = {
		lifecycleRevision: params.cronSession.lifecycleRevision,
		phase: "running",
		...storedToolsAllow !== void 0 ? { toolsAllow: storedToolsAllow } : {},
		...params.toolsAllowIsDefault === true ? { toolsAllowIsDefault: true } : {},
		...scheduledToolPolicy ? { scheduledToolPolicy } : {},
		...scheduledToolPolicy?.mode === "account" ? { scheduledToolCallerOrigin } : {},
		...toolsAllowExecTarget ? { toolsAllowExecTarget } : {},
		...toolsAllowExecTargetRequirement ? { toolsAllowExecTargetRequirement } : {},
		...params.cliSessionBindingFacts ? { cliSessionBindingFacts: { ...params.cliSessionBindingFacts } } : {}
	};
	const owns = (entry) => entry?.cronRunContinuation?.lifecycleRevision === continuation.lifecycleRevision;
	const persist = async (create, phase, basePersisted = false, assertCommitAllowed) => {
		const source = structuredClone(params.cronSession.sessionEntry);
		delete source.createdVia;
		delete source.createdActor;
		delete source.createdAt;
		delete source.previousSessionId;
		delete source.forkSource;
		let persisted = false;
		let alreadySealed = false;
		await params.persistSessionEntry({
			storePath: params.cronSession.storePath,
			sessionKey: params.runSessionKey,
			fallbackEntry: source,
			assertCommitAllowed,
			update: (current) => {
				if (current && !owns(current) || !current && !create) throw new CronSessionLifecycleClaimError(params.runSessionKey);
				if (current && current.cronRunContinuation?.phase !== "running") {
					alreadySealed = phase === "ready" && current.cronRunContinuation?.phase === "ready";
					if (alreadySealed) return current;
					throw new CronSessionLifecycleClaimError(params.runSessionKey);
				}
				persisted = true;
				return {
					...current,
					...source,
					cliSessionBindings: source.cliSessionBindings,
					cliSessionIds: source.cliSessionIds,
					claudeCliSessionId: source.claudeCliSessionId,
					...!current ? buildSessionCreationStamp({
						via: "cron",
						...inheritSessionCreationPolicy(params.cronSession.sessionEntry, params.createdActor ?? { type: "system" }),
						sandbox: params.cronSession.sessionEntry.sandbox ?? params.sandbox
					}) : {},
					...params.thinkingLevel ? { thinkingLevel: params.thinkingLevel } : {},
					cronRunContinuation: {
						...continuation,
						phase,
						...phase === "ready" ? { basePersisted } : {}
					}
				};
			}
		});
		if (!persisted && !alreadySealed) throw new CronSessionLifecycleClaimError(params.runSessionKey);
	};
	return {
		initialize: async () => await persist(true, "running"),
		sync: async (assertCommitAllowed) => await persist(false, "running", false, assertCommitAllowed),
		setCliExecutionProvider: async (provider) => {
			const normalizedProvider = provider?.trim();
			if (normalizedProvider) continuation.cliExecutionProvider = normalizedProvider;
			else delete continuation.cliExecutionProvider;
			await persist(false, "running");
		},
		seal: async (options) => await persist(false, "ready", options?.basePersisted === true)
	};
}
/** Adopts the session id produced by a run and preserves usage-family lineage. */
function adoptCronRunSessionMetadata(params) {
	const nextSessionId = normalizeSessionField(params.runMeta?.sessionId);
	if (!nextSessionId) return false;
	let changed = false;
	const previousSessionId = params.entry.sessionId;
	if (nextSessionId && nextSessionId !== previousSessionId) {
		params.entry.sessionId = nextSessionId;
		params.entry.usageFamilyKey = params.entry.usageFamilyKey ?? params.sessionKey;
		params.entry.usageFamilySessionIds = Array.from(/* @__PURE__ */ new Set([
			...params.entry.usageFamilySessionIds ?? [],
			...previousSessionId ? [previousSessionId] : [],
			nextSessionId
		]));
		changed = true;
	}
	return changed;
}
/** Persists a changed skills snapshot onto the cron session entry outside fast tests. */
async function persistCronSkillsSnapshotIfChanged(params) {
	if (params.isFastTestEnv || params.skillsSnapshot === params.cronSession.sessionEntry.skillsSnapshot) return;
	params.cronSession.sessionEntry = {
		...params.cronSession.sessionEntry,
		updatedAt: params.nowMs,
		skillsSnapshot: params.skillsSnapshot
	};
	await params.persistSessionEntry();
}
/**
* Updates the cron selection and drops facts produced by the previous model.
* Keeping those facts after the owner tuple changes lets a later run relabel stale telemetry.
*/
function setCronSessionRuntimeModel(params) {
	const provider = params.provider.trim();
	const model = params.model.trim();
	if (!provider || !model) return false;
	const selectionChanged = params.entry.modelProvider?.trim() !== provider || params.entry.model?.trim() !== model;
	if (selectionChanged) clearCronContextOwnerState(params.entry);
	setSessionRuntimeModel(params.entry, {
		provider,
		model
	});
	return selectionChanged;
}
/** Updates the producing harness and drops context facts owned by the previous runtime. */
function setCronSessionAgentHarnessId(params) {
	const previousRuntime = normalizeOptionalAgentRuntimeId(params.entry.agentHarnessId);
	const nextRuntime = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
	if (previousRuntime !== nextRuntime) clearCronContextOwnerState(params.entry);
	params.entry.agentHarnessId = params.agentHarnessId;
	return previousRuntime !== nextRuntime;
}
/** Records the selected provider/model before a cron run starts. */
function markCronSessionPreRun(params) {
	setCronSessionRuntimeModel(params);
	params.entry.systemSent = true;
}
/** Syncs live model/auth-profile changes from a running cron session back to storage. */
function syncCronSessionLiveSelection(params) {
	const previousRuntime = normalizeOptionalAgentRuntimeId(params.entry.agentRuntimeOverride);
	const nextRuntime = normalizeOptionalAgentRuntimeId(params.liveSelection.agentRuntimeOverride);
	setCronSessionRuntimeModel({
		entry: params.entry,
		provider: params.liveSelection.provider,
		model: params.liveSelection.model
	});
	if (previousRuntime !== nextRuntime) clearCronContextOwnerState(params.entry);
	applyModelRuntimeDirective(params.entry, params.liveSelection.agentRuntimeOverride ? {
		kind: "set",
		runtime: params.liveSelection.agentRuntimeOverride
	} : { kind: "clear" });
	if (params.liveSelection.authProfileId) {
		const source = params.liveSelection.authProfileIdSource ?? (params.entry.authProfileOverride?.trim() === params.liveSelection.authProfileId.trim() ? resolveSessionAuthProfileOverrideSource(params.entry) : "user");
		params.entry.authProfileOverride = params.liveSelection.authProfileId;
		params.entry.authProfileOverrideSource = source;
		if (source === "auto") params.entry.authProfileOverrideCompactionCount = params.entry.compactionCount ?? 0;
		else delete params.entry.authProfileOverrideCompactionCount;
		return;
	}
	delete params.entry.authProfileOverride;
	delete params.entry.authProfileOverrideSource;
	delete params.entry.authProfileOverrideCompactionCount;
}
//#endregion
export { markCronSessionPreRun as a, resolveCronLifecycleRevisionIdentity as c, syncCronSessionLiveSelection as d, pickLastNonEmptyTextFromPayloads as f, createPersistCronSessionEntry as i, setCronSessionAgentHarnessId as l, resolveCronPayloadOutcome as m, adoptCronRunSessionMetadata as n, persistCronSkillsSnapshotIfChanged as o, pickSummaryFromOutput as p, createCronRunContinuationSession as r, projectCronOwnershipFields as s, CronSessionLifecycleClaimError as t, setCronSessionRuntimeModel as u };
