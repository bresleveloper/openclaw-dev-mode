import { c as isRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { C as isThemeId, r as THEME_ARTWORK_ID_PATTERN, w as normalizeThemeMode } from "./theme-_hQKgfH-.mjs";
import { t as isNonEmptyProtocolString } from "./protocol-value-normalization-Oati9UF1.mjs";
import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { $ as WorkerComputerParamsSchema, A as WorkerLiveEventParamsSchema, B as WorkerSessionsSendParamsSchema, F as WorkerPortalParamsSchema, H as WorkerSessionsSpawnParamsSchema, K as WorkerTranscriptCommitParamsSchema, S as WorkerAdmissionHandshakeSchema, T as WorkerHeartbeatParamsSchema, nt as withSince, rt as FailoverReasonSchema, w as WorkerConnectRequestFrameSchema } from "./worker-admission-BB3C4gz4.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXfMhak.mjs";
import { a as NonEmptyString, i as InputProvenanceSchema, s as SessionLabelString, t as ChatSendSessionKeyString } from "./primitives-C-2-W5SF.mjs";
import { _ as SessionsReclaimParamsSchema, g as SessionsMoveResultSchema, y as SessionsReclaimResultSchema } from "./session-placement-validators-C2Fz-CfU.mjs";
import { a as SessionRepositorySourceSchema, c as SessionToolOverridesSchema, f as SessionsProviderReviewContinueParamsSchema, i as SessionPermissionModeSchema, l as SessionSharingRoleSchema, m as SessionsActivitySummaryEnsureParamsSchema, o as SessionRowSchema, t as SessionCreatedActorSchema, u as SessionVisibilitySchema } from "./sessions-row-CU6LvmZ_.mjs";
import { i as SessionParticipantSchema } from "./session-participant-Cj8YyLga.mjs";
import { $ as SkillsProposalReviseParamsSchema, $t as EnvironmentsCreateParamsSchema, A as ModelsAuthStatusParamsSchema, B as SkillsProposalActionParamsSchema, Bt as SecretsResolveParamsSchema, D as ModelsAuthRefreshParamsSchema, E as ModelsAuthOrderSetParamsSchema, Et as ToolsGitHubAuthorizePollResultSchema, Ft as ToolsGitHubStatusResultSchema, Gt as SecretsStoreMutationResultSchema, H as SkillsProposalCreateParamsSchema, Ht as SecretsStoreDeleteParamsSchema, I as SkillsBinsParamsSchema, It as ToolsInvokeParamsSchema, J as SkillsProposalInspectParamsSchema, Jt as GatewayContextWindowOptionSchema, K as SkillsProposalEventsListParamsSchema, Kt as SecretsStoreSetParamsSchema, L as SkillsDetailParamsSchema, O as ModelsAuthSetApiKeyParamsSchema, Ot as ToolsGitHubAuthorizeStartParamsSchema, Pt as ToolsGitHubStatusParamsSchema, T as ModelsAuthLogoutParamsSchema, Tt as ToolsGitHubAuthorizePollParamsSchema, U as SkillsProposalDecisionParamsSchema, Ut as SecretsStoreListParamsSchema, Vt as SecretsResolveResultSchema, W as SkillsProposalEvaluateParamsSchema, Wt as SecretsStoreListResultSchema, Yt as GatewayThinkingLevelOptionSchema, Z as SkillsProposalRequestRevisionParamsSchema, _ as AgentsUpdateParamsSchema, an as EnvironmentsPrepareParamsSchema, at as SkillsSecurityVerdictsParamsSchema, d as AgentsFilesListParamsSchema, dn as WorkerDesktopAppIdSchema, dt as SkillsUploadBeginParamsSchema, et as SkillsProposalUpdateParamsSchema, fn as WorkerDesktopLaunchParamsSchema, ft as SkillsUploadChunkParamsSchema, gt as ToolsEffectiveParamsSchema, h as AgentsListParamsSchema, hn as WorkerDesktopObserveResultSchema, i as AgentsCreateParamsSchema, j as ModelsProbeParamsSchema, jt as ToolsGitHubConfigureParamsSchema, k as ModelsAuthSetApiKeyResultSchema, kt as ToolsGitHubAuthorizeStartResultSchema, l as AgentsFilesGetParamsSchema, lt as SkillsStatusParamsSchema, mn as WorkerDesktopObserveParamsSchema, mt as SkillsWorkshopReadParamsSchema, o as AgentsDeleteParamsSchema, on as EnvironmentsPrepareResultSchema, p as AgentsFilesSetParamsSchema, pn as WorkerDesktopLaunchResultSchema, pt as SkillsUploadCommitParamsSchema, qt as GatewayAgentRuntimeSchema, rn as EnvironmentsListParamsSchema, rt as SkillsSearchParamsSchema, sn as EnvironmentsStatusParamsSchema, st as SkillsSkillCardParamsSchema, tn as EnvironmentsDestroyParamsSchema, tt as SkillsProposalsListParamsSchema, ut as SkillsUpdateParamsSchema, vt as ToolsGitHubAuthorizeCancelParamsSchema, yt as ToolsGitHubAuthorizeCancelResultSchema, z as SkillsInstallParamsSchema } from "./agents-models-skills-ChHh3UoN.mjs";
import { $ as UsersGitHubDisconnectParamsSchema, A as PersonalGitHubAccountSchema, At as UsersSetRoleParamsSchema, B as UsersAuthConnectCatalogParamsSchema, Dt as UsersSetAvatarResultSchema, Et as UsersSetAvatarParamsSchema, Ft as UsersUnlinkChannelIdentityResultSchema, G as UsersAuthConnectStatusParamsSchema, Gt as WizardStepSchema, Ht as WizardStartResultSchema, It as McpAuthLoginParamsSchema, Jt as ChatAccountSelectionSchema, Kt as SetupInferenceActivationRejectionSchema, Lt as WizardAnswerSchema, M as PersonalGitHubStatusSchema, Mt as UsersUnlinkAuthProfileParamsSchema, Ot as UsersSetDisplayNameParamsSchema, Pt as UsersUnlinkChannelIdentityParamsSchema, R as UsersAuthConnectAnswerParamsSchema, Rt as WizardCancelParamsSchema, St as UsersSelectModelAccountParamsSchema, Tt as UsersSelfResultSchema, U as UsersAuthConnectStartParamsSchema, Ut as WizardStatusParamsSchema, Vt as WizardStartParamsSchema, Y as UsersGitHubAuthorizePollParamsSchema, Yt as ModelAuthProfileIdSchema, Z as UsersGitHubAuthorizeStartParamsSchema, _ as ApprovalScopeSchema, at as UsersLinkChannelIdentityParamsSchema, bt as UsersPrefsSetParamsSchema, ct as UsersLinkEmailResultSchema, d as ApprovalHistoryParamsSchema, dt as UsersListChannelIdentitiesParamsSchema, ft as UsersListChannelIdentitiesResultSchema, h as ApprovalResolveParamsSchema, ht as UsersListParamsSchema, j as PersonalGitHubGenerationSchema, jt as UsersSetRoleResultSchema, kt as UsersSetDisplayNameResultSchema, l as ApprovalGetParamsSchema, lt as UsersListAuthLinksParamsSchema, ot as UsersLinkChannelIdentityResultSchema, pt as UsersListModelAccountsParamsSchema, q as UsersGitHubAuthorizeCancelParamsSchema, qt as SetupInferenceFailureStatusSchema, rt as UsersLinkAuthProfileParamsSchema, s as ApprovalChannelReviewerSchema, st as UsersLinkEmailParamsSchema, tt as UsersGitHubStatusParamsSchema, vt as UsersPrefsGetParamsSchema, wt as UsersSelfParamsSchema, z as UsersAuthConnectCancelParamsSchema, zt as WizardNextParamsSchema } from "./approval-result-validators-_fnoR1Wq.mjs";
import { t as SESSION_AGENT_ATTENTION_ICON_IDS } from "./session-agent-status-BSzRJm_2.mjs";
import { $ as SessionsGroupsListParamsSchema, A as SessionsCompanionAskParamsSchema, An as ConfigSetParamsSchema, B as SessionsFilesGetParamsSchema, Bn as UpdateRunChangedEventSchema, Br as PluginsUiDescriptorsResultSchema, Cn as ConfigApplyParamsSchema, Cr as PluginsInspectParamsSchema, Ct as ChatInjectParamsSchema, Dn as ConfigSchemaLookupResultSchema, Dr as PluginsListParamsSchema, E as SessionsBranchesSwitchParamsSchema, En as ConfigSchemaLookupParamsSchema, Fn as UpdateReportResultSchema, Fr as PluginsSessionActionParamsSchema, Gn as UpdateRunsListParamsSchema, Gt as MentionsListParamsSchema, H as SessionsFilesListParamsSchema, Hn as UpdateRunResultSchema, In as UpdateRunParamsSchema, Ir as PluginsSessionActionResultSchema, J as SessionsForkParamsSchema, Jt as UsersMentionableResultSchema, K as SessionsFilesSetParamsSchema, Kn as UpdateRunsListResultSchema, Kt as MentionsListResultSchema, L as SessionsDescribeParamsSchema, Lr as PluginsSetEnabledParamsSchema, Lt as HumanMentionsSchema, M as SessionsCompanionResetParamsSchema, Mn as UpdateHoldParamsSchema, Nn as UpdateHoldResultSchema, Nr as PluginsSearchParamsSchema, Nt as LogsTailParamsSchema, O as SessionsCleanupParamsSchema, On as ConfigSchemaParamsSchema, Ot as ChatSendParamsSchema, P as SessionsCompanionStateParamsSchema, Pn as UpdateReportParamsSchema, Q as SessionsGroupsDeleteParamsSchema, R as SessionsDiffParamsSchema, Rn as UpdateStatusParamsSchema, S as SessionsAssignOwnerParamsSchema, St as ChatHistoryParamsSchema, Tn as ConfigPatchParamsSchema, Tr as PluginsInstallParamsSchema, Tt as ChatMetadataParamsSchema, Un as UpdateRunsGetParamsSchema, Ut as MentionsChangedEventSchema, Vn as UpdateRunRecordSchema, Vr as PluginsUninstallParamsSchema, W as SessionsFilesRevealParamsSchema, Wn as UpdateRunsGetResultSchema, Wt as MentionsDismissParamsSchema, X as SessionsGroupsDefaultsParamsSchema, Xt as ErrorShapeSchema, Yr as PluginCredentialDescriptorSchema, Yt as ConnectParamsSchema, Z as SessionsGroupsDefaultsResultSchema, at as SessionsGroupsUpdateResultSchema, bn as GatewaySuspendStatusResultSchema, br as PluginsControlUiReportParamsSchema, cn as GatewaySuspendHandoffParamsSchema, ct as SessionsObserverVisibilityParamsSchema, dr as PluginsCatalogCategoriesParamsSchema, dt as SessionsPreviewParamsSchema, en as RequestFrameSchema, et as SessionsGroupsListResultSchema, fn as GatewaySuspendPrepareParamsSchema, ft as SessionsResetParamsSchema, gt as SessionsUsageParamsSchema, hn as GatewaySuspendResumeParamsSchema, ht as SessionsSendParamsSchema, it as SessionsGroupsUpdateParamsSchema, jr as PluginsReloadParamsSchema, jt as ChatToolTitlesParamsSchema, k as SessionsCompactParamsSchema, kr as PluginsRefreshParamsSchema, kt as ChatStartupParamsSchema, lr as PluginsCatalogBrowseParamsSchema, mn as GatewaySuspendPrepareResultSchema, nt as SessionsGroupsPutParamsSchema, ot as SessionsMessagesSubscribeParamsSchema, pr as PluginsCatalogGetParamsSchema, pt as SessionsRewindParamsSchema, qn as CapabilityConsentErrorDetailsSchema, qt as UsersMentionableParamsSchema, rr as PluginJsonValueSchema, rt as SessionsGroupsRenameParamsSchema, st as SessionsMessagesUnsubscribeParamsSchema, tt as SessionsGroupsMutationResultSchema, ut as SessionsPluginPatchParamsSchema, vn as GatewaySuspendStatusParamsSchema, vr as PluginsControlUiListParamsSchema, vt as ChatAbortParamsSchema, w as SessionsBranchesListParamsSchema, wn as ConfigGetParamsSchema, wt as ChatMessageGetParamsSchema, x as SessionsAbortParamsSchema, xr as PluginsControlUiStatusParamsSchema, xt as ChatHistoryActivitySchema, yr as PluginsControlUiReloadParamsSchema, yt as ChatAttachmentsSchema, zn as UpdateStatusResultSchema, zr as PluginsUiDescriptorsParamsSchema } from "./sessions-KsldKmtI.mjs";
import { n as MAX_TERMINAL_UPLOAD_BYTES, t as MAX_TERMINAL_UPLOAD_BASE64_LENGTH } from "./terminal-constants-ChTTPdyr.mjs";
import { r as SKILL_LIBRARY_MAX_FILE_BYTES } from "./skill-library-C7RO5Y8q.mjs";
import { _ as TranscriptsStatusParamsSchema, d as TranscriptsExportParamsSchema, h as TranscriptsListParamsSchema, p as TranscriptsGetParamsSchema, y as TranscriptsSummarizeParamsSchema } from "./transcripts-DlCB8MI2.mjs";
import { n as GatewayProcessMemorySchema, t as GatewayEventLoopHealthSchema } from "./runtime-vitals-BAzwMWci.mjs";
import { c as AuditActivityListParamsSchema } from "./audit-activity-YfkV8ffO.mjs";
import { c as AuditRunInspectParamsSchema } from "./audit-run-validators-DIyIA-46.mjs";
import { A as TalkSpeakParamsSchema, C as TalkSessionCancelOutputResultSchema, F as WebLoginWaitParamsSchema, M as TtsSpeakParamsSchema, O as TalkSessionSteerParamsSchema, P as WebLoginStartParamsSchema, S as TalkSessionCancelOutputParamsSchema, T as TalkSessionCreateParamsSchema, _ as TalkConfigParamsSchema, a as ChannelsStopParamsSchema, b as TalkModeParamsSchema, d as TalkClientCreateResultSchema, f as TalkClientMutationResultSchema, g as TalkClientTranscriptParamsSchema, h as TalkClientToolCallResultSchema, k as TalkSessionSubmitToolResultParamsSchema, l as TalkClientCloseParamsSchema, m as TalkClientToolCallParamsSchema, n as ChannelsStartParamsSchema, p as TalkClientSteerParamsSchema, r as ChannelsStatusParamsSchema, s as TalkCatalogParamsSchema, t as ChannelsLogoutParamsSchema, u as TalkClientCreateParamsSchema, v as TalkConfigResultSchema, w as TalkSessionCloseParamsSchema, x as TalkSessionAppendAudioParamsSchema } from "./channels-CdsxwbSe.mjs";
import { E as NodeSkillsUpdateParamsSchema, _ as NodePendingEnqueueParamsSchema, b as NodePluginToolsUpdateParamsSchema, c as NodeInvokeResultParamsSchema, d as NodePairListParamsSchema, f as NodePairRejectParamsSchema, h as NodePendingDrainParamsSchema, i as NodeHostStatsPayloadSchema, l as NodeListParamsSchema, m as NodePendingAckParamsSchema, n as NodeEventParamsSchema, o as NodeInvokeParamsSchema, p as NodePairRemoveParamsSchema, s as NodeInvokeProgressParamsSchema, t as NodeDescribeParamsSchema, u as NodePairApproveParamsSchema, w as NodeRenameParamsSchema, x as NodePresenceActivityPayloadSchema } from "./nodes-CEMeSm8v.mjs";
import { n as SessionsResolveParamsSchema } from "./sessions-resolve-BANDk8-_.mjs";
import { Type } from "typebox";
import { Value } from "typebox/value";
//#region packages/gateway-protocol/src/server-capabilities.ts
/** Stable feature names advertised in Gateway hello responses. */
const GATEWAY_SERVER_CAPS = {
	BOARD_WIDGET_PUT_CANVAS_DOC: "board-widget-put-canvas-doc",
	CHAT_SEND_ROUTING_CONTRACT: "chat-send-routing-contract",
	GATEWAY_RESTART_TARGET_SAFE: "gateway-restart-target-safe-v1",
	MODEL_CATALOG_SNAPSHOT: "model-catalog-snapshot",
	NODE_WORKER_BUNDLE_RETENTION: "node-worker-bundle-retention-v1",
	NODE_WORKER_BUNDLE_STATUS: "node-worker-bundle-status-v1",
	NODE_WORKER_CAPTURED_EXEC_POLICY: "node-worker-captured-exec-policy",
	NODE_WORKER_ENVIRONMENT_SESSION: "node-worker-environment-session-v1",
	NODE_WORKER_PORTAL_STREAM: "node-worker-portal-stream-v1",
	PUBLISHED_MODEL_CATALOG: "published-model-catalog",
	PROFILE_BINDING: "profile-binding-v1",
	PROGRESS_CARD_AGENT_SCOPE: "progress-card-agent-scope-v1",
	SESSION_SCOPED_CHAT_METADATA: "session-scoped-chat-metadata",
	SESSION_SCOPED_MODEL_CATALOG: "session-scoped-model-catalog",
	SESSION_UNREAD_ACK_CONTRACT: "session-unread-ack-contract",
	SESSION_GOAL_START: "session-goal-start-v1",
	SESSION_SETTINGS_CONTRACT: "session-settings-contract",
	SESSION_SETTINGS_CAS: "session-settings-cas-v1",
	SYSTEM_AGENT_WIZARD_CANCEL: "openclaw-chat-wizard-cancel",
	SYSTEM_AGENT_SETUP_MODEL_REF: "openclaw-setup-model-ref",
	TASK_SUGGESTIONS_ACCEPT_MODES: "taskSuggestions.acceptModes"
};
//#endregion
//#region packages/gateway-protocol/src/schema/session-placement-state.ts
function isCloudWorkerPlacementState(state) {
	return state !== void 0 && state !== "local" && state !== "reclaimed";
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
	const code = isClawHubTrustErrorCode(details.clawhubTrustCode) ? details.clawhubTrustCode : void 0;
	const version = readNonBlankString(details.version);
	const warning = readNonBlankString(details.warning);
	if (!code && !version && !warning) return;
	return {
		...code ? { clawhubTrustCode: code } : {},
		...version ? { version } : {},
		...warning ? { warning } : {}
	};
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
	effectiveFastMode: Type.Optional(Type.Union([Type.Boolean(), Type.Literal("auto")])),
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
	/** Manifest-owned decision choices, separate from conversational model routing. */
	decisionModels: Type.Optional(Type.Array(closedObject({
		id: NonEmptyString,
		provider: NonEmptyString,
		name: NonEmptyString,
		pluginId: NonEmptyString
	}))),
	defaultModels: Type.Optional(closedObject({ 
	/** Auto preview from agents.defaults.model, even when utility routing is explicit or disabled. */
automaticUtilityModel: Type.Union([NonEmptyString, Type.Null()]) })),
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
	id: NonEmptyString,
	label: NonEmptyString,
	capabilities: SessionCatalogCapabilitiesSchema,
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
	sessionId: NonEmptyString,
	agentId: NonEmptyString,
	shell: NonEmptyString,
	cwd: NonEmptyString,
	confined: Type.Boolean(),
	title: Type.Optional(NonEmptyString),
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
//#region packages/gateway-protocol/src/validation-errors.ts
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
	const unique = [...new Set(parts.filter((part) => part.trim()))];
	return unique.length > 0 ? unique.join("; ") : "unknown validation error";
}
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
const SkillsProposalHistoryStatusParamsSchema = Type.Object({ agentId: Type.Optional(NonEmptyString) }, { additionalProperties: false });
const SkillsProposalHistoryScanParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	direction: Type.Optional(Type.Union([Type.Literal("older"), Type.Literal("newer")]))
}, { additionalProperties: false });
const SkillsProposalHistoryScanResultSchema = Type.Object({
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
}, { additionalProperties: false });
const validateSkillsProposalHistoryStatusParams = /* @__PURE__ */ lazyCompile(SkillsProposalHistoryStatusParamsSchema);
const validateSkillsProposalHistoryScanParams = /* @__PURE__ */ lazyCompile(SkillsProposalHistoryScanParamsSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/web-search.ts
const closed$1 = { additionalProperties: false };
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
const WebSearchStatusParamsSchema = Type.Object(selection$1, closed$1);
const WebSearchTestParamsSchema = Type.Object({
	...selection$1,
	query: Type.String({
		minLength: 1,
		maxLength: 500
	}),
	providerId: Type.Optional(text)
}, closed$1);
const route = Type.Object({
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
}, closed$1);
const WebSearchStatusResultSchema = Type.Object({
	enabled: Type.Boolean(),
	provider: Type.Union([text, Type.Null()]),
	agentId: text,
	model: Type.Object({
		provider: text,
		id: text,
		runtime: text,
		runtimeLabel: Type.Optional(text)
	}, closed$1),
	route,
	testProvider: Type.Optional(Type.Object({
		id: text,
		label: text
	}, closed$1)),
	providers: Type.Array(Type.Object({
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
	}, closed$1))
}, closed$1);
const citation = Type.Object({
	url: Type.String(),
	title: Type.Optional(Type.String())
}, closed$1);
const WebSearchTestResultSchema = Type.Object({
	provider: text,
	latencyMs: Type.Number({ minimum: 0 }),
	status: Type.Union([Type.Literal("ok"), Type.Literal("error")]),
	error: Type.Optional(Type.String()),
	content: Type.Optional(Type.String()),
	results: Type.Optional(Type.Array(Type.Object({
		title: Type.String(),
		url: Type.String(),
		snippet: Type.Optional(Type.String())
	}, closed$1))),
	citations: Type.Optional(Type.Array(citation)),
	cached: Type.Optional(Type.Boolean())
}, closed$1);
const validateWebSearchStatusParams = /* @__PURE__ */ lazyCompile(WebSearchStatusParamsSchema);
const validateWebSearchTestParams = /* @__PURE__ */ lazyCompile(WebSearchTestParamsSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/plugin-skills.ts
const closed = { additionalProperties: false };
const name = Type.String({
	minLength: 1,
	maxLength: 256
});
const filePath = Type.String({
	minLength: 1,
	maxLength: 512
});
/** Paths select files inside a declared skill; omitted means its SKILL.md entry. */
const PluginsSkillsReadParamsSchema = Type.Union([Type.Object({
	source: Type.Literal("installed"),
	pluginId: name,
	skillName: name,
	path: Type.Optional(filePath),
	version: Type.Optional(name)
}, closed), Type.Object({
	source: Type.Literal("catalog"),
	catalogId: name,
	version: name,
	skillName: name,
	path: Type.Optional(filePath)
}, closed)]);
const PluginSkillFileSchema = Type.Object({
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
}, closed);
const PluginsSkillsReadResultSchema = Type.Object({
	name,
	rootPath: filePath,
	entryPath: filePath,
	version: Type.Optional(name),
	files: Type.Array(PluginSkillFileSchema, { maxItems: 256 }),
	directories: Type.Array(filePath, { maxItems: 512 }),
	/** False means directory enumeration failed, not merely that a binary cannot render. */
	inventoryComplete: Type.Boolean()
}, closed);
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
//#region packages/gateway-protocol/src/schema/board.ts
const BoardTabIdSchema = Type.String({ pattern: "^[a-z0-9-]{1,40}$" });
const BoardWidgetNameSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9._-]{0,63}$" });
const BoardWidgetGeneratedIdentitySchema = closedObject({
	source: Type.Literal("show_widget"),
	key: Type.String({ pattern: "^[a-f0-9]{64}$" }),
	fallbackName: BoardWidgetNameSchema
});
const BoardWidgetPluginKindSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9-]{0,63}:[a-z0-9][a-z0-9._-]{0,63}$" });
const BoardWidgetPluginPropsSchema = Type.Record(Type.String(), Type.Unknown());
const BoardChatDockSchema = Type.Union([
	Type.Literal("left"),
	Type.Literal("right"),
	Type.Literal("bottom"),
	Type.Literal("hidden")
]);
const BoardSizeSchema = Type.Union([
	Type.Literal("sm"),
	Type.Literal("md"),
	Type.Literal("lg"),
	Type.Literal("xl"),
	Type.Literal("full")
]);
const BoardWidgetPresentationSchema = Type.Union([
	Type.Literal("card"),
	Type.Literal("full-bleed"),
	Type.Literal("frameless")
]);
const BoardWidgetHeightModeSchema = Type.Union([Type.Literal("auto"), Type.Literal("fixed")]);
const BOARD_CRON_JOB_ID_MAX_LENGTH = 256;
const BOARD_CRON_TRIGGER_PREFIX = "cron.trigger:";
const BOARD_WIDGET_TOOL_MAX_LENGTH = 269;
const BOARD_DATA_BINDING_ID_MAX_LENGTH = 64;
const BoardTabSchema = closedObject({
	tabId: BoardTabIdSchema,
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	position: Type.Integer({ minimum: 0 }),
	chatDock: BoardChatDockSchema
});
const BoardWidgetDeclaredSchema = closedObject({
	netOrigins: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 2048
	}), { maxItems: 32 })),
	tools: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 269
	}), { maxItems: 64 }))
});
const BoardWidgetSchema = closedObject({
	name: BoardWidgetNameSchema,
	tabId: BoardTabIdSchema,
	title: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 80
	})),
	contentKind: Type.Union([
		Type.Literal("html"),
		Type.Literal("mcp-app"),
		Type.Literal("plugin")
	]),
	contentOwner: Type.Optional(Type.Enum([
		"html",
		"mcp-app",
		"plugin",
		"registered"
	], { type: "string" })),
	registeredContentKind: Type.Optional(Type.String({ pattern: "^[a-z][a-z0-9-]{0,31}$" })),
	pluginKind: Type.Optional(BoardWidgetPluginKindSchema),
	props: Type.Optional(BoardWidgetPluginPropsSchema),
	presentation: Type.Optional(BoardWidgetPresentationSchema),
	heightMode: Type.Optional(BoardWidgetHeightModeSchema),
	sizeW: Type.Integer({
		minimum: 1,
		maximum: 12
	}),
	sizeH: Type.Integer({
		minimum: 1,
		maximum: 20
	}),
	position: Type.Integer({ minimum: 0 }),
	grantState: Type.Union([
		Type.Literal("none"),
		Type.Literal("pending"),
		Type.Literal("granted"),
		Type.Literal("rejected")
	]),
	revision: Type.Integer({ minimum: 1 }),
	instanceId: Type.Optional(NonEmptyString),
	declaredSummary: Type.Optional(Type.Array(Type.String())),
	declared: Type.Optional(BoardWidgetDeclaredSchema),
	frameUrl: Type.Optional(Type.String()),
	viewTicket: Type.Optional(Type.String()),
	viewTicketTtlMs: Type.Optional(Type.Integer({ minimum: 1 })),
	viewGeneration: Type.Optional(Type.String({ pattern: "^[a-f0-9]{32}$" })),
	sandboxUrl: Type.Optional(Type.String()),
	sandboxPort: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 65535
	})),
	sandboxOrigin: Type.Optional(Type.String()),
	kindLabel: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 80
	}))
});
const BoardSnapshotFields = {
	sessionKey: NonEmptyString,
	revision: Type.Integer({ minimum: 0 }),
	tabs: Type.Array(BoardTabSchema),
	widgets: Type.Array(BoardWidgetSchema)
};
const BoardSnapshotSchema = closedObject(BoardSnapshotFields);
const BoardTabCreateOpSchema = closedObject({
	kind: Type.Literal("tab_create"),
	tabId: BoardTabIdSchema,
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	chatDock: Type.Optional(BoardChatDockSchema)
});
const BoardTabUpdateOpSchema = closedObject({
	kind: Type.Literal("tab_update"),
	tabId: BoardTabIdSchema,
	title: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 80
	})),
	chatDock: Type.Optional(BoardChatDockSchema),
	position: Type.Optional(Type.Integer({ minimum: 0 }))
});
const BoardTabDeleteOpSchema = closedObject({
	kind: Type.Literal("tab_delete"),
	tabId: BoardTabIdSchema
});
const BoardTabsReorderOpSchema = closedObject({
	kind: Type.Literal("tabs_reorder"),
	tabIds: Type.Array(BoardTabIdSchema)
});
const BoardWidgetMoveOpSchema = closedObject({
	kind: Type.Literal("widget_move"),
	name: BoardWidgetNameSchema,
	tabId: Type.Optional(BoardTabIdSchema),
	position: Type.Optional(Type.Integer({ minimum: 0 })),
	after: Type.Optional(BoardWidgetNameSchema)
});
const BoardWidgetResizeOpSchema = closedObject({
	kind: Type.Literal("widget_resize"),
	name: BoardWidgetNameSchema,
	sizeW: Type.Integer(),
	sizeH: Type.Integer(),
	heightMode: Type.Optional(BoardWidgetHeightModeSchema)
});
const BoardWidgetRemoveOpSchema = closedObject({
	kind: Type.Literal("widget_remove"),
	name: BoardWidgetNameSchema
});
const BoardOpSchema = Type.Union([
	BoardTabCreateOpSchema,
	BoardTabUpdateOpSchema,
	BoardTabDeleteOpSchema,
	BoardTabsReorderOpSchema,
	BoardWidgetMoveOpSchema,
	BoardWidgetResizeOpSchema,
	BoardWidgetRemoveOpSchema
]);
const BoardGetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const BoardUpdateParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	ops: Type.Array(BoardOpSchema)
});
const BoardMcpAppDescriptorSchema = closedObject({
	serverName: NonEmptyString,
	toolName: NonEmptyString,
	uiResourceUri: NonEmptyString,
	toolCallId: NonEmptyString
});
const BoardWidgetHtmlContentSchema = closedObject({
	kind: Type.Literal("html"),
	html: Type.String({ maxLength: 262144 })
});
const BoardWidgetMcpAppContentSchema = closedObject({
	kind: Type.Literal("mcp-app"),
	descriptor: BoardMcpAppDescriptorSchema
});
const BoardWidgetMcpAppPutContentSchema = closedObject({
	kind: Type.Literal("mcp-app"),
	viewId: NonEmptyString
});
const BoardWidgetPluginContentSchema = closedObject({
	kind: Type.Literal("plugin"),
	pluginKind: BoardWidgetPluginKindSchema,
	props: Type.Optional(BoardWidgetPluginPropsSchema)
});
const BoardWidgetRegisteredContentSchema = closedObject({
	kind: Type.Literal("registered"),
	contentKind: Type.String({ pattern: "^[a-z][a-z0-9-]{0,31}$" }),
	source: Type.String({ maxLength: 262144 })
});
const BoardWidgetContentSchema = Type.Union([
	BoardWidgetHtmlContentSchema,
	BoardWidgetMcpAppContentSchema,
	BoardWidgetPluginContentSchema,
	BoardWidgetRegisteredContentSchema
]);
const BoardCanvasDocumentSourceSchema = closedObject({
	kind: Type.Literal("canvas-doc"),
	docId: NonEmptyString
});
const BoardWidgetPutContentSchema = Type.Union([
	BoardWidgetHtmlContentSchema,
	BoardWidgetMcpAppPutContentSchema,
	BoardWidgetPluginContentSchema,
	BoardWidgetRegisteredContentSchema,
	BoardCanvasDocumentSourceSchema
]);
const BoardWidgetPutParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	name: BoardWidgetNameSchema,
	title: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 80
	})),
	content: BoardWidgetPutContentSchema,
	presentation: Type.Optional(BoardWidgetPresentationSchema),
	heightMode: Type.Optional(BoardWidgetHeightModeSchema),
	placement: Type.Optional(closedObject({
		tabId: Type.Optional(BoardTabIdSchema),
		size: Type.Optional(BoardSizeSchema),
		after: Type.Optional(BoardWidgetNameSchema)
	})),
	declared: Type.Optional(BoardWidgetDeclaredSchema),
	generatedIdentity: Type.Optional(BoardWidgetGeneratedIdentitySchema)
});
const BoardWidgetPutResultSchema = closedObject({
	...BoardSnapshotFields,
	resolvedWidgetName: BoardWidgetNameSchema
});
const BoardWidgetGrantParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	name: BoardWidgetNameSchema,
	decision: Type.Union([Type.Literal("granted"), Type.Literal("rejected")]),
	revision: Type.Integer({ minimum: 1 }),
	instanceId: NonEmptyString
});
const BoardWidgetAppViewParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	name: BoardWidgetNameSchema,
	revision: Type.Integer({ minimum: 1 }),
	instanceId: NonEmptyString
});
const BoardWidgetAppViewResultSchema = closedObject({
	viewId: NonEmptyString,
	expiresAtMs: Type.Integer({ minimum: 0 })
});
const BoardViewTicketSchema = Type.String({
	minLength: 1,
	maxLength: 2048
});
const BoardLegacyEventParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	widget: BoardWidgetNameSchema,
	payload: Type.Unknown()
});
const BoardTicketEventParamsSchema = closedObject({
	ticket: BoardViewTicketSchema,
	payload: Type.Unknown()
});
const BoardEventParamsSchema = Type.Union([BoardLegacyEventParamsSchema, BoardTicketEventParamsSchema]);
const BoardPromptAuthorizeParamsSchema = closedObject({ ticket: BoardViewTicketSchema });
const BoardDataReadParamsSchema = closedObject({
	ticket: BoardViewTicketSchema,
	bindingId: Type.String({
		minLength: 1,
		maxLength: 64
	}),
	params: Type.Optional(Type.Record(Type.String({
		minLength: 1,
		maxLength: 80
	}), Type.Unknown(), { maxProperties: 64 }))
});
const BoardCronActionParamsSchema = closedObject({
	ticket: BoardViewTicketSchema,
	action: Type.Literal("cron.trigger"),
	jobId: Type.String({
		minLength: 1,
		maxLength: 256
	})
});
const BoardPluginActionParamsSchema = closedObject({
	ticket: BoardViewTicketSchema,
	action: Type.String({
		minLength: 1,
		maxLength: 269
	}),
	params: Type.Optional(Type.Record(Type.String({
		minLength: 1,
		maxLength: 80
	}), Type.Unknown(), { maxProperties: 64 }))
});
const BoardActionParamsSchema = Type.Union([BoardCronActionParamsSchema, BoardPluginActionParamsSchema]);
const BoardChangedEventSchema = closedObject({
	sessionKey: NonEmptyString,
	revision: Type.Integer({ minimum: 0 }),
	widget: Type.Optional(BoardWidgetNameSchema)
});
const BoardFocusTabCommandSchema = closedObject({
	kind: Type.Literal("focus_tab"),
	tabId: BoardTabIdSchema
});
const BoardSetChatDockCommandSchema = closedObject({
	kind: Type.Literal("set_chat_dock"),
	dock: BoardChatDockSchema
});
const BoardCommandSchema = Type.Union([BoardFocusTabCommandSchema, BoardSetChatDockCommandSchema]);
const BoardCommandEventSchema = closedObject({
	sessionKey: NonEmptyString,
	command: BoardCommandSchema
});
//#endregion
//#region packages/gateway-protocol/src/schema/canvas.ts
const CANVAS_DOCUMENT_PREVIEW_MAX_BYTES = 2097152;
const CanvasDocumentPreviewParamsSchema = closedObject({ html: Type.String({
	maxLength: CANVAS_DOCUMENT_PREVIEW_MAX_BYTES,
	description: "Caller-owned HTML, limited to 2 MiB of UTF-8 data by the Gateway."
}) });
const CanvasDocumentViewParamsSchema = closedObject({ docId: Type.String({
	minLength: 1,
	maxLength: 256,
	pattern: "^(?!\\.{1,2}$)[A-Za-z0-9._-]+$"
}) });
const CanvasDocumentViewResultSchema = closedObject({
	html: Type.String({ maxLength: 2097152 }),
	sandboxUrl: Type.String(),
	sandboxPort: Type.Integer({
		minimum: 1,
		maximum: 65535
	}),
	sandboxOrigin: Type.Optional(Type.String())
});
//#endregion
//#region packages/gateway-protocol/src/schema/progress-card.ts
const PROGRESS_CARD_MAX_UTF8_BYTES = 8192;
const PROGRESS_CARD_MAX_STEPS = 50;
const PROGRESS_CARD_MAX_STEP_UTF8_BYTES = 512;
const ProgressCardStepStatusSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("in_progress"),
	Type.Literal("completed")
]);
const ProgressCardStepSchema = closedObject({
	step: Type.String({ minLength: 1 }),
	status: ProgressCardStepStatusSchema
});
const ProgressCardSchema = closedObject({
	sessionKey: NonEmptyString,
	revision: Type.Integer({ minimum: 1 }),
	updatedAt: Type.Integer(),
	markdown: Type.Optional(Type.String()),
	steps: Type.Optional(Type.Array(ProgressCardStepSchema, { maxItems: 50 }))
});
const ProgressCardGetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const ProgressCardGetResultSchema = closedObject({ card: Type.Union([ProgressCardSchema, Type.Null()]) });
const ProgressCardPutParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	markdown: Type.Optional(Type.String()),
	plan: Type.Optional(Type.Array(ProgressCardStepSchema, { maxItems: 50 })),
	expectedRevision: Type.Optional(Type.Integer({ minimum: 1 }))
});
const ProgressCardPutResultSchema = ProgressCardGetResultSchema;
const ProgressCardRefreshParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	idempotencyKey: NonEmptyString
});
const ProgressCardRefreshResultSchema = closedObject({
	runId: NonEmptyString,
	status: Type.Literal("accepted"),
	revision: Type.Integer({ minimum: 1 })
});
const ProgressCardChangedEventSchema = closedObject({
	sessionKey: NonEmptyString,
	revision: Type.Union([Type.Number(), Type.Null()])
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
	fastMode: Type.Optional(Type.Union([Type.Boolean(), Type.Literal("auto")])),
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
//#region packages/gateway-protocol/src/schema/sessions-goal.ts
const SessionGoalSchema = closedObject({
	schemaVersion: Type.Literal(1),
	id: NonEmptyString,
	objective: Type.String(),
	status: Type.Union([
		Type.Literal("active"),
		Type.Literal("paused"),
		Type.Literal("blocked"),
		Type.Literal("usage_limited"),
		Type.Literal("budget_limited"),
		Type.Literal("complete")
	]),
	createdAt: Type.Number(),
	updatedAt: Type.Number(),
	tokenStart: Type.Number(),
	tokenStartFresh: Type.Optional(Type.Boolean()),
	tokensUsed: Type.Number(),
	tokenBudget: Type.Optional(Type.Number()),
	continuationTurns: Type.Number(),
	lastStatusNote: Type.Optional(Type.String()),
	pausedAt: Type.Optional(Type.Number()),
	blockedAt: Type.Optional(Type.Number()),
	completedAt: Type.Optional(Type.Number()),
	usageLimitedAt: Type.Optional(Type.Number()),
	budgetLimitedAt: Type.Optional(Type.Number())
});
const GoalOperationIdentity = {
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	goalId: NonEmptyString,
	operationId: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	issuedAtMs: Type.Integer({ minimum: 0 })
};
const SessionsGoalUpdateParamsSchema = Type.Union([closedObject({
	...GoalOperationIdentity,
	action: Type.Literal("edit"),
	objective: Type.String({
		minLength: 1,
		maxLength: 16e3
	})
}), closedObject({
	...GoalOperationIdentity,
	action: Type.Union([
		Type.Literal("pause"),
		Type.Literal("resume"),
		Type.Literal("complete"),
		Type.Literal("block")
	]),
	note: Type.Optional(Type.String({ maxLength: 2e3 }))
})]);
const SessionsGoalClearParamsSchema = closedObject(GoalOperationIdentity);
const SessionsGoalMutationResultSchema = closedObject({
	operationId: NonEmptyString,
	action: Type.Union([
		Type.Literal("start"),
		Type.Literal("edit"),
		Type.Literal("pause"),
		Type.Literal("resume"),
		Type.Literal("complete"),
		Type.Literal("block"),
		Type.Literal("clear")
	]),
	sessionId: NonEmptyString,
	goalId: NonEmptyString,
	goal: Type.Optional(SessionGoalSchema),
	runId: Type.Optional(NonEmptyString),
	replayed: Type.Optional(Type.Literal(true)),
	status: Type.Union([
		Type.Literal("started"),
		Type.Literal("updated"),
		Type.Literal("cleared")
	])
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-list.ts
const SessionsListParamsSchema = closedObject({
	/** Maximum rows to return; omitted Gateway RPC calls use a bounded default. */
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
	/** Activity age for sortBy: "activity"; otherwise metadata update age. */
	activeMinutes: Type.Optional(Type.Integer({ minimum: 1 })),
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
	spawnedBy: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	search: Type.Optional(Type.String()),
	/**
	* True lists archived sessions; "all" lists archived and active;
	* false or omitted lists active sessions.
	*/
	archived: Type.Optional(Type.Union([Type.Boolean(), Type.Literal("all")]))
});
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
	unread: Type.Optional(Type.Boolean({ description: "Set true to mark unread; false records the session as read." })),
	contextWindow: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	thinkingLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	fastMode: Type.Optional(Type.Union([
		Type.Boolean(),
		Type.Literal("auto"),
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
//#region packages/gateway-protocol/src/schema/tasks.ts
/**
* Task ledger protocol schemas.
*
* Tasks represent long-running SDK/agent operations exposed through the gateway;
* these schemas keep list/get/cancel payloads bounded and status values closed.
*/
/** Closed task lifecycle statuses visible in the gateway task ledger. */
const TaskLedgerStatusSchema = Type.Union([
	Type.Literal("queued"),
	Type.Literal("running"),
	Type.Literal("completed"),
	Type.Literal("failed"),
	Type.Literal("cancelled"),
	Type.Literal("timed_out")
]);
const TimestampSchema = Type.Union([Type.String(), Type.Integer({ minimum: 0 })]);
const TaskDeliveryStatusSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("delivered"),
	Type.Literal("session_queued"),
	Type.Literal("failed"),
	Type.Literal("dismissed"),
	Type.Literal("parent_missing"),
	Type.Literal("not_applicable")
]);
const TaskTerminalOutcomeSchema = Type.Union([Type.Literal("succeeded"), Type.Literal("blocked")]);
const TaskExecutionSchema = closedObject({
	state: Type.Union([
		Type.Literal("queued"),
		Type.Literal("running"),
		Type.Literal("waiting"),
		Type.Literal("finished"),
		Type.Literal("unknown")
	]),
	currentTool: Type.Optional(closedObject({
		name: Type.String(),
		startedAt: TimestampSchema
	})),
	lastActivityAt: Type.Optional(TimestampSchema),
	wait: Type.Optional(closedObject({
		kind: Type.Union([
			Type.Literal("children"),
			Type.Literal("external"),
			Type.Literal("agent_messages"),
			Type.Literal("approval"),
			Type.Literal("user_input")
		]),
		dependencies: Type.Optional(Type.Array(closedObject({
			runId: NonEmptyString,
			sessionKey: Type.Optional(Type.String()),
			taskId: Type.Optional(Type.String()),
			label: Type.Optional(Type.String())
		}), { maxItems: 100 })),
		pendingCount: Type.Optional(Type.Integer({ minimum: 0 }))
	}))
});
const TaskListSortBySchema = Type.Unsafe({
	type: "string",
	enum: ["updatedAt", "endedAt"]
});
const TaskDiffStatSchema = withSince("2026.8", closedObject({
	files: Type.Integer({ minimum: 0 }),
	added: Type.Integer({ minimum: 0 }),
	removed: Type.Integer({ minimum: 0 })
}));
/** Public task summary returned by task list/get/cancel responses. */
const TaskSummarySchema = closedObject({
	id: NonEmptyString,
	kind: Type.Optional(Type.String()),
	runtime: Type.Optional(Type.String()),
	status: TaskLedgerStatusSchema,
	title: Type.Optional(Type.String()),
	agentId: Type.Optional(Type.String()),
	sessionKey: Type.Optional(Type.String()),
	childSessionKey: Type.Optional(Type.String()),
	hasTranscript: Type.Optional(Type.Boolean()),
	ownerKey: Type.Optional(Type.String()),
	runId: Type.Optional(Type.String()),
	taskId: Type.Optional(Type.String()),
	flowId: Type.Optional(Type.String()),
	parentTaskId: Type.Optional(Type.String()),
	sourceId: Type.Optional(Type.String()),
	createdAt: Type.Optional(TimestampSchema),
	updatedAt: Type.Optional(TimestampSchema),
	startedAt: Type.Optional(TimestampSchema),
	endedAt: Type.Optional(TimestampSchema),
	toolUseCount: Type.Optional(Type.Integer({ minimum: 0 })),
	lastToolName: Type.Optional(Type.String()),
	execution: Type.Optional(withSince("2026.9", TaskExecutionSchema)),
	lastActivity: Type.Optional(withSince("2026.8", Type.String({ maxLength: 200 }))),
	diffStat: Type.Optional(TaskDiffStatSchema),
	progressSummary: Type.Optional(Type.String()),
	terminalSummary: Type.Optional(Type.String()),
	error: Type.Optional(Type.String()),
	deliveryStatus: Type.Optional(TaskDeliveryStatusSchema),
	terminalOutcome: Type.Optional(TaskTerminalOutcomeSchema),
	/** Bounded canonical completion result. Returned only by tasks.get. */
	result: Type.Optional(Type.String()),
	/** Bounded task input. Returned by tasks.get; omitted from list/event summaries. */
	prompt: Type.Optional(Type.String())
});
/** Task list filters with bounded pagination. */
const TASKS_LIST_CURSOR_MAX_LENGTH = 512;
const TasksListParamsSchema = closedObject({
	status: Type.Optional(Type.Union([TaskLedgerStatusSchema, Type.Array(TaskLedgerStatusSchema)])),
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 500
	})),
	cursor: Type.Optional(Type.String({ maxLength: 512 })),
	sortBy: Type.Optional(withSince("2026.8", TaskListSortBySchema))
});
/** Task list page response. */
const TasksListResultSchema = closedObject({
	tasks: Type.Array(TaskSummarySchema),
	nextCursor: Type.Optional(Type.String({ maxLength: 512 }))
});
/** Lookup request for one task id. */
const TasksGetParamsSchema = closedObject({ taskId: NonEmptyString });
/** Lookup result for one task summary. */
const TasksGetResultSchema = closedObject({ task: TaskSummarySchema });
/** Runtime-independent, bounded transcript pages in chronological order. */
const TasksHistoryParamsSchema = closedObject({
	taskId: NonEmptyString,
	cursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 8192
	})),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 200
	}))
});
const TasksHistoryResultSchema = closedObject({
	/** Stable messageId or __openclaw.id anchors refreshes; entry IDs can have sibling rows. */
	messages: Type.Array(Type.Unknown()),
	activity: Type.Optional(Type.Array(ChatHistoryActivitySchema)),
	nextCursor: Type.Optional(Type.String({ maxLength: 8192 }))
});
/** Cancel request for one task id with optional operator reason. */
const TasksCancelParamsSchema = closedObject({
	taskId: NonEmptyString,
	reason: Type.Optional(Type.String())
});
/** Cancel result, including the task snapshot when it was found. */
const TasksCancelResultSchema = closedObject({
	found: Type.Boolean(),
	cancelled: Type.Boolean(),
	reason: Type.Optional(Type.String()),
	task: Type.Optional(TaskSummarySchema)
});
const TasksRecoveryParamsSchema = closedObject({ taskIds: Type.Array(NonEmptyString, {
	minItems: 1,
	maxItems: 10
}) });
const TaskRecoveryItemSchema = closedObject({
	taskId: NonEmptyString,
	ok: Type.Boolean(),
	reason: Type.Optional(Type.String()),
	duplicateRisk: Type.Optional(Type.Boolean()),
	task: Type.Optional(TaskSummarySchema)
});
const TasksRecoveryResultSchema = closedObject({ results: Type.Array(TaskRecoveryItemSchema, { maxItems: 10 }) });
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
const ProjectsListResultSchema = closedObject({
	projects: Type.Array(ProjectRecordSchema),
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
const MemoryMigrationItemSchema = Type.Object({
	id: NonEmptyString,
	status: MemoryMigrationItemStatusSchema,
	source: Type.Optional(NonEmptyString),
	target: Type.Optional(NonEmptyString),
	message: Type.Optional(Type.String()),
	reason: Type.Optional(Type.String()),
	details: Type.Optional(Type.Record(Type.String(), Type.Unknown()))
}, { additionalProperties: false });
const MemoryMigrationSummarySchema = Type.Object({
	total: Type.Integer({ minimum: 0 }),
	planned: Type.Integer({ minimum: 0 }),
	migrated: Type.Integer({ minimum: 0 }),
	skipped: Type.Integer({ minimum: 0 }),
	conflicts: Type.Integer({ minimum: 0 }),
	errors: Type.Integer({ minimum: 0 }),
	sensitive: Type.Integer({ minimum: 0 })
}, { additionalProperties: false });
const MemoryMigrationProviderPlanSchema = Type.Object({
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
}, { additionalProperties: false });
const MigrationsMemoryPlanParamsSchema = Type.Object({
	agentId: NonEmptyString,
	overwrite: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
const MigrationsMemoryPlanResultSchema = Type.Object({
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	providers: Type.Array(MemoryMigrationProviderPlanSchema)
}, { additionalProperties: false });
const MigrationsMemoryApplyParamsSchema = Type.Object({
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
}, { additionalProperties: false });
const MigrationProtocolSchemas = {
	MemoryMigrationItemStatus: MemoryMigrationItemStatusSchema,
	MemoryMigrationItem: MemoryMigrationItemSchema,
	MemoryMigrationSummary: MemoryMigrationSummarySchema,
	MemoryMigrationProviderPlan: MemoryMigrationProviderPlanSchema,
	MigrationsMemoryPlanParams: MigrationsMemoryPlanParamsSchema,
	MigrationsMemoryPlanResult: MigrationsMemoryPlanResultSchema,
	MigrationsMemoryApplyParams: MigrationsMemoryApplyParamsSchema,
	MigrationsMemoryApplyResult: Type.Object({
		providerId: NonEmptyString,
		source: NonEmptyString,
		target: Type.Optional(NonEmptyString),
		summary: MemoryMigrationSummarySchema,
		items: Type.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
		warnings: Type.Optional(Type.Array(Type.String())),
		backupPath: Type.Optional(NonEmptyString),
		reportDir: Type.Optional(NonEmptyString)
	}, { additionalProperties: false })
};
//#endregion
//#region packages/gateway-protocol/src/migration-api.ts
const validateMigrationsMemoryPlanParams = /* @__PURE__ */ lazyCompile(MigrationsMemoryPlanParamsSchema);
const validateMigrationsMemoryApplyParams = /* @__PURE__ */ lazyCompile(MigrationsMemoryApplyParamsSchema);
//#endregion
//#region packages/gateway-protocol/src/restart-unavailable.ts
/** Structured error reason used while the gateway drains for a restart. */
const GATEWAY_RESTART_UNAVAILABLE_REASON = "gateway-restarting";
/** Structured error reason used while the gateway drains for a suspension. */
const GATEWAY_SUSPEND_UNAVAILABLE_REASON = "gateway-suspending";
/** Detects the structured retryable error emitted while a restart drain refuses work. */
function isGatewayRestartUnavailableError(error) {
	return hasUnavailableReason(error, GATEWAY_RESTART_UNAVAILABLE_REASON);
}
/** Detects the structured retryable error emitted while suspension refuses work. */
function isGatewaySuspendUnavailableError(error) {
	return hasUnavailableReason(error, GATEWAY_SUSPEND_UNAVAILABLE_REASON);
}
function hasUnavailableReason(error, reason) {
	if (!error || typeof error !== "object" || !("details" in error)) return false;
	const details = error.details;
	return typeof details === "object" && details !== null && "reason" in details && details.reason === reason;
}
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
		status: Type.Union([
			Type.Literal("sent"),
			Type.Literal("queued"),
			Type.Literal("suppressed"),
			Type.Literal("unknown")
		]),
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
* Artifacts are files or payloads produced by sessions, runs, tasks, or agents;
* these schemas keep lookup filters explicit and download results transport-safe.
*/
const ArtifactQueryParamsProperties = {
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	taskId: Type.Optional(NonEmptyString),
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
	taskId: Type.Optional(NonEmptyString),
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
const ChannelsPairingListParamsSchema = closedObject({
	channel: Type.Optional(NonEmptyString),
	accountId: Type.Optional(NonEmptyString)
});
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
const ChannelsPairingApproveParamsSchema = closedObject({
	channel: NonEmptyString,
	accountId: NonEmptyString,
	requestId: NonEmptyString,
	notify: Type.Optional(Type.Boolean()),
	bootstrapCommandOwner: Type.Optional(Type.Boolean())
});
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
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const raw = value;
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
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const raw = value;
	if (typeof raw.id !== "string" || !/^[A-Za-z0-9@][A-Za-z0-9@._/-]{0,127}$/u.test(raw.id)) return;
	if (typeof raw.name !== "string" || !raw.name.trim() || raw.name.length > 96) return;
	const reference = {
		id: raw.id,
		name: raw.name.trim()
	};
	if (typeof raw.installed === "boolean") reference.installed = raw.installed;
	if (raw.setting && typeof raw.setting === "object" && !Array.isArray(raw.setting)) {
		const setting = raw.setting;
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
	kind: Type.Union([
		Type.Literal("existing-model"),
		Type.Literal("openai-api-key"),
		Type.Literal("anthropic-api-key"),
		Type.Literal("claude-cli"),
		Type.Literal("codex-cli"),
		Type.Literal("gemini-cli"),
		ProviderAutoSetupInferenceKind,
		SavedAuthSetupInferenceKind,
		Type.Literal("api-key")
	]),
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
	Type.Literal("ok"),
	Type.Literal("error"),
	Type.Literal("skipped"),
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
const CronRunsStatusFilterSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("ok"),
	Type.Literal("error"),
	Type.Literal("skipped")
]);
const CronRunsStatusValueSchema = Type.Union([
	Type.Literal("ok"),
	Type.Literal("error"),
	Type.Literal("skipped")
]);
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
const CronReportedPayloadSchema = Type.Union([
	CronSystemEventPayloadSchema,
	CronAgentTurnPayloadSchema,
	CronCommandPayloadSchema,
	CronScriptPayloadSchema,
	closedObject({ kind: Type.Literal("heartbeat") })
]);
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
	scratch: Type.Union([CronScratchSchema, Type.Null()]),
	currentRevision: Type.Integer({ minimum: 0 }),
	maxBytes: Type.Integer({ minimum: 1 })
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
	expectedProcessInstanceId: Type.Optional(NonEmptyString)
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
	statuses: Type.Optional(Type.Array(CronRunsStatusValueSchema, {
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
/** Empty request payload for reading local exec approval policy. */
const ExecApprovalsGetParamsSchema = closedObject({});
/** Local exec approval policy write request with optional base hash guard. */
const ExecApprovalsSetParamsSchema = closedObject({
	file: ExecApprovalsFileSchema,
	baseHash: Type.Optional(NonEmptyString)
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
const ExecApprovalPolicySecuritySchema = Type.Union([
	Type.Literal("deny"),
	Type.Literal("allowlist"),
	Type.Literal("full")
]);
const ExecApprovalPolicySnapshotSchema = closedObject({
	security: ExecApprovalPolicySecuritySchema,
	ask: Type.Union([
		Type.Literal("off"),
		Type.Literal("on-miss"),
		Type.Literal("always")
	]),
	askFallback: ExecApprovalPolicySecuritySchema,
	autoAllowSkills: Type.Boolean(),
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
/**
* Device pairing and token-management protocol schemas.
*
* These payloads cross the gateway approval boundary, so request ids and device
* ids stay explicit and feature handlers own the authorization checks.
*/
/** Lists pending and approved device pairing records. */
const DevicePairListParamsSchema = closedObject({});
/** Approves a pending pairing request by request id. */
const DevicePairApproveParamsSchema = closedObject({ requestId: NonEmptyString });
/** Rejects a pending pairing request by request id. */
const DevicePairRejectParamsSchema = closedObject({ requestId: NonEmptyString });
/** Removes an approved or remembered device by device id. */
const DevicePairRemoveParamsSchema = closedObject({ deviceId: NonEmptyString });
/** Operator-assigned label for a paired device (max 64 chars after protocol bound). */
const DevicePairLabelString = Type.String({
	minLength: 1,
	maxLength: 64
});
/** Renames a paired device while preserving its stable device id. */
const DevicePairRenameParamsSchema = closedObject({
	deviceId: NonEmptyString,
	label: DevicePairLabelString
});
/** Rotates or issues a device token for a specific role/scope grant. */
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
/** Revokes one role-bound device token grant. */
const DeviceTokenRevokeParamsSchema = closedObject({
	deviceId: NonEmptyString,
	role: NonEmptyString
});
/** Requests an approval-bound operator scope upgrade for the calling device. */
const ScopeUpgradeRequestSchema = closedObject({ scopes: Type.Array(NonEmptyString, {
	minItems: 1,
	maxItems: 8,
	uniqueItems: true
}) });
/** Identifies the pending scope upgrade observed by the calling device. */
const ScopeUpgradeWaitSchema = closedObject({ requestId: NonEmptyString });
closedObject({ requestId: NonEmptyString });
/** Returns an approved scope upgrade with the freshly rotated credential. */
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
/** Reports that an administrator rejected the pending scope upgrade. */
const ScopeUpgradeRejectedSchema = closedObject({
	status: Type.Literal("rejected"),
	requestId: NonEmptyString
});
/** Reports that the pending scope upgrade expired before approval. */
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
	"scheduled-task-failed",
	"background-task-failed"
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
	scheduledTaskFailed: Type.Boolean(),
	backgroundTaskFailed: Type.Boolean()
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
		scheduledTaskFailed: Type.Optional(Type.Boolean()),
		backgroundTaskFailed: Type.Optional(Type.Boolean())
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
const QuestionOptionSchema = closedObject({
	label: NonEmptyString,
	description: Type.Optional(Type.String())
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
	options: Type.Array(QuestionOptionSchema, { maxItems: 4 }),
	multiSelect: Type.Optional(Type.Boolean()),
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
const UtilityModelStatusSchema = Type.Union([
	closedObject({
		status: Type.Literal("auto"),
		model: Type.String({ minLength: 1 })
	}),
	closedObject({
		status: Type.Literal("configured"),
		model: Type.String({ minLength: 1 })
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
const PortalChangedEventSchema = closedObject({ portals: Type.Array(PortalSummarySchema) });
//#endregion
//#region packages/gateway-protocol/src/schema/worktrees.ts
const WorktreeNameSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9-]{0,63}$" });
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
	runEndCleanup: Type.Optional(WorktreeRunEndCleanupSchema)
});
const WorktreesListParamsSchema = closedObject({});
const WorktreesListResultSchema = closedObject({ worktrees: Type.Array(WorktreeRecordSchema) });
const WorktreesCreateParamsSchema = closedObject({
	repoRoot: NonEmptyString,
	name: Type.Optional(WorktreeNameSchema),
	baseRef: Type.Optional(NonEmptyString)
});
const WorktreesRemoveParamsSchema = closedObject({
	id: NonEmptyString,
	force: Type.Optional(Type.Boolean())
});
const WorktreesRemoveResultSchema = closedObject({
	removed: Type.Boolean(),
	snapshotRef: Type.Optional(NonEmptyString),
	/** Why the pre-removal snapshot failed; removal may have stopped or continued without one. */
	snapshotError: Type.Optional(NonEmptyString)
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
const WorktreesRestoreParamsSchema = closedObject({ id: NonEmptyString });
const WorktreesGcParamsSchema = closedObject({});
const WorktreesGcResultSchema = closedObject({
	removed: Type.Array(NonEmptyString),
	orphansDeleted: Type.Integer({ minimum: 0 }),
	snapshotsPruned: Type.Integer({ minimum: 0 })
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
//#endregion
//#region packages/gateway-protocol/src/validator-registry.ts
const validateCommandsListParams = /* @__PURE__ */ lazyCompile(CommandsListParamsSchema);
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
const validateWorkerComputerParams = /* @__PURE__ */ lazyCompile(WorkerComputerParamsSchema);
function checkWorkerProtocolJson(data) {
	const stack = [{
		depth: 0,
		value: data
	}];
	const seen = /* @__PURE__ */ new WeakSet();
	while (stack.length > 0) {
		const current = stack.pop();
		if (!current) break;
		if (current.depth > 32) return {
			keyword: "maxDepth",
			params: { limit: 32 },
			message: `must not exceed JSON nesting depth 32`
		};
		if (current.value === null || typeof current.value === "string" || typeof current.value === "boolean") continue;
		if (typeof current.value === "number") {
			if (!Number.isFinite(current.value)) return {
				keyword: "finite",
				message: "must contain only finite JSON numbers"
			};
			continue;
		}
		if (typeof current.value !== "object") return {
			keyword: "jsonValue",
			message: "must contain only JSON values"
		};
		if (seen.has(current.value)) return {
			keyword: "acyclic",
			message: "must be an acyclic JSON value"
		};
		seen.add(current.value);
		const values = Array.isArray(current.value) ? current.value : Object.values(current.value);
		for (const value of values) stack.push({
			depth: current.depth + 1,
			value
		});
	}
}
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
const validateUsersSelfParams = /* @__PURE__ */ lazyCompile(UsersSelfParamsSchema);
const validateUsersGitHubStatusParams = /* @__PURE__ */ lazyCompile(UsersGitHubStatusParamsSchema);
const validateUsersGitHubAuthorizeStartParams = /* @__PURE__ */ lazyCompile(UsersGitHubAuthorizeStartParamsSchema);
const validateUsersGitHubAuthorizePollParams = /* @__PURE__ */ lazyCompile(UsersGitHubAuthorizePollParamsSchema);
const validateUsersGitHubAuthorizeCancelParams = /* @__PURE__ */ lazyCompile(UsersGitHubAuthorizeCancelParamsSchema);
const validateUsersGitHubDisconnectParams = /* @__PURE__ */ lazyCompile(UsersGitHubDisconnectParamsSchema);
const validateUsersSelfResult = /* @__PURE__ */ lazyCompile(UsersSelfResultSchema);
const validateUsersLinkEmailParams = /* @__PURE__ */ lazyCompile(UsersLinkEmailParamsSchema);
const validateUsersLinkEmailResult = /* @__PURE__ */ lazyCompile(UsersLinkEmailResultSchema);
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
const validateSessionsListParams = /* @__PURE__ */ lazyCompile(SessionsListParamsSchema);
const validateSessionCatalogShareRoute = /* @__PURE__ */ lazyCompile(SessionCatalogShareRouteSchema);
const validateSessionsCatalogListParams = /* @__PURE__ */ lazyCompile(SessionsCatalogListParamsSchema);
const validateSessionsCatalogReadParams = /* @__PURE__ */ lazyCompile(SessionsCatalogReadParamsSchema);
const validateSessionsCatalogContinueParams = /* @__PURE__ */ lazyCompile(SessionsCatalogContinueParamsSchema);
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
const validateTasksListParams = /* @__PURE__ */ lazyCompile(TasksListParamsSchema);
const validateTasksGetParams = /* @__PURE__ */ lazyCompile(TasksGetParamsSchema);
const validateTasksHistoryParams = /* @__PURE__ */ lazyCompile(TasksHistoryParamsSchema);
const validateTasksCancelParams = /* @__PURE__ */ lazyCompile(TasksCancelParamsSchema);
const validateTasksRecoveryParams = /* @__PURE__ */ lazyCompile(TasksRecoveryParamsSchema);
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
export { validateConfigApplyParams as $, validateTalkModeParams as $a, SystemInfoResultSchema as $c, TasksCancelParamsSchema as $d, WorktreePreservationReasonSchema as $f, SessionsCatalogListParamsSchema as $h, validateSessionsResolveParams as $i, CronJobSchema as $l, UiSplitCommandSchema as $m, validatePluginsInstallParams as $n, validateUpdateRunsGetParams as $o, BoardTabCreateOpSchema as $p, validateSessionSuggestionsListParams as $r, validateWizardStatusParams as $s, validateExecApprovalsNodeSnapshot as $t, AgentsWorkspaceGetResultSchema as $u, validateBoardWidgetGrantParams as A, validateSkillsUploadCommitParams as Aa, WorktreesRemoveParamsSchema as Ac, PROJECTS_LIST_DEFAULT_LIMIT as Ad, SessionMembersListResultSchema as Af, buildSystemAgentSessionInvalidatedErrorDetails as Ag, TerminalEventSchema as Ah, validateSessionsGroupsDefaultsResult as Ai, WebPushUnsubscribeParamsSchema as Al, BoardWidgetSchema as Am, validateNodeInvokeResultParams as An, validateToolsGitHubAuthorizePollParams as Ao, BOARD_CRON_JOB_ID_MAX_LENGTH as Ap, validateScopeUpgradeWait as Ar, validateUsersSelfParams as As, validateDevicePairRenameParams as At, SystemChangesListParamsSchema as Au, validateChannelsStatusParams as B, validateSystemInfoParams as Ba, PortalSummarySchema as Bc, ProjectsAddParamsSchema as Bd, SessionsSearchHitSchema as Bf, GATEWAY_SERVER_CAPS as Bg, SessionCatalogCapabilitiesSchema as Bh, validateSessionsMessagesSubscribeParams as Bi, DesktopReleaseResultSchema as Bl, ThemePaletteSchema as Bm, validateNodePresenceActivityPayload as Bn, validateTranscriptsListParams as Bo, BoardCronActionParamsSchema as Bp, validateSessionDiscussionInfoParams as Br, validateUsersUnlinkChannelIdentityResult as Bs, validateEnvironmentsSessionCreateParams as Bt, ChannelsPairingDismissResultSchema as Bu, validateBoardDataReadParams as C, validateSkillsSearchParams as Ca, WorktreesBranchesParamsSchema as Cc, isGatewaySuspendUnavailableError as Cd, SessionMemberAddParamsSchema as Cf, EnvironmentsSessionExecParamsSchema as Cg, validateTerminalUploadParams as Ch, validateSessionsFilesListParams as Ci, QuestionWaitAnswerResultSchema as Cl, BoardWidgetPresentationSchema as Cm, validateModelsListParams as Cn, validateThemesImportParams as Co, ProgressCardSchema as Cp, validateQuestionGetParams as Cr, validateUsersListModelAccountsParams as Cs, validateDesktopObserveResult as Ct, SystemAgentSetupDetectParamsSchema as Cu, validateBoardUpdateParams as D, validateSkillsUpdateParams as Da, WorktreesGcResultSchema as Dc, MigrationProtocolSchemas as Dd, SessionMemberSchema as Df, readSessionWorkspaceRecoveryRequiredError as Dg, TerminalAttachResultSchema as Dh, validateSessionsGoalClearParams as Di, WebPushPreferencesSetParamsSchema as Dl, BoardWidgetRegisteredContentSchema as Dm, validateNodeHostStatsPayload as Dn, validateToolsEffectiveParams as Do, CanvasDocumentPreviewParamsSchema as Dp, validateQuestionWaitAnswerParams as Dr, validateUsersPrefsGetParams as Ds, validateDevicePairListParams as Dt, SystemChangeEntrySchema as Du, validateBoardPromptAuthorizeParams as E, validateSkillsStatusParams as Ea, WorktreesGcParamsSchema as Ec, MAX_MEMORY_MIGRATION_ITEMS as Ed, SessionMemberRemoveParamsSchema as Ef, EnvironmentsSessionStatusParamsSchema as Eg, TerminalAttachParamsSchema as Eh, validateSessionsForkParams as Ei, WebPushPreferencesGetParamsSchema as El, BoardWidgetPutResultSchema as Em, validateNodeEventParams as En, validateToolsCatalogParams as Eo, CANVAS_DOCUMENT_PREVIEW_MAX_BYTES as Ep, validateQuestionResolveParams as Er, validateUsersMentionableResult as Es, validateDevicePairApproveParams as Et, SystemAgentSetupVerifyResultSchema as Eu, validateChannelsLogoutParams as F, validateSystemAgentSetupActivateStartParams as Fa, PortalCloseResultSchema as Fc, ProjectRecentProjectSchema as Fd, SessionSharingEventSchema as Ff, isClawHubTrustErrorCode as Fg, TerminalOpenResultSchema as Fh, validateSessionsGroupsPutParams as Fi, FsListDirResultSchema as Fl, TalkVoiceSelectionSchema as Fm, validateNodePairRemoveParams as Fn, validateToolsGitHubStatusParams as Fo, BoardCanvasDocumentSourceSchema as Fp, validateSecretsStoreListResult as Fr, validateUsersSetDisplayNameResult as Fs, validateEnvironmentsCreateParams as Ft, CommandsListResultSchema as Fu, validateChatMessageGetParams as G, validateTalkClientCreateResult as Ga, TaskSuggestionsAcceptResultSchema as Gc, ProjectsRegisterResultSchema as Gd, SessionsPatchManyResultSchema as Gf, SessionCatalogSchema as Gh, validateSessionsPatchParams as Gi, ExecApprovalsGetParamsSchema as Gl, UiClosePaneCommandSchema as Gm, validatePluginsCatalogBrowseParams as Gn, validateUpdateHoldParams as Go, BoardLegacyEventParamsSchema as Gp, validateSessionGitHubOptionsParams as Gr, validateWebPushPreferencesSetParams as Gs, validateExecApprovalGetParams as Gt, AuditListResultSchema as Gu, validateChatAbortParams as H, validateTalkCatalogParams as Ha, TaskSuggestionResolutionSchema as Hc, ProjectsListParamsSchema as Hd, SessionsSearchResultSchema as Hf, SessionCatalogHostSchema as Hh, validateSessionsMoveResult as Hi, ExecApprovalGetParamsSchema as Hl, ThemesImportParamsSchema as Hm, validateNodeSkillsUpdateParams as Hn, validateTranscriptsSummarizeParams as Ho, BoardEventParamsSchema as Hp, validateSessionDiscussionOpenParams as Hr, validateWebLoginStartParams as Hs, validateEnvironmentsSessionExecParams as Ht, ChannelsPairingListResultSchema as Hu, validateChannelsPairingApproveParams as I, validateSystemAgentSetupAuthStartParams as Ia, PortalListParamsSchema as Ic, ProjectRecentRepositorySchema as Id, SessionSharingEvidenceEventSchema as If, readClawHubTrustErrorDetails as Ig, TerminalResizeParamsSchema as Ih, validateSessionsGroupsRenameParams as Ii, DesktopLaunchParamsSchema as Il, TalkVoiceSetParamsSchema as Im, validateNodePendingAckParams as In, validateToolsGitHubStatusResult as Io, BoardChangedEventSchema as Ip, validateSecretsStoreMutationResult as Ir, validateUsersSetRoleParams as Is, validateEnvironmentsDestroyParams as It, TalkSessionAcknowledgeMarkParamsSchema as Iu, validateChatStartupParams as J, validateTalkClientToolCallParams as Ja, TaskSuggestionsDismissParamsSchema as Jc, ProjectsSearchRemoteParamsSchema as Jd, SessionsPatchParamsSchema as Jf, SessionsCatalogArchiveParamsSchema as Jh, validateSessionsProviderReviewContinueParams as Ji, CronAddParamsSchema as Jl, UiCommandSchema as Jm, validatePluginsControlUiListParams as Jn, validateUpdateReportResult as Jo, BoardPluginActionParamsSchema as Jp, validateSessionMemberAddParams as Jr, validateWebPushUnsubscribeParams as Js, validateExecApprovalRequestParams as Jt, ArtifactsGetParamsSchema as Ju, validateChatMetadataParams as K, validateTalkClientMutationResult as Ka, TaskSuggestionsCreateParamsSchema as Kc, ProjectsRemoveParamsSchema as Kd, SessionsPatchManyTargetSchema as Kf, SessionCatalogSessionSchema as Kh, validateSessionsPluginPatchParams as Ki, ExecApprovalsSetParamsSchema as Kl, UiCommandParamsSchema as Km, validatePluginsCatalogCategoriesParams as Kn, validateUpdateHoldResult as Ko, BoardMcpAppDescriptorSchema as Kp, validateSessionGitHubPublishParams as Kr, validateWebPushSubscribeParams as Ks, validateExecApprovalGrantsListParams as Kt, ArtifactSummarySchema as Ku, validateChannelsPairingDismissParams as L, validateSystemAgentSetupDetectParams as La, PortalListResultSchema as Lc, ProjectRecentSchema as Ld, SessionSharingIdentitySchema as Lf, AgentRuntimeRestrictionErrorDetailsSchema as Lg, TerminalSessionInfoSchema as Lh, validateSessionsGroupsUpdateParams as Li, DesktopObserveParamsSchema as Ll, TalkVoiceSetResultSchema as Lm, validateNodePendingDrainParams as Ln, validateToolsInvokeParams as Lo, BoardChatDockSchema as Lp, validateSecretsStoreSetParams as Lr, validateUsersSetRoleResult as Ls, validateEnvironmentsListParams as Lt, ChannelsPairingApproveParamsSchema as Lu, validateCanvasDocumentPreviewParams as M, validateSystemAgentChatHistoryParams as Ma, WorktreesRestoreParamsSchema as Mc, PROJECTS_LIST_MAX_IDENTITY_PROBES as Md, SessionPublicShareSetParamsSchema as Mf, readSystemAgentSessionInvalidatedErrorDetails as Mg, TerminalInputParamsSchema as Mh, validateSessionsGroupsListParams as Mi, HooksStatusParamsSchema as Ml, TalkVoiceChangeEventSchema as Mm, validateNodePairApproveParams as Mn, validateToolsGitHubAuthorizeStartParams as Mo, BOARD_DATA_BINDING_ID_MAX_LENGTH as Mp, validateSecretsResolveResult as Mr, validateUsersSetAvatarParams as Ms, validateDevicePairSetupStatusParams as Mt, normalizeSystemAgentPluginReference as Mu, validateCanvasDocumentViewParams as N, validateSystemAgentChatParams as Na, PortalChangedEventSchema as Nc, ProjectCheckoutSchema as Nd, SessionPublicShareSetResultSchema as Nf, ClawHubTrustErrorCodes as Ng, TerminalListResultSchema as Nh, validateSessionsGroupsListResult as Ni, FsDirEntrySchema as Nl, TalkVoiceCompleteParamsSchema as Nm, validateNodePairListParams as Nn, validateToolsGitHubAuthorizeStartResult as No, BOARD_WIDGET_TOOL_MAX_LENGTH as Np, validateSecretsStoreDeleteParams as Nr, validateUsersSetAvatarResult as Ns, validateDeviceTokenRevokeParams as Nt, COMMAND_DESCRIPTION_MAX_LENGTH as Nu, validateBoardWidgetAppViewParams as O, validateSkillsUploadBeginParams as Oa, WorktreesListParamsSchema as Oc, MigrationsMemoryApplyParamsSchema as Od, SessionMembersListEvidenceResultSchema as Of, SystemAgentErrorDetailCodes as Og, TerminalCloseParamsSchema as Oh, validateSessionsGoalUpdateParams as Oi, WebPushSubscribeParamsSchema as Ol, BoardWidgetRemoveOpSchema as Om, validateNodeInvokeParams as On, validateToolsGitHubAuthorizeCancelParams as Oo, CanvasDocumentViewParamsSchema as Op, validateRequestFrame as Or, validateUsersPrefsSetParams as Os, validateDevicePairRejectParams as Ot, SystemChangeKindSchema as Ou, validateCapabilityConsentErrorDetails as P, validateSystemAgentSetupActivateParams as Pa, PortalCloseParamsSchema as Pc, ProjectRecentFolderSchema as Pd, SessionSharingActionSchema as Pf, buildClawHubTrustErrorDetails as Pg, TerminalOpenParamsSchema as Ph, validateSessionsGroupsMutationResult as Pi, FsListDirParamsSchema as Pl, TalkVoiceGetParamsSchema as Pm, validateNodePairRejectParams as Pn, validateToolsGitHubConfigureParams as Po, BoardActionParamsSchema as Pp, validateSecretsStoreListParams as Pr, validateUsersSetDisplayNameParams as Ps, validateDeviceTokenRotateParams as Pt, CommandsListParamsSchema as Pu, validateComputerStatusParams as Q, validateTalkConfigResult as Qa, SystemInfoParamsSchema as Qc, TaskSummarySchema as Qd, WORKTREE_PRESERVATION_REASONS as Qf, SessionsCatalogHostEventSchema as Qh, validateSessionsResetParams as Qi, CronGetParamsSchema as Ql, UiSidebarCommandSchema as Qm, validatePluginsInspectParams as Qn, validateUpdateRunResult as Qo, BoardSnapshotSchema as Qp, validateSessionSuggestionsAddParams as Qr, validateWizardStartParams as Qs, validateExecApprovalsNodeSetParams as Qt, AgentsWorkspaceGetParamsSchema as Qu, validateChannelsPairingListParams as R, validateSystemAgentSetupVerifyParams as Ra, PortalOpenParamsSchema as Rc, ProjectRecordSchema as Rd, SessionVisibilitySetParamsSchema as Rf, readAgentRuntimeRestrictionErrorDetails as Rg, TerminalUploadParamsSchema as Rh, validateSessionsGroupsUpdateResult as Ri, DesktopObserveResultSchema as Rl, ThemeDefinitionSchema as Rm, validateNodePendingEnqueueParams as Rn, validateTranscriptsExportParams as Ro, BoardCommandEventSchema as Rp, validateSendParams as Rr, validateUsersUnlinkAuthProfileParams as Rs, validateEnvironmentsPrepareParams as Rt, ChannelsPairingApproveResultSchema as Ru, validateBoardActionParams as S, validateSkillsProposalsListParams as Sa, WorktreeRepositoryStatusSchema as Sc, isGatewayRestartUnavailableError as Sd, SessionTypingResultSchema as Sf, ModelsListParamsSchema as Sg, validateTerminalResizeParams as Sh, validateSessionsFilesGetParams as Si, QuestionWaitAnswerParamsSchema as Sl, BoardWidgetPluginPropsSchema as Sm, validateModelsAuthStatusParams as Sn, validateThemesGetParams as So, ProgressCardRefreshResultSchema as Sp, validatePushTestParams as Sr, validateUsersListChannelIdentitiesResult as Ss, validateDesktopObserveParams as St, SystemAgentSetupAuthStartResultSchema as Su, validateBoardGetParams as T, validateSkillsSkillCardParams as Ta, WorktreesCreateParamsSchema as Tc, validateMigrationsMemoryPlanParams as Td, SessionMemberMutationResultSchema as Tf, EnvironmentsSessionDestroyParamsSchema as Tg, TerminalAckResultSchema as Th, validateSessionsFilesSetParams as Ti, PushTestResultSchema as Tl, BoardWidgetPutParamsSchema as Tm, validateNodeDescribeParams as Tn, validateThemesSetParams as To, ProgressCardStepStatusSchema as Tp, validateQuestionRequestParams as Tr, validateUsersMentionableParams as Ts, validateDesktopReleaseResult as Tt, SystemAgentSetupVerifyParamsSchema as Tu, validateChatHistoryParams as U, validateTalkClientCloseParams as Ua, TaskSuggestionSchema as Uc, ProjectsListResultSchema as Ud, SESSIONS_PATCH_MANY_MAX_TARGETS as Uf, SessionCatalogLocatorSchema as Uh, validateSessionsObserverVisibilityParams as Ui, ExecApprovalRequestParamsSchema as Ul, ThemesListParamsSchema as Um, validatePluginApprovalRequestParams as Un, validateTtsSpeakParams as Uo, BoardFocusTabCommandSchema as Up, validateSessionDiscussionOpenResult as Ur, validateWebLoginWaitParams as Us, validateEnvironmentsSessionStatusParams as Ut, AuditEventSchema as Uu, validateChannelsStopParams as V, validateSystemInfoResult as Va, TaskSuggestionEventSchema as Vc, ProjectsAddResultSchema as Vd, SessionsSearchParamsSchema as Vf, SessionCatalogDescriptorSchema as Vh, validateSessionsMessagesUnsubscribeParams as Vi, DesktopSourceSchema as Vl, ThemesGetParamsSchema as Vm, validateNodeRenameParams as Vn, validateTranscriptsStatusParams as Vo, BoardDataReadParamsSchema as Vp, validateSessionDiscussionInfoResult as Vr, validateWakeParams as Vs, validateEnvironmentsSessionDestroyParams as Vt, ChannelsPairingListParamsSchema as Vu, validateChatInjectParams as W, validateTalkClientCreateParams as Wa, TaskSuggestionsAcceptParamsSchema as Wc, ProjectsRegisterParamsSchema as Wd, SessionsPatchManyParamsSchema as Wf, SessionCatalogPullRequestSummarySchema as Wh, validateSessionsPatchManyParams as Wi, ExecApprovalResolveParamsSchema as Wl, ThemesSetParamsSchema as Wm, validatePluginApprovalResolveParams as Wn, validateUiCommandParams as Wo, BoardGetParamsSchema as Wp, validateSessionGitHubConfirmParams as Wr, validateWebPushPreferencesGetParams as Ws, validateEnvironmentsStatusParams as Wt, AuditListParamsSchema as Wu, validateCommandsListParams as X, validateTalkClientTranscriptParams as Xa, TaskSuggestionsListParamsSchema as Xc, RemoteProjectSchema as Xd, SessionsDeleteParamsSchema as Xf, SessionsCatalogContinueParamsSchema as Xh, validateSessionsReclaimResult as Xi, CronDeclarativeAddResultSchema as Xl, UiNavigateCommandSchema as Xm, validatePluginsControlUiReportParams as Xn, validateUpdateRunParams as Xo, BoardSetChatDockCommandSchema as Xp, validateSessionMembersListParams as Xr, validateWizardCancelParams as Xs, validateExecApprovalsGetParams as Xt, AgentsWorkspaceEntrySchema as Xu, validateChatToolTitlesParams as Y, validateTalkClientToolCallResult as Ya, TaskSuggestionsDismissResultSchema as Yc, ProjectsSearchRemoteResultSchema as Yd, PreservedSessionWorktreeSchema as Yf, SessionsCatalogArchiveResultSchema as Yh, validateSessionsReclaimParams as Yi, CronAddResultSchema as Yl, UiFocusCommandSchema as Ym, validatePluginsControlUiReloadParams as Yn, validateUpdateRunChangedEvent as Yo, BoardPromptAuthorizeParamsSchema as Yp, validateSessionMemberRemoveParams as Yr, validateWebPushVapidPublicKeyParams as Ys, validateExecApprovalResolveParams as Yt, ArtifactsListParamsSchema as Yu, validateComputerInvokeParams as Z, validateTalkConfigParams as Za, TaskSuggestionsListResultSchema as Zc, TASKS_LIST_CURSOR_MAX_LENGTH as Zd, SessionsDeleteResultSchema as Zf, SessionsCatalogContinueResultSchema as Zh, validateSessionsRecoverParams as Zi, CronDeliveryPreviewSchema as Zl, UiPanelCommandSchema as Zm, validatePluginsControlUiStatusParams as Zn, validateUpdateRunRecord as Zo, BoardSizeSchema as Zp, validateSessionPublicShareSetParams as Zr, validateWizardNextParams as Zs, validateExecApprovalsNodeGetParams as Zt, AgentsWorkspaceFileSchema as Zu, validateArtifactsGetParams as _, validateSkillsProposalEventsListParams as _a, validateWorktreesRemoveParams as _c, PollParamsSchema as _d, SessionSuggestionsListResultSchema as _f, normalizeUiAppearancePreference as _g, formatValidationErrors as _h, validateSessionsCompanionStateParams as _i, QuestionResolveParamsSchema as _l, BoardWidgetMcpAppPutContentSchema as _m, validateModelsAuthLogoutParams as _n, validateTasksCancelParams as _o, ProgressCardGetParamsSchema as _p, validateProjectsAddParams as _r, validateUsersLinkChannelIdentityResult as _s, validateCronScratchGetParams as _t, SystemAgentSetupActivateParamsSchema as _u, validateAgentsDeleteParams as a, validateSessionsTitlePrepareParams as aa, validateWorkerDesktopObserveParams as ac, AgentParamsSchema as ad, TasksListParamsSchema as af, PluginInstallActivitySchema as ag, WebSearchStatusResultSchema as ah, validateSessionsAssignOwnerParams as ai, SessionDiscussionStateSchema as al, BoardTicketEventParamsSchema as am, validateGatewaySuspendPrepareResult as an, validateTalkSessionCreateParams as ao, SessionsStorageParamsSchema as ap, validatePluginsSessionActionResult as ar, validateUsersAuthConnectAnswerParams as as, validateConfigSetParams as at, CronScratchGetParamsSchema as au, validateAuditListParams as b, validateSkillsProposalReviseParams as ba, WorktreeBranchSchema as bc, GATEWAY_RESTART_UNAVAILABLE_REASON as bd, SessionTypingEventSchema as bf, SkillsCuratorStatusParamsSchema as bg, validateTerminalInputParams as bh, validateSessionsDescribeParams as bi, QuestionSchema as bl, BoardWidgetPluginContentSchema as bm, validateModelsAuthSetApiKeyParams as bn, validateTasksListParams as bo, ProgressCardPutResultSchema as bp, validateProjectsRemoveParams as br, validateUsersListAuthLinksParams as bs, validateCronUpdateParams as bt, SystemAgentSetupActivateStartResultSchema as bu, validateAgentsFilesSetParams as c, validateSkillsBinsParams as ca, validateWorkerLiveEventParams as cc, ConversationListResultSchema as cd, TasksRecoveryResultSchema as cf, GitHubPublicationTitleSchema as cg, validateWebSearchStatusParams as ch, validateSessionsCatalogArchiveParams as ci, QuestionGetResultSchema as cl, BoardWidgetAppViewParamsSchema as cm, validateGatewaySuspendStatusResult as cn, validateTalkSpeakParams as co, SESSION_CREATE_IDEMPOTENCY_RETENTION_MS as cp, validatePluginsUiDescriptorsResult as cr, validateUsersAuthConnectStartParams as cs, validateConversationSendParams as ct, CronScratchSetResultSchema as cu, validateAgentsWorkspaceGetParams as d, validateSkillsDetailParams as da, validateWorkerSessionsSpawnParams as dc, ConversationTurnCancelParamsSchema as dd, SessionSuggestionResolutionSchema as df, SessionGitHubOptionsResultSchema as dg, SkillsProposalHistoryScanResultSchema as dh, validateSessionsCatalogReadParams as di, QuestionOptionSchema as dl, BoardWidgetDeclaredSchema as dm, validateMcpAuthLoginParams as dn, validateTalkVoiceGetParams as do, SessionsRecoverParamsSchema as dp, validatePortalCloseParams as dr, validateUsersGitHubAuthorizePollParams as ds, validateCronAddParams as dt, SystemAgentChatHistoryParamsSchema as du, validateSessionsRewindParams as ea, validateWorkerAdmissionHandshake as ec, AgentsWorkspaceListParamsSchema as ed, TasksCancelResultSchema as ef, SessionsCatalogListResultSchema as eg, PluginSkillFileSchema as eh, validateSessionSuggestionsResolveParams as ei, SessionDiscussionInfoParamsSchema as el, BoardTabDeleteOpSchema as em, validateExecApprovalsSetParams as en, validateTalkSessionAcknowledgeMarkParams as eo, SessionsListParamsSchema as ep, validatePluginsListParams as er, validateUpdateRunsGetResult as es, validateConfigGetParams as et, CronListParamsSchema as eu, validateAgentsWorkspaceListParams as f, validateSkillsInstallParams as fa, validateWorkerTranscriptCommitParams as fc, ConversationTurnCancelResultSchema as fd, SessionSuggestionSchema as ff, SessionGitHubPublicationResultSchema as fg, SkillsProposalHistoryStatusParamsSchema as fh, validateSessionsCatalogStartTerminalParams as fi, QuestionRecordSchema as fl, BoardWidgetGeneratedIdentitySchema as fm, validateMentionsChangedEvent as fn, validateTalkVoiceSetParams as fo, SessionsRecoverResultSchema as fp, validatePortalListParams as fr, validateUsersGitHubAuthorizeStartParams as fs, validateCronGetParams as ft, SystemAgentChatHistoryResultSchema as fu, validateArtifactsDownloadParams as g, validateSkillsProposalEvaluateParams as ga, validateWorktreesListParams as gc, MessageActionParamsSchema as gd, SessionSuggestionsListParamsSchema as gf, UI_APPEARANCE_PREFERENCE_KEYS as gg, ComputerStatusParamsSchema as gh, validateSessionsCompanionResetParams as gi, QuestionRequestedEventSchema as gl, BoardWidgetMcpAppContentSchema as gm, validateMessageActionParams as gn, validateTaskSuggestionsListParams as go, ProgressCardChangedEventSchema as gp, validateProgressCardRefreshParams as gr, validateUsersLinkChannelIdentityParams as gs, validateCronRunsParams as gt, SystemAgentChatResultSchema as gu, validateApprovalResolveParams as h, validateSkillsProposalDecisionParams as ha, validateWorktreesGcParams as hc, ConversationTurnResultSchema as hd, SessionSuggestionsAddResultSchema as hf, SessionGitHubStatusResultSchema as hg, ComputerInvokeParamsSchema as hh, validateSessionsCompanionAskParams as hi, QuestionRequestResultSchema as hl, BoardWidgetHtmlContentSchema as hm, validateMentionsListResult as hn, validateTaskSuggestionsDismissParams as ho, PROGRESS_CARD_MAX_UTF8_BYTES as hp, validateProgressCardPutParams as hr, validateUsersLinkAuthProfileParams as hs, validateCronRunParams as ht, SystemAgentChatQuestionSchema as hu, validateAgentsCreateParams as i, validateSessionsStorageParams as ia, validateWorkerDesktopLaunchResult as ic, AgentIdentityResultSchema as id, TasksHistoryResultSchema as if, SessionsCatalogStartTerminalResultSchema as ig, WebSearchStatusParamsSchema as ih, validateSessionsActivitySummaryEnsureParams as ii, SessionDiscussionOpenResultSchema as il, BoardTabsReorderOpSchema as im, validateGatewaySuspendPrepareParams as in, validateTalkSessionCloseParams as io, SessionsGoalUpdateParamsSchema as ip, validatePluginsSessionActionParams as ir, validateUpdateStatusResult as is, validateConfigSchemaParams as it, CronRunsParamsSchema as iu, validateBoardWidgetPutParams as j, validateSkillsWorkshopReadParams as ja, WorktreesRemoveResultSchema as jc, PROJECTS_LIST_MAX_CHECKOUTS_PER_PROJECT as jd, SessionPublicShareSchema as jf, readSystemAgentInferenceUnavailableErrorDetails as jg, TerminalExitEventSchema as jh, validateSessionsGroupsDeleteParams as ji, WebPushVapidPublicKeyParamsSchema as jl, TALK_VOICE_CHANGE_TIMEOUT_MS as jm, validateNodeListParams as jn, validateToolsGitHubAuthorizePollResult as jo, BOARD_CRON_TRIGGER_PREFIX as jp, validateSecretsResolveParams as jr, validateUsersSelfResult as js, validateDevicePairSetupCodeParams as jt, SystemChangesListResultSchema as ju, validateBoardWidgetContent as k, validateSkillsUploadChunkParams as ka, WorktreesListResultSchema as kc, MigrationsMemoryPlanParamsSchema as kd, SessionMembersListParamsSchema as kf, buildSystemAgentInferenceUnavailableErrorDetails as kg, TerminalDataEventSchema as kh, validateSessionsGroupsDefaultsParams as ki, WebPushTestParamsSchema as kl, BoardWidgetResizeOpSchema as km, validateNodeInvokeProgressParams as kn, validateToolsGitHubAuthorizeCancelResult as ko, CanvasDocumentViewResultSchema as kp, validateScopeUpgradeRequest as kr, validateUsersSelectModelAccountParams as ks, validateDevicePairRemoveParams as kt, SystemChangeSourceSchema as ku, validateAgentsListParams as l, validateSkillsCuratorActionParams as la, validateWorkerPortalParams as lc, ConversationSendParamsSchema as ld, SessionSuggestionActionSchema as lf, SessionGitHubConfirmParamsSchema as lg, validateWebSearchTestParams as lh, validateSessionsCatalogContinueParams as li, QuestionListParamsSchema as ll, BoardWidgetAppViewResultSchema as lm, validateHooksStatusParams as ln, validateTalkVoiceChangeEvent as lo, SESSION_CREATE_RETRY_WINDOW_MS as lp, validatePluginsUninstallParams as lr, validateUsersAuthConnectStatusParams as ls, validateConversationTurnCancelParams as lt, CronStatusParamsSchema as lu, validateApprovalHistoryParams as m, validateSkillsProposalCreateParams as ma, validateWorktreesCreateParams as mc, ConversationTurnReplySchema as md, SessionSuggestionsAddParamsSchema as mf, SessionGitHubStatusParamsSchema as mg, validateSkillsProposalHistoryStatusParams as mh, validateSessionsCompactParams as mi, QuestionRequestQuestionSchema as ml, BoardWidgetHeightModeSchema as mm, validateMentionsListParams as mn, validateTaskSuggestionsCreateParams as mo, PROGRESS_CARD_MAX_STEP_UTF8_BYTES as mp, validateProgressCardGetParams as mr, validateUsersGitHubStatusParams as ms, validateCronRemoveParams as mt, SystemAgentChatParamsSchema as mu, validateAgentParams as n, validateSessionsSendParams as na, validateWorkerConnectRequestFrame as nc, AgentEventSchema as nd, TasksGetResultSchema as nf, SessionsCatalogReadResultSchema as ng, PluginsSkillsReadResultSchema as nh, validateSessionVisibilitySetParams as ni, SessionDiscussionInfoSchema as nl, BoardTabSchema as nm, validateFsListDirResult as nn, validateTalkSessionCancelOutputParams as no, SessionsGoalClearParamsSchema as np, validatePluginsReloadParams as nr, validateUpdateRunsListResult as ns, validateConfigSchemaLookupParams as nt, CronRunLogEntrySchema as nu, validateAgentsFilesGetParams as o, validateSessionsUsageParams as oa, validateWorkerDesktopObserveResult as oc, ConversationListItemSchema as od, TasksListResultSchema as of, PluginsInstallProgressEventSchema as og, WebSearchTestParamsSchema as oh, validateSessionsBranchesListParams as oi, QuestionAnswersSchema as ol, BoardUpdateParamsSchema as om, validateGatewaySuspendResumeParams as on, validateTalkSessionSteerParams as oo, SessionsStorageStatusResultSchema as op, validatePluginsSetEnabledParams as or, validateUsersAuthConnectCancelParams as os, validateConnectParams as ot, CronScratchGetResultSchema as ou, validateApprovalGetParams as p, validateSkillsProposalActionParams as pa, validateWorktreesBranchesParams as pc, ConversationTurnParamsSchema as pd, SessionSuggestionStateSchema as pf, SessionGitHubPublishParamsSchema as pg, validateSkillsProposalHistoryScanParams as ph, validateSessionsCleanupParams as pi, QuestionRequestParamsSchema as pl, BoardWidgetGrantParamsSchema as pm, validateMentionsDismissParams as pn, validateTaskSuggestionsAcceptParams as po, PROGRESS_CARD_MAX_STEPS as pp, validatePortalOpenParams as pr, validateUsersGitHubDisconnectParams as ps, validateCronListParams as pt, SystemAgentChatHistoryTurnSchema as pu, validateChatSendParams as q, validateTalkClientSteerParams as qa, TaskSuggestionsCreateResultSchema as qc, ProjectsRemoveResultSchema as qd, SessionsPatchMutationSchema as qf, SessionCatalogTranscriptItemSchema as qh, validateSessionsPreviewParams as qi, CronAddJobResultSchema as ql, UiCommandResultSchema as qm, validatePluginsCatalogGetParams as qn, validateUpdateReportParams as qo, BoardOpSchema as qp, validateSessionGitHubStatusParams as qr, validateWebPushTestParams as qs, validateExecApprovalGrantsRevokeParams as qt, ArtifactsDownloadParamsSchema as qu, validateAgentWaitParams as r, validateSessionsSetInvolvementParams as ra, validateWorkerDesktopLaunchParams as rc, AgentIdentityParamsSchema as rd, TasksHistoryParamsSchema as rf, SessionsCatalogStartTerminalParamsSchema as rg, validatePluginsSkillsReadParams as rh, validateSessionsAbortParams as ri, SessionDiscussionOpenParamsSchema as rl, BoardTabUpdateOpSchema as rm, validateGatewaySuspendHandoffParams as rn, validateTalkSessionCancelOutputResult as ro, SessionsGoalMutationResultSchema as rp, validatePluginsSearchParams as rr, validateUpdateStatusParams as rs, validateConfigSchemaLookupResult as rt, CronRunParamsSchema as ru, validateAgentsFilesListParams as s, validateSessionsViewerPresenceSetParams as sa, validateWorkerHeartbeatParams as sc, ConversationListParamsSchema as sd, TasksRecoveryParamsSchema as sf, GitHubPublicationBodySchema as sg, WebSearchTestResultSchema as sh, validateSessionsBranchesSwitchParams as si, QuestionGetParamsSchema as sl, BoardViewTicketSchema as sm, validateGatewaySuspendStatusParams as sn, validateTalkSessionSubmitToolResultParams as so, SessionsSetInvolvementParamsSchema as sp, validatePluginsUiDescriptorsParams as sr, validateUsersAuthConnectCatalogParams as ss, validateConversationListParams as st, CronScratchSetParamsSchema as su, validateAgentIdentityParams as t, validateSessionsSearchParams as ta, validateWorkerComputerParams as tc, AgentsWorkspaceListResultSchema as td, TasksGetParamsSchema as tf, SessionsCatalogReadParamsSchema as tg, PluginsSkillsReadParamsSchema as th, validateSessionTypingParams as ti, SessionDiscussionInfoResultSchema as tl, BoardTabIdSchema as tm, validateFsListDirParams as tn, validateTalkSessionAppendAudioParams as to, SessionGoalSchema as tp, validatePluginsRefreshParams as tr, validateUpdateRunsListParams as ts, validateConfigPatchParams as tt, CronRemoveParamsSchema as tu, validateAgentsUpdateParams as u, validateSkillsCuratorStatusParams as ua, validateWorkerSessionsSendParams as uc, ConversationSendResultSchema as ud, SessionSuggestionEventSchema as uf, SessionGitHubOptionsParamsSchema as ug, SkillsProposalHistoryScanParamsSchema as uh, validateSessionsCatalogListParams as ui, QuestionListResultSchema as ul, BoardWidgetContentSchema as um, validateLogsTailParams as un, validateTalkVoiceCompleteParams as uo, SessionsCreateParamsSchema as up, validatePollParams as ur, validateUsersGitHubAuthorizeCancelParams as us, validateConversationTurnParams as ut, CronUpdateParamsSchema as uu, validateArtifactsListParams as v, validateSkillsProposalInspectParams as va, validateWorktreesRestoreParams as vc, SendParamsSchema as vd, SessionSuggestionsResolveParamsSchema as vf, SkillsCuratorActionParamsSchema as vg, validateTerminalAttachParams as vh, validateSessionsCreateParams as vi, QuestionResolveResultSchema as vl, BoardWidgetMoveOpSchema as vm, validateModelsAuthOrderSetParams as vn, validateTasksGetParams as vo, ProgressCardGetResultSchema as vp, validateProjectsListParams as vr, validateUsersLinkEmailParams as vs, validateCronScratchSetParams as vt, SystemAgentSetupActivateResultSchema as vu, validateBoardEventParams as w, validateSkillsSecurityVerdictsParams as wa, WorktreesBranchesResultSchema as wc, validateMigrationsMemoryApplyParams as wd, SessionMemberEvidenceSchema as wf, EnvironmentsSessionCreateParamsSchema as wg, validateTerminalUploadResult as wh, validateSessionsFilesRevealParams as wi, PushTestParamsSchema as wl, BoardWidgetPutContentSchema as wm, validateModelsProbeParams as wn, validateThemesListParams as wo, ProgressCardStepSchema as wp, validateQuestionListParams as wr, validateUsersListParams as ws, validateDesktopReleaseParams as wt, SystemAgentSetupDetectResultSchema as wu, validateAuditRunInspectParams as x, validateSkillsProposalUpdateParams as xa, WorktreeRecordSchema as xc, GATEWAY_SUSPEND_UNAVAILABLE_REASON as xd, SessionTypingParamsSchema as xf, SkillsCuratorStatusResultSchema as xg, validateTerminalOpenParams as xh, validateSessionsDiffParams as xi, QuestionStatusSchema as xl, BoardWidgetPluginKindSchema as xm, validateModelsAuthSetApiKeyResult as xn, validateTasksRecoveryParams as xo, ProgressCardRefreshParamsSchema as xp, validateProjectsSearchRemoteParams as xr, validateUsersListChannelIdentitiesParams as xs, validateDesktopLaunchParams as xt, SystemAgentSetupAuthStartParamsSchema as xu, validateAuditActivityListParams as y, validateSkillsProposalRequestRevisionParams as ya, ToolsCatalogParamsSchema as yc, WakeParamsSchema as yd, SessionSuggestionsResolveResultSchema as yf, SkillsCuratorActionResultSchema as yg, validateTerminalCloseParams as yh, validateSessionsDeleteParams as yi, QuestionResolvedEventSchema as yl, BoardWidgetNameSchema as ym, validateModelsAuthRefreshParams as yn, validateTasksHistoryParams as yo, ProgressCardPutParamsSchema as yp, validateProjectsRegisterParams as yr, validateUsersLinkEmailResult as ys, validateCronStatusParams as yt, SystemAgentSetupActivateStartParamsSchema as yu, validateChannelsStartParams as z, validateSystemChangesListParams as za, PortalOpenResultSchema as zc, ProjectSummarySchema as zd, SessionVisibilitySetResultSchema as zf, isCloudWorkerPlacementState as zg, TerminalUploadResultSchema as zh, validateSessionsListParams as zi, DesktopReleaseParamsSchema as zl, ThemeModeSchema as zm, validateNodePluginToolsUpdateParams as zn, validateTranscriptsGetParams as zo, BoardCommandSchema as zp, validateSessionCatalogShareRoute as zr, validateUsersUnlinkChannelIdentityParams as zs, validateEnvironmentsPrepareResult as zt, ChannelsPairingDismissParamsSchema as zu };
