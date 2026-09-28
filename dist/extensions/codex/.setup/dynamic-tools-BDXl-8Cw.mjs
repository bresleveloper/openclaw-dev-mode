import { CODEX_NATIVE_TOOL_REQUIREMENTS } from "../native-tool-policy.js";
import { d as readCodexPluginConfig, l as isCodexRemoteExecPlacementSandbox } from "./config-parsing-CcB9iPoq.mjs";
import { i as isJsonObject, r as flattenCodexDynamicToolFunctions, t as CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE } from "./protocol-CANUwXJ3.mjs";
import { o as formatCodexDisplayText } from "./command-formatters-Bmqvr9tO.mjs";
import { S as readItem, c as itemName, f as shouldClearTerminalPresentationForNativeItem, l as itemStatus, n as auditNativeToolTerminalStatus, r as auditNativeToolUnfinishedStatus, t as auditNativeToolName } from "./event-projector-items-C6L_5ZiT.mjs";
import { s as codexAppIdentityKey } from "./plugin-app-cache-key-B2CsSdnV.mjs";
import "./config-BoTP_mrL.mjs";
import { r as sanitizeInlineImageDataUrl, t as invalidInlineImageText } from "./image-payload-sanitizer-tupAr-2o.mjs";
import { V as protectCodexAppServerLiveThread, v as retainSharedCodexAppServerClientIfCurrent } from "./shared-client-DA4VR4Eb.mjs";
import { E as createCodexElicitationResponse, L as resolveCodexToolAbortTerminalReason, R as createFailedDynamicToolResponse, T as readCodexTurnCompletedNotification, m as CodexServerRequestResolvedError, z as failedToolResult } from "./client-Cs08OXVQ.mjs";
import { b as readCodexNotificationTurnId, v as isCodexNotificationForTurn, y as readCodexNotificationThreadId } from "./attempt-client-cleanup-CEv1cKwF.mjs";
import { A as emitCodexNativePreToolUseFailureDiagnostic, at as filterCodexDynamicTools, lt as isSystemAgentOnlyCodexDynamicToolAllowlist, ot as filterCodexDynamicToolsForDisabledNativeSurface, p as resolveCodexWebSearchPlan, st as isForcedPrivateQaCodexRuntime, ut as normalizeCodexDynamicToolName } from "./thread-requests-BLvGkP2R.mjs";
import { n as resolveCodexNativeExecutionPolicy, r as resolveCodexNodeExecToolOverrides } from "./native-execution-policy-umd0tgh4.mjs";
import { a as CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME, c as createNodeExecAliasDynamicTool, d as isCodexDynamicToolExcluded, i as CODEX_GATEWAY_PROCESS_DYNAMIC_TOOL_NAME, l as createSandboxExecProjection, o as createGatewayExecProjection, r as CODEX_GATEWAY_EXEC_DYNAMIC_TOOL_NAME, s as createGatewayProcessProjection, u as createSandboxProcessProjection } from "./provider-capabilities-BfE88FZ5.mjs";
import { a as requestPluginApprovalOutcome, c as truncateCodexApprovalDisplayText, i as requestPluginApproval, l as waitForPluginApprovalDecision, n as codexApprovalTimeoutText, o as sanitizeCodexApprovalVisibleText, r as mapExecDecisionToOutcome, s as stripDanglingCodexApprovalTerminalSequence, t as approvalRequestExplicitlyUnavailable } from "./plugin-approval-roundtrip-C0MZzCuP.mjs";
import { createRequire } from "node:module";
import { asNonArrayRecord, asOptionalRecord, isRecord, normalizeTrimmedStringList, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash, randomUUID } from "node:crypto";
import { asDateTimestampMs } from "openclaw/plugin-sdk/number-runtime";
import { signalProcessTree, spawnTerminalPty } from "openclaw/plugin-sdk/process-runtime";
import { validateJsonSchemaValue } from "openclaw/plugin-sdk/json-schema-runtime";
import path, { posix } from "node:path";
import { isPathStrictlyInside, root } from "openclaw/plugin-sdk/file-access-runtime";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { coerceErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS, estimateToolResultTextChars, resolveLiveToolResultMaxChars, sliceToolResultTextToBudget, sliceUtf16Safe, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { emitTrustedDiagnosticEvent } from "openclaw/plugin-sdk/diagnostic-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { createStageTimingTracker, formatStageTimings } from "openclaw/plugin-sdk/time-runtime";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolveAgentDir } from "openclaw/plugin-sdk/agent-runtime";
import { HEARTBEAT_RESPONSE_TOOL_NAME, applyEmbeddedAttemptToolsAllow, buildAgentHookContextChannelFields, buildEmbeddedAttemptToolRunContext, consumeAdjustedParamsForToolCall, consumePreExecutionBlockedToolCall, createAgentToolResultMiddlewareRunner, createCodexAppServerToolResultExtensionRunner, embeddedAgentLog, extractMessagingToolSend, extractMessagingToolSendResult, extractMessagingToolSourceReplyPayload, extractToolResultMediaArtifact, filterProviderNormalizableTools, filterToolResultMediaUrls, finalizeAgentToolAvailability, finalizeToolTerminalPresentation, formatApprovalDisplayPath, formatToolExecutionErrorMessage, getBeforeToolCallFailureDisposition, getChannelAgentToolMeta, getPluginToolMeta, getPluginToolSideEffectOwnerKey, hasNativeHookRelayInvocation, invokeNativeHookRelay, isDeliveredMessageToolOnlySourceReplyResult, isDeliveredMessagingToolResult, isDeliveredMessagingToolSendToCurrentSource, isHostScopedAgentToolActive, isMessagingTool, isReplaySafeToolCall, isSubagentSessionKey, isToolResultError, isToolWrappedWithBeforeToolCallHook, normalizeAgentRuntimeTools, normalizeHeartbeatToolResponse, projectPluginMessageDeliveryFact, projectRuntimeToolInputSchema, readEmbeddedMessageDeliveryFact, readToolOperatorHint, resolveAttemptSpawnWorkspaceDir, resolveModelAuthMode, resolveNativeHookRelayDeferredToolApproval, resolveToolExecutionErrorKind, resolveToolResultFailureKind, runAgentHarnessAfterToolCallHook, sanitizeToolResult, setBeforeToolCallDiagnosticsEnabled, supportsModelTools, wrapToolWithBeforeToolCallHook } from "openclaw/plugin-sdk/agent-harness-runtime";
import { formatErrorMessage as formatErrorMessage$2, redactSensitiveText } from "openclaw/plugin-sdk/security-runtime";
import { consumeTrustedToolNoStartError, copyInternalToolResultState, getCoreTtsToolResultMediaUrls, normalizeAcceptedSessionSpawnResult } from "openclaw/plugin-sdk/agent-harness-tool-runtime";
import { isIP } from "node:net";
import { redactToolPayloadText } from "openclaw/plugin-sdk/logging-core";
import { formatMcpCodexApprovalRemedy, requiresMcpCodexToolApproval, resolveCodexScheduledToolProjectionFactory, resolveProjectedMcpCodexToolApprovalMode, runWithCronCreatorAuthorityCapabilityResolver } from "openclaw/plugin-sdk/codex-mcp-projection";
import { SANDBOX_COMMAND_MAX_BUFFER_BYTES, buildRemoteCommand, isToolAllowed, prepareSandboxProcessCleanup, sanitizeEnvVars } from "openclaw/plugin-sdk/sandbox";
import { SsrFBlockedError, isBlockedHostnameOrIp } from "openclaw/plugin-sdk/ssrf-runtime";
import { normalizeMediaReferenceForComparison, saveMediaBuffer } from "openclaw/plugin-sdk/media-store";
import { getMediaDir } from "openclaw/plugin-sdk/media-runtime";
import { normalizeOpenAIStrictCompatSchema } from "openclaw/plugin-sdk/provider-tools";
//#region extensions/codex/src/app-server/remote-workspace-path.ts
/** Projects a gateway workspace path into the remote Codex execution workspace. */
function mapCodexAppServerRemoteWorkspacePath(params) {
	if (!params.remoteWorkspaceRoot) return params.value;
	const localRoot = normalizeWorkspaceMatchPath(params.localWorkspaceRoot);
	const remoteRoot = normalizeWorkspaceMatchPath(params.remoteWorkspaceRoot);
	const normalizedValue = normalizeWorkspaceMatchPath(params.value);
	if (!localRoot || !remoteRoot) throw new Error("Codex remoteWorkspaceRoot requires non-empty workspace roots.");
	if (normalizedValue === localRoot) return remoteRoot;
	const prefix = `${localRoot}/`;
	if (!normalizedValue.startsWith(prefix)) throw new Error(`Codex remoteWorkspaceRoot is configured but cwd ${params.value} is outside OpenClaw workspace root ${params.localWorkspaceRoot}; refusing to send a gateway-local cwd to the remote Codex app-server.`);
	return joinRemoteWorkspacePath(remoteRoot, normalizedValue.slice(prefix.length));
}
/** Maps a remote workspace artifact back into the corresponding gateway workspace. */
function mapCodexAppServerLocalWorkspacePath(params) {
	if (!params.remoteWorkspaceRoot) return params.value;
	const localRoot = normalizeWorkspaceMatchPath(params.localWorkspaceRoot);
	const remoteRoot = normalizeWorkspaceMatchPath(params.remoteWorkspaceRoot);
	if (!localRoot || !remoteRoot) throw new Error("Codex remoteWorkspaceRoot requires non-empty workspace roots.");
	const normalizedValue = normalizeWorkspaceMatchPath(params.value);
	if (!normalizedValue || isCodexPassThroughMediaSource(normalizedValue)) return params.value;
	const usesWindowsPaths = /^[a-z]:\//iu.test(remoteRoot) || remoteRoot.startsWith("//");
	const matchValue = usesWindowsPaths ? normalizedValue.toLowerCase() : normalizedValue;
	const matchRoot = usesWindowsPaths ? remoteRoot.toLowerCase() : remoteRoot;
	if (matchValue === matchRoot) return params.localWorkspaceRoot;
	const prefix = matchRoot.endsWith("/") ? matchRoot : `${matchRoot}/`;
	const isRemoteWorkspacePath = matchValue.startsWith(prefix);
	if (!isRemoteWorkspacePath && isAbsoluteWorkspacePath(normalizedValue)) throw new Error(`Codex remote workspace artifact ${params.value} is outside ${params.remoteWorkspaceRoot}.`);
	const suffixSegments = (isRemoteWorkspacePath ? normalizedValue.slice(prefix.length) : normalizedValue).split("/");
	if (suffixSegments.some((segment) => segment === "..")) throw new Error(`Codex remote workspace artifact ${params.value} must stay inside ${params.remoteWorkspaceRoot}.`);
	return path.join(params.localWorkspaceRoot, ...suffixSegments.filter((segment) => segment !== "."));
}
function normalizeWorkspaceMatchPath(value) {
	const normalized = value.replace(/\\/gu, "/");
	if (/^[a-z]:\/$/iu.test(normalized)) return normalized;
	return normalized.length > 1 ? normalized.replace(/[\\/]+$/u, "") : normalized;
}
/** Keeps remote URLs and opaque managed media references out of workspace path mapping. */
function isCodexPassThroughMediaSource(value) {
	return /^(?:https?|mxc|buffer|media):\/\//iu.test(value) || /^data:/iu.test(value);
}
function isAbsoluteWorkspacePath(value) {
	return value.startsWith("/") || /^[a-z]:\//iu.test(value) || /^[a-z][a-z0-9+.-]*:/iu.test(value);
}
function joinRemoteWorkspacePath(remoteRoot, suffix) {
	return remoteRoot.endsWith("/") ? `${remoteRoot}${suffix}` : `${remoteRoot}/${suffix}`;
}
//#endregion
//#region extensions/codex/src/app-server/vision-tools.ts
/**
* Codex's enabled native surface includes its stable view_image loader. Keep
* OpenClaw's view_image tool only when that surface or model vision is unavailable.
*/
function filterCodexVisionTools(tools, params) {
	if (!params.modelHasVision || !params.nativeImageInspectionEnabled) return tools;
	return tools.filter((tool) => tool.name !== "view_image");
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-build.ts
/**
* Builds the Codex app-server dynamic tool list for one turn, including
* OpenClaw-owned tools, Codex native-tool fallback rules, sandbox shell shims,
* and provider allowlist normalization.
*/
const CODEX_MEMORY_FLUSH_DYNAMIC_TOOL_ALLOW = /* @__PURE__ */ new Set(["read", "write"]);
const CODEX_DISABLED_NATIVE_SHELL_DYNAMIC_TOOLS = /* @__PURE__ */ new Set([
	"exec",
	"process",
	"sandbox_exec",
	"sandbox_process",
	CODEX_GATEWAY_EXEC_DYNAMIC_TOOL_NAME,
	CODEX_GATEWAY_PROCESS_DYNAMIC_TOOL_NAME,
	CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME
]);
/** Keeps node filesystem and process ownership on its native exec-server. */
function resolveCodexNodePlacementToolConstructionPlan(sandbox, nativeToolSurfaceEnabled) {
	if (!isCodexRemoteExecPlacementSandbox(sandbox) || sandbox?.backendId !== "node" || !("placementNodeId" in sandbox) || typeof sandbox.placementNodeId !== "string" || !sandbox.placementNodeId) return;
	if (!nativeToolSurfaceEnabled) throw new Error("Codex node execution requires its native exec-server tool surface; adjust the session tool policy and start a fresh attempt.");
	return {
		includeBaseCodingTools: false,
		includeShellTools: false,
		includeChannelTools: true,
		includeOpenClawTools: true,
		includePluginTools: true
	};
}
function preserveRingZeroSystemAgentTool(allTools, filteredTools) {
	const openclaw = allTools.find((tool) => tool.name === "openclaw" && tool.catalogMode === "direct-only");
	if (!openclaw) return filteredTools;
	return [openclaw, ...filteredTools.filter((tool) => tool.name !== "openclaw")];
}
/** Returns the canonical channel used for Codex message routing and receipts. */
function resolveCodexMessageToolProvider(params) {
	return params.messageChannel ?? params.messageProvider;
}
/** Resolves the channel id that hook events should target for this Codex app-server turn. */
function resolveCodexAppServerHookChannelId(params, sandboxSessionKey) {
	return buildAgentHookContextChannelFields({
		sessionKey: sandboxSessionKey,
		messageChannel: params.messageChannel,
		messageProvider: params.messageProvider,
		currentChannelId: params.currentChannelId,
		messageTo: params.messageTo
	}).channelId;
}
const CODEX_DYNAMIC_TOOL_BUILD_WARN_TOTAL_MS = 1e3;
const CODEX_DYNAMIC_TOOL_BUILD_WARN_STAGE_MS = 500;
/** Captures bounded preparation stages before a slow turn needs diagnosis. */
function createCodexDynamicToolBuildStageTracker() {
	const { mark, snapshot } = createStageTimingTracker();
	return {
		mark,
		snapshot
	};
}
/** Returns true when dynamic-tool construction is slow enough to warrant a warning log. */
function shouldWarnCodexDynamicToolBuildStageSummary(summary, profilerEnabled = false) {
	const totalWarnMs = profilerEnabled ? CODEX_DYNAMIC_TOOL_BUILD_WARN_TOTAL_MS : 1e4;
	const stageWarnMs = profilerEnabled ? CODEX_DYNAMIC_TOOL_BUILD_WARN_STAGE_MS : 5e3;
	return summary.totalMs >= totalWarnMs || summary.stages.some((stage) => stage.durationMs >= stageWarnMs);
}
/** Formats per-stage timings into the compact form used by Codex app-server logs. */
function formatCodexDynamicToolBuildStageSummary(summary) {
	return formatStageTimings(summary.stages);
}
/** Builds, filters, and normalizes Codex-compatible runtime tools for a single turn. */
async function buildDynamicTools(input) {
	const { params } = input;
	const messagePolicyParams = input.ignoreDisableMessageTool ? {
		...params,
		disableMessageTool: false
	} : params;
	const toolRunContext = buildEmbeddedAttemptToolRunContext({
		...params,
		forceMessageTool: shouldForceMessageTool(messagePolicyParams)
	});
	if (params.disableTools) {
		input.onWebSearchPolicyResolved?.(false);
		return [];
	}
	if (!supportsModelTools(params.model)) {
		input.onPersistentWebSearchPolicyResolved?.(false);
		input.onWebSearchPolicyResolved?.(false);
		return [];
	}
	const toolBuildStages = createCodexDynamicToolBuildStageTracker();
	const modelHasVision = params.model.input?.includes("image") ?? false;
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, input.sessionAgentId);
	const nativeExecutionPolicy = resolveCodexNativeExecutionPolicyForRun(params, {
		agentId: input.policyAgentId,
		runtimeSessionKey: input.sandboxSessionKey,
		sandbox: input.sandbox
	});
	const webSearchPlan = resolveCodexWebSearchPlan({
		config: params.config,
		disableTools: params.disableTools,
		nativeToolSurfaceEnabled: input.nativeToolSurfaceEnabled,
		nativeProviderWebSearchSupport: input.nativeProviderWebSearchSupport
	});
	const messageToolProvider = resolveCodexMessageToolProvider(params);
	const webFetchHostnameAllowlistRef = {};
	const toolConstructionPlan = resolveCodexNodePlacementToolConstructionPlan(input.sandbox, input.nativeToolSurfaceEnabled);
	const options = {
		agentId: input.sessionAgentId,
		policyAgentId: input.policyAgentId,
		...toolRunContext,
		exec: {
			...params.execOverrides,
			...input.sessionPermissionPolicy ? { mode: input.sessionPermissionPolicy.execMode } : {},
			...resolveCodexNodeExecToolOverrides(nativeExecutionPolicy),
			config: params.config,
			elevated: params.bashElevated
		},
		sessionPermissionPolicy: input.sessionPermissionPolicy ? {
			mode: input.sessionPermissionPolicy.mode,
			root: input.sessionPermissionPolicy.root
		} : void 0,
		sandbox: input.sandbox,
		...toolConstructionPlan ? { toolConstructionPlan } : {},
		messageProvider: messageToolProvider,
		toolPolicyMessageProvider: params.messageProvider ?? params.messageChannel,
		...params.onToolResult ? { questionPrompt: {
			send: params.onToolResult,
			messageChannel: messageToolProvider
		} } : {},
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		allowGatewaySubagentBinding: params.allowGatewaySubagentBinding || isForcedPrivateQaCodexRuntime(),
		sessionKey: input.sandboxSessionKey,
		runSessionKey: params.sessionKey && params.sessionKey !== input.sandboxSessionKey ? params.sessionKey : void 0,
		sessionId: params.sessionId,
		runId: params.runId,
		agentDir,
		preparedModelRuntime: params.preparedModelRuntime,
		cwd: input.effectiveCwd ?? input.effectiveWorkspace,
		workspaceDir: input.effectiveWorkspace,
		spawnWorkspaceDir: input.effectiveCwd && input.effectiveCwd !== input.effectiveWorkspace ? input.resolvedWorkspace : resolveAttemptSpawnWorkspaceDir({
			sandbox: input.sandbox,
			resolvedWorkspace: input.resolvedWorkspace
		}),
		config: params.config,
		skillsSnapshot: params.skillsSnapshot,
		...params.skillLibraryAuthoring ? { skillWorkshop: { libraryAuthoring: params.skillLibraryAuthoring } } : {},
		authProfileStore: params.toolAuthProfileStore ?? params.authProfileStore,
		abortSignal: input.runAbortController.signal,
		emitBeforeToolCallDiagnostics: false,
		modelProvider: params.model.provider,
		modelId: params.modelId,
		modelCompat: params.model.compat && typeof params.model.compat === "object" ? params.model.compat : void 0,
		modelApi: params.model.api,
		modelContextWindowTokens: params.model.contextWindow,
		delegationCapability: params.delegationCapability,
		modelAuthMode: resolveModelAuthMode(params.model.provider, params.config, params.toolAuthProfileStore ?? params.authProfileStore, { workspaceDir: input.effectiveWorkspace }),
		suppressManagedWebSearch: false,
		webFetchHostnameAllowlistRef,
		hookChannelId: resolveCodexAppServerHookChannelId(params, input.sandboxSessionKey),
		modelHasVision,
		computerContextEpoch: input.computerContextEpoch,
		oneShotCliRun: params.oneShotCliRun,
		registerRunCleanup: input.registerRunCleanup,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget ?? isSubagentSessionKey(params.sessionKey),
		disableMessageTool: input.ignoreDisableMessageTool ? false : params.disableMessageTool,
		forceMessageTool: shouldForceMessageTool(messagePolicyParams),
		enableHeartbeatTool: params.trigger === "heartbeat" || input.forceHeartbeatTool === true,
		forceHeartbeatTool: params.trigger === "heartbeat" || input.forceHeartbeatTool === true,
		onYield: (message, acknowledgment) => {
			input.onYieldDetected(message, acknowledgment);
			input.onCodexAppServerEvent?.({
				stream: "codex_app_server.tool",
				data: {
					name: "sessions_yield",
					message
				}
			});
		},
		claimYieldCompletion: input.claimYieldCompletion,
		recordToolPrepStage: (name) => {
			toolBuildStages.mark(name);
		},
		onToolOutcome: params.onToolOutcome,
		isTurnTainted: params.isTurnTainted,
		allocateToolOutcomeOrdinal: params.allocateToolOutcomeOrdinal,
		cronCreatorToolAllowlistRef: input.cronCreatorToolAllowlistRef,
		cronCreatorToolAllowlistCaptureRef: input.cronCreatorToolAllowlistCaptureRef,
		cronCreatorAuthorityUnavailableReason: input.cronCreatorAuthorityUnavailableReason
	};
	input.onMessageToolTargetResolved?.(options.requireExplicitMessageTarget === true);
	const buildOpenClawCodingTools = () => {
		const bindingOptions = { cwd: input.effectiveCwd ?? input.effectiveWorkspace };
		const createToolSurface = params.hostCapabilities.createToolSurface;
		if (!createToolSurface) throw new Error("Codex tool construction requires a current host capability");
		return createToolSurface(options, bindingOptions);
	};
	const allTools = input.resolveCronCreatorToolAuthority ? runWithCronCreatorAuthorityCapabilityResolver({
		capability: params.cronCreatorAuthorityCapability,
		runId: params.runId,
		resolve: input.resolveCronCreatorToolAuthority,
		run: buildOpenClawCodingTools
	}) : buildOpenClawCodingTools();
	toolBuildStages.mark("create-openclaw-coding-tools");
	const preNormalizationDiagnostics = [];
	const readableAllToolProjection = filterProviderNormalizableTools(allTools);
	preNormalizationDiagnostics.push(...readableAllToolProjection.diagnostics);
	const readableAllTools = [...readableAllToolProjection.tools];
	const normallyProfiledTools = input.nativeToolSurfaceEnabled === false ? filterCodexDynamicToolsForDisabledNativeSurface(readableAllTools, input.pluginConfig, { preserveShell: shouldKeepOpenClawShellDynamicTools(input, nativeExecutionPolicy) }) : filterCodexDynamicTools(readableAllTools, input.pluginConfig);
	const profileFilteredTools = (input.isHostScopedToolActive?.("openclaw") ?? isHostScopedAgentToolActive("openclaw")) && isSystemAgentOnlyCodexDynamicToolAllowlist(params.toolsAllow) ? preserveRingZeroSystemAgentTool(readableAllTools, normallyProfiledTools) : normallyProfiledTools;
	const codexFilteredTools = await addNodeShellDynamicToolsIfNeeded(addGatewayShellDynamicToolsIfAvailable(addSandboxShellDynamicToolsIfAvailable(isCodexMemoryFlushRun(params) ? filterCodexMemoryFlushDynamicTools(readableAllTools) : profileFilteredTools, readableAllTools, input, nativeExecutionPolicy), readableAllTools, input, nativeExecutionPolicy), readableAllTools, input, nativeExecutionPolicy);
	toolBuildStages.mark("codex-filtering");
	const visionFilteredTools = filterCodexVisionTools(codexFilteredTools, {
		modelHasVision,
		nativeImageInspectionEnabled: input.nativeToolSurfaceEnabled === true
	});
	toolBuildStages.mark("vision-filtering");
	const webSearchPresent = visionFilteredTools.some((tool) => tool.name === "web_search");
	const persistentCodexWebSearchSurface = params.config?.tools?.web?.search?.enabled !== false && !(input.pluginConfig.codexDynamicToolsExclude ?? []).some((name) => normalizeCodexDynamicToolName(name) === "web_search");
	let persistentWebSearchAllowed = webSearchPresent;
	if (input.onPersistentWebSearchPolicyResolved && !webSearchPresent && persistentCodexWebSearchSurface) {
		const webSearchPolicy = (await import("openclaw/plugin-sdk/agent-harness")).resolveWebSearchToolPolicy({
			config: params.config,
			modelProvider: params.model.provider,
			modelId: params.modelId,
			agentId: input.policyAgentId,
			sessionKey: input.sandboxSessionKey,
			sandboxToolPolicy: input.sandbox?.tools,
			messageProvider: messageToolProvider,
			agentAccountId: params.agentAccountId,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			spawnedBy: params.spawnedBy,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			inputProvenance: params.inputProvenance,
			trustedInternalHandoff: params.trustedInternalHandoff,
			scheduledToolPolicy: params.scheduledToolPolicy
		});
		persistentWebSearchAllowed = webSearchPolicy.persistentAllowed && (!webSearchPolicy.allowed || isCodexMemoryFlushRun(params));
	}
	input.onPersistentWebSearchPolicyResolved?.(persistentWebSearchAllowed);
	const filteredTools = filterCodexDynamicToolsForAllowlist(visionFilteredTools, toolRunContext.runtimeToolAllowlist);
	toolBuildStages.mark("allowlist-filter");
	const normalizedTools = normalizeAgentRuntimeTools({
		runtimePlan: input.ignoreRuntimePlan ? void 0 : params.runtimePlan,
		tools: filteredTools,
		provider: params.provider,
		config: params.config,
		workspaceDir: input.effectiveWorkspace,
		env: process.env,
		modelId: params.modelId,
		modelApi: params.model.api,
		model: params.model,
		allowProviderRuntimePluginLoad: input.ignoreRuntimePlan ? false : void 0,
		onPreNormalizationSchemaDiagnostics: (diagnostics) => preNormalizationDiagnostics.push(...diagnostics)
	});
	toolBuildStages.mark("runtime-normalization");
	const webSearchAllowed = normalizedTools.some((tool) => tool.name === "web_search");
	webFetchHostnameAllowlistRef.value = webSearchAllowed ? webSearchPlan.webFetchHostnameAllowlist : void 0;
	input.onWebSearchPolicyResolved?.(webSearchAllowed);
	const exposedTools = placeDisabledNativeShellToolsInDirectNamespace(webSearchPlan.suppressManagedWebSearch ? normalizedTools.filter((tool) => tool.name !== "web_search") : normalizedTools, input.nativeToolSurfaceEnabled);
	if (preNormalizationDiagnostics.length > 0) embeddedAgentLog.warn(`codex app-server quarantined ${preNormalizationDiagnostics.length} unsupported runtime tool schema${preNormalizationDiagnostics.length === 1 ? "" : "s"} before dynamic tool registration`, {
		runId: params.runId,
		sessionId: params.sessionId,
		diagnostics: preNormalizationDiagnostics.map((diagnostic) => ({
			index: diagnostic.toolIndex,
			tool: diagnostic.toolName,
			violations: diagnostic.violations.slice(0, 12),
			violationCount: diagnostic.violations.length
		}))
	});
	const summary = toolBuildStages.snapshot();
	if (shouldWarnCodexDynamicToolBuildStageSummary(summary, input.profilerEnabled)) {
		const phase = input.forceHeartbeatTool ? "registered-tools" : "runtime-tools";
		embeddedAgentLog.warn(`codex app-server dynamic tool build timings runId=${params.runId} sessionId=${params.sessionId} phase=${phase} totalMs=${summary.totalMs} stages=${formatCodexDynamicToolBuildStageSummary(summary)}`, {
			runId: params.runId,
			sessionId: params.sessionId,
			phase,
			totalMs: summary.totalMs,
			stages: summary.stages,
			allToolCount: readableAllTools.length,
			codexFilteredToolCount: codexFilteredTools.length,
			visionFilteredToolCount: visionFilteredTools.length,
			filteredToolCount: filteredTools.length,
			normalizedToolCount: exposedTools.length,
			forceHeartbeatTool: input.forceHeartbeatTool === true,
			ignoreRuntimePlan: input.ignoreRuntimePlan === true,
			nativeToolSurfaceEnabled: input.nativeToolSurfaceEnabled === true
		});
	}
	return exposedTools;
}
/** Keeps the OpenClaw Gateway execution path available beside Codex native shell. */
function addGatewayShellDynamicToolsIfAvailable(filteredTools, allTools, input, executionPolicy) {
	if (isCodexMemoryFlushRun(input.params) || input.nativeToolSurfaceEnabled !== true || input.sandbox?.enabled === true || !executionPolicy.nativeToolSurfaceAllowed || executionPolicy.effectiveExecHost !== "gateway") return filteredTools;
	const execTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "exec");
	const processTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "process");
	const existingNames = new Set(filteredTools.map((tool) => normalizeCodexDynamicToolName(tool.name)));
	const execExcluded = isCodexDynamicToolExcluded(input.pluginConfig, ["exec", CODEX_GATEWAY_EXEC_DYNAMIC_TOOL_NAME]);
	if (!execTool || execExcluded || existingNames.has("gateway_exec")) return filteredTools;
	const processExcluded = isCodexDynamicToolExcluded(input.pluginConfig, ["process", CODEX_GATEWAY_PROCESS_DYNAMIC_TOOL_NAME]);
	const processAliasAvailable = Boolean(processTool && !processExcluded && !existingNames.has("gateway_process"));
	const createProjection = resolveCodexScheduledToolProjectionFactory(input.params.hostCapabilities);
	if (!createProjection) return filteredTools;
	const toolsToAppend = [createGatewayExecProjection(createProjection, execTool, {
		processAliasAvailable,
		...input.sessionPermissionPolicy?.mode === "guarded" ? { ask: "always" } : {}
	})];
	if (processAliasAvailable && processTool) toolsToAppend.push(createGatewayProcessProjection(createProjection, processTool));
	return [...filteredTools, ...toolsToAppend];
}
/** Decides whether Codex native code mode can own shell/file tools for this turn. */
function shouldEnableCodexAppServerNativeToolSurface(params, sandbox, options = {}) {
	if (params.pluginHarnessToolPolicyRestricted === true) return false;
	if (isCodexMemoryFlushRun(params)) return false;
	if (params.disableTools) return false;
	if (!resolveCodexNativeExecutionPolicyForRun(params, {
		agentId: options.agentId,
		runtimeSessionKey: options.runtimeSessionKey,
		sandbox
	}).nativeToolSurfaceAllowed) return false;
	const toolsAllow = params.toolsAllow;
	if (toolsAllow === void 0) return canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options);
	return hasWildcardCodexToolsAllow(toolsAllow) && canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options);
}
function resolveCodexNativeExecutionPolicyForRun(params, options = {}) {
	return resolveCodexNativeExecutionPolicy({
		config: params.config,
		sessionKey: resolveCodexRuntimePolicySessionKey(params, options.runtimeSessionKey),
		sessionId: params.sessionId,
		agentId: options.agentId,
		execOverrides: params.execOverrides,
		sandboxAvailable: options.sandbox === null ? false : options.sandbox?.enabled,
		readRuntimeSessionEntry: true
	});
}
function resolveCodexRuntimePolicySessionKey(params, runtimeSessionKey) {
	return runtimeSessionKey?.trim() || params.sandboxSessionKey?.trim() || params.sessionKey?.trim() || params.sessionId;
}
function canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options = {}) {
	if (!sandbox?.enabled) return true;
	if (options.sandboxExecServerEnabled === true && (sandbox.backend || isCodexRemoteExecPlacementSandbox(sandbox)) && canSandboxToolPolicyExposeCodexNativeToolSurface(sandbox)) return true;
	return false;
}
function canSandboxToolPolicyExposeCodexNativeToolSurface(sandbox) {
	return CODEX_NATIVE_TOOL_REQUIREMENTS.every((toolName) => isToolAllowed(sandbox.tools, toolName));
}
function isCodexMemoryFlushRun(params) {
	return params?.trigger === "memory" && Boolean(params.memoryFlushWritePath?.trim());
}
function filterCodexMemoryFlushDynamicTools(tools) {
	return tools.filter((tool) => CODEX_MEMORY_FLUSH_DYNAMIC_TOOL_ALLOW.has(normalizeCodexDynamicToolName(tool.name)));
}
/** Requires a Codex sandbox environment only when native tools must run inside OpenClaw sandboxing. */
function shouldRequireCodexSandboxExecServerEnvironment(params) {
	return Boolean(isCodexRemoteExecPlacementSandbox(params.sandbox) || params.sandbox?.enabled && params.nativeToolSurfaceEnabled && params.sandboxExecServerEnabled);
}
/** Selects the sandbox exec-server environment passed through the Codex app-server protocol. */
function resolveCodexSandboxEnvironmentSelection(environment, nativeToolSurfaceEnabled) {
	return nativeToolSurfaceEnabled ? environment ? [environment] : void 0 : [];
}
/** Chooses the cwd visible to Codex native execution after sandbox exec-server setup. */
function resolveCodexAppServerExecutionCwd(params) {
	return mapCodexAppServerRemoteWorkspacePath({
		value: params.environment && params.nativeToolSurfaceEnabled ? params.environment.cwd : params.effectiveCwd,
		localWorkspaceRoot: params.localWorkspaceRoot,
		remoteWorkspaceRoot: params.remoteWorkspaceRoot
	});
}
/** Converts OpenClaw sandbox networking into Codex's external-sandbox policy shape. */
function resolveCodexExternalSandboxPolicyForOpenClawSandbox(sandbox) {
	return {
		type: "externalSandbox",
		networkAccess: codexNetworkAccessForOpenClawSandbox(sandbox) ? "enabled" : "restricted"
	};
}
function usesDockerNetworkConfig(sandbox) {
	const backendId = sandbox?.backendId.trim().toLowerCase();
	return backendId === "docker" || backendId === "podman";
}
function codexNetworkAccessForOpenClawSandbox(sandbox) {
	if (!usesDockerNetworkConfig(sandbox)) return true;
	const network = sandbox?.docker?.network?.trim().toLowerCase();
	return Boolean(network && network !== "none");
}
/** Returns a Codex config copy with all app exposure disabled for restricted thread tools. */
function disableCodexPluginThreadConfig(pluginConfig) {
	const config = readCodexPluginConfig(pluginConfig);
	return {
		...config,
		codexPlugins: {
			...config.codexPlugins,
			enabled: false
		}
	};
}
/** Adds sandbox_exec/process aliases when native Code Mode cannot directly honor the sandbox. */
function addSandboxShellDynamicToolsIfAvailable(filteredTools, allTools, input, executionPolicy) {
	if (isCodexMemoryFlushRun(input.params) || !executionPolicy.nativeToolSurfaceAllowed || !input.sandbox?.enabled || !input.sandbox.backendId.trim() || input.nativeToolSurfaceEnabled !== false || isSandboxShellDynamicToolExcluded(input.pluginConfig)) return filteredTools;
	const execTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "exec");
	const processTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "process");
	if (!execTool) return filteredTools;
	const sandboxTools = [...filteredTools, createSandboxExecProjection(execTool)];
	return processTool ? [...sandboxTools, createSandboxProcessProjection(processTool)] : sandboxTools;
}
function isSandboxShellDynamicToolExcluded(config) {
	return isCodexDynamicToolExcluded(config, [
		"exec",
		"sandbox_exec",
		"process",
		"sandbox_process"
	]);
}
async function addNodeShellDynamicToolsIfNeeded(filteredTools, allTools, input, nodePolicy) {
	if (isCodexMemoryFlushRun(input.params)) return filteredTools;
	const nodeExecIsDefault = nodePolicy.effectiveExecHost === "node";
	const nodeExecAvailableFromAuto = nodePolicy.requestedExecHost === "auto" && nodePolicy.effectiveExecHost === "gateway";
	if (!nodeExecIsDefault && !nodeExecAvailableFromAuto) return filteredTools;
	const execTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "exec");
	if (!execTool || isCodexDynamicToolExcluded(input.pluginConfig, ["exec", "node_exec"]) || filteredTools.some((tool) => normalizeCodexDynamicToolName(tool.name) === "node_exec")) return filteredTools;
	const nodeExec = await createNodeExecAliasDynamicTool(execTool, nodePolicy.node, input.runAbortController.signal, input.nodeExecAvailability);
	return nodeExec ? [...filteredTools, nodeExec] : filteredTools;
}
function shouldKeepOpenClawShellDynamicTools(input, nodePolicy) {
	return !isCodexMemoryFlushRun(input.params) && input.nativeToolSurfaceEnabled === false && input.sandbox?.enabled !== true && nodePolicy.effectiveExecHost !== "node";
}
/** Keeps replacement shell tools direct even when model metadata mandates Codex Code Mode. */
function placeDisabledNativeShellToolsInDirectNamespace(tools, nativeToolSurfaceEnabled) {
	if (nativeToolSurfaceEnabled !== false) return tools;
	for (const tool of tools) if (CODEX_DISABLED_NATIVE_SHELL_DYNAMIC_TOOLS.has(normalizeCodexDynamicToolName(tool.name))) tool.catalogMode = "direct-only";
	return tools;
}
/** Applies a normalized tool allowlist while preserving shell aliases for exec/process. */
function filterCodexDynamicToolsForAllowlist(tools, toolsAllow) {
	return applyEmbeddedAttemptToolsAllow(tools, toolsAllow, {
		toolMeta: getPluginToolMeta,
		toolAliases: (tool) => {
			const normalized = normalizeCodexDynamicToolName(tool.name);
			return normalized === "sandbox_exec" || normalized === "gateway_exec" || normalized === "node_exec" ? ["exec"] : normalized === "sandbox_process" || normalized === "gateway_process" ? ["exec", "process"] : [];
		}
	});
}
/** Detects the wildcard allowlist marker after Codex tool-name normalization. */
function hasWildcardCodexToolsAllow(toolsAllow) {
	return toolsAllow.some((name) => normalizeCodexDynamicToolName(name) === "*");
}
/** Forces message delivery through the message tool when the source channel requires it. */
function shouldForceMessageTool(params) {
	return params.disableMessageTool !== true && params.sourceReplyDeliveryMode === "message_tool_only";
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-native-tool-lifecycle.ts
function isMcpToolCallItemNotification(method, params) {
	return (method === "item/started" || method === "item/completed") && isJsonObject(params.item) && params.item.type === "mcpToolCall";
}
/** Owns native item lifetimes, outcome order, presentation, and approval correlation. */
var CodexNativeToolLifecycleProjector = class {
	constructor(context, threadId, turnId, options = {}) {
		this.context = context;
		this.threadId = threadId;
		this.turnId = turnId;
		this.options = options;
		this.terminalPresentationClearedItemIds = /* @__PURE__ */ new Set();
		this.nativeToolOutcomeOrdinals = /* @__PURE__ */ new Map();
		this.startedAtByItem = /* @__PURE__ */ new Map();
		this.activeItems = /* @__PURE__ */ new Map();
		this.webSearchCompletionByItem = /* @__PURE__ */ new Map();
		this.completedItemIds = /* @__PURE__ */ new Set();
		this.approvalFailureDispositionByItem = /* @__PURE__ */ new Map();
		this.preToolUseFailureByItem = /* @__PURE__ */ new Map();
		this.finalized = false;
		this.turnCompleted = false;
		this.pendingMcpNotifications = 0;
	}
	recordNativeToolOutcome(item) {
		if (!item || this.nativeToolOutcomeOrdinals.has(item.id) || !shouldClearTerminalPresentationForNativeItem(item)) return;
		const ordinal = this.context.allocateToolOutcomeOrdinal?.(item.id);
		if (ordinal !== void 0) this.nativeToolOutcomeOrdinals.set(item.id, ordinal);
	}
	clearTerminalPresentationForNativeItem(item) {
		if (!item || this.terminalPresentationClearedItemIds.has(item.id) || !shouldClearTerminalPresentationForNativeItem(item)) return;
		const toolCallOrdinal = this.nativeToolOutcomeOrdinals.get(item.id);
		this.terminalPresentationClearedItemIds.add(item.id);
		this.context.onToolOutcome?.({
			toolName: itemName(item) ?? item.type,
			argsHash: "",
			resultHash: "",
			...toolCallOrdinal !== void 0 ? { toolCallOrdinal } : {},
			terminalPresentation: void 0,
			presentationOnly: true
		});
	}
	getActiveMcpToolCall(serverName) {
		if (this.finalized || this.turnCompleted || this.pendingMcpNotifications > 0 || this.options.runAbortSignal?.aborted) return;
		let candidate;
		for (const { mcpToolCall } of this.activeItems.values()) {
			if (mcpToolCall?.server !== serverName) continue;
			if (candidate) return;
			candidate = mcpToolCall;
		}
		if (!candidate || candidate.status !== "inProgress" || typeof candidate.server !== "string" || !candidate.server.trim() || typeof candidate.tool !== "string" || !candidate.tool.trim() || candidate.arguments === void 0 || candidate.appContext != null || candidate.pluginId != null) return;
		return {
			id: candidate.id,
			server: candidate.server,
			tool: candidate.tool,
			arguments: candidate.arguments
		};
	}
	recordMcpToolCallReceipt(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params || !isCodexNotificationForTurn(params, this.threadId, this.turnId)) return;
		if (isMcpToolCallItemNotification(notification.method, params)) this.pendingMcpNotifications += 1;
		else if (notification.method === "turn/completed" && readCodexTurnCompletedNotification(params)?.turn.id === this.turnId) this.turnCompleted = true;
	}
	handleNotification(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params || !isCodexNotificationForTurn(params, this.threadId, this.turnId)) return;
		if (this.pendingMcpNotifications > 0 && isMcpToolCallItemNotification(notification.method, params)) this.pendingMcpNotifications -= 1;
		if (notification.method === "turn/completed") {
			const turn = readCodexTurnCompletedNotification(params)?.turn;
			if (!turn || turn.id !== this.turnId) return;
			this.turnCompleted = true;
			for (const item of turn.items) this.recordSnapshotItem(item);
			return;
		}
		if (notification.method === "rawResponseItem/completed") {
			const item = isJsonObject(params.item) ? params.item : void 0;
			if (item) this.recordRawWebSearchResult(item);
			return;
		}
		if (notification.method !== "item/started" && notification.method !== "item/completed") return;
		const item = readItem(params.item);
		if (!item) return;
		this.recordItem({
			phase: notification.method === "item/started" ? "start" : "result",
			item,
			sourceTimestampMs: asDateTimestampMs(notification.method === "item/started" ? params.startedAtMs : params.completedAtMs)
		});
	}
	recordItem(params) {
		const toolName = auditNativeToolName(params.item) ?? (params.item.type === "mcpToolCall" ? params.item.type : void 0);
		if (!toolName || this.completedItemIds.has(params.item.id)) return;
		if (params.phase === "start") {
			this.recordStarted(params.item.id, toolName, auditNativeToolUnfinishedStatus(params.item), params.sourceTimestampMs, params.item.type === "mcpToolCall" ? params.item : void 0);
			return;
		}
		if (params.item.type === "webSearch") {
			this.webSearchCompletionByItem.set(params.item.id, {
				runWasAborted: this.options.runAbortSignal?.aborted === true,
				sourceTimestampMs: params.sourceTimestampMs
			});
			return;
		}
		const itemDurationMs = typeof params.item.durationMs === "number" ? params.item.durationMs : void 0;
		this.recordTerminal(params.item.id, toolName, auditNativeToolTerminalStatus(params.item), {
			itemDurationMs,
			sourceTimestampMs: params.sourceTimestampMs
		});
	}
	recordApprovalFailureDisposition(toolCallId, disposition) {
		if (!this.completedItemIds.has(toolCallId)) this.approvalFailureDispositionByItem.set(toolCallId, disposition);
	}
	recordPreToolUseFailure(failure, runWasAborted = this.options.runAbortSignal?.aborted === true) {
		if (this.completedItemIds.has(failure.toolCallId)) return;
		const record = {
			failure,
			terminalReason: runWasAborted && this.options.runAbortSignal ? resolveCodexToolAbortTerminalReason(this.options.runAbortSignal) : failure.disposition
		};
		if (this.finalized) {
			this.completedItemIds.add(failure.toolCallId);
			this.emitPreToolUseFailure(record, failure.toolName, failure.durationMs);
			return;
		}
		this.preToolUseFailureByItem.set(failure.toolCallId, record);
	}
	recordRawWebSearchResult(item) {
		if (readStringField(item, "type") !== "web_search_call") return;
		const toolCallId = readStringField(item, "id");
		if (!toolCallId || this.completedItemIds.has(toolCallId)) return;
		const toolName = "web_search";
		this.recordStarted(toolCallId, toolName, "unknown");
		const rawStatus = readStringField(item, "status");
		if (rawStatus === "in_progress" || rawStatus === "running") return;
		const status = rawStatus === "completed" ? "completed" : rawStatus === "cancelled" ? "cancelled" : rawStatus === "failed" || rawStatus === "error" || rawStatus === "incomplete" ? "failed" : "unknown";
		this.recordTerminal(toolCallId, toolName, status, { sourceTimestampMs: this.webSearchCompletionByItem.get(toolCallId)?.sourceTimestampMs });
	}
	recordTerminal(toolCallId, toolName, status, options = {}) {
		const runWasAborted = options.runWasAborted ?? this.options.runAbortSignal?.aborted === true;
		const preToolUseFailure = this.preToolUseFailureByItem.get(toolCallId);
		this.preToolUseFailureByItem.delete(toolCallId);
		const approvalFailureDisposition = this.approvalFailureDispositionByItem.get(toolCallId);
		this.approvalFailureDispositionByItem.delete(toolCallId);
		this.completedItemIds.add(toolCallId);
		this.activeItems.delete(toolCallId);
		this.webSearchCompletionByItem.delete(toolCallId);
		const startedAt = this.startedAtByItem.get(toolCallId);
		this.startedAtByItem.delete(toolCallId);
		const endedAt = options.sourceTimestampMs ?? Date.now();
		const durationMs = options.itemDurationMs ?? (startedAt === void 0 ? 0 : Math.max(0, endedAt - startedAt));
		if (preToolUseFailure) {
			this.emitPreToolUseFailure(preToolUseFailure, toolName, durationMs, options.sourceTimestampMs);
			return;
		}
		const terminalEvent = approvalFailureDisposition ? {
			type: "tool.execution.error",
			durationMs,
			errorCategory: "codex_native_tool_approval",
			terminalReason: approvalFailureDisposition
		} : status === "blocked" ? {
			type: "tool.execution.blocked",
			reason: "codex_native_tool_blocked",
			deniedReason: "codex_native_tool_blocked"
		} : status === "failed" || status === "cancelled" || status === "unknown" ? {
			type: "tool.execution.error",
			durationMs,
			errorCategory: status === "unknown" ? "codex_native_tool_outcome_unknown" : status === "cancelled" ? "aborted" : "codex_native_tool_error",
			...status === "unknown" ? { errorCode: "tool_outcome_unknown" } : {},
			terminalReason: status === "unknown" ? "failed" : runWasAborted && this.options.runAbortSignal ? resolveCodexToolAbortTerminalReason(this.options.runAbortSignal) : status === "cancelled" ? "cancelled" : "failed"
		} : {
			type: "tool.execution.completed",
			durationMs
		};
		emitTrustedDiagnosticEvent({
			...this.buildBase(toolCallId, toolName),
			...terminalEvent,
			...options.sourceTimestampMs !== void 0 ? { sourceTimestampMs: options.sourceTimestampMs } : {}
		});
	}
	finalizeActive(runWasAborted = this.options.runAbortSignal?.aborted === true) {
		this.finalized = true;
		for (const [toolCallId, { toolName, unfinishedStatus }] of this.activeItems) {
			const webSearchCompletion = this.webSearchCompletionByItem.get(toolCallId);
			const itemRunWasAborted = webSearchCompletion ? webSearchCompletion.runWasAborted : runWasAborted;
			this.recordTerminal(toolCallId, toolName, unfinishedStatus, {
				runWasAborted: itemRunWasAborted,
				sourceTimestampMs: webSearchCompletion?.sourceTimestampMs
			});
		}
		for (const [toolCallId, record] of this.preToolUseFailureByItem) if (!this.completedItemIds.has(toolCallId)) this.recordTerminal(toolCallId, record.failure.toolName, "failed", { itemDurationMs: record.failure.durationMs });
		this.activeItems.clear();
		this.webSearchCompletionByItem.clear();
		this.approvalFailureDispositionByItem.clear();
		this.preToolUseFailureByItem.clear();
	}
	emitPreToolUseFailure(record, toolName, durationMs, sourceTimestampMs) {
		emitCodexNativePreToolUseFailureDiagnostic({
			agentId: this.context.agentId,
			sessionId: this.context.sessionId,
			sessionKey: this.context.sessionKey,
			runId: this.context.runId,
			failure: {
				...record.failure,
				toolName,
				durationMs
			},
			terminalReason: record.terminalReason,
			sourceTimestampMs
		});
	}
	recordSnapshotItem(item) {
		if (!auditNativeToolName(item) || this.completedItemIds.has(item.id) || itemStatus(item) === "running") return;
		const toolName = auditNativeToolName(item);
		if (!toolName) return;
		this.recordStarted(item.id, toolName, auditNativeToolUnfinishedStatus(item));
		this.recordItem({
			phase: "result",
			item
		});
	}
	recordStarted(toolCallId, toolName, unfinishedStatus, sourceTimestampMs, mcpToolCall) {
		if (this.activeItems.has(toolCallId)) return;
		this.startedAtByItem.set(toolCallId, sourceTimestampMs ?? Date.now());
		this.activeItems.set(toolCallId, {
			toolName,
			unfinishedStatus,
			mcpToolCall
		});
		emitTrustedDiagnosticEvent({
			type: "tool.execution.started",
			...this.buildBase(toolCallId, toolName),
			...sourceTimestampMs !== void 0 ? { sourceTimestampMs } : {}
		});
	}
	buildBase(toolCallId, toolName) {
		return {
			agentId: this.context.agentId,
			runId: this.context.runId,
			sessionId: this.context.sessionId,
			sessionKey: this.context.sessionKey,
			toolName,
			toolCallId
		};
	}
};
//#endregion
//#region extensions/codex/src/app-server/remote-workspace-media.ts
const REMOTE_WORKSPACE_MEDIA_TIMEOUT_MS = 6e4;
const REMOTE_WORKSPACE_MEDIA_MAX_BYTES = 67108864;
const REMOTE_WORKSPACE_MEDIA_MAX_ATTACHMENTS = 16;
const CODEX_REMOTE_MEDIA_CHUNK_BYTES = 524288;
const CODEX_REMOTE_COMMAND_DEFAULT_OUTPUT_BYTES = 1048576;
const CODEX_BOUNDED_REMOTE_FILE_READER = [
	"try{",
	"const fs=require(\"node:fs\");",
	"const path=require(\"node:path\");",
	"const file=process.argv[1];",
	"const max=Number(process.argv[2]);",
	"const offset=Number(process.argv[3]);",
	"const chunk=Number(process.argv[4]);",
	"const workspace=process.argv[5];",
	"if(!Number.isSafeInteger(max)||max<0)throw Error(\"invalid media byte limit\");",
	"if(!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(chunk)||chunk<=0)throw Error(\"invalid media chunk\");",
	"if(fs.lstatSync(file).isSymbolicLink())throw Error(\"symbolic links are not allowed\");",
	"const noFollow=fs.constants.O_NOFOLLOW??0;",
	"const fd=fs.openSync(file,fs.constants.O_RDONLY|noFollow);",
	"try{",
	"const before=fs.fstatSync(fd);",
	"if(!before.isFile())throw Error(\"not a regular file\");",
	"if(workspace){",
	"const descriptor=process.platform===\"linux\"?fs.realpathSync(`/proc/self/fd/${fd}`):fs.realpathSync(file);",
	"const relative=path.relative(fs.realpathSync(workspace),descriptor);",
	"if(!relative||relative===\"..\"||relative.startsWith(`..${path.sep}`)||path.isAbsolute(relative))throw Error(\"file escapes remote workspace\");",
	"const verified=fs.statSync(descriptor);",
	"if(verified.dev!==before.dev||verified.ino!==before.ino)throw Error(\"file changed while being opened\");",
	"}",
	"if(before.size>max)throw Error(`file exceeds limit of ${max} bytes`);",
	"if(offset>before.size)throw Error(\"file changed while being read\");",
	"const expected=Math.min(chunk,before.size-offset);",
	"const buffer=Buffer.allocUnsafe(expected);",
	"let total=0;",
	"while(total<buffer.length){",
	"const count=fs.readSync(fd,buffer,total,buffer.length-total,offset+total);",
	"if(count===0)break;total+=count;",
	"}",
	"if(total!==expected)throw Error(\"file changed while being read\");",
	"const after=fs.fstatSync(fd);",
	"const revision=stat=>[stat.dev,stat.ino,stat.size,stat.mtimeMs,stat.ctimeMs].join(\":\");",
	"if(!after.isFile()||revision(after)!==revision(before))throw Error(\"file changed while being read\");",
	"process.stdout.write(JSON.stringify({dataBase64:buffer.toString(\"base64\"),size:before.size,revision:revision(before)}));",
	"}finally{fs.closeSync(fd)}",
	"}catch(error){process.stderr.write(error instanceof Error?error.message:String(error));process.exitCode=1}"
].join("");
const MESSAGE_MEDIA_KEYS = [
	"media",
	"mediaUrl",
	"media_url",
	"path",
	"filePath",
	"fileUrl",
	"imageUrl",
	"image_url"
];
const MESSAGE_MEDIA_ARRAY_KEYS = [
	"mediaUrls",
	"media_urls",
	"imageUrls",
	"image_urls"
];
const ATTACHMENT_MEDIA_KEYS = [
	"media",
	"mediaUrl",
	"path",
	"filePath",
	"fileUrl",
	"url"
];
function collectCodexMessageMediaUrls(record) {
	const urls = [];
	const push = (value) => {
		if (typeof value === "string" && value.trim()) urls.push(value.trim());
	};
	for (const key of MESSAGE_MEDIA_KEYS) push(record[key]);
	for (const key of MESSAGE_MEDIA_ARRAY_KEYS) {
		const value = record[key];
		if (Array.isArray(value)) for (const entry of value) push(entry);
	}
	if (Array.isArray(record.attachments)) for (const attachment of record.attachments) {
		if (!isRecord(attachment)) continue;
		for (const key of ATTACHMENT_MEDIA_KEYS) push(attachment[key]);
	}
	return urls;
}
/** Reads actual remote bytes with a cap enforced by Codex before transport. */
async function readBoundedCodexRemoteWorkspaceFile(params) {
	if (!Number.isSafeInteger(params.maxBytes) || params.maxBytes < 0) throw new Error("Codex remote workspace upload requires a valid media byte limit.");
	params.signal?.throwIfAborted();
	const chunks = [];
	let offset = 0;
	let expectedSize;
	let expectedRevision;
	const startedAt = performance.now();
	do {
		params.signal?.throwIfAborted();
		const timeoutMs = params.timeoutMs === void 0 ? void 0 : Math.floor(params.timeoutMs - (performance.now() - startedAt));
		if (timeoutMs !== void 0 && timeoutMs <= 0) throw new Error("Codex remote workspace file transfer timed out.");
		let response;
		try {
			response = await params.client.request("command/exec", {
				command: [
					"node",
					"-e",
					CODEX_BOUNDED_REMOTE_FILE_READER,
					"--",
					params.path,
					String(params.maxBytes),
					String(offset),
					String(CODEX_REMOTE_MEDIA_CHUNK_BYTES),
					...params.workspaceRoot ? [params.workspaceRoot] : []
				],
				env: {
					NODE_OPTIONS: null,
					NODE_PATH: null
				},
				...timeoutMs === void 0 ? {} : { timeoutMs }
			}, {
				signal: params.signal,
				timeoutMs
			});
		} catch (error) {
			if (error instanceof Error && /failed to spawn|executable.*not found|\bENOENT\b/iu.test(error.message)) throw new Error("Codex remote workspace file transfer requires Node.js on the remote app-server host.", { cause: error });
			throw error;
		}
		if (!response || response.exitCode !== 0) {
			const detail = typeof response?.stderr === "string" ? response.stderr.trim() : "";
			throw new Error(`Codex remote workspace artifact could not be read: ${params.path}${detail ? `: ${detail}` : ""}`);
		}
		if (typeof response.stdout !== "string" || response.stdout.length > CODEX_REMOTE_COMMAND_DEFAULT_OUTPUT_BYTES) throw new Error("Codex remote workspace artifact exceeded the native command output cap.");
		let payload;
		try {
			payload = JSON.parse(response.stdout);
		} catch {
			throw new Error("Codex remote workspace artifact returned invalid chunk data.");
		}
		if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("Codex remote workspace artifact returned invalid chunk data.");
		const chunk = payload;
		if (typeof chunk.dataBase64 !== "string" || !Number.isSafeInteger(chunk.size) || chunk.size < 0 || chunk.size > params.maxBytes || typeof chunk.revision !== "string" || !chunk.revision) throw new Error("Codex remote workspace artifact returned invalid or oversized chunk data.");
		if (expectedSize === void 0) {
			expectedSize = chunk.size;
			expectedRevision = chunk.revision;
		}
		if (chunk.size !== expectedSize || chunk.revision !== expectedRevision) throw new Error("Codex remote workspace artifact changed during chunked transfer.");
		const remainingBytes = expectedSize - offset;
		const expectedChunkBytes = Math.min(CODEX_REMOTE_MEDIA_CHUNK_BYTES, remainingBytes);
		if (chunk.dataBase64.length > Math.ceil(expectedChunkBytes / 3) * 4) throw new Error("Codex remote workspace artifact returned oversized chunk data.");
		const buffer = Buffer.from(chunk.dataBase64, "base64");
		if (buffer.byteLength !== expectedChunkBytes || buffer.toString("base64") !== chunk.dataBase64) throw new Error("Codex remote workspace artifact returned invalid chunk data.");
		chunks.push(buffer);
		offset += buffer.byteLength;
	} while (offset < (expectedSize ?? 0));
	return { dataBase64: Buffer.concat(chunks, offset).toString("base64") };
}
/** Stages authoritative bounded remote bytes into immutable Gateway-owned media. */
async function prepareCodexRemoteWorkspaceMessageMedia(params) {
	const { localWorkspaceRoot, remoteWorkspaceRoot } = params;
	const sourcePathsByStagedPath = /* @__PURE__ */ new Map();
	if (!localWorkspaceRoot || !remoteWorkspaceRoot) return {
		args: params.args,
		sourcePathsByStagedPath
	};
	const remotePathsByLocalPath = /* @__PURE__ */ new Map();
	const gatewayManagedPaths = /* @__PURE__ */ new Set();
	const gatewayMediaRoot = getMediaDir();
	let attachmentEntries = 0;
	const mapMediaPath = (value) => {
		if (typeof value !== "string") return value;
		if (path.isAbsolute(value) && isPathStrictlyInside(gatewayMediaRoot, value)) {
			attachmentEntries += 1;
			gatewayManagedPaths.add(value);
			return value;
		}
		const mapped = mapCodexAppServerLocalWorkspacePath({
			value,
			localWorkspaceRoot,
			remoteWorkspaceRoot
		});
		if (value.trim() && !isCodexPassThroughMediaSource(value)) {
			attachmentEntries += 1;
			const remotePath = mapCodexAppServerRemoteWorkspacePath({
				value: mapped,
				localWorkspaceRoot,
				remoteWorkspaceRoot
			});
			const sourcePaths = remotePathsByLocalPath.get(mapped)?.sourcePaths ?? /* @__PURE__ */ new Set();
			sourcePaths.add(value);
			sourcePaths.add(remotePath);
			remotePathsByLocalPath.set(mapped, {
				remotePath,
				sourcePaths
			});
		}
		return mapped;
	};
	let mappedArgs = params.args;
	const setMappedValue = (key, value) => {
		if (value === params.args[key]) return;
		if (mappedArgs === params.args) mappedArgs = { ...params.args };
		mappedArgs[key] = value;
	};
	for (const key of MESSAGE_MEDIA_KEYS) setMappedValue(key, mapMediaPath(params.args[key]));
	for (const key of MESSAGE_MEDIA_ARRAY_KEYS) {
		const value = params.args[key];
		if (Array.isArray(value)) {
			const mapped = value.map(mapMediaPath);
			if (mapped.some((entry, index) => entry !== value[index])) setMappedValue(key, mapped);
		}
	}
	if (Array.isArray(params.args.attachments)) {
		const attachments = params.args.attachments;
		const mapped = attachments.map((attachment) => {
			if (!attachment || typeof attachment !== "object" || Array.isArray(attachment)) return attachment;
			const record = attachment;
			let mappedAttachment = record;
			for (const key of ATTACHMENT_MEDIA_KEYS) {
				const value = mapMediaPath(record[key]);
				if (value !== record[key]) {
					if (mappedAttachment === record) mappedAttachment = { ...record };
					mappedAttachment[key] = value;
				}
			}
			return mappedAttachment;
		});
		if (mapped.some((attachment, index) => attachment !== attachments[index])) setMappedValue("attachments", mapped);
	}
	if (attachmentEntries > REMOTE_WORKSPACE_MEDIA_MAX_ATTACHMENTS) throw new Error(`Codex remote workspace upload exceeds the ${REMOTE_WORKSPACE_MEDIA_MAX_ATTACHMENTS}-attachment limit.`);
	for (const managedPath of gatewayManagedPaths) await assertGatewayManagedMediaPath(managedPath, gatewayMediaRoot);
	if (remotePathsByLocalPath.size === 0) return {
		args: mappedArgs,
		sourcePathsByStagedPath
	};
	const readRemoteFile = params.readRemoteFile;
	if (!readRemoteFile) throw new Error("Codex remote workspace file transfer requires an active app-server client.");
	const maxBytes = params.maxBytes ?? REMOTE_WORKSPACE_MEDIA_MAX_BYTES;
	const timeoutMs = params.timeoutMs ?? REMOTE_WORKSPACE_MEDIA_TIMEOUT_MS;
	const deadline = performance.now() + timeoutMs;
	const stagedPaths = /* @__PURE__ */ new Map();
	let totalBytes = 0;
	for (const [localPath, { remotePath, sourcePaths }] of remotePathsByLocalPath) {
		params.signal?.throwIfAborted();
		const remainingBytes = maxBytes - totalBytes;
		const remainingMs = Math.floor(deadline - performance.now());
		if (remainingMs <= 0) throw new Error("Codex remote workspace attachment batch timed out.");
		const response = await readRemoteFile({
			path: remotePath,
			maxBytes: remainingBytes,
			workspaceRoot: remoteWorkspaceRoot,
			signal: params.signal,
			timeoutMs: remainingMs
		});
		if (!response || typeof response.dataBase64 !== "string") throw new Error(`Codex remote workspace artifact returned no file data: ${remotePath}`);
		if (response.dataBase64.length > Math.ceil(remainingBytes / 3) * 4) throw new Error(`Codex remote workspace artifact exceeds the limit of ${remainingBytes} bytes.`);
		const remoteBuffer = Buffer.from(response.dataBase64, "base64");
		if (remoteBuffer.byteLength > remainingBytes || remoteBuffer.toString("base64") !== response.dataBase64) throw new Error(`Codex remote workspace artifact returned invalid or oversized file data: ${remotePath}`);
		totalBytes += remoteBuffer.byteLength;
		const saved = await saveMediaBuffer(remoteBuffer, void 0, "outbound", maxBytes, path.basename(remotePath));
		stagedPaths.set(localPath, saved.path);
		sourcePathsByStagedPath.set(normalizeMediaReferenceForComparison(saved.path), [...sourcePaths]);
	}
	return {
		args: mapMessageMediaValues(mappedArgs, (value) => stagedPaths.get(value) ?? value),
		sourcePathsByStagedPath
	};
}
function resolveCodexMediaSourceUrls(mediaUrls, sourcePathsByStagedPath) {
	return [...new Set(mediaUrls.flatMap((url) => [url, ...sourcePathsByStagedPath?.get(normalizeMediaReferenceForComparison(url)) ?? []]))];
}
async function assertGatewayManagedMediaPath(value, mediaRoot) {
	const opened = await (await root(mediaRoot, { symlinks: "reject" })).open(path.relative(mediaRoot, value), { symlinks: "reject" });
	try {
		if (!(await opened.handle.stat()).isFile()) throw new Error(`Codex Gateway-managed media is not a regular file: ${value}`);
	} finally {
		await opened[Symbol.asyncDispose]();
	}
}
function mapMessageMediaValues(args, mapValue) {
	const mapped = { ...args };
	for (const key of MESSAGE_MEDIA_KEYS) {
		const value = mapped[key];
		if (typeof value === "string") mapped[key] = mapValue(value);
	}
	for (const key of MESSAGE_MEDIA_ARRAY_KEYS) {
		const value = mapped[key];
		if (Array.isArray(value)) mapped[key] = value.map((entry) => typeof entry === "string" ? mapValue(entry) : entry);
	}
	if (Array.isArray(mapped.attachments)) mapped.attachments = mapped.attachments.map((attachment) => {
		if (!attachment || typeof attachment !== "object" || Array.isArray(attachment)) return attachment;
		const record = { ...attachment };
		for (const key of ATTACHMENT_MEDIA_KEYS) {
			const value = record[key];
			if (typeof value === "string") record[key] = mapValue(value);
		}
		return record;
	});
	return mapped;
}
//#endregion
//#region extensions/codex/src/app-server/native-process-authority.ts
const clients = /* @__PURE__ */ new WeakMap();
/** A physical client joins native call receipts to its concrete sandbox processes. */
function getCodexNativeProcessClient(client) {
	let owner = clients.get(client);
	if (!owner) {
		owner = new CodexNativeProcessClient(client);
		clients.set(client, owner);
	}
	return owner;
}
function hasCodexNativeBackgroundProcesses(client, threadId) {
	return clients.get(client)?.hasProcesses(threadId) ?? false;
}
var CodexNativeProcessClient = class {
	constructor(client) {
		this.client = client;
		this.id = randomUUID();
		this.authPath = `/openclaw-${randomUUID()}`;
		this.threads = /* @__PURE__ */ new Map();
		this.closed = false;
		client.addNotificationHandler((notification) => {
			if (!isJsonObject(notification.params)) return;
			const threadId = readCodexNotificationThreadId(notification.params);
			const turnId = readCodexNotificationTurnId(notification.params);
			const commands = threadId ? this.threads.get(threadId) : void 0;
			if (!commands || !turnId) return;
			if (notification.method === "turn/completed") {
				for (const command of commands.values()) if (command.turnId === turnId) this.closeAdmission(command);
			} else if (notification.method === "item/completed") {
				const item = notification.params.item;
				const command = isJsonObject(item) && typeof item.id === "string" ? commands.get(item.id) : void 0;
				if (command?.turnId === turnId) this.closeAdmission(command);
			}
		});
		client.addCloseHandler(() => {
			this.closed = true;
			const owners = /* @__PURE__ */ new Set();
			for (const commands of this.threads.values()) for (const command of commands.values()) owners.add(command.owner);
			for (const owner of owners) owner.cancelClient(this);
		});
	}
	admit(owner, receipt, parentTurn, assertActive) {
		if (this.closed) throw new Error("Codex process source client is closed");
		let commands = this.threads.get(receipt.threadId);
		const existing = commands?.get(receipt.itemId);
		if (existing) {
			if (existing.owner === owner && existing.turnId === receipt.turnId && existing.accepting) return;
			throw new Error("Codex reused an unsettled native command identity");
		}
		if (!commands) {
			commands = /* @__PURE__ */ new Map();
			this.threads.set(receipt.threadId, commands);
		}
		const command = {
			...receipt,
			owner,
			client: this,
			parentTurn,
			accepting: true,
			processes: /* @__PURE__ */ new Set(),
			assertActive,
			releaseClient: retainSharedCodexAppServerClientIfCurrent(this.client),
			releaseThread: protectCodexAppServerLiveThread(this.client, receipt.threadId)
		};
		commands.set(receipt.itemId, command);
		owner.commands.add(command);
	}
	hasProcesses(threadId) {
		return [...this.threads.get(threadId)?.values() ?? []].some((command) => command.processes.size > 0);
	}
	claim(metadata, terminate) {
		if (this.closed || !isJsonObject(metadata) || typeof metadata.threadId !== "string" || typeof metadata.toolCallId !== "string") throw new Error("Codex process start requires its admitted native command");
		const command = this.threads.get(metadata.threadId)?.get(metadata.toolCallId);
		if (!command) throw new Error("Codex process start has no admitted native command");
		const assertAdmission = () => {
			command.owner.assertCurrent();
			command.assertActive();
			if (this.closed || !command.accepting || this.threads.get(command.threadId)?.get(command.itemId) !== command) throw new Error("Codex native command admission has ended");
		};
		assertAdmission();
		const process = { terminate };
		command.processes.add(process);
		let settled = false;
		return {
			assertAdmission,
			assertCurrent: () => {
				command.owner.assertCurrent();
				if (this.closed || settled) throw new Error("Codex native process authority has ended");
			},
			settle: () => {
				if (settled) return;
				settled = true;
				command.processes.delete(process);
				this.forgetSettled(command);
			},
			fail: (error) => command.owner.reportSettlementFailure(error)
		};
	}
	closeAdmission(command) {
		command.accepting = false;
		this.forgetSettled(command);
	}
	forgetSettled(command) {
		if (command.accepting || command.processes.size > 0) return;
		const commands = this.threads.get(command.threadId);
		if (commands?.get(command.itemId) === command) {
			commands.delete(command.itemId);
			if (commands.size === 0) this.threads.delete(command.threadId);
		}
		command.owner.commands.delete(command);
		command.releaseThread();
		command.releaseClient?.();
		command.owner.releaseIfSettled();
	}
};
/** Original-source custody outlives foreground authority, never permitting new admission after release. */
var CodexNativeProcessAuthority = class {
	constructor(host, onCleanupFailure) {
		this.onCleanupFailure = onCleanupFailure;
		this.commands = /* @__PURE__ */ new Set();
		this.holds = 1;
		this.cancelled = false;
		this.released = false;
		this.onAbort = () => {
			if (!this.cancelled) this.cancel().catch(this.onCleanupFailure);
		};
		this.source = host.retainSourceAuthority?.();
		this.source?.signal?.addEventListener("abort", this.onAbort, { once: true });
		if (this.source?.signal?.aborted) this.onAbort();
	}
	assertCurrent() {
		if (this.cancelled || this.released) throw new Error("Codex native process source has ended");
		try {
			this.source?.assertCurrent();
			if (this.cancelled || this.released) throw new Error("Codex native process source has ended");
		} catch (error) {
			this.onAbort();
			throw error;
		}
	}
	bindTurn(client, threadId, turnId) {
		this.parentTurn = {
			client,
			threadId,
			turnId
		};
	}
	admit(client, receipt, assertAdmissionCurrent, childParentThreadId) {
		this.assertCurrent();
		if (this.holds === 0) throw new Error("Codex native process admission is closed");
		const parent = this.parentTurn;
		if (parent?.client !== client || (childParentThreadId ? childParentThreadId !== parent.threadId : receipt.threadId !== parent.threadId || receipt.turnId !== parent.turnId)) throw new Error("Codex native command does not belong to its admitted turn");
		assertAdmissionCurrent();
		getCodexNativeProcessClient(client).admit(this, receipt, parent, assertAdmissionCurrent);
	}
	retainAdmission() {
		this.assertCurrent();
		this.holds += 1;
		let held = true;
		return () => {
			if (held) {
				held = false;
				this.release();
			}
		};
	}
	release() {
		if (this.holds === 0) return;
		this.holds -= 1;
		if (this.holds === 0) for (const command of this.commands) command.client.closeAdmission(command);
		this.releaseIfSettled();
	}
	releaseIfSettled() {
		if (this.released || this.holds > 0 || this.commands.size > 0) return;
		this.released = true;
		this.source?.signal?.removeEventListener("abort", this.onAbort);
		this.source?.release();
	}
	cancelTurn(client, threadId, turnId) {
		const owner = getCodexNativeProcessClient(client);
		return this.terminate([...this.commands].filter((command) => command.client === owner && command.parentTurn.threadId === threadId && command.parentTurn.turnId === turnId));
	}
	cancelClient(client) {
		this.terminate([...this.commands].filter((command) => command.client === client)).catch(this.onCleanupFailure);
	}
	reportSettlementFailure(error) {
		this.onCleanupFailure(new AggregateError([error], "Codex native process cleanup failed; background work remains unsettled"));
	}
	cancel() {
		this.cancelled = true;
		return this.cancellation ??= this.terminate([...this.commands]);
	}
	async terminate(commands) {
		const processes = commands.flatMap((command) => {
			command.client.closeAdmission(command);
			return [...command.processes];
		});
		const failures = (await Promise.allSettled(processes.map((process) => process.terminate()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length > 0) throw new AggregateError(failures, "Codex native process cleanup failed; background work remains unsettled");
	}
};
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server-node-relay.ts
const CODEX_NODE_EXEC_SERVER_MAX_MESSAGE_BYTES$1 = 67108864;
const CODEX_NODE_EXEC_SERVER_MAX_FAILURE_DETAIL_CHARS = 240;
const CODEX_NODE_HTTP_CREDENTIAL_BODY_MAX_BYTES = 1048576;
const CODEX_NODE_HTTP_CREDENTIAL_SCAN_MAX_FIELDS = 256;
const CODEX_NODE_HTTP_CREDENTIAL_SCAN_MAX_DEPTH = 8;
const CODEX_NODE_HTTP_CREDENTIAL_HEADER_NAMES = /* @__PURE__ */ new Set([
	"authorization",
	"proxy-authorization",
	"cookie",
	"set-cookie",
	"x-api-key",
	"api-key",
	"apikey",
	"x-auth-token",
	"auth-token",
	"x-access-token",
	"access-token",
	"x-secret-key",
	"secret-key",
	"x-goog-api-key",
	"x-vault-token",
	"x-api-token"
]);
const CODEX_NODE_HTTP_CREDENTIAL_HEADER_NAME_PATTERN = /(?:^|[-_])(?:auth(?:orization|entication)?|token|secret|api[-_]?key|apikey|key|password|passwd|pwd|passphrase|passcode|credentials?|session|jwt|assertion|verifier|sig(?:nature)?|hmac|bearer|ticket|challenge|proof|dpop|otp|totp|pin|mfa)(?:[-_]|$)/iu;
const CODEX_NODE_HTTP_CREDENTIAL_FIELD_NAME_PATTERN = /^(?:(?:[a-z\d]+_)*(?:token|secret|password|passwd|pwd|passphrase|passcode|credentials?|authorization|api_?key|private_key|secret_key|secret_access_key|jwt|assertion|verifier|signature|hmac|bearer|ticket|(?:oauth|consumer|auth|access)_key|otp|totp|pin)|(?:device|authorization|auth|verification|mfa)_code|session(?:_id)?|jsessionid|saml(?:_?response|_?assertion)?|auth|jwt|code|sig|signature|hmac|key|pass)$/u;
const nodeExecServerTextDecoder = new TextDecoder("utf-8", { fatal: true });
/** Produces the bounded, redacted terminal failure shared by pending and claimed node leases. */
function createCodexNodeExecServerDisconnectError(reason, cause) {
	const detail = cause === void 0 ? "" : `: ${truncateUtf16Safe(redactSensitiveText(formatErrorMessage$2(cause), { mode: "tools" }), CODEX_NODE_EXEC_SERVER_MAX_FAILURE_DETAIL_CHARS)}`;
	return /* @__PURE__ */ new Error(`Codex execution node disconnected; start a fresh attempt. (${reason}${detail})`);
}
/** Relays one authorized, single-use Codex exec-server channel without interpreting its protocol. */
async function startCodexNodeExecServerRelay(params) {
	const { channel } = params.lease;
	const { socket } = params;
	let closed = false;
	const { promise: finished, resolve: finish } = createDeferred();
	let unsubscribe = () => {};
	const closeBoth = (code = 1001, reason = "execution channel closed") => {
		if (closed) return;
		closed = true;
		unsubscribe();
		params.lease.closeRelay = void 0;
		params.lease.onChannelClosed = void 0;
		if (!params.lease.closed) {
			params.lease.closed = true;
			channel.close();
		}
		if (socket.readyState === socket.OPEN || socket.readyState === socket.CONNECTING) socket.close(code, reason);
		finish();
	};
	params.lease.closeRelay = closeBoth;
	const failUnexpectedly = (code, reason, cause) => {
		if (!closed && !params.lease.closed) params.lease.onDisconnected?.(createCodexNodeExecServerDisconnectError(reason, cause));
		closeBoth(code, reason);
	};
	params.lease.onChannelClosed = ({ failed, error }) => failUnexpectedly(failed ? 1011 : 1001, failed ? "execution node failed" : "execution node disconnected", error);
	socket.once("close", () => failUnexpectedly(1001, "execution socket closed"));
	socket.once("error", () => failUnexpectedly(1011, "execution socket failed"));
	let toNode = Promise.resolve();
	socket.on("message", (data) => {
		if (closed) return;
		socket.pause();
		toNode = toNode.then(async () => {
			const frame = normalizeCodexExecServerFrame(data);
			const request = validateCodexExecServerMessage(frame);
			const rejection = rejectCredentialedCodexNodeHttpRequest(request);
			if (rejection) await sendCodexExecServerFrame(socket, rejection);
			else await channel.send(sanitizeCodexExecServerRequest(frame, request));
			if (!closed) socket.resume();
		}).catch((error) => {
			failUnexpectedly(error instanceof RangeError ? 1009 : 1007, "invalid execution message");
		});
	});
	unsubscribe = channel.onMessage(async (message) => {
		if (closed) return;
		try {
			const frame = normalizeCodexExecServerFrame(message);
			validateCodexExecServerMessage(frame);
			await sendCodexExecServerFrame(socket, frame);
		} catch (error) {
			failUnexpectedly(error instanceof RangeError ? 1009 : 1007, "invalid device message");
		}
	});
	await finished;
}
function sendCodexExecServerFrame(socket, frame) {
	return new Promise((resolve, reject) => {
		socket.send(frame, { binary: false }, (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}
function normalizeCodexExecServerFrame(data) {
	const frame = Array.isArray(data) ? Buffer.concat(data) : Buffer.isBuffer(data) ? data : data instanceof Uint8Array ? Buffer.from(data.buffer, data.byteOffset, data.byteLength) : Buffer.from(data);
	if (frame.length > CODEX_NODE_EXEC_SERVER_MAX_MESSAGE_BYTES$1) throw new RangeError("Codex exec-server message exceeds its 64 MiB limit.");
	if (frame.includes(10) || frame.includes(13)) throw new Error("Codex exec-server messages must occupy exactly one stdio line.");
	return frame;
}
function validateCodexExecServerMessage(frame) {
	const parsed = JSON.parse(nodeExecServerTextDecoder.decode(frame));
	if (!isRecord(parsed)) throw new Error("Codex exec-server message must be a JSON object.");
	return parsed;
}
function rejectCredentialedCodexNodeHttpRequest(request) {
	if (request.method !== "http/request") return;
	if (!isRecord(request.params)) throw new Error("Codex http/request params must be an object.");
	const headers = request.params.headers ?? [];
	if (!Array.isArray(headers)) throw new Error("Codex http/request headers must be an array.");
	if (headers.length > CODEX_NODE_HTTP_CREDENTIAL_SCAN_MAX_FIELDS) return createCredentialedCodexNodeHttpRejection(request);
	let credentialBearing = false;
	let contentType;
	for (const header of headers) {
		if (!isRecord(header) || typeof header.name !== "string" || typeof header.value !== "string") throw new Error("Codex http/request headers must contain string names and values.");
		const name = header.name.trim().toLowerCase();
		if (CODEX_NODE_HTTP_CREDENTIAL_HEADER_NAMES.has(name) || CODEX_NODE_HTTP_CREDENTIAL_HEADER_NAME_PATTERN.test(name) || hasSensitiveCodexNodeText(header.value)) credentialBearing = true;
		if (name === "content-type") {
			const declared = header.value.split(";", 1)[0]?.trim().toLowerCase();
			credentialBearing ||= Boolean(contentType && contentType !== declared);
			contentType = declared;
		}
	}
	if (!credentialBearing && typeof request.params.url === "string") credentialBearing = hasCredentialedCodexNodeHttpUrl(request.params.url);
	if (!credentialBearing && request.params.bodyBase64 != null) credentialBearing = hasCredentialedCodexNodeHttpBody(request.params.bodyBase64, contentType);
	return credentialBearing ? createCredentialedCodexNodeHttpRejection(request) : void 0;
}
function hasCredentialedCodexNodeHttpUrl(value) {
	let url;
	try {
		url = new URL(value);
	} catch {
		throw new Error("Codex http/request URL must be valid.");
	}
	if (url.username || url.password || hasSensitiveCodexNodeText(value)) return true;
	let fields = 0;
	const hasCredentialedParameter = (name, parameterValue) => ++fields > CODEX_NODE_HTTP_CREDENTIAL_SCAN_MAX_FIELDS || isCodexNodeCredentialField(name) || hasSensitiveCodexNodeText(parameterValue);
	for (const parameters of [url.searchParams, new URLSearchParams(url.hash.slice(1))]) for (const [name, parameterValue] of parameters) if (hasCredentialedParameter(name, parameterValue)) return true;
	for (const initial of [
		url.pathname,
		url.hash.slice(1),
		...url.searchParams.values()
	]) {
		let component = initial;
		for (let depth = 0; depth <= CODEX_NODE_HTTP_CREDENTIAL_SCAN_MAX_DEPTH; depth += 1) {
			for (const nestedQuery of component.split(/[?#]/u).slice(1)) for (const [name, parameterValue] of new URLSearchParams(nestedQuery)) if (hasCredentialedParameter(name, parameterValue)) return true;
			for (const segment of component.split("/")) for (const parameter of segment.split(";").slice(1)) {
				const separator = parameter.indexOf("=");
				if (hasCredentialedParameter(separator < 0 ? parameter : parameter.slice(0, separator), separator < 0 ? "" : parameter.slice(separator + 1))) return true;
			}
			if (!/%[\da-f]{2}/iu.test(component)) break;
			if (depth === CODEX_NODE_HTTP_CREDENTIAL_SCAN_MAX_DEPTH) return true;
			try {
				component = decodeURIComponent(component);
			} catch {
				return true;
			}
		}
	}
	return false;
}
function hasCredentialedCodexNodeHttpBody(value, contentType) {
	if (typeof value !== "string") throw new Error("Codex http/request bodyBase64 must be a string.");
	const declaredText = contentType === "text/plain";
	if (!declaredText && value.length > Math.ceil(CODEX_NODE_HTTP_CREDENTIAL_BODY_MAX_BYTES / 3) * 4) return true;
	let body;
	try {
		const decoded = Buffer.from(value, "base64");
		if (!declaredText && decoded.length > CODEX_NODE_HTTP_CREDENTIAL_BODY_MAX_BYTES || decoded.toString("base64") !== value) return true;
		body = nodeExecServerTextDecoder.decode(decoded);
	} catch {
		return true;
	}
	if (!body) return false;
	if (hasSensitiveCodexNodeText(body)) return true;
	const declaredJson = contentType === "application/json" || contentType?.endsWith("+json") === true;
	const declaredForm = contentType === "application/x-www-form-urlencoded";
	if (contentType && !declaredJson && !declaredForm && !declaredText) return true;
	const trimmed = body.trimStart();
	if (trimmed.startsWith("<")) return true;
	if (declaredJson || trimmed.startsWith("{") || trimmed.startsWith("[")) try {
		if (hasCredentialedCodexNodeRawJsonStrings(body)) return true;
		return hasCredentialedCodexNodeJsonFields(JSON.parse(body));
	} catch {
		if (!declaredText) return true;
	}
	if (!declaredForm && !body.includes("=")) return !declaredText;
	let fields = 0;
	for (const [name, parameterValue] of new URLSearchParams(body)) if (++fields > CODEX_NODE_HTTP_CREDENTIAL_SCAN_MAX_FIELDS || isCodexNodeCredentialField(name) || hasSensitiveCodexNodeText(parameterValue)) return true;
	return false;
}
function hasCredentialedCodexNodeRawJsonStrings(body) {
	const tokens = body.matchAll(/("(?:\\.|[^"\\])*")(\s*:)?/gu);
	let fields = 0;
	for (const match of tokens) {
		const value = JSON.parse(match[1]);
		if (++fields > CODEX_NODE_HTTP_CREDENTIAL_SCAN_MAX_FIELDS || typeof value !== "string" || hasSensitiveCodexNodeText(value) || match[2] !== void 0 && isCodexNodeCredentialField(value)) return true;
	}
	return false;
}
function hasCredentialedCodexNodeJsonFields(value) {
	const pending = [{
		value,
		depth: 0
	}];
	let fields = 0;
	while (pending.length > 0) {
		const current = pending.pop();
		if (typeof current?.value === "string" && hasSensitiveCodexNodeText(current.value)) return true;
		if (!current || !Array.isArray(current.value) && !isRecord(current.value)) continue;
		if (current.depth >= CODEX_NODE_HTTP_CREDENTIAL_SCAN_MAX_DEPTH) return true;
		const entries = Array.isArray(current.value) ? current.value.map((entry) => [void 0, entry]) : Object.entries(current.value);
		for (const [name, nested] of entries) {
			if (++fields > CODEX_NODE_HTTP_CREDENTIAL_SCAN_MAX_FIELDS || typeof name === "string" && isCodexNodeCredentialField(name)) return true;
			pending.push({
				value: nested,
				depth: current.depth + 1
			});
		}
	}
	return false;
}
function hasSensitiveCodexNodeText(value) {
	let decoded = value;
	for (let depth = 0; depth <= CODEX_NODE_HTTP_CREDENTIAL_SCAN_MAX_DEPTH; depth += 1) {
		if (redactToolPayloadText(decoded) !== decoded) return true;
		if (!/%[\da-f]{2}/iu.test(decoded)) return false;
		try {
			decoded = decodeURIComponent(decoded);
		} catch {
			return true;
		}
	}
	return true;
}
function isCodexNodeCredentialField(value) {
	let decoded = value;
	for (let depth = 0; depth < CODEX_NODE_HTTP_CREDENTIAL_SCAN_MAX_DEPTH; depth += 1) {
		let next;
		try {
			next = decodeURIComponent(decoded);
		} catch {
			return true;
		}
		if (next === decoded) break;
		decoded = next;
	}
	const normalized = decoded.replace(/[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu, "").replace(/([a-z\d])([A-Z])/gu, "$1_$2").replaceAll("-", "_").toLowerCase();
	return normalized.length > CODEX_NODE_HTTP_CREDENTIAL_SCAN_MAX_FIELDS || normalized.split(/[.[\]]+/u).some((component) => CODEX_NODE_HTTP_CREDENTIAL_FIELD_NAME_PATTERN.test(component));
}
function createCredentialedCodexNodeHttpRejection(request) {
	if (typeof request.id !== "string" && typeof request.id !== "number") throw new Error("Codex http/request must have a JSON-RPC request id.");
	return Buffer.from(JSON.stringify({
		jsonrpc: "2.0",
		id: request.id,
		error: {
			code: -32602,
			message: "Authenticated remote HTTP is unavailable on execution nodes; run on Gateway or use an intentionally credential-free endpoint."
		}
	}));
}
function sanitizeCodexExecServerRequest(frame, request) {
	if (request.method !== "process/start") return frame;
	if (!isRecord(request.params)) throw new Error("Codex process/start params must be an object.");
	sanitizeCodexExecServerEnvironment(request.params, "env");
	if (request.params.envPolicy !== void 0) {
		if (!isRecord(request.params.envPolicy)) throw new Error("Codex process/start envPolicy must be an object.");
		sanitizeCodexExecServerEnvironment(request.params.envPolicy, "set");
	}
	return normalizeCodexExecServerFrame(Buffer.from(JSON.stringify(request)));
}
function sanitizeCodexExecServerEnvironment(record, key) {
	const environment = record[key];
	if (environment === void 0) return;
	if (!isRecord(environment)) throw new Error(`Codex process/start ${key} must be an object.`);
	const values = {};
	for (const [name, value] of Object.entries(environment)) {
		if (typeof value !== "string") throw new Error(`Codex process/start ${key} values must be strings.`);
		try {
			const url = new URL(value);
			if (url.username || url.password) continue;
		} catch {}
		values[name] = value;
	}
	record[key] = sanitizeEnvVars(values).allowed;
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server-registry.ts
const sandboxExecServerRegistry = {
	servers: /* @__PURE__ */ new Map(),
	async close(server) {
		if (server.closed) return;
		server.closed = true;
		if ("node" in server) {
			for (const lease of server.node.leases.values()) if (!lease.closed) {
				lease.closed = true;
				lease.channel.close();
			}
			server.node.leases.clear();
		}
		for (const client of server.server.clients) client.close(1001, "shutdown");
		await new Promise((resolve) => {
			server.server.close(() => resolve());
		});
		const failures = (await Promise.allSettled([...server.cleanupTasks, ...[...server.children].map(async (child) => await child.terminate())])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length > 0) throw new AggregateError(failures, "Codex sandbox exec-server child cleanup failed");
	},
	async closeAll() {
		const servers = await Promise.allSettled(this.servers.values());
		this.servers.clear();
		await Promise.all(servers.map(async (entry) => {
			if (entry.status !== "fulfilled") return;
			const server = entry.value;
			server.refCount = 0;
			await this.close(server);
		}));
	}
};
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server.websocket.ts
const require = createRequire(import.meta.url);
const websocket = require(path.join(path.dirname(require.resolve("ws/package.json")), "index.js"));
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/json-rpc.ts
/** JSON-RPC error code used when a sandbox filesystem resource does not exist. */
const JSON_RPC_NOT_FOUND = -32004;
/** JSON-RPC error code used when a sandbox exec-server method is unsupported. */
const JSON_RPC_METHOD_NOT_FOUND = -32601;
/** Protocol-level error carrying the JSON-RPC error code to send to the client. */
var JsonRpcProtocolError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
};
/** Parses a normalized JSON message into a JSON-RPC request object. */
function parseRequest(text) {
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
/** Sends a JSON-RPC success response through the connection message sink. */
function sendResult(send, id, result) {
	send({
		jsonrpc: "2.0",
		id,
		result
	});
}
/** Sends a JSON-RPC error response through the connection message sink. */
function sendError(send, id, code, message) {
	send({
		jsonrpc: "2.0",
		id: id ?? null,
		error: {
			code,
			message
		}
	});
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/path-uri.ts
/** Converts Codex PathUri protocol values into sandbox-backend path strings. */
const WINDOWS_DRIVE_PATH_RE = /^\/[A-Za-z]:(?:\/|$)/u;
/** Resolves one Codex exec-server PathUri into a POSIX sandbox path. */
function resolveExecServerPath(rawPath, label) {
	let pathUrl;
	try {
		pathUrl = new URL(rawPath);
	} catch (error) {
		throw new Error(`${label} must be a valid file URI: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
	}
	if (pathUrl.protocol !== "file:") throw new Error(`${label} URI must use the file scheme, received ${pathUrl.protocol.slice(0, -1)}.`);
	if (pathUrl.search || pathUrl.hash) throw new Error(`${label} file URI must not include a query or fragment.`);
	let resolved;
	try {
		resolved = fileURLToPath(pathUrl, { windows: false });
	} catch (error) {
		throw new Error(`${label} file URI is not valid for the sandbox: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
	}
	if (WINDOWS_DRIVE_PATH_RE.test(resolved)) throw new Error(`${label} Windows file URI is not supported by the sandbox.`);
	if (resolved.includes("\0")) throw new Error(`${label} file URI must not contain a null byte.`);
	return resolved;
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
	return normalizeSandboxAbsolutePath(resolveExecServerPath(requireString(sandbox.cwd, "sandbox cwd"), "sandbox cwd"), "sandbox cwd");
}
function resolveFsSandboxEntry(entry, cwd) {
	const access = readFsAccessMode(entry.access);
	const pathSpec = requireObject(entry.path, "fs sandbox entry path");
	const pathType = requireString(pathSpec.type, "fs sandbox entry path type");
	if (pathType === "path") return {
		kind: "path",
		path: normalizeSandboxAbsolutePath(resolveExecServerPath(requireString(pathSpec.path, "fs sandbox path"), "fs sandbox path"), "fs sandbox path"),
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
//#region extensions/codex/src/app-server/sandbox-exec-server/filesystem.ts
/**
* Implements filesystem JSON-RPC handlers for the Codex sandbox exec-server
* with OpenClaw sandbox policy checks before every bridge operation.
*/
const CODEX_SANDBOX_EXEC_SERVER_MAX_READ_FILE_BYTES = 536870912;
const CODEX_SANDBOX_EXEC_SERVER_MAX_OPEN_FILE_READS = 128;
const CODEX_SANDBOX_EXEC_SERVER_MAX_BUFFERED_FILE_READ_BYTES = 67108864;
const CODEX_SANDBOX_EXEC_SERVER_MAX_READ_BLOCK_BYTES = 1048576;
const CODEX_SANDBOX_EXEC_SERVER_MAX_FILE_READ_HANDLE_ID_BYTES = 32;
/** Opens a policy-checked sandbox file under a bounded, connection-owned handle. */
async function openFile(execServer, handles, params) {
	const record = requireObject(params, "fs/open params");
	const handleId = requireFileReadHandleId(record.handleId);
	if (handles.closed) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, `unknown file read handle \`${handleId}\``);
	if (handles.has(handleId)) throw new JsonRpcProtocolError(-32600, `file read handle \`${handleId}\` already exists`);
	if (handles.size >= CODEX_SANDBOX_EXEC_SERVER_MAX_OPEN_FILE_READS) throw new JsonRpcProtocolError(-32600, `at most ${CODEX_SANDBOX_EXEC_SERVER_MAX_OPEN_FILE_READS} file reads may be open per connection`);
	const filePath = resolveExecServerPath(requireString(record.path, "path"), "read path");
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "read"
	}]);
	const fsBridge = execServer.fsBridge;
	const handle = {
		abortController: new AbortController(),
		closeRequested: false,
		reservedBytes: 0
	};
	handles.set(handleId, handle);
	try {
		const stat = await fsBridge.stat({
			filePath,
			signal: handle.abortController.signal
		});
		if (handles.get(handleId) !== handle || handle.closeRequested || handles.closed) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, `unknown file read handle \`${handleId}\``);
		if (!stat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
		if (stat.type !== "file") throw new JsonRpcProtocolError(-32600, "file read handle requires a regular file");
		if (!Number.isSafeInteger(stat.size) || stat.size < 0) throw new JsonRpcProtocolError(-32600, "file size must be a non-negative safe integer");
		if (stat.size > CODEX_SANDBOX_EXEC_SERVER_MAX_BUFFERED_FILE_READ_BYTES - bufferedFileReadBytes(handles)) throw new JsonRpcProtocolError(-32600, "sandbox file read exceeds the per-connection buffered file limit");
		handle.reservedBytes = stat.size;
		const data = await fsBridge.readFile({
			filePath,
			maxBytes: handle.reservedBytes,
			signal: handle.abortController.signal
		});
		if (handles.get(handleId) !== handle || handle.closeRequested || handles.closed) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, `unknown file read handle \`${handleId}\``);
		if (data.byteLength > handle.reservedBytes) throw new JsonRpcProtocolError(-32600, "sandbox file read exceeds the per-connection buffered file limit");
		handle.reservedBytes = data.byteLength;
		handle.data = data;
		return { handleId };
	} catch (error) {
		if (handles.get(handleId) === handle) handles.delete(handleId);
		throw error;
	}
}
/** Reads a bounded base64 block from a handle belonging to this connection. */
function readFileBlock(handles, params) {
	const record = requireObject(params, "fs/readBlock params");
	const handleId = requireFileReadHandleId(record.handleId);
	const handle = handles.get(handleId);
	if (!handle?.data) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, `unknown file read handle \`${handleId}\``);
	const offset = requireNumber(record.offset, "offset");
	const length = requireNumber(record.len, "len");
	if (!Number.isSafeInteger(offset) || offset < 0) throw new JsonRpcProtocolError(-32600, "file read offset must be a non-negative safe integer");
	if (!Number.isSafeInteger(length) || length < 1 || length > CODEX_SANDBOX_EXEC_SERVER_MAX_READ_BLOCK_BYTES) throw new JsonRpcProtocolError(-32600, `file read block length must be between 1 and ${CODEX_SANDBOX_EXEC_SERVER_MAX_READ_BLOCK_BYTES}`);
	const chunk = handle.data.subarray(offset, Math.min(offset + length, handle.data.byteLength));
	return {
		chunk: chunk.toString("base64"),
		eof: offset + chunk.byteLength >= handle.data.byteLength
	};
}
/** Closes one connection-owned file handle; repeated closes are harmless. */
function closeFile(handles, params) {
	closeFileReadHandle(handles, requireFileReadHandleId(requireObject(params, "fs/close params").handleId));
	return {};
}
/** Cancels a disconnected socket without releasing unsettled read reservations. */
function closeAllFileReads(handles) {
	handles.closed = true;
	for (const handleId of handles.keys()) closeFileReadHandle(handles, handleId);
}
function closeFileReadHandle(handles, handleId) {
	const handle = handles.get(handleId);
	if (!handle) return;
	handle.closeRequested = true;
	if (handle.data !== void 0) {
		handles.delete(handleId);
		return;
	}
	handle.abortController.abort();
}
function bufferedFileReadBytes(handles) {
	let total = 0;
	for (const handle of handles.values()) total += handle.reservedBytes;
	return total;
}
function requireFileReadHandleId(value) {
	const handleId = requireString(value, "handleId");
	if (Buffer.byteLength(handleId, "utf8") > CODEX_SANDBOX_EXEC_SERVER_MAX_FILE_READ_HANDLE_ID_BYTES) throw new JsonRpcProtocolError(-32600, `file read handle ID must not exceed ${CODEX_SANDBOX_EXEC_SERVER_MAX_FILE_READ_HANDLE_ID_BYTES} bytes`);
	return handleId;
}
/** Reads a sandbox file as base64 after read-policy and size checks. */
async function readFile(execServer, params) {
	const record = requireObject(params, "fs/readFile params");
	const filePath = resolveExecServerPath(requireString(record.path, "path"), "read path");
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "read"
	}]);
	const fsBridge = execServer.fsBridge;
	const stat = await fsBridge.stat({ filePath });
	if (!stat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
	assertSandboxFileReadWithinLimit(stat);
	return { dataBase64: (await fsBridge.readFile({
		filePath,
		maxBytes: CODEX_SANDBOX_EXEC_SERVER_MAX_READ_FILE_BYTES
	})).toString("base64") };
}
/** Writes base64 data to an existing sandbox directory after write-policy checks. */
async function writeFile(execServer, params) {
	const record = requireObject(params, "fs/writeFile params");
	const filePath = resolveExecServerPath(requireString(record.path, "path"), "write path");
	const fsBridge = execServer.fsBridge;
	const canonicalDestination = await fsBridge.resolvePinnedMutationTarget?.({
		filePath,
		action: "write"
	});
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "write"
	}, ...canonicalDestination ? [{
		path: canonicalDestination.policyPath,
		access: "write"
	}] : []]);
	if ((await fsBridge.stat({ filePath: posix.dirname(filePath) }))?.type !== "directory") throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "parent directory not found");
	await fsBridge.writeFile({
		filePath,
		data: Buffer.from(requireBase64String(record.dataBase64, "dataBase64"), "base64"),
		mkdir: false,
		pinnedPath: canonicalDestination?.pinnedPath
	});
}
/** Creates a sandbox directory, respecting recursive and parent-directory semantics. */
async function createDirectory(execServer, params) {
	const record = requireObject(params, "fs/createDirectory params");
	const filePath = resolveExecServerPath(requireString(record.path, "path"), "create-directory path");
	const fsBridge = execServer.fsBridge;
	const canonicalDestination = await fsBridge.resolvePinnedMutationTarget?.({
		filePath,
		action: "mkdir"
	});
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "write"
	}, ...canonicalDestination ? [{
		path: canonicalDestination.policyPath,
		access: "write"
	}] : []]);
	if (record.recursive === false) {
		const parentPath = posix.dirname(filePath);
		if ((await fsBridge.stat({ filePath: parentPath }))?.type !== "directory") throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "parent directory not found");
	}
	await fsBridge.mkdirp({
		filePath,
		pinnedPath: canonicalDestination?.pinnedPath
	});
}
/** Returns normalized metadata for a sandbox path. */
async function getMetadata(execServer, params) {
	const record = requireObject(params, "fs/getMetadata params");
	const filePath = resolveExecServerPath(requireString(record.path, "path"), "metadata path");
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "read"
	}]);
	const stat = await execServer.fsBridge.stat({ filePath });
	if (!stat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
	return metadataResponse(stat);
}
/** Lists sandbox directory entries visible under the resolved filesystem policy. */
async function readDirectory(execServer, params) {
	const record = requireObject(params, "fs/readDirectory params");
	return { entries: await listDirectoryEntries(execServer, resolveExecServerPath(requireString(record.path, "path"), "read-directory path"), resolveFsSandboxPolicy(execServer, record)) };
}
async function listDirectoryEntries(execServer, filePath, fsSandboxPolicy) {
	assertResolvedFsSandboxAccess(fsSandboxPolicy, [{
		path: filePath,
		access: "read"
	}]);
	const resolved = execServer.fsBridge.resolvePath({ filePath });
	if (!resolved) throw new Error(`Cannot resolve sandbox path: ${filePath}`);
	const result = await execServer.backend.runShellCommand({
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
	const filePath = resolveExecServerPath(requireString(record.path, "path"), "remove path");
	const fsSandboxPolicy = resolveFsSandboxPolicy(execServer, record);
	const canonicalDestination = await execServer.fsBridge.resolvePinnedMutationTarget?.({
		filePath,
		action: "remove"
	});
	assertResolvedFsSandboxAccess(fsSandboxPolicy, [{
		path: filePath,
		access: "write"
	}, ...canonicalDestination ? [{
		path: canonicalDestination.policyPath,
		access: "write"
	}] : []]);
	if (record.recursive !== false) {
		assertNoReadOnlyDescendant(fsSandboxPolicy, filePath, "remove");
		if (canonicalDestination) assertNoReadOnlyDescendant(fsSandboxPolicy, canonicalDestination.policyPath, "remove");
	}
	await execServer.fsBridge.remove({
		filePath,
		recursive: record.recursive !== false,
		force: record.force !== false,
		pinnedPath: canonicalDestination?.pinnedPath
	});
}
/** Copies sandbox files or recursive directories while enforcing source and destination policy. */
async function copyPath(execServer, params) {
	const record = requireObject(params, "fs/copy params");
	const sourcePath = resolveExecServerPath(requireString(record.sourcePath ?? record.source, "sourcePath"), "copy source path");
	const destinationPath = resolveExecServerPath(requireString(record.destinationPath ?? record.destination, "destinationPath"), "copy destination path");
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
	const fsBridge = execServer.fsBridge;
	assertResolvedFsSandboxAccess(params.fsSandboxPolicy, [{
		path: params.sourcePath,
		access: "read"
	}, {
		path: params.destinationPath,
		access: "write"
	}]);
	const sourceStat = await fsBridge.stat({ filePath: params.sourcePath });
	if (!sourceStat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
	const canonicalDestination = await fsBridge.resolvePinnedMutationTarget?.({
		filePath: params.destinationPath,
		action: sourceStat.type === "directory" ? "mkdir" : "copy-destination"
	});
	const canonicalPolicyEntries = canonicalDestination ? [{
		path: canonicalDestination.policyPath,
		access: "write"
	}] : [];
	assertResolvedFsSandboxAccess(params.fsSandboxPolicy, canonicalPolicyEntries);
	if (sourceStat.type === "directory") {
		if (!params.recursive) throw new Error(`Cannot copy directory without recursive=true: ${params.sourcePath}`);
		if (pathContains(normalizeSandboxAbsolutePath((await fsBridge.resolvePinnedMutationTarget?.({
			filePath: params.sourcePath,
			action: "mkdir"
		}))?.policyPath ?? params.sourcePath, "copy source path"), normalizeSandboxAbsolutePath(canonicalDestination?.policyPath ?? params.destinationPath, "copy destination path"))) throw new Error("Cannot recursively copy a directory into itself.");
		await fsBridge.mkdirp({
			filePath: params.destinationPath,
			pinnedPath: canonicalDestination?.pinnedPath
		});
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
	if (sourceStat.type === "file" && fsBridge.copyFile) {
		await fsBridge.copyFile({
			sourcePath: params.sourcePath,
			destinationPath: params.destinationPath,
			mkdir: true,
			pinnedPath: canonicalDestination?.pinnedPath
		});
		return;
	}
	assertSandboxFileReadWithinLimit(sourceStat);
	const data = await fsBridge.readFile({
		filePath: params.sourcePath,
		maxBytes: CODEX_SANDBOX_EXEC_SERVER_MAX_READ_FILE_BYTES
	});
	await fsBridge.writeFile({
		filePath: params.destinationPath,
		data,
		mkdir: true,
		pinnedPath: canonicalDestination?.pinnedPath
	});
}
function assertSandboxFileReadWithinLimit(stat) {
	if (stat.type === "file" && stat.size > CODEX_SANDBOX_EXEC_SERVER_MAX_READ_FILE_BYTES) throw new Error(`file is too large to read through Codex sandbox exec-server: ${stat.size} bytes`);
}
function metadataResponse(stat) {
	return {
		isDirectory: stat?.type === "directory",
		isFile: stat?.type === "file",
		isSymlink: false,
		size: stat?.size ?? 0,
		createdAtMs: 0,
		modifiedAtMs: stat?.mtimeMs ?? 0
	};
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/sandbox-child.ts
/** Owns one sandbox subprocess tree through close, reaping, and backend finalization. */
const SANDBOX_CHILD_TERM_GRACE_MS = 1e3;
const SANDBOX_CHILD_REAP_TIMEOUT_MS = 4500;
const SANDBOX_CHILD_INTERRUPT_POLL_MS = 50;
async function spawnSandboxChild(params) {
	const [command, ...args] = params.argv;
	const finalize = async (status, exitCode) => await params.finalizeExec?.({
		status,
		exitCode,
		timedOut: false,
		token: params.finalizeToken
	});
	if (!command) {
		await finalize("failed", null).catch(params.onFinalizeError);
		throw new Error("OpenClaw sandbox exec spec did not provide a command.");
	}
	let child;
	let pty;
	let exitOutcome;
	let outcome;
	let escalation;
	const ready = createDeferred();
	const exited = createDeferred();
	const closed = createDeferred();
	const recordExit = (exitCode, signal) => {
		if (!exitOutcome) {
			clearTimeout(escalation);
			exited.resolve(exitOutcome = {
				exitCode,
				signal
			});
		}
	};
	const recordClose = (exitCode, signal) => {
		recordExit(exitCode, signal);
		closed.resolve(outcome = {
			exitCode,
			signal
		});
	};
	let startFailed = false;
	let startupPending = true;
	let terminationRequested = false;
	let terminationCleanup;
	let terminationError;
	let settlementStarted = false;
	const interruptions = /* @__PURE__ */ new Set();
	const localSignals = [];
	const settled = closed.promise.then(async (result) => {
		settlementStarted = true;
		await terminationCleanup;
		if (interruptions.size > 0) await Promise.allSettled(interruptions);
		await Promise.all(localSignals);
		child?.stdin?.destroy();
		await finalize(startFailed ? "failed" : params.finalizeStatus(result), startFailed ? null : result.exitCode);
		return result;
	});
	settled.catch(params.onFinalizeError);
	const assertCurrent = () => {
		params.assertCurrent?.();
		if (terminationRequested) throw new Error("Sandbox child process start cancelled");
	};
	let terminationPromise;
	const owner = {
		assertCurrent,
		exited: exited.promise,
		closed: closed.promise,
		settled,
		terminate: () => terminationPromise ??= (async () => {
			terminationRequested = true;
			if (startupPending) await ready.promise;
			if (startFailed || settlementStarted) return await settled;
			child?.stdin?.destroy();
			terminationCleanup = params.terminateRemote?.().catch((error) => {
				terminationError = error instanceof Error ? error : new Error(String(error));
			});
			await terminationCleanup;
			if (!outcome) {
				const signalLocal = (signal) => {
					if (exitOutcome) return;
					if (pty) pty.kill(signal);
					else if (child?.pid) {
						const pid = child.pid;
						localSignals.push(new Promise((resolve) => {
							signalProcessTree(pid, signal, {
								detached: process.platform !== "win32",
								onComplete: resolve
							});
						}));
					} else child?.kill(signal);
				};
				signalLocal("SIGTERM");
				if (!exitOutcome) {
					escalation = setTimeout(() => signalLocal("SIGKILL"), SANDBOX_CHILD_TERM_GRACE_MS);
					escalation.unref?.();
				}
				const reaped = await Promise.race([closed.promise.then(() => true), delay(SANDBOX_CHILD_REAP_TIMEOUT_MS).then(() => false)]).finally(() => clearTimeout(escalation));
				await Promise.all(localSignals);
				if (!reaped) throw new Error(`Sandbox child process tree ${pty?.pid ?? child?.pid ?? "unknown"} survived SIGKILL; tear down the sandbox environment and inspect the surviving process tree before retrying.`);
			}
			const result = await settled;
			if (terminationError) throw terminationError;
			return result;
		})()
	};
	params.owners.add(owner);
	settled.then(() => params.owners.delete(owner), () => params.owners.delete(owner));
	const interrupt = async () => {
		await ready.promise;
		const interruptRemote = params.interruptRemote;
		if (exitOutcome || terminationRequested || !interruptRemote) return;
		const interruption = (async () => {
			const deadline = performance.now() + SANDBOX_CHILD_REAP_TIMEOUT_MS;
			while (true) {
				if (exitOutcome || terminationRequested) return;
				const remainingMs = Math.ceil(deadline - performance.now());
				if (remainingMs <= 0) throw new Error("Sandbox process interrupt timed out waiting for remote process admission");
				assertCurrent();
				if (await interruptRemote(remainingMs)) return;
				await Promise.race([delay(Math.min(SANDBOX_CHILD_INTERRUPT_POLL_MS, Math.max(0, deadline - performance.now()))), exited.promise]);
			}
		})();
		interruptions.add(interruption);
		try {
			await interruption;
		} finally {
			interruptions.delete(interruption);
		}
	};
	try {
		if (params.usePty) {
			const env = Object.fromEntries(Object.entries(params.env).filter((entry) => entry[1] !== void 0));
			pty = await spawnTerminalPty({
				file: command,
				args,
				cwd: params.cwd,
				env,
				cols: 80,
				rows: 24
			}, { assertCurrent });
			pty.onExit(({ exitCode, signal }) => {
				recordClose(signal ? 1 : exitCode, signal || null);
			});
			return {
				...owner,
				pty,
				interrupt
			};
		}
		assertCurrent();
		child = spawn(command, args, {
			detached: process.platform !== "win32",
			env: params.env,
			cwd: params.cwd,
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			]
		});
		child.once("exit", (code, signal) => recordExit(code ?? 1, signal));
		child.once("close", (code, signal) => recordClose(code ?? 1, signal));
		const markStartFailed = () => {
			startFailed = true;
		};
		child.once("error", markStartFailed);
		try {
			await once(child, "spawn");
		} finally {
			child.off("error", markStartFailed);
		}
		return {
			...owner,
			process: child,
			interrupt
		};
	} catch (error) {
		startFailed = true;
		if (!child) recordClose(1, null);
		await settled.catch(() => void 0);
		throw error;
	} finally {
		startupPending = false;
		ready.resolve();
	}
}
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms).unref?.();
	});
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/http.ts
/**
* Implements sandboxed HTTP requests for Codex native tools by routing network
* access through the active OpenClaw sandbox backend.
*/
/** Maximum JSON-line size accepted from the streaming HTTP helper process. */
const SANDBOX_HTTP_STREAM_LINE_MAX_CHARS = 262144;
/** Handles one sandbox HTTP JSON-RPC request, optionally streaming response body deltas. */
async function httpRequest(execServer, notifications, params, operations) {
	const record = requireObject(params, "http/request params");
	const requestId = requireString(record.requestId, "requestId");
	const url = requireString(record.url, "url");
	const redirectPolicy = record.redirectPolicy ?? "follow";
	if (redirectPolicy !== "follow" && redirectPolicy !== "stop") throw new Error("http/request redirectPolicy must be follow or stop");
	assertSandboxHttpRequestTargetAllowed(url);
	const request = {
		method: requireString(record.method, "method"),
		url,
		headers: readHttpHeaders(record.headers),
		bodyBase64: typeof record.bodyBase64 === "string" ? record.bodyBase64 : void 0,
		timeoutMs: typeof record.timeoutMs === "number" && record.timeoutMs > 0 ? Math.floor(record.timeoutMs) : void 0,
		redirectPolicy,
		streamResponse: record.streamResponse === true
	};
	const response = createDeferred();
	const operation = runSandboxHttpRequest(execServer, notifications, requestId, request, response);
	operations.add(operation);
	operation.then(() => operations.delete(operation), (error) => {
		operations.delete(operation);
		response.reject(error);
	});
	return await response.promise;
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
async function runSandboxHttpRequest(execServer, notifications, requestId, params, response) {
	const lifecycle = { failed: false };
	let owner;
	try {
		notifications.signal.throwIfAborted();
		const backend = execServer.backend;
		const remoteExec = prepareSandboxProcessCleanup(backend, {});
		const execSpec = await backend.buildExecSpec({
			command: SANDBOX_HTTP_REQUEST_SCRIPT,
			workdir: execServer.sandbox.containerWorkdir,
			env: remoteExec.env,
			usePty: false
		});
		owner = await spawnSandboxChild({
			argv: execSpec.argv,
			env: execSpec.env,
			cwd: execSpec.cwd,
			assertCurrent: () => {
				notifications.signal.throwIfAborted();
				execSpec.assertCurrent?.();
			},
			finalizeExec: backend.finalizeExec,
			finalizeToken: execSpec.finalizeToken,
			finalizeStatus: (outcome) => lifecycle.failed || outcome.exitCode !== 0 ? "failed" : "completed",
			onFinalizeError: (error) => {
				embeddedAgentLog.warn("codex sandbox http/request finalize failed", { error });
			},
			owners: execServer.children,
			terminateRemote: remoteExec.terminate
		});
	} catch (error) {
		response.reject(error);
		return;
	}
	const child = owner.process;
	const completion = createDeferred();
	owner.settled.then(() => completion.resolve(), completion.reject);
	let termination;
	const terminate = () => {
		if (!termination) {
			termination = owner.terminate().then(() => void 0);
			termination.then(completion.resolve, completion.reject);
		}
		return termination;
	};
	const abortOnSessionClose = () => {
		lifecycle.failed = true;
		terminate().catch((error) => {
			embeddedAgentLog.warn("codex sandbox http/request cleanup failed", { error });
		});
	};
	notifications.signal.addEventListener("abort", abortOnSessionClose, { once: true });
	child.once("close", () => {
		notifications.signal.removeEventListener("abort", abortOnSessionClose);
	});
	child.stdin.on("error", (error) => {
		if (error.code === "EPIPE" || error.code === "ERR_STREAM_DESTROYED") return;
		embeddedAgentLog.warn("codex sandbox http/request stdin write failed", { error });
	});
	readSandboxHttpResponse({
		child,
		lifecycle,
		terminate,
		requestId,
		notifications,
		streamResponse: params.streamResponse
	}).then(response.resolve, response.reject);
	try {
		if (notifications.signal.aborted) abortOnSessionClose();
		else {
			owner.assertCurrent();
			child.stdin.end(JSON.stringify(params));
		}
		await completion.promise;
		await termination;
	} catch (error) {
		lifecycle.failed = true;
		response.reject(error);
		await terminate().catch((cleanupError) => {
			embeddedAgentLog.warn("codex sandbox http/request cleanup failed", { error: cleanupError });
		});
		throw error;
	} finally {
		notifications.signal.removeEventListener("abort", abortOnSessionClose);
	}
}
function readSandboxHttpResponse(params) {
	return new Promise((resolve, reject) => {
		let headerResolved = false;
		let failed = false;
		let childFailure = null;
		let lastBodySeq = 0;
		let stdoutBuffer = "";
		let stderr = "";
		const buffered = {
			stdout: {
				chunks: [],
				bytes: 0
			},
			stderr: {
				chunks: [],
				bytes: 0
			}
		};
		const fail = (message) => {
			if (failed) return;
			failed = true;
			params.lifecycle.failed = true;
			params.terminate().catch((error) => {
				embeddedAgentLog.warn("codex sandbox http/request cleanup failed", { error });
			});
			if (headerResolved) {
				if (params.notifications.isOpen()) params.notifications.send("http/request/bodyDelta", {
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
		const bufferOutput = (stream, chunk) => {
			const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			const output = buffered[stream];
			output.bytes += buffer.byteLength;
			if (output.bytes > SANDBOX_COMMAND_MAX_BUFFER_BYTES) {
				fail(`sandbox http/request ${stream} exceeded ${SANDBOX_COMMAND_MAX_BUFFER_BYTES} bytes`);
				return;
			}
			output.chunks.push(buffer);
		};
		if (params.streamResponse) {
			params.child.stdout.setEncoding("utf8");
			params.child.stderr.setEncoding("utf8");
		}
		params.child.stdout.on("data", (chunk) => {
			if (failed) return;
			if (!params.streamResponse) {
				bufferOutput("stdout", chunk);
				return;
			}
			const text = typeof chunk === "string" ? chunk : chunk.toString("utf8");
			stdoutBuffer += text;
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
						if (params.notifications.isOpen()) params.notifications.send("http/request/bodyDelta", {
							requestId: params.requestId,
							seq,
							deltaBase64: typeof message.deltaBase64 === "string" ? message.deltaBase64 : "",
							done: message.done === true,
							error: typeof message.error === "string" ? message.error : null
						});
					}
				} catch (error) {
					fail(error instanceof Error ? error.message : String(error));
				}
				newline = stdoutBuffer.indexOf("\n");
			}
			if (stdoutBuffer.length > SANDBOX_HTTP_STREAM_LINE_MAX_CHARS) fail(`sandbox http/request produced an unterminated stdout line longer than ${SANDBOX_HTTP_STREAM_LINE_MAX_CHARS} characters`);
		});
		params.child.stderr.on("data", (chunk) => {
			if (failed) return;
			if (!params.streamResponse) {
				bufferOutput("stderr", chunk);
				return;
			}
			const text = typeof chunk === "string" ? chunk : chunk.toString("utf8");
			stderr = sliceUtf16Safe(`${stderr}${text}`, -4096);
		});
		params.child.once("error", (error) => {
			childFailure ??= error.message;
			params.lifecycle.failed = true;
		});
		params.child.once("close", (code) => {
			const exitCode = code ?? 1;
			if (failed) return;
			if (childFailure) {
				fail(childFailure);
				return;
			}
			if (exitCode === 0) {
				if (!params.streamResponse) {
					try {
						const parsed = JSON.parse(Buffer.concat(buffered.stdout.chunks).toString("utf8"));
						if (typeof parsed.status !== "number" || !Array.isArray(parsed.headers)) throw new Error("sandbox http/request returned an invalid response envelope");
						resolve({
							status: parsed.status,
							headers: readHttpHeaders(parsed.headers),
							bodyBase64: typeof parsed.bodyBase64 === "string" ? parsed.bodyBase64 : ""
						});
					} catch (error) {
						fail(error instanceof Error ? error.message : String(error));
					}
					return;
				}
				if (!headerResolved) {
					params.lifecycle.failed = true;
					reject(/* @__PURE__ */ new Error("sandbox http/request exited before returning headers"));
				}
				return;
			}
			if (!params.streamResponse) stderr = Buffer.concat(buffered.stderr.chunks).toString("utf8");
			fail(stderr.trim() || `sandbox http/request failed with code ${exitCode}`);
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
    # Python 3.9 lacks the 308 dispatch alias; use the same guarded redirect path.
    http_error_308 = urllib.request.HTTPRedirectHandler.http_error_302

    def __init__(self, redirect_policy):
        self.redirect_policy = redirect_policy

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if self.redirect_policy == "stop":
            return None
        assert_url_allowed(newurl)
        method = req.get_method()
        drop_body = code == 303 or (code in (301, 302) and method == "POST")
        next_headers = dict(req.headers)
        if drop_body:
            if method != "HEAD":
                method = "GET"
            for name in ("content-type", "content-length", "content-encoding", "transfer-encoding"):
                next_headers.pop(name.capitalize(), None)
        redirected = urllib.request.Request(
            newurl,
            data=None if drop_body else req.data,
            headers=next_headers,
            method=method,
            origin_req_host=req.origin_req_host,
            unverifiable=True,
        )
        previous = urllib.parse.urlsplit(req.full_url)
        target = urllib.parse.urlsplit(newurl)
        previous_port = previous.port or (443 if previous.scheme == "https" else 80)
        target_port = target.port or (443 if target.scheme == "https" else 80)
        if (previous.scheme, previous.hostname, previous_port) != (
            target.scheme, target.hostname, target_port
        ):
            # Match Codex's route-aware client: cross-origin hops never inherit secrets.
            for name in ("authorization", "cookie", "proxy-authorization", "www-authenticate", "cookie2"):
                redirected.remove_header(name.capitalize())
        return redirected

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
    redirect_handler = GuardedRedirectHandler(input_data.get("redirectPolicy", "follow"))
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), redirect_handler)
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
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/processes.ts
/**
* Manages subprocess lifecycle, streaming output buffers, stdin writes, and
* termination for Codex sandbox exec-server process RPCs.
*/
const ENV_KEY_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const RETAINED_PROCESS_OUTPUT_BYTES = 1048576;
const CLOSED_PROCESS_EVICTION_MS = 6e4;
/** Starts a sandbox-backed process and registers it in the connection-local process table. */
async function startProcess(execServer, processes, notify, params, processAuthority) {
	const record = requireObject(params, "process/start params");
	const processId = requireString(record.processId, "processId");
	if (processes.has(processId)) throw new Error(`process already exists: ${processId}`);
	const argv = requireStringArray(record.argv, "argv");
	const cwd = resolveExecServerPath(requireString(record.cwd, "cwd"), "process cwd");
	rejectUnsupportedArg0(record.arg0);
	assertSupportedProcessSandbox(execServer, record);
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
		terminationRequested: false,
		child: null,
		waiters: [],
		emitNotification: notify,
		evictProcess: () => {
			if (managed.evictionTimer) return;
			managed.evictionTimer = setTimeout(() => {
				if (processes.get(processId) === managed && managed.closed) processes.delete(processId);
			}, CLOSED_PROCESS_EVICTION_MS);
			managed.evictionTimer.unref?.();
		}
	};
	const source = processAuthority?.claim(record.metadata, async () => {
		await terminateManagedProcess(managed);
	});
	processes.set(processId, managed);
	const startPromise = runProcess(execServer, managed, {
		argv,
		cwd,
		env,
		source
	});
	managed.startPromise = startPromise;
	startPromise.catch(() => void 0).then(async () => {
		await managed.child?.settled;
		if (managed.terminationRequested) await managed.child?.terminate();
		source?.settle();
	}).catch((error) => {
		source?.fail(error);
		embeddedAgentLog.warn("codex sandbox process settlement failed", {
			processId,
			error: coerceErrorMessage(error)
		});
	});
	try {
		await startPromise;
	} catch (error) {
		managed.failure = coerceErrorMessage(error);
		await managed.child?.terminate().catch((cleanupError) => {
			embeddedAgentLog.warn("codex sandbox failed-start cleanup failed", {
				processId,
				error: coerceErrorMessage(cleanupError)
			});
		});
		processes.delete(processId);
		managed.exitCode = null;
		managed.exited = true;
		managed.closed = true;
		notifyProcessWaiters(managed);
		throw error;
	} finally {
		if (managed.startPromise === startPromise) managed.startPromise = void 0;
	}
	return {
		processId,
		sandboxType: "none"
	};
}
function assertSupportedProcessSandbox(execServer, record) {
	if (record.networkProxy !== void 0 && record.networkProxy !== null) throw new Error("Codex sandbox exec-server network proxy launch is not supported.");
	if (record.enforceManagedNetwork === true || record.managedNetwork !== void 0 && record.managedNetwork !== null) throw new Error("Codex managed network restrictions cannot be enforced by the sandbox backend.");
	if (resolveFsSandboxPolicy(execServer, record)?.unrestricted === false) throw new Error("Codex process filesystem sandbox restrictions cannot be enforced by the backend.");
	if (record.sandbox === void 0 || record.sandbox === null) return;
	if (requireObject(requireObject(record.sandbox, "process sandbox context").permissions, "process sandbox permissions").network !== "restricted") return;
	if (!execServer.networkIsolated) throw new Error("Codex network restrictions cannot be enforced by the sandbox backend.");
}
async function runProcess(execServer, managed, params) {
	const backend = execServer.backend;
	params.source?.assertAdmission();
	throwIfProcessStartCancelled(managed);
	const remoteExec = prepareSandboxProcessCleanup(backend, params.env);
	const execSpec = await backend.buildExecSpec({
		command: `exec ${buildRemoteCommand(params.argv)}`,
		workdir: params.cwd,
		env: remoteExec.env,
		usePty: managed.tty
	});
	if (managed.terminationRequested) {
		await backend.finalizeExec?.({
			status: "failed",
			exitCode: null,
			timedOut: false,
			token: execSpec.finalizeToken
		});
		throw new Error("process start cancelled");
	}
	let spawned = false;
	const owner = await spawnSandboxChild({
		argv: execSpec.argv,
		env: execSpec.env,
		cwd: execSpec.cwd,
		usePty: managed.tty,
		assertCurrent: () => {
			if (spawned) params.source?.assertCurrent();
			else params.source?.assertAdmission();
			execSpec.assertCurrent?.();
			throwIfProcessStartCancelled(managed);
		},
		finalizeExec: backend.finalizeExec,
		finalizeToken: execSpec.finalizeToken,
		finalizeStatus: () => managed.failure ? "failed" : "completed",
		onFinalizeError: (error) => {
			const message = coerceErrorMessage(error);
			managed.failure ??= message;
			embeddedAgentLog.warn("codex sandbox exec-server finalize failed", {
				processId: managed.processId,
				error: message
			});
		},
		owners: execServer.children,
		terminateRemote: remoteExec.terminate,
		interruptRemote: remoteExec.interrupt
	});
	spawned = true;
	managed.child = owner;
	owner.exited.then(({ exitCode }) => emitProcessExited(managed, exitCode));
	owner.closed.then(({ exitCode }) => emitProcessClosed(managed, exitCode));
	if ("pty" in owner) {
		owner.pty.onData((chunk) => appendProcessChunk(managed, "pty", Buffer.from(chunk)));
		return;
	}
	const child = owner.process;
	child.stdout.on("data", (chunk) => appendProcessChunk(managed, "stdout", chunk));
	child.stderr.on("data", (chunk) => appendProcessChunk(managed, "stderr", chunk));
	child.once("error", (error) => {
		managed.failure ??= error.message;
		notifyProcessWaiters(managed);
	});
	child.stdin.on("error", (error) => {
		managed.failure ??= error.message;
		notifyProcessWaiters(managed);
	});
	owner.assertCurrent();
	if (!managed.tty && !managed.pipeStdin) child.stdin.end();
}
function throwIfProcessStartCancelled(managed) {
	if (managed.terminationRequested) throw new Error("process start cancelled");
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
function emitProcessExited(managed, exitCode) {
	if (!managed.exited) {
		const exitSeq = managed.nextSeq;
		managed.nextSeq += 1;
		managed.exitCode = exitCode;
		managed.exited = true;
		if (exitCode !== null) managed.emitNotification("process/exited", {
			processId: managed.processId,
			seq: exitSeq,
			exitCode,
			sandboxDenied: false
		});
	}
	notifyProcessWaiters(managed);
}
function emitProcessClosed(managed, exitCode) {
	emitProcessExited(managed, exitCode);
	if (!managed.closed) {
		const closeSeq = managed.nextSeq;
		managed.nextSeq += 1;
		managed.closed = true;
		managed.emitNotification("process/closed", {
			processId: managed.processId,
			seq: closeSeq
		});
	}
	managed.evictProcess();
	notifyProcessWaiters(managed);
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
	if (!managed.closed && managed.nextSeq - 1 <= afterSeq && waitMs > 0) await waitForProcessUpdate(managed, waitMs);
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
	if (!managed.tty && !managed.pipeStdin || managed.closed || !managed.child) return { status: "stdinClosed" };
	if ("pty" in managed.child) {
		managed.child.assertCurrent();
		managed.child.pty.write(chunk);
	} else {
		if (!managed.child.process.stdin.writable) return { status: "stdinClosed" };
		managed.child.assertCurrent();
		managed.child.process.stdin.write(chunk);
	}
	return { status: "accepted" };
}
async function signalProcess(processes, params) {
	const record = requireObject(params, "process/signal params");
	const processId = requireString(record.processId, "processId");
	if (record.signal !== "interrupt") throw new Error("process/signal only supports interrupt");
	const managed = processes.get(processId);
	if (managed && !managed.exited) {
		await managed.startPromise;
		managed.child?.assertCurrent();
		await managed.child?.interrupt();
	}
	return {};
}
/** Requests process termination and reports whether it was running at call time. */
async function terminateProcess(processes, params) {
	const processId = requireString(requireObject(params, "process/terminate params").processId, "processId");
	const managed = processes.get(processId);
	if (!managed) return { running: false };
	return await terminateManagedProcess(managed);
}
async function terminateManagedProcess(managed) {
	const running = !managed.exited;
	managed.terminationRequested = true;
	await managed.startPromise?.catch(() => void 0);
	if (managed.child) await managed.child.terminate();
	else if (running && !managed.closed) emitProcessClosed(managed, null);
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
	const requestedEnv = {
		...buildEnvFromPolicy(record.envPolicy),
		...readEnv(record.env)
	};
	return sanitizeEnvVars(requestedEnv).allowed;
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
//#region extensions/codex/src/app-server/sandbox-exec-server/session.ts
/** Owns the JSON-RPC protocol and resources of one sandbox execution connection. */
/** Connection-local execution state; closing it never enables session resumption. */
var CodexSandboxExecSession = class {
	constructor(execServer, transport, processAuthority) {
		this.execServer = execServer;
		this.transport = transport;
		this.processAuthority = processAuthority;
		this.processes = /* @__PURE__ */ new Map();
		this.fileReads = /* @__PURE__ */ new Map();
		this.httpRequests = /* @__PURE__ */ new Set();
		this.closeController = new AbortController();
		this.notifications = {
			isOpen: transport.isOpen,
			signal: this.closeController.signal,
			send: (method, params) => {
				if (transport.isOpen()) transport.send({
					jsonrpc: "2.0",
					method,
					params
				});
			}
		};
	}
	async handleRequest(request) {
		const method = request.method;
		if (!method) {
			sendError(this.transport.send, request.id, -32600, "Invalid Request");
			return;
		}
		if (request.id === void 0) {
			if (method !== "initialized") sendError(this.transport.send, -1, -32600, `Unexpected notification: ${method}`);
			return;
		}
		try {
			const result = await this.dispatchRequest(method, request.params);
			sendResult(this.transport.send, request.id, result);
		} catch (error) {
			sendError(this.transport.send, request.id, error instanceof JsonRpcProtocolError ? error.code : -32603, error instanceof Error ? error.message : String(error));
		}
	}
	close() {
		if (!this.cleanup) {
			this.closeController.abort();
			closeAllFileReads(this.fileReads);
			this.cleanup = Promise.allSettled([...this.httpRequests, ...[...this.processes.keys()].map(async (processId) => terminateProcess(this.processes, { processId }))]).then((results) => {
				const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (failures.length > 0) throw new AggregateError(failures, "Codex sandbox execution cleanup failed");
			});
		}
		return this.cleanup;
	}
	async dispatchRequest(method, params) {
		switch (method) {
			case "initialize": return { sessionId: randomUUID() };
			case "environment/info": return {
				shell: {
					name: "sh",
					path: "/bin/sh"
				},
				cwd: pathToFileURL(this.execServer.sandbox.containerWorkdir, { windows: false }).href,
				capabilities: { networkProxyLaunch: false }
			};
			case "environment/status": return { status: "ready" };
			case "process/start": return startProcess(this.execServer, this.processes, this.notifications.send, params, this.processAuthority);
			case "process/read": return await readProcess(this.processes, params);
			case "process/write": return writeProcess(this.processes, params);
			case "process/signal": return await signalProcess(this.processes, params);
			case "process/terminate": return await terminateProcess(this.processes, params);
			case "fs/open": return await openFile(this.execServer, this.fileReads, params);
			case "fs/readBlock": return readFileBlock(this.fileReads, params);
			case "fs/close": return closeFile(this.fileReads, params);
			case "fs/readFile": return await readFile(this.execServer, params);
			case "fs/writeFile":
				await writeFile(this.execServer, params);
				return {};
			case "fs/createDirectory":
				await createDirectory(this.execServer, params);
				return {};
			case "fs/getMetadata": return await getMetadata(this.execServer, params);
			case "fs/readDirectory": return await readDirectory(this.execServer, params);
			case "fs/remove":
				await removePath(this.execServer, params);
				return {};
			case "fs/copy":
				await copyPath(this.execServer, params);
				return {};
			case "http/request": return await httpRequest(this.execServer, this.notifications, params, this.httpRequests);
			default: throw new JsonRpcProtocolError(JSON_RPC_METHOD_NOT_FOUND, `Unsupported OpenClaw sandbox exec-server method: ${method}`);
		}
	}
};
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server.ts
/**
* Hosts the local OpenClaw sandbox exec-server that Codex app-server native
* execution can register as an external environment.
*/
const CODEX_SANDBOX_EXEC_SERVER_MAX_INBOUND_MESSAGE_BYTES = 104857600;
const CODEX_NODE_EXEC_SERVER_MAX_MESSAGE_BYTES = 67108864;
const codexNodeExecServerLeases = /* @__PURE__ */ new WeakMap();
/** Starts or reuses a sandbox exec-server and registers it with Codex app-server. */
async function ensureCodexSandboxExecServerEnvironment(params) {
	if (!params.sandbox?.enabled) return;
	const placementNodeId = readCodexPlacementNodeId(params.sandbox);
	if (!params.sandbox.backend && !placementNodeId) return;
	if (placementNodeId && !params.runtime) throw new Error("Codex node execution requires its active plugin runtime.");
	if (!canExposeLocalExecServerToAppServer(params.appServerStartOptions)) throw new Error("OpenClaw Codex exec-server uses a local loopback URL and cannot be registered with a remote Codex app-server.");
	const { server: execServer, nodeLease } = await acquireOpenClawExecServer({
		sandbox: params.sandbox,
		runtime: params.runtime,
		signal: params.signal,
		onExecutionDisconnect: params.onExecutionDisconnect
	});
	const processAuthority = params.requireProcessAuthority && !("node" in execServer) ? getCodexNativeProcessClient(params.client) : void 0;
	if (processAuthority && !("node" in execServer)) {
		const authorities = execServer.processAuthorities ??= /* @__PURE__ */ new Map();
		if (!authorities.has(processAuthority.authPath)) {
			authorities.set(processAuthority.authPath, processAuthority);
			params.client.addCloseHandler(() => authorities.delete(processAuthority.authPath));
		}
	}
	const environmentId = nodeLease ? `openclaw-node-${nodeLease.id}` : processAuthority ? `${execServer.environmentId}-${processAuthority.id}` : execServer.environmentId;
	try {
		const execServerUrl = nodeLease ? `${execServer.url}?lease=${nodeLease.id}` : processAuthority ? new URL(processAuthority.authPath, execServer.url).href : execServer.url;
		await params.client.request("environment/add", {
			environmentId,
			execServerUrl
		}, {
			timeoutMs: params.timeoutMs,
			signal: params.signal
		});
	} catch (error) {
		if (nodeLease && "node" in execServer) closeCodexNodeExecServerLease(execServer, nodeLease);
		await releaseOpenClawExecServer(execServer);
		throw error;
	}
	const environment = {
		environmentId,
		cwd: params.sandbox.containerWorkdir
	};
	if (nodeLease) codexNodeExecServerLeases.set(environment, nodeLease);
	return environment;
}
/** Releases the sandbox exec-server lease associated with a sandbox runtime. */
async function releaseCodexSandboxExecServerEnvironment(sandbox, environment) {
	if (!sandbox?.enabled) return;
	const server = await sandboxExecServerRegistry.servers.get(sandbox.runtimeId)?.catch(() => void 0);
	if (server) {
		const nodeLease = environment && codexNodeExecServerLeases.get(environment);
		if (nodeLease && "node" in server) {
			codexNodeExecServerLeases.delete(environment);
			closeCodexNodeExecServerLease(server, nodeLease);
		}
		await releaseOpenClawExecServer(server);
	}
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
async function acquireOpenClawExecServer(params) {
	const { sandbox, runtime, signal, onExecutionDisconnect } = params;
	const key = sandbox.runtimeId;
	while (true) {
		const promise = sandboxExecServerRegistry.servers.get(key) ?? startAndRememberOpenClawExecServer(sandbox);
		const server = await promise;
		if (!server.closed && sandboxExecServerRegistry.servers.get(key) === promise) {
			server.refCount += 1;
			if (!("node" in server)) return { server };
			if (!runtime || !signal) {
				await releaseOpenClawExecServer(server);
				throw new Error("Codex node execution requires an active runtime and attempt.");
			}
			try {
				const placementIdentity = readCodexPlacementWorkspaceIdentity(sandbox);
				const channel = await runtime.nodes.openDuplex({
					nodeId: server.node.id,
					command: "codex.exec-server.stdio.v1",
					params: {
						cwd: sandbox.containerWorkdir,
						...placementIdentity
					},
					sessionKey: sandbox.sessionKey,
					timeoutMs: 0,
					maxMessageBytes: CODEX_NODE_EXEC_SERVER_MAX_MESSAGE_BYTES,
					maxOutstandingDeliveryBytes: 69206016,
					signal
				});
				if (signal.aborted || server.closed || sandboxExecServerRegistry.servers.get(key) !== promise) {
					channel.close();
					throw new Error("Codex node execution retired before its channel was ready.");
				}
				const nodeLease = {
					id: randomUUID(),
					channel,
					claimed: false,
					closed: false,
					onDisconnected: onExecutionDisconnect
				};
				server.node.leases.set(nodeLease.id, nodeLease);
				channel.closed.then(() => handleClosedCodexNodeExecServerLease(server, nodeLease, { failed: false }), (error) => handleClosedCodexNodeExecServerLease(server, nodeLease, {
					failed: true,
					error
				})).catch((error) => {
					embeddedAgentLog.warn("codex paired-device exec-server lease cleanup failed", { error: error instanceof Error ? error.message : String(error) });
				});
				return {
					server,
					nodeLease
				};
			} catch (error) {
				await releaseOpenClawExecServer(server);
				throw error;
			}
		}
	}
}
function startAndRememberOpenClawExecServer(sandbox) {
	const created = startOpenClawExecServer(sandbox);
	const key = sandbox.runtimeId;
	sandboxExecServerRegistry.servers.set(key, created);
	created.catch(() => {
		if (sandboxExecServerRegistry.servers.get(key) === created) sandboxExecServerRegistry.servers.delete(key);
	});
	return created;
}
async function startOpenClawExecServer(sandbox) {
	const backend = sandbox.backend;
	const fsBridge = sandbox.fsBridge;
	const placementNodeId = readCodexPlacementNodeId(sandbox);
	let connection;
	if (placementNodeId) connection = {
		kind: "node",
		id: placementNodeId
	};
	else {
		if (!backend) throw new Error("OpenClaw sandbox backend is unavailable.");
		if (!fsBridge) throw new Error("Sandbox filesystem bridge is unavailable.");
		connection = {
			kind: "sandbox",
			backend,
			fsBridge
		};
	}
	const server = new websocket.WebSocketServer({
		host: "127.0.0.1",
		port: 0,
		maxPayload: connection.kind === "node" ? CODEX_NODE_EXEC_SERVER_MAX_MESSAGE_BYTES : CODEX_SANDBOX_EXEC_SERVER_MAX_INBOUND_MESSAGE_BYTES
	});
	await once(server, "listening");
	const address = server.address();
	if (!address || typeof address === "string") throw new Error("OpenClaw Codex exec-server did not bind to a TCP port.");
	const environmentId = buildEnvironmentId(sandbox);
	const authPath = `/openclaw-${randomUUID()}`;
	const common = {
		authPath,
		closed: false,
		environmentId,
		refCount: 0,
		url: `ws://127.0.0.1:${address.port}${authPath}`,
		sandbox,
		server,
		children: /* @__PURE__ */ new Set(),
		cleanupTasks: /* @__PURE__ */ new Set()
	};
	const execServer = connection.kind === "node" ? {
		...common,
		node: {
			id: connection.id,
			leases: /* @__PURE__ */ new Map()
		}
	} : {
		...common,
		backend: connection.backend,
		fsBridge: connection.fsBridge,
		networkIsolated: (connection.backend.id === "docker" || connection.backend.id === "podman") && sandbox.docker.network.trim().toLowerCase() === "none"
	};
	server.on("connection", (socket, request) => {
		socket.on("error", handleExecServerSocketError);
		if (!isAuthorizedExecServerRequest(execServer, request)) {
			socket.close(1008, "unauthorized");
			return;
		}
		if ("node" in execServer) {
			handleNodeConnection(execServer, socket, request);
			return;
		}
		const requestPath = new URL(request.url ?? "", "ws://127.0.0.1").pathname;
		handleConnection(execServer, socket, execServer.processAuthorities?.get(requestPath));
	});
	embeddedAgentLog.info("codex sandbox exec-server started", {
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
	const current = await sandboxExecServerRegistry.servers.get(execServer.sandbox.runtimeId)?.catch(() => void 0);
	if (execServer.refCount > 0 || execServer.closed) return;
	if (current === execServer) sandboxExecServerRegistry.servers.delete(execServer.sandbox.runtimeId);
	await sandboxExecServerRegistry.close(execServer);
}
function buildEnvironmentId(sandbox) {
	return `openclaw-sandbox-${createHash("sha256").update(sandbox.runtimeId).digest("hex").slice(0, 16)}`;
}
function isAuthorizedExecServerRequest(execServer, request) {
	const url = new URL(request.url ?? "", "ws://127.0.0.1");
	return url.pathname === execServer.authPath || !("node" in execServer) && execServer.processAuthorities?.has(url.pathname) === true;
}
function readCodexPlacementNodeId(sandbox) {
	if (!("placementExecutionMode" in sandbox) || sandbox.placementExecutionMode !== "remote-exec" || !("placementNodeId" in sandbox) || typeof sandbox.placementNodeId !== "string" || !sandbox.placementNodeId) return;
	return sandbox.placementNodeId;
}
function readCodexPlacementWorkspaceIdentity(sandbox) {
	if (!("placementEnvironmentId" in sandbox) || typeof sandbox.placementEnvironmentId !== "string" || !sandbox.placementEnvironmentId || sandbox.placementEnvironmentId.trim() !== sandbox.placementEnvironmentId || !("placementSessionId" in sandbox) || typeof sandbox.placementSessionId !== "string" || !sandbox.placementSessionId || sandbox.placementSessionId.trim() !== sandbox.placementSessionId || !("placementOwnerEpoch" in sandbox) || typeof sandbox.placementOwnerEpoch !== "number" || !Number.isSafeInteger(sandbox.placementOwnerEpoch) || sandbox.placementOwnerEpoch < 1 || !sandbox.sessionKey || sandbox.sessionKey.trim() !== sandbox.sessionKey) throw new Error("Codex node execution requires its exact placement workspace identity.");
	return {
		environmentId: sandbox.placementEnvironmentId,
		sessionId: sandbox.placementSessionId,
		ownerEpoch: sandbox.placementOwnerEpoch,
		sessionKey: sandbox.sessionKey
	};
}
function handleNodeConnection(execServer, socket, request) {
	const leaseId = new URL(request.url ?? "", "ws://127.0.0.1").searchParams.get("lease");
	const lease = leaseId ? execServer.node.leases.get(leaseId) : void 0;
	if (!lease || lease.claimed || lease.closed) {
		socket.close(1008, "execution channel unavailable");
		return;
	}
	lease.claimed = true;
	const cleanup = startCodexNodeExecServerRelay({
		lease,
		socket
	});
	execServer.cleanupTasks.add(cleanup);
	cleanup.then(() => execServer.cleanupTasks.delete(cleanup), (error) => {
		execServer.cleanupTasks.delete(cleanup);
		embeddedAgentLog.warn("codex paired-device exec-server relay failed", { error: error instanceof Error ? error.message : String(error) });
	});
}
function closeCodexNodeExecServerLease(execServer, lease) {
	execServer.node.leases.delete(lease.id);
	if (!lease.closed) {
		lease.closed = true;
		lease.closeRelay?.();
		lease.channel.close();
	}
}
function handleClosedCodexNodeExecServerLease(execServer, lease, result) {
	if (lease.closed) return;
	if (lease.onChannelClosed) {
		lease.onChannelClosed(result);
		return;
	}
	try {
		lease.onDisconnected?.(createCodexNodeExecServerDisconnectError(result.failed ? "execution node failed" : "execution node disconnected", result.error));
	} finally {
		closeCodexNodeExecServerLease(execServer, lease);
	}
}
function handleConnection(execServer, socket, processAuthority) {
	const session = new CodexSandboxExecSession(execServer, {
		isOpen: () => socket.readyState === socket.OPEN,
		send: (message) => socket.send(JSON.stringify(message))
	}, processAuthority);
	socket.on("message", (data) => {
		handleMessage(session, data).catch((error) => {
			embeddedAgentLog.warn("codex sandbox exec-server message failed", { error });
		});
	});
	socket.on("close", () => {
		const cleanup = session.close();
		execServer.cleanupTasks.add(cleanup);
		cleanup.then(() => execServer.cleanupTasks.delete(cleanup), (error) => {
			execServer.cleanupTasks.delete(cleanup);
			embeddedAgentLog.warn("codex sandbox exec-server socket cleanup failed", { error: error instanceof Error ? error.message : String(error) });
		});
	});
}
function handleExecServerSocketError(error) {
	embeddedAgentLog.debug("codex sandbox exec-server websocket failed", { error });
}
async function handleMessage(session, data) {
	const buffer = Array.isArray(data) ? Buffer.concat(data) : Buffer.isBuffer(data) ? data : Buffer.from(data);
	await session.handleRequest(parseRequest(buffer.toString("utf8")));
}
//#endregion
//#region extensions/codex/src/app-server/native-command-approval.ts
const PERSISTENT_APPROVAL_TARGET_MAX_LENGTH = 256;
function resolveCommandApproval(requestParams, outcome) {
	if (outcome === "cancelled") return {
		scope: "cancelled",
		decision: "cancel"
	};
	if (outcome === "denied" || outcome === "unavailable") return {
		scope: "denied",
		decision: "decline"
	};
	const capabilities = commandApprovalCapabilities(requestParams);
	if (outcome === "approved-session" && capabilities.repeated) return capabilities.repeated;
	return capabilities.once ? {
		scope: "once",
		decision: "accept"
	} : {
		scope: "denied",
		decision: "decline"
	};
}
function commandApprovalAllowedDecisions(requestParams, requiresOneShot) {
	if (!Array.isArray(requestParams?.availableDecisions)) return;
	const capabilities = commandApprovalCapabilities(requestParams);
	const decisions = [];
	if (capabilities.once) decisions.push("allow-once");
	if (!requiresOneShot && capabilities.repeated) decisions.push("allow-always");
	decisions.push("deny");
	return decisions;
}
function commandApprovalCapabilities(requestParams) {
	const available = requestParams?.availableDecisions;
	if (!Array.isArray(available)) return {
		once: true,
		repeated: {
			scope: "session",
			decision: "acceptForSession"
		}
	};
	return {
		once: available.includes("accept"),
		repeated: available.includes("acceptForSession") ? {
			scope: "session",
			decision: "acceptForSession"
		} : findAvailableCommandPersistentApproval(available)
	};
}
function findAvailableCommandPersistentApproval(available) {
	for (const decision of available) {
		if (!isJsonObject(decision)) continue;
		const exec = decision.acceptWithExecpolicyAmendment;
		const network = decision.applyNetworkPolicyAmendment;
		const prefix = isJsonObject(exec) ? exec.execpolicy_amendment : void 0;
		const amendment = isJsonObject(network) ? network.network_policy_amendment : void 0;
		let target;
		if (Array.isArray(prefix) && prefix.length > 0 && prefix.every((part) => typeof part === "string")) target = `Command prefix: ${JSON.stringify(prefix)}`;
		else if (isJsonObject(amendment) && amendment.action === "allow" && typeof amendment.host === "string" && amendment.host.length > 0) target = `Network host: ${JSON.stringify(amendment.host)}`;
		else continue;
		if (target.length > PERSISTENT_APPROVAL_TARGET_MAX_LENGTH || sanitizeCodexApprovalVisibleText(target) !== target) continue;
		return {
			scope: "persistent",
			decision,
			description: `Allow Always requests a persistent allow rule for future sessions.\n${target}`
		};
	}
}
//#endregion
//#region extensions/codex/src/app-server/approval-bridge.ts
/**
* Bridges Codex app-server approval requests into OpenClaw policy hooks and
* plugin approval UX.
*/
const PERMISSION_DESCRIPTION_MAX_LENGTH = 700;
const PERMISSION_SAMPLE_LIMIT = 2;
const PERMISSION_VALUE_MAX_LENGTH = 48;
const COMMAND_PREVIEW_WITH_DETAILS_MAX_LENGTH = 80;
const APPROVAL_PREVIEW_SCAN_MAX_LENGTH = 4096;
const APPROVAL_PREVIEW_OMITTED = "[preview truncated or unsafe content omitted]";
const CONCRETE_TOOL_AUTO_APPROVAL_METHODS = /* @__PURE__ */ new Set(["item/commandExecution/requestApproval", "item/fileChange/requestApproval"]);
/**
* Handles one app-server approval request for the active thread/turn, returning
* the app-server response payload when the request belongs to this run.
*/
async function handleCodexAppServerApprovalRequest(params) {
	const requestParams = isJsonObject(params.requestParams) ? params.requestParams : void 0;
	if (!matchesCurrentTurn(requestParams, params.threadId, params.turnId)) return;
	const context = buildApprovalContext({
		method: params.method,
		requestParams,
		paramsForRun: params.paramsForRun
	});
	if (params.signal?.aborted) {
		if (params.signal.reason instanceof CodexServerRequestResolvedError) return;
		recordNativeToolFailureDisposition(params, context, "cancelled");
		return buildApprovalResponse(params.method, context.requestParams, "cancelled");
	}
	let revalidateMutableFileApproval;
	let mutableFileApprovalRequiresOneShot = false;
	let approvalId;
	const resolvePolicyApproval = async (outcome, message = approvalResolutionMessage(outcome), resolvedApprovalId) => {
		let resolvedOutcome = outcome;
		let resolvedMessage = message;
		if (outcome !== "denied" && revalidateMutableFileApproval) {
			const binding = await revalidateMutableFileApproval();
			if (!binding.ok) {
				resolvedOutcome = "denied";
				resolvedMessage = binding.message;
			}
		}
		if (resolvedOutcome === "approved-session" && mutableFileApprovalRequiresOneShot) {
			resolvedOutcome = "approved-once";
			resolvedMessage = "Codex app-server approval granted for this byte-bound command only.";
		}
		if (params.method === "item/commandExecution/requestApproval" && resolvedOutcome !== "denied") {
			const resolution = resolveCommandApproval(context.requestParams, resolvedOutcome);
			if (resolution.scope === "denied") {
				resolvedOutcome = "denied";
				resolvedMessage = "Codex app-server request does not offer the approved scope.";
			} else if (resolvedOutcome === "approved-session" && resolution.scope === "once") {
				resolvedOutcome = "approved-once";
				resolvedMessage = approvalResolutionMessage(resolvedOutcome);
			} else if (resolution.scope === "persistent") resolvedMessage = "Codex app-server approval granted; persistent policy amendment requested for future sessions.";
		}
		params.signal?.throwIfAborted();
		if (resolvedOutcome !== "denied") params.paramsForRun.hostCapabilities.assertActive();
		emitApprovalEvent(params.paramsForRun, {
			phase: "resolved",
			kind: context.kind,
			status: resolvedOutcome === "denied" ? "denied" : "approved",
			title: context.title,
			...resolvedApprovalId ? {
				approvalId: resolvedApprovalId,
				approvalSlug: resolvedApprovalId
			} : {},
			...context.eventDetails,
			...approvalEventScope(params.method, resolvedOutcome),
			message: resolvedMessage
		});
		return buildApprovalResponse(params.method, context.requestParams, resolvedOutcome);
	};
	try {
		if (params.method === "item/commandExecution/requestApproval" && !readNetworkApprovalContext(requestParams)) {
			const command = readPolicyCommand(requestParams);
			const cwd = readStringField(requestParams, "cwd") ?? params.paramsForRun.workspaceDir;
			const prepareMutableFileApproval = params.paramsForRun.hostCapabilities.prepareMutableFileApproval;
			if (!prepareMutableFileApproval) return await resolvePolicyApproval("denied", "SYSTEM_RUN_DENIED: mutable file approval binding is unavailable");
			const prepared = await prepareMutableFileApproval({
				command: command ?? "",
				cwd
			});
			if (!prepared.ok) return await resolvePolicyApproval("denied", prepared.message);
			mutableFileApprovalRequiresOneShot = prepared.requiresOneShot;
			revalidateMutableFileApproval = prepared.revalidate;
		}
		const policyOutcome = await runOpenClawToolPolicyForApprovalRequest({
			method: params.method,
			requestParams,
			paramsForRun: params.paramsForRun,
			context,
			nativeHookRelay: params.nativeHookRelay,
			autoApprove: params.autoApprove,
			signal: params.signal
		});
		params.signal?.throwIfAborted();
		if (policyOutcome?.outcome === "denied") {
			recordNativeToolFailureDisposition(params, context, policyOutcome.failureDisposition);
			return await resolvePolicyApproval("denied", policyOutcome.reason);
		}
		if (policyOutcome?.outcome === "approved-once" || policyOutcome?.outcome === "approved-session") return await resolvePolicyApproval(policyOutcome.outcome);
		if (CONCRETE_TOOL_AUTO_APPROVAL_METHODS.has(params.method) && !readNetworkApprovalContext(requestParams) && params.autoApprove === true) return await resolvePolicyApproval("approved-once", "Codex app-server approval auto-approved by runtime policy.");
		const allowedDecisions = nativeApprovalAllowedDecisions({
			method: params.method,
			requestParams,
			requiresOneShot: mutableFileApprovalRequiresOneShot
		});
		const repeatedApproval = params.method === "item/commandExecution/requestApproval" && allowedDecisions?.includes("allow-always") ? commandApprovalCapabilities(requestParams).repeated : void 0;
		const requestResult = await requestPluginApproval({
			hostCapabilities: params.paramsForRun.hostCapabilities,
			signal: params.signal,
			title: context.title,
			description: repeatedApproval?.scope === "persistent" ? `${repeatedApproval.description}\n${context.description}` : context.description,
			severity: context.severity,
			toolName: context.toolName,
			toolCallId: context.approvalId,
			allowedDecisions
		});
		approvalId = requestResult?.id;
		params.signal?.throwIfAborted();
		if (!approvalId) {
			recordNativeToolFailureDisposition(params, context, "failed");
			emitApprovalEvent(params.paramsForRun, {
				phase: "resolved",
				kind: context.kind,
				status: "unavailable",
				title: context.title,
				...context.eventDetails,
				...approvalEventScope(params.method, "denied"),
				message: "Codex app-server approval route unavailable."
			});
			return buildApprovalResponse(params.method, context.requestParams, "denied");
		}
		emitApprovalEvent(params.paramsForRun, {
			phase: "requested",
			kind: context.kind,
			status: "pending",
			title: context.title,
			approvalId,
			approvalSlug: approvalId,
			...context.eventDetails,
			message: "Codex app-server approval requested."
		});
		const approvalResult = approvalRequestExplicitlyUnavailable(requestResult) ? void 0 : await waitForPluginApprovalDecision({
			approvalId,
			signal: params.signal,
			hostCapabilities: params.paramsForRun.hostCapabilities
		});
		params.signal?.throwIfAborted();
		const approvalTimedOut = approvalResult?.terminalReason === "timeout";
		const outcome = mapExecDecisionToOutcome(approvalResult?.decision);
		if (approvalTimedOut) recordNativeToolFailureDisposition(params, context, "timed_out", context.approvalKind);
		else if (outcome === "unavailable") recordNativeToolFailureDisposition(params, context, "failed");
		if (outcome === "approved-once" || outcome === "approved-session") return await resolvePolicyApproval(outcome, approvalResolutionMessage(outcome), approvalId);
		emitApprovalEvent(params.paramsForRun, {
			phase: "resolved",
			kind: context.kind,
			status: outcome,
			title: context.title,
			approvalId,
			approvalSlug: approvalId,
			...context.eventDetails,
			...approvalEventScope(params.method, outcome),
			message: approvalTimedOut ? codexApprovalTimeoutText(context.approvalKind) : approvalResolutionMessage(outcome)
		});
		return buildApprovalResponse(params.method, context.requestParams, outcome);
	} catch (error) {
		if (params.signal?.reason instanceof CodexServerRequestResolvedError) return;
		const cancelled = params.signal?.aborted === true;
		recordNativeToolFailureDisposition(params, context, cancelled && params.signal ? resolveCodexToolAbortTerminalReason(params.signal) : "failed");
		emitApprovalEvent(params.paramsForRun, {
			phase: "resolved",
			kind: context.kind,
			status: cancelled ? "failed" : "unavailable",
			title: context.title,
			...approvalId ? {
				approvalId,
				approvalSlug: approvalId
			} : {},
			...context.eventDetails,
			...approvalEventScope(params.method, cancelled ? "cancelled" : "denied"),
			message: cancelled ? "Codex app-server approval cancelled because the run stopped." : `Codex app-server approval route failed: ${formatCodexDisplayText(coerceErrorMessage(error))}`
		});
		return buildApprovalResponse(params.method, context.requestParams, cancelled ? "cancelled" : "denied");
	}
}
function recordNativeToolFailureDisposition(params, context, disposition, approvalKind) {
	if (!context.itemId || !disposition) return;
	try {
		const resolvedDisposition = params.signal?.aborted ? resolveCodexToolAbortTerminalReason(params.signal) : disposition;
		params.onNativeToolFailureDisposition?.(context.itemId, resolvedDisposition, ...resolvedDisposition === "timed_out" && approvalKind ? [approvalKind] : []);
	} catch {}
}
/** Converts an OpenClaw approval outcome into the app-server method response. */
function buildApprovalResponse(method, requestParams, outcome) {
	if (method === "item/commandExecution/requestApproval") return { decision: resolveCommandApproval(requestParams, outcome).decision };
	if (method === "item/fileChange/requestApproval") return { decision: fileChangeApprovalDecision(outcome) };
	if (method === "item/permissions/requestApproval") {
		if (outcome === "approved-session" || outcome === "approved-once") return {
			permissions: requestedPermissions(requestParams),
			scope: outcome === "approved-session" ? "session" : "turn"
		};
		return {
			permissions: {},
			scope: "turn"
		};
	}
	return {
		decision: "decline",
		reason: "OpenClaw codex app-server bridge does not grant native approvals yet."
	};
}
function matchesCurrentTurn(requestParams, threadId, turnId) {
	if (!requestParams) return false;
	const requestThreadId = readStringField(requestParams, "threadId");
	const requestTurnId = readStringField(requestParams, "turnId");
	return requestThreadId === threadId && requestTurnId === turnId;
}
function buildApprovalContext(params) {
	const itemId = readStringField(params.requestParams, "itemId") ?? readStringField(params.requestParams, "callId") ?? readStringField(params.requestParams, "approvalId");
	const approvalId = readStringField(params.requestParams, "approvalId") ?? itemId;
	const commandDetailLines = params.method === "item/commandExecution/requestApproval" ? describeCommandApprovalDetails(params.requestParams) : [];
	const commandPreview = sanitizeApprovalPreview(readDisplayCommandPreview(params.requestParams), commandDetailLines.length > 0 ? COMMAND_PREVIEW_WITH_DETAILS_MAX_LENGTH : 180);
	const reasonPreview = sanitizeApprovalPreview(readStringPreview(params.requestParams, "reason"), 180);
	const command = commandPreview.text;
	const reason = reasonPreview.text;
	const networkApproval = params.method === "item/commandExecution/requestApproval" ? readNetworkApprovalContext(params.requestParams) : void 0;
	const approvalKind = params.method.includes("commandExecution") ? "command" : params.method.includes("fileChange") ? "file-change" : params.method.includes("permissions") ? "permissions" : "other";
	const kind = approvalKind === "command" ? "exec" : approvalKind === "other" ? "unknown" : "plugin";
	const permissionLines = params.method === "item/permissions/requestApproval" ? describeRequestedPermissions(params.requestParams) : [];
	const title = networkApproval ? "Codex app-server network approval" : kind === "exec" ? "Codex app-server command approval" : params.method === "item/permissions/requestApproval" ? "Codex app-server permission approval" : kind === "plugin" ? "Codex app-server file approval" : "Codex app-server approval";
	const subject = (networkApproval ? `Network: ${sanitizePermissionScalar(networkApproval.protocol)}://${sanitizePermissionHostValue(networkApproval.host)}` : void 0) ?? permissionLines[0] ?? (command ? `Command: ${formatApprovalPreviewSubject(command, commandPreview.omitted)}` : commandPreview.omitted ? `Command: ${APPROVAL_PREVIEW_OMITTED}` : reason ? `Reason: ${formatApprovalPreviewSubject(reason, reasonPreview.omitted)}` : reasonPreview.omitted ? `Reason: ${APPROVAL_PREVIEW_OMITTED}` : `Request method: ${params.method}`);
	return {
		approvalKind,
		kind,
		title,
		description: permissionLines.length > 0 ? joinDescriptionLinesWithinLimit(permissionLines, PERMISSION_DESCRIPTION_MAX_LENGTH) : [subject, ...commandDetailLines].join("\n"),
		severity: kind === "exec" ? "warning" : "info",
		toolName: networkApproval ? "codex_network_approval" : kind === "exec" ? "codex_command_approval" : params.method === "item/permissions/requestApproval" ? "codex_permission_approval" : "codex_file_approval",
		itemId,
		approvalId,
		requestParams: params.requestParams,
		eventDetails: {
			...itemId ? { itemId } : {},
			...command ? { command } : {},
			...commandPreview.omitted ? { commandPreviewOmitted: true } : {},
			...reason ? { reason } : {},
			...reasonPreview.omitted ? { reasonPreviewOmitted: true } : {}
		}
	};
}
async function runOpenClawToolPolicyForApprovalRequest(params) {
	const policyRequest = buildOpenClawToolPolicyRequest(params.method, params.requestParams);
	if (!policyRequest) return;
	const cwd = readStringField(params.requestParams, "cwd") ?? params.paramsForRun.workspaceDir;
	const nativeRelayOutcome = await runNativeRelayToolPolicyForApprovalRequest({
		method: params.method,
		requestParams: params.requestParams,
		context: params.context,
		policyRequest,
		nativeHookRelay: params.nativeHookRelay,
		autoApprove: params.autoApprove,
		assertActive: params.paramsForRun.hostCapabilities.assertActive,
		cwd,
		signal: params.signal
	});
	if (nativeRelayOutcome?.blocked) return {
		outcome: "denied",
		reason: nativeRelayOutcome.reason,
		...nativeRelayOutcome.failureDisposition ? { failureDisposition: nativeRelayOutcome.failureDisposition } : {}
	};
	if (nativeRelayOutcome?.outcome === "approved-once" || nativeRelayOutcome?.outcome === "approved-session") return { outcome: nativeRelayOutcome.outcome };
	if (nativeRelayOutcome?.handled) return { outcome: "allowed" };
	const outcome = await params.paramsForRun.hostCapabilities.runBeforeToolCall({
		toolName: policyRequest.toolName,
		params: policyRequest.params,
		...cwd ? { nativeOperation: { cwd } } : {},
		...params.context.approvalId ? { toolCallId: params.context.approvalId } : {},
		signal: params.signal
	});
	if (outcome.blocked) return {
		outcome: "denied",
		reason: outcome.reason,
		...outcome.kind === "failure" && outcome.disposition !== "blocked" ? { failureDisposition: outcome.disposition } : {}
	};
	if ("params" in outcome && toolPolicyParamsWereRewritten(policyRequest.params, outcome.params)) return {
		outcome: "denied",
		reason: "OpenClaw tool policy rewrote Codex app-server approval params; refusing original request."
	};
	if (outcome.approvalResolution) return { outcome: "approved-once" };
	return { outcome: "allowed" };
}
async function runNativeRelayToolPolicyForApprovalRequest(params) {
	const nativeHookRelay = params.nativeHookRelay;
	if (params.method !== "item/commandExecution/requestApproval" || !nativeHookRelay?.allowedEvents.includes("pre_tool_use")) return;
	const payload = buildNativeRelayPreToolUsePayload({
		requestParams: params.requestParams,
		policyRequest: params.policyRequest,
		context: params.context,
		cwd: params.cwd
	});
	if (!payload) return;
	const resolveDeferredApproval = async () => {
		const approvalOutcome = await resolveNativeHookRelayDeferredToolApproval({
			relayId: nativeHookRelay.relayId,
			toolUseId: params.context.approvalId,
			signal: params.signal
		});
		params.assertActive();
		if (approvalOutcome?.outcome === "denied") return {
			handled: true,
			blocked: true,
			reason: approvalOutcome.reason,
			...approvalOutcome.failureDisposition ? { failureDisposition: approvalOutcome.failureDisposition } : {}
		};
		return approvalOutcome?.outcome === "approved-once" ? {
			handled: true,
			outcome: approvalOutcome.outcome
		} : { handled: true };
	};
	if (hasNativeHookRelayInvocation({
		relayId: nativeHookRelay.relayId,
		event: "pre_tool_use",
		toolUseId: params.context.approvalId
	})) return resolveDeferredApproval();
	try {
		const decision = readNativeRelayPreToolUseDecision(await invokeNativeHookRelay({
			provider: "codex",
			relayId: nativeHookRelay.relayId,
			generation: nativeHookRelay.generation,
			event: "pre_tool_use",
			rawPayload: payload,
			requireGeneration: true
		}));
		if (decision.blocked) return {
			handled: true,
			blocked: true,
			reason: decision.reason,
			...decision.failureDisposition ? { failureDisposition: decision.failureDisposition } : {}
		};
		return await resolveDeferredApproval();
	} catch (error) {
		if (params.autoApprove === true && !hasNativeHookRelayInvocation({
			relayId: nativeHookRelay.relayId,
			event: "pre_tool_use",
			toolUseId: params.context.approvalId
		})) return;
		return {
			handled: true,
			blocked: true,
			reason: `OpenClaw native hook relay unavailable for Codex app-server approval: ${formatCodexDisplayText(coerceErrorMessage(error))}`,
			failureDisposition: "failed"
		};
	}
}
function buildNativeRelayPreToolUsePayload(params) {
	const command = readStringField(params.policyRequest.params, "command");
	if (!command) return;
	const turnId = readStringField(params.requestParams, "turnId");
	return {
		hook_event_name: "PreToolUse",
		openclaw_approval_mode: "report",
		tool_name: "exec_command",
		...params.context.approvalId ? { tool_use_id: params.context.approvalId } : {},
		...params.cwd ? { cwd: params.cwd } : {},
		...turnId ? { turn_id: turnId } : {},
		tool_input: {
			...params.policyRequest.params,
			command,
			cmd: command
		}
	};
}
function readNativeRelayPreToolUseDecision(response) {
	if (!response || response.exitCode !== 0) return {
		blocked: true,
		reason: sanitizeRelayDecisionReason(response?.stderr) || sanitizeRelayDecisionReason(response?.stdout) || "OpenClaw native hook relay failed for Codex app-server approval.",
		failureDisposition: response?.failureDisposition ?? "failed"
	};
	const stdout = response.stdout?.trim();
	if (!stdout) return { blocked: false };
	const parsed = parseRelayJsonResponse(stdout);
	const output = isJsonObject(parsed?.hookSpecificOutput) ? parsed.hookSpecificOutput : void 0;
	if (output?.permissionDecision === "deny") return {
		blocked: true,
		reason: readStringField(output, "permissionDecisionReason") || "OpenClaw native hook policy denied Codex app-server approval.",
		...response.failureDisposition ? { failureDisposition: response.failureDisposition } : {}
	};
	return {
		blocked: true,
		reason: output ? "OpenClaw native hook relay returned a non-deny Codex app-server approval decision." : "OpenClaw native hook relay returned an unreadable Codex app-server approval result.",
		failureDisposition: "failed"
	};
}
function parseRelayJsonResponse(text) {
	try {
		const parsed = JSON.parse(text);
		return isJsonObject(parsed) ? parsed : void 0;
	} catch {
		return;
	}
}
function sanitizeRelayDecisionReason(value) {
	return sanitizeApprovalPreview(value ? {
		value,
		clipped: false
	} : void 0, 240).text;
}
function buildOpenClawToolPolicyRequest(method, requestParams) {
	if (method === "item/commandExecution/requestApproval") {
		if (readNetworkApprovalContext(requestParams)) return {
			toolName: "codex_network_approval",
			params: { approval: requestParams ?? {} }
		};
		const command = readPolicyCommand(requestParams);
		return {
			toolName: "exec",
			params: {
				...command ? { command } : {},
				...readStringField(requestParams, "cwd") ? { cwd: readStringField(requestParams, "cwd") } : {},
				approval: requestParams ?? {}
			}
		};
	}
	if (method === "item/fileChange/requestApproval") return {
		toolName: "apply_patch",
		params: requestParams ?? {}
	};
	if (method === "item/permissions/requestApproval") return {
		toolName: "codex_permission_approval",
		params: requestParams ?? {}
	};
}
function toolPolicyParamsWereRewritten(original, candidate) {
	if (candidate === original) return false;
	const originalText = stableJsonText(original);
	const candidateText = stableJsonText(candidate);
	return !candidateText || candidateText !== originalText;
}
function stableJsonText(value) {
	if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return JSON.stringify(value);
	if (Array.isArray(value)) {
		const items = value.map((item) => stableJsonText(item));
		return items.every((item) => item !== void 0) ? `[${items.join(",")}]` : void 0;
	}
	if (isJsonObject(value)) {
		const entries = Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, item]) => {
			const text = stableJsonText(item);
			return text === void 0 ? void 0 : `${JSON.stringify(key)}:${text}`;
		});
		return entries.every((entry) => entry !== void 0) ? `{${entries.join(",")}}` : void 0;
	}
}
function nativeApprovalAllowedDecisions(params) {
	if (params.method === "item/fileChange/requestApproval") return [
		"allow-once",
		"allow-always",
		"deny"
	];
	return params.method === "item/commandExecution/requestApproval" ? commandApprovalAllowedDecisions(params.requestParams, params.requiresOneShot) : void 0;
}
function fileChangeApprovalDecision(outcome) {
	if (outcome === "cancelled") return "cancel";
	if (outcome === "denied" || outcome === "unavailable") return "decline";
	return outcome === "approved-session" ? "acceptForSession" : "accept";
}
function requestedPermissions(requestParams) {
	const permissions = isJsonObject(requestParams?.permissions) ? requestParams.permissions : {};
	const granted = {};
	if (isJsonObject(permissions.network)) granted.network = permissions.network;
	if (isJsonObject(permissions.fileSystem)) granted.fileSystem = permissions.fileSystem;
	return granted;
}
function describeRequestedPermissions(requestParams) {
	return describePermissionProfile(requestedPermissions(requestParams), "Permissions");
}
function describeCommandApprovalDetails(requestParams) {
	const lines = [];
	const additionalPermissions = isJsonObject(requestParams?.additionalPermissions) ? requestParams.additionalPermissions : void 0;
	if (additionalPermissions) lines.push(...describePermissionProfile(additionalPermissions, "Additional permissions"));
	const execpolicySummary = summarizeStringArray(requestParams?.proposedExecpolicyAmendment, "Proposed exec policy", sanitizePermissionScalar);
	if (execpolicySummary) lines.push(execpolicySummary);
	const networkAmendmentSummary = summarizeNetworkPolicyAmendments(requestParams?.proposedNetworkPolicyAmendments);
	if (networkAmendmentSummary) lines.push(networkAmendmentSummary);
	return lines;
}
function describePermissionProfile(permissions, label) {
	const lines = [];
	const kinds = [];
	const risks = /* @__PURE__ */ new Set();
	if (isJsonObject(permissions.network)) kinds.push("network");
	if (isJsonObject(permissions.fileSystem)) kinds.push("fileSystem");
	if (kinds.length > 0) lines.push(`${label}: ${kinds.join(", ")}`);
	let networkSummary;
	if (isJsonObject(permissions.network)) {
		const summaries = [summarizeNetworkEnabledPermission(permissions.network, risks), summarizePermissionRecord(permissions.network, risks, [{
			key: "allowHosts",
			label: "allowHosts",
			sanitize: sanitizePermissionHostValue,
			risksFor: permissionHostRisks
		}])].filter((summary) => Boolean(summary));
		networkSummary = summaries.length > 0 ? summaries.join("; ") : void 0;
	}
	let fileSystemSummary;
	if (isJsonObject(permissions.fileSystem)) {
		const summaries = [summarizePermissionRecord(permissions.fileSystem, risks, [
			{
				key: "read",
				label: "read",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			},
			{
				key: "write",
				label: "write",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			},
			{
				key: "roots",
				label: "roots",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			},
			{
				key: "readPaths",
				label: "readPaths",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			},
			{
				key: "writePaths",
				label: "writePaths",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			}
		]), summarizeFileSystemEntries(permissions.fileSystem, risks)].filter((summary) => Boolean(summary));
		fileSystemSummary = summaries.length > 0 ? summaries.join("; ") : void 0;
	}
	if (risks.size > 0) lines.push(`High-risk targets: ${[...risks].join(", ")}`);
	if (networkSummary) lines.push(`Network ${networkSummary}`);
	if (fileSystemSummary) lines.push(`File system ${fileSystemSummary}`);
	return lines;
}
function summarizeNetworkEnabledPermission(permission, risks) {
	const enabled = permission.enabled;
	if (typeof enabled !== "boolean") return;
	if (enabled) risks.add("network access");
	return `enabled: ${enabled}`;
}
function summarizeFileSystemEntries(permission, risks) {
	const entries = permission.entries;
	if (!Array.isArray(entries)) return;
	const samples = [];
	let count = 0;
	for (const entry of entries) {
		const item = isJsonObject(entry) ? entry : void 0;
		const path = typeof item?.path === "string" ? item.path.trim() : "";
		const access = typeof item?.access === "string" ? item.access.trim() : "";
		if (!path || !access) continue;
		count += 1;
		if (access !== "none") for (const risk of permissionPathRisks(path)) risks.add(risk);
		if (samples.length < PERMISSION_SAMPLE_LIMIT) samples.push(`${sanitizePermissionScalar(access)} ${sanitizePermissionPathValue(path)}`);
	}
	if (count === 0) return;
	const remaining = count - samples.length;
	const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
	return `entries: ${samples.join(", ")}${remainderSuffix}`;
}
function summarizePermissionRecord(permission, risks, descriptors) {
	return descriptors.map((descriptor) => summarizePermissionArray(permission, descriptor, risks)).filter(Boolean).join("; ") || void 0;
}
function summarizePermissionArray(record, descriptor, risks) {
	const values = normalizeTrimmedStringList(record[descriptor.key]);
	if (values.length === 0) return;
	for (const value of values) for (const risk of descriptor.risksFor(value)) risks.add(risk);
	const sampleValues = values.slice(0, PERMISSION_SAMPLE_LIMIT).map(descriptor.sanitize).filter(Boolean);
	if (sampleValues.length === 0) return `${descriptor.label}: ${values.length}`;
	const remaining = values.length - sampleValues.length;
	const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
	return `${descriptor.label}: ${sampleValues.join(", ")}${remainderSuffix}`;
}
function summarizeStringArray(value, label, sanitize) {
	if (!Array.isArray(value)) return;
	const values = value.filter((entry) => typeof entry === "string").map((entry) => sanitize(entry)).filter(Boolean);
	if (values.length === 0) return;
	const samples = values.slice(0, PERMISSION_SAMPLE_LIMIT);
	const remaining = values.length - samples.length;
	const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
	return `${label}: ${samples.join(", ")}${remainderSuffix}`;
}
function summarizeNetworkPolicyAmendments(value) {
	if (!Array.isArray(value)) return;
	const samples = [];
	let count = 0;
	for (const entry of value) {
		const amendment = isJsonObject(entry) ? entry : void 0;
		const host = typeof amendment?.host === "string" ? amendment.host : "";
		const action = typeof amendment?.action === "string" ? amendment.action : "";
		if (!host || !action) continue;
		count += 1;
		if (samples.length < PERMISSION_SAMPLE_LIMIT) samples.push(`${sanitizePermissionScalar(action)} ${sanitizePermissionHostValue(host)}`);
	}
	if (count === 0) return;
	const remaining = count - samples.length;
	const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
	return `Proposed network policy: ${samples.join(", ")}${remainderSuffix}`;
}
function sanitizePermissionHostValue(value) {
	const withoutScheme = sanitizePermissionScalar(value).toLowerCase().replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
	const authority = withoutScheme.split(/[/?#]/, 1)[0] ?? withoutScheme;
	const withoutUserInfo = authority.includes("@") ? authority.slice(authority.lastIndexOf("@") + 1) : authority;
	return truncateCodexApprovalDisplayText(withoutUserInfo, PERMISSION_VALUE_MAX_LENGTH);
}
function sanitizePermissionPathValue(value) {
	return truncateCodexApprovalDisplayText(formatApprovalDisplayPath(sanitizePermissionScalar(value)), PERMISSION_VALUE_MAX_LENGTH);
}
function sanitizePermissionScalar(value) {
	return sanitizeCodexApprovalVisibleText(value);
}
function permissionHostRisks(value) {
	const normalized = value.trim().toLowerCase();
	const risks = [];
	if (normalized.includes("*")) {
		risks.push("wildcard hosts");
		if (isPrivateNetworkHostPattern(normalized)) risks.push("private-network wildcards");
	}
	return risks;
}
function permissionPathRisks(value) {
	const normalized = sanitizePermissionScalar(value);
	const risks = [];
	if (normalized === "/" || normalized === "\\" || /^[A-Za-z]:[\\/]*$/.test(normalized)) risks.push("filesystem root");
	return risks;
}
function isPrivateNetworkHostPattern(value) {
	const wildcardStripped = value.toLowerCase().replace(/^\*\./, "");
	if (wildcardStripped === "localhost" || wildcardStripped === "local" || wildcardStripped === "internal" || wildcardStripped === "lan" || wildcardStripped === "home" || wildcardStripped === "corp" || wildcardStripped === "private" || wildcardStripped.endsWith(".local") || wildcardStripped.endsWith(".internal") || wildcardStripped.endsWith(".lan") || wildcardStripped.endsWith(".home") || wildcardStripped.endsWith(".corp") || wildcardStripped.endsWith(".private")) return true;
	if (wildcardStripped.startsWith("10.") || wildcardStripped.startsWith("127.") || wildcardStripped.startsWith("192.168.") || wildcardStripped.startsWith("169.254.")) return true;
	return /^172\.(1[6-9]|2\d|3[0-1])\./.test(wildcardStripped);
}
function approvalResolutionMessage(outcome) {
	return {
		"approved-session": "Codex app-server approval granted for the session.",
		"approved-once": "Codex app-server approval granted for this turn.",
		cancelled: "Codex app-server approval cancelled.",
		unavailable: "Codex app-server approval unavailable.",
		denied: "Codex app-server approval denied."
	}[outcome];
}
function approvalEventScope(method, outcome) {
	return method === "item/permissions/requestApproval" ? { scope: outcome === "approved-session" ? "session" : "turn" } : {};
}
function emitApprovalEvent(params, data) {
	params.onAgentEvent?.({
		stream: "approval",
		data: { ...data }
	});
}
function readDisplayCommandPreview(record) {
	const actionCommand = readCommandActionsPreview(record);
	if (actionCommand) return actionCommand;
	return readCommandPreview(record);
}
function readPolicyCommand(record) {
	const command = record?.command;
	if (typeof command === "string") return command;
	if (Array.isArray(command) && command.every((part) => typeof part === "string")) return command.join(" ");
	const actionCommands = readCommandActions(record);
	if (actionCommands.length > 0) return actionCommands.join(" && ");
}
function readNetworkApprovalContext(record) {
	const context = isJsonObject(record?.networkApprovalContext) ? record.networkApprovalContext : void 0;
	const host = readStringField(context, "host");
	const protocol = readStringField(context, "protocol");
	return host && protocol ? {
		host,
		protocol
	} : void 0;
}
function readCommandActions(record) {
	const actions = record?.commandActions;
	if (!Array.isArray(actions)) return [];
	return actions.map((action) => isJsonObject(action) ? readStringField(action, "command") : void 0).filter((command) => Boolean(command));
}
function readCommandActionsPreview(record) {
	let source;
	for (const command of readCommandActions(record)) {
		source = appendPreviewPart(source, command, " && ");
		if (source.clipped) break;
	}
	return source;
}
function readCommandPreview(record) {
	const command = record?.command;
	if (typeof command === "string") return previewSource(command);
	if (!Array.isArray(command)) return;
	let source;
	for (const part of command) {
		if (typeof part !== "string") return;
		source = appendPreviewPart(source, part, " ");
		if (source.clipped) break;
	}
	return source;
}
function readStringPreview(record, key) {
	const value = readStringField(record, key);
	return value === void 0 ? void 0 : previewSource(value);
}
function previewSource(value) {
	return {
		value: sliceUtf16Safe(value, 0, APPROVAL_PREVIEW_SCAN_MAX_LENGTH),
		clipped: value.length > APPROVAL_PREVIEW_SCAN_MAX_LENGTH
	};
}
function appendPreviewPart(source, part, separator) {
	const value = `${source?.value ? `${source.value}${separator}` : ""}${part}`;
	const clipped = source?.clipped === true || value.length > APPROVAL_PREVIEW_SCAN_MAX_LENGTH;
	return {
		value: sliceUtf16Safe(value, 0, APPROVAL_PREVIEW_SCAN_MAX_LENGTH),
		clipped
	};
}
function sanitizeApprovalPreview(source, maxLength) {
	if (!source || !source.value) return { omitted: false };
	const rawPreview = stripDanglingCodexApprovalTerminalSequence(source.value);
	const sanitized = sanitizeCodexApprovalVisibleText(rawPreview);
	if (!sanitized) return { omitted: true };
	return {
		text: formatCodexDisplayText(truncateCodexApprovalDisplayText(sanitized, maxLength)),
		omitted: source.clipped
	};
}
function formatApprovalPreviewSubject(text, omitted) {
	return omitted ? `${text} ${APPROVAL_PREVIEW_OMITTED}` : text;
}
function joinDescriptionLinesWithinLimit(lines, maxLength) {
	let description = "";
	for (const line of lines) {
		const prefix = description ? "\n" : "";
		const next = `${description}${prefix}${line}`;
		if (next.length <= maxLength) {
			description = next;
			continue;
		}
		const remaining = maxLength - description.length - prefix.length;
		if (remaining < 3) break;
		description += `${prefix}${truncateCodexApprovalDisplayText(line, remaining)}`;
		break;
	}
	return description;
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-diagnostics.ts
/**
* Trusted diagnostics emitted around Codex dynamic tool execution lifecycle.
*/
/** Emits a start event for one Codex dynamic tool call. */
function emitDynamicToolStartedDiagnostic(params) {
	emitTrustedDiagnosticEvent({
		type: "tool.execution.started",
		agentId: params.agentId,
		runId: params.runId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		toolName: params.call.tool,
		toolCallId: params.call.callId
	});
}
/** Emits an error event for one Codex dynamic tool call. */
function emitDynamicToolErrorDiagnostic(params) {
	emitTrustedDiagnosticEvent({
		type: "tool.execution.error",
		agentId: params.agentId,
		runId: params.runId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		toolName: params.call.tool,
		toolCallId: params.call.callId,
		durationMs: params.durationMs,
		errorCategory: "codex_dynamic_tool_error",
		terminalReason: params.terminalReason ?? "failed"
	});
}
/** Emits the terminal event matching a dynamic tool response's diagnostic type. */
function emitDynamicToolTerminalDiagnostic(params) {
	const terminalType = params.response.diagnosticTerminalType ?? (params.response.success ? "completed" : "error");
	if (terminalType === "completed") {
		emitTrustedDiagnosticEvent({
			type: "tool.execution.completed",
			agentId: params.agentId,
			runId: params.runId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			toolName: params.call.tool,
			toolCallId: params.call.callId,
			durationMs: params.durationMs
		});
		return;
	}
	if (terminalType === "blocked") {
		emitTrustedDiagnosticEvent({
			type: "tool.execution.blocked",
			agentId: params.agentId,
			runId: params.runId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			toolName: params.call.tool,
			toolCallId: params.call.callId,
			deniedReason: "plugin-before-tool-call",
			reason: "Tool call blocked"
		});
		return;
	}
	emitDynamicToolErrorDiagnostic({
		...params,
		terminalReason: params.response.diagnosticTerminalReason ?? "failed"
	});
}
//#endregion
//#region extensions/codex/src/app-server/elicitation-bridge.ts
const MCP_TOOL_APPROVAL_KIND = "mcp_tool_call";
const MCP_TOOL_APPROVAL_KIND_KEY = "codex_approval_kind";
const MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY = "connector_name";
const MCP_TOOL_APPROVAL_TOOL_TITLE_KEY = "tool_title";
const MCP_TOOL_APPROVAL_TOOL_DESCRIPTION_KEY = "tool_description";
const MCP_TOOL_APPROVAL_TOOL_PARAMS_DISPLAY_KEY = "tool_params_display";
const MCP_TOOL_APPROVAL_SOURCE_KEY = "source";
const MCP_TOOL_APPROVAL_CONNECTOR_SOURCE = "connector";
const CODEX_APPS_SERVER_NAME = "codex_apps";
const COMPUTER_USE_APPROVAL_TITLE = "Computer Use approval";
const EMPTY_OBJECT_SCHEMA = {
	type: "object",
	properties: {}
};
const PLUGIN_APP_ID_META_KEYS = [
	"app_id",
	"appId",
	"codex_app_id",
	"codexAppId"
];
const PLUGIN_CONNECTOR_ID_META_KEYS = ["connector_id", "connectorId"];
const PLUGIN_NAME_META_KEYS = [
	"plugin_name",
	"pluginName",
	"codex_plugin_name",
	"codexPluginName"
];
const PLUGIN_CONFIG_KEY_META_KEYS = [
	"config_key",
	"configKey",
	"codex_config_key"
];
const PLUGIN_MARKETPLACE_NAME_META_KEYS = [
	"marketplace_name",
	"marketplaceName",
	"codex_marketplace_name",
	"codexMarketplaceName"
];
const MAX_DISPLAY_PARAM_ENTRIES = 8;
const MAX_DISPLAY_PARAM_VALUE_LENGTH = 120;
const MAX_DISPLAY_VALUE_ARRAY_ITEMS = 8;
const MAX_DISPLAY_VALUE_OBJECT_KEYS = 8;
const MAX_DISPLAY_VALUE_DEPTH = 3;
const DISPLAY_TEXT_SCAN_MAX_LENGTH = 4096;
async function routeCodexAppServerElicitationRequest(params) {
	const requestParams = isJsonObject(params.requestParams) ? params.requestParams : void 0;
	if (!requestParams || readNonBlankStringField(requestParams, "threadId") !== params.threadId) return { kind: "not-mine" };
	const requestTurnId = requestParams.turnId;
	if (requestTurnId !== null && requestTurnId !== void 0 && requestTurnId !== params.turnId) return { kind: "not-mine" };
	if (!((isJsonObject(requestParams["_meta"]) ? requestParams["_meta"] : void 0)?.[MCP_TOOL_APPROVAL_KIND_KEY] === MCP_TOOL_APPROVAL_KIND || params.computerUseMcpServerName !== void 0 && readNonBlankStringField(requestParams, "serverName") === params.computerUseMcpServerName)) return { kind: "not-mine" };
	if (params.signal?.aborted) return handled(createCodexElicitationResponse("cancel"));
	const pluginResolution = resolvePluginElicitation({
		requestParams,
		pluginAppPolicyContext: params.pluginAppPolicyContext
	});
	if (pluginResolution.kind !== "not_plugin") {
		if (params.paramsForRun.trigger === "cron" && params.paramsForRun.scheduledRuntimeAuthority) {
			logPluginElicitationDecline("scheduled_authority_non_interactive", requestParams);
			return handled(createCodexElicitationResponse("decline"));
		}
		if (pluginResolution.kind === "decline") {
			logPluginElicitationDecline(pluginResolution.reason, requestParams);
			return handled(createCodexElicitationResponse("decline"));
		}
		if (requestTurnId !== params.turnId) {
			logPluginElicitationDecline("missing_active_turn", requestParams);
			return handled(createCodexElicitationResponse("decline"));
		}
		return handled(await buildPluginPolicyElicitationResponse({
			entry: pluginResolution.entry,
			requestParams,
			paramsForRun: params.paramsForRun,
			signal: params.signal
		}));
	}
	const computerUsePrompt = readComputerUseApprovalElicitation(requestParams, params.computerUseMcpServerName);
	const approvalPrompt = computerUsePrompt ?? readBridgeableApprovalElicitation(requestParams);
	if (!approvalPrompt) return handled(createCodexElicitationResponse("decline"));
	let persistence;
	if (!computerUsePrompt) {
		const serverName = readNonBlankStringField(requestParams, "serverName");
		const server = serverName ? params.paramsForRun.config?.mcp?.servers?.[serverName] : void 0;
		const mode = serverName ? resolveProjectedMcpCodexToolApprovalMode(serverName, server ?? {}, params.projectedMcpServers?.[serverName]) : void 0;
		if (!requiresMcpCodexToolApproval({
			mode,
			fullPermission: params.autoApproveMcpTools
		})) {
			params.paramsForRun.hostCapabilities.assertActive();
			return handled(buildElicitationResponse(approvalPrompt, "approved-once"));
		}
		if (mode === "prompt") approvalPrompt.allowedDecisions = ["allow-once", "deny"];
		else if (serverName && serverName !== CODEX_APPS_SERVER_NAME && Object.hasOwn(params.paramsForRun.config?.mcp?.servers ?? {}, serverName) && requestTurnId === params.turnId && readPersistHints(approvalPrompt.meta, "explicit").includes("always")) {
			const resolveItem = () => {
				const item = params.getActiveMcpToolCall?.(serverName);
				return item?.server === serverName && matchesMcpApprovalDisplay(item, approvalPrompt.meta) ? item : void 0;
			};
			const item = resolveItem();
			if (item) persistence = {
				mcpTool: {
					server: serverName,
					tool: item.tool
				},
				toolCallId: item.id,
				isMcpToolApprovalActive: () => {
					const current = resolveItem();
					return current?.id === item.id && current.tool === item.tool;
				}
			};
		}
	}
	return handled(buildElicitationResponse(approvalPrompt, await requestPluginApprovalOutcome({
		hostCapabilities: params.paramsForRun.hostCapabilities,
		title: approvalPrompt.title,
		description: approvalPrompt.description,
		allowedDecisions: approvalPrompt.allowedDecisions,
		toolName: "codex_mcp_tool_approval",
		...persistence,
		signal: params.signal
	})));
}
function matchesMcpApprovalDisplay(item, meta) {
	if (!Object.hasOwn(meta, MCP_TOOL_APPROVAL_TOOL_PARAMS_DISPLAY_KEY)) return true;
	const display = meta[MCP_TOOL_APPROVAL_TOOL_PARAMS_DISPLAY_KEY];
	if (!Array.isArray(display)) return false;
	const args = item.arguments;
	return display.every((param) => {
		if (!isJsonObject(param) || typeof param.name !== "string" || !isJsonObject(args)) return false;
		if (!Object.hasOwn(args, param.name)) return false;
		const value = args[param.name];
		return typeof param.value !== "string" || param.value === (typeof value === "string" ? value : JSON.stringify(value));
	});
}
function handled(response) {
	return {
		kind: "handled",
		response
	};
}
function resolvePluginElicitation(params) {
	const requestParams = params.requestParams;
	const meta = isJsonObject(requestParams["_meta"]) ? requestParams["_meta"] : {};
	const context = params.pluginAppPolicyContext;
	const entries = context ? Object.values(context.apps) : [];
	const pluginEntries = entries.filter(isPluginAppPolicyContextEntry);
	const appId = readFirstString$1(meta, PLUGIN_APP_ID_META_KEYS) ?? readFirstString$1(requestParams, PLUGIN_APP_ID_META_KEYS);
	const connectorId = readFirstString$1(meta, PLUGIN_CONNECTOR_ID_META_KEYS);
	const isCodexConnectorApproval = isCodexConnectorApprovalElicitation(requestParams, meta);
	if (isCodexConnectorApproval && appId && connectorId && codexAppIdentityKey(appId) !== codexAppIdentityKey(connectorId)) return {
		kind: "decline",
		reason: "app_id_connector_id_mismatch"
	};
	if (appId) {
		if (!context) return {
			kind: "decline",
			reason: "missing_policy_context"
		};
		const matches = Object.entries(context.apps).filter(([id]) => codexAppIdentityKey(id) === codexAppIdentityKey(appId)).map(([, entry]) => entry);
		if (matches.some((entry) => entry.source === "account") && !isCodexConnectorApproval) return {
			kind: "decline",
			reason: "account_app_source_mismatch"
		};
		return uniquePluginMatch(matches, "app_id");
	}
	if (isCodexConnectorApproval && connectorId) {
		if (!context) return {
			kind: "decline",
			reason: "missing_policy_context"
		};
		return uniquePluginMatch(Object.entries(context.apps).filter(([id]) => codexAppIdentityKey(id) === codexAppIdentityKey(connectorId)).map(([, entry]) => entry), "connector_id");
	}
	const serverName = readNonBlankStringField(requestParams, "serverName");
	if (serverName && context) {
		const matches = entries.filter((entry) => entry.mcpServerNames.includes(serverName));
		if (matches.length > 0) return uniquePluginMatch(matches, "server_name");
	}
	const metadataResolution = resolvePluginStableMetadataMatch({
		meta,
		requestParams,
		entries: pluginEntries,
		context
	});
	if (metadataResolution.kind !== "not_plugin") return metadataResolution;
	if (context && hasDisplayNameOnlyPluginMatch(meta, entries)) return {
		kind: "decline",
		reason: "display_name_only"
	};
	return { kind: "not_plugin" };
}
function isCodexConnectorApprovalElicitation(requestParams, meta) {
	return readNonBlankStringField(requestParams, "serverName") === CODEX_APPS_SERVER_NAME && readNonBlankStringField(meta, MCP_TOOL_APPROVAL_KIND_KEY) === MCP_TOOL_APPROVAL_KIND && readNonBlankStringField(meta, MCP_TOOL_APPROVAL_SOURCE_KEY) === MCP_TOOL_APPROVAL_CONNECTOR_SOURCE;
}
function resolvePluginStableMetadataMatch(params) {
	const pluginName = readFirstString$1(params.meta, PLUGIN_NAME_META_KEYS) ?? readFirstString$1(params.requestParams, PLUGIN_NAME_META_KEYS);
	const configKey = readFirstString$1(params.meta, PLUGIN_CONFIG_KEY_META_KEYS) ?? readFirstString$1(params.requestParams, PLUGIN_CONFIG_KEY_META_KEYS);
	const marketplaceName = readFirstString$1(params.meta, PLUGIN_MARKETPLACE_NAME_META_KEYS) ?? readFirstString$1(params.requestParams, PLUGIN_MARKETPLACE_NAME_META_KEYS);
	if (!pluginName && !configKey) return { kind: "not_plugin" };
	if (!params.context) return {
		kind: "decline",
		reason: "missing_policy_context"
	};
	return uniquePluginMatch(params.entries.filter((entry) => {
		if (marketplaceName && entry.marketplaceName !== marketplaceName) return false;
		if (pluginName && entry.pluginName !== pluginName) return false;
		if (configKey && entry.configKey !== configKey) return false;
		return true;
	}), "metadata");
}
function uniquePluginMatch(matches, source) {
	if (matches.length === 1 && matches[0]) return {
		kind: "matched",
		entry: matches[0]
	};
	return {
		kind: "decline",
		reason: matches.length === 0 ? `${source}_not_enabled` : `${source}_ambiguous`
	};
}
function hasDisplayNameOnlyPluginMatch(meta, entries) {
	const connectorName = readNonBlankStringField(meta, MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY);
	if (!connectorName) return false;
	const normalized = normalizePluginIdentityText(connectorName);
	return entries.some((entry) => normalizePluginIdentityText(appPolicyDisplayName(entry)) === normalized || isPluginAppPolicyContextEntry(entry) && normalizePluginIdentityText(entry.configKey) === normalized);
}
function isPluginAppPolicyContextEntry(entry) {
	return entry.source !== "account";
}
function appPolicyDisplayName(entry) {
	return isPluginAppPolicyContextEntry(entry) ? entry.pluginName : entry.appName;
}
function normalizePluginIdentityText(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
async function buildPluginPolicyElicitationResponse(params) {
	const mode = resolvePluginDestructiveApprovalMode(params.entry);
	if (mode === "deny") {
		logPluginElicitationDecline("destructive_actions_disabled", params.requestParams);
		return createCodexElicitationResponse("decline");
	}
	const approvalPrompt = readPluginApprovalElicitation(params.entry, params.requestParams);
	if (!approvalPrompt) {
		logPluginElicitationDecline("unsupported_schema", params.requestParams);
		return createCodexElicitationResponse("decline");
	}
	const response = buildElicitationResponse(approvalPrompt, "approved-once");
	if (response.action === "accept") {
		if (mode === "allow") return response;
		return buildElicitationResponse(approvalPrompt, await requestPluginApprovalOutcome({
			hostCapabilities: params.paramsForRun.hostCapabilities,
			title: approvalPrompt.title,
			description: approvalPrompt.description,
			allowedDecisions: allowedPluginPolicyApprovalDecisions(mode, approvalPrompt),
			toolName: "codex_mcp_tool_approval",
			signal: params.signal
		}));
	}
	logPluginElicitationDecline("unmappable_schema", params.requestParams);
	return createCodexElicitationResponse("decline");
}
function resolvePluginDestructiveApprovalMode(entry) {
	return entry.destructiveApprovalMode ?? (entry.allowDestructiveActions ? "allow" : "deny");
}
function allowedPluginPolicyApprovalDecisions(mode, approvalPrompt) {
	const allowedDecisions = approvalPrompt.allowedDecisions ?? ["allow-once", "deny"];
	if (mode !== "ask") return allowedDecisions;
	return allowedDecisions.filter((decision) => decision !== "allow-always");
}
function readPluginApprovalElicitation(entry, requestParams) {
	if (readNonBlankStringField(requestParams, "mode") !== "form" || !isJsonObject(requestParams.requestedSchema)) return;
	const requestedSchema = requestParams.requestedSchema;
	if (readNonBlankStringField(requestedSchema, "type") !== "object" || !isJsonObject(requestedSchema.properties)) return;
	const meta = isJsonObject(requestParams["_meta"]) ? requestParams["_meta"] : {};
	const title = sanitizeDisplayText(readNonBlankStringField(requestParams, "message") ?? "") || "Codex plugin approval";
	const descriptionMeta = { ...meta };
	if (!readNonBlankStringField(descriptionMeta, MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY)) descriptionMeta[MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY] = appPolicyDisplayName(entry);
	return {
		title,
		description: buildApprovalDescription({
			title,
			meta: descriptionMeta,
			requestedSchema,
			serverName: sanitizeOptionalDisplayText(readNonBlankStringField(requestParams, "serverName"))
		}),
		requestedSchema,
		meta,
		persistHintsMode: "explicit",
		allowedDecisions: buildApprovalAllowedDecisions(requestedSchema, meta)
	};
}
function buildApprovalAllowedDecisions(requestedSchema, meta, allowSession = false) {
	return canMapPersistentApproval(requestedSchema, meta, allowSession) ? [
		"allow-once",
		"allow-always",
		"deny"
	] : ["allow-once", "deny"];
}
function canMapPersistentApproval(requestedSchema, meta, allowSession) {
	const persistHints = readPersistHints(meta, "explicit");
	if (allowSession) return choosePersistHint(persistHints) !== void 0;
	if (persistHints.length > 0) return persistHints.includes("always");
	const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : {};
	return Object.entries(properties).some(([name, value]) => {
		const schema = isJsonObject(value) ? value : void 0;
		if (!schema) return false;
		return isPersistField({
			name,
			schema,
			required: false
		}) && chooseAlwaysPersistOptionValue(readEnumOptions(schema)) !== void 0;
	});
}
function logPluginElicitationDecline(reason, requestParams) {
	embeddedAgentLog.debug("codex plugin elicitation declined", {
		reason,
		serverName: readNonBlankStringField(requestParams, "serverName"),
		mode: readNonBlankStringField(requestParams, "mode")
	});
}
function readBridgeableApprovalElicitation(requestParams) {
	if (!requestParams || readNonBlankStringField(requestParams, "mode") !== "form" || !isJsonObject(requestParams["_meta"]) || requestParams["_meta"][MCP_TOOL_APPROVAL_KIND_KEY] !== MCP_TOOL_APPROVAL_KIND || !isJsonObject(requestParams.requestedSchema)) return;
	const requestedSchema = requestParams.requestedSchema;
	if (readNonBlankStringField(requestedSchema, "type") !== "object" || !isJsonObject(requestedSchema.properties)) return;
	const title = sanitizeDisplayText(readNonBlankStringField(requestParams, "message") ?? "") || "Codex MCP tool approval";
	const serverName = readNonBlankStringField(requestParams, "serverName");
	return {
		title,
		description: buildApprovalDescription({
			title,
			meta: requestParams["_meta"],
			requestedSchema,
			serverName: sanitizeOptionalDisplayText(serverName),
			remedy: serverName ? formatMcpCodexApprovalRemedy(serverName) : void 0
		}),
		requestedSchema,
		meta: requestParams["_meta"],
		persistHintsMode: "explicit",
		allowedDecisions: buildApprovalAllowedDecisions(requestedSchema, requestParams["_meta"], true)
	};
}
function readComputerUseApprovalElicitation(requestParams, expectedServerName) {
	const serverName = readNonBlankStringField(requestParams, "serverName");
	if (!serverName || !expectedServerName || serverName !== expectedServerName || readNonBlankStringField(requestParams, "mode") !== "form") return;
	const requestedSchema = isJsonObject(requestParams?.requestedSchema) ? requestParams.requestedSchema : EMPTY_OBJECT_SCHEMA;
	if (readNonBlankStringField(requestedSchema, "type") !== "object" || !isJsonObject(requestedSchema.properties)) return;
	const meta = isJsonObject(requestParams?.["_meta"]) ? requestParams["_meta"] : {};
	const title = sanitizeDisplayText(readNonBlankStringField(requestParams, "message") ?? "") || COMPUTER_USE_APPROVAL_TITLE;
	return {
		title,
		description: buildApprovalDescription({
			title,
			meta,
			requestedSchema,
			serverName: sanitizeOptionalDisplayText(serverName)
		}),
		requestedSchema,
		meta
	};
}
function buildApprovalDescription(params) {
	const connectorName = sanitizeOptionalDisplayText(readNonBlankStringField(params.meta, MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY));
	const toolTitle = sanitizeOptionalDisplayText(readNonBlankStringField(params.meta, MCP_TOOL_APPROVAL_TOOL_TITLE_KEY));
	const toolDescription = sanitizeOptionalDisplayText(readNonBlankStringField(params.meta, MCP_TOOL_APPROVAL_TOOL_DESCRIPTION_KEY));
	const summaryLines = [
		connectorName && `App: ${connectorName}`,
		toolTitle && `Tool: ${toolTitle}`,
		params.serverName && `MCP server: ${params.serverName}`,
		params.remedy,
		toolDescription
	].filter((line) => Boolean(line));
	const paramLines = readDisplayParamLines(params.meta);
	const propertyLines = readPropertyDescriptionLines(params.requestedSchema);
	return [
		params.title,
		summaryLines.join("\n"),
		paramLines.length > 0 ? ["Parameters:", ...paramLines].join("\n") : "",
		propertyLines.length > 0 ? ["Fields:", ...propertyLines].join("\n") : ""
	].filter(Boolean).join("\n\n");
}
function readPropertyDescriptionLines(requestedSchema) {
	const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : {};
	return Object.entries(properties).map(([name, value]) => {
		const schema = isJsonObject(value) ? value : void 0;
		if (!schema) return;
		const propTitle = sanitizeDisplayText(readNonBlankStringField(schema, "title") ?? "") || sanitizeDisplayText(name) || "field";
		const description = sanitizeOptionalDisplayText(readNonBlankStringField(schema, "description"));
		return description ? `- ${propTitle}: ${description}` : `- ${propTitle}`;
	}).filter((line) => Boolean(line));
}
function readDisplayParamLines(meta) {
	const displayParams = meta[MCP_TOOL_APPROVAL_TOOL_PARAMS_DISPLAY_KEY];
	if (!Array.isArray(displayParams)) return [];
	const lines = displayParams.slice(0, MAX_DISPLAY_PARAM_ENTRIES).map((entry) => {
		const param = isJsonObject(entry) ? entry : void 0;
		if (!param) return;
		const name = sanitizeOptionalDisplayText(readNonBlankStringField(param, "display_name")) ?? sanitizeOptionalDisplayText(readNonBlankStringField(param, "name"));
		if (!name) return;
		return `- ${name}: ${formatDisplayParamValue(param.value)}`;
	}).filter((line) => Boolean(line));
	const remaining = displayParams.length - MAX_DISPLAY_PARAM_ENTRIES;
	return remaining > 0 ? [...lines, `- Additional parameters: ${remaining} more`] : lines;
}
function formatDisplayParamValue(value) {
	const formatted = typeof value === "string" ? value : formatDisplayJsonValue(value ?? null);
	return truncateCodexApprovalDisplayText(sanitizeDisplayText(formatted), MAX_DISPLAY_PARAM_VALUE_LENGTH);
}
function formatDisplayJsonValue(value, depth = MAX_DISPLAY_VALUE_DEPTH) {
	if (value === null) return "null";
	if (typeof value === "string") return JSON.stringify(truncateCodexApprovalDisplayText(sanitizeDisplayText(value), 80));
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	if (Array.isArray(value)) {
		if (depth <= 0) return "[truncated]";
		const parts = [];
		const limit = Math.min(value.length, MAX_DISPLAY_VALUE_ARRAY_ITEMS);
		for (let i = 0; i < limit; i += 1) parts.push(formatDisplayJsonValue(value[i] ?? null, depth - 1));
		if (value.length > MAX_DISPLAY_VALUE_ARRAY_ITEMS) parts.push("...");
		return `[${parts.join(",")}]`;
	}
	if (typeof value === "object") {
		if (depth <= 0) return "{truncated}";
		const parts = [];
		let count = 0;
		let truncated = false;
		for (const key in value) {
			if (!Object.hasOwn(value, key)) continue;
			if (count >= MAX_DISPLAY_VALUE_OBJECT_KEYS) {
				truncated = true;
				break;
			}
			const safeKey = truncateCodexApprovalDisplayText(sanitizeDisplayText(key), 80);
			parts.push(`${JSON.stringify(safeKey)}:${formatDisplayJsonValue(value[key] ?? null, depth - 1)}`);
			count += 1;
		}
		if (truncated) parts.push("...");
		return `{${parts.join(",")}}`;
	}
	return "null";
}
function sanitizeOptionalDisplayText(value) {
	return (value === void 0 ? "" : sanitizeDisplayText(value)) || void 0;
}
function sanitizeDisplayText(value) {
	const scanned = sliceUtf16Safe(value, 0, DISPLAY_TEXT_SCAN_MAX_LENGTH);
	const clipped = value.length > DISPLAY_TEXT_SCAN_MAX_LENGTH;
	const sanitized = sanitizeCodexApprovalVisibleText(scanned, { stripDanglingTerminalSequence: true });
	const escaped = sanitized ? formatCodexDisplayText(sanitized) : "";
	return clipped && escaped ? `${escaped}...` : escaped;
}
function buildElicitationResponse(approvalPrompt, outcome) {
	const { requestedSchema, meta } = approvalPrompt;
	if (outcome === "cancelled") return createCodexElicitationResponse("cancel");
	if (outcome === "timed-out" || outcome === "denied" || outcome === "unavailable") return createCodexElicitationResponse("decline");
	const content = buildAcceptedContent(approvalPrompt, outcome);
	if (!content && !hasNoSchemaProperties(requestedSchema)) {
		embeddedAgentLog.warn("codex MCP approval elicitation approved without a mappable response", {
			approvalKind: meta[MCP_TOOL_APPROVAL_KIND_KEY],
			fields: Object.keys(requestedSchema.properties ?? {}),
			outcome
		});
		return createCodexElicitationResponse("decline");
	}
	return createCodexElicitationResponse("accept", content ?? null, buildAcceptedMeta(meta, outcome, approvalPrompt.persistHintsMode ?? "legacy"));
}
function buildAcceptedContent(approvalPrompt, outcome) {
	const { requestedSchema, meta } = approvalPrompt;
	const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : void 0;
	if (!properties) return;
	const required = Array.isArray(requestedSchema.required) ? new Set(requestedSchema.required.filter((entry) => typeof entry === "string")) : /* @__PURE__ */ new Set();
	const content = {};
	let sawApprovalField = false;
	for (const [name, value] of Object.entries(properties)) {
		const schema = isJsonObject(value) ? value : void 0;
		if (!schema) continue;
		const property = {
			name,
			schema,
			required: required.has(name)
		};
		const next = readApprovalFieldValue(property, outcome, choosePersistHint(readPersistHints(meta, approvalPrompt.persistHintsMode))) ?? readPersistFieldValue(property, meta, outcome, approvalPrompt.persistHintsMode ?? "legacy") ?? readFallbackFieldValue(property, outcome);
		if (next === void 0) {
			if (isApprovalField(property)) sawApprovalField = true;
			if (property.required) return;
			continue;
		}
		if (isApprovalField(property)) sawApprovalField = true;
		content[name] = next;
	}
	return sawApprovalField ? content : void 0;
}
function readApprovalFieldValue(property, outcome, persist) {
	if (!isApprovalField(property)) return;
	if (readNonBlankStringField(property.schema, "type") === "boolean") return true;
	const options = readEnumOptions(property.schema);
	if (options.length === 0) return;
	const acceptChoice = options.find((option) => isPositiveApprovalOption(option));
	if (outcome === "approved-session") return options.find((option) => isPersistentApprovalOption(option, persist))?.value ?? acceptChoice?.value;
	return acceptChoice?.value;
}
function readPersistFieldValue(property, meta, outcome, persistHintsMode) {
	if (!isPersistField(property) || outcome !== "approved-session") return;
	const persistHints = readPersistHints(meta, persistHintsMode);
	const options = readEnumOptions(property.schema);
	if (options.length === 0) return;
	const preferred = choosePersistHint(persistHints);
	if (preferred) return options.find((option) => option.value === preferred || option.label === preferred)?.value;
	if (persistHintsMode === "explicit") return chooseAlwaysPersistOptionValue(options);
}
function readFallbackFieldValue(property, outcome) {
	if (outcome === "approved-once" && isPersistField(property)) return;
	return property.schema.default;
}
function isApprovalField(property) {
	const haystack = propertyText(property).toLowerCase();
	return /\b(approve|approval|allow|accept|decision)\b/.test(haystack);
}
function isPersistField(property) {
	const haystack = propertyText(property).toLowerCase();
	return /\b(persist|session|always|scope)\b/.test(haystack);
}
function propertyText(property) {
	return [
		property.name,
		readNonBlankStringField(property.schema, "title"),
		readNonBlankStringField(property.schema, "description")
	].filter(Boolean).join(" ");
}
function readPersistHints(meta, mode = "legacy") {
	const raw = meta.persist;
	if (typeof raw === "string") return [raw];
	if (Array.isArray(raw)) return raw.filter((entry) => typeof entry === "string");
	return mode === "legacy" ? ["session", "always"] : [];
}
function buildAcceptedMeta(meta, outcome, persistHintsMode) {
	if (outcome !== "approved-session") return null;
	const persist = choosePersistHint(readPersistHints(meta, persistHintsMode));
	return persist ? { persist } : null;
}
function choosePersistHint(persistHints) {
	if (persistHints.includes("always")) return "always";
	if (persistHints.includes("session")) return "session";
}
function chooseAlwaysPersistOptionValue(options) {
	return options.find((option) => optionMatchesPersist(option, "always"))?.value;
}
function optionMatchesPersist(option, persist) {
	return option.value.toLowerCase() === persist || option.label.toLowerCase() === persist;
}
function hasNoSchemaProperties(requestedSchema) {
	const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : {};
	return Object.keys(properties).length === 0;
}
function readEnumOptions(schema) {
	if (Array.isArray(schema.enum)) {
		const values = schema.enum.filter((entry) => typeof entry === "string");
		const labels = Array.isArray(schema.enumNames) ? schema.enumNames.filter((entry) => typeof entry === "string") : [];
		return values.map((value, index) => ({
			value,
			label: labels[index] ?? value
		}));
	}
	if (Array.isArray(schema.oneOf)) return schema.oneOf.map((entry) => {
		const option = isJsonObject(entry) ? entry : void 0;
		const value = readNonBlankStringField(option, "const");
		if (!value) return;
		return {
			value,
			label: readNonBlankStringField(option, "title") ?? value
		};
	}).filter((entry) => Boolean(entry));
	return [];
}
function isPositiveApprovalOption(option) {
	const haystack = `${option.value} ${option.label}`.toLowerCase();
	return /\b(allow|approve|accept|yes|continue|proceed|true)\b/.test(haystack);
}
function isPersistentApprovalOption(option, persist) {
	const haystack = `${option.value} ${option.label}`.toLowerCase();
	return (persist === "always" ? /\b(always|persistent)\b|\bdon't ask me again\b/.test(haystack) : persist === "session" && /\bsession\b/.test(haystack)) && /\b(allow|approve|accept)\b/.test(haystack);
}
function readNonBlankStringField(record, key) {
	const value = record?.[key];
	return typeof value === "string" && value.trim() ? value : void 0;
}
function readFirstString$1(record, keys) {
	for (const key of keys) {
		const value = readNonBlankStringField(record, key);
		if (value) return value;
	}
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-automations-allowlist.ts
function createCodexAutomationsToolsAllowResolver(specs) {
	const names = /* @__PURE__ */ new Set();
	const qualifiedNames = /* @__PURE__ */ new Map();
	for (const spec of specs) {
		if (spec.type === "function") {
			names.add(spec.name);
			continue;
		}
		for (const tool of spec.tools) {
			names.add(tool.name);
			const separator = spec.name.endsWith("_") || tool.name.startsWith("_") ? "" : "__";
			qualifiedNames.set(`${spec.name}${separator}${tool.name}`, tool.name);
		}
	}
	function resolveList(value) {
		const resolved = value.map((name) => typeof name !== "string" || names.has(name) ? name : qualifiedNames.get(name) ?? name);
		return resolved.every((name, index) => name === value[index]) ? value : resolved;
	}
	function resolvePayload(value) {
		if (!isJsonObject(value) || !Array.isArray(value.toolsAllow)) return value;
		const toolsAllow = resolveList(value.toolsAllow);
		return toolsAllow === value.toolsAllow ? value : {
			...value,
			toolsAllow
		};
	}
	function resolveJobFields(value, paddedKeys) {
		let resolved = value;
		for (const [key, entry] of Object.entries(value)) {
			const field = paddedKeys ? key.trim() : key;
			if (key !== field && Object.hasOwn(value, field)) continue;
			const next = field === "toolsAllow" && Array.isArray(entry) ? resolveList(entry) : field === "payload" || field === "namePayload" ? resolvePayload(entry) : entry;
			if (next !== entry) {
				if (resolved === value) resolved = { ...value };
				resolved[key] = next;
			}
		}
		return resolved;
	}
	return (args) => {
		if (!isJsonObject(args)) return args;
		const job = args.job;
		if (!job || isJsonObject(job) && Object.keys(job).length === 0) return resolveJobFields(args, false);
		if (!isJsonObject(job)) return args;
		const wrapper = isJsonObject(job.data) ? "data" : isJsonObject(job.job) ? "job" : void 0;
		const wrapped = wrapper ? job[wrapper] : void 0;
		const resolved = wrapper && isJsonObject(wrapped) ? {
			...job,
			[wrapper]: resolveJobFields(wrapped, true)
		} : resolveJobFields(job, true);
		return resolved === job ? args : {
			...args,
			job: resolved
		};
	};
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-catalog.ts
/** Namespace attached to OpenClaw-owned dynamic tools exposed to Codex. */
const CODEX_OPENCLAW_DYNAMIC_TOOL_NAMESPACE = "openclaw";
const CODEX_DYNAMIC_TOOL_NAME_MAX_CHARS = 128;
const CODEX_DYNAMIC_TOOL_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/u;
const ALWAYS_DIRECT_DYNAMIC_TOOL_NAMES = /* @__PURE__ */ new Set([
	"agents_list",
	"agents_wait",
	"progress_card",
	"sessions_spawn",
	"sessions_yield"
]);
function createCodexDynamicToolSpecs(params) {
	const directToolNames = /* @__PURE__ */ new Set([...ALWAYS_DIRECT_DYNAMIC_TOOL_NAMES, ...params.directToolNames ?? []]);
	const specs = [];
	const namespaceTools = [];
	const directOnlyNamespaceTools = [];
	const entries = params.loading === "direct" ? params.entries : params.entries.toSorted((left, right) => left.name.localeCompare(right.name));
	for (const entry of entries) {
		const functionSpec = createCodexDynamicToolFunctionSpec({ entry });
		if (entry.name === "openclaw" && directToolNames.has(entry.name)) {
			specs.push(functionSpec);
			continue;
		}
		if (entry.tool.catalogMode === "direct-only") {
			directOnlyNamespaceTools.push(functionSpec);
			continue;
		}
		if (params.loading === "direct" || directToolNames.has(entry.name)) {
			specs.push(functionSpec);
			continue;
		}
		namespaceTools.push({
			...functionSpec,
			deferLoading: true
		});
	}
	if (namespaceTools.length > 0) specs.push({
		type: "namespace",
		name: CODEX_OPENCLAW_DYNAMIC_TOOL_NAMESPACE,
		description: "",
		tools: namespaceTools
	});
	if (directOnlyNamespaceTools.length > 0) specs.push({
		type: "namespace",
		name: CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE,
		description: "",
		tools: directOnlyNamespaceTools
	});
	return specs;
}
function createCodexDynamicToolFunctionSpec(params) {
	return {
		type: "function",
		name: params.entry.name,
		description: params.entry.description,
		inputSchema: params.entry.inputSchema
	};
}
function projectCodexDynamicTools(tools) {
	const projectedTools = [];
	const quarantinedTools = [];
	let length;
	try {
		length = tools.length;
	} catch {
		return {
			tools: [],
			quarantinedTools: [{
				tool: "tool[0]",
				violations: ["tool[0] is unreadable"]
			}]
		};
	}
	for (let toolIndex = 0; toolIndex < length; toolIndex += 1) {
		let tool;
		try {
			tool = tools[toolIndex];
		} catch {
			quarantinedTools.push({
				tool: `tool[${toolIndex}]`,
				violations: [`tool[${toolIndex}] is unreadable`]
			});
			continue;
		}
		const descriptor = readCodexDynamicToolDescriptor(tool, toolIndex);
		if (!descriptor.ok) {
			quarantinedTools.push(descriptor.diagnostic);
			continue;
		}
		const normalizedParameters = normalizeOpenAIStrictCompatSchema(descriptor.parameters);
		const projection = projectRuntimeToolInputSchema(normalizedParameters ?? descriptor.parameters, `${descriptor.name}.inputSchema`);
		if (projection.violations.length > 0) {
			quarantinedTools.push({
				tool: descriptor.name,
				violations: projection.violations
			});
			continue;
		}
		if (!isRecord(projection.schema)) {
			quarantinedTools.push({
				tool: descriptor.name,
				violations: [`${descriptor.name}.inputSchema must be a JSON object schema`]
			});
			continue;
		}
		projectedTools.push({
			tool,
			name: descriptor.name,
			description: descriptor.description,
			inputSchema: projection.schema
		});
	}
	return {
		tools: projectedTools,
		quarantinedTools
	};
}
function readCodexDynamicToolDescriptor(tool, toolIndex) {
	const fallbackName = `tool[${toolIndex}]`;
	let name;
	try {
		const rawName = tool.name;
		if (typeof rawName !== "string" || !rawName) return {
			ok: false,
			diagnostic: {
				tool: fallbackName,
				violations: [`${fallbackName}.name must be a non-empty string`]
			}
		};
		const trimmedName = rawName.trim();
		let nameViolation;
		if (!trimmedName) nameViolation = `${rawName}.name must not be empty`;
		else if (trimmedName !== rawName) nameViolation = `${rawName}.name must not have leading or trailing whitespace`;
		else if (!CODEX_DYNAMIC_TOOL_NAME_PATTERN.test(rawName)) nameViolation = `${rawName}.name must match ^[a-zA-Z0-9_-]+$`;
		else if (rawName.length > CODEX_DYNAMIC_TOOL_NAME_MAX_CHARS) nameViolation = `${rawName}.name must be at most ${CODEX_DYNAMIC_TOOL_NAME_MAX_CHARS} characters`;
		else if (rawName === "mcp" || rawName.startsWith("mcp__")) nameViolation = `${rawName}.name is reserved by Codex app-server`;
		if (nameViolation) return {
			ok: false,
			diagnostic: {
				tool: rawName,
				violations: [nameViolation]
			}
		};
		name = rawName;
	} catch {
		return {
			ok: false,
			diagnostic: {
				tool: fallbackName,
				violations: [`${fallbackName}.name is unreadable`]
			}
		};
	}
	let description;
	try {
		description = typeof tool.description === "string" ? tool.description : "";
	} catch {
		return {
			ok: false,
			diagnostic: {
				tool: name,
				violations: [`${name}.description is unreadable`]
			}
		};
	}
	let parameters;
	try {
		parameters = tool.parameters;
	} catch {
		return {
			ok: false,
			diagnostic: {
				tool: name,
				violations: [`${name}.inputSchema is unreadable`]
			}
		};
	}
	return {
		ok: true,
		name,
		description,
		parameters
	};
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-availability.ts
/** Prepare the actual executable set, then reproject only changed owner definitions. */
function finalizeCodexToolAvailability(entries) {
	const snapshots = entries.map((entry) => ({
		entry,
		parameters: entry.tool.parameters,
		description: entry.tool.description
	}));
	const preparedNames = /* @__PURE__ */ new Set();
	finalizeAgentToolAvailability(entries.map((entry) => entry.tool), { onPrepared: (tool) => preparedNames.add(tool.name) });
	const tools = [];
	const quarantinedTools = [];
	for (const { entry, parameters, description } of snapshots) {
		if (entry.tool.parameters === parameters && entry.tool.description === description) {
			tools.push(entry);
			continue;
		}
		const projected = projectCodexDynamicTools([entry.tool]);
		tools.push(...projected.tools);
		quarantinedTools.push(...projected.quarantinedTools);
	}
	return {
		tools,
		quarantinedTools,
		preparedNames
	};
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tools.ts
/**
* Bridges OpenClaw runtime tools into Codex app-server dynamic tool specs and
* tool-call responses.
*/
const INTERNAL_TOOL_EXECUTION_VALIDATION = Symbol.for("openclaw.internalToolExecutionValidation");
const MAX_CODEX_DYNAMIC_TOOL_VALIDATION_ERRORS = 4;
const MAX_CODEX_DYNAMIC_TOOL_VALIDATION_ERROR_CHARS = 160;
const CODEX_DYNAMIC_TOOL_VALIDATION_TRUNCATED_SUFFIX = " [detail truncated]";
function shouldValidateCodexDynamicToolInput(tool) {
	return getPluginToolMeta(tool)?.mcp?.operation !== "tool";
}
function assertCodexDynamicToolInputMatchesSchema(params) {
	const validation = validateJsonSchemaValue({
		schema: params.schema,
		cacheKey: `codex-dynamic-tool-input:${params.toolName}:${JSON.stringify(params.schema)}`,
		value: params.value
	});
	if (validation.ok) return;
	const visibleErrors = validation.errors.slice(0, MAX_CODEX_DYNAMIC_TOOL_VALIDATION_ERRORS);
	const details = visibleErrors.map((error) => {
		if (error.text.length <= MAX_CODEX_DYNAMIC_TOOL_VALIDATION_ERROR_CHARS) return error.text;
		return `${error.text.slice(0, 141)}${CODEX_DYNAMIC_TOOL_VALIDATION_TRUNCATED_SUFFIX}`;
	}).join("; ");
	const omitted = validation.errors.length - visibleErrors.length;
	const omittedSuffix = omitted > 0 ? `; ${omitted} more violation(s) omitted` : "";
	throw new Error(`Invalid arguments for tool "${params.toolName}": ${details}${omittedSuffix}.`);
}
function createCodexDynamicToolValidationControl(params) {
	return {
		[INTERNAL_TOOL_EXECUTION_VALIDATION]: true,
		toolCallId: params.toolCallId,
		validate: params.validate
	};
}
function applyCurrentMessageProvider(toolName, args, currentProvider) {
	const hasProvider = typeof args.provider === "string" && args.provider.trim().length > 0 ? true : typeof args.channel === "string" && args.channel.trim().length > 0;
	const provider = currentProvider?.trim();
	if (toolName !== "message" || hasProvider || !provider) return args;
	return {
		...args,
		provider
	};
}
function computerFrameImageIdentity(content) {
	if (!Array.isArray(content)) return;
	const images = content.filter((block) => block.type === "image");
	if (images.length !== 1) return;
	const image = expectDefined(images[0], "single Codex computer frame image");
	return createHash("sha256").update(JSON.stringify([image.mimeType, image.data])).digest("hex");
}
function invalidateComputerFrame(contextEpoch) {
	contextEpoch.value += 1;
	delete contextEpoch.frameToolCallId;
	delete contextEpoch.frameImageIdentity;
}
/**
* Creates dynamic tool specs and a call handler that executes OpenClaw tools,
* applies hooks/middleware, and records delivery/media telemetry.
*/
function createCodexDynamicToolBridge(params) {
	const toolResultHookContext = toToolResultHookContext(params.hookContext);
	const contextWindowTokens = params.hookContext?.contextWindowTokens;
	const toolResultMaxChars = typeof contextWindowTokens === "number" && Number.isFinite(contextWindowTokens) && contextWindowTokens > 0 ? Math.max(1, resolveLiveToolResultMaxChars({ contextWindowTokens })) : DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS;
	const availableProjection = projectCodexExecutableDynamicToolSurface(params.tools, params.hookContext);
	const registeredProjection = params.registeredTools ? projectCodexDynamicTools(params.registeredTools) : availableProjection;
	const inheritedSpecs = params.registeredSpecs ? structuredClone([...params.registeredSpecs]) : void 0;
	const inheritedNames = inheritedSpecs ? new Set(flattenCodexDynamicToolFunctions(inheritedSpecs).map((tool) => tool.name)) : void 0;
	const registrationNames = inheritedNames ?? new Set(registeredProjection.tools.map((entry) => entry.name));
	const finalized = finalizeCodexToolAvailability(availableProjection.tools.filter((entry) => registrationNames.has(entry.name)));
	const availableTools = finalized.tools;
	const pluginLocalMediaTrustByToolName = /* @__PURE__ */ new Map();
	for (const { name, tool } of availableTools) {
		const pluginMeta = getPluginToolMeta(tool);
		if (pluginMeta) pluginLocalMediaTrustByToolName.set(name, new Set(pluginMeta.trustedLocalMedia === true ? [name] : []));
	}
	availableProjection.quarantinedTools.push(...finalized.quarantinedTools);
	const toolMap = new Map(availableTools.map((entry) => [entry.name, entry]));
	const quarantinedAvailableToolNames = new Set(availableProjection.quarantinedTools.map((tool) => tool.tool));
	const registeredSpecTools = (params.registeredTools ? registeredProjection.tools : availableTools).filter((entry) => !quarantinedAvailableToolNames.has(entry.name)).map((entry) => finalized.preparedNames.has(entry.name) ? toolMap.get(entry.name) ?? entry : entry);
	const registeredToolNames = inheritedNames ?? new Set(registeredSpecTools.map((entry) => entry.name));
	const quarantinedTools = dedupeQuarantinedDynamicTools([...availableProjection.quarantinedTools, ...registeredProjection.quarantinedTools]);
	reportQuarantinedDynamicTools({
		tools: quarantinedTools,
		availableToolCount: availableTools.length,
		registeredToolCount: registeredSpecTools.length,
		hookContext: params.hookContext
	});
	const telemetry = {
		didSendViaMessagingTool: false,
		didDeliverSourceReplyViaMessageTool: false,
		messagingToolSentTexts: [],
		messagingToolSentMediaUrls: [],
		messagingToolSentTargets: [],
		messagingToolSourceReplyPayloads: [],
		confirmedMediaDeliveries: [],
		toolMediaUrls: [],
		toolAutoDeliveryMediaUrls: [],
		coreTtsToolResults: [],
		toolAudioAsVoice: false,
		acceptedSessionSpawns: [],
		quarantinedTools
	};
	const middlewareRunner = createAgentToolResultMiddlewareRunner({
		runtime: "codex",
		...toolResultHookContext
	});
	const isReplaySafeToolInstance = (tool) => {
		const pluginMeta = getPluginToolMeta(tool);
		if (pluginMeta) return pluginMeta.replaySafe === true;
		return getChannelAgentToolMeta(tool) === void 0;
	};
	const legacyExtensionRunner = createCodexAppServerToolResultExtensionRunner(toolResultHookContext);
	const executionSnapshotStates = /* @__PURE__ */ new Map();
	const directToolNames = params.directToolNames;
	const specs = inheritedSpecs ?? createCodexDynamicToolSpecs({
		entries: registeredSpecTools,
		loading: params.loading ?? "searchable",
		directToolNames
	});
	const resolveAutomationsToolsAllow = createCodexAutomationsToolsAllowResolver(specs);
	let readRemoteWorkspaceFile;
	return {
		availableTools: availableTools.map((entry) => entry.tool),
		availableSpecs: inheritedSpecs ? inheritedSpecs.flatMap((spec) => {
			if (spec.type === "function") return toolMap.has(spec.name) ? [spec] : [];
			const tools = spec.tools.filter((tool) => toolMap.has(tool.name));
			return tools.length ? [{
				...spec,
				tools
			}] : [];
		}) : createCodexDynamicToolSpecs({
			entries: availableTools,
			loading: params.loading ?? "searchable",
			directToolNames
		}),
		specs,
		resultContentSourceForTool: (toolName) => toolMap.get(toolName)?.tool.resultContentSource,
		sideEffectOwnerKeyForTool: (toolName) => {
			const tool = toolMap.get(toolName)?.tool;
			return tool ? getPluginToolSideEffectOwnerKey(tool) : void 0;
		},
		telemetry,
		setRemoteWorkspaceFileReader: (reader) => {
			readRemoteWorkspaceFile = reader;
		},
		consumeToolExecutionSnapshot: (toolCallId) => {
			const state = executionSnapshotStates.get(toolCallId);
			executionSnapshotStates.delete(toolCallId);
			if (state) state.consumed = true;
			return state?.snapshot;
		},
		handleToolCall: async (call, options) => {
			const toolEntry = toolMap.get(call.tool);
			if (!toolEntry) {
				const executedArguments = asNonArrayRecord(call.arguments);
				const message = registeredToolNames.has(call.tool) ? `OpenClaw tool is not available for this turn: ${call.tool}` : `Unknown OpenClaw tool: ${call.tool}`;
				finalizeToolTerminalPresentation({
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					result: failedToolResult(message),
					isError: true,
					observer: params.hookContext?.onToolOutcome,
					toolName: call.tool,
					toolCallOrdinal: options?.toolCallOrdinal
				});
				notifyAgentToolResult(options?.onAgentToolResult, call.tool, failedToolResult(message), true);
				return createFailedDynamicToolResponse(message, {
					executedArguments,
					executionStarted: false
				});
			}
			const { tool, name: toolName } = toolEntry;
			const rawArguments = toolName === "automations" ? resolveAutomationsToolsAllow(call.arguments) : call.arguments;
			const args = asNonArrayRecord(rawArguments);
			const startedAt = Date.now();
			const signal = composeAbortSignals(params.signal, options?.signal);
			let didStartExecution = false;
			let didDispatchExecution = false;
			let executionPrevented = false;
			let executedArgs = structuredClone(args);
			const executionSnapshotState = {
				consumed: false,
				retainAfterCompletion: options?.retainExecutionSnapshot === true
			};
			executionSnapshotStates.set(call.callId, executionSnapshotState);
			const captureExecutionBoundary = () => {
				didStartExecution ||= didDispatchExecution;
				executionPrevented = executionPrevented || consumePreExecutionBlockedToolCall(call.callId, toolResultHookContext.runId);
				const adjustedExecutedArgs = consumeAdjustedParamsForToolCall(call.callId, toolResultHookContext.runId);
				if (isRecord(adjustedExecutedArgs)) executedArgs = adjustedExecutedArgs;
				if (!executionSnapshotState.consumed) executionSnapshotState.snapshot = {
					executedArguments: structuredClone(executedArgs),
					executionStarted: didStartExecution && !executionPrevented
				};
			};
			try {
				const prepare = tool.prepareArguments;
				const toolArgs = prepare ? Reflect.apply(prepare, tool, [rawArguments]) : args;
				const preparedMessageMedia = toolName === "message" && isRecord(toolArgs) ? await prepareCodexRemoteWorkspaceMessageMedia({
					args: toolArgs,
					localWorkspaceRoot: params.hookContext?.workspaceDir,
					remoteWorkspaceRoot: params.hookContext?.remoteWorkspaceRoot,
					readRemoteFile: readRemoteWorkspaceFile,
					timeoutMs: params.hookContext?.remoteWorkspaceRequestTimeoutMs,
					signal
				}) : void 0;
				const preparedArgs = preparedMessageMedia?.args ?? toolArgs;
				executedArgs = structuredClone(isRecord(preparedArgs) ? preparedArgs : args);
				const messagingContext = {
					config: params.hookContext?.config,
					currentChannelId: params.hookContext?.currentChannelId,
					currentMessagingTarget: params.hookContext?.currentMessagingTarget,
					currentThreadId: params.hookContext?.currentThreadId,
					replyToMode: params.hookContext?.replyToMode,
					hasRepliedRef: params.hookContext?.hasRepliedRef ? { value: params.hookContext.hasRepliedRef.value } : void 0
				};
				didDispatchExecution = true;
				const executionArgs = [
					call.callId,
					preparedArgs,
					signal
				];
				if (shouldValidateCodexDynamicToolInput(tool)) executionArgs.push(createCodexDynamicToolValidationControl({
					toolCallId: call.callId,
					validate: (value) => assertCodexDynamicToolInputMatchesSchema({
						toolName,
						schema: toolEntry.inputSchema,
						value
					})
				}));
				const rawResult = await Reflect.apply(tool.execute, tool, executionArgs);
				captureExecutionBoundary();
				const rawIsError = isToolResultError(rawResult);
				const messageDelivery = readEmbeddedMessageDeliveryFact(asOptionalRecord(asOptionalRecord(rawResult)?.details)?.messageDelivery);
				const messagingDelivered = isMessagingTool(toolName) && (messageDelivery ? messageDelivery.status === "settled" && (!rawIsError || messageDelivery.partialDelivery) : isDeliveredMessagingToolResult({
					toolName,
					args: executedArgs,
					result: rawResult,
					isError: rawIsError
				}));
				const mediaDelivery = messagingDelivered ? messageDelivery ?? projectPluginMessageDeliveryFact(rawResult) : void 0;
				const mediaDeliveryConfirmed = messagingDelivered && !rawIsError && executedArgs.dryRun !== true && mediaDelivery?.status === "settled" && !mediaDelivery.partialDelivery;
				const messagingTelemetryArgs = applyCurrentMessageProvider(toolName, executedArgs, params.hookContext?.currentChannelProvider);
				const messagingTarget = isMessagingTool(toolName) ? extractMessagingToolSend(toolName, messagingTelemetryArgs, messagingContext) : void 0;
				const confirmedMessagingTarget = messagingDelivered && messagingTarget ? extractMessagingToolSendResult(messagingTarget, rawResult) : messagingTarget;
				const deliveredSourceReply = messagingDelivered && isDeliveredMessageToolOnlySourceReplyResult({
					sourceReplyDeliveryMode: params.hookContext?.sourceReplyDeliveryMode,
					toolName,
					args: executedArgs,
					result: rawResult,
					isError: rawIsError,
					deliveryConfirmed: true,
					allowExplicitSourceRoute: isDeliveredMessagingToolSendToCurrentSource({
						send: confirmedMessagingTarget,
						config: params.hookContext?.config,
						currentProvider: params.hookContext?.currentChannelProvider,
						currentAccountId: params.hookContext?.turnSourceAccountId,
						currentChannelId: params.hookContext?.currentChannelId,
						currentMessagingTarget: params.hookContext?.currentMessagingTarget,
						currentThreadId: params.hookContext?.currentThreadId,
						sessionKey: params.hookContext?.sessionKey,
						deliveredPayload: rawResult
					})
				});
				if (toolName === "message" && messageDelivery?.sourceReplyDelivered) telemetry.sourceReplyDelivered = true;
				const rawResultFailureKind = resolveToolResultFailureKind(rawResult);
				const telemetryRawResult = sanitizeToolResult(rawResult);
				const middlewareResult = await middlewareRunner.applyToolResultMiddleware({
					threadId: call.threadId,
					turnId: call.turnId,
					toolCallId: call.callId,
					toolName,
					args: structuredClone(executedArgs),
					isError: rawIsError,
					result: rawResult
				});
				const result = await legacyExtensionRunner.applyToolResultExtensions({
					threadId: call.threadId,
					turnId: call.turnId,
					toolCallId: call.callId,
					toolName,
					args: structuredClone(executedArgs),
					result: middlewareResult
				});
				const resultIsError = rawIsError || isToolResultError(result);
				const acceptedSessionSpawn = toolName === "sessions_spawn" && !rawIsError ? normalizeAcceptedSessionSpawnResult(telemetryRawResult) : null;
				if (acceptedSessionSpawn) telemetry.acceptedSessionSpawns.push(acceptedSessionSpawn);
				const finalResultFailureKind = resolveToolResultFailureKind(result);
				const resultFailureKind = rawResultFailureKind ?? finalResultFailureKind;
				const observerResult = rawResultFailureKind && finalResultFailureKind !== rawResultFailureKind ? {
					...result,
					details: {
						...isRecord(result.details) ? result.details : {},
						status: rawResultFailureKind
					}
				} : result;
				notifyAgentToolResult(options?.onAgentToolResult, toolName, observerResult, resultIsError);
				runAgentHarnessAfterToolCallHook({
					toolName,
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					agentId: toolResultHookContext.agentId,
					sessionId: toolResultHookContext.sessionId,
					sessionKey: toolResultHookContext.sessionKey,
					channelId: toolResultHookContext.channelId,
					startArgs: executedArgs,
					result,
					startedAt
				});
				finalizeToolTerminalPresentation({
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					result,
					isError: resultIsError,
					observer: params.hookContext?.onToolOutcome,
					toolName,
					toolCallOrdinal: options?.toolCallOrdinal
				});
				const terminalType = resultFailureKind === "blocked" ? "blocked" : resultIsError || resultFailureKind ? "error" : "completed";
				const contentItems = convertToolContents(result.content, toolResultMaxChars);
				const deliveredFrameImages = contentItems.filter((item) => item.type === "inputImage");
				const finalFrameImageIdentity = computerFrameImageIdentity(result.content);
				if (toolName === "computer" && params.computerContextEpoch?.frameToolCallId === call.callId && (deliveredFrameImages.length !== 1 || finalFrameImageIdentity === void 0 || finalFrameImageIdentity !== params.computerContextEpoch.frameImageIdentity)) invalidateComputerFrame(params.computerContextEpoch);
				const response = {
					contentItems,
					success: !resultIsError,
					diagnosticTerminalType: terminalType,
					diagnosticTerminalReason: resultFailureKind === "blocked" ? void 0 : resultFailureKind,
					transcriptDetails: asOptionalRecord(sanitizeToolResult(result))?.details
				};
				const toolConfirmedSourceReply = params.hookContext?.sourceReplyDeliveryMode === "message_tool_only" && toolName === "message" && !resultIsError && (rawResult.terminate === true || result.terminate === true);
				const confirmedSourceReply = params.hookContext?.sourceReplyDeliveryMode === "message_tool_only" && toolName === "message" && (toolConfirmedSourceReply || deliveredSourceReply);
				const sourceReplyFinal = confirmedSourceReply ? executedArgs.final !== false : void 0;
				const autoDeliveryTtsMediaUrls = getCoreTtsToolResultMediaUrls(rawResult);
				collectToolTelemetry({
					toolName,
					args: executedArgs,
					result,
					mediaTrustResult: telemetryRawResult,
					telemetry,
					signal,
					isError: resultIsError,
					messagingDelivered,
					mediaDeliveryConfirmed,
					sourcePathsByStagedPath: preparedMessageMedia?.sourcePathsByStagedPath,
					autoDeliveryTtsMediaUrls,
					coreTtsToolResult: autoDeliveryTtsMediaUrls?.length ? rawResult : void 0,
					messagingTarget: confirmedMessagingTarget,
					sourceReplyFinal,
					trustedLocalMediaToolNames: pluginLocalMediaTrustByToolName.get(toolName)
				});
				if (deliveredSourceReply || toolConfirmedSourceReply) telemetry.didDeliverSourceReplyViaMessageTool = true;
				const continuesSourceReplyProgress = confirmedSourceReply && sourceReplyFinal === false;
				response.terminate = (rawResult.terminate === true || result.terminate === true) && !continuesSourceReplyProgress || isToolResultYield(rawResult) || isToolResultYield(result) || confirmedSourceReply && sourceReplyFinal === true || void 0;
				const asyncStarted = isAsyncStartedToolResult(rawResult) || isAsyncStartedToolResult(result);
				response.asyncStarted = asyncStarted || void 0;
				const replaySafe = executionPrevented || !asyncStarted && isReplaySafeToolInstance(toolEntry.tool) && isReplaySafeToolCall(toolName, executedArgs);
				copyInternalToolResultState(rawResult, response);
				response.executedArguments = executedArgs;
				response.executionStarted = didStartExecution && !executionPrevented;
				response.replaySafe = replaySafe;
				response.sideEffectEvidence = !replaySafe || void 0;
				return response;
			} catch (error) {
				const trustedNoStart = consumeTrustedToolNoStartError(error);
				executionPrevented ||= trustedNoStart;
				captureExecutionBoundary();
				if (toolName === "computer" && params.computerContextEpoch?.frameToolCallId === call.callId) invalidateComputerFrame(params.computerContextEpoch);
				const executionDisposition = getBeforeToolCallFailureDisposition(error) ?? (signal.aborted ? resolveCodexToolAbortTerminalReason(signal) : resolveToolExecutionErrorKind(error));
				const errorMessage = formatToolExecutionErrorMessage(error, "OpenClaw dynamic tool call failed.");
				const operatorHint = readToolOperatorHint(error);
				if (operatorHint) embeddedAgentLog.error(`[tools] ${toolName} failed: ${errorMessage} ${operatorHint}`);
				executionPrevented = executionPrevented || consumePreExecutionBlockedToolCall(call.callId, toolResultHookContext.runId);
				const failedResult = failedToolResult(errorMessage, executionDisposition);
				finalizeToolTerminalPresentation({
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					result: failedResult,
					isError: true,
					observer: params.hookContext?.onToolOutcome,
					toolName,
					toolCallOrdinal: options?.toolCallOrdinal
				});
				notifyAgentToolResult(options?.onAgentToolResult, toolName, failedResult, true);
				runAgentHarnessAfterToolCallHook({
					toolName,
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					agentId: toolResultHookContext.agentId,
					sessionId: toolResultHookContext.sessionId,
					sessionKey: toolResultHookContext.sessionKey,
					channelId: toolResultHookContext.channelId,
					startArgs: executedArgs,
					error: errorMessage,
					startedAt
				});
				const replaySafe = !didStartExecution || executionPrevented || isReplaySafeToolInstance(toolEntry.tool) && isReplaySafeToolCall(toolName, executedArgs);
				return {
					contentItems: [{
						type: "inputText",
						text: errorMessage
					}],
					success: false,
					diagnosticTerminalType: executionDisposition === "blocked" ? "blocked" : "error",
					diagnosticTerminalReason: executionDisposition === "blocked" ? void 0 : executionDisposition,
					executedArguments: executedArgs,
					executionStarted: didStartExecution && !executionPrevented,
					replaySafe,
					sideEffectEvidence: didStartExecution && !replaySafe || void 0
				};
			} finally {
				if (executionSnapshotStates.get(call.callId) === executionSnapshotState && (executionSnapshotState.consumed || !executionSnapshotState.retainAfterCompletion)) executionSnapshotStates.delete(call.callId);
				consumeAdjustedParamsForToolCall(call.callId, toolResultHookContext.runId);
			}
		}
	};
}
function projectCodexExecutableDynamicToolSurface(tools, hookContext) {
	const { tools: projectedTools, quarantinedTools } = projectCodexDynamicTools(tools);
	const wrappedTools = [];
	for (const entry of projectedTools) try {
		if (isToolWrappedWithBeforeToolCallHook(entry.tool)) {
			setBeforeToolCallDiagnosticsEnabled(entry.tool, false);
			wrappedTools.push(entry);
			continue;
		}
		wrappedTools.push({
			...entry,
			tool: wrapToolWithBeforeToolCallHook(entry.tool, hookContext, { emitDiagnostics: false })
		});
	} catch {
		quarantinedTools.push({
			tool: entry.name,
			violations: [`${entry.name} could not be wrapped for before-tool-call hooks`]
		});
	}
	return {
		tools: wrappedTools,
		quarantinedTools: dedupeQuarantinedDynamicTools(quarantinedTools)
	};
}
/** Applies the exact schema and hook-wrapper projection used by the executable Codex bridge. */
function projectCodexExecutableDynamicTools(params) {
	const projected = projectCodexExecutableDynamicToolSurface(params.tools, params.hookContext);
	const finalized = finalizeCodexToolAvailability(projected.tools);
	return {
		availableTools: finalized.tools.map((entry) => entry.tool),
		quarantinedTools: [...projected.quarantinedTools, ...finalized.quarantinedTools]
	};
}
function notifyAgentToolResult(observer, toolName, result, isError) {
	try {
		observer?.({
			toolName,
			result: sanitizeToolResult(result),
			isError
		});
	} catch (error) {
		const message = formatToolExecutionErrorMessage(error, "Unknown error");
		embeddedAgentLog.warn(`onAgentToolResult handler failed: tool=${toolName} error=${message}`);
	}
}
function reportQuarantinedDynamicTools(params) {
	if (params.tools.length === 0) return;
	embeddedAgentLog.warn(`codex app-server quarantined ${params.tools.length} unsupported dynamic tool ${params.tools.length === 1 ? "definition" : "definitions"}: ${params.tools.map((tool) => tool.tool).join(", ")}; retained ${params.availableToolCount} available and ${params.registeredToolCount} registered tools`, {
		tools: params.tools.map(({ tool, violations }) => ({
			tool,
			violations
		})),
		availableToolCount: params.availableToolCount,
		registeredToolCount: params.registeredToolCount
	});
	for (const tool of params.tools) emitTrustedDiagnosticEvent({
		type: "tool.execution.blocked",
		agentId: params.hookContext?.agentId,
		runId: params.hookContext?.runId,
		sessionId: params.hookContext?.sessionId,
		sessionKey: params.hookContext?.sessionKey,
		toolName: tool.tool,
		deniedReason: "unsupported_tool_schema",
		reason: tool.violations.join(", ")
	});
}
function dedupeQuarantinedDynamicTools(tools) {
	return [...new Map(tools.map((tool) => [tool.tool, {
		tool: tool.tool,
		violations: tool.violations
	}])).values()];
}
function toToolResultHookContext(ctx) {
	const { agentId, sessionId, sessionKey, runId, channelId } = ctx ?? {};
	return {
		...agentId && { agentId },
		...sessionId && { sessionId },
		...sessionKey && { sessionKey },
		...runId && { runId },
		...channelId && { channelId }
	};
}
function composeAbortSignals(...signals) {
	const activeSignals = signals.filter((signal) => Boolean(signal));
	if (activeSignals.length === 0) return new AbortController().signal;
	if (activeSignals.length === 1) return expectDefined(activeSignals[0], "single active Codex abort signal");
	return AbortSignal.any(activeSignals);
}
function collectToolTelemetry(params) {
	if (!params.isError && params.toolName === "cron" && isCronAddAction(params.args)) params.telemetry.successfulCronAdds = (params.telemetry.successfulCronAdds ?? 0) + 1;
	if (!params.isError && params.toolName === HEARTBEAT_RESPONSE_TOOL_NAME) {
		const response = normalizeHeartbeatToolResponse(params.result?.details);
		if (response) params.telemetry.heartbeatToolResponse = response;
	}
	if (!params.isError && params.result && !params.signal.aborted) {
		const media = extractToolResultMediaArtifact(params.result);
		if (media) {
			const mediaUrls = filterToolResultMediaUrls(params.toolName, media.mediaUrls, params.coreTtsToolResult ?? params.mediaTrustResult ?? params.result, params.trustedLocalMediaToolNames);
			const seen = new Set(params.telemetry.toolMediaUrls);
			const autoDeliveryMediaUrls = new Set(params.telemetry.toolAutoDeliveryMediaUrls);
			const rawAutoDeliveryMediaUrls = new Set(params.autoDeliveryTtsMediaUrls);
			let retainsCoreTtsMedia = false;
			for (const mediaUrl of mediaUrls) {
				if (!seen.has(mediaUrl)) {
					seen.add(mediaUrl);
					params.telemetry.toolMediaUrls.push(mediaUrl);
				}
				if (rawAutoDeliveryMediaUrls.has(mediaUrl)) {
					autoDeliveryMediaUrls.add(mediaUrl);
					retainsCoreTtsMedia = true;
				} else autoDeliveryMediaUrls.delete(mediaUrl);
			}
			params.telemetry.toolAutoDeliveryMediaUrls = [...autoDeliveryMediaUrls];
			if (retainsCoreTtsMedia && params.coreTtsToolResult && !params.telemetry.coreTtsToolResults.includes(params.coreTtsToolResult)) params.telemetry.coreTtsToolResults.push(params.coreTtsToolResult);
			if (media.audioAsVoice) params.telemetry.toolAudioAsVoice = true;
		}
	}
	if (!params.messagingDelivered) return;
	params.telemetry.didSendViaMessagingTool = true;
	if (asOptionalRecord(asOptionalRecord(params.mediaTrustResult)?.details)?.sourceReplySink === "internal-ui") {
		const sourceReplyPayload = extractMessagingToolSourceReplyPayload(params.result);
		if (!sourceReplyPayload) return;
		const record = {
			...sourceReplyPayload,
			...params.sourceReplyFinal !== void 0 ? { sourceReplyFinal: params.sourceReplyFinal } : {}
		};
		params.telemetry.messagingToolSourceReplyPayloads.push(record);
		if (params.mediaDeliveryConfirmed) params.telemetry.confirmedMediaDeliveries.push({
			kind: "sourceReply",
			sourceUrls: resolveCodexMediaSourceUrls(collectCodexMessageMediaUrls(record), params.sourcePathsByStagedPath)
		});
		return record;
	}
	const text = readFirstString(params.args, [
		"text",
		"message",
		"body",
		"content"
	]);
	if (text) params.telemetry.messagingToolSentTexts.push(text);
	const mediaUrls = params.mediaDeliveryConfirmed ? collectCodexMessageMediaUrls(params.args) : [];
	params.telemetry.messagingToolSentMediaUrls.push(...mediaUrls);
	const record = {
		...params.messagingTarget ?? {
			tool: params.toolName,
			provider: readFirstString(params.args, ["provider", "channel"]) ?? params.toolName,
			accountId: readFirstString(params.args, ["accountId", "account_id"]),
			to: readFirstString(params.args, [
				"to",
				"target",
				"recipient"
			]),
			threadId: readFirstString(params.args, [
				"threadId",
				"thread_id",
				"messageThreadId"
			])
		},
		...text ? { text } : {},
		...mediaUrls.length > 0 ? { mediaUrls } : {},
		...params.sourceReplyFinal !== void 0 ? { sourceReplyFinal: params.sourceReplyFinal } : {}
	};
	params.telemetry.messagingToolSentTargets.push(record);
	if (mediaUrls.length > 0) params.telemetry.confirmedMediaDeliveries.push({
		kind: "outbound",
		target: record,
		sourceUrls: resolveCodexMediaSourceUrls(mediaUrls, params.sourcePathsByStagedPath)
	});
	return record;
}
function isToolResultYield(result) {
	const details = result.details;
	if (!isRecord(details) || typeof details.status !== "string") return false;
	return details.status.trim().toLowerCase() === "yielded";
}
function isAsyncStartedToolResult(result) {
	const details = result.details;
	return isRecord(details) && details.async === true && details.status === "started";
}
function normalizeToolResultMaxChars(maxChars) {
	return typeof maxChars === "number" && Number.isFinite(maxChars) && maxChars > 0 ? Math.floor(maxChars) : DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS;
}
function sanitizeToolTextRuns(rawContent) {
	const content = [];
	for (let index = 0; index < rawContent.length;) {
		const item = rawContent[index];
		if (item.type !== "text") {
			content.push(item);
			index += 1;
			continue;
		}
		const textRun = [];
		while (index < rawContent.length) {
			const next = rawContent[index];
			if (next.type !== "text") break;
			textRun.push(next);
			index += 1;
		}
		const sanitizedText = sanitizeToolResult(textRun.map((entry) => entry.text).join(""));
		let offset = 0;
		content.push(...textRun.map((entry, runIndex) => {
			const targetEnd = runIndex === textRun.length - 1 ? sanitizedText.length : Math.min(sanitizedText.length, offset + entry.text.length);
			const text = sliceUtf16Safe(sanitizedText, offset, targetEnd);
			const sanitized = Object.assign({}, entry, { text });
			offset += text.length;
			return sanitized;
		}));
	}
	return content;
}
function convertToolContents(rawContent, toolResultMaxChars = DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS) {
	const content = sanitizeToolTextRuns(rawContent);
	const maxChars = normalizeToolResultMaxChars(toolResultMaxChars);
	const totalTextChars = content.reduce((total, item) => total + (item.type === "text" ? item.text.length : 0), 0);
	if (content.reduce((total, item) => total + (item.type === "text" ? estimateToolResultTextChars(item.text) : 0), 0) <= maxChars) return content.flatMap(convertToolContent);
	const noticeText = `...(OpenClaw truncated dynamic tool result: original ${totalTextChars} chars, weighted budget ${maxChars}; rerun with narrower args.)`;
	const notice = `\n${noticeText}`;
	const noticeChars = estimateToolResultTextChars(notice);
	let remainingTextBudget = Math.max(0, maxChars - noticeChars);
	let appendedNotice = false;
	const output = [];
	for (const item of content) {
		if (item.type !== "text") {
			output.push(...convertToolContent(item));
			continue;
		}
		if (appendedNotice) continue;
		if (noticeChars >= maxChars) {
			output.push({
				type: "inputText",
				text: sliceToolResultTextToBudget(noticeText, maxChars)
			});
			appendedNotice = true;
			continue;
		}
		const text = sliceToolResultTextToBudget(item.text, remainingTextBudget);
		remainingTextBudget -= estimateToolResultTextChars(text);
		if (remainingTextBudget <= 0 || text.length < item.text.length) {
			output.push({
				type: "inputText",
				text: `${text.trimEnd()}${notice}`
			});
			appendedNotice = true;
		} else if (text.length > 0) output.push({
			type: "inputText",
			text
		});
	}
	if (!appendedNotice) output.push({
		type: "inputText",
		text: sliceToolResultTextToBudget(noticeText, maxChars)
	});
	return output;
}
function convertToolContent(content) {
	if (content.type === "text") return [{
		type: "inputText",
		text: content.text
	}];
	const imageUrl = sanitizeInlineImageDataUrl(`data:${content.mimeType};base64,${content.data}`);
	if (!imageUrl) return [{
		type: "inputText",
		text: invalidInlineImageText("codex dynamic tool")
	}];
	return [{
		type: "inputImage",
		imageUrl
	}];
}
function readFirstString(record, keys) {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "string" && value.trim()) return value.trim();
		if (typeof value === "number" && Number.isFinite(value)) return String(value);
	}
}
function isCronAddAction(args) {
	const action = args.action;
	return typeof action === "string" && action.trim().toLowerCase() === "add";
}
//#endregion
export { shouldEnableCodexAppServerNativeToolSurface as C, mapCodexAppServerRemoteWorkspacePath as E, resolveCodexSandboxEnvironmentSelection as S, shouldWarnCodexDynamicToolBuildStageSummary as T, formatCodexDynamicToolBuildStageSummary as _, emitDynamicToolStartedDiagnostic as a, resolveCodexExternalSandboxPolicyForOpenClawSandbox as b, ensureCodexSandboxExecServerEnvironment as c, hasCodexNativeBackgroundProcesses as d, readBoundedCodexRemoteWorkspaceFile as f, disableCodexPluginThreadConfig as g, createCodexDynamicToolBuildStageTracker as h, emitDynamicToolErrorDiagnostic as i, releaseCodexSandboxExecServerEnvironment as l, buildDynamicTools as m, projectCodexExecutableDynamicTools as n, emitDynamicToolTerminalDiagnostic as o, CodexNativeToolLifecycleProjector as p, routeCodexAppServerElicitationRequest as r, handleCodexAppServerApprovalRequest as s, createCodexDynamicToolBridge as t, CodexNativeProcessAuthority as u, resolveCodexAppServerExecutionCwd as v, shouldRequireCodexSandboxExecServerEnvironment as w, resolveCodexMessageToolProvider as x, resolveCodexAppServerHookChannelId as y };
