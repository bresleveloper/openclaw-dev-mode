import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString, l as UserProfileIdSchema } from "./primitives-CYT6MDvz.mjs";
import { ct as ToolsGitHubAuthorizeAccessDeniedResultSchema, dt as ToolsGitHubAuthorizeExpiredResultSchema, ft as ToolsGitHubAuthorizeFailedResultSchema, ht as ToolsGitHubAuthorizePendingResultSchema, m as GitHubIdentityFactsSchema, mt as ToolsGitHubAuthorizeNetworkErrorResultSchema, pt as ToolsGitHubAuthorizeIncorrectDeviceCodeResultSchema, vt as ToolsGitHubAuthorizeSlowDownResultSchema } from "./agents-models-skills-C5tzwL7k.mjs";
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
/** Cancels a wizard or closes input when its client view is discarded. */
const WizardCancelParamsSchema = closedObject({
	sessionId: NonEmptyString,
	closeInput: Type.Optional(Type.Boolean())
});
const WizardStatusParamsSchema = closedObject({ sessionId: NonEmptyString });
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
	role: Type.Optional(UserProfileRoleSchema),
	effectiveRole: Type.Optional(UserProfileRoleSchema),
	roleSource: Type.Optional(Type.Union([
		Type.Literal("assigned"),
		Type.Literal("githubLogin"),
		Type.Literal("default")
	]))
});
const UsersListParamsSchema = closedObject({ githubAccountIds: Type.Optional(Type.Array(Type.Integer({
	minimum: 1,
	maximum: Number.MAX_SAFE_INTEGER
}), {
	maxItems: 500,
	uniqueItems: true
})) });
const UsersListResultSchema = closedObject({
	profiles: Type.Array(UserProfileSchema),
	githubProfiles: Type.Optional(Type.Array(closedObject({
		accountId: Type.Integer({
			minimum: 1,
			maximum: Number.MAX_SAFE_INTEGER
		}),
		profileId: UserProfileIdSchema
	}), { maxItems: 500 }))
});
const UsersPersonalFileGetParamsSchema = closedObject({ agentId: NonEmptyString });
const UsersPersonalFileSetParamsSchema = closedObject({
	agentId: NonEmptyString,
	content: Type.String({ maxLength: 4e3 }),
	expectedHash: Type.Union([Type.String({ pattern: "^[a-f0-9]{64}$" }), Type.Null()])
});
const UsersPersonalFileGetResultSchema = closedObject({
	agentId: NonEmptyString,
	profileId: UserProfileIdSchema,
	content: Type.String(),
	hash: Type.Union([Type.String({ pattern: "^[a-f0-9]{64}$" }), Type.Null()]),
	missing: Type.Boolean()
});
const UsersPersonalFileSetResultSchema = UsersPersonalFileGetResultSchema;
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
const UsersMergeParamsSchema = closedObject({
	sourceProfileId: UserProfileIdSchema,
	targetProfileId: UserProfileIdSchema
});
const UsersMergeResultSchema = closedObject({
	profile: UserProfileSchema,
	movedAliasKinds: Type.Array(Type.Union([
		Type.Literal("email"),
		Type.Literal("provider"),
		Type.Literal("channel")
	]), {
		maxItems: 3,
		uniqueItems: true
	})
});
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
export { UsersSelectModelAccountParamsSchema as $, UsersLinkChannelIdentityParamsSchema as A, UsersListParamsSchema as B, UsersGitHubAuthorizeStartResultSchema as C, SetupInferenceActivationRejectionSchema as Ct, UsersGitHubStatusResultSchema as D, UsersGitHubStatusParamsSchema as E, ModelAuthProfileIdSchema as Et, UsersListAuthLinksResultSchema as F, UsersPersonalFileGetResultSchema as G, UsersMergeParamsSchema as H, UsersListChannelIdentitiesParamsSchema as I, UsersPrefsChangedEventSchema as J, UsersPersonalFileSetParamsSchema as K, UsersListChannelIdentitiesResultSchema as L, UsersLinkEmailParamsSchema as M, UsersLinkEmailResultSchema as N, UsersLinkAuthProfileParamsSchema as O, UsersListAuthLinksParamsSchema as P, UsersPrefsSetResultSchema as Q, UsersListModelAccountsParamsSchema as R, UsersGitHubAuthorizeStartParamsSchema as S, WizardStepSchema as St, UsersGitHubDisconnectResultSchema as T, ChatAccountSelectionSchema as Tt, UsersMergeResultSchema as U, UsersListResultSchema as V, UsersPersonalFileGetParamsSchema as W, UsersPrefsGetResultSchema as X, UsersPrefsGetParamsSchema as Y, UsersPrefsSetParamsSchema as Z, UsersAuthConnectStatusResultSchema as _, WizardNextResultSchema as _t, UserChannelIdentitySchema as a, UsersSetDisplayNameParamsSchema as at, UsersGitHubAuthorizePollParamsSchema as b, WizardStatusParamsSchema as bt, UserProfileSchema as c, UsersSetRoleResultSchema as ct, UsersAuthConnectCatalogParamsSchema as d, UsersUnlinkChannelIdentityParamsSchema as dt, UsersSelectModelAccountResultSchema as et, UsersAuthConnectCatalogResultSchema as f, UsersUnlinkChannelIdentityResultSchema as ft, UsersAuthConnectStatusParamsSchema as g, WizardNextParamsSchema as gt, UsersAuthConnectStartResultSchema as h, WizardCancelParamsSchema as ht, UserChannelIdentityLinkSchema as i, UsersSetAvatarResultSchema as it, UsersLinkChannelIdentityResultSchema as j, UsersLinkAuthProfileResultSchema as k, UsersAuthConnectAnswerParamsSchema as l, UsersUnlinkAuthProfileParamsSchema as lt, UsersAuthConnectStartParamsSchema as m, WizardAnswerSchema as mt, PersonalGitHubGenerationSchema as n, UsersSelfResultSchema as nt, UserModelAccountSchema as o, UsersSetDisplayNameResultSchema as ot, UsersAuthConnectResultSchema as p, McpAuthLoginParamsSchema as pt, UsersPersonalFileSetResultSchema as q, PersonalGitHubStatusSchema as r, UsersSetAvatarParamsSchema as rt, UserProfileAuthLinkSchema as s, UsersSetRoleParamsSchema as st, PersonalGitHubAccountSchema as t, UsersSelfParamsSchema as tt, UsersAuthConnectCancelParamsSchema as u, UsersUnlinkAuthProfileResultSchema as ut, UsersGitHubAuthorizeCancelParamsSchema as v, WizardStartParamsSchema as vt, UsersGitHubDisconnectParamsSchema as w, SetupInferenceFailureStatusSchema as wt, UsersGitHubAuthorizePollResultSchema as x, WizardStatusResultSchema as xt, UsersGitHubAuthorizeCancelResultSchema as y, WizardStartResultSchema as yt, UsersListModelAccountsResultSchema as z };
