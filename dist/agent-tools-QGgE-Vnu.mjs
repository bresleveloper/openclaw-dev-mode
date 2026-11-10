import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as mergeGatewayAgentCliPath } from "./openclaw-cli-shim-NzMcmIk3.mjs";
import { C as resolveRuntimeConfigCacheKey, o as getRuntimeConfigSnapshot, r as createRuntimeConfigReader } from "./runtime-snapshot-BBYDJbw9.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-C2eV0eNq.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-DDDhACod.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DaxQ5QU2.mjs";
import { c as normalizeToolPolicyName, i as expandToolGroups } from "./tool-policy-shared-PsZCKeeN.mjs";
import { n as createRuntimeToolMatcher, r as createToolPolicyMatcher } from "./tool-policy-match--5jlhAPZ.mjs";
import { c as hasRestrictiveAllowPolicy, o as expandPolicyWithPluginGroups, r as buildPluginToolGroups, u as replaceWithEffectiveToolAllowlist } from "./tool-policy-14GRhbFd.mjs";
import { i as resolveGatewayMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { r as projectEffectiveExecPolicy } from "./session-permission-exec-mode-orsENUww.mjs";
import { g as wrapToolWithGatewayCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { n as copyPluginToolMeta, r as getPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { i as gateAgentToolExecution, o as markAgentToolExecutionUnavailable, r as finalizeAgentToolAvailability } from "./agent-tool-availability-DZN62JsD.mjs";
import { d as pinExecToolTarget, i as copyAgentToolMetadata, r as bindAssembledAgentToolActionDescriptor, x as isToolWrappedWithBeforeToolCallHook } from "./agent-tool-metadata-Dj6F-G24.mjs";
import { t as ToolAuthorizationError } from "./tool-input-error-mjW74R8m.mjs";
import "./common-BofcG96e.mjs";
import { u as isCompletionReportInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { c as prepareGitHubToolEnvironment } from "./github-tool-identity-BEdbceu6.mjs";
import { r as isDevMode } from "./globals-XVSoVbNQ.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { c as rewrapToolWithBeforeToolCallHook, l as wrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-CtP0G8Wg.mjs";
import { t as getProcessSupervisor } from "./supervisor-BxKhxTp_.mjs";
import { t as bindAgentToolSourceExecutionGuard } from "./agent-tool-source-execution-guard-iFSXyZre.mjs";
import { w as waitForExecScope } from "./bash-process-registry-D3AARAgk.mjs";
import { n as resolveEventSessionRoutingPolicy } from "./event-session-routing-TMTpLGFx.mjs";
import { t as HEARTBEAT_RESPONSE_TOOL_NAME } from "./heartbeat-tool-response-ByRAuVDa.mjs";
import { u as captureDelegatedToolPolicyAssertion } from "./subagent-capabilities-l3WVTf-e.mjs";
import { r as mergeAgentRingZeroTools, t as getActiveAgentRingZeroTools } from "./agent-tools.ring-zero-context-DcmTQndF.mjs";
import { r as resolveSelfRemoveOnlyJobId, t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-BapisiIE.mjs";
import { t as resolveSessionPlacementComputer } from "./session-placement-computer-wc2Javdz.mjs";
import { n as prepareDelegatedToolDenyFloor, r as resolveConversationCapabilityProfile, t as prepareConversationCapabilityProfile } from "./conversation-capability-profile-BVWQsqkw.mjs";
import { r as messageToolOwnsVisibleReply } from "./source-reply-delivery-mode-CC4nGK9E.mjs";
import { t as appendRuntimePluginToolGrant } from "./tool-grant-allowlist-WLMZChmq.mjs";
import { t as applyToolPolicyPipeline } from "./tool-policy-pipeline-CUnSsPP_.mjs";
import { i as resolveConversationToolPolicies, n as isConversationToolAllowed, t as buildConversationToolPolicyPipelineSteps } from "./conversation-tool-policy-pipeline-DNbcwb7L.mjs";
import { n as wrapToolWithAbortSignal } from "./agent-tools.abort-Vm0F-Le2.mjs";
import { t as applyToolAvailabilityDescriptions } from "./agent-tools.deferred-followup-DWhzB7Rb.mjs";
import { a as resolveMemoryFlushToolSetup, i as projectMemoryFlushTools, o as warnIfMemoryFlushFileWriterUnavailable, r as assertMemoryFlushPersistenceToolAvailable, s as filterToolsByMessageProvider$1, t as createCoreCodingTools } from "./core-coding-tools-htyTOKJv.mjs";
import { h as createMemoryWriteProvenanceObserver } from "./secrets-tool-vT5mBKZ0.mjs";
import { n as resolveSandboxFileIdentity } from "./file-mutation-identity-C_-O-u-P.mjs";
import { E as resolveLocalModelLeanPreserveToolNames, S as TOOL_SEARCH_RAW_TOOL_NAME, b as TOOL_DESCRIBE_RAW_TOOL_NAME, c as resolveToolSearchConfig, n as createToolSearchTools, w as filterLocalModelLeanTools, y as TOOL_CALL_RAW_TOOL_NAME } from "./tool-search-BYeL5tYo.mjs";
import { t as resolveNativeWebSearchRoute } from "./native-web-search-GYI4rjNv.mjs";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-2cvMG8cQ.mjs";
import { t as listChannelAgentTools } from "./channel-tools-IvDct8QI.mjs";
import { n as resolveExecToolConfig } from "./lazy-exec-tool-6rMYuHYl.mjs";
import { i as bindCronManagementGrant, n as bindActiveCronCreatorAuthorityResolver } from "./cron-creator-authority-context-B7AqRmnW.mjs";
import { S as resolveOpenClawPluginToolsForOptionsAsync, _ as createGitHubPublishTool, b as filterToolsByClientCaps, d as applySwarmCollectorToolContract, l as resolveHeartbeatTools, r as createOpenClawToolsWithPreparation, t as createOpenClawTools, x as resolveOpenClawPluginToolsForOptions } from "./openclaw-tools-lor9xxfh.mjs";
import { a as getInProcessGatewayToolContext } from "./in-process-gateway-DaAxH7mK.mjs";
import { r as subagentAttachmentRootForRun } from "./subagent-attachment-paths-B8kPlxpj.mjs";
import { t as withPreparedToolConstruction } from "./tool-construction-preparation-Bc08WuI0.mjs";
import { n as filterRequesterYieldTools } from "./openclaw-tools.requester-yield-DAWcCgh7.mjs";
import { i as resolveGatewayOwnerOnlyToolDenylist } from "./dangerous-tools-7P77gGzs.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-uCpxGkcu.mjs";
import { i as replaceWithEffectiveCronCreatorToolAllowlist } from "./cron-tool-BLlbTzAZ.mjs";
import { t as prepareCoreToolPolicy } from "./prepared-tool-surface-BU-eOKYx.mjs";
import { t as withLegacySessionCapabilityRead } from "./subagent-session-store-legacy-g_NAEE5q.mjs";
import { t as buildDeclaredToolAllowlistContext } from "./tool-policy-declared-context-S64J0n2P.mjs";
import { t as captureSessionPortalTarget } from "./session-portal-target-D54R2k-a.mjs";
import { isStrictOpenAIJsonSchemaCompatible, normalizeOpenAIStrictToolParameters, normalizeToolParameterSchema, prepareAnthropicInputSchema, prepareOpenAIFunctionTool, publishRuntimeToolInputSchema } from "@openclaw/ai/internal/tool-schema";
//#region src/agents/agent-tools.caller.ts
/** Carries the coding surface's prepared policy and requesting route into plugin delegation. */
function createCodingToolsGatewayCaller(params) {
	const { options, agentId, sessionKey, capabilityProfile } = params;
	const delegatedPolicy = capabilityProfile.policy.delegatedToolPolicy;
	if (delegatedPolicy && !options?.config) throw new Error("Delegated execution requires its source configuration.");
	const assertDelegationCurrent = options?.config ? captureDelegatedToolPolicyAssertion(options.config, delegatedPolicy) : void 0;
	const allowedWithoutDelegation = (tool) => createToolPolicyMatcher(expandPolicyWithPluginGroups(capabilityProfile.policy.inheritedToolPolicyForSpawn, buildPluginToolGroups({
		tools: [tool],
		toolMeta: getPluginToolMeta
	})))(tool.name);
	const settleBatch = capabilityProfile.policy.requesterPolicySource === "completion-handoff" ? options?.trustedInternalHandoff?.settleBatch : void 0;
	const identity = options && agentId && sessionKey?.trim() ? {
		agentId,
		sessionKey: sessionKey.trim(),
		sessionEventToolsAllow: params.sessionEventSourcePolicy?.toolsAllow,
		sessionEventSettings: params.sessionEventSourcePolicy?.settings ?? { permissionMode: options.sessionPermissionPolicy?.mode },
		...options.sourceReplyDeliveryMode === "message_tool_only" ? { sessionEventDelivery: false } : {},
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
	return (tool) => {
		if (!identity || !assertDelegationCurrent || allowedWithoutDelegation(tool)) return wrapToolWithGatewayCallerIdentity(tool, identity);
		const guarded = bindAgentToolSourceExecutionGuard(tool, assertDelegationCurrent);
		return wrapToolWithGatewayCallerIdentity(isToolWrappedWithBeforeToolCallHook(guarded) ? rewrapToolWithBeforeToolCallHook(guarded) : guarded, {
			...identity,
			receiptAuthority: () => {
				assertDelegationCurrent();
				return identity.receiptAuthority?.() ?? true;
			}
		});
	};
}
/** Captures callable function tools plus independently admitted provider-hosted search. */
function sessionEventToolNames(tools, turnAuthorized, profile) {
	const names = tools.filter(turnAuthorized).map((tool) => tool.name);
	if (!tools.some((tool) => tool.name === "web_search") && isConversationToolAllowed(profile, "web_search")) names.push("web_search");
	return names;
}
//#endregion
//#region src/agents/agent-tools.exec-scope-cleanup.ts
function registerOneShotExecScopeCleanup(options, scopeKey) {
	if (!options?.oneShotCliRun || !scopeKey || !options.registerRunCleanup) return;
	const cleanupScope = getProcessSupervisor().acquireScopeCleanup(scopeKey, { processTree: "owned-only" });
	options.registerRunCleanup(async () => {
		const failed = (await Promise.allSettled([cleanupScope(), waitForExecScope(scopeKey)])).find((result) => result.status === "rejected");
		if (failed) throw failed.reason;
	});
}
//#endregion
//#region src/agents/agent-tools.descriptor-snapshot.ts
const snapshots = /* @__PURE__ */ new Map();
registerPluginMetadataProcessMemoLifecycleClear(() => snapshots.clear());
function publishParameters(parameters, name) {
	const projected = publishRuntimeToolInputSchema(parameters, `${name}.parameters`, name);
	return projected.violations.length === 0 && isRecord(projected.schema) ? projected.schema : void 0;
}
function prewarmOpenAIDescriptor(descriptor, compat) {
	for (const strict of [false, true]) {
		if (strict && !isStrictOpenAIJsonSchemaCompatible(descriptor.parameters)) continue;
		const parameters = normalizeOpenAIStrictToolParameters(descriptor.parameters, strict, compat);
		prepareOpenAIFunctionTool(descriptor.name, descriptor.description, parameters, strict);
		if (!strict) prepareOpenAIFunctionTool(descriptor.name, descriptor.description, parameters, void 0);
	}
}
/** Finalization owns descriptors; retained entries never contain callable tool objects. */
function prepareAgentToolDescriptorSnapshot(inputs) {
	const key = JSON.stringify([
		inputs.config ? resolveRuntimeConfigCacheKey(inputs.config) : void 0,
		getPluginRegistryState()?.activeVersion,
		inputs.modelProvider,
		inputs.modelId,
		inputs.modelApi,
		inputs.modelCompat,
		inputs.tools.map((tool) => tool.name)
	]);
	const previous = inputs.sessionId ? snapshots.get(inputs.sessionId) : void 0;
	const entries = previous?.key === key && previous.pluginMetadataSnapshot === inputs.pluginMetadataSnapshot ? previous.entries : void 0;
	return {
		normalized(tool, index) {
			const entry = entries?.[index];
			return entry && entry.source === tool.parameters ? entry.normalized : void 0;
		},
		bind(tool, index) {
			const entry = entries?.[index];
			if (!entry || tool.description !== entry.descriptor.description || tool.parameters !== entry.finalSource || tool.outputSchema !== entry.outputSource) return tool;
			return copyAgentToolMetadata(tool, {
				...tool,
				...entry.descriptor
			});
		},
		settle(sources, normalized, finalized, registerCleanup) {
			if (!inputs.sessionId) return;
			const pending = finalized.map((tool, index) => {
				const entry = entries?.[index];
				if (entry && entry.source === sources[index] && entry.descriptor.parameters === tool.parameters && entry.descriptor.outputSchema === tool.outputSchema && entry.descriptor.description === tool.description) return entry;
				return {
					source: sources[index],
					normalized: normalized[index],
					finalSource: tool.parameters,
					outputSource: tool.outputSchema,
					descriptor: {
						name: tool.name,
						description: tool.description,
						parameters: tool.parameters,
						outputSchema: tool.outputSchema
					}
				};
			});
			if (entries?.length === pending.length && pending.every((entry, index) => entry === entries[index])) return;
			const sessionId = inputs.sessionId;
			const publish = () => {
				const prepared = pending.map((entry, index) => {
					if (entry === entries?.[index]) return entry;
					const normalizedSchema = publishParameters(entry.normalized, entry.descriptor.name);
					const parameters = entry.finalSource === entry.normalized ? normalizedSchema : publishParameters(entry.finalSource, entry.descriptor.name);
					const outputSchema = entry.outputSource ? publishParameters(entry.outputSource, entry.descriptor.name) : void 0;
					if (!normalizedSchema || !parameters || entry.outputSource && !outputSchema) return;
					const descriptor = Object.freeze({
						...entry.descriptor,
						parameters,
						outputSchema
					});
					if (!inputs.modelApi || inputs.modelApi === "openai-responses" || inputs.modelApi === "openai-completions") prewarmOpenAIDescriptor(descriptor, inputs.modelCompat);
					else if (inputs.modelApi === "anthropic-messages") prepareAnthropicInputSchema(parameters);
					return Object.freeze({
						...entry,
						normalized: normalizedSchema,
						finalSource: entry.finalSource === entry.normalized ? normalizedSchema : entry.finalSource,
						descriptor
					});
				});
				snapshots.delete(sessionId);
				snapshots.set(sessionId, {
					key,
					pluginMetadataSnapshot: inputs.pluginMetadataSnapshot,
					entries: Object.freeze(prepared)
				});
				pruneMapToMaxSize(snapshots, 64);
			};
			if (registerCleanup) registerCleanup(async () => publish());
			else publish();
		}
	};
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
	return bindToolParameterSchema(tool, normalizeToolParameterSchema(schema, {
		...options,
		toolName: tool.name
	}));
}
/** Bind a prepared descriptor to this attempt's argument preparation and metadata. */
function bindToolParameterSchema(tool, parameters) {
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
	const descriptors = prepareAgentToolDescriptorSnapshot({
		...options,
		sessionId: options.hookContext.sessionId,
		pluginMetadataSnapshot: options.preparedModelRuntime?.metadataSnapshot
	});
	const sources = options.tools.map((tool) => tool.parameters);
	const normalized = options.tools.map((tool, index) => {
		const prepared = descriptors.normalized(tool, index);
		return prepared ? bindToolParameterSchema(tool, prepared) : normalizeToolParameters(tool, {
			modelProvider: options.modelProvider,
			modelId: options.modelId,
			modelCompat: options.modelCompat
		});
	});
	const normalizedSchemas = normalized.map((tool) => tool.parameters);
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
	const finalized = applyToolAvailabilityDescriptions(withAbort).map((tool, index) => descriptors.bind(tool, index));
	options.recordToolPrepStage?.("deferred-followup-descriptions");
	descriptors.settle(sources, normalizedSchemas, finalized, options.registerRunCleanup);
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
		preparedRequesterPolicy: params?.preparedRequesterPolicy,
		pluginMetadataSnapshot: params?.preparedModelRuntime?.metadataSnapshot
	}).kind === "native") return tools.filter((tool) => tool.name !== "web_search");
	return tools;
}
//#endregion
//#region src/agents/agent-tools.runtime-allowlist.ts
function runtimeToolAllowlistIncludesMessage(toolNames) {
	return expandToolGroups(toolNames).some((toolName) => {
		const normalized = normalizeToolPolicyName(toolName);
		return normalized === "*" || normalized === "message";
	});
}
//#endregion
//#region src/agents/agent-tools.turn-authority.ts
/**
* Offers the session's tool surface on every turn, so the provider prompt prefix
* stays cacheable, and gates the calls this turn's authority does not cover.
* Owner-only tools and a completion handoff's replayed requester policy are
* per-turn authority; they never hide a tool definition.
*/
function resolveTurnToolSurface(params) {
	const turnAuthorizedNames = new Set(params.turnTools.filter((tool) => !params.ownerOnlyDenied.has(tool.name)).map((tool) => tool.name));
	const turnAuthorized = (tool) => turnAuthorizedNames.has(tool.name);
	const offered = (params.sessionTools ?? params.turnTools).filter((tool) => tool !== params.withheld);
	return {
		tools: offered.map((tool) => {
			if (turnAuthorized(tool)) return tool;
			const gated = gateAgentToolExecution(tool, params.ownerOnlyDenied.has(tool.name) ? `${tool.name} needs the owner's authority, and this turn was not started by the owner. Do not retry ${tool.name}.` : `${tool.name} is outside the authority this completion turn carries from its requester. Do not retry ${tool.name}.`);
			return markAgentToolExecutionUnavailable(copyAgentToolMetadata(tool, gated));
		}),
		turnAuthorized,
		/** Policy-approved tools for descendant snapshots, including a withheld tool. */
		exportedTools: params.turnTools.filter(turnAuthorized),
		/** Tools this turn may call. */
		callableTools: offered.filter(turnAuthorized)
	};
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
//#region src/agents/fork-message-provider-policy.ts
/**
* SEC-101 (openclaw-dev-mode fork): dev-mode skips the per-channel tool allowlist.
*
* Upstream narrows the agent's tools by the message provider of the turn
* (`filterToolsByMessageProvider`, src/agents/agent-tools.message-provider-policy.ts). Dev-mode
* keeps every tool on every channel. Same name and signature as upstream's function, so the only
* hook is the import line in src/agents/agent-tools.ts: that file sits at its max-lines cap
* (700 counted lines at 2026.10.10) and an inline ternary pushed it over.
*
* Regression checklist (every upstream upgrade):
* - agent-tools.ts still imports `filterToolsByMessageProvider` from this file, and upstream's
*   function keeps the same signature;
* - no other call site of upstream's function needs the same treatment
*   (`git grep -n "filterToolsByMessageProvider(" src`). Known and deliberately unhooked since
*   10.4: src/gateway/tool-resolution.ts (gateway-scoped tools, e.g. claude-cli's loopback MCP);
* - `pnpm exec oxlint src/agents/agent-tools.ts` reports no max-lines error.
*/
function filterToolsByMessageProvider(tools, messageProvider) {
	return isDevMode() ? [...tools] : filterToolsByMessageProvider$1(tools, messageProvider);
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
	const resolvePolicies = (capabilityProfile) => resolveConversationToolPolicies({
		capabilityProfile,
		additionalProfileAllow: params.runtimeProfileAlsoAllow,
		additionalPolicyAllow: params.toolSearchControlAllowlist
	});
	const policies = resolvePolicies(params.capabilityProfile);
	const filter = (currentProfile = params.capabilityProfile, onFilter, scope = "turn") => {
		const currentPolicies = currentProfile === params.capabilityProfile ? policies : resolvePolicies(currentProfile);
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
					inheritedToolPolicy: scope === "session" && currentProfile.policy.requesterPolicySource === "completion-handoff" ? void 0 : policies.inheritedToolPolicy
				},
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
					pluginMetadataSnapshot: params.pluginMetadataSnapshot,
					preparedSessionCapabilityStore: {}
				});
				return params.isAvailable() && filter(currentProfile).some((tool) => tool.name === "message");
			}
		})
	};
}
//#endregion
//#region src/agents/tools/session-portal-target.ts
function prepareSessionPortalToolAccess(input) {
	const cronCreatorAuthorityResolver = bindActiveCronCreatorAuthorityResolver(input.runId);
	const hasAutomationGrant = Boolean(input.cronSelfRemoveOnlyJobId || cronCreatorAuthorityResolver || bindCronManagementGrant(input.runId));
	const sessionPortalTarget = input.senderIsOwner === false && !input.sandboxed ? prepareSessionPortalToolTarget(input) : void 0;
	return {
		sessionPortalTarget,
		ownerOnlyCoreToolDenylist: resolveGatewayOwnerOnlyToolDenylist(input.senderIsOwner).filter((name) => (name !== "portal" || !sessionPortalTarget) && name !== "sessions" && (name !== "automations" || !hasAutomationGrant)),
		cronCreatorAuthorityResolver
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
function* assembleOpenClawCodingTools(options, skillReadResources, onPolicyFilter, preparedSurface) {
	const preparedTools = preparedSurface?.tools;
	const sandbox = options?.sandbox?.enabled ? options.sandbox : void 0;
	const { isMemoryFlushRun, memoryFlush, memoryFlushWritePath } = resolveMemoryFlushToolSetup(options);
	const cronSelfRemoveOnlyJobId = resolveSelfRemoveOnlyJobId(options ?? {});
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
	const { enableHeartbeatTool, offerHeartbeatTool } = resolveHeartbeatTools(options, agentId);
	const toolSearchConfig = resolveToolSearchConfig(options?.config);
	const toolSearchControlsEnabled = options?.includeToolSearchControls === true && toolSearchConfig.enabled;
	const toolSearchControlAllowlist = toolSearchControlsEnabled ? [
		TOOL_SEARCH_RAW_TOOL_NAME,
		TOOL_DESCRIBE_RAW_TOOL_NAME,
		TOOL_CALL_RAW_TOOL_NAME
	] : [];
	const runtimeAllowlistIncludesMessage = runtimeToolAllowlistIncludesMessage(options?.runtimeToolAllowlist ?? []);
	const sourceReplyOnly = capabilityProfile.policy.requesterPolicySource === "completion-handoff" && options?.sourceReplyDeliveryMode === "message_tool_only";
	const localModelLeanPreserveToolNames = resolveLocalModelLeanPreserveToolNames({
		toolNames: capabilityProfile.policy.explicitToolOverrideAllowlist,
		forceMessageTool: options?.forceMessageTool,
		sourceReplyDeliveryMode: options?.sourceReplyDeliveryMode
	});
	const runtimeProfileAlsoAllow = [
		...options && messageToolOwnsVisibleReply(options) ? ["message"] : [],
		...runtimeAllowlistIncludesMessage ? ["message"] : [],
		...offerHeartbeatTool ? [HEARTBEAT_RESPONSE_TOOL_NAME] : [],
		...toolSearchControlAllowlist
	];
	const sandboxWorkspaceMediaReadAllowed = isConversationToolAllowed(capabilityProfile, "read");
	const scopeKey = resolveProcessToolScopeKey({
		scopeKey: options?.exec?.scopeKey,
		sessionKey: executionSessionKey,
		sessionId: options?.sessionId,
		agentId: executionAgentId
	});
	registerOneShotExecScopeCleanup(options, scopeKey);
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
	const { workspaceRoot, runtimeRoot } = capabilityProfile.workspace;
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
			continuesConversation: options?.continuesConversation,
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
	const { sessionPortalTarget, ownerOnlyCoreToolDenylist, cronCreatorAuthorityResolver } = prepareSessionPortalToolAccess({
		sessionKey: executionSessionKey,
		agentId: executionAgentId,
		sessionId: options?.sessionId,
		senderIsOwner: options?.senderIsOwner,
		sandboxed: Boolean(sandbox),
		runId: options?.runId,
		cronSelfRemoveOnlyJobId
	});
	const pluginToolAllowlist = appendRuntimePluginToolGrant(capabilityProfile.policy.explicitToolAllowlist, runtimePluginToolGrant);
	const pluginToolDenylist = [...capabilityProfile.policy.explicitToolDenylist];
	const requesterToolDenylist = [...pluginToolDenylist, ...ownerOnlyCoreToolDenylist];
	const inheritedToolDenylist = [...requesterToolDenylist, ...capabilityProfile.policy.inheritedToolPolicyForSpawn?.deny ?? []];
	const delegatedToolDenyFloor = prepareDelegatedToolDenyFloor(capabilityProfile, ownerOnlyCoreToolDenylist);
	const inheritedToolAllowlist = options?.inheritedToolAllowlistRef ?? [];
	const shouldInheritEffectiveToolAllowlist = capabilityProfile.policy.inheritancePolicies.some(hasRestrictiveAllowPolicy);
	const unavailablePublicationTool = (shouldInheritEffectiveToolAllowlist || options?.inheritedPublicationToolRef) && includeOpenClawTools && options?.githubPublicationAvailable === false ? createGitHubPublishTool() : void 0;
	const cronCreatorToolAllowlist = options?.cronCreatorToolAllowlistRef ?? [];
	const gatewayCaller = resolveScheduledToolCallerContext({
		scheduledToolPolicy: options?.scheduledToolPolicy,
		accountId: options?.agentAccountId,
		channel: resolveGatewayMessageChannel(options?.messageChannel ?? options?.messageProvider)
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
	const pluginToolsOnly = filterToolsByClientCaps(includeOpenClawTools || !includePluginTools ? [] : yield { pluginTools: {
		options: pluginToolOptions,
		resolvedConfig: options?.config
	} }, options?.clientCaps);
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
		catalog: () => ({
			tools: toolsForModelProvider,
			declaredToolAllowlist,
			unavailableCoreToolReason
		}),
		isAvailable: () => turnAuthorized({ name: "message" })
	});
	const assembledTools = [
		...scheduledCoreTools,
		...includeChannelTools ? listChannelAgentTools({ cfg: options?.config }) : [],
		...includeOpenClawTools ? mergeAgentRingZeroTools(ringZeroTools, yield {
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
			sandboxAgentId: sandbox?.agentId,
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
			offerHeartbeatTool,
			disablePluginTools: !includePluginTools,
			wrapBeforeToolCallHook: false,
			...cronSelfRemoveOnlyJobId ? { cronSelfRemoveOnlyJobId } : {},
			inheritedToolAllowlist,
			inheritedToolDenylist,
			delegatedToolDenyFloor,
			requesterToolDenylist,
			readDelegationConfig: options?.config ? createRuntimeConfigReader(options.config) : void 0,
			inheritedToolPolicySource: capabilityProfile.policy.inheritedToolPolicySource,
			processScopeKey: scopeKey
		}) : pluginToolsOnly,
		...toolSearchTools
	];
	options?.recordToolPrepStage?.("openclaw-tools");
	const tools = preparedTools ? [...new Map([...assembledTools, ...preparedTools].map((tool) => [tool.name, tool])).values()] : assembledTools;
	if (unavailablePublicationTool) tools.push(unavailablePublicationTool);
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
	const toolsForMessageProvider = filterToolsByMessageProvider(toolsForMemoryFlush, options?.toolPolicyMessageProvider ?? options?.messageProvider);
	options?.recordToolPrepStage?.("message-provider-policy");
	const toolsForModelProvider = applyModelProviderToolPolicy(toolsForMessageProvider, {
		...options,
		agentId,
		preparedRequesterPolicy: capabilityProfile.policy,
		localModelLeanPreserveToolNames
	});
	options?.recordToolPrepStage?.("model-provider-policy");
	const declaredToolAllowlist = buildDeclaredToolAllowlistContext({
		config: options?.config,
		metadataSnapshot: options?.preparedModelRuntime?.metadataSnapshot,
		workspaceDir: workspaceRoot,
		toolDenylist: pluginToolDenylist
	});
	const completeTurnTools = (filtered) => applySwarmCollectorToolContract(applyDelegationCapability(mergeAgentRingZeroTools(ringZeroTools, filtered), options?.delegationCapability), {
		swarmCollector: options?.swarmCollector,
		structuredOutputTool: swarmStructuredOutputTool
	});
	const inheritableTools = completeTurnTools(messageInvocationPolicy.filter(capabilityProfile, onPolicyFilter));
	const { tools: authorizedTools, turnAuthorized, callableTools, exportedTools } = resolveTurnToolSurface({
		turnTools: inheritableTools,
		sessionTools: capabilityProfile.policy.requesterPolicySource === "completion-handoff" ? completeTurnTools(messageInvocationPolicy.filter(capabilityProfile, void 0, "session")) : void 0,
		ownerOnlyDenied: new Set(ownerOnlyCoreToolDenylist),
		withheld: unavailablePublicationTool
	});
	if (options?.inheritedPublicationToolRef) options.inheritedPublicationToolRef.current = inheritableTools.find((tool) => tool === unavailablePublicationTool);
	assertMemoryFlushPersistenceToolAvailable(authorizedTools, options?.memoryFlushTools);
	authorizedTools.forEach(bindAssembledAgentToolActionDescriptor);
	if (shouldInheritEffectiveToolAllowlist) replaceWithEffectiveToolAllowlist(inheritedToolAllowlist, exportedTools);
	replaceWithEffectiveCronCreatorToolAllowlist(cronCreatorToolAllowlist, callableTools, (tool) => getPluginToolMeta(tool));
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
		awaitSessionDiffBaseline: options?.awaitSessionDiffBaseline,
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
	const finalizedTools = finalizeAgentTools({
		...options,
		tools: filterRequesterYieldTools(authorizedTools, executionSessionKey),
		wrapBeforeToolCallHook: preparedTools ? (tool) => options?.wrapBeforeToolCallHook !== false && !preparedTools.some((prepared) => prepared.name === tool.name) : options?.wrapBeforeToolCallHook,
		hookContext,
		...options?.swarmCollector ? { approvalMode: "deny" } : {}
	});
	return finalizedTools.map(createCodingToolsGatewayCaller({
		options,
		agentId: executionAgentId,
		sessionKey: executionSessionKey,
		accountId: gatewayCaller.accountId,
		capabilityProfile,
		sessionEventSourcePolicy: options?.sessionEventSourcePolicy ?? { toolsAllow: sessionEventToolNames(finalizedTools, turnAuthorized, capabilityProfile) }
	}));
}
/** @deprecated Use createOpenClawCodingToolsInternalAsync for runtime construction. */
function createOpenClawCodingToolsInternal(...args) {
	return withLegacySessionCapabilityRead(() => {
		const assembly = assembleOpenClawCodingTools(...args);
		let step = assembly.next();
		while (!step.done) step = assembly.next("pluginTools" in step.value ? resolveOpenClawPluginToolsForOptions(step.value.pluginTools) : createOpenClawTools(step.value));
		return step.value;
	});
}
/** Internal preparation data stays outside the public harness factory options. */
async function createOpenClawCodingToolsInternalAsync(options, skillReadResources, onPolicyFilter, preparedSurface, preparation = {}) {
	return withPreparedToolConstruction(options?.config, {
		...preparation,
		signal: options?.abortSignal && preparation.signal ? AbortSignal.any([options.abortSignal, preparation.signal]) : options?.abortSignal ?? preparation.signal
	}, async (shared) => {
		const conversationCapabilityProfile = options?.conversationCapabilityProfile ?? await prepareConversationCapabilityProfile({
			...options,
			config: shared.config,
			agentId: options?.policyAgentId ?? options?.agentId,
			sandboxToolPolicy: options?.sandbox?.enabled ? options.sandbox.tools : void 0,
			pluginMetadataSnapshot: options?.preparedModelRuntime?.metadataSnapshot
		});
		const assembly = assembleOpenClawCodingTools({
			...options,
			config: shared.config,
			conversationCapabilityProfile
		}, skillReadResources, onPolicyFilter, preparedSurface);
		let step = assembly.next();
		while (!step.done) {
			const tools = "pluginTools" in step.value ? await resolveOpenClawPluginToolsForOptionsAsync(step.value.pluginTools) : await createOpenClawToolsWithPreparation(step.value, shared);
			shared.assertCurrent();
			step = assembly.next(tools);
		}
		return step.value;
	});
}
/** @deprecated Use createOpenClawCodingToolsAsync to prepare policy through the worker. Supported through 2026-12-31. */
function createOpenClawCodingTools(options) {
	warnPluginSdkDeprecation({
		family: "tool-surface",
		method: "createOpenClawCodingTools",
		replacement: "await createOpenClawCodingToolsAsync()"
	});
	return createOpenClawCodingToolsInternal(options);
}
/** Build the SDK tool list with a fresh, source-bound exec policy. */
function createOpenClawCodingToolsAsync(options) {
	return createOpenClawCodingToolsInternalAsync(options);
}
//#endregion
export { prepareSessionPortalToolTarget as a, resolveDelegationCapability as c, createOpenClawCodingToolsInternalAsync as i, resolveTurnToolSurface as l, createOpenClawCodingToolsAsync as n, createScheduledMessageInvocationAdmission as o, createOpenClawCodingToolsInternal as r, applyDelegationCapability as s, createOpenClawCodingTools as t };
