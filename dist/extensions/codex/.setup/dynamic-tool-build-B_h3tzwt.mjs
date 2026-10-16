import { CODEX_NATIVE_TOOL_REQUIREMENTS } from "../native-tool-policy.js";
import { c as isCodexPairedNodeRemoteExecPlacementSandbox, d as readCodexPluginConfig, l as isCodexRemoteExecPlacementSandbox } from "./config-parsing-BQq-CHTF.mjs";
import "./config-0Gxk3_eq.mjs";
import { a as isCodexResponsesOAuthRun } from "./responses-oauth-twnuTaAa.mjs";
import { ct as filterCodexDynamicToolsForDisabledNativeSurface, dt as isSystemAgentOnlyCodexDynamicToolAllowlist, ft as normalizeCodexDynamicToolName, lt as isForcedPrivateQaCodexRuntime, m as resolveCodexWebSearchPlan, st as filterCodexDynamicTools } from "./thread-requests-DMd-wcni.mjs";
import { n as resolveCodexNativeExecutionPolicy, r as resolveCodexNodeExecToolOverrides } from "./native-execution-policy-ClzpdG3D.mjs";
import { a as createGatewayProcessProjection, c as createSandboxProcessProjection, i as createGatewayExecProjection, l as isCodexDynamicToolExcluded, o as createNodeExecAliasDynamicTool, s as createSandboxExecProjection, u as placeDisabledNativeShellToolsInDirectNamespace } from "./shell-dynamic-tools-BQj1TbJN.mjs";
import path from "node:path";
import { createStageTimingTracker, formatStageTimings } from "openclaw/plugin-sdk/time-runtime";
import { applyEmbeddedAttemptToolsAllow, buildAgentHookContextChannelFields, buildEmbeddedAttemptToolRunContext, embeddedAgentLog, filterProviderNormalizableTools, getPluginToolMeta, isHostScopedAgentToolActive, isSubagentSessionKey, normalizeAgentRuntimeTools, resolveAttemptSpawnWorkspaceDir, resolveModelAuthMode, supportsModelTools } from "openclaw/plugin-sdk/agent-harness-runtime";
import { resolveAgentDir as resolveAgentDir$1 } from "openclaw/plugin-sdk/agent-runtime";
import { resolveCodexScheduledToolProjectionFactory, runWithCronCreatorAuthorityCapabilityResolver } from "openclaw/plugin-sdk/codex-mcp-projection";
import { isToolAllowed } from "openclaw/plugin-sdk/sandbox";
//#region extensions/codex/src/app-server/dynamic-tool-construction-plan.ts
/** Keeps node filesystem and process ownership on its native exec-server. */
function resolveCodexToolConstructionPlan(sandbox, nativeToolSurfaceEnabled, requireWorkspaceOnly) {
	const nodeExecution = isCodexPairedNodeRemoteExecPlacementSandbox(sandbox) && sandbox?.backendId === "node";
	if (!nodeExecution && !requireWorkspaceOnly) return;
	if (nodeExecution && !nativeToolSurfaceEnabled) throw new Error("Codex node execution requires its native exec-server tool surface; adjust the session tool policy and start a fresh attempt.");
	return {
		includeBaseCodingTools: !nodeExecution,
		includeShellTools: false,
		includeChannelTools: true,
		includeOpenClawTools: true,
		includePluginTools: true
	};
}
//#endregion
//#region extensions/codex/src/app-server/remote-workspace-path.ts
/** Projects a gateway workspace path into the remote Codex execution workspace. */
function mapCodexAppServerRemoteWorkspacePath(params) {
	if (!params.remoteWorkspaceRoot) return params.value;
	const localRoot = normalizeWorkspaceMatchPath(params.localWorkspaceRoot);
	const remoteRoot = normalizeWorkspaceMatchPath(params.remoteWorkspaceRoot);
	const normalizedValue = normalizeWorkspaceMatchPath(params.value);
	if (!localRoot || !remoteRoot) throw new Error("Codex remoteWorkspaceRoot requires non-empty workspace roots.");
	if (normalizedValue === localRoot) return remoteRoot;
	const prefix = localRoot.endsWith("/") ? localRoot : `${localRoot}/`;
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
const CODEX_MEMORY_FLUSH_DYNAMIC_TOOL_ALLOW = /* @__PURE__ */ new Set(["read", "write"]);
function preserveRingZeroSystemAgentTool(allTools, filteredTools) {
	const openclaw = allTools.find((tool) => tool.name === "openclaw" && tool.catalogMode === "direct-only");
	if (!openclaw) return filteredTools;
	return [openclaw, ...filteredTools.filter((tool) => tool.name !== "openclaw")];
}
function resolveCodexMessageToolProvider(params) {
	return params.messageChannel ?? params.messageProvider;
}
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
function shouldWarnCodexDynamicToolBuildStageSummary(summary, profilerEnabled = false) {
	const totalWarnMs = profilerEnabled ? CODEX_DYNAMIC_TOOL_BUILD_WARN_TOTAL_MS : 1e4;
	const stageWarnMs = profilerEnabled ? CODEX_DYNAMIC_TOOL_BUILD_WARN_STAGE_MS : 5e3;
	return summary.totalMs >= totalWarnMs || summary.stages.some((stage) => stage.durationMs >= stageWarnMs);
}
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
	const toolBuildStages = createStageTimingTracker();
	const modelHasVision = params.model.input?.includes("image") ?? false;
	const agentDir = params.agentDir ?? resolveAgentDir$1(params.config ?? {}, input.sessionAgentId);
	const nativeExecutionPolicy = resolveCodexNativeExecutionPolicyForRun(params, {
		agentId: input.policyAgentId,
		runtimeSessionKey: input.sandboxSessionKey,
		sandbox: input.sandbox
	});
	const webSearchPlan = resolveCodexWebSearchPlan({
		config: params.config,
		disableTools: params.disableTools,
		nativeToolSurfaceEnabled: isCodexResponsesOAuthRun(params) || input.nativeToolSurfaceEnabled,
		nativeProviderWebSearchSupport: input.nativeProviderWebSearchSupport
	});
	const messageToolProvider = resolveCodexMessageToolProvider(params);
	const webFetchHostnameAllowlistRef = {};
	const toolConstructionPlan = resolveCodexToolConstructionPlan(input.sandbox, input.nativeToolSurfaceEnabled, params.requireWorkspaceOnly);
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
		requireWorkspaceOnly: params.requireWorkspaceOnly,
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
		memoryAudience: params.memoryAudience,
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
	const codexFilteredTools = await addShellDynamicTools(isCodexMemoryFlushRun(params) ? filterCodexMemoryFlushDynamicTools(readableAllTools) : profileFilteredTools, readableAllTools, input, nativeExecutionPolicy);
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
	const webSearchFilteredTools = webSearchPlan.suppressManagedWebSearch ? normalizedTools.filter((tool) => tool.name !== "web_search") : normalizedTools;
	const exposedTools = placeDisabledNativeShellToolsInDirectNamespace(webSearchFilteredTools, input.nativeToolSurfaceEnabled);
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
		embeddedAgentLog.warn(`codex app-server dynamic tool build timings runId=${params.runId} sessionId=${params.sessionId} phase=${phase} totalMs=${summary.totalMs} stages=${formatStageTimings(summary.stages)}`, {
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
function shouldEnableCodexAppServerNativeToolSurface(params, sandbox, options = {}) {
	if (isCodexResponsesOAuthRun(params) || params.requireWorkspaceOnly === true || params.pluginHarnessToolPolicyRestricted === true || isCodexMemoryFlushRun(params) || params.disableTools) return false;
	if (!resolveCodexNativeExecutionPolicyForRun(params, {
		agentId: options.agentId,
		runtimeSessionKey: options.runtimeSessionKey,
		sandbox
	}).nativeToolSurfaceAllowed) return false;
	const toolsAllow = params.toolsAllow;
	return (toolsAllow === void 0 || toolsAllow.some((name) => normalizeCodexDynamicToolName(name) === "*")) && canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options);
}
function resolveCodexNativeExecutionPolicyForRun(params, options = {}) {
	return resolveCodexNativeExecutionPolicy({
		config: params.config,
		sessionKey: options.runtimeSessionKey?.trim() || params.sandboxSessionKey?.trim() || params.sessionKey?.trim() || params.sessionId,
		sessionId: params.sessionId,
		agentId: options.agentId,
		execOverrides: params.execOverrides,
		sandboxAvailable: options.sandbox === null ? false : options.sandbox?.enabled,
		readRuntimeSessionEntry: true
	});
}
function canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options = {}) {
	if (!sandbox?.enabled) return true;
	return options.sandboxExecServerEnabled === true && (sandbox.backend || isCodexRemoteExecPlacementSandbox(sandbox)) && CODEX_NATIVE_TOOL_REQUIREMENTS.every((toolName) => isToolAllowed(sandbox.tools, toolName));
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
function resolveCodexSandboxEnvironmentSelection(environment, nativeToolSurfaceEnabled) {
	return nativeToolSurfaceEnabled ? environment ? [environment] : void 0 : [];
}
function resolveCodexAppServerExecutionCwd(params) {
	return mapCodexAppServerRemoteWorkspacePath({
		value: params.environment && params.nativeToolSurfaceEnabled ? params.environment.cwd : params.effectiveCwd,
		localWorkspaceRoot: params.localWorkspaceRoot,
		remoteWorkspaceRoot: params.remoteWorkspaceRoot
	});
}
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
/** Adds policy-selected shell aliases in sandbox, Gateway, then node order. */
async function addShellDynamicTools(filteredTools, allTools, input, executionPolicy) {
	if (isCodexMemoryFlushRun(input.params)) return filteredTools;
	const execTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "exec");
	if (!execTool) return filteredTools;
	const processTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "process");
	const existingNames = new Set(filteredTools.map((tool) => normalizeCodexDynamicToolName(tool.name)));
	const additions = [];
	if (executionPolicy.nativeToolSurfaceAllowed && input.sandbox?.enabled && input.sandbox.backendId.trim() && input.nativeToolSurfaceEnabled === false && !isCodexDynamicToolExcluded(input.pluginConfig, [
		"exec",
		"sandbox_exec",
		"process",
		"sandbox_process"
	])) {
		additions.push(createSandboxExecProjection(execTool));
		if (processTool) additions.push(createSandboxProcessProjection(processTool));
	}
	if (input.nativeToolSurfaceEnabled === true && input.sandbox?.enabled !== true && executionPolicy.nativeToolSurfaceAllowed && executionPolicy.effectiveExecHost === "gateway" && !isCodexDynamicToolExcluded(input.pluginConfig, ["exec", "gateway_exec"]) && !existingNames.has("gateway_exec")) {
		const processAliasAvailable = Boolean(processTool && !isCodexDynamicToolExcluded(input.pluginConfig, ["process", "gateway_process"]) && !existingNames.has("gateway_process"));
		const createProjection = resolveCodexScheduledToolProjectionFactory(input.params.hostCapabilities);
		if (createProjection) {
			additions.push(createGatewayExecProjection(createProjection, execTool, {
				processAliasAvailable,
				...input.sessionPermissionPolicy?.mode === "guarded" ? { ask: "always" } : {}
			}));
			if (processAliasAvailable && processTool) additions.push(createGatewayProcessProjection(createProjection, processTool));
		}
	}
	if ((executionPolicy.effectiveExecHost === "node" || executionPolicy.requestedExecHost === "auto" && executionPolicy.effectiveExecHost === "gateway") && !isCodexDynamicToolExcluded(input.pluginConfig, ["exec", "node_exec"]) && !existingNames.has("node_exec")) {
		const nodeExec = await createNodeExecAliasDynamicTool(execTool, executionPolicy.node, input.runAbortController.signal, input.nodeExecAvailability);
		if (nodeExec) additions.push(nodeExec);
	}
	return additions.length ? [...filteredTools, ...additions] : filteredTools;
}
function shouldKeepOpenClawShellDynamicTools(input, nodePolicy) {
	return !isCodexMemoryFlushRun(input.params) && input.nativeToolSurfaceEnabled === false && input.sandbox?.enabled !== true && nodePolicy.effectiveExecHost !== "node";
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
function shouldForceMessageTool(params) {
	return params.disableMessageTool !== true && params.sourceReplyDeliveryMode === "message_tool_only";
}
//#endregion
export { resolveCodexExternalSandboxPolicyForOpenClawSandbox as a, shouldEnableCodexAppServerNativeToolSurface as c, isCodexPassThroughMediaSource as d, mapCodexAppServerLocalWorkspacePath as f, resolveCodexAppServerHookChannelId as i, shouldRequireCodexSandboxExecServerEnvironment as l, disableCodexPluginThreadConfig as n, resolveCodexMessageToolProvider as o, mapCodexAppServerRemoteWorkspacePath as p, resolveCodexAppServerExecutionCwd as r, resolveCodexSandboxEnvironmentSelection as s, buildDynamicTools as t, shouldWarnCodexDynamicToolBuildStageSummary as u };
