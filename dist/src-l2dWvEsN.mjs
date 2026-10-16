import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isNonEmptyProtocolString } from "./protocol-value-normalization-Oati9UF1.mjs";
import { C as isThemeId, r as THEME_ARTWORK_ID_PATTERN, w as normalizeThemeMode } from "./theme-_hQKgfH-.mjs";
import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString, c as Sha256String, i as InputProvenanceSchema, s as SessionLabelString, t as ChatSendSessionKeyString } from "./primitives-CYT6MDvz.mjs";
import { $ as SkillsSkillCardParamsSchema, $t as EnvironmentsStatusParamsSchema, A as SkillsDetailParamsSchema, B as SkillsProposalInspectParamsSchema, Bt as GatewayContextWindowOptionSchema, C as ModelsAuthStatusParamsSchema, Dt as ToolsInvokeParamsSchema, Et as ToolsGitHubStatusResultSchema, F as SkillsProposalDecisionParamsSchema, Ft as SecretsStoreListResultSchema, G as SkillsProposalReviseParamsSchema, Gt as EnvironmentsCreateParamsSchema, I as SkillsProposalEvaluateParamsSchema, It as SecretsStoreMutationResultSchema, K as SkillsProposalUpdateParamsSchema, Lt as SecretsStoreSetParamsSchema, M as SkillsProposalActionParamsSchema, Mt as SecretsResolveResultSchema, Nt as SecretsStoreDeleteParamsSchema, P as SkillsProposalCreateParamsSchema, Pt as SecretsStoreListParamsSchema, Qt as EnvironmentsPrepareResultSchema, R as SkillsProposalEventsListParamsSchema, Rt as GatewayAgentRuntimeSchema, S as ModelsAuthSetApiKeyResultSchema, St as ToolsGitHubConfigureParamsSchema, Tt as ToolsGitHubStatusParamsSchema, U as SkillsProposalRequestRevisionParamsSchema, Vt as GatewayThinkingLevelOptionSchema, Y as SkillsSearchParamsSchema, Yt as EnvironmentsListParamsSchema, Z as SkillsSecurityVerdictsParamsSchema, Zt as EnvironmentsPrepareParamsSchema, _t as ToolsGitHubAuthorizePollResultSchema, an as WorkerDesktopLaunchResultSchema, at as SkillsUploadCommitParamsSchema, b as ModelsAuthRefreshParamsSchema, bt as ToolsGitHubAuthorizeStartResultSchema, c as AgentsListParamsSchema, gt as ToolsGitHubAuthorizePollParamsSchema, i as AgentsCreateParamsSchema, in as WorkerDesktopLaunchParamsSchema, it as SkillsUploadChunkParamsSchema, j as SkillsInstallParamsSchema, jt as SecretsResolveParamsSchema, k as SkillsBinsParamsSchema, lt as ToolsGitHubAuthorizeCancelParamsSchema, nt as SkillsUpdateParamsSchema, o as AgentsDeleteParamsSchema, on as WorkerDesktopObserveParamsSchema, ot as SkillsWorkshopReadParamsSchema, q as SkillsProposalsListParamsSchema, qt as EnvironmentsDestroyParamsSchema, rn as WorkerDesktopAppIdSchema, rt as SkillsUploadBeginParamsSchema, sn as WorkerDesktopObserveResultSchema, tt as SkillsStatusParamsSchema, u as AgentsUpdateParamsSchema, ut as ToolsGitHubAuthorizeCancelResultSchema, v as ModelsAuthLogoutParamsSchema, w as ModelsProbeParamsSchema, x as ModelsAuthSetApiKeyParamsSchema, y as ModelsAuthOrderSetParamsSchema, yt as ToolsGitHubAuthorizeStartParamsSchema, zt as GatewayCompletionRouteSchema } from "./agents-models-skills-C5tzwL7k.mjs";
import { t as withSince } from "./since-BZlYNVYy.mjs";
import { _ as SessionsActivitySummaryEnsureParamsSchema, c as SessionRepositorySourceSchema, d as SessionToolOverridesSchema, f as SessionSharingRoleSchema, h as SessionsProviderReviewContinueParamsSchema, l as SessionRowSchema, p as SessionVisibilitySchema, r as SessionCreatedActorSchema, s as SessionPermissionModeSchema } from "./sessions-row-DAFw32gg.mjs";
import { i as SessionParticipantSchema } from "./session-participant-CA6bsNes.mjs";
import { $t as UsersMentionableParamsSchema, A as SessionsBranchesSwitchParamsSchema, An as ConfigPatchParamsSchema, Ar as PluginsInstallParamsSchema, At as ChatMessageGetParamsSchema, Bn as UpdateReportResultSchema, Br as PluginsSessionActionParamsSchema, Cr as PluginsControlUiListParamsSchema, Dt as ChatHistoryActivitySchema, E as SessionsAssignOwnerParamsSchema, En as GatewaySuspendStatusResultSchema, Er as PluginsControlUiStatusParamsSchema, Fn as ConfigSetParamsSchema, Ft as ChatStartupParamsSchema, Gn as UpdateRunChangedEventSchema, Gr as PluginsUiDescriptorsResultSchema, H as SessionsDiffParamsSchema, Hr as PluginsSetEnabledParamsSchema, I as SessionsCompanionResetParamsSchema, Ir as PluginsReloadParamsSchema, J as SessionsFilesListParamsSchema, Jn as UpdateRunsGetParamsSchema, K as SessionsFilesGetParamsSchema, Kn as UpdateRunRecordSchema, Kr as PluginsUninstallParamsSchema, Ln as UpdateHoldParamsSchema, Lt as ChatToolTitlesParamsSchema, M as SessionsCleanupParamsSchema, Mn as ConfigSchemaLookupResultSchema, Mr as PluginsListParamsSchema, N as SessionsCompactParamsSchema, Nn as ConfigSchemaParamsSchema, O as SessionsBranchesListParamsSchema, On as ConfigApplyParamsSchema, Or as PluginsInspectParamsSchema, Ot as ChatHistoryParamsSchema, P as SessionsCompanionAskParamsSchema, Pr as PluginsRefreshParamsSchema, Pt as ChatSendParamsSchema, Q as SessionsFilesSetParamsSchema, Qn as CapabilityConsentErrorDetailsSchema, Qt as MentionsListResultSchema, R as SessionsCompanionStateParamsSchema, Rn as UpdateHoldResultSchema, Rr as PluginsSearchParamsSchema, St as SessionsUsageParamsSchema, T as SessionsAbortParamsSchema, Tr as PluginsControlUiReportParamsSchema, Tt as ChatAttachmentsSchema, Un as UpdateStatusParamsSchema, Ut as HumanMentionsSchema, V as SessionsDescribeParamsSchema, Vn as UpdateRunParamsSchema, Vr as PluginsSessionActionResultSchema, W as SessionsFilesAssetsParamsSchema, Wn as UpdateStatusResultSchema, Wr as PluginsUiDescriptorsParamsSchema, X as SessionsFilesRevealParamsSchema, Xn as UpdateRunsListParamsSchema, Xt as MentionsDismissParamsSchema, Yn as UpdateRunsGetResultSchema, Yt as MentionsChangedEventSchema, Zn as UpdateRunsListResultSchema, Zt as MentionsListParamsSchema, _t as SessionsPreviewParamsSchema, ai as ClawHubDownloadabilitySchema, at as SessionsGroupsListParamsSchema, bn as GatewaySuspendPrepareResultSchema, cr as PluginJsonValueSchema, ct as SessionsGroupsPutParamsSchema, dt as SessionsGroupsUpdateResultSchema, ei as PluginCredentialDescriptorSchema, en as UsersMentionableResultSchema, et as SessionsForkParamsSchema, ft as SessionsMessagesSubscribeParamsSchema, gr as PluginsCatalogCategoriesParamsSchema, gt as SessionsPluginPatchParamsSchema, it as SessionsGroupsDeleteParamsSchema, jn as ConfigSchemaLookupParamsSchema, jt as ChatMetadataParamsSchema, kn as ConfigGetParamsSchema, kt as ChatInjectParamsSchema, lt as SessionsGroupsRenameParamsSchema, mn as GatewaySuspendHandoffParamsSchema, mr as PluginsCatalogBrowseParamsSchema, mt as SessionsObserverVisibilityParamsSchema, nn as ErrorShapeSchema, nt as SessionsGroupsDefaultsParamsSchema, oi as ClawHubSelectedReleaseSchema, on as RequestFrameSchema, ot as SessionsGroupsListResultSchema, pt as SessionsMessagesUnsubscribeParamsSchema, qn as UpdateRunResultSchema, rt as SessionsGroupsDefaultsResultSchema, st as SessionsGroupsMutationResultSchema, tn as ConnectParamsSchema, ut as SessionsGroupsUpdateParamsSchema, vn as GatewaySuspendPrepareParamsSchema, vr as PluginsCatalogGetParamsSchema, vt as SessionsResetParamsSchema, wn as GatewaySuspendStatusParamsSchema, wr as PluginsControlUiReloadParamsSchema, wt as ChatAbortParamsSchema, xn as GatewaySuspendResumeParamsSchema, xt as SessionsSendParamsSchema, yt as SessionsRewindParamsSchema, zn as UpdateReportParamsSchema, zt as LogsTailParamsSchema } from "./sessions-DJqMAtE3.mjs";
import { $ as UsersSelectModelAccountParamsSchema, A as UsersLinkChannelIdentityParamsSchema, B as UsersListParamsSchema, Ct as SetupInferenceActivationRejectionSchema, E as UsersGitHubStatusParamsSchema, Et as ModelAuthProfileIdSchema, H as UsersMergeParamsSchema, I as UsersListChannelIdentitiesParamsSchema, K as UsersPersonalFileSetParamsSchema, L as UsersListChannelIdentitiesResultSchema, M as UsersLinkEmailParamsSchema, N as UsersLinkEmailResultSchema, O as UsersLinkAuthProfileParamsSchema, P as UsersListAuthLinksParamsSchema, R as UsersListModelAccountsParamsSchema, S as UsersGitHubAuthorizeStartParamsSchema, St as WizardStepSchema, Tt as ChatAccountSelectionSchema, U as UsersMergeResultSchema, W as UsersPersonalFileGetParamsSchema, Y as UsersPrefsGetParamsSchema, Z as UsersPrefsSetParamsSchema, at as UsersSetDisplayNameParamsSchema, b as UsersGitHubAuthorizePollParamsSchema, bt as WizardStatusParamsSchema, ct as UsersSetRoleResultSchema, d as UsersAuthConnectCatalogParamsSchema, dt as UsersUnlinkChannelIdentityParamsSchema, ft as UsersUnlinkChannelIdentityResultSchema, g as UsersAuthConnectStatusParamsSchema, gt as WizardNextParamsSchema, ht as WizardCancelParamsSchema, it as UsersSetAvatarResultSchema, j as UsersLinkChannelIdentityResultSchema, l as UsersAuthConnectAnswerParamsSchema, lt as UsersUnlinkAuthProfileParamsSchema, m as UsersAuthConnectStartParamsSchema, mt as WizardAnswerSchema, n as PersonalGitHubGenerationSchema, nt as UsersSelfResultSchema, ot as UsersSetDisplayNameResultSchema, pt as McpAuthLoginParamsSchema, r as PersonalGitHubStatusSchema, rt as UsersSetAvatarParamsSchema, st as UsersSetRoleParamsSchema, t as PersonalGitHubAccountSchema, tt as UsersSelfParamsSchema, u as UsersAuthConnectCancelParamsSchema, v as UsersGitHubAuthorizeCancelParamsSchema, vt as WizardStartParamsSchema, w as UsersGitHubDisconnectParamsSchema, wt as SetupInferenceFailureStatusSchema, yt as WizardStartResultSchema } from "./users-COu0fYQz.mjs";
import { n as CanvasDocumentPreviewParamsSchema, r as CanvasDocumentViewParamsSchema } from "./canvas-CTYLqV3I.mjs";
import { F as BoardWidgetContentSchema, N as BoardWidgetAppViewParamsSchema, R as BoardWidgetGrantParamsSchema, X as BoardWidgetPutParamsSchema, a as BoardActionParamsSchema, b as BoardPromptAuthorizeParamsSchema, f as BoardDataReadParamsSchema, h as BoardGetParamsSchema, j as BoardUpdateParamsSchema, p as BoardEventParamsSchema } from "./board-Dk9KNFBo.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { t as SESSION_AGENT_ATTENTION_ICON_IDS } from "./session-agent-status-BSzRJm_2.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXu4Ype.mjs";
import { n as MAX_TERMINAL_UPLOAD_BYTES, t as MAX_TERMINAL_UPLOAD_BASE64_LENGTH } from "./terminal-constants-6rIiJ0m_.mjs";
import { _ as ApprovalScopeSchema, d as ApprovalHistoryParamsSchema, h as ApprovalResolveParamsSchema, l as ApprovalGetParamsSchema, s as ApprovalChannelReviewerSchema } from "./approval-result-validators-BrtTovHw.mjs";
import { _ as checkWorkerProtocolJson } from "./worker-protocol-primitives-BajTgPT4.mjs";
import { $ as WorkerSessionsSpawnParamsSchema, E as WorkerLiveEventParamsSchema, G as WorkerPortalParamsSchema, N as WorkerTranscriptCommitParamsSchema, Z as WorkerSessionsSendParamsSchema, at as PresenceQueryResultSchema, b as WorkerConnectRequestFrameSchema, it as PresenceQueryParamsSchema, lt as WorkerComputerParamsSchema, q as WorkerPresenceParamsSchema, st as FailoverReasonSchema, v as WorkerAdmissionHandshakeSchema, x as WorkerHeartbeatParamsSchema } from "./worker-admission-CNeLWzVQ.mjs";
import { r as SKILL_LIBRARY_MAX_FILE_BYTES } from "./skill-library-Bgib5R_8.mjs";
import { a as ProgressCardGetParamsSchema, l as ProgressCardRefreshParamsSchema, s as ProgressCardPutParamsSchema } from "./progress-card-P52qPeKb.mjs";
import { _ as TranscriptsStatusParamsSchema, d as TranscriptsExportParamsSchema, h as TranscriptsListParamsSchema, p as TranscriptsGetParamsSchema, y as TranscriptsSummarizeParamsSchema } from "./transcripts-DroWNd5p.mjs";
import { n as GatewayProcessMemorySchema, t as GatewayEventLoopHealthSchema } from "./runtime-vitals-BAzwMWci.mjs";
import { i as SessionsGoalUpdateParamsSchema, n as SessionsGoalClearParamsSchema } from "./sessions-goal-CGwIeB-Y.mjs";
import { c as AuditActivityListParamsSchema } from "./audit-activity-BuH_HteH.mjs";
import { c as AuditRunInspectParamsSchema } from "./audit-run-validators-CvwMY6xd.mjs";
import { A as TalkSpeakParamsSchema, C as TalkSessionCancelOutputResultSchema, F as WebLoginWaitParamsSchema, M as TtsSpeakParamsSchema, O as TalkSessionSteerParamsSchema, P as WebLoginStartParamsSchema, S as TalkSessionCancelOutputParamsSchema, T as TalkSessionCreateParamsSchema, _ as TalkConfigParamsSchema, a as ChannelsStopParamsSchema, b as TalkModeParamsSchema, d as TalkClientCreateResultSchema, f as TalkClientMutationResultSchema, g as TalkClientTranscriptParamsSchema, h as TalkClientToolCallResultSchema, k as TalkSessionSubmitToolResultParamsSchema, l as TalkClientCloseParamsSchema, m as TalkClientToolCallParamsSchema, n as ChannelsStartParamsSchema, p as TalkClientSteerParamsSchema, r as ChannelsStatusParamsSchema, s as TalkCatalogParamsSchema, t as ChannelsLogoutParamsSchema, u as TalkClientCreateParamsSchema, v as TalkConfigResultSchema, w as TalkSessionCloseParamsSchema, x as TalkSessionAppendAudioParamsSchema } from "./channels-CjXaZD-o.mjs";
import { D as NodeSkillsUpdateParamsSchema, S as NodePresenceActivityPayloadSchema, T as NodeRenameParamsSchema, c as NodeInvokeProgressParamsSchema, d as NodePairApproveParamsSchema, f as NodePairListParamsSchema, g as NodePendingDrainParamsSchema, h as NodePendingAckParamsSchema, i as NodeHostStatsPayloadSchema, l as NodeInvokeResultParamsSchema, m as NodePairRemoveParamsSchema, n as NodeEventParamsSchema, p as NodePairRejectParamsSchema, s as NodeInvokeParamsSchema, t as NodeDescribeParamsSchema, u as NodeListParamsSchema, v as NodePendingEnqueueParamsSchema, x as NodePluginToolsUpdateParamsSchema } from "./nodes-DPtrbB1Q.mjs";
import { _ as SessionsReclaimParamsSchema, g as SessionsMoveResultSchema, y as SessionsReclaimResultSchema } from "./session-placement-validators-pPSh_0wv.mjs";
import { n as SessionsResolveParamsSchema } from "./sessions-resolve-Bxyco7dh.mjs";
import { Type } from "typebox";
import { Value } from "typebox/value";
//#region packages/gateway-protocol/src/schema/environments-session.ts
const sessionTarget = {
	sessionKey: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString)
};
const EnvironmentsSessionCreateParamsSchema = closedObject({
	...sessionTarget,
	profileId: NonEmptyString,
	idempotencyKey: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	machineClass: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	os: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	presentation: Type.Optional(Type.Union([Type.Literal("desktop"), Type.Literal("portal")]))
});
const EnvironmentsSessionStatusParamsSchema = closedObject({
	...sessionTarget,
	environmentId: Type.Optional(NonEmptyString)
});
const EnvironmentsSessionDestroyParamsSchema = closedObject({
	...sessionTarget,
	environmentId: Type.Optional(NonEmptyString)
});
//#endregion
//#region packages/gateway-protocol/src/schema/environments-session-exec.ts
/** Commands always run in the environment attached to the authenticated conversation. */
const EnvironmentsSessionExecParamsSchema = Type.Refine(closedObject({
	sessionKey: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 1024
	})),
	agentId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	environmentId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	action: Type.Optional(Type.Union([
		Type.Literal("run"),
		Type.Literal("start"),
		Type.Literal("status"),
		Type.Literal("stop")
	])),
	processId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128,
		pattern: "^[A-Za-z0-9][A-Za-z0-9._:-]*$"
	})),
	argv: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 131072
	}), {
		minItems: 1,
		maxItems: 128
	})),
	input: Type.Optional(Type.String({ maxLength: 131072 })),
	timeoutMs: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 6e5
	}))
}), (value) => {
	const action = value.action ?? "run";
	return action === "run" ? value.argv !== void 0 && value.processId === void 0 : action === "start" ? value.argv !== void 0 && value.processId !== void 0 : value.processId !== void 0 && value.argv === void 0 && value.input === void 0 && value.timeoutMs === void 0;
}, () => "run/start require argv; start/status/stop require processId; status/stop accept no command");
//#endregion
//#region packages/gateway-protocol/src/schema/skill-detail.ts
/** Skill registry detail, latest version, metadata, and owner info. */
const SkillRegistrySetupSchema = Type.Array(closedObject({
	key: NonEmptyString,
	required: Type.Boolean()
}));
const SkillDetailUnavailableSchema = closedObject({
	status: Type.Literal("unavailable"),
	reason: NonEmptyString
});
const SkillsDetailResultSchema = closedObject({
	registry: Type.Optional(NonEmptyString),
	source: Type.Optional(Type.Literal("clawhub")),
	installRef: Type.Optional(NonEmptyString),
	selectedRelease: Type.Optional(Type.Union([ClawHubSelectedReleaseSchema, Type.Null()])),
	downloadability: Type.Optional(ClawHubDownloadabilitySchema),
	card: Type.Optional(Type.Union([closedObject({
		status: Type.Literal("available"),
		content: Type.String()
	}), SkillDetailUnavailableSchema])),
	requirements: Type.Optional(Type.Union([closedObject({
		status: Type.Literal("available"),
		setup: SkillRegistrySetupSchema,
		os: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
		systems: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
		scope: Type.Literal("registry-setup"),
		note: NonEmptyString
	}), SkillDetailUnavailableSchema])),
	security: Type.Optional(Type.Union([closedObject({
		status: Type.Literal("available"),
		scanStatus: NonEmptyString,
		hasWarnings: Type.Boolean(),
		hasScanResult: Type.Boolean(),
		checkedAt: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
		summary: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		virustotalUrl: Type.Optional(Type.Union([Type.String(), Type.Null()]))
	}), SkillDetailUnavailableSchema])),
	warnings: Type.Optional(Type.Array(Type.String())),
	skill: Type.Union([closedObject({
		slug: NonEmptyString,
		displayName: NonEmptyString,
		summary: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		icon: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		topics: Type.Optional(Type.Array(Type.String())),
		stats: Type.Optional(Type.Record(Type.String(), Type.Number())),
		tags: Type.Optional(Type.Record(NonEmptyString, Type.String())),
		channel: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		isOfficial: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
		createdAt: Type.Integer(),
		updatedAt: Type.Integer()
	}), Type.Null()]),
	latestVersion: Type.Optional(Type.Union([closedObject({
		version: NonEmptyString,
		createdAt: Type.Integer(),
		changelog: Type.Optional(Type.String()),
		license: Type.Optional(Type.Union([Type.String(), Type.Null()]))
	}), Type.Null()])),
	metadata: Type.Optional(Type.Union([closedObject({
		setup: Type.Optional(SkillRegistrySetupSchema),
		os: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
		systems: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()]))
	}), Type.Null()])),
	moderation: Type.Optional(Type.Union([closedObject({
		isSuspicious: Type.Boolean(),
		isMalwareBlocked: Type.Boolean(),
		verdict: Type.String(),
		reasonCodes: Type.Array(Type.String()),
		summary: Type.Union([Type.String(), Type.Null()]),
		engineVersion: Type.Union([Type.String(), Type.Null()]),
		updatedAt: Type.Union([Type.Number(), Type.Null()])
	}), Type.Null()])),
	owner: Type.Optional(Type.Union([closedObject({
		handle: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
		userId: Type.Optional(NonEmptyString),
		displayName: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
		image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		official: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
		channel: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		isOfficial: Type.Optional(Type.Union([Type.Boolean(), Type.Null()]))
	}), Type.Null()]))
});
//#endregion
//#region packages/gateway-protocol/src/schema/model-catalog.ts
/** Model catalog request with optional visibility scope. */
const ModelsListParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	authProfileId: Type.Optional(ModelAuthProfileIdSchema),
	provider: Type.Optional(NonEmptyString),
	includeDetails: Type.Optional(Type.Boolean()),
	includeProviderCapabilities: Type.Optional(Type.Boolean()),
	/** Include global default-model previews, independent of agent/session overrides. */
	includeDefaultModels: Type.Optional(Type.Boolean()),
	/** Reuse prepared/cached facts without starting provider discovery. */
	preparedOnly: Type.Optional(Type.Boolean()),
	/** Force replacement of a completed full-catalog generation. */
	refresh: Type.Optional(Type.Boolean()),
	view: Type.Optional(Type.Union([
		Type.Literal("default"),
		Type.Literal("configured"),
		Type.Literal("provider-config"),
		Type.Literal("all")
	]))
}, {
	additionalProperties: false,
	allOf: [{ not: {
		properties: {
			preparedOnly: { const: true },
			refresh: { const: true }
		},
		required: ["preparedOnly", "refresh"]
	} }, { not: { required: ["sessionKey", "authProfileId"] } }]
});
const ModelUnavailableReasonSchema = Type.Union([
	Type.Literal("missing-auth"),
	Type.Literal("auth-failed"),
	Type.Literal("cooldown")
]);
const ModelRuntimeProperties = {
	available: Type.Optional(Type.Boolean()),
	/** Scoped manual-choice permission; separate from runtime readiness and automatic selection. */
	manualSelectionAllowed: Type.Optional(Type.Boolean()),
	unavailableReason: Type.Optional(ModelUnavailableReasonSchema),
	/** Earliest known retry time in epoch milliseconds, only for unavailable models. */
	unavailableUntil: Type.Optional(Type.Integer({ minimum: 0 })),
	contextWindow: Type.Optional(Type.Integer({ minimum: 1 })),
	contextTokens: Type.Optional(Type.Integer({ minimum: 1 })),
	local: Type.Optional(Type.Boolean()),
	contextWindows: Type.Optional(Type.Array(GatewayContextWindowOptionSchema)),
	contextWindowDefault: Type.Optional(NonEmptyString),
	reasoning: Type.Optional(Type.Boolean()),
	thinkingLevels: Type.Optional(Type.Array(GatewayThinkingLevelOptionSchema)),
	thinkingDefault: Type.Optional(NonEmptyString),
	effectiveFastMode: Type.Optional(Type.Union([
		Type.Boolean(),
		Type.Literal("auto"),
		Type.Literal("ultrafast")
	])),
	/** Account-scoped service tiers advertised for this selected runtime. Missing means unknown. */
	serviceTiers: Type.Optional(Type.Array(NonEmptyString)),
	/** Local selected-request applicability, not preference or upstream fulfillment. */
	supportsFastMode: Type.Optional(Type.Boolean()),
	supportsTools: Type.Optional(Type.Boolean()),
	input: Type.Optional(Type.Array(Type.Union([
		Type.Literal("text"),
		Type.Literal("image"),
		Type.Literal("audio"),
		Type.Literal("video"),
		Type.Literal("document")
	])))
};
/** Runtime-specific capabilities for an additional choice of the same canonical model. */
const ModelRuntimeChoiceSchema = closedObject({
	agentRuntime: GatewayAgentRuntimeSchema,
	...ModelRuntimeProperties,
	unavailableReason: Type.Optional(Type.Union([ModelUnavailableReasonSchema, Type.Literal("unsupported-runtime")]))
});
const ModelChoiceSchema = closedObject({
	id: NonEmptyString,
	name: NonEmptyString,
	provider: NonEmptyString,
	alias: Type.Optional(NonEmptyString),
	tags: Type.Optional(Type.Array(NonEmptyString)),
	...ModelRuntimeProperties,
	agentRuntime: Type.Optional(GatewayAgentRuntimeSchema),
	apiKeySupported: Type.Optional(Type.Boolean()),
	runtimeChoices: Type.Optional(Type.Array(ModelRuntimeChoiceSchema, { maxItems: 8 }))
});
/** Model catalog result. */
const ModelCatalogProviderOutcomeSchema = closedObject({
	provider: NonEmptyString,
	profileId: Type.Optional(NonEmptyString),
	status: Type.Union([
		Type.Literal("ready"),
		Type.Literal("auth-rejected"),
		Type.Literal("unavailable")
	])
});
closedObject({
	models: Type.Array(ModelChoiceSchema),
	/** The Gateway owns role restrictions and the effective permitted reset target. */
	modelSelectionPolicy: Type.Optional(closedObject({
		restricted: Type.Literal(true),
		defaultModel: Type.Union([NonEmptyString, Type.Null()])
	})),
	/** Manifest-owned decision choices, separate from conversational model routing. */
	decisionModels: Type.Optional(Type.Array(closedObject({
		id: NonEmptyString,
		provider: NonEmptyString,
		name: NonEmptyString,
		pluginId: NonEmptyString,
		capabilities: Type.Optional(closedObject({
			questionTypes: Type.Array(Type.Union([
				Type.Literal("boolean"),
				Type.Literal("choice"),
				Type.Literal("score")
			]), {
				minItems: 1,
				maxItems: 3,
				uniqueItems: true
			}),
			maxQuestions: Type.Optional(Type.Integer({
				minimum: 1,
				maximum: Number.MAX_SAFE_INTEGER
			})),
			maxChoiceAlternatives: Type.Optional(Type.Integer({
				minimum: 1,
				maximum: Number.MAX_SAFE_INTEGER
			})),
			maxScoreLevels: Type.Optional(Type.Integer({
				minimum: 1,
				maximum: Number.MAX_SAFE_INTEGER
			})),
			maxInputTokens: Type.Optional(Type.Integer({
				minimum: 1,
				maximum: Number.MAX_SAFE_INTEGER
			})),
			inputTokenScope: Type.Optional(Type.Union([Type.Literal("encoded-question"), Type.Literal("state-plus-each-criterion")])),
			requiresBooleanCriteria: Type.Optional(Type.Boolean()),
			confidence: Type.Optional(Type.Union([Type.Literal("provider-specific"), Type.Literal("none")]))
		}))
	}))),
	defaultModels: Type.Optional(closedObject({
		/** Auto preview from agents.defaults.model, even when utility routing is explicit or disabled. */
		automaticUtilityModel: Type.Union([NonEmptyString, Type.Null()]),
		/** Route the utility model in effect (automatic or explicit) runs on; absent when disabled. */
		utilityRuntime: Type.Optional(GatewayCompletionRouteSchema)
	})),
	refreshFailed: Type.Optional(Type.Boolean()),
	pendingProviders: Type.Optional(Type.Array(NonEmptyString)),
	accountSelection: Type.Optional(ChatAccountSelectionSchema),
	providerOutcomes: Type.Optional(Type.Array(ModelCatalogProviderOutcomeSchema))
});
//#endregion
//#region packages/gateway-protocol/src/schema/skill-curator.ts
const SkillLifecycleStateSchema = Type.Union([
	Type.Literal("active"),
	Type.Literal("stale"),
	Type.Literal("archived")
]);
const SkillCuratorEntrySchema = closedObject({
	skillFile: NonEmptyString,
	skillKey: NonEmptyString,
	skillName: NonEmptyString,
	state: SkillLifecycleStateSchema,
	pinned: Type.Boolean(),
	createdAtMs: Type.Number(),
	stateChangedAtMs: Type.Number(),
	lastUsedAtMs: Type.Union([Type.Number(), Type.Null()]),
	useCount: Type.Number(),
	archivedReason: Type.Union([Type.String(), Type.Null()])
});
const SkillOverlapCandidateSchema = closedObject({
	left: NonEmptyString,
	right: NonEmptyString,
	score: Type.Number()
});
const SkillCollectionReviewStatusSchema = closedObject({
	attemptedAtMs: Type.Number(),
	succeededAtMs: Type.Optional(Type.Number()),
	error: Type.Optional(Type.String())
});
const SkillExperienceReviewStatusSchema = closedObject({
	attemptedAtMs: Type.Number(),
	outcome: Type.Union([
		Type.Literal("completed"),
		Type.Literal("applied"),
		Type.Literal("proposed"),
		Type.Literal("nothing"),
		Type.Literal("failed")
	]),
	proposalId: Type.Optional(Type.String()),
	error: Type.Optional(Type.String()),
	usage: Type.Optional(closedObject({
		inputTokens: Type.Number(),
		cachedInputTokens: Type.Number(),
		outputTokens: Type.Number()
	}))
});
/** Reads persisted skill usage and collection review state. */
const SkillsCuratorStatusParamsSchema = closedObject({});
const SkillsCuratorStatusResultSchema = closedObject({
	lastAttemptAtMs: Type.Union([Type.Number(), Type.Null()]),
	lastSuccessAtMs: Type.Union([Type.Number(), Type.Null()]),
	lastError: Type.Union([Type.String(), Type.Null()]),
	collectionReview: Type.Optional(Type.Record(NonEmptyString, SkillCollectionReviewStatusSchema)),
	experienceReview: Type.Optional(Type.Record(NonEmptyString, SkillExperienceReviewStatusSchema)),
	counts: closedObject({
		active: Type.Number(),
		stale: Type.Number(),
		archived: Type.Number()
	}),
	skills: Type.Array(SkillCuratorEntrySchema),
	overlaps: Type.Array(SkillOverlapCandidateSchema)
});
/** Preserves retired curator action methods so clients receive an actionable error. */
const SkillsCuratorActionParamsSchema = closedObject({ skill: NonEmptyString });
const SkillsCuratorActionResultSchema = SkillCuratorEntrySchema;
const SkillCuratorLiveEntrySchema = closedObject({
	...SkillCuratorEntrySchema.properties,
	createdAtMs: Type.Union([Type.Number(), Type.Null()]),
	stateChangedAtMs: Type.Union([Type.Number(), Type.Null()])
});
closedObject({
	...SkillsCuratorStatusResultSchema.properties,
	inventory: Type.Literal("live-workshop"),
	skills: Type.Array(SkillCuratorLiveEntrySchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/ui-appearance-typefaces.ts
const UI_APPEARANCE_TYPEFACE_VALUES = [
	"instrument-sans",
	"geist",
	"dm-sans",
	"ibm-plex-sans",
	"space-grotesk",
	"atkinson-hyperlegible",
	"fraunces",
	"lora",
	"jetbrains-mono",
	"system"
];
//#endregion
//#region packages/gateway-protocol/src/schema/ui-appearance-preferences.ts
const UI_APPEARANCE_PREFERENCE_KEYS = {
	theme: "ui.theme",
	themeMode: "ui.themeMode",
	accent: "ui.accent",
	fontUi: "ui.fontUi",
	fontChat: "ui.fontChat"
};
const UI_APPEARANCE_TYPEFACES = new Set(UI_APPEARANCE_TYPEFACE_VALUES);
function normalizeUiAppearancePreference(key, value) {
	if (typeof value !== "string") return;
	if (key === UI_APPEARANCE_PREFERENCE_KEYS.accent) return value === "theme" || /^#[0-9a-f]{6}$/i.test(value) ? value.toLowerCase() : void 0;
	if (key === UI_APPEARANCE_PREFERENCE_KEYS.fontUi || key === UI_APPEARANCE_PREFERENCE_KEYS.fontChat) return UI_APPEARANCE_TYPEFACES.has(value) ? value : void 0;
	if (key === UI_APPEARANCE_PREFERENCE_KEYS.theme) return isThemeId(value) ? value : void 0;
	return normalizeThemeMode(value);
}
//#endregion
//#region packages/gateway-protocol/src/agent-runtime-restriction-error-details.ts
/** A selection refusal, not permission to change the session's execution policy. */
const AgentRuntimeRestrictionErrorDetailsSchema = closedObject({
	code: Type.Literal("AGENT_RUNTIME_RESTRICTED"),
	runtimeId: NonEmptyString,
	runtimeLabel: NonEmptyString,
	reason: Type.Union([
		Type.Literal("sandbox-required"),
		Type.Literal("sandbox"),
		Type.Literal("workspace-only"),
		Type.Literal("permission-mode"),
		Type.Literal("remote-execution"),
		Type.Literal("tool-policy")
	]),
	recovery: Type.Optional(closedObject({
		action: Type.Literal("use-native-permissions"),
		sessionId: NonEmptyString,
		lifecycleRevision: Type.Optional(NonEmptyString),
		expectedPermissionMode: Type.Union([SessionPermissionModeSchema, Type.Null()]),
		expectedSandboxMode: Type.Union([Type.Literal("off"), Type.Null()]),
		expectedNativeRuntimeConsent: Type.Union([NonEmptyString, Type.Null()])
	}))
});
function readAgentRuntimeRestrictionErrorDetails(value) {
	return Value.Check(AgentRuntimeRestrictionErrorDetailsSchema, value) ? value : void 0;
}
//#endregion
//#region packages/gateway-protocol/src/clawhub-trust-error-details.ts
/** Structured ClawHub trust details carried in gateway error payloads. */
const ClawHubTrustErrorCodes = {
	SECURITY_UNAVAILABLE: "clawhub_security_unavailable",
	DOWNLOAD_BLOCKED: "clawhub_download_blocked"
};
function isClawHubTrustErrorCode(value) {
	return value === ClawHubTrustErrorCodes.SECURITY_UNAVAILABLE || value === ClawHubTrustErrorCodes.DOWNLOAD_BLOCKED;
}
function buildClawHubTrustErrorDetails(params) {
	if (!params.code && !params.version && !params.warning) return;
	return {
		...params.code ? { clawhubTrustCode: params.code } : {},
		...params.version ? { version: params.version } : {},
		...params.warning ? { warning: params.warning } : {}
	};
}
function readClawHubTrustErrorDetails(details) {
	if (!isRecord(details)) return;
	return buildClawHubTrustErrorDetails({
		code: isClawHubTrustErrorCode(details.clawhubTrustCode) ? details.clawhubTrustCode : void 0,
		version: readNonBlankString(details.version),
		warning: readNonBlankString(details.warning)
	});
}
//#endregion
//#region packages/gateway-protocol/src/system-agent-error-details.ts
/** Structured system-agent details carried in gateway error payloads. */
const SystemAgentErrorDetailCodes = {
	INFERENCE_UNAVAILABLE: "system_agent_inference_unavailable",
	SESSION_INVALIDATED: "system_agent_session_invalidated"
};
function buildSystemAgentInferenceUnavailableErrorDetails() {
	return { code: SystemAgentErrorDetailCodes.INFERENCE_UNAVAILABLE };
}
function buildSystemAgentSessionInvalidatedErrorDetails() {
	return { code: SystemAgentErrorDetailCodes.SESSION_INVALIDATED };
}
function readSystemAgentInferenceUnavailableErrorDetails(details) {
	if (!isRecord(details)) return;
	const code = details.code;
	return code === SystemAgentErrorDetailCodes.INFERENCE_UNAVAILABLE ? { code } : void 0;
}
function readSystemAgentSessionInvalidatedErrorDetails(details) {
	if (!isRecord(details)) return;
	const code = details.code;
	return code === SystemAgentErrorDetailCodes.SESSION_INVALIDATED ? { code } : void 0;
}
//#endregion
//#region packages/gateway-protocol/src/session-workspace-recovery-error-details.ts
/** Reads an exact pending-workspace recovery route without parsing operator-facing prose. */
function readSessionWorkspaceRecoveryRequiredError(error) {
	const record = asNullableRecord(error);
	const details = asNullableRecord(record?.details);
	const source = asNullableRecord(details?.source);
	if (record?.code !== ErrorCodes.UNAVAILABLE || details?.code !== GatewayErrorDetailCodes.SESSION_WORKSPACE_RECOVERY_REQUIRED || details.cause !== "device_offline" || details.recoveryAction !== "continue_on_gateway" || !isNonEmptyProtocolString(details.sessionId) || typeof source?.generation !== "number" || !Number.isSafeInteger(source.generation) || source.generation < 0 || !isNonEmptyProtocolString(source.environmentId) || typeof source.ownerEpoch !== "number" || !Number.isSafeInteger(source.ownerEpoch) || source.ownerEpoch < 1) return null;
	return {
		code: details.code,
		cause: details.cause,
		recoveryAction: details.recoveryAction,
		sessionId: details.sessionId,
		source: {
			generation: source.generation,
			environmentId: source.environmentId,
			ownerEpoch: source.ownerEpoch
		}
	};
}
//#endregion
//#region packages/gateway-protocol/src/schema/session-github-publication.ts
const SharedGitHubPublicationSourceSchema = Type.Union([
	Type.Literal("system-detected"),
	Type.Literal("system-configured"),
	Type.Literal("agent-override")
]);
const GitHubPublicationPublisherSchema = closedObject({
	source: Type.Union([Type.Literal("personal"), ...SharedGitHubPublicationSourceSchema.anyOf]),
	...PersonalGitHubAccountSchema.properties
});
const SharedGitHubPublicationPublisherSchema = closedObject({
	...GitHubPublicationPublisherSchema.properties,
	source: SharedGitHubPublicationSourceSchema
});
const GitHubPublicationSelectionSchema = Type.Union([closedObject({
	source: Type.Literal("shared"),
	expected: Type.Optional(SharedGitHubPublicationPublisherSchema)
}), closedObject({
	source: Type.Literal("personal"),
	generation: PersonalGitHubGenerationSchema,
	account: PersonalGitHubAccountSchema
})]);
const GitHubPublicationTitleSchema = Type.String({
	minLength: 1,
	maxLength: 256,
	pattern: "^[^\\r\\n]*\\S[^\\r\\n]*$"
});
const GitHubPublicationBodySchema = Type.String({
	minLength: 1,
	maxLength: 8192
});
const SessionGitHubPublishParamsSchema = closedObject({
	sessionKey: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	idempotencyKey: NonEmptyString,
	title: Type.Optional(GitHubPublicationTitleSchema),
	body: Type.Optional(GitHubPublicationBodySchema),
	selection: Type.Optional(GitHubPublicationSelectionSchema)
});
const SessionGitHubPublicationBaseSchema = {
	requestId: NonEmptyString,
	publisher: Type.Optional(GitHubPublicationPublisherSchema),
	effect: Type.Optional(closedObject({
		kind: Type.Union([Type.Literal("push"), Type.Literal("pull_request")]),
		status: Type.Union([Type.Literal("dispatched"), Type.Literal("observed")]),
		headCommit: Type.Optional(Type.String({ maxLength: 64 })),
		url: Type.Optional(Type.String({ maxLength: 2048 }))
	}))
};
const SessionGitHubPublicationRequestedSchema = closedObject({
	...SessionGitHubPublicationBaseSchema,
	status: Type.Literal("requested"),
	message: NonEmptyString
});
const SessionGitHubPublicationPublishingSchema = closedObject({
	...SessionGitHubPublicationBaseSchema,
	status: Type.Literal("publishing"),
	message: NonEmptyString
});
const SessionGitHubPublicationPublishedSchema = closedObject({
	...SessionGitHubPublicationBaseSchema,
	status: Type.Literal("published"),
	url: NonEmptyString,
	repository: NonEmptyString,
	branch: NonEmptyString,
	headCommit: NonEmptyString
});
const SessionGitHubPublicationFailedSchema = closedObject({
	...SessionGitHubPublicationBaseSchema,
	status: Type.Literal("failed"),
	code: Type.Union([
		Type.Literal("identity_changed"),
		Type.Literal("identity_unavailable"),
		Type.Literal("session_changed"),
		Type.Literal("workspace_changed"),
		Type.Literal("not_git"),
		Type.Literal("not_github"),
		Type.Literal("no_changes"),
		Type.Literal("push_rejected"),
		Type.Literal("github_rejected"),
		Type.Literal("unavailable")
	]),
	message: NonEmptyString,
	nextAction: NonEmptyString
});
const SessionGitHubPublicationNeedsConfirmationSchema = closedObject({
	...SessionGitHubPublicationBaseSchema,
	status: Type.Literal("needs_confirmation"),
	message: NonEmptyString
});
const SessionGitHubPublicationResultSchema = Type.Union([
	SessionGitHubPublicationRequestedSchema,
	SessionGitHubPublicationPublishingSchema,
	SessionGitHubPublicationPublishedSchema,
	SessionGitHubPublicationFailedSchema,
	SessionGitHubPublicationNeedsConfirmationSchema
]);
const SessionGitHubOptionsParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	idempotencyKey: Type.Optional(NonEmptyString)
});
const SessionGitHubStatusParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	requestId: PersonalGitHubGenerationSchema
});
const SessionGitHubConfirmParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	requestId: PersonalGitHubGenerationSchema,
	generation: PersonalGitHubGenerationSchema,
	account: PersonalGitHubAccountSchema,
	requestDigest: Type.String({
		minLength: 64,
		maxLength: 64,
		pattern: "^[a-f0-9]+$"
	})
});
const SessionGitHubStatusResultSchema = closedObject({
	result: SessionGitHubPublicationResultSchema,
	confirmation: Type.Union([Type.Null(), closedObject({
		requestDigest: Type.String({
			minLength: 64,
			maxLength: 64
		}),
		generation: PersonalGitHubGenerationSchema,
		account: PersonalGitHubAccountSchema,
		pushRepository: Type.String({ maxLength: 256 }),
		repository: Type.String({ maxLength: 256 }),
		branch: Type.String({ maxLength: 256 }),
		baseBranch: Type.String({ maxLength: 256 }),
		sourceHeadCommit: Type.String({ maxLength: 64 }),
		sourceIndexTree: Type.String({ maxLength: 64 }),
		workspaceTree: Type.String({ maxLength: 64 })
	})])
});
const SessionGitHubOptionsResultSchema = closedObject({
	personal: Type.Union([PersonalGitHubStatusSchema, Type.Null()]),
	shared: Type.Union([SharedGitHubPublicationPublisherSchema, Type.Null()]),
	pendingPersonal: Type.Union([SessionGitHubStatusResultSchema, Type.Null()]),
	latestShared: Type.Union([SessionGitHubStatusResultSchema, Type.Null()])
});
//#endregion
//#region packages/gateway-protocol/src/schema/plugin-install-progress.ts
/** Request-scoped installer facts; no package output or local paths cross this boundary. */
const PluginInstallActivitySchema = closedObject({
	activityId: NonEmptyString,
	stage: Type.Union([
		Type.Literal("resolve"),
		Type.Literal("download"),
		Type.Literal("extract"),
		Type.Literal("files"),
		Type.Literal("dependencies"),
		Type.Literal("runtime")
	]),
	status: Type.Union([
		Type.Literal("started"),
		Type.Literal("completed"),
		Type.Literal("failed")
	])
});
const PluginsInstallProgressEventSchema = closedObject({
	...PluginInstallActivitySchema.properties,
	requestId: NonEmptyString
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-catalog.ts
const SessionCatalogErrorSchema = closedObject({
	code: NonEmptyString,
	message: NonEmptyString
});
const SessionCatalogLocatorSchema = closedObject({
	catalogId: NonEmptyString,
	hostId: NonEmptyString,
	threadId: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	sourceHomeId: Type.Optional(NonEmptyString)
});
const SessionCatalogCapabilitiesSchema = closedObject({
	continueSession: Type.Boolean(),
	archive: Type.Boolean(),
	createSession: Type.Optional(closedObject({
		model: NonEmptyString,
		startTerminal: Type.Optional(Type.Boolean())
	})),
	openTerminal: Type.Optional(Type.Boolean()),
	startTerminal: Type.Optional(Type.Boolean())
});
const SessionCatalogShareRouteSchema = closedObject({
	kind: Type.Literal("thread-id-prefix"),
	routeSegment: Type.String({ pattern: "^[a-z][a-z0-9-]*$" }),
	hostId: NonEmptyString,
	identifierAlphabet: Type.Literal("lowercase-hex"),
	fullLength: Type.Literal(32),
	minPrefixLength: Type.Literal(12),
	lookup: Type.Literal("catalog-list-search-by-thread-id-prefix"),
	ambiguity: Type.Literal("multiple-results-or-next-cursor")
});
const SessionCatalogDescriptorSchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString,
	capabilities: SessionCatalogCapabilitiesSchema
});
const SessionCatalogPullRequestSummarySchema = closedObject({
	numbers: Type.Array(Type.Integer({ minimum: 1 }), {
		minItems: 1,
		maxItems: 20,
		uniqueItems: true
	}),
	state: Type.Union([
		Type.Literal("open"),
		Type.Literal("draft"),
		Type.Literal("merged"),
		Type.Literal("closed")
	])
});
const SessionCatalogSessionSchema = closedObject({
	threadId: NonEmptyString,
	sourceHomeId: Type.Optional(NonEmptyString),
	name: Type.Optional(Type.String()),
	/** Named tint imported from the source CLI session (SESSION_COLOR_IDS). */
	color: Type.Optional(Type.String()),
	cwd: Type.Optional(Type.String()),
	status: NonEmptyString,
	createdAt: Type.Optional(Type.Number()),
	updatedAt: Type.Optional(Type.Number()),
	recencyAt: Type.Optional(Type.Number()),
	source: Type.Optional(Type.String()),
	modelProvider: Type.Optional(Type.String()),
	cliVersion: Type.Optional(Type.String()),
	gitBranch: Type.Optional(Type.String()),
	customGroup: Type.Optional(Type.String()),
	pullRequest: Type.Optional(SessionCatalogPullRequestSummarySchema),
	archived: Type.Boolean(),
	sessionKey: Type.Optional(NonEmptyString),
	createdActor: Type.Optional(SessionCreatedActorSchema),
	canContinue: Type.Boolean(),
	canArchive: Type.Boolean(),
	canOpenTerminal: Type.Optional(Type.Boolean())
});
const SessionCatalogHostSchema = closedObject({
	hostId: NonEmptyString,
	label: NonEmptyString,
	kind: Type.Union([Type.Literal("gateway"), Type.Literal("node")]),
	connected: Type.Boolean(),
	/** First snapshot is still loading; retain prior rows until the host publication arrives. */
	pending: Type.Optional(Type.Boolean()),
	nodeId: Type.Optional(NonEmptyString),
	canStartTerminal: Type.Optional(Type.Boolean()),
	sessions: Type.Array(SessionCatalogSessionSchema),
	nextCursor: Type.Optional(Type.String()),
	error: Type.Optional(SessionCatalogErrorSchema)
});
const SessionCatalogSchema = closedObject({
	...SessionCatalogDescriptorSchema.properties,
	shareRoute: Type.Optional(SessionCatalogShareRouteSchema),
	hosts: Type.Array(SessionCatalogHostSchema),
	error: Type.Optional(SessionCatalogErrorSchema)
});
const SessionsCatalogListCommonProperties = {
	agentId: Type.Optional(NonEmptyString),
	progressId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	/** Opt into pending hosts completed by incremental publications for this progressId. */
	allowPartialResults: Type.Optional(Type.Boolean()),
	search: Type.Optional(Type.String()),
	limitPerHost: Type.Optional(Type.Integer({ minimum: 1 })),
	hostIds: Type.Optional(Type.Array(NonEmptyString))
};
const SessionsCatalogListParamsSchema = closedObject({
	catalogId: Type.Optional(NonEmptyString),
	/** Return catalog labels and capabilities with empty hosts, without listing sessions. */
	metadataOnly: Type.Optional(Type.Boolean()),
	cursors: Type.Optional(Type.Record(NonEmptyString, Type.String())),
	...SessionsCatalogListCommonProperties
});
const SessionsCatalogListResultSchema = closedObject({ catalogs: Type.Array(SessionCatalogSchema) });
const SessionsCatalogHostEventCatalogSchema = closedObject({
	...SessionCatalogSchema.properties,
	hosts: Type.Array(SessionCatalogHostSchema, {
		minItems: 1,
		maxItems: 1
	})
});
const SessionsCatalogHostEventSchema = closedObject({
	progressId: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	agentId: NonEmptyString,
	catalog: SessionsCatalogHostEventCatalogSchema
});
const SessionCatalogTranscriptItemSchema = closedObject({
	id: Type.Optional(Type.String()),
	type: Type.Union([
		Type.Literal("userMessage"),
		Type.Literal("agentMessage"),
		Type.Literal("reasoning"),
		Type.Literal("toolCall"),
		Type.Literal("toolResult"),
		Type.Literal("other")
	]),
	text: Type.Optional(Type.String()),
	timestamp: Type.Optional(Type.String()),
	model: Type.Optional(Type.String()),
	/** Source-supplied attribution, independent of the viewer and session adopter. */
	sender: Type.Optional(SessionParticipantSchema),
	truncated: Type.Optional(Type.Boolean()),
	raw: Type.Optional(PluginJsonValueSchema)
});
const SessionsCatalogReadParamsSchema = closedObject({
	...SessionCatalogLocatorSchema.properties,
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	cursor: Type.Optional(Type.String())
});
const SessionsCatalogReadResultSchema = closedObject({
	hostId: NonEmptyString,
	label: Type.Optional(Type.String()),
	threadId: NonEmptyString,
	items: Type.Array(SessionCatalogTranscriptItemSchema),
	nextCursor: Type.Optional(Type.String())
});
const SessionsCatalogContinueParamsSchema = SessionCatalogLocatorSchema;
const SessionsCatalogContinueResultSchema = closedObject({ sessionKey: NonEmptyString });
const SessionsCatalogImportParamsSchema = closedObject({
	...SessionCatalogLocatorSchema.properties,
	displayName: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 500,
		description: "Prepared presentation title for a newly created imported session. Ignored when updating an existing import."
	}))
});
const SessionsCatalogImportResultSchema = closedObject({
	sessionKey: NonEmptyString,
	importedItems: Type.Integer({ minimum: 0 }),
	totalItems: Type.Integer({ minimum: 0 }),
	complete: Type.Boolean(),
	created: Type.Boolean()
});
const SessionsCatalogArchiveParamsSchema = closedObject({
	...SessionCatalogLocatorSchema.properties,
	confirmNoOtherRunner: Type.Literal(true)
});
const SessionsCatalogArchiveResultSchema = closedObject({ ok: Type.Literal(true) });
const SessionsCatalogStartTerminalParamsSchema = closedObject({
	catalogId: NonEmptyString,
	hostId: Type.Optional(NonEmptyString),
	agentId: NonEmptyString,
	cwd: Type.String({
		minLength: 1,
		maxLength: 4096
	}),
	initialMessage: Type.Optional(Type.String({ maxLength: 16384 }))
});
const SessionsCatalogStartTerminalResultSchema = closedObject({
	sessionId: NonEmptyString,
	agentId: NonEmptyString,
	shell: NonEmptyString,
	cwd: NonEmptyString,
	confined: Type.Boolean(),
	title: Type.Optional(NonEmptyString)
});
//#endregion
//#region packages/gateway-protocol/src/schema/terminal.ts
const TerminalDimension = Type.Integer({
	minimum: 1,
	maximum: 2e3
});
/** Opens a shell session; the server picks the shell, cwd, and confinement. */
const TerminalOpenParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	catalog: Type.Optional(SessionCatalogLocatorSchema),
	cols: TerminalDimension,
	rows: TerminalDimension
});
/** Result of a successful open; carries the facts the UI header renders. */
const TerminalOpenResultSchema = closedObject({
	sessionId: NonEmptyString,
	agentId: NonEmptyString,
	shell: NonEmptyString,
	cwd: NonEmptyString,
	confined: Type.Boolean(),
	title: Type.Optional(NonEmptyString)
});
/** Writes client keystrokes to the session stdin. */
const TerminalInputParamsSchema = closedObject({
	sessionId: NonEmptyString,
	data: Type.String()
});
/** Stages one file on the host bound to an existing terminal session. */
const TerminalUploadParamsSchema = closedObject({
	sessionId: NonEmptyString,
	name: Type.String({
		minLength: 1,
		maxLength: 255
	}),
	contentBase64: Type.String({ maxLength: MAX_TERMINAL_UPLOAD_BASE64_LENGTH })
});
/** Absolute temporary path pasted into the active terminal after upload. */
const TerminalUploadResultSchema = closedObject({
	path: NonEmptyString,
	size: Type.Integer({
		minimum: 0,
		maximum: MAX_TERMINAL_UPLOAD_BYTES
	}),
	/** Explicit path insertion contract for a native CLI rather than a shell. */
	uploadPathStyle: Type.Optional(Type.Literal("native"))
});
/** Resizes the PTY grid after the client viewport changes. */
const TerminalResizeParamsSchema = closedObject({
	sessionId: NonEmptyString,
	cols: TerminalDimension,
	rows: TerminalDimension
});
/** Closes a connection-owned session or detaches from an agent-owned session. */
const TerminalCloseParamsSchema = closedObject({ sessionId: NonEmptyString });
/**
* Attaches the calling admin connection. Connection-owned sessions use
* take-over; agent-owned sessions retain ownership and add a shared viewer.
*/
const TerminalAttachParamsSchema = closedObject({ sessionId: NonEmptyString });
/** Result of a successful attach; mirrors open plus the replay buffer. */
const TerminalAttachResultSchema = closedObject({
	...TerminalOpenResultSchema.properties,
	owner: Type.Optional(Type.Union([Type.Literal("conn"), Type.String({ pattern: "^agent:.+" })])),
	buffer: Type.String(),
	seq: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** One attachable session, as reported by terminal.list. */
const TerminalSessionInfoSchema = closedObject({
	sessionId: NonEmptyString,
	agentId: NonEmptyString,
	shell: NonEmptyString,
	title: Type.Optional(NonEmptyString),
	cwd: NonEmptyString,
	confined: Type.Boolean(),
	/** False while the session is detached (no connection owns its stream). */
	attached: Type.Boolean(),
	/** Connection-owned session, or the trusted agent session key that owns it. */
	owner: Type.Optional(Type.Union([Type.Literal("conn"), Type.String({ pattern: "^agent:.+" })])),
	createdAtMs: Type.Integer({ minimum: 0 })
});
/**
* Sessions a reconnecting admin client can attach. All admin connections see
* the same list: the terminal surface is already operator.admin (full host
* access), so cross-connection visibility adds no privilege.
*/
const TerminalListResultSchema = closedObject({ sessions: Type.Array(TerminalSessionInfoSchema) });
/** Shared ok/void result for input, resize, and close. */
const TerminalAckResultSchema = closedObject({ ok: Type.Boolean() });
/** Streamed output chunk; seq is its cumulative UTF-16 end offset within the session. */
const TerminalDataEventSchema = withSince("2026.7", closedObject({
	sessionId: NonEmptyString,
	seq: Type.Integer({ minimum: 0 }),
	data: Type.String()
}));
/** Terminal end-of-life notice; the session id is invalid after this event. */
const TerminalExitEventSchema = withSince("2026.7", closedObject({
	sessionId: NonEmptyString,
	exitCode: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
	signal: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
	reason: Type.Optional(Type.Union([
		Type.Literal("process_exit"),
		Type.Literal("closed"),
		Type.Literal("disconnected"),
		Type.Literal("detached"),
		Type.Literal("error")
	])),
	error: Type.Optional(Type.String())
}));
/** Union of every event a terminal session can emit. */
const TerminalEventSchema = withSince("2026.7", Type.Union([TerminalDataEventSchema, TerminalExitEventSchema]));
//#endregion
//#region packages/gateway-protocol/src/terminal-validators.ts
const validateTerminalOpenParams = /* @__PURE__ */ lazyCompile(TerminalOpenParamsSchema);
const validateTerminalInputParams = /* @__PURE__ */ lazyCompile(TerminalInputParamsSchema);
const validateTerminalResizeParams = /* @__PURE__ */ lazyCompile(TerminalResizeParamsSchema);
const validateTerminalCloseParams = /* @__PURE__ */ lazyCompile(TerminalCloseParamsSchema);
const validateTerminalAttachParams = /* @__PURE__ */ lazyCompile(TerminalAttachParamsSchema);
const validateTerminalUploadParams = /* @__PURE__ */ lazyCompile(TerminalUploadParamsSchema);
const validateTerminalUploadResult = /* @__PURE__ */ lazyCompile(TerminalUploadResultSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/computer.ts
const ComputerStatusParamsSchema = closedObject({});
const ComputerInvokeParamsSchema = closedObject({
	command: Type.Enum(["screen.snapshot", "computer.act"]),
	params: Type.Record(Type.String(), Type.Unknown()),
	generation: NonEmptyString,
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
	idempotencyKey: NonEmptyString
});
//#endregion
//#region packages/gateway-protocol/src/schema/skill-history.ts
const SkillsProposalHistoryStatusParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
const SkillsProposalHistoryScanParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	direction: Type.Optional(Type.Union([Type.Literal("older"), Type.Literal("newer")]))
});
const SkillsProposalHistoryScanResultSchema = closedObject({
	schema: Type.Literal("openclaw.skill-workshop.history-scan.v1"),
	hasScanned: Type.Boolean(),
	reviewedSessions: Type.Integer({ minimum: 0 }),
	ideasFound: Type.Integer({ minimum: 0 }),
	hasMore: Type.Boolean(),
	lastScanReviewed: Type.Integer({ minimum: 0 }),
	lastScanIdeas: Type.Integer({ minimum: 0 }),
	lastScanAt: Type.Optional(NonEmptyString),
	oldestReviewedAt: Type.Optional(NonEmptyString),
	newestReviewedAt: Type.Optional(NonEmptyString)
});
const validateSkillsProposalHistoryStatusParams = /* @__PURE__ */ lazyCompile(SkillsProposalHistoryStatusParamsSchema);
const validateSkillsProposalHistoryScanParams = /* @__PURE__ */ lazyCompile(SkillsProposalHistoryScanParamsSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/web-search.ts
const text = Type.String({
	minLength: 1,
	maxLength: 512,
	pattern: "\\S"
});
const selection$1 = {
	agentId: Type.Optional(text),
	modelProvider: Type.Optional(text),
	modelId: Type.Optional(text)
};
const WebSearchStatusParamsSchema = closedObject(selection$1);
const WebSearchTestParamsSchema = closedObject({
	...selection$1,
	query: Type.String({
		minLength: 1,
		maxLength: 500
	}),
	providerId: Type.Optional(text)
});
const route = closedObject({
	kind: Type.Union([
		Type.Literal("native"),
		Type.Literal("external"),
		Type.Literal("managed"),
		Type.Literal("disabled"),
		Type.Literal("unavailable")
	]),
	provider: Type.Optional(text),
	label: text,
	reason: Type.Optional(Type.String()),
	testable: Type.Boolean()
});
const WebSearchStatusResultSchema = closedObject({
	enabled: Type.Boolean(),
	provider: Type.Union([text, Type.Null()]),
	agentId: text,
	model: closedObject({
		provider: text,
		id: text,
		runtime: text,
		runtimeLabel: Type.Optional(text)
	}),
	route,
	testProvider: Type.Optional(closedObject({
		id: text,
		label: text
	})),
	providers: Type.Array(closedObject({
		id: text,
		pluginId: text,
		label: text,
		hint: Type.String(),
		configured: Type.Boolean(),
		installed: Type.Boolean(),
		available: Type.Boolean(),
		requiresCredential: Type.Boolean(),
		credentialSource: Type.Union([
			Type.Literal("config"),
			Type.Literal("secretRef"),
			Type.Literal("env"),
			Type.Literal("auth-profile"),
			Type.Literal("none"),
			Type.Literal("missing")
		]),
		credential: Type.Optional(PluginCredentialDescriptorSchema),
		credentialPath: Type.Optional(text),
		configPath: Type.Array(text),
		docsUrl: Type.Optional(text),
		signupUrl: Type.Optional(text)
	}))
});
const citation = closedObject({
	url: Type.String(),
	title: Type.Optional(Type.String())
});
const WebSearchTestResultSchema = closedObject({
	provider: text,
	latencyMs: Type.Number({ minimum: 0 }),
	status: Type.Union([Type.Literal("ok"), Type.Literal("error")]),
	error: Type.Optional(Type.String()),
	content: Type.Optional(Type.String()),
	results: Type.Optional(Type.Array(closedObject({
		title: Type.String(),
		url: Type.String(),
		snippet: Type.Optional(Type.String())
	}))),
	citations: Type.Optional(Type.Array(citation)),
	cached: Type.Optional(Type.Boolean())
});
const validateWebSearchStatusParams = /* @__PURE__ */ lazyCompile(WebSearchStatusParamsSchema);
const validateWebSearchTestParams = /* @__PURE__ */ lazyCompile(WebSearchTestParamsSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/plugin-skills.ts
const name = Type.String({
	minLength: 1,
	maxLength: 256
});
const filePath = Type.String({
	minLength: 1,
	maxLength: 512
});
/** Paths select files inside a declared skill; omitted means its SKILL.md entry. */
const PluginsSkillsReadParamsSchema = Type.Union([closedObject({
	source: Type.Literal("installed"),
	pluginId: name,
	skillName: name,
	path: Type.Optional(filePath),
	version: Type.Optional(name)
}), closedObject({
	source: Type.Literal("catalog"),
	catalogId: name,
	version: name,
	skillName: name,
	path: Type.Optional(filePath)
})]);
const PluginSkillFileSchema = closedObject({
	path: filePath,
	sizeBytes: Type.Integer({ minimum: 0 }),
	status: Type.Union([
		Type.Literal("ready"),
		Type.Literal("deferred"),
		Type.Literal("binary"),
		Type.Literal("too-large"),
		Type.Literal("unavailable")
	]),
	content: Type.Optional(Type.String({ maxLength: SKILL_LIBRARY_MAX_FILE_BYTES }))
});
const PluginsSkillsReadResultSchema = closedObject({
	name,
	rootPath: filePath,
	entryPath: filePath,
	version: Type.Optional(name),
	files: Type.Array(PluginSkillFileSchema, { maxItems: 256 }),
	directories: Type.Array(filePath, { maxItems: 512 }),
	/** False means directory enumeration failed, not merely that a binary cannot render. */
	inventoryComplete: Type.Boolean()
});
const validatePluginsSkillsReadParams = /* @__PURE__ */ lazyCompile(PluginsSkillsReadParamsSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/ui-command.ts
const UiSplitCommandSchema = closedObject({
	kind: Type.Literal("split"),
	direction: Type.Union([Type.Literal("right"), Type.Literal("down")]),
	sessionKey: NonEmptyString
});
const UiClosePaneCommandSchema = closedObject({
	kind: Type.Literal("close-pane"),
	sessionKey: NonEmptyString
});
const UiFocusCommandSchema = closedObject({
	kind: Type.Literal("focus"),
	sessionKey: NonEmptyString
});
const UiSidebarCommandSchema = closedObject({
	kind: Type.Literal("sidebar"),
	visible: Type.Boolean()
});
const UiPanelCommandFields = {
	kind: Type.Literal("panel"),
	open: Type.Boolean(),
	dock: Type.Optional(Type.Union([Type.Literal("bottom"), Type.Literal("right")]))
};
const UiPanelCommandSchema = Type.Union([
	closedObject({
		...UiPanelCommandFields,
		panel: Type.Literal("plugin"),
		pluginId: NonEmptyString,
		panelId: NonEmptyString
	}),
	closedObject({
		...UiPanelCommandFields,
		panel: Type.Literal("terminal"),
		terminalSessionId: Type.Optional(NonEmptyString)
	}),
	closedObject({
		...UiPanelCommandFields,
		panel: Type.Literal("browser")
	}),
	closedObject({
		...UiPanelCommandFields,
		panel: Type.Literal("desktop"),
		environmentId: Type.Optional(NonEmptyString)
	}),
	closedObject({
		...UiPanelCommandFields,
		panel: Type.Literal("portal"),
		portalId: Type.Optional(NonEmptyString)
	}),
	closedObject({
		...UiPanelCommandFields,
		panel: Type.Literal("portal"),
		environmentId: NonEmptyString
	})
]);
const UiNavigateCommandSchema = closedObject({
	kind: Type.Literal("navigate"),
	sessionKey: NonEmptyString
});
const UiCommandSchema = Type.Union([
	UiSplitCommandSchema,
	UiClosePaneCommandSchema,
	UiFocusCommandSchema,
	UiSidebarCommandSchema,
	UiPanelCommandSchema,
	UiNavigateCommandSchema
]);
const UiCommandParamsSchema = closedObject({
	command: UiCommandSchema,
	sessionKey: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString)
});
const UiCommandResultSchema = closedObject({ ok: Type.Boolean() });
//#endregion
//#region packages/gateway-protocol/src/schema/themes.ts
const ThemeValue = Type.String({
	minLength: 1,
	maxLength: 120
});
const ThemeArtworkId = Type.String({
	pattern: THEME_ARTWORK_ID_PATTERN.source,
	maxLength: 32
});
const ThemePaletteSchema = closedObject({
	background: ThemeValue,
	foreground: ThemeValue,
	card: ThemeValue,
	"card-foreground": ThemeValue,
	popover: ThemeValue,
	"popover-foreground": ThemeValue,
	primary: ThemeValue,
	"primary-foreground": ThemeValue,
	secondary: ThemeValue,
	"secondary-foreground": ThemeValue,
	muted: ThemeValue,
	"muted-foreground": ThemeValue,
	accent: ThemeValue,
	"accent-foreground": ThemeValue,
	destructive: ThemeValue,
	"destructive-foreground": ThemeValue,
	border: ThemeValue,
	input: ThemeValue,
	ring: ThemeValue,
	"font-sans": Type.Optional(ThemeValue),
	"font-mono": Type.Optional(ThemeValue)
});
const ThemeDefinitionSchema = closedObject({
	name: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	description: Type.String({
		minLength: 1,
		maxLength: 320
	}),
	mascot: Type.Optional(Type.Union([Type.Literal("claw"), Type.Literal("none")])),
	workingPhrases: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 24
	}), { maxItems: 24 })),
	critters: Type.Optional(Type.Array(ThemeArtworkId, { maxItems: 8 })),
	avatarHat: Type.Optional(ThemeArtworkId),
	light: Type.Optional(ThemePaletteSchema),
	dark: Type.Optional(ThemePaletteSchema)
});
const ThemeModeSchema = Type.Union([
	Type.Literal("system"),
	Type.Literal("light"),
	Type.Literal("dark")
]);
const ThemeId = Type.String({
	minLength: 1,
	maxLength: 256
});
const ThemesListParamsSchema = closedObject({});
const ThemesGetParamsSchema = closedObject({ id: Type.Optional(ThemeId) });
const ThemesSetParamsSchema = closedObject({
	id: Type.Optional(Type.Union([ThemeId, Type.Null()])),
	mode: Type.Optional(Type.Union([ThemeModeSchema, Type.Null()])),
	appearance: Type.Optional(closedObject({
		accent: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		fontUi: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		fontChat: Type.Optional(Type.Union([Type.String(), Type.Null()]))
	}))
});
const ThemesImportParamsSchema = closedObject({
	id: Type.String({
		minLength: 1,
		maxLength: 64,
		pattern: "^[a-z0-9][a-z0-9_-]*$"
	}),
	definition: ThemeDefinitionSchema,
	apply: Type.Optional(Type.Boolean()),
	mode: Type.Optional(ThemeModeSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/talk-voice.ts
const TALK_VOICE_CHANGE_TIMEOUT_MS = 6e4;
const target = {
	sessionKey: Type.Optional(NonEmptyString),
	voiceSessionId: Type.Optional(NonEmptyString)
};
const selection = {
	voiceSessionId: NonEmptyString,
	sessionKey: NonEmptyString,
	provider: NonEmptyString,
	model: Type.Optional(NonEmptyString),
	voice: Type.Optional(NonEmptyString),
	voices: Type.Array(NonEmptyString),
	canChange: Type.Boolean()
};
const TalkVoiceGetParamsSchema = closedObject(target);
const TalkVoiceSetParamsSchema = closedObject({
	...target,
	voice: NonEmptyString
});
const TalkVoiceSelectionSchema = closedObject(selection);
const TalkVoiceSetResultSchema = closedObject({
	...selection,
	status: Type.Literal("applied")
});
const TalkVoiceCompleteParamsSchema = closedObject({
	changeId: NonEmptyString,
	voiceSessionId: Type.Optional(NonEmptyString),
	outcome: Type.Union([Type.Literal("ready"), Type.Literal("failed")]),
	error: Type.Optional(Type.String({ maxLength: 1e3 }))
});
const TalkVoiceChangeEventSchema = closedObject({
	changeId: NonEmptyString,
	voiceSessionId: NonEmptyString,
	sessionKey: NonEmptyString,
	voice: NonEmptyString,
	phase: Type.Union([Type.Literal("requested"), Type.Literal("cancelled")])
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-list.ts
const SessionsListParamsSchema = closedObject({
	/** Omit detail-only capability metadata; sessions.describe retains the full row. */
	rowMode: Type.Optional(Type.Literal("compact")),
	/** Maximum rows to return; omitted Gateway RPC calls use a bounded default. */
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
	/** Activity age for sortBy: "activity"; otherwise metadata update age. */
	activeMinutes: Type.Optional(Type.Integer({ minimum: 1 })),
	/** Strictly ascending epoch-ms bucket boundaries in the caller's local time zone. */
	activityPulseBoundaries: Type.Optional(Type.Array(Type.Number({ minimum: 0 }), {
		minItems: 2,
		maxItems: 64
	})),
	/** Select sessions with current direct running or queued work before pagination. */
	activeOnly: Type.Optional(Type.Boolean()),
	/** Require a real user/channel interaction; excludes synthetic isolated heartbeat rows. */
	requireLastInteraction: Type.Optional(Type.Boolean()),
	sortBy: Type.Optional(Type.Union([
		Type.Literal("updatedAt"),
		Type.Literal("lastInteractionAt"),
		Type.Literal("activity")
	])),
	includeGlobal: Type.Optional(Type.Boolean()),
	includeUnknown: Type.Optional(Type.Boolean()),
	/** Exclude subagent sessions before facets and pagination. */
	excludeSubagents: Type.Optional(Type.Boolean()),
	/** Exclude automation roots as well as individual cron runs. */
	excludeCron: Type.Optional(Type.Boolean()),
	/** Exclude machine-created probe/system sessions using recorded provenance. */
	excludeSystem: Type.Optional(Type.Boolean()),
	/** Limit agent-scoped rows to agents currently present in config. */
	configuredAgentsOnly: Type.Optional(Type.Boolean()),
	/**
	* Read a bounded transcript head projection to derive a title from the first user message.
	* Use `limit` to bound projection work on large stores.
	*/
	includeDerivedTitles: Type.Optional(Type.Boolean()),
	/**
	* Read a bounded transcript tail projection for the latest visible user or assistant text.
	* The returned short preview excludes tool, system, reasoning, and silent rows.
	*/
	includeLastMessage: Type.Optional(Type.Boolean()),
	/** Include the durable Activity recap and its canonical transcript freshness. */
	includeActivitySummary: Type.Optional(Type.Boolean()),
	label: Type.Optional(SessionLabelString),
	/** Exact project registry association stored on the session, not its repository workspace ID. */
	projectId: Type.Optional(NonEmptyString),
	/** Exact stored task cwd, falling back to the stored spawned workspace; never resolves paths. */
	workspaceDir: Type.Optional(NonEmptyString),
	/** Exact custom sidebar category; an empty string selects ungrouped sessions. */
	group: Type.Optional(Type.String()),
	/** Filter by the canonical root-session pin state. */
	pinned: Type.Optional(Type.Boolean()),
	/** Limit rows to sessions with an explicitly stored Control UI face preference. */
	boardFace: Type.Optional(Type.Union([Type.Literal("chat"), Type.Literal("dashboard")])),
	/** Limit rows by whether a persisted session dashboard exists. */
	hasBoard: Type.Optional(Type.Boolean()),
	/** Filter rows by their immutable creator provenance. */
	creatorId: Type.Optional(NonEmptyString),
	/** Filter rows by their current assignable owner identity. */
	ownerId: Type.Optional(NonEmptyString),
	/** Prepend the authenticated viewer's owned rows to the normal first page. */
	ownerFirst: Type.Optional(Type.Boolean()),
	/** Limit rows to sessions owned by or previously prompted by the authenticated viewer. */
	involvingMe: Type.Optional(Type.Boolean()),
	/** Qualified human-profile relationship, independent of id-only actor filters. */
	profileRelation: Type.Optional(closedObject({
		profileId: NonEmptyString,
		relationship: Type.Union([
			Type.Literal("owned"),
			Type.Literal("created"),
			Type.Literal("involving")
		])
	})),
	/** Profile association filter, applied to visible retained identities before pagination. */
	involvingProfileId: Type.Optional(NonEmptyString),
	/** Include a bounded people facet over visible matching sessions before the profile filter. */
	includePeople: Type.Optional(Type.Boolean()),
	/**
	* Include complete per-profile ownership counts over caller-visible matching sessions before
	* pagination. Open counts only unarchived sessions; running excludes queued and descendant work.
	* All list filters still apply; omit agentId for a cross-agent summary.
	*/
	includeOwnerSessionCounts: Type.Optional(Type.Boolean()),
	spawnedBy: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	search: Type.Optional(Type.String()),
	/**
	* True lists archived sessions; "all" lists archived and active;
	* false or omitted lists active sessions.
	*/
	archived: Type.Optional(Type.Union([Type.Boolean(), Type.Literal("all")]))
});
/** One canonical profile owner with at least one visible, matching unarchived session. */
const SessionOwnerSessionCountSchema = closedObject({
	profileId: NonEmptyString,
	open: Type.Integer({ minimum: 1 }),
	running: Type.Integer({ minimum: 0 })
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-recover.ts
/** Recovers one restart-tombstoned session into a fresh same-agent session. */
const SessionsRecoverParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const SessionRecoveryContinuationOutcomeSchema = Type.Union([closedObject({
	status: Type.Literal("started"),
	runId: NonEmptyString
}), closedObject({
	status: Type.Literal("rejected"),
	error: ErrorShapeSchema
})]);
const SessionsRecoverResultSchema = closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: NonEmptyString,
	continuation: SessionRecoveryContinuationOutcomeSchema
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-create.ts
const SESSION_CREATE_RETRY_WINDOW_MS = 24e4;
const SESSION_CREATE_IDEMPOTENCY_RETENTION_MS = 3e5;
/** Creates or adopts a session with optional model, thinking, fast mode, label, and parent linkage. */
const SessionsCreateParamsSchema = closedObject({
	key: Type.Optional(NonEmptyString),
	idempotencyKey: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	label: Type.Optional(SessionLabelString),
	displayName: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 500,
		description: "Prepared presentation title for a newly created session. Unlike label it is not unique and never claims a label; ignored when adopting an existing key."
	})),
	titleSource: Type.Optional(Type.String({
		maxLength: 1e3,
		description: "Submitted topic for background naming when the first turn is sent separately. Does not start a turn; ignored when adopting an existing session."
	})),
	category: Type.Optional(SessionLabelString),
	model: Type.Optional(NonEmptyString),
	agentRuntime: Type.Optional(NonEmptyString),
	contextWindow: Type.Optional(NonEmptyString),
	thinkingLevel: Type.Optional(NonEmptyString),
	fastMode: Type.Optional(Type.Union([
		Type.Boolean(),
		Type.Literal("auto"),
		Type.Literal("ultrafast")
	])),
	permissionMode: Type.Optional(SessionPermissionModeSchema),
	toolOverrides: Type.Optional(SessionToolOverridesSchema),
	incognito: Type.Optional(Type.Boolean()),
	visibility: Type.Optional(SessionVisibilitySchema),
	catalogId: Type.Optional(NonEmptyString),
	parentSessionKey: Type.Optional(NonEmptyString),
	spawnDepth: Type.Optional(Type.Integer({
		minimum: 1,
		description: "Spawn-lineage depth for spawn-owned creations (visible subagent sessions); requires parentSessionKey. Omitted creations persist as root sessions (depth 0)."
	})),
	fork: Type.Optional(Type.Boolean({ description: "Fork the parent transcript; requires parentSessionKey." })),
	forkFrom: Type.Optional(Type.Literal("last-completed", { description: "Fork through the parent's last completed assistant message; requires fork=true." })),
	emitCommandHooks: Type.Optional(Type.Boolean()),
	succeedsParent: Type.Optional(Type.Boolean({ description: "When sessions.create creates a distinct child, whether that child succeeds its parent and emits the parent's terminal session_end. Requires parentSessionKey and emitCommandHooks. False keeps the parent active; omission preserves legacy behavior." })),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	task: Type.Optional(Type.String()),
	message: Type.Optional(Type.String()),
	mentions: Type.Optional(HumanMentionsSchema),
	attachments: Type.Optional(ChatAttachmentsSchema),
	projectId: Type.Optional(Type.String({
		minLength: 1,
		description: "Start in a registered project; operator.write."
	})),
	projectGitUrl: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 2048,
		description: "Prepare a remote project before the initial agent turn; operator.write."
	})),
	/** Remote-owned source; create, dispatch, then send the initial turn. */
	repository: Type.Optional(SessionRepositorySourceSchema),
	worktree: Type.Optional(Type.Boolean()),
	worktreeSource: Type.Optional(Type.Literal("empty", { description: "Start a fresh isolated workspace without copying a repository or agent workspace. Requires worktree=true; cannot be combined with cwd, project, repository, catalog, execNode, or worktreeBaseRef." })),
	worktreeBaseRef: Type.Optional(Type.String({
		minLength: 1,
		description: "Base ref for the new managed worktree branch. Requires worktree=true."
	})),
	worktreeName: Type.Optional(Type.String({
		pattern: "^[a-z0-9][a-z0-9-]{0,63}$",
		description: "Managed worktree name; becomes branch openclaw/<name>. Requires worktree=true."
	})),
	execNode: Type.Optional(Type.String({
		minLength: 1,
		description: "Bind session exec to host=node with this node id/name. Requires operator.admin."
	})),
	cwd: Type.Optional(Type.String({
		minLength: 1,
		description: "Absolute Gateway working directory, managed-worktree source directory, or working directory on execNode. Gateway paths outside configured agent workspaces and all execNode paths require operator.admin."
	}))
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-involvement.ts
/** Changes only the signed-in person's Involving me list, never session access. */
const SessionsSetInvolvementParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	expectedSessionId: NonEmptyString,
	hidden: Type.Boolean()
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-storage.ts
const SessionsStorageParamsSchema = closedObject({});
const SessionsStorageStatusResultSchema = closedObject({
	agents: Type.Array(closedObject({
		agentId: NonEmptyString,
		storePath: NonEmptyString,
		hotTranscripts: Type.Integer({ minimum: 0 }),
		coldTranscripts: Type.Integer({ minimum: 0 }),
		databaseBytes: Type.Integer({ minimum: 0 }),
		walBytes: Type.Integer({ minimum: 0 }),
		archiveBytes: Type.Integer({ minimum: 0 }),
		embeddedArchiveBytes: Type.Integer({ minimum: 0 })
	})),
	maintenance: closedObject({
		running: Type.Boolean(),
		lastStartedAt: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
		lastCompletedAt: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
		lastError: Type.Union([Type.String(), Type.Null()]),
		archivedTranscripts: Type.Integer({ minimum: 0 }),
		externalizedTranscripts: Type.Integer({ minimum: 0 })
	})
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-title.ts
/** Optional creation-only inference; never creates or renames a session. */
const SessionsTitlePrepareParamsSchema = closedObject({
	agentId: NonEmptyString,
	message: Type.String({ maxLength: 1e3 }),
	model: Type.Optional(NonEmptyString),
	catalogId: Type.Optional(NonEmptyString),
	incognito: Type.Optional(Type.Boolean())
});
closedObject({ title: Type.Union([Type.String({
	minLength: 1,
	maxLength: 60
}), Type.Null()]) });
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-delete.ts
/** Deletes a session record and optionally its transcript. */
const SessionsDeleteParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	deleteTranscript: Type.Optional(Type.Boolean()),
	expectedSessionId: Type.Optional(NonEmptyString),
	expectedLifecycleRevision: Type.Optional(NonEmptyString),
	expectedSessionUpdatedAt: Type.Optional(Type.Number({ minimum: 0 })),
	emitLifecycleHooks: Type.Optional(Type.Boolean()),
	/**
	* Restricts the delete to already-archived sessions (archive-then-delete).
	* operator.write callers must set this; deletes without it require
	* operator.admin.
	*/
	archivedOnly: Type.Optional(Type.Boolean())
});
const WORKTREE_PRESERVATION_REASONS = [
	"owner-mismatch",
	"busy",
	"foreign-lock",
	"snapshot-failed",
	"cleanup-failed"
];
const WorktreePreservationReasonSchema = Type.Enum(WORKTREE_PRESERVATION_REASONS, { type: "string" });
const PreservedSessionWorktreeSchema = closedObject({
	id: NonEmptyString,
	branch: NonEmptyString,
	path: NonEmptyString,
	reason: WorktreePreservationReasonSchema
});
/** Result returned after deleting a session and completing owned cleanup. */
const SessionsDeleteResultSchema = closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	deleted: Type.Boolean(),
	archived: Type.Array(NonEmptyString),
	worktreePreserved: Type.Optional(PreservedSessionWorktreeSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-patch.ts
const SESSIONS_PATCH_MANY_MAX_TARGETS = 100;
const ExpectedMarkedUnreadAt = Type.Optional(Type.Union([Type.Number({ minimum: 0 }), Type.Null()], { description: "Apply an automatic unread=false acknowledgement only if the explicit unread marker still matches; null asserts no marker." }));
const SessionsPatchMutationProperties = {
	label: Type.Optional(Type.Union([SessionLabelString, Type.Null()])),
	/** Automatic device name, separate from explicit user renames; null clears it. */
	autoLabel: Type.Optional(Type.Union([SessionLabelString, Type.Null()])),
	icon: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	/** Named sidebar tint from SESSION_COLOR_IDS; null clears it. */
	color: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	/** User-defined organization bucket ("category", not chat-group); null clears it. */
	category: Type.Optional(Type.Union([SessionLabelString, Type.Null()])),
	boardFace: Type.Optional(Type.Union([Type.Literal("chat"), Type.Literal("dashboard")])),
	/** Shared dashboard default; null restores the built-in split view. */
	boardPresentation: Type.Optional(Type.Union([
		Type.Literal("split"),
		Type.Literal("expanded"),
		Type.Null()
	])),
	statusNote: Type.Optional(Type.Union([Type.String({ maxLength: 120 }), Type.Null()], { description: "Short expiring sidebar status note; null clears it and any declared attention." })),
	attention: Type.Optional(Type.Union([Type.String({ enum: [...SESSION_AGENT_ATTENTION_ICON_IDS] }), Type.Null()])),
	ttlMinutes: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 120
	})),
	archived: Type.Optional(Type.Boolean()),
	pinned: Type.Optional(Type.Boolean()),
	snoozedUntil: Type.Optional(Type.Union([Type.Integer({ minimum: 1 }), Type.Null()], { description: "Epoch ms wake time that hides the session from active lists until then; null wakes it." })),
	unread: Type.Optional(Type.Boolean({ description: "Set true to mark unread; false records the session as read." })),
	contextWindow: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	thinkingLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	fastMode: Type.Optional(Type.Union([
		Type.Boolean(),
		Type.Literal("auto"),
		Type.Literal("ultrafast"),
		Type.Null()
	])),
	toolOverrides: Type.Optional(Type.Union([SessionToolOverridesSchema, Type.Null()])),
	verboseLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	traceLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	reasoningLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	responseUsage: Type.Optional(Type.Union([
		Type.Literal("off"),
		Type.Literal("tokens"),
		Type.Literal("full"),
		Type.Literal("on"),
		Type.Null()
	])),
	elevatedLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	execHost: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	execSecurity: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	execAsk: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	execNode: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	permissionMode: Type.Optional(Type.Union([SessionPermissionModeSchema, Type.Null()])),
	/** Null restores configured containment; required session isolation cannot be relaxed. */
	sandboxMode: Type.Optional(Type.Union([Type.Literal("off"), Type.Null()])),
	nativeRuntimeConsent: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	model: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	/** Explicit runtime for the selected model; null follows configured routing. */
	agentRuntime: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	completionOwnerSessionKey: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	inheritedToolPolicyVersion: Type.Optional(Type.Union([Type.Literal(1), Type.Null()])),
	inheritedToolAllow: Type.Optional(Type.Union([Type.Array(NonEmptyString), Type.Null()])),
	inheritedToolDeny: Type.Optional(Type.Union([Type.Array(NonEmptyString), Type.Null()])),
	sendPolicy: Type.Optional(Type.Union([
		Type.Literal("allow"),
		Type.Literal("deny"),
		Type.Null()
	])),
	groupActivation: Type.Optional(Type.Union([
		Type.Literal("mention"),
		Type.Literal("always"),
		Type.Null()
	]))
};
/** Mutable per-session preferences and routing metadata. */
const SessionsPatchParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	/** Reject the mutation if the session was reset or replaced before it commits. */
	expectedSessionId: Type.Optional(NonEmptyString),
	expectedLifecycleRevision: Type.Optional(NonEmptyString),
	expectedPermissionMode: Type.Optional(Type.Union([SessionPermissionModeSchema, Type.Null()])),
	expectedSandboxMode: Type.Optional(Type.Union([Type.Literal("off"), Type.Null()])),
	expectedNativeRuntimeConsent: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	expectedToolOverrides: Type.Optional(Type.Union([SessionToolOverridesSchema, Type.Null()], { description: "Replace toolOverrides only when the current sparse overlay still matches this value; null asserts no overlay." })),
	expectedMarkedUnreadAt: ExpectedMarkedUnreadAt,
	...SessionsPatchMutationProperties
});
const SessionsPatchMutationSchema = Type.Object(SessionsPatchMutationProperties, {
	additionalProperties: false,
	minProperties: 1
});
const SessionsPatchManyTargetSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	expectedSessionId: Type.Optional(NonEmptyString),
	expectedLifecycleRevision: Type.Optional(NonEmptyString),
	expectedSandboxMode: Type.Optional(Type.Union([Type.Literal("off"), Type.Null()])),
	expectedPermissionMode: Type.Optional(Type.Union([SessionPermissionModeSchema, Type.Null()])),
	expectedNativeRuntimeConsent: Type.Optional(Type.Union([NonEmptyString, Type.Null()]))
});
const SessionsPatchManyParamsSchema = closedObject({
	targets: Type.Array(SessionsPatchManyTargetSchema, {
		minItems: 1,
		maxItems: 100
	}),
	patch: SessionsPatchMutationSchema
});
const SessionsPatchManyOutcomeIdentitySchema = {
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
};
const SessionsPatchManyResultSchema = closedObject({ outcomes: Type.Array(Type.Union([closedObject({
	ok: Type.Literal(true),
	...SessionsPatchManyOutcomeIdentitySchema
}), closedObject({
	ok: Type.Literal(false),
	...SessionsPatchManyOutcomeIdentitySchema,
	error: ErrorShapeSchema
})])) });
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-search.ts
/** Searches explicit agent keys, or the complete visible roster selected by scope. */
const SessionsSearchParamsSchema = Object.assign(closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKeys: Type.Optional(Type.Array(NonEmptyString, {
		minItems: 1,
		maxItems: 200
	})),
	/** Search the complete visible roster selected by these membership filters. */
	scope: Type.Optional(closedObject(Type.Pick(SessionsListParamsSchema, [
		"activeMinutes",
		"activeOnly",
		"requireLastInteraction",
		"sortBy",
		"includeGlobal",
		"includeUnknown",
		"excludeSubagents",
		"excludeCron",
		"excludeSystem",
		"configuredAgentsOnly",
		"label",
		"projectId",
		"workspaceDir",
		"group",
		"pinned",
		"boardFace",
		"hasBoard",
		"creatorId",
		"ownerId",
		"involvingMe",
		"profileRelation",
		"involvingProfileId",
		"spawnedBy",
		"agentId",
		"search",
		"archived"
	]).properties)),
	query: Type.String({
		minLength: 1,
		maxLength: 4096
	}),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 25
	}))
}), { not: {
	required: ["scope"],
	anyOf: [{ required: ["agentId"] }, { required: ["sessionKeys"] }]
} });
/** One full-text session transcript match with follow-up provenance. */
const SessionsSearchHitSchema = closedObject({
	sessionKey: NonEmptyString,
	sessionId: NonEmptyString,
	messageId: NonEmptyString,
	role: Type.Union([Type.Literal("user"), Type.Literal("assistant")]),
	timestamp: Type.Integer({ minimum: 0 }),
	snippet: Type.String(),
	score: Type.Number()
});
/** Full-text search response; indexing marks a still-running first-use reconcile. */
const SessionsSearchResultSchema = closedObject({
	results: Type.Array(SessionsSearchHitSchema),
	/** Scope searches include only the visible rows referenced by returned matches. */
	sessions: Type.Optional(Type.Array(SessionRowSchema, { maxItems: 25 })),
	indexing: Type.Optional(Type.Boolean()),
	archivedTranscriptsExcluded: Type.Optional(Type.Integer({ minimum: 0 })),
	truncated: Type.Optional(Type.Boolean())
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-sharing.ts
/** A selectable sharing identity is a created actor with a durable id. */
const SessionSharingIdentitySchema = closedObject({
	...SessionCreatedActorSchema.properties,
	id: NonEmptyString
});
const SessionSharingActionSchema = Type.Union([
	Type.Literal("visibility"),
	Type.Literal("member-added"),
	Type.Literal("member-removed")
]);
const SessionSharingTargetParamsSchema = {
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
};
const SessionVisibilitySetParamsSchema = closedObject({
	...SessionSharingTargetParamsSchema,
	visibility: SessionVisibilitySchema
});
const SessionVisibilitySetResultSchema = closedObject({
	ok: Type.Literal(true),
	sessionKey: NonEmptyString,
	visibility: SessionVisibilitySchema
});
const SessionPublicShareSchema = closedObject({
	token: Type.String({
		pattern: "^v1\\.[A-Za-z0-9_-]+$",
		maxLength: 7e3
	}),
	createdAt: Type.Integer({ minimum: 0 })
});
const SessionPublicShareSetParamsSchema = closedObject({
	...SessionSharingTargetParamsSchema,
	expectedSessionId: NonEmptyString,
	enabled: Type.Boolean()
});
const SessionPublicShareSetResultSchema = closedObject({
	ok: Type.Literal(true),
	sessionKey: NonEmptyString,
	publicShare: Type.Optional(SessionPublicShareSchema)
});
const SessionMembersListParamsSchema = closedObject(SessionSharingTargetParamsSchema);
const SessionMemberSchema = closedObject({
	identityId: NonEmptyString,
	addedBy: NonEmptyString,
	addedAt: Type.Integer({ minimum: 0 })
});
const SessionMemberEvidenceSchema = Object.assign(closedObject({
	identityId: NonEmptyString,
	addedBy: Type.Optional(NonEmptyString),
	/** Explicit principal-less evidence; omission means no actor evidence was supplied. */
	addedByState: Type.Optional(Type.Literal("unknown")),
	addedAt: Type.Integer({ minimum: 0 })
}), { not: { required: ["addedBy", "addedByState"] } });
const SessionMembersListResultSchema = closedObject({
	sessionKey: NonEmptyString,
	publicShare: Type.Optional(SessionPublicShareSchema),
	owner: Type.Optional(SessionSharingIdentitySchema),
	members: Type.Array(SessionMemberSchema),
	identities: Type.Array(SessionSharingIdentitySchema),
	role: SessionSharingRoleSchema,
	allowedVisibilities: Type.Array(SessionVisibilitySchema)
});
const SessionMembersListEvidenceResultSchema = closedObject({
	sessionKey: NonEmptyString,
	publicShare: Type.Optional(SessionPublicShareSchema),
	owner: Type.Optional(SessionSharingIdentitySchema),
	members: Type.Array(SessionMemberEvidenceSchema),
	identities: Type.Array(SessionSharingIdentitySchema),
	role: SessionSharingRoleSchema,
	allowedVisibilities: Type.Array(SessionVisibilitySchema)
});
const SessionMemberAddParamsSchema = closedObject({
	...SessionSharingTargetParamsSchema,
	identityId: NonEmptyString
});
const SessionMemberRemoveParamsSchema = SessionMemberAddParamsSchema;
const SessionMemberMutationResultSchema = closedObject({
	ok: Type.Literal(true),
	sessionKey: NonEmptyString,
	identityId: NonEmptyString
});
const SessionSharingEventTargetFields = {
	action: SessionSharingActionSchema,
	sessionKey: NonEmptyString,
	agentId: NonEmptyString
};
const SessionSharingEventChangeFields = {
	visibility: Type.Optional(SessionVisibilitySchema),
	identityId: Type.Optional(NonEmptyString),
	ts: Type.Integer({ minimum: 0 })
};
/** Original sharing event contract. Older generated clients require `actor`. */
const SessionSharingEventSchema = closedObject({
	...SessionSharingEventTargetFields,
	actor: SessionSharingIdentitySchema,
	...SessionSharingEventChangeFields
});
/** Principal-less sharing changes use a distinct additive event name. */
const SessionSharingEvidenceEventSchema = closedObject({
	...SessionSharingEventTargetFields,
	/** Explicit principal-less evidence; omission means no actor evidence was supplied. */
	actorState: Type.Optional(Type.Literal("unknown")),
	...SessionSharingEventChangeFields
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-suggestions.ts
const SessionSuggestionTargetParamsSchema = {
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
};
const SessionSuggestionStateSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("accepted"),
	Type.Literal("dismissed")
]);
const SessionSuggestionResolutionSchema = Type.Union([
	Type.Literal("send"),
	Type.Literal("queue"),
	Type.Literal("edit"),
	Type.Literal("dismiss")
]);
const SessionSuggestionActionSchema = Type.Union([Type.Literal("added"), Type.Literal("resolved")]);
const SessionSuggestionSchema = closedObject({
	id: NonEmptyString,
	sessionKey: NonEmptyString,
	agentId: NonEmptyString,
	author: SessionSharingIdentitySchema,
	text: Type.String({
		minLength: 1,
		maxLength: 32768
	}),
	createdAt: Type.Integer({ minimum: 0 }),
	state: SessionSuggestionStateSchema
});
const SessionSuggestionsAddParamsSchema = closedObject({
	...SessionSuggestionTargetParamsSchema,
	text: Type.String({
		minLength: 1,
		maxLength: 32768
	})
});
const SessionSuggestionsListParamsSchema = closedObject(SessionSuggestionTargetParamsSchema);
const SessionSuggestionsResolveParamsSchema = closedObject({
	...SessionSuggestionTargetParamsSchema,
	id: NonEmptyString,
	resolution: SessionSuggestionResolutionSchema
});
const SessionSuggestionsAddResultSchema = closedObject({ suggestion: SessionSuggestionSchema });
const SessionSuggestionsListResultSchema = closedObject({
	suggestions: Type.Array(SessionSuggestionSchema),
	role: SessionSharingRoleSchema
});
const SessionSuggestionsResolveResultSchema = closedObject({ suggestion: SessionSuggestionSchema });
const SessionSuggestionEventSchema = closedObject({
	action: SessionSuggestionActionSchema,
	suggestion: SessionSuggestionSchema
});
const SessionTypingParamsSchema = closedObject({
	...SessionSuggestionTargetParamsSchema,
	sessionId: NonEmptyString,
	typing: Type.Boolean(),
	preview: Type.Optional(Type.String({ maxLength: 400 }))
});
const SessionTypingResultSchema = closedObject({
	ok: Type.Literal(true),
	broadcast: Type.Boolean()
});
const SessionTypingEventSchema = closedObject({
	sessionKey: NonEmptyString,
	sessionId: NonEmptyString,
	agentId: NonEmptyString,
	actor: SessionSharingIdentitySchema,
	typing: Type.Boolean(),
	preview: Type.Optional(Type.String({ maxLength: 400 })),
	ts: Type.Integer({ minimum: 0 })
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-reactions.ts
const SessionReactionTargetParamsSchema = {
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
};
const ReactionEmojiSchema = Type.String({
	minLength: 1,
	maxLength: 32
});
const emojiSegmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const emojiSequence = /^(?:\p{Regional_Indicator}{2}|[#*0-9]️?⃣|\u{1F3F4}[\u{E0061}-\u{E007A}]+\u{E007F}|\p{Extended_Pictographic}️?\p{Emoji_Modifier}?(?:‍\p{Extended_Pictographic}️?\p{Emoji_Modifier}?)*)$/u;
/** One emoji grapheme: the Gateway's admission rule, shared with pickers for instant feedback. */
function isReactionEmoji(emoji) {
	return Array.from(emoji).length <= 32 && [...emojiSegmenter.segment(emoji)].length === 1 && emojiSequence.test(emoji);
}
const MessageReactionSummarySchema = closedObject({
	emoji: ReactionEmojiSchema,
	count: Type.Integer({ minimum: 1 }),
	identities: Type.Array(closedObject({
		id: NonEmptyString,
		label: Type.Optional(Type.String())
	}), { minItems: 1 })
});
const SessionReactionMirrorSchema = closedObject({
	status: Type.Union([
		Type.Literal("delivered"),
		Type.Literal("failed"),
		Type.Literal("skipped")
	]),
	reason: Type.Optional(Type.String())
});
const SessionReactionsSetParamsSchema = closedObject({
	...SessionReactionTargetParamsSchema,
	messageId: NonEmptyString,
	emoji: ReactionEmojiSchema,
	remove: Type.Optional(Type.Boolean())
});
const SessionReactionsListParamsSchema = closedObject(SessionReactionTargetParamsSchema);
const SessionReactionsSetResultSchema = closedObject({
	messageId: NonEmptyString,
	reactions: Type.Array(MessageReactionSummarySchema),
	mirror: Type.Optional(SessionReactionMirrorSchema)
});
const SessionReactionsListResultSchema = closedObject({
	sessionId: NonEmptyString,
	reactions: Type.Record(NonEmptyString, Type.Array(MessageReactionSummarySchema))
});
const SessionReactionEventSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: NonEmptyString,
	sessionId: NonEmptyString,
	messageId: NonEmptyString,
	emoji: ReactionEmojiSchema,
	action: Type.Union([Type.Literal("added"), Type.Literal("removed")]),
	actor: SessionSharingIdentitySchema,
	reactions: Type.Array(MessageReactionSummarySchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/projects.ts
const StoredProjectIdSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9-]{0,63}$" });
const PROJECTS_LIST_DEFAULT_LIMIT = 50;
const PROJECTS_LIST_MAX_CHECKOUTS_PER_PROJECT = 50;
const PROJECTS_LIST_MAX_IDENTITY_PROBES = 32;
const ProjectRecordSchema = closedObject({
	id: NonEmptyString,
	displayName: NonEmptyString,
	repoRoot: Type.Optional(Type.String({
		minLength: 1,
		description: "Repository checkout root; included only for callers holding operator.write."
	})),
	originUrl: Type.Optional(Type.String({
		minLength: 1,
		description: "Repository origin URL; included only for callers holding operator.write."
	})),
	source: Type.String({ enum: [
		"workspace",
		"registered",
		"cloned"
	] }),
	agentId: Type.Optional(NonEmptyString)
});
const ProjectRecentProjectSchema = closedObject({
	kind: Type.Literal("project"),
	projectId: NonEmptyString,
	displayName: NonEmptyString
});
const ProjectRecentFolderSchema = closedObject({
	kind: Type.Literal("folder"),
	folder: NonEmptyString,
	displayName: NonEmptyString,
	execNode: Type.Optional(NonEmptyString)
});
const ProjectRecentRepositorySchema = closedObject({
	kind: Type.Literal("repository"),
	url: Type.String({
		minLength: 1,
		maxLength: 2048
	}),
	displayName: NonEmptyString
});
const ProjectRecentSchema = Type.Union([
	ProjectRecentProjectSchema,
	ProjectRecentFolderSchema,
	ProjectRecentRepositorySchema
]);
/** One gateway-visible checkout for an observed repository project. */
const ProjectCheckoutSchema = closedObject({
	runnerId: Type.String({
		minLength: 1,
		description: "Runner hosting this operator.write-scoped checkout."
	}),
	path: Type.String({
		minLength: 1,
		description: "Physical checkout path returned only to operator.write-capable callers."
	})
});
/** Repository identity derived from visible checkout and session state. */
const ProjectSummarySchema = closedObject({
	name: NonEmptyString,
	originUrl: Type.Optional(Type.String({
		minLength: 1,
		description: "Sanitized repository origin returned to operator.write-capable callers."
	})),
	checkouts: Type.Array(ProjectCheckoutSchema, {
		minItems: 1,
		maxItems: 50
	}),
	lastUsedAt: Type.Number({ minimum: 0 })
});
const ProjectsListParamsSchema = closedObject({ includeObserved: Type.Optional(Type.Boolean({ description: "Compute write-scoped observed checkout groups in addition to projects." })) });
const ProjectDefaultRepositorySchema = closedObject({
	identity: Type.String({
		minLength: 1,
		maxLength: 200
	}),
	url: Type.String({
		minLength: 1,
		maxLength: 2048
	}),
	ref: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 255
	})),
	profileId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	}))
});
const ProjectsListResultSchema = closedObject({
	projects: Type.Array(ProjectRecordSchema),
	defaultRepository: Type.Optional(ProjectDefaultRepositorySchema),
	githubHost: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 2048
	})),
	recents: Type.Optional(Type.Array(ProjectRecentSchema, { maxItems: 8 })),
	observedProjects: Type.Optional(Type.Array(ProjectSummarySchema, {
		maxItems: 50,
		description: "Observed checkout details returned only to operator.write-capable callers."
	}))
});
const ProjectsRegisterParamsSchema = closedObject({
	path: NonEmptyString,
	name: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	}))
});
const ProjectsRegisterResultSchema = ProjectRecordSchema;
const ProjectsAddParamsSchema = closedObject({
	gitUrl: Type.String({
		minLength: 1,
		maxLength: 2048
	}),
	name: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	}))
});
const ProjectsAddResultSchema = ProjectRecordSchema;
const RemoteProjectSchema = closedObject({
	name: Type.String({
		minLength: 1,
		maxLength: 100
	}),
	fullName: Type.String({
		minLength: 1,
		maxLength: 200
	}),
	description: Type.Optional(Type.String({ maxLength: 500 })),
	cloneUrl: Type.String({
		minLength: 1,
		maxLength: 2048
	}),
	webUrl: Type.String({
		minLength: 1,
		maxLength: 2048
	}),
	defaultBranch: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 255
	})),
	private: Type.Boolean()
});
const ProjectsSearchRemoteParamsSchema = closedObject({ query: Type.String({
	minLength: 1,
	maxLength: 200
}) });
const ProjectsSearchRemoteResultSchema = closedObject({
	credential: Type.Union([Type.Literal("configured"), Type.Literal("missing")]),
	projects: Type.Array(RemoteProjectSchema, { maxItems: 10 })
});
const ProjectsRemoveParamsSchema = closedObject({
	id: StoredProjectIdSchema,
	deleteCheckout: Type.Optional(Type.Boolean())
});
const ProjectsRemoveResultSchema = closedObject({ removed: Type.Boolean() });
//#endregion
//#region packages/gateway-protocol/src/schema/migrations.ts
const MAX_MEMORY_MIGRATION_ITEMS = 2e3;
const MemoryMigrationPlanFingerprintSchema = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-f0-9]{64}$"
});
const MemoryMigrationItemStatusSchema = Type.Union([
	Type.Literal("planned"),
	Type.Literal("migrated"),
	Type.Literal("skipped"),
	Type.Literal("warning"),
	Type.Literal("conflict"),
	Type.Literal("error")
]);
const MemoryMigrationItemSchema = closedObject({
	id: NonEmptyString,
	status: MemoryMigrationItemStatusSchema,
	source: Type.Optional(NonEmptyString),
	target: Type.Optional(NonEmptyString),
	message: Type.Optional(Type.String()),
	reason: Type.Optional(Type.String()),
	details: Type.Optional(Type.Record(Type.String(), Type.Unknown()))
});
const MemoryMigrationSummarySchema = closedObject({
	total: Type.Integer({ minimum: 0 }),
	planned: Type.Integer({ minimum: 0 }),
	migrated: Type.Integer({ minimum: 0 }),
	skipped: Type.Integer({ minimum: 0 }),
	conflicts: Type.Integer({ minimum: 0 }),
	errors: Type.Integer({ minimum: 0 }),
	sensitive: Type.Integer({ minimum: 0 })
});
const MemoryMigrationProviderPlanSchema = closedObject({
	providerId: NonEmptyString,
	label: NonEmptyString,
	description: Type.Optional(Type.String()),
	planFingerprint: Type.Optional(MemoryMigrationPlanFingerprintSchema),
	found: Type.Boolean(),
	source: Type.Optional(NonEmptyString),
	target: Type.Optional(NonEmptyString),
	confidence: Type.Optional(Type.Union([
		Type.Literal("low"),
		Type.Literal("medium"),
		Type.Literal("high")
	])),
	message: Type.Optional(Type.String()),
	error: Type.Optional(Type.String()),
	summary: MemoryMigrationSummarySchema,
	items: Type.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
	warnings: Type.Optional(Type.Array(Type.String()))
});
const MigrationsMemoryPlanParamsSchema = closedObject({
	agentId: NonEmptyString,
	overwrite: Type.Optional(Type.Boolean())
});
const MigrationsMemoryPlanResultSchema = closedObject({
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	providers: Type.Array(MemoryMigrationProviderPlanSchema)
});
const MigrationsMemoryApplyParamsSchema = closedObject({
	idempotencyKey: NonEmptyString,
	agentId: NonEmptyString,
	providerId: NonEmptyString,
	planFingerprint: MemoryMigrationPlanFingerprintSchema,
	itemIds: Type.Array(NonEmptyString, {
		minItems: 1,
		uniqueItems: true,
		maxItems: MAX_MEMORY_MIGRATION_ITEMS
	}),
	overwrite: Type.Optional(Type.Boolean())
});
const MigrationProtocolSchemas = {
	MemoryMigrationItemStatus: MemoryMigrationItemStatusSchema,
	MemoryMigrationItem: MemoryMigrationItemSchema,
	MemoryMigrationSummary: MemoryMigrationSummarySchema,
	MemoryMigrationProviderPlan: MemoryMigrationProviderPlanSchema,
	MigrationsMemoryPlanParams: MigrationsMemoryPlanParamsSchema,
	MigrationsMemoryPlanResult: MigrationsMemoryPlanResultSchema,
	MigrationsMemoryApplyParams: MigrationsMemoryApplyParamsSchema,
	MigrationsMemoryApplyResult: closedObject({
		providerId: NonEmptyString,
		source: NonEmptyString,
		target: Type.Optional(NonEmptyString),
		summary: MemoryMigrationSummarySchema,
		items: Type.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
		warnings: Type.Optional(Type.Array(Type.String())),
		backupPath: Type.Optional(NonEmptyString),
		reportDir: Type.Optional(NonEmptyString)
	})
};
//#endregion
//#region packages/gateway-protocol/src/migration-api.ts
const validateMigrationsMemoryPlanParams = /* @__PURE__ */ lazyCompile(MigrationsMemoryPlanParamsSchema);
const validateMigrationsMemoryApplyParams = /* @__PURE__ */ lazyCompile(MigrationsMemoryApplyParamsSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/storage.ts
const StorageLocationNameSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9-]{0,62}$" });
const StorageLocationsListParamsSchema = closedObject({});
const StorageLocationsListResultSchema = closedObject({ locations: Type.Array(closedObject({
	name: StorageLocationNameSchema,
	provider: NonEmptyString,
	displayTarget: Type.Optional(NonEmptyString),
	encrypted: Type.Boolean()
})) });
const StorageLocationsProbeParamsSchema = closedObject({ name: StorageLocationNameSchema });
const StorageLocationsProbeResultSchema = closedObject({
	state: Type.Union([
		Type.Literal("ok"),
		Type.Literal("unavailable"),
		Type.Literal("uninitialized"),
		Type.Literal("wrong-key"),
		Type.Literal("error")
	]),
	freeBytes: Type.Optional(Type.Number({ minimum: 0 })),
	totalBytes: Type.Optional(Type.Number({ minimum: 0 })),
	message: Type.Optional(Type.String())
});
//#endregion
//#region packages/gateway-protocol/src/schema/backup.ts
const BackupKindSchema = Type.Union([
	Type.Literal("archive"),
	Type.Literal("sqlite-snapshot"),
	Type.Literal("git"),
	Type.Literal("external")
]);
const BytesSchema = Type.Integer({ minimum: 0 });
const BackupRunLocationSchema = closedObject({
	name: Type.String(),
	provider: Type.String(),
	locationId: Type.String(),
	key: Type.String(),
	namespace: Type.String(),
	plaintextBytes: BytesSchema,
	storedBytes: BytesSchema
});
const BackupRunRetentionSchema = closedObject({
	kept: BytesSchema,
	deleted: BytesSchema
});
const BackupRunRecordSchema = closedObject({
	id: Type.String(),
	createdAt: Type.Number(),
	archivePath: Type.String(),
	status: Type.Union([Type.Literal("ok"), Type.Literal("failed")]),
	kind: BackupKindSchema,
	target: Type.Optional(Type.String()),
	namespace: Type.Optional(Type.String()),
	error: Type.Optional(Type.String()),
	pushFailed: Type.Optional(Type.Literal(true)),
	bytes: Type.Optional(BytesSchema),
	location: Type.Optional(BackupRunLocationSchema),
	retention: Type.Optional(BackupRunRetentionSchema)
});
const BackupStatusParamsSchema = closedObject({});
const BackupStatusResultSchema = closedObject({
	targets: Type.Array(closedObject({
		kind: BackupKindSchema,
		target: Type.String(),
		namespace: Type.Optional(Type.String()),
		latest: BackupRunRecordSchema,
		latestOk: Type.Optional(BackupRunRecordSchema)
	})),
	schedules: Type.Array(closedObject({
		id: Type.String(),
		mode: Type.Union([Type.Literal("git"), Type.Literal("offsite")]),
		target: Type.String(),
		namespace: Type.Optional(Type.String()),
		enabled: Type.Boolean(),
		everyMs: Type.Number(),
		nextRunAtMs: Type.Optional(Type.Number())
	})),
	locations: StorageLocationsListResultSchema.properties.locations
});
//#endregion
//#region packages/gateway-protocol/src/schema/agent.ts
/**
* Agent and channel-action gateway schemas.
*
* These payloads sit on the boundary between external channel adapters, gateway
* RPC callers, and the agent runtime. Keep public request fields documented
* because older CLI/channel clients may continue sending them across releases.
*/
const AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION = "task_completion";
const AGENT_INTERNAL_EVENT_SOURCES = [
	"subagent",
	"cron",
	"image_generation",
	"video_generation",
	"music_generation"
];
const AGENT_INTERNAL_EVENT_STATUSES = [
	"ok",
	"timeout",
	"error",
	"unknown"
];
const CONVERSATION_REF_PATTERN = "^conv_[a-f0-9]{32}$";
/** Generated media/file attachment metadata carried by internal agent events. */
const AgentGeneratedAttachmentSchema = closedObject({
	type: Type.Optional(Type.String({ enum: [
		"image",
		"audio",
		"video",
		"file"
	] })),
	path: Type.Optional(Type.String()),
	url: Type.Optional(Type.String()),
	mediaUrl: Type.Optional(Type.String()),
	filePath: Type.Optional(Type.String()),
	mimeType: Type.Optional(Type.String()),
	name: Type.Optional(Type.String()),
	sizeBytes: Type.Optional(Type.Number()),
	durationMs: Type.Optional(Type.Number()),
	width: Type.Optional(Type.Number()),
	height: Type.Optional(Type.Number())
});
/** Internal completion event surfaced when child automation reports back to a parent run. */
const AgentInternalEventSchema = closedObject({
	type: Type.Literal(AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION),
	source: Type.String({ enum: [...AGENT_INTERNAL_EVENT_SOURCES] }),
	childSessionKey: Type.String(),
	childSessionId: Type.Optional(Type.String()),
	announceType: Type.String(),
	taskLabel: Type.String(),
	status: Type.String({ enum: [...AGENT_INTERNAL_EVENT_STATUSES] }),
	statusLabel: Type.String(),
	result: Type.String(),
	noVisibleResult: Type.Optional(Type.Boolean()),
	modelRouteChange: Type.Optional(Type.String()),
	attachments: Type.Optional(Type.Array(AgentGeneratedAttachmentSchema)),
	mediaUrls: Type.Optional(Type.Array(Type.String())),
	statsLine: Type.Optional(Type.String()),
	replyInstruction: Type.String()
});
/** Stream event emitted by the agent runtime over the gateway protocol. */
const AgentEventSchema = closedObject({
	runId: NonEmptyString,
	seq: Type.Integer({ minimum: 0 }),
	stream: NonEmptyString,
	ts: Type.Integer({ minimum: 0 }),
	spawnedBy: Type.Optional(NonEmptyString),
	isHeartbeat: Type.Optional(Type.Boolean()),
	data: Type.Record(Type.String(), Type.Unknown())
});
const MessageActionReplyModeSchema = Type.Union([
	Type.Literal("off"),
	Type.Literal("first"),
	Type.Literal("all"),
	Type.Literal("batched")
]);
/** Caller-supplied routing hints. Authorization must use trusted runtime context. */
const MessageActionToolContextSchema = closedObject({
	currentChannelId: Type.Optional(Type.String()),
	currentMessagingTarget: Type.Optional(Type.String()),
	currentGraphChannelId: Type.Optional(Type.String()),
	currentChannelProvider: Type.Optional(Type.String()),
	currentThreadTs: Type.Optional(Type.String()),
	currentMessageId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
	replyToMode: Type.Optional(MessageActionReplyModeSchema),
	hasRepliedRef: Type.Optional(closedObject({ value: Type.Boolean() })),
	sameChannelThreadRequired: Type.Optional(Type.Boolean()),
	skipCrossContextDecoration: Type.Optional(Type.Boolean())
});
const MessageActionReplyFactsSchema = Type.Union([closedObject({
	replyToId: NonEmptyString,
	source: Type.Literal("explicit")
}), closedObject({
	replyToId: NonEmptyString,
	source: Type.Literal("implicit"),
	mode: Type.Union([Type.Literal("first"), Type.Literal("all")])
})]);
/** Request to execute a channel message action through a configured adapter. */
const MessageActionParamsSchema = closedObject({
	channel: NonEmptyString,
	action: NonEmptyString,
	params: Type.Record(Type.String(), Type.Unknown()),
	reply: Type.Optional(MessageActionReplyFactsSchema),
	accountId: Type.Optional(Type.String()),
	requesterAccountId: Type.Optional(Type.String()),
	requesterSenderId: Type.Optional(Type.String()),
	senderIsOwner: Type.Optional(Type.Boolean()),
	sessionKey: Type.Optional(Type.String()),
	sessionId: Type.Optional(Type.String()),
	inboundTurnKind: Type.Optional(Type.String({ enum: ["user_request", "room_event"] })),
	agentId: Type.Optional(Type.String()),
	toolContext: Type.Optional(MessageActionToolContextSchema),
	/**
	* Explicit operation-local marker for an authenticated direct operator.
	* Missing values remain delegated, and agent runtime identity wins server-side.
	*/
	conversationReadOrigin: Type.Optional(Type.Literal("direct-operator")),
	idempotencyKey: NonEmptyString
});
/** Outbound send request shared by channel adapters. */
const SendParamsSchema = closedObject({
	to: NonEmptyString,
	message: Type.Optional(Type.String()),
	mediaUrl: Type.Optional(Type.String()),
	mediaUrls: Type.Optional(Type.Array(Type.String())),
	/** Base64 attachment payload for gateway-local media materialization. */
	buffer: Type.Optional(Type.String()),
	/** Optional filename for a base64 attachment payload. */
	filename: Type.Optional(Type.String()),
	/** Optional MIME type for a base64 attachment payload. */
	contentType: Type.Optional(Type.String()),
	asVoice: Type.Optional(Type.Boolean()),
	gifPlayback: Type.Optional(Type.Boolean()),
	channel: Type.Optional(Type.String()),
	accountId: Type.Optional(Type.String()),
	/** Optional agent id for per-agent media root resolution on gateway sends. */
	agentId: Type.Optional(Type.String()),
	/** Reply target message id for native quoted/threaded sends where supported. */
	replyToId: Type.Optional(Type.String()),
	/** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
	threadId: Type.Optional(Type.String()),
	/** Force document-style media sends where supported. */
	forceDocument: Type.Optional(Type.Boolean()),
	/** Send silently (no notification) where supported. */
	silent: Type.Optional(Type.Boolean()),
	/** Channel-specific parse mode for formatted text. */
	parseMode: Type.Optional(Type.Literal("HTML")),
	/** Optional session key for mirroring delivered output back into the transcript. */
	sessionKey: Type.Optional(Type.String()),
	idempotencyKey: NonEmptyString
});
/** Gateway-owned request that lists persisted and channel-directory addresses. */
const ConversationListParamsSchema = closedObject({
	agentId: NonEmptyString,
	channel: Type.Optional(NonEmptyString),
	query: Type.Optional(NonEmptyString),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	}))
});
const ConversationListItemSchema = closedObject({
	conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
	channel: NonEmptyString,
	accountId: NonEmptyString,
	kind: Type.Union([
		Type.Literal("direct"),
		Type.Literal("group"),
		Type.Literal("channel")
	]),
	target: NonEmptyString,
	threadId: Type.Optional(NonEmptyString),
	label: Type.Optional(NonEmptyString),
	firstSeenAt: Type.Integer({ minimum: 0 }),
	lastSeenAt: Type.Integer({ minimum: 0 })
});
const ConversationListResultSchema = closedObject({ conversations: Type.Array(ConversationListItemSchema) });
/** Gateway-owned request that sends to one durable external conversation. */
const ConversationSendParamsSchema = closedObject({
	agentId: NonEmptyString,
	sourceSessionKey: Type.Optional(NonEmptyString),
	operationId: NonEmptyString,
	conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
	message: NonEmptyString
});
const ConversationSendResultSchema = closedObject({
	status: Type.Union([
		Type.Literal("sent"),
		Type.Literal("queued"),
		Type.Literal("suppressed"),
		Type.Literal("unknown")
	]),
	conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
	channel: NonEmptyString,
	messageId: Type.Optional(NonEmptyString),
	queueId: Type.Optional(NonEmptyString)
});
/** Gateway-owned request that sends and consumes one correlated external reply inline. */
const ConversationTurnParamsSchema = closedObject({
	agentId: NonEmptyString,
	sourceSessionKey: Type.Optional(NonEmptyString),
	turnId: NonEmptyString,
	conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
	message: NonEmptyString,
	timeoutMs: Type.Integer({
		minimum: 1,
		maximum: 3e5
	})
});
const ConversationTurnCancelParamsSchema = closedObject({
	agentId: NonEmptyString,
	turnId: NonEmptyString
});
const ConversationTurnCancelResultSchema = closedObject({ cancelled: Type.Boolean() });
const ConversationTurnReplySchema = closedObject({
	conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
	messageId: NonEmptyString,
	replyToId: Type.Optional(NonEmptyString),
	threadId: Type.Optional(NonEmptyString),
	text: Type.String(),
	timestamp: Type.Integer({ minimum: 0 }),
	transcriptArtifactId: Type.Optional(NonEmptyString),
	transcriptMessageId: Type.Optional(NonEmptyString)
});
const ConversationTurnBaseResultSchema = {
	conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
	channel: NonEmptyString,
	messageId: NonEmptyString,
	correlationPersisted: Type.Boolean()
};
const ConversationTurnResultSchema = Type.Union([
	closedObject({
		...ConversationTurnBaseResultSchema,
		status: Type.Literal("replied"),
		reply: ConversationTurnReplySchema
	}),
	closedObject({
		...ConversationTurnBaseResultSchema,
		status: Type.Literal("timeout")
	}),
	closedObject({
		conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
		channel: NonEmptyString,
		messageId: Type.Optional(NonEmptyString),
		correlationPersisted: Type.Boolean(),
		status: ConversationSendResultSchema.properties.status,
		error: NonEmptyString
	})
]);
/** Poll creation request for adapters that support native polls. */
const PollParamsSchema = closedObject({
	to: NonEmptyString,
	question: NonEmptyString,
	options: Type.Array(NonEmptyString, {
		minItems: 2,
		maxItems: 12
	}),
	maxSelections: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 12
	})),
	/** Poll duration in seconds (channel-specific limits may apply). */
	durationSeconds: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 604800
	})),
	durationHours: Type.Optional(Type.Integer({ minimum: 1 })),
	/** Send silently (no notification) where supported. */
	silent: Type.Optional(Type.Boolean()),
	/** Poll anonymity where supported (e.g. Telegram polls default to anonymous). */
	isAnonymous: Type.Optional(Type.Boolean()),
	/** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
	threadId: Type.Optional(Type.String()),
	channel: Type.Optional(Type.String()),
	accountId: Type.Optional(Type.String()),
	idempotencyKey: NonEmptyString
});
/** Main agent-run request accepted by the gateway. */
const AgentParamsSchema = closedObject({
	message: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	provider: Type.Optional(Type.String()),
	model: Type.Optional(Type.String()),
	to: Type.Optional(Type.String()),
	replyTo: Type.Optional(Type.String()),
	sessionId: Type.Optional(Type.String()),
	sessionKey: Type.Optional(Type.String()),
	expectedExistingSessionId: Type.Optional(NonEmptyString),
	expectedExistingSessionLifecycleRevision: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	thinking: Type.Optional(Type.String()),
	deliver: Type.Optional(Type.Boolean()),
	attachments: Type.Optional(Type.Array(Type.Unknown())),
	channel: Type.Optional(Type.String()),
	replyChannel: Type.Optional(Type.String()),
	accountId: Type.Optional(Type.String()),
	replyAccountId: Type.Optional(Type.String()),
	threadId: Type.Optional(Type.String()),
	groupId: Type.Optional(Type.String()),
	groupChannel: Type.Optional(Type.String()),
	groupSpace: Type.Optional(Type.String()),
	timeout: Type.Optional(Type.Integer({ minimum: 0 })),
	bestEffortDeliver: Type.Optional(Type.Boolean()),
	lane: Type.Optional(Type.String()),
	cwd: Type.Optional(NonEmptyString),
	cleanupBundleMcpOnRunEnd: Type.Optional(Type.Boolean()),
	modelRun: Type.Optional(Type.Boolean()),
	promptMode: Type.Optional(Type.Union([
		Type.Literal("full"),
		Type.Literal("minimal"),
		Type.Literal("none")
	])),
	extraSystemPrompt: Type.Optional(Type.String()),
	bootstrapContextMode: Type.Optional(Type.Union([Type.Literal("full"), Type.Literal("lightweight")])),
	bootstrapContextRunKind: Type.Optional(Type.Union([
		Type.Literal("default"),
		Type.Literal("heartbeat"),
		Type.Literal("cron")
	])),
	acpTurnSource: Type.Optional(Type.Literal("manual_spawn")),
	internalRuntimeHandoffId: Type.Optional(NonEmptyString),
	internalExecutionIdentityRetry: Type.Optional(Type.Boolean()),
	/** Exact durable recovery attempt that owns any post-admission identity bind. */
	internalExecutionIdentityRecoveryAttempt: Type.Optional(Type.Integer({ minimum: 1 })),
	execApprovalFollowupExpectedSessionId: Type.Optional(NonEmptyString),
	internalEvents: Type.Optional(Type.Array(AgentInternalEventSchema)),
	inputProvenance: Type.Optional(InputProvenanceSchema),
	suppressPromptPersistence: Type.Optional(Type.Boolean()),
	sessionEffects: Type.Optional(Type.Union([Type.Literal("visible"), Type.Literal("internal")])),
	sourceReplyDeliveryMode: Type.Optional(Type.Union([Type.Literal("automatic"), Type.Literal("message_tool_only")])),
	disableMessageTool: Type.Optional(Type.Boolean()),
	swarmCollector: Type.Optional(Type.Boolean()),
	swarmOutputSchema: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	forceRestartSafeTools: Type.Optional(Type.Boolean()),
	forceCodeModeTools: Type.Optional(Type.Boolean()),
	voiceWakeTrigger: Type.Optional(Type.String()),
	idempotencyKey: NonEmptyString,
	label: Type.Optional(SessionLabelString)
});
/** Identity lookup request for the current or selected agent/session. */
const AgentIdentityParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(Type.String())
});
/** Public display identity returned for an agent. */
const AgentIdentityResultSchema = closedObject({
	agentId: NonEmptyString,
	name: Type.Optional(NonEmptyString),
	nameSource: Type.Optional(Type.String({ enum: [
		"config",
		"agent",
		"workspace",
		"default"
	] })),
	avatar: Type.Optional(NonEmptyString),
	avatarSource: Type.Optional(NonEmptyString),
	avatarStatus: Type.Optional(Type.String({ enum: [
		"none",
		"local",
		"remote",
		"data"
	] })),
	avatarReason: Type.Optional(NonEmptyString),
	emoji: Type.Optional(NonEmptyString)
});
/** Waits for a submitted agent run to complete or time out. */
const AgentWaitParamsSchema = closedObject({
	runId: NonEmptyString,
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Wake request from external schedulers or devices into an agent session. */
const WakeParamsSchema = Type.Object({
	mode: Type.Union([Type.Literal("now"), Type.Literal("next-heartbeat")]),
	text: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	/**
	* Optional agent id paired with `sessionKey`. Routes multi-agent setups
	* to the agent that owns the targeted session — closes the related half
	* of #46886 ("always routes to default agent").
	*/
	agentId: Type.Optional(NonEmptyString)
}, { additionalProperties: true });
//#endregion
//#region packages/gateway-protocol/src/schema/agents-files.ts
/** File metadata and optional content for agent-local editable files. */
const AgentsFileEntrySchema = closedObject({
	name: NonEmptyString,
	path: NonEmptyString,
	missing: Type.Boolean(),
	expectedAbsent: Type.Optional(Type.Boolean()),
	size: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	hash: Type.Optional(Sha256String),
	content: Type.Optional(Type.String())
});
/** Lists editable files for one agent. */
const AgentsFilesListParamsSchema = closedObject({ agentId: NonEmptyString });
/** Editable file list for an agent workspace. */
const AgentsFilesListResultSchema = closedObject({
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	files: Type.Array(AgentsFileEntrySchema)
});
/** Reads one editable agent file by name. */
const AgentsFilesGetParamsSchema = closedObject({
	agentId: NonEmptyString,
	name: NonEmptyString
});
/** Result for reading one editable agent file. */
const AgentsFilesGetResultSchema = closedObject({
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	file: AgentsFileEntrySchema
});
/** Writes one editable agent file. */
const AgentsFilesSetParamsSchema = Object.assign(closedObject({
	agentId: NonEmptyString,
	name: NonEmptyString,
	content: Type.String(),
	expectedHash: Type.Optional(Sha256String),
	expectedMissing: Type.Optional(Type.Literal(true))
}), { not: { required: ["expectedHash", "expectedMissing"] } });
/** Result returned after writing an editable agent file. */
const AgentsFilesSetResultSchema = closedObject({
	ok: Type.Literal(true),
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	file: AgentsFileEntrySchema
});
//#endregion
//#region packages/gateway-protocol/src/schema/agents-workspace.ts
/**
* Read-only agent workspace browsing schemas.
*
* These contracts back the workspace file browser in operator clients
* (mobile apps, Control UI). The surface is intentionally read-only:
* write/delete/upload stay out of this namespace until a separately
* reviewed mutation contract exists.
*/
/** One file or folder in an agent workspace directory listing. */
const AgentsWorkspaceEntrySchema = closedObject({
	path: NonEmptyString,
	name: NonEmptyString,
	kind: Type.Union([Type.Literal("file"), Type.Literal("directory")]),
	size: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Lists one directory of an agent workspace. */
const AgentsWorkspaceListParamsSchema = closedObject({
	agentId: NonEmptyString,
	path: Type.Optional(Type.String()),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
	limit: Type.Optional(Type.Integer({ minimum: 1 }))
});
/** Paginated directory listing rooted at the agent workspace. */
const AgentsWorkspaceListResultSchema = closedObject({
	agentId: NonEmptyString,
	path: Type.String(),
	parentPath: Type.Optional(Type.String()),
	entries: Type.Array(AgentsWorkspaceEntrySchema),
	totalEntries: Type.Integer({ minimum: 0 }),
	offset: Type.Integer({ minimum: 0 })
});
/** One workspace file preview payload (UTF-8 text or base64 image). */
const AgentsWorkspaceFileSchema = closedObject({
	path: NonEmptyString,
	name: NonEmptyString,
	size: Type.Integer({ minimum: 0 }),
	updatedAtMs: Type.Integer({ minimum: 0 }),
	mimeType: NonEmptyString,
	encoding: Type.Union([Type.Literal("utf8"), Type.Literal("base64")]),
	content: Type.String()
});
/** Reads one workspace file by workspace-relative path. */
const AgentsWorkspaceGetParamsSchema = closedObject({
	agentId: NonEmptyString,
	path: NonEmptyString
});
/** Result for reading one workspace file. */
const AgentsWorkspaceGetResultSchema = closedObject({
	agentId: NonEmptyString,
	file: AgentsWorkspaceFileSchema
});
//#endregion
//#region packages/gateway-protocol/src/schema/artifacts.ts
/**
* Artifact lookup and download protocol schemas.
*
* Artifacts are files or payloads produced by sessions, runs, or agents;
* these schemas keep lookup filters explicit and download results transport-safe.
*/
const ArtifactQueryParamsProperties = {
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	/** Assistant-delivered artifacts only; omit to include uploaded inputs and tool observations. */
	messageRole: Type.Optional(Type.Literal("assistant"))
};
/** Artifact lookup payload with a required artifact id plus optional scope filters. */
const ArtifactGetParamsSchema = closedObject({
	...ArtifactQueryParamsProperties,
	artifactId: NonEmptyString
});
/** Public artifact metadata returned before or alongside download data. */
const ArtifactSummarySchema = closedObject({
	id: NonEmptyString,
	type: NonEmptyString,
	title: NonEmptyString,
	mimeType: Type.Optional(NonEmptyString),
	sizeBytes: Type.Optional(Type.Integer({ minimum: 0 })),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	messageSeq: Type.Optional(Type.Integer({ minimum: 1 })),
	source: Type.Optional(NonEmptyString),
	image: Type.Optional(closedObject({ url: NonEmptyString })),
	download: closedObject({ mode: Type.Union([
		Type.Literal("bytes"),
		Type.Literal("url"),
		Type.Literal("unsupported")
	]) })
});
/** List request payload for artifacts visible in the selected scope. */
const ArtifactsListParamsSchema = closedObject({
	...ArtifactQueryParamsProperties,
	type: Type.Optional(Type.Literal("image")),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 4
	})),
	cursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	}))
});
closedObject({
	artifacts: Type.Array(ArtifactSummarySchema),
	nextCursor: Type.Optional(NonEmptyString),
	omittedOversized: Type.Optional(Type.Boolean())
});
/** Get request payload for one artifact summary. */
const ArtifactsGetParamsSchema = ArtifactGetParamsSchema;
closedObject({ artifact: ArtifactSummarySchema });
/** Download request payload for one artifact. */
const ArtifactsDownloadParamsSchema = closedObject({
	...ArtifactQueryParamsProperties,
	artifactId: NonEmptyString,
	/** Opt in only when the client can reach the Gateway's HTTP(S) media routes. */
	transport: Type.Optional(Type.Literal("http"))
});
closedObject({
	artifact: ArtifactSummarySchema,
	encoding: Type.Optional(Type.Literal("base64")),
	data: Type.Optional(Type.String()),
	url: Type.Optional(NonEmptyString),
	expiresAt: Type.Optional(NonEmptyString)
});
//#endregion
//#region packages/gateway-protocol/src/schema/audit.ts
const AuditEventKindSchema = Type.Union([Type.Literal("agent_run"), Type.Literal("tool_action")]);
const AuditEventActionSchema = Type.Union([
	Type.Literal("agent.run.started"),
	Type.Literal("agent.run.finished"),
	Type.Literal("tool.action.started"),
	Type.Literal("tool.action.finished")
]);
const AuditEventStatusSchema = Type.Union([
	Type.Literal("started"),
	Type.Literal("succeeded"),
	Type.Literal("failed"),
	Type.Literal("cancelled"),
	Type.Literal("timed_out"),
	Type.Literal("blocked"),
	Type.Literal("unknown")
]);
const AuditEventErrorCodeSchema = Type.Union([
	Type.Literal("run_failed"),
	Type.Literal("run_cancelled"),
	Type.Literal("run_timed_out"),
	Type.Literal("run_blocked"),
	Type.Literal("tool_failed"),
	Type.Literal("tool_cancelled"),
	Type.Literal("tool_timed_out"),
	Type.Literal("tool_blocked"),
	Type.Literal("tool_outcome_unknown")
]);
/** One content-free run/tool audit record. */
const AuditEventSchema = closedObject({
	eventId: NonEmptyString,
	sequence: Type.Integer({ minimum: 1 }),
	sourceSequence: Type.Integer({ minimum: 1 }),
	occurredAt: Type.Integer({ minimum: 0 }),
	kind: AuditEventKindSchema,
	action: AuditEventActionSchema,
	status: AuditEventStatusSchema,
	errorCode: Type.Optional(AuditEventErrorCodeSchema),
	actor: closedObject({
		type: Type.Union([Type.Literal("agent"), Type.Literal("system")]),
		id: NonEmptyString
	}),
	agentId: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	runId: NonEmptyString,
	toolCallId: Type.Optional(NonEmptyString),
	toolName: Type.Optional(NonEmptyString),
	redaction: Type.Literal("metadata_only")
});
/** Bounded newest-first audit query filters. */
const AuditListParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	kind: Type.Optional(AuditEventKindSchema),
	status: Type.Optional(AuditEventStatusSchema),
	after: Type.Optional(Type.Integer({ minimum: 0 })),
	before: Type.Optional(Type.Integer({ minimum: 0 })),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 500
	})),
	cursor: Type.Optional(NonEmptyString)
});
/** Stable sequence-cursor page suitable for bounded JSON export. */
const AuditListResultSchema = closedObject({
	events: Type.Array(AuditEventSchema),
	nextCursor: Type.Optional(NonEmptyString)
});
//#endregion
//#region packages/gateway-protocol/src/schema/channel-pairing.ts
const CliPairingAccountIdSchema = Type.String({
	minLength: 1,
	pattern: "\\S"
});
const ChannelPairingAccountSchema = closedObject({
	channel: NonEmptyString,
	channelLabel: NonEmptyString,
	accountId: NonEmptyString,
	accountLabel: Type.Optional(NonEmptyString),
	notifySupported: Type.Boolean()
});
const ChannelPairingRequestSchema = closedObject({
	requestId: NonEmptyString,
	channel: NonEmptyString,
	channelLabel: NonEmptyString,
	accountId: NonEmptyString,
	accountLabel: Type.Optional(NonEmptyString),
	senderId: NonEmptyString,
	senderLabel: NonEmptyString,
	metadata: Type.Optional(Type.Record(NonEmptyString, Type.String())),
	createdAt: NonEmptyString,
	lastSeenAt: NonEmptyString,
	expiresAt: NonEmptyString,
	notifySupported: Type.Boolean()
});
/** Lists pending DM sender access requests for pairing-policy channel accounts. */
const ChannelsPairingListParamsSchema = Type.Union([closedObject({
	channel: Type.Optional(NonEmptyString),
	accountId: Type.Optional(NonEmptyString)
}), closedObject({
	format: Type.Literal("cli"),
	channel: NonEmptyString,
	accountId: Type.Optional(CliPairingAccountIdSchema),
	expectedOwnerId: NonEmptyString
})]);
const ChannelPairingCliRequestSchema = closedObject({
	id: NonEmptyString,
	code: NonEmptyString,
	createdAt: NonEmptyString,
	lastSeenAt: NonEmptyString,
	meta: Type.Optional(Type.Record(Type.String(), Type.String()))
});
/** Capability-qualified CLI results retain codes; ordinary UI results never expose them. */
const ChannelsPairingCliListResultSchema = Type.Array(ChannelPairingCliRequestSchema);
const ChannelsPairingCodeApproveResultSchema = Type.Union([closedObject({
	id: NonEmptyString,
	entry: ChannelPairingCliRequestSchema
}), Type.Null()]);
const ChannelsPairingListResultSchema = closedObject({
	accounts: Type.Array(ChannelPairingAccountSchema),
	requests: Type.Array(ChannelPairingRequestSchema),
	commandOwnerConfigured: Type.Boolean(),
	limits: closedObject({
		pendingPerAccount: Type.Integer({ minimum: 0 }),
		ttlMs: Type.Integer({ minimum: 0 })
	})
});
/** Approves one pending DM sender request. */
const ChannelsPairingApproveParamsSchema = Type.Union([closedObject({
	channel: NonEmptyString,
	accountId: NonEmptyString,
	requestId: NonEmptyString,
	notify: Type.Optional(Type.Boolean()),
	bootstrapCommandOwner: Type.Optional(Type.Boolean())
}), closedObject({
	channel: NonEmptyString,
	accountId: Type.Optional(CliPairingAccountIdSchema),
	code: NonEmptyString,
	expectedOwnerId: NonEmptyString
})]);
const ChannelsPairingApproveResultSchema = closedObject({
	requestId: NonEmptyString,
	senderId: NonEmptyString,
	notification: Type.String({ enum: [
		"not-requested",
		"sent",
		"unsupported",
		"failed"
	] }),
	commandOwnerBootstrap: Type.String({ enum: [
		"not-requested",
		"configured",
		"already-configured",
		"unavailable"
	] })
});
/** Dismisses one pending request without permanently blocking the sender. */
const ChannelsPairingDismissParamsSchema = closedObject({
	channel: NonEmptyString,
	accountId: NonEmptyString,
	requestId: NonEmptyString
});
const ChannelsPairingDismissResultSchema = closedObject({
	requestId: NonEmptyString,
	senderId: NonEmptyString
});
//#endregion
//#region packages/gateway-protocol/src/schema/talk-marks.ts
/** Acknowledges playback through a named realtime provider mark. */
const TalkSessionAcknowledgeMarkParamsSchema = closedObject({
	sessionId: NonEmptyString,
	markName: NonEmptyString
});
/** Maximum command description length accepted in catalog entries. */
const COMMAND_DESCRIPTION_MAX_LENGTH = 2e3;
const BoundedNonEmptyString = (maxLength) => Type.String({
	minLength: 1,
	maxLength
});
/** Source system that contributed a command. */
const CommandSourceSchema = Type.Union([
	Type.Literal("native"),
	Type.Literal("skill"),
	Type.Literal("plugin")
]);
/** Surfaces where a command may be invoked. */
const CommandScopeSchema = Type.Union([
	Type.Literal("text"),
	Type.Literal("native"),
	Type.Literal("both")
]);
/** Coarse UI grouping for command catalog display. */
const CommandCategorySchema = Type.Union([
	Type.Literal("session"),
	Type.Literal("options"),
	Type.Literal("status"),
	Type.Literal("management"),
	Type.Literal("media"),
	Type.Literal("tools")
]);
/** Static argument choice shown to clients. */
const CommandArgChoiceSchema = closedObject({
	value: Type.String({ maxLength: 200 }),
	label: Type.String({ maxLength: 200 })
});
/** One typed argument advertised for a command. */
const CommandArgSchema = closedObject({
	name: BoundedNonEmptyString(200),
	description: Type.String({ maxLength: 500 }),
	type: Type.Union([
		Type.Literal("string"),
		Type.Literal("number"),
		Type.Literal("boolean")
	]),
	required: Type.Optional(Type.Boolean()),
	choices: Type.Optional(Type.Array(CommandArgChoiceSchema, { maxItems: 50 })),
	dynamic: Type.Optional(Type.Boolean())
});
const CommandClientPresentationActionSchema = Type.Union([closedObject({ kind: Type.Literal("device-pairing") })]);
const CommandClientPresentationSchema = closedObject({
	when: Type.Literal("no-arguments"),
	action: CommandClientPresentationActionSchema
});
/** One command catalog entry visible to clients. */
const CommandEntrySchema = closedObject({
	name: BoundedNonEmptyString(200),
	nativeName: Type.Optional(BoundedNonEmptyString(200)),
	textAliases: Type.Optional(Type.Array(BoundedNonEmptyString(200), { maxItems: 20 })),
	description: Type.String({ maxLength: COMMAND_DESCRIPTION_MAX_LENGTH }),
	category: Type.Optional(CommandCategorySchema),
	source: CommandSourceSchema,
	/** Human-readable skill title used by client display surfaces. */
	skillDisplayName: Type.Optional(BoundedNonEmptyString(200)),
	/** Whether a skill command is also present in the model-visible skill catalog. */
	skillModelVisible: Type.Optional(Type.Boolean()),
	scope: CommandScopeSchema,
	acceptsArgs: Type.Boolean(),
	args: Type.Optional(Type.Array(CommandArgSchema, { maxItems: 20 })),
	clientPresentation: Type.Optional(CommandClientPresentationSchema)
});
/** Command catalog request filters. */
const CommandsListParamsSchema = closedObject({
	sessionKey: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	provider: Type.Optional(NonEmptyString),
	scope: Type.Optional(CommandScopeSchema),
	includeArgs: Type.Optional(Type.Boolean())
});
/** Bounded command catalog response. */
const CommandsListResultSchema = closedObject({ commands: Type.Array(CommandEntrySchema, { maxItems: 500 }) });
//#endregion
//#region packages/gateway-protocol/src/system-agent-context.ts
/** Ephemeral, quoted UI references. These fields never carry configuration values. */
const SYSTEM_AGENT_PLUGIN_REFERENCE_MAX_CHARS = 1024;
const CAPABILITY_GROUPS = [
	"tools",
	"providers",
	"channels",
	"contracts",
	"skills",
	"mcpServers"
];
function addDeclaredCapabilities(reference, value) {
	const raw = asNullableRecord(value);
	if (!raw) return;
	const declared = { incomplete: true };
	reference.declared = declared;
	const fits = () => JSON.stringify(reference).length <= SYSTEM_AGENT_PLUGIN_REFERENCE_MAX_CHARS;
	if (!fits()) {
		delete reference.declared;
		return;
	}
	let incomplete = raw.incomplete === true;
	for (const group of CAPABILITY_GROUPS) {
		const items = raw[group];
		if (items === void 0) continue;
		if (!Array.isArray(items)) {
			incomplete = true;
			continue;
		}
		const accepted = [];
		declared[group] = accepted;
		if (!fits()) {
			delete declared[group];
			incomplete = true;
			continue;
		}
		const valid = items.filter((item) => typeof item === "string" && item.length > 0 && item.length <= 128);
		const names = [...new Set(valid)].toSorted();
		incomplete ||= valid.length !== items.length || names.length > 8;
		for (const item of names.slice(0, 8)) {
			accepted.push(item);
			if (!fits()) {
				accepted.pop();
				incomplete = true;
			}
		}
	}
	if (!incomplete) delete declared.incomplete;
}
function normalizeSystemAgentPluginReference(value) {
	const raw = asNullableRecord(value);
	if (!raw) return;
	if (typeof raw.id !== "string" || !/^[A-Za-z0-9@][A-Za-z0-9@._/-]{0,127}$/u.test(raw.id)) return;
	if (typeof raw.name !== "string" || !raw.name.trim() || raw.name.length > 96) return;
	const reference = {
		id: raw.id,
		name: raw.name.trim()
	};
	if (typeof raw.installed === "boolean") reference.installed = raw.installed;
	const setting = asNullableRecord(raw.setting);
	if (setting) {
		if (Array.isArray(setting.path) && setting.path.length > 0 && setting.path.length <= 16 && setting.path.every((part) => typeof part === "string" && part.length > 0 && part.length <= 64) && typeof setting.label === "string" && setting.label.trim() && setting.label.length <= 96) reference.setting = {
			path: [...setting.path],
			label: setting.label.trim()
		};
	}
	if (JSON.stringify(reference).length > 1024) delete reference.setting;
	addDeclaredCapabilities(reference, raw.declared);
	return JSON.stringify(reference).length <= 1024 ? reference : void 0;
}
//#endregion
//#region packages/gateway-protocol/src/schema/openclaw.ts
const SystemAgentWizardCancelSchema = closedObject({ 
/** The visible step this action belongs to; stale controls must not affect a newer step. */
stepId: NonEmptyString });
const PluginCapabilityNamesSchema = Type.Optional(Type.Array(Type.String({
	minLength: 1,
	maxLength: 128
}), { maxItems: 8 }));
/**
* OpenClaw chat lets clients (macOS app onboarding, future UIs) hold the
* setup/repair conversation over the gateway. The gateway live-tests the
* configured inference route before creating a session. Omitting `message`
* returns the welcome/greeting for a verified fresh session without input.
*/
const SystemAgentChatParamsSchema = closedObject({
	sessionId: NonEmptyString,
	/** Free-text input for conversational and text-only clients. */
	message: Type.Optional(Type.String()),
	/** Typed answer from a client rendering the current `WizardStep`. */
	wizardAnswer: Type.Optional(WizardAnswerSchema),
	/** Direct client control for cancelling the currently rendered hosted wizard. */
	wizardCancel: Type.Optional(SystemAgentWizardCancelSchema),
	/** Seeds a purpose-specific first greeting for a fresh conversation. */
	welcomeVariant: Type.Optional(Type.Union([Type.Literal("onboarding"), Type.Literal("new-agent")])),
	/** Drop any in-flight approval/wizard state and start the session over. */
	reset: Type.Optional(Type.Boolean()),
	/** Ephemeral Control UI location hint for interpreting the current user turn. */
	context: Type.Optional(closedObject({
		page: Type.String({
			minLength: 1,
			maxLength: 64,
			pattern: "^[A-Za-z0-9/_-]{1,64}$"
		}),
		plugin: Type.Optional(closedObject({
			id: Type.String({
				minLength: 1,
				maxLength: 128,
				pattern: "^[A-Za-z0-9@][A-Za-z0-9@._/-]{0,127}$"
			}),
			name: Type.String({
				minLength: 1,
				maxLength: 96
			}),
			installed: Type.Optional(Type.Boolean()),
			declared: Type.Optional(closedObject({
				tools: PluginCapabilityNamesSchema,
				providers: PluginCapabilityNamesSchema,
				channels: PluginCapabilityNamesSchema,
				contracts: PluginCapabilityNamesSchema,
				skills: PluginCapabilityNamesSchema,
				mcpServers: PluginCapabilityNamesSchema,
				incomplete: Type.Optional(Type.Boolean())
			})),
			setting: Type.Optional(closedObject({
				path: Type.Array(Type.String({
					minLength: 1,
					maxLength: 64
				}), {
					minItems: 1,
					maxItems: 16
				}),
				label: Type.String({
					minLength: 1,
					maxLength: 96
				})
			}))
		}))
	})),
	/** Host-only regular-agent delegation context. Never model-authored. */
	delegation: Type.Optional(closedObject({
		agentId: Type.Optional(NonEmptyString),
		sessionKey: Type.Optional(NonEmptyString),
		turnSourceChannel: Type.Optional(NonEmptyString),
		turnSourceTo: Type.Optional(NonEmptyString),
		turnSourceAccountId: Type.Optional(NonEmptyString),
		turnSourceThreadId: Type.Optional(Type.Union([Type.String(), Type.Number()]))
	}))
});
/**
* Structured choice attached to a chat reply. Card-capable clients render the
* options and send back `reply` (default: `label`) as the next message; text
* clients ignore this and use the reply prose, which always stands alone.
*/
const SystemAgentChatQuestionSchema = closedObject({
	id: NonEmptyString,
	header: NonEmptyString,
	question: NonEmptyString,
	options: Type.Array(closedObject({
		label: NonEmptyString,
		description: Type.Optional(Type.String()),
		recommended: Type.Optional(Type.Boolean()),
		/** Message text a client sends when this option is chosen; defaults to label. */
		reply: Type.Optional(NonEmptyString)
	}), {
		minItems: 2,
		maxItems: 4
	}),
	/** Free-text answers are also accepted for this question. */
	isOther: Type.Optional(Type.Boolean()),
	/** Client-owned action for the visible skip control; omitted means send a reply. */
	skipAction: Type.Optional(Type.Literal("exit"))
});
/** One OpenClaw reply; `action` tells clients about conversation handoffs. */
const SystemAgentChatResultSchema = closedObject({
	sessionId: NonEmptyString,
	reply: NonEmptyString,
	/** Passive caretaker welcome that a purpose-specific view may replace. Notices stay visible. */
	optionalWelcome: Type.Optional(Type.Boolean()),
	/** The next reply is a hosted-wizard secret and clients must mask its input/echo. */
	sensitive: Type.Optional(Type.Boolean()),
	/** The hosted wizard will consume the next message as its current step answer. */
	wizardInputPending: Type.Optional(Type.Boolean()),
	action: Type.Union([
		Type.Literal("none"),
		Type.Literal("open-agent"),
		Type.Literal("exit")
	]),
	/** Optional navigation only; the destination obtains its own human authorization. */
	handoff: Type.Optional(closedObject({ kind: Type.Literal("model-accounts") })),
	/** Optional localized-draft intent for an `open-agent` handoff. */
	agentDraft: Type.Optional(Type.Literal("hatch")),
	/** Destination agent for a specific `open-agent` handoff. */
	agentId: Type.Optional(NonEmptyString),
	needsApproval: Type.Optional(Type.Boolean()),
	proposalId: Type.Optional(NonEmptyString),
	question: Type.Optional(SystemAgentChatQuestionSchema),
	/**
	* The awaited wizard step in full. `question` above is a lossy card projection
	* of the same step, so control-capable clients render this instead.
	*/
	step: Type.Optional(WizardStepSchema)
});
const SystemAgentChatHistoryParamsSchema = closedObject({ limit: Type.Optional(Type.Integer({
	minimum: 1,
	maximum: 500,
	default: 100
})) });
const SystemAgentChatHistoryTurnSchema = closedObject({
	role: Type.Union([Type.Literal("user"), Type.Literal("assistant")]),
	text: Type.String(),
	at: Type.Number()
});
const SystemAgentChatHistoryResultSchema = closedObject({ turns: Type.Array(SystemAgentChatHistoryTurnSchema) });
const SystemChangeKindSchema = Type.Union([
	Type.Literal("operation"),
	Type.Literal("config-write"),
	Type.Literal("external-edit")
]);
const SystemChangeSourceSchema = Type.Union([
	Type.Literal("system-agent"),
	Type.Literal("doctor"),
	Type.Literal("config-rpc"),
	Type.Literal("cli"),
	Type.Literal("plugin-install"),
	Type.Literal("external"),
	Type.Literal("unknown")
]);
const SystemChangeEntrySchema = closedObject({
	id: NonEmptyString,
	at: Type.Number(),
	kind: SystemChangeKindSchema,
	source: SystemChangeSourceSchema,
	summary: Type.String(),
	changedPaths: Type.Optional(Type.Array(Type.String())),
	invalid: Type.Optional(Type.Boolean()),
	opaqueChange: Type.Optional(Type.Boolean())
});
const SystemChangesListParamsSchema = closedObject({
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 200,
		default: 50
	})),
	beforeCursor: Type.Optional(NonEmptyString)
});
const SystemChangesListResultSchema = closedObject({
	entries: Type.Array(SystemChangeEntrySchema),
	nextCursor: Type.Optional(NonEmptyString)
});
/**
* Structured first-run inference setup for GUI clients: detect reusable AI
* access (CLI logins, env keys, existing config), then activate one choice.
* Activation live-tests the candidate and persists it only on success, so a
* client can walk the ladder candidate-by-candidate without ever leaving a
* broken default model behind.
*/
const SystemAgentSetupDetectParamsSchema = closedObject({ 
/** Agent whose model, credentials, and workspace are being inspected. */
agentId: Type.Optional(NonEmptyString) });
const ProviderAutoSetupInferenceKind = Type.TemplateLiteral("provider-auto:${string}", { pattern: "^provider-auto:.+$" });
const SavedAuthSetupInferenceKind = Type.TemplateLiteral("saved-auth:${string}", { pattern: "^saved-auth:.+$" });
const SetupInferenceHttpsUrl = Type.String({
	minLength: 1,
	maxLength: 2048,
	pattern: "^https://"
});
const SetupInferenceKind = Type.Union([
	Type.Literal("existing-model"),
	Type.Literal("openai-api-key"),
	Type.Literal("anthropic-api-key"),
	Type.Literal("claude-cli"),
	Type.Literal("codex-cli"),
	Type.Literal("gemini-cli"),
	ProviderAutoSetupInferenceKind,
	SavedAuthSetupInferenceKind
]);
const SetupInferenceStatus = Type.Union([Type.Literal("ok"), ...SetupInferenceFailureStatusSchema.anyOf]);
const SystemAgentSetupDetectResultSchema = closedObject({
	candidates: Type.Array(closedObject({
		kind: SetupInferenceKind,
		/** Canonical provider identity for clients with bundled brand artwork. */
		brandId: Type.Optional(NonEmptyString),
		label: NonEmptyString,
		detail: Type.String(),
		modelRef: NonEmptyString,
		modelTarget: Type.Optional(Type.Literal("utility")),
		recommended: Type.Boolean(),
		/** true: verified; false: definitively logged out; absent: unknown. */
		credentials: Type.Optional(Type.Boolean()),
		icon: Type.Optional(SetupInferenceHttpsUrl),
		website: Type.Optional(SetupInferenceHttpsUrl)
	})),
	unavailableCandidates: Type.Optional(Type.Array(closedObject({
		id: NonEmptyString,
		/** Canonical provider identity for clients with bundled brand artwork. */
		brandId: Type.Optional(NonEmptyString),
		label: NonEmptyString,
		detail: Type.String(),
		reason: NonEmptyString,
		authOptionId: Type.Optional(NonEmptyString),
		manualProviderId: Type.Optional(NonEmptyString),
		icon: Type.Optional(SetupInferenceHttpsUrl),
		website: Type.Optional(SetupInferenceHttpsUrl)
	}))),
	/** Text-inference key/token methods exposed by the Gateway provider registry. */
	manualProviders: Type.Array(closedObject({
		/** Opaque provider-auth choice sent back during activation. */
		id: NonEmptyString,
		modelTarget: Type.Optional(Type.Literal("utility")),
		/** Canonical provider identity for clients with bundled brand artwork. */
		brandId: Type.Optional(NonEmptyString),
		/** Provider family shown above the specific credential method. */
		groupLabel: Type.Optional(NonEmptyString),
		label: NonEmptyString,
		hint: Type.Optional(Type.String()),
		icon: Type.Optional(SetupInferenceHttpsUrl),
		website: Type.Optional(SetupInferenceHttpsUrl)
	})),
	/** Provider-owned auth, managed-install, and custom-endpoint setup methods. */
	authOptions: Type.Optional(Type.Array(closedObject({
		id: NonEmptyString,
		modelTarget: Type.Optional(Type.Literal("utility")),
		/** Canonical provider identity for clients with bundled brand artwork. */
		brandId: Type.Optional(NonEmptyString),
		label: NonEmptyString,
		hint: Type.Optional(Type.String()),
		groupLabel: Type.Optional(Type.String()),
		icon: Type.Optional(SetupInferenceHttpsUrl),
		website: Type.Optional(SetupInferenceHttpsUrl),
		kind: Type.Union([
			Type.Literal("oauth"),
			Type.Literal("device-code"),
			Type.Literal("install"),
			Type.Literal("custom")
		]),
		featured: Type.Boolean()
	}))),
	/** Provider-owned app-guided local model setup methods. */
	prepareOptions: Type.Optional(Type.Array(closedObject({
		id: NonEmptyString,
		modelTarget: Type.Optional(Type.Literal("utility")),
		/** Canonical provider identity for clients with bundled brand artwork. */
		brandId: Type.Optional(NonEmptyString),
		label: NonEmptyString,
		hint: Type.Optional(Type.String()),
		actionLabel: Type.Optional(NonEmptyString),
		icon: Type.Optional(SetupInferenceHttpsUrl),
		website: Type.Optional(SetupInferenceHttpsUrl)
	}))),
	recommendedInstalls: Type.Optional(Type.Array(closedObject({
		id: NonEmptyString,
		/** Canonical provider or tool identity for bundled client artwork. */
		brandId: Type.Optional(NonEmptyString),
		label: NonEmptyString,
		hint: NonEmptyString,
		website: SetupInferenceHttpsUrl,
		icon: SetupInferenceHttpsUrl
	}))),
	/** Native provider conversation catalogs available on this Gateway host. */
	nativeSessionCatalogs: Type.Optional(Type.Array(closedObject({
		pluginId: NonEmptyString,
		label: NonEmptyString,
		detail: Type.Optional(Type.String())
	}))),
	/** Fresh setup needs an explicit native-conversation catalog choice. */
	nativeSessionCatalogPreferenceRequired: Type.Optional(Type.Boolean()),
	workspace: NonEmptyString,
	codexAppServerDetected: Type.Optional(Type.Boolean()),
	configuredModel: Type.Optional(Type.String()),
	setupModel: Type.Optional(Type.String()),
	utilityModel: Type.Optional(Type.String()),
	setupComplete: Type.Boolean()
});
/** Live verification of the Gateway's current default-agent inference route. */
const SystemAgentSetupVerifyParamsSchema = closedObject({
	modelTarget: Type.Optional(Type.Literal("utility")),
	/** Agent whose configured inference route is being verified. */
	agentId: Type.Optional(NonEmptyString)
});
const SystemAgentSetupVerifyResultSchema = Type.Union([closedObject({
	ok: Type.Literal(true),
	modelRef: NonEmptyString,
	modelTarget: Type.Optional(Type.Literal("utility")),
	latencyMs: Type.Number()
}), closedObject({
	ok: Type.Literal(false),
	status: SetupInferenceFailureStatusSchema,
	error: NonEmptyString
})]);
const SystemAgentSetupActivateParamsSchema = closedObject({
	modelTarget: Type.Optional(Type.Literal("utility")),
	/** Agent that owns the verified and persisted inference route. */
	agentId: Type.Optional(NonEmptyString),
	kind: Type.Union([...SetupInferenceKind.anyOf, Type.Literal("api-key")]),
	/** Exact detected model for this route; prevents detect/activate drift. */
	modelRef: Type.Optional(NonEmptyString),
	/** Manual step only: opaque provider-auth choice returned by detection. */
	authChoice: Type.Optional(Type.String()),
	/** Manual step only: the pasted API key or token; masked by clients, never echoed. */
	apiKey: Type.Optional(Type.String()),
	workspace: Type.Optional(Type.String()),
	/** Fresh-install opt-in for native provider conversation discovery. */
	nativeSessionCatalogsEnabled: Type.Optional(Type.Boolean())
});
/** Starts interactive activation without moving artifact consent into the client. */
const SystemAgentSetupActivateStartParamsSchema = closedObject({
	...SystemAgentSetupActivateParamsSchema.properties,
	/** Client-generated so the session can be cancelled after a lost start reply. */
	sessionId: NonEmptyString
});
const SystemAgentSetupActivateStartResultSchema = WizardStartResultSchema;
const SystemAgentSetupActivateResultSchema = closedObject({
	ok: Type.Boolean(),
	/** Present on success: the model ref that answered the live test. */
	modelRef: Type.Optional(Type.String()),
	modelTarget: Type.Optional(Type.Literal("utility")),
	latencyMs: Type.Optional(Type.Number()),
	/** Human-readable setup summary lines (workspace, model, gateway). */
	lines: Type.Optional(Type.Array(Type.String())),
	/** The committed config requires clients to reconnect after a Gateway restart. */
	gatewayRestartRequired: Type.Optional(Type.Literal(true)),
	/** Present on failure: coarse bucket for client copy + docs links. */
	status: Type.Optional(SetupInferenceStatus),
	error: Type.Optional(Type.String()),
	/** Owner-recorded rejection, not a claim that preparation had no persistent effects. */
	disposition: Type.Optional(SetupInferenceActivationRejectionSchema.properties.disposition)
});
/** Starts one provider-owned interactive login as a gateway wizard session. */
const SystemAgentSetupAuthStartParamsSchema = closedObject({
	modelTarget: Type.Optional(Type.Literal("utility")),
	/** Client-generated so cancellation remains possible if the start reply is lost. */
	sessionId: NonEmptyString,
	/** Agent that owns credentials and model selection created by this setup flow. */
	agentId: Type.Optional(NonEmptyString),
	authChoice: NonEmptyString,
	workspace: Type.Optional(Type.String()),
	/** Fresh-install opt-in for native provider conversation discovery. */
	nativeSessionCatalogsEnabled: Type.Optional(Type.Boolean())
});
const SystemAgentSetupAuthStartResultSchema = WizardStartResultSchema;
//#endregion
//#region packages/gateway-protocol/src/schema/cron-shared.ts
const MAX_DATE_TIMESTAMP_MS = 864e13;
const CronDateTimestampMsSchema = Type.Integer({
	minimum: 0,
	maximum: MAX_DATE_TIMESTAMP_MS
});
/** Builds create/patch payload variants while preserving per-call field optionality. */
function cronAgentTurnPayloadSchema(params) {
	return closedObject({
		kind: Type.Literal("agentTurn"),
		message: params.message,
		model: Type.Optional(params.model),
		fallbacks: Type.Optional(params.fallbacks),
		thinking: Type.Optional(params.thinking),
		timeoutSeconds: Type.Optional(params.timeoutSeconds),
		allowUnsafeExternalContent: Type.Optional(Type.Boolean()),
		lightContext: Type.Optional(Type.Boolean()),
		toolsAllow: Type.Optional(params.toolsAllow),
		toolsAllowIsDefault: Type.Optional(Type.Boolean())
	});
}
/** Builds command payload variants while preserving create/patch argv optionality. */
function cronCommandPayloadSchema(params) {
	return closedObject({
		kind: Type.Literal("command"),
		argv: params.argv,
		cwd: Type.Optional(Type.String({ minLength: 1 })),
		env: Type.Optional(Type.Record(Type.String({ minLength: 1 }), Type.String())),
		input: Type.Optional(Type.String()),
		timeoutSeconds: Type.Optional(params.timeoutSeconds),
		noOutputTimeoutSeconds: Type.Optional(Type.Number({ minimum: 0 })),
		outputMaxBytes: Type.Optional(Type.Integer({ minimum: 1 })),
		toolsAllow: Type.Optional(params.toolsAllow),
		toolsAllowIsDefault: Type.Optional(Type.Boolean())
	});
}
function cronScriptPayloadSchema(params) {
	return closedObject({
		kind: Type.Literal("script"),
		script: params.script,
		timeoutSeconds: Type.Optional(params.timeoutSeconds),
		toolBudget: Type.Optional(Type.Integer({ minimum: 1 })),
		toolsAllow: Type.Optional(params.toolsAllow),
		toolsAllowIsDefault: Type.Optional(Type.Boolean())
	});
}
//#endregion
//#region packages/gateway-protocol/src/schema/cron.ts
/**
* Cron scheduler protocol schemas.
*
* These contracts describe scheduled agent turns, system events, delivery
* routing, run history, and mutable job state shared by gateway RPC clients.
*/
/** Session target accepted by cron jobs. */
const CronSessionTargetSchema = Type.Union([
	Type.Literal("main"),
	Type.Literal("isolated"),
	Type.Literal("current"),
	Type.String({ pattern: "^session:.+" })
]);
/** Whether a cron job waits for heartbeat processing or wakes immediately. */
const CronWakeModeSchema = Type.Union([Type.Literal("next-heartbeat"), Type.Literal("now")]);
/** Run status factory reused for the active field and deprecated alias metadata. */
function cronRunStatusSchema(options = {}) {
	return Type.Union([
		Type.Literal("ok"),
		Type.Literal("error"),
		Type.Literal("skipped")
	], options);
}
const CronRunStatusSchema = cronRunStatusSchema();
const CronCompletionStatusSchema = Type.Union([
	Type.Literal("succeeded"),
	Type.Literal("failed"),
	Type.Literal("unknown")
]);
const CronConfigRevisionSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const DeprecatedCronRunStatusSchema = cronRunStatusSchema({
	deprecated: true,
	description: "Deprecated alias for lastRunStatus."
});
const CronSortDirSchema = Type.Union([Type.Literal("asc"), Type.Literal("desc")]);
const CronJobsEnabledFilterSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("enabled"),
	Type.Literal("disabled")
]);
const CronJobsScheduleKindFilterSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("at"),
	Type.Literal("every"),
	Type.Literal("cron"),
	Type.Literal("on-exit"),
	Type.Literal("stream")
]);
const CronJobsLastRunStatusFilterSchema = Type.Union([
	Type.Literal("all"),
	...CronRunStatusSchema.anyOf,
	Type.Literal("unknown")
]);
const CronJobsTriggerFilterSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("conditional"),
	Type.Literal("unconditional")
]);
const CronJobsSortBySchema = Type.Union([
	Type.Literal("nextRunAtMs"),
	Type.Literal("updatedAtMs"),
	Type.Literal("name")
]);
const CronRunsStatusFilterSchema = Type.Union([Type.Literal("all"), ...CronRunStatusSchema.anyOf]);
const CronDeliveryStatusSchema = Type.Union([
	Type.Literal("delivered"),
	Type.Literal("not-delivered"),
	Type.Literal("unknown"),
	Type.Literal("not-requested")
]);
const NonBlankString = Type.String({
	minLength: 1,
	pattern: "\\S"
});
const CronDeclarationKeySchema = Type.String({
	minLength: 1,
	maxLength: 200,
	pattern: "\\S"
});
const CronDisplayNameSchema = Type.String({
	minLength: 1,
	maxLength: 200,
	pattern: "\\S"
});
const CronOwnerSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	accountId: Type.Optional(NonEmptyString)
});
const CronScheduledToolPolicySchema = Type.Union([closedObject({
	version: Type.Literal(1),
	mode: Type.Literal("trusted")
}), closedObject({
	version: Type.Literal(1),
	mode: Type.Literal("account"),
	ownerSessionKey: NonEmptyString,
	ownerAccountId: NonEmptyString
})]);
const CronAnnounceChannelSchema = Type.Union([Type.Literal("last"), NonBlankString]);
const CronRunDiagnosticSeveritySchema = Type.Union([
	Type.Literal("info"),
	Type.Literal("warn"),
	Type.Literal("error")
]);
const CronRunDiagnosticSourceSchema = Type.Union([
	Type.Literal("cron-preflight"),
	Type.Literal("cron-setup"),
	Type.Literal("model-preflight"),
	Type.Literal("agent-run"),
	Type.Literal("tool"),
	Type.Literal("exec"),
	Type.Literal("delivery")
]);
const CronRunDiagnosticSchema = closedObject({
	ts: Type.Integer({ minimum: 0 }),
	source: CronRunDiagnosticSourceSchema,
	severity: CronRunDiagnosticSeveritySchema,
	message: Type.String(),
	toolName: Type.Optional(Type.String()),
	exitCode: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
	truncated: Type.Optional(Type.Boolean())
});
const CronRunDiagnosticsSchema = closedObject({
	summary: Type.Optional(Type.String()),
	entries: Type.Array(CronRunDiagnosticSchema)
});
const CronCommonOptionalFields = {
	agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	sessionKey: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	description: Type.Optional(Type.String()),
	enabled: Type.Optional(Type.Boolean()),
	deleteAfterRun: Type.Optional(Type.Boolean())
};
function cronIdOrJobIdParams(extraFields) {
	return Type.Union([closedObject({
		id: NonEmptyString,
		...extraFields
	}), closedObject({
		jobId: NonEmptyString,
		...extraFields
	})]);
}
const CronRunLogJobIdSchema = Type.String({
	minLength: 1,
	pattern: "^[^/\\\\]+$"
});
/** Schedule expression for one-time, interval, or cron-expression jobs. */
const CronScheduleSchema = Type.Union([
	closedObject({
		kind: Type.Literal("at"),
		at: NonEmptyString
	}),
	closedObject({
		kind: Type.Literal("every"),
		everyMs: Type.Integer({
			minimum: 1,
			maximum: MAX_DATE_TIMESTAMP_MS
		}),
		anchorMs: Type.Optional(Type.Integer({
			minimum: 0,
			maximum: MAX_DATE_TIMESTAMP_MS
		}))
	}),
	closedObject({
		kind: Type.Literal("cron"),
		expr: NonEmptyString,
		tz: Type.Optional(Type.String()),
		staggerMs: Type.Optional(Type.Integer({
			minimum: 0,
			maximum: MAX_DATE_TIMESTAMP_MS
		}))
	}),
	closedObject({
		kind: Type.Literal("on-exit"),
		command: NonEmptyString,
		cwd: Type.Optional(NonEmptyString)
	}),
	closedObject({
		kind: Type.Literal("stream"),
		command: Type.Array(NonEmptyString, { minItems: 1 }),
		cwd: Type.Optional(NonEmptyString),
		mode: Type.Optional(Type.Union([Type.Literal("line"), Type.Literal("match")])),
		match: Type.Optional(Type.String()),
		batchMs: Type.Optional(Type.Integer({ description: "Quiet-window milliseconds; clamped to 50-5000" })),
		maxBatchBytes: Type.Optional(Type.Integer({ description: "UTF-8 batch byte cap; clamped to 1024-65536" }))
	})
]);
/** Headless condition script evaluated before a recurring cron payload runs. */
const CronTriggerSchema = closedObject({
	script: Type.String({
		minLength: 1,
		maxLength: 65536
	}),
	once: Type.Optional(Type.Boolean())
});
/** Optional dynamic-cadence bounds stored with a cron job. */
const CronPacingSchema = Type.Object({
	min: Type.Optional(NonBlankString),
	max: Type.Optional(NonBlankString)
}, {
	additionalProperties: false,
	description: "Dynamic-cadence bounds; at least one of min or max is required"
});
const CronSystemEventPayloadSchema = closedObject({
	kind: Type.Literal("systemEvent"),
	text: NonEmptyString,
	toolsAllow: Type.Optional(Type.Array(Type.String())),
	toolsAllowIsDefault: Type.Optional(Type.Boolean())
});
const CronAgentTurnPayloadSchema = cronAgentTurnPayloadSchema({
	message: NonEmptyString,
	model: Type.String(),
	fallbacks: Type.Array(Type.String()),
	toolsAllow: Type.Array(Type.String()),
	thinking: Type.String(),
	timeoutSeconds: Type.Number({ minimum: 0 })
});
const CronCommandPayloadSchema = cronCommandPayloadSchema({
	argv: Type.Array(NonEmptyString, { minItems: 1 }),
	timeoutSeconds: Type.Number({ minimum: 0 }),
	toolsAllow: Type.Array(Type.String())
});
const CronScriptPayloadSchema = cronScriptPayloadSchema({
	script: Type.String({
		minLength: 1,
		maxLength: 65536
	}),
	timeoutSeconds: Type.Number({ minimum: 1 }),
	toolsAllow: Type.Array(Type.String())
});
/** Full cron payload for new jobs. */
const CronPayloadSchema = Type.Union([
	CronSystemEventPayloadSchema,
	CronAgentTurnPayloadSchema,
	CronCommandPayloadSchema,
	CronScriptPayloadSchema
]);
/** Reported payloads include the Gateway-owned heartbeat monitor. */
const CronReportedPayloadSchema = Type.Union([...CronPayloadSchema.anyOf, closedObject({ kind: Type.Literal("heartbeat") })]);
/** Partial cron payload for job updates. */
const CronPayloadPatchSchema = Type.Union([
	closedObject({
		kind: Type.Literal("systemEvent"),
		text: Type.Optional(NonEmptyString),
		toolsAllow: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
		toolsAllowIsDefault: Type.Optional(Type.Boolean())
	}),
	cronAgentTurnPayloadSchema({
		message: Type.Optional(NonEmptyString),
		model: Type.Union([Type.String(), Type.Null()]),
		fallbacks: Type.Union([Type.Array(Type.String()), Type.Null()]),
		toolsAllow: Type.Union([Type.Array(Type.String()), Type.Null()]),
		thinking: Type.Union([Type.String(), Type.Null()]),
		timeoutSeconds: Type.Union([Type.Number({ minimum: 0 }), Type.Null()])
	}),
	cronCommandPayloadSchema({
		argv: Type.Optional(Type.Array(NonEmptyString, { minItems: 1 })),
		timeoutSeconds: Type.Union([Type.Number({ minimum: 0 }), Type.Null()]),
		toolsAllow: Type.Union([Type.Array(Type.String()), Type.Null()])
	}),
	cronScriptPayloadSchema({
		script: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 65536
		})),
		timeoutSeconds: Type.Union([Type.Number({ minimum: 1 }), Type.Null()]),
		toolsAllow: Type.Union([Type.Array(Type.String()), Type.Null()])
	})
]);
/** Failure alert policy for repeated cron run failures. */
const CronFailureAlertSchema = closedObject({
	after: Type.Optional(Type.Integer({ minimum: 1 })),
	channel: Type.Optional(CronAnnounceChannelSchema),
	to: Type.Optional(NonBlankString),
	cooldownMs: Type.Optional(Type.Integer({ minimum: 0 })),
	includeSkipped: Type.Optional(Type.Boolean()),
	mode: Type.Optional(Type.Union([Type.Literal("announce"), Type.Literal("webhook")])),
	accountId: Type.Optional(NonEmptyString)
});
const CronFailureAlertPatchSchema = closedObject({
	after: Type.Optional(Type.Union([Type.Integer({ minimum: 1 }), Type.Null()])),
	channel: Type.Optional(Type.Union([CronAnnounceChannelSchema, Type.Null()])),
	to: Type.Optional(Type.Union([NonBlankString, Type.Null()])),
	cooldownMs: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	includeSkipped: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
	mode: Type.Optional(Type.Union([
		Type.Literal("announce"),
		Type.Literal("webhook"),
		Type.Null()
	])),
	accountId: Type.Optional(Type.Union([NonEmptyString, Type.Null()]))
});
/** Delivery destination used when failure alerts need a separate target. */
const CronFailureDestinationSchema = closedObject({
	channel: Type.Optional(CronAnnounceChannelSchema),
	to: Type.Optional(NonBlankString),
	accountId: Type.Optional(NonEmptyString),
	mode: Type.Optional(Type.Union([Type.Literal("announce"), Type.Literal("webhook")]))
});
const CronFailureDestinationPatchSchema = closedObject({
	channel: Type.Optional(Type.Union([CronAnnounceChannelSchema, Type.Null()])),
	to: Type.Optional(Type.Union([NonBlankString, Type.Null()])),
	accountId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	mode: Type.Optional(Type.Union([
		Type.Literal("announce"),
		Type.Literal("webhook"),
		Type.Null()
	]))
});
const CronCompletionDestinationSchema = closedObject({
	mode: Type.Literal("webhook"),
	to: NonBlankString
});
const CronDeliverySharedProperties = {
	channel: Type.Optional(CronAnnounceChannelSchema),
	threadId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
	accountId: Type.Optional(NonEmptyString),
	bestEffort: Type.Optional(Type.Boolean()),
	failureDestination: Type.Optional(CronFailureDestinationSchema)
};
const CronDeliveryPatchSharedProperties = {
	channel: Type.Optional(Type.Union([CronAnnounceChannelSchema, Type.Null()])),
	threadId: Type.Optional(Type.Union([
		Type.String(),
		Type.Number(),
		Type.Null()
	])),
	accountId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	bestEffort: Type.Optional(Type.Boolean()),
	failureDestination: Type.Optional(Type.Union([CronFailureDestinationPatchSchema, Type.Null()]))
};
const CronDeliveryNoopSchema = closedObject({
	mode: Type.Literal("none"),
	...CronDeliverySharedProperties,
	to: Type.Optional(NonBlankString)
});
const CronDeliveryAnnounceSchema = closedObject({
	mode: Type.Literal("announce"),
	...CronDeliverySharedProperties,
	completionDestination: Type.Optional(CronCompletionDestinationSchema),
	to: Type.Optional(NonBlankString)
});
const CronDeliveryWebhookSchema = closedObject({
	mode: Type.Literal("webhook"),
	...CronDeliverySharedProperties,
	to: NonBlankString
});
/** Delivery policy for cron run output. */
const CronDeliverySchema = Type.Union([
	CronDeliveryNoopSchema,
	CronDeliveryAnnounceSchema,
	CronDeliveryWebhookSchema
]);
/** Patch shape for cron delivery policy updates. */
const CronDeliveryPatchSchema = closedObject({
	mode: Type.Optional(Type.Union([
		Type.Literal("none"),
		Type.Literal("announce"),
		Type.Literal("webhook")
	])),
	...CronDeliveryPatchSharedProperties,
	completionDestination: Type.Optional(Type.Union([CronCompletionDestinationSchema, Type.Null()])),
	to: Type.Optional(Type.Union([NonBlankString, Type.Null()]))
});
const CronFailureNotificationDeliverySchema = closedObject({
	delivered: Type.Optional(Type.Boolean()),
	status: CronDeliveryStatusSchema,
	error: Type.Optional(Type.String())
});
const CronDeliveryTraceTargetProperties = {
	channel: Type.Optional(Type.String()),
	to: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	accountId: Type.Optional(Type.String()),
	threadId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
	source: Type.Optional(Type.Union([Type.Literal("explicit"), Type.Literal("last")]))
};
const CronDeliveryTraceSchema = closedObject({
	intended: Type.Optional(closedObject(CronDeliveryTraceTargetProperties)),
	resolved: Type.Optional(closedObject({
		...CronDeliveryTraceTargetProperties,
		ok: Type.Boolean(),
		error: Type.Optional(Type.String())
	})),
	messageToolSentTo: Type.Optional(Type.Array(closedObject({
		channel: Type.String(),
		to: Type.Optional(Type.String()),
		accountId: Type.Optional(Type.String()),
		threadId: Type.Optional(Type.String())
	}))),
	fallbackUsed: Type.Optional(Type.Boolean()),
	delivered: Type.Optional(Type.Boolean())
});
const CronAutoDisabledSchema = closedObject({
	reason: Type.Union([Type.Literal("consecutive-failures"), Type.Literal("schedule-errors")]),
	atMs: CronDateTimestampMsSchema,
	consecutiveErrors: Type.Integer({ minimum: 1 })
});
const CronJobRuntimeFeedbackProperties = {
	lastFailureNotificationDelivered: Type.Optional(Type.Boolean()),
	lastFailureNotificationDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastFailureNotificationDeliveryError: Type.Optional(Type.String()),
	lastFailureAlertAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastTriggerEvalAtMs: Type.Optional(CronDateTimestampMsSchema),
	triggerEvalCount: Type.Optional(Type.Integer({ minimum: 0 })),
	lastTriggerFireAtMs: Type.Optional(CronDateTimestampMsSchema),
	triggerState: Type.Optional(Type.Unknown()),
	streamStatus: Type.Optional(Type.Union([
		Type.Literal("starting"),
		Type.Literal("running"),
		Type.Literal("restarting"),
		Type.Literal("stopped"),
		Type.Literal("disabled"),
		Type.Literal("error")
	])),
	streamError: Type.Optional(Type.String()),
	streamConsecutiveFailures: Type.Optional(Type.Integer({ minimum: 0 })),
	streamRestartExhausted: Type.Optional(Type.Boolean())
};
/** Scheduler-maintained state for the latest run/delivery outcome. */
const CronJobStateSchema = closedObject({
	nextRunAtMs: Type.Optional(CronDateTimestampMsSchema),
	scheduleActivatedAtMs: Type.Optional(CronDateTimestampMsSchema),
	runningAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastRunAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastRunStatus: Type.Optional(CronRunStatusSchema),
	lastStatus: Type.Optional(DeprecatedCronRunStatusSchema),
	lastError: Type.Optional(Type.String()),
	lastDiagnostics: Type.Optional(CronRunDiagnosticsSchema),
	lastDiagnosticSummary: Type.Optional(Type.String()),
	lastErrorReason: Type.Optional(FailoverReasonSchema),
	lastDurationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	consecutiveErrors: Type.Optional(Type.Integer({ minimum: 0 })),
	scheduleErrorCount: Type.Optional(Type.Integer({ minimum: 0 })),
	autoDisabled: Type.Optional(CronAutoDisabledSchema),
	consecutiveSkipped: Type.Optional(Type.Integer({ minimum: 0 })),
	lastDelivered: Type.Optional(Type.Boolean()),
	lastDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastDeliveryError: Type.Optional(Type.String()),
	deliverySuppressionReason: Type.Optional(Type.String()),
	...CronJobRuntimeFeedbackProperties,
	streamSourceIdentity: Type.Optional(Type.String()),
	streamDroppedBatches: Type.Optional(Type.Integer({ minimum: 0 })),
	streamCoalescedBatches: Type.Optional(Type.Integer({ minimum: 0 })),
	streamLastStartedAtMs: Type.Optional(CronDateTimestampMsSchema),
	streamLastExitAtMs: Type.Optional(CronDateTimestampMsSchema)
});
const CronJobStatePatchSchema = closedObject({
	nextRunAtMs: Type.Optional(CronDateTimestampMsSchema),
	runningAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastRunAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastRunStatus: Type.Optional(CronRunStatusSchema),
	lastStatus: Type.Optional(DeprecatedCronRunStatusSchema),
	lastError: Type.Optional(Type.String()),
	lastErrorReason: Type.Optional(FailoverReasonSchema),
	lastDurationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	consecutiveErrors: Type.Optional(Type.Integer({ minimum: 0 })),
	consecutiveSkipped: Type.Optional(Type.Integer({ minimum: 0 })),
	lastDelivered: Type.Optional(Type.Boolean()),
	lastDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastDeliveryError: Type.Optional(Type.String()),
	...CronJobRuntimeFeedbackProperties,
	streamDroppedBatches: Type.Optional(Type.Integer({ minimum: 0 })),
	streamCoalescedBatches: Type.Optional(Type.Integer({ minimum: 0 })),
	streamLastStartedAtMs: Type.Optional(CronDateTimestampMsSchema),
	streamLastExitAtMs: Type.Optional(CronDateTimestampMsSchema)
});
/** Persisted cron job definition returned by scheduler list/get APIs. */
const CronJobSchema = closedObject({
	id: NonEmptyString,
	declarationKey: Type.Optional(CronDeclarationKeySchema),
	displayName: Type.Optional(CronDisplayNameSchema),
	owner: Type.Optional(CronOwnerSchema),
	scheduledToolPolicy: Type.Optional(CronScheduledToolPolicySchema),
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	description: Type.Optional(Type.String()),
	enabled: Type.Boolean(),
	deleteAfterRun: Type.Optional(Type.Boolean()),
	createdAtMs: CronDateTimestampMsSchema,
	updatedAtMs: CronDateTimestampMsSchema,
	/** Opaque Gateway-computed token for the job definition, excluding scheduler state. */
	configRevision: Type.Optional(CronConfigRevisionSchema),
	schedule: CronScheduleSchema,
	pacing: Type.Optional(CronPacingSchema),
	trigger: Type.Optional(CronTriggerSchema),
	sessionTarget: CronSessionTargetSchema,
	wakeMode: CronWakeModeSchema,
	payload: CronReportedPayloadSchema,
	delivery: Type.Optional(CronDeliverySchema),
	failureAlert: Type.Optional(Type.Union([Type.Literal(false), CronFailureAlertSchema])),
	state: CronJobStateSchema,
	nextRunAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastRunAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastRunStatus: Type.Optional(CronRunStatusSchema),
	lastRunError: Type.Optional(Type.String()),
	lastDelivered: Type.Optional(Type.Boolean()),
	lastDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastDeliveryError: Type.Optional(Type.String()),
	deliverySuppressionReason: Type.Optional(Type.String()),
	lastFailureNotificationDelivered: Type.Optional(Type.Boolean()),
	lastFailureNotificationDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastFailureNotificationDeliveryError: Type.Optional(Type.String())
});
/** Query params for listing cron jobs with filters and pagination. */
const CronListParamsSchema = closedObject({
	sessionKey: Type.Optional(NonEmptyString),
	sessionAgentId: Type.Optional(NonEmptyString),
	includeDisabled: Type.Optional(Type.Boolean()),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 200
	})),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
	query: Type.Optional(Type.String()),
	enabled: Type.Optional(CronJobsEnabledFilterSchema),
	scheduleKind: Type.Optional(CronJobsScheduleKindFilterSchema),
	lastRunStatus: Type.Optional(CronJobsLastRunStatusFilterSchema),
	trigger: Type.Optional(CronJobsTriggerFilterSchema),
	sortBy: Type.Optional(CronJobsSortBySchema),
	sortDir: Type.Optional(CronSortDirSchema),
	agentId: Type.Optional(NonEmptyString),
	compact: Type.Optional(Type.Boolean()),
	includeDeliveryPreviews: Type.Optional(Type.Boolean())
});
/** Empty request payload for scheduler status. */
const CronStatusParamsSchema = closedObject({});
/** Looks up a job by stable id or legacy jobId alias. */
const CronGetParamsSchema = cronIdOrJobIdParams({});
const CronScratchSchema = closedObject({
	content: Type.String({ maxLength: 262144 }),
	revision: Type.Integer({ minimum: 1 }),
	updatedAtMs: Type.Integer({ minimum: 0 })
});
/** Reads private per-job scratch without adding it to the public job schema. */
const CronScratchGetParamsSchema = cronIdOrJobIdParams({});
const CronScratchGetResultSchema = closedObject({
	scratch: Type.Union([CronScratchSchema, Type.Null()]),
	currentRevision: Type.Integer({ minimum: 0 }),
	maxBytes: Type.Integer({ minimum: 1 })
});
/** Compare-and-swaps or clears private per-job scratch. */
const CronScratchSetParamsSchema = cronIdOrJobIdParams({
	content: Type.Union([Type.String({ maxLength: 262144 }), Type.Null()]),
	expectedRevision: Type.Optional(Type.Integer({ minimum: 0 }))
});
const CronScratchSetResultSchema = Type.Union([closedObject({
	ok: Type.Literal(true),
	...CronScratchGetResultSchema.properties
}), closedObject({
	ok: Type.Literal(false),
	reason: Type.Literal("revision-conflict"),
	currentRevision: Type.Integer({ minimum: 0 })
})]);
/** Creates a scheduled job with schedule, target, payload, and delivery policy. */
const CronAddParamsSchema = closedObject({
	name: NonEmptyString,
	declarationKey: Type.Optional(CronDeclarationKeySchema),
	displayName: Type.Optional(CronDisplayNameSchema),
	owner: Type.Optional(CronOwnerSchema),
	...CronCommonOptionalFields,
	schedule: CronScheduleSchema,
	pacing: Type.Optional(CronPacingSchema),
	trigger: Type.Optional(CronTriggerSchema),
	sessionTarget: CronSessionTargetSchema,
	wakeMode: CronWakeModeSchema,
	payload: CronPayloadSchema,
	delivery: Type.Optional(CronDeliverySchema),
	failureAlert: Type.Optional(Type.Union([Type.Literal(false), CronFailureAlertSchema]))
});
/** Dry-run delivery route shown at create and list time without sending. */
const CronDeliveryPreviewSchema = closedObject({
	label: Type.String(),
	detail: Type.String()
});
/** Successful declaration-key convergence result. */
const CronDeclarativeAddResultSchema = closedObject({
	created: Type.Boolean(),
	updated: Type.Optional(Type.Boolean()),
	job: CronJobSchema,
	deliveryPreview: Type.Optional(CronDeliveryPreviewSchema)
});
/** Imperative create result: the public job plus an optional create-time preview. */
const CronAddJobResultSchema = closedObject({
	...CronJobSchema.properties,
	deliveryPreview: Type.Optional(CronDeliveryPreviewSchema)
});
/** Successful result from imperative create or declaration-key convergence. */
const CronAddResultSchema = Type.Union([CronAddJobResultSchema, CronDeclarativeAddResultSchema]);
/** Updates a cron job by id or legacy jobId alias. */
const CronUpdateParamsSchema = cronIdOrJobIdParams({
	patch: closedObject({
		name: Type.Optional(NonEmptyString),
		displayName: Type.Optional(Type.Union([CronDisplayNameSchema, Type.Null()])),
		...CronCommonOptionalFields,
		schedule: Type.Optional(CronScheduleSchema),
		pacing: Type.Optional(Type.Union([CronPacingSchema, Type.Null()])),
		trigger: Type.Optional(Type.Union([CronTriggerSchema, Type.Null()])),
		sessionTarget: Type.Optional(CronSessionTargetSchema),
		wakeMode: Type.Optional(CronWakeModeSchema),
		payload: Type.Optional(CronPayloadPatchSchema),
		delivery: Type.Optional(CronDeliveryPatchSchema),
		failureAlert: Type.Optional(Type.Union([
			Type.Literal(false),
			CronFailureAlertPatchSchema,
			Type.Null()
		])),
		state: Type.Optional(CronJobStatePatchSchema)
	}),
	/** Rejects the patch when the current definition does not match the caller's token. */
	expectedConfigRevision: Type.Optional(CronConfigRevisionSchema)
});
/** Removes a cron job by id or legacy jobId alias. */
const CronRemoveParamsSchema = cronIdOrJobIdParams({});
/** Runs a cron job immediately, immediately if enabled, or only if due. */
const CronRunParamsSchema = cronIdOrJobIdParams({
	mode: Type.Optional(Type.Union([
		Type.Literal("due"),
		Type.Literal("force"),
		Type.Literal("if-enabled")
	])),
	/** Rejects the mutation if the Gateway restarted after the caller's preflight. */
	expectedProcessInstanceId: Type.Optional(NonEmptyString),
	/** Holds the response until the queued run records its outcome or this many ms pass. */
	waitTimeoutMs: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: 2147483647
	}))
});
/** Query params for cron run history. */
const CronRunsParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	scope: Type.Optional(Type.Union([Type.Literal("job"), Type.Literal("all")])),
	id: Type.Optional(CronRunLogJobIdSchema),
	jobId: Type.Optional(CronRunLogJobIdSchema),
	runId: Type.Optional(NonEmptyString),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 200
	})),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
	statuses: Type.Optional(Type.Array(CronRunStatusSchema, {
		minItems: 1,
		maxItems: 3
	})),
	status: Type.Optional(CronRunsStatusFilterSchema),
	deliveryStatuses: Type.Optional(Type.Array(CronDeliveryStatusSchema, {
		minItems: 1,
		maxItems: 4
	})),
	deliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	query: Type.Optional(Type.String()),
	sortDir: Type.Optional(CronSortDirSchema)
});
/** One persisted cron run history entry. */
const CronRunLogEntrySchema = closedObject({
	ts: Type.Integer({ minimum: 0 }),
	jobId: NonEmptyString,
	action: Type.Literal("finished"),
	status: Type.Optional(CronRunStatusSchema),
	completionStatus: Type.Optional(CronCompletionStatusSchema),
	error: Type.Optional(Type.String()),
	errorReason: Type.Optional(FailoverReasonSchema),
	summary: Type.Optional(Type.String()),
	diagnostics: Type.Optional(CronRunDiagnosticsSchema),
	delivered: Type.Optional(Type.Boolean()),
	deliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	deliveryError: Type.Optional(Type.String()),
	deliverySuppressionReason: Type.Optional(Type.String()),
	failureNotificationDelivery: Type.Optional(CronFailureNotificationDeliverySchema),
	delivery: Type.Optional(CronDeliveryTraceSchema),
	sessionId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	runAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	nextRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	triggerFired: Type.Optional(Type.Boolean()),
	model: Type.Optional(Type.String()),
	provider: Type.Optional(Type.String()),
	usage: Type.Optional(closedObject({
		input_tokens: Type.Optional(Type.Number()),
		output_tokens: Type.Optional(Type.Number()),
		total_tokens: Type.Optional(Type.Number()),
		cache_read_tokens: Type.Optional(Type.Number()),
		cache_write_tokens: Type.Optional(Type.Number())
	})),
	jobName: Type.Optional(Type.String())
});
/** Transcript selection is bound to one recorded cron run, never a client-selected session. */
const CronHistoryParamsSchema = closedObject({
	id: NonEmptyString,
	runId: Type.Optional(NonEmptyString),
	runAtMs: Type.Optional(CronDateTimestampMsSchema),
	cursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 8192
	})),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 200
	}))
});
const CronHistoryResultSchema = closedObject({
	messages: Type.Array(Type.Unknown()),
	activity: Type.Optional(Type.Array(ChatHistoryActivitySchema)),
	nextCursor: Type.Optional(Type.String({ maxLength: 8192 }))
});
//#endregion
//#region packages/gateway-protocol/src/schema/exec-approvals.ts
/**
* Exec approval protocol schemas.
*
* These payloads cross the security-review boundary for command execution, so
* persisted policy, request snapshots, and resolve decisions stay explicit.
*/
/** One persisted allowlist entry for a command pattern or resolved executable. */
const ExecApprovalsAllowlistEntrySchema = closedObject({
	id: Type.Optional(NonEmptyString),
	pattern: Type.String(),
	source: Type.Optional(Type.Literal("allow-always")),
	commandText: Type.Optional(Type.String()),
	argPattern: Type.Optional(Type.String()),
	lastUsedAt: Type.Optional(Type.Number({ minimum: 0 })),
	lastUsedCommand: Type.Optional(Type.String()),
	lastResolvedPath: Type.Optional(Type.String())
});
const ExecApprovalsPolicyFields = {
	security: Type.Optional(Type.String()),
	ask: Type.Optional(Type.String()),
	askFallback: Type.Optional(Type.String()),
	autoAllowSkills: Type.Optional(Type.Boolean())
};
const ExecSecuritySchema = Type.Union([
	Type.Literal("deny"),
	Type.Literal("allowlist"),
	Type.Literal("full")
]);
const ExecAskSchema = Type.Union([
	Type.Literal("off"),
	Type.Literal("on-miss"),
	Type.Literal("always")
]);
/** Host-resolved default policy after applying persisted defaults and runtime fallbacks. */
const ExecApprovalsResolvedDefaultsSchema = closedObject({
	security: ExecSecuritySchema,
	ask: ExecAskSchema,
	askFallback: ExecSecuritySchema,
	autoAllowSkills: Type.Boolean()
});
/** Default exec approval policy shared by all agents unless overridden. */
const ExecApprovalsDefaultsSchema = closedObject(ExecApprovalsPolicyFields);
/** Agent-specific exec approval policy and allowlist. */
const ExecApprovalsAgentSchema = closedObject({
	...ExecApprovalsPolicyFields,
	allowlist: Type.Optional(Type.Array(ExecApprovalsAllowlistEntrySchema)),
	mcpTools: Type.Optional(Type.Array(closedObject({
		server: Type.String({
			minLength: 1,
			pattern: "\\S"
		}),
		tool: Type.String({
			minLength: 1,
			pattern: "\\S"
		}),
		source: Type.Literal("allow-always"),
		addedAt: Type.Number({ minimum: 0 }),
		lastUsedAt: Type.Optional(Type.Number({ minimum: 0 }))
	})))
});
/** Versioned exec approvals config file edited through gateway APIs. */
const ExecApprovalsFileSchema = closedObject({
	version: Type.Literal(1),
	socket: Type.Optional(closedObject({
		path: Type.Optional(Type.String()),
		token: Type.Optional(Type.String())
	})),
	defaults: Type.Optional(ExecApprovalsDefaultsSchema),
	agents: Type.Optional(Type.Record(Type.String(), ExecApprovalsAgentSchema))
});
closedObject({
	path: NonEmptyString,
	exists: Type.Boolean(),
	hash: NonEmptyString,
	file: ExecApprovalsFileSchema,
	resolvedDefaults: Type.Optional(ExecApprovalsResolvedDefaultsSchema)
});
const NativeExecApprovalActionSchema = Type.Union([
	Type.Literal("allow"),
	Type.Literal("deny"),
	Type.Literal("prompt")
]);
/** One rule owned and enforced by a host-native exec policy implementation. */
const NativeExecApprovalRuleSchema = closedObject({
	pattern: NonEmptyString,
	action: NativeExecApprovalActionSchema,
	shells: Type.Optional(Type.Array(NonEmptyString)),
	description: Type.Optional(Type.String()),
	enabled: Type.Optional(Type.Boolean())
});
const NativeExecApprovalConstraintsSchema = closedObject({
	baseHashRequired: Type.Optional(Type.Boolean()),
	defaultAllowAllowed: Type.Optional(Type.Boolean()),
	broadAllowRulesAllowed: Type.Optional(Type.Boolean()),
	dangerousAllowRulesAllowed: Type.Optional(Type.Boolean())
});
/** Node read snapshot supporting file-backed and host-native approval owners. */
const ExecApprovalsNodeSnapshotSchema = Type.Object({
	path: Type.Optional(Type.String()),
	exists: Type.Optional(Type.Boolean()),
	hash: Type.Optional(Type.String()),
	file: Type.Optional(ExecApprovalsFileSchema),
	resolvedDefaults: Type.Optional(ExecApprovalsResolvedDefaultsSchema),
	enabled: Type.Optional(Type.Boolean()),
	baseHash: Type.Optional(NonEmptyString),
	defaultAction: Type.Optional(NativeExecApprovalActionSchema),
	rules: Type.Optional(Type.Array(NativeExecApprovalRuleSchema)),
	constraints: Type.Optional(NativeExecApprovalConstraintsSchema),
	message: Type.Optional(Type.String())
}, {
	additionalProperties: false,
	oneOf: [
		{
			required: [
				"path",
				"exists",
				"hash",
				"file"
			],
			not: { anyOf: [
				{ required: ["enabled"] },
				{ required: ["baseHash"] },
				{ required: ["defaultAction"] },
				{ required: ["rules"] },
				{ required: ["constraints"] },
				{ required: ["message"] }
			] }
		},
		{
			properties: {
				enabled: { const: true },
				hash: { minLength: 1 }
			},
			required: [
				"enabled",
				"hash",
				"defaultAction",
				"rules"
			],
			not: { anyOf: [
				{ required: ["path"] },
				{ required: ["exists"] },
				{ required: ["file"] },
				{ required: ["resolvedDefaults"] },
				{ required: ["message"] }
			] }
		},
		{
			properties: { enabled: { const: false } },
			required: ["enabled"],
			not: { anyOf: [
				{ required: ["path"] },
				{ required: ["exists"] },
				{ required: ["hash"] },
				{ required: ["file"] },
				{ required: ["resolvedDefaults"] },
				{ required: ["baseHash"] },
				{ required: ["defaultAction"] },
				{ required: ["rules"] },
				{ required: ["constraints"] }
			] }
		}
	]
});
/** Read local exec approval policy, optionally bound to its serving state owner. */
const ExecApprovalsGetParamsSchema = closedObject({ expectedOwnerId: Type.Optional(NonEmptyString) });
/** Local exec approval policy write request with optional base hash guard. */
const ExecApprovalsSetParamsSchema = closedObject({
	file: ExecApprovalsFileSchema,
	baseHash: Type.Optional(NonEmptyString),
	expectedOwnerId: Type.Optional(NonEmptyString)
});
/** Node-scoped request payload for reading exec approval policy. */
const ExecApprovalsNodeGetParamsSchema = closedObject({ nodeId: NonEmptyString });
/** Writable host-native policy fields; the node remains the validation authority. */
const NativeExecApprovalPolicySchema = closedObject({
	defaultAction: Type.Optional(NativeExecApprovalActionSchema),
	rules: Type.Array(NativeExecApprovalRuleSchema)
});
/** Node-scoped write for exactly one file-backed or host-native approval owner. */
const ExecApprovalsNodeSetParamsSchema = Type.Object({
	nodeId: NonEmptyString,
	file: Type.Optional(ExecApprovalsFileSchema),
	native: Type.Optional(NativeExecApprovalPolicySchema),
	baseHash: Type.Optional(NonEmptyString)
}, {
	additionalProperties: false,
	oneOf: [{
		required: ["file"],
		not: { required: ["native"] }
	}, {
		required: ["native", "baseHash"],
		not: { required: ["file"] }
	}]
});
/** Lookup request for one pending exec approval by id. */
const ExecApprovalGetParamsSchema = closedObject({ id: NonEmptyString });
const ExecApprovalPolicySnapshotSchema = closedObject({
	...ExecApprovalsResolvedDefaultsSchema.properties,
	allowlistRules: Type.Array(closedObject({
		pattern: Type.String(),
		argPattern: Type.Optional(Type.String()),
		source: Type.Optional(Type.Literal("allow-always"))
	}))
});
/** Pending command execution approval request shown to reviewers. */
const ExecApprovalRequestParamsSchema = closedObject({
	id: Type.Optional(NonEmptyString),
	command: Type.Optional(NonEmptyString),
	commandArgv: Type.Optional(Type.Array(Type.String())),
	systemRunPlan: Type.Optional(closedObject({
		argv: Type.Array(Type.String()),
		cwd: Type.Union([Type.String(), Type.Null()]),
		commandText: Type.String(),
		commandPreview: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		agentId: Type.Union([Type.String(), Type.Null()]),
		sessionKey: Type.Union([Type.String(), Type.Null()]),
		policySnapshot: Type.Optional(ExecApprovalPolicySnapshotSchema),
		mutableFileOperand: Type.Optional(Type.Union([closedObject({
			argvIndex: Type.Integer({ minimum: 0 }),
			path: Type.String(),
			sha256: Type.String()
		}), Type.Null()]))
	})),
	env: Type.Optional(Type.Record(NonEmptyString, Type.String())),
	cwd: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	nodeId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	host: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	security: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	ask: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	warningText: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	scope: Type.Optional(ApprovalScopeSchema),
	unavailableDecisions: Type.Optional(Type.Array(Type.String({ enum: ["allow-always"] }), {
		minItems: 1,
		maxItems: 1
	})),
	commandSpans: Type.Optional(Type.Array(closedObject({
		startIndex: Type.Integer({
			minimum: 0,
			description: "Inclusive UTF-16 code unit offset into command."
		}),
		endIndex: Type.Integer({
			minimum: 1,
			description: "Exclusive UTF-16 code unit offset into command; must be greater than startIndex and no greater than command.length."
		})
	}))),
	agentId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	resolvedPath: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	sessionKey: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	sessionId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	runId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	toolCallId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	turnSourceChannel: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	turnSourceTo: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	turnSourceAccountId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	turnSourceThreadId: Type.Optional(Type.Union([
		Type.String(),
		Type.Number(),
		Type.Null()
	])),
	approvalReviewerDeviceIds: Type.Optional(Type.Array(NonEmptyString, { description: "Trusted approval-runtime metadata naming operator devices that may review this approval; ordinary Gateway clients may send the field, but the Gateway only binds it for internal approval-runtime requests." })),
	requireDeliveryRoute: Type.Optional(Type.Boolean()),
	suppressDelivery: Type.Optional(Type.Boolean()),
	deliverToApprovalClientsOnly: Type.Optional(Type.Boolean()),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
	twoPhase: Type.Optional(Type.Boolean())
});
/** Reviewer decision payload for one pending exec approval. */
const ExecApprovalResolveParamsSchema = closedObject({
	id: NonEmptyString,
	decision: NonEmptyString,
	reviewer: Type.Optional(ApprovalChannelReviewerSchema),
	grantExpiresInDays: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 3650
	}))
});
/** Operator listing filter for standing grants; bounded for prompt-safe output. */
const ExecApprovalGrantsListParamsSchema = closedObject({ limit: Type.Optional(Type.Integer({
	minimum: 1,
	maximum: 500
})) });
/** One standing grant projected for operator surfaces. */
const ExecApprovalStandingGrantSchema = closedObject({
	grantId: NonEmptyString,
	mintedByApprovalId: NonEmptyString,
	agentId: NonEmptyString,
	cronJobId: NonEmptyString,
	cronJobName: Type.Union([Type.String({
		minLength: 1,
		maxLength: 200
	}), Type.Null()]),
	command: Type.String({
		minLength: 1,
		maxLength: 512
	}),
	cwd: Type.Union([Type.String({
		minLength: 1,
		maxLength: 512
	}), Type.Null()]),
	createdAtMs: Type.Integer({ minimum: 0 }),
	expiresAtMs: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
	revokedAtMs: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
	revokedBy: Type.Union([Type.String({
		minLength: 1,
		maxLength: 200
	}), Type.Null()]),
	lastUsedAtMs: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
	useCount: Type.Integer({ minimum: 0 })
});
closedObject({ grants: Type.Array(ExecApprovalStandingGrantSchema, { maxItems: 500 }) });
const ExecApprovalGrantsRevokeParamsSchema = closedObject({ grantId: NonEmptyString });
closedObject({ outcome: Type.Union([
	Type.Literal("revoked"),
	Type.Literal("already-revoked"),
	Type.Literal("not-found")
]) });
//#endregion
//#region packages/gateway-protocol/src/schema/devices.ts
const DevicePairListParamsSchema = closedObject({});
const DevicePairApproveParamsSchema = closedObject({ requestId: NonEmptyString });
const DevicePairRejectParamsSchema = closedObject({ requestId: NonEmptyString });
const DevicePairRemoveParamsSchema = closedObject({ deviceId: NonEmptyString });
const DevicePairLabelString = Type.String({
	minLength: 1,
	maxLength: 64
});
const DevicePairRenameParamsSchema = closedObject({
	deviceId: NonEmptyString,
	label: DevicePairLabelString
});
const DeviceTokenRotateParamsSchema = closedObject({
	deviceId: NonEmptyString,
	role: NonEmptyString,
	scopes: Type.Optional(Type.Array(NonEmptyString))
});
/**
* Rotation outcome. `tokenDelivery` records how the replacement reached its owner so
* clients report a fact instead of inferring one from the absent `token`: the gateway
* echoes the bearer token only to a device rotating its own token, and never on a
* shared/admin cross-device rotation (see `docs/cli/devices.md`). Optional because
* gateways released before this field omit it entirely.
*/
const withoutDeviceTokenRotateResultField = (field) => ({ not: { required: [field] } });
Type.Object({
	deviceId: NonEmptyString,
	role: NonEmptyString,
	token: Type.Optional(NonEmptyString),
	scopes: Type.Array(NonEmptyString),
	rotatedAtMs: Type.Integer({ minimum: 0 }),
	tokenDelivery: Type.Optional(Type.String({ enum: ["in-band", "withheld-cross-device"] }))
}, {
	additionalProperties: false,
	allOf: [Type.Union([
		Type.Object({
			token: NonEmptyString,
			tokenDelivery: Type.Literal("in-band")
		}),
		Type.Intersect([Type.Object({ tokenDelivery: Type.Literal("withheld-cross-device") }), withoutDeviceTokenRotateResultField("token")]),
		withoutDeviceTokenRotateResultField("tokenDelivery")
	])]
});
const DeviceTokenRevokeParamsSchema = closedObject({
	deviceId: NonEmptyString,
	role: NonEmptyString
});
const ScopeUpgradeRequestSchema = closedObject({ scopes: Type.Array(NonEmptyString, {
	minItems: 1,
	maxItems: 8,
	uniqueItems: true
}) });
const ScopeUpgradeWaitSchema = closedObject({ requestId: NonEmptyString });
closedObject({ requestId: NonEmptyString });
const ScopeUpgradeApprovedSchema = closedObject({
	status: Type.Literal("approved"),
	requestId: NonEmptyString,
	deviceToken: NonEmptyString,
	scopes: Type.Array(NonEmptyString, {
		minItems: 1,
		maxItems: 8,
		uniqueItems: true
	})
});
const ScopeUpgradeRejectedSchema = closedObject({
	status: Type.Literal("rejected"),
	requestId: NonEmptyString
});
const ScopeUpgradeExpiredSchema = closedObject({
	status: Type.Literal("expired"),
	requestId: NonEmptyString
});
Type.Union([
	ScopeUpgradeApprovedSchema,
	ScopeUpgradeRejectedSchema,
	ScopeUpgradeExpiredSchema
]);
closedObject({
	requestId: NonEmptyString,
	deviceId: NonEmptyString,
	publicKey: NonEmptyString,
	displayName: Type.Optional(NonEmptyString),
	platform: Type.Optional(NonEmptyString),
	deviceFamily: Type.Optional(NonEmptyString),
	clientId: Type.Optional(NonEmptyString),
	clientMode: Type.Optional(NonEmptyString),
	browserOrigin: Type.Optional(NonEmptyString),
	role: Type.Optional(NonEmptyString),
	roles: Type.Optional(Type.Array(NonEmptyString)),
	scopes: Type.Optional(Type.Array(NonEmptyString)),
	remoteIp: Type.Optional(NonEmptyString),
	silent: Type.Optional(Type.Boolean()),
	isRepair: Type.Optional(Type.Boolean()),
	ts: Type.Integer({ minimum: 0 })
});
/** Opaque non-secret setup correlation id; never derived from the bearer setup code. */
const SetupIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
closedObject({
	requestId: NonEmptyString,
	deviceId: NonEmptyString,
	decision: NonEmptyString,
	ts: Type.Integer({ minimum: 0 })
});
/**
* Terminal outcome of one setup credential, recorded when its exact bootstrap
* handoff delivered credentials. Carries no bearer material and no
* token-derived identifier.
*/
const DevicePairSetupCompletedEventSchema = closedObject({
	setupId: SetupIdSchema,
	deviceId: NonEmptyString,
	deviceName: Type.Optional(NonEmptyString),
	access: Type.Union([
		Type.Literal("full"),
		Type.Literal("limited"),
		Type.Literal("node")
	]),
	ts: Type.Integer({ minimum: 0 })
});
/** Event emitted when the bearer was retired but response delivery could not be confirmed. */
const DevicePairSetupDeliveryUncertainEventSchema = DevicePairSetupCompletedEventSchema;
/** Reconciles one setup credential the caller already holds a `setupId` for. */
const DevicePairSetupStatusParamsSchema = closedObject({ setupId: SetupIdSchema });
closedObject({
	completion: Type.Optional(DevicePairSetupCompletedEventSchema),
	deliveryUncertain: Type.Optional(DevicePairSetupDeliveryUncertainEventSchema)
});
const SetupCodeQrDataUrlSchema = Type.String({
	maxLength: 16384,
	pattern: "^data:image/png;base64,"
});
/**
* Generates a device-pairing setup code (and optional QR) so a mobile/companion
* client can scan it and connect to this gateway. The embedded setup code mints
* a short-lived bootstrap token that defaults to full native-mobile operator
* access, so this method requires operator.admin
* (enforced by the core method descriptor's method-scope policy, not the handler)
* and is not advertised. `bootstrapProfile: "limited"` omits operator.admin;
* `bootstrapProfile: "node"` narrows the handoff to a node role with no operator
* scopes for companion devices such as watchOS.
*/
const DevicePairSetupCodeParamsSchema = closedObject({
	publicUrl: Type.Optional(NonEmptyString),
	preferRemoteUrl: Type.Optional(Type.Boolean()),
	includeQr: Type.Optional(Type.Boolean()),
	bootstrapProfile: Type.Optional(Type.String({ enum: [
		"limited",
		"node",
		"voice-node"
	] })),
	joinUrl: Type.Optional(Type.Literal(true))
});
closedObject({
	setupId: Type.Optional(SetupIdSchema),
	setupCode: NonEmptyString,
	joinUrl: Type.Optional(NonEmptyString),
	qrDataUrl: Type.Optional(SetupCodeQrDataUrlSchema),
	gatewayUrl: NonEmptyString,
	gatewayUrls: Type.Optional(Type.Array(NonEmptyString, {
		minItems: 2,
		maxItems: 8,
		uniqueItems: true
	})),
	auth: Type.Union([
		Type.Literal("token"),
		Type.Literal("password"),
		Type.Literal("trusted-proxy")
	]),
	urlSource: NonEmptyString,
	access: Type.Optional(Type.Union([
		Type.Literal("full"),
		Type.Literal("limited"),
		Type.Literal("node")
	])),
	accessDowngraded: Type.Optional(Type.Boolean()),
	expiresAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
//#endregion
//#region packages/gateway-protocol/src/schema/desktop.ts
const DesktopSourceSchema = Type.Union([
	closedObject({ kind: Type.Literal("host") }),
	closedObject({
		kind: Type.Literal("environment"),
		environmentId: NonEmptyString
	}),
	closedObject({
		kind: Type.Literal("node"),
		nodeId: NonEmptyString
	})
]);
const DesktopObserveCredentialsSchema = closedObject({
	username: Type.Optional(NonEmptyString),
	password: Type.Optional(NonEmptyString)
});
const DesktopObserveParamsSchema = Type.Union([
	closedObject({
		source: closedObject({ kind: Type.Literal("host") }),
		control: Type.Optional(Type.Boolean()),
		credentials: Type.Optional(DesktopObserveCredentialsSchema)
	}),
	closedObject({
		source: closedObject({
			kind: Type.Literal("environment"),
			environmentId: NonEmptyString
		}),
		control: Type.Optional(Type.Boolean())
	}),
	closedObject({
		source: closedObject({
			kind: Type.Literal("node"),
			nodeId: NonEmptyString
		}),
		control: Type.Optional(Type.Boolean()),
		credentials: Type.Optional(DesktopObserveCredentialsSchema)
	})
]);
const DesktopObserveResultSchema = closedObject({
	transport: Type.String({ enum: ["rfb"] }),
	wsPath: NonEmptyString,
	expiresAtMs: Type.Integer({ minimum: 0 }),
	control: Type.Boolean(),
	audio: Type.Optional(closedObject({
		wsPath: NonEmptyString,
		encoding: Type.Literal("pcm-s16le"),
		sampleRate: Type.Literal(48e3),
		channels: Type.Literal(2)
	})),
	audioUnavailableReason: Type.Optional(Type.Literal("setup-unavailable")),
	canResize: Type.Optional(Type.Boolean()),
	vncPassword: Type.Optional(NonEmptyString),
	auth: Type.Optional(Type.String({ enum: [
		"none",
		"vnc-password",
		"ard-account"
	] })),
	preauthenticated: Type.Optional(Type.Boolean())
});
const DesktopLaunchParamsSchema = closedObject({
	source: closedObject({
		kind: Type.Literal("environment"),
		environmentId: NonEmptyString
	}),
	app: WorkerDesktopAppIdSchema
});
const DesktopReleaseParamsSchema = closedObject({ wsPath: NonEmptyString });
const DesktopReleaseResultSchema = closedObject({ released: Type.Boolean() });
//#endregion
//#region packages/gateway-protocol/src/schema/fs.ts
const FsListDirParamsSchema = closedObject({
	/** Absolute directory to list; for non-admin Gateway callers, omission means the first configured agent workspace. */
	path: Type.Optional(NonEmptyString),
	/** Connected node host to browse; omitted means the Gateway host. */
	nodeId: Type.Optional(NonEmptyString)
});
const FsDirEntrySchema = closedObject({
	name: NonEmptyString,
	path: NonEmptyString,
	/** Dot-prefixed directories; clients render them dimmed after visible ones. */
	hidden: Type.Optional(Type.Boolean())
});
const FsListDirResultSchema = closedObject({
	/** Resolved absolute path that was listed. */
	path: NonEmptyString,
	/** Absent at the filesystem root. */
	parent: Type.Optional(NonEmptyString),
	/** Selected host's home directory, for the picker's "home" shortcut. */
	home: NonEmptyString,
	entries: Type.Array(FsDirEntrySchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/hooks.ts
/** Request payload for one agent's live Gateway hook status report. */
const HooksStatusParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
//#endregion
//#region packages/gateway-protocol/src/schema/push.ts
/**
* Push-notification protocol schemas.
*
* APNS test schemas exercise native push routing; Web Push schemas describe the
* browser subscription lifecycle exposed by the gateway.
*/
const ApnsEnvironmentSchema = Type.String({ enum: ["sandbox", "production"] });
/** Request payload for sending a test APNS notification to one node. */
const PushTestParamsSchema = closedObject({
	nodeId: NonEmptyString,
	title: Type.Optional(Type.String()),
	body: Type.Optional(Type.String()),
	environment: Type.Optional(ApnsEnvironmentSchema)
});
/** Result payload from an APNS push test, including provider status and transport. */
const PushTestResultSchema = closedObject({
	ok: Type.Boolean(),
	status: Type.Integer(),
	apnsId: Type.Optional(Type.String()),
	reason: Type.Optional(Type.String()),
	tokenSuffix: Type.String(),
	topic: Type.String(),
	environment: ApnsEnvironmentSchema,
	transport: Type.String({ enum: ["direct", "relay"] })
});
const WebPushKeysSchema = closedObject({
	p256dh: Type.String({
		minLength: 1,
		maxLength: 512
	}),
	auth: Type.String({
		minLength: 1,
		maxLength: 512
	})
});
Type.String({ enum: [
	"approval-requested",
	"agent-finished",
	"agent-question",
	"human-mentioned",
	"scheduled-task-failed"
] });
const WebPushDetailLevelSchema = Type.String({ enum: [
	"private",
	"identified",
	"detailed"
] });
const WebPushCategoryPreferencesSchema = closedObject({
	approvalRequested: Type.Boolean(),
	agentFinished: Type.Boolean(),
	agentQuestion: Type.Boolean(),
	humanMentioned: Type.Optional(Type.Boolean()),
	scheduledTaskFailed: Type.Boolean()
});
const WebPushQuietHoursSchema = closedObject({
	enabled: Type.Boolean(),
	startMinute: Type.Integer({
		minimum: 0,
		maximum: 1439
	}),
	endMinute: Type.Integer({
		minimum: 0,
		maximum: 1439
	}),
	timeZone: Type.String({
		minLength: 1,
		maxLength: 128
	})
});
const WebPushNotificationPreferencesSchema = closedObject({
	categories: WebPushCategoryPreferencesSchema,
	detailLevel: WebPushDetailLevelSchema,
	quietHours: WebPushQuietHoursSchema,
	agentIds: Type.Array(Type.String({
		minLength: 1,
		maxLength: 128
	}), { maxItems: 128 })
});
const WebPushDevicePreferencesSchema = closedObject({
	enabled: Type.Boolean(),
	label: Type.String({ maxLength: 80 }),
	categories: Type.Optional(closedObject({
		approvalRequested: Type.Optional(Type.Boolean()),
		agentFinished: Type.Optional(Type.Boolean()),
		agentQuestion: Type.Optional(Type.Boolean()),
		humanMentioned: Type.Optional(Type.Boolean()),
		scheduledTaskFailed: Type.Optional(Type.Boolean())
	})),
	detailLevel: Type.Optional(WebPushDetailLevelSchema),
	quietHours: Type.Optional(WebPushQuietHoursSchema),
	agentIds: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 128
	}), { maxItems: 128 }))
});
/** Empty request payload for fetching the Web Push VAPID public key. */
const WebPushVapidPublicKeyParamsSchema = closedObject({});
/** Browser Web Push subscription payload registered with the gateway. */
const WebPushSubscribeParamsSchema = closedObject({
	endpoint: Type.String({
		minLength: 1,
		maxLength: 2048,
		pattern: "^https://"
	}),
	keys: WebPushKeysSchema
});
/** Browser Web Push endpoint removal payload. */
const WebPushUnsubscribeParamsSchema = closedObject({ endpoint: Type.String({
	minLength: 1,
	maxLength: 2048,
	pattern: "^https://"
}) });
/** Request payload for sending a test Web Push notification to current subscriptions. */
const WebPushTestParamsSchema = closedObject({
	title: Type.Optional(Type.String()),
	body: Type.Optional(Type.String())
});
const WebPushPreferencesGetParamsSchema = closedObject({ endpoint: Type.String({
	minLength: 1,
	maxLength: 2048,
	pattern: "^https://"
}) });
const WebPushPreferencesEndpointSchema = Type.String({
	minLength: 1,
	maxLength: 2048,
	pattern: "^https://"
});
const WebPushPreferencesSetParamsSchema = Type.Union([closedObject({
	endpoint: WebPushPreferencesEndpointSchema,
	scope: Type.Literal("user"),
	preferences: WebPushNotificationPreferencesSchema
}), closedObject({
	endpoint: WebPushPreferencesEndpointSchema,
	scope: Type.Literal("device"),
	preferences: WebPushDevicePreferencesSchema
})]);
//#endregion
//#region packages/gateway-protocol/src/schema/questions.ts
const QuestionIdSchema = Type.String({ pattern: "^[a-z][a-z0-9_]*$" });
const QuestionResolutionIdSchema = withSince("2026.8", Type.String({
	minLength: 1,
	maxLength: 128
}));
const QuestionHeaderSchema = Type.String({ maxLength: 12 });
const QuestionSecretStoreAllowedHostsSchema = Type.Array(Type.String({
	minLength: 1,
	maxLength: 253
}), {
	maxItems: 128,
	uniqueItems: true
});
const QuestionResourcePreviewSchema = Type.Union([closedObject({
	type: Type.Literal("mcp_app_tool"),
	name: NonEmptyString,
	arguments: Type.Optional(Type.Record(Type.String(), Type.Unknown()))
}), closedObject({
	type: Type.Literal("resource_link"),
	uri: NonEmptyString,
	name: NonEmptyString,
	title: Type.Optional(Type.String()),
	description: Type.Optional(Type.String()),
	mimeType: Type.Optional(Type.String())
})]);
const QuestionResourceInputSchema = closedObject({
	viewId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	selection: Type.Union([Type.Literal("explicit"), Type.Literal("implicit")]),
	userOptions: Type.Optional(closedObject({
		kind: Type.Union([Type.Literal("file"), Type.Literal("directory")]),
		accept: Type.Optional(Type.Array(Type.String({ maxLength: 128 }), { maxItems: 32 }))
	}))
});
const QuestionOptionSchema = closedObject({
	label: NonEmptyString,
	description: Type.Optional(Type.String()),
	value: Type.Optional(withSince("2026.9", Type.String({
		minLength: 1,
		maxLength: 4096
	}))),
	thumbnail: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 65536
	})),
	resourceUri: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 2048
	})),
	preview: Type.Optional(QuestionResourcePreviewSchema)
});
const QuestionSecretStoreBindingSchema = closedObject({
	name: Type.String({
		minLength: 1,
		maxLength: 128,
		pattern: "^[A-Z][A-Z0-9_]{0,127}$"
	}),
	kind: Type.Union([Type.Literal("secret"), Type.Literal("env")]),
	allowedHosts: Type.Optional(QuestionSecretStoreAllowedHostsSchema),
	reason: Type.Optional(Type.String({ maxLength: 200 }))
});
const QuestionSecretStoreExistingSchema = closedObject({
	updatedAtMs: Type.Integer({ minimum: 0 }),
	updatedBy: Type.Optional(NonEmptyString)
});
const QuestionInputFields = {
	questionId: QuestionIdSchema,
	header: QuestionHeaderSchema,
	question: NonEmptyString,
	url: Type.Optional(withSince("2026.8", Type.String({
		minLength: 1,
		maxLength: 2048
	}))),
	options: Type.Array(QuestionOptionSchema, { maxItems: 64 }),
	presentation: Type.Optional(Type.Literal("form")),
	resource: Type.Optional(QuestionResourceInputSchema),
	multiSelect: Type.Optional(Type.Boolean()),
	answerFormat: Type.Optional(Type.Literal("lines")),
	allowEmpty: Type.Optional(Type.Boolean()),
	defaultAnswers: Type.Optional(Type.Array(Type.String({ maxLength: 4096 }), { maxItems: 64 })),
	isOther: Type.Optional(Type.Boolean()),
	isSecret: Type.Optional(Type.Boolean()),
	secretStore: Type.Optional(withSince("2026.8", QuestionSecretStoreBindingSchema))
};
/** Unnormalized question accepted by question.request. */
const QuestionRequestQuestionSchema = closedObject(QuestionInputFields);
const QuestionFields = {
	...QuestionInputFields,
	secretStoreExisting: Type.Optional(withSince("2026.8", QuestionSecretStoreExistingSchema))
};
/** Canonical normalized question shown to an operator. */
const QuestionSchema = closedObject(QuestionFields);
const QuestionAnswersSchema = closedObject({ answers: Type.Record(QuestionIdSchema, Type.Array(Type.String())) });
const QuestionStatusSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("answered"),
	Type.Literal("cancelled"),
	Type.Literal("expired")
]);
/**
* One pending or recently resolved transient question request. Flat object with
* optional terminal fields (exec-approval record precedent): native protocol
* codegen cannot emit per-status object unions, and the manager owns the
* status/answers invariant (answers present only when status is "answered").
*/
const QuestionRecordSchema = closedObject({
	id: NonEmptyString,
	questions: Type.Array(QuestionSchema, {
		minItems: 1,
		maxItems: 3
	}),
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	createdAtMs: Type.Integer({ minimum: 0 }),
	expiresAtMs: Type.Integer({ minimum: 0 }),
	status: QuestionStatusSchema,
	answers: Type.Optional(QuestionAnswersSchema),
	resolvedBy: Type.Optional(NonEmptyString)
});
const QuestionRequestParamsSchema = closedObject({
	id: Type.Optional(NonEmptyString),
	questions: Type.Array(QuestionRequestQuestionSchema, {
		minItems: 1,
		maxItems: 3
	}),
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 }))
});
const QuestionRequestResultSchema = closedObject({
	id: NonEmptyString,
	expiresAtMs: Type.Integer({ minimum: 0 })
});
const QuestionWaitAnswerParamsSchema = closedObject({
	id: NonEmptyString,
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
	includeResolutionId: Type.Optional(withSince("2026.8", Type.Boolean()))
});
const QuestionWaitAnswerResultSchema = Type.Union([
	closedObject({ status: Type.Literal("pending") }),
	closedObject({
		status: Type.Literal("answered"),
		answers: QuestionAnswersSchema,
		resolutionId: Type.Optional(QuestionResolutionIdSchema)
	}),
	closedObject({ status: Type.Literal("cancelled") }),
	closedObject({ status: Type.Literal("expired") })
]);
const QuestionResolveParamsSchema = Type.Union([closedObject({
	id: NonEmptyString,
	answers: QuestionAnswersSchema,
	secretStoreAllowedHosts: Type.Optional(withSince("2026.8", QuestionSecretStoreAllowedHostsSchema)),
	resolvedBy: Type.Optional(NonEmptyString),
	resolutionId: Type.Optional(QuestionResolutionIdSchema)
}), closedObject({
	id: NonEmptyString,
	cancel: Type.Literal(true),
	resolvedBy: Type.Optional(NonEmptyString)
})]);
const QuestionResolveResultSchema = Type.Union([closedObject({
	status: Type.Literal("answered"),
	answers: QuestionAnswersSchema
}), closedObject({ status: Type.Literal("cancelled") })]);
const QuestionGetParamsSchema = closedObject({ id: NonEmptyString });
const QuestionGetResultSchema = closedObject({ question: QuestionRecordSchema });
const QuestionListParamsSchema = closedObject({});
const QuestionListResultSchema = closedObject({ questions: Type.Array(QuestionRecordSchema) });
const QuestionRequestedEventSchema = withSince("2026.7", QuestionRecordSchema);
const QuestionResolvedEventSchema = withSince("2026.7", Type.Union([
	closedObject({
		id: NonEmptyString,
		status: Type.Literal("answered"),
		answers: QuestionAnswersSchema
	}),
	closedObject({
		id: NonEmptyString,
		status: Type.Literal("cancelled")
	}),
	closedObject({
		id: NonEmptyString,
		status: Type.Literal("expired")
	})
]));
//#endregion
//#region packages/gateway-protocol/src/schema/session-discussion.ts
const SessionDiscussionStateSchema = Type.Union([
	Type.Literal("none"),
	Type.Literal("available"),
	Type.Literal("open")
]);
const SessionDiscussionInfoSchema = closedObject({
	state: SessionDiscussionStateSchema,
	embedUrl: Type.Optional(Type.String()),
	openUrl: Type.Optional(Type.String())
});
const SessionDiscussionInfoParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const SessionDiscussionOpenParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const SessionDiscussionInfoResultSchema = SessionDiscussionInfoSchema;
const SessionDiscussionOpenResultSchema = SessionDiscussionInfoSchema;
/** Replaces the sessions this connection is currently rendering. */
const SessionsViewerPresenceSetParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKeys: Type.Array(ChatSendSessionKeyString, { maxItems: 32 })
});
closedObject({ sessionKeys: Type.Array(ChatSendSessionKeyString, { maxItems: 32 }) });
//#endregion
//#region packages/gateway-protocol/src/schema/system-info.ts
/** Empty request payload for Gateway host system information. */
const SystemInfoParamsSchema = closedObject({});
/** Where utility completions execute; absent when no owner can serve them. */
const UtilityModelRuntimeSchema = Type.Optional(GatewayCompletionRouteSchema);
const UtilityModelStatusSchema = Type.Union([
	closedObject({
		status: Type.Literal("auto"),
		model: Type.String({ minLength: 1 }),
		runtime: UtilityModelRuntimeSchema
	}),
	closedObject({
		status: Type.Literal("configured"),
		model: Type.String({ minLength: 1 }),
		runtime: UtilityModelRuntimeSchema
	}),
	closedObject({ status: Type.Literal("disabled") }),
	closedObject({ status: Type.Literal("unavailable") })
]);
/** Gateway host identity and resource snapshot. */
const SystemInfoResultSchema = closedObject({
	machineName: Type.String(),
	hostname: Type.String(),
	platform: Type.String(),
	release: Type.String(),
	arch: Type.String(),
	osLabel: Type.String(),
	lanAddress: Type.Optional(Type.String()),
	port: Type.Optional(Type.Integer()),
	nodeVersion: Type.String(),
	pid: Type.Integer(),
	/** Process-start identity for invalidating work that cannot survive a Gateway restart. */
	processInstanceId: Type.Optional(Type.String({ minLength: 1 })),
	uptimeMs: Type.Integer(),
	cpuCount: Type.Integer(),
	cpuModel: Type.Optional(Type.String()),
	loadAverage: Type.Optional(Type.Tuple([
		Type.Number(),
		Type.Number(),
		Type.Number()
	])),
	memoryTotalBytes: Type.Integer(),
	memoryFreeBytes: Type.Integer(),
	eventLoop: Type.Optional(GatewayEventLoopHealthSchema),
	processMemory: Type.Optional(GatewayProcessMemorySchema),
	diskTotalBytes: Type.Optional(Type.Integer()),
	diskAvailableBytes: Type.Optional(Type.Integer()),
	diskPath: Type.Optional(Type.String()),
	disks: Type.Optional(Type.Array(closedObject({
		path: Type.String({ minLength: 1 }),
		totalBytes: Type.Integer({ minimum: 1 }),
		availableBytes: Type.Integer({ minimum: 0 })
	}))),
	/** Resolved utility model for the configured default agent. */
	defaultAgentUtilityModel: Type.Optional(UtilityModelStatusSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/task-suggestions.ts
const TaskIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const TaskTitleSchema = Type.String({
	minLength: 1,
	maxLength: 60,
	pattern: "\\S"
});
const TaskPromptSchema = Type.String({
	minLength: 1,
	maxLength: 32768,
	pattern: "\\S"
});
const TaskTldrSchema = Type.String({
	minLength: 1,
	maxLength: 1024,
	pattern: "\\S"
});
const TaskCwdSchema = Type.String({
	minLength: 1,
	maxLength: 4096
});
const TaskSessionKeySchema = Type.String({
	minLength: 1,
	maxLength: 512
});
const TaskAgentIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const TaskSuggestionAcceptanceModeSchema = Type.Enum({
	WORKTREE: "worktree",
	LOCAL: "local",
	CLOUD: "cloud",
	SESSION: "session"
}, { type: "string" });
/** One model-proposed follow-up task waiting for operator action. */
const TaskSuggestionSchema = closedObject({
	id: TaskIdSchema,
	title: TaskTitleSchema,
	prompt: TaskPromptSchema,
	tldr: TaskTldrSchema,
	cwd: TaskCwdSchema,
	sessionKey: TaskSessionKeySchema,
	agentId: Type.Optional(TaskAgentIdSchema),
	createdAt: Type.Integer({ minimum: 0 })
});
/** Lists pending suggestions, optionally narrowed to one source session. */
const TaskSuggestionsListParamsSchema = closedObject({
	sessionKey: Type.Optional(TaskSessionKeySchema),
	agentId: Type.Optional(TaskAgentIdSchema)
});
const TaskSuggestionsListResultSchema = closedObject({ suggestions: Type.Array(TaskSuggestionSchema) });
/** Creates a pending suggestion without starting any work. */
const TaskSuggestionsCreateParamsSchema = closedObject({
	title: TaskTitleSchema,
	prompt: TaskPromptSchema,
	tldr: TaskTldrSchema,
	cwd: TaskCwdSchema,
	sessionKey: TaskSessionKeySchema,
	agentId: Type.Optional(TaskAgentIdSchema)
});
const TaskSuggestionsCreateResultSchema = closedObject({
	taskId: TaskIdSchema,
	suggestion: TaskSuggestionSchema
});
const TaskSuggestionResolutionSchema = Type.Union([
	Type.Literal("dismissed"),
	Type.Literal("accepted"),
	Type.Literal("expired")
]);
/** Atomically claims a pending suggestion and starts it in the requested execution mode. */
const TaskSuggestionsAcceptParamsSchema = closedObject({
	taskId: TaskIdSchema,
	mode: Type.Optional(TaskSuggestionAcceptanceModeSchema),
	cloudProfileId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	/** Explicit repository correction when starting a new worktree. */
	cwd: Type.Optional(TaskCwdSchema)
});
const TaskSuggestionsAcceptResultSchema = closedObject({
	taskId: TaskIdSchema,
	key: TaskSessionKeySchema
});
/** Removes a pending suggestion without starting work. */
const TaskSuggestionsDismissParamsSchema = closedObject({
	taskId: TaskIdSchema,
	reason: Type.Optional(Type.String({ maxLength: 1024 }))
});
const TaskSuggestionsDismissResultSchema = closedObject({
	taskId: TaskIdSchema,
	dismissed: Type.Boolean()
});
/** Live update emitted when a pending suggestion is created or resolved. */
const TaskSuggestionEventSchema = Type.Union([closedObject({
	action: Type.Literal("created"),
	suggestion: TaskSuggestionSchema
}), closedObject({
	action: Type.Literal("resolved"),
	taskId: TaskIdSchema,
	resolution: TaskSuggestionResolutionSchema
})]);
//#endregion
//#region packages/gateway-protocol/src/schema/plugin-approvals.ts
/**
* Plugin approval schemas.
*
* These payloads cross from plugin/tool execution into reviewer-facing UI, so
* title, description, decision set, and timeout limits are part of the public
* gateway contract.
*/
const MAX_PLUGIN_APPROVAL_TIMEOUT_MS = 6e5;
const PLUGIN_APPROVAL_TITLE_MAX_LENGTH = 80;
const PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH = 512;
function nullableMetadata(schema) {
	return Type.Unsafe({
		...schema,
		type: [schema.type, "null"],
		...schema.enum ? { enum: [...schema.enum, null] } : {}
	});
}
/** Approval request raised by a plugin before a sensitive tool action proceeds. */
const PluginApprovalRequestParamsSchema = closedObject({
	pluginId: Type.Optional(nullableMetadata(NonEmptyString)),
	title: Type.String({
		minLength: 1,
		maxLength: PLUGIN_APPROVAL_TITLE_MAX_LENGTH
	}),
	description: Type.String({
		minLength: 1,
		maxLength: PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH
	}),
	detail: Type.Optional(nullableMetadata(Type.String({
		minLength: 1,
		maxLength: 16384,
		description: "Reviewer-surface-only detail; not delivered to channels or push notifications."
	}))),
	severity: Type.Optional(nullableMetadata(Type.String({ enum: [
		"info",
		"warning",
		"critical"
	] }))),
	scope: Type.Optional(Type.Unsafe({
		...ApprovalScopeSchema,
		type: ["object", "null"],
		anyOf: [...ApprovalScopeSchema.anyOf, Type.Null()]
	})),
	toolName: Type.Optional(nullableMetadata(Type.String())),
	toolCallId: Type.Optional(nullableMetadata(Type.String())),
	policySubject: Type.Optional(closedObject({
		pluginKey: NonEmptyString,
		tool: Type.Optional(NonEmptyString)
	})),
	mcpTool: Type.Optional(closedObject({
		server: Type.String({
			minLength: 1,
			pattern: "\\S"
		}),
		tool: Type.String({
			minLength: 1,
			pattern: "\\S"
		})
	})),
	allowedDecisions: Type.Optional(nullableMetadata(Type.Array(Type.String({ enum: [
		"allow-once",
		"allow-always",
		"deny"
	] }), {
		minItems: 1,
		maxItems: 3
	}))),
	agentId: Type.Optional(nullableMetadata(Type.String())),
	sessionKey: Type.Optional(nullableMetadata(Type.String())),
	approvalReviewerDeviceIds: Type.Optional(nullableMetadata(Type.Array(NonEmptyString, { description: "Trusted approval-runtime metadata naming operator devices that may review this approval; ordinary Gateway clients may send the field, but the Gateway only binds it for internal approval-runtime requests." }))),
	turnSourceChannel: Type.Optional(nullableMetadata(Type.String())),
	turnSourceTo: Type.Optional(nullableMetadata(Type.String())),
	turnSourceAccountId: Type.Optional(nullableMetadata(Type.String())),
	turnSourceThreadId: Type.Optional(Type.Union([
		Type.String(),
		Type.Number(),
		Type.Null()
	])),
	timeoutMs: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: MAX_PLUGIN_APPROVAL_TIMEOUT_MS
	})),
	twoPhase: Type.Optional(Type.Boolean())
});
/** Reviewer decision payload resolving one pending plugin approval request. */
const PluginApprovalResolveParamsSchema = closedObject({
	id: NonEmptyString,
	decision: NonEmptyString,
	reviewer: Type.Optional(ApprovalChannelReviewerSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/portals.ts
const PortalSummaryIdentityFields = {
	id: NonEmptyString,
	title: NonEmptyString,
	port: Type.Integer({
		minimum: 1,
		maximum: 65535
	}),
	listenPort: Type.Integer({
		minimum: 1,
		maximum: 65535
	})
};
const PortalSummaryMetadataFields = {
	publicUrl: NonEmptyString,
	path: Type.Optional(Type.String({ pattern: "^/" })),
	description: Type.Optional(Type.String()),
	origin: Type.Optional(Type.String()),
	createdAtMs: Type.Integer({ minimum: 0 })
};
const PortalSummarySchema = closedObject({
	...PortalSummaryIdentityFields,
	tokenQuery: Type.Optional(NonEmptyString),
	url: Type.Optional(NonEmptyString),
	...PortalSummaryMetadataFields
});
const PortalEnvironmentFields = { environmentId: Type.Optional(NonEmptyString) };
const PortalListParamsSchema = closedObject({ ...PortalEnvironmentFields });
const PortalListResultSchema = closedObject({ portals: Type.Array(PortalSummarySchema) });
const PortalOpenParamsSchema = closedObject({
	...PortalEnvironmentFields,
	port: Type.Integer({
		minimum: 1,
		maximum: 65535
	}),
	title: Type.Optional(NonEmptyString),
	description: Type.Optional(Type.String()),
	path: Type.Optional(Type.String({ pattern: "^/" }))
});
const PortalOpenResultSchema = closedObject({
	...PortalSummaryIdentityFields,
	tokenQuery: NonEmptyString,
	url: NonEmptyString,
	...PortalSummaryMetadataFields
});
const PortalCloseParamsSchema = closedObject({
	id: NonEmptyString,
	...PortalEnvironmentFields
});
const PortalCloseResultSchema = closedObject({ closed: Type.Boolean() });
const SessionPortalFields = {
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	environmentId: NonEmptyString
};
const SessionPortalListParamsSchema = closedObject(SessionPortalFields);
const SessionPortalOpenParamsSchema = closedObject({
	...PortalOpenParamsSchema.properties,
	...SessionPortalFields
});
const SessionPortalCloseParamsSchema = closedObject({
	...PortalCloseParamsSchema.properties,
	...SessionPortalFields
});
const PortalChangedEventSchema = closedObject({ portals: Type.Array(PortalSummarySchema) });
//#endregion
//#region packages/gateway-protocol/src/schema/worktrees.ts
const WorktreeNameSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9-]{0,63}$" });
const WorktreeOidSchema = Type.String({ pattern: "^[a-f0-9]{40}(?:[a-f0-9]{24})?$" });
const WorktreeExactStateSchema = closedObject({
	ownerKind: Type.Union([
		Type.Literal("manual"),
		Type.Literal("session"),
		Type.Literal("workboard")
	]),
	ownerId: Type.Optional(Type.String()),
	createdAt: Type.Number(),
	lastActiveAt: Type.Number(),
	head: WorktreeOidSchema,
	branchHead: WorktreeOidSchema,
	indexSha256: Type.String({ pattern: "^[a-f0-9]{64}$" })
});
const WorktreeRunEndCleanupSchema = Type.Union([closedObject({
	outcome: Type.String({ enum: [
		"removed-lossless",
		"retained-busy",
		"retained-dirty",
		"retained-unpushed",
		"retained-provisioned-drift"
	] }),
	at: Type.Integer({ minimum: 0 })
}), closedObject({
	outcome: Type.Literal("failed"),
	at: Type.Integer({ minimum: 0 }),
	reason: Type.String({
		minLength: 1,
		maxLength: 500
	})
})]);
const WorktreeRecordSchema = closedObject({
	id: NonEmptyString,
	name: WorktreeNameSchema,
	repoFingerprint: Type.String({ pattern: "^[a-f0-9]{16}$" }),
	repoRoot: NonEmptyString,
	path: NonEmptyString,
	branch: NonEmptyString,
	baseRef: NonEmptyString,
	ownerKind: Type.String({ enum: [
		"manual",
		"workboard",
		"session"
	] }),
	ownerId: Type.Optional(NonEmptyString),
	snapshotRef: Type.Optional(NonEmptyString),
	createdAt: Type.Integer({ minimum: 0 }),
	lastActiveAt: Type.Integer({ minimum: 0 }),
	removedAt: Type.Optional(Type.Integer({ minimum: 0 })),
	runEndCleanup: Type.Optional(WorktreeRunEndCleanupSchema),
	gcProtection: Type.Optional(NonEmptyString)
});
const WorktreesListParamsSchema = closedObject({});
const WorktreesListResultSchema = closedObject({ worktrees: Type.Array(WorktreeRecordSchema) });
const WorktreesCreateParamsSchema = closedObject({
	repoRoot: NonEmptyString,
	name: Type.Optional(WorktreeNameSchema),
	baseRef: Type.Optional(NonEmptyString),
	profiles: Type.Optional(Type.Array(NonEmptyString)),
	expectedOwnerId: Type.Optional(NonEmptyString),
	expectedRepoIdentity: Type.Optional(NonEmptyString)
});
const WorktreesRemoveParamsSchema = closedObject({
	id: NonEmptyString,
	force: Type.Optional(Type.Boolean()),
	ifLossless: Type.Optional(Type.Boolean()),
	exactState: Type.Optional(WorktreeExactStateSchema),
	expectedOwnerId: Type.Optional(NonEmptyString)
});
const WorktreesRemoveResultSchema = closedObject({
	removed: Type.Boolean(),
	snapshotRef: Type.Optional(NonEmptyString),
	/** Why the pre-removal snapshot failed; removal may have stopped or continued without one. */
	snapshotError: Type.Optional(NonEmptyString),
	recoveryPath: Type.Optional(NonEmptyString),
	recoveryRetainedUntil: Type.Optional(Type.Integer({ minimum: 0 })),
	cleanup: Type.Optional(WorktreeRunEndCleanupSchema)
});
const WorktreeRepositoryStatusSchema = Type.String({ enum: [...[
	"git",
	"not_git",
	"unavailable"
]] });
const WorktreesBranchesParamsSchema = closedObject({
	repoRoot: NonEmptyString,
	includeRepositoryStatus: Type.Optional(Type.Boolean())
});
const WorktreeBranchSchema = closedObject({
	name: NonEmptyString,
	kind: Type.Union([Type.Literal("local"), Type.Literal("remote")])
});
const WorktreesBranchesResultSchema = closedObject({
	branches: Type.Array(WorktreeBranchSchema),
	defaultBranch: Type.Optional(NonEmptyString),
	headBranch: Type.Optional(NonEmptyString),
	repositoryStatus: Type.Optional(WorktreeRepositoryStatusSchema),
	branchesUnavailable: Type.Optional(Type.Boolean())
});
const WorktreesRestoreParamsSchema = closedObject({
	id: NonEmptyString,
	recoverExactState: Type.Optional(WorktreeExactStateSchema),
	expectedOwnerId: Type.Optional(NonEmptyString)
});
const WorktreesGcParamsSchema = closedObject({ expectedOwnerId: Type.Optional(NonEmptyString) });
const WorktreesGcResultSchema = closedObject({
	removed: Type.Array(NonEmptyString),
	orphansDeleted: Type.Integer({ minimum: 0 }),
	snapshotsPruned: Type.Integer({ minimum: 0 }),
	orphansRetired: Type.Optional(Type.Integer({ minimum: 0 })),
	retiredCheckoutPaths: Type.Optional(Type.Array(NonEmptyString)),
	outcome: Type.Optional(Type.String({ enum: [
		"completed",
		"deferred",
		"partial"
	] })),
	issues: Type.Optional(Type.Array(closedObject({
		id: Type.Optional(NonEmptyString),
		stage: Type.String({ enum: [
			"idle",
			"templates",
			"limits",
			"size",
			"orphans",
			"snapshots"
		] }),
		outcome: Type.String({ enum: [
			"failed",
			"deferred",
			"retired"
		] }),
		reason: Type.String()
	}))),
	issueCount: Type.Optional(Type.Integer({ minimum: 0 })),
	protectedCount: Type.Optional(Type.Integer({ minimum: 0 })),
	protectionReasons: Type.Optional(Type.Record(Type.String(), Type.Integer({ minimum: 0 }))),
	limitsSatisfied: Type.Optional(Type.Union([Type.Boolean(), Type.Null()]))
});
const WorktreesRecoverRemovalParamsSchema = closedObject({
	id: NonEmptyString,
	snapshot: WorktreeOidSchema,
	expectedOwnerId: NonEmptyString
});
const WorktreesRecoverRemovalResultSchema = closedObject({
	removed: Type.Literal(true),
	snapshotRef: Type.Optional(NonEmptyString)
});
const WorktreesRetireSnapshotParamsSchema = closedObject({
	id: NonEmptyString,
	expectedSnapshotRef: NonEmptyString,
	expectedSnapshotOid: WorktreeOidSchema,
	expectedRemovedAt: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	retainedSourceRef: Type.String({ pattern: "^refs/(?:heads|remotes)/.+" }),
	expectedRetainedSourceOid: WorktreeOidSchema,
	expectedOwnerId: NonEmptyString
});
const WorktreesRetireSnapshotResultSchema = closedObject({
	retired: Type.Literal(true),
	id: NonEmptyString
});
//#endregion
//#region packages/gateway-protocol/src/schema/tools-catalog.ts
/** Reads the configured tool catalog for an agent. */
const ToolsCatalogParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	includePlugins: Type.Optional(Type.Boolean())
});
/** Tool profile shown in catalog views. */
const ToolCatalogProfileSchema = closedObject({
	id: Type.Union([
		Type.Literal("minimal"),
		Type.Literal("coding"),
		Type.Literal("messaging"),
		Type.Literal("full")
	]),
	label: NonEmptyString
});
/** Tool catalog entry before session-specific filtering is applied. */
const ToolCatalogEntrySchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString,
	description: Type.String(),
	source: Type.Union([Type.Literal("core"), Type.Literal("plugin")]),
	pluginId: Type.Optional(NonEmptyString),
	optional: Type.Optional(Type.Boolean()),
	risk: Type.Optional(Type.Union([
		Type.Literal("low"),
		Type.Literal("medium"),
		Type.Literal("high")
	])),
	tags: Type.Optional(Type.Array(NonEmptyString)),
	fullDescription: Type.Optional(Type.String()),
	parameters: Type.Optional(Type.Array(closedObject({
		name: NonEmptyString,
		required: Type.Boolean(),
		type: Type.Optional(NonEmptyString),
		description: Type.Optional(Type.String())
	}))),
	defaultProfiles: Type.Array(Type.Union([
		Type.Literal("minimal"),
		Type.Literal("coding"),
		Type.Literal("messaging"),
		Type.Literal("full")
	]))
});
/** Group of related catalog tools from core or a plugin. */
const ToolCatalogGroupSchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString,
	source: Type.Union([Type.Literal("core"), Type.Literal("plugin")]),
	pluginId: Type.Optional(NonEmptyString),
	tools: Type.Array(ToolCatalogEntrySchema)
});
closedObject({
	agentId: NonEmptyString,
	profiles: Type.Array(ToolCatalogProfileSchema),
	groups: Type.Array(ToolCatalogGroupSchema)
});
/** Reads the effective tool set for one session. */
const ToolsEffectiveParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: NonEmptyString
});
/** Effective tool entry after session/profile/channel/plugin filtering. */
const ToolsEffectiveEntrySchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString,
	description: Type.String(),
	rawDescription: Type.String(),
	source: Type.Union([
		Type.Literal("core"),
		Type.Literal("plugin"),
		Type.Literal("channel"),
		Type.Literal("mcp")
	]),
	pluginId: Type.Optional(NonEmptyString),
	channelId: Type.Optional(NonEmptyString),
	mcpServer: Type.Optional(NonEmptyString),
	mcpToolName: Type.Optional(NonEmptyString),
	deniedBySession: Type.Optional(Type.Literal(true)),
	risk: Type.Optional(Type.Union([
		Type.Literal("low"),
		Type.Literal("medium"),
		Type.Literal("high")
	])),
	tags: Type.Optional(Type.Array(NonEmptyString))
});
/** Effective tool group shown to runtime/session callers. */
const ToolsEffectiveGroupSchema = closedObject({
	id: Type.Union([
		Type.Literal("core"),
		Type.Literal("plugin"),
		Type.Literal("channel"),
		Type.Literal("mcp")
	]),
	label: NonEmptyString,
	source: Type.Union([
		Type.Literal("core"),
		Type.Literal("plugin"),
		Type.Literal("channel"),
		Type.Literal("mcp")
	]),
	tools: Type.Array(ToolsEffectiveEntrySchema)
});
/** Notice explaining runtime filtering such as quarantined tool schemas. */
const ToolsEffectiveNoticeSchema = closedObject({
	id: NonEmptyString,
	severity: Type.Union([Type.Literal("info"), Type.Literal("warning")]),
	message: Type.String(),
	servers: Type.Optional(Type.Array(NonEmptyString))
});
/** Effective tool set for a session, including profile and filtering notices. */
const ToolAccessDiagnosticsSchema = closedObject({
	checked: Type.Union([Type.Literal("local-config"), Type.Literal("live-session")]),
	profiles: Type.Array(closedObject({
		profile: NonEmptyString,
		source: NonEmptyString,
		active: Type.Boolean()
	})),
	tools: Type.Array(closedObject({
		id: NonEmptyString,
		status: Type.Union([
			Type.Literal("allowed"),
			Type.Literal("excluded"),
			Type.Literal("available"),
			Type.Literal("unavailable")
		]),
		reasons: Type.Array(closedObject({
			kind: Type.Union([
				Type.Literal("profile"),
				Type.Literal("deny"),
				Type.Literal("allowlist"),
				Type.Literal("session"),
				Type.Literal("runtime")
			]),
			label: NonEmptyString,
			source: Type.Optional(NonEmptyString),
			profile: Type.Optional(NonEmptyString)
		})),
		alsoAllowPath: Type.Optional(NonEmptyString)
	}))
});
closedObject({
	agentId: NonEmptyString,
	profile: NonEmptyString,
	groups: Type.Array(ToolsEffectiveGroupSchema),
	notices: Type.Optional(Type.Array(ToolsEffectiveNoticeSchema)),
	toolAccess: Type.Optional(ToolAccessDiagnosticsSchema)
});
//#endregion
//#region packages/gateway-protocol/src/validator-registry.ts
const validateCommandsListParams = /* @__PURE__ */ lazyCompile(CommandsListParamsSchema);
const validateBackupStatusParams = /* @__PURE__ */ lazyCompile(BackupStatusParamsSchema);
const validateStorageLocationsListParams = /* @__PURE__ */ lazyCompile(StorageLocationsListParamsSchema);
const validateStorageLocationsProbeParams = /* @__PURE__ */ lazyCompile(StorageLocationsProbeParamsSchema);
const validateComputerStatusParams = /* @__PURE__ */ lazyCompile(ComputerStatusParamsSchema);
const validateComputerInvokeParams = /* @__PURE__ */ lazyCompile(ComputerInvokeParamsSchema);
const validateCanvasDocumentPreviewParams = /* @__PURE__ */ lazyCompile(CanvasDocumentPreviewParamsSchema);
const validateCanvasDocumentViewParams = /* @__PURE__ */ lazyCompile(CanvasDocumentViewParamsSchema);
const validateConnectParams = /* @__PURE__ */ lazyCompile(ConnectParamsSchema);
const validateWorkerAdmissionHandshake = /* @__PURE__ */ lazyCompile(WorkerAdmissionHandshakeSchema);
const validateWorkerConnectRequestFrame = /* @__PURE__ */ lazyCompile(WorkerConnectRequestFrameSchema);
const validateWorkerHeartbeatParams = /* @__PURE__ */ lazyCompile(WorkerHeartbeatParamsSchema);
const validateWorkerSessionsSpawnParams = /* @__PURE__ */ lazyCompile(WorkerSessionsSpawnParamsSchema);
const validateWorkerSessionsSendParams = /* @__PURE__ */ lazyCompile(WorkerSessionsSendParamsSchema);
const validateWorkerPortalParams = /* @__PURE__ */ lazyCompile(WorkerPortalParamsSchema);
const validateWorkerPresenceParams = /* @__PURE__ */ lazyCompile(WorkerPresenceParamsSchema);
const validateWorkerComputerParams = /* @__PURE__ */ lazyCompile(WorkerComputerParamsSchema);
const validateWorkerTranscriptCommitParams = /* @__PURE__ */ lazyCompile(WorkerTranscriptCommitParamsSchema, checkWorkerProtocolJson);
const validateWorkerLiveEventParams = /* @__PURE__ */ lazyCompile(WorkerLiveEventParamsSchema, checkWorkerProtocolJson);
const validateGatewaySuspendPrepareParams = /* @__PURE__ */ lazyCompile(GatewaySuspendPrepareParamsSchema);
const validateGatewaySuspendPrepareResult = /* @__PURE__ */ lazyCompile(GatewaySuspendPrepareResultSchema);
const validateGatewaySuspendStatusParams = /* @__PURE__ */ lazyCompile(GatewaySuspendStatusParamsSchema);
const validateGatewaySuspendStatusResult = /* @__PURE__ */ lazyCompile(GatewaySuspendStatusResultSchema);
const validateGatewaySuspendResumeParams = /* @__PURE__ */ lazyCompile(GatewaySuspendResumeParamsSchema);
const validateGatewaySuspendHandoffParams = /* @__PURE__ */ lazyCompile(GatewaySuspendHandoffParamsSchema);
const validateRequestFrame = /* @__PURE__ */ lazyCompile(RequestFrameSchema);
const validateMessageActionParams = /* @__PURE__ */ lazyCompile(MessageActionParamsSchema);
const validateSendParams = /* @__PURE__ */ lazyCompile(SendParamsSchema);
const validateConversationListParams = /* @__PURE__ */ lazyCompile(ConversationListParamsSchema);
const validateConversationSendParams = /* @__PURE__ */ lazyCompile(ConversationSendParamsSchema);
const validateConversationTurnCancelParams = /* @__PURE__ */ lazyCompile(ConversationTurnCancelParamsSchema);
const validateConversationTurnParams = /* @__PURE__ */ lazyCompile(ConversationTurnParamsSchema);
const validatePollParams = /* @__PURE__ */ lazyCompile(PollParamsSchema);
const validateAgentParams = /* @__PURE__ */ lazyCompile(AgentParamsSchema);
const validateAuditActivityListParams = /* @__PURE__ */ lazyCompile(AuditActivityListParamsSchema);
const validateAuditRunInspectParams = /* @__PURE__ */ lazyCompile(AuditRunInspectParamsSchema);
const validateAuditListParams = /* @__PURE__ */ lazyCompile(AuditListParamsSchema);
const validateUsersListParams = /* @__PURE__ */ lazyCompile(UsersListParamsSchema);
const validateUsersMentionableParams = /* @__PURE__ */ lazyCompile(UsersMentionableParamsSchema);
const validateUsersMentionableResult = /* @__PURE__ */ lazyCompile(UsersMentionableResultSchema);
const validateMentionsListParams = /* @__PURE__ */ lazyCompile(MentionsListParamsSchema);
const validateMentionsDismissParams = /* @__PURE__ */ lazyCompile(MentionsDismissParamsSchema);
const validateMentionsListResult = /* @__PURE__ */ lazyCompile(MentionsListResultSchema);
const validateMentionsChangedEvent = /* @__PURE__ */ lazyCompile(MentionsChangedEventSchema);
const validateUsersPrefsGetParams = /* @__PURE__ */ lazyCompile(UsersPrefsGetParamsSchema);
const validateUsersPrefsSetParams = /* @__PURE__ */ lazyCompile(UsersPrefsSetParamsSchema);
const validateUsersPersonalFileGetParams = /* @__PURE__ */ lazyCompile(UsersPersonalFileGetParamsSchema);
const validateUsersPersonalFileSetParams = /* @__PURE__ */ lazyCompile(UsersPersonalFileSetParamsSchema);
const validateUsersSelfParams = /* @__PURE__ */ lazyCompile(UsersSelfParamsSchema);
const validateUsersGitHubStatusParams = /* @__PURE__ */ lazyCompile(UsersGitHubStatusParamsSchema);
const validateUsersGitHubAuthorizeStartParams = /* @__PURE__ */ lazyCompile(UsersGitHubAuthorizeStartParamsSchema);
const validateUsersGitHubAuthorizePollParams = /* @__PURE__ */ lazyCompile(UsersGitHubAuthorizePollParamsSchema);
const validateUsersGitHubAuthorizeCancelParams = /* @__PURE__ */ lazyCompile(UsersGitHubAuthorizeCancelParamsSchema);
const validateUsersGitHubDisconnectParams = /* @__PURE__ */ lazyCompile(UsersGitHubDisconnectParamsSchema);
const validateUsersSelfResult = /* @__PURE__ */ lazyCompile(UsersSelfResultSchema);
const validateUsersLinkEmailParams = /* @__PURE__ */ lazyCompile(UsersLinkEmailParamsSchema);
const validateUsersLinkEmailResult = /* @__PURE__ */ lazyCompile(UsersLinkEmailResultSchema);
const validateUsersMergeParams = /* @__PURE__ */ lazyCompile(UsersMergeParamsSchema);
const validateUsersMergeResult = /* @__PURE__ */ lazyCompile(UsersMergeResultSchema);
const validateUsersLinkChannelIdentityParams = /* @__PURE__ */ lazyCompile(UsersLinkChannelIdentityParamsSchema);
const validateUsersLinkChannelIdentityResult = /* @__PURE__ */ lazyCompile(UsersLinkChannelIdentityResultSchema);
const validateUsersUnlinkChannelIdentityParams = /* @__PURE__ */ lazyCompile(UsersUnlinkChannelIdentityParamsSchema);
const validateUsersUnlinkChannelIdentityResult = /* @__PURE__ */ lazyCompile(UsersUnlinkChannelIdentityResultSchema);
const validateUsersListChannelIdentitiesParams = /* @__PURE__ */ lazyCompile(UsersListChannelIdentitiesParamsSchema);
const validateUsersListChannelIdentitiesResult = /* @__PURE__ */ lazyCompile(UsersListChannelIdentitiesResultSchema);
const validateUsersSetDisplayNameParams = /* @__PURE__ */ lazyCompile(UsersSetDisplayNameParamsSchema);
const validateUsersSetDisplayNameResult = /* @__PURE__ */ lazyCompile(UsersSetDisplayNameResultSchema);
const validateUsersSetRoleParams = /* @__PURE__ */ lazyCompile(UsersSetRoleParamsSchema);
const validateUsersSetRoleResult = /* @__PURE__ */ lazyCompile(UsersSetRoleResultSchema);
const validateUsersSetAvatarParams = /* @__PURE__ */ lazyCompile(UsersSetAvatarParamsSchema);
const validateUsersSetAvatarResult = /* @__PURE__ */ lazyCompile(UsersSetAvatarResultSchema);
const validateUsersListAuthLinksParams = /* @__PURE__ */ lazyCompile(UsersListAuthLinksParamsSchema);
const validateUsersListModelAccountsParams = /* @__PURE__ */ lazyCompile(UsersListModelAccountsParamsSchema);
const validateUsersSelectModelAccountParams = /* @__PURE__ */ lazyCompile(UsersSelectModelAccountParamsSchema);
const validateUsersAuthConnectCatalogParams = /* @__PURE__ */ lazyCompile(UsersAuthConnectCatalogParamsSchema);
const validateUsersAuthConnectStartParams = /* @__PURE__ */ lazyCompile(UsersAuthConnectStartParamsSchema);
const validateUsersAuthConnectAnswerParams = /* @__PURE__ */ lazyCompile(UsersAuthConnectAnswerParamsSchema);
const validateUsersAuthConnectStatusParams = /* @__PURE__ */ lazyCompile(UsersAuthConnectStatusParamsSchema);
const validateUsersAuthConnectCancelParams = /* @__PURE__ */ lazyCompile(UsersAuthConnectCancelParamsSchema);
const validateUsersLinkAuthProfileParams = /* @__PURE__ */ lazyCompile(UsersLinkAuthProfileParamsSchema);
const validateUsersUnlinkAuthProfileParams = /* @__PURE__ */ lazyCompile(UsersUnlinkAuthProfileParamsSchema);
const validateAgentIdentityParams = /* @__PURE__ */ lazyCompile(AgentIdentityParamsSchema);
const validateAgentWaitParams = /* @__PURE__ */ lazyCompile(AgentWaitParamsSchema);
const validateWakeParams = /* @__PURE__ */ lazyCompile(WakeParamsSchema);
const validateAgentsListParams = /* @__PURE__ */ lazyCompile(AgentsListParamsSchema);
const validateProjectsListParams = /* @__PURE__ */ lazyCompile(ProjectsListParamsSchema);
const validateProjectsRegisterParams = /* @__PURE__ */ lazyCompile(ProjectsRegisterParamsSchema);
const validateProjectsAddParams = /* @__PURE__ */ lazyCompile(ProjectsAddParamsSchema);
const validateProjectsSearchRemoteParams = /* @__PURE__ */ lazyCompile(ProjectsSearchRemoteParamsSchema);
const validateProjectsRemoveParams = /* @__PURE__ */ lazyCompile(ProjectsRemoveParamsSchema);
const validateWorktreesListParams = /* @__PURE__ */ lazyCompile(WorktreesListParamsSchema);
const validateBoardGetParams = /* @__PURE__ */ lazyCompile(BoardGetParamsSchema);
const validateBoardUpdateParams = /* @__PURE__ */ lazyCompile(BoardUpdateParamsSchema);
const validateBoardWidgetContent = /* @__PURE__ */ lazyCompile(BoardWidgetContentSchema);
const validateBoardWidgetAppViewParams = /* @__PURE__ */ lazyCompile(BoardWidgetAppViewParamsSchema);
const validateBoardWidgetPutParams = /* @__PURE__ */ lazyCompile(BoardWidgetPutParamsSchema);
const validateBoardWidgetGrantParams = /* @__PURE__ */ lazyCompile(BoardWidgetGrantParamsSchema);
const validateBoardEventParams = /* @__PURE__ */ lazyCompile(BoardEventParamsSchema);
const validateBoardPromptAuthorizeParams = /* @__PURE__ */ lazyCompile(BoardPromptAuthorizeParamsSchema);
const validateBoardDataReadParams = /* @__PURE__ */ lazyCompile(BoardDataReadParamsSchema);
const validateBoardActionParams = /* @__PURE__ */ lazyCompile(BoardActionParamsSchema);
const validateProgressCardGetParams = /* @__PURE__ */ lazyCompile(ProgressCardGetParamsSchema);
const validateProgressCardPutParams = /* @__PURE__ */ lazyCompile(ProgressCardPutParamsSchema);
const validateProgressCardRefreshParams = /* @__PURE__ */ lazyCompile(ProgressCardRefreshParamsSchema);
const validateWorktreesCreateParams = /* @__PURE__ */ lazyCompile(WorktreesCreateParamsSchema);
const validateWorktreesRemoveParams = /* @__PURE__ */ lazyCompile(WorktreesRemoveParamsSchema);
const validateWorktreesRestoreParams = /* @__PURE__ */ lazyCompile(WorktreesRestoreParamsSchema);
const validateWorktreesGcParams = /* @__PURE__ */ lazyCompile(WorktreesGcParamsSchema);
const validateWorktreesRecoverRemovalParams = /* @__PURE__ */ lazyCompile(WorktreesRecoverRemovalParamsSchema);
const validateWorktreesRetireSnapshotParams = /* @__PURE__ */ lazyCompile(WorktreesRetireSnapshotParamsSchema);
const validateWorktreesBranchesParams = /* @__PURE__ */ lazyCompile(WorktreesBranchesParamsSchema);
const validateFsListDirParams = /* @__PURE__ */ lazyCompile(FsListDirParamsSchema);
const validateFsListDirResult = /* @__PURE__ */ lazyCompile(FsListDirResultSchema);
const validateAgentsCreateParams = /* @__PURE__ */ lazyCompile(AgentsCreateParamsSchema);
const validateAgentsUpdateParams = /* @__PURE__ */ lazyCompile(AgentsUpdateParamsSchema);
const validateAgentsDeleteParams = /* @__PURE__ */ lazyCompile(AgentsDeleteParamsSchema);
const validateAgentsFilesListParams = /* @__PURE__ */ lazyCompile(AgentsFilesListParamsSchema);
const validateAgentsFilesGetParams = /* @__PURE__ */ lazyCompile(AgentsFilesGetParamsSchema);
const validateAgentsFilesSetParams = /* @__PURE__ */ lazyCompile(AgentsFilesSetParamsSchema);
const validateAgentsWorkspaceListParams = /* @__PURE__ */ lazyCompile(AgentsWorkspaceListParamsSchema);
const validateAgentsWorkspaceGetParams = /* @__PURE__ */ lazyCompile(AgentsWorkspaceGetParamsSchema);
const validateArtifactsListParams = /* @__PURE__ */ lazyCompile(ArtifactsListParamsSchema);
const validateArtifactsGetParams = /* @__PURE__ */ lazyCompile(ArtifactsGetParamsSchema);
const validateArtifactsDownloadParams = /* @__PURE__ */ lazyCompile(ArtifactsDownloadParamsSchema);
const validateNodePairListParams = /* @__PURE__ */ lazyCompile(NodePairListParamsSchema);
const validateNodePairApproveParams = /* @__PURE__ */ lazyCompile(NodePairApproveParamsSchema);
const validateNodePairRejectParams = /* @__PURE__ */ lazyCompile(NodePairRejectParamsSchema);
const validateNodePairRemoveParams = /* @__PURE__ */ lazyCompile(NodePairRemoveParamsSchema);
const validateNodeRenameParams = /* @__PURE__ */ lazyCompile(NodeRenameParamsSchema);
const validateNodeListParams = /* @__PURE__ */ lazyCompile(NodeListParamsSchema);
const validateNodePluginToolsUpdateParams = /* @__PURE__ */ lazyCompile(NodePluginToolsUpdateParamsSchema);
const validateNodeSkillsUpdateParams = /* @__PURE__ */ lazyCompile(NodeSkillsUpdateParamsSchema);
const validateEnvironmentsCreateParams = /* @__PURE__ */ lazyCompile(EnvironmentsCreateParamsSchema);
const validateEnvironmentsSessionCreateParams = /* @__PURE__ */ lazyCompile(EnvironmentsSessionCreateParamsSchema);
const validateEnvironmentsSessionStatusParams = /* @__PURE__ */ lazyCompile(EnvironmentsSessionStatusParamsSchema);
const validateEnvironmentsSessionDestroyParams = /* @__PURE__ */ lazyCompile(EnvironmentsSessionDestroyParamsSchema);
const validateEnvironmentsSessionExecParams = /* @__PURE__ */ lazyCompile(EnvironmentsSessionExecParamsSchema);
const validateEnvironmentsPrepareParams = /* @__PURE__ */ lazyCompile(EnvironmentsPrepareParamsSchema);
const validateEnvironmentsPrepareResult = /* @__PURE__ */ lazyCompile(EnvironmentsPrepareResultSchema);
const validateEnvironmentsDestroyParams = /* @__PURE__ */ lazyCompile(EnvironmentsDestroyParamsSchema);
const validateEnvironmentsListParams = /* @__PURE__ */ lazyCompile(EnvironmentsListParamsSchema);
const validateEnvironmentsStatusParams = /* @__PURE__ */ lazyCompile(EnvironmentsStatusParamsSchema);
const validatePortalListParams = /* @__PURE__ */ lazyCompile(PortalListParamsSchema);
const validatePortalOpenParams = /* @__PURE__ */ lazyCompile(PortalOpenParamsSchema);
const validatePortalCloseParams = /* @__PURE__ */ lazyCompile(PortalCloseParamsSchema);
const validateSessionPortalListParams = /* @__PURE__ */ lazyCompile(SessionPortalListParamsSchema);
const validateSessionPortalOpenParams = /* @__PURE__ */ lazyCompile(SessionPortalOpenParamsSchema);
const validateSessionPortalCloseParams = /* @__PURE__ */ lazyCompile(SessionPortalCloseParamsSchema);
const validateWorkerDesktopObserveParams = /* @__PURE__ */ lazyCompile(WorkerDesktopObserveParamsSchema);
const validateWorkerDesktopObserveResult = /* @__PURE__ */ lazyCompile(WorkerDesktopObserveResultSchema);
const validateWorkerDesktopLaunchParams = /* @__PURE__ */ lazyCompile(WorkerDesktopLaunchParamsSchema);
const validateWorkerDesktopLaunchResult = /* @__PURE__ */ lazyCompile(WorkerDesktopLaunchResultSchema);
const validateDesktopObserveParams = /* @__PURE__ */ lazyCompile(DesktopObserveParamsSchema);
const validateDesktopObserveResult = /* @__PURE__ */ lazyCompile(DesktopObserveResultSchema);
const validateDesktopLaunchParams = /* @__PURE__ */ lazyCompile(DesktopLaunchParamsSchema);
const validateDesktopReleaseParams = /* @__PURE__ */ lazyCompile(DesktopReleaseParamsSchema);
const validateDesktopReleaseResult = /* @__PURE__ */ lazyCompile(DesktopReleaseResultSchema);
const validateSystemInfoParams = /* @__PURE__ */ lazyCompile(SystemInfoParamsSchema);
const validateSystemInfoResult = /* @__PURE__ */ lazyCompile(SystemInfoResultSchema);
const validatePresenceQueryParams = /* @__PURE__ */ lazyCompile(PresenceQueryParamsSchema);
const validatePresenceQueryResult = /* @__PURE__ */ lazyCompile(PresenceQueryResultSchema);
const validateNodePendingAckParams = /* @__PURE__ */ lazyCompile(NodePendingAckParamsSchema);
const validateNodeDescribeParams = /* @__PURE__ */ lazyCompile(NodeDescribeParamsSchema);
const validateNodeInvokeParams = /* @__PURE__ */ lazyCompile(NodeInvokeParamsSchema);
const validateNodeInvokeResultParams = /* @__PURE__ */ lazyCompile(NodeInvokeResultParamsSchema);
const validateNodeInvokeProgressParams = /* @__PURE__ */ lazyCompile(NodeInvokeProgressParamsSchema);
const validateNodeEventParams = /* @__PURE__ */ lazyCompile(NodeEventParamsSchema);
const validateNodePresenceActivityPayload = /* @__PURE__ */ lazyCompile(NodePresenceActivityPayloadSchema);
const validateNodeHostStatsPayload = /* @__PURE__ */ lazyCompile(NodeHostStatsPayloadSchema);
const validateNodePendingDrainParams = /* @__PURE__ */ lazyCompile(NodePendingDrainParamsSchema);
const validateNodePendingEnqueueParams = /* @__PURE__ */ lazyCompile(NodePendingEnqueueParamsSchema);
const validatePushTestParams = /* @__PURE__ */ lazyCompile(PushTestParamsSchema);
const validateWebPushVapidPublicKeyParams = /* @__PURE__ */ lazyCompile(WebPushVapidPublicKeyParamsSchema);
const validateWebPushSubscribeParams = /* @__PURE__ */ lazyCompile(WebPushSubscribeParamsSchema);
const validateWebPushUnsubscribeParams = /* @__PURE__ */ lazyCompile(WebPushUnsubscribeParamsSchema);
const validateWebPushTestParams = /* @__PURE__ */ lazyCompile(WebPushTestParamsSchema);
const validateWebPushPreferencesGetParams = /* @__PURE__ */ lazyCompile(WebPushPreferencesGetParamsSchema);
const validateWebPushPreferencesSetParams = /* @__PURE__ */ lazyCompile(WebPushPreferencesSetParamsSchema);
const validateSecretsResolveParams = /* @__PURE__ */ lazyCompile(SecretsResolveParamsSchema);
const validateSecretsResolveResult = /* @__PURE__ */ lazyCompile(SecretsResolveResultSchema);
const validateSecretsStoreListParams = /* @__PURE__ */ lazyCompile(SecretsStoreListParamsSchema);
const validateSecretsStoreListResult = /* @__PURE__ */ lazyCompile(SecretsStoreListResultSchema);
const validateSecretsStoreSetParams = /* @__PURE__ */ lazyCompile(SecretsStoreSetParamsSchema);
const validateSecretsStoreDeleteParams = /* @__PURE__ */ lazyCompile(SecretsStoreDeleteParamsSchema);
const validateSecretsStoreMutationResult = /* @__PURE__ */ lazyCompile(SecretsStoreMutationResultSchema);
function checkPulseBoundaries(data) {
	const boundaries = asNullableRecord(data)?.activityPulseBoundaries;
	return Array.isArray(boundaries) && boundaries.every((boundary) => typeof boundary === "number") && boundaries.some((boundary, index) => boundary <= (boundaries[index - 1] ?? -Infinity)) ? {
		keyword: "ascending",
		instancePath: "/activityPulseBoundaries",
		message: "must be strictly ascending"
	} : void 0;
}
const validateSessionsListParams = /* @__PURE__ */ lazyCompile(SessionsListParamsSchema, checkPulseBoundaries);
const validateSessionCatalogShareRoute = /* @__PURE__ */ lazyCompile(SessionCatalogShareRouteSchema);
const validateSessionsCatalogListParams = /* @__PURE__ */ lazyCompile(SessionsCatalogListParamsSchema);
const validateSessionsCatalogReadParams = /* @__PURE__ */ lazyCompile(SessionsCatalogReadParamsSchema);
const validateSessionsCatalogContinueParams = /* @__PURE__ */ lazyCompile(SessionsCatalogContinueParamsSchema);
const validateSessionsCatalogImportParams = /* @__PURE__ */ lazyCompile(SessionsCatalogImportParamsSchema);
const validateSessionsCatalogArchiveParams = /* @__PURE__ */ lazyCompile(SessionsCatalogArchiveParamsSchema);
const validateSessionsCatalogStartTerminalParams = /* @__PURE__ */ lazyCompile(SessionsCatalogStartTerminalParamsSchema);
const validateSessionsSearchParams = /* @__PURE__ */ lazyCompile(SessionsSearchParamsSchema);
const validateSessionsCleanupParams = /* @__PURE__ */ lazyCompile(SessionsCleanupParamsSchema);
const validateSessionsStorageParams = /* @__PURE__ */ lazyCompile(SessionsStorageParamsSchema);
const validateSessionsPreviewParams = /* @__PURE__ */ lazyCompile(SessionsPreviewParamsSchema);
const validateSessionsDescribeParams = /* @__PURE__ */ lazyCompile(SessionsDescribeParamsSchema);
const validateSessionsResolveParams = /* @__PURE__ */ lazyCompile(SessionsResolveParamsSchema);
const validateSessionsFilesListParams = /* @__PURE__ */ lazyCompile(SessionsFilesListParamsSchema);
const validateSessionsFilesGetParams = /* @__PURE__ */ lazyCompile(SessionsFilesGetParamsSchema);
const validateSessionsFilesAssetsParams = /* @__PURE__ */ lazyCompile(SessionsFilesAssetsParamsSchema);
const validateSessionsFilesSetParams = /* @__PURE__ */ lazyCompile(SessionsFilesSetParamsSchema);
const validateSessionsFilesRevealParams = /* @__PURE__ */ lazyCompile(SessionsFilesRevealParamsSchema);
const validateSessionsDiffParams = /* @__PURE__ */ lazyCompile(SessionsDiffParamsSchema);
const validateSessionsCompanionAskParams = /* @__PURE__ */ lazyCompile(SessionsCompanionAskParamsSchema);
const validateSessionsCompanionStateParams = /* @__PURE__ */ lazyCompile(SessionsCompanionStateParamsSchema);
const validateSessionsCompanionResetParams = /* @__PURE__ */ lazyCompile(SessionsCompanionResetParamsSchema);
const validateSessionsActivitySummaryEnsureParams = /* @__PURE__ */ lazyCompile(SessionsActivitySummaryEnsureParamsSchema);
const validateSessionsObserverVisibilityParams = /* @__PURE__ */ lazyCompile(SessionsObserverVisibilityParamsSchema);
const validateSessionVisibilitySetParams = /* @__PURE__ */ lazyCompile(SessionVisibilitySetParamsSchema);
const validateSessionPublicShareSetParams = /* @__PURE__ */ lazyCompile(SessionPublicShareSetParamsSchema);
const validateSessionMembersListParams = /* @__PURE__ */ lazyCompile(SessionMembersListParamsSchema);
const validateSessionMemberAddParams = /* @__PURE__ */ lazyCompile(SessionMemberAddParamsSchema);
const validateSessionMemberRemoveParams = /* @__PURE__ */ lazyCompile(SessionMemberRemoveParamsSchema);
const validateSessionSuggestionsAddParams = /* @__PURE__ */ lazyCompile(SessionSuggestionsAddParamsSchema);
const validateSessionSuggestionsListParams = /* @__PURE__ */ lazyCompile(SessionSuggestionsListParamsSchema);
const validateSessionSuggestionsResolveParams = /* @__PURE__ */ lazyCompile(SessionSuggestionsResolveParamsSchema);
const validateSessionTypingParams = /* @__PURE__ */ lazyCompile(SessionTypingParamsSchema);
const validateSessionReactionsSetParams = /* @__PURE__ */ lazyCompile(SessionReactionsSetParamsSchema);
const validateSessionReactionsListParams = /* @__PURE__ */ lazyCompile(SessionReactionsListParamsSchema);
const validateSessionReactionEvent = /* @__PURE__ */ lazyCompile(SessionReactionEventSchema);
const validateSessionsCreateParams = /* @__PURE__ */ lazyCompile(SessionsCreateParamsSchema);
const validateSessionsTitlePrepareParams = /* @__PURE__ */ lazyCompile(SessionsTitlePrepareParamsSchema);
const validateSessionsRecoverParams = /* @__PURE__ */ lazyCompile(SessionsRecoverParamsSchema);
const validateSessionsSendParams = /* @__PURE__ */ lazyCompile(SessionsSendParamsSchema);
const validateSessionsReclaimParams = /* @__PURE__ */ lazyCompile(SessionsReclaimParamsSchema);
const validateSessionsReclaimResult = /* @__PURE__ */ lazyCompile(SessionsReclaimResultSchema);
const validateSessionsMoveResult = /* @__PURE__ */ lazyCompile(SessionsMoveResultSchema);
const validateSessionsMessagesSubscribeParams = /* @__PURE__ */ lazyCompile(SessionsMessagesSubscribeParamsSchema);
const validateSessionsMessagesUnsubscribeParams = /* @__PURE__ */ lazyCompile(SessionsMessagesUnsubscribeParamsSchema);
const validateSessionsViewerPresenceSetParams = /* @__PURE__ */ lazyCompile(SessionsViewerPresenceSetParamsSchema);
const validateSessionsAbortParams = /* @__PURE__ */ lazyCompile(SessionsAbortParamsSchema);
const validateSessionsPatchParams = /* @__PURE__ */ lazyCompile(SessionsPatchParamsSchema);
const validateSessionsGoalUpdateParams = /* @__PURE__ */ lazyCompile(SessionsGoalUpdateParamsSchema);
const validateSessionsGoalClearParams = /* @__PURE__ */ lazyCompile(SessionsGoalClearParamsSchema);
const validateSessionsProviderReviewContinueParams = /* @__PURE__ */ lazyCompile(SessionsProviderReviewContinueParamsSchema);
const validateSessionsPatchManyParams = /* @__PURE__ */ lazyCompile(SessionsPatchManyParamsSchema);
const validateSessionsPluginPatchParams = /* @__PURE__ */ lazyCompile(SessionsPluginPatchParamsSchema);
const validateSessionsResetParams = /* @__PURE__ */ lazyCompile(SessionsResetParamsSchema);
const validateSessionsDeleteParams = /* @__PURE__ */ lazyCompile(SessionsDeleteParamsSchema);
const validateSessionsAssignOwnerParams = /* @__PURE__ */ lazyCompile(SessionsAssignOwnerParamsSchema);
const validateSessionsSetInvolvementParams = /* @__PURE__ */ lazyCompile(SessionsSetInvolvementParamsSchema);
const validateSessionsGroupsListParams = /* @__PURE__ */ lazyCompile(SessionsGroupsListParamsSchema);
const validateSessionsGroupsListResult = /* @__PURE__ */ lazyCompile(SessionsGroupsListResultSchema);
const validateSessionsGroupsDefaultsParams = /* @__PURE__ */ lazyCompile(SessionsGroupsDefaultsParamsSchema);
const validateSessionsGroupsDefaultsResult = /* @__PURE__ */ lazyCompile(SessionsGroupsDefaultsResultSchema);
const validateSessionsGroupsPutParams = /* @__PURE__ */ lazyCompile(SessionsGroupsPutParamsSchema);
const validateSessionsGroupsRenameParams = /* @__PURE__ */ lazyCompile(SessionsGroupsRenameParamsSchema);
const validateSessionsGroupsUpdateParams = /* @__PURE__ */ lazyCompile(SessionsGroupsUpdateParamsSchema);
const validateSessionsGroupsUpdateResult = /* @__PURE__ */ lazyCompile(SessionsGroupsUpdateResultSchema);
const validateSessionsGroupsDeleteParams = /* @__PURE__ */ lazyCompile(SessionsGroupsDeleteParamsSchema);
const validateSessionsGroupsMutationResult = /* @__PURE__ */ lazyCompile(SessionsGroupsMutationResultSchema);
const validateSessionsCompactParams = /* @__PURE__ */ lazyCompile(SessionsCompactParamsSchema);
const validateSessionsBranchesListParams = /* @__PURE__ */ lazyCompile(SessionsBranchesListParamsSchema);
const validateSessionsBranchesSwitchParams = /* @__PURE__ */ lazyCompile(SessionsBranchesSwitchParamsSchema);
const validateSessionsRewindParams = /* @__PURE__ */ lazyCompile(SessionsRewindParamsSchema);
const validateSessionsForkParams = /* @__PURE__ */ lazyCompile(SessionsForkParamsSchema);
const validateSessionsUsageParams = /* @__PURE__ */ lazyCompile(SessionsUsageParamsSchema);
const validateSessionDiscussionInfoParams = /* @__PURE__ */ lazyCompile(SessionDiscussionInfoParamsSchema);
const validateSessionDiscussionInfoResult = /* @__PURE__ */ lazyCompile(SessionDiscussionInfoResultSchema);
const validateSessionDiscussionOpenParams = /* @__PURE__ */ lazyCompile(SessionDiscussionOpenParamsSchema);
const validateSessionDiscussionOpenResult = /* @__PURE__ */ lazyCompile(SessionDiscussionOpenResultSchema);
const validateTaskSuggestionsListParams = /* @__PURE__ */ lazyCompile(TaskSuggestionsListParamsSchema);
const validateTaskSuggestionsCreateParams = /* @__PURE__ */ lazyCompile(TaskSuggestionsCreateParamsSchema);
const validateTaskSuggestionsAcceptParams = /* @__PURE__ */ lazyCompile(TaskSuggestionsAcceptParamsSchema);
const validateTaskSuggestionsDismissParams = /* @__PURE__ */ lazyCompile(TaskSuggestionsDismissParamsSchema);
const validateConfigGetParams = /* @__PURE__ */ lazyCompile(ConfigGetParamsSchema);
const validateConfigSetParams = /* @__PURE__ */ lazyCompile(ConfigSetParamsSchema);
const validateConfigApplyParams = /* @__PURE__ */ lazyCompile(ConfigApplyParamsSchema);
const validateConfigPatchParams = /* @__PURE__ */ lazyCompile(ConfigPatchParamsSchema);
const validateConfigSchemaParams = /* @__PURE__ */ lazyCompile(ConfigSchemaParamsSchema);
const validateConfigSchemaLookupParams = /* @__PURE__ */ lazyCompile(ConfigSchemaLookupParamsSchema);
const validateConfigSchemaLookupResult = /* @__PURE__ */ lazyCompile(ConfigSchemaLookupResultSchema);
const validateSystemAgentChatParams = /* @__PURE__ */ lazyCompile(SystemAgentChatParamsSchema);
const validateSystemAgentChatHistoryParams = /* @__PURE__ */ lazyCompile(SystemAgentChatHistoryParamsSchema);
const validateSystemChangesListParams = /* @__PURE__ */ lazyCompile(SystemChangesListParamsSchema);
const validateSystemAgentSetupDetectParams = /* @__PURE__ */ lazyCompile(SystemAgentSetupDetectParamsSchema);
const validateSystemAgentSetupVerifyParams = /* @__PURE__ */ lazyCompile(SystemAgentSetupVerifyParamsSchema);
const validateSystemAgentSetupActivateParams = /* @__PURE__ */ lazyCompile(SystemAgentSetupActivateParamsSchema);
const validateSystemAgentSetupActivateStartParams = /* @__PURE__ */ lazyCompile(SystemAgentSetupActivateStartParamsSchema);
const validateSystemAgentSetupAuthStartParams = /* @__PURE__ */ lazyCompile(SystemAgentSetupAuthStartParamsSchema);
const validateWizardStartParams = /* @__PURE__ */ lazyCompile(WizardStartParamsSchema);
const validateMcpAuthLoginParams = /* @__PURE__ */ lazyCompile(McpAuthLoginParamsSchema);
const validateWizardNextParams = /* @__PURE__ */ lazyCompile(WizardNextParamsSchema);
const validateWizardCancelParams = /* @__PURE__ */ lazyCompile(WizardCancelParamsSchema);
const validateWizardStatusParams = /* @__PURE__ */ lazyCompile(WizardStatusParamsSchema);
const validateTalkModeParams = /* @__PURE__ */ lazyCompile(TalkModeParamsSchema);
const validateTalkCatalogParams = /* @__PURE__ */ lazyCompile(TalkCatalogParamsSchema);
const validateTalkVoiceGetParams = /* @__PURE__ */ lazyCompile(TalkVoiceGetParamsSchema);
const validateTalkVoiceSetParams = /* @__PURE__ */ lazyCompile(TalkVoiceSetParamsSchema);
const validateTalkVoiceCompleteParams = /* @__PURE__ */ lazyCompile(TalkVoiceCompleteParamsSchema);
const validateTalkVoiceChangeEvent = /* @__PURE__ */ lazyCompile(TalkVoiceChangeEventSchema);
const validateTalkConfigParams = /* @__PURE__ */ lazyCompile(TalkConfigParamsSchema);
const validateTalkConfigResult = /* @__PURE__ */ lazyCompile(TalkConfigResultSchema);
const validateTalkClientCreateParams = /* @__PURE__ */ lazyCompile(TalkClientCreateParamsSchema);
const validateTalkClientCreateResult = /* @__PURE__ */ lazyCompile(TalkClientCreateResultSchema);
const validateTalkClientCloseParams = /* @__PURE__ */ lazyCompile(TalkClientCloseParamsSchema);
const validateTalkClientMutationResult = /* @__PURE__ */ lazyCompile(TalkClientMutationResultSchema);
const validateTalkClientToolCallParams = /* @__PURE__ */ lazyCompile(TalkClientToolCallParamsSchema);
const validateTalkClientToolCallResult = /* @__PURE__ */ lazyCompile(TalkClientToolCallResultSchema);
const validateTalkClientTranscriptParams = /* @__PURE__ */ lazyCompile(TalkClientTranscriptParamsSchema);
const validateTalkClientSteerParams = /* @__PURE__ */ lazyCompile(TalkClientSteerParamsSchema);
const validateTalkSessionCreateParams = /* @__PURE__ */ lazyCompile(TalkSessionCreateParamsSchema);
const validateTalkSessionAppendAudioParams = /* @__PURE__ */ lazyCompile(TalkSessionAppendAudioParamsSchema);
const validateTalkSessionAcknowledgeMarkParams = /* @__PURE__ */ lazyCompile(TalkSessionAcknowledgeMarkParamsSchema);
const validateTalkSessionCancelOutputParams = /* @__PURE__ */ lazyCompile(TalkSessionCancelOutputParamsSchema);
const validateTalkSessionCancelOutputResult = /* @__PURE__ */ lazyCompile(TalkSessionCancelOutputResultSchema);
const validateTalkSessionSteerParams = /* @__PURE__ */ lazyCompile(TalkSessionSteerParamsSchema);
const validateTalkSessionSubmitToolResultParams = /* @__PURE__ */ lazyCompile(TalkSessionSubmitToolResultParamsSchema);
const validateTalkSessionCloseParams = /* @__PURE__ */ lazyCompile(TalkSessionCloseParamsSchema);
const validateTalkSpeakParams = /* @__PURE__ */ lazyCompile(TalkSpeakParamsSchema);
const validateTtsSpeakParams = /* @__PURE__ */ lazyCompile(TtsSpeakParamsSchema);
const validateChannelsStatusParams = /* @__PURE__ */ lazyCompile(ChannelsStatusParamsSchema);
const validateChannelsPairingListParams = /* @__PURE__ */ lazyCompile(ChannelsPairingListParamsSchema);
const validateChannelsPairingApproveParams = /* @__PURE__ */ lazyCompile(ChannelsPairingApproveParamsSchema);
const validateChannelsPairingDismissParams = /* @__PURE__ */ lazyCompile(ChannelsPairingDismissParamsSchema);
const validateChannelsStartParams = /* @__PURE__ */ lazyCompile(ChannelsStartParamsSchema);
const validateChannelsStopParams = /* @__PURE__ */ lazyCompile(ChannelsStopParamsSchema);
const validateChannelsLogoutParams = /* @__PURE__ */ lazyCompile(ChannelsLogoutParamsSchema);
const validateModelsAuthSetApiKeyParams = /* @__PURE__ */ lazyCompile(ModelsAuthSetApiKeyParamsSchema);
const validateModelsAuthSetApiKeyResult = /* @__PURE__ */ lazyCompile(ModelsAuthSetApiKeyResultSchema);
const validateModelsAuthLogoutParams = /* @__PURE__ */ lazyCompile(ModelsAuthLogoutParamsSchema);
const validateModelsAuthOrderSetParams = /* @__PURE__ */ lazyCompile(ModelsAuthOrderSetParamsSchema);
const validateModelsAuthRefreshParams = /* @__PURE__ */ lazyCompile(ModelsAuthRefreshParamsSchema);
const validateModelsAuthStatusParams = /* @__PURE__ */ lazyCompile(ModelsAuthStatusParamsSchema);
const validateModelsListParams = /* @__PURE__ */ lazyCompile(ModelsListParamsSchema);
const validateSkillsStatusParams = /* @__PURE__ */ lazyCompile(SkillsStatusParamsSchema);
const validateHooksStatusParams = /* @__PURE__ */ lazyCompile(HooksStatusParamsSchema);
const validateToolsCatalogParams = /* @__PURE__ */ lazyCompile(ToolsCatalogParamsSchema);
const validateToolsGitHubStatusParams = /* @__PURE__ */ lazyCompile(ToolsGitHubStatusParamsSchema);
const validateToolsGitHubStatusResult = /* @__PURE__ */ lazyCompile(ToolsGitHubStatusResultSchema);
const validateToolsGitHubConfigureParams = /* @__PURE__ */ lazyCompile(ToolsGitHubConfigureParamsSchema);
const validateToolsGitHubAuthorizeStartParams = /* @__PURE__ */ lazyCompile(ToolsGitHubAuthorizeStartParamsSchema);
const validateToolsGitHubAuthorizeStartResult = /* @__PURE__ */ lazyCompile(ToolsGitHubAuthorizeStartResultSchema);
const validateToolsGitHubAuthorizePollParams = /* @__PURE__ */ lazyCompile(ToolsGitHubAuthorizePollParamsSchema);
const validateToolsGitHubAuthorizePollResult = /* @__PURE__ */ lazyCompile(ToolsGitHubAuthorizePollResultSchema);
const validateToolsGitHubAuthorizeCancelParams = /* @__PURE__ */ lazyCompile(ToolsGitHubAuthorizeCancelParamsSchema);
const validateToolsGitHubAuthorizeCancelResult = /* @__PURE__ */ lazyCompile(ToolsGitHubAuthorizeCancelResultSchema);
const validateSessionGitHubPublishParams = /* @__PURE__ */ lazyCompile(SessionGitHubPublishParamsSchema);
const validateSessionGitHubOptionsParams = /* @__PURE__ */ lazyCompile(SessionGitHubOptionsParamsSchema);
const validateSessionGitHubStatusParams = /* @__PURE__ */ lazyCompile(SessionGitHubStatusParamsSchema);
const validateSessionGitHubConfirmParams = /* @__PURE__ */ lazyCompile(SessionGitHubConfirmParamsSchema);
const validateToolsEffectiveParams = /* @__PURE__ */ lazyCompile(ToolsEffectiveParamsSchema);
const validateToolsInvokeParams = /* @__PURE__ */ lazyCompile(ToolsInvokeParamsSchema);
const validateSkillsBinsParams = /* @__PURE__ */ lazyCompile(SkillsBinsParamsSchema);
const validateSkillsInstallParams = /* @__PURE__ */ lazyCompile(SkillsInstallParamsSchema);
const validateSkillsUploadBeginParams = /* @__PURE__ */ lazyCompile(SkillsUploadBeginParamsSchema);
const validateSkillsUploadChunkParams = /* @__PURE__ */ lazyCompile(SkillsUploadChunkParamsSchema);
const validateSkillsUploadCommitParams = /* @__PURE__ */ lazyCompile(SkillsUploadCommitParamsSchema);
const validateSkillsUpdateParams = /* @__PURE__ */ lazyCompile(SkillsUpdateParamsSchema);
const validateSkillsSearchParams = /* @__PURE__ */ lazyCompile(SkillsSearchParamsSchema);
const validateSkillsDetailParams = /* @__PURE__ */ lazyCompile(SkillsDetailParamsSchema);
const validateSkillsCuratorStatusParams = /* @__PURE__ */ lazyCompile(SkillsCuratorStatusParamsSchema);
const validateSkillsCuratorActionParams = /* @__PURE__ */ lazyCompile(SkillsCuratorActionParamsSchema);
const validateSkillsProposalsListParams = /* @__PURE__ */ lazyCompile(SkillsProposalsListParamsSchema);
const validateSkillsWorkshopReadParams = /* @__PURE__ */ lazyCompile(SkillsWorkshopReadParamsSchema);
const validateSkillsProposalInspectParams = /* @__PURE__ */ lazyCompile(SkillsProposalInspectParamsSchema);
const validateSkillsProposalCreateParams = /* @__PURE__ */ lazyCompile(SkillsProposalCreateParamsSchema);
const validateSkillsProposalUpdateParams = /* @__PURE__ */ lazyCompile(SkillsProposalUpdateParamsSchema);
const validateSkillsProposalReviseParams = /* @__PURE__ */ lazyCompile(SkillsProposalReviseParamsSchema);
const validateSkillsProposalRequestRevisionParams = /* @__PURE__ */ lazyCompile(SkillsProposalRequestRevisionParamsSchema);
const validateSkillsProposalDecisionParams = /* @__PURE__ */ lazyCompile(SkillsProposalDecisionParamsSchema);
const validateSkillsProposalActionParams = /* @__PURE__ */ lazyCompile(SkillsProposalActionParamsSchema);
const validateSkillsProposalEvaluateParams = /* @__PURE__ */ lazyCompile(SkillsProposalEvaluateParamsSchema);
const validateSkillsProposalEventsListParams = /* @__PURE__ */ lazyCompile(SkillsProposalEventsListParamsSchema);
const validateSkillsSecurityVerdictsParams = /* @__PURE__ */ lazyCompile(SkillsSecurityVerdictsParamsSchema);
const validateSkillsSkillCardParams = /* @__PURE__ */ lazyCompile(SkillsSkillCardParamsSchema);
const validateCronListParams = /* @__PURE__ */ lazyCompile(CronListParamsSchema);
const validateCronStatusParams = /* @__PURE__ */ lazyCompile(CronStatusParamsSchema);
const validateCronGetParams = /* @__PURE__ */ lazyCompile(CronGetParamsSchema);
const validateCronAddParams = /* @__PURE__ */ lazyCompile(CronAddParamsSchema);
const validateCronUpdateParams = /* @__PURE__ */ lazyCompile(CronUpdateParamsSchema);
const validateCronRemoveParams = /* @__PURE__ */ lazyCompile(CronRemoveParamsSchema);
const validateCronRunParams = /* @__PURE__ */ lazyCompile(CronRunParamsSchema);
const validateCronRunsParams = /* @__PURE__ */ lazyCompile(CronRunsParamsSchema);
const validateCronHistoryParams = /* @__PURE__ */ lazyCompile(CronHistoryParamsSchema);
const validateCronScratchGetParams = /* @__PURE__ */ lazyCompile(CronScratchGetParamsSchema);
const validateCronScratchSetParams = /* @__PURE__ */ lazyCompile(CronScratchSetParamsSchema);
const validateDevicePairListParams = /* @__PURE__ */ lazyCompile(DevicePairListParamsSchema);
const validateDevicePairApproveParams = /* @__PURE__ */ lazyCompile(DevicePairApproveParamsSchema);
const validateDevicePairRejectParams = /* @__PURE__ */ lazyCompile(DevicePairRejectParamsSchema);
const validateDevicePairRemoveParams = /* @__PURE__ */ lazyCompile(DevicePairRemoveParamsSchema);
const validateDevicePairSetupCodeParams = /* @__PURE__ */ lazyCompile(DevicePairSetupCodeParamsSchema);
const validateDevicePairSetupStatusParams = /* @__PURE__ */ lazyCompile(DevicePairSetupStatusParamsSchema);
const validateDevicePairRenameParams = /* @__PURE__ */ lazyCompile(DevicePairRenameParamsSchema);
const validateDeviceTokenRotateParams = /* @__PURE__ */ lazyCompile(DeviceTokenRotateParamsSchema);
const validateDeviceTokenRevokeParams = /* @__PURE__ */ lazyCompile(DeviceTokenRevokeParamsSchema);
const validateScopeUpgradeRequest = /* @__PURE__ */ lazyCompile(ScopeUpgradeRequestSchema);
const validateScopeUpgradeWait = /* @__PURE__ */ lazyCompile(ScopeUpgradeWaitSchema);
const validateApprovalGetParams = /* @__PURE__ */ lazyCompile(ApprovalGetParamsSchema);
const validateApprovalHistoryParams = /* @__PURE__ */ lazyCompile(ApprovalHistoryParamsSchema);
const validateApprovalResolveParams = /* @__PURE__ */ lazyCompile(ApprovalResolveParamsSchema);
const validateExecApprovalsGetParams = /* @__PURE__ */ lazyCompile(ExecApprovalsGetParamsSchema);
const validateExecApprovalsSetParams = /* @__PURE__ */ lazyCompile(ExecApprovalsSetParamsSchema);
const validateExecApprovalGetParams = /* @__PURE__ */ lazyCompile(ExecApprovalGetParamsSchema);
const validateExecApprovalRequestParams = /* @__PURE__ */ lazyCompile(ExecApprovalRequestParamsSchema);
const validateExecApprovalResolveParams = /* @__PURE__ */ lazyCompile(ExecApprovalResolveParamsSchema);
const validateExecApprovalGrantsListParams = /* @__PURE__ */ lazyCompile(ExecApprovalGrantsListParamsSchema);
const validateExecApprovalGrantsRevokeParams = /* @__PURE__ */ lazyCompile(ExecApprovalGrantsRevokeParamsSchema);
const validateQuestionRequestParams = /* @__PURE__ */ lazyCompile(QuestionRequestParamsSchema);
const validateQuestionWaitAnswerParams = /* @__PURE__ */ lazyCompile(QuestionWaitAnswerParamsSchema);
const validateQuestionResolveParams = /* @__PURE__ */ lazyCompile(QuestionResolveParamsSchema);
const validateQuestionGetParams = /* @__PURE__ */ lazyCompile(QuestionGetParamsSchema);
const validateQuestionListParams = /* @__PURE__ */ lazyCompile(QuestionListParamsSchema);
const validatePluginApprovalRequestParams = /* @__PURE__ */ lazyCompile(PluginApprovalRequestParamsSchema);
const validatePluginApprovalResolveParams = /* @__PURE__ */ lazyCompile(PluginApprovalResolveParamsSchema);
const validateCapabilityConsentErrorDetails = /* @__PURE__ */ lazyCompile(CapabilityConsentErrorDetailsSchema);
const validatePluginsListParams = /* @__PURE__ */ lazyCompile(PluginsListParamsSchema);
const validatePluginsInspectParams = /* @__PURE__ */ lazyCompile(PluginsInspectParamsSchema);
const validatePluginsRefreshParams = /* @__PURE__ */ lazyCompile(PluginsRefreshParamsSchema);
const validatePluginsReloadParams = /* @__PURE__ */ lazyCompile(PluginsReloadParamsSchema);
const validatePluginsSearchParams = /* @__PURE__ */ lazyCompile(PluginsSearchParamsSchema);
const validatePluginsCatalogBrowseParams = /* @__PURE__ */ lazyCompile(PluginsCatalogBrowseParamsSchema);
const validatePluginsCatalogCategoriesParams = /* @__PURE__ */ lazyCompile(PluginsCatalogCategoriesParamsSchema);
const validatePluginsCatalogGetParams = /* @__PURE__ */ lazyCompile(PluginsCatalogGetParamsSchema);
const validatePluginsInstallParams = /* @__PURE__ */ lazyCompile(PluginsInstallParamsSchema);
const validatePluginsSetEnabledParams = /* @__PURE__ */ lazyCompile(PluginsSetEnabledParamsSchema);
const validatePluginsUninstallParams = /* @__PURE__ */ lazyCompile(PluginsUninstallParamsSchema);
const validatePluginsUiDescriptorsParams = /* @__PURE__ */ lazyCompile(PluginsUiDescriptorsParamsSchema);
const validatePluginsUiDescriptorsResult = /* @__PURE__ */ lazyCompile(PluginsUiDescriptorsResultSchema);
const validatePluginsControlUiListParams = /* @__PURE__ */ lazyCompile(PluginsControlUiListParamsSchema);
const validatePluginsControlUiReloadParams = /* @__PURE__ */ lazyCompile(PluginsControlUiReloadParamsSchema);
const validatePluginsControlUiReportParams = /* @__PURE__ */ lazyCompile(PluginsControlUiReportParamsSchema);
const validatePluginsControlUiStatusParams = /* @__PURE__ */ lazyCompile(PluginsControlUiStatusParamsSchema);
const validatePluginsSessionActionParams = /* @__PURE__ */ lazyCompile(PluginsSessionActionParamsSchema);
const validatePluginsSessionActionResult = /* @__PURE__ */ lazyCompile(PluginsSessionActionResultSchema);
const validateExecApprovalsNodeGetParams = /* @__PURE__ */ lazyCompile(ExecApprovalsNodeGetParamsSchema);
const validateExecApprovalsNodeSetParams = /* @__PURE__ */ lazyCompile(ExecApprovalsNodeSetParamsSchema);
const validateExecApprovalsNodeSnapshot = /* @__PURE__ */ lazyCompile(ExecApprovalsNodeSnapshotSchema);
const validateLogsTailParams = /* @__PURE__ */ lazyCompile(LogsTailParamsSchema);
const validateModelsProbeParams = /* @__PURE__ */ lazyCompile(ModelsProbeParamsSchema);
const validateChatHistoryParams = /* @__PURE__ */ lazyCompile(ChatHistoryParamsSchema);
const validateChatStartupParams = /* @__PURE__ */ lazyCompile(ChatStartupParamsSchema);
const validateChatMetadataParams = /* @__PURE__ */ lazyCompile(ChatMetadataParamsSchema);
const validateChatMessageGetParams = /* @__PURE__ */ lazyCompile(ChatMessageGetParamsSchema);
const validateChatToolTitlesParams = /* @__PURE__ */ lazyCompile(ChatToolTitlesParamsSchema);
const validateChatSendParams = /* @__PURE__ */ lazyCompile(ChatSendParamsSchema);
const validateChatAbortParams = /* @__PURE__ */ lazyCompile(ChatAbortParamsSchema);
const validateChatInjectParams = /* @__PURE__ */ lazyCompile(ChatInjectParamsSchema);
const validateUpdateStatusParams = /* @__PURE__ */ lazyCompile(UpdateStatusParamsSchema);
const validateUpdateStatusResult = /* @__PURE__ */ lazyCompile(UpdateStatusResultSchema);
const validateUpdateHoldParams = /* @__PURE__ */ lazyCompile(UpdateHoldParamsSchema);
const validateUpdateHoldResult = /* @__PURE__ */ lazyCompile(UpdateHoldResultSchema);
const validateUpdateRunParams = /* @__PURE__ */ lazyCompile(UpdateRunParamsSchema);
const validateUpdateRunRecord = /* @__PURE__ */ lazyCompile(UpdateRunRecordSchema);
const validateUpdateRunResult = /* @__PURE__ */ lazyCompile(UpdateRunResultSchema);
const validateUpdateRunsGetParams = /* @__PURE__ */ lazyCompile(UpdateRunsGetParamsSchema);
const validateUpdateRunsGetResult = /* @__PURE__ */ lazyCompile(UpdateRunsGetResultSchema);
const validateUpdateRunsListParams = /* @__PURE__ */ lazyCompile(UpdateRunsListParamsSchema);
const validateUpdateRunsListResult = /* @__PURE__ */ lazyCompile(UpdateRunsListResultSchema);
const validateUpdateRunChangedEvent = /* @__PURE__ */ lazyCompile(UpdateRunChangedEventSchema);
const validateUpdateReportParams = /* @__PURE__ */ lazyCompile(UpdateReportParamsSchema);
const validateUpdateReportResult = /* @__PURE__ */ lazyCompile(UpdateReportResultSchema);
const validateUiCommandParams = /* @__PURE__ */ lazyCompile(UiCommandParamsSchema);
const validateThemesListParams = /* @__PURE__ */ lazyCompile(ThemesListParamsSchema);
const validateThemesGetParams = /* @__PURE__ */ lazyCompile(ThemesGetParamsSchema);
const validateThemesSetParams = /* @__PURE__ */ lazyCompile(ThemesSetParamsSchema);
const validateThemesImportParams = /* @__PURE__ */ lazyCompile(ThemesImportParamsSchema);
const validateWebLoginStartParams = /* @__PURE__ */ lazyCompile(WebLoginStartParamsSchema);
const validateWebLoginWaitParams = /* @__PURE__ */ lazyCompile(WebLoginWaitParamsSchema);
const validateTranscriptsListParams = /* @__PURE__ */ lazyCompile(TranscriptsListParamsSchema);
const validateTranscriptsSummarizeParams = /* @__PURE__ */ lazyCompile(TranscriptsSummarizeParamsSchema);
const validateTranscriptsGetParams = /* @__PURE__ */ lazyCompile(TranscriptsGetParamsSchema);
const validateTranscriptsExportParams = /* @__PURE__ */ lazyCompile(TranscriptsExportParamsSchema);
const validateTranscriptsStatusParams = /* @__PURE__ */ lazyCompile(TranscriptsStatusParamsSchema);
//#endregion
export { validateComputerStatusParams as $, validateSystemChangesListParams as $a, WorktreesRetireSnapshotResultSchema as $c, SendParamsSchema as $d, SessionSuggestionsListParamsSchema as $f, EnvironmentsSessionExecParamsSchema as $h, validateSessionsMessagesUnsubscribeParams as $i, WebPushTestParamsSchema as $l, TerminalUploadParamsSchema as $m, validatePluginsControlUiStatusParams as $n, validateUiCommandParams as $o, TalkVoiceSetResultSchema as $p, validateSessionMemberRemoveParams as $r, validateUsersUnlinkChannelIdentityResult as $s, validateExecApprovalsNodeGetParams as $t, SystemChangeEntrySchema as $u, validateBoardWidgetContent as A, validateSkillsProposalInspectParams as Aa, validateWorktreesListParams as Ac, AgentsFileEntrySchema as Ad, ProjectsListResultSchema as Af, SessionGitHubPublishParamsSchema as Ah, validateSessionsDeleteParams as Ai, QuestionAnswersSchema as Al, validateSkillsProposalHistoryStatusParams as Am, validateNodeInvokeParams as An, validateTaskSuggestionsListParams as Ao, SessionsPatchMutationSchema as Ap, validateQuestionResolveParams as Ar, validateUsersListChannelIdentitiesParams as As, validateDevicePairRejectParams as At, CronRunsParamsSchema as Au, validateChannelsStartParams as B, validateSkillsUploadBeginParams as Ba, WorktreesBranchesParamsSchema as Bc, AgentParamsSchema as Bd, SessionReactionMirrorSchema as Bf, buildClawHubTrustErrorDetails as Bh, validateSessionsGoalUpdateParams as Bi, QuestionRequestedEventSchema as Bl, TerminalAckResultSchema as Bm, validateNodePendingEnqueueParams as Bn, validateToolsGitHubAuthorizePollResult as Bo, SESSION_CREATE_IDEMPOTENCY_RETENTION_MS as Bp, validateSecretsStoreMutationResult as Br, validateUsersPrefsGetParams as Bs, validateEnvironmentsPrepareParams as Bt, SystemAgentChatParamsSchema as Bu, validateBoardActionParams as C, validateSkillsDetailParams as Ca, validateWorkerPresenceParams as Cc, ArtifactsListParamsSchema as Cd, ProjectRecentRepositorySchema as Cf, PluginsInstallProgressEventSchema as Ch, validateSessionsCatalogStartTerminalParams as Ci, SystemInfoResultSchema as Cl, WebSearchTestResultSchema as Cm, validateModelsAuthSetApiKeyResult as Cn, validateTalkVoiceChangeEvent as Co, SessionsSearchHitSchema as Cp, validateProjectsRegisterParams as Cr, validateUsersGitHubStatusParams as Cs, validateDesktopLaunchParams as Ct, CronHistoryParamsSchema as Cu, validateBoardPromptAuthorizeParams as D, validateSkillsProposalDecisionParams as Da, validateWorktreesBranchesParams as Dc, AgentsWorkspaceGetResultSchema as Dd, ProjectsAddParamsSchema as Df, SessionGitHubOptionsParamsSchema as Dh, validateSessionsCompanionResetParams as Di, SessionDiscussionOpenParamsSchema as Dl, SkillsProposalHistoryScanResultSchema as Dm, validateNodeDescribeParams as Dn, validateTaskSuggestionsAcceptParams as Do, SessionsPatchManyParamsSchema as Dp, validateQuestionGetParams as Dr, validateUsersLinkEmailParams as Ds, validateDesktopReleaseResult as Dt, CronRemoveParamsSchema as Du, validateBoardGetParams as E, validateSkillsProposalCreateParams as Ea, validateWorkerTranscriptCommitParams as Ec, AgentsWorkspaceGetParamsSchema as Ed, ProjectSummarySchema as Ef, SessionGitHubConfirmParamsSchema as Eh, validateSessionsCompanionAskParams as Ei, SessionDiscussionInfoSchema as El, SkillsProposalHistoryScanParamsSchema as Em, validateModelsProbeParams as En, validateTalkVoiceSetParams as Eo, SESSIONS_PATCH_MANY_MAX_TARGETS as Ep, validatePushTestParams as Er, validateUsersLinkChannelIdentityResult as Es, validateDesktopReleaseParams as Et, CronListParamsSchema as Eu, validateCapabilityConsentErrorDetails as F, validateSkillsSearchParams as Fa, ToolsCatalogParamsSchema as Fc, AgentsFilesSetParamsSchema as Fd, ProjectsSearchRemoteParamsSchema as Ff, buildSystemAgentInferenceUnavailableErrorDetails as Fh, validateSessionsFilesListParams as Fi, QuestionOptionSchema as Fl, validateTerminalInputParams as Fm, validateNodePairListParams as Fn, validateToolsCatalogParams as Fo, WORKTREE_PRESERVATION_REASONS as Fp, validateSecretsResolveParams as Fr, validateUsersMentionableResult as Fs, validateDeviceTokenRevokeParams as Ft, CronStatusParamsSchema as Fu, validateChatInjectParams as G, validateStorageLocationsProbeParams as Ga, WorktreesListParamsSchema as Gc, ConversationSendResultSchema as Gd, isReactionEmoji as Gf, UI_APPEARANCE_PREFERENCE_KEYS as Gh, validateSessionsGroupsListResult as Gi, QuestionStatusSchema as Gl, TerminalEventSchema as Gm, validatePluginApprovalRequestParams as Gn, validateToolsGitHubStatusResult as Go, SessionOwnerSessionCountSchema as Gp, validateSessionDiscussionInfoResult as Gr, validateUsersSetAvatarParams as Gs, validateEnvironmentsSessionStatusParams as Gt, SystemAgentSetupActivateStartParamsSchema as Gu, validateChannelsStopParams as H, validateSkillsUploadCommitParams as Ha, WorktreesCreateParamsSchema as Hc, ConversationListParamsSchema as Hd, SessionReactionsListResultSchema as Hf, readClawHubTrustErrorDetails as Hh, validateSessionsGroupsDefaultsResult as Hi, QuestionResolveResultSchema as Hl, TerminalAttachResultSchema as Hm, validateNodePresenceActivityPayload as Hn, validateToolsGitHubAuthorizeStartResult as Ho, SessionsCreateParamsSchema as Hp, validateSendParams as Hr, validateUsersSelectModelAccountParams as Hs, validateEnvironmentsSessionCreateParams as Ht, SystemAgentChatResultSchema as Hu, validateChannelsLogoutParams as I, validateSkillsSecurityVerdictsParams as Ia, ToolsEffectiveParamsSchema as Ic, AgentsFilesSetResultSchema as Id, ProjectsSearchRemoteResultSchema as If, buildSystemAgentSessionInvalidatedErrorDetails as Ih, validateSessionsFilesRevealParams as Ii, QuestionRecordSchema as Il, validateTerminalOpenParams as Im, validateNodePairRejectParams as In, validateToolsEffectiveParams as Io, WorktreePreservationReasonSchema as Ip, validateSecretsResolveResult as Ir, validateUsersMergeParams as Is, validateDeviceTokenRotateParams as It, CronUpdateParamsSchema as Iu, validateChatSendParams as J, validateSystemAgentSetupActivateParams as Ja, WorktreesRecoverRemovalResultSchema as Jc, ConversationTurnParamsSchema as Jd, SessionSuggestionResolutionSchema as Jf, SkillsCuratorActionResultSchema as Jh, validateSessionsGroupsRenameParams as Ji, PushTestParamsSchema as Jl, TerminalListResultSchema as Jm, validatePluginsCatalogCategoriesParams as Jn, validateTranscriptsGetParams as Jo, TalkVoiceChangeEventSchema as Jp, validateSessionGitHubConfirmParams as Jr, validateUsersSetDisplayNameResult as Js, validateExecApprovalGrantsListParams as Jt, SystemAgentSetupAuthStartResultSchema as Ju, validateChatMessageGetParams as K, validateSystemAgentChatHistoryParams as Ka, WorktreesListResultSchema as Kc, ConversationTurnCancelParamsSchema as Kd, SessionSuggestionActionSchema as Kf, normalizeUiAppearancePreference as Kh, validateSessionsGroupsMutationResult as Ki, QuestionWaitAnswerParamsSchema as Kl, TerminalExitEventSchema as Km, validatePluginApprovalResolveParams as Kn, validateToolsInvokeParams as Ko, SessionsListParamsSchema as Kp, validateSessionDiscussionOpenParams as Kr, validateUsersSetAvatarResult as Ks, validateEnvironmentsStatusParams as Kt, SystemAgentSetupActivateStartResultSchema as Ku, validateChannelsPairingApproveParams as L, validateSkillsSkillCardParams as La, WorktreeBranchSchema as Lc, AgentEventSchema as Ld, RemoteProjectSchema as Lf, readSystemAgentInferenceUnavailableErrorDetails as Lh, validateSessionsFilesSetParams as Li, QuestionRequestParamsSchema as Ll, validateTerminalResizeParams as Lm, validateNodePairRemoveParams as Ln, validateToolsGitHubAuthorizeCancelParams as Lo, SessionsStorageParamsSchema as Lp, validateSecretsStoreDeleteParams as Lr, validateUsersMergeResult as Ls, validateEnvironmentsCreateParams as Lt, SystemAgentChatHistoryParamsSchema as Lu, validateBoardWidgetPutParams as M, validateSkillsProposalReviseParams as Ma, validateWorktreesRemoveParams as Mc, AgentsFilesGetResultSchema as Md, ProjectsRegisterResultSchema as Mf, SessionGitHubStatusResultSchema as Mh, validateSessionsDiffParams as Mi, QuestionGetResultSchema as Ml, ComputerStatusParamsSchema as Mm, validateNodeInvokeResultParams as Mn, validateThemesImportParams as Mo, PreservedSessionWorktreeSchema as Mp, validateRequestFrame as Mr, validateUsersListModelAccountsParams as Ms, validateDevicePairRenameParams as Mt, CronScratchGetResultSchema as Mu, validateCanvasDocumentPreviewParams as N, validateSkillsProposalUpdateParams as Na, validateWorktreesRestoreParams as Nc, AgentsFilesListParamsSchema as Nd, ProjectsRemoveParamsSchema as Nf, readSessionWorkspaceRecoveryRequiredError as Nh, validateSessionsFilesAssetsParams as Ni, QuestionListParamsSchema as Nl, validateTerminalAttachParams as Nm, validateNodeListParams as Nn, validateThemesListParams as No, SessionsDeleteParamsSchema as Np, validateScopeUpgradeRequest as Nr, validateUsersListParams as Ns, validateDevicePairSetupCodeParams as Nt, CronScratchSetParamsSchema as Nu, validateBoardUpdateParams as O, validateSkillsProposalEvaluateParams as Oa, validateWorktreesCreateParams as Oc, AgentsWorkspaceListParamsSchema as Od, ProjectsAddResultSchema as Of, SessionGitHubOptionsResultSchema as Oh, validateSessionsCompanionStateParams as Oi, SessionDiscussionOpenResultSchema as Ol, SkillsProposalHistoryStatusParamsSchema as Om, validateNodeEventParams as On, validateTaskSuggestionsCreateParams as Oo, SessionsPatchManyResultSchema as Op, validateQuestionListParams as Or, validateUsersLinkEmailResult as Os, validateDevicePairApproveParams as Ot, CronRunLogEntrySchema as Ou, validateCanvasDocumentViewParams as P, validateSkillsProposalsListParams as Pa, validateWorktreesRetireSnapshotParams as Pc, AgentsFilesListResultSchema as Pd, ProjectsRemoveResultSchema as Pf, SystemAgentErrorDetailCodes as Ph, validateSessionsFilesGetParams as Pi, QuestionListResultSchema as Pl, validateTerminalCloseParams as Pm, validateNodePairApproveParams as Pn, validateThemesSetParams as Po, SessionsDeleteResultSchema as Pp, validateScopeUpgradeWait as Pr, validateUsersMentionableParams as Ps, validateDevicePairSetupStatusParams as Pt, CronScratchSetResultSchema as Pu, validateComputerInvokeParams as Q, validateSystemAgentSetupVerifyParams as Qa, WorktreesRetireSnapshotParamsSchema as Qc, PollParamsSchema as Qd, SessionSuggestionsAddResultSchema as Qf, SkillsDetailResultSchema as Qh, validateSessionsMessagesSubscribeParams as Qi, WebPushSubscribeParamsSchema as Ql, TerminalSessionInfoSchema as Qm, validatePluginsControlUiReportParams as Qn, validateTtsSpeakParams as Qo, TalkVoiceSetParamsSchema as Qp, validateSessionMemberAddParams as Qr, validateUsersUnlinkChannelIdentityParams as Qs, validateExecApprovalsGetParams as Qt, SystemAgentSetupVerifyResultSchema as Qu, validateChannelsPairingDismissParams as R, validateSkillsStatusParams as Ra, WorktreeRecordSchema as Rc, AgentIdentityParamsSchema as Rd, MessageReactionSummarySchema as Rf, readSystemAgentSessionInvalidatedErrorDetails as Rh, validateSessionsForkParams as Ri, QuestionRequestQuestionSchema as Rl, validateTerminalUploadParams as Rm, validateNodePendingAckParams as Rn, validateToolsGitHubAuthorizeCancelResult as Ro, SessionsStorageStatusResultSchema as Rp, validateSecretsStoreListParams as Rr, validateUsersPersonalFileGetParams as Rs, validateEnvironmentsDestroyParams as Rt, SystemAgentChatHistoryResultSchema as Ru, validateBackupStatusParams as S, validateSkillsCuratorStatusParams as Sa, validateWorkerPortalParams as Sc, ArtifactsGetParamsSchema as Sd, ProjectRecentProjectSchema as Sf, PluginInstallActivitySchema as Sh, validateSessionsCatalogReadParams as Si, SystemInfoParamsSchema as Sl, WebSearchTestParamsSchema as Sm, validateModelsAuthSetApiKeyParams as Sn, validateTalkSpeakParams as So, SessionVisibilitySetResultSchema as Sp, validateProjectsListParams as Sr, validateUsersGitHubDisconnectParams as Ss, validateCronUpdateParams as St, CronGetParamsSchema as Su, validateBoardEventParams as T, validateSkillsProposalActionParams as Ta, validateWorkerSessionsSpawnParams as Tc, AgentsWorkspaceFileSchema as Td, ProjectRecordSchema as Tf, GitHubPublicationTitleSchema as Th, validateSessionsCompactParams as Ti, SessionDiscussionInfoResultSchema as Tl, validateWebSearchTestParams as Tm, validateModelsListParams as Tn, validateTalkVoiceGetParams as To, SessionsSearchResultSchema as Tp, validateProjectsSearchRemoteParams as Tr, validateUsersLinkChannelIdentityParams as Ts, validateDesktopObserveResult as Tt, CronJobSchema as Tu, validateChatAbortParams as U, validateSkillsWorkshopReadParams as Ua, WorktreesGcParamsSchema as Uc, ConversationListResultSchema as Ud, SessionReactionsSetParamsSchema as Uf, AgentRuntimeRestrictionErrorDetailsSchema as Uh, validateSessionsGroupsDeleteParams as Ui, QuestionResolvedEventSchema as Ul, TerminalCloseParamsSchema as Um, validateNodeRenameParams as Un, validateToolsGitHubConfigureParams as Uo, SessionsRecoverParamsSchema as Up, validateSessionCatalogShareRoute as Ur, validateUsersSelfParams as Us, validateEnvironmentsSessionDestroyParams as Ut, SystemAgentSetupActivateParamsSchema as Uu, validateChannelsStatusParams as V, validateSkillsUploadChunkParams as Va, WorktreesBranchesResultSchema as Vc, ConversationListItemSchema as Vd, SessionReactionsListParamsSchema as Vf, isClawHubTrustErrorCode as Vh, validateSessionsGroupsDefaultsParams as Vi, QuestionResolveParamsSchema as Vl, TerminalAttachParamsSchema as Vm, validateNodePluginToolsUpdateParams as Vn, validateToolsGitHubAuthorizeStartParams as Vo, SESSION_CREATE_RETRY_WINDOW_MS as Vp, validateSecretsStoreSetParams as Vr, validateUsersPrefsSetParams as Vs, validateEnvironmentsPrepareResult as Vt, SystemAgentChatQuestionSchema as Vu, validateChatHistoryParams as W, validateStorageLocationsListParams as Wa, WorktreesGcResultSchema as Wc, ConversationSendParamsSchema as Wd, SessionReactionsSetResultSchema as Wf, readAgentRuntimeRestrictionErrorDetails as Wh, validateSessionsGroupsListParams as Wi, QuestionSchema as Wl, TerminalDataEventSchema as Wm, validateNodeSkillsUpdateParams as Wn, validateToolsGitHubStatusParams as Wo, SessionsRecoverResultSchema as Wp, validateSessionDiscussionInfoParams as Wr, validateUsersSelfResult as Ws, validateEnvironmentsSessionExecParams as Wt, SystemAgentSetupActivateResultSchema as Wu, validateChatToolTitlesParams as X, validateSystemAgentSetupAuthStartParams as Xa, WorktreesRemoveResultSchema as Xc, ConversationTurnResultSchema as Xd, SessionSuggestionStateSchema as Xf, SkillsCuratorStatusResultSchema as Xh, validateSessionsGroupsUpdateResult as Xi, WebPushPreferencesGetParamsSchema as Xl, TerminalOpenResultSchema as Xm, validatePluginsControlUiListParams as Xn, validateTranscriptsStatusParams as Xo, TalkVoiceGetParamsSchema as Xp, validateSessionGitHubPublishParams as Xr, validateUsersSetRoleResult as Xs, validateExecApprovalRequestParams as Xt, SystemAgentSetupDetectResultSchema as Xu, validateChatStartupParams as Y, validateSystemAgentSetupActivateStartParams as Ya, WorktreesRemoveParamsSchema as Yc, ConversationTurnReplySchema as Yd, SessionSuggestionSchema as Yf, SkillsCuratorStatusParamsSchema as Yh, validateSessionsGroupsUpdateParams as Yi, PushTestResultSchema as Yl, TerminalOpenParamsSchema as Ym, validatePluginsCatalogGetParams as Yn, validateTranscriptsListParams as Yo, TalkVoiceCompleteParamsSchema as Yp, validateSessionGitHubOptionsParams as Yr, validateUsersSetRoleParams as Ys, validateExecApprovalGrantsRevokeParams as Yt, SystemAgentSetupDetectParamsSchema as Yu, validateCommandsListParams as Z, validateSystemAgentSetupDetectParams as Za, WorktreesRestoreParamsSchema as Zc, MessageActionParamsSchema as Zd, SessionSuggestionsAddParamsSchema as Zf, ModelsListParamsSchema as Zh, validateSessionsListParams as Zi, WebPushPreferencesSetParamsSchema as Zl, TerminalResizeParamsSchema as Zm, validatePluginsControlUiReloadParams as Zn, validateTranscriptsSummarizeParams as Zo, TalkVoiceSelectionSchema as Zp, validateSessionGitHubStatusParams as Zr, validateUsersUnlinkAuthProfileParams as Zs, validateExecApprovalResolveParams as Zt, SystemAgentSetupVerifyParamsSchema as Zu, validateArtifactsGetParams as _, validateSessionsTitlePrepareParams as _a, validateWorkerDesktopLaunchResult as _c, AuditEventSchema as _d, PROJECTS_LIST_MAX_CHECKOUTS_PER_PROJECT as _f, SessionsCatalogListResultSchema as _h, validateSessionsBranchesSwitchParams as _i, TaskSuggestionsCreateResultSchema as _l, PluginsSkillsReadParamsSchema as _m, validateMentionsListResult as _n, validateTalkSessionCancelOutputResult as _o, SessionSharingActionSchema as _p, validatePresenceQueryResult as _r, validateUsersAuthConnectStartParams as _s, validateCronRunParams as _t, CronAddJobResultSchema as _u, validateAgentsDeleteParams as a, validateSessionsPreviewParams as aa, validateWebPushSubscribeParams as ac, COMMAND_DESCRIPTION_MAX_LENGTH as ad, BackupStatusResultSchema as af, SessionCatalogPullRequestSummarySchema as ah, validateSessionReactionEvent as ai, PortalOpenParamsSchema as al, ThemesListParamsSchema as am, validateGatewaySuspendHandoffParams as an, validateTalkClientCreateResult as ao, SessionTypingResultSchema as ap, validatePluginsSearchParams as ar, validateUpdateRunParams as as, validateConfigSchemaParams as at, FsListDirResultSchema as au, validateAuditListParams as b, validateSkillsBinsParams as ba, validateWorkerHeartbeatParams as bc, ArtifactSummarySchema as bd, ProjectDefaultRepositorySchema as bf, SessionsCatalogStartTerminalParamsSchema as bh, validateSessionsCatalogImportParams as bi, TaskSuggestionsListParamsSchema as bl, WebSearchStatusParamsSchema as bm, validateModelsAuthOrderSetParams as bn, validateTalkSessionSteerParams as bo, SessionSharingIdentitySchema as bp, validateProgressCardRefreshParams as br, validateUsersGitHubAuthorizePollParams as bs, validateCronScratchSetParams as bt, CronDeclarativeAddResultSchema as bu, validateAgentsFilesSetParams as c, validateSessionsReclaimResult as ca, validateWebPushVapidPublicKeyParams as cc, TalkSessionAcknowledgeMarkParamsSchema as cd, StorageLocationsProbeParamsSchema as cf, SessionCatalogTranscriptItemSchema as ch, validateSessionSuggestionsAddParams as ci, SessionPortalCloseParamsSchema as cl, UiCommandParamsSchema as cm, validateGatewaySuspendResumeParams as cn, validateTalkClientToolCallParams as co, SessionMemberMutationResultSchema as cp, validatePluginsSetEnabledParams as cr, validateUpdateRunsGetParams as cs, validateConversationListParams as ct, DesktopObserveResultSchema as cu, validateAgentsWorkspaceGetParams as d, validateSessionsResolveParams as da, validateWizardStartParams as dc, ChannelsPairingCliListResultSchema as dd, validateMigrationsMemoryPlanParams as df, SessionsCatalogContinueParamsSchema as dh, validateSessionTypingParams as di, TaskSuggestionEventSchema as dl, UiFocusCommandSchema as dm, validateHooksStatusParams as dn, validateTalkConfigParams as do, SessionMembersListEvidenceResultSchema as dp, validatePluginsUninstallParams as dr, validateUpdateRunsListResult as ds, validateConversationTurnParams as dt, DesktopSourceSchema as du, validateSessionsMoveResult as ea, validateWakeParams as ec, SystemChangeKindSchema as ed, WakeParamsSchema as ef, EnvironmentsSessionCreateParamsSchema as eg, TerminalUploadResultSchema as eh, validateSessionMembersListParams as ei, PortalChangedEventSchema as el, ThemeDefinitionSchema as em, validateExecApprovalsNodeSetParams as en, validateSystemInfoParams as eo, SessionSuggestionsListResultSchema as ep, validatePluginsInspectParams as er, validateUpdateHoldParams as es, validateConfigApplyParams as et, WebPushUnsubscribeParamsSchema as eu, validateAgentsWorkspaceListParams as f, validateSessionsRewindParams as fa, validateWizardStatusParams as fc, ChannelsPairingCodeApproveResultSchema as fd, MAX_MEMORY_MIGRATION_ITEMS as ff, SessionsCatalogContinueResultSchema as fh, validateSessionVisibilitySetParams as fi, TaskSuggestionResolutionSchema as fl, UiNavigateCommandSchema as fm, validateLogsTailParams as fn, validateTalkConfigResult as fo, SessionMembersListParamsSchema as fp, validatePollParams as fr, validateUpdateStatusParams as fs, validateCronAddParams as ft, ExecApprovalGetParamsSchema as fu, validateArtifactsDownloadParams as g, validateSessionsStorageParams as ga, validateWorkerDesktopLaunchParams as gc, ChannelsPairingListResultSchema as gd, PROJECTS_LIST_DEFAULT_LIMIT as gf, SessionsCatalogListParamsSchema as gh, validateSessionsBranchesListParams as gi, TaskSuggestionsCreateParamsSchema as gl, PluginSkillFileSchema as gm, validateMentionsListParams as gn, validateTalkSessionCancelOutputParams as go, SessionPublicShareSetResultSchema as gp, validatePresenceQueryParams as gr, validateUsersAuthConnectCatalogParams as gs, validateCronRemoveParams as gt, ExecApprovalsSetParamsSchema as gu, validateApprovalResolveParams as h, validateSessionsSetInvolvementParams as ha, validateWorkerConnectRequestFrame as hc, ChannelsPairingListParamsSchema as hd, MigrationsMemoryPlanParamsSchema as hf, SessionsCatalogImportResultSchema as hh, validateSessionsAssignOwnerParams as hi, TaskSuggestionsAcceptResultSchema as hl, UiSplitCommandSchema as hm, validateMentionsDismissParams as hn, validateTalkSessionAppendAudioParams as ho, SessionPublicShareSetParamsSchema as hp, validatePortalOpenParams as hr, validateUsersAuthConnectCancelParams as hs, validateCronListParams as ht, ExecApprovalsGetParamsSchema as hu, validateAgentsCreateParams as i, validateSessionsPluginPatchParams as ia, validateWebPushPreferencesSetParams as ic, normalizeSystemAgentPluginReference as id, BackupStatusParamsSchema as if, SessionCatalogLocatorSchema as ih, validateSessionPublicShareSetParams as ii, PortalListResultSchema as il, ThemesImportParamsSchema as im, validateFsListDirResult as in, validateTalkClientCreateParams as io, SessionTypingParamsSchema as ip, validatePluginsReloadParams as ir, validateUpdateRunChangedEvent as is, validateConfigSchemaLookupResult as it, FsListDirParamsSchema as iu, validateBoardWidgetGrantParams as j, validateSkillsProposalRequestRevisionParams as ja, validateWorktreesRecoverRemovalParams as jc, AgentsFilesGetParamsSchema as jd, ProjectsRegisterParamsSchema as jf, SessionGitHubStatusParamsSchema as jh, validateSessionsDescribeParams as ji, QuestionGetParamsSchema as jl, ComputerInvokeParamsSchema as jm, validateNodeInvokeProgressParams as jn, validateThemesGetParams as jo, SessionsPatchParamsSchema as jp, validateQuestionWaitAnswerParams as jr, validateUsersListChannelIdentitiesResult as js, validateDevicePairRemoveParams as jt, CronScratchGetParamsSchema as ju, validateBoardWidgetAppViewParams as k, validateSkillsProposalEventsListParams as ka, validateWorktreesGcParams as kc, AgentsWorkspaceListResultSchema as kd, ProjectsListParamsSchema as kf, SessionGitHubPublicationResultSchema as kh, validateSessionsCreateParams as ki, SessionDiscussionStateSchema as kl, validateSkillsProposalHistoryScanParams as km, validateNodeHostStatsPayload as kn, validateTaskSuggestionsDismissParams as ko, SessionsPatchManyTargetSchema as kp, validateQuestionRequestParams as kr, validateUsersListAuthLinksParams as ks, validateDevicePairListParams as kt, CronRunParamsSchema as ku, validateAgentsListParams as l, validateSessionsRecoverParams as la, validateWizardCancelParams as lc, ChannelsPairingApproveParamsSchema as ld, StorageLocationsProbeResultSchema as lf, SessionsCatalogArchiveParamsSchema as lh, validateSessionSuggestionsListParams as li, SessionPortalListParamsSchema as ll, UiCommandResultSchema as lm, validateGatewaySuspendStatusParams as ln, validateTalkClientToolCallResult as lo, SessionMemberRemoveParamsSchema as lp, validatePluginsUiDescriptorsParams as lr, validateUpdateRunsGetResult as ls, validateConversationSendParams as lt, DesktopReleaseParamsSchema as lu, validateApprovalHistoryParams as m, validateSessionsSendParams as ma, validateWorkerComputerParams as mc, ChannelsPairingDismissResultSchema as md, MigrationsMemoryApplyParamsSchema as mf, SessionsCatalogImportParamsSchema as mh, validateSessionsActivitySummaryEnsureParams as mi, TaskSuggestionsAcceptParamsSchema as ml, UiSidebarCommandSchema as mm, validateMentionsChangedEvent as mn, validateTalkSessionAcknowledgeMarkParams as mo, SessionPublicShareSchema as mp, validatePortalListParams as mr, validateUsersAuthConnectAnswerParams as ms, validateCronHistoryParams as mt, ExecApprovalResolveParamsSchema as mu, validateAgentParams as n, validateSessionsPatchManyParams as na, validateWebLoginWaitParams as nc, SystemChangesListParamsSchema as nd, BackupRunRecordSchema as nf, EnvironmentsSessionStatusParamsSchema as ng, SessionCatalogDescriptorSchema as nh, validateSessionPortalListParams as ni, PortalCloseResultSchema as nl, ThemePaletteSchema as nm, validateExecApprovalsSetParams as nn, validateTalkCatalogParams as no, SessionSuggestionsResolveResultSchema as np, validatePluginsListParams as nr, validateUpdateReportParams as ns, validateConfigPatchParams as nt, HooksStatusParamsSchema as nu, validateAgentsFilesGetParams as o, validateSessionsProviderReviewContinueParams as oa, validateWebPushTestParams as oc, CommandsListParamsSchema as od, StorageLocationsListParamsSchema as of, SessionCatalogSchema as oh, validateSessionReactionsListParams as oi, PortalOpenResultSchema as ol, ThemesSetParamsSchema as om, validateGatewaySuspendPrepareParams as on, validateTalkClientMutationResult as oo, SessionMemberAddParamsSchema as op, validatePluginsSessionActionParams as or, validateUpdateRunRecord as os, validateConfigSetParams as ot, DesktopLaunchParamsSchema as ou, validateApprovalGetParams as p, validateSessionsSearchParams as pa, validateWorkerAdmissionHandshake as pc, ChannelsPairingDismissParamsSchema as pd, MigrationProtocolSchemas as pf, SessionsCatalogHostEventSchema as ph, validateSessionsAbortParams as pi, TaskSuggestionSchema as pl, UiPanelCommandSchema as pm, validateMcpAuthLoginParams as pn, validateTalkModeParams as po, SessionMembersListResultSchema as pp, validatePortalCloseParams as pr, validateUpdateStatusResult as ps, validateCronGetParams as pt, ExecApprovalRequestParamsSchema as pu, validateChatMetadataParams as q, validateSystemAgentChatParams as qa, WorktreesRecoverRemovalParamsSchema as qc, ConversationTurnCancelResultSchema as qd, SessionSuggestionEventSchema as qf, SkillsCuratorActionParamsSchema as qh, validateSessionsGroupsPutParams as qi, QuestionWaitAnswerResultSchema as ql, TerminalInputParamsSchema as qm, validatePluginsCatalogBrowseParams as qn, validateTranscriptsExportParams as qo, TALK_VOICE_CHANGE_TIMEOUT_MS as qp, validateSessionDiscussionOpenResult as qr, validateUsersSetDisplayNameParams as qs, validateExecApprovalGetParams as qt, SystemAgentSetupAuthStartParamsSchema as qu, validateAgentWaitParams as r, validateSessionsPatchParams as ra, validateWebPushPreferencesGetParams as rc, SystemChangesListResultSchema as rd, BackupRunRetentionSchema as rf, SessionCatalogHostSchema as rh, validateSessionPortalOpenParams as ri, PortalListParamsSchema as rl, ThemesGetParamsSchema as rm, validateFsListDirParams as rn, validateTalkClientCloseParams as ro, SessionTypingEventSchema as rp, validatePluginsRefreshParams as rr, validateUpdateReportResult as rs, validateConfigSchemaLookupParams as rt, FsDirEntrySchema as ru, validateAgentsFilesListParams as s, validateSessionsReclaimParams as sa, validateWebPushUnsubscribeParams as sc, CommandsListResultSchema as sd, StorageLocationsListResultSchema as sf, SessionCatalogSessionSchema as sh, validateSessionReactionsSetParams as si, PortalSummarySchema as sl, UiClosePaneCommandSchema as sm, validateGatewaySuspendPrepareResult as sn, validateTalkClientSteerParams as so, SessionMemberEvidenceSchema as sp, validatePluginsSessionActionResult as sr, validateUpdateRunResult as ss, validateConnectParams as st, DesktopObserveParamsSchema as su, validateAgentIdentityParams as t, validateSessionsObserverVisibilityParams as ta, validateWebLoginStartParams as tc, SystemChangeSourceSchema as td, BackupRunLocationSchema as tf, EnvironmentsSessionDestroyParamsSchema as tg, SessionCatalogCapabilitiesSchema as th, validateSessionPortalCloseParams as ti, PortalCloseParamsSchema as tl, ThemeModeSchema as tm, validateExecApprovalsNodeSnapshot as tn, validateSystemInfoResult as to, SessionSuggestionsResolveParamsSchema as tp, validatePluginsInstallParams as tr, validateUpdateHoldResult as ts, validateConfigGetParams as tt, WebPushVapidPublicKeyParamsSchema as tu, validateAgentsUpdateParams as u, validateSessionsResetParams as ua, validateWizardNextParams as uc, ChannelsPairingApproveResultSchema as ud, validateMigrationsMemoryApplyParams as uf, SessionsCatalogArchiveResultSchema as uh, validateSessionSuggestionsResolveParams as ui, SessionPortalOpenParamsSchema as ul, UiCommandSchema as um, validateGatewaySuspendStatusResult as un, validateTalkClientTranscriptParams as uo, SessionMemberSchema as up, validatePluginsUiDescriptorsResult as ur, validateUpdateRunsListParams as us, validateConversationTurnCancelParams as ut, DesktopReleaseResultSchema as uu, validateArtifactsListParams as v, validateSessionsUsageParams as va, validateWorkerDesktopObserveParams as vc, AuditListParamsSchema as vd, PROJECTS_LIST_MAX_IDENTITY_PROBES as vf, SessionsCatalogReadParamsSchema as vh, validateSessionsCatalogArchiveParams as vi, TaskSuggestionsDismissParamsSchema as vl, PluginsSkillsReadResultSchema as vm, validateMessageActionParams as vn, validateTalkSessionCloseParams as vo, SessionSharingEventSchema as vp, validateProgressCardGetParams as vr, validateUsersAuthConnectStatusParams as vs, validateCronRunsParams as vt, CronAddParamsSchema as vu, validateBoardDataReadParams as w, validateSkillsInstallParams as wa, validateWorkerSessionsSendParams as wc, AgentsWorkspaceEntrySchema as wd, ProjectRecentSchema as wf, GitHubPublicationBodySchema as wh, validateSessionsCleanupParams as wi, SessionDiscussionInfoParamsSchema as wl, validateWebSearchStatusParams as wm, validateModelsAuthStatusParams as wn, validateTalkVoiceCompleteParams as wo, SessionsSearchParamsSchema as wp, validateProjectsRemoveParams as wr, validateUsersLinkAuthProfileParams as ws, validateDesktopObserveParams as wt, CronHistoryResultSchema as wu, validateAuditRunInspectParams as x, validateSkillsCuratorActionParams as xa, validateWorkerLiveEventParams as xc, ArtifactsDownloadParamsSchema as xd, ProjectRecentFolderSchema as xf, SessionsCatalogStartTerminalResultSchema as xh, validateSessionsCatalogListParams as xi, TaskSuggestionsListResultSchema as xl, WebSearchStatusResultSchema as xm, validateModelsAuthRefreshParams as xn, validateTalkSessionSubmitToolResultParams as xo, SessionVisibilitySetParamsSchema as xp, validateProjectsAddParams as xr, validateUsersGitHubAuthorizeStartParams as xs, validateCronStatusParams as xt, CronDeliveryPreviewSchema as xu, validateAuditActivityListParams as y, validateSessionsViewerPresenceSetParams as ya, validateWorkerDesktopObserveResult as yc, AuditListResultSchema as yd, ProjectCheckoutSchema as yf, SessionsCatalogReadResultSchema as yh, validateSessionsCatalogContinueParams as yi, TaskSuggestionsDismissResultSchema as yl, validatePluginsSkillsReadParams as ym, validateModelsAuthLogoutParams as yn, validateTalkSessionCreateParams as yo, SessionSharingEvidenceEventSchema as yp, validateProgressCardPutParams as yr, validateUsersGitHubAuthorizeCancelParams as ys, validateCronScratchGetParams as yt, CronAddResultSchema as yu, validateChannelsPairingListParams as z, validateSkillsUpdateParams as za, WorktreeRepositoryStatusSchema as zc, AgentIdentityResultSchema as zd, SessionReactionEventSchema as zf, ClawHubTrustErrorCodes as zh, validateSessionsGoalClearParams as zi, QuestionRequestResultSchema as zl, validateTerminalUploadResult as zm, validateNodePendingDrainParams as zn, validateToolsGitHubAuthorizePollParams as zo, SessionsSetInvolvementParamsSchema as zp, validateSecretsStoreListResult as zr, validateUsersPersonalFileSetParams as zs, validateEnvironmentsListParams as zt, SystemAgentChatHistoryTurnSchema as zu };
