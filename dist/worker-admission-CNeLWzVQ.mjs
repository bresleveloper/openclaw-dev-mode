import { t as FAILOVER_REASONS } from "./failover-reasons-Mjd0tFtT.mjs";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString } from "./primitives-CYT6MDvz.mjs";
import { t as withSince } from "./since-BZlYNVYy.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXu4Ype.mjs";
import { C as workerResponseSchema, S as workerRequestSchema, b as workerErrorResponseSchema, n as LiveSequenceSchema, o as WORKER_PROTOCOL_MAX_MEDIA_PAYLOAD_BYTES, p as WorkerIdentifierSchema, r as LiveTextSchema, s as WORKER_PROTOCOL_MAX_PAYLOAD_BYTES, t as LiveIntegerSchema, v as isWorkerFrameWithinBudget, x as workerMessageSchemas, y as workerContentSchemas } from "./worker-protocol-primitives-BajTgPT4.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/worker-gateway-tool.ts
const WORKER_GATEWAY_TOOLS_PROTOCOL_FEATURE = "worker-gateway-tools-v1";
const WORKER_GATEWAY_TOOL_METHODS = {
	invoke: "worker.gatewayTool.invoke",
	cancel: "worker.gatewayTool.cancel"
};
const JsonObjectSchema = Type.Record(Type.String(), Type.Unknown());
const AgentToolSurfacePresentationSchema = closedObject({
	codeMode: closedObject({
		enabled: Type.Boolean(),
		executor: Type.Enum(["node", "quickjs"]),
		mode: Type.Literal("only"),
		timeoutMs: Type.Integer({ minimum: 1 }),
		memoryLimitBytes: Type.Integer({ minimum: 1 }),
		maxOutputBytes: Type.Integer({ minimum: 1 }),
		maxSnapshotBytes: Type.Integer({ minimum: 1 }),
		maxPendingToolCalls: Type.Integer({ minimum: 1 }),
		snapshotTtlSeconds: Type.Integer({ minimum: 1 }),
		searchDefaultLimit: Type.Integer({ minimum: 1 }),
		maxSearchLimit: Type.Integer({ minimum: 1 })
	}),
	toolSearch: closedObject({
		enabled: Type.Boolean(),
		mode: Type.Enum(["tools", "directory"]),
		searchDefaultLimit: Type.Integer({ minimum: 1 }),
		maxSearchLimit: Type.Integer({ minimum: 1 })
	}),
	forceDirectMessageTool: Type.Boolean(),
	skills: Type.Optional(Type.Array(closedObject({
		name: Type.String(),
		description: Type.String(),
		location: Type.String()
	})))
});
const WorkerToolSurfaceSchema = closedObject({
	generation: WorkerIdentifierSchema,
	presentation: AgentToolSurfacePresentationSchema,
	tools: Type.Array(closedObject({
		id: WorkerIdentifierSchema,
		execution: Type.Enum(["placement", "gateway"]),
		replay: Type.Optional(Type.Literal(true)),
		plugin: Type.Optional(closedObject({
			pluginId: WorkerIdentifierSchema,
			optional: Type.Boolean(),
			replaySafe: Type.Optional(Type.Boolean()),
			sideEffecting: Type.Optional(Type.Boolean()),
			mcp: Type.Optional(closedObject({
				serverName: Type.String(),
				safeServerName: Type.String(),
				toolName: Type.String(),
				operation: Type.Enum([
					"tool",
					"resources_list",
					"resources_read",
					"prompts_list",
					"prompts_get"
				]),
				node: Type.Optional(closedObject({
					id: WorkerIdentifierSchema,
					displayName: Type.Optional(Type.String())
				}))
			}))
		})),
		timeout: Type.Optional(closedObject({
			minimumMs: Type.Optional(Type.Integer({ minimum: 1 })),
			argument: Type.Optional(WorkerIdentifierSchema),
			defaultSeconds: Type.Optional(Type.Number({ minimum: 0 })),
			paddingMs: Type.Optional(Type.Integer({ minimum: 0 }))
		})),
		definition: closedObject({
			name: WorkerIdentifierSchema,
			label: Type.String({ maxLength: 1024 }),
			description: Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
			parameters: JsonObjectSchema,
			outputSchema: Type.Optional(JsonObjectSchema),
			hideFromChannelProgress: Type.Optional(Type.Literal(true)),
			resultContentSource: Type.Optional(Type.Literal("network")),
			executionMode: Type.Optional(Type.Enum(["sequential", "parallel"])),
			catalogMode: Type.Optional(Type.Literal("direct-only"))
		})
	}), { maxItems: 256 }),
	policy: closedObject({
		workspaceOnly: Type.Boolean(),
		readOnly: Type.Boolean(),
		applyPatchEnabled: Type.Boolean(),
		applyPatchWorkspaceOnly: Type.Boolean(),
		applyPatchContainmentSource: Type.Optional(Type.Enum([
			"config",
			"session",
			"required-root"
		])),
		modelContextWindowTokens: Type.Optional(Type.Integer({ minimum: 1 })),
		modelHasVision: Type.Optional(Type.Boolean()),
		memoryFlushWritePath: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 4096
		})),
		imageSanitization: closedObject({
			maxBytes: Type.Optional(Type.Integer({ minimum: 1 })),
			maxDimensionPx: Type.Optional(Type.Integer({ minimum: 1 }))
		})
	})
});
const WorkerGatewayToolInvokeParamsSchema = closedObject({
	generation: WorkerIdentifierSchema,
	toolId: WorkerIdentifierSchema,
	toolCallId: WorkerIdentifierSchema,
	arguments: JsonObjectSchema
});
const WorkerGatewayToolCancelParamsSchema = closedObject({
	generation: WorkerIdentifierSchema,
	toolCallId: WorkerIdentifierSchema
});
const toolContent = workerContentSchemas(LiveTextSchema, LiveTextSchema, Type.String({ maxLength: WORKER_PROTOCOL_MAX_MEDIA_PAYLOAD_BYTES }));
const WorkerGatewayToolResultSchema = closedObject({
	content: Type.Array(Type.Union([toolContent.text, toolContent.image]), { maxItems: 128 }),
	details: Type.Optional(Type.Unknown()),
	isError: Type.Optional(Type.Boolean()),
	terminate: Type.Optional(Type.Boolean()),
	progress: Type.Optional(closedObject({
		text: Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
		visibility: Type.Literal("channel"),
		privacy: Type.Literal("public"),
		id: Type.Optional(WorkerIdentifierSchema)
	}))
});
const WorkerGatewayToolCancelResultSchema = closedObject({ cancelled: Type.Boolean() });
const WorkerGatewayToolResponseFrameSchema = workerResponseSchema(WorkerGatewayToolResultSchema);
const WorkerGatewayToolCancelResponseFrameSchema = workerResponseSchema(WorkerGatewayToolCancelResultSchema);
const WorkerGatewayToolUpdateFrameSchema = closedObject({
	type: Type.Literal("event"),
	event: Type.Literal("worker.gatewayTool.update"),
	payload: closedObject({
		generation: WorkerIdentifierSchema,
		toolCallId: WorkerIdentifierSchema,
		seq: Type.Integer({
			minimum: 1,
			maximum: Number.MAX_SAFE_INTEGER
		}),
		result: WorkerGatewayToolResultSchema
	})
});
const validateWorkerGatewayToolInvokeParams = /* @__PURE__ */ lazyCompile(WorkerGatewayToolInvokeParamsSchema);
const validateWorkerGatewayToolCancelParams = /* @__PURE__ */ lazyCompile(WorkerGatewayToolCancelParamsSchema);
const validateWorkerGatewayToolUpdateFrame = /* @__PURE__ */ lazyCompile(WorkerGatewayToolUpdateFrameSchema);
function isWorkerGatewayToolFrameWithinBudget(frame, result) {
	return isWorkerFrameWithinBudget(frame, () => result?.content.flatMap((part) => part.type === "image" ? [part.data] : []) ?? []);
}
//#endregion
//#region packages/gateway-protocol/src/schema/worker-computer.ts
const WORKER_COMPUTER_PROTOCOL_FEATURE = "worker-computer-v1";
const WorkerComputerParamsSchema = closedObject({
	command: Type.Enum(["screen.snapshot", "computer.act"], { type: "string" }),
	paramsJson: Type.String({
		minLength: 2,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	}),
	timeoutMs: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 12e4
	})),
	idempotencyKey: Type.Optional(WorkerIdentifierSchema)
});
const WorkerComputerResultSchema = closedObject({ resultJson: Type.String({
	minLength: 2,
	maxLength: WORKER_PROTOCOL_MAX_MEDIA_PAYLOAD_BYTES
}) });
const WorkerComputerResponseFrameSchema = workerResponseSchema(WorkerComputerResultSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/failover-reason.ts
const failoverReasonLiteralSchemas = FAILOVER_REASONS.map((reason) => Type.Literal(reason));
/** Closed failure reasons shared by model fallback producers and protocol consumers. */
const FailoverReasonSchema = Type.Union(failoverReasonLiteralSchemas);
//#endregion
//#region packages/gateway-protocol/src/schema/presence.ts
/** Interaction signal only; identity and time belong to the authenticated live connection. */
const PresenceActivityParamsSchema = closedObject({});
const validatePresenceActivityParams = /* @__PURE__ */ lazyCompile(PresenceActivityParamsSchema);
const PresenceQueryParamsSchema = closedObject({
	action: Type.Optional(Type.Union([
		Type.Literal("list"),
		Type.Literal("person"),
		Type.Literal("device")
	], { description: "List connected people (default), inspect a person, or inspect a connected device." })),
	person: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 320,
		description: "For person: me, a returned person/profile ID, or an exact unambiguous display name."
	})),
	deviceId: Type.Optional(Type.String({
		minLength: 1,
		description: "For device: the exact presence device ID returned by this tool."
	})),
	include: Type.Optional(Type.Array(Type.Union([
		Type.Literal("devices"),
		Type.Literal("network"),
		Type.Literal("location")
	]), {
		uniqueItems: true,
		maxItems: 3,
		description: "Optional device details. Network includes IP; location includes approximate IP location without requesting GPS. Each option includes devices."
	})),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100,
		description: "Maximum people returned (default 50, maximum 100); truncation is reported."
	}))
});
const PresenceActivitySchema = closedObject({
	at: Type.Integer({ minimum: 0 }),
	source: Type.Union([
		Type.Literal("openclaw-interaction"),
		Type.Literal("app-input"),
		Type.Literal("system-input")
	]),
	deviceId: NonEmptyString
});
const PresenceLocationSchema = closedObject({
	source: Type.Literal("ip"),
	status: Type.Union([
		Type.Literal("found"),
		Type.Literal("not-found"),
		Type.Literal("unavailable")
	]),
	city: Type.Optional(NonEmptyString),
	region: Type.Optional(NonEmptyString),
	country: Type.Optional(NonEmptyString),
	countryCode: Type.Optional(NonEmptyString),
	attribution: Type.Optional(closedObject({
		text: NonEmptyString,
		url: NonEmptyString
	}))
});
const PresenceDeviceSchema = closedObject({
	id: NonEmptyString,
	nodeId: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	kind: Type.Union([Type.Literal("node"), Type.Literal("client")]),
	personIds: Type.Array(NonEmptyString),
	online: Type.Literal(true),
	activity: Type.Union([PresenceActivitySchema, Type.Null()]),
	connections: Type.Array(closedObject({
		id: NonEmptyString,
		clientId: Type.Optional(NonEmptyString),
		platform: Type.Optional(NonEmptyString),
		deviceFamily: Type.Optional(NonEmptyString),
		timeZone: Type.Optional(NonEmptyString),
		network: Type.Optional(closedObject({ ip: Type.Union([NonEmptyString, Type.Null()]) })),
		location: Type.Optional(PresenceLocationSchema)
	}))
});
const PresencePersonSchema = closedObject({
	id: NonEmptyString,
	profileId: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	online: Type.Literal(true),
	onlineSince: Type.Optional(Type.Integer({ minimum: 0 })),
	activity: Type.Union([PresenceActivitySchema, Type.Null()]),
	deviceCount: Type.Integer({ minimum: 0 }),
	devices: Type.Optional(Type.Array(PresenceDeviceSchema))
});
const PresenceQueryResultSchema = closedObject({
	observedAt: Type.Integer({ minimum: 0 }),
	status: Type.Union([
		Type.Literal("ok"),
		Type.Literal("ambiguous"),
		Type.Literal("not-found"),
		Type.Literal("identity-unavailable")
	]),
	people: Type.Array(PresencePersonSchema),
	devices: Type.Optional(Type.Array(PresenceDeviceSchema)),
	totalPeople: Type.Integer({ minimum: 0 }),
	truncated: Type.Boolean(),
	message: Type.Optional(NonEmptyString)
});
//#endregion
//#region packages/gateway-protocol/src/schema/worker-session-tools.ts
const sessionText = Type.String({
	minLength: 1,
	maxLength: 8192
});
const sessionTimeout = Type.Optional(Type.Integer({
	minimum: 0,
	maximum: 86400
}));
const PlacedSessionsSpawnSchema = closedObject({
	task: sessionText,
	label: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	agentId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	model: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	runTimeoutSeconds: sessionTimeout
});
const PlacedSessionsSendSchema = closedObject({
	sessionKey: Type.String({
		minLength: 1,
		maxLength: 1024
	}),
	message: sessionText,
	timeoutSeconds: sessionTimeout
});
const WORKER_SESSION_TOOLS_PROTOCOL_FEATURE = "worker-session-tools-v1";
const WORKER_PORTAL_PROTOCOL_FEATURE = "worker-portal-v1";
const WORKER_PRESENCE_PROTOCOL_FEATURE = "worker-presence-v1";
const WORKER_SESSION_TOOL_MAX_TEXT_LENGTH = 8192;
const WorkerSessionToolCallIdSchema = Type.String({
	minLength: 1,
	maxLength: 256
});
const WorkerSessionsSpawnParamsSchema = closedObject({
	...PlacedSessionsSpawnSchema.properties,
	toolCallId: WorkerSessionToolCallIdSchema,
	agentId: Type.Optional(WorkerIdentifierSchema)
});
const WorkerSessionsSendParamsSchema = closedObject({
	...PlacedSessionsSendSchema.properties,
	toolCallId: WorkerSessionToolCallIdSchema
});
const WorkerPortalParamsSchema = closedObject({
	toolCallId: WorkerSessionToolCallIdSchema,
	action: Type.Union([
		Type.Literal("open"),
		Type.Literal("list"),
		Type.Literal("close")
	]),
	port: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 65535
	})),
	title: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	description: Type.Optional(Type.String({ maxLength: WORKER_SESSION_TOOL_MAX_TEXT_LENGTH })),
	path: Type.Optional(Type.String({
		maxLength: 1024,
		pattern: "^/"
	})),
	id: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	}))
});
const WorkerPresenceParamsSchema = closedObject({
	toolCallId: WorkerSessionToolCallIdSchema,
	...PresenceQueryParamsSchema.properties
});
const WorkerSessionToolResultSchema = closedObject({ resultJson: Type.String({
	minLength: 2,
	maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
}) });
const WorkerSessionToolResponseFrameSchema = workerResponseSchema(WorkerSessionToolResultSchema);
const WorkerSessionsSpawnResponseFrameSchema = WorkerSessionToolResponseFrameSchema;
const WorkerSessionsSendResponseFrameSchema = WorkerSessionToolResponseFrameSchema;
const WorkerPortalResponseFrameSchema = WorkerSessionToolResponseFrameSchema;
const WorkerPresenceResponseFrameSchema = WorkerSessionToolResponseFrameSchema;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-admission.ts
const WORKER_RPC_SET_VERSION = 1;
const WORKER_BUNDLE_PREWARM_VERSION = 1;
const WORKER_HEARTBEAT_INTERVAL_MS = 15e3;
const WORKER_PROTOCOL_METHODS = [
	"worker.heartbeat",
	"worker.transcript.commit",
	"worker.live-event",
	"worker.computer",
	WORKER_GATEWAY_TOOL_METHODS.invoke,
	WORKER_GATEWAY_TOOL_METHODS.cancel
];
const WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE = "worker-transcript-commit-v1";
const WORKER_LIVE_EVENT_PROTOCOL_FEATURE = "worker-live-event-v1";
const WORKER_LAUNCH_V2_PROTOCOL_FEATURE = "worker-launch-v2";
const WORKER_EXECUTION_CONTEXT_PROTOCOL_FEATURE = "worker-execution-context-v2";
const WORKER_EXECUTION_AUTHORITY_PROTOCOL_FEATURE = "worker-execution-authority-v1";
const WORKER_LINEAGE_START_PROTOCOL_FEATURE = "worker-lineage-start-v1";
const WORKER_NATIVE_PROCESS_OWNER_PROTOCOL_FEATURE = "worker-native-process-owner-v1";
const NODE_WORKER_IDLE_RETENTION_PROTOCOL_FEATURE = "node-worker-idle-retention-v1";
const WORKER_PROTOCOL_FEATURES = [
	"skill-resources-v1",
	"worker-heartbeat-v1",
	WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE,
	WORKER_LIVE_EVENT_PROTOCOL_FEATURE,
	WORKER_EXECUTION_CONTEXT_PROTOCOL_FEATURE,
	WORKER_EXECUTION_AUTHORITY_PROTOCOL_FEATURE,
	WORKER_LINEAGE_START_PROTOCOL_FEATURE,
	WORKER_NATIVE_PROCESS_OWNER_PROTOCOL_FEATURE,
	NODE_WORKER_IDLE_RETENTION_PROTOCOL_FEATURE,
	WORKER_COMPUTER_PROTOCOL_FEATURE,
	WORKER_GATEWAY_TOOLS_PROTOCOL_FEATURE,
	"worker-inference-v1"
];
const WORKER_PROTOCOL_MAX_METHOD_LENGTH = 64;
const WORKER_PROTOCOL_MAX_FEATURES = 64;
const WORKER_PROTOCOL_MAX_FEATURE_LENGTH = 128;
const WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES = 64;
const WorkerCredentialSchema = Type.String({
	minLength: 16,
	maxLength: 256
});
const WorkerProtocolFeatureSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const WorkerBundleHashSchema = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-f0-9]{64}$"
});
/** Build identity presented by a worker before the gateway admits it. */
const WorkerAdmissionHandshakeSchema = withSince("2026.7", closedObject({
	bundleHash: WorkerBundleHashSchema,
	openclawVersion: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	protocolFeatures: Type.Array(WorkerProtocolFeatureSchema, {
		maxItems: 64,
		uniqueItems: true
	}),
	bundlePrewarm: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}))
}));
const WorkerConnectAdmissionCommonProperties = {
	environmentId: WorkerIdentifierSchema,
	credential: WorkerCredentialSchema,
	ownerEpoch: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	rpcSetVersion: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	handshake: WorkerAdmissionHandshakeSchema
};
const WorkerConnectAdmissionSchema = Type.Union([closedObject({
	...WorkerConnectAdmissionCommonProperties,
	sessionId: Type.Null(),
	runId: Type.Null()
}), closedObject({
	...WorkerConnectAdmissionCommonProperties,
	sessionId: WorkerIdentifierSchema,
	runId: WorkerIdentifierSchema
})]);
/** Dedicated first-frame payload accepted only on the worker ingress. */
const WorkerConnectParamsSchema = closedObject({
	minProtocol: Type.Integer({ minimum: 1 }),
	maxProtocol: Type.Integer({ minimum: 1 }),
	client: closedObject({
		id: Type.Literal(GATEWAY_CLIENT_IDS.WORKER),
		version: Type.String({
			minLength: 1,
			maxLength: 128
		}),
		platform: Type.String({
			minLength: 1,
			maxLength: 128
		}),
		mode: Type.Literal(GATEWAY_CLIENT_MODES.WORKER)
	}),
	role: Type.Literal("worker"),
	admission: WorkerConnectAdmissionSchema
});
const WorkerConnectRequestFrameSchema = workerRequestSchema("connect", WorkerConnectParamsSchema);
/** Minimal admission response; workers never receive the general gateway snapshot. */
const WorkerHelloOkSchema = closedObject({
	type: Type.Literal("worker-hello-ok"),
	environmentId: WorkerIdentifierSchema,
	sessionId: Type.Union([WorkerIdentifierSchema, Type.Null()]),
	ownerEpoch: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	rpcSetVersion: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	protocolFeatures: Type.Array(WorkerProtocolFeatureSchema, {
		maxItems: 64,
		uniqueItems: true
	}),
	credentialExpiresAtMs: Type.Integer({ minimum: 0 }),
	toolSurface: Type.Optional(WorkerToolSurfaceSchema),
	policy: closedObject({
		heartbeatIntervalMs: Type.Integer({ minimum: 1 }),
		maxPayload: Type.Integer({ minimum: 1 })
	})
});
const WorkerAdmissionResponseFrameSchema = workerResponseSchema(WorkerHelloOkSchema);
const WorkerStatusSchema = Type.Union([
	Type.Literal("ready"),
	Type.Literal("busy"),
	Type.Literal("draining")
]);
const WorkerHeartbeatParamsSchema = closedObject({
	sentAtMs: Type.Integer({ minimum: 0 }),
	status: WorkerStatusSchema
});
const WorkerHeartbeatResultSchema = closedObject({
	receivedAtMs: Type.Integer({ minimum: 0 }),
	status: Type.Literal("ok"),
	ownerEpoch: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
});
const WorkerHeartbeatRequestFrameSchema = workerRequestSchema(WORKER_PROTOCOL_METHODS[0], WorkerHeartbeatParamsSchema);
const WorkerHeartbeatResponseFrameSchema = workerResponseSchema(WorkerHeartbeatResultSchema);
const transcriptSchemas = workerMessageSchemas(LiveTextSchema, Type.String({
	minLength: 1,
	maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
}), Type.Integer({ minimum: 0 }));
const WorkerTranscriptUserMessageSchema = closedObject({
	role: Type.Literal("user"),
	content: transcriptSchemas.userContent,
	timestamp: Type.Integer({ minimum: 0 })
});
const WorkerTranscriptMessageSchema = Type.Union([
	WorkerTranscriptUserMessageSchema,
	transcriptSchemas.contextAssistant,
	transcriptSchemas.toolResult
]);
const WorkerTranscriptCommitParamsSchema = closedObject({
	runEpoch: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	seq: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	baseLeafId: Type.Union([WorkerIdentifierSchema, Type.Null()]),
	messages: Type.Array(WorkerTranscriptMessageSchema, {
		minItems: 1,
		maxItems: 64
	})
});
const WorkerTranscriptCommitResultSchema = closedObject({
	entryIds: Type.Array(WorkerIdentifierSchema, {
		minItems: 1,
		maxItems: 64
	}),
	newLeafId: WorkerIdentifierSchema
});
const WorkerTranscriptCommitErrorReasonSchema = Type.Enum([
	"stale-base-leaf",
	"epoch-mismatch",
	"invalid-batch",
	"session-not-attached"
]);
const WorkerTranscriptCommitErrorShapeSchema = closedObject({
	code: Type.Literal("INVALID_REQUEST"),
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	details: closedObject({ reason: WorkerTranscriptCommitErrorReasonSchema })
});
const WorkerTranscriptCommitRequestFrameSchema = workerRequestSchema(WORKER_PROTOCOL_METHODS[1], WorkerTranscriptCommitParamsSchema);
const WorkerTranscriptCommitResponseFrameSchema = workerResponseSchema(WorkerTranscriptCommitResultSchema, workerErrorResponseSchema(WorkerTranscriptCommitErrorShapeSchema));
const OptionalLiveTextSchema = Type.Optional(LiveTextSchema);
const OptionalLiveIntegerSchema = Type.Optional(LiveIntegerSchema);
const LiveIdentifierSchema = Type.String({
	minLength: 1,
	maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES,
	pattern: "^\\S(?:.*\\S)?$"
});
const WorkerLiveAssistantPayloadSchema = closedObject({
	text: LiveTextSchema,
	delta: LiveTextSchema,
	replace: Type.Optional(Type.Literal(true)),
	mediaUrls: Type.Optional(Type.Array(LiveIdentifierSchema, { maxItems: 128 })),
	phase: Type.Optional(Type.Enum(["commentary", "final_answer"])),
	itemId: Type.Optional(WorkerIdentifierSchema)
});
const WorkerLiveThinkingPayloadSchema = closedObject({
	text: LiveTextSchema,
	delta: LiveTextSchema
});
const WorkerLiveToolCommonProperties = {
	name: WorkerIdentifierSchema,
	toolCallId: WorkerIdentifierSchema,
	hideFromChannelProgress: Type.Optional(Type.Literal(true))
};
const WorkerLiveToolPayloadSchema = Type.Union([
	closedObject({
		...WorkerLiveToolCommonProperties,
		phase: Type.Literal("start"),
		args: Type.Unknown()
	}),
	closedObject({
		...WorkerLiveToolCommonProperties,
		phase: Type.Literal("update"),
		partialResult: Type.Unknown()
	}),
	closedObject({
		...WorkerLiveToolCommonProperties,
		phase: Type.Literal("result"),
		meta: OptionalLiveTextSchema,
		isError: Type.Boolean(),
		result: Type.Unknown(),
		toolErrorSummary: OptionalLiveTextSchema
	})
]);
const WorkerLiveApprovalCommonProperties = {
	kind: Type.Enum([
		"exec",
		"plugin",
		"unknown"
	]),
	title: LiveTextSchema,
	itemId: Type.Optional(WorkerIdentifierSchema),
	toolCallId: Type.Optional(WorkerIdentifierSchema),
	approvalId: Type.Optional(WorkerIdentifierSchema),
	approvalSlug: Type.Optional(WorkerIdentifierSchema),
	command: OptionalLiveTextSchema,
	host: OptionalLiveTextSchema,
	reason: OptionalLiveTextSchema,
	scope: Type.Optional(Type.Enum(["turn", "session"])),
	message: OptionalLiveTextSchema
};
const WorkerLiveApprovalPayloadSchema = Type.Union([closedObject({
	...WorkerLiveApprovalCommonProperties,
	phase: Type.Literal("requested"),
	status: Type.Enum(["pending", "unavailable"])
}), closedObject({
	...WorkerLiveApprovalCommonProperties,
	phase: Type.Literal("resolved"),
	status: Type.Enum([
		"approved",
		"denied",
		"failed"
	])
})]);
const WorkerLiveLifecycleStartPayloadSchema = closedObject({
	phase: Type.Literal("start"),
	startedAt: LiveIntegerSchema
});
const WorkerLiveFallbackAttemptSchema = closedObject({
	provider: LiveIdentifierSchema,
	model: LiveIdentifierSchema,
	error: LiveTextSchema,
	reason: Type.Optional(FailoverReasonSchema),
	authMode: Type.Optional(LiveIdentifierSchema),
	status: OptionalLiveIntegerSchema,
	code: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	}))
});
const WorkerLiveFallbackCommonProperties = {
	selectedProvider: LiveIdentifierSchema,
	selectedModel: LiveIdentifierSchema,
	activeProvider: LiveIdentifierSchema,
	activeModel: LiveIdentifierSchema
};
const WorkerLiveLifecycleFallbackPayloadSchema = closedObject({
	...WorkerLiveFallbackCommonProperties,
	phase: Type.Literal("fallback"),
	reasonSummary: LiveTextSchema,
	attemptSummaries: Type.Array(LiveTextSchema, { maxItems: 128 }),
	attempts: Type.Array(WorkerLiveFallbackAttemptSchema, { maxItems: 128 })
});
const WorkerLiveLifecycleFallbackClearedPayloadSchema = closedObject({
	...WorkerLiveFallbackCommonProperties,
	phase: Type.Literal("fallback_cleared"),
	previousActiveModel: Type.Optional(LiveIdentifierSchema)
});
const WorkerLiveLifecycleFallbackStepPayloadSchema = closedObject({
	phase: Type.Literal("fallback_step"),
	fallbackStepType: Type.Literal("fallback_step"),
	fallbackStepFromModel: LiveIdentifierSchema,
	fallbackStepToModel: Type.Optional(LiveIdentifierSchema),
	fallbackStepFromFailureReason: Type.Optional(FailoverReasonSchema),
	fallbackStepFromFailureDetail: OptionalLiveTextSchema,
	fallbackStepChainPosition: OptionalLiveIntegerSchema,
	fallbackStepFinalOutcome: Type.Enum([
		"next_fallback",
		"succeeded",
		"chain_exhausted"
	])
});
const WorkerLiveLifecycleTerminalCommonProperties = {
	startedAt: OptionalLiveIntegerSchema,
	endedAt: LiveIntegerSchema,
	stopReason: Type.Optional(WorkerIdentifierSchema),
	yielded: Type.Optional(Type.Literal(true)),
	timeoutPhase: Type.Optional(Type.Enum([
		"queue",
		"preflight",
		"provider",
		"post_turn",
		"gateway_draining"
	])),
	providerStarted: Type.Optional(Type.Boolean()),
	aborted: Type.Optional(Type.Boolean()),
	toolErrorSummary: OptionalLiveTextSchema,
	livenessState: Type.Optional(Type.Enum([
		"working",
		"paused",
		"blocked",
		"abandoned"
	])),
	replayInvalid: Type.Optional(Type.Literal(true))
};
const WorkerLiveLifecycleTerminalPayloadSchema = Type.Union([
	closedObject({
		...WorkerLiveLifecycleTerminalCommonProperties,
		phase: Type.Literal("finishing"),
		error: OptionalLiveTextSchema
	}),
	closedObject({
		...WorkerLiveLifecycleTerminalCommonProperties,
		phase: Type.Literal("end")
	}),
	closedObject({
		...WorkerLiveLifecycleTerminalCommonProperties,
		phase: Type.Literal("error"),
		error: LiveTextSchema,
		fallbackExhaustedFailure: Type.Optional(Type.Literal(true))
	})
]);
const WorkerLiveLifecyclePayloadSchema = Type.Union([
	WorkerLiveLifecycleStartPayloadSchema,
	WorkerLiveLifecycleFallbackPayloadSchema,
	WorkerLiveLifecycleFallbackClearedPayloadSchema,
	WorkerLiveLifecycleFallbackStepPayloadSchema,
	WorkerLiveLifecycleTerminalPayloadSchema
]);
const WorkerLiveEventSchema = Type.Union([
	closedObject({
		kind: Type.Literal("assistant"),
		payload: WorkerLiveAssistantPayloadSchema
	}),
	closedObject({
		kind: Type.Literal("thinking"),
		payload: WorkerLiveThinkingPayloadSchema
	}),
	closedObject({
		kind: Type.Literal("tool"),
		payload: WorkerLiveToolPayloadSchema
	}),
	closedObject({
		kind: Type.Literal("approval"),
		payload: WorkerLiveApprovalPayloadSchema
	}),
	closedObject({
		kind: Type.Literal("lifecycle"),
		payload: WorkerLiveLifecyclePayloadSchema
	})
]);
const WorkerLiveEventParamsSchema = closedObject({
	runEpoch: LiveIntegerSchema,
	lastAckedSeq: LiveIntegerSchema,
	seq: LiveSequenceSchema,
	runId: WorkerIdentifierSchema,
	event: WorkerLiveEventSchema
});
const WorkerLiveEventResultSchema = closedObject({ ackedSeq: LiveIntegerSchema });
const WorkerLiveEventErrorDetailsSchema = Type.Union([closedObject({ reason: Type.Enum([
	"epoch-mismatch",
	"session-not-attached",
	"invalid-event",
	"capacity-exceeded"
]) }), closedObject({
	reason: Type.Literal("resync-required"),
	ackedSeq: LiveIntegerSchema,
	expectedSeq: LiveSequenceSchema
})]);
const WorkerLiveEventErrorShapeSchema = closedObject({
	code: Type.Literal("INVALID_REQUEST"),
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	details: WorkerLiveEventErrorDetailsSchema
});
const WorkerLiveEventRequestFrameSchema = workerRequestSchema(WORKER_PROTOCOL_METHODS[2], WorkerLiveEventParamsSchema);
const WorkerLiveEventResponseFrameSchema = workerResponseSchema(WorkerLiveEventResultSchema, workerErrorResponseSchema(WorkerLiveEventErrorShapeSchema));
//#endregion
export { WorkerSessionsSpawnParamsSchema as $, WorkerLiveEventSchema as A, PlacedSessionsSpawnSchema as B, WorkerHeartbeatResponseFrameSchema as C, isWorkerGatewayToolFrameWithinBudget as Ct, WorkerLiveEventRequestFrameSchema as D, WorkerLiveEventParamsSchema as E, validateWorkerGatewayToolUpdateFrame as Et, WorkerTranscriptCommitResponseFrameSchema as F, WorkerPortalParamsSchema as G, WORKER_PRESENCE_PROTOCOL_FEATURE as H, WorkerTranscriptCommitResultSchema as I, WorkerPresenceResponseFrameSchema as J, WorkerPortalResponseFrameSchema as K, WorkerTranscriptMessageSchema as L, WorkerTranscriptCommitErrorShapeSchema as M, WorkerTranscriptCommitParamsSchema as N, WorkerLiveEventResponseFrameSchema as O, WorkerTranscriptCommitRequestFrameSchema as P, WorkerSessionsSendResponseFrameSchema as Q, WorkerTranscriptUserMessageSchema as R, WorkerHeartbeatRequestFrameSchema as S, WorkerToolSurfaceSchema as St, WorkerLiveEventErrorShapeSchema as T, validateWorkerGatewayToolInvokeParams as Tt, WORKER_SESSION_TOOLS_PROTOCOL_FEATURE as U, WORKER_PORTAL_PROTOCOL_FEATURE as V, WORKER_SESSION_TOOL_MAX_TEXT_LENGTH as W, WorkerSessionToolResultSchema as X, WorkerSessionToolResponseFrameSchema as Y, WorkerSessionsSendParamsSchema as Z, WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES as _, WorkerGatewayToolCancelResultSchema as _t, WORKER_HEARTBEAT_INTERVAL_MS as a, PresenceQueryResultSchema as at, WorkerConnectRequestFrameSchema as b, WorkerGatewayToolResultSchema as bt, WORKER_LIVE_EVENT_PROTOCOL_FEATURE as c, WORKER_COMPUTER_PROTOCOL_FEATURE as ct, WORKER_PROTOCOL_MAX_FEATURES as d, WorkerComputerResultSchema as dt, WorkerSessionsSpawnResponseFrameSchema as et, WORKER_PROTOCOL_MAX_FEATURE_LENGTH as f, AgentToolSurfacePresentationSchema as ft, WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE as g, WorkerGatewayToolCancelResponseFrameSchema as gt, WORKER_RPC_SET_VERSION as h, WorkerGatewayToolCancelParamsSchema as ht, WORKER_EXECUTION_CONTEXT_PROTOCOL_FEATURE as i, PresenceQueryParamsSchema as it, WorkerTranscriptCommitErrorReasonSchema as j, WorkerLiveEventResultSchema as k, WORKER_NATIVE_PROCESS_OWNER_PROTOCOL_FEATURE as l, WorkerComputerParamsSchema as lt, WORKER_PROTOCOL_METHODS as m, WORKER_GATEWAY_TOOL_METHODS as mt, WORKER_BUNDLE_PREWARM_VERSION as n, PresenceLocationSchema as nt, WORKER_LAUNCH_V2_PROTOCOL_FEATURE as o, validatePresenceActivityParams as ot, WORKER_PROTOCOL_MAX_METHOD_LENGTH as p, WORKER_GATEWAY_TOOLS_PROTOCOL_FEATURE as pt, WorkerPresenceParamsSchema as q, WORKER_EXECUTION_AUTHORITY_PROTOCOL_FEATURE as r, PresencePersonSchema as rt, WORKER_LINEAGE_START_PROTOCOL_FEATURE as s, FailoverReasonSchema as st, NODE_WORKER_IDLE_RETENTION_PROTOCOL_FEATURE as t, PresenceDeviceSchema as tt, WORKER_PROTOCOL_FEATURES as u, WorkerComputerResponseFrameSchema as ut, WorkerAdmissionHandshakeSchema as v, WorkerGatewayToolInvokeParamsSchema as vt, WorkerLiveEventErrorDetailsSchema as w, validateWorkerGatewayToolCancelParams as wt, WorkerHeartbeatParamsSchema as x, WorkerGatewayToolUpdateFrameSchema as xt, WorkerAdmissionResponseFrameSchema as y, WorkerGatewayToolResponseFrameSchema as yt, PlacedSessionsSendSchema as z };
