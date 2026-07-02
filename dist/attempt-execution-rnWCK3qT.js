import { c as redactSensitiveText } from "./redact-CQ2tlRRk.js";
import { t as sanitizeForLog } from "./ansi-zQGMgESZ.js";
import { c as readErrorName } from "./errors-DCRXIYSQ.js";
import { m as resolveUserPath } from "./utils-BApvfmPs.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { a as isSubagentSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { l as resolveOpenAIRuntimeProvider } from "./openai-routing-DXJmS9CT.js";
import { n as ensureAuthProfileStore } from "./store-SfOB_T2S.js";
import { s as emitAgentEvent } from "./agent-events-7y1r8HOP.js";
import "./message-channel-B4LS2Kcc.js";
import { b as persistSessionTranscriptTurn } from "./session-accessor-Dx6KDG0K.js";
import { i as resolveAuthProfileOrder } from "./order-DO7M8GzY.js";
import { h as isCliProvider } from "./model-selection-i8V2iTdL.js";
import { i as buildUsageWithNoCost } from "./stream-message-shared-CdbBqwfX.js";
import { r as formatAcpErrorChain } from "./errors-Cr5wPlui.js";
import "./errors-4r1y6XFh.js";
import { o as resolveAgentRunAbortLifecycleFields } from "./run-termination-CgLu4sKB.js";
import { o as readTailAssistantTextFromSessionTranscript } from "./transcript-BMyCREan.js";
import { n as annotateInterSessionPromptText } from "./input-provenance-CQSqbDss.js";
import { t as FailoverError } from "./failover-error-CZc6_Wx_.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-C_j_aIUe.js";
import { i as resolveCliBackendConfig } from "./cli-backends-DgIbZRGR.js";
import { a as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-CZ8RT-Uc.js";
import { E as timestampOptsFromConfig, T as injectTimestamp, t as resolveAvailableAgentHarnessPolicy } from "./selection-CEDMzxEH.js";
import "./workspace-CD16JXyF.js";
import { m as preparePersistedUserTurnMessageForTranscriptWrite } from "./queue-DlJx-5Kf.js";
import { t as normalizeReplyPayload } from "./normalize-reply-CZRULv1j.js";
import { r as getCliSessionBinding } from "./cli-session-Despdu3U.js";
import { s as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-DFC5I5_X.js";
import { t as runEmbeddedAgent } from "./embedded-agent-BewHxe-S.js";
import { t as buildAgentRuntimeAuthPlan } from "./auth-V0O1HaUL.js";
import { a as resolveFallbackRetryPrompt, n as claudeCliSessionTranscriptHasContent, t as buildClaudeCliFallbackContextPrelude } from "./attempt-execution.helpers-D6D1aACa.js";
import { n as runCliAgent } from "./cli-runner-DTtHR0uF.js";
import "./run-context-C8rw5QEs.js";
import { t as clearCliSessionInStore } from "./session-store-8NK-dQuw.js";
//#region src/agents/command/attempt-execution.ts
const log = createSubsystemLogger("agents/agent-command");
function shouldClearReusedCliSessionAfterError(err) {
	if (readErrorName(err) === "AbortError") return true;
	return err instanceof FailoverError;
}
function resolveClearedCliSessionReason(err) {
	if (err instanceof FailoverError) return err.reason;
	return readErrorName(err) || "error";
}
function normalizeTranscriptMirrorText(value) {
	return value.trim().replace(/\s+/gu, " ");
}
const ACP_TRANSCRIPT_USAGE = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	totalTokens: 0,
	cost: {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		total: 0
	}
};
const GOOGLE_GEMINI_CLI_PROVIDER_ID = "google-gemini-cli";
const GOOGLE_PROVIDER_ID = "google";
function shouldSuppressEmbeddedLiveStreamOutput(params) {
	return params.opts.sessionEffects === "internal" && params.opts.deliver !== true;
}
function resolveProfileAuthFromStore(params) {
	const profileId = params.profileId?.trim();
	if (!profileId) return {};
	const credential = ensureAuthProfileStore(params.agentDir, {
		allowKeychainPrompt: false,
		externalCliProfileIds: [profileId]
	}).profiles[profileId];
	return {
		provider: credential?.provider,
		mode: credential?.type
	};
}
function resolveHarnessAuthProfileSelection(params) {
	const sessionAuthProfileId = params.sessionAuthProfileId?.trim();
	if (sessionAuthProfileId) {
		const profileAuth = resolveProfileAuthFromStore({
			agentDir: params.agentDir,
			profileId: sessionAuthProfileId
		});
		return {
			authProfileId: sessionAuthProfileId,
			authProfileIdSource: params.sessionAuthProfileSource,
			authProfileProvider: profileAuth.provider ?? params.authProfileProvider,
			authProfileMode: profileAuth.mode
		};
	}
	if (!params.allowHarnessAuthProfileForwarding) return { authProfileProvider: params.authProfileProvider };
	const harnessAuthProvider = buildAgentRuntimeAuthPlan({
		provider: params.provider,
		authProfileProvider: params.authProfileProvider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		providerAuthAliasesEnabled: params.providerAuthAliasesEnabled,
		harnessId: params.harnessId,
		harnessRuntime: params.harnessRuntime,
		allowHarnessAuthProfileForwarding: params.allowHarnessAuthProfileForwarding
	}).harnessAuthProvider;
	if (!harnessAuthProvider) return { authProfileProvider: params.authProfileProvider };
	const store = ensureAuthProfileStore(params.agentDir, {
		allowKeychainPrompt: false,
		externalCliProviderIds: [harnessAuthProvider]
	});
	const authProfileId = resolveAuthProfileOrder({
		cfg: params.config,
		store,
		provider: harnessAuthProvider
	})[0];
	return authProfileId ? {
		authProfileId,
		authProfileIdSource: "auto",
		authProfileProvider: harnessAuthProvider
	} : { authProfileProvider: params.authProfileProvider };
}
function cliBackendAcceptsAuthProfileForwarding(params) {
	return resolveCliBackendConfig(params.provider, params.config, { agentId: params.agentId })?.id === "google-gemini-cli";
}
function resolveCliExecutionAuthProfileId(params) {
	if (params.selected.authProfileId) {
		if (params.selected.authProfileProvider === params.cliExecutionProvider || params.cliExecutionProvider === GOOGLE_GEMINI_CLI_PROVIDER_ID && params.selected.authProfileIdSource !== "auto") return params.selected.authProfileId;
	}
	const store = ensureAuthProfileStore(params.agentDir, {
		allowKeychainPrompt: false,
		externalCliProviderIds: [params.cliExecutionProvider]
	});
	const cliProfileId = resolveAuthProfileOrder({
		cfg: params.config,
		store,
		provider: params.cliExecutionProvider
	})[0];
	if (cliProfileId) return cliProfileId;
	if (params.cliExecutionProvider !== GOOGLE_GEMINI_CLI_PROVIDER_ID || params.authProfileProvider !== GOOGLE_PROVIDER_ID) return;
	return resolveAuthProfileOrder({
		cfg: params.config,
		store,
		provider: GOOGLE_PROVIDER_ID
	}).find((profileId) => {
		const credential = store.profiles[profileId];
		return credential?.provider === GOOGLE_PROVIDER_ID && credential.type === "api_key";
	});
}
function resolveTranscriptUsage(usage) {
	if (!usage) return ACP_TRANSCRIPT_USAGE;
	return buildUsageWithNoCost({
		input: usage.input,
		output: usage.output,
		cacheRead: usage.cacheRead,
		cacheWrite: usage.cacheWrite,
		totalTokens: usage.total
	});
}
async function persistTextTurnTranscript(params) {
	const promptText = params.transcriptBody ?? params.body;
	const replyText = params.finalText;
	if (!promptText && !replyText) return {
		kind: "persisted",
		sessionEntry: params.sessionEntry
	};
	const messages = [];
	const userMessage = params.userMessage ?? (promptText ? {
		role: "user",
		content: promptText,
		timestamp: Date.now()
	} : void 0);
	if (userMessage) messages.push({
		message: userMessage,
		idempotencyLookup: "scan",
		prepareMessageAfterIdempotencyCheck: (message) => preparePersistedUserTurnMessageForTranscriptWrite(message, {
			agentId: params.sessionAgentId,
			sessionKey: params.sessionKey,
			beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook
		})
	});
	if (replyText) messages.push({
		message: {
			role: "assistant",
			content: [{
				type: "text",
				text: replyText
			}],
			api: params.assistant.api,
			provider: params.assistant.provider,
			model: params.assistant.model,
			usage: resolveTranscriptUsage(params.assistant.usage),
			stopReason: "stop",
			timestamp: Date.now()
		},
		shouldAppend: async ({ sessionFile }) => {
			if (!params.embeddedAssistantGapFill) return true;
			const latest = await readTailAssistantTextFromSessionTranscript(sessionFile);
			const normalizedReply = normalizeTranscriptMirrorText(replyText);
			const normalizedLatest = latest?.text ? normalizeTranscriptMirrorText(latest.text) : "";
			return !normalizedLatest || normalizedLatest !== normalizedReply;
		}
	});
	const turn = await persistSessionTranscriptTurn({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry,
		sessionStore: params.sessionStore,
		storePath: params.storePath,
		agentId: params.sessionAgentId,
		threadId: params.threadId
	}, {
		config: params.config,
		cwd: params.sessionCwd,
		messages,
		publishWhen: "always",
		touchSessionEntry: true,
		updateMode: "file-only",
		...params.sessionStore && params.storePath ? { expectedSessionId: params.sessionId } : {}
	});
	if (turn.rejectedReason === "session-rebound") return {
		kind: "session-rebound",
		sessionEntry: void 0
	};
	return {
		kind: "persisted",
		sessionEntry: turn.sessionEntry
	};
}
function resolveCliTranscriptReplyText(result) {
	const visibleText = result.meta.finalAssistantVisibleText?.trim();
	if (visibleText) return visibleText;
	return (result.payloads ?? []).filter((payload) => !payload.isError && !payload.isReasoning).map((payload) => payload.text?.trim() ?? "").filter(Boolean).join("\n\n");
}
function isClaudeCliProvider(provider) {
	return provider.trim().toLowerCase() === "claude-cli";
}
async function persistAcpTurnTranscript(params) {
	return await persistTextTurnTranscript({
		...params,
		assistant: {
			api: "openai-responses",
			provider: "openclaw",
			model: "acp-runtime"
		}
	});
}
async function persistCliTurnTranscript(params) {
	const replyText = resolveCliTranscriptReplyText(params.result);
	const provider = params.result.meta.agentMeta?.provider?.trim() ?? "cli";
	const model = params.result.meta.agentMeta?.model?.trim() ?? "default";
	const gapFill = params.embeddedAssistantGapFill ?? false;
	return await persistTextTurnTranscript({
		body: gapFill ? "" : params.body,
		transcriptBody: gapFill ? void 0 : params.transcriptBody,
		...!gapFill && params.userMessage ? { userMessage: params.userMessage } : {},
		finalText: replyText,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry,
		sessionStore: params.sessionStore,
		storePath: params.storePath,
		sessionAgentId: params.sessionAgentId,
		threadId: params.threadId,
		sessionCwd: params.sessionCwd,
		config: params.config,
		embeddedAssistantGapFill: gapFill,
		assistant: {
			api: "cli",
			provider,
			model,
			usage: params.result.meta.agentMeta?.usage
		}
	});
}
function runAgentAttempt(params) {
	const isRawModelRun = params.opts.modelRun === true || params.opts.promptMode === "none";
	const claudeCliFallbackPrelude = !isRawModelRun && params.isFallbackRetry && isClaudeCliProvider(params.originalProvider) && !isClaudeCliProvider(params.providerOverride) ? buildClaudeCliFallbackContextPrelude({ cliSessionId: getCliSessionBinding(params.sessionEntry, "claude-cli")?.sessionId }) : "";
	const resolvedPrompt = resolveFallbackRetryPrompt({
		body: params.body,
		isFallbackRetry: params.isFallbackRetry,
		sessionHasHistory: params.sessionHasHistory,
		priorContextPrelude: claudeCliFallbackPrelude
	});
	const effectivePrompt = isRawModelRun ? resolvedPrompt : annotateInterSessionPromptText(resolvedPrompt, params.opts.inputProvenance);
	const bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(params.sessionEntry?.systemPromptReport);
	const bootstrapPromptWarningSignature = bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1];
	const requestedAgentHarnessId = isRawModelRun ? "openclaw" : void 0;
	const cliExecutionProvider = isRawModelRun ? params.providerOverride : resolveCliRuntimeExecutionProvider({
		provider: params.providerOverride,
		cfg: params.cfg,
		agentId: params.sessionAgentId,
		modelId: params.modelOverride,
		authProfileId: params.sessionEntry?.authProfileOverride
	}) ?? params.providerOverride;
	const isCliExecutionProvider = isCliProvider(cliExecutionProvider, params.cfg);
	const allowCliAuthProfileForwarding = isCliExecutionProvider && cliBackendAcceptsAuthProfileForwarding({
		provider: cliExecutionProvider,
		config: params.cfg,
		agentId: params.sessionAgentId
	});
	const agentHarnessPolicy = isRawModelRun ? {
		runtime: "openclaw",
		runtimeSource: "model"
	} : resolveAvailableAgentHarnessPolicy({
		provider: params.providerOverride,
		modelId: params.modelOverride,
		config: params.cfg,
		agentId: params.sessionAgentId,
		sessionKey: params.sessionKey ?? params.sessionId
	});
	const harnessAuthSelection = resolveHarnessAuthProfileSelection({
		config: params.cfg,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		provider: params.providerOverride,
		authProfileProvider: params.authProfileProvider,
		sessionAuthProfileId: params.sessionEntry?.authProfileOverride,
		sessionAuthProfileSource: params.sessionEntry?.authProfileOverrideSource,
		harnessId: requestedAgentHarnessId,
		harnessRuntime: agentHarnessPolicy.runtime,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		providerAuthAliasesEnabled: params.pluginsEnabled,
		allowHarnessAuthProfileForwarding: !isCliExecutionProvider
	});
	const runtimeAuthPlan = buildAgentRuntimeAuthPlan({
		provider: params.providerOverride,
		authProfileProvider: harnessAuthSelection.authProfileProvider,
		authProfileMode: harnessAuthSelection.authProfileMode,
		sessionAuthProfileId: harnessAuthSelection.authProfileId,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		providerAuthAliasesEnabled: params.pluginsEnabled,
		harnessId: requestedAgentHarnessId,
		harnessRuntime: agentHarnessPolicy.runtime,
		allowHarnessAuthProfileForwarding: !isCliExecutionProvider
	});
	const authProfileId = (allowCliAuthProfileForwarding ? resolveCliExecutionAuthProfileId({
		cliExecutionProvider,
		authProfileProvider: params.authProfileProvider,
		config: params.cfg,
		agentDir: params.agentDir,
		selected: harnessAuthSelection
	}) : void 0) ?? runtimeAuthPlan.forwardedAuthProfileId;
	const embeddedAgentProvider = resolveOpenAIRuntimeProvider({
		provider: params.providerOverride,
		harnessRuntime: agentHarnessPolicy.runtime,
		agentHarnessId: requestedAgentHarnessId,
		authProfileProvider: runtimeAuthPlan.authProfileProviderForAuth,
		authProfileId,
		config: params.cfg,
		workspaceDir: params.workspaceDir
	});
	const embeddedAgentHarnessOverride = requestedAgentHarnessId ?? (agentHarnessPolicy.runtime === "openclaw" && agentHarnessPolicy.runtimeSource !== "implicit" ? "openclaw" : void 0);
	if (!isRawModelRun && isCliExecutionProvider) {
		const cliSessionBinding = getCliSessionBinding(params.sessionEntry, cliExecutionProvider);
		const cliProcessCwd = params.cwd ? resolveUserPath(params.cwd) : params.workspaceDir;
		const cliPrompt = params.opts.inputProvenance?.kind === "inter_session" ? effectivePrompt : injectTimestamp(effectivePrompt, timestampOptsFromConfig(params.cfg));
		const mutableCliSessionStore = params.sessionKey && params.sessionStore && params.storePath ? {
			sessionKey: params.sessionKey,
			sessionStore: params.sessionStore,
			storePath: params.storePath
		} : void 0;
		const resolveReusableCliSessionBinding = async () => {
			if (!isClaudeCliProvider(cliExecutionProvider) || !cliSessionBinding?.sessionId || await claudeCliSessionTranscriptHasContent({
				sessionId: cliSessionBinding.sessionId,
				workspaceDir: cliProcessCwd
			})) return cliSessionBinding;
			log.warn(`cli session reset: provider=${sanitizeForLog(cliExecutionProvider)} reason=transcript-missing sessionKey=${params.sessionKey ?? params.sessionId}`);
			if (mutableCliSessionStore) params.sessionEntry = await clearCliSessionInStore({
				provider: cliExecutionProvider,
				...mutableCliSessionStore
			}) ?? params.sessionEntry;
		};
		const runCliWithSession = (nextCliSessionId, activeCliSessionBinding = cliSessionBinding) => runCliAgent({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionEntry: params.sessionEntry,
			agentId: params.sessionAgentId,
			trigger: "user",
			sessionFile: params.sessionFile,
			workspaceDir: params.workspaceDir,
			cwd: params.cwd,
			config: params.cfg,
			prompt: cliPrompt,
			provider: cliExecutionProvider,
			model: params.modelOverride,
			thinkLevel: params.resolvedThinkLevel,
			timeoutMs: params.timeoutMs,
			runTimeoutOverrideMs: params.runTimeoutOverrideMs,
			runId: params.runId,
			lifecycleGeneration: params.lifecycleGeneration,
			lane: params.opts.lane,
			extraSystemPrompt: params.opts.extraSystemPrompt,
			inputProvenance: params.opts.inputProvenance,
			sourceReplyDeliveryMode: params.opts.sourceReplyDeliveryMode,
			requireExplicitMessageTarget: isSubagentSessionKey(params.sessionKey),
			cliSessionId: nextCliSessionId,
			cliSessionBinding: nextCliSessionId === activeCliSessionBinding?.sessionId ? activeCliSessionBinding : void 0,
			authProfileId,
			bootstrapPromptWarningSignaturesSeen,
			bootstrapPromptWarningSignature,
			images: params.isFallbackRetry ? void 0 : params.opts.images,
			imageOrder: params.isFallbackRetry ? void 0 : params.opts.imageOrder,
			skillsSnapshot: params.skillsSnapshot,
			messageChannel: params.messageChannel,
			streamParams: params.opts.streamParams,
			messageProvider: params.opts.messageProvider ?? params.messageChannel,
			currentChannelId: params.runContext.currentChannelId,
			chatId: params.runContext.chatId,
			channelContext: params.runContext.channelContext,
			currentThreadTs: params.runContext.currentThreadTs,
			currentInboundAudio: params.runContext.currentInboundAudio,
			approvalReviewerDeviceId: params.opts.approvalReviewerDeviceId,
			agentAccountId: params.runContext.accountId,
			senderId: params.runContext.senderId,
			senderIsOwner: params.opts.senderIsOwner,
			toolsAllow: params.opts.toolsAllow,
			cleanupBundleMcpOnRunEnd: params.opts.cleanupBundleMcpOnRunEnd,
			cleanupCliLiveSessionOnRunEnd: params.opts.cleanupCliLiveSessionOnRunEnd,
			oneShotCliRun: params.opts.oneShotCliRun,
			...mutableCliSessionStore ? { onBeforeFreshCliSessionRetry: async (retry) => {
				if (retry.sessionId !== activeCliSessionBinding?.sessionId) return false;
				log.warn(`CLI session failed, clearing before fresh retry: provider=${sanitizeForLog(cliExecutionProvider)} sessionKey=${mutableCliSessionStore.sessionKey} reason=${sanitizeForLog(retry.reason)}`);
				params.sessionEntry = await clearCliSessionInStore({
					provider: cliExecutionProvider,
					...mutableCliSessionStore
				}) ?? params.sessionEntry;
				return true;
			} } : {}
		});
		return resolveReusableCliSessionBinding().then(async (activeCliSessionBinding) => {
			try {
				return await runCliWithSession(activeCliSessionBinding?.sessionId, activeCliSessionBinding);
			} catch (err) {
				if (isClaudeCliProvider(cliExecutionProvider) && shouldClearReusedCliSessionAfterError(err) && activeCliSessionBinding?.sessionId && mutableCliSessionStore) {
					log.warn(`CLI session cleared after failed reused turn: provider=${sanitizeForLog(cliExecutionProvider)} sessionKey=${mutableCliSessionStore.sessionKey} reason=${sanitizeForLog(resolveClearedCliSessionReason(err))}`);
					params.sessionEntry = await clearCliSessionInStore({
						provider: cliExecutionProvider,
						...mutableCliSessionStore
					}) ?? params.sessionEntry;
				}
				throw err;
			}
		});
	}
	return runEmbeddedAgent({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.sessionAgentId,
		trigger: "user",
		messageChannel: params.messageChannel,
		messageProvider: params.opts.messageProvider ?? params.messageChannel,
		agentAccountId: params.runContext.accountId,
		messageTo: params.opts.replyTo ?? params.opts.to,
		messageThreadId: params.opts.threadId,
		groupId: params.runContext.groupId,
		groupChannel: params.runContext.groupChannel,
		groupSpace: params.runContext.groupSpace,
		spawnedBy: params.spawnedBy,
		currentChannelId: params.runContext.currentChannelId,
		chatId: params.runContext.chatId,
		channelContext: params.runContext.channelContext,
		currentThreadTs: params.runContext.currentThreadTs,
		currentInboundAudio: params.runContext.currentInboundAudio,
		replyToMode: params.runContext.replyToMode,
		hasRepliedRef: params.runContext.hasRepliedRef,
		senderId: params.runContext.senderId,
		senderIsOwner: params.opts.senderIsOwner,
		sessionFile: params.sessionFile,
		workspaceDir: params.workspaceDir,
		cwd: params.cwd,
		config: params.cfg,
		agentHarnessId: embeddedAgentHarnessOverride,
		agentHarnessRuntimeOverride: embeddedAgentHarnessOverride,
		skillsSnapshot: params.skillsSnapshot,
		prompt: effectivePrompt,
		images: params.isFallbackRetry ? void 0 : params.opts.images,
		imageOrder: params.isFallbackRetry ? void 0 : params.opts.imageOrder,
		clientTools: params.opts.clientTools,
		provider: embeddedAgentProvider,
		model: params.modelOverride,
		modelFallbacksOverride: params.modelFallbacksOverride,
		authProfileId,
		authProfileIdSource: authProfileId ? harnessAuthSelection.authProfileIdSource : void 0,
		thinkLevel: params.resolvedThinkLevel,
		fastMode: params.fastMode,
		fastModeStartedAtMs: params.fastModeStartedAtMs,
		fastModeAutoOnSeconds: params.fastModeAutoOnSeconds,
		isFinalFallbackAttempt: params.isFinalFallbackAttempt,
		verboseLevel: params.resolvedVerboseLevel,
		bashElevated: params.opts.bashElevated,
		approvalReviewerDeviceId: params.opts.approvalReviewerDeviceId,
		timeoutMs: params.timeoutMs,
		runId: params.runId,
		lifecycleGeneration: params.lifecycleGeneration,
		lane: params.opts.lane,
		suppressLiveStreamOutput: shouldSuppressEmbeddedLiveStreamOutput(params),
		abortSignal: params.opts.abortSignal,
		extraSystemPrompt: params.opts.extraSystemPrompt,
		bootstrapContextMode: params.opts.bootstrapContextMode,
		bootstrapContextRunKind: params.opts.bootstrapContextRunKind,
		toolsAllow: params.opts.toolsAllow,
		internalEvents: params.opts.internalEvents,
		inputProvenance: params.opts.inputProvenance,
		sourceReplyDeliveryMode: params.opts.sourceReplyDeliveryMode,
		disableMessageTool: params.opts.disableMessageTool,
		streamParams: params.opts.streamParams,
		agentDir: params.agentDir,
		allowTransientCooldownProbe: params.allowTransientCooldownProbe,
		cleanupBundleMcpOnRunEnd: params.opts.cleanupBundleMcpOnRunEnd,
		oneShotCliRun: params.opts.oneShotCliRun,
		modelRun: params.opts.modelRun,
		promptMode: params.opts.promptMode,
		disableTools: params.opts.modelRun === true,
		onAgentEvent: params.onAgentEvent,
		deferTerminalLifecycle: params.deferTerminalLifecycle,
		deferTerminalLifecycleEnd: params.deferTerminalLifecycleEnd,
		suppressNextUserMessagePersistence: params.suppressPromptPersistenceOnRetry === true,
		onUserMessagePersisted: params.onUserMessagePersisted,
		onExecutionStarted: (info) => {
			if (info?.lifecycleGeneration) params.onLifecycleGenerationChanged?.(info.lifecycleGeneration);
		},
		onSessionIdChanged: params.opts.onSessionIdChanged,
		bootstrapPromptWarningSignaturesSeen,
		bootstrapPromptWarningSignature
	});
}
function buildAcpResult(params) {
	const normalizedFinalPayload = normalizeReplyPayload({ text: params.payloadText });
	const payloads = normalizedFinalPayload ? [normalizedFinalPayload] : [];
	const abortFields = resolveAgentRunAbortLifecycleFields(params.abortSignal);
	return {
		payloads,
		meta: {
			durationMs: Date.now() - params.startedAt,
			aborted: abortFields.aborted ?? false,
			stopReason: abortFields.stopReason ?? params.stopReason
		}
	};
}
function emitAcpLifecycleStart(params) {
	emitAgentEvent({
		runId: params.runId,
		...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
		stream: "lifecycle",
		data: {
			phase: "start",
			startedAt: params.startedAt
		}
	});
}
const ACP_PROXY_ENV_KEYS = [
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"ALL_PROXY",
	"http_proxy",
	"https_proxy",
	"all_proxy"
];
function resolvePresentProxyEnvKeys(env = process.env) {
	return ACP_PROXY_ENV_KEYS.filter((key) => {
		const value = env[key];
		return typeof value === "string" && value.trim().length > 0;
	});
}
function sanitizeAcpDiagnosticText(value) {
	return redactSensitiveText(value).replace(/\s+/g, " ").trim().slice(0, 240);
}
function acpRuntimeEventDiagnostics(event) {
	if (event.type === "status") return {
		eventType: event.type,
		text: sanitizeAcpDiagnosticText(event.text),
		...event.tag ? { tag: event.tag } : {}
	};
	if (event.type === "tool_call") return {
		eventType: event.type,
		text: sanitizeAcpDiagnosticText(event.text),
		...event.tag ? { tag: event.tag } : {},
		...event.status ? { status: sanitizeAcpDiagnosticText(event.status) } : {},
		...event.title ? { title: sanitizeAcpDiagnosticText(event.title) } : {},
		...event.toolCallId ? { toolCallId: sanitizeAcpDiagnosticText(event.toolCallId) } : {}
	};
	if (event.type === "error") return {
		eventType: event.type,
		message: sanitizeAcpDiagnosticText(event.message),
		...event.code ? { code: sanitizeAcpDiagnosticText(event.code) } : {},
		...typeof event.retryable === "boolean" ? { retryable: event.retryable } : {}
	};
	if (event.type === "done") return {
		eventType: event.type,
		...event.stopReason ? { stopReason: sanitizeAcpDiagnosticText(event.stopReason) } : {}
	};
	return {
		eventType: event.type,
		stream: event.stream ?? "output"
	};
}
function emitAcpPromptSubmitted(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "acp",
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		data: {
			phase: "prompt_submitted",
			at: params.at,
			proxyEnvKeys: resolvePresentProxyEnvKeys()
		}
	});
}
function emitAcpRuntimeEvent(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "acp",
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		data: {
			phase: "runtime_event",
			...acpRuntimeEventDiagnostics(params.event)
		}
	});
}
function emitAcpLifecycleEnd(params) {
	emitAgentEvent({
		runId: params.runId,
		...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
		stream: "lifecycle",
		data: {
			phase: "end",
			endedAt: Date.now(),
			...resolveAgentRunAbortLifecycleFields(params.abortSignal)
		}
	});
}
function emitAcpLifecycleError(params) {
	emitAgentEvent({
		runId: params.runId,
		...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
		stream: "lifecycle",
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		data: {
			phase: "error",
			error: formatAcpErrorChain(params.error),
			endedAt: Date.now(),
			...resolveAgentRunAbortLifecycleFields(params.abortSignal)
		}
	});
}
function emitAcpAssistantDelta(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "assistant",
		data: {
			text: params.text,
			delta: params.delta
		}
	});
}
//#endregion
export { emitAcpLifecycleStart as a, persistAcpTurnTranscript as c, emitAcpLifecycleError as i, persistCliTurnTranscript as l, emitAcpAssistantDelta as n, emitAcpPromptSubmitted as o, emitAcpLifecycleEnd as r, emitAcpRuntimeEvent as s, buildAcpResult as t, runAgentAttempt as u };
