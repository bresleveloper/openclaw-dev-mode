import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as UPDATE_RUN_TRIGGERS, n as UPDATE_RUN_STATUSES, r as UPDATE_RUN_STEP_STATUSES, t as UPDATE_RUN_PHASES } from "./update-run-vocabulary-BYZF4sMi.mjs";
import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { S as WorkerAdmissionHandshakeSchema } from "./worker-admission-BB3C4gz4.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXfMhak.mjs";
import { a as NonEmptyString, c as UserProfileIdSchema, i as InputProvenanceSchema, n as GatewayClientIdSchema, r as GatewayClientModeSchema, s as SessionLabelString, t as ChatSendSessionKeyString } from "./primitives-C-2-W5SF.mjs";
import { c as SessionToolOverridesSchema, i as SessionPermissionModeSchema, r as SessionOwnerSchema, u as SessionVisibilitySchema } from "./sessions-row-CU6LvmZ_.mjs";
import { a as SessionPersonSchema } from "./session-participant-Cj8YyLga.mjs";
import { n as AgentOwnershipSchema } from "./agents-models-skills-ChHh3UoN.mjs";
import { t as GatewayEventLoopHealthSchema } from "./runtime-vitals-BAzwMWci.mjs";
import { t as CHAT_WORK_CONTEXT_LIMITS } from "./chat-work-context-BnQywh8U.mjs";
import { t as CHAT_HISTORY_MAX_ENTRIES } from "./chat-history-constants-C-H8nkgi.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/control-ui-link-reader.ts
const ControlUiLinkReaderMetadataSchema = closedObject({
	hosts: Type.Array(Type.String({
		minLength: 1,
		maxLength: 253
	}), {
		minItems: 1,
		maxItems: 16
	}),
	pathPattern: Type.String({
		minLength: 2,
		maxLength: 1024
	}),
	detailMethod: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	previewMethod: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	imageMethod: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	}))
});
const ControlUiLinkReaderDescriptorSchema = closedObject({
	pluginId: NonEmptyString,
	id: NonEmptyString,
	label: NonEmptyString,
	icon: Type.Optional(Type.String()),
	linkReader: ControlUiLinkReaderMetadataSchema
});
//#endregion
//#region packages/gateway-protocol/src/schema/plugin-credentials.ts
const closed = { additionalProperties: false };
const text$1 = Type.String({
	minLength: 1,
	maxLength: 512
});
const path = Type.Array(Type.Union([text$1, Type.Integer({ minimum: 0 })]), {
	minItems: 5,
	maxItems: 32
});
const PluginCredentialDescriptorSchema = Type.Object({
	path,
	label: text$1,
	envVars: Type.Array(text$1, { maxItems: 32 }),
	placeholder: Type.Optional(text$1),
	signupUrl: Type.Optional(text$1),
	requiresCredential: Type.Optional(Type.Boolean())
}, closed);
const reference = Type.Object({
	source: Type.Union([
		Type.Literal("env"),
		Type.Literal("file"),
		Type.Literal("exec"),
		Type.Literal("store")
	]),
	provider: text$1,
	id: Type.String({
		minLength: 1,
		maxLength: 4096
	})
}, closed);
const PluginCredentialInspectionSchema = Type.Union([
	Type.Object({ kind: Type.Literal("missing") }, closed),
	Type.Object({
		kind: Type.Literal("literal"),
		value: Type.Optional(Type.String())
	}, closed),
	Type.Object({ kind: Type.Literal("invalid") }, closed),
	Type.Object({
		kind: Type.Literal("environment"),
		envVar: text$1
	}, closed),
	Type.Object({
		kind: Type.Literal("reference"),
		ref: reference,
		unresolved: Type.Boolean()
	}, closed)
]);
/** An admin can inspect only a credential advertised by this installed plugin, at this revision. */
const PluginsCredentialsInspectParamsSchema = Type.Object({
	pluginId: text$1,
	path,
	baseHash: text$1,
	reveal: Type.Optional(Type.Boolean())
}, closed);
const PluginsCredentialsInspectResultSchema = Type.Object({
	baseHash: text$1,
	credential: PluginCredentialInspectionSchema
}, closed);
const validatePluginsCredentialsInspectParams = /* @__PURE__ */ lazyCompile(PluginsCredentialsInspectParamsSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/plugin-inspection.ts
/** Effective operator hook-policy grant with optional explicit config value. */
const PluginHookGrantSchema = closedObject({
	/** Effective policy after origin defaults and operator config. */
	effective: Type.Boolean(),
	/** Present only when plugins.entries.<id>.hooks sets the flag explicitly. */
	configured: Type.Optional(Type.Boolean())
});
/** Install provenance and pinned artifact integrity for one plugin. */
const PluginInspectSourceSchema = closedObject({
	kind: Type.Union([
		Type.Literal("bundled"),
		Type.Literal("clawhub"),
		Type.Literal("npm"),
		Type.Literal("git"),
		Type.Literal("path"),
		Type.Literal("archive"),
		Type.Literal("marketplace"),
		Type.Literal("official-catalog")
	]),
	spec: Type.Optional(NonEmptyString),
	packageName: Type.Optional(NonEmptyString),
	/** Pinned artifact integrity recorded at install (npm SSRI, sha-256, or git commit). */
	integrity: Type.Optional(NonEmptyString),
	integrityKind: Type.Optional(Type.Union([
		Type.Literal("ssri"),
		Type.Literal("sha256"),
		Type.Literal("git-commit")
	]))
});
/** Manifest-declared capability surface in enumerable terms. All arrays sorted. */
const PluginDeclaredSurfaceSchema = closedObject({
	channels: Type.Array(NonEmptyString),
	providers: Type.Array(NonEmptyString),
	tools: Type.Array(NonEmptyString),
	/** Manifest contract families and identifiers, rendered as `family: id`. */
	contracts: Type.Array(NonEmptyString),
	/** Bundle-format hook names; code plugins register hooks at runtime and list nothing here. */
	hooks: Type.Array(NonEmptyString),
	mcpServers: Type.Array(NonEmptyString),
	cliCommands: Type.Array(NonEmptyString),
	cliBackends: Type.Array(NonEmptyString),
	skills: Type.Array(NonEmptyString),
	/** Dot paths from configContracts.dangerousFlags. */
	dangerousConfigFlags: Type.Array(NonEmptyString)
});
/** Operator-granted capability flags with effective values. */
const PluginOperatorGrantsSchema = closedObject({
	hooks: closedObject({
		allowPromptInjection: PluginHookGrantSchema,
		allowConversationAccess: PluginHookGrantSchema
	}),
	llm: Type.Optional(closedObject({
		allowModelOverride: Type.Optional(Type.Boolean()),
		allowedModels: Type.Optional(Type.Array(NonEmptyString)),
		allowedCompletionModels: Type.Optional(Type.Array(NonEmptyString)),
		allowAuthProfileOverride: Type.Optional(Type.Boolean()),
		allowAgentIdOverride: Type.Optional(Type.Boolean())
	})),
	subagent: Type.Optional(closedObject({
		allowModelOverride: Type.Optional(Type.Boolean()),
		allowedModels: Type.Optional(Type.Array(NonEmptyString))
	}))
});
/** Persisted ClawHub per-release trust verdict from the install record. */
const PluginInstallTrustSchema = closedObject({
	disposition: Type.Union([
		Type.Literal("clean"),
		Type.Literal("review-recommended"),
		Type.Literal("review-required"),
		Type.Literal("blocked")
	]),
	reasons: Type.Optional(Type.Array(Type.String())),
	checkedAt: Type.Optional(NonEmptyString),
	acknowledgedAt: Type.Optional(NonEmptyString),
	pending: Type.Optional(Type.Boolean()),
	stale: Type.Optional(Type.Boolean())
});
/** Runtime-supported installed component lists plus detected-but-unavailable bundle facts. */
const PluginInstalledComponentsSchema = closedObject({
	/** Runtime-supported capability families; item arrays may be empty when names are unavailable. */
	mapped: Type.Array(NonEmptyString),
	skills: Type.Array(NonEmptyString),
	skillDetails: Type.Optional(Type.Array(closedObject({
		name: NonEmptyString,
		description: Type.Optional(Type.String())
	}))),
	mcpServers: Type.Array(NonEmptyString),
	commands: Type.Array(NonEmptyString),
	hooks: Type.Array(NonEmptyString),
	lspServers: Type.Array(NonEmptyString),
	unavailable: closedObject({
		capabilities: Type.Array(NonEmptyString),
		mcpServers: Type.Array(NonEmptyString),
		lspServers: Type.Array(NonEmptyString)
	})
});
/** Instance-local decision provider health; contains no evidence or credential details. */
const PluginDecisionProviderStatusSchema = closedObject({
	providerId: NonEmptyString,
	pluginId: NonEmptyString,
	configured: Type.Boolean(),
	credentialReady: Type.Boolean(),
	callable: Type.Boolean(),
	runtimeGeneration: NonEmptyString,
	recentSuccessAt: Type.Optional(Type.Integer({ minimum: 0 })),
	activeRequests: Type.Integer({ minimum: 0 }),
	successCount: Type.Integer({ minimum: 0 }),
	totalLatencyMs: Type.Number({ minimum: 0 }),
	usage: closedObject({
		inputTokens: Type.Number({ minimum: 0 }),
		outputTokens: Type.Number({ minimum: 0 })
	}),
	reasons: Type.Partial(closedObject({
		"credentials-unavailable": Type.Integer({ minimum: 0 }),
		authentication: Type.Integer({ minimum: 0 }),
		"rate-limited": Type.Integer({ minimum: 0 }),
		transport: Type.Integer({ minimum: 0 }),
		"unsupported-input": Type.Integer({ minimum: 0 }),
		"invalid-response": Type.Integer({ minimum: 0 }),
		disabled: Type.Integer({ minimum: 0 }),
		"not-configured": Type.Integer({ minimum: 0 }),
		retiring: Type.Integer({ minimum: 0 }),
		overloaded: Type.Integer({ minimum: 0 }),
		"circuit-open": Type.Integer({ minimum: 0 }),
		deadline: Type.Integer({ minimum: 0 })
	}), { additionalProperties: false })
});
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
const PluginControlUiDescriptorSchema = closedObject({
	id: NonEmptyString,
	pluginId: NonEmptyString,
	pluginName: Type.Optional(NonEmptyString),
	surface: Type.Union([
		Type.Literal("session"),
		Type.Literal("tool"),
		Type.Literal("run"),
		Type.Literal("settings"),
		Type.Literal("tab"),
		Type.Literal("widget"),
		Type.Literal("link-reader")
	]),
	linkReader: Type.Optional(ControlUiLinkReaderMetadataSchema),
	label: NonEmptyString,
	description: Type.Optional(Type.String()),
	icon: Type.Optional(Type.String()),
	path: Type.Optional(Type.String()),
	placement: Type.Optional(Type.String()),
	group: Type.Optional(Type.Union([Type.Literal("control"), Type.Literal("agent")])),
	order: Type.Optional(Type.Number()),
	schema: Type.Optional(PluginJsonValueSchema),
	requiredScopes: Type.Optional(Type.Array(NonEmptyString))
});
/** Empty request payload for listing plugin UI descriptors. */
const PluginsUiDescriptorsParamsSchema = closedObject({});
const ControlUiPluginTabSchema = closedObject({
	pluginId: NonEmptyString,
	id: NonEmptyString,
	label: NonEmptyString,
	description: Type.Optional(Type.String()),
	icon: Type.Optional(Type.String()),
	path: Type.Optional(Type.String()),
	placement: Type.Optional(Type.String()),
	slug: Type.Optional(Type.String({
		pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
		maxLength: 64
	})),
	requiresGatewayAuth: Type.Optional(Type.Boolean()),
	group: Type.Optional(Type.Union([Type.Literal("control"), Type.Literal("agent")])),
	order: Type.Optional(Type.Number())
});
const ControlUiPluginWidgetKindSchema = closedObject({
	pluginId: NonEmptyString,
	kind: NonEmptyString,
	label: NonEmptyString
});
/** Response payload containing all plugin UI descriptors visible to the client. */
const PluginsUiDescriptorsResultSchema = closedObject({
	ok: Type.Literal(true),
	descriptors: Type.Array(PluginControlUiDescriptorSchema),
	generation: Type.Optional(Type.Integer({ minimum: 0 })),
	methods: Type.Optional(Type.Array(NonEmptyString)),
	controlUiTabs: Type.Optional(Type.Array(ControlUiPluginTabSchema)),
	controlUiWidgetKinds: Type.Optional(Type.Array(ControlUiPluginWidgetKindSchema)),
	controlUiLinkReaders: Type.Optional(Type.Array(ControlUiLinkReaderDescriptorSchema)),
	pluginSurfaceUrls: Type.Optional(Type.Record(NonEmptyString, NonEmptyString))
});
/** One immutable browser build owned by an active native plugin. */
const PluginControlUiModuleSchema = closedObject({
	pluginId: NonEmptyString,
	name: NonEmptyString,
	revision: NonEmptyString,
	entryUrl: NonEmptyString,
	styles: Type.Array(NonEmptyString, { maxItems: 16 })
});
const PluginControlUiDiagnosticSchema = closedObject({
	pluginId: NonEmptyString,
	message: Type.String({ maxLength: 512 }),
	code: Type.Optional(Type.Literal("custom-plugin-ui-disabled"))
});
/** Lists browser builds; reading this catalog never reloads backend plugin code. */
const PluginsControlUiListParamsSchema = closedObject({});
const PluginsControlUiReloadParamsSchema = closedObject({ pluginId: Type.Optional(NonEmptyString) });
const PluginsControlUiCatalogSchema = closedObject({
	revision: NonEmptyString,
	plugins: Type.Array(PluginControlUiModuleSchema, { maxItems: 64 }),
	diagnostics: Type.Array(PluginControlUiDiagnosticSchema, { maxItems: 64 })
});
const PluginsControlUiChangedEventSchema = closedObject({ revision: NonEmptyString });
const PluginsControlUiReportParamsSchema = closedObject({
	pluginId: NonEmptyString,
	revision: NonEmptyString,
	status: Type.Union([Type.Literal("activated"), Type.Literal("failed")]),
	error: Type.Optional(Type.String({ maxLength: 512 }))
});
const PluginsControlUiStatusParamsSchema = closedObject({ pluginId: Type.Optional(NonEmptyString) });
const PluginsControlUiStatusResultSchema = closedObject({ clients: Type.Array(closedObject({
	connId: NonEmptyString,
	activations: Type.Array(PluginsControlUiReportParamsSchema, { maxItems: 64 })
}), { maxItems: 128 }) });
/** Request payload for invoking one plugin-owned session action. */
const PluginsSessionActionParamsSchema = closedObject({
	pluginId: NonEmptyString,
	actionId: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	payload: Type.Optional(PluginJsonValueSchema)
});
/** Successful plugin action result, optionally continuing the agent turn. */
const PluginsSessionActionSuccessResultSchema = closedObject({
	ok: Type.Literal(true),
	result: Type.Optional(PluginJsonValueSchema),
	continueAgent: Type.Optional(Type.Boolean()),
	reply: Type.Optional(PluginJsonValueSchema)
});
/** Failed plugin action result with plugin-owned detail payload. */
const PluginsSessionActionFailureResultSchema = closedObject({
	ok: Type.Literal(false),
	error: Type.String(),
	code: Type.Optional(Type.String()),
	details: Type.Optional(PluginJsonValueSchema)
});
/** Discriminated plugin action result returned to gateway clients. */
const PluginsSessionActionResultSchema = Type.Union([PluginsSessionActionSuccessResultSchema, PluginsSessionActionFailureResultSchema]);
/** ClawHub-backed install action for one catalog entry. */
const PluginCatalogClawHubInstallSchema = closedObject({
	source: Type.Literal("clawhub"),
	packageName: NonEmptyString
});
/** Official-catalog install action for one catalog entry. */
const PluginCatalogOfficialInstallSchema = closedObject({
	source: Type.Literal("official"),
	pluginId: NonEmptyString
});
const PluginCatalogInstallActionSchema = Type.Union([PluginCatalogClawHubInstallSchema, PluginCatalogOfficialInstallSchema]);
/** Observed state of the plugin in the current Gateway runtime generation. */
const PluginRuntimeStatusSchema = closedObject({
	state: Type.Union([
		Type.Literal("unloaded"),
		Type.Literal("disabled"),
		Type.Literal("active"),
		Type.Literal("service-failed")
	]),
	error: Type.Optional(Type.String())
});
/** Catalog metadata and desired enablement, with optional observed runtime state. */
const PluginCatalogEntrySchema = closedObject({
	id: NonEmptyString,
	name: NonEmptyString,
	packageName: Type.Optional(NonEmptyString),
	/** Canonical ClawHub identity proven by install provenance or the official catalog. */
	clawhubPackage: Type.Optional(NonEmptyString),
	/** Opaque discovery identity for loading optional ClawHub presentation metadata. */
	catalogId: Type.Optional(NonEmptyString),
	description: Type.Optional(Type.String()),
	version: Type.Optional(NonEmptyString),
	kind: Type.Optional(Type.Array(NonEmptyString)),
	origin: Type.Optional(NonEmptyString),
	installed: Type.Boolean(),
	enabled: Type.Boolean(),
	state: Type.Union([
		Type.Literal("enabled"),
		Type.Literal("disabled"),
		Type.Literal("needs-setup"),
		Type.Literal("not-installed"),
		Type.Literal("error")
	]),
	featured: Type.Optional(Type.Boolean()),
	featuredAt: Type.Optional(Type.Integer({ minimum: 0 })),
	order: Type.Optional(Type.Number()),
	/** True when the gateway can resolve a manifest or catalog icon for this plugin identity. */
	hasIcon: Type.Optional(Type.Boolean()),
	/** True when the installed package supplies a default compact activity glyph. */
	hasActivityIcon: Type.Optional(Type.Boolean()),
	/** Exact effective tool IDs with package-owned activity glyph overrides. */
	activityIconTools: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 128,
		pattern: "^[A-Za-z0-9_][A-Za-z0-9_.-]*$"
	}), { maxItems: 128 })),
	/** Channel identities declared by this installed plugin. */
	channelIds: Type.Optional(Type.Array(NonEmptyString)),
	install: Type.Optional(PluginCatalogInstallActionSchema),
	error: Type.Optional(Type.String()),
	runtime: Type.Optional(PluginRuntimeStatusSchema),
	/** Ordered package or registry categories; the first category is primary. */
	categories: Type.Optional(Type.Array(NonEmptyString, {
		minItems: 1,
		maxItems: 3
	})),
	/** Compatibility projection of the primary category. */
	category: Type.Optional(NonEmptyString),
	/** True when the plugin has an install record and can be removed via plugins.uninstall. */
	removable: Type.Optional(Type.Boolean())
});
/** Empty request payload for the cold plugin catalog. */
const PluginsListParamsSchema = closedObject({});
/** Installed and curated plugin catalog visible to the current gateway client. */
const PluginsListResultSchema = closedObject({
	generation: Type.Optional(Type.Integer({ minimum: 0 })),
	plugins: Type.Array(PluginCatalogEntrySchema),
	diagnostics: Type.Array(Type.Unknown()),
	mutationAllowed: Type.Boolean()
});
/** Request payload for inspecting one plugin's declared capability surface. */
const PluginsInspectParamsSchema = closedObject({ pluginId: NonEmptyString });
/** Newly declared capability items grouped by their existing manifest surface. */
const PluginDeclaredSurfaceWideningSchema = Type.Partial(PluginDeclaredSurfaceSchema, { additionalProperties: false });
/** Typed failure payload that lets clients review and acknowledge plugin capabilities. */
const CapabilityConsentErrorDetailsSchema = closedObject({
	capabilityConsentCode: Type.Literal("PLUGIN_CAPABILITY_CONSENT_REQUIRED"),
	pluginId: NonEmptyString,
	reviewToken: NonEmptyString,
	widened: Type.Optional(PluginDeclaredSurfaceWideningSchema),
	acceptedAt: Type.Optional(NonEmptyString)
});
const PluginCapabilityAcknowledgmentSchema = closedObject({ reviewToken: NonEmptyString });
/** Request payload for searching installable ClawHub plugin families. */
const PluginsSearchParamsSchema = closedObject({
	query: NonEmptyString,
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	}))
});
/** ClawHub package fields exposed by plugin search. */
const PluginSearchPackageSchema = closedObject({
	name: NonEmptyString,
	displayName: NonEmptyString,
	family: Type.Union([Type.Literal("code-plugin"), Type.Literal("bundle-plugin")]),
	channel: Type.Union([
		Type.Literal("official"),
		Type.Literal("community"),
		Type.Literal("private")
	]),
	isOfficial: Type.Boolean(),
	summary: Type.Optional(Type.String()),
	latestVersion: Type.Optional(NonEmptyString),
	runtimeId: Type.Optional(NonEmptyString),
	downloads: Type.Optional(Type.Number({ minimum: 0 })),
	verificationTier: Type.Optional(NonEmptyString)
});
/** Ranked ClawHub plugin search hit. */
const PluginSearchResultEntrySchema = closedObject({
	score: Type.Number(),
	package: PluginSearchPackageSchema
});
/** Ranked installable plugin packages matching the query. */
const PluginsSearchResultSchema = closedObject({ results: Type.Array(PluginSearchResultEntrySchema) });
const PluginDiscoveryIntentSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("bundled"),
	Type.Literal("trending"),
	Type.Literal("official"),
	Type.Literal("featured")
]);
const PluginDiscoveryIconKeySchema = Type.String({
	minLength: 1,
	maxLength: 64,
	pattern: "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"
});
const PluginDiscoveryCategorySchema = closedObject({
	slug: NonEmptyString,
	label: NonEmptyString,
	description: NonEmptyString,
	icon: PluginDiscoveryIconKeySchema,
	order: Type.Integer({ minimum: 0 })
});
const PluginDiscoveryCatalogFactsSchema = closedObject({
	name: NonEmptyString,
	packageName: Type.Optional(NonEmptyString),
	summary: Type.Optional(Type.String()),
	family: Type.Optional(Type.Union([Type.Literal("code-plugin"), Type.Literal("bundle-plugin")])),
	author: Type.Optional(NonEmptyString),
	official: Type.Boolean(),
	categories: Type.Array(NonEmptyString),
	icon: Type.Optional(PluginDiscoveryIconKeySchema),
	imageUrl: Type.Optional(NonEmptyString),
	latestVersion: Type.Optional(NonEmptyString),
	downloads: Type.Optional(Type.Number({ minimum: 0 })),
	installs: Type.Optional(Type.Number({ minimum: 0 })),
	verificationTier: Type.Optional(NonEmptyString),
	featured: Type.Optional(Type.Boolean()),
	trending: Type.Optional(Type.Boolean()),
	featuredRank: Type.Optional(Type.Integer({ minimum: 0 })),
	trendingRank: Type.Optional(Type.Integer({ minimum: 0 })),
	publishedToClawHub: Type.Optional(Type.Boolean())
});
const PluginDiscoveryLocalFactsSchema = closedObject({
	present: Type.Boolean(),
	installed: Type.Boolean(),
	enabled: Type.Boolean(),
	state: Type.Union([
		Type.Literal("enabled"),
		Type.Literal("disabled"),
		Type.Literal("needs-setup"),
		Type.Literal("not-installed"),
		Type.Literal("error")
	]),
	pluginId: Type.Optional(NonEmptyString),
	install: Type.Optional(PluginCatalogInstallActionSchema),
	action: Type.Union([
		Type.Literal("install"),
		Type.Literal("manage"),
		Type.Literal("unavailable")
	])
});
const PluginDiscoveryEntrySchema = closedObject({
	id: Type.String({
		minLength: 1,
		maxLength: 512,
		pattern: "^[A-Za-z0-9_-]+$"
	}),
	catalog: PluginDiscoveryCatalogFactsSchema,
	local: PluginDiscoveryLocalFactsSchema
});
const PluginsCatalogBrowseParamsSchema = closedObject({
	query: Type.Optional(Type.String({ maxLength: 200 })),
	searchSource: Type.Optional(Type.Literal("openclaw-control-ui")),
	intent: Type.Optional(PluginDiscoveryIntentSchema),
	category: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 64,
		pattern: "^[a-z][a-z0-9-]*$"
	})),
	cursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 4096
	})),
	pageSize: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	}))
});
const PluginsCatalogBrowseResultSchema = closedObject({
	items: Type.Array(PluginDiscoveryEntrySchema),
	categories: Type.Optional(Type.Array(PluginDiscoveryCategorySchema)),
	nextCursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 4096
	})),
	remoteError: Type.Optional(Type.String())
});
const PluginsCatalogCategoriesParamsSchema = closedObject({});
const PluginsCatalogCategoriesResultSchema = closedObject({ categories: Type.Array(PluginDiscoveryCategorySchema) });
const PluginsCatalogGetParamsSchema = closedObject({
	id: Type.String({
		minLength: 1,
		maxLength: 512,
		pattern: "^[A-Za-z0-9_-]+$"
	}),
	version: Type.Optional(NonEmptyString)
});
const PluginDiscoveryCompatibilitySchema = closedObject({
	pluginApiRange: Type.Optional(NonEmptyString),
	builtWithOpenClawVersion: Type.Optional(NonEmptyString),
	pluginSdkVersion: Type.Optional(NonEmptyString),
	minGatewayVersion: Type.Optional(NonEmptyString)
});
const PluginDiscoveryConfigFieldSchema = closedObject({
	name: NonEmptyString,
	description: Type.Optional(Type.String()),
	required: Type.Boolean(),
	sensitive: Type.Boolean()
});
const PluginDiscoveryVersionSchema = closedObject({
	version: NonEmptyString,
	createdAt: Type.Integer({ minimum: 0 }),
	changelog: Type.String(),
	tags: Type.Array(NonEmptyString)
});
const PluginDiscoveryDetailSchema = closedObject({
	origin: Type.Union([Type.Literal("clawhub"), Type.Literal("local")]),
	packageName: Type.Optional(NonEmptyString),
	author: Type.Optional(closedObject({
		handle: Type.Optional(NonEmptyString),
		displayName: Type.Optional(NonEmptyString),
		imageUrl: Type.Optional(NonEmptyString),
		official: Type.Optional(Type.Boolean())
	})),
	topics: Type.Array(NonEmptyString),
	createdAt: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAt: Type.Optional(Type.Integer({ minimum: 0 })),
	readme: Type.Optional(Type.String({ maxLength: 524288 })),
	repositoryUrl: Type.Optional(NonEmptyString),
	documentationUrl: Type.Optional(NonEmptyString),
	compatibility: Type.Optional(PluginDiscoveryCompatibilitySchema),
	contracts: Type.Optional(Type.Record(NonEmptyString, Type.Array(NonEmptyString))),
	providers: Type.Optional(Type.Array(NonEmptyString)),
	channels: Type.Optional(Type.Array(NonEmptyString)),
	configuration: Type.Array(PluginDiscoveryConfigFieldSchema),
	mcpServers: Type.Array(NonEmptyString),
	skills: Type.Array(closedObject({
		name: NonEmptyString,
		description: Type.Optional(Type.String())
	})),
	versions: Type.Array(PluginDiscoveryVersionSchema, { maxItems: 10 }),
	verification: Type.Optional(closedObject({
		tier: NonEmptyString,
		summary: Type.Optional(Type.String()),
		sourceRepo: Type.Optional(NonEmptyString),
		sourceCommit: Type.Optional(NonEmptyString),
		sourcePath: Type.Optional(NonEmptyString),
		scanStatus: Type.Optional(NonEmptyString)
	})),
	security: Type.Optional(closedObject({
		status: NonEmptyString,
		auditUrl: Type.Optional(NonEmptyString),
		verdict: Type.Optional(NonEmptyString),
		summary: Type.Optional(Type.String()),
		guidance: Type.Optional(Type.String()),
		checkedAt: Type.Optional(Type.Integer({ minimum: 0 }))
	}))
});
const PluginsCatalogGetResultSchema = closedObject({
	plugin: PluginDiscoveryEntrySchema,
	detail: PluginDiscoveryDetailSchema
});
/** Consent snapshot plus the installed-version presentation projection used by Control UI. */
const PluginsInspectResultSchema = closedObject({
	ok: Type.Literal(true),
	overview: Type.Optional(closedObject({
		readme: Type.Optional(Type.String({ maxLength: 524288 })),
		repositoryUrl: Type.Optional(NonEmptyString),
		documentationUrl: Type.Optional(NonEmptyString),
		publisherName: Type.Optional(NonEmptyString)
	})),
	credentials: Type.Optional(Type.Array(PluginCredentialDescriptorSchema)),
	decisions: Type.Optional(Type.Array(PluginDecisionProviderStatusSchema)),
	plugin: closedObject({
		id: NonEmptyString,
		name: NonEmptyString,
		version: Type.Optional(NonEmptyString),
		description: Type.Optional(Type.String()),
		origin: Type.Optional(NonEmptyString),
		installed: Type.Boolean(),
		enabled: Type.Boolean()
	}),
	source: Type.Optional(PluginInspectSourceSchema),
	declared: PluginDeclaredSurfaceSchema,
	components: PluginInstalledComponentsSchema,
	reviewToken: NonEmptyString,
	grants: PluginOperatorGrantsSchema,
	trust: Type.Optional(PluginInstallTrustSchema),
	/** Exact installed-version ClawHub metadata when a canonical package match exists. */
	catalog: Type.Optional(PluginsCatalogGetResultSchema)
});
const PluginInstallOptions = {
	mode: Type.Optional(Type.Union([Type.Literal("install"), Type.Literal("update")])),
	acknowledgeInstallPolicyWarning: Type.Optional(Type.Literal(true)),
	acknowledgeCapabilities: Type.Optional(PluginCapabilityAcknowledgmentSchema)
};
/** Source intent only; install provenance and capability review remain host-owned. */
const PluginsInstallParamsSchema = Type.Union([
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("clawhub"),
		packageName: NonEmptyString,
		version: Type.Optional(NonEmptyString),
		expectedPluginId: Type.Optional(NonEmptyString),
		expectedIntegrity: Type.Optional(NonEmptyString)
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("official"),
		pluginId: NonEmptyString,
		version: Type.Optional(Type.Literal("latest")),
		pin: Type.Optional(Type.Boolean())
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("npm"),
		spec: NonEmptyString,
		pin: Type.Optional(Type.Boolean()),
		expectedPluginId: Type.Optional(NonEmptyString),
		expectedIntegrity: Type.Optional(NonEmptyString)
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("git"),
		spec: NonEmptyString
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("local"),
		path: NonEmptyString,
		link: Type.Optional(Type.Boolean())
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("npm-pack"),
		archivePath: NonEmptyString
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("marketplace"),
		marketplace: NonEmptyString,
		plugin: NonEmptyString
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("bundled"),
		pluginId: NonEmptyString,
		spec: Type.Optional(NonEmptyString)
	})
]);
/** Receipt emitted only after the requested runtime generation was applied. */
const PluginRuntimeApplicationSchema = closedObject({
	operationId: NonEmptyString,
	generation: Type.Integer({ minimum: 0 }),
	pluginIds: Type.Array(NonEmptyString),
	sourceDigests: Type.Optional(Type.Record(NonEmptyString, NonEmptyString))
});
const PluginsChangedEventSchema = closedObject({ generation: Type.Integer({ minimum: 0 }) });
/** Successful plugin installation result. */
const PluginsInstallResultSchema = closedObject({
	ok: Type.Literal(true),
	plugin: PluginCatalogEntrySchema,
	restartRequired: Type.Boolean(),
	runtime: Type.Optional(PluginRuntimeApplicationSchema),
	warnings: Type.Optional(Type.Array(Type.String()))
});
/** Internal signal that persisted plugin metadata changed outside the Gateway process. */
const PluginsRefreshParamsSchema = closedObject({});
/** Successful plugin metadata refresh admission. */
const PluginsRefreshResultSchema = closedObject({
	ok: Type.Literal(true),
	restartRequired: Type.Optional(Type.Boolean()),
	runtime: Type.Optional(PluginRuntimeApplicationSchema),
	warnings: Type.Optional(Type.Array(Type.String()))
});
const PluginReloadTargetSchema = closedObject({
	pluginId: NonEmptyString,
	installHash: Type.Optional(Type.String({ pattern: "^[a-f0-9]{64}$" })),
	sourceDigests: Type.Optional(Type.Record(NonEmptyString, Type.String({ pattern: "^[a-f0-9]{64}$" })))
});
const PluginsReloadParamsSchema = closedObject({
	plugins: Type.Array(PluginReloadTargetSchema, {
		minItems: 1,
		maxItems: 64,
		uniqueItems: true
	}),
	acknowledgeCapabilities: Type.Optional(PluginCapabilityAcknowledgmentSchema)
});
const PluginsReloadResultSchema = closedObject({
	ok: Type.Literal(true),
	pluginIds: Type.Array(NonEmptyString, {
		minItems: 1,
		maxItems: 64
	}),
	restartRequired: Type.Literal(false),
	runtime: PluginRuntimeApplicationSchema,
	warnings: Type.Optional(Type.Array(Type.String()))
});
/** Request payload for removing one installed plugin and its managed files. */
const PluginsUninstallParamsSchema = closedObject({
	pluginId: NonEmptyString,
	keepFiles: Type.Optional(Type.Boolean())
});
/** Successful plugin removal result listing the cleanup actions that ran. */
const PluginsUninstallResultSchema = closedObject({
	ok: Type.Literal(true),
	pluginId: NonEmptyString,
	restartRequired: Type.Boolean(),
	runtime: Type.Optional(PluginRuntimeApplicationSchema),
	removed: Type.Array(Type.String()),
	warnings: Type.Optional(Type.Array(Type.String()))
});
/** Request payload for changing one installed plugin's policy state. */
const PluginsSetEnabledParamsSchema = closedObject({
	pluginId: NonEmptyString,
	enabled: Type.Boolean(),
	allowlistPolicy: Type.Optional(Type.Literal("preserve")),
	acknowledgeCapabilities: Type.Optional(PluginCapabilityAcknowledgmentSchema)
});
/** Successful plugin enablement policy update. */
const PluginsSetEnabledResultSchema = closedObject({
	ok: Type.Literal(true),
	plugin: PluginCatalogEntrySchema,
	restartRequired: Type.Boolean(),
	runtime: Type.Optional(PluginRuntimeApplicationSchema),
	warnings: Type.Optional(Type.Array(Type.String()))
});
//#endregion
//#region packages/gateway-protocol/src/schema/update-runs.ts
const text = Type.String({ maxLength: 1024 });
const timestamp = Type.Integer({
	minimum: 0,
	maximum: Number.MAX_SAFE_INTEGER
});
const runId = Type.String({ pattern: "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$" });
const phase = Type.Enum(UPDATE_RUN_PHASES);
const status = Type.Enum(UPDATE_RUN_STATUSES);
const version = closedObject({
	version: Type.Optional(Type.Union([text, Type.Null()])),
	sha: Type.Optional(Type.Union([text, Type.Null()])),
	buildId: Type.Optional(Type.Union([text, Type.Null()]))
});
const driver = closedObject({
	host: Type.String({
		minLength: 1,
		maxLength: 255
	}),
	pid: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	startIdentity: Type.String({
		pattern: "^\\d+$",
		maxLength: 128
	})
});
const snapshotLocation = closedObject({
	kind: Type.Enum([
		"explicit-tmpdir",
		"state-volume",
		"system-tmpdir"
	]),
	directory: text
});
const snapshotBytes = Type.Integer({
	minimum: 0,
	maximum: Number.MAX_SAFE_INTEGER
});
const destinationPath = Type.String({ maxLength: 240 });
const nullableDestinationPath = Type.Union([destinationPath, Type.Null()]);
/** Wire projection of the canonical update ledger record. */
const UpdateRunRecordSchema = closedObject({
	runId,
	createdAtMs: timestamp,
	updatedAtMs: timestamp,
	trigger: Type.Enum(UPDATE_RUN_TRIGGERS),
	phase,
	status,
	reason: Type.Union([text, Type.Null()]),
	origin: closedObject({
		driver: Type.Optional(driver),
		previousDrivers: Type.Optional(Type.Array(driver, { maxItems: 7 })),
		requester: Type.Optional(closedObject({
			channel: Type.Optional(text),
			accountId: Type.Optional(text),
			senderId: Type.Optional(text),
			authorizationSource: Type.Optional(text)
		})),
		sessionKey: Type.Optional(text),
		deliveryContext: Type.Optional(closedObject({
			channel: Type.Optional(text),
			to: Type.Optional(text),
			accountId: Type.Optional(text),
			threadId: Type.Optional(text)
		})),
		campaignId: Type.Optional(text),
		doctorHint: Type.Optional(text),
		nextAction: Type.Optional(text)
	}),
	target: closedObject({
		channel: Type.Optional(text),
		tag: Type.Optional(text),
		kind: Type.Optional(Type.Enum(["package", "git"])),
		version: Type.Optional(text),
		sha: Type.Optional(text),
		installationMethod: Type.Optional(Type.Union([Type.Enum([
			"git-checkout",
			"npm-global",
			"pnpm-global",
			"bun-global",
			"managed-service"
		]), Type.Null()]))
	}),
	before: version,
	after: version,
	steps: Type.Array(closedObject({
		step: text,
		status: Type.Enum(UPDATE_RUN_STEP_STATUSES),
		startedAtMs: Type.Optional(timestamp),
		endedAtMs: Type.Optional(timestamp),
		exitCode: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
		detail: Type.Optional(text),
		failureFacts: Type.Optional(Type.Array(closedObject({
			check: Type.String({ maxLength: 128 }),
			code: Type.String({ maxLength: 80 }),
			message: Type.Optional(Type.String({ maxLength: 200 })),
			affectedKey: Type.Optional(Type.String({ maxLength: 128 })),
			pluginId: Type.Optional(Type.String({ maxLength: 80 })),
			errorName: Type.Optional(Type.Union([Type.String({ maxLength: 80 }), Type.Null()])),
			location: Type.Optional(Type.Union([Type.String({ maxLength: 160 }), Type.Null()])),
			destination: Type.Optional(closedObject({
				ownership: Type.Enum(["foreign", "unknown"]),
				cause: Type.Enum([
					"package-mismatch",
					"launcher-mismatch",
					"permission",
					"probe-failure",
					"unreadable-layout"
				]),
				destinationKind: Type.Enum(["npm-global", "unknown"]),
				prefix: nullableDestinationPath,
				packageRoot: nullableDestinationPath,
				runningRoot: destinationPath,
				runningPrefix: nullableDestinationPath,
				launcher: nullableDestinationPath,
				launcherTarget: nullableDestinationPath
			}))
		}), { maxItems: 5 })),
		configChange: Type.Optional(Type.Union([closedObject({
			kind: Type.Literal("key"),
			key: text
		}), closedObject({
			kind: Type.Literal("migration"),
			message: text
		})])),
		configWriteRefusal: Type.Optional(closedObject({
			reason: text,
			message: text,
			keys: Type.Array(text, { maxItems: 32 })
		})),
		snapshotCapacity: Type.Optional(closedObject({
			sqliteBytes: snapshotBytes,
			pluginBytes: Type.Union([snapshotBytes, Type.Null()]),
			requiredBytes: snapshotBytes,
			reason: Type.Enum([
				"explicit-tmpdir",
				"state-volume",
				"system-tmpdir",
				"snapshot-capacity-insufficient",
				"snapshot-location-unavailable"
			]),
			candidates: Type.Array(closedObject({
				...snapshotLocation.properties,
				availableBytes: Type.Union([snapshotBytes, Type.Null()]),
				allocationError: Type.Optional(text)
			}), { maxItems: 3 }),
			selection: Type.Union([snapshotLocation, Type.Null()])
		}))
	}), { maxItems: 128 }),
	verification: closedObject({
		rollbackOutcome: Type.Optional(Type.Union([closedObject({
			status: Type.Enum([
				"not-needed",
				"not-attempted",
				"succeeded",
				"failed"
			]),
			reason: Type.String({ maxLength: 512 })
		}), Type.Null()])),
		recovery: Type.Optional(Type.Union([
			closedObject({
				serviceRestartSafe: Type.Literal(true),
				packageRollbackVerified: Type.Optional(Type.Literal(true)),
				version: Type.String({ minLength: 1 }),
				buildId: Type.Optional(Type.String({
					minLength: 1,
					maxLength: 96
				})),
				service: Type.Optional(Type.Enum(["healthy", "failed"])),
				reason: Type.Optional(Type.String({ minLength: 1 }))
			}),
			closedObject({
				serviceRestartSafe: Type.Literal(false),
				packageRollbackVerified: Type.Optional(Type.Boolean()),
				reason: Type.Enum([
					"source-rollback-failed",
					"state-migration-started",
					"manager-unavailable",
					"deps-install-failed",
					"build-failed",
					"rollback-checkout-dirty",
					"runtime-verification-failed"
				])
			}),
			Type.Null()
		])),
		booted: Type.Optional(Type.Boolean()),
		runningVersion: Type.Optional(text),
		runningBuildId: Type.Optional(text),
		serviceRunning: Type.Optional(Type.Boolean()),
		pid: Type.Optional(timestamp),
		port: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: 65535
		})),
		versionMatch: Type.Optional(Type.Boolean()),
		pluginErrors: Type.Optional(Type.Array(text, { maxItems: 32 })),
		channelsReady: Type.Optional(Type.Boolean()),
		readyz: Type.Optional(Type.Boolean()),
		settled: Type.Optional(Type.Boolean()),
		noticeDelivered: Type.Optional(Type.Boolean()),
		doctorHint: Type.Optional(text)
	}),
	repair: Type.Array(closedObject({
		attempt: Type.Integer({
			minimum: 1,
			maximum: Number.MAX_SAFE_INTEGER
		}),
		status: Type.Enum([
			"succeeded",
			"failed",
			"skipped"
		]),
		startedAtMs: timestamp,
		endedAtMs: Type.Optional(timestamp),
		summary: Type.Optional(text),
		reason: Type.Optional(text)
	}), { maxItems: 16 }),
	confirmedAtMs: Type.Union([timestamp, Type.Null()]),
	finishedAtMs: Type.Union([timestamp, Type.Null()]),
	downtimeMs: Type.Union([timestamp, Type.Null()])
});
const UpdateRunsGetParamsSchema = closedObject({ runId });
const UpdateRunsGetResultSchema = closedObject({ run: Type.Union([UpdateRunRecordSchema, Type.Null()]) });
const UpdateRunsListParamsSchema = closedObject({ limit: Type.Optional(Type.Integer({
	minimum: 1,
	maximum: 100
})) });
const UpdateRunsListResultSchema = closedObject({ runs: Type.Array(UpdateRunRecordSchema, { maxItems: 100 }) });
const UpdateRunChangedEventSchema = closedObject({
	runId,
	phase,
	status,
	updatedAtMs: timestamp
});
/** Existing update.run response fields remain available alongside the durable run identity. */
const UpdateRunResultSchema = closedObject({
	runId,
	ok: Type.Boolean(),
	result: Type.Unknown(),
	ackDelivered: Type.Optional(Type.Boolean()),
	ackQueued: Type.Optional(Type.Boolean()),
	acknowledgement: Type.Optional(Type.String()),
	code: Type.Optional(Type.String()),
	message: Type.Optional(Type.String()),
	handoff: Type.Optional(Type.Unknown()),
	restart: Type.Optional(Type.Unknown()),
	sentinel: Type.Optional(Type.Unknown())
});
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
const ConfigDeliveryContextSchema = closedObject({
	channel: Type.Optional(Type.String()),
	to: Type.Optional(Type.String()),
	accountId: Type.Optional(Type.String()),
	threadId: Type.Optional(Type.Union([Type.String(), Type.Number()]))
});
/** Empty request payload for reading the current raw config. */
const ConfigGetParamsSchema = closedObject({});
/** Full raw config replacement request with optional base hash guard. */
const ConfigSetParamsSchema = closedObject({
	raw: NonEmptyString,
	baseHash: Type.Optional(NonEmptyString)
});
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
const ConfigApplyParamsSchema = closedObject(ConfigApplyLikeParamProperties);
/** Raw config patch request that may schedule a restart. */
const ConfigPatchParamsSchema = closedObject({
	...ConfigApplyLikeParamProperties,
	replacePaths: Type.Optional(Type.Array(NonEmptyString, { maxItems: 256 }))
});
/** Empty request payload for fetching the generated config schema. */
const ConfigSchemaParamsSchema = closedObject({});
/** Schema lookup request for one config path. */
const ConfigSchemaLookupParamsSchema = closedObject({ path: ConfigSchemaLookupPathString });
/** Request payload for cached status or an explicit checkout refresh. */
const UpdateStatusParamsSchema = closedObject({ refreshCheckout: Type.Optional(Type.Boolean()) });
const UpdateCommitSchema = closedObject({
	sha: NonEmptyString,
	subject: Type.String({ maxLength: 120 })
});
/** Backward-compatible update availability metadata. */
const UpdateAvailableSchema = closedObject({
	currentVersion: NonEmptyString,
	latestVersion: NonEmptyString,
	channel: NonEmptyString,
	currentSha: Type.Optional(NonEmptyString),
	upstreamRef: Type.Optional(NonEmptyString),
	upstreamSha: Type.Optional(NonEmptyString),
	repositoryUrl: Type.Optional(NonEmptyString),
	commitsBehind: Type.Optional(Type.Integer({ minimum: 0 })),
	commits: Type.Optional(Type.Array(UpdateCommitSchema, { maxItems: 5 }))
});
const GitInstallMetadataProperties = {
	currentSha: Type.Optional(NonEmptyString),
	commitAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	installedAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
};
const GitUpdateStatusSchema = Type.Union([
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("current")
	}),
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("behind"),
		commitsBehind: Type.Integer({ minimum: 1 })
	}),
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("ahead"),
		commitsAhead: Type.Integer({ minimum: 1 })
	}),
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("diverged"),
		commitsAhead: Type.Integer({ minimum: 1 }),
		commitsBehind: Type.Integer({ minimum: 1 })
	}),
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("unavailable"),
		reason: Type.Union([
			Type.Literal("fetch-failed"),
			Type.Literal("no-upstream"),
			Type.Literal("no-upstream-sha"),
			Type.Literal("comparison-failed"),
			Type.Literal("git-unavailable")
		])
	})
]);
/** Authoritative automatic-update schedule and in-memory campaign state. */
const UpdateScheduleStateSchema = closedObject({
	channel: NonEmptyString,
	autoEnabled: Type.Boolean(),
	install: Type.Optional(closedObject({
		kind: Type.Union([
			Type.Literal("package"),
			Type.Literal("git"),
			Type.Literal("unknown")
		]),
		git: Type.Optional(GitUpdateStatusSchema)
	})),
	target: Type.Optional(Type.Union([closedObject({
		kind: Type.Literal("package"),
		version: NonEmptyString
	}), closedObject({
		kind: Type.Literal("git"),
		upstreamRef: NonEmptyString,
		upstreamSha: NonEmptyString,
		commitsBehind: Type.Integer({ minimum: 0 })
	})])),
	campaign: Type.Optional(closedObject({
		id: NonEmptyString,
		state: Type.Union([
			Type.Literal("waiting-for-idle"),
			Type.Literal("countdown"),
			Type.Literal("applying")
		]),
		announcedAtMs: Type.Integer({ minimum: 0 }),
		applyAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
		holdUntilMs: Type.Optional(Type.Integer({ minimum: 0 })),
		forceAtMs: Type.Integer({ minimum: 0 }),
		updatedAtMs: Type.Integer({ minimum: 0 })
	}))
});
/** Validated response payload for update.status. */
const UpdateStatusResultSchema = closedObject({
	sentinel: Type.Unknown(),
	updateAvailable: Type.Union([UpdateAvailableSchema, Type.Null()]),
	activeRun: Type.Optional(UpdateRunRecordSchema),
	lastRun: Type.Optional(UpdateRunRecordSchema),
	effectiveChannel: Type.Optional(Type.Union([
		Type.Literal("stable"),
		Type.Literal("extended-stable"),
		Type.Literal("beta"),
		Type.Literal("dev")
	])),
	schedule: Type.Optional(UpdateScheduleStateSchema)
});
/** Empty request payload for deferring the active update campaign. */
const UpdateHoldParamsSchema = closedObject({});
/** Result of attempting to defer the active update campaign. */
const UpdateHoldResultSchema = closedObject({
	ok: Type.Boolean(),
	schedule: Type.Optional(UpdateScheduleStateSchema)
});
/** Request payload for running an update/restart flow with optional channel delivery context. */
const UpdateRunParamsSchema = closedObject({
	requester: Type.Optional(closedObject({
		channel: Type.Optional(Type.String()),
		accountId: Type.Optional(Type.String()),
		senderId: Type.Optional(Type.String())
	})),
	sessionKey: Type.Optional(Type.String()),
	deliveryContext: Type.Optional(ConfigDeliveryContextSchema),
	note: Type.Optional(Type.String()),
	continuationMessage: Type.Optional(Type.String()),
	restartDelayMs: Type.Optional(Type.Integer({ minimum: 0 })),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
	target: Type.Optional(closedObject({
		kind: Type.Literal("git"),
		upstreamRef: Type.String({
			minLength: 1,
			pattern: "^[^\\s\\u0000-\\u001f\\u007f-\\u009f]+$"
		}),
		upstreamSha: Type.String({ pattern: "^[a-fA-F0-9]{40}$" })
	}))
});
/** Explicit two-step request for previewing or submitting one failed update report. */
const UpdateReportParamsSchema = Type.Union([closedObject({
	action: Type.Literal("preview"),
	attemptId: Type.String({
		minLength: 1,
		maxLength: 256
	})
}), closedObject({
	action: Type.Literal("submit"),
	attemptId: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	previewDigest: Type.String({ pattern: "^[a-f0-9]{64}$" })
})]);
const UpdateReportUrlSchema = Type.String({
	minLength: 1,
	maxLength: 16384
});
/** Result of a consent-gated update failure report action. */
const UpdateReportResultSchema = Type.Union([
	closedObject({
		status: Type.Literal("ready"),
		attemptId: Type.String({
			minLength: 1,
			maxLength: 256
		}),
		body: Type.String({ maxLength: 16e3 }),
		previewDigest: Type.String({ pattern: "^[a-f0-9]{64}$" }),
		title: Type.String({
			minLength: 1,
			maxLength: 200
		})
	}),
	closedObject({
		status: Type.Literal("created"),
		message: Type.Optional(Type.String({ maxLength: 512 })),
		url: UpdateReportUrlSchema
	}),
	closedObject({
		status: Type.Literal("fallback"),
		fallbackUrl: UpdateReportUrlSchema,
		message: Type.String({ maxLength: 512 })
	}),
	closedObject({
		status: Type.Literal("pending"),
		message: Type.String({ maxLength: 512 })
	}),
	closedObject({
		status: Type.Literal("retryable"),
		message: Type.String({ maxLength: 512 })
	}),
	closedObject({
		status: Type.Literal("duplicate"),
		fallbackUrl: Type.Optional(UpdateReportUrlSchema),
		message: Type.String({ maxLength: 512 }),
		url: Type.Optional(UpdateReportUrlSchema)
	})
]);
/** UI metadata attached to config schema paths. */
const ConfigUiHintSchema = closedObject({
	label: Type.Optional(Type.String()),
	help: Type.Optional(Type.String()),
	docsUrl: Type.Optional(Type.String()),
	tags: Type.Optional(Type.Array(Type.String())),
	group: Type.Optional(Type.String()),
	groups: Type.Optional(Type.Array(closedObject({
		id: NonEmptyString,
		title: NonEmptyString,
		order: Type.Optional(Type.Integer()),
		properties: Type.Array(NonEmptyString)
	}))),
	order: Type.Optional(Type.Integer()),
	advanced: Type.Optional(Type.Boolean()),
	sensitive: Type.Optional(Type.Boolean()),
	placeholder: Type.Optional(Type.String()),
	presentation: Type.Optional(Type.Literal("phone-number")),
	itemTemplate: Type.Optional(Type.Unknown())
});
/** Full generated config schema response. */
const ConfigSchemaResponseSchema = closedObject({
	schema: Type.Unknown(),
	uiHints: Type.Record(Type.String(), ConfigUiHintSchema),
	version: NonEmptyString,
	generatedAt: NonEmptyString
});
/** Child entry returned when looking up a config schema path. */
const ConfigSchemaLookupChildSchema = closedObject({
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
});
/** Schema lookup response for one config path and its immediate children. */
const ConfigSchemaLookupResultSchema = closedObject({
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
});
//#endregion
//#region packages/gateway-protocol/src/schema/gateway-suspend.ts
const SuspensionTokenSchema = Type.String({
	minLength: 1,
	maxLength: 128,
	pattern: "\\S"
});
const CountSchema = Type.Integer({ minimum: 0 });
/** Recorded lifecycle sections; absence on older residents means unknown custody. */
const GatewayWriteCustodySchema = Type.Array(closedObject({
	phase: Type.String({ minLength: 1 }),
	count: CountSchema
}));
/** Public admission state only; never includes the controller's suspension token. */
const GatewaySuspensionSchema = closedObject({ phase: Type.Union([
	Type.Literal("accepting"),
	Type.Literal("preparing"),
	Type.Literal("draining"),
	Type.Literal("prepared")
]) });
const GatewaySuspendTaskBlockerSchema = closedObject({
	taskId: Type.String(),
	status: Type.Literal("running"),
	runtime: Type.Union([
		Type.Literal("subagent"),
		Type.Literal("acp"),
		Type.Literal("cli"),
		Type.Literal("cron")
	]),
	runId: Type.Optional(Type.String()),
	label: Type.Optional(Type.String()),
	title: Type.Optional(Type.String())
});
const GatewaySuspendBlockerSchema = closedObject({
	kind: Type.Union([
		Type.Literal("queue"),
		Type.Literal("reply"),
		Type.Literal("embedded-run"),
		Type.Literal("background-exec"),
		Type.Literal("cron-run"),
		Type.Literal("task"),
		Type.Literal("root-request"),
		Type.Literal("session-admission"),
		Type.Literal("session-mutation"),
		Type.Literal("chat-run"),
		Type.Literal("queued-turn"),
		Type.Literal("terminal-persistence"),
		Type.Literal("terminal-session")
	]),
	count: CountSchema,
	message: Type.String(),
	task: Type.Optional(GatewaySuspendTaskBlockerSchema)
});
const GatewaySuspendPrepareParamsSchema = closedObject({
	requestId: SuspensionTokenSchema,
	terminalPolicy: Type.Optional(Type.Union([Type.Literal("preserve"), Type.Literal("terminate")])),
	drain: Type.Optional(Type.Boolean())
});
const GatewaySuspendPrepareBusyResultSchema = closedObject({
	status: Type.Literal("busy"),
	reason: Type.Union([Type.Literal("active-work"), Type.Literal("gateway-draining")]),
	retryAfterMs: CountSchema,
	activeCount: CountSchema,
	blockers: Type.Array(GatewaySuspendBlockerSchema),
	writeCustody: Type.Optional(GatewayWriteCustodySchema)
});
const GatewaySuspendPrepareDrainingResultSchema = closedObject({
	status: Type.Literal("draining"),
	suspensionId: SuspensionTokenSchema,
	expiresAtMs: CountSchema,
	retryAfterMs: CountSchema,
	activeCount: CountSchema,
	blockers: Type.Array(GatewaySuspendBlockerSchema),
	writeCustody: Type.Optional(GatewayWriteCustodySchema)
});
const GatewaySuspendPrepareReadyResultSchema = closedObject({
	status: Type.Literal("ready"),
	suspensionId: SuspensionTokenSchema,
	expiresAtMs: CountSchema,
	activeCount: CountSchema,
	blockers: Type.Array(GatewaySuspendBlockerSchema),
	writeCustody: Type.Optional(GatewayWriteCustodySchema)
});
const GatewaySuspendPrepareResultSchema = Type.Union([
	GatewaySuspendPrepareBusyResultSchema,
	GatewaySuspendPrepareDrainingResultSchema,
	GatewaySuspendPrepareReadyResultSchema
]);
const GatewaySuspendStatusParamsSchema = closedObject({ suspensionId: SuspensionTokenSchema });
const GatewaySuspendStatusRunningResultSchema = closedObject({ status: Type.Literal("running") });
const GatewaySuspendStatusDrainingResultSchema = closedObject({
	status: Type.Literal("draining"),
	expiresAtMs: CountSchema,
	retryAfterMs: CountSchema,
	activeCount: CountSchema,
	blockers: Type.Array(GatewaySuspendBlockerSchema),
	writeCustody: Type.Optional(GatewayWriteCustodySchema)
});
const GatewaySuspendStatusReadyResultSchema = closedObject({
	status: Type.Literal("ready"),
	expiresAtMs: CountSchema,
	writeCustody: Type.Optional(GatewayWriteCustodySchema)
});
const GatewaySuspendStatusResultSchema = Type.Union([
	GatewaySuspendStatusRunningResultSchema,
	GatewaySuspendStatusDrainingResultSchema,
	GatewaySuspendStatusReadyResultSchema
]);
const GatewaySuspendResumeParamsSchema = GatewaySuspendStatusParamsSchema;
const GatewaySuspendResumeResultSchema = closedObject({
	ok: Type.Literal(true),
	status: Type.Literal("running"),
	resumed: Type.Boolean()
});
/** Arms cleanup for the next SIGTERM; the external host still owns replacement. */
const GatewaySuspendHandoffParamsSchema = closedObject({
	suspensionId: SuspensionTokenSchema,
	target: closedObject({
		pid: Type.Integer({ minimum: 1 }),
		processInstanceId: SuspensionTokenSchema
	})
});
const GatewaySuspendHandoffResultSchema = closedObject({
	status: Type.Literal("armed"),
	suspensionId: SuspensionTokenSchema,
	expiresAtMs: CountSchema
});
//#endregion
//#region packages/gateway-protocol/src/schema/snapshot.ts
/**
* Gateway state snapshot schemas.
*
* Snapshots are sent during hello and later event streams; they summarize node
* presence, health, session defaults, and version counters for clients.
*/
/** One gateway-visible presence record for a node/client/runtime. */
const PresenceEntrySchema = closedObject({
	host: Type.Optional(NonEmptyString),
	clientId: Type.Optional(NonEmptyString),
	ip: Type.Optional(NonEmptyString),
	version: Type.Optional(NonEmptyString),
	platform: Type.Optional(NonEmptyString),
	deviceFamily: Type.Optional(NonEmptyString),
	modelIdentifier: Type.Optional(NonEmptyString),
	timeZone: Type.Optional(NonEmptyString),
	mode: Type.Optional(NonEmptyString),
	lastInputSeconds: Type.Optional(Type.Integer({ minimum: 0 })),
	reason: Type.Optional(NonEmptyString),
	tags: Type.Optional(Type.Array(NonEmptyString)),
	text: Type.Optional(Type.String()),
	/** Heartbeat freshness, not online duration or user activity. */
	ts: Type.Integer({ minimum: 0 }),
	/** Server timestamps for the person's continuous online interval and last accepted activity. */
	onlineSince: Type.Optional(Type.Integer({ minimum: 0 })),
	lastActivityAt: Type.Optional(Type.Integer({ minimum: 0 })),
	deviceId: Type.Optional(NonEmptyString),
	roles: Type.Optional(Type.Array(NonEmptyString)),
	scopes: Type.Optional(Type.Array(NonEmptyString)),
	instanceId: Type.Optional(NonEmptyString),
	user: Type.Optional(closedObject({
		/** Canonical profile id when resolved, otherwise authenticated identity; grouping also uses identity qualification. */
		id: NonEmptyString,
		identity: Type.Optional(SessionPersonSchema.properties.identity),
		email: Type.Optional(NonEmptyString),
		name: Type.Optional(NonEmptyString),
		avatarUrl: Type.Optional(NonEmptyString)
	})),
	/** Sessions this connection declares it is viewing, independent of transport subscriptions. Sorted lexicographically. */
	watchedSessions: Type.Optional(Type.Array(NonEmptyString))
});
const HealthSessionSummarySchema = closedObject({
	path: Type.String(),
	count: Type.Integer({ minimum: 0 }),
	recent: Type.Array(closedObject({
		key: Type.String(),
		updatedAt: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
		age: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])
	}))
});
const HealthSnapshotSchema = closedObject({
	ok: Type.Optional(Type.Literal(true)),
	ts: Type.Optional(Type.Integer({ minimum: 0 })),
	durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	eventLoop: Type.Optional(GatewayEventLoopHealthSchema),
	plugins: Type.Optional(closedObject({
		loaded: Type.Array(Type.String()),
		errors: Type.Array(closedObject({
			id: Type.String(),
			origin: Type.String(),
			activated: Type.Boolean(),
			activationSource: Type.Optional(Type.String()),
			activationReason: Type.Optional(Type.String()),
			failurePhase: Type.Optional(Type.String()),
			error: Type.String()
		})),
		unavailable: Type.Optional(Type.Array(closedObject({
			id: Type.String(),
			state: Type.Literal("configured-unavailable"),
			diagnostic: closedObject({
				kind: Type.Literal("plugin-verification"),
				reason: Type.String(),
				detail: Type.String()
			})
		})))
	})),
	contextEngines: Type.Optional(closedObject({ quarantined: Type.Array(closedObject({
		engineId: Type.String(),
		owner: Type.Optional(Type.String()),
		operation: Type.String(),
		reason: Type.String(),
		failedAt: Type.Integer({ minimum: 0 })
	})) })),
	deliveryQueues: Type.Optional(closedObject({
		failed: Type.Array(closedObject({
			queueName: Type.String(),
			count: Type.Integer({ minimum: 0 }),
			oldestFailedAt: Type.Optional(Type.Integer({ minimum: 0 }))
		})),
		ingressFailed: Type.Optional(Type.Array(closedObject({
			channelId: Type.String(),
			accountId: Type.String(),
			count: Type.Integer({ minimum: 0 }),
			oldestFailedAt: Type.Optional(Type.Integer({ minimum: 0 }))
		}))),
		ingressPressure: Type.Optional(Type.Array(closedObject({
			channelId: Type.String(),
			accountId: Type.String(),
			laneCount: Type.Integer({ minimum: 0 }),
			pendingCount: Type.Integer({ minimum: 0 }),
			claimedCount: Type.Integer({ minimum: 0 }),
			blockedCount: Type.Integer({ minimum: 0 }),
			oldestReceivedAt: Type.Integer({ minimum: 0 })
		})))
	})),
	modelPricing: Type.Optional(closedObject({
		state: Type.Union([
			Type.Literal("ok"),
			Type.Literal("degraded"),
			Type.Literal("disabled")
		]),
		sources: Type.Array(closedObject({
			source: Type.Union([
				Type.Literal("openrouter"),
				Type.Literal("litellm"),
				Type.Literal("bootstrap"),
				Type.Literal("refresh")
			]),
			state: Type.Union([Type.Literal("ok"), Type.Literal("degraded")]),
			lastFailureAt: Type.Optional(Type.Integer({ minimum: 0 })),
			detail: Type.Optional(Type.String())
		})),
		lastFailureAt: Type.Optional(Type.Integer({ minimum: 0 })),
		detail: Type.Optional(Type.String())
	})),
	configReload: Type.Optional(closedObject({ hotReloadStatus: Type.Union([Type.Literal("active"), Type.Literal("disabled")]) })),
	channels: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	channelOrder: Type.Optional(Type.Array(Type.String())),
	channelLabels: Type.Optional(Type.Record(Type.String(), Type.String())),
	heartbeatSeconds: Type.Optional(Type.Integer({ minimum: 0 })),
	defaultAgentId: Type.Optional(Type.String()),
	agents: Type.Optional(Type.Array(closedObject({
		agentId: Type.String(),
		name: Type.Optional(Type.String()),
		isDefault: Type.Boolean(),
		heartbeat: closedObject({
			enabled: Type.Boolean(),
			every: Type.String(),
			everyMs: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
			prompt: Type.String(),
			target: Type.String(),
			model: Type.Optional(Type.String()),
			session: Type.Optional(Type.String()),
			ackMaxChars: Type.Integer({ minimum: 0 })
		}),
		sessions: HealthSessionSummarySchema
	}))),
	sessions: Type.Optional(HealthSessionSummarySchema)
});
/** Default session routing keys included in initial gateway snapshots. */
const SessionDefaultsSchema = closedObject({
	defaultAgentId: NonEmptyString,
	modelConfigured: Type.Optional(Type.Boolean()),
	ownership: Type.Optional(AgentOwnershipSchema),
	selectionRequired: Type.Optional(Type.Boolean()),
	mainKey: NonEmptyString,
	mainSessionKey: NonEmptyString,
	scope: Type.Optional(NonEmptyString)
});
/** Monotonic version counters for snapshot subtrees. */
const StateVersionSchema = closedObject({
	presence: Type.Integer({ minimum: 0 }),
	health: Type.Integer({ minimum: 0 })
});
/** Initial and incremental gateway state snapshot payload. */
const SnapshotSchema = closedObject({
	suspension: Type.Optional(GatewaySuspensionSchema),
	presence: Type.Array(PresenceEntrySchema),
	health: HealthSnapshotSchema,
	stateVersion: StateVersionSchema,
	uptimeMs: Type.Integer({ minimum: 0 }),
	/** Resolved source-config revision accepted by the active Gateway runtime. */
	appliedConfigHash: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	configPath: Type.Optional(NonEmptyString),
	stateDir: Type.Optional(NonEmptyString),
	sessionDefaults: Type.Optional(SessionDefaultsSchema),
	/** Credential-free browser sign-in endpoint advertised to authenticated operators. */
	controlUiIdentityUrl: Type.Optional(NonEmptyString),
	authMode: Type.Optional(Type.Union([
		Type.Literal("none"),
		Type.Literal("token"),
		Type.Literal("password"),
		Type.Literal("trusted-proxy")
	])),
	updateAvailable: Type.Optional(UpdateAvailableSchema),
	updateSchedule: Type.Optional(UpdateScheduleStateSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/frames.ts
/**
* Top-level gateway frame schemas.
*
* These are the WebSocket envelope contracts; method/event payload schemas live
* in feature-specific modules and are referenced by runtime validators.
*/
/** Periodic server heartbeat event payload. */
const TickEventSchema = closedObject({ ts: Type.Integer({ minimum: 0 }) });
/** Server shutdown notice event payload. */
const ShutdownEventSchema = closedObject({
	reason: NonEmptyString,
	restartExpectedMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Initial client hello/connect payload sent before the gateway accepts frames. */
const ConnectParamsSchema = closedObject({
	minProtocol: Type.Integer({ minimum: 1 }),
	maxProtocol: Type.Integer({ minimum: 1 }),
	client: closedObject({
		id: GatewayClientIdSchema,
		displayName: Type.Optional(NonEmptyString),
		version: NonEmptyString,
		buildId: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 96
		})),
		platform: NonEmptyString,
		deviceFamily: Type.Optional(NonEmptyString),
		modelIdentifier: Type.Optional(NonEmptyString),
		/** Self-reported IANA zone. Bounded because the longest real name is well under this cap. */
		timeZone: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 64
		})),
		mode: GatewayClientModeSchema,
		instanceId: Type.Optional(NonEmptyString)
	}),
	caps: Type.Optional(Type.Array(NonEmptyString, { default: [] })),
	commands: Type.Optional(Type.Array(NonEmptyString)),
	/** Additive Computer Use declaration; the owning core contract validates its bounded shape. */
	computerUse: Type.Optional(Type.Unknown()),
	/** @deprecated Accepted for the shipped v1 node-host envelope; current hosts use runner inventory. */
	workerRuns: Type.Optional(WorkerAdmissionHandshakeSchema),
	permissions: Type.Optional(Type.Record(NonEmptyString, Type.Boolean())),
	pathEnv: Type.Optional(Type.String()),
	role: Type.Optional(NonEmptyString),
	scopes: Type.Optional(Type.Array(NonEmptyString)),
	/** Initial catalog read scope; method authorization still owns access. */
	modelCatalog: Type.Optional(Type.Union([closedObject({
		agentId: Type.Optional(NonEmptyString),
		sessionKey: Type.Optional(NonEmptyString)
	}), closedObject({
		agentId: Type.Optional(NonEmptyString),
		shortId: NonEmptyString,
		slugHint: Type.Optional(NonEmptyString)
	})])),
	device: Type.Optional(closedObject({
		id: NonEmptyString,
		publicKey: NonEmptyString,
		signature: NonEmptyString,
		signedAt: Type.Integer({ minimum: 0 }),
		nonce: NonEmptyString
	})),
	auth: Type.Optional(closedObject({
		token: Type.Optional(Type.String()),
		bootstrapToken: Type.Optional(Type.String()),
		deviceToken: Type.Optional(Type.String()),
		password: Type.Optional(Type.String()),
		approvalRuntimeToken: Type.Optional(Type.String()),
		agentRuntimeIdentityToken: Type.Optional(Type.String())
	})),
	locale: Type.Optional(Type.String()),
	userAgent: Type.Optional(Type.String())
});
/** Successful gateway hello response with the server protocol and initial state. */
const HelloOkSchema = closedObject({
	type: Type.Literal("hello-ok"),
	protocol: Type.Integer({ minimum: 1 }),
	server: closedObject({
		version: NonEmptyString,
		buildId: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 96
		})),
		bootId: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 96
		})),
		controlUiBuildSource: Type.Optional(Type.Union([Type.Literal("bundled"), Type.Literal("configured")])),
		connId: NonEmptyString
	}),
	features: closedObject({
		methods: Type.Array(NonEmptyString),
		events: Type.Array(NonEmptyString),
		capabilities: Type.Optional(Type.Array(NonEmptyString))
	}),
	snapshot: SnapshotSchema,
	controlUiUrl: Type.Optional(NonEmptyString),
	controlUiTabs: Type.Optional(Type.Array(ControlUiPluginTabSchema)),
	controlUiWidgetKinds: Type.Optional(Type.Array(ControlUiPluginWidgetKindSchema)),
	controlUiLinkReaders: Type.Optional(Type.Array(ControlUiLinkReaderDescriptorSchema)),
	pluginSurfaceUrls: Type.Optional(Type.Record(NonEmptyString, NonEmptyString)),
	auth: closedObject({
		method: Type.Optional(Type.Union([
			Type.Literal("none"),
			Type.Literal("token"),
			Type.Literal("password"),
			Type.Literal("tailscale"),
			Type.Literal("device-token"),
			Type.Literal("bootstrap-token"),
			Type.Literal("trusted-proxy")
		])),
		deviceToken: Type.Optional(NonEmptyString),
		recoveryMigrationAllowed: Type.Optional(Type.Literal(true)),
		recoveryScope: Type.Optional(NonEmptyString),
		role: NonEmptyString,
		scopes: Type.Array(NonEmptyString),
		issuedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
		deviceTokens: Type.Optional(Type.Array(closedObject({
			deviceToken: NonEmptyString,
			role: NonEmptyString,
			scopes: Type.Array(NonEmptyString),
			issuedAtMs: Type.Integer({ minimum: 0 })
		})))
	}),
	policy: closedObject({
		maxPayload: Type.Integer({ minimum: 1 }),
		maxBufferedBytes: Type.Integer({ minimum: 1 }),
		tickIntervalMs: Type.Integer({ minimum: 1 }),
		attachments: Type.Optional(closedObject({
			maxBytes: Type.Integer({ minimum: 1 }),
			maxImageBytes: Type.Integer({ minimum: 1 })
		})),
		allowedSessionVisibilities: Type.Optional(Type.Array(SessionVisibilitySchema)),
		hasMultipleSessionSharingIdentities: Type.Optional(Type.Boolean())
	})
});
/** Standard structured error shape used in response frames and connect failures. */
const ErrorShapeSchema = closedObject({
	code: NonEmptyString,
	message: NonEmptyString,
	details: Type.Optional(Type.Unknown()),
	retryable: Type.Optional(Type.Boolean()),
	retryAfterMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Client request frame envelope; `method` selects the payload validator. */
const RequestFrameSchema = closedObject({
	type: Type.Literal("req"),
	id: NonEmptyString,
	method: NonEmptyString,
	params: Type.Optional(Type.Unknown()),
	traceparent: Type.Optional(Type.String({ maxLength: 128 })),
	expectedProfileId: Type.Optional(UserProfileIdSchema)
});
/** Server response frame envelope paired with a prior request id. */
const ResponseFrameSchema = closedObject({
	type: Type.Literal("res"),
	id: NonEmptyString,
	ok: Type.Boolean(),
	payload: Type.Optional(Type.Unknown()),
	error: Type.Optional(ErrorShapeSchema)
});
/** Server event frame envelope; `event` selects the payload validator. */
const EventFrameSchema = closedObject({
	type: Type.Literal("event"),
	event: NonEmptyString,
	payload: Type.Optional(Type.Unknown()),
	seq: Type.Optional(Type.Integer({ minimum: 0 })),
	stateVersion: Type.Optional(StateVersionSchema),
	recipientProfileId: Type.Optional(UserProfileIdSchema)
});
const GatewayFrameSchema = Type.Union([
	RequestFrameSchema,
	ResponseFrameSchema,
	EventFrameSchema
], { discriminator: "type" });
//#endregion
//#region packages/gateway-protocol/src/schema/human-mentions.ts
const MAX_HUMAN_MENTIONS = 10;
const MAX_MENTIONABLE_USERS = 100;
const MENTION_INBOX_MAX_ITEMS = 100;
const MentionReferenceSchema = Type.String({
	minLength: 1,
	maxLength: 256
});
const MentionLabelSchema = Type.String({
	minLength: 1,
	maxLength: 256
});
const MentionSessionKeySchema = Type.String({
	minLength: 1,
	maxLength: 512
});
const MentionAvatarUrlSchema = Type.String({
	minLength: 1,
	maxLength: 2048
});
const MentionTimestampSchema = Type.Integer({
	minimum: 0,
	maximum: Number.MAX_SAFE_INTEGER
});
/** Explicit selections bound to UTF-16 offsets in the submitted message text. */
const HumanMentionSchema = closedObject({
	profileId: MentionReferenceSchema,
	start: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	end: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	})
});
const HumanMentionsSchema = Type.Array(HumanMentionSchema, { maxItems: 10 });
const UsersMentionableParamsSchema = Type.Union([closedObject({
	sessionKey: MentionSessionKeySchema,
	agentId: Type.Optional(MentionReferenceSchema),
	query: Type.Optional(Type.String({ maxLength: 128 }))
}), closedObject({
	agentId: MentionReferenceSchema,
	visibility: Type.Optional(SessionVisibilitySchema),
	query: Type.Optional(Type.String({ maxLength: 128 }))
})]);
const MentionableUserSchema = closedObject({
	profileId: MentionReferenceSchema,
	displayName: MentionLabelSchema,
	avatarUrl: Type.Optional(MentionAvatarUrlSchema),
	online: Type.Boolean()
});
const UsersMentionableResultSchema = closedObject({
	users: Type.Array(MentionableUserSchema, { maxItems: 100 }),
	truncated: Type.Boolean()
});
const MentionInboxItemSchema = closedObject({
	id: MentionReferenceSchema,
	senderProfileId: MentionReferenceSchema,
	senderLabel: MentionLabelSchema,
	senderAvatarUrl: Type.Optional(MentionAvatarUrlSchema),
	sessionKey: MentionSessionKeySchema,
	agentId: MentionReferenceSchema,
	sessionTitle: MentionLabelSchema,
	messageId: MentionReferenceSchema,
	createdAt: MentionTimestampSchema,
	expiresAt: MentionTimestampSchema,
	excerpt: Type.Optional(Type.String({ maxLength: 280 }))
});
const MentionsListParamsSchema = closedObject({});
const MentionsDismissParamsSchema = closedObject({ ids: Type.Array(MentionReferenceSchema, {
	maxItems: 100,
	uniqueItems: true
}) });
const MentionInboxVersionProperties = {
	gatewayInstanceId: MentionReferenceSchema,
	revision: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
};
const MentionsListResultSchema = closedObject({
	...MentionInboxVersionProperties,
	items: Type.Array(MentionInboxItemSchema, { maxItems: 100 })
});
const MentionsChangedEventSchema = closedObject(MentionInboxVersionProperties);
//#endregion
//#region packages/gateway-protocol/src/schema/logs-chat.ts
/** Cursor-based request for the gateway log tail endpoint. */
const LogsTailParamsSchema = closedObject({
	cursor: Type.Optional(Type.Integer({ minimum: 0 })),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 5e3
	})),
	maxBytes: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 1e6
	}))
});
/** Gateway log tail payload returned to dashboard clients. */
const LogsTailResultSchema = closedObject({
	file: NonEmptyString,
	cursor: Type.Integer({ minimum: 0 }),
	size: Type.Integer({ minimum: 0 }),
	lines: Type.Array(Type.String()),
	truncated: Type.Optional(Type.Boolean()),
	reset: Type.Optional(Type.Boolean()),
	skippedBytes: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Session-scoped history request used by WebChat and native WebSocket clients. */
const ChatHistoryParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	cursor: Type.Optional(Type.String()),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: CHAT_HISTORY_MAX_ENTRIES
	})),
	maxBytes: Type.Optional(Type.Integer({ minimum: 1024 })),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
	pendingBefore: Type.Optional(Type.Integer({ minimum: 1 })),
	inputRunIds: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 256
	}), {
		minItems: 1,
		maxItems: 50,
		uniqueItems: true
	})),
	messageId: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	maxChars: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 5e5
	}))
});
/** Resolve a short chat link and fetch its first page under the same discovery policy. */
const ChatStartupParamsSchema = Type.Union([ChatHistoryParamsSchema, closedObject({
	shortId: NonEmptyString,
	slugHint: Type.Optional(NonEmptyString),
	agentId: NonEmptyString,
	limit: ChatHistoryParamsSchema.properties.limit,
	maxBytes: ChatHistoryParamsSchema.properties.maxBytes
})]);
/** Accepted input awaiting a turn, separate from canonical model history. */
const ChatPendingInputsPageSchema = closedObject({
	items: Type.Array(closedObject({
		id: NonEmptyString,
		runId: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 256
		})),
		message: Type.Unknown(),
		acceptedAt: Type.Number(),
		state: Type.String({ enum: [
			"queued",
			"cancelled",
			"interrupted"
		] })
	}), { maxItems: 20 }),
	total: Type.Integer({ minimum: 0 }),
	nextBefore: Type.Optional(Type.Integer({ minimum: 1 }))
});
/** Exact accepted-input custody, independent of display pagination and message identity. */
const ChatInputReceiptsSchema = Type.Array(Type.Union([closedObject({
	runId: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	state: Type.Literal("pending")
}), closedObject({
	runId: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	state: Type.Literal("consumed"),
	consumedByEventId: NonEmptyString
})]), { maxItems: 50 });
/** Consumed-only compatibility projection for existing v4 clients. */
const ChatInputConsumptionsSchema = Type.Array(closedObject({
	runId: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	consumedByEventId: NonEmptyString
}), { maxItems: 50 });
const AgentActivityItemSchema = closedObject({
	itemId: NonEmptyString,
	phase: Type.Union([
		Type.Literal("start"),
		Type.Literal("update"),
		Type.Literal("end")
	]),
	kind: Type.String(),
	title: Type.String(),
	status: Type.Optional(Type.Union([
		Type.Literal("running"),
		Type.Literal("completed"),
		Type.Literal("failed"),
		Type.Literal("blocked")
	])),
	name: Type.Optional(Type.String()),
	meta: Type.Optional(Type.String()),
	commandBearing: Type.Optional(Type.Boolean()),
	toolCallId: Type.Optional(Type.String()),
	startedAt: Type.Optional(Type.Number()),
	endedAt: Type.Optional(Type.Number()),
	error: Type.Optional(Type.String()),
	summary: Type.Optional(Type.String()),
	progressText: Type.Optional(Type.String()),
	suppressChannelProgress: Type.Optional(Type.Boolean()),
	hideFromChannelProgress: Type.Optional(Type.Boolean()),
	approvalId: Type.Optional(Type.String()),
	approvalSlug: Type.Optional(Type.String())
});
const ChatHistoryActivitySchema = closedObject({
	messageId: NonEmptyString,
	items: Type.Array(AgentActivityItemSchema)
});
/**
* Bounded forward catch-up response. Clients replay `messages` as `session.message`
* payloads. There is no continuation loop: more than 200 raw events or the byte
* budget returns `reset`, and the client fetches a fresh tail page.
*/
const ChatHistoryDeltaResultSchema = closedObject({
	kind: Type.Literal("delta"),
	messages: Type.Array(Type.Unknown()),
	activity: Type.Optional(Type.Array(ChatHistoryActivitySchema)),
	deltaCursor: Type.String(),
	sessionInfo: Type.Unknown(),
	agentsList: Type.Optional(Type.Unknown()),
	inFlightRun: Type.Optional(Type.Unknown()),
	metadata: Type.Optional(Type.Unknown()),
	pendingInputs: Type.Optional(ChatPendingInputsPageSchema),
	inputReceipts: Type.Optional(ChatInputReceiptsSchema),
	inputConsumptions: Type.Optional(ChatInputConsumptionsSchema)
});
/** Normal cursor discontinuity; clients recover with a fresh tail request. */
const ChatHistoryResetResultSchema = closedObject({ kind: Type.Literal("reset") });
Type.Union([ChatHistoryDeltaResultSchema, ChatHistoryResetResultSchema]);
/** Lightweight metadata; session scope preserves the persisted auth-profile selection. */
const ChatMetadataParamsSchema = Object.assign(closedObject({
	agentId: Type.Optional(NonEmptyString),
	authProfileId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256,
		description: "Preview your own saved model account for a new chat without changing defaults. Cannot be combined with sessionKey."
	})),
	sessionKey: Type.Optional(Type.String({
		minLength: 1,
		description: "Read the authorized session's persisted auth-profile selection instead of neutral agent metadata."
	}))
}), { not: { required: ["sessionKey", "authProfileId"] } });
/** Batched purpose-title request for tool calls rendered in the Control UI. */
const ChatToolTitlesParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	items: Type.Array(closedObject({
		id: Type.String({
			minLength: 1,
			maxLength: 64
		}),
		name: Type.String({
			minLength: 1,
			maxLength: 200
		}),
		input: Type.String({
			minLength: 1,
			maxLength: 4e3
		})
	}), {
		minItems: 1,
		maxItems: 24
	})
});
/**
* Titles keyed by the caller-provided item id; missing ids mean no title.
* `disabled: true` tells clients the gateway has tool titles switched off so
* they stop requesting for the rest of the session.
*/
const ChatToolTitlesResultSchema = closedObject({
	titles: Type.Record(Type.String(), Type.String()),
	disabled: Type.Optional(Type.Boolean())
});
/** Fetches one stored chat message without forcing history callers to request huge payloads. */
const ChatMessageGetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	messageId: NonEmptyString,
	maxChars: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 2e6
	}))
});
closedObject({
	ok: Type.Boolean(),
	message: Type.Optional(Type.Unknown()),
	unavailableReason: Type.Optional(Type.Union([
		Type.Literal("not_found"),
		Type.Literal("oversized"),
		Type.Literal("not_visible")
	]))
});
/** Permissive attachment envelope shared by chat and session entrypoints. */
const ChatAttachmentSchema = Type.Object({
	type: Type.Optional(Type.String()),
	mimeType: Type.Optional(Type.String()),
	fileName: Type.Optional(Type.String()),
	origin: Type.Optional(Type.Union([Type.Literal("paste"), Type.Literal("file")])),
	content: Type.Optional(Type.Unknown()),
	sizeBytes: Type.Optional(Type.Number()),
	durationMs: Type.Optional(Type.Number()),
	width: Type.Optional(Type.Number()),
	height: Type.Optional(Type.Number())
}, { additionalProperties: true });
/** Attachment list shared by chat.send and session creation's initial turn. */
const ChatAttachmentsSchema = Type.Array(ChatAttachmentSchema);
/** Opaque, out-of-band plugin bindings carried separately from model input. */
const RunToolBindingsSchema = Type.Record(Type.String({
	minLength: 1,
	maxLength: 128
}), Type.Unknown(), { maxProperties: 16 });
const QUEUE_MODES = [
	"steer",
	"followup",
	"collect",
	"interrupt"
];
const ChatSendIntentSchema = closedObject({
	kind: Type.Literal("session-goal-start"),
	version: Type.Literal(1),
	issuedAtMs: Type.Integer({ minimum: 0 })
});
const ChatWorkContextSchema = closedObject({
	page: Type.String({
		minLength: 1,
		maxLength: CHAT_WORK_CONTEXT_LIMITS.page
	}),
	title: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.title })),
	sessionKey: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.sessionKey })),
	sessionId: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.sessionId })),
	agentId: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.agentId })),
	workspace: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.workspace })),
	file: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.file })),
	selection: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.selection }))
});
/** User-to-agent send request; idempotency key lets clients safely retry transport failures. */
const ChatSendParamsSchema = closedObject({
	sessionKey: ChatSendSessionKeyString,
	agentId: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	message: Type.String(),
	mentions: Type.Optional(HumanMentionsSchema),
	workContext: Type.Optional(ChatWorkContextSchema),
	intent: Type.Optional(ChatSendIntentSchema),
	thinking: Type.Optional(Type.String()),
	fastMode: Type.Optional(Type.Union([Type.Boolean(), Type.Literal("auto")])),
	fastAutoOnSeconds: Type.Optional(Type.Integer({ minimum: 1 })),
	queueMode: Type.Optional(Type.String({ enum: [...QUEUE_MODES] })),
	deliver: Type.Optional(Type.Boolean()),
	originatingChannel: Type.Optional(Type.String()),
	originatingTo: Type.Optional(Type.String()),
	originatingAccountId: Type.Optional(Type.String()),
	originatingThreadId: Type.Optional(Type.String()),
	replyToId: Type.Optional(NonEmptyString),
	attachments: Type.Optional(ChatAttachmentsSchema),
	toolBindings: Type.Optional(RunToolBindingsSchema),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	systemInputProvenance: Type.Optional(InputProvenanceSchema),
	systemProvenanceReceipt: Type.Optional(Type.String()),
	suppressCommandInterpretation: Type.Optional(Type.Boolean()),
	expectedLeafEntryId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	expectedSessionRoutingContract: Type.Optional(NonEmptyString),
	expectedPermissionMode: Type.Optional(Type.Union([SessionPermissionModeSchema, Type.Null()])),
	expectedToolOverrides: Type.Optional(Type.Union([SessionToolOverridesSchema, Type.Null()])),
	idempotencyKey: NonEmptyString
});
/** Cancels the active or named run for a chat session. */
const ChatAbortParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	preserveSideRuns: Type.Optional(Type.Boolean())
});
/** Inserts an operator-visible synthetic message into an existing chat transcript. */
const ChatInjectParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	message: NonEmptyString,
	label: Type.Optional(Type.String({ maxLength: 100 }))
});
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
/** Coarse startup stages shown while a run has not produced visible activity yet. */
const ChatRunStartupPhaseSchema = Type.Union([
	Type.Literal("preparing_workspace"),
	Type.Literal("naming_worktree"),
	Type.Literal("creating_worktree"),
	Type.Literal("running_setup"),
	Type.Literal("provisioning_environment"),
	Type.Literal("preparing_context"),
	Type.Literal("memory_flushing"),
	Type.Literal("starting_model")
]);
/** Transient working status; only the run owner publishes terminal failures. */
const ChatStatusEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("status"),
	phase: ChatRunStartupPhaseSchema,
	retry: Type.Optional(closedObject({
		attempt: Type.Integer({
			minimum: 1,
			maximum: 10
		}),
		maxAttempts: Type.Integer({
			minimum: 1,
			maximum: 10
		}),
		reason: Type.Literal("rate_limit")
	}))
});
/** Incremental assistant output event; `replace` marks full-content refresh deltas. */
const ChatDeltaEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("delta"),
	message: Type.Optional(Type.Unknown()),
	deltaText: Type.String(),
	replace: Type.Optional(Type.Boolean()),
	usage: Type.Optional(Type.Unknown())
});
/** Successful terminal event for a completed chat run. */
const ChatFinalEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("final"),
	message: Type.Optional(Type.Unknown()),
	usage: Type.Optional(Type.Unknown()),
	stopReason: Type.Optional(Type.String()),
	yielded: Type.Optional(Type.Literal(true))
});
/** Terminal event for user-initiated or coordinator-initiated cancellation. */
const ChatAbortedEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("aborted"),
	message: Type.Optional(Type.Unknown()),
	errorMessage: Type.Optional(Type.String()),
	stopReason: Type.Optional(Type.String())
});
const CHAT_ERROR_DETAIL_MAX_CHARS = 300;
const ChatErrorDetailTextSchema = Type.Optional(Type.String({ maxLength: CHAT_ERROR_DETAIL_MAX_CHARS }));
const ChatErrorDetailSchema = closedObject({
	provider: ChatErrorDetailTextSchema,
	model: ChatErrorDetailTextSchema,
	failoverReason: ChatErrorDetailTextSchema,
	providerRuntimeFailureKind: ChatErrorDetailTextSchema,
	providerErrorType: ChatErrorDetailTextSchema,
	httpStatus: Type.Optional(Type.Integer({
		minimum: 100,
		maximum: 599
	})),
	providerErrorMessagePreview: ChatErrorDetailTextSchema
});
/** Bounds already-redacted provider facts before lifecycle and chat publication. */
function projectChatErrorDetail(observation) {
	const source = asOptionalRecord(observation);
	if (!source) return;
	const readText = (value) => typeof value === "string" && value.trim() ? truncateUtf16Safe(value.trim(), CHAT_ERROR_DETAIL_MAX_CHARS) : void 0;
	const httpStatus = typeof source.httpStatus === "number" ? source.httpStatus : void 0;
	const detail = {
		provider: readText(source.provider),
		model: readText(source.model),
		failoverReason: readText(source.failoverReason),
		providerRuntimeFailureKind: readText(source.providerRuntimeFailureKind),
		providerErrorType: readText(source.providerErrorType),
		httpStatus: httpStatus !== void 0 && Number.isInteger(httpStatus) && httpStatus >= 100 && httpStatus <= 599 ? httpStatus : void 0,
		providerErrorMessagePreview: readText(source.providerErrorMessagePreview)
	};
	return Object.values(detail).some((value) => value !== void 0) ? detail : void 0;
}
/** Terminal event for failed chat runs with optional sanitized provider diagnostics. */
const ChatErrorEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("error"),
	message: Type.Optional(Type.Unknown()),
	errorMessage: Type.Optional(Type.String()),
	errorKind: Type.Optional(ChatEventErrorKindSchema),
	errorDetail: Type.Optional(ChatErrorDetailSchema),
	usage: Type.Optional(Type.Unknown()),
	stopReason: Type.Optional(Type.String())
});
/** Public chat stream event union consumed by gateway protocol validators. */
const ChatEventSchema = Type.Union([
	ChatStatusEventSchema,
	ChatDeltaEventSchema,
	ChatFinalEventSchema,
	ChatAbortedEventSchema,
	ChatErrorEventSchema
]);
//#endregion
//#region packages/gateway-protocol/src/schema/sessions.ts
const SESSION_OBSERVER_HEALTH_VALUES = [
	"on-track",
	"grinding",
	"stuck",
	"waiting-on-user",
	"wrapping-up",
	"done",
	"failed"
];
/** Trajectory judgment produced for one observed agent session. */
const SessionObserverHealthSchema = Type.Union([
	Type.Literal("on-track"),
	Type.Literal("grinding"),
	Type.Literal("stuck"),
	Type.Literal("waiting-on-user"),
	Type.Literal("wrapping-up"),
	Type.Literal("done"),
	Type.Literal("failed")
]);
/** Completed and total step counts from the session's current plan. */
const SessionObserverPlanProgressSchema = closedObject({
	completed: Type.Integer({ minimum: 0 }),
	total: Type.Integer({ minimum: 0 })
});
/** Live session status judgment broadcast to subscribed operator clients. */
const SessionObserverDigestSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	lifecycleRevision: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	revision: Type.Integer({ minimum: 1 }),
	updatedAt: Type.Integer({ minimum: 0 }),
	headline: Type.String({
		minLength: 1,
		maxLength: 120
	}),
	assessment: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 320
	})),
	health: SessionObserverHealthSchema,
	planProgress: Type.Optional(SessionObserverPlanProgressSchema)
});
/** Declares whether this connection currently renders session observer output. */
const SessionsObserverVisibilityParamsSchema = closedObject({ visible: Type.Boolean() });
/** Acknowledges a connection's observer visibility declaration. */
const SessionsObserverVisibilityResultSchema = closedObject({ ok: Type.Literal(true) });
/** One bounded question/answer exchange in the ephemeral session companion. */
const SessionCompanionExchangeSchema = closedObject({
	question: Type.String({
		minLength: 1,
		maxLength: 400
	}),
	answer: Type.String({
		minLength: 1,
		maxLength: 1200
	}),
	ts: Type.Integer({ minimum: 0 })
});
/** Asks the read-only companion about one session and its workspace. */
const SessionsCompanionAskParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	question: Type.String({
		minLength: 1,
		maxLength: 400
	})
});
/** Companion answer returned only to the requesting operator. */
const SessionsCompanionAskResultSchema = closedObject({
	answer: Type.String({
		minLength: 1,
		maxLength: 1200
	}),
	ts: Type.Integer({ minimum: 0 })
});
/** Selects the in-memory companion thread for one session. */
const SessionsCompanionStateParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
/** Current bounded exchanges for one session companion thread. */
const SessionsCompanionStateResultSchema = closedObject({ exchanges: Type.Array(SessionCompanionExchangeSchema, { maxItems: 24 }) });
/** Selects the in-memory companion thread to clear. */
const SessionsCompanionResetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
/** Acknowledges clearing one companion thread. */
const SessionsCompanionResetResultSchema = closedObject({ ok: Type.Literal(true) });
closedObject({
	operationId: NonEmptyString,
	operation: Type.Literal("compact"),
	phase: Type.Union([Type.Literal("start"), Type.Literal("end")]),
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	ts: Type.Integer({ minimum: 0 }),
	completed: Type.Optional(Type.Boolean()),
	reason: Type.Optional(Type.String())
});
/** Session file grouping used by the Control UI session workspace rail. */
const SessionFileKindSchema = Type.Union([Type.Literal("modified"), Type.Literal("read")]);
/** Session relevance marker for browser entries. */
const SessionFileRelevanceSchema = Type.Union([
	Type.Literal("modified"),
	Type.Literal("read"),
	Type.Literal("mixed")
]);
/** Encoding used when a session file preview includes inline content. */
const SessionFileContentEncodingSchema = Type.Union([Type.Literal("utf8"), Type.Literal("base64")]);
/** Renderer class selected for one session workspace file preview. */
const SessionFilePreviewKindSchema = Type.Union([
	Type.Literal("text"),
	Type.Literal("image"),
	Type.Literal("unsupported")
]);
const SessionFileHashSchema = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-f0-9]{64}$"
});
/** One file path referenced by a session transcript. */
const SessionFileEntrySchema = closedObject({
	path: NonEmptyString,
	workspacePath: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	kind: SessionFileKindSchema,
	missing: Type.Boolean(),
	size: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	content: Type.Optional(Type.String()),
	hash: Type.Optional(SessionFileHashSchema),
	mimeType: Type.Optional(NonEmptyString),
	contentEncoding: Type.Optional(SessionFileContentEncodingSchema),
	previewKind: Type.Optional(SessionFilePreviewKindSchema)
});
/** One file or folder in the session-rooted browser. */
const SessionFileBrowserEntrySchema = closedObject({
	path: Type.String(),
	name: NonEmptyString,
	kind: Type.Union([Type.Literal("file"), Type.Literal("directory")]),
	sessionKind: Type.Optional(SessionFileRelevanceSchema),
	size: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Folder listing or search result rooted at the session workspace. */
const SessionFileBrowserResultSchema = closedObject({
	path: Type.String(),
	parentPath: Type.Optional(Type.String()),
	search: Type.Optional(Type.String()),
	entries: Type.Array(SessionFileBrowserEntrySchema),
	truncated: Type.Optional(Type.Boolean())
});
/** Lists files touched by a session transcript. */
const SessionsFilesListParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	path: Type.Optional(Type.String()),
	search: Type.Optional(Type.String())
});
/** File references visible in one session workspace. */
const SessionsFilesListResultSchema = closedObject({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	/** Whether the session workspace directory is inside a git checkout; absent when the workspace root is unknown or the gateway predates the field. */
	gitCheckout: Type.Optional(Type.Boolean()),
	files: Type.Array(SessionFileEntrySchema),
	browser: Type.Optional(SessionFileBrowserResultSchema)
});
/** Reads one session-referenced file by path. */
const SessionsFilesGetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	path: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
/** Result for reading one session-referenced file. */
const SessionsFilesGetResultSchema = closedObject({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	file: SessionFileEntrySchema
});
/** Overwrites one existing session workspace file with hash-based CAS. */
const SessionsFilesSetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	path: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	content: Type.String(),
	expectedHash: SessionFileHashSchema
});
/** Result for overwriting one session workspace file. */
const SessionsFilesSetResultSchema = closedObject({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	file: SessionFileEntrySchema
});
/** Opens a session workspace on the Gateway host without accepting a client path. */
const SessionsFilesRevealParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
/** Result for revealing a session workspace on the Gateway host. */
const SessionsFilesRevealResultSchema = closedObject({
	ok: Type.Boolean(),
	path: Type.Optional(NonEmptyString),
	error: Type.Optional(NonEmptyString)
});
/** Change status for one file in a session checkout diff. */
const SessionDiffFileStatusSchema = Type.Union([
	Type.Literal("added"),
	Type.Literal("modified"),
	Type.Literal("deleted"),
	Type.Literal("renamed")
]);
/** One changed file in a session checkout diff. */
const SessionDiffFileSchema = closedObject({
	path: NonEmptyString,
	oldPath: Type.Optional(NonEmptyString),
	status: SessionDiffFileStatusSchema,
	additions: Type.Integer({ minimum: 0 }),
	deletions: Type.Integer({ minimum: 0 }),
	binary: Type.Optional(Type.Boolean()),
	untracked: Type.Optional(Type.Boolean()),
	/** Per-file unified patch text; absent for binary or oversized files. */
	patch: Type.Optional(Type.String()),
	truncated: Type.Optional(Type.Boolean())
});
/** One commit shown in session diff branch metadata. */
const SessionDiffCommitSchema = closedObject({
	sha: NonEmptyString,
	subject: Type.String()
});
/** Selects the session checkout state represented by the diff. */
const SessionDiffScopeSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("uncommitted"),
	Type.Literal("commit")
]);
/** Reads the git diff of a session checkout against its base branch. */
const SessionsDiffParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	scope: Type.Optional(SessionDiffScopeSchema),
	commit: Type.Optional(NonEmptyString)
});
/** Branch + working-tree diff for one session checkout. */
const SessionsDiffResultSchema = closedObject({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	branch: Type.Optional(NonEmptyString),
	/** Display label of the diff base: the default branch name or "HEAD". */
	baseRef: Type.Optional(NonEmptyString),
	/** Number of commits between the resolved branch merge base and HEAD. */
	aheadCount: Type.Optional(Type.Integer({ minimum: 0 })),
	/** Newest-first commits between the resolved branch merge base and HEAD. */
	commits: Type.Optional(Type.Array(SessionDiffCommitSchema, { maxItems: 50 })),
	/** The resolved branch merge-base commit. */
	mergeBase: Type.Optional(SessionDiffCommitSchema),
	files: Type.Array(SessionDiffFileSchema),
	additions: Type.Integer({ minimum: 0 }),
	deletions: Type.Integer({ minimum: 0 }),
	truncated: Type.Optional(Type.Boolean()),
	unavailableReason: Type.Optional(Type.Union([
		Type.Literal("unknown_session"),
		Type.Literal("not_git"),
		Type.Literal("unknown_commit"),
		Type.Literal("workspace_stopped")
	]))
});
/** Repairs or removes invalid session records from the selected agent scope. */
const SessionsCleanupParamsSchema = closedObject({
	agent: Type.Optional(NonEmptyString),
	allAgents: Type.Optional(Type.Boolean()),
	enforce: Type.Optional(Type.Boolean()),
	activeKey: Type.Optional(NonEmptyString),
	fixMissing: Type.Optional(Type.Boolean()),
	fixDmScope: Type.Optional(Type.Boolean())
});
/** Reads short previews for selected session keys. */
const SessionsPreviewParamsSchema = closedObject({
	keys: Type.Array(NonEmptyString, { minItems: 1 }),
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	maxChars: Type.Optional(Type.Integer({ minimum: 20 }))
});
/** Describes one session and optional derived title/last-message previews. */
const SessionsDescribeParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	includeDerivedTitles: Type.Optional(Type.Boolean()),
	includeLastMessage: Type.Optional(Type.Boolean())
});
const SessionWorktreeInfoSchema = closedObject({
	id: NonEmptyString,
	path: NonEmptyString,
	branch: NonEmptyString
});
/** Result returned after creating or adopting a session. */
const SessionsCreateResultSchema = Type.Object({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: Type.Optional(NonEmptyString),
	entry: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	runStarted: Type.Optional(Type.Boolean()),
	runId: Type.Optional(NonEmptyString),
	messageSeq: Type.Optional(Type.Integer({ minimum: 1 })),
	runError: Type.Optional(ErrorShapeSchema),
	worktree: Type.Optional(SessionWorktreeInfoSchema)
}, { additionalProperties: true });
/** Sends one message into an existing session. */
const SessionsSendParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	message: Type.String(),
	mentions: Type.Optional(HumanMentionsSchema),
	thinking: Type.Optional(Type.String()),
	attachments: Type.Optional(ChatAttachmentsSchema),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	idempotencyKey: Type.Optional(NonEmptyString)
});
/** Subscribes a client to live message updates for one session. */
const SessionsMessagesSubscribeParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	/** Opt in to sanitized durable approval events for this session and its descendants. */
	includeApprovals: Type.Optional(Type.Literal(true))
});
/** Removes a live message subscription for one session. */
const SessionsMessagesUnsubscribeParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
/** Aborts the active or named run for a session. */
const SessionsAbortParamsSchema = closedObject({
	key: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	/** Also discard followup and lane queues for a key-only non-global session abort. */
	clearQueued: Type.Optional(Type.Boolean())
});
/** Updates or clears one plugin namespace value on a session record. */
const SessionsPluginPatchParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	pluginId: NonEmptyString,
	namespace: NonEmptyString,
	value: Type.Optional(PluginJsonValueSchema),
	unset: Type.Optional(Type.Boolean())
});
closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	value: Type.Optional(PluginJsonValueSchema)
});
/** Resets a session to a new or reset transcript state. */
const SessionsResetParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	reason: Type.Optional(Type.Union([Type.Literal("new"), Type.Literal("reset")])),
	expectedSessionId: Type.Optional(NonEmptyString)
});
/** Reassigns mutable session responsibility without changing provenance or sharing authority. */
const SessionsAssignOwnerParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	owner: closedObject({
		type: Type.Union([Type.Literal("agent"), Type.Literal("human")]),
		id: NonEmptyString
	})
});
const SessionsAssignOwnerResultSchema = closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	owner: SessionOwnerSchema
});
/** Lists the gateway-owned custom session group catalog (names + order). */
const SessionsGroupsListParamsSchema = closedObject({});
/** One custom session group catalog entry. */
const SessionGroupSchema = closedObject({
	name: SessionLabelString,
	position: Type.Integer({ minimum: 0 })
});
/** New Session defaults visible only to operators who can update them. */
const SessionGroupDefaultsSchema = closedObject({
	name: SessionLabelString,
	cwd: Type.Optional(NonEmptyString),
	worktree: Type.Optional(Type.Boolean())
});
const SidebarSectionIdString = Type.String({
	minLength: 1,
	maxLength: 512
});
/** Custom session group catalog in display order. */
const SessionsGroupsListResultSchema = closedObject({
	groups: Type.Array(SessionGroupSchema),
	sectionOrder: Type.Optional(Type.Array(SidebarSectionIdString))
});
/** Reads the New Session defaults for the custom group catalog. */
const SessionsGroupsDefaultsParamsSchema = closedObject({});
/** Write-scoped group defaults, kept separate from the read-scoped catalog. */
const SessionsGroupsDefaultsResultSchema = closedObject({ defaults: Type.Array(SessionGroupDefaultsSchema) });
/** Replaces the ordered group catalog; creates listed names, keeps member categories untouched. */
const SessionsGroupsPutParamsSchema = closedObject({
	names: Type.Array(SessionLabelString),
	sectionOrder: Type.Optional(Type.Array(SidebarSectionIdString))
});
/** Renames a group and repoints every member session's category. */
const SessionsGroupsRenameParamsSchema = closedObject({
	name: SessionLabelString,
	to: SessionLabelString
});
/** Updates the New Session defaults owned by one custom group. */
const SessionsGroupsUpdateParamsSchema = closedObject({
	name: SessionLabelString,
	cwd: Type.Union([NonEmptyString, Type.Null()]),
	worktree: Type.Boolean()
});
/** Result after updating defaults without widening the read-scoped catalog. */
const SessionsGroupsUpdateResultSchema = closedObject({
	ok: Type.Literal(true),
	defaults: Type.Array(SessionGroupDefaultsSchema)
});
/** Deletes a group and clears every member session's category. */
const SessionsGroupsDeleteParamsSchema = closedObject({ name: SessionLabelString });
/** Result for group catalog mutations, with member sessions updated where applicable. */
const SessionsGroupsMutationResultSchema = closedObject({
	ok: Type.Literal(true),
	groups: Type.Array(SessionGroupSchema),
	sectionOrder: Type.Optional(Type.Array(SidebarSectionIdString)),
	updatedSessions: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Requests manual compaction for a session transcript. */
const SessionsCompactParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	maxLines: Type.Optional(Type.Integer({ minimum: 1 }))
});
/** Repoints a session to the active-path state before one persisted user message. */
const SessionsRewindParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	entryId: NonEmptyString
});
/** Creates a new session from the active-path state before one persisted user message. */
const SessionsForkParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	entryId: NonEmptyString
});
const SessionEditorAttachmentSchema = closedObject({
	mimeType: Type.String(),
	data: Type.String()
});
const SessionsRewindResultSchema = closedObject({
	editorText: Type.Optional(Type.String()),
	editorAttachments: Type.Optional(Type.Array(SessionEditorAttachmentSchema))
});
const SessionsForkResultSchema = closedObject({
	sessionKey: NonEmptyString,
	editorText: Type.Optional(Type.String()),
	editorAttachments: Type.Optional(Type.Array(SessionEditorAttachmentSchema))
});
const SessionBranchSchema = closedObject({
	leafEntryId: NonEmptyString,
	headline: Type.String(),
	messageCount: Type.Integer({ minimum: 0 }),
	updatedAt: Type.Optional(NonEmptyString),
	active: Type.Boolean()
});
/** Lists transcript DAG tips available for branch switching. */
const SessionsBranchesListParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const SessionsBranchesListResultSchema = closedObject({ branches: Type.Array(SessionBranchSchema) });
/** Repoints the active transcript path to one existing DAG tip. */
const SessionsBranchesSwitchParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	leafEntryId: NonEmptyString
});
const SessionsBranchesSwitchResultSchema = closedObject({});
/** Usage report query across one session, one agent, or all agent sessions. */
const SessionsUsageParamsSchema = closedObject({
	/** Specific session key to analyze; if omitted returns sessions for the effective agent. */
	key: Type.Optional(NonEmptyString),
	/** Agent scope for list-style usage queries. */
	agentId: Type.Optional(NonEmptyString),
	/** Explicit all-agent scope for list-style usage queries. */
	agentScope: Type.Optional(Type.Literal("all")),
	/** Opaque creator identity returned by sessions.usage; filters before the row limit. */
	creatorKey: Type.Optional(NonEmptyString),
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
	includeHistorical: Type.Optional(Type.Boolean({
		deprecated: true,
		description: "Deprecated alias for groupBy: family."
	})),
	/** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */
	utcOffset: Type.Optional(Type.String({
		pattern: "^UTC[+-]\\d{1,2}(?::[0-5]\\d)?$",
		deprecated: true,
		description: "Deprecated compatibility fallback; use timeZone."
	})),
	/** IANA time zone for `specific`; preferred over `utcOffset`, which remains a compatibility fallback. */
	timeZone: Type.Optional(NonEmptyString),
	/** Maximum sessions to return (default 50). */
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	/** Include context weight breakdown (systemPromptReport). */
	includeContextWeight: Type.Optional(Type.Boolean())
});
//#endregion
export { SessionsGroupsListParamsSchema as $, PluginDiscoveryCatalogFactsSchema as $n, validatePluginsCredentialsInspectParams as $r, HelloOkSchema as $t, SessionsCompanionAskParamsSchema as A, ConfigSetParamsSchema as An, PluginsRefreshResultSchema as Ar, ChatStatusEventSchema as At, SessionsFilesGetParamsSchema as B, UpdateRunChangedEventSchema as Bn, PluginsUiDescriptorsResultSchema as Br, MENTION_INBOX_MAX_ITEMS as Bt, SessionsAssignOwnerResultSchema as C, ConfigApplyParamsSchema as Cn, PluginsInspectParamsSchema as Cr, ChatInjectParamsSchema as Ct, SessionsBranchesSwitchResultSchema as D, ConfigSchemaLookupResultSchema as Dn, PluginsListParamsSchema as Dr, ChatRunStartupPhaseSchema as Dt, SessionsBranchesSwitchParamsSchema as E, ConfigSchemaLookupParamsSchema as En, PluginsInstallResultSchema as Er, ChatPendingInputsPageSchema as Et, SessionsCompanionStateResultSchema as F, UpdateReportResultSchema as Fn, PluginsSessionActionParamsSchema as Fr, projectChatErrorDetail as Ft, SessionsFilesRevealResultSchema as G, UpdateRunsListParamsSchema as Gn, PluginHookGrantSchema as Gr, MentionsListParamsSchema as Gt, SessionsFilesListParamsSchema as H, UpdateRunResultSchema as Hn, PluginsUninstallResultSchema as Hr, MentionableUserSchema as Ht, SessionsCreateResultSchema as I, UpdateRunParamsSchema as In, PluginsSessionActionResultSchema as Ir, HumanMentionSchema as It, SessionsForkParamsSchema as J, PluginCatalogEntrySchema as Jn, PluginOperatorGrantsSchema as Jr, UsersMentionableResultSchema as Jt, SessionsFilesSetParamsSchema as K, UpdateRunsListResultSchema as Kn, PluginInspectSourceSchema as Kr, MentionsListResultSchema as Kt, SessionsDescribeParamsSchema as L, UpdateScheduleStateSchema as Ln, PluginsSetEnabledParamsSchema as Lr, HumanMentionsSchema as Lt, SessionsCompanionResetParamsSchema as M, UpdateHoldParamsSchema as Mn, PluginsReloadResultSchema as Mr, ChatToolTitlesResultSchema as Mt, SessionsCompanionResetResultSchema as N, UpdateHoldResultSchema as Nn, PluginsSearchParamsSchema as Nr, LogsTailParamsSchema as Nt, SessionsCleanupParamsSchema as O, ConfigSchemaParamsSchema as On, PluginsListResultSchema as Or, ChatSendParamsSchema as Ot, SessionsCompanionStateParamsSchema as P, UpdateReportParamsSchema as Pn, PluginsSearchResultSchema as Pr, LogsTailResultSchema as Pt, SessionsGroupsDeleteParamsSchema as Q, PluginDeclaredSurfaceWideningSchema as Qn, PluginsCredentialsInspectResultSchema as Qr, GatewayFrameSchema as Qt, SessionsDiffParamsSchema as R, UpdateStatusParamsSchema as Rn, PluginsSetEnabledResultSchema as Rr, MAX_HUMAN_MENTIONS as Rt, SessionsAssignOwnerParamsSchema as S, GatewaySuspendTaskBlockerSchema as Sn, PluginsControlUiStatusResultSchema as Sr, ChatHistoryParamsSchema as St, SessionsBranchesListResultSchema as T, ConfigPatchParamsSchema as Tn, PluginsInstallParamsSchema as Tr, ChatMetadataParamsSchema as Tt, SessionsFilesListResultSchema as U, UpdateRunsGetParamsSchema as Un, PluginDecisionProviderStatusSchema as Ur, MentionsChangedEventSchema as Ut, SessionsFilesGetResultSchema as V, UpdateRunRecordSchema as Vn, PluginsUninstallParamsSchema as Vr, MentionInboxItemSchema as Vt, SessionsFilesRevealParamsSchema as W, UpdateRunsGetResultSchema as Wn, PluginDeclaredSurfaceSchema as Wr, MentionsDismissParamsSchema as Wt, SessionsGroupsDefaultsParamsSchema as X, PluginControlUiDiagnosticSchema as Xn, PluginCredentialInspectionSchema as Xr, ErrorShapeSchema as Xt, SessionsForkResultSchema as Y, PluginCatalogInstallActionSchema as Yn, PluginCredentialDescriptorSchema as Yr, ConnectParamsSchema as Yt, SessionsGroupsDefaultsResultSchema as Z, PluginControlUiModuleSchema as Zn, PluginsCredentialsInspectParamsSchema as Zr, EventFrameSchema as Zt, SessionObserverDigestSchema as _, GatewaySuspendStatusDrainingResultSchema as _n, PluginsControlUiChangedEventSchema as _r, AgentActivityItemSchema as _t, SessionDiffFileSchema as a, SnapshotSchema as an, PluginRuntimeApplicationSchema as ar, SessionsGroupsUpdateResultSchema as at, SessionWorktreeInfoSchema as b, GatewaySuspendStatusResultSchema as bn, PluginsControlUiReportParamsSchema as br, ChatEventSchema as bt, SessionFileBrowserEntrySchema as c, GatewaySuspendHandoffParamsSchema as cn, PluginSearchResultEntrySchema as cr, SessionsObserverVisibilityParamsSchema as ct, SessionFileEntrySchema as d, GatewaySuspendPrepareDrainingResultSchema as dn, PluginsCatalogCategoriesParamsSchema as dr, SessionsPreviewParamsSchema as dt, RequestFrameSchema as en, PluginDiscoveryCategorySchema as er, SessionsGroupsListResultSchema as et, SessionFileKindSchema as f, GatewaySuspendPrepareParamsSchema as fn, PluginsCatalogCategoriesResultSchema as fr, SessionsResetParamsSchema as ft, SessionGroupSchema as g, GatewaySuspendResumeResultSchema as gn, PluginsControlUiCatalogSchema as gr, SessionsUsageParamsSchema as gt, SessionGroupDefaultsSchema as h, GatewaySuspendResumeParamsSchema as hn, PluginsChangedEventSchema as hr, SessionsSendParamsSchema as ht, SessionDiffCommitSchema as i, PresenceEntrySchema as in, PluginReloadTargetSchema as ir, SessionsGroupsUpdateParamsSchema as it, SessionsCompanionAskResultSchema as j, UpdateAvailableSchema as jn, PluginsReloadParamsSchema as jr, ChatToolTitlesParamsSchema as jt, SessionsCompactParamsSchema as k, ConfigSchemaResponseSchema as kn, PluginsRefreshParamsSchema as kr, ChatStartupParamsSchema as kt, SessionFileBrowserResultSchema as l, GatewaySuspendHandoffResultSchema as ln, PluginsCatalogBrowseParamsSchema as lr, SessionsObserverVisibilityResultSchema as lt, SessionFileRelevanceSchema as m, GatewaySuspendPrepareResultSchema as mn, PluginsCatalogGetResultSchema as mr, SessionsRewindResultSchema as mt, SessionBranchSchema as n, ShutdownEventSchema as nn, PluginDiscoveryLocalFactsSchema as nr, SessionsGroupsPutParamsSchema as nt, SessionDiffFileStatusSchema as o, StateVersionSchema as on, PluginRuntimeStatusSchema as or, SessionsMessagesSubscribeParamsSchema as ot, SessionFilePreviewKindSchema as p, GatewaySuspendPrepareReadyResultSchema as pn, PluginsCatalogGetParamsSchema as pr, SessionsRewindParamsSchema as pt, SessionsFilesSetResultSchema as q, CapabilityConsentErrorDetailsSchema as qn, PluginInstallTrustSchema as qr, UsersMentionableParamsSchema as qt, SessionCompanionExchangeSchema as r, TickEventSchema as rn, PluginJsonValueSchema as rr, SessionsGroupsRenameParamsSchema as rt, SessionDiffScopeSchema as s, GatewaySuspendBlockerSchema as sn, PluginSearchPackageSchema as sr, SessionsMessagesUnsubscribeParamsSchema as st, SESSION_OBSERVER_HEALTH_VALUES as t, ResponseFrameSchema as tn, PluginDiscoveryEntrySchema as tr, SessionsGroupsMutationResultSchema as tt, SessionFileContentEncodingSchema as u, GatewaySuspendPrepareBusyResultSchema as un, PluginsCatalogBrowseResultSchema as ur, SessionsPluginPatchParamsSchema as ut, SessionObserverHealthSchema as v, GatewaySuspendStatusParamsSchema as vn, PluginsControlUiListParamsSchema as vr, ChatAbortParamsSchema as vt, SessionsBranchesListParamsSchema as w, ConfigGetParamsSchema as wn, PluginsInspectResultSchema as wr, ChatMessageGetParamsSchema as wt, SessionsAbortParamsSchema as x, GatewaySuspendStatusRunningResultSchema as xn, PluginsControlUiStatusParamsSchema as xr, ChatHistoryActivitySchema as xt, SessionObserverPlanProgressSchema as y, GatewaySuspendStatusReadyResultSchema as yn, PluginsControlUiReloadParamsSchema as yr, ChatAttachmentsSchema as yt, SessionsDiffResultSchema as z, UpdateStatusResultSchema as zn, PluginsUiDescriptorsParamsSchema as zr, MAX_MENTIONABLE_USERS as zt };
