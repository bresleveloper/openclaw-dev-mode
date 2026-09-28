import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { nt as withSince } from "./worker-admission-BB3C4gz4.mjs";
import { a as NonEmptyString } from "./primitives-C-2-W5SF.mjs";
import { i as SessionPermissionModeSchema } from "./sessions-row-CU6LvmZ_.mjs";
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
const EnvironmentTrustSchema = Type.String({ enum: ["persistent", "disposable"] });
/** Operational desktop state reported by the current native node connection. */
const DesktopAvailabilitySchema = closedObject({ state: Type.Union([
	Type.Literal("locked"),
	Type.Literal("unlocked"),
	Type.Literal("unknown")
]) });
/** Durable lifecycle states for plugin-provisioned worker environments. */
const WorkerEnvironmentStateSchema = Type.Union([
	Type.Literal("requested"),
	Type.Literal("provisioning"),
	Type.Literal("bootstrapping"),
	Type.Literal("ready"),
	Type.Literal("attached"),
	Type.Literal("idle"),
	Type.Literal("draining"),
	Type.Literal("destroying"),
	Type.Literal("destroyed"),
	Type.Literal("failed"),
	Type.Literal("orphaned")
]);
/** Process-local SSH tunnel connectivity for a worker environment. */
const WorkerTunnelStatusSchema = Type.Union([
	Type.Literal("stopped"),
	Type.Literal("connecting"),
	Type.Literal("connected"),
	Type.Literal("reconnecting")
]);
/** Closed app ids a worker desktop may advertise and launch. */
const WorkerDesktopAppIdSchema = Type.Union([Type.Literal("browser"), Type.Literal("terminal")]);
/** Actionable issue attached only to runtime targets that need operator intervention. */
const RuntimeTargetIssueSchema = closedObject({
	code: Type.Literal("update-required"),
	action: Type.Literal("update-and-reconnect"),
	updateCommand: Type.Literal("openclaw update"),
	headlessReconnectCommand: Type.Literal("openclaw node restart")
});
const NodeWorkerBundleStatusSchema = Type.Union([closedObject({
	status: Type.Literal("installed"),
	version: NonEmptyString
}), closedObject({ status: Type.Literal("missing") })]);
/** Bounded live worker slots advertised by a connected node host. */
const WorkerSlotSummarySchema = Type.Refine(closedObject({
	total: Type.Integer({
		minimum: 1,
		maximum: 1024
	}),
	available: Type.Integer({
		minimum: 0,
		maximum: 1024
	})
}), (slots) => slots.available <= slots.total, (slots) => `available worker slots ${slots.available} exceed total ${slots.total}`);
/** Gateway-owned authority state for one runtime-required node command. */
const RequiredNodeCommandStateSchema = Type.Union([
	Type.Literal("invocable"),
	Type.Literal("pending-approval"),
	Type.Literal("undeclared"),
	Type.Literal("unauthorized")
]);
const RequiredNodeCommandSchema = closedObject({
	command: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	state: RequiredNodeCommandStateSchema
});
/** Worker-only lifecycle metadata layered onto the existing environment projection. */
const WorkerEnvironmentMetadataSchema = closedObject({
	profileId: Type.Optional(NonEmptyString),
	providerId: NonEmptyString,
	leaseId: Type.Optional(NonEmptyString),
	state: WorkerEnvironmentStateSchema,
	ageMs: Type.Integer({ minimum: 0 }),
	idleMs: Type.Optional(Type.Integer({ minimum: 0 })),
	attachedSessionIds: Type.Array(NonEmptyString),
	tunnelStatus: WorkerTunnelStatusSchema,
	error: Type.Optional(NonEmptyString),
	desktop: Type.Optional(Type.Boolean()),
	desktopApps: Type.Optional(Type.Array(WorkerDesktopAppIdSchema, {
		maxItems: 8,
		uniqueItems: true
	}))
});
function createEnvironmentSummaryProperties() {
	return {
		id: NonEmptyString,
		type: NonEmptyString,
		label: Type.Optional(NonEmptyString),
		status: EnvironmentStatusSchema,
		platform: Type.Optional(NonEmptyString),
		sessionHost: Type.Optional(Type.Boolean()),
		workerSlots: Type.Optional(WorkerSlotSummarySchema),
		workerBundle: Type.Optional(NodeWorkerBundleStatusSchema),
		lastConnectedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
		lastDisconnectedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
		lastSeenAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
		lastSeenReason: Type.Optional(NonEmptyString),
		trust: Type.Optional(EnvironmentTrustSchema),
		capabilities: Type.Optional(Type.Array(NonEmptyString)),
		invocableCommands: Type.Optional(Type.Array(Type.String({
			minLength: 1,
			maxLength: 128
		}), {
			maxItems: 128,
			uniqueItems: true
		})),
		desktop: Type.Optional(Type.Boolean()),
		desktopAvailability: Type.Optional(DesktopAvailabilitySchema),
		issues: Type.Optional(Type.Array(RuntimeTargetIssueSchema, {
			minItems: 1,
			maxItems: 8
		})),
		worker: Type.Optional(WorkerEnvironmentMetadataSchema),
		preparation: Type.Optional(closedObject({
			purpose: Type.Union([Type.Literal("reserve"), Type.Literal("build")]),
			key: NonEmptyString
		}))
	};
}
function createEnvironmentSummarySchema() {
	return closedObject(createEnvironmentSummaryProperties());
}
/** Public environment summary shown in listings and status responses. */
const EnvironmentSummarySchema = closedObject({
	...createEnvironmentSummaryProperties(),
	requiredNodeCommand: Type.Optional(RequiredNodeCommandSchema),
	desktopSetup: Type.Optional(closedObject({
		state: Type.Union([
			Type.Literal("ready"),
			Type.Literal("needs-server"),
			Type.Literal("unsupported"),
			Type.Literal("managed")
		]),
		detail: Type.Optional(NonEmptyString)
	}))
});
/** Optional runtime scope or profile-only projection for environment discovery. */
const EnvironmentsListParamsSchema = closedObject({
	runtimeId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	projection: Type.Optional(Type.Literal("profiles")),
	includeDesktopSetup: Type.Optional(Type.Boolean())
});
/** Provider-authored machine choice for one configured worker profile. */
const WorkerMachineOptionSchema = closedObject({
	id: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	label: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	cpu: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 65536
	})),
	memoryGb: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 65536
	})),
	default: Type.Optional(Type.Boolean()),
	os: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 64
	}))
});
const WorkerMachineOptionsSchema = Type.Array(WorkerMachineOptionSchema, {
	minItems: 1,
	maxItems: 64
});
/** Provider-authored operating system choice for one configured worker profile. */
const WorkerOperatingSystemSchema = closedObject({
	id: Type.String({
		minLength: 1,
		maxLength: 64
	}),
	label: Type.String({
		minLength: 1,
		maxLength: 64
	}),
	default: Type.Optional(Type.Boolean()),
	disabledReason: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	}))
});
/** Placement execution modes shared by runtime requirements and worker providers. */
const WorkerExecutionModeSchema = Type.Union([Type.Literal("worker-turn"), Type.Literal("remote-exec")]);
/** Configured worker target exposed without provider settings or credentials. */
const WorkerEnvironmentProfileSummarySchema = closedObject({
	id: NonEmptyString,
	providerId: NonEmptyString,
	providerDisplayId: Type.Optional(Type.String({
		pattern: "^[a-z][a-z0-9-]{0,63}(?![\\s\\S])",
		maxLength: 64
	})),
	trust: Type.Optional(EnvironmentTrustSchema),
	executionMode: Type.Optional(WorkerExecutionModeSchema),
	executionModes: Type.Optional(Type.Union([Type.Tuple([WorkerExecutionModeSchema]), Type.Tuple([Type.Literal("worker-turn"), Type.Literal("remote-exec")])])),
	machines: Type.Optional(WorkerMachineOptionsSchema),
	operatingSystems: Type.Optional(Type.Array(WorkerOperatingSystemSchema, {
		minItems: 1,
		maxItems: 8
	}))
});
/** Profile-only requests leave environments empty without reading inventory. */
const EnvironmentsListResultSchema = closedObject({
	environments: Type.Array(EnvironmentSummarySchema),
	profiles: Type.Optional(Type.Array(WorkerEnvironmentProfileSummarySchema))
});
/** Status lookup request for one environment id. */
const EnvironmentsStatusParamsSchema = closedObject({ environmentId: NonEmptyString });
/** Status lookup result for one environment id. */
const EnvironmentsStatusResultSchema = createEnvironmentSummarySchema();
/** Creates a worker environment from one configured provider profile. */
const EnvironmentsCreateParamsSchema = closedObject({
	profileId: NonEmptyString,
	idempotencyKey: NonEmptyString
});
/** Create result uses the same public summary shape as list and status. */
const EnvironmentsCreateResultSchema = createEnvironmentSummarySchema();
/** Prepares a configured profile's local Git project without dispatching a session. */
const EnvironmentsPrepareParamsSchema = closedObject({
	profileId: NonEmptyString,
	projectPath: NonEmptyString
});
const EnvironmentsPrepareResultSchema = closedObject({
	environmentId: NonEmptyString,
	preparationKey: NonEmptyString,
	reused: Type.Boolean()
});
/** Destroys one durable worker environment by its gateway-owned id. */
const EnvironmentsDestroyParamsSchema = closedObject({
	environmentId: NonEmptyString,
	force: Type.Optional(Type.Boolean())
});
/** Destroy result exposes the terminal worker lifecycle state. */
const EnvironmentsDestroyResultSchema = createEnvironmentSummarySchema();
const WorkerDesktopObserveParamsSchema = closedObject({
	environmentId: NonEmptyString,
	control: Type.Optional(Type.Boolean())
});
const WorkerDesktopObserveResultSchema = closedObject({
	transport: Type.String({ enum: ["rfb"] }),
	wsPath: NonEmptyString,
	expiresAtMs: Type.Integer({ minimum: 0 }),
	control: Type.Boolean(),
	canResize: Type.Optional(Type.Boolean()),
	vncPassword: Type.Optional(NonEmptyString)
});
const WorkerDesktopLaunchParamsSchema = closedObject({
	environmentId: NonEmptyString,
	app: WorkerDesktopAppIdSchema
});
const WorkerDesktopLaunchResultSchema = closedObject({
	app: WorkerDesktopAppIdSchema,
	status: Type.Literal("ready")
});
//#endregion
//#region packages/gateway-protocol/src/schema/model-runtime-options.ts
const GatewayAgentRuntimeSchema = closedObject({
	id: NonEmptyString,
	fallback: Type.Optional(Type.Union([Type.Literal("openclaw"), Type.Literal("none")])),
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
/** Empty request payload for listing the team secret store. */
const SecretsStoreListParamsSchema = closedObject({});
/** Team secret-store inventory. */
const SecretsStoreListResultSchema = closedObject({ entries: Type.Array(SecretStoreEntrySchema) });
/** Create or replace one team secret-store entry. */
const SecretsStoreSetParamsSchema = closedObject({
	name: SecretStoreMutationNameSchema,
	value: Type.String({ maxLength: 65536 }),
	kind: Type.Union([Type.Literal("secret"), Type.Literal("env")]),
	allowedHosts: Type.Optional(withSince("2026.8", SecretStoreAllowedHostsSchema))
});
/** Soft-delete one team secret-store entry. */
const SecretsStoreDeleteParamsSchema = closedObject({ name: SecretStoreMutationNameSchema });
/** Mutation acknowledgement including whether the active runtime was refreshed. */
const SecretsStoreMutationResultSchema = closedObject({
	ok: Type.Literal(true),
	reloaded: Type.Boolean(),
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
//#region packages/gateway-protocol/src/schema/agents-models-skills.ts
/**
* Agent, model, skill, and effective tool schemas.
*
* These contracts back dashboard selectors, agent management, model catalogs,
* skill upload/install flows, skill workshop proposals, and effective tool
* discovery. Keep public request/result schemas documented because they are
* shared by gateway RPC, CLI, and UI clients.
*/
/** Semantic owner of an agent roster entry. */
const AgentKindSchema = Type.Union([Type.Literal("agent"), Type.Literal("system")]);
const AgentCreatedViaSchema = Type.Union([
	Type.Literal("operator"),
	Type.Literal("agent"),
	Type.Literal("claw")
]);
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
/** Empty request payload for listing configured agents. */
const AgentsListParamsSchema = closedObject({});
const AgentOwnershipSchema = Type.Union([
	Type.Literal("sole"),
	Type.Literal("legacy"),
	Type.Literal("explicit")
]);
const AgentsListResultSchema = closedObject({
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
const Sha256String = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-fA-F0-9]{64}$"
});
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
const AgentsFilesSetParamsSchema = closedObject({
	agentId: NonEmptyString,
	name: NonEmptyString,
	content: Type.String(),
	expectedHash: Type.Optional(Sha256String)
});
/** Result returned after writing an editable agent file. */
const AgentsFilesSetResultSchema = closedObject({
	ok: Type.Literal(true),
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	file: AgentsFileEntrySchema
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
	sessionKey: Type.Optional(NonEmptyString)
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
/** Wire copy of the core trust state; this package intentionally depends on typebox only. */
const CLAWHUB_SKILLS_SH_TRUST_STATE_VALUE = "not-scanned-by-clawhub";
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
/** Searches the skill registry. */
const SkillsSearchParamsSchema = closedObject({
	query: Type.Optional(NonEmptyString),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	}))
});
/** Ranked skill registry search results. */
const SkillsSearchResultSchema = closedObject({ results: Type.Array(closedObject({
	score: Type.Number(),
	slug: NonEmptyString,
	registry: NonEmptyString,
	ownerHandle: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	installRef: Type.String({
		minLength: 1,
		description: "Source-qualified reference for this result. Send it as `slug` to skills.install; several publishers can share one slug."
	}),
	installOnly: Type.Optional(Type.Literal(true, { description: "Present when ClawHub serves this result install-only: offer install directly with `installRef`, because skills.detail cannot answer for it. Absence means the ordinary review-then-install flow, so results from servers that predate this field keep their existing behavior." })),
	trustState: Type.Optional(Type.Literal(CLAWHUB_SKILLS_SH_TRUST_STATE_VALUE, { description: "Present when ClawHub resolves this result from a source it has not scanned." })),
	displayName: NonEmptyString,
	summary: Type.Optional(Type.String()),
	icon: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	version: Type.Optional(NonEmptyString),
	updatedAt: Type.Optional(Type.Integer())
})) });
/** Reads registry detail for one skill. */
const SkillsDetailParamsSchema = closedObject({ slug: Type.String({
	minLength: 1,
	description: CLAWHUB_SKILL_REF_DESCRIPTION
}) });
/** Reads current security verdicts for configured skills. */
const SkillsSecurityVerdictsParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
/** Skill registry detail, latest version, metadata, and owner info. */
const SkillsDetailResultSchema = closedObject({
	skill: Type.Union([closedObject({
		slug: NonEmptyString,
		displayName: NonEmptyString,
		summary: Type.Optional(Type.String()),
		icon: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		tags: Type.Optional(Type.Record(NonEmptyString, Type.String())),
		channel: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		isOfficial: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
		createdAt: Type.Integer(),
		updatedAt: Type.Integer()
	}), Type.Null()]),
	latestVersion: Type.Optional(Type.Union([closedObject({
		version: NonEmptyString,
		createdAt: Type.Integer(),
		changelog: Type.Optional(Type.String())
	}), Type.Null()])),
	metadata: Type.Optional(Type.Union([closedObject({
		os: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
		systems: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()]))
	}), Type.Null()])),
	owner: Type.Optional(Type.Union([closedObject({
		handle: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
		displayName: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
		image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		official: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
		channel: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		isOfficial: Type.Optional(Type.Union([Type.Boolean(), Type.Null()]))
	}), Type.Null()]))
});
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
const SkillProposalSupportFileInputSchema = closedObject({
	path: NonEmptyString,
	content: Type.String({ maxLength: 262144 })
});
/** Stored support file metadata, including target conflict hashes for updates. */
const SkillProposalSupportFileSchema = closedObject({
	path: NonEmptyString,
	sizeBytes: Type.Integer({
		minimum: 0,
		maximum: 262144
	}),
	hash: Sha256String,
	targetExisted: Type.Optional(Type.Boolean()),
	targetContentHash: Type.Optional(Sha256String)
});
/** One static-scan finding against proposed skill content. */
const SkillProposalFindingSchema = closedObject({
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
});
/** Aggregated scan report attached to a proposal record. */
const SkillProposalScanSchema = closedObject({
	state: SkillProposalScanStateSchema,
	scannedAt: NonEmptyString,
	critical: Type.Integer({ minimum: 0 }),
	warn: Type.Integer({ minimum: 0 }),
	info: Type.Integer({ minimum: 0 }),
	findings: Type.Array(SkillProposalFindingSchema)
});
/** Skill file target that a proposal creates or updates. */
const SkillProposalTargetSchema = closedObject({
	skillName: NonEmptyString,
	skillKey: NonEmptyString,
	skillDir: NonEmptyString,
	skillFile: NonEmptyString,
	source: Type.Optional(NonEmptyString),
	currentContentHash: Type.Optional(NonEmptyString)
});
/** Optional runtime origin tying a proposal back to an agent turn. */
const SkillProposalOriginSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	messageId: Type.Optional(NonEmptyString)
});
const SkillProposalEvaluationFindingSchema = closedObject({
	ruleId: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	severity: Type.Union([
		Type.Literal("info"),
		Type.Literal("warn"),
		Type.Literal("critical")
	]),
	message: Type.String({
		minLength: 1,
		maxLength: 4e3
	}),
	file: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 1024
	})),
	line: Type.Optional(Type.Integer({ minimum: 1 }))
});
const SkillProposalEvaluationResultSchema = closedObject({
	summary: Type.Optional(Type.String({ maxLength: 8e3 })),
	findings: Type.Optional(Type.Array(SkillProposalEvaluationFindingSchema, { maxItems: 200 })),
	metrics: Type.Optional(Type.Record(Type.String(), Type.Union([
		Type.String({ maxLength: 4e3 }),
		Type.Number(),
		Type.Boolean()
	]), {
		maxProperties: 64,
		propertyNames: Type.String({
			minLength: 1,
			maxLength: 128
		})
	})),
	evaluatorVersion: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	mode: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	decision: Type.Optional(Type.Union([
		Type.Literal("pass"),
		Type.Literal("revise"),
		Type.Literal("block")
	])),
	decisionReason: Type.Optional(Type.String({ maxLength: 2e3 }))
});
const SkillProposalEvaluationOutcomeAttribution = {
	pluginId: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	pluginVersion: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	evaluatorId: Type.String({
		minLength: 1,
		maxLength: 128
	})
};
const SkillProposalEvaluationOutcomeSchema = Type.Union([
	closedObject({
		...SkillProposalEvaluationOutcomeAttribution,
		status: Type.Literal("completed"),
		result: SkillProposalEvaluationResultSchema
	}),
	closedObject({
		...SkillProposalEvaluationOutcomeAttribution,
		status: Type.Literal("skipped")
	}),
	closedObject({
		...SkillProposalEvaluationOutcomeAttribution,
		status: Type.Literal("error"),
		error: Type.String({
			minLength: 1,
			maxLength: 2e3
		})
	})
]);
/** Latest completed evaluator run attached to a proposal record. */
const SkillProposalEvaluationSchema = closedObject({
	id: NonEmptyString,
	proposedVersion: NonEmptyString,
	revisionHash: Sha256String,
	trigger: Type.Union([Type.Literal("manual"), Type.Literal("apply")]),
	startedAt: NonEmptyString,
	completedAt: NonEmptyString,
	correlationId: Type.Optional(NonEmptyString),
	targetTreeSha256: Type.Optional(Sha256String),
	outcomes: Type.Array(SkillProposalEvaluationOutcomeSchema, { maxItems: 64 })
});
/** Full persisted skill proposal record. */
const SkillProposalRecordSchema = closedObject({
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
	statusReason: Type.Optional(Type.String()),
	evaluation: Type.Optional(SkillProposalEvaluationSchema)
});
/** Condensed proposal manifest entry for list views. */
const SkillProposalManifestEntrySchema = closedObject({
	id: NonEmptyString,
	kind: SkillProposalKindSchema,
	status: SkillProposalStatusSchema,
	title: NonEmptyString,
	description: NonEmptyString,
	skillName: NonEmptyString,
	skillKey: NonEmptyString,
	createdAt: NonEmptyString,
	updatedAt: NonEmptyString,
	scanState: SkillProposalScanStateSchema,
	revisionHash: Type.Optional(Sha256String),
	degradedState: Type.Optional(Type.Literal("draft-missing"))
});
/** Lists skill-workshop proposals for the selected agent scope. */
const SkillsProposalsListParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
/** Proposal manifest response for dashboard/workshop list views. */
const SkillsProposalsListResultSchema = closedObject({
	schema: Type.Literal("openclaw.skill-workshop.proposals-manifest.v1"),
	updatedAt: NonEmptyString,
	proposals: Type.Array(SkillProposalManifestEntrySchema),
	installedSkills: Type.Array(closedObject({
		name: NonEmptyString,
		skillKey: NonEmptyString,
		description: Type.String()
	}))
});
/** Reads the current agent-owned Workshop skill, independently of its proposal history. */
const SkillsWorkshopReadParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	name: NonEmptyString
});
const SkillsWorkshopReadResultSchema = closedObject({
	name: NonEmptyString,
	skillKey: NonEmptyString,
	description: Type.String(),
	content: Type.String()
});
/** Reads a proposal record plus editable draft/support content. */
const SkillsProposalInspectParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString
});
/** Full proposal inspection result used before apply/revise decisions. */
const SkillsProposalInspectResultSchema = closedObject({
	record: SkillProposalRecordSchema,
	revisionHash: Type.Optional(Sha256String),
	content: Type.String(),
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 }))
});
/** Creates a proposal for a new skill. */
const SkillsProposalCreateParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	description: NonEmptyString,
	content: SkillProposalContentString,
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
	goal: Type.Optional(Type.String()),
	evidence: Type.Optional(Type.String())
});
/** Creates a proposal to update an existing skill. */
const SkillsProposalUpdateParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	skillName: NonEmptyString,
	description: Type.Optional(NonEmptyString),
	content: SkillProposalContentString,
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
	goal: Type.Optional(Type.String()),
	evidence: Type.Optional(Type.String())
});
/** Replaces draft content/support files for an existing proposal. */
const SkillsProposalReviseParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString,
	expectedRevisionHash: Type.Optional(Sha256String),
	correlationId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	content: Type.Optional(SkillProposalContentString),
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
	description: Type.Optional(NonEmptyString),
	goal: Type.Optional(Type.String()),
	evidence: Type.Optional(Type.String())
});
/** Starts an agent turn that revises a pending proposal from natural-language instructions. */
const SkillsProposalRequestRevisionParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	targetAgentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString,
	expectedRevisionHash: Sha256String,
	instructions: Type.String({
		minLength: 1,
		maxLength: 32768
	}),
	sessionKey: NonEmptyString,
	sessionId: Type.Optional(NonEmptyString),
	idempotencyKey: NonEmptyString
});
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
/** Apply/reject payload bound to the exact proposal revision reviewed by the operator. */
const SkillsProposalDecisionParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString,
	expectedRevisionHash: Sha256String,
	correlationId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	reason: Type.Optional(Type.String())
});
/** Quarantine payload with optional optimistic-concurrency evidence. */
const SkillsProposalActionParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString,
	expectedRevisionHash: Type.Optional(Sha256String),
	correlationId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	reason: Type.Optional(Type.String())
});
/** Runs configured proposal evaluators against the current draft. */
const SkillsProposalEvaluateParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString,
	expectedRevisionHash: Type.Optional(Sha256String),
	correlationId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	}))
});
/** Updated proposal record and completed evaluator run returned by manual evaluation. */
const SkillsProposalEvaluateResultSchema = closedObject({
	record: SkillProposalRecordSchema,
	evaluation: SkillProposalEvaluationSchema
});
const SkillProposalLifecycleEventTypeSchema = Type.Union([
	Type.Literal("created"),
	Type.Literal("revised"),
	Type.Literal("evaluation_completed"),
	Type.Literal("applied"),
	Type.Literal("rejected"),
	Type.Literal("quarantined"),
	Type.Literal("stale")
]);
const SkillProposalLifecycleEventActorSchema = closedObject({
	type: Type.Union([
		Type.Literal("agent"),
		Type.Literal("gateway"),
		Type.Literal("plugin"),
		Type.Literal("system")
	]),
	id: Type.Optional(NonEmptyString)
});
const SkillProposalLifecycleEventPayloadSchema = Type.Record(Type.String(), Type.Union([
	Type.String({ maxLength: 4e3 }),
	Type.Number(),
	Type.Boolean(),
	Type.Null()
]), {
	maxProperties: 32,
	propertyNames: Type.String({
		minLength: 1,
		maxLength: 80
	})
});
/** Durable Skill Workshop lifecycle event returned for replay. */
const SkillProposalLifecycleEventSchema = closedObject({
	sequence: Type.Integer({ minimum: 1 }),
	eventId: NonEmptyString,
	proposalId: NonEmptyString,
	proposedVersion: NonEmptyString,
	revisionHash: Sha256String,
	type: SkillProposalLifecycleEventTypeSchema,
	occurredAt: NonEmptyString,
	actor: SkillProposalLifecycleEventActorSchema,
	correlationId: Type.Optional(NonEmptyString),
	payload: Type.Optional(SkillProposalLifecycleEventPayloadSchema),
	evaluation: Type.Optional(SkillProposalEvaluationSchema)
});
/** Lists durable proposal lifecycle events after an optional sequence cursor. */
const SkillsProposalEventsListParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	proposalId: Type.Optional(NonEmptyString),
	afterSequence: Type.Optional(Type.Integer({ minimum: 0 })),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 200
	}))
});
/** Sequence-ordered proposal lifecycle replay page. */
const SkillsProposalEventsListResultSchema = closedObject({
	events: Type.Array(SkillProposalLifecycleEventSchema, { maxItems: 200 }),
	nextSequence: Type.Optional(Type.Integer({ minimum: 1 }))
});
/** Result returned after applying a skill proposal to disk. */
const SkillsProposalApplyResultSchema = closedObject({
	record: SkillProposalRecordSchema,
	targetSkillFile: NonEmptyString
});
/** Proposal record result returned after non-apply proposal actions. */
const SkillsProposalRecordResultSchema = SkillProposalRecordSchema;
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
/** Reads the effective tool set for one session. */
const ToolsEffectiveParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: NonEmptyString
});
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
closedObject({
	agentId: NonEmptyString,
	profile: NonEmptyString,
	groups: Type.Array(ToolsEffectiveGroupSchema),
	notices: Type.Optional(Type.Array(ToolsEffectiveNoticeSchema))
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
export { SkillsProposalReviseParamsSchema as $, EnvironmentsCreateParamsSchema as $t, ModelsAuthStatusParamsSchema as A, ToolsGitHubAuthorizeSuccessResultSchema as At, SkillsProposalActionParamsSchema as B, SecretsResolveParamsSchema as Bt, GitHubIdentitySourceSchema as C, ToolsGitHubAuthorizeNetworkErrorResultSchema as Ct, ModelsAuthRefreshParamsSchema as D, ToolsGitHubAuthorizeSlowDownResultSchema as Dt, ModelsAuthOrderSetParamsSchema as E, ToolsGitHubAuthorizePollResultSchema as Et, SkillProposalLifecycleEventSchema as F, ToolsGitHubStatusResultSchema as Ft, SkillsProposalEvaluateResultSchema as G, SecretsStoreMutationResultSchema as Gt, SkillsProposalCreateParamsSchema as H, SecretsStoreDeleteParamsSchema as Ht, SkillsBinsParamsSchema as I, ToolsInvokeParamsSchema as It, SkillsProposalInspectParamsSchema as J, GatewayContextWindowOptionSchema as Jt, SkillsProposalEventsListParamsSchema as K, SecretsStoreSetParamsSchema as Kt, SkillsDetailParamsSchema as L, SecretStoreEntrySchema as Lt, ModelsProbeResultSchema as M, ToolsGitHubInheritConfigureParamsSchema as Mt, ModelsProbeTargetResultSchema as N, ToolsGitHubManagedConfigureParamsSchema as Nt, ModelsAuthSetApiKeyParamsSchema as O, ToolsGitHubAuthorizeStartParamsSchema as Ot, SkillProposalEvaluationSchema as P, ToolsGitHubStatusParamsSchema as Pt, SkillsProposalRequestRevisionResultSchema as Q, EnvironmentSummarySchema as Qt, SkillsDetailResultSchema as R, SecretStoreEnvEntrySchema as Rt, GitHubIdentityScopeSchema as S, ToolsGitHubAuthorizeIncorrectDeviceCodeResultSchema as St, ModelsAuthLogoutParamsSchema as T, ToolsGitHubAuthorizePollParamsSchema as Tt, SkillsProposalDecisionParamsSchema as U, SecretsStoreListParamsSchema as Ut, SkillsProposalApplyResultSchema as V, SecretsResolveResultSchema as Vt, SkillsProposalEvaluateParamsSchema as W, SecretsStoreListResultSchema as Wt, SkillsProposalRecordResultSchema as X, DesktopAvailabilitySchema as Xt, SkillsProposalInspectResultSchema as Y, GatewayThinkingLevelOptionSchema as Yt, SkillsProposalRequestRevisionParamsSchema as Z, EnvironmentStatusSchema as Zt, AgentsUpdateParamsSchema as _, WorkerEnvironmentStateSchema as _n, ToolsGitHubAuthorizeAccessDeniedResultSchema as _t, AgentsCreateResultSchema as a, EnvironmentsPrepareParamsSchema as an, SkillsSecurityVerdictsParamsSchema as at, GitHubAuthorSchema as b, WorkerTunnelStatusSchema as bn, ToolsGitHubAuthorizeExpiredResultSchema as bt, AgentsFileEntrySchema as c, EnvironmentsStatusResultSchema as cn, SkillsSkillCardResultSchema as ct, AgentsFilesListParamsSchema as d, WorkerDesktopAppIdSchema as dn, SkillsUploadBeginParamsSchema as dt, EnvironmentsCreateResultSchema as en, SkillsProposalUpdateParamsSchema as et, AgentsFilesListResultSchema as f, WorkerDesktopLaunchParamsSchema as fn, SkillsUploadChunkParamsSchema as ft, AgentsListResultSchema as g, WorkerEnvironmentMetadataSchema as gn, ToolsEffectiveParamsSchema as gt, AgentsListParamsSchema as h, WorkerDesktopObserveResultSchema as hn, SkillsWorkshopReadResultSchema as ht, AgentsCreateParamsSchema as i, EnvironmentsListResultSchema as in, SkillsSearchResultSchema as it, ModelsProbeParamsSchema as j, ToolsGitHubConfigureParamsSchema as jt, ModelsAuthSetApiKeyResultSchema as k, ToolsGitHubAuthorizeStartResultSchema as kt, AgentsFilesGetParamsSchema as l, RequiredNodeCommandSchema as ln, SkillsStatusParamsSchema as lt, AgentsFilesSetResultSchema as m, WorkerDesktopObserveParamsSchema as mn, SkillsWorkshopReadParamsSchema as mt, AgentOwnershipSchema as n, EnvironmentsDestroyResultSchema as nn, SkillsProposalsListResultSchema as nt, AgentsDeleteParamsSchema as o, EnvironmentsPrepareResultSchema as on, SkillsSecurityVerdictsResultSchema as ot, AgentsFilesSetParamsSchema as p, WorkerDesktopLaunchResultSchema as pn, SkillsUploadCommitParamsSchema as pt, SkillsProposalEventsListResultSchema as q, GatewayAgentRuntimeSchema as qt, AgentSummarySchema as r, EnvironmentsListParamsSchema as rn, SkillsSearchParamsSchema as rt, AgentsDeleteResultSchema as s, EnvironmentsStatusParamsSchema as sn, SkillsSkillCardParamsSchema as st, AgentKindSchema as t, EnvironmentsDestroyParamsSchema as tn, SkillsProposalsListParamsSchema as tt, AgentsFilesGetResultSchema as u, RequiredNodeCommandStateSchema as un, SkillsUpdateParamsSchema as ut, AgentsUpdateResultSchema as v, WorkerMachineOptionsSchema as vn, ToolsGitHubAuthorizeCancelParamsSchema as vt, GitHubSelectedIdentitySchema as w, ToolsGitHubAuthorizePendingResultSchema as wt, GitHubIdentityFactsSchema as x, ToolsGitHubAuthorizeFailedResultSchema as xt, AuthProbeStatusSchema as y, WorkerOperatingSystemSchema as yn, ToolsGitHubAuthorizeCancelResultSchema as yt, SkillsInstallParamsSchema as z, SecretStoreSecretEntrySchema as zt };
