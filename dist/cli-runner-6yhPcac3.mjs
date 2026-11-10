import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { E as createDiagnosticTraceContextFromActiveScope, J as hasInternalDiagnosticEventListeners, O as freezeDiagnosticTraceContext, P as runWithDiagnosticTraceContext, c as emitTrustedDiagnosticEventWithPrivateData, s as emitTrustedDiagnosticEvent, t as areDiagnosticsEnabledForProcess, w as createChildDiagnosticTraceContext } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { C as withAgentRunLifecycleGeneration, r as captureAgentRunLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { r as resolvePersistedSessionStoreOwnerForTarget } from "./session-store-owner-iJNKNMuJ.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { g as readRunOperatorAuthority, r as bindOperatorModelExecution } from "./admitted-run-context-h1ULFETN.mjs";
import { c as isTimeoutError, o as isFailoverError, s as isSignalTimeoutReason } from "./error-Bcp4ZyOv.mjs";
import { l as isAgentRunDirectAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { a as runWithCliHistoryWriter, r as getCliHistoryWriter } from "./cli-history-boundary-B1eSXpAQ.mjs";
import { D as setReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { i as isSilentReplyPayloadText, n as SILENT_REPLY_TOKEN } from "./tokens-DHFPcfdZ.mjs";
import { n as captureSessionActorStorageOwner, o as runWithSessionActorStorage, r as getSessionActorStorageBinding, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { i as captureOwnedTranscriptWriteAssertion, u as getOwnedSessionTranscriptWriterFence, y as withSessionTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import "./config-B3oiWDlr.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
import { i as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import { n as appendExactAssistantMessageToSessionTranscript } from "./transcript-BSOdHT4f.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-BzVT3JSM.mjs";
import { n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-kYfv_bUN.mjs";
import { f as loadAuthProfileStoreForRuntimeAsync } from "./store-runtime-CwqGD12G.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-CjK4qQ1w.mjs";
import { n as truncateDiagnosticContent } from "./diagnostic-content-DwhKdbod.mjs";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-P2SGagoP.mjs";
import { r as coerceToFailoverError } from "./failover-error-Bjf0VdY2.mjs";
import { d as shouldClearInterruptedCliSessionBinding, u as shouldClearFailedCliSessionBinding } from "./cli-session-CBCjrsL6.mjs";
import { o as resolveRetryAfterMs } from "./retry-evidence-BSh9bhDe.mjs";
import { n as markAuthProfileSuccess } from "./profiles-Df1OQ7iN.mjs";
import { n as markAuthProfileFailure } from "./usage-CRucybdr.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { n as diagnosticErrorFailureKind, r as diagnosticErrorMessage, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-Dt79CD6m.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-C0CV-oid.mjs";
import { t as prepareCronRootSessionGeneration } from "./session-delivery-generation-NkiiEowi.mjs";
import { i as resolveReplyExpectation } from "./reply-completion-B5n1Cnxm.mjs";
import { i as buildGenericCliContextEngineHostSupport } from "./host-compat-DWLjZN89.mjs";
import { n as bootstrapHarnessContextEngine, o as runHarnessContextEngineMaintenance, r as finalizeHarnessContextEngineTurn } from "./context-engine-lifecycle-8o0i3Txa.mjs";
import { n as buildAgentHookContextIdentityFields, t as buildAgentHookContextChannelFields } from "./hook-agent-context-C9bjjC7S.mjs";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-BarAnCx4.mjs";
import { b as resolveSourceReplyDelivery, p as hasCompletedSourceReplyDeliveryEvidence, y as resolveExplicitFinalSourceReplyDeliveryEvidence } from "./delivery-evidence-Do1wex_l.mjs";
import { n as hasCompletionMessageSessionSpawn, t as hasAcceptedSessionSpawn } from "./accepted-session-spawn-Bo7jgCE_.mjs";
import { t as SessionManager } from "./session-manager-Mve5HWCW.mjs";
import { i as withSessionManagerWrite } from "./session-manager-write-admission-Ca7jiEvG.mjs";
import { r as runAgentEndSideEffectsAsync, t as awaitAgentEndSideEffects } from "./agent-end-side-effects-qwj0xulU.mjs";
import { t as buildAgentHookContext } from "./hook-context-Ba23fAgX.mjs";
import { a as runAgentHarnessLlmInputHook, o as runAgentHarnessLlmOutputHook } from "./lifecycle-hook-helpers-BAkeSLPH.mjs";
import { r as buildUsageWithNoCost, t as buildAssistantMessage } from "./stream-message-shared-CYuIJ_XF.mjs";
import { t as projectAgentHarnessTranscriptMessageForDisplay } from "./transcript-visibility-DiwthCmj.mjs";
import { n as runBeforeAgentRunGate, t as buildAgentRunBlockedUserMessage } from "./before-agent-run-CCn_GAdw.mjs";
import { t as subscribeAgentCommentaryDiagnostics } from "./commentary-diagnostics-hgZXAMgx.mjs";
import { n as buildHandledBeforeAgentReplyPayloads, r as runBeforeAgentReplyForTurn, t as resolveAuthProfileFailureReason } from "./auth-profile-failure-policy-LZxb6qEh.mjs";
import { n as mergeAttemptToolMediaPayloads } from "./tool-media-payloads-Bo7KGT_H.mjs";
import { t as buildEmbeddedRunPayloads } from "./payloads-BFSgp01j.mjs";
import { a as resolveCliRuntimeOwnerFingerprint, i as resolveCliRuntimeArtifactFingerprint } from "./cli-auth-epoch-DfSBzPUX.mjs";
import { n as cliBackendLog, r as formatCliBackendOutputDigest } from "./log-wVbGxCir.mjs";
import { p as hashCliReseedPrompt } from "./cli-session-history.claude-YLsvkl4E.mjs";
import { t as acceptsCliLiveSession, u as createCliFailoverError, w as runCliCleanup } from "./cli-live-session-registry-dDPsvSOh.mjs";
import { n as runCliRecovery, t as resolveCliSessionId } from "./cli-run-recovery-uVHzVd4q.mjs";
import { i as cliAssistantItemId, n as getCliMessagingDeliveryEvidence, r as projectCliMessagingDeliveryEvidence, t as attachCliMessagingDeliveryEvidence } from "./delivery-evidence-hMWnlfMU.mjs";
import { c as CliAuthProfilePreparationError, i as loadCliSessionHistoryMessages, r as loadCliSessionContextEngineMessages, s as buildAgentHookConversationMessages, u as claudeCliSessionTranscriptHasContent } from "./session-history-CjZwLj4j.mjs";
import { t as resolveDiagnosticModelResponse } from "./diagnostic-model-response-BzS-JsMB.mjs";
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
			heartbeatEventQueueSessionKey: params.heartbeatEventQueueSessionKey,
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
				finalAssistantRawText: finalText,
				providerStarted: false
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
/** Marks the history reseed this native session received, so imports can strip it. */
function buildCliReseedReceipt(params) {
	const { runParams, output } = params;
	if (!params.usedHistoryPrompt || !isClaudeCliBackend(runParams.provider) || output.finalPromptText === void 0 || !params.userTurnHandled || !runParams.sessionId) return;
	return {
		version: 1,
		promptHash: hashCliReseedPrompt(output.finalPromptText),
		localSessionId: runParams.sessionId,
		userTurnDisposition: runParams.userTurnTranscriptRecorder?.hasPersisted() ? "persisted" : "omitted"
	};
}
/** Native continuity for a returned session, keyed to this run's auth and prompt facts. */
function buildCliSessionBinding(context, sessionId, output, reseedReceipt) {
	return {
		sessionId,
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
		...reseedReceipt ? { reseedReceipt } : {},
		...context.transcriptCursor && !output.terminalInterruption ? { transcriptCursor: {
			...context.transcriptCursor,
			userEntryId: context.params.userTurnTranscriptRecorder?.getAdmissionReceipt()?.entryId
		} } : {}
	};
}
async function settleCliAuthProfile(params) {
	try {
		if (params.terminal.outcome === "success") {
			await markAuthProfileSuccess({
				store: params.store,
				profileId: params.profileId,
				provider: params.provider,
				modelId: params.terminal.modelId,
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
			modelId: params.terminal.modelId,
			retryAfterMs: resolveRetryAfterMs(formatErrorMessage(error), Date.now(), error)
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
			store: await loadAuthProfileStoreForRuntimeAsync(error.agentDir, { externalCli: externalCliDiscoveryForProviderAuth({
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
	const { retireSessionMcpRuntime } = await import("./agent-bundle-mcp-tools-DyhjgasV.mjs");
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
	let completed;
	const warnAfterCommit = (error) => log$2.warn(`CLI run ${runParams.runId} settlement failed after final reply commit: ${formatErrorMessage(error)}`);
	let outcome;
	try {
		outcome = { result: await run((result) => {
			completed = result;
		}) };
	} catch (error) {
		if (completed) warnAfterCommit(error);
		outcome = completed ? { result: completed } : { error };
	}
	let cleanupError;
	const recordCleanupError = (error) => {
		recordAgentCleanupFailure();
		cleanupError ??= error instanceof Error ? error : new Error(formatErrorMessage(error));
	};
	try {
		await runCliCleanup(runParams, "cli-backend-release", async () => {
			await context.preparedBackend.cleanup?.();
		});
	} catch (error) {
		recordCleanupError(error);
	}
	if (runParams.cleanupCliLiveSessionOnRunEnd === true) try {
		const { closeCliLiveSession } = await import("./cli-live-session-registry-DtheTb52.mjs");
		await closeCliLiveSession(context, "restart");
	} catch (error) {
		recordCleanupError(error);
	}
	try {
		await retireCliRunMcpRuntime(runParams, recordCleanupError);
	} catch (error) {
		recordCleanupError(error);
	}
	const delivered = "result" in outcome && hasCompletedSourceReplyDeliveryEvidence(outcome.result);
	if (cleanupError) {
		if (completed || "error" in outcome || delivered) log$2.warn(`cli run cleanup failed after completion: ${formatErrorMessage(cleanupError)}`);
		else diagnosticLifecycle?.setPhase("cleanup");
	}
	try {
		runParams.assertCurrent?.();
		if (context.effectiveAuthProfileId && context.authProfileStore) {
			const profileId = context.effectiveAuthProfileId;
			const authProfileStore = context.authProfileStore;
			const terminal = "error" in outcome ? {
				outcome: "failure",
				error: outcome.error,
				config: runParams.config,
				runId: runParams.runId,
				modelId: context.modelId
			} : outcome.result.meta.executionTrace?.attempts?.at(-1)?.result === "success" ? {
				outcome: "success",
				modelId: context.modelId
			} : void 0;
			if (terminal) await settleCliAuthProfile({
				store: authProfileStore,
				profileId,
				provider: authProfileStore.profiles[profileId]?.provider ?? runParams.provider,
				agentDir: context.agentDir,
				terminal
			});
		}
	} catch (error) {
		if (!completed) throw error;
		warnAfterCommit(error);
	}
	if ("error" in outcome) throw outcome.error instanceof Error ? outcome.error : new Error(formatErrorMessage(outcome.error));
	if (cleanupError && !completed && !delivered) throw cleanupError;
	return outcome.result;
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
				...sessionBindingDisabled || shouldClearFailedCliSessionBinding({
					error,
					binding: reusableCliSessionId ? { sessionId: reusableCliSessionId } : void 0,
					bindingReplacedDuringRun: params.bindingReplacedDuringRun
				}) ? { clearCliSessionBinding: true } : {}
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
	const rawFinalText = output.rawFinalText?.trim();
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
	const createdReseedReceipt = persistedCliSessionId ? buildCliReseedReceipt({
		runParams,
		output,
		usedHistoryPrompt,
		userTurnHandled
	}) : void 0;
	const preservedReseedReceipt = runParams.cliSessionBinding && persistedCliSessionId === runParams.cliSessionBinding.sessionId ? runParams.cliSessionBinding.reseedReceipt : void 0;
	const reseedReceipt = createdReseedReceipt ?? preservedReseedReceipt;
	const agentSessionId = terminalInterruption || unflushed ? "" : sessionBindingDisabled ? runParams.sessionId ?? "" : effectiveCliSessionId ?? runParams.sessionId ?? "";
	const yielded = output.yielded === true;
	const stopReason = terminalInterruption?.reason ?? (yielded ? "end_turn" : "completed");
	try {
		if (!terminalInterruption && runParams.onSuccessfulAuthBinding) {
			runParams.assertCurrent?.();
			runParams.onSuccessfulAuthBinding({
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
		}
	} catch (error) {
		if (!assistantTranscriptIdempotencyKey || terminalInterruption || yielded) throw error;
		log$2.warn(`CLI run ${runParams.runId} auth binding notification failed after final reply commit: ${formatErrorMessage(error)}`);
	}
	return {
		payloads: payloadsWithToolMedia,
		meta: {
			durationMs: Date.now() - context.started,
			...output.finalPromptText ? { finalPromptText: output.finalPromptText } : {},
			...finalAssistantVisibleText ? { finalAssistantVisibleText } : {},
			...rawText ? { finalAssistantRawText: rawText } : {},
			...rawFinalText !== void 0 && rawFinalText !== rawText ? { finalAssistantMessageRawText: rawFinalText } : {},
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
				...persistedCliSessionId ? { cliSessionBinding: buildCliSessionBinding(context, persistedCliSessionId, output, reseedReceipt) } : {},
				...cliSessionBindingCleared ? { clearCliSessionBinding: true } : {}
			}
		},
		...projectCliMessagingDeliveryEvidence(output),
		...output.acceptedSessionSpawns?.length ? { acceptedSessionSpawns: output.acceptedSessionSpawns } : {}
	};
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
	await runAgentEndSideEffectsAsync(hookParams);
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
	const idempotencyKey = cliAssistantItemId(runParams.runId);
	let committed = false;
	try {
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
			onMessageCommitted: () => {
				committed = true;
			},
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
		return committed ? {
			owned: true,
			idempotencyKey
		} : { owned: false };
	}
}
async function notifyCliUserMessagePersisted(params, message, context) {
	try {
		await Promise.resolve(params.onUserMessagePersisted?.(message));
	} catch (err) {
		log$1.warn(`${context} notification failed: ${formatErrorMessage(err)}`);
	}
}
async function prepareCliBlockFallbackWrite(target, expectedEntry, committedSource) {
	const identity = { ...target };
	const memory = getSessionActorStorageBinding(identity);
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
	if (memory) {
		const cliWriter = getCliHistoryWriter({
			...identity,
			storePath: memory.path
		});
		const assertCurrent = () => {
			assertOwnedWrite();
			cliWriter?.assertCurrent();
			const current = memory.actor.snapshot(memory.authority)?.entry;
			if (!current || current.sessionId !== identity.sessionId || current.lifecycleRevision !== expectedEntry.lifecycleRevision || current.activeWriterRunId !== expectedEntry.activeWriterRunId || fence?.expectedLifecycleRevision !== void 0 && current.lifecycleRevision !== fence.expectedLifecycleRevision || fence?.expectedWriterRunId !== void 0 && current.activeWriterRunId !== fence.expectedWriterRunId) throw new SessionTranscriptWriterClaimReboundError();
		};
		return {
			readScope: {
				...identity,
				storePath: memory.path
			},
			assertCurrent,
			release() {}
		};
	}
	const retainWrite = (source, captured) => {
		const { databaseIdentity } = source;
		if (typeof databaseIdentity !== "string") throw new SessionTranscriptWriterClaimReboundError();
		const { lifecycleRevision, activeWriterRunId } = expectedEntry;
		const matches = (current) => current?.sessionId === identity.sessionId && current.lifecycleRevision === lifecycleRevision && current.activeWriterRunId === activeWriterRunId && (fence?.expectedLifecycleRevision === void 0 || current.lifecycleRevision === fence.expectedLifecycleRevision) && (fence?.expectedWriterRunId === void 0 || current.activeWriterRunId === fence.expectedWriterRunId);
		if (!matches(captured)) throw new SessionTranscriptWriterClaimReboundError();
		const retained = retainPreparedSessionEntryPredicate({
			databaseIdentity: `file:${databaseIdentity}`,
			sessionKey: resolveSqliteSessionKey(identity.sessionKey, identity.agentId),
			entry: captured,
			matches: (_before, current) => matches(current)
		});
		const cliWriter = getCliHistoryWriter({
			...identity,
			storePath: source.path
		});
		return {
			readScope,
			assertCurrent() {
				assertOwnedWrite();
				cliWriter?.assertCurrent();
				if (!retained.isCurrent()) throw new SessionTranscriptWriterClaimReboundError();
			},
			release: retained.release
		};
	};
	if (committedSource) return retainWrite(committedSource, expectedEntry);
	let write;
	try {
		return await withSessionEntryReadOnlyInWorker(readScope, assertOwnedWrite, async (read, owner) => {
			if (!read.ok) throw read.error;
			if (!read.value || !owner.source) throw new SessionTranscriptWriterClaimReboundError();
			write = retainWrite(owner.source, read.value);
			return write;
		});
	} catch (error) {
		write?.release();
		throw error;
	}
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
			const assertCallerCurrent = () => {
				params.abortSignal?.throwIfAborted();
				params.assertCurrent?.();
			};
			const memorySource = captureSessionActorStorageOwner({
				sessionKey,
				agentId,
				storePath: targetStorePath ?? params.storePath
			}, {
				assertCurrent: assertCallerCurrent,
				authorize() {}
			});
			const sessionTarget = { ...params.sessionTarget ?? {
				agentId,
				sessionId: params.sessionId,
				sessionKey,
				storePath: params.storePath ?? memorySource?.path ?? resolveSessionStorePathCore(params.config?.session?.store, { agentId })
			} };
			const memory = memorySource ? await acquireSessionActorStorage(sessionTarget, {
				create: !params.sessionEntry,
				lifetime: {
					assertCurrent: assertCallerCurrent,
					assertReadable: assertCallerCurrent
				},
				authority: {
					assertCurrent: assertCallerCurrent,
					authorize() {}
				}
			}) : void 0;
			if (memorySource && !memory) return;
			const persist = async () => {
				try {
					var _usingCtx$1 = _usingCtx();
					let committedSource;
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
						skipMaintenance: true,
						onCommittedSource: (source) => {
							committedSource = source;
						}
					});
					if (persistedEntry?.sessionId !== sessionTarget.sessionId) return;
					const write = await prepareCliBlockFallbackWrite(sessionTarget, persistedEntry, committedSource);
					_usingCtx$1.u({ [Symbol.dispose]: write.release });
					if (!memory) {
						const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
						await restoreSessionColdTranscript(write.readScope, write.assertCurrent);
					}
					await withSessionTranscriptWriteAssertion(write.readScope, write.assertCurrent, async () => {
						const manager = await SessionManager.openAsync(write.readScope);
						write.assertCurrent();
						await manager.appendMessageAsync(redactedUserMessage);
					});
				} catch (_) {
					_usingCtx$1.e = _;
				} finally {
					_usingCtx$1.d();
				}
			};
			try {
				await (memory ? runWithSessionActorStorage(memory, persist) : persist());
			} finally {
				await memory?.actor.release();
			}
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
	const trigger = params.isolatedCompletionPurpose ?? params.trigger;
	return {
		runId: params.runId,
		...params.agentId ? { agentId: params.agentId } : {},
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		provider: params.modelProvider ?? "anthropic",
		...params.model ? { model: params.model } : {},
		...trigger ? { trigger } : {},
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
	const contentCapturePolicy = resolveDiagnosticModelContentCapturePolicy(getRuntimeConfigSnapshot());
	let capturedContent;
	const hasCapturedContent = () => capturedContent !== void 0 && Object.keys(capturedContent).length > 0;
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
		},
		publishResultContent: (result) => {
			if (!contentCapturePolicy.outputMessages) return;
			lifecycle.publishCapturedContent({ finalResponse: resolveDiagnosticModelResponse(result) });
		},
		publishCapturedContent: (content) => {
			capturedContent = {
				...capturedContent,
				...content.userPrompt !== void 0 && contentCapturePolicy.inputMessages ? { userPrompt: truncateDiagnosticContent(content.userPrompt) } : {},
				...content.finalResponse !== void 0 && contentCapturePolicy.outputMessages ? { finalResponse: truncateDiagnosticContent(content.finalResponse) } : {}
			};
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
		const runCompletedPrivateData = runErrorMessage || hasCapturedContent() ? {
			...runErrorMessage ? { errorMessage: runErrorMessage } : {},
			...hasCapturedContent() ? { messageContent: capturedContent } : {}
		} : void 0;
		emitTrustedDiagnosticEventWithPrivateData({
			type: "run.completed",
			...runBase,
			durationMs: Date.now() - startedAt,
			outcome: runOutcome,
			...runOutcome === "blocked" ? { blockedBy: "before_agent_run" } : {},
			...runOutcome === "error" && result.meta.error ? { errorCategory: result.meta.error.kind } : {}
		}, runCompletedPrivateData);
		emitTrustedDiagnosticEventWithPrivateData({
			type: "harness.run.completed",
			...harnessBase,
			durationMs: Date.now() - startedAt,
			outcome: result.meta.timeoutPhase !== void 0 ? "timed_out" : runOutcome === "blocked" ? "error" : runOutcome,
			...typeof result.meta.yielded === "boolean" ? { yieldDetected: result.meta.yielded } : {}
		}, resultErrorMessage && (runOutcome === "error" || runOutcome === "blocked") || hasCapturedContent() ? {
			...resultErrorMessage && (runOutcome === "error" || runOutcome === "blocked") ? { errorMessage: resultErrorMessage } : {},
			...hasCapturedContent() ? { harnessContent: capturedContent } : {}
		} : void 0);
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
		}, {
			...errorMessage ? { errorMessage } : {},
			...hasCapturedContent() ? { messageContent: capturedContent } : {}
		});
		if (harnessOutcome === "error") emitTrustedDiagnosticEventWithPrivateData({
			type: "harness.run.error",
			...harnessBase,
			durationMs: Date.now() - startedAt,
			phase,
			errorCategory: diagnosticErrorCategory(error)
		}, {
			...errorMessage ? { errorMessage } : {},
			...hasCapturedContent() ? { harnessContent: capturedContent } : {}
		});
		else emitTrustedDiagnosticEventWithPrivateData({
			type: "harness.run.completed",
			...harnessBase,
			durationMs: Date.now() - startedAt,
			outcome: harnessOutcome
		}, hasCapturedContent() ? { harnessContent: capturedContent } : void 0);
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
	let modelExecution;
	const generationAbortController = new AbortController();
	let generation;
	const assertCurrent = () => {
		params.abortSignal?.throwIfAborted();
		params.assertCurrent?.();
		modelExecution?.assertCurrent();
		generation?.assertCurrent();
	};
	assertCurrent();
	try {
		const target = params.sessionTarget;
		generation = target && !params.sessionManager && !params.isolatedCompletion ? await prepareCronRootSessionGeneration({
			...target,
			sessionKey: params.sessionKey ?? target.sessionKey,
			sessionId: params.sessionId,
			lifecycleRevision: params.expectedLifecycleRevision ?? params.sessionEntry?.lifecycleRevision
		}, (reason) => generationAbortController.abort(reason)) : void 0;
		const hookResult = await runCliBeforeAgentReply(params, assertCurrent);
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
			assertCurrent
		} : {
			...params,
			assertCurrent
		};
		const { prepareCliRunContext } = await import("./prepare.runtime.js");
		let context;
		try {
			context = await prepareCliRunContext(runParams);
		} catch (error) {
			await settleCliPreparationError(error, runParams);
			throw error;
		}
		diagnosticLifecycle?.setExecutionContext(context.params);
		diagnosticLifecycle?.publishCapturedContent({ userPrompt: context.params.prompt });
		return await runPreparedCliAgent(context, diagnosticLifecycle);
	} finally {
		generation?.release();
		modelExecution?.release();
	}
}
async function runPreparedCliAgent(context, diagnosticLifecycle) {
	return await settlePreparedCliRun({
		context,
		diagnosticLifecycle,
		run: (complete) => runWithCliHistoryWriter(context.cliHistoryWriter, () => runPreparedCliAgentOwned(context, complete, diagnosticLifecycle))
	});
}
async function runPreparedCliAgentOwned(context, complete, diagnosticLifecycle) {
	let executePreparedCliRun;
	const { params } = context;
	const cliFailoverContext = {
		provider: params.provider,
		model: context.modelId,
		sessionId: params.sessionId,
		lane: params.lane
	};
	const sessionBindingDisabled = context.preparedBackend.backend.sessionMode === "none";
	const resultContext = {
		context,
		preparedContextAgentMeta: isClaudeCliBackend(params.provider) && context.contextWindowInfo ? {
			contextTokens: context.contextWindowInfo.tokens,
			contextTokensSource: "resolved"
		} : {},
		sessionBindingDisabled
	};
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
	const finishAgentEndHook = (messages, error) => runCliAgentEndHook(params, {
		event: {
			messages,
			success: error === void 0,
			...error !== void 0 ? { error } : {},
			durationMs: Date.now() - context.started
		},
		ctx: hookContext,
		hookRunner
	});
	const finishFailedAgentEndHook = (error) => finishAgentEndHook(buildAgentEndMessages(), formatErrorMessage(error));
	const finishBlockedRun = async (message, pluginId) => {
		await persistCliRunBlock(params, {
			message,
			pluginId
		});
		await finishAgentEndHook(buildAgentHookConversationMessages({
			historyMessages,
			currentTurnMessages: [buildCliHookUserMessage(message)]
		}), message);
		return buildBlockedCliRunResult({
			...resultContext,
			message
		});
	};
	let userTurnHandled = false;
	const persistStoppedFirstCliSession = async (error, output, cliSessionIdToUse) => {
		const sessionId = output.sessionId;
		if (!params.persistStoppedFirstCliSession || !output.terminalInterruption || !sessionId || cliSessionIdToUse || resolveCliSessionId(context.reusableCliSession) || sessionBindingDisabled || !isAgentRunDirectAbortReason(error) || !isClaudeCliBackend(params.provider) || !await isCliBindingFlushed(sessionId, params.provider, context.cwd ?? context.workspaceDir)) return;
		try {
			const reseedReceipt = buildCliReseedReceipt({
				runParams: params,
				output,
				usedHistoryPrompt: context.openClawHistoryPrompt !== void 0,
				userTurnHandled
			});
			await params.persistStoppedFirstCliSession(buildCliSessionBinding(context, sessionId, output, reseedReceipt));
		} catch (persistError) {
			log.warn(`CLI run ${params.runId} could not keep its stopped first session: ${formatErrorMessage(persistError)}`);
		}
	};
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
		const output = await executePreparedCliRun(attemptContext, cliSessionIdToUse, diagnosticLifecycle ? {
			onPhase: diagnosticLifecycle.setPhase,
			onPromptPrepared: (prompt) => diagnosticLifecycle.publishCapturedContent({ userPrompt: prompt })
		} : void 0);
		try {
			params.assertCurrent?.();
		} catch (error) {
			await persistStoppedFirstCliSession(error, output, cliSessionIdToUse);
			throw error;
		}
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
				...resultContext,
				output,
				...!isolatedCompletion ? { effectiveCliSessionId: reusableCliSessionId } : {},
				bindingFlushOk: true,
				assistantTranscriptOwned: false,
				usedHistoryPrompt,
				userTurnHandled
			});
		}
		await bootstrapHarnessContextEngine({
			admittedRunContext: params.admittedRunContext,
			preparedRunAdmission: params.preparedRunAdmission,
			hadSessionFile: context.hadSessionFile,
			contextEngine: context.contextEngine,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionTarget: params.sessionTarget,
			sessionFile: params.sessionFile,
			sessionManager: params.sessionManager,
			transcriptReadFence: params.sessionManager ? void 0 : params.userTurnTranscriptRecorder?.getAdmissionReceipt(),
			config: context.contextEngineConfig,
			contextEngineHostSupport: buildGenericCliContextEngineHostSupport({ backendId: context.backendResolved.id }),
			providerId: params.provider,
			modelId: context.modelId,
			warn: (message) => log.warn(message)
		});
		const contextEngineHistoryMessages = context.contextEngine ? await loadCliSessionContextEngineMessages(params) : [];
		const finishCliAttempt = async (result, fallbackCliSessionId) => {
			const { output, assistantText, lastAssistant, sourceReplyWasDelivered, usedHistoryPrompt } = result;
			let completed;
			try {
				const terminalInterruption = output.terminalInterruption;
				if (!terminalInterruption) await assertCliRuntimeBinding(context);
				const effectiveCliSessionId = output.sessionId ?? fallbackCliSessionId;
				const bindingFlushOk = sessionBindingDisabled ? true : await isCliBindingFlushed(effectiveCliSessionId, params.provider, context.cwd ?? context.workspaceDir, { skipTranscriptProbe: acceptsCliLiveSession(context) });
				const assistantTranscript = await persistCliAssistantTranscript({
					runParams: params,
					text: sourceReplyWasDelivered ? "" : assistantText,
					modelId: context.modelId,
					usage: output.usage,
					stopReason: resolveCliAssistantStopReason(output),
					yielded: output.yielded
				});
				const runResult = buildCliRunResult({
					...resultContext,
					output,
					effectiveCliSessionId,
					bindingFlushOk,
					assistantTranscriptOwned: assistantTranscript.owned,
					assistantTranscriptIdempotencyKey: assistantTranscript.idempotencyKey,
					usedHistoryPrompt,
					userTurnHandled
				});
				if (!terminalInterruption && !output.yielded && assistantTranscript.idempotencyKey) {
					completed = runResult;
					complete(runResult);
				}
				await finalizeCliContextEngineTurn({
					context,
					historyMessages: context.contextEngine ? contextEngineHistoryMessages : historyMessages,
					assistantText,
					terminalAnchor: assistantTranscript.terminalAnchor,
					output
				});
				const interruptionError = terminalInterruption ? formatCliTerminalInterruption(terminalInterruption) : void 0;
				await finishAgentEndHook(buildAgentEndMessages(lastAssistant), interruptionError);
				return runResult;
			} catch (error) {
				if (completed) {
					log.warn(`CLI run ${params.runId} finalization failed after final reply commit: ${formatErrorMessage(error)}`);
					return completed;
				}
				throw attachCliMessagingDeliveryEvidence(error, output);
			}
		};
		const finishDeliveredFailure = async (error, bindingReplacedDuringRun) => {
			const evidence = getCliMessagingDeliveryEvidence(error);
			if (!evidence) return;
			await finishFailedAgentEndHook(error);
			return buildCliDeliveredFailure({
				...resultContext,
				error,
				evidence,
				reusableCliSessionId: resolveCliSessionId(context.reusableCliSession),
				bindingReplacedDuringRun
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
	try {
		const result = await executeRun();
		diagnosticLifecycle?.publishResultContent(result);
		return result;
	} catch (error) {
		throw coerceToFailoverError(error, cliFailoverContext) ?? error;
	}
}
//#endregion
export { runCliAgent as n, runPreparedCliAgent as r, isCliBindingFlushed as t };
