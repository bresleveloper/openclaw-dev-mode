import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { _ as resolveSessionAgentIds } from "./agent-scope-DXrnO3F4.mjs";
import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DGlfxTaj.mjs";
import { c as normalizeToolPolicyName } from "./tool-policy-shared-PsZCKeeN.mjs";
import { i as filterToolsByPolicy } from "./tool-policy-match--5jlhAPZ.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-B4OWlHAG.mjs";
import { a as collectExplicitDenylist, c as hasRestrictiveAllowPolicy, i as collectExplicitAllowlist, l as mergeAlsoAllowPolicy, u as replaceWithEffectiveToolAllowlist } from "./tool-policy-14GRhbFd.mjs";
import { s as resolveExactExecModeFromPolicy } from "./exec-approvals-core-7oJu_fRe.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { _ as resolveAdmittedRunActiveAssertion, m as readAdmittedRunOperatorAuthority, u as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { R as withPreparedSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { a as loadExecApprovalsReadOnlyAsync } from "./exec-approvals-store-BhzM_h1C.mjs";
import "./exec-approvals-ByI8H66l.mjs";
import { n as resolveEventSessionRoutingPolicy } from "./event-session-routing-TMTpLGFx.mjs";
import { i as resolveSandboxRuntimeStatusAsync } from "./runtime-status-DWm-5zUj.mjs";
import { s as resolvePreparedExecDefaultsAsync, t as prepareExecDefaults } from "./exec-defaults-DrIV-0KT.mjs";
import { n as resolveEffectiveToolPolicy } from "./agent-tools.policy-t04F-r_I.mjs";
import { n as resolveRequesterToolPolicies } from "./requester-tool-policy-BmPXAdVs.mjs";
import { t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-BapisiIE.mjs";
import { a as hasSessionControlAuthority, r as resolveConversationCapabilityProfile, s as prepareSandboxSessionRename } from "./conversation-capability-profile-BVWQsqkw.mjs";
import { n as buildDefaultToolPolicyPipelineSteps, t as applyToolPolicyPipeline } from "./tool-policy-pipeline-CUnSsPP_.mjs";
import { a as prepareSessionPortalToolTarget, i as createOpenClawCodingToolsInternalAsync, l as resolveTurnToolSurface, o as createScheduledMessageInvocationAdmission, s as applyDelegationCapability } from "./agent-tools-QGgE-Vnu.mjs";
import { t as applyToolAvailabilityDescriptions } from "./agent-tools.deferred-followup-DWhzB7Rb.mjs";
import { s as filterToolsByMessageProvider } from "./core-coding-tools-htyTOKJv.mjs";
import { o as nodeExecSchema } from "./exec-tool-timeout-nIvSSNNO.mjs";
import { n as resolveExecToolConfig, t as createLazyExecTool } from "./lazy-exec-tool-6rMYuHYl.mjs";
import { d as applySwarmCollectorToolContract, f as createSwarmCollectorWriteAuthority, n as createOpenClawToolsAsync, p as resolveSwarmCollectorToolContext } from "./openclaw-tools-lor9xxfh.mjs";
import { n as filterRequesterYieldTools } from "./openclaw-tools.requester-yield-DAWcCgh7.mjs";
import { i as resolveGatewayOwnerOnlyToolDenylist, t as DEFAULT_GATEWAY_HTTP_TOOL_DENY } from "./dangerous-tools-7P77gGzs.mjs";
import { i as replaceWithEffectiveCronCreatorToolAllowlist, r as captureFinalEffectiveCronCreatorToolAllowlist } from "./cron-tool-BLlbTzAZ.mjs";
import { t as buildDeclaredToolAllowlistContext } from "./tool-policy-declared-context-S64J0n2P.mjs";
import { r as resolveCoreToolFactoryFamily } from "./core-tool-factory-descriptors-qKKUlMX_.mjs";
//#region src/gateway/tool-resolution-authority.ts
/** Preserve trusted channel policy and require verified lineage for completion grants. */
async function resolveGatewayRequesterToolPolicies(params, options) {
	const isOwnerInternalSession = options.nodeExecSurface && params.senderIsOwner === true && normalizeMessageChannel(params.messageProvider) === "webchat";
	const policies = await withPreparedSessionCapabilityRead(() => resolveRequesterToolPolicies({
		config: params.cfg,
		conversationPolicy: pickSandboxToolPolicy(params.conversationToolPolicy),
		sessionKey: options.runtimePolicySessionKey,
		subagentSessionKey: options.runtimePolicySessionKey,
		agentId: options.policyAgentId,
		spawnedBy: params.spawnedBy,
		messageProvider: params.messageProvider,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		accountId: options.accountId ?? null,
		senderId: params.channelContext?.sender?.id,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		sessionId: params.sessionId,
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		senderPolicyMode: params.scheduledToolPolicy ? "never" : options.nodeExecSurface ? isOwnerInternalSession ? "never" : "always" : "when-sender-id",
		groupPolicySessionKey: params.scheduledToolPolicy?.ownerSessionKey,
		requireConfiguredGroupAccount: params.scheduledToolPolicy?.mode === "account"
	}));
	if (params.trustedInternalHandoff && policies.requesterPolicySource !== "completion-handoff") throw new Error("CLI completion tool grant no longer matches its requester policy");
	return policies;
}
/** Construction cancellation must not become the lifetime of a cached tool. */
function captureGatewayToolResolutionAuthority(params, assertPreparationCurrent) {
	const assertRunCurrent = params.admittedRunContext ? resolveAdmittedRunActiveAssertion(params.admittedRunContext) : void 0;
	const assertInvocationCurrent = () => {
		if (params.isGrantCurrent && !params.isGrantCurrent()) throw new Error("Gateway tool invocation grant is no longer active");
		params.assertInvocationCurrent?.();
		assertRunCurrent?.();
	};
	return {
		assertInvocationCurrent,
		assertCurrent: () => {
			assertPreparationCurrent?.();
			assertInvocationCurrent();
		}
	};
}
//#endregion
//#region src/gateway/tool-resolution.ts
/** Resolve the tools visible to a gateway caller after agent, channel, and surface policy. */
async function resolveGatewayScopedTools(params, assertPreparationCurrent) {
	const { assertCurrent, assertInvocationCurrent } = captureGatewayToolResolutionAuthority(params, assertPreparationCurrent);
	assertCurrent();
	const runtimePolicySessionKey = params.runtimePolicySessionKey?.trim() || params.sessionKey;
	const sessionAgentId = resolveSessionAgentIds({
		config: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	}).sessionAgentId;
	const runtimePolicyAgentId = Boolean(params.runtimePolicySessionKey?.trim() || params.runtimePolicyAgentId?.trim()) ? resolveSessionAgentIds({
		config: params.cfg,
		sessionKey: runtimePolicySessionKey,
		agentId: params.runtimePolicyAgentId
	}).sessionAgentId : sessionAgentId;
	const surface = params.surface ?? "http";
	const stableSessionSurface = surface === "loopback" && params.admittedRunContext !== void 0;
	const nodeExecSurface = surface === "loopback" && params.includeNodeExecTool === true;
	const gatewayRequestedTools = params.gatewayRequestedTools ?? [];
	const messageProvider = params.messageProvider?.trim().toLowerCase();
	const gatewayCaller = resolveScheduledToolCallerContext({
		scheduledToolPolicy: params.scheduledToolPolicy,
		accountId: params.accountId,
		channel: messageProvider
	});
	const sourceReplyDeliveryMode = params.sourceReplyDeliveryMode ?? (params.inboundEventKind === "room_event" && messageProvider !== "webchat" ? "message_tool_only" : void 0);
	const runtimeAlsoAllow = sourceReplyDeliveryMode === "message_tool_only" ? ["message"] : [];
	function resolveConfiguredToolPolicies(config) {
		const effective = resolveEffectiveToolPolicy({
			config,
			sessionKey: runtimePolicySessionKey,
			agentId: runtimePolicyAgentId,
			modelProvider: params.modelProvider,
			modelId: params.modelId
		});
		const profilePolicy = resolveCoreToolProfilePolicy(effective.profile);
		const providerProfilePolicy = resolveCoreToolProfilePolicy(effective.providerProfile);
		return {
			...effective,
			profilePolicy,
			providerProfilePolicy,
			profilePolicyWithAlsoAllow: mergeAlsoAllowPolicy(profilePolicy, [
				...effective.profileAlsoAllow ?? [],
				...gatewayRequestedTools,
				...runtimeAlsoAllow
			]),
			providerProfilePolicyWithAlsoAllow: mergeAlsoAllowPolicy(providerProfilePolicy, [
				...effective.providerProfileAlsoAllow ?? [],
				...gatewayRequestedTools,
				...runtimeAlsoAllow
			])
		};
	}
	const configuredToolPolicies = resolveConfiguredToolPolicies(params.cfg);
	const { agentId: resolvedPolicyAgentId, globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, profilePolicy, providerProfilePolicy, gatewayConfigReadAllowed } = configuredToolPolicies;
	const policyAgentId = resolvedPolicyAgentId ?? runtimePolicyAgentId;
	const senderId = params.channelContext?.sender?.id;
	const requesterPolicies = await resolveGatewayRequesterToolPolicies(params, {
		runtimePolicySessionKey,
		policyAgentId,
		nodeExecSurface,
		accountId: gatewayCaller.accountId
	});
	const { groupPolicy, senderPolicy, subagentPolicy, inheritedToolPolicy } = requesterPolicies;
	const completionHandoff = stableSessionSurface && requesterPolicies.requesterPolicySource === "completion-handoff";
	const sessionPermissionPolicy = requesterPolicies.inheritedToolPolicySource === "sender" ? params.sessionPermissionPolicy : void 0;
	const sandboxRuntime = await resolveSandboxRuntimeStatusAsync({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: sessionAgentId,
		classificationSessionKey: runtimePolicySessionKey,
		classificationAgentId: policyAgentId
	});
	const sandboxed = sandboxRuntime.sandboxed;
	const preparedSandboxPolicy = sandboxRuntime.sandboxed ? sandboxRuntime.toolPolicy : void 0;
	const sessionControlAuthority = readAdmittedRunOperatorAuthority(params.admittedRunContext);
	const { policy: sandboxPolicy, renameOnly: sandboxSessionRenameOnly } = prepareSandboxSessionRename({
		policy: preparedSandboxPolicy,
		senderIsOwner: surface === "loopback" && params.admittedRunContext ? params.senderIsOwner : void 0,
		authority: sessionControlAuthority
	});
	const excludedToolNames = params.excludeToolNames ? Array.from(params.excludeToolNames) : [];
	const mediatedToolNames = new Set(Array.from(params.mediatedToolNames ?? [], (name) => normalizeToolPolicyName(name)).filter(Boolean));
	const gatewayToolsCfg = params.cfg.gateway?.tools;
	const sessionPortalTarget = surface === "loopback" && params.senderIsOwner === false && !sandboxed ? prepareSessionPortalToolTarget({
		sessionKey: params.sessionKey,
		agentId: sessionAgentId,
		sessionId: params.sessionId
	}) : void 0;
	const defaultGatewayDeny = surface === "http" ? DEFAULT_GATEWAY_HTTP_TOOL_DENY.filter((name) => !gatewayToolsCfg?.allow?.some((allowed) => normalizeToolPolicyName(allowed) === normalizeToolPolicyName(name))) : [];
	const assignmentAdmitted = surface === "loopback" && params.admittedRunContext && getAdmittedRunDelegatedAuthority(params.admittedRunContext);
	const ownerOnlyGatewayDeny = [...resolveGatewayOwnerOnlyToolDenylist(surface === "http" ? params.senderIsOwner === true : params.senderIsOwner).filter((name) => name !== "sessions" && (name !== "portal" || !sessionPortalTarget)), ...params.senderIsOwner !== true && !assignmentAdmitted && !(surface === "loopback" && hasSessionControlAuthority(sessionControlAuthority)) ? ["sessions"] : []];
	const workspaceDir = (requesterPolicies.inheritedToolPolicySource === "sender" ? params.preparedSessionWorkspaceDir?.trim() : void 0) || params.workspaceDir?.trim() || resolveAgentWorkspaceDir(params.cfg, sessionAgentId);
	const sessionPolicies = [
		profilePolicy,
		providerProfilePolicy,
		globalPolicy,
		globalProviderPolicy,
		agentPolicy,
		agentProviderPolicy,
		groupPolicy,
		completionHandoff ? void 0 : senderPolicy,
		sandboxPolicy,
		subagentPolicy
	];
	const basePolicies = [...sessionPolicies, inheritedToolPolicy];
	const requestedToolPolicy = gatewayRequestedTools.length > 0 ? { allow: gatewayRequestedTools } : void 0;
	const requestedPolicies = [...basePolicies, requestedToolPolicy];
	const catalogPolicies = [
		...sessionPolicies,
		completionHandoff ? void 0 : inheritedToolPolicy,
		requestedToolPolicy
	];
	const gatewayDenyPolicies = [defaultGatewayDeny.length > 0 ? { deny: defaultGatewayDeny } : void 0, Array.isArray(gatewayToolsCfg?.deny) ? { deny: gatewayToolsCfg.deny } : void 0];
	const explicitDenylist = collectExplicitDenylist([
		...basePolicies,
		...gatewayDenyPolicies,
		ownerOnlyGatewayDeny.length > 0 ? { deny: ownerOnlyGatewayDeny } : void 0
	]);
	const catalogDenylist = stableSessionSurface ? collectExplicitDenylist([...catalogPolicies, ...gatewayDenyPolicies]) : explicitDenylist;
	const inheritedToolDenylist = [...explicitDenylist, ...requesterPolicies.inheritedToolPolicyForSpawn?.deny ?? []];
	const inheritedToolAllowlist = [];
	const cronCreatorToolAllowlist = [];
	const cronCreatorToolAllowlistCaptureRef = surface === "loopback" ? {} : void 0;
	const shouldInheritEffectiveToolAllowlist = requestedPolicies.some(hasRestrictiveAllowPolicy);
	const swarmCollectorAdmission = {
		childSessionKey: params.sessionKey,
		childAgentId: sessionAgentId,
		admittedRunId: surface === "loopback" ? params.runId : void 0
	};
	const swarmCollectorContext = resolveSwarmCollectorToolContext(swarmCollectorAdmission);
	const commonToolOptions = () => ({
		runId: params.runId,
		inboundEventKind: params.inboundEventKind,
		sourceReplyDeliveryMode,
		taskSuggestionDeliveryMode: params.taskSuggestionDeliveryMode,
		currentMessageId: params.currentMessageId,
		currentInboundAudio: params.currentInboundAudio,
		sessionId: params.sessionId,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget,
		senderIsOwner: params.senderIsOwner,
		config: params.cfg,
		sessionConfigSource: "runtime",
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		modelHasVision: params.modelHasVision,
		requesterModel: params.requesterModel,
		pairedNodeComputerUse: params.pairedNodeComputerUse,
		clientCaps: params.clientCaps,
		gatewayUiCommandTarget: params.gatewayUiCommandTarget,
		workspaceDir,
		sessionPermissionPolicy,
		wrapBeforeToolCallHook: false,
		agentAccountId: params.accountId
	});
	const openClawToolOptions = {
		...commonToolOptions(),
		computerExecutionId: params.admittedRunContext?.operationalRunInstance.instanceId,
		sessionPortalTarget,
		gatewayConfigReadAllowed,
		agentSessionKey: params.sessionKey,
		messageToolTurnCapability: surface === "loopback" && params.messageActionTurnCapability ? {
			token: params.messageActionTurnCapability,
			sessionKey: runtimePolicySessionKey
		} : void 0,
		admitScheduledMessageInvocation: params.messageActionTurnCapability ? createScheduledMessageInvocationAdmission({
			config: params.cfg,
			isAllowed: (config) => tools.some((tool) => tool.name === "message") && filterGatewayToolPolicies(config).some((tool) => tool.name === "message")
		}) : void 0,
		assertInputCommitAllowed: params.assertInputCommitAllowed,
		assertInvocationCurrent,
		...swarmCollectorContext ? {
			swarmCollector: true,
			assertCollectorWriteAuthority: createSwarmCollectorWriteAuthority({
				admission: swarmCollectorAdmission,
				isGrantCurrent: params.isGrantCurrent
			}),
			...swarmCollectorContext.swarmOutputSchema ? { swarmOutputSchema: swarmCollectorContext.swarmOutputSchema } : {}
		} : {},
		execSession: params.execSession,
		execOverrides: params.execOverrides,
		approvalReviewerDeviceIds: params.approvalReviewerDeviceId ? [params.approvalReviewerDeviceId] : void 0,
		requesterAgentIdOverride: sessionAgentId,
		agentChannel: params.messageProvider ?? void 0,
		gatewayCallerAccountId: gatewayCaller.accountId,
		gatewayCallerChannel: gatewayCaller.channel,
		gatewayCallerLocal: gatewayCaller.local,
		sourceReplyOnly: params.sourceReplyOnly,
		agentTo: params.agentTo,
		agentThreadId: params.agentThreadId,
		currentChannelId: params.currentChannelId ?? params.agentTo,
		currentThreadTs: params.currentThreadTs ?? params.agentThreadId,
		replyToMode: params.replyToMode,
		onYield: params.onYield,
		requesterSenderId: senderId,
		sessionControlAuthority,
		sandboxSessionRenameOnly,
		conversationReadOrigin: params.conversationReadOrigin,
		allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
		skillWorkshop: params.skillWorkshop,
		allowMediaInvokeCommands: params.allowMediaInvokeCommands,
		disablePluginTools: params.disablePluginTools,
		agentDir: params.agentDir,
		authProfileStore: params.authProfileStore,
		pinnedWidgetAuthoring: surface === "loopback" ? params.pinnedWidgetAuthoring : void 0,
		sandboxed,
		pluginToolAllowlist: collectExplicitAllowlist(catalogPolicies),
		pluginToolDenylist: catalogDenylist,
		cronCreatorToolAllowlist,
		cronCreatorToolAllowlistCaptureRef,
		inheritedToolAllowlist,
		inheritedToolDenylist,
		inheritedToolPolicySource: requesterPolicies.inheritedToolPolicySource,
		delegatedToolPolicyUnavailable: Boolean(requesterPolicies.delegatedToolPolicy)
	};
	const openClawTools = await createOpenClawToolsAsync(openClawToolOptions, { assertCurrent });
	assertCurrent();
	const execDefaults = nodeExecSurface || mediatedToolNames.size > 0 ? await resolvePreparedExecDefaultsAsync(prepareExecDefaults({
		cfg: params.cfg,
		sessionEntry: params.execSession,
		execOverrides: params.execOverrides,
		agentId: policyAgentId,
		sessionKey: runtimePolicySessionKey,
		sandboxAvailable: sandboxed
	}, sandboxRuntime), loadExecApprovalsReadOnlyAsync) : void 0;
	const nodeExecDefaults = nodeExecSurface && execDefaults?.canRequestNode === true && params.nodeExecAvailable?.(execDefaults.node) === true ? execDefaults : void 0;
	const includeNodeExecTool = nodeExecDefaults !== void 0;
	const execConfig = includeNodeExecTool ? resolveExecToolConfig({
		cfg: params.cfg,
		agentId: policyAgentId
	}) : void 0;
	const mediatedToolFamilies = new Set(Array.from(mediatedToolNames, resolveCoreToolFactoryFamily));
	const includeMediatedBaseCodingTools = mediatedToolFamilies.has("base-coding");
	const includeMediatedShellTools = mediatedToolFamilies.has("shell");
	const mediatedCodingTools = surface === "loopback" && (includeMediatedBaseCodingTools || includeMediatedShellTools) ? await createOpenClawCodingToolsInternalAsync({
		...commonToolOptions(),
		sessionEventSourcePolicy: params.sessionEventSourcePolicy,
		agentId: policyAgentId,
		sessionKey: runtimePolicySessionKey,
		runSessionKey: params.sessionKey,
		operationalRunInstance: params.admittedRunContext?.operationalRunInstance,
		cwd: params.cwd?.trim() || workspaceDir,
		messageProvider: params.messageProvider,
		messageChannel: params.messageProvider,
		currentChannelId: params.currentChannelId,
		currentThreadTs: params.currentThreadTs,
		channelContext: params.channelContext,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		spawnedBy: params.spawnedBy,
		senderId: params.channelContext?.sender?.id,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		conversationToolPolicy: params.conversationToolPolicy,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		conversationCapabilityProfile: completionHandoff ? resolveConversationCapabilityProfile({
			config: params.cfg,
			agentId: policyAgentId,
			sessionKey: runtimePolicySessionKey,
			runSessionKey: params.sessionKey,
			modelProvider: params.modelProvider,
			modelId: params.modelId,
			senderIsOwner: true,
			messageProvider: "webchat",
			workspaceDir,
			cwd: params.cwd?.trim() || workspaceDir,
			runtimeToolAllowlist: [...mediatedToolNames]
		}) : void 0,
		trigger: params.trigger,
		continuesConversation: params.continuesConversation,
		approvalReviewerDeviceId: params.approvalReviewerDeviceId,
		runtimeToolAllowlist: [...mediatedToolNames],
		exec: execDefaults ? {
			host: execDefaults.host,
			mode: resolveExactExecModeFromPolicy(execDefaults) === null ? void 0 : execDefaults.mode,
			security: execDefaults.security,
			ask: execDefaults.ask,
			node: execDefaults.node,
			elevated: params.bashElevated
		} : void 0,
		scheduledToolPolicy: params.scheduledToolPolicy,
		toolConstructionPlan: {
			includeBaseCodingTools: includeMediatedBaseCodingTools,
			includeShellTools: includeMediatedShellTools,
			includeChannelTools: false,
			includeOpenClawTools: false,
			includePluginTools: false
		}
	}) : [];
	assertCurrent();
	const toolsWithMediatedCoding = [...(nodeExecSurface ? openClawTools.filter((tool) => tool.name.trim().toLowerCase() !== "exec") : openClawTools).filter((tool) => !mediatedToolNames.has(normalizeToolPolicyName(tool.name))), ...mediatedCodingTools];
	const allTools = nodeExecDefaults ? [...toolsWithMediatedCoding, createLazyExecTool({
		host: "node",
		mode: nodeExecDefaults.mode,
		security: nodeExecDefaults.security,
		ask: nodeExecDefaults.ask,
		trigger: params.trigger,
		node: nodeExecDefaults.node,
		pathPrepend: execConfig?.pathPrepend,
		safeBins: execConfig?.safeBins,
		strictInlineEval: execConfig?.strictInlineEval,
		commandHighlighting: execConfig?.commandHighlighting,
		safeBinTrustedDirs: execConfig?.safeBinTrustedDirs,
		safeBinProfiles: execConfig?.safeBinProfiles,
		reviewer: execConfig?.reviewer,
		config: params.cfg,
		agentId: policyAgentId,
		elevated: params.bashElevated,
		cwd: workspaceDir,
		allowBackground: false,
		scopeKey: params.sessionKey,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		sessionStore: params.cfg.session?.store,
		eventRouting: resolveEventSessionRoutingPolicy({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			channel: params.messageProvider,
			accountId: params.accountId
		}),
		messageProvider: params.messageProvider,
		currentChannelId: params.currentChannelId ?? params.agentTo,
		currentThreadTs: params.currentThreadTs ?? params.agentThreadId,
		channelContext: params.channelContext,
		accountId: params.accountId,
		approvalReviewerDeviceId: params.approvalReviewerDeviceId,
		backgroundMs: execConfig?.backgroundMs,
		timeoutSec: execConfig?.timeoutSec,
		approvalRunningNoticeMs: execConfig?.approvalRunningNoticeMs,
		notifyOnExit: execConfig?.notifyOnExit,
		notifyOnExitEmptySuccess: execConfig?.notifyOnExitEmptySuccess
	}, {
		description: "Execute a shell command on a connected OpenClaw node. This tool is node-only; use the CLI native shell for Gateway-local commands when it is available. Commands run synchronously. The sole connected node that can execute commands is selected automatically; set node when several can.",
		displaySummary: "Run commands on a connected node",
		parameters: nodeExecSchema
	})] : toolsWithMediatedCoding;
	const coreToolNames = new Set(allTools.map((tool) => normalizeToolPolicyName(tool.name)));
	const bundledTools = surface === "loopback" ? (params.bundledTools ?? []).filter((tool) => !coreToolNames.has(normalizeToolPolicyName(tool.name))) : [];
	const toolsForMessageProvider = filterToolsByMessageProvider(bundledTools.length > 0 ? [...allTools, ...bundledTools] : allTools, params.messageProvider);
	let nativeCreatorTools = (params.nativeCronCreatorToolAllowlist ?? []).map((name) => ({ name }));
	const declaredToolAllowlist = buildDeclaredToolAllowlistContext({
		config: params.cfg,
		workspaceDir,
		toolDenylist: catalogDenylist
	});
	function filterGatewayToolPolicies(config, onFilter, scope = "turn") {
		const current = config === params.cfg ? configuredToolPolicies : resolveConfiguredToolPolicies(config);
		return applyToolPolicyPipeline({
			tools: toolsForMessageProvider,
			toolMeta: (tool) => getPluginToolMeta(tool),
			warn: logWarn,
			steps: [
				...buildDefaultToolPolicyPipelineSteps({
					profilePolicy: current.profilePolicyWithAlsoAllow,
					profile: current.profile,
					profileUnavailableCoreWarningAllowlist: current.profilePolicy?.allow,
					providerProfilePolicy: current.providerProfilePolicyWithAlsoAllow,
					providerProfile: current.providerProfile,
					providerProfileUnavailableCoreWarningAllowlist: current.providerProfilePolicy?.allow,
					globalPolicy: current.globalPolicy,
					globalProviderPolicy: current.globalProviderPolicy,
					agentPolicy: current.agentPolicy,
					agentProviderPolicy: current.agentProviderPolicy,
					groupPolicy,
					senderPolicy,
					agentId: policyAgentId
				}),
				{
					policy: sandboxPolicy,
					label: "sandbox tools.allow"
				},
				{
					policy: subagentPolicy,
					label: "subagent tools.allow"
				},
				{
					policy: scope === "session" && completionHandoff ? void 0 : inheritedToolPolicy,
					label: "inherited tools"
				}
			],
			declaredToolAllowlist,
			onFilter
		});
	}
	const policyFiltered = filterGatewayToolPolicies(params.cfg, ({ policy }) => {
		nativeCreatorTools = filterToolsByPolicy(nativeCreatorTools, policy);
	});
	const gatewayDenySet = new Set([
		...defaultGatewayDeny,
		...stableSessionSurface ? [] : ownerOnlyGatewayDeny,
		...Array.isArray(gatewayToolsCfg?.deny) ? gatewayToolsCfg.deny : [],
		...excludedToolNames
	].map(normalizeToolPolicyName));
	const completeTools = (filtered) => applySwarmCollectorToolContract(applyDelegationCapability(filtered.filter((tool) => !gatewayDenySet.has(normalizeToolPolicyName(tool.name))), params.delegationCapability), {
		swarmCollector: Boolean(swarmCollectorContext),
		structuredOutputTool: openClawTools.find((tool) => tool.name === "structured_output")
	});
	const turnTools = completeTools(policyFiltered);
	const { tools, exportedTools } = stableSessionSurface ? resolveTurnToolSurface({
		turnTools,
		sessionTools: completionHandoff ? completeTools(filterGatewayToolPolicies(params.cfg, void 0, "session")) : void 0,
		ownerOnlyDenied: new Set(ownerOnlyGatewayDeny)
	}) : {
		tools: turnTools,
		exportedTools: turnTools
	};
	const inheritableTools = includeNodeExecTool ? exportedTools.filter((tool) => tool.name.trim().toLowerCase() !== "exec") : exportedTools;
	if (shouldInheritEffectiveToolAllowlist) replaceWithEffectiveToolAllowlist(inheritedToolAllowlist, inheritableTools);
	const nativeCapture = {
		canonicalToolNames: params.nativeCronCreatorToolAllowlist,
		nativeExecTarget: { host: "gateway" }
	};
	replaceWithEffectiveCronCreatorToolAllowlist(cronCreatorToolAllowlist, inheritableTools, (tool) => getPluginToolMeta(tool), nativeCapture);
	return {
		agentId: sessionAgentId,
		tools: applyToolAvailabilityDescriptions(filterRequesterYieldTools(tools, params.sessionKey)),
		workspaceDir,
		captureFinalCronCreatorTools: cronCreatorToolAllowlistCaptureRef ? (callableToolNames) => captureFinalEffectiveCronCreatorToolAllowlist(cronCreatorToolAllowlist, cronCreatorToolAllowlistCaptureRef, inheritableTools.filter((tool) => callableToolNames.has(tool.name.trim())), (tool) => getPluginToolMeta(tool), {
			...nativeCapture,
			canonicalToolNames: nativeCreatorTools.map((tool) => tool.name)
		}) : void 0
	};
}
//#endregion
export { resolveGatewayScopedTools as t };
