import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-CcqJJIan.js";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/secret-ref-contract.ts
/** Canonical id for file secret providers that expose exactly one value. */
const SINGLE_VALUE_FILE_REF_ID = "value";
/** Shared alias grammar for env/file/exec secret provider names. */
const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
/** JSON-schema fragment that rejects invalid JSON-pointer escape sequences. */
const FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN = "~(?:[^01]|$)";
/** JSON-schema pattern for exec secret ref ids, excluding dot-path traversal. */
const EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN = "^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$";
//#endregion
//#region packages/gateway-protocol/src/schema/primitives.ts
/**
* Shared schema primitives reused by gateway protocol request/result schemas.
*
* Keep these schemas small and transport-oriented; feature-specific validation
* belongs in the owning schema module or runtime handler.
*/
const ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
const INPUT_PROVENANCE_KIND_VALUES = [
	"external_user",
	"inter_session",
	"internal_system"
];
const SESSION_LABEL_MAX_LENGTH = 512;
/** Non-empty string primitive for protocol fields that reject blank values. */
const NonEmptyString = Type.String({ minLength: 1 });
/** Chat-send session key string primitive with bounded length. */
const ChatSendSessionKeyString = Type.String({
	minLength: 1,
	maxLength: 512
});
/** Human-readable session label primitive with bounded display length. */
const SessionLabelString = Type.String({
	minLength: 1,
	maxLength: SESSION_LABEL_MAX_LENGTH
});
/** Provenance marker for content copied from another user/session/system source. */
const InputProvenanceSchema = Type.Object({
	kind: Type.String({ enum: [...INPUT_PROVENANCE_KIND_VALUES] }),
	originSessionId: Type.Optional(Type.String()),
	sourceSessionKey: Type.Optional(Type.String()),
	sourceChannel: Type.Optional(Type.String()),
	sourceTool: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Closed gateway client id schema aligned with `GATEWAY_CLIENT_IDS`. */
const GatewayClientIdSchema = Type.Enum(GATEWAY_CLIENT_IDS);
/** Closed gateway client mode schema aligned with `GATEWAY_CLIENT_MODES`. */
const GatewayClientModeSchema = Type.Enum(GATEWAY_CLIENT_MODES);
Type.Union([
	Type.Literal("env"),
	Type.Literal("file"),
	Type.Literal("exec")
]);
const SecretProviderAliasString = Type.String({ pattern: SECRET_PROVIDER_ALIAS_PATTERN.source });
const EnvSecretRefSchema = Type.Object({
	source: Type.Literal("env"),
	provider: SecretProviderAliasString,
	id: Type.String({ pattern: ENV_SECRET_REF_ID_RE.source })
}, { additionalProperties: false });
const FileSecretRefIdSchema = Type.Unsafe({
	type: "string",
	anyOf: [{ const: SINGLE_VALUE_FILE_REF_ID }, { allOf: [{ pattern: "^/" }, { not: { pattern: FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN } }] }]
});
const FileSecretRefSchema = Type.Object({
	source: Type.Literal("file"),
	provider: SecretProviderAliasString,
	id: FileSecretRefIdSchema
}, { additionalProperties: false });
const ExecSecretRefSchema = Type.Object({
	source: Type.Literal("exec"),
	provider: SecretProviderAliasString,
	id: Type.String({ pattern: EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN })
}, { additionalProperties: false });
/** Structured secret reference accepted by config and channel protocol payloads. */
const SecretRefSchema = Type.Union([
	EnvSecretRefSchema,
	FileSecretRefSchema,
	ExecSecretRefSchema
]);
/** Secret input value: either an inline string or a structured SecretRef. */
const SecretInputSchema = Type.Union([Type.String(), SecretRefSchema]);
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
/** Generated media/file attachment metadata carried by internal agent events. */
const AgentGeneratedAttachmentSchema = Type.Object({
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
	name: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Internal completion event surfaced when child automation reports back to a parent run. */
const AgentInternalEventSchema = Type.Object({
	type: Type.Literal(AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION),
	source: Type.String({ enum: [...AGENT_INTERNAL_EVENT_SOURCES] }),
	childSessionKey: Type.String(),
	childSessionId: Type.Optional(Type.String()),
	announceType: Type.String(),
	taskLabel: Type.String(),
	status: Type.String({ enum: [...AGENT_INTERNAL_EVENT_STATUSES] }),
	statusLabel: Type.String(),
	result: Type.String(),
	attachments: Type.Optional(Type.Array(AgentGeneratedAttachmentSchema)),
	mediaUrls: Type.Optional(Type.Array(Type.String())),
	statsLine: Type.Optional(Type.String()),
	replyInstruction: Type.String()
}, { additionalProperties: false });
/** Stream event emitted by the agent runtime over the gateway protocol. */
const AgentEventSchema = Type.Object({
	runId: NonEmptyString,
	seq: Type.Integer({ minimum: 0 }),
	stream: NonEmptyString,
	ts: Type.Integer({ minimum: 0 }),
	spawnedBy: Type.Optional(NonEmptyString),
	isHeartbeat: Type.Optional(Type.Boolean()),
	data: Type.Record(Type.String(), Type.Unknown())
}, { additionalProperties: false });
/** Channel context injected into message actions so tools can reply in-place. */
const MessageActionToolContextSchema = Type.Object({
	currentChannelId: Type.Optional(Type.String()),
	currentMessagingTarget: Type.Optional(Type.String()),
	currentGraphChannelId: Type.Optional(Type.String()),
	currentChannelProvider: Type.Optional(Type.String()),
	currentThreadTs: Type.Optional(Type.String()),
	currentMessageId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
	replyToMode: Type.Optional(Type.Union([
		Type.Literal("off"),
		Type.Literal("first"),
		Type.Literal("all"),
		Type.Literal("batched")
	])),
	hasRepliedRef: Type.Optional(Type.Object({ value: Type.Boolean() }, { additionalProperties: false })),
	sameChannelThreadRequired: Type.Optional(Type.Boolean()),
	skipCrossContextDecoration: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Request to execute a channel message action through a configured adapter. */
const MessageActionParamsSchema = Type.Object({
	channel: NonEmptyString,
	action: NonEmptyString,
	params: Type.Record(Type.String(), Type.Unknown()),
	accountId: Type.Optional(Type.String()),
	requesterAccountId: Type.Optional(Type.String()),
	requesterSenderId: Type.Optional(Type.String()),
	senderIsOwner: Type.Optional(Type.Boolean()),
	sessionKey: Type.Optional(Type.String()),
	sessionId: Type.Optional(Type.String()),
	inboundTurnKind: Type.Optional(Type.String({ enum: ["user_request", "room_event"] })),
	agentId: Type.Optional(Type.String()),
	toolContext: Type.Optional(MessageActionToolContextSchema),
	idempotencyKey: NonEmptyString
}, { additionalProperties: false });
/** Outbound send request shared by channel adapters. */
const SendParamsSchema = Type.Object({
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
}, { additionalProperties: false });
/** Poll creation request for adapters that support native polls. */
const PollParamsSchema = Type.Object({
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
}, { additionalProperties: false });
/** Main agent-run request accepted by the gateway. */
const AgentParamsSchema = Type.Object({
	message: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	provider: Type.Optional(Type.String()),
	model: Type.Optional(Type.String()),
	to: Type.Optional(Type.String()),
	replyTo: Type.Optional(Type.String()),
	sessionId: Type.Optional(Type.String()),
	sessionKey: Type.Optional(Type.String()),
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
	execApprovalFollowupExpectedSessionId: Type.Optional(NonEmptyString),
	internalEvents: Type.Optional(Type.Array(AgentInternalEventSchema)),
	inputProvenance: Type.Optional(InputProvenanceSchema),
	suppressPromptPersistence: Type.Optional(Type.Boolean()),
	sessionEffects: Type.Optional(Type.Union([Type.Literal("visible"), Type.Literal("internal")])),
	sourceReplyDeliveryMode: Type.Optional(Type.Union([Type.Literal("automatic"), Type.Literal("message_tool_only")])),
	disableMessageTool: Type.Optional(Type.Boolean()),
	voiceWakeTrigger: Type.Optional(Type.String()),
	idempotencyKey: NonEmptyString,
	label: Type.Optional(SessionLabelString)
}, { additionalProperties: false });
/** Identity lookup request for the current or selected agent/session. */
const AgentIdentityParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Public display identity returned for an agent. */
const AgentIdentityResultSchema = Type.Object({
	agentId: NonEmptyString,
	name: Type.Optional(NonEmptyString),
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
}, { additionalProperties: false });
/** Waits for a submitted agent run to complete or time out. */
const AgentWaitParamsSchema = Type.Object({
	runId: NonEmptyString,
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 }))
}, { additionalProperties: false });
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
//#region packages/gateway-protocol/src/schema/agents-models-skills.ts
/**
* Agent, model, skill, and tool catalog schemas.
*
* These contracts back dashboard selectors, agent management, model catalogs,
* skill upload/install flows, skill workshop proposals, and effective tool
* discovery. Keep public request/result schemas documented because they are
* shared by gateway RPC, CLI, and UI clients.
*/
/** Model option shown in selectors and model catalog results. */
const ModelChoiceSchema = Type.Object({
	id: NonEmptyString,
	name: NonEmptyString,
	provider: NonEmptyString,
	alias: Type.Optional(NonEmptyString),
	available: Type.Optional(Type.Boolean()),
	contextWindow: Type.Optional(Type.Integer({ minimum: 1 })),
	reasoning: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Condensed agent record returned by list APIs. */
const AgentSummarySchema = Type.Object({
	id: NonEmptyString,
	name: Type.Optional(NonEmptyString),
	identity: Type.Optional(Type.Object({
		name: Type.Optional(NonEmptyString),
		theme: Type.Optional(NonEmptyString),
		emoji: Type.Optional(NonEmptyString),
		avatar: Type.Optional(NonEmptyString),
		avatarUrl: Type.Optional(NonEmptyString)
	}, { additionalProperties: false })),
	workspace: Type.Optional(NonEmptyString),
	model: Type.Optional(Type.Object({
		primary: Type.Optional(NonEmptyString),
		fallbacks: Type.Optional(Type.Array(NonEmptyString))
	}, { additionalProperties: false })),
	agentRuntime: Type.Optional(Type.Object({
		id: NonEmptyString,
		fallback: Type.Optional(Type.Union([Type.Literal("openclaw"), Type.Literal("none")])),
		source: Type.Union([
			Type.Literal("env"),
			Type.Literal("agent"),
			Type.Literal("defaults"),
			Type.Literal("model"),
			Type.Literal("provider"),
			Type.Literal("implicit")
		])
	}, { additionalProperties: false })),
	thinkingLevels: Type.Optional(Type.Array(Type.Object({
		id: NonEmptyString,
		label: NonEmptyString
	}, { additionalProperties: false }))),
	thinkingOptions: Type.Optional(Type.Array(NonEmptyString)),
	thinkingDefault: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Empty request payload for listing configured agents. */
const AgentsListParamsSchema = Type.Object({}, { additionalProperties: false });
/** Agent list result including the default agent and session scoping mode. */
const AgentsListResultSchema = Type.Object({
	defaultId: NonEmptyString,
	mainKey: NonEmptyString,
	scope: Type.Union([Type.Literal("per-sender"), Type.Literal("global")]),
	agents: Type.Array(AgentSummarySchema)
}, { additionalProperties: false });
/** Creates a configured agent with workspace, identity, and optional model. */
const AgentsCreateParamsSchema = Type.Object({
	name: NonEmptyString,
	workspace: NonEmptyString,
	model: Type.Optional(NonEmptyString),
	emoji: Type.Optional(Type.String()),
	avatar: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Result returned after creating an agent. */
const AgentsCreateResultSchema = Type.Object({
	ok: Type.Literal(true),
	agentId: NonEmptyString,
	name: NonEmptyString,
	workspace: NonEmptyString,
	model: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Updates mutable agent identity, workspace, and model fields. */
const AgentsUpdateParamsSchema = Type.Object({
	agentId: NonEmptyString,
	name: Type.Optional(NonEmptyString),
	workspace: Type.Optional(NonEmptyString),
	model: Type.Optional(NonEmptyString),
	emoji: Type.Optional(Type.String()),
	avatar: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Result returned after updating an agent. */
const AgentsUpdateResultSchema = Type.Object({
	ok: Type.Literal(true),
	agentId: NonEmptyString
}, { additionalProperties: false });
/** Deletes an agent and optionally its workspace/config files. */
const AgentsDeleteParamsSchema = Type.Object({
	agentId: NonEmptyString,
	deleteFiles: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Result returned after deleting an agent and unbinding sessions. */
const AgentsDeleteResultSchema = Type.Object({
	ok: Type.Literal(true),
	agentId: NonEmptyString,
	removedBindings: Type.Integer({ minimum: 0 })
}, { additionalProperties: false });
/** File metadata and optional content for agent-local editable files. */
const AgentsFileEntrySchema = Type.Object({
	name: NonEmptyString,
	path: NonEmptyString,
	missing: Type.Boolean(),
	size: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	content: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Lists editable files for one agent. */
const AgentsFilesListParamsSchema = Type.Object({ agentId: NonEmptyString }, { additionalProperties: false });
/** Editable file list for an agent workspace. */
const AgentsFilesListResultSchema = Type.Object({
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	files: Type.Array(AgentsFileEntrySchema)
}, { additionalProperties: false });
/** Reads one editable agent file by name. */
const AgentsFilesGetParamsSchema = Type.Object({
	agentId: NonEmptyString,
	name: NonEmptyString
}, { additionalProperties: false });
/** Result for reading one editable agent file. */
const AgentsFilesGetResultSchema = Type.Object({
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	file: AgentsFileEntrySchema
}, { additionalProperties: false });
/** Writes one editable agent file. */
const AgentsFilesSetParamsSchema = Type.Object({
	agentId: NonEmptyString,
	name: NonEmptyString,
	content: Type.String()
}, { additionalProperties: false });
/** Result returned after writing an editable agent file. */
const AgentsFilesSetResultSchema = Type.Object({
	ok: Type.Literal(true),
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	file: AgentsFileEntrySchema
}, { additionalProperties: false });
/** Model catalog request with optional visibility scope. */
const ModelsListParamsSchema = Type.Object({ view: Type.Optional(Type.Union([
	Type.Literal("default"),
	Type.Literal("configured"),
	Type.Literal("all")
])) }, { additionalProperties: false });
/** Model catalog result. */
const ModelsListResultSchema = Type.Object({ models: Type.Array(ModelChoiceSchema) }, { additionalProperties: false });
/** Reads installed skill status, optionally for a selected agent. */
const SkillsStatusParamsSchema = Type.Object({ agentId: Type.Optional(NonEmptyString) }, { additionalProperties: false });
/** Empty request payload for listing available skill bins. */
const SkillsBinsParamsSchema = Type.Object({}, { additionalProperties: false });
/** Skill bin names available to the gateway. */
const SkillsBinsResultSchema = Type.Object({ bins: Type.Array(NonEmptyString) }, { additionalProperties: false });
const Sha256String = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-fA-F0-9]{64}$"
});
const SkillUploadIdempotencyKeyString = Type.String({
	minLength: 1,
	maxLength: 2048
});
const SkillUploadDataBase64String = Type.String({
	minLength: 1,
	maxLength: 5592408
});
/** Starts a chunked skill archive upload. */
const SkillsUploadBeginParamsSchema = Type.Object({
	kind: Type.Literal("skill-archive"),
	slug: NonEmptyString,
	sizeBytes: Type.Integer({ minimum: 1 }),
	sha256: Type.Optional(Sha256String),
	force: Type.Optional(Type.Boolean()),
	idempotencyKey: Type.Optional(SkillUploadIdempotencyKeyString)
}, { additionalProperties: false });
/** Uploads one base64-encoded chunk for a skill archive. */
const SkillsUploadChunkParamsSchema = Type.Object({
	uploadId: NonEmptyString,
	offset: Type.Integer({ minimum: 0 }),
	dataBase64: SkillUploadDataBase64String
}, { additionalProperties: false });
/** Commits a completed skill archive upload. */
const SkillsUploadCommitParamsSchema = Type.Object({
	uploadId: NonEmptyString,
	sha256: Type.Optional(Sha256String)
}, { additionalProperties: false });
/** Installs a skill from legacy install id, ClawHub, or uploaded archive. */
const SkillsInstallParamsSchema = Type.Union([
	Type.Object({
		agentId: Type.Optional(NonEmptyString),
		name: NonEmptyString,
		installId: NonEmptyString,
		dangerouslyForceUnsafeInstall: Type.Optional(Type.Boolean({
			deprecated: true,
			description: "Deprecated compatibility field. Current servers ignore it; install policy is controlled by security.installPolicy."
		})),
		timeoutMs: Type.Optional(Type.Integer({ minimum: 1e3 }))
	}, { additionalProperties: false }),
	Type.Object({
		agentId: Type.Optional(NonEmptyString),
		source: Type.Literal("clawhub"),
		slug: NonEmptyString,
		version: Type.Optional(NonEmptyString),
		force: Type.Optional(Type.Boolean()),
		timeoutMs: Type.Optional(Type.Integer({ minimum: 1e3 }))
	}, { additionalProperties: false }),
	Type.Object({
		agentId: Type.Optional(NonEmptyString),
		source: Type.Literal("upload"),
		uploadId: NonEmptyString,
		slug: NonEmptyString,
		force: Type.Optional(Type.Boolean()),
		sha256: Type.Optional(Sha256String),
		timeoutMs: Type.Optional(Type.Integer({ minimum: 1e3 }))
	}, { additionalProperties: false })
]);
/** Updates installed skill settings or refreshes ClawHub-installed skills. */
const SkillsUpdateParamsSchema = Type.Union([Type.Object({
	skillKey: NonEmptyString,
	enabled: Type.Optional(Type.Boolean()),
	apiKey: Type.Optional(Type.String()),
	env: Type.Optional(Type.Record(NonEmptyString, Type.String()))
}, { additionalProperties: false }), Type.Object({
	agentId: Type.Optional(NonEmptyString),
	source: Type.Literal("clawhub"),
	slug: Type.Optional(NonEmptyString),
	all: Type.Optional(Type.Boolean())
}, { additionalProperties: false })]);
/** Searches the skill registry. */
const SkillsSearchParamsSchema = Type.Object({
	query: Type.Optional(NonEmptyString),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	}))
}, { additionalProperties: false });
/** Ranked skill registry search results. */
const SkillsSearchResultSchema = Type.Object({ results: Type.Array(Type.Object({
	score: Type.Number(),
	slug: NonEmptyString,
	displayName: NonEmptyString,
	summary: Type.Optional(Type.String()),
	version: Type.Optional(NonEmptyString),
	updatedAt: Type.Optional(Type.Integer())
}, { additionalProperties: false })) }, { additionalProperties: false });
/** Reads registry detail for one skill slug. */
const SkillsDetailParamsSchema = Type.Object({ slug: NonEmptyString }, { additionalProperties: false });
/** Reads current security verdicts for configured skills. */
const SkillsSecurityVerdictsParamsSchema = Type.Object({ agentId: Type.Optional(NonEmptyString) }, { additionalProperties: false });
/** Skill registry detail, latest version, metadata, and owner info. */
const SkillsDetailResultSchema = Type.Object({
	skill: Type.Union([Type.Object({
		slug: NonEmptyString,
		displayName: NonEmptyString,
		summary: Type.Optional(Type.String()),
		tags: Type.Optional(Type.Record(NonEmptyString, Type.String())),
		createdAt: Type.Integer(),
		updatedAt: Type.Integer()
	}, { additionalProperties: false }), Type.Null()]),
	latestVersion: Type.Optional(Type.Union([Type.Object({
		version: NonEmptyString,
		createdAt: Type.Integer(),
		changelog: Type.Optional(Type.String())
	}, { additionalProperties: false }), Type.Null()])),
	metadata: Type.Optional(Type.Union([Type.Object({
		os: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
		systems: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()]))
	}, { additionalProperties: false }), Type.Null()])),
	owner: Type.Optional(Type.Union([Type.Object({
		handle: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
		displayName: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
		image: Type.Optional(Type.Union([Type.String(), Type.Null()]))
	}, { additionalProperties: false }), Type.Null()]))
}, { additionalProperties: false });
/** Security verdict report for installed/requested skills. */
const SkillsSecurityVerdictsResultSchema = Type.Object({
	schema: Type.Literal("openclaw.skills.security-verdicts.v1"),
	items: Type.Array(Type.Object({
		registry: NonEmptyString,
		ok: Type.Boolean(),
		decision: NonEmptyString,
		reasons: Type.Array(Type.String()),
		requestedSlug: NonEmptyString,
		requestedVersion: NonEmptyString,
		slug: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
		version: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
		displayName: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		publisherHandle: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		publisherDisplayName: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		createdAt: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
		checkedAt: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
		skillUrl: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		securityAuditUrl: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		securityStatus: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		securityPassed: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
		error: Type.Optional(Type.Object({
			code: Type.Optional(Type.String()),
			message: Type.Optional(Type.String())
		}, { additionalProperties: false }))
	}, { additionalProperties: false }))
}, { additionalProperties: false });
/** Reads the rendered skill card for one installed skill. */
const SkillsSkillCardParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	skillKey: NonEmptyString
}, { additionalProperties: false });
/** Rendered skill card content and file metadata. */
const SkillsSkillCardResultSchema = Type.Object({
	schema: Type.Literal("openclaw.skills.skill-card.v1"),
	skillKey: NonEmptyString,
	path: NonEmptyString,
	sizeBytes: Type.Integer({ minimum: 0 }),
	content: Type.String()
}, { additionalProperties: false });
const SkillProposalStatusSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("applied"),
	Type.Literal("rejected"),
	Type.Literal("quarantined"),
	Type.Literal("stale")
]);
/** Skill proposal operation type: new skill or update to an existing skill. */
const SkillProposalKindSchema = Type.Union([Type.Literal("create"), Type.Literal("update")]);
/** Scan state for proposed skill content before it can be applied. */
const SkillProposalScanStateSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("clean"),
	Type.Literal("failed"),
	Type.Literal("quarantined")
]);
/** Source that created the skill proposal record. */
const SkillProposalSourceSchema = Type.Union([
	Type.Literal("skill-workshop"),
	Type.Literal("cli"),
	Type.Literal("gateway")
]);
const SkillProposalContentString = Type.String({
	minLength: 1,
	maxLength: 1048576
});
/** Support file payload accepted from proposal create/revise requests. */
const SkillProposalSupportFileInputSchema = Type.Object({
	path: NonEmptyString,
	content: Type.String({ maxLength: 262144 })
}, { additionalProperties: false });
/** Stored support file metadata, including target conflict hashes for updates. */
const SkillProposalSupportFileSchema = Type.Object({
	path: NonEmptyString,
	sizeBytes: Type.Integer({
		minimum: 0,
		maximum: 262144
	}),
	hash: Sha256String,
	targetExisted: Type.Optional(Type.Boolean()),
	targetContentHash: Type.Optional(Sha256String)
}, { additionalProperties: false });
/** One static-scan finding against proposed skill content. */
const SkillProposalFindingSchema = Type.Object({
	ruleId: NonEmptyString,
	severity: Type.Union([
		Type.Literal("info"),
		Type.Literal("warn"),
		Type.Literal("critical")
	]),
	file: NonEmptyString,
	line: Type.Integer({ minimum: 1 }),
	message: NonEmptyString,
	evidence: Type.String()
}, { additionalProperties: false });
/** Aggregated scan report attached to a proposal record. */
const SkillProposalScanSchema = Type.Object({
	state: SkillProposalScanStateSchema,
	scannedAt: NonEmptyString,
	critical: Type.Integer({ minimum: 0 }),
	warn: Type.Integer({ minimum: 0 }),
	info: Type.Integer({ minimum: 0 }),
	findings: Type.Array(SkillProposalFindingSchema)
}, { additionalProperties: false });
/** Skill file target that a proposal creates or updates. */
const SkillProposalTargetSchema = Type.Object({
	skillName: NonEmptyString,
	skillKey: NonEmptyString,
	skillDir: NonEmptyString,
	skillFile: NonEmptyString,
	source: Type.Optional(NonEmptyString),
	currentContentHash: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Optional runtime origin tying a proposal back to an agent turn. */
const SkillProposalOriginSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	messageId: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Full persisted skill proposal record. */
const SkillProposalRecordSchema = Type.Object({
	schema: Type.Literal("openclaw.skill-workshop.proposal.v1"),
	id: NonEmptyString,
	kind: SkillProposalKindSchema,
	status: SkillProposalStatusSchema,
	title: NonEmptyString,
	description: NonEmptyString,
	createdAt: NonEmptyString,
	updatedAt: NonEmptyString,
	createdBy: SkillProposalSourceSchema,
	origin: Type.Optional(SkillProposalOriginSchema),
	proposedVersion: NonEmptyString,
	draftFile: Type.Literal("PROPOSAL.md"),
	draftHash: NonEmptyString,
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileSchema, { maxItems: 64 })),
	target: SkillProposalTargetSchema,
	scan: SkillProposalScanSchema,
	goal: Type.Optional(Type.String()),
	evidence: Type.Optional(Type.String()),
	appliedAt: Type.Optional(NonEmptyString),
	rejectedAt: Type.Optional(NonEmptyString),
	quarantinedAt: Type.Optional(NonEmptyString),
	staleAt: Type.Optional(NonEmptyString),
	statusReason: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Condensed proposal manifest entry for list views. */
const SkillProposalManifestEntrySchema = Type.Object({
	id: NonEmptyString,
	kind: SkillProposalKindSchema,
	status: SkillProposalStatusSchema,
	title: NonEmptyString,
	description: NonEmptyString,
	skillName: NonEmptyString,
	skillKey: NonEmptyString,
	createdAt: NonEmptyString,
	updatedAt: NonEmptyString,
	scanState: SkillProposalScanStateSchema
}, { additionalProperties: false });
/** Lists skill-workshop proposals for the selected agent scope. */
const SkillsProposalsListParamsSchema = Type.Object({ agentId: Type.Optional(NonEmptyString) }, { additionalProperties: false });
/** Proposal manifest response for dashboard/workshop list views. */
const SkillsProposalsListResultSchema = Type.Object({
	schema: Type.Literal("openclaw.skill-workshop.proposals-manifest.v1"),
	updatedAt: NonEmptyString,
	proposals: Type.Array(SkillProposalManifestEntrySchema)
}, { additionalProperties: false });
/** Reads a proposal record plus editable draft/support content. */
const SkillsProposalInspectParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString
}, { additionalProperties: false });
/** Full proposal inspection result used before apply/revise decisions. */
const SkillsProposalInspectResultSchema = Type.Object({
	record: SkillProposalRecordSchema,
	content: Type.String(),
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 }))
}, { additionalProperties: false });
/** Creates a proposal for a new skill. */
const SkillsProposalCreateParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	description: NonEmptyString,
	content: SkillProposalContentString,
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
	goal: Type.Optional(Type.String()),
	evidence: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Creates a proposal to update an existing skill. */
const SkillsProposalUpdateParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	skillName: NonEmptyString,
	description: Type.Optional(NonEmptyString),
	content: SkillProposalContentString,
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
	goal: Type.Optional(Type.String()),
	evidence: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Replaces draft content/support files for an existing proposal. */
const SkillsProposalReviseParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString,
	content: SkillProposalContentString,
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
	description: Type.Optional(NonEmptyString),
	goal: Type.Optional(Type.String()),
	evidence: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Starts an agent turn that revises a pending proposal from natural-language instructions. */
const SkillsProposalRequestRevisionParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	targetAgentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString,
	instructions: Type.String({
		minLength: 1,
		maxLength: 32768
	}),
	sessionKey: NonEmptyString,
	sessionId: Type.Optional(NonEmptyString),
	idempotencyKey: NonEmptyString
}, { additionalProperties: false });
/** Chat-run acknowledgement returned after queueing a Skill Workshop revision request. */
const SkillsProposalRequestRevisionResultSchema = Type.Object({
	runId: NonEmptyString,
	status: Type.Union([
		Type.Literal("started"),
		Type.Literal("in_flight"),
		Type.Literal("ok"),
		Type.Literal("timeout"),
		Type.Literal("error")
	])
}, { additionalProperties: true });
/** Shared approve/reject/quarantine action payload for one proposal. */
const SkillsProposalActionParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString,
	reason: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Result returned after applying a skill proposal to disk. */
const SkillsProposalApplyResultSchema = Type.Object({
	record: SkillProposalRecordSchema,
	targetSkillFile: NonEmptyString
}, { additionalProperties: false });
/** Proposal record result returned after non-apply proposal actions. */
const SkillsProposalRecordResultSchema = SkillProposalRecordSchema;
/** Reads the configured tool catalog for an agent. */
const ToolsCatalogParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	includePlugins: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Reads the effective tool set for one session. */
const ToolsEffectiveParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: NonEmptyString
}, { additionalProperties: false });
/** Invokes one tool through the gateway tool dispatcher. */
const ToolsInvokeParamsSchema = Type.Object({
	name: NonEmptyString,
	args: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	sessionKey: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	confirm: Type.Optional(Type.Boolean()),
	idempotencyKey: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Tool profile shown in catalog views. */
const ToolCatalogProfileSchema = Type.Object({
	id: Type.Union([
		Type.Literal("minimal"),
		Type.Literal("coding"),
		Type.Literal("messaging"),
		Type.Literal("full")
	]),
	label: NonEmptyString
}, { additionalProperties: false });
/** Tool catalog entry before session-specific filtering is applied. */
const ToolCatalogEntrySchema = Type.Object({
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
	defaultProfiles: Type.Array(Type.Union([
		Type.Literal("minimal"),
		Type.Literal("coding"),
		Type.Literal("messaging"),
		Type.Literal("full")
	]))
}, { additionalProperties: false });
/** Group of related catalog tools from core or a plugin. */
const ToolCatalogGroupSchema = Type.Object({
	id: NonEmptyString,
	label: NonEmptyString,
	source: Type.Union([Type.Literal("core"), Type.Literal("plugin")]),
	pluginId: Type.Optional(NonEmptyString),
	tools: Type.Array(ToolCatalogEntrySchema)
}, { additionalProperties: false });
/** Tool catalog result for agent configuration UI. */
const ToolsCatalogResultSchema = Type.Object({
	agentId: NonEmptyString,
	profiles: Type.Array(ToolCatalogProfileSchema),
	groups: Type.Array(ToolCatalogGroupSchema)
}, { additionalProperties: false });
/** Effective tool entry after session/profile/channel/plugin filtering. */
const ToolsEffectiveEntrySchema = Type.Object({
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
	risk: Type.Optional(Type.Union([
		Type.Literal("low"),
		Type.Literal("medium"),
		Type.Literal("high")
	])),
	tags: Type.Optional(Type.Array(NonEmptyString))
}, { additionalProperties: false });
/** Effective tool group shown to runtime/session callers. */
const ToolsEffectiveGroupSchema = Type.Object({
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
}, { additionalProperties: false });
/** Notice explaining runtime filtering such as quarantined tool schemas. */
const ToolsEffectiveNoticeSchema = Type.Object({
	id: NonEmptyString,
	severity: Type.Union([Type.Literal("info"), Type.Literal("warning")]),
	message: Type.String()
}, { additionalProperties: false });
/** Effective tool set for a session, including profile and filtering notices. */
const ToolsEffectiveResultSchema = Type.Object({
	agentId: NonEmptyString,
	profile: NonEmptyString,
	groups: Type.Array(ToolsEffectiveGroupSchema),
	notices: Type.Optional(Type.Array(ToolsEffectiveNoticeSchema))
}, { additionalProperties: false });
/** Normalized error shape for tool invocation failures. */
const ToolsInvokeErrorSchema = Type.Object({
	code: NonEmptyString,
	message: NonEmptyString,
	details: Type.Optional(Type.Unknown())
}, { additionalProperties: false });
/** Tool invocation result, including approval handoff when required. */
const ToolsInvokeResultSchema = Type.Object({
	ok: Type.Boolean(),
	toolName: NonEmptyString,
	output: Type.Optional(Type.Unknown()),
	requiresApproval: Type.Optional(Type.Boolean()),
	approvalId: Type.Optional(NonEmptyString),
	source: Type.Optional(Type.Union([
		Type.Literal("core"),
		Type.Literal("plugin"),
		Type.Literal("mcp"),
		Type.Literal("channel"),
		Type.String()
	])),
	error: Type.Optional(ToolsInvokeErrorSchema)
}, { additionalProperties: false });
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
	agentId: Type.Optional(NonEmptyString)
};
/** Shared artifact filter payload used by list-style requests. */
const ArtifactQueryParamsSchema = Type.Object(ArtifactQueryParamsProperties, { additionalProperties: false });
/** Artifact lookup payload with a required artifact id plus optional scope filters. */
const ArtifactGetParamsSchema = Type.Object({
	...ArtifactQueryParamsProperties,
	artifactId: NonEmptyString
}, { additionalProperties: false });
/** Public artifact metadata returned before or alongside download data. */
const ArtifactSummarySchema = Type.Object({
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
	download: Type.Object({ mode: Type.Union([
		Type.Literal("bytes"),
		Type.Literal("url"),
		Type.Literal("unsupported")
	]) }, { additionalProperties: false })
}, { additionalProperties: false });
/** List request payload for artifacts visible in the selected scope. */
const ArtifactsListParamsSchema = ArtifactQueryParamsSchema;
/** List response containing artifact summaries only. */
const ArtifactsListResultSchema = Type.Object({ artifacts: Type.Array(ArtifactSummarySchema) }, { additionalProperties: false });
/** Get request payload for one artifact summary. */
const ArtifactsGetParamsSchema = ArtifactGetParamsSchema;
/** Get response containing one artifact summary. */
const ArtifactsGetResultSchema = Type.Object({ artifact: ArtifactSummarySchema }, { additionalProperties: false });
/** Download request payload for one artifact. */
const ArtifactsDownloadParamsSchema = ArtifactGetParamsSchema;
/** Download response, either inline base64 bytes, URL, or metadata for unsupported modes. */
const ArtifactsDownloadResultSchema = Type.Object({
	artifact: ArtifactSummarySchema,
	encoding: Type.Optional(Type.Literal("base64")),
	data: Type.Optional(Type.String()),
	url: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
//#endregion
//#region packages/gateway-protocol/src/schema/channels.ts
/**
* Channel and Talk protocol schemas.
*
* Talk schemas are consumed by browser realtime clients, gateway relay sessions,
* and channel adapters, so the mode/transport/brain unions below are shared
* API vocabulary rather than provider-local implementation details.
*/
/** Toggles Talk mode for the gateway, with an optional rollout phase marker. */
const TalkModeParamsSchema = Type.Object({
	enabled: Type.Boolean(),
	phase: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Reads Talk configuration; secrets are included only for trusted callers. */
const TalkConfigParamsSchema = Type.Object({ includeSecrets: Type.Optional(Type.Boolean()) }, { additionalProperties: false });
/** One-shot text-to-speech request with provider-specific voice tuning knobs. */
const TalkSpeakParamsSchema = Type.Object({
	text: NonEmptyString,
	voiceId: Type.Optional(Type.String()),
	modelId: Type.Optional(Type.String()),
	outputFormat: Type.Optional(Type.String()),
	speed: Type.Optional(Type.Number()),
	rateWpm: Type.Optional(Type.Integer({ minimum: 1 })),
	stability: Type.Optional(Type.Number()),
	similarity: Type.Optional(Type.Number()),
	style: Type.Optional(Type.Number()),
	speakerBoost: Type.Optional(Type.Boolean()),
	seed: Type.Optional(Type.Integer({ minimum: 0 })),
	normalize: Type.Optional(Type.String()),
	language: Type.Optional(Type.String()),
	latencyTier: Type.Optional(Type.Integer({ minimum: 0 }))
}, { additionalProperties: false });
/** Supported Talk session shapes exposed to clients and providers. */
const TalkModeSchema = Type.Union([
	Type.Literal("realtime"),
	Type.Literal("stt-tts"),
	Type.Literal("transcription")
]);
/** Transport families; browser clients branch on this value to choose setup flow. */
const TalkTransportSchema = Type.Union([
	Type.Literal("webrtc"),
	Type.Literal("provider-websocket"),
	Type.Literal("gateway-relay"),
	Type.Literal("managed-room")
]);
/** How a Talk session delegates reasoning/tool use to the agent runtime. */
const TalkBrainSchema = Type.Union([
	Type.Literal("agent-consult"),
	Type.Literal("direct-tools"),
	Type.Literal("none")
]);
/** Agent control actions accepted from Talk clients and managed rooms. */
const TalkAgentControlModeSchema = Type.Union([
	Type.Literal("status"),
	Type.Literal("steer"),
	Type.Literal("cancel"),
	Type.Literal("followup")
]);
/** Stable event names emitted by Talk sessions across providers/transports. */
const TalkEventTypeSchema = Type.Union([
	Type.Literal("session.started"),
	Type.Literal("session.ready"),
	Type.Literal("session.closed"),
	Type.Literal("session.error"),
	Type.Literal("session.replaced"),
	Type.Literal("turn.started"),
	Type.Literal("turn.ended"),
	Type.Literal("turn.cancelled"),
	Type.Literal("capture.started"),
	Type.Literal("capture.stopped"),
	Type.Literal("capture.cancelled"),
	Type.Literal("capture.once"),
	Type.Literal("input.audio.delta"),
	Type.Literal("input.audio.committed"),
	Type.Literal("transcript.delta"),
	Type.Literal("transcript.done"),
	Type.Literal("output.text.delta"),
	Type.Literal("output.text.done"),
	Type.Literal("output.audio.started"),
	Type.Literal("output.audio.delta"),
	Type.Literal("output.audio.done"),
	Type.Literal("tool.call"),
	Type.Literal("tool.progress"),
	Type.Literal("tool.result"),
	Type.Literal("tool.error"),
	Type.Literal("usage.metrics"),
	Type.Literal("latency.metrics"),
	Type.Literal("health.changed")
]);
/** Event types that must carry a turn id for client-side stream correlation. */
const TURN_SCOPED_TALK_EVENT_TYPES = [
	"turn.started",
	"turn.ended",
	"turn.cancelled",
	"input.audio.delta",
	"input.audio.committed",
	"transcript.delta",
	"transcript.done",
	"output.text.delta",
	"output.text.done",
	"output.audio.started",
	"output.audio.delta",
	"output.audio.done",
	"tool.call",
	"tool.progress",
	"tool.result",
	"tool.error"
];
/** Capture lifecycle events must include capture id to avoid cross-turn ambiguity. */
const CAPTURE_SCOPED_TALK_EVENT_TYPES = [
	"capture.started",
	"capture.stopped",
	"capture.cancelled",
	"capture.once"
];
/** Builds JSON Schema conditional requirements while avoiding reserved word syntax. */
function requireJsonSchemaProperties(properties) {
	const conditionalRequirementKey = ["th", "en"].join("");
	return Object.fromEntries([[conditionalRequirementKey, { required: properties }]]);
}
/** Canonical Talk event envelope emitted to browser, relay, and channel consumers. */
const TalkEventSchema = Type.Object({
	id: NonEmptyString,
	type: TalkEventTypeSchema,
	sessionId: NonEmptyString,
	turnId: Type.Optional(Type.String()),
	captureId: Type.Optional(Type.String()),
	seq: Type.Integer({ minimum: 1 }),
	timestamp: NonEmptyString,
	mode: TalkModeSchema,
	transport: TalkTransportSchema,
	brain: TalkBrainSchema,
	provider: Type.Optional(Type.String()),
	final: Type.Optional(Type.Boolean()),
	callId: Type.Optional(Type.String()),
	itemId: Type.Optional(Type.String()),
	parentId: Type.Optional(Type.String()),
	payload: Type.Unknown()
}, {
	additionalProperties: false,
	allOf: [{
		if: {
			properties: { type: { enum: TURN_SCOPED_TALK_EVENT_TYPES } },
			required: ["type"]
		},
		...requireJsonSchemaProperties(["turnId"])
	}, {
		if: {
			properties: { type: { enum: CAPTURE_SCOPED_TALK_EVENT_TYPES } },
			required: ["type"]
		},
		...requireJsonSchemaProperties(["captureId"])
	}]
});
/** Creates a browser-facing Talk client session. */
const TalkClientCreateParamsSchema = Type.Object({
	sessionKey: Type.Optional(Type.String()),
	provider: Type.Optional(Type.String()),
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	vadThreshold: Type.Optional(Type.Number()),
	silenceDurationMs: Type.Optional(Type.Integer({ minimum: 1 })),
	prefixPaddingMs: Type.Optional(Type.Integer({ minimum: 0 })),
	reasoningEffort: Type.Optional(Type.String()),
	mode: Type.Optional(TalkModeSchema),
	transport: Type.Optional(TalkTransportSchema),
	brain: Type.Optional(TalkBrainSchema)
}, { additionalProperties: false });
/** Tool-call request from a browser/client session back into the agent runtime. */
const TalkClientToolCallParamsSchema = Type.Object({
	sessionKey: NonEmptyString,
	callId: NonEmptyString,
	name: NonEmptyString,
	args: Type.Optional(Type.Unknown()),
	relaySessionId: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Agent run identity returned after accepting a Talk client tool call. */
const TalkClientToolCallResultSchema = Type.Object({
	runId: NonEmptyString,
	idempotencyKey: NonEmptyString
}, { additionalProperties: false });
/** Text steering request for a Talk session bound to an agent turn. */
const TalkClientSteerParamsSchema = Type.Object({
	sessionKey: NonEmptyString,
	text: NonEmptyString,
	mode: Type.Optional(TalkAgentControlModeSchema)
}, { additionalProperties: false });
/** Result of applying agent control to an embedded or reply-backed Talk run. */
const TalkAgentControlResultSchema = Type.Object({
	ok: Type.Boolean(),
	mode: TalkAgentControlModeSchema,
	sessionKey: NonEmptyString,
	sessionId: Type.Optional(NonEmptyString),
	active: Type.Boolean(),
	queued: Type.Optional(Type.Boolean()),
	aborted: Type.Optional(Type.Boolean()),
	target: Type.Optional(Type.Union([Type.Literal("embedded_run"), Type.Literal("reply_run")])),
	reason: Type.Optional(Type.String()),
	message: Type.String(),
	speak: Type.Boolean(),
	show: Type.Boolean(),
	suppress: Type.Boolean(),
	providerResult: Type.Optional(Type.Object({
		status: Type.Literal("cancelled"),
		message: Type.String()
	}, { additionalProperties: false })),
	enqueuedAtMs: Type.Optional(Type.Number()),
	deliveredAtMs: Type.Optional(Type.Number())
}, { additionalProperties: false });
/** Joins an existing managed-room Talk session. */
const TalkSessionJoinParamsSchema = Type.Object({
	sessionId: NonEmptyString,
	token: NonEmptyString
}, { additionalProperties: false });
/** Creates a gateway-managed Talk session for realtime, transcription, or relay use. */
const TalkSessionCreateParamsSchema = Type.Object({
	sessionKey: Type.Optional(Type.String()),
	spawnedBy: Type.Optional(NonEmptyString),
	provider: Type.Optional(Type.String()),
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	vadThreshold: Type.Optional(Type.Number()),
	silenceDurationMs: Type.Optional(Type.Integer({ minimum: 1 })),
	prefixPaddingMs: Type.Optional(Type.Integer({ minimum: 0 })),
	reasoningEffort: Type.Optional(Type.String()),
	mode: Type.Optional(TalkModeSchema),
	transport: Type.Optional(TalkTransportSchema),
	brain: Type.Optional(TalkBrainSchema),
	ttlMs: Type.Optional(Type.Integer({
		minimum: 1e3,
		maximum: 36e5
	}))
}, { additionalProperties: false });
/** Appends base64 audio to an active Talk session. */
const TalkSessionAppendAudioParamsSchema = Type.Object({
	sessionId: NonEmptyString,
	audioBase64: NonEmptyString,
	timestamp: Type.Optional(Type.Number())
}, { additionalProperties: false });
/** Starts or advances a Talk turn within a session. */
const TalkSessionTurnParamsSchema = Type.Object({
	sessionId: NonEmptyString,
	turnId: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Cancels the active or named Talk turn. */
const TalkSessionCancelTurnParamsSchema = Type.Object({
	sessionId: NonEmptyString,
	turnId: Type.Optional(Type.String()),
	reason: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Cancels currently streaming Talk output without necessarily ending the turn. */
const TalkSessionCancelOutputParamsSchema = Type.Object({
	sessionId: NonEmptyString,
	turnId: Type.Optional(Type.String()),
	reason: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Submits a tool result back to a Talk provider session. */
const TalkSessionSubmitToolResultParamsSchema = Type.Object({
	sessionId: NonEmptyString,
	callId: NonEmptyString,
	result: Type.Unknown(),
	options: Type.Optional(Type.Object({
		suppressResponse: Type.Optional(Type.Boolean()),
		willContinue: Type.Optional(Type.Boolean())
	}, { additionalProperties: false }))
}, { additionalProperties: false });
/** Steers a managed Talk session by session id rather than transcript key. */
const TalkSessionSteerParamsSchema = Type.Object({
	sessionId: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	text: NonEmptyString,
	mode: Type.Optional(TalkAgentControlModeSchema)
}, { additionalProperties: false });
/** Closes a gateway-managed Talk session. */
const TalkSessionCloseParamsSchema = Type.Object({ sessionId: NonEmptyString }, { additionalProperties: false });
/** Mutable room state returned when a client joins a managed Talk room. */
const TalkSessionManagedRoomStateSchema = Type.Object({
	activeClientId: Type.Optional(Type.String()),
	activeTurnId: Type.Optional(Type.String()),
	recentTalkEvents: Type.Array(TalkEventSchema)
}, { additionalProperties: false });
/** Managed-room session record shared with browser clients. */
const TalkSessionManagedRoomRecordSchema = Type.Object({
	id: NonEmptyString,
	roomId: NonEmptyString,
	roomUrl: NonEmptyString,
	sessionKey: NonEmptyString,
	sessionId: Type.Optional(Type.String()),
	channel: Type.Optional(Type.String()),
	target: Type.Optional(Type.String()),
	provider: Type.Optional(Type.String()),
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	mode: TalkModeSchema,
	transport: TalkTransportSchema,
	brain: TalkBrainSchema,
	createdAt: Type.Number(),
	expiresAt: Type.Number(),
	room: TalkSessionManagedRoomStateSchema
}, { additionalProperties: false });
/** Empty request payload for reading configured Talk provider capabilities. */
const TalkCatalogParamsSchema = Type.Object({}, { additionalProperties: false });
/** One provider entry in the Talk capability catalog. */
const TalkCatalogProviderSchema = Type.Object({
	id: NonEmptyString,
	label: NonEmptyString,
	configured: Type.Boolean(),
	models: Type.Optional(Type.Array(Type.String())),
	voices: Type.Optional(Type.Array(Type.String())),
	defaultModel: Type.Optional(Type.String()),
	modes: Type.Optional(Type.Array(TalkModeSchema)),
	transports: Type.Optional(Type.Array(TalkTransportSchema)),
	brains: Type.Optional(Type.Array(TalkBrainSchema)),
	inputAudioFormats: Type.Optional(Type.Array(Type.Object({
		encoding: Type.Union([Type.Literal("pcm16"), Type.Literal("g711_ulaw")]),
		sampleRateHz: Type.Integer({ minimum: 1 }),
		channels: Type.Integer({ minimum: 1 })
	}, { additionalProperties: false }))),
	outputAudioFormats: Type.Optional(Type.Array(Type.Object({
		encoding: Type.Union([Type.Literal("pcm16"), Type.Literal("g711_ulaw")]),
		sampleRateHz: Type.Integer({ minimum: 1 }),
		channels: Type.Integer({ minimum: 1 })
	}, { additionalProperties: false }))),
	supportsBrowserSession: Type.Optional(Type.Boolean()),
	supportsBargeIn: Type.Optional(Type.Boolean()),
	supportsToolCalls: Type.Optional(Type.Boolean()),
	supportsVideoFrames: Type.Optional(Type.Boolean()),
	supportsSessionResumption: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Active provider plus all candidates for a Talk capability family. */
const TalkCatalogProviderGroupSchema = Type.Object({
	activeProvider: Type.Optional(Type.String()),
	providers: Type.Array(TalkCatalogProviderSchema)
}, { additionalProperties: false });
/** Provider, mode, transport, and audio-format catalog returned to clients. */
const TalkCatalogResultSchema = Type.Object({
	modes: Type.Array(TalkModeSchema),
	transports: Type.Array(TalkTransportSchema),
	brains: Type.Array(TalkBrainSchema),
	speech: TalkCatalogProviderGroupSchema,
	transcription: TalkCatalogProviderGroupSchema,
	realtime: TalkCatalogProviderGroupSchema
}, { additionalProperties: false });
/** Audio format contract for realtime browser sessions. */
const BrowserRealtimeAudioContractSchema = Type.Object({
	inputEncoding: Type.Union([Type.Literal("pcm16"), Type.Literal("g711_ulaw")]),
	inputSampleRateHz: Type.Integer({ minimum: 1 }),
	outputEncoding: Type.Union([Type.Literal("pcm16"), Type.Literal("g711_ulaw")]),
	outputSampleRateHz: Type.Integer({ minimum: 1 })
}, { additionalProperties: false });
/** Session creation result with transport-specific ids and credentials. */
const TalkSessionCreateResultSchema = Type.Object({
	sessionId: NonEmptyString,
	provider: Type.Optional(Type.String()),
	mode: TalkModeSchema,
	transport: TalkTransportSchema,
	brain: TalkBrainSchema,
	relaySessionId: Type.Optional(NonEmptyString),
	transcriptionSessionId: Type.Optional(NonEmptyString),
	handoffId: Type.Optional(NonEmptyString),
	roomId: Type.Optional(NonEmptyString),
	roomUrl: Type.Optional(NonEmptyString),
	token: Type.Optional(NonEmptyString),
	audio: Type.Optional(Type.Unknown()),
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	expiresAt: Type.Optional(Type.Number())
}, { additionalProperties: false });
/** Result for a Talk turn request, optionally including emitted events. */
const TalkSessionTurnResultSchema = Type.Object({
	ok: Type.Boolean(),
	turnId: Type.Optional(Type.String()),
	events: Type.Optional(Type.Array(TalkEventSchema))
}, { additionalProperties: false });
/** Managed-room record returned to clients after joining an existing Talk session. */
const TalkSessionJoinResultSchema = TalkSessionManagedRoomRecordSchema;
/** Generic success result for Talk session lifecycle calls. */
const TalkSessionOkResultSchema = Type.Object({ ok: Type.Boolean() }, { additionalProperties: false });
/** Browser WebRTC setup payload using provider SDP exchange. */
const BrowserRealtimeWebRtcSdpSessionSchema = Type.Object({
	provider: NonEmptyString,
	transport: Type.Literal("webrtc"),
	clientSecret: NonEmptyString,
	offerUrl: Type.Optional(Type.String()),
	offerHeaders: Type.Optional(Type.Record(Type.String(), Type.String())),
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	expiresAt: Type.Optional(Type.Number())
}, { additionalProperties: false });
/** Browser websocket setup payload with JSON/PCM audio contract. */
const BrowserRealtimeJsonPcmWebSocketSessionSchema = Type.Object({
	provider: NonEmptyString,
	transport: Type.Literal("provider-websocket"),
	protocol: NonEmptyString,
	clientSecret: NonEmptyString,
	websocketUrl: NonEmptyString,
	audio: BrowserRealtimeAudioContractSchema,
	initialMessage: Type.Optional(Type.Unknown()),
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	expiresAt: Type.Optional(Type.Number())
}, { additionalProperties: false });
/** Browser setup payload for gateway-relayed realtime audio. */
const BrowserRealtimeGatewayRelaySessionSchema = Type.Object({
	provider: NonEmptyString,
	transport: Type.Literal("gateway-relay"),
	relaySessionId: NonEmptyString,
	audio: BrowserRealtimeAudioContractSchema,
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	expiresAt: Type.Optional(Type.Number())
}, { additionalProperties: false });
/** Browser setup payload for managed-room Talk sessions. */
const BrowserRealtimeManagedRoomSessionSchema = Type.Object({
	provider: NonEmptyString,
	transport: Type.Literal("managed-room"),
	roomUrl: NonEmptyString,
	token: Type.Optional(Type.String()),
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	expiresAt: Type.Optional(Type.Number())
}, { additionalProperties: false });
/** Union of all browser Talk session setup payloads. */
const TalkClientCreateResultSchema = Type.Union([
	BrowserRealtimeWebRtcSdpSessionSchema,
	BrowserRealtimeJsonPcmWebSocketSessionSchema,
	BrowserRealtimeGatewayRelaySessionSchema,
	BrowserRealtimeManagedRoomSessionSchema
]);
/** Secret-bearing provider fields; extra provider options remain provider-owned. */
const talkProviderFieldSchemas = { apiKey: Type.Optional(SecretInputSchema) };
/** Per-provider Talk config bag. */
const TalkProviderConfigSchema = Type.Object(talkProviderFieldSchemas, { additionalProperties: true });
/** Realtime Talk defaults and provider selection stored in config. */
const TalkRealtimeConfigSchema = Type.Object({
	provider: Type.Optional(Type.String()),
	providers: Type.Optional(Type.Record(Type.String(), TalkProviderConfigSchema)),
	model: Type.Optional(Type.String()),
	speakerVoice: Type.Optional(Type.String()),
	speakerVoiceId: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	instructions: Type.Optional(Type.String()),
	mode: Type.Optional(TalkModeSchema),
	transport: Type.Optional(TalkTransportSchema),
	brain: Type.Optional(TalkBrainSchema)
}, { additionalProperties: false });
/** Resolved active Talk provider plus its normalized provider config. */
const ResolvedTalkConfigSchema = Type.Object({
	provider: Type.String(),
	config: TalkProviderConfigSchema
}, { additionalProperties: false });
/** Talk config subtree returned through gateway config APIs. */
const TalkConfigSchema = Type.Object({
	provider: Type.Optional(Type.String()),
	providers: Type.Optional(Type.Record(Type.String(), TalkProviderConfigSchema)),
	realtime: Type.Optional(TalkRealtimeConfigSchema),
	resolved: Type.Optional(ResolvedTalkConfigSchema),
	consultThinkingLevel: Type.Optional(Type.String()),
	consultFastMode: Type.Optional(Type.Boolean()),
	speechLocale: Type.Optional(Type.String()),
	interruptOnSpeech: Type.Optional(Type.Boolean()),
	silenceTimeoutMs: Type.Optional(Type.Integer({ minimum: 1 }))
}, { additionalProperties: false });
/** Full Talk config read result, including related session/UI context. */
const TalkConfigResultSchema = Type.Object({ config: Type.Object({
	talk: Type.Optional(TalkConfigSchema),
	session: Type.Optional(Type.Object({ mainKey: Type.Optional(Type.String()) }, { additionalProperties: false })),
	ui: Type.Optional(Type.Object({ seamColor: Type.Optional(Type.String()) }, { additionalProperties: false }))
}, { additionalProperties: false }) }, { additionalProperties: false });
/** Text-to-speech result with encoded audio and provider output metadata. */
const TalkSpeakResultSchema = Type.Object({
	audioBase64: NonEmptyString,
	provider: NonEmptyString,
	outputFormat: Type.Optional(Type.String()),
	voiceCompatible: Type.Optional(Type.Boolean()),
	mimeType: Type.Optional(Type.String()),
	fileExtension: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Channel status request, optionally probing one channel before returning. */
const ChannelsStatusParamsSchema = Type.Object({
	probe: Type.Optional(Type.Boolean()),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	channel: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/**
* Per-account status snapshot for channel docking.
*
* This is intentionally schema-light so new channel-specific metadata can ship
* without a gateway protocol update; known fields stay documented for UI use.
*/
const ChannelAccountSnapshotSchema = Type.Object({
	accountId: NonEmptyString,
	name: Type.Optional(Type.String()),
	enabled: Type.Optional(Type.Boolean()),
	configured: Type.Optional(Type.Boolean()),
	linked: Type.Optional(Type.Boolean()),
	running: Type.Optional(Type.Boolean()),
	connected: Type.Optional(Type.Boolean()),
	reconnectAttempts: Type.Optional(Type.Integer({ minimum: 0 })),
	lastConnectedAt: Type.Optional(Type.Integer({ minimum: 0 })),
	lastError: Type.Optional(Type.String()),
	healthState: Type.Optional(Type.String()),
	lastStartAt: Type.Optional(Type.Integer({ minimum: 0 })),
	lastStopAt: Type.Optional(Type.Integer({ minimum: 0 })),
	lastInboundAt: Type.Optional(Type.Integer({ minimum: 0 })),
	lastOutboundAt: Type.Optional(Type.Integer({ minimum: 0 })),
	lastTransportActivityAt: Type.Optional(Type.Integer({ minimum: 0 })),
	busy: Type.Optional(Type.Boolean()),
	activeRuns: Type.Optional(Type.Integer({ minimum: 0 })),
	lastRunActivityAt: Type.Optional(Type.Integer({ minimum: 0 })),
	lastProbeAt: Type.Optional(Type.Integer({ minimum: 0 })),
	mode: Type.Optional(Type.String()),
	dmPolicy: Type.Optional(Type.String()),
	allowFrom: Type.Optional(Type.Array(Type.String())),
	tokenSource: Type.Optional(Type.String()),
	botTokenSource: Type.Optional(Type.String()),
	appTokenSource: Type.Optional(Type.String()),
	baseUrl: Type.Optional(Type.String()),
	allowUnmentionedGroups: Type.Optional(Type.Boolean()),
	cliPath: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	dbPath: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	port: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	probe: Type.Optional(Type.Unknown()),
	audit: Type.Optional(Type.Unknown()),
	application: Type.Optional(Type.Unknown())
}, { additionalProperties: true });
/** UI label and icon metadata for one channel. */
const ChannelUiMetaSchema = Type.Object({
	id: NonEmptyString,
	label: NonEmptyString,
	detailLabel: NonEmptyString,
	systemImage: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Event-loop health snapshot included with channel status responses. */
const ChannelEventLoopHealthSchema = Type.Object({
	degraded: Type.Boolean(),
	reasons: Type.Array(Type.Union([
		Type.Literal("event_loop_delay"),
		Type.Literal("event_loop_utilization"),
		Type.Literal("cpu")
	])),
	intervalMs: Type.Integer({ minimum: 0 }),
	delayP99Ms: Type.Number({ minimum: 0 }),
	delayMaxMs: Type.Number({ minimum: 0 }),
	utilization: Type.Number({ minimum: 0 }),
	cpuCoreRatio: Type.Number({ minimum: 0 })
}, { additionalProperties: false });
/** Full channel status result for dashboard and operator diagnostics. */
const ChannelsStatusResultSchema = Type.Object({
	ts: Type.Integer({ minimum: 0 }),
	channelOrder: Type.Array(NonEmptyString),
	channelLabels: Type.Record(NonEmptyString, NonEmptyString),
	channelDetailLabels: Type.Optional(Type.Record(NonEmptyString, NonEmptyString)),
	channelSystemImages: Type.Optional(Type.Record(NonEmptyString, NonEmptyString)),
	channelMeta: Type.Optional(Type.Array(ChannelUiMetaSchema)),
	channels: Type.Record(NonEmptyString, Type.Unknown()),
	channelAccounts: Type.Record(NonEmptyString, Type.Array(ChannelAccountSnapshotSchema)),
	channelDefaultAccountId: Type.Record(NonEmptyString, NonEmptyString),
	eventLoop: Type.Optional(ChannelEventLoopHealthSchema),
	partial: Type.Optional(Type.Boolean()),
	warnings: Type.Optional(Type.Array(Type.String()))
}, { additionalProperties: false });
/** Logs out one channel account. */
const ChannelsLogoutParamsSchema = Type.Object({
	channel: NonEmptyString,
	accountId: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Stops one channel account runtime. */
const ChannelsStopParamsSchema = Type.Object({
	channel: NonEmptyString,
	accountId: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Starts one channel account runtime. */
const ChannelsStartParamsSchema = Type.Object({
	channel: NonEmptyString,
	accountId: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Starts browser/web login for a channel account. */
const WebLoginStartParamsSchema = Type.Object({
	force: Type.Optional(Type.Boolean()),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	verbose: Type.Optional(Type.Boolean()),
	accountId: Type.Optional(Type.String())
}, { additionalProperties: false });
const QrDataUrlSchema = Type.String({
	maxLength: 16384,
	pattern: "^data:image/png;base64,"
});
/** Waits for web login completion or the next QR code. */
const WebLoginWaitParamsSchema = Type.Object({
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	accountId: Type.Optional(Type.String()),
	currentQrDataUrl: Type.Optional(QrDataUrlSchema)
}, { additionalProperties: false });
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
	Type.Literal("tools"),
	Type.Literal("docks")
]);
/** Static argument choice shown to clients. */
const CommandArgChoiceSchema = Type.Object({
	value: Type.String({ maxLength: 200 }),
	label: Type.String({ maxLength: 200 })
}, { additionalProperties: false });
/** One typed argument advertised for a command. */
const CommandArgSchema = Type.Object({
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
}, { additionalProperties: false });
/** One command catalog entry visible to clients. */
const CommandEntrySchema = Type.Object({
	name: BoundedNonEmptyString(200),
	nativeName: Type.Optional(BoundedNonEmptyString(200)),
	textAliases: Type.Optional(Type.Array(BoundedNonEmptyString(200), { maxItems: 20 })),
	description: Type.String({ maxLength: COMMAND_DESCRIPTION_MAX_LENGTH }),
	category: Type.Optional(CommandCategorySchema),
	source: CommandSourceSchema,
	scope: CommandScopeSchema,
	acceptsArgs: Type.Boolean(),
	args: Type.Optional(Type.Array(CommandArgSchema, { maxItems: 20 }))
}, { additionalProperties: false });
/** Command catalog request filters. */
const CommandsListParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	provider: Type.Optional(NonEmptyString),
	scope: Type.Optional(CommandScopeSchema),
	includeArgs: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Bounded command catalog response. */
const CommandsListResultSchema = Type.Object({ commands: Type.Array(CommandEntrySchema, { maxItems: 500 }) }, { additionalProperties: false });
//#endregion
//#region packages/gateway-protocol/src/schema/config.ts
/**
* Gateway config and update protocol schemas.
*
* These payloads carry raw config text plus optional delivery context so the
* gateway can report edits/restarts back to the originating channel.
*/
const ConfigSchemaLookupPathString = Type.String({
	minLength: 1,
	maxLength: 1024,
	pattern: "^[A-Za-z0-9_./\\[\\]\\-*]+$"
});
const ConfigDeliveryContextSchema = Type.Object({
	channel: Type.Optional(Type.String()),
	to: Type.Optional(Type.String()),
	accountId: Type.Optional(Type.String()),
	threadId: Type.Optional(Type.Union([Type.String(), Type.Number()]))
}, { additionalProperties: false });
/** Empty request payload for reading the current raw config. */
const ConfigGetParamsSchema = Type.Object({}, { additionalProperties: false });
/** Full raw config replacement request with optional base hash guard. */
const ConfigSetParamsSchema = Type.Object({
	raw: NonEmptyString,
	baseHash: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Shared config apply/patch payload with optional restart notification context. */
const ConfigApplyLikeParamProperties = {
	raw: NonEmptyString,
	baseHash: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(Type.String()),
	deliveryContext: Type.Optional(ConfigDeliveryContextSchema),
	note: Type.Optional(Type.String()),
	restartDelayMs: Type.Optional(Type.Integer({ minimum: 0 }))
};
/** Raw config apply request that may schedule a restart. */
const ConfigApplyParamsSchema = Type.Object(ConfigApplyLikeParamProperties, { additionalProperties: false });
/** Raw config patch request that may schedule a restart. */
const ConfigPatchParamsSchema = Type.Object({
	...ConfigApplyLikeParamProperties,
	replacePaths: Type.Optional(Type.Array(NonEmptyString, { maxItems: 256 }))
}, { additionalProperties: false });
/** Empty request payload for fetching the generated config schema. */
const ConfigSchemaParamsSchema = Type.Object({}, { additionalProperties: false });
/** Schema lookup request for one config path. */
const ConfigSchemaLookupParamsSchema = Type.Object({ path: ConfigSchemaLookupPathString }, { additionalProperties: false });
/** Empty request payload for checking update/restart status. */
const UpdateStatusParamsSchema = Type.Object({}, { additionalProperties: false });
/** Request payload for running an update/restart flow with optional channel delivery context. */
const UpdateRunParamsSchema = Type.Object({
	sessionKey: Type.Optional(Type.String()),
	deliveryContext: Type.Optional(ConfigDeliveryContextSchema),
	note: Type.Optional(Type.String()),
	continuationMessage: Type.Optional(Type.String()),
	restartDelayMs: Type.Optional(Type.Integer({ minimum: 0 })),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 }))
}, { additionalProperties: false });
/** UI metadata attached to config schema paths. */
const ConfigUiHintSchema = Type.Object({
	label: Type.Optional(Type.String()),
	help: Type.Optional(Type.String()),
	tags: Type.Optional(Type.Array(Type.String())),
	group: Type.Optional(Type.String()),
	order: Type.Optional(Type.Integer()),
	advanced: Type.Optional(Type.Boolean()),
	sensitive: Type.Optional(Type.Boolean()),
	placeholder: Type.Optional(Type.String()),
	itemTemplate: Type.Optional(Type.Unknown())
}, { additionalProperties: false });
/** Full generated config schema response. */
const ConfigSchemaResponseSchema = Type.Object({
	schema: Type.Unknown(),
	uiHints: Type.Record(Type.String(), ConfigUiHintSchema),
	version: NonEmptyString,
	generatedAt: NonEmptyString
}, { additionalProperties: false });
/** Child entry returned when looking up a config schema path. */
const ConfigSchemaLookupChildSchema = Type.Object({
	key: NonEmptyString,
	path: NonEmptyString,
	type: Type.Optional(Type.Union([Type.String(), Type.Array(Type.String())])),
	required: Type.Boolean(),
	hasChildren: Type.Boolean(),
	reloadKind: Type.Optional(Type.Union([
		Type.Literal("restart"),
		Type.Literal("hot"),
		Type.Literal("none")
	])),
	hint: Type.Optional(ConfigUiHintSchema),
	hintPath: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Schema lookup response for one config path and its immediate children. */
const ConfigSchemaLookupResultSchema = Type.Object({
	path: NonEmptyString,
	schema: Type.Unknown(),
	reloadKind: Type.Optional(Type.Union([
		Type.Literal("restart"),
		Type.Literal("hot"),
		Type.Literal("none")
	])),
	hint: Type.Optional(ConfigUiHintSchema),
	hintPath: Type.Optional(Type.String()),
	children: Type.Array(ConfigSchemaLookupChildSchema)
}, { additionalProperties: false });
//#endregion
//#region packages/gateway-protocol/src/schema/cron.ts
/**
* Cron scheduler protocol schemas.
*
* These contracts describe scheduled agent turns, system events, delivery
* routing, run history, and mutable job state shared by gateway RPC clients.
*/
/** Builds create/patch payload variants while preserving per-call field optionality. */
function cronAgentTurnPayloadSchema(params) {
	return Type.Object({
		kind: Type.Literal("agentTurn"),
		message: params.message,
		model: Type.Optional(params.model),
		fallbacks: Type.Optional(params.fallbacks),
		thinking: Type.Optional(Type.String()),
		timeoutSeconds: Type.Optional(Type.Number({ minimum: 0 })),
		allowUnsafeExternalContent: Type.Optional(Type.Boolean()),
		lightContext: Type.Optional(Type.Boolean()),
		toolsAllow: Type.Optional(params.toolsAllow)
	}, { additionalProperties: false });
}
/** Builds command payload variants while preserving create/patch argv optionality. */
function cronCommandPayloadSchema(params) {
	return Type.Object({
		kind: Type.Literal("command"),
		argv: params.argv,
		cwd: Type.Optional(Type.String({ minLength: 1 })),
		env: Type.Optional(Type.Record(Type.String({ minLength: 1 }), Type.String())),
		input: Type.Optional(Type.String()),
		timeoutSeconds: Type.Optional(Type.Number({ minimum: 0 })),
		noOutputTimeoutSeconds: Type.Optional(Type.Number({ minimum: 0 })),
		outputMaxBytes: Type.Optional(Type.Integer({ minimum: 1 }))
	}, { additionalProperties: false });
}
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
	Type.Literal("cron")
]);
const CronJobsLastRunStatusFilterSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("ok"),
	Type.Literal("error"),
	Type.Literal("skipped"),
	Type.Literal("unknown")
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
const CronAnnounceChannelSchema = Type.Union([Type.Literal("last"), NonBlankString]);
const CronFailoverReasonSchema = Type.Union([
	Type.Literal("auth"),
	Type.Literal("auth_permanent"),
	Type.Literal("format"),
	Type.Literal("rate_limit"),
	Type.Literal("overloaded"),
	Type.Literal("billing"),
	Type.Literal("server_error"),
	Type.Literal("timeout"),
	Type.Literal("model_not_found"),
	Type.Literal("session_expired"),
	Type.Literal("empty_response"),
	Type.Literal("no_error_details"),
	Type.Literal("unclassified"),
	Type.Literal("unknown")
]);
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
const CronRunDiagnosticSchema = Type.Object({
	ts: Type.Integer({ minimum: 0 }),
	source: CronRunDiagnosticSourceSchema,
	severity: CronRunDiagnosticSeveritySchema,
	message: Type.String(),
	toolName: Type.Optional(Type.String()),
	exitCode: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
	truncated: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
const CronRunDiagnosticsSchema = Type.Object({
	summary: Type.Optional(Type.String()),
	entries: Type.Array(CronRunDiagnosticSchema)
}, { additionalProperties: false });
const CronCommonOptionalFields = {
	agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	sessionKey: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	description: Type.Optional(Type.String()),
	enabled: Type.Optional(Type.Boolean()),
	deleteAfterRun: Type.Optional(Type.Boolean())
};
function cronIdOrJobIdParams(extraFields) {
	return Type.Union([Type.Object({
		id: NonEmptyString,
		...extraFields
	}, { additionalProperties: false }), Type.Object({
		jobId: NonEmptyString,
		...extraFields
	}, { additionalProperties: false })]);
}
const CronRunLogJobIdSchema = Type.String({
	minLength: 1,
	pattern: "^[^/\\\\]+$"
});
/** Schedule expression for one-time, interval, or cron-expression jobs. */
const CronScheduleSchema = Type.Union([
	Type.Object({
		kind: Type.Literal("at"),
		at: NonEmptyString
	}, { additionalProperties: false }),
	Type.Object({
		kind: Type.Literal("every"),
		everyMs: Type.Integer({ minimum: 1 }),
		anchorMs: Type.Optional(Type.Integer({ minimum: 0 }))
	}, { additionalProperties: false }),
	Type.Object({
		kind: Type.Literal("cron"),
		expr: NonEmptyString,
		tz: Type.Optional(Type.String()),
		staggerMs: Type.Optional(Type.Integer({ minimum: 0 }))
	}, { additionalProperties: false })
]);
/** Full cron payload for new jobs. */
const CronPayloadSchema = Type.Union([
	Type.Object({
		kind: Type.Literal("systemEvent"),
		text: NonEmptyString
	}, { additionalProperties: false }),
	cronAgentTurnPayloadSchema({
		message: NonEmptyString,
		model: Type.String(),
		fallbacks: Type.Array(Type.String()),
		toolsAllow: Type.Array(Type.String())
	}),
	cronCommandPayloadSchema({ argv: Type.Array(NonEmptyString, { minItems: 1 }) })
]);
/** Partial cron payload for job updates. */
const CronPayloadPatchSchema = Type.Union([
	Type.Object({
		kind: Type.Literal("systemEvent"),
		text: Type.Optional(NonEmptyString)
	}, { additionalProperties: false }),
	cronAgentTurnPayloadSchema({
		message: Type.Optional(NonEmptyString),
		model: Type.Union([Type.String(), Type.Null()]),
		fallbacks: Type.Union([Type.Array(Type.String()), Type.Null()]),
		toolsAllow: Type.Union([Type.Array(Type.String()), Type.Null()])
	}),
	cronCommandPayloadSchema({ argv: Type.Optional(Type.Array(NonEmptyString, { minItems: 1 })) })
]);
/** Failure alert policy for repeated cron run failures. */
const CronFailureAlertSchema = Type.Object({
	after: Type.Optional(Type.Integer({ minimum: 1 })),
	channel: Type.Optional(CronAnnounceChannelSchema),
	to: Type.Optional(NonBlankString),
	cooldownMs: Type.Optional(Type.Integer({ minimum: 0 })),
	includeSkipped: Type.Optional(Type.Boolean()),
	mode: Type.Optional(Type.Union([Type.Literal("announce"), Type.Literal("webhook")])),
	accountId: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Delivery destination used when failure alerts need a separate target. */
const CronFailureDestinationSchema = Type.Object({
	channel: Type.Optional(CronAnnounceChannelSchema),
	to: Type.Optional(NonBlankString),
	accountId: Type.Optional(NonEmptyString),
	mode: Type.Optional(Type.Union([Type.Literal("announce"), Type.Literal("webhook")]))
}, { additionalProperties: false });
const CronFailureDestinationPatchSchema = Type.Object({
	channel: Type.Optional(Type.Union([CronAnnounceChannelSchema, Type.Null()])),
	to: Type.Optional(Type.Union([NonBlankString, Type.Null()])),
	accountId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	mode: Type.Optional(Type.Union([
		Type.Literal("announce"),
		Type.Literal("webhook"),
		Type.Null()
	]))
}, { additionalProperties: false });
const CronCompletionDestinationSchema = Type.Object({
	mode: Type.Literal("webhook"),
	to: NonBlankString
}, { additionalProperties: false });
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
const CronDeliveryNoopSchema = Type.Object({
	mode: Type.Literal("none"),
	...CronDeliverySharedProperties,
	to: Type.Optional(NonBlankString)
}, { additionalProperties: false });
const CronDeliveryAnnounceSchema = Type.Object({
	mode: Type.Literal("announce"),
	...CronDeliverySharedProperties,
	completionDestination: Type.Optional(CronCompletionDestinationSchema),
	to: Type.Optional(NonBlankString)
}, { additionalProperties: false });
const CronDeliveryWebhookSchema = Type.Object({
	mode: Type.Literal("webhook"),
	...CronDeliverySharedProperties,
	to: NonBlankString
}, { additionalProperties: false });
/** Delivery policy for cron run output. */
const CronDeliverySchema = Type.Union([
	CronDeliveryNoopSchema,
	CronDeliveryAnnounceSchema,
	CronDeliveryWebhookSchema
]);
/** Patch shape for cron delivery policy updates. */
const CronDeliveryPatchSchema = Type.Object({
	mode: Type.Optional(Type.Union([
		Type.Literal("none"),
		Type.Literal("announce"),
		Type.Literal("webhook")
	])),
	...CronDeliveryPatchSharedProperties,
	completionDestination: Type.Optional(Type.Union([CronCompletionDestinationSchema, Type.Null()])),
	to: Type.Optional(Type.Union([NonBlankString, Type.Null()]))
}, { additionalProperties: false });
const CronFailureNotificationDeliverySchema = Type.Object({
	delivered: Type.Optional(Type.Boolean()),
	status: CronDeliveryStatusSchema,
	error: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Scheduler-maintained state for the latest run/delivery outcome. */
const CronJobStateSchema = Type.Object({
	nextRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	runningAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	lastRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	lastRunStatus: Type.Optional(CronRunStatusSchema),
	lastStatus: Type.Optional(DeprecatedCronRunStatusSchema),
	lastError: Type.Optional(Type.String()),
	lastDiagnostics: Type.Optional(CronRunDiagnosticsSchema),
	lastDiagnosticSummary: Type.Optional(Type.String()),
	lastErrorReason: Type.Optional(CronFailoverReasonSchema),
	lastDurationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	consecutiveErrors: Type.Optional(Type.Integer({ minimum: 0 })),
	consecutiveSkipped: Type.Optional(Type.Integer({ minimum: 0 })),
	lastDelivered: Type.Optional(Type.Boolean()),
	lastDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastDeliveryError: Type.Optional(Type.String()),
	lastFailureNotificationDelivered: Type.Optional(Type.Boolean()),
	lastFailureNotificationDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastFailureNotificationDeliveryError: Type.Optional(Type.String()),
	lastFailureAlertAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
}, { additionalProperties: false });
const CronJobStatePatchSchema = Type.Object({
	nextRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	runningAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	lastRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	lastRunStatus: Type.Optional(CronRunStatusSchema),
	lastStatus: Type.Optional(DeprecatedCronRunStatusSchema),
	lastError: Type.Optional(Type.String()),
	lastErrorReason: Type.Optional(CronFailoverReasonSchema),
	lastDurationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	consecutiveErrors: Type.Optional(Type.Integer({ minimum: 0 })),
	consecutiveSkipped: Type.Optional(Type.Integer({ minimum: 0 })),
	lastDelivered: Type.Optional(Type.Boolean()),
	lastDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastDeliveryError: Type.Optional(Type.String()),
	lastFailureNotificationDelivered: Type.Optional(Type.Boolean()),
	lastFailureNotificationDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastFailureNotificationDeliveryError: Type.Optional(Type.String()),
	lastFailureAlertAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
}, { additionalProperties: false });
/** Persisted cron job definition returned by scheduler list/get APIs. */
const CronJobSchema = Type.Object({
	id: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	description: Type.Optional(Type.String()),
	enabled: Type.Boolean(),
	deleteAfterRun: Type.Optional(Type.Boolean()),
	createdAtMs: Type.Integer({ minimum: 0 }),
	updatedAtMs: Type.Integer({ minimum: 0 }),
	schedule: CronScheduleSchema,
	sessionTarget: CronSessionTargetSchema,
	wakeMode: CronWakeModeSchema,
	payload: CronPayloadSchema,
	delivery: Type.Optional(CronDeliverySchema),
	failureAlert: Type.Optional(Type.Union([Type.Literal(false), CronFailureAlertSchema])),
	state: CronJobStateSchema
}, { additionalProperties: false });
/** Query params for listing cron jobs with filters and pagination. */
const CronListParamsSchema = Type.Object({
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
	sortBy: Type.Optional(CronJobsSortBySchema),
	sortDir: Type.Optional(CronSortDirSchema),
	agentId: Type.Optional(NonEmptyString),
	compact: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Empty request payload for scheduler status. */
const CronStatusParamsSchema = Type.Object({}, { additionalProperties: false });
/** Looks up a job by stable id or legacy jobId alias. */
const CronGetParamsSchema = cronIdOrJobIdParams({});
/** Creates a scheduled job with schedule, target, payload, and delivery policy. */
const CronAddParamsSchema = Type.Object({
	name: NonEmptyString,
	...CronCommonOptionalFields,
	schedule: CronScheduleSchema,
	sessionTarget: CronSessionTargetSchema,
	wakeMode: CronWakeModeSchema,
	payload: CronPayloadSchema,
	delivery: Type.Optional(CronDeliverySchema),
	failureAlert: Type.Optional(Type.Union([Type.Literal(false), CronFailureAlertSchema]))
}, { additionalProperties: false });
/** Updates a cron job by id or legacy jobId alias. */
const CronUpdateParamsSchema = cronIdOrJobIdParams({ patch: Type.Object({
	name: Type.Optional(NonEmptyString),
	...CronCommonOptionalFields,
	schedule: Type.Optional(CronScheduleSchema),
	sessionTarget: Type.Optional(CronSessionTargetSchema),
	wakeMode: Type.Optional(CronWakeModeSchema),
	payload: Type.Optional(CronPayloadPatchSchema),
	delivery: Type.Optional(CronDeliveryPatchSchema),
	failureAlert: Type.Optional(Type.Union([Type.Literal(false), CronFailureAlertSchema])),
	state: Type.Optional(CronJobStatePatchSchema)
}, { additionalProperties: false }) });
/** Removes a cron job by id or legacy jobId alias. */
const CronRemoveParamsSchema = cronIdOrJobIdParams({});
/** Runs a cron job immediately or only if due. */
const CronRunParamsSchema = cronIdOrJobIdParams({ mode: Type.Optional(Type.Union([Type.Literal("due"), Type.Literal("force")])) });
/** Query params for cron run history. */
const CronRunsParamsSchema = Type.Object({
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
}, { additionalProperties: false });
/** One persisted cron run history entry. */
const CronRunLogEntrySchema = Type.Object({
	ts: Type.Integer({ minimum: 0 }),
	jobId: NonEmptyString,
	action: Type.Literal("finished"),
	status: Type.Optional(CronRunStatusSchema),
	error: Type.Optional(Type.String()),
	errorReason: Type.Optional(CronFailoverReasonSchema),
	summary: Type.Optional(Type.String()),
	diagnostics: Type.Optional(CronRunDiagnosticsSchema),
	delivered: Type.Optional(Type.Boolean()),
	deliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	deliveryError: Type.Optional(Type.String()),
	failureNotificationDelivery: Type.Optional(CronFailureNotificationDeliverySchema),
	sessionId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	runAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	nextRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	model: Type.Optional(Type.String()),
	provider: Type.Optional(Type.String()),
	usage: Type.Optional(Type.Object({
		input_tokens: Type.Optional(Type.Number()),
		output_tokens: Type.Optional(Type.Number()),
		total_tokens: Type.Optional(Type.Number()),
		cache_read_tokens: Type.Optional(Type.Number()),
		cache_write_tokens: Type.Optional(Type.Number())
	}, { additionalProperties: false })),
	jobName: Type.Optional(Type.String())
}, { additionalProperties: false });
//#endregion
//#region packages/gateway-protocol/src/schema/error-codes.ts
/** Gateway JSON-RPC style error codes shared by clients and server handlers. */
const ErrorCodes = {
	/** Client has not completed account/device linking for this gateway. */
	NOT_LINKED: "NOT_LINKED",
	/** Device exists but still needs an explicit pairing approval. */
	NOT_PAIRED: "NOT_PAIRED",
	/** Agent turn exceeded the gateway wait window. */
	AGENT_TIMEOUT: "AGENT_TIMEOUT",
	/** Request payload failed protocol validation or method preconditions. */
	INVALID_REQUEST: "INVALID_REQUEST",
	/** Approval resolution referenced a missing or expired approval request. */
	APPROVAL_NOT_FOUND: "APPROVAL_NOT_FOUND",
	/** Gateway service or required backend is temporarily unavailable. */
	UNAVAILABLE: "UNAVAILABLE"
};
/** Builds the canonical gateway error payload while preserving optional retry metadata. */
function errorShape(code, message, opts) {
	return {
		code,
		message,
		...opts
	};
}
//#endregion
//#region packages/gateway-protocol/src/schema/environments.ts
/**
* Environment inventory protocol schemas.
*
* Environments are runtime targets such as local hosts, VMs, or remote workers;
* this schema layer only describes their gateway-visible status summary.
*/
/** Runtime availability state for an environment target. */
const EnvironmentStatusSchema = Type.String({ enum: [
	"available",
	"unavailable",
	"starting",
	"stopping",
	"error"
] });
function createEnvironmentSummarySchema() {
	return Type.Object({
		id: NonEmptyString,
		type: NonEmptyString,
		label: Type.Optional(NonEmptyString),
		status: EnvironmentStatusSchema,
		capabilities: Type.Optional(Type.Array(NonEmptyString))
	}, { additionalProperties: false });
}
/** Public environment summary shown in listings and status responses. */
const EnvironmentSummarySchema = createEnvironmentSummarySchema();
/** Empty request payload for listing known environments. */
const EnvironmentsListParamsSchema = Type.Object({}, { additionalProperties: false });
/** List response containing all gateway-visible environment summaries. */
const EnvironmentsListResultSchema = Type.Object({ environments: Type.Array(EnvironmentSummarySchema) }, { additionalProperties: false });
/** Status lookup request for one environment id. */
const EnvironmentsStatusParamsSchema = Type.Object({ environmentId: NonEmptyString }, { additionalProperties: false });
/** Status lookup result for one environment id. */
const EnvironmentsStatusResultSchema = createEnvironmentSummarySchema();
//#endregion
//#region packages/gateway-protocol/src/schema/exec-approvals.ts
/**
* Exec approval protocol schemas.
*
* These payloads cross the security-review boundary for command execution, so
* persisted policy, request snapshots, and resolve decisions stay explicit.
*/
/** One persisted allowlist entry for a command pattern or resolved executable. */
const ExecApprovalsAllowlistEntrySchema = Type.Object({
	id: Type.Optional(NonEmptyString),
	pattern: Type.String(),
	source: Type.Optional(Type.Literal("allow-always")),
	commandText: Type.Optional(Type.String()),
	argPattern: Type.Optional(Type.String()),
	lastUsedAt: Type.Optional(Type.Integer({ minimum: 0 })),
	lastUsedCommand: Type.Optional(Type.String()),
	lastResolvedPath: Type.Optional(Type.String())
}, { additionalProperties: false });
const ExecApprovalsPolicyFields = {
	security: Type.Optional(Type.String()),
	ask: Type.Optional(Type.String()),
	askFallback: Type.Optional(Type.String()),
	autoAllowSkills: Type.Optional(Type.Boolean())
};
/** Default exec approval policy shared by all agents unless overridden. */
const ExecApprovalsDefaultsSchema = Type.Object(ExecApprovalsPolicyFields, { additionalProperties: false });
/** Agent-specific exec approval policy and allowlist. */
const ExecApprovalsAgentSchema = Type.Object({
	...ExecApprovalsPolicyFields,
	allowlist: Type.Optional(Type.Array(ExecApprovalsAllowlistEntrySchema))
}, { additionalProperties: false });
/** Versioned exec approvals config file edited through gateway APIs. */
const ExecApprovalsFileSchema = Type.Object({
	version: Type.Literal(1),
	socket: Type.Optional(Type.Object({
		path: Type.Optional(Type.String()),
		token: Type.Optional(Type.String())
	}, { additionalProperties: false })),
	defaults: Type.Optional(ExecApprovalsDefaultsSchema),
	agents: Type.Optional(Type.Record(Type.String(), ExecApprovalsAgentSchema))
}, { additionalProperties: false });
/** Read snapshot with path/hash metadata for optimistic writes. */
const ExecApprovalsSnapshotSchema = Type.Object({
	path: NonEmptyString,
	exists: Type.Boolean(),
	hash: NonEmptyString,
	file: ExecApprovalsFileSchema
}, { additionalProperties: false });
/** Empty request payload for reading local exec approval policy. */
const ExecApprovalsGetParamsSchema = Type.Object({}, { additionalProperties: false });
/** Local exec approval policy write request with optional base hash guard. */
const ExecApprovalsSetParamsSchema = Type.Object({
	file: ExecApprovalsFileSchema,
	baseHash: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Node-scoped request payload for reading exec approval policy. */
const ExecApprovalsNodeGetParamsSchema = Type.Object({ nodeId: NonEmptyString }, { additionalProperties: false });
/** Node-scoped exec approval policy write request with optional base hash guard. */
const ExecApprovalsNodeSetParamsSchema = Type.Object({
	nodeId: NonEmptyString,
	file: ExecApprovalsFileSchema,
	baseHash: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Lookup request for one pending exec approval by id. */
const ExecApprovalGetParamsSchema = Type.Object({ id: NonEmptyString }, { additionalProperties: false });
/** Pending command execution approval request shown to reviewers. */
const ExecApprovalRequestParamsSchema = Type.Object({
	id: Type.Optional(NonEmptyString),
	command: Type.Optional(NonEmptyString),
	commandArgv: Type.Optional(Type.Array(Type.String())),
	systemRunPlan: Type.Optional(Type.Object({
		argv: Type.Array(Type.String()),
		cwd: Type.Union([Type.String(), Type.Null()]),
		commandText: Type.String(),
		commandPreview: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		agentId: Type.Union([Type.String(), Type.Null()]),
		sessionKey: Type.Union([Type.String(), Type.Null()]),
		mutableFileOperand: Type.Optional(Type.Union([Type.Object({
			argvIndex: Type.Integer({ minimum: 0 }),
			path: Type.String(),
			sha256: Type.String()
		}, { additionalProperties: false }), Type.Null()]))
	}, { additionalProperties: false })),
	env: Type.Optional(Type.Record(NonEmptyString, Type.String())),
	cwd: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	nodeId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	host: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	security: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	ask: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	warningText: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	unavailableDecisions: Type.Optional(Type.Array(Type.String({ enum: ["allow-always"] }), {
		minItems: 1,
		maxItems: 1
	})),
	commandSpans: Type.Optional(Type.Array(Type.Object({
		startIndex: Type.Integer({
			minimum: 0,
			description: "Inclusive UTF-16 code unit offset into command."
		}),
		endIndex: Type.Integer({
			minimum: 1,
			description: "Exclusive UTF-16 code unit offset into command; must be greater than startIndex and no greater than command.length."
		})
	}, { additionalProperties: false }))),
	agentId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	resolvedPath: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	sessionKey: Type.Optional(Type.Union([Type.String(), Type.Null()])),
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
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
	twoPhase: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Reviewer decision payload for one pending exec approval. */
const ExecApprovalResolveParamsSchema = Type.Object({
	id: NonEmptyString,
	decision: NonEmptyString
}, { additionalProperties: false });
//#endregion
//#region packages/gateway-protocol/src/schema/devices.ts
/**
* Device pairing and token-management protocol schemas.
*
* These payloads cross the gateway approval boundary, so request ids and device
* ids stay explicit and feature handlers own the authorization checks.
*/
/** Lists pending and approved device pairing records. */
const DevicePairListParamsSchema = Type.Object({}, { additionalProperties: false });
/** Approves a pending pairing request by request id. */
const DevicePairApproveParamsSchema = Type.Object({ requestId: NonEmptyString }, { additionalProperties: false });
/** Rejects a pending pairing request by request id. */
const DevicePairRejectParamsSchema = Type.Object({ requestId: NonEmptyString }, { additionalProperties: false });
/** Removes an approved or remembered device by device id. */
const DevicePairRemoveParamsSchema = Type.Object({ deviceId: NonEmptyString }, { additionalProperties: false });
/** Rotates or issues a device token for a specific role/scope grant. */
const DeviceTokenRotateParamsSchema = Type.Object({
	deviceId: NonEmptyString,
	role: NonEmptyString,
	scopes: Type.Optional(Type.Array(NonEmptyString))
}, { additionalProperties: false });
/** Revokes one role-bound device token grant. */
const DeviceTokenRevokeParamsSchema = Type.Object({
	deviceId: NonEmptyString,
	role: NonEmptyString
}, { additionalProperties: false });
/** Event emitted when a client opens or refreshes a pairing request. */
const DevicePairRequestedEventSchema = Type.Object({
	requestId: NonEmptyString,
	deviceId: NonEmptyString,
	publicKey: NonEmptyString,
	displayName: Type.Optional(NonEmptyString),
	platform: Type.Optional(NonEmptyString),
	deviceFamily: Type.Optional(NonEmptyString),
	clientId: Type.Optional(NonEmptyString),
	clientMode: Type.Optional(NonEmptyString),
	role: Type.Optional(NonEmptyString),
	roles: Type.Optional(Type.Array(NonEmptyString)),
	scopes: Type.Optional(Type.Array(NonEmptyString)),
	remoteIp: Type.Optional(NonEmptyString),
	silent: Type.Optional(Type.Boolean()),
	isRepair: Type.Optional(Type.Boolean()),
	ts: Type.Integer({ minimum: 0 })
}, { additionalProperties: false });
/** Event emitted after a pairing request is approved, rejected, or otherwise resolved. */
const DevicePairResolvedEventSchema = Type.Object({
	requestId: NonEmptyString,
	deviceId: NonEmptyString,
	decision: NonEmptyString,
	ts: Type.Integer({ minimum: 0 })
}, { additionalProperties: false });
//#endregion
//#region packages/gateway-protocol/src/schema/snapshot.ts
/**
* Gateway state snapshot schemas.
*
* Snapshots are sent during hello and later event streams; they summarize node
* presence, health, session defaults, and version counters for clients.
*/
/** One gateway-visible presence record for a node/client/runtime. */
const PresenceEntrySchema = Type.Object({
	host: Type.Optional(NonEmptyString),
	ip: Type.Optional(NonEmptyString),
	version: Type.Optional(NonEmptyString),
	platform: Type.Optional(NonEmptyString),
	deviceFamily: Type.Optional(NonEmptyString),
	modelIdentifier: Type.Optional(NonEmptyString),
	mode: Type.Optional(NonEmptyString),
	lastInputSeconds: Type.Optional(Type.Integer({ minimum: 0 })),
	reason: Type.Optional(NonEmptyString),
	tags: Type.Optional(Type.Array(NonEmptyString)),
	text: Type.Optional(Type.String()),
	ts: Type.Integer({ minimum: 0 }),
	deviceId: Type.Optional(NonEmptyString),
	roles: Type.Optional(Type.Array(NonEmptyString)),
	scopes: Type.Optional(Type.Array(NonEmptyString)),
	instanceId: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Health snapshot is intentionally opaque because providers contribute nested shapes. */
const HealthSnapshotSchema = Type.Any();
/** Default session routing keys included in initial gateway snapshots. */
const SessionDefaultsSchema = Type.Object({
	defaultAgentId: NonEmptyString,
	mainKey: NonEmptyString,
	mainSessionKey: NonEmptyString,
	scope: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Monotonic version counters for snapshot subtrees. */
const StateVersionSchema = Type.Object({
	presence: Type.Integer({ minimum: 0 }),
	health: Type.Integer({ minimum: 0 })
}, { additionalProperties: false });
/** Initial and incremental gateway state snapshot payload. */
const SnapshotSchema = Type.Object({
	presence: Type.Array(PresenceEntrySchema),
	health: HealthSnapshotSchema,
	stateVersion: StateVersionSchema,
	uptimeMs: Type.Integer({ minimum: 0 }),
	configPath: Type.Optional(NonEmptyString),
	stateDir: Type.Optional(NonEmptyString),
	sessionDefaults: Type.Optional(SessionDefaultsSchema),
	authMode: Type.Optional(Type.Union([
		Type.Literal("none"),
		Type.Literal("token"),
		Type.Literal("password"),
		Type.Literal("trusted-proxy")
	])),
	updateAvailable: Type.Optional(Type.Object({
		currentVersion: NonEmptyString,
		latestVersion: NonEmptyString,
		channel: NonEmptyString
	}))
}, { additionalProperties: false });
//#endregion
//#region packages/gateway-protocol/src/schema/frames.ts
/**
* Top-level gateway frame schemas.
*
* These are the WebSocket envelope contracts; method/event payload schemas live
* in feature-specific modules and are referenced by runtime validators.
*/
/** Periodic server heartbeat event payload. */
const TickEventSchema = Type.Object({ ts: Type.Integer({ minimum: 0 }) }, { additionalProperties: false });
/** Server shutdown notice event payload. */
const ShutdownEventSchema = Type.Object({
	reason: NonEmptyString,
	restartExpectedMs: Type.Optional(Type.Integer({ minimum: 0 }))
}, { additionalProperties: false });
/** Initial client hello/connect payload sent before the gateway accepts frames. */
const ConnectParamsSchema = Type.Object({
	minProtocol: Type.Integer({ minimum: 1 }),
	maxProtocol: Type.Integer({ minimum: 1 }),
	client: Type.Object({
		id: GatewayClientIdSchema,
		displayName: Type.Optional(NonEmptyString),
		version: NonEmptyString,
		platform: NonEmptyString,
		deviceFamily: Type.Optional(NonEmptyString),
		modelIdentifier: Type.Optional(NonEmptyString),
		mode: GatewayClientModeSchema,
		instanceId: Type.Optional(NonEmptyString)
	}, { additionalProperties: false }),
	caps: Type.Optional(Type.Array(NonEmptyString, { default: [] })),
	commands: Type.Optional(Type.Array(NonEmptyString)),
	permissions: Type.Optional(Type.Record(NonEmptyString, Type.Boolean())),
	pathEnv: Type.Optional(Type.String()),
	role: Type.Optional(NonEmptyString),
	scopes: Type.Optional(Type.Array(NonEmptyString)),
	device: Type.Optional(Type.Object({
		id: NonEmptyString,
		publicKey: NonEmptyString,
		signature: NonEmptyString,
		signedAt: Type.Integer({ minimum: 0 }),
		nonce: NonEmptyString
	}, { additionalProperties: false })),
	auth: Type.Optional(Type.Object({
		token: Type.Optional(Type.String()),
		bootstrapToken: Type.Optional(Type.String()),
		deviceToken: Type.Optional(Type.String()),
		password: Type.Optional(Type.String()),
		approvalRuntimeToken: Type.Optional(Type.String())
	}, { additionalProperties: false })),
	locale: Type.Optional(Type.String()),
	userAgent: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Successful gateway hello response with negotiated protocol and initial state. */
const HelloOkSchema = Type.Object({
	type: Type.Literal("hello-ok"),
	protocol: Type.Integer({ minimum: 1 }),
	server: Type.Object({
		version: NonEmptyString,
		connId: NonEmptyString
	}, { additionalProperties: false }),
	features: Type.Object({
		methods: Type.Array(NonEmptyString),
		events: Type.Array(NonEmptyString)
	}, { additionalProperties: false }),
	snapshot: SnapshotSchema,
	pluginSurfaceUrls: Type.Optional(Type.Record(NonEmptyString, NonEmptyString)),
	auth: Type.Object({
		deviceToken: Type.Optional(NonEmptyString),
		role: NonEmptyString,
		scopes: Type.Array(NonEmptyString),
		issuedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
		deviceTokens: Type.Optional(Type.Array(Type.Object({
			deviceToken: NonEmptyString,
			role: NonEmptyString,
			scopes: Type.Array(NonEmptyString),
			issuedAtMs: Type.Integer({ minimum: 0 })
		}, { additionalProperties: false })))
	}, { additionalProperties: false }),
	policy: Type.Object({
		maxPayload: Type.Integer({ minimum: 1 }),
		maxBufferedBytes: Type.Integer({ minimum: 1 }),
		tickIntervalMs: Type.Integer({ minimum: 1 })
	}, { additionalProperties: false })
}, { additionalProperties: false });
/** Standard structured error shape used in response frames and connect failures. */
const ErrorShapeSchema = Type.Object({
	code: NonEmptyString,
	message: NonEmptyString,
	details: Type.Optional(Type.Unknown()),
	retryable: Type.Optional(Type.Boolean()),
	retryAfterMs: Type.Optional(Type.Integer({ minimum: 0 }))
}, { additionalProperties: false });
/** Client request frame envelope; `method` selects the payload validator. */
const RequestFrameSchema = Type.Object({
	type: Type.Literal("req"),
	id: NonEmptyString,
	method: NonEmptyString,
	params: Type.Optional(Type.Unknown())
}, { additionalProperties: false });
/** Server response frame envelope paired with a prior request id. */
const ResponseFrameSchema = Type.Object({
	type: Type.Literal("res"),
	id: NonEmptyString,
	ok: Type.Boolean(),
	payload: Type.Optional(Type.Unknown()),
	error: Type.Optional(ErrorShapeSchema)
}, { additionalProperties: false });
/** Server event frame envelope; `event` selects the payload validator. */
const EventFrameSchema = Type.Object({
	type: Type.Literal("event"),
	event: NonEmptyString,
	payload: Type.Optional(Type.Unknown()),
	seq: Type.Optional(Type.Integer({ minimum: 0 })),
	stateVersion: Type.Optional(StateVersionSchema)
}, { additionalProperties: false });
const GatewayFrameSchema = Type.Union([
	RequestFrameSchema,
	ResponseFrameSchema,
	EventFrameSchema
], { discriminator: "type" });
//#endregion
//#region packages/gateway-protocol/src/schema/logs-chat.ts
/** Cursor-based request for the gateway log tail endpoint. */
const LogsTailParamsSchema = Type.Object({
	cursor: Type.Optional(Type.Integer({ minimum: 0 })),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 5e3
	})),
	maxBytes: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 1e6
	}))
}, { additionalProperties: false });
/** Gateway log tail payload returned to dashboard clients. */
const LogsTailResultSchema = Type.Object({
	file: NonEmptyString,
	cursor: Type.Integer({ minimum: 0 }),
	size: Type.Integer({ minimum: 0 }),
	lines: Type.Array(Type.String()),
	truncated: Type.Optional(Type.Boolean()),
	reset: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Session-scoped history request used by WebChat and native WebSocket clients. */
const ChatHistoryParamsSchema = Type.Object({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 1e3
	})),
	maxChars: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 5e5
	}))
}, { additionalProperties: false });
/** Lightweight chat metadata request; optional agent scope keeps selector state explicit. */
const ChatMetadataParamsSchema = Type.Object({ agentId: Type.Optional(NonEmptyString) }, { additionalProperties: false });
/** Fetches one stored chat message without forcing history callers to request huge payloads. */
const ChatMessageGetParamsSchema = Type.Object({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	messageId: NonEmptyString,
	maxChars: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 2e6
	}))
}, { additionalProperties: false });
/** Result envelope for single-message lookup, including the stable miss/visibility reason. */
const ChatMessageGetResultSchema = Type.Object({
	ok: Type.Boolean(),
	message: Type.Optional(Type.Unknown()),
	unavailableReason: Type.Optional(Type.Union([
		Type.Literal("not_found"),
		Type.Literal("oversized"),
		Type.Literal("not_visible")
	]))
}, { additionalProperties: false });
/** User-to-agent send request; idempotency key lets clients safely retry transport failures. */
const ChatSendParamsSchema = Type.Object({
	sessionKey: ChatSendSessionKeyString,
	agentId: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	message: Type.String(),
	thinking: Type.Optional(Type.String()),
	fastMode: Type.Optional(Type.Union([Type.Boolean(), Type.Literal("auto")])),
	fastAutoOnSeconds: Type.Optional(Type.Integer({ minimum: 1 })),
	deliver: Type.Optional(Type.Boolean()),
	originatingChannel: Type.Optional(Type.String()),
	originatingTo: Type.Optional(Type.String()),
	originatingAccountId: Type.Optional(Type.String()),
	originatingThreadId: Type.Optional(Type.String()),
	attachments: Type.Optional(Type.Array(Type.Unknown())),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	systemInputProvenance: Type.Optional(InputProvenanceSchema),
	systemProvenanceReceipt: Type.Optional(Type.String()),
	suppressCommandInterpretation: Type.Optional(Type.Boolean()),
	idempotencyKey: NonEmptyString
}, { additionalProperties: false });
/** Cancels the active or named run for a chat session. */
const ChatAbortParamsSchema = Type.Object({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Inserts an operator-visible synthetic message into an existing chat transcript. */
const ChatInjectParamsSchema = Type.Object({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	message: NonEmptyString,
	label: Type.Optional(Type.String({ maxLength: 100 }))
}, { additionalProperties: false });
/** Shared event fields preserve stream ordering and route events to the right session. */
const ChatEventBaseSchema = {
	runId: NonEmptyString,
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	spawnedBy: Type.Optional(NonEmptyString),
	seq: Type.Integer({ minimum: 0 })
};
/** Stable error categories exposed over the chat stream. */
const ChatEventErrorKindSchema = Type.Union([
	Type.Literal("refusal"),
	Type.Literal("timeout"),
	Type.Literal("rate_limit"),
	Type.Literal("context_length"),
	Type.Literal("unknown")
]);
/** Incremental assistant output event; `replace` marks full-content refresh deltas. */
const ChatDeltaEventSchema = Type.Object({
	...ChatEventBaseSchema,
	state: Type.Literal("delta"),
	message: Type.Optional(Type.Unknown()),
	deltaText: Type.String(),
	replace: Type.Optional(Type.Boolean()),
	usage: Type.Optional(Type.Unknown())
}, { additionalProperties: false });
/** Successful terminal event for a completed chat run. */
const ChatFinalEventSchema = Type.Object({
	...ChatEventBaseSchema,
	state: Type.Literal("final"),
	message: Type.Optional(Type.Unknown()),
	usage: Type.Optional(Type.Unknown()),
	stopReason: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Terminal event for user-initiated or coordinator-initiated cancellation. */
const ChatAbortedEventSchema = Type.Object({
	...ChatEventBaseSchema,
	state: Type.Literal("aborted"),
	message: Type.Optional(Type.Unknown()),
	stopReason: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Terminal event for failed chat runs with an optional normalized failure kind. */
const ChatErrorEventSchema = Type.Object({
	...ChatEventBaseSchema,
	state: Type.Literal("error"),
	message: Type.Optional(Type.Unknown()),
	errorMessage: Type.Optional(Type.String()),
	errorKind: Type.Optional(ChatEventErrorKindSchema),
	usage: Type.Optional(Type.Unknown()),
	stopReason: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Public chat stream event union consumed by gateway protocol validators. */
const ChatEventSchema = Type.Union([
	ChatDeltaEventSchema,
	ChatFinalEventSchema,
	ChatAbortedEventSchema,
	ChatErrorEventSchema
]);
//#endregion
//#region packages/gateway-protocol/src/schema/nodes.ts
/** Pending node work classes that the gateway may queue for paired devices. */
const NodePendingWorkTypeSchema = Type.String({ enum: ["status.request", "location.request"] });
/** Queue priority accepted when operators enqueue node work. */
const NodePendingWorkPrioritySchema = Type.String({ enum: ["normal", "high"] });
/** Reasons a node can report itself alive without implying an operator action. */
const NodePresenceAliveReasonSchema = Type.String({ enum: [
	"background",
	"silent_push",
	"bg_app_refresh",
	"significant_location",
	"manual",
	"connect"
] });
/** Presence heartbeat payload sent by remote nodes to refresh gateway state. */
const NodePresenceAlivePayloadSchema = Type.Object({
	trigger: NodePresenceAliveReasonSchema,
	sentAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	displayName: Type.Optional(NonEmptyString),
	version: Type.Optional(NonEmptyString),
	platform: Type.Optional(NonEmptyString),
	deviceFamily: Type.Optional(NonEmptyString),
	modelIdentifier: Type.Optional(NonEmptyString),
	pushTransport: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Normalized result for node-originated events after gateway dispatch. */
const NodeEventResultSchema = Type.Object({
	ok: Type.Boolean(),
	event: NonEmptyString,
	handled: Type.Boolean(),
	reason: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Pairing request metadata advertised by a node before trust is granted. */
const NodePairRequestParamsSchema = Type.Object({
	nodeId: NonEmptyString,
	displayName: Type.Optional(NonEmptyString),
	platform: Type.Optional(NonEmptyString),
	version: Type.Optional(NonEmptyString),
	coreVersion: Type.Optional(NonEmptyString),
	uiVersion: Type.Optional(NonEmptyString),
	deviceFamily: Type.Optional(NonEmptyString),
	modelIdentifier: Type.Optional(NonEmptyString),
	caps: Type.Optional(Type.Array(NonEmptyString)),
	commands: Type.Optional(Type.Array(NonEmptyString)),
	permissions: Type.Optional(Type.Record(NonEmptyString, Type.Boolean())),
	remoteIp: Type.Optional(NonEmptyString),
	silent: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Lists pending node-pairing requests. */
const NodePairListParamsSchema = Type.Object({}, { additionalProperties: false });
/** Approves a pending node-pairing request by request id. */
const NodePairApproveParamsSchema = Type.Object({ requestId: NonEmptyString }, { additionalProperties: false });
/** Rejects a pending node-pairing request by request id. */
const NodePairRejectParamsSchema = Type.Object({ requestId: NonEmptyString }, { additionalProperties: false });
/** Removes an already paired node from the gateway trust set. */
const NodePairRemoveParamsSchema = Type.Object({ nodeId: NonEmptyString }, { additionalProperties: false });
/** Verifies node ownership with a short-lived pairing token. */
const NodePairVerifyParamsSchema = Type.Object({
	nodeId: NonEmptyString,
	token: NonEmptyString
}, { additionalProperties: false });
/** Renames a paired node while preserving its stable node id. */
const NodeRenameParamsSchema = Type.Object({
	nodeId: NonEmptyString,
	displayName: NonEmptyString
}, { additionalProperties: false });
/** Lists paired nodes known to the gateway. */
const NodeListParamsSchema = Type.Object({}, { additionalProperties: false });
/** Acknowledges queued node work that the node has consumed. */
const NodePendingAckParamsSchema = Type.Object({ ids: Type.Array(NonEmptyString, { minItems: 1 }) }, { additionalProperties: false });
/** Requests detailed metadata for one paired node. */
const NodeDescribeParamsSchema = Type.Object({ nodeId: NonEmptyString }, { additionalProperties: false });
/** Invokes a command on a paired node; idempotency allows safe retries. */
const NodeInvokeParamsSchema = Type.Object({
	nodeId: NonEmptyString,
	command: NonEmptyString,
	params: Type.Optional(Type.Unknown()),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	idempotencyKey: NonEmptyString
}, { additionalProperties: false });
/** Result callback payload for a node command invocation. */
const NodeInvokeResultParamsSchema = Type.Object({
	id: NonEmptyString,
	nodeId: NonEmptyString,
	ok: Type.Boolean(),
	payload: Type.Optional(Type.Unknown()),
	payloadJSON: Type.Optional(Type.String()),
	error: Type.Optional(Type.Object({
		code: Type.Optional(NonEmptyString),
		message: Type.Optional(NonEmptyString)
	}, { additionalProperties: false }))
}, { additionalProperties: false });
/** Generic node event envelope accepted by the gateway. */
const NodeEventParamsSchema = Type.Object({
	event: NonEmptyString,
	payload: Type.Optional(Type.Unknown()),
	payloadJSON: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Request for a bounded batch of queued work assigned to the calling node. */
const NodePendingDrainParamsSchema = Type.Object({ maxItems: Type.Optional(Type.Integer({
	minimum: 1,
	maximum: 10
})) }, { additionalProperties: false });
/** One queued node-work item returned by pending-work drain calls. */
const NodePendingDrainItemSchema = Type.Object({
	id: NonEmptyString,
	type: NodePendingWorkTypeSchema,
	priority: Type.String({ enum: [
		"default",
		"normal",
		"high"
	] }),
	createdAtMs: Type.Integer({ minimum: 0 }),
	expiresAtMs: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	payload: Type.Optional(Type.Record(Type.String(), Type.Unknown()))
}, { additionalProperties: false });
/** Drain response with a revision marker for node queue state. */
const NodePendingDrainResultSchema = Type.Object({
	nodeId: NonEmptyString,
	revision: Type.Integer({ minimum: 0 }),
	items: Type.Array(NodePendingDrainItemSchema),
	hasMore: Type.Boolean()
}, { additionalProperties: false });
/** Enqueues gateway-initiated work for a paired node. */
const NodePendingEnqueueParamsSchema = Type.Object({
	nodeId: NonEmptyString,
	type: NodePendingWorkTypeSchema,
	priority: Type.Optional(NodePendingWorkPrioritySchema),
	expiresInMs: Type.Optional(Type.Integer({
		minimum: 1e3,
		maximum: 864e5
	})),
	wake: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Enqueue result echoes queue revision and whether wake delivery was attempted. */
const NodePendingEnqueueResultSchema = Type.Object({
	nodeId: NonEmptyString,
	revision: Type.Integer({ minimum: 0 }),
	queued: NodePendingDrainItemSchema,
	wakeTriggered: Type.Boolean()
}, { additionalProperties: false });
/** Event payload used by the gateway to ask a node to run a command. */
const NodeInvokeRequestEventSchema = Type.Object({
	id: NonEmptyString,
	nodeId: NonEmptyString,
	command: NonEmptyString,
	paramsJSON: Type.Optional(Type.String()),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	idempotencyKey: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Approval request raised by a plugin before a sensitive tool action proceeds. */
const PluginApprovalRequestParamsSchema = Type.Object({
	pluginId: Type.Optional(NonEmptyString),
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	description: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	severity: Type.Optional(Type.String({ enum: [
		"info",
		"warning",
		"critical"
	] })),
	toolName: Type.Optional(Type.String()),
	toolCallId: Type.Optional(Type.String()),
	allowedDecisions: Type.Optional(Type.Array(Type.String({ enum: [
		"allow-once",
		"allow-always",
		"deny"
	] }), {
		minItems: 1,
		maxItems: 3
	})),
	agentId: Type.Optional(Type.String()),
	sessionKey: Type.Optional(Type.String()),
	turnSourceChannel: Type.Optional(Type.String()),
	turnSourceTo: Type.Optional(Type.String()),
	turnSourceAccountId: Type.Optional(Type.String()),
	turnSourceThreadId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
	timeoutMs: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 6e5
	})),
	twoPhase: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Reviewer decision payload resolving one pending plugin approval request. */
const PluginApprovalResolveParamsSchema = Type.Object({
	id: NonEmptyString,
	decision: NonEmptyString
}, { additionalProperties: false });
//#endregion
//#region packages/gateway-protocol/src/schema/plugins.ts
/**
* Plugin control-surface protocol schemas.
*
* These payloads let the gateway expose plugin-provided UI actions without
* baking plugin-specific payload shapes into the core protocol.
*/
/** Arbitrary plugin-owned JSON payload carried opaquely through the gateway. */
const PluginJsonValueSchema = Type.Unknown();
/** Descriptor for one plugin-provided control UI action or surface. */
const PluginControlUiDescriptorSchema = Type.Object({
	id: NonEmptyString,
	pluginId: NonEmptyString,
	pluginName: Type.Optional(NonEmptyString),
	surface: Type.Union([
		Type.Literal("session"),
		Type.Literal("tool"),
		Type.Literal("run"),
		Type.Literal("settings")
	]),
	label: NonEmptyString,
	description: Type.Optional(Type.String()),
	placement: Type.Optional(Type.String()),
	schema: Type.Optional(PluginJsonValueSchema),
	requiredScopes: Type.Optional(Type.Array(NonEmptyString))
}, { additionalProperties: false });
/** Empty request payload for listing plugin UI descriptors. */
const PluginsUiDescriptorsParamsSchema = Type.Object({}, { additionalProperties: false });
/** Response payload containing all plugin UI descriptors visible to the client. */
const PluginsUiDescriptorsResultSchema = Type.Object({
	ok: Type.Literal(true),
	descriptors: Type.Array(PluginControlUiDescriptorSchema)
}, { additionalProperties: false });
/** Request payload for invoking one plugin-owned session action. */
const PluginsSessionActionParamsSchema = Type.Object({
	pluginId: NonEmptyString,
	actionId: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	payload: Type.Optional(PluginJsonValueSchema)
}, { additionalProperties: false });
/** Successful plugin action result, optionally continuing the agent turn. */
const PluginsSessionActionSuccessResultSchema = Type.Object({
	ok: Type.Literal(true),
	result: Type.Optional(PluginJsonValueSchema),
	continueAgent: Type.Optional(Type.Boolean()),
	reply: Type.Optional(PluginJsonValueSchema)
}, { additionalProperties: false });
/** Failed plugin action result with plugin-owned detail payload. */
const PluginsSessionActionFailureResultSchema = Type.Object({
	ok: Type.Literal(false),
	error: Type.String(),
	code: Type.Optional(Type.String()),
	details: Type.Optional(PluginJsonValueSchema)
}, { additionalProperties: false });
/** Discriminated plugin action result returned to gateway clients. */
const PluginsSessionActionResultSchema = Type.Union([PluginsSessionActionSuccessResultSchema, PluginsSessionActionFailureResultSchema]);
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
const PushTestParamsSchema = Type.Object({
	nodeId: NonEmptyString,
	title: Type.Optional(Type.String()),
	body: Type.Optional(Type.String()),
	environment: Type.Optional(ApnsEnvironmentSchema)
}, { additionalProperties: false });
/** Result payload from an APNS push test, including provider status and transport. */
const PushTestResultSchema = Type.Object({
	ok: Type.Boolean(),
	status: Type.Integer(),
	apnsId: Type.Optional(Type.String()),
	reason: Type.Optional(Type.String()),
	tokenSuffix: Type.String(),
	topic: Type.String(),
	environment: ApnsEnvironmentSchema,
	transport: Type.String({ enum: ["direct", "relay"] })
}, { additionalProperties: false });
const WebPushKeysSchema = Type.Object({
	p256dh: Type.String({
		minLength: 1,
		maxLength: 512
	}),
	auth: Type.String({
		minLength: 1,
		maxLength: 512
	})
}, { additionalProperties: false });
/** Empty request payload for fetching the Web Push VAPID public key. */
const WebPushVapidPublicKeyParamsSchema = Type.Object({}, { additionalProperties: false });
/** Browser Web Push subscription payload registered with the gateway. */
const WebPushSubscribeParamsSchema = Type.Object({
	endpoint: Type.String({
		minLength: 1,
		maxLength: 2048,
		pattern: "^https://"
	}),
	keys: WebPushKeysSchema
}, { additionalProperties: false });
/** Browser Web Push endpoint removal payload. */
const WebPushUnsubscribeParamsSchema = Type.Object({ endpoint: Type.String({
	minLength: 1,
	maxLength: 2048,
	pattern: "^https://"
}) }, { additionalProperties: false });
/** Request payload for sending a test Web Push notification to current subscriptions. */
const WebPushTestParamsSchema = Type.Object({
	title: Type.Optional(Type.String()),
	body: Type.Optional(Type.String())
}, { additionalProperties: false });
//#endregion
//#region packages/gateway-protocol/src/schema/secrets.ts
/**
* Secret-provider protocol schemas.
*
* These payloads request secret materialization from the gateway while keeping
* caller scope, allowed paths, and provider overrides explicit.
*/
/** Empty request payload for reloading configured secret providers. */
const SecretsReloadParamsSchema = Type.Object({}, { additionalProperties: false });
/** Request payload for resolving the secrets needed by one command invocation. */
const SecretsResolveParamsSchema = Type.Object({
	commandName: NonEmptyString,
	targetIds: Type.Array(NonEmptyString),
	allowedPaths: Type.Optional(Type.Array(NonEmptyString)),
	forcedActivePaths: Type.Optional(Type.Array(NonEmptyString)),
	optionalActivePaths: Type.Optional(Type.Array(NonEmptyString)),
	providerOverrides: Type.Optional(Type.Object({
		webSearch: Type.Optional(NonEmptyString),
		webFetch: Type.Optional(NonEmptyString)
	}, { additionalProperties: false }))
}, { additionalProperties: false });
/** One resolved secret assignment path plus its provider-owned value. */
const SecretsResolveAssignmentSchema = Type.Object({
	path: Type.Optional(NonEmptyString),
	pathSegments: Type.Array(NonEmptyString),
	value: Type.Unknown()
}, { additionalProperties: false });
/** Secret resolution response with assignments and safe diagnostics. */
const SecretsResolveResultSchema = Type.Object({
	ok: Type.Optional(Type.Boolean()),
	assignments: Type.Optional(Type.Array(SecretsResolveAssignmentSchema)),
	diagnostics: Type.Optional(Type.Array(NonEmptyString)),
	inactiveRefPaths: Type.Optional(Type.Array(NonEmptyString))
}, { additionalProperties: false });
//#endregion
//#region packages/gateway-protocol/src/schema/sessions.ts
/**
* Session protocol schemas.
*
* These requests and results cover transcript discovery, lifecycle control,
* compaction checkpoints, per-session plugin state, and usage reporting. The
* schemas are shared by dashboard, CLI, ACP, and gateway RPC callers.
*/
/** Reason a compaction checkpoint was created. */
const SessionCompactionCheckpointReasonSchema = Type.Union([
	Type.Literal("manual"),
	Type.Literal("auto-threshold"),
	Type.Literal("overflow-retry"),
	Type.Literal("timeout-retry")
]);
/** Start/end event emitted while a session compaction operation runs. */
const SessionOperationEventSchema = Type.Object({
	operationId: NonEmptyString,
	operation: Type.Literal("compact"),
	phase: Type.Union([Type.Literal("start"), Type.Literal("end")]),
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	ts: Type.Integer({ minimum: 0 }),
	completed: Type.Optional(Type.Boolean()),
	reason: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Reference to the transcript location before or after compaction. */
const SessionCompactionTranscriptReferenceSchema = Type.Object({
	sessionId: NonEmptyString,
	sessionFile: Type.Optional(NonEmptyString),
	leafId: Type.Optional(NonEmptyString),
	entryId: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Stored compaction checkpoint metadata for branching or restoring a session. */
const SessionCompactionCheckpointSchema = Type.Object({
	checkpointId: NonEmptyString,
	sessionKey: NonEmptyString,
	sessionId: NonEmptyString,
	createdAt: Type.Integer({ minimum: 0 }),
	reason: SessionCompactionCheckpointReasonSchema,
	tokensBefore: Type.Optional(Type.Integer({ minimum: 0 })),
	tokensAfter: Type.Optional(Type.Integer({ minimum: 0 })),
	summary: Type.Optional(Type.String()),
	firstKeptEntryId: Type.Optional(NonEmptyString),
	preCompaction: SessionCompactionTranscriptReferenceSchema,
	postCompaction: SessionCompactionTranscriptReferenceSchema
}, { additionalProperties: false });
/** Session file grouping used by the Control UI session workspace rail. */
const SessionFileKindSchema = Type.Union([Type.Literal("modified"), Type.Literal("read")]);
/** Session relevance marker for browser entries. */
const SessionFileRelevanceSchema = Type.Union([
	Type.Literal("modified"),
	Type.Literal("read"),
	Type.Literal("mixed")
]);
/** One file path referenced by a session transcript. */
const SessionFileEntrySchema = Type.Object({
	path: NonEmptyString,
	name: NonEmptyString,
	kind: SessionFileKindSchema,
	missing: Type.Boolean(),
	size: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	content: Type.Optional(Type.String())
}, { additionalProperties: false });
/** One file or folder in the session-rooted browser. */
const SessionFileBrowserEntrySchema = Type.Object({
	path: Type.String(),
	name: NonEmptyString,
	kind: Type.Union([Type.Literal("file"), Type.Literal("directory")]),
	sessionKind: Type.Optional(SessionFileRelevanceSchema),
	size: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
}, { additionalProperties: false });
/** Folder listing or search result rooted at the session workspace. */
const SessionFileBrowserResultSchema = Type.Object({
	path: Type.String(),
	parentPath: Type.Optional(Type.String()),
	search: Type.Optional(Type.String()),
	entries: Type.Array(SessionFileBrowserEntrySchema),
	truncated: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Lists files touched by a session transcript. */
const SessionsFilesListParamsSchema = Type.Object({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	path: Type.Optional(Type.String()),
	search: Type.Optional(Type.String())
}, { additionalProperties: false });
/** File references visible in one session workspace. */
const SessionsFilesListResultSchema = Type.Object({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	files: Type.Array(SessionFileEntrySchema),
	browser: Type.Optional(SessionFileBrowserResultSchema)
}, { additionalProperties: false });
/** Reads one session-referenced file by path. */
const SessionsFilesGetParamsSchema = Type.Object({
	sessionKey: NonEmptyString,
	path: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Result for reading one session-referenced file. */
const SessionsFilesGetResultSchema = Type.Object({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	file: SessionFileEntrySchema
}, { additionalProperties: false });
/** Lists sessions with optional scope, activity, label, and preview filters. */
const SessionsListParamsSchema = Type.Object({
	/**
	* Maximum rows to return. Omitted Gateway RPC calls use a bounded default
	* to keep large session stores from monopolizing the event loop.
	*/
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
	activeMinutes: Type.Optional(Type.Integer({ minimum: 1 })),
	includeGlobal: Type.Optional(Type.Boolean()),
	includeUnknown: Type.Optional(Type.Boolean()),
	/**
	* Limit returned agent-scoped rows to agents currently present in config.
	* Broad disk discovery remains the default for recovery/ACP consumers.
	*/
	configuredAgentsOnly: Type.Optional(Type.Boolean()),
	/**
	* Read first 8KB of each session transcript to derive title from first user message.
	* Performs a file read per session - use `limit` to bound result set on large stores.
	*/
	includeDerivedTitles: Type.Optional(Type.Boolean()),
	/**
	* Read last 16KB of each session transcript to extract most recent message preview.
	* Performs a file read per session - use `limit` to bound result set on large stores.
	*/
	includeLastMessage: Type.Optional(Type.Boolean()),
	label: Type.Optional(SessionLabelString),
	spawnedBy: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	search: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Repairs or removes invalid session records from the selected agent scope. */
const SessionsCleanupParamsSchema = Type.Object({
	agent: Type.Optional(NonEmptyString),
	allAgents: Type.Optional(Type.Boolean()),
	enforce: Type.Optional(Type.Boolean()),
	activeKey: Type.Optional(NonEmptyString),
	fixMissing: Type.Optional(Type.Boolean()),
	fixDmScope: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Reads short previews for selected session keys. */
const SessionsPreviewParamsSchema = Type.Object({
	keys: Type.Array(NonEmptyString, { minItems: 1 }),
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	maxChars: Type.Optional(Type.Integer({ minimum: 20 }))
}, { additionalProperties: false });
/** Describes one session and optional derived title/last-message previews. */
const SessionsDescribeParamsSchema = Type.Object({
	key: NonEmptyString,
	includeDerivedTitles: Type.Optional(Type.Boolean()),
	includeLastMessage: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Resolves a session by key, raw session id, label, or parent/agent scope. */
const SessionsResolveParamsSchema = Type.Object({
	key: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	label: Type.Optional(SessionLabelString),
	agentId: Type.Optional(NonEmptyString),
	spawnedBy: Type.Optional(NonEmptyString),
	includeGlobal: Type.Optional(Type.Boolean()),
	includeUnknown: Type.Optional(Type.Boolean()),
	/** Return a successful `{ ok: false }` response when the selector does not match a session. */
	allowMissing: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Creates or adopts a session with optional model, label, and parent linkage. */
const SessionsCreateParamsSchema = Type.Object({
	key: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	label: Type.Optional(SessionLabelString),
	model: Type.Optional(NonEmptyString),
	parentSessionKey: Type.Optional(NonEmptyString),
	emitCommandHooks: Type.Optional(Type.Boolean()),
	task: Type.Optional(Type.String()),
	message: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Sends one message into an existing session. */
const SessionsSendParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	message: Type.String(),
	thinking: Type.Optional(Type.String()),
	attachments: Type.Optional(Type.Array(Type.Unknown())),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	idempotencyKey: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Subscribes a client to live message updates for one session. */
const SessionsMessagesSubscribeParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Removes a live message subscription for one session. */
const SessionsMessagesUnsubscribeParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Aborts the active or named run for a session. */
const SessionsAbortParamsSchema = Type.Object({
	key: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Mutable per-session preferences and routing metadata. */
const SessionsPatchParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	label: Type.Optional(Type.Union([SessionLabelString, Type.Null()])),
	thinkingLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	fastMode: Type.Optional(Type.Union([
		Type.Boolean(),
		Type.Literal("auto"),
		Type.Null()
	])),
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
	model: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	spawnedBy: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	spawnedWorkspaceDir: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	spawnedCwd: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	spawnDepth: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	subagentRole: Type.Optional(Type.Union([
		Type.Literal("orchestrator"),
		Type.Literal("leaf"),
		Type.Null()
	])),
	subagentControlScope: Type.Optional(Type.Union([
		Type.Literal("children"),
		Type.Literal("none"),
		Type.Null()
	])),
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
}, { additionalProperties: false });
/** Updates or clears one plugin namespace value on a session record. */
const SessionsPluginPatchParamsSchema = Type.Object({
	key: NonEmptyString,
	pluginId: NonEmptyString,
	namespace: NonEmptyString,
	value: Type.Optional(PluginJsonValueSchema),
	unset: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Result returned after patching session plugin state. */
const SessionsPluginPatchResultSchema = Type.Object({
	ok: Type.Literal(true),
	key: NonEmptyString,
	value: Type.Optional(PluginJsonValueSchema)
}, { additionalProperties: false });
/** Resets a session to a new or reset transcript state. */
const SessionsResetParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	reason: Type.Optional(Type.Union([Type.Literal("new"), Type.Literal("reset")]))
}, { additionalProperties: false });
/** Deletes a session record and optionally its transcript. */
const SessionsDeleteParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	deleteTranscript: Type.Optional(Type.Boolean()),
	emitLifecycleHooks: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
/** Requests manual compaction for a session transcript. */
const SessionsCompactParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	maxLines: Type.Optional(Type.Integer({ minimum: 1 }))
}, { additionalProperties: false });
/** Lists compaction checkpoints for one session. */
const SessionsCompactionListParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Reads one compaction checkpoint by id. */
const SessionsCompactionGetParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	checkpointId: NonEmptyString
}, { additionalProperties: false });
/** Creates a new branch from a compaction checkpoint. */
const SessionsCompactionBranchParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	checkpointId: NonEmptyString
}, { additionalProperties: false });
/** Restores an existing session to a compaction checkpoint. */
const SessionsCompactionRestoreParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	checkpointId: NonEmptyString
}, { additionalProperties: false });
/** List response for session compaction checkpoints. */
const SessionsCompactionListResultSchema = Type.Object({
	ok: Type.Literal(true),
	key: NonEmptyString,
	checkpoints: Type.Array(SessionCompactionCheckpointSchema)
}, { additionalProperties: false });
/** Get response for a single compaction checkpoint. */
const SessionsCompactionGetResultSchema = Type.Object({
	ok: Type.Literal(true),
	key: NonEmptyString,
	checkpoint: SessionCompactionCheckpointSchema
}, { additionalProperties: false });
/** Branch response with the newly created session key and entry metadata. */
const SessionsCompactionBranchResultSchema = Type.Object({
	ok: Type.Literal(true),
	sourceKey: NonEmptyString,
	key: NonEmptyString,
	sessionId: NonEmptyString,
	checkpoint: SessionCompactionCheckpointSchema,
	entry: Type.Object({
		sessionId: NonEmptyString,
		updatedAt: Type.Integer({ minimum: 0 })
	}, { additionalProperties: true })
}, { additionalProperties: false });
/** Restore response with updated session entry metadata. */
const SessionsCompactionRestoreResultSchema = Type.Object({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: NonEmptyString,
	checkpoint: SessionCompactionCheckpointSchema,
	entry: Type.Object({
		sessionId: NonEmptyString,
		updatedAt: Type.Integer({ minimum: 0 })
	}, { additionalProperties: true })
}, { additionalProperties: false });
/** Usage report query across one session, one agent, or all agent sessions. */
const SessionsUsageParamsSchema = Type.Object({
	/** Specific session key to analyze; if omitted returns sessions for the effective agent. */
	key: Type.Optional(NonEmptyString),
	/** Agent scope for list-style usage queries. */
	agentId: Type.Optional(NonEmptyString),
	/** Explicit all-agent scope for list-style usage queries. */
	agentScope: Type.Optional(Type.Literal("all")),
	/** Start date for range filter (YYYY-MM-DD). */
	startDate: Type.Optional(Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
	/** End date for range filter (YYYY-MM-DD). */
	endDate: Type.Optional(Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
	/** How start/end dates should be interpreted. Defaults to UTC when omitted. */
	mode: Type.Optional(Type.Union([
		Type.Literal("utc"),
		Type.Literal("gateway"),
		Type.Literal("specific")
	])),
	/** Preset range for usage queries when explicit start/end dates are omitted. */
	range: Type.Optional(Type.Union([
		Type.Literal("7d"),
		Type.Literal("30d"),
		Type.Literal("90d"),
		Type.Literal("1y"),
		Type.Literal("all")
	])),
	/** Usage row grouping. `family` rolls up known rotated session ids for a logical key. */
	groupBy: Type.Optional(Type.Union([Type.Literal("instance"), Type.Literal("family")])),
	/** Backward-compatible alias for requesting family grouping. */
	includeHistorical: Type.Optional(Type.Boolean()),
	/** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */
	utcOffset: Type.Optional(Type.String({ pattern: "^UTC[+-]\\d{1,2}(?::[0-5]\\d)?$" })),
	/** Maximum sessions to return (default 50). */
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	/** Include context weight breakdown (systemPromptReport). */
	includeContextWeight: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
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
/** Public task summary returned by task list/get/cancel responses. */
const TaskSummarySchema = Type.Object({
	id: NonEmptyString,
	kind: Type.Optional(Type.String()),
	runtime: Type.Optional(Type.String()),
	status: TaskLedgerStatusSchema,
	title: Type.Optional(Type.String()),
	agentId: Type.Optional(Type.String()),
	sessionKey: Type.Optional(Type.String()),
	childSessionKey: Type.Optional(Type.String()),
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
	progressSummary: Type.Optional(Type.String()),
	terminalSummary: Type.Optional(Type.String()),
	error: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Task list filters with bounded pagination. */
const TasksListParamsSchema = Type.Object({
	status: Type.Optional(Type.Union([TaskLedgerStatusSchema, Type.Array(TaskLedgerStatusSchema)])),
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 500
	})),
	cursor: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Task list page response. */
const TasksListResultSchema = Type.Object({
	tasks: Type.Array(TaskSummarySchema),
	nextCursor: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Lookup request for one task id. */
const TasksGetParamsSchema = Type.Object({ taskId: NonEmptyString }, { additionalProperties: false });
/** Lookup result for one task summary. */
const TasksGetResultSchema = Type.Object({ task: TaskSummarySchema }, { additionalProperties: false });
/** Cancel request for one task id with optional operator reason. */
const TasksCancelParamsSchema = Type.Object({
	taskId: NonEmptyString,
	reason: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Cancel result, including the task snapshot when it was found. */
const TasksCancelResultSchema = Type.Object({
	found: Type.Boolean(),
	cancelled: Type.Boolean(),
	reason: Type.Optional(Type.String()),
	task: Type.Optional(TaskSummarySchema)
}, { additionalProperties: false });
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
const WizardStartParamsSchema = Type.Object({
	mode: Type.Optional(Type.Union([Type.Literal("local"), Type.Literal("remote")])),
	workspace: Type.Optional(Type.String())
}, { additionalProperties: false });
/** Client answer payload for the current wizard step. */
const WizardAnswerSchema = Type.Object({
	stepId: NonEmptyString,
	value: Type.Optional(Type.Unknown())
}, { additionalProperties: false });
/** Advances a wizard session, with an answer when the previous step requested input. */
const WizardNextParamsSchema = Type.Object({
	sessionId: NonEmptyString,
	answer: Type.Optional(WizardAnswerSchema)
}, { additionalProperties: false });
/** Shared session-id-only params for cancel and status requests. */
const WizardSessionIdParamsSchema = Type.Object({ sessionId: NonEmptyString }, { additionalProperties: false });
/** Cancels an active wizard session. */
const WizardCancelParamsSchema = WizardSessionIdParamsSchema;
/** Reads status for an active or recently completed wizard session. */
const WizardStatusParamsSchema = WizardSessionIdParamsSchema;
/** Selectable value shown in a choice-based wizard step. */
const WizardStepOptionSchema = Type.Object({
	value: Type.Unknown(),
	label: NonEmptyString,
	hint: Type.Optional(Type.String())
}, { additionalProperties: false });
/** UI contract for one wizard step rendered by gateway clients. */
const WizardStepSchema = Type.Object({
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
	executor: Type.Optional(Type.Union([Type.Literal("gateway"), Type.Literal("client")]))
}, { additionalProperties: false });
/** Common response fields for start and next calls. */
const WizardResultFields = {
	done: Type.Boolean(),
	step: Type.Optional(WizardStepSchema),
	status: Type.Optional(WizardRunStatusSchema),
	error: Type.Optional(Type.String())
};
/** Result after advancing a wizard session. */
const WizardNextResultSchema = Type.Object(WizardResultFields, { additionalProperties: false });
/** Result returned when a wizard session is created. */
const WizardStartResultSchema = Type.Object({
	sessionId: NonEmptyString,
	...WizardResultFields
}, { additionalProperties: false });
/** Minimal status poll result used when the client does not need the next step. */
const WizardStatusResultSchema = Type.Object({
	status: WizardRunStatusSchema,
	error: Type.Optional(Type.String())
}, { additionalProperties: false });
//#endregion
//#region packages/gateway-protocol/src/schema/protocol-schemas.ts
/** Public schema registry keyed by stable protocol schema name. */
const ProtocolSchemas = {
	ConnectParams: ConnectParamsSchema,
	HelloOk: HelloOkSchema,
	RequestFrame: RequestFrameSchema,
	ResponseFrame: ResponseFrameSchema,
	EventFrame: EventFrameSchema,
	GatewayFrame: GatewayFrameSchema,
	PresenceEntry: PresenceEntrySchema,
	StateVersion: StateVersionSchema,
	Snapshot: SnapshotSchema,
	ErrorShape: ErrorShapeSchema,
	EnvironmentStatus: EnvironmentStatusSchema,
	EnvironmentSummary: EnvironmentSummarySchema,
	EnvironmentsListParams: EnvironmentsListParamsSchema,
	EnvironmentsListResult: EnvironmentsListResultSchema,
	EnvironmentsStatusParams: EnvironmentsStatusParamsSchema,
	EnvironmentsStatusResult: EnvironmentsStatusResultSchema,
	AgentEvent: AgentEventSchema,
	MessageActionParams: MessageActionParamsSchema,
	SendParams: SendParamsSchema,
	PollParams: PollParamsSchema,
	AgentParams: AgentParamsSchema,
	AgentIdentityParams: AgentIdentityParamsSchema,
	AgentIdentityResult: AgentIdentityResultSchema,
	AgentWaitParams: AgentWaitParamsSchema,
	WakeParams: WakeParamsSchema,
	NodePairRequestParams: NodePairRequestParamsSchema,
	NodePairListParams: NodePairListParamsSchema,
	NodePairApproveParams: NodePairApproveParamsSchema,
	NodePairRejectParams: NodePairRejectParamsSchema,
	NodePairRemoveParams: NodePairRemoveParamsSchema,
	NodePairVerifyParams: NodePairVerifyParamsSchema,
	NodeRenameParams: NodeRenameParamsSchema,
	NodeListParams: NodeListParamsSchema,
	NodePendingAckParams: NodePendingAckParamsSchema,
	NodeDescribeParams: NodeDescribeParamsSchema,
	NodeInvokeParams: NodeInvokeParamsSchema,
	NodeInvokeResultParams: NodeInvokeResultParamsSchema,
	NodeEventParams: NodeEventParamsSchema,
	NodeEventResult: NodeEventResultSchema,
	NodePresenceAlivePayload: NodePresenceAlivePayloadSchema,
	NodePresenceAliveReason: NodePresenceAliveReasonSchema,
	NodePendingDrainParams: NodePendingDrainParamsSchema,
	NodePendingDrainResult: NodePendingDrainResultSchema,
	NodePendingEnqueueParams: NodePendingEnqueueParamsSchema,
	NodePendingEnqueueResult: NodePendingEnqueueResultSchema,
	NodeInvokeRequestEvent: NodeInvokeRequestEventSchema,
	PushTestParams: PushTestParamsSchema,
	PushTestResult: PushTestResultSchema,
	SecretsReloadParams: SecretsReloadParamsSchema,
	SecretsResolveParams: SecretsResolveParamsSchema,
	SecretsResolveAssignment: SecretsResolveAssignmentSchema,
	SecretsResolveResult: SecretsResolveResultSchema,
	SessionsListParams: SessionsListParamsSchema,
	SessionsCleanupParams: SessionsCleanupParamsSchema,
	SessionsPreviewParams: SessionsPreviewParamsSchema,
	SessionsDescribeParams: SessionsDescribeParamsSchema,
	SessionsResolveParams: SessionsResolveParamsSchema,
	SessionCompactionCheckpoint: SessionCompactionCheckpointSchema,
	SessionOperationEvent: SessionOperationEventSchema,
	SessionsCompactionListParams: SessionsCompactionListParamsSchema,
	SessionsCompactionGetParams: SessionsCompactionGetParamsSchema,
	SessionsCompactionBranchParams: SessionsCompactionBranchParamsSchema,
	SessionsCompactionRestoreParams: SessionsCompactionRestoreParamsSchema,
	SessionsCompactionListResult: SessionsCompactionListResultSchema,
	SessionsCompactionGetResult: SessionsCompactionGetResultSchema,
	SessionsCompactionBranchResult: SessionsCompactionBranchResultSchema,
	SessionsCompactionRestoreResult: SessionsCompactionRestoreResultSchema,
	SessionFileBrowserEntry: SessionFileBrowserEntrySchema,
	SessionFileBrowserResult: SessionFileBrowserResultSchema,
	SessionFileKind: SessionFileKindSchema,
	SessionFileEntry: SessionFileEntrySchema,
	SessionFileRelevance: SessionFileRelevanceSchema,
	SessionsFilesListParams: SessionsFilesListParamsSchema,
	SessionsFilesListResult: SessionsFilesListResultSchema,
	SessionsFilesGetParams: SessionsFilesGetParamsSchema,
	SessionsFilesGetResult: SessionsFilesGetResultSchema,
	SessionsCreateParams: SessionsCreateParamsSchema,
	SessionsSendParams: SessionsSendParamsSchema,
	SessionsMessagesSubscribeParams: SessionsMessagesSubscribeParamsSchema,
	SessionsMessagesUnsubscribeParams: SessionsMessagesUnsubscribeParamsSchema,
	SessionsAbortParams: SessionsAbortParamsSchema,
	SessionsPatchParams: SessionsPatchParamsSchema,
	SessionsPluginPatchParams: SessionsPluginPatchParamsSchema,
	SessionsPluginPatchResult: SessionsPluginPatchResultSchema,
	SessionsResetParams: SessionsResetParamsSchema,
	SessionsDeleteParams: SessionsDeleteParamsSchema,
	SessionsCompactParams: SessionsCompactParamsSchema,
	SessionsUsageParams: SessionsUsageParamsSchema,
	TaskSummary: TaskSummarySchema,
	TasksListParams: TasksListParamsSchema,
	TasksListResult: TasksListResultSchema,
	TasksGetParams: TasksGetParamsSchema,
	TasksGetResult: TasksGetResultSchema,
	TasksCancelParams: TasksCancelParamsSchema,
	TasksCancelResult: TasksCancelResultSchema,
	ConfigGetParams: ConfigGetParamsSchema,
	ConfigSetParams: ConfigSetParamsSchema,
	ConfigApplyParams: ConfigApplyParamsSchema,
	ConfigPatchParams: ConfigPatchParamsSchema,
	ConfigSchemaParams: ConfigSchemaParamsSchema,
	ConfigSchemaLookupParams: ConfigSchemaLookupParamsSchema,
	ConfigSchemaResponse: ConfigSchemaResponseSchema,
	ConfigSchemaLookupResult: ConfigSchemaLookupResultSchema,
	WizardStartParams: WizardStartParamsSchema,
	WizardNextParams: WizardNextParamsSchema,
	WizardCancelParams: WizardCancelParamsSchema,
	WizardStatusParams: WizardStatusParamsSchema,
	WizardStep: WizardStepSchema,
	WizardNextResult: WizardNextResultSchema,
	WizardStartResult: WizardStartResultSchema,
	WizardStatusResult: WizardStatusResultSchema,
	TalkModeParams: TalkModeParamsSchema,
	TalkEvent: TalkEventSchema,
	TalkCatalogParams: TalkCatalogParamsSchema,
	TalkCatalogResult: TalkCatalogResultSchema,
	TalkClientCreateParams: TalkClientCreateParamsSchema,
	TalkClientCreateResult: TalkClientCreateResultSchema,
	TalkClientSteerParams: TalkClientSteerParamsSchema,
	TalkAgentControlResult: TalkAgentControlResultSchema,
	TalkClientToolCallParams: TalkClientToolCallParamsSchema,
	TalkClientToolCallResult: TalkClientToolCallResultSchema,
	TalkConfigParams: TalkConfigParamsSchema,
	TalkConfigResult: TalkConfigResultSchema,
	TalkSessionAppendAudioParams: TalkSessionAppendAudioParamsSchema,
	TalkSessionCancelOutputParams: TalkSessionCancelOutputParamsSchema,
	TalkSessionCancelTurnParams: TalkSessionCancelTurnParamsSchema,
	TalkSessionCreateParams: TalkSessionCreateParamsSchema,
	TalkSessionCreateResult: TalkSessionCreateResultSchema,
	TalkSessionJoinParams: TalkSessionJoinParamsSchema,
	TalkSessionJoinResult: TalkSessionJoinResultSchema,
	TalkSessionTurnParams: TalkSessionTurnParamsSchema,
	TalkSessionTurnResult: TalkSessionTurnResultSchema,
	TalkSessionSteerParams: TalkSessionSteerParamsSchema,
	TalkSessionSubmitToolResultParams: TalkSessionSubmitToolResultParamsSchema,
	TalkSessionCloseParams: TalkSessionCloseParamsSchema,
	TalkSessionOkResult: TalkSessionOkResultSchema,
	TalkSpeakParams: TalkSpeakParamsSchema,
	TalkSpeakResult: TalkSpeakResultSchema,
	ChannelsStatusParams: ChannelsStatusParamsSchema,
	ChannelsStatusResult: ChannelsStatusResultSchema,
	ChannelsStartParams: ChannelsStartParamsSchema,
	ChannelsStopParams: ChannelsStopParamsSchema,
	ChannelsLogoutParams: ChannelsLogoutParamsSchema,
	WebLoginStartParams: WebLoginStartParamsSchema,
	WebLoginWaitParams: WebLoginWaitParamsSchema,
	AgentSummary: AgentSummarySchema,
	AgentsCreateParams: AgentsCreateParamsSchema,
	AgentsCreateResult: AgentsCreateResultSchema,
	AgentsUpdateParams: AgentsUpdateParamsSchema,
	AgentsUpdateResult: AgentsUpdateResultSchema,
	AgentsDeleteParams: AgentsDeleteParamsSchema,
	AgentsDeleteResult: AgentsDeleteResultSchema,
	AgentsFileEntry: AgentsFileEntrySchema,
	AgentsFilesListParams: AgentsFilesListParamsSchema,
	AgentsFilesListResult: AgentsFilesListResultSchema,
	AgentsFilesGetParams: AgentsFilesGetParamsSchema,
	AgentsFilesGetResult: AgentsFilesGetResultSchema,
	AgentsFilesSetParams: AgentsFilesSetParamsSchema,
	AgentsFilesSetResult: AgentsFilesSetResultSchema,
	ArtifactSummary: ArtifactSummarySchema,
	ArtifactsListParams: ArtifactsListParamsSchema,
	ArtifactsListResult: ArtifactsListResultSchema,
	ArtifactsGetParams: ArtifactsGetParamsSchema,
	ArtifactsGetResult: ArtifactsGetResultSchema,
	ArtifactsDownloadParams: ArtifactsDownloadParamsSchema,
	ArtifactsDownloadResult: ArtifactsDownloadResultSchema,
	AgentsListParams: AgentsListParamsSchema,
	AgentsListResult: AgentsListResultSchema,
	ModelChoice: ModelChoiceSchema,
	ModelsListParams: ModelsListParamsSchema,
	ModelsListResult: ModelsListResultSchema,
	CommandEntry: CommandEntrySchema,
	CommandsListParams: CommandsListParamsSchema,
	CommandsListResult: CommandsListResultSchema,
	SkillsStatusParams: SkillsStatusParamsSchema,
	ToolsCatalogParams: ToolsCatalogParamsSchema,
	ToolCatalogProfile: ToolCatalogProfileSchema,
	ToolCatalogEntry: ToolCatalogEntrySchema,
	ToolCatalogGroup: ToolCatalogGroupSchema,
	ToolsCatalogResult: ToolsCatalogResultSchema,
	ToolsEffectiveParams: ToolsEffectiveParamsSchema,
	ToolsEffectiveEntry: ToolsEffectiveEntrySchema,
	ToolsEffectiveGroup: ToolsEffectiveGroupSchema,
	ToolsEffectiveNotice: ToolsEffectiveNoticeSchema,
	ToolsEffectiveResult: ToolsEffectiveResultSchema,
	ToolsInvokeParams: ToolsInvokeParamsSchema,
	ToolsInvokeError: ToolsInvokeErrorSchema,
	ToolsInvokeResult: ToolsInvokeResultSchema,
	SkillsBinsParams: SkillsBinsParamsSchema,
	SkillsBinsResult: SkillsBinsResultSchema,
	SkillsSearchParams: SkillsSearchParamsSchema,
	SkillsSearchResult: SkillsSearchResultSchema,
	SkillsDetailParams: SkillsDetailParamsSchema,
	SkillsDetailResult: SkillsDetailResultSchema,
	SkillsProposalsListParams: SkillsProposalsListParamsSchema,
	SkillsProposalsListResult: SkillsProposalsListResultSchema,
	SkillsProposalInspectParams: SkillsProposalInspectParamsSchema,
	SkillsProposalInspectResult: SkillsProposalInspectResultSchema,
	SkillsProposalCreateParams: SkillsProposalCreateParamsSchema,
	SkillsProposalUpdateParams: SkillsProposalUpdateParamsSchema,
	SkillsProposalReviseParams: SkillsProposalReviseParamsSchema,
	SkillsProposalRequestRevisionParams: SkillsProposalRequestRevisionParamsSchema,
	SkillsProposalRequestRevisionResult: SkillsProposalRequestRevisionResultSchema,
	SkillsProposalActionParams: SkillsProposalActionParamsSchema,
	SkillsProposalApplyResult: SkillsProposalApplyResultSchema,
	SkillsProposalRecordResult: SkillsProposalRecordResultSchema,
	SkillsSecurityVerdictsParams: SkillsSecurityVerdictsParamsSchema,
	SkillsSecurityVerdictsResult: SkillsSecurityVerdictsResultSchema,
	SkillsSkillCardParams: SkillsSkillCardParamsSchema,
	SkillsSkillCardResult: SkillsSkillCardResultSchema,
	SkillsUploadBeginParams: SkillsUploadBeginParamsSchema,
	SkillsUploadChunkParams: SkillsUploadChunkParamsSchema,
	SkillsUploadCommitParams: SkillsUploadCommitParamsSchema,
	SkillsInstallParams: SkillsInstallParamsSchema,
	SkillsUpdateParams: SkillsUpdateParamsSchema,
	CronJob: CronJobSchema,
	CronListParams: CronListParamsSchema,
	CronStatusParams: CronStatusParamsSchema,
	CronGetParams: CronGetParamsSchema,
	CronAddParams: CronAddParamsSchema,
	CronUpdateParams: CronUpdateParamsSchema,
	CronRemoveParams: CronRemoveParamsSchema,
	CronRunParams: CronRunParamsSchema,
	CronRunsParams: CronRunsParamsSchema,
	CronRunLogEntry: CronRunLogEntrySchema,
	LogsTailParams: LogsTailParamsSchema,
	LogsTailResult: LogsTailResultSchema,
	ExecApprovalsGetParams: ExecApprovalsGetParamsSchema,
	ExecApprovalsSetParams: ExecApprovalsSetParamsSchema,
	ExecApprovalsNodeGetParams: ExecApprovalsNodeGetParamsSchema,
	ExecApprovalsNodeSetParams: ExecApprovalsNodeSetParamsSchema,
	ExecApprovalsSnapshot: ExecApprovalsSnapshotSchema,
	ExecApprovalGetParams: ExecApprovalGetParamsSchema,
	ExecApprovalRequestParams: ExecApprovalRequestParamsSchema,
	ExecApprovalResolveParams: ExecApprovalResolveParamsSchema,
	PluginApprovalRequestParams: PluginApprovalRequestParamsSchema,
	PluginApprovalResolveParams: PluginApprovalResolveParamsSchema,
	PluginControlUiDescriptor: PluginControlUiDescriptorSchema,
	PluginsSessionActionFailureResult: PluginsSessionActionFailureResultSchema,
	PluginsSessionActionParams: PluginsSessionActionParamsSchema,
	PluginsSessionActionResult: PluginsSessionActionResultSchema,
	PluginsSessionActionSuccessResult: PluginsSessionActionSuccessResultSchema,
	PluginsUiDescriptorsParams: PluginsUiDescriptorsParamsSchema,
	PluginsUiDescriptorsResult: PluginsUiDescriptorsResultSchema,
	DevicePairListParams: DevicePairListParamsSchema,
	DevicePairApproveParams: DevicePairApproveParamsSchema,
	DevicePairRejectParams: DevicePairRejectParamsSchema,
	DevicePairRemoveParams: DevicePairRemoveParamsSchema,
	DeviceTokenRotateParams: DeviceTokenRotateParamsSchema,
	DeviceTokenRevokeParams: DeviceTokenRevokeParamsSchema,
	DevicePairRequestedEvent: DevicePairRequestedEventSchema,
	DevicePairResolvedEvent: DevicePairResolvedEventSchema,
	ChatHistoryParams: ChatHistoryParamsSchema,
	ChatMetadataParams: ChatMetadataParamsSchema,
	ChatMessageGetParams: ChatMessageGetParamsSchema,
	ChatMessageGetResult: ChatMessageGetResultSchema,
	ChatSendParams: ChatSendParamsSchema,
	ChatAbortParams: ChatAbortParamsSchema,
	ChatInjectParams: ChatInjectParamsSchema,
	ChatDeltaEvent: ChatDeltaEventSchema,
	ChatFinalEvent: ChatFinalEventSchema,
	ChatAbortedEvent: ChatAbortedEventSchema,
	ChatErrorEvent: ChatErrorEventSchema,
	ChatEvent: ChatEventSchema,
	UpdateStatusParams: UpdateStatusParamsSchema,
	UpdateRunParams: UpdateRunParamsSchema,
	TickEvent: TickEventSchema,
	ShutdownEvent: ShutdownEventSchema
};
//#endregion
export { WebPushVapidPublicKeyParamsSchema as $, TalkModeParamsSchema as $n, SkillsProposalsListResultSchema as $r, DeviceTokenRotateParamsSchema as $t, SessionsDeleteParamsSchema as A, ConfigSchemaResponseSchema as An, AgentsFilesListResultSchema as Ar, ChatMessageGetParamsSchema as At, SessionsPluginPatchParamsSchema as B, ChannelsStatusResultSchema as Bn, SkillsDetailResultSchema as Br, HelloOkSchema as Bt, SessionsCleanupParamsSchema as C, CronUpdateParamsSchema as Cn, AgentsCreateResultSchema as Cr, NodePresenceAlivePayloadSchema as Ct, SessionsCompactionListParamsSchema as D, ConfigSchemaLookupParamsSchema as Dn, AgentsFilesGetParamsSchema as Dr, ChatEventSchema as Dt, SessionsCompactionGetParamsSchema as E, ConfigPatchParamsSchema as En, AgentsFileEntrySchema as Er, ChatAbortParamsSchema as Et, SessionsFilesListResultSchema as F, CommandsListParamsSchema as Fn, AgentsUpdateParamsSchema as Fr, LogsTailResultSchema as Ft, SessionsUsageParamsSchema as G, TalkClientCreateParamsSchema as Gn, SkillsProposalInspectParamsSchema as Gr, PresenceEntrySchema as Gt, SessionsResetParamsSchema as H, TalkAgentControlResultSchema as Hn, SkillsProposalActionParamsSchema as Hr, ResponseFrameSchema as Ht, SessionsListParamsSchema as I, CommandsListResultSchema as In, AgentsUpdateResultSchema as Ir, ConnectParamsSchema as It, PushTestParamsSchema as J, TalkClientToolCallParamsSchema as Jn, SkillsProposalRequestRevisionParamsSchema as Jr, DevicePairApproveParamsSchema as Jt, SecretsResolveParamsSchema as K, TalkClientCreateResultSchema as Kn, SkillsProposalInspectResultSchema as Kr, SnapshotSchema as Kt, SessionsMessagesSubscribeParamsSchema as L, ChannelsLogoutParamsSchema as Ln, ModelsListParamsSchema as Lr, ErrorShapeSchema as Lt, SessionsFilesGetParamsSchema as M, UpdateRunParamsSchema as Mn, AgentsFilesSetResultSchema as Mr, ChatMetadataParamsSchema as Mt, SessionsFilesGetResultSchema as N, UpdateStatusParamsSchema as Nn, AgentsListParamsSchema as Nr, ChatSendParamsSchema as Nt, SessionsCompactionRestoreParamsSchema as O, ConfigSchemaLookupResultSchema as On, AgentsFilesGetResultSchema as Or, ChatHistoryParamsSchema as Ot, SessionsFilesListParamsSchema as P, COMMAND_DESCRIPTION_MAX_LENGTH as Pn, AgentsListResultSchema as Pr, LogsTailParamsSchema as Pt, WebPushUnsubscribeParamsSchema as Q, TalkEventSchema as Qn, SkillsProposalsListParamsSchema as Qr, DeviceTokenRevokeParamsSchema as Qt, SessionsMessagesUnsubscribeParamsSchema as R, ChannelsStartParamsSchema as Rn, SkillsBinsParamsSchema as Rr, EventFrameSchema as Rt, SessionsAbortParamsSchema as S, WakeParamsSchema as Si, CronStatusParamsSchema as Sn, AgentsCreateParamsSchema as Sr, NodePendingEnqueueResultSchema as St, SessionsCompactionBranchParamsSchema as T, ConfigGetParamsSchema as Tn, AgentsDeleteResultSchema as Tr, NodeRenameParamsSchema as Tt, SessionsResolveParamsSchema as U, TalkCatalogParamsSchema as Un, SkillsProposalApplyResultSchema as Ur, ShutdownEventSchema as Ut, SessionsPreviewParamsSchema as V, ChannelsStopParamsSchema as Vn, SkillsInstallParamsSchema as Vr, RequestFrameSchema as Vt, SessionsSendParamsSchema as W, TalkCatalogResultSchema as Wn, SkillsProposalCreateParamsSchema as Wr, TickEventSchema as Wt, WebPushSubscribeParamsSchema as X, TalkConfigParamsSchema as Xn, SkillsProposalReviseParamsSchema as Xr, DevicePairRejectParamsSchema as Xt, PushTestResultSchema as Y, TalkClientToolCallResultSchema as Yn, SkillsProposalRequestRevisionResultSchema as Yr, DevicePairListParamsSchema as Yt, WebPushTestParamsSchema as Z, TalkConfigResultSchema as Zn, SkillsProposalUpdateParamsSchema as Zr, DevicePairRemoveParamsSchema as Zt, SessionFileBrowserEntrySchema as _, AgentParamsSchema as _i, CronJobSchema as _n, ArtifactSummarySchema as _r, NodePairVerifyParamsSchema as _t, WizardStartParamsSchema as a, SkillsSkillCardResultSchema as ai, ExecApprovalsNodeSetParamsSchema as an, TalkSessionCreateResultSchema as ar, PluginApprovalResolveParamsSchema as at, SessionFileKindSchema as b, PollParamsSchema as bi, CronRunParamsSchema as bn, ArtifactsListParamsSchema as br, NodePendingDrainResultSchema as bt, WizardStatusResultSchema as c, SkillsUploadBeginParamsSchema as ci, EnvironmentSummarySchema as cn, TalkSessionOkResultSchema as cr, NodeEventResultSchema as ct, TasksCancelParamsSchema as d, ToolsCatalogParamsSchema as di, EnvironmentsStatusParamsSchema as dn, TalkSessionTurnParamsSchema as dr, NodeListParamsSchema as dt, SkillsSearchParamsSchema as ei, ExecApprovalGetParamsSchema as en, TalkSessionAppendAudioParamsSchema as er, PluginsSessionActionParamsSchema as et, TasksCancelResultSchema as f, ToolsEffectiveParamsSchema as fi, EnvironmentsStatusResultSchema as fn, TalkSessionTurnResultSchema as fr, NodePairApproveParamsSchema as ft, TasksListResultSchema as g, AgentIdentityResultSchema as gi, CronGetParamsSchema as gn, WebLoginWaitParamsSchema as gr, NodePairRequestParamsSchema as gt, TasksListParamsSchema as h, AgentIdentityParamsSchema as hi, CronAddParamsSchema as hn, WebLoginStartParamsSchema as hr, NodePairRemoveParamsSchema as ht, WizardNextResultSchema as i, SkillsSkillCardParamsSchema as ii, ExecApprovalsNodeGetParamsSchema as in, TalkSessionCreateParamsSchema as ir, PluginApprovalRequestParamsSchema as it, SessionsDescribeParamsSchema as j, ConfigSetParamsSchema as jn, AgentsFilesSetParamsSchema as jr, ChatMessageGetResultSchema as jt, SessionsCreateParamsSchema as k, ConfigSchemaParamsSchema as kn, AgentsFilesListParamsSchema as kr, ChatInjectParamsSchema as kt, WizardStepSchema as l, SkillsUploadChunkParamsSchema as li, EnvironmentsListParamsSchema as ln, TalkSessionSteerParamsSchema as lr, NodeInvokeParamsSchema as lt, TasksGetResultSchema as m, AgentEventSchema as mi, errorShape as mn, TalkSpeakResultSchema as mr, NodePairRejectParamsSchema as mt, WizardCancelParamsSchema as n, SkillsSecurityVerdictsParamsSchema as ni, ExecApprovalResolveParamsSchema as nn, TalkSessionCancelTurnParamsSchema as nr, PluginsUiDescriptorsParamsSchema as nt, WizardStartResultSchema as o, SkillsStatusParamsSchema as oi, ExecApprovalsSetParamsSchema as on, TalkSessionJoinParamsSchema as or, NodeDescribeParamsSchema as ot, TasksGetParamsSchema as p, ToolsInvokeParamsSchema as pi, ErrorCodes as pn, TalkSpeakParamsSchema as pr, NodePairListParamsSchema as pt, SecretsResolveResultSchema as q, TalkClientSteerParamsSchema as qn, SkillsProposalRecordResultSchema as qr, StateVersionSchema as qt, WizardNextParamsSchema as r, SkillsSecurityVerdictsResultSchema as ri, ExecApprovalsGetParamsSchema as rn, TalkSessionCloseParamsSchema as rr, PluginsUiDescriptorsResultSchema as rt, WizardStatusParamsSchema as s, SkillsUpdateParamsSchema as si, EnvironmentStatusSchema as sn, TalkSessionJoinResultSchema as sr, NodeEventParamsSchema as st, ProtocolSchemas as t, SkillsSearchResultSchema as ti, ExecApprovalRequestParamsSchema as tn, TalkSessionCancelOutputParamsSchema as tr, PluginsSessionActionResultSchema as tt, TaskSummarySchema as u, SkillsUploadCommitParamsSchema as ui, EnvironmentsListResultSchema as un, TalkSessionSubmitToolResultParamsSchema as ur, NodeInvokeResultParamsSchema as ut, SessionFileBrowserResultSchema as v, AgentWaitParamsSchema as vi, CronListParamsSchema as vn, ArtifactsDownloadParamsSchema as vr, NodePendingAckParamsSchema as vt, SessionsCompactParamsSchema as w, ConfigApplyParamsSchema as wn, AgentsDeleteParamsSchema as wr, NodePresenceAliveReasonSchema as wt, SessionFileRelevanceSchema as x, SendParamsSchema as xi, CronRunsParamsSchema as xn, AgentSummarySchema as xr, NodePendingEnqueueParamsSchema as xt, SessionFileEntrySchema as y, MessageActionParamsSchema as yi, CronRemoveParamsSchema as yn, ArtifactsGetParamsSchema as yr, NodePendingDrainParamsSchema as yt, SessionsPatchParamsSchema as z, ChannelsStatusParamsSchema as zn, SkillsDetailParamsSchema as zr, GatewayFrameSchema as zt };
