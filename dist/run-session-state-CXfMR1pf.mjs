import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-DgZn2dLu.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import { S as isCronSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as resolveSessionAuthProfileOverrideSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import "./logger-DskmrSVa.mjs";
import { a as isSilentReplyPayloadText } from "./tokens-D4ghQG_g.mjs";
import { E as setReplyPayloadMetadata, c as getReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import "./model-thinking-default-CZnoMXD6.mjs";
import "./session-runtime-compat-rcNVygEk.mjs";
import "./thinking-runtime-DsaB5fLF.mjs";
import "./workspace-C0xiByg0.mjs";
import { a as normalizeCronToolsAllowExecTarget, i as normalizeCronScheduledToolPolicy, o as normalizeCronToolsAllowExecTargetRequirement, r as normalizeCronScheduledToolCallerOrigin, u as stripCronPinnedExecGrant } from "./scheduled-tool-policy-CYthJ0r4.mjs";
import { n as buildSessionCreationStamp, r as inheritSessionCreationPolicy } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { o as isHeartbeatAcknowledgementText } from "./heartbeat-BjLIgeQc.mjs";
import { h as isSessionWorkAdmissionActive, n as beginSessionWorkAdmission } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { u as setSessionRuntimeModel } from "./types-BZlUzQZy.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import "./usage-XmAH1cfG.mjs";
import { t as hasSessionTranscriptEventsSync } from "./session-accessor.sqlite-metadata-read-Dij1AT2k.mjs";
import "./timeout-Q2p-0uCf.mjs";
import { o as resolveSessionWorkStartError } from "./lifecycle-DdaXH8bC.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-DEDOYf-L.mjs";
import { n as clearBootstrapSnapshotOnSessionBoundary } from "./bootstrap-cache-BWoSWwko.mjs";
import { r as isExecLikeToolName } from "./tool-error-summary-64MNk8zq.mjs";
import "./current-time-CZi1S4GF.mjs";
import { t as applyModelRuntimeDirective } from "./directive-handling.model-runtime-CWNWhYW-.mjs";
import { r as mergeSessionSnapshotChanges } from "./session-snapshot-merge-Dh-eJoIb.mjs";
import { t as loadCronSessionEntryLatest } from "./session-00MZN2FA.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/cron/isolated-agent/helpers.ts
/** Normalizes isolated cron run output into summaries, delivery payloads, and error state. */
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
	const detail = normalizeOptionalString(record.message) ?? normalizeOptionalString(record.kind);
	return detail ? `cron isolated run failed: ${detail}` : "cron isolated run failed";
}
/**
* Returns the explanation when a reply reports AUTOMATION_FAILED on its exact first line.
* A reply that only quotes the token elsewhere stays ordinary output.
*/
function readAutomationFailedReport(text) {
	const [firstLine, ...detail] = (text ?? "").trim().split("\n");
	return firstLine?.trim() === "AUTOMATION_FAILED" ? normalizeOptionalString(detail.join("\n")) ?? "The automation run reported that it failed." : void 0;
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
	const successful = payloads.findLast((payload) => !payload?.isError && payload?.text?.trim())?.text?.trim();
	if (successful) return successful;
	return payloads.findLast((payload) => !isNonTerminalToolErrorWarning(payload) && payload?.text?.trim())?.text?.trim();
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
		deliveryPayloads: params.payloads.filter((payload) => payloadHasNonTextDeliveryContent(payload) || !isHeartbeatAcknowledgementText(payload.text)),
		deliveryDisposition: { kind: "visible" }
	};
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
	const deliveryPayload = params.payloads.findLast((payload) => !payload?.isError && isDeliverablePayload(payload)) ?? params.payloads.findLast(isDeliverablePayload);
	const successfulDeliveryPayloads = params.payloads.filter((payload) => payload != null && payload.isError !== true && isDeliverablePayload(payload));
	const selectedDeliveryPayloads = successfulDeliveryPayloads.length ? successfulDeliveryPayloads : deliveryPayload ? [deliveryPayload] : [];
	const deliveryPayloadHasStructuredContent = payloadHasStructuredDeliveryContent(deliveryPayload);
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
	const canRecoverToolWarning = !params.runLevelError && params.failureSignal?.fatalForCron !== true;
	const hasNonTerminalToolErrorWarning = canRecoverToolWarning && hasRecoveringTerminalOutput && isNonTerminalToolErrorWarning(lastErrorPayload);
	const hasPendingPresentationWarning = canRecoverToolWarning && lastErrorPayloadIndex >= 0 && readToolErrorWarningName(lastTextErrorPayload) === "message" && (normalizedFinalAssistantVisibleText !== void 0 || hasSuccessfulPayloadBeforeLastError);
	const hasStructuredDeliveryPayloads = selectedDeliveryPayloads.some((payload) => payloadHasStructuredDeliveryContent(payload));
	const hasRecoveredToolWarning = canRecoverToolWarning && normalizedFinalAssistantVisibleText !== void 0 && !hasStructuredDeliveryPayloads && errorPayloads.length > 0 && errorPayloads.every((payload) => isExecLikeToolName(readToolErrorWarningName(payload) ?? ""));
	const hasFatalStructuredErrorPayload = errorPayloads.length > 0 && !hasSuccessfulPayloadAfterLastError && !hasPendingPresentationWarning && !hasNonTerminalToolErrorWarning && !hasRecoveredToolWarning;
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
	const failureMessage = normalizeOptionalString(params.failureSignal?.message);
	const failureSignal = params.failureSignal?.fatalForCron === true && failureMessage ? {
		...params.failureSignal,
		message: failureMessage
	} : void 0;
	const runLevelError = formatCronRunLevelError(params.runLevelError);
	const reportedFailure = readAutomationFailedReport(normalizedFinalAssistantVisibleText ?? fallbackOutputText);
	const hasFatalErrorPayload = hasFatalStructuredErrorPayload || failureSignal !== void 0 || runLevelError !== void 0 || reportedFailure !== void 0;
	const structuredErrorText = hasFatalStructuredErrorPayload ? lastErrorPayloadText ?? "cron isolated run returned an error payload" : void 0;
	const fatalDeliveryText = structuredErrorText ?? failureSignal?.message ?? runLevelError ?? reportedFailure;
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
		embeddedRunError: structuredErrorText ? structuredErrorText : failureSignal ? formatCronFailureSignal(failureSignal) : runLevelError ?? reportedFailure,
		...fatalDeliveryText === reportedFailure && reportedFailure !== void 0 ? { agentReportedFailure: true } : {},
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
/** Claim the captured session generation before asynchronous run preparation. */
async function beginCronSessionWorkAdmission(params) {
	const { cronSession, agentSessionKey, runSessionKey } = params;
	const initialSessionEntry = cronSession.initialSessionEntry;
	return await beginSessionWorkAdmission({
		scope: cronSession.storePath,
		identities: [
			agentSessionKey,
			initialSessionEntry?.sessionId,
			cronSession.sessionEntry.sessionId,
			resolveCronLifecycleRevisionIdentity(cronSession.lifecycleRevision),
			runSessionKey
		],
		signal: params.signal,
		onInterrupt: params.onInterrupt,
		assertAllowed: () => {
			const currentEntry = loadCronSessionEntryLatest(cronSession.storePath, agentSessionKey);
			if (initialSessionEntry ? !currentEntry || !isDeepStrictEqual(projectCronOwnershipFields(currentEntry), projectCronOwnershipFields(initialSessionEntry)) : Boolean(currentEntry)) throw new CronSessionLifecycleClaimError(agentSessionKey);
			const archivedSessionError = resolveSessionWorkStartError(agentSessionKey, currentEntry);
			if (archivedSessionError) throw new CronSessionLifecycleClaimError(agentSessionKey, archivedSessionError);
		}
	});
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
				if (currentEntry && params.cronSession.initialSessionEntry) {
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
	const nextSessionId = params.runMeta?.sessionId?.trim();
	const previousSessionId = params.entry.sessionId;
	if (!nextSessionId || nextSessionId === previousSessionId) return false;
	params.entry.sessionId = nextSessionId;
	params.entry.usageFamilyKey = params.entry.usageFamilyKey ?? params.sessionKey;
	params.entry.usageFamilySessionIds = Array.from(/* @__PURE__ */ new Set([
		...params.entry.usageFamilySessionIds ?? [],
		...previousSessionId ? [previousSessionId] : [],
		nextSessionId
	]));
	return true;
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
export { createPersistCronSessionEntry as a, setCronSessionAgentHarnessId as c, pickLastNonEmptyTextFromPayloads as d, pickSummaryFromOutput as f, createCronRunContinuationSession as i, setCronSessionRuntimeModel as l, resolveCronPayloadOutcome as m, adoptCronRunSessionMetadata as n, persistCronSkillsSnapshotIfChanged as o, readAutomationFailedReport as p, beginCronSessionWorkAdmission as r, resolveCronLifecycleRevisionIdentity as s, CronSessionLifecycleClaimError as t, syncCronSessionLiveSelection as u };
