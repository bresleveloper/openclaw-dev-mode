import { l as asNonNegativeFiniteNumber, n as MAX_TIMER_TIMEOUT_MS, u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { _ as resolvePrimaryStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { a as resolveAgentDir, b as tryResolveAmbientOwnerAgentId, l as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey, x as isCronSessionKey } from "./session-key-CBvmC8zz.mjs";
import { C as createChildDiagnosticTraceContext, D as freezeDiagnosticTraceContext, f as isDiagnosticsEnabled, o as emitTrustedDiagnosticEvent } from "./diagnostic-events-CVabF32H.mjs";
import { _t as normalizeAgentRunTerminalReplySnapshot, ht as buildAgentRunTerminalReplySnapshot } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { i as isSilentReplyPayloadText, n as SILENT_REPLY_TOKEN } from "./tokens-BTKQYTUd.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { _ as resolveHooksGmailModel, h as resolveConfiguredModelRef, m as resolveConfiguredModelPolicyAllow, s as getModelRefStatus } from "./model-selection-shared-0uvJbX1M.mjs";
import { x as resolveSubagentModelConfigSelectionResult } from "./agent-scope-CTuYDtny.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { s as normalizeThinkLevel } from "./thinking.shared-BKzBCWpI.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { d as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-jXc1RW7-.mjs";
import { b as releaseAgentRunContext, o as consumeCronNextCheckProposal, r as claimAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import { l as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent, y as withAgentRunLifecycleGeneration } from "./agent-events-BOSJcayE.mjs";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-BkR4BMBU.mjs";
import { t as resolveAllowedModelRefCore } from "./model-selection-resolve-D7hqOXrq.mjs";
import { l as resolveCreatorSandbox } from "./operator-role-policy-BNrKHiJ3.mjs";
import { n as publishedModelCatalogOwnerMatchesAgent } from "./prepared-model-catalog-owner-BIljybvR.mjs";
import "./thinking-B1p5pEC8.mjs";
import { i as resolveThinkingSelectionCore, n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-BQDdsH3k.mjs";
import { a as isAgentHarnessSessionKey, n as AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-DmCrQjUt.mjs";
import { i as normalizeThinkingCatalogProviders, o as resolveEffectiveAgentRuntime, r as needsThinkHydration } from "./thinking-runtime-Dvszh-e-.mjs";
import { t as ensureAgentWorkspace } from "./workspace-mlzi3k1x.mjs";
import { t as acquireAgentRunPreparedModelRuntime, u as loadPublishedGatewayReplyDispatchRuntime } from "./prepared-model-runtime-DtKqtgJz.mjs";
import { i as withPreparedModelRuntimePluginGenerationScope } from "./prepared-model-runtime-generation-scope-BA7V9xf7.mjs";
import { l as loadResolvedPublishedModelCatalogOwner, o as loadProviderScopedThinkingCatalog } from "./prepared-model-catalog-C3E7Txvc.mjs";
import { n as mapHookExternalContentSource, r as resolveHookExternalContentSource, t as isExternalHookSession } from "./external-content-source-CwcbBHGE.mjs";
import { s as resolveCronScheduledToolPolicy } from "./scheduled-tool-policy-pqnwO5x1.mjs";
import { n as isDetachedCronSessionTarget } from "./session-target-DJsUULzX.mjs";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { n as resolveCronStyleNow } from "./current-time-ojiw0e0p.mjs";
import { a as hasBillableUsage, i as deriveSessionTotalTokens, n as deriveContextPromptTokens, o as hasNonzeroUsage } from "./usage-XXLoqJQC.mjs";
import { m as resolveAgentRunErrorLifecycleFields, o as createAgentRunRestartAbortError } from "./run-termination-Cd1iJzC7.mjs";
import { n as extractTextFromChatContent } from "./chat-content-DNdfeXZh.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-Bjg7ga80.mjs";
import { l as isCommandLaneTaskTimeoutError } from "./command-queue-CaY517ob.mjs";
import "./sessions-DE4llkPV.mjs";
import { d as resolveSessionWorkStartError } from "./lifecycle-WWQJH57y.mjs";
import { n as resolveProjectedSessionContextTokens, r as resolveTrustedSessionContextTokens } from "./context-token-provenance-CO52ZGCb.mjs";
import { i as normalizeCronRunErrorText, o as resolveCronAbortReasonText } from "./execution-errors-BJ-OuMcK.mjs";
import { r as clearBootstrapSnapshotOnSessionRollover } from "./bootstrap-cache-D3fnu3yg.mjs";
import { t as createDiagnosticMessageLifecycle } from "./message-lifecycle-DlKNWHzC.mjs";
import "./agent-bundle-mcp-tools-sYSmxaoq.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-Cl5l5Sfo.mjs";
import { a as readSessionMessagesAsync } from "./session-transcript-readers-Bmg2Zjrq.mjs";
import { t as hasAcceptedSessionSpawn } from "./accepted-session-spawn-4qfWSWlu.mjs";
import { i as toNormalizedUsage, r as mergeUsageIntoAccumulator, t as createUsageAccumulator } from "./usage-accumulator-CKETh8nK.mjs";
import { t as removeCronRunContinuationSessionIfIdle } from "./cron-run-continuation-cleanup-DRtEv4Gy.mjs";
import { n as resolveSourceDeliveryOutcome } from "./source-delivery-plan-BH7sj5FF.mjs";
import { t as createAgentLifecycleTerminalBackstop } from "./agent-lifecycle-terminal-BnQVcmxj.mjs";
import { a as projectChatDisplayMessages } from "./chat-display-projection.core-x-JzVWZh.mjs";
import "./chat-display-projection-BuAz8rxu.mjs";
import { n as isEmbeddedRunTerminalToolFailure, t as CODE_MODE_MCP_CATALOG_MISS_MESSAGE } from "./terminal-tool-failure-D8JFiswW.mjs";
import { t as cleanupBrowserSessionsForLifecycleEnd } from "./browser-lifecycle-cleanup-CH9Q1NZK.mjs";
import { i as mergeCronRunDiagnostics, n as createCronRunDiagnosticsFromError, t as createCronRunDiagnosticsFromAgentResult } from "./run-diagnostics-8UzUPz88.mjs";
import { n as resolveCronJobEffectiveAgentId } from "./agent-id-DfuNKDxM.mjs";
import { t as resolveCronRunErrorReason } from "./run-error-reason-CQ6TWEbb.mjs";
import { t as cleanupCronRunSessionAfterRun } from "./session-cleanup-DUh-Qtr3.mjs";
import { t as classifyCronAgentTurnShellPrompt } from "./agent-turn-command-prompt-CcC5OtqR.mjs";
import { t as CronExecutionRootRuntimeError } from "./execution-root-runtime-Cn0UlMtn.mjs";
import { c as createCronToolsAllowPreflightDiagnostics, d as resolveCronChannelOutputPolicy, l as loadCronDeliveryRuntime, n as resolveCronPreflight, s as buildCronDeliveryTrace, u as resolveCronDeliveryContext } from "./run-fallback-policy-D2P9NH5d.mjs";
import { a as markCronSessionPreRun, c as resolveCronLifecycleRevisionIdentity, i as createPersistCronSessionEntry, l as setCronSessionAgentHarnessId, m as resolveCronPayloadOutcome, n as adoptCronRunSessionMetadata, o as persistCronSkillsSnapshotIfChanged, r as createCronRunContinuationSession, s as projectCronOwnershipFields, t as CronSessionLifecycleClaimError, u as setCronSessionRuntimeModel } from "./run-session-state-BnckQvmH.mjs";
import { n as resolveCronAgentConfig, t as resolveCronActiveRuntimeConfig } from "./run-config-CWlEZ-_8.mjs";
import { n as prepareCronSession, t as loadCronSessionEntryLatest } from "./session-C_16CIbk.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
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
	const { estimateAggregateUsageCost, resolveModelCostConfig } = await import("./usage-format-D1-SSkMh.mjs");
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
	let { synthesizedText, deliveryPayloads, summary, outputText, hasFatalErrorPayload, embeddedRunError } = cronPayloadOutcome;
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
			} : hasFatalErrorPayload ? { error: runError } : {},
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
	const failPendingPresentationWarningUnlessDelivered = (delivered) => {
		if (pendingPresentationWarningError && delivered !== true) {
			hasFatalErrorPayload = true;
			embeddedRunError = pendingPresentationWarningError;
		}
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
	const { dispatchCronDelivery, resolveCronDeliveryBestEffort } = await loadCronDeliveryRuntime();
	const deliveryResult = await dispatchCronDelivery({
		cfgWithAgentDefaults: prepared.cfgWithAgentDefaults,
		deps: prepared.input.deps,
		job: prepared.input.job,
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
		deliveryBestEffort: resolveCronDeliveryBestEffort(prepared.input.job),
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
	failPendingPresentationWarningUnlessDelivered(deliveryResult.delivered);
	return resolveRunOutcome({
		...deliveryResult,
		delivery: deliveryTrace
	});
}
//#endregion
//#region src/skills/runtime/cron-snapshot.ts
const skillsSnapshotRuntimeLoader = createLazyImportLoader(() => import("./cron-snapshot.runtime.js"));
async function loadSkillsSnapshotRuntime() {
	return await skillsSnapshotRuntimeLoader.load();
}
async function resolveCronSkillsSnapshot(params) {
	if (params.isFastTestEnv) return params.existingSnapshot ?? {
		prompt: "",
		skills: []
	};
	const runtime = await loadSkillsSnapshotRuntime();
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
function formatAllowedModelRefs(params) {
	const configured = resolveConfiguredModelPolicyAllow(params).refs;
	if (configured && configured.length > 0) return configured.toSorted().join(", ");
	return "(none configured)";
}
function formatCronPayloadModelRejection(params) {
	const { modelOverride, error } = params;
	if (error.startsWith("model not allowed:")) {
		const modelRef = error.slice(18).trim();
		return `automation model override '${modelOverride}' rejected by ${resolveConfiguredModelPolicyAllow(params).configPath ?? "agents.defaults.modelPolicy.allow"}: ${modelRef} is not in [${formatAllowedModelRefs(params)}]`;
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
	return normalizeThinkingCatalogProviders(await loadProviderScopedThinkingCatalog({
		config: params.owner.config,
		provider: params.provider,
		model: params.model,
		agentRuntime: params.agentRuntime,
		agentId: params.owner.agentId,
		agentDir: params.owner.agentDir,
		workspaceDir: params.owner.workspaceDir
	}));
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
	let provider = resolvedDefault.provider;
	let model = resolvedDefault.model;
	let modelSource = "default";
	let configuredProfileId = splitTrailingAuthProfile(resolveAgentModelPrimaryValue(cfgWithAgentDefaults.agents?.defaults?.model) ?? "").profile;
	const subagentModelConfigSelection = resolveSubagentModelConfigSelectionResult({
		cfg: owner.config,
		agentId: ownerAgentId,
		agentConfigOverride: ownerAgentConfigOverride
	});
	const subagentModelRaw = resolvePrimaryStringValue(subagentModelConfigSelection?.raw);
	const subagentModelSource = subagentModelConfigSelection?.source === "agent" ? "agent" : "subagent";
	if (subagentModelRaw) {
		const resolvedSubagent = resolveAllowedModelRefCore({
			...selectionParams,
			raw: subagentModelRaw
		});
		if (!("error" in resolvedSubagent)) {
			provider = resolvedSubagent.ref.provider;
			model = resolvedSubagent.ref.model;
			modelSource = subagentModelSource;
			configuredProfileId = splitTrailingAuthProfile(subagentModelRaw).profile;
		}
	}
	let hooksGmailModelApplied = false;
	const hooksGmailModelRef = params.isGmailHook ? resolveHooksGmailModel({
		cfg: owner.config,
		defaultProvider: DEFAULT_PROVIDER,
		manifestPlugins: owner.metadataSnapshot
	}) : null;
	if (hooksGmailModelRef) {
		if (getModelRefStatus({
			...selectionParams,
			ref: hooksGmailModelRef
		}).allowed) {
			provider = hooksGmailModelRef.provider;
			model = hooksGmailModelRef.model;
			hooksGmailModelApplied = true;
			modelSource = "hook";
			configuredProfileId = splitTrailingAuthProfile(owner.config.hooks?.gmail?.model ?? "").profile;
		}
	}
	const modelOverrideRaw = params.payload.kind === "agentTurn" ? params.payload.model : void 0;
	const modelOverride = typeof modelOverrideRaw === "string" ? modelOverrideRaw.trim() : void 0;
	if (modelOverride !== void 0 && modelOverride.length > 0) {
		const resolvedOverride = resolveAllowedModelRefCore({
			...selectionParams,
			raw: modelOverride
		});
		if ("error" in resolvedOverride) return {
			ok: false,
			error: formatCronPayloadModelRejection({
				cfg: owner.config,
				agentId: ownerAgentId,
				modelOverride,
				error: resolvedOverride.error
			})
		};
		provider = resolvedOverride.ref.provider;
		model = resolvedOverride.ref.model;
		modelSource = "payload";
		configuredProfileId = splitTrailingAuthProfile(modelOverride).profile;
	}
	if (!modelOverride && !hooksGmailModelApplied) {
		const sessionModelOverride = params.sessionEntry.modelOverride?.trim();
		if (sessionModelOverride) {
			const sessionProviderOverride = params.sessionEntry.providerOverride?.trim() || resolvedDefault.provider;
			const resolvedSessionOverride = resolveAllowedModelRefCore({
				...selectionParams,
				raw: `${sessionProviderOverride}/${sessionModelOverride}`
			});
			if (!("error" in resolvedSessionOverride)) {
				provider = resolvedSessionOverride.ref.provider;
				model = resolvedSessionOverride.ref.model;
				modelSource = "session";
				configuredProfileId = void 0;
			}
		}
	}
	return {
		ok: true,
		provider,
		model,
		modelSource,
		...configuredProfileId ? { configuredProfileId } : {},
		cfgWithAgentDefaults,
		owner
	};
}
//#endregion
//#region src/cron/isolated-agent/run-command-preflight.ts
/** Rejects deterministic command prompts whose stored cap cannot execute them. */
function resolveCronCommandPromptPreflight(job) {
	if (job.payload.kind !== "agentTurn" || classifyCronAgentTurnShellPrompt(job.payload) !== "commandPromptWithoutShellAccess") return;
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
	const lines = projectChatDisplayMessages(messages, { maxChars: CURRENT_CONTEXT_MAX_LINE_CHARS }).flatMap((message) => {
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
function resolveCronAgentTurnMessage(input) {
	if (input.job.payload.kind === "agentTurn") return input.job.payload.message;
	return input.message;
}
const sessionAccessorRuntimeLoader = createLazyImportLoader(() => import("./session-accessor-q6FYcfL0.mjs"));
const cronExternalContentRuntimeLoader = createLazyImportLoader(() => import("./run-external-content.runtime.js"));
const cronAuthProfileRuntimeLoader = createLazyImportLoader(() => import("./run-auth-profile.runtime.js"));
async function loadSessionAccessorRuntime() {
	return await sessionAccessorRuntimeLoader.load();
}
async function loadCronExternalContentRuntime() {
	return await cronExternalContentRuntimeLoader.load();
}
async function loadCronAuthProfileRuntime() {
	return await cronAuthProfileRuntimeLoader.load();
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
	return await (await loadCronAuthProfileRuntime()).resolveSessionAuthSelection({
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
	return `${commandBody}\n\n${`This is an unattended scheduled run. Nobody is present to clarify or approve, so complete the task with what you have. Your final reply is the deliverable — not a plan, an acknowledgement, or a request for input. If nothing needs doing, reply exactly ${SILENT_REPLY_TOKEN}. If something failed, state plainly what failed and what you tried — the scheduler owns retries and failure alerts.`}${opts.externalHook ? "" : " Where the job's own instructions conflict with this preamble, the job's instructions win (a question or plan the job explicitly requests is a valid deliverable). If this job is no longer needed, remove it if your available tools allow."}`;
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
//#region src/cron/isolated-agent/run-prepare.ts
/** Session identity and context preparation for isolated cron runs. */
async function prepareCronRunContext(params) {
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
	const publishedRuntime = await loadPublishedGatewayReplyDispatchRuntime({
		agentId: initialAgentId,
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
	const workspaceDir = (await ensureAgentWorkspace({
		dir: modelOwner.workspaceDir,
		ensureBootstrapFiles: !agentCfg?.skipBootstrap && !params.isFastTestEnv,
		skipOptionalBootstrapFiles: agentCfg?.skipOptionalBootstrapFiles,
		provisioning: await (await import("./acp-workspace-provisioning-Bsq5Ij-T.mjs")).resolveAcpAgentWorkspaceProvisioningForTurn({
			cfg: runtimeCfg,
			agentId
		})
	})).dir;
	const executionWorkspaceDir = input.executionRoot ?? workspaceDir;
	const isGmailHook = hookExternalContentSource === "gmail";
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
	const initialSessionEntry = cronSession.initialSessionEntry;
	const sessionWorkAdmission = await beginSessionWorkAdmission({
		scope: cronSession.storePath,
		identities: [
			agentSessionKey,
			initialSessionEntry?.sessionId,
			cronSession.sessionEntry.sessionId,
			resolveCronLifecycleRevisionIdentity(cronSession.lifecycleRevision),
			runSessionKey
		],
		signal: input.abortSignal ?? input.signal,
		onInterrupt: params.onLifecycleInterrupt,
		assertAllowed: () => {
			const currentEntry = loadCronSessionEntryLatest(cronSession.storePath, agentSessionKey);
			if (initialSessionEntry ? !currentEntry || !isDeepStrictEqual(projectCronOwnershipFields(currentEntry), projectCronOwnershipFields(initialSessionEntry)) : Boolean(currentEntry)) throw new CronSessionLifecycleClaimError(agentSessionKey);
			const archivedSessionError = resolveSessionWorkStartError(agentSessionKey, currentEntry);
			if (archivedSessionError) throw new CronSessionLifecycleClaimError(agentSessionKey, archivedSessionError);
		}
	});
	clearBootstrapSnapshotOnSessionRollover({
		sessionKey: agentSessionKey,
		previousSessionId: cronSession.previousSessionId
	});
	let preparedModelRuntimeLease;
	try {
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
			config: cfgWithAgentDefaults,
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
		const explicitTimeoutSeconds = input.job.payload.kind === "agentTurn" ? input.job.payload.timeoutSeconds : void 0;
		const timeoutMs = resolveAgentTimeoutMs({
			cfg: cfgWithAgentDefaults,
			overrideSeconds: explicitTimeoutSeconds
		});
		const runTimeoutOverrideMs = resolveCronRunTimeoutOverrideMs(explicitTimeoutSeconds);
		const agentPayload = input.job.payload.kind === "agentTurn" ? input.job.payload : null;
		const configuredProvider = cfgWithAgentDefaults.models?.providers?.[provider];
		const modelApi = findModelInCatalog(thinkingSelection.catalog, provider, model)?.api ?? configuredProvider?.models?.find((candidate) => candidate.id === model)?.api ?? configuredProvider?.api;
		const preflightDiagnostics = await createCronToolsAllowPreflightDiagnostics({
			cfg: cfgWithAgentDefaults,
			jobId: input.job.id,
			provider,
			model,
			modelApi,
			agentId: modelOwner.agentId,
			agentDir: modelOwner.agentDir,
			workspaceDir: executionWorkspaceDir,
			sessionKey: agentSessionKey,
			agentPayload,
			agentRuntime: effectiveAgentRuntime,
			toolsAllowProvenance: input.job.toolsAllowProvenance
		});
		const { deliveryPlan, deliveryRequested, resolvedDelivery, sourceDelivery } = await resolveCronDeliveryContext({
			cfg: cfgWithAgentDefaults,
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
		const message = currentConversationContext ? `${currentConversationContext}\n\n${resolveCronAgentTurnMessage(input)}` : resolveCronAgentTurnMessage(input);
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
			config: cfgWithAgentDefaults,
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
		markCronSessionPreRun({
			entry: cronSession.sessionEntry,
			provider,
			model
		});
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
			cfg: cfgWithAgentDefaults,
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
				cfg: cfgWithAgentDefaults
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
				sourceReplyDeliveryMode: sourceDelivery.sourceReplyDeliveryMode,
				requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget
			},
			persistSessionEntry: persistCronSessionRow
		}) : void 0;
		await runContinuationSession?.initialize();
		return {
			ok: true,
			context: {
				input,
				cfgWithAgentDefaults,
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
				var _usingCtx$2 = _usingCtx();
				_usingCtx$2.a(preparedModelRuntimeLease);
				throw error;
			} catch (_) {
				_usingCtx$2.e = _;
			} finally {
				await _usingCtx$2.d();
			}
		} finally {
			sessionWorkAdmission.release();
		}
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
				const messageLifecycle = (() => {
					try {
						const lifecycle = createDiagnosticMessageLifecycle({
							enabled: isDiagnosticsEnabled(params.cfg),
							sessionId: prepared.context.runSessionId,
							sessionKey: prepared.context.runSessionKey,
							channel: "cron",
							source: "cron-isolated",
							startedAtMs: turnStartedAtMs,
							trackSessionState: true
						});
						lifecycle.markProcessing();
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
