import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { a as redactSensitiveFieldValue, u as redactToolPayloadText } from "./redact-CQ2tlRRk.js";
import { j as resolveTimerTimeoutMs, o as asDateTimestampMs, s as asFiniteNumber, y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { w as pathExists } from "./fs-safe-aqmM_n6V.js";
import { t as appendRegularFile } from "./regular-file-BD2zl6_l.js";
import { m as resolveUserPath } from "./utils-BApvfmPs.js";
import { C as freezeDiagnosticTraceContext, m as onInternalDiagnosticEvent, o as emitTrustedDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData, u as hasPendingInternalDiagnosticEvent, x as createDiagnosticTraceContextFromActiveScope } from "./diagnostic-events-CLCyIzm6.js";
import { y as resolveSessionAgentIds } from "./agent-scope-CDZXADgT.js";
import { a as resolveAgentDir, o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import { c as isBlockedHostnameOrIp, t as SsrFBlockedError } from "./ssrf-DmSIVBht.js";
import { s as emitAgentEvent } from "./agent-events-7y1r8HOP.js";
import { t as FAST_MODE_AUTO_PROGRESS_KIND } from "./reply-payload-HLWc9ssO.js";
import { s as resolveContextEngineOwnerPluginId } from "./registry-BLZQzICr.js";
import { r as markAuthProfileBlockedUntil } from "./usage-C-fcEbGX.js";
import { c as parseSessionEntries, n as buildSessionContext, s as migrateSessionEntries } from "./session-manager-D5YeJxMM.js";
import { u as saveMediaBuffer } from "./store-MjA3hYFB.js";
import { n as formatFastModeAutoProgressText, u as resolveFastModeForElapsed } from "./fast-mode-BhVbWk_p.js";
import { n as MESSAGE_TOOL_DELIVERY_HINTS } from "./message-tool-delivery-hints-BSLgiMlM.js";
import { r as clearActiveEmbeddedRun, v as setActiveEmbeddedRun } from "./runs-DXoQzrw0.js";
import { o as normalizeUsage } from "./usage-C67Kbb7n.js";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-DEyCVA3H.js";
import { a as getBeforeToolCallPolicyDiagnosticState } from "./agent-tools.before-tool-call-CP6dTokt.js";
import { m as loadExecApprovals } from "./exec-approvals-BQlhahST.js";
import { n as runAgentHarnessBeforeMessageWriteHook, t as runAgentHarnessAfterToolCallHook } from "./hook-helpers-C_j_aIUe.js";
import { r as assertContextEngineHostSupport, t as CODEX_APP_SERVER_CONTEXT_ENGINE_HOST } from "./host-compat-BibWlia2.js";
import { a as finalizeHarnessContextEngineTurn, d as runAgentEndSideEffects, i as buildHarnessContextEngineRuntimeContextFromUsage, n as bootstrapHarnessContextEngine, o as isActiveHarnessContextEngine, r as buildHarnessContextEngineRuntimeContext, s as runHarnessContextEngineMaintenance, t as assembleHarnessContextEngine, u as awaitAgentEndSideEffects } from "./context-engine-lifecycle-DtOZmi-k.js";
import { _ as supportsModelTools } from "./openai-transport-stream-CKFLti3C.js";
import { t as log } from "./logger-DibNup0x.js";
import { M as formatToolAggregate } from "./streaming-DDEnlnFD.js";
import { t as buildMemorySystemPromptAddition } from "./delegate-BvkzTDsV.js";
import "./logging-core-D8iC6VAB.js";
import "./number-runtime-DBLVDypr.js";
import { o as resolveSandboxContext } from "./sandbox-yDmlXhAz.js";
import "./security-runtime-ZGC3cmUc.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { n as buildBootstrapContextForFiles, o as resolveBootstrapFilesForRun } from "./bootstrap-files-CAlSvEMW.js";
import { a as runAgentHarnessLlmInputHook, n as getAgentHarnessHookRunner, o as runAgentHarnessLlmOutputHook } from "./lifecycle-hook-helpers-DnHSVpVA.js";
import { n as runAgentCleanupStep } from "./attempt.tool-run-context-BsQZrex8.js";
import "./core-D6I8wZcD.js";
import "./exec-approvals-runtime-DLgLFr0V.js";
import "./ssrf-runtime-CZi-6iMr.js";
import "./media-store-CvjmriWP.js";
import "./agent-runtime-CZ5Y3DkP.js";
import { n as deliverAgentHarnessTaskCompletion, r as isDurableAgentHarnessCompletionDelivery, t as createAgentHarnessTaskRuntime } from "./agent-harness-task-runtime-BHGN-wDP.js";
import { a as inferToolMetaFromArgs, d as runAgentHarnessBeforeCompactionHook, f as buildAgentHarnessUserInputAnswers, i as formatToolProgressOutput, l as resolveAgentHarnessBeforePromptBuildResult, m as emptyAgentHarnessUserInputAnswers, n as classifyAgentHarnessTerminalOutcome, o as loadCodexBundleMcpThreadConfig, p as deliverAgentHarnessUserInputPrompt, t as TOOL_PROGRESS_OUTPUT_MAX_CHARS, u as runAgentHarnessAfterCompactionHook } from "./agent-harness-runtime-B82WFIx6.js";
import "./diagnostic-runtime-BCe2Aywp.js";
import { c as resolveSessionTranscriptTarget, l as withSessionTranscriptWriteLock, r as publishSessionTranscriptUpdateByIdentity } from "./session-transcript-runtime-DzxUlAfq.js";
import { n as generatedImageAssetFromBase64 } from "./image-generation-CUzcZT7_.js";
import "./agent-sessions-CG4ENwMH.js";
import { n as isJsonObject, t as flattenCodexDynamicToolFunctions } from "./protocol-dh-ETiNd.js";
import { A as resolveCodexContextEngineProjectionReserveTokens, D as fitCodexProjectedContextForTurnStart, E as resolveCodexDynamicToolsLoadingForRuntime, H as readCodexNotificationTurnId, M as buildCodexPluginThreadConfigInputFingerprint, N as mergeCodexThreadConfigs, O as projectContextEngineAssemblyForCodex, P as shouldBuildCodexPluginThreadConfig, R as defaultCodexAppInventoryCache, V as readCodexNotificationThreadId, _ as resolveCodexWebSearchPlan, a as buildDeveloperInstructions, b as sanitizeCodexHistoryImagePayloads, c as codexDynamicToolsFingerprint, f as resolveCodexAppServerThreadModelSelection, h as startOrResumeThread, i as buildContextEngineBinding, j as buildCodexPluginThreadConfig, k as resolveCodexContextEngineProjectionMaxChars, l as isContextEngineBindingCompatible, n as areCodexDynamicToolFingerprintsCompatible, o as buildTurnCollaborationMode, s as buildTurnStartParams, v as isCodexAppServerProfilerEnabled, z as describeCodexNotificationCorrelation } from "./thread-lifecycle-Dc5B-aD0.js";
import { C as readCodexNotificationItem, D as updateActiveTurnItemIds, E as shouldDisarmAssistantCompletionIdleWatch, S as isTurnNotification, T as readRawResponseToolCallId, _ as isRawToolOutputCompletionNotification, a as isCodexNotificationOutsideActiveRun, b as isRetryableErrorNotification, c as isCurrentThreadOptionalTurnRequestParams, d as isNativeResponseStreamDeltaNotification, f as isNativeToolProgressNotification, g as isRawReasoningCompletionNotification, h as isRawFunctionToolOutputCompletionNotification, i as isAssistantCompletionReleaseNotification, l as isCurrentThreadTurnRequestParams, m as isRawAssistantProgressNotification, n as describeNotificationActivity, o as isCodexTurnAbortMarkerNotification, p as isPendingOpenClawDynamicToolCompletionNotification, r as isAssistantCommentaryCompletionNotification, s as isCurrentApprovalTurnRequestParams, t as codexExecutionToolName, u as isFileChangePatchUpdatedNotification, v as isReasoningItemCompletionNotification, w as readNotificationItemId, x as isTerminalTurnStatus, y as isReasoningProgressNotification } from "./attempt-notifications-BDNj0US6.js";
import { _ as withMcpElicitationsApprovalPolicy, a as isCodexAppServerApprovalPolicyAllowedByRequirements, d as resolveCodexAppServerRuntimeOptions, f as resolveCodexComputerUseConfig, g as shouldAutoApproveCodexAppServerApprovals, h as resolveOpenClawExecPolicyForCodexAppServer, m as resolveCodexPluginsPolicy, p as resolveCodexModelBackedReviewerPolicyContext, s as isCodexSandboxExecServerEnabled, u as readCodexPluginConfig } from "./config-BtNblzni.js";
import { a as readCodexDynamicToolCallParams, c as readCodexTurn, i as assertCodexTurnStartResponse } from "./protocol-validators-B19q5BIX.js";
import { i as formatCodexUsageLimitErrorMessage, o as resolveCodexUsageLimitResetAtMs, s as shouldRefreshCodexRateLimitsForUsageLimitMessage } from "./provider-C5LKuYLo.js";
import { a as isCodexAppServerConnectionClosedError, i as isCodexAppServerApprovalRequest, n as CodexAppServerRpcError, r as compareCodexAppServerVersions, s as MIN_CODEX_SANDBOX_EXEC_SERVER_APP_SERVER_VERSION } from "./client-DG5eauXE.js";
import { i as isCodexAppServerNativeAuthProfile, l as writeCodexAppServerBinding, n as clearCodexAppServerBinding, o as readCodexAppServerBinding, r as clearCodexAppServerBindingForThread } from "./session-binding-D8CpIERl.js";
import { t as CODEX_CONTROL_METHODS } from "./capabilities-CjLiE3_H.js";
import { a as formatCodexDisplayText, n as resolveCodexAppServerForOpenClawToolPolicy, t as resolveCodexAppServerForModelProvider } from "./app-server-policy-BP1xRJni.js";
import { _ as resolveCodexAppServerAuthProfileId, b as resolveCodexAppServerHomeDir, g as resolveCodexAppServerAuthAccountCacheKey, h as refreshCodexAppServerAuthTokens, i as clearSharedCodexAppServerClientIfCurrentAndUnclaimed, p as retireSharedCodexAppServerClientIfCurrent, r as clearSharedCodexAppServerClientIfCurrent, u as releaseLeasedSharedCodexAppServerClient, v as resolveCodexAppServerAuthProfileIdForAgent, y as resolveCodexAppServerFallbackApiKeyCacheKey } from "./shared-client-BdFUC0J9.js";
import { n as buildCodexPluginAppCacheKey, t as buildCodexAppServerRuntimeFingerprint } from "./plugin-app-cache-key-CUqOxDA6.js";
import { t as defaultLeasedCodexAppServerClientFactory } from "./client-factory-CjaX7DnX.js";
import { A as CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS, C as resolveCodexMessageToolProvider, D as shouldWarnCodexDynamicToolBuildStageSummary, E as shouldRequireCodexSandboxExecServerEnvironment, F as resolveCodexTurnTerminalIdleTimeoutMs, I as withCodexStartupTimeout, M as resolveCodexStartupTimeoutMs, N as resolveCodexTurnAssistantCompletionIdleTimeoutMs, P as resolveCodexTurnCompletionIdleTimeoutMs, S as resolveCodexExternalSandboxPolicyForOpenClawSandbox, T as shouldEnableCodexAppServerNativeToolSurface, _ as createCodexDynamicToolBuildStageTracker, a as buildCodexNativeHookRelayConfig, b as resolveCodexAppServerExecutionCwd, c as resolveCodexNativeHookRelayEvents, d as handleCodexAppServerElicitationRequest, f as createCodexDynamicToolBridge, g as buildDynamicTools, h as emitDynamicToolTerminalDiagnostic, i as CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS, j as resolveCodexPostToolRawAssistantCompletionIdleTimeoutMs, k as handleCodexAppServerApprovalRequest, l as resolveCodexNativeHookRelayTtlMs, m as emitDynamicToolStartedDiagnostic, o as buildCodexNativeHookRelayDisabledConfig, p as emitDynamicToolErrorDiagnostic, s as createCodexNativeHookRelay, t as resolveCodexProviderWebSearchSupport, u as scheduleCodexNativeHookRelayUnregister, v as disableCodexPluginThreadConfig, w as resolveCodexSandboxEnvironmentSelection, x as resolveCodexAppServerHookChannelId, y as formatCodexDynamicToolBuildStageSummary } from "./provider-capabilities-DJcsSFP8.js";
import { t as ensureCodexComputerUse } from "./computer-use-DoNzG8rq.js";
import { n as rememberCodexRateLimits, t as readRecentCodexRateLimits } from "./rate-limit-cache-C7qmZ0Jh.js";
import fs from "node:fs";
import path, { posix } from "node:path";
import fs$1 from "node:fs/promises";
import { spawn } from "node:child_process";
import { isIP } from "node:net";
import { createHash, randomUUID } from "node:crypto";
import { WebSocketServer } from "ws";
import { once } from "node:events";
//#region extensions/codex/src/app-server/attempt-client-cleanup.ts
/**
* Best-effort cleanup helpers for Codex app-server startup attempts and turns.
*/
/** Timeout for best-effort app-server turn interruption during cleanup. */
const CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS = 5e3;
/** Timeout for best-effort thread unsubscribe during cleanup. */
const CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS = 5e3;
async function closeClientAndWaitIfAvailable(client) {
	const closeable = client;
	if (typeof closeable.closeAndWait === "function") {
		await closeable.closeAndWait();
		return;
	}
	closeable.close?.();
}
async function closeCodexStartupClientBestEffort(client) {
	if (!client) return;
	const unclaimedSharedClient = clearSharedCodexAppServerClientIfCurrentAndUnclaimed(client);
	if (unclaimedSharedClient.closed) {
		await closeClientAndWaitIfAvailable(client);
		return;
	}
	if (unclaimedSharedClient.found) {
		if (retireSharedCodexAppServerClientIfCurrent(client)?.closed) await closeClientAndWaitIfAvailable(client);
		return;
	}
	const retiredSharedClient = retireSharedCodexAppServerClientIfCurrent(client);
	if (retiredSharedClient) {
		if (retiredSharedClient.closed) await closeClientAndWaitIfAvailable(client);
		return;
	}
	if (clearSharedCodexAppServerClientIfCurrent(client)) {
		await closeClientAndWaitIfAvailable(client);
		return;
	}
	await closeClientAndWaitIfAvailable(client);
}
/** Sends a turn interrupt without blocking abort cleanup on app-server errors. */
function interruptCodexTurnBestEffort(client, params) {
	const requestOptions = params.timeoutMs && Number.isFinite(params.timeoutMs) && params.timeoutMs > 0 ? { timeoutMs: params.timeoutMs } : void 0;
	const requestParams = {
		threadId: params.threadId,
		turnId: params.turnId
	};
	try {
		const interrupt = requestOptions ? client.request("turn/interrupt", requestParams, requestOptions) : client.request("turn/interrupt", requestParams);
		Promise.resolve(interrupt).catch((error) => {
			log.debug("codex app-server turn interrupt failed during abort", { error });
		});
	} catch (error) {
		log.debug("codex app-server turn interrupt failed during abort", { error });
	}
}
/** Unsubscribes from a thread while swallowing cleanup-only failures. */
async function unsubscribeCodexThreadBestEffort(client, params) {
	try {
		await client.request("thread/unsubscribe", { threadId: params.threadId }, { timeoutMs: params.timeoutMs });
	} catch (error) {
		log.debug("codex app-server thread unsubscribe cleanup failed", {
			threadId: params.threadId,
			error
		});
	}
}
/**
* Retires the shared client after a timed-out turn so later runs do not reuse a
* potentially wedged app-server connection.
*/
async function retireCodexAppServerClientAfterTimedOutTurn(client, params) {
	const retiredSharedClient = retireSharedCodexAppServerClientIfCurrent(client);
	const detachedSharedClient = Boolean(retiredSharedClient);
	interruptCodexTurnBestEffort(client, {
		threadId: params.threadId,
		turnId: params.turnId,
		timeoutMs: CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS
	});
	await unsubscribeCodexThreadBestEffort(client, {
		threadId: params.threadId,
		timeoutMs: CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS
	});
	let closedClient = retiredSharedClient?.closed ?? false;
	if (!detachedSharedClient) {
		const close = client.close;
		if (typeof close === "function") try {
			close.call(client);
			closedClient = true;
		} catch (error) {
			log.debug("codex app-server client close failed during timeout cleanup", {
				threadId: params.threadId,
				turnId: params.turnId,
				error
			});
		}
	}
	log.warn("codex app-server client retired after timed-out turn", {
		threadId: params.threadId,
		turnId: params.turnId,
		reason: params.reason,
		detachedSharedClient,
		closedClient,
		activeSharedClientLeases: retiredSharedClient?.activeLeases ?? 0
	});
}
//#endregion
//#region extensions/codex/src/app-server/session-history.ts
/**
* Reads OpenClaw session history for Codex transcript mirroring and sanitizes
* image payloads before replaying messages into the app-server projector.
*/
/** Returns sanitized session-context messages for a Codex mirrored session file. */
async function readCodexMirroredSessionHistoryMessages(target) {
	try {
		await resolveSessionTranscriptTarget(resolveCodexHistoryTranscriptTarget(target));
		const entries = parseSessionEntries(await fs$1.readFile(target.sessionFile, "utf-8"));
		if (entries.length === 0) return [];
		const firstEntry = entries[0];
		if (firstEntry?.type !== "session" || typeof firstEntry.id !== "string") return;
		migrateSessionEntries(entries);
		return sanitizeCodexHistoryImagePayloads(buildSessionContext(entries.filter((entry) => {
			return entry !== null && typeof entry === "object" && !Array.isArray(entry) && entry.type !== "session";
		})).messages, "codex mirrored history");
	} catch {
		return;
	}
}
function resolveCodexHistoryTranscriptTarget(target) {
	return {
		...target.agentId ? { agentId: target.agentId } : {},
		sessionFile: target.sessionFile,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey ?? ""
	};
}
//#endregion
//#region extensions/codex/src/app-server/attempt-context.ts
/**
* Builds Codex app-server prompt context, workspace bootstrap injections,
* system-prompt reports, and context-engine projection decisions.
*/
const CODEX_NATIVE_PROJECT_DOC_BASENAMES = new Set(["agents.md"]);
const CODEX_INHERITED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES = new Set(["tools.md"]);
const CODEX_TURN_SCOPED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES = new Set([
	"identity.md",
	"soul.md",
	"user.md"
]);
const CODEX_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES = new Set([...CODEX_INHERITED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES, ...CODEX_TURN_SCOPED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES]);
const CODEX_HEARTBEAT_CONTEXT_BASENAME = "heartbeat.md";
const CODEX_MEMORY_CONTEXT_BASENAME = "memory.md";
const CODEX_MEMORY_TOOL_NAMES = new Set(["memory_search", "memory_get"]);
const CODEX_BOOTSTRAP_CONTEXT_ORDER = new Map([
	["soul.md", 10],
	["identity.md", 20],
	["user.md", 30],
	["tools.md", 40],
	["bootstrap.md", 50],
	["memory.md", 60],
	["heartbeat.md", 70]
]);
/** Reads mirrored Codex session history for harness hooks. */
async function readMirroredSessionHistoryMessages(params) {
	const messages = await readCodexMirroredSessionHistoryMessages(params);
	if (!messages) log.warn("failed to read mirrored session history for codex harness hooks", { sessionFile: params.sessionFile });
	return messages;
}
/** Reads a valid thread-bootstrap projection request from context-engine output. */
function readContextEngineThreadBootstrapProjection(projection) {
	if (projection?.mode !== "thread_bootstrap") return;
	const epoch = projection.epoch?.trim();
	if (!epoch) {
		log.warn("context engine requested Codex thread-bootstrap projection without an epoch; using per-turn projection");
		return;
	}
	const fingerprint = projection.fingerprint?.trim();
	return {
		mode: "thread_bootstrap",
		epoch,
		...fingerprint ? { fingerprint } : {}
	};
}
/**
* Decides whether an existing Codex thread can reuse its context-engine
* bootstrap projection or must be reprojected.
*/
function resolveContextEngineBootstrapProjectionDecision(params) {
	const bindingProjection = params.startupBinding?.contextEngine?.projection;
	if (!params.startupBinding?.threadId || !bindingProjection) return {
		project: true,
		reason: !params.startupBinding?.threadId ? "missing-thread-binding" : "missing-projection-binding"
	};
	if (!params.expectedBinding || !isContextEngineBindingCompatible(params.startupBinding.contextEngine, params.expectedBinding)) return {
		project: true,
		reason: "context-engine-binding-mismatch"
	};
	if (!areCodexDynamicToolFingerprintsCompatible({
		previous: params.startupBinding.dynamicToolsFingerprint,
		next: params.dynamicToolsFingerprint
	})) return {
		project: true,
		reason: "dynamic-tools-mismatch"
	};
	return bindingProjection.mode !== "thread_bootstrap" || bindingProjection.epoch !== params.projection.epoch || bindingProjection.fingerprint !== params.projection.fingerprint ? {
		project: true,
		reason: "projection-mismatch"
	} : {
		project: false,
		reason: "matching-thread-bootstrap-binding"
	};
}
/**
* Loads workspace bootstrap files and partitions them into Codex-native prompt,
* developer-instruction, heartbeat, and memory-tool contexts.
*/
async function buildCodexWorkspaceBootstrapContext(params) {
	try {
		const memoryToolsAvailable = params.memoryToolNames.length > 0 && canRouteCodexWorkspaceMemoryThroughTools({
			config: params.params.config,
			agentId: params.params.agentId ?? params.sessionAgentId,
			workspaceDir: params.effectiveWorkspace
		});
		const bootstrapFiles = await resolveBootstrapFilesForRun({
			workspaceDir: params.resolvedWorkspace,
			config: params.params.config,
			sessionKey: params.sessionKey,
			sessionId: params.params.sessionId,
			agentId: params.params.agentId ?? params.sessionAgentId,
			warn: (message) => log.warn(message),
			contextMode: params.params.bootstrapContextMode,
			runKind: params.params.bootstrapContextRunKind
		});
		const memoryToolRoutedBootstrapFiles = memoryToolsAvailable ? selectCodexWorkspaceMemoryReferenceFiles({
			bootstrapFiles,
			workspaceDir: params.resolvedWorkspace
		}) : [];
		const memoryReferenceFiles = memoryToolRoutedBootstrapFiles.map((file) => remapCodexContextFilePath({
			file: toCodexEmbeddedContextFile(file),
			sourceWorkspaceDir: params.resolvedWorkspace,
			targetWorkspaceDir: params.effectiveWorkspace
		}));
		const contextFiles = buildBootstrapContextForFiles(memoryToolsAvailable ? bootstrapFiles.filter((file) => !isCodexWorkspaceRootMemoryBootstrapFile({
			file,
			workspaceDir: params.resolvedWorkspace
		})) : bootstrapFiles, {
			config: params.params.config,
			agentId: params.params.agentId ?? params.sessionAgentId,
			warn: (message) => log.warn(message)
		}).map((file) => remapCodexContextFilePath({
			file,
			sourceWorkspaceDir: params.resolvedWorkspace,
			targetWorkspaceDir: params.effectiveWorkspace
		}));
		const promptContextFiles = selectCodexWorkspacePromptContextFiles(contextFiles, {
			excludeMemory: memoryToolsAvailable,
			memoryWorkspaceDir: params.effectiveWorkspace
		});
		const developerInstructionFiles = shouldInjectCodexOpenClawPromptContext(params.params) ? selectCodexWorkspaceInheritedDeveloperInstructionFiles(contextFiles) : [];
		const turnScopedDeveloperInstructionFiles = shouldInjectCodexOpenClawPromptContext(params.params) ? selectCodexWorkspaceTurnScopedDeveloperInstructionFiles(contextFiles) : [];
		const heartbeatReferenceFiles = selectCodexWorkspaceHeartbeatReferenceFiles(contextFiles);
		return {
			bootstrapFiles,
			contextFiles,
			promptContextFiles,
			developerInstructionFiles,
			turnScopedDeveloperInstructionFiles,
			heartbeatReferenceFiles,
			memoryReferenceFiles,
			memoryToolRoutedBootstrapFiles,
			memoryToolNames: [...params.memoryToolNames],
			memoryToolRouted: memoryToolsAvailable,
			promptContext: renderCodexWorkspaceBootstrapPromptContext(promptContextFiles),
			developerInstructions: renderCodexWorkspaceThreadDeveloperInstructions(developerInstructionFiles),
			turnScopedDeveloperInstructions: renderCodexWorkspaceCollaborationDeveloperInstructions(turnScopedDeveloperInstructionFiles),
			memoryCollaborationInstructions: shouldInjectCodexOpenClawPromptContext(params.params) ? renderCodexWorkspaceMemoryCollaborationInstructions({
				files: memoryReferenceFiles,
				toolNames: params.memoryToolNames,
				memoryToolRouted: memoryToolsAvailable,
				citationsMode: params.params.config?.memory?.citations
			}) : void 0,
			heartbeatCollaborationInstructions: renderCodexWorkspaceHeartbeatReference(heartbeatReferenceFiles)
		};
	} catch (error) {
		log.warn("failed to load codex workspace bootstrap instructions", { error });
		return {
			bootstrapFiles: [],
			contextFiles: []
		};
	}
}
/**
* Builds the prompt-size, bootstrap-file, skill, and tool-schema accounting
* report for a Codex run.
*/
function buildCodexSystemPromptReport(params) {
	const toolEntries = flattenCodexDynamicToolFunctions(params.tools).map(buildCodexToolReportEntry);
	const schemaChars = toolEntries.reduce((sum, tool) => sum + tool.schemaChars, 0);
	const skillsPrompt = params.skillsPrompt.trim();
	const bootstrapMaxChars = readPositiveNumber(params.attempt.config?.agents?.defaults?.bootstrapMaxChars);
	const bootstrapTotalMaxChars = readPositiveNumber(params.attempt.config?.agents?.defaults?.bootstrapTotalMaxChars);
	return {
		source: "run",
		generatedAt: Date.now(),
		sessionId: params.attempt.sessionId,
		sessionKey: params.sessionKey,
		provider: params.attempt.provider,
		model: params.attempt.modelId,
		workspaceDir: params.workspaceDir,
		...bootstrapMaxChars ? { bootstrapMaxChars } : {},
		...bootstrapTotalMaxChars ? { bootstrapTotalMaxChars } : {},
		systemPrompt: {
			chars: params.developerInstructions.length,
			projectContextChars: 0,
			nonProjectContextChars: params.developerInstructions.length,
			hash: sha256Text(params.developerInstructions)
		},
		injectedWorkspaceFiles: buildCodexBootstrapInjectionStats({
			bootstrapFiles: params.workspaceBootstrapContext.bootstrapFiles,
			injectedFiles: params.workspaceBootstrapContext.promptContextFiles ?? [],
			developerInstructionFiles: [...params.workspaceBootstrapContext.developerInstructionFiles ?? [], ...params.workspaceBootstrapContext.turnScopedDeveloperInstructionFiles ?? []],
			memoryToolRoutedBootstrapFiles: params.workspaceBootstrapContext.memoryToolRoutedBootstrapFiles ?? [],
			memoryToolRouted: params.workspaceBootstrapContext.memoryToolRouted === true
		}),
		skills: {
			promptChars: skillsPrompt.length,
			hash: sha256Text(skillsPrompt),
			entries: buildCodexSkillReportEntries(skillsPrompt)
		},
		tools: {
			listChars: 0,
			schemaChars,
			entries: toolEntries
		}
	};
}
function buildCodexSkillReportEntries(skillsPrompt) {
	if (!skillsPrompt) return [];
	return Array.from(skillsPrompt.matchAll(/<skill>[\s\S]*?<\/skill>/gi)).map((match) => match[0] ?? "").map((block) => ({
		name: block.match(/<name>\s*([^<]+?)\s*<\/name>/i)?.[1]?.trim() || "(unknown)",
		blockChars: block.length
	})).filter((entry) => entry.blockChars > 0);
}
function buildCodexToolReportEntry(tool) {
	const summary = tool.description.trim();
	if (tool.deferLoading === true) return {
		name: tool.name,
		summaryChars: summary.length,
		summaryHash: sha256Text(summary),
		schemaChars: 0,
		schemaHash: stableJsonHash(null),
		propertiesCount: null
	};
	return {
		name: tool.name,
		summaryChars: summary.length,
		summaryHash: sha256Text(summary),
		...buildCodexToolSchemaStats(tool.inputSchema)
	};
}
function buildCodexToolSchemaStats(schema) {
	const schemaChars = (() => {
		try {
			return JSON.stringify(schema).length;
		} catch {
			return 0;
		}
	})();
	const properties = isJsonObject(schema) && isJsonObject(schema.properties) ? schema.properties : null;
	return {
		schemaChars,
		schemaHash: stableJsonHash(schema),
		propertiesCount: properties ? Object.keys(properties).length : null
	};
}
function sha256Text(value) {
	return createHash("sha256").update(value).digest("hex");
}
function normalizeForStableHash(value) {
	if (Array.isArray(value)) return value.map((entry) => normalizeForStableHash(entry));
	if (value && typeof value === "object") {
		const record = value;
		return Object.fromEntries(Object.keys(record).toSorted((left, right) => left.localeCompare(right)).map((key) => [key, normalizeForStableHash(record[key])]));
	}
	return value;
}
function stableJsonHash(value) {
	return sha256Text(JSON.stringify(normalizeForStableHash(value)) ?? "null");
}
function buildCodexBootstrapInjectionStats(params) {
	const injectedIndex = indexCodexContextFileContent(params.injectedFiles);
	const developerInstructionIndex = indexCodexContextFileContent(params.developerInstructionFiles ?? []);
	const memoryToolRoutedPaths = new Set((params.memoryToolRoutedBootstrapFiles ?? []).map((file) => readNonEmptyString$1(file.path)).filter(isNonEmptyString$1).map(normalizeCodexContextFilePath));
	return params.bootstrapFiles.map((file) => {
		const fileName = readNonEmptyString$1(file.name);
		const pathValue = readNonEmptyString$1(file.path) ?? fileName ?? "";
		const displayName = (fileName ?? getCodexContextFileDisplayBasename(pathValue)) || pathValue;
		const baseName = getCodexContextFileBasename(pathValue || fileName || "");
		const rawChars = file.missing ? 0 : (file.content ?? "").trimEnd().length;
		const memoryToolRoutedFile = baseName === CODEX_MEMORY_CONTEXT_BASENAME && params.memoryToolRouted === true && memoryToolRoutedPaths.has(normalizeCodexContextFilePath(pathValue));
		const injected = memoryToolRoutedFile ? void 0 : readCodexIndexedContextFileContent(injectedIndex, pathValue, fileName) ?? readCodexIndexedContextFileContent(developerInstructionIndex, pathValue, fileName);
		let injectedChars = memoryToolRoutedFile ? 0 : injected?.length ?? 0;
		let truncated = memoryToolRoutedFile ? false : !file.missing && injectedChars < rawChars;
		if (injected === void 0) {
			if (CODEX_NATIVE_PROJECT_DOC_BASENAMES.has(baseName)) {
				injectedChars = rawChars;
				truncated = false;
			} else if (baseName === CODEX_HEARTBEAT_CONTEXT_BASENAME) {
				injectedChars = 0;
				truncated = false;
			}
		}
		return {
			name: displayName,
			path: pathValue,
			missing: file.missing,
			rawChars,
			injectedChars,
			truncated
		};
	});
}
function indexCodexContextFileContent(files) {
	const byPath = /* @__PURE__ */ new Map();
	const byBaseName = /* @__PURE__ */ new Map();
	for (const file of files) {
		const pathValue = readNonEmptyString$1(file.path);
		if (!pathValue) continue;
		if (!byPath.has(pathValue)) byPath.set(pathValue, file.content);
		const baseName = getCodexContextFileBasename(pathValue);
		if (baseName && !byBaseName.has(baseName)) byBaseName.set(baseName, file.content);
	}
	return {
		byPath,
		byBaseName
	};
}
function readCodexIndexedContextFileContent(index, pathValue, fileName) {
	const pathContent = index.byPath.get(pathValue);
	if (pathContent !== void 0) return pathContent;
	if (fileName) {
		const nameContent = index.byPath.get(fileName);
		if (nameContent !== void 0) return nameContent;
	}
	const baseName = getCodexContextFileBasename(fileName ?? pathValue);
	return baseName ? index.byBaseName.get(baseName) : void 0;
}
function readPositiveNumber(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function readNonEmptyString$1(value) {
	return typeof value === "string" && value.trim().length > 0 ? value : void 0;
}
/**
* Builds OpenClaw-provided workspace prompt context for the current Codex turn.
*/
function buildCodexOpenClawPromptContext(params) {
	if (!shouldInjectCodexOpenClawPromptContext(params.params)) return;
	const sections = [params.workspacePromptContext?.trim() ? [
		"## OpenClaw Workspace Context",
		"",
		params.workspacePromptContext.trim()
	].join("\n") : void 0].filter(isNonEmptyString$1);
	if (sections.length === 0) return;
	return [
		"OpenClaw runtime context for this turn:",
		"Treat this OpenClaw-provided context as supporting project/user reference for the current request.",
		"",
		...sections
	].join("\n");
}
function shouldInjectCodexOpenClawPromptContext(params) {
	return !(params.bootstrapContextMode === "lightweight" && params.bootstrapContextRunKind === "cron");
}
/** Renders loaded OpenClaw skill prompts as Codex collaboration instructions. */
function renderCodexSkillsCollaborationInstructions(params) {
	if (!shouldInjectCodexOpenClawPromptContext(params.attempt)) return;
	return params.skillsPrompt?.trim() ? [
		"## OpenClaw Skills",
		"",
		params.skillsPrompt.trim()
	].join("\n") : void 0;
}
/**
* Prepends OpenClaw context while preserving leading delivery metadata as
* routing guidance instead of user request text.
*/
function prependCodexOpenClawPromptContext(prompt, context, options = {}) {
	const { deliveryHint, prompt: promptWithoutDeliveryHint } = splitLeadingCodexDeliveryHint(prompt);
	if (!context?.trim() && (!deliveryHint || options.preservePromptWithoutContext)) return prompt;
	const promptSection = promptWithoutDeliveryHint.startsWith("OpenClaw assembled context for this turn:") ? promptWithoutDeliveryHint : ["Current user request:", promptWithoutDeliveryHint].join("\n");
	const deliverySection = deliveryHint ? [
		"OpenClaw delivery metadata:",
		"This delivery metadata is runtime routing guidance, not the user's request.",
		deliveryHint
	].join("\n") : void 0;
	return [
		context?.trim(),
		deliverySection,
		promptSection
	].filter(Boolean).join("\n\n");
}
/**
* Maps the surviving user-request portion of an input range after delivery
* metadata has been relocated before the request.
*/
function resolveCodexDeliveryHintPreservedInputRange(params) {
	const { prompt, promptInputRange, decoratedPrompt } = params;
	const { deliveryHint, prompt: promptWithoutDeliveryHint } = splitLeadingCodexDeliveryHint(prompt);
	if (!deliveryHint || !promptInputRange || promptInputRange.start < 0 || promptInputRange.end < promptInputRange.start || promptInputRange.end > prompt.length || !decoratedPrompt.endsWith(promptWithoutDeliveryHint)) return;
	const promptWithoutDeliveryHintStart = prompt.length - promptWithoutDeliveryHint.length;
	const inputStart = Math.max(promptInputRange.start, promptWithoutDeliveryHintStart);
	const inputEnd = Math.max(inputStart, Math.min(promptInputRange.end, promptWithoutDeliveryHint.length + promptWithoutDeliveryHintStart));
	const decoratedPromptSuffixStart = decoratedPrompt.length - promptWithoutDeliveryHint.length;
	const requestHeader = "Current user request:\n";
	const requestHeaderStart = decoratedPromptSuffixStart - 22;
	return {
		start: inputStart === promptWithoutDeliveryHintStart && decoratedPrompt.slice(requestHeaderStart, decoratedPromptSuffixStart) === requestHeader ? requestHeaderStart : decoratedPromptSuffixStart + inputStart - promptWithoutDeliveryHintStart,
		end: decoratedPromptSuffixStart + inputEnd - promptWithoutDeliveryHintStart
	};
}
function splitLeadingCodexDeliveryHint(prompt) {
	const trimmedStart = prompt.trimStart();
	const matchedHint = MESSAGE_TOOL_DELIVERY_HINTS.find((hint) => trimmedStart.startsWith(hint));
	if (!matchedHint) return { prompt };
	return {
		deliveryHint: matchedHint,
		prompt: trimmedStart.slice(matchedHint.length).replace(/^\s*\n/, "").trimStart()
	};
}
function renderCodexWorkspaceBootstrapPromptContext(contextFiles) {
	const files = contextFiles;
	if (files.length === 0) return;
	const lines = [
		"OpenClaw loaded these user-editable workspace files for the current turn. Codex loads AGENTS.md natively. TOOLS.md is provided as inherited Codex developer instructions. SOUL.md, IDENTITY.md, and USER.md are provided as turn-scoped collaboration instructions so native Codex subagents do not inherit them. HEARTBEAT.md is handled by heartbeat collaboration-mode guidance. Those files are not repeated here.",
		"",
		"# Project Context",
		"",
		"The following project context files have been loaded:"
	];
	lines.push("");
	for (const file of files) lines.push(`## ${file.path}`, "", file.content, "");
	return lines.join("\n").trim();
}
function selectCodexWorkspacePromptContextFiles(contextFiles, options = {}) {
	const excludeMemory = options.excludeMemory ?? true;
	return contextFiles.filter((file) => {
		const baseName = getCodexContextFileBasename(file.path);
		return baseName && !CODEX_NATIVE_PROJECT_DOC_BASENAMES.has(baseName) && !CODEX_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES.has(baseName) && baseName !== CODEX_HEARTBEAT_CONTEXT_BASENAME && (!excludeMemory || !isCodexWorkspaceRootMemoryContextFile({
			file,
			workspaceDir: options.memoryWorkspaceDir
		})) && !isMissingCodexBootstrapContextFile(file);
	}).toSorted(compareCodexContextFiles);
}
function selectCodexWorkspaceInheritedDeveloperInstructionFiles(contextFiles) {
	return selectCodexWorkspaceDeveloperInstructionFiles(contextFiles, CODEX_INHERITED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES);
}
function selectCodexWorkspaceTurnScopedDeveloperInstructionFiles(contextFiles) {
	return selectCodexWorkspaceDeveloperInstructionFiles(contextFiles, CODEX_TURN_SCOPED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES);
}
function selectCodexWorkspaceDeveloperInstructionFiles(contextFiles, basenames) {
	return contextFiles.filter((file) => {
		const baseName = getCodexContextFileBasename(file.path);
		return baseName && basenames.has(baseName) && !isMissingCodexBootstrapContextFile(file) && file.content.trim().length > 0;
	}).toSorted(compareCodexContextFiles);
}
function renderCodexWorkspaceThreadDeveloperInstructions(files) {
	return renderCodexWorkspaceDeveloperInstructions({
		files,
		header: "## OpenClaw Workspace Instructions",
		preamble: "OpenClaw loaded these workspace instruction files from the active agent workspace. Internalize and follow them accordingly."
	});
}
function renderCodexWorkspaceCollaborationDeveloperInstructions(files) {
	return renderCodexWorkspaceDeveloperInstructions({
		files,
		header: "## OpenClaw Agent Soul",
		preamble: "OpenClaw loaded these workspace instruction files from the active agent workspace. They are the canonical definitions of who you are, how you think and work, and the human you work alongside. Internalize and follow them accordingly.",
		wrapperTag: "AGENT_SOUL"
	});
}
function renderCodexWorkspaceDeveloperInstructions(params) {
	const { files, header, preamble, wrapperTag } = params;
	if (files.length === 0) return;
	const lines = [
		header,
		"",
		preamble,
		""
	];
	if (wrapperTag) lines.push(`<${wrapperTag}>`, "");
	for (const file of files) lines.push(`### ${file.path}`, "", file.content, "");
	if (wrapperTag) lines.push(`</${wrapperTag}>`);
	return lines.join("\n").trim();
}
function selectCodexWorkspaceHeartbeatReferenceFiles(contextFiles) {
	return contextFiles.filter((file) => {
		return getCodexContextFileBasename(file.path) === CODEX_HEARTBEAT_CONTEXT_BASENAME && !isMissingCodexBootstrapContextFile(file) && file.content.trim().length > 0;
	}).toSorted(compareCodexContextFiles);
}
function renderCodexWorkspaceHeartbeatReference(files) {
	if (files.length === 0) return;
	const lines = [
		"## OpenClaw Heartbeat Workspace",
		"",
		"HEARTBEAT.md exists in the active agent workspace. Read it before proceeding with this heartbeat, then decide what action is appropriate.",
		""
	];
	for (const file of files) lines.push(`- ${file.path}`);
	return lines.join("\n").trim();
}
function selectCodexWorkspaceMemoryReferenceFiles(params) {
	return params.bootstrapFiles.filter((file) => {
		return isCodexWorkspaceRootMemoryBootstrapFile({
			file,
			workspaceDir: params.workspaceDir
		}) && !file.missing && (file.content ?? "").trim().length > 0;
	}).toSorted(compareCodexBootstrapFiles);
}
/**
* Renders a memory-file reference that points Codex at memory tools instead of
* embedding MEMORY.md contents.
*/
function renderCodexWorkspaceMemoryReference(params) {
	if (params.files.length === 0) return;
	const lines = [
		"## OpenClaw Workspace Memory",
		"",
		`MEMORY.md exists in the active agent workspace as a memory file, not an instruction file. OpenClaw does not paste its contents into native Codex turns; use ${(params.toolNames?.length ? params.toolNames : Array.from(CODEX_MEMORY_TOOL_NAMES)).join(" or ")} when durable memory is relevant and the tools are available.`,
		""
	];
	for (const file of params.files) lines.push(`- ${file.path}`);
	return lines.join("\n").trim();
}
function renderCodexWorkspaceMemoryCollaborationInstructions(params) {
	const sections = [params.memoryToolRouted ? renderCodexMemoryRecallInstructions({
		toolNames: params.toolNames,
		citationsMode: params.citationsMode
	}) : void 0, renderCodexWorkspaceMemoryReference({
		files: params.files,
		toolNames: params.toolNames
	})].filter(isNonEmptyString$1);
	return sections.length > 0 ? sections.join("\n\n") : void 0;
}
function renderCodexMemoryRecallInstructions(params) {
	const memoryPrompt = buildMemorySystemPromptAddition({
		availableTools: new Set(params.toolNames),
		citationsMode: params.citationsMode
	});
	if (!memoryPrompt) return;
	return [memoryPrompt, renderCodexMemoryToolSearchBridge(params.toolNames)].filter(isNonEmptyString$1).join("\n").trim();
}
function renderCodexMemoryToolSearchBridge(toolNames) {
	const memoryToolNames = toolNames.map((name) => normalizeCodexDynamicToolName(name)).filter((name) => CODEX_MEMORY_TOOL_NAMES.has(name)).toSorted();
	if (memoryToolNames.length === 0) return;
	return `Codex may expose ${memoryToolNames.join(" and ")} as deferred tools. When the memory guidance above calls for memory recall, use an already-loaded memory tool directly. If the needed memory tool is deferred and not currently callable, use \`tool_search\` to load it, then call that memory tool.`;
}
/** Lists available memory tool names understood by Codex workspace memory routing. */
function getCodexWorkspaceMemoryToolNames(tools) {
	const availableToolNames = new Set(flattenCodexDynamicToolFunctions(tools).map((tool) => normalizeCodexDynamicToolName(tool.name)));
	return Array.from(CODEX_MEMORY_TOOL_NAMES).filter((name) => availableToolNames.has(name));
}
function canRouteCodexWorkspaceMemoryThroughTools(params) {
	if (!params.config) return false;
	return isSameCodexWorkspacePath(resolveAgentWorkspaceDir(params.config, params.agentId), params.workspaceDir);
}
function isMissingCodexBootstrapContextFile(file) {
	return file.content.trimStart().startsWith("[MISSING] Expected at:");
}
function toCodexEmbeddedContextFile(file) {
	return {
		path: readNonEmptyString$1(file.path) ?? readNonEmptyString$1(file.name) ?? "",
		content: file.content ?? ""
	};
}
function isCodexWorkspaceRootMemoryBootstrapFile(params) {
	return isCodexWorkspaceRootMemoryPath({
		filePath: readNonEmptyString$1(params.file.path) ?? readNonEmptyString$1(params.file.name) ?? "",
		workspaceDir: params.workspaceDir
	});
}
function isCodexWorkspaceRootMemoryContextFile(params) {
	if (!params.workspaceDir) return false;
	return isCodexWorkspaceRootMemoryPath({
		filePath: params.file.path,
		workspaceDir: params.workspaceDir
	});
}
function isCodexWorkspaceRootMemoryPath(params) {
	const filePath = params.filePath.trim();
	if (!filePath) return false;
	return (path.isAbsolute(filePath) ? path.resolve(filePath) : path.resolve(params.workspaceDir, filePath)) === path.join(path.resolve(params.workspaceDir), "MEMORY.md");
}
function isSameCodexWorkspacePath(left, right) {
	return path.resolve(left) === path.resolve(right);
}
/**
* Remaps bootstrap file paths from the resolved workspace to the effective Codex
* workspace while preserving platform path separators.
*/
function remapCodexContextFilePath(params) {
	const relativePath = path.relative(params.sourceWorkspaceDir, params.file.path);
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath) || params.sourceWorkspaceDir === params.targetWorkspaceDir) return params.file;
	const targetUsesPosixSeparators = params.targetWorkspaceDir.includes("/") && !params.targetWorkspaceDir.includes("\\");
	const normalizedRelativePath = targetUsesPosixSeparators ? relativePath.replaceAll("\\", "/") : relativePath.replaceAll("/", "\\");
	return {
		...params.file,
		path: targetUsesPosixSeparators ? path.posix.join(params.targetWorkspaceDir, normalizedRelativePath) : path.win32.join(params.targetWorkspaceDir, normalizedRelativePath)
	};
}
function compareCodexContextFiles(left, right) {
	const leftPath = normalizeCodexContextFilePath(left.path);
	const rightPath = normalizeCodexContextFilePath(right.path);
	const leftBase = getCodexContextFileBasename(left.path);
	const rightBase = getCodexContextFileBasename(right.path);
	const leftOrder = CODEX_BOOTSTRAP_CONTEXT_ORDER.get(leftBase) ?? Number.MAX_SAFE_INTEGER;
	const rightOrder = CODEX_BOOTSTRAP_CONTEXT_ORDER.get(rightBase) ?? Number.MAX_SAFE_INTEGER;
	if (leftOrder !== rightOrder) return leftOrder - rightOrder;
	if (leftBase !== rightBase) return leftBase.localeCompare(rightBase);
	return leftPath.localeCompare(rightPath);
}
function compareCodexBootstrapFiles(left, right) {
	return compareCodexContextFiles(toCodexEmbeddedContextFile(left), toCodexEmbeddedContextFile(right));
}
function normalizeCodexContextFilePath(filePath) {
	return filePath.trim().replaceAll("\\", "/").toLowerCase();
}
function getCodexContextFileDisplayBasename(filePath) {
	return filePath.trim().replaceAll("\\", "/").split("/").pop()?.trim() ?? "";
}
function getCodexContextFileBasename(filePath) {
	return normalizeCodexContextFilePath(filePath).split("/").pop() ?? "";
}
function normalizeCodexDynamicToolName(name) {
	return name.trim().toLowerCase();
}
function isNonEmptyString$1(value) {
	return typeof value === "string" && value.length > 0;
}
//#endregion
//#region extensions/codex/src/app-server/attempt-diagnostics.ts
/**
* Diagnostic helpers for Codex app-server model calls and plugin-thread config
* eligibility.
*/
/** Reads a tool schema field in either app-server or OpenClaw naming. */
function readCodexDiagnosticToolParameters(tool) {
	return tool.inputSchema ?? tool.parameters;
}
/** Builds compact diagnostic tool definitions for trusted private telemetry. */
function buildCodexDiagnosticToolDefinitions(tools) {
	return tools.map((tool) => ({
		name: tool.name,
		description: tool.description,
		parameters: readCodexDiagnosticToolParameters(tool)
	}));
}
/** Returns the serialized UTF-8 byte length for a JSON-compatible value. */
function utf8JsonByteLength(value) {
	try {
		return Buffer.byteLength(JSON.stringify(value), "utf8");
	} catch {
		return;
	}
}
/** Builds a short namespaced fingerprint for sensitive log values. */
function fingerprintCodexLogValue(namespace, value) {
	const hash = createHash("sha256");
	hash.update(namespace);
	hash.update("\0");
	hash.update(value);
	return `sha256:${hash.digest("hex").slice(0, 16)}`;
}
/**
* Builds redacted diagnostics explaining whether plugin thread config was
* eligible for a Codex app-server attempt.
*/
function buildCodexPluginThreadConfigEligibilityLogData(params) {
	return {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		enabled: params.pluginThreadConfigRequired,
		policyConfigured: params.resolvedPluginPolicy?.configured === true,
		policyEnabled: params.resolvedPluginPolicy?.enabled === true,
		pluginConfigKeys: params.resolvedPluginPolicy?.pluginPolicies.map((plugin) => plugin.configKey).toSorted(),
		enabledPluginConfigKeys: params.enabledPluginConfigKeys,
		appCacheKeyFingerprint: fingerprintCodexLogValue("openclaw:codex:plugin-app-cache-key:v1", params.pluginAppCacheKey),
		authProfileId: params.startupAuthProfileId,
		appServerTransport: params.appServer.start.transport,
		appServerCommandSource: params.appServer.start.commandSource
	};
}
/**
* Creates lifecycle emitters for trusted model-call diagnostics with optional
* private payload capture.
*/
function createCodexModelCallDiagnosticEmitter(params) {
	const now = params.now ?? (() => Date.now());
	const toolDefinitions = params.capture.toolDefinitions ? buildCodexDiagnosticToolDefinitions(params.tools) : void 0;
	let startedAt = now();
	let started = false;
	let terminalEmitted = false;
	let requestPayloadBytes;
	const privateData = (modelContent) => modelContent && Object.keys(modelContent).length > 0 ? { modelContent } : void 0;
	const buildContent = () => {
		const modelContent = {
			...params.capture.inputMessages ? { inputMessages: params.buildInputMessages() } : {},
			...params.capture.systemPrompt ? { systemPrompt: params.buildSystemPrompt() } : {},
			...toolDefinitions ? { toolDefinitions } : {}
		};
		return Object.keys(modelContent).length > 0 ? modelContent : void 0;
	};
	const requestPayloadBytesField = () => requestPayloadBytes !== void 0 ? { requestPayloadBytes } : {};
	return {
		setRequestPayloadBytes(bytes) {
			requestPayloadBytes = bytes;
		},
		emitStarted() {
			startedAt = now();
			started = true;
			emitTrustedDiagnosticEventWithPrivateData({
				type: "model.call.started",
				...params.baseFields
			}, privateData(buildContent()));
		},
		emitCompleted(result) {
			if (!started || terminalEmitted) return;
			terminalEmitted = true;
			emitTrustedDiagnosticEventWithPrivateData({
				type: "model.call.completed",
				...params.baseFields,
				durationMs: Math.max(0, now() - startedAt),
				...requestPayloadBytesField()
			}, privateData({
				...buildContent(),
				...params.capture.outputMessages ? { outputMessages: result.lastAssistant ? [result.lastAssistant] : result.assistantTexts } : {}
			}));
		},
		emitError(error, fields = {}) {
			if (!started || terminalEmitted) return;
			terminalEmitted = true;
			emitTrustedDiagnosticEventWithPrivateData({
				type: "model.call.error",
				...params.baseFields,
				durationMs: Math.max(0, now() - startedAt),
				errorCategory: fields.failureKind ?? "error",
				...fields.failureKind ? { failureKind: fields.failureKind } : {},
				...requestPayloadBytesField()
			}, privateData({
				...buildContent(),
				...params.capture.outputMessages ? { outputMessages: [] } : {}
			}));
			params.onErrorDiagnostic?.(error);
		}
	};
}
/** Classifies model-call failures into timeout/abort buckets for diagnostics. */
function classifyCodexModelCallFailureKind(params) {
	if (params.timedOut || params.turnCompletionIdleTimedOut) return "timeout";
	const errorMessage = params.error ? params.formatError(params.error).toLowerCase() : "";
	if (errorMessage.includes("timed out") || errorMessage.includes("timeout")) return "timeout";
	if (params.runAborted && !params.clientClosedAbort) return (typeof params.abortReason === "string" ? params.abortReason.toLowerCase() : params.abortReason ? params.formatError(params.abortReason).toLowerCase() : "").includes("timeout") ? "timeout" : "aborted";
	return errorMessage.includes("aborted") ? "aborted" : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/attempt-notification-state.ts
/**
* State machine for Codex app-server turn notifications and idle-watch updates.
*/
/** Emits coarse execution phases exactly once from app-server notifications. */
function reportCodexExecutionNotification(params) {
	const { notification } = params;
	if (notification.method === "turn/started") {
		params.emitExecutionPhaseOnce("turn_accepted", { phase: "turn_accepted" });
		return;
	}
	if (notification.method === "item/agentMessage/delta") {
		params.emitExecutionPhaseOnce("assistant_output_started", { phase: "assistant_output_started" });
		return;
	}
	if (notification.method !== "item/started") return;
	const item = readCodexNotificationItem(notification.params);
	const tool = item ? codexExecutionToolName(item) : void 0;
	if (!item || !tool) return;
	params.emitExecutionPhaseOnce(`tool:${item.id}`, {
		phase: "tool_execution_started",
		tool,
		itemId: item.id
	});
}
/** Returns true when a notification ends the current app-server turn. */
function isTerminalCodexTurnNotificationForTurn(params) {
	if (!isTurnNotification(params.notification.params, params.threadId, params.turnId)) return false;
	return params.notification.method === "turn/completed" || isCodexTurnAbortMarkerNotification(params.notification, { currentPromptTexts: params.currentPromptTexts });
}
/**
* Applies one notification to active item tracking, idle watches, and terminal
* turn state.
*/
function applyCodexTurnNotificationState(params) {
	const { notification, turnWatches } = params;
	const isCurrentTurnNotification = isTurnNotification(notification.params, params.threadId, params.turnId);
	const isTurnCompletion = notification.method === "turn/completed" && isCurrentTurnNotification;
	const isNativeResponseStreamDelta = isNativeResponseStreamDeltaNotification(notification);
	let turnCrossedToolHandoff = params.turnCrossedToolHandoff;
	if (isCurrentTurnNotification && !isNativeResponseStreamDelta) {
		turnWatches.touchActivity(`notification:${notification.method}`, {
			details: describeNotificationActivity(notification),
			attemptProgress: true
		});
		params.onReportExecutionNotification(notification);
		updateActiveTurnItemIds(notification, params.activeTurnItemIds);
		if (notification.method === "item/completed" && params.activeTurnItemIds.size === 0) params.onScheduleTerminalDynamicToolReleaseCheck();
	}
	const unblockedAssistantCompletionRelease = isCurrentTurnNotification && turnWatches.isAssistantCompletionIdleWatchArmed() && notification.method === "item/completed" && params.activeTurnItemIds.size === 0;
	const trackedDynamicToolCompletion = isPendingOpenClawDynamicToolCompletionNotification(notification, params.pendingOpenClawDynamicToolCompletionIds);
	const rawToolOutputCompletion = isRawToolOutputCompletionNotification(notification);
	if (isCurrentTurnNotification && (rawToolOutputCompletion || isNativeToolProgressNotification(notification))) turnCrossedToolHandoff = true;
	const assistantCompletionCanRelease = isAssistantCompletionReleaseNotification(notification, turnCrossedToolHandoff);
	const postToolProgressNeedsTerminalGuard = isCurrentTurnNotification && turnCrossedToolHandoff && ((isRawAssistantProgressNotification(notification) || isRawReasoningCompletionNotification(notification)) && params.activeTurnItemIds.size === 0 || isReasoningProgressNotification(notification));
	const postToolPatchUpdateNeedsTerminalGuard = isCurrentTurnNotification && turnCrossedToolHandoff && isFileChangePatchUpdatedNotification(notification);
	const rawResponseItemCompletedWithNoActiveItems = isCurrentTurnNotification && notification.method === "rawResponseItem/completed" && params.activeTurnItemIds.size === 0 && params.activeAppServerTurnRequests === 0 && !assistantCompletionCanRelease && !postToolProgressNeedsTerminalGuard && !rawToolOutputCompletion;
	const shouldArmNoToolPostProgressReplyWatch = isCurrentTurnNotification && !turnCrossedToolHandoff && params.activeTurnItemIds.size === 0 && (isReasoningItemCompletionNotification(notification) || isAssistantCommentaryCompletionNotification(notification));
	const shouldArmNoToolPostRawProgressReplyWatch = !turnCrossedToolHandoff && rawResponseItemCompletedWithNoActiveItems && (isRawReasoningCompletionNotification(notification) || isRawAssistantProgressNotification(notification));
	const shouldRearmCompletionIdleWatchAfterLastCurrentTurnItem = isCurrentTurnNotification && notification.method === "item/completed" && params.activeTurnItemIds.size === 0 && !trackedDynamicToolCompletion && !assistantCompletionCanRelease && !shouldArmNoToolPostProgressReplyWatch;
	const shouldUsePostToolContinuationWatch = turnCrossedToolHandoff && (postToolProgressNeedsTerminalGuard || postToolPatchUpdateNeedsTerminalGuard || rawToolOutputCompletion || trackedDynamicToolCompletion || shouldRearmCompletionIdleWatchAfterLastCurrentTurnItem);
	const armPostToolContinuationWatch = () => {
		turnWatches.armCompletionIdleWatch({ timeoutMs: params.postToolRawAssistantCompletionIdleTimeoutMs });
		turnWatches.extendAttemptIdleWatch(params.postToolRawAssistantCompletionIdleTimeoutMs);
	};
	const armPostProgressReplyWatch = () => {
		turnWatches.armCompletionIdleWatch({ timeoutMs: CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS });
		turnWatches.extendAttemptIdleWatch(CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS);
	};
	if (isCurrentTurnNotification && notification.method === "error") {
		if (isRetryableErrorNotification(notification.params)) turnWatches.disarmCompletionIdleWatch();
		else turnWatches.armCompletionIdleWatch({ pinnedByTerminalError: true });
		turnWatches.disarmAssistantCompletionIdleWatch();
	} else if (isTurnCompletion) turnWatches.disarmAssistantCompletionIdleWatch();
	else if (isCurrentTurnNotification && assistantCompletionCanRelease) turnWatches.armAssistantCompletionIdleWatch(describeNotificationActivity(notification));
	else if (postToolProgressNeedsTerminalGuard || postToolPatchUpdateNeedsTerminalGuard) armPostToolContinuationWatch();
	else if (shouldArmNoToolPostProgressReplyWatch || shouldArmNoToolPostRawProgressReplyWatch) armPostProgressReplyWatch();
	else if (trackedDynamicToolCompletion) armPostToolContinuationWatch();
	else if (unblockedAssistantCompletionRelease) turnWatches.armAssistantCompletionIdleWatch(describeNotificationActivity(notification));
	else if (shouldRearmCompletionIdleWatchAfterLastCurrentTurnItem) if (shouldUsePostToolContinuationWatch) armPostToolContinuationWatch();
	else turnWatches.armCompletionIdleWatch();
	else if (rawResponseItemCompletedWithNoActiveItems) turnWatches.armCompletionIdleWatch();
	else if (isCurrentTurnNotification && rawToolOutputCompletion) armPostToolContinuationWatch();
	else if (isCurrentTurnNotification && shouldDisarmAssistantCompletionIdleWatch(notification)) turnWatches.disarmAssistantCompletionIdleWatch();
	if (turnWatches.isCompletionIdleWatchArmed() && !turnWatches.isCompletionIdleWatchPinnedByTerminalError() && notification.method !== "turn/completed" && isCurrentTurnNotification && !isNativeResponseStreamDelta && !trackedDynamicToolCompletion && !rawToolOutputCompletion && !postToolProgressNeedsTerminalGuard && !postToolPatchUpdateNeedsTerminalGuard && !rawResponseItemCompletedWithNoActiveItems && !shouldArmNoToolPostProgressReplyWatch && !shouldArmNoToolPostRawProgressReplyWatch && !shouldRearmCompletionIdleWatchAfterLastCurrentTurnItem) turnWatches.disarmCompletionIdleWatch();
	if (trackedDynamicToolCompletion) {
		const itemId = readNotificationItemId(notification);
		if (itemId) {
			params.pendingOpenClawDynamicToolCompletionIds.delete(itemId);
			params.onScheduleTerminalDynamicToolReleaseCheck();
		}
	}
	return {
		isCurrentTurnNotification,
		isTurnAbortMarker: isCurrentTurnNotification && isCodexTurnAbortMarkerNotification(notification, { currentPromptTexts: params.currentPromptTexts }),
		isTurnTerminal: isTerminalCodexTurnNotificationForTurn({
			notification,
			threadId: params.threadId,
			turnId: params.turnId,
			currentPromptTexts: params.currentPromptTexts
		}),
		turnCrossedToolHandoff
	};
}
//#endregion
//#region extensions/codex/src/app-server/attempt-results.ts
const CODEX_APP_SERVER_MISSING_TERMINAL_EVENT_USER_MESSAGE = "Codex stopped before confirming the turn was complete. The response may be incomplete; retry if needed.";
const CODEX_APP_SERVER_MISSING_TERMINAL_EVENT_SIDE_EFFECT_USER_MESSAGE = "Codex stopped before confirming the turn was complete. Some work may already have been performed; verify the current state before retrying.";
/** Joins terminal assistant text blocks into the final attempt answer. */
function collectTerminalAssistantText(result) {
	return result.assistantTexts.join("\n\n").trim();
}
/**
* Builds the user-facing timeout outcome when Codex stops without a terminal
* turn event.
*/
function buildCodexAppServerPromptTimeoutOutcome(params) {
	if (!params.turnCompletionIdleTimedOut) return;
	if (params.turnWatchTimeoutKind !== void 0 && params.turnWatchTimeoutKind !== "completion") return;
	const replayBlockedReason = resolveCodexAppServerReplayBlockedReason(params.result);
	return {
		message: replayBlockedReason === "tool_activity" || replayBlockedReason === "potential_side_effect" || replayBlockedReason === "active_item" ? CODEX_APP_SERVER_MISSING_TERMINAL_EVENT_SIDE_EFFECT_USER_MESSAGE : CODEX_APP_SERVER_MISSING_TERMINAL_EVENT_USER_MESSAGE,
		...replayBlockedReason ? {
			replayInvalid: true,
			livenessState: "abandoned"
		} : {}
	};
}
/** Explains why an incomplete app-server turn cannot be safely replayed. */
function resolveCodexAppServerReplayBlockedReason(result) {
	if (result.replayMetadata.hadPotentialSideEffects) return "potential_side_effect";
	if (result.assistantTexts.some((text) => text.trim().length > 0)) return "assistant_output";
	if (result.toolMetas.length > 0 || result.clientToolCalls || result.lastToolError || result.didSendDeterministicApprovalPrompt) return "tool_activity";
	if (result.itemLifecycle.startedCount > 0 || result.itemLifecycle.activeCount > 0) return "active_item";
}
/** Builds an attempt result for failures before the app-server turn starts. */
function buildCodexTurnStartFailureResult(params) {
	return {
		aborted: false,
		externalAbort: false,
		timedOut: false,
		idleTimedOut: false,
		timedOutDuringCompaction: false,
		timedOutDuringToolExecution: false,
		promptError: params.message,
		promptErrorSource: "prompt",
		sessionIdUsed: params.params.sessionId,
		messagesSnapshot: params.messagesSnapshot,
		assistantTexts: [],
		toolMetas: [],
		lastAssistant: void 0,
		currentAttemptAssistant: void 0,
		didSendViaMessagingTool: false,
		messagingToolSentTexts: [],
		messagingToolSentMediaUrls: [],
		messagingToolSentTargets: [],
		messagingToolSourceReplyPayloads: [],
		cloudCodeAssistFormatError: false,
		replayMetadata: {
			hadPotentialSideEffects: false,
			replaySafe: true
		},
		itemLifecycle: {
			startedCount: 0,
			completedCount: 0,
			activeCount: 0
		},
		systemPromptReport: params.systemPromptReport
	};
}
/** Detects app-server errors caused by invalid image payload data. */
function isInvalidCodexImagePayloadError(message) {
	if (typeof message !== "string" || !message.trim()) return false;
	const normalizedMessage = message.replace(/[_-]+/gu, " ");
	return /\b(?:invalid|malformed)\b[\s\S]{0,120}\b(?:image|image url|base64)\b/iu.test(normalizedMessage) || /\b(?:image|image url|base64)\b[\s\S]{0,120}\b(?:invalid|malformed)\b/iu.test(normalizedMessage);
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/json-rpc.ts
/** JSON-RPC error code used when a sandbox exec-server method is unknown. */
const JSON_RPC_NOT_FOUND = -32004;
/** Protocol-level error carrying the JSON-RPC error code to send to the client. */
var JsonRpcProtocolError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
};
/** Parses raw WebSocket data into a JSON-RPC request object. */
function parseRequest(data) {
	const text = (Array.isArray(data) ? Buffer.concat(data) : Buffer.isBuffer(data) ? data : Buffer.from(data)).toString("utf8");
	return requireObject(JSON.parse(text), "JSON-RPC request");
}
/** Validates that a JSON value is a non-array object. */
function requireObject(value, label) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
	return value;
}
/** Validates a non-empty string JSON-RPC parameter. */
function requireString(value, label) {
	if (typeof value !== "string" || !value) throw new Error(`${label} must be a non-empty string.`);
	return value;
}
/** Validates a base64 payload parameter as a string; decoding happens at call sites. */
function requireBase64String(value, label) {
	if (typeof value !== "string") throw new Error(`${label} must be a string.`);
	return value;
}
/** Validates a finite numeric JSON-RPC parameter. */
function requireNumber(value, label) {
	if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${label} must be a finite number.`);
	return value;
}
/** Validates a non-empty string-array JSON-RPC parameter. */
function requireStringArray(value, label) {
	if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) throw new Error(`${label} must be a string array.`);
	if (value.length === 0) throw new Error(`${label} must not be empty.`);
	return value;
}
/** Reads HTTP headers from JSON-RPC params, defaulting to an empty header list. */
function readHttpHeaders(value) {
	if (!Array.isArray(value)) return [];
	return value.map((entry, index) => {
		const record = requireObject(entry, `header ${index}`);
		return {
			name: requireString(record.name, "header name"),
			value: requireString(record.value, "header value")
		};
	});
}
/** Sends a JSON-RPC success response over the WebSocket. */
function sendResult(socket, id, result) {
	socket.send(JSON.stringify({
		jsonrpc: "2.0",
		id,
		result: result === void 0 ? {} : result
	}));
}
/** Sends a JSON-RPC error response over the WebSocket. */
function sendError(socket, id, code, message) {
	socket.send(JSON.stringify({
		jsonrpc: "2.0",
		id: id ?? null,
		error: {
			code,
			message
		}
	}));
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/fs-policy.ts
/**
* Resolves Codex filesystem sandbox policy payloads into OpenClaw path/glob
* checks for sandbox exec-server filesystem operations.
*/
/** Resolves request-local sandbox policy and asserts each requested path has the needed access. */
function assertFsSandboxAccess(execServer, record, requests) {
	assertResolvedFsSandboxAccess(resolveFsSandboxPolicy(execServer, record), requests);
}
/** Parses a Codex managed filesystem sandbox context into normalized access entries. */
function resolveFsSandboxPolicy(execServer, record) {
	if (record.sandbox === void 0 || record.sandbox === null) return;
	const sandbox = requireObject(record.sandbox, "fs sandbox context");
	const permissions = requireObject(sandbox.permissions, "fs sandbox permissions");
	const permissionType = requireString(permissions.type, "fs sandbox permissions type");
	if (permissionType === "disabled" || permissionType === "external") return {
		unrestricted: true,
		entries: []
	};
	if (permissionType !== "managed") throw new Error(`Unsupported Codex fs sandbox permission type: ${permissionType}`);
	const fileSystem = requireObject(permissions.file_system, "fs sandbox file system permissions");
	const fileSystemType = requireString(fileSystem.type, "fs sandbox file system permissions type");
	if (fileSystemType === "unrestricted") return {
		unrestricted: true,
		entries: []
	};
	if (fileSystemType !== "restricted") throw new Error(`Unsupported Codex fs sandbox file system type: ${fileSystemType}`);
	if (!Array.isArray(fileSystem.entries)) throw new Error("fs sandbox file system entries must be an array.");
	const cwd = readFsSandboxCwd(execServer, sandbox);
	return {
		unrestricted: false,
		entries: fileSystem.entries.flatMap((entry, index) => {
			const resolved = resolveFsSandboxEntry(requireObject(entry, `fs sandbox entry ${index}`), cwd);
			return resolved ? [resolved] : [];
		})
	};
}
function readFsSandboxCwd(execServer, sandbox) {
	if (sandbox.cwd === void 0 || sandbox.cwd === null) return normalizeSandboxAbsolutePath(execServer.sandbox.containerWorkdir, "sandbox cwd");
	return normalizeSandboxAbsolutePath(requireString(sandbox.cwd, "sandbox cwd"), "sandbox cwd");
}
function resolveFsSandboxEntry(entry, cwd) {
	const access = readFsAccessMode(entry.access);
	const pathSpec = requireObject(entry.path, "fs sandbox entry path");
	const pathType = requireString(pathSpec.type, "fs sandbox entry path type");
	if (pathType === "path") return {
		kind: "path",
		path: normalizeSandboxAbsolutePath(requireString(pathSpec.path, "fs sandbox path"), "fs sandbox path"),
		access
	};
	if (pathType === "special") {
		if (isNonGrantingFsSpecialPath(requireObject(pathSpec.value, "fs sandbox special path"))) return;
		return {
			kind: "path",
			path: resolveFsSpecialPath(requireObject(pathSpec.value, "fs sandbox special path"), cwd),
			access
		};
	}
	if (pathType === "glob_pattern") {
		const pattern = requireString(pathSpec.pattern, "fs sandbox glob pattern");
		const absolutePattern = normalizeSandboxGlobPattern(pattern.startsWith("/") ? pattern : posix.join(cwd, pattern));
		return {
			kind: "glob",
			pattern: absolutePattern,
			matcher: compileSandboxGlobPattern(absolutePattern),
			literalPrefix: sandboxGlobLiteralPrefix(absolutePattern),
			access
		};
	}
	throw new Error(`Unsupported Codex fs sandbox path type: ${pathType}`);
}
function isNonGrantingFsSpecialPath(value) {
	const kind = requireString(value.kind, "fs sandbox special path kind");
	return kind === "minimal" || kind === "unknown";
}
function readFsAccessMode(value) {
	if (value === "read" || value === "write" || value === "none") return value;
	if (value === "deny") return "none";
	throw new Error("fs sandbox entry access must be read, write, none, or deny.");
}
function resolveFsSpecialPath(value, cwd) {
	const kind = requireString(value.kind, "fs sandbox special path kind");
	if (kind === "root") return "/";
	if (kind === "project_roots" || kind === "current_working_directory") {
		const subpath = value.subpath === void 0 || value.subpath === null ? void 0 : requireString(value.subpath, "fs sandbox project roots subpath");
		return normalizeSandboxAbsolutePath(subpath ? posix.join(cwd, subpath) : cwd, "fs sandbox project roots path");
	}
	if (kind === "slash_tmp" || kind === "tmpdir") return "/tmp";
	throw new Error(`Unsupported Codex fs sandbox special path: ${kind}`);
}
/** Asserts access against an already resolved filesystem sandbox policy. */
function assertResolvedFsSandboxAccess(policy, requests) {
	if (!policy?.unrestricted && policy) for (const request of requests) {
		const access = resolveFsAccess(policy, request.path);
		if (request.access === "read" && access === "none") throw new Error(`Codex fs sandbox denied read access to ${request.path}`);
		if (request.access === "write" && access !== "write") throw new Error(`Codex fs sandbox denied write access to ${request.path}`);
	}
}
function resolveFsAccess(policy, rawPath) {
	if (policy.unrestricted) return "write";
	const target = normalizeSandboxAbsolutePath(rawPath, "fs path");
	let selected;
	for (const entry of policy.entries) {
		if (!fsSandboxEntryMatches(entry, target)) continue;
		const candidate = {
			specificity: fsSandboxEntrySpecificity(entry),
			rank: fsAccessRank(entry.access),
			access: entry.access
		};
		if (!selected || candidate.specificity > selected.specificity || candidate.specificity === selected.specificity && candidate.rank > selected.rank) selected = candidate;
	}
	return selected?.access ?? "none";
}
/** Rejects recursive writes/removes that would cross protected read-only descendants. */
function assertNoReadOnlyDescendant(policy, rawPath, operation) {
	if (!policy || policy.unrestricted) return;
	const target = normalizeSandboxAbsolutePath(rawPath, "fs path");
	const protectedDescendant = policy.entries.find((entry) => {
		if (entry.access === "write" || !fsSandboxEntryCanAffectDescendant(entry, target)) return false;
		if (entry.kind === "glob") return true;
		const protectedPath = entry.path;
		return protectedPath && resolveFsAccess(policy, protectedPath) !== "write";
	});
	if (protectedDescendant) {
		const protectedPath = protectedDescendant.kind === "path" ? protectedDescendant.path : protectedDescendant.pattern;
		throw new Error(`Codex fs sandbox denied recursive ${operation} of ${rawPath} because ${protectedPath} is not writable.`);
	}
}
/** Normalizes and validates an absolute POSIX path inside the sandbox namespace. */
function normalizeSandboxAbsolutePath(rawPath, label) {
	if (!rawPath || rawPath.includes("\0") || !rawPath.startsWith("/")) throw new Error(`${label} must be an absolute sandbox path.`);
	const normalized = posix.normalize(rawPath);
	return normalized === "//" ? "/" : normalized;
}
/** Returns true when target is root itself or a descendant of root. */
function pathContains(root, target) {
	return root === "/" || target === root || target.startsWith(`${root}/`);
}
function fsSandboxEntryMatches(entry, target) {
	if (entry.kind === "path") return pathContains(entry.path, target);
	return entry.matcher.test(target);
}
function fsSandboxEntryCanAffectDescendant(entry, target) {
	if (entry.kind === "path") return pathContains(target, entry.path) && target !== entry.path;
	return pathContains(target, entry.literalPrefix) || pathContains(entry.literalPrefix, target);
}
function fsSandboxEntrySpecificity(entry) {
	return pathSpecificity(entry.kind === "path" ? entry.path : entry.literalPrefix);
}
function pathSpecificity(filePath) {
	return filePath === "/" ? 0 : filePath.split("/").filter(Boolean).length;
}
function fsAccessRank(access) {
	if (access === "none") return 2;
	if (access === "write") return 1;
	return 0;
}
function normalizeSandboxGlobPattern(pattern) {
	if (!pattern || pattern.includes("\0") || !pattern.startsWith("/")) throw new Error("fs sandbox glob pattern must be absolute.");
	return pattern.replace(/\/{2,}/gu, "/");
}
function compileSandboxGlobPattern(pattern) {
	let source = "^";
	for (let index = 0; index < pattern.length; index += 1) {
		const char = pattern[index];
		const next = pattern[index + 1];
		if (char === "*" && next === "*" && pattern[index + 2] === "/") {
			source += "(?:.*/)?";
			index += 2;
		} else if (char === "*" && next === "*") {
			source += ".*";
			index += 1;
		} else if (char === "*") source += "[^/]*";
		else if (char === "?") source += "[^/]";
		else if (char === "[") {
			const compiledClass = compileSandboxGlobCharacterClass(pattern, index);
			source += compiledClass.source;
			index = compiledClass.endIndex;
		} else source += char?.replace(/[\\^$+?.()|[\]{}]/gu, "\\$&") ?? "";
	}
	source += "$";
	return new RegExp(source, "u");
}
function compileSandboxGlobCharacterClass(pattern, startIndex) {
	let index = startIndex + 1;
	if (index >= pattern.length) throw new Error("fs sandbox glob character class must be closed.");
	const negated = pattern[index] === "!" || pattern[index] === "^";
	if (negated) index += 1;
	let body = "";
	for (; index < pattern.length; index += 1) {
		const char = pattern[index];
		if (char === "]" && body) return {
			source: `[${negated ? "^" : ""}${body}]`,
			endIndex: index
		};
		if (!char || char === "/") throw new Error("fs sandbox glob character class cannot match path separators.");
		body += escapeSandboxGlobCharacterClassChar(char, body.length === 0);
	}
	throw new Error("fs sandbox glob character class must be closed.");
}
function escapeSandboxGlobCharacterClassChar(char, first) {
	if (char === "\\" || char === "]") return `\\${char}`;
	if (first && char === "^") return "\\^";
	return char;
}
function sandboxGlobLiteralPrefix(pattern) {
	const wildcardIndex = pattern.search(/[*?[]/u);
	const prefix = wildcardIndex === -1 ? pattern : pattern.slice(0, wildcardIndex);
	const slash = prefix.lastIndexOf("/");
	if (slash <= 0) return "/";
	return normalizeSandboxAbsolutePath(prefix.slice(0, slash), "fs sandbox glob prefix");
}
/** Safely joins a single directory entry name onto a sandbox parent path. */
function joinSandboxChildPath(parent, child) {
	if (!child || child === "." || child === ".." || child.includes("/") || child.includes("\0")) throw new Error(`Invalid sandbox directory entry name: ${child}`);
	return parent.endsWith("/") ? `${parent}${child}` : `${parent}/${child}`;
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/runtime.ts
/** Returns the configured sandbox backend or fails the current JSON-RPC request. */
function requireBackend(execServer) {
	const backend = execServer.sandbox.backend;
	if (!backend) throw new Error("OpenClaw sandbox backend is unavailable.");
	return backend;
}
/** Returns the configured filesystem bridge or fails the current JSON-RPC request. */
function requireFsBridge(execServer) {
	const fsBridge = execServer.sandbox.fsBridge;
	if (!fsBridge) throw new Error("Sandbox filesystem bridge is unavailable.");
	return fsBridge;
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/filesystem.ts
/**
* Implements filesystem JSON-RPC handlers for the Codex sandbox exec-server
* with OpenClaw sandbox policy checks before every bridge operation.
*/
const CODEX_SANDBOX_EXEC_SERVER_MAX_READ_FILE_BYTES = 512 * 1024 * 1024;
/** Reads a sandbox file as base64 after read-policy and size checks. */
async function readFile$1(execServer, params) {
	const record = requireObject(params, "fs/readFile params");
	const filePath = requireString(record.path, "path");
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "read"
	}]);
	const fsBridge = requireFsBridge(execServer);
	const stat = await fsBridge.stat({ filePath });
	if (!stat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
	if (stat.type === "file" && stat.size > CODEX_SANDBOX_EXEC_SERVER_MAX_READ_FILE_BYTES) throw new Error(`file is too large to read through Codex sandbox exec-server: ${stat.size} bytes`);
	return { dataBase64: (await fsBridge.readFile({ filePath })).toString("base64") };
}
/** Writes base64 data to an existing sandbox directory after write-policy checks. */
async function writeFile$1(execServer, params) {
	const record = requireObject(params, "fs/writeFile params");
	const filePath = requireString(record.path, "path");
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "write"
	}]);
	const fsBridge = requireFsBridge(execServer);
	if ((await fsBridge.stat({ filePath: posix.dirname(filePath) }))?.type !== "directory") throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "parent directory not found");
	await fsBridge.writeFile({
		filePath,
		data: Buffer.from(requireBase64String(record.dataBase64, "dataBase64"), "base64"),
		mkdir: false
	});
}
/** Creates a sandbox directory, respecting recursive and parent-directory semantics. */
async function createDirectory(execServer, params) {
	const record = requireObject(params, "fs/createDirectory params");
	const filePath = requireString(record.path, "path");
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "write"
	}]);
	const fsBridge = requireFsBridge(execServer);
	if (record.recursive === false) {
		const parentPath = posix.dirname(filePath);
		if ((await fsBridge.stat({ filePath: parentPath }))?.type !== "directory") throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "parent directory not found");
	}
	await fsBridge.mkdirp({ filePath });
}
/** Returns normalized metadata for a sandbox path. */
async function getMetadata(execServer, params) {
	const record = requireObject(params, "fs/getMetadata params");
	const filePath = requireString(record.path, "path");
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "read"
	}]);
	const stat = await requireFsBridge(execServer).stat({ filePath });
	if (!stat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
	return metadataResponse(stat);
}
/** Lists sandbox directory entries visible under the resolved filesystem policy. */
async function readDirectory(execServer, params) {
	const record = requireObject(params, "fs/readDirectory params");
	return { entries: await listDirectoryEntries(execServer, requireString(record.path, "path"), resolveFsSandboxPolicy(execServer, record)) };
}
async function listDirectoryEntries(execServer, filePath, fsSandboxPolicy) {
	assertResolvedFsSandboxAccess(fsSandboxPolicy, [{
		path: filePath,
		access: "read"
	}]);
	const fsBridge = requireFsBridge(execServer);
	const backend = requireBackend(execServer);
	const resolved = fsBridge.resolvePath({ filePath });
	if (!resolved) throw new Error(`Cannot resolve sandbox path: ${filePath}`);
	const result = await backend.runShellCommand({
		script: "find \"$1\" -mindepth 1 -maxdepth 1 -exec sh -c 'for path do name=${path##*/}; if [ -L \"$path\" ]; then kind=o; elif [ -d \"$path\" ]; then kind=d; elif [ -f \"$path\" ]; then kind=f; else kind=o; fi; printf \"%s\\t%s\\n\" \"$kind\" \"$name\"; done' sh {} +",
		args: [resolved.containerPath],
		allowFailure: true
	});
	if (result.code !== 0) {
		const stderr = result.stderr.toString("utf8").trim();
		throw new Error(stderr || `sandbox directory listing failed with code ${result.code}`);
	}
	return result.stdout.toString("utf8").split("\n").filter(Boolean).map((line) => {
		const [kind = "o", fileName = ""] = line.split("	");
		return {
			fileName,
			isDirectory: kind === "d",
			isFile: kind === "f"
		};
	});
}
/** Removes a sandbox path after rejecting writes outside policy or under read-only descendants. */
async function removePath(execServer, params) {
	const record = requireObject(params, "fs/remove params");
	const filePath = requireString(record.path, "path");
	const fsSandboxPolicy = resolveFsSandboxPolicy(execServer, record);
	assertResolvedFsSandboxAccess(fsSandboxPolicy, [{
		path: filePath,
		access: "write"
	}]);
	if (record.recursive !== false) assertNoReadOnlyDescendant(fsSandboxPolicy, filePath, "remove");
	await requireFsBridge(execServer).remove({
		filePath,
		recursive: record.recursive !== false,
		force: record.force !== false
	});
}
/** Copies sandbox files or recursive directories while enforcing source and destination policy. */
async function copyPath(execServer, params) {
	const record = requireObject(params, "fs/copy params");
	const sourcePath = requireString(record.sourcePath ?? record.source, "sourcePath");
	const destinationPath = requireString(record.destinationPath ?? record.destination, "destinationPath");
	const fsSandboxPolicy = resolveFsSandboxPolicy(execServer, record);
	assertResolvedFsSandboxAccess(fsSandboxPolicy, [{
		path: sourcePath,
		access: "read"
	}, {
		path: destinationPath,
		access: "write"
	}]);
	await copySandboxPath(execServer, {
		sourcePath,
		destinationPath,
		recursive: record.recursive === true,
		fsSandboxPolicy
	});
}
async function copySandboxPath(execServer, params) {
	const fsBridge = execServer.sandbox.fsBridge;
	if (!fsBridge) throw new Error("Sandbox filesystem bridge is unavailable.");
	assertResolvedFsSandboxAccess(params.fsSandboxPolicy, [{
		path: params.sourcePath,
		access: "read"
	}, {
		path: params.destinationPath,
		access: "write"
	}]);
	const sourceStat = await fsBridge.stat({ filePath: params.sourcePath });
	if (!sourceStat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
	if (sourceStat?.type === "directory") {
		if (!params.recursive) throw new Error(`Cannot copy directory without recursive=true: ${params.sourcePath}`);
		if (pathContains(normalizeSandboxAbsolutePath(params.sourcePath, "copy source path"), normalizeSandboxAbsolutePath(params.destinationPath, "copy destination path"))) throw new Error("Cannot recursively copy a directory into itself.");
		await fsBridge.mkdirp({ filePath: params.destinationPath });
		for (const entry of await listDirectoryEntries(execServer, params.sourcePath, params.fsSandboxPolicy)) {
			if (!entry.isDirectory && !entry.isFile) throw new Error(`Cannot copy unsupported filesystem entry: ${entry.fileName}`);
			await copySandboxPath(execServer, {
				sourcePath: joinSandboxChildPath(params.sourcePath, entry.fileName),
				destinationPath: joinSandboxChildPath(params.destinationPath, entry.fileName),
				recursive: true,
				fsSandboxPolicy: params.fsSandboxPolicy
			});
		}
		return;
	}
	const data = await fsBridge.readFile({ filePath: params.sourcePath });
	await fsBridge.writeFile({
		filePath: params.destinationPath,
		data,
		mkdir: true
	});
}
function metadataResponse(stat) {
	return {
		isDirectory: stat?.type === "directory",
		isFile: stat?.type === "file",
		isSymlink: false,
		createdAtMs: 0,
		modifiedAtMs: stat?.mtimeMs ?? 0
	};
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/http.ts
/**
* Implements sandboxed HTTP requests for Codex native tools by routing network
* access through the active OpenClaw sandbox backend.
*/
/** Maximum JSON-line size accepted from the streaming HTTP helper process. */
const SANDBOX_HTTP_STREAM_LINE_MAX_CHARS = 256 * 1024;
/** Handles one sandbox HTTP JSON-RPC request, optionally streaming response body deltas. */
async function httpRequest(execServer, socket, params) {
	const record = requireObject(params, "http/request params");
	const requestId = requireString(record.requestId, "requestId");
	const url = requireString(record.url, "url");
	assertSandboxHttpRequestTargetAllowed(url);
	const request = {
		method: requireString(record.method, "method"),
		url,
		headers: readHttpHeaders(record.headers),
		bodyBase64: typeof record.bodyBase64 === "string" ? record.bodyBase64 : void 0,
		timeoutMs: typeof record.timeoutMs === "number" && record.timeoutMs > 0 ? Math.floor(record.timeoutMs) : void 0,
		streamResponse: record.streamResponse === true
	};
	if (request.streamResponse) return await runStreamingSandboxHttpRequest(execServer, socket, requestId, request);
	return await runSandboxHttpRequest(execServer, {
		...request,
		streamResponse: false
	});
}
function assertSandboxHttpRequestTargetAllowed(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		throw new SsrFBlockedError("Invalid URL supplied to sandbox http/request");
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new SsrFBlockedError(`Blocked non-HTTP(S) protocol in sandbox http/request: ${parsed.protocol}`);
	if (isBlockedHostnameOrIp(parsed.hostname)) throw new SsrFBlockedError(`Blocked hostname or private/internal IP in sandbox http/request: ${parsed.hostname}`);
}
async function runSandboxHttpRequest(execServer, params) {
	const result = await requireBackend(execServer).runShellCommand({
		script: SANDBOX_HTTP_REQUEST_SCRIPT,
		stdin: JSON.stringify(params),
		allowFailure: true
	});
	if (result.code !== 0) {
		const stderr = result.stderr.toString("utf8").trim();
		throw new Error(stderr || `sandbox http/request failed with code ${result.code}`);
	}
	const parsed = JSON.parse(result.stdout.toString("utf8"));
	if (typeof parsed.status !== "number" || !Array.isArray(parsed.headers)) throw new Error("sandbox http/request returned an invalid response envelope");
	return {
		status: parsed.status,
		headers: readHttpHeaders(parsed.headers),
		bodyBase64: typeof parsed.bodyBase64 === "string" ? parsed.bodyBase64 : ""
	};
}
async function runStreamingSandboxHttpRequest(execServer, socket, requestId, params) {
	const backend = requireBackend(execServer);
	const execSpec = await backend.buildExecSpec({
		command: SANDBOX_HTTP_REQUEST_SCRIPT,
		workdir: execServer.sandbox.containerWorkdir,
		env: {},
		usePty: false
	});
	const [command, ...args] = execSpec.argv;
	if (!command) throw new Error("OpenClaw sandbox HTTP exec spec did not provide a command.");
	const child = spawn(command, args, {
		env: execSpec.env,
		stdio: [
			"pipe",
			"pipe",
			"pipe"
		]
	});
	const abortOnSocketClose = () => child.kill("SIGTERM");
	socket.once("close", abortOnSocketClose);
	child.once("close", () => {
		socket.off("close", abortOnSocketClose);
	});
	child.stdin.on("error", (error) => {
		if (error.code === "EPIPE" || error.code === "ERR_STREAM_DESTROYED") return;
		log.warn("codex sandbox http/request stdin write failed", { error });
	});
	child.stdin.end(JSON.stringify(params));
	return await readStreamingSandboxHttpResponse({
		child,
		execSpec,
		finalizeExec: backend.finalizeExec,
		requestId,
		socket
	});
}
function readStreamingSandboxHttpResponse(params) {
	return new Promise((resolve, reject) => {
		let headerResolved = false;
		let failed = false;
		let lastBodySeq = 0;
		let stdoutBuffer = "";
		let stderr = "";
		const finalize = async (status, exitCode) => {
			await params.finalizeExec?.({
				status,
				exitCode,
				timedOut: false,
				token: params.execSpec.finalizeToken
			});
		};
		const fail = (message, exitCode) => {
			if (failed) return;
			failed = true;
			finalize("failed", exitCode).catch((error) => {
				log.warn("codex sandbox http/request finalize failed", { error });
			});
			if (headerResolved) {
				sendHttpBodyDelta(params.socket, {
					requestId: params.requestId,
					seq: lastBodySeq + 1,
					deltaBase64: "",
					done: true,
					error: message
				});
				return;
			}
			reject(new Error(message));
		};
		params.child.stdout.on("data", (chunk) => {
			stdoutBuffer += chunk.toString("utf8");
			let newline = stdoutBuffer.indexOf("\n");
			while (newline >= 0) {
				const line = stdoutBuffer.slice(0, newline).trim();
				stdoutBuffer = stdoutBuffer.slice(newline + 1);
				if (line) try {
					const message = requireObject(JSON.parse(line), "http stream message");
					const type = requireString(message.type, "http stream message type");
					if (type === "headers") {
						headerResolved = true;
						resolve({
							status: requireNumber(message.status, "http status"),
							headers: readHttpHeaders(message.headers),
							bodyBase64: ""
						});
					} else if (type === "bodyDelta") {
						const seq = requireNumber(message.seq, "http body sequence");
						lastBodySeq = Math.max(lastBodySeq, seq);
						sendHttpBodyDelta(params.socket, {
							requestId: params.requestId,
							seq,
							deltaBase64: typeof message.deltaBase64 === "string" ? message.deltaBase64 : "",
							done: message.done === true,
							error: typeof message.error === "string" ? message.error : null
						});
					}
				} catch (error) {
					fail(error instanceof Error ? error.message : String(error), null);
				}
				newline = stdoutBuffer.indexOf("\n");
			}
			if (stdoutBuffer.length > 262144) {
				params.child.kill("SIGKILL");
				fail(`sandbox http/request produced an unterminated stdout line longer than ${SANDBOX_HTTP_STREAM_LINE_MAX_CHARS} characters`, null);
			}
		});
		params.child.stderr.on("data", (chunk) => {
			stderr = `${stderr}${chunk.toString("utf8")}`.slice(-4096);
		});
		params.child.once("error", (error) => fail(error.message, null));
		params.child.once("close", (code) => {
			const exitCode = code ?? 1;
			if (failed) return;
			if (exitCode === 0) {
				finalize("completed", exitCode).catch((error) => {
					log.warn("codex sandbox http/request finalize failed", { error });
				});
				if (!headerResolved) reject(/* @__PURE__ */ new Error("sandbox http/request exited before returning headers"));
				return;
			}
			fail(stderr.trim() || `sandbox http/request failed with code ${exitCode}`, exitCode);
		});
	});
}
const SANDBOX_HTTP_REQUEST_SCRIPT = String.raw`
tmp=$(mktemp "$TMPDIR/openclaw-http.XXXXXX.py" 2>/dev/null || mktemp "/tmp/openclaw-http.XXXXXX.py") || exit 1
trap 'rm -f "$tmp"' EXIT
cat > "$tmp" <<'PY'
import base64
import json
import ipaddress
import socket
import sys
import urllib.error
import urllib.parse
import urllib.request

def emit(payload):
    print(json.dumps(payload, separators=(",", ":")), flush=True)

def response_headers(response):
    return [{"name": name, "value": value} for name, value in response.headers.items()]

BLOCKED_HOSTNAMES = {
    "localhost",
    "localhost.localdomain",
    "metadata.google.internal",
}
CLOUD_METADATA_IP_ADDRESSES = {
    "100.100.100.200",
    "fd00:ec2::254",
}
BLOCKED_IPV4_NETWORKS = tuple(
    ipaddress.ip_network(network)
    for network in (
        "100.64.0.0/10",
        "198.18.0.0/15",
    )
)
BLOCKED_IPV6_NETWORKS = tuple(
    ipaddress.ip_network(network)
    for network in (
        "100::/64",
        "2001:2::/48",
        "2001:20::/28",
        "2001:db8::/32",
        "fec0::/10",
    )
)
PINNED_ADDRESSES = {}

def normalize_hostname(hostname):
    return (hostname or "").strip("[]").rstrip(".").lower()

def is_blocked_hostname(hostname):
    normalized = normalize_hostname(hostname)
    return (
        normalized in BLOCKED_HOSTNAMES
        or normalized.endswith(".localhost")
        or normalized.endswith(".local")
        or normalized.endswith(".internal")
    )

def is_blocked_ip(address):
    try:
        parsed = ipaddress.ip_address(address)
    except ValueError:
        return False
    embedded_ipv4 = extract_embedded_ipv4(parsed)
    if embedded_ipv4 is not None and is_blocked_ip(str(embedded_ipv4)):
        return True
    if str(parsed).lower() in CLOUD_METADATA_IP_ADDRESSES:
        return True
    if isinstance(parsed, ipaddress.IPv4Address):
        if any(parsed in network for network in BLOCKED_IPV4_NETWORKS):
            return True
    else:
        if any(parsed in network for network in BLOCKED_IPV6_NETWORKS):
            return True
    return (
        parsed.is_loopback
        or parsed.is_private
        or parsed.is_link_local
        or parsed.is_multicast
        or parsed.is_reserved
        or parsed.is_unspecified
    )

def ipv4_from_int(value):
    return ipaddress.IPv4Address(value & 0xffffffff)

def extract_embedded_ipv4(address):
    if not isinstance(address, ipaddress.IPv6Address):
        return None
    if address.ipv4_mapped is not None:
        return address.ipv4_mapped
    value = int(address)
    hextets = [(value >> shift) & 0xffff for shift in range(112, -1, -16)]
    if hextets[:6] == [0, 0, 0, 0, 0, 0]:
        return ipv4_from_int(value)
    if hextets[:6] == [0x64, 0xff9b, 0, 0, 0, 0]:
        return ipv4_from_int(value)
    if hextets[:6] == [0x64, 0xff9b, 1, 0, 0, 0]:
        return ipv4_from_int(value)
    if hextets[0] == 0x2002:
        return ipv4_from_int((hextets[1] << 16) | hextets[2])
    if hextets[0] == 0x2001 and hextets[1] == 0:
        return ipv4_from_int(((hextets[6] << 16) | hextets[7]) ^ 0xffffffff)
    if (hextets[4] & 0xfcff) == 0 and hextets[5] == 0x5efe:
        return ipv4_from_int((hextets[6] << 16) | hextets[7])
    return None

def assert_url_allowed(url):
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise ValueError("http/request only supports http and https URLs")
    hostname = normalize_hostname(parsed.hostname)
    if not hostname or is_blocked_hostname(hostname) or is_blocked_ip(hostname):
        raise ValueError("Blocked hostname or private/internal/special-use IP address")
    try:
        results = socket.getaddrinfo(hostname, parsed.port, proto=socket.IPPROTO_TCP)
    except socket.gaierror as error:
        raise ValueError(f"Unable to resolve hostname: {hostname}") from error
    addresses = {entry[4][0] for entry in results if entry[4]}
    if not addresses or any(is_blocked_ip(address) for address in addresses):
        raise ValueError("Blocked: resolves to private/internal/special-use IP address")
    PINNED_ADDRESSES[hostname] = sorted(addresses)

class GuardedRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        assert_url_allowed(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def pinned_getaddrinfo(original_getaddrinfo):
    def getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
        pinned = PINNED_ADDRESSES.get(normalize_hostname(host))
        if not pinned:
            return original_getaddrinfo(host, port, family, type, proto, flags)
        results = []
        for address in pinned:
            results.extend(original_getaddrinfo(address, port, family, type, proto, flags))
        return results
    return getaddrinfo

def handle_response(input_data, response):
    headers = response_headers(response)
    status = int(getattr(response, "status", getattr(response, "code", 0)))
    if input_data.get("streamResponse"):
        emit({"type": "headers", "status": status, "headers": headers})
        seq = 1
        while True:
            chunk = response.read(65536)
            if not chunk:
                break
            emit({
                "type": "bodyDelta",
                "seq": seq,
                "deltaBase64": base64.b64encode(chunk).decode("ascii"),
                "done": False,
            })
            seq += 1
        emit({"type": "bodyDelta", "seq": seq, "deltaBase64": "", "done": True})
        return
    body = response.read()
    emit({
        "status": status,
        "headers": headers,
        "bodyBase64": base64.b64encode(body).decode("ascii"),
    })

def main():
    input_data = json.load(sys.stdin)
    url = str(input_data.get("url", ""))
    assert_url_allowed(url)
    body_base64 = input_data.get("bodyBase64")
    data = base64.b64decode(body_base64) if isinstance(body_base64, str) else None
    request = urllib.request.Request(
        url,
        data=data,
        method=str(input_data.get("method", "GET")),
    )
    for header in input_data.get("headers") or []:
        request.add_header(str(header.get("name", "")), str(header.get("value", "")))
    timeout_ms = input_data.get("timeoutMs")
    timeout = None
    if isinstance(timeout_ms, (int, float)) and timeout_ms > 0:
        timeout = timeout_ms / 1000
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), GuardedRedirectHandler)
    original_getaddrinfo = socket.getaddrinfo
    socket.getaddrinfo = pinned_getaddrinfo(original_getaddrinfo)
    try:
        with opener.open(request, timeout=timeout) as response:
            handle_response(input_data, response)
    except urllib.error.HTTPError as response:
        handle_response(input_data, response)
    finally:
        socket.getaddrinfo = original_getaddrinfo

if __name__ == "__main__":
    main()
PY
python3 "$tmp"
`.trim();
function sendHttpBodyDelta(socket, params) {
	if (socket.readyState !== 1) return;
	socket.send(JSON.stringify({
		jsonrpc: "2.0",
		method: "http/request/bodyDelta",
		params: {
			requestId: params.requestId,
			seq: params.seq,
			deltaBase64: params.deltaBase64,
			done: params.done,
			error: params.error ?? null
		}
	}));
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/processes.ts
/**
* Manages subprocess lifecycle, streaming output buffers, stdin writes, and
* termination for Codex sandbox exec-server process RPCs.
*/
const ENV_KEY_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const RETAINED_PROCESS_OUTPUT_BYTES = 1024 * 1024;
const CLOSED_PROCESS_EVICTION_MS = 6e4;
/** Starts a sandbox-backed process and registers it in the connection-local process table. */
async function startProcess(execServer, processes, socket, params) {
	const record = requireObject(params, "process/start params");
	const processId = requireString(record.processId, "processId");
	if (processes.has(processId)) throw new Error(`process already exists: ${processId}`);
	const argv = requireStringArray(record.argv, "argv");
	const cwd = requireString(record.cwd, "cwd");
	rejectUnsupportedArg0(record.arg0);
	const env = readProcessEnv(record);
	const managed = {
		processId,
		chunks: [],
		retainedOutputBytes: 0,
		nextSeq: 1,
		exited: false,
		exitCode: null,
		closed: false,
		failure: null,
		tty: record.tty === true,
		pipeStdin: record.pipeStdin === true,
		abortController: new AbortController(),
		child: null,
		finalized: false,
		waiters: [],
		emitNotification: (method, notificationParams) => {
			if (socket.readyState === 1) socket.send(JSON.stringify({
				jsonrpc: "2.0",
				method,
				params: notificationParams
			}));
		},
		evictProcess: () => {
			if (managed.evictionTimer) return;
			managed.evictionTimer = setTimeout(() => {
				if (processes.get(processId) === managed && managed.closed) processes.delete(processId);
			}, CLOSED_PROCESS_EVICTION_MS);
			managed.evictionTimer.unref?.();
		}
	};
	processes.set(processId, managed);
	try {
		await runProcess(execServer, managed, {
			argv,
			cwd,
			env
		});
	} catch (error) {
		processes.delete(processId);
		managed.failure = error instanceof Error ? error.message : String(error);
		managed.exitCode = null;
		managed.exited = true;
		managed.closed = true;
		notifyProcessWaiters(managed);
		throw error;
	}
	return { processId };
}
async function runProcess(execServer, managed, params) {
	const backend = execServer.sandbox.backend;
	if (!backend) throw new Error("OpenClaw sandbox backend is unavailable.");
	throwIfProcessStartCancelled(managed);
	const execSpec = await backend.buildExecSpec({
		command: shellCommandFromArgv(params.argv),
		workdir: params.cwd,
		env: params.env,
		usePty: false
	});
	managed.finalizeToken = execSpec.finalizeToken;
	managed.finalizeExec = backend.finalizeExec;
	if (managed.abortController.signal.aborted) {
		managed.failure = "process start cancelled";
		await finalizeProcess(managed);
		throw new Error("process start cancelled");
	}
	const [command, ...args] = execSpec.argv;
	if (!command) throw new Error("OpenClaw sandbox exec spec did not provide a command.");
	const child = spawn(command, args, {
		env: execSpec.env,
		stdio: [
			"pipe",
			"pipe",
			"pipe"
		]
	});
	managed.child = child;
	const abortListener = () => child.kill("SIGTERM");
	managed.abortController.signal.addEventListener("abort", abortListener, { once: true });
	child.stdout.on("data", (chunk) => appendProcessChunk(managed, managed.tty ? "pty" : "stdout", chunk));
	child.stderr.on("data", (chunk) => appendProcessChunk(managed, "stderr", chunk));
	child.once("error", (error) => {
		managed.failure = error.message;
		emitProcessClosed(managed, null);
	});
	child.once("close", (code) => {
		managed.abortController.signal.removeEventListener("abort", abortListener);
		emitProcessClosed(managed, code ?? 1);
	});
	if (!managed.tty && !managed.pipeStdin) child.stdin.end();
}
function throwIfProcessStartCancelled(managed) {
	if (managed.abortController.signal.aborted) throw new Error("process start cancelled");
}
function appendProcessChunk(managed, stream, data) {
	if (data.length === 0) return;
	const chunk = {
		seq: managed.nextSeq,
		stream,
		chunk: data.toString("base64")
	};
	managed.chunks.push(chunk);
	managed.retainedOutputBytes += data.length;
	while (managed.retainedOutputBytes > RETAINED_PROCESS_OUTPUT_BYTES && managed.chunks.length > 1) {
		const removed = managed.chunks.shift();
		if (!removed) break;
		managed.retainedOutputBytes -= Buffer.from(removed.chunk, "base64").byteLength;
	}
	managed.nextSeq += 1;
	managed.emitNotification("process/output", {
		processId: managed.processId,
		seq: chunk.seq,
		stream: chunk.stream,
		chunk: chunk.chunk
	});
	notifyProcessWaiters(managed);
}
function emitProcessClosed(managed, exitCode) {
	if (!managed.exited) {
		const exitSeq = managed.nextSeq;
		managed.nextSeq += 1;
		managed.exitCode = exitCode;
		managed.exited = true;
		if (exitCode !== null) managed.emitNotification("process/exited", {
			processId: managed.processId,
			seq: exitSeq,
			exitCode
		});
	}
	if (!managed.closed) {
		const closeSeq = managed.nextSeq;
		managed.nextSeq += 1;
		managed.closed = true;
		managed.emitNotification("process/closed", {
			processId: managed.processId,
			seq: closeSeq
		});
	}
	finalizeProcess(managed).catch((error) => {
		const message = error instanceof Error ? error.message : String(error);
		managed.failure ??= message;
		log.warn("codex sandbox exec-server finalize failed", {
			processId: managed.processId,
			error: message
		});
	});
	managed.evictProcess();
	notifyProcessWaiters(managed);
}
async function finalizeProcess(managed) {
	if (managed.finalized) return;
	managed.finalized = true;
	managed.child?.stdin.destroy();
	await managed.finalizeExec?.({
		status: managed.failure ? "failed" : "completed",
		exitCode: managed.exitCode,
		timedOut: false,
		token: managed.finalizeToken
	});
}
function limitProcessChunks(chunks, maxBytes) {
	if (!maxBytes) return chunks;
	const retained = [];
	let retainedBytes = 0;
	for (const chunk of chunks) {
		const byteLength = Buffer.from(chunk.chunk, "base64").byteLength;
		if (retained.length > 0 && retainedBytes + byteLength > maxBytes) break;
		retained.push(chunk);
		retainedBytes += byteLength;
		if (retainedBytes >= maxBytes) break;
	}
	return retained;
}
/** Reads buffered process output, optionally waiting for new output or process close. */
async function readProcess(processes, params) {
	const record = requireObject(params, "process/read params");
	const managed = requireProcess(processes, requireString(record.processId, "processId"));
	const afterSeq = typeof record.afterSeq === "number" ? record.afterSeq : 0;
	const waitMs = typeof record.waitMs === "number" && record.waitMs > 0 ? record.waitMs : 0;
	if (!managed.exited && !hasChunksAtOrAfter(managed, afterSeq) && waitMs > 0) await waitForProcessUpdate(managed, waitMs);
	const chunks = limitProcessChunks(managed.chunks.filter((chunk) => chunk.seq > afterSeq), typeof record.maxBytes === "number" && record.maxBytes > 0 ? record.maxBytes : void 0);
	const lastChunk = chunks.at(-1);
	return {
		chunks,
		nextSeq: lastChunk ? lastChunk.seq + 1 : managed.nextSeq,
		exited: managed.exited,
		exitCode: managed.exitCode,
		closed: managed.closed,
		failure: managed.failure
	};
}
/** Writes base64 stdin data to a running process when stdin is still open. */
function writeProcess(processes, params) {
	const record = requireObject(params, "process/write params");
	const processId = requireString(record.processId, "processId");
	const managed = processes.get(processId);
	if (!managed) return { status: "unknownProcess" };
	const chunk = Buffer.from(requireString(record.chunk, "chunk"), "base64");
	if (!managed.tty && !managed.pipeStdin || managed.closed || !managed.child?.stdin.writable) return { status: "stdinClosed" };
	managed.child.stdin.write(chunk);
	return { status: "accepted" };
}
/** Requests process termination and reports whether it was running at call time. */
function terminateProcess(processes, params) {
	const processId = requireString(requireObject(params, "process/terminate params").processId, "processId");
	const managed = processes.get(processId);
	if (!managed) return { running: false };
	const running = !managed.exited;
	managed.abortController.abort();
	managed.child?.kill("SIGTERM");
	if (running && !managed.child) emitProcessClosed(managed, null);
	return { running };
}
function waitForProcessUpdate(managed, waitMs) {
	return new Promise((resolve) => {
		const timer = setTimeout(done, Math.min(waitMs, 3e4));
		function done() {
			clearTimeout(timer);
			managed.waiters = managed.waiters.filter((waiter) => waiter !== done);
			resolve();
		}
		managed.waiters.push(done);
	});
}
function notifyProcessWaiters(managed) {
	const waiters = managed.waiters;
	managed.waiters = [];
	for (const waiter of waiters) waiter();
}
function hasChunksAtOrAfter(managed, afterSeq) {
	return managed.chunks.some((chunk) => chunk.seq > afterSeq);
}
function shellCommandFromArgv(argv) {
	return argv.map(shellEscape).join(" ");
}
function shellEscape(value) {
	return `'${value.replaceAll("'", `'"'"'`)}'`;
}
function requireProcess(processes, processId) {
	const managed = processes.get(processId);
	if (!managed) throw new Error(`unknown process: ${processId}`);
	return managed;
}
function rejectUnsupportedArg0(value) {
	if (value === void 0 || value === null) return;
	if (typeof value === "string") throw new Error("Codex sandbox exec-server does not support arg0 overrides.");
	throw new Error("arg0 must be a string or null.");
}
function readEnv(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	const env = {};
	for (const [key, rawValue] of Object.entries(value)) if (typeof rawValue === "string" && ENV_KEY_RE.test(key)) env[key] = rawValue;
	return env;
}
function readProcessEnv(record) {
	return {
		...buildEnvFromPolicy(record.envPolicy),
		...readEnv(record.env)
	};
}
function buildEnvFromPolicy(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	const policy = value;
	const inheritedEnv = readEnv(policy.set);
	const includeOnly = readStringList(policy.includeOnly);
	if (includeOnly.length > 0) filterEnvKeys(inheritedEnv, includeOnly, true);
	return inheritedEnv;
}
function filterEnvKeys(env, patterns, keepMatches) {
	if (patterns.length === 0) return;
	const regexes = patterns.map((pattern) => wildcardPatternToRegex(pattern));
	for (const key of Object.keys(env)) if (regexes.some((regex) => regex.test(key)) !== keepMatches) delete env[key];
}
function wildcardPatternToRegex(pattern) {
	const escaped = pattern.replace(/[.+^${}()|[\]\\]/gu, "\\$&");
	return new RegExp(`^${escaped.replaceAll("*", ".*").replaceAll("?", ".")}$`, "iu");
}
function readStringList(value) {
	return Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : [];
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server.ts
/**
* Hosts the local OpenClaw sandbox exec-server that Codex app-server native
* execution can register as an external environment.
*/
const SANDBOX_EXEC_SERVERS = /* @__PURE__ */ new Map();
const CODEX_SANDBOX_EXEC_SERVER_MAX_INBOUND_MESSAGE_BYTES = 100 * 1024 * 1024;
/** Starts or reuses a sandbox exec-server and registers it with Codex app-server. */
async function ensureCodexSandboxExecServerEnvironment(params) {
	if (!params.sandbox?.enabled || !params.sandbox.backend) return;
	if (!canExposeLocalExecServerToAppServer(params.appServerStartOptions)) throw new Error("OpenClaw Codex exec-server uses a local loopback URL and cannot be registered with a remote Codex app-server.");
	assertCodexSandboxExecServerSupported(params.client);
	const execServer = await acquireOpenClawExecServer(params.sandbox);
	try {
		await params.client.request("environment/add", {
			environmentId: execServer.environmentId,
			execServerUrl: execServer.url
		}, {
			timeoutMs: params.timeoutMs,
			signal: params.signal
		});
	} catch (error) {
		await releaseOpenClawExecServer(execServer);
		if (isEnvironmentAddUnsupported(error)) {
			log.warn("codex app-server does not support remote environments yet", { environmentId: execServer.environmentId });
			return;
		}
		throw error;
	}
	return {
		environmentId: execServer.environmentId,
		cwd: params.sandbox.containerWorkdir
	};
}
/** Releases the sandbox exec-server lease associated with a sandbox runtime. */
async function releaseCodexSandboxExecServerEnvironment(sandbox) {
	if (!sandbox?.enabled) return;
	const server = await SANDBOX_EXEC_SERVERS.get(sandbox.runtimeId)?.catch(() => void 0);
	if (server) await releaseOpenClawExecServer(server);
}
function assertCodexSandboxExecServerSupported(client) {
	const detectedVersion = client.getServerVersion();
	if (!detectedVersion || compareCodexAppServerVersions(detectedVersion, "0.132.0") < 0) throw new Error(`Codex app-server ${MIN_CODEX_SANDBOX_EXEC_SERVER_APP_SERVER_VERSION} or newer is required for OpenClaw sandbox exec-server environments, but detected ${detectedVersion ?? "an unknown version"}. Disable appServer.experimental.sandboxExecServer or configure a newer Codex app-server binary.`);
}
function isEnvironmentAddUnsupported(error) {
	if (!(error instanceof Error)) return false;
	return error.message.includes("environment/add") && (error.message.includes("unknown variant") || error.message.includes("Method not found"));
}
function canExposeLocalExecServerToAppServer(startOptions) {
	if (!startOptions || startOptions.transport !== "websocket") return true;
	if (typeof startOptions.url !== "string") return false;
	try {
		const host = new URL(startOptions.url).hostname.toLowerCase();
		const ipHost = host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
		if (host === "localhost" || ipHost === "::1") return true;
		return isIP(ipHost) === 4 && ipHost.split(".")[0] === "127";
	} catch {
		return false;
	}
}
async function acquireOpenClawExecServer(sandbox) {
	const key = sandbox.runtimeId;
	while (true) {
		const promise = SANDBOX_EXEC_SERVERS.get(key) ?? startAndRememberOpenClawExecServer(sandbox);
		const server = await promise;
		if (!server.closed && SANDBOX_EXEC_SERVERS.get(key) === promise) {
			server.refCount += 1;
			return server;
		}
	}
}
function startAndRememberOpenClawExecServer(sandbox) {
	const created = startOpenClawExecServer(sandbox);
	const key = sandbox.runtimeId;
	SANDBOX_EXEC_SERVERS.set(key, created);
	created.catch(() => {
		if (SANDBOX_EXEC_SERVERS.get(key) === created) SANDBOX_EXEC_SERVERS.delete(key);
	});
	return created;
}
async function startOpenClawExecServer(sandbox) {
	const server = new WebSocketServer({
		host: "127.0.0.1",
		port: 0,
		maxPayload: CODEX_SANDBOX_EXEC_SERVER_MAX_INBOUND_MESSAGE_BYTES
	});
	await once(server, "listening");
	const address = server.address();
	if (!address || typeof address === "string") throw new Error("OpenClaw Codex exec-server did not bind to a TCP port.");
	const environmentId = buildEnvironmentId(sandbox);
	const authPath = `/openclaw-${randomUUID()}`;
	const execServer = {
		authPath,
		closed: false,
		environmentId,
		refCount: 0,
		url: `ws://127.0.0.1:${address.port}${authPath}`,
		sandbox,
		server
	};
	server.on("connection", (socket, request) => {
		socket.on("error", handleExecServerSocketError);
		if (!isAuthorizedExecServerRequest(execServer, request)) {
			socket.close(1008, "unauthorized");
			return;
		}
		handleConnection(execServer, socket);
	});
	log.info("codex sandbox exec-server started", {
		environmentId,
		runtimeId: sandbox.runtimeId,
		backendId: sandbox.backendId
	});
	return execServer;
}
async function releaseOpenClawExecServer(execServer) {
	if (execServer.closed) return;
	execServer.refCount = Math.max(0, execServer.refCount - 1);
	if (execServer.refCount > 0) return;
	const current = await SANDBOX_EXEC_SERVERS.get(execServer.sandbox.runtimeId)?.catch(() => void 0);
	if (execServer.refCount > 0 || execServer.closed) return;
	if (current === execServer) SANDBOX_EXEC_SERVERS.delete(execServer.sandbox.runtimeId);
	await closeOpenClawExecServer(execServer);
}
async function closeOpenClawExecServer(execServer) {
	if (execServer.closed) return;
	execServer.closed = true;
	for (const client of execServer.server.clients) client.close(1001, "shutdown");
	await new Promise((resolve) => {
		execServer.server.close(() => resolve());
	});
}
function buildEnvironmentId(sandbox) {
	return `openclaw-sandbox-${createHash("sha256").update(sandbox.runtimeId).digest("hex").slice(0, 16)}`;
}
function isAuthorizedExecServerRequest(execServer, request) {
	return new URL(request.url ?? "", "ws://127.0.0.1").pathname === execServer.authPath;
}
function handleConnection(execServer, socket) {
	const processes = /* @__PURE__ */ new Map();
	socket.on("message", (data) => {
		handleMessage(execServer, processes, socket, data).catch((error) => {
			log.warn("codex sandbox exec-server message failed", { error });
		});
	});
	socket.on("close", () => {
		for (const process of processes.values()) process.abortController.abort();
	});
}
function handleExecServerSocketError(error) {
	log.debug("codex sandbox exec-server websocket failed", { error });
}
async function handleMessage(execServer, processes, socket, data) {
	const request = parseRequest(data);
	if (!request.method) {
		sendError(socket, request.id, -32600, "Invalid Request");
		return;
	}
	const method = request.method;
	if (request.id === void 0) {
		if (method !== "initialized") sendError(socket, -1, -32600, `Unexpected notification: ${method}`);
		return;
	}
	try {
		const result = await dispatchRequest(execServer, processes, socket, {
			...request,
			method
		});
		sendResult(socket, request.id, result);
	} catch (error) {
		sendError(socket, request.id, error instanceof JsonRpcProtocolError ? error.code : -32603, error instanceof Error ? error.message : String(error));
	}
}
async function dispatchRequest(execServer, processes, socket, request) {
	switch (request.method) {
		case "initialize": return { sessionId: randomUUID() };
		case "process/start": return startProcess(execServer, processes, socket, request.params);
		case "process/read": return await readProcess(processes, request.params);
		case "process/write": return writeProcess(processes, request.params);
		case "process/terminate": return terminateProcess(processes, request.params);
		case "fs/readFile": return await readFile$1(execServer, request.params);
		case "fs/writeFile":
			await writeFile$1(execServer, request.params);
			return {};
		case "fs/createDirectory":
			await createDirectory(execServer, request.params);
			return {};
		case "fs/getMetadata": return await getMetadata(execServer, request.params);
		case "fs/readDirectory": return await readDirectory(execServer, request.params);
		case "fs/remove":
			await removePath(execServer, request.params);
			return {};
		case "fs/copy":
			await copyPath(execServer, request.params);
			return {};
		case "http/request": return await httpRequest(execServer, socket, request.params);
		default: throw new Error(`Unsupported OpenClaw sandbox exec-server method: ${request.method}`);
	}
}
//#endregion
//#region extensions/codex/src/app-server/attempt-startup.ts
/**
* Startup orchestration for Codex app-server attempts, including shared-client
* leasing, plugin thread config, sandbox execution environment, and thread
* lifecycle binding.
*/
const CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS = 3;
/**
* Starts or resumes the Codex app-server thread and returns the resources the
* run loop must later release.
*/
async function startCodexAttemptThread(params) {
	let pluginAppServer = params.appServer;
	let releaseSharedClientLease;
	let startupClientForAbandonedRequestCleanup;
	let releaseStartupResourcesOnTimeout;
	let startupAbandoned = false;
	const startupAbandonController = new AbortController();
	const abandonStartupAcquire = () => startupAbandonController.abort();
	params.signal.addEventListener("abort", abandonStartupAcquire, { once: true });
	try {
		const startupResult = await withCodexStartupTimeout({
			timeoutMs: params.startupTimeoutMs,
			signal: params.signal,
			onTimeout: async () => {
				startupAbandoned = true;
				startupAbandonController.abort();
				await params.onStartupTimeout();
				await releaseStartupResourcesOnTimeout?.();
				releaseSharedClientLease?.();
				releaseSharedClientLease = void 0;
				await closeCodexStartupClientBestEffort(startupClientForAbandonedRequestCleanup);
				startupClientForAbandonedRequestCleanup = void 0;
			},
			operation: async () => {
				const threadConfig = mergeCodexThreadConfigs(params.bundleMcpThreadConfig?.configPatch);
				const pluginThreadConfigRequired = !params.nativeToolSurfaceEnabled || shouldBuildCodexPluginThreadConfig(params.pluginConfig);
				const pluginThreadConfigPluginConfig = params.nativeToolSurfaceEnabled ? params.pluginConfig : disableCodexPluginThreadConfig(params.pluginConfig);
				const resolvedPluginPolicy = pluginThreadConfigRequired ? resolveCodexPluginsPolicy(pluginThreadConfigPluginConfig) : void 0;
				const computerUseMcpElicitationDelegationRequired = params.computerUseConfig.enabled;
				const mcpElicitationDelegationRequired = resolvedPluginPolicy?.enabled === true || computerUseMcpElicitationDelegationRequired;
				const enabledPluginConfigKeys = resolvedPluginPolicy ? resolvedPluginPolicy.pluginPolicies.filter((plugin) => plugin.enabled).map((plugin) => plugin.configKey).toSorted() : void 0;
				pluginAppServer = mcpElicitationDelegationRequired ? {
					...params.appServer,
					approvalPolicy: withMcpElicitationsApprovalPolicy(params.appServer.approvalPolicy)
				} : params.appServer;
				let attemptedClient;
				const startupAttempt = async () => {
					let startupClientLease;
					let startupClient;
					let startupAttemptError;
					let startupAttemptSucceeded = false;
					try {
						startupClient = await params.attemptClientFactory(params.appServer.start, params.startupAuthProfileId, params.agentDir, params.config, {
							onStartedClient: (client) => {
								startupClientForAbandonedRequestCleanup = client;
								if (startupAbandoned || startupAbandonController.signal.aborted) closeCodexStartupClientBestEffort(client);
							},
							abandonSignal: startupAbandonController.signal
						});
						const activeStartupClient = startupClient;
						let startupClientLeaseReleased = false;
						startupClientLease = () => {
							if (startupClientLeaseReleased) return;
							startupClientLeaseReleased = true;
							releaseLeasedSharedCodexAppServerClient(activeStartupClient);
						};
						releaseSharedClientLease = startupClientLease;
						attemptedClient = activeStartupClient;
						startupClientForAbandonedRequestCleanup = activeStartupClient;
						if (startupAbandoned) throw new Error("codex app-server startup timed out");
						if (startupAbandonController.signal.aborted) throw new Error("codex app-server startup aborted");
						await ensureCodexComputerUse({
							client: activeStartupClient,
							pluginConfig: params.pluginConfig,
							timeoutMs: params.appServer.requestTimeoutMs,
							signal: startupAbandonController.signal
						});
						const startupRuntimeIdentity = activeStartupClient.getRuntimeIdentity();
						const pluginAppCacheKey = buildCodexPluginAppCacheKey({
							appServer: params.appServer,
							agentDir: params.agentDir,
							authProfileId: params.startupAuthProfileId,
							accountId: params.startupAuthAccountCacheKey,
							envApiKeyFingerprint: params.startupEnvApiKeyCacheKey,
							appServerVersion: activeStartupClient.getServerVersion(),
							runtimeIdentity: startupRuntimeIdentity
						});
						const appServerRuntimeFingerprint = buildCodexAppServerRuntimeFingerprint({
							appServer: params.appServer,
							appServerVersion: activeStartupClient.getServerVersion(),
							runtimeIdentity: startupRuntimeIdentity
						});
						const pluginThreadConfigInputFingerprint = pluginThreadConfigRequired ? buildCodexPluginThreadConfigInputFingerprint({
							pluginConfig: pluginThreadConfigPluginConfig,
							appCacheKey: pluginAppCacheKey
						}) : void 0;
						const attemptParams = params.buildAttemptParams();
						log.debug("codex plugin thread config eligibility", buildCodexPluginThreadConfigEligibilityLogData({
							sessionId: attemptParams.sessionId,
							sessionKey: attemptParams.sessionKey ?? "",
							pluginThreadConfigRequired,
							resolvedPluginPolicy,
							enabledPluginConfigKeys,
							pluginAppCacheKey,
							startupAuthProfileId: params.startupAuthProfileId,
							appServer: params.appServer
						}));
						let startupSandboxEnvironment;
						let startupSandboxEnvironmentAcquired = false;
						const releaseStartupSandboxEnvironment = async () => {
							if (startupSandboxEnvironmentAcquired) {
								startupSandboxEnvironmentAcquired = false;
								await releaseCodexSandboxExecServerEnvironment(params.sandbox);
							}
						};
						releaseStartupResourcesOnTimeout = releaseStartupSandboxEnvironment;
						try {
							startupSandboxEnvironment = shouldRequireCodexSandboxExecServerEnvironment({
								sandbox: params.sandbox,
								nativeToolSurfaceEnabled: params.nativeToolSurfaceEnabled,
								sandboxExecServerEnabled: params.sandboxExecServerEnabled
							}) ? await ensureCodexSandboxExecServerEnvironment({
								client: activeStartupClient,
								sandbox: params.sandbox ?? null,
								appServerStartOptions: params.appServer.start,
								timeoutMs: params.appServer.requestTimeoutMs,
								signal: startupAbandonController.signal
							}) : void 0;
							startupSandboxEnvironmentAcquired = Boolean(startupSandboxEnvironment);
							if (startupAbandonController.signal.aborted) {
								await releaseStartupSandboxEnvironment();
								throw new Error("codex app-server startup aborted");
							}
							if (params.sandbox?.enabled && params.nativeToolSurfaceEnabled && params.sandboxExecServerEnabled && !startupSandboxEnvironment) throw new Error("Codex app-server did not register an OpenClaw sandbox exec-server environment.");
						} catch (error) {
							await releaseStartupSandboxEnvironment();
							throw error;
						}
						const startupEnvironmentSelection = resolveCodexSandboxEnvironmentSelection(startupSandboxEnvironment, params.nativeToolSurfaceEnabled);
						const startupExecutionCwd = resolveCodexAppServerExecutionCwd({
							effectiveCwd: params.effectiveCwd,
							localWorkspaceRoot: params.effectiveWorkspace,
							environment: startupSandboxEnvironment,
							nativeToolSurfaceEnabled: params.nativeToolSurfaceEnabled,
							remoteWorkspaceRoot: params.appServer.remoteWorkspaceRoot
						});
						const startupSandboxPolicy = startupSandboxEnvironment ? resolveCodexExternalSandboxPolicyForOpenClawSandbox(params.sandbox) : void 0;
						const buildThreadLifecycleParams = (signal) => ({
							client: activeStartupClient,
							params: params.buildAttemptParams(),
							agentId: params.sessionAgentId,
							cwd: startupExecutionCwd,
							dynamicTools: params.dynamicTools,
							persistentWebSearchAllowed: params.persistentWebSearchAllowed,
							webSearchAllowed: params.webSearchAllowed,
							appServer: pluginAppServer,
							developerInstructions: params.developerInstructions,
							config: threadConfig,
							finalConfigPatch: params.finalConfigPatch,
							buildFinalConfigPatch: params.buildFinalConfigPatch,
							nativeHookRelayGeneration: params.nativeHookRelayGeneration,
							nativeCodeModeEnabled: params.nativeToolSurfaceEnabled,
							nativeProviderWebSearchSupport: params.nativeProviderWebSearchSupport,
							nativeCodeModeOnlyEnabled: params.appServer.codeModeOnly,
							userMcpServersEnabled: params.nativeToolSurfaceEnabled,
							mcpServersFingerprint: params.bundleMcpThreadConfig.fingerprint,
							mcpServersFingerprintEvaluated: params.bundleMcpThreadConfig.evaluated,
							environmentSelection: startupEnvironmentSelection,
							appServerRuntimeFingerprint,
							contextEngineProjection: params.contextEngineProjection,
							signal,
							pluginThreadConfig: pluginThreadConfigRequired ? {
								enabled: true,
								inputFingerprint: pluginThreadConfigInputFingerprint,
								enabledPluginConfigKeys,
								build: () => buildCodexPluginThreadConfig({
									pluginConfig: pluginThreadConfigPluginConfig,
									request: (method, requestParams) => activeStartupClient.request(method, requestParams, {
										timeoutMs: params.appServer.requestTimeoutMs,
										signal
									}),
									appCache: defaultCodexAppInventoryCache,
									appCacheKey: pluginAppCacheKey
								})
							} : void 0
						});
						try {
							const startupThread = await startOrResumeThread(buildThreadLifecycleParams(startupAbandonController.signal));
							if (startupAbandonController.signal.aborted) {
								await releaseStartupSandboxEnvironment();
								throw new Error("codex app-server startup aborted");
							}
							startupSandboxEnvironmentAcquired = false;
							startupAttemptSucceeded = true;
							return {
								client: activeStartupClient,
								thread: startupThread,
								sandboxEnvironment: startupSandboxEnvironment,
								environmentSelection: startupEnvironmentSelection,
								executionCwd: startupExecutionCwd,
								sandboxPolicy: startupSandboxPolicy,
								restartContextEngineCodexThread: () => startOrResumeThread(buildThreadLifecycleParams(params.signal))
							};
						} catch (error) {
							await releaseStartupSandboxEnvironment();
							throw error;
						} finally {
							if (releaseStartupResourcesOnTimeout === releaseStartupSandboxEnvironment) releaseStartupResourcesOnTimeout = void 0;
						}
					} catch (error) {
						startupAttemptError = error;
						throw error;
					} finally {
						if (!startupAttemptSucceeded) {
							if (releaseSharedClientLease === startupClientLease) releaseSharedClientLease = void 0;
							startupClientLease?.();
							if (startupAbandoned || params.signal.aborted) {
								if (startupClientForAbandonedRequestCleanup === startupClient) startupClientForAbandonedRequestCleanup = void 0;
								await closeCodexStartupClientBestEffort(startupClient);
							} else if (shouldClearSharedClientAfterStartupRace(startupAttemptError) || shouldClearSharedClientAfterStartupFailure({
								error: startupAttemptError,
								spawnedBy: params.spawnedBy
							})) {
								if (startupClientForAbandonedRequestCleanup === startupClient) startupClientForAbandonedRequestCleanup = void 0;
								await closeCodexStartupClientBestEffort(startupClient);
							}
						}
					}
				};
				for (let attempt = 1; attempt <= CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS; attempt += 1) try {
					return await startupAttempt();
				} catch (error) {
					if (params.signal.aborted || !isCodexAppServerConnectionClosedError(error)) throw error;
					const failedClient = attemptedClient;
					const clearedSharedClient = clearSharedCodexAppServerClientIfCurrent(failedClient);
					if (startupClientForAbandonedRequestCleanup === failedClient) startupClientForAbandonedRequestCleanup = void 0;
					if (attempt >= CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS) {
						log.warn("codex app-server connection closed during startup; retries exhausted", {
							attempt,
							maxAttempts: CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS,
							clearedSharedClient,
							error: formatErrorMessage(error)
						});
						throw error;
					}
					log.warn("codex app-server connection closed during startup; restarting app-server and retrying", {
						attempt,
						nextAttempt: attempt + 1,
						maxAttempts: CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS,
						clearedSharedClient,
						error: formatErrorMessage(error)
					});
				}
				throw new Error("codex app-server startup retry loop exited unexpectedly");
			}
		});
		startupClientForAbandonedRequestCleanup = void 0;
		if (!releaseSharedClientLease) throw new Error("codex app-server startup succeeded without a shared client lease");
		return {
			...startupResult,
			pluginAppServer,
			releaseSharedClientLease
		};
	} catch (error) {
		if (params.signal.aborted || shouldClearSharedClientAfterStartupAbandon(error)) {
			releaseSharedClientLease?.();
			releaseSharedClientLease = void 0;
			await closeCodexStartupClientBestEffort(startupClientForAbandonedRequestCleanup);
			startupClientForAbandonedRequestCleanup = void 0;
		} else if (shouldClearSharedClientAfterStartupRace(error) || shouldClearSharedClientAfterStartupFailure({
			error,
			spawnedBy: params.spawnedBy
		})) {
			releaseSharedClientLease?.();
			releaseSharedClientLease = void 0;
			await closeCodexStartupClientBestEffort(startupClientForAbandonedRequestCleanup);
			startupClientForAbandonedRequestCleanup = void 0;
		}
		throw error;
	} finally {
		params.signal.removeEventListener("abort", abandonStartupAcquire);
	}
}
function shouldClearSharedClientAfterStartupAbandon(error) {
	return error instanceof Error && (error.message === "codex app-server startup timed out" || error.message === "codex app-server startup aborted");
}
function shouldClearSharedClientAfterStartupRace(error) {
	return error instanceof Error && (shouldClearSharedClientAfterStartupAbandon(error) || error.message.endsWith(" timed out"));
}
function shouldClearSharedClientAfterStartupFailure(params) {
	if (!(params.error instanceof Error)) return !params.spawnedBy;
	if (params.error.message.includes("write EPIPE")) return true;
	return !params.spawnedBy;
}
//#endregion
//#region extensions/codex/src/app-server/attempt-steering.ts
/**
* Debounced steering queue for forwarding user text to an active Codex
* app-server turn.
*/
const CODEX_STEER_ALL_DEBOUNCE_MS = 500;
/**
* Creates a queue that batches steer text while still serializing app-server
* `turn/steer` requests.
*/
function createCodexSteeringQueue(params) {
	let batchedTexts = [];
	let batchTimer;
	let sendChain = Promise.resolve();
	const clearBatchTimer = () => {
		if (batchTimer) {
			clearTimeout(batchTimer);
			batchTimer = void 0;
		}
	};
	const sendTexts = async (texts) => {
		if (texts.length === 0) return;
		if (params.signal.aborted) throw new Error("codex app-server steering queue aborted");
		await params.client.request("turn/steer", {
			threadId: params.threadId,
			expectedTurnId: params.turnId,
			input: texts.map(toCodexTextInput)
		});
	};
	const enqueueSend = (texts) => {
		const send = sendChain.then(() => sendTexts(texts));
		sendChain = send.catch((error) => {
			log.debug("codex app-server queued steer failed", { error });
		});
		return send;
	};
	const flushBatch = () => {
		clearBatchTimer();
		const items = batchedTexts;
		batchedTexts = [];
		const send = enqueueSend(items.map((item) => item.text));
		send.then(() => {
			for (const item of items) item.resolve();
		}, (error) => {
			for (const item of items) item.reject(error);
		});
		return send;
	};
	return {
		async queue(text, options) {
			if (params.answerPendingUserInput(text)) return;
			return await new Promise((resolve, reject) => {
				batchedTexts.push({
					text,
					resolve,
					reject
				});
				clearBatchTimer();
				const debounceMs = normalizeCodexSteerDebounceMs(options?.debounceMs);
				if (debounceMs === 0) {
					flushBatch().catch(() => void 0);
					return;
				}
				batchTimer = setTimeout(() => {
					batchTimer = void 0;
					flushBatch().catch(() => void 0);
				}, debounceMs);
			});
		},
		async flushPending() {
			await flushBatch().catch(() => void 0);
		},
		cancel() {
			clearBatchTimer();
			const items = batchedTexts;
			batchedTexts = [];
			for (const item of items) item.reject(/* @__PURE__ */ new Error("codex app-server steering queue cancelled"));
		}
	};
}
/** Normalizes steer debounce milliseconds, preserving explicit zero. */
function normalizeCodexSteerDebounceMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : CODEX_STEER_ALL_DEBOUNCE_MS;
}
/** Converts plain text into the Codex app-server user-input shape. */
function toCodexTextInput(text) {
	return {
		type: "text",
		text,
		text_elements: []
	};
}
//#endregion
//#region extensions/codex/src/app-server/attempt-turn-watches.ts
/**
* Idle-watch controller for Codex app-server turn progress, completion, and
* terminal-event gaps.
*/
/**
* Creates a controller that arms/disarms timers as Codex app-server
* notifications and tool handoffs progress.
*/
function createCodexAttemptTurnWatchController(params) {
	let completionIdleTimer;
	let completionIdleWatchArmed = false;
	let completionIdleWatchPinnedByTerminalError = false;
	let completionIdleTimeoutOverrideMs;
	let assistantCompletionIdleTimer;
	let assistantCompletionIdleWatchArmed = false;
	let assistantCompletionLastActivityAt = Date.now();
	let assistantCompletionLastActivityDetails;
	let attemptIdleTimer;
	let attemptIdleWatchArmed = false;
	let terminalIdleTimer;
	let terminalIdleWatchArmed = false;
	let completionLastActivityAt = Date.now();
	let completionLastActivityReason = "startup";
	let completionLastActivityDetails;
	let attemptIdleTimeoutOverrideMs;
	let attemptLastProgressAt = Date.now();
	let attemptLastProgressReason = "startup";
	let attemptLastProgressDetails;
	const turnCompletionIdleTimeoutMs = resolveTimerTimeoutMs(params.turnCompletionIdleTimeoutMs, 1);
	const turnAssistantCompletionIdleTimeoutMs = resolveTimerTimeoutMs(params.turnAssistantCompletionIdleTimeoutMs, 1);
	const turnAttemptIdleTimeoutMs = resolveTimerTimeoutMs(params.turnAttemptIdleTimeoutMs, 1);
	const turnTerminalIdleTimeoutMs = resolveTimerTimeoutMs(params.turnTerminalIdleTimeoutMs, 1);
	const interruptTimeoutMs = resolveTimerTimeoutMs(params.interruptTimeoutMs, 1);
	const resolveWatchTimeoutMs = (timeoutMs) => resolveTimerTimeoutMs(timeoutMs, 1);
	const clearCompletionIdleTimer = () => {
		if (completionIdleTimer) {
			clearTimeout(completionIdleTimer);
			completionIdleTimer = void 0;
		}
	};
	const clearTerminalIdleTimer = () => {
		if (terminalIdleTimer) {
			clearTimeout(terminalIdleTimer);
			terminalIdleTimer = void 0;
		}
	};
	const clearAssistantCompletionIdleTimer = () => {
		if (assistantCompletionIdleTimer) {
			clearTimeout(assistantCompletionIdleTimer);
			assistantCompletionIdleTimer = void 0;
		}
	};
	const clearAttemptIdleTimer = () => {
		if (attemptIdleTimer) {
			clearTimeout(attemptIdleTimer);
			attemptIdleTimer = void 0;
		}
	};
	const clearAllTimers = () => {
		clearAttemptIdleTimer();
		clearCompletionIdleTimer();
		clearAssistantCompletionIdleTimer();
		clearTerminalIdleTimer();
	};
	function scheduleCompletionIdleWatch() {
		clearCompletionIdleTimer();
		if (params.isCompleted() || params.signal.aborted || !completionIdleWatchArmed || params.getActiveAppServerTurnRequests() > 0) return;
		const elapsedMs = Math.max(0, Date.now() - completionLastActivityAt);
		const delayMs = Math.max(1, (completionIdleTimeoutOverrideMs ?? turnCompletionIdleTimeoutMs) - elapsedMs);
		completionIdleTimer = setTimeout(fireCompletionIdleTimeout, delayMs);
		completionIdleTimer.unref?.();
	}
	function scheduleAssistantCompletionIdleWatch() {
		clearAssistantCompletionIdleTimer();
		if (params.isCompleted() || params.signal.aborted || !assistantCompletionIdleWatchArmed) return;
		const elapsedMs = Math.max(0, Date.now() - assistantCompletionLastActivityAt);
		const delayMs = Math.max(1, turnAssistantCompletionIdleTimeoutMs - elapsedMs);
		assistantCompletionIdleTimer = setTimeout(fireAssistantCompletionIdleRelease, delayMs);
		assistantCompletionIdleTimer.unref?.();
	}
	function scheduleAttemptIdleWatch() {
		clearAttemptIdleTimer();
		if (params.isCompleted() || params.signal.aborted || !attemptIdleWatchArmed) return;
		const elapsedMs = Math.max(0, Date.now() - attemptLastProgressAt);
		const delayMs = Math.max(1, (attemptIdleTimeoutOverrideMs ?? turnAttemptIdleTimeoutMs) - elapsedMs);
		attemptIdleTimer = setTimeout(fireAttemptIdleTimeout, delayMs);
		attemptIdleTimer.unref?.();
	}
	function scheduleTerminalIdleWatch() {
		clearTerminalIdleTimer();
		if (params.isCompleted() || params.signal.aborted || !terminalIdleWatchArmed || params.getActiveAppServerTurnRequests() > 0) return;
		const elapsedMs = Math.max(0, Date.now() - completionLastActivityAt);
		const delayMs = Math.max(1, turnTerminalIdleTimeoutMs - elapsedMs);
		terminalIdleTimer = setTimeout(fireTerminalIdleTimeout, delayMs);
		terminalIdleTimer.unref?.();
	}
	function scheduleProgressWatches() {
		scheduleAttemptIdleWatch();
		scheduleCompletionIdleWatch();
		scheduleTerminalIdleWatch();
	}
	function isCompletionIdleTimeoutDueBeforeAttempt(timeoutMs) {
		if (params.isCompleted() || params.isTerminalTurnNotificationQueued() || params.signal.aborted || !completionIdleWatchArmed || params.getActiveAppServerTurnRequests() > 0) return false;
		const completionTimeoutMs = completionIdleTimeoutOverrideMs ?? turnCompletionIdleTimeoutMs;
		if (completionTimeoutMs > timeoutMs) return false;
		return Math.max(0, Date.now() - completionLastActivityAt) >= completionTimeoutMs;
	}
	function recordAttemptProgress(reason, options) {
		attemptIdleTimeoutOverrideMs = options?.attemptTimeoutMs !== void 0 ? resolveWatchTimeoutMs(options.attemptTimeoutMs) : void 0;
		attemptLastProgressAt = completionLastActivityAt;
		attemptLastProgressReason = reason;
		attemptLastProgressDetails = options?.details;
		params.onAttemptProgress(reason, options?.details);
		scheduleAttemptIdleWatch();
	}
	function fireAssistantCompletionIdleRelease() {
		if (params.isCompleted() || params.signal.aborted || !assistantCompletionIdleWatchArmed) return;
		if (params.getActiveAppServerTurnRequests() > 0 || params.getActiveTurnItemCount() > 0) {
			scheduleAssistantCompletionIdleWatch();
			return;
		}
		const idleMs = Math.max(0, Date.now() - assistantCompletionLastActivityAt);
		if (idleMs < turnAssistantCompletionIdleTimeoutMs) {
			scheduleAssistantCompletionIdleWatch();
			return;
		}
		assistantCompletionIdleWatchArmed = false;
		clearCompletionIdleTimer();
		clearTerminalIdleTimer();
		const turnId = params.getTurnId();
		params.onRecordEvent("turn.assistant_completion_idle_release", {
			threadId: params.threadId,
			turnId,
			idleMs,
			timeoutMs: turnAssistantCompletionIdleTimeoutMs,
			...assistantCompletionLastActivityDetails
		});
		log.warn("codex app-server turn released after completed assistant item without terminal event", {
			threadId: params.threadId,
			turnId,
			idleMs,
			timeoutMs: turnAssistantCompletionIdleTimeoutMs,
			...assistantCompletionLastActivityDetails
		});
		if (turnId) params.onInterruptTurn({
			threadId: params.threadId,
			turnId,
			timeoutMs: interruptTimeoutMs
		});
		params.onCompleted();
		params.onResolveCompletion();
	}
	function fireAttemptIdleTimeout() {
		if (params.isCompleted() || params.signal.aborted || !attemptIdleWatchArmed) return;
		const idleMs = Math.max(0, Date.now() - attemptLastProgressAt);
		const timeoutMs = attemptIdleTimeoutOverrideMs ?? turnAttemptIdleTimeoutMs;
		if (idleMs < timeoutMs) {
			scheduleAttemptIdleWatch();
			return;
		}
		if (isCompletionIdleTimeoutDueBeforeAttempt(timeoutMs)) {
			fireCompletionIdleTimeout();
			return;
		}
		const timeout = {
			kind: "progress",
			idleMs,
			timeoutMs,
			lastActivityReason: attemptLastProgressReason,
			details: attemptLastProgressDetails
		};
		params.onTimeout(timeout);
		params.onMarkTimedOut();
		params.onRecordEvent("turn.progress_idle_timeout", {
			threadId: params.threadId,
			turnId: params.getTurnId(),
			idleMs,
			timeoutMs: timeout.timeoutMs,
			lastActivityReason: timeout.lastActivityReason,
			...timeout.details
		});
		log.warn("codex app-server turn idle timed out waiting for progress", {
			threadId: params.threadId,
			turnId: params.getTurnId(),
			idleMs,
			timeoutMs: timeout.timeoutMs,
			lastActivityReason: timeout.lastActivityReason,
			...timeout.details
		});
		params.onAbort("turn_progress_idle_timeout");
	}
	function fireCompletionIdleTimeout() {
		if (params.isCompleted() || params.isTerminalTurnNotificationQueued() || params.signal.aborted || !completionIdleWatchArmed || params.getActiveAppServerTurnRequests() > 0) return;
		const timeoutMs = completionIdleTimeoutOverrideMs ?? turnCompletionIdleTimeoutMs;
		const idleMs = Math.max(0, Date.now() - completionLastActivityAt);
		if (idleMs < timeoutMs) {
			scheduleCompletionIdleWatch();
			return;
		}
		const details = {
			...completionLastActivityDetails,
			activeAppServerTurnRequests: params.getActiveAppServerTurnRequests(),
			activeTurnItemCount: params.getActiveTurnItemCount(),
			terminalTurnNotificationQueued: params.isTerminalTurnNotificationQueued(),
			completionIdleWatchArmed,
			assistantCompletionIdleWatchArmed,
			terminalIdleWatchArmed
		};
		const timeout = {
			kind: "completion",
			idleMs,
			timeoutMs,
			lastActivityReason: completionLastActivityReason,
			details
		};
		params.onTimeout(timeout);
		params.onMarkTimedOut();
		params.onRecordEvent("turn.completion_idle_timeout", {
			threadId: params.threadId,
			turnId: params.getTurnId(),
			idleMs,
			timeoutMs,
			lastActivityReason: timeout.lastActivityReason,
			...timeout.details
		});
		log.warn("codex app-server turn idle timed out waiting for completion", {
			threadId: params.threadId,
			turnId: params.getTurnId(),
			idleMs,
			timeoutMs,
			lastActivityReason: timeout.lastActivityReason,
			...timeout.details
		});
		params.onAbort("turn_completion_idle_timeout");
	}
	function fireTerminalIdleTimeout() {
		if (params.isCompleted() || params.isTerminalTurnNotificationQueued() || params.signal.aborted || !terminalIdleWatchArmed || params.getActiveAppServerTurnRequests() > 0) return;
		const idleMs = Math.max(0, Date.now() - completionLastActivityAt);
		if (idleMs < turnTerminalIdleTimeoutMs) {
			scheduleTerminalIdleWatch();
			return;
		}
		const timeout = {
			kind: "terminal",
			idleMs,
			timeoutMs: turnTerminalIdleTimeoutMs,
			lastActivityReason: completionLastActivityReason,
			details: completionLastActivityDetails
		};
		params.onTimeout(timeout);
		params.onMarkTimedOut();
		params.onRecordEvent("turn.terminal_idle_timeout", {
			threadId: params.threadId,
			turnId: params.getTurnId(),
			idleMs,
			timeoutMs: timeout.timeoutMs,
			lastActivityReason: timeout.lastActivityReason,
			...timeout.details
		});
		log.warn("codex app-server turn idle timed out waiting for terminal event", {
			threadId: params.threadId,
			turnId: params.getTurnId(),
			idleMs,
			timeoutMs: timeout.timeoutMs,
			lastActivityReason: timeout.lastActivityReason,
			...timeout.details
		});
		params.onAbort("turn_terminal_idle_timeout");
	}
	return {
		isCompletionIdleWatchArmed: () => completionIdleWatchArmed,
		isCompletionIdleWatchPinnedByTerminalError: () => completionIdleWatchPinnedByTerminalError,
		isAssistantCompletionIdleWatchArmed: () => assistantCompletionIdleWatchArmed,
		armAttemptIdleWatch: () => {
			attemptIdleWatchArmed = true;
			scheduleAttemptIdleWatch();
		},
		armTerminalIdleWatch: () => {
			terminalIdleWatchArmed = true;
			scheduleTerminalIdleWatch();
		},
		armCompletionIdleWatch: (options) => {
			completionIdleWatchArmed = true;
			completionIdleWatchPinnedByTerminalError = options?.pinnedByTerminalError === true;
			completionIdleTimeoutOverrideMs = options?.timeoutMs !== void 0 ? resolveWatchTimeoutMs(options.timeoutMs) : void 0;
			scheduleCompletionIdleWatch();
		},
		disarmCompletionIdleWatch: () => {
			completionIdleWatchArmed = false;
			completionIdleWatchPinnedByTerminalError = false;
			completionIdleTimeoutOverrideMs = void 0;
			clearCompletionIdleTimer();
		},
		armAssistantCompletionIdleWatch: (details) => {
			assistantCompletionIdleWatchArmed = true;
			assistantCompletionLastActivityAt = Date.now();
			assistantCompletionLastActivityDetails = details;
			scheduleAssistantCompletionIdleWatch();
		},
		disarmAssistantCompletionIdleWatch: () => {
			assistantCompletionIdleWatchArmed = false;
			assistantCompletionLastActivityDetails = void 0;
			clearAssistantCompletionIdleTimer();
		},
		touchActivity: (reason, options) => {
			completionLastActivityAt = Date.now();
			completionLastActivityReason = reason;
			completionLastActivityDetails = options?.details;
			completionIdleTimeoutOverrideMs = void 0;
			if (options?.attemptProgress) recordAttemptProgress(reason, options);
			params.onProgressDiagnostic(reason);
			if (options?.arm) {
				completionIdleWatchArmed = true;
				completionIdleWatchPinnedByTerminalError = false;
			}
			scheduleProgressWatches();
		},
		noteNotificationReceived: (method, options) => {
			completionLastActivityAt = Date.now();
			completionLastActivityReason = `notification:${method}`;
			if (options?.details !== void 0) completionLastActivityDetails = options.details;
			if (options?.attemptProgress) recordAttemptProgress(completionLastActivityReason, options);
		},
		extendAttemptIdleWatch: (timeoutMs) => {
			attemptIdleTimeoutOverrideMs = resolveWatchTimeoutMs(timeoutMs);
			scheduleAttemptIdleWatch();
		},
		scheduleProgressWatches,
		clearCompletionIdleTimer,
		clearAssistantCompletionIdleTimer,
		clearTerminalIdleTimer,
		clearAttemptIdleTimer,
		clearAllTimers
	};
}
/** Hard cap for per-call Codex dynamic tool timeout overrides. */
const CODEX_DYNAMIC_TOOL_MAX_TIMEOUT_MS = 6e5;
const CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS = 12e4;
/** Timeout for message-delivery dynamic tool calls. */
const CODEX_DYNAMIC_MESSAGE_TOOL_TIMEOUT_MS = 12e4;
const LOG_FIELD_MAX_LENGTH = 160;
function normalizeLogField(value) {
	if (typeof value !== "string") return;
	const normalized = value.replaceAll(String.fromCharCode(27), " ").replaceAll("\r", " ").replaceAll("\n", " ").replaceAll("	", " ").trim();
	if (!normalized) return;
	return normalized.length > LOG_FIELD_MAX_LENGTH ? `${normalized.slice(0, LOG_FIELD_MAX_LENGTH - 3)}...` : normalized;
}
function readNumericTimeoutMs(value) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.floor(value));
	if (typeof value === "string") {
		const parsed = parseStrictNonNegativeInteger(value);
		if (parsed !== void 0) return Math.max(0, Math.floor(parsed));
	}
}
function formatDynamicToolTimeoutDetails(params) {
	const tool = normalizeLogField(params.call.tool) ?? "unknown";
	const baseMeta = {
		tool: params.call.tool,
		toolCallId: params.call.callId,
		threadId: params.call.threadId,
		turnId: params.call.turnId,
		timeoutMs: params.timeoutMs,
		timeoutKind: "codex_dynamic_tool_rpc"
	};
	if (tool !== "process" || !isJsonObject(params.call.arguments)) return {
		responseMessage: `OpenClaw dynamic tool call timed out after ${params.timeoutMs}ms while running tool ${tool}.`,
		consoleMessage: `codex dynamic tool timeout: tool=${tool} toolTimeoutMs=${params.timeoutMs}; per-tool-call watchdog, not session idle`,
		meta: baseMeta
	};
	const action = normalizeLogField(params.call.arguments.action);
	const sessionId = normalizeLogField(params.call.arguments.sessionId);
	const requestedTimeoutMs = readNumericTimeoutMs(params.call.arguments.timeout);
	const actionPart = action ? ` action=${action}` : "";
	const sessionPart = sessionId ? ` sessionId=${sessionId}` : "";
	const requestedPart = requestedTimeoutMs === void 0 ? "" : ` requestedWaitMs=${requestedTimeoutMs}`;
	const retryHint = action === "poll" ? "; repeated lines usually mean process-poll retry churn, not model progress" : "";
	const responseTarget = action || sessionId ? ` while waiting for process${actionPart}${sessionPart}` : " while waiting for the process tool";
	return {
		responseMessage: `OpenClaw dynamic tool call timed out after ${params.timeoutMs}ms${responseTarget}. This is a tool RPC timeout, not a session idle timeout.`,
		consoleMessage: `codex process tool timeout:${actionPart}${sessionPart} toolTimeoutMs=${params.timeoutMs}${requestedPart}; per-tool-call watchdog, not session idle${retryHint}`,
		meta: {
			...baseMeta,
			processAction: action,
			processSessionId: sessionId,
			processRequestedTimeoutMs: requestedTimeoutMs
		}
	};
}
/**
* Runs a dynamic tool call with run-abort and per-call timeout handling,
* returning a Codex protocol response instead of throwing.
*/
async function handleDynamicToolCallWithTimeout(params) {
	let didNotifyAgentToolResult = false;
	const notifyAgentToolResult = (event) => {
		if (didNotifyAgentToolResult) return;
		didNotifyAgentToolResult = true;
		try {
			params.onAgentToolResult?.(event);
		} catch (error) {
			log.warn(`onAgentToolResult handler failed: tool=${params.call.tool} error=${String(error)}`);
		}
	};
	const notifyFailedToolResult = (message) => {
		notifyAgentToolResult({
			toolName: params.call.tool,
			result: {
				content: [{
					type: "text",
					text: message
				}],
				details: {
					status: "failed",
					error: message
				}
			},
			isError: true
		});
	};
	if (params.signal.aborted) {
		const message = "OpenClaw dynamic tool call aborted before execution.";
		params.onFallbackSelected?.();
		notifyFailedToolResult(message);
		return failedDynamicToolResponse(message);
	}
	const controller = new AbortController();
	let timeout;
	let timedOut = false;
	let resolveAbort;
	const abortFromRun = () => {
		const message = "OpenClaw dynamic tool call aborted.";
		params.onFallbackSelected?.();
		controller.abort(params.signal.reason ?? /* @__PURE__ */ new Error(message));
		notifyFailedToolResult(message);
		resolveAbort?.(failedDynamicToolResponse(message, { sideEffectEvidence: true }));
	};
	const abortPromise = new Promise((resolve) => {
		resolveAbort = resolve;
	});
	const timeoutPromise = new Promise((resolve) => {
		const timeoutMs = clampDynamicToolTimeoutMs(params.timeoutMs);
		timeout = setTimeout(() => {
			timedOut = true;
			const timeoutDetails = formatDynamicToolTimeoutDetails({
				call: params.call,
				timeoutMs
			});
			params.onFallbackSelected?.();
			controller.abort(new Error(timeoutDetails.responseMessage));
			params.onTimeout?.();
			log.warn("codex dynamic tool call timed out", {
				...timeoutDetails.meta,
				consoleMessage: timeoutDetails.consoleMessage
			});
			notifyFailedToolResult(timeoutDetails.responseMessage);
			resolve(failedDynamicToolResponse(timeoutDetails.responseMessage, { sideEffectEvidence: true }));
		}, timeoutMs);
		timeout.unref?.();
	});
	try {
		params.signal.addEventListener("abort", abortFromRun, { once: true });
		if (params.signal.aborted) abortFromRun();
		const response = await Promise.race([
			params.toolBridge.handleToolCall(params.call, {
				signal: controller.signal,
				onAgentToolResult: notifyAgentToolResult,
				toolCallOrdinal: params.toolCallOrdinal
			}),
			abortPromise,
			timeoutPromise
		]);
		if (!response.success && !didNotifyAgentToolResult) notifyFailedToolResult(readDynamicToolResponseText(response));
		return response;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		notifyFailedToolResult(message);
		return failedDynamicToolResponse(message, { sideEffectEvidence: true });
	} finally {
		if (timeout) clearTimeout(timeout);
		params.signal.removeEventListener("abort", abortFromRun);
		resolveAbort = void 0;
		if (!timedOut && !controller.signal.aborted) controller.abort(/* @__PURE__ */ new Error("OpenClaw dynamic tool call finished."));
	}
}
function readDynamicToolResponseText(response) {
	return response.contentItems.flatMap((item) => item.type === "inputText" && typeof item.text === "string" ? [item.text] : []).join("\n").trim() || "OpenClaw dynamic tool call failed.";
}
function failedDynamicToolResponse(message, options) {
	const response = {
		contentItems: [{
			type: "inputText",
			text: message
		}],
		success: false
	};
	Object.defineProperty(response, "diagnosticTerminalType", {
		configurable: true,
		enumerable: false,
		value: "error"
	});
	if (options?.sideEffectEvidence === true) Object.defineProperty(response, "sideEffectEvidence", {
		configurable: true,
		enumerable: false,
		value: true
	});
	return response;
}
/** Strips OpenClaw-only metadata before sending a dynamic tool response to Codex. */
function toCodexDynamicToolProtocolResponse(response) {
	return {
		contentItems: response.contentItems,
		success: response.success
	};
}
/** Adds async-started progress details when a tool result continues out of band. */
function toCodexDynamicToolProgressResponse(response, protocolResponse) {
	if (response.asyncStarted !== true) return protocolResponse;
	return {
		...protocolResponse,
		details: {
			async: true,
			status: "started"
		}
	};
}
/** Decides whether a terminal dynamic tool response can release the Codex turn. */
function shouldReleaseTurnAfterTerminalDynamicTool(state) {
	return !state.completed && !state.aborted && state.responseSuccess && !state.currentTurnHadNonTerminalDynamicToolResult && state.activeAppServerTurnRequests === 0 && state.activeTurnItemIdsCount === 0 && state.pendingOpenClawDynamicToolCompletionIdsCount === 0;
}
/** Returns true when a non-async result should block terminal-release shortcuts. */
function shouldBlockTerminalReleaseForNonTerminalDynamicToolResult(response) {
	return response.asyncStarted !== true;
}
/** Resolves whether terminal diagnostic state should release, wait, or stay idle. */
function resolveTerminalDynamicToolBatchAction(state) {
	if (state.activeAppServerTurnRequests > 0 || state.activeTurnItemIdsCount > 0 || state.pendingOpenClawDynamicToolCompletionIdsCount > 0) return "wait";
	if (state.currentTurnHadNonTerminalDynamicToolResult) return "clear-nonterminal-batch";
	if (state.hasPendingTerminalDynamicToolRelease) return "release-pending-terminal";
	return "idle";
}
/** Returns true for diagnostic events that terminate a dynamic tool call. */
function isDynamicToolTerminalDiagnosticEvent(event) {
	return event.type === "tool.execution.completed" || event.type === "tool.execution.error" || event.type === "tool.execution.blocked";
}
/** Matches terminal diagnostics to a specific dynamic tool call id/name. */
function isMatchingDynamicToolTerminalDiagnostic(params) {
	if (params.event.toolCallId !== params.call.callId || params.event.toolName !== params.call.tool) return false;
	if (params.runId !== void 0) return params.event.runId === params.runId;
	if (params.sessionId !== void 0) return params.event.sessionId === params.sessionId;
	if (params.sessionKey !== void 0) return params.event.sessionKey === params.sessionKey;
	return params.event.runId === void 0 && params.event.sessionId === void 0 && params.event.sessionKey === void 0;
}
/** Checks pending diagnostics for a terminal event matching a tool call. */
function hasPendingDynamicToolTerminalDiagnostic(params) {
	return hasPendingInternalDiagnosticEvent((event) => {
		if (!isDynamicToolTerminalDiagnosticEvent(event)) return false;
		return isMatchingDynamicToolTerminalDiagnostic({
			event,
			call: params.call,
			runId: params.runId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		});
	});
}
/** Resolves per-tool timeout, applying media/message defaults and hard caps. */
function resolveDynamicToolCallTimeoutMs(params) {
	return clampDynamicToolTimeoutMs(readDynamicToolCallTimeoutMs(params.call.arguments) ?? readConfiguredDynamicToolTimeoutMs(params.call.tool, params.config) ?? 9e4);
}
function readDynamicToolCallTimeoutMs(value) {
	if (!isJsonObject(value)) return;
	return readPositiveFiniteTimeoutMs(value.timeoutMs);
}
function readConfiguredDynamicToolTimeoutMs(toolName, config) {
	if (toolName === "image_generate") {
		const imageGenerationModel = config?.agents?.defaults?.imageGenerationModel;
		if (!imageGenerationModel || typeof imageGenerationModel !== "object") return CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS;
		return readPositiveFiniteTimeoutMs(imageGenerationModel.timeoutMs) ?? CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS;
	}
	if (toolName === "image") return readTimeoutSecondsAsMs(config?.tools?.media?.image?.timeoutSeconds) ?? 6e4;
	if (toolName === "message") return CODEX_DYNAMIC_MESSAGE_TOOL_TIMEOUT_MS;
}
function readTimeoutSecondsAsMs(value) {
	const seconds = readPositiveFiniteTimeoutMs(value);
	return seconds === void 0 ? void 0 : seconds * 1e3;
}
function readPositiveFiniteTimeoutMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function clampDynamicToolTimeoutMs(timeoutMs) {
	return Math.max(1, Math.min(CODEX_DYNAMIC_TOOL_MAX_TIMEOUT_MS, Math.floor(timeoutMs)));
}
//#endregion
//#region extensions/codex/src/app-server/local-runtime-attribution.ts
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_RESPONSES_API = "openai-responses";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
function normalizeRuntimeId(value) {
	return value?.trim().toLowerCase() ?? "";
}
/** Maps local Codex runtime plans onto the provider/api pair exposed to event projection. */
function resolveCodexLocalRuntimeAttribution(params) {
	const authProfileProvider = normalizeRuntimeId(params.runtimePlan?.auth?.authProfileProviderForAuth);
	if (normalizeRuntimeId(params.runtimePlan?.observability.harnessId) === "codex" && authProfileProvider !== OPENAI_PROVIDER_ID && normalizeRuntimeId(params.model.provider) === OPENAI_PROVIDER_ID && normalizeRuntimeId(params.model.api) === OPENAI_RESPONSES_API) return {
		provider: OPENAI_PROVIDER_ID,
		api: OPENAI_CODEX_RESPONSES_API
	};
	return {
		provider: params.provider,
		api: params.model.api
	};
}
//#endregion
//#region extensions/codex/src/app-server/tool-progress-normalization.ts
/**
* Normalizes and sanitizes Codex dynamic-tool progress payloads before they are
* emitted into OpenClaw events or logs.
*/
/** Maps OpenClaw tool-progress config to the mode used by Codex progress metadata. */
function resolveCodexToolProgressDetailMode(value) {
	return value === "raw" ? "raw" : "explain";
}
/** Recursively redacts sensitive strings and handles circular values in event payloads. */
function sanitizeCodexAgentEventValue(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (typeof value === "string") return redactToolPayloadText(value);
	if (Array.isArray(value)) {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		return value.map((entry) => sanitizeCodexAgentEventValue(entry, seen));
	}
	if (value && typeof value === "object") {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		const out = {};
		for (const [key, child] of Object.entries(value)) out[key] = typeof child === "string" ? redactSensitiveFieldValue(key, child) : sanitizeCodexAgentEventValue(child, seen);
		return out;
	}
	return value;
}
/** Sanitizes a record-shaped Codex agent event payload. */
function sanitizeCodexAgentEventRecord(value) {
	return sanitizeCodexAgentEventValue(value);
}
/** Sanitizes dynamic-tool arguments before diagnostic/event emission. */
function sanitizeCodexToolArguments(value) {
	if (!isJsonObject(value)) return;
	return sanitizeCodexAgentEventRecord(value);
}
/** Sanitizes a Codex dynamic-tool response before diagnostic/event emission. */
function sanitizeCodexToolResponse(response) {
	return sanitizeCodexAgentEventRecord(response);
}
/** Infers compact human-readable tool metadata from Codex dynamic-tool arguments. */
function inferCodexDynamicToolMeta(call, detailMode) {
	return inferToolMetaFromArgs(call.tool, call.arguments, { detailMode });
}
//#endregion
//#region extensions/codex/src/app-server/transcript-mirror.ts
const MIRROR_IDENTITY_META_KEY = "mirrorIdentity";
function buildSenderLabel(params) {
	const label = params.senderName ?? params.senderUsername ?? params.senderE164 ?? params.senderId;
	if (!label) return;
	if (!params.senderId || label.includes(params.senderId)) return label;
	return `${label} (${params.senderId})`;
}
function buildCodexUserPromptMessageFromPrepared(params, preparedUserMessage) {
	const senderId = normalizeOptionalString(params.senderId);
	const senderName = normalizeOptionalString(params.senderName);
	const senderUsername = normalizeOptionalString(params.senderUsername);
	const senderE164 = normalizeOptionalString(params.senderE164);
	const senderLabel = buildSenderLabel({
		senderId,
		senderName,
		senderUsername,
		senderE164
	});
	const sourceChannel = normalizeOptionalString(params.inputProvenance?.sourceChannel ?? params.messageChannel ?? params.messageProvider);
	if (preparedUserMessage) return {
		role: "user",
		timestamp: Date.now(),
		...params.inputProvenance ? { provenance: params.inputProvenance } : {},
		...sourceChannel ? { sourceChannel } : {},
		...senderId ? { senderId } : {},
		...senderName ? { senderName } : {},
		...senderUsername ? { senderUsername } : {},
		...senderE164 ? { senderE164 } : {},
		...senderLabel ? { senderLabel } : {},
		...preparedUserMessage
	};
	return {
		role: "user",
		content: params.prompt,
		timestamp: Date.now(),
		...params.inputProvenance ? { provenance: params.inputProvenance } : {},
		...sourceChannel ? { sourceChannel } : {},
		...senderId ? { senderId } : {},
		...senderName ? { senderName } : {},
		...senderUsername ? { senderUsername } : {},
		...senderE164 ? { senderE164 } : {},
		...senderLabel ? { senderLabel } : {}
	};
}
function buildCodexUserPromptMessage(params) {
	return buildCodexUserPromptMessageFromPrepared(params, params.userTurnTranscriptRecorder?.message);
}
async function buildResolvedCodexUserPromptMessage(params) {
	return buildCodexUserPromptMessageFromPrepared(params, await params.userTurnTranscriptRecorder?.resolveMessage() ?? params.userTurnTranscriptRecorder?.message);
}
async function mirrorTranscriptBestEffort(params) {
	try {
		const messages = await resolveFinalCodexMirrorMessages({
			params: params.params,
			messagesSnapshot: params.result.messagesSnapshot,
			turnId: params.turnId
		});
		const mirrorResult = await mirrorCodexAppServerTranscript({
			sessionFile: params.params.sessionFile,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.params.sessionId,
			cwd: params.cwd,
			messages,
			idempotencyScope: `codex-app-server:${params.threadId}`,
			config: params.params.config
		});
		for (const message of mirrorResult.userMessagesPresent) params.notifyUserMessagePersisted(message);
	} catch (error) {
		log.warn("failed to mirror codex app-server transcript", { error });
	}
}
async function resolveFinalCodexMirrorMessages(params) {
	if (params.params.suppressNextUserMessagePersistence || !params.params.userTurnTranscriptRecorder) return params.messagesSnapshot;
	const resolvedPrompt = attachCodexMirrorIdentity(await buildResolvedCodexUserPromptMessage(params.params), `${params.turnId}:prompt`);
	const firstUserIndex = params.messagesSnapshot.findIndex((message) => message.role === "user");
	if (firstUserIndex === -1) return [resolvedPrompt, ...params.messagesSnapshot];
	const messages = params.messagesSnapshot.slice();
	messages[firstUserIndex] = resolvedPrompt;
	return messages;
}
function createCodexAppServerUserMessagePersistenceNotifier(runParams) {
	let notified = false;
	return (message) => {
		if (notified) return;
		notified = true;
		runParams.userTurnTranscriptRecorder?.markRuntimePersisted(message);
		try {
			runParams.onUserMessagePersisted?.(message);
		} catch (error) {
			log.warn("codex app-server user persistence notification failed", { error: formatErrorMessage(error) });
		}
	};
}
async function mirrorPromptAtTurnStartBestEffort(params) {
	if (params.params.suppressNextUserMessagePersistence) return;
	try {
		const mirrorPromise = (async () => {
			const userPromptMessage = attachCodexMirrorIdentity(await buildResolvedCodexUserPromptMessage(params.params), `${params.turnId}:prompt`);
			const mirrorResult = await mirrorCodexAppServerTranscript({
				sessionFile: params.params.sessionFile,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				sessionId: params.params.sessionId,
				cwd: params.cwd,
				messages: [userPromptMessage],
				idempotencyScope: `codex-app-server:${params.threadId}`,
				config: params.params.config
			});
			for (const message of mirrorResult.userMessagesPresent) params.notifyUserMessagePersisted(message);
		})();
		params.params.userTurnTranscriptRecorder?.markRuntimePersistencePending(mirrorPromise);
		await mirrorPromise;
	} catch (error) {
		log.warn("failed to mirror codex app-server prompt at turn start", { error });
	}
}
/**
* Tag a message with a stable logical identity for mirror dedupe. Callers
* should use a value that is invariant for the same logical message across
* re-emits (e.g. `${turnId}:prompt`, `${turnId}:assistant`) but distinct
* for genuinely-distinct messages (different turns, different kinds). When
* present this identity replaces the role/content fingerprint in the
* idempotency key, so the dedupe survives caller-scope rotation without
* collapsing distinct same-content turns.
*/
function attachCodexMirrorIdentity(message, identity) {
	const record = message;
	const existing = record["__openclaw"];
	const baseMeta = existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
	return {
		...record,
		__openclaw: {
			...baseMeta,
			[MIRROR_IDENTITY_META_KEY]: identity
		}
	};
}
function readMirrorIdentity(message) {
	const meta = message["__openclaw"];
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;
	const id = meta[MIRROR_IDENTITY_META_KEY];
	return typeof id === "string" && id.length > 0 ? id : void 0;
}
function fingerprintMirrorMessageContent(message) {
	const payload = JSON.stringify({
		role: message.role,
		content: message.content
	});
	return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}
function buildMirrorDedupeIdentity(message) {
	const explicit = readMirrorIdentity(message);
	if (explicit) return explicit;
	return `${message.role}:${fingerprintMirrorMessageContent(message)}`;
}
async function mirrorCodexAppServerTranscript(params) {
	const messages = params.messages.filter((message) => message.role === "user" || message.role === "assistant" || message.role === "toolResult");
	if (messages.length === 0) return { userMessagesPresent: [] };
	const transcriptTarget = resolveCodexMirrorTranscriptTarget(params);
	const { appendedUpdates, userMessagesPresent } = await withSessionTranscriptWriteLock({
		...transcriptTarget,
		config: params.config
	}, async (transcript) => {
		const nextAppendedUpdates = [];
		const nextUserMessagesPresent = [];
		const mirrorState = readTranscriptMirrorState(await transcript.readEvents());
		let nextMessageSeq = mirrorState.messageCount;
		for (const message of messages) {
			const dedupeIdentity = buildMirrorDedupeIdentity(message);
			const idempotencyKey = params.idempotencyScope ? `${params.idempotencyScope}:${dedupeIdentity}` : void 0;
			const transcriptMessage = {
				...message,
				...idempotencyKey ? { idempotencyKey } : {}
			};
			if (idempotencyKey && mirrorState.idempotencyKeys.has(idempotencyKey)) {
				const persistedUserMessage = mirrorState.userMessagesByIdempotencyKey.get(idempotencyKey);
				if (persistedUserMessage) nextUserMessagesPresent.push(persistedUserMessage);
				continue;
			}
			const nextMessage = runAgentHarnessBeforeMessageWriteHook({
				message: transcriptMessage,
				agentId: params.agentId,
				sessionKey: params.sessionKey
			});
			if (!nextMessage) continue;
			const messageToAppend = idempotencyKey ? {
				...nextMessage,
				idempotencyKey
			} : nextMessage;
			const appended = await transcript.appendMessage({
				message: messageToAppend,
				idempotencyLookup: idempotencyKey ? "caller-checked" : "scan",
				cwd: params.cwd
			});
			if (!appended) continue;
			const { messageId, message: appendedMessage } = appended;
			if (appendedMessage.role === "user") {
				nextUserMessagesPresent.push(appendedMessage);
				if (idempotencyKey) mirrorState.userMessagesByIdempotencyKey.set(idempotencyKey, appendedMessage);
			}
			nextMessageSeq += 1;
			nextAppendedUpdates.push({
				messageId,
				message: appendedMessage,
				messageSeq: nextMessageSeq
			});
			if (idempotencyKey) mirrorState.idempotencyKeys.add(idempotencyKey);
		}
		return {
			appendedUpdates: nextAppendedUpdates,
			userMessagesPresent: nextUserMessagesPresent
		};
	});
	for (const update of appendedUpdates) await publishSessionTranscriptUpdateByIdentity({
		...transcriptTarget,
		update: {
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			...params.agentId ? { agentId: params.agentId } : {},
			message: update.message,
			messageId: update.messageId,
			messageSeq: update.messageSeq
		}
	});
	return { userMessagesPresent };
}
function resolveCodexMirrorTranscriptTarget(params) {
	return {
		...params.agentId ? { agentId: params.agentId } : {},
		sessionFile: params.sessionFile,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey ?? ""
	};
}
function readTranscriptMirrorState(events) {
	const idempotencyKeys = /* @__PURE__ */ new Set();
	const userMessagesByIdempotencyKey = /* @__PURE__ */ new Map();
	let messageCount = 0;
	for (const event of events) {
		if (!event || typeof event !== "object" || Array.isArray(event)) continue;
		const parsed = event;
		if (parsed.type === "message") messageCount += 1;
		if (typeof parsed.message?.idempotencyKey === "string") {
			idempotencyKeys.add(parsed.message.idempotencyKey);
			if (parsed.message.role === "user") userMessagesByIdempotencyKey.set(parsed.message.idempotencyKey, parsed.message);
		}
	}
	return {
		idempotencyKeys,
		messageCount,
		userMessagesByIdempotencyKey
	};
}
//#endregion
//#region extensions/codex/src/app-server/event-projector.ts
const ZERO_USAGE = {
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
const CURRENT_TOKEN_USAGE_KEYS = [
	"last",
	"current",
	"lastCall",
	"lastCallUsage",
	"lastTokenUsage",
	"last_token_usage"
];
const CODEX_PROMPT_TOTAL_INPUT_KEYS = [
	"inputTokens",
	"input_tokens",
	"promptTokens",
	"prompt_tokens"
];
const MAX_TOOL_OUTPUT_DELTA_MESSAGES_PER_ITEM = 20;
const TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS = 12e3;
const MISSING_TOOL_RESULT_ERROR = "OpenClaw recorded a native Codex tool.call without a matching tool.result before the turn completed.";
const GENERATED_IMAGE_MEDIA_SUBDIR = "tool-image-generation";
const BYTES_PER_MB = 1024 * 1024;
const DEFAULT_GENERATED_IMAGE_MAX_BYTES = 6 * BYTES_PER_MB;
const TRANSCRIPT_PROGRESS_SUPPRESSED_TOOL_NAMES = new Set([
	"message",
	"messages",
	"reply",
	"send",
	"reaction",
	"react",
	"typing"
]);
function shouldEmitTranscriptToolProgress(toolName, _args) {
	const normalized = typeof toolName === "string" ? toolName.trim().toLowerCase() : "";
	return Boolean(normalized && !TRANSCRIPT_PROGRESS_SUPPRESSED_TOOL_NAMES.has(normalized));
}
var CodexAppServerEventProjector = class {
	constructor(params, threadId, turnId, options = {}) {
		this.params = params;
		this.threadId = threadId;
		this.turnId = turnId;
		this.options = options;
		this.assistantTextByItem = /* @__PURE__ */ new Map();
		this.assistantItemOrder = [];
		this.assistantPhaseByItem = /* @__PURE__ */ new Map();
		this.lastCommentaryProgressTextByItem = /* @__PURE__ */ new Map();
		this.pendingRawCommentaryEchoes = 0;
		this.reasoningTextByGroup = /* @__PURE__ */ new Map();
		this.reasoningItemOrder = /* @__PURE__ */ new Map();
		this.planTextByItem = /* @__PURE__ */ new Map();
		this.activeItemIds = /* @__PURE__ */ new Set();
		this.completedItemIds = /* @__PURE__ */ new Set();
		this.activeCompactionItemIds = /* @__PURE__ */ new Set();
		this.toolProgressTexts = /* @__PURE__ */ new Set();
		this.toolResultSummaryItemIds = /* @__PURE__ */ new Set();
		this.toolResultOutputItemIds = /* @__PURE__ */ new Set();
		this.toolResultOutputStreamedItemIds = /* @__PURE__ */ new Set();
		this.transcriptToolProgressSuppressedIds = /* @__PURE__ */ new Set();
		this.toolTranscriptArgumentsById = /* @__PURE__ */ new Map();
		this.toolResultOutputDeltaState = /* @__PURE__ */ new Map();
		this.toolResultOutputTextByItem = /* @__PURE__ */ new Map();
		this.toolMetas = /* @__PURE__ */ new Map();
		this.terminalPresentationClearedItemIds = /* @__PURE__ */ new Set();
		this.nativeToolOutcomeOrdinals = /* @__PURE__ */ new Map();
		this.sideEffectingToolItemIds = /* @__PURE__ */ new Set();
		this.sideEffectingDynamicToolCallIds = /* @__PURE__ */ new Set();
		this.toolTranscriptMessages = [];
		this.toolTranscriptCallIds = /* @__PURE__ */ new Set();
		this.toolTranscriptResultIds = /* @__PURE__ */ new Set();
		this.toolTranscriptNamesById = /* @__PURE__ */ new Map();
		this.toolTrajectoryCallIds = /* @__PURE__ */ new Set();
		this.toolTrajectoryResultIds = /* @__PURE__ */ new Set();
		this.toolTrajectoryNamesById = /* @__PURE__ */ new Map();
		this.toolTrajectoryItemsById = /* @__PURE__ */ new Map();
		this.transcriptToolProgressCallIds = /* @__PURE__ */ new Set();
		this.nativeGeneratedMediaItemIds = /* @__PURE__ */ new Set();
		this.nativeGeneratedMediaUrlsByItemId = /* @__PURE__ */ new Map();
		this.diagnosticToolStartedAtByItem = /* @__PURE__ */ new Map();
		this.afterToolCallObservedItemIds = /* @__PURE__ */ new Set();
		this.assistantStarted = false;
		this.reasoningStarted = false;
		this.reasoningEnded = false;
		this.streamedPartialAssistantItemReplaceable = false;
		this.promptErrorSource = null;
		this.synthesizedMissingToolResultError = null;
		this.aborted = false;
		this.guardianReviewCount = 0;
		this.completedCompactionCount = 0;
	}
	getCompletedTurnStatus() {
		return this.completedTurn?.status;
	}
	hasCompletedTerminalAssistantText() {
		const finalItem = this.resolveFinalAssistantTextItem();
		return finalItem !== void 0 && this.completedItemIds.has(finalItem.itemId);
	}
	/** Resolves the shared model-order position for a native tool item. */
	recordNativeToolOutcome(item) {
		if (!item || this.nativeToolOutcomeOrdinals.has(item.id) || !shouldClearTerminalPresentationForNativeItem(item)) return;
		const ordinal = this.params.allocateToolOutcomeOrdinal?.(item.id);
		if (ordinal !== void 0) this.nativeToolOutcomeOrdinals.set(item.id, ordinal);
	}
	async handleNotification(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params) return;
		if (notification.method === "account/rateLimits/updated") {
			this.latestRateLimits = params;
			rememberCodexRateLimits(params);
			return;
		}
		if (isHookNotificationMethod(notification.method)) {
			if (!this.isHookNotificationForCurrentThread(params)) return;
		} else if (!this.isNotificationForTurn(params)) return;
		switch (notification.method) {
			case "item/agentMessage/delta":
				await this.handleAssistantDelta(params);
				break;
			case "item/reasoning/summaryTextDelta":
			case "item/reasoning/textDelta":
				await this.handleReasoningDelta(notification.method, params);
				break;
			case "item/plan/delta":
				this.handlePlanDelta(params);
				break;
			case "turn/plan/updated":
				this.handleTurnPlanUpdated(params);
				break;
			case "item/started":
				await this.handleItemStarted(params);
				break;
			case "item/completed":
				await this.handleItemCompleted(params);
				break;
			case "item/commandExecution/outputDelta":
				this.handleOutputDelta(params, "bash");
				break;
			case "item/fileChange/outputDelta":
				this.handleOutputDelta(params, "apply_patch");
				break;
			case "item/autoApprovalReview/started":
			case "item/autoApprovalReview/completed":
				this.handleGuardianReviewNotification(notification.method, params);
				break;
			case "hook/started":
			case "hook/completed":
				this.handleHookNotification(notification.method, params);
				break;
			case "thread/tokenUsage/updated":
				this.handleTokenUsage(params);
				break;
			case "turn/completed":
				await this.handleTurnCompleted(params);
				break;
			case "rawResponseItem/completed":
				await this.handleRawResponseItemCompleted(params);
				break;
			case "error":
				if (readBooleanAlias(params, ["willRetry", "will_retry"]) === true) break;
				this.promptError = this.formatCodexErrorMessage(params) ?? "codex app-server error";
				this.promptErrorSource = "prompt";
				break;
			default: break;
		}
	}
	buildResult(toolTelemetry, options) {
		const assistantTexts = this.collectAssistantTexts();
		const reasoningText = collectReasoningTextValues(this.reasoningTextByGroup, this.reasoningItemOrder).join("\n\n");
		const planText = collectTextValues(this.planTextByItem).join("\n\n");
		const hasAssistantItemText = this.hasAssistantItemTextForSynthesis();
		const legacyFailClosed = !this.completedTurn || this.completedTurn.status !== "completed" || hasAssistantItemText;
		const hasDeliverableAssistantOnCompletedTurn = this.completedTurn?.status === "completed" && assistantTexts.some((text) => text.trim().length > 0);
		this.synthesizeMissingToolResults({
			synthesize: legacyFailClosed,
			recordPromptError: legacyFailClosed && !hasDeliverableAssistantOnCompletedTurn
		});
		const lastAssistant = assistantTexts.length > 0 ? this.createAssistantMessage(assistantTexts.join("\n\n")) : void 0;
		const currentAttemptAssistant = this.createCurrentAttemptAssistantMessage();
		const turnId = this.turnId;
		const messagesSnapshot = this.params.suppressNextUserMessagePersistence ? [] : [attachCodexMirrorIdentity(buildCodexUserPromptMessage(this.params), `${turnId}:prompt`)];
		if (reasoningText) messagesSnapshot.push(attachCodexMirrorIdentity(this.createAssistantMirrorMessage("Codex reasoning", reasoningText), `${turnId}:reasoning`));
		if (planText) messagesSnapshot.push(attachCodexMirrorIdentity(this.createAssistantMirrorMessage("Codex plan", planText), `${turnId}:plan`));
		messagesSnapshot.push(...this.toolTranscriptMessages);
		if (lastAssistant) messagesSnapshot.push(attachCodexMirrorIdentity(lastAssistant, `${turnId}:assistant`));
		const turnFailed = this.completedTurn?.status === "failed";
		const promptError = this.promptError ?? this.synthesizedMissingToolResultError ?? (turnFailed ? this.completedTurn?.error?.message ?? "codex app-server turn failed" : null);
		const agentHarnessResultClassification = classifyAgentHarnessTerminalOutcome({
			assistantTexts,
			reasoningText,
			planText,
			promptError,
			turnCompleted: Boolean(this.completedTurn)
		});
		const toolMetas = [...this.toolMetas.values()];
		const hadPotentialSideEffects = toolTelemetry.didSendViaMessagingTool || (toolTelemetry.successfulCronAdds ?? 0) > 0 || this.nativeGeneratedMediaItemIds.size > 0 || this.sideEffectingToolItemIds.size > 0 || this.sideEffectingDynamicToolCallIds.size > 0;
		return {
			aborted: this.aborted,
			externalAbort: false,
			timedOut: false,
			idleTimedOut: false,
			timedOutDuringCompaction: false,
			timedOutDuringToolExecution: false,
			promptError,
			promptErrorSource: promptError ? this.promptErrorSource || "prompt" : null,
			sessionIdUsed: this.params.sessionId,
			...agentHarnessResultClassification ? { agentHarnessResultClassification } : {},
			bootstrapPromptWarningSignaturesSeen: this.params.bootstrapPromptWarningSignaturesSeen,
			bootstrapPromptWarningSignature: this.params.bootstrapPromptWarningSignature,
			messagesSnapshot,
			assistantTexts,
			toolMetas,
			lastAssistant,
			currentAttemptAssistant,
			...this.lastNativeToolError ? { lastToolError: this.lastNativeToolError } : {},
			didSendViaMessagingTool: toolTelemetry.didSendViaMessagingTool,
			messagingToolSentTexts: toolTelemetry.messagingToolSentTexts,
			messagingToolSentMediaUrls: toolTelemetry.messagingToolSentMediaUrls,
			messagingToolSentTargets: toolTelemetry.messagingToolSentTargets,
			messagingToolSourceReplyPayloads: toolTelemetry.messagingToolSourceReplyPayloads ?? [],
			heartbeatToolResponse: toolTelemetry.heartbeatToolResponse,
			toolMediaUrls: this.buildToolMediaUrls(toolTelemetry),
			toolAudioAsVoice: toolTelemetry.toolAudioAsVoice,
			successfulCronAdds: toolTelemetry.successfulCronAdds,
			cloudCodeAssistFormatError: false,
			attemptUsage: this.tokenUsage,
			replayMetadata: {
				hadPotentialSideEffects,
				replaySafe: !hadPotentialSideEffects
			},
			itemLifecycle: {
				startedCount: this.activeItemIds.size + this.completedItemIds.size,
				completedCount: this.completedItemIds.size,
				activeCount: this.activeItemIds.size,
				...this.completedCompactionCount > 0 ? { compactionCount: this.completedCompactionCount } : {}
			},
			yieldDetected: options?.yieldDetected || false,
			didSendDeterministicApprovalPrompt: this.guardianReviewCount > 0 ? false : void 0
		};
	}
	recordDynamicToolCall(params) {
		const args = sanitizeCodexToolArguments(params.arguments);
		this.recordToolTranscriptCall({
			id: params.callId,
			name: params.tool,
			arguments: args
		});
	}
	recordDynamicToolResult(params) {
		const resultText = collectDynamicToolContentText(params.contentItems);
		if (params.asyncStarted === true) {
			const existing = this.toolMetas.get(params.callId);
			this.toolMetas.set(params.callId, {
				toolName: existing?.toolName ?? params.tool,
				...existing?.meta ? { meta: existing.meta } : {},
				asyncStarted: true
			});
		}
		this.recordToolTranscriptResult({
			id: params.callId,
			name: params.tool,
			text: resultText,
			isError: !params.success
		});
		if (!params.success && params.terminalType === "blocked") this.lastNativeToolError = {
			toolName: params.tool,
			error: resultText || "codex dynamic tool blocked"
		};
		else if (params.success && this.lastNativeToolError && !this.lastNativeToolError.mutatingAction) this.lastNativeToolError = void 0;
		if (params.sideEffectEvidence === true) this.sideEffectingDynamicToolCallIds.add(params.callId);
	}
	markTimedOut() {
		this.aborted = true;
		this.promptError = "codex app-server attempt timed out";
		this.promptErrorSource = "prompt";
	}
	markAborted() {
		this.aborted = true;
	}
	isCompacting() {
		return this.activeCompactionItemIds.size > 0;
	}
	async handleAssistantDelta(params) {
		const itemId = readString$5(params, "itemId") ?? readString$5(params, "id") ?? "assistant";
		const delta = readString$5(params, "delta") ?? "";
		if (!delta) return;
		this.rememberAssistantPhase(readItem(params.item));
		const phase = readString$5(params, "phase");
		if (phase) this.assistantPhaseByItem.set(itemId, phase);
		if (!this.assistantStarted) {
			this.assistantStarted = true;
			await this.params.onAssistantMessageStart?.();
		}
		this.rememberAssistantItem(itemId);
		const text = `${this.assistantTextByItem.get(itemId) ?? ""}${delta}`;
		this.assistantTextByItem.set(itemId, text);
		if (this.isCommentaryAssistantItem(itemId)) this.emitCommentaryProgress({
			itemId,
			text
		});
		else {
			const knownFinalAnswer = this.shouldStreamAssistantPartial(itemId);
			const replace = this.streamedPartialAssistantItemId !== void 0 && this.streamedPartialAssistantItemId !== itemId;
			if (replace && (!knownFinalAnswer || this.streamedPartialAssistantItemReplaceable)) this.streamedPartialAssistantItemReplaceable = true;
			else if (this.streamedPartialAssistantItemId === void 0) this.streamedPartialAssistantItemReplaceable = !knownFinalAnswer;
			this.streamedPartialAssistantItemId = itemId;
			const replaceable = this.streamedPartialAssistantItemReplaceable;
			const replacement = replace && replaceable;
			const streamPayload = {
				text,
				delta: replacement ? "" : delta,
				...replacement ? { replace: true } : {}
			};
			this.emitAgentEvent({
				stream: "assistant",
				data: {
					...streamPayload,
					...replaceable ? { replaceable: true } : {}
				}
			});
			if (knownFinalAnswer && !replaceable) await this.params.onPartialReply?.(streamPayload);
		}
	}
	async handleReasoningDelta(method, params) {
		const itemId = readString$5(params, "itemId") ?? readString$5(params, "id") ?? "reasoning";
		const delta = readString$5(params, "delta") ?? "";
		if (!delta) return;
		this.reasoningStarted = true;
		if (!this.reasoningItemOrder.has(itemId)) this.reasoningItemOrder.set(itemId, this.reasoningItemOrder.size);
		const groupIndex = method === "item/reasoning/textDelta" ? readNonNegativeInteger(params, "contentIndex") ?? 0 : readNonNegativeInteger(params, "summaryIndex") ?? 0;
		const groupKey = `${method}\0${itemId}\0${groupIndex}`;
		const current = this.reasoningTextByGroup.get(groupKey);
		this.reasoningTextByGroup.set(groupKey, {
			itemId,
			method,
			index: groupIndex,
			text: `${current?.text ?? ""}${delta}`
		});
		await this.params.onReasoningStream?.({
			text: collectReasoningTextValues(this.reasoningTextByGroup, this.reasoningItemOrder).join("\n\n"),
			isReasoningSnapshot: true
		});
	}
	handlePlanDelta(params) {
		const itemId = readString$5(params, "itemId") ?? readString$5(params, "id") ?? "plan";
		const delta = readString$5(params, "delta") ?? "";
		if (!delta) return;
		const text = `${this.planTextByItem.get(itemId) ?? ""}${delta}`;
		this.planTextByItem.set(itemId, text);
		this.emitPlanUpdate({
			explanation: void 0,
			steps: splitPlanText(text)
		});
	}
	handleTurnPlanUpdated(params) {
		const plan = Array.isArray(params.plan) ? params.plan.flatMap((entry) => {
			if (!isJsonObject(entry)) return [];
			const step = readString$5(entry, "step");
			const status = readString$5(entry, "status");
			if (!step) return [];
			return status ? [`${step} (${status})`] : [step];
		}) : void 0;
		this.emitPlanUpdate({
			explanation: readNullableString$1(params, "explanation"),
			steps: plan
		});
	}
	async handleItemStarted(params) {
		const item = readItem(params.item);
		const itemId = item?.id ?? readString$5(params, "itemId") ?? readString$5(params, "id");
		this.rememberAssistantPhase(item);
		if (itemId) this.activeItemIds.add(itemId);
		this.recordNativeToolOutcome(item);
		if (item?.type === "contextCompaction" && itemId) {
			this.activeCompactionItemIds.add(itemId);
			await runAgentHarnessBeforeCompactionHook({
				sessionFile: this.params.sessionFile,
				messages: await this.readMirroredSessionMessages(),
				ctx: {
					runId: this.params.runId,
					agentId: this.params.agentId,
					sessionKey: this.params.sessionKey,
					sessionId: this.params.sessionId,
					workspaceDir: this.params.workspaceDir,
					messageProvider: this.params.messageProvider ?? void 0,
					trigger: this.params.trigger,
					channelId: this.params.messageChannel ?? this.params.messageProvider ?? void 0
				}
			});
			this.emitAgentEvent({
				stream: "compaction",
				data: {
					phase: "start",
					backend: "codex-app-server",
					threadId: this.threadId,
					turnId: this.turnId,
					itemId
				}
			});
		}
		this.recordToolMeta(item);
		this.emitStandardItemEvent({
			phase: "start",
			item
		});
		await this.emitNormalizedToolItemEvent({
			phase: "start",
			item
		});
		this.recordNativeToolTranscriptCall(item);
		this.emitToolResultSummary(item);
		this.emitAgentEvent({
			stream: "codex_app_server.item",
			data: {
				phase: "started",
				itemId,
				type: item?.type
			}
		});
	}
	async handleItemCompleted(params) {
		const item = readItem(params.item);
		this.recordNativeToolOutcome(item);
		this.clearTerminalPresentationForNativeItem(item);
		const itemId = item?.id ?? readString$5(params, "itemId") ?? readString$5(params, "id");
		if (itemId) {
			this.activeItemIds.delete(itemId);
			this.completedItemIds.add(itemId);
		}
		this.rememberAssistantPhase(item);
		if (item?.type === "agentMessage" && typeof item.text === "string") {
			this.rememberAssistantItem(item.id);
			this.assistantTextByItem.set(item.id, item.text);
			if (item.text && this.isCommentaryAssistantItem(item.id)) {
				this.emitCommentaryProgress({
					itemId: item.id,
					text: item.text
				});
				this.pendingRawCommentaryEchoes += 1;
			}
		}
		this.recordNativeGeneratedMedia(item);
		if (item?.type === "plan" && typeof item.text === "string" && item.text) {
			this.planTextByItem.set(item.id, item.text);
			this.emitPlanUpdate({
				explanation: void 0,
				steps: splitPlanText(item.text)
			});
		}
		if (item?.type === "contextCompaction" && itemId) {
			this.activeCompactionItemIds.delete(itemId);
			this.completedCompactionCount += 1;
			await runAgentHarnessAfterCompactionHook({
				sessionFile: this.params.sessionFile,
				messages: await this.readMirroredSessionMessages(),
				compactedCount: -1,
				ctx: {
					runId: this.params.runId,
					agentId: this.params.agentId,
					sessionKey: this.params.sessionKey,
					sessionId: this.params.sessionId,
					workspaceDir: this.params.workspaceDir,
					messageProvider: this.params.messageProvider ?? void 0,
					trigger: this.params.trigger,
					channelId: this.params.messageChannel ?? this.params.messageProvider ?? void 0
				}
			});
			this.emitAgentEvent({
				stream: "compaction",
				data: {
					phase: "end",
					backend: "codex-app-server",
					completed: true,
					threadId: this.threadId,
					turnId: this.turnId,
					itemId
				}
			});
		}
		this.recordToolMeta(item);
		this.emitStandardItemEvent({
			phase: "end",
			item
		});
		await this.emitNormalizedToolItemEvent({
			phase: "result",
			item
		});
		this.recordNativeToolTranscriptCall(item);
		this.recordNativeToolTranscriptResult(item);
		this.emitToolResultSummary(item);
		this.emitToolResultOutput(item);
		this.emitAgentEvent({
			stream: "codex_app_server.item",
			data: {
				phase: "completed",
				itemId,
				type: item?.type
			}
		});
	}
	handleTokenUsage(params) {
		const tokenUsage = isJsonObject(params.tokenUsage) ? params.tokenUsage : void 0;
		const current = (tokenUsage ? readFirstJsonObject(tokenUsage, CURRENT_TOKEN_USAGE_KEYS) : void 0) ?? readFirstJsonObject(params, CURRENT_TOKEN_USAGE_KEYS);
		if (!current) return;
		const usage = normalizeCodexTokenUsage(current);
		if (usage) this.tokenUsage = usage;
	}
	handleGuardianReviewNotification(method, params) {
		this.guardianReviewCount += 1;
		const review = isJsonObject(params.review) ? params.review : void 0;
		const action = isJsonObject(params.action) ? params.action : void 0;
		this.emitAgentEvent({
			stream: "codex_app_server.guardian",
			data: {
				method,
				phase: method.endsWith("/started") ? "started" : "completed",
				reviewId: readString$5(params, "reviewId"),
				targetItemId: readNullableString$1(params, "targetItemId"),
				decisionSource: readString$5(params, "decisionSource"),
				status: review ? readString$5(review, "status") : void 0,
				riskLevel: review ? readString$5(review, "riskLevel") : void 0,
				userAuthorization: review ? readString$5(review, "userAuthorization") : void 0,
				rationale: review ? readNullableString$1(review, "rationale") : void 0,
				actionType: action ? readString$5(action, "type") : void 0
			}
		});
	}
	handleHookNotification(method, params) {
		const run = isJsonObject(params.run) ? params.run : void 0;
		if (!run) return;
		const durationMs = readNumber$1(run, "durationMs");
		const entries = readHookOutputEntries(run.entries);
		const hookTurnId = readNullableString$1(params, "turnId");
		this.emitAgentEvent({
			stream: "codex_app_server.hook",
			data: {
				phase: method === "hook/started" ? "started" : "completed",
				threadId: this.threadId,
				turnId: hookTurnId === void 0 ? this.turnId : hookTurnId,
				hookRunId: readString$5(run, "id"),
				eventName: readString$5(run, "eventName"),
				handlerType: readString$5(run, "handlerType"),
				executionMode: readString$5(run, "executionMode"),
				scope: readString$5(run, "scope"),
				source: readString$5(run, "source"),
				sourcePath: readString$5(run, "sourcePath"),
				status: readString$5(run, "status"),
				statusMessage: readNullableString$1(run, "statusMessage"),
				...durationMs !== void 0 ? { durationMs } : {},
				...entries.length > 0 ? { entries } : {}
			}
		});
	}
	async handleTurnCompleted(params) {
		const turn = readTurn(params.turn);
		if (!turn || turn.id !== this.turnId) return;
		this.completedTurn = turn;
		if (turn.status === "failed") {
			this.promptError = formatCodexUsageLimitErrorMessage({
				message: turn.error?.message,
				codexErrorInfo: turn.error?.codexErrorInfo,
				rateLimits: this.latestRateLimits ?? readRecentCodexRateLimits()
			}) ?? turn.error?.message ?? "codex app-server turn failed";
			this.promptErrorSource = "prompt";
		}
		const turnItems = turn.items ?? [];
		for (let index = turnItems.length - 1; index >= 0; index -= 1) {
			const item = turnItems[index];
			if (!item || !this.isCurrentTurnSnapshotItem(item)) continue;
			if (item?.type === "dynamicToolCall") break;
			if (shouldClearTerminalPresentationForNativeItem(item)) {
				this.clearTerminalPresentationForNativeItem(item);
				break;
			}
		}
		for (const item of turnItems) {
			this.rememberAssistantPhase(item);
			if (item.type === "agentMessage" && typeof item.text === "string") {
				this.rememberAssistantItem(item.id);
				this.assistantTextByItem.set(item.id, item.text);
			}
			this.recordNativeGeneratedMedia(item);
			if (item.type === "plan" && typeof item.text === "string" && item.text) {
				this.planTextByItem.set(item.id, item.text);
				this.emitPlanUpdate({
					explanation: void 0,
					steps: splitPlanText(item.text)
				});
			}
			this.recordToolMeta(item);
			await this.emitSnapshotOnlyNativeToolProgress(item);
			this.recordNativeToolTranscriptCall(item);
			this.recordNativeToolTranscriptResult(item);
			this.emitAfterToolCallObservation(item);
			this.emitToolResultSummary(item);
			this.emitToolResultOutput(item);
		}
		this.activeCompactionItemIds.clear();
		await this.maybeEndReasoning();
	}
	async emitSnapshotOnlyNativeToolProgress(item) {
		if (!shouldSynthesizeToolProgressForItem(item) || !this.isCurrentTurnSnapshotItem(item) || this.completedItemIds.has(item.id) || itemStatus(item) === "running") return;
		if (!this.activeItemIds.has(item.id)) {
			this.emitStandardItemEvent({
				phase: "start",
				item
			});
			await this.emitNormalizedToolItemEvent({
				phase: "start",
				item
			});
		}
		this.activeItemIds.delete(item.id);
		this.emitStandardItemEvent({
			phase: "end",
			item
		});
		await this.emitNormalizedToolItemEvent({
			phase: "result",
			item
		});
		this.completedItemIds.add(item.id);
	}
	isCurrentTurnSnapshotItem(item) {
		const itemTurnId = readItemString(item, "turnId") ?? readItemString(item, "turn_id");
		return itemTurnId === void 0 || itemTurnId === this.turnId;
	}
	handleOutputDelta(params, toolName) {
		const itemId = readString$5(params, "itemId");
		const delta = readString$5(params, "delta");
		if (!itemId || !delta) return;
		appendToolOutputDeltaText(this.toolResultOutputTextByItem, itemId, delta);
		if (!this.shouldEmitToolOutput()) return;
		if (this.transcriptToolProgressSuppressedIds.has(itemId) || !shouldEmitTranscriptToolProgress(toolName, this.toolTranscriptArgumentsById.get(itemId))) return;
		const state = this.toolResultOutputDeltaState.get(itemId) ?? {
			chars: 0,
			messages: 0,
			truncated: false
		};
		if (state.truncated) return;
		const remainingChars = Math.max(0, TOOL_PROGRESS_OUTPUT_MAX_CHARS - state.chars);
		const remainingMessages = Math.max(0, MAX_TOOL_OUTPUT_DELTA_MESSAGES_PER_ITEM - state.messages);
		if (remainingChars === 0 || remainingMessages === 0) {
			state.truncated = true;
			this.toolResultOutputDeltaState.set(itemId, state);
			this.emitToolResultMessage({
				itemId,
				text: formatToolOutput(toolName, void 0, "(output truncated)")
			});
			return;
		}
		const chunk = delta.length > remainingChars ? delta.slice(0, remainingChars) : delta;
		state.chars += chunk.length;
		state.messages += 1;
		const reachedLimit = delta.length > remainingChars || state.chars >= 8e3 || state.messages >= MAX_TOOL_OUTPUT_DELTA_MESSAGES_PER_ITEM;
		if (reachedLimit) state.truncated = true;
		this.toolResultOutputDeltaState.set(itemId, state);
		this.toolResultOutputStreamedItemIds.add(itemId);
		this.emitToolResultMessage({
			itemId,
			text: formatToolOutput(toolName, void 0, reachedLimit ? `${chunk}\n...(truncated)...` : chunk)
		});
	}
	async handleRawResponseItemCompleted(params) {
		const item = isJsonObject(params.item) ? params.item : void 0;
		if (!item) return;
		await this.recordRawGeneratedImageMedia(item);
		if (readString$5(item, "role") !== "assistant") return;
		const phase = readString$5(item, "phase");
		if (phase === "commentary" && this.pendingRawCommentaryEchoes > 0) {
			this.pendingRawCommentaryEchoes -= 1;
			return;
		}
		const text = extractRawAssistantText(item);
		if (!text) return;
		const itemId = readString$5(item, "id") ?? `raw-assistant-${this.assistantItemOrder.length + 1}`;
		if (phase) this.assistantPhaseByItem.set(itemId, phase);
		this.rememberAssistantItem(itemId);
		this.assistantTextByItem.set(itemId, text);
		if (phase === "commentary") this.emitCommentaryProgress({
			itemId,
			text
		});
	}
	recordNativeGeneratedMedia(item) {
		if (item?.type !== "imageGeneration") return;
		const savedPath = readItemString(item, "savedPath")?.trim();
		if (savedPath) this.recordNativeGeneratedMediaUrl({
			itemId: item.id,
			mediaUrl: savedPath
		});
	}
	async recordRawGeneratedImageMedia(item) {
		if (readString$5(item, "type") !== "image_generation_call") return;
		const result = readString$5(item, "result");
		if (!result) return;
		const itemId = readString$5(item, "id") ?? `raw-image-${this.nativeGeneratedMediaItemIds.size}`;
		this.nativeGeneratedMediaItemIds.add(itemId);
		const maxBytes = resolveGeneratedImageMaxBytes(this.params.config);
		const estimatedDecodedBytes = estimateBase64DecodedBytes(result);
		if (estimatedDecodedBytes !== void 0 && estimatedDecodedBytes > maxBytes) {
			log.warn("codex app-server raw image generation result exceeds media limit", {
				itemId,
				estimatedDecodedBytes,
				maxBytes
			});
			return;
		}
		const asset = generatedImageAssetFromBase64({
			base64: result,
			index: this.nativeGeneratedMediaItemIds.size,
			revisedPrompt: readString$5(item, "revised_prompt") ?? readString$5(item, "revisedPrompt"),
			fileNamePrefix: "codex-image-generation",
			sniffMimeType: true
		});
		if (!asset) return;
		try {
			const saved = await saveMediaBuffer(asset.buffer, asset.mimeType, GENERATED_IMAGE_MEDIA_SUBDIR, maxBytes, asset.fileName);
			this.recordNativeGeneratedMediaUrl({
				itemId,
				mediaUrl: saved.path,
				replaceExisting: true
			});
		} catch (error) {
			log.warn("codex app-server raw image generation result save failed", {
				itemId,
				error
			});
		}
	}
	recordNativeGeneratedMediaUrl(params) {
		if (this.nativeGeneratedMediaUrlsByItemId.has(params.itemId) && params.replaceExisting !== true) {
			this.nativeGeneratedMediaItemIds.add(params.itemId);
			return;
		}
		this.nativeGeneratedMediaUrlsByItemId.set(params.itemId, params.mediaUrl);
		this.nativeGeneratedMediaItemIds.add(params.itemId);
	}
	buildToolMediaUrls(toolTelemetry) {
		const mediaUrls = new Set(toolTelemetry.toolMediaUrls?.map((url) => url.trim()).filter(Boolean) ?? []);
		if ((toolTelemetry.messagingToolSentMediaUrls?.length ?? 0) === 0) for (const mediaUrl of this.nativeGeneratedMediaUrlsByItemId.values()) mediaUrls.add(mediaUrl);
		return mediaUrls.size > 0 ? [...mediaUrls] : toolTelemetry.toolMediaUrls;
	}
	async maybeEndReasoning() {
		if (!this.reasoningStarted || this.reasoningEnded) return;
		this.reasoningEnded = true;
		await this.params.onReasoningEnd?.();
	}
	emitPlanUpdate(params) {
		if (!params.explanation && (!params.steps || params.steps.length === 0)) return;
		this.emitAgentEvent({
			stream: "plan",
			data: {
				phase: "update",
				title: "Plan updated",
				source: "codex-app-server",
				...params.explanation ? { explanation: params.explanation } : {},
				...params.steps && params.steps.length > 0 ? { steps: params.steps } : {}
			}
		});
	}
	rememberAssistantPhase(item) {
		if (item?.type !== "agentMessage") return;
		const phase = readItemString(item, "phase");
		if (phase) this.assistantPhaseByItem.set(item.id, phase);
	}
	isCommentaryAssistantItem(itemId) {
		return this.assistantPhaseByItem.get(itemId) === "commentary";
	}
	shouldStreamAssistantPartial(itemId) {
		return this.assistantPhaseByItem.get(itemId) === "final_answer";
	}
	emitCommentaryProgress(params) {
		const progressText = params.text.replace(/\s+/g, " ").trim();
		if (!progressText || this.lastCommentaryProgressTextByItem.get(params.itemId) === progressText) return;
		this.lastCommentaryProgressTextByItem.set(params.itemId, progressText);
		this.emitAgentEvent({
			stream: "item",
			data: {
				itemId: params.itemId,
				kind: "preamble",
				title: "Preamble",
				phase: "update",
				progressText,
				source: "codex-app-server"
			}
		});
	}
	emitStandardItemEvent(params) {
		const { item } = params;
		if (!item) return;
		const kind = itemKind(item);
		if (!kind) return;
		const meta = itemMeta(item, this.toolProgressDetailMode());
		const suppressChannelProgress = shouldSuppressChannelProgressForItem(item);
		this.emitAgentEvent({
			stream: "item",
			data: {
				itemId: item.id,
				phase: params.phase,
				kind,
				title: itemTitle(item),
				status: params.phase === "start" ? "running" : itemStatus(item),
				...itemName(item) ? { name: itemName(item) } : {},
				...meta ? { meta } : {},
				...suppressChannelProgress ? { suppressChannelProgress: true } : {}
			}
		});
	}
	async emitNormalizedToolItemEvent(params) {
		const { item } = params;
		if (!item || !shouldSynthesizeToolProgressForItem(item)) return;
		const name = itemName(item);
		if (!name) return;
		const status = params.phase === "result" ? itemStatus(item) : "running";
		const args = itemToolArgs(item);
		const meta = itemMeta(item, this.toolProgressDetailMode());
		this.recordToolTrajectoryEvent({
			phase: params.phase,
			item,
			name,
			args,
			status
		});
		this.emitDiagnosticToolExecutionEvent({
			phase: params.phase,
			item,
			name,
			status
		});
		if (params.phase === "result") this.recordNativeToolError({
			item,
			name,
			meta,
			status
		});
		if (!shouldEmitTranscriptToolProgress(name, args)) {
			if (params.phase === "result") {
				this.emitAfterToolCallObservation(item);
				await this.options.onNativeToolResultRecorded?.();
			}
			return;
		}
		this.emitAgentEvent({
			stream: "tool",
			data: {
				phase: params.phase,
				name,
				itemId: item.id,
				toolCallId: item.id,
				...meta ? { meta } : {},
				...params.phase === "start" && args ? { args } : {},
				...params.phase === "result" ? {
					status,
					isError: isNonSuccessItemStatus(status),
					...itemToolResult(item)
				} : {}
			}
		});
		if (params.phase === "result") {
			this.emitAfterToolCallObservation(item);
			await this.options.onNativeToolResultRecorded?.();
		}
	}
	clearTerminalPresentationForNativeItem(item) {
		if (!item || this.terminalPresentationClearedItemIds.has(item.id) || !shouldClearTerminalPresentationForNativeItem(item)) return;
		const toolCallOrdinal = this.nativeToolOutcomeOrdinals.get(item.id);
		this.terminalPresentationClearedItemIds.add(item.id);
		this.params.onToolOutcome?.({
			toolName: itemName(item) ?? item.type,
			argsHash: "",
			resultHash: "",
			...toolCallOrdinal !== void 0 ? { toolCallOrdinal } : {},
			terminalPresentation: void 0,
			presentationOnly: true
		});
	}
	recordNativeToolError(params) {
		if (!isNonSuccessItemStatus(params.status)) {
			if (!this.lastNativeToolError) return;
			if (!this.lastNativeToolError.mutatingAction) {
				this.lastNativeToolError = void 0;
				return;
			}
			const actionFingerprint = nativeToolActionFingerprint(params.item);
			if (this.lastNativeToolError.actionFingerprint && actionFingerprint && this.lastNativeToolError.actionFingerprint === actionFingerprint) this.lastNativeToolError = void 0;
			return;
		}
		const error = itemToolError(params.item, params.status, this.toolResultOutputTextByItem);
		const actionFingerprint = nativeToolActionFingerprint(params.item);
		this.lastNativeToolError = {
			toolName: params.name,
			...params.meta ? { meta: params.meta } : {},
			...error ? { error } : {},
			...isMutatingNativeToolItem(params.item) ? { mutatingAction: true } : {},
			...actionFingerprint ? { actionFingerprint } : {}
		};
	}
	recordToolTrajectoryEvent(params) {
		if (params.phase === "start") {
			this.toolTrajectoryCallIds.add(params.item.id);
			this.toolTrajectoryNamesById.set(params.item.id, params.name);
			this.toolTrajectoryItemsById.set(params.item.id, params.item);
			this.options.trajectoryRecorder?.recordEvent("tool.call", {
				threadId: this.threadId,
				turnId: this.turnId,
				itemId: params.item.id,
				toolCallId: params.item.id,
				name: params.name,
				arguments: params.args
			});
			return;
		}
		this.toolTrajectoryResultIds.add(params.item.id);
		const toolResult = itemToolResult(params.item).result;
		const output = itemOutputText(params.item, this.toolResultOutputTextByItem);
		this.options.trajectoryRecorder?.recordEvent("tool.result", {
			threadId: this.threadId,
			turnId: this.turnId,
			itemId: params.item.id,
			toolCallId: params.item.id,
			name: params.name,
			status: params.status,
			isError: isNonSuccessItemStatus(params.status),
			...toolResult ? { result: toolResult } : {},
			...output ? { output } : {}
		});
	}
	emitDiagnosticToolExecutionEvent(params) {
		const base = {
			runId: this.params.runId,
			sessionId: this.params.sessionId,
			sessionKey: this.params.sessionKey,
			toolName: params.name,
			toolCallId: params.item.id
		};
		if (params.phase === "start") {
			this.diagnosticToolStartedAtByItem.set(params.item.id, Date.now());
			emitTrustedDiagnosticEvent({
				type: "tool.execution.started",
				...base
			});
			return;
		}
		const startedAt = this.diagnosticToolStartedAtByItem.get(params.item.id);
		this.diagnosticToolStartedAtByItem.delete(params.item.id);
		const durationMs = (typeof params.item.durationMs === "number" ? params.item.durationMs : void 0) ?? (startedAt === void 0 ? 0 : Math.max(0, Date.now() - startedAt));
		const terminalEvent = params.status === "blocked" ? {
			type: "tool.execution.blocked",
			reason: "codex_native_tool_blocked",
			deniedReason: "codex_native_tool_blocked"
		} : params.status === "failed" ? {
			type: "tool.execution.error",
			durationMs,
			errorCategory: "codex_native_tool_error"
		} : {
			type: "tool.execution.completed",
			durationMs
		};
		emitTrustedDiagnosticEvent({
			...base,
			...terminalEvent
		});
	}
	emitAfterToolCallObservation(item) {
		if (!this.shouldEmitAfterToolCallObservation(item)) return;
		const name = itemName(item);
		if (!name) return;
		const status = itemStatus(item);
		if (status === "running") return;
		this.afterToolCallObservedItemIds.add(item.id);
		const result = itemToolResult(item).result;
		const error = itemToolError(item, status, this.toolResultOutputTextByItem);
		const startedAt = resolveStartedAtFromDurationMs(item.durationMs);
		const hookParams = {
			toolName: name,
			toolCallId: item.id,
			runId: this.params.runId,
			agentId: this.params.agentId,
			sessionId: this.params.sessionId,
			sessionKey: this.params.sessionKey,
			startArgs: itemToolArgs(item) ?? {},
			...result !== void 0 ? { result } : {},
			...error ? { error } : {},
			...startedAt !== void 0 ? { startedAt } : {}
		};
		setImmediate(() => {
			runAgentHarnessAfterToolCallHook(hookParams);
		});
	}
	shouldEmitAfterToolCallObservation(item) {
		if (!shouldSynthesizeToolProgressForItem(item) || this.afterToolCallObservedItemIds.has(item.id)) return false;
		if (this.options.nativePostToolUseRelayEnabled && isNativePostToolUseRelayItem(item)) return false;
		return true;
	}
	emitToolResultSummary(item) {
		if (!item || !this.params.onToolResult || !this.shouldEmitToolResult()) return;
		const itemId = item.id;
		if (this.toolResultSummaryItemIds.has(itemId)) return;
		const toolName = itemName(item);
		if (!toolName) return;
		if (!shouldEmitTranscriptToolProgress(toolName, itemToolArgs(item))) return;
		this.toolResultSummaryItemIds.add(itemId);
		const meta = itemMeta(item, this.toolProgressDetailMode());
		this.emitToolResultMessage({
			itemId,
			text: formatToolSummary(toolName, meta)
		});
	}
	emitToolResultOutput(item) {
		if (!item || !this.params.onToolResult || !this.shouldEmitToolOutput()) return;
		const itemId = item.id;
		if (this.toolResultOutputItemIds.has(itemId)) return;
		if (this.toolResultOutputStreamedItemIds.has(itemId)) return;
		const toolName = itemName(item);
		const output = itemOutputText(item, this.toolResultOutputTextByItem);
		if (!toolName || !output) return;
		if (!shouldEmitTranscriptToolProgress(toolName, itemToolArgs(item))) return;
		this.emitToolResultMessage({
			itemId,
			text: formatToolOutput(toolName, itemMeta(item, this.toolProgressDetailMode()), output),
			finalOutput: true,
			isError: isNonSuccessItemStatus(itemStatus(item))
		});
	}
	emitToolResultMessage(params) {
		const text = params.text.trim();
		if (!text) return;
		this.toolProgressTexts.add(text);
		if (params.finalOutput) this.toolResultOutputItemIds.add(params.itemId);
		try {
			Promise.resolve(this.params.onToolResult?.({
				text,
				...params.isError === true ? { isError: true } : {}
			})).catch(() => {});
		} catch {}
	}
	shouldEmitToolResult() {
		return typeof this.params.shouldEmitToolResult === "function" ? this.params.shouldEmitToolResult() : this.params.verboseLevel === "on" || this.params.verboseLevel === "full";
	}
	shouldEmitToolOutput() {
		return typeof this.params.shouldEmitToolOutput === "function" ? this.params.shouldEmitToolOutput() : this.params.verboseLevel === "full";
	}
	toolProgressDetailMode() {
		return resolveCodexToolProgressDetailMode(this.params.toolProgressDetail);
	}
	recordToolMeta(item) {
		if (!item) return;
		if (isSideEffectingNativeToolItem(item)) this.sideEffectingToolItemIds.add(item.id);
		else this.sideEffectingToolItemIds.delete(item.id);
		const toolName = itemName(item);
		if (!toolName) return;
		const meta = itemMeta(item, this.toolProgressDetailMode());
		const existing = this.toolMetas.get(item.id);
		this.toolMetas.set(item.id, {
			toolName,
			...meta ? { meta } : {},
			...existing?.asyncStarted ? { asyncStarted: true } : {}
		});
	}
	recordNativeToolTranscriptCall(item) {
		if (!item || !shouldRecordNativeToolTranscript(item)) return;
		const name = itemName(item);
		if (!name) return;
		this.recordToolTranscriptCall({
			id: item.id,
			name,
			arguments: itemToolArgs(item)
		});
	}
	recordNativeToolTranscriptResult(item) {
		if (!item || !shouldRecordNativeToolTranscript(item)) return;
		const name = itemName(item);
		if (!name) return;
		this.recordToolTranscriptResult({
			id: item.id,
			name,
			text: itemTranscriptResultText(item, this.toolResultOutputTextByItem),
			isError: isNonSuccessItemStatus(itemStatus(item))
		});
	}
	recordToolTranscriptCall(params) {
		if (!params.id || !params.name || this.toolTranscriptCallIds.has(params.id)) return;
		this.toolTranscriptCallIds.add(params.id);
		this.toolTranscriptNamesById.set(params.id, params.name);
		this.toolTranscriptArgumentsById.set(params.id, params.arguments);
		if (!shouldEmitTranscriptToolProgress(params.name, params.arguments)) this.transcriptToolProgressSuppressedIds.add(params.id);
		else this.transcriptToolProgressSuppressedIds.delete(params.id);
		this.emitTranscriptToolCallProgress(params);
		this.toolTranscriptMessages.push(attachCodexMirrorIdentity(this.createToolCallMessage(params), `${this.turnId}:tool:${params.id}:call`));
	}
	recordToolTranscriptResult(params) {
		if (!params.id || !params.name || this.toolTranscriptResultIds.has(params.id)) return;
		this.toolTranscriptResultIds.add(params.id);
		this.emitTranscriptToolResultProgress(params);
		this.toolTranscriptMessages.push(attachCodexMirrorIdentity(this.createToolResultMessage(params), `${this.turnId}:tool:${params.id}:result`));
	}
	synthesizeMissingToolResults(params) {
		if (!params.synthesize) return;
		const missingTranscriptIds = [...this.toolTranscriptCallIds].filter((id) => !this.toolTranscriptResultIds.has(id));
		const missingTrajectoryIds = [...this.toolTrajectoryCallIds].filter((id) => !this.toolTrajectoryResultIds.has(id));
		if (missingTranscriptIds.length === 0 && missingTrajectoryIds.length === 0) return;
		for (const id of missingTranscriptIds) {
			const name = this.toolTranscriptNamesById.get(id) ?? this.toolTrajectoryNamesById.get(id);
			if (!name) continue;
			this.recordToolTranscriptResult({
				id,
				name,
				text: formatMissingToolResultError({
					id,
					name
				}),
				isError: true
			});
		}
		for (const id of missingTrajectoryIds) {
			const name = this.toolTrajectoryNamesById.get(id) ?? this.toolTranscriptNamesById.get(id);
			if (!name) continue;
			this.toolTrajectoryResultIds.add(id);
			const text = formatMissingToolResultError({
				id,
				name
			});
			this.options.trajectoryRecorder?.recordEvent("tool.result", {
				threadId: this.threadId,
				turnId: this.turnId,
				itemId: id,
				toolCallId: id,
				name,
				status: "failed",
				isError: true,
				result: {
					status: "failed",
					reason: "missing_tool_result"
				},
				output: text
			});
		}
		if (!params.recordPromptError) {
			const firstMissingId = missingTranscriptIds.find((id) => {
				const name = this.toolTranscriptNamesById.get(id) ?? this.toolTrajectoryNamesById.get(id);
				return Boolean(name);
			}) ?? missingTrajectoryIds.find((id) => {
				const name = this.toolTrajectoryNamesById.get(id) ?? this.toolTranscriptNamesById.get(id);
				return Boolean(name);
			});
			if (firstMissingId) {
				const name = this.toolTranscriptNamesById.get(firstMissingId) ?? this.toolTrajectoryNamesById.get(firstMissingId);
				if (name) {
					const item = this.toolTrajectoryItemsById.get(firstMissingId);
					const meta = item ? itemMeta(item, this.toolProgressDetailMode()) : this.toolMetas.get(firstMissingId)?.meta;
					const actionFingerprint = item ? nativeToolActionFingerprint(item) : void 0;
					this.lastNativeToolError = {
						toolName: name,
						...meta ? { meta } : {},
						error: formatMissingToolResultError({
							id: firstMissingId,
							name
						}),
						...item && isMutatingNativeToolItem(item) ? { mutatingAction: true } : {},
						...actionFingerprint ? { actionFingerprint } : {}
					};
				}
			}
			return;
		}
		const missingCount = new Set([...missingTranscriptIds, ...missingTrajectoryIds]).size;
		this.synthesizedMissingToolResultError = missingCount === 1 ? MISSING_TOOL_RESULT_ERROR : `${MISSING_TOOL_RESULT_ERROR} missingToolResultCount=${missingCount}`;
		this.promptErrorSource = this.promptErrorSource ?? "prompt";
	}
	emitTranscriptToolCallProgress(params) {
		if (!shouldEmitTranscriptToolProgress(params.name, params.arguments)) return;
		this.transcriptToolProgressCallIds.add(params.id);
		const args = normalizeToolTranscriptArguments(params.arguments);
		const meta = inferToolMetaFromArgs(params.name, args, { detailMode: this.toolProgressDetailMode() });
		if (!this.params.onToolResult || !this.shouldEmitToolResult() || this.toolResultSummaryItemIds.has(params.id) || this.toolResultOutputStreamedItemIds.has(params.id)) return;
		this.toolResultSummaryItemIds.add(params.id);
		this.emitToolResultMessage({
			itemId: params.id,
			text: formatToolSummary(params.name, meta)
		});
	}
	emitTranscriptToolResultProgress(params) {
		if (this.transcriptToolProgressSuppressedIds.has(params.id) || !shouldEmitTranscriptToolProgress(params.name, this.toolTranscriptArgumentsById.get(params.id))) return;
		if (!this.transcriptToolProgressCallIds.has(params.id)) this.emitTranscriptToolCallProgress({
			id: params.id,
			name: params.name,
			arguments: {}
		});
		if (!this.params.onToolResult || !this.shouldEmitToolOutput() || this.toolResultOutputItemIds.has(params.id) || this.toolResultOutputStreamedItemIds.has(params.id)) return;
		const text = params.text?.trim();
		if (!text) return;
		this.emitToolResultMessage({
			itemId: params.id,
			text: formatToolOutput(params.name, void 0, text),
			finalOutput: true,
			isError: params.isError
		});
	}
	formatCodexErrorMessage(params) {
		const error = isJsonObject(params.error) ? params.error : void 0;
		return formatCodexUsageLimitErrorMessage({
			message: error ? readString$5(error, "message") : void 0,
			codexErrorInfo: error?.codexErrorInfo,
			rateLimits: this.latestRateLimits ?? readRecentCodexRateLimits()
		}) ?? readCodexErrorNotificationMessage(params);
	}
	emitAgentEvent(event) {
		try {
			emitAgentEvent({
				runId: this.params.runId,
				stream: event.stream,
				data: event.data,
				...this.params.sessionKey ? { sessionKey: this.params.sessionKey } : {}
			});
		} catch (error) {
			log.debug("codex app-server global agent event emit failed", { error });
		}
		try {
			const maybePromise = this.params.onAgentEvent?.(event);
			Promise.resolve(maybePromise).catch((error) => {
				log.debug("codex app-server agent event handler rejected", { error });
			});
		} catch (error) {
			log.debug("codex app-server agent event handler threw", { error });
		}
	}
	collectAssistantTexts() {
		const finalText = this.resolveFinalAssistantText();
		return finalText ? [finalText] : [];
	}
	hasAssistantItemTextForSynthesis() {
		for (let i = this.assistantItemOrder.length - 1; i >= 0; i -= 1) {
			const itemId = this.assistantItemOrder[i];
			if (!itemId) continue;
			if (this.assistantPhaseByItem.get(itemId) === "commentary") continue;
			const text = this.assistantTextByItem.get(itemId);
			if (text && text.length > 0) return true;
		}
		return false;
	}
	resolveFinalAssistantText() {
		return this.resolveFinalAssistantTextItem()?.text;
	}
	resolveFinalAssistantTextItem() {
		for (let i = this.assistantItemOrder.length - 1; i >= 0; i -= 1) {
			const itemId = this.assistantItemOrder[i];
			if (!itemId) continue;
			const text = this.assistantTextByItem.get(itemId)?.trim();
			if (this.assistantPhaseByItem.get(itemId) === "commentary") continue;
			if (text && !this.toolProgressTexts.has(text)) return {
				itemId,
				text
			};
		}
	}
	rememberAssistantItem(itemId) {
		if (!itemId || this.assistantItemOrder.includes(itemId)) return;
		this.assistantItemOrder.push(itemId);
	}
	createCurrentAttemptAssistantMessage() {
		for (let i = this.assistantItemOrder.length - 1; i >= 0; i -= 1) {
			const itemId = this.assistantItemOrder[i];
			if (!itemId || this.isCommentaryAssistantItem(itemId) || !this.assistantTextByItem.has(itemId)) continue;
			const text = this.assistantTextByItem.get(itemId) ?? "";
			const normalizedText = text.trim();
			if (normalizedText && this.toolProgressTexts.has(normalizedText)) continue;
			return this.createAssistantMessage(text);
		}
	}
	async readMirroredSessionMessages() {
		return await readCodexMirroredSessionHistoryMessages({
			agentId: this.params.agentId,
			sessionFile: this.params.sessionFile,
			sessionId: this.params.sessionId,
			sessionKey: this.params.sessionKey
		}) ?? [];
	}
	createAssistantMessage(text) {
		const attribution = resolveCodexLocalRuntimeAttribution(this.params);
		const usage = this.tokenUsage ? {
			input: this.tokenUsage.input ?? 0,
			output: this.tokenUsage.output ?? 0,
			cacheRead: this.tokenUsage.cacheRead ?? 0,
			cacheWrite: this.tokenUsage.cacheWrite ?? 0,
			totalTokens: this.tokenUsage.total ?? (this.tokenUsage.input ?? 0) + (this.tokenUsage.output ?? 0) + (this.tokenUsage.cacheRead ?? 0) + (this.tokenUsage.cacheWrite ?? 0),
			cost: ZERO_USAGE.cost
		} : ZERO_USAGE;
		return {
			role: "assistant",
			content: [{
				type: "text",
				text
			}],
			api: attribution.api ?? "openai-chatgpt-responses",
			provider: attribution.provider,
			model: this.params.modelId,
			usage,
			stopReason: this.aborted ? "aborted" : this.promptError ? "error" : "stop",
			errorMessage: this.promptError ? formatErrorMessage(this.promptError) : void 0,
			timestamp: Date.now()
		};
	}
	createAssistantMirrorMessage(title, text) {
		const attribution = resolveCodexLocalRuntimeAttribution(this.params);
		return {
			role: "assistant",
			content: [{
				type: "text",
				text: `${title}:\n${text}`
			}],
			api: attribution.api ?? "openai-chatgpt-responses",
			provider: attribution.provider,
			model: this.params.modelId,
			usage: ZERO_USAGE,
			stopReason: "stop",
			timestamp: Date.now()
		};
	}
	createToolCallMessage(params) {
		const args = normalizeToolTranscriptArguments(params.arguments);
		const attribution = resolveCodexLocalRuntimeAttribution(this.params);
		return {
			role: "assistant",
			content: [{
				type: "toolCall",
				id: params.id,
				name: params.name,
				arguments: args,
				input: args
			}],
			api: attribution.api ?? "openai-chatgpt-responses",
			provider: attribution.provider,
			model: this.params.modelId,
			usage: ZERO_USAGE,
			stopReason: "toolUse",
			timestamp: Date.now()
		};
	}
	createToolResultMessage(params) {
		const text = truncateToolTranscriptText(params.text?.trim() || toolResultStatusText(params));
		return {
			role: "toolResult",
			toolCallId: params.id,
			toolName: params.name,
			isError: params.isError,
			content: [{
				type: "toolResult",
				id: params.id,
				name: params.name,
				toolName: params.name,
				toolCallId: params.id,
				toolUseId: params.id,
				tool_use_id: params.id,
				content: text,
				text
			}],
			timestamp: Date.now()
		};
	}
	isNotificationForTurn(params) {
		const threadId = readCodexNotificationThreadId(params);
		const turnId = readNotificationTurnId(params);
		return threadId === this.threadId && turnId === this.turnId;
	}
	isHookNotificationForCurrentThread(params) {
		const threadId = readString$5(params, "threadId");
		const turnId = params.turnId;
		return threadId === this.threadId && (turnId === this.turnId || turnId === null);
	}
};
function isHookNotificationMethod(method) {
	return method === "hook/started" || method === "hook/completed";
}
function readNotificationTurnId(record) {
	return readCodexNotificationTurnId(record);
}
function readString$5(record, key) {
	const value = record[key];
	return typeof value === "string" ? value : void 0;
}
function estimateBase64DecodedBytes(base64) {
	let nonWhitespaceLength = 0;
	let previousCode = -1;
	let lastCode = -1;
	for (let i = 0; i < base64.length; i += 1) {
		const code = base64.charCodeAt(i);
		if (isBase64WhitespaceCode(code)) continue;
		nonWhitespaceLength += 1;
		previousCode = lastCode;
		lastCode = code;
	}
	if (nonWhitespaceLength === 0) return;
	const equalsCode = "=".charCodeAt(0);
	const padding = lastCode === equalsCode ? previousCode === equalsCode ? 2 : 1 : 0;
	return Math.max(0, Math.floor(nonWhitespaceLength * 3 / 4) - padding);
}
function isBase64WhitespaceCode(code) {
	return code === 32 || code === 9 || code === 10 || code === 13;
}
function resolveGeneratedImageMaxBytes(config) {
	const configured = config?.agents?.defaults?.mediaMaxMb;
	if (typeof configured === "number" && Number.isFinite(configured) && configured > 0) return Math.floor(configured * BYTES_PER_MB);
	return DEFAULT_GENERATED_IMAGE_MAX_BYTES;
}
function normalizeNonEmptyString(value) {
	if (typeof value !== "string") return;
	return value.trim() || void 0;
}
function readNonEmptyString(record, key) {
	return normalizeNonEmptyString(record[key]);
}
function readNonEmptyStringArray(record, key) {
	const value = record[key];
	if (!Array.isArray(value)) return [];
	const entries = [];
	for (const entry of value) {
		const normalized = normalizeNonEmptyString(entry);
		if (normalized) entries.push(normalized);
	}
	return entries;
}
function readNullableString$1(record, key) {
	const value = record[key];
	if (value === null) return null;
	return typeof value === "string" ? value : void 0;
}
function readNumber$1(record, key) {
	const value = record[key];
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function resolveStartedAtFromDurationMs(durationMs) {
	if (typeof durationMs !== "number" || !Number.isFinite(durationMs)) return;
	return asDateTimestampMs(Date.now() - Math.max(0, durationMs));
}
function readNonNegativeInteger(record, key) {
	const value = readNumber$1(record, key);
	return value !== void 0 && Number.isInteger(value) && value >= 0 ? value : void 0;
}
function readBoolean(record, key) {
	const value = record[key];
	return typeof value === "boolean" ? value : void 0;
}
function readBooleanAlias(record, keys) {
	for (const key of keys) {
		const value = readBoolean(record, key);
		if (value !== void 0) return value;
	}
}
function readCodexErrorNotificationMessage(record) {
	const error = record.error;
	if (isJsonObject(error)) return readString$5(error, "message") ?? readString$5(error, "error");
	return readString$5(record, "message");
}
function readHookOutputEntries(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		if (!isJsonObject(entry)) return [];
		const text = readString$5(entry, "text");
		if (!text) return [];
		const kind = readString$5(entry, "kind");
		return [{
			...kind ? { kind } : {},
			text
		}];
	});
}
function readFirstJsonObject(record, keys) {
	for (const key of keys) {
		const value = record[key];
		if (isJsonObject(value)) return value;
	}
}
function readNumberAlias(record, keys) {
	for (const key of keys) {
		const value = readNumber$1(record, key);
		if (value !== void 0) return value;
	}
}
function normalizeCodexTokenUsage(record) {
	const promptTotalInput = readNumberAlias(record, CODEX_PROMPT_TOTAL_INPUT_KEYS);
	const cacheRead = readNumberAlias(record, [
		"cachedInputTokens",
		"cached_input_tokens",
		"cacheRead",
		"cache_read",
		"cache_read_input_tokens",
		"cached_tokens"
	]);
	return normalizeUsage({
		input: promptTotalInput !== void 0 && cacheRead !== void 0 ? Math.max(0, promptTotalInput - cacheRead) : promptTotalInput ?? readNumber$1(record, "input"),
		output: readNumberAlias(record, [
			"outputTokens",
			"output_tokens",
			"output"
		]),
		cacheRead,
		cacheWrite: readNumberAlias(record, [
			"cacheWrite",
			"cache_write",
			"cacheCreationInputTokens",
			"cache_creation_input_tokens"
		]),
		total: readNumberAlias(record, [
			"totalTokens",
			"total_tokens",
			"total"
		])
	});
}
function splitPlanText(text) {
	return text.split(/\r?\n/).map((line) => line.trim().replace(/^[-*]\s+/, "")).filter((line) => line.length > 0);
}
function collectTextValues(map) {
	return [...map.values()].filter((text) => text.trim().length > 0);
}
function collectReasoningTextValues(groups, itemOrder) {
	return [...groups.values()].toSorted((left, right) => {
		const itemDelta = (itemOrder.get(left.itemId) ?? Number.MAX_SAFE_INTEGER) - (itemOrder.get(right.itemId) ?? Number.MAX_SAFE_INTEGER);
		if (itemDelta !== 0) return itemDelta;
		const methodDelta = reasoningMethodOrder(left.method) - reasoningMethodOrder(right.method);
		return methodDelta !== 0 ? methodDelta : left.index - right.index;
	}).map((group) => group.text).filter((text) => text.trim().length > 0);
}
function reasoningMethodOrder(method) {
	return method === "item/reasoning/summaryTextDelta" ? 0 : 1;
}
function extractRawAssistantText(item) {
	return (Array.isArray(item.content) ? item.content : []).flatMap((entry) => {
		if (!isJsonObject(entry)) return [];
		const type = readString$5(entry, "type");
		if (type !== "output_text" && type !== "text") return [];
		const value = readString$5(entry, "text");
		return value ? [value] : [];
	}).join("").trim() || void 0;
}
function itemKind(item) {
	switch (item.type) {
		case "dynamicToolCall":
		case "mcpToolCall": return "tool";
		case "commandExecution": return "command";
		case "fileChange": return "patch";
		case "webSearch": return "search";
		case "reasoning":
		case "contextCompaction": return "analysis";
		default: return;
	}
}
function itemTitle(item) {
	switch (item.type) {
		case "commandExecution": return "Command";
		case "fileChange": return "File change";
		case "mcpToolCall": return "MCP tool";
		case "dynamicToolCall": return "Tool";
		case "webSearch": return "Web search";
		case "contextCompaction": return "Context compaction";
		case "reasoning": return "Reasoning";
		default: return item.type;
	}
}
function itemStatus(item) {
	const status = readItemString(item, "status");
	if (status === "failed") return "failed";
	if (status === "declined") return "blocked";
	if (status === "inProgress" || status === "running") return "running";
	return "completed";
}
function formatMissingToolResultError(params) {
	return `${MISSING_TOOL_RESULT_ERROR} toolCallId=${params.id}; toolName=${params.name}`;
}
function isNonSuccessItemStatus(status) {
	return status === "failed" || status === "blocked";
}
function itemName(item) {
	if (item.type === "dynamicToolCall" && typeof item.tool === "string") return item.tool;
	if (item.type === "mcpToolCall" && typeof item.tool === "string") {
		const server = typeof item.server === "string" ? item.server : void 0;
		return server ? `${server}.${item.tool}` : item.tool;
	}
	if (item.type === "commandExecution") return "bash";
	if (item.type === "fileChange") return "apply_patch";
	if (item.type === "webSearch") return "web_search";
}
function isSideEffectingNativeToolItem(item) {
	return itemStatus(item) !== "blocked" && (isMutatingNativeToolItem(item) || item.type === "mcpToolCall");
}
function shouldSynthesizeToolProgressForItem(item) {
	switch (item.type) {
		case "commandExecution":
		case "fileChange":
		case "webSearch":
		case "mcpToolCall": return true;
		default: return false;
	}
}
function shouldRecordNativeToolTranscript(item) {
	return shouldSynthesizeToolProgressForItem(item) && item.type !== "webSearch";
}
function isMutatingNativeToolItem(item) {
	if (item.type === "commandExecution") return true;
	return item.type === "fileChange" || item.type === "collabAgentToolCall" || item.type === "imageGeneration";
}
function shouldClearTerminalPresentationForNativeItem(item) {
	switch (item.type) {
		case "collabAgentToolCall":
		case "commandExecution":
		case "fileChange":
		case "imageGeneration":
		case "imageView":
		case "mcpToolCall":
		case "webSearch": return true;
		default: return false;
	}
}
function nativeToolActionFingerprint(item) {
	if (item.type === "commandExecution" && typeof item.command === "string") return JSON.stringify({
		type: item.type,
		command: item.command,
		cwd: typeof item.cwd === "string" ? item.cwd : ""
	});
	if (item.type === "fileChange") return JSON.stringify({
		type: item.type,
		changes: itemFileChanges(item)
	});
}
function isNativePostToolUseRelayItem(item) {
	switch (item.type) {
		case "commandExecution":
		case "fileChange":
		case "mcpToolCall": return true;
		default: return false;
	}
}
function shouldSuppressChannelProgressForItem(item) {
	if (shouldSynthesizeToolProgressForItem(item)) return true;
	return item.type === "dynamicToolCall";
}
function itemToolArgs(item) {
	if (item.type === "commandExecution") return sanitizeCodexAgentEventRecord({
		command: item.command,
		...typeof item.cwd === "string" ? { cwd: item.cwd } : {}
	});
	if (item.type === "fileChange") return sanitizeCodexAgentEventRecord({ changes: itemFileChanges(item) });
	if (item.type === "webSearch") return webSearchToolArgs(item);
	if (item.type === "dynamicToolCall" || item.type === "mcpToolCall") return sanitizeCodexToolArguments(item.arguments);
}
function webSearchToolArgs(item) {
	const action = isJsonObject(item.action) ? item.action : void 0;
	const actionType = action ? readNonEmptyString(action, "type") : void 0;
	const queries = action && actionType === "search" ? readNonEmptyStringArray(action, "queries") : [];
	const query = normalizeNonEmptyString(item.query) ?? (action && actionType === "search" ? readNonEmptyString(action, "query") : void 0) ?? queries[0];
	const url = action ? readNonEmptyString(action, "url") : void 0;
	const pattern = action ? readNonEmptyString(action, "pattern") : void 0;
	const args = {};
	if (query) args.query = query;
	if (queries.length > 0) args.queries = queries;
	if (actionType && actionType !== "search") args.action = actionType;
	if (url) args.url = url;
	if (pattern) args.pattern = pattern;
	if (!query && !url && !pattern) args.queryUnavailable = true;
	return sanitizeCodexAgentEventRecord(args);
}
function itemToolResult(item) {
	if (item.type === "commandExecution") return { result: sanitizeCodexAgentEventRecord({
		status: item.status,
		exitCode: item.exitCode,
		durationMs: item.durationMs
	}) };
	if (item.type === "fileChange") return { result: sanitizeCodexAgentEventRecord({
		status: item.status,
		changes: itemFileChanges(item)
	}) };
	if (item.type === "mcpToolCall") return { result: sanitizeCodexAgentEventRecord({
		status: item.status,
		durationMs: item.durationMs,
		...item.error ? { error: item.error } : {},
		...item.result ? { result: item.result } : {}
	}) };
	if (item.type === "webSearch") return { result: webSearchToolResult(item) };
	return {};
}
function webSearchToolResult(item) {
	return sanitizeCodexAgentEventRecord({
		status: itemStatus(item),
		...typeof item.durationMs === "number" ? { durationMs: item.durationMs } : {},
		...webSearchToolArgs(item)
	});
}
function itemFileChanges(item) {
	return Array.isArray(item.changes) ? item.changes.map((change) => ({
		path: change.path,
		kind: change.kind
	})) : [];
}
function itemToolError(item, status, outputTextByItem) {
	if (status === "blocked") return "codex native tool blocked";
	if (status !== "failed") return;
	return itemOutputText(item, outputTextByItem) ?? "codex native tool failed";
}
function itemMeta(item, detailMode = "explain") {
	if (item.type === "commandExecution" && typeof item.command === "string") return inferToolMetaFromArgs("exec", {
		command: item.command,
		cwd: typeof item.cwd === "string" ? item.cwd : void 0
	}, { detailMode });
	if (item.type === "webSearch") return inferToolMetaFromArgs("web_search", webSearchToolArgs(item), { detailMode });
	const toolName = itemName(item);
	if ((item.type === "dynamicToolCall" || item.type === "mcpToolCall") && toolName) return inferToolMetaFromArgs(toolName, item.arguments, { detailMode });
}
function itemOutputText(item, outputTextByItem) {
	if (item.type === "commandExecution") return item.aggregatedOutput?.trim() || outputTextByItem?.get(item.id)?.trim() || void 0;
	if (item.type === "dynamicToolCall") return collectDynamicToolContentText(item.contentItems).trim() || void 0;
	if (item.type === "mcpToolCall") {
		if (item.error) return stringifyJsonValue(item.error);
		return item.result ? stringifyJsonValue(item.result) : void 0;
	}
}
function itemTranscriptResultText(item, outputTextByItem) {
	const output = itemOutputText(item, outputTextByItem);
	if (output) return output;
	const result = itemToolResult(item).result;
	return result ? stringifyJsonValue(result) : itemStatus(item);
}
function appendToolOutputDeltaText(outputTextByItem, itemId, delta) {
	const current = outputTextByItem.get(itemId) ?? "";
	if (current.length >= TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS) return;
	const remaining = TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS - current.length;
	const next = current + (delta.length > remaining ? delta.slice(0, remaining) : delta);
	outputTextByItem.set(itemId, next);
}
function normalizeToolTranscriptArguments(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	return value;
}
function collectDynamicToolContentText(contentItems) {
	if (!Array.isArray(contentItems)) return "";
	return contentItems.flatMap((entry) => {
		if (!isJsonObject(entry)) return [];
		const text = readString$5(entry, "text");
		return text ? [text] : [];
	}).join("\n");
}
function truncateToolTranscriptText(text) {
	if (text.length <= TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS) return text;
	return `${text.slice(0, TOOL_TRANSCRIPT_OUTPUT_MAX_CHARS)}\n...(truncated)...`;
}
function toolResultStatusText(params) {
	return params.isError ? `${params.name} failed` : `${params.name} completed`;
}
function stringifyJsonValue(value) {
	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return;
	}
}
function formatToolSummary(toolName, meta) {
	const trimmedMeta = meta?.trim();
	return formatToolAggregate(toolName, trimmedMeta ? [trimmedMeta] : void 0, { markdown: true });
}
function formatToolOutput(toolName, meta, output) {
	const formattedOutput = formatToolProgressOutput(output);
	if (!formattedOutput) return formatToolSummary(toolName, meta);
	const fence = markdownFenceForText(formattedOutput);
	return `${formatToolSummary(toolName, meta)}\n${fence}txt\n${formattedOutput}\n${fence}`;
}
function markdownFenceForText(text) {
	return "`".repeat(Math.max(3, longestBacktickRun(text) + 1));
}
function longestBacktickRun(value) {
	let longest = 0;
	let current = 0;
	for (const char of value) {
		if (char === "`") {
			current += 1;
			longest = Math.max(longest, current);
			continue;
		}
		current = 0;
	}
	return longest;
}
function readItemString(item, key) {
	const value = item[key];
	return typeof value === "string" ? value : void 0;
}
function readItem(value) {
	if (!isJsonObject(value)) return;
	const type = typeof value.type === "string" ? value.type : void 0;
	const id = typeof value.id === "string" ? value.id : void 0;
	if (!type || !id) return;
	return value;
}
function readTurn(value) {
	return readCodexTurn(value);
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-notification.ts
const CODEX_SUBAGENT_NOTIFICATION_START = "<subagent_notification>";
const CODEX_SUBAGENT_NOTIFICATION_END = "</subagent_notification>";
/** Extracts trusted subagent completion payloads from a Codex server notification. */
function extractCodexNativeSubagentCompletions(notification) {
	const params = isJsonObject(notification.params) ? notification.params : void 0;
	if (!params) return [];
	const item = isJsonObject(params.item) ? params.item : void 0;
	if (!item) return [];
	const text = readTrustedInterAgentCommunicationContent(item);
	if (!text) return [];
	const author = readTrustedInterAgentCommunicationAuthor(item);
	return extractCodexNativeSubagentCompletionsFromText(text).filter((completion) => completion.agentPath === author);
}
/** Parses one or more tagged subagent completion payloads from commentary text. */
function extractCodexNativeSubagentCompletionsFromText(text) {
	const completions = [];
	let cursor = 0;
	while (cursor < text.length) {
		const start = text.indexOf(CODEX_SUBAGENT_NOTIFICATION_START, cursor);
		if (start < 0) break;
		const bodyStart = start + 23;
		const end = text.indexOf(CODEX_SUBAGENT_NOTIFICATION_END, bodyStart);
		if (end < 0) break;
		const parsed = parseCodexNativeSubagentNotificationBody(text.slice(bodyStart, end));
		if (parsed) completions.push(parsed);
		cursor = end + 24;
	}
	return completions;
}
function parseCodexNativeSubagentNotificationBody(body) {
	let payload;
	try {
		payload = JSON.parse(body.trim());
	} catch {
		return;
	}
	if (!isJsonObject(payload)) return;
	const agentPath = readString$4(payload, "agent_path")?.trim();
	const status = isJsonObject(payload.status) ? payload.status : void 0;
	if (!agentPath || !status) return;
	const statusEntry = readCompletionStatus(status);
	if (!statusEntry) return;
	return {
		agentPath,
		status: statusEntry.status,
		statusLabel: statusEntry.label,
		result: statusEntry.result
	};
}
function readCompletionStatus(status) {
	for (const [rawKey, value] of Object.entries(status)) {
		const mappedStatus = mapCompletionStatus(normalizeStatusKey(rawKey));
		if (!mappedStatus) continue;
		const result = stringifyResult(value, mappedStatus);
		return {
			status: mappedStatus,
			label: mappedStatus === "succeeded" && result.kind === "no_final_assistant_message" ? "completed_without_final_message" : rawKey,
			result: result.text
		};
	}
}
function mapCompletionStatus(value) {
	if (value === "completed" || value === "succeeded" || value === "success") return "succeeded";
	if (value === "cancelled" || value === "canceled" || value === "interrupted" || value === "shutdown") return "cancelled";
	if (value === "failed" || value === "error" || value === "errored" || value === "systemerror" || value === "notfound") return "failed";
}
function stringifyResult(value, status) {
	if (typeof value === "string") {
		const text = value.trim();
		if (text) return { text };
		return status === "succeeded" ? completedWithoutFinalAssistantMessage() : { text: "(no output)" };
	}
	if (value === null || value === void 0) return status === "succeeded" ? completedWithoutFinalAssistantMessage() : { text: "(no output)" };
	try {
		return { text: JSON.stringify(value) };
	} catch {
		return { text: "(unserializable output)" };
	}
}
function completedWithoutFinalAssistantMessage() {
	return {
		text: "Codex native subagent completed without a final assistant message.",
		kind: "no_final_assistant_message"
	};
}
function readTrustedInterAgentCommunicationContent(item) {
	const communication = readTrustedInterAgentCommunication(item);
	return typeof communication?.content === "string" ? communication.content : void 0;
}
function readTrustedInterAgentCommunicationAuthor(item) {
	const communication = readTrustedInterAgentCommunication(item);
	return typeof communication?.author === "string" ? communication.author : void 0;
}
function readTrustedInterAgentCommunication(item) {
	if (readString$4(item, "type") !== "message" || readString$4(item, "role") !== "assistant" || readString$4(item, "phase") !== "commentary") return;
	const text = extractSingleTextPart(item);
	if (!text) return;
	let parsed;
	try {
		parsed = JSON.parse(text);
	} catch {
		return;
	}
	if (!isJsonObject(parsed)) return;
	if (typeof parsed.author !== "string" || typeof parsed.recipient !== "string" || typeof parsed.content !== "string" || parsed.trigger_turn !== false) return;
	return parsed;
}
function extractSingleTextPart(item) {
	const content = item.content;
	if (!Array.isArray(content) || content.length !== 1) return;
	const [entry] = content;
	if (!isJsonObject(entry)) return;
	const type = readString$4(entry, "type");
	if (type !== "output_text" && type !== "text") return;
	return readString$4(entry, "text")?.trim();
}
function readString$4(record, key) {
	const value = record[key];
	return typeof value === "string" ? value : void 0;
}
function normalizeStatusKey(value) {
	return value.replace(/[^a-z0-9]/giu, "").toLowerCase();
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-task-ids.ts
/**
* Shared identifiers for representing Codex native subagents as OpenClaw task
* runtime rows.
*/
/** Task runtime namespace for Codex native subagent task rows. */
const CODEX_NATIVE_SUBAGENT_RUNTIME = "subagent";
/** Task kind used to distinguish native Codex subagents from other subagent runtimes. */
const CODEX_NATIVE_SUBAGENT_TASK_KIND = "codex-native";
/** Run id prefix for task rows keyed by Codex child thread ids. */
const CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX = "codex-thread:";
//#endregion
//#region extensions/codex/src/app-server/native-subagent-task-mirror.ts
/** Projects Codex thread and collab-agent notifications into task lifecycle updates. */
var CodexNativeSubagentTaskMirror = class {
	constructor(params, runtime) {
		this.params = params;
		this.runtime = runtime;
		this.mirroredThreadIds = /* @__PURE__ */ new Set();
		this.failedMirrorThreadIds = /* @__PURE__ */ new Set();
		this.terminalRunIds = /* @__PURE__ */ new Set();
		this.authoritativeRunIds = /* @__PURE__ */ new Set();
		this.expectedAuthoritativeRunIds = /* @__PURE__ */ new Set();
		this.now = params.now ?? Date.now;
	}
	markAuthoritativeCompletion(childThreadId) {
		const runId = codexNativeSubagentRunId(childThreadId);
		this.authoritativeRunIds.add(runId);
		this.terminalRunIds.add(runId);
	}
	markAuthoritativeCompletionExpected(childThreadId) {
		this.expectedAuthoritativeRunIds.add(codexNativeSubagentRunId(childThreadId));
	}
	handleNotification(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params) return;
		if (notification.method === "thread/started") {
			this.handleThreadStarted(params);
			return;
		}
		if (notification.method === "thread/status/changed") {
			this.handleThreadStatusChanged(params);
			return;
		}
		if (notification.method === "item/started" || notification.method === "item/completed") this.handleCollabAgentItem(params);
	}
	handleThreadStarted(params) {
		const notification = readThreadStartedNotification(params);
		if (!notification) return;
		const thread = notification.thread;
		const spawn = readSubagentThreadSpawnSource(thread.source, this.params.parentThreadId);
		if (!spawn) return;
		const threadId = thread.id.trim();
		if (!threadId || this.mirroredThreadIds.has(threadId)) return;
		this.mirroredThreadIds.add(threadId);
		const runId = codexNativeSubagentRunId(threadId);
		const label = trimOptional(spawn.agent_nickname) ?? trimOptional(thread.agentNickname) ?? trimOptional(spawn.agent_role) ?? trimOptional(thread.agentRole) ?? "Codex subagent";
		const task = trimOptional(thread.preview) ?? `Codex native subagent${label === "Codex subagent" ? "" : ` ${label}`}`;
		const createdAt = secondsToMillis$1(thread.createdAt) ?? this.now();
		if (!this.runtime.tryCreateRunningTaskRun({
			sourceId: runId,
			agentId: this.params.agentId,
			runId,
			label,
			task,
			notifyPolicy: "silent",
			deliveryStatus: "not_applicable",
			preferMetadata: true,
			startedAt: createdAt,
			lastEventAt: this.now(),
			progressSummary: "Codex native subagent started."
		})) {
			this.mirroredThreadIds.delete(threadId);
			this.failedMirrorThreadIds.add(threadId);
			return;
		}
		this.failedMirrorThreadIds.delete(threadId);
		this.terminalRunIds.delete(runId);
		this.authoritativeRunIds.delete(runId);
		this.applyStatus(threadId, thread.status);
	}
	handleThreadStatusChanged(params) {
		const notification = readThreadStatusChangedNotification(params);
		if (!notification) return;
		this.applyStatus(notification.threadId, notification.status);
	}
	applyStatus(threadId, status) {
		if (!this.mirroredThreadIds.has(threadId) && this.failedMirrorThreadIds.has(threadId)) return;
		const statusType = status?.type;
		if (!statusType) return;
		const runId = codexNativeSubagentRunId(threadId);
		if (this.authoritativeRunIds.has(runId)) return;
		if (this.terminalRunIds.has(runId) && statusType !== "systemError") return;
		const eventAt = this.now();
		if (statusType === "active") {
			this.runtime.recordTaskRunProgressByRunId({
				runId,
				lastEventAt: eventAt,
				progressSummary: "Codex native subagent is active."
			});
			return;
		}
		if (statusType === "idle") {
			this.terminalRunIds.add(runId);
			this.runtime.recordTaskRunProgressByRunId({
				runId,
				lastEventAt: eventAt,
				progressSummary: "Codex native subagent is idle."
			});
			return;
		}
		if (statusType === "systemError") {
			this.terminalRunIds.add(runId);
			this.runtime.finalizeTaskRunByRunId({
				runId,
				status: "failed",
				endedAt: eventAt,
				lastEventAt: eventAt,
				error: "Codex app-server reported a system error for the native subagent thread.",
				progressSummary: "Codex native subagent hit a system error.",
				terminalSummary: "Codex native subagent failed."
			});
			return;
		}
		if (statusType === "notLoaded") this.runtime.recordTaskRunProgressByRunId({
			runId,
			lastEventAt: eventAt,
			progressSummary: "Codex native subagent is not loaded."
		});
	}
	handleCollabAgentItem(params) {
		const item = isJsonObject(params.item) ? params.item : void 0;
		if (!item || readString$3(item, "type") !== "collabAgentToolCall") return;
		if ((readString$3(item, "senderThreadId") ?? readString$3(params, "threadId")) !== this.params.parentThreadId) return;
		const isSpawnAgentTool = normalizeToolName$1(readString$3(item, "tool")) === "spawnagent";
		const receiverThreadIds = readStringArray$1(item.receiverThreadIds);
		const agentsStates = readAgentsStates(item.agentsStates);
		const spawnChildThreadIds = new Set([...receiverThreadIds, ...agentsStates.keys()]);
		if (isSpawnAgentTool) for (const childThreadId of spawnChildThreadIds) this.createTaskFromCollabSpawnItem(childThreadId, item);
		const toolCallStatus = normalizeCollabToolCallStatus(readString$3(item, "status"));
		const terminalToolCallThreadIds = /* @__PURE__ */ new Set();
		if (isSpawnAgentTool && isBlockedOrFailedCollabToolCallStatus(toolCallStatus)) {
			for (const threadId of spawnChildThreadIds) terminalToolCallThreadIds.add(threadId);
			for (const threadId of agentsStates.keys()) terminalToolCallThreadIds.add(threadId);
		}
		const terminalAgentStateThreadIds = /* @__PURE__ */ new Set();
		for (const [threadId, state] of agentsStates) {
			const normalizedStatus = normalizeAgentStateStatus(state.status);
			if (terminalToolCallThreadIds.has(threadId) && isNonTerminalAgentStateStatus(normalizedStatus)) continue;
			this.applyCollabAgentStatus(threadId, normalizedStatus, state.message);
			if (isTerminalAgentStateStatus(normalizedStatus)) terminalAgentStateThreadIds.add(threadId);
		}
		if (isBlockedOrFailedCollabToolCallStatus(toolCallStatus)) for (const threadId of terminalToolCallThreadIds) {
			if (terminalAgentStateThreadIds.has(threadId)) continue;
			const state = agentsStates.get(threadId);
			this.applyCollabAgentStatus(threadId, toolCallStatus, state?.message);
		}
	}
	createTaskFromCollabSpawnItem(threadId, item) {
		const normalizedThreadId = threadId.trim();
		if (!normalizedThreadId || this.mirroredThreadIds.has(normalizedThreadId)) return;
		this.mirroredThreadIds.add(normalizedThreadId);
		const prompt = trimOptional(readString$3(item, "prompt"));
		const runId = codexNativeSubagentRunId(normalizedThreadId);
		const createdAt = this.now();
		if (!this.runtime.tryCreateRunningTaskRun({
			sourceId: runId,
			agentId: this.params.agentId,
			runId,
			label: "Codex subagent",
			task: prompt ?? "Codex native subagent",
			notifyPolicy: "silent",
			deliveryStatus: "not_applicable",
			preferMetadata: true,
			startedAt: createdAt,
			lastEventAt: createdAt,
			progressSummary: "Codex native subagent spawned."
		})) {
			this.mirroredThreadIds.delete(normalizedThreadId);
			this.failedMirrorThreadIds.add(normalizedThreadId);
			return;
		}
		this.failedMirrorThreadIds.delete(normalizedThreadId);
		this.terminalRunIds.delete(runId);
		this.authoritativeRunIds.delete(runId);
	}
	applyCollabAgentStatus(threadId, status, message) {
		if (!this.mirroredThreadIds.has(threadId) && this.failedMirrorThreadIds.has(threadId)) return;
		const normalizedStatus = normalizeAgentStateStatus(status);
		if (!normalizedStatus) return;
		const runId = codexNativeSubagentRunId(threadId);
		if (this.authoritativeRunIds.has(runId)) return;
		if (this.terminalRunIds.has(runId) && isNonTerminalAgentStateStatus(normalizedStatus)) return;
		const eventAt = this.now();
		if (normalizedStatus === "pendingInit" || normalizedStatus === "running") {
			this.runtime.recordTaskRunProgressByRunId({
				runId,
				lastEventAt: eventAt,
				progressSummary: trimOptional(message) ?? (normalizedStatus === "pendingInit" ? "Codex native subagent is initializing." : "Codex native subagent is running.")
			});
			return;
		}
		if (normalizedStatus === "completed") {
			this.terminalRunIds.add(runId);
			const summary = trimOptional(message) ?? "Codex native subagent completed.";
			if (this.expectedAuthoritativeRunIds.has(runId)) this.runtime.recordTaskRunProgressByRunId({
				runId,
				lastEventAt: eventAt,
				progressSummary: summary
			});
			else this.runtime.finalizeTaskRunByRunId({
				runId,
				status: "succeeded",
				endedAt: eventAt,
				lastEventAt: eventAt,
				progressSummary: summary,
				terminalSummary: summary
			});
			return;
		}
		if (normalizedStatus === "blocked") {
			this.terminalRunIds.add(runId);
			this.runtime.finalizeTaskRunByRunId({
				runId,
				status: "succeeded",
				endedAt: eventAt,
				lastEventAt: eventAt,
				progressSummary: trimOptional(message) ?? "Codex native subagent blocked.",
				terminalSummary: trimOptional(message) ?? "Codex native subagent blocked.",
				terminalOutcome: "blocked"
			});
			return;
		}
		this.terminalRunIds.add(runId);
		this.runtime.finalizeTaskRunByRunId({
			runId,
			status: normalizedStatus === "interrupted" || normalizedStatus === "shutdown" ? "cancelled" : "failed",
			endedAt: eventAt,
			lastEventAt: eventAt,
			error: trimOptional(message) ?? `Codex native subagent status: ${normalizedStatus}`,
			progressSummary: trimOptional(message) ?? `Codex native subagent ${normalizedStatus}.`,
			terminalSummary: trimOptional(message) ?? "Codex native subagent did not complete."
		});
	}
};
/** Converts a Codex child thread id into the OpenClaw task-runtime run id. */
function codexNativeSubagentRunId(threadId) {
	return `${CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX}${threadId.trim()}`;
}
/** Reads a subagent thread-spawn source only when it belongs to the expected parent thread. */
function readSubagentThreadSpawnSource(source, parentThreadId) {
	if (!source || typeof source !== "object" || !("subAgent" in source)) return;
	const subAgent = source.subAgent;
	if (!subAgent || typeof subAgent !== "object" || !("thread_spawn" in subAgent)) return;
	const spawn = subAgent.thread_spawn;
	if (!spawn || typeof spawn !== "object") return;
	return spawn.parent_thread_id === parentThreadId ? spawn : void 0;
}
function readThreadStartedNotification(params) {
	const thread = params.thread;
	if (!isJsonObject(thread) || typeof thread.id !== "string") return;
	return { thread };
}
function readThreadStatusChangedNotification(params) {
	if (typeof params.threadId !== "string") return;
	const status = params.status;
	if (!isJsonObject(status) || !isCodexThreadStatusType(status.type)) return;
	return {
		threadId: params.threadId,
		status
	};
}
function isCodexThreadStatusType(value) {
	return value === "notLoaded" || value === "idle" || value === "systemError" || value === "active";
}
function readAgentsStates(value) {
	const states = /* @__PURE__ */ new Map();
	if (!isJsonObject(value)) return states;
	for (const [threadId, rawState] of Object.entries(value)) {
		if (!isJsonObject(rawState)) continue;
		const status = readString$3(rawState, "status");
		const message = readNullableString(rawState, "message");
		states.set(threadId, {
			status,
			message
		});
	}
	return states;
}
function readStringArray$1(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => typeof entry === "string" && entry.trim() !== "");
}
function readString$3(value, key) {
	const entry = value[key];
	return typeof entry === "string" ? entry : void 0;
}
function readNullableString(value, key) {
	const entry = value[key];
	return typeof entry === "string" || entry === null ? entry : void 0;
}
function normalizeToolName$1(value) {
	return value?.replace(/[^a-z0-9]/giu, "").toLowerCase();
}
function normalizeCollabToolCallStatus(value) {
	const key = value?.replace(/[^a-z0-9]/giu, "").toLowerCase();
	if (key === "completed" || key === "succeeded" || key === "success") return "completed";
	if (key === "failed" || key === "error" || key === "errored") return "failed";
	if (key === "blocked" || key === "declined") return "blocked";
	if (key === "inprogress" || key === "running") return "running";
	return value?.trim();
}
function isBlockedOrFailedCollabToolCallStatus(value) {
	return value === "failed" || value === "blocked";
}
function isNonTerminalAgentStateStatus(value) {
	return value === "pendingInit" || value === "running";
}
function isTerminalAgentStateStatus(value) {
	return value !== void 0 && !isNonTerminalAgentStateStatus(value);
}
function normalizeAgentStateStatus(value) {
	const key = value?.replace(/[^a-z0-9]/giu, "").toLowerCase();
	if (!key) return;
	if (key === "pendinginit") return "pendingInit";
	if (key === "inprogress" || key === "running") return "running";
	if (key === "completed" || key === "succeeded" || key === "success") return "completed";
	if (key === "interrupted" || key === "cancelled" || key === "canceled" || key === "shutdown") return key === "shutdown" ? "shutdown" : "interrupted";
	if (key === "failed" || key === "error" || key === "systemerror") return "failed";
	if (key === "blocked" || key === "declined") return "blocked";
	return value?.trim();
}
function secondsToMillis$1(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	return value * 1e3;
}
function trimOptional(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-monitor.ts
/**
* Monitors Codex native subagent threads and mirrors their lifecycle/completion
* into OpenClaw task runtime records for parent sessions.
*/
const DEFAULT_TRANSCRIPT_POLL_DELAYS_MS = [
	2e3,
	5e3,
	1e4,
	15e3,
	3e4,
	6e4,
	12e4,
	3e5
];
const DEFAULT_COMPLETION_DELIVERY_RETRY_DELAYS_MS = [
	5e3,
	15e3,
	3e4,
	6e4,
	12e4,
	3e5
];
const DEFAULT_TASK_ROW_RECONCILE_INTERVAL_MS = 1e4;
const RECENT_TERMINAL_TASK_RECONCILE_GRACE_MS = 6e4;
const CODEX_ROLLOUT_FILENAME_RE = /^rollout-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-(.+)\.jsonl$/u;
const defaultRuntime = {
	createAgentHarnessTaskRuntime,
	deliverAgentHarnessTaskCompletion
};
const monitors = /* @__PURE__ */ new WeakMap();
/** Registers or updates the monitor bound to a Codex app-server client. */
function registerCodexNativeSubagentMonitor(params) {
	let monitor = monitors.get(params.client);
	if (!monitor) {
		monitor = new CodexNativeSubagentMonitor(params.client, params.runtime ?? defaultRuntime, { codexHome: params.codexHome });
		monitors.set(params.client, monitor);
	} else monitor.configure({ codexHome: params.codexHome });
	monitor.registerParent({
		parentThreadId: params.parentThreadId,
		requesterSessionKey: params.requesterSessionKey,
		taskRuntimeScope: params.taskRuntimeScope,
		agentId: params.agentId
	});
}
/** Tracks native subagent thread notifications, transcript completions, and task delivery. */
var CodexNativeSubagentMonitor = class {
	constructor(client, runtime = defaultRuntime, options = {}) {
		this.runtime = runtime;
		this.startedAt = Date.now();
		this.parentStates = /* @__PURE__ */ new Map();
		this.childThreadParents = /* @__PURE__ */ new Map();
		this.childStates = /* @__PURE__ */ new Map();
		this.childThreadIdsByAgentPath = /* @__PURE__ */ new Map();
		this.transcriptPathsByChildThreadId = /* @__PURE__ */ new Map();
		this.codexHome = normalizeOptionalString(options.codexHome);
		this.transcriptPollDelaysMs = options.transcriptPollDelaysMs ?? DEFAULT_TRANSCRIPT_POLL_DELAYS_MS;
		this.completionDeliveryRetryDelaysMs = options.completionDeliveryRetryDelaysMs ?? DEFAULT_COMPLETION_DELIVERY_RETRY_DELAYS_MS;
		this.startTaskRowReconciler(options.taskRowReconcileIntervalMs ?? DEFAULT_TASK_ROW_RECONCILE_INTERVAL_MS);
		client.addNotificationHandler((notification) => this.handleNotification(notification));
		client.addCloseHandler?.(() => this.dispose());
	}
	dispose() {
		this.clearTimers();
		this.parentStates.clear();
		this.childThreadParents.clear();
		this.childStates.clear();
		this.childThreadIdsByAgentPath.clear();
		this.transcriptPathsByChildThreadId.clear();
	}
	configure(options) {
		const codexHome = normalizeOptionalString(options.codexHome);
		if (codexHome) this.codexHome = codexHome;
	}
	registerParent(params) {
		const parentThreadId = params.parentThreadId.trim();
		if (!parentThreadId) return;
		const existing = this.parentStates.get(parentThreadId);
		if (existing) {
			existing.requesterSessionKey = params.requesterSessionKey ?? existing.requesterSessionKey;
			existing.taskRuntimeScope = params.taskRuntimeScope ?? existing.taskRuntimeScope;
			existing.agentId = params.agentId ?? existing.agentId;
			this.ensureParentTaskRuntime(existing);
		} else {
			const state = {
				parentThreadId,
				requesterSessionKey: params.requesterSessionKey,
				taskRuntimeScope: params.taskRuntimeScope,
				agentId: params.agentId,
				deliveredCompletionKeys: /* @__PURE__ */ new Set()
			};
			this.ensureParentTaskRuntime(state);
			this.parentStates.set(parentThreadId, { ...state });
		}
		const state = this.parentStates.get(parentThreadId);
		if (state) this.reconcileExistingRunningTasksForParent(state);
	}
	async handleNotification(notification) {
		const state = this.resolveMirrorState(notification);
		if (state?.mirror) try {
			state.mirror.handleNotification(notification);
		} catch (error) {
			log.warn("Failed to mirror Codex native subagent lifecycle event", {
				method: notification.method,
				error: formatErrorMessage(error)
			});
		}
		this.captureChildAssistantMessage(notification);
		await this.handleChildTurnCompletion(notification);
		await this.handleCompletionNotification(notification);
	}
	ensureParentTaskRuntime(state) {
		if (state.taskRuntime || !state.requesterSessionKey || !state.taskRuntimeScope) return;
		state.taskRuntime = this.runtime.createAgentHarnessTaskRuntime({
			runtime: CODEX_NATIVE_SUBAGENT_RUNTIME,
			taskKind: CODEX_NATIVE_SUBAGENT_TASK_KIND,
			scope: state.taskRuntimeScope,
			runIdPrefix: CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX
		});
		state.mirror = new CodexNativeSubagentTaskMirror({
			parentThreadId: state.parentThreadId,
			requesterSessionKey: state.requesterSessionKey,
			agentId: state.agentId
		}, state.taskRuntime);
	}
	resolveMirrorState(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params) return;
		if (notification.method === "thread/started") {
			const thread = isJsonObject(params.thread) ? params.thread : void 0;
			const parentThreadId = readSpawnParentThreadId(thread);
			const childThreadId = thread ? readString$2(thread, "id")?.trim() : void 0;
			const agentPath = readSpawnAgentPath(thread);
			const state = parentThreadId ? this.parentStates.get(parentThreadId) : void 0;
			if (state && childThreadId && parentThreadId) this.registerChildThread(parentThreadId, childThreadId, { agentPath });
			return state;
		}
		if (notification.method === "thread/status/changed") {
			const childThreadId = readString$2(params, "threadId")?.trim();
			const parentThreadId = childThreadId ? this.childThreadParents.get(childThreadId) : void 0;
			return parentThreadId ? this.parentStates.get(parentThreadId) : void 0;
		}
		if (notification.method === "item/started" || notification.method === "item/completed") {
			const item = isJsonObject(params.item) ? params.item : void 0;
			const parentThreadId = item ? (readString$2(item, "senderThreadId") ?? readString$2(params, "threadId"))?.trim() : void 0;
			const state = parentThreadId ? this.parentStates.get(parentThreadId) : void 0;
			if (state && parentThreadId) {
				const childThreadIds = normalizeToolName(readString$2(item, "tool")) === "spawnagent" ? new Set([...readStringArray(item?.receiverThreadIds), ...readObjectStringKeys(item?.agentsStates)]) : new Set(readStringArray(item?.receiverThreadIds));
				for (const childThreadId of childThreadIds) this.registerChildThread(parentThreadId, childThreadId);
			}
			return state;
		}
	}
	async handleCompletionNotification(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		const parentThreadId = params ? readString$2(params, "threadId")?.trim() : void 0;
		const state = parentThreadId ? this.parentStates.get(parentThreadId) : void 0;
		if (!state) return;
		const completions = extractCodexNativeSubagentCompletions(notification);
		for (const nativeCompletion of completions) {
			const childThreadId = this.resolveChildThreadIdForAgentPath(state.parentThreadId, nativeCompletion.agentPath);
			const childState = childThreadId ? this.childStates.get(childThreadId) : void 0;
			if (!childState || childState.parentThreadId !== state.parentThreadId || childState.transcriptTerminal) {
				log.warn("Ignoring Codex native subagent completion for unknown child thread", {
					parentThreadId: state.parentThreadId,
					agentPath: nativeCompletion.agentPath
				});
				continue;
			}
			const completion = toThreadCompletion(nativeCompletion, childState.childThreadId);
			await this.processChildCompletion(state, childState, completion);
		}
	}
	captureChildAssistantMessage(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		const childThreadId = readString$2(params, "threadId")?.trim();
		const childState = childThreadId ? this.childStates.get(childThreadId) : void 0;
		if (!childState || childState.transcriptTerminal) return;
		if (notification.method === "item/agentMessage/delta") {
			const turnId = readString$2(params, "turnId");
			const itemId = readString$2(params, "itemId");
			const delta = readString$2(params, "delta");
			if (turnId && itemId && delta) this.recordChildAssistantMessage(childState, turnId, itemId, delta);
			return;
		}
		if (notification.method !== "item/started" && notification.method !== "item/completed") return;
		const turnId = readString$2(params, "turnId");
		const item = isJsonObject(params?.item) ? params.item : void 0;
		this.captureChildAssistantMessageItem(childState, turnId, item);
	}
	captureChildAssistantMessageItem(childState, turnId, item) {
		if (readString$2(item, "type") !== "agentMessage") return;
		const itemId = readString$2(item, "id");
		if (!turnId || !itemId) return;
		const assistantMessages = this.getChildAssistantMessages(childState, turnId);
		if (readString$2(item, "phase") === "commentary") assistantMessages.commentaryIds.add(itemId);
		else assistantMessages.finalMessageIds.add(itemId);
		const text = readString$2(item, "text");
		if (text) this.recordChildAssistantMessage(childState, turnId, itemId, text, { replace: true });
	}
	captureChildTurnAssistantMessages(childState, turn) {
		const turnId = readString$2(turn, "id");
		if (!turnId || !Array.isArray(turn.items)) return;
		for (const item of turn.items) this.captureChildAssistantMessageItem(childState, turnId, isJsonObject(item) ? item : void 0);
	}
	recordChildAssistantMessage(childState, turnId, itemId, text, options = {}) {
		const assistantMessages = this.getChildAssistantMessages(childState, turnId);
		if (!assistantMessages.texts.has(itemId)) assistantMessages.order.push(itemId);
		const existing = assistantMessages.texts.get(itemId) ?? "";
		assistantMessages.texts.set(itemId, options.replace ? text : `${existing}${text}`);
	}
	getChildAssistantMessages(childState, turnId) {
		const existing = childState.assistantMessagesByTurn.get(turnId);
		if (existing) return existing;
		const assistantMessages = {
			texts: /* @__PURE__ */ new Map(),
			order: [],
			commentaryIds: /* @__PURE__ */ new Set(),
			finalMessageIds: /* @__PURE__ */ new Set()
		};
		childState.assistantMessagesByTurn.set(turnId, assistantMessages);
		return assistantMessages;
	}
	async handleChildTurnCompletion(notification) {
		if (notification.method !== "turn/completed") return;
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		const childThreadId = readString$2(params, "threadId")?.trim();
		const childState = childThreadId ? this.childStates.get(childThreadId) : void 0;
		const state = childState ? this.parentStates.get(childState.parentThreadId) : void 0;
		const turn = isJsonObject(params?.turn) ? params.turn : void 0;
		if (childState && turn && readString$2(turn, "status") === "interrupted") {
			const turnId = readString$2(turn, "id");
			if (turnId) childState.assistantMessagesByTurn.delete(turnId);
			return;
		}
		if (childState && turn) this.captureChildTurnAssistantMessages(childState, turn);
		const completion = childState && turn ? toChildTurnCompletion(childState, turn) : void 0;
		if (!state || !childState || childState.transcriptTerminal || !completion) return;
		await this.processChildCompletion(state, childState, completion);
	}
	async processChildCompletion(state, childState, completion) {
		if (shouldWaitForTranscriptCompletion(completion, this.codexHome)) {
			const eventAt = Date.now();
			if (!await this.reconcileChildTranscript(childState.childThreadId)) {
				this.scheduleTranscriptPoll(childState);
				this.scheduleNoFinalCompletionFallback(state, childState, completion, eventAt);
			}
			return;
		}
		await this.processCompletion(state, completion);
	}
	async reconcileChildTranscript(childThreadId, options = {}) {
		const childState = this.childStates.get(childThreadId.trim());
		const state = childState ? this.parentStates.get(childState.parentThreadId) : void 0;
		if (!childState || !state || childState.transcriptTerminal) return false;
		if (!this.codexHome) return false;
		const completion = await this.findTranscriptCompletionForChild(childState, options);
		if (!completion) return false;
		const transcriptParentThreadId = completion.completion.parentThreadId;
		if (transcriptParentThreadId && transcriptParentThreadId !== state.parentThreadId) {
			log.warn("Codex native subagent transcript parent did not match monitor state", {
				childThreadId: childState.childThreadId,
				expectedParentThreadId: state.parentThreadId,
				transcriptParentThreadId
			});
			childState.transcriptPath = void 0;
			this.transcriptPathsByChildThreadId.delete(childState.childThreadId);
			return false;
		}
		await this.processCompletion(state, completion.completion, completion.completion.completedAt);
		return true;
	}
	async processCompletion(state, completion, eventAt = Date.now()) {
		this.finalizeCompletionTask(completion, eventAt);
		const childState = this.childStates.get(completion.childThreadId);
		if (childState) {
			childState.transcriptTerminal = true;
			if (childState.transcriptPollTimer) {
				clearTimeout(childState.transcriptPollTimer);
				childState.transcriptPollTimer = void 0;
			}
			if (childState.noFinalCompletionFallbackTimer) {
				clearTimeout(childState.noFinalCompletionFallbackTimer);
				childState.noFinalCompletionFallbackTimer = void 0;
			}
		}
		if (!state.requesterSessionKey) return;
		const completionKey = buildCompletionDedupeKey(state.parentThreadId, completion);
		if (state.deliveredCompletionKeys.has(completionKey)) return;
		const deliveryState = childState ?? this.ensureChildState(state.parentThreadId, completion.childThreadId);
		deliveryState.pendingCompletion = completion;
		deliveryState.pendingCompletionEventAt = eventAt;
		this.markCompletionDeliveryPending(completion);
		await this.deliverPendingCompletion(state, deliveryState);
	}
	async deliverPendingCompletion(state, childState) {
		const completion = childState.pendingCompletion;
		if (!completion || !state.requesterSessionKey || !state.taskRuntimeScope) return;
		const completionKey = buildCompletionDedupeKey(state.parentThreadId, completion);
		if (state.deliveredCompletionKeys.has(completionKey) || childState.deliveringCompletionKey === completionKey) return;
		childState.deliveringCompletionKey = completionKey;
		try {
			const delivery = await this.runtime.deliverAgentHarnessTaskCompletion({
				scope: state.taskRuntimeScope,
				childSessionKey: codexNativeSubagentRunId(completion.childThreadId),
				childSessionId: completion.childThreadId,
				announceId: `codex-native:${state.parentThreadId}:${completion.childThreadId}:${completion.status}`,
				announceType: "Codex native subagent",
				taskLabel: "Codex native subagent",
				status: completion.status,
				statusLabel: completion.statusLabel,
				result: completion.result,
				replyInstruction: "Use the Codex native subagent result to continue or wrap up the parent task. If this is a Discord/channel session, send the visible response with the message tool instead of only writing a transcript final answer. Reply in your normal assistant voice and do not expose internal notification markup."
			});
			if (isDurableAgentHarnessCompletionDelivery(delivery)) {
				state.deliveredCompletionKeys.add(completionKey);
				childState.pendingCompletion = void 0;
				childState.pendingCompletionEventAt = void 0;
				childState.completionDeliveryAttempt = 0;
				if (childState.completionDeliveryTimer) {
					clearTimeout(childState.completionDeliveryTimer);
					childState.completionDeliveryTimer = void 0;
				}
				this.markCompletionDeliveryDelivered(completion);
				return;
			}
			const error = delivery.error ?? "completion delivery did not produce a parent response";
			this.markCompletionDeliveryPending(completion, error);
			this.scheduleCompletionDeliveryRetry(childState);
		} catch (error) {
			this.markCompletionDeliveryPending(completion, formatErrorMessage(error));
			this.scheduleCompletionDeliveryRetry(childState);
			log.warn("Failed to deliver Codex native subagent completion", {
				parentThreadId: state.parentThreadId,
				childThreadId: completion.childThreadId,
				error: formatErrorMessage(error)
			});
		} finally {
			childState.deliveringCompletionKey = void 0;
		}
	}
	markCompletionDeliveryPending(completion, error) {
		const taskRuntime = this.getTaskRuntimeForChild(completion.childThreadId);
		if (!taskRuntime) return;
		taskRuntime.setDetachedTaskDeliveryStatusByRunId({
			runId: codexNativeSubagentRunId(completion.childThreadId),
			deliveryStatus: "pending",
			...error ? { error } : {}
		});
	}
	markCompletionDeliveryDelivered(completion) {
		const taskRuntime = this.getTaskRuntimeForChild(completion.childThreadId);
		if (!taskRuntime) return;
		taskRuntime.setDetachedTaskDeliveryStatusByRunId({
			runId: codexNativeSubagentRunId(completion.childThreadId),
			deliveryStatus: "delivered"
		});
	}
	scheduleCompletionDeliveryRetry(childState) {
		if (!childState.pendingCompletion || childState.completionDeliveryTimer) return;
		const attempt = childState.completionDeliveryAttempt;
		const delayMs = this.completionDeliveryRetryDelaysMs[Math.min(attempt, this.completionDeliveryRetryDelaysMs.length - 1)];
		childState.completionDeliveryAttempt += 1;
		childState.completionDeliveryTimer = setTimeout(() => {
			childState.completionDeliveryTimer = void 0;
			const state = this.parentStates.get(childState.parentThreadId);
			if (!state) return;
			this.deliverPendingCompletion(state, childState);
		}, delayMs);
		unrefTimer(childState.completionDeliveryTimer);
	}
	finalizeCompletionTask(completion, eventAt) {
		const taskRuntime = this.getTaskRuntimeForChild(completion.childThreadId);
		if (!taskRuntime) return;
		this.getMirrorForChild(completion.childThreadId)?.markAuthoritativeCompletion(completion.childThreadId);
		taskRuntime.finalizeTaskRunByRunId({
			runId: codexNativeSubagentRunId(completion.childThreadId),
			status: completion.status,
			endedAt: eventAt,
			lastEventAt: eventAt,
			...completion.status === "succeeded" ? {} : { error: completion.result },
			progressSummary: completion.result,
			terminalSummary: completion.result
		});
	}
	getTaskRuntimeForChild(childThreadId) {
		const childState = this.childStates.get(childThreadId.trim());
		return (childState ? this.parentStates.get(childState.parentThreadId) : void 0)?.taskRuntime;
	}
	getMirrorForChild(childThreadId) {
		const childState = this.childStates.get(childThreadId.trim());
		return (childState ? this.parentStates.get(childState.parentThreadId) : void 0)?.mirror;
	}
	registerChildThread(parentThreadId, childThreadId, options = {}) {
		const normalizedParentThreadId = parentThreadId.trim();
		const normalizedChildThreadId = childThreadId.trim();
		if (!normalizedParentThreadId || !normalizedChildThreadId) return;
		this.childThreadParents.set(normalizedChildThreadId, normalizedParentThreadId);
		this.childThreadIdsByAgentPath.set(buildParentAgentPathKey(normalizedParentThreadId, normalizedChildThreadId), normalizedChildThreadId);
		const agentPath = normalizeOptionalString(options.agentPath);
		const state = this.parentStates.get(normalizedParentThreadId);
		if (state?.mirror && (this.codexHome || agentPath)) state.mirror.markAuthoritativeCompletionExpected(normalizedChildThreadId);
		if (agentPath) this.childThreadIdsByAgentPath.set(buildParentAgentPathKey(normalizedParentThreadId, agentPath), normalizedChildThreadId);
		let childState = this.childStates.get(normalizedChildThreadId);
		if (!childState) {
			childState = {
				childThreadId: normalizedChildThreadId,
				parentThreadId: normalizedParentThreadId,
				assistantMessagesByTurn: /* @__PURE__ */ new Map(),
				transcriptPollAttempt: 0,
				transcriptTerminal: false,
				completionDeliveryAttempt: 0
			};
			this.childStates.set(normalizedChildThreadId, childState);
		}
		if (options.scheduleTranscriptPoll !== false) this.scheduleTranscriptPoll(childState);
	}
	ensureChildState(parentThreadId, childThreadId) {
		this.registerChildThread(parentThreadId, childThreadId);
		return this.childStates.get(childThreadId.trim());
	}
	resolveChildThreadIdForAgentPath(parentThreadId, agentPath) {
		const mapped = this.childThreadIdsByAgentPath.get(buildParentAgentPathKey(parentThreadId, agentPath));
		if (mapped) return mapped;
		const exactChild = this.childStates.get(agentPath);
		return exactChild?.parentThreadId === parentThreadId ? exactChild.childThreadId : void 0;
	}
	scheduleTranscriptPoll(childState) {
		if (!this.codexHome || childState.transcriptTerminal || childState.transcriptPollTimer) return;
		const attempt = childState.transcriptPollAttempt;
		const delayMs = this.transcriptPollDelaysMs[Math.min(attempt, this.transcriptPollDelaysMs.length - 1)];
		childState.transcriptPollAttempt += 1;
		childState.transcriptPollTimer = setTimeout(() => {
			childState.transcriptPollTimer = void 0;
			this.reconcileChildTranscript(childState.childThreadId).catch((error) => {
				log.warn("Failed to reconcile Codex native subagent transcript", {
					childThreadId: childState.childThreadId,
					error: formatErrorMessage(error)
				});
				return false;
			}).then((reconciled) => {
				if (!reconciled) this.scheduleTranscriptPoll(childState);
			});
		}, delayMs);
		unrefTimer(childState.transcriptPollTimer);
	}
	scheduleNoFinalCompletionFallback(state, childState, completion, eventAt) {
		if (childState.transcriptTerminal || childState.noFinalCompletionFallbackTimer) return;
		const delayMs = noFinalCompletionFallbackDelayMs(this.transcriptPollDelaysMs);
		childState.noFinalCompletionFallbackTimer = setTimeout(() => {
			childState.noFinalCompletionFallbackTimer = void 0;
			this.deliverNoFinalCompletionFallback(state, childState, completion, eventAt);
		}, delayMs);
		unrefTimer(childState.noFinalCompletionFallbackTimer);
	}
	async deliverNoFinalCompletionFallback(state, childState, completion, eventAt) {
		if (!await this.reconcileChildTranscript(childState.childThreadId).catch((error) => {
			log.warn("Failed to reconcile Codex native subagent transcript", {
				childThreadId: childState.childThreadId,
				error: formatErrorMessage(error)
			});
			return false;
		}) && !childState.transcriptTerminal) await this.processCompletion(state, completion, eventAt);
	}
	clearTimers() {
		if (this.taskRowReconcileTimer) {
			clearInterval(this.taskRowReconcileTimer);
			this.taskRowReconcileTimer = void 0;
		}
		for (const childState of this.childStates.values()) {
			if (childState.transcriptPollTimer) {
				clearTimeout(childState.transcriptPollTimer);
				childState.transcriptPollTimer = void 0;
			}
			if (childState.completionDeliveryTimer) {
				clearTimeout(childState.completionDeliveryTimer);
				childState.completionDeliveryTimer = void 0;
			}
			if (childState.noFinalCompletionFallbackTimer) {
				clearTimeout(childState.noFinalCompletionFallbackTimer);
				childState.noFinalCompletionFallbackTimer = void 0;
			}
		}
	}
	startTaskRowReconciler(intervalMs) {
		if (!Number.isFinite(intervalMs) || intervalMs <= 0) return;
		this.taskRowReconcileTimer = setInterval(() => {
			this.reconcileKnownTaskRows().catch((error) => {
				log.warn("Failed to reconcile Codex native subagent task rows", { error: formatErrorMessage(error) });
			});
		}, Math.max(1, Math.floor(intervalMs)));
		unrefTimer(this.taskRowReconcileTimer);
	}
	async reconcileKnownTaskRows() {
		if (!this.codexHome) return;
		for (const state of this.parentStates.values()) await this.reconcileKnownTaskRowsForParent(state);
	}
	async reconcileExistingRunningTasksForParent(state) {
		if (!this.codexHome || !state.taskRuntime) return;
		const tasks = state.taskRuntime.listTaskRecords();
		const candidates = [];
		for (const task of tasks) {
			if (!this.shouldReconcileCodexNativeTask(task)) continue;
			if (state.requesterSessionKey && task.requesterSessionKey !== state.requesterSessionKey) continue;
			const childThreadId = task.runId.slice(13).trim();
			if (!childThreadId) continue;
			this.registerChildThread(state.parentThreadId, childThreadId, { scheduleTranscriptPoll: false });
			const childState = this.childStates.get(childThreadId);
			if (childState && !childState.transcriptPollTimer) candidates.push({
				childThreadId,
				childState
			});
		}
		await this.primeTranscriptPathCacheForChildren(candidates.map(({ childState }) => childState));
		for (const { childThreadId, childState } of candidates) if (!await this.reconcileChildTranscript(childThreadId, { allowTreeScan: false })) this.scheduleTranscriptPoll(childState);
	}
	async reconcileKnownTaskRowsForParent(state) {
		if (!this.codexHome || !state.taskRuntime) return;
		const tasks = state.taskRuntime.listTaskRecords();
		const candidates = [];
		for (const task of tasks) {
			if (!this.shouldReconcileCodexNativeTask(task)) continue;
			const childThreadId = task.runId.slice(13).trim();
			if (!childThreadId) continue;
			this.registerChildThread(state.parentThreadId, childThreadId, { scheduleTranscriptPoll: false });
			const childState = this.childStates.get(childThreadId);
			if (!childState || childState.transcriptPollTimer) continue;
			candidates.push({
				task,
				childThreadId,
				childState
			});
		}
		await this.primeTranscriptPathCacheForChildren(candidates.map(({ childState }) => childState));
		for (const { task, childThreadId, childState } of candidates) {
			const transcriptCompletion = await this.findTranscriptCompletionForChild(childState, { allowTreeScan: false });
			if (!transcriptCompletion) {
				this.scheduleTranscriptPoll(childState);
				continue;
			}
			const parentThreadId = transcriptCompletion.completion.parentThreadId ?? this.childThreadParents.get(childThreadId);
			if (!parentThreadId) {
				log.warn("Codex native subagent transcript did not include a parent thread", {
					childThreadId,
					transcriptPath: transcriptCompletion.transcriptPath
				});
				continue;
			}
			if (parentThreadId !== state.parentThreadId) continue;
			state.agentId = state.agentId ?? task.agentId;
			await this.processCompletion(state, transcriptCompletion.completion, transcriptCompletion.completion.completedAt);
		}
	}
	shouldReconcileCodexNativeTask(task) {
		if (task.runtime !== "subagent" || task.taskKind !== "codex-native" || !task.runId?.startsWith("codex-thread:")) return false;
		if (task.status === "running" || task.status === "queued" || task.deliveryStatus === "pending") return true;
		return task.deliveryStatus === "not_applicable" && this.isRecentTerminalTask(task);
	}
	isRecentTerminalTask(task) {
		if (task.status !== "succeeded" && task.status !== "failed" && task.status !== "timed_out" && task.status !== "cancelled" && task.status !== "lost") return false;
		const earliestRelevantAt = this.startedAt - RECENT_TERMINAL_TASK_RECONCILE_GRACE_MS;
		return [
			task.createdAt,
			task.startedAt,
			task.endedAt,
			task.lastEventAt
		].some((timestamp) => typeof timestamp === "number" && timestamp >= earliestRelevantAt);
	}
	async primeTranscriptPathCacheForChildren(childStates) {
		const codexHome = this.codexHome;
		if (!codexHome) return;
		const missingChildThreadIds = new Set(childStates.filter((childState) => !childState.transcriptPath && !this.transcriptPathsByChildThreadId.has(childState.childThreadId)).map((childState) => childState.childThreadId));
		if (missingChildThreadIds.size === 0) return;
		const transcriptPaths = await findTranscriptPaths({
			codexHome,
			childThreadIds: missingChildThreadIds
		});
		for (const [childThreadId, transcriptPath] of transcriptPaths) {
			this.transcriptPathsByChildThreadId.set(childThreadId, transcriptPath);
			const childState = this.childStates.get(childThreadId);
			if (childState) childState.transcriptPath = transcriptPath;
		}
	}
	async findTranscriptCompletionForChild(childState, options = {}) {
		const codexHome = this.codexHome;
		if (!codexHome) return;
		const transcriptPath = childState.transcriptPath ?? this.transcriptPathsByChildThreadId.get(childState.childThreadId);
		const completion = await findTranscriptCompletion({
			codexHome,
			childThreadId: childState.childThreadId,
			transcriptPath,
			allowTreeScan: options.allowTreeScan ?? true
		});
		if (completion) {
			childState.transcriptPath = completion.transcriptPath;
			this.transcriptPathsByChildThreadId.set(childState.childThreadId, completion.transcriptPath);
		}
		return completion;
	}
};
function buildCompletionDedupeKey(parentThreadId, completion) {
	const hash = createHash("sha256").update(completion.result).digest("hex").slice(0, 16);
	return `${parentThreadId}:${completion.childThreadId}:${completion.status}:${hash}`;
}
function toChildTurnCompletion(childState, turn) {
	const status = readString$2(turn, "status");
	if (status === "completed") {
		const turnId = readString$2(turn, "id");
		const result = turnId ? lastChildAssistantMessage(childState, turnId) : void 0;
		return {
			childThreadId: childState.childThreadId,
			status: "succeeded",
			statusLabel: result ? "turn_completed" : "completed_without_final_message",
			result: result ?? "Codex native subagent completed without a final assistant message."
		};
	}
	if (status === "failed") return {
		childThreadId: childState.childThreadId,
		status: "failed",
		statusLabel: "turn_failed",
		result: readTurnErrorMessage(turn) ?? "Codex native subagent failed."
	};
}
function lastChildAssistantMessage(childState, turnId) {
	const assistantMessages = childState.assistantMessagesByTurn.get(turnId);
	if (!assistantMessages) return;
	for (let index = assistantMessages.order.length - 1; index >= 0; index -= 1) {
		const itemId = assistantMessages.order[index];
		if (assistantMessages.finalMessageIds.has(itemId) && !assistantMessages.commentaryIds.has(itemId)) {
			const text = normalizeOptionalString(assistantMessages.texts.get(itemId));
			if (text) return text;
		}
	}
}
function readTurnErrorMessage(turn) {
	const error = isJsonObject(turn.error) ? turn.error : void 0;
	return normalizeOptionalString(readString$2(error, "message")) ?? normalizeOptionalString(isJsonObject(error?.codexErrorInfo) ? readString$2(error.codexErrorInfo, "message") : void 0);
}
function buildParentAgentPathKey(parentThreadId, agentPath) {
	return `${parentThreadId}\0${agentPath}`;
}
function toThreadCompletion(completion, childThreadId) {
	return {
		childThreadId,
		status: completion.status,
		statusLabel: completion.statusLabel,
		result: completion.result
	};
}
function shouldWaitForTranscriptCompletion(completion, codexHome) {
	return Boolean(codexHome && completion.status === "succeeded" && completion.statusLabel === "completed_without_final_message");
}
function noFinalCompletionFallbackDelayMs(delays) {
	const first = delays[0] ?? 0;
	const second = delays[1] ?? 0;
	return Math.max(1, first + second);
}
function readSpawnParentThreadId(thread) {
	const source = isJsonObject(thread?.source) ? thread.source : void 0;
	const subAgent = isJsonObject(source?.subAgent) ? source.subAgent : void 0;
	return readString$2(isJsonObject(subAgent?.thread_spawn) ? subAgent.thread_spawn : void 0, "parent_thread_id")?.trim();
}
function readSpawnAgentPath(thread) {
	const source = isJsonObject(thread?.source) ? thread.source : void 0;
	const subAgent = isJsonObject(source?.subAgent) ? source.subAgent : void 0;
	return readString$2(isJsonObject(subAgent?.thread_spawn) ? subAgent.thread_spawn : void 0, "agent_path")?.trim();
}
function readString$2(record, key) {
	const value = record?.[key];
	return typeof value === "string" ? value : void 0;
}
function readStringArray(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => typeof entry === "string" && entry.trim() !== "");
}
function readObjectStringKeys(value) {
	if (!isJsonObject(value)) return [];
	return Object.keys(value).filter((entry) => entry.trim() !== "");
}
function normalizeToolName(value) {
	return value?.replace(/[^a-z0-9]/giu, "").toLowerCase();
}
async function findTranscriptCompletion(params) {
	const transcriptPath = params.transcriptPath ?? (params.allowTreeScan === false ? void 0 : await findTranscriptPath({
		codexHome: params.codexHome,
		childThreadId: params.childThreadId
	}));
	if (!transcriptPath) return;
	const completion = await readTranscriptCompletion(transcriptPath, params.childThreadId);
	return completion ? {
		transcriptPath,
		completion
	} : void 0;
}
async function findTranscriptPaths(params) {
	const sessionsDir = path.join(params.codexHome, "sessions");
	const found = /* @__PURE__ */ new Map();
	const remaining = new Set(params.childThreadIds);
	const stack = [sessionsDir];
	while (stack.length > 0 && remaining.size > 0) {
		const dir = stack.pop();
		let entries;
		try {
			entries = await fs$1.readdir(dir, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const entry of entries) {
			const entryPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				stack.push(entryPath);
				continue;
			}
			if (!entry.isFile() || !entry.name.endsWith(".jsonl")) continue;
			const rolloutMatch = entry.name.match(CODEX_ROLLOUT_FILENAME_RE);
			if (rolloutMatch) {
				const childThreadId = rolloutMatch[1];
				if (remaining.delete(childThreadId)) found.set(childThreadId, entryPath);
				continue;
			}
			for (const childThreadId of remaining) if (entry.name.includes(childThreadId)) {
				found.set(childThreadId, entryPath);
				remaining.delete(childThreadId);
				break;
			}
		}
	}
	return found;
}
async function findTranscriptPath(params) {
	const stack = [path.join(params.codexHome, "sessions")];
	while (stack.length > 0) {
		const dir = stack.pop();
		let entries;
		try {
			entries = await fs$1.readdir(dir, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const entry of entries) {
			const entryPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				stack.push(entryPath);
				continue;
			}
			const rolloutMatch = entry.name.match(CODEX_ROLLOUT_FILENAME_RE);
			if (entry.isFile() && entry.name.endsWith(".jsonl") && (rolloutMatch ? rolloutMatch[1] === params.childThreadId : entry.name.includes(params.childThreadId))) return entryPath;
		}
	}
}
async function readTranscriptCompletion(transcriptPath, childThreadId) {
	let contents;
	try {
		contents = await fs$1.readFile(transcriptPath, "utf8");
	} catch {
		return;
	}
	let parentThreadId;
	let completion;
	for (const line of contents.split(/\r?\n/u)) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		let entry;
		try {
			entry = JSON.parse(trimmed);
		} catch {
			continue;
		}
		if (!isJsonObject(entry)) continue;
		const payload = isJsonObject(entry.payload) ? entry.payload : void 0;
		if (!payload) continue;
		if (readString$2(entry, "type") === "session_meta") {
			parentThreadId = readTranscriptParentThreadId(payload) ?? parentThreadId;
			continue;
		}
		if (readString$2(entry, "type") !== "event_msg") continue;
		const payloadType = readString$2(payload, "type");
		if (payloadType === "task_complete") {
			const result = readString$2(payload, "last_agent_message")?.trim() || readString$2(payload, "message")?.trim();
			completion = {
				childThreadId,
				parentThreadId,
				status: "succeeded",
				statusLabel: result ? "task_complete" : "completed_without_final_message",
				result: result ?? "Codex native subagent completed without a final assistant message.",
				completedAt: secondsToMillis(readNumber(payload, "completed_at")) ?? readTimestamp(entry)
			};
		} else if (payloadType === "task_failed") {
			const result = readString$2(payload, "last_agent_message")?.trim() || readString$2(payload, "error")?.trim() || readString$2(payload, "message")?.trim() || "Codex native subagent failed.";
			completion = {
				childThreadId,
				parentThreadId,
				status: "failed",
				statusLabel: "task_failed",
				result,
				completedAt: readTimestamp(entry)
			};
		}
	}
	return completion;
}
function readTranscriptParentThreadId(payload) {
	const source = isJsonObject(payload.source) ? payload.source : void 0;
	const subagent = (isJsonObject(source?.subagent) ? source.subagent : void 0) ?? (isJsonObject(source?.subAgent) ? source.subAgent : void 0);
	return readString$2(isJsonObject(subagent?.thread_spawn) ? subagent.thread_spawn : void 0, "parent_thread_id")?.trim();
}
function readNumber(record, key) {
	return asFiniteNumber(record[key]);
}
function secondsToMillis(value) {
	return value === void 0 ? void 0 : Math.round(value * 1e3);
}
function readTimestamp(entry) {
	const timestamp = readString$2(entry, "timestamp");
	if (!timestamp) return;
	const parsed = Date.parse(timestamp);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function unrefTimer(timer) {
	if (typeof timer === "object" && timer && "unref" in timer) timer.unref();
}
//#endregion
//#region extensions/codex/src/app-server/startup-binding.ts
const CODEX_APP_SERVER_NATIVE_THREAD_FALLBACK_MAX_TOKENS = 3e5;
const CODEX_APP_SERVER_NATIVE_THREAD_DEFAULT_RESERVE_TOKENS = 2e4;
const CODEX_APP_SERVER_NATIVE_THREAD_MIN_PROMPT_BUDGET_TOKENS = 8e3;
const CODEX_APP_SERVER_NATIVE_THREAD_MIN_PROMPT_BUDGET_RATIO = .5;
const CODEX_APP_SERVER_BYTE_UNITS = {
	b: 1,
	k: 1024,
	kb: 1024,
	kib: 1024,
	m: 1024 * 1024,
	mb: 1024 * 1024,
	mib: 1024 * 1024,
	g: 1024 * 1024 * 1024,
	gb: 1024 * 1024 * 1024,
	gib: 1024 * 1024 * 1024,
	t: 1024 * 1024 * 1024 * 1024,
	tb: 1024 * 1024 * 1024 * 1024,
	tib: 1024 * 1024 * 1024 * 1024
};
const codexSessionRecordCache = /* @__PURE__ */ new Map();
function parseCodexAppServerByteLimit(value) {
	if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.floor(value);
	if (typeof value !== "string") return;
	const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*([a-z]+)?$/i);
	if (!match) return;
	const amount = Number(match[1]);
	if (!Number.isFinite(amount) || amount <= 0) return;
	const multiplier = CODEX_APP_SERVER_BYTE_UNITS[(match[2] ?? "b").toLowerCase()];
	if (multiplier === void 0) return;
	return Math.max(1, Math.round(amount * multiplier));
}
async function listCodexAppServerRolloutFilesForThread(agentDir, threadId, codexHome) {
	const resolvedAgentDir = path.resolve(agentDir);
	const resolvedCodexHome = codexHome?.trim() ? path.resolve(codexHome) : resolveCodexAppServerHomeDir(resolvedAgentDir);
	const roots = [
		path.join(resolvedCodexHome, "sessions"),
		path.join(resolveCodexAppServerHomeDir(resolvedAgentDir), "sessions"),
		path.join(resolvedAgentDir, "agent", "codex-home", "sessions"),
		path.join(path.dirname(resolvedAgentDir), "codex-home", "sessions")
	];
	const files = [];
	const visited = /* @__PURE__ */ new Set();
	for (const root of roots) {
		if (visited.has(root)) continue;
		visited.add(root);
		const stack = [root];
		while (stack.length > 0) {
			const dir = stack.pop();
			if (!dir) continue;
			let entries;
			try {
				entries = await fs$1.readdir(dir, { withFileTypes: true });
			} catch {
				continue;
			}
			for (const entry of entries) {
				const file = path.join(dir, entry.name);
				if (entry.isDirectory()) {
					stack.push(file);
					continue;
				}
				if (!entry.isFile() || !entry.name.endsWith(".jsonl") || !entry.name.includes(threadId)) continue;
				try {
					files.push({
						path: file,
						bytes: (await fs$1.stat(file)).size
					});
				} catch {}
			}
		}
	}
	return files;
}
async function readCodexSessionRecordForSessionFile(sessionFile) {
	const sessionsFile = path.join(path.dirname(sessionFile), "sessions.json");
	const resolvedSessionFile = path.resolve(sessionFile);
	let stat;
	try {
		stat = await fs$1.stat(sessionsFile);
	} catch {
		codexSessionRecordCache.delete(resolvedSessionFile);
		return;
	}
	const cached = codexSessionRecordCache.get(resolvedSessionFile);
	if (cached?.sessionsFile === sessionsFile && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) return cached.record;
	let store;
	try {
		store = JSON.parse(await fs$1.readFile(sessionsFile, "utf8"));
	} catch {
		codexSessionRecordCache.delete(resolvedSessionFile);
		return;
	}
	if (!isJsonObject(store)) {
		codexSessionRecordCache.delete(resolvedSessionFile);
		return;
	}
	let found;
	for (const [sessionKey, record] of Object.entries(store)) {
		if (!isJsonObject(record) || typeof record.sessionFile !== "string") continue;
		if (path.resolve(record.sessionFile) !== resolvedSessionFile) continue;
		found = {
			sessionKey,
			...record
		};
		break;
	}
	codexSessionRecordCache.set(resolvedSessionFile, {
		sessionsFile,
		mtimeMs: stat.mtimeMs,
		size: stat.size,
		record: found
	});
	return found;
}
async function readCodexAppServerRolloutTokenSnapshot(file) {
	let handle;
	try {
		handle = await fs$1.open(file, "r");
	} catch {
		return;
	}
	let snapshot;
	try {
		for await (const line of handle.readLines()) {
			const lineSnapshot = readCodexAppServerRolloutTokenSnapshotLine(line);
			if (lineSnapshot !== void 0) {
				snapshot ??= {};
				if (lineSnapshot.totalTokens !== void 0) snapshot.totalTokens = lineSnapshot.totalTokens;
				if (lineSnapshot.modelContextWindow !== void 0) snapshot.modelContextWindow = lineSnapshot.modelContextWindow;
			}
		}
	} finally {
		await handle.close();
	}
	return snapshot;
}
function readCodexAppServerRolloutTokenSnapshotLine(line) {
	if (!line.trim()) return;
	try {
		const parsed = JSON.parse(line);
		const payload = isJsonObject(parsed) ? parsed.payload : void 0;
		const info = isJsonObject(payload) && payload.type === "token_count" && isJsonObject(payload.info) ? payload.info : void 0;
		if (!info) return;
		const usage = isJsonObject(info.last_token_usage) ? info.last_token_usage : isJsonObject(info.total_token_usage) ? info.total_token_usage : void 0;
		const value = usage?.total_tokens ?? usage?.totalTokens;
		const totalTokens = typeof value === "number" && Number.isFinite(value) ? value : void 0;
		const windowValue = info.model_context_window ?? info.modelContextWindow;
		const modelContextWindow = typeof windowValue === "number" && Number.isFinite(windowValue) && windowValue > 0 ? Math.floor(windowValue) : void 0;
		const snapshot = {};
		if (totalTokens !== void 0) snapshot.totalTokens = totalTokens;
		if (modelContextWindow !== void 0) snapshot.modelContextWindow = modelContextWindow;
		return snapshot.totalTokens !== void 0 || snapshot.modelContextWindow !== void 0 ? snapshot : void 0;
	} catch {
		return;
	}
}
function toNonNegativeInt(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
	return Math.floor(value);
}
function readCompactionConfig(config) {
	return isJsonObject(config?.agents?.defaults?.compaction) ? config.agents.defaults.compaction : void 0;
}
function resolveCodexAppServerNativeThreadReserveTokens(config) {
	const compaction = readCompactionConfig(config);
	const reserveTokens = toNonNegativeInt(compaction?.reserveTokens);
	const reserveTokensFloor = toNonNegativeInt(compaction?.reserveTokensFloor);
	if (reserveTokens !== void 0) return Math.max(reserveTokens, reserveTokensFloor ?? CODEX_APP_SERVER_NATIVE_THREAD_DEFAULT_RESERVE_TOKENS);
	return reserveTokensFloor ?? CODEX_APP_SERVER_NATIVE_THREAD_DEFAULT_RESERVE_TOKENS;
}
function resolveCodexAppServerNativeThreadTokenFuse(params) {
	const projectedTurnTokens = typeof params.projectedTurnTokens === "number" && Number.isFinite(params.projectedTurnTokens) && params.projectedTurnTokens > 0 ? Math.floor(params.projectedTurnTokens) : 0;
	const contextWindow = params.modelContextWindow ?? CODEX_APP_SERVER_NATIVE_THREAD_FALLBACK_MAX_TOKENS;
	const minPromptBudget = Math.min(CODEX_APP_SERVER_NATIVE_THREAD_MIN_PROMPT_BUDGET_TOKENS, Math.max(1, Math.floor(contextWindow * CODEX_APP_SERVER_NATIVE_THREAD_MIN_PROMPT_BUDGET_RATIO)));
	const effectiveReserveTokens = Math.min(params.reserveTokens, Math.max(0, contextWindow - minPromptBudget));
	return Math.max(1, contextWindow - effectiveReserveTokens - projectedTurnTokens);
}
function maxFiniteNumber(values) {
	const nums = values.filter((value) => typeof value === "number" && Number.isFinite(value));
	if (nums.length === 0) return;
	return Math.max(...nums);
}
function minFiniteNumber(values) {
	const nums = values.filter((value) => typeof value === "number" && Number.isFinite(value));
	if (nums.length === 0) return;
	return Math.min(...nums);
}
function hasContextEngineThreadBootstrapProjection(binding) {
	return binding.contextEngine?.projection?.mode === "thread_bootstrap";
}
/** Clears and drops a binding when the native Codex thread is too large to resume safely. */
async function rotateOversizedCodexAppServerStartupBinding(params) {
	const binding = params.binding;
	if (!binding?.threadId) return binding;
	const sessionRecord = await readCodexSessionRecordForSessionFile(params.sessionFile);
	const rolloutFiles = await listCodexAppServerRolloutFilesForThread(params.agentDir, binding.threadId, params.codexHome);
	const compaction = readCompactionConfig(params.config);
	const shouldDeferByteGuard = compaction?.truncateAfterCompaction === true && params.contextEngineActive === true && hasContextEngineThreadBootstrapProjection(binding);
	if (compaction?.truncateAfterCompaction === true && !shouldDeferByteGuard) {
		const maxBytes = parseCodexAppServerByteLimit(compaction.maxActiveTranscriptBytes);
		if (maxBytes !== void 0) {
			const oversizedFiles = rolloutFiles.filter((file) => file.bytes >= maxBytes);
			if (oversizedFiles.length > 0) {
				log.warn("codex app-server native transcript exceeded active byte limit; starting a fresh thread", {
					threadId: binding.threadId,
					maxBytes,
					files: oversizedFiles.map((file) => ({
						path: file.path,
						bytes: file.bytes
					}))
				});
				await clearCodexAppServerBinding(params.sessionFile);
				return;
			}
		}
	}
	const nativeTokenSnapshots = await Promise.all(rolloutFiles.map(async (file) => readCodexAppServerRolloutTokenSnapshot(file.path)));
	const nativeTokens = maxFiniteNumber(nativeTokenSnapshots.map((snapshot) => snapshot?.totalTokens));
	const nativeModelContextWindow = maxFiniteNumber(nativeTokenSnapshots.map((snapshot) => snapshot?.modelContextWindow));
	const sessionModelContextWindow = typeof sessionRecord?.contextTokens === "number" && Number.isFinite(sessionRecord.contextTokens) && sessionRecord.contextTokens > 0 ? Math.floor(sessionRecord.contextTokens) : void 0;
	const reserveTokens = resolveCodexAppServerNativeThreadReserveTokens(params.config);
	const maxTokens = resolveCodexAppServerNativeThreadTokenFuse({
		modelContextWindow: minFiniteNumber([nativeModelContextWindow, sessionModelContextWindow]),
		reserveTokens,
		projectedTurnTokens: params.projectedTurnTokens
	});
	const sessionTokens = sessionRecord?.totalTokensFresh !== false && typeof sessionRecord?.totalTokens === "number" && Number.isFinite(sessionRecord.totalTokens) ? sessionRecord.totalTokens : void 0;
	const tokenCount = maxFiniteNumber([sessionTokens, nativeTokens]);
	if (tokenCount !== void 0 && tokenCount >= maxTokens) {
		log.warn("codex app-server native transcript exceeded active token limit; starting a fresh thread", {
			threadId: binding.threadId,
			maxTokens,
			sessionKey: sessionRecord?.sessionKey,
			sessionTokens,
			nativeTokens,
			nativeModelContextWindow,
			sessionModelContextWindow,
			reserveTokens,
			projectedTurnTokens: params.projectedTurnTokens
		});
		await clearCodexAppServerBinding(params.sessionFile);
		return;
	}
	if (compaction?.truncateAfterCompaction !== true) return binding;
	if (shouldDeferByteGuard) {
		log.debug("codex app-server deferring native transcript byte guard for context-engine thread bootstrap", {
			threadId: binding.threadId,
			engineId: binding.contextEngine?.engineId,
			epoch: binding.contextEngine?.projection?.epoch,
			fingerprint: binding.contextEngine?.projection?.fingerprint
		});
		return binding;
	}
	return binding;
}
//#endregion
//#region extensions/codex/src/app-server/trajectory.ts
/**
* Records optional Codex runtime trajectory sidecars with bounded, redacted
* context and completion events.
*/
const SENSITIVE_FIELD_RE = /(?:authorization|cookie|credential|key|password|passwd|secret|token)/iu;
const PRIVATE_PAYLOAD_FIELD_RE = /(?:image|screenshot|attachment|fileData|dataUri)/iu;
const AUTHORIZATION_VALUE_RE = /\b(Bearer|Basic)\s+[A-Za-z0-9+/._~=-]{8,}/giu;
const JWT_VALUE_RE = /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/gu;
const COOKIE_PAIR_RE = /\b([A-Za-z][A-Za-z0-9_.-]{1,64})=([A-Za-z0-9+/._~%=-]{16,})(?=;|\s|$)/gu;
const TRAJECTORY_RUNTIME_FILE_MAX_BYTES = 50 * 1024 * 1024;
const TRAJECTORY_RUNTIME_EVENT_MAX_BYTES = 256 * 1024;
/** Resolves secure create/truncate flags for trajectory pointer files. */
function resolveCodexTrajectoryPointerFlags(constants = fs.constants) {
	const noFollow = constants.O_NOFOLLOW;
	return constants.O_CREAT | constants.O_TRUNC | constants.O_WRONLY | (typeof noFollow === "number" ? noFollow : 0);
}
async function safeAppendTrajectoryFile(filePath, line) {
	await appendRegularFile({
		filePath,
		content: line,
		maxFileBytes: TRAJECTORY_RUNTIME_FILE_MAX_BYTES,
		rejectSymlinkParents: true
	});
}
function boundedTrajectoryLine(event) {
	const line = JSON.stringify(event);
	const bytes = Buffer.byteLength(line, "utf8");
	if (bytes <= TRAJECTORY_RUNTIME_EVENT_MAX_BYTES) return `${line}\n`;
	const truncated = JSON.stringify({
		...event,
		data: {
			truncated: true,
			originalBytes: bytes,
			limitBytes: TRAJECTORY_RUNTIME_EVENT_MAX_BYTES,
			reason: "trajectory-event-size-limit"
		}
	});
	if (Buffer.byteLength(truncated, "utf8") <= TRAJECTORY_RUNTIME_EVENT_MAX_BYTES) return `${truncated}\n`;
}
function resolveTrajectoryPointerFilePath(sessionFile) {
	return sessionFile.endsWith(".jsonl") ? `${sessionFile.slice(0, -6)}.trajectory-path.json` : `${sessionFile}.trajectory-path.json`;
}
function writeTrajectoryPointerBestEffort(params) {
	const pointerPath = resolveTrajectoryPointerFilePath(params.sessionFile);
	try {
		const pointerDir = path.resolve(path.dirname(pointerPath));
		if (fs.lstatSync(pointerDir).isSymbolicLink()) return;
		try {
			if (fs.lstatSync(pointerPath).isSymbolicLink()) return;
		} catch (error) {
			if (error.code !== "ENOENT") return;
		}
		const fd = fs.openSync(pointerPath, resolveCodexTrajectoryPointerFlags(), 384);
		try {
			fs.writeFileSync(fd, `${JSON.stringify({
				traceSchema: "openclaw-trajectory-pointer",
				schemaVersion: 1,
				sessionId: params.sessionId,
				runtimeFile: params.filePath
			}, null, 2)}\n`, "utf8");
			fs.fchmodSync(fd, 384);
		} finally {
			fs.closeSync(fd);
		}
	} catch {}
}
/** Creates a trajectory recorder when trajectory capture is enabled for the environment. */
function createCodexTrajectoryRecorder(params) {
	const env = params.env ?? process.env;
	if (!parseTrajectoryEnabled(env)) return null;
	const filePath = resolveTrajectoryFilePath({
		env,
		sessionFile: params.attempt.sessionFile,
		sessionId: params.attempt.sessionId
	});
	const ready = fs$1.mkdir(path.dirname(filePath), {
		recursive: true,
		mode: 448
	}).catch(() => void 0);
	writeTrajectoryPointerBestEffort({
		filePath,
		sessionFile: params.attempt.sessionFile,
		sessionId: params.attempt.sessionId
	});
	let queue = Promise.resolve();
	let seq = 0;
	const attribution = resolveCodexLocalRuntimeAttribution(params.attempt);
	return {
		filePath,
		recordEvent: (type, data) => {
			const line = boundedTrajectoryLine({
				traceSchema: "openclaw-trajectory",
				schemaVersion: 1,
				traceId: params.attempt.sessionId,
				source: "runtime",
				type,
				ts: (/* @__PURE__ */ new Date()).toISOString(),
				seq: seq += 1,
				sourceSeq: seq,
				sessionId: params.attempt.sessionId,
				sessionKey: params.attempt.sessionKey,
				runId: params.attempt.runId,
				workspaceDir: params.cwd,
				provider: attribution.provider,
				modelId: params.attempt.modelId,
				modelApi: attribution.api,
				data: data ? sanitizeValue(data) : void 0
			});
			if (!line) return;
			queue = queue.then(() => ready).then(() => safeAppendTrajectoryFile(filePath, line)).catch(() => void 0);
		},
		flush: async () => {
			await queue;
		}
	};
}
/** Records compiled prompt/tool context at the start of a Codex runtime attempt. */
function recordCodexTrajectoryContext(recorder, params) {
	if (!recorder) return;
	recorder.recordEvent("context.compiled", {
		systemPrompt: params.developerInstructions,
		prompt: params.prompt ?? params.attempt.prompt,
		imagesCount: params.attempt.images?.length ?? 0,
		tools: toTrajectoryToolDefinitions(params.tools)
	});
}
/** Records final Codex model completion metadata and assistant snapshots. */
function recordCodexTrajectoryCompletion(recorder, params) {
	if (!recorder) return;
	recorder.recordEvent("model.completed", {
		threadId: params.threadId,
		turnId: params.turnId,
		timedOut: params.timedOut,
		yieldDetected: params.yieldDetected ?? false,
		aborted: params.result.aborted,
		promptError: normalizeCodexTrajectoryError(params.result.promptError),
		usage: params.result.attemptUsage,
		assistantTexts: params.result.assistantTexts,
		messagesSnapshot: params.result.messagesSnapshot
	});
}
function parseTrajectoryEnabled(env) {
	const value = env.OPENCLAW_TRAJECTORY?.trim().toLowerCase();
	if (value === "1" || value === "true" || value === "yes" || value === "on") return true;
	if (value === "0" || value === "false" || value === "no" || value === "off") return false;
	return true;
}
function resolveTrajectoryFilePath(params) {
	const dirOverride = params.env.OPENCLAW_TRAJECTORY_DIR?.trim();
	if (dirOverride) return resolveContainedPath(resolveUserPath(dirOverride), `${safeTrajectorySessionFileName(params.sessionId)}.jsonl`);
	return params.sessionFile.endsWith(".jsonl") ? `${params.sessionFile.slice(0, -6)}.trajectory.jsonl` : `${params.sessionFile}.trajectory.jsonl`;
}
function safeTrajectorySessionFileName(sessionId) {
	const safe = sessionId.replaceAll(/[^A-Za-z0-9_-]/g, "_").slice(0, 120);
	return /[A-Za-z0-9]/u.test(safe) ? safe : "session";
}
function resolveContainedPath(baseDir, fileName) {
	const resolvedBase = path.resolve(baseDir);
	const resolvedFile = path.resolve(resolvedBase, fileName);
	const relative = path.relative(resolvedBase, resolvedFile);
	if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Trajectory file path escaped its configured directory");
	return resolvedFile;
}
function toTrajectoryToolDefinitions(tools) {
	if (!tools || tools.length === 0) return;
	return flattenCodexDynamicToolFunctions(tools).flatMap((tool) => {
		const name = tool.name?.trim();
		if (!name) return [];
		return [{
			name,
			description: tool.description,
			parameters: sanitizeValue(tool.inputSchema)
		}];
	}).toSorted((left, right) => left.name.localeCompare(right.name));
}
function sanitizeValue(value, depth = 0, key = "") {
	if (value == null || typeof value === "boolean" || typeof value === "number") return value;
	if (typeof value === "string") {
		if (SENSITIVE_FIELD_RE.test(key)) return "<redacted>";
		if (value.startsWith("data:") && value.length > 256) return `<redacted data-uri ${value.slice(0, value.indexOf(",")).length} chars>`;
		if (PRIVATE_PAYLOAD_FIELD_RE.test(key) && value.length > 256) return "<redacted payload>";
		const redacted = redactSensitiveString(value);
		return redacted.length > 2e4 ? `${redacted.slice(0, 2e4)}…` : redacted;
	}
	if (depth >= 6) return "<truncated>";
	if (Array.isArray(value)) return value.slice(0, 100).map((entry) => sanitizeValue(entry, depth + 1, key));
	if (typeof value === "object") {
		const next = {};
		for (const [keyLocal, child] of Object.entries(value).slice(0, 100)) next[keyLocal] = sanitizeValue(child, depth + 1, keyLocal);
		return next;
	}
	return JSON.stringify(value);
}
function redactSensitiveString(value) {
	return value.replace(AUTHORIZATION_VALUE_RE, "$1 <redacted>").replace(JWT_VALUE_RE, "<redacted-jwt>").replace(COOKIE_PAIR_RE, "$1=<redacted>");
}
/** Converts arbitrary prompt errors into trajectory-safe text. */
function normalizeCodexTrajectoryError(value) {
	if (!value) return null;
	if (value instanceof Error) return value.message;
	if (typeof value === "string") return value;
	try {
		return JSON.stringify(value);
	} catch {
		return "Unknown error";
	}
}
//#endregion
//#region extensions/codex/src/app-server/usage-limit-error.ts
/**
* Enriches Codex usage-limit failures with current rate-limit information and
* marks blocked auth profiles when Codex exposes a reset time.
*/
const CODEX_USAGE_LIMIT_RATE_LIMIT_REFRESH_TIMEOUT_MS = 5e3;
/** Marks a Codex auth profile blocked until the reset time advertised by rate limits. */
async function markCodexAuthProfileBlockedFromRateLimits(params) {
	const authProfileId = params.authProfileId?.trim();
	if (!authProfileId || !params.params.authProfileStore) return;
	const blockedUntil = resolveCodexUsageLimitResetAtMs(params.rateLimits);
	if (!blockedUntil) return;
	try {
		await markAuthProfileBlockedUntil({
			store: params.params.authProfileStore,
			profileId: authProfileId,
			blockedUntil,
			source: "codex_rate_limits",
			agentDir: params.params.agentDir,
			runId: params.params.runId,
			modelId: params.params.modelId
		});
	} catch (error) {
		log.debug("failed to mark Codex auth profile blocked from app-server limits", {
			authProfileId,
			error: formatErrorMessage(error)
		});
	}
}
/** Formats a turn-start usage-limit error, refreshing rate limits when needed. */
async function formatCodexTurnStartUsageLimitError(params) {
	return refreshCodexUsageLimitError({
		client: params.client,
		source: readCodexTurnStartUsageLimitErrorSource(params.error, params.pendingNotifications),
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
}
/** Refreshes a generic prompt usage-limit message into a reset-aware message. */
async function refreshCodexUsageLimitPromptError(params) {
	if (!shouldRefreshCodexRateLimitsForUsageLimitMessage(params.message)) return;
	return (await refreshCodexUsageLimitError({
		client: params.client,
		source: {
			message: params.message,
			codexErrorInfo: "usageLimitExceeded",
			rateLimits: readRecentCodexRateLimits()
		},
		timeoutMs: params.timeoutMs,
		signal: params.signal
	}))?.message;
}
async function refreshCodexUsageLimitError(params) {
	const initialMessage = formatCodexUsageLimitErrorMessage(params.source);
	if (!shouldRefreshCodexRateLimitsForUsageLimitMessage(initialMessage)) return initialMessage ? {
		message: initialMessage,
		...params.source.rateLimitsTrustedForProfile ? { rateLimitsForProfile: params.source.rateLimits } : {}
	} : void 0;
	const rateLimits = await readCodexRateLimitsFromAppServerForUsageLimitError({
		client: params.client,
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
	if (!rateLimits) return initialMessage ? {
		message: initialMessage,
		...params.source.rateLimitsTrustedForProfile ? { rateLimitsForProfile: params.source.rateLimits } : {}
	} : void 0;
	const message = formatCodexUsageLimitErrorMessage({
		message: params.source.message,
		codexErrorInfo: params.source.codexErrorInfo,
		rateLimits
	}) ?? initialMessage;
	return message ? {
		message,
		rateLimitsForProfile: rateLimits
	} : void 0;
}
async function readCodexRateLimitsFromAppServerForUsageLimitError(params) {
	if (params.signal?.aborted) return;
	try {
		const rateLimits = await params.client.request(CODEX_CONTROL_METHODS.rateLimits, void 0, {
			timeoutMs: resolveCodexUsageLimitRateLimitRefreshTimeoutMs(params.timeoutMs),
			signal: params.signal
		});
		rememberCodexRateLimits(rateLimits);
		return rateLimits;
	} catch (error) {
		log.debug("codex app-server rate-limit refresh failed after usage-limit error", { error: formatErrorMessage(error) });
		return;
	}
}
function resolveCodexUsageLimitRateLimitRefreshTimeoutMs(timeoutMs) {
	if (timeoutMs === void 0 || !Number.isFinite(timeoutMs) || timeoutMs <= 0) return CODEX_USAGE_LIMIT_RATE_LIMIT_REFRESH_TIMEOUT_MS;
	return Math.max(100, Math.min(timeoutMs, CODEX_USAGE_LIMIT_RATE_LIMIT_REFRESH_TIMEOUT_MS));
}
function readCodexTurnStartUsageLimitErrorSource(error, pendingNotifications) {
	const notificationError = readLatestCodexErrorNotification(pendingNotifications);
	const notificationRateLimits = readLatestRateLimitNotificationPayload(pendingNotifications);
	const errorPayload = readCodexErrorPayload(error);
	const rateLimits = notificationRateLimits ?? errorPayload.rateLimits ?? readRecentCodexRateLimits();
	return {
		message: notificationError?.message ?? errorPayload.message ?? formatErrorMessage(error),
		codexErrorInfo: notificationError?.codexErrorInfo ?? errorPayload.codexErrorInfo,
		rateLimits,
		rateLimitsTrustedForProfile: notificationRateLimits !== void 0 || errorPayload.rateLimits !== void 0
	};
}
function readLatestRateLimitNotificationPayload(notifications) {
	for (let index = notifications.length - 1; index >= 0; index -= 1) {
		const notification = notifications[index];
		if (notification?.method === "account/rateLimits/updated") {
			rememberCodexRateLimits(notification.params);
			return notification.params;
		}
	}
}
function readLatestCodexErrorNotification(notifications) {
	for (let index = notifications.length - 1; index >= 0; index -= 1) {
		const notification = notifications[index];
		if (notification?.method !== "error" || !isJsonObject(notification.params)) continue;
		const error = notification.params.error;
		if (!isJsonObject(error)) continue;
		return {
			message: readString$1(error, "message"),
			codexErrorInfo: error.codexErrorInfo
		};
	}
}
function readCodexErrorPayload(error) {
	const message = error instanceof Error ? error.message : void 0;
	if (!error || typeof error !== "object" || !("data" in error)) return { message };
	const data = error.data;
	if (!isJsonObject(data)) return { message };
	const nestedError = isJsonObject(data.error) ? data.error : data;
	const rateLimits = nestedError.rateLimits ?? data.rateLimits;
	if (rateLimits !== void 0) rememberCodexRateLimits(rateLimits);
	return {
		message: readString$1(nestedError, "message") ?? message,
		codexErrorInfo: nestedError.codexErrorInfo,
		rateLimits
	};
}
function readString$1(record, key) {
	const value = record[key];
	return typeof value === "string" ? value : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/user-input-bridge.ts
/**
* Bridges Codex item/tool user-input requests to OpenClaw messaging prompts and
* turns replies into app-server answer payloads.
*/
/** Creates a per-turn bridge for pending Codex user-input requests. */
function createCodexUserInputBridge(params) {
	let pending;
	const resolvePending = (value) => {
		const current = pending;
		if (!current) return;
		pending = void 0;
		current.cleanup();
		current.resolve(value);
	};
	return {
		async handleRequest(request) {
			const requestParams = readUserInputParams(request.params);
			if (!requestParams) return;
			if (requestParams.threadId !== params.threadId || requestParams.turnId !== params.turnId) return;
			if (requestParams.questions.length === 0) return emptyUserInputResponse();
			resolvePending(emptyUserInputResponse());
			return new Promise((resolve) => {
				const abortListener = () => resolvePending(emptyUserInputResponse());
				const cleanup = () => params.signal?.removeEventListener("abort", abortListener);
				pending = {
					requestId: request.id,
					threadId: requestParams.threadId,
					turnId: requestParams.turnId,
					itemId: requestParams.itemId,
					questions: requestParams.questions,
					resolve,
					cleanup
				};
				params.signal?.addEventListener("abort", abortListener, { once: true });
				if (params.signal?.aborted) {
					resolvePending(emptyUserInputResponse());
					return;
				}
				deliverUserInputPrompt(params.paramsForRun, requestParams.questions).catch((error) => {
					log.warn("failed to deliver codex user input prompt", { error });
				});
			});
		},
		handleQueuedMessage(text) {
			const current = pending;
			if (!current) return false;
			resolvePending(buildUserInputResponse(current.questions, text));
			return true;
		},
		handleNotification(notification) {
			if (notification.method !== "serverRequest/resolved" || !pending) return;
			const notificationParams = isJsonObject(notification.params) ? notification.params : void 0;
			const requestId = notificationParams ? readRequestId(notificationParams) : void 0;
			if (notificationParams && readString(notificationParams, "threadId") === pending.threadId && requestId !== void 0 && String(requestId) === String(pending.requestId)) resolvePending(emptyUserInputResponse());
		},
		cancelPending() {
			resolvePending(emptyUserInputResponse());
		}
	};
}
function readUserInputParams(value) {
	if (!isJsonObject(value)) return;
	const threadId = readString(value, "threadId");
	const turnId = readString(value, "turnId");
	const itemId = readString(value, "itemId");
	const questionsRaw = value.questions;
	if (!threadId || !turnId || !itemId || !Array.isArray(questionsRaw)) return;
	return {
		threadId,
		turnId,
		itemId,
		questions: questionsRaw.map(readQuestion).filter((question) => Boolean(question))
	};
}
function readQuestion(value) {
	if (!isJsonObject(value)) return;
	const id = readString(value, "id");
	const header = readString(value, "header");
	const question = readString(value, "question");
	if (!id || !header || !question) return;
	return {
		id,
		header,
		question,
		isOther: value.isOther === true,
		isSecret: value.isSecret === true,
		options: readOptions(value.options)
	};
}
function readOptions(value) {
	if (!Array.isArray(value)) return null;
	const options = value.map(readOption).filter((option) => Boolean(option));
	return options.length > 0 ? options : null;
}
function readOption(value) {
	if (!isJsonObject(value)) return;
	const label = readString(value, "label");
	const description = readString(value, "description") ?? "";
	return label ? {
		label,
		description
	} : void 0;
}
async function deliverUserInputPrompt(params, questions) {
	await deliverAgentHarnessUserInputPrompt(params, questions, {
		formatText: formatCodexDisplayText,
		intro: "Codex needs input:"
	});
}
function buildUserInputResponse(questions, inputText) {
	return buildAgentHarnessUserInputAnswers(questions, inputText);
}
function emptyUserInputResponse() {
	return emptyAgentHarnessUserInputAnswers();
}
function readString(record, key) {
	const value = record[key];
	return typeof value === "string" ? value : void 0;
}
function readRequestId(record) {
	const value = record.requestId;
	return typeof value === "string" || typeof value === "number" ? value : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt.ts
const CODEX_NATIVE_HOOK_RELAY_RENEW_INTERVAL_MS = 6e4;
const CODEX_APP_SERVER_PROJECTED_CHARS_PER_TOKEN = 4;
const CODEX_APP_SERVER_ACTIVE_NATIVE_TURN_WAIT_TIMEOUT_MS = 3e4;
const ensuredCodexWorkspaceDirs = /* @__PURE__ */ new Set();
function withCodexAppServerFastModeServiceTier(appServer, params) {
	const fastMode = typeof params.fastMode === "function" ? params.fastMode() : params.fastMode;
	const serviceTier = fastMode === void 0 ? appServer.serviceTier : fastMode ? "priority" : void 0;
	if (serviceTier === appServer.serviceTier) return appServer;
	if (serviceTier) return {
		...appServer,
		serviceTier
	};
	return {
		...appServer,
		serviceTier: null
	};
}
function estimateCodexAppServerProjectedTurnTokens(params) {
	const inputChars = params.prompt.length + (params.developerInstructions?.length ?? 0);
	return Math.max(1, Math.ceil(inputChars / CODEX_APP_SERVER_PROJECTED_CHARS_PER_TOKEN));
}
async function ensureCodexWorkspaceDirOnce(workspaceDir) {
	const normalized = path.resolve(workspaceDir);
	if (ensuredCodexWorkspaceDirs.has(normalized)) {
		try {
			if ((await fs$1.stat(normalized)).isDirectory()) return;
		} catch (error) {
			if ((typeof error === "object" && error ? error.code : void 0) !== "ENOENT") throw error;
		}
		ensuredCodexWorkspaceDirs.delete(normalized);
	}
	await fs$1.mkdir(normalized, { recursive: true });
	ensuredCodexWorkspaceDirs.add(normalized);
}
async function emitCodexAppServerEvent(params, event) {
	try {
		emitAgentEvent({
			runId: params.runId,
			stream: event.stream,
			data: event.data,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {}
		});
	} catch (error) {
		log.debug("codex app-server global agent event emit failed", { error });
	}
	try {
		await params.onAgentEvent?.(event);
	} catch (error) {
		log.debug("codex app-server agent event handler threw", { error });
	}
}
function toTranscriptToolResult(response) {
	const sanitized = sanitizeCodexToolResponse(response);
	const contentItems = Array.isArray(sanitized.contentItems) ? sanitized.contentItems : [];
	const result = {
		...sanitized,
		content: contentItems.map(toTranscriptToolResultContentItem)
	};
	delete result.contentItems;
	delete result.success;
	return result;
}
function toTranscriptToolResultContentItem(item) {
	if (!item || typeof item !== "object") return {
		type: "text",
		text: ""
	};
	const record = item;
	if (record.type === "inputText") return {
		type: "text",
		text: typeof record.text === "string" ? record.text : ""
	};
	if (record.type === "inputImage") return typeof record.imageUrl === "string" ? {
		type: "image",
		url: record.imageUrl
	} : {
		type: "text",
		text: formatUnsupportedCodexDynamicToolOutput(record.type)
	};
	return {
		type: "text",
		text: formatUnsupportedCodexDynamicToolOutput(record.type)
	};
}
function formatUnsupportedCodexDynamicToolOutput(type) {
	const rawType = typeof type === "string" ? type.replace(/\s+/g, " ").trim() : "";
	return `[Unsupported Codex dynamic tool output: ${rawType ? rawType.slice(0, 80) : "unknown"}${rawType.length > 80 ? "..." : ""}]`;
}
function shouldAwaitCodexAgentEndHook(params) {
	return !params.messageChannel && !params.messageProvider;
}
async function runCodexAgentEndHook(params, hookParams) {
	const sideEffectParams = {
		...hookParams,
		ctx: {
			...hookParams.ctx,
			config: params.config
		}
	};
	if (shouldAwaitCodexAgentEndHook(params)) {
		await awaitAgentEndSideEffects(sideEffectParams);
		return;
	}
	runAgentEndSideEffects(sideEffectParams);
}
async function runCodexAppServerAttempt(params, options = {}) {
	const attemptStartedAt = Date.now();
	const profilerEnabled = isCodexAppServerProfilerEnabled(params.config);
	const codexModelCallTrace = freezeDiagnosticTraceContext(createDiagnosticTraceContextFromActiveScope());
	const codexModelContentCapture = resolveDiagnosticModelContentCapturePolicy(params.config);
	const codexModelCallId = `${params.runId}:codex-model:1`;
	const fastModeAutoStartedAtMs = typeof params.fastModeStartedAtMs === "number" && Number.isFinite(params.fastModeStartedAtMs) ? params.fastModeStartedAtMs : void 0;
	const fastModeAutoProgressState = params.fastModeAutoProgressState ?? {
		offAnnounced: false,
		resetAnnounced: false
	};
	const preDynamicStartupStages = createCodexDynamicToolBuildStageTracker({ enabled: profilerEnabled });
	const attemptClientFactory = options.clientFactory ?? defaultLeasedCodexAppServerClientFactory;
	const pluginConfig = readCodexPluginConfig(options.pluginConfig);
	const computerUseConfig = resolveCodexComputerUseConfig({ pluginConfig });
	const { sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	const beforeToolCallPolicy = getBeforeToolCallPolicyDiagnosticState();
	preDynamicStartupStages.mark("config");
	const resolvedWorkspace = resolveUserPath(params.workspaceDir);
	await ensureCodexWorkspaceDirOnce(resolvedWorkspace);
	preDynamicStartupStages.mark("workspace");
	const sandboxSessionKey = params.sandboxSessionKey?.trim() || params.sessionKey?.trim() || params.sessionId;
	const contextSessionKey = params.sessionKey?.trim() || sandboxSessionKey;
	const sandbox = await resolveSandboxContext({
		config: params.config,
		sessionKey: sandboxSessionKey,
		workspaceDir: resolvedWorkspace
	});
	preDynamicStartupStages.mark("sandbox");
	const execPolicy = resolveOpenClawExecPolicyForCodexAppServer({
		execOverrides: params.execOverrides,
		approvals: loadExecApprovals(),
		config: params.config,
		agentId: sessionAgentId
	});
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, sessionAgentId);
	preDynamicStartupStages.mark("session-agent");
	const activeContextEngine = isActiveHarnessContextEngine(params.contextEngine) ? params.contextEngine : void 0;
	const isInactiveThreadBootstrapBinding = (binding) => !activeContextEngine && binding?.contextEngine?.projection?.mode === "thread_bootstrap";
	let startupBinding = await readCodexAppServerBinding(params.sessionFile);
	preDynamicStartupStages.mark("read-binding");
	const startupBindingAuthProfileId = startupBinding?.authProfileId;
	const initialStartupBindingHadInactiveThreadBootstrap = isInactiveThreadBootstrapBinding(startupBinding);
	const startupAuthProfileCandidate = params.runtimePlan?.auth.forwardedAuthProfileId ?? params.authProfileId ?? startupBinding?.authProfileId ?? startupBindingAuthProfileId;
	const startupAuthProfileId = params.authProfileStore ? resolveCodexAppServerAuthProfileId({
		authProfileId: startupAuthProfileCandidate,
		store: params.authProfileStore,
		config: params.config
	}) : resolveCodexAppServerAuthProfileIdForAgent({
		authProfileId: startupAuthProfileCandidate,
		agentDir,
		config: params.config
	});
	let reviewerPolicyContext = resolveCodexModelBackedReviewerPolicyContext({
		provider: params.provider,
		model: params.modelId,
		bindingModelProvider: startupBinding?.modelProvider,
		bindingModel: startupBinding?.model,
		nativeAuthProfile: isCodexAppServerNativeAuthProfile({
			authProfileId: startupAuthProfileId,
			authProfileStore: params.authProfileStore,
			agentDir,
			config: params.config
		})
	});
	preDynamicStartupStages.mark("auth-profile");
	let configuredAppServer = resolveCodexAppServerRuntimeOptions({
		pluginConfig,
		execPolicy,
		modelProvider: reviewerPolicyContext.modelProvider,
		model: reviewerPolicyContext.model,
		config: params.config,
		agentDir,
		openClawSandboxActive: sandbox?.enabled === true
	});
	const effectiveWorkspace = sandbox?.enabled ? sandbox.workspaceAccess === "rw" ? resolvedWorkspace : sandbox.workspaceDir : resolvedWorkspace;
	const requestedCwd = params.cwd ? resolveUserPath(params.cwd) : void 0;
	if (sandbox?.enabled && requestedCwd && requestedCwd !== resolvedWorkspace) throw new Error("cwd override is not supported for sandboxed Codex app-server runs; omit cwd or use the agent workspace as cwd");
	const effectiveCwd = sandbox?.enabled ? effectiveWorkspace : requestedCwd ?? effectiveWorkspace;
	await ensureCodexWorkspaceDirOnce(effectiveWorkspace);
	preDynamicStartupStages.mark("effective-workspace");
	let policyAppServer = resolveCodexAppServerForOpenClawToolPolicy({
		appServer: configuredAppServer,
		pluginConfig,
		env: process.env,
		shouldPromote: beforeToolCallPolicy.hasBeforeToolCallHook || beforeToolCallPolicy.trustedToolPolicies.length > 0,
		execPolicy,
		canUseUntrustedApprovalPolicy: configuredAppServer.start.transport !== "stdio" || isCodexAppServerApprovalPolicyAllowedByRequirements("untrusted")
	});
	let appServer = resolveCodexAppServerForModelProvider({
		appServer: policyAppServer,
		provider: reviewerPolicyContext.modelProvider,
		model: reviewerPolicyContext.model,
		config: params.config,
		env: process.env,
		agentDir
	});
	if (configuredAppServer.approvalPolicy === "never" && appServer.approvalPolicy === "untrusted") log.info("codex app-server approval policy promoted for OpenClaw tool policy", {
		from: "never",
		to: "untrusted",
		beforeToolCallHook: beforeToolCallPolicy.hasBeforeToolCallHook,
		trustedToolPolicies: beforeToolCallPolicy.trustedToolPolicies
	});
	preDynamicStartupStages.mark("app-server-policy");
	let pluginAppServer = appServer;
	let nativeHookRelayEvents = resolveCodexNativeHookRelayEvents({
		configuredEvents: options.nativeHookRelay?.events,
		appServer
	});
	preDynamicStartupStages.mark("native-hook-relay");
	const runAbortController = new AbortController();
	const abortFromUpstream = () => {
		runAbortController.abort(params.abortSignal?.reason ?? "upstream_abort");
	};
	if (params.abortSignal?.aborted) abortFromUpstream();
	else params.abortSignal?.addEventListener("abort", abortFromUpstream, { once: true });
	startupBinding = await rotateOversizedCodexAppServerStartupBinding({
		binding: startupBinding,
		sessionFile: params.sessionFile,
		agentDir,
		codexHome: appServer.start.env?.CODEX_HOME,
		config: params.config,
		contextEngineActive: Boolean(activeContextEngine)
	});
	const initialInactiveThreadBootstrapBindingForcedFreshStart = initialStartupBindingHadInactiveThreadBootstrap && !startupBinding?.threadId;
	preDynamicStartupStages.mark("rotate-binding");
	reviewerPolicyContext = resolveCodexModelBackedReviewerPolicyContext({
		provider: params.provider,
		model: params.modelId,
		bindingModelProvider: startupBinding?.modelProvider,
		bindingModel: startupBinding?.model,
		nativeAuthProfile: isCodexAppServerNativeAuthProfile({
			authProfileId: startupAuthProfileId,
			authProfileStore: params.authProfileStore,
			agentDir,
			config: params.config
		})
	});
	configuredAppServer = resolveCodexAppServerRuntimeOptions({
		pluginConfig,
		execPolicy,
		modelProvider: reviewerPolicyContext.modelProvider,
		model: reviewerPolicyContext.model,
		config: params.config,
		agentDir,
		openClawSandboxActive: sandbox?.enabled === true
	});
	policyAppServer = resolveCodexAppServerForOpenClawToolPolicy({
		appServer: configuredAppServer,
		pluginConfig,
		env: process.env,
		shouldPromote: beforeToolCallPolicy.hasBeforeToolCallHook || beforeToolCallPolicy.trustedToolPolicies.length > 0,
		execPolicy,
		canUseUntrustedApprovalPolicy: configuredAppServer.start.transport !== "stdio" || isCodexAppServerApprovalPolicyAllowedByRequirements("untrusted")
	});
	appServer = resolveCodexAppServerForModelProvider({
		appServer: policyAppServer,
		provider: reviewerPolicyContext.modelProvider,
		model: reviewerPolicyContext.model,
		config: params.config,
		env: process.env,
		agentDir
	});
	pluginAppServer = appServer;
	nativeHookRelayEvents = resolveCodexNativeHookRelayEvents({
		configuredEvents: options.nativeHookRelay?.events,
		appServer
	});
	const runtimeParams = {
		...params,
		sessionKey: contextSessionKey,
		...startupAuthProfileId ? { authProfileId: startupAuthProfileId } : {}
	};
	const activeSessionId = params.sessionId;
	const activeSessionFile = params.sessionFile;
	const buildActiveRunAttemptParams = () => ({
		...runtimeParams,
		sessionId: activeSessionId,
		sessionFile: activeSessionFile
	});
	const startupAuthAccountCacheKey = await resolveCodexAppServerAuthAccountCacheKey({
		authProfileId: startupAuthProfileId,
		authProfileStore: params.authProfileStore,
		agentDir,
		config: params.config
	});
	const startupEnvApiKeyCacheKey = startupAuthProfileId ? void 0 : resolveCodexAppServerFallbackApiKeyCacheKey({ startOptions: appServer.start });
	preDynamicStartupStages.mark("auth-cache");
	const bundleMcpThreadConfig = await loadCodexBundleMcpThreadConfig({
		workspaceDir: effectiveWorkspace,
		cfg: params.config,
		toolsEnabled: supportsModelTools(params.model),
		disableTools: params.disableTools,
		toolsAllow: params.toolsAllow
	});
	preDynamicStartupStages.mark("bundle-mcp");
	const sandboxExecServerEnabled = isCodexSandboxExecServerEnabled(pluginConfig);
	const nativeToolSurfaceEnabled = shouldEnableCodexAppServerNativeToolSurface(params, sandbox, {
		agentId: sessionAgentId,
		runtimeSessionKey: sandboxSessionKey,
		sandboxExecServerEnabled
	});
	preDynamicStartupStages.mark("native-tool-surface");
	const nativeProviderWebSearchSupport = resolveCodexWebSearchPlan({
		config: params.config,
		disableTools: params.disableTools,
		nativeToolSurfaceEnabled
	}).kind === "native-hosted" ? await resolveCodexProviderWebSearchSupport({
		clientFactory: attemptClientFactory,
		appServer,
		authProfileId: startupAuthProfileId,
		agentDir,
		config: params.config,
		modelProviderOverride: resolveCodexAppServerThreadModelSelection({
			provider: params.provider,
			model: params.modelId,
			binding: startupBinding,
			authProfileId: startupAuthProfileId,
			authProfileStore: params.authProfileStore,
			agentDir,
			config: params.config
		}).modelProvider,
		signal: runAbortController.signal
	}) : "unsupported";
	preDynamicStartupStages.mark("provider-capabilities");
	for (const diagnostic of bundleMcpThreadConfig.diagnostics) log.warn(`bundle-mcp: ${diagnostic.pluginId}: ${diagnostic.message}`);
	if (activeContextEngine) assertContextEngineHostSupport({
		contextEngine: activeContextEngine,
		operation: "agent-run",
		host: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST
	});
	const hookChannelId = resolveCodexAppServerHookChannelId(params, sandboxSessionKey);
	preDynamicStartupStages.mark("context-engine-support");
	const preDynamicSummary = preDynamicStartupStages.snapshot();
	if (shouldWarnCodexDynamicToolBuildStageSummary(preDynamicSummary)) log.warn(`codex app-server pre-dynamic startup timings runId=${params.runId} sessionId=${params.sessionId} totalMs=${preDynamicSummary.totalMs} stages=${formatCodexDynamicToolBuildStageSummary(preDynamicSummary)}`, {
		runId: params.runId,
		sessionId: params.sessionId,
		totalMs: preDynamicSummary.totalMs,
		stages: preDynamicSummary.stages,
		hasStartupBinding: Boolean(startupBinding?.threadId),
		startupAuthProfileId: startupAuthProfileId ?? null,
		bundleMcpDiagnosticCount: bundleMcpThreadConfig.diagnostics.length,
		nativeToolSurfaceEnabled
	});
	let yieldDetected = false;
	const toolOutcomeOrdinals = /* @__PURE__ */ new Map();
	const suppressedDynamicToolOutcomeOrdinals = /* @__PURE__ */ new Set();
	const onCodexToolOutcome = params.onToolOutcome ? (observation) => {
		if (observation.toolCallOrdinal !== void 0 && suppressedDynamicToolOutcomeOrdinals.has(observation.toolCallOrdinal)) return;
		params.onToolOutcome?.(observation);
	} : void 0;
	const baseAllocateToolOutcomeOrdinal = params.allocateToolOutcomeOrdinal;
	const allocateCodexToolOutcomeOrdinal = baseAllocateToolOutcomeOrdinal ? (toolCallId) => {
		const reservedOrdinal = toolCallId ? toolOutcomeOrdinals.get(toolCallId) : void 0;
		if (reservedOrdinal !== void 0) return reservedOrdinal;
		const ordinal = baseAllocateToolOutcomeOrdinal(toolCallId);
		if (toolCallId) toolOutcomeOrdinals.set(toolCallId, ordinal);
		return ordinal;
	} : void 0;
	const dynamicToolParams = allocateCodexToolOutcomeOrdinal || onCodexToolOutcome ? {
		...params,
		...allocateCodexToolOutcomeOrdinal ? { allocateToolOutcomeOrdinal: allocateCodexToolOutcomeOrdinal } : {},
		...onCodexToolOutcome ? { onToolOutcome: onCodexToolOutcome } : {}
	} : params;
	let persistentWebSearchAllowed;
	let webSearchAllowed = false;
	const tools = await buildDynamicTools({
		params: dynamicToolParams,
		resolvedWorkspace,
		effectiveWorkspace,
		effectiveCwd,
		sandboxSessionKey,
		sandbox,
		nativeToolSurfaceEnabled,
		nativeProviderWebSearchSupport,
		runAbortController,
		sessionAgentId,
		pluginConfig,
		profilerEnabled,
		onYieldDetected: () => {
			yieldDetected = true;
		},
		onCodexAppServerEvent: (event) => {
			emitCodexAppServerEvent(params, event);
		},
		onPersistentWebSearchPolicyResolved: (allowed) => {
			persistentWebSearchAllowed = allowed;
		},
		onWebSearchPolicyResolved: (allowed) => {
			webSearchAllowed = allowed;
		}
	});
	const toolBridge = createCodexDynamicToolBridge({
		tools,
		registeredTools: await buildDynamicTools({
			params: dynamicToolParams,
			resolvedWorkspace,
			effectiveWorkspace,
			effectiveCwd,
			sandboxSessionKey,
			sandbox,
			nativeToolSurfaceEnabled,
			nativeProviderWebSearchSupport,
			runAbortController,
			sessionAgentId,
			pluginConfig,
			profilerEnabled,
			forceHeartbeatTool: true,
			ignoreDisableMessageTool: true,
			ignoreRuntimePlan: true,
			onYieldDetected: () => {
				yieldDetected = true;
			},
			onCodexAppServerEvent: (event) => {
				emitCodexAppServerEvent(params, event);
			}
		}),
		signal: runAbortController.signal,
		loading: resolveCodexDynamicToolsLoadingForRuntime(pluginConfig, params.modelId, { connectionClass: appServer.connectionClass }),
		directToolNames: resolveCodexDynamicToolDirectNames(params),
		hookContext: {
			agentId: sessionAgentId,
			config: params.config,
			sessionId: params.sessionId,
			sessionKey: sandboxSessionKey,
			runId: params.runId,
			channelId: hookChannelId,
			currentChannelProvider: resolveCodexMessageToolProvider(params),
			currentChannelId: params.currentChannelId,
			currentMessagingTarget: params.currentMessagingTarget,
			currentThreadId: params.currentThreadTs,
			replyToMode: params.replyToMode,
			hasRepliedRef: params.hasRepliedRef,
			onToolOutcome: onCodexToolOutcome,
			allocateToolOutcomeOrdinal: allocateCodexToolOutcomeOrdinal
		}
	});
	const hadSessionFile = await pathExists(activeSessionFile);
	const activeTranscriptTarget = {
		agentId: sessionAgentId,
		sessionFile: activeSessionFile,
		sessionId: activeSessionId,
		sessionKey: contextSessionKey
	};
	let historyMessages = !activeContextEngine && initialStartupBindingHadInactiveThreadBootstrap ? [] : await readMirroredSessionHistoryMessages(activeTranscriptTarget) ?? [];
	const hookContextWindowFields = {
		...params.contextWindowInfo?.tokens ? { contextTokenBudget: params.contextWindowInfo.tokens } : params.contextTokenBudget ? { contextTokenBudget: params.contextTokenBudget } : {},
		...params.contextWindowInfo?.source ? { contextWindowSource: params.contextWindowInfo.source } : {},
		...params.contextWindowInfo?.referenceTokens ? { contextWindowReferenceTokens: params.contextWindowInfo.referenceTokens } : {}
	};
	const hookContext = {
		runId: params.runId,
		agentId: sessionAgentId,
		sessionKey: sandboxSessionKey,
		sessionId: params.sessionId,
		workspaceDir: params.workspaceDir,
		messageProvider: params.messageProvider ?? void 0,
		trigger: params.trigger,
		channelId: hookChannelId,
		...hookContextWindowFields
	};
	const hookRunner = getAgentHarnessHookRunner();
	const activeContextEnginePluginId = activeContextEngine ? resolveContextEngineOwnerPluginId(activeContextEngine) : void 0;
	const buildActiveContextEngineRuntimeContext = () => buildHarnessContextEngineRuntimeContext({
		attempt: buildActiveRunAttemptParams(),
		workspaceDir: effectiveWorkspace,
		cwd: effectiveCwd,
		agentDir,
		activeAgentId: sessionAgentId,
		contextEnginePluginId: activeContextEnginePluginId,
		tokenBudget: params.contextTokenBudget
	});
	if (activeContextEngine) {
		await bootstrapHarnessContextEngine({
			hadSessionFile,
			contextEngine: activeContextEngine,
			sessionId: activeSessionId,
			sessionKey: contextSessionKey,
			sessionFile: activeSessionFile,
			runtimeContext: buildActiveContextEngineRuntimeContext(),
			contextEngineHostSupport: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
			providerId: params.provider,
			requestedModelId: params.requestedModelId,
			modelId: params.modelId,
			fallbackReason: params.fallbackReason,
			degradedReason: params.degradedReason,
			runMaintenance: runHarnessContextEngineMaintenance,
			config: params.config,
			warn: (message) => log.warn(message)
		});
		historyMessages = await readMirroredSessionHistoryMessages(activeTranscriptTarget) ?? historyMessages;
	}
	const workspaceBootstrapContext = await buildCodexWorkspaceBootstrapContext({
		params,
		resolvedWorkspace,
		effectiveWorkspace,
		sessionKey: contextSessionKey,
		sessionAgentId,
		memoryToolNames: getCodexWorkspaceMemoryToolNames(toolBridge.availableSpecs)
	});
	const baseDeveloperInstructions = joinPresentSections(buildDeveloperInstructions(params, { dynamicTools: toolBridge.availableSpecs }), workspaceBootstrapContext.developerInstructions);
	const openClawPromptContext = buildCodexOpenClawPromptContext({
		params,
		workspacePromptContext: workspaceBootstrapContext.promptContext
	});
	const skillsCollaborationInstructions = renderCodexSkillsCollaborationInstructions({
		attempt: params,
		skillsPrompt: params.skillsSnapshot?.prompt
	});
	let promptText = params.prompt;
	let promptContextRange;
	let developerInstructions = baseDeveloperInstructions;
	let prePromptMessageCount = historyMessages.length;
	const codexContextProjectionMaxChars = resolveCodexContextEngineProjectionMaxChars({
		contextTokenBudget: params.contextTokenBudget,
		reserveTokens: resolveCodexContextEngineProjectionReserveTokens({ config: params.config })
	});
	let contextEngineProjection;
	let precomputedStaleBindingContinuityProjectionApplied = false;
	let staleBindingContinuityForcedFreshStart = false;
	let inactiveThreadBootstrapBindingForcedFreshStart = initialInactiveThreadBootstrapBindingForcedFreshStart;
	const applyFreshThreadContinuityProjection = () => {
		const projection = projectContextEngineAssemblyForCodex({
			assembledMessages: historyMessages,
			originalHistoryMessages: historyMessages,
			prompt: params.prompt,
			maxRenderedContextChars: codexContextProjectionMaxChars
		});
		promptText = projection.promptText;
		promptContextRange = projection.promptContextRange;
		prePromptMessageCount = projection.prePromptMessageCount;
	};
	const applyActiveContextEngineProjection = async (decisionStartupBinding) => {
		if (!activeContextEngine) return;
		const assembled = await assembleHarnessContextEngine({
			contextEngine: activeContextEngine,
			sessionId: activeSessionId,
			sessionKey: contextSessionKey,
			messages: historyMessages,
			tokenBudget: params.contextTokenBudget,
			availableTools: new Set(flattenCodexDynamicToolFunctions(toolBridge.availableSpecs).map((tool) => tool.name).filter(isNonEmptyString)),
			citationsMode: params.config?.memory?.citations,
			modelId: params.modelId,
			contextEngineHostSupport: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
			providerId: params.provider,
			requestedModelId: params.requestedModelId,
			fallbackReason: params.fallbackReason,
			degradedReason: params.degradedReason,
			prompt: params.prompt
		});
		if (!assembled) throw new Error("context engine assemble returned no result");
		contextEngineProjection = readContextEngineThreadBootstrapProjection(assembled.contextProjection);
		const projection = projectContextEngineAssemblyForCodex({
			assembledMessages: assembled.messages,
			originalHistoryMessages: historyMessages,
			prompt: params.prompt,
			systemPromptAddition: assembled.systemPromptAddition,
			maxRenderedContextChars: codexContextProjectionMaxChars,
			toolPayloadMode: contextEngineProjection ? "preserve" : "elide"
		});
		const projectionDecision = contextEngineProjection ? resolveContextEngineBootstrapProjectionDecision({
			startupBinding: decisionStartupBinding,
			expectedBinding: buildContextEngineBinding(buildActiveRunAttemptParams(), contextEngineProjection),
			projection: contextEngineProjection,
			dynamicToolsFingerprint: codexDynamicToolsFingerprint(toolBridge.specs)
		}) : {
			project: true,
			reason: "per-turn-projection"
		};
		log.info("codex app-server context-engine projection decision", {
			sessionId: params.sessionId,
			sessionKey: contextSessionKey,
			engineId: activeContextEngine.info.id,
			mode: contextEngineProjection?.mode ?? assembled.contextProjection?.mode ?? "per_turn",
			epoch: contextEngineProjection?.epoch,
			fingerprint: contextEngineProjection?.fingerprint,
			previousThreadId: decisionStartupBinding?.threadId,
			previousEpoch: decisionStartupBinding?.contextEngine?.projection?.epoch,
			previousFingerprint: decisionStartupBinding?.contextEngine?.projection?.fingerprint,
			projected: projectionDecision.project,
			reason: projectionDecision.reason,
			assembledMessages: assembled.messages.length,
			originalHistoryMessages: historyMessages.length,
			projectedPromptChars: projection.promptText.length,
			developerInstructionAdditionChars: projection.developerInstructionAddition?.length ?? 0
		});
		promptText = projectionDecision.project ? projection.promptText : params.prompt;
		promptContextRange = projectionDecision.project ? projection.promptContextRange : void 0;
		developerInstructions = joinPresentSections(baseDeveloperInstructions, projection.developerInstructionAddition);
		prePromptMessageCount = projection.prePromptMessageCount;
	};
	if (activeContextEngine) try {
		await applyActiveContextEngineProjection(!nativeToolSurfaceEnabled ? void 0 : startupBinding);
	} catch (assembleErr) {
		log.warn("context engine assemble failed; using Codex baseline prompt", { error: formatErrorMessage(assembleErr) });
	}
	const codexModelInputHistoryMessages = [];
	const buildPromptFromCurrentInputs = () => resolveAgentHarnessBeforePromptBuildResult({
		prompt: prependCurrentInboundContext(promptText, params.currentInboundContext),
		developerInstructions,
		messages: codexModelInputHistoryMessages,
		ctx: hookContext,
		..."beforeAgentStartResult" in params ? { beforeAgentStartResult: params.beforeAgentStartResult } : {}
	});
	const resolveShiftedPromptInputRange = (prompt, promptInputRange, turnPromptText) => {
		if (!promptInputRange || promptInputRange.start < 0 || promptInputRange.end < promptInputRange.start || promptInputRange.end > prompt.length || !turnPromptText.endsWith(prompt)) return;
		const turnPromptOffset = turnPromptText.length - prompt.length;
		return {
			start: turnPromptOffset + promptInputRange.start,
			end: turnPromptOffset + promptInputRange.end
		};
	};
	const resolveShiftedPromptContextRange = (prompt, promptInputRange, turnPromptText) => {
		const promptTextInputOffset = promptInputRange ? promptInputRange.end - promptText.length : void 0;
		if (!promptContextRange || !promptInputRange || promptTextInputOffset === void 0 || promptInputRange.start < 0 || promptInputRange.end < promptInputRange.start || promptInputRange.end > prompt.length || promptTextInputOffset < promptInputRange.start || prompt.slice(promptTextInputOffset, promptInputRange.end) !== promptText || !turnPromptText.endsWith(prompt)) return;
		const promptTextOffset = prompt.endsWith(promptText) ? prompt.length - promptText.length : promptTextInputOffset;
		if (promptTextOffset < 0) return;
		const turnPromptOffset = turnPromptText.length - prompt.length + promptTextOffset;
		const contextRange = {
			start: turnPromptOffset + promptContextRange.start,
			end: turnPromptOffset + promptContextRange.end
		};
		return {
			contextRange,
			requestRange: {
				start: contextRange.end,
				end: turnPromptOffset + promptText.length
			}
		};
	};
	let promptBuild = await buildPromptFromCurrentInputs();
	const decorateCodexTurnPromptText = (promptBuildResult) => {
		const turnPromptText = prependCodexOpenClawPromptContext(promptBuildResult.prompt, openClawPromptContext, { preservePromptWithoutContext: params.bootstrapContextMode === "lightweight" && params.bootstrapContextRunKind === "cron" });
		const projectedRanges = resolveShiftedPromptContextRange(promptBuildResult.prompt, promptBuildResult.promptInputRange, turnPromptText);
		const preservedRange = resolveShiftedPromptInputRange(promptBuildResult.prompt, promptBuildResult.promptInputRange, turnPromptText) ?? resolveCodexDeliveryHintPreservedInputRange({
			prompt: promptBuildResult.prompt,
			promptInputRange: promptBuildResult.promptInputRange,
			decoratedPrompt: turnPromptText
		});
		return fitCodexProjectedContextForTurnStart({
			promptText: turnPromptText,
			contextRange: projectedRanges?.contextRange,
			requestRange: projectedRanges?.requestRange,
			preservedRange
		});
	};
	let codexTurnPromptText = decorateCodexTurnPromptText(promptBuild);
	const buildCodexTurnCollaborationDeveloperInstructions = () => buildTurnCollaborationMode(params, {
		turnScopedDeveloperInstructions: workspaceBootstrapContext.turnScopedDeveloperInstructions,
		skillsCollaborationInstructions,
		memoryCollaborationInstructions: workspaceBootstrapContext.memoryCollaborationInstructions,
		heartbeatCollaborationInstructions: workspaceBootstrapContext.heartbeatCollaborationInstructions
	}).settings.developer_instructions ?? void 0;
	const buildRenderedCodexDeveloperInstructions = () => joinPresentSections(promptBuild.developerInstructions, buildCodexTurnCollaborationDeveloperInstructions());
	const rebuildCodexPromptBuildFromCurrentProjection = async () => {
		promptBuild = await buildPromptFromCurrentInputs();
		codexTurnPromptText = decorateCodexTurnPromptText(promptBuild);
	};
	const rebuildCodexTurnPromptTextFromCurrentProjection = async () => {
		const nextPromptBuild = await buildPromptFromCurrentInputs();
		promptBuild = {
			...promptBuild,
			prompt: nextPromptBuild.prompt,
			promptInputRange: nextPromptBuild.promptInputRange
		};
		codexTurnPromptText = decorateCodexTurnPromptText(nextPromptBuild);
	};
	const selectNewerVisibleHistoryAfterBinding = (binding) => {
		const bindingUpdatedAt = Date.parse(binding.updatedAt);
		if (!Number.isFinite(bindingUpdatedAt)) return [];
		return historyMessages.filter((message) => {
			if (message.role !== "user" && message.role !== "assistant") return false;
			const record = message;
			const idempotencyKey = record.idempotencyKey;
			if (typeof idempotencyKey === "string" && idempotencyKey.startsWith("codex-app-server:")) return false;
			const meta = record["__openclaw"];
			const mirrorIdentity = meta && typeof meta === "object" && !Array.isArray(meta) ? meta.mirrorIdentity : void 0;
			if (typeof mirrorIdentity === "string" && mirrorIdentity.startsWith("codex-app-server:")) return false;
			const timestamp = typeof message.timestamp === "number" ? message.timestamp : typeof message.timestamp === "string" ? Date.parse(message.timestamp) : NaN;
			return Number.isFinite(timestamp) && timestamp > bindingUpdatedAt;
		});
	};
	const applyResumeStaleBindingContinuityProjection = (binding) => {
		const newerVisibleMessages = selectNewerVisibleHistoryAfterBinding(binding);
		if (newerVisibleMessages.length === 0) return false;
		const projection = projectContextEngineAssemblyForCodex({
			assembledMessages: newerVisibleMessages,
			originalHistoryMessages: historyMessages,
			prompt: params.prompt,
			maxRenderedContextChars: codexContextProjectionMaxChars
		});
		promptText = projection.promptText;
		promptContextRange = projection.promptContextRange;
		prePromptMessageCount = projection.prePromptMessageCount;
		return true;
	};
	const precomputeNoContextEngineStaleBindingProjection = (binding) => {
		precomputedStaleBindingContinuityProjectionApplied = false;
		staleBindingContinuityForcedFreshStart = false;
		if (activeContextEngine || !binding?.threadId) return false;
		if (isInactiveThreadBootstrapBinding(binding)) {
			inactiveThreadBootstrapBindingForcedFreshStart = true;
			return false;
		}
		const projected = applyResumeStaleBindingContinuityProjection(binding);
		precomputedStaleBindingContinuityProjectionApplied = projected;
		return projected;
	};
	const applyNoContextEngineContinuityProjection = (action, binding) => {
		if (activeContextEngine || !historyMessages.some((message) => message.role === "user")) return false;
		if (action === "resumed" && precomputedStaleBindingContinuityProjectionApplied) return true;
		if (action === "started" && staleBindingContinuityForcedFreshStart) return true;
		if (action === "started" && inactiveThreadBootstrapBindingForcedFreshStart) return false;
		if (action === "resumed" && binding) return applyResumeStaleBindingContinuityProjection(binding);
		if (action === "started") {
			applyFreshThreadContinuityProjection();
			return true;
		}
		return false;
	};
	if (precomputeNoContextEngineStaleBindingProjection(startupBinding)) await rebuildCodexPromptBuildFromCurrentProjection();
	const rotateStartupBindingForProjectedTurn = async () => {
		if (!startupBinding?.threadId) return;
		const previousThreadId = startupBinding.threadId;
		const hadInactiveThreadBootstrapBinding = isInactiveThreadBootstrapBinding(startupBinding);
		const projectedTurnTokens = estimateCodexAppServerProjectedTurnTokens({
			prompt: codexTurnPromptText,
			developerInstructions: buildRenderedCodexDeveloperInstructions()
		});
		startupBinding = await rotateOversizedCodexAppServerStartupBinding({
			binding: startupBinding,
			sessionFile: params.sessionFile,
			agentDir,
			codexHome: appServer.start.env?.CODEX_HOME,
			config: params.config,
			contextEngineActive: Boolean(activeContextEngine),
			projectedTurnTokens
		});
		if (startupBinding?.threadId) return;
		inactiveThreadBootstrapBindingForcedFreshStart = hadInactiveThreadBootstrapBinding;
		staleBindingContinuityForcedFreshStart = precomputedStaleBindingContinuityProjectionApplied && !inactiveThreadBootstrapBindingForcedFreshStart;
		if (staleBindingContinuityForcedFreshStart) applyFreshThreadContinuityProjection();
		if (activeContextEngine) {
			contextEngineProjection = void 0;
			try {
				await applyActiveContextEngineProjection(void 0);
			} catch (assembleErr) {
				log.warn("context engine assemble failed; using Codex baseline prompt", { error: formatErrorMessage(assembleErr) });
			}
		}
		await rebuildCodexPromptBuildFromCurrentProjection();
		log.info("codex app-server rebuilt turn prompt after native thread rotation", {
			sessionId: params.sessionId,
			sessionKey: contextSessionKey,
			previousThreadId,
			promptChars: codexTurnPromptText.length,
			developerInstructionChars: buildRenderedCodexDeveloperInstructions()?.length ?? 0
		});
	};
	await rotateStartupBindingForProjectedTurn();
	const systemPromptReport = buildCodexSystemPromptReport({
		attempt: params,
		sessionKey: contextSessionKey,
		workspaceDir: effectiveWorkspace,
		developerInstructions: buildRenderedCodexDeveloperInstructions(),
		workspaceBootstrapContext,
		skillsPrompt: skillsCollaborationInstructions ? params.skillsSnapshot?.prompt ?? "" : "",
		tools: toolBridge.availableSpecs
	});
	const trajectoryRecorder = createCodexTrajectoryRecorder({
		attempt: params,
		cwd: effectiveCwd,
		developerInstructions: buildRenderedCodexDeveloperInstructions(),
		prompt: codexTurnPromptText,
		tools: toolBridge.availableSpecs
	});
	let client;
	let thread;
	let trajectoryEndRecorded = false;
	const markTrajectoryEndRecorded = () => {
		trajectoryEndRecorded = true;
	};
	let nativeHookRelay;
	let releaseSharedClientLease;
	let sharedCodexClientRetiredForOneShotCleanup = false;
	const releaseSharedClientLeaseOnce = () => {
		const release = releaseSharedClientLease;
		if (!release) return;
		releaseSharedClientLease = void 0;
		release();
	};
	const retireSharedCodexClientForOneShotCleanup = async () => {
		if (params.cleanupBundleMcpOnRunEnd !== true) return;
		if (sharedCodexClientRetiredForOneShotCleanup) return;
		sharedCodexClientRetiredForOneShotCleanup = true;
		const retired = retireSharedCodexAppServerClientIfCurrent(client);
		log.info("codex app-server one-shot cleanup retired shared client", {
			runId: params.runId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			activeLeases: retired?.activeLeases ?? null,
			closed: retired?.closed ?? false,
			matchedSharedClient: Boolean(retired)
		});
		if (retired?.closed) await client.closeAndWait({
			exitTimeoutMs: 2e3,
			forceKillDelayMs: 250
		});
	};
	const releaseSharedClientLeaseAndRetireOneShotClient = async () => {
		releaseSharedClientLeaseOnce();
		await retireSharedCodexClientForOneShotCleanup();
	};
	let sandboxExecEnvironmentAcquired = false;
	const releaseSandboxExecEnvironment = async () => {
		if (sandboxExecEnvironmentAcquired) {
			sandboxExecEnvironmentAcquired = false;
			await releaseCodexSandboxExecServerEnvironment(sandbox);
		}
	};
	let codexEnvironmentSelection;
	let codexExecutionCwd = effectiveCwd;
	let codexSandboxPolicy;
	let restartContextEngineCodexThread;
	const startupTimeoutMs = resolveCodexStartupTimeoutMs({
		timeoutMs: params.timeoutMs,
		timeoutFloorMs: options.startupTimeoutFloorMs
	});
	const buildNativeHookRelayFinalConfigPatch = (decision) => {
		nativeHookRelay?.unregister();
		nativeHookRelay = createCodexNativeHookRelay({
			options: options.nativeHookRelay,
			generation: decision.action === "resume" ? decision.binding.nativeHookRelayGeneration : void 0,
			generationMismatchGraceMs: decision.action === "resume" && !decision.binding.nativeHookRelayGeneration ? CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS : void 0,
			events: nativeHookRelayEvents,
			agentId: sessionAgentId,
			sessionId: params.sessionId,
			sessionKey: sandboxSessionKey,
			config: params.config,
			runId: params.runId,
			channelId: hookChannelId,
			attemptTimeoutMs: params.timeoutMs,
			startupTimeoutMs,
			turnStartTimeoutMs: params.timeoutMs,
			signal: runAbortController.signal
		});
		return {
			configPatch: nativeHookRelay ? buildCodexNativeHookRelayConfig({
				relay: nativeHookRelay,
				events: nativeHookRelayEvents,
				hookTimeoutSec: options.nativeHookRelay?.hookTimeoutSec
			}) : options.nativeHookRelay?.enabled === false ? buildCodexNativeHookRelayDisabledConfig() : void 0,
			nativeHookRelayGeneration: nativeHookRelay?.generation
		};
	};
	try {
		emitCodexAppServerEvent(params, {
			stream: "codex_app_server.lifecycle",
			data: { phase: "startup" }
		});
		const attemptAppServer = withCodexAppServerFastModeServiceTier(appServer, params);
		pluginAppServer = attemptAppServer;
		const startupResult = await startCodexAttemptThread({
			attemptClientFactory,
			appServer: attemptAppServer,
			pluginConfig,
			computerUseConfig,
			startupAuthProfileId,
			startupAuthAccountCacheKey,
			startupEnvApiKeyCacheKey,
			agentDir,
			config: params.config,
			buildAttemptParams: buildActiveRunAttemptParams,
			sessionAgentId,
			effectiveWorkspace,
			effectiveCwd,
			dynamicTools: toolBridge.specs,
			persistentWebSearchAllowed,
			webSearchAllowed,
			developerInstructions: promptBuild.developerInstructions,
			buildFinalConfigPatch: buildNativeHookRelayFinalConfigPatch,
			bundleMcpThreadConfig,
			nativeToolSurfaceEnabled,
			nativeProviderWebSearchSupport,
			sandboxExecServerEnabled,
			sandbox,
			contextEngineProjection,
			startupTimeoutMs,
			signal: runAbortController.signal,
			onStartupTimeout: () => {
				runAbortController.abort("codex_startup_timeout");
			},
			spawnedBy: params.spawnedBy
		});
		client = startupResult.client;
		thread = startupResult.thread;
		pluginAppServer = startupResult.pluginAppServer;
		sandboxExecEnvironmentAcquired = Boolean(startupResult.sandboxEnvironment);
		codexEnvironmentSelection = startupResult.environmentSelection;
		codexExecutionCwd = startupResult.executionCwd;
		codexSandboxPolicy = startupResult.sandboxPolicy;
		releaseSharedClientLease = startupResult.releaseSharedClientLease;
		restartContextEngineCodexThread = startupResult.restartContextEngineCodexThread;
		emitCodexAppServerEvent(params, {
			stream: "codex_app_server.lifecycle",
			data: {
				phase: "thread_ready",
				threadId: thread.threadId
			}
		});
	} catch (error) {
		nativeHookRelay?.unregister();
		await releaseSandboxExecEnvironment();
		params.abortSignal?.removeEventListener("abort", abortFromUpstream);
		throw error;
	}
	if (applyNoContextEngineContinuityProjection(thread.lifecycle.action, thread)) await rebuildCodexTurnPromptTextFromCurrentProjection();
	trajectoryRecorder?.recordEvent("session.started", {
		sessionFile: params.sessionFile,
		threadId: thread.threadId,
		authProfileId: startupAuthProfileId,
		workspaceDir: effectiveWorkspace,
		toolCount: flattenCodexDynamicToolFunctions(toolBridge.specs).length
	});
	recordCodexTrajectoryContext(trajectoryRecorder, {
		attempt: params,
		cwd: effectiveCwd,
		developerInstructions: buildRenderedCodexDeveloperInstructions(),
		prompt: codexTurnPromptText,
		tools: toolBridge.availableSpecs
	});
	const pendingNotifications = [];
	let completed = false;
	let terminalTurnNotificationQueued = false;
	let timedOut = false;
	let turnCompletionIdleTimedOut = false;
	let turnWatchTimeoutKind;
	let turnWatchTimeoutIdleMs;
	let turnWatchTimeoutMs;
	let turnWatchTimeoutLastActivityReason;
	let turnWatchTimeoutDetails;
	let turnCompletionIdleTimeoutMessage;
	let clientClosedPromptError;
	let clientClosedAbort = false;
	let shouldDelayNativeHookRelayUnregister = false;
	let lifecycleStarted = false;
	let lifecycleTerminalEmitted = false;
	let resolveCompletion;
	const completion = new Promise((resolve) => {
		resolveCompletion = resolve;
	});
	let notificationQueue = Promise.resolve();
	const turnCompletionIdleTimeoutMs = resolveCodexTurnCompletionIdleTimeoutMs(options.turnCompletionIdleTimeoutMs ?? appServer.turnCompletionIdleTimeoutMs);
	const turnAssistantCompletionIdleTimeoutMs = resolveCodexTurnAssistantCompletionIdleTimeoutMs(options.turnAssistantCompletionIdleTimeoutMs);
	const postToolRawAssistantCompletionIdleTimeoutMs = resolveCodexPostToolRawAssistantCompletionIdleTimeoutMs(options.postToolRawAssistantCompletionIdleTimeoutMs ?? appServer.postToolRawAssistantCompletionIdleTimeoutMs, turnAssistantCompletionIdleTimeoutMs);
	const turnTerminalIdleTimeoutMs = resolveCodexTurnTerminalIdleTimeoutMs(options.turnTerminalIdleTimeoutMs);
	const turnAttemptIdleTimeoutMs = Math.max(100, Math.floor(params.timeoutMs));
	let nativeHookRelayLastRenewedAt = 0;
	let activeAppServerTurnRequests = 0;
	const pendingOpenClawDynamicToolCompletionIds = /* @__PURE__ */ new Set();
	const activeTurnItemIds = /* @__PURE__ */ new Set();
	let turnCrossedToolHandoff = false;
	let pendingTerminalDynamicToolRelease;
	let terminalDynamicToolReleaseCheckScheduled = false;
	let currentTurnHadNonTerminalDynamicToolResult = false;
	const turnIdRef = {};
	const projectorRef = {};
	const userInputBridgeRef = {};
	const steeringQueueRef = {};
	const renewNativeHookRelayForTurnProgress = () => {
		if (!nativeHookRelay || options.nativeHookRelay?.ttlMs !== void 0) return;
		const now = Date.now();
		const renewsRecently = now - nativeHookRelayLastRenewedAt < CODEX_NATIVE_HOOK_RELAY_RENEW_INTERVAL_MS;
		const expiresSoon = now >= nativeHookRelay.expiresAtMs - CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS;
		if (renewsRecently && !expiresSoon) return;
		nativeHookRelayLastRenewedAt = now;
		nativeHookRelay.renew(resolveCodexNativeHookRelayTtlMs({
			explicitTtlMs: void 0,
			attemptTimeoutMs: turnAttemptIdleTimeoutMs,
			startupTimeoutMs,
			turnStartTimeoutMs: params.timeoutMs
		}));
	};
	const turnWatches = createCodexAttemptTurnWatchController({
		threadId: thread.threadId,
		signal: runAbortController.signal,
		getTurnId: () => turnIdRef.current,
		isCompleted: () => completed,
		isTerminalTurnNotificationQueued: () => terminalTurnNotificationQueued,
		getActiveAppServerTurnRequests: () => activeAppServerTurnRequests,
		getActiveTurnItemCount: () => activeTurnItemIds.size,
		turnCompletionIdleTimeoutMs,
		turnAssistantCompletionIdleTimeoutMs,
		turnAttemptIdleTimeoutMs,
		turnTerminalIdleTimeoutMs,
		interruptTimeoutMs: CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS,
		onInterruptTurn: (input) => interruptCodexTurnBestEffort(client, input),
		onTimeout: (timeout) => {
			timedOut = true;
			turnCompletionIdleTimedOut = true;
			turnWatchTimeoutKind = timeout.kind;
			turnWatchTimeoutIdleMs = timeout.idleMs;
			turnWatchTimeoutMs = timeout.timeoutMs;
			turnWatchTimeoutLastActivityReason = timeout.lastActivityReason;
			turnWatchTimeoutDetails = timeout.details;
			turnCompletionIdleTimeoutMessage = "codex app-server turn idle timed out waiting for turn/completed";
		},
		onMarkTimedOut: () => projectorRef.current?.markTimedOut(),
		onAbort: (reason) => runAbortController.abort(reason),
		onCompleted: () => {
			completed = true;
		},
		onResolveCompletion: () => resolveCompletion?.(),
		onRecordEvent: (name, fields) => trajectoryRecorder?.recordEvent(name, fields),
		onAttemptProgress: (reason) => {
			renewNativeHookRelayForTurnProgress();
			params.onRunProgress?.({
				reason,
				provider: params.provider,
				model: params.modelId,
				backend: "codex-app-server"
			});
		},
		onProgressDiagnostic: (reason) => {
			emitTrustedDiagnosticEvent({
				type: "run.progress",
				runId: params.runId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				reason: `codex_app_server:${reason}`
			});
		}
	});
	const releaseTurnAfterTerminalDynamicTool = (paramsValue) => {
		if (!shouldReleaseTurnAfterTerminalDynamicTool({
			completed,
			aborted: runAbortController.signal.aborted,
			responseSuccess: paramsValue.response.success,
			currentTurnHadNonTerminalDynamicToolResult,
			activeAppServerTurnRequests,
			activeTurnItemIdsCount: activeTurnItemIds.size,
			pendingOpenClawDynamicToolCompletionIdsCount: pendingOpenClawDynamicToolCompletionIds.size
		})) return;
		pendingTerminalDynamicToolRelease = void 0;
		trajectoryRecorder?.recordEvent("turn.dynamic_tool_terminal_release", {
			threadId: paramsValue.call.threadId,
			turnId: paramsValue.call.turnId,
			toolCallId: paramsValue.call.callId,
			name: paramsValue.call.tool,
			durationMs: paramsValue.durationMs
		});
		log.info("codex app-server turn released after terminal dynamic tool result", {
			threadId: paramsValue.call.threadId,
			turnId: paramsValue.call.turnId,
			toolCallId: paramsValue.call.callId,
			tool: paramsValue.call.tool,
			durationMs: paramsValue.durationMs
		});
		interruptCodexTurnBestEffort(client, {
			threadId: paramsValue.call.threadId,
			turnId: paramsValue.call.turnId,
			timeoutMs: CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS
		});
		completed = true;
		turnWatches.clearCompletionIdleTimer();
		turnWatches.clearAssistantCompletionIdleTimer();
		turnWatches.clearTerminalIdleTimer();
		resolveCompletion?.();
	};
	const scheduleTerminalDynamicToolReleaseCheck = () => {
		if (terminalDynamicToolReleaseCheckScheduled || !pendingTerminalDynamicToolRelease && !currentTurnHadNonTerminalDynamicToolResult) return;
		terminalDynamicToolReleaseCheckScheduled = true;
		setImmediate(() => {
			terminalDynamicToolReleaseCheckScheduled = false;
			const action = resolveTerminalDynamicToolBatchAction({
				activeAppServerTurnRequests,
				activeTurnItemIdsCount: activeTurnItemIds.size,
				pendingOpenClawDynamicToolCompletionIdsCount: pendingOpenClawDynamicToolCompletionIds.size,
				currentTurnHadNonTerminalDynamicToolResult,
				hasPendingTerminalDynamicToolRelease: pendingTerminalDynamicToolRelease !== void 0
			});
			if (action === "release-pending-terminal" && pendingTerminalDynamicToolRelease) releaseTurnAfterTerminalDynamicTool(pendingTerminalDynamicToolRelease);
			else if (action === "clear-nonterminal-batch") {
				pendingTerminalDynamicToolRelease = void 0;
				currentTurnHadNonTerminalDynamicToolResult = false;
			}
		}).unref?.();
	};
	const scheduleTurnReleaseAfterTerminalDynamicTool = (paramsLocal) => {
		pendingTerminalDynamicToolRelease = paramsLocal;
		scheduleTerminalDynamicToolReleaseCheck();
	};
	const emitLifecycleStart = () => {
		emitCodexAppServerEvent(params, {
			stream: "lifecycle",
			data: {
				phase: "start",
				startedAt: attemptStartedAt
			}
		});
		lifecycleStarted = true;
	};
	const emitLifecycleTerminal = (data) => {
		if (!lifecycleStarted || lifecycleTerminalEmitted) return;
		emitCodexAppServerEvent(params, {
			stream: "lifecycle",
			data: {
				startedAt: attemptStartedAt,
				endedAt: Date.now(),
				...data,
				...params.deferTerminalLifecycle ?? params.deferTerminalLifecycleEnd ? { phase: "finishing" } : {}
			}
		});
		lifecycleTerminalEmitted = true;
	};
	const executionPhaseKeys = /* @__PURE__ */ new Set();
	const emitExecutionPhaseOnce = (key, info) => {
		if (executionPhaseKeys.has(key)) return;
		executionPhaseKeys.add(key);
		params.onExecutionPhase?.({
			provider: params.provider,
			model: params.modelId,
			backend: "codex-app-server",
			...info
		});
	};
	const reportExecutionNotification = (notification) => {
		reportCodexExecutionNotification({
			notification,
			emitExecutionPhaseOnce
		});
	};
	const emitFastModeAutoProgress = async (payload) => {
		const summary = formatFastModeAutoProgressText(payload);
		await emitCodexAppServerEvent(params, {
			stream: "item",
			data: {
				kind: "status",
				title: "Fast",
				phase: "update",
				summary
			}
		});
		try {
			await params.onToolResult?.({
				text: summary,
				channelData: { openclawProgressKind: FAST_MODE_AUTO_PROGRESS_KIND }
			});
		} catch (error) {
			log.debug("codex app-server fast mode auto progress delivery failed", { error });
		}
	};
	const maybeAnnounceFastModeAutoOff = async () => {
		if (params.fastModeAuto !== true || fastModeAutoStartedAtMs === void 0 || fastModeAutoProgressState.offAnnounced) return;
		const next = resolveFastModeForElapsed({
			mode: "auto",
			startedAtMs: fastModeAutoStartedAtMs,
			fastAutoOnSeconds: params.fastModeAutoOnSeconds
		});
		if (next.enabled) return;
		fastModeAutoProgressState.offAnnounced = true;
		await emitFastModeAutoProgress(next);
	};
	const maybeEmitFastModeAutoReset = async () => {
		if (params.fastModeAuto !== true || !fastModeAutoProgressState.offAnnounced || fastModeAutoProgressState.resetAnnounced) return;
		fastModeAutoProgressState.resetAnnounced = true;
		await emitFastModeAutoProgress({
			enabled: true,
			elapsedSeconds: 0,
			fastAutoOnSeconds: params.fastModeAutoOnSeconds
		});
	};
	const maybeEmitFastModeAutoResetBestEffort = async () => {
		try {
			await maybeEmitFastModeAutoReset();
		} catch (error) {
			log.warn(`codex app-server fast mode auto reset progress failed: ${formatErrorMessage(error)}`);
		}
	};
	const isTerminalTurnNotificationForTurn = (notification, notificationTurnId) => isTerminalCodexTurnNotificationForTurn({
		notification,
		threadId: thread.threadId,
		turnId: notificationTurnId,
		currentPromptTexts: [codexTurnPromptText]
	});
	const handleNotification = async (notification) => {
		const projector = projectorRef.current;
		const turnId = turnIdRef.current;
		const userInputBridge = userInputBridgeRef.current;
		const steeringQueue = steeringQueueRef.current;
		userInputBridge?.handleNotification(notification);
		if (!projector || !turnId) {
			pendingNotifications.push(notification);
			return;
		}
		const notificationState = applyCodexTurnNotificationState({
			notification,
			threadId: thread.threadId,
			turnId,
			currentPromptTexts: [codexTurnPromptText],
			turnWatches,
			activeTurnItemIds,
			activeAppServerTurnRequests,
			pendingOpenClawDynamicToolCompletionIds,
			turnCrossedToolHandoff,
			postToolRawAssistantCompletionIdleTimeoutMs,
			onScheduleTerminalDynamicToolReleaseCheck: scheduleTerminalDynamicToolReleaseCheck,
			onReportExecutionNotification: reportExecutionNotification
		});
		turnCrossedToolHandoff = notificationState.turnCrossedToolHandoff;
		if (notificationState.isTurnTerminal) terminalTurnNotificationQueued = true;
		try {
			await waitForCodexNotificationDispatchTurn();
			await projector.handleNotification(notification);
			if (notificationState.isCurrentTurnNotification && activeTurnItemIds.size === 0 && isRawFunctionToolOutputCompletionNotification(notification)) await maybeAnnounceFastModeAutoOff();
		} catch (error) {
			log.debug("codex app-server projector notification threw", {
				method: notification.method,
				error
			});
		} finally {
			if (notificationState.isTurnTerminal) {
				if (notificationState.isTurnAbortMarker) projector.markAborted();
				if (!timedOut && !runAbortController.signal.aborted) await steeringQueue?.flushPending();
				completed = true;
				turnWatches.clearCompletionIdleTimer();
				turnWatches.clearAssistantCompletionIdleTimer();
				turnWatches.clearTerminalIdleTimer();
				resolveCompletion?.();
			}
		}
	};
	let activeNativeTurnCompletionWaiter;
	const waitForActiveNativeTurnCompletion = async (turnIds) => {
		const turnIdSet = turnIds?.length ? new Set(turnIds) : void 0;
		const matchesCompletion = (notification) => isCodexThreadTurnCompletedNotification(notification, thread.threadId, turnIdSet);
		if (pendingNotifications.some((notification) => matchesCompletion(notification))) return true;
		return await new Promise((resolve) => {
			let settled = false;
			const timeoutRef = {};
			const finish = (completedNativeTurn) => {
				if (settled) return;
				settled = true;
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				runAbortController.signal.removeEventListener("abort", abortListener);
				if (activeNativeTurnCompletionWaiter?.resolve === finishComplete) activeNativeTurnCompletionWaiter = void 0;
				resolve(completedNativeTurn);
			};
			const finishComplete = () => finish(true);
			const abortListener = () => finish(false);
			timeoutRef.current = setTimeout(() => finish(false), Math.min(appServer.requestTimeoutMs, CODEX_APP_SERVER_ACTIVE_NATIVE_TURN_WAIT_TIMEOUT_MS));
			activeNativeTurnCompletionWaiter = {
				matches: matchesCompletion,
				resolve: finishComplete
			};
			runAbortController.signal.addEventListener("abort", abortListener, { once: true });
		});
	};
	const enqueueNotification = (notification) => {
		const projector = projectorRef.current;
		const turnId = turnIdRef.current;
		const userInputBridge = userInputBridgeRef.current;
		const correlation = describeCodexNotificationCorrelation(notification, {
			threadId: thread.threadId,
			...turnId ? { turnId } : {}
		});
		log.trace("codex app-server raw notification received", correlation);
		if (notification.method === "turn/completed" && correlation.matchesActiveTurn === false) if (correlation.matchesActiveThread) log.warn("codex app-server turn/completed did not match active turn", correlation);
		else log.debug("codex app-server turn/completed ignored for other subscribed thread", correlation);
		if (notification.method === "turn/completed" && correlation.matchesActiveThread) {
			if (activeNativeTurnCompletionWaiter?.matches(notification)) activeNativeTurnCompletionWaiter.resolve();
		}
		if (isCodexNotificationOutsideActiveRun(correlation)) return Promise.resolve();
		if (!projector || !turnId) {
			userInputBridge?.handleNotification(notification);
			pendingNotifications.push(notification);
			return Promise.resolve();
		}
		if (isTerminalTurnNotificationForTurn(notification, turnId)) terminalTurnNotificationQueued = true;
		const isNativeResponseStreamDelta = isNativeResponseStreamDeltaNotification(notification);
		const nativeResponseStreamDeltaMatchesActiveTurn = isNativeResponseStreamDelta && (correlation.matchesActiveTurn === true || isUnscopedCodexNotification(correlation) && canAttributeUnscopedNativeResponseDeltaToThisTurn(client));
		const notificationMatchesActiveTurn = correlation.matchesActiveTurn === true || !isNativeResponseStreamDelta && correlation.matchesActiveTurn !== false || nativeResponseStreamDeltaMatchesActiveTurn;
		if (correlation.matchesActiveTurn === true) {
			const modelToolCallId = readRawResponseToolCallId(notification);
			if (modelToolCallId) allocateCodexToolOutcomeOrdinal?.(modelToolCallId);
			const nativeItem = readCodexNotificationItem(notification.params);
			if (nativeItem?.type === "webSearch") projector.recordNativeToolOutcome(nativeItem);
		}
		if (notificationMatchesActiveTurn) turnWatches.noteNotificationReceived(notification.method, isNativeResponseStreamDelta ? {
			attemptProgress: true,
			...turnCrossedToolHandoff ? { attemptTimeoutMs: postToolRawAssistantCompletionIdleTimeoutMs } : {},
			details: { lastNotificationMethod: notification.method }
		} : void 0);
		notificationQueue = notificationQueue.then(() => handleNotification(notification), () => handleNotification(notification));
		return notificationQueue;
	};
	const nativeSubagentCodexHome = appServer.start.transport === "stdio" ? appServer.start.env?.CODEX_HOME ?? resolveCodexAppServerHomeDir(agentDir) : void 0;
	registerCodexNativeSubagentMonitor({
		client,
		parentThreadId: thread.threadId,
		requesterSessionKey: params.sessionKey,
		taskRuntimeScope: params.agentHarnessTaskRuntimeScope,
		agentId: params.agentId,
		codexHome: nativeSubagentCodexHome
	});
	const notificationCleanup = client.addNotificationHandler(enqueueNotification);
	const requestCleanup = client.addRequestHandler(async (request) => {
		const turnId = turnIdRef.current;
		const userInputBridge = userInputBridgeRef.current;
		const projector = projectorRef.current;
		let armCompletionWatchOnResponse = false;
		let requestCountsAsTurnActivity = false;
		const markCurrentTurnRequestProgress = () => {
			activeAppServerTurnRequests += 1;
			turnWatches.clearCompletionIdleTimer();
			turnWatches.disarmAssistantCompletionIdleWatch();
			requestCountsAsTurnActivity = true;
			turnWatches.touchActivity(`request:${request.method}:start`, { attemptProgress: true });
		};
		try {
			if (request.method === "account/chatgptAuthTokens/refresh") return refreshCodexAppServerAuthTokens({
				agentDir,
				authProfileId: startupAuthProfileId,
				config: params.config
			});
			if (!turnId) return;
			if (request.method === "mcpServer/elicitation/request") {
				if (isCurrentThreadOptionalTurnRequestParams(request.params, thread.threadId, turnId)) {
					armCompletionWatchOnResponse = true;
					markCurrentTurnRequestProgress();
				}
				return await handleCodexAppServerElicitationRequest({
					requestParams: request.params,
					paramsForRun: params,
					threadId: thread.threadId,
					turnId,
					pluginAppPolicyContext: thread.pluginAppPolicyContext,
					...computerUseConfig.enabled ? { computerUseMcpServerName: computerUseConfig.mcpServerName } : {},
					signal: runAbortController.signal
				});
			}
			if (request.method === "item/tool/requestUserInput") {
				if (isCurrentThreadTurnRequestParams(request.params, thread.threadId, turnId)) {
					armCompletionWatchOnResponse = true;
					markCurrentTurnRequestProgress();
				}
				return userInputBridge?.handleRequest({
					id: request.id,
					params: request.params
				});
			}
			if (request.method !== "item/tool/call") {
				if (isCodexAppServerApprovalRequest(request.method)) {
					if (isCurrentApprovalTurnRequestParams(request.params, thread.threadId, turnId)) {
						armCompletionWatchOnResponse = true;
						markCurrentTurnRequestProgress();
					}
					return handleApprovalRequest({
						method: request.method,
						params: request.params,
						paramsForRun: params,
						threadId: thread.threadId,
						turnId,
						nativeHookRelay,
						execPolicy,
						execReviewerAgentId: sessionAgentId,
						internalExecAutoReview: appServer.approvalsReviewer === "user",
						autoApprove: shouldAutoApproveCodexAppServerApprovals(appServer),
						signal: runAbortController.signal
					});
				}
				return;
			}
			const call = readDynamicToolCallParams(request.params);
			if (!call || call.threadId !== thread.threadId || call.turnId !== turnId) return;
			const toolCallOrdinal = allocateCodexToolOutcomeOrdinal?.(call.callId);
			armCompletionWatchOnResponse = true;
			markCurrentTurnRequestProgress();
			turnCrossedToolHandoff = true;
			pendingOpenClawDynamicToolCompletionIds.add(call.callId);
			trajectoryRecorder?.recordEvent("tool.call", {
				threadId: call.threadId,
				turnId: call.turnId,
				toolCallId: call.callId,
				name: call.tool,
				arguments: call.arguments
			});
			projector?.recordDynamicToolCall({
				callId: call.callId,
				tool: call.tool,
				arguments: call.arguments
			});
			emitExecutionPhaseOnce(`tool:${call.callId}`, {
				phase: "tool_execution_started",
				tool: call.tool,
				toolCallId: call.callId
			});
			emitDynamicToolStartedDiagnostic({
				call,
				runId: params.runId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey
			});
			const toolMeta = inferCodexDynamicToolMeta(call, resolveCodexToolProgressDetailMode(params.toolProgressDetail));
			const toolArgs = sanitizeCodexToolArguments(call.arguments);
			const shouldEmitDynamicToolProgress = shouldEmitTranscriptToolProgress(call.tool, toolArgs);
			if (shouldEmitDynamicToolProgress) emitCodexAppServerEvent(params, {
				stream: "tool",
				data: {
					phase: "start",
					name: call.tool,
					toolCallId: call.callId,
					...toolMeta ? { meta: toolMeta } : {},
					...toolArgs ? { args: toolArgs } : {}
				}
			});
			const dynamicToolTimeoutMs = resolveDynamicToolCallTimeoutMs({
				call,
				config: params.config
			});
			const toolStartedAt = Date.now();
			let terminalDiagnosticObserved = false;
			const unsubscribeToolDiagnosticObserver = onInternalDiagnosticEvent((event) => {
				if (isDynamicToolTerminalDiagnosticEvent(event)) {
					if (isMatchingDynamicToolTerminalDiagnostic({
						event,
						call,
						runId: params.runId,
						sessionId: params.sessionId,
						sessionKey: params.sessionKey
					})) terminalDiagnosticObserved = true;
				}
			});
			try {
				const response = await handleDynamicToolCallWithTimeout({
					call,
					toolBridge,
					signal: runAbortController.signal,
					timeoutMs: dynamicToolTimeoutMs,
					toolCallOrdinal,
					onAgentToolResult: params.onAgentToolResult,
					onFallbackSelected: () => {
						if (toolCallOrdinal !== void 0) suppressedDynamicToolOutcomeOrdinals.add(toolCallOrdinal);
					},
					onTimeout: () => {
						trajectoryRecorder?.recordEvent("tool.timeout", {
							threadId: call.threadId,
							turnId: call.turnId,
							toolCallId: call.callId,
							name: call.tool,
							timeoutMs: dynamicToolTimeoutMs
						});
					}
				});
				const protocolResponse = toCodexDynamicToolProtocolResponse(response);
				if (!protocolResponse.success && toolCallOrdinal !== void 0) {
					suppressedDynamicToolOutcomeOrdinals.add(toolCallOrdinal);
					params.onToolOutcome?.({
						toolName: call.tool,
						argsHash: "",
						resultHash: "",
						toolCallOrdinal,
						terminalPresentation: void 0,
						presentationOnly: true
					});
				}
				const toolDurationMs = Math.max(0, Date.now() - toolStartedAt);
				trajectoryRecorder?.recordEvent("tool.result", {
					threadId: call.threadId,
					turnId: call.turnId,
					toolCallId: call.callId,
					name: call.tool,
					success: protocolResponse.success,
					contentItems: protocolResponse.contentItems
				});
				projector?.recordDynamicToolResult({
					callId: call.callId,
					tool: call.tool,
					asyncStarted: response.asyncStarted === true,
					success: protocolResponse.success,
					terminalType: response.diagnosticTerminalType ?? (protocolResponse.success ? "completed" : "error"),
					sideEffectEvidence: response.sideEffectEvidence === true,
					contentItems: protocolResponse.contentItems
				});
				if (shouldEmitDynamicToolProgress) {
					const progressResponse = toCodexDynamicToolProgressResponse(response, protocolResponse);
					emitCodexAppServerEvent(params, {
						stream: "tool",
						data: {
							phase: "result",
							name: call.tool,
							toolCallId: call.callId,
							...toolMeta ? { meta: toolMeta } : {},
							isError: !protocolResponse.success,
							result: toTranscriptToolResult(progressResponse)
						}
					});
				}
				if (!terminalDiagnosticObserved && !hasPendingDynamicToolTerminalDiagnostic({
					call,
					runId: params.runId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey
				})) emitDynamicToolTerminalDiagnostic({
					response,
					call,
					runId: params.runId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
					durationMs: toolDurationMs
				});
				pendingOpenClawDynamicToolCompletionIds.delete(call.callId);
				if (response.terminate === true) scheduleTurnReleaseAfterTerminalDynamicTool({
					call,
					response,
					durationMs: toolDurationMs
				});
				else if (!shouldBlockTerminalReleaseForNonTerminalDynamicToolResult(response)) scheduleTerminalDynamicToolReleaseCheck();
				else {
					currentTurnHadNonTerminalDynamicToolResult = true;
					pendingTerminalDynamicToolRelease = void 0;
				}
				return protocolResponse;
			} catch (error) {
				pendingOpenClawDynamicToolCompletionIds.delete(call.callId);
				if (!terminalDiagnosticObserved && !hasPendingDynamicToolTerminalDiagnostic({
					call,
					runId: params.runId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey
				})) emitDynamicToolErrorDiagnostic({
					call,
					runId: params.runId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
					durationMs: Math.max(0, Date.now() - toolStartedAt)
				});
				throw error;
			} finally {
				toolOutcomeOrdinals.delete(call.callId);
				unsubscribeToolDiagnosticObserver();
			}
		} finally {
			if (requestCountsAsTurnActivity) {
				activeAppServerTurnRequests = Math.max(0, activeAppServerTurnRequests - 1);
				const postToolContinuationTimeoutMs = request.method === "item/tool/call" && turnCrossedToolHandoff ? postToolRawAssistantCompletionIdleTimeoutMs : void 0;
				turnWatches.touchActivity(`request:${request.method}:response`, {
					arm: armCompletionWatchOnResponse,
					attemptProgress: true,
					...postToolContinuationTimeoutMs !== void 0 ? { attemptTimeoutMs: postToolContinuationTimeoutMs } : {}
				});
				if (armCompletionWatchOnResponse && postToolContinuationTimeoutMs !== void 0) turnWatches.armCompletionIdleWatch({ timeoutMs: postToolContinuationTimeoutMs });
				scheduleTerminalDynamicToolReleaseCheck();
			} else turnWatches.scheduleProgressWatches();
		}
	});
	const buildLlmInputEvent = () => ({
		runId: params.runId,
		sessionId: params.sessionId,
		provider: params.provider,
		model: params.modelId,
		systemPrompt: buildRenderedCodexDeveloperInstructions(),
		prompt: codexTurnPromptText,
		historyMessages: codexModelInputHistoryMessages,
		imagesCount: params.images?.length ?? 0,
		tools
	});
	const buildCodexModelInputMessages = () => [...codexModelInputHistoryMessages, buildCodexUserPromptMessage({
		...params,
		prompt: codexTurnPromptText
	})];
	const codexModelCallDiagnostics = createCodexModelCallDiagnosticEmitter({
		baseFields: {
			runId: params.runId,
			callId: codexModelCallId,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			sessionId: params.sessionId,
			provider: params.provider,
			model: params.modelId,
			api: params.model.api,
			transport: appServer.start.transport,
			...hookContextWindowFields,
			trace: codexModelCallTrace
		},
		capture: codexModelContentCapture,
		tools,
		buildInputMessages: buildCodexModelInputMessages,
		buildSystemPrompt: buildRenderedCodexDeveloperInstructions,
		onErrorDiagnostic: (error) => {
			log.debug("codex app-server model call diagnostic ended with error", { error: formatErrorMessage(error) });
		}
	});
	let turn;
	const throwIfTurnStartAcceptedAfterAbort = () => {
		if (!runAbortController.signal.aborted) return;
		const reason = runAbortController.signal.reason;
		if (reason instanceof Error) throw reason;
		const error = new Error(typeof reason === "string" && reason.length > 0 ? reason : "codex app-server turn start aborted before acceptance");
		error.name = "AbortError";
		throw error;
	};
	const startCodexTurn = async () => {
		const turnAppServer = withCodexAppServerFastModeServiceTier(pluginAppServer, params);
		pluginAppServer = turnAppServer;
		const turnStartParams = buildTurnStartParams(params, {
			threadId: thread.threadId,
			cwd: codexExecutionCwd,
			appServer: turnAppServer,
			promptText: codexTurnPromptText,
			sandboxPolicy: codexSandboxPolicy,
			environmentSelection: codexEnvironmentSelection,
			model: thread.model,
			modelProvider: thread.modelProvider,
			turnScopedDeveloperInstructions: workspaceBootstrapContext.turnScopedDeveloperInstructions,
			skillsCollaborationInstructions,
			memoryCollaborationInstructions: workspaceBootstrapContext.memoryCollaborationInstructions,
			heartbeatCollaborationInstructions: workspaceBootstrapContext.heartbeatCollaborationInstructions
		});
		codexModelCallDiagnostics.setRequestPayloadBytes(utf8JsonByteLength(turnStartParams));
		const startedTurn = assertCodexTurnStartResponse(await client.request("turn/start", turnStartParams, {
			timeoutMs: params.timeoutMs,
			signal: runAbortController.signal
		}));
		throwIfTurnStartAcceptedAfterAbort();
		return startedTurn;
	};
	const activeNativeTurnIds = thread.lifecycle.action === "resumed" ? thread.lifecycle.activeTurnIds ?? [] : [];
	if (activeNativeTurnIds.length > 0) {
		log.info("codex app-server resumed thread has active native turn; waiting before turn/start", {
			threadId: thread.threadId,
			activeTurnIds: activeNativeTurnIds
		});
		emitCodexAppServerEvent(params, {
			stream: "codex_app_server.lifecycle",
			data: {
				phase: "turn_start_waiting_for_native_turn",
				threadId: thread.threadId,
				activeTurnIds: activeNativeTurnIds
			}
		});
		if (!await waitForActiveNativeTurnCompletion(activeNativeTurnIds) && !runAbortController.signal.aborted) log.warn("codex app-server active native turn did not complete before turn/start wait timed out", {
			threadId: thread.threadId,
			activeTurnIds: activeNativeTurnIds
		});
	}
	try {
		codexModelCallDiagnostics.emitStarted();
		runAgentHarnessLlmInputHook({
			event: buildLlmInputEvent(),
			ctx: hookContext,
			hookRunner
		});
		emitCodexAppServerEvent(params, {
			stream: "codex_app_server.lifecycle",
			data: {
				phase: "turn_starting",
				threadId: thread.threadId
			}
		});
		turn = await startCodexTurn();
	} catch (error) {
		let turnStartError = error;
		if (isCodexActiveCompactTurnError(turnStartError)) {
			log.info("codex app-server turn/start blocked by active compact turn; waiting to retry", { threadId: thread.threadId });
			if (await waitForActiveNativeTurnCompletion() && !runAbortController.signal.aborted) {
				emitCodexAppServerEvent(params, {
					stream: "codex_app_server.lifecycle",
					data: {
						phase: "turn_start_retry_after_compact",
						threadId: thread.threadId
					}
				});
				try {
					turn = await startCodexTurn();
				} catch (retryError) {
					turnStartError = retryError;
				}
			}
		}
		if (turn === void 0 && shouldUseFreshCodexThreadAfterContextEngineOverflow({
			error: turnStartError,
			contextEngineActive: Boolean(activeContextEngine),
			thread
		}) && restartContextEngineCodexThread) {
			log.warn("codex app-server context-engine turn overflowed on resume; retrying with fresh thread", {
				threadId: thread.threadId,
				error: formatErrorMessage(turnStartError)
			});
			try {
				const preRetrySessionFile = activeSessionFile;
				const clearedPreRetryBinding = await clearCodexAppServerBindingForThread(preRetrySessionFile, thread.threadId);
				const clearedActiveBinding = activeSessionFile !== preRetrySessionFile ? await clearCodexAppServerBindingForThread(activeSessionFile, thread.threadId) : false;
				if (!clearedPreRetryBinding && !clearedActiveBinding) log.warn("codex app-server preserved newer context-engine binding after resume overflow; skipping fresh retry", {
					threadId: thread.threadId,
					error: formatErrorMessage(turnStartError)
				});
				else {
					thread = await restartContextEngineCodexThread();
					{
						const retryBinding = await readCodexAppServerBinding(activeSessionFile);
						if (retryBinding && retryBinding.threadId === thread.threadId && retryBinding.contextEngine?.projection) {
							const { schemaVersion: _schemaVersion, sessionFile: _boundSessionFile, updatedAt: _updatedAt, ...bindingForWrite } = retryBinding;
							await writeCodexAppServerBinding(activeSessionFile, {
								...bindingForWrite,
								contextEngine: bindingForWrite.contextEngine ? {
									...bindingForWrite.contextEngine,
									projection: void 0
								} : void 0
							});
							log.info("codex app-server cleared stale context-engine projection after overflow retry", {
								threadId: thread.threadId,
								previousEpoch: retryBinding.contextEngine.projection.epoch
							});
						}
					}
					emitCodexAppServerEvent(params, {
						stream: "codex_app_server.lifecycle",
						data: {
							phase: "thread_ready_retry",
							threadId: thread.threadId
						}
					});
					try {
						turn = await startCodexTurn();
					} catch (retryError) {
						turnStartError = retryError;
					}
				}
			} catch (retrySetupError) {
				turnStartError = retrySetupError;
			}
		}
		if (turn === void 0) {
			const usageLimitError = await formatCodexTurnStartUsageLimitError({
				client,
				error: turnStartError,
				pendingNotifications,
				timeoutMs: appServer.requestTimeoutMs,
				signal: runAbortController.signal
			});
			const turnStartErrorMessage = usageLimitError?.message ?? formatErrorMessage(turnStartError);
			if (isInvalidCodexImagePayloadError(turnStartErrorMessage)) await clearCodexBindingAfterInvalidImagePayload(activeSessionFile, {
				phase: "turn_start",
				threadId: thread.threadId,
				error: turnStartErrorMessage
			});
			emitCodexAppServerEvent(params, {
				stream: "codex_app_server.lifecycle",
				data: {
					phase: "turn_start_failed",
					error: turnStartErrorMessage
				}
			});
			trajectoryRecorder?.recordEvent("session.ended", {
				status: "error",
				threadId: thread.threadId,
				timedOut,
				aborted: runAbortController.signal.aborted,
				promptError: turnStartErrorMessage
			});
			markTrajectoryEndRecorded();
			runAgentHarnessLlmOutputHook({
				event: {
					runId: params.runId,
					sessionId: params.sessionId,
					provider: params.provider,
					model: params.modelId,
					...hookContextWindowFields,
					resolvedRef: params.runtimePlan?.observability.resolvedRef ?? `${params.provider}/${params.modelId}`,
					...params.runtimePlan?.observability.harnessId ? { harnessId: params.runtimePlan.observability.harnessId } : {},
					assistantTexts: []
				},
				ctx: hookContext,
				hookRunner
			});
			const turnStartFailureKind = classifyCodexModelCallFailureKind({
				error: turnStartError,
				timedOut,
				turnCompletionIdleTimedOut,
				runAborted: runAbortController.signal.aborted,
				abortReason: runAbortController.signal.reason,
				clientClosedAbort,
				formatError: formatErrorMessage
			});
			codexModelCallDiagnostics.emitError(turnStartErrorMessage, turnStartFailureKind ? { failureKind: turnStartFailureKind } : {});
			const turnStartFailureMessages = [...historyMessages, buildCodexUserPromptMessage({
				...params,
				prompt: codexTurnPromptText
			})];
			await runCodexAgentEndHook(params, {
				event: {
					messages: turnStartFailureMessages,
					success: false,
					error: turnStartErrorMessage,
					durationMs: Date.now() - attemptStartedAt
				},
				ctx: hookContext,
				hookRunner
			});
			if (!timedOut) await unsubscribeCodexThreadBestEffort(client, {
				threadId: thread.threadId,
				timeoutMs: CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS
			});
			notificationCleanup();
			requestCleanup();
			nativeHookRelay?.unregister();
			await releaseSandboxExecEnvironment();
			await runAgentCleanupStep({
				runId: params.runId,
				sessionId: params.sessionId,
				step: "codex-trajectory-flush-startup-failure",
				log,
				cleanup: async () => {
					await trajectoryRecorder?.flush();
				}
			});
			params.abortSignal?.removeEventListener("abort", abortFromUpstream);
			await releaseSharedClientLeaseAndRetireOneShotClient();
			if (usageLimitError) {
				await markCodexAuthProfileBlockedFromRateLimits({
					params,
					authProfileId: startupAuthProfileId,
					rateLimits: usageLimitError.rateLimitsForProfile
				});
				return { ...buildCodexTurnStartFailureResult({
					params,
					message: usageLimitError.message,
					messagesSnapshot: turnStartFailureMessages,
					systemPromptReport
				}) };
			}
			throw turnStartError;
		}
	}
	if (!turn) {
		await releaseSharedClientLeaseAndRetireOneShotClient();
		throw new Error("codex app-server turn/start failed without an error");
	}
	turnIdRef.current = turn.turn.id;
	const activeTurnId = turn.turn.id;
	let assistantStreamEventEmitted = false;
	let assistantStreamNeedsTerminalSnapshot = false;
	emitExecutionPhaseOnce("turn_accepted", { phase: "turn_accepted" });
	userInputBridgeRef.current = createCodexUserInputBridge({
		paramsForRun: params,
		threadId: thread.threadId,
		turnId: activeTurnId,
		signal: runAbortController.signal
	});
	trajectoryRecorder?.recordEvent("prompt.submitted", {
		threadId: thread.threadId,
		turnId: activeTurnId,
		prompt: codexTurnPromptText,
		imagesCount: params.images?.length ?? 0
	});
	projectorRef.current = new CodexAppServerEventProjector({
		...dynamicToolParams,
		onAgentEvent: (event) => {
			if (event.stream === "assistant" && typeof event.data.delta === "string") {
				assistantStreamEventEmitted = true;
				assistantStreamNeedsTerminalSnapshot ||= event.data.replaceable === true;
			}
			return dynamicToolParams.onAgentEvent?.(event);
		}
	}, thread.threadId, activeTurnId, {
		nativePostToolUseRelayEnabled: nativeHookRelay?.allowedEvents.includes("post_tool_use") === true && nativeHookRelay.shouldRelayEvent("post_tool_use"),
		trajectoryRecorder,
		onNativeToolResultRecorded: maybeAnnounceFastModeAutoOff
	});
	if (isTerminalTurnStatus(turn.turn.status) || pendingNotifications.some((notification) => isTerminalTurnNotificationForTurn(notification, activeTurnId))) terminalTurnNotificationQueued = true;
	const closeCleanup = client.addCloseHandler?.(() => {
		if (completed || terminalTurnNotificationQueued || runAbortController.signal.aborted) return;
		clientClosedPromptError = "codex app-server client closed before turn completed";
		trajectoryRecorder?.recordEvent("turn.client_closed", {
			threadId: thread.threadId,
			turnId: activeTurnId
		});
		log.warn("codex app-server client closed before turn completed", {
			threadId: thread.threadId,
			turnId: activeTurnId
		});
		clientClosedAbort = true;
		runAbortController.abort("client_closed");
		completed = true;
		turnWatches.clearAllTimers();
		resolveCompletion?.();
	});
	emitLifecycleStart();
	const activeProjector = projectorRef.current;
	if (!activeProjector) throw new Error("codex app-server projector was not initialized");
	turnWatches.armTerminalIdleWatch();
	turnWatches.touchActivity("turn:start", { arm: true });
	turnWatches.armAttemptIdleWatch();
	turnWatches.touchActivity("turn:start", { attemptProgress: true });
	for (const notification of pendingNotifications.splice(0)) await enqueueNotification(notification);
	if (!completed && isTerminalTurnStatus(turn.turn.status)) await enqueueNotification({
		method: "turn/completed",
		params: {
			threadId: thread.threadId,
			turnId: activeTurnId,
			turn: turn.turn
		}
	});
	const activeSteeringQueue = createCodexSteeringQueue({
		client,
		threadId: thread.threadId,
		turnId: activeTurnId,
		answerPendingUserInput: (text) => userInputBridgeRef.current?.handleQueuedMessage(text) ?? false,
		signal: runAbortController.signal
	});
	steeringQueueRef.current = activeSteeringQueue;
	const handle = {
		kind: "embedded",
		queueMessage: async (text, optionsLocal) => activeSteeringQueue.queue(text, optionsLocal),
		isStreaming: () => !completed && !runAbortController.signal.aborted,
		isCompacting: () => projectorRef.current?.isCompacting() ?? false,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		cancel: () => runAbortController.abort("cancelled"),
		abort: () => runAbortController.abort("aborted")
	};
	setActiveEmbeddedRun(params.sessionId, handle, params.sessionKey);
	const notifyUserMessagePersisted = createCodexAppServerUserMessagePersistenceNotifier(params);
	mirrorPromptAtTurnStartBestEffort({
		params,
		agentId: sessionAgentId,
		notifyUserMessagePersisted,
		sessionKey: sandboxSessionKey,
		cwd: effectiveCwd,
		threadId: thread.threadId,
		turnId: activeTurnId
	});
	const abortListener = () => {
		if (timedOut) {
			(async () => {
				await clearCodexAppServerBindingForThread(activeSessionFile, thread.threadId);
				await retireCodexAppServerClientAfterTimedOutTurn(client, {
					threadId: thread.threadId,
					turnId: activeTurnId,
					reason: String(runAbortController.signal.reason ?? "timeout")
				});
			})().finally(() => {
				resolveCompletion?.();
			});
			return;
		}
		interruptCodexTurnBestEffort(client, {
			threadId: thread.threadId,
			turnId: activeTurnId
		});
		resolveCompletion?.();
	};
	runAbortController.signal.addEventListener("abort", abortListener, { once: true });
	if (runAbortController.signal.aborted) abortListener();
	try {
		await completion;
		await notificationQueue;
		const result = activeProjector.buildResult(toolBridge.telemetry, { yieldDetected });
		const finalAborted = result.aborted || runAbortController.signal.aborted && !clientClosedAbort;
		const canUseCompletedAssistantTextAfterClientClose = activeProjector.hasCompletedTerminalAssistantText() && activeAppServerTurnRequests === 0 && activeTurnItemIds.size === 0 && pendingOpenClawDynamicToolCompletionIds.size === 0;
		const clientClosedPromptErrorForFinal = clientClosedPromptError && canUseCompletedAssistantTextAfterClientClose ? void 0 : clientClosedPromptError;
		let finalPromptError = clientClosedPromptErrorForFinal ?? (turnCompletionIdleTimedOut ? turnCompletionIdleTimeoutMessage : timedOut ? "codex app-server attempt timed out" : result.promptError);
		const finalPromptErrorMessage = typeof finalPromptError === "string" ? finalPromptError : finalPromptError ? formatErrorMessage(finalPromptError) : void 0;
		if (isInvalidCodexImagePayloadError(finalPromptErrorMessage)) await clearCodexBindingAfterInvalidImagePayload(activeSessionFile, {
			phase: "turn_completed",
			threadId: thread.threadId,
			turnId: activeTurnId,
			error: finalPromptErrorMessage
		});
		if (shouldUseFreshCodexThreadAfterContextEngineOverflow({
			error: finalPromptError,
			contextEngineActive: Boolean(activeContextEngine),
			thread
		})) {
			log.warn("codex app-server context-engine turn overflowed after resume; clearing thread binding for recovery", {
				threadId: thread.threadId,
				turnId: activeTurnId,
				error: finalPromptErrorMessage
			});
			const preClearSessionFile = activeSessionFile;
			await clearCodexAppServerBindingForThread(preClearSessionFile, thread.threadId);
			if (activeSessionFile !== preClearSessionFile) await clearCodexAppServerBindingForThread(activeSessionFile, thread.threadId);
		}
		const refreshedUsageLimitPromptError = await refreshCodexUsageLimitPromptError({
			client,
			message: finalPromptErrorMessage,
			timeoutMs: appServer.requestTimeoutMs,
			signal: runAbortController.signal
		});
		if (refreshedUsageLimitPromptError) finalPromptError = refreshedUsageLimitPromptError;
		const finalPromptErrorSource = timedOut || clientClosedPromptErrorForFinal ? "prompt" : result.promptErrorSource;
		const codexAppServerFailureKind = clientClosedPromptErrorForFinal ? "client_closed_before_turn_completed" : turnCompletionIdleTimedOut ? "turn_completion_idle_timeout" : void 0;
		const codexAppServerReplayBlockedReason = codexAppServerFailureKind ? resolveCodexAppServerReplayBlockedReason(result) : void 0;
		const promptTimeoutOutcome = buildCodexAppServerPromptTimeoutOutcome({
			result,
			turnCompletionIdleTimedOut,
			turnWatchTimeoutKind
		});
		const codexAppServerFailureDiagnostics = codexAppServerFailureKind === "turn_completion_idle_timeout" && turnWatchTimeoutKind === "completion" ? buildCodexAppServerTimeoutDiagnostics({
			idleMs: turnWatchTimeoutIdleMs,
			timeoutMs: turnWatchTimeoutMs,
			lastActivityReason: turnWatchTimeoutLastActivityReason,
			details: turnWatchTimeoutDetails
		}) : void 0;
		const modelCallFailureKind = classifyCodexModelCallFailureKind({
			error: finalPromptError,
			timedOut,
			turnCompletionIdleTimedOut,
			runAborted: runAbortController.signal.aborted,
			abortReason: runAbortController.signal.reason,
			clientClosedAbort,
			formatError: formatErrorMessage
		}) ?? (finalAborted ? "aborted" : void 0);
		if (modelCallFailureKind) codexModelCallDiagnostics.emitError(finalPromptError ?? "codex app-server attempt interrupted", { failureKind: modelCallFailureKind });
		else if (finalPromptError) codexModelCallDiagnostics.emitError(finalPromptError);
		else codexModelCallDiagnostics.emitCompleted(result);
		recordCodexTrajectoryCompletion(trajectoryRecorder, {
			attempt: params,
			result,
			threadId: thread.threadId,
			turnId: activeTurnId,
			timedOut,
			yieldDetected
		});
		trajectoryRecorder?.recordEvent("session.ended", {
			status: finalPromptError ? "error" : finalAborted || timedOut ? "interrupted" : "success",
			threadId: thread.threadId,
			turnId: activeTurnId,
			timedOut,
			yieldDetected,
			promptError: normalizeCodexTrajectoryError(finalPromptError)
		});
		markTrajectoryEndRecorded();
		await mirrorTranscriptBestEffort({
			params,
			agentId: sessionAgentId,
			notifyUserMessagePersisted,
			result,
			sessionKey: contextSessionKey,
			cwd: effectiveCwd,
			threadId: thread.threadId,
			turnId: activeTurnId
		});
		const terminalAssistantText = collectTerminalAssistantText(result);
		if (terminalAssistantText && (!assistantStreamEventEmitted || assistantStreamNeedsTerminalSnapshot) && !finalAborted && !finalPromptError) emitCodexAppServerEvent(params, {
			stream: "assistant",
			data: { text: terminalAssistantText }
		});
		if (finalPromptError) emitLifecycleTerminal({
			phase: "error",
			error: formatErrorMessage(finalPromptError)
		});
		else emitLifecycleTerminal({
			phase: "end",
			...finalAborted ? { aborted: true } : {}
		});
		if (activeContextEngine) {
			const activeContextEnginePluginIdLocal = resolveContextEngineOwnerPluginId(activeContextEngine);
			const finalMessages = await readMirroredSessionHistoryMessages(activeTranscriptTarget) ?? historyMessages.concat(result.messagesSnapshot);
			await finalizeHarnessContextEngineTurn({
				contextEngine: activeContextEngine,
				promptError: Boolean(finalPromptError),
				aborted: finalAborted,
				yieldAborted: Boolean(result.yieldDetected),
				sessionIdUsed: activeSessionId,
				sessionKey: contextSessionKey,
				sessionFile: activeSessionFile,
				messagesSnapshot: finalMessages,
				prePromptMessageCount,
				tokenBudget: params.contextTokenBudget,
				runtimeContext: buildHarnessContextEngineRuntimeContextFromUsage({
					attempt: buildActiveRunAttemptParams(),
					workspaceDir: effectiveWorkspace,
					cwd: effectiveCwd,
					agentDir,
					activeAgentId: sessionAgentId,
					contextEnginePluginId: activeContextEnginePluginIdLocal,
					tokenBudget: params.contextTokenBudget,
					lastCallUsage: result.attemptUsage,
					promptCache: result.promptCache
				}),
				contextEngineHostSupport: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
				providerId: params.provider,
				requestedModelId: params.requestedModelId,
				modelId: params.modelId,
				fallbackReason: params.fallbackReason,
				degradedReason: params.degradedReason,
				runMaintenance: runHarnessContextEngineMaintenance,
				config: params.config,
				warn: (message) => log.warn(message),
				isHeartbeat: params.bootstrapContextRunKind === "heartbeat"
			});
		}
		runAgentHarnessLlmOutputHook({
			event: {
				runId: params.runId,
				sessionId: params.sessionId,
				provider: params.provider,
				model: params.modelId,
				...hookContextWindowFields,
				resolvedRef: params.runtimePlan?.observability.resolvedRef ?? `${params.provider}/${params.modelId}`,
				...params.runtimePlan?.observability.harnessId ? { harnessId: params.runtimePlan.observability.harnessId } : {},
				assistantTexts: result.assistantTexts,
				...result.lastAssistant ? { lastAssistant: result.lastAssistant } : {},
				...result.attemptUsage ? { usage: result.attemptUsage } : {}
			},
			ctx: hookContext,
			hookRunner
		});
		await runCodexAgentEndHook(params, {
			event: {
				messages: result.messagesSnapshot,
				success: !finalAborted && !finalPromptError,
				...finalPromptError ? { error: formatErrorMessage(finalPromptError) } : {},
				durationMs: Date.now() - attemptStartedAt
			},
			ctx: hookContext,
			hookRunner
		});
		shouldDelayNativeHookRelayUnregister = activeProjector.getCompletedTurnStatus() === "completed" && !timedOut && !runAbortController.signal.aborted && !finalAborted && !finalPromptError;
		if (shouldDelayNativeHookRelayUnregister) await markCodexAppServerBindingCoveredThroughTurn({
			sessionFile: params.sessionFile,
			threadId: thread.threadId,
			authProfileStore: params.authProfileStore,
			agentDir: params.agentDir,
			config: params.config
		});
		return {
			...result,
			timedOut,
			aborted: finalAborted,
			promptError: finalPromptError,
			promptErrorSource: finalPromptErrorSource,
			...codexAppServerFailureKind ? { codexAppServerFailure: {
				kind: codexAppServerFailureKind,
				...codexAppServerFailureKind === "turn_completion_idle_timeout" && turnWatchTimeoutKind ? { turnWatchTimeoutKind } : {},
				transport: appServer.start.transport,
				threadId: thread.threadId,
				turnId: activeTurnId,
				replaySafe: codexAppServerReplayBlockedReason === void 0,
				...codexAppServerReplayBlockedReason ? { replayBlockedReason: codexAppServerReplayBlockedReason } : {},
				...codexAppServerFailureDiagnostics ? { diagnostics: codexAppServerFailureDiagnostics } : {}
			} } : {},
			...promptTimeoutOutcome ? { promptTimeoutOutcome } : {},
			systemPromptReport
		};
	} finally {
		if (params.isFinalFallbackAttempt !== false) await maybeEmitFastModeAutoResetBestEffort();
		codexModelCallDiagnostics.emitError("codex app-server run completed without model-call terminal event");
		emitLifecycleTerminal({
			phase: "error",
			error: "codex app-server run completed without lifecycle terminal event"
		});
		if (trajectoryRecorder && !trajectoryEndRecorded) trajectoryRecorder.recordEvent("session.ended", {
			status: timedOut || runAbortController.signal.aborted && !clientClosedAbort ? "interrupted" : "cleanup",
			threadId: thread.threadId,
			turnId: activeTurnId,
			timedOut,
			aborted: runAbortController.signal.aborted && !clientClosedAbort
		});
		await runAgentCleanupStep({
			runId: params.runId,
			sessionId: params.sessionId,
			step: "codex-trajectory-flush",
			log,
			cleanup: async () => {
				await trajectoryRecorder?.flush();
			}
		});
		if (!timedOut && !runAbortController.signal.aborted) await steeringQueueRef.current?.flushPending();
		if (!timedOut) await unsubscribeCodexThreadBestEffort(client, {
			threadId: thread.threadId,
			timeoutMs: CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS
		});
		userInputBridgeRef.current?.cancelPending();
		turnWatches.clearAllTimers();
		notificationCleanup();
		requestCleanup();
		closeCleanup?.();
		await releaseSharedClientLeaseAndRetireOneShotClient();
		if (nativeHookRelay) if (shouldDelayNativeHookRelayUnregister) scheduleCodexNativeHookRelayUnregister({
			relay: nativeHookRelay,
			hookTimeoutSec: options.nativeHookRelay?.hookTimeoutSec
		});
		else nativeHookRelay.unregister();
		await releaseSandboxExecEnvironment();
		runAbortController.signal.removeEventListener("abort", abortListener);
		params.abortSignal?.removeEventListener("abort", abortFromUpstream);
		steeringQueueRef.current?.cancel();
		clearActiveEmbeddedRun(params.sessionId, handle, params.sessionKey);
	}
}
function readDynamicToolCallParams(value) {
	return readCodexDynamicToolCallParams(value);
}
async function clearCodexBindingAfterInvalidImagePayload(sessionFile, fields) {
	const currentBinding = await readCodexAppServerBinding(sessionFile);
	if (fields.threadId && currentBinding && currentBinding.threadId !== fields.threadId) {
		log.warn("codex app-server image payload error detected for unbound thread; preserving thread binding", {
			...fields,
			boundThreadId: currentBinding.threadId
		});
		return;
	}
	log.warn("codex app-server image payload error detected; clearing thread binding", fields);
	await clearCodexAppServerBinding(sessionFile);
}
async function markCodexAppServerBindingCoveredThroughTurn(params) {
	const currentBinding = await readCodexAppServerBinding(params.sessionFile, {
		authProfileStore: params.authProfileStore,
		agentDir: params.agentDir,
		config: params.config
	});
	if (!currentBinding || currentBinding.threadId !== params.threadId) return;
	const { schemaVersion: _schemaVersion, sessionFile: _boundSessionFile, updatedAt: _updatedAt, ...bindingForWrite } = currentBinding;
	await writeCodexAppServerBinding(params.sessionFile, bindingForWrite, {
		authProfileStore: params.authProfileStore,
		agentDir: params.agentDir,
		config: params.config
	});
}
function isNonEmptyString(value) {
	return typeof value === "string" && value.length > 0;
}
function canAttributeUnscopedNativeResponseDeltaToThisTurn(client) {
	const activeLeases = client.getActiveSharedLeaseCountForUnscopedNotifications?.();
	return activeLeases === void 0 || activeLeases <= 1;
}
function isUnscopedCodexNotification(correlation) {
	return !correlation.threadId && !correlation.turnId && !correlation.nestedTurnThreadId && !correlation.nestedTurnId;
}
function shouldUseFreshCodexThreadAfterContextEngineOverflow(params) {
	if (!params.contextEngineActive || params.thread.lifecycle.action !== "resumed") return false;
	return isCodexContextWindowError(params.error);
}
function isCodexContextWindowError(error) {
	const message = formatErrorMessage(error);
	return /ran out of room in the model'?s context window/iu.test(message) || /context window/iu.test(message) || /context length/iu.test(message) || /maximum context/iu.test(message) || /too many tokens/iu.test(message);
}
function isCodexActiveCompactTurnError(error) {
	if (!(error instanceof CodexAppServerRpcError)) return false;
	const data = isJsonObject(error.data) ? error.data : void 0;
	const codexErrorInfo = isJsonObject(data?.codexErrorInfo) ? data.codexErrorInfo : void 0;
	return (isJsonObject(codexErrorInfo?.activeTurnNotSteerable) ? codexErrorInfo.activeTurnNotSteerable : void 0)?.turnKind === "compact";
}
function isCodexThreadTurnCompletedNotification(notification, threadId, turnIds) {
	if (notification.method !== "turn/completed") return false;
	const correlation = describeCodexNotificationCorrelation(notification, { threadId });
	if (!correlation.matchesActiveThread) return false;
	const turnId = correlation.turnId ?? correlation.nestedTurnId;
	return !turnIds || turnId !== void 0 && turnIds.has(turnId);
}
function joinPresentSections(...sections) {
	return sections.filter((section) => Boolean(section?.trim())).join("\n\n");
}
function prependCurrentInboundContext(prompt, context) {
	const text = context?.text.trim();
	return text ? [text, prompt].filter(Boolean).join("\n\n") : prompt;
}
function waitForCodexNotificationDispatchTurn() {
	return new Promise((resolve) => {
		setImmediate(resolve);
	});
}
function buildCodexAppServerTimeoutDiagnostics(params) {
	const readString = (key) => {
		const value = params.details?.[key];
		return typeof value === "string" && value.trim() ? value : void 0;
	};
	const readNumber = (key) => {
		const value = params.details?.[key];
		return typeof value === "number" && Number.isFinite(value) ? value : void 0;
	};
	const readBoolean = (key) => {
		const value = params.details?.[key];
		return typeof value === "boolean" ? value : void 0;
	};
	return {
		...params.idleMs !== void 0 ? { idleMs: params.idleMs } : {},
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
		...params.lastActivityReason ? { lastActivityReason: params.lastActivityReason } : {},
		...readString("lastNotificationMethod") ? { lastNotificationMethod: readString("lastNotificationMethod") } : {},
		...readString("lastNotificationItemId") ? { lastNotificationItemId: readString("lastNotificationItemId") } : {},
		...readString("lastNotificationItemType") ? { lastNotificationItemType: readString("lastNotificationItemType") } : {},
		...readString("lastNotificationItemRole") ? { lastNotificationItemRole: readString("lastNotificationItemRole") } : {},
		...readString("lastAssistantTextPreview") ? { lastAssistantTextPreview: readString("lastAssistantTextPreview") } : {},
		...readNumber("activeAppServerTurnRequests") !== void 0 ? { activeAppServerTurnRequests: readNumber("activeAppServerTurnRequests") } : {},
		...readNumber("activeTurnItemCount") !== void 0 ? { activeTurnItemCount: readNumber("activeTurnItemCount") } : {},
		...readBoolean("terminalTurnNotificationQueued") !== void 0 ? { terminalTurnNotificationQueued: readBoolean("terminalTurnNotificationQueued") } : {},
		...readBoolean("completionIdleWatchArmed") !== void 0 ? { completionIdleWatchArmed: readBoolean("completionIdleWatchArmed") } : {},
		...readBoolean("assistantCompletionIdleWatchArmed") !== void 0 ? { assistantCompletionIdleWatchArmed: readBoolean("assistantCompletionIdleWatchArmed") } : {},
		...readBoolean("terminalIdleWatchArmed") !== void 0 ? { terminalIdleWatchArmed: readBoolean("terminalIdleWatchArmed") } : {}
	};
}
function handleApprovalRequest(params) {
	return handleCodexAppServerApprovalRequest({
		method: params.method,
		requestParams: params.params,
		paramsForRun: params.paramsForRun,
		threadId: params.threadId,
		turnId: params.turnId,
		nativeHookRelay: params.nativeHookRelay,
		execPolicy: params.execPolicy,
		execReviewerAgentId: params.execReviewerAgentId,
		internalExecAutoReview: params.internalExecAutoReview,
		autoApprove: params.autoApprove,
		signal: params.signal
	});
}
function resolveCodexDynamicToolDirectNames(params) {
	if (params.sourceReplyDeliveryMode !== "message_tool_only") return [];
	return ["message"];
}
//#endregion
export { runCodexAppServerAttempt };
