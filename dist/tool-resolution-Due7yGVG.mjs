import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { v as resolveSessionAgentIds } from "./agent-scope-CG17uXFn.mjs";
import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DyHnjiiS.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-DWHChhWM.mjs";
import { i as filterToolsByPolicy } from "./tool-policy-match-Dn8gpf-E.mjs";
import { a as collectExplicitDenylist, c as hasRestrictiveAllowPolicy, i as collectExplicitAllowlist, l as mergeAlsoAllowPolicy, u as replaceWithEffectiveToolAllowlist } from "./tool-policy-BKvvmcQR.mjs";
import { s as resolveExactExecModeFromPolicy } from "./exec-approvals-core-s7tTQC_a.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { c as getAdmittedRunDelegatedAuthority, f as readAdmittedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import "./exec-approvals-B1rZTeax.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DEC0Rqn3.mjs";
import { n as resolveEffectiveToolPolicy } from "./agent-tools.policy-Ni4Rljqy.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-Dk4uhhe-.mjs";
import { c as createChannelQuestionPromptDelivery } from "./ask-user-tool-DcCDTlep.mjs";
import { n as resolveRequesterToolPolicies } from "./requester-tool-policy-DKOkDnWE.mjs";
import { t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-CR7_5ABm.mjs";
import { a as prepareSandboxSessionRename, r as hasSessionControlAuthority } from "./conversation-capability-profile-BbWs7GzU.mjs";
import { n as resolveEventSessionRoutingPolicy } from "./event-session-routing-yXV1vWY_.mjs";
import { r as nodeExecSchema } from "./bash-tools.schemas-CYQpq8j2.mjs";
import { r as resolveExecDefaults } from "./exec-defaults-B7HapOub.mjs";
import { n as buildDefaultToolPolicyPipelineSteps, t as applyToolPolicyPipeline } from "./tool-policy-pipeline-DFP1wzZs.mjs";
import { a as applyDelegationCapability, i as createScheduledMessageInvocationAdmission, r as prepareSessionPortalToolTarget, t as createOpenClawCodingTools } from "./agent-tools-BnAlih5u.mjs";
import { t as applyToolAvailabilityDescriptions } from "./agent-tools.deferred-followup-B5rTfhz2.mjs";
import { s as filterToolsByMessageProvider } from "./core-coding-tools-B4ma0cx9.mjs";
import { n as resolveExecToolConfig, t as createLazyExecTool } from "./lazy-exec-tool-DaqWwvlf.mjs";
import { d as createSwarmCollectorWriteAuthority, f as resolveSwarmCollectorToolContext, t as createOpenClawTools, u as applySwarmCollectorToolContract } from "./openclaw-tools-Dd40cGRU.mjs";
import { n as filterRequesterYieldTools } from "./openclaw-tools.requester-yield-BVTStOp5.mjs";
import { r as GATEWAY_OWNER_ONLY_CORE_TOOLS, t as DEFAULT_GATEWAY_HTTP_TOOL_DENY } from "./dangerous-tools-D5_2xo_6.mjs";
import { i as replaceWithEffectiveCronCreatorToolAllowlist, r as captureFinalEffectiveCronCreatorToolAllowlist } from "./cron-tool-CwBBtBRr.mjs";
import { t as buildDeclaredToolAllowlistContext } from "./tool-policy-declared-context-RUtIwUST.mjs";
import { r as resolveCoreToolFactoryFamily } from "./core-tool-factory-descriptors-DYpD_U2M.mjs";
//#region src/gateway/tool-resolution.ts
/** Resolve the tools visible to a gateway caller after agent, channel, and surface policy. */
function resolveGatewayScopedTools(params) {
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
	const isOwnerInternalSession = nodeExecSurface && params.senderIsOwner === true && normalizeMessageChannel(params.messageProvider) === "webchat";
	const requesterPolicies = resolveRequesterToolPolicies({
		config: params.cfg,
		sessionKey: runtimePolicySessionKey,
		subagentSessionKey: runtimePolicySessionKey,
		agentId: policyAgentId,
		spawnedBy: params.spawnedBy,
		messageProvider: params.messageProvider,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		accountId: gatewayCaller.accountId ?? null,
		senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		sessionId: params.sessionId,
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		senderPolicyMode: params.scheduledToolPolicy ? "never" : nodeExecSurface ? isOwnerInternalSession ? "never" : "always" : "when-sender-id",
		groupPolicySessionKey: params.scheduledToolPolicy?.ownerSessionKey,
		requireConfiguredGroupAccount: params.scheduledToolPolicy?.mode === "account"
	});
	const { groupPolicy, senderPolicy, subagentPolicy, inheritedToolPolicy } = requesterPolicies;
	if (params.trustedInternalHandoff && requesterPolicies.requesterPolicySource !== "completion-handoff") throw new Error("CLI completion tool grant no longer matches its requester policy");
	const sandboxRuntime = resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: sessionAgentId,
		classificationSessionKey: runtimePolicySessionKey,
		classificationAgentId: policyAgentId
	});
	const sandboxed = params.rootedExecution ? Boolean(params.rootedExecution.sandbox) : sandboxRuntime.sandboxed;
	const preparedSandboxPolicy = params.rootedExecution ? params.rootedExecution.sandbox?.tools : sandboxRuntime.sandboxed ? sandboxRuntime.toolPolicy : void 0;
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
	const ownerOnlyGatewayDeny = [...params.senderIsOwner === false || surface === "http" && params.senderIsOwner !== true ? GATEWAY_OWNER_ONLY_CORE_TOOLS.filter((name) => name !== "sessions" && (name !== "portal" || !sessionPortalTarget)) : [], ...params.senderIsOwner !== true && !assignmentAdmitted && !(surface === "loopback" && hasSessionControlAuthority(sessionControlAuthority)) ? ["sessions"] : []];
	const workspaceDir = params.rootedExecution?.workspaceDir ?? (params.workspaceDir?.trim() || resolveAgentWorkspaceDir(params.cfg, sessionAgentId));
	const basePolicies = [
		profilePolicy,
		providerProfilePolicy,
		globalPolicy,
		globalProviderPolicy,
		agentPolicy,
		agentProviderPolicy,
		groupPolicy,
		senderPolicy,
		sandboxPolicy,
		subagentPolicy,
		inheritedToolPolicy
	];
	const requestedPolicies = [...basePolicies, gatewayRequestedTools.length > 0 ? { allow: gatewayRequestedTools } : void 0];
	const explicitDenylist = collectExplicitDenylist([
		...basePolicies,
		defaultGatewayDeny.length > 0 ? { deny: defaultGatewayDeny } : void 0,
		ownerOnlyGatewayDeny.length > 0 ? { deny: ownerOnlyGatewayDeny } : void 0,
		Array.isArray(gatewayToolsCfg?.deny) ? { deny: gatewayToolsCfg.deny } : void 0
	]);
	const inheritedToolDenylist = [...explicitDenylist];
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
	const openClawTools = createOpenClawTools({
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
		runId: params.runId,
		assertInputCommitAllowed: params.assertInputCommitAllowed,
		assertInvocationCurrent: params.assertInvocationCurrent || params.isGrantCurrent ? () => {
			params.assertInvocationCurrent?.();
			if (params.isGrantCurrent && !params.isGrantCurrent()) throw new Error("Gateway tool invocation grant is no longer active");
		} : void 0,
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
		agentAccountId: params.accountId,
		questionPrompt: createChannelQuestionPromptDelivery({
			cfg: params.cfg,
			channel: params.messageProvider,
			to: params.currentChannelId ?? params.agentTo,
			accountId: params.accountId,
			threadId: params.currentThreadTs ?? params.agentThreadId
		}),
		gatewayCallerAccountId: gatewayCaller.accountId,
		gatewayCallerChannel: gatewayCaller.channel,
		gatewayCallerLocal: gatewayCaller.local,
		inboundEventKind: params.inboundEventKind,
		sourceReplyDeliveryMode,
		sourceReplyOnly: params.sourceReplyOnly,
		taskSuggestionDeliveryMode: params.taskSuggestionDeliveryMode,
		agentTo: params.agentTo,
		agentThreadId: params.agentThreadId,
		currentChannelId: params.currentChannelId ?? params.agentTo,
		currentThreadTs: params.currentThreadTs ?? params.agentThreadId,
		currentMessageId: params.currentMessageId,
		replyToMode: params.replyToMode,
		currentInboundAudio: params.currentInboundAudio,
		sessionId: params.sessionId,
		onYield: params.onYield,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget,
		senderIsOwner: params.senderIsOwner,
		requesterSenderId: senderId,
		sessionControlAuthority,
		sandboxSessionRenameOnly,
		conversationReadOrigin: params.conversationReadOrigin,
		allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
		skillWorkshop: params.skillWorkshop,
		allowMediaInvokeCommands: params.allowMediaInvokeCommands,
		disablePluginTools: params.disablePluginTools,
		wrapBeforeToolCallHook: false,
		config: params.cfg,
		sessionConfigSource: "runtime",
		agentDir: params.agentDir,
		authProfileStore: params.authProfileStore,
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		modelHasVision: params.modelHasVision,
		requesterModel: params.requesterModel,
		pairedNodeComputerUse: params.pairedNodeComputerUse,
		clientCaps: params.clientCaps,
		gatewayUiCommandTarget: params.gatewayUiCommandTarget,
		pinnedWidgetAuthoring: surface === "loopback" ? params.pinnedWidgetAuthoring : void 0,
		workspaceDir,
		sandboxed,
		...params.rootedExecution ? {
			cwd: params.rootedExecution.cwd,
			fsPolicy: {
				workspaceOnly: true,
				root: params.rootedExecution.root
			},
			sessionPermissionPolicy: params.rootedExecution.sessionPermissionPolicy,
			sandboxRoot: params.rootedExecution.sandbox?.workspaceDir,
			sandboxContainerWorkdir: params.rootedExecution.sandbox?.containerWorkdir,
			sandboxFsBridge: params.rootedExecution.sandbox?.fsBridge,
			sandboxBrowserBridgeUrl: params.rootedExecution.sandbox?.browser?.bridgeUrl,
			allowHostBrowserControl: params.rootedExecution.sandbox ? params.rootedExecution.sandbox.browserAllowHostControl : true
		} : {},
		pluginToolAllowlist: collectExplicitAllowlist(requestedPolicies),
		pluginToolDenylist: explicitDenylist,
		cronCreatorToolAllowlist,
		cronCreatorToolAllowlistCaptureRef,
		inheritedToolAllowlist,
		inheritedToolDenylist
	});
	const execDefaults = nodeExecSurface || mediatedToolNames.size > 0 ? resolveExecDefaults({
		cfg: params.cfg,
		sessionEntry: params.execSession,
		execOverrides: params.execOverrides,
		agentId: policyAgentId,
		sessionKey: runtimePolicySessionKey,
		sandboxAvailable: sandboxed
	}) : void 0;
	const nodeExecDefaults = nodeExecSurface && execDefaults?.canRequestNode === true && params.nodeExecAvailable?.(execDefaults.node) === true ? execDefaults : void 0;
	const includeNodeExecTool = nodeExecDefaults !== void 0;
	const execConfig = includeNodeExecTool ? resolveExecToolConfig({
		cfg: params.cfg,
		agentId: policyAgentId
	}) : void 0;
	const mediatedToolFamilies = new Set(Array.from(mediatedToolNames, resolveCoreToolFactoryFamily));
	const includeMediatedBaseCodingTools = mediatedToolFamilies.has("base-coding");
	const includeMediatedShellTools = mediatedToolFamilies.has("shell");
	const mediatedCodingTools = surface === "loopback" && (includeMediatedBaseCodingTools || includeMediatedShellTools) ? createOpenClawCodingTools({
		config: params.cfg,
		sessionConfigSource: "runtime",
		agentId: policyAgentId,
		sessionKey: runtimePolicySessionKey,
		runSessionKey: params.sessionKey,
		sessionId: params.sessionId,
		runId: params.runId,
		operationalRunInstance: params.admittedRunContext?.operationalRunInstance,
		workspaceDir,
		cwd: params.cwd?.trim() || workspaceDir,
		...params.rootedExecution,
		sandbox: params.rootedExecution?.sandbox ?? void 0,
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		modelHasVision: params.modelHasVision,
		requesterModel: params.requesterModel,
		pairedNodeComputerUse: params.pairedNodeComputerUse,
		messageProvider: params.messageProvider,
		messageChannel: params.messageProvider,
		clientCaps: params.clientCaps,
		gatewayUiCommandTarget: params.gatewayUiCommandTarget,
		agentAccountId: params.accountId,
		currentChannelId: params.currentChannelId,
		currentThreadTs: params.currentThreadTs,
		currentMessageId: params.currentMessageId,
		currentInboundAudio: params.currentInboundAudio,
		channelContext: params.channelContext,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		spawnedBy: params.spawnedBy,
		senderId: params.channelContext?.sender?.id,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		senderIsOwner: params.senderIsOwner,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		trigger: params.trigger,
		approvalReviewerDeviceId: params.approvalReviewerDeviceId,
		sourceReplyDeliveryMode,
		taskSuggestionDeliveryMode: params.taskSuggestionDeliveryMode,
		inboundEventKind: params.inboundEventKind,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget,
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
		},
		wrapBeforeToolCallHook: false
	}) : [];
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
	const toolsForMessageProvider = filterToolsByMessageProvider(allTools, params.messageProvider);
	let nativeCreatorTools = (params.nativeCronCreatorToolAllowlist ?? []).map((name) => ({ name }));
	const declaredToolAllowlist = buildDeclaredToolAllowlistContext({
		config: params.cfg,
		workspaceDir,
		toolDenylist: explicitDenylist
	});
	function filterGatewayToolPolicies(config, onFilter) {
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
					policy: inheritedToolPolicy,
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
		...ownerOnlyGatewayDeny,
		...Array.isArray(gatewayToolsCfg?.deny) ? gatewayToolsCfg.deny : [],
		...excludedToolNames
	].map(normalizeToolPolicyName));
	const tools = applySwarmCollectorToolContract(applyDelegationCapability(policyFiltered.filter((tool) => !gatewayDenySet.has(normalizeToolPolicyName(tool.name))), params.delegationCapability), {
		swarmCollector: Boolean(swarmCollectorContext),
		structuredOutputTool: openClawTools.find((tool) => tool.name === "structured_output")
	});
	const inheritableTools = includeNodeExecTool ? tools.filter((tool) => tool.name.trim().toLowerCase() !== "exec") : tools;
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
