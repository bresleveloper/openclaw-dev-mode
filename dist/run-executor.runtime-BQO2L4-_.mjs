import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { S as isCronSessionKey } from "./session-key-C09ow4h0.mjs";
import { y as registerAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { i as prepareModelRunCapabilities, n as findModelInCatalog, r as modelSupportsInput } from "./model-catalog-lookup-BWpJFHtW.mjs";
import { d as normalizeVerboseLevel } from "./thinking.shared-Jy32Vp-O.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { i as resolveThinkingSelectionCore, n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-CZnoMXD6.mjs";
import { t as isCliProvider } from "./model-selection-cli-CtTygCpm.mjs";
import { t as AgentHarnessPreflightError } from "./errors-Bd6GQRkh.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-CRE_cwP5.mjs";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-B5N-I0ib.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-rcNVygEk.mjs";
import { r as needsThinkHydration, s as resolveEffectiveAgentRuntime } from "./thinking-runtime-DsaB5fLF.mjs";
import { s as resolveCronScheduledToolPolicy } from "./scheduled-tool-policy-CYthJ0r4.mjs";
import { i as resolveCronAuthenticatedChannelRequester } from "./tools-allow-provenance-Dh4Ut701.mjs";
import { o as getGeneratedMediaTaskIdsForSessionKey, s as hasNewGeneratedMediaTaskForSessionKey } from "./media-generation-activity-JkwDNUkC.mjs";
import { r as resolveGroupToolPolicy } from "./agent-tools.policy-XJMKA8K7.mjs";
import { i as LiveSessionModelSwitchError } from "./model-fallback-runner-NPYj5LWB.mjs";
import { n as assertCliSessionBindingResultCommitAllowed, t as applyCliSessionBindingResult } from "./cli-session-BGS0cWwl.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-BXyGP6P6.mjs";
import { i as buildGenericCliContextEngineHostSupport } from "./host-compat-xESS3bi6.mjs";
import { n as resolveSessionStableReplyMode } from "./session-stable-reply-mode-C-dzL3sY.mjs";
import { t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-BMox_Fvt.mjs";
import { n as resolveScheduledToolPolicyContext, t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-CR7_5ABm.mjs";
import { t as resolveFastModeState } from "./fast-mode-CdiysUl0.mjs";
import { r as resolveCronAgentLane } from "./lanes-BJoXx6GG.mjs";
import { b as createDeferredEmbeddedRunLifecycleManager } from "./builtin-openclaw-DPSlekTi.mjs";
import { o as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-D83uJB7U.mjs";
import { o as withLocalSessionPlacementTurnSettlement } from "./session-placement-admission-BtajgBsg.mjs";
import { n as resolveAgentLifecycleTerminalMetadata } from "./agent-lifecycle-terminal-COwG2fZv.mjs";
import { n as resolveCliRuntimeToolsAllow } from "./tool-policy-Bp4DeIrb.mjs";
import { n as resolveCliExecutionAuthProfileId, t as cliBackendAcceptsAuthProfileForwarding } from "./cli-execution-auth-BLOPu2y0.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DVuJ106z.mjs";
import { t as runEmbeddedAgentEntry } from "./run-entry-vkZ5-1OB.mjs";
import { n as registerCronRunExecSource } from "./cron-run-exec-source-BYare2tS.mjs";
import { n as rootedAgentRunParams } from "./rooted-run-params-CNVei1_1.mjs";
import { a as settleCliSessionResult } from "./cli-session-store-CDlpTLDs.mjs";
import { n as assertCronExecutionRootRuntime } from "./execution-root-runtime-BEhlVxn3.mjs";
import { d as resolveCurrentChannelTarget, i as runCliAgent, r as getCliSessionBinding, s as finalizeCronPromptForResolvedTools, t as resolveCronFallbacksOverride, u as resolveCronChannelOutputPolicy } from "./run-fallback-policy-CHxzFJpv.mjs";
import { c as setCronSessionAgentHarnessId, l as setCronSessionRuntimeModel, m as resolveCronPayloadOutcome, u as syncCronSessionLiveSelection } from "./run-session-state-CXfMR1pf.mjs";
import { n as isLikelyInterimCronMessage } from "./subagent-followup-hints-BBePQpRw.mjs";
import { t as prepareCronRunAdmission } from "./run-admission-CuVbrv2v.mjs";
import { createHash } from "node:crypto";
//#region src/cron/isolated-agent/fork-cron-cli-binding-facts.ts
/** Binding facts for a cron CLI run: session-stable when it reuses a chat or other session. */
function resolveForkCronCliSessionBindingFacts(run, perRunFacts) {
	if (!(!run.usesDetachedRunSession && run.runSessionKey === run.agentSessionKey && !isCronSessionKey(run.agentSessionKey))) return perRunFacts;
	return {
		extraSystemPromptStatic: perRunFacts.extraSystemPromptStatic,
		sourceReplyDeliveryMode: resolveSessionStableReplyMode({
			cfg: run.cfgWithAgentDefaults,
			ctx: { CommandAuthorized: false },
			sessionEntry: run.cronSession.sessionEntry,
			sessionAgentId: run.agentId,
			sessionKey: run.agentSessionKey
		})
	};
}
//#endregion
//#region src/cron/isolated-agent/prompt-cache-key.ts
function resolveIsolatedCronPromptCacheKey(params) {
	if (params.job.sessionTarget !== "isolated") return;
	const material = JSON.stringify({
		version: 1,
		kind: "isolated-cron",
		jobId: params.job.id,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		provider: params.provider,
		model: params.model
	});
	return `openclaw-cron-${createHash("sha256").update(material).digest("hex").slice(0, 32)}`;
}
//#endregion
//#region src/cron/isolated-agent/run-admission.ts
function assertCronRuntimeAuthorityCandidate(params) {
	const authority = params.authority;
	if (!authority) return;
	if (params.candidateRuntime !== authority.runtimeId || params.cliExecution) throw new AgentHarnessPreflightError(`This automation carries ${authority.namespace} authority captured for the ${authority.runtimeId} runtime, but the selected execution runtime is ${params.candidateRuntime}. Restore that runtime and auth profile, or explicitly replace the automation's toolsAllow cap from an authenticated creator turn.`);
}
//#endregion
//#region src/cron/isolated-agent/run-candidate-runtime.ts
/** Shares candidate execution policy between harness preparation and dispatch. */
function createCronCandidateExecutionResolver(params) {
	return (provider, model, sessionRuntimeOverride) => {
		const executionProvider = sessionRuntimeOverride ? isCliProvider(sessionRuntimeOverride, params.cfgWithAgentDefaults) ? sessionRuntimeOverride : provider : resolveCliRuntimeExecutionProvider({
			provider,
			cfg: params.cfgWithAgentDefaults,
			agentId: params.agentId,
			modelId: model
		}) ?? provider;
		const runtime = sessionRuntimeOverride ?? resolveEffectiveAgentRuntime({
			cfg: params.cfgWithAgentDefaults,
			provider,
			modelId: model,
			agentId: params.agentId,
			sessionKey: params.runSessionKey,
			sessionEntry: params.cronSession.sessionEntry
		});
		return {
			sessionRuntimeOverride,
			executionProvider,
			cliExecution: isCliProvider(executionProvider, params.cfgWithAgentDefaults),
			runtime
		};
	};
}
//#endregion
//#region src/cron/isolated-agent/run-executor.ts
/** Executes isolated cron prompts with model fallbacks and interim-ack retries. */
const cronEmbeddedRuntimeLoader = createLazyImportLoader(() => import("./run-embedded.runtime.js"));
const cronSubagentRegistryRuntimeLoader = createLazyImportLoader(() => import("./run-subagent-registry.runtime.js"));
function hasCliSessionReuseMetadata(binding) {
	return Object.entries(binding).some(([key, value]) => key !== "sessionId" && value !== void 0);
}
const COMMAND_STYLE_CRON_PREFIX = /^(?:(?:[A-Z_][A-Z0-9_]*=\S+\s+)+)?(?:cd\s+\S+|(?:\.{1,2}|~)?\/\S+|[A-Za-z]:[\\/]\S+|(?:bash|bun|cargo|deno|docker|gh|git|go|make|node|npm|npx|pnpm|python|python3|ruby|sh|tsx|uv|zsh)\b)/u;
/** Detects single-line cron prompts that look like shell commands or command invocations. */
function isCommandStyleCronMessage(message) {
	return !message.trim().includes("\n") && COMMAND_STYLE_CRON_PREFIX.test(message.trim());
}
/** Creates the model-fallback executor for one isolated cron prompt run. */
function createCronPromptExecutor(params) {
	const sessionFile = params.runSessionKey;
	const cronFallbacksOverride = params.modelFallbacksOverride ?? resolveCronFallbacksOverride({
		cfg: params.cfg,
		job: params.job,
		agentId: params.agentId,
		useSubagentFallbacks: params.useSubagentFallbacks,
		inheritDefaultFallbacksForAgentStringModel: params.inheritDefaultFallbacksForAgentStringModel
	});
	const fastModeStartedAtMs = Date.now();
	const fastModeAutoProgressState = {
		offAnnounced: false,
		resetAnnounced: false
	};
	let bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(params.cronSession.sessionEntry.systemPromptReport);
	const bootstrapContextMode = params.agentPayload?.lightContext ?? isCommandStyleCronMessage(params.agentPayload?.message ?? "") ? "lightweight" : void 0;
	const scheduledToolPolicy = resolveScheduledToolPolicyContext({
		toolsAllow: params.agentPayload?.toolsAllow,
		scheduledToolPolicy: resolveCronScheduledToolPolicy({
			toolsAllow: params.agentPayload?.toolsAllow,
			scheduledToolPolicy: params.job.scheduledToolPolicy,
			owner: params.job.owner
		}),
		callerOrigin: params.job.toolsAllowProvenance?.callerOrigin,
		execTarget: params.job.toolsAllowExecTarget
	});
	const { sourceDelivery, runId } = params;
	const sourceReplyDeliveryMode = sourceDelivery.sourceReplyDeliveryMode;
	const messageChannel = sourceDelivery.target.channel ?? params.resolvedDelivery.channel;
	if (scheduledToolPolicy?.mode === "account") {
		const callerContext = resolveScheduledToolCallerContext({ scheduledToolPolicy });
		resolveGroupToolPolicy({
			config: params.cfgWithAgentDefaults,
			sessionKey: scheduledToolPolicy.ownerSessionKey,
			messageProvider: callerContext.local ? messageChannel : callerContext.channel ?? void 0,
			accountId: scheduledToolPolicy.ownerAccountId,
			requireConfiguredAccount: true,
			senderPolicyMode: "never"
		});
	}
	const finalizePromptForResolvedTools = ({ prompt, messageToolAvailable }) => finalizeCronPromptForResolvedTools({
		prompt,
		messageToolAvailable,
		deliveryRequested: params.deliveryRequested,
		resolvedDelivery: params.resolvedDelivery,
		sourceDelivery,
		messageToolFormatPrompt: params.messageToolFormatPrompt
	});
	let pendingUserTurn;
	let attemptMediaTaskIds = /* @__PURE__ */ new Set();
	let thinkingCatalog = params.thinkingCatalog;
	let hydratedThinkingSelection;
	const currentAttemptCommittedMedia = () => hasNewGeneratedMediaTaskForSessionKey(params.runSessionKey, attemptMediaTaskIds);
	const resolveCandidateExecution = createCronCandidateExecutionResolver(params);
	return async (promptText, runStartedAt) => {
		params.lifecycle.beginAttempt();
		const sessionTarget = {
			agentId: params.agentId,
			sessionId: params.cronSession.sessionEntry.sessionId,
			sessionKey: params.runSessionKey,
			storePath: params.cronSession.storePath
		};
		const userTurnTranscriptRecorder = pendingUserTurn?.promptText === promptText ? pendingUserTurn.recorder : createUserTurnTranscriptRecorder({
			input: {
				text: promptText,
				provenance: params.inputProvenance
			},
			target: {
				...sessionTarget,
				sessionEntry: params.cronSession.sessionEntry,
				cwd: params.workspaceDir,
				config: params.cfgWithAgentDefaults
			},
			beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
			errorContext: "cron user turn transcript"
		});
		pendingUserTurn = {
			promptText,
			recorder: userTurnTranscriptRecorder
		};
		const { preparedRunAdmission, messageActionTurnCapability, close: closePromptAdmission } = prepareCronRunAdmission({
			admissionSource: params.admissionSource,
			deliveryAttemptFence: params.deliveryAttemptFence,
			cfg: params.cfgWithAgentDefaults,
			agentId: params.agentId,
			runId,
			sessionId: params.cronSession.sessionEntry.sessionId,
			sessionKey: params.runSessionKey,
			jobId: params.job.id,
			channelRequester: resolveCronAuthenticatedChannelRequester(params.job),
			toolsAllow: params.agentPayload?.toolsAllow,
			scheduledToolPolicy,
			executionIdentity: params.executionIdentity
		});
		const onExecutionStarted = async (info) => {
			params.onExecutionStarted?.(info);
			await params.executionIdentity?.onExecutionStarted?.();
		};
		let unregisterCronRunExecSource = () => {};
		try {
			unregisterCronRunExecSource = registerCronRunExecSource(runId, {
				agentId: params.agentId,
				jobId: params.job.id,
				jobConfigRevision: resolveCronJobConfigRevision(params.job),
				jobName: params.job.name
			});
		} catch {}
		const fallbackResult = await runEmbeddedAgentEntry({
			preparedRunAdmission,
			selection: {
				cfg: params.cfgWithAgentDefaults,
				provider: params.liveSelection.provider,
				model: params.liveSelection.model,
				requestedRouteResolution: "resolved",
				agentDir: params.agentDir,
				userLockedAuthProfileId: params.liveSelection.authProfileIdSource === "user" ? params.liveSelection.authProfileId : void 0,
				fallbacksOverride: cronFallbacksOverride
			},
			identity: {
				runId,
				sessionId: params.cronSession.sessionEntry.sessionId,
				lane: resolveCronAgentLane(params.lane),
				agentId: params.agentId,
				sessionKey: params.runSessionKey
			},
			harness: {
				workspaceDir: params.executionRoot ?? params.workspaceDir,
				sessionKey: params.runSessionKey,
				preparation: { kind: "direct" },
				resolveRuntimeOverride: (provider) => resolveSessionRuntimeOverrideForProvider({
					provider,
					entry: params.cronSession.sessionEntry,
					cfg: params.cfgWithAgentDefaults
				}),
				resolveContextEngineHost: (provider, model, runtimeOverride) => {
					const { executionProvider, cliExecution } = resolveCandidateExecution(provider, model, runtimeOverride);
					if (!cliExecution) return;
					const backend = resolveCliBackendConfig(executionProvider, params.cfgWithAgentDefaults, { agentId: params.agentId });
					return buildGenericCliContextEngineHostSupport({
						backendId: backend?.id ?? executionProvider,
						...backend?.contextEngineHostCapabilities ? { capabilities: backend.contextEngineHostCapabilities } : {}
					});
				}
			},
			behavior: {
				kind: "command-rpc",
				hasCommittedSideEffect: currentAttemptCommittedMedia
			},
			sessionOverride: { kind: "preserve" },
			abortSignal: params.abortSignal,
			runCandidate: async (providerOverride, modelOverride, runOptions) => {
				params.lifecycle.beginAttempt();
				const notifyExecutionStarted = (info) => onExecutionStarted({
					...info,
					...runOptions.isFallbackRetry ? { isFallback: true } : {},
					provider: providerOverride,
					model: modelOverride
				});
				const notifyExecutionPhase = (info) => params.onExecutionPhase?.({
					...info,
					provider: providerOverride,
					model: modelOverride
				});
				attemptMediaTaskIds = getGeneratedMediaTaskIdsForSessionKey(params.runSessionKey);
				if (params.abortSignal?.aborted) throw new Error(params.abortReason());
				const { sessionRuntimeOverride, executionProvider, cliExecution, runtime: candidateRuntime } = resolveCandidateExecution(providerOverride, modelOverride, runOptions.agentHarnessRuntimeOverride);
				const candidateConfiguredThinkLevel = params.immutableThinkLevel ?? resolveConfiguredThinkingDefaultCore({
					cfg: params.cfgWithAgentDefaults,
					agentId: params.agentId,
					provider: providerOverride,
					model: modelOverride
				});
				const thinkingSelectionKey = `${providerOverride}/${modelOverride}\0${candidateRuntime}`;
				if ((candidateConfiguredThinkLevel !== "off" || candidateRuntime !== "openclaw") && hydratedThinkingSelection !== thinkingSelectionKey && needsThinkHydration(thinkingCatalog, providerOverride, modelOverride, candidateRuntime)) {
					hydratedThinkingSelection = thinkingSelectionKey;
					const runtimeCatalog = await params.loadThinkingCatalog(providerOverride, modelOverride, candidateRuntime);
					if (runtimeCatalog.length > 0) thinkingCatalog = runtimeCatalog;
				}
				const { level: candidateThinkLevel } = resolveThinkingSelectionCore({
					cfg: params.cfgWithAgentDefaults,
					agentId: params.agentId,
					provider: providerOverride,
					model: modelOverride,
					level: candidateConfiguredThinkLevel,
					catalog: thinkingCatalog,
					agentRuntime: candidateRuntime
				});
				const rootedExecution = params.executionRoot ? { root: params.executionRoot } : void 0;
				assertCronExecutionRootRuntime(params.executionRoot, candidateRuntime, cliExecution && Boolean(rootedExecution));
				assertCronRuntimeAuthorityCandidate({
					authority: params.job.runtimeAuthority,
					candidateRuntime,
					cliExecution
				});
				setCronSessionRuntimeModel({
					entry: params.cronSession.sessionEntry,
					provider: providerOverride,
					model: modelOverride
				});
				setCronSessionAgentHarnessId({
					entry: params.cronSession.sessionEntry,
					agentHarnessId: candidateRuntime
				});
				await params.persistSessionEntry();
				await params.persistRunContinuationSession?.();
				await params.setRunContinuationCliExecutionProvider?.(cliExecution ? executionProvider : void 0);
				const bootstrapPromptWarningSignature = bootstrapPromptWarningSignaturesSeen.at(-1);
				const fastModeState = resolveFastModeState({
					cfg: params.cfgWithAgentDefaults,
					provider: providerOverride,
					model: modelOverride,
					agentId: params.agentId,
					sessionEntry: params.cronSession.sessionEntry
				});
				const buildCommonRunParams = () => ({
					preparedRunAdmission,
					...rootedAgentRunParams(params.workspaceDir, params.executionRoot),
					cwd: params.executionRoot ?? params.cwd,
					sessionId: params.cronSession.sessionEntry.sessionId,
					sessionKey: params.runSessionKey,
					sessionTarget,
					agentId: params.agentId,
					trigger: "cron",
					jobId: params.job.id,
					messageActionTurnCapability,
					config: params.cfgWithAgentDefaults,
					prompt: promptText,
					finalizePromptForResolvedTools,
					model: modelOverride,
					thinkLevel: candidateThinkLevel,
					timeoutMs: params.timeoutMs,
					runId,
					lane: resolveCronAgentLane(params.lane),
					terminalReplyExpectation: "optional",
					skillsSnapshot: params.skillsSnapshot,
					messageChannel,
					agentAccountId: params.resolvedDelivery.accountId,
					extraSystemPrompt: params.deliverySystemPrompt,
					sourceReplyDeliveryMode,
					requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget,
					scheduledToolPolicy,
					onExecutionStarted: notifyExecutionStarted,
					onExecutionPhase: notifyExecutionPhase,
					bootstrapContextMode,
					bootstrapContextRunKind: "cron",
					bootstrapPromptWarningSignaturesSeen,
					bootstrapPromptWarningSignature,
					fastMode: fastModeState.mode,
					fastModeAutoOnSeconds: fastModeState.fastAutoOnSeconds,
					fastModeStartedAtMs,
					fastModeAutoProgressState,
					isFinalFallbackAttempt: runOptions.isFinalFallbackAttempt,
					contextEngineLogicalTurnLease: runOptions.contextEngineLogicalTurnLease,
					onContextEngineTurnCandidate: runOptions.onContextEngineTurnCandidate,
					userTurnTranscriptRecorder,
					suppressNextUserMessagePersistence: userTurnTranscriptRecorder.hasPersisted() || userTurnTranscriptRecorder.isBlocked()
				});
				if (cliExecution) {
					const allowCliAuthProfileForwarding = cliBackendAcceptsAuthProfileForwarding({
						provider: executionProvider,
						config: params.cfgWithAgentDefaults,
						agentId: params.agentId
					});
					const deferredLifecycle = createDeferredEmbeddedRunLifecycleManager({
						runId,
						agentId: params.agentId,
						sessionId: params.cronSession.sessionEntry.sessionId,
						sessionKey: params.runSessionKey,
						sessionFile,
						abortSignal: params.abortSignal
					});
					try {
						const cliAbortSignal = deferredLifecycle.signal;
						const result = await withLocalSessionPlacementTurnSettlement({
							sessionId: params.cronSession.sessionEntry.sessionId,
							sessionKey: params.runSessionKey,
							agentId: params.agentId,
							runId
						}, async (assertSettlementCurrent) => {
							const diagnosticOwner = deferredLifecycle.handoffToCli();
							const cliSessionBinding = params.cronSession.isNewSession ? void 0 : await getCliSessionBinding(params.cronSession.sessionEntry, executionProvider);
							const authProfileId = allowCliAuthProfileForwarding ? resolveCliExecutionAuthProfileId({
								cliExecutionProvider: executionProvider,
								authProfileProvider: providerOverride,
								config: params.cfgWithAgentDefaults,
								agentDir: params.agentDir,
								sessionBinding: cliSessionBinding,
								selected: params.liveSelection.authProfileId ? {
									authProfileId: params.liveSelection.authProfileId,
									authProfileIdSource: params.liveSelection.authProfileIdSource === "user" ? "user" : "auto"
								} : void 0
							}) : void 0;
							const guardedCliSessionBinding = cliSessionBinding && hasCliSessionReuseMetadata(cliSessionBinding) ? cliSessionBinding : void 0;
							const candidateResult = await runCliAgent({
								...buildCommonRunParams(),
								diagnosticOwner,
								sessionEntry: params.cronSession.sessionEntry,
								contextWindow: params.cronSession.sessionEntry.contextWindow,
								cleanupCliLiveSessionOnRunEnd: params.usesDetachedRunSession,
								sessionFile,
								storePath: params.cronSession.storePath,
								persistAssistantTranscript: true,
								rootedExecution,
								modelProvider: providerOverride,
								requesterModel: {
									provider: providerOverride,
									model: modelOverride
								},
								modelHasVision: modelSupportsInput(findModelInCatalog(thinkingCatalog ?? [], providerOverride, modelOverride), "image"),
								provider: executionProvider,
								authProfileId,
								cliSessionId: cliSessionBinding?.sessionId,
								cliSessionBinding: guardedCliSessionBinding,
								cliSessionBindingFacts: resolveForkCronCliSessionBindingFacts(params, {
									extraSystemPromptStatic: params.deliverySystemPrompt,
									sourceReplyDeliveryMode,
									requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget
								}),
								toolsAllow: resolveCliRuntimeToolsAllow(params.agentPayload?.toolsAllow),
								abortSignal: cliAbortSignal
							});
							const classification = runOptions.classifyResult(candidateResult);
							const settledEntry = { ...params.cronSession.sessionEntry };
							if ((candidateResult.meta.agentMeta?.clearCliSessionBinding === true || !cliAbortSignal.aborted && !classification) && applyCliSessionBindingResult(settledEntry, executionProvider, candidateResult.meta.agentMeta)) {
								const assertCommitAllowed = () => assertCliSessionBindingResultCommitAllowed(candidateResult.meta.agentMeta, assertSettlementCurrent, cliAbortSignal);
								return await settleCliSessionResult(candidateResult, async () => {
									await params.persistSessionEntry(assertCommitAllowed, settledEntry);
									await params.persistRunContinuationSession?.(assertCommitAllowed);
								});
							}
							return candidateResult;
						}, {
							preparedRunAdmission,
							abortSignal: cliAbortSignal,
							trigger: "cron",
							isFinalFallbackAttempt: runOptions.isFinalFallbackAttempt
						});
						bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport);
						return result;
					} catch (error) {
						deferredLifecycle.signal.throwIfAborted();
						throw error;
					} finally {
						await deferredLifecycle.complete();
					}
				}
				const { runEmbeddedAgent } = await cronEmbeddedRuntimeLoader.load();
				const promptCacheKey = resolveIsolatedCronPromptCacheKey({
					job: params.job,
					agentId: params.agentId,
					agentSessionKey: params.agentSessionKey,
					provider: providerOverride,
					model: modelOverride
				});
				const currentChannelId = await resolveCurrentChannelTarget({
					channel: messageChannel,
					to: params.resolvedDelivery.to,
					threadId: params.resolvedDelivery.threadId
				});
				const result = await runEmbeddedAgent({
					...buildCommonRunParams(),
					promptCacheKey,
					cleanupBundleMcpOnRunEnd: params.usesDetachedRunSession,
					allowGatewaySubagentBinding: true,
					messageTo: params.resolvedDelivery.to,
					messageThreadId: params.resolvedDelivery.threadId,
					currentChannelId,
					agentDir: params.agentDir,
					provider: providerOverride,
					agentHarnessRuntimeOverride: sessionRuntimeOverride,
					modelThinkingCapability: prepareModelRunCapabilities([thinkingCatalog, []], [
						providerOverride,
						modelOverride,
						candidateRuntime
					]).modelThinkingCapability,
					requestedRouteResolution: "resolved",
					modelFallbacksOverride: cronFallbacksOverride,
					authProfileId: params.liveSelection.authProfileId,
					authProfileIdSource: params.liveSelection.authProfileId ? params.liveSelection.authProfileIdSource : void 0,
					authProfileFailurePolicy: runOptions.authProfileFailurePolicy ?? "local_transient",
					verboseLevel: params.resolvedVerboseLevel,
					runTimeoutOverrideMs: params.runTimeoutOverrideMs,
					toolsAllow: params.agentPayload?.toolsAllow,
					scheduledRuntimeAuthority: params.job.runtimeAuthority,
					scheduledRuntimeAuthorityRecoveryRequired: params.job.runtimeAuthorityRecoveryRequired === true,
					execSession: params.cronSession.sessionEntry,
					execOverrides: params.suppressExecNotifyOnExit ? {
						notifyOnExit: false,
						notifyOnExitEmptySuccess: false
					} : void 0,
					deferTerminalLifecycle: true,
					onAgentEvent: params.lifecycle.note,
					disableMessageTool: !sourceDelivery.messageTool.enabled,
					forceMessageTool: sourceDelivery.messageTool.force,
					allowTransientCooldownProbe: runOptions.allowTransientCooldownProbe,
					assistantErrorTranscript: runOptions.assistantErrorTranscript,
					abortSignal: params.abortSignal,
					onLaneWait: params.onLaneWait
				});
				bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport);
				return result;
			}
		}).catch((error) => {
			params.lifecycle.capture("error", error);
			throw error;
		}).finally(() => {
			unregisterCronRunExecSource();
			closePromptAdmission();
		});
		const executionError = params.lifecycle.getDeferredError() ?? (fallbackResult.result.meta.error || fallbackResult.outcome === "exhausted" ? "Agent run failed" : void 0);
		if (executionError) params.lifecycle.capture("error", executionError, resolveAgentLifecycleTerminalMetadata(fallbackResult.result.meta));
		else params.lifecycle.capture("end", fallbackResult.result);
		params.liveSelection.provider = fallbackResult.provider;
		params.liveSelection.model = fallbackResult.model;
		setCronSessionRuntimeModel({
			entry: params.cronSession.sessionEntry,
			provider: fallbackResult.provider,
			model: fallbackResult.model
		});
		const completed = {
			runResult: fallbackResult.result,
			fallbackProvider: fallbackResult.provider,
			fallbackModel: fallbackResult.model,
			runStartedAt,
			runEndedAt: Date.now()
		};
		params.onPromptCompleted(completed);
		await params.persistRunContinuationSession?.();
		pendingUserTurn = void 0;
		return completed;
	};
}
/** Executes an isolated cron prompt, including live model-switch and interim-ack retries. */
async function executeCronRun(params) {
	const resolvedVerboseLevel = normalizeVerboseLevel(params.cronSession.sessionEntry.verboseLevel) ?? normalizeVerboseLevel(params.agentVerboseDefault) ?? "off";
	registerAgentRunContext(params.runId, {
		sessionId: params.cronSession.sessionEntry.sessionId,
		agentId: params.agentId,
		verboseLevel: resolvedVerboseLevel
	});
	const runStartedAt = params.runStartedAt ?? Date.now();
	const completedPromptRuns = [];
	const runPrompt = createCronPromptExecutor({
		...params,
		resolvedVerboseLevel,
		onPromptCompleted: (run) => {
			completedPromptRuns.push(run);
			params.onPromptCompleted?.(completedPromptRuns);
		}
	});
	const MAX_MODEL_SWITCH_RETRIES = 2;
	let modelSwitchRetries = 0;
	let promptMediaTaskIds = /* @__PURE__ */ new Set();
	let execution;
	while (true) try {
		promptMediaTaskIds = getGeneratedMediaTaskIdsForSessionKey(params.runSessionKey);
		execution = await runPrompt(params.commandBody, runStartedAt);
		break;
	} catch (err) {
		if (!(err instanceof LiveSessionModelSwitchError) || hasNewGeneratedMediaTaskForSessionKey(params.runSessionKey, promptMediaTaskIds)) throw err;
		modelSwitchRetries += 1;
		if (modelSwitchRetries > MAX_MODEL_SWITCH_RETRIES) {
			logWarn(`[cron:${params.job.id}] LiveSessionModelSwitchError retry limit reached (${MAX_MODEL_SWITCH_RETRIES}); aborting`);
			throw err;
		}
		params.liveSelection.provider = err.provider;
		params.liveSelection.model = err.model;
		params.liveSelection.agentRuntimeOverride = err.agentRuntimeOverride;
		params.liveSelection.authProfileId = err.authProfileId;
		params.liveSelection.authProfileIdSource = err.authProfileId ? err.authProfileIdSource : void 0;
		syncCronSessionLiveSelection({
			entry: params.cronSession.sessionEntry,
			liveSelection: params.liveSelection
		});
		try {
			await params.persistSessionEntry();
			await params.persistRunContinuationSession?.();
		} catch (persistErr) {
			logWarn(`[cron:${params.job.id}] Failed to persist model switch session entry: ${String(persistErr)}`);
		}
		continue;
	}
	const { runResult } = execution;
	if (!params.isAborted()) {
		const interimPayloads = runResult.payloads ?? [];
		const { deliveryPayloadHasStructuredContent: interimPayloadHasStructuredContent, hasFatalErrorPayload: interimHasFatalErrorPayload, outputText: interimOutputText } = resolveCronPayloadOutcome({
			payloads: interimPayloads,
			runLevelError: runResult.meta?.error,
			failureSignal: runResult.meta?.failureSignal,
			finalAssistantVisibleText: runResult.meta?.finalAssistantVisibleText,
			preferFinalAssistantVisibleText: (await resolveCronChannelOutputPolicy(params.resolvedDelivery.channel, { deliveryRequested: params.deliveryRequested })).preferFinalAssistantVisibleText
		});
		const interimText = interimOutputText?.trim() ?? "";
		const shouldRetryInterimAck = !runResult.meta?.error && !interimHasFatalErrorPayload && !runResult.didSendViaMessagingTool && !hasNewGeneratedMediaTaskForSessionKey(params.runSessionKey, promptMediaTaskIds) && !interimPayloadHasStructuredContent && !interimPayloads.some((payload) => payload?.isError === true) && isLikelyInterimCronMessage(interimText);
		let hasFreshDescendants = false;
		let hasActiveDescendants = false;
		if (shouldRetryInterimAck) {
			const { readDescendantExecutionState } = await cronSubagentRegistryRuntimeLoader.load();
			const descendants = await readDescendantExecutionState(params.runSessionKey, runStartedAt);
			hasFreshDescendants = descendants.hasFreshDescendants;
			hasActiveDescendants = descendants.hasActiveDescendants;
		}
		if (shouldRetryInterimAck && !params.isAborted() && !hasFreshDescendants && !hasActiveDescendants) execution = await runPrompt([
			"Your previous response was only an acknowledgement and did not complete this cron task.",
			"Complete the original task now.",
			"Do not send a status update like 'on it'.",
			"Use tools when needed, including sessions_spawn for parallel subtasks, wait for spawned subagents to finish, then return only the final summary."
		].join(" "), Date.now());
	}
	return {
		...execution,
		runStartedAt,
		completedPromptRuns
	};
}
//#endregion
export { executeCronRun };
