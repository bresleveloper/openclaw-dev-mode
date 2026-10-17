import { _ as resolvePrimaryStringValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber, n as MAX_TIMER_TIMEOUT_MS, u as asPositiveFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-BBJTTIuE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-DgZn2dLu.mjs";
import { s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import { E as createDiagnosticTraceContextFromActiveScope, O as freezeDiagnosticTraceContext, P as runWithDiagnosticTraceContext, p as isDiagnosticsEnabled, s as emitTrustedDiagnosticEvent, w as createChildDiagnosticTraceContext } from "./diagnostic-events-BADdmgZf.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { C as tryResolveAmbientOwnerAgentId, a as resolveAgentDir, d as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey, S as isCronSessionKey } from "./session-key-C09ow4h0.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { b as resolveSubagentModelConfigSelectionResult } from "./agent-scope-CG17uXFn.mjs";
import { S as releaseAgentRunContext, o as consumeCronNextCheckProposal, r as claimAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { l as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent, y as withAgentRunLifecycleGeneration } from "./agent-events-GvNTkbe3.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { _ as resolveHooksGmailModel, h as resolveConfiguredModelRef, m as resolveConfiguredModelPolicyAllow, s as getModelRefStatus } from "./model-selection-shared-DKlQ1p0S.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-BWpJFHtW.mjs";
import { c as normalizeThinkLevel } from "./thinking.shared-Jy32Vp-O.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { l as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-DMR2FD5c.mjs";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-BDmQKwxy.mjs";
import { t as resolveAllowedModelRefCore } from "./model-selection-resolve-cpFpShck.mjs";
import { a as isSilentReplyPayloadText, r as SILENT_REPLY_TOKEN, t as AUTOMATION_FAILED_TOKEN } from "./tokens-D4ghQG_g.mjs";
import { l as resolveCreatorSandbox } from "./operator-role-policy-BqPaarjx.mjs";
import { n as publishedModelCatalogOwnerMatchesAgent } from "./prepared-model-catalog-owner-lSB2_Cf6.mjs";
import { a as withPreparedModelRuntimePluginGenerationScope, i as scopePreparedModelRuntimeLease } from "./prepared-model-runtime-generation-scope-B18pp3-E.mjs";
import "./thinking-NbdrO8vA.mjs";
import { i as resolveThinkingSelectionCore, n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-CZnoMXD6.mjs";
import { a as isAgentHarnessSessionKey, n as AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE } from "./agent-harness-session-key-D8EQIzja.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-rcNVygEk.mjs";
import { i as normalizeThinkingCatalogProviders, r as needsThinkHydration, s as resolveEffectiveAgentRuntime } from "./thinking-runtime-DsaB5fLF.mjs";
import { t as ensureAgentWorkspace } from "./workspace-C0xiByg0.mjs";
import { m as loadPublishedGatewayReplyDispatchRuntime, t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-BvTeWKXf.mjs";
import { l as loadResolvedPublishedModelCatalogOwner, o as loadProviderScopedThinkingCatalog } from "./prepared-model-catalog-5NeF8DiP.mjs";
import { n as mapHookExternalContentSource, r as resolveHookExternalContentSource, t as isExternalHookSession } from "./external-content-source-BKc9v74i.mjs";
import { s as resolveCronScheduledToolPolicy } from "./scheduled-tool-policy-CYthJ0r4.mjs";
import { n as isDetachedCronSessionTarget, s as resolveCronSessionTargetSessionKey } from "./session-target-DJsUULzX.mjs";
import { r as resolveCronRunToolsAllow } from "./tools-allow-BpmRg2Op.mjs";
import { H as extractTextFromChatContent } from "./user-facing-text-DC1sCo4O.mjs";
import { Q as normalizeAgentRunTerminalReplySnapshot, X as buildAgentRunTerminalReplySnapshot } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { a as hasBillableUsage, i as deriveSessionTotalTokens, n as deriveContextPromptTokens, o as hasNonzeroUsage } from "./usage-XmAH1cfG.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-Q2p-0uCf.mjs";
import { m as resolveAgentRunErrorLifecycleFields, o as createAgentRunRestartAbortError } from "./run-termination-DGv2EKii.mjs";
import { n as logMessageDispatchStarted, t as logMessageDispatchCompleted } from "./diagnostic-BC19O2Si.mjs";
import "./lanes-D7a4ntDu.mjs";
import { u as isCommandLaneTaskTimeoutError } from "./command-queue-CFE60Avj.mjs";
import { t as resolveSourceDeliveryOutcome } from "./source-delivery-plan-QY8JT1w1.mjs";
import "./sessions-D_sxp1B4.mjs";
import { n as resolveProjectedSessionContextTokens, r as resolveTrustedSessionContextTokens } from "./context-token-provenance-Djv3AdiI.mjs";
import { i as normalizeCronRunErrorText, o as resolveCronAbortReasonText } from "./execution-errors-3rfzndmK.mjs";
import { r as clearBootstrapSnapshotOnSessionRollover } from "./bootstrap-cache-BWoSWwko.mjs";
import { t as createDiagnosticMessageLifecycle } from "./message-lifecycle-B0cURqCq.mjs";
import "./agent-bundle-mcp-tools-BAc-juSa.mjs";
import { s as readSessionMessagesAsync } from "./session-transcript-readers-Z-j3mApc.mjs";
import { n as resolveCronJobEffectiveAgentId } from "./agent-id-uYw1RFJQ.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-C18RZBZJ.mjs";
import { t as removeCronRunContinuationSessionIfIdle } from "./run-continuation-cleanup-C3VWFB5I.mjs";
import { t as hasAcceptedSessionSpawn } from "./accepted-session-spawn-DpD0J38H.mjs";
import { r as resolveIngressWorkspaceOverrideForSessionRun } from "./spawned-context-BjFFoRwI.mjs";
import { i as toNormalizedUsage, r as mergeUsageIntoAccumulator, t as createUsageAccumulator } from "./usage-accumulator-CzWfyqDH.mjs";
import { n as resolveCronStyleNow } from "./current-time-CZi1S4GF.mjs";
import { t as createAgentLifecycleTerminalBackstop } from "./agent-lifecycle-terminal-COwG2fZv.mjs";
import { o as projectChatDisplayMessages } from "./chat-display-projection.core-BSNrSH5r.mjs";
import "./chat-display-projection-ZUh2mrnJ.mjs";
import { n as isEmbeddedRunTerminalToolFailure, t as CODE_MODE_MCP_CATALOG_MISS_MESSAGE } from "./terminal-tool-failure-C7cE3h6q.mjs";
import { t as cleanupBrowserSessionsForLifecycleEnd } from "./browser-lifecycle-cleanup-BvQA8BG4.mjs";
import { i as mergeCronRunDiagnostics, n as createCronRunDiagnosticsFromError, t as createCronRunDiagnosticsFromAgentResult } from "./run-diagnostics-D1nl-AS_.mjs";
import { t as resolveCronRunErrorReason } from "./run-error-reason-jRFSHEdA.mjs";
import { t as cleanupCronRunSessionAfterRun } from "./session-cleanup-DKKxATZ3.mjs";
import { t as classifyCronAgentTurnShellPrompt } from "./agent-turn-command-prompt-DqrePHZg.mjs";
import { t as CronExecutionRootRuntimeError } from "./execution-root-runtime-BEhlVxn3.mjs";
import { a as buildCronDeliveryTrace, c as loadCronDeliveryRuntime, l as resolveCronDeliveryContext, n as resolveCronPreflight, o as createCronToolsAllowPreflightDiagnostics, u as resolveCronChannelOutputPolicy } from "./run-fallback-policy-CHxzFJpv.mjs";
import { a as createPersistCronSessionEntry, c as setCronSessionAgentHarnessId, i as createCronRunContinuationSession, l as setCronSessionRuntimeModel, m as resolveCronPayloadOutcome, n as adoptCronRunSessionMetadata, o as persistCronSkillsSnapshotIfChanged, r as beginCronSessionWorkAdmission, t as CronSessionLifecycleClaimError } from "./run-session-state-CXfMR1pf.mjs";
import { n as prepareCronSession } from "./session-00MZN2FA.mjs";
import { n as resolveCronAgentConfig, t as resolveCronActiveRuntimeConfig } from "./run-config-Cj7QuhuG.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { isPathInside } from "@openclaw/fs-safe/path";
//#region src/cron/isolated-agent/run-usage.ts
const cronContextRuntimeLoader$1 = createLazyImportLoader(() => import("./run-context.runtime.js"));
function resolveCronRunUsage(runs) {
	if (runs.length === 1) return runs[0]?.runResult.meta?.agentMeta?.usage;
	const accumulated = createUsageAccumulator();
	for (const { runResult } of runs) {
		const usage = runResult.meta?.agentMeta?.usage;
		if (!usage) continue;
		const bucketTotal = (usage.input ?? 0) + (usage.output ?? 0) + (usage.cacheRead ?? 0) + (usage.cacheWrite ?? 0);
		mergeUsageIntoAccumulator(accumulated, {
			...usage,
			total: Math.max(bucketTotal, asNonNegativeFiniteNumber(usage.total) ?? 0)
		});
	}
	return toNormalizedUsage(accumulated);
}
function applyCronRunUsage(prepared, runs) {
	const usage = resolveCronRunUsage(runs);
	if (!hasNonzeroUsage(usage) && !hasNonzeroUsage(runs.at(-1)?.runResult.meta?.agentMeta?.usage)) return;
	const input = usage?.input ?? 0;
	const output = usage?.output ?? 0;
	const cacheRead = usage?.cacheRead ?? 0;
	const cacheWrite = usage?.cacheWrite ?? 0;
	prepared.cronSession.sessionEntry.inputTokens = input;
	prepared.cronSession.sessionEntry.outputTokens = output;
	prepared.cronSession.sessionEntry.cacheRead = cacheRead;
	prepared.cronSession.sessionEntry.cacheWrite = cacheWrite;
	const bucketTotalTokens = input + output + cacheRead + cacheWrite;
	const totalTokens = typeof usage?.total === "number" && Number.isFinite(usage.total) ? Math.max(bucketTotalTokens, usage.total) : bucketTotalTokens;
	return {
		input_tokens: input,
		output_tokens: output,
		...totalTokens > 0 ? { total_tokens: totalTokens } : {},
		...cacheRead > 0 ? { cache_read_tokens: cacheRead } : {},
		...cacheWrite > 0 ? { cache_write_tokens: cacheWrite } : {}
	};
}
/** Preserve each completed prompt's prices and diagnostics across a continuation. */
async function recordCronRunUsage(params) {
	const { prepared, runs } = params;
	const billableRuns = runs.filter(({ runResult }) => {
		const meta = runResult.meta?.agentMeta;
		return hasBillableUsage(meta?.usage) || hasBillableUsage(meta?.diagnosticUsage);
	});
	if (billableRuns.length === 0) return;
	const { estimateAggregateUsageCost, resolveModelCostConfig } = await import("./usage-format-7vN_DurE.mjs");
	let estimatedCostUsd = 0;
	let hasSessionUsage = false;
	for (const run of billableRuns) {
		const result = run.runResult;
		const meta = result.meta?.agentMeta;
		const usage = meta?.usage;
		const diagnosticUsage = meta?.diagnosticUsage ?? usage;
		const provider = meta?.provider ?? run.fallbackProvider;
		const model = meta?.model ?? run.fallbackModel;
		const costConfig = resolveModelCostConfig({
			provider,
			model,
			config: prepared.cfgWithAgentDefaults,
			agentDir: prepared.agentDir
		});
		if (hasBillableUsage(usage)) {
			hasSessionUsage = true;
			const cost = asNonNegativeFiniteNumber(estimateAggregateUsageCost({
				usage,
				cost: costConfig
			}));
			estimatedCostUsd = estimatedCostUsd !== void 0 && cost !== void 0 ? estimatedCostUsd + cost : void 0;
		}
		if (!isDiagnosticsEnabled(prepared.cfgWithAgentDefaults) || !hasBillableUsage(diagnosticUsage)) continue;
		const input = diagnosticUsage.input ?? 0;
		const output = diagnosticUsage.output ?? 0;
		const cacheRead = diagnosticUsage.cacheRead ?? 0;
		const cacheWrite = diagnosticUsage.cacheWrite ?? 0;
		const promptTokens = input + cacheRead + cacheWrite;
		const bucketTotalTokens = promptTokens + output;
		const total = typeof diagnosticUsage.total === "number" && Number.isFinite(diagnosticUsage.total) ? Math.max(bucketTotalTokens, diagnosticUsage.total) : bucketTotalTokens;
		const costUsd = asNonNegativeFiniteNumber(estimateAggregateUsageCost({
			usage: diagnosticUsage,
			cost: costConfig
		}));
		const contextUsedTokens = deriveContextPromptTokens({
			lastCallUsage: meta?.lastCallUsage,
			promptTokens: meta?.promptTokens,
			usage
		});
		const contextTokens = (result === runs.at(-1)?.runResult ? params.contextTokens : void 0) ?? asPositiveFiniteNumber(meta?.contextTokens) ?? (await cronContextRuntimeLoader$1.load()).resolveModelContextTokenProjection({
			cfg: prepared.cfgWithAgentDefaults,
			provider,
			model,
			allowAsyncLoad: false
		}).contextTokens ?? 2e5;
		emitTrustedDiagnosticEvent({
			type: "model.usage",
			...result.diagnosticTrace ? { trace: freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(result.diagnosticTrace)) } : {},
			sessionKey: prepared.runSessionKey,
			sessionId: prepared.currentRunSessionId(),
			channel: "cron",
			agentId: prepared.agentId,
			provider,
			model,
			usage: {
				input,
				output,
				cacheRead,
				cacheWrite,
				promptTokens,
				total
			},
			lastCallUsage: meta?.lastCallUsage,
			context: {
				limit: contextTokens,
				...contextUsedTokens !== void 0 ? { used: contextUsedTokens } : {}
			},
			...costUsd !== void 0 ? { costUsd } : {},
			durationMs: run.runEndedAt - run.runStartedAt
		});
	}
	if (hasSessionUsage) prepared.cronSession.sessionEntry.estimatedCostUsd = estimatedCostUsd;
}
//#endregion
//#region src/cron/isolated-agent/run-finalize.ts
/** Final persistence, telemetry, and delivery for an isolated cron run. */
const cronContextRuntimeLoader = createLazyImportLoader(() => import("./run-context.runtime.js"));
async function finalizeCronRun(params) {
	const { prepared, execution } = params;
	const finalRunResult = execution.runResult;
	const replyDisposition = (normalizeAgentRunTerminalReplySnapshot(finalRunResult.meta?.terminalReply) ?? buildAgentRunTerminalReplySnapshot({
		visibleText: finalRunResult.meta?.finalAssistantVisibleText,
		rawText: finalRunResult.meta?.finalAssistantRawText,
		terminalReplyKind: finalRunResult.meta?.terminalReplyKind
	})).disposition;
	const payloads = finalRunResult.payloads ?? [];
	const cleanupRunSession = async (reason) => {
		await cleanupCronRunSessionAfterRun({
			job: prepared.input.job,
			agentSessionKey: prepared.agentSessionKey,
			sessionId: prepared.currentRunSessionId(),
			lifecycleRevision: prepared.cronSession.lifecycleRevision,
			sessionUpdatedAt: prepared.cronSession.sessionEntry.updatedAt,
			beforeDelete: params.beforeSessionDelete,
			reason
		});
		params.markCronRunSessionCleanupHandled();
	};
	if (!params.isAborted()) {
		if (finalRunResult.meta?.systemPromptReport) prepared.cronSession.sessionEntry.systemPromptReport = finalRunResult.meta.systemPromptReport;
		if (finalRunResult.meta?.executionTrace?.runner !== "cli") adoptCronRunSessionMetadata({
			entry: prepared.cronSession.sessionEntry,
			sessionKey: prepared.agentSessionKey,
			runMeta: finalRunResult.meta?.agentMeta
		});
	}
	const usage = resolveCronRunUsage(execution.completedPromptRuns);
	const lastCallUsage = finalRunResult.meta?.agentMeta?.lastCallUsage;
	const promptTokens = finalRunResult.meta?.agentMeta?.promptTokens;
	const modelUsed = finalRunResult.meta?.agentMeta?.model ?? execution.fallbackModel;
	const providerUsed = finalRunResult.meta?.agentMeta?.provider ?? execution.fallbackProvider;
	const runtimeContextTokens = asPositiveFiniteNumber(finalRunResult.meta?.agentMeta?.contextTokens);
	const { contextTokens: modelContextTokens, authoredContextTokens } = (await cronContextRuntimeLoader.load()).resolveModelContextTokenProjection({
		cfg: prepared.cfgWithAgentDefaults,
		provider: providerUsed,
		model: modelUsed,
		allowAsyncLoad: false
	});
	const agentHarnessId = normalizeOptionalString(finalRunResult.meta?.agentMeta?.agentHarnessId);
	const retainedRuntimeContextTokens = resolveTrustedSessionContextTokens({
		entry: prepared.cronSession.sessionEntry,
		provider: providerUsed,
		model: modelUsed,
		agentHarnessId
	});
	const projectedContextTokens = resolveProjectedSessionContextTokens({
		entry: prepared.cronSession.sessionEntry,
		provider: providerUsed,
		model: modelUsed,
		agentHarnessId,
		resolvedContextTokens: modelContextTokens,
		authoredContextTokens
	});
	const contextTokens = runtimeContextTokens ?? projectedContextTokens ?? 2e5;
	const projectedUsesPersistedContext = retainedRuntimeContextTokens !== void 0 && (prepared.cronSession.sessionEntry.modelSelectionLocked === true || authoredContextTokens === void 0 && projectedContextTokens === retainedRuntimeContextTokens);
	const contextTokensSource = runtimeContextTokens !== void 0 ? finalRunResult.meta?.agentMeta?.contextTokensSource ?? "resolved" : projectedUsesPersistedContext ? prepared.cronSession.sessionEntry.contextTokensSource : "resolved";
	if (!params.isAborted()) {
		setCronSessionRuntimeModel({
			entry: prepared.cronSession.sessionEntry,
			provider: providerUsed,
			model: modelUsed
		});
		setCronSessionAgentHarnessId({
			entry: prepared.cronSession.sessionEntry,
			agentHarnessId
		});
		prepared.cronSession.sessionEntry.contextTokens = contextTokens;
		prepared.cronSession.sessionEntry.contextTokensSource = contextTokensSource;
	}
	if (hasNonzeroUsage(usage) || hasNonzeroUsage(finalRunResult.meta?.agentMeta?.usage)) {
		const totalTokens = deriveSessionTotalTokens({
			usage: lastCallUsage,
			contextTokens,
			promptTokens
		});
		if (typeof totalTokens === "number" && Number.isFinite(totalTokens) && totalTokens > 0) {
			prepared.cronSession.sessionEntry.totalTokens = totalTokens;
			prepared.cronSession.sessionEntry.totalTokensFresh = true;
			prepared.cronSession.sessionEntry.totalTokensVersion = 1;
		} else {
			prepared.cronSession.sessionEntry.totalTokens = void 0;
			prepared.cronSession.sessionEntry.totalTokensFresh = false;
			prepared.cronSession.sessionEntry.totalTokensVersion = void 0;
		}
	}
	const telemetry = {
		model: modelUsed,
		provider: providerUsed,
		usage: await params.settleUsage(contextTokens)
	};
	if (params.isAborted()) return prepared.withRunSession({
		status: "error",
		error: params.abortReason(),
		replyDisposition,
		diagnostics: mergeCronRunDiagnostics(prepared.preflightDiagnostics, createCronRunDiagnosticsFromAgentResult(finalRunResult, { finalStatus: "error" }), createCronRunDiagnosticsFromError("cron-setup", params.abortReason())),
		...telemetry
	});
	const cronPayloadOutcome = resolveCronPayloadOutcome({
		payloads,
		runLevelError: finalRunResult.meta?.error,
		failureSignal: finalRunResult.meta?.failureSignal,
		finalAssistantVisibleText: finalRunResult.meta?.finalAssistantVisibleText,
		preferFinalAssistantVisibleText: (await resolveCronChannelOutputPolicy(prepared.resolvedDelivery.channel, { deliveryRequested: prepared.deliveryRequested })).preferFinalAssistantVisibleText
	});
	if (finalRunResult.meta?.aborted === true && !cronPayloadOutcome.hasFatalErrorPayload) {
		const error = normalizeOptionalString(finalRunResult.meta.error?.message) ?? "cron isolated agent run aborted";
		await cleanupRunSession("cron-delete-after-run-aborted");
		return prepared.withRunSession({
			status: "error",
			error,
			replyDisposition,
			diagnostics: mergeCronRunDiagnostics(prepared.preflightDiagnostics, createCronRunDiagnosticsFromAgentResult(finalRunResult, { finalStatus: "error" }), createCronRunDiagnosticsFromError("agent-run", error)),
			...telemetry
		});
	}
	const { deliveryDisposition, deliveryPayloadHasStructuredContent, hasFatalStructuredErrorPayload, pendingPresentationWarningError } = cronPayloadOutcome;
	let { synthesizedText, deliveryPayloads, summary, outputText, hasFatalErrorPayload, embeddedRunError, agentReportedFailure } = cronPayloadOutcome;
	const terminalToolFailure = finalRunResult.meta?.terminalToolFailure;
	const hasTerminalToolFailure = isEmbeddedRunTerminalToolFailure(terminalToolFailure);
	if (hasFatalErrorPayload && hasTerminalToolFailure) summary = CODE_MODE_MCP_CATALOG_MISS_MESSAGE;
	const agentDiagnostics = createCronRunDiagnosticsFromAgentResult(finalRunResult, { finalStatus: hasFatalErrorPayload ? "error" : "ok" });
	const runDiagnostics = mergeCronRunDiagnostics(prepared.preflightDiagnostics, agentDiagnostics);
	const resolveRunOutcome = (result) => {
		const disposition = result?.disposition;
		const failure = disposition?.kind === "error" ? disposition : void 0;
		const useRunFailure = hasFatalErrorPayload && !failure;
		const runError = embeddedRunError ?? "cron isolated run returned an error payload";
		const deliveryError = disposition && useRunFailure ? void 0 : result?.deliveryError;
		const deliveryDiagnosticError = deliveryError ?? failure?.error;
		const output = failure && failure.errorKind !== "delivery-target" ? {} : disposition && !useRunFailure ? {
			summary: result?.summary,
			outputText: result?.outputText
		} : {
			summary,
			outputText
		};
		return prepared.withRunSession({
			status: failure || hasFatalErrorPayload ? "error" : "ok",
			...failure ? {
				error: failure.error,
				...failure.errorKind ? { errorKind: failure.errorKind } : {}
			} : hasFatalErrorPayload ? {
				error: runError,
				...agentReportedFailure ? { errorClassification: {
					kind: "permanent",
					reportedByAgent: true
				} } : {}
			} : {},
			...output,
			replyDisposition,
			deliveryState: result?.deliveryState,
			delivered: useRunFailure && disposition?.kind === "pending" ? void 0 : failure?.delivered ?? result?.delivered,
			deliveryAttempted: result?.deliveryAttempted,
			deliveryError,
			deliverySuppressionReason: result?.deliverySuppressionReason,
			delivery: result?.delivery,
			diagnostics: mergeCronRunDiagnostics(runDiagnostics, useRunFailure && !hasTerminalToolFailure ? createCronRunDiagnosticsFromError("agent-run", runError) : void 0, deliveryDiagnosticError ? createCronRunDiagnosticsFromError("delivery", deliveryDiagnosticError) : void 0),
			...telemetry
		});
	};
	const acceptedSessionSpawn = hasAcceptedSessionSpawn(finalRunResult.acceptedSessionSpawns);
	const heartbeatOnlyResponse = prepared.deliveryRequested && !hasFatalErrorPayload && deliveryDisposition.kind !== "visible";
	const heartbeatControlOnlyResponse = heartbeatOnlyResponse && (deliveryDisposition.kind === "empty" || deliveryDisposition.kind === "heartbeat" && deliveryDisposition.controlOnly);
	const spawnOnlyHandoff = acceptedSessionSpawn && (heartbeatControlOnlyResponse || deliveryPayloads.length === 0 && normalizeOptionalString(synthesizedText) === void 0);
	if (spawnOnlyHandoff && heartbeatControlOnlyResponse) {
		deliveryPayloads = [];
		synthesizedText = void 0;
		summary = void 0;
		outputText = void 0;
	}
	const skipHeartbeatDelivery = heartbeatOnlyResponse && !spawnOnlyHandoff;
	const sourceDeliveryOutcome = resolveSourceDeliveryOutcome(prepared.sourceDelivery, {
		didSendViaMessageTool: finalRunResult.didSendViaMessagingTool,
		messageToolSentTargets: finalRunResult.messagingToolSentTargets
	});
	let queueSourceSessionMessageToolAwareness;
	if (sourceDeliveryOutcome.visibleDeliveries.length > 0) {
		const { queueCronMessageToolDeliveryAwareness } = await loadCronDeliveryRuntime();
		queueSourceSessionMessageToolAwareness = await queueCronMessageToolDeliveryAwareness({
			cfg: prepared.cfgWithAgentDefaults,
			runSessionKey: prepared.runSessionKey,
			job: prepared.input.job,
			agentId: prepared.agentId,
			agentSessionKey: prepared.agentSessionKey,
			deferredTargetSessionKey: prepared.input.job.sessionTarget === "current" ? prepared.sourceSessionKey : void 0,
			runStartedAt: execution.runStartedAt,
			resolvedDelivery: prepared.resolvedDelivery,
			sourceDeliveryOutcome
		});
	}
	const hasIntentionalSilentReply = finalRunResult.meta?.terminalReplyKind === "silent-empty" || isSilentReplyPayloadText(finalRunResult.meta?.finalAssistantRawText) || isSilentReplyPayloadText(finalRunResult.meta?.finalAssistantVisibleText);
	if (hasFatalStructuredErrorPayload && prepared.deliveryRequested) {
		await cleanupRunSession("cron-delete-after-run-fatal-error");
		const deliveryTrace = buildCronDeliveryTrace({
			deliveryPlan: prepared.deliveryPlan,
			resolvedDelivery: prepared.resolvedDelivery,
			sourceDeliveryOutcome,
			fallbackUsed: false,
			delivered: sourceDeliveryOutcome.verifiedMessageToolDelivery
		});
		await queueSourceSessionMessageToolAwareness?.();
		return resolveRunOutcome({
			delivered: sourceDeliveryOutcome.verifiedMessageToolDelivery,
			deliveryAttempted: sourceDeliveryOutcome.verifiedMessageToolDelivery,
			delivery: deliveryTrace
		});
	}
	params.markCronRunSessionCleanupHandled();
	const { dispatchCronDelivery } = await loadCronDeliveryRuntime();
	const deliveryResult = await dispatchCronDelivery({
		cfgWithAgentDefaults: prepared.cfgWithAgentDefaults,
		deps: prepared.input.deps,
		job: prepared.input.job,
		deliveryAttemptFence: prepared.input.deliveryAttemptFence,
		agentId: prepared.agentId,
		agentSessionKey: prepared.agentSessionKey,
		sourceSessionKey: prepared.sourceSessionKey,
		sourceSessionGeneration: prepared.sourceSessionGeneration,
		runSessionKey: prepared.runSessionKey,
		sessionId: prepared.currentRunSessionId(),
		lifecycleRevision: prepared.cronSession.lifecycleRevision,
		sessionUpdatedAt: prepared.cronSession.sessionEntry.updatedAt,
		beforeSessionDelete: params.beforeSessionDelete,
		runStartedAt: execution.runStartedAt,
		timeoutMs: prepared.timeoutMs,
		resolvedDelivery: prepared.resolvedDelivery,
		deliveryPlan: prepared.deliveryPlan,
		deliveryRequested: prepared.deliveryRequested,
		undeliveredRunStatus: hasFatalErrorPayload || pendingPresentationWarningError ? "error" : "ok",
		skipDelivery: skipHeartbeatDelivery ? hasIntentionalSilentReply ? "silent" : deliveryDisposition.kind : void 0,
		spawnOnlyHandoff,
		sourceDeliveryOutcome,
		queueSourceSessionMessageToolAwareness,
		deliveryBestEffort: prepared.input.job.delivery?.bestEffort === true,
		deliveryPayloadHasStructuredContent,
		deliveryPayloads,
		synthesizedText,
		ttsAuto: prepared.cronSession.sessionEntry.ttsAuto,
		summary,
		outputText,
		abortSignal: prepared.input.abortSignal ?? prepared.input.signal,
		isAborted: params.isAborted,
		abortReason: params.abortReason
	});
	const deliveryTrace = buildCronDeliveryTrace({
		deliveryPlan: prepared.deliveryPlan,
		resolvedDelivery: prepared.resolvedDelivery,
		sourceDeliveryOutcome,
		fallbackUsed: prepared.deliveryRequested && deliveryResult.deliveryAttempted && !sourceDeliveryOutcome.satisfiesSourceDelivery,
		delivered: deliveryResult.delivered
	});
	if (!deliveryResult.disposition) {
		summary = deliveryResult.summary;
		outputText = deliveryResult.outputText;
	}
	if (pendingPresentationWarningError && deliveryResult.delivered !== true) {
		hasFatalErrorPayload = true;
		embeddedRunError = pendingPresentationWarningError;
	}
	if (deliveryResult.agentReportedFailure && !hasFatalErrorPayload) {
		hasFatalErrorPayload = true;
		embeddedRunError = deliveryResult.agentReportedFailure;
		agentReportedFailure = true;
	}
	return resolveRunOutcome({
		...deliveryResult,
		delivery: deliveryTrace
	});
}
//#endregion
//#region src/skills/runtime/cron-snapshot.ts
const skillsSnapshotRuntimeLoader = createLazyImportLoader(() => import("./cron-snapshot.runtime.js"));
async function resolveCronSkillsSnapshot(params) {
	if (params.isFastTestEnv) return params.existingSnapshot ?? {
		prompt: "",
		skills: []
	};
	const runtime = await skillsSnapshotRuntimeLoader.load();
	const skillFilter = runtime.resolveEffectiveAgentSkillFilter(params.config, params.agentId);
	const nodeSkills = runtime.resolveNodeExecEligibility({
		cfg: params.config,
		agentId: params.agentId
	});
	return (await runtime.resolveReusableWorkspaceSkillSnapshot({
		workspaceDir: params.workspaceDir,
		config: params.config,
		agentId: params.agentId,
		existingSnapshot: params.existingSnapshot,
		librarySelections: params.librarySelections,
		skillFilter,
		resolveEligibility: () => ({
			nodeSkills,
			remote: runtime.getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
		}),
		watch: false,
		hydrateExisting: false
	})).snapshot;
}
//#endregion
//#region src/cron/isolated-agent/model-selection.ts
const CRON_THINKING_HYDRATION_WAIT_MS = 5e3;
function formatCronPayloadModelRejection(params) {
	const { modelOverride, error } = params;
	if (error.startsWith("model not allowed:")) {
		const modelRef = error.slice(18).trim();
		const policy = resolveConfiguredModelPolicyAllow(params);
		return `automation model override '${modelOverride}' rejected by ${policy.configPath ?? "agents.defaults.modelPolicy.allow"}: ${modelRef} is not in [${policy.refs.length ? policy.refs.toSorted().join(", ") : "(none configured)"}]`;
	}
	return `automation model override '${modelOverride}' rejected: ${error}`;
}
async function resolveCronModelSelectionOwner(params) {
	const owner = params.publishedRuntime ? Object.freeze({
		...params.publishedRuntime,
		metadataSnapshot: params.publishedRuntime.pluginGeneration.pluginMetadataSnapshot,
		modelCatalog: params.publishedRuntime.readFullModelCatalog?.() ?? params.publishedRuntime.modelCatalog
	}) : await loadResolvedPublishedModelCatalogOwner({
		config: params.cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		readOnly: true,
		allowGatewaySubagentBinding: true
	});
	if (params.requiredAgentId && !publishedModelCatalogOwnerMatchesAgent(owner, params.requiredAgentId)) throw new Error(`cron model catalog owner changed from ${params.requiredAgentId} to ${owner.agentId}`);
	return owner;
}
async function resolveCronThinkingCatalog(params) {
	const catalog = normalizeThinkingCatalogProviders(params.owner.modelCatalog.entries);
	if (!needsThinkHydration(catalog, params.provider, params.model, params.agentRuntime)) return catalog;
	const hydration = loadProviderScopedThinkingCatalog({
		config: params.owner.config,
		provider: params.provider,
		model: params.model,
		agentRuntime: params.agentRuntime,
		agentId: params.owner.agentId,
		agentDir: params.owner.agentDir,
		workspaceDir: params.owner.workspaceDir
	});
	const refreshed = await raceWithTimeout(hydration.then(normalizeThinkingCatalogProviders), CRON_THINKING_HYDRATION_WAIT_MS, () => void 0, { ref: false });
	return refreshed && findModelInCatalog(refreshed, params.provider, params.model) ? refreshed : catalog;
}
async function resolveCronThinkingSelection(params) {
	const immutableThinkLevel = normalizeThinkLevel(params.jobThinking) ?? normalizeThinkLevel(params.hookThinking) ?? normalizeThinkLevel(params.sessionThinking);
	const requestedThinkLevel = immutableThinkLevel ?? resolveConfiguredThinkingDefaultCore({
		cfg: params.cfg,
		agentId: params.owner.agentId,
		provider: params.provider,
		model: params.model
	});
	return {
		catalog: requestedThinkLevel === "off" && params.agentRuntime === "openclaw" ? params.owner.modelCatalog.entries : await resolveCronThinkingCatalog(params),
		immutableThinkLevel,
		loadThinkingCatalog: async (provider, model, agentRuntime) => await resolveCronThinkingCatalog({
			owner: params.owner,
			provider,
			model,
			agentRuntime
		}),
		requestedThinkLevel
	};
}
/** Resolves the effective model for an isolated cron run across defaults, agents, hooks, payload, and session state. */
async function resolveCronModelSelection(params) {
	const owner = params.owner ?? await resolveCronModelSelectionOwner({
		cfg: params.cfg,
		...params.agentId ? {
			agentId: params.agentId,
			requiredAgentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		} : {}
	});
	const ownerAgentId = owner.agentId;
	const ownerAgentConfigOverride = params.agentConfigOverride ? owner.config === params.cfg && (!params.agentId || ownerAgentId === params.agentId) ? params.agentConfigOverride : resolveAgentConfig(owner.config, ownerAgentId) : void 0;
	const { cfgWithAgentDefaults } = resolveCronAgentConfig({
		config: owner.config,
		agentConfigOverride: ownerAgentConfigOverride
	});
	const resolvedDefault = resolveConfiguredModelRef({
		cfg: cfgWithAgentDefaults,
		agentId: ownerAgentId,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		manifestPlugins: owner.metadataSnapshot
	});
	const selectionParams = {
		cfg: owner.config,
		catalog: owner.modelCatalog.entries,
		defaultProvider: resolvedDefault.provider,
		defaultModel: resolvedDefault,
		agentId: ownerAgentId,
		manifestPlugins: owner.metadataSnapshot
	};
	const selection = (ref, modelSource, profileModel) => {
		const configuredProfileId = splitTrailingAuthProfile(profileModel ?? "").profile;
		return {
			ok: true,
			provider: ref.provider,
			model: ref.model,
			modelSource,
			...configuredProfileId ? { configuredProfileId } : {},
			cfgWithAgentDefaults,
			owner
		};
	};
	const override = (raw, source) => {
		if (!raw) return;
		const resolved = resolveAllowedModelRefCore({
			...selectionParams,
			raw
		});
		if (!("error" in resolved)) return selection(resolved.ref, source, source === "session" ? void 0 : raw);
		return source === "payload" ? {
			ok: false,
			error: formatCronPayloadModelRejection({
				cfg: owner.config,
				agentId: ownerAgentId,
				modelOverride: raw,
				error: resolved.error
			})
		} : void 0;
	};
	const modelOverrideRaw = params.payload.kind === "agentTurn" ? params.payload.model : void 0;
	const payloadSelection = override(typeof modelOverrideRaw === "string" ? modelOverrideRaw.trim() : void 0, "payload");
	if (payloadSelection) return payloadSelection;
	const hooksGmailModelRef = params.isGmailHook ? resolveHooksGmailModel({
		cfg: owner.config,
		defaultProvider: DEFAULT_PROVIDER,
		manifestPlugins: owner.metadataSnapshot
	}) : null;
	if (hooksGmailModelRef && getModelRefStatus({
		...selectionParams,
		ref: hooksGmailModelRef
	}).allowed) return selection(hooksGmailModelRef, "hook", owner.config.hooks?.gmail?.model);
	const sessionModelOverride = params.sessionEntry.modelOverride?.trim();
	const sessionSelection = override(sessionModelOverride ? `${params.sessionEntry.providerOverride?.trim() || resolvedDefault.provider}/${sessionModelOverride}` : void 0, "session");
	if (sessionSelection) return sessionSelection;
	const subagentSelection = resolveSubagentModelConfigSelectionResult({
		cfg: owner.config,
		agentId: ownerAgentId,
		agentConfigOverride: ownerAgentConfigOverride
	});
	return override(resolvePrimaryStringValue(subagentSelection?.raw), subagentSelection?.source === "agent" ? "agent" : "subagent") ?? selection(resolvedDefault, "default", resolveAgentModelPrimaryValue(cfgWithAgentDefaults.agents?.defaults?.model));
}
//#endregion
//#region src/cron/isolated-agent/run-command-preflight.ts
/** Rejects deterministic command prompts whose stored cap cannot execute them. */
function resolveCronCommandPromptPreflight(job) {
	if (job.payload.kind !== "agentTurn" || classifyCronAgentTurnShellPrompt({
		...job.payload,
		toolsAllow: resolveCronRunToolsAllow(job)
	}) !== "commandPromptWithoutShellAccess") return;
	const error = `Automation ${job.id} cannot run its requested command because the agent prompt contains a "Command to run:" block but toolsAllow does not grant shell/process access. No command was executed. Recreate it as a command automation with \`openclaw automations add ... --command "<shell>"\`, or explicitly reauthorize this job from a trusted operator shell with \`openclaw automations edit ${job.id} --tools exec,process\`.`;
	return {
		status: "error",
		error,
		diagnostics: createCronRunDiagnosticsFromError("cron-preflight", error)
	};
}
//#endregion
//#region src/cron/isolated-agent/run-current-context.ts
const CURRENT_CONTEXT_RAW_MESSAGES_MAX = 220;
const CURRENT_CONTEXT_READ_MAX_BYTES = 262144;
const CURRENT_CONTEXT_MAX_LINE_CHARS = 220;
const CURRENT_CONTEXT_MAX_BLOCK_CHARS = 1400;
const CURRENT_CONTEXT_HEADER = "Recent conversation:";
function truncateContextLine(role, text) {
	const prefix = `- ${role === "user" ? "User" : "Assistant"}: `;
	const textLimit = CURRENT_CONTEXT_MAX_LINE_CHARS - prefix.length;
	if (text.length <= textLimit) return `${prefix}${text}`;
	return `${prefix}${truncateUtf16Safe(text, textLimit - 3).trimEnd()}...`;
}
function formatCurrentConversationContext(messages) {
	const lines = projectChatDisplayMessages(messages, {
		maxChars: CURRENT_CONTEXT_MAX_LINE_CHARS,
		resolveCronJobName: () => void 0
	}).flatMap((message) => {
		if (!message || typeof message !== "object" || Array.isArray(message)) return [];
		const record = message;
		if (record.role !== "user" && record.role !== "assistant") return [];
		const text = extractTextFromChatContent(record.content);
		return text ? [truncateContextLine(record.role, text)] : [];
	}).slice(-10);
	while (lines.length > 0 && `${CURRENT_CONTEXT_HEADER}\n${lines.join("\n")}`.length > CURRENT_CONTEXT_MAX_BLOCK_CHARS) lines.shift();
	return lines.length > 0 ? `${CURRENT_CONTEXT_HEADER}\n${lines.join("\n")}` : void 0;
}
async function buildCurrentConversationContextBlock(params, deps = {}) {
	const sessionId = params.sourceSessionEntry.sessionId?.trim();
	if (!sessionId) return;
	try {
		const messages = await (deps.readSessionMessages ?? readSessionMessagesAsync)({
			agentId: params.agentId,
			sessionEntry: params.sourceSessionEntry,
			sessionId,
			sessionKey: params.sourceSessionKey,
			storePath: params.storePath
		}, {
			mode: "recent",
			maxBytes: CURRENT_CONTEXT_READ_MAX_BYTES,
			maxLines: CURRENT_CONTEXT_RAW_MESSAGES_MAX,
			maxMessages: CURRENT_CONTEXT_RAW_MESSAGES_MAX
		});
		return formatCurrentConversationContext(Array.isArray(messages) ? messages : []);
	} catch {
		return;
	}
}
//#endregion
//#region src/cron/isolated-agent/run-prepare-runtime.ts
/** Lazy preparation runtimes and session lifecycle helpers for cron runs. */
const sessionAccessorRuntimeLoader = createLazyImportLoader(() => import("./session-accessor-CQc_o2vX.mjs"));
const cronExternalContentRuntimeLoader = createLazyImportLoader(() => import("./run-external-content.runtime.js"));
const cronAuthProfileRuntimeLoader = createLazyImportLoader(() => import("./run-auth-profile.runtime.js"));
async function loadSessionAccessorRuntime() {
	return await sessionAccessorRuntimeLoader.load();
}
async function loadCronExternalContentRuntime() {
	return await cronExternalContentRuntimeLoader.load();
}
function hasConfiguredAuthProfiles(cfg) {
	return Boolean(cfg.auth?.profiles && Object.keys(cfg.auth.profiles).length > 0) || Boolean(cfg.auth?.order && Object.keys(cfg.auth.order).length > 0);
}
/**
* Resolves the run's auth profile, skipping the lazy runtime entirely when no
* override, configured profile, or store source exists for it to find. Auth
* resolution may mutate session state, so it uses the store and key that
* persistence will write.
*/
async function resolveCronAuthSelection(params) {
	if (!Boolean(params.cronSession.sessionEntry.authProfileOverride?.trim()) && !hasConfiguredAuthProfiles(params.cfg) && !hasAnyAuthProfileStoreSource(params.agentDir)) return;
	return await (await cronAuthProfileRuntimeLoader.load()).resolveSessionAuthSelection({
		agentId: params.agentId,
		cfg: params.cfg,
		provider: params.provider,
		modelId: params.modelId,
		...params.configuredProfileId ? { configuredProfileId: params.configuredProfileId } : {},
		harnessRuntime: params.harnessRuntime,
		agentDir: params.agentDir,
		sessionEntry: params.cronSession.sessionEntry,
		sessionStore: params.cronSession.store,
		sessionKey: params.sessionKey,
		storePath: params.cronSession.storePath,
		isNewSession: params.isNewSession
	});
}
async function retireRolledCronSessionMcpRuntime(params) {
	if (params.job.sessionTarget === "isolated") return;
	const previousSessionId = normalizeOptionalString(params.cronSession.previousSessionId);
	const currentSessionId = normalizeOptionalString(params.cronSession.sessionEntry.sessionId);
	if (!previousSessionId || previousSessionId === currentSessionId) return;
	await retireSessionMcpRuntime({
		sessionId: previousSessionId,
		reason: "cron-session-rollover",
		onError: (error, sessionId) => {
			logWarn(`[cron:${params.job.id}] Failed to dispose retired bundle MCP runtime for session ${sessionId}: ${String(error)}`);
		}
	});
}
function appendCronUnattendedRunPreamble(commandBody, opts) {
	return `${commandBody}\n\n${`This is an unattended scheduled run. Nobody is present to clarify or approve, so complete the task with what you have. Your final reply is the deliverable — not a plan, an acknowledgement, or a request for input. If nothing needs doing, reply exactly ${SILENT_REPLY_TOKEN}. If something failed, start with ${AUTOMATION_FAILED_TOKEN} on its own line, then state what failed and what you tried — the scheduler owns retries and failure alerts.`}${opts.externalHook ? "" : " Where the job's own instructions conflict with this preamble, the job's instructions win (a question or plan the job explicitly requests is a valid deliverable). If this job is no longer needed, remove it if your available tools allow."}`;
}
//#endregion
//#region src/cron/isolated-agent/run-timeout.ts
/** Converts cron payload timeout overrides into embedded-runner timeout signals. */
/** Converts explicit cron payload timeoutSeconds into a timer-safe millisecond override signal. */
function resolveCronRunTimeoutOverrideMs(timeoutSeconds) {
	const timeoutMs = Math.floor((timeoutSeconds ?? 0) * 1e3);
	return Number.isFinite(timeoutSeconds) && timeoutMs > 0 ? Math.min(timeoutMs, MAX_TIMER_TIMEOUT_MS) : void 0;
}
//#endregion
//#region src/cron/isolated-agent/run-workspace.ts
/** Keep workspace selection, provisioning, and failed-preparation lease cleanup together. */
async function prepareCronSessionWorkspace(params) {
	const { sessionWorkAdmission, sessionKey } = params;
	const abortSignal = params.input.abortSignal ?? params.input.signal;
	const assertCurrent = () => {
		abortSignal?.throwIfAborted();
		if (!sessionWorkAdmission.isActive()) throw new CronSessionLifecycleClaimError(sessionKey);
	};
	const selected = await resolveCronSessionWorkspace({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionTarget: params.input.job.sessionTarget,
		admissionSource: params.input.admissionSource,
		ownerSessionKey: params.input.job.owner?.sessionKey,
		sessionKey: params.sessionKey,
		entry: params.cronSession.initialSessionEntry,
		defaultWorkspaceDir: params.defaultWorkspaceDir,
		executionRoot: params.input.executionRoot,
		assertCurrent
	});
	try {
		const provisioning = await (await import("./acp-workspace-provisioning-qtxc7Sh8.mjs")).resolveAcpAgentWorkspaceProvisioningForTurn({
			cfg: params.cfg,
			agentId: params.agentId,
			workspaceDir: params.defaultWorkspaceDir,
			cwd: selected.cwd,
			sessionKey: params.sessionKey,
			sessionEntry: params.cronSession.sessionEntry
		});
		assertCurrent();
		await ensureAgentWorkspace({
			dir: params.defaultWorkspaceDir,
			ensureBootstrapFiles: !params.agentCfg.skipBootstrap && !params.isFastTestEnv,
			skipOptionalBootstrapFiles: params.agentCfg.skipOptionalBootstrapFiles,
			provisioning,
			guard: { assertHost: assertCurrent }
		});
		assertCurrent();
		return selected;
	} catch (error) {
		await selected.lease?.release();
		throw error;
	}
}
/** Resolve only persisted session bindings; the job prompt never supplies filesystem authority. */
async function resolveCronSessionWorkspace(params) {
	const target = resolveCronSessionTargetSessionKey(params.sessionTarget);
	if (!target) return { workspaceDir: params.defaultWorkspaceDir };
	if (resolveCronAgentSessionKey({
		sessionKey: target,
		agentId: params.agentId,
		cfg: params.cfg,
		mainKey: params.cfg.session?.mainKey
	}) !== params.sessionKey) throw new CronSessionLifecycleClaimError(params.sessionKey, "Bound automation session is mismatched.");
	const entry = params.entry;
	if (!entry) return { workspaceDir: params.defaultWorkspaceDir };
	const override = resolveIngressWorkspaceOverrideForSessionRun({
		spawnedBy: entry.spawnedBy,
		workspaceDir: entry.spawnedWorkspaceDir,
		cwd: entry.spawnedCwd
	});
	const requestedCwd = normalizeOptionalString(entry.spawnedCwd);
	if (params.admissionSource === "requester-schedule" && (override || requestedCwd || entry.worktree)) {
		const ownerSessionKey = normalizeOptionalString(params.ownerSessionKey);
		if (!ownerSessionKey || resolveCronAgentSessionKey({
			sessionKey: ownerSessionKey,
			agentId: params.agentId,
			cfg: params.cfg,
			mainKey: params.cfg.session?.mainKey
		}) !== params.sessionKey) throw new CronSessionLifecycleClaimError(params.sessionKey, "Requester-scoped automation can only use its owning conversation’s workspace.");
	}
	const workspaceDir = override ? await fs.realpath(resolveUserPath(override)) : params.defaultWorkspaceDir;
	const cwd = requestedCwd ? await fs.realpath(resolveUserPath(requestedCwd)) : void 0;
	params.assertCurrent();
	if (params.executionRoot && (override || requestedCwd || entry.worktree) && path.resolve(params.executionRoot) !== path.resolve(workspaceDir)) throw new CronSessionLifecycleClaimError(params.sessionKey, "Bound automation workspace conflicts with its execution root.");
	const binding = entry.worktree;
	if (!binding) return {
		workspaceDir,
		cwd
	};
	const { captureOpenClawStateWorkerContext } = await import("./openclaw-state-worker-context-Cbmnm5EG.mjs");
	const { readRegistryWorktree } = await import("./registry-read-C_xLl4VE.mjs");
	const { acquireWorktreeRunLease } = await import("./run-lease-BJnX9vWC.mjs");
	params.assertCurrent();
	const state = captureOpenClawStateWorkerContext();
	const validateWorktree = async () => {
		const record = await readRegistryWorktree(state, binding.id);
		params.assertCurrent();
		if (!record || record.id !== binding.id || record.ownerKind !== "session" || record.ownerId !== params.sessionKey || record.removedAt !== void 0 || record.branch !== binding.branch || path.resolve(record.repoRoot) !== path.resolve(binding.repoRoot)) throw new CronSessionLifecycleClaimError(params.sessionKey, "Bound automation worktree is missing, retired, or mismatched.");
		const root = await fs.realpath(record.path);
		params.assertCurrent();
		if (!isPathInside(root, workspaceDir) || !isPathInside(root, cwd ?? workspaceDir)) throw new CronSessionLifecycleClaimError(params.sessionKey, "Bound automation workspace does not match its managed worktree.");
	};
	await validateWorktree();
	const lease = await acquireWorktreeRunLease(binding.id);
	try {
		await validateWorktree();
		return {
			workspaceDir,
			cwd,
			lease
		};
	} catch (error) {
		await lease.release();
		throw error;
	}
}
//#endregion
//#region src/cron/isolated-agent/run-prepare.ts
/** Session identity and context preparation for isolated cron runs. */
async function prepareCronRunContext(params) {
	try {
		var _usingCtx$2 = _usingCtx();
		const { input } = params;
		const commandPromptPreflight = resolveCronCommandPromptPreflight(input.job);
		if (commandPromptPreflight) return {
			ok: false,
			result: commandPromptPreflight
		};
		const requestedRuntimeCfg = resolveCronActiveRuntimeConfig(input.cfg);
		const requestedAgentId = input.agentId?.trim() || input.job.agentId?.trim();
		const requiredAgentId = (requestedAgentId ? normalizeAgentId(requestedAgentId) : void 0) ?? parseAgentSessionKey(input.job.sessionKey ?? input.sessionKey)?.agentId;
		const initialAgentId = resolveCronJobEffectiveAgentId({ agentId: requiredAgentId }, tryResolveAmbientOwnerAgentId(requestedRuntimeCfg));
		const runtimeResources = _usingCtx$2.a(new AsyncDisposableStack());
		let runtimeLease;
		const publishedRuntime = await loadPublishedGatewayReplyDispatchRuntime({
			agentId: initialAgentId,
			onRuntimeLease: (lease) => {
				runtimeLease = runtimeResources.use(scopePreparedModelRuntimeLease(lease));
			},
			abortSignal: input.abortSignal ?? input.signal
		});
		const modelOwner = await resolveCronModelSelectionOwner({
			cfg: requestedRuntimeCfg,
			publishedRuntime,
			...requiredAgentId ? {
				agentId: initialAgentId,
				requiredAgentId,
				agentDir: resolveAgentDir(requestedRuntimeCfg, initialAgentId),
				workspaceDir: resolveAgentWorkspaceDir(requestedRuntimeCfg, initialAgentId)
			} : {}
		});
		const { agentId, agentDir } = modelOwner;
		const agentConfigOverride = requiredAgentId ? resolveAgentConfig(modelOwner.config, agentId) : void 0;
		const { runtimeConfig: runtimeCfg, agentDefaults: agentCfg } = resolveCronAgentConfig({
			config: modelOwner.config,
			agentConfigOverride
		});
		const baseSessionKey = (input.sessionKey?.trim() || `cron:${input.job.id}`).trim();
		const currentBoundSourceKey = input.job.sessionTarget === "current" ? input.job.sessionKey?.trim() : void 0;
		const usesDetachedRunSession = isDetachedCronSessionTarget(input.job.sessionTarget) || Boolean(currentBoundSourceKey);
		const baseSessionKeyIsCron = baseSessionKey.startsWith("cron:") || isCronSessionKey(baseSessionKey);
		const cronExecutionSessionKey = usesDetachedRunSession && !baseSessionKeyIsCron ? `cron:${input.job.id}` : baseSessionKey;
		const agentSessionKey = resolveCronAgentSessionKey({
			sessionKey: cronExecutionSessionKey,
			agentId,
			mainKey: runtimeCfg.session?.mainKey,
			cfg: runtimeCfg
		});
		const resolvedBaseSessionKey = resolveCronAgentSessionKey({
			sessionKey: currentBoundSourceKey ?? baseSessionKey,
			agentId,
			mainKey: runtimeCfg.session?.mainKey,
			cfg: runtimeCfg
		});
		const sourceSessionKey = currentBoundSourceKey && resolvedBaseSessionKey !== agentSessionKey ? resolvedBaseSessionKey : void 0;
		const hookExternalContentSource = (input.job.payload.kind === "agentTurn" ? input.job.payload.externalContentSource : void 0) ?? resolveHookExternalContentSource(baseSessionKey);
		const isGmailHook = hookExternalContentSource === "gmail";
		return runtimeLease ? await runtimeLease.run(prepareAdmittedSession) : await prepareAdmittedSession();
		async function prepareAdmittedSession() {
			const now = Date.now();
			const sandbox = resolveCreatorSandbox(runtimeCfg, { actor: input.job.createdActor });
			const cronSession = await prepareCronSession({
				cfg: runtimeCfg,
				sessionKey: agentSessionKey,
				sourceSessionKey,
				skillLibrarySelections: input.job.skillLibrarySelections,
				agentId,
				nowMs: now,
				forceNew: usesDetachedRunSession,
				hookExternalContentSource
			});
			const sourceEntry = sourceSessionKey ? cronSession.store[sourceSessionKey] : void 0;
			const sourceSessionGeneration = sourceEntry ? {
				sessionId: sourceEntry.sessionId,
				lifecycleRevision: sourceEntry.lifecycleRevision
			} : void 0;
			const reservedKey = isAgentHarnessSessionKey(agentSessionKey);
			if (cronSession.initialSessionEntry?.modelSelectionLocked === true) throw new Error(reservedKey ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE : AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE);
			if (reservedKey && !cronSession.initialSessionEntry) throw new Error(AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE);
			const runSessionId = cronSession.sessionEntry.sessionId;
			const currentRunSessionId = () => cronSession.sessionEntry.sessionId ?? runSessionId;
			const usesExactRunSession = usesDetachedRunSession || baseSessionKey.startsWith("cron:");
			const runSessionKey = usesExactRunSession ? `${agentSessionKey}:run:${runSessionId}` : agentSessionKey;
			const sessionWorkAdmission = await beginCronSessionWorkAdmission({
				cronSession,
				agentSessionKey,
				runSessionKey,
				signal: input.abortSignal ?? input.signal,
				onInterrupt: params.onLifecycleInterrupt
			});
			clearBootstrapSnapshotOnSessionRollover({
				sessionKey: agentSessionKey,
				previousSessionId: cronSession.previousSessionId
			});
			let preparedModelRuntimeLease;
			let workspaceLease;
			let workspaceLeaseTransferred = false;
			try {
				const selectedWorkspace = await prepareCronSessionWorkspace({
					cfg: runtimeCfg,
					agentId,
					input,
					agentCfg,
					sessionKey: agentSessionKey,
					cronSession,
					defaultWorkspaceDir: modelOwner.workspaceDir,
					sessionWorkAdmission,
					isFastTestEnv: params.isFastTestEnv
				});
				workspaceLease = selectedWorkspace.lease;
				const workspaceDir = selectedWorkspace.workspaceDir;
				const executionWorkspaceDir = input.executionRoot ?? workspaceDir;
				const persistCronSessionRow = async ({ storePath, sessionKey, fallbackEntry, resetBoundary, update, assertCommitAllowed }) => {
					const { applySessionEntryLifecycleMutation, patchSessionEntryCore } = await loadSessionAccessorRuntime();
					if (resetBoundary) {
						await applySessionEntryLifecycleMutation({
							activeSessionKey: sessionKey,
							agentId,
							storePath,
							upserts: [{
								sessionKey,
								resetBoundary,
								buildEntry: ({ currentEntry }) => update(currentEntry)
							}],
							skipMaintenance: true
						});
						return;
					}
					await patchSessionEntryCore({
						storePath,
						sessionKey,
						agentId
					}, (_entry, context) => update(context.existingEntry), {
						fallbackEntry,
						replaceEntry: true,
						assertCommitAllowed
					});
				};
				const persistSessionEntry = createPersistCronSessionEntry({
					cronSession,
					agentSessionKey,
					createdActor: input.job.createdActor,
					sandbox,
					workspaceDir,
					persistSessionEntry: persistCronSessionRow
				});
				const withRunSession = (result) => ({
					...result,
					sessionId: currentRunSessionId(),
					sessionKey: runSessionKey
				});
				if (!cronSession.sessionEntry.label?.trim() && baseSessionKey.startsWith("cron:")) {
					const labelSuffix = typeof input.job.name === "string" && input.job.name.trim() ? input.job.name.trim() : input.job.id;
					cronSession.sessionEntry.label = `Automation: ${labelSuffix}`;
				}
				const resolvedModelSelection = await resolveCronModelSelection({
					cfg: runtimeCfg,
					owner: modelOwner,
					agentConfigOverride,
					sessionEntry: cronSession.sessionEntry,
					payload: input.job.payload,
					isGmailHook,
					agentId,
					agentDir,
					workspaceDir: executionWorkspaceDir
				});
				if (!resolvedModelSelection.ok) {
					sessionWorkAdmission.release();
					return {
						ok: false,
						result: withRunSession({
							status: "error",
							error: resolvedModelSelection.error,
							diagnostics: createCronRunDiagnosticsFromError("cron-preflight", resolvedModelSelection.error)
						})
					};
				}
				const cfgWithAgentDefaults = resolvedModelSelection.cfgWithAgentDefaults;
				const ownerAgentConfig = resolveAgentConfig(modelOwner.config, modelOwner.agentId);
				const matchesDefaultFallbackAgentStringModel = typeof ownerAgentConfig?.model === "string" && resolveAgentModelPrimaryValue(ownerAgentConfig.model) === resolveAgentModelPrimaryValue(modelOwner.config.agents?.defaults?.model);
				const useSubagentFallbacks = resolvedModelSelection.modelSource === "subagent";
				const inheritDefaultFallbacksForAgentStringModel = matchesDefaultFallbackAgentStringModel && (resolvedModelSelection.modelSource === "default" || resolvedModelSelection.modelSource === "agent");
				const preflight = await resolveCronPreflight({
					cfg: cfgWithAgentDefaults,
					job: input.job,
					agentId: modelOwner.agentId,
					provider: resolvedModelSelection.provider,
					model: resolvedModelSelection.model,
					useSubagentFallbacks,
					inheritDefaultFallbacksForAgentStringModel
				});
				if (!preflight.ok) {
					logWarn(`[cron:${input.job.id}] ${preflight.reason}`);
					sessionWorkAdmission.release();
					return {
						ok: false,
						result: withRunSession({
							status: "skipped",
							error: preflight.reason,
							diagnostics: createCronRunDiagnosticsFromError("model-preflight", preflight.reason, { severity: "warn" }),
							provider: resolvedModelSelection.provider,
							model: resolvedModelSelection.model
						})
					};
				}
				const { provider, model, modelFallbacksOverride, runtimePluginCandidates } = preflight;
				const effectiveAgentRuntime = resolveEffectiveAgentRuntime({
					cfg: cfgWithAgentDefaults,
					provider,
					modelId: model,
					agentId: modelOwner.agentId,
					sessionKey: agentSessionKey,
					sessionEntry: cronSession.sessionEntry
				});
				const thinkingSelection = await resolveCronThinkingSelection({
					cfg: cfgWithAgentDefaults,
					owner: modelOwner,
					provider,
					model,
					agentRuntime: effectiveAgentRuntime,
					jobThinking: input.job.payload.kind === "agentTurn" ? input.job.payload.thinking : void 0,
					hookThinking: isGmailHook ? runtimeCfg.hooks?.gmail?.thinking : void 0,
					sessionThinking: cronSession.sessionEntry.thinkingLevel
				});
				const { requestedLevel: requestedThinkLevel, level: fallbackThinkLevel, supported: thinkingLevelSupported } = resolveThinkingSelectionCore({
					cfg: cfgWithAgentDefaults,
					agentId: modelOwner.agentId,
					provider,
					model,
					level: thinkingSelection.requestedThinkLevel,
					catalog: thinkingSelection.catalog,
					agentRuntime: effectiveAgentRuntime
				});
				if (!thinkingLevelSupported && fallbackThinkLevel !== requestedThinkLevel) logWarn(`[cron:${input.job.id}] Thinking level "${requestedThinkLevel}" is not supported for ${provider}/${model}; using "${fallbackThinkLevel}" for this candidate.`);
				preparedModelRuntimeLease = await acquireAgentRunPreparedModelRuntime({
					config: modelOwner.config,
					agentId,
					agentDir,
					workspaceDir,
					allowGatewaySubagentBinding: true,
					runtimePluginSelections: runtimePluginCandidates.map((candidate) => {
						const runtime = resolveSessionRuntimeOverrideForProvider({
							provider: candidate.provider,
							entry: cronSession.sessionEntry,
							cfg: cfgWithAgentDefaults
						});
						return runtime ? {
							provider: candidate.provider,
							modelId: candidate.model,
							runtime,
							agentId
						} : {
							provider: candidate.provider,
							modelId: candidate.model,
							agentId
						};
					})
				}, {
					catalogMode: "static",
					...publishedRuntime ? { pluginGeneration: publishedRuntime.pluginGeneration } : { pluginMetadataSnapshot: modelOwner.metadataSnapshot },
					abortSignal: input.abortSignal ?? input.signal
				});
				const admittedConfig = preparedModelRuntimeLease.snapshot.config;
				const explicitTimeoutSeconds = input.job.payload.kind === "agentTurn" ? input.job.payload.timeoutSeconds : void 0;
				const timeoutMs = resolveAgentTimeoutMs({
					cfg: cfgWithAgentDefaults,
					overrideSeconds: explicitTimeoutSeconds
				});
				const runTimeoutOverrideMs = resolveCronRunTimeoutOverrideMs(explicitTimeoutSeconds);
				const agentPayload = input.job.payload.kind === "agentTurn" ? {
					...input.job.payload,
					toolsAllow: resolveCronRunToolsAllow(input.job)
				} : null;
				const configuredProvider = admittedConfig.models?.providers?.[provider];
				const modelApi = findModelInCatalog(thinkingSelection.catalog, provider, model)?.api ?? configuredProvider?.models?.find((candidate) => candidate.id === model)?.api ?? configuredProvider?.api;
				const preflightDiagnostics = await createCronToolsAllowPreflightDiagnostics({
					cfg: admittedConfig,
					jobId: input.job.id,
					provider,
					model,
					modelApi,
					agentId: modelOwner.agentId,
					agentDir: modelOwner.agentDir,
					sessionKey: agentSessionKey,
					agentPayload
				});
				const { deliveryPlan, deliveryRequested, resolvedDelivery, sourceDelivery, deliverySystemPrompt, messageToolFormatPrompt } = await resolveCronDeliveryContext({
					cfg: admittedConfig,
					job: input.job,
					agentId
				});
				const { formattedTime, timeLine } = resolveCronStyleNow(runtimeCfg, now);
				const currentConversationContext = input.job.sessionTarget === "current" && agentPayload && sourceSessionKey && sourceEntry ? await buildCurrentConversationContextBlock({
					agentId,
					sourceSessionEntry: sourceEntry,
					sourceSessionKey,
					storePath: cronSession.storePath
				}) : void 0;
				const turnMessage = input.job.payload.kind === "agentTurn" ? input.job.payload.message : input.message;
				const message = currentConversationContext ? `${currentConversationContext}\n\n${turnMessage}` : turnMessage;
				const sourcePromptPrefix = `[cron:${input.job.id} ${input.job.name}]`;
				const base = `${sourcePromptPrefix} ${message}`.trim();
				const isExternalHook = hookExternalContentSource !== void 0 || isExternalHookSession(baseSessionKey);
				const allowUnsafeExternalContent = agentPayload?.allowUnsafeExternalContent === true || isGmailHook && input.cfg.hooks?.gmail?.allowUnsafeExternalContent === true;
				const shouldWrapExternal = isExternalHook && !allowUnsafeExternalContent;
				let commandBody;
				if (isExternalHook) {
					const { detectSuspiciousPatterns } = await loadCronExternalContentRuntime();
					const suspiciousPatterns = detectSuspiciousPatterns(message);
					if (suspiciousPatterns.length > 0) logWarn(`[security] Suspicious patterns detected in external hook content (session=${baseSessionKey}, patterns=${suspiciousPatterns.length}): ${suspiciousPatterns.slice(0, 3).join(", ")}`);
				}
				if (shouldWrapExternal) {
					const { buildSafeExternalPrompt } = await loadCronExternalContentRuntime();
					commandBody = `${buildSafeExternalPrompt({
						content: message,
						source: mapHookExternalContentSource(hookExternalContentSource ?? "webhook"),
						jobName: input.job.name,
						jobId: input.job.id,
						timestamp: formattedTime
					})}\n\n${timeLine}`.trim();
				} else commandBody = `${base}\n${timeLine}`.trim();
				commandBody = appendCronUnattendedRunPreamble(commandBody, { externalHook: isExternalHook });
				const skillsSnapshot = input.skillsSnapshot ?? await resolveCronSkillsSnapshot({
					workspaceDir: executionWorkspaceDir,
					config: admittedConfig,
					agentId,
					existingSnapshot: cronSession.sessionEntry.skillsSnapshot,
					librarySelections: cronSession.sessionEntry.skillLibrarySelections,
					isFastTestEnv: params.isFastTestEnv
				});
				await persistCronSkillsSnapshotIfChanged({
					isFastTestEnv: params.isFastTestEnv,
					cronSession,
					skillsSnapshot,
					nowMs: Date.now(),
					persistSessionEntry
				});
				setCronSessionRuntimeModel({
					entry: cronSession.sessionEntry,
					provider,
					model
				});
				cronSession.sessionEntry.systemSent = true;
				try {
					await persistSessionEntry();
				} catch (err) {
					if (err instanceof CronSessionLifecycleClaimError) throw err;
					logWarn(`[cron:${input.job.id}] Failed to persist pre-run session entry: ${String(err)}`);
					if (sandbox === "required" || cronSession.sessionEntry.sandbox === "required") throw err;
				}
				await retireRolledCronSessionMcpRuntime({
					job: input.job,
					cronSession
				});
				const authSelection = await resolveCronAuthSelection({
					agentId,
					cfg: admittedConfig,
					provider,
					modelId: model,
					...provider === resolvedModelSelection.provider && resolvedModelSelection.configuredProfileId ? { configuredProfileId: resolvedModelSelection.configuredProfileId } : {},
					harnessRuntime: effectiveAgentRuntime,
					agentDir,
					cronSession,
					sessionKey: agentSessionKey,
					isNewSession: cronSession.isNewSession && input.job.sessionTarget !== "isolated"
				});
				const authProfileId = authSelection?.profileId;
				const liveSelection = {
					provider,
					model,
					agentRuntimeOverride: resolveSessionRuntimeOverrideForProvider({
						provider,
						entry: cronSession.sessionEntry,
						cfg: admittedConfig
					}),
					authProfileId,
					authProfileIdSource: authSelection?.source
				};
				const runContinuationSession = usesExactRunSession ? createCronRunContinuationSession({
					cronSession,
					runSessionKey,
					createdActor: input.job.createdActor,
					sandbox,
					thinkingLevel: requestedThinkLevel,
					toolsAllow: agentPayload?.toolsAllow,
					toolsAllowIsDefault: agentPayload?.toolsAllowIsDefault,
					scheduledToolPolicy: resolveCronScheduledToolPolicy({
						toolsAllow: agentPayload?.toolsAllow,
						scheduledToolPolicy: input.job.scheduledToolPolicy,
						owner: input.job.owner
					}),
					scheduledToolCallerOrigin: input.job.toolsAllowProvenance?.callerOrigin,
					toolsAllowExecTarget: input.job.toolsAllowExecTarget,
					toolsAllowExecTargetRequirement: input.job.toolsAllowExecTargetRequirement,
					cliSessionBindingFacts: {
						extraSystemPromptStatic: deliverySystemPrompt,
						sourceReplyDeliveryMode: sourceDelivery.sourceReplyDeliveryMode,
						requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget
					},
					persistSessionEntry: persistCronSessionRow
				}) : void 0;
				await runContinuationSession?.initialize();
				workspaceLeaseTransferred = true;
				return {
					ok: true,
					context: {
						input,
						cfgWithAgentDefaults: admittedConfig,
						agentId,
						agentCfg,
						agentDir,
						agentSessionKey,
						sourceSessionKey,
						sourceSessionGeneration,
						runSessionId,
						currentRunSessionId,
						runSessionKey,
						usesDetachedRunSession,
						workspaceDir,
						cwd: selectedWorkspace.cwd,
						workspaceLease,
						executionRoot: input.executionRoot,
						commandBody,
						inputProvenance: agentPayload && !isExternalHook ? {
							kind: "internal_system",
							sourceTool: "cron",
							sourcePromptPrefix,
							jobId: input.job.id,
							runId: runSessionId,
							sourceSessionKey: runSessionKey
						} : void 0,
						cronSession,
						sessionWorkAdmission,
						persistSessionEntry,
						runContinuationSession,
						withRunSession,
						agentPayload,
						deliveryPlan,
						resolvedDelivery,
						deliveryRequested,
						deliverySystemPrompt,
						messageToolFormatPrompt,
						sourceDelivery,
						suppressExecNotifyOnExit: deliveryPlan.mode === "none",
						skillsSnapshot,
						liveSelection,
						useSubagentFallbacks,
						inheritDefaultFallbacksForAgentStringModel,
						modelFallbacksOverride,
						thinkingSelection,
						timeoutMs,
						preflightDiagnostics,
						runTimeoutOverrideMs,
						preparedModelRuntimeLease
					}
				};
			} catch (error) {
				try {
					try {
						var _usingCtx3 = _usingCtx();
						_usingCtx3.a(preparedModelRuntimeLease);
						throw error;
					} catch (_) {
						_usingCtx3.e = _;
					} finally {
						await _usingCtx3.d();
					}
				} finally {
					sessionWorkAdmission.release();
				}
			} finally {
				if (!workspaceLeaseTransferred) await workspaceLease?.release();
			}
		}
	} catch (_) {
		_usingCtx$2.e = _;
	} finally {
		await _usingCtx$2.d();
	}
}
//#endregion
//#region src/cron/isolated-agent/run.ts
const cronExecutorRuntimeLoader = createLazyImportLoader(() => import("./run-executor.runtime.js"));
async function disposeCronRunContext(params) {
	releaseAgentRunContext(params.runId, params.runContextOwnerToken);
	if (params.ownsSessionRuntime) await retireSessionMcpRuntime({
		sessionId: params.sessionId,
		reason: "isolated-cron-dispose",
		onError: (error, sid) => {
			logWarn(`[cron] Failed to retire MCP runtime during isolated cron dispose ${sid}: ${String(error)}`);
		}
	}).catch(() => {});
	params.cronSession.store = {};
}
/** Runs one isolated cron agent turn, including setup, execution, delivery, and persistence. */
async function runCronIsolatedAgentTurn(params) {
	return await runWithDiagnosticTraceContext(createDiagnosticTraceContextFromActiveScope(), () => runCronIsolatedAgentTurnInTrace(params));
}
async function runCronIsolatedAgentTurnInTrace(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const admittedLifecycleGeneration = getAgentEventLifecycleGeneration();
		const upstreamAbortSignal = params.abortSignal ?? params.signal;
		const lifecycleAbortController = new AbortController();
		const abortSignal = upstreamAbortSignal ? AbortSignal.any([upstreamAbortSignal, lifecycleAbortController.signal]) : lifecycleAbortController.signal;
		const isAborted = () => abortSignal?.aborted ?? false;
		const abortReason = () => resolveCronAbortReasonText(abortSignal?.reason) ?? "cron: job execution timed out";
		const isFastTestEnv = isFastTestRuntimeEnv();
		let prepared;
		try {
			prepared = await prepareCronRunContext({
				input: {
					...params,
					abortSignal
				},
				isFastTestEnv,
				onLifecycleInterrupt: () => lifecycleAbortController.abort(createAgentRunRestartAbortError())
			});
		} catch (err) {
			if (err instanceof CronExecutionRootRuntimeError) return {
				status: "error",
				error: err.message,
				admissionDisposition: "rejected"
			};
			if (err instanceof CronSessionLifecycleClaimError) return {
				status: "error",
				error: err.message,
				admissionDisposition: err.admissionDisposition
			};
			throw err;
		}
		if (!prepared.ok) return {
			...prepared.result,
			admissionDisposition: "rejected"
		};
		_usingCtx$1.a({ [Symbol.asyncDispose]: async () => {
			await prepared.context.workspaceLease?.release();
		} });
		const preparedRuntimeLease = _usingCtx$1.a(prepared.context.preparedModelRuntimeLease);
		let leaseActive = true;
		try {
			return await withPreparedModelRuntimePluginGenerationScope(preparedRuntimeLease.pluginGeneration, () => withPluginRuntimeGenerationScope(preparedRuntimeLease.snapshot, async () => {
				const runId = randomUUID();
				const initialSessionId = prepared.context.cronSession.sessionEntry.sessionId;
				const ownsSessionRuntime = params.job.sessionTarget === "isolated";
				let runContextOwnerToken;
				let runLifecycleGeneration = admittedLifecycleGeneration;
				let executionStarted = false;
				const notifyExecutionStarted = (info) => {
					executionStarted = true;
					if (info?.lifecycleGeneration) runLifecycleGeneration = info.lifecycleGeneration;
					params.onExecutionStarted?.({
						jobId: params.job.id,
						agentId: prepared.context.agentId,
						sessionId: prepared.context.currentRunSessionId(),
						sessionKey: prepared.context.runSessionKey,
						runId,
						...info?.isFallback === true ? { isFallback: true } : {},
						phase: "runner_entered",
						provider: info?.provider ?? prepared.context.liveSelection.provider,
						model: info?.model ?? prepared.context.liveSelection.model
					});
				};
				const notifyExecutionPhase = (info) => {
					params.onExecutionPhase?.({
						jobId: params.job.id,
						agentId: prepared.context.agentId,
						sessionId: prepared.context.currentRunSessionId(),
						sessionKey: prepared.context.runSessionKey,
						provider: prepared.context.liveSelection.provider,
						model: prepared.context.liveSelection.model,
						...info
					});
				};
				const turnStartedAtMs = Date.now();
				const diagnosticsEnabled = isDiagnosticsEnabled(params.cfg);
				const messageLifecycle = (() => {
					try {
						const lifecycle = createDiagnosticMessageLifecycle({
							enabled: diagnosticsEnabled,
							sessionId: prepared.context.runSessionId,
							sessionKey: prepared.context.runSessionKey,
							agentId: prepared.context.agentId,
							channel: "cron",
							source: "cron-isolated",
							startedAtMs: turnStartedAtMs,
							trackSessionState: true
						});
						lifecycle.markProcessing();
						if (diagnosticsEnabled) logMessageDispatchStarted({
							sessionId: prepared.context.runSessionId,
							sessionKey: prepared.context.runSessionKey,
							channel: "cron",
							source: "cron-isolated"
						});
						return lifecycle;
					} catch (error) {
						prepared.context.sessionWorkAdmission.release();
						throw error;
					}
				})();
				let outcome = "completed";
				let outcomeError;
				let cronRunSessionCleanupHandled = false;
				let completedPromptRuns = [];
				let usage;
				let usageSettlement;
				const settleUsage = async (contextTokens) => {
					usageSettlement ??= (async () => {
						usage = applyCronRunUsage(prepared.context, completedPromptRuns);
						await recordCronRunUsage({
							prepared: prepared.context,
							runs: completedPromptRuns,
							contextTokens
						});
						await prepared.context.persistSessionEntry();
						await prepared.context.runContinuationSession?.seal({ basePersisted: true });
					})();
					await usageSettlement;
					return usage;
				};
				const lifecycle = createAgentLifecycleTerminalBackstop({
					runId,
					sessionKey: prepared.context.runSessionKey,
					startedAt: turnStartedAtMs,
					getLifecycleGeneration: () => runLifecycleGeneration,
					resolveTerminationFields: (error) => resolveAgentRunErrorLifecycleFields(error, abortSignal)
				});
				try {
					assertAgentRunLifecycleGenerationCurrent(runLifecycleGeneration);
					runContextOwnerToken = claimAgentRunContext(runId, {
						sessionKey: prepared.context.runSessionKey,
						sessionId: initialSessionId,
						agentId: prepared.context.agentId,
						lifecycleGeneration: runLifecycleGeneration,
						cronRunsByJobId: /* @__PURE__ */ new Map([[params.job.id, { pacingEnabled: params.job.pacing !== void 0 }]])
					}, {
						trackOwner: true,
						ownsContext: true
					});
					const { executeCronRun } = await cronExecutorRuntimeLoader.load();
					const executionParams = {
						...prepared.context,
						runId,
						cfg: params.cfg,
						job: params.job,
						deliveryAttemptFence: params.deliveryAttemptFence,
						lane: params.lane,
						agentVerboseDefault: prepared.context.agentCfg?.verboseDefault,
						persistRunContinuationSession: prepared.context.runContinuationSession?.sync,
						setRunContinuationCliExecutionProvider: prepared.context.runContinuationSession?.setCliExecutionProvider,
						abortSignal,
						lifecycle,
						onExecutionStarted: notifyExecutionStarted,
						onExecutionPhase: notifyExecutionPhase,
						onLaneWait: params.onLaneWait,
						onPromptCompleted: (runs) => {
							completedPromptRuns = runs;
						},
						abortReason,
						isAborted,
						immutableThinkLevel: prepared.context.thinkingSelection.immutableThinkLevel,
						thinkingCatalog: prepared.context.thinkingSelection.catalog,
						loadThinkingCatalog: prepared.context.thinkingSelection.loadThinkingCatalog,
						executionIdentity: params.executionIdentity,
						admissionSource: params.admissionSource
					};
					const execution = await prepared.context.sessionWorkAdmission.run(() => withAgentRunLifecycleGeneration(runLifecycleGeneration, () => executeCronRun(executionParams)));
					lifecycle.emit("end", execution.runResult);
					const finalized = await finalizeCronRun({
						prepared: prepared.context,
						execution,
						abortReason,
						isAborted,
						settleUsage,
						markCronRunSessionCleanupHandled: () => {
							cronRunSessionCleanupHandled = true;
						},
						beforeSessionDelete: prepared.context.sessionWorkAdmission.release
					});
					if (finalized.status === "error") {
						outcome = "error";
						outcomeError = finalized.error;
					}
					const delayMs = consumeCronNextCheckProposal(runId, params.job.id);
					return finalized.status !== "ok" || delayMs === void 0 ? finalized : {
						...finalized,
						nextCheck: { delayMs }
					};
				} catch (err) {
					lifecycle.emit("error", err);
					consumeCronNextCheckProposal(runId, params.job.id);
					const isCronLaneTimeout = isAborted() || isCommandLaneTaskTimeoutError(err, "cron-nested");
					const error = isCronLaneTimeout ? abortReason() : normalizeCronRunErrorText(err);
					const errorReason = resolveCronRunErrorReason(isCronLaneTimeout ? error : err, prepared.context.liveSelection.provider);
					outcome = "error";
					outcomeError = error;
					const admissionDisposition = err instanceof CronSessionLifecycleClaimError ? err.admissionDisposition : err instanceof CronExecutionRootRuntimeError || !executionStarted ? "rejected" : void 0;
					if (completedPromptRuns.length > 0) try {
						await settleUsage();
					} catch (usageError) {
						if (usageError !== err) logWarn(`[cron:${params.job.id}] Failed to settle completed prompt usage: ${String(usageError)}`);
					}
					return prepared.context.withRunSession({
						status: "error",
						error,
						errorClassification: errorReason ? {
							kind: "reason",
							reason: errorReason
						} : void 0,
						executionStarted,
						usage,
						...admissionDisposition ? { admissionDisposition } : {},
						provider: prepared.context.liveSelection.provider,
						model: prepared.context.liveSelection.model,
						diagnostics: mergeCronRunDiagnostics(prepared.context.preflightDiagnostics, createCronRunDiagnosticsFromError(isCronLaneTimeout ? "cron-setup" : "agent-run", isCronLaneTimeout ? error : err))
					});
				} finally {
					try {
						await prepared.context.runContinuationSession?.seal();
					} catch (sealError) {
						logWarn(`[cron:${params.job.id}] Failed to seal run continuation during cleanup: ${String(sealError)}`);
					}
					const finalSessionRef = {
						sessionId: prepared.context.currentRunSessionId(),
						sessionKey: prepared.context.runSessionKey
					};
					try {
						if (diagnosticsEnabled) logMessageDispatchCompleted({
							...finalSessionRef,
							channel: "cron",
							source: "cron-isolated",
							durationMs: Date.now() - turnStartedAtMs,
							outcome,
							error: outcomeError
						});
						messageLifecycle.markIdle(void 0, finalSessionRef);
						messageLifecycle.markProcessed(outcome, {
							...finalSessionRef,
							error: outcomeError
						});
					} finally {
						try {
							if (!cronRunSessionCleanupHandled) await cleanupCronRunSessionAfterRun({
								job: params.job,
								agentSessionKey: prepared.context.agentSessionKey,
								sessionId: prepared.context.currentRunSessionId(),
								lifecycleRevision: prepared.context.cronSession.lifecycleRevision,
								sessionUpdatedAt: prepared.context.cronSession.sessionEntry.updatedAt,
								beforeDelete: prepared.context.sessionWorkAdmission.release,
								reason: "cron-delete-after-run-finally"
							});
						} finally {
							try {
								try {
									await disposeCronRunContext({
										runId,
										sessionId: initialSessionId,
										cronSession: prepared.context.cronSession,
										ownsSessionRuntime,
										runContextOwnerToken
									});
								} finally {
									prepared.context.sessionWorkAdmission.release();
								}
								if (prepared.context.runContinuationSession) try {
									await removeCronRunContinuationSessionIfIdle(prepared.context.runSessionKey);
								} catch (error) {
									logWarn(`[cron:${params.job.id}] Failed to remove unused run continuation: ${String(error)}`);
								}
							} finally {
								if (prepared.context.runSessionKey !== prepared.context.agentSessionKey) await cleanupBrowserSessionsForLifecycleEnd({
									cfg: prepared.context.cfgWithAgentDefaults,
									sessionKeys: [prepared.context.runSessionKey],
									onWarn: (message) => logWarn(`[cron:${params.job.id}] ${message}`)
								});
							}
						}
					}
				}
			}), () => leaseActive ? preparedRuntimeLease.snapshot : void 0);
		} finally {
			leaseActive = false;
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { runCronIsolatedAgentTurn as t };
