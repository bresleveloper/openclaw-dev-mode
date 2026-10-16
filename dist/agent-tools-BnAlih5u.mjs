import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DBMZPbPL.mjs";
import { l as normalizeToolPolicyName, o as expandToolGroups } from "./tool-policy-shared-DWHChhWM.mjs";
import { n as createRuntimeToolMatcher } from "./tool-policy-match-Dn8gpf-E.mjs";
import { c as hasRestrictiveAllowPolicy, u as replaceWithEffectiveToolAllowlist } from "./tool-policy-BKvvmcQR.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { i as resolveGatewayMessageChannel } from "./message-channel-normalize-DeTO1ikE.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { r as isDevMode } from "./globals-BXbZ1A_g.mjs";
import { c as rewrapToolWithBeforeToolCallHook, l as wrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-C25aU-xP.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-D5wZ6Dom.mjs";
import { t as ToolAuthorizationError } from "./tool-input-error-mjW74R8m.mjs";
import { u as isCompletionReportInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { t as HEARTBEAT_RESPONSE_TOOL_NAME } from "./heartbeat-tool-response-BAjLTEaX.mjs";
import { n as copyPluginToolMeta, r as getPluginToolMeta } from "./tool-metadata-DEC0Rqn3.mjs";
import { r as finalizeAgentToolAvailability } from "./agent-tool-availability-Bgm3tNkT.mjs";
import { d as pinExecToolTarget, i as copyAgentToolMetadata, r as bindAssembledAgentToolActionDescriptor, x as isToolWrappedWithBeforeToolCallHook } from "./agent-tool-metadata-BiQWQ4ti.mjs";
import "./common-Dyxcwsy8.mjs";
import { h as wrapToolWithGatewayCallerIdentity } from "./gateway-caller-context-DWr-fdGt.mjs";
import { x as waitForExecScope } from "./bash-process-registry-BsL_e5bm.mjs";
import { n as projectEffectiveExecPolicy } from "./session-permission-exec-mode-B_8rJnOA.mjs";
import { t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-CR7_5ABm.mjs";
import { t as resolveSessionPlacementComputer } from "./session-placement-computer-Bem5hZb0.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BbWs7GzU.mjs";
import { n as resolveEventSessionRoutingPolicy } from "./event-session-routing-yXV1vWY_.mjs";
import { t as getProcessSupervisor } from "./supervisor-j9Amjrh_.mjs";
import { m as wrapToolWithAbortSignal } from "./tool-contract-error-EveBd172.mjs";
import { r as messageToolOwnsVisibleReply } from "./source-reply-delivery-mode-C0QKYTyh.mjs";
import { n as mergeGatewayAgentCliPath } from "./openclaw-cli-shim-I4WwJOH3.mjs";
import { t as appendRuntimePluginToolGrant } from "./tool-grant-allowlist-DlmDPMdD.mjs";
import { t as applyToolPolicyPipeline } from "./tool-policy-pipeline-DFP1wzZs.mjs";
import { i as resolveConversationToolPolicies, n as isConversationToolAllowed, t as buildConversationToolPolicyPipelineSteps } from "./conversation-tool-policy-pipeline-PqUansOZ.mjs";
import { t as applyToolAvailabilityDescriptions } from "./agent-tools.deferred-followup-B5rTfhz2.mjs";
import { a as resolveMemoryFlushToolSetup, i as projectMemoryFlushTools, o as warnIfMemoryFlushFileWriterUnavailable, r as assertMemoryFlushPersistenceToolAvailable, s as filterToolsByMessageProvider, t as createCoreCodingTools } from "./core-coding-tools-B4ma0cx9.mjs";
import { p as createMemoryWriteProvenanceObserver } from "./agent-tools.read-Bs0hsNfa.mjs";
import { n as resolveSandboxFileIdentity } from "./file-mutation-identity-C_-O-u-P.mjs";
import { C as filterLocalModelLeanTools, T as resolveLocalModelLeanPreserveToolNames, c as resolveToolSearchConfig, n as createToolSearchTools, v as TOOL_CALL_RAW_TOOL_NAME, x as TOOL_SEARCH_RAW_TOOL_NAME, y as TOOL_DESCRIBE_RAW_TOOL_NAME } from "./tool-search-DYbAnrfT.mjs";
import { t as resolveNativeWebSearchRoute } from "./native-web-search-Ck-iJeMC.mjs";
import { r as mergeAgentRingZeroTools, t as getActiveAgentRingZeroTools } from "./agent-tools.ring-zero-context-DcmTQndF.mjs";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-2cvMG8cQ.mjs";
import { n as listChannelAgentTools } from "./channel-tools-D2tkbara.mjs";
import { n as resolveExecToolConfig } from "./lazy-exec-tool-DaqWwvlf.mjs";
import { i as bindCronManagementGrant, n as bindActiveCronCreatorAuthorityResolver } from "./cron-creator-authority-context-aezDQHzt.mjs";
import { l as prepareGitHubToolEnvironment } from "./github-tool-identity-2S4ost1l.mjs";
import { t as createOpenClawTools, u as applySwarmCollectorToolContract, v as filterToolsByClientCaps, y as resolveOpenClawPluginToolsForOptions } from "./openclaw-tools-Dd40cGRU.mjs";
import { a as getInProcessGatewayToolContext } from "./in-process-gateway-Dcrh-ATi.mjs";
import { n as filterRequesterYieldTools } from "./openclaw-tools.requester-yield-BVTStOp5.mjs";
import { r as subagentAttachmentRootForRun } from "./subagent-attachment-paths-0g-Tlw0v.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { r as GATEWAY_OWNER_ONLY_CORE_TOOLS } from "./dangerous-tools-D5_2xo_6.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-CBwhju1Y.mjs";
import { i as replaceWithEffectiveCronCreatorToolAllowlist } from "./cron-tool-CwBBtBRr.mjs";
import { t as prepareCoreToolPolicy } from "./prepared-tool-surface-BZR5bIHj.mjs";
import { t as buildDeclaredToolAllowlistContext } from "./tool-policy-declared-context-RUtIwUST.mjs";
import { t as captureSessionPortalTarget } from "./session-portal-target-D54R2k-a.mjs";
import { normalizeToolParameterSchema } from "@openclaw/ai/internal/tool-schema";
//#region src/agents/agent-tools.caller.ts
/** Carries the coding surface's prepared policy and requesting route into plugin delegation. */
function createCodingToolsGatewayCaller(params) {
	const { options, agentId, sessionKey, capabilityProfile } = params;
	const settleBatch = capabilityProfile.policy.requesterPolicySource === "completion-handoff" ? options?.trustedInternalHandoff?.settleBatch : void 0;
	const identity = options && agentId && sessionKey?.trim() ? {
		agentId,
		sessionKey: sessionKey.trim(),
		receiptAuthority: settleBatch?.isCurrent,
		receiptAdmissions: settleBatch?.receiptAdmission ? [settleBatch.receiptAdmission] : void 0,
		assertToolAllowed: (toolName) => {
			if (!isConversationToolAllowed(capabilityProfile, toolName)) throw new Error(`${toolName} is not allowed by this conversation's tool policy`);
		},
		...options.abortSignal ? { approvalSignals: [options.abortSignal] } : {},
		turnSourceChannel: resolveGatewayMessageChannel(options.messageChannel ?? options.messageProvider),
		turnSourceTo: options.currentMessagingTarget ?? options.currentChannelId ?? options.messageTo,
		turnSourceAccountId: params.accountId,
		turnSourceThreadId: options.currentThreadTs ?? options.messageThreadId
	} : void 0;
	return (tool) => wrapToolWithGatewayCallerIdentity(tool, identity);
}
//#endregion
//#region src/agents/agent-tools.schema.ts
/**
* Tool schema normalization wrappers.
* Applies provider-compatible parameter schema cleanup while preserving
* identity-backed metadata on normalized tools.
*/
function isObjectSchemaWithNoRequiredParams(schema) {
	if (!schema || typeof schema !== "object" || Array.isArray(schema)) return false;
	const record = schema;
	const type = record.type;
	if (!(type === "object" || Array.isArray(type) && type.some((entry) => entry === "object"))) return false;
	return !schemaHasRequiredParams(record);
}
function schemaHasRequiredParams(schema) {
	if (Array.isArray(schema.required) && schema.required.length > 0) return true;
	for (const key of [
		"allOf",
		"anyOf",
		"oneOf"
	]) {
		const variants = schema[key];
		if (!Array.isArray(variants)) continue;
		if (variants.some((variant) => variant !== null && typeof variant === "object" && !Array.isArray(variant) && schemaHasRequiredParams(variant))) return true;
	}
	return false;
}
/** Normalize a tool's parameter schema for the selected provider/model. */
function normalizeToolParameters(tool, options) {
	const schema = tool.parameters && typeof tool.parameters === "object" ? tool.parameters : void 0;
	if (!schema) return tool;
	const parameters = normalizeToolParameterSchema(schema, options);
	const normalized = {
		...tool,
		parameters
	};
	if (isObjectSchemaWithNoRequiredParams(parameters)) normalized.prepareArguments = (args) => {
		const prepared = tool.prepareArguments ? tool.prepareArguments(args) : args;
		return prepared === null || prepared === void 0 ? {} : prepared;
	};
	return copyAgentToolMetadata(tool, normalized);
}
//#endregion
//#region src/agents/agent-tools.finalize.ts
function finalizeAgentTools(options) {
	finalizeAgentToolAvailability(options.tools, { beforeNormalization: true });
	const normalized = options.tools.map((tool) => normalizeToolParameters(tool, {
		modelProvider: options.modelProvider,
		modelId: options.modelId,
		modelCompat: options.modelCompat
	}));
	options.recordToolPrepStage?.("schema-normalization");
	const hookOptions = {
		emitDiagnostics: options.emitBeforeToolCallDiagnostics,
		...options.approvalMode ? { approvalMode: options.approvalMode } : {}
	};
	const withHooks = options.wrapBeforeToolCallHook === false ? normalized : normalized.map((tool) => typeof options.wrapBeforeToolCallHook === "function" && !options.wrapBeforeToolCallHook(tool) ? tool : isToolWrappedWithBeforeToolCallHook(tool) ? rewrapToolWithBeforeToolCallHook(tool, options.hookContext, hookOptions) : wrapToolWithBeforeToolCallHook(tool, options.hookContext, hookOptions));
	options.recordToolPrepStage?.("tool-hooks");
	const abortSignal = options.abortSignal;
	const withAbort = abortSignal ? withHooks.map((tool) => wrapToolWithAbortSignal(tool, abortSignal)) : withHooks;
	options.recordToolPrepStage?.("abort-wrappers");
	const finalized = applyToolAvailabilityDescriptions(withAbort);
	options.recordToolPrepStage?.("deferred-followup-descriptions");
	return finalized;
}
//#endregion
//#region src/agents/agent-tools.model-provider-policy.ts
function applyModelProviderToolPolicy(toolsInput, params) {
	const tools = filterLocalModelLeanTools({
		tools: toolsInput,
		config: params?.config,
		agentId: params?.agentId,
		sessionKey: params?.sessionKey,
		preserveToolNames: params?.localModelLeanPreserveToolNames ?? params?.runtimeToolAllowlist
	});
	if (params?.suppressManagedWebSearch !== false && resolveNativeWebSearchRoute({
		config: params?.config,
		modelProvider: params?.modelProvider,
		modelApi: params?.modelApi,
		modelBaseUrl: params?.modelBaseUrl,
		modelId: params?.modelId,
		agentId: params?.agentId,
		sessionKey: params?.sessionKey,
		agentDir: params?.agentDir,
		runtimeToolAllowlist: params?.runtimeToolAllowlist,
		pluginMetadataSnapshot: params?.preparedModelRuntime?.metadataSnapshot
	}).kind === "native") return tools.filter((tool) => tool.name !== "web_search");
	return tools;
}
//#endregion
//#region src/agents/delegation-capability.ts
const log = createSubsystemLogger("agents/delegation-capability");
const NEW_DELEGATION_TOOL_NAMES = /* @__PURE__ */ new Set([
	"codex_session_send",
	"llm-task",
	"openclaw",
	"sessions_send",
	"sessions_spawn"
]);
const REPORT_ONLY_TOOL_ACTIONS = /* @__PURE__ */ new Map([
	[AUTOMATIONS_TOOL_NAME, /* @__PURE__ */ new Set([
		"get",
		"list",
		"remove",
		"runs",
		"status"
	])],
	["image_generate", /* @__PURE__ */ new Set(["list", "status"])],
	["music_generate", /* @__PURE__ */ new Set(["list", "status"])],
	["video_generate", /* @__PURE__ */ new Set(["list", "status"])]
]);
const REPORT_ONLY_ERROR = "New delegation is unavailable while reporting a completion through a fallback model.";
function resolveDelegationCapability(params) {
	if (!isCompletionReportInputProvenance(params.inputProvenance)) return "full";
	if (params.fallbackActive || params.disableTools === true) return "report_only";
	if (params.toolsAllow === void 0) return "full";
	return [...NEW_DELEGATION_TOOL_NAMES].some(createRuntimeToolMatcher(params.toolsAllow)) ? "full" : "report_only";
}
function readToolAction(params) {
	if (!params || typeof params !== "object" || Array.isArray(params)) return "";
	const action = params.action;
	return typeof action === "string" ? action.trim().toLowerCase() : "";
}
function wrapReportOnlyTool(tool, allowedActions) {
	const wrapped = new Proxy(tool, { get(target, property, receiver) {
		if (property !== "execute") return Reflect.get(target, property, receiver);
		return async (toolCallId, params, signal, onUpdate) => {
			if (!allowedActions.has(readToolAction(params))) throw new ToolAuthorizationError(REPORT_ONLY_ERROR);
			return await target.execute(toolCallId, params, signal, onUpdate);
		};
	} });
	copyPluginToolMeta(tool, wrapped);
	return wrapped;
}
/**
* Enforces the run's delegation capability after ordinary tool authorization.
* Tool names and safe actions here are explicit built-in/plugin contracts: the
* gate removes task launchers while retaining status, history, and cleanup.
*/
function applyDelegationCapability(tools, capability) {
	if (capability !== "report_only") return tools;
	const removed = [];
	const narrowed = [];
	const gated = tools.flatMap((tool) => {
		const name = normalizeToolPolicyName(tool.name);
		if (NEW_DELEGATION_TOOL_NAMES.has(name)) {
			removed.push(name);
			return [];
		}
		const allowedActions = REPORT_ONLY_TOOL_ACTIONS.get(name);
		if (!allowedActions) return [tool];
		narrowed.push(name);
		return [wrapReportOnlyTool(tool, allowedActions)];
	});
	if (removed.length > 0 || narrowed.length > 0) log.debug("delegation capability restricted run tools", {
		removed,
		narrowed
	});
	return gated;
}
//#endregion
//#region src/agents/scheduled-message-invocation.ts
/** Admit each new invocation against published policy without changing an accepted invocation. */
function createScheduledMessageInvocationAdmission(params) {
	let cached;
	return () => {
		const config = getRuntimeConfigSnapshot() ?? params.config;
		if (!config) throw new Error("Scheduled message tools require an active runtime configuration.");
		if (cached?.config !== config) cached = {
			config,
			allowed: params.isAllowed(config)
		};
		if (!cached.allowed) throw new Error("Scheduled message invocation is not allowed by the current tool policy.");
		return config;
	};
}
/** Reuse the assembled embedded catalog and resource ceilings for prospective message policy. */
function createEmbeddedMessageInvocationPolicy(params) {
	const policies = resolveConversationToolPolicies({
		capabilityProfile: params.capabilityProfile,
		additionalProfileAllow: params.runtimeProfileAlsoAllow,
		additionalPolicyAllow: params.toolSearchControlAllowlist
	});
	const filter = (currentProfile = params.capabilityProfile, onFilter) => {
		const currentPolicies = currentProfile === params.capabilityProfile ? policies : resolveConversationToolPolicies({
			capabilityProfile: currentProfile,
			additionalProfileAllow: params.runtimeProfileAlsoAllow,
			additionalPolicyAllow: params.toolSearchControlAllowlist
		});
		const { tools, declaredToolAllowlist, unavailableCoreToolReason } = params.catalog();
		return applyToolPolicyPipeline({
			tools,
			toolMeta: (tool) => getPluginToolMeta(tool),
			warn: logWarn,
			steps: buildConversationToolPolicyPipelineSteps({
				capabilityProfile: currentProfile,
				policies: {
					...currentPolicies,
					groupPolicy: policies.groupPolicy,
					senderPolicy: policies.senderPolicy,
					sandboxPolicy: policies.sandboxPolicy,
					subagentPolicy: policies.subagentPolicy,
					runtimeToolPolicy: policies.runtimeToolPolicy,
					inheritedToolPolicy: policies.inheritedToolPolicy
				},
				additionalStepsAfterSandbox: [{
					policy: params.ownerOnlyCoreToolPolicy,
					source: { kind: "session" },
					label: "gateway sender owner-only tools",
					unavailableCoreToolReason
				}],
				includeRuntimeToolPolicy: true,
				unavailableCoreToolReason
			}),
			declaredToolAllowlist,
			onFilter
		});
	};
	return {
		filter,
		admit: createScheduledMessageInvocationAdmission({
			config: params.config,
			isAllowed: (config) => {
				const profile = params.capabilityProfile;
				const currentProfile = config === params.config ? profile : resolveConversationCapabilityProfile({
					...profile.conversation,
					config,
					agentId: profile.policy.agentId,
					sessionKey: profile.policy.sessionKey,
					agentAccountId: profile.serviceIdentity.accountId,
					modelProvider: profile.model.provider,
					modelId: profile.model.id,
					senderIsOwner: profile.sender.isOwner,
					scheduledToolPolicy: params.scheduledToolPolicy,
					runtimePluginToolGrant: profile.policy.runtimePluginToolGrant,
					pluginMetadataSnapshot: params.pluginMetadataSnapshot
				});
				return params.isAvailable() && filter(currentProfile).some((tool) => tool.name === "message");
			}
		})
	};
}
//#endregion
//#region src/agents/tools/session-portal-target.ts
function prepareSessionPortalToolAccess(input) {
	const sessionPortalTarget = input.senderIsOwner === false && !input.sandboxed ? prepareSessionPortalToolTarget(input) : void 0;
	const ownerOnlyCoreToolDenylist = input.senderIsOwner === false ? GATEWAY_OWNER_ONLY_CORE_TOOLS.filter((name) => (name !== "portal" || !sessionPortalTarget) && name !== "sessions" && (name !== "automations" || !input.hasAutomationGrant)) : [];
	return {
		sessionPortalTarget,
		ownerOnlyCoreToolDenylist,
		ownerOnlyCoreToolPolicy: ownerOnlyCoreToolDenylist.length ? { deny: ownerOnlyCoreToolDenylist } : void 0
	};
}
/** Availability uses resident execution facts; the scoped RPC still authorizes every call. */
function prepareSessionPortalToolTarget(input) {
	if (!input.sessionId || !input.sessionKey || !input.agentId) return;
	const context = getInProcessGatewayToolContext();
	const environments = context?.workerEnvironmentService;
	const projection = getSessionRowProjection(context);
	const query = {
		agentId: input.agentId,
		key: input.sessionKey
	};
	const readCurrentTarget = () => {
		const row = projection?.capture(query);
		const state = projection?.sharingTargetState(query);
		if (!row?.storedEntry || row.unresolvedDatabaseFacts || !projection?.isCurrent(row) || state?.status !== "ready" || state.target.generation !== row.generation || state.target.agentId !== row.agentId || state.target.canonicalKey !== row.key || state.target.storePath !== row.storeTarget.storePath || state.target.entry.sessionId !== row.storedEntry.sessionId || state.target.entry.lifecycleRevision !== row.storedEntry.lifecycleRevision || row.storedEntry.modelSelectionLocked === true) return;
		return state.target;
	};
	const row = readCurrentTarget();
	const generation = row?.generation;
	const record = row && {
		agentId: row.agentId,
		sessionKey: row.canonicalKey,
		sessionId: row.entry.sessionId,
		sessionLifecycleRevision: row.entry.lifecycleRevision
	};
	if (!context?.portalService || !environments || !record || record.sessionKey !== input.sessionKey || record.agentId !== input.agentId || record.sessionId !== input.sessionId) return;
	try {
		const target = captureSessionPortalTarget(environments, record);
		return {
			sessionKey: record.sessionKey,
			agentId: record.agentId,
			environmentId: target.binding.environmentId,
			assertCurrent: () => {
				if (getInProcessGatewayToolContext() !== context) throw new Error("Session preview belongs to a different or retired Gateway");
				const current = readCurrentTarget();
				if (!current || current.generation !== generation || current.entry.sessionId !== record.sessionId || current.entry.lifecycleRevision !== record.sessionLifecycleRevision) throw new Error("Conversation preview policy or session identity changed");
				target.assertCurrent();
			}
		};
	} catch {
		return;
	}
}
//#endregion
//#region src/agents/agent-tools.ts
/** Internal preparation data stays outside the public harness factory options. */
function createOpenClawCodingToolsInternal(options, skillReadResources, onPolicyFilter, preparedSurface) {
	const preparedTools = preparedSurface?.tools;
	const sandbox = options?.sandbox?.enabled ? options.sandbox : void 0;
	const { isMemoryFlushRun, memoryFlush, memoryFlushWritePath } = resolveMemoryFlushToolSetup(options);
	const cronSelfRemoveOnlyJobId = options?.trigger === "cron" && options.jobId?.trim() ? options.jobId.trim() : void 0;
	const capabilityProfile = options?.conversationCapabilityProfile ?? resolveConversationCapabilityProfile({
		...options,
		agentId: options?.policyAgentId ?? options?.agentId,
		sandboxToolPolicy: sandbox?.tools,
		pluginMetadataSnapshot: options?.preparedModelRuntime?.metadataSnapshot
	});
	const { agentId, runtimePluginToolGrant } = capabilityProfile.policy;
	const executionAgentId = options?.agentId ?? (options?.runSessionKey ? resolveSessionAgentId({
		config: options.config,
		sessionKey: options.runSessionKey
	}) : agentId);
	const executionSessionKey = options?.runSessionKey ?? options?.sessionKey;
	const attachmentReadRoot = subagentAttachmentRootForRun(executionAgentId, executionSessionKey);
	const enableHeartbeatTool = options?.enableHeartbeatTool === true || options?.trigger === "heartbeat" && options?.config?.messages?.visibleReplies === "message_tool";
	const forceHeartbeatTool = options?.forceHeartbeatTool === true || enableHeartbeatTool;
	const toolSearchConfig = resolveToolSearchConfig(options?.config);
	const toolSearchControlsEnabled = options?.includeToolSearchControls === true && toolSearchConfig.enabled;
	const toolSearchControlAllowlist = toolSearchControlsEnabled ? [
		TOOL_SEARCH_RAW_TOOL_NAME,
		TOOL_DESCRIBE_RAW_TOOL_NAME,
		TOOL_CALL_RAW_TOOL_NAME
	] : [];
	const runtimeToolAllowlistIncludesMessage = expandToolGroups(options?.runtimeToolAllowlist ?? []).some((toolName) => {
		const normalized = normalizeToolPolicyName(toolName);
		return normalized === "*" || normalized === "message";
	});
	const sourceReplyOnly = capabilityProfile.policy.requesterPolicySource === "completion-handoff" && options?.sourceReplyDeliveryMode === "message_tool_only";
	const localModelLeanPreserveToolNames = resolveLocalModelLeanPreserveToolNames({
		toolNames: capabilityProfile.policy.explicitToolOverrideAllowlist,
		forceMessageTool: options?.forceMessageTool,
		sourceReplyDeliveryMode: options?.sourceReplyDeliveryMode
	});
	const runtimeProfileAlsoAllow = [
		...options && messageToolOwnsVisibleReply(options) ? ["message"] : [],
		...runtimeToolAllowlistIncludesMessage ? ["message"] : [],
		...forceHeartbeatTool ? [HEARTBEAT_RESPONSE_TOOL_NAME] : [],
		...toolSearchControlAllowlist
	];
	const sandboxWorkspaceMediaReadAllowed = isConversationToolAllowed(capabilityProfile, "read");
	const scopeKey = resolveProcessToolScopeKey({
		scopeKey: options?.exec?.scopeKey,
		sessionKey: executionSessionKey,
		sessionId: options?.sessionId,
		agentId: executionAgentId
	});
	if (options?.oneShotCliRun && scopeKey && options.registerRunCleanup) {
		const cleanupScope = getProcessSupervisor().acquireScopeCleanup(scopeKey, { processTree: "owned-only" });
		options.registerRunCleanup(async () => {
			const failed = (await Promise.allSettled([cleanupScope(), waitForExecScope(scopeKey)])).find((result) => result.status === "rejected");
			if (failed) throw failed.reason;
		});
	}
	options?.recordToolPrepStage?.("tool-policy");
	const execConfig = resolveExecToolConfig({
		cfg: options?.config,
		agentId
	});
	const execRuntimeConfig = options?.exec?.config ?? options?.config;
	const preparedRunEnvironment = preparedTools === void 0 && execRuntimeConfig && executionAgentId ? prepareGitHubToolEnvironment({
		config: execRuntimeConfig,
		sourceConfig: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig,
		agentId: executionAgentId
	}) : void 0;
	const sessionPermissionPolicy = options?.sessionPermissionPolicy;
	const coreToolPolicy = preparedSurface?.policy ?? prepareCoreToolPolicy({
		...options,
		agentId
	}, execConfig);
	const sandboxRoot = sandbox?.workspaceDir;
	const sandboxFsBridge = sandbox?.fsBridge;
	const allowWorkspaceWrites = sandbox?.workspaceAccess !== "ro";
	const workspaceRoot = capabilityProfile.workspace.workspaceRoot;
	const runtimeRoot = capabilityProfile.workspace.runtimeRoot;
	const codingRoot = sandboxRoot ?? runtimeRoot;
	const containmentRoot = sandboxRoot ?? sessionPermissionPolicy?.root ?? codingRoot;
	const memoryFlushWriteRoot = sandboxRoot ?? workspaceRoot;
	const memoryWriteProvenance = createMemoryWriteProvenanceObserver({
		mutationRoot: sandboxRoot ?? workspaceRoot,
		workspaceDir: sandboxRoot ?? workspaceRoot,
		resolvePath: sandboxFsBridge ? (filePath) => resolveSandboxFileIdentity({
			bridge: sandboxFsBridge,
			filePath,
			cwd: sandboxRoot,
			signal: options?.abortSignal
		}) : void 0,
		resolveOriginClass: () => options?.senderIsOwner === false || options?.isTurnTainted?.() === true ? "untrusted" : "agent",
		sessionId: options?.sessionId,
		sessionKey: options?.runSessionKey ?? options?.sessionKey
	});
	const includeCoreTools = options?.includeCoreTools !== false;
	const toolConstructionPlan = options?.toolConstructionPlan ?? {
		includeBaseCodingTools: includeCoreTools,
		includeShellTools: includeCoreTools,
		includeChannelTools: includeCoreTools,
		includeOpenClawTools: includeCoreTools,
		includePluginTools: true
	};
	const includeBaseCodingTools = includeCoreTools && toolConstructionPlan.includeBaseCodingTools;
	const includeShellTools = includeCoreTools && toolConstructionPlan.includeShellTools;
	const includeOpenClawTools = includeCoreTools && toolConstructionPlan.includeOpenClawTools;
	const includeChannelTools = toolConstructionPlan.includeChannelTools;
	const includePluginTools = toolConstructionPlan.includePluginTools;
	const fsPolicy = {
		workspaceOnly: coreToolPolicy.workspaceOnly,
		...sessionPermissionPolicy ? { root: sessionPermissionPolicy.root } : {},
		...attachmentReadRoot ? { readOnlyRoots: [attachmentReadRoot] } : {}
	};
	options?.recordToolPrepStage?.("workspace-policy");
	const execDefaults = options?.exec ?? {};
	const scheduledExecTarget = options?.scheduledToolPolicy?.execTarget;
	const effectiveExecPolicy = projectEffectiveExecPolicy({
		base: execConfig,
		overrides: options?.exec,
		permissionPolicy: sessionPermissionPolicy,
		scheduledExecTarget
	});
	const coreTools = preparedTools === void 0 ? createCoreCodingTools({
		abortSignal: options?.abortSignal,
		attachmentReadRoot,
		codingRoot,
		containmentRoot,
		includeBaseCodingTools,
		shellTools: includeShellTools ? "full" : "disabled",
		...coreToolPolicy,
		sandbox,
		skillsSnapshot: options?.skillsSnapshot,
		skillReadResources,
		skillInstructionPaths: options?.skillUsagePaths?.map((entry) => entry.readPath),
		skillInstructionDeliveryCache: options?.skillInstructionDeliveryCache,
		memoryWriteProvenance,
		execDefaults: {
			...execDefaults,
			...effectiveExecPolicy,
			config: execRuntimeConfig,
			preparedRunEnvironment,
			reviewer: options?.exec?.reviewer ?? execConfig.reviewer,
			reviewTranscript: options?.exec?.reviewTranscript,
			trigger: options?.trigger,
			node: options?.exec?.node ?? execConfig.node,
			pathPrepend: mergeGatewayAgentCliPath(options?.exec?.pathPrepend ?? execConfig.pathPrepend),
			safeBins: options?.exec?.safeBins ?? execConfig.safeBins,
			strictInlineEval: options?.exec?.strictInlineEval ?? execConfig.strictInlineEval,
			commandHighlighting: options?.exec?.commandHighlighting ?? execConfig.commandHighlighting,
			safeBinTrustedDirs: options?.exec?.safeBinTrustedDirs ?? execConfig.safeBinTrustedDirs,
			safeBinProfiles: options?.exec?.safeBinProfiles ?? execConfig.safeBinProfiles,
			agentId,
			cleanupMs: options?.exec?.cleanupMs ?? execConfig.cleanupMs,
			scopeKey,
			sessionKey: options?.sessionKey,
			runId: options?.runId,
			operationalRunInstance: options?.operationalRunInstance,
			runSessionKey: executionSessionKey,
			sessionId: options?.sessionId,
			sessionStore: options?.config?.session?.store,
			eventRouting: resolveEventSessionRoutingPolicy({
				cfg: options?.config,
				sessionKey: options?.runSessionKey ?? options?.sessionKey,
				channel: options?.messageProvider,
				accountId: options?.agentAccountId
			}),
			messageProvider: options?.messageProvider,
			currentChannelId: options?.currentChannelId,
			currentThreadTs: options?.currentThreadTs,
			channelContext: options?.channelContext,
			accountId: options?.agentAccountId,
			approvalReviewerDeviceId: options?.approvalReviewerDeviceId,
			nonInteractiveApproval: options?.swarmCollector,
			backgroundMs: options?.exec?.backgroundMs ?? execConfig.backgroundMs,
			timeoutSec: options?.exec?.timeoutSec ?? execConfig.timeoutSec,
			approvalRunningNoticeMs: options?.exec?.approvalRunningNoticeMs ?? execConfig.approvalRunningNoticeMs,
			notifyOnExit: options?.exec?.notifyOnExit ?? execConfig.notifyOnExit,
			notifyOnExitEmptySuccess: options?.exec?.notifyOnExitEmptySuccess ?? execConfig.notifyOnExitEmptySuccess
		},
		processDefaults: { scopeKey },
		recordToolPrepStage: options?.recordToolPrepStage
	}) : [];
	const cronCreatorAuthorityResolver = bindActiveCronCreatorAuthorityResolver(options?.runId);
	const cronManagementGrant = bindCronManagementGrant(options?.runId);
	const { sessionPortalTarget, ownerOnlyCoreToolDenylist, ownerOnlyCoreToolPolicy } = prepareSessionPortalToolAccess({
		sessionKey: executionSessionKey,
		agentId: executionAgentId,
		sessionId: options?.sessionId,
		senderIsOwner: options?.senderIsOwner,
		sandboxed: Boolean(sandbox),
		hasAutomationGrant: Boolean(cronCreatorAuthorityResolver || cronManagementGrant)
	});
	const pluginToolAllowlist = appendRuntimePluginToolGrant(capabilityProfile.policy.explicitToolAllowlist, runtimePluginToolGrant);
	const pluginToolDenylist = [...capabilityProfile.policy.explicitToolDenylist, ...ownerOnlyCoreToolDenylist];
	const inheritedToolDenylist = [...pluginToolDenylist];
	const inheritedToolAllowlist = options?.inheritedToolAllowlistRef ?? [];
	const shouldInheritEffectiveToolAllowlist = capabilityProfile.policy.inheritancePolicies.some(hasRestrictiveAllowPolicy);
	const cronCreatorToolAllowlist = options?.cronCreatorToolAllowlistRef ?? [];
	const gatewayCaller = resolveScheduledToolCallerContext({
		scheduledToolPolicy: options?.scheduledToolPolicy,
		accountId: options?.agentAccountId,
		channel: resolveGatewayMessageChannel(options?.messageChannel ?? options?.messageProvider)
	});
	const wrapGatewayCaller = createCodingToolsGatewayCaller({
		options,
		agentId: executionAgentId,
		sessionKey: executionSessionKey,
		accountId: gatewayCaller.accountId,
		capabilityProfile
	});
	const pluginToolOptions = {
		...options,
		agentSessionKey: options?.sessionKey,
		agentChannel: resolveGatewayMessageChannel(options?.messageChannel ?? options?.messageProvider),
		agentTo: options?.messageTo,
		agentThreadId: options?.messageThreadId,
		workspaceDir: workspaceRoot,
		fsPolicy,
		requesterSenderId: options?.senderId,
		memoryFlush,
		sandboxBrowserBridgeUrl: sandbox?.browser?.bridgeUrl,
		allowHostBrowserControl: sandbox ? sandbox.browserAllowHostControl : true,
		sandboxed: Boolean(sandbox),
		pluginToolAllowlist,
		pluginToolDenylist,
		disableMessageTool: options?.disableMessageTool || options?.swarmCollector,
		requesterAgentIdOverride: executionAgentId
	};
	const pluginToolsOnly = filterToolsByClientCaps(includeOpenClawTools || !includePluginTools ? [] : resolveOpenClawPluginToolsForOptions({
		options: pluginToolOptions,
		resolvedConfig: options?.config
	}), options?.clientCaps);
	const ringZeroTools = includeOpenClawTools && !isMemoryFlushRun ? getActiveAgentRingZeroTools() : [];
	const toolSearchTools = toolSearchControlsEnabled && ringZeroTools.length === 0 ? createToolSearchTools({
		...options,
		runtimeConfig: options?.config,
		agentId,
		catalogRef: options?.toolSearchCatalogRef,
		executeTool: options?.toolSearchCatalogExecutor
	}) : [];
	const scheduledCoreTools = scheduledExecTarget ? coreTools.map((tool) => tool.name === "exec" ? copyAgentToolMetadata(tool, pinExecToolTarget(tool, scheduledExecTarget)) : tool) : coreTools;
	const messageInvocationPolicy = createEmbeddedMessageInvocationPolicy({
		config: options?.config,
		capabilityProfile,
		runtimeProfileAlsoAllow,
		toolSearchControlAllowlist,
		scheduledToolPolicy: options?.scheduledToolPolicy,
		pluginMetadataSnapshot: options?.preparedModelRuntime?.metadataSnapshot,
		ownerOnlyCoreToolPolicy,
		catalog: () => ({
			tools: toolsForModelProvider,
			declaredToolAllowlist,
			unavailableCoreToolReason
		}),
		isAvailable: () => authorizedTools.some((tool) => tool.name === "message")
	});
	const assembledTools = [
		...scheduledCoreTools,
		...includeChannelTools ? listChannelAgentTools({ cfg: options?.config }) : [],
		...includeOpenClawTools ? mergeAgentRingZeroTools(ringZeroTools, createOpenClawTools({
			...pluginToolOptions,
			sessionPortalTarget,
			sandboxSessionRenameOnly: capabilityProfile.policy.sandboxSessionRenameOnly,
			sessionPermissionPolicy,
			execSession: sessionPermissionPolicy ? { permissionMode: sessionPermissionPolicy.mode } : void 0,
			execOverrides: {
				host: effectiveExecPolicy.host,
				mode: effectiveExecPolicy.mode,
				security: effectiveExecPolicy.security,
				ask: effectiveExecPolicy.ask,
				node: options?.exec?.node ?? execConfig.node
			},
			approvalReviewerDeviceIds: options?.approvalReviewerDeviceId ? [options.approvalReviewerDeviceId] : void 0,
			gatewayCallerAccountId: gatewayCaller.accountId,
			gatewayCallerChannel: gatewayCaller.channel,
			gatewayCallerLocal: gatewayCaller.local,
			gatewayCallerScheduled: gatewayCaller.scheduled,
			admitScheduledMessageInvocation: options?.messageActionTurnCapability ? messageInvocationPolicy.admit : void 0,
			agentGroupId: options?.groupId ?? null,
			agentGroupChannel: options?.groupChannel ?? null,
			agentGroupSpace: options?.groupSpace ?? null,
			agentMemberRoleIds: options?.memberRoleIds,
			sandboxRoot,
			sandboxContainerWorkdir: sandbox?.containerWorkdir,
			sandboxFsBridge,
			sandboxReadOnlyResourceMounts: sandbox?.readOnlyResourceMounts,
			sandboxWorkspaceMediaReadAllowed,
			spawnWorkspaceDir: capabilityProfile.workspace.spawnWorkspaceRoot,
			cwd: sandbox ? capabilityProfile.workspace.spawnWorkspaceRoot ?? runtimeRoot : runtimeRoot,
			gatewayConfigReadAllowed: capabilityProfile.policy.gatewayConfigReadAllowed,
			cronCreatorToolAllowlist,
			cronCreatorToolAllowlistCaptureRef: options?.cronCreatorToolAllowlistCaptureRef,
			resolveCronCreatorToolAuthority: cronCreatorAuthorityResolver,
			currentChatType: options?.chatType,
			computerTransport: options?.computerTransport === null ? null : options?.computerTransport ?? resolveSessionPlacementComputer(options?.operationalRunInstance),
			sourceReplyOnly,
			enableHeartbeatTool,
			disablePluginTools: !includePluginTools,
			wrapBeforeToolCallHook: false,
			...cronSelfRemoveOnlyJobId ? { cronSelfRemoveOnlyJobId } : {},
			inheritedToolAllowlist,
			inheritedToolDenylist,
			processScopeKey: scopeKey
		})) : pluginToolsOnly,
		...toolSearchTools
	];
	options?.recordToolPrepStage?.("openclaw-tools");
	const tools = preparedTools ? [...new Map([...assembledTools, ...preparedTools].map((tool) => [tool.name, tool])).values()] : assembledTools;
	const swarmStructuredOutputTool = options?.swarmCollector && options.swarmOutputSchema ? tools.find((tool) => tool.name === "structured_output") : void 0;
	const toolsForMemoryFlush = projectMemoryFlushTools(tools, isMemoryFlushRun && memoryFlushWritePath ? {
		root: memoryFlushWriteRoot,
		relativePath: memoryFlushWritePath,
		memoryWriteProvenance,
		containerWorkdir: sandbox?.containerWorkdir,
		sandbox: sandboxRoot && sandboxFsBridge ? {
			root: sandboxRoot,
			bridge: sandboxFsBridge
		} : void 0
	} : isMemoryFlushRun ? options?.memoryFlushTools : void 0);
	const unavailableCoreToolReason = isMemoryFlushRun && memoryFlushWritePath ? "memory-triggered compaction runs expose only read and append-only write" : void 0;
	const toolsForMessageProvider = isDevMode() ? toolsForMemoryFlush : filterToolsByMessageProvider(toolsForMemoryFlush, options?.toolPolicyMessageProvider ?? options?.messageProvider);
	options?.recordToolPrepStage?.("message-provider-policy");
	const toolsForModelProvider = applyModelProviderToolPolicy(toolsForMessageProvider, {
		...options,
		agentId,
		localModelLeanPreserveToolNames
	});
	options?.recordToolPrepStage?.("model-provider-policy");
	const declaredToolAllowlist = buildDeclaredToolAllowlistContext({
		config: options?.config,
		metadataSnapshot: options?.preparedModelRuntime?.metadataSnapshot,
		workspaceDir: workspaceRoot,
		toolDenylist: pluginToolDenylist
	});
	const subagentFiltered = messageInvocationPolicy.filter(capabilityProfile, onPolicyFilter);
	const authorizedTools = applySwarmCollectorToolContract(applyDelegationCapability(mergeAgentRingZeroTools(ringZeroTools, subagentFiltered), options?.delegationCapability), {
		swarmCollector: options?.swarmCollector,
		structuredOutputTool: swarmStructuredOutputTool
	});
	assertMemoryFlushPersistenceToolAvailable(authorizedTools, options?.memoryFlushTools);
	authorizedTools.forEach(bindAssembledAgentToolActionDescriptor);
	if (shouldInheritEffectiveToolAllowlist) replaceWithEffectiveToolAllowlist(inheritedToolAllowlist, authorizedTools);
	replaceWithEffectiveCronCreatorToolAllowlist(cronCreatorToolAllowlist, authorizedTools, (tool) => getPluginToolMeta(tool));
	warnIfMemoryFlushFileWriterUnavailable({
		tools: authorizedTools,
		relativePath: memoryFlushWritePath,
		messageProvider: options?.toolPolicyMessageProvider ?? options?.messageProvider
	});
	options?.recordToolPrepStage?.("authorization-policy");
	const turnSourceChannel = options?.messageChannel ?? options?.messageProvider;
	const turnSourceTo = options?.currentMessagingTarget ?? options?.currentChannelId;
	const requester = {
		...turnSourceChannel ? { channel: turnSourceChannel } : {},
		...options?.agentAccountId ? { accountId: options.agentAccountId } : {},
		...options?.senderId ? { senderId: options.senderId } : {},
		...options?.senderIsOwner !== void 0 ? { senderIsOwner: options.senderIsOwner } : {},
		...options?.memberRoleIds?.length ? { roleIds: [...options.memberRoleIds] } : {}
	};
	const hasRequester = Object.keys(requester).length > 0;
	const hookContext = {
		agentId: executionAgentId,
		...options?.config ? { config: options.config } : {},
		cwd: codingRoot,
		workspaceDir: workspaceRoot,
		...options?.skillsSnapshot ? { skillsSnapshot: options.skillsSnapshot } : {},
		...options?.skillUsagePaths ? { skillUsagePaths: options.skillUsagePaths } : {},
		...sandboxRoot && sandboxFsBridge && allowWorkspaceWrites ? { sandbox: {
			root: sandboxRoot,
			bridge: sandboxFsBridge
		} } : {},
		sessionKey: executionSessionKey,
		sessionId: options?.sessionId,
		runId: options?.runId,
		trigger: options?.trigger,
		approvalReviewerDeviceId: options?.approvalReviewerDeviceId,
		channelId: options?.hookChannelId ?? options?.currentChannelId,
		...hasRequester ? { requester } : {},
		...turnSourceChannel ? { turnSourceChannel } : {},
		...turnSourceTo ? { turnSourceTo } : {},
		...options?.agentAccountId ? { turnSourceAccountId: options.agentAccountId } : {},
		...options?.currentThreadTs ? { turnSourceThreadId: options.currentThreadTs } : {},
		...options?.trace ? { trace: options.trace } : {},
		loopDetection: resolveToolLoopDetectionConfig({
			cfg: options?.config,
			agentId
		}),
		onToolOutcome: options?.onToolOutcome,
		allocateToolOutcomeOrdinal: options?.allocateToolOutcomeOrdinal
	};
	return finalizeAgentTools({
		...options,
		tools: filterRequesterYieldTools(authorizedTools, executionSessionKey),
		wrapBeforeToolCallHook: preparedTools ? (tool) => options?.wrapBeforeToolCallHook !== false && !preparedTools.some((prepared) => prepared.name === tool.name) : options?.wrapBeforeToolCallHook,
		hookContext,
		...options?.swarmCollector ? { approvalMode: "deny" } : {}
	}).map(wrapGatewayCaller);
}
/** Build the SDK tool list without exposing core-only read scope or completion observations. */
function createOpenClawCodingTools(options) {
	return createOpenClawCodingToolsInternal(options);
}
//#endregion
export { applyDelegationCapability as a, createScheduledMessageInvocationAdmission as i, createOpenClawCodingToolsInternal as n, resolveDelegationCapability as o, prepareSessionPortalToolTarget as r, createOpenClawCodingTools as t };
