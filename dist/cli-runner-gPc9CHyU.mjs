import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { E as createDiagnosticTraceContextFromActiveScope, J as hasInternalDiagnosticEventListeners, O as freezeDiagnosticTraceContext, P as runWithDiagnosticTraceContext, c as emitTrustedDiagnosticEventWithPrivateData, s as emitTrustedDiagnosticEvent, t as areDiagnosticsEnabledForProcess, w as createChildDiagnosticTraceContext } from "./diagnostic-events-BADdmgZf.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { r as resolvePersistedSessionStoreOwnerForTarget } from "./session-store-owner-CnfJSmam.mjs";
import { n as captureAgentRunLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent, y as withAgentRunLifecycleGeneration } from "./agent-events-GvNTkbe3.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-PkWBWOyt.mjs";
import { n as markAuthProfileSuccess } from "./profiles-Dk53jI-3.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-D5rL9Ed5.mjs";
import { a as isSilentReplyPayloadText, r as SILENT_REPLY_TOKEN } from "./tokens-D4ghQG_g.mjs";
import { E as setReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { r as runWithCliHistoryWriter, t as getCliHistoryWriter } from "./cli-history-boundary-CwwMqsE-.mjs";
import { i as captureOwnedTranscriptWriteAssertion, p as withSessionTranscriptWriteAssertion, s as getOwnedSessionTranscriptWriterFence, t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-m7NE2aEm.mjs";
import { m as readRunOperatorAuthority, r as bindOperatorModelExecution } from "./admitted-run-context-QJnFIxUZ.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-CzdLbOjb.mjs";
import { o as loadAuthProfileStoreForRuntime } from "./store-runtime-Qx0DZ2Si.mjs";
import { n as markAuthProfileFailure } from "./usage-Cfv9IA36.mjs";
import "./auth-profiles-BIPn3mmc.mjs";
import { a as isFailoverError, o as isSignalTimeoutReason, s as isTimeoutError } from "./error-B1Zb0HrJ.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-CRE_cwP5.mjs";
import { r as loadExactSessionEntryCandidates, u as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { r as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-CAOPCw68.mjs";
import { n as appendExactAssistantMessageToSessionTranscript } from "./transcript-DPQX-jTt.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BXDxJQSp.mjs";
import { r as coerceToFailoverError } from "./failover-error-BZ8WG_0i.mjs";
import { d as shouldClearInterruptedCliSessionBinding } from "./cli-session-BGS0cWwl.mjs";
import { n as diagnosticErrorFailureKind, r as diagnosticErrorMessage, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-BSgZdc_o.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-BXyGP6P6.mjs";
import { n as prepareCronRootSessionGeneration } from "./session-delivery-generation-DbcbeEMM.mjs";
import { i as resolveReplyExpectation } from "./reply-completion-B5n1Cnxm.mjs";
import { i as buildGenericCliContextEngineHostSupport } from "./host-compat-xESS3bi6.mjs";
import { a as runHarnessContextEngineMaintenance, n as bootstrapHarnessContextEngine, o as awaitAgentEndSideEffects, r as finalizeHarnessContextEngineTurn, s as runAgentEndSideEffects } from "./context-engine-lifecycle-5I2h2fcS.mjs";
import { n as buildAgentHookContextIdentityFields, t as buildAgentHookContextChannelFields } from "./hook-agent-context-Bx9S6KFK.mjs";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-HvSedbJl.mjs";
import { b as resolveSourceReplyDelivery, y as resolveExplicitFinalSourceReplyDeliveryEvidence } from "./delivery-evidence-BEVHUW11.mjs";
import { n as hasCompletionMessageSessionSpawn, t as hasAcceptedSessionSpawn } from "./accepted-session-spawn-DpD0J38H.mjs";
import { t as SessionManager } from "./session-manager-fHN-UyrU.mjs";
import { n as withSessionManagerWrite } from "./session-manager-write-admission-BHoMWW_H.mjs";
import { t as buildAgentHookContext } from "./hook-context-By0mGZMQ.mjs";
import { a as runAgentHarnessLlmInputHook, o as runAgentHarnessLlmOutputHook } from "./lifecycle-hook-helpers-DUPUof_5.mjs";
import { r as buildUsageWithNoCost, t as buildAssistantMessage } from "./stream-message-shared-CYuIJ_XF.mjs";
import { t as projectAgentHarnessTranscriptMessageForDisplay } from "./transcript-visibility-DiwthCmj.mjs";
import { n as runBeforeAgentRunGate, t as buildAgentRunBlockedUserMessage } from "./before-agent-run-BgS1mgp8.mjs";
import { t as subscribeAgentCommentaryDiagnostics } from "./commentary-diagnostics-CWCelAVf.mjs";
import { n as buildHandledBeforeAgentReplyPayloads, r as runBeforeAgentReplyForTurn, t as resolveAuthProfileFailureReason } from "./auth-profile-failure-policy-DVtzunot.mjs";
import { n as mergeAttemptToolMediaPayloads } from "./tool-media-payloads-Cqwq09k_.mjs";
import { t as buildEmbeddedRunPayloads } from "./payloads-CfmN66kP.mjs";
import { a as resolveCliRuntimeOwnerFingerprint, i as resolveCliRuntimeArtifactFingerprint } from "./cli-auth-epoch-Bl-_bpyJ.mjs";
import { n as cliBackendLog, r as formatCliBackendOutputDigest } from "./log-C-xabBWt.mjs";
import { p as hashCliReseedPrompt } from "./cli-session-history.claude-C6Q_lxlR.mjs";
import { C as runCliCleanup, t as acceptsCliLiveSession, u as createCliFailoverError } from "./cli-live-session-registry-Ci6tcreu.mjs";
import { n as getCliMessagingDeliveryEvidence, r as projectCliMessagingDeliveryEvidence, t as attachCliMessagingDeliveryEvidence } from "./delivery-evidence-DH2y_idP.mjs";
import { c as resolveCliSessionId, f as claudeCliSessionTranscriptHasContent, i as loadCliSessionHistoryMessages, l as runCliRecovery, r as loadCliSessionContextEngineMessages, s as buildAgentHookConversationMessages, u as CliAuthProfilePreparationError } from "./session-history-B7_oaIp0.mjs";
//#region src/agents/cli-runner/before-agent-reply.ts
async function runCliBeforeAgentReply(params, assertCurrent) {
	const hookStartedAt = Date.now();
	const hookResult = params.isolatedCompletion || params.controlOperation ? void 0 : await runBeforeAgentReplyForTurn({
		runId: params.runId,
		trigger: params.trigger,
		assertCurrent,
		event: { cleanedBody: params.prompt },
		context: {
			runId: params.runId,
			jobId: params.jobId,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			workspaceDir: params.workspaceDir,
			trigger: params.trigger,
			...buildAgentHookContextChannelFields(params),
			...buildAgentHookContextIdentityFields({
				trigger: params.trigger,
				senderId: params.senderId,
				chatId: params.chatId,
				channelContext: params.channelContext
			})
		},
		onDispatch: () => params.onExecutionPhase?.({
			phase: "before_agent_reply",
			provider: params.provider,
			model: params.model ?? ""
		}),
		onDeclined: () => params.onExecutionPhase?.({
			phase: "runtime_plugins",
			provider: params.provider,
			model: params.model ?? ""
		})
	});
	if (hookResult?.handled) {
		const finalText = hookResult.reply?.text ?? "NO_REPLY";
		const sessionBindingDisabled = resolveCliBackendConfig(params.provider, params.config, { agentId: params.agentId })?.config.sessionMode === "none";
		cliBackendLog.info(`cli synthetic turn: provider=${params.provider} model=<synthetic> requestedModel=${params.model ?? ""} durationMs=${Date.now() - hookStartedAt} ${formatCliBackendOutputDigest(finalText)}`);
		return {
			payloads: buildHandledBeforeAgentReplyPayloads(hookResult.reply),
			meta: {
				durationMs: Date.now() - hookStartedAt,
				agentMeta: {
					sessionId: "",
					provider: params.modelProvider ?? params.provider,
					model: params.model ?? "",
					...sessionBindingDisabled ? { clearCliSessionBinding: true } : {}
				},
				finalAssistantVisibleText: finalText,
				finalAssistantRawText: finalText
			}
		};
	}
}
//#endregion
//#region src/agents/cli-runner/cli-run-settlement.ts
const log$2 = createSubsystemLogger("agents/cli-runner");
/** Formats the visible terminal reason for an interrupted turn that retained partial output. */
function formatCliTerminalInterruption(interruption) {
	return `CLI turn ${interruption.reason} after partial output`;
}
async function settleCliAuthProfile(params) {
	try {
		if (params.terminal.outcome === "success") {
			await markAuthProfileSuccess({
				store: params.store,
				profileId: params.profileId,
				provider: params.provider,
				agentDir: params.agentDir
			});
			return;
		}
		const error = params.terminal.error;
		const reason = resolveAuthProfileFailureReason({
			failoverReason: isFailoverError(error) ? error.reason : null,
			providerStarted: isFailoverError(error) && error.reason === "timeout" ? error.cliTimeout?.observedActivity : void 0
		});
		if (reason) await markAuthProfileFailure({
			store: params.store,
			profileId: params.profileId,
			reason,
			cfg: params.terminal.config,
			agentDir: params.agentDir,
			runId: params.terminal.runId,
			modelId: params.terminal.modelId
		});
	} catch (error) {
		log$2.warn(`CLI auth-profile ${params.terminal.outcome} settlement failed: ${formatErrorMessage(error)}`);
	}
}
function isClaudeCliBackend(provider) {
	return provider.trim().toLowerCase() === "claude-cli";
}
async function assertCliRuntimeBinding(context) {
	if (!context.runtimeArtifactFingerprint) return;
	const currentArtifact = await resolveCliRuntimeArtifactFingerprint({
		provider: context.params.provider,
		config: context.params.config ?? context.contextEngineConfig,
		agentId: context.params.agentId,
		runtimeArtifactId: context.backendResolved.id
	});
	if (currentArtifact !== context.runtimeArtifactFingerprint) throw new Error("CLI executable/package artifact changed during successful inference");
	if (!context.runtimeOwnerFingerprint) return;
	if (await resolveCliRuntimeOwnerFingerprint({
		provider: context.params.provider,
		config: context.params.config ?? context.contextEngineConfig,
		...context.agentDir ? { agentDir: context.agentDir } : {},
		agentId: context.params.agentId,
		runtimeOwnerId: context.backendResolved.id,
		...context.effectiveAuthProfileId ? { authProfileId: context.effectiveAuthProfileId } : {},
		...context.authBindingSkipsLocalCredential ? { skipLocalCredential: true } : {},
		runtimeArtifactFingerprint: currentArtifact
	}) !== context.runtimeOwnerFingerprint) throw new Error("CLI runtime owner changed during successful inference");
}
async function settleCliPreparationError(error, params) {
	try {
		params.assertCurrent?.();
		if (!(error instanceof CliAuthProfilePreparationError)) return;
		await settleCliAuthProfile({
			store: loadAuthProfileStoreForRuntime(error.agentDir, { externalCli: externalCliDiscoveryForProviderAuth({
				cfg: params.config,
				provider: error.provider,
				profileId: error.profileId
			}) }),
			profileId: error.profileId,
			provider: error.provider,
			agentDir: error.agentDir,
			terminal: {
				outcome: "failure",
				error,
				config: params.config,
				runId: params.runId,
				modelId: params.model
			}
		});
	} finally {
		const reportCleanupError = (cleanupError) => {
			recordAgentCleanupFailure();
			log$2.warn(`bundle-mcp preparation cleanup failed: ${formatErrorMessage(cleanupError)}`);
		};
		try {
			await retireCliRunMcpRuntime(params, reportCleanupError);
		} catch (cleanupError) {
			reportCleanupError(cleanupError);
		}
	}
}
async function retireCliRunMcpRuntime(params, onError) {
	if (params.cleanupBundleMcpOnRunEnd !== true) return;
	const { retireSessionMcpRuntime } = await import("./agent-bundle-mcp-tools-BIQ2of6i.mjs");
	await runCliCleanup(params, "cli-bundle-mcp-retire", async () => {
		await retireSessionMcpRuntime({
			sessionId: params.sessionId,
			reason: "cli-run-end",
			preserveActiveLeases: true,
			onError
		});
	});
}
async function settlePreparedCliRun(params) {
	const { context, diagnosticLifecycle, run } = params;
	const runParams = context.params;
	let result;
	let runError;
	try {
		result = await run();
	} catch (error) {
		runError = error;
	}
	const terminalRunError = runError;
	let cleanupError;
	const recordCleanupError = (error) => {
		recordAgentCleanupFailure();
		cleanupError ??= error;
	};
	if (runParams.cleanupCliLiveSessionOnRunEnd === true) try {
		const { closeCliLiveSession } = await import("./cli-live-session-registry-ZAYQ3IrZ.mjs");
		await closeCliLiveSession(context, "restart");
	} catch (error) {
		recordCleanupError(error);
	}
	try {
		await retireCliRunMcpRuntime(runParams, recordCleanupError);
	} catch (error) {
		recordCleanupError(error);
	}
	if (cleanupError) {
		if (runError || result?.didSendViaMessagingTool === true) log$2.warn(`cli run cleanup failed after completion: ${formatErrorMessage(cleanupError)}`);
		else {
			diagnosticLifecycle?.setPhase("cleanup");
			runError = cleanupError instanceof Error ? cleanupError : new Error(formatErrorMessage(cleanupError));
		}
	}
	runParams.assertCurrent?.();
	if (context.effectiveAuthProfileId && context.authProfileStore) {
		const profileId = context.effectiveAuthProfileId;
		const authProfileStore = context.authProfileStore;
		const terminal = terminalRunError ? {
			outcome: "failure",
			error: terminalRunError,
			config: runParams.config,
			runId: runParams.runId,
			modelId: context.modelId
		} : result?.meta.executionTrace?.attempts?.at(-1)?.result === "success" ? { outcome: "success" } : void 0;
		if (terminal) await settleCliAuthProfile({
			store: authProfileStore,
			profileId,
			provider: authProfileStore.profiles[profileId]?.provider ?? runParams.provider,
			agentDir: context.agentDir,
			terminal
		});
	}
	if (runError) throw runError instanceof Error ? runError : new Error(formatErrorMessage(runError));
	return result;
}
function resolveCliSourceReplyMirror(params) {
	const { evidence, modelId, runParams } = params;
	const payloads = buildEmbeddedRunPayloads({
		assistantTexts: [],
		lastAssistant: void 0,
		sessionKey: runParams.sessionKey ?? "",
		provider: runParams.provider,
		model: modelId,
		didSendViaMessagingTool: evidence.didSendViaMessagingTool,
		didDeliverSourceReplyViaMessageTool: evidence.didDeliverSourceReplyViaMessageTool,
		messagingToolSentTargets: evidence.messagingToolSentTargets,
		messagingToolSourceReplyPayloads: evidence.messagingToolSourceReplyPayloads,
		sourceReplyDeliveryMode: runParams.sourceReplyDeliveryMode,
		agentId: runParams.agentId,
		runId: runParams.runId
	});
	return {
		payloads,
		delivered: payloads.length > 0 || runParams.sourceReplyDeliveryMode === "message_tool_only" && evidence.didDeliverSourceReplyViaMessageTool === true,
		visibleText: payloads.map((payload) => payload.text?.trim() ?? "").filter(Boolean).join("\n\n") || void 0
	};
}
function buildCliExecutionMetadata(context, attempt) {
	return {
		executionTrace: {
			winnerProvider: context.params.provider,
			winnerModel: context.modelId,
			attempts: [{
				provider: context.params.provider,
				model: context.modelId,
				...attempt
			}],
			fallbackUsed: false,
			runner: "cli"
		},
		requestShaping: {
			...context.params.thinkLevel ? { thinking: context.params.thinkLevel } : {},
			...context.effectiveAuthProfileId ? { authMode: "auth-profile" } : {}
		}
	};
}
function buildBlockedCliRunResult(params) {
	const { context, message, preparedContextAgentMeta, sessionBindingDisabled } = params;
	const runParams = context.params;
	return {
		payloads: [{
			text: message,
			isError: true
		}],
		meta: {
			durationMs: Date.now() - context.started,
			finalAssistantVisibleText: message,
			finalAssistantRawText: message,
			livenessState: "blocked",
			error: {
				kind: "hook_block",
				message
			},
			systemPromptReport: context.systemPromptReport,
			...buildCliExecutionMetadata(context, {
				result: "error",
				reason: "before_agent_run blocked the run"
			}),
			completion: {
				finishReason: "blocked",
				stopReason: "blocked",
				refusal: true
			},
			agentMeta: {
				sessionId: runParams.sessionId ?? "",
				provider: runParams.modelProvider ?? runParams.provider,
				model: context.modelId,
				...preparedContextAgentMeta,
				...sessionBindingDisabled ? { clearCliSessionBinding: true } : {}
			}
		}
	};
}
function buildCliDeliveredFailure(params) {
	const { context, error, evidence, preparedContextAgentMeta, reusableCliSessionId, sessionBindingDisabled } = params;
	const runParams = context.params;
	const message = formatErrorMessage(error);
	const { payloads } = resolveCliSourceReplyMirror({
		evidence,
		runParams,
		modelId: context.modelId
	});
	const visiblePayloads = payloads.length > 0 ? payloads : resolveExplicitFinalSourceReplyDeliveryEvidence(evidence) === false ? [{
		text: "The reply stopped after sending progress. Please try again.",
		isError: true
	}] : void 0;
	return {
		...visiblePayloads ? { payloads: visiblePayloads } : {},
		meta: {
			durationMs: Date.now() - context.started,
			systemPromptReport: context.systemPromptReport,
			stopReason: "error",
			...buildCliExecutionMetadata(context, {
				result: "error",
				reason: message
			}),
			completion: {
				finishReason: "error",
				stopReason: "error",
				refusal: false
			},
			agentMeta: {
				sessionId: "",
				provider: runParams.modelProvider ?? runParams.provider,
				model: context.modelId,
				...preparedContextAgentMeta,
				...sessionBindingDisabled || reusableCliSessionId ? { clearCliSessionBinding: true } : {}
			}
		},
		...projectCliMessagingDeliveryEvidence(evidence),
		didSendViaMessagingTool: true
	};
}
function buildCliRunResult(params) {
	const { assistantTranscriptOwned, assistantTranscriptIdempotencyKey, bindingFlushOk, context, effectiveCliSessionId, output, preparedContextAgentMeta, sessionBindingDisabled, usedHistoryPrompt, userTurnHandled } = params;
	const runParams = context.params;
	const text = output.text?.trim();
	const rawText = output.rawText?.trim();
	const sourceReplyMirror = resolveCliSourceReplyMirror({
		evidence: output,
		runParams,
		modelId: context.modelId
	});
	const finalAssistantVisibleText = sourceReplyMirror.delivered ? sourceReplyMirror.visibleText : text;
	const payloads = sourceReplyMirror.payloads.length > 0 ? sourceReplyMirror.payloads : sourceReplyMirror.delivered ? void 0 : text ? (output.textParts ?? [text]).map((partText, assistantMessageIndex) => assistantTranscriptOwned || output.textParts ? setReplyPayloadMetadata({ text: partText }, {
		...output.textParts ? { assistantMessageIndex } : {},
		...assistantTranscriptOwned ? { assistantTranscriptOwned: true } : {},
		...assistantTranscriptIdempotencyKey ? { assistantTranscriptIdempotencyKey } : {}
	}) : { text: partText }) : resolveReplyExpectation(runParams) === "optional" ? [{ text: SILENT_REPLY_TOKEN }] : void 0;
	const payloadsWithToolMedia = mergeAttemptToolMediaPayloads({
		payloads,
		toolMediaUrls: output.toolMediaUrls,
		toolAudioAsVoice: output.toolAudioAsVoice,
		toolTrustedLocalMedia: output.toolTrustedLocalMedia,
		sourceReplyDeliveryMode: runParams.sourceReplyDeliveryMode
	});
	const unflushed = !sessionBindingDisabled && effectiveCliSessionId && bindingFlushOk === false;
	const terminalInterruption = output.terminalInterruption;
	const cliSessionBindingCleared = sessionBindingDisabled || unflushed || shouldClearInterruptedCliSessionBinding({
		interrupted: terminalInterruption !== void 0,
		bindingReplacedDuringRun: effectiveCliSessionId !== resolveCliSessionId(context.reusableCliSession)
	});
	const persistedCliSessionId = cliSessionBindingCleared ? void 0 : effectiveCliSessionId;
	const createdReseedReceipt = persistedCliSessionId && usedHistoryPrompt && isClaudeCliBackend(runParams.provider) && output.finalPromptText !== void 0 && userTurnHandled && runParams.sessionId ? {
		version: 1,
		promptHash: hashCliReseedPrompt(output.finalPromptText),
		localSessionId: runParams.sessionId,
		userTurnDisposition: runParams.userTurnTranscriptRecorder?.hasPersisted() ? "persisted" : "omitted"
	} : void 0;
	const preservedReseedReceipt = runParams.cliSessionBinding && persistedCliSessionId === runParams.cliSessionBinding.sessionId ? runParams.cliSessionBinding.reseedReceipt : void 0;
	const reseedReceipt = createdReseedReceipt ?? preservedReseedReceipt;
	const agentSessionId = terminalInterruption || unflushed ? "" : sessionBindingDisabled ? runParams.sessionId ?? "" : effectiveCliSessionId ?? runParams.sessionId ?? "";
	const yielded = output.yielded === true;
	const stopReason = terminalInterruption?.reason ?? (yielded ? "end_turn" : "completed");
	if (!terminalInterruption) runParams.onSuccessfulAuthBinding?.({
		...context.effectiveAuthProfileId ? { authProfileId: context.effectiveAuthProfileId } : {},
		...context.authBindingFingerprint ? { authFingerprint: context.authBindingFingerprint } : {},
		...!context.authBindingFingerprint && context.runtimeOwnerFingerprint ? {
			runtimeOwnerFingerprint: context.runtimeOwnerFingerprint,
			runtimeOwnerKind: "cli-runtime",
			runtimeOwnerId: context.backendResolved.id
		} : {},
		...context.runtimeArtifactFingerprint ? {
			runtimeArtifactFingerprint: context.runtimeArtifactFingerprint,
			runtimeArtifactId: context.backendResolved.id
		} : {},
		...context.authBindingSkipsLocalCredential ? { skipLocalCredential: true } : {}
	});
	return {
		payloads: payloadsWithToolMedia,
		meta: {
			durationMs: Date.now() - context.started,
			...output.finalPromptText ? { finalPromptText: output.finalPromptText } : {},
			...finalAssistantVisibleText ? { finalAssistantVisibleText } : {},
			...rawText ? { finalAssistantRawText: rawText } : {},
			systemPromptReport: context.systemPromptReport,
			...terminalInterruption ? {
				aborted: true,
				providerStarted: true,
				stopReason,
				...terminalInterruption.reason === "timeout" ? { timeoutPhase: "provider" } : {}
			} : yielded ? {
				yielded: true,
				livenessState: "paused",
				stopReason
			} : {},
			...output.yieldAcknowledgment ? { yieldAcknowledgment: output.yieldAcknowledgment } : {},
			...buildCliExecutionMetadata(context, {
				result: terminalInterruption?.reason ?? "success",
				...terminalInterruption ? { reason: formatCliTerminalInterruption(terminalInterruption) } : {}
			}),
			completion: {
				finishReason: terminalInterruption?.reason ?? (yielded ? "end_turn" : "stop"),
				stopReason,
				refusal: false
			},
			...output.toolSummary ? { toolSummary: output.toolSummary } : {},
			agentMeta: {
				sessionId: agentSessionId,
				provider: runParams.modelProvider ?? runParams.provider,
				model: context.modelId,
				...preparedContextAgentMeta,
				usage: output.usage,
				...output.usage ? { lastCallUsage: output.usage } : {},
				...output.diagnosticUsage ? { diagnosticUsage: output.diagnosticUsage } : {},
				...persistedCliSessionId ? { cliSessionBinding: {
					sessionId: persistedCliSessionId,
					...context.effectiveAuthProfileId ? { authProfileId: context.effectiveAuthProfileId } : {},
					...output.resumeCheckpointId ? { resumeCheckpointId: output.resumeCheckpointId } : {},
					...context.authEpoch ? { authEpoch: context.authEpoch } : {},
					authEpochVersion: context.authEpochVersion,
					...context.extraSystemPromptHash ? { extraSystemPromptHash: context.extraSystemPromptHash } : {},
					...context.messageToolPolicyHash ? { messageToolPolicyHash: context.messageToolPolicyHash } : {},
					...context.promptToolNamesHash ? { promptToolNamesHash: context.promptToolNamesHash } : {},
					...context.cwdHash ? { cwdHash: context.cwdHash } : {},
					...context.preparedBackend.mcpConfigHash ? { mcpConfigHash: context.preparedBackend.mcpConfigHash } : {},
					...context.preparedBackend.mcpResumeHash ? { mcpResumeHash: context.preparedBackend.mcpResumeHash } : {},
					...reseedReceipt ? { reseedReceipt } : {}
				} } : {},
				...cliSessionBindingCleared ? { clearCliSessionBinding: true } : {}
			}
		},
		...projectCliMessagingDeliveryEvidence(output),
		...output.acceptedSessionSpawns?.length ? { acceptedSessionSpawns: output.acceptedSessionSpawns } : {}
	};
}
function settleCliBackendOutcome(params) {
	const { cleanupError, deliveredMessagingSideEffect, diagnosticLifecycle, failoverContext, runError, runFailed, runResult } = params;
	if (cleanupError) {
		recordAgentCleanupFailure();
		if (!deliveredMessagingSideEffect) {
			if (runFailed) log$2.warn(`CLI run also failed before backend cleanup: ${formatErrorMessage(runError)}`);
			diagnosticLifecycle?.setPhase("cleanup");
			throw cleanupError;
		}
		log$2.warn(`CLI backend cleanup failed after confirmed message delivery: ${formatErrorMessage(cleanupError)}`);
	}
	if (runFailed) throw coerceToFailoverError(runError, failoverContext) ?? runError;
	if (!runResult) throw new Error("CLI run completed without a result");
	return runResult;
}
//#endregion
//#region src/agents/cli-runner/cli-run-transcript.ts
const log$1 = createSubsystemLogger("agents/cli-runner");
function buildCliHookUserMessage(prompt) {
	return {
		role: "user",
		content: prompt,
		timestamp: Date.now()
	};
}
/** Interrupted turns persist as aborted so replayed history never treats partial text as complete. */
function resolveCliAssistantStopReason(output) {
	return output.terminalInterruption ? "aborted" : "stop";
}
function buildCliHookAssistantMessage(params) {
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: params.text
		}],
		api: "responses",
		provider: params.provider,
		model: params.model,
		...params.usage ? { usage: params.usage } : {},
		stopReason: params.stopReason,
		timestamp: Date.now()
	};
}
function isAgentMessage(value) {
	return Boolean(value && typeof value === "object" && "role" in value);
}
async function runCliAgentEndHook(params, hookParams) {
	if (!params.messageChannel && !params.messageProvider) {
		await awaitAgentEndSideEffects(hookParams);
		return;
	}
	runAgentEndSideEffects(hookParams);
}
async function persistApprovedCliUserTurnTranscript(params) {
	const recorder = params.userTurnTranscriptRecorder;
	const reusingPersistedTurn = params.suppressNextUserMessagePersistence === true;
	if (!recorder || reusingPersistedTurn && !recorder.hasPersisted()) return recorder?.isBlocked() === true;
	const persisted = await recorder.persistApproved({ cwd: params.cwd ?? params.workspaceDir });
	if (!persisted && !recorder.hasPersisted() && await recorder.resolveMessage()) recorder.markBlocked();
	if (persisted && !reusingPersistedTurn) try {
		const notification = params.onUserMessagePersisted?.(persisted.message);
		if (notification) Promise.resolve(notification).catch((error) => {
			log$1.warn(`CLI user turn persistence notification failed: ${formatErrorMessage(error)}`);
		});
	} catch (error) {
		log$1.warn(`CLI user turn persistence notification failed: ${formatErrorMessage(error)}`);
	}
	return persisted !== void 0 || recorder.hasPersisted() || recorder.isBlocked();
}
async function persistCliAssistantTranscript(params) {
	const { runParams } = params;
	if (runParams.currentInboundEventKind === "room_event" || !params.text) {
		const admission = runParams.userTurnTranscriptRecorder?.getAdmissionReceipt();
		return {
			owned: runParams.currentInboundEventKind === "room_event",
			...admission ? { terminalAnchor: admission } : {}
		};
	}
	if (!runParams.persistAssistantTranscript || !runParams.sessionKey) return { owned: false };
	try {
		const idempotencyKey = `cli-assistant:${runParams.runId}`;
		const result = await appendExactAssistantMessageToSessionTranscript({
			sessionKey: runParams.sessionKey,
			agentId: runParams.agentId,
			expectedSessionId: runParams.sessionId,
			...runParams.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: runParams.expectedLifecycleRevision } : {},
			...runParams.expectedWriterRunId !== void 0 ? { expectedWriterRunId: runParams.expectedWriterRunId } : {},
			storePath: runParams.storePath,
			idempotencyKey,
			runId: runParams.runId,
			config: runParams.config,
			beforeMessageWrite: (write) => {
				const message = runAgentHarnessBeforeMessageWriteHook({
					...write,
					message: projectAgentHarnessTranscriptMessageForDisplay({
						hidden: false,
						inputProvenance: runParams.inputProvenance,
						message: write.message
					}),
					prepareAssistantTranscriptMessage: runParams.prepareAssistantTranscriptMessage
				});
				return message ? projectAgentHarnessTranscriptMessageForDisplay({
					hidden: false,
					inputProvenance: runParams.inputProvenance,
					message
				}) : null;
			},
			message: {
				...buildAssistantMessage({
					model: {
						api: "cli",
						provider: runParams.provider,
						id: params.modelId
					},
					content: [{
						type: "text",
						text: params.text
					}],
					stopReason: params.stopReason,
					usage: buildUsageWithNoCost({
						input: params.usage?.input,
						output: params.usage?.output,
						cacheRead: params.usage?.cacheRead,
						cacheWrite: params.usage?.cacheWrite,
						totalTokens: params.usage?.total
					})
				}),
				...params.yielded && params.stopReason === "stop" ? { openclawStreamFallback: {
					replacementText: params.text,
					source: "segment",
					itemId: runParams.runId
				} } : {}
			}
		});
		if (!result.ok) {
			log$1.warn(`CLI assistant transcript persistence skipped: ${result.reason}`);
			return { owned: result.code === "blocked" || result.code === "session-rebound" };
		}
		return {
			owned: true,
			idempotencyKey,
			...result.anchor ? { terminalAnchor: result.anchor } : {}
		};
	} catch (error) {
		log$1.warn(`CLI assistant transcript persistence failed: ${formatErrorMessage(error)}`);
		return { owned: false };
	}
}
async function notifyCliUserMessagePersisted(params, message, context) {
	try {
		await Promise.resolve(params.onUserMessagePersisted?.(message));
	} catch (err) {
		log$1.warn(`${context} notification failed: ${formatErrorMessage(err)}`);
	}
}
function captureCliBlockFallbackWrite(target, expectedEntry) {
	const identity = { ...target };
	const env = cloneEnvWithPlatformSemantics(process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const readScope = {
		...identity,
		env
	};
	const assertOwnedWrite = captureOwnedTranscriptWriteAssertion(identity);
	const fence = getOwnedSessionTranscriptWriterFence({
		sessionKey: identity.sessionKey,
		sessionTarget: identity
	});
	const { normalizedKey } = resolveSessionEntry(readScope, { readOnly: true });
	let source;
	const captured = loadExactSessionEntryCandidates({
		...readScope,
		sessionKeys: [normalizedKey],
		readOnly: true,
		onReadSource: (readSource) => {
			source = {
				agentId: readSource.agentId,
				path: readSource.path
			};
		}
	})[0]?.entry;
	if (!source || !captured || captured.sessionId !== identity.sessionId) throw new SessionTranscriptWriterClaimReboundError();
	const readSource = source;
	const { lifecycleRevision, activeWriterRunId } = expectedEntry;
	const cliWriter = getCliHistoryWriter({
		...identity,
		storePath: readSource.path
	});
	const assertCurrent = () => {
		assertOwnedWrite();
		cliWriter?.assertCurrent();
		const current = loadExactSessionEntryCandidates({
			...readScope,
			sessionKeys: [normalizedKey],
			readOnly: true,
			onReadSource: (currentSource) => {
				if (currentSource.agentId !== readSource.agentId || currentSource.path !== readSource.path) throw new SessionTranscriptWriterClaimReboundError();
			}
		})[0]?.entry;
		if (!current || current.sessionId !== identity.sessionId || current.lifecycleRevision !== lifecycleRevision || current.activeWriterRunId !== activeWriterRunId || fence?.expectedLifecycleRevision !== void 0 && current.lifecycleRevision !== fence.expectedLifecycleRevision || fence?.expectedWriterRunId !== void 0 && current.activeWriterRunId !== fence.expectedWriterRunId) throw new SessionTranscriptWriterClaimReboundError();
	};
	return {
		readScope,
		assertCurrent
	};
}
async function persistCliRunBlock(params, block) {
	const redactedUserMessage = buildAgentRunBlockedUserMessage(params.runId, {
		message: block.message,
		blockedBy: block.pluginId
	});
	try {
		const persisted = await params.userTurnTranscriptRecorder?.persistBlocked(redactedUserMessage);
		if (persisted) {
			await notifyCliUserMessagePersisted(params, persisted.message, "before_agent_run block user-turn persistence");
			return;
		}
	} catch (err) {
		log$1.warn(`before_agent_run block: failed to persist canonical CLI user message: ${formatErrorMessage(err)}`);
	}
	try {
		const sessionManager = params.sessionManager;
		if (!sessionManager) {
			const sessionKey = params.sessionKey?.trim() || params.sessionId;
			const targetAgentId = params.sessionTarget?.agentId;
			const targetStorePath = params.sessionTarget?.storePath;
			const targetStoreOwner = resolvePersistedSessionStoreOwnerForTarget({
				config: params.config ?? {},
				sessionKey,
				storePath: targetStorePath
			});
			const agentId = (targetAgentId && targetStorePath && !parseAgentSessionKey(sessionKey)?.agentId && targetStoreOwner.kind === "none" ? targetAgentId : void 0) ?? resolveSessionAgentId({
				agentId: targetAgentId ?? params.agentId,
				config: params.config,
				sessionKey
			});
			const sessionTarget = { ...params.sessionTarget ?? {
				agentId,
				sessionId: params.sessionId,
				sessionKey,
				storePath: params.storePath ?? resolveSessionStorePathCore(params.config?.session?.store, { agentId })
			} };
			const persistedEntry = await patchSessionEntryCore(sessionTarget, (entry, patchContext) => {
				if (patchContext.existingEntry && entry.sessionId !== sessionTarget.sessionId) return null;
				return {
					sessionId: sessionTarget.sessionId,
					updatedAt: Date.now()
				};
			}, {
				fallbackEntry: params.sessionEntry ? void 0 : {
					sessionId: sessionTarget.sessionId,
					updatedAt: Date.now()
				},
				skipMaintenance: true
			});
			if (persistedEntry?.sessionId !== sessionTarget.sessionId) return;
			const write = captureCliBlockFallbackWrite(sessionTarget, persistedEntry);
			const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
			await restoreSessionColdTranscript(write.readScope, write.assertCurrent);
			await withSessionTranscriptWriteAssertion(write.readScope, write.assertCurrent, async () => {
				const manager = await SessionManager.openAsync(write.readScope);
				write.assertCurrent();
				await manager.appendMessageAsync(redactedUserMessage);
			});
			return;
		}
		const target = sessionManager.getSessionTarget();
		const assertOwnedWrite = target ? captureOwnedTranscriptWriteAssertion(target) : void 0;
		const cliWriter = target ? getCliHistoryWriter({
			...target,
			storePath: resolveSessionTranscriptDatabasePath(target)
		}) : void 0;
		const assertCurrent = () => {
			assertOwnedWrite?.();
			cliWriter?.assertCurrent();
		};
		const append = () => withSessionManagerWrite(sessionManager, async () => {
			assertCurrent();
			await sessionManager.appendMessageAsync(redactedUserMessage);
		});
		await (target ? withSessionTranscriptWriteAssertion(target, assertCurrent, append) : append());
	} catch (err) {
		log$1.warn(`before_agent_run block: failed to persist redacted CLI user message: ${formatErrorMessage(err)}`);
	}
}
async function finalizeCliContextEngineTurn(params) {
	const { context } = params;
	if (!context.contextEngine) return;
	const { params: runParams } = context;
	const admission = runParams.userTurnTranscriptRecorder?.getAdmissionReceipt();
	if (runParams.onContextEngineTurnCandidate) {
		if (admission && params.terminalAnchor) runParams.onContextEngineTurnCandidate({
			boundary: {
				admission,
				terminal: params.terminalAnchor
			},
			sessionIdUsed: runParams.sessionId,
			sessionKey: runParams.sessionKey,
			sessionTarget: runParams.sessionTarget,
			promptError: false,
			aborted: params.output.terminalInterruption !== void 0 || runParams.abortSignal?.aborted === true,
			yieldAborted: false,
			isHeartbeat: isHeartbeatLifecycleRunKind(runParams.bootstrapContextRunKind),
			runtimeContext: {
				provider: runParams.modelProvider ?? runParams.provider,
				modelId: context.modelId,
				modelContextWindow: runParams.modelContextWindow,
				tokenBudget: context.contextWindowInfo?.tokens
			}
		});
	} else {
		const prePromptMessages = params.historyMessages.filter(isAgentMessage);
		const turnMessages = [];
		if (context.contextEngineTurnPrompt) turnMessages.push(buildCliHookUserMessage(context.contextEngineTurnPrompt));
		if (params.assistantText) turnMessages.push(buildCliHookAssistantMessage({
			text: params.assistantText,
			provider: runParams.provider,
			model: context.modelId,
			usage: params.output.usage,
			stopReason: resolveCliAssistantStopReason(params.output)
		}));
		const contextEngineHostSupport = buildGenericCliContextEngineHostSupport({ backendId: context.backendResolved.id });
		await finalizeHarnessContextEngineTurn({
			contextEngine: context.contextEngine,
			promptError: false,
			aborted: params.output.terminalInterruption !== void 0 || runParams.abortSignal?.aborted === true,
			yieldAborted: false,
			sessionIdUsed: runParams.sessionId,
			sessionKey: runParams.sessionKey,
			sessionTarget: runParams.sessionTarget,
			sessionFile: runParams.sessionFile,
			isHeartbeat: isHeartbeatLifecycleRunKind(runParams.bootstrapContextRunKind),
			messagesSnapshot: [...prePromptMessages, ...turnMessages],
			prePromptMessageCount: prePromptMessages.length,
			sessionManager: runParams.sessionManager,
			config: context.contextEngineConfig,
			contextEngineHostSupport,
			providerId: runParams.provider,
			modelId: context.modelId,
			runMaintenance: async (maintenanceParams) => await runHarnessContextEngineMaintenance({
				...maintenanceParams,
				onDeferredMaintenance: context.deferContextEngineDisposalUntil,
				withSessionManagerRewriteLock: async (operation) => await operation()
			}),
			warn: (message) => log$1.warn(message)
		});
	}
}
//#endregion
//#region src/agents/cli-runner/run-diagnostics.ts
/** Trusted run hierarchy for Claude Code CLI-backed agent turns. */
function diagnosticBase(params, trace) {
	const channel = params.messageChannel ?? params.messageProvider;
	return {
		runId: params.runId,
		...params.agentId ? { agentId: params.agentId } : {},
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		provider: params.modelProvider ?? "anthropic",
		...params.model ? { model: params.model } : {},
		...params.trigger ? { trigger: params.trigger } : {},
		...channel ? { channel } : {},
		trace
	};
}
function resultRunOutcome(result) {
	if (result.meta.livenessState === "blocked") return "blocked";
	if (result.meta.aborted === true) return "aborted";
	if (result.meta.error) return "error";
	return "completed";
}
function errorHarnessOutcome(error, abortSignal) {
	const failureKind = diagnosticErrorFailureKind(error);
	if (failureKind === "timeout") return "timed_out";
	if (failureKind === "aborted" || abortSignal?.aborted) return abortSignal?.aborted && isSignalTimeoutReason(abortSignal.reason) ? "timed_out" : "aborted";
	if (isTimeoutError(error)) return "timed_out";
	return "error";
}
/**
* Wraps one OpenClaw Claude CLI turn in synthetic harness/run boundaries.
* The child run scope makes every real Claude CLI model call nest beneath it.
*/
async function runClaudeCliAgentTurnWithDiagnostics(params, run) {
	const harnessTrace = freezeDiagnosticTraceContext(createDiagnosticTraceContextFromActiveScope());
	const runTrace = freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(harnessTrace));
	const harnessBase = {
		...diagnosticBase(params, harnessTrace),
		harnessId: "claude-cli"
	};
	const runBase = diagnosticBase(params, runTrace);
	const startedAt = Date.now();
	let phase = "prepare";
	let unsubscribeCommentary;
	const lifecycle = {
		setPhase: (nextPhase) => {
			phase = nextPhase;
		},
		setExecutionContext: ({ agentId, config }) => {
			if (agentId) {
				harnessBase.agentId = agentId;
				runBase.agentId = agentId;
			}
			unsubscribeCommentary?.();
			unsubscribeCommentary = subscribeAgentCommentaryDiagnostics(config, harnessBase);
		}
	};
	emitTrustedDiagnosticEvent({
		type: "harness.run.started",
		...harnessBase
	});
	emitTrustedDiagnosticEvent({
		type: "run.started",
		...runBase
	});
	try {
		const result = await runWithDiagnosticTraceContext(runTrace, () => run(lifecycle));
		const runOutcome = resultRunOutcome(result);
		const resultErrorMessage = result.meta.error?.message;
		const runErrorMessage = runOutcome === "error" ? resultErrorMessage : void 0;
		emitTrustedDiagnosticEventWithPrivateData({
			type: "run.completed",
			...runBase,
			durationMs: Date.now() - startedAt,
			outcome: runOutcome,
			...runOutcome === "blocked" ? { blockedBy: "before_agent_run" } : {},
			...runOutcome === "error" && result.meta.error ? { errorCategory: result.meta.error.kind } : {}
		}, runErrorMessage ? { errorMessage: runErrorMessage } : void 0);
		emitTrustedDiagnosticEventWithPrivateData({
			type: "harness.run.completed",
			...harnessBase,
			durationMs: Date.now() - startedAt,
			outcome: result.meta.timeoutPhase !== void 0 ? "timed_out" : runOutcome === "blocked" ? "error" : runOutcome,
			...typeof result.meta.yielded === "boolean" ? { yieldDetected: result.meta.yielded } : {}
		}, resultErrorMessage && (runOutcome === "error" || runOutcome === "blocked") ? { errorMessage: resultErrorMessage } : void 0);
		return result.diagnosticTrace ? result : {
			...result,
			diagnosticTrace: harnessTrace
		};
	} catch (error) {
		const errorMessage = diagnosticErrorMessage(error);
		const harnessOutcome = errorHarnessOutcome(error, params.abortSignal);
		emitTrustedDiagnosticEventWithPrivateData({
			type: "run.completed",
			...runBase,
			durationMs: Date.now() - startedAt,
			outcome: harnessOutcome === "error" ? "error" : "aborted",
			...harnessOutcome === "error" ? { errorCategory: diagnosticErrorCategory(error) } : {}
		}, errorMessage ? { errorMessage } : void 0);
		if (harnessOutcome === "error") emitTrustedDiagnosticEventWithPrivateData({
			type: "harness.run.error",
			...harnessBase,
			durationMs: Date.now() - startedAt,
			phase,
			errorCategory: diagnosticErrorCategory(error)
		}, errorMessage ? { errorMessage } : void 0);
		else emitTrustedDiagnosticEvent({
			type: "harness.run.completed",
			...harnessBase,
			durationMs: Date.now() - startedAt,
			outcome: harnessOutcome
		});
		throw error;
	} finally {
		unsubscribeCommentary?.();
	}
}
//#endregion
//#region src/agents/cli-runner.ts
const log = createSubsystemLogger("agents/cli-runner");
/** Checks whether a Claude CLI session binding has reached its transcript file. */
async function isCliBindingFlushed(sessionId, provider, workspaceDir, options) {
	if (!provider || !isClaudeCliBackend(provider)) return true;
	if (!sessionId) return false;
	if (options?.skipTranscriptProbe) return true;
	for (const delayMs of [
		0,
		50,
		150
	]) {
		if (delayMs > 0) await sleep(delayMs);
		if (await claudeCliSessionTranscriptHasContent({
			sessionId,
			workspaceDir
		})) return true;
	}
	return false;
}
function runCliAgent(paramsInput) {
	const lifecycleGeneration = paramsInput.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(paramsInput.runId);
	const params = {
		...paramsInput,
		lifecycleGeneration
	};
	return withAgentRunLifecycleGeneration(lifecycleGeneration, () => isClaudeCliBackend(params.provider) && areDiagnosticsEnabledForProcess() && hasInternalDiagnosticEventListeners() ? runClaudeCliAgentTurnWithDiagnostics(params, (diagnosticLifecycle) => runCliAgentInternal(params, diagnosticLifecycle)) : runCliAgentInternal(params));
}
async function runCliAgentInternal(params, diagnosticLifecycle) {
	assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
	await params.onExecutionStarted?.();
	assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
	params.abortSignal?.throwIfAborted();
	params.assertCurrent?.();
	let modelExecution;
	const assertCallerCurrent = params.assertCurrent;
	const generationAbortController = new AbortController();
	let generation;
	try {
		const target = params.sessionTarget;
		generation = target && !params.sessionManager && !params.isolatedCompletion ? await prepareCronRootSessionGeneration({
			...target,
			sessionKey: params.sessionKey ?? target.sessionKey,
			sessionId: params.sessionId,
			lifecycleRevision: params.expectedLifecycleRevision ?? params.sessionEntry?.lifecycleRevision
		}, (reason) => generationAbortController.abort(reason)) : void 0;
		const hookResult = await runCliBeforeAgentReply(params, generation?.assertCurrent);
		if (hookResult) return hookResult;
		modelExecution = bindOperatorModelExecution(readRunOperatorAuthority(params), params.requesterModel, params.mapOperatorAuthorizationError);
		const abortSignals = [
			params.abortSignal,
			modelExecution?.signal,
			generation ? generationAbortController.signal : void 0
		].filter((signal) => signal !== void 0);
		const runParams = modelExecution || generation ? {
			...params,
			abortSignal: abortSignals.length > 1 ? AbortSignal.any(abortSignals) : abortSignals[0],
			assertCurrent: () => {
				assertCallerCurrent?.();
				modelExecution?.assertCurrent();
				generation?.assertCurrent();
			}
		} : params;
		const { prepareCliRunContext } = await import("./prepare.runtime.js");
		let context;
		try {
			context = await prepareCliRunContext(runParams);
		} catch (error) {
			await settleCliPreparationError(error, runParams);
			throw error;
		}
		diagnosticLifecycle?.setExecutionContext(context.params);
		const result = await settlePreparedCliRun({
			context,
			diagnosticLifecycle,
			run: async () => await runPreparedCliAgent(context, diagnosticLifecycle)
		});
		modelExecution?.assertCurrent();
		return result;
	} finally {
		generation?.release();
		modelExecution?.release();
	}
}
async function runPreparedCliAgent(context, diagnosticLifecycle) {
	const run = () => runPreparedCliAgentOwned(context, diagnosticLifecycle);
	return await runWithCliHistoryWriter(context.cliHistoryWriter, run);
}
async function runPreparedCliAgentOwned(context, diagnosticLifecycle) {
	let executePreparedCliRun;
	const { params } = context;
	const cliFailoverContext = {
		provider: params.provider,
		model: context.modelId,
		sessionId: params.sessionId,
		lane: params.lane
	};
	const sessionBindingDisabled = context.preparedBackend.backend.sessionMode === "none";
	const preparedContextAgentMeta = isClaudeCliBackend(params.provider) && context.contextWindowInfo ? {
		contextTokens: context.contextWindowInfo.tokens,
		contextTokensSource: "resolved"
	} : {};
	const isolatedCompletion = params.isolatedCompletion === true;
	const controlOperation = params.controlOperation !== void 0;
	const turnSideEffectsDisabled = isolatedCompletion || controlOperation;
	const hookRunner = turnSideEffectsDisabled ? void 0 : getGlobalHookRunner();
	const hasLlmInputHooks = hookRunner?.hasHooks("llm_input") === true;
	const hasLlmOutputHooks = hookRunner?.hasHooks("llm_output") === true;
	const hasAgentEndHooks = hookRunner?.hasHooks("agent_end") === true;
	const hasBeforeAgentRunHooks = hookRunner?.hasHooks("before_agent_run") === true;
	const needsHookHistory = hasLlmInputHooks || hasAgentEndHooks || hasBeforeAgentRunHooks;
	let historyMessages = [];
	const promptForHooks = context.promptForHooks ?? params.prompt;
	const contextWindowFields = () => ({
		...context.contextWindowInfo?.tokens ? { contextTokenBudget: context.contextWindowInfo.tokens } : {},
		...context.contextWindowInfo?.source ? { contextWindowSource: context.contextWindowInfo.source } : {},
		...context.contextWindowInfo?.referenceTokens ? { contextWindowReferenceTokens: context.contextWindowInfo.referenceTokens } : {}
	});
	const hookContext = {
		runId: params.runId,
		jobId: params.jobId,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		workspaceDir: params.workspaceDir,
		trigger: params.trigger,
		...params.config ? { config: params.config } : {},
		...contextWindowFields(),
		...buildAgentHookContextChannelFields(params),
		...buildAgentHookContextIdentityFields({
			trigger: params.trigger,
			senderId: params.senderId,
			chatId: params.chatId,
			channelContext: params.channelContext
		})
	};
	const buildAgentEndMessages = (lastAssistant) => buildAgentHookConversationMessages({
		historyMessages,
		currentTurnMessages: [buildCliHookUserMessage(promptForHooks), ...lastAssistant ? [lastAssistant] : []]
	});
	const finishFailedAgentEndHook = (error) => runCliAgentEndHook(params, {
		event: {
			messages: buildAgentEndMessages(),
			success: false,
			error: formatErrorMessage(error),
			durationMs: Date.now() - context.started
		},
		ctx: hookContext,
		hookRunner
	});
	const finishBlockedRun = async (message, pluginId) => {
		await persistCliRunBlock(params, {
			message,
			pluginId
		});
		await runCliAgentEndHook(params, {
			event: {
				messages: buildAgentHookConversationMessages({
					historyMessages,
					currentTurnMessages: [buildCliHookUserMessage(message)]
				}),
				success: false,
				error: message,
				durationMs: Date.now() - context.started
			},
			ctx: hookContext,
			hookRunner
		});
		return buildBlockedCliRunResult({
			message,
			context,
			preparedContextAgentMeta,
			sessionBindingDisabled
		});
	};
	let deliveredMessagingSideEffect = false;
	let userTurnHandled = false;
	const executeCliAttempt = async (cliSessionIdToUse, options) => {
		const timeoutMs = options?.timeoutMs ?? params.timeoutMs;
		const forkCliSessionOnResume = options?.forkCliSessionOnResume ?? context.params.forkCliSessionOnResume;
		const cliSessionResumeAt = cliSessionIdToUse && forkCliSessionOnResume ? options?.resumeAt ?? context.params.cliSessionResumeAt ?? context.params.cliSessionBinding?.resumeCheckpointId : void 0;
		const persistCliSessionForkSuccessor = options?.onForkSuccessorPersisted && context.params.persistCliSessionForkSuccessor ? async (sessionId) => {
			await context.params.persistCliSessionForkSuccessor?.(sessionId);
			options.onForkSuccessorPersisted?.(sessionId);
		} : context.params.persistCliSessionForkSuccessor;
		const attemptContext = timeoutMs === params.timeoutMs && forkCliSessionOnResume === context.params.forkCliSessionOnResume && cliSessionResumeAt === context.params.cliSessionResumeAt && persistCliSessionForkSuccessor === context.params.persistCliSessionForkSuccessor ? context : {
			...context,
			params: {
				...context.params,
				timeoutMs,
				forkCliSessionOnResume,
				cliSessionResumeAt,
				persistCliSessionForkSuccessor
			}
		};
		diagnosticLifecycle?.setPhase("send");
		const output = await executePreparedCliRun(attemptContext, cliSessionIdToUse, diagnosticLifecycle ? { onPhase: diagnosticLifecycle.setPhase } : void 0);
		params.assertCurrent?.();
		diagnosticLifecycle?.setPhase("resolve");
		const sourceReplyMirror = resolveCliSourceReplyMirror({
			evidence: output,
			runParams: params,
			modelId: context.modelId
		});
		const assistantText = sourceReplyMirror.delivered ? sourceReplyMirror.visibleText ?? "" : output.text.trim();
		if ((!output.text.trim() || isSilentReplyPayloadText(output.text)) && resolveSourceReplyDelivery(output) === "missing" && !output.toolMediaUrls?.length && !output.yielded && !hasCompletionMessageSessionSpawn(output.acceptedSessionSpawns) && !output.terminalInterruption && resolveReplyExpectation(params) === "required" && !(isolatedCompletion && params.outputTextPolicy === "strict-visible")) {
			const process = output.diagnostics?.process;
			if (process) {
				const diagnostics = [
					`backend=${process.backendId}`,
					`reason=${process.processReason}`,
					`exitCode=${process.exitCode ?? "null"}`,
					`exitSignal=${process.exitSignal ?? "null"}`,
					`durationMs=${process.durationMs}`,
					`stdoutBytes=${process.stdoutBytes}`,
					`stdoutHash=${process.stdoutHash}`,
					`stderrBytes=${process.stderrBytes}`,
					`stderrHash=${process.stderrHash}`,
					`useResume=${process.useResume ? "true" : "false"}`
				].join(" ");
				cliBackendLog.warn(`cli empty response diagnostics: ${diagnostics}`);
			}
			const error = createCliFailoverError("CLI backend returned an empty response.", "empty_response", cliFailoverContext);
			if ((output.toolSummary?.calls ?? 0) > 0 || hasAcceptedSessionSpawn(output.acceptedSessionSpawns)) recordModelFallbackStop(error);
			throw attachCliMessagingDeliveryEvidence(error, output);
		}
		const assistantTexts = assistantText ? [assistantText] : [];
		const lastAssistant = assistantText.length > 0 ? buildCliHookAssistantMessage({
			text: assistantText,
			provider: params.provider,
			model: context.modelId,
			usage: output.usage,
			stopReason: resolveCliAssistantStopReason(output)
		}) : void 0;
		if (assistantText.length > 0 && hasLlmOutputHooks) runAgentHarnessLlmOutputHook({
			event: {
				runId: params.runId,
				sessionId: params.sessionId,
				provider: params.provider,
				model: context.modelId,
				...contextWindowFields(),
				resolvedRef: `${params.provider}/${context.modelId}`,
				assistantTexts,
				...lastAssistant ? { lastAssistant } : {},
				...output.usage ? { usage: output.usage } : {}
			},
			ctx: hookContext,
			hookRunner
		});
		return {
			output,
			assistantText,
			lastAssistant,
			sourceReplyWasDelivered: sourceReplyMirror.delivered,
			usedHistoryPrompt: cliSessionIdToUse === void 0 && context.openClawHistoryPrompt !== void 0
		};
	};
	const executeRun = async () => {
		({executePreparedCliRun} = await import("./execute.runtime.js"));
		historyMessages = needsHookHistory ? await loadCliSessionHistoryMessages(params) : [];
		const llmInputEvent = {
			runId: params.runId,
			sessionId: params.sessionId,
			provider: params.provider,
			model: context.modelId,
			systemPrompt: context.systemPrompt,
			prompt: promptForHooks,
			historyMessages,
			imagesCount: params.images?.length ?? 0
		};
		if (turnSideEffectsDisabled) {
			const reusableCliSessionId = isolatedCompletion ? void 0 : resolveCliSessionId(context.reusableCliSession);
			if (!isolatedCompletion && !reusableCliSessionId) throw new Error(`CLI backend ${context.backendResolved.id} cannot ${params.controlOperation} without a reusable native session.`);
			const { output, usedHistoryPrompt } = await executeCliAttempt(reusableCliSessionId);
			return buildCliRunResult({
				context,
				output,
				...!isolatedCompletion ? { effectiveCliSessionId: reusableCliSessionId } : {},
				bindingFlushOk: true,
				assistantTranscriptOwned: false,
				usedHistoryPrompt,
				userTurnHandled,
				sessionBindingDisabled,
				preparedContextAgentMeta
			});
		}
		await bootstrapHarnessContextEngine({
			hadSessionFile: context.hadSessionFile,
			contextEngine: context.contextEngine,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionTarget: params.sessionTarget,
			sessionFile: params.sessionFile,
			sessionManager: params.sessionManager,
			config: context.contextEngineConfig,
			contextEngineHostSupport: buildGenericCliContextEngineHostSupport({ backendId: context.backendResolved.id }),
			providerId: params.provider,
			modelId: context.modelId,
			warn: (message) => log.warn(message)
		});
		const contextEngineHistoryMessages = context.contextEngine ? await loadCliSessionContextEngineMessages(params) : [];
		const finishCliAttempt = async (result, fallbackCliSessionId) => {
			const { output, assistantText, lastAssistant, sourceReplyWasDelivered, usedHistoryPrompt } = result;
			try {
				const terminalInterruption = output.terminalInterruption;
				if (!terminalInterruption) await assertCliRuntimeBinding(context);
				const effectiveCliSessionId = output.sessionId ?? fallbackCliSessionId;
				const assistantTranscript = await persistCliAssistantTranscript({
					runParams: params,
					text: sourceReplyWasDelivered ? "" : assistantText,
					modelId: context.modelId,
					usage: output.usage,
					stopReason: resolveCliAssistantStopReason(output),
					yielded: output.yielded
				});
				await finalizeCliContextEngineTurn({
					context,
					historyMessages: context.contextEngine ? contextEngineHistoryMessages : historyMessages,
					assistantText,
					terminalAnchor: assistantTranscript.terminalAnchor,
					output
				});
				const bindingFlushOk = sessionBindingDisabled ? true : await isCliBindingFlushed(effectiveCliSessionId, params.provider, context.cwd ?? context.workspaceDir, { skipTranscriptProbe: acceptsCliLiveSession(context) });
				const interruptionError = terminalInterruption ? formatCliTerminalInterruption(terminalInterruption) : void 0;
				await runCliAgentEndHook(params, {
					event: {
						messages: buildAgentEndMessages(lastAssistant),
						success: interruptionError === void 0,
						...interruptionError ? { error: interruptionError } : {},
						durationMs: Date.now() - context.started
					},
					ctx: hookContext,
					hookRunner
				});
				return buildCliRunResult({
					context,
					output,
					effectiveCliSessionId,
					bindingFlushOk,
					assistantTranscriptOwned: assistantTranscript.owned,
					assistantTranscriptIdempotencyKey: assistantTranscript.idempotencyKey,
					usedHistoryPrompt,
					userTurnHandled,
					sessionBindingDisabled,
					preparedContextAgentMeta
				});
			} catch (error) {
				throw attachCliMessagingDeliveryEvidence(error, output);
			}
		};
		const finishDeliveredFailure = async (error) => {
			const evidence = getCliMessagingDeliveryEvidence(error);
			if (!evidence) return;
			await finishFailedAgentEndHook(error);
			deliveredMessagingSideEffect = true;
			return buildCliDeliveredFailure({
				error,
				evidence,
				context,
				preparedContextAgentMeta,
				sessionBindingDisabled,
				reusableCliSessionId: resolveCliSessionId(context.reusableCliSession)
			});
		};
		const block = await runBeforeAgentRunGate(hookRunner, {
			prompt: promptForHooks,
			systemPrompt: context.systemPrompt,
			messages: buildAgentHookConversationMessages({
				historyMessages,
				currentTurnMessages: []
			}),
			channelId: hookContext.channelId,
			accountId: params.agentAccountId,
			senderId: params.senderId ?? void 0,
			senderIsOwner: params.senderIsOwner
		}, buildAgentHookContext(hookContext));
		if (block) return finishBlockedRun(block.message, block.blockedBy);
		userTurnHandled = await persistApprovedCliUserTurnTranscript(params);
		runAgentHarnessLlmInputHook({
			event: llmInputEvent,
			ctx: hookContext,
			hookRunner
		});
		return await runCliRecovery({
			context,
			executeAttempt: executeCliAttempt,
			finishAttempt: finishCliAttempt,
			finishDeliveredFailure,
			onTerminalFailure: finishFailedAgentEndHook
		});
	};
	let runResult;
	let runError;
	let runFailed = false;
	try {
		runResult = await executeRun();
	} catch (error) {
		runFailed = true;
		runError = error;
	}
	let cleanupError;
	try {
		await runCliCleanup(params, "cli-backend-release", async () => {
			await context.preparedBackend.cleanup?.();
		});
	} catch (error) {
		cleanupError = error;
	}
	params.assertCurrent?.();
	return settleCliBackendOutcome({
		runResult,
		runError,
		runFailed,
		cleanupError,
		deliveredMessagingSideEffect,
		diagnosticLifecycle,
		failoverContext: cliFailoverContext
	});
}
//#endregion
export { runCliAgent as n, runPreparedCliAgent as r, isCliBindingFlushed as t };
