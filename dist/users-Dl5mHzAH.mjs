import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString, c as Sha256String, l as UserProfileIdSchema } from "./primitives-Ped9kAI8.mjs";
import { n as AgentKindSchema, r as AgentOwnershipSchema, t as AgentCreatedViaSchema } from "./agent-summary-enums-BICtqRYG.mjs";
import { D as WorkerExecutionModeSchema } from "./environments-CjoGdQwO.mjs";
import { t as withSince } from "./since-BZlYNVYy.mjs";
import { s as SessionPermissionModeSchema } from "./sessions-row-Sp79G8RP.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/agent-database-admission.ts
const AgentDatabaseAdmissionRefusalProperties = {
	agentId: NonEmptyString,
	paths: Type.Array(NonEmptyString),
	reason: NonEmptyString,
	repairHint: NonEmptyString
};
const AgentDatabaseAdmissionRefusalSchema = Type.Union([closedObject({
	...AgentDatabaseAdmissionRefusalProperties,
	embeddedOwnerId: NonEmptyString,
	code: Type.Literal("agent-database-ownership-mismatch")
}), closedObject({
	...AgentDatabaseAdmissionRefusalProperties,
	code: Type.Union([Type.Literal("agent-database-inspection-pending"), Type.Literal("agent-database-inspection-failed")])
})]);
//#endregion
//#region packages/gateway-protocol/src/schema/agents-list-session-placement.ts
/** Optional placement policy projected with an agent roster on explicit request. */
const AgentsListPlacementProperties = { sessionPlacement: Type.Optional(closedObject({ requiredProfile: Type.Optional(closedObject({
	id: NonEmptyString,
	providerId: Type.Optional(NonEmptyString),
	executionModes: Type.Optional(Type.Array(Type.Literal("worker-turn"))),
	inference: Type.Optional(Type.Literal("worker"))
})) })) };
/** Empty by default; clients opt into the session placement policy projection. */
const AgentsListParamsSchema = closedObject({ includeSessionPlacement: Type.Optional(Type.Boolean()) });
//#endregion
//#region packages/gateway-protocol/src/schema/model-runtime-options.ts
/** Where a completion runs: the built-in HTTP runtime, a CLI backend, or a plugin harness. */
const GatewayCompletionRouteSchema = closedObject({
	id: NonEmptyString,
	kind: Type.Union([
		Type.Literal("api"),
		Type.Literal("cli"),
		Type.Literal("harness")
	]),
	/** Operator-facing runtime name, e.g. "Claude CLI" or "OpenAI Codex". */
	label: NonEmptyString
});
const GatewayAgentRuntimeSchema = closedObject({
	id: NonEmptyString,
	fallback: Type.Optional(Type.Union([Type.Literal("openclaw"), Type.Literal("none")])),
	workspaceEnvironment: Type.Optional(closedObject({
		kind: Type.Literal("provider-hosted"),
		label: NonEmptyString
	})),
	cloudPlacementSupported: Type.Optional(Type.Boolean()),
	cloudPlacementExecutionMode: Type.Optional(WorkerExecutionModeSchema),
	devicePlacement: Type.Optional(closedObject({
		requiredNodeCommands: Type.Array(Type.String({
			minLength: 1,
			maxLength: 128
		}), {
			maxItems: 32,
			uniqueItems: true
		}),
		consumesWorkerSlot: Type.Boolean()
	})),
	devicePlacementSupported: Type.Optional(Type.Boolean()),
	source: Type.Union([
		Type.Literal("env"),
		Type.Literal("agent"),
		Type.Literal("defaults"),
		Type.Literal("model"),
		Type.Literal("provider"),
		Type.Literal("implicit"),
		Type.Literal("session"),
		Type.Literal("session-key")
	])
});
const GatewayThinkingLevelOptionSchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString
});
const GatewayContextWindowOptionSchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString,
	contextWindow: Type.Integer({ minimum: 1 })
});
closedObject({});
const SecretStoreNameSchema = Type.String({
	minLength: 1,
	maxLength: 128,
	pattern: "^[A-Z][A-Z0-9_]{0,127}$"
});
const GitHubSetupHandleSchema = Type.String({ pattern: "^github-setup-[a-f0-9]{32}$" });
const SecretStoreMutationNameSchema = Type.String({
	minLength: 1,
	maxLength: 128,
	pattern: "^(?:[A-Z][A-Z0-9_]{0,127}|github-setup-[a-f0-9]{32})$"
});
const SecretStoreEntryMetadataProperties = {
	name: SecretStoreNameSchema,
	scopeKind: Type.Literal("team"),
	scopeId: Type.Literal(""),
	createdAtMs: Type.Integer({ minimum: 0 }),
	updatedAtMs: Type.Integer({ minimum: 0 }),
	updatedBy: Type.Optional(Type.String())
};
const SecretStoreAllowedHostsSchema = Type.Array(Type.String({
	minLength: 1,
	maxLength: 253
}), {
	maxItems: 128,
	uniqueItems: true
});
/** Secret metadata never structurally carries the stored value. */
const SecretStoreSecretEntrySchema = closedObject({
	...SecretStoreEntryMetadataProperties,
	kind: Type.Literal("secret"),
	allowedHosts: Type.Optional(withSince("2026.8", SecretStoreAllowedHostsSchema))
});
/** Environment entries include their value because they are intentionally visible. */
const SecretStoreEnvEntrySchema = closedObject({
	...SecretStoreEntryMetadataProperties,
	kind: Type.Literal("env"),
	value: Type.String({ maxLength: 65536 })
});
/** Team secret-store list entry, discriminated by disclosure behavior. */
const SecretStoreEntrySchema = Type.Union([SecretStoreSecretEntrySchema, SecretStoreEnvEntrySchema]);
const SecretsStoreListParamsSchema = closedObject({});
const SecretsStoreListResultSchema = closedObject({ entries: Type.Array(SecretStoreEntrySchema) });
/** Create or replace one team secret-store entry. */
const SecretsStoreSetParamsSchema = closedObject({
	expectedOwnerId: Type.Optional(withSince("2026.9", Type.String({ minLength: 1 }))),
	inheritExistingKind: Type.Optional(withSince("2026.9", Type.Boolean())),
	valueSource: Type.Optional(withSince("2026.9", Type.Literal("argv"))),
	name: SecretStoreMutationNameSchema,
	value: Type.String({ maxLength: 65536 }),
	kind: Type.Union([Type.Literal("secret"), Type.Literal("env")]),
	allowedHosts: Type.Optional(withSince("2026.8", SecretStoreAllowedHostsSchema))
});
/** Soft-delete one team secret-store entry. */
const SecretsStoreDeleteParamsSchema = closedObject({
	expectedOwnerId: Type.Optional(withSince("2026.9", Type.String({ minLength: 1 }))),
	name: SecretStoreMutationNameSchema
});
const SecretsStoreImportParamsSchema = closedObject({
	expectedOwnerId: NonEmptyString,
	inheritExistingKind: Type.Boolean(),
	entries: Type.Array(closedObject({
		name: SecretStoreNameSchema,
		value: Type.String({ maxLength: 65536 }),
		kind: Type.Union([Type.Literal("secret"), Type.Literal("env")])
	}), { minItems: 1 })
});
const SecretsStoreAllowedHostsParamsSchema = closedObject({
	expectedOwnerId: NonEmptyString,
	name: SecretStoreNameSchema,
	allowedHosts: SecretStoreAllowedHostsSchema
});
/** Mutation acknowledgement including whether the active runtime was refreshed. */
const SecretsStoreMutationResultSchema = closedObject({
	ok: Type.Literal(true),
	reloaded: Type.Boolean(),
	kind: Type.Optional(withSince("2026.9", Type.Union([Type.Literal("secret"), Type.Literal("env")]))),
	warningCount: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Request payload for resolving the secrets needed by one command invocation. */
const SecretsResolveParamsSchema = closedObject({
	commandName: NonEmptyString,
	targetIds: Type.Array(NonEmptyString),
	allowedPaths: Type.Optional(Type.Array(NonEmptyString)),
	forcedActivePaths: Type.Optional(Type.Array(NonEmptyString)),
	optionalActivePaths: Type.Optional(Type.Array(NonEmptyString)),
	providerOverrides: Type.Optional(closedObject({
		webSearch: Type.Optional(NonEmptyString),
		webFetch: Type.Optional(NonEmptyString)
	}))
});
/** One resolved secret assignment path plus its provider-owned value. */
const SecretsResolveAssignmentSchema = closedObject({
	path: Type.Optional(NonEmptyString),
	pathSegments: Type.Array(NonEmptyString),
	value: Type.Unknown()
});
/** Secret resolution response with assignments and safe diagnostics. */
const SecretsResolveResultSchema = closedObject({
	ok: Type.Optional(Type.Boolean()),
	assignments: Type.Optional(Type.Array(SecretsResolveAssignmentSchema)),
	diagnostics: Type.Optional(Type.Array(NonEmptyString)),
	inactiveRefPaths: Type.Optional(Type.Array(NonEmptyString))
});
//#endregion
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
//#region packages/gateway-protocol/src/schema/agents-models-skills.ts
/**
* Agent, model, skill, and effective tool schemas.
*
* These contracts back dashboard selectors, agent management, model catalogs,
* skill upload/install flows, skill workshop proposals, and effective tool
* discovery. Keep public request/result schemas documented because they are
* shared by gateway RPC, CLI, and UI clients.
*/
/** Condensed agent record returned by list APIs. */
const AgentSummarySchema = closedObject({
	id: NonEmptyString,
	/** Effective explicit utility model; absent for automatic or disabled utility routing. */
	utilityModel: Type.Optional(NonEmptyString),
	status: Type.Optional(Type.Literal("degraded")),
	admissionRefusal: Type.Optional(AgentDatabaseAdmissionRefusalSchema),
	kind: Type.Optional(AgentKindSchema),
	createdVia: Type.Optional(AgentCreatedViaSchema),
	creatorAgentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	createdAt: Type.Optional(Type.Integer({ minimum: 0 })),
	name: Type.Optional(NonEmptyString),
	identity: Type.Optional(closedObject({
		name: Type.Optional(NonEmptyString),
		theme: Type.Optional(NonEmptyString),
		emoji: Type.Optional(NonEmptyString),
		avatar: Type.Optional(NonEmptyString),
		avatarUrl: Type.Optional(NonEmptyString)
	})),
	workspace: Type.Optional(NonEmptyString),
	workspaceGit: Type.Optional(Type.Boolean()),
	model: Type.Optional(closedObject({
		primary: Type.Optional(NonEmptyString),
		fallbacks: Type.Optional(Type.Array(NonEmptyString))
	})),
	agentRuntime: Type.Optional(GatewayAgentRuntimeSchema),
	thinkingLevels: Type.Optional(Type.Array(GatewayThinkingLevelOptionSchema)),
	thinkingOptions: Type.Optional(Type.Array(NonEmptyString)),
	thinkingDefault: Type.Optional(NonEmptyString),
	defaultPermissionMode: Type.Optional(SessionPermissionModeSchema)
});
const AgentsListResultSchema = closedObject({
	...AgentsListPlacementProperties,
	defaultId: NonEmptyString,
	ownership: Type.Optional(AgentOwnershipSchema),
	selectionRequired: Type.Optional(Type.Boolean()),
	mainKey: NonEmptyString,
	scope: Type.Union([Type.Literal("per-sender"), Type.Literal("global")]),
	agents: Type.Array(AgentSummarySchema)
});
/** Creates a configured agent; the server supplies an omitted workspace. */
const AgentsCreateParamsSchema = closedObject({
	name: NonEmptyString,
	expectedOwnerId: Type.Optional(NonEmptyString),
	workspace: Type.Optional(NonEmptyString),
	model: Type.Optional(NonEmptyString),
	emoji: Type.Optional(Type.String()),
	avatar: Type.Optional(Type.String())
});
/** Result returned after creating an agent. */
const AgentsCreateResultSchema = closedObject({
	ok: Type.Literal(true),
	agentId: NonEmptyString,
	name: NonEmptyString,
	workspace: NonEmptyString,
	agentDir: Type.Optional(NonEmptyString),
	model: Type.Optional(NonEmptyString)
});
/** Updates mutable agent identity, workspace, and model fields; null clears the model override. */
const AgentsUpdateParamsSchema = closedObject({
	agentId: NonEmptyString,
	name: Type.Optional(NonEmptyString),
	workspace: Type.Optional(NonEmptyString),
	model: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	/** Exact catalog runtime for a model-only selection; native authentication stays with it. */
	agentRuntime: Type.Optional(NonEmptyString),
	emoji: Type.Optional(Type.String()),
	avatar: Type.Optional(Type.String())
});
/** Result returned after updating an agent. */
const AgentsUpdateResultSchema = closedObject({
	ok: Type.Literal(true),
	agentId: NonEmptyString
});
/** Deletes an agent and optionally its workspace/config files. */
const AgentsDeleteParamsSchema = closedObject({
	agentId: NonEmptyString,
	deleteFiles: Type.Optional(Type.Boolean())
});
/** Result returned after deleting an agent and unbinding sessions. */
const AgentsDeleteResultSchema = closedObject({
	ok: Type.Literal(true),
	agentId: NonEmptyString,
	removedBindings: Type.Integer({ minimum: 0 }),
	removed: Type.Optional(Type.Array(closedObject({
		path: NonEmptyString,
		method: Type.Union([Type.Literal("trash"), Type.Literal("missing")])
	}))),
	failed: Type.Optional(Type.Array(closedObject({
		path: NonEmptyString,
		reason: NonEmptyString
	}))),
	purgeFailed: Type.Optional(Type.Literal(true))
});
/** Reads model-provider credential health for one configured agent. */
const ModelsAuthStatusParamsSchema = closedObject({
	refresh: Type.Optional(Type.Boolean()),
	agentId: Type.Optional(Type.String())
});
/** Rebuilds Gateway auth state after a credential or selection mutation. */
const ModelsAuthRefreshParamsSchema = closedObject({
	operation: Type.Union([
		Type.Literal("login"),
		Type.Literal("logout"),
		Type.Literal("update")
	]),
	agentId: Type.Optional(Type.String())
});
/** Saves a model-provider API key without changing model selection. */
const ModelsAuthSetApiKeyParamsSchema = Type.Object({
	provider: Type.String({ pattern: "\\S" }),
	apiKey: Type.String({ pattern: "\\S" }),
	agentId: Type.Optional(Type.String())
}, { additionalProperties: true });
const ModelsAuthSetApiKeyResultSchema = closedObject({
	provider: NonEmptyString,
	profileId: NonEmptyString,
	warning: Type.Optional(Type.String())
});
/** Removes saved model-provider credentials from one configured agent. */
const ModelsAuthLogoutParamsSchema = closedObject({
	provider: NonEmptyString,
	profileIds: Type.Optional(Type.Array(NonEmptyString, { minItems: 1 })),
	credentialType: Type.Optional(Type.Literal("api_key")),
	agentId: Type.Optional(Type.String())
});
/** Sets or clears the preferred auth-profile order for one provider and agent. */
const ModelsAuthOrderSetParamsSchema = closedObject({
	provider: NonEmptyString,
	profileIds: Type.Optional(Type.Array(NonEmptyString, {
		minItems: 1,
		uniqueItems: true
	})),
	agentId: Type.Optional(Type.String())
});
/** Runs a bounded live credential probe for one model provider. */
const ModelsProbeParamsSchema = closedObject({
	provider: NonEmptyString,
	profileId: Type.Optional(NonEmptyString),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
	agentId: Type.Optional(Type.String())
});
const AuthProbeStatusSchema = Type.Union([
	Type.Literal("ok"),
	Type.Literal("auth"),
	Type.Literal("rate_limit"),
	Type.Literal("billing"),
	Type.Literal("timeout"),
	Type.Literal("format"),
	Type.Literal("unknown"),
	Type.Literal("no_model")
]);
/** Secret-free result for one provider credential target. */
const ModelsProbeTargetResultSchema = closedObject({
	profileId: Type.Optional(NonEmptyString),
	label: NonEmptyString,
	status: AuthProbeStatusSchema,
	latencyMs: Type.Optional(Type.Integer({ minimum: 0 })),
	error: Type.Optional(Type.String())
});
/** Provider-level live probe rollup plus per-credential results. */
const ModelsProbeResultSchema = closedObject({
	provider: NonEmptyString,
	status: AuthProbeStatusSchema,
	latencyMs: Type.Optional(Type.Integer({ minimum: 0 })),
	error: Type.Optional(Type.String()),
	results: Type.Array(ModelsProbeTargetResultSchema)
});
/** Reads installed skill status, optionally for a selected agent. */
const SkillsStatusParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	/** Refresh file-backed discovery before reporting status after an explicit local change. */
	refresh: Type.Optional(Type.Boolean())
});
/** Empty request payload for listing available skill bins. */
const SkillsBinsParamsSchema = closedObject({});
closedObject({ bins: Type.Array(NonEmptyString) });
const SkillUploadIdempotencyKeyString = Type.String({
	minLength: 1,
	maxLength: 2048
});
const SkillUploadDataBase64String = Type.String({
	minLength: 1,
	maxLength: 5592408
});
/** Starts a chunked skill archive upload. */
const SkillsUploadBeginParamsSchema = closedObject({
	kind: Type.Literal("skill-archive"),
	slug: NonEmptyString,
	sizeBytes: Type.Integer({ minimum: 1 }),
	sha256: Type.Optional(Sha256String),
	force: Type.Optional(Type.Boolean()),
	idempotencyKey: Type.Optional(SkillUploadIdempotencyKeyString)
});
/** Uploads one base64-encoded chunk for a skill archive. */
const SkillsUploadChunkParamsSchema = closedObject({
	uploadId: NonEmptyString,
	offset: Type.Integer({ minimum: 0 }),
	dataBase64: SkillUploadDataBase64String
});
/** Commits a completed skill archive upload. */
const SkillsUploadCommitParamsSchema = closedObject({
	uploadId: NonEmptyString,
	sha256: Type.Optional(Sha256String)
});
/**
* ClawHub resolves a bare slug against every publisher, so requests that carry only the slug
* fail with 409 AMBIGUOUS_SKILL_SLUG once two publishers share it. Clients send the reference
* `skills.search` returned for the entry the operator picked.
*/
const CLAWHUB_SKILL_REF_DESCRIPTION = "ClawHub skill reference: `@owner/slug`, `skills-sh:owner/repo/slug`, or a bare `slug` when no publisher is known.";
/** Installs a skill from legacy install id, ClawHub, or uploaded archive. */
const SkillsInstallParamsSchema = Type.Union([
	closedObject({
		agentId: Type.Optional(NonEmptyString),
		name: NonEmptyString,
		installId: NonEmptyString,
		dangerouslyForceUnsafeInstall: Type.Optional(Type.Boolean({
			deprecated: true,
			description: "Deprecated compatibility field. Current servers ignore it; install policy is controlled by security.installPolicy."
		})),
		timeoutMs: Type.Optional(Type.Integer({ minimum: 1e3 }))
	}),
	closedObject({
		agentId: Type.Optional(NonEmptyString),
		source: Type.Literal("clawhub"),
		slug: Type.String({
			minLength: 1,
			description: CLAWHUB_SKILL_REF_DESCRIPTION
		}),
		version: Type.Optional(NonEmptyString),
		force: Type.Optional(Type.Boolean()),
		timeoutMs: Type.Optional(Type.Integer({ minimum: 1e3 }))
	}),
	closedObject({
		agentId: Type.Optional(NonEmptyString),
		source: Type.Literal("upload"),
		uploadId: NonEmptyString,
		slug: NonEmptyString,
		force: Type.Optional(Type.Boolean()),
		sha256: Type.Optional(Sha256String),
		timeoutMs: Type.Optional(Type.Integer({ minimum: 1e3 }))
	})
]);
/** Updates installed skill settings or refreshes ClawHub-installed skills. */
const SkillsUpdateParamsSchema = Type.Union([closedObject({
	skillKey: NonEmptyString,
	enabled: Type.Optional(Type.Boolean()),
	apiKey: Type.Optional(Type.String()),
	env: Type.Optional(Type.Record(NonEmptyString, Type.String()))
}), closedObject({
	agentId: Type.Optional(NonEmptyString),
	source: Type.Literal("clawhub"),
	slug: Type.Optional(NonEmptyString),
	all: Type.Optional(Type.Boolean()),
	force: Type.Optional(Type.Boolean())
})]);
/** Reads registry detail for one skill. */
const SkillsDetailParamsSchema = closedObject({
	slug: Type.String({
		minLength: 1,
		description: CLAWHUB_SKILL_REF_DESCRIPTION
	}),
	version: Type.Optional(NonEmptyString)
});
/** Reads current security verdicts for configured skills. */
const SkillsSecurityVerdictsParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
/** Security verdict report for installed/requested skills. */
const SkillsSecurityVerdictsResultSchema = closedObject({
	schema: Type.Literal("openclaw.skills.security-verdicts.v1"),
	items: Type.Array(closedObject({
		registry: NonEmptyString,
		ok: Type.Boolean(),
		decision: NonEmptyString,
		reasons: Type.Array(Type.String()),
		requestedSlug: NonEmptyString,
		requestedOwnerHandle: Type.Optional(NonEmptyString),
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
		error: Type.Optional(closedObject({
			code: Type.Optional(Type.String()),
			message: Type.Optional(Type.String())
		}))
	}))
});
/** Reads the rendered skill card for one installed skill. */
const SkillsSkillCardParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	skillKey: NonEmptyString
});
/** Rendered skill card content and file metadata. */
const SkillsSkillCardResultSchema = closedObject({
	schema: Type.Literal("openclaw.skills.skill-card.v1"),
	skillKey: NonEmptyString,
	path: NonEmptyString,
	sizeBytes: Type.Integer({ minimum: 0 }),
	content: Type.String()
});
const SkillWorkshopChangeActionSchema = Type.Union([
	Type.Literal("create"),
	Type.Literal("patch"),
	Type.Literal("write_file"),
	Type.Literal("remove_file"),
	Type.Literal("archive"),
	Type.Literal("restore")
]);
const SkillWorkshopActorSchema = Type.Union([
	Type.Literal("agent"),
	Type.Literal("review"),
	Type.Literal("curator"),
	Type.Literal("user")
]);
const TimestampMsSchema = Type.Number({ minimum: 0 });
/** One applied Workshop change; `versionId` names the snapshot taken before it, for undo. */
const SkillWorkshopChangeSchema = closedObject({
	id: NonEmptyString,
	agentId: NonEmptyString,
	skillName: NonEmptyString,
	action: SkillWorkshopChangeActionSchema,
	actor: SkillWorkshopActorSchema,
	summary: Type.String(),
	versionId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	createdAtMs: TimestampMsSchema
});
/** Live Workshop skill with optional usage counters. */
const SkillWorkshopSkillSummarySchema = closedObject({
	name: NonEmptyString,
	description: Type.String(),
	updatedAtMs: TimestampMsSchema,
	sizeBytes: Type.Integer({ minimum: 0 }),
	files: Type.Array(NonEmptyString),
	useCount: Type.Optional(Type.Integer({ minimum: 0 })),
	lastUsedAtMs: Type.Optional(TimestampMsSchema)
});
/** Saved versions of one Workshop skill; `live: false` means the skill is archived. */
const SkillWorkshopArchivedSkillSchema = closedObject({
	name: NonEmptyString,
	live: Type.Boolean(),
	versions: Type.Array(closedObject({
		id: NonEmptyString,
		action: SkillWorkshopChangeActionSchema,
		createdAtMs: TimestampMsSchema
	}))
});
/** Lists the selected agent's Workshop skills and saved versions. */
const SkillsWorkshopListParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
const SkillsWorkshopListResultSchema = closedObject({
	agentId: NonEmptyString,
	mode: Type.Union([Type.Literal("off"), Type.Literal("auto")]),
	root: NonEmptyString,
	skills: Type.Array(SkillWorkshopSkillSummarySchema),
	archived: Type.Array(SkillWorkshopArchivedSkillSchema)
});
/** Pages the Workshop change feed newest first. */
const SkillsWorkshopChangesParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 500
	})),
	beforeMs: Type.Optional(TimestampMsSchema)
});
const SkillsWorkshopChangesResultSchema = closedObject({ changes: Type.Array(SkillWorkshopChangeSchema) });
/** Reads one file of a live Workshop skill, or of a saved version when `versionId` is set. */
const SkillsWorkshopReadParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	filePath: Type.Optional(NonEmptyString),
	versionId: Type.Optional(NonEmptyString)
});
const SkillsWorkshopReadResultSchema = closedObject({
	name: NonEmptyString,
	filePath: NonEmptyString,
	content: Type.String(),
	files: Type.Array(NonEmptyString)
});
/** Archives a live Workshop skill; the snapshot stays restorable. */
const SkillsWorkshopArchiveParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	reason: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 1e3
	}))
});
/** Restores a saved version (newest when omitted); the current live copy is versioned first. */
const SkillsWorkshopRestoreParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	versionId: Type.Optional(NonEmptyString)
});
const SkillsWorkshopChangeResultSchema = closedObject({ change: SkillWorkshopChangeSchema });
/** Reverts every skill change one background review made; `runId` is the review's run id. */
const SkillsWorkshopUndoParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	runId: NonEmptyString
});
/** `changes` holds this call's reverts; empty with `already-undone`. */
const SkillsWorkshopUndoResultSchema = closedObject({
	status: Type.Union([Type.Literal("undone"), Type.Literal("already-undone")]),
	changes: Type.Array(SkillWorkshopChangeSchema)
});
const GitHubIdentityScopeSchema = Type.Union([Type.Literal("system"), Type.Literal("agent")]);
const ToolsGitHubStatusParamsSchema = closedObject({
	agentId: NonEmptyString,
	selectedScope: GitHubIdentityScopeSchema
});
const GitHubIdentitySourceSchema = Type.Union([
	Type.Literal("system-detected"),
	Type.Literal("system-configured"),
	Type.Literal("agent-override")
]);
const GitHubAuthorValueSchema = Type.String({
	minLength: 1,
	pattern: "\\S"
});
const GitHubAuthorSchema = closedObject({
	name: Type.Optional(GitHubAuthorValueSchema),
	email: Type.Optional(GitHubAuthorValueSchema)
});
const GitHubIdentityFactsSchema = closedObject({
	stale: Type.Optional(Type.Boolean()),
	source: GitHubIdentitySourceSchema,
	credentialKind: Type.Union([
		Type.Literal("native"),
		Type.Literal("managed-pat"),
		Type.Literal("managed-oauth")
	]),
	credentialState: Type.Union([
		Type.Literal("available"),
		Type.Literal("unavailable"),
		Type.Literal("configured_unavailable"),
		Type.Literal("unverified"),
		Type.Literal("rate_limited")
	]),
	account: Type.Union([closedObject({ login: NonEmptyString }), Type.Null()]),
	gitAuthor: closedObject({
		name: Type.Union([Type.String(), Type.Null()]),
		email: Type.Union([Type.String(), Type.Null()])
	}),
	evidence: Type.Union([
		Type.Literal("github-api"),
		Type.Literal("none"),
		Type.Literal("unverified"),
		Type.Literal("rate-limited")
	]),
	accessExpiresAtMs: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
	refreshState: Type.Union([
		Type.Literal("not_applicable"),
		Type.Literal("available"),
		Type.Literal("expired"),
		Type.Literal("unavailable"),
		Type.Literal("refreshing"),
		Type.Literal("failed")
	]),
	oauthScopes: Type.Array(Type.String({
		minLength: 1,
		maxLength: 128,
		pattern: "\\S"
	}), { maxItems: 32 }),
	repositoryGrants: Type.Literal("unknown")
});
const GitHubSelectedIdentitySchema = closedObject({
	scope: GitHubIdentityScopeSchema,
	configured: Type.Boolean(),
	identity: Type.Union([GitHubIdentityFactsSchema, Type.Null()])
});
const ToolsGitHubStatusResultSchema = closedObject({
	agentId: NonEmptyString,
	selectedScope: GitHubIdentityScopeSchema,
	selected: GitHubSelectedIdentitySchema,
	effective: GitHubIdentityFactsSchema
});
const ToolsGitHubManagedConfigureParamsSchema = closedObject({
	scope: GitHubIdentityScopeSchema,
	agentId: NonEmptyString,
	mode: Type.Literal("managed"),
	secretName: GitHubSetupHandleSchema,
	gitAuthor: Type.Optional(GitHubAuthorSchema)
});
const ToolsGitHubInheritConfigureParamsSchema = closedObject({
	scope: GitHubIdentityScopeSchema,
	agentId: NonEmptyString,
	mode: Type.Literal("inherit")
});
const ToolsGitHubConfigureParamsSchema = Type.Union([ToolsGitHubManagedConfigureParamsSchema, ToolsGitHubInheritConfigureParamsSchema]);
const GitHubDeviceRequestIdSchema = Type.String({ pattern: "^github-device-[a-f0-9]{32}$" });
const ToolsGitHubAuthorizeStartParamsSchema = closedObject({
	scope: GitHubIdentityScopeSchema,
	agentId: NonEmptyString
});
const ToolsGitHubAuthorizeStartResultSchema = closedObject({
	requestId: GitHubDeviceRequestIdSchema,
	userCode: Type.String({ pattern: "^[A-Z0-9]{4}-[A-Z0-9]{4}$" }),
	verificationUri: Type.Literal("https://github.com/login/device"),
	expiresInMs: Type.Integer({
		minimum: 1,
		maximum: 9e5
	}),
	pollAfterMs: Type.Integer({
		minimum: 1e3,
		maximum: 6e4
	})
});
const ToolsGitHubAuthorizePollParamsSchema = closedObject({ requestId: GitHubDeviceRequestIdSchema });
const ToolsGitHubAuthorizePendingResultSchema = closedObject({
	status: Type.Literal("pending"),
	retryAfterMs: Type.Integer({
		minimum: 1,
		maximum: 6e4
	})
});
const ToolsGitHubAuthorizeSlowDownResultSchema = closedObject({
	status: Type.Literal("slow_down"),
	retryAfterMs: Type.Integer({
		minimum: 1,
		maximum: 6e4
	})
});
const ToolsGitHubAuthorizeAccessDeniedResultSchema = closedObject({ status: Type.Literal("access_denied") });
const ToolsGitHubAuthorizeExpiredResultSchema = closedObject({ status: Type.Literal("expired") });
const ToolsGitHubAuthorizeIncorrectDeviceCodeResultSchema = closedObject({ status: Type.Literal("incorrect_device_code") });
const ToolsGitHubAuthorizeNetworkErrorResultSchema = closedObject({
	status: Type.Literal("network_error"),
	retryAfterMs: Type.Integer({
		minimum: 1,
		maximum: 6e4
	})
});
const ToolsGitHubAuthorizeFailedResultSchema = closedObject({
	status: Type.Literal("failed"),
	reason: Type.Union([Type.Literal("identity_changed"), Type.Literal("setup_failed")])
});
const ToolsGitHubAuthorizeSuccessResultSchema = closedObject({
	status: Type.Literal("success"),
	githubStatus: ToolsGitHubStatusResultSchema
});
const ToolsGitHubAuthorizePollResultSchema = Type.Union([
	ToolsGitHubAuthorizePendingResultSchema,
	ToolsGitHubAuthorizeSlowDownResultSchema,
	ToolsGitHubAuthorizeAccessDeniedResultSchema,
	ToolsGitHubAuthorizeExpiredResultSchema,
	ToolsGitHubAuthorizeIncorrectDeviceCodeResultSchema,
	ToolsGitHubAuthorizeNetworkErrorResultSchema,
	ToolsGitHubAuthorizeFailedResultSchema,
	ToolsGitHubAuthorizeSuccessResultSchema
]);
const ToolsGitHubAuthorizeCancelParamsSchema = closedObject({ requestId: GitHubDeviceRequestIdSchema });
const ToolsGitHubAuthorizeCancelResultSchema = closedObject({ cancelled: Type.Boolean() });
/** Invokes one tool through the gateway tool dispatcher. */
const ToolsInvokeParamsSchema = closedObject({
	name: NonEmptyString,
	args: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	sessionKey: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	confirm: Type.Optional(Type.Boolean()),
	idempotencyKey: Type.Optional(NonEmptyString),
	/**
	* Explicit operation-local marker for an authenticated direct operator.
	* Missing values remain delegated, and agent runtime identity wins server-side.
	*/
	conversationReadOrigin: Type.Optional(Type.Literal("direct-operator"))
});
/** Normalized error shape for tool invocation failures. */
const ToolsInvokeErrorSchema = closedObject({
	code: NonEmptyString,
	message: NonEmptyString,
	details: Type.Optional(Type.Unknown())
});
closedObject({
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
});
//#endregion
//#region packages/gateway-protocol/src/schema/setup-inference.ts
const SystemAgentSetupAutoParamsSchema = closedObject({});
const SystemAgentSetupAutoCandidateSchema = closedObject({
	kind: Type.String(),
	label: Type.String(),
	detail: Type.String(),
	modelRef: Type.String(),
	brandId: Type.Optional(Type.String()),
	icon: Type.Optional(Type.String()),
	shared: Type.Optional(Type.Boolean())
});
const SystemAgentSetupAutoResultSchema = closedObject({
	status: Type.Union([
		Type.Literal("configured"),
		Type.Literal("activated"),
		Type.Literal("needs-sign-in"),
		Type.Literal("unavailable")
	]),
	selected: Type.Optional(SystemAgentSetupAutoCandidateSchema),
	alternatives: Type.Array(SystemAgentSetupAutoCandidateSchema),
	attempts: Type.Array(closedObject({
		kind: Type.String(),
		label: Type.String(),
		error: Type.String()
	})),
	signIn: Type.Optional(closedObject({
		authOptionId: Type.String(),
		label: Type.String()
	})),
	separateSignIn: Type.Optional(closedObject({
		authOptionId: Type.String(),
		label: Type.String()
	})),
	installedPlugins: Type.Array(Type.String())
});
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
const WizardRunStatusSchema = Type.Union([
	Type.Literal("running"),
	Type.Literal("done"),
	Type.Literal("cancelled"),
	Type.Literal("error")
]);
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
const WizardNextResultSchema = closedObject(WizardResultFields);
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
	stale: Type.Optional(Type.Boolean()),
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
export { UsersSelectModelAccountParamsSchema as $, SecretsStoreListParamsSchema as $n, SkillWorkshopSkillSummarySchema as $t, UsersLinkChannelIdentityParamsSchema as A, ToolsGitHubAuthorizePendingResultSchema as An, AgentsCreateResultSchema as At, UsersListParamsSchema as B, ToolsGitHubStatusParamsSchema as Bn, GitHubIdentitySourceSchema as Bt, UsersGitHubAuthorizeStartResultSchema as C, ToolsGitHubAuthorizeAccessDeniedResultSchema as Cn, SetupInferenceActivationRejectionSchema as Ct, UsersGitHubStatusResultSchema as D, ToolsGitHubAuthorizeFailedResultSchema as Dn, SystemAgentSetupAutoResultSchema as Dt, UsersGitHubStatusParamsSchema as E, ToolsGitHubAuthorizeExpiredResultSchema as En, SystemAgentSetupAutoParamsSchema as Et, UsersListAuthLinksResultSchema as F, ToolsGitHubAuthorizeStartResultSchema as Fn, AgentsUpdateResultSchema as Ft, UsersPersonalFileGetResultSchema as G, SecretStoreEntrySchema as Gn, ModelsAuthSetApiKeyParamsSchema as Gt, UsersMergeParamsSchema as H, ToolsInvokeParamsSchema as Hn, ModelsAuthLogoutParamsSchema as Ht, UsersListChannelIdentitiesParamsSchema as I, ToolsGitHubAuthorizeSuccessResultSchema as In, AuthProbeStatusSchema as It, UsersPrefsChangedEventSchema as J, SecretsResolveParamsSchema as Jn, ModelsProbeParamsSchema as Jt, UsersPersonalFileSetParamsSchema as K, SecretStoreEnvEntrySchema as Kn, ModelsAuthSetApiKeyResultSchema as Kt, UsersListChannelIdentitiesResultSchema as L, ToolsGitHubConfigureParamsSchema as Ln, GitHubAuthorSchema as Lt, UsersLinkEmailParamsSchema as M, ToolsGitHubAuthorizePollResultSchema as Mn, AgentsDeleteResultSchema as Mt, UsersLinkEmailResultSchema as N, ToolsGitHubAuthorizeSlowDownResultSchema as Nn, AgentsListResultSchema as Nt, UsersLinkAuthProfileParamsSchema as O, ToolsGitHubAuthorizeIncorrectDeviceCodeResultSchema as On, AgentSummarySchema as Ot, UsersListAuthLinksParamsSchema as P, ToolsGitHubAuthorizeStartParamsSchema as Pn, AgentsUpdateParamsSchema as Pt, UsersPrefsSetResultSchema as Q, SecretsStoreImportParamsSchema as Qn, SkillWorkshopChangeSchema as Qt, UsersListModelAccountsParamsSchema as R, ToolsGitHubInheritConfigureParamsSchema as Rn, GitHubIdentityFactsSchema as Rt, UsersGitHubAuthorizeStartParamsSchema as S, SkillsWorkshopUndoResultSchema as Sn, WizardStepSchema as St, UsersGitHubDisconnectResultSchema as T, ToolsGitHubAuthorizeCancelResultSchema as Tn, SystemAgentSetupAutoCandidateSchema as Tt, UsersMergeResultSchema as U, ChatAccountSelectionSchema as Un, ModelsAuthOrderSetParamsSchema as Ut, UsersListResultSchema as V, ToolsGitHubStatusResultSchema as Vn, GitHubSelectedIdentitySchema as Vt, UsersPersonalFileGetParamsSchema as W, ModelAuthProfileIdSchema as Wn, ModelsAuthRefreshParamsSchema as Wt, UsersPrefsGetResultSchema as X, SecretsStoreAllowedHostsParamsSchema as Xn, ModelsProbeTargetResultSchema as Xt, UsersPrefsGetParamsSchema as Y, SecretsResolveResultSchema as Yn, ModelsProbeResultSchema as Yt, UsersPrefsSetParamsSchema as Z, SecretsStoreDeleteParamsSchema as Zn, SkillWorkshopArchivedSkillSchema as Zt, UsersAuthConnectStatusResultSchema as _, SkillsWorkshopListResultSchema as _n, WizardNextResultSchema as _t, UserChannelIdentitySchema as a, SkillsSkillCardParamsSchema as an, GatewayContextWindowOptionSchema as ar, UsersSetDisplayNameParamsSchema as at, UsersGitHubAuthorizePollParamsSchema as b, SkillsWorkshopRestoreParamsSchema as bn, WizardStatusParamsSchema as bt, UserProfileSchema as c, SkillsUpdateParamsSchema as cn, UsersSetRoleResultSchema as ct, UsersAuthConnectCatalogParamsSchema as d, SkillsUploadCommitParamsSchema as dn, UsersUnlinkChannelIdentityParamsSchema as dt, SkillsBinsParamsSchema as en, SecretsStoreListResultSchema as er, UsersSelectModelAccountResultSchema as et, UsersAuthConnectCatalogResultSchema as f, SkillsWorkshopArchiveParamsSchema as fn, UsersUnlinkChannelIdentityResultSchema as ft, UsersAuthConnectStatusParamsSchema as g, SkillsWorkshopListParamsSchema as gn, WizardNextParamsSchema as gt, UsersAuthConnectStartResultSchema as h, SkillsWorkshopChangesResultSchema as hn, WizardCancelParamsSchema as ht, UserChannelIdentityLinkSchema as i, SkillsSecurityVerdictsResultSchema as in, GatewayCompletionRouteSchema as ir, UsersSetAvatarResultSchema as it, UsersLinkChannelIdentityResultSchema as j, ToolsGitHubAuthorizePollParamsSchema as jn, AgentsDeleteParamsSchema as jt, UsersLinkAuthProfileResultSchema as k, ToolsGitHubAuthorizeNetworkErrorResultSchema as kn, AgentsCreateParamsSchema as kt, UsersAuthConnectAnswerParamsSchema as l, SkillsUploadBeginParamsSchema as ln, UsersUnlinkAuthProfileParamsSchema as lt, UsersAuthConnectStartParamsSchema as m, SkillsWorkshopChangesParamsSchema as mn, WizardAnswerSchema as mt, PersonalGitHubGenerationSchema as n, SkillsInstallParamsSchema as nn, SecretsStoreSetParamsSchema as nr, UsersSelfResultSchema as nt, UserModelAccountSchema as o, SkillsSkillCardResultSchema as on, GatewayThinkingLevelOptionSchema as or, UsersSetDisplayNameResultSchema as ot, UsersAuthConnectResultSchema as p, SkillsWorkshopChangeResultSchema as pn, McpAuthLoginParamsSchema as pt, UsersPersonalFileSetResultSchema as q, SecretStoreSecretEntrySchema as qn, ModelsAuthStatusParamsSchema as qt, PersonalGitHubStatusSchema as r, SkillsSecurityVerdictsParamsSchema as rn, GatewayAgentRuntimeSchema as rr, UsersSetAvatarParamsSchema as rt, UserProfileAuthLinkSchema as s, SkillsStatusParamsSchema as sn, AgentsListParamsSchema as sr, UsersSetRoleParamsSchema as st, PersonalGitHubAccountSchema as t, SkillsDetailParamsSchema as tn, SecretsStoreMutationResultSchema as tr, UsersSelfParamsSchema as tt, UsersAuthConnectCancelParamsSchema as u, SkillsUploadChunkParamsSchema as un, UsersUnlinkAuthProfileResultSchema as ut, UsersGitHubAuthorizeCancelParamsSchema as v, SkillsWorkshopReadParamsSchema as vn, WizardStartParamsSchema as vt, UsersGitHubDisconnectParamsSchema as w, ToolsGitHubAuthorizeCancelParamsSchema as wn, SetupInferenceFailureStatusSchema as wt, UsersGitHubAuthorizePollResultSchema as x, SkillsWorkshopUndoParamsSchema as xn, WizardStatusResultSchema as xt, UsersGitHubAuthorizeCancelResultSchema as y, SkillsWorkshopReadResultSchema as yn, WizardStartResultSchema as yt, UsersListModelAccountsResultSchema as z, ToolsGitHubManagedConfigureParamsSchema as zn, GitHubIdentityScopeSchema as zt };
