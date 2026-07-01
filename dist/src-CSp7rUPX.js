import { $ as WebPushVapidPublicKeyParamsSchema, $n as TalkModeParamsSchema, $t as DeviceTokenRotateParamsSchema, A as SessionsDeleteParamsSchema, At as ChatMessageGetParamsSchema, B as SessionsPluginPatchParamsSchema, C as SessionsCleanupParamsSchema, Cn as CronUpdateParamsSchema, Ct as NodePresenceAlivePayloadSchema, D as SessionsCompactionListParamsSchema, Dn as ConfigSchemaLookupParamsSchema, Dr as AgentsFilesGetParamsSchema, Dt as ChatEventSchema, E as SessionsCompactionGetParamsSchema, En as ConfigPatchParamsSchema, Et as ChatAbortParamsSchema, Fn as CommandsListParamsSchema, Fr as AgentsUpdateParamsSchema, G as SessionsUsageParamsSchema, Gn as TalkClientCreateParamsSchema, Gr as SkillsProposalInspectParamsSchema, H as SessionsResetParamsSchema, Hn as TalkAgentControlResultSchema, Hr as SkillsProposalActionParamsSchema, Ht as ResponseFrameSchema, I as SessionsListParamsSchema, It as ConnectParamsSchema, J as PushTestParamsSchema, Jn as TalkClientToolCallParamsSchema, Jr as SkillsProposalRequestRevisionParamsSchema, Jt as DevicePairApproveParamsSchema, K as SecretsResolveParamsSchema, Kn as TalkClientCreateResultSchema, L as SessionsMessagesSubscribeParamsSchema, Ln as ChannelsLogoutParamsSchema, Lr as ModelsListParamsSchema, M as SessionsFilesGetParamsSchema, Mn as UpdateRunParamsSchema, Mt as ChatMetadataParamsSchema, Nn as UpdateStatusParamsSchema, Nr as AgentsListParamsSchema, Nt as ChatSendParamsSchema, O as SessionsCompactionRestoreParamsSchema, On as ConfigSchemaLookupResultSchema, Ot as ChatHistoryParamsSchema, P as SessionsFilesListParamsSchema, Pt as LogsTailParamsSchema, Q as WebPushUnsubscribeParamsSchema, Qn as TalkEventSchema, Qr as SkillsProposalsListParamsSchema, Qt as DeviceTokenRevokeParamsSchema, R as SessionsMessagesUnsubscribeParamsSchema, Rn as ChannelsStartParamsSchema, Rr as SkillsBinsParamsSchema, Rt as EventFrameSchema, S as SessionsAbortParamsSchema, Si as WakeParamsSchema, Sn as CronStatusParamsSchema, Sr as AgentsCreateParamsSchema, T as SessionsCompactionBranchParamsSchema, Tn as ConfigGetParamsSchema, Tt as NodeRenameParamsSchema, U as SessionsResolveParamsSchema, Un as TalkCatalogParamsSchema, V as SessionsPreviewParamsSchema, Vn as ChannelsStopParamsSchema, Vr as SkillsInstallParamsSchema, Vt as RequestFrameSchema, W as SessionsSendParamsSchema, Wn as TalkCatalogResultSchema, Wr as SkillsProposalCreateParamsSchema, X as WebPushSubscribeParamsSchema, Xn as TalkConfigParamsSchema, Xr as SkillsProposalReviseParamsSchema, Xt as DevicePairRejectParamsSchema, Yn as TalkClientToolCallResultSchema, Yt as DevicePairListParamsSchema, Z as WebPushTestParamsSchema, Zn as TalkConfigResultSchema, Zr as SkillsProposalUpdateParamsSchema, Zt as DevicePairRemoveParamsSchema, _i as AgentParamsSchema, _t as NodePairVerifyParamsSchema, a as WizardStartParamsSchema, an as ExecApprovalsNodeSetParamsSchema, ar as TalkSessionCreateResultSchema, at as PluginApprovalResolveParamsSchema, bi as PollParamsSchema, bn as CronRunParamsSchema, br as ArtifactsListParamsSchema, ci as SkillsUploadBeginParamsSchema, cr as TalkSessionOkResultSchema, ct as NodeEventResultSchema, d as TasksCancelParamsSchema, di as ToolsCatalogParamsSchema, dn as EnvironmentsStatusParamsSchema, dr as TalkSessionTurnParamsSchema, dt as NodeListParamsSchema, ei as SkillsSearchParamsSchema, en as ExecApprovalGetParamsSchema, er as TalkSessionAppendAudioParamsSchema, et as PluginsSessionActionParamsSchema, fi as ToolsEffectiveParamsSchema, fr as TalkSessionTurnResultSchema, ft as NodePairApproveParamsSchema, gn as CronGetParamsSchema, gr as WebLoginWaitParamsSchema, gt as NodePairRequestParamsSchema, h as TasksListParamsSchema, hi as AgentIdentityParamsSchema, hn as CronAddParamsSchema, hr as WebLoginStartParamsSchema, ht as NodePairRemoveParamsSchema, ii as SkillsSkillCardParamsSchema, in as ExecApprovalsNodeGetParamsSchema, ir as TalkSessionCreateParamsSchema, it as PluginApprovalRequestParamsSchema, j as SessionsDescribeParamsSchema, jn as ConfigSetParamsSchema, jr as AgentsFilesSetParamsSchema, jt as ChatMessageGetResultSchema, k as SessionsCreateParamsSchema, kn as ConfigSchemaParamsSchema, kr as AgentsFilesListParamsSchema, kt as ChatInjectParamsSchema, li as SkillsUploadChunkParamsSchema, ln as EnvironmentsListParamsSchema, lr as TalkSessionSteerParamsSchema, lt as NodeInvokeParamsSchema, mr as TalkSpeakResultSchema, mt as NodePairRejectParamsSchema, n as WizardCancelParamsSchema, ni as SkillsSecurityVerdictsParamsSchema, nn as ExecApprovalResolveParamsSchema, nr as TalkSessionCancelTurnParamsSchema, nt as PluginsUiDescriptorsParamsSchema, oi as SkillsStatusParamsSchema, on as ExecApprovalsSetParamsSchema, or as TalkSessionJoinParamsSchema, ot as NodeDescribeParamsSchema, p as TasksGetParamsSchema, pi as ToolsInvokeParamsSchema, pr as TalkSpeakParamsSchema, pt as NodePairListParamsSchema, q as SecretsResolveResultSchema, qn as TalkClientSteerParamsSchema, r as WizardNextParamsSchema, rn as ExecApprovalsGetParamsSchema, rr as TalkSessionCloseParamsSchema, rt as PluginsUiDescriptorsResultSchema, s as WizardStatusParamsSchema, si as SkillsUpdateParamsSchema, sr as TalkSessionJoinResultSchema, st as NodeEventParamsSchema, tn as ExecApprovalRequestParamsSchema, tr as TalkSessionCancelOutputParamsSchema, tt as PluginsSessionActionResultSchema, ui as SkillsUploadCommitParamsSchema, ur as TalkSessionSubmitToolResultParamsSchema, ut as NodeInvokeResultParamsSchema, vi as AgentWaitParamsSchema, vn as CronListParamsSchema, vr as ArtifactsDownloadParamsSchema, vt as NodePendingAckParamsSchema, w as SessionsCompactParamsSchema, wn as ConfigApplyParamsSchema, wr as AgentsDeleteParamsSchema, xi as SendParamsSchema, xn as CronRunsParamsSchema, xt as NodePendingEnqueueParamsSchema, yi as MessageActionParamsSchema, yn as CronRemoveParamsSchema, yr as ArtifactsGetParamsSchema, yt as NodePendingDrainParamsSchema, z as SessionsPatchParamsSchema, zn as ChannelsStatusParamsSchema, zr as SkillsDetailParamsSchema } from "./schema-Ctppm7Dp.js";
import { Compile } from "typebox/compile";
//#region packages/gateway-protocol/src/index.ts
function lazyCompile(schema) {
	let compiled;
	let errors = null;
	const getCompiled = () => {
		compiled ??= Compile(schema);
		return compiled;
	};
	const validate = ((data) => {
		const current = getCompiled();
		const valid = current.Check(data);
		errors = valid ? null : [...current.Errors(data)];
		return valid;
	});
	Object.defineProperties(validate, {
		errors: {
			configurable: true,
			enumerable: true,
			get: () => errors,
			set: (nextErrors) => {
				errors = nextErrors ?? null;
			}
		},
		schema: {
			configurable: true,
			enumerable: true,
			get: () => schema
		}
	});
	return validate;
}
const validateCommandsListParams = lazyCompile(CommandsListParamsSchema);
const validateConnectParams = lazyCompile(ConnectParamsSchema);
const validateRequestFrame = lazyCompile(RequestFrameSchema);
const validateResponseFrame = lazyCompile(ResponseFrameSchema);
const validateEventFrame = lazyCompile(EventFrameSchema);
const validateMessageActionParams = lazyCompile(MessageActionParamsSchema);
const validateSendParams = lazyCompile(SendParamsSchema);
const validatePollParams = lazyCompile(PollParamsSchema);
const validateAgentParams = lazyCompile(AgentParamsSchema);
const validateAgentIdentityParams = lazyCompile(AgentIdentityParamsSchema);
const validateAgentWaitParams = lazyCompile(AgentWaitParamsSchema);
const validateWakeParams = lazyCompile(WakeParamsSchema);
const validateAgentsListParams = lazyCompile(AgentsListParamsSchema);
const validateAgentsCreateParams = lazyCompile(AgentsCreateParamsSchema);
const validateAgentsUpdateParams = lazyCompile(AgentsUpdateParamsSchema);
const validateAgentsDeleteParams = lazyCompile(AgentsDeleteParamsSchema);
const validateAgentsFilesListParams = lazyCompile(AgentsFilesListParamsSchema);
const validateAgentsFilesGetParams = lazyCompile(AgentsFilesGetParamsSchema);
const validateAgentsFilesSetParams = lazyCompile(AgentsFilesSetParamsSchema);
const validateArtifactsListParams = lazyCompile(ArtifactsListParamsSchema);
const validateArtifactsGetParams = lazyCompile(ArtifactsGetParamsSchema);
const validateArtifactsDownloadParams = lazyCompile(ArtifactsDownloadParamsSchema);
const validateNodePairRequestParams = lazyCompile(NodePairRequestParamsSchema);
const validateNodePairListParams = lazyCompile(NodePairListParamsSchema);
const validateNodePairApproveParams = lazyCompile(NodePairApproveParamsSchema);
const validateNodePairRejectParams = lazyCompile(NodePairRejectParamsSchema);
const validateNodePairRemoveParams = lazyCompile(NodePairRemoveParamsSchema);
const validateNodePairVerifyParams = lazyCompile(NodePairVerifyParamsSchema);
const validateNodeRenameParams = lazyCompile(NodeRenameParamsSchema);
const validateNodeListParams = lazyCompile(NodeListParamsSchema);
const validateEnvironmentsListParams = lazyCompile(EnvironmentsListParamsSchema);
const validateEnvironmentsStatusParams = lazyCompile(EnvironmentsStatusParamsSchema);
const validateNodePendingAckParams = lazyCompile(NodePendingAckParamsSchema);
const validateNodeDescribeParams = lazyCompile(NodeDescribeParamsSchema);
const validateNodeInvokeParams = lazyCompile(NodeInvokeParamsSchema);
const validateNodeInvokeResultParams = lazyCompile(NodeInvokeResultParamsSchema);
const validateNodeEventParams = lazyCompile(NodeEventParamsSchema);
const validateNodeEventResult = lazyCompile(NodeEventResultSchema);
const validateNodePresenceAlivePayload = lazyCompile(NodePresenceAlivePayloadSchema);
const validateNodePendingDrainParams = lazyCompile(NodePendingDrainParamsSchema);
const validateNodePendingEnqueueParams = lazyCompile(NodePendingEnqueueParamsSchema);
const validatePushTestParams = lazyCompile(PushTestParamsSchema);
const validateWebPushVapidPublicKeyParams = lazyCompile(WebPushVapidPublicKeyParamsSchema);
const validateWebPushSubscribeParams = lazyCompile(WebPushSubscribeParamsSchema);
const validateWebPushUnsubscribeParams = lazyCompile(WebPushUnsubscribeParamsSchema);
const validateWebPushTestParams = lazyCompile(WebPushTestParamsSchema);
const validateSecretsResolveParams = lazyCompile(SecretsResolveParamsSchema);
const validateSecretsResolveResult = lazyCompile(SecretsResolveResultSchema);
const validateSessionsListParams = lazyCompile(SessionsListParamsSchema);
const validateSessionsCleanupParams = lazyCompile(SessionsCleanupParamsSchema);
const validateSessionsPreviewParams = lazyCompile(SessionsPreviewParamsSchema);
const validateSessionsDescribeParams = lazyCompile(SessionsDescribeParamsSchema);
const validateSessionsResolveParams = lazyCompile(SessionsResolveParamsSchema);
const validateSessionsFilesListParams = lazyCompile(SessionsFilesListParamsSchema);
const validateSessionsFilesGetParams = lazyCompile(SessionsFilesGetParamsSchema);
const validateSessionsCreateParams = lazyCompile(SessionsCreateParamsSchema);
const validateSessionsSendParams = lazyCompile(SessionsSendParamsSchema);
const validateSessionsMessagesSubscribeParams = lazyCompile(SessionsMessagesSubscribeParamsSchema);
const validateSessionsMessagesUnsubscribeParams = lazyCompile(SessionsMessagesUnsubscribeParamsSchema);
const validateSessionsAbortParams = lazyCompile(SessionsAbortParamsSchema);
const validateSessionsPatchParams = lazyCompile(SessionsPatchParamsSchema);
const validateSessionsPluginPatchParams = lazyCompile(SessionsPluginPatchParamsSchema);
const validateSessionsResetParams = lazyCompile(SessionsResetParamsSchema);
const validateSessionsDeleteParams = lazyCompile(SessionsDeleteParamsSchema);
const validateSessionsCompactParams = lazyCompile(SessionsCompactParamsSchema);
const validateSessionsCompactionListParams = lazyCompile(SessionsCompactionListParamsSchema);
const validateSessionsCompactionGetParams = lazyCompile(SessionsCompactionGetParamsSchema);
const validateSessionsCompactionBranchParams = lazyCompile(SessionsCompactionBranchParamsSchema);
const validateSessionsCompactionRestoreParams = lazyCompile(SessionsCompactionRestoreParamsSchema);
const validateSessionsUsageParams = lazyCompile(SessionsUsageParamsSchema);
const validateTasksListParams = lazyCompile(TasksListParamsSchema);
const validateTasksGetParams = lazyCompile(TasksGetParamsSchema);
const validateTasksCancelParams = lazyCompile(TasksCancelParamsSchema);
const validateConfigGetParams = lazyCompile(ConfigGetParamsSchema);
const validateConfigSetParams = lazyCompile(ConfigSetParamsSchema);
const validateConfigApplyParams = lazyCompile(ConfigApplyParamsSchema);
const validateConfigPatchParams = lazyCompile(ConfigPatchParamsSchema);
const validateConfigSchemaParams = lazyCompile(ConfigSchemaParamsSchema);
const validateConfigSchemaLookupParams = lazyCompile(ConfigSchemaLookupParamsSchema);
const validateConfigSchemaLookupResult = lazyCompile(ConfigSchemaLookupResultSchema);
const validateWizardStartParams = lazyCompile(WizardStartParamsSchema);
const validateWizardNextParams = lazyCompile(WizardNextParamsSchema);
const validateWizardCancelParams = lazyCompile(WizardCancelParamsSchema);
const validateWizardStatusParams = lazyCompile(WizardStatusParamsSchema);
const validateTalkModeParams = lazyCompile(TalkModeParamsSchema);
const validateTalkEvent = lazyCompile(TalkEventSchema);
const validateTalkCatalogParams = lazyCompile(TalkCatalogParamsSchema);
const validateTalkCatalogResult = lazyCompile(TalkCatalogResultSchema);
const validateTalkConfigParams = lazyCompile(TalkConfigParamsSchema);
const validateTalkConfigResult = lazyCompile(TalkConfigResultSchema);
const validateTalkClientCreateParams = lazyCompile(TalkClientCreateParamsSchema);
const validateTalkClientCreateResult = lazyCompile(TalkClientCreateResultSchema);
const validateTalkClientToolCallParams = lazyCompile(TalkClientToolCallParamsSchema);
const validateTalkClientToolCallResult = lazyCompile(TalkClientToolCallResultSchema);
const validateTalkClientSteerParams = lazyCompile(TalkClientSteerParamsSchema);
const validateTalkAgentControlResult = lazyCompile(TalkAgentControlResultSchema);
const validateTalkSessionCreateParams = lazyCompile(TalkSessionCreateParamsSchema);
const validateTalkSessionCreateResult = lazyCompile(TalkSessionCreateResultSchema);
const validateTalkSessionJoinParams = lazyCompile(TalkSessionJoinParamsSchema);
const validateTalkSessionJoinResult = lazyCompile(TalkSessionJoinResultSchema);
const validateTalkSessionAppendAudioParams = lazyCompile(TalkSessionAppendAudioParamsSchema);
const validateTalkSessionTurnParams = lazyCompile(TalkSessionTurnParamsSchema);
const validateTalkSessionCancelTurnParams = lazyCompile(TalkSessionCancelTurnParamsSchema);
const validateTalkSessionCancelOutputParams = lazyCompile(TalkSessionCancelOutputParamsSchema);
const validateTalkSessionTurnResult = lazyCompile(TalkSessionTurnResultSchema);
const validateTalkSessionSteerParams = lazyCompile(TalkSessionSteerParamsSchema);
const validateTalkSessionSubmitToolResultParams = lazyCompile(TalkSessionSubmitToolResultParamsSchema);
const validateTalkSessionCloseParams = lazyCompile(TalkSessionCloseParamsSchema);
const validateTalkSessionOkResult = lazyCompile(TalkSessionOkResultSchema);
const validateTalkSpeakParams = lazyCompile(TalkSpeakParamsSchema);
const validateTalkSpeakResult = lazyCompile(TalkSpeakResultSchema);
const validateChannelsStatusParams = lazyCompile(ChannelsStatusParamsSchema);
const validateChannelsStartParams = lazyCompile(ChannelsStartParamsSchema);
const validateChannelsStopParams = lazyCompile(ChannelsStopParamsSchema);
const validateChannelsLogoutParams = lazyCompile(ChannelsLogoutParamsSchema);
const validateModelsListParams = lazyCompile(ModelsListParamsSchema);
const validateSkillsStatusParams = lazyCompile(SkillsStatusParamsSchema);
const validateToolsCatalogParams = lazyCompile(ToolsCatalogParamsSchema);
const validateToolsEffectiveParams = lazyCompile(ToolsEffectiveParamsSchema);
const validateToolsInvokeParams = lazyCompile(ToolsInvokeParamsSchema);
const validateSkillsBinsParams = lazyCompile(SkillsBinsParamsSchema);
const validateSkillsInstallParams = lazyCompile(SkillsInstallParamsSchema);
const validateSkillsUploadBeginParams = lazyCompile(SkillsUploadBeginParamsSchema);
const validateSkillsUploadChunkParams = lazyCompile(SkillsUploadChunkParamsSchema);
const validateSkillsUploadCommitParams = lazyCompile(SkillsUploadCommitParamsSchema);
const validateSkillsUpdateParams = lazyCompile(SkillsUpdateParamsSchema);
const validateSkillsSearchParams = lazyCompile(SkillsSearchParamsSchema);
const validateSkillsDetailParams = lazyCompile(SkillsDetailParamsSchema);
const validateSkillsProposalsListParams = lazyCompile(SkillsProposalsListParamsSchema);
const validateSkillsProposalInspectParams = lazyCompile(SkillsProposalInspectParamsSchema);
const validateSkillsProposalCreateParams = lazyCompile(SkillsProposalCreateParamsSchema);
const validateSkillsProposalUpdateParams = lazyCompile(SkillsProposalUpdateParamsSchema);
const validateSkillsProposalReviseParams = lazyCompile(SkillsProposalReviseParamsSchema);
const validateSkillsProposalRequestRevisionParams = lazyCompile(SkillsProposalRequestRevisionParamsSchema);
const validateSkillsProposalActionParams = lazyCompile(SkillsProposalActionParamsSchema);
const validateSkillsSecurityVerdictsParams = lazyCompile(SkillsSecurityVerdictsParamsSchema);
const validateSkillsSkillCardParams = lazyCompile(SkillsSkillCardParamsSchema);
const validateCronListParams = lazyCompile(CronListParamsSchema);
const validateCronStatusParams = lazyCompile(CronStatusParamsSchema);
const validateCronGetParams = lazyCompile(CronGetParamsSchema);
const validateCronAddParams = lazyCompile(CronAddParamsSchema);
const validateCronUpdateParams = lazyCompile(CronUpdateParamsSchema);
const validateCronRemoveParams = lazyCompile(CronRemoveParamsSchema);
const validateCronRunParams = lazyCompile(CronRunParamsSchema);
const validateCronRunsParams = lazyCompile(CronRunsParamsSchema);
const validateDevicePairListParams = lazyCompile(DevicePairListParamsSchema);
const validateDevicePairApproveParams = lazyCompile(DevicePairApproveParamsSchema);
const validateDevicePairRejectParams = lazyCompile(DevicePairRejectParamsSchema);
const validateDevicePairRemoveParams = lazyCompile(DevicePairRemoveParamsSchema);
const validateDeviceTokenRotateParams = lazyCompile(DeviceTokenRotateParamsSchema);
const validateDeviceTokenRevokeParams = lazyCompile(DeviceTokenRevokeParamsSchema);
const validateExecApprovalsGetParams = lazyCompile(ExecApprovalsGetParamsSchema);
const validateExecApprovalsSetParams = lazyCompile(ExecApprovalsSetParamsSchema);
const validateExecApprovalGetParams = lazyCompile(ExecApprovalGetParamsSchema);
const validateExecApprovalRequestParams = lazyCompile(ExecApprovalRequestParamsSchema);
const validateExecApprovalResolveParams = lazyCompile(ExecApprovalResolveParamsSchema);
const validatePluginApprovalRequestParams = lazyCompile(PluginApprovalRequestParamsSchema);
const validatePluginApprovalResolveParams = lazyCompile(PluginApprovalResolveParamsSchema);
const validatePluginsUiDescriptorsParams = lazyCompile(PluginsUiDescriptorsParamsSchema);
const validatePluginsUiDescriptorsResult = lazyCompile(PluginsUiDescriptorsResultSchema);
const validatePluginsSessionActionParams = lazyCompile(PluginsSessionActionParamsSchema);
const validatePluginsSessionActionResult = lazyCompile(PluginsSessionActionResultSchema);
const validateExecApprovalsNodeGetParams = lazyCompile(ExecApprovalsNodeGetParamsSchema);
const validateExecApprovalsNodeSetParams = lazyCompile(ExecApprovalsNodeSetParamsSchema);
const validateLogsTailParams = lazyCompile(LogsTailParamsSchema);
const validateChatHistoryParams = lazyCompile(ChatHistoryParamsSchema);
const validateChatMetadataParams = lazyCompile(ChatMetadataParamsSchema);
const validateChatMessageGetParams = lazyCompile(ChatMessageGetParamsSchema);
const validateChatSendParams = lazyCompile(ChatSendParamsSchema);
const validateChatAbortParams = lazyCompile(ChatAbortParamsSchema);
const validateChatInjectParams = lazyCompile(ChatInjectParamsSchema);
const validateChatEvent = lazyCompile(ChatEventSchema);
const validateChatMessageGetResult = lazyCompile(ChatMessageGetResultSchema);
const validateUpdateStatusParams = lazyCompile(UpdateStatusParamsSchema);
const validateUpdateRunParams = lazyCompile(UpdateRunParamsSchema);
const validateWebLoginStartParams = lazyCompile(WebLoginStartParamsSchema);
const validateWebLoginWaitParams = lazyCompile(WebLoginWaitParamsSchema);
function firstStringParam(value) {
	if (typeof value === "string" && value.trim()) return value;
	if (Array.isArray(value)) return value.find((entry) => typeof entry === "string" && entry.trim().length > 0);
}
/** Convert validator errors into compact operator-facing failure text. */
function formatValidationErrors(errors) {
	if (!errors?.length) return "unknown validation error";
	const parts = [];
	for (const err of errors) {
		const keyword = typeof err?.keyword === "string" ? err.keyword : "";
		const instancePath = typeof err?.instancePath === "string" ? err.instancePath : "";
		if (keyword === "additionalProperties") {
			const additionalProperty = firstStringParam(err?.params?.additionalProperty) ?? firstStringParam(err?.params?.additionalProperties);
			if (additionalProperty) {
				const where = instancePath ? `at ${instancePath}` : "at root";
				parts.push(`${where}: unexpected property '${additionalProperty}'`);
				continue;
			}
		}
		if (keyword === "required") {
			const missingProperty = firstStringParam(err?.params?.missingProperty) ?? firstStringParam(err?.params?.requiredProperties);
			if (missingProperty) {
				const where = instancePath ? `at ${instancePath}: ` : "";
				parts.push(`${where}must have required property '${missingProperty}'`);
				continue;
			}
		}
		const failingKeyword = typeof err?.params?.failingKeyword === "string" ? err.params.failingKeyword : "";
		const message = keyword === "then" || keyword === "if" && failingKeyword === "then" ? "must have required conditional properties" : typeof err?.message === "string" && err.message.trim() ? err.message : "validation error";
		const where = instancePath ? `at ${instancePath}: ` : "";
		parts.push(`${where}${message}`);
	}
	const unique = uniqueStrings(parts.filter((part) => part.trim()));
	if (!unique.length) return "unknown validation error";
	return unique.join("; ");
}
function uniqueStrings(values) {
	return [...new Set(values)];
}
//#endregion
export { validateExecApprovalGetParams as $, validateTasksGetParams as $n, validateSessionsMessagesUnsubscribeParams as $t, validateConfigPatchParams as A, validateTalkClientSteerParams as An, validatePluginsUiDescriptorsParams as At, validateCronRunParams as B, validateTalkSessionCloseParams as Bn, validateSessionsCleanupParams as Bt, validateChatMessageGetParams as C, validateSkillsUploadChunkParams as Cn, validateNodePendingEnqueueParams as Ct, validateCommandsListParams as D, validateTalkCatalogResult as Dn, validatePluginApprovalResolveParams as Dt, validateChatSendParams as E, validateTalkCatalogParams as En, validatePluginApprovalRequestParams as Et, validateConnectParams as F, validateTalkEvent as Fn, validateResponseFrame as Ft, validateDevicePairListParams as G, validateTalkSessionOkResult as Gn, validateSessionsCompactionRestoreParams as Gt, validateCronStatusParams as H, validateTalkSessionCreateResult as Hn, validateSessionsCompactionBranchParams as Ht, validateCronAddParams as I, validateTalkModeParams as In, validateSecretsResolveParams as It, validateDeviceTokenRevokeParams as J, validateTalkSessionTurnParams as Jn, validateSessionsDescribeParams as Jt, validateDevicePairRejectParams as K, validateTalkSessionSteerParams as Kn, validateSessionsCreateParams as Kt, validateCronGetParams as L, validateTalkSessionAppendAudioParams as Ln, validateSecretsResolveResult as Lt, validateConfigSchemaLookupResult as M, validateTalkClientToolCallResult as Mn, validatePollParams as Mt, validateConfigSchemaParams as N, validateTalkConfigParams as Nn, validatePushTestParams as Nt, validateConfigApplyParams as O, validateTalkClientCreateParams as On, validatePluginsSessionActionParams as Ot, validateConfigSetParams as P, validateTalkConfigResult as Pn, validateRequestFrame as Pt, validateEventFrame as Q, validateTasksCancelParams as Qn, validateSessionsMessagesSubscribeParams as Qt, validateCronListParams as R, validateTalkSessionCancelOutputParams as Rn, validateSendParams as Rt, validateChatInjectParams as S, validateSkillsUploadBeginParams as Sn, validateNodePendingDrainParams as St, validateChatMetadataParams as T, validateTalkAgentControlResult as Tn, validateNodeRenameParams as Tt, validateCronUpdateParams as U, validateTalkSessionJoinParams as Un, validateSessionsCompactionGetParams as Ut, validateCronRunsParams as V, validateTalkSessionCreateParams as Vn, validateSessionsCompactParams as Vt, validateDevicePairApproveParams as W, validateTalkSessionJoinResult as Wn, validateSessionsCompactionListParams as Wt, validateEnvironmentsListParams as X, validateTalkSpeakParams as Xn, validateSessionsFilesListParams as Xt, validateDeviceTokenRotateParams as Y, validateTalkSessionTurnResult as Yn, validateSessionsFilesGetParams as Yt, validateEnvironmentsStatusParams as Z, validateTalkSpeakResult as Zn, validateSessionsListParams as Zt, validateChannelsStatusParams as _, validateSkillsSearchParams as _n, validateNodePairRejectParams as _t, validateAgentsCreateParams as a, validateSessionsSendParams as an, validateUpdateStatusParams as ar, validateExecApprovalsSetParams as at, validateChatEvent as b, validateSkillsStatusParams as bn, validateNodePairVerifyParams as bt, validateAgentsFilesListParams as c, validateSkillsDetailParams as cn, validateWebLoginWaitParams as cr, validateModelsListParams as ct, validateAgentsUpdateParams as d, validateSkillsProposalCreateParams as dn, validateWebPushUnsubscribeParams as dr, validateNodeEventResult as dt, validateSessionsPatchParams as en, validateTasksListParams as er, validateExecApprovalRequestParams as et, validateArtifactsDownloadParams as f, validateSkillsProposalInspectParams as fn, validateWebPushVapidPublicKeyParams as fr, validateNodeInvokeParams as ft, validateChannelsStartParams as g, validateSkillsProposalsListParams as gn, validateWizardStatusParams as gr, validateNodePairListParams as gt, validateChannelsLogoutParams as h, validateSkillsProposalUpdateParams as hn, validateWizardStartParams as hr, validateNodePairApproveParams as ht, validateAgentWaitParams as i, validateSessionsResolveParams as in, validateUpdateRunParams as ir, validateExecApprovalsNodeSetParams as it, validateConfigSchemaLookupParams as j, validateTalkClientToolCallParams as jn, validatePluginsUiDescriptorsResult as jt, validateConfigGetParams as k, validateTalkClientCreateResult as kn, validatePluginsSessionActionResult as kt, validateAgentsFilesSetParams as l, validateSkillsInstallParams as ln, validateWebPushSubscribeParams as lr, validateNodeDescribeParams as lt, validateArtifactsListParams as m, validateSkillsProposalReviseParams as mn, validateWizardNextParams as mr, validateNodeListParams as mt, validateAgentIdentityParams as n, validateSessionsPreviewParams as nn, validateToolsEffectiveParams as nr, validateExecApprovalsGetParams as nt, validateAgentsDeleteParams as o, validateSessionsUsageParams as on, validateWakeParams as or, validateLogsTailParams as ot, validateArtifactsGetParams as p, validateSkillsProposalRequestRevisionParams as pn, validateWizardCancelParams as pr, validateNodeInvokeResultParams as pt, validateDevicePairRemoveParams as q, validateTalkSessionSubmitToolResultParams as qn, validateSessionsDeleteParams as qt, validateAgentParams as r, validateSessionsResetParams as rn, validateToolsInvokeParams as rr, validateExecApprovalsNodeGetParams as rt, validateAgentsFilesGetParams as s, validateSkillsBinsParams as sn, validateWebLoginStartParams as sr, validateMessageActionParams as st, formatValidationErrors as t, validateSessionsPluginPatchParams as tn, validateToolsCatalogParams as tr, validateExecApprovalResolveParams as tt, validateAgentsListParams as u, validateSkillsProposalActionParams as un, validateWebPushTestParams as ur, validateNodeEventParams as ut, validateChannelsStopParams as v, validateSkillsSecurityVerdictsParams as vn, validateNodePairRemoveParams as vt, validateChatMessageGetResult as w, validateSkillsUploadCommitParams as wn, validateNodePresenceAlivePayload as wt, validateChatHistoryParams as x, validateSkillsUpdateParams as xn, validateNodePendingAckParams as xt, validateChatAbortParams as y, validateSkillsSkillCardParams as yn, validateNodePairRequestParams as yt, validateCronRemoveParams as z, validateTalkSessionCancelTurnParams as zn, validateSessionsAbortParams as zt };
