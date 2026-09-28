import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { nt as withSince } from "./worker-admission-BB3C4gz4.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXfMhak.mjs";
import { a as NonEmptyString, c as UserProfileIdSchema } from "./primitives-C-2-W5SF.mjs";
import { Ct as ToolsGitHubAuthorizeNetworkErrorResultSchema, Dt as ToolsGitHubAuthorizeSlowDownResultSchema, St as ToolsGitHubAuthorizeIncorrectDeviceCodeResultSchema, _t as ToolsGitHubAuthorizeAccessDeniedResultSchema, bt as ToolsGitHubAuthorizeExpiredResultSchema, wt as ToolsGitHubAuthorizePendingResultSchema, x as GitHubIdentityFactsSchema, xt as ToolsGitHubAuthorizeFailedResultSchema } from "./agents-models-skills-ChHh3UoN.mjs";
import { t as APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN } from "./approval-id-BTRnO3t1.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/model-account-selection.ts
const ModelAuthProfileIdSchema = Type.String({
	minLength: 1,
	maxLength: 256
});
const ChatAccountSelectionSourceSchema = Type.Optional(Type.Union([
	Type.Literal("auto"),
	Type.Literal("user"),
	Type.Literal("user-link")
]));
const ChatAccountSelectionLabelSchema = Type.String({
	minLength: 1,
	maxLength: 256
});
/** Configured preference only; provider failover can use a different account. */
const ChatAccountSelectionSchema = Type.Union([
	closedObject({
		kind: Type.Literal("automatic"),
		label: ChatAccountSelectionLabelSchema
	}),
	closedObject({
		kind: Type.Literal("personal"),
		label: ChatAccountSelectionLabelSchema,
		authProfileId: Type.Optional(ModelAuthProfileIdSchema),
		source: ChatAccountSelectionSourceSchema
	}),
	closedObject({
		kind: Type.Literal("shared"),
		label: ChatAccountSelectionLabelSchema,
		authProfileId: ModelAuthProfileIdSchema,
		source: ChatAccountSelectionSourceSchema
	})
]);
//#endregion
//#region packages/gateway-protocol/src/schema/setup-inference.ts
const SetupInferenceFailureStatusSchema = Type.Union([
	Type.Literal("auth"),
	Type.Literal("rate_limit"),
	Type.Literal("billing"),
	Type.Literal("timeout"),
	Type.Literal("format"),
	Type.Literal("unavailable"),
	Type.Literal("unknown")
]);
/** Finalized rejection before the model config commit; saved credentials may remain. */
const SetupInferenceActivationRejectionSchema = closedObject({
	disposition: Type.Literal("rejected-before-promotion"),
	status: SetupInferenceFailureStatusSchema
});
//#endregion
//#region packages/gateway-protocol/src/schema/wizard.ts
/** Runtime state reported for gateway-driven setup wizard sessions. */
const WizardRunStatusSchema = Type.Union([
	Type.Literal("running"),
	Type.Literal("done"),
	Type.Literal("cancelled"),
	Type.Literal("error")
]);
/** Starts a setup wizard, optionally scoped to a local or remote workspace. */
const WizardStartParamsSchema = closedObject({
	mode: Type.Optional(Type.Union([Type.Literal("local"), Type.Literal("remote")])),
	workspace: Type.Optional(Type.String()),
	installDaemon: Type.Optional(Type.Boolean()),
	flow: Type.Optional(Type.Union([Type.Literal("setup"), Type.Literal("channels")])),
	channel: Type.Optional(NonEmptyString)
});
const McpAuthLoginParamsSchema = closedObject({
	sessionId: NonEmptyString,
	serverName: NonEmptyString
});
/** Client answer payload for the current wizard step. */
const WizardAnswerSchema = closedObject({
	stepId: NonEmptyString,
	value: Type.Optional(Type.Unknown())
});
/** Advances a wizard session, with an answer when the previous step requested input. */
const WizardNextParamsSchema = closedObject({
	sessionId: NonEmptyString,
	answer: Type.Optional(WizardAnswerSchema)
});
/** Session-id-only params for status requests. */
const WizardSessionIdParamsSchema = closedObject({ sessionId: NonEmptyString });
/** Cancels a wizard or closes input when its client view is discarded. */
const WizardCancelParamsSchema = closedObject({
	sessionId: NonEmptyString,
	closeInput: Type.Optional(Type.Boolean())
});
/** Reads status for an active or recently completed wizard session. */
const WizardStatusParamsSchema = WizardSessionIdParamsSchema;
/** Selectable value shown in a choice-based wizard step. */
const WizardStepOptionSchema = closedObject({
	value: Type.Unknown(),
	label: NonEmptyString,
	hint: Type.Optional(Type.String())
});
const WizardDeviceCodeSchema = closedObject({
	code: NonEmptyString,
	expiresInMinutes: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 1440
	})),
	message: Type.Optional(Type.String())
});
/** UI contract for one wizard step rendered by gateway clients. */
const WizardStepSchema = closedObject({
	id: NonEmptyString,
	type: Type.Union([
		Type.Literal("note"),
		Type.Literal("select"),
		Type.Literal("text"),
		Type.Literal("confirm"),
		Type.Literal("multiselect"),
		Type.Literal("progress"),
		Type.Literal("action")
	]),
	title: Type.Optional(Type.String()),
	message: Type.Optional(Type.String()),
	format: Type.Optional(Type.Union([Type.Literal("plain")])),
	options: Type.Optional(Type.Array(WizardStepOptionSchema)),
	initialValue: Type.Optional(Type.Unknown()),
	placeholder: Type.Optional(Type.String()),
	sensitive: Type.Optional(Type.Boolean()),
	executor: Type.Optional(Type.Union([Type.Literal("gateway"), Type.Literal("client")])),
	externalUrl: Type.Optional(Type.String()),
	deviceCode: Type.Optional(WizardDeviceCodeSchema)
});
/** Channel/account pair the channels flow actually configured. */
const WizardConfiguredAccountSchema = closedObject({
	channel: NonEmptyString,
	accountId: NonEmptyString
});
/** Common response fields for start and next calls. */
const WizardResultFields = {
	done: Type.Boolean(),
	step: Type.Optional(WizardStepSchema),
	status: Type.Optional(WizardRunStatusSchema),
	error: Type.Optional(Type.String()),
	channels: Type.Optional(Type.Array(NonEmptyString)),
	accounts: Type.Optional(Type.Array(WizardConfiguredAccountSchema)),
	preparedModelRef: Type.Optional(NonEmptyString),
	modelActivation: Type.Optional(closedObject({
		modelRef: NonEmptyString,
		modelTarget: Type.Optional(Type.Literal("utility")),
		gatewayRestartRequired: Type.Optional(Type.Literal(true))
	})),
	activationRejection: Type.Optional(SetupInferenceActivationRejectionSchema)
};
/** Result after advancing a wizard session. */
const WizardNextResultSchema = closedObject(WizardResultFields);
/** Result returned when a wizard session is created. */
const WizardStartResultSchema = closedObject({
	sessionId: NonEmptyString,
	...WizardResultFields
});
/** Minimal status poll result used when the client does not need the next step. */
const WizardStatusResultSchema = closedObject({
	status: WizardRunStatusSchema,
	error: Type.Optional(Type.String())
});
//#endregion
//#region packages/gateway-protocol/src/schema/users.ts
const UserProfileDisplayNameSchema = Type.String({ maxLength: 256 });
const UserProfileRoleSchema = Type.String({
	minLength: 1,
	maxLength: 128,
	pattern: "\\S"
});
const UserPreferenceKeySchema = Type.String({ pattern: "^.{1,256}$" });
const UserPreferenceEntriesSchema = Type.Record(UserPreferenceKeySchema, Type.Unknown());
const UserPreferenceSetEntriesSchema = Type.Record(UserPreferenceKeySchema, Type.Unknown(), { maxProperties: 32 });
const UserProfileAvatarMimeSchema = Type.Union([
	Type.Literal("image/png"),
	Type.Literal("image/jpeg"),
	Type.Literal("image/webp")
]);
const UserProfileGitHubIdentitySchema = closedObject({
	login: Type.String({
		minLength: 1,
		maxLength: 39
	}),
	profileUrl: NonEmptyString,
	avatarUrl: NonEmptyString
});
const UserProfileSchema = closedObject({
	id: UserProfileIdSchema,
	displayName: Type.Union([UserProfileDisplayNameSchema, Type.Null()]),
	avatarMime: Type.Union([UserProfileAvatarMimeSchema, Type.Null()]),
	mergedInto: Type.Union([UserProfileIdSchema, Type.Null()]),
	createdAt: Type.Integer({ minimum: 0 }),
	updatedAt: Type.Integer({ minimum: 0 }),
	emails: Type.Array(NonEmptyString),
	githubIdentity: Type.Union([UserProfileGitHubIdentitySchema, Type.Null()]),
	hasAvatar: Type.Boolean(),
	role: Type.Optional(UserProfileRoleSchema)
});
const UsersListParamsSchema = closedObject({});
const UsersListResultSchema = closedObject({ profiles: Type.Array(UserProfileSchema) });
const UsersSelfParamsSchema = closedObject({});
const UsersSelfResultSchema = closedObject({ profile: UserProfileSchema });
const UsersLinkEmailParamsSchema = closedObject({
	email: Type.String({
		minLength: 1,
		maxLength: 320
	}),
	targetProfileId: UserProfileIdSchema
});
const UsersLinkEmailResultSchema = closedObject({ profile: UserProfileSchema });
const ChannelIdentityPartSchema = Type.String({
	minLength: 1,
	maxLength: 512,
	pattern: "^\\S(?:.*\\S)?$"
});
const UserChannelIdentitySchema = closedObject({
	channelId: ChannelIdentityPartSchema,
	accountId: ChannelIdentityPartSchema,
	senderId: ChannelIdentityPartSchema
});
const UserChannelIdentityLinkSchema = closedObject({
	profileId: UserProfileIdSchema,
	identity: UserChannelIdentitySchema
});
const UsersLinkChannelIdentityParamsSchema = UserChannelIdentityLinkSchema;
const UsersLinkChannelIdentityResultSchema = UserChannelIdentityLinkSchema;
const UsersUnlinkChannelIdentityParamsSchema = UserChannelIdentityLinkSchema;
const UsersUnlinkChannelIdentityResultSchema = closedObject({ removed: Type.Boolean() });
const UsersListChannelIdentitiesParamsSchema = closedObject({ profileId: UserProfileIdSchema });
const UsersListChannelIdentitiesResultSchema = closedObject({ links: Type.Array(UserChannelIdentityLinkSchema) });
const UsersSetDisplayNameParamsSchema = closedObject({
	profileId: UserProfileIdSchema,
	displayName: Type.Union([UserProfileDisplayNameSchema, Type.Null()])
});
const UsersSetDisplayNameResultSchema = closedObject({ profile: UserProfileSchema });
const UsersSetRoleParamsSchema = closedObject({
	profileId: UserProfileIdSchema,
	role: Type.Union([UserProfileRoleSchema, Type.Null()])
});
const UsersSetRoleResultSchema = closedObject({ profile: UserProfileSchema });
const UsersSetAvatarParamsSchema = closedObject({
	profileId: UserProfileIdSchema,
	mime: UserProfileAvatarMimeSchema,
	avatarBase64: Type.String({
		minLength: 1,
		maxLength: 7e5
	})
});
const UsersSetAvatarResultSchema = closedObject({
	profile: UserProfileSchema,
	avatarRevision: NonEmptyString
});
const ModelAuthProviderIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const ModelAuthConnectIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const UserProfileAuthLinkSchema = closedObject({
	provider: ModelAuthProviderIdSchema,
	authProfileId: ModelAuthProfileIdSchema,
	updatedAt: Type.Integer({ minimum: 0 })
});
const UserModelAccountSchema = closedObject({
	authProfileId: ModelAuthProfileIdSchema,
	provider: ModelAuthProviderIdSchema,
	label: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	authType: Type.Union([
		Type.Literal("api_key"),
		Type.Literal("oauth"),
		Type.Literal("token")
	]),
	selected: Type.Boolean()
});
const UsersListModelAccountsParamsSchema = closedObject({
	profileId: Type.Optional(UserProfileIdSchema),
	cursor: Type.Optional(ModelAuthProfileIdSchema)
});
const UsersListModelAccountsResultSchema = closedObject({
	profileId: UserProfileIdSchema,
	accounts: Type.Array(UserModelAccountSchema, { maxItems: 50 }),
	nextCursor: Type.Optional(ModelAuthProfileIdSchema),
	links: Type.Array(UserProfileAuthLinkSchema)
});
const UsersSelectModelAccountParamsSchema = closedObject({
	profileId: Type.Optional(UserProfileIdSchema),
	authProfileId: ModelAuthProfileIdSchema
});
const UsersSelectModelAccountResultSchema = closedObject({ links: Type.Array(UserProfileAuthLinkSchema) });
const UsersListAuthLinksParamsSchema = closedObject({ profileId: UserProfileIdSchema });
const UsersListAuthLinksResultSchema = closedObject({ links: Type.Array(UserProfileAuthLinkSchema) });
const UsersLinkAuthProfileParamsSchema = closedObject({
	profileId: UserProfileIdSchema,
	authProfileId: ModelAuthProfileIdSchema
});
const UsersLinkAuthProfileResultSchema = closedObject({ links: Type.Array(UserProfileAuthLinkSchema) });
const UsersUnlinkAuthProfileParamsSchema = closedObject({
	profileId: UserProfileIdSchema,
	provider: ModelAuthProviderIdSchema
});
const UsersUnlinkAuthProfileResultSchema = closedObject({ links: Type.Array(UserProfileAuthLinkSchema) });
const UsersAuthConnectCatalogParamsSchema = closedObject({ profileId: UserProfileIdSchema });
const UsersAuthConnectCatalogResultSchema = closedObject({ providers: Type.Array(closedObject({
	id: ModelAuthProviderIdSchema,
	label: NonEmptyString,
	methods: Type.Array(closedObject({
		id: NonEmptyString,
		label: NonEmptyString,
		hint: Type.Optional(Type.String())
	}))
})) });
const UsersAuthConnectStartParamsSchema = closedObject({
	profileId: UserProfileIdSchema,
	provider: ModelAuthProviderIdSchema,
	method: NonEmptyString
});
const UsersAuthConnectStartResultSchema = closedObject({
	connectId: ModelAuthConnectIdSchema,
	expiresAtMs: Type.Integer({ minimum: 0 })
});
const UsersAuthConnectAnswerParamsSchema = closedObject({
	profileId: UserProfileIdSchema,
	connectId: ModelAuthConnectIdSchema,
	...WizardAnswerSchema.properties
});
const UsersAuthConnectStatusParamsSchema = closedObject({
	profileId: UserProfileIdSchema,
	connectId: ModelAuthConnectIdSchema
});
const UsersAuthConnectCancelParamsSchema = UsersAuthConnectStatusParamsSchema;
const UsersAuthConnectStatusResultSchema = Type.Union([
	closedObject({
		status: Type.Literal("pending"),
		step: Type.Optional(WizardStepSchema),
		error: Type.Optional(Type.String())
	}),
	closedObject({
		status: Type.Literal("connected"),
		authProfileId: ModelAuthProfileIdSchema,
		links: Type.Array(UserProfileAuthLinkSchema)
	}),
	closedObject({ status: Type.Literal("cancelled") }),
	closedObject({ status: Type.Literal("expired") }),
	closedObject({
		status: Type.Literal("failed"),
		reason: Type.Union([
			Type.Literal("exchange"),
			Type.Literal("identity"),
			Type.Literal("authority"),
			Type.Literal("unavailable")
		])
	})
]);
const UsersAuthConnectResultSchema = closedObject({
	authProfileId: ModelAuthProfileIdSchema,
	links: Type.Array(UserProfileAuthLinkSchema)
});
const UsersPrefsGetParamsSchema = closedObject({ keys: Type.Optional(Type.Array(UserPreferenceKeySchema, {
	maxItems: 32,
	uniqueItems: true
})) });
const UsersPrefsGetResultSchema = Type.Union([closedObject({
	status: Type.Literal("ok"),
	entries: UserPreferenceEntriesSchema
}), closedObject({ status: Type.Literal("no_durable_identity") })]);
const UsersPrefsSetParamsSchema = closedObject({
	entries: UserPreferenceSetEntriesSchema,
	expectedEntries: Type.Optional(UserPreferenceSetEntriesSchema)
});
const UsersPrefsSetResultSchema = Type.Union([
	closedObject({ status: Type.Literal("ok") }),
	closedObject({ status: Type.Literal("conflict") }),
	closedObject({ status: Type.Literal("no_durable_identity") })
]);
const UsersPrefsChangedEventSchema = closedObject({
	profileId: UserProfileIdSchema,
	keys: Type.Array(UserPreferenceKeySchema, {
		maxItems: 32,
		uniqueItems: true
	})
});
const PersonalGitHubGenerationSchema = Type.String({
	format: "uuid",
	maxLength: 36
});
const PersonalGitHubAccountSchema = closedObject({
	accountId: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	login: Type.String({
		minLength: 1,
		maxLength: 39,
		pattern: "^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$"
	})
});
const UsersGitHubAuthorizeStartParamsSchema = closedObject({});
const UsersGitHubAuthorizeStartResultSchema = closedObject({
	requestId: PersonalGitHubGenerationSchema,
	userCode: Type.String({ pattern: "^[A-Z0-9]{4}-[A-Z0-9]{4}$" }),
	verificationUri: Type.Literal("https://github.com/login/device"),
	expiresInMs: Type.Integer({
		minimum: 0,
		maximum: 9e5
	}),
	pollAfterMs: Type.Integer({
		minimum: 1,
		maximum: 6e4
	})
});
const UsersGitHubAuthorizePollParamsSchema = closedObject({ requestId: PersonalGitHubGenerationSchema });
const UsersGitHubAuthorizeCancelParamsSchema = closedObject({ requestId: PersonalGitHubGenerationSchema });
const UsersGitHubAuthorizeCancelResultSchema = closedObject({ cancelled: Type.Boolean() });
const UsersGitHubDisconnectParamsSchema = closedObject({});
const UsersGitHubDisconnectResultSchema = closedObject({ disconnected: Type.Literal(true) });
const PersonalGitHubStatusSchema = closedObject({
	state: Type.Union([
		Type.Literal("connected"),
		Type.Literal("disconnected"),
		Type.Literal("unavailable")
	]),
	generation: Type.Union([PersonalGitHubGenerationSchema, Type.Null()]),
	account: Type.Union([PersonalGitHubAccountSchema, Type.Null()]),
	accessExpiresAtMs: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
	refreshState: Type.Union([
		Type.Literal("available"),
		Type.Literal("refreshing"),
		Type.Literal("expired"),
		Type.Literal("failed"),
		Type.Literal("not_applicable")
	]),
	pending: Type.Union([UsersGitHubAuthorizeStartResultSchema, Type.Null()])
});
const UsersGitHubStatusParamsSchema = closedObject({});
const UsersGitHubStatusResultSchema = closedObject({
	personal: PersonalGitHubStatusSchema,
	system: GitHubIdentityFactsSchema
});
const UsersGitHubAuthorizePollResultSchema = Type.Union([
	ToolsGitHubAuthorizePendingResultSchema,
	ToolsGitHubAuthorizeSlowDownResultSchema,
	ToolsGitHubAuthorizeAccessDeniedResultSchema,
	ToolsGitHubAuthorizeExpiredResultSchema,
	ToolsGitHubAuthorizeIncorrectDeviceCodeResultSchema,
	ToolsGitHubAuthorizeNetworkErrorResultSchema,
	ToolsGitHubAuthorizeFailedResultSchema,
	closedObject({
		status: Type.Literal("success"),
		personal: PersonalGitHubStatusSchema
	})
]);
//#endregion
//#region packages/gateway-protocol/src/schema/approvals.ts
const ApprovalIdSchema = Type.String({
	minLength: 1,
	pattern: APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN,
	description: "Exact full approval id encoded safely in deep-link paths."
});
/** Approval owner used to select the safe presentation payload. */
const ApprovalKindSchema = Type.Union([
	Type.Literal("exec"),
	Type.Literal("plugin"),
	Type.Literal("system-agent")
]);
/** Reviewer decisions accepted by the unified approval resolver. */
const ApprovalDecisionSchema = Type.Union([
	Type.Literal("allow-once"),
	Type.Literal("allow-always"),
	Type.Literal("deny")
]);
/** Reviewer decisions that permit an operation to proceed. */
const ApprovalAllowDecisionSchema = Type.Union([Type.Literal("allow-once"), Type.Literal("allow-always")]);
/** Closed reason recorded for a terminal approval transition. */
const ApprovalTerminalReasonSchema = Type.Union([
	Type.Literal("user"),
	Type.Literal("timeout"),
	Type.Literal("malformed-verdict"),
	Type.Literal("no-route"),
	Type.Literal("run-aborted"),
	Type.Literal("gateway-restart"),
	Type.Literal("storage-corrupt")
]);
/** Terminal reason accepted for an allowed approval. */
const ApprovalAllowedReasonSchema = Type.Union([Type.Literal("user")]);
/** Terminal reasons accepted for a denied approval. */
const ApprovalDeniedReasonSchema = Type.Union([
	Type.Literal("user"),
	Type.Literal("malformed-verdict"),
	Type.Literal("no-route"),
	Type.Literal("storage-corrupt")
]);
/** Terminal reason accepted for an expired approval. */
const ApprovalExpiredReasonSchema = Type.Union([Type.Literal("timeout")]);
/** Terminal reasons accepted for a cancelled approval. */
const ApprovalCancelledReasonSchema = Type.Union([Type.Literal("run-aborted"), Type.Literal("gateway-restart")]);
/** Reviewer-facing severity for plugin-owned approval requests. */
const PluginApprovalSeveritySchema = Type.Union([
	Type.Literal("info"),
	Type.Literal("warning"),
	Type.Literal("critical")
]);
/** Message/email delivery blast radius declared by the approval owner. */
const MessageSendApprovalScopeSchema = closedObject({
	kind: Type.Literal("message-send"),
	target: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	recipientCount: Type.Integer({
		minimum: 1,
		maximum: 1e6
	}),
	recipients: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 128
	}), { maxItems: 5 })),
	audience: Type.Optional(Type.Union([Type.Literal("internal"), Type.Literal("external")]))
});
/** Payment blast radius declared by the approval owner. */
const PaymentApprovalScopeSchema = closedObject({
	kind: Type.Literal("payment"),
	amount: Type.String({
		minLength: 1,
		maxLength: 40
	}),
	currency: Type.String({
		minLength: 1,
		maxLength: 12
	}),
	target: Type.String({
		minLength: 1,
		maxLength: 128
	})
});
/** External publication blast radius declared by the approval owner. */
const ExternalPostApprovalScopeSchema = closedObject({
	kind: Type.Literal("external-post"),
	target: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	visibility: Type.Union([Type.Literal("public"), Type.Literal("restricted")])
});
/**
* What allow-always mints for an automation approval: a standing grant bound
* to this exact command and automation. Absent expiresInDays means the grant
* lives until revoked or the automation changes.
*/
const StandingGrantApprovalScopeSchema = closedObject({
	kind: Type.Literal("standing-grant"),
	automation: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	command: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	expiresInDays: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 3650
	}))
});
/**
* Owner-declared blast-radius facts for a pending approval. Variants are
* named schemas so native protocol generators emit the discriminated union.
*/
const ApprovalScopeSchema = Type.Union([
	MessageSendApprovalScopeSchema,
	PaymentApprovalScopeSchema,
	ExternalPostApprovalScopeSchema,
	StandingGrantApprovalScopeSchema
]);
/** Reviewer-safe projection of a plugin-owned external verification choice. */
const PluginApprovalExternalResolutionSchema = closedObject({
	label: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	decisions: Type.Array(ApprovalAllowDecisionSchema, {
		minItems: 1,
		maxItems: 2,
		uniqueItems: true
	})
});
const ApprovalAllowedDecisionsSchema = Type.Array(ApprovalDecisionSchema, {
	minItems: 1,
	maxItems: 3,
	uniqueItems: true,
	contains: Type.Literal("deny"),
	description: "Available reviewer decisions. Deny is always available so malformed or unsafe input can fail closed."
});
const SystemAgentApprovalAllowedDecisionsSchema = Type.Tuple([Type.Literal("allow-once"), Type.Literal("deny")]);
/** Redacted exec details safe to persist and render outside the requesting runtime. */
const ExecApprovalPresentationSchema = Type.Object({
	kind: Type.Literal("exec"),
	commandText: NonEmptyString,
	commandPreview: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	warningText: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	host: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	nodeId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	scope: Type.Optional(ApprovalScopeSchema),
	allowedDecisions: ApprovalAllowedDecisionsSchema
}, {
	additionalProperties: false,
	description: "Reviewer-safe exec presentation. Runtime cwd, environment, system-run binding, and execution plan are intentionally excluded."
});
/** Plugin-supplied reviewer text safe to persist and render across surfaces. */
const PluginApprovalPresentationSchema = closedObject({
	kind: Type.Literal("plugin"),
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	description: Type.String({
		minLength: 1,
		maxLength: 512
	}),
	detail: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 16384
	})),
	severity: PluginApprovalSeveritySchema,
	pluginId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	toolName: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	scope: Type.Optional(ApprovalScopeSchema),
	allowedDecisions: ApprovalAllowedDecisionsSchema,
	externalResolution: Type.Optional(PluginApprovalExternalResolutionSchema)
});
/** Reviewer-safe OpenClaw system change. Exact operation stays host-local. */
const SystemAgentApprovalPresentationSchema = closedObject({
	kind: Type.Literal("system-agent"),
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	description: Type.String({
		minLength: 1,
		maxLength: 512
	}),
	proposalHash: Type.String({ pattern: "^[a-f0-9]{64}$" }),
	agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	allowedDecisions: SystemAgentApprovalAllowedDecisionsSchema
});
/** Reviewer-safe presentation discriminated by the approval owner. */
const ApprovalPresentationSchema = Type.Union([
	ExecApprovalPresentationSchema,
	PluginApprovalPresentationSchema,
	SystemAgentApprovalPresentationSchema
]);
const ApprovalRecordCommonFields = {
	id: ApprovalIdSchema,
	urlPath: NonEmptyString,
	createdAtMs: Type.Integer({ minimum: 0 }),
	expiresAtMs: Type.Integer({ minimum: 0 }),
	presentation: ApprovalPresentationSchema
};
/** Reviewer-safe origin attribution for terminal approval history. */
const ApprovalHistorySourceAttributionSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString)
});
/** Reviewer attribution recorded by the durable approval ledger. */
const ApprovalHistoryResolverAttributionSchema = closedObject({
	kind: Type.Union([
		Type.Literal("device"),
		Type.Literal("channel"),
		Type.Literal("runtime"),
		Type.Literal("system")
	]),
	id: Type.Optional(NonEmptyString)
});
const ApprovalResolutionFields = {
	resolvedAtMs: Type.Integer({ minimum: 0 }),
	source: Type.Optional(ApprovalHistorySourceAttributionSchema),
	resolver: Type.Optional(ApprovalHistoryResolverAttributionSchema)
};
/** Approval that has not yet accepted a reviewer decision. */
const PendingApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	status: Type.Literal("pending"),
	/** Canonical raising session when projected into a session-scoped reviewer surface. */
	sourceSessionKey: Type.Optional(NonEmptyString)
});
/** Approval whose first recorded reviewer decision allows the operation. */
const AllowedApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	...ApprovalResolutionFields,
	status: Type.Literal("allowed"),
	decision: ApprovalAllowDecisionSchema,
	reason: ApprovalAllowedReasonSchema
});
/** Approval whose first recorded reviewer decision denies the operation. */
const DeniedApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	...ApprovalResolutionFields,
	status: Type.Literal("denied"),
	decision: Type.Literal("deny"),
	reason: ApprovalDeniedReasonSchema
});
/** Approval that reached its deadline and therefore failed closed. */
const ExpiredApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	...ApprovalResolutionFields,
	status: Type.Literal("expired"),
	reason: ApprovalExpiredReasonSchema
});
/** Approval cancelled by its runtime owner before a reviewer decision. */
const CancelledApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	...ApprovalResolutionFields,
	status: Type.Literal("cancelled"),
	reason: ApprovalCancelledReasonSchema
});
/** Durable approval projection returned identically to every authorized surface. */
const ApprovalSnapshotSchema = Type.Union([
	PendingApprovalSnapshotSchema,
	AllowedApprovalSnapshotSchema,
	DeniedApprovalSnapshotSchema,
	ExpiredApprovalSnapshotSchema,
	CancelledApprovalSnapshotSchema
]);
/** Durable terminal approval state returned after a resolution attempt. */
const TerminalApprovalSnapshotSchema = Type.Union([
	AllowedApprovalSnapshotSchema,
	DeniedApprovalSnapshotSchema,
	ExpiredApprovalSnapshotSchema,
	CancelledApprovalSnapshotSchema
]);
/** Lookup payload for one approval by its exact full id. */
const ApprovalGetParamsSchema = closedObject({ id: ApprovalRecordCommonFields.id });
/** Current durable state for one authorized approval lookup. */
const ApprovalGetResultSchema = closedObject({ approval: ApprovalSnapshotSchema });
/** Cursor-based query for the retained terminal approval ledger. */
const ApprovalHistoryParamsSchema = closedObject({
	cursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 512
	})),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	})),
	kind: Type.Optional(ApprovalKindSchema)
});
/** Newest-first page from the retained terminal approval ledger. */
const ApprovalHistoryResultSchema = closedObject({
	items: Type.Array(TerminalApprovalSnapshotSchema),
	nextCursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 512
	}))
});
/** Reviewer decision for one approval identified by its exact full id. */
const ApprovalChannelReviewerSchema = closedObject({
	channel: NonEmptyString,
	accountId: NonEmptyString,
	senderId: NonEmptyString
});
const ApprovalResolveParamsSchema = closedObject({
	id: ApprovalRecordCommonFields.id,
	kind: ApprovalKindSchema,
	decision: ApprovalDecisionSchema,
	reviewer: Type.Optional(ApprovalChannelReviewerSchema),
	grantExpiresInDays: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 3650
	}))
});
/** First-answer outcome plus the canonical recorded state returned to all contenders. */
const ApprovalResolveResultSchema = closedObject({
	applied: Type.Boolean(),
	approval: TerminalApprovalSnapshotSchema
});
const SessionApprovalEventCommonFields = {
	sessionKey: NonEmptyString,
	sourceSessionKey: Type.Optional(NonEmptyString),
	updatedAtMs: Type.Integer({ minimum: 0 })
};
/** Sanitized pending transition delivered only to an opted-in session audience. */
const PendingSessionApprovalEventSchema = withSince("2026.7", closedObject({
	...SessionApprovalEventCommonFields,
	phase: Type.Literal("pending"),
	approval: PendingApprovalSnapshotSchema
}));
/** Sanitized terminal transition delivered only to an opted-in session audience. */
const TerminalSessionApprovalEventSchema = withSince("2026.7", closedObject({
	...SessionApprovalEventCommonFields,
	phase: Type.Literal("terminal"),
	approval: TerminalApprovalSnapshotSchema
}));
/** Sanitized approval transition delivered only to an opted-in session audience. */
const SessionApprovalEventSchema = withSince("2026.7", Type.Union([PendingSessionApprovalEventSchema, TerminalSessionApprovalEventSchema]));
/** Authoritative pending approval set returned when a session stream subscribes. */
const SessionApprovalReplaySchema = withSince("2026.7", closedObject({
	sessionKey: NonEmptyString,
	updatedAtMs: Type.Integer({ minimum: 0 }),
	approvals: Type.Array(PendingApprovalSnapshotSchema),
	truncated: Type.Boolean()
}));
//#endregion
//#region packages/gateway-protocol/src/approval-result-validators.ts
const validateApprovalGetResult = /* @__PURE__ */ lazyCompile(ApprovalGetResultSchema);
const validateApprovalHistoryResult = /* @__PURE__ */ lazyCompile(ApprovalHistoryResultSchema);
const validateApprovalResolveResult = /* @__PURE__ */ lazyCompile(ApprovalResolveResultSchema);
const validateApprovalPresentation = /* @__PURE__ */ lazyCompile(ApprovalPresentationSchema);
//#endregion
export { UsersGitHubDisconnectParamsSchema as $, PersonalGitHubAccountSchema as A, UsersSetRoleParamsSchema as At, UsersAuthConnectCatalogParamsSchema as B, WizardNextResultSchema as Bt, ExpiredApprovalSnapshotSchema as C, UsersSelectModelAccountResultSchema as Ct, SessionApprovalEventSchema as D, UsersSetAvatarResultSchema as Dt, PluginApprovalSeveritySchema as E, UsersSetAvatarParamsSchema as Et, UserModelAccountSchema as F, UsersUnlinkChannelIdentityResultSchema as Ft, UsersAuthConnectStatusParamsSchema as G, WizardStepSchema as Gt, UsersAuthConnectResultSchema as H, WizardStartResultSchema as Ht, UserProfileAuthLinkSchema as I, McpAuthLoginParamsSchema as It, UsersGitHubAuthorizeCancelResultSchema as J, ChatAccountSelectionSchema as Jt, UsersAuthConnectStatusResultSchema as K, SetupInferenceActivationRejectionSchema as Kt, UserProfileSchema as L, WizardAnswerSchema as Lt, PersonalGitHubStatusSchema as M, UsersUnlinkAuthProfileParamsSchema as Mt, UserChannelIdentityLinkSchema as N, UsersUnlinkAuthProfileResultSchema as Nt, SessionApprovalReplaySchema as O, UsersSetDisplayNameParamsSchema as Ot, UserChannelIdentitySchema as P, UsersUnlinkChannelIdentityParamsSchema as Pt, UsersGitHubAuthorizeStartResultSchema as Q, UsersAuthConnectAnswerParamsSchema as R, WizardCancelParamsSchema as Rt, ExecApprovalPresentationSchema as S, UsersSelectModelAccountParamsSchema as St, PluginApprovalPresentationSchema as T, UsersSelfResultSchema as Tt, UsersAuthConnectStartParamsSchema as U, WizardStatusParamsSchema as Ut, UsersAuthConnectCatalogResultSchema as V, WizardStartParamsSchema as Vt, UsersAuthConnectStartResultSchema as W, WizardStatusResultSchema as Wt, UsersGitHubAuthorizePollResultSchema as X, UsersGitHubAuthorizePollParamsSchema as Y, ModelAuthProfileIdSchema as Yt, UsersGitHubAuthorizeStartParamsSchema as Z, ApprovalScopeSchema as _, UsersPrefsChangedEventSchema as _t, AllowedApprovalSnapshotSchema as a, UsersLinkChannelIdentityParamsSchema as at, CancelledApprovalSnapshotSchema as b, UsersPrefsSetParamsSchema as bt, ApprovalDecisionSchema as c, UsersLinkEmailResultSchema as ct, ApprovalHistoryParamsSchema as d, UsersListChannelIdentitiesParamsSchema as dt, UsersGitHubDisconnectResultSchema as et, ApprovalHistoryResultSchema as f, UsersListChannelIdentitiesResultSchema as ft, ApprovalResolveResultSchema as g, UsersListResultSchema as gt, ApprovalResolveParamsSchema as h, UsersListParamsSchema as ht, validateApprovalResolveResult as i, UsersLinkAuthProfileResultSchema as it, PersonalGitHubGenerationSchema as j, UsersSetRoleResultSchema as jt, TerminalApprovalSnapshotSchema as k, UsersSetDisplayNameResultSchema as kt, ApprovalGetParamsSchema as l, UsersListAuthLinksParamsSchema as lt, ApprovalPresentationSchema as m, UsersListModelAccountsResultSchema as mt, validateApprovalHistoryResult as n, UsersGitHubStatusResultSchema as nt, ApprovalAllowDecisionSchema as o, UsersLinkChannelIdentityResultSchema as ot, ApprovalKindSchema as p, UsersListModelAccountsParamsSchema as pt, UsersGitHubAuthorizeCancelParamsSchema as q, SetupInferenceFailureStatusSchema as qt, validateApprovalPresentation as r, UsersLinkAuthProfileParamsSchema as rt, ApprovalChannelReviewerSchema as s, UsersLinkEmailParamsSchema as st, validateApprovalGetResult as t, UsersGitHubStatusParamsSchema as tt, ApprovalGetResultSchema as u, UsersListAuthLinksResultSchema as ut, ApprovalSnapshotSchema as v, UsersPrefsGetParamsSchema as vt, PendingApprovalSnapshotSchema as w, UsersSelfParamsSchema as wt, DeniedApprovalSnapshotSchema as x, UsersPrefsSetResultSchema as xt, ApprovalTerminalReasonSchema as y, UsersPrefsGetResultSchema as yt, UsersAuthConnectCancelParamsSchema as z, WizardNextParamsSchema as zt };
