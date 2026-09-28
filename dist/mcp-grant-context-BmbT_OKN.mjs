import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { i as resolveGatewayMessageChannel } from "./message-channel-normalize-2tAtQt1g.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-De-bcoks.mjs";
import { t as SESSION_PERMISSION_BY_EXEC_MODE } from "./session-permission-exec-mode-Bn0mEuts.mjs";
import { l as captureCronRequesterGrantIssuer, t as bindActiveCronAuthorityCurrentness } from "./cron-creator-authority-context-DhhZn7kB.mjs";
//#region src/agents/cli-runner/mcp-grant-context.ts
const cliMcpDelegationCapability = Symbol("cliMcpDelegationCapability");
/** Final tool projection and host-only requester capture share the prepared CLI turn. */
function finalizeCliMcpGrant(context, toolsAllow, nativeAuthorityPending, assertCurrent) {
	if (!context) return;
	const cronRequesterGrantIssuer = captureCronRequesterGrantIssuer(context.runId);
	const cronAuthorityCheck = bindActiveCronAuthorityCurrentness(context.runId);
	return {
		context: {
			...context,
			...toolsAllow !== void 0 ? { toolsAllow: [...toolsAllow] } : {},
			...nativeAuthorityPending ? { nativeCronCreatorToolAllowlist: null } : {}
		},
		...cronRequesterGrantIssuer ? { cronRequesterGrantIssuer } : {},
		...cronAuthorityCheck ? { cronAuthorityCheck } : {},
		assertCurrent
	};
}
function buildCliMcpDelegationCapabilityBinding(capability) {
	return capability === "report_only" ? { [cliMcpDelegationCapability]: capability } : {};
}
function readCliMcpDelegationCapability(run) {
	if (!(cliMcpDelegationCapability in run)) return;
	const capability = run[cliMcpDelegationCapability];
	return capability === "full" || capability === "report_only" ? capability : void 0;
}
function normalizeOptionalMcpContextValue(value) {
	return value?.trim() || void 0;
}
function buildCliMcpExecSession(sessionEntry, execOverrides) {
	const permissionMode = sessionEntry?.permissionMode;
	const effectivePermissionMode = permissionMode && execOverrides?.mode ? SESSION_PERMISSION_BY_EXEC_MODE[execOverrides.mode] : permissionMode;
	const execSession = {
		execHost: normalizeOptionalMcpContextValue(sessionEntry?.execHost),
		execNode: normalizeOptionalMcpContextValue(sessionEntry?.execNode),
		...effectivePermissionMode ? { permissionMode: effectivePermissionMode } : {}
	};
	return Object.values(execSession).some(Boolean) ? execSession : void 0;
}
function buildCliMcpExecOverrides(execOverrides) {
	if (!execOverrides) return;
	const scopedOverrides = {
		...execOverrides.mode !== void 0 ? { mode: execOverrides.mode } : {},
		...execOverrides.host !== void 0 ? { host: execOverrides.host } : {},
		...execOverrides.security !== void 0 ? { security: execOverrides.security } : {},
		...execOverrides.ask !== void 0 ? { ask: execOverrides.ask } : {},
		...execOverrides.node !== void 0 ? { node: execOverrides.node } : {}
	};
	return Object.keys(scopedOverrides).length > 0 ? scopedOverrides : void 0;
}
function buildCliMcpBashElevated(bashElevated) {
	if (!bashElevated) return;
	return {
		enabled: bashElevated.enabled,
		allowed: bashElevated.allowed,
		defaultLevel: bashElevated.defaultLevel,
		...bashElevated.fullAccessAvailable !== void 0 ? { fullAccessAvailable: bashElevated.fullAccessAvailable } : {},
		...bashElevated.fullAccessBlockedReason !== void 0 ? { fullAccessBlockedReason: bashElevated.fullAccessBlockedReason } : {}
	};
}
function buildCliMcpChannelContext(channelContext, senderId) {
	const resolvedSenderId = normalizeOptionalMcpContextValue(senderId ?? void 0) ?? normalizeOptionalMcpContextValue(channelContext?.sender?.id);
	const chatId = normalizeOptionalMcpContextValue(channelContext?.chat?.id);
	if (!resolvedSenderId && !chatId) return;
	return {
		...resolvedSenderId ? { sender: { id: resolvedSenderId } } : {},
		...chatId ? { chat: { id: chatId } } : {}
	};
}
function resolveCliMcpSessionKey(run, config, agentId) {
	return canonicalizeMainSessionAlias({
		cfg: config,
		agentId,
		sessionKey: run.sessionKey?.trim() || "main"
	});
}
function buildCliMcpGrantContext(params) {
	const sessionKey = resolveCliMcpSessionKey(params.run, params.config, params.agentId);
	const runtimePolicySessionKey = normalizeOptionalMcpContextValue(params.run.runtimePolicySessionKey);
	const clientCaps = uniqueStrings((params.run.clientCaps ?? []).map((cap) => cap.trim()).filter(Boolean));
	const execSession = buildCliMcpExecSession(params.run.sessionEntry, params.run.execOverrides);
	const execOverrides = buildCliMcpExecOverrides(params.run.execOverrides);
	const bashElevated = buildCliMcpBashElevated(params.run.bashElevated);
	const channelContext = buildCliMcpChannelContext(params.run.channelContext, params.run.senderId);
	const senderName = normalizeOptionalMcpContextValue(params.run.senderName ?? void 0);
	const senderUsername = normalizeOptionalMcpContextValue(params.run.senderUsername ?? void 0);
	const senderE164 = normalizeOptionalMcpContextValue(params.run.senderE164 ?? void 0);
	const groupId = normalizeOptionalMcpContextValue(params.run.groupId ?? void 0);
	const groupChannel = normalizeOptionalMcpContextValue(params.run.groupChannel ?? void 0);
	const groupSpace = normalizeOptionalMcpContextValue(params.run.groupSpace ?? void 0);
	const spawnedBy = normalizeOptionalMcpContextValue(params.run.spawnedBy ?? void 0);
	const messageProvider = resolveGatewayMessageChannel(params.run.messageChannel ?? params.run.messageProvider);
	const currentChannelId = normalizeOptionalMcpContextValue(params.run.currentChannelId);
	const grantedToolsAllow = params.run.cliToolAvailability?.openClaw ?? params.toolsAllow;
	const delegationCapability = readCliMcpDelegationCapability(params.run);
	const sourceReplyOnly = params.run.inputProvenance?.kind === "inter_session" && params.run.inputProvenance.sourceTool === "subagent_announce" && params.run.sourceReplyDeliveryMode === "message_tool_only" && grantedToolsAllow?.length === 1 && grantedToolsAllow[0] === "message";
	return {
		sessionKey,
		runtimePolicySessionKey,
		...params.runtimePolicyAgentId ? { runtimePolicyAgentId: params.runtimePolicyAgentId } : {},
		agentId: params.agentId,
		sessionId: normalizeOptionalMcpContextValue(params.run.sessionId),
		runId: normalizeOptionalMcpContextValue(params.run.runId),
		workspaceDir: params.run.workspaceDir,
		...normalizeOptionalMcpContextValue(params.run.cwd) ? { cwd: params.run.cwd?.trim() } : {},
		...params.toolsAllow ? { toolsAllow: params.toolsAllow } : {},
		...params.run.toolOverrides?.webSearch === false ? { webSearchDisabled: true } : {},
		...params.run.skillWorkshopProposalRevision ? { skillWorkshop: { proposalRevision: params.run.skillWorkshopProposalRevision } } : {},
		...delegationCapability ? { delegationCapability } : {},
		...params.run.scheduledToolPolicy ? { scheduledToolPolicy: { ...params.run.scheduledToolPolicy } } : {},
		...params.run.cronCreatorCallerOrigin ? { cronCreatorCallerOrigin: { ...params.run.cronCreatorCallerOrigin } } : {},
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		...params.run.requesterModel ? { requesterModel: {
			provider: params.run.requesterModel.provider,
			model: params.run.requesterModel.model
		} } : {},
		modelHasVision: params.run.modelHasVision,
		messageProvider,
		clientCaps: clientCaps.length > 0 ? clientCaps : void 0,
		gatewayUiCommandTarget: params.run.gatewayUiCommandTarget,
		...params.run.pinnedWidgetAuthoring === true ? { pinnedWidgetAuthoring: true } : {},
		currentChannelId,
		currentThreadTs: normalizeOptionalMcpContextValue(params.run.currentThreadTs),
		currentMessageId: params.run.currentMessageId == null ? void 0 : normalizeOptionalMcpContextValue(String(params.run.currentMessageId)),
		replyToMode: params.run.replyToMode,
		currentInboundAudio: params.run.currentInboundAudio === true ? true : void 0,
		accountId: normalizeOptionalMcpContextValue(params.run.agentAccountId),
		inboundEventKind: params.run.currentInboundEventKind,
		sourceReplyDeliveryMode: params.run.sourceReplyDeliveryMode,
		...sourceReplyOnly ? { sourceReplyOnly: true } : {},
		taskSuggestionDeliveryMode: params.run.taskSuggestionDeliveryMode,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget ? true : void 0,
		senderIsOwner: params.run.senderIsOwner === true,
		nodeExecAllowed: true,
		...execSession ? { execSession } : {},
		...execOverrides ? { execOverrides } : {},
		...bashElevated ? { bashElevated } : {},
		...params.run.trigger ? { trigger: params.run.trigger } : {},
		...normalizeOptionalMcpContextValue(params.run.approvalReviewerDeviceId) ? { approvalReviewerDeviceId: params.run.approvalReviewerDeviceId?.trim() } : {},
		...channelContext ? { channelContext } : {},
		...senderName ? { senderName } : {},
		...senderUsername ? { senderUsername } : {},
		...senderE164 ? { senderE164 } : {},
		...groupId ? { groupId } : {},
		...groupChannel ? { groupChannel } : {},
		...groupSpace ? { groupSpace } : {},
		...spawnedBy ? { spawnedBy } : {}
	};
}
//#endregion
export { normalizeOptionalMcpContextValue as i, buildCliMcpGrantContext as n, finalizeCliMcpGrant as r, buildCliMcpDelegationCapabilityBinding as t };
